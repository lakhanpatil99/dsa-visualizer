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

import { solve01Knapsack, knapsackComplexity } from '../src/algorithms/dynamicProgramming/knapsack';
import { solveCoinChange, coinChangeComplexity } from '../src/algorithms/dynamicProgramming/coinChange';
import { solveLCS, lcsComplexity } from '../src/algorithms/dynamicProgramming/lcs';
import { dispatchAudio, AudioEventTypes } from '../src/audio';

export default function DynamicProgrammingPage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [activeTab, setActiveTab] = useState('knapsack'); // 'knapsack' | 'coin' | 'lcs'

  // Knapsack state
  const [capacity, setCapacity] = useState(7);
  const [items, setItems] = useState([
    { name: 'Item 1', weight: 1, value: 1 },
    { name: 'Item 2', weight: 2, value: 6 },
    { name: 'Item 3', weight: 3, value: 10 },
    { name: 'Item 4', weight: 5, value: 16 }
  ]);
  const [knapResult, setKnapResult] = useState(() => solve01Knapsack(items, capacity));

  // Coin Change state
  const [amount, setAmount] = useState(11);
  const [coins, setCoins] = useState([1, 2, 5]);
  const [coinResult, setCoinResult] = useState(() => solveCoinChange(coins, amount));

  // LCS state
  const [s1, setS1] = useState('AGGTAB');
  const [s2, setS2] = useState('GXTXAYB');
  const [lcsResult, setLcsResult] = useState(() => solveLCS(s1, s2));

  const handleComputeKnapsack = () => {
    setKnapResult(solve01Knapsack(items, capacity));
    dispatchAudio(AudioEventTypes.DP_OPTIMUM_FOUND, { priority: true, force: true });
  };

  const handleComputeCoinChange = () => {
    setCoinResult(solveCoinChange(coins, amount));
    dispatchAudio(AudioEventTypes.DP_OPTIMUM_FOUND, { priority: true, force: true });
  };

  const handleComputeLCS = () => {
    setLcsResult(solveLCS(s1, s2));
    dispatchAudio(AudioEventTypes.DP_OPTIMUM_FOUND, { priority: true, force: true });
  };

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          DP PROBLEM FAMILY
        </span>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('knapsack')}
            className={`px-2 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'knapsack'
                ? 'bg-[#EF592A] text-[#FFFDF8]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8]'
            }`}
          >
            Knapsack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coin')}
            className={`px-2 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'coin'
                ? 'bg-[#EF592A] text-[#FFFDF8]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8]'
            }`}
          >
            Coins
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lcs')}
            className={`px-2 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'lcs'
                ? 'bg-[#EF592A] text-[#FFFDF8]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8]'
            }`}
          >
            LCS
          </button>
        </div>
      </div>

      {/* Input Parameters according to tab */}
      {activeTab === 'knapsack' && (
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
          <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
            KNAPSACK CAPACITY
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="15"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-20 p-2 rounded-xl border text-sm font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
            />
            <button
              type="button"
              onClick={handleComputeKnapsack}
              className="flex-1 py-2 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-[#FFFDF8]"
            >
              Recompute
            </button>
          </div>
        </div>
      )}

      {activeTab === 'coin' && (
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
          <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
            TARGET AMOUNT
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max="30"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-20 p-2 rounded-xl border text-sm font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
            />
            <button
              type="button"
              onClick={handleComputeCoinChange}
              className="flex-1 py-2 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-[#FFFDF8]"
            >
              Solve
            </button>
          </div>
        </div>
      )}

      {activeTab === 'lcs' && (
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
          <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
            INPUT SEQUENCES
          </span>
          <div className="space-y-2">
            <input
              type="text"
              value={s1}
              onChange={(e) => setS1(e.target.value.toUpperCase())}
              placeholder="String 1"
              className="w-full p-2 rounded-xl border text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
            />
            <input
              type="text"
              value={s2}
              onChange={(e) => setS2(e.target.value.toUpperCase())}
              placeholder="String 2"
              className="w-full p-2 rounded-xl border text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
            />
            <button
              type="button"
              onClick={handleComputeLCS}
              className="w-full py-2 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-[#FFFDF8]"
            >
              Find Subsequence
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={
          activeTab === 'knapsack'
            ? knapsackComplexity
            : activeTab === 'coin'
            ? coinChangeComplexity
            : lcsComplexity
        }
        title="Asymptotic Big-O"
      />
      <PseudocodePanel
        title="Recurrence Relation"
        code={
          activeTab === 'knapsack'
            ? `dp[i][w] = max(
  val[i] + dp[i-1][w - wt[i]],
  dp[i-1][w]
)`
            : activeTab === 'coin'
            ? `dp[i] = min(dp[i], dp[i - c] + 1)
for each coin c in coins`
            : `if s1[i-1] == s2[j-1]:
  dp[i][j] = dp[i-1][j-1] + 1
else:
  dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
        }
        currentLine={1}
      />
    </div>
  );

  return (
    <ProtectedRoute>
      <Head>
        <title>Dynamic Programming Lab - AlgoMania</title>
        <meta name="description" content="Master dynamic programming through interactive 2D table tabulations: 0/1 Knapsack, Coin Change, and LCS." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916]">
        <Navbar />
        <main className="flex-1">
          <VisualizerLayout
            title="Dynamic Programming Matrix Lab"
            subtitle="Step-by-step 2D tabulation grid with cell-by-cell state transitions and decision paths"
            category="Advanced Suite"
            complexityBadge={activeTab === 'knapsack' ? 'O(N · W)' : activeTab === 'coin' ? 'O(N · A)' : 'O(M · N)'}
            leftSidebar={renderLeftSidebar()}
            rightSidebar={renderRightSidebar()}
          >
            <div className="h-full flex flex-col space-y-4">
              <div className="flex-1">
                <VisualizerCanvas
                  width={900}
                  height={420}
                  title={
                    activeTab === 'knapsack'
                      ? `0/1 Knapsack DP Table (Items × Capacity)`
                      : activeTab === 'coin'
                      ? `Coin Change 1D Optimal Substructures`
                      : `Longest Common Subsequence Matrix`
                  }
                >
                  <div className="p-4 overflow-auto max-h-[400px]">
                    {activeTab === 'knapsack' && (
                      <table className="w-full text-center border-collapse font-mono text-xs">
                        <thead>
                          <tr className="border-b border-[#DED9CE] dark:border-[#383630]">
                            <th className="p-2 text-left">Item (w, v)</th>
                            {Array.from({ length: capacity + 1 }, (_, w) => (
                              <th key={w} className="p-2 text-[#EF592A] font-bold">w={w}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {knapResult.dpTable.map((row, i) => (
                            <tr key={i} className="border-b border-[#DED9CE]/40 dark:border-[#383630]/40">
                              <td className="p-2 text-left font-bold text-[#69665F] dark:text-[#A09D95]">
                                {i === 0 ? 'Base 0' : `${items[i - 1].name} (${items[i - 1].weight}, ${items[i - 1].value})`}
                              </td>
                              {row.map((cell, w) => {
                                const isFinal = i === items.length && w === capacity;
                                return (
                                  <td
                                    key={w}
                                    className={`p-2 transition-colors ${
                                      isFinal
                                        ? 'bg-[#28533D] text-[#FFFDF8] font-bold rounded-lg'
                                        : 'hover:bg-[#FAF8F3] dark:hover:bg-[#1D1C19]'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {activeTab === 'coin' && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {coinResult.dpArray.map((minC, amt) => (
                            <div
                              key={amt}
                              className={`p-2.5 rounded-xl border text-center font-mono ${
                                amt === amount
                                  ? 'bg-[#28533D] text-[#FFFDF8] border-[#28533D] font-bold'
                                  : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630]'
                              }`}
                              style={{ minWidth: '58px' }}
                            >
                              <div className="text-[10px] text-[#A09D95]">Amt {amt}</div>
                              <div className="text-sm font-bold">{minC === Infinity ? '∞' : minC}</div>
                            </div>
                          ))}
                        </div>
                        {coinResult.minCoins !== -1 && (
                          <div className="text-xs font-mono font-bold text-[#28533D] dark:text-[#E4E9DD]">
                            Optimal combination: {coinResult.combination.join(' + ')} = {amount} ({coinResult.minCoins} coins)
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'lcs' && (
                      <table className="w-full text-center border-collapse font-mono text-xs">
                        <thead>
                          <tr className="border-b border-[#DED9CE] dark:border-[#383630]">
                            <th className="p-2">Ø</th>
                            <th className="p-2 text-[#EF592A]">Ø</th>
                            {s2.split('').map((char, j) => (
                              <th key={j} className="p-2 text-[#EF592A] font-bold">{char}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {lcsResult.dpTable.map((row, i) => (
                            <tr key={i} className="border-b border-[#DED9CE]/40 dark:border-[#383630]/40">
                              <td className="p-2 font-bold text-[#69665F] dark:text-[#A09D95]">
                                {i === 0 ? 'Ø' : s1[i - 1]}
                              </td>
                              {row.map((cell, j) => {
                                const isFinal = i === s1.length && j === s2.length;
                                return (
                                  <td
                                    key={j}
                                    className={`p-2 ${
                                      isFinal
                                        ? 'bg-[#28533D] text-[#FFFDF8] font-bold rounded-lg'
                                        : 'hover:bg-[#FAF8F3] dark:hover:bg-[#1D1C19]'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </VisualizerCanvas>
              </div>

              {/* Result Summary Bar */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
              }`}>
                {activeTab === 'knapsack' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2">
                    <div>Optimal Capacity Value: <strong className="text-[#EF592A] text-sm">{knapResult.maxValue}</strong></div>
                    <div>Selected Items: <strong>{knapResult.selectedItems.map(it => it.name).join(', ') || 'None'}</strong></div>
                  </div>
                )}
                {activeTab === 'coin' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2">
                    <div>Minimum Coins: <strong className="text-[#EF592A] text-sm">{coinResult.minCoins}</strong></div>
                    <div>Coins Set: <strong>{coins.join(', ')}</strong></div>
                  </div>
                )}
                {activeTab === 'lcs' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2">
                    <div>LCS Length: <strong className="text-[#EF592A] text-sm">{lcsResult.length}</strong></div>
                    <div>Subsequence String: <strong className="text-[#28533D] text-sm">{lcsResult.sequence || 'Ø'}</strong></div>
                  </div>
                )}
              </div>
            </div>
          </VisualizerLayout>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
