# AlgoMania — Razorpay Test to Live Mode Runbook

## Overview
This runbook provides the exact, step-by-step procedure for safely operating AlgoMania in Razorpay Test Mode and executing the transition to Live Production Mode.

---

## 1. Environment Variable Specifications

| Variable | Description | Test Mode Example | Live Mode Example | Secret? |
|---|---|---|---|---|
| `RAZORPAY_KEY_ID` | Public Key ID (prefix checked) | `rzp_test_...` | `rzp_live_...` | Public (server + client) |
| `RAZORPAY_KEY_SECRET` | Private API Key Secret | `SecretA...` | `SecretB...` | **CRITICAL SERVER SECRET** |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret | `whsec_test_...` | `whsec_live_...` | **CRITICAL SERVER SECRET** |
| `RAZORPAY_MODE` | Payment operational mode | `test` | `live` | Server-only |
| `INTERNSHIP_APPLICATION_FEE_PAISE` | Fee in paise (₹99 = 9900) | `9900` | `9900` | Server-only |
| `APP_BASE_URL` | Canonical app URL | `https://www.algomania.in` | `https://www.algomania.in` | Public |
| `RAZORPAY_TEST_ALLOWED_UIDS` | Allowlist of tester Firebase UIDs | `uid1,uid2,uid3` | *(empty/ignored in live)* | Server-only |

> [!CAUTION]
> Never mix Test and Live credentials. A Test Key ID paired with a Live Key Secret or vice versa will immediately be rejected by the AlgoMania configuration validation layer (`lib/payments/razorpayConfig.js`).

---

## 2. Operating in Test Mode (Current Baseline)

During the test phase:
1. `RAZORPAY_MODE=test` is enforced.
2. The Key ID must begin with `rzp_test_`.
3. Only Firebase UIDs listed in `RAZORPAY_TEST_ALLOWED_UIDS` are permitted to initiate orders via `/api/payments/create-order`.
4. Unauthorized users receive HTTP 403: `"Payment gateway is in test mode. Your account is not authorised for test payments."`
5. Authorized testers see a visible `🧪 SANDBOX / TEST MODE ACTIVE` banner during checkout.
6. Test payment records are persistently tagged with `paymentMode: "test"`.
7. Any certificate preview or administrative record generated under test mode is marked with `metadata.isTestCertificate: true`.

---

## 3. Pre-Flight Live Activation Checklist

Before switching `RAZORPAY_MODE` from `test` to `live`:

- [ ] **Razorpay Account Activation**: Ensure your Razorpay account is fully KYC-verified and activated for domestic payments (UPI, Cards, Net Banking).
- [ ] **Webhook Endpoint Configured**: In the Razorpay Dashboard (Live mode), register the live webhook endpoint:
  - **URL**: `https://www.algomania.in/api/webhooks/razorpay`
  - **Secret**: Generate a distinct 32+ character random string for `RAZORPAY_WEBHOOK_SECRET`.
  - **Active Events**:
    - `payment.captured`
    - `payment.failed`
    - `order.paid`
- [ ] **Live API Key Generation**: Generate a new API Key in the Live mode dashboard. Save the Key ID (`rzp_live_...`) and Key Secret securely.
- [ ] **Bank Settlement Account**: Verify that the settlement bank account is verified in Razorpay.
- [ ] **GST / Invoice Policy**: Confirm applicable tax settings.

---

## 4. Live Mode Switch Procedure

1. **Update Vercel Environment Variables**:
   In your Vercel Project Settings > Environment Variables (Production environment):
   ```env
   RAZORPAY_MODE=live
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
   RAZORPAY_WEBHOOK_SECRET=YOUR_LIVE_WEBHOOK_SECRET
   INTERNSHIP_APPLICATION_FEE_PAISE=9900
   APP_BASE_URL=https://www.algomania.in
   ```
   *(Update all related variables simultaneously so no mismatch occurs)*

2. **Trigger Production Redeployment**:
   Trigger a redeploy of the latest production commit in Vercel.

3. **Verify Configuration**:
   - Inspect build and runtime logs to ensure no `RAZORPAY_KEY_ID prefix mismatch` errors occur.
   - Verify that test allowlist checks are bypassed for real users in live mode.

4. **Execute Verification Transaction**:
   - Apply for an internship track.
   - Complete a live ₹99.00 payment using a genuine UPI or card method.
   - Verify server-side signature verification (`/api/payments/verify`).
   - Check webhook delivery in Razorpay Dashboard (`200 OK` status).
   - Confirm application status updates to `PAID_VERIFIED` in `/internships/my-applications`.

---

## 5. Rollback Procedure

If any anomaly occurs in Live mode:
1. Immediately revert Vercel Environment Variables:
   ```env
   RAZORPAY_MODE=test
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   ```
2. Redeploy production.
3. In-flight live transactions remain safely stored in MongoDB with `paymentMode: "live"`.
4. Check the Razorpay Dashboard to inspect transaction logs and initiate any necessary refunds directly through the merchant console.
