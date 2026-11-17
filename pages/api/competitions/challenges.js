import { COMPETITION_CHALLENGES } from '../../../lib/competitions/challengesData.js';
import { extractBearerToken, verifyIdToken } from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import CompetitionSubmission from '../../../models/CompetitionSubmission.js';
import memoryStore from '../../../lib/memoryStore.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const publicChallenges = COMPETITION_CHALLENGES.map((challenge) => ({
    challengeId: challenge.challengeId,
    title: challenge.title,
    slug: challenge.slug,
    category: challenge.category,
    difficulty: challenge.difficulty,
    points: challenge.points,
    description: challenge.description,
    constraints: challenge.constraints,
    examples: challenge.examples,
    starterCode: challenge.starterCode,
    functionName: challenge.functionName,
    publicTestCases: challenge.testCases.filter((testCase) => !testCase.isHidden),
    order: challenge.order
  }));

  const token = extractBearerToken(req);
  let solvedIds = new Set();
  let progressAvailable = !token;
  let progressMessage = token ? '' : 'Sign in to synchronize your personal solved state.';

  if (token) {
    let decoded;
    try {
      decoded = await verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_SESSION',
        message: 'Your session could not be verified. Please sign in again.'
      });
    }

    if (!decoded?.uid) {
      return res.status(401).json({ success: false, code: 'INVALID_SESSION', message: 'Invalid user session.' });
    }

    try {
      const connection = await dbConnect();
      let solvedChallengeIds = [];

      if (connection?.connection?.readyState === 1) {
        solvedChallengeIds = await CompetitionSubmission.distinct('challengeId', {
          firebaseUid: decoded.uid,
          status: 'ACCEPTED'
        });
      } else if (process.env.NODE_ENV !== 'production') {
        solvedChallengeIds = [...new Set(
          memoryStore.getSubmissionsByUser(decoded.uid)
            .filter((submission) => submission.status === 'ACCEPTED')
            .map((submission) => submission.challengeId)
        )];
      } else {
        throw new Error('Competition database is unavailable.');
      }

      solvedIds = new Set(solvedChallengeIds);
      progressAvailable = true;
    } catch (error) {
      // Keep the public challenge catalogue available, but do not mark every
      // challenge as unsolved when the user's real progress cannot be read.
      progressAvailable = false;
      progressMessage = 'Challenge catalogue loaded. Personal progress could not be synchronized; retry shortly.';
      console.error('[CompetitionChallenges] Progress lookup unavailable:', error?.message || 'Unknown error');
    }
  }

  const annotated = publicChallenges.map((challenge) => ({
    ...challenge,
    isSolved: progressAvailable && token ? solvedIds.has(challenge.challengeId) : token ? null : false
  }));

  return res.status(200).json({
    success: true,
    challenges: annotated,
    challengeCount: annotated.length,
    progressAvailable,
    progressMessage,
    updatedAt: new Date().toISOString()
  });
}
