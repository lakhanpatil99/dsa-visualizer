import React, { useState, useEffect, useContext, useRef } from 'react';
import Controls from '../components/Controls';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import SaveProgressButton from '../components/SaveProgressButton';
import { DarkModeContext } from '../../context/ThemeContext';

import { bubbleSort, bubbleSortPseudocode, bubbleSortComplexity } from '../algorithms/sorting/bubbleSort';
import { selectionSort, selectionSortPseudocode, selectionSortComplexity } from '../algorithms/sorting/selectionSort';
import { insertionSort, insertionSortPseudocode, insertionSortComplexity } from '../algorithms/sorting/insertionSort';
import { quickSort, quickSortPseudocode, quickSortComplexity } from '../algorithms/sorting/quickSort';
import { mergeSort, mergeSortPseudocode, mergeSortComplexity } from '../algorithms/sorting/mergeSort';
import { heapSort, heapSortPseudocode, heapSortComplexity } from '../algorithms/sorting/heapSort';
import { countingSort, countingSortPseudocode, countingSortComplexity } from '../algorithms/sorting/countingSort';
import { radixSort, radixSortPseudocode, radixSortComplexity } from '../algorithms/sorting/radixSort';
import { shellSort, shellSortPseudocode, shellSortComplexity } from '../algorithms/sorting/shellSort';

const DEFAULT_SORTING_ARRAY = [52, 28, 84, 38, 76, 16, 92, 44, 68, 20, 60, 32, 72, 12];

const SortingVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [array, setArray] = useState(DEFAULT_SORTING_ARRAY);
  const [originalArray, setOriginalArray] = useState(DEFAULT_SORTING_ARRAY);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [comparingIndex, setComparingIndex] = useState(-1);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLine, setCurrentLine] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);

  const algorithms = {
    bubble: {
      name: 'Bubble Sort',
      pseudocode: bubbleSortPseudocode,
      complexity: bubbleSortComplexity,
      sortFunction: bubbleSort
    },
    selection: {
      name: 'Selection Sort',
      pseudocode: selectionSortPseudocode,
      complexity: selectionSortComplexity,
      sortFunction: selectionSort
    },
    insertion: {
      name: 'Insertion Sort',
      pseudocode: insertionSortPseudocode,
      complexity: insertionSortComplexity,
      sortFunction: insertionSort
    },
    quick: {
      name: 'Quick Sort',
      pseudocode: quickSortPseudocode,
      complexity: quickSortComplexity,
      sortFunction: quickSort
    },
    merge: {
      name: 'Merge Sort',
      pseudocode: mergeSortPseudocode,
      complexity: mergeSortComplexity,
      sortFunction: mergeSort
    },
    heap: {
      name: 'Heap Sort',
      pseudocode: heapSortPseudocode,
      complexity: heapSortComplexity,
      sortFunction: heapSort
    },
    counting: {
      name: 'Counting Sort',
      pseudocode: countingSortPseudocode,
      complexity: countingSortComplexity,
      sortFunction: countingSort
    },
    radix: {
      name: 'Radix Sort',
      pseudocode: radixSortPseudocode,
      complexity: radixSortComplexity,
      sortFunction: radixSort
    },
    shell: {
      name: 'Shell Sort',
      pseudocode: shellSortPseudocode,
      complexity: shellSortComplexity,
      sortFunction: shellSort
    }
  };

  const currentAlgorithm = algorithms[selectedAlgorithm] || algorithms.bubble;

  useEffect(() => {
    generateArray();
  }, []);

  useEffect(() => {
    handleReset();
  }, [selectedAlgorithm]);

  const generateArray = (size = 14) => {
    if (isRunning) return;
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 88) + 12);
    }
    setArray(newArray);
    setOriginalArray([...newArray]);
    handleResetState(newArray);
  };

  const handleResetState = (baseArr = originalArray) => {
    setArray([...baseArr]);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setPivotIndex(-1);
    setSortedIndices(new Set());
    setIsRunning(false);
    setIsPaused(false);
    isRunningRef.current = false;
    isPausedRef.current = false;
    setCurrentStep(0);
    setTotalSteps(0);
    setCurrentLine(1);
    setComparisons(0);
    setSwaps(0);
    setIsCompleted(false);
  };

  const handleReset = () => {
    handleResetState(originalArray);
  };

  const handleStart = async () => {
    if (isRunning || array.length === 0) return;

    setIsRunning(true);
    setIsPaused(false);
    isRunningRef.current = true;
    isPausedRef.current = false;
    setIsCompleted(false);
    setComparisons(0);
    setSwaps(0);

    let localComparisons = 0;
    let localSwaps = 0;

    const callback = (arrSnapshot, currIdx, compIdx, pivIdx, step, isSwap) => {
      if (!isRunningRef.current) return;
      setArray([...arrSnapshot]);
      setCurrentIndex(currIdx);
      setComparingIndex(compIdx);
      setPivotIndex(pivIdx);
      setCurrentStep(step);

      if (isSwap) {
        localSwaps++;
        setSwaps(localSwaps);
      } else if (currIdx !== -1 && compIdx !== -1) {
        localComparisons++;
        setComparisons(localComparisons);
      }
    };

    try {
      const sortedResult = await currentAlgorithm.sortFunction([...array], callback, speed);
      if (isRunningRef.current) {
        setArray(sortedResult);
        setIsCompleted(true);
        setCurrentIndex(-1);
        setComparingIndex(-1);
        setPivotIndex(-1);
        setSortedIndices(new Set(Array.from({ length: sortedResult.length }, (_, i) => i)));
      }
    } catch (e) {
      console.error('Sorting execution error:', e);
    } finally {
      setIsRunning(false);
      isRunningRef.current = false;
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const handleResume = () => {
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const getBarHeight = (value) => {
    const maxVal = Math.max(100, ...array);
    return `${Math.max(16, (value / maxVal) * 78 + 12)}%`;
  };

  const getBarColor = (index) => {
    if (sortedIndices.has(index) || isCompleted) {
      return '#28533D'; // Forest green when sorted
    }
    if (index === currentIndex || index === comparingIndex) {
      return '#EF592A'; // Burnt orange when active / comparing
    }
    if (index === pivotIndex) {
      return '#8E5016'; // Deep amber for pivot
    }
    return isDarkMode ? '#5E5B54' : '#24231F'; // Deep ink for uninspected
  };

  // Left Sidebar: Algorithm selection, Array Controls, Save Progress
  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Algorithm Selection */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-1.5">
          ALGORITHM
        </span>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          disabled={isRunning}
          aria-label="Select sorting algorithm"
          className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition-all outline-none focus:border-[#EF592A] ${
            isDarkMode 
              ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' 
              : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
          }`}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="heap">Heap Sort</option>
          <option value="counting">Counting Sort</option>
          <option value="radix">Radix Sort</option>
          <option value="shell">Shell Sort</option>
        </select>
        <p className="text-xs text-[#69665F] dark:text-[#A09D95] mt-2 leading-relaxed">
          {currentAlgorithm.complexity?.worstCase ? `Worst case: ${currentAlgorithm.complexity.worstCase}` : ''}
        </p>
      </div>

      {/* Array Controls */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          INPUT GENERATOR
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => generateArray(14)}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all disabled:opacity-50"
          >
            Random (14)
          </button>
          <button
            type="button"
            onClick={() => {
              if (isRunning) return;
              const reversed = [95, 88, 80, 72, 65, 58, 50, 42, 35, 28, 20, 15];
              setArray(reversed);
              setOriginalArray([...reversed]);
              handleResetState(reversed);
            }}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all disabled:opacity-50"
          >
            Worst (Rev)
          </button>
        </div>
      </div>

      {/* Cloud Progress */}
      <SaveProgressButton
        algorithmType="sorting"
        algorithmName={currentAlgorithm.name}
        currentState={{ array, comparisons, swaps }}
        stepsCompleted={currentStep}
        totalSteps={totalSteps || currentStep}
      />
    </div>
  );

  // Right Sidebar: Pseudocode and Complexity
  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={currentAlgorithm.complexity}
        title={`${currentAlgorithm.name} Complexity`}
      />
      <PseudocodePanel
        title={`${currentAlgorithm.name} Logic`}
        code={currentAlgorithm.pseudocode}
        currentLine={currentLine}
      />
    </div>
  );

  // Bottom Playback Controls
  const renderBottomControls = () => (
    <Controls
      isRunning={isRunning}
      isPaused={isPaused}
      onStart={isPaused ? handleResume : handleStart}
      onPause={handlePause}
      onReset={handleReset}
      onSpeedChange={setSpeed}
      speed={speed}
      currentStep={currentStep}
      totalSteps={Math.max(currentStep, totalSteps)}
      disabled={array.length === 0}
    />
  );

  return (
    <VisualizerLayout
      title={currentAlgorithm.name}
      subtitle="Interactive deterministic step visualizer for comparison and distribution sorting"
      category="Sorting Suite"
      complexityBadge={currentAlgorithm.complexity?.time || 'O(n log n)'}
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
      bottomControls={renderBottomControls()}
    >
      <div className="h-full flex flex-col space-y-4">
        {/* Main Canvas Area */}
        <div className="flex-1">
          <VisualizerCanvas 
            width={900} 
            height={360}
            title={`${currentAlgorithm.name} Memory Trace`}
          >
            <div className="flex items-end justify-center space-x-1.5 sm:space-x-2 h-full p-4 sm:p-6">
              {array.map((value, index) => {
                const isActive = index === currentIndex || index === comparingIndex;
                const isPivot = index === pivotIndex;
                const isSorted = sortedIndices.has(index) || isCompleted;

                return (
                  <div
                    key={index}
                    className="flex-1 max-w-[48px] flex flex-col items-center justify-end h-full group"
                  >
                    {/* Value indicator tooltip */}
                    <span className={`text-[10px] sm:text-xs font-mono font-bold mb-1 transition-all ${
                      isActive ? 'text-[#EF592A] -translate-y-1' : 'text-[#69665F] dark:text-[#A09D95]'
                    }`}>
                      {value}
                    </span>

                    {/* Array bar */}
                    <div
                      className="w-full rounded-t-lg transition-all duration-300 ease-out shadow-xs"
                      style={{
                        height: getBarHeight(value),
                        backgroundColor: getBarColor(index),
                        transform: isActive ? 'scaleY(1.02)' : 'none'
                      }}
                    />

                    {/* Index label */}
                    <span className="text-[9px] font-mono text-[#A09D95] dark:text-[#69665F] mt-1.5">
                      [{index}]
                    </span>
                  </div>
                );
              })}
            </div>
          </VisualizerCanvas>
        </div>

        {/* Live Metrics Strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
          <div className="text-center p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19]">
            <span className="block text-[10px] font-mono text-[#69665F] dark:text-[#A09D95] uppercase">
              Comparisons
            </span>
            <span className="text-xl font-extrabold text-[#EF592A] font-mono">
              {comparisons}
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19]">
            <span className="block text-[10px] font-mono text-[#69665F] dark:text-[#A09D95] uppercase">
              Swaps / Writes
            </span>
            <span className="text-xl font-extrabold text-[#28533D] dark:text-[#E4E9DD] font-mono">
              {swaps}
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19]">
            <span className="block text-[10px] font-mono text-[#69665F] dark:text-[#A09D95] uppercase">
              Execution Step
            </span>
            <span className="text-xl font-extrabold text-[#24231F] dark:text-[#FFFDF8] font-mono">
              {currentStep}
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19]">
            <span className="block text-[10px] font-mono text-[#69665F] dark:text-[#A09D95] uppercase">
              State
            </span>
            <span className={`text-sm font-extrabold font-mono uppercase mt-1 inline-block ${
              isCompleted 
                ? 'text-[#28533D] dark:text-[#E4E9DD]' 
                : isRunning 
                  ? 'text-[#EF592A]' 
                  : isPaused
                    ? 'text-[#8E5016] dark:text-[#F3B367]'
                    : 'text-[#28533D] dark:text-[#76A889]'
            }`}>
              {isCompleted ? '✓ Sorted' : isRunning ? '⚡ Running' : isPaused ? '⏸ Paused' : '● Ready'}
            </span>
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default SortingVisualizer;
