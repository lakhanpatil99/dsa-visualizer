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

import { solveNQueens, nQueensComplexity } from '../src/algorithms/backtracking/nQueens';
import { dispatchAudio, AudioEventTypes } from '../src/audio';

export default function BacktrackingPage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [boardSize, setBoardSize] = useState(4);
  const [simulation, setSimulation] = useState(() => solveNQueens(4));
  const [stepIdx, setStepIdx] = useState(0);

  const handleSizeChange = (newSize) => {
    const size = Math.max(4, Math.min(6, newSize));
    setBoardSize(size);
    const sim = solveNQueens(size);
    setSimulation(sim);
    setStepIdx(0);
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const handleNextStep = () => {
    if (stepIdx < simulation.trace.length - 1) {
      const nextIdx = stepIdx + 1;
      setStepIdx(nextIdx);
      const st = simulation.trace[nextIdx];
      if (st) {
        if (st.action === 'solution') {
          dispatchAudio(AudioEventTypes.BACKTRACK_SOLUTION, { priority: true, force: true });
        } else if (st.action === 'backtrack' || st.action === 'dead_end') {
          dispatchAudio(AudioEventTypes.BACKTRACK_DEAD_END);
        } else {
          dispatchAudio(AudioEventTypes.BACKTRACK_BRANCH);
        }
      }
    }
  };

  const currentStep = simulation.trace[stepIdx] || null;
  const currentBoard = currentStep?.board || Array.from({ length: boardSize }, () => new Array(boardSize).fill(0));

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          CHESSBOARD DIMENSION
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[4, 5, 6].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleSizeChange(n)}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                boardSize === n
                  ? 'bg-[#EF592A] text-[#FFFDF8]'
                  : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8]'
              }`}
            >
              {n} × {n}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          RECURSION STEPPER
        </span>
        <div className="text-xs font-mono mb-2">
          Step {stepIdx + 1} of {simulation.trace.length}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={stepIdx === 0}
            onClick={() => setStepIdx(p => Math.max(0, p - 1))}
            className="py-2 rounded-xl border font-mono text-xs font-bold disabled:opacity-40"
          >
            ← Undo
          </button>
          <button
            type="button"
            disabled={stepIdx >= simulation.trace.length - 1}
            onClick={handleNextStep}
            className="py-2 rounded-xl bg-[#28533D] text-[#FFFDF8] font-mono text-xs font-bold disabled:opacity-40"
          >
            Step →
          </button>
        </div>
      </div>
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={nQueensComplexity}
        title="Backtracking Specs"
      />
      <PseudocodePanel
        title="N-Queens Backtracking Logic"
        code={`function solveNQueens(board, col):
  if col >= N: return true
  for row from 0 to N-1:
    if isSafe(board, row, col):
      board[row][col] = 1
      if solveNQueens(board, col + 1):
        return true
      board[row][col] = 0 // backtrack`}
        currentLine={1}
      />
    </div>
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>Backtracking Laboratory - AlgoMania</title>
        <meta name="description" content="Interactive N-Queens solver visualizer with recursion backtracking and conflict pruning." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <VisualizerLayout
            title="Backtracking & Recursion Laboratory"
            subtitle="N-Queens constraint satisfaction with recursive branch exploration and conflict pruning"
            category="Backtracking"
            complexityBadge="O(N!)"
            leftSidebar={renderLeftSidebar()}
            rightSidebar={renderRightSidebar()}
          >
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-1">
                <VisualizerCanvas
                  width={900}
                  height={420}
                  title={`N-Queens Chessboard (${boardSize}×${boardSize})`}
                >
                  <div className="flex items-center justify-center p-6 h-full">
                    <div
                      className="grid border-2 border-[#24231F] rounded-xl overflow-hidden shadow-sm"
                      style={{
                        gridTemplateColumns: `repeat(${boardSize}, 56px)`
                      }}
                    >
                      {currentBoard.map((row, r) =>
                        row.map((cell, c) => {
                          const isDarkSquare = (r + c) % 2 === 1;
                          const hasQueen = cell === 1;
                          const isConflict = currentStep?.type === 'conflict' && currentStep.row === r && currentStep.col === c;

                          return (
                            <div
                              key={`${r}-${c}`}
                              className={`w-14 h-14 flex items-center justify-center font-bold text-2xl transition-all ${
                                isConflict
                                  ? 'bg-[#EF592A] text-[#FFFDF8]'
                                  : isDarkSquare
                                  ? 'bg-[#E8E4DA] dark:bg-[#383630]'
                                  : 'bg-[#FFFDF8] dark:bg-[#24231F]'
                              }`}
                            >
                              {hasQueen && (
                                <span className="text-[#28533D] scale-125 select-none drop-shadow">
                                  ♛
                                </span>
                              )}
                              {isConflict && (
                                <span className="text-white text-base font-mono">✕</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </VisualizerCanvas>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2">
                  <div className="text-[#EF592A] font-bold">
                    {currentStep?.message || 'Ready. Click Step to watch recursion tree.'}
                  </div>
                  <div>
                    Total Solutions Discovered: <strong>{simulation.totalSolutions}</strong>
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
