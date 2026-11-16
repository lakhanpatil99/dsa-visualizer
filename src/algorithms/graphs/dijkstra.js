import { MinHeap } from './MinHeap.js';

export class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight) {
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
    this.adjacencyList[vertex2].push({ node: vertex1, weight }); // For undirected graph
  }

  removeEdge(vertex1, vertex2) {
    if (this.adjacencyList[vertex1]) {
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
        v => v.node !== vertex2
      );
    }
    if (this.adjacencyList[vertex2]) {
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

  dijkstra(start, end) {
    if (!this.adjacencyList[start] || !this.adjacencyList[end]) {
      return { path: [], distance: null };
    }
    
    const distances = {};
    const previous = {};
    const pq = new MinHeap();
    const visited = new Set();
    
    // Initialize distances
    for (const vertex in this.adjacencyList) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;
    
    pq.enqueue(start, 0);
    
    while (!pq.isEmpty()) {
      const minNode = pq.dequeue();
      if (!minNode) break;
      const current = minNode.val;
      
      if (current === end) {
        break;
      }
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      
      if (this.adjacencyList[current]) {
        for (const neighbor of this.adjacencyList[current]) {
          const { node, weight } = neighbor;
          
          if (visited.has(node)) {
            continue;
          }
          
          const distance = distances[current] + weight;
          
          if (distance < distances[node]) {
            distances[node] = distance;
            previous[node] = current;
            pq.enqueue(node, distance);
          }
        }
      }
    }
    
    // Reconstruct path
    const path = [];
    let current = end;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return {
      path: path.length > 0 && path[0] === start ? path : [],
      distance: distances[end] === Infinity ? null : distances[end]
    };
  }

  getAllShortestPaths(start) {
    if (!this.adjacencyList[start]) {
      return { distances: {}, previous: {} };
    }
    
    const distances = {};
    const previous = {};
    const pq = new MinHeap();
    const visited = new Set();
    
    for (const vertex in this.adjacencyList) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;
    
    pq.enqueue(start, 0);
    
    while (!pq.isEmpty()) {
      const minNode = pq.dequeue();
      if (!minNode) break;
      const current = minNode.val;
      
      if (visited.has(current)) {
        continue;
      }
      
      visited.add(current);
      
      if (this.adjacencyList[current]) {
        for (const neighbor of this.adjacencyList[current]) {
          const { node, weight } = neighbor;
          
          if (visited.has(node)) {
            continue;
          }
          
          const distance = distances[current] + weight;
          
          if (distance < distances[node]) {
            distances[node] = distance;
            previous[node] = current;
            pq.enqueue(node, distance);
          }
        }
      }
    }
    
    return { distances, previous };
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
