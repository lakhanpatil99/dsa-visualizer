# AlgoMania — Razorpay Live Mode Cutover Runbook

**Document Version:** 3.0  
**Target Environment:** Production (`https://www.algomania.in`)  
**Deployment Platform:** Vercel + MongoDB Atlas + Firebase Authentication  
**Author:** Principal Software Architect & Payment Systems Engineer  
**Date:** 2026-11-17  

---

## 1. Objective & Scope

This runbook specifies the step-by-step operational procedure for transitioning AlgoMania's payment system from **Test Mode** (`rzp_test_...`) to **Live Production Mode** (`rzp_live_...`).

The target transaction is the **₹99 (9900 paise)** Internship Registration Fee across the three canonical tracks (`java`, `python`, `cpp`).

---

## 2. Pre-Cutover Verification Checklist

Before altering any production environment variables, confirm all items below:

- [ ] **Razorpay Merchant Account Status:** Activated, KYC documents fully verified, and settlement bank account approved.
- [ ] **Live API Keys Generated:** Live Key ID (`rzp_live_...`) and Live Key Secret downloaded securely from the Razorpay Dashboard (Settings → API Keys).
- [ ] **Live Webhook Secret Generated:** A strong, cryptographically random secret string generated (minimum 32 characters) for live webhook signature verification.
- [ ] **MongoDB Atlas Health:** Primary replica online, connection pool healthy, network latency < 50ms from Vercel us-east / bom regions.
- [ ] **SSL / HTTPS Active:** `https://www.algomania.in` is serving a valid TLS certificate with HSTS enabled.
- [ ] **Automated Test Suite Clean:** All 159 tests passing (`npm test`), Next.js production build cleanly compiles all 33 routes (`npm run build`).

---

## 3. Environment Variable Configuration

Configure the following variables in the **Vercel Production Environment**:

| Variable Name | Required Live Value / Format | Sensitivity | Description |
|---|---|---|---|
| `RAZORPAY_MODE` | `live` | Public | Enforces live mode validation rules |
| `RAZORPAY_KEY_ID` | `rzp_live_[A-Za-z0-9]+` | Private | Razorpay Live Key ID (must start with `rzp_live_`) |
| `RAZORPAY_KEY_SECRET` | `[A-Za-z0-9]{24,}` | Secret | Matching Razorpay Live Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | `[A-Za-z0-9_\-]{32,}` | Secret | Webhook signature verification secret |
| `INTERNSHIP_APPLICATION_FEE_PAISE` | `9900` | Public | Exactly ₹99.00 in paise |
| `APP_BASE_URL` | `https://www.algomania.in` | Public | Production domain (HTTPS mandatory) |
| `MONGODB_URI` | `mongodb+srv://...` | Secret | MongoDB Atlas production connection URI |

### Strict Safety Invariants
1. **Never mix modes:** A `rzp_live_` Key ID must NEVER be paired with a test key secret.
2. **Mode-Key ID Match:** In `lib/payments/razorpayConfig.js`, if `RAZORPAY_MODE === 'live'`, the Key ID must strictly begin with `rzp_live_`. Any `rzp_test_` key will trigger an immediate configuration assertion throw.
3. **No Private Secrets in Client Bundles:** `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are never prefixed with `NEXT_PUBLIC_` and never bundled into client JS.

---

## 4. Razorpay Dashboard Webhook Configuration

1. Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch toggle in the header from **Test Mode** to **Live Mode**.
3. Navigate to: **Settings** → **Webhooks** → **Add New Webhook**.
4. Set **Webhook URL** to:
   ```
   https://www.algomania.in/api/webhooks/razorpay
   ```
5. Enter the **Secret**: Value must exactly match `RAZORPAY_WEBHOOK_SECRET`.
6. Select **Alert Email**: Enter system administrator / on-call email.
7. Select the following **Active Events**:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
8. Click **Save Webhook**.

---

## 5. Cutover Deployment Execution

Follow this zero-downtime cutover sequence:

### Step 5.1: Update Environment Variables in Vercel
1. In Vercel Project Settings → Environment Variables:
   - Update `RAZORPAY_MODE` = `live`
   - Update `RAZORPAY_KEY_ID` = `rzp_live_...`
   - Update `RAZORPAY_KEY_SECRET` = `<live-secret>`
   - Update `RAZORPAY_WEBHOOK_SECRET` = `<live-webhook-secret>`
   - Ensure `NODE_ENV` = `production`
2. Save changes for the **Production** environment.

### Step 5.2: Deploy Production Release
```bash
git checkout main
git merge feat/algomania-payment-reliability-live-v3 --ff-only
git push origin main
```
Vercel will trigger a production deployment. Verify build logs show 0 errors and all 33 pages compile cleanly.

---

## 6. Post-Cutover Production Verification (Smoke Test)

Perform exactly one live verification payment of ₹99:

1. **User Sign-In:** Log in to `https://www.algomania.in` with a test user account via Firebase Auth.
2. **Track Selection:** Navigate to `/internships` and choose the `Python Engineering Track` (`domain: "python"`).
3. **Application Wizard:** Fill candidate details and click **Apply & Proceed to Registration (₹99)**.
4. **Order Creation:** Check browser network tab — `POST /api/payments/create-order` must return `200 OK` with `orderId` starting with `order_` and `amount: 9900`.
5. **Checkout Modal:** Razorpay Checkout modal appears showing ₹99.00 payable to "AlgoMania".
6. **Payment Execution:** Complete payment using a live UPI ID (e.g., GPay / PhonePe).
7. **Verification Flow:**
   - Client sends signature to `POST /api/payments/verify`.
   - Server returns `200 OK` with `success: true`.
   - UI displays confirmation banner and instantly unlocks the candidate dashboard.
8. **MongoDB Record Inspection:**
   - Query `PaymentOrder`: `status === 'captured'`, `amount === 9900`, `attempts.length >= 1`.
   - Query `InternshipApplication`: `paymentStatus === 'paid'`, `domain === 'python'`.
   - Query `WebhookEvent`: `status === 'PROCESSED'`.
9. **Refund Verification (Optional):** If testing with a personal account, test refunding via Razorpay Dashboard or `/api/payments/refund` to verify `refundId` and `refundStatus === 'processed'`.

---

## 7. Emergency Rollback Procedure

If payment capture fails, webhook signatures fail, or unexpected 500 errors occur during live checkout:

### Fast Rollback (< 2 minutes):
1. In Vercel Project Settings → Environment Variables:
   - Change `RAZORPAY_MODE` = `test`
   - Change `RAZORPAY_KEY_ID` = `rzp_test_...`
   - Change `RAZORPAY_KEY_SECRET` = `<test-secret>`
   - Change `RAZORPAY_WEBHOOK_SECRET` = `<test-webhook-secret>`
2. Trigger an immediate redeployment of the previous deployment in Vercel Dashboard.
3. In Razorpay Live Dashboard: Check **Transactions** to review any pending/failed customer charges and issue manual refunds if necessary.
4. Check Vercel Function Logs for `/api/payments/*` and `/api/webhooks/razorpay` to isolate stack traces.
