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
 * Verifies Firebase ID Token using Firebase Admin SDK
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

  try {
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    return decodedToken;
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      const err = new Error('TOKEN_EXPIRED');
      err.code = 'TOKEN_EXPIRED';
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
        if (tokenErr.code === 'TOKEN_EXPIRED') {
          return res.status(401).json({
            success: false,
            code: 'TOKEN_EXPIRED',
            message: 'Your session has expired. Please sign in again.'
          });
        }
        return res.status(401).json({
          success: false,
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication credentials.'
        });
      }

      // Enforce email verification for protected features
      const provider = decodedToken.firebase?.sign_in_provider;
      const isEmailPassword = provider === 'password';
      const isVerified = decodedToken.email_verified === true || provider === 'google.com';

      if (options.requireEmailVerified && isEmailPassword && !isVerified) {
        return res.status(403).json({
          success: false,
          code: 'EMAIL_VERIFICATION_REQUIRED',
          message: 'Email verification is required to access this feature. Please verify your email.'
        });
      }

      // Attach authoritative identity to request
      req.user = {
        uid: decodedToken.uid,
        firebaseUid: decodedToken.uid,
        userId: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name || decodedToken.display_name,
        provider: provider
      };

      // Ensure database connection
      await dbConnect();

      // Resolve database user
      let dbUser = null;
      if (process.env.NODE_ENV !== 'test' || req._mockDb) {
        dbUser = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!dbUser && decodedToken.email) {
          // Fallback: check by email to support legacy account migration
          dbUser = await User.findOne({ email: decodedToken.email.toLowerCase().trim() });
          if (dbUser) {
            dbUser.firebaseUid = decodedToken.uid;
            dbUser.emailVerified = isVerified;
            dbUser.lastLoginAt = new Date();
            await dbUser.save();
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
