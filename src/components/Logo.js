import React from 'react';
import Link from 'next/link';

/**
 * Official AlgoMania Logo Component
 * Single source of truth for the forest-green and burnt-orange logo.
 * Enforces proper responsive sizing, aspect-ratio preservation, and high-contrast rendering.
 *
 * Sizing Specifications:
 * - Desktop header: ~180-210px wide (sm:w-[195px])
 * - Mobile header: ~140-160px wide (w-[145px])
 * - Internal navigation: ~150-180px wide (w-[155px] sm:w-[175px])
 * - Footer: ~160-190px wide (w-[165px] sm:w-[185px])
 * - Auth screens: ~180-220px wide (w-[185px] sm:w-[210px])
 */
export default function Logo({
  variant = 'header', // 'header' | 'auth' | 'footer' | 'internal' | 'icon'
  asLink = true,
  href = '/',
  className = '',
  surfaceOnDark = true
}) {
  // Dimensions calibrated to preserve the exact 3:1 aspect ratio of the 2172x724 master asset
  let sizeClasses = 'w-[145px] sm:w-[195px]';

  switch (variant) {
    case 'header':
      // Mobile: ~140-160px wide, Desktop: ~180-210px wide
      sizeClasses = 'w-[145px] sm:w-[195px] max-h-[50px] sm:max-h-[66px]';
      break;
    case 'auth':
      // Authentication screens: ~180-220px wide
      sizeClasses = 'w-[185px] sm:w-[210px] max-h-[62px] sm:max-h-[72px]';
      break;
    case 'internal':
      // Internal navigation: ~150-180px wide
      sizeClasses = 'w-[155px] sm:w-[175px] max-h-[52px] sm:max-h-[60px]';
      break;
    case 'footer':
      // Footer: ~160-190px wide
      sizeClasses = 'w-[165px] sm:w-[185px] max-h-[56px] sm:max-h-[64px]';
      break;
    case 'icon':
      // Compact A monogram icon
      sizeClasses = 'w-9 h-9 sm:w-10 sm:h-10';
      break;
    default:
      sizeClasses = 'w-[145px] sm:w-[195px] max-h-[50px] sm:max-h-[66px]';
  }

  // Dark background surface wrapper to guarantee razor-sharp contrast for dark-green letters
  const surfaceClasses = surfaceOnDark
    ? 'dark:bg-[#FFFDF8] dark:px-2 dark:py-0.5 sm:dark:px-2.5 sm:dark:py-1 dark:rounded-xl dark:shadow-xs transition-colors'
    : '';

  const imageElement = variant === 'icon' ? (
    <img
      src="/brand/algomania-icon.png"
      alt="AlgoMania — Interactive Algorithm Lab"
      width={40}
      height={40}
      style={{ width: 'auto', height: 'auto' }}
      className={`object-contain select-none ${sizeClasses} ${className}`}
    />
  ) : (
    <div className={`inline-flex items-center justify-center ${surfaceClasses}`}>
      <img
        src="/brand/algomania-logo.png"
        alt="AlgoMania — Interactive Algorithm Lab"
        width={2172}
        height={724}
        style={{ width: 'auto', height: 'auto', objectFit: 'contain' }}
        className={`object-contain select-none ${sizeClasses} ${className}`}
        loading="eager"
      />
    </div>
  );

  if (!asLink) {
    return imageElement;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EF592A] rounded-xl transition-transform hover:opacity-95 active:scale-[0.99]"
      aria-label="AlgoMania — Interactive Algorithm Lab"
    >
      {imageElement}
    </Link>
  );
}
