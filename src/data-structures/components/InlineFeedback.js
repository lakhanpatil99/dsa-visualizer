import React from 'react';

export default function InlineFeedback({ message, type = 'info', onDismiss = null }) {
  if (!message) return null;

  const typeStyles = {
    success: 'bg-[#28533D]/10 border-[#28533D]/30 text-[#28533D] dark:text-[#E4E9DD]',
    error: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400',
    warning: 'bg-[#EF592A]/10 border-[#EF592A]/30 text-[#EF592A]',
    info: 'bg-[#F8F5ED] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8]'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono font-medium transition-all shadow-2xs ${typeStyles[type] || typeStyles.info}`}>
      <div className="flex items-center space-x-2">
        <span className="font-bold">{icons[type] || '•'}</span>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-3 text-[10px] opacity-60 hover:opacity-100 font-bold px-1.5 py-0.5 rounded"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
