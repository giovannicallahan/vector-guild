/* Independent oracles for Graph theory: networks practice missions, file 3 of 8: q11b–q15d (game/realms/graph/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const BIG = 1e6;

/* Grid of m blocks wide and k blocks deep: junctions (i, j), 0 <= i <= m, 0 <= j <= k; west-east roads cost a, south-north roads cost b.
   Degree of every junction by counting its neighbours. */
function gridDegree(m, k, i, j) { let d = 0; if (i > 0) d++; if (i < m) d++; if (j > 0) d++; if (j < k) d++; return d; }
function gridTotals(m, k, a, b) {
  let deg = 0, dist = 0, corners = 0;
  for (let j = 0; j <= k; j++) for (let i = 0; i <= m; i++) {
    corners++; deg += gridDegree(m, k, i, j);
    if (i < m) dist += a;       /* the road to the east of this corner */
    if (j < k) dist += b;       /* the road to the north of this corner */
  }
  return { corners, roads: deg / 2, dist };
}
/* Cheapest set of roads to repeat so every corner has an even number of roads (each repeated at most once):
   a broken-profile search over the grid, corner by corner, row by row. State: which corners of the row below
   send a repeated road up into this row (bit mask), and whether the corner to the west sends one east.
   cost of a repeated west-east road is wc, of a south-north road is sc. Returns the least total cost. */
function cheapestRepeats(m, k, wc, sc) {
  const W = m + 1;
  let cur = new Map(); cur.set(0, 0);   /* key = mask * 2 + left */
  for (let j = 0; j <= k; j++) for (let i = 0; i <= m; i++) {
    const need = gridDegree(m, k, i, j) % 2, next = new Map();
    for (const [key, cost] of cur) {
      const left = key & 1, mask = key >> 1, down = (mask >> i) & 1;
      for (let r = 0; r <= (i < m ? 1 : 0); r++) for (let u = 0; u <= (j < k ? 1 : 0); u++) {
        if (((down + left + r + u) & 1) !== need) continue;
        const nm = (mask & ~(1 << i)) | (u << i), nk = nm * 2 + r, c = cost + r * wc + u * sc;
        if (!next.has(nk) || next.get(nk) > c) next.set(nk, c);
      }
    }
    cur = next;
  }
  return cur.get(0);
}
/* Fewest repeated roads first, then least extra distance among those: returns { count, extra }. */
function repeatsCountFirst(m, k, a, b) {
  const c = cheapestRepeats(m, k, BIG + a, BIG + b), count = Math.round(c / BIG);
  return { count, extra: c - count * BIG };
}
function repeatsDistFirst(m, k, a, b) {
  const extra = cheapestRepeats(m, k, a, b);
  return { extra };
}

/* Number of spanning trees by the matrix-tree rule: any one cofactor of the Laplacian (graph given as an edge list on nodes 0..n-1). */
function spanningTrees(n, edges) {
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [u, v] of edges) { L[u][u]++; L[v][v]++; L[u][v]--; L[v][u]--; }
  const M = L.slice(1).map(row => row.slice(1)), s = n - 1;
  let det = 1;
  for (let c = 0; c < s; c++) {
    let piv = c; for (let r = c + 1; r < s; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (Math.abs(M[piv][c]) < 1e-12) return 0;
    if (piv !== c) { [M[piv], M[c]] = [M[c], M[piv]]; det = -det; }
    det *= M[c][c];
    for (let r = c + 1; r < s; r++) { const f = M[r][c] / M[c][c]; for (let q = c; q < s; q++) M[r][q] -= f * M[c][q]; }
  }
  return Math.round(det);
}
const cycleEdges = n => Array.from({ length: n }, (_, i) => [i, (i + 1) % n]);
/* Two stations (nodes 0 and 1) joined by pipelines of the given numbers of pipes, meeting only at the stations. */
function thetaGraph(lengths) {
  let n = 2; const edges = [];
  for (const len of lengths) {
    let prev = 0;
    for (let t = 1; t < len; t++) { edges.push([prev, n]); prev = n; n++; }
    edges.push([prev, 1]);
  }
  return { n, edges };
}
/* Loops of the given numbers of domes, all meeting at node 0. */
function bouquetGraph(sizes) {
  let n = 1; const edges = [];
  for (const sz of sizes) {
    let prev = 0;
    for (let t = 1; t < sz; t++) { edges.push([prev, n]); prev = n; n++; }
    edges.push([prev, 0]);
  }
  return { n, edges };
}
/* Union-find over nodes 1..n: returns the number of separate pieces after the given links. */
function pieces(n, links) {
  const par = Array.from({ length: n + 1 }, (_, i) => i), find = x => par[x] === x ? x : (par[x] = find(par[x]));
  let comps = n; for (const [u, v] of links) { const a = find(u), b = find(v); if (a !== b) { par[a] = b; comps--; } }
  return comps;
}
/* Smallest number of leaves L such that a tree (or forest of c trees) with L leaves and the given other degrees
   satisfies: sum of degrees = 2 x edges, edges = nodes - c. Search upward from 0. */
