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
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      v => v.node !== vertex2
    );
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      v => v.node !== vertex1
    );
  }

  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex.node);
    }
    delete this.adjacencyList[vertex];
  }

  dijkstra(start, end) {
    if (!this.adjacencyList[start] || !this.adjacencyList[end]) {
      return { path: [], distance: null }; // Return empty result if start or end node doesn't exist
    }
    
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    const visited = new Set();
    
    // Initialize distances
    for (const vertex in this.adjacencyList) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;
    
    pq.enqueue(start, 0);
    
    while (pq.values.length > 0) {
      const current = pq.dequeue().val;
      
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
      path: path.length > 1 ? path : [],
      distance: distances[end] === Infinity ? null : distances[end]
    };
  }

  getAllShortestPaths(start) {
    if (!this.adjacencyList[start]) {
      return { distances: {}, previous: {} }; // Return empty result if start node doesn't exist
    }
    
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    const visited = new Set();
    
    // Initialize distances
    for (const vertex in this.adjacencyList) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;
    
    pq.enqueue(start, 0);
    
    while (pq.values.length > 0) {
      const current = pq.dequeue().val;
      
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

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

export const dijkstraPseudocode = `def dijkstra(graph, start, end):
  distances = {vertex: float('infinity') for vertex in graph}
  distances[start] = 0
  previous = {vertex: None for vertex in graph}
  pq = PriorityQueue()
  visited = set()
  
  pq.enqueue(start, 0)
  
  while pq:
    current = pq.dequeue()
    
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
