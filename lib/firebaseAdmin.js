import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// ---------------------------------------------------------------------------
// Firebase Admin SDK — Server-Side Only
// ---------------------------------------------------------------------------
// This module initialises the Firebase Admin SDK used by API routes to verify
// Firebase ID tokens and manage user accounts.
//
// Required environment variables (Vercel / .env.local — NEVER NEXT_PUBLIC):
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY
//
// Alternative:
//   FIREBASE_SERVICE_ACCOUNT_KEY   (complete JSON, single-line)
// ---------------------------------------------------------------------------

function formatPrivateKey(key) {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip surrounding quotes if present from env var values
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  // Vercel stores multi-line env values with literal "\n" sequences.
  return formatted.replace(/\\n/g, '\n');
}

/** @returns {import('firebase-admin/app').App | null} */
function initializeFirebaseAdmin() {
  // Re-use an existing Admin app if already initialised (hot-reload safe).
  if (getApps().length > 0) {
    return getApp();
  }

  // --- Path 1: Full service-account JSON ---
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT || process.env.SERVICE_ACCOUNT_KEY;
  if (serviceAccountString) {
    try {
      let parsed;
      if (serviceAccountString.trim().startsWith('{')) {
        parsed = JSON.parse(serviceAccountString);
      } else {
        try {
          const decoded = Buffer.from(serviceAccountString, 'base64').toString('utf8');
          parsed = JSON.parse(decoded);
        } catch (_) {
          parsed = JSON.parse(serviceAccountString);
        }
      }
      return initializeApp({ credential: cert(parsed) });
    } catch (err) {
      console.error(
        '[AlgoMania] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:',
        err.message
      );
    }
  }

  // --- Path 2: Individual env vars ---
  const projectId   = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID || 'algomania-e0d2f';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && rawKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formatPrivateKey(rawKey)
        })
      });
    } catch (err) {
      console.error(
        '[AlgoMania] Failed to initialize Firebase Admin with env credentials:',
        err.message
      );
    }
  }

  return null;
}

let adminApp = null;

/**
 * Returns the Firebase Admin Auth instance associated with this app.
 * Passing the explicit app avoids accidentally using a stale default app.
 */
export function getAdminAuth() {
  if (!adminApp && getApps().length > 0) {
    adminApp = getApp();
  }
  if (!adminApp) {
    adminApp = initializeFirebaseAdmin();
  }
  if (!adminApp) {
    return null;
  }
  try {
    return getAuth(adminApp);
  } catch (err) {
    console.error('[AlgoMania] getAdminAuth error:', err.message);
    return null;
  }
}

const admin = {
  app:  () => adminApp,
  apps: () => getApps(),
  auth: () => getAdminAuth()
};

export default admin;
export { adminApp };
