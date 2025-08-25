import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DarkModeContext } from '../../src/App';
import { useAuth } from '../../src/contexts/AuthContext';
import DataStructureVisualizer from '../../src/pages/DataStructureVisualizer';

export default function StackPage() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, logout, isAuthenticated, loading } = useAuth();

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <Head>
        <title>Stack - Data Structures | AlgoMania</title>
        <meta name="description" content="Interactive stack data structure visualization" />
      </Head>

      <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header with Navigation */}
        <div className={`p-6 border-b transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                Stack Data Structure
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                LIFO (Last In, First Out) - Interactive Visualization
              </p>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex items-center space-x-6">
              <Link
                href="/app"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Sorting
              </Link>
              <Link
                href="/graphs"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Graphs
              </Link>
              <Link
                href="/trees"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Trees
              </Link>
              <Link
                href="/data-structures"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Data Structures
              </Link>
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
            </div>

            {/* User Info and Dark Mode Toggle */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Welcome, {user?.username || user?.name}!
                  </span>
                  <button
                    onClick={logout}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className={`px-6 py-3 border-b ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-300' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/data-structures" className="hover:text-blue-500">
              Data Structures
            </Link>
            <span>/</span>
            <span className="font-medium">Stack</span>
          </div>
        </div>

        {/* Main Content Area - Your Actual DataStructureVisualizer */}
        <div className="flex-1">
          <DataStructureVisualizer />
        </div>
      </div>
    </>
  );
}
