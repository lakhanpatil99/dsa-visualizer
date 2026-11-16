import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import CompetitionSubmission from '../../../models/CompetitionSubmission.js';
import CompetitionAchievement, { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import memoryStore from '../../../lib/memoryStore.js';
import { getChallengeById } from '../../../lib/competitions/challengesData.js';
import { executeChallengeCode } from '../../../lib/competitions/codeRunner.js';
import crypto from 'crypto';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  const { challengeId, code, language = 'javascript' } = req.body || {};

  if (!challengeId || typeof challengeId !== 'string') {
    return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return res.status(404).json({ success: false, message: 'Challenge not found.' });
  }

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Source code is required.' });
  }

  // Execute against all test cases (both public and hidden)
  const execResult = await executeChallengeCode(
    code,
    challenge.functionName || 'solve',
    challenge.testCases,
    1500
  );

  const submissionId = `SUB-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  const submissionDoc = {
    submissionId,
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

  // Persist submission
  if (isConnected) {
    await CompetitionSubmission.create(submissionDoc);
  } else {
    memoryStore.saveSubmission(submissionDoc);
  }

  // Update achievements only on genuine ACCEPTED result
  let newlyUnlockedTiers = [];
  let updatedAchievement = null;

  if (execResult.status === 'ACCEPTED') {
    if (isConnected) {
      let ach = await CompetitionAchievement.findOne({ firebaseUid: user.uid });
      if (!ach) {
        ach = new CompetitionAchievement({
          firebaseUid: user.uid,
          userEmail: user.email,
          solvedChallengeIds: [],
          uniqueSolvedCount: 0,
          unlockedTiers: []
        });
      }

      const solvedSet = new Set(ach.solvedChallengeIds || []);
      const wasAlreadySolved = solvedSet.has(challengeId);

      if (!wasAlreadySolved) {
        solvedSet.add(challengeId);
        ach.solvedChallengeIds = Array.from(solvedSet);
        ach.uniqueSolvedCount = ach.solvedChallengeIds.length;

        // Check Milestone Thresholds
        const currentCount = ach.uniqueSolvedCount;
        const tiers = new Set(ach.unlockedTiers || []);

        if (currentCount >= ACHIEVEMENT_THRESHOLDS.BRONZE && !tiers.has('bronze')) {
          tiers.add('bronze');
          ach.bronzeUnlockedAt = new Date();
          newlyUnlockedTiers.push('bronze');
        }
        if (currentCount >= ACHIEVEMENT_THRESHOLDS.SILVER && !tiers.has('silver')) {
          tiers.add('silver');
          ach.silverUnlockedAt = new Date();
          newlyUnlockedTiers.push('silver');
        }
        if (currentCount >= ACHIEVEMENT_THRESHOLDS.GOLD && !tiers.has('gold')) {
          tiers.add('gold');
          ach.goldUnlockedAt = new Date();
          newlyUnlockedTiers.push('gold');
        }

        ach.unlockedTiers = Array.from(tiers);
        await ach.save();
      }
      updatedAchievement = ach;
    } else {
      let ach = memoryStore.getAchievement(user.uid);
      if (!ach) {
        ach = {
          firebaseUid: user.uid,
          userEmail: user.email,
          solvedChallengeIds: [],
          uniqueSolvedCount: 0,
          unlockedTiers: []
        };
      }

      const solvedSet = new Set(ach.solvedChallengeIds || []);
      const wasAlreadySolved = solvedSet.has(challengeId);

      if (!wasAlreadySolved) {
        solvedSet.add(challengeId);
        ach.solvedChallengeIds = Array.from(solvedSet);
        ach.uniqueSolvedCount = ach.solvedChallengeIds.length;

        const currentCount = ach.uniqueSolvedCount;
        const tiers = new Set(ach.unlockedTiers || []);

        if (currentCount >= ACHIEVEMENT_THRESHOLDS.BRONZE && !tiers.has('bronze')) {
          tiers.add('bronze');
          ach.bronzeUnlockedAt = new Date();
          newlyUnlockedTiers.push('bronze');
        }
        if (currentCount >= ACHIEVEMENT_THRESHOLDS.SILVER && !tiers.has('silver')) {
          tiers.add('silver');
          ach.silverUnlockedAt = new Date();
          newlyUnlockedTiers.push('silver');
        }
        if (currentCount >= ACHIEVEMENT_THRESHOLDS.GOLD && !tiers.has('gold')) {
          tiers.add('gold');
          ach.goldUnlockedAt = new Date();
          newlyUnlockedTiers.push('gold');
        }

        ach.unlockedTiers = Array.from(tiers);
        memoryStore.saveAchievement(ach);
      }
      updatedAchievement = ach;
    }
  }

  return res.status(200).json({
    success: true,
    result: execResult,
    submissionId,
    newlyUnlockedTiers,
    uniqueSolvedCount: updatedAchievement?.uniqueSolvedCount || 0,
    unlockedTiers: updatedAchievement?.unlockedTiers || []
  });
}

export default withAuth(handler, { requireEmailVerified: true });
