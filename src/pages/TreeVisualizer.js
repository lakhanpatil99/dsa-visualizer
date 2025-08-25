import React, { useState, useEffect, useContext } from 'react';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import { DarkModeContext } from '../App';
import { BinarySearchTree, bstPseudocode, bstComplexity } from '../algorithms/trees/bst';
import { 
  inorderTraversal, 
  preorderTraversal, 
  postorderTraversal,
  treeTraversalPseudocode,
  traversalComplexity
} from '../algorithms/trees/traversals';

const TreeVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [bst, setBst] = useState(new BinarySearchTree());
  const [inputValue, setInputValue] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);
  const [selectedTraversal, setSelectedTraversal] = useState('inorder');
  const [pseudocode, setPseudocode] = useState(bstPseudocode);
  const [complexity, setComplexity] = useState(bstComplexity);
  const [showTraversal, setShowTraversal] = useState(false);
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentTraversalNode, setCurrentTraversalNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [insertingNode, setInsertingNode] = useState(null);

  useEffect(() => {
    if (showTraversal) {
      setPseudocode(treeTraversalPseudocode);
      setComplexity(traversalComplexity);
    } else {
      setPseudocode(bstPseudocode);
      setComplexity(bstComplexity);
    }
  }, [showTraversal]);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    // Animate insertion
    setInsertingNode(value);
    
    setTimeout(() => {
      // Create a new BST instance with the inserted value
      const newBst = new BinarySearchTree();
      
      // Copy existing nodes
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
      
      // Insert the new value
      newBst.insert(value);
      
      setInputValue('');
      setInsertingNode(null);
      setBst(newBst);
    }, 500);
  };

  const handleRemove = () => {
    if (!inputValue.trim()) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    // Create a new BST instance without the removed value
    const newBst = new BinarySearchTree();
    
    // Copy existing nodes except the one to remove
    if (bst.root) {
      const copyTree = (node) => {
        if (node && node.data !== value) {
          newBst.insert(node.data);
          copyTree(node.left);
          copyTree(node.right);
        }
      };
      copyTree(bst.root);
    }
    
    setInputValue('');
    setBst(newBst);
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    
    const found = bst.search(value);
    alert(found ? `Value ${value} found in the tree!` : `Value ${value} not found in the tree.`);
  };

  const animateTraversal = async (traversalFunction, root) => {
    if (!root) return [];
    
    setIsTraversing(true);
    setVisitedNodes(new Set());
    setCurrentTraversalNode(null);
    setTraversalResult([]);
    
    const result = [];
    const visited = new Set();
    
    // Create a copy of the tree for traversal
    const traverse = async (node) => {
      if (!node) return;
      
      // Highlight current node
      setCurrentTraversalNode(node.data);
      visited.add(node.data);
      setVisitedNodes(new Set(visited));
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add to result based on traversal type
      if (selectedTraversal === 'preorder') {
        result.push(node.data);
      }
      
      // Traverse left subtree
      if (node.left) {
        await traverse(node.left);
      }
      
      // Add to result for inorder
      if (selectedTraversal === 'inorder') {
        result.push(node.data);
      }
      
      // Traverse right subtree
      if (node.right) {
        await traverse(node.right);
      }
      
      // Add to result for postorder
      if (selectedTraversal === 'postorder') {
        result.push(node.data);
      }
    };
    
    await traverse(root);
    
    // Update result and stop traversal
    setTraversalResult(result);
    setCurrentTraversalNode(null);
    setIsTraversing(false);
    setShowTraversal(true);
  };

  const handleTraversal = () => {
    if (isTraversing) return;
    
    switch (selectedTraversal) {
      case 'inorder':
        animateTraversal(inorderTraversal, bst.root);
        break;
      case 'preorder':
        animateTraversal(preorderTraversal, bst.root);
        break;
      case 'postorder':
        animateTraversal(postorderTraversal, bst.root);
        break;
      case 'levelorder':
        // Level order needs special handling
        handleLevelOrderTraversal();
        break;
      default:
        break;
    }
  };

  const handleLevelOrderTraversal = async () => {
    if (!bst.root) return;
    
    setIsTraversing(true);
    setVisitedNodes(new Set());
    setCurrentTraversalNode(null);
    setTraversalResult([]);
    
    const result = [];
    const visited = new Set();
    const queue = [bst.root];
    
    while (queue.length > 0) {
      const levelSize = queue.length;
      const levelResult = [];
      
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        
        // Highlight current node
        setCurrentTraversalNode(node.data);
        visited.add(node.data);
        setVisitedNodes(new Set(visited));
        
        // Add to level result
        levelResult.push(node.data);
        
        // Add children to queue
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      result.push(...levelResult);
    }
    
    setTraversalResult(result);
    setCurrentTraversalNode(null);
    setIsTraversing(false);
    setShowTraversal(true);
  };

  const handleClear = () => {
    const newBst = new BinarySearchTree();
    setBst(newBst);
    setTraversalResult([]);
    setShowTraversal(false);
    setVisitedNodes(new Set());
    setCurrentTraversalNode(null);
    setInsertingNode(null);
  };

  const calculateNodePosition = (node, level, position, totalWidth) => {
    if (!node) return { x: 0, y: 0 };
    
    const levelHeight = 80;
    const y = 50 + level * levelHeight;
    
    // Calculate x position based on inorder position
    const inorderArray = bst.inorder();
    const nodeIndex = inorderArray.indexOf(node.data);
    const levelWidth = totalWidth / Math.max(1, inorderArray.length);
    const x = 50 + nodeIndex * levelWidth + levelWidth / 2;
    
    return { x, y };
  };

  const renderNode = (node, level, position, totalWidth, parentPos = null) => {
    if (!node) return null;
    
    const { x, y } = calculateNodePosition(node, level, position, totalWidth);
    
    // Determine node styling based on state
    let nodeFill = isDarkMode ? "#3B82F6" : "#2563EB"; // Default blue
    let nodeStroke = isDarkMode ? "#1E40AF" : "#1D4ED8";
    
    if (currentTraversalNode === node.data) {
      nodeFill = "#EF4444"; // Red for current traversal node
      nodeStroke = "#DC2626";
    } else if (visitedNodes.has(node.data)) {
      nodeFill = "#10B981"; // Green for visited nodes
      nodeStroke = "#059669";
    } else if (insertingNode === node.data) {
      nodeFill = "#F59E0B"; // Orange for inserting node
      nodeStroke = "#D97706";
    }
    
    return (
      <g key={`${node.data}-${x}-${y}`}>
        {/* Draw connection to parent */}
        {parentPos && (
          <line
            x1={parentPos.x}
            y1={parentPos.y}
            x2={x}
            y2={y}
            stroke={isDarkMode ? "#6B7280" : "#9CA3AF"}
            strokeWidth="2"
            className="transition-all duration-300"
          />
        )}
        
        {/* Draw node with animation */}
        <circle
          cx={x}
          cy={y}
          r="20"
          fill={nodeFill}
          stroke={nodeStroke}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        
        {/* Draw node value */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          className="transition-all duration-300"
        >
          {node.data}
        </text>
        
        {/* Draw left child */}
        {node.left && (
          <g>
            {renderNode(
              node.left,
              level + 1,
              position * 2,
              totalWidth,
              { x, y }
            )}
          </g>
        )}
        
        {/* Draw right child */}
        {node.right && (
          <g>
            {renderNode(
              node.right,
              level + 1,
              position * 2 + 1,
              totalWidth,
              { x, y }
            )}
          </g>
        )}
      </g>
    );
  };

  const renderTree = () => {
    if (!bst.root) {
      return (
        <div className={`flex items-center justify-center h-full ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-2">🌳</div>
            <div>Tree is empty. Add some nodes to get started!</div>
          </div>
        </div>
      );
    }
    
    const totalWidth = 700;
    return (
      <svg width="800" height="400" className="w-full h-full">
        {renderNode(bst.root, 0, 0, totalWidth)}
      </svg>
    );
  };

  // Left Sidebar Content
  const renderLeftSidebar = () => (
    <div className="space-y-6">
      {/* Tree Controls */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Tree Controls
        </h3>
        <div className="space-y-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a number"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              disabled={isTraversing}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Insert
            </button>
            <button
              onClick={handleRemove}
              disabled={isTraversing}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSearch}
              disabled={isTraversing}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              disabled={isTraversing}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Tree Info */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Binary Search Tree
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          A hierarchical data structure where each node has at most two children, with values organized for efficient searching.
        </p>
      </div>

      {/* Tree Statistics */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Tree Statistics
        </h3>
        <div className={`space-y-2 text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex justify-between">
            <span>Height:</span>
            <span className="font-mono">{bst.getHeight()}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span className="font-mono">{bst.inorder().length}</span>
          </div>
          <div className="flex justify-between">
            <span>Root:</span>
            <span className="font-mono">{bst.root ? bst.root.data : 'None'}</span>
          </div>
        </div>
      </div>

      {/* Traversal Selection */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Traversal Type
        </h3>
        <select
          value={selectedTraversal}
          onChange={(e) => setSelectedTraversal(e.target.value)}
          disabled={isTraversing}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="inorder">Inorder</option>
          <option value="preorder">Preorder</option>
          <option value="postorder">Postorder</option>
          <option value="levelorder">Level Order</option>
        </select>
      </div>
    </div>
  );

  // Right Sidebar Content
  const renderRightSidebar = () => (
    <div className="space-y-6">
      {/* Complexity Box */}
      <ComplexityBox
        timeComplexity={complexity.insert || complexity.inorder || 'O(h)'}
        spaceComplexity={complexity.space}
        bestCase={complexity.bestCase}
        averageCase={complexity.averageCase}
        worstCase={complexity.worstCase}
      />

      {/* Pseudocode Panel */}
      <PseudocodePanel
        title={showTraversal ? "Tree Traversal Algorithms" : "Binary Search Tree Implementation"}
        code={pseudocode}
      />

      {/* Traversal Result */}
      {showTraversal && traversalResult.length > 0 && (
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {selectedTraversal.charAt(0).toUpperCase() + selectedTraversal.slice(1)} Traversal Result
          </h3>
          <div className="flex flex-wrap gap-2">
            {traversalResult.map((value, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-green-500 text-white rounded-md flex items-center justify-center font-bold text-lg transition-all duration-300"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Bottom Controls
  const renderBottomControls = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleTraversal}
          disabled={isTraversing || !bst.root}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isTraversing ? 'Traversing...' : 'Run Traversal'}
        </button>
        
        <div className={`flex items-center space-x-4 text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Normal Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Current Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Visited Node</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>Inserting Node</span>
          </div>
        </div>
      </div>
      
      <div className={`text-sm ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <strong>Status:</strong> {isTraversing ? 'Traversing...' : 'Ready'}
      </div>
    </div>
  );

  return (
    <VisualizerLayout
      title="Tree Algorithms - AlgoMania"
      subtitle="Visualize binary search trees and tree traversal algorithms"
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
      bottomControls={renderBottomControls()}
    >
      {/* Center Visualization Area */}
      <div className="h-full flex flex-col">
        {/* Tree Visualization */}
        <div className="flex-1 mb-6">
          <VisualizerCanvas 
            width="100%" 
            height="100%"
            title="Binary Search Tree Visualization"
          >
            {renderTree()}
          </VisualizerCanvas>
        </div>

        {/* Tree Status */}
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
                <strong>Tree Height:</strong> {bst.getHeight()}
              </span>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Node Count:</strong> {bst.inorder().length}
              </span>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <strong>Current Traversal:</strong> {selectedTraversal.charAt(0).toUpperCase() + selectedTraversal.slice(1)}
              </span>
            </div>
            <div className={`flex items-center space-x-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isTraversing 
                  ? 'bg-blue-500 animate-pulse' 
                  : 'bg-green-500'
              }`}></div>
              <span className="text-sm">
                {isTraversing ? 'Traversing...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default TreeVisualizer;
