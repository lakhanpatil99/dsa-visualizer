import React from 'react';

export default function ComplexityBox({
  complexity = null,
  timeComplexity = null,
  spaceComplexity = null,
  bestCase = null,
  averageCase = null,
  worstCase = null,
  title = "Complexity Analysis"
}) {
  const best = bestCase || complexity?.bestCase || complexity?.best || (timeComplexity ? timeComplexity : 'O(n)');
  const avg = averageCase || complexity?.averageCase || complexity?.average || (timeComplexity ? timeComplexity : 'O(n log n)');
  const worst = worstCase || complexity?.worstCase || complexity?.worst || complexity?.time || (timeComplexity ? timeComplexity : 'O(n²)');
  const space = spaceComplexity || complexity?.spaceComplexity || complexity?.space || 'O(1)';

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
