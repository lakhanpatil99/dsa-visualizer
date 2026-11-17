# AlgoMania — Automated Onboarding Email Engine (Brevo Integration)
## Production Implementation Report V1.0

---

## 1. Executive Summary

This release introduces an automated, idempotent, and resilient onboarding email engine powered by Brevo Transactional Email API for AlgoMania (`https://www.algomania.in`).

### Key Invariants Enforced
1. **One Account = One Verified Identity = One Onboarding Event = One Welcome Email.**
2. **Durable Outbox Pattern**: Backed by a dedicated MongoDB collection (`OnboardingEvent`) with a compound unique index `{ firebaseUid: 1, eventType: 1 }` preventing duplicate deliveries.
3. **Strict Email Verification**: Onboarding emails are sent **only** after email verification is confirmed (either via Firebase email link confirmation or via Google OAuth identity verification).
4. **Complete Fault Isolation**: Brevo outages, network drops, or template misconfigurations will **never** block or break user registration, email verification, or login.
5. **Zero Secrets in Client Bundles**: All Brevo keys, template configurations, and API calls are strictly server-side.

---

## 2. Architecture & Flow

### A. Manual Email/Password Registration Flow
```
User registers (Full Name, Email, Password)
  │
  ▼
Firebase creates user & sends verification email
  │
  ▼
pages/register.js calls /api/auth/onboarding/initiate (Fire-and-Forget)
  │
  ▼
MongoDB stores OnboardingEvent (status: 'PENDING_VERIFICATION')
  │
  ▼ (User clicks link in verification email)
pages/verify-email.js confirms emailVerified === true
  │
  ▼
Calls /api/auth/onboarding/complete with fresh ID token
  │
  ▼
Server-side:
  - Verifies token claims (email_verified === true)
  - Optionally verifies with Firebase Admin SDK
  - Atomic lease claim: findOneAndUpdate('PENDING_VERIFICATION' → 'PROCESSING')
  - Calls Brevo Transactional API (POST /v3/smtp/email)
  - Transitions to 'ACCEPTED_BY_BREVO' (stores brevoMessageId, sentAt)
```

### B. Google OAuth Sign-in/Sign-up Flow
```
User clicks "Register with Google"
  │
  ▼
Firebase Auth completes Google OAuth
  │
  ▼
AuthContext syncs profile with backend (/api/auth/sync-user)
  │
  ▼
New User Detection:
  - creationTime ≈ lastSignInTime (< 10 seconds difference)
  │
  ▼
AuthContext calls /api/auth/onboarding/complete
  │
  ▼
Server-side:
  - Verifies token (email_verified === true)
  - Checks if user is already onboarded (isAlreadyOnboarded)
  - If new: creates record in 'PROCESSING' status atomically
  - Dispatches Brevo welcome template
  - Transitions to 'ACCEPTED_BY_BREVO'
```

### C. Existing User Logins (Manual or Google)
- Existing users logging into AlgoMania do **not** receive onboarding emails.
- Database checks confirm that an `OnboardingEvent` already exists or the account is not newly registered, immediately returning `{ success: true, alreadyProcessed: true }`.

---

## 3. Data Model (`models/OnboardingEvent.js`)

| Field | Type | Description |
|---|---|---|
| `firebaseUid` | `String` (Required, Index) | Unique Firebase User ID |
| `recipientEmail` | `String` (Required, Lowercase) | Recipient email address |
| `recipientName` | `String` | User full name |
| `eventType` | `String` (Default: `'account_onboarding'`) | Unique event identifier |
| `templateId` | `Number` | Brevo Transactional Template ID |
| `status` | `Enum` | `PENDING_VERIFICATION`, `QUEUED`, `PROCESSING`, `ACCEPTED_BY_BREVO`, `DELIVERED`, `RETRYABLE_FAILURE`, `PERMANENT_FAILURE` |
| `attempts` | `Number` (Default: 0) | Number of dispatch attempts (max 3) |
| `brevoMessageId` | `String` | Message ID returned by Brevo on success |
| `lastError` | `String` | Last error encountered (if any) |
| `sentAt` | `Date` | Timestamp of successful transmission |

**Unique Compound Index**: `{ firebaseUid: 1, eventType: 1 }` with `unique: true`.

---

## 4. Brevo Configuration & Template Verification

### Environment Variables
Configure these in Vercel (`Production` & `Preview`):
```env
BREVO_API_KEY=xkeysib-your-production-brevo-api-key
BREVO_SENDER_EMAIL=noreply@algomania.in
BREVO_SENDER_NAME=AlgoMania
BREVO_ONBOARDING_TEMPLATE_ID=8
BREVO_ONBOARDING_ENABLED=true
APP_BASE_URL=https://www.algomania.in
```

### Pre-Flight Verification of Template #8
Before switching `BREVO_ONBOARDING_ENABLED=true`, verify the transactional template via:
```bash
curl -X GET "https://api.brevo.com/v3/smtp/templates/8" \
  -H "api-key: $BREVO_API_KEY" \
  -H "Accept: application/json"
```
Ensure:
1. HTTP 200 is returned.
2. `isActive` is `true`.
3. Template exists in **Transactional** templates (not Marketing campaign templates).
4. Placeholders supported: `{{ params.firstName }}`, `{{ params.workspaceUrl }}`, `{{ params.internshipsUrl }}`, `{{ params.competitionsUrl }}`, `{{ params.dashboardUrl }}`.

---

## 5. Automated Verification Results

- **Unit & Invariant Tests**: `tests/brevo_onboarding.test.mjs` — 16/16 Passed.
- **Full Regression Suite**: 180 tests across 25 suites — 180 Passed, 0 Failed.
- **Next.js Production Build**: All 48 pages/endpoints compiled successfully (`next build`).
