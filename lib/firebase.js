import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';

// ---------------------------------------------------------------------------
// Firebase Web SDK Configuration
// ---------------------------------------------------------------------------
// All values MUST come from NEXT_PUBLIC_* environment variables set in Vercel
// and/or .env.local.  No fallback to a different project is permitted in
// production — that would silently authenticate against the wrong identity
// pool.
// ---------------------------------------------------------------------------

const requiredKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            || '',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         || '',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             || '',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID     || ''
};

// Validate that the three critical config values are present.
// During SSR / static prerendering the browser env vars may legitimately be
// empty strings, so we only hard-error when running in the browser.
const isBrowser = typeof window !== 'undefined';
const configMissing = isBrowser && requiredKeys.some(
  (key) => !process.env[key]
);

if (configMissing) {
  console.error(
    '[AlgoMania] Firebase configuration is incomplete. ' +
    'Ensure the following NEXT_PUBLIC_* environment variables are set in your ' +
    'Vercel project and that a fresh deployment was triggered after adding them:\n' +
    requiredKeys.filter((k) => !process.env[k]).join(', ')
  );
}

// Initialize Firebase safely (avoid multiple initializations)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.error('[AlgoMania] Failed to initialize Firebase app:', e.message);
  app = null;
}

// Initialize Firebase Auth — browser only
let auth = null;
if (isBrowser && app) {
  try {
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('[AlgoMania] Firebase persistence warning:', err.message);
    });
  } catch (e) {
    console.error('[AlgoMania] Failed to initialize Firebase Auth:', e.message);
    auth = null;
  }
}

// Configure Google Provider
let googleProvider = null;
try {
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  console.warn('[AlgoMania] Could not create GoogleAuthProvider:', e.message);
}

export { app, auth, googleProvider };
export default app;
