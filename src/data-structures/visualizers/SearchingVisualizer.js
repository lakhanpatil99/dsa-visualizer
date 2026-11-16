import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../../components/VisualizerCanvas';
import PseudocodePanel from '../../components/PseudocodePanel';
import ComplexityBox from '../../components/ComplexityBox';
import VisualizerLayout from '../../components/VisualizerLayout';
import SaveProgressButton from '../../components/SaveProgressButton';
import InlineFeedback from '../components/InlineFeedback';
import { SearchingModel } from '../models/SearchingModel';
import { DarkModeContext } from '../../../context/ThemeContext';
import { dispatchAudio, AudioEventTypes } from '../../audio';

export default function SearchingVisualizer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [model] = useState(() => new SearchingModel([8, 15, 23, 34, 42, 56, 67, 78, 89, 95]));
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('binary'); // 'linear' | 'binary' | 'jump' | 'interpolation'
  const [targetInput, setTargetInput] = useState('42');
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [trace, setTrace] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setArray(model.getArray());
  }, [model]);

  const handleAlgorithmChange = (algo) => {
    setAlgorithm(algo);
    setTrace([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    dispatchAudio(AudioEventTypes.UI_TOGGLE);
  };

  const handleStartSearch = () => {
    if (!targetInput.trim()) {
      setFeedback({ message: 'Enter a target value to search.', type: 'warning' });
      return;
    }

    const target = Number(targetInput.trim());
    if (isNaN(target)) {
      setFeedback({ message: 'Target must be numeric.', type: 'error' });
      return;
    }

    let res;
    switch (algorithm) {
      case 'linear':
        res = model.linearSearch(target);
        break;
      case 'binary':
        res = model.binarySearch(target);
        break;
      case 'jump':
        res = model.jumpSearch(target);
        break;
      case 'interpolation':
        res = model.interpolationSearch(target);
        break;
      default:
        res = model.binarySearch(target);
    }

    if (!res.success && res.error === 'UNSORTED_ARRAY') {
      setFeedback({ message: res.message, type: 'error' });
      setTrace([]);
      return;
    }

    setTrace(res.trace || []);
    setCurrentStepIdx(0);

    if (res.trace && res.trace.length > 0) {
      const firstStep = res.trace[0];
      if (firstStep.isMatch) {
        dispatchAudio(AudioEventTypes.SEARCH_FOUND, { priority: true, force: true });
      } else {
        dispatchAudio(AudioEventTypes.SEARCH_COMPARE);
      }
    }

    setFeedback({
      message: `Generated ${res.trace.length} deterministic search steps for target ${target}.`,
      type: 'info'
    });
  };

  const handleStepForward = () => {
    if (currentStepIdx < trace.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      const st = trace[nextIdx];
      if (st.isMatch) {
        dispatchAudio(AudioEventTypes.SEARCH_FOUND, { priority: true, force: true });
        setFeedback({ message: st.explanation, type: 'success' });
      } else {
        dispatchAudio(AudioEventTypes.SEARCH_COMPARE);
        setFeedback({ message: st.explanation, type: 'info' });
      }
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      setFeedback({ message: trace[prevIdx].explanation, type: 'info' });
      dispatchAudio(AudioEventTypes.UI_CLICK);
    }
  };

  const handleSortArray = () => {
    const sorted = [...array].sort((a, b) => a - b);
    model.setArray(sorted);
    setArray(sorted);
    setTrace([]);
    setCurrentStepIdx(0);
    setFeedback({ message: 'Array has been sorted ascending.', type: 'success' });
    dispatchAudio(AudioEventTypes.UI_SUCCESS);
  };

  const handleGenerateRandom = (unsorted = false) => {
    const newArr = [];
    for (let i = 0; i < 10; i++) {
      newArr.push(Math.floor(Math.random() * 88) + 10);
    }
    const finalArr = unsorted ? newArr : newArr.sort((a, b) => a - b);
    model.setArray(finalArr);
    setArray(finalArr);
    setTrace([]);
    setCurrentStepIdx(0);
    setFeedback({ message: `Generated new ${unsorted ? 'unsorted' : 'sorted'} 10-element array.`, type: 'info' });
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const currentStep = trace[currentStepIdx] || null;

  const complexities = {
    linear: { time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
    binary: { time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)' },
    jump: { time: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' }, space: 'O(1)' },
    interpolation: { time: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' }, space: 'O(1)' }
  };

  const pseudocodes = {
    linear: `function linearSearch(arr, target):
  for i from 0 to arr.length - 1:
    if arr[i] == target: return i
  return -1`,
    binary: `function binarySearch(arr, target):
  low = 0, high = arr.length - 1
  while low <= high:
    mid = floor((low + high) / 2)
    if arr[mid] == target: return mid
    else if arr[mid] < target: low = mid + 1
    else: high = mid - 1
  return -1`,
    jump: `function jumpSearch(arr, target):
  step = floor(sqrt(n)), prev = 0
  while arr[min(step, n) - 1] < target:
    prev = step
    step += floor(sqrt(n))
  while arr[prev] < target:
    prev++
  if arr[prev] == target: return prev
  return -1`,
    interpolation: `function interpolationSearch(arr, target):
  low = 0, high = n - 1
  while low <= high and target between arr[low] and arr[high]:
    pos = low + floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))
    if arr[pos] == target: return pos
    else if arr[pos] < target: low = pos + 1
    else: high = pos - 1
  return -1`
  };

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Search Algorithm Family */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          SEARCH ALGORITHM
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'linear', label: 'Linear Search' },
            { id: 'binary', label: 'Binary Search' },
            { id: 'jump', label: 'Jump Search' },
            { id: 'interpolation', label: 'Interpolation' }
          ].map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => handleAlgorithmChange(a.id)}
              className={`py-2 px-2 text-xs font-mono font-bold rounded-xl transition-all ${
                algorithm === a.id
                  ? 'bg-[#EF592A] text-white shadow-2xs'
                  : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8]'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Input and Search Controls */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          SEARCH CONTROLS
        </span>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">
              Target Element (X)
            </label>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="e.g. 42"
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold mt-1 outline-none focus:border-[#EF592A] ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            />
          </div>

          <button
            type="button"
            onClick={handleStartSearch}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-white hover:bg-[#d64b20] transition-all"
          >
            Compute Search Trace
          </button>

          {/* Stepper Controls */}
          {trace.length > 0 && (
            <div className="pt-2 border-t border-[#DED9CE] dark:border-[#383630] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Step {currentStepIdx + 1} of {trace.length}</span>
                <span className="text-[#28533D] dark:text-[#E4E9DD] font-bold">
                  {currentStep?.comparisons || 0} Comparisons
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleStepBackward}
                  disabled={currentStepIdx === 0}
                  className="py-2 rounded-xl border font-mono text-xs font-bold disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={handleStepForward}
                  disabled={currentStepIdx >= trace.length - 1}
                  className="py-2 rounded-xl bg-[#28533D] text-white font-mono text-xs font-bold disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Array Generator Options */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
            <button
              type="button"
              onClick={() => handleGenerateRandom(false)}
              className={`py-1.5 px-2 rounded-xl border font-mono text-[11px] font-bold ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD]' : 'border-[#DED9CE] text-[#24231F]'
              }`}
            >
              Sorted Array
            </button>
            <button
              type="button"
              onClick={() => handleGenerateRandom(true)}
              className={`py-1.5 px-2 rounded-xl border font-mono text-[11px] font-bold ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD]' : 'border-[#DED9CE] text-[#24231F]'
              }`}
            >
              Unsorted Array
            </button>
          </div>
        </div>
      </div>

      <SaveProgressButton
        algorithmId="data-structures/searching"
        category="data-structures"
        defaultStatus="completed"
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={complexities[algorithm] || complexities.binary}
        title={`${algorithm.toUpperCase()} Complexity`}
      />
      <PseudocodePanel
        title={`${algorithm.toUpperCase()} Logic`}
        code={pseudocodes[algorithm] || pseudocodes.binary}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Searching Algorithms Laboratory"
      subtitle="Examine asymptotic search speed, boundary convergence, jump steps, and interpolation probes"
      category="Memory Structures"
      complexityBadge={`O(${algorithm === 'linear' ? 'n' : algorithm === 'jump' ? '√n' : 'log n'})`}
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
    >
      <div className="h-full flex flex-col space-y-4">
        {feedback.message && (
          <InlineFeedback
            message={feedback.message}
            type={feedback.type}
            onDismiss={() => setFeedback({ message: '', type: 'info' })}
          />
        )}

        <div className="flex-1">
          <VisualizerCanvas
            width={950}
            height={440}
            title={`${algorithm.toUpperCase()} SEARCH DISPERSION ON ARRAY`}
          >
            <div className="flex flex-col justify-between h-full p-4 space-y-4">
              {/* Header Info */}
              <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Target: </span>
                  <strong className="text-[#EF592A] text-sm">{targetInput}</strong>
                  <span className="mx-2 text-[#DED9CE]">|</span>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Array Sorted: </span>
                  <strong className={model.isSorted() ? 'text-[#28533D] dark:text-[#E4E9DD]' : 'text-red-500'}>
                    {model.isSorted() ? 'Yes (Valid for Binary)' : 'No (Linear Only)'}
                  </strong>
                </div>
                {!model.isSorted() && (
                  <button
                    type="button"
                    onClick={handleSortArray}
                    className="px-2.5 py-1 rounded-lg bg-[#28533D] text-white text-[11px] font-bold"
                  >
                    Sort Array Now
                  </button>
                )}
              </div>

              {/* Array Elements Bars / Blocks */}
              <div className="flex items-end justify-center gap-2 h-48 w-full px-2 my-auto">
                {array.map((val, idx) => {
                  const isCurrentActive = currentStep && currentStep.index === idx;
                  const isMatch = currentStep && currentStep.isMatch && currentStep.index === idx;
                  const isInRange = currentStep && currentStep.range
                    ? idx >= currentStep.range[0] && idx <= currentStep.range[1]
                    : true;

                  return (
                    <div
                      key={idx}
                      className="flex-1 max-w-[65px] flex flex-col items-center gap-1.5 transition-all duration-300"
                    >
                      <span className="text-xs font-mono font-bold">{val}</span>
                      <div
                        className={`w-full rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-2xs transition-all duration-300 ${
                          isMatch
                            ? 'bg-[#28533D] text-white ring-4 ring-[#28533D]/30 scale-105'
                            : isCurrentActive
                            ? 'bg-[#EF592A] text-white ring-4 ring-[#EF592A]/30 scale-105'
                            : isInRange
                            ? 'bg-[#FAF8F3] dark:bg-[#24231F] border border-[#DED9CE] dark:border-[#383630]'
                            : 'bg-gray-100 dark:bg-[#1A1916] opacity-30 border border-transparent'
                        }`}
                        style={{ height: `${Math.max(40, (val / 100) * 110 + 35)}px` }}
                      >
                        {isMatch ? '✓' : isCurrentActive ? '?' : ''}
                      </div>
                      <span className="text-[10px] font-mono text-[#69665F] dark:text-[#A09D95]">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Explanation Banner */}
              <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] font-mono text-xs flex items-center justify-between">
                <span>
                  {currentStep ? currentStep.explanation : 'Click "Compute Search Trace" to inspect step execution.'}
                </span>
                {currentStep && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD]">
                    {currentStep.type}
                  </span>
                )}
              </div>
            </div>
          </VisualizerCanvas>
        </div>
      </div>
    </VisualizerLayout>
  );
}
