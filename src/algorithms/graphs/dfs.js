/**
 * Depth-First Search (DFS) Implementation & Trace Generator
 * Supports recursive and iterative traversals, recursion call stack tracking,
 * cycle avoidance, backtracking steps, and path reconstruction.
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
   * Recursive Depth-First Search traversal
   * @param {string|number} start - Starting vertex
   * @returns {Array} Traversal order
   */
  depthFirstSearch(start) {
    if (!this.adjacencyList[start]) {
      return [];
    }
    
    const result = [];
    const visited = new Set();
    
    const dfs = (vertex) => {
      if (!vertex || visited.has(vertex)) return;
      visited.add(vertex);
      result.push(vertex);
      
      const neighbors = this.adjacencyList[vertex] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };
    
    dfs(start);
    return result;
  }

  /**
   * Canonical alias for depthFirstSearch
   */
  dfs(start) {
    return this.depthFirstSearch(start);
  }

  /**
   * Iterative Depth-First Search traversal
   * @param {string|number} start - Starting vertex
   * @returns {Array} Traversal order
   */
  depthFirstSearchIterative(start) {
    if (!this.adjacencyList[start]) {
      return [];
    }
    
    const stack = [start];
    const result = [];
    const visited = new Set([start]);
    
    while (stack.length > 0) {
      const currentVertex = stack.pop();
      result.push(currentVertex);
      
      const neighbors = this.adjacencyList[currentVertex] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }
    
    return result;
  }

  dfsIterative(start) {
    return this.depthFirstSearchIterative(start);
  }

  /**
   * Depth-First Search with full execution trace for interactive step visualization
   * @param {string|number} start - Starting vertex
   * @param {string|number} [end=null] - Optional destination vertex
   * @returns {{ order: Array, path: Array|null, trace: Array }}
   */
  depthFirstSearchWithTrace(start, end = null) {
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

    const order = [];
    const visited = new Set();
    const callStack = [];
    const trace = [];
    let step = 1;
    let foundEnd = false;
    let finalPath = null;

    const dfs = (vertex, currentPath = []) => {
      if (!vertex || visited.has(vertex) || foundEnd) return;

      visited.add(vertex);
      order.push(vertex);
      callStack.push(vertex);
      const newPath = [...currentPath, vertex];

      trace.push({
        step: step++,
        type: 'visit',
        currentNode: vertex,
        activeEdge: callStack.length > 1 ? { from: callStack[callStack.length - 2], to: vertex } : null,
        visitedNodes: Array.from(visited),
        frontierNodes: [...callStack],
        highlightPath: newPath,
        callStack: [...callStack],
        message: `Visiting ${vertex}; pushed to call stack (depth: ${callStack.length}).`
      });

      if (end !== null && vertex === end) {
        foundEnd = true;
        finalPath = newPath;
        trace.push({
          step: step++,
          type: 'path_found',
          currentNode: vertex,
          activeEdge: null,
          visitedNodes: Array.from(visited),
          frontierNodes: [...callStack],
          highlightPath: finalPath,
          path: finalPath,
          message: `Target ${end} reached via DFS path: ${finalPath.join(' → ')}`
        });
        return;
      }

      const neighbors = this.adjacencyList[vertex] || [];
      for (const neighbor of neighbors) {
        if (foundEnd) break;

        trace.push({
          step: step++,
          type: 'inspect_edge',
          currentNode: vertex,
          activeEdge: { from: vertex, to: neighbor },
          visitedNodes: Array.from(visited),
          frontierNodes: [...callStack],
          highlightPath: newPath,
          message: `Exploring branch from ${vertex} to ${neighbor}.`
        });

        if (!visited.has(neighbor)) {
          dfs(neighbor, newPath);
        } else {
          trace.push({
            step: step++,
            type: 'already_visited',
            currentNode: vertex,
            activeEdge: { from: vertex, to: neighbor },
            visitedNodes: Array.from(visited),
            frontierNodes: [...callStack],
            highlightPath: newPath,
            message: `Neighbor ${neighbor} is already visited; skipping back.`
          });
        }
      }

      callStack.pop();
      trace.push({
        step: step++,
        type: 'backtrack',
        currentNode: vertex,
        activeEdge: null,
        visitedNodes: Array.from(visited),
        frontierNodes: [...callStack],
        highlightPath: callStack,
        callStack: [...callStack],
        message: `Exiting call frame for ${vertex}; backtracking.`
      });
    };

    dfs(start);

    trace.push({
      step: step++,
      type: 'complete',
      currentNode: null,
      activeEdge: null,
      visitedNodes: Array.from(visited),
      frontierNodes: [],
      highlightPath: finalPath || [],
      order,
      path: finalPath,
      message: `DFS traversal complete. Explored ${order.length} nodes.`
    });

    return { order, path: finalPath, trace };
  }

  dfsWithTrace(start, end = null) {
    return this.depthFirstSearchWithTrace(start, end);
  }

  depthFirstSearchWithPath(start, end) {
    if (!this.adjacencyList[start] || !this.adjacencyList[end]) {
      return null;
    }
    const res = this.depthFirstSearchWithTrace(start, end);
    return res.path;
  }

  dfsWithPath(start, end) {
    return this.depthFirstSearchWithPath(start, end);
  }

  hasCycle() {
    const visited = new Set();
    const recStack = new Set();
    
    const hasCycleDFS = (vertex, parent = null) => {
      visited.add(vertex);
      recStack.add(vertex);
      
      for (const neighbor of this.adjacencyList[vertex] || []) {
        if (!visited.has(neighbor)) {
          if (hasCycleDFS(neighbor, vertex)) {
            return true;
          }
        } else if (this.isDirected ? recStack.has(neighbor) : neighbor !== parent) {
          return true;
        }
      }
      
      recStack.delete(vertex);
      return false;
    };
    
    for (const vertex in this.adjacencyList) {
      if (!visited.has(vertex)) {
        if (hasCycleDFS(vertex, null)) {
          return true;
        }
      }
    }
    
    return false;
  }

  isConnected() {
    const vertices = Object.keys(this.adjacencyList);
    if (vertices.length === 0) return true;
    
    const visited = this.depthFirstSearch(vertices[0]);
    return visited.length === vertices.length;
  }

  findConnectedComponents() {
    const visited = new Set();
    const components = [];
    
    for (const vertex in this.adjacencyList) {
      if (!visited.has(vertex)) {
        const component = [];
        
        const dfs = (v) => {
          visited.add(v);
          component.push(v);
          
          for (const neighbor of this.adjacencyList[v] || []) {
            if (!visited.has(neighbor)) {
              dfs(neighbor);
            }
          }
        };
        
        dfs(vertex);
        components.push(component);
      }
    }
    
    return components;
  }

  getAdjacencyList() {
    return { ...this.adjacencyList };
  }
}

export const dfsPseudocode = `def depthFirstSearch(graph, start):
  result = []
  visited = {}
  
  def dfs(vertex):
    if not vertex or vertex in visited:
      return
    visited[vertex] = True
    result.append(vertex)
    
    for neighbor in graph[vertex]:
      if neighbor not in visited:
        dfs(neighbor)
        
  dfs(start)
  return result`;

export const dfsComplexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)'
};
