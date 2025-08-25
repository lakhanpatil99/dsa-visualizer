import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DarkModeContext } from '../src/App';
import { useAuth } from '../src/contexts/AuthContext';

export default function DataStructures() {
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

  const dataStructureCategories = [
    {
      id: 'stack',
      title: 'Stack',
      description: 'LIFO (Last In, First Out) data structure',
      icon: '📚',
      color: 'blue',
      features: ['Push', 'Pop', 'Peek', 'isEmpty', 'Size'],
      complexity: 'O(1) for all operations'
    },
    {
      id: 'queue',
      title: 'Queue',
      description: 'FIFO (First In, First Out) data structure',
      icon: '🚶‍♂️',
      color: 'green',
      features: ['Enqueue', 'Dequeue', 'Front', 'isEmpty', 'Size'],
      complexity: 'O(1) for all operations'
    },
    {
      id: 'linked-list',
      title: 'Linked Lists',
      description: 'Dynamic data structure with nodes and pointers',
      icon: '🔗',
      color: 'purple',
      features: ['Singly', 'Doubly', 'Circular', 'Insert', 'Delete', 'Search'],
      complexity: 'O(n) for search, O(1) for insert/delete at ends'
    },
    {
      id: 'heap',
      title: 'Heap',
      description: 'Complete binary tree with heap property',
      icon: '🌳',
      color: 'yellow',
      features: ['Max Heap', 'Min Heap', 'Insert', 'Extract', 'Heapify'],
      complexity: 'O(log n) for insert/extract, O(n) for build'
    },
    {
      id: 'hash-table',
      title: 'Hash Table',
      description: 'Data structure for key-value pairs',
      icon: '🗂️',
      color: 'red',
      features: ['Insert', 'Delete', 'Search', 'Separate Chaining', 'Open Addressing'],
      complexity: 'O(1) average case, O(n) worst case'
    },
    {
      id: 'searching',
      title: 'Searching Algorithms',
      description: 'Algorithms to find elements in data structures',
      icon: '🔍',
      color: 'indigo',
      features: ['Linear Search', 'Binary Search', 'Step-by-step visualization'],
      complexity: 'O(n) for linear, O(log n) for binary'
    }
  ];

  return (
    <>
      <Head>
        <title>Data Structures - AlgoMania</title>
        <meta name="description" content="Interactive data structure visualizations" />
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
                Data Structures
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Interactive Data Structure Visualization
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

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Data Structures Mastery
              </h2>
              <p className={`text-xl ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Explore and master fundamental data structures with interactive visualizations
              </p>
            </div>

            {/* Data Structure Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {dataStructureCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-6 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600' 
                      : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <div className="text-6xl mb-4 text-center">{category.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3 text-center">{category.title}</h3>
                  <p className={`text-sm mb-4 text-center ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      Key Operations:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Complexity */}
                  <div className={`text-xs p-2 rounded mb-4 ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <div className="font-medium">Time Complexity:</div>
                    <div className="font-mono">{category.complexity}</div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => window.location.href = `/data-structures/${category.id}`}
                    className={`w-full px-4 py-3 rounded-md font-semibold transition-all duration-300 ${
                      category.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                      category.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' :
                      category.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                      category.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                      category.color === 'red' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    Start Learning {category.title}
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Access Section */}
            <div className={`text-center p-8 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-300' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-semibold mb-2">Ready to Master Data Structures?</h3>
              <p className="text-lg mb-4">
                Each data structure comes with interactive visualizations, step-by-step explanations, 
                and complexity analysis to help you understand the concepts deeply.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/data-structures/stack'}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
                >
                  Start with Stack
                </button>
                <button
                  onClick={() => window.location.href = '/data-structures/queue'}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
                >
                  Try Queue
                </button>
                <button
                  onClick={() => window.location.href = '/data-structures/linked-list'}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold transition-colors"
                >
                  Explore Linked Lists
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
