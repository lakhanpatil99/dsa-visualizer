import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
}

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      return initializeApp({
        credential: cert(serviceAccount)
      });
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:', err);
    }
  }

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
      console.error('Failed to initialize Firebase Admin with environment credentials:', err);
    }
  }

  // Fallback for local development or CI where environment variables may not be set yet
  try {
    return initializeApp({
      projectId: projectId || 'algomania-dsa'
    });
  } catch (err) {
    console.warn('Firebase Admin initialized in mock/fallback mode:', err.message);
    return null;
  }
}

const adminApp = initializeFirebaseAdmin();

export function getAdminAuth() {
  try {
    return getAuth();
  } catch (err) {
    console.warn('getAuth fallback warning:', err.message);
    return null;
  }
}

const admin = {
  app: () => adminApp,
  apps: getApps(),
  auth: () => getAdminAuth()
};

export default admin;
export { adminApp };
