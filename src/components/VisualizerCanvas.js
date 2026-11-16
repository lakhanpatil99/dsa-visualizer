import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/ThemeContext';

const VisualizerCanvas = ({
  children,
  width = 800,
  height = 400,
  className = "",
  title = "Visualization Canvas"
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`rounded-2xl shadow-xs border transition-colors duration-200 overflow-hidden ${isDarkMode
        ? 'bg-[#24231F] border-[#383630]'
        : 'bg-[#FFFDF8] border-[#DED9CE]'
      } ${className}`}>
      {/* Canvas Header */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between transition-colors ${isDarkMode ? 'border-[#383630] bg-[#1F1E1B]' : 'border-[#DED9CE] bg-[#FAF8F3]'
        }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF592A]"></span>
          <h3 className={`text-sm font-mono font-bold tracking-tight uppercase ${isDarkMode ? 'text-[#FFFDF8]' : 'text-[#24231F]'
            }`}>
            {title}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#69665F] dark:text-[#A09D95]">
          LIVE CANVAS
        </span>
      </div>

      {/* Canvas Content */}
      <div className={`p-4 sm:p-6 transition-colors ${isDarkMode ? 'bg-[#1A1916]' : 'bg-[#FAF8F3]'
        }`}>
        <div
          className={`w-full h-full rounded-xl overflow-hidden transition-colors border ${isDarkMode
              ? 'bg-[#24231F] border-[#383630]'
              : 'bg-[#FFFDF8] border-[#E8E4DA]'
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
