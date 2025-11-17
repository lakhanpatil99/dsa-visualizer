import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <>
     <Head>
  <title>AlgoMania - Interactive Algorithm Visualizer</title>

  {/* Favicon Logo */}
  <link rel="icon" href="/WhatsApp Image 2025-11-17 at 18.26.59_8bd9e24d.jpg" />

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
          <div className="flex items-center justify-between">
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
            <div className="text-right">
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                © Lakhansing Reserved 2025
              </div>
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
              {/* Sorting Algorithms */}
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

              {/* Graph Algorithms */}
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
                  Explore BFS, DFS, Dijkstra's algorithm, and shortest path problems interactively.
                </p>
              </div>

              {/* Tree Data Structures */}
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
                  Master binary trees, AVL trees, red-black trees, and more with interactive visualizations.
                </p>
              </div>

              {/* Data Structures */}
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

            {/* Authentication Buttons */}
            <div className="space-y-4">
              <div className="text-lg font-medium mb-4">
                <span className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Get started with AlgoMania:
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  Login to Continue
                </Link>
                
                <Link
                  href="/register"
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  Create New Account
                </Link>
              </div>
            </div>

            {/* Quick Access for Existing Users */}
            <div className="mt-8">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Already have an account? 
                <Link href="/login" className="text-blue-500 hover:text-blue-400 ml-1">
                  Login here
                </Link>
              </p>
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
