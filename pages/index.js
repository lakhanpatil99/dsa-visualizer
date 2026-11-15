import { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import { DarkModeContext } from '../context/ThemeContext';

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <Head>
        <title>AlgoMania - Interactive Algorithm Visualizer</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Master Data Structures & Algorithms through interactive visualizations"
        />
      </Head>

      <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <div className={`p-6 border-b transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-4xl font-bold text-blue-600 mb-2">
                AlgoMania
              </h1>
              <p className={`text-xl ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Interactive Algorithm & Data Structure Visualizer
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/account"
                    className={`text-sm font-medium hover:underline ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Welcome, {user?.displayName || user?.name}!
                  </Link>
                  <Link
                    href="/app"
                    className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Launch App
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md font-medium text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-md font-medium text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-md font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Register
                  </Link>
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

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className={`text-5xl font-extrabold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Master DSA with Interactive Visualizations
              </h2>
              <p className={`text-xl mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Learn sorting algorithms, graph traversal, tree structures, and data structures through 
                step-by-step visualizations. Track your progress and master complex algorithms with our interactive platform.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Sorting Algorithms</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Visualize Bubble Sort, Quick Sort, Merge Sort, and more with step-by-step animations.
                </p>
              </div>

              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="text-4xl mb-4">🕸️</div>
                <h3 className="text-xl font-semibold mb-2">Graph Algorithms</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Explore BFS, DFS, Dijkstra&apos;s algorithm, and shortest path problems interactively.
                </p>
              </div>

              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="text-4xl mb-4">🌳</div>
                <h3 className="text-xl font-semibold mb-2">Tree Structures</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Learn binary search trees, traversals (inorder, preorder, postorder) with animated operations.
                </p>
              </div>

              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}>
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold mb-2">Data Structures</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Explore arrays, linked lists, stacks, queues, and hash tables interactively.
                </p>
              </div>
            </div>

            {/* Authentication Buttons / App Access */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link
                    href="/app"
                    className="px-8 py-4 rounded-lg font-semibold text-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Go to Interactive Visualizer 🚀
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-8 py-4 rounded-lg font-semibold text-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Login to Continue
                    </Link>
                    <Link
                      href="/register"
                      className="px-8 py-4 rounded-lg font-semibold text-lg text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Create Free Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`py-6 border-t transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-400' 
            : 'bg-gray-100 border-gray-200 text-gray-600'
        }`}>
          <div className="text-center">
            <p className="text-sm">© Lakhansing Reserved 2025 - AlgoMania</p>
            <p className="text-xs mt-1">Interactive Algorithm and Data Structure Visualizer</p>
          </div>
        </footer>
      </div>
    </>
  );
}
