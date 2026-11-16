import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import VisualizerCanvas from '../components/VisualizerCanvas';
import PseudocodePanel from '../components/PseudocodePanel';
import ComplexityBox from '../components/ComplexityBox';
import VisualizerLayout from '../components/VisualizerLayout';
import SaveProgressButton from '../components/SaveProgressButton';
import { DarkModeContext } from '../../context/ThemeContext';

import { Graph as BFSGraph, bfsPseudocode, bfsComplexity } from '../algorithms/graphs/bfs';
import { Graph as DFSGraph, dfsPseudocode, dfsComplexity } from '../algorithms/graphs/dfs';
import { WeightedGraph, dijkstraPseudocode, dijkstraComplexity } from '../algorithms/graphs/dijkstra';
import { aStarSearch, aStarComplexity } from '../algorithms/graphs/astar';
import { bellmanFord, bellmanFordComplexity } from '../algorithms/graphs/bellmanFord';
import { kruskalMST, kruskalComplexity } from '../algorithms/graphs/kruskal';
import { topologicalSortKahn, topologicalSortComplexity } from '../algorithms/graphs/topologicalSort';

const DEFAULT_NODES = [
  { id: 'A', x: 120, y: 100 },
  { id: 'B', x: 300, y: 70 },
  { id: 'C', x: 260, y: 240 },
  { id: 'D', x: 480, y: 120 },
  { id: 'E', x: 460, y: 280 },
  { id: 'F', x: 650, y: 190 }
];

const DEFAULT_EDGES = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'E', weight: 3 },
  { from: 'D', to: 'E', weight: 2 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'F', weight: 4 }
];

const DAG_NODES = [
  { id: '5', x: 160, y: 80 },
  { id: '4', x: 160, y: 260 },
  { id: '2', x: 360, y: 80 },
  { id: '0', x: 360, y: 260 },
  { id: '3', x: 540, y: 140 },
  { id: '1', x: 540, y: 280 }
];

const DAG_EDGES = [
  { from: '5', to: '2', weight: 1 },
  { from: '5', to: '0', weight: 2 },
  { from: '4', to: '0', weight: 3 },
  { from: '4', to: '1', weight: 4 },
  { from: '2', to: '3', weight: 2 },
  { from: '3', to: '1', weight: 1 }
];

const NEGATIVE_NODES = [
  { id: 'A', x: 140, y: 120 },
  { id: 'B', x: 340, y: 80 },
  { id: 'C', x: 340, y: 260 },
  { id: 'D', x: 540, y: 180 }
];

const NEGATIVE_EDGES = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 3 },
  { from: 'B', to: 'C', weight: -2 },
  { from: 'B', to: 'D', weight: 3 },
  { from: 'C', to: 'D', weight: 2 }
];

const GraphVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [isDirected, setIsDirected] = useState(false);
  const [startNode, setStartNode] = useState('A');
  const [endNode, setEndNode] = useState('F');

  // Graph topology state
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);
  const [mode, setMode] = useState('idle'); // 'idle' | 'addNode' | 'addEdge' | 'dragging'
  const [edgeSource, setEdgeSource] = useState(null);
  const [newEdgeWeight, setNewEdgeWeight] = useState(3);
  const [draggedNodeId, setDraggedNodeId] = useState(null);

  // Trace & Deterministic Playback Engine
  const [trace, setTrace] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5, 2
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [frontierNodes, setFrontierNodes] = useState(new Set());
  const [highlightPath, setHighlightPath] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [currentDistances, setCurrentDistances] = useState(null);
  const [currentInDegrees, setCurrentInDegrees] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Ready. Select an algorithm and run step-by-step simulation.');
  const [pathCost, setPathCost] = useState(null);
  const [algorithmResult, setAlgorithmResult] = useState(null);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  const algorithmSpecs = {
    bfs: {
      name: 'Breadth-First Search (BFS)',
      complexity: bfsComplexity,
      pseudocode: bfsPseudocode,
      isPathfinding: false,
      needsGoal: false
    },
    dfs: {
      name: 'Depth-First Search (DFS)',
      complexity: dfsComplexity,
      pseudocode: dfsPseudocode,
      isPathfinding: false,
      needsGoal: false
    },
    dijkstra: {
      name: "Dijkstra's Shortest Path",
      complexity: dijkstraComplexity,
      pseudocode: dijkstraPseudocode,
      isPathfinding: true,
      needsGoal: true
    },
    astar: {
      name: 'A* Pathfinding Search',
      complexity: aStarComplexity,
      pseudocode: `function aStar(start, goal):
  openSet = MinHeap()
  openSet.enqueue(start, fScore[start])
  while openSet not empty:
    curr = openSet.dequeue()
    if curr == goal: return reconstructPath()
    for neighbor in graph[curr]:
      tentative_g = g[curr] + weight
      if tentative_g < g[neighbor]:
        g[neighbor] = tentative_g
        f[neighbor] = tentative_g + heuristic(neighbor, goal)
        openSet.enqueue(neighbor, f[neighbor])`,
      isPathfinding: true,
      needsGoal: true
    },
    bellman: {
      name: 'Bellman-Ford Algorithm',
      complexity: bellmanFordComplexity,
      pseudocode: `function bellmanFord(vertices, edges, source):
  distances[source] = 0
  for i from 1 to |V| - 1:
    for each edge (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        prev[v] = u
  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      return "Negative-weight cycle detected"`,
      isPathfinding: true,
      needsGoal: true
    },
    kruskal: {
      name: "Kruskal's Minimum Spanning Tree",
      complexity: kruskalComplexity,
      pseudocode: `function kruskal(vertices, edges):
  sort edges ascending by weight
  dsu = DisjointSet(vertices)
  for (u, v, w) in edges:
    if dsu.find(u) != dsu.find(v):
      dsu.union(u, v)
      mst.add((u, v, w))
  return mst`,
      isPathfinding: false,
      needsGoal: false
    },
    topological: {
      name: 'Topological Sort (Kahn)',
      complexity: topologicalSortComplexity,
      pseudocode: `function topoSortKahn(graph):
  compute in-degree for all vertices
  queue = [v for v with in-degree == 0]
  while queue not empty:
    u = queue.dequeue()
    order.append(u)
    for v in adj[u]:
      inDegree[v] -= 1
      if inDegree[v] == 0: queue.enqueue(v)
  return order`,
      isPathfinding: false,
      needsGoal: false
    }
  };

  const currentSpec = algorithmSpecs[selectedAlgorithm] || algorithmSpecs.dijkstra;

  // Auto-switch graph directed mode when appropriate for algorithm family
  const handleAlgorithmChange = (algoKey) => {
    pausePlayback();
    setSelectedAlgorithm(algoKey);
    if (algoKey === 'topological' || algoKey === 'bellman') {
      setIsDirected(true);
    } else if (algoKey === 'kruskal') {
      setIsDirected(false);
    }
    handleReset();
  };

  // Draw Graph on Canvas with HiDPI support and directional arrowheads
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = isDarkMode;
    const defaultEdgeColor = isDark ? '#4B4842' : '#D5CFC2';
    const activeEdgeColor = '#EF592A';
    const pathEdgeColor = '#28533D';
    const mstEdgeColor = '#3A7D56';

    const nodeRadius = 22;

    // Draw Edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isPathEdge = highlightPath.some((nodeId, idx) => {
        if (idx === highlightPath.length - 1) return false;
        const nextId = highlightPath[idx + 1];
        return (
          (nodeId === edge.from && nextId === edge.to) ||
          (!isDirected && nodeId === edge.to && nextId === edge.from)
        );
      });

      const isMstEdge = mstEdges.some(e =>
        (e.u === edge.from && e.v === edge.to) ||
        (!isDirected && e.u === edge.to && e.v === edge.from)
      );

      const isActive = activeEdge && (
        (activeEdge.from === edge.from && activeEdge.to === edge.to) ||
        (!isDirected && activeEdge.from === edge.to && activeEdge.to === edge.from)
      );

      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const startX = fromNode.x + Math.cos(angle) * (nodeRadius + 2);
      const startY = fromNode.y + Math.sin(angle) * (nodeRadius + 2);
      const endX = toNode.x - Math.cos(angle) * (nodeRadius + (isDirected ? 8 : 2));
      const endY = toNode.y - Math.sin(angle) * (nodeRadius + (isDirected ? 8 : 2));

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = isPathEdge ? 4 : isMstEdge ? 3.5 : isActive ? 3 : 2;
      ctx.strokeStyle = isPathEdge
        ? pathEdgeColor
        : isMstEdge
        ? mstEdgeColor
        : isActive
        ? activeEdgeColor
        : defaultEdgeColor;
      ctx.stroke();

      // Draw Arrowhead for Directed Graphs
      if (isDirected) {
        const arrowLength = 10;
        const arrowWidth = Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle - arrowWidth),
          endY - arrowLength * Math.sin(angle - arrowWidth)
        );
        ctx.lineTo(
          endX - arrowLength * Math.cos(angle + arrowWidth),
          endY - arrowLength * Math.sin(angle + arrowWidth)
        );
        ctx.closePath();
        ctx.fillStyle = isPathEdge ? pathEdgeColor : isActive ? activeEdgeColor : defaultEdgeColor;
        ctx.fill();
      }

      // Edge weight badge
      if (edge.weight != null) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = isDark ? '#24231F' : '#FFFDF8';
        ctx.beginPath();
        ctx.arc(midX, midY, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = isPathEdge ? pathEdgeColor : isActive ? activeEdgeColor : defaultEdgeColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isPathEdge
          ? pathEdgeColor
          : isActive
          ? activeEdgeColor
          : (isDark ? '#E4E9DD' : '#24231F');
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(edge.weight), midX, midY);
      }
    });

    // Draw Nodes
    nodes.forEach(node => {
      const isVisited = visitedNodes.has(node.id);
      const isFrontier = frontierNodes.has(node.id);
      const isActive = activeNode === node.id;
      const isInPath = highlightPath.includes(node.id);
      const isStart = node.id === startNode;
      const isGoal = node.id === endNode && currentSpec.needsGoal;

      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);

      if (isInPath) {
        ctx.fillStyle = '#28533D'; // Forest green
      } else if (isActive) {
        ctx.fillStyle = '#EF592A'; // Burnt orange
      } else if (isFrontier) {
        ctx.fillStyle = isDark ? '#4A3B22' : '#F6E4C4'; // Warm amber frontier
      } else if (isVisited) {
        ctx.fillStyle = isDark ? '#323E33' : '#E4E9DD'; // Sage settled
      } else {
        ctx.fillStyle = isDark ? '#24231F' : '#FFFDF8';
      }
      ctx.fill();

      ctx.lineWidth = isActive || isInPath || isStart || isGoal ? 3 : 2;
      ctx.strokeStyle = isInPath
        ? '#28533D'
        : isActive
        ? '#EF592A'
        : isStart
        ? '#28533D'
        : isGoal
        ? '#EF592A'
        : isFrontier
        ? '#B37D2A'
        : (isDark ? '#5E5B54' : '#24231F');
      ctx.stroke();

      // Node Label
      ctx.fillStyle = (isInPath || isActive) ? '#FFFDF8' : (isDark ? '#FFFDF8' : '#24231F');
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);

      // Node distance or in-degree sub-label badge
      let subLabel = null;
      if (currentDistances && currentDistances[node.id] !== undefined) {
        const d = currentDistances[node.id];
        subLabel = `d:${d === Infinity ? '∞' : d}`;
      } else if (currentInDegrees && currentInDegrees[node.id] !== undefined) {
        subLabel = `in:${currentInDegrees[node.id]}`;
      } else if (isStart) {
        subLabel = 'START';
      } else if (isGoal) {
        subLabel = 'GOAL';
      }

      if (subLabel) {
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = isStart
          ? '#28533D'
          : isGoal
          ? '#EF592A'
          : (isDark ? '#A09D95' : '#69665F');
        ctx.fillText(subLabel, node.x, node.y + nodeRadius + 12);
      }
    });
  }, [nodes, edges, isDirected, visitedNodes, frontierNodes, activeNode, activeEdge, highlightPath, mstEdges, currentDistances, currentInDegrees, startNode, endNode, currentSpec, isDarkMode]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Apply frame data to visual state
  const applyFrame = useCallback((frame) => {
    if (!frame) return;
    setActiveNode(frame.currentNode || null);
    setActiveEdge(frame.activeEdge || null);
    setVisitedNodes(new Set(frame.visitedNodes || []));
    setFrontierNodes(new Set(frame.frontierNodes || []));
    setHighlightPath(frame.highlightPath || []);
    setMstEdges(frame.mstEdges || []);
    setStatusMessage(frame.message || '');
    if (frame.distances) setCurrentDistances({ ...frame.distances });
    if (frame.inDegree) setCurrentInDegrees({ ...frame.inDegree });
  }, []);

  // Frame stepper for Playback Engine
  const goToStep = useCallback((stepIdx) => {
    if (!trace || trace.length === 0) return;
    const validIdx = Math.max(0, Math.min(stepIdx, trace.length - 1));
    setCurrentStep(validIdx);
    applyFrame(trace[validIdx]);
  }, [trace, applyFrame]);

  // Playback timer control
  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(500 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= trace.length - 1) {
            pausePlayback();
            return prev;
          }
          const next = prev + 1;
          applyFrame(trace[next]);
          return next;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, trace, applyFrame, pausePlayback]);

  // Generate trace upfront deterministically
  const computeAlgorithmTrace = useCallback(() => {
    if (nodes.length === 0) return null;

    try {
      if (selectedAlgorithm === 'dijkstra') {
        const wg = new WeightedGraph(isDirected);
        nodes.forEach(n => wg.addVertex(n.id));
        edges.forEach(e => wg.addEdge(e.from, e.to, Number(e.weight) || 1, isDirected));
        const res = wg.dijkstraWithTrace(startNode, endNode);
        return {
          trace: res.trace,
          path: res.path,
          distance: res.distance,
          costLabel: res.distance != null ? `Shortest Distance: ${res.distance}` : 'Unreachable'
        };
      }

      if (selectedAlgorithm === 'astar') {
        const formattedEdges = edges.map(e => ({ u: e.from, v: e.to, weight: Number(e.weight) || 1 }));
        const res = aStarSearch(nodes, formattedEdges, startNode, endNode, {
          heuristicMode: 'admissible',
          isDirected
        });
        return {
          trace: res.trace,
          path: res.path,
          distance: res.distance,
          costLabel: res.distance != null ? `A* Path Cost: ${res.distance}` : 'Unreachable'
        };
      }

      if (selectedAlgorithm === 'bfs') {
        const bfsGraph = new BFSGraph(isDirected);
        nodes.forEach(n => bfsGraph.addVertex(n.id));
        edges.forEach(e => bfsGraph.addEdge(e.from, e.to, isDirected));
        const res = bfsGraph.breadthFirstSearchWithTrace(startNode, endNode);
        return {
          trace: res.trace,
          path: res.path,
          order: res.order,
          costLabel: `BFS Order: ${res.order.join(' → ')}`
        };
      }

      if (selectedAlgorithm === 'dfs') {
        const dfsGraph = new DFSGraph(isDirected);
        nodes.forEach(n => dfsGraph.addVertex(n.id));
        edges.forEach(e => dfsGraph.addEdge(e.from, e.to, isDirected));
        const res = dfsGraph.depthFirstSearchWithTrace(startNode, endNode);
        return {
          trace: res.trace,
          path: res.path,
          order: res.order,
          costLabel: `DFS Order: ${res.order.join(' → ')}`
        };
      }

      if (selectedAlgorithm === 'bellman') {
        const formattedEdges = edges.map(e => ({ u: e.from, v: e.to, weight: Number(e.weight) || 1 }));
        const res = bellmanFord(nodes.map(n => n.id), formattedEdges, startNode, endNode);
        return {
          trace: res.trace,
          path: res.path,
          hasNegativeCycle: res.hasNegativeCycle,
          costLabel: res.hasNegativeCycle
            ? 'Negative Cycle Detected!'
            : (res.distances[endNode] !== Infinity && res.distances[endNode] !== undefined
                ? `Shortest Distance: ${res.distances[endNode]}`
                : 'All Shortest Paths Computed')
        };
      }

      if (selectedAlgorithm === 'kruskal') {
        const kEdges = edges.map(e => ({ u: e.from, v: e.to, weight: Number(e.weight) || 1 }));
        const res = kruskalMST(nodes.map(n => n.id), kEdges);
        return {
          trace: res.trace,
          mst: res.mst,
          totalCost: res.totalCost,
          costLabel: `MST Total Weight: ${res.totalCost} (${res.mst.length} edges)`
        };
      }

      if (selectedAlgorithm === 'topological') {
        const directedEdges = edges.map(e => ({ u: e.from, v: e.to }));
        const res = topologicalSortKahn(nodes.map(n => n.id), directedEdges);
        return {
          trace: res.trace,
          order: res.order,
          hasCycle: res.hasCycle,
          costLabel: res.hasCycle
            ? 'Cycle Detected (Not a DAG)'
            : `Topological Order: ${res.order.join(' → ')}`
        };
      }

      return null;
    } catch (err) {
      console.error('Error generating algorithm trace:', err);
      return {
        trace: [{
          step: 1,
          type: 'error',
          currentNode: null,
          activeEdge: null,
          visitedNodes: [],
          frontierNodes: [],
          highlightPath: [],
          message: `Execution error: ${err.message}`
        }],
        costLabel: `Error: ${err.message}`
      };
    }
  }, [selectedAlgorithm, isDirected, startNode, endNode, nodes, edges]);

  // Start or resume execution
  const handlePlayToggle = () => {
    if (isPlaying) {
      pausePlayback();
      return;
    }

    if (trace.length === 0 || currentStep >= trace.length - 1) {
      const computed = computeAlgorithmTrace();
      if (!computed || !computed.trace || computed.trace.length === 0) return;
      setTrace(computed.trace);
      setAlgorithmResult(computed);
      setPathCost(computed.costLabel || null);
      setCurrentStep(0);
      applyFrame(computed.trace[0]);
    }

    setIsPlaying(true);
  };

  const handleStepNext = () => {
    pausePlayback();
    if (trace.length === 0) {
      const computed = computeAlgorithmTrace();
      if (!computed || !computed.trace) return;
      setTrace(computed.trace);
      setAlgorithmResult(computed);
      setPathCost(computed.costLabel || null);
      setCurrentStep(0);
      applyFrame(computed.trace[0]);
      return;
    }
    if (currentStep < trace.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleStepPrev = () => {
    pausePlayback();
    if (trace.length > 0 && currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    pausePlayback();
    setTrace([]);
    setCurrentStep(0);
    setActiveNode(null);
    setActiveEdge(null);
    setVisitedNodes(new Set());
    setFrontierNodes(new Set());
    setHighlightPath([]);
    setMstEdges([]);
    setCurrentDistances(null);
    setCurrentInDegrees(null);
    setPathCost(null);
    setAlgorithmResult(null);
    setStatusMessage('Graph reset to initial state. Ready to run simulation.');
  };

  // Canvas Coordinate Mapping & Responsive Scaling
  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY)
    };
  };

  const handleCanvasMouseDown = (e) => {
    if (isPlaying) return;
    const { x, y } = getCanvasCoords(e);
    const clickedNode = nodes.find(n => Math.hypot(n.x - x, n.y - y) <= 24);

    if (mode === 'idle' && clickedNode) {
      setDraggedNodeId(clickedNode.id);
      setMode('dragging');
      return;
    }

    if (mode === 'addNode') {
      const nextId = String.fromCharCode(65 + (nodes.length % 26));
      const uniqueId = nodes.some(n => n.id === nextId) ? `${nextId}${nodes.length}` : nextId;
      setNodes(prev => [...prev, { id: uniqueId, x, y }]);
      setStatusMessage(`Created node ${uniqueId} at (${x}, ${y}).`);
      setMode('idle');
      handleReset();
      return;
    }

    if (mode === 'addEdge') {
      if (!clickedNode) return;
      if (!edgeSource) {
        setEdgeSource(clickedNode.id);
        setStatusMessage(`Selected source node "${clickedNode.id}". Now click target node to create edge.`);
      } else if (edgeSource !== clickedNode.id) {
        setEdges(prev => [
          ...prev.filter(e => !(e.from === edgeSource && e.to === clickedNode.id)),
          { from: edgeSource, to: clickedNode.id, weight: Number(newEdgeWeight) || 1 }
        ]);
        setStatusMessage(`Connected edge (${edgeSource} → ${clickedNode.id}) with weight ${newEdgeWeight}.`);
        setEdgeSource(null);
        setMode('idle');
        handleReset();
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (mode === 'dragging' && draggedNodeId) {
      const { x, y } = getCanvasCoords(e);
      setNodes(prev => prev.map(n => n.id === draggedNodeId ? { ...n, x: Math.max(25, Math.min(825, x)), y: Math.max(25, Math.min(415, y)) } : n));
    }
  };

  const handleCanvasMouseUp = () => {
    if (mode === 'dragging') {
      setMode('idle');
      setDraggedNodeId(null);
    }
  };

  const loadPreset = (presetName) => {
    handleReset();
    if (presetName === 'sample') {
      setNodes(DEFAULT_NODES);
      setEdges(DEFAULT_EDGES);
      setStartNode('A');
      setEndNode('F');
      setIsDirected(false);
    } else if (presetName === 'dag') {
      setNodes(DAG_NODES);
      setEdges(DAG_EDGES);
      setStartNode('5');
      setEndNode('1');
      setIsDirected(true);
    } else if (presetName === 'negative') {
      setNodes(NEGATIVE_NODES);
      setEdges(NEGATIVE_EDGES);
      setStartNode('A');
      setEndNode('D');
      setIsDirected(true);
    } else if (presetName === 'empty') {
      setNodes([]);
      setEdges([]);
      setStartNode('');
      setEndNode('');
    }
  };

  const renderLeftSidebar = () => (
    <div className="space-y-5">
      {/* Algorithm selector */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-1.5">
          ALGORITHM
        </span>
        <select
          value={selectedAlgorithm}
          onChange={(e) => handleAlgorithmChange(e.target.value)}
          disabled={isPlaying}
          aria-label="Select graph algorithm"
          className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition-all outline-none focus:border-[#EF592A] ${
            isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
          }`}
        >
          <option value="dijkstra">Dijkstra's Shortest Path</option>
          <option value="astar">A* Pathfinding Search</option>
          <option value="bellman">Bellman-Ford Algorithm</option>
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
          <option value="kruskal">Kruskal's MST</option>
          <option value="topological">Topological Sort (Kahn)</option>
        </select>

        {/* Graph Direction Mode Toggle */}
        <div className="mt-3 pt-3 border-t border-[#DED9CE] dark:border-[#383630] flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#69665F] dark:text-[#A09D95]">Graph Type:</span>
          <button
            type="button"
            onClick={() => { pausePlayback(); setIsDirected(!isDirected); handleReset(); }}
            disabled={isPlaying}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
              isDirected
                ? 'bg-[#EF592A] text-[#FFFDF8] border-[#EF592A]'
                : 'bg-[#28533D] text-[#FFFDF8] border-[#28533D]'
            }`}
          >
            {isDirected ? '→ Directed Graph' : '— Undirected Graph'}
          </button>
        </div>

        {/* Start / Goal Node Selectors */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-[#69665F] dark:text-[#A09D95]">Start Node</label>
            <select
              value={startNode}
              onChange={(e) => { pausePlayback(); setStartNode(e.target.value); handleReset(); }}
              disabled={isPlaying || nodes.length === 0}
              aria-label="Start node"
              className={`w-full p-2 rounded-lg border text-xs font-mono font-bold mt-0.5 ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            >
              {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-[#69665F] dark:text-[#A09D95]">
              {currentSpec.needsGoal ? 'Goal Node' : 'Goal (Optional)'}
            </label>
            <select
              value={endNode}
              onChange={(e) => { pausePlayback(); setEndNode(e.target.value); handleReset(); }}
              disabled={isPlaying || nodes.length === 0}
              aria-label="Goal node"
              className={`w-full p-2 rounded-lg border text-xs font-mono font-bold mt-0.5 ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            >
              {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Graph Presets & Canvas Tools */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
      }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          GRAPH PRESETS
        </span>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => loadPreset('sample')}
            disabled={isPlaying}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            Sample (General)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('dag')}
            disabled={isPlaying}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            DAG (Topo Sort)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('negative')}
            disabled={isPlaying}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            Negative (Bellman)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('empty')}
            disabled={isPlaying}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            Clear Canvas
          </button>
        </div>

        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          INTERACTIVE TOOLS
        </span>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            onClick={() => { setMode(mode === 'addNode' ? 'idle' : 'addNode'); setEdgeSource(null); }}
            disabled={isPlaying}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              mode === 'addNode'
                ? 'bg-[#EF592A] text-[#FFFDF8] border-[#EF592A]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]'
            }`}
          >
            {mode === 'addNode' ? 'Click Canvas' : '+ Add Node'}
          </button>
          <button
            type="button"
            onClick={() => { setMode(mode === 'addEdge' ? 'idle' : 'addEdge'); setEdgeSource(null); }}
            disabled={isPlaying}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              mode === 'addEdge'
                ? 'bg-[#28533D] text-[#FFFDF8] border-[#28533D]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]'
            }`}
          >
            {mode === 'addEdge' ? (edgeSource ? `Target?` : 'Source?') : '+ Connect Edge'}
          </button>
        </div>

        {mode === 'addEdge' && (
          <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
            <label className="text-[10px] font-mono uppercase text-[#69665F]">Weight:</label>
            <input
              type="number"
              value={newEdgeWeight}
              onChange={(e) => setNewEdgeWeight(e.target.value)}
              className={`w-20 px-2 py-1 rounded-lg border text-xs font-mono font-bold ${
                isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
              }`}
            />
          </div>
        )}
      </div>

      <SaveProgressButton
        algorithmType="graphs"
        algorithmName={currentSpec.name}
        currentState={{ nodes, edges, startNode, endNode, isDirected }}
        stepsCompleted={currentStep}
        totalSteps={trace.length || 10}
      />
    </div>
  );

  const renderRightSidebar = () => (
    <div className="space-y-5">
      <ComplexityBox
        complexity={currentSpec.complexity}
        title={`${currentSpec.name} Specs`}
      />
      <PseudocodePanel
        title={`${currentSpec.name} Logic`}
        code={currentSpec.pseudocode}
        currentLine={1}
      />
    </div>
  );

  return (
    <VisualizerLayout
      title={currentSpec.name}
      subtitle="Interactive deterministic network graph and shortest-path simulator with unified trace playback"
      category="Graph Algorithms"
      complexityBadge={currentSpec.complexity?.time || 'O(V + E)'}
      leftSidebar={renderLeftSidebar()}
      rightSidebar={renderRightSidebar()}
    >
      <div className="h-full flex flex-col space-y-4">
        {/* Main Graph Canvas */}
        <div className="flex-1">
          <VisualizerCanvas
            width={900}
            height={440}
            title={`${currentSpec.name} Interactive Network`}
          >
            <div className="relative w-full h-full select-none">
              <canvas
                ref={canvasRef}
                width={850}
                height={440}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                className="w-full h-full cursor-pointer rounded-xl"
              />

              {mode === 'addNode' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24231F] border border-[#EF592A] text-[#EF592A] text-xs font-mono font-bold shadow-xs">
                  ✨ Click anywhere on canvas to place a new vertex
                </div>
              )}

              {mode === 'addEdge' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24231F] border border-[#28533D] text-[#28533D] text-xs font-mono font-bold shadow-xs">
                  🔗 {edgeSource ? `Click target node to connect with ${edgeSource}` : 'Click source node'}
                </div>
              )}

              {mode === 'idle' && (
                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#69665F]/80 dark:text-[#A09D95]/80 pointer-events-none">
                  💡 Drag nodes to rearrange canvas
                </div>
              )}
            </div>
          </VisualizerCanvas>
        </div>

        {/* Unified Playback Controller & Status Strip */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
          {/* Top Bar: Play, Pause, Step Back, Step Forward, Reset, Speed */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePlayToggle}
                disabled={nodes.length === 0}
                className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] hover:bg-[#D9481B] text-[#FFFDF8] shadow-xs transition-all disabled:opacity-50 flex items-center space-x-1.5"
              >
                <span>{isPlaying ? '⏸ Pause' : currentStep > 0 && currentStep < trace.length - 1 ? '▶ Resume' : '▶ Run Simulation'}</span>
              </button>

              <button
                type="button"
                onClick={handleStepPrev}
                disabled={isPlaying || currentStep <= 0}
                className="px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all disabled:opacity-40"
                title="Step backward"
              >
                ⏮ Prev
              </button>

              <button
                type="button"
                onClick={handleStepNext}
                disabled={isPlaying || (trace.length > 0 && currentStep >= trace.length - 1)}
                className="px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all disabled:opacity-40"
                title="Step forward"
              >
                ⏭ Next
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all"
                title="Reset simulation"
              >
                ↺ Reset
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold">
              <span className="text-[#69665F] dark:text-[#A09D95] text-[10px] uppercase mr-1">Speed:</span>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2 py-1 rounded-lg border text-xs transition-all ${
                    playbackSpeed === s
                      ? 'bg-[#28533D] text-[#FFFDF8] border-[#28533D]'
                      : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630] text-[#69665F]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Scrubbing Bar */}
          {trace.length > 0 && (
            <div className="flex items-center space-x-3 mb-3 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
              <span className="text-[11px] font-mono font-bold text-[#69665F] dark:text-[#A09D95] w-24">
                Step {currentStep + 1}/{trace.length}
              </span>
              <input
                type="range"
                min="0"
                max={trace.length - 1}
                value={currentStep}
                onChange={(e) => { pausePlayback(); goToStep(Number(e.target.value)); }}
                className="flex-1 accent-[#EF592A] cursor-pointer"
              />
            </div>
          )}

          {/* Live Explanation & Metrics Status */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#DED9CE] dark:border-[#383630]">
            <div className="flex items-center space-x-2 flex-1 text-left">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF592A] animate-pulse"></span>
              <span className="text-xs font-mono font-semibold text-[#24231F] dark:text-[#FFFDF8]">
                {statusMessage}
              </span>
            </div>

            {pathCost && (
              <span className="px-3 py-1 rounded-lg bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] text-xs font-mono font-bold">
                {pathCost}
              </span>
            )}
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default GraphVisualizer;