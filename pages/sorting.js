import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Added Link import

export default function SortingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false); // Added isDarkMode state

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sorting Algorithms - DSA Visualizer</title>
        <meta name="description" content="Visualize sorting algorithms interactively" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  DSA Visualizer 🚀
                </h1>
                <p className="text-gray-600 mt-1">
                  Interactive learning platform for Data Structures & Algorithms
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Sorting Algorithms Visualization
            </h2>
            <p className="text-xl text-gray-600">
              Learn and visualize different sorting algorithms step by step
            </p>
          </div>

          {/* Algorithm Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bubble Sort</h3>
              <p className="text-gray-600 mb-4">
                Simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Start Visualization
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Sort</h3>
              <p className="text-gray-600 mb-4">
                Efficient, in-place sorting algorithm that uses a divide-and-conquer strategy to sort elements.
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Start Visualization
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Merge Sort</h3>
              <p className="text-gray-600 mb-4">
                Divide-and-conquer algorithm that recursively breaks down the problem into smaller subproblems.
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                Start Visualization
              </button>
            </div>
          </div>

          {/* Navigation to other visualizers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Explore Other Algorithms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/graphs')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Graph Algorithms
              </button>
              <button
                onClick={() => router.push('/trees')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Tree Structures
              </button>
              <button
                onClick={() => router.push('/data-structures')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Data Structures
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
