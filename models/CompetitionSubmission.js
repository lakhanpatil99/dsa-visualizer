import mongoose from 'mongoose';

const CompetitionSubmissionSchema = new mongoose.Schema({
  submissionId: {
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
    index: true
  },
  challengeId: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  status: {
    type: String,
    required: true,
    enum: ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR'],
    index: true
  },
  passedTestCases: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  executionTimeMs: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

CompetitionSubmissionSchema.index({ firebaseUid: 1, challengeId: 1, status: 1 });

export default mongoose.models.CompetitionSubmission || mongoose.model('CompetitionSubmission', CompetitionSubmissionSchema);
