/**
 * Legacy Login Endpoint — Retired
 * 
 * Direct login via custom JWT and bcrypt is disabled.
 * All authentication must proceed via Firebase Authentication at /login
 * to ensure secure token verification, session management, and email verification.
 */
export default async function handler(req, res) {
  return res.status(410).json({
    success: false,
    code: 'ENDPOINT_RETIRED',
    message: 'Direct login via this endpoint has been retired. Please sign in at /login using Firebase Authentication.'
  });
}
