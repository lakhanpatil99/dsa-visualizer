import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// OnboardingEvent — Durable email outbox for Brevo onboarding emails
// ---------------------------------------------------------------------------
// Guarantees exactly-once delivery per (firebaseUid, eventType) pair.
// Lifecycle: PENDING_VERIFICATION → QUEUED → PROCESSING → ACCEPTED_BY_BREVO
// Failures: RETRYABLE_FAILURE (transient), PERMANENT_FAILURE (fatal)
// ---------------------------------------------------------------------------

const STATUSES = [
  'PENDING_VERIFICATION',
  'QUEUED',
  'PROCESSING',
  'ACCEPTED_BY_BREVO',
  'DELIVERED',
  'RETRYABLE_FAILURE',
  'PERMANENT_FAILURE'
];

const OnboardingEventSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      index: true
    },
    recipientEmail: {
      type: String,
      required: [true, 'Recipient email is required'],
      lowercase: true,
      trim: true
    },
    recipientName: {
      type: String,
      default: ''
    },
    eventType: {
      type: String,
      required: true,
      default: 'account_onboarding'
    },
    templateId: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'PENDING_VERIFICATION',
      index: true
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    brevoMessageId: {
      type: String,
      default: null
    },
    lastError: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    sentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// CRITICAL: Unique compound index ensures exactly one onboarding event per user.
// Duplicate insert attempts receive a MongoDB 11000 error (safe idempotency).
OnboardingEventSchema.index(
  { firebaseUid: 1, eventType: 1 },
  { unique: true }
);

// Prevent model recompilation during hot-reload
export default mongoose.models.OnboardingEvent ||
  mongoose.model('OnboardingEvent', OnboardingEventSchema);
