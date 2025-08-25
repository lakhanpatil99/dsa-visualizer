import React, { useContext } from 'react';
import { DarkModeContext } from '../App';

const VisualizerLayout = ({ title, subtitle, leftSidebar, rightSidebar, bottomControls, children }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-6 border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              {title}
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {subtitle}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-1">AlgoMania</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              © Lakhansing Reserved 2025
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`w-80 border-r transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-6 h-full overflow-y-auto">
            {leftSidebar}
          </div>
        </div>

        {/* Center Visualization Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-hidden">
            {children}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`w-80 border-l transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-6 h-full overflow-y-auto">
            {rightSidebar}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      {bottomControls && (
        <div className={`border-t transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-4">
            {bottomControls}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizerLayout;
