import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DarkModeContext } from '../App';
import ProtectedFeature from './ProtectedFeature';

const ProgressDashboard = () => {
  const [progressSummary, setProgressSummary] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { progressService, isAuthenticated } = useAuth();
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (isAuthenticated && progressService) {
      loadProgressData();
    }
  }, [isAuthenticated, progressService]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const [summary, progress] = await Promise.all([
        progressService.getProgressSummary(),
        progressService.fetchProgress()
      ]);
      
      setProgressSummary(summary);
      setAllProgress(progress.progress || []);
    } catch (error) {
      setError('Failed to load progress data');
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mastered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <svg className="animate-spin h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading progress...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-100 border border-red-400 text-red-700 rounded ${
        isDarkMode ? 'bg-red-900 border-red-700 text-red-200' : ''
      }`}>
        {error}
        <button 
          onClick={loadProgressData}
          className="ml-2 underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ProtectedFeature>
      <div className={`p-6 rounded-lg border ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 text-white' 
          : 'bg-white border-gray-200 text-gray-800'
      }`}>
        <h2 className="text-2xl font-bold mb-6">Your Learning Progress</h2>
        
        {/* Progress Summary Cards */}
        {progressSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="text-2xl font-bold text-blue-600">{progressSummary.totalAlgorithms}</div>
              <div className="text-sm">Total Algorithms</div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
            }`}>
              <div className="text-2xl font-bold text-green-600">{progressSummary.completed}</div>
              <div className="text-sm">Completed</div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="text-2xl font-bold text-yellow-600">{progressSummary.inProgress}</div>
              <div className="text-sm">In Progress</div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="text-2xl font-bold text-purple-600">{progressSummary.mastered}</div>
              <div className="text-sm">Mastered</div>
            </div>
          </div>
        )}

        {/* Detailed Progress List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Algorithm Details</h3>
          
          {allProgress.length === 0 ? (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <svg className="mx-auto h-12 w-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No progress recorded yet. Start learning algorithms to see your progress here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allProgress.map((progress) => (
                <div 
                  key={progress._id}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{progress.algorithmName}</h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {progress.algorithmType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      getStatusColor(progress.completionStatus)
                    }`}>
                      {progress.completionStatus.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {progress.stepsCompleted > 0 && (
                      <div>
                        <span className="font-medium">Progress:</span> {progress.stepsCompleted}/{progress.totalSteps}
                      </div>
                    )}
                    
                    {progress.timeSpent > 0 && (
                      <div>
                        <span className="font-medium">Time:</span> {formatTime(progress.timeSpent)}
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium">Last updated:</span> {new Date(progress.updatedAt).toLocaleDateString()}
                    </div>
                    
                    {progress.notes && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Notes:</span> {progress.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedFeature>
  );
};

export default ProgressDashboard;
