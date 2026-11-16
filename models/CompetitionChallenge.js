import mongoose from 'mongoose';

const ExampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' }
}, { _id: false });

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
}, { _id: false });

const CompetitionChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sorting', 'searching', 'graphs', 'trees', 'data-structures', 'general-dsa'],
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  points: {
    type: Number,
    default: 10
  },
  description: {
    type: String,
    required: true
  },
  constraints: {
    type: [String],
    default: []
  },
  examples: {
    type: [ExampleSchema],
    default: []
  },
  starterCode: {
    type: String,
    default: ''
  },
  functionName: {
    type: String,
    default: 'solve'
  },
  testCases: {
    type: [TestCaseSchema],
    default: []
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.CompetitionChallenge || mongoose.model('CompetitionChallenge', CompetitionChallengeSchema);
