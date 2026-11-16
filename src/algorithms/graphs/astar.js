import { MinHeap } from './MinHeap.js';

export function aStarSearch(nodes, edges, startId, goalId) {
  const adj = {};
  for (const node of nodes) {
    adj[node.id] = [];
  }
  for (const edge of edges) {
    adj[edge.u].push({ v: edge.v, weight: edge.weight });
    adj[edge.v].push({ v: edge.u, weight: edge.weight }); // undirected
  }

  const nodeMap = {};
  for (const node of nodes) {
    nodeMap[node.id] = node;
  }

  // Euclidean distance heuristic
  const heuristic = (id1, id2) => {
    const n1 = nodeMap[id1];
    const n2 = nodeMap[id2];
    if (!n1 || !n2 || n1.x == null || n2.x == null) return 0;
    const dx = n1.x - n2.x;
    const dy = n1.y - n2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  const openSet = new MinHeap();
  const visited = new Set();
  const trace = [];

  for (const node of nodes) {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
  }

  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, goalId);
  openSet.enqueue(startId, fScore[startId]);

  let step = 1;

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue().val;

    trace.push({
      step: step++,
      type: 'visit',
      currentNode: current,
      gScore: gScore[current],
      fScore: fScore[current],
      message: `Examining node ${current} with fScore = ${fScore[current].toFixed(1)}`
    });

    if (current === goalId) {
      const path = [];
      let curr = goalId;
      while (curr) {
        path.unshift(curr);
        curr = cameFrom[curr];
      }
      return { path, distance: gScore[goalId], trace };
    }

    visited.add(current);

    for (const neighbor of adj[current]) {
      const next = neighbor.v;
      if (visited.has(next)) continue;

      const tentative_g = gScore[current] + neighbor.weight;

      if (tentative_g < gScore[next]) {
        cameFrom[next] = current;
        gScore[next] = tentative_g;
        fScore[next] = tentative_g + heuristic(next, goalId);
        openSet.enqueue(next, fScore[next]);

        trace.push({
          step: step++,
          type: 'relax',
          from: current,
          to: next,
          weight: neighbor.weight,
          tentative_g,
          fScore: fScore[next],
          message: `Relaxed edge ${current} -> ${next}, gScore = ${tentative_g}`
        });
      }
    }
  }

  return { path: [], distance: null, trace };
}

export const aStarComplexity = {
  time: 'O(E log V)',
  space: 'O(V)',
  bestCase: 'O(E)',
  averageCase: 'O(E log V)',
  worstCase: 'O(b^d)'
};