function leavesFor(others, c) {
  const n0 = others.length, s0 = others.reduce((x, y) => x + y, 0);
  for (let L = 0; L < 100000; L++) if (L + s0 === 2 * (L + n0 - c)) return L;
  return NaN;
}

Object.assign(window.ORACLE, {
  /* q11b: grid m wide, k deep, west-east roads a metres, south-north roads b metres. Count odd corners directly;
     least extra distance by the profile search above. */
  q11b: p => {
    let odd = 0;
    for (let j = 0; j <= p.k; j++) for (let i = 0; i <= p.m; i++) if (gridDegree(p.m, p.k, i, j) % 2) odd++;
    return [odd, repeatsDistFirst(p.m, p.k, p.a, p.b).extra];
  },
  /* q11c: roads repeated as few as possible, then total distance (every road once plus the repeats), then minutes at s per minute. */
  q11c: p => {
    const t = gridTotals(p.m, p.k, p.a, p.b), rep = repeatsCountFirst(p.m, p.k, p.a, p.b);
    /* q11c's west-east roads cost a and south-north roads b, as in the prompt's "40 west–east roads of 150 metres" */
    const total = t.dist + rep.extra;
    return [rep.count, total, r6(total / p.s)];
  },
  /* q11d: roads by the handshake rule (sum of corner degrees halved), then fewest repeats and their extra distance. */
  q11d: p => {
    const t = gridTotals(p.m, p.k, p.a, p.b), rep = repeatsCountFirst(p.m, p.k, p.a, p.b);
    return [t.roads, rep.count, rep.extra];
  },
  /* q12b: p.t tanks added one at a time, each by one pipe; then p.p pipes, each bringing one new tank to the first. */
  q12b: p => {
    let tanks = 1, pipes = 0; while (tanks < p.t) { tanks++; pipes++; }
    let tanks2 = 1, pipes2 = 0; while (pipes2 < p.p) { tanks2++; pipes2++; }
    return [pipes, tanks2];
  },
  /* q12c: p.V domes laid one cable at a time, p.S spools in stock. */
  q12c: p => {
    let domes = 1, used = 0; while (domes < p.V) { domes++; used++; }
    let left = p.S - used, final = domes; for (let s = 0; s < left; s++) final++;
    return [used, left, final];
  },
  /* q12d: p.sizes lists the domes of each separate tree. Build each as a chain of cables, then join pieces
     one new cable at a time until one piece remains. */
  q12d: p => {
    const links = []; let n = 0;
    for (const sz of p.sizes) { for (let t = 1; t < sz; t++) links.push([n + t, n + t + 1]); n += sz; }
    const old = links.length; let newCables = 0, start = 0;
    const heads = []; for (const sz of p.sizes) { heads.push(start + 1); start += sz; }
    while (pieces(n, links) > 1) {
      /* join the first two nodes that sit in different pieces */
      const par = Array.from({ length: n + 1 }, (_, i) => i), find = x => par[x] === x ? x : (par[x] = find(par[x]));
      for (const [u, v] of links) par[find(u)] = find(v);
      links.push([heads[0], heads.find(h => find(h) !== find(heads[0]))]); newCables++;
    }
    return [old, newCables, links.length];
  },
  /* q13b: v tanks in c separate trees: build each tree as a chain, count pipes; the new tree's leaves by search. */
  q13b: p => {
    const links = []; let left = p.v;
    /* c trees: c - 1 trees of one tank each is not required; give the first tree the spare tanks, the rest one tank each */
    const sizes = [p.v - (p.c - 1)]; for (let t = 1; t < p.c; t++) sizes.push(1);
    let n = 0; for (const sz of sizes) { for (let t = 1; t < sz; t++) links.push([n + t, n + t + 1]); n += sz; }
    const others = [].concat(new Array(p.d2).fill(2), new Array(p.d3).fill(3), new Array(p.d4).fill(4));
    return [links.length, leavesFor(others, 1)];
  },
  /* q13c: tree of T domes, every dome degree 1 or 3. Cables by building the tree one dome at a time; splitters by search. */
  q13c: p => {
    let cables = 0; for (let d = 1; d < p.T; d++) cables++;
    for (let s = 0; s <= p.T; s++) if ((p.T - s) + 3 * s === 2 * cables) return [cables, s, p.T - s];
    return [cables, NaN, NaN];
  },
  /* q13d: forest of c trees; the other domes have degrees 2, 3, 4, 5; leaves by search, then domes and cables. */
  q13d: p => {
    const others = [].concat(new Array(p.d2).fill(2), new Array(p.d3).fill(3), new Array(p.d4).fill(4), new Array(p.d5).fill(5));
    const L = leavesFor(others, p.c), domes = L + others.length;
    return [L, domes, domes - p.c];
  },
  /* q14b: masts 1..V, given links. Keep links one at a time when they join two separate pieces (a spanning tree). */
  q14b: p => {
    const par = Array.from({ length: p.V + 1 }, (_, i) => i), find = x => par[x] === x ? x : (par[x] = find(par[x]));
    let kept = 0; for (const [u, v] of p.edges) { const a = find(u), b = find(v); if (a !== b) { par[a] = b; kept++; } }
    return [kept, p.edges.length - kept];
  },
  /* q14c: connected district of V domes, E tunnels, each L metres. A spanning tree of a connected graph on V domes has V - 1 tunnels. */
  q14c: p => {
    let tree = 0; for (let d = 1; d < p.V; d++) tree++;
    return [tree, p.E - tree, tree * p.L];
  },
  /* q14d: V domes of degree r: tunnels by the handshake rule; spanning tree keeps V - 1. */
  q14d: p => {
    let sum = 0; for (let d = 0; d < p.V; d++) sum += p.r;
    const tunnels = sum / 2, tree = p.V - 1;
    return [tunnels, tree, tunnels - tree];
  },
  /* q15b: theta network of pipelines a, b, c (matrix-tree count); ring of r tanks (matrix-tree count). */
  q15b: p => { const g = thetaGraph([p.a, p.b, p.c]); return [spanningTrees(g.n, g.edges), spanningTrees(p.r, cycleEdges(p.r))]; },
  /* q15c: ring of r domes, theta of a, b, c cables, m minutes per check. */
  q15c: p => {
    const g = thetaGraph([p.a, p.b, p.c]), ring = spanningTrees(p.r, cycleEdges(p.r)), west = spanningTrees(g.n, g.edges);
    return [ring, west, (ring + west) * p.m];
  },
  /* q15d: loops of p.p, p.q, p.s domes (junction counted in each) meeting at one dome. */
  q15d: p => {
    const g = bouquetGraph([p.p, p.q, p.s]);
    return [g.n, g.edges.length - (g.n - 1), spanningTrees(g.n, g.edges)];
  },
});
})();
