/**
 * AlgoMania — Razorpay Configuration & Validation (v3)
 *
 * Central configuration module for Razorpay payment integration.
 * Enforces explicit mode declaration (no silent defaulting), key-mode prefix matching,
 * fee validation (strictly ₹99 / 9900 paise), and safe secret isolation.
 *
 * SECURITY: Never expose RAZORPAY_KEY_SECRET or RAZORPAY_WEBHOOK_SECRET
 *           to client-side code or diagnostic log messages.
 */

/** Fixed canonical internship application fee in paise (₹99.00 INR) */
export const CANONICAL_INTERNSHIP_FEE_PAISE = 9900;

export const INTERNSHIP_FEE_PAISE = (() => {
  const envFee = process.env.INTERNSHIP_APPLICATION_FEE_PAISE;
  if (envFee) {
    const parsed = parseInt(envFee, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return CANONICAL_INTERNSHIP_FEE_PAISE;
})();

/** Convenience export: fee in INR (₹99) */
export const INTERNSHIP_FEE_INR = INTERNSHIP_FEE_PAISE / 100;

/**
 * Returns a validated Razorpay configuration object built from env vars.
 *
 * @throws {Error} When required env vars are missing, mode is undeclared,
 *   or Key ID prefix does not match the declared RAZORPAY_MODE.
 * @returns {{ keyId: string, keySecret: string, webhookSecret: string,
 *             mode: 'test'|'live', feePaise: number, appBaseUrl: string,
 *             testAllowedUids: string[] }}
 */
export function getRazorpayConfig() {
  const rawMode = process.env.RAZORPAY_MODE;
  if (!rawMode || !rawMode.trim()) {
    throw new Error(
      'RAZORPAY_MODE environment variable is required. It must be explicitly set to "test" or "live".'
    );
  }

  const mode = rawMode.trim().toLowerCase();
  if (mode !== 'test' && mode !== 'live') {
    throw new Error(`RAZORPAY_MODE must be explicitly "test" or "live". Received: "${rawMode}".`);
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const appBaseUrl = (process.env.APP_BASE_URL || '').trim();

  // --- Required vars ---
  if (!keyId || !keyId.trim()) {
    throw new Error('RAZORPAY_KEY_ID environment variable is not set.');
  }
  if (!keySecret || !keySecret.trim()) {
    throw new Error('RAZORPAY_KEY_SECRET environment variable is not set.');
  }
  if (!webhookSecret || !webhookSecret.trim()) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET environment variable is not set.');
  }

  // Key ID prefix must match the declared mode
  const expectedPrefix = mode === 'test' ? 'rzp_test_' : 'rzp_live_';
  if (!keyId.startsWith(expectedPrefix)) {
    throw new Error(
      `RAZORPAY_KEY_ID prefix mismatch: expected "${expectedPrefix}…" for mode "${mode}", ` +
      `but got "${keyId.substring(0, 9)}…".`
    );
  }

  // Validate fee is strictly positive and matches ₹99 standard
  if (INTERNSHIP_FEE_PAISE !== 9900) {
    throw new Error(
      `Invalid INTERNSHIP_APPLICATION_FEE_PAISE: expected 9900 (₹99), received ${INTERNSHIP_FEE_PAISE}.`
    );
  }

  // In live or production environment, ensure base URL is configured
  if (mode === 'live' || process.env.NODE_ENV === 'production') {
    if (appBaseUrl && !appBaseUrl.startsWith('https://') && !appBaseUrl.includes('localhost')) {
      throw new Error(`APP_BASE_URL in ${mode} mode must use secure HTTPS protocol: "${appBaseUrl}".`);
    }
  }

  // Parse test-allowed UIDs (relevant during preview testing)
  const testAllowedUids = (process.env.RAZORPAY_TEST_ALLOWED_UIDS || '')
    .split(',')
    .map((uid) => uid.trim())
    .filter(Boolean);

  return {
    keyId: keyId.trim(),
    keySecret: keySecret.trim(),
    webhookSecret: webhookSecret.trim(),
    mode,
    feePaise: INTERNSHIP_FEE_PAISE,
    currency: 'INR',
    appBaseUrl,
    testAllowedUids,
  };
}

/**
 * Checks whether Razorpay configuration is valid without throwing unhandled exceptions.
 * Useful for health-checks and administrative dashboard status.
 *
 * @returns {{ isConfigured: boolean, mode: string|null, error: string|null }}
 */
export function validateRazorpayConfig() {
  try {
    const config = getRazorpayConfig();
    return {
      isConfigured: true,
      mode: config.mode,
      error: null,
    };
  } catch (err) {
    return {
      isConfigured: false,
      mode: process.env.RAZORPAY_MODE || null,
      error: err.message,
    };
  }
}

/**
 * Returns safe public client metadata for Checkout.
 * Strictly isolates and protects secret keys.
 *
 * @returns {{ keyId: string, mode: string, feePaise: number, currency: string }}
 */
export function getPublicPaymentConfig() {
  const config = getRazorpayConfig();
  return {
    keyId: config.keyId,
    mode: config.mode,
    feePaise: config.feePaise,
    currency: 'INR',
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

export default {
  getRazorpayConfig,
  validateRazorpayConfig,
  getPublicPaymentConfig,
  isTestModeUser,
  INTERNSHIP_FEE_PAISE,
  INTERNSHIP_FEE_INR,
  CANONICAL_INTERNSHIP_FEE_PAISE,
};
