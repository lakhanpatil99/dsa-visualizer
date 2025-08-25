import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import SaveProgressButton from '../components/SaveProgressButton';
import { DarkModeContext } from '../App';
import { Graph as BFSGraph, bfsPseudocode, bfsComplexity } from '../algorithms/graphs/bfs';
import { Graph as DFSGraph, dfsPseudocode, dfsComplexity } from '../algorithms/graphs/dfs';
import { WeightedGraph, dijkstraPseudocode, dijkstraComplexity } from '../algorithms/graphs/dijkstra';

const GraphVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState([]);
  const [pseudocode, setPseudocode] = useState(bfsPseudocode);
  const [complexity, setComplexity] = useState(bfsComplexity);
  const [showWeighted, setShowWeighted] = useState(false);
  
  // Interactive canvas states
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [edgeStart, setEdgeStart] = useState(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [currentTraversalNode, setCurrentTraversalNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [shortestPath, setShortestPath] = useState([]);
  const [pathCost, setPathCost] = useState(0);
  
  // Progress tracking - these will be used when implementing step-by-step visualization
  // const [currentStep, setCurrentStep] = useState(0);
  // const [totalSteps, setTotalSteps] = useState(0);
  // const [isCompleted, setIsCompleted] = useState(false);
  
  const canvasRef = useRef(null);
  const canvasContextRef = useRef(null);

  useEffect(() => {
    switch (selectedAlgorithm) {
      case 'bfs':
        setPseudocode(bfsPseudocode);
        setComplexity(bfsComplexity);
        setShowWeighted(false);
        break;
      case 'dfs':
        setPseudocode(dfsPseudocode);
        setComplexity(dfsComplexity);
        setShowWeighted(false);
        break;
      case 'dijkstra':
        setPseudocode(dijkstraPseudocode);
        setComplexity(dijkstraComplexity);
        setShowWeighted(true);
        break;
      default:
        break;
    }
    setResult([]);
    setTraversalOrder([]);
    setShortestPath([]);
    setPathCost(0);
  }, [selectedAlgorithm]);

  const drawCanvas = useCallback(() => {
    console.log('drawCanvas called');
    if (!canvasContextRef.current) {
      console.log('No canvas context available');
      return;
    }
    
    const ctx = canvasContextRef.current;
    const canvas = canvasRef.current;
    
    if (!canvas) {
      console.log('No canvas element available');
      return;
    }
    
    console.log('Drawing canvas with dimensions:', canvas.width, 'x', canvas.height);
    console.log('Current nodes:', nodes);
    console.log('Current edges:', edges);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = isDarkMode ? '#1f2937' : '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.strokeStyle = isDarkMode ? '#4b5563' : '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges first (so they appear behind nodes)
    edges.forEach((edge, index) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return;
      
      ctx.strokeStyle = isDarkMode ? '#6b7280' : '#9ca3af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
      
      // Draw edge weight if weighted
      if (showWeighted) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        ctx.fillStyle = isDarkMode ? '#1f2937' : '#ffffff';
        ctx.fillRect(midX - 15, midY - 10, 30, 20);
        ctx.strokeRect(midX - 15, midY - 10, 30, 20);
        
        ctx.fillStyle = isDarkMode ? '#6b7280' : '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    });
    
    // Draw nodes
    nodes.forEach((node) => {
      console.log('Drawing node:', node);
      
      // Determine node color
      let fillColor = isDarkMode ? '#3b82f6' : '#2563eb';
      if (currentTraversalNode === node.id) {
        fillColor = '#ef4444'; // Red for current
      } else if (visitedNodes.has(node.id)) {
        fillColor = '#10b981'; // Green for visited
      } else if (shortestPath.includes(node.id)) {
        fillColor = '#f59e0b'; // Orange for shortest path
      }
      
      // Draw node circle
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = isDarkMode ? '#1e40af' : '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      
      // Draw remove button
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(node.x + 20, node.y - 20, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('×', node.x + 20, node.y - 20);
    });
    
    console.log('Canvas drawing completed');
  }, [nodes, edges, isDarkMode, currentTraversalNode, visitedNodes, shortestPath, showWeighted]);

  // Initialize canvas
  useEffect(() => {
    console.log('Canvas initialization effect running');
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      console.log('Canvas element found:', canvas);
      
      const context = canvas.getContext('2d');
      canvasContextRef.current = context;
      console.log('Canvas context created:', context);
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 400;
      console.log('Canvas size set to:', canvas.width, 'x', canvas.height);
      
      // Draw initial canvas
      drawCanvas();
    } else {
      console.log('Canvas ref not available');
    }
  }, [drawCanvas]);

  // Effect to redraw canvas when nodes/edges change
  useEffect(() => {
    console.log('Nodes/edges changed, redrawing canvas. Nodes:', nodes.length, 'Edges:', edges.length);
    if (canvasRef.current && canvasContextRef.current) {
      drawCanvas();
    }
  }, [nodes, edges, drawCanvas]);

  const handleCanvasClick = (event) => {
    console.log('Canvas clicked! Event:', event);
    if (!canvasRef.current) {
      console.log('Canvas ref not available in click handler');
      return;
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    console.log('Canvas clicked at:', { 
      x, 
      y, 
      isAddingNode, 
      isAddingEdge,
      rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      clientX: event.clientX,
      clientY: event.clientY
    });
    
    if (isAddingNode) {
      console.log('Adding node mode is active, creating new node');
      
      // Add new node at click position
      const newNodeId = `N${nodes.length + 1}`;
      const newNode = {
        id: newNodeId,
        x: x,
        y: y,
        label: newNodeId
      };
      
      console.log('New node created:', newNode);
      console.log('Previous nodes:', nodes);
      
      setNodes(prev => {
        const newNodes = [...prev, newNode];
        console.log('Updated nodes array:', newNodes);
        return newNodes;
      });
      
      setIsAddingNode(false);
      console.log('Add node mode deactivated');
    } else if (isAddingEdge && edgeStart) {
      console.log('Adding edge mode active with edgeStart:', edgeStart);
      
      // Find closest node to click position
      const closestNode = findClosestNode(x, y);
      if (closestNode && closestNode.id !== edgeStart.id) {
        const newEdge = {
          from: edgeStart.id,
          to: closestNode.id,
          weight: showWeighted ? (parseInt(weight) || 1) : 1
        };
        console.log('New edge created:', newEdge);
        setEdges(prev => [...prev, newEdge]);
        setWeight('');
      }
      setIsAddingEdge(false);
      setEdgeStart(null);
    } else if (isAddingEdge) {
      console.log('First click for edge - looking for start node');
      
      // First click for edge - find start node
      const clickedNode = findClosestNode(x, y);
      if (clickedNode) {
        console.log('Start node found for edge:', clickedNode);
        setEdgeStart(clickedNode);
      } else {
        console.log('No node found at click position for edge start');
      }
    } else {
      console.log('No mode active, click ignored');
    }
  };

  const findClosestNode = (x, y) => {
    let closest = null;
    let minDistance = Infinity;
    
    nodes.forEach(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      if (distance < minDistance && distance < 30) { // 30px threshold
        minDistance = distance;
        closest = node;
      }
    });
    
    return closest;
  };

  const handleAddNodeMode = () => {
    console.log('Add Node Mode activated');
    setIsAddingNode(true);
    setIsAddingEdge(false);
    setEdgeStart(null);
  };

  const handleAddEdgeMode = () => {
    console.log('Add Edge Mode activated');
    setIsAddingEdge(true);
    setIsAddingNode(false);
    setEdgeStart(null);
  };

  const animateTraversal = async (startNodeId) => {
    if (!startNodeId) return;
    
    setIsTraversing(true);
    setTraversalOrder([]);
    setCurrentTraversalNode(null);
    setVisitedNodes(new Set());
    
    let result;
    // Use the current graph instance based on selected algorithm
    if (selectedAlgorithm === 'bfs') {
      const currentGraph = new BFSGraph();
      nodes.forEach(node => currentGraph.addVertex(node.id));
      edges.forEach(edge => currentGraph.addEdge(edge.from, edge.to));
      result = currentGraph.breadthFirstSearch(startNodeId);
    } else if (selectedAlgorithm === 'dfs') {
      const currentGraph = new DFSGraph();
      nodes.forEach(node => currentGraph.addVertex(node.id));
      edges.forEach(edge => currentGraph.addEdge(edge.from, edge.to));
      result = currentGraph.depthFirstSearch(startNodeId);
    }
    
    if (!result || result.length === 0) {
      setIsTraversing(false);
      return;
    }
    
    const visited = new Set();
    const order = [];
    
    for (let i = 0; i < result.length; i++) {
      const nodeId = result[i];
      
      // Highlight current node
      setCurrentTraversalNode(nodeId);
      visited.add(nodeId);
      setVisitedNodes(new Set(visited));
      order.push(nodeId);
      setTraversalOrder([...order]);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setCurrentTraversalNode(null);
    setIsTraversing(false);
    setResult(result);
  };

  const animateDijkstra = async (startNodeId, endNodeId) => {
    if (!startNodeId || !endNodeId) return;
    
    setIsTraversing(true);
    setShortestPath([]);
    setPathCost(0);
    setCurrentTraversalNode(null);
    setVisitedNodes(new Set());
    
    // Create current weighted graph from nodes and edges
    const currentWeightedGraph = new WeightedGraph();
    nodes.forEach(node => currentWeightedGraph.addVertex(node.id));
    edges.forEach(edge => currentWeightedGraph.addEdge(edge.from, edge.to, edge.weight));
    
    const result = currentWeightedGraph.dijkstra(startNodeId, endNodeId);
    
    if (result.path && result.path.length > 0) {
      const visited = new Set();
      
      // Animate through the path step by step
      for (let i = 0; i < result.path.length; i++) {
        const nodeId = result.path[i];
        
        setCurrentTraversalNode(nodeId);
        visited.add(nodeId);
        setVisitedNodes(new Set(visited));
        
        // Update path as we go
        setShortestPath(result.path.slice(0, i + 1));
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      setPathCost(result.distance);
    }
    
    setCurrentTraversalNode(null);
    setIsTraversing(false);
    setResult([{
      start: startNodeId,
      end: endNodeId,
      path: result.path || [],
      distance: result.distance || Infinity
    }]);
  };

  const handleRunAlgorithm = () => {
    if (!startNode.trim()) return;
    
    if (selectedAlgorithm === 'dijkstra') {
      if (endNode.trim()) {
        animateDijkstra(startNode, endNode);
      } else {
        // Show all shortest paths using current graph state
        const currentWeightedGraph = new WeightedGraph();
        nodes.forEach(node => currentWeightedGraph.addVertex(node.id));
        edges.forEach(edge => currentWeightedGraph.addEdge(edge.from, edge.to, edge.weight));
        
        const allPaths = currentWeightedGraph.getAllShortestPaths(startNode);
        setResult(Object.keys(allPaths.distances).map(node => ({
          node,
          distance: allPaths.distances[node],
          path: allPaths.previous[node]
        })));
      }
    } else {
      animateTraversal(startNode);
    }
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setResult([]);
    setTraversalOrder([]);
    setShortestPath([]);
    setPathCost(0);
    setStartNode('');
    setEndNode('');
    setWeight('');
    setIsAddingNode(false);
    setIsAddingEdge(false);
    setEdgeStart(null);
  };

  const renderGraph = () => {
    return (
      <div className="relative w-full h-full">
        {isAddingNode && (
          <div className="absolute top-4 left-4 z-10 p-3 bg-green-100 text-green-800 rounded-lg border border-green-300 shadow-lg">
            ✨ <strong>Add Node Mode Active!</strong> Click on canvas to add nodes.
          </div>
        )}
        {isAddingEdge && (
          <div className="absolute top-4 left-4 z-10 p-3 bg-blue-100 text-blue-800 rounded-lg border border-blue-300 shadow-lg">
            🔗 <strong>Add Edge Mode Active!</strong> Click source node, then target node.
          </div>
        )}
        
        <canvas 
          ref={canvasRef}
          width="800"
          height="400"
          className="w-full h-full cursor-pointer border border-gray-300 rounded-lg"
          onClick={handleCanvasClick}
          style={{ minHeight: '400px' }}
        />
        
        {/* Show empty state message when no nodes */}
        {nodes.length === 0 && (
          <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-2">🕸️</div>
              <div>Graph is empty. Click "Add Node Mode" and click on canvas to add nodes!</div>
            </div>
          </div>
        )}
        
        {/* Test canvas to verify rendering */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p>Canvas Ref: {canvasRef.current ? 'Available' : 'Not Available'}</p>
          <p>Canvas Context: {canvasContextRef.current ? 'Available' : 'Not Available'}</p>
          <p>Nodes Count: {nodes.length}</p>
          <p>Edges Count: {edges.length}</p>
          <p>Add Node Mode: {isAddingNode ? 'Active' : 'Inactive'}</p>
          <p>Add Edge Mode: {isAddingEdge ? 'Active' : 'Inactive'}</p>
          <p>Current Nodes: {JSON.stringify(nodes)}</p>
        </div>
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
          Select Algorithm
        </h3>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          disabled={isTraversing}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 ${
            isDarkMode 
              ? 'bg-gray-600 border-gray-500 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
          <option value="dijkstra">Dijkstra's Shortest Path</option>
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
          {selectedAlgorithm === 'bfs' && 'Breadth-First Search'}
          {selectedAlgorithm === 'dfs' && 'Depth-First Search'}
          {selectedAlgorithm === 'dijkstra' && 'Dijkstra\'s Algorithm'}
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {selectedAlgorithm === 'bfs' && 'Explores all nodes at the current depth before moving to the next level'}
          {selectedAlgorithm === 'dfs' && 'Explores as far as possible along each branch before backtracking'}
          {selectedAlgorithm === 'dijkstra' && 'Finds the shortest path between nodes in a weighted graph'}
        </p>
      </div>

      {/* Interactive Mode Controls */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>Interactive Mode</h3>
        <div className="space-y-3">
          <button
            onClick={handleAddNodeMode}
            disabled={isTraversing}
            className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAddingNode 
                ? 'bg-green-600 ring-2 ring-green-300' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isAddingNode ? 'Click Canvas' : 'Add Node Mode'}
          </button>
          <button
            onClick={handleAddEdgeMode}
            disabled={isTraversing}
            className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAddingEdge 
                ? 'bg-blue-600 ring-2 ring-blue-300' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isAddingEdge ? 'Select Start Node' : 'Add Edge Mode'}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleClear}
              disabled={isTraversing}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Clear Graph
            </button>
            <button
              onClick={() => {
                setIsAddingNode(false);
                setIsAddingEdge(false);
                setEdgeStart(null);
              }}
              disabled={isTraversing}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Exit Mode
            </button>
          </div>
        </div>
        
        <div className={`mt-3 text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p><strong>Add Node:</strong> Click "Add Node Mode" then click anywhere on canvas</p>
          <p><strong>Add Edge:</strong> Click "Add Edge Mode" then click start node, then target node</p>
          <p><strong>Remove:</strong> Click the red × button on any node to remove it</p>
        </div>
      </div>

      {/* Graph Statistics */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>Graph Statistics</h3>
        <div className={`space-y-2 text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex justify-between">
            <span>Nodes:</span>
            <span className="font-mono">{nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Edges:</span>
            <span className="font-mono">{edges.length}</span>
          </div>
          {nodes.length > 0 && (
            <div className="flex justify-between">
              <span>Density:</span>
              <span className="font-mono">{((edges.length / (nodes.length * (nodes.length - 1))) * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Right Sidebar Content
  const renderRightSidebar = () => (
    <div className="space-y-6">
      {/* Complexity Box */}
      <ComplexityBox
        timeComplexity={complexity.time}
        spaceComplexity={complexity.space}
        bestCase={complexity.bestCase}
        averageCase={complexity.averageCase}
        worstCase={complexity.worstCase}
      />

      {/* Pseudocode Panel */}
      <PseudocodePanel
        title={`${selectedAlgorithm.toUpperCase()} Algorithm Implementation`}
        code={pseudocode}
      />

      {/* Color Legend */}
      <div className={`rounded-lg p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-700 border border-gray-600' 
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-700'
        }`}>Color Legend</h3>
        <div className={`space-y-2 text-sm ${
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
            <span>Shortest Path</span>
          </div>
        </div>
      </div>

      {/* Traversal Result */}
      {traversalOrder.length > 0 && (
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {selectedAlgorithm.toUpperCase()} Traversal Order
          </h3>
          <div className="flex flex-wrap gap-2">
            {traversalOrder.map((nodeId, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  index === 0 ? 'bg-green-500' : 
                  index === traversalOrder.length - 1 ? 'bg-red-500' : 'bg-blue-500'
                } text-white`}
              >
                {nodeId}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shortest Path Result */}
      {shortestPath.length > 0 && (
        <div className={`rounded-lg p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>Shortest Path</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Path Cost:
              </span>
              <span className="text-lg font-bold text-green-600">{pathCost}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {shortestPath.map((nodeId, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    index === 0 ? 'bg-green-500' : 
                    index === shortestPath.length - 1 ? 'bg-red-500' : 'bg-orange-500'
                  } text-white`}
                >
                  {nodeId}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Bottom Controls
  const renderBottomControls = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            placeholder="Start node"
            disabled={isTraversing}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <input
            type="text"
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
            placeholder="End node (optional)"
            disabled={isTraversing}
            className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          {showWeighted && (
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Edge weight"
              disabled={isTraversing}
              className={`p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          )}
        </div>
        <button
          onClick={handleRunAlgorithm}
          disabled={isTraversing || !startNode.trim() || nodes.length === 0}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isTraversing ? 'Running...' : 'Run Algorithm'}
        </button>
      </div>
      
      <div className={`text-sm ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <strong>Status:</strong> {isTraversing ? 'Running Algorithm...' : 'Ready'}
      </div>
    </div>
  );

  return (
    <VisualizerLayout
      title="Graph Algorithms - AlgoMania"
      subtitle="Build graphs interactively and visualize graph algorithms"
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
      bottomControls={renderBottomControls()}
    >
      {/* Center Visualization Area */}
      <div className="h-full flex flex-col">
        {/* Graph Visualization */}
        <div className="flex-1 mb-6">
          <VisualizerCanvas 
            width="100%" 
            height="100%"
            title="Graph Visualization"
          >
            {renderGraph()}
          </VisualizerCanvas>
        </div>

        {/* Algorithm Result */}
        {result.length > 0 && !isTraversing && (
          <div className={`rounded-lg p-4 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-700 border border-gray-600' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Algorithm Result</h3>
            {selectedAlgorithm === 'dijkstra' ? (
              <div className="space-y-2">
                {result.map((item, index) => (
                  <div key={index} className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <strong>From {item.start} to {item.end}:</strong> {item.distance === Infinity ? '∞' : item.distance}
                    {item.path && <span className="ml-2">Path: {item.path.join(' → ')}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {result.map((node, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-blue-500 text-white rounded-md flex items-center justify-center font-bold text-lg"
                  >
                    {node}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
              algorithmType="graphs"
              algorithmName={selectedAlgorithm === 'bfs' ? 'Breadth First Search' : 
                           selectedAlgorithm === 'dfs' ? 'Depth First Search' : 'Dijkstra\'s Algorithm'}
              currentState={{
                nodes: nodes,
                edges: edges,
                selectedAlgorithm: selectedAlgorithm,
                result: result,
                isCompleted: result.length > 0,
                startNode: startNode,
                endNode: endNode
              }}
              stepsCompleted={result.length}
              totalSteps={nodes.length}
              timeSpent={0} // You can implement time tracking if needed
              lastStep={result.length > 0 ? 'Algorithm completed successfully' : 'Ready to run algorithm'}
              notes={`Working on ${selectedAlgorithm.toUpperCase()} with ${nodes.length} nodes and ${edges.length} edges`}
            />
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default GraphVisualizer;
