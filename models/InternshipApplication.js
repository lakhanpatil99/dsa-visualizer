import mongoose from 'mongoose';

const InternshipApplicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
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
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  academicYear: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['java', 'python', 'cpp']
  },
  domainTitle: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['1_month', '2_months', '3_months']
  },
  preferredStartDate: {
    type: String,
    required: true
  },
  verifiedStartDate: {
    type: Date,
    default: null
  },
  verifiedEndDate: {
    type: Date,
    default: null
  },
  learningObjectives: {
    type: String,
    required: true
  },
  priorExperience: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING_REVIEW', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING_REVIEW',
    index: true
  },
  verifiedBy: {
    type: String,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  completionNotes: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: [
      'NOT_CONFIGURED',
      'NOT_STARTED',
      'PENDING',
      'VERIFICATION_REQUIRED',
      'PAID_VERIFIED',
      'FAILED',
      'REFUNDED'
    ],
    default: 'NOT_CONFIGURED',
    index: true
  },
  paymentRecordId: {
    type: String,
    default: null
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Compound index to help lookup active applications by user and domain
InternshipApplicationSchema.index({ firebaseUid: 1, domain: 1, status: 1 });

export default mongoose.models.InternshipApplication || mongoose.model('InternshipApplication', InternshipApplicationSchema);
