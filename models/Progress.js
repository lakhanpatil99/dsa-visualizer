import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

// Compound index for efficient queries
ProgressSchema.index({ userId: 1, algorithmType: 1, algorithmName: 1 }, { unique: true });

// Prevent sensitive data from being returned
ProgressSchema.methods.toJSON = function() {
  const progress = this.toObject();
  delete progress.__v;
  return progress;
};

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
