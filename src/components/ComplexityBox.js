import React, { useContext } from 'react';
import { DarkModeContext } from '../App';

const ComplexityBox = ({ 
  timeComplexity, 
  spaceComplexity, 
  bestCase = null,
  averageCase = null,
  worstCase = null 
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`rounded-lg shadow-md transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Algorithm Complexity
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Time Complexity */}
        <div>
          <h4 className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Time Complexity
          </h4>
          <div className="space-y-2">
            {bestCase && (
              <div className="flex justify-between items-center">
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Best Case:
                </span>
                <span className={`text-sm font-mono font-semibold ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {bestCase}
                </span>
              </div>
            )}
            {averageCase && (
              <div className="flex justify-between items-center">
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Average Case:
                </span>
                <span className={`text-sm font-mono font-semibold ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  {averageCase}
                </span>
              </div>
            )}
            {worstCase && (
              <div className="flex justify-between items-center">
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Worst Case:
                </span>
                <span className={`text-sm font-mono font-semibold ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  {worstCase}
                </span>
              </div>
            )}
            {!bestCase && !averageCase && !worstCase && (
              <div className="flex justify-between items-center">
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Overall:
                </span>
                <span className={`text-sm font-mono font-semibold ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {timeComplexity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Space Complexity */}
        <div>
          <h4 className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Space Complexity
          </h4>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Memory Usage:
            </span>
            <span className={`text-sm font-mono font-semibold ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {spaceComplexity}
            </span>
          </div>
        </div>

        {/* Complexity Legend */}
        <div className={`pt-3 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h5 className={`text-xs font-medium mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Complexity Guide
          </h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                O(1) - Constant
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                O(log n) - Logarithmic
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                O(n) - Linear
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                O(n²) - Quadratic
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityBox;
