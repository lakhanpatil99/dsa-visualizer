export class DisjointSet {
  constructor(elements) {
    this.parent = {};
    this.rank = {};
    for (const elem of elements) {
      this.parent[elem] = elem;
      this.rank[elem] = 0;
    }
  }

  find(i) {
    if (this.parent[i] === undefined) {
      this.parent[i] = i;
      this.rank[i] = 0;
      return i;
    }
    if (this.parent[i] === i) {
      return i;
    }
    this.parent[i] = this.find(this.parent[i]); // Path compression
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) return false;

    // Union by rank
    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }
    return true;
  }
}

/**
 * Kruskal's Minimum Spanning Tree (MST) Algorithm
 * Supports connected and disconnected graphs (spanning forests),
 * cycle rejection tracing, and rank-based Disjoint-Set union.
 *
 * @param {Array<string>} vertices
 * @param {Array<{u: string, v: string, weight: number}>} edges
 * @returns {{ mst: Array, totalCost: number, isConnectedSpanningTree: boolean, trace: Array }}
 */
export function kruskalMST(vertices, edges) {
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(vertices);
  const mst = [];
  const trace = [];
  let totalCost = 0;
  let step = 1;

  trace.push({
    step: step++,
    type: 'init',
    currentNode: null,
    activeEdge: null,
    visitedNodes: [],
    frontierNodes: [],
    highlightPath: [],
    mstEdges: [],
    totalCost: 0,
    message: `Initialized DisjointSet with ${vertices.length} vertices. Sorted ${sortedEdges.length} edges by weight.`
  });

  for (const edge of sortedEdges) {
    const { u, v, weight } = edge;
    const rootU = dsu.find(u);
    const rootV = dsu.find(v);

    trace.push({
      step: step++,
      type: 'inspect_edge',
      currentNode: null,
      activeEdge: { from: u, to: v, weight },
      visitedNodes: Array.from(new Set(mst.flatMap(e => [e.u, e.v]))),
      frontierNodes: [],
      highlightPath: [],
      mstEdges: [...mst],
      totalCost,
      message: `Inspecting lowest-weight remaining edge (${u} — ${v}, w=${weight}). Sets: find(${u})=${rootU}, find(${v})=${rootV}.`
    });

    if (rootU !== rootV) {
      dsu.union(u, v);
      mst.push(edge);
      totalCost += weight;

      trace.push({
        step: step++,
        type: 'include_edge',
        currentNode: null,
        activeEdge: { from: u, to: v, weight },
        visitedNodes: Array.from(new Set(mst.flatMap(e => [e.u, e.v]))),
        frontierNodes: [],
        highlightPath: [],
        mstEdges: [...mst],
        totalCost,
        message: `Edge (${u} — ${v}, w=${weight}) connects disjoint components; added to MST! Current total cost = ${totalCost}.`
      });
    } else {
      trace.push({
        step: step++,
        type: 'skip_edge',
        currentNode: null,
        activeEdge: { from: u, to: v, weight },
        visitedNodes: Array.from(new Set(mst.flatMap(e => [e.u, e.v]))),
        frontierNodes: [],
        highlightPath: [],
        mstEdges: [...mst],
        totalCost,
        message: `Edge (${u} — ${v}, w=${weight}) rejected: ${u} and ${v} already in same component (would create cycle).`
      });
    }

    if (vertices.length > 0 && mst.length === vertices.length - 1) {
      trace.push({
        step: step++,
        type: 'early_exit',
        currentNode: null,
        activeEdge: null,
        visitedNodes: Array.from(new Set(mst.flatMap(e => [e.u, e.v]))),
        frontierNodes: [],
        highlightPath: [],
        mstEdges: [...mst],
        totalCost,
        message: `MST now contains |V| - 1 = ${mst.length} edges spanning all vertices; terminating.`
      });
      break;
    }
  }

  const isConnectedSpanningTree = vertices.length <= 1 || mst.length === vertices.length - 1;

  trace.push({
    step: step++,
    type: 'complete',
    currentNode: null,
    activeEdge: null,
    visitedNodes: Array.from(new Set(mst.flatMap(e => [e.u, e.v]))),
    frontierNodes: [],
    highlightPath: [],
    mstEdges: [...mst],
    totalCost,
    message: isConnectedSpanningTree
      ? `Kruskal MST complete! Selected ${mst.length} edges. Total minimum weight = ${totalCost}.`
      : `Kruskal Minimum Spanning Forest complete! Graph is disconnected (${mst.length} edges selected across components). Total weight = ${totalCost}.`
  });

  return { mst, totalCost, isConnectedSpanningTree, trace };
}

export const kruskalComplexity = {
  time: 'O(E log E)',
  space: 'O(V)',
  where: 'V = vertices, E = edges',
  bestCase: 'O(E log E)',
  averageCase: 'O(E log E)',
  worstCase: 'O(E log E)'
};
