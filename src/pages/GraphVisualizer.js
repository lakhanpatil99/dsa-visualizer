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

const GraphVisualizer = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [startNode, setStartNode] = useState('A');
  const [endNode, setEndNode] = useState('F');

  // Graph state
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);
  const [mode, setMode] = useState('idle'); // 'idle' | 'addNode' | 'addEdge'
  const [edgeSource, setEdgeSource] = useState(null);

  // Traversal & animation state
  const [isRunning, setIsRunning] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [highlightPath, setHighlightPath] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Ready. Select an algorithm or inspect nodes.');
  const [stepCount, setStepCount] = useState(0);
  const [pathCost, setPathCost] = useState(null);

  const canvasRef = useRef(null);

  const algorithmSpecs = {
    bfs: {
      name: 'Breadth-First Search',
      complexity: bfsComplexity,
      pseudocode: bfsPseudocode
    },
    dfs: {
      name: 'Depth-First Search',
      complexity: dfsComplexity,
      pseudocode: dfsPseudocode
    },
    dijkstra: {
      name: "Dijkstra's Shortest Path",
      complexity: dijkstraComplexity,
      pseudocode: dijkstraPseudocode
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
        openSet.enqueue(neighbor, f[neighbor])`
    },
    bellman: {
      name: 'Bellman-Ford Algorithm',
      complexity: bellmanFordComplexity,
      pseudocode: `function bellmanFord(vertices, edges, source):
  dist[source] = 0
  for i from 1 to |V| - 1:
    for (u, v, w) in edges:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w`
    },
    kruskal: {
      name: "Kruskal's MST",
      complexity: kruskalComplexity,
      pseudocode: `function kruskal(vertices, edges):
  sort edges by weight
  dsu = DisjointSet(vertices)
  for (u, v, w) in edges:
    if dsu.find(u) != dsu.find(v):
      dsu.union(u, v)
      mst.add((u, v, w))`
    },
    topological: {
      name: 'Topological Sort (Kahn)',
      complexity: topologicalSortComplexity,
      pseudocode: `function topoSort(graph):
  compute in-degree for all vertices
  queue = [v for v with in-degree == 0]
  while queue not empty:
    u = queue.dequeue()
    order.append(u)
    for v in adj[u]:
      inDegree[v] -= 1
      if inDegree[v] == 0: queue.enqueue(v)`
    }
  };

  const currentSpec = algorithmSpecs[selectedAlgorithm] || algorithmSpecs.dijkstra;

  // Redraw canvas
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
          (nodeId === edge.to && nextId === edge.from)
        );
      });

      const isActive = activeEdge && (
        (activeEdge.from === edge.from && activeEdge.to === edge.to) ||
        (activeEdge.from === edge.to && activeEdge.to === edge.from)
      );

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.lineWidth = isPathEdge ? 4 : isActive ? 3 : 2;
      ctx.strokeStyle = isPathEdge ? pathEdgeColor : isActive ? activeEdgeColor : defaultEdgeColor;
      ctx.stroke();

      // Edge weight badge
      if (edge.weight != null) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = isDark ? '#24231F' : '#FFFDF8';
        ctx.beginPath();
        ctx.arc(midX, midY, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = isPathEdge ? pathEdgeColor : defaultEdgeColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isPathEdge ? pathEdgeColor : (isDark ? '#E4E9DD' : '#24231F');
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(edge.weight), midX, midY);
      }
    });

    // Draw Nodes
    nodes.forEach(node => {
      const isVisited = visitedNodes.has(node.id);
      const isActive = activeNode === node.id;
      const isInPath = highlightPath.includes(node.id);

      ctx.beginPath();
      ctx.arc(node.x, node.y, 22, 0, 2 * Math.PI);

      if (isInPath) {
        ctx.fillStyle = '#28533D'; // Forest green
      } else if (isActive) {
        ctx.fillStyle = '#EF592A'; // Burnt orange
      } else if (isVisited) {
        ctx.fillStyle = isDark ? '#3D4A3E' : '#E4E9DD';
      } else {
        ctx.fillStyle = isDark ? '#24231F' : '#FFFDF8';
      }
      ctx.fill();

      ctx.lineWidth = isActive || isInPath ? 3 : 2;
      ctx.strokeStyle = isInPath ? '#28533D' : isActive ? '#EF592A' : (isDark ? '#5E5B54' : '#24231F');
      ctx.stroke();

      // Label
      ctx.fillStyle = (isInPath || isActive) ? '#FFFDF8' : (isDark ? '#FFFDF8' : '#24231F');
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
    });
  }, [nodes, edges, visitedNodes, activeNode, activeEdge, highlightPath, isDarkMode]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const handleCanvasClick = (e) => {
    if (isRunning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (mode === 'addNode') {
      const nextId = String.fromCharCode(65 + nodes.length % 26);
      const uniqueId = nodes.some(n => n.id === nextId) ? `${nextId}${nodes.length}` : nextId;
      setNodes(prev => [...prev, { id: uniqueId, x, y }]);
      setStatusMessage(`Added node ${uniqueId} at (${x}, ${y}).`);
      setMode('idle');
      return;
    }

    if (mode === 'addEdge') {
      const clicked = nodes.find(n => Math.hypot(n.x - x, n.y - y) <= 24);
      if (!clicked) return;

      if (!edgeSource) {
        setEdgeSource(clicked.id);
        setStatusMessage(`Selected node ${clicked.id}. Now click target node to create edge.`);
      } else if (edgeSource !== clicked.id) {
        const newWeight = Math.floor(Math.hypot(nodes.find(n => n.id === edgeSource).x - clicked.x, nodes.find(n => n.id === edgeSource).y - clicked.y) / 40) + 1;
        setEdges(prev => [...prev, { from: edgeSource, to: clicked.id, weight: newWeight }]);
        setStatusMessage(`Connected edge (${edgeSource} - ${clicked.id}) with weight ${newWeight}.`);
        setEdgeSource(null);
        setMode('idle');
      }
    }
  };

  const handleRun = async () => {
    if (isRunning || nodes.length === 0) return;
    setIsRunning(true);
    setVisitedNodes(new Set());
    setActiveNode(null);
    setActiveEdge(null);
    setHighlightPath([]);
    setPathCost(null);
    setStepCount(0);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    try {
      if (selectedAlgorithm === 'dijkstra') {
        const wg = new WeightedGraph();
        nodes.forEach(n => wg.addVertex(n.id));
        edges.forEach(e => wg.addEdge(e.from, e.to, e.weight));

        const res = wg.dijkstra(startNode, endNode);
        setStatusMessage(`Running Dijkstra from ${startNode} to ${endNode}...`);

        if (res.path && res.path.length > 0) {
          const visitedSoFar = new Set();
          for (let i = 0; i < res.path.length; i++) {
            const nodeId = res.path[i];
            visitedSoFar.add(nodeId);
            setVisitedNodes(new Set(visitedSoFar));
            setActiveNode(nodeId);
            setStepCount(i + 1);
            await sleep(400);
          }
          setHighlightPath(res.path);
          setPathCost(res.distance);
          setStatusMessage(`Shortest path found: ${res.path.join(' → ')} (Total distance: ${res.distance})`);
        } else {
          setStatusMessage(`No connected path exists between ${startNode} and ${endNode}.`);
        }
      } else if (selectedAlgorithm === 'astar') {
        const formattedEdges = edges.map(e => ({ u: e.from, v: e.to, weight: e.weight }));
        const res = aStarSearch(nodes, formattedEdges, startNode, endNode);
        setStatusMessage(`Running A* heuristic search from ${startNode} to ${endNode}...`);

        for (let i = 0; i < res.trace.length; i++) {
          const t = res.trace[i];
          if (t.currentNode) {
            setActiveNode(t.currentNode);
            setVisitedNodes(prev => new Set([...prev, t.currentNode]));
          }
          setStatusMessage(t.message);
          setStepCount(i + 1);
          await sleep(350);
        }

        if (res.path.length > 0) {
          setHighlightPath(res.path);
          setPathCost(res.distance);
          setStatusMessage(`A* goal reached: ${res.path.join(' → ')} (Cost: ${res.distance})`);
        }
      } else if (selectedAlgorithm === 'bfs') {
        const bfsGraph = new BFSGraph();
        nodes.forEach(n => bfsGraph.addVertex(n.id));
        edges.forEach(e => bfsGraph.addEdge(e.from, e.to));

        const order = bfsGraph.bfs(startNode);
        const visitedSoFar = new Set();
        for (let i = 0; i < order.length; i++) {
          const nodeId = order[i];
          visitedSoFar.add(nodeId);
          setVisitedNodes(new Set(visitedSoFar));
          setActiveNode(nodeId);
          setStepCount(i + 1);
          setStatusMessage(`BFS visited level node: ${nodeId}`);
          await sleep(400);
        }
        setStatusMessage(`BFS traversal complete: ${order.join(' → ')}`);
      } else if (selectedAlgorithm === 'dfs') {
        const dfsGraph = new DFSGraph();
        nodes.forEach(n => dfsGraph.addVertex(n.id));
        edges.forEach(e => dfsGraph.addEdge(e.from, e.to));

        const order = dfsGraph.dfs(startNode);
        const visitedSoFar = new Set();
        for (let i = 0; i < order.length; i++) {
          const nodeId = order[i];
          visitedSoFar.add(nodeId);
          setVisitedNodes(new Set(visitedSoFar));
          setActiveNode(nodeId);
          setStepCount(i + 1);
          setStatusMessage(`DFS descended along branch: ${nodeId}`);
          await sleep(400);
        }
        setStatusMessage(`DFS traversal complete: ${order.join(' → ')}`);
      } else if (selectedAlgorithm === 'kruskal') {
        const kEdges = edges.map(e => ({ u: e.from, v: e.to, weight: e.weight }));
        const res = kruskalMST(nodes.map(n => n.id), kEdges);
        for (let i = 0; i < res.trace.length; i++) {
          const t = res.trace[i];
          setActiveEdge({ from: t.edge.u, to: t.edge.v });
          setStatusMessage(t.message);
          setStepCount(i + 1);
          await sleep(400);
        }
        setPathCost(res.totalCost);
        setStatusMessage(`Kruskal MST complete! Total weight: ${res.totalCost}`);
      } else if (selectedAlgorithm === 'topological') {
        const directedEdges = edges.map(e => ({ u: e.from, v: e.to }));
        const res = topologicalSortKahn(nodes.map(n => n.id), directedEdges);
        if (res.hasCycle) {
          setStatusMessage('Cycle detected! Graph cannot be topologically sorted.');
        } else {
          for (let i = 0; i < res.order.length; i++) {
            const nodeId = res.order[i];
            setActiveNode(nodeId);
            setVisitedNodes(prev => new Set([...prev, nodeId]));
            setStepCount(i + 1);
            setStatusMessage(`Topological step ${i + 1}: Node ${nodeId}`);
            await sleep(400);
          }
          setStatusMessage(`Topological order: ${res.order.join(' → ')}`);
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage(`Error executing algorithm: ${err.message}`);
    } finally {
      setIsRunning(false);
      setActiveNode(null);
      setActiveEdge(null);
    }
  };

  const handleReset = () => {
    setVisitedNodes(new Set());
    setActiveNode(null);
    setActiveEdge(null);
    setHighlightPath([]);
    setPathCost(null);
    setStepCount(0);
    setStatusMessage('Graph reset to initial state.');
  };

  const loadPreset = (presetName) => {
    handleReset();
    if (presetName === 'sample') {
      setNodes(DEFAULT_NODES);
      setEdges(DEFAULT_EDGES);
      setStartNode('A');
      setEndNode('F');
    } else if (presetName === 'grid') {
      const gridNodes = [
        { id: '1', x: 160, y: 100 }, { id: '2', x: 360, y: 100 }, { id: '3', x: 560, y: 100 },
        { id: '4', x: 160, y: 220 }, { id: '5', x: 360, y: 220 }, { id: '6', x: 560, y: 220 },
        { id: '7', x: 160, y: 340 }, { id: '8', x: 360, y: 340 }, { id: '9', x: 560, y: 340 }
      ];
      const gridEdges = [
        { from: '1', to: '2', weight: 2 }, { from: '2', to: '3', weight: 3 },
        { from: '4', to: '5', weight: 1 }, { from: '5', to: '6', weight: 4 },
        { from: '7', to: '8', weight: 2 }, { from: '8', to: '9', weight: 3 },
        { from: '1', to: '4', weight: 4 }, { from: '4', to: '7', weight: 2 },
        { from: '2', to: '5', weight: 2 }, { from: '5', to: '8', weight: 3 },
        { from: '3', to: '6', weight: 1 }, { from: '6', to: '9', weight: 5 }
      ];
      setNodes(gridNodes);
      setEdges(gridEdges);
      setStartNode('1');
      setEndNode('9');
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
      <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#EF592A] uppercase font-bold mb-1.5">
          ALGORITHM
        </span>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          disabled={isRunning}
          aria-label="Select graph algorithm"
          className={`w-full p-2.5 rounded-xl border text-sm font-semibold transition-all outline-none focus:border-[#EF592A] ${isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
            }`}
        >
          <option value="dijkstra">Dijkstra's Shortest Path</option>
          <option value="astar">A* Pathfinding Search</option>
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
          <option value="kruskal">Kruskal's MST</option>
          <option value="topological">Topological Sort</option>
        </select>

        {/* Start / End Node Selectors */}
        {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'astar' || selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs') && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-[#69665F] dark:text-[#A09D95]">Start Node</label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                disabled={isRunning}
                aria-label="Start node"
                className={`w-full p-2 rounded-lg border text-xs font-mono font-bold mt-0.5 ${isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
                  }`}
              >
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'astar') && (
              <div>
                <label className="text-[10px] font-mono uppercase text-[#69665F] dark:text-[#A09D95]">Goal Node</label>
                <select
                  value={endNode}
                  onChange={(e) => setEndNode(e.target.value)}
                  disabled={isRunning}
                  aria-label="Goal node"
                  className={`w-full p-2 rounded-lg border text-xs font-mono font-bold mt-0.5 ${isDarkMode ? 'bg-[#1D1C19] border-[#383630] text-[#FFFDF8]' : 'bg-[#FAF8F3] border-[#DED9CE] text-[#24231F]'
                    }`}
                >
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Graph Presets & Canvas Tools */}
      <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
        }`}>
        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          GRAPH PRESETS
        </span>
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => loadPreset('sample')}
            disabled={isRunning}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => loadPreset('grid')}
            disabled={isRunning}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            Grid 3×3
          </button>
          <button
            type="button"
            onClick={() => loadPreset('empty')}
            disabled={isRunning}
            className="px-2 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] hover:border-[#EF592A]"
          >
            Clear
          </button>
        </div>

        <span className="block text-[10px] font-mono tracking-widest text-[#69665F] dark:text-[#A09D95] uppercase font-bold mb-2">
          CANVAS TOOLS
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setMode(mode === 'addNode' ? 'idle' : 'addNode'); setEdgeSource(null); }}
            disabled={isRunning}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${mode === 'addNode'
                ? 'bg-[#EF592A] text-[#FFFDF8] border-[#EF592A]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]'
              }`}
          >
            {mode === 'addNode' ? 'Click Canvas' : '+ Add Node'}
          </button>
          <button
            type="button"
            onClick={() => { setMode(mode === 'addEdge' ? 'idle' : 'addEdge'); setEdgeSource(null); }}
            disabled={isRunning}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${mode === 'addEdge'
                ? 'bg-[#28533D] text-[#FFFDF8] border-[#28533D]'
                : 'bg-[#FAF8F3] dark:bg-[#1D1C19] border-[#DED9CE] dark:border-[#383630]'
              }`}
          >
            {mode === 'addEdge' ? (edgeSource ? `Target?` : 'Source?') : '+ Connect'}
          </button>
        </div>
      </div>

      <SaveProgressButton
        algorithmType="graphs"
        algorithmName={currentSpec.name}
        currentState={{ nodes, edges, startNode, endNode }}
        stepsCompleted={stepCount}
        totalSteps={stepCount || 10}
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
      subtitle="Interactive deterministic network graph and shortest-path simulator"
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
            <div className="relative w-full h-full">
              <canvas
                ref={canvasRef}
                width={850}
                height={440}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-pointer rounded-xl"
              />

              {mode === 'addNode' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24231F] border border-[#EF592A] text-[#EF592A] text-xs font-mono font-bold shadow-xs">
                  ✨ Click anywhere on canvas to place node
                </div>
              )}

              {mode === 'addEdge' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#FAF8F3] dark:bg-[#24231F] border border-[#28533D] text-[#28533D] text-xs font-mono font-bold shadow-xs">
                  🔗 {edgeSource ? `Click target node to connect with ${edgeSource}` : 'Click source node'}
                </div>
              )}
            </div>
          </VisualizerCanvas>
        </div>

        {/* Live Controller & Status Strip */}
        <div className={`p-4 rounded-2xl border transition-all ${isDarkMode ? 'bg-[#24231F] border-[#383630]' : 'bg-[#FFFDF8] border-[#DED9CE]'
          }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning || nodes.length === 0}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#EF592A] hover:bg-[#D9481B] text-[#FFFDF8] shadow-xs transition-all disabled:opacity-50"
              >
                {isRunning ? 'Traversing...' : 'Run Simulation'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isRunning}
                className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#FAF8F3] dark:bg-[#1D1C19] border border-[#DED9CE] dark:border-[#383630] text-[#24231F] dark:text-[#FFFDF8] hover:border-[#EF592A] transition-all disabled:opacity-50"
              >
                Reset
              </button>
            </div>

            <div className="flex-1 text-center sm:text-right">
              <span className="text-xs font-mono font-semibold text-[#24231F] dark:text-[#FFFDF8]">
                {statusMessage}
              </span>
              {pathCost != null && (
                <span className="ml-3 px-2 py-0.5 rounded bg-[#E4E9DD] dark:bg-[#28382F] text-[#28533D] dark:text-[#E4E9DD] text-xs font-mono font-bold">
                  Cost: {pathCost}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default GraphVisualizer;
