import React, { useContext } from 'react';
import { DarkModeContext } from '../App';

const VisualizerCanvas = ({ 
  children, 
  width = 800, 
  height = 400, 
  className = "",
  title = "Visualization Canvas"
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`rounded-lg shadow-md transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border border-gray-700' 
        : 'bg-white border border-gray-200'
    } ${className}`}>
      {/* Canvas Header */}
      <div className={`px-4 py-3 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
      </div>
      
      {/* Canvas Content */}
      <div className={`p-4 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div 
          className={`w-full h-full rounded-md overflow-hidden ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}
          style={{ 
            minHeight: `${height}px`,
            maxWidth: `${width}px`,
            margin: '0 auto'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default VisualizerCanvas;
