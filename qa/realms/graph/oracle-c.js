/* Independent oracles for Graph theory: networks learn missions, file c: q21–q30 (game/realms/graph/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* every ordering of the items of a list */
const perms = a => a.length <= 1 ? [a.slice()] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(r => [x, ...r]));
/* symmetric weight table from a list of weights in the order 1–2, 1–3, …, 1–n, 2–3, … */
const table = (n, w) => { const T = {}; let k = 0; for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) { T[i + ',' + j] = T[j + ',' + i] = w[k++]; } return T; };
/* fewest colours in a proper colouring, by trying 1, 2, 3, … colours with backtracking */
const chromatic = (n, edges) => {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  for (let k = 1; k <= n; k++) {
    const col = new Array(n).fill(-1);
    /* a part may only open a new colour one above the highest used so far (colour names are interchangeable) */
    const go = (v, used) => { if (v === n) return true;
      for (let c = 0; c < k && c <= used; c++) if (adj[v].every(u => col[u] !== c)) { col[v] = c; if (go(v + 1, Math.max(used, c + 1))) return true; col[v] = -1; }
      return false; };
    if (go(0, 0)) return k;
  }
  return n;
};
Object.assign(window.ORACLE, {
  /* Weights w are in the order 1–2, 1–3, 1–4, 1–5, 2–3, 2–4, 2–5, 3–4, 3–5, 4–5; s is the start station.
     Nearest neighbour is walked step by step; the best tour comes from trying all 24 orders of the other four. */
  q21: p => {
    const T = table(5, p.w), left = [1, 2, 3, 4, 5].filter(x => x !== p.s);
    let at = p.s, len = 0; const todo = left.slice();
    while (todo.length) { let b = todo[0]; for (const x of todo) if (T[at + ',' + x] < T[at + ',' + b]) b = x; len += T[at + ',' + b]; at = b; todo.splice(todo.indexOf(b), 1); }
    len += T[at + ',' + p.s];
    const tour = o => { let t = 0, a = p.s; for (const x of o) { t += T[a + ',' + x]; a = x; } return t + T[a + ',' + p.s]; };
    return [len, len - Math.min(...perms(left).map(tour))];
  },
  /* n stations and the list of links (p.edges, 1-based pairs). Count the links at each station; Dirac needs the
     smallest count to be at least n ÷ 2 (checked as 2 × smallest ≥ n). */
  q22: p => {
    const deg = new Array(p.n + 1).fill(0);
    p.edges.forEach(([a, b]) => { deg[a]++; deg[b]++; });
    const m = Math.min(...deg.slice(1));
    return [m, 2 * m >= p.n ? 1 : 0];
  },
  /* p.w: nine road lengths in the order 1–2, 1–3, 2–3, 2–4, 2–5, 3–5, 4–5, 4–6, 5–6 (a text index, not a quantity);
     p.t: six flight lengths in the order 1–2, 1–3, 1–4, 2–3, 2–4, 3–4. Roads: Bellman–Ford relaxed until nothing
     improves. Tours: all 6 orders of masts 2–4. */
  q23: p => {
    const pairs = [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [4, 5], [4, 6], [5, 6]];
    const d = [Infinity, 0, Infinity, Infinity, Infinity, Infinity, Infinity];
    for (let again = true; again;) { again = false;
      pairs.forEach(([a, b], i) => { const w = p.w[i];
        if (d[a] + w < d[b]) { d[b] = d[a] + w; again = true; }
        if (d[b] + w < d[a]) { d[a] = d[b] + w; again = true; } }); }
    const T = {}; [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]].forEach(([a, b], i) => { T[a + ',' + b] = T[b + ',' + a] = p.t[i]; });
    const best = Math.min(...perms([2, 3, 4]).map(o => { const r = [1, ...o, 1]; let t = 0; for (let i = 0; i + 1 < r.length; i++) t += T[r[i] + ',' + r[i + 1]]; return t; }));
    return [d[6], best];
  },
  /* V junctions, E wires, k extra wires. Faces from V − E + F = 2; each extra wire splits one face, so F grows by k.
     Checked by recomputing with the new edge count. */
  q24: p => { const F = 2 - p.V + p.E; return [F, 2 - p.V + (p.E + p.k) ]; },
  /* V components. Largest planar edge count 3V − 6 (each face has at least 3 edges, each edge on at most 2 faces,
     3F ≤ 2E with F = 2 − V + E), found by testing edge counts upward. When p.tf = 1 the prompt adds "no triangles":
     the shortest loop round a face is then 4, so the test is 4F ≤ 2E. E is the wire count in the prompt. */
  q25: p => {
    const round = p.tf ? 4 : 3;
    let most = 0;
    for (let e = 0; e < 10000; e++) if (round * (2 - p.V + e) <= 2 * e) most = e;
    return [most, p.E <= most ? 1 : 0];
  },
  /* type 0: every face has p edges and q faces meet at each corner (p, q give the regular solid); search for the
     edge count where pF = 2E, qV = 2E and V − E + F = 2 all hold. type 1: a prism with m-sided ends (m is the
     number of sides); count its corners, edges and faces from the build. p.p, p.q and p.m only matter for their type. */
  q26: p => {
    if (p.type === 1) {
      const m = p.m;
      const V = 2 * m, E = m + m + m /* two rims and the rungs */, F = 2 + m;
      return [V, E, F];
    }
    for (let E = 1; E < 5000; E++) {
      if ((2 * E) % p.p || (2 * E) % p.q) continue;
      const F = 2 * E / p.p, V = 2 * E / p.q;
      if (V - E + F === 2) return [V, E, F];
    }
    return [NaN, NaN, NaN];
  },
  /* V chips, wires p.edges (1-based pairs); a, b the sides of the complete bipartite rig. Bipartite test: try to
     colour chips with two banks by flooding from each unsorted chip. K_{a,b} has a wire for every probe–socket pair. */
  q27: p => {
    const adj = Array.from({ length: p.V + 1 }, () => []);
    p.edges.forEach(([x, y]) => { adj[x].push(y); adj[y].push(x); });
    const bank = new Array(p.V + 1).fill(-1); let ok = true;
    for (let s = 1; s <= p.V; s++) { if (bank[s] >= 0) continue; bank[s] = 0; const q = [s];
      while (q.length) { const u = q.shift(); for (const v of adj[u]) { if (bank[v] < 0) { bank[v] = 1 - bank[u]; q.push(v); } else if (bank[v] === bank[u]) ok = false; } } }
    let wires = 0; for (let i = 0; i < p.a; i++) for (let j = 0; j < p.b; j++) wires++;
    return [ok ? 1 : 0, wires];
  },
  /* p.fam is a text index: 0 a ring of s parts, 1 a wheel (ring of s plus a hub linked to all), 2 the complete graph
     on s parts. The first board is built as an edge list and coloured by backtracking; the second board's links are
     p.edges (1-based pairs, six parts). */
  q28: p => {
    const s = p.s, E = [];
    if (p.fam === 0 || p.fam === 1) { for (let i = 0; i < s; i++) E.push([i, (i + 1) % s]); if (p.fam === 1) for (let i = 0; i < s; i++) E.push([i, s]); }
    else for (let i = 0; i < s; i++) for (let j = i + 1; j < s; j++) E.push([i, j]);
    const n1 = p.fam === 1 ? s + 1 : s;
    return [chromatic(n1, E), chromatic(6, p.edges.map(([a, b]) => [a - 1, b - 1]))];
  },
  /* Rebuild the conflict network: parts 0 … r − 1 form a ring, the hub (if p.hub = 1) is a further part linked to
     every ring part, p.chords are extra links between ring parts, and p.label[i] is the exam number of part i (a text
     index). Slots are colours, found by backtracking; faces from V − E + F = 2 for the connected planar drawing. */
  q29: p => {
    const r = p.r, n = r + (p.hub ? 1 : 0), seen = new Set(), E = [];
    const add = (a, b) => { const k = Math.min(a, b) + ',' + Math.max(a, b); if (!seen.has(k)) { seen.add(k); E.push([a, b]); } };
    for (let i = 0; i < r; i++) add(i, (i + 1) % r);
    if (p.hub) for (let i = 0; i < r; i++) add(i, r);
    p.chords.forEach(([a, b]) => add(a, b));
    return [chromatic(n, E), 2 - n + E.length];
  },
  /* c crew, t tasks, p.adj[i] the task numbers (0 = A, 1 = B, …) crew i + 1 can do. Largest matching by trying every
     way to give each crew a task or none, keeping tasks distinct. */
  q30: p => {
    let best = 0;
    const go = (i, used, got) => {
      if (got + (p.c - i) <= best) return;
      if (i === p.c) { best = got; return; }
      for (const t of p.adj[i]) if (!used.has(t)) { used.add(t); go(i + 1, used, got + 1); used.delete(t); }
      go(i + 1, used, got);
    };
    go(0, new Set(), 0);
    return [best, p.c - best];
  },
});
})();
