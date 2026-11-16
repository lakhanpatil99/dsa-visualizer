/**
 * Topological Sort (Kahn's In-Degree Algorithm)
 * Operates on directed graphs (DAGs), dynamically tracks in-degrees,
 * detects cycles, and generates step-by-step queue and order events.
 *
 * @param {Array<string>} vertices
 * @param {Array<{u: string, v: string}>} edges - Directed edges u -> v
 * @returns {{ order: Array, hasCycle: boolean, trace: Array }}
 */
export function topologicalSortKahn(vertices, edges) {
  const inDegree = {};
  const adj = {};
  const trace = [];
  let step = 1;

  for (const v of vertices) {
    inDegree[v] = 0;
    adj[v] = [];
  }

  for (const edge of edges) {
    const { u, v } = edge; // directed u -> v
    if (adj[u]) {
      adj[u].push(v);
    }
    if (inDegree[v] !== undefined) {
      inDegree[v]++;
    }
  }

  const queue = [];
  for (const v of vertices) {
    if (inDegree[v] === 0) {
      queue.push(v);
    }
  }

  trace.push({
    step: step++,
    type: 'init',
    currentNode: null,
    activeEdge: null,
    visitedNodes: [],
    frontierNodes: [...queue],
    highlightPath: [],
    inDegree: { ...inDegree },
    order: [],
    message: `Computed in-degrees for all ${vertices.length} vertices. Enqueued ${queue.length} source node(s) with in-degree 0: [${queue.join(', ')}].`
  });

  const order = [];

  while (queue.length > 0) {
    const curr = queue.shift();
    order.push(curr);

    trace.push({
      step: step++,
      type: 'visit',
      currentNode: curr,
      activeEdge: null,
      visitedNodes: [...order],
      frontierNodes: [...queue],
      highlightPath: [...order],
      inDegree: { ...inDegree },
      order: [...order],
      message: `Dequeued vertex ${curr} (in-degree 0); appended to topological ordering.`
    });

    const neighbors = adj[curr] || [];
    for (const neighbor of neighbors) {
      inDegree[neighbor]--;

      trace.push({
        step: step++,
        type: 'inspect_edge',
        currentNode: curr,
        activeEdge: { from: curr, to: neighbor },
        visitedNodes: [...order],
        frontierNodes: [...queue],
        highlightPath: [...order],
        inDegree: { ...inDegree },
        order: [...order],
        message: `Removed directed edge (${curr} → ${neighbor}); in-degree of ${neighbor} decremented to ${inDegree[neighbor]}.`
      });

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);

        trace.push({
          step: step++,
          type: 'enqueue',
          currentNode: neighbor,
          activeEdge: { from: curr, to: neighbor },
          visitedNodes: [...order],
          frontierNodes: [...queue],
          highlightPath: [...order],
          inDegree: { ...inDegree },
          order: [...order],
          message: `Vertex ${neighbor} has reached in-degree 0; enqueued to processing frontier.`
        });
      }
    }
  }

  const hasCycle = order.length !== vertices.length;

  if (hasCycle) {
    trace.push({
      step: step++,
      type: 'cycle_detected',
      currentNode: null,
      activeEdge: null,
      visitedNodes: [...order],
      frontierNodes: [],
      highlightPath: [],
      inDegree: { ...inDegree },
      order: [],
      message: `Cycle detected! Only ${order.length} of ${vertices.length} vertices could be resolved. Graph is not a DAG (Directed Acyclic Graph).`
    });
  }

  trace.push({
    step: step++,
    type: 'complete',
    currentNode: null,
    activeEdge: null,
    visitedNodes: hasCycle ? [] : [...order],
    frontierNodes: [],
    highlightPath: hasCycle ? [] : [...order],
    inDegree: { ...inDegree },
    order: hasCycle ? [] : order,
    hasCycle,
    message: hasCycle
      ? 'Topological sort failed due to cycle presence in directed graph.'
      : `Topological ordering resolved successfully: ${order.join(' → ')}`
  });

  return {
    order: hasCycle ? [] : order,
    hasCycle,
    trace
  };
}

export const topologicalSortComplexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)'
};
