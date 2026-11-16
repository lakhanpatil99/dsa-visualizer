import React from 'react';

/**
 * Professional Metallic Achievement Badges for AlgoMania Competitions.
 * Tier: bronze (20 solved), silver (100 solved), gold (200 solved).
 */

const BADGE_CONFIGS = {
  bronze: {
    name: 'Bronze Algorist',
    tierLabel: 'BRONZE TIER',
    threshold: 20,
    gradient: 'from-[#8C5028] via-[#CD7F32] to-[#5C3415]',
    glowColor: 'rgba(205, 127, 50, 0.35)',
    borderStyle: 'border-[#CD7F32]',
    ringColor: 'ring-[#CD7F32]/40',
    accentText: 'text-[#CD7F32]',
    bgLight: 'bg-[#FAF4ED]',
    iconColor: '#CD7F32'
  },
  silver: {
    name: 'Silver Grandmaster',
    tierLabel: 'SILVER TIER',
    threshold: 100,
    gradient: 'from-[#4A5568] via-[#A0AEC0] to-[#2D3748]',
    glowColor: 'rgba(160, 174, 192, 0.4)',
    borderStyle: 'border-[#A0AEC0]',
    ringColor: 'ring-[#A0AEC0]/40',
    accentText: 'text-[#4A5568]',
    bgLight: 'bg-[#F7FAFC]',
    iconColor: '#A0AEC0'
  },
  gold: {
    name: 'Gold Algorithm Master',
    tierLabel: 'GOLD TIER',
    threshold: 200,
    gradient: 'from-[#976E1A] via-[#D4AF37] to-[#5C4210]',
    glowColor: 'rgba(212, 175, 55, 0.45)',
    borderStyle: 'border-[#D4AF37]',
    ringColor: 'ring-[#D4AF37]/50',
    accentText: 'text-[#D4AF37]',
    bgLight: 'bg-[#FAF7EE]',
    iconColor: '#D4AF37'
  }
};

export default function AchievementBadge({
  tier = 'bronze',
  unlocked = false,
  unlockedAt = null,
  currentCount = 0,
  onClick = null,
  size = 'md'
}) {
  const config = BADGE_CONFIGS[tier] || BADGE_CONFIGS.bronze;
  const progressPercent = Math.min(100, Math.round((currentCount / config.threshold) * 100));

  const sizeClasses = {
    sm: 'w-24 h-28 p-2 text-xs',
    md: 'w-36 h-44 p-3 text-sm',
    lg: 'w-48 h-56 p-4 text-base'
  }[size] || 'w-36 h-44 p-3 text-sm';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl flex flex-col items-center justify-between transition-all duration-300 border ${
        unlocked
          ? `${config.borderStyle} ${config.bgLight} dark:bg-[#1E1D19] shadow-md hover:scale-105 cursor-pointer ring-2 ${config.ringColor}`
          : 'border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3]/60 dark:bg-[#1A1916]/50 opacity-70 grayscale-60'
      } ${sizeClasses}`}
      style={{
        boxShadow: unlocked ? `0 8px 24px ${config.glowColor}` : 'none'
      }}
    >
      {/* Upper Tier Ribbon */}
      <div className="w-full text-center">
        <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${unlocked ? config.accentText : 'text-[#8E8B83]'}`}>
          {config.tierLabel}
        </span>
      </div>

      {/* Center Metallic Emblem */}
      <div className="relative my-auto flex items-center justify-center">
        {/* Outer Metallic Ring */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center p-1 bg-gradient-to-tr ${
            unlocked ? config.gradient : 'from-gray-400 to-gray-600'
          } shadow-inner`}
        >
          {/* Inner Core */}
          <div className="w-full h-full rounded-full bg-[#FFFDF8] dark:bg-[#181714] flex flex-col items-center justify-center shadow-md p-1 border border-white/20">
            {/* AlgoMania A monogram */}
            <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 50 15 L 20 85 L 38 85 L 50 55 L 62 85 L 80 85 Z"
                fill={unlocked ? config.iconColor : '#9CA3AF'}
              />
              <path
                d="M 38 65 Q 50 48 75 50"
                stroke="#EF592A"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[9px] font-mono font-bold text-[#24231F] dark:text-[#FFFDF8]">
              {config.threshold}+
            </span>
          </div>
        </div>

        {/* Lock Overlay if Locked */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full backdrop-blur-2xs">
            <span className="text-lg">🔒</span>
          </div>
        )}
      </div>

      {/* Lower Details */}
      <div className="w-full text-center">
        <div className="text-[11px] font-bold text-[#24231F] dark:text-[#FFFDF8] truncate">
          {config.name}
        </div>
        {unlocked ? (
          <span className="text-[9px] font-mono text-[#28533D] dark:text-[#88C49F] font-semibold">
            Unlocked ✓
          </span>
        ) : (
          <div className="w-full mt-1">
            <div className="w-full bg-[#E4E9DD] dark:bg-[#2A2925] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#EF592A] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[8px] font-mono text-[#69665F]">
              {currentCount} / {config.threshold} Solved
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
