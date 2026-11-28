/* Independent oracles for Graph theory: networks practice missions, file 6 of 8: q26b–q30d (game/realms/graph/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* ---- helpers: small exhaustive solvers on explicit graphs (vertices 0..n-1) ---- */
function adjSets(n, edges){ const a = Array.from({length: n}, () => new Set()); edges.forEach(([u, v]) => { if (u !== v) { a[u].add(v); a[v].add(u); } }); return a; }
function uniqEdges(edges){ const s = new Set(); edges.forEach(([u, v]) => s.add(Math.min(u, v) + ',' + Math.max(u, v))); return s.size; }
/* can the graph be properly coloured with k colours? backtracking, new colours introduced in order */
function colourable(n, adj, k){
  const col = new Array(n).fill(-1);
  function go(v, used){
    if (v === n) return true;
    for (let c = 0; c < Math.min(k, used + 1); c++){
      let ok = true; for (const w of adj[v]) if (col[w] === c) { ok = false; break; }
      if (!ok) continue;
      col[v] = c; if (go(v + 1, Math.max(used, c + 1))) return true; col[v] = -1;
    }
    return false;
  }
  return go(0, 0);
}
function chromatic(n, edges){ const adj = adjSets(n, edges); for (let k = 1; k <= n; k++) if (colourable(n, adj, k)) return k; return n; }
/* largest set of pairwise adjacent vertices, by testing every subset */
function cliqueNumber(n, edges){
  const adj = adjSets(n, edges); let best = n ? 1 : 0;
  for (let m = 1; m < (1 << n); m++){
    const vs = []; for (let i = 0; i < n; i++) if (m >> i & 1) vs.push(i);
    if (vs.length <= best) continue;
    let ok = true; for (let i = 0; i < vs.length && ok; i++) for (let j = i + 1; j < vs.length; j++) if (!adj[vs[i]].has(vs[j])) { ok = false; break; }
    if (ok) best = vs.length;
  }
  return best;
}
/* is there a split into two groups with every edge between them? tries every split */
function splits(n, edges){
  for (let m = 0; m < (1 << n); m++){ if (edges.every(([u, v]) => ((m >> u) & 1) !== ((m >> v) & 1))) return true; }
  return false;
}
/* largest matching of workers (lists of unit indices) to units, by trying every choice for every worker */
function bestMatching(adj){
  let best = 0; const used = new Set();
  (function go(i, got){
    if (got + (adj.length - i) <= best) return;
    if (i === adj.length){ best = Math.max(best, got); return; }
    for (const u of adj[i]) if (!used.has(u)){ used.add(u); go(i + 1, got + 1); used.delete(u); }
    go(i + 1, got);
  })(0, 0);
  return best;
}
const e1 = edges => edges.map(([u, v]) => [u - 1, v - 1]);        // prompt numbers 1..n to 0..n-1
/* q29 family: ring of r vertices 0..r-1, chords (ring indices), and when p.hub is 1 an extra vertex r wired to every ring vertex.
   (hub is a 0/1 switch; label only renames the vertices in the prompt, so neither changes the answers.) */
function ringGraph(p){
  const r = p.r, edges = [];
  for (let i = 0; i < r; i++) edges.push([i, (i + 1) % r]);
  p.chords.forEach(c => edges.push([c[0], c[1]]));
  if (p.hub) for (let i = 0; i < r; i++) edges.push([i, r]);
  return { n: r + (p.hub ? 1 : 0), edges };
}
/* chords drawn outside a ring must not cross: sanity check on the stated "no crossing links" */
function noCrossing(p){
  const cs = p.chords.map(([a, b]) => [Math.min(a, b), Math.max(a, b)]);
  for (const [a, b] of cs) for (const [c, d] of cs) if (a < c && c < b && b < d) throw new Error('chords cross: the drawing is not plane');
}

