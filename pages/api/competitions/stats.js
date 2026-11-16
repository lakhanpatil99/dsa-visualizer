import withAuth from '../../../lib/auth.js';
import dbConnect from '../../../lib/dbConnect.js';
import CompetitionAchievement, { ACHIEVEMENT_THRESHOLDS } from '../../../models/CompetitionAchievement.js';
import memoryStore from '../../../lib/memoryStore.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const user = req.user;
  let isConnected = false;
  try {
    const conn = await dbConnect();
    if (conn && conn.connection && conn.connection.readyState === 1) isConnected = true;
  } catch {}

  let achievement = null;
  if (isConnected) {
    achievement = await CompetitionAchievement.findOne({ firebaseUid: user.uid });
  } else {
    achievement = memoryStore.getAchievement(user.uid);
  }

  const uniqueSolvedCount = achievement?.uniqueSolvedCount || achievement?.solvedChallengeIds?.length || 0;
  const unlockedTiers = achievement?.unlockedTiers || [];
  const solvedChallengeIds = achievement?.solvedChallengeIds || [];

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
      badges
    }
  });
}

export default withAuth(handler, { requireEmailVerified: true });
