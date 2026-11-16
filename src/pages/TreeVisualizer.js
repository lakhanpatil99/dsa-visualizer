import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import SaveProgressButton from '../components/SaveProgressButton';
import { DarkModeContext } from '../../context/ThemeContext';
import { BinarySearchTree, bstPseudocode, bstComplexity } from '../algorithms/trees/bst';
import {
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  treeTraversalPseudocode,
  traversalComplexity
} from '../algorithms/trees/traversals';

const INITIAL_TREE_VALUES = [50, 25, 75, 15, 35, 60, 85];

const TreeVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [bst, setBst] = useState(() => {
    const tree = new BinarySearchTree();
    INITIAL_TREE_VALUES.forEach(v => tree.insert(v));
    return tree;
  });
  const [inputValue, setInputValue] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');
  const [showTraversal, setShowTraversal] = useState(false);
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentTraversalNode, setCurrentTraversalNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [insertingNode, setInsertingNode] = useState(null);

  const pseudocode = showTraversal ? treeTraversalPseudocode : bstPseudocode;
  const complexity = showTraversal ? traversalComplexity : bstComplexity;

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return;

    setInsertingNode(value);
    setTimeout(() => {
      const newBst = new BinarySearchTree();
      if (bst.root) {
        const copyTree = (node) => {
          if (node) {
            newBst.insert(node.data);
            copyTree(node.left);
            copyTree(node.right);
          }
        };
        copyTree(bst.root);
      }
      newBst.insert(value);
      setBst(newBst);
      setInsertingNode(null);
      setInputValue('');
    }, 400);
  };

  const handleClear = () => {
    setBst(new BinarySearchTree());
    setTraversalResult([]);
    setVisitedNodes(new Set());
    setCurrentTraversalNode(null);
  };

  const handleResetDefault = () => {
    const tree = new BinarySearchTree();
    INITIAL_TREE_VALUES.forEach(v => tree.insert(v));
    setBst(tree);
    setTraversalResult([]);
    setVisitedNodes(new Set());
    setCurrentTraversalNode(null);
  };

  const handleTraversal = async () => {
    if (isTraversing || !bst.root) return;

    setIsTraversing(true);
    setShowTraversal(true);
    setVisitedNodes(new Set());
    setCurrentTraversalNode(null);
    setTraversalResult([]);

    let order = [];
    switch (selectedTraversal) {
      case 'inorder':
        order = bst.inorder();
        break;
      case 'preorder':
        order = bst.preorder();
        break;
      case 'postorder':
        order = bst.postorder();
        break;
      case 'levelorder':
        order = bst.levelOrder();
        break;
      default:
        order = bst.inorder();
    }

    const currentVisited = new Set();
    const resultAcc = [];

    for (let i = 0; i < order.length; i++) {
      const val = order[i];
      setCurrentTraversalNode(val);
      await new Promise(r => setTimeout(r, 450));
      currentVisited.add(val);
      setVisitedNodes(new Set(currentVisited));
      resultAcc.push(val);
      setTraversalResult([...resultAcc]);
      await new Promise(r => setTimeout(r, 200));
    }

    setCurrentTraversalNode(null);
    setIsTraversing(false);
  };

  const calculateNodePosition = (node, level, position, totalWidth) => {
    const y = 50 + level * 70;
    const levelWidth = totalWidth / Math.pow(2, level);
    const x = levelWidth * position + levelWidth / 2;
    return { x, y };
  };

  const renderNode = (node, level = 0, position = 0, totalWidth = 800, parentPos = null) => {
    if (!node) return null;
    const { x, y } = calculateNodePosition(node, level, position, totalWidth);

    const isCurrent = currentTraversalNode === node.data;
    const isVisited = visitedNodes.has(node.data);
    const isInserting = insertingNode === node.data;

    let nodeFill = isDarkMode ? '#24231F' : '#FFFDF8';
    let nodeStroke = isDarkMode ? '#5E5B54' : '#24231F';
    let textFill = isDarkMode ? '#FFFDF8' : '#24231F';

    if (isCurrent) {
      nodeFill = '#EF592A';
      nodeStroke = '#EF592A';
      textFill = '#FFFDF8';
    } else if (isVisited) {
      nodeFill = '#28533D';
      nodeStroke = '#28533D';
      textFill = '#FFFDF8';
    } else if (isInserting) {
      nodeFill = '#D97706';
      nodeStroke = '#D97706';
      textFill = '#FFFDF8';
    }

    return (
      <g key={`${node.data}-${x}-${y}`}>
        {parentPos && (
          <line
            x1={parentPos.x}
            y1={parentPos.y}
            x2={x}
            y2={y}
            stroke={isDarkMode ? '#4B4842' : '#DED9CE'}
            strokeWidth="2"
          />
        )}
        <circle
          cx={x}
          cy={y}
          r="19"
          fill={nodeFill}
          stroke={nodeStroke}
          strokeWidth="2.5"
          className="transition-all duration-300"
        />
        <text
          x={x}
          y={y + 4.5}
          textAnchor="middle"
          fill={textFill}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {node.data}
        </text>
        {node.left && renderNode(node.left, level + 1, position * 2, totalWidth, { x, y })}
        {node.right && renderNode(node.right, level + 1, position * 2 + 1, totalWidth, { x, y })}
      </g>
    );
  };

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Insert & Tree Controls */}
      <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-2">
          TREE OPERATIONS
        </span>
        <div className="space-y-2.5">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter node number"
            className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630] outline-none focus:border-[#EF592A]"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={isTraversing || !inputValue.trim()}
              className="py-2 rounded-xl font-mono text-xs font-bold bg-[#28533D] hover:bg-[#1E3E2E] text-[#FFFDF8] disabled:opacity-40"
            >
              + Insert Node
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              disabled={isTraversing}
              className="py-2 rounded-xl font-mono text-xs font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
            >
              Reset Default
            </button>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={isTraversing}
            className="w-full py-1.5 rounded-xl font-mono text-[11px] text-[#A09D95] hover:text-[#EF592A] transition-colors"
          >
            Clear Entire Tree
          </button>
        </div>
      </div>

      {/* Traversal Selector */}
      <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          TRAVERSAL ROUTINE
        </span>
        <select
          value={selectedTraversal}
          onChange={(e) => setSelectedTraversal(e.target.value)}
          disabled={isTraversing}
          aria-label="Select traversal routine"
          className="w-full p-2.5 rounded-xl border text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630] outline-none"
        >
          <option value="inorder">Inorder (Left, Root, Right)</option>
          <option value="preorder">Preorder (Root, Left, Right)</option>
          <option value="postorder">Postorder (Left, Right, Root)</option>
          <option value="levelorder">Level Order (BFS)</option>
        </select>
        <button
          type="button"
          onClick={handleTraversal}
          disabled={isTraversing || !bst.root}
          className="w-full mt-3 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] hover:bg-[#D9481B] text-[#FFFDF8] shadow-xs disabled:opacity-40"
        >
          {isTraversing ? 'Traversing Tree...' : 'Execute Traversal'}
        </button>
      </div>

      <SaveProgressButton
        algorithmType="trees"
        algorithmName={`BST ${selectedTraversal}`}
        currentState={{ values: bst.inorder() }}
        stepsCompleted={traversalResult.length}
        totalSteps={bst.inorder().length || 7}
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={complexity}
        title="Tree & Traversal Specs"
      />
      <PseudocodePanel
        title="Traversal Logic"
        code={pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title="Binary Search Tree & Traversals"
      subtitle="Interactive hierarchical binary tree operations with step-by-step depth and breadth traversals"
      category="Tree Structures"
      complexityBadge="O(h) = O(log n)"
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
    >
      <div className="h-full flex flex-col space-y-4">
        <div className="flex-1">
          <VisualizerCanvas
            width={900}
            height={400}
            title="Binary Search Tree Canvas"
          >
            {bst.root ? (
              <svg width="100%" height="380" viewBox="0 0 800 380" className="w-full h-full">
                {renderNode(bst.root, 0, 0, 800)}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8 text-xs font-mono text-[#69665F]">
                Tree is currently empty. Click "Reset Default" or "+ Insert Node" to begin.
              </div>
            )}
          </VisualizerCanvas>
        </div>

        {/* Traversal Result Tape */}
        {traversalResult.length > 0 && (
          <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
            }`}>
            <span className="block text-[10px] font-mono tracking-widest text-[#28533D] dark:text-[#E4E9DD] uppercase font-bold mb-2">
              {selectedTraversal.toUpperCase()} TRAVERSAL ORDER
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {traversalResult.map((val, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] font-bold"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerLayout>
  );
};

export default TreeVisualizer;
