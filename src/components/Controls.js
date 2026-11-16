import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/ThemeContext';

export default function Controls({
  isRunning = false,
  onStart,
  onPause,
  onNext,
  onPrevious,
  onReset,
  onSpeedChange,
  speed = 1,
  canNext = true,
  canPrevious = false,
  currentStep = 0,
  totalSteps = 0,
  onScrub,
  disabled = false
}) {
  const { isDarkMode } = useContext(DarkModeContext);

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
    { label: '4x', value: 4 }
  ];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
      {/* Primary Actions: Play/Pause, Step, Prev, Reset */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={isRunning ? onPause : onStart}
          disabled={disabled}
          className="px-4 py-2 rounded-lg font-bold tracking-wider bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
        >
          <span>{isRunning ? 'PAUSE' : 'PLAY'}</span>
          <span>{isRunning ? '⏸' : '▶'}</span>
        </button>

        {/* Step Backward (if supported) */}
        {onPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={disabled || !canPrevious || isRunning}
            className="px-3 py-2 rounded-lg font-semibold bg-[#FFFDF8] dark:bg-[#24231F] text-[#24231F] dark:text-[#FFFDF8] border border-[#DED9CE] dark:border-[#383630] hover:border-[#24231F] dark:hover:border-[#FFFDF8] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            title="Step backward one operation"
          >
            ⏮ PREV
          </button>
        )}

        {/* Step Forward */}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={disabled || !canNext || isRunning}
            className="px-3.5 py-2 rounded-lg font-semibold bg-[#FFFDF8] dark:bg-[#24231F] text-[#24231F] dark:text-[#FFFDF8] border border-[#DED9CE] dark:border-[#383630] hover:border-[#24231F] dark:hover:border-[#FFFDF8] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            title="Step forward one operation"
          >
            STEP ⏭
          </button>
        )}

        {/* Reset Button */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="px-3 py-2 rounded-lg font-semibold text-[#69665F] dark:text-[#A09D95] hover:text-[#24231F] dark:hover:text-[#FFFDF8] border border-[#DED9CE] dark:border-[#383630] hover:bg-[#FFFDF8] dark:hover:bg-[#24231F] transition-colors disabled:opacity-40"
          >
            RESET ↺
          </button>
        )}
      </div>

      {/* Center Timeline Scrubber (if totalSteps > 0) */}
      {totalSteps > 0 && (
        <div className="flex items-center space-x-2 w-full sm:w-64">
          <span className="text-[11px] text-[#69665F] shrink-0 font-bold">
            {currentStep}/{totalSteps}
          </span>
          <input
            type="range"
            min={0}
            max={totalSteps}
            value={currentStep}
            disabled={disabled || isRunning}
            onChange={(e) => onScrub && onScrub(Number(e.target.value))}
            className="w-full accent-[#EF592A] cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      )}

      {/* Speed Controls */}
      <div className="flex items-center space-x-1.5 self-end sm:self-auto">
        <span className="text-[#69665F] dark:text-[#A09D95] font-bold text-[11px] mr-1">
          SPEED:
        </span>
        {speedOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSpeedChange && onSpeedChange(opt.value)}
            disabled={disabled}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              speed === opt.value
                ? 'bg-[#24231F] dark:bg-[#FFFDF8] text-[#FFFDF8] dark:text-[#24231F]'
                : 'bg-[#FFFDF8] dark:bg-[#24231F] text-[#69665F] dark:text-[#A09D95] border border-[#DED9CE] dark:border-[#383630] hover:text-[#24231F]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
