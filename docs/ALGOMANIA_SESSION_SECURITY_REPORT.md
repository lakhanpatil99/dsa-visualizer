# AlgoMania — Session Security & Authentication Hardening Report

**Document Version:** 3.0  
**Target Systems:** Firebase Authentication, Next.js AuthContext, API withAuth Middleware  
**Author:** Cybersecurity & Reliability Engineering  
**Date:** 2026-11-17  

---

## 1. Executive Summary

This report documents the security enhancements introduced in AlgoMania V3 to protect user accounts, internship applicant credentials, and payment sessions against unauthorized access, credential leakage, and session persistence risks on shared or public devices.

Prior to V3, authentication used default persistent storage (`browserLocalPersistence`), which retained session tokens in `localStorage` indefinitely across browser restarts. V3 implements defense-in-depth session boundaries compliant with enterprise cybersecurity standards.

---

## 2. Security Controls Implemented

### 2.1 Tab-Scoped Session Persistence (`browserSessionPersistence`)
- **File:** `lib/firebase.js`
- **Change:** Changed `setPersistence(auth, browserLocalPersistence)` to `setPersistence(auth, browserSessionPersistence)`.
- **Security Impact:** Session tokens are stored exclusively in `sessionStorage`. When a user closes their browser or tab, all access tokens and refresh tokens are immediately purged by the browser runtime. This completely eliminates unauthorized account access on shared workstation environments (cybercafes, college computer labs, library terminals).

### 2.2 Strict Inactivity Idle Timeout (30 Minutes)
- **File:** `src/contexts/AuthContext.js`
- **Constant:** `IDLE_TIMEOUT_MS = 30 * 60 * 1000` (30 minutes)
- **Mechanism:**
  - An activity listener monitors user interaction events: `mousedown`, `keydown`, `scroll`, and `touchstart`.
  - Every valid interaction refreshes `lastActivityRef.current = Date.now()`.
  - A background watchdog runs every 60 seconds (`IDLE_CHECK_INTERVAL_MS = 60 * 1000`).
  - If `Date.now() - lastActivityRef.current > IDLE_TIMEOUT_MS`, the session is revoked, the user is signed out of Firebase, and redirected to `/auth/login?reason=idle_timeout`.

### 2.3 Hard Absolute Session Lifetime (8 Hours)
- **File:** `src/contexts/AuthContext.js`
- **Constant:** `MAX_SESSION_AGE_MS = 8 * 60 * 60 * 1000` (8 hours)
- **Mechanism:**
  - Inspects the decoded Firebase ID token's `auth_time` (authentication timestamp).
  - Regardless of continuous user activity, sessions older than 8 hours are automatically terminated, requiring re-authentication.
  - This prevents indefinitely refreshed bearer tokens from surviving prolonged exposure.

### 2.4 Synchronized Cross-Tab Session Termination
- **File:** `src/contexts/AuthContext.js`
- **Mechanism:**
  - Implements a modern `BroadcastChannel('algomania_auth')` bus.
  - When a user logs out in Tab A, an `AUTH_LOGOUT` event is broadcasted.
  - All other open AlgoMania tabs (Tab B, Tab C) intercept the broadcast and trigger immediate local state cleanup and redirection to `/auth/login`.
  - For older browsers without native `BroadcastChannel` support, an idempotent `localStorage` storage-event fallback provides backward compatibility.

---

## 3. Server-Side Token Verification & Rate Limiting

### 3.1 Timing-Safe Webhook Signatures
- **File:** `pages/api/webhooks/razorpay.js`
- **Mechanism:** Cryptographic signature verification uses `crypto.timingSafeEqual()` with length-guarded buffers to mitigate timing side-channel attacks against HMAC-SHA256 evaluation.

### 3.2 Bearer Token Extraction & Authorization
- **File:** `lib/auth.js` (`withAuth` middleware)
- **Rules:**
  - Header must adhere strictly to `Authorization: Bearer <token>`.
  - Rejects missing headers with `401 UNAUTHORIZED`.
  - Rejects malformed or signature-invalid tokens with `401 INVALID_TOKEN`.
  - Unverified email/password accounts are restricted with `403 EMAIL_NOT_VERIFIED` on sensitive endpoints.
  - Google OAuth providers are trusted when `email_verified: true` is asserted in the token payload.

---

## 4. Automated Test Validation

The test suite `tests/session_security.test.mjs` verifies the following invariants:

| Invariant | Test File | Result |
|---|---|---|
| Firebase uses `browserSessionPersistence` | `tests/session_security.test.mjs` | ✅ Verified |
| 8-hour maximum session lifetime defined | `tests/session_security.test.mjs` | ✅ Verified |
| 30-minute idle timeout defined | `tests/session_security.test.mjs` | ✅ Verified |
| `auth_time` evaluated for absolute expiration | `tests/session_security.test.mjs` | ✅ Verified |
| `BroadcastChannel('algomania_auth')` initialized | `tests/session_security.test.mjs` | ✅ Verified |
| User activity listeners registered on mount | `tests/session_security.test.mjs` | ✅ Verified |
| Footer removes development framework credits | `tests/session_security.test.mjs` | ✅ Verified |
