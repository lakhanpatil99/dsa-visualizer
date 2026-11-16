import mongoose from 'mongoose';

const InternshipProgramSchema = new mongoose.Schema({
  programId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['Java', 'Python', 'C++']
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: {
    type: [String],
    default: []
  },
  learningObjectives: {
    type: [String],
    default: []
  },
  durationOptions: {
    type: [String],
    default: ['1_month', '2_months', '3_months']
  },
  programFormat: {
    type: String,
    default: 'Remote / Mentored Project Lab'
  },
  certificateEligibility: {
    type: String,
    default: 'Granted upon completion verification by program mentor and approved project defense.'
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.models.InternshipProgram || mongoose.model('InternshipProgram', InternshipProgramSchema);
