import React, { useContext } from 'react';
import { DarkModeContext } from '../App';

const Controls = ({ 
  isRunning, 
  onStart, 
  onPause, 
  onNext, 
  onReset, 
  onSpeedChange, 
  speed = 1,
  canNext = false,
  disabled = false 
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const buttonClasses = (variant = 'default') => {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case 'play':
        return `${baseClasses} ${
          isDarkMode 
            ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
            : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400'
        }`;
      case 'pause':
        return `${baseClasses} ${
          isDarkMode 
            ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500' 
            : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400'
        }`;
      case 'next':
        return `${baseClasses} ${
          isDarkMode 
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
            : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400'
        }`;
      case 'reset':
        return `${baseClasses} ${
          isDarkMode 
            ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' 
            : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
        }`;
      default:
        return `${baseClasses} ${
          isDarkMode 
            ? 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500' 
            : 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400'
        }`;
    }
  };

  return (
    <div className={`w-full p-4 rounded-lg shadow-md transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Algorithm Controls
      </h3>
      
      <div className="space-y-4">
        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {/* Play Button */}
          <button
            onClick={onStart}
            disabled={disabled || isRunning}
            className={buttonClasses('play')}
            aria-label="Start algorithm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Play</span>
            </div>
          </button>

          {/* Pause Button */}
          <button
            onClick={onPause}
            disabled={disabled || !isRunning}
            className={buttonClasses('pause')}
            aria-label="Pause algorithm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-1-1H7z" clipRule="evenodd" />
              </svg>
              <span>Pause</span>
            </div>
          </button>

          {/* Next Step Button */}
          <button
            onClick={onNext}
            disabled={disabled || isRunning || !canNext}
            className={buttonClasses('next')}
            aria-label="Next step"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Next Step</span>
            </div>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={disabled}
            className={buttonClasses('reset')}
            aria-label="Reset algorithm"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Reset</span>
            </div>
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <label className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Speed:
          </label>
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Slow
            </span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              disabled={disabled}
              className={`w-24 h-2 rounded-lg appearance-none cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'bg-gray-600 slider-thumb-dark' 
                  : 'bg-gray-200 slider-thumb-light'
              } disabled:opacity-50`}
            />
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Fast
            </span>
          </div>
          <span className={`text-sm font-mono ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {speed}x
          </span>
        </div>

        {/* Status Indicator */}
        <div className={`flex items-center justify-center sm:justify-start ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className={`flex items-center space-x-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isRunning 
                ? 'bg-green-500 animate-pulse' 
                : 'bg-gray-400'
            }`}></div>
            <span className="text-sm">
              {isRunning ? 'Running...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Custom CSS for slider thumb */}
      <style jsx>{`
        .slider-thumb-light::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider-thumb-dark::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
          border: 2px solid #374151;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider-thumb-light::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider-thumb-dark::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #60a5fa;
          cursor: pointer;
          border: 2px solid #374151;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Controls;
