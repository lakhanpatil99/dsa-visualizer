import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../../components/VisualizerCanvas';
import PseudocodePanel from '../../components/PseudocodePanel';
import ComplexityBox from '../../components/ComplexityBox';
import VisualizerLayout from '../../components/VisualizerLayout';
import SaveProgressButton from '../../components/SaveProgressButton';
import InlineFeedback from '../components/InlineFeedback';
import { QueueModel } from '../models/QueueModel';
import { DarkModeContext } from '../../../context/ThemeContext';
import { dispatchAudio, AudioEventTypes } from '../../audio';

export default function QueueVisualizer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [model] = useState(() => new QueueModel(8));
  const [orderedItems, setOrderedItems] = useState([]);
  const [bufferSlots, setBufferSlots] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [activeSlot, setActiveSlot] = useState(null);
  const [metrics, setMetrics] = useState(() => model.getMetrics());

  useEffect(() => {
    if (model.isEmpty()) {
      [14, 28, 42, 56, 70].forEach(val => model.enqueue(val));
    }
    syncState();
  }, [model]);

  const syncState = () => {
    setOrderedItems(model.getOrderedItems());
    setBufferSlots(model.getBufferSlots());
    setMetrics(model.getMetrics());
  };

  const handleEnqueue = () => {
    if (!inputValue.trim()) {
      setFeedback({ message: 'Please enter a numeric value to enqueue.', type: 'warning' });
      return;
    }

    const val = Number(inputValue.trim());
    if (isNaN(val)) {
      setFeedback({ message: 'Input must be a valid number.', type: 'error' });
      return;
    }

    if (model.isFull()) {
      setFeedback({
        message: `Queue Overflow: circular buffer capacity (${model.getCapacity()}) reached. Dequeue elements first.`,
        type: 'warning'
      });
      dispatchAudio(AudioEventTypes.QUEUE_EMPTY);
      return;
    }

    const res = model.enqueue(val);
    if (res.success) {
      setActiveSlot(res.slotIndex);
      dispatchAudio(AudioEventTypes.QUEUE_ENQUEUE, { valueRatio: (val % 100) / 100 });
      setFeedback({ message: res.message, type: 'success' });
      setInputValue('');
      syncState();
      setTimeout(() => setActiveSlot(null), 500);
    }
  };

  const handleDequeue = () => {
    if (model.isEmpty()) {
      setFeedback({ message: 'Queue Underflow: Cannot dequeue from an empty queue.', type: 'warning' });
      dispatchAudio(AudioEventTypes.QUEUE_EMPTY);
      return;
    }

    const headIdx = metrics.headIndex;
    setActiveSlot(headIdx);

    setTimeout(() => {
      const res = model.dequeue();
      if (res.success) {
        dispatchAudio(AudioEventTypes.QUEUE_DEQUEUE, { valueRatio: (res.value % 100) / 100 });
        setFeedback({ message: res.message, type: 'success' });
        syncState();
      }
      setActiveSlot(null);
    }, 250);
  };

  const handlePeekFront = () => {
    const res = model.peekFront();
    if (res.success) {
      setActiveSlot(res.index);
      dispatchAudio(AudioEventTypes.QUEUE_FRONT);
      setFeedback({ message: res.message, type: 'info' });
      setTimeout(() => setActiveSlot(null), 1200);
    } else {
      dispatchAudio(AudioEventTypes.QUEUE_EMPTY);
      setFeedback({ message: res.message, type: 'warning' });
    }
  };

  const handleClear = () => {
    model.clear();
    syncState();
    setActiveSlot(null);
    setFeedback({ message: 'Queue buffer has been cleared.', type: 'info' });
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const queueComplexity = {
    bestCase: 'O(1)',
    averageCase: 'O(1)',
    worstCase: 'O(1)',
    time: 'O(1)',
    space: 'O(n)'
  };

  const pseudocode = `// Circular Buffer Queue O(1)
function enqueue(element):
  if count >= capacity:
    throw QueueOverflow
  buffer[tail] = element
  tail = (tail + 1) % capacity
  count = count + 1

function dequeue():
  if isEmpty():
    throw QueueUnderflow
  element = buffer[head]
  buffer[head] = null
  head = (head + 1) % capacity
  count = count - 1
  return element`;

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-3">
          QUEUE CONTROLS (FIFO)
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
              onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
              placeholder="e.g. 84"
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold mt-1 outline-none focus:border-[#EF592A] transition-colors ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleEnqueue}
              disabled={model.isFull()}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-white hover:bg-[#d64b20] transition-all disabled:opacity-40"
            >
              Enqueue (Rear)
            </button>
            <button
              type="button"
              onClick={handleDequeue}
              disabled={model.isEmpty()}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#28533D] text-white hover:bg-[#1f4230] transition-all disabled:opacity-40"
            >
              Dequeue (Front)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePeekFront}
              disabled={model.isEmpty()}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD] hover:bg-[#2A2925]' : 'border-[#DED9CE] text-[#24231F] hover:bg-[#FAF8F3]'
              }`}
            >
              Peek Front
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={model.isEmpty()}
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
          CIRCULAR BUFFER METRICS
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Occupancy</span>
            <strong className="text-[#EF592A] text-sm">{metrics.size} / {metrics.capacity}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Front Pointer</span>
            <strong className="text-[#28533D] dark:text-[#E4E9DD] text-sm">Slot [{metrics.headIndex}]</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Rear Pointer</span>
            <strong className="text-sm">Slot [{metrics.tailIndex}]</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Time Guarantee</span>
            <strong className="text-xs text-[#28533D] dark:text-[#E4E9DD]">Strict O(1)</strong>
          </div>
        </div>
      </div>

      <SaveProgressButton
        algorithmId="data-structures/queue"
        category="data-structures"
        defaultStatus="completed"
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={queueComplexity}
        title="Queue Complexity"
      />
      <PseudocodePanel
        title="Circular Buffer Logic"
        code={pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Queue Laboratory"
      subtitle="First-In, First-Out linear buffer with true O(1) circular pointers and zero array shifting"
      category="Memory Structures"
      complexityBadge="O(1) FIFO"
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
            width={900}
            height={440}
            title="O(1) Circular Buffer Queue Architecture"
          >
            <div className="flex flex-col justify-between h-full p-4 space-y-6">
              {/* Header Info */}
              <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28533D]"></span>
                  <span className="font-bold uppercase text-[#28533D] dark:text-[#E4E9DD] tracking-wider">
                    FIFO MEMORY PIPELINE
                  </span>
                </div>
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Dequeue (Exit): </span>
                  <strong className="text-[#28533D] dark:text-[#E4E9DD]">FRONT</strong>
                  <span className="mx-2 text-[#DED9CE]">→</span>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Enqueue (Enter): </span>
                  <strong className="text-[#EF592A]">REAR</strong>
                </div>
              </div>

              {/* View 1: Physical Circular Buffer Slots */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase block px-1">
                  1. PHYSICAL CIRCULAR BUFFER (8 FIXED SLOTS)
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bufferSlots.map((slot) => {
                    const isActive = activeSlot === slot.index;
                    return (
                      <div
                        key={slot.index}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-between min-h-[90px] font-mono transition-all duration-300 ${
                          isActive
                            ? 'bg-[#EF592A] text-white ring-2 ring-[#EF592A] scale-105'
                            : slot.isOccupied
                            ? 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#28533D]/40 text-[#24231F] dark:text-[#FFFDF8]'
                            : 'bg-[#FAF8F3] dark:bg-[#1A1916] border-dashed border-[#DED9CE] dark:border-[#383630] text-[#A09D95]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full text-[10px] opacity-70">
                          <span>[{slot.index}]</span>
                          {slot.isHead && <span className="font-bold text-[#28533D] dark:text-[#E4E9DD]">H</span>}
                          {slot.isTail && <span className="font-bold text-[#EF592A]">T</span>}
                        </div>

                        <span className="text-lg font-bold my-1">
                          {slot.value !== null ? slot.value : '—'}
                        </span>

                        <div className="text-[9px] font-bold tracking-wider uppercase">
                          {slot.isHead && slot.isTail
                            ? 'H/T'
                            : slot.isHead
                            ? 'FRONT'
                            : slot.isTail
                            ? 'REAR'
                            : slot.isOccupied
                            ? 'OCCUPIED'
                            : 'FREE'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View 2: Logical FIFO Queue Pipeline */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase block px-1">
                  2. LOGICAL FIFO TRANSIT STREAM (HEAD → TAIL)
                </span>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {orderedItems.length === 0 ? (
                    <div className="w-full text-center py-4 font-mono text-xs text-[#69665F] dark:text-[#A09D95]">
                      Queue is currently empty. Enqueue elements to populate.
                    </div>
                  ) : (
                    orderedItems.map((val, idx) => {
                      const isFront = idx === 0;
                      const isRear = idx === orderedItems.length - 1;

                      return (
                        <div key={idx} className="flex items-center space-x-2 shrink-0">
                          <div
                            className={`px-4 py-2.5 rounded-xl font-mono font-bold text-sm border flex flex-col items-center min-w-[70px] shadow-2xs transition-all ${
                              isFront
                                ? 'bg-[#28533D] text-white border-[#28533D]'
                                : isRear
                                ? 'bg-[#EF592A] text-white border-[#EF592A]'
                                : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630]'
                            }`}
                          >
                            <span className="text-base">{val}</span>
                            <span className="text-[9px] tracking-wider uppercase opacity-80 mt-0.5">
                              {isFront ? 'FRONT' : isRear ? 'REAR' : `+${idx}`}
                            </span>
                          </div>
                          {!isRear && (
                            <span className="text-xs font-bold text-[#A09D95]">→</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bottom Specs */}
              <div className="w-full flex items-center justify-between text-xs font-mono border-t border-[#DED9CE] dark:border-[#383630] pt-2 text-[#69665F] dark:text-[#A09D95]">
                <span>Enqueue: <strong>O(1)</strong> | Dequeue: <strong>O(1)</strong> | Peek: <strong>O(1)</strong></span>
                <span>Buffer State: <strong className="text-[#28533D] dark:text-[#E4E9DD]">{model.isFull() ? 'Full' : model.isEmpty() ? 'Empty' : 'Active'}</strong></span>
              </div>
            </div>
          </VisualizerCanvas>
        </div>
      </div>
    </VisualizerLayout>
  );
}
