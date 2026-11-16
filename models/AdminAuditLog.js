import mongoose from 'mongoose';

const AdminAuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    index: true
  },
  performedBy: {
    type: String,
    required: true,
    index: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['internship_application', 'certificate', 'competition', 'user', 'pricing'],
    index: true
  },
  targetId: {
    type: String,
    required: true,
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.models.AdminAuditLog || mongoose.model('AdminAuditLog', AdminAuditLogSchema);
