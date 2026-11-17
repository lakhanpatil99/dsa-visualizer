import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import CompetitionSubmission from '../../../models/CompetitionSubmission.js';
import memoryStore from '../../../lib/memoryStore.js';
import { getChallengeById } from '../../../lib/competitions/challengesData.js';
import { executeChallengeCode } from '../../../lib/competitions/codeRunner.js';
import { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import { COMPETITION_CHALLENGES } from '../../../lib/competitions/challengesData.js';
import { ensureCompetitionMilestoneCertificates } from '../../../lib/certificates/competitionMilestoneIssuance.js';
import crypto from 'crypto';

const MILESTONES = [
  { tier: 'bronze', count: ACHIEVEMENT_THRESHOLDS.BRONZE },
  { tier: 'silver', count: ACHIEVEMENT_THRESHOLDS.SILVER },
  { tier: 'gold', count: ACHIEVEMENT_THRESHOLDS.GOLD }
];

async function getSolvedIds(userId, connected) {
  if (connected) {
    return CompetitionSubmission.distinct('challengeId', {
      firebaseUid: userId,
      status: 'ACCEPTED'
    });
  }

  return [...new Set(
    memoryStore.getSubmissionsByUser(userId)
      .filter((submission) => submission.status === 'ACCEPTED')
      .map((submission) => submission.challengeId)
  )];
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { challengeId, code, language = 'javascript' } = req.body || {};

  if (typeof challengeId !== 'string' || !challengeId.trim()) {
    return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return res.status(404).json({ success: false, message: 'Challenge not found.' });
  }

  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ success: false, message: 'Source code is required.' });
  }

  let connected = false;
  try {
    const connection = await dbConnect();
    connected = Boolean(connection?.connection?.readyState === 1);
  } catch (error) {
    console.warn('[CompetitionSubmit] Database connection failed:', error?.message || 'Unknown error');
  }

  if (process.env.NODE_ENV === 'production' && !connected) {
    return res.status(503).json({
      success: false,
      code: 'SERVICE_UNAVAILABLE',
      message: 'Competition progress storage is temporarily unavailable. Your code was not submitted; please retry.'
    });
  }

  let solvedBefore = [];
  try {
    solvedBefore = await getSolvedIds(user.uid, connected);
  } catch (error) {
    console.error('[CompetitionSubmit] Unable to read existing progress:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'PROGRESS_LOOKUP_UNAVAILABLE',
      message: 'Your existing competition progress could not be checked. Please retry.'
    });
  }

  const execResult = await executeChallengeCode(
    code,
    challenge.functionName || 'solve',
    challenge.testCases,
    1500
  );

  const submissionDoc = {
    submissionId: `SUB-${Date.now()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
    firebaseUid: user.uid,
    userEmail: user.email,
    challengeId,
    code,
    language,
    status: execResult.status,
    passedTestCases: execResult.passedTestCases,
    totalTestCases: execResult.totalTestCases,
    executionTimeMs: execResult.executionTimeMs,
    errorMessage: execResult.errorMessage,
    submittedAt: new Date()
  };

  try {
    if (connected) {
      await CompetitionSubmission.create(submissionDoc);
    } else {
      memoryStore.saveSubmission(submissionDoc);
    }

    const solvedAfter = await getSolvedIds(user.uid, connected);
    const uniqueSolvedCount = solvedAfter.length;
    const unlockedTiers = MILESTONES
      .filter((milestone) => uniqueSolvedCount >= milestone.count)
      .map((milestone) => milestone.tier);
    const newlyUnlockedTiers = MILESTONES
      .filter((milestone) =>
        solvedBefore.length < milestone.count && uniqueSolvedCount >= milestone.count
      )
      .map((milestone) => milestone.tier);

    // A genuine accepted submission may cross a competition threshold.
    // Issue the corresponding permanent credential internally, using the
    // verified DB identity and an idempotent MongoDB source key.
    let certificateIssuancePending = false;
    if (connected && execResult.status === 'ACCEPTED') {
      try {
        await ensureCompetitionMilestoneCertificates({
          firebaseUid: user.uid,
          userEmail: user.email,
          recipientName: req.dbUser?.displayName || req.dbUser?.username || user.name,
          uniqueSolvedCount
        });
      } catch (issuanceError) {
        certificateIssuancePending = true;
        console.error('[CompetitionSubmit] Automatic milestone issuance deferred:', issuanceError?.message || 'Unknown error');
      }
    }

    return res.status(200).json({
      success: true,
      result: execResult,
      submissionId: submissionDoc.submissionId,
      newlyUnlockedTiers,
      uniqueSolvedCount,
      solvedChallengeIds: solvedAfter,
      unlockedTiers,
      certificateIssuancePending,
      totalChallenges: COMPETITION_CHALLENGES.length,
      progressUpdatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[CompetitionSubmit] Failed to persist or reconcile submission:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'SUBMISSION_PERSISTENCE_FAILED',
      message: 'The submission could not be synchronized with your progress. Please retry.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
