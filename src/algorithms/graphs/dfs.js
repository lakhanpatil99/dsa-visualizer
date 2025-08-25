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

  depthFirstSearch(start) {
    if (!this.adjacencyList[start]) {
      return []; // Return empty array if start node doesn't exist
    }
    
    const result = [];
    const visited = {};
    
    const dfs = (vertex) => {
      if (!vertex || visited[vertex]) return;
      visited[vertex] = true;
      result.push(vertex);
      
      if (this.adjacencyList[vertex]) {
        this.adjacencyList[vertex].forEach(neighbor => {
          if (!visited[neighbor]) {
            dfs(neighbor);
          }
        });
      }
    };
    
    dfs(start);
    return result;
  }

  depthFirstSearchIterative(start) {
    if (!this.adjacencyList[start]) {
      return []; // Return empty array if start node doesn't exist
    }
    
    const stack = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    
    while (stack.length) {
      const currentVertex = stack.pop();
      result.push(currentVertex);
      
      if (this.adjacencyList[currentVertex]) {
        this.adjacencyList[currentVertex].forEach(neighbor => {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            stack.push(neighbor);
          }
        });
      }
    }
    
    return result;
  }

  depthFirstSearchWithPath(start, end) {
    const visited = new Set();
    
    const dfs = (current, path) => {
      if (current === end) {
        return path;
      }
      
      if (visited.has(current)) {
        return null;
      }
      
      visited.add(current);
      
      for (const neighbor of this.adjacencyList[current] || []) {
        const result = dfs(neighbor, [...path, neighbor]);
        if (result) {
          return result;
        }
      }
      
      return null;
    };
    
    return dfs(start, [start]);
  }

  hasCycle() {
    const visited = new Set();
    const recStack = new Set();
    
    const hasCycleDFS = (vertex) => {
      if (recStack.has(vertex)) {
        return true;
      }
      
      if (visited.has(vertex)) {
        return false;
      }
      
      visited.add(vertex);
      recStack.add(vertex);
      
      for (const neighbor of this.adjacencyList[vertex] || []) {
        if (hasCycleDFS(neighbor)) {
          return true;
        }
      }
      
      recStack.delete(vertex);
      return false;
    };
    
    for (const vertex in this.adjacencyList) {
      if (hasCycleDFS(vertex)) {
        return true;
      }
    }
    
    return false;
  }

  getAdjacencyList() {
    return { ...this.adjacencyList };
  }
}

export const dfsPseudocode = `def depthFirstSearch(graph, start):
  result = []
  visited = {}
  
  def dfs(vertex):
    if not vertex:
      return None
    visited[vertex] = True
    result.append(vertex)
    
    for neighbor in graph[vertex]:
      if neighbor not in visited:
        dfs(neighbor)
  
  dfs(start)
  return result

def dfsIterative(graph, start):
  stack = [start]
  result = []
  visited = {start: True}
  
  while stack:
    currentVertex = stack.pop()
    result.append(currentVertex)
    
    for neighbor in graph[currentVertex]:
      if neighbor not in visited:
        visited[neighbor] = True
        stack.append(neighbor)
  
  return result

def dfsWithPath(graph, start, end):
  visited = set()
  
  def dfs(current, path):
    if current == end:
      return path
    
    if current in visited:
      return None
    
    visited.add(current)
    
    for neighbor in graph[current]:
      result = dfs(neighbor, path + [neighbor])
      if result:
        return result
    
    return None
  
  return dfs(start, [start])`;

export const dfsComplexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)'
};
