/* Independent oracles for Graph theory: networks practice missions, file 1 of 8: q01b–q05d (game/realms/graph/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Adjacency matrix (0/1) of an edge list on vertices 1..V. */
const matrix = (V, E) => {
  const M = Array.from({ length: V + 1 }, () => new Array(V + 1).fill(0));
  for (const [a, b] of E) { M[a][b] = 1; M[b][a] = 1; }
  return M;
};
/* Number of vertices joined to v: scan the row of the matrix. */
const degreeOf = (M, V, v) => { let d = 0; for (let u = 1; u <= V; u++) if (M[v][u]) d++; return d; };
/* Edges of the complement, found by scanning every pair of vertices. */
const complementCount = (M, V) => { let n = 0; for (let a = 1; a <= V; a++) for (let b = a + 1; b <= V; b++) if (!M[a][b]) n++; return n; };
/* True isomorphism by trying every renaming of the vertices (V is at most 7). */
const isomorphic = (V, P, Q) => {
  if (P.length !== Q.length) return false;
  const A = matrix(V, P), B = matrix(V, Q), map = new Array(V + 1).fill(0), used = new Array(V + 1).fill(false);
  const place = v => {
    if (v > V) return true;
    for (let w = 1; w <= V; w++) {
      if (used[w]) continue;
      let ok = true;
      for (let u = 1; u < v && ok; u++) if (A[u][v] !== B[map[u]][w]) ok = false;
      if (!ok) continue;
      used[w] = true; map[v] = w;
      if (place(v + 1)) return true;
      used[w] = false;
    }
    return false;
  };
  return place(1);
};
Object.assign(window.ORACLE, {
  /* q01b (k is a mast number): count the listed pairs, then count the pairs that contain mast k. */
  q01b: p => {
    let links = 0, near = 0;
    for (const e of p.E) { links++; if (e[0] === p.k || e[1] === p.k) near++; }
    return [links, near];
  },
  /* q01c (k is the relay mast, c the cable price, j the lamp price): cables = pairs, lamps = pairs touching k. */
  q01c: p => {
    let cables = 0, lamps = 0;
    for (const e of p.E) { cables++; if (e[0] === p.k || e[1] === p.k) lamps++; }
    return [cables, cables * p.c, lamps * p.j];
  },
  /* q01d (k is a dome number): edges, neighbours of k, and the domes left over, by checking each dome in turn. */
  q01d: p => {
    const M = matrix(p.V, p.E); let edges = 0, nb = 0, rest = 0;
    for (const e of p.E) edges++;
    for (let u = 1; u <= p.V; u++) { if (u === p.k) continue; if (M[p.k][u]) nb++; else rest++; }
    return [edges, nb, rest];
  },
  /* q02b: add the degrees one by one, then find the pipe count n by search (every pipe adds 2 to the sum). */
  q02b: p => {
    let sum = 0; for (const x of p.d) sum += x;
    let n = 0; while (2 * n < sum) n++;
    return [sum, n];
  },
  /* q02c (c is the price of a door): each tunnel has two doors; the last dome takes what the others leave. */
  q02c: p => {
    let total = 0; for (let t = 0; t < p.m; t++) total += 2;
    let fitted = 0; for (const x of p.d) fitted += x;
    const last = total - fitted;
    return [total, last, last * p.c];
  },
  /* q02d: each of the m tunnels adds 2 to the sum; search for the twin degree t that makes the sum fit. */
  q02d: p => {
    let total = 0; for (let t = 0; t < p.m; t++) total += 2;
    let known = 0; for (const x of p.d) known += x;
    let t = 0; while (known + 2 * t < total) t++;
    return [total, known, t];
  },
  /* q03b (k posts): enumerate the pairs of the complete graph and the ring edges {i, i+1} (last to first). */
  q03b: p => {
    let full = 0; for (let a = 1; a <= p.k; a++) for (let b = a + 1; b <= p.k; b++) full++;
    const ring = new Set(); for (let i = 1; i <= p.k; i++) { const j = i % p.k + 1; ring.add(Math.min(i, j) + '-' + Math.max(i, j)); }
    let atPost = 0; for (let b = 1; b <= p.k; b++) if (b !== 1) atPost++;
    return [full, atPost, full - ring.size];
  },
  /* q03c (k stations, c the price of one road): pairs for the full network, distinct ring edges for the ring. */
  q03c: p => {
    let full = 0; for (let a = 1; a <= p.k; a++) for (let b = a + 1; b <= p.k; b++) full++;
    const ring = new Set(); for (let i = 1; i <= p.k; i++) { const j = i % p.k + 1; ring.add(Math.min(i, j) + '-' + Math.max(i, j)); }
    return [full, ring.size, (full - ring.size) * p.c];
  },
  /* q03d (k domes, every one of degree r): sum by adding, tunnels by search (2n = sum), complete graph by pairs. */
  q03d: p => {
    let sum = 0; for (let v = 0; v < p.k; v++) sum += p.r;
    let n = 0; while (2 * n < sum) n++;
    let full = 0; for (let a = 1; a <= p.k; a++) for (let b = a + 1; b <= p.k; b++) full++;
    return [sum, n, full - n];
  },
  /* q04b (j: the subgraph is on vertices 1..j; k is a room number): scan pairs for each part. */
  q04b: p => {
    const M = matrix(p.V, p.E); let sub = 0, comp = 0;
    for (let a = 1; a <= p.V; a++) for (let b = a + 1; b <= p.V; b++) { if (M[a][b] && b <= p.j) sub++; if (!M[a][b]) comp++; }
    return [sub, comp, p.V - 1 - degreeOf(M, p.V, p.k)];
  },
  /* q04c (k is a dome number, c the price of one tunnel): the missing pairs are the new tunnels. */
  q04c: p => {
    const M = matrix(p.V, p.E); let missing = 0, atK = 0;
    for (let a = 1; a <= p.V; a++) for (let b = a + 1; b <= p.V; b++) if (!M[a][b]) { missing++; if (a === p.k || b === p.k) atK++; }
    return [missing, missing * p.c, atK];
  },
  /* q04d (r ring domes plus a hub numbered r + 1): build the graph, then scan the complement. */
  q04d: p => {
    const V = p.r + 1, E = [];
    for (let i = 1; i <= p.r; i++) { E.push([i, i % p.r + 1]); E.push([i, V]); }
    const M = matrix(V, E);
    return [complementCount(M, V), V - 1 - degreeOf(M, V, V), V - 1 - degreeOf(M, V, 1)];
  },
  /* q05b: largest degree of each diagram, and a true isomorphism test (all renamings), not the degree-sequence check. */
  q05b: p => {
    const A = matrix(p.V, p.P), B = matrix(p.V, p.Q); let ma = 0, mb = 0;
    for (let v = 1; v <= p.V; v++) { ma = Math.max(ma, degreeOf(A, p.V, v)); mb = Math.max(mb, degreeOf(B, p.V, v)); }
    return [ma, mb, isomorphic(p.V, p.P, p.Q) ? 1 : 0];
  },
  /* q05c: true isomorphism of T with X and with Y. */
  q05c: p => {
    const x = isomorphic(p.V, p.T, p.X) ? 1 : 0, y = isomorphic(p.V, p.T, p.Y) ? 1 : 0;
    return [x, y, x + y];
  },
  /* q05d: complement edge counts by scanning pairs, and a true isomorphism test of P and Q. */
  q05d: p => [complementCount(matrix(p.V, p.P), p.V), complementCount(matrix(p.V, p.Q), p.V), isomorphic(p.V, p.P, p.Q) ? 1 : 0],
});
})();
