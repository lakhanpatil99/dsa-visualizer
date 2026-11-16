import { MinHeap } from './MinHeap.js';

export class WeightedGraph {
  constructor(isDirected = false) {
    this.adjacencyList = {};
    this.isDirected = isDirected;
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight, isDirected = this.isDirected) {
    if (weight < 0) {
      throw new Error(`Dijkstra requires non-negative edge weights; got ${weight} for edge (${vertex1}, ${vertex2})`);
    }
    if (!this.adjacencyList[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList[vertex2]) {
      this.addVertex(vertex2);
    }
    
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    if (!isDirected) {
      this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }
  }

  removeEdge(vertex1, vertex2) {
    if (this.adjacencyList[vertex1]) {
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
        v => v.node !== vertex2
      );
    }
    if (!this.isDirected && this.adjacencyList[vertex2]) {
      this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
        v => v.node !== vertex1
      );
    }
  }

  removeVertex(vertex) {
    while (this.adjacencyList[vertex] && this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex.node);
    }
    delete this.adjacencyList[vertex];
  }

  /**
   * Dijkstra's Shortest Path algorithm with full step-by-step trace
   * @param {string|number} start - Starting vertex
   * @param {string|number} end - Goal vertex
   * @returns {{ path: Array, distance: number|null, distances: Object, previous: Object, trace: Array }}
   */
  dijkstraWithTrace(start, end) {
    const trace = [];
    let step = 1;

    if (!this.adjacencyList[start]) {
      trace.push({
        step: step++,
        type: 'error',
        currentNode: null,
        activeEdge: null,
        visitedNodes: [],
        frontierNodes: [],
        highlightPath: [],
        distances: {},
        message: `Start node "${start}" does not exist in the graph.`
      });
      return { path: [], distance: null, distances: {}, previous: {}, trace };
    }

    const distances = {};
    const previous = {};
    const pq = new MinHeap();
    const visited = new Set();

    // Initialize all distances to Infinity
    for (const vertex in this.adjacencyList) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;
    pq.enqueue(start, 0);

    trace.push({
      step: step++,
      type: 'init',
      currentNode: start,
      activeEdge: null,
      visitedNodes: [],
      frontierNodes: [start],
      highlightPath: [],
      distances: { ...distances },
      message: `Initialized distances. Set dist[${start}] = 0 and enqueued into priority queue.`
    });

    // Special case: start === end
    if (start === end) {
      trace.push({
        step: step++,
        type: 'goal_reached',
        currentNode: start,
        activeEdge: null,
        visitedNodes: [start],
        frontierNodes: [],
        highlightPath: [start],
        distances: { ...distances },
        message: `Start node is already the destination "${end}". Distance is 0.`
      });
      return { path: [start], distance: 0, distances, previous, trace };
    }

    let goalReached = false;

    while (!pq.isEmpty()) {
      const minNode = pq.dequeue();
      if (!minNode) break;
      const current = minNode.val;
      const currentDist = minNode.priority;

      // Stale entry check in MinHeap
      if (visited.has(current)) {
        trace.push({
          step: step++,
          type: 'stale_skip',
          currentNode: current,
          activeEdge: null,
          visitedNodes: Array.from(visited),
          frontierNodes: pq.heap.map(h => h.val),
          highlightPath: [],
          distances: { ...distances },
          message: `Extracted stale priority queue entry for node ${current} (dist: ${currentDist}); skipping.`
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
        frontierNodes: pq.heap.map(h => h.val),
        highlightPath: [],
        distances: { ...distances },
        message: `Extracted min-distance node ${current} (dist = ${distances[current]}).`
      });

      if (end != null && current === end) {
        goalReached = true;
        trace.push({
          step: step++,
          type: 'goal_reached',
          currentNode: current,
          activeEdge: null,
          visitedNodes: Array.from(visited),
          frontierNodes: pq.heap.map(h => h.val),
          highlightPath: [],
          distances: { ...distances },
          message: `Destination node ${end} reached with optimal distance ${distances[end]}!`
        });
        break;
      }

      const neighbors = this.adjacencyList[current] || [];
      for (const neighbor of neighbors) {
        const { node, weight } = neighbor;

        if (visited.has(node)) {
          trace.push({
            step: step++,
            type: 'already_visited',
            currentNode: current,
            activeEdge: { from: current, to: node, weight },
            visitedNodes: Array.from(visited),
            frontierNodes: pq.heap.map(h => h.val),
            highlightPath: [],
            distances: { ...distances },
            message: `Neighbor ${node} is already settled; skipping.`
          });
          continue;
        }

        const tentativeDist = distances[current] + weight;

        trace.push({
          step: step++,
          type: 'inspect_edge',
          currentNode: current,
          activeEdge: { from: current, to: node, weight },
          visitedNodes: Array.from(visited),
          frontierNodes: pq.heap.map(h => h.val),
          highlightPath: [],
          distances: { ...distances },
          message: `Inspecting edge (${current} → ${node}, w=${weight}). Tentative distance = ${tentativeDist}.`
        });

        if (tentativeDist < distances[node]) {
          const oldDist = distances[node];
          distances[node] = tentativeDist;
          previous[node] = current;
          pq.enqueue(node, tentativeDist);

          trace.push({
            step: step++,
            type: 'relax',
            currentNode: current,
            activeEdge: { from: current, to: node, weight },
            visitedNodes: Array.from(visited),
            frontierNodes: pq.heap.map(h => h.val),
            highlightPath: [],
            distances: { ...distances },
            message: `Relaxed edge: updated dist[${node}] from ${oldDist === Infinity ? '∞' : oldDist} to ${tentativeDist}.`
          });
        }
      }
    }

    // Reconstruct shortest path
    const path = [];
    if (end != null && distances[end] !== Infinity && (goalReached || previous[end] !== null || start === end)) {
      let curr = end;
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
      // Verify valid path starting at start
      if (path[0] !== start) {
        path.length = 0;
      }
    }

    if (path.length > 0) {
      trace.push({
        step: step++,
        type: 'path_found',
        currentNode: end,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [],
        highlightPath: path,
        distances: { ...distances },
        message: `Shortest path reconstructed: ${path.join(' → ')} (Total distance: ${distances[end]})`
      });
    } else if (end != null && distances[end] === Infinity) {
      trace.push({
        step: step++,
        type: 'unreachable',
        currentNode: null,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [],
        highlightPath: [],
        distances: { ...distances },
        message: `Destination node "${end}" is unreachable from "${start}".`
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
      distances: { ...distances },
      path,
      distance: (end != null && distances[end] !== Infinity) ? distances[end] : null,
      message: `Dijkstra execution finished. Settled ${visited.size} vertices.`
    });

    return {
      path,
      distance: (end != null && distances[end] !== Infinity) ? distances[end] : null,
      distances,
      previous,
      trace
    };
  }

  dijkstra(start, end) {
    const res = this.dijkstraWithTrace(start, end);
    return {
      path: res.path,
      distance: res.distance
    };
  }

  getAllShortestPaths(start) {
    const res = this.dijkstraWithTrace(start, null);
    return {
      distances: res.distances,
      previous: res.previous
    };
  }

  getAdjacencyList() {
    return { ...this.adjacencyList };
  }
}

// Re-export MinHeap for backward compatibility
export const PriorityQueue = MinHeap;

export const dijkstraPseudocode = `def dijkstra(graph, start, end):
  distances = {vertex: float('infinity') for vertex in graph}
  distances[start] = 0
  previous = {vertex: None for vertex in graph}
  pq = MinHeap()
  visited = set()
  
  pq.enqueue(start, 0)
  
  while not pq.isEmpty():
    current = pq.dequeue().val
    
    if current == end:
      break
    
    if current in visited:
      continue
    
    visited.add(current)
    
    for neighbor, weight in graph[current]:
      if neighbor in visited:
        continue
      
      distance = distances[current] + weight
      
      if distance < distances[neighbor]:
        distances[neighbor] = distance
        previous[neighbor] = current
        pq.enqueue(neighbor, distance)
  
  # Reconstruct path
  path = []
  current = end
  
  while current is not None:
    path.insert(0, current)
    current = previous[current]
  
  return path, distances[end]`;

export const dijkstraComplexity = {
  time: 'O((V + E) log V)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O((V + E) log V)',
  averageCase: 'O((V + E) log V)',
  worstCase: 'O((V + E) log V)'
};
