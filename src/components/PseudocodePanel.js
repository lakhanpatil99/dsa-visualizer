import React from 'react';

export default function PseudocodePanel({ title = 'Algorithm Pseudocode', code = '', currentLine = null }) {
  const codeLines = code ? code.split('\n') : [];

  return (
    <div className="rounded-xl border border-[#DED9CE] dark:border-[#383630] bg-[#FFFDF8] dark:bg-[#24231F] p-4 space-y-3 shadow-2xs font-sans">
      <div className="flex items-center justify-between border-b border-[#DED9CE] dark:border-[#383630] pb-2.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#24231F] dark:text-[#FFFDF8]">
          {title}
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F5ED] dark:bg-[#1E1D19] border border-[#DED9CE] dark:border-[#383630] text-[#69665F] dark:text-[#A09D95]">
          Code Trace
        </span>
      </div>

      <div className="font-mono text-xs overflow-auto max-h-72 space-y-0.5 bg-[#F8F5ED] dark:bg-[#1A1916] p-2.5 rounded-lg border border-[#DED9CE] dark:border-[#383630]">
        {codeLines.map((line, index) => {
          const lineNumber = index + 1;
          const isCurrentLine = currentLine === lineNumber;

          return (
            <div
              key={index}
              className={`py-1 px-2 rounded transition-all flex items-start space-x-3 ${
                isCurrentLine
                  ? 'bg-[#F6DDD0] dark:bg-[#3D251A] text-[#24231F] dark:text-[#FFFDF8] font-bold border-l-4 border-[#EF592A]'
                  : 'text-[#69665F] dark:text-[#A09D95] hover:bg-[#FFFDF8] dark:hover:bg-[#24231F]'
              }`}
            >
              {/* Line Number */}
              <span className={`select-none text-[10px] font-bold ${
                isCurrentLine ? 'text-[#EF592A]' : 'text-[#69665F]/60'
              }`}>
                {lineNumber.toString().padStart(2, ' ')}
              </span>

              {/* Code Line */}
              <span className="flex-1 whitespace-pre-wrap break-all leading-relaxed">
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
