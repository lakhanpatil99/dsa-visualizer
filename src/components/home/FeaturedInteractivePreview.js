import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const INITIAL_ARRAY = [48, 19, 65, 27, 82, 14, 56, 33];

export default function FeaturedInteractivePreview() {
  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step
  const [statusMessage, setStatusMessage] = useState('Ready to execute Bubble Sort pass.');

  // Algorithmic state tracking (i, j pointers)
  const stateRef = useRef({
    i: 0,
    j: 0,
    arr: [...INITIAL_ARRAY],
    comparisons: 0,
    swaps: 0,
    done: false
  });

  // Step function to advance exactly one comparison or swap
  const stepAlgorithm = () => {
    const s = stateRef.current;
    if (s.done) {
      setIsPlaying(false);
      setStatusMessage('Array fully sorted. All inversions resolved.');
      setComparing([]);
      setSwapping([]);
      setSortedIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      return;
    }

    const n = s.arr.length;

    if (s.i < n - 1) {
      if (s.j < n - s.i - 1) {
        const idx1 = s.j;
        const idx2 = s.j + 1;
        setComparing([idx1, idx2]);
        setSwapping([]);
        s.comparisons += 1;
        setComparisons(s.comparisons);

        if (s.arr[idx1] > s.arr[idx2]) {
          // Swap needed
          const temp = s.arr[idx1];
          s.arr[idx1] = s.arr[idx2];
          s.arr[idx2] = temp;
          s.swaps += 1;
          setSwaps(s.swaps);
          setSwapping([idx1, idx2]);
          setStatusMessage(`Swapping arr[${idx1}] (${temp}) with arr[${idx2}] (${s.arr[idx1]}).`);
        } else {
          setStatusMessage(`arr[${idx1}] (${s.arr[idx1]}) ≤ arr[${idx2}] (${s.arr[idx2]}): In order, no swap.`);
        }

        setArray([...s.arr]);
        s.j += 1;
      } else {
        // End of inner pass
        const newlySorted = n - s.i - 1;
        setSortedIndices((prev) => [...prev, newlySorted]);
        s.j = 0;
        s.i += 1;
        if (s.i >= n - 1) {
          s.done = true;
          setIsPlaying(false);
          setStatusMessage('Sorting complete. Time: O(n²), Auxiliary Space: O(1).');
          setComparing([]);
          setSwapping([]);
          setSortedIndices([0, 1, 2, 3, 4, 5, 6, 7]);
        }
      }
    } else {
      s.done = true;
      setIsPlaying(false);
      setComparing([]);
      setSwapping([]);
      setSortedIndices([0, 1, 2, 3, 4, 5, 6, 7]);
      setStatusMessage('Sorting complete.');
    }
  };

  // Play loop
  useEffect(() => {
    let intervalId = null;
    if (isPlaying) {
      intervalId = setInterval(() => {
        stepAlgorithm();
      }, speed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, speed]);

  const handleTogglePlay = () => {
    if (stateRef.current.done) {
      handleReset();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleStep = () => {
    if (isPlaying) setIsPlaying(false);
    stepAlgorithm();
  };

  const handleReset = () => {
    setIsPlaying(false);
    const initialCopy = [...INITIAL_ARRAY];
    stateRef.current = {
      i: 0,
      j: 0,
      arr: initialCopy,
      comparisons: 0,
      swaps: 0,
      done: false
    };
    setArray(initialCopy);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);
    setStatusMessage('Algorithm reset. Press Step or Play to begin execution.');
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const randomized = Array.from({ length: 8 }, () => Math.floor(Math.random() * 75) + 15);
    stateRef.current = {
      i: 0,
      j: 0,
      arr: [...randomized],
      comparisons: 0,
      swaps: 0,
      done: false
    };
    setArray(randomized);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
    setComparisons(0);
    setSwaps(0);
    setStatusMessage('New randomized dataset loaded. Ready to trace state changes.');
  };

  return (
    <div className="w-full bg-[#FFFDF8] border border-[#DED9CE] rounded-2xl lg:rounded-3xl p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Functional Visualization Canvas */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Header Bar with Status & Complexity Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DED9CE]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF592A] animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-[#24231F] uppercase">
                Active Execution: Bubble Sort
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#E4E9DD] text-[#28533D] font-bold">
                Time: O(n²)
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#F8F5ED] text-[#24231F] border border-[#DED9CE] font-bold">
                Space: O(1)
              </span>
            </div>
          </div>

          {/* Real Bar Chart Display */}
          <div className="w-full h-56 sm:h-64 bg-[#F8F5ED] border border-[#DED9CE] rounded-xl p-4 sm:p-6 flex items-end justify-between gap-2 sm:gap-3 relative overflow-hidden">
            {array.map((value, idx) => {
              const isComparing = comparing.includes(idx);
              const isSwapping = swapping.includes(idx);
              const isSorted = sortedIndices.includes(idx);

              // Bar styling
              let barBg = '#28533D'; // Default forest green
              let barBorder = '#28533D';
              let textColor = '#FFFDF8';

              if (isSwapping) {
                barBg = '#EF592A'; // Burnt orange during active swap
                barBorder = '#d64b20';
              } else if (isComparing) {
                barBg = '#F6DDD0'; // Pale orange during comparison
                barBorder = '#EF592A';
                textColor = '#24231F';
              } else if (isSorted) {
                barBg = '#24231F'; // Deep ink when locked into sorted partition
                barBorder = '#24231F';
              }

              const heightPercentage = Math.max(15, (value / 95) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Floating pointer annotation */}
                  <div className="h-6 flex items-center justify-center text-[10px] font-mono font-bold mb-1">
                    {isSwapping ? (
                      <span className="text-[#EF592A] font-black">SWAP</span>
                    ) : isComparing ? (
                      <span className="text-[#24231F]">CMP</span>
                    ) : (
                      <span className="text-[#69665F]/40">[{idx}]</span>
                    )}
                  </div>

                  {/* Visual Bar */}
                  <div
                    style={{
                      height: `${heightPercentage}%`,
                      backgroundColor: barBg,
                      borderColor: barBorder
                    }}
                    className="w-full rounded-t-md border-2 transition-all duration-200 flex flex-col items-center justify-start pt-1.5 shadow-sm"
                  >
                    <span
                      style={{ color: textColor }}
                      className="text-[11px] sm:text-xs font-mono font-bold select-none"
                    >
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Telemetry and Log */}
          <div className="p-3.5 rounded-lg bg-[#F8F5ED] border border-[#DED9CE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="text-[#24231F] font-medium flex items-center space-x-1.5">
              <span className="text-[#EF592A]">▶</span>
              <span>{statusMessage}</span>
            </div>
            <div className="flex items-center space-x-4 text-[#69665F] shrink-0 font-bold">
              <span>CMP: <strong className="text-[#24231F]">{comparisons}</strong></span>
              <span>SWAPS: <strong className="text-[#24231F]">{swaps}</strong></span>
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleTogglePlay}
                className="px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-[#EF592A] hover:bg-[#d64b20] text-[#FFFDF8] transition-all active:scale-95 flex items-center space-x-1.5"
              >
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                <span>{isPlaying ? '⏸' : '▶'}</span>
              </button>

              <button
                onClick={handleStep}
                className="px-3.5 py-2 rounded-lg text-xs font-bold font-mono tracking-wider bg-[#F8F5ED] hover:bg-[#FFFDF8] text-[#24231F] border border-[#DED9CE] hover:border-[#24231F] transition-all active:scale-95"
              >
                STEP ⏭
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-lg text-xs font-bold font-mono text-[#69665F] hover:text-[#24231F] border border-[#DED9CE] hover:bg-[#F8F5ED] transition-colors"
                title="Reset to initial state"
              >
                RESET
              </button>

              <button
                onClick={handleRandomize}
                className="px-3 py-2 rounded-lg text-xs font-bold font-mono text-[#69665F] hover:text-[#24231F] border border-[#DED9CE] hover:bg-[#F8F5ED] transition-colors"
                title="Generate new random numbers"
              >
                RANDOMIZE
              </button>
            </div>

            {/* Speed Toggle */}
            <div className="flex items-center space-x-1 text-xs font-mono text-[#69665F]">
              <span className="mr-1">SPEED:</span>
              {[
                { label: '1x', val: 700 },
                { label: '2x', val: 400 },
                { label: '4x', val: 150 }
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSpeed(s.val)}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    speed === s.val
                      ? 'bg-[#24231F] text-[#FFFDF8]'
                      : 'bg-[#F8F5ED] text-[#69665F] hover:text-[#24231F]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Explanation & Deep Dive */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#EF592A] uppercase">
              Section B // Execution Model
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#24231F] leading-tight">
              See the work between the lines of code.
            </h3>
            <p className="text-sm sm:text-base text-[#69665F] leading-relaxed">
              In textbook pseudocode, a swap looks like a single line: <code>arr[j], arr[j+1] = arr[j+1], arr[j]</code>.
              In memory, it involves reading register addresses, evaluating conditions, and moving bytes.
            </p>
          </div>

          {/* 4 Step Process Breakdown */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start space-x-3 text-xs sm:text-sm">
              <span className="font-mono font-bold text-[#EF592A] pt-0.5">01</span>
              <div>
                <strong className="text-[#24231F] block font-semibold">Pointer Traversal</strong>
                <span className="text-[#69665F]">Adjacent pointers scan left-to-right, evaluating consecutive memory cells.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs sm:text-sm">
              <span className="font-mono font-bold text-[#EF592A] pt-0.5">02</span>
              <div>
                <strong className="text-[#24231F] block font-semibold">Invariant Condition Check</strong>
                <span className="text-[#69665F]">If <code>arr[j] &gt; arr[j+1]</code>, an inversion is identified that violates the sorted invariant.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs sm:text-sm">
              <span className="font-mono font-bold text-[#EF592A] pt-0.5">03</span>
              <div>
                <strong className="text-[#24231F] block font-semibold">State Transition</strong>
                <span className="text-[#69665F]">The values exchange positions, and the larger element bubbles forward toward its final index.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs sm:text-sm">
              <span className="font-mono font-bold text-[#EF592A] pt-0.5">04</span>
              <div>
                <strong className="text-[#24231F] block font-semibold">Asymptotic Partitioning</strong>
                <span className="text-[#69665F]">After each pass, the rightmost boundary is permanently marked sorted in deep ink.</span>
              </div>
            </div>
          </div>

          {/* Link to Full Visualizer */}
          <div className="pt-4 border-t border-[#DED9CE]">
            <Link
              href="/sorting"
              className="inline-flex items-center text-sm font-bold text-[#EF592A] hover:text-[#d64b20] group"
            >
              <span>Explore Full Sorting Suite (Quick, Merge, Heap)</span>
              <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
