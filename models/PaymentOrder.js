import mongoose from 'mongoose';

const PaymentOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    applicationId: {
      type: String,
      required: true,
      index: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    amountPaise: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMode: {
      type: String,
      enum: ['test', 'live'],
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'ORDER_PENDING',
        'ORDER_CREATED',
        'CHECKOUT_OPEN',
        'CHECKOUT_OPENED',
        'CREATED',
        'PENDING',
        'PAYMENT_PENDING',
        'PAYMENT_FAILED',
        'PAYMENT_CANCELLED',
        'PAYMENT_AUTHORIZED',
        'PAYMENT_VERIFIED',
        'PAYMENT_CAPTURED',
        'AUTHORIZED',
        'CAPTURED',
        'FAILED',
        'CANCELLED',
        'REFUNDED',
        'DISPUTED',
        'EXPIRED',
        'PAID_VERIFIED',
      ],
      default: 'CREATED',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: [
        'UNVERIFIED',
        'SIGNATURE_VALID',
        'AMOUNT_VERIFIED',
        'FULLY_VERIFIED',
        'VERIFICATION_FAILED',
      ],
      default: 'UNVERIFIED',
    },
    webhookEventIds: {
      type: [String],
      default: [],
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    capturedAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    refundId: {
      type: String,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: null,
    },
    refundStatus: {
      type: String,
      default: null,
    },
    refundReason: {
      type: String,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    attempts: [
      {
        attemptId: { type: String, required: true },
        status: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        failureReason: { type: String, default: null },
      },
    ],
    errorMessage: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
PaymentOrderSchema.index({ applicationId: 1, status: 1 });
PaymentOrderSchema.index({ firebaseUid: 1, applicationId: 1 });

export default mongoose.models.PaymentOrder ||
  mongoose.model('PaymentOrder', PaymentOrderSchema);
