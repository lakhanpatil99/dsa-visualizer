import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  firebaseUid: {
    type: String,
    required: false,
    index: true
  },
  algorithmType: {
    type: String,
    required: true,
    enum: ['sorting', 'data-structures', 'trees', 'graphs'],
    index: true
  },
  algorithmName: {
    type: String,
    required: true,
    index: true
  },
  progressData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  completionStatus: {
    type: String,
    required: true,
    enum: ['not_started', 'in_progress', 'completed', 'mastered'],
    default: 'not_started'
  },
  stepsCompleted: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastStep: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for Firebase UID lookups
ProgressSchema.index({ firebaseUid: 1, algorithmType: 1, algorithmName: 1 });
// Compound index for legacy lookups
ProgressSchema.index({ userId: 1, algorithmType: 1, algorithmName: 1 });

// Prevent sensitive metadata from being returned
ProgressSchema.methods.toJSON = function () {
  const progress = this.toObject();
  delete progress.__v;
  return progress;
};

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
