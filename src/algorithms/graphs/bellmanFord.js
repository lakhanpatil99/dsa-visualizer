export function bellmanFord(vertices, edges, source) {
  const distances = {};
  const previous = {};
  const trace = [];

  for (const v of vertices) {
    distances[v] = Infinity;
    previous[v] = null;
  }
  distances[source] = 0;

  const V = vertices.length;
  let step = 1;

  // Relax edges |V| - 1 times
  for (let i = 1; i <= V - 1; i++) {
    let updated = false;
    for (const edge of edges) {
      const { u, v, weight } = edge;
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        previous[v] = u;
        updated = true;

        trace.push({
          step: step++,
          iteration: i,
          type: 'relax',
          u,
          v,
          weight,
          newDist: distances[v],
          message: `Iteration ${i}: Relaxed edge (${u} -> ${v}, w=${weight}), new dist[${v}] = ${distances[v]}`
        });
      }
    }
    if (!updated) break; // Early termination if no relaxations occurred
  }

  // Check for negative-weight cycles
  let hasNegativeCycle = false;
  for (const edge of edges) {
    const { u, v, weight } = edge;
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      trace.push({
        step: step++,
        type: 'negative_cycle',
        u,
        v,
        weight,
        message: `Negative-weight cycle detected via edge (${u} -> ${v})!`
      });
      break;
    }
  }

  return { distances, previous, hasNegativeCycle, trace };
}

export const bellmanFordComplexity = {
  time: 'O(V · E)',
  space: 'O(V)',
  bestCase: 'O(E)',
  averageCase: 'O(V · E)',
  worstCase: 'O(V · E)'
};
