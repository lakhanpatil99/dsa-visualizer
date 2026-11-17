import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Stable issuance source key prevents duplicate credentials for the same eligible source record.
  // Sparse uniqueness preserves compatibility with already-issued historical certificates.
  sourceKey: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  firebaseUid: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  recipientName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['internship', 'competition_bronze', 'competition_silver', 'competition_gold'],
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    default: null
  },
  tier: {
    type: String,
    default: null
  },
  milestoneCount: {
    type: Number,
    default: null
  },
  duration: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  issueDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['VALID', 'REVOKED'],
    default: 'VALID',
    index: true
  },
  revokedReason: {
    type: String,
    default: ''
  },
  revokedAt: {
    type: Date,
    default: null
  },
  founderName: {
    type: String,
    default: 'Lakhansing Patil'
  },
  founderTitle: {
    type: String,
    default: 'Founder, AlgoMania'
  },
  verificationUrl: {
    type: String,
    required: true
  },
  qrCodeDataUrl: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
