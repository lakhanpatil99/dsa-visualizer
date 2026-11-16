import React from 'react';

/**
 * Professional Metallic Achievement Badges for AlgoMania Competitions.
 * Tier: bronze (20 solved), silver (100 solved), gold (200 solved).
 * Fully interactive with keyboard accessibility, hover state, and sample preview unlock modal.
 */

const BADGE_CONFIGS = {
  bronze: {
    name: 'Bronze Algorist',
    tierLabel: 'BRONZE TIER',
    threshold: 20,
    gradient: 'from-[#8C5028] via-[#CD7F32] to-[#5C3415]',
    glowColor: 'rgba(205, 127, 50, 0.35)',
    borderStyle: 'border-[#CD7F32]',
    ringColor: 'ring-[#CD7F32]/50',
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
    ringColor: 'ring-[#A0AEC0]/50',
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
    ringColor: 'ring-[#D4AF37]/60',
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
  const remaining = Math.max(0, config.threshold - currentCount);

  const sizeClasses = {
    sm: 'w-28 h-36 p-2 text-xs',
    md: 'w-40 h-52 p-3 text-sm',
    lg: 'w-56 h-64 p-4 text-base'
  }[size] || 'w-40 h-52 p-3 text-sm';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${config.name} (${config.tierLabel}) — ${unlocked ? 'Unlocked. Click to view credential.' : `Locked. ${currentCount} of ${config.threshold} solved. Click to preview credential.`}`}
      className={`group relative rounded-2xl flex flex-col items-center justify-between transition-all duration-300 border cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EF592A] hover:scale-[1.03] active:scale-[0.98] ${
        unlocked
          ? `${config.borderStyle} ${config.bgLight} dark:bg-[#1E1D19] shadow-md hover:shadow-xl ring-2 ${config.ringColor}`
          : 'border-[#DED9CE] dark:border-[#383630] bg-[#FAF8F3]/90 dark:bg-[#1E1D19]/90 hover:border-[#CD7F32]/60 hover:shadow-md'
      } ${sizeClasses}`}
      style={{
        boxShadow: unlocked
          ? `0 8px 24px ${config.glowColor}`
          : undefined
      }}
    >
      {/* Upper Tier Ribbon & Clickable Hint */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase">
        <span className={unlocked ? config.accentText : 'text-[#8E8B83]'}>
          {config.tierLabel}
        </span>
        <span className="text-[8px] font-mono text-[#8E8B83] group-hover:text-[#EF592A] transition-colors">
          {unlocked ? 'View →' : 'Preview ↗'}
        </span>
      </div>

      {/* Center Metallic Emblem */}
      <div className="relative my-auto flex items-center justify-center">
        {/* Outer Metallic Ring */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center p-1 bg-gradient-to-tr ${
            unlocked
              ? config.gradient
              : 'from-[#8C887E]/60 via-[#A8A49C]/80 to-[#706D65]/60'
          } shadow-inner`}
        >
          {/* Inner Core */}
          <div className="w-full h-full rounded-full bg-[#FFFDF8] dark:bg-[#181714] flex flex-col items-center justify-center shadow-md p-1 border border-white/20">
            {/* AlgoMania A monogram */}
            <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 50 15 L 20 85 L 38 85 L 50 55 L 62 85 L 80 85 Z"
                fill={unlocked ? config.iconColor : '#A09D95'}
              />
              <path
                d="M 38 65 Q 50 48 75 50"
                stroke={unlocked ? '#EF592A' : '#EF592A/70'}
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-full backdrop-blur-2xs transition-opacity group-hover:bg-black/15">
            <span className="text-base sm:text-lg">🔒</span>
          </div>
        )}
      </div>

      {/* Lower Details */}
      <div className="w-full text-center">
        <div className="text-[11px] sm:text-xs font-bold text-[#24231F] dark:text-[#FFFDF8] truncate">
          {config.name}
        </div>
        
        {unlocked ? (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#E4E9DD] dark:bg-[#28382F] text-[9px] font-mono text-[#28533D] dark:text-[#88C49F] font-semibold">
            Unlocked & Certified ✓
          </span>
        ) : (
          <div className="w-full mt-1.5 space-y-1">
            <div className="w-full bg-[#E4E9DD] dark:bg-[#2A2925] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#EF592A] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono text-[#69665F] dark:text-[#A09D95]">
              <span>{currentCount}/{config.threshold} Solved</span>
              <span className="text-[#EF592A] font-semibold">{remaining} to unlock</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
