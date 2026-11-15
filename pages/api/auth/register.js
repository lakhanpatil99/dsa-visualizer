/**
 * Legacy Registration Endpoint — Retired
 * 
 * Direct registration via custom JWT and bcrypt is disabled.
 * All registrations must proceed via Firebase Authentication at /register
 * to ensure identity verification, password policy enforcement, and email verification.
 */
export default async function handler(req, res) {
  return res.status(410).json({
    success: false,
    code: 'ENDPOINT_RETIRED',
    message: 'Direct registration via this endpoint has been retired. Please create your account at /register using Firebase Authentication.'
  });
}
