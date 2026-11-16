import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../audio/useAudio';

export default function AudioControls({ variant = 'compact', className = '' }) {
  const {
    soundEnabled,
    masterVolume,
    algorithmVolume,
    uiVolume,
    reducedSoundMode,
    toggleSound,
    setMasterVolume,
    setAlgorithmVolume,
    setUiVolume,
    setReducedSoundMode,
    previewSound
  } = useAudio();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const masterPercent = Math.round(masterVolume * 100);
  const algoPercent = Math.round(algorithmVolume * 100);
  const uiPercent = Math.round(uiVolume * 100);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Speaker trigger button */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute algorithm audio' : 'Unmute algorithm audio'}
          title={soundEnabled ? `Sound On (${masterPercent}%) - Click to Mute` : 'Sound Muted - Click to Enable'}
          className={`relative p-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e8590c]/40 ${
            soundEnabled
              ? 'bg-[#1a3826]/10 border-[#1a3826]/30 text-[#1a3826] hover:bg-[#1a3826]/20'
              : 'bg-[#f4efe8] border-[#e0d6cb] text-[#8c827a] hover:bg-[#ebe3d8]'
          }`}
        >
          {soundEnabled ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
          {soundEnabled && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1a3826]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Audio preferences menu"
          title="Open Audio Settings"
          className="p-1.5 rounded-lg border border-[#e0d6cb] bg-[#fbf9f5] hover:bg-[#f4efe8] text-[#5c544d] transition-colors focus:outline-none"
        >
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Popover Settings Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#fdfbf7] border border-[#e2d9cd] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#ebdcd0]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a3826]" />
              <h4 className="text-xs font-bold tracking-wider uppercase text-[#1a3826]">
                Audio Experience Engine
              </h4>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              soundEnabled ? 'bg-[#1a3826]/10 text-[#1a3826]' : 'bg-red-50 text-red-600'
            }`}>
              {soundEnabled ? 'Active' : 'Muted'}
            </span>
          </div>

          <div className="space-y-3.5 py-3 text-xs">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#2d2824]">Master Volume</span>
                <span className="font-mono text-[#786e65]">{masterPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={masterPercent}
                onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
                disabled={!soundEnabled}
                className="w-full h-1.5 bg-[#e8dfd3] rounded-lg appearance-none cursor-pointer accent-[#1a3826] disabled:opacity-40"
              />
            </div>

            {/* Algorithm Operations Volume */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#2d2824]">Algorithm Audio</span>
                <span className="font-mono text-[#786e65]">{algoPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={algoPercent}
                onChange={(e) => setAlgorithmVolume(Number(e.target.value) / 100)}
                disabled={!soundEnabled}
                className="w-full h-1.5 bg-[#e8dfd3] rounded-lg appearance-none cursor-pointer accent-[#e8590c] disabled:opacity-40"
              />
            </div>

            {/* UI Effects Volume */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#2d2824]">Interface & Clicks</span>
                <span className="font-mono text-[#786e65]">{uiPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={uiPercent}
                onChange={(e) => setUiVolume(Number(e.target.value) / 100)}
                disabled={!soundEnabled}
                className="w-full h-1.5 bg-[#e8dfd3] rounded-lg appearance-none cursor-pointer accent-[#1a3826] disabled:opacity-40"
              />
            </div>

            {/* Reduced Sound Mode */}
            <div className="pt-2 border-t border-[#ebdcd0]">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-[#2d2824]">Reduced Sound Mode</div>
                  <div className="text-[10px] text-[#786e65]">Mutes high-speed comparisons during fast playback</div>
                </div>
                <input
                  type="checkbox"
                  checked={reducedSoundMode}
                  onChange={(e) => setReducedSoundMode(e.target.checked)}
                  className="rounded border-[#c9beaf] text-[#1a3826] focus:ring-[#1a3826] w-4 h-4 ml-2"
                />
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-[#ebdcd0]">
            <button
              type="button"
              onClick={() => previewSound()}
              className="flex-1 py-1.5 px-3 rounded-lg border border-[#1a3826]/30 bg-[#1a3826]/5 hover:bg-[#1a3826]/15 text-[#1a3826] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Sound
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                soundEnabled
                  ? 'bg-[#f0ebe3] text-[#5c544d] hover:bg-[#e6dfd5]'
                  : 'bg-[#1a3826] text-white hover:bg-[#132a1c]'
              }`}
            >
              {soundEnabled ? 'Mute' : 'Enable'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
