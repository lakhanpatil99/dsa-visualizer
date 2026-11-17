import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../../components/VisualizerCanvas';
import PseudocodePanel from '../../components/PseudocodePanel';
import ComplexityBox from '../../components/ComplexityBox';
import VisualizerLayout from '../../components/VisualizerLayout';
import SaveProgressButton from '../../components/SaveProgressButton';
import InlineFeedback from '../components/InlineFeedback';
import { LinkedListModel } from '../models/LinkedListModel';
import { DarkModeContext } from '../../../context/ThemeContext';
import { dispatchAudio, AudioEventTypes } from '../../audio';

export default function LinkedListVisualizer() {
  const { isDarkMode } = useContext(DarkModeContext);
  const [model] = useState(() => new LinkedListModel('singly'));
  const [nodes, setNodes] = useState([]);
  const [listType, setListType] = useState('singly');
  const [inputValue, setInputValue] = useState('');
  const [indexValue, setIndexValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [metrics, setMetrics] = useState(() => model.getMetrics());

  useEffect(() => {
    if (model.isEmpty()) {
      [12, 24, 36, 48].forEach(val => model.insertAtTail(val));
    }
    syncState();
  }, [model]);

  const syncState = () => {
    setNodes(model.toArray());
    setMetrics(model.getMetrics());
  };

  const handleTypeChange = (newType) => {
    setListType(newType);
    model.setType(newType);
    syncState();
    setFeedback({
      message: `Switched Linked List variant to ${newType.toUpperCase()}.`,
      type: 'info'
    });
    dispatchAudio(AudioEventTypes.UI_TOGGLE);
  };

  const handleInsertHead = () => {
    if (!inputValue.trim()) {
      setFeedback({ message: 'Enter a value to insert at HEAD.', type: 'warning' });
      return;
    }
    const val = Number(inputValue.trim());
    if (isNaN(val)) {
      setFeedback({ message: 'Input must be a valid number.', type: 'error' });
      return;
    }

    const res = model.insertAtHead(val);
    if (res.success) {
      dispatchAudio(AudioEventTypes.LINKED_LIST_INSERT, { valueRatio: (val % 100) / 100 });
      setFeedback({ message: res.message, type: 'success' });
      setInputValue('');
      syncState();
      setActiveNodeId(model.head?.id);
      setTimeout(() => setActiveNodeId(null), 500);
    }
  };

  const handleInsertTail = () => {
    if (!inputValue.trim()) {
      setFeedback({ message: 'Enter a value to insert at TAIL.', type: 'warning' });
      return;
    }
    const val = Number(inputValue.trim());
    if (isNaN(val)) {
      setFeedback({ message: 'Input must be a valid number.', type: 'error' });
      return;
    }

    const res = model.insertAtTail(val);
    if (res.success) {
      dispatchAudio(AudioEventTypes.LINKED_LIST_INSERT, { valueRatio: (val % 100) / 100 });
      setFeedback({ message: res.message, type: 'success' });
      setInputValue('');
      syncState();
      setActiveNodeId(model.tail?.id);
      setTimeout(() => setActiveNodeId(null), 500);
    }
  };

  const handleInsertIndex = () => {
    if (!inputValue.trim() || !indexValue.trim()) {
      setFeedback({ message: 'Enter both a value and a valid index.', type: 'warning' });
      return;
    }
    const val = Number(inputValue.trim());
    const idx = Number(indexValue.trim());

    const res = model.insertAtIndex(idx, val);
    if (res.success) {
      dispatchAudio(AudioEventTypes.LINKED_LIST_CONNECT);
      setFeedback({ message: res.message, type: 'success' });
      setInputValue('');
      setIndexValue('');
      syncState();
    } else {
      setFeedback({ message: res.message, type: 'error' });
    }
  };

  const handleDeleteHead = () => {
    if (model.isEmpty()) {
      setFeedback({ message: 'Cannot delete: list is empty.', type: 'warning' });
      return;
    }
    const res = model.deleteAtHead();
    if (res.success) {
      dispatchAudio(AudioEventTypes.LINKED_LIST_DELETE);
      setFeedback({ message: res.message, type: 'success' });
      syncState();
    }
  };

  const handleDeleteTail = () => {
    if (model.isEmpty()) {
      setFeedback({ message: 'Cannot delete: list is empty.', type: 'warning' });
      return;
    }
    const res = model.deleteAtTail();
    if (res.success) {
      dispatchAudio(AudioEventTypes.LINKED_LIST_DELETE);
      setFeedback({ message: res.message, type: 'success' });
      syncState();
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    const val = Number(searchValue.trim());
    const res = model.search(val);

    if (res.found) {
      setActiveNodeId(res.nodeId);
      dispatchAudio(AudioEventTypes.SEARCH_FOUND, { priority: true, force: true });
      setFeedback({ message: res.message, type: 'success' });
      setTimeout(() => setActiveNodeId(null), 1500);
    } else {
      dispatchAudio(AudioEventTypes.SEARCH_NOT_FOUND);
      setFeedback({ message: res.message, type: 'warning' });
    }
  };

  const handleTraverse = async () => {
    if (isTraversing || nodes.length === 0) return;
    setIsTraversing(true);
    setFeedback({ message: 'Traversing linked list sequentially from HEAD...', type: 'info' });

    for (let i = 0; i < nodes.length; i++) {
      setActiveNodeId(nodes[i].id);
      dispatchAudio(AudioEventTypes.LINKED_LIST_TRAVERSE, { pitch: 0.8 + (i / nodes.length) * 0.5 });
      await new Promise(r => setTimeout(r, 450));
    }

    setActiveNodeId(null);
    setIsTraversing(false);
    setFeedback({ message: `Traversal complete: verified ${nodes.length} nodes.`, type: 'success' });
    dispatchAudio(AudioEventTypes.ALGO_COMPLETE, { priority: true, force: true });
  };

  const handleClear = () => {
    model.clear();
    syncState();
    setActiveNodeId(null);
    setFeedback({ message: 'Linked List has been reset.', type: 'info' });
    dispatchAudio(AudioEventTypes.UI_CLICK);
  };

  const complexity = {
    bestCase: 'O(1) Head / Tail',
    averageCase: 'O(n) Arbitrary',
    worstCase: 'O(n) Search',
    time: 'O(n)',
    space: 'O(n)'
  };

  const pseudocode = `// Linked List Pointer Invariants
function insertHead(val):
  node = new Node(val)
  node.next = head
  head = node

function insertTail(val):
  node = new Node(val)
  tail.next = node
  tail = node

function deleteHead():
  removed = head.val
  head = head.next
  return removed`;

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* List Type Variant Selector */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          POINTER TOPOLOGY
        </span>
        <div className="grid grid-cols-3 gap-1">
          {['singly', 'doubly', 'circular'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`py-2 px-1 text-xs font-mono font-bold rounded-xl transition-all capitalize ${
                listType === t
                  ? 'bg-[#EF592A] text-white shadow-2xs'
                  : 'bg-[#FAF8F3] dark:bg-[#1D1C19] text-[#24231F] dark:text-[#FFFDF8] hover:bg-[#EAE5D8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Insert & Delete Controls */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-3">
          NODE MUTATIONS
        </span>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">
              Node Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 99"
              className={`w-full p-2.5 rounded-xl border text-sm font-semibold mt-1 outline-none focus:border-[#EF592A] transition-colors ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleInsertHead}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#EF592A] text-white hover:bg-[#d64b20] transition-all"
            >
              + Insert Head
            </button>
            <button
              type="button"
              onClick={handleInsertTail}
              className="py-2.5 px-3 rounded-xl font-mono text-xs font-bold bg-[#28533D] text-white hover:bg-[#1f4230] transition-all"
            >
              + Insert Tail
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDeleteHead}
              disabled={nodes.length === 0}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD] hover:bg-[#2A2925]' : 'border-[#DED9CE] text-[#24231F] hover:bg-[#FAF8F3]'
              } disabled:opacity-40`}
            >
              - Delete Head
            </button>
            <button
              type="button"
              onClick={handleDeleteTail}
              disabled={nodes.length === 0}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                isDarkMode ? 'border-[#383630] text-[#E4E9DD] hover:bg-[#2A2925]' : 'border-[#DED9CE] text-[#24231F] hover:bg-[#FAF8F3]'
              } disabled:opacity-40`}
            >
              - Delete Tail
            </button>
          </div>

          {/* Traversal & Clear */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
            <button
              type="button"
              onClick={handleTraverse}
              disabled={isTraversing || nodes.length === 0}
              className="py-2 px-3 rounded-xl bg-[#1A1916] text-white dark:bg-[#FAF8F3] dark:text-[#24231F] font-mono text-xs font-bold transition-all disabled:opacity-40"
            >
              {isTraversing ? 'Traversing...' : '▶ Traverse'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={nodes.length === 0}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold text-red-600 dark:text-red-400 transition-all ${
                isDarkMode ? 'border-[#383630] hover:bg-[#2A2925]' : 'border-[#DED9CE] hover:bg-[#FAF8F3]'
              }`}
            >
              Clear List
            </button>
          </div>
        </div>
      </div>

      <SaveProgressButton
        algorithmId="data-structures/linked-list"
        category="data-structures"
        defaultStatus="completed"
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={complexity}
        title="Pointer Asymptotics"
      />
      <PseudocodePanel
        title="Pointer Manipulation Logic"
        code={pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Linked List Laboratory"
      subtitle="Dynamically allocated memory nodes connected by directional pointers with Singly, Doubly, and Circular invariants"
      category="Memory Structures"
      complexityBadge={`O(1) ${listType.toUpperCase()}`}
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
            title={`${listType.toUpperCase()} LINKED LIST MEMORY FABRIC`}
          >
            <div className="flex flex-col justify-between h-full p-4 space-y-6">
              {/* Header Info */}
              <div className="w-full flex items-center justify-between px-2 text-xs font-mono">
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Total Nodes: </span>
                  <strong className="text-[#EF592A] text-sm">{nodes.length}</strong>
                  <span className="mx-2 text-[#DED9CE]">|</span>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Topology: </span>
                  <strong className="text-[#28533D] dark:text-[#E4E9DD] uppercase">{listType}</strong>
                </div>
                <div>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Head: </span>
                  <strong>{metrics.headValue !== null ? metrics.headValue : 'NULL'}</strong>
                  <span className="mx-2 text-[#DED9CE]">|</span>
                  <span className="text-[#69665F] dark:text-[#A09D95]">Tail: </span>
                  <strong>{metrics.tailValue !== null ? metrics.tailValue : 'NULL'}</strong>
                </div>
              </div>

              {/* Node Chain Layout */}
              <div className="flex items-center space-x-2 overflow-x-auto py-8 px-2 my-auto">
                {nodes.length === 0 ? (
                  <div className="w-full text-center py-10 font-mono text-xs text-[#69665F] dark:text-[#A09D95]">
                    [ Empty List: HEAD points to NULL ]
                  </div>
                ) : (
                  nodes.map((node, idx) => {
                    const isActive = activeNodeId === node.id;

                    return (
                      <div key={node.id} className="flex items-center space-x-2 shrink-0">
                        {/* Node Card */}
                        <div
                          className={`relative p-3.5 rounded-2xl border flex flex-col items-center justify-between min-w-[90px] shadow-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-[#EF592A] text-white ring-4 ring-[#EF592A]/30 scale-105'
                              : node.isHead
                              ? 'bg-[#28533D] text-white border-[#28533D]'
                              : node.isTail
                              ? 'bg-[#8E5016] text-white border-[#8E5016]'
                              : 'bg-[#FFFDF8] dark:bg-[#24231F] border-[#DED9CE] dark:border-[#383630]'
                          }`}
                        >
                          {/* Badges */}
                          {node.isHead && (
                            <span className="absolute -top-3 left-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#28533D] text-white uppercase shadow-xs">
                              HEAD
                            </span>
                          )}
                          {node.isTail && (
                            <span className="absolute -top-3 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#8E5016] text-white uppercase shadow-xs">
                              TAIL
                            </span>
                          )}

                          <span className="text-xl font-black font-mono my-1">
                            {node.data}
                          </span>

                          <div className="text-[9px] font-mono opacity-70 border-t border-white/20 w-full text-center pt-1 mt-1">
                            Slot [{idx}]
                          </div>
                        </div>

                        {/* Pointer Connectors */}
                        {idx < nodes.length - 1 ? (
                          <div className="flex flex-col items-center justify-center font-mono text-sm px-1 text-[#24231F] dark:text-[#FFFDF8]">
                            <span>→</span>
                            {listType === 'doubly' && <span className="text-xs text-[#EF592A]">←</span>}
                          </div>
                        ) : listType === 'circular' ? (
                          <div className="flex items-center space-x-1 font-mono text-xs px-2 text-[#EF592A] font-bold">
                            <span>⟲ loops to HEAD</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 font-mono text-xs px-2 text-[#A09D95]">
                            <span>→</span>
                            <span className="text-[10px] font-bold bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] px-1.5 py-0.5 rounded">NULL</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Specs */}
              <div className="w-full flex items-center justify-between text-xs font-mono border-t border-[#DED9CE] dark:border-[#383630] pt-2 text-[#69665F] dark:text-[#A09D95]">
                <span>Insertion: <strong>O(1) Head/Tail</strong> | Search: <strong>O(n)</strong> | Deletion: <strong>O(1) with pointer</strong></span>
                <span>Active Variant: <strong className="text-[#28533D] dark:text-[#E4E9DD] uppercase">{listType}</strong></span>
              </div>
            </div>
          </VisualizerCanvas>
        </div>
      </div>
    </VisualizerLayout>
  );
}
