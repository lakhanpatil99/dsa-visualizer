import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { DarkModeContext } from '../../context/ThemeContext';

export default function VisualizerLayout({
  title,
  subtitle,
  category = 'Algorithm Laboratory',
  complexityBadge = null,
  leftSidebar,
  rightSidebar,
  bottomControls,
  children
}) {
  const { isDarkMode } = useContext(DarkModeContext);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState('canvas'); // 'left' | 'canvas' | 'right'

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors duration-200 selection:bg-[#EF592A]/20 selection:text-[#EF592A]">
      {/* Visualizer Top Bar */}
      <div className="w-full bg-[#FFFDF8] dark:bg-[#24231F] border-b border-[#DED9CE] dark:border-[#383630] px-4 sm:px-6 py-3.5 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase text-[#69665F] dark:text-[#A09D95]">
              <Link href="/" className="hover:text-[#EF592A] transition-colors">
                AlgoMania
              </Link>
              <span>/</span>
              <span className="text-[#EF592A] font-bold">{category}</span>
            </div>
            <div className="flex items-center space-x-3 mt-0.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#24231F] dark:text-[#FFFDF8]">
                {title}
              </h1>
              {complexityBadge && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] font-bold">
                  {complexityBadge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#69665F] dark:text-[#A09D95] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Sidebar Toggle Controls for Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {leftSidebar && (
              <button
                type="button"
                onClick={() => setLeftOpen(!leftOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  leftOpen
                    ? 'bg-[#E4E9DD] dark:bg-[#28382F] border-[#28533D]/30 text-[#28533D] dark:text-[#E4E9DD]'
                    : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630] text-[#69665F]'
                }`}
              >
                {leftOpen ? 'Hide Input' : 'Show Input'}
              </button>
            )}

            {rightSidebar && (
              <button
                type="button"
                onClick={() => setRightOpen(!rightOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  rightOpen
                    ? 'bg-[#E4E9DD] dark:bg-[#28382F] border-[#28533D]/30 text-[#28533D] dark:text-[#E4E9DD]'
                    : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630] text-[#69665F]'
                }`}
              >
                {rightOpen ? 'Hide Code & Specs' : 'Show Code & Specs'}
              </button>
            )}
          </div>

          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex rounded-lg border border-[#DED9CE] dark:border-[#383630] p-0.5 bg-[#F8F5ED] dark:bg-[#1A1916] text-xs font-mono">
            {leftSidebar && (
              <button
                onClick={() => setMobileTab('left')}
                className={`flex-1 py-1 px-2.5 rounded-md font-bold transition-all ${
                  mobileTab === 'left' ? 'bg-[#EF592A] text-[#FFFDF8]' : 'text-[#69665F]'
                }`}
              >
                Inputs
              </button>
            )}
            <button
              onClick={() => setMobileTab('canvas')}
              className={`flex-1 py-1 px-2.5 rounded-md font-bold transition-all ${
                mobileTab === 'canvas' ? 'bg-[#EF592A] text-[#FFFDF8]' : 'text-[#69665F]'
              }`}
            >
              Visualizer
            </button>
            {rightSidebar && (
              <button
                onClick={() => setMobileTab('right')}
                className={`flex-1 py-1 px-2.5 rounded-md font-bold transition-all ${
                  mobileTab === 'right' ? 'bg-[#EF592A] text-[#FFFDF8]' : 'text-[#69665F]'
                }`}
              >
                Specs
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Sidebar (Configuration & Input) */}
        {leftSidebar && (
          <aside
            className={`${
              leftOpen ? 'lg:flex' : 'lg:hidden'
            } ${
              mobileTab === 'left' ? 'flex w-full' : 'hidden'
            } lg:w-80 flex-col shrink-0 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl p-5 shadow-2xs overflow-y-auto space-y-4 max-h-[calc(100vh-210px)]`}
          >
            {leftSidebar}
          </aside>
        )}

        {/* Center Visualization Canvas */}
        <main
          className={`${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          } flex-1 flex-col overflow-hidden bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl shadow-2xs`}
        >
          <div className="flex-1 p-4 sm:p-6 overflow-auto min-h-[380px] sm:min-h-[460px]">
            {children}
          </div>

          {/* Bottom Execution Controls Bar */}
          {bottomControls && (
            <div className="border-t border-[#DED9CE] dark:border-[#383630] p-4 bg-[#F8F5ED] dark:bg-[#1E1D19]">
              {bottomControls}
            </div>
          )}
        </main>

        {/* Right Sidebar (Code & Metrics) */}
        {rightSidebar && (
          <aside
            className={`${
              rightOpen ? 'lg:flex' : 'lg:hidden'
            } ${
              mobileTab === 'right' ? 'flex w-full' : 'hidden'
            } lg:w-88 flex-col shrink-0 bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] rounded-2xl p-5 shadow-2xs overflow-y-auto space-y-4 max-h-[calc(100vh-210px)]`}
          >
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
