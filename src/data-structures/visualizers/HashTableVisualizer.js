import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../../components/VisualizerCanvas';
import PseudocodePanel from '../../components/PseudocodePanel';
import ComplexityBox from '../../components/ComplexityBox';
import VisualizerLayout from '../../components/VisualizerLayout';
import SaveProgressButton from '../../components/SaveProgressButton';
import InlineFeedback from '../components/InlineFeedback';
import { HashTableModel } from '../models/HashTableModel';
import { DarkModeContext } from '../../../context/ThemeContext';
import { dispatchAudio, AudioEventTypes } from '../../audio';

export default function HashTableVisualizer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [model] = useState(() => new HashTableModel(10, 'separateChaining'));
  const [collisionMode, setCollisionMode] = useState('separateChaining');
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [activeBucket, setActiveBucket] = useState(null);
  const [traceSteps, setTraceSteps] = useState([]);
  const [metrics, setMetrics] = useState(() => model.getMetrics());

  useEffect(() => {
    if (model.count === 0) {
      model.set('alpha', 10);
      model.set('beta', 25);
      model.set('gamma', 42);
      model.set('delta', 88);
    }
    syncState();
  }, [model]);

  const syncState = () => {
    setMetrics(model.getMetrics());
  };

  const handleModeChange = (mode) => {
    setCollisionMode(mode);
    model.setCollisionMode(mode);
    syncState();
    setTraceSteps([]);
    setFeedback({
      message: `Switched collision resolution mode to ${mode === 'separateChaining' ? 'SEPARATE CHAINING' : 'LINEAR PROBING (OPEN ADDRESSING)'}.`,
      type: 'info'
    });
    dispatchAudio(AudioEventTypes.UI_TOGGLE);
  };

  const handleInsert = () => {
    if (!keyInput.trim()) {
      setFeedback({ message: 'Please enter a key.', type: 'warning' });
      return;
    }

    const key = keyInput.trim();
    const val = valueInput.trim() ? valueInput.trim() : Math.floor(Math.random() * 90) + 10;

    const res = model.set(key, val);
    if (res.success) {
      setActiveBucket(res.index);
      setTraceSteps(res.trace || []);

      if (res.hasCollision) {
        dispatchAudio(AudioEventTypes.HASH_COLLISION);
      } else {
        dispatchAudio(AudioEventTypes.HASH_INSERT);
      }

      setFeedback({ message: res.message, type: 'success' });
      setKeyInput('');
      setValueInput('');
      syncState();
      setTimeout(() => setActiveBucket(null), 1200);
    } else {
      setFeedback({ message: res.message, type: 'error' });
    }
  };

  const handleSearch = () => {
    if (!searchKey.trim()) return;
    const res = model.get(searchKey.trim());

    if (res.found) {
      setActiveBucket(res.index);
      dispatchAudio(AudioEventTypes.HASH_LOOKUP);
      setFeedback({ message: res.message, type: 'success' });
      setTimeout(() => setActiveBucket(null), 1500);
    } else {
      dispatchAudio(AudioEventTypes.SEARCH_NOT_FOUND);
      setFeedback({ message: res.message, type: 'warning' });
    }
  };

  const handleDelete = () => {
    if (!searchKey.trim()) {
      setFeedback({ message: 'Enter a key to delete in search box.', type: 'warning' });
      return;
    }
    const res = model.delete(searchKey.trim());
    if (res.success) {
      dispatchAudio(AudioEventTypes.LINKED_LIST_DELETE);
      setFeedback({ message: res.message, type: 'success' });
      setSearchKey('');
      syncState();
    } else {
      setFeedback({ message: res.message, type: 'error' });
    }
  };

  const handleResize = () => {
    const newCap = model.capacity === 10 ? 16 : 10;
    model.resize(newCap);
    syncState();
    setFeedback({ message: `Resized table and rehashed all entries to capacity ${newCap}.`, type: 'info' });
    dispatchAudio(AudioEventTypes.UI_SUCCESS);
  };

  const handleClear = () => {
    model.clear();
    syncState();
    setTraceSteps([]);
    setActiveBucket(null);
    setFeedback({ message: 'Hash table has been cleared.', type: 'info' });
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const complexity = {
    bestCase: 'O(1) Direct Hash',
    averageCase: 'O(1) Load Factor ≤ 0.7',
    worstCase: 'O(n) Full Collision',
    time: 'O(1) Avg',
    space: 'O(n)'
  };

  const pseudocode = `// Hash Function & Collision Handling
function hash(key):
  hashVal = 0
  for char in key:
    hashVal = (hashVal * 31 + charCode) % capacity
  return hashVal

function put(key, value):
  index = hash(key)
  if mode == "separateChaining":
    bucket[index].append({key, value})
  else: // linear probing
    while slots[index] is occupied:
      index = (index + 1) % capacity
    slots[index] = {key, value}`;

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Collision Strategy Switcher */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          COLLISION STRATEGY
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('separateChaining')}
            className={`py-2 px-2 text-xs font-mono font-bold rounded-xl transition-all ${
              collisionMode === 'separateChaining'
                ? 'bg-[#EF592A] text-white shadow-2xs'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8]'
            }`}
          >
            Chaining
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('linearProbing')}
            className={`py-2 px-2 text-xs font-mono font-bold rounded-xl transition-all ${
              collisionMode === 'linearProbing'
                ? 'bg-[#EF592A] text-white shadow-2xs'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8]'
            }`}
          >
            Linear Probe
          </button>
        </div>
      </div>

      {/* Insert Controls */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          KEY-VALUE PAIR INSERTION
        </span>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-mono font-bold text-[#69665F] dark:text-[#A09D95]">
                Key
              </label>
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="e.g. user_id"
                className={`w-full p-2 rounded-xl border text-xs font-mono font-semibold mt-1 outline-none focus:border-[#EF592A] ${
                  isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
                }`}
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-bold text-[#69665F] dark:text-[#A09D95]">
                Value
              </label>
              <input
                type="text"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                placeholder="e.g. 102"
                className={`w-full p-2 rounded-xl border text-xs font-mono font-semibold mt-1 outline-none focus:border-[#EF592A] ${
                  isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
                }`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleInsert}
            className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-white hover:bg-[#d64b20] transition-all"
          >
            Store Pair (Hash & Insert)
          </button>

          {/* Search & Delete Controls */}
          <div className="pt-3 border-t border-[#DED9CE] dark:border-[#383630] space-y-2">
            <div>
              <label className="text-[11px] font-mono font-bold text-[#69665F] dark:text-[#A09D95]">
                Lookup / Delete Key
              </label>
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="e.g. alpha"
                className={`w-full p-2 rounded-xl border text-xs font-mono font-semibold mt-1 outline-none focus:border-[#28533D] ${
                  isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSearch}
                className="py-2 rounded-xl font-mono text-xs font-bold bg-[#28533D] text-white hover:bg-[#1f4230] transition-all"
              >
                Lookup Key
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 rounded-xl font-mono text-xs font-bold border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                Delete Key
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
            <button
              type="button"
              onClick={handleResize}
              className={`py-1.5 px-2 rounded-xl border font-mono text-[11px] font-bold ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD]' : 'border-[#DED9CE] text-[#24231F]'
              }`}
            >
              Resize ({model.capacity === 10 ? '→ 16' : '→ 10'})
            </button>
            <button
              type="button"
              onClick={handleClear}
              className={`py-1.5 px-2 rounded-xl border font-mono text-[11px] font-bold text-red-600 dark:text-red-400 ${
                isDarkMode ? 'border-[#383630]' : 'border-[#DED9CE]'
              }`}
            >
              Clear Table
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          TABLE HEALTH & LOAD
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Stored Pairs</span>
            <strong className="text-[#EF592A] text-sm">{metrics.size}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Load Factor</span>
            <strong className="text-[#28533D] dark:text-[#E4E9DD] text-sm">
              {metrics.loadFactor} (α)
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Total Collisions</span>
            <strong className="text-sm">{metrics.collisionCount}</strong>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]">
            <span className="text-[10px] text-[#69665F] dark:text-[#A09D95] block">Total Probes</span>
            <strong className="text-sm">{metrics.probeCount}</strong>
          </div>
        </div>
      </div>

      <SaveProgressButton
        algorithmId="data-structures/hash-table"
        category="data-structures"
        defaultStatus="completed"
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={complexity}
        title="Hash Asymptotics"
      />
      <PseudocodePanel
        title="Hash Table Logic"
        code={pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Hash Table Laboratory"
      subtitle="Direct-address associative key-value repository with polynomial hash dispersion and collision resolution"
      category="Memory Structures"
      complexityBadge="O(1) LOOKUP"
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
            title={`HASH BUCKET ARRAY (${metrics.capacity} SLOTS) // ${collisionMode.toUpperCase()}`}
          >
            <div className="flex flex-col justify-between h-full p-4 space-y-4">
              {/* Header Info */}
              <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Strategy: </span>
                  <strong className="text-[#28533D] dark:text-[#E4E9DD] uppercase">{collisionMode}</strong>
                </div>
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Formula: </span>
                  <span className="text-[#EF592A] font-bold">h(key) = (∑ c × 31ⁱ) % {metrics.capacity}</span>
                </div>
              </div>

              {/* Bucket Grid Layout */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {Array.from({ length: metrics.capacity }).map((_, idx) => {
                  const isActive = activeBucket === idx;
                  const bucketContent = model.buckets[idx];

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                        isActive
                          ? 'bg-[#EF592A]/10 border-[#EF592A] ring-2 ring-[#EF592A]/30'
                          : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630]'
                      }`}
                    >
                      {/* Slot Header */}
                      <div className="flex items-center space-x-2 font-mono text-xs w-28 shrink-0">
                        <span className={`px-2 py-1 rounded font-bold ${
                          isActive
                            ? 'bg-[#EF592A] text-white'
                            : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630]'
                        }`}>
                          [{idx}]
                        </span>
                        <span className="text-[10px] opacity-70">
                          {collisionMode === 'separateChaining' ? `(${bucketContent?.length || 0})` : ''}
                        </span>
                      </div>

                      {/* Content representation */}
                      <div className="flex-1 flex items-center space-x-2 overflow-x-auto pl-2 font-mono text-xs">
                        {collisionMode === 'separateChaining' ? (
                          bucketContent && bucketContent.length > 0 ? (
                            bucketContent.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center space-x-1.5 shrink-0">
                                <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#28533D]/40 font-bold flex items-center space-x-1.5">
                                  <span className="text-[#28533D] dark:text-[#E4E9DD]">{item.key}</span>
                                  <span className="text-[10px] text-[#A09D95]">→</span>
                                  <span className="text-[#EF592A]">{item.value}</span>
                                </div>
                                {itemIdx < bucketContent.length - 1 && (
                                  <span className="text-xs text-[#A09D95]">→</span>
                                )}
                              </div>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#A09D95] italic">Empty Bucket</span>
                          )
                        ) : (
                          // Linear Probing Slot
                          bucketContent !== null ? (
                            bucketContent.isDeleted ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-bold">
                                ⚰️ TOMBSTONE (Deleted)
                              </span>
                            ) : (
                              <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#28533D]/40 font-bold flex items-center space-x-1.5">
                                <span className="text-[#28533D] dark:text-[#E4E9DD]">{bucketContent.key}</span>
                                <span className="text-[10px] text-[#A09D95]">→</span>
                                <span className="text-[#EF592A]">{bucketContent.value}</span>
                              </div>
                            )
                          ) : (
                            <span className="text-[11px] text-[#A09D95] italic">Available Slot</span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Trace Steps */}
              {traceSteps.length > 0 && (
                <div className="p-3 rounded-xl bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] font-mono text-[11px]">
                  <span className="font-bold text-[#EF592A] uppercase tracking-wider block mb-1">
                    EXECUTION TRACE
                  </span>
                  <div className="space-y-0.5 text-[#24231F] dark:text-[#FFFDF8]">
                    {traceSteps.map((st, i) => (
                      <div key={i}>
                        <span className="text-[#69665F] dark:text-[#A09D95]">Step {st.step}: </span>
                        {st.desc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </VisualizerCanvas>
        </div>
      </div>
    </VisualizerLayout>
  );
}
