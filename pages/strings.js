import React, { useState, useContext } from 'react';
import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ProtectedRoute from '../src/components/ProtectedRoute';
import VisualizerCanvas from '../src/components/VisualizerCanvas';
import ComplexityBox from '../src/components/ComplexityBox';
import PseudocodePanel from '../src/components/PseudocodePanel';
import VisualizerLayout from '../src/components/VisualizerLayout';
import { DarkModeContext } from '../context/ThemeContext';

import { kmpSearch, computePiTable, kmpComplexity } from '../src/algorithms/strings/kmp';

export default function StringsPage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [kmpResult, setKmpResult] = useState(() => kmpSearch('ABABDABACDABABCABAB', 'ABABCABAB'));
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const handleSearch = () => {
    if (!text || !pattern) return;
    const res = kmpSearch(text, pattern);
    setKmpResult(res);
    setCurrentStepIdx(0);
  };

  const currentStep = kmpResult.trace[currentStepIdx] || null;

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          INPUT STRINGS
        </span>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold mt-1 bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
            />
          </div>
          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">Pattern</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value.toUpperCase())}
              className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold mt-1 bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-[#FFFDF8]"
          >
            Run KMP Search
          </button>
        </div>
      </div>

      {/* Step Stepper */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          STEP-BY-STEP INSPECTOR
        </span>
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span>Step {currentStepIdx + 1} of {kmpResult.trace.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx(p => Math.max(0, p - 1))}
            className="py-2 rounded-xl border font-mono text-xs font-bold disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={currentStepIdx >= kmpResult.trace.length - 1}
            onClick={() => setCurrentStepIdx(p => Math.min(kmpResult.trace.length - 1, p + 1))}
            className="py-2 rounded-xl bg-[#28533D] text-[#FFFDF8] font-mono text-xs font-bold disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={kmpComplexity}
        title="KMP Asymptotics"
      />
      <PseudocodePanel
        title="KMP Prefix-Suffix Logic"
        code={`function kmp(text, pattern):
  pi = computePiTable(pattern)
  j = 0
  for i from 0 to n-1:
    while j > 0 and text[i] != pattern[j]:
      j = pi[j-1]
    if text[i] == pattern[j]: j++
    if j == m: reportMatch(i - m + 1)`}
        currentLine={1}
      />
    </div>
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>String Matching Lab - AlgoMania</title>
        <meta name="description" content="Master string algorithms with the interactive Knuth-Morris-Pratt (KMP) visualizer, live pi table, and mismatch rollback animations." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <VisualizerLayout
            title="String Matching Laboratory"
            subtitle="Knuth-Morris-Pratt (KMP) linear time pattern matching with longest proper prefix-suffix table"
            category="Pattern Search"
            complexityBadge="O(n + m)"
            leftSidebar={renderLeftSidebar()}
            rightSidebar={renderRightSidebar()}
          >
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-1">
                <VisualizerCanvas
                  width={900}
                  height={380}
                  title="KMP Character Alignment & Rolling Pointers"
                >
                  <div className="p-6 space-y-6">
                    {/* Text row */}
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#69665F] uppercase mb-1">Text String (T)</div>
                      <div className="flex flex-wrap gap-1 font-mono text-xs">
                        {text.split('').map((char, i) => {
                          const isActive = currentStep?.textIdx === i;
                          const isMatchStart = kmpResult.matches.includes(i);
                          return (
                            <div
                              key={i}
                              className={`w-8 h-9 rounded-lg border flex flex-col items-center justify-center transition-all ${
                                isActive
                                  ? 'bg-[#EF592A] text-[#FFFDF8] border-[#EF592A] scale-105'
                                  : isMatchStart
                                  ? 'bg-[#28533D] text-[#FFFDF8] border-[#28533D]'
                                  : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630]'
                              }`}
                            >
                              <span className="font-bold">{char}</span>
                              <span className="text-[8px] opacity-60">{i}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pattern row */}
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#69665F] uppercase mb-1">Pattern String (P)</div>
                      <div className="flex flex-wrap gap-1 font-mono text-xs">
                        {pattern.split('').map((char, j) => {
                          const isActive = currentStep?.patternIdx === j;
                          return (
                            <div
                              key={j}
                              className={`w-8 h-9 rounded-lg border flex flex-col items-center justify-center transition-all ${
                                isActive
                                  ? 'bg-[#28533D] text-[#FFFDF8] border-[#28533D] scale-105'
                                  : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630]'
                              }`}
                            >
                              <span className="font-bold">{char}</span>
                              <span className="text-[8px] opacity-60">{j}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pi Table */}
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#EF592A] uppercase mb-1">Computed π (Prefix-Suffix) Table</div>
                      <div className="flex flex-wrap gap-1 font-mono text-xs">
                        {kmpResult.piTable.map((val, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] flex items-center justify-center font-bold text-[#EF592A]"
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </VisualizerCanvas>
              </div>

              {/* Status Message */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2">
                  <div className="text-[#EF592A] font-bold">
                    {currentStep?.message || 'Search execution ready.'}
                  </div>
                  <div>
                    Matches Found: <strong>{kmpResult.matches.length > 0 ? kmpResult.matches.map(m => `Index ${m}`).join(', ') : 'None yet'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </VisualizerLayout>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