Object.assign(window.ORACLE, {
  /* q26b: m = sides of the base. Corners = base corners + tip, faces = base + m triangles, edges counted directly. */
  q26b: p => { const m = p.m; return [m + 1, m + m, 1 + m]; },

  /* q26c: p = edges per face, q = faces per corner; a = panel price, b = strut price, j = joint price.
     Find the whole-number V, E, F with pF = 2E, qV = 2E and V − E + F = 2 by search. */
  q26c: p => {
    for (let E = 1; E <= 400; E++){
      if ((2 * E) % p.p || (2 * E) % p.q) continue;
      const F = 2 * E / p.p, V = 2 * E / p.q;
      if (V - E + F === 2) return [E, F, F * p.a + E * p.b + V * p.j];
    }
    throw new Error('no solid');
  },

  /* q26d: p = edges per face, V corners. Search E with pF = 2E and V − E + F = 2. */
  q26d: p => {
    for (let E = 1; E <= 20 * p.V; E++){
      if ((2 * E) % p.p) continue;
      const F = 2 * E / p.p;
      if (p.V - E + F === 2) return [E, F];
    }
    throw new Error('no solid');
  },

  /* q27b: first answer by trying every split of the sensors into X and Y; second a × b (every X sensor to every Y sensor once). */
  q27b: p => [splits(p.V, e1(p.edges)) ? 1 : 0, p.a * p.b],

  /* q27c: m controllers (0..m-1), nn sensors (m..m+nn-1), spare chip last; p = cables from the spare to controllers, q = to sensors
     (first p controllers and first q sensors; which ones does not matter); c = price of a cable. */
  q27c: p => {
    const edges = [];
    for (let i = 0; i < p.m; i++) for (let j = 0; j < p.nn; j++) edges.push([i, p.m + j]);
    const before = edges.length, spare = p.m + p.nn;
    for (let i = 0; i < p.p; i++) edges.push([i, spare]);
    for (let j = 0; j < p.q; j++) edges.push([p.m + j, spare]);
    return [before, splits(spare + 1, edges) ? 1 : 0, edges.length * p.c];
  },

  /* q27d: a, b = chips per bank; dA, dB = wire counts per chip. The smudged chip is the last of bank B in the prompt (the sixth count is
     hidden), so its count is what is needed to make bank B's counts add to the total, which is the sum of bank A's counts. */
  q27d: p => {
    const total = p.dA.reduce((s, x) => s + x, 0);
    const known = p.dB.slice(0, -1).reduce((s, x) => s + x, 0);
    return [total, total - known, p.a * p.b - total];
  },

  /* q28b: fam is an index into the first-group wordings: 0 cycle with s testers, 1 wheel (ring of s plus a mast),
     2 complete graph on s testers, 3 complete bipartite K(a, b). Second group: seven testers, edges as stated. */
  q28b: p => {
    let n = 0, edges = [];
    if (p.fam === 0){ n = p.s; for (let i = 0; i < n; i++) edges.push([i, (i + 1) % n]); }
    else if (p.fam === 1){ n = p.s + 1; for (let i = 0; i < p.s; i++){ edges.push([i, (i + 1) % p.s]); edges.push([i, p.s]); } }
    else if (p.fam === 2){ n = p.s; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j]); }
    else { n = p.a + p.b; for (let i = 0; i < p.a; i++) for (let j = 0; j < p.b; j++) edges.push([i, p.a + j]); }
    return [chromatic(n, edges), chromatic(7, e1(p.edges))];
  },

  /* q28c: clique by testing every subset of solvents, cabinets by colouring search; cost = cabinets × (cabinet + lock). */
  q28c: p => {
    const E = e1(p.edges), k = chromatic(p.V, E);
    return [cliqueNumber(p.V, E), k, k * (p.cabinet + p.lock)];
  },

  /* q28d: complete multipartite board. Links = pairs of parts in different groups, counted group pair by group pair;
     one colour per group is needed and enough (parts in one group are never linked, any two groups are fully linked). */
  q28d: p => {
    let links = 0;
    for (let i = 0; i < p.sizes.length; i++) for (let j = i + 1; j < p.sizes.length; j++) links += p.sizes[i] * p.sizes[j];
    return [links, p.sizes.length];
  },

  /* q29b: ring of r with chords (and an optional hub vertex). faces = E − V + 2 for a connected plane drawing. */
  q29b: p => {
    noCrossing(p);
    const g = ringGraph(p);
    return [uniqEdges(g.edges) - g.n + 2, chromatic(g.n, g.edges)];
  },

  /* q29c: h = hours per slot, i = invigilators, pay = credits per invigilator-hour. */
  q29c: p => {
    const g = ringGraph(p), k = chromatic(g.n, g.edges);
    return [k, k * p.h, k * p.h * p.i * p.pay];
  },

  /* q29d: most links of a plane network on n ≥ 3 vertices is 3n − 6. */
  q29d: p => {
    noCrossing(p);
    const g = ringGraph(p);
    return [chromatic(g.n, g.edges), uniqEdges(g.edges) - g.n + 2, 3 * g.n - 6];
  },

  /* q30b: c inspectors, t units; adj[i] = unit indices inspector i is qualified for. */
  q30b: p => { const m = bestMatching(p.adj); return [m, p.t - m]; },

  /* q30c: r = thousand litres an hour per running unit. */
  q30c: p => { const m = bestMatching(p.adj); return [m, m * p.r, (p.t - m) * p.r]; },

  /* q30d: wires = trained pairs; complete bipartite network has c × t wires. */
  q30d: p => {
    const m = bestMatching(p.adj), wires = p.adj.reduce((s, a) => s + a.length, 0);
    return [m, wires, p.c * p.t - wires];
  },
});
})();
