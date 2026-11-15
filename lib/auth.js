import admin from './firebaseAdmin.js';
import dbConnect from './dbConnect.js';
import User from '../models/User.js';

/**
 * Extracts Bearer token from HTTP Authorization header
 */
export function extractBearerToken(req) {
  const authHeader = req.headers?.authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

/**
 * Verifies Firebase ID Token using Firebase Admin SDK.
 *
 * The second argument (`true`) enables revocation checking so that tokens
 * belonging to signed-out or deleted users are rejected immediately.
 *
 * @param {string} token - The raw ID token
 * @returns {Promise<Object>} Decoded token claims
 */
export async function verifyIdToken(token) {
  if (!token) {
    throw new Error('NO_TOKEN');
  }

  // Support for testing/mock environments
  if (process.env.NODE_ENV === 'test' && token.startsWith('mock-token-')) {
    const parts = token.replace('mock-token-', '').split('-');
    const uid = parts[0] || 'mock-user-123';
    const emailVerified = parts[1] === 'verified';
    return {
      uid,
      email: `${uid}@example.com`,
      email_verified: emailVerified,
      firebase: {
        sign_in_provider: parts[2] || 'password'
      }
    };
  }

  const adminAuth = admin.auth();
  if (!adminAuth) {
    if (process.env.NODE_ENV === 'test') {
      const err = new Error('INVALID_TOKEN');
      err.code = 'INVALID_TOKEN';
      throw err;
    }
    const err = new Error('ADMIN_NOT_CONFIGURED');
    err.code = 'ADMIN_NOT_CONFIGURED';
    throw err;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    return decodedToken;
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      const err = new Error('TOKEN_EXPIRED');
      err.code = 'TOKEN_EXPIRED';
      throw err;
    }
    if (error.code === 'auth/id-token-revoked') {
      const err = new Error('TOKEN_REVOKED');
      err.code = 'TOKEN_REVOKED';
      throw err;
    }
    const err = new Error('INVALID_TOKEN');
    err.code = 'INVALID_TOKEN';
    err.details = error.message;
    throw err;
  }
}

/**
 * Higher-order middleware protecting API routes with Firebase authentication.
 *
 * @param {Function} handler - The Next.js API route handler
 * @param {Object} options - Configuration options
 * @param {boolean} [options.requireEmailVerified=true] - Whether email verification is required
 */
export function withAuth(handler, options = { requireEmailVerified: true }) {
  return async (req, res) => {
    try {
      const token = extractBearerToken(req);
      if (!token) {
        return res.status(401).json({
          success: false,
          code: 'UNAUTHORIZED',
          message: 'Authentication token required. Please sign in.'
        });
      }

      let decodedToken;
      try {
        decodedToken = await verifyIdToken(token);
      } catch (tokenErr) {
        if (tokenErr.code === 'ADMIN_NOT_CONFIGURED') {
          return res.status(503).json({
            success: false,
            code: 'SERVICE_UNAVAILABLE',
            message: 'Authentication service is temporarily unavailable.'
          });
        }
        if (tokenErr.code === 'TOKEN_EXPIRED' || tokenErr.code === 'TOKEN_REVOKED') {
          return res.status(401).json({
            success: false,
            code: tokenErr.code,
            message: 'Your session has expired. Please sign in again.'
          });
        }
        return res.status(401).json({
          success: false,
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication credentials.'
        });
      }

      // Enforce email verification for protected features.
      // Use the authoritative email_verified claim from the token — do NOT
      // grant a bypass based solely on the sign_in_provider being google.com.
      // Google OAuth users do receive email_verified=true from Firebase when
      // their Google email is verified, so this check is correct for all
      // providers.
      const provider = decodedToken.firebase?.sign_in_provider;
      const isVerified = decodedToken.email_verified === true;

      if (options.requireEmailVerified && !isVerified) {
        return res.status(403).json({
          success: false,
          code: 'EMAIL_VERIFICATION_REQUIRED',
          message: 'Email verification is required to access this feature. Please verify your email.'
        });
      }

      // Attach authoritative identity to request — sourced exclusively from
      // the verified token, never from client-supplied values.
      req.user = {
        uid: decodedToken.uid,
        firebaseUid: decodedToken.uid,
        userId: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: isVerified,
        name: decodedToken.name || decodedToken.display_name,
        provider: provider
      };

      // Ensure database connection
      if (process.env.NODE_ENV !== 'test') {
        await dbConnect();
      }

      // Resolve database user
      let dbUser = null;
      if (process.env.NODE_ENV !== 'test' || req._mockDb) {
        dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!dbUser && decodedToken.email) {
          // Fallback: check by email to support legacy account migration.
          // Only link if the token identity is verified — prevents an
          // unverified account from claiming an existing record.
          if (isVerified) {
            dbUser = await User.findOne({ email: decodedToken.email.toLowerCase().trim() });
            if (dbUser) {
              dbUser.firebaseUid = decodedToken.uid;
              dbUser.emailVerified = true;
              dbUser.lastLoginAt = new Date();
              await dbUser.save();
            }
          }
        }
      }

      req.dbUser = dbUser;

      return handler(req, res);
    } catch (err) {
      console.error('withAuth middleware unexpected error:', err);
      return res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected server error occurred.'
      });
    }
  };
}

export default withAuth;
