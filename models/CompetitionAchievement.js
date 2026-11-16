import mongoose from 'mongoose';

const CompetitionAchievementSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  solvedChallengeIds: {
    type: [String],
    default: []
  },
  uniqueSolvedCount: {
    type: Number,
    default: 0,
    index: true
  },
  unlockedTiers: {
    type: [String],
    enum: ['bronze', 'silver', 'gold'],
    default: []
  },
  bronzeUnlockedAt: {
    type: Date,
    default: null
  },
  silverUnlockedAt: {
    type: Date,
    default: null
  },
  goldUnlockedAt: {
    type: Date,
    default: null
  },
  tierPaymentStatus: {
    bronze: {
      type: String,
      enum: ['NOT_CONFIGURED', 'NOT_STARTED', 'PENDING', 'VERIFICATION_REQUIRED', 'PAID_VERIFIED', 'FAILED', 'REFUNDED'],
      default: 'NOT_CONFIGURED'
    },
    silver: {
      type: String,
      enum: ['NOT_CONFIGURED', 'NOT_STARTED', 'PENDING', 'VERIFICATION_REQUIRED', 'PAID_VERIFIED', 'FAILED', 'REFUNDED'],
      default: 'NOT_CONFIGURED'
    },
    gold: {
      type: String,
      enum: ['NOT_CONFIGURED', 'NOT_STARTED', 'PENDING', 'VERIFICATION_REQUIRED', 'PAID_VERIFIED', 'FAILED', 'REFUNDED'],
      default: 'NOT_CONFIGURED'
    }
  },
  tierCertificateId: {
    bronze: { type: String, default: null },
    silver: { type: String, default: null },
    gold: { type: String, default: null }
  }
}, {
  timestamps: true
});

export const ACHIEVEMENT_THRESHOLDS = {
  BRONZE: 20,
  SILVER: 100,
  GOLD: 200
};

export default mongoose.models.CompetitionAchievement || mongoose.model('CompetitionAchievement', CompetitionAchievementSchema);
