import mongoose from 'mongoose';

const PaymentRecordSchema = new mongoose.Schema({
  paymentId: {
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
  purpose: {
    type: String,
    required: true,
    enum: ['internship_certificate', 'competition_certificate']
  },
  referenceId: {
    type: String,
    required: true,
    index: true
  },
  tier: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  provider: {
    type: String,
    default: 'razorpay_placeholder'
  },
  status: {
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
  providerOrderId: {
    type: String,
    default: null
  },
  providerPaymentId: {
    type: String,
    default: null
  },
  providerSignature: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.models.PaymentRecord || mongoose.model('PaymentRecord', PaymentRecordSchema);
