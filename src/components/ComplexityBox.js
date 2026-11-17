import React from 'react';

function extractString(val, fallback = 'O(1)') {
  if (typeof val === 'string' && val.trim().length > 0) return val;
  if (typeof val === 'number') return String(val);
  if (val && typeof val === 'object') {
    if (typeof val.worst === 'string') return val.worst;
    if (typeof val.worstCase === 'string') return val.worstCase;
    if (typeof val.average === 'string') return val.average;
    if (typeof val.averageCase === 'string') return val.averageCase;
    if (typeof val.best === 'string') return val.best;
    if (typeof val.bestCase === 'string') return val.bestCase;
    if (typeof val.time === 'string') return val.time;
    return fallback;
  }
  return fallback;
}

export default function ComplexityBox({
  complexity = null,
  timeComplexity = null,
  spaceComplexity = null,
  bestCase = null,
  averageCase = null,
  worstCase = null,
  title = "Complexity Analysis"
}) {
  const timeObj = typeof complexity?.time === 'object' && complexity?.time !== null ? complexity.time : null;
  const timeStr = typeof complexity?.time === 'string' ? complexity.time : null;

  const rawBest = bestCase || complexity?.bestCase || complexity?.best || timeObj?.best || timeObj?.bestCase || timeStr || timeComplexity;
  const rawAvg = averageCase || complexity?.averageCase || complexity?.average || timeObj?.average || timeObj?.averageCase || timeStr || timeComplexity;
  const rawWorst = worstCase || complexity?.worstCase || complexity?.worst || timeObj?.worst || timeObj?.worstCase || timeStr || timeComplexity;
  const rawSpace = spaceComplexity || complexity?.spaceComplexity || complexity?.space || 'O(1)';

  const best = extractString(rawBest, 'O(1)');
  const avg = extractString(rawAvg, 'O(n)');
  const worst = extractString(rawWorst, 'O(n²)');
  const space = extractString(rawSpace, 'O(1)');

  return (
    <div className="rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FFFDF8] dark:bg-[#24231F] p-4 space-y-3.5 shadow-2xs font-sans">
      <div className="flex items-center justify-between border-b border-[#DED9CE] dark:border-[#383630] pb-2.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
          {title}
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] font-bold">
          Asymptotics
        </span>
      </div>

      {/* Time Complexity Metrics */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold uppercase text-[#69665F] dark:text-[#A09D95] block">
          Time Bounds
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-[#F8F5ED] dark:bg-[#1E1D19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[9px] font-mono uppercase text-[#69665F] block">Best</span>
            <span className="text-xs font-mono font-bold text-[#28533D] dark:text-[#76A889]">
              {best}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-[#F8F5ED] dark:bg-[#1E1D19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[9px] font-mono uppercase text-[#69665F] block">Avg</span>
            <span className="text-xs font-mono font-bold text-[#EF592A]">
              {avg}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-[#F8F5ED] dark:bg-[#1E1D19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[9px] font-mono uppercase text-[#69665F] block">Worst</span>
            <span className="text-xs font-mono font-bold text-[#24231F] dark:text-[#FFFDF8]">
              {worst}
            </span>
          </div>
        </div>
      </div>

      {/* Auxiliary Space Complexity */}
      <div className="pt-2 border-t border-[#DED9CE] dark:border-[#383630] flex items-center justify-between text-xs font-mono">
        <span className="text-[#69665F] dark:text-[#A09D95]">Auxiliary Space:</span>
        <span className="font-bold text-[#24231F] dark:text-[#FFFDF8] px-2 py-0.5 rounded bg-[#F8F5ED] dark:bg-[#1E1D19] border border-[#DED9CE] dark:border-[#383630]">
          {space}
        </span>
      </div>
    </div>
  );
}
