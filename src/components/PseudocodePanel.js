import React, { useContext } from 'react';
import { DarkModeContext } from '../App';

const PseudocodePanel = ({ title, code, currentLine = null }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const codeLines = code.split('\n');

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
          {title}
        </h3>
      </div>
      
      <div className={`p-4 font-mono text-sm overflow-auto max-h-96 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {codeLines.map((line, index) => {
          const lineNumber = index + 1;
          const isCurrentLine = currentLine === lineNumber;
          
          return (
            <div
              key={index}
              className={`py-1 px-2 rounded transition-all duration-200 ${
                isCurrentLine
                  ? isDarkMode
                    ? 'bg-blue-900 text-blue-100 border-l-4 border-blue-400'
                    : 'bg-blue-50 text-blue-800 border-l-4 border-blue-400'
                  : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Line Number */}
                <span className={`text-xs select-none ${
                  isCurrentLine
                    ? isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {lineNumber.toString().padStart(2, ' ')}
                </span>
                
                {/* Code Content */}
                <span className={`flex-1 ${
                  isCurrentLine
                    ? 'font-semibold'
                    : ''
                }`}>
                  {line || '\u00A0'}
                </span>
                
                {/* Current Line Indicator */}
                {isCurrentLine && (
                  <div className={`w-2 h-2 rounded-full ${
                    isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
                  } animate-pulse`}></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Scroll Indicator */}
      {codeLines.length > 20 && (
        <div className={`px-4 py-2 text-xs text-center border-t ${
          isDarkMode 
            ? 'border-gray-700 text-gray-400' 
            : 'border-gray-200 text-gray-500'
        }`}>
          Scroll to see more code
        </div>
      )}
    </div>
  );
};

export default PseudocodePanel;
