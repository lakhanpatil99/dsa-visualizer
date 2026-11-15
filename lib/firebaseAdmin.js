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
  // Vercel stores multi-line env values with literal "\n" sequences.
  return key.replace(/\\n/g, '\n');
}

/** @returns {import('firebase-admin/app').App | null} */
function initializeFirebaseAdmin() {
  // Re-use an existing Admin app if already initialised (hot-reload safe).
  if (getApps().length > 0) {
    return getApp();
  }

  // --- Path 1: Full service-account JSON ---
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      return initializeApp({ credential: cert(serviceAccount) });
    } catch (err) {
      console.error(
        '[AlgoMania] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:',
        err.message
      );
    }
  }

  // --- Path 2: Individual env vars ---
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

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

  // --- No valid credentials available ---
  // DO NOT fall back to a different/demo project.  In production this means
  // token verification will fail with a clear error rather than silently
  // authenticating against the wrong project.
  console.error(
    '[AlgoMania] Firebase Admin SDK credentials are missing. ' +
    'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY ' +
    'in your Vercel environment variables.'
  );
  return null;
}

const adminApp = initializeFirebaseAdmin();

/**
 * Returns the Firebase Admin Auth instance associated with this app.
 * Passing the explicit app avoids accidentally using a stale default app.
 */
export function getAdminAuth() {
  if (!adminApp) {
    console.error(
      '[AlgoMania] Cannot obtain Admin Auth — Firebase Admin SDK is not initialised.'
    );
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
