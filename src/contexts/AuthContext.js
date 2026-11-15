import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';
import * as authService from '../../lib/authService.js';
import ProgressService from '../services/progressService.js';

// Explicit Authentication States
export const AuthStates = {
  INITIALIZING: 'INITIALIZING',
  SIGNED_OUT: 'SIGNED_OUT',
  AUTHENTICATING: 'AUTHENTICATING',
  AUTHENTICATED: 'AUTHENTICATED',
  EMAIL_VERIFICATION_REQUIRED: 'EMAIL_VERIFICATION_REQUIRED',
  PROFILE_SYNCHRONIZING: 'PROFILE_SYNCHRONIZING',
  AUTH_ERROR: 'AUTH_ERROR'
};

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(AuthStates.INITIALIZING);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Helper to retrieve fresh ID token on demand
  const getIdToken = useCallback(async (forceRefresh = false) => {
    if (!auth || !auth.currentUser) return null;
    try {
      const token = await auth.currentUser.getIdToken(forceRefresh);
      setIdToken(token);
      return token;
    } catch (err) {
      console.error('Failed to get fresh ID token:', err);
      return null;
    }
  }, []);

  // Synchronize user profile with MongoDB
  const syncWithBackend = useCallback(async (user, token) => {
    try {
      setAuthState(AuthStates.PROFILE_SYNCHRONIZING);
      const profile = await authService.syncUserWithBackend(token);
      setDbUser(profile);
      setAuthState(AuthStates.AUTHENTICATED);
      setAuthError(null);
      return profile;
    } catch (err) {
      console.error('Backend user sync failed:', err);
      // Fail-closed with recoverable state: do not create fake authenticated user on database failure
      setDbUser(null);
      setAuthError('Unable to synchronize profile with database. Please click retry to reconnect.');
      setAuthState(AuthStates.AUTH_ERROR);
      throw err;
    }
  }, []);

  // Main Firebase Auth State Observer
  useEffect(() => {
    if (!auth) {
      setAuthState(AuthStates.SIGNED_OUT);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setDbUser(null);
        setIdToken(null);
        setAuthState(AuthStates.SIGNED_OUT);
        return;
      }

      setFirebaseUser(user);

      // Check authoritative email_verified flag
      const isVerified = user.emailVerified === true;

      if (!isVerified) {
        setAuthState(AuthStates.EMAIL_VERIFICATION_REQUIRED);
        return;
      }

      // User is verified, obtain token and sync with backend
      try {
        const token = await user.getIdToken();
        setIdToken(token);
        await syncWithBackend(user, token);
      } catch (err) {
        console.error('Error during auth state change processing:', err);
        setAuthError(authService.getFriendlyAuthErrorMessage(err));
        setAuthState(AuthStates.AUTH_ERROR);
      }
    });

    return () => unsubscribe();
  }, [syncWithBackend]);

  // Keep ID token fresh across expirations
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cross-tab logout and state synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'algomania_logout_event') {
        if (auth && auth.currentUser) {
          auth.signOut();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Registration handler
  const register = useCallback(async (fullName, email, password) => {
    setAuthState(AuthStates.AUTHENTICATING);
    setAuthError(null);
    try {
      const { user, verificationSent } = await authService.registerWithEmailPassword(
        fullName,
        email,
        password
      );
      setFirebaseUser(user);
      setAuthState(AuthStates.EMAIL_VERIFICATION_REQUIRED);
      return {
        success: true,
        verificationSent,
        message: 'Account created! Please check your email to verify your account.'
      };
    } catch (err) {
      const msg = authService.getFriendlyAuthErrorMessage(err);
      setAuthError(msg);
      setAuthState(AuthStates.SIGNED_OUT);
      return { success: false, message: msg };
    }
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setAuthState(AuthStates.AUTHENTICATING);
    setAuthError(null);
    try {
      const user = await authService.loginWithEmailPassword(email, password);
      setFirebaseUser(user);

      if (!user.emailVerified) {
        setAuthState(AuthStates.EMAIL_VERIFICATION_REQUIRED);
        return {
          success: true,
          emailVerified: false,
          message: 'Please verify your email address to access AlgoMania.'
        };
      }

      const token = await user.getIdToken();
      setIdToken(token);
      await syncWithBackend(user, token);

      return {
        success: true,
        emailVerified: true,
        message: 'Login successful! Welcome back.'
      };
    } catch (err) {
      const msg = authService.getFriendlyAuthErrorMessage(err);
      setAuthError(msg);
      setAuthState(AuthStates.SIGNED_OUT);
      return { success: false, message: msg };
    }
  }, [syncWithBackend]);

  // Google Login handler
  const loginWithGoogle = useCallback(async () => {
    setAuthState(AuthStates.AUTHENTICATING);
    setAuthError(null);
    try {
      const user = await authService.loginWithGoogle();
      setFirebaseUser(user);

      const token = await user.getIdToken();
      setIdToken(token);
      await syncWithBackend(user, token);

      return {
        success: true,
        message: 'Signed in with Google successfully!'
      };
    } catch (err) {
      const msg = authService.getFriendlyAuthErrorMessage(err);
      setAuthError(msg);
      setAuthState(AuthStates.SIGNED_OUT);
      return { success: false, message: msg };
    }
  }, [syncWithBackend]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await authService.logoutUser();
      // Notify other browser tabs
      if (typeof window !== 'undefined') {
        localStorage.setItem('algomania_logout_event', Date.now().toString());
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setFirebaseUser(null);
      setDbUser(null);
      setIdToken(null);
      setAuthState(AuthStates.SIGNED_OUT);
      setAuthError(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, []);

  // Reload user state (used when user returns after clicking verification email)
  const refreshUser = useCallback(async () => {
    if (!auth || !auth.currentUser) return null;
    try {
      const refreshedUser = await authService.reloadCurrentUser();
      setFirebaseUser({ ...refreshedUser });

      if (refreshedUser && refreshedUser.emailVerified) {
        const token = await refreshedUser.getIdToken(true);
        setIdToken(token);
        await syncWithBackend(refreshedUser, token);
        return { verified: true };
      }
      return { verified: false };
    } catch (err) {
      console.error('Error refreshing user status:', err);
      return { verified: false, error: err.message };
    }
  }, [syncWithBackend]);

  // Resend verification email
  const resendVerification = useCallback(async () => {
    try {
      await authService.resendVerificationEmail(firebaseUser);
      return { success: true, message: 'Verification email sent. Please check your inbox.' };
    } catch (err) {
      return { success: false, message: authService.getFriendlyAuthErrorMessage(err) };
    }
  }, [firebaseUser]);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      await authService.requestPasswordReset(email);
      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (err) {
      return { success: false, message: authService.getFriendlyAuthErrorMessage(err) };
    }
  }, []);

  // Progress service instance with fresh token accessor
  const progressService = useMemo(() => {
    if (!idToken) return null;
    return new ProgressService(idToken, getIdToken);
  }, [idToken, getIdToken]);

  // Retry backend synchronization
  const retrySync = useCallback(async () => {
    if (!firebaseUser) return null;
    try {
      setAuthError(null);
      const token = await getIdToken(true);
      if (token) {
        return await syncWithBackend(firebaseUser, token);
      }
    } catch (err) {
      console.error('Retry sync failed:', err);
      return null;
    }
  }, [firebaseUser, getIdToken, syncWithBackend]);

  // Unified user object for backward compatibility with existing components
  const unifiedUser = useMemo(() => {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      firebaseUid: firebaseUser.uid,
      id: dbUser?._id || firebaseUser.uid,
      _id: dbUser?._id || firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || dbUser?.displayName || firebaseUser.email?.split('@')[0] || 'User',
      username: dbUser?.username || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      displayName: firebaseUser.displayName || dbUser?.displayName,
      photoURL: firebaseUser.photoURL || dbUser?.photoURL,
      emailVerified: firebaseUser.emailVerified,
      createdAt: dbUser?.createdAt || firebaseUser.metadata?.creationTime
    };
  }, [firebaseUser, dbUser]);

  const value = {
    // States
    authState,
    loading: authState === AuthStates.INITIALIZING || authState === AuthStates.AUTHENTICATING || authState === AuthStates.PROFILE_SYNCHRONIZING,
    isAuthenticated: authState === AuthStates.AUTHENTICATED,
    isEmailVerified: !!firebaseUser && firebaseUser.emailVerified === true,
    
    // User objects
    user: unifiedUser,
    firebaseUser,
    dbUser,
    token: idToken,
    getIdToken,

    // Error
    error: authError,
    clearError: () => setAuthError(null),

    // Actions
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
    resendVerification,
    forgotPassword,
    retrySync,
    progressService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
