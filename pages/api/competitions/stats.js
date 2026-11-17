import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import CompetitionSubmission from '../../../models/CompetitionSubmission.js';
import CompetitionAchievement, { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import memoryStore from '../../../lib/memoryStore.js';
import { COMPETITION_CHALLENGES } from '../../../lib/competitions/challengesData.js';

function getMilestones(uniqueSolvedCount) {
  const unlockedTiers = [];
  if (uniqueSolvedCount >= ACHIEVEMENT_THRESHOLDS.BRONZE) unlockedTiers.push('bronze');
  if (uniqueSolvedCount >= ACHIEVEMENT_THRESHOLDS.SILVER) unlockedTiers.push('silver');
  if (uniqueSolvedCount >= ACHIEVEMENT_THRESHOLDS.GOLD) unlockedTiers.push('gold');

  let nextMilestone = {
    tier: 'bronze',
    target: ACHIEVEMENT_THRESHOLDS.BRONZE,
    remaining: Math.max(0, ACHIEVEMENT_THRESHOLDS.BRONZE - uniqueSolvedCount)
  };

  if (uniqueSolvedCount >= ACHIEVEMENT_THRESHOLDS.GOLD) {
    nextMilestone = {
      tier: 'gold_master',
      target: ACHIEVEMENT_THRESHOLDS.GOLD,
      remaining: 0,
      achieved: true
    };
  } else if (uniqueSolvedCount >= ACHIEVEMENT_THRESHOLDS.SILVER) {
    nextMilestone = {
      tier: 'gold',
      target: ACHIEVEMENT_THRESHOLDS.GOLD,
      remaining: ACHIEVEMENT_THRESHOLDS.GOLD - uniqueSolvedCount
    };
  } else if (uniqueSolvedCount >= ACHIEVEMENT_THRESHOLDS.BRONZE) {
    nextMilestone = {
      tier: 'silver',
      target: ACHIEVEMENT_THRESHOLDS.SILVER,
      remaining: ACHIEVEMENT_THRESHOLDS.SILVER - uniqueSolvedCount
    };
  }

  return { unlockedTiers, nextMilestone };
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const connection = await dbConnect();
    let solvedChallengeIds = [];
    let achievement = null;

    if (connection?.connection?.readyState === 1) {
      // Accepted submission documents are the canonical source. Distinct removes
      // duplicate attempts for the same challenge and excludes failed attempts.
      solvedChallengeIds = await CompetitionSubmission.distinct('challengeId', {
        firebaseUid: req.user.uid,
        status: 'ACCEPTED'
      });
      achievement = await CompetitionAchievement.findOne({ firebaseUid: req.user.uid })
        .select('bronzeUnlockedAt silverUnlockedAt goldUnlockedAt')
        .lean();
    } else if (process.env.NODE_ENV !== 'production') {
      solvedChallengeIds = [...new Set(
        memoryStore.getSubmissionsByUser(req.user.uid)
          .filter((submission) => submission.status === 'ACCEPTED')
          .map((submission) => submission.challengeId)
      )];
      achievement = memoryStore.getAchievement(req.user.uid);
    } else {
      throw new Error('Competition database is unavailable.');
    }

    const uniqueSolvedCount = solvedChallengeIds.length;
    const { unlockedTiers, nextMilestone } = getMilestones(uniqueSolvedCount);
    const badges = [
      {
        tier: 'bronze',
        name: 'Bronze Algorist',
        threshold: ACHIEVEMENT_THRESHOLDS.BRONZE,
        unlocked: unlockedTiers.includes('bronze'),
        unlockedAt: achievement?.bronzeUnlockedAt || null
      },
      {
        tier: 'silver',
        name: 'Silver Grandmaster',
        threshold: ACHIEVEMENT_THRESHOLDS.SILVER,
        unlocked: unlockedTiers.includes('silver'),
        unlockedAt: achievement?.silverUnlockedAt || null
      },
      {
        tier: 'gold',
        name: 'Gold Algorithm Master',
        threshold: ACHIEVEMENT_THRESHOLDS.GOLD,
        unlocked: unlockedTiers.includes('gold'),
        unlockedAt: achievement?.goldUnlockedAt || null
      }
    ];

    return res.status(200).json({
      success: true,
      stats: {
        uniqueSolvedCount,
        solvedChallengeIds,
        unlockedTiers,
        nextMilestone,
        badges,
        totalChallenges: COMPETITION_CHALLENGES.length,
        calculatedFrom: 'UNIQUE_ACCEPTED_SUBMISSIONS',
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[CompetitionStats] Unable to load authoritative progress:', error?.message || 'Unknown error');
    return res.status(503).json({
      success: false,
      code: 'COMPETITION_PROGRESS_UNAVAILABLE',
      message: 'Your competition progress is temporarily unavailable. Your accepted submissions are safe. Please retry shortly.'
    });
  }
}

export default withAuth(handler, { requireEmailVerified: true });
