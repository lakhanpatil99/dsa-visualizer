import { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DarkModeContext } from '../src/App';
import { useAuth } from '../src/contexts/AuthContext';
import SortingVisualizer from '../src/pages/SortingVisualizer';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function App() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <ProtectedRoute>
      <Head>
        <title>AlgoMania - Interactive Algorithm Visualizer</title>
        <meta name="description" content="Visualize and understand sorting algorithms step by step" />
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
                AlgoMania
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Interactive Algorithm Visualizer
              </p>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex items-center space-x-6">
              <Link
                href="/app"
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
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
                  <Link
                    href="/account"
                    className={`text-sm font-medium hover:underline ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Welcome, {user?.displayName || user?.username || user?.name}!
                  </Link>
                  <Link
                    href="/account"
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
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

        {/* Main Content Area - SortingVisualizer */}
        <div className="flex-1">
          <SortingVisualizer />
        </div>
      </div>
    </ProtectedRoute>
  );
}
