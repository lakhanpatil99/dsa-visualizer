import React, { useContext } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../../context/ThemeContext';

const ProtectedFeature = ({ children, fallback, requireAuth = true }) => {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-xs font-mono text-[#69665F]">
        <svg className="animate-spin h-4 w-4 mr-2 text-[#EF592A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Authenticating...
      </div>
    );
  }

  if (!requireAuth || (isAuthenticated && isEmailVerified)) {
    return children;
  }

  if (isAuthenticated && !isEmailVerified) {
    return (
      <div className={`text-center p-5 rounded-2xl border ${
        isDarkMode 
          ? 'bg-[#24231F] border-[#EF592A]/30 text-[#FFFDF8]' 
          : 'bg-[#FFFDF8] border-[#EF592A]/30 text-[#24231F]'
      }`}>
        <h3 className="text-sm font-bold mb-1 text-[#EF592A]">Email Verification Required</h3>
        <p className="mb-3 text-xs text-[#69665F] dark:text-[#A09D95]">
          Verify your email to persist your algorithm progress across devices.
        </p>
        <Link
          href="/verify-email"
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#EF592A] hover:bg-[#D9481B] text-white transition-all shadow-xs"
        >
          Verify Email Now →
        </Link>
      </div>
    );
  }

  if (fallback) {
    return fallback;
  }

  return (
    <div className={`text-center p-5 rounded-2xl border ${
      isDarkMode 
        ? 'bg-[#24231F] border-[#383630]' 
        : 'bg-[#FFFDF8] border-[#DED9CE]'
    }`}>
      <h3 className="text-sm font-bold mb-1 text-[#24231F] dark:text-[#FFFDF8]">Authentication Required</h3>
      <p className="mb-3 text-xs text-[#69665F] dark:text-[#A09D95]">
        Sign in to save your algorithm milestones to your cloud profile.
      </p>
      <div className="flex items-center justify-center space-x-2">
        <Link
          href="/login"
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#24231F] text-white hover:bg-[#EF592A] transition-all shadow-xs"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default ProtectedFeature;
