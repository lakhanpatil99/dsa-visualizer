import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { DarkModeContext } from '../src/App';
import { useAuth } from '../src/contexts/AuthContext';
import ProgressDashboard from '../src/components/ProgressDashboard';

export default function Dashboard() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

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
        <title>Dashboard - AlgoMania</title>
        <meta name="description" content="Your DSA learning dashboard" />
      </Head>
      
      <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`p-6 border-b transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                AlgoMania Dashboard 🚀
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Interactive learning platform for Data Structures & Algorithms
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
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                Data Structures
              </Link>
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
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

        {/* Main Content Area - Your Actual ProgressDashboard */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome to Your Dashboard
              </h2>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Track your learning progress across all algorithms and data structures
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className={`p-6 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <div className="text-3xl font-bold text-blue-600">6</div>
                <div className="text-sm text-gray-500">Data Structures</div>
              </div>
              <div className={`p-6 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <div className="text-3xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-500">Sorting Algorithms</div>
              </div>
              <div className={`p-6 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <div className="text-3xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-500">Graph Algorithms</div>
              </div>
              <div className={`p-6 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              }`}>
                <div className="text-3xl font-bold text-yellow-600">4</div>
                <div className="text-sm text-gray-500">Tree Structures</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`p-6 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/app"
                  className={`p-4 rounded-lg border-2 border-dashed text-center transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-medium">Start Sorting</div>
                  <div className="text-sm text-gray-500">Learn sorting algorithms</div>
                </Link>
                <Link
                  href="/data-structures"
                  className={`p-4 rounded-lg border-2 border-dashed text-center transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-green-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="text-2xl mb-2">🏗️</div>
                  <div className="font-medium">Data Structures</div>
                  <div className="text-sm text-gray-500">Master fundamentals</div>
                </Link>
                <Link
                  href="/graphs"
                  className={`p-4 rounded-lg border-2 border-dashed text-center transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700' 
                      : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                  }`}
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium">Graph Algorithms</div>
                  <div className="text-sm text-gray-500">Explore connections</div>
                </Link>
              </div>
            </div>

            {/* Progress Dashboard Component */}
            <div className="mt-8">
              <ProgressDashboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
