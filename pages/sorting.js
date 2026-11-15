import { useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../src/contexts/AuthContext';
import { DarkModeContext } from '../src/App';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function SortingPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const router = useRouter();

  return (
    <ProtectedRoute>
      <Head>
        <title>Sorting Algorithms - AlgoMania</title>
        <meta name="description" content="Master sorting algorithms interactively" />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <div className={`shadow border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-600">
                  AlgoMania 🚀
                </h1>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Interactive learning platform for Data Structures & Algorithms
                </p>
              </div>
              {/* Navigation Menu */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/app"
                  className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Visualizer
                </Link>
                <Link
                  href="/graphs"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Graphs
                </Link>
                <Link
                  href="/trees"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Trees
                </Link>
                <Link
                  href="/data-structures"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Data Structures
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
              </div>

              {/* User Controls */}
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user?.displayName || user?.name}
                </span>
                <Link
                  href="/account"
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-gray-300 dark:border-gray-600"
                >
                  Account
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-600">Sorting Algorithms Overview</h2>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Understand the mechanics, comparisons, swaps, and asymptotic complexity of core sorting techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className="text-xl font-bold text-blue-500 mb-2">Bubble Sort</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
              </p>
              <div className="text-xs space-y-1 font-mono text-gray-600 dark:text-gray-300">
                <div>Time (Worst): O(n²)</div>
                <div>Time (Best): O(n)</div>
                <div>Space: O(1)</div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className="text-xl font-bold text-green-500 mb-2">Quick Sort</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Divides and conquers by picking a pivot element and partitioning the array around it recursively.
              </p>
              <div className="text-xs space-y-1 font-mono text-gray-600 dark:text-gray-300">
                <div>Time (Average): O(n log n)</div>
                <div>Time (Worst): O(n²)</div>
                <div>Space: O(log n)</div>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className="text-xl font-bold text-purple-500 mb-2">Merge Sort</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Recursively splits the array in halves, sorts each half, and merges the sorted halves together.
              </p>
              <div className="text-xs space-y-1 font-mono text-gray-600 dark:text-gray-300">
                <div>Time (All): O(n log n)</div>
                <div>Space: O(n)</div>
                <div>Stability: Stable</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link
              href="/app"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Launch Interactive Visualizer
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
