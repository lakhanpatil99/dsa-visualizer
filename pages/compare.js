import React, { useState, useContext } from 'react';
import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ProtectedRoute from '../src/components/ProtectedRoute';
import VisualizerCanvas from '../src/components/VisualizerCanvas';
import { DarkModeContext } from '../context/ThemeContext';

import { bubbleSort } from '../src/algorithms/sorting/bubbleSort';
import { quickSort } from '../src/algorithms/sorting/quickSort';
import { mergeSort } from '../src/algorithms/sorting/mergeSort';
import { selectionSort } from '../src/algorithms/sorting/selectionSort';
import { insertionSort } from '../src/algorithms/sorting/insertionSort';
import { heapSort } from '../src/algorithms/sorting/heapSort';

export default function CompareAlgorithmsPage() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [algoA, setAlgoA] = useState('bubble');
  const [algoB, setAlgoB] = useState('quick');
  const [inputArray, setInputArray] = useState([45, 12, 89, 34, 67, 23, 91, 56, 78, 19, 62, 38]);

  const [arrA, setArrA] = useState([...inputArray]);
  const [arrB, setArrB] = useState([...inputArray]);

  const [statsA, setStatsA] = useState({ comparisons: 0, swaps: 0, timeMs: 0 });
  const [statsB, setStatsB] = useState({ comparisons: 0, swaps: 0, timeMs: 0 });

  const [isRunning, setIsRunning] = useState(false);

  const algorithms = {
    bubble: { name: 'Bubble Sort', fn: bubbleSort, timeComp: 'O(n²)' },
    selection: { name: 'Selection Sort', fn: selectionSort, timeComp: 'O(n²)' },
    insertion: { name: 'Insertion Sort', fn: insertionSort, timeComp: 'O(n²)' },
    quick: { name: 'Quick Sort', fn: quickSort, timeComp: 'O(n log n)' },
    merge: { name: 'Merge Sort', fn: mergeSort, timeComp: 'O(n log n)' },
    heap: { name: 'Heap Sort', fn: heapSort, timeComp: 'O(n log n)' }
  };

  const handleGenerateInput = () => {
    const fresh = Array.from({ length: 14 }, () => Math.floor(Math.random() * 85) + 15);
    setInputArray(fresh);
    setArrA([...fresh]);
    setArrB([...fresh]);
    setStatsA({ comparisons: 0, swaps: 0, timeMs: 0 });
    setStatsB({ comparisons: 0, swaps: 0, timeMs: 0 });
  };

  const runDualComparison = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setArrA([...inputArray]);
    setArrB([...inputArray]);

    let compsA = 0, swapsA = 0;
    let compsB = 0, swapsB = 0;

    const tStartA = performance.now();
    const resA = await algorithms[algoA].fn([...inputArray], (arr, i, j, p, step, isSwap) => {
      setArrA([...arr]);
      if (isSwap) swapsA++;
      else if (i !== -1 && j !== -1) compsA++;
    }, 4);
    const tEndA = performance.now();
    setStatsA({ comparisons: compsA, swaps: swapsA, timeMs: Math.round(tEndA - tStartA) });

    const tStartB = performance.now();
    const resB = await algorithms[algoB].fn([...inputArray], (arr, i, j, p, step, isSwap) => {
      setArrB([...arr]);
      if (isSwap) swapsB++;
      else if (i !== -1 && j !== -1) compsB++;
    }, 4);
    const tEndB = performance.now();
    setStatsB({ comparisons: compsB, swaps: swapsB, timeMs: Math.round(tEndB - tStartB) });

    setIsRunning(false);
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Side-by-Side Algorithm Comparison - AlgoMania</title>
        <meta name="description" content="Compare two sorting algorithms side-by-side on identical input data and evaluate operation counts and runtime." />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F5ED] dark:bg-[#1A1916] text-[#24231F] dark:text-[#FFFDF8] transition-colors">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-[#EF592A] uppercase font-bold">
              BENCHMARK LAB
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Side-by-Side Algorithm Dual.
            </h1>
            <p className="text-xs sm:text-sm text-[#69665F] dark:text-[#A09D95]">
              Run any two algorithms concurrently on identical datasets to observe comparative operation counts.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-[#EF592A]">Algo 1:</span>
                <select
                  value={algoA}
                  onChange={(e) => setAlgoA(e.target.value)}
                  disabled={isRunning}
                  aria-label="Algorithm 1"
                  className="p-2 rounded-xl border text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
                >
                  {Object.keys(algorithms).map(k => <option key={k} value={k}>{algorithms[k].name}</option>)}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-[#28533D] dark:text-[#E4E9DD]">Algo 2:</span>
                <select
                  value={algoB}
                  onChange={(e) => setAlgoB(e.target.value)}
                  disabled={isRunning}
                  aria-label="Algorithm 2"
                  className="p-2 rounded-xl border text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]"
                >
                  {Object.keys(algorithms).map(k => <option key={k} value={k}>{algorithms[k].name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleGenerateInput}
                disabled={isRunning}
                className="px-4 py-2.5 rounded-xl border border-[#DED9CE] dark:border-[#383630] font-mono text-xs font-bold hover:border-[#EF592A]"
              >
                New Dataset
              </button>
              <button
                type="button"
                onClick={runDualComparison}
                disabled={isRunning}
                className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] hover:bg-[#D9481B] text-[#FFFDF8] shadow-xs"
              >
                {isRunning ? 'Running Race...' : 'Start Dual'}
              </button>
            </div>
          </div>

          {/* Dual Canvases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Canvas: Algo A */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] space-y-4">
              <div className="flex items-center justify-between border-b border-[#DED9CE] dark:border-[#383630] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF592A]"></span>
                  <h3 className="font-mono font-bold text-sm uppercase">{algorithms[algoA].name}</h3>
                </div>
                <span className="text-xs font-mono text-[#EF592A] font-bold">{algorithms[algoA].timeComp}</span>
              </div>

              <div className="h-48 flex items-end justify-center space-x-1.5 p-2 bg-[#FAF8F3] dark:bg-[#1A1916] rounded-xl border border-[#DED9CE] dark:border-[#383630]">
                {arrA.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-t bg-[#EF592A] transition-all duration-150"
                      style={{ height: `${(val / 100) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono mt-1">{val}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19]">
                  <span className="text-[10px] text-[#A09D95] block">Comps</span>
                  <strong className="text-[#EF592A]">{statsA.comparisons}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19]">
                  <span className="text-[10px] text-[#A09D95] block">Swaps</span>
                  <strong>{statsA.swaps}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19]">
                  <span className="text-[10px] text-[#A09D95] block">Time</span>
                  <strong>{statsA.timeMs}ms</strong>
                </div>
              </div>
            </div>

            {/* Right Canvas: Algo B */}
            <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630] space-y-4">
              <div className="flex items-center justify-between border-b border-[#DED9CE] dark:border-[#383630] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28533D]"></span>
                  <h3 className="font-mono font-bold text-sm uppercase">{algorithms[algoB].name}</h3>
                </div>
                <span className="text-xs font-mono text-[#28533D] dark:text-[#E4E9DD] font-bold">{algorithms[algoB].timeComp}</span>
              </div>

              <div className="h-48 flex items-end justify-center space-x-1.5 p-2 bg-[#FAF8F3] dark:bg-[#1A1916] rounded-xl border border-[#DED9CE] dark:border-[#383630]">
                {arrB.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-t bg-[#28533D] transition-all duration-150"
                      style={{ height: `${(val / 100) * 100}%` }}
                    />
                    <span className="text-[9px] font-mono mt-1">{val}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19]">
                  <span className="text-[10px] text-[#A09D95] block">Comps</span>
                  <strong className="text-[#28533D] dark:text-[#E4E9DD]">{statsB.comparisons}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19]">
                  <span className="text-[10px] text-[#A09D95] block">Swaps</span>
                  <strong>{statsB.swaps}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19]">
                  <span className="text-[10px] text-[#A09D95] block">Time</span>
                  <strong>{statsB.timeMs}ms</strong>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
