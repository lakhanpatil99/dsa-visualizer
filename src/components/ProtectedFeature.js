import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../App';
import { useContext } from 'react';

const ProtectedFeature = ({ children, fallback, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </div>
    );
  }

  // If authentication is not required, always show children
  if (!requireAuth) {
    return children;
  }

  // If user is authenticated, show the protected content
  if (isAuthenticated) {
    return children;
  }

  // If user is not authenticated, show fallback or default message
  if (fallback) {
    return fallback;
  }

  // Default fallback message
  return (
    <div className={`text-center p-6 rounded-lg border-2 border-dashed ${
      isDarkMode 
        ? 'border-gray-600 text-gray-400 bg-gray-800' 
        : 'border-gray-300 text-gray-500 bg-gray-50'
    }`}>
      <svg className="mx-auto h-12 w-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
      <p className="mb-4">Please log in to access this feature.</p>
      <div className="space-x-3">
        <a
          href="/login"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } transition-colors`}
        >
          Login
        </a>
        <a
          href="/register"
          className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          } transition-colors`}
        >
          Register
        </a>
      </div>
    </div>
  );
};

export default ProtectedFeature;
