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

export function kruskalMST(vertices, edges) {
  // Sort edges ascending by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const dsu = new DisjointSet(vertices);
  const mst = [];
  const trace = [];
  let totalCost = 0;
  let step = 1;

  for (const edge of sortedEdges) {
    const { u, v, weight } = edge;
    const rootU = dsu.find(u);
    const rootV = dsu.find(v);

    if (rootU !== rootV) {
      dsu.union(u, v);
      mst.push(edge);
      totalCost += weight;

      trace.push({
        step: step++,
        type: 'include_edge',
        edge,
        message: `Edge (${u} - ${v}, w=${weight}) added to MST. Current total cost = ${totalCost}`
      });
    } else {
      trace.push({
        step: step++,
        type: 'skip_edge',
        edge,
        message: `Edge (${u} - ${v}, w=${weight}) rejected: creates cycle.`
      });
    }

    if (mst.length === vertices.length - 1) {
      break;
    }
  }

  return { mst, totalCost, trace };
}

export const kruskalComplexity = {
  time: 'O(E log E)',
  space: 'O(V)',
  bestCase: 'O(E log E)',
  averageCase: 'O(E log E)',
  worstCase: 'O(E log E)'
};
