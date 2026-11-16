/**
 * AlgoMania — Razorpay Configuration & Validation
 *
 * Central configuration module for Razorpay payment integration.
 * Validates environment variables, enforces key-mode consistency,
 * and exposes safe helpers for the rest of the payment subsystem.
 *
 * SECURITY: Never expose RAZORPAY_KEY_SECRET or RAZORPAY_WEBHOOK_SECRET
 *           to client-side code. Only RAZORPAY_KEY_ID is public.
 */

/** Default internship application fee in paise (₹99) */
export const INTERNSHIP_FEE_PAISE = parseInt(process.env.INTERNSHIP_APPLICATION_FEE_PAISE, 10) || 9900;

/**
 * Returns a validated Razorpay configuration object built from env vars.
 *
 * @throws {Error} When required env vars are missing or Key ID prefix
 *   does not match the declared RAZORPAY_MODE.
 * @returns {{ keyId: string, keySecret: string, webhookSecret: string,
 *             mode: 'test'|'live', feePaise: number, appBaseUrl: string,
 *             testAllowedUids: string[] }}
 */
export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const mode = (process.env.RAZORPAY_MODE || 'test').toLowerCase();
  const appBaseUrl = process.env.APP_BASE_URL || '';

  // --- Required vars ---
  if (!keyId) {
    throw new Error('RAZORPAY_KEY_ID environment variable is not set.');
  }
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET environment variable is not set.');
  }
  if (!webhookSecret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET environment variable is not set.');
  }

  // --- Mode validation ---
  if (mode !== 'test' && mode !== 'live') {
    throw new Error(`RAZORPAY_MODE must be "test" or "live". Received: "${mode}".`);
  }

  // Key ID prefix must match the declared mode
  const expectedPrefix = mode === 'test' ? 'rzp_test_' : 'rzp_live_';
  if (!keyId.startsWith(expectedPrefix)) {
    throw new Error(
      `RAZORPAY_KEY_ID prefix mismatch: expected "${expectedPrefix}…" for mode "${mode}", ` +
      `but got "${keyId.substring(0, 12)}…".`
    );
  }

  // Parse test-allowed UIDs
  const testAllowedUids = (process.env.RAZORPAY_TEST_ALLOWED_UIDS || '')
    .split(',')
    .map((uid) => uid.trim())
    .filter(Boolean);

  return {
    keyId,
    keySecret,
    webhookSecret,
    mode,
    feePaise: INTERNSHIP_FEE_PAISE,
    appBaseUrl,
    testAllowedUids,
  };
}

/**
 * Checks whether a Firebase UID is on the test-mode allowlist.
 *
 * @param {string} uid — Firebase UID to check
 * @returns {boolean}
 */
export function isTestModeUser(uid) {
  if (!uid) return false;
  const allowedUids = (process.env.RAZORPAY_TEST_ALLOWED_UIDS || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
  return allowedUids.includes(uid);
}

export default { getRazorpayConfig, isTestModeUser, INTERNSHIP_FEE_PAISE };
