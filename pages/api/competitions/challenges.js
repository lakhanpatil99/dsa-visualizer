import { COMPETITION_CHALLENGES } from '../../../lib/competitions/challengesData.js';
import { extractBearerToken, verifyIdToken } from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import CompetitionAchievement from '../../../models/CompetitionAchievement.js';
import memoryStore from '../../../lib/memoryStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Sanitize challenges: omit hidden test cases from public endpoint
  const publicChallenges = COMPETITION_CHALLENGES.map(c => ({
    challengeId: c.challengeId,
    title: c.title,
    slug: c.slug,
    category: c.category,
    difficulty: c.difficulty,
    points: c.points,
    description: c.description,
    constraints: c.constraints,
    examples: c.examples,
    starterCode: c.starterCode,
    functionName: c.functionName,
    publicTestCases: c.testCases.filter(tc => !tc.isHidden),
    order: c.order
  }));

  // Optional authenticated context to flag solved challenges
  let solvedIds = new Set();
  const token = extractBearerToken(req);
  if (token) {
    try {
      const decoded = await verifyIdToken(token);
      if (decoded && decoded.uid) {
        let isConnected = false;
        try {
          const conn = await dbConnect();
          if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
        } catch {}

        if (isConnected) {
          const ach = await CompetitionAchievement.findOne({ firebaseUid: decoded.uid });
          if (ach && ach.solvedChallengeIds) {
            solvedIds = new Set(ach.solvedChallengeIds);
          }
        } else {
          const ach = memoryStore.getAchievement(decoded.uid);
          if (ach && ach.solvedChallengeIds) {
            solvedIds = new Set(ach.solvedChallengeIds);
          }
        }
      }
    } catch {}
  }

  const annotated = publicChallenges.map(c => ({
    ...c,
    isSolved: solvedIds.has(c.challengeId)
  }));

  return res.status(200).json({
    success: true,
    challenges: annotated
  });
}
