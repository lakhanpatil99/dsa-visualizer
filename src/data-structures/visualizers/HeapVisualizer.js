import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../../components/VisualizerCanvas';
import PseudocodePanel from '../../components/PseudocodePanel';
import ComplexityBox from '../../components/ComplexityBox';
import VisualizerLayout from '../../components/VisualizerLayout';
import SaveProgressButton from '../../components/SaveProgressButton';
import InlineFeedback from '../components/InlineFeedback';
import { HeapModel } from '../models/HeapModel';
import { DarkModeContext } from '../../../context/ThemeContext';
import { dispatchAudio, AudioEventTypes } from '../../audio';

export default function HeapVisualizer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [model] = useState(() => new HeapModel('max'));
  const [heapArray, setHeapArray] = useState([]);
  const [heapType, setHeapType] = useState('max');
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [activeIndices, setActiveIndices] = useState(new Set());
  const [metrics, setMetrics] = useState(() => model.getMetrics());

  useEffect(() => {
    if (model.isEmpty()) {
      model.buildHeap([90, 75, 80, 50, 65, 45, 70]);
    }
    syncState();
  }, [model]);

  const syncState = () => {
    setHeapArray(model.toArray());
    setMetrics(model.getMetrics());
  };

  const handleTypeChange = (type) => {
    setHeapType(type);
    model.setType(type);
    syncState();
    setFeedback({
      message: `Re-heapified into ${type.toUpperCase()}-HEAP structure.`,
      type: 'info'
    });
    dispatchAudio(AudioEventTypes.UI_TOGGLE);
  };

  const handleInsert = async () => {
    if (!inputValue.trim()) {
      setFeedback({ message: 'Enter a numeric value to insert.', type: 'warning' });
      return;
    }

    const val = Number(inputValue.trim());
    if (isNaN(val)) {
      setFeedback({ message: 'Value must be a valid number.', type: 'error' });
      return;
    }

    if (heapArray.length >= 15) {
      setFeedback({ message: 'Tree display limit reached (max 15 nodes for 4 levels).', type: 'warning' });
      return;
    }

    const res = model.insert(val);
    if (res.success) {
      dispatchAudio(AudioEventTypes.HEAP_INSERT, { valueRatio: (val % 100) / 100 });
      setFeedback({ message: res.message, type: 'success' });
      setInputValue('');
      syncState();

      // Animate sift steps
      if (res.trace && res.trace.length > 0) {
        for (const st of res.trace) {
          if (st.type === 'SWAP') {
            setActiveIndices(new Set([st.index, st.swappedWith]));
            dispatchAudio(AudioEventTypes.HEAP_SIFT_UP);
            await new Promise(r => setTimeout(r, 350));
          }
        }
        setActiveIndices(new Set());
      }
    }
  };

  const handleExtract = async () => {
    if (model.isEmpty()) {
      setFeedback({ message: 'Cannot extract: heap is empty.', type: 'warning' });
      dispatchAudio(AudioEventTypes.STACK_UNDERFLOW);
      return;
    }

    const res = model.extractRoot();
    if (res.success) {
      dispatchAudio(AudioEventTypes.HEAP_EXTRACT);
      setFeedback({ message: res.message, type: 'success' });
      syncState();

      if (res.trace && res.trace.length > 0) {
        for (const st of res.trace) {
          if (st.type === 'SWAP') {
            setActiveIndices(new Set([st.index, st.swappedWith]));
            dispatchAudio(AudioEventTypes.HEAP_SIFT_DOWN);
            await new Promise(r => setTimeout(r, 350));
          }
        }
        setActiveIndices(new Set());
      }
    }
  };

  const handleBuildSample = () => {
    const sample = [15, 30, 20, 85, 45, 95, 60, 10];
    model.buildHeap(sample);
    syncState();
    setFeedback({
      message: `Built ${heapType}-heap from sample array via Floyd's O(n) algorithm.`,
      type: 'success'
    });
    dispatchAudio(AudioEventTypes.UI_SUCCESS);
  };

  const handleClear = () => {
    model.clear();
    syncState();
    setActiveIndices(new Set());
    setFeedback({ message: 'Heap cleared.', type: 'info' });
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const complexity = {
    time: {
      best: 'O(1) Peek',
      average: 'O(log n) Insert / Extract',
      worst: 'O(n) Build Heap'
    },
    space: 'O(n)'
  };

  const pseudocode = `// Binary Heap Properties
function insert(element):
  heap.append(element)
  siftUp(heap.length - 1)

function extractRoot():
  root = heap[0]
  heap[0] = heap.pop()
  siftDown(0)
  return root

function siftUp(i):
  while i > 0 and compare(heap[i], heap[parent(i)]):
    swap(i, parent(i))
    i = parent(i)`;

  // Compute node coordinates for standard complete tree (up to 4 levels)
  const getNodeCoordinates = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = Math.pow(2, level) - 1;
    const indexInLevel = index - levelStart;
    const nodesInLevel = Math.pow(2, level);

    const totalWidth = 720;
    const stepX = totalWidth / (nodesInLevel + 1);
    const x = stepX * (indexInLevel + 1);
    const y = 50 + level * 70;

    return { x, y, level };
  };

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Heap Variant Selector */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          HEAP PROPERTY
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('max')}
            className={`py-2 px-3 text-xs font-mono font-bold rounded-xl transition-all ${
              heapType === 'max'
                ? 'bg-[#EF592A] text-white shadow-2xs'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8]'
            }`}
          >
            Max-Heap (Parent ≥ Child)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('min')}
            className={`py-2 px-3 text-xs font-mono font-bold rounded-xl transition-all ${
              heapType === 'min'
                ? 'bg-[#EF592A] text-white shadow-2xs'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8]'
            }`}
          >
            Min-Heap (Parent ≤ Child)
          </button>
        </div>
      </div>

      {/* Operations Controls */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          PRIORITY QUEUE OPERATIONS
        </span>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">
              Element Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 72"
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold mt-1 outline-none focus:border-[#EF592A] transition-colors ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleInsert}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-white hover:bg-[#d64b20] transition-all"
            >
              Insert (Sift-Up)
            </button>
            <button
              type="button"
              onClick={handleExtract}
              disabled={heapArray.length === 0}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#28533D] text-white hover:bg-[#1f4230] transition-all disabled:opacity-40"
            >
              Extract Root
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleBuildSample}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD] hover:bg-[#2A2925]' : 'border-[#DED9CE] text-[#24231F] hover:bg-[#FAF8F3]'
              }`}
            >
              Build Sample
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={heapArray.length === 0}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold text-red-600 dark:text-red-400 transition-all ${
                isDarkMode ? 'border-[#383630] hover:bg-[#2A2925]' : 'border-[#DED9CE] hover:bg-[#FAF8F3]'
              }`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Heap Metrics */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          HEAP STATE & METRICS
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Node Count</span>
            <strong className="text-[#EF592A] text-sm">{metrics.size}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Root Element</span>
            <strong className="text-[#28533D] dark:text-[#E4E9DD] text-sm">{metrics.rootValue ?? 'None'}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Tree Height</span>
            <strong className="text-sm">{metrics.height}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Invariant Check</span>
            <strong className={metrics.isValid ? 'text-[#28533D] dark:text-[#E4E9DD]' : 'text-red-500'}>
              {metrics.isValid ? '✓ Valid' : '✕ Violated'}
            </strong>
          </div>
        </div>
      </div>

      <SaveProgressButton
        algorithmId="data-structures/heap"
        category="data-structures"
        defaultStatus="completed"
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={complexity}
        title="Heap Asymptotics"
      />
      <PseudocodePanel
        title="Binary Heap Operations"
        code={pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Binary Heap & Priority Queue"
      subtitle="Complete binary tree maintaining invariant properties with logarithmic sift-up/down and in-place array mapping"
      category="Memory Structures"
      complexityBadge={`O(log n) ${heapType.toUpperCase()}-HEAP`}
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
            height={460}
            title={`${heapType.toUpperCase()}-HEAP COMPLETE BINARY TREE`}
          >
            <div className="flex flex-col justify-between h-full p-4 space-y-4">
              {/* Header Info */}
              <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Heap Invariant: </span>
                  <strong className="text-[#28533D] dark:text-[#E4E9DD] uppercase">
                    {heapType === 'max' ? 'Parent ≥ Children' : 'Parent ≤ Children'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Priority Root: </span>
                  <strong className="text-[#EF592A] text-sm">{heapArray[0] ?? 'Empty'}</strong>
                </div>
              </div>

              {/* Complete Binary Tree View (SVG) */}
              <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
                {heapArray.length === 0 ? (
                  <div className="font-mono text-xs text-[#69665F] dark:text-[#A09D95]">
                    [ Empty Binary Heap ]
                  </div>
                ) : (
                  <svg className="w-full h-[280px]" viewBox="0 0 720 280">
                    {/* Connecting Edges */}
                    {heapArray.map((_, idx) => {
                      if (idx === 0) return null;
                      const parentIdx = Math.floor((idx - 1) / 2);
                      const parentPos = getNodeCoordinates(parentIdx);
                      const childPos = getNodeCoordinates(idx);

                      return (
                        <line
                          key={`edge-${idx}`}
                          x1={parentPos.x}
                          y1={parentPos.y}
                          x2={childPos.x}
                          y2={childPos.y}
                          stroke={isDarkMode ? '#383630' : '#DED9CE'}
                          strokeWidth="2"
                        />
                      );
                    })}

                    {/* Nodes */}
                    {heapArray.map((val, idx) => {
                      const pos = getNodeCoordinates(idx);
                      const isRoot = idx === 0;
                      const isActive = activeIndices.has(idx);

                      return (
                        <g key={`node-${idx}`}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="20"
                            fill={
                              isActive
                                ? '#EF592A'
                                : isRoot
                                ? '#28533D'
                                : isDarkMode
                                ? '#24231F'
                                : '#FFFDF8'
                            }
                            stroke={isActive ? '#EF592A' : isRoot ? '#28533D' : isDarkMode ? '#4A473F' : '#DED9CE'}
                            strokeWidth="2.5"
                            className="transition-all duration-300"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            fill={isActive || isRoot ? '#FFFDF8' : isDarkMode ? '#FFFDF8' : '#24231F'}
                            fontFamily="monospace"
                            fontWeight="bold"
                            fontSize="13"
                          >
                            {val}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y + 32}
                            textAnchor="middle"
                            fill={isDarkMode ? '#8E8B83' : '#69665F'}
                            fontFamily="monospace"
                            fontSize="9"
                          >
                            [{idx}]
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* View 2: Sequential Array Mapping */}
              <div className="w-full space-y-1.5 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase">
                  <span>In-Memory Array Representation (Index Formula: Left = 2i+1, Right = 2i+2)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs overflow-x-auto">
                  {heapArray.map((val, idx) => {
                    const isRoot = idx === 0;
                    const isActive = activeIndices.has(idx);
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg border flex flex-col items-center min-w-[50px] transition-all ${
                          isActive
                            ? 'bg-[#EF592A] text-white border-[#EF592A]'
                            : isRoot
                            ? 'bg-[#28533D] text-white border-[#28533D]'
                            : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]'
                        }`}
                      >
                        <span className="font-bold text-sm">{val}</span>
                        <span className="text-[9px] opacity-70">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </VisualizerCanvas>
        </div>
      </div>
    </VisualizerLayout>
  );
}
