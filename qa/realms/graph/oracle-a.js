/* Independent oracles for Graph theory: networks learn missions, file a: q01–q10 (game/realms/graph/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Shared helpers: adjacency matrix from an edge list, and a few brute-force searches. */
const adj = (V, E) => {
  const M = Array.from({ length: V + 1 }, () => new Array(V + 1).fill(0));
  E.forEach(([a, b]) => { M[a][b] = 1; M[b][a] = 1; });
  return M;
};
const degs = (V, E) => { const M = adj(V, E); return Array.from({ length: V }, (_, i) => M[i + 1].reduce((s, x) => s + x, 0)); };
/* Breadth-first search by repeated frontier growth: distance from s to every vertex (Infinity if unreachable). */
const dists = (V, E, s) => {
  const M = adj(V, E), d = new Array(V + 1).fill(Infinity);
  d[s] = 0;
  for (let step = 0; step < V; step++)
    for (let a = 1; a <= V; a++) if (d[a] === step) for (let b = 1; b <= V; b++) if (M[a][b] && d[b] === Infinity) d[b] = step + 1;
  return d;
};
/* Brute force over every renaming of the vertices: does some permutation carry A's edge set onto B's? */
const isoBrute = (V, A, B) => {
  if (A.length !== B.length) return false;
  const mb = adj(V, B), perm = [];
  const used = new Array(V + 1).fill(false);
  const go = k => {
    if (k > V) return A.every(([a, b]) => mb[perm[a]][perm[b]] === 1);
    for (let t = 1; t <= V; t++) if (!used[t]) { used[t] = true; perm[k] = t; if (go(k + 1)) return true; used[t] = false; }
    return false;
  };
  return go(1);
};
Object.assign(window.ORACLE, {
  /* Tunnel list as given. Edges: count pairs. Neighbours of dome k: scan every other dome and test whether the pair
     {k, j} is in the list, either way round. */
  q01: p => {
    const has = (a, b) => p.E.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
    let nb = 0;
    for (let j = 1; j <= p.V; j++) if (j !== p.k && has(p.k, j)) nb++;
    return [p.E.length, nb];
  },
  /* m tunnels, degrees d of domes 1..V−1 (V is a count of domes; d is the list of known degrees). Handshake rule:
     the degrees total 2m; the last dome's degree is what is left. */
  q02: p => {
    const total = 2 * p.m;
    return [total, total - p.d.reduce((s, x) => s + x, 0)];
  },
  /* k domes (k is the number of domes in the cluster). K_k: build the complete graph by listing every pair i<j and
     count them; degree of dome 1 is the pairs containing it. C_k: one edge from each dome to the next, wrapping. */
  q03: p => {
    let pairs = 0, deg1 = 0;
    for (let i = 1; i <= p.k; i++) for (let j = i + 1; j <= p.k; j++) { pairs++; if (i === 1) deg1++; }
    let ring = 0;
    for (let i = 1; i <= p.k; i++) ring++;
    return [pairs, deg1, ring];
  },
  /* Subgraph on domes 1–4: keep tunnels with both ends in {1,2,3,4}. Complement: test every pair of the V domes.
     k is a dome number: its complement degree is the count of non-tunnels from k. */
  q04: p => {
    const M = adj(p.V, p.E);
    let sub = 0, comp = 0, dk = 0;
    for (let i = 1; i <= p.V; i++) for (let j = i + 1; j <= p.V; j++) {
      if (i <= 4 && j <= 4 && M[i][j]) sub++;
      if (!M[i][j]) { comp++; if (i === p.k || j === p.k) dk++; }
    }
    return [sub, comp, dk];
  },
  /* Edge counts by size; isomorphism by trying every renaming of the domes (brute force). */
  q05: p => [p.A.length, p.B.length, isoBrute(p.V, p.A, p.B) ? 1 : 0],
  /* Walks of length 2 from u to v: try every middle dome. Paths of length 2 starting at u: ordered triples u,x,y
     with all three different and both steps along tunnels. (u is the start dome, v the end dome.) */
  q06: p => {
    const M = adj(p.V, p.E);
    let walks = 0, paths = 0;
    for (let x = 1; x <= p.V; x++) {
      if (M[p.u][x] && M[x][p.v]) walks++;
      for (let y = 1; y <= p.V; y++) if (M[p.u][x] && M[x][y] && y !== p.u && x !== y) paths++;
    }
    return [walks, paths];
  },
  /* Shortest road counts from u by growing a frontier one road at a time (u is the start depot; v and w are the two
     target depots, in the order the prompt names them). */
  q07: p => { const d = dists(p.V, p.E, p.u); return [d[p.v], d[p.w]]; },
  /* Components: label vertices by repeatedly relabelling to the smaller label across each road until nothing
     changes. Isolated depots count as components. Joining c components needs c − 1 new roads. */
  q08: p => {
    const lab = Array.from({ length: p.V + 1 }, (_, i) => i);
    let changed = true;
    while (changed) {
      changed = false;
      p.E.forEach(([a, b]) => { const m = Math.min(lab[a], lab[b]); if (lab[a] !== m) { lab[a] = m; changed = true; } if (lab[b] !== m) { lab[b] = m; changed = true; } });
    }
    const c = new Set(lab.slice(1)).size;
    return [c, c - 1];
  },
  /* Degrees by counting each depot's roads; the map is stated connected, so an Euler circuit exists exactly when
     no depot has odd degree. */
  q09: p => {
    const d = degs(p.V, p.E), odd = d.filter(x => x % 2 === 1).length;
    return [d[0], odd, odd === 0 ? 1 : 0];
  },
  /* Connected map. A trail that starts and ends at different depots exists exactly when two depots are odd; it must
     start at one of them, so the answer is the smaller odd depot's label. */
  q10: p => {
    const d = degs(p.V, p.E), odds = [];
    d.forEach((x, i) => { if (x % 2 === 1) odds.push(i + 1); });
    return odds.length === 2 ? [1, Math.min(...odds)] : [0, 0];
  },
});
})();
