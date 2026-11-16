/**
 * Breadth-First Search (BFS) Implementation & Trace Generator
 * Supports directed/undirected graphs, level-by-level queue frontier tracking,
 * cycle avoidance, and path reconstruction.
 */

export class Graph {
  constructor(isDirected = false) {
    this.adjacencyList = {};
    this.isDirected = isDirected;
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, isDirected = this.isDirected) {
    if (!this.adjacencyList[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList[vertex2]) {
      this.addVertex(vertex2);
    }
    
    if (!this.adjacencyList[vertex1].includes(vertex2)) {
      this.adjacencyList[vertex1].push(vertex2);
    }
    if (!isDirected && !this.adjacencyList[vertex2].includes(vertex1)) {
      this.adjacencyList[vertex2].push(vertex1);
    }
  }

  removeEdge(vertex1, vertex2) {
    if (this.adjacencyList[vertex1]) {
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(v => v !== vertex2);
    }
    if (!this.isDirected && this.adjacencyList[vertex2]) {
      this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(v => v !== vertex1);
    }
  }

  removeVertex(vertex) {
    while (this.adjacencyList[vertex] && this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }

  /**
   * Breadth-First Search traversal
   * @param {string|number} start - Starting vertex
   * @returns {Array} Traversal order
   */
  breadthFirstSearch(start) {
    if (!this.adjacencyList[start]) {
      return [];
    }
    
    const queue = [start];
    const result = [];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const currentVertex = queue.shift();
      result.push(currentVertex);

      if (this.adjacencyList[currentVertex]) {
        for (const neighbor of this.adjacencyList[currentVertex]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    return result;
  }

  /**
   * Alias for breadthFirstSearch
   */
  bfs(start) {
    return this.breadthFirstSearch(start);
  }

  /**
   * Breadth-First Search with full step-by-step execution trace
   * @param {string|number} start - Starting vertex
   * @param {string|number} [end=null] - Optional destination vertex
   * @returns {{ order: Array, path: Array|null, trace: Array }}
   */
  breadthFirstSearchWithTrace(start, end = null) {
    if (!this.adjacencyList[start]) {
      return {
        order: [],
        path: null,
        trace: [{
          step: 1,
          type: 'error',
          currentNode: null,
          activeEdge: null,
          visitedNodes: [],
          frontierNodes: [],
          highlightPath: [],
          message: `Start node "${start}" does not exist in the graph.`
        }]
      };
    }

    const queue = [start];
    const order = [];
    const visited = new Set([start]);
    const parentMap = { [start]: null };
    const trace = [];
    let step = 1;

    trace.push({
      step: step++,
      type: 'enqueue',
      currentNode: start,
      activeEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: [...queue],
      highlightPath: [],
      message: `Enqueued start node ${start} into BFS frontier.`
    });

    let foundEnd = false;

    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);

      trace.push({
        step: step++,
        type: 'visit',
        currentNode: current,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [...queue],
        highlightPath: [],
        message: `Dequeued and visiting node ${current}.`
      });

      if (end !== null && current === end) {
        foundEnd = true;
        break;
      }

      const neighbors = this.adjacencyList[current] || [];
      for (const neighbor of neighbors) {
        trace.push({
          step: step++,
          type: 'inspect_edge',
          currentNode: current,
          activeEdge: { from: current, to: neighbor },
          visitedNodes: Array.from(visited),
          frontierNodes: [...queue],
          highlightPath: [],
          message: `Inspecting edge (${current} → ${neighbor}).`
        });

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap[neighbor] = current;
          queue.push(neighbor);

          trace.push({
            step: step++,
            type: 'enqueue',
            currentNode: neighbor,
            activeEdge: { from: current, to: neighbor },
            visitedNodes: Array.from(visited),
            frontierNodes: [...queue],
            highlightPath: [],
            message: `Discovered unvisited neighbor ${neighbor}; added to queue.`
          });
        } else {
          trace.push({
            step: step++,
            type: 'already_visited',
            currentNode: current,
            activeEdge: { from: current, to: neighbor },
            visitedNodes: Array.from(visited),
            frontierNodes: [...queue],
            highlightPath: [],
            message: `Neighbor ${neighbor} is already discovered; skipping.`
          });
        }
      }
    }

    let path = null;
    if (end !== null && foundEnd) {
      path = [];
      let curr = end;
      while (curr !== null) {
        path.unshift(curr);
        curr = parentMap[curr];
      }
      trace.push({
        step: step++,
        type: 'path_found',
        currentNode: end,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [],
        highlightPath: path,
        message: `BFS shortest hop path to ${end} found: ${path.join(' → ')}`
      });
    }

    trace.push({
      step: step++,
      type: 'complete',
      currentNode: null,
      activeEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: [],
      highlightPath: path || [],
      order,
      path,
      message: `BFS traversal completed. Explored ${order.length} nodes.`
    });

    return { order, path, trace };
  }

  bfsWithTrace(start, end = null) {
    return this.breadthFirstSearchWithTrace(start, end);
  }

  breadthFirstSearchWithPath(start, end) {
    if (!this.adjacencyList[start] || !this.adjacencyList[end]) {
      return null;
    }
    const res = this.breadthFirstSearchWithTrace(start, end);
    return res.path;
  }

  bfsWithPath(start, end) {
    return this.breadthFirstSearchWithPath(start, end);
  }

  getAdjacencyList() {
    return { ...this.adjacencyList };
  }
}

export const bfsPseudocode = `def breadthFirstSearch(graph, start):
  queue = [start]
  result = []
  visited = {start: True}
  
  while queue:
    currentVertex = queue.pop(0)
    result.append(currentVertex)
    
    for neighbor in graph[currentVertex]:
      if neighbor not in visited:
        visited[neighbor] = True
        queue.append(neighbor)
  
  return result`;

export const bfsComplexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)'
};
