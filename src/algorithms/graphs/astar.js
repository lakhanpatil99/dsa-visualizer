import { MinHeap } from './MinHeap.js';

/**
 * A* Pathfinding Search with Admissible Heuristic Normalization
 * Supports admissible scaled Euclidean heuristics, zero-heuristic (Dijkstra mode),
 * priority-queue stale entry management, and full unified step tracing.
 *
 * @param {Array<{id: string, x?: number, y?: number}>} nodes
 * @param {Array<{u: string, v: string, weight: number}>} edges
 * @param {string} startId
 * @param {string} goalId
 * @param {Object} [options]
 * @param {'admissible'|'zero'|'euclidean'} [options.heuristicMode='admissible']
 * @param {boolean} [options.isDirected=false]
 * @returns {{ path: Array, distance: number|null, trace: Array, heuristicStats: Object }}
 */
export function aStarSearch(nodes, edges, startId, goalId, options = {}) {
  const { heuristicMode = 'admissible', isDirected = false } = options;
  const trace = [];
  let step = 1;

  const nodeMap = {};
  const adj = {};
  for (const node of nodes) {
    nodeMap[node.id] = node;
    adj[node.id] = [];
  }

  for (const edge of edges) {
    if (!adj[edge.u]) adj[edge.u] = [];
    if (!adj[edge.v]) adj[edge.v] = [];
    adj[edge.u].push({ v: edge.v, weight: edge.weight });
    if (!isDirected) {
      adj[edge.v].push({ v: edge.u, weight: edge.weight });
    }
  }

  if (!nodeMap[startId] || !nodeMap[goalId]) {
    trace.push({
      step: step++,
      type: 'error',
      currentNode: null,
      activeEdge: null,
      visitedNodes: [],
      frontierNodes: [],
      highlightPath: [],
      distances: {},
      message: `Invalid start node "${startId}" or goal node "${goalId}".`
    });
    return { path: [], distance: null, trace, heuristicStats: { mode: heuristicMode, scaleRatio: 0 } };
  }

  // Calculate Euclidean distance between coordinates
  const rawEuclidean = (id1, id2) => {
    const n1 = nodeMap[id1];
    const n2 = nodeMap[id2];
    if (!n1 || !n2 || n1.x == null || n2.x == null || n1.y == null || n2.y == null) return 0;
    const dx = n1.x - n2.x;
    const dy = n1.y - n2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Determine scale ratio to ensure strict admissibility: h(u) <= true_dist(u, goal)
  // For any edge (u, v), h(u) - h(v) <= c(u, v) requires scaleRatio <= weight(u, v) / euclidean(u, v).
  let scaleRatio = 1;
  if (heuristicMode === 'zero') {
    scaleRatio = 0;
  } else if (heuristicMode === 'admissible') {
    let minRatio = Infinity;
    for (const edge of edges) {
      const dist = rawEuclidean(edge.u, edge.v);
      if (dist > 0.001) {
        const ratio = edge.weight / dist;
        if (ratio < minRatio) {
          minRatio = ratio;
        }
      }
    }
    scaleRatio = minRatio !== Infinity && minRatio > 0 ? minRatio : 0;
  } else {
    // raw euclidean mode (e.g., metric coordinates in km)
    scaleRatio = 1;
  }

  const heuristic = (id) => {
    if (scaleRatio === 0) return 0;
    const raw = rawEuclidean(id, goalId);
    return Math.round(raw * scaleRatio * 100) / 100;
  };

  // Special case: start === goal
  if (startId === goalId) {
    trace.push({
      step: step++,
      type: 'goal_reached',
      currentNode: startId,
      activeEdge: null,
      visitedNodes: [startId],
      frontierNodes: [],
      highlightPath: [startId],
      distances: { [startId]: 0 },
      message: `Start node is already the destination "${goalId}". Distance is 0.`
    });
    return {
      path: [startId],
      distance: 0,
      trace,
      heuristicStats: { mode: heuristicMode, scaleRatio }
    };
  }

  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  const openSet = new MinHeap();
  const visited = new Set();

  for (const node of nodes) {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    cameFrom[node.id] = null;
  }

  gScore[startId] = 0;
  const initialH = heuristic(startId);
  fScore[startId] = initialH;
  openSet.enqueue(startId, fScore[startId]);

  trace.push({
    step: step++,
    type: 'init',
    currentNode: startId,
    activeEdge: null,
    visitedNodes: [],
    frontierNodes: [startId],
    highlightPath: [],
    distances: { ...gScore },
    message: `Initialized A*. Start ${startId} has g=0, h=${initialH.toFixed(2)}, f=${fScore[startId].toFixed(2)}.`
  });

  let goalReached = false;

  while (!openSet.isEmpty()) {
    const minNode = openSet.dequeue();
    if (!minNode) break;
    const current = minNode.val;
    const currentF = minNode.priority;

    if (visited.has(current)) {
      trace.push({
        step: step++,
        type: 'stale_skip',
        currentNode: current,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: openSet.heap.map(h => h.val),
        highlightPath: [],
        distances: { ...gScore },
        message: `Skipping stale queue entry for ${current} (fScore: ${currentF}).`
      });
      continue;
    }

    visited.add(current);

    trace.push({
      step: step++,
      type: 'extract_min',
      currentNode: current,
      activeEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: openSet.heap.map(h => h.val),
      highlightPath: [],
      distances: { ...gScore },
      message: `Selected node ${current} with minimum fScore = ${fScore[current].toFixed(2)} (g = ${gScore[current]}, h = ${heuristic(current).toFixed(2)}).`
    });

    if (current === goalId) {
      goalReached = true;
      trace.push({
        step: step++,
        type: 'goal_reached',
        currentNode: current,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: openSet.heap.map(h => h.val),
        highlightPath: [],
        distances: { ...gScore },
        message: `Destination ${goalId} reached with optimal cost ${gScore[goalId]}!`
      });
      break;
    }

    const neighbors = adj[current] || [];
    for (const neighbor of neighbors) {
      const next = neighbor.v;
      const weight = neighbor.weight;

      if (visited.has(next)) {
        trace.push({
          step: step++,
          type: 'already_visited',
          currentNode: current,
          activeEdge: { from: current, to: next, weight },
          visitedNodes: Array.from(visited),
          frontierNodes: openSet.heap.map(h => h.val),
          highlightPath: [],
          distances: { ...gScore },
          message: `Neighbor ${next} is already settled in closed set; skipping.`
        });
        continue;
      }

      const tentativeG = gScore[current] + weight;

      trace.push({
        step: step++,
        type: 'inspect_edge',
        currentNode: current,
        activeEdge: { from: current, to: next, weight },
        visitedNodes: Array.from(visited),
        frontierNodes: openSet.heap.map(h => h.val),
        highlightPath: [],
        distances: { ...gScore },
        message: `Evaluating edge (${current} → ${next}, w=${weight}). Tentative gScore = ${tentativeG}.`
      });

      if (tentativeG < gScore[next]) {
        cameFrom[next] = current;
        gScore[next] = tentativeG;
        const h = heuristic(next);
        fScore[next] = tentativeG + h;
        openSet.enqueue(next, fScore[next]);

        trace.push({
          step: step++,
          type: 'relax',
          currentNode: current,
          activeEdge: { from: current, to: next, weight },
          visitedNodes: Array.from(visited),
          frontierNodes: openSet.heap.map(h => h.val),
          highlightPath: [],
          distances: { ...gScore },
          message: `Updated node ${next}: gScore = ${tentativeG}, h = ${h.toFixed(2)}, fScore = ${fScore[next].toFixed(2)}.`
        });
      }
    }
  }

  // Reconstruct path
  const path = [];
  if (gScore[goalId] !== Infinity && (goalReached || cameFrom[goalId] !== null)) {
    let curr = goalId;
    while (curr) {
      path.unshift(curr);
      curr = cameFrom[curr];
    }
    if (path[0] !== startId) {
      path.length = 0;
    }
  }

  if (path.length > 0) {
    trace.push({
      step: step++,
      type: 'path_found',
      currentNode: goalId,
      activeEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: [],
      highlightPath: path,
      distances: { ...gScore },
      message: `A* optimal path reconstructed: ${path.join(' → ')} (Cost: ${gScore[goalId]})`
    });
  } else {
    trace.push({
      step: step++,
      type: 'unreachable',
      currentNode: null,
      activeEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: [],
      highlightPath: [],
      distances: { ...gScore },
      message: `No connected route from "${startId}" to "${goalId}".`
    });
  }

  trace.push({
    step: step++,
    type: 'complete',
    currentNode: null,
    activeEdge: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    highlightPath: path,
    distances: { ...gScore },
    path,
    distance: path.length > 0 ? gScore[goalId] : null,
    message: `A* search complete. Evaluated ${visited.size} vertices.`
  });

  return {
    path,
    distance: path.length > 0 ? gScore[goalId] : null,
    trace,
    heuristicStats: { mode: heuristicMode, scaleRatio }
  };
}

export const aStarComplexity = {
  time: 'O((V + E) log V)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(E)',
  averageCase: 'O((V + E) log V)',
  worstCase: 'O(b^d)'
};
