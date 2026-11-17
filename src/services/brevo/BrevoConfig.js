// ---------------------------------------------------------------------------
// BrevoConfig — Server-side Brevo configuration validation
// ---------------------------------------------------------------------------
// SAFE: Never throws fatal errors. Returns `isConfigured: false` if missing.
// Brevo misconfiguration must NEVER break Firebase authentication.
// ---------------------------------------------------------------------------

const REQUIRED_VARS = [
  'BREVO_API_KEY'
];

const OPTIONAL_VARS = [
  'BREVO_SENDER_EMAIL',
  'BREVO_SENDER_NAME',
  'BREVO_ONBOARDING_TEMPLATE_ID',
  'BREVO_ONBOARDING_ENABLED',
  'APP_BASE_URL'
];

let _cachedConfig = null;

/**
 * Validates and returns the Brevo configuration.
 * Safe: never throws. Returns { isConfigured, ...config } or { isConfigured: false, errors }.
 */
export function getBrevoConfig() {
  if (_cachedConfig) return _cachedConfig;

  const errors = [];
  const warnings = [];

  // Required: API Key
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    errors.push('BREVO_API_KEY is not set. Brevo onboarding emails are disabled.');
  }

  // Feature toggle: explicitly opt-in
  const enabledRaw = process.env.BREVO_ONBOARDING_ENABLED;
  const isEnabled = enabledRaw === 'true' || enabledRaw === '1';
  if (!isEnabled) {
    warnings.push('BREVO_ONBOARDING_ENABLED is not set to "true". Onboarding emails are disabled.');
  }

  // Template ID
  const templateIdRaw = process.env.BREVO_ONBOARDING_TEMPLATE_ID;
  let templateId = null;
  if (templateIdRaw) {
    templateId = parseInt(templateIdRaw, 10);
    if (isNaN(templateId) || templateId <= 0) {
      errors.push(`BREVO_ONBOARDING_TEMPLATE_ID="${templateIdRaw}" is not a valid positive integer.`);
      templateId = null;
    }
  } else {
    errors.push('BREVO_ONBOARDING_TEMPLATE_ID is not set.');
  }

  // Sender
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@algomania.in';
  const senderName = process.env.BREVO_SENDER_NAME || 'AlgoMania';

  // App Base URL
  const appBaseUrl = process.env.APP_BASE_URL || 'https://www.algomania.in';

  const isConfigured = errors.length === 0 && isEnabled && templateId !== null;

  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`[Brevo Config] ${w}`));
  }
  if (errors.length > 0 && isEnabled) {
    // Only log errors if the feature is explicitly enabled but misconfigured
    errors.forEach(e => console.error(`[Brevo Config] ${e}`));
  }

  _cachedConfig = {
    isConfigured,
    isEnabled,
    apiKey: apiKey ? apiKey.trim() : null,
    templateId,
    senderEmail,
    senderName,
    appBaseUrl,
    errors,
    warnings
  };

  return _cachedConfig;
}

/**
 * Invalidate cached config (useful for testing).
 */
export function resetBrevoConfig() {
  _cachedConfig = null;
}

export default getBrevoConfig;
