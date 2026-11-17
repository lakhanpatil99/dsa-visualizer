# AlgoMania Public Certificate Registry & Live Progress — Engineering Report

**Repository:** lakhanpatil99/dsa-visualizer  
**Feature branch:** feat/algomania-public-certificate-registry-v2  
**Base:** latest `main` common ancestor `057fa4ad17390312bdf83bff89d8a5cb7d5c4929`  
**Scope:** Public credential verification, authoritative competition progress, automatic milestone credentials, and live internship certificate status.

## 1. Public Certificate Registry

- Added a shared MongoDB-backed lookup service at `lib/certificates/publicVerification.js`.
- Public verification is read-only, GET-only and does not require login.
- MongoDB remains the authoritative source. Database outages produce an unavailable response rather than a false invalid certificate.
- Added `/certificates/verify` and `/certificates/verify/[certificateId]`; the result page no longer self-fetches its API or uses a localhost fallback.
- Added public verification entry points to the homepage, shared navigation, internship portal and footers.
- Existing certificate IDs remain unchanged. New IDs use 128 bits of cryptographic randomness.
- Source-key idempotency prevents duplicate issuance from repeated admin or automatic issuance attempts.

## 2. Competition Progress — Authoritative Data

The canonical competition catalogue is `lib/competitions/challengesData.js`: 227 unique challenges across 15 categories, including 12 Queues challenges.

Competition progress is intentionally different from saved algorithm walkthrough progress on `/dashboard`.

- Walkthrough records continue to use the existing `ProgressService` and retain their current meaning.
- Competition milestones are calculated from distinct `CompetitionSubmission.challengeId` values where `firebaseUid` matches the authenticated user and `status === 'ACCEPTED'`.
- Failed attempts and repeat accepted submissions for the same challenge do not increment the count.
- `/api/competitions/stats`, challenge solved-state annotations, certificate eligibility and issuance all use this verified submission set.
- Production database failures are not converted into a zero-progress result. APIs return an unavailable state; the UI preserves the last verified count and offers retry.

## 3. Automatic Competition Credential Issuance

Added `lib/certificates/competitionMilestoneIssuance.js` as an internal server-side service. It is not exposed as a public issuance endpoint.

- Bronze: 20 unique accepted challenges.
- Silver: 100 unique accepted challenges.
- Gold: 200 unique accepted challenges.
- After an accepted submission is persisted, the server recomputes the unique accepted count and calls the issuance service.
- The service uses the unique sparse `sourceKey` on the Certificate collection for idempotency and generates 128-bit random IDs for newly issued records.
- Existing historical certificate IDs are reused rather than regenerated.
- The authenticated certificate-vault API retries issuance if a threshold was reached but a previous attempt was interrupted.
- Only a persisted certificate document with `status === 'VALID'` enables the official PDF/share actions. An unlocked milestone alone is never shown as an issued certificate.

## 4. Live UI Synchronization

### Competition Arena

- Catalogue and personal progress refresh on page load, after accepted submissions, on browser focus, visibility return and network reconnect, plus a 15-second refresh interval.
- API calls use `cache: 'no-store'`.
- Added a manual progress refresh control and clear retry messaging.
- The page displays real catalogue errors instead of silently presenting an empty “0 of 0” list.
- Actual issued Bronze/Silver/Gold credentials appear with Download PDF, Share and Verify actions.

### Learning Dashboard

- Existing algorithm walkthrough metrics remain unchanged.
- Added a separate Competition Arena panel sourced from `/api/competitions/stats`, showing current accepted submissions against Bronze, Silver and Gold milestones.
- The competition panel refreshes every 15 seconds and on focus/visibility/network return.

### Internship Applications

- The applications API now joins the user’s applications to actual persisted internship Certificate records.
- The frontend refreshes application/payment/certificate status on focus, visibility return and network reconnect, plus a 12-second refresh interval.
- A verified ₹99 registration payment is shown promptly, but does not itself create an internship completion certificate.
- Internship PDF/share actions appear only when the official certificate record exists and is valid.
- Existing eligibility remains unchanged: application status must be `COMPLETED` and payment status must be `PAID_VERIFIED`; authorized certificate issuance is still required.

## 5. Certificate Download & Sharing

- The download API requires an authenticated owner and an actual MongoDB certificate record.
- Revoked credentials cannot be downloaded.
- Competition and internship pages use the official verification URL for native sharing or clipboard fallback.
- No fake certificate ID, fake verification URL or sample QR is treated as an issued credential.

## 6. Payment-Scope Protection

No Razorpay checkout, order-creation, payment-status, callback or webhook files were changed in this follow-up. The ₹99 registration amount and existing payment workflow remain untouched.

## 7. Files Changed in This Follow-up

- `lib/certificates/competitionMilestoneIssuance.js` (new)
- `pages/api/competitions/stats.js`
- `pages/api/competitions/challenges.js`
- `pages/api/competitions/submit.js`
- `pages/api/certificates/my-certificates.js`
- `pages/api/admin/issue-certificate.js`
- `pages/api/internships/my-applications.js`
- `pages/api/certificates/download/[id].js`
- `pages/competitions/index.js`
- `src/components/ProgressDashboard.js`
- `pages/certificates/index.js`
- `pages/internships/my-applications.js`
- `src/components/certificates/CertificatePreviewModal.js`
- `tests/live_competition_progress_certificates.test.mjs` (new)

The branch also includes the public verification registry implementation from the earlier V2 scope.

## 8. Validation & Deployment Status

A new source-level regression suite has been added for:
- 227 challenge catalogue integrity and Queue category coverage.
- Unique ACCEPTED submission counts.
- Idempotent automatic certificate issuance.
- Live competition and dashboard refresh.
- Internship certificate lookup and authorization.
- Preservation of the existing Razorpay checkout contracts.

**The follow-up test suite and Next.js build have not been executed in this editing environment.** The branch must pass `npm test` and `npm run build`, followed by database-backed verification of threshold issuance, duplicate submissions, a DB outage, real PDF download, sharing, and internship completion/payment states before merge.

Changes are on `feat/algomania-public-certificate-registry-v2` and remain in the existing draft PR #11. This report does not claim a merge to `main` or a Vercel production deployment.
