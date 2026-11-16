export function topologicalSortKahn(vertices, edges) {
  const inDegree = {};
  const adj = {};
  const trace = [];

  for (const v of vertices) {
    inDegree[v] = 0;
    adj[v] = [];
  }

  for (const edge of edges) {
    const { u, v } = edge; // directed u -> v
    adj[u].push(v);
    inDegree[v] = (inDegree[v] || 0) + 1;
  }

  const queue = [];
  for (const v of vertices) {
    if (inDegree[v] === 0) {
      queue.push(v);
    }
  }

  const order = [];
  let step = 1;

  while (queue.length > 0) {
    const curr = queue.shift();
    order.push(curr);

    trace.push({
      step: step++,
      type: 'enqueue_order',
      node: curr,
      inDegree: { ...inDegree },
      order: [...order],
      message: `Node ${curr} has in-degree 0; appended to topological order.`
    });

    for (const neighbor of adj[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  const hasCycle = order.length !== vertices.length;

  return {
    order: hasCycle ? [] : order,
    hasCycle,
    trace
  };
}

export const topologicalSortComplexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)'
};
