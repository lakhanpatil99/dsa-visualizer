import React, { useState, useEffect, useContext } from 'react';
import Controls from '../components/Controls';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import SaveProgressButton from '../components/SaveProgressButton';
import { DarkModeContext } from '../App';
import { bubbleSort, bubbleSortPseudocode, bubbleSortComplexity } from '../algorithms/sorting/bubbleSort';
import { quickSort, quickSortPseudocode, quickSortComplexity } from '../algorithms/sorting/quickSort';
import { mergeSort, mergeSortPseudocode, mergeSortComplexity } from '../algorithms/sorting/mergeSort';

const SortingVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
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
  const [executionHistory, setExecutionHistory] = useState([]);
  const [currentLine, setCurrentLine] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Algorithm configurations
  const algorithms = {
    bubble: {
      name: 'Bubble Sort',
      pseudocode: bubbleSortPseudocode,
      complexity: bubbleSortComplexity,
      sortFunction: bubbleSort
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
    }
  };

  const currentAlgorithm = algorithms[selectedAlgorithm];

  // Generate initial array
  useEffect(() => {
    generateArray();
  }, []);

  // Update pseudocode and complexity when algorithm changes
  useEffect(() => {
    setCurrentLine(1);
    setCurrentStep(0);
    setTotalSteps(0);
    setExecutionHistory([]);
    setComparisons(0);
    setSwaps(0);
    setIsCompleted(false);
    setShowConfetti(false);
    setSortedIndices(new Set());
  }, [selectedAlgorithm]);

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
    setArray([...newArray]);
    setOriginalArray([...newArray]);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setPivotIndex(-1);
    setCurrentStep(0);
    setTotalSteps(0);
    setExecutionHistory([]);
    setCurrentLine(1);
    setComparisons(0);
    setSwaps(0);
    setIsCompleted(false);
    setShowConfetti(false);
    setSortedIndices(new Set());
  };

  const handleStart = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(0);
    setExecutionHistory([]);
    setComparisons(0);
    setSwaps(0);
    setIsCompleted(false);
    setShowConfetti(false);
    setSortedIndices(new Set());
    
    const arrayCopy = [...array];
    const history = [];
    let comparisonCount = 0;
    let swapCount = 0;
    
    await currentAlgorithm.sortFunction(
      arrayCopy,
      (newArray, current, comparing, pivot, line, isSwap = false) => {
        setArray([...newArray]);
        setCurrentIndex(current);
        setComparingIndex(comparing);
        setPivotIndex(pivot);
        setCurrentLine(line);
        
        if (isSwap) {
          swapCount++;
          setSwaps(swapCount);
        }
        
        comparisonCount++;
        setComparisons(comparisonCount);
        
        // Update sorted indices for bubble sort
        if (selectedAlgorithm === 'bubble') {
          const newSortedIndices = new Set(sortedIndices);
          for (let i = newArray.length - 1; i >= newArray.length - (Math.floor(comparisonCount / (newArray.length - 1))); i--) {
            if (i >= 0) newSortedIndices.add(i);
          }
          setSortedIndices(newSortedIndices);
        }
        
        history.push({
          array: [...newArray],
          current,
          comparing,
          pivot,
          line,
          comparisons: comparisonCount,
          swaps: swapCount
        });
        
        setExecutionHistory([...history]);
        setCurrentStep(history.length);
        setTotalSteps(history.length);
      },
      speed
    );
    
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(true);
    
    // Show completion effects
    setTimeout(() => {
      setShowConfetti(true);
      // Rainbow wave effect
      const bars = document.querySelectorAll('.sorting-bar');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          bar.classList.add('rainbow-wave');
        }, index * 50);
      });
    }, 500);
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = executionHistory[currentStep];
      if (nextStep) {
        setArray([...nextStep.array]);
        setCurrentIndex(nextStep.current);
        setComparingIndex(nextStep.comparing);
        setPivotIndex(nextStep.pivot);
        setCurrentLine(nextStep.line);
        setComparisons(nextStep.comparisons);
        setSwaps(nextStep.swaps);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleReset = () => {
    setArray([...originalArray]);
    setCurrentIndex(-1);
    setComparingIndex(-1);
    setPivotIndex(-1);
    setCurrentStep(0);
    setTotalSteps(0);
    setExecutionHistory([]);
    setCurrentLine(1);
    setIsRunning(false);
    setIsPaused(false);
    setComparisons(0);
    setSwaps(0);
    setIsCompleted(false);
    setShowConfetti(false);
    setSortedIndices(new Set());
    
    // Remove rainbow wave effect
    const bars = document.querySelectorAll('.sorting-bar');
    bars.forEach(bar => {
      bar.classList.remove('rainbow-wave');
    });
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getBarColor = (index) => {
    if (index === currentIndex) {
      return '#EF4444'; // Red for current
    } else if (index === comparingIndex) {
      return '#F59E0B'; // Yellow for comparing
    } else if (index === pivotIndex) {
      return '#8B5CF6'; // Purple for pivot
    } else if (sortedIndices.has(index) || isCompleted) {
      return '#10B981'; // Green for sorted
    } else {
      return '#3B82F6'; // Blue for unsorted
    }
  };

  const getBarHeight = (value) => {
    return `${(value / 110) * 100}%`;
  };

  const getBarWidth = () => {
    return Math.max(20, Math.min(40, 800 / array.length));
  };

  // Confetti component
  const Confetti = () => {
    if (!showConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)]
              }`}
            />
          </div>
        ))}
      </div>
    );
  };

  // Left Sidebar Content
  const renderLeftSidebar = () => (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Algorithm Selection
        </h3>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          disabled={isRunning}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
        </select>
      </div>

      {/* Algorithm Info */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {currentAlgorithm.name}
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {selectedAlgorithm === 'bubble' && 'Simple comparison-based sorting algorithm with O(n²) complexity'}
          {selectedAlgorithm === 'quick' && 'Divide-and-conquer algorithm with pivot selection, average O(n log n)'}
          {selectedAlgorithm === 'merge' && 'Stable divide-and-conquer sorting algorithm with O(n log n) complexity'}
        </p>
      </div>

      {/* Array Controls */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Array Controls
        </h3>
        <button
          onClick={generateArray}
          disabled={isRunning}
          className={`w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
            isDarkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-600'
          }`}
        >
          Generate New Array
        </button>
      </div>

      {/* Progress Information */}
      {totalSteps > 0 && (
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Execution Progress
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Step:
              </span>
              <span className={`text-sm font-mono ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {currentStep} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Right Sidebar Content
  const renderRightSidebar = () => (
    <div className="space-y-6">
      {/* Complexity Box */}
      <ComplexityBox
        timeComplexity={currentAlgorithm.complexity.time}
        spaceComplexity={currentAlgorithm.complexity.space}
        bestCase={currentAlgorithm.complexity.bestCase}
        averageCase={currentAlgorithm.complexity.averageCase}
        worstCase={currentAlgorithm.complexity.worstCase}
      />

      {/* Pseudocode Panel */}
      <PseudocodePanel
        title={`${currentAlgorithm.name} Pseudocode`}
        code={currentAlgorithm.pseudocode}
        currentLine={currentLine}
      />
    </div>
  );

  // Bottom Controls
  const renderBottomControls = () => (
    <Controls
      isRunning={isRunning}
      onStart={isPaused ? handleResume : handleStart}
      onPause={handlePause}
      onNext={handleNext}
      onReset={handleReset}
      onSpeedChange={handleSpeedChange}
      speed={speed}
      canNext={!isRunning && currentStep < totalSteps}
      disabled={array.length === 0}
    />
  );

  return (
    <VisualizerLayout
      title="Sorting Algorithms - AlgoMania"
      subtitle="Visualize and understand sorting algorithms step by step"
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
      bottomControls={renderBottomControls()}
    >
      {/* Confetti */}
      <Confetti />
      
      {/* Center Visualization Area */}
      <div className="h-full flex flex-col">
        {/* Array Visualization */}
        <div className="flex-1 mb-6">
          <VisualizerCanvas 
            width="100%" 
            height="100%"
            title={`${currentAlgorithm.name} Visualization`}
          >
            {array.length > 0 ? (
              <div className="flex items-end justify-center space-x-1 h-full p-4">
                {array.map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                    style={{ width: `${getBarWidth()}px` }}
                  >
                    <div
                      className={`sorting-bar w-full rounded-t transition-all duration-500 ease-out shadow-lg ${
                        isDarkMode ? 'border border-gray-600' : 'border border-gray-300'
                      }`}
                      style={{
                        height: getBarHeight(value),
                        backgroundColor: getBarColor(index),
                        transform: `translateY(${index === currentIndex || index === comparingIndex ? '-5px' : '0px'}) scale(${index === currentIndex || index === comparingIndex ? '1.05' : '1'})`
                      }}
                    />
                    <span className={`text-xs mt-2 font-mono transition-all duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`flex items-center justify-center h-full ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div>Click "Generate New Array" to get started!</div>
                </div>
              </div>
            )}
          </VisualizerCanvas>
        </div>

        {/* Status Panel */}
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Comparisons */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {comparisons}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Comparisons
              </div>
            </div>
            
            {/* Swaps */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {swaps}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Swaps
              </div>
            </div>
            
            {/* Progress */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0}%
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Progress
              </div>
            </div>
            
            {/* Status */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isCompleted 
                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                  : isRunning 
                    ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600')
                    : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
              }`}>
                {isCompleted ? '✅' : isRunning ? '🔄' : '⏸️'}
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {isCompleted ? 'Completed' : isRunning ? 'Running' : 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Status */}
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Algorithm:</strong> {currentAlgorithm.name}
              </span>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Array Size:</strong> {array.length}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isRunning 
                  ? 'bg-green-500 animate-pulse' 
                  : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-400'
              }`}></div>
              <span className="text-sm">
                {isCompleted ? 'Sorted Successfully! 🎉' : isRunning ? 'Running...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Progress Section */}
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Save Your Progress
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Track your learning progress and continue where you left off
              </p>
            </div>
            <SaveProgressButton
              algorithmType="sorting"
              algorithmName={currentAlgorithm.name}
              currentState={{
                array: array,
                selectedAlgorithm: selectedAlgorithm,
                isCompleted: isCompleted,
                currentStep: currentStep,
                totalSteps: totalSteps,
                comparisons: comparisons,
                swaps: swaps
              }}
              stepsCompleted={currentStep}
              totalSteps={totalSteps}
              timeSpent={0} // You can implement time tracking if needed
              lastStep={isCompleted ? 'Algorithm completed successfully' : `Step ${currentStep} of ${totalSteps}`}
              notes={`Working on ${currentAlgorithm.name} with array size ${array.length}`}
            />
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default SortingVisualizer;
