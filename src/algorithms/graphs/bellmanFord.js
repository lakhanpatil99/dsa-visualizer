/**
 * Bellman-Ford Shortest Path Algorithm
 * Supports directed weighted graphs with negative edge weights,
 * negative-weight cycle detection, and step-by-step relaxation tracing.
 *
 * @param {Array<string>} vertices
 * @param {Array<{u: string, v: string, weight: number}>} edges
 * @param {string} source
 * @param {string} [destination=null]
 * @returns {{ distances: Object, previous: Object, path: Array, hasNegativeCycle: boolean, trace: Array }}
 */
export function bellmanFord(vertices, edges, source, destination = null) {
  const distances = {};
  const previous = {};
  const trace = [];
  let step = 1;

  for (const v of vertices) {
    distances[v] = Infinity;
    previous[v] = null;
  }

  if (!vertices.includes(source)) {
    trace.push({
      step: step++,
      type: 'error',
      currentNode: null,
      activeEdge: null,
      visitedNodes: [],
      frontierNodes: [],
      highlightPath: [],
      distances: {},
      message: `Source node "${source}" does not exist in graph vertices.`
    });
    return { distances, previous, path: [], hasNegativeCycle: false, trace };
  }

  distances[source] = 0;

  trace.push({
    step: step++,
    type: 'init',
    currentNode: source,
    activeEdge: null,
    visitedNodes: [source],
    frontierNodes: [],
    highlightPath: [],
    distances: { ...distances },
    message: `Initialized distances. Set dist[${source}] = 0 and all other vertices to ∞.`
  });

  const V = vertices.length;

  // Relax all edges |V| - 1 times
  for (let i = 1; i <= Math.max(1, V - 1); i++) {
    let updated = false;

    trace.push({
      step: step++,
      type: 'iteration_start',
      currentNode: null,
      activeEdge: null,
      visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
      frontierNodes: [],
      highlightPath: [],
      distances: { ...distances },
      iteration: i,
      message: `Starting Relaxation Pass ${i} of ${V - 1}.`
    });

    for (const edge of edges) {
      const { u, v, weight } = edge;

      if (distances[u] === Infinity) {
        // Vertex u is not yet reached
        continue;
      }

      const candidateDist = distances[u] + weight;

      trace.push({
        step: step++,
        type: 'inspect_edge',
        currentNode: u,
        activeEdge: { from: u, to: v, weight },
        visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
        frontierNodes: [],
        highlightPath: [],
        distances: { ...distances },
        iteration: i,
        message: `Pass ${i}: Testing edge (${u} → ${v}, w=${weight}). Current dist[${v}]=${distances[v] === Infinity ? '∞' : distances[v]}, candidate=${candidateDist}.`
      });

      if (candidateDist < distances[v]) {
        const oldDist = distances[v];
        distances[v] = candidateDist;
        previous[v] = u;
        updated = true;

        trace.push({
          step: step++,
          type: 'relax',
          currentNode: v,
          activeEdge: { from: u, to: v, weight },
          visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
          frontierNodes: [],
          highlightPath: [],
          distances: { ...distances },
          iteration: i,
          message: `Pass ${i}: Relaxed edge (${u} → ${v})! Updated dist[${v}] from ${oldDist === Infinity ? '∞' : oldDist} to ${candidateDist}.`
        });
      }
    }

    if (!updated) {
      trace.push({
        step: step++,
        type: 'early_exit',
        currentNode: null,
        activeEdge: null,
        visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
        frontierNodes: [],
        highlightPath: [],
        distances: { ...distances },
        iteration: i,
        message: `Pass ${i}: No distances improved; terminating early (optimal distances reached).`
      });
      break;
    }
  }

  // Check for negative-weight cycles
  let hasNegativeCycle = false;
  let cycleEdge = null;

  for (const edge of edges) {
    const { u, v, weight } = edge;
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      cycleEdge = edge;
      trace.push({
        step: step++,
        type: 'negative_cycle',
        currentNode: v,
        activeEdge: { from: u, to: v, weight },
        visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
        frontierNodes: [],
        highlightPath: [],
        distances: { ...distances },
        message: `Negative-weight cycle detected! Edge (${u} → ${v}, w=${weight}) can still be relaxed below ${distances[v]}.`
      });
      break;
    }
  }

  // Reconstruct path to destination if requested
  const path = [];
  if (!hasNegativeCycle && destination !== null && distances[destination] !== Infinity) {
    let curr = destination;
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }
    if (path[0] !== source) {
      path.length = 0;
    }
  }

  if (path.length > 0) {
    trace.push({
      step: step++,
      type: 'path_found',
      currentNode: destination,
      activeEdge: null,
      visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
      frontierNodes: [],
      highlightPath: path,
      distances: { ...distances },
      message: `Shortest path to ${destination} confirmed: ${path.join(' → ')} (Total distance: ${distances[destination]})`
    });
  }

  trace.push({
    step: step++,
    type: 'complete',
    currentNode: null,
    activeEdge: null,
    visitedNodes: Object.keys(distances).filter(k => distances[k] !== Infinity),
    frontierNodes: [],
    highlightPath: path,
    distances: { ...distances },
    hasNegativeCycle,
    path,
    message: hasNegativeCycle
      ? 'Bellman-Ford completed: Graph contains a negative-weight cycle reachable from source.'
      : `Bellman-Ford completed successfully. Found shortest paths from ${source}.`
  });

  return { distances, previous, path, hasNegativeCycle, trace };
}

export const bellmanFordComplexity = {
  time: 'O(V · E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(E)',
  averageCase: 'O(V · E)',
  worstCase: 'O(V · E)'
};
