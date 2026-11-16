import admin from './firebaseAdmin.js';
import dbConnect from './dbConnect.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

let cachedGoogleCerts = null;
let certsExpiry = 0;

async function getGooglePublicCerts() {
  const now = Date.now();
  if (cachedGoogleCerts && now < certsExpiry) {
    return cachedGoogleCerts;
  }
  try {
    const res = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
    if (!res.ok) throw new Error(`Failed to fetch Google public certs: ${res.status}`);
    const cacheControl = res.headers.get('cache-control') || '';
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;
    cachedGoogleCerts = await res.json();
    certsExpiry = now + (maxAge * 1000);
    return cachedGoogleCerts;
  } catch (err) {
    if (cachedGoogleCerts) return cachedGoogleCerts;
    throw err;
  }
}

async function verifyWithGooglePublicKeys(token) {
  const decoded = jwt.decode(token, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    const err = new Error('INVALID_TOKEN: Missing key ID in token header');
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  const certs = await getGooglePublicCerts();
  const certPem = certs[decoded.header.kid];
  if (!certPem) {
    const err = new Error(`INVALID_TOKEN: Unknown key ID ${decoded.header.kid}`);
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  let publicKey;
  try {
    publicKey = crypto.createPublicKey(certPem);
  } catch (keyErr) {
    publicKey = certPem;
  }

  const tokenAud = decoded.payload?.aud;
  const expectedProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'algomania-e0d2f';

  // Validate audience matches our Firebase project
  const targetAud = (tokenAud && (tokenAud === expectedProjectId || tokenAud === 'algomania-e0d2f'))
    ? tokenAud
    : expectedProjectId;

  try {
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      audience: targetAud,
      issuer: `https://securetoken.google.com/${targetAud}`,
      clockTolerance: 120
    });
    return payload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const e = new Error('TOKEN_EXPIRED');
      e.code = 'TOKEN_EXPIRED';
      throw e;
    }
    const e = new Error(`INVALID_TOKEN: ${err.message}`);
    e.code = 'INVALID_TOKEN';
    e.details = err.message;
    throw e;
  }
}

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
 * Verifies Firebase ID Token using Firebase Admin SDK or authoritative Google public certificates.
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

  // Path A: If Firebase Admin Auth instance is ready, attempt verification
  const adminAuth = admin.auth();
  if (adminAuth) {
    try {
      // Use checkRevoked: false to prevent IAM permission roundtrip failures
      const decodedToken = await adminAuth.verifyIdToken(token, false);
      return decodedToken;
    } catch (adminErr) {
      if (adminErr.code === 'auth/id-token-expired') {
        const err = new Error('TOKEN_EXPIRED');
        err.code = 'TOKEN_EXPIRED';
        throw err;
      }
      if (adminErr.code === 'auth/id-token-revoked') {
        const err = new Error('TOKEN_REVOKED');
        err.code = 'TOKEN_REVOKED';
        throw err;
      }
      console.warn('[AlgoMania Auth] Admin SDK verifyIdToken failed, falling back to Google public certs:', adminErr.message);
      // Fall through to Path B rather than failing immediately
    }
  }

  // Path B: Authoritative verification using Google's public certificates & RS256 JWKS
  try {
    const payload = await verifyWithGooglePublicKeys(token);
    return {
      uid: payload.sub || payload.user_id,
      email: payload.email,
      email_verified: payload.email_verified === true,
      name: payload.name || payload.display_name,
      firebase: payload.firebase || { sign_in_provider: 'password' },
      ...payload
    };
  } catch (error) {
    console.error('[AlgoMania Auth] Token verification rejected:', error.message, error.details || '');
    if (error.code === 'TOKEN_EXPIRED') throw error;
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
        console.error('[AlgoMania withAuth] Token rejected:', tokenErr.message, tokenErr.details || tokenErr.code || '');
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
