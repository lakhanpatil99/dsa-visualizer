import React from 'react';

export default function HeroEditorialGraphic() {
  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] bg-[#EF592A] text-[#FFFDF8] p-6 sm:p-10 flex flex-col justify-between overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl">
      {/* Top Margin Annotation */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-[#FFFDF8]/80 border-b border-[#FFFDF8]/20 pb-3">
        <span>01 // ARCHITECTURE</span>
        <span className="font-bold text-[#FFFDF8]">ALGORITHM INTUITION</span>
        <span>CS_LAB.STATE</span>
      </div>

      {/* Side Marginalia (Visible on larger screens) */}
      <div className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] font-mono tracking-widest text-[#FFFDF8]/60 uppercase">
        State Transitions & Memory
      </div>
      <div className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[10px] font-mono tracking-widest text-[#FFFDF8]/60 uppercase">
        Asymptotic Complexity
      </div>

      {/* Main Central Vector Artwork */}
      <div className="relative my-auto py-6 flex items-center justify-center">
        <svg
          viewBox="0 0 540 380"
          className="w-full max-w-[480px] h-auto drop-shadow-md select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Background Coordinate Grid / Diagram Lines */}
          <circle cx="270" cy="140" r="120" stroke="#FFFDF8" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.25" />
          <circle cx="270" cy="140" r="70" stroke="#FFFDF8" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
          <line x1="80" y1="140" x2="460" y2="140" stroke="#FFFDF8" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="270" y1="20" x2="270" y2="260" stroke="#FFFDF8" strokeWidth="1" strokeOpacity="0.2" />

          {/* Graph Network Connection Edges */}
          <path d="M 270 50 L 160 120" stroke="#28533D" strokeWidth="3" strokeLinecap="round" />
          <path d="M 270 50 L 380 120" stroke="#28533D" strokeWidth="3" strokeLinecap="round" />
          <path d="M 160 120 L 100 190" stroke="#28533D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 160 120 L 220 190" stroke="#28533D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 380 120 L 320 190" stroke="#28533D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 380 120 L 440 190" stroke="#28533D" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cross-edge graph linkage */}
          <path d="M 220 190 Q 270 215 320 190" stroke="#24231F" strokeWidth="2" strokeDasharray="3 3" />

          {/* Root Node (Deep Ink with Forest Green core) */}
          <g>
            <circle cx="270" cy="50" r="26" fill="#24231F" stroke="#FFFDF8" strokeWidth="2.5" />
            <circle cx="270" cy="50" r="18" fill="#28533D" />
            <text x="270" y="55" textAnchor="middle" fill="#FFFDF8" fontSize="13" fontWeight="bold" fontFamily="monospace">
              50
            </text>
            <text x="310" y="44" fill="#24231F" fontSize="10" fontWeight="bold" fontFamily="monospace">
              root
            </text>
          </g>

          {/* Level 1 Nodes */}
          <g>
            <circle cx="160" cy="120" r="22" fill="#28533D" stroke="#FFFDF8" strokeWidth="2" />
            <text x="160" y="125" textAnchor="middle" fill="#FFFDF8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              25
            </text>
          </g>

          <g>
            <circle cx="380" cy="120" r="22" fill="#28533D" stroke="#FFFDF8" strokeWidth="2" />
            <text x="380" y="125" textAnchor="middle" fill="#FFFDF8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              75
            </text>
          </g>

          {/* Level 2 Nodes */}
          <g>
            <circle cx="100" cy="190" r="18" fill="#24231F" stroke="#E4E9DD" strokeWidth="2" />
            <text x="100" y="194" textAnchor="middle" fill="#FFFDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              12
            </text>
          </g>

          <g>
            <circle cx="220" cy="190" r="18" fill="#24231F" stroke="#E4E9DD" strokeWidth="2" />
            <text x="220" y="194" textAnchor="middle" fill="#FFFDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              37
            </text>
          </g>

          <g>
            <circle cx="320" cy="190" r="18" fill="#24231F" stroke="#E4E9DD" strokeWidth="2" />
            <text x="320" y="194" textAnchor="middle" fill="#FFFDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              62
            </text>
          </g>

          <g>
            <circle cx="440" cy="190" r="18" fill="#24231F" stroke="#E4E9DD" strokeWidth="2" />
            <text x="440" y="194" textAnchor="middle" fill="#FFFDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              88
            </text>
          </g>

          {/* Array Strip with Sorting Pointers i and j */}
          <g transform="translate(45, 260)">
            {/* Array Container Background */}
            <rect x="0" y="0" width="450" height="64" rx="10" fill="#24231F" stroke="#FFFDF8" strokeWidth="2" />

            {/* Array Cell 0 */}
            <rect x="12" y="10" width="76" height="44" rx="6" fill="#28533D" />
            <text x="50" y="36" textAnchor="middle" fill="#FFFDF8" fontSize="14" fontWeight="bold" fontFamily="monospace">
              12
            </text>
            <text x="50" y="76" textAnchor="middle" fill="#FFFDF8" fontSize="9" fontFamily="monospace">
              [0]
            </text>

            {/* Array Cell 1 */}
            <rect x="98" y="10" width="76" height="44" rx="6" fill="#28533D" />
            <text x="136" y="36" textAnchor="middle" fill="#FFFDF8" fontSize="14" fontWeight="bold" fontFamily="monospace">
              25
            </text>
            <text x="136" y="76" textAnchor="middle" fill="#FFFDF8" fontSize="9" fontFamily="monospace">
              [1]
            </text>

            {/* Array Cell 2 — Active Comparison Pointer i (Highlighted in Soft Sage/White) */}
            <rect x="184" y="10" width="76" height="44" rx="6" fill="#FFFDF8" stroke="#EF592A" strokeWidth="3" />
            <text x="222" y="36" textAnchor="middle" fill="#24231F" fontSize="15" fontWeight="black" fontFamily="monospace">
              62
            </text>
            {/* Pointer i indicator badge */}
            <path d="M 222 58 L 227 68 L 217 68 Z" fill="#FFFDF8" />
            <text x="222" y="80" textAnchor="middle" fill="#FFFDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              ptr i
            </text>

            {/* Array Cell 3 — Active Comparison Pointer j (Swap Target) */}
            <rect x="270" y="10" width="76" height="44" rx="6" fill="#28533D" stroke="#FFFDF8" strokeWidth="2" strokeDasharray="3 3" />
            <text x="308" y="36" textAnchor="middle" fill="#FFFDF8" fontSize="15" fontWeight="black" fontFamily="monospace">
              37
            </text>
            {/* Pointer j indicator badge */}
            <path d="M 308 58 L 313 68 L 303 68 Z" fill="#FFFDF8" />
            <text x="308" y="80" textAnchor="middle" fill="#FFFDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">
              ptr j
            </text>

            {/* Array Cell 4 */}
            <rect x="356" y="10" width="76" height="44" rx="6" fill="#28533D" />
            <text x="394" y="36" textAnchor="middle" fill="#FFFDF8" fontSize="14" fontWeight="bold" fontFamily="monospace">
              88
            </text>
            <text x="394" y="76" textAnchor="middle" fill="#FFFDF8" fontSize="9" fontFamily="monospace">
              [4]
            </text>

            {/* Swap Curved Arrow */}
            <path
              d="M 222 4 Q 265 -18 308 4"
              stroke="#FFFDF8"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <polygon points="308,4 300,-1 303,8" fill="#FFFDF8" />
            <rect x="245" y="-22" width="40" height="15" rx="3" fill="#24231F" />
            <text x="265" y="-12" textAnchor="middle" fill="#FFFDF8" fontSize="8" fontWeight="bold" fontFamily="monospace">
              SWAP
            </text>
          </g>

          {/* Technical Notation Tags */}
          <g transform="translate(30, 20)">
            <rect x="0" y="0" width="112" height="22" rx="4" fill="#24231F" opacity="0.85" />
            <text x="56" y="15" textAnchor="middle" fill="#FFFDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              BST: BALANCED
            </text>
          </g>
          <g transform="translate(390, 20)">
            <rect x="0" y="0" width="120" height="22" rx="4" fill="#28533D" opacity="0.9" />
            <text x="60" y="15" textAnchor="middle" fill="#FFFDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              TIME: O(n log n)
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Punchy Editorial Statement */}
      <div className="pt-4 border-t border-[#FFFDF8]/20 space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-[#FFFDF8]/80 uppercase">
          Logic in motion
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#FFFDF8]">
          SEE EVERY STATE TRANSITION.
        </div>
      </div>
    </div>
  );
}
