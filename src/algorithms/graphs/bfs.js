export class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList[vertex2]) {
      this.addVertex(vertex2);
    }
    
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1); // For undirected graph
  }

  removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      v => v !== vertex2
    );
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      v => v !== vertex1
    );
  }

  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }

  breadthFirstSearch(start) {
    if (!this.adjacencyList[start]) {
      return []; // Return empty array if start node doesn't exist
    }
    
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    let currentVertex;

    while (queue.length) {
      currentVertex = queue.shift();
      result.push(currentVertex);

      if (this.adjacencyList[currentVertex]) {
        this.adjacencyList[currentVertex].forEach(neighbor => {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        });
      }
    }

    return result;
  }

  breadthFirstSearchWithPath(start, end) {
    const queue = [[start, [start]]];
    const visited = new Set();
    
    while (queue.length > 0) {
      const [current, path] = queue.shift();
      
      if (current === end) {
        return path;
      }
      
      if (!visited.has(current)) {
        visited.add(current);
        
        for (const neighbor of this.adjacencyList[current] || []) {
          if (!visited.has(neighbor)) {
            queue.push([neighbor, [...path, neighbor]]);
          }
        }
      }
    }
    
    return null; // No path found
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
  
  return result

def bfsWithPath(graph, start, end):
  queue = [(start, [start])]
  visited = set()
  
  while queue:
    current, path = queue.pop(0)
    
    if current == end:
      return path
    
    if current not in visited:
      visited.add(current)
      
      for neighbor in graph[current]:
        if neighbor not in visited:
          queue.append((neighbor, path + [neighbor]))
  
  return None`;

export const bfsComplexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)'
};
