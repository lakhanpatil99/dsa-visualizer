import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../../components/VisualizerCanvas';
import PseudocodePanel from '../../components/PseudocodePanel';
import ComplexityBox from '../../components/ComplexityBox';
import VisualizerLayout from '../../components/VisualizerLayout';
import SaveProgressButton from '../../components/SaveProgressButton';
import InlineFeedback from '../components/InlineFeedback';
import { StackModel } from '../models/StackModel';
import { DarkModeContext } from '../../../context/ThemeContext';
import { dispatchAudio, AudioEventTypes } from '../../audio';

export default function StackVisualizer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [model] = useState(() => new StackModel(8));
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [activeSlot, setActiveSlot] = useState(null);
  const [animatingAction, setAnimatingAction] = useState(null); // 'pushing' | 'popping'
  const [metrics, setMetrics] = useState(() => model.getMetrics());

  // Initialize sample stack on mount
  useEffect(() => {
    if (model.isEmpty()) {
      [18, 42, 65, 88].forEach(val => model.push(val));
    }
    syncState();
  }, [model]);

  const syncState = () => {
    setItems(model.toArray());
    setMetrics(model.getMetrics());
  };

  const handlePush = () => {
    if (!inputValue.trim()) {
      setFeedback({ message: 'Please enter a numeric value to push.', type: 'warning' });
      return;
    }

    const val = Number(inputValue.trim());
    if (isNaN(val)) {
      setFeedback({ message: 'Input must be a valid number.', type: 'error' });
      return;
    }

    if (model.isFull()) {
      setFeedback({
        message: `Stack Overflow: Capacity limit (${model.getCapacity()}) reached. Cannot push.`,
        type: 'warning'
      });
      dispatchAudio(AudioEventTypes.STACK_UNDERFLOW);
      return;
    }

    setAnimatingAction('pushing');
    setActiveSlot(items.length);
    const res = model.push(val);

    if (res.success) {
      dispatchAudio(AudioEventTypes.STACK_PUSH, { valueRatio: (val % 100) / 100 });
      setFeedback({ message: res.message, type: 'success' });
      setInputValue('');
      syncState();
      setTimeout(() => {
        setAnimatingAction(null);
        setActiveSlot(null);
      }, 400);
    }
  };

  const handlePop = () => {
    if (model.isEmpty()) {
      setFeedback({
        message: 'Stack Underflow: Cannot pop from an empty stack.',
        type: 'warning'
      });
      dispatchAudio(AudioEventTypes.STACK_UNDERFLOW);
      return;
    }

    const topIndex = items.length - 1;
    setActiveSlot(topIndex);
    setAnimatingAction('popping');

    setTimeout(() => {
      const res = model.pop();
      if (res.success) {
        dispatchAudio(AudioEventTypes.STACK_POP, { valueRatio: (res.value % 100) / 100 });
        setFeedback({ message: res.message, type: 'success' });
        syncState();
      }
      setAnimatingAction(null);
      setActiveSlot(null);
    }, 250);
  };

  const handlePeek = () => {
    const res = model.peek();
    if (res.success) {
      setActiveSlot(items.length - 1);
      dispatchAudio(AudioEventTypes.STACK_PEEK);
      setFeedback({ message: res.message, type: 'info' });
      setTimeout(() => setActiveSlot(null), 1200);
    } else {
      dispatchAudio(AudioEventTypes.STACK_UNDERFLOW);
      setFeedback({ message: res.message, type: 'warning' });
    }
  };

  const handleClear = () => {
    model.clear();
    syncState();
    setActiveSlot(null);
    setFeedback({ message: 'Stack repository has been cleared.', type: 'info' });
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const stackComplexity = {
    bestCase: 'O(1)',
    averageCase: 'O(1)',
    worstCase: 'O(1)',
    time: 'O(1)',
    space: 'O(n)'
  };

  const pseudocode = `// LIFO Stack Operations
function push(element):
  if size >= capacity:
    throw StackOverflow
  items[top + 1] = element
  top = top + 1

function pop():
  if isEmpty():
    throw StackUnderflow
  element = items[top]
  top = top - 1
  return element

function peek():
  if isEmpty(): return null
  return items[top]`;

  const topIndex = items.length - 1;

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Input & Operations */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-3">
          STACK CONTROLS (LIFO)
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
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              placeholder="e.g. 54"
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold mt-1 outline-none focus:border-[#EF592A] transition-colors ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePush}
              disabled={items.length >= 8}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-white hover:bg-[#d64b20] transition-all disabled:opacity-40"
            >
              Push (Top)
            </button>
            <button
              type="button"
              onClick={handlePop}
              disabled={items.length === 0}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#28533D] text-white hover:bg-[#1f4230] transition-all disabled:opacity-40"
            >
              Pop (Top)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePeek}
              disabled={items.length === 0}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD] hover:bg-[#2A2925]' : 'border-[#DED9CE] text-[#24231F] hover:bg-[#FAF8F3]'
              }`}
            >
              Peek Top
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={items.length === 0}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all text-red-600 dark:text-red-400 ${
                isDarkMode ? 'border-[#383630] hover:bg-[#2A2925]' : 'border-[#DED9CE] hover:bg-[#FAF8F3]'
              }`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          EXECUTION METRICS
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Current Size</span>
            <strong className="text-[#EF592A] text-sm">{metrics.size} / {metrics.capacity}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Top Value</span>
            <strong className="text-[#28533D] dark:text-[#E4E9DD] text-sm">
              {metrics.topValue !== null ? metrics.topValue : 'None'}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Total Pushes</span>
            <strong className="text-sm">{metrics.pushCount}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Total Pops</span>
            <strong className="text-sm">{metrics.popCount}</strong>
          </div>
        </div>
      </div>

      <SaveProgressButton
        algorithmId="data-structures/stack"
        category="data-structures"
        defaultStatus="completed"
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={stackComplexity}
        title="Stack Complexity"
      />
      <PseudocodePanel
        title="Stack Algorithms (LIFO)"
        code={pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Stack Laboratory"
      subtitle="Last-In, First-Out sequential storage with animated top pointer transitions and capacity boundaries"
      category="Memory Structures"
      complexityBadge="O(1) LIFO"
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
            width={850}
            height={440}
            title="Vertical Stack Reservoir (Bounded Capacity: 8)"
          >
            <div className="flex flex-col items-center justify-between h-full p-4 space-y-4">
              {/* Header Info */}
              <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF592A]"></span>
                  <span className="font-bold uppercase text-[#EF592A] tracking-wider">
                    LIFO TOP RESERVOIR
                  </span>
                </div>
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Bounded Capacity: </span>
                  <strong className="text-[#24231F] dark:text-[#FFFDF8]">8 Slots</strong>
                  <span className="mx-2 text-[#DED9CE]">|</span>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Occupancy: </span>
                  <strong className={items.length >= 8 ? 'text-red-500 font-bold' : 'text-[#28533D] dark:text-[#E4E9DD]'}>
                    {items.length} / 8
                  </strong>
                </div>
              </div>

              {/* Vertical Stack Frame */}
              <div className="relative flex items-center justify-center w-full max-w-sm my-auto">
                {/* Sliding TOP Pointer */}
                {items.length > 0 && (
                  <div
                    className="absolute -left-28 sm:-left-32 flex items-center space-x-1.5 transition-all duration-300 z-10"
                    style={{
                      bottom: `${(items.length - 1) * 44 + 20}px`
                    }}
                  >
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#EF592A] text-white shadow-sm animate-pulse">
                      TOP [{items[topIndex]}]
                    </span>
                    <span className="text-base font-bold text-[#EF592A]">→</span>
                  </div>
                )}

                {/* Stack Cylinder / Well */}
                <div className={`w-64 sm:w-72 h-[370px] border-b-4 border-l-4 border-r-4 rounded-b-2xl p-3 flex flex-col-reverse items-center justify-start gap-2 shadow-inner transition-colors duration-200 ${
                  isDarkMode ? 'border-[#4A473F] bg-[#1A1916]' : 'border-[#24231F] bg-[#FAF8F3]'
                }`}>
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#69665F] dark:text-[#A09D95] space-y-1 font-mono text-xs">
                      <span className="font-bold">[ Stack is Empty ]</span>
                      <span className="text-[10px] text-[#8E8B83]">Push an element to begin</span>
                    </div>
                  ) : (
                    items.map((item, index) => {
                      const isTop = index === topIndex;
                      const isCurrentActive = activeSlot === index;

                      return (
                        <div
                          key={index}
                          className={`w-full h-10 sm:h-11 rounded-xl flex items-center justify-between px-4 font-mono font-bold text-sm shadow-xs transition-all duration-300 ${
                            isCurrentActive
                              ? 'bg-[#EF592A] text-white scale-102 ring-2 ring-[#EF592A]'
                              : isTop
                              ? 'bg-[#28533D] text-white border border-[#28533D]'
                              : isDarkMode
                              ? 'bg-[#2A2925] text-[#FFFDF8] border border-[#3E3C36]'
                              : 'bg-[#FFFDF8] text-[#24231F] border border-[#DED9CE]'
                          }`}
                        >
                          <span className="text-xs opacity-70">[{index}]</span>
                          <span className="text-base tracking-wide">{item}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {isTop ? 'TOP' : 'SLOT'}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div className="w-full flex items-center justify-between text-xs font-mono border-t border-[#DED9CE] dark:border-[#383630] pt-2 text-[#69665F] dark:text-[#A09D95]">
                <span>Push: <strong>O(1)</strong> | Pop: <strong>O(1)</strong> | Peek: <strong>O(1)</strong></span>
                <span>Top Slot: <strong className="text-[#EF592A]">{items.length > 0 ? items[topIndex] : 'None'}</strong></span>
              </div>
            </div>
          </VisualizerCanvas>
        </div>
      </div>
    </VisualizerLayout>
  );
}
