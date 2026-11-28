/* Independent oracles for Graph theory: networks learn missions, file d: q31–q40 (game/realms/graph/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Number of ways to choose k from n, by Pascal's triangle. */
const choose = (n, k) => {
  let row = [1];
  for (let i = 1; i <= n; i++) { const nx = [1]; for (let j = 1; j < i; j++) nx.push(row[j - 1] + row[j]); nx.push(1); row = nx; }
  return row[k];
};
/* Largest set of vertices 1..n that is a clique (want = true) or independent (want = false), by trying every subset. */
const bestSet = (n, edges, wantClique) => {
  const adj = new Set(edges.map(([a, b]) => Math.min(a, b) + ',' + Math.max(a, b)));
  let best = 0;
  for (let mask = 1; mask < (1 << n); mask++) {
    const vs = []; for (let i = 0; i < n; i++) if (mask >> i & 1) vs.push(i + 1);
    let ok = true;
    for (let i = 0; i < vs.length && ok; i++) for (let j = i + 1; j < vs.length; j++) {
      const linked = adj.has(vs[i] + ',' + vs[j]);
      if (linked !== wantClique) { ok = false; break; }
    }
    if (ok && vs.length > best) best = vs.length;
  }
  return best;
};
Object.assign(window.ORACLE, {
  /* lists[i] = jobs (1..n) technician i is certified for; S = positions (0-based) of the technicians in the set.
     Jobs reachable from S are collected in a set. The matching is tried by brute force over every assignment of
     distinct jobs to the technicians. */
  q31: p => {
    const seen = new Set();
    p.S.forEach(i => p.lists[i].forEach(j => seen.add(j)));
    const n = p.lists.length, used = new Array(n + 1).fill(false);
    const go = i => {
      if (i === n) return true;
      for (const j of p.lists[i]) if (!used[j]) { used[j] = true; if (go(i + 1)) return true; used[j] = false; }
      return false;
    };
    return [seen.size, go(0) ? 1 : 0];
  },
  /* Arcs between junctions 1..N, v = the inner junction. Count paths from 1 by walking every route out of 1. */
  q32: p => {
    const out = {}; p.arcs.forEach(([a, b]) => { (out[a] = out[a] || []).push(b); });
    const cnt = {};
    const walk = u => { cnt[u] = (cnt[u] || 0) + 1; (out[u] || []).forEach(walk); };
    walk(1);
    return [cnt[p.v] || 0, cnt[p.N] || 0];
  },
  /* Four source-to-sink routes carry the flow; a = amounts on 1-2-4-5, 1-3-5, 1-2-3-5, 1-3-4-5 in that order.
     Arc flows are the route amounts added up arc by arc, in the order 12, 13, 23, 24, 34, 35, 45; capacity = flow +
     slack, at least 1. The cut capacity adds capacities of arcs from L (source side) to the other junctions. */
  q33: p => {
    const [r124, r135, r123, r134] = p.a;
    const arcs = [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]];
    const flow = [r124 + r123, r135 + r134, r123, r124, r134, r135 + r123, r124 + r134];
    const cap = flow.map((f, i) => Math.max(1, f + p.slack[i])); // a pipe is never printed with capacity 0
    let value = 0; arcs.forEach(([a, b], i) => { if (a === 1) value += flow[i]; });
    let cut = 0; arcs.forEach(([a, b], i) => { if (p.L.includes(a) && !p.L.includes(b)) cut += cap[i]; });
    return [value, cut];
  },
  /* c = capacities of 1→2, 1→3, 2→3, 2→4, 3→4, 3→5, 4→5. Max flow by repeatedly pushing along any path with room
     (breadth-first); the two single-vertex cuts are added directly. */
  q34: p => {
    const arcs = [[1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]];
    const res = {}; const R = (a, b) => res[a + '>' + b] || 0;
    arcs.forEach(([a, b], i) => { res[a + '>' + b] = p.c[i]; res[b + '>' + a] = res[b + '>' + a] || 0; });
    let total = 0;
    for (;;) {
      const prev = { 1: 0 }, q = [1];
      while (q.length) { const u = q.shift(); for (let w = 1; w <= 5; w++) if (!(w in prev) && R(u, w) > 0) { prev[w] = u; q.push(w); } }
      if (!(5 in prev)) break;
      let f = Infinity; for (let v = 5; v !== 1; v = prev[v]) f = Math.min(f, R(prev[v], v));
      for (let v = 5; v !== 1; v = prev[v]) { res[prev[v] + '>' + v] -= f; res[v + '>' + prev[v]] += f; }
      total += f;
    }
    return [p.c[0] + p.c[1], p.c[5] + p.c[6], total];
  },
  /* Labelled trees on n vertices = spanning trees of K_n, counted with the matrix-tree determinant of the
     Laplacian with one row and column removed (Gaussian elimination). Plans missing = that count − s. */
  q35: p => {
    const n = p.n, m = n - 1;
    const A = []; for (let i = 0; i < m; i++) { A.push([]); for (let j = 0; j < m; j++) A[i].push(i === j ? n - 1 : -1); }
    let det = 1;
    for (let c = 0; c < m; c++) {
      let piv = c; for (let r = c; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      if (piv !== c) { [A[piv], A[c]] = [A[c], A[piv]]; det = -det; }
      det *= A[c][c];
      for (let r = c + 1; r < m; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < m; k++) A[r][k] -= f * A[c][k]; }
    }
    const trees = Math.round(det);
    return [trees, trees - p.s];
  },
  /* Decode the Prüfer code into the tree, step by step (smallest leaf not yet removed is joined to the next code
     entry). Then read degrees from the finished edge list. v = the dome whose degree is asked for. */
  q36: p => {
    const n = p.code.length + 2;
    const deg = new Array(n + 1).fill(1);
    p.code.forEach(x => { deg[x]++; });
    const edges = []; let first = null;
    const d = deg.slice();
    p.code.forEach(x => {
      let leaf = 1; while (d[leaf] !== 1) leaf++;
      if (first === null) first = leaf;
      edges.push([leaf, x]); d[leaf] = 0; d[x]--;
    });
    const rest = []; for (let i = 1; i <= n; i++) if (d[i] === 1) rest.push(i);
    edges.push(rest);
    const degree = new Array(n + 1).fill(0);
    edges.forEach(([a, b]) => { degree[a]++; degree[b]++; });
    let leaves = 0; for (let i = 1; i <= n; i++) if (degree[i] === 1) leaves++;
    return [degree[p.v], leaves, first];
  },
  /* kind 'graph': v servers with the listed edges; kind 'ring': N servers, each linked to the next and the last to
     the first. Every subset of servers is tested. */
  q37: p => {
    let n, edges;
    if (p.kind === 'ring') { n = p.N; edges = []; for (let i = 1; i <= n; i++) edges.push([i, i % n + 1]); }
    else { n = p.v; edges = p.edges; }
    return [bestSet(n, edges, true), bestSet(n, edges, false)];
  },
  /* Triangles and k-cliques of K_n: every subset of that size is a clique, counted by Pascal's triangle. */
  q38: p => [choose(p.n, 3), choose(p.n, p.k)],
  /* n domes, v = which dome (an index into the text only). Links at one dome: n − 1, each of two kinds, so the
     guaranteed share is the best the worst split gives. The triangle question is settled by trying every two-colouring
     of K_min(n, 6): any larger plan contains a 6-dome sub-plan. */
  q39: p => {
    let guaranteed = Infinity;
    for (let k = 0; k <= p.n - 1; k++) guaranteed = Math.min(guaranteed, Math.max(k, p.n - 1 - k));
    const m = Math.min(p.n, 6), pairs = [];
    for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) pairs.push([i, j]);
    let avoided = false;
    for (let mask = 0; mask < (1 << pairs.length) && !avoided; mask++) {
      const col = (i, j) => mask >> pairs.findIndex(q => q[0] === i && q[1] === j) & 1;
      let mono = false;
      for (let a = 0; a < m && !mono; a++) for (let b = a + 1; b < m && !mono; b++) for (let c = b + 1; c < m; c++) {
        const x = col(a, b); if (x === col(a, c) && x === col(b, c)) { mono = true; break; }
      }
      if (!mono) avoided = true;
    }
    return [guaranteed, avoided ? 0 : 1];
  },
  /* Grid on a torus: m corridors of one kind, n of the other, built crossing by crossing. Each crossing (i, j) gets an
     edge to the next crossing along each corridor (wrapping round) and a face to its lower-right; edges are collected
     in a set so none is counted twice. */
  q40: p => {
    const m = p.m, n = p.n, E = new Set(); let V = 0, F = 0;
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
      V++; F++;
      const a = i + ',' + j, b = ((i + 1) % m) + ',' + j, c = i + ',' + ((j + 1) % n);
      E.add([a, b].sort().join('|')); E.add([a, c].sort().join('|'));
    }
    return [V, E.size, F, V - E.size + F];
  }
});
})();
