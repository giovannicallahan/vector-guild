/* Independent oracles for Graph theory: networks practice missions, file 8 of 8: q36b–q40d (game/realms/graph/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Count the k-subsets of 1..n by walking through them (no formula). */
const subsets = (n, k, keep) => { let count = 0; const go = (start, chosen) => { if (chosen.length === k) { if (!keep || keep(chosen)) count++; return; } for (let x = start; x <= n; x++) go(x + 1, chosen.concat(x)); }; go(1, []); return count; };
/* Degrees of a tree from its Prüfer code: replay the decoding, joining the smallest leaf to each code entry in turn. */
const decode = code => {
  const n = code.length + 2, deg = Array(n + 1).fill(1), edges = [];
  code.forEach(c => deg[c]++);
  code.forEach(c => { for (let leaf = 1; leaf <= n; leaf++) if (deg[leaf] === 1) { edges.push([leaf, c]); deg[leaf]--; deg[c]--; break; } });
  const last = []; for (let x = 1; x <= n; x++) if (deg[x] === 1) last.push(x);
  edges.push(last);
  const d = Array(n + 1).fill(0); edges.forEach(([a, b]) => { d[a]++; d[b]++; });
  return { n, d, edges };
};
/* Clique, independence and colouring numbers of a graph by search over all vertex sets / colour assignments. */
const graphNums = (n, edges) => {
  const adj = Array.from({ length: n + 1 }, () => Array(n + 1).fill(false));
  edges.forEach(([a, b]) => { adj[a][b] = adj[b][a] = true; });
  let omega = 1, alpha = 1;
  for (let mask = 1; mask < (1 << n); mask++) {
    const vs = []; for (let i = 0; i < n; i++) if (mask & (1 << i)) vs.push(i + 1);
    let all = true, none = true;
    for (let i = 0; i < vs.length; i++) for (let j = i + 1; j < vs.length; j++) { if (adj[vs[i]][vs[j]]) none = false; else all = false; }
    if (all) omega = Math.max(omega, vs.length);
    if (none) alpha = Math.max(alpha, vs.length);
  }
  const colourable = k => { const col = Array(n + 1).fill(0); const go = v => { if (v > n) return true; for (let c = 1; c <= k; c++) { let ok = true; for (let u = 1; u < v; u++) if (adj[u][v] && col[u] === c) { ok = false; break; } if (ok) { col[v] = c; if (go(v + 1)) return true; col[v] = 0; } } return false; }; return go(1); };
  let chi = 1; while (!colourable(chi)) chi++;
  return { omega, alpha, chi };
};
Object.assign(window.ORACLE, {
  /* q36b: p.code is the Prüfer code; masts are 1..len+2. Most links at one mast, then the number of leaves. */
  q36b: p => { const t = decode(p.code); const ds = t.d.slice(1); return [Math.max(...ds), ds.filter(x => x === 1).length]; },
  /* q36c: cables = domes - 1, leaves, cost of the lamps (p.c credits each). */
  q36c: p => { const t = decode(p.code); const leaves = t.d.slice(1).filter(x => x === 1).length; return [t.edges.length, leaves, leaves * p.c]; },
  /* q36d: p.v is a dome number (not an index into a list). Degree in the decoded tree, all labelled trees = codes, codes with v absent. */
  q36d: p => {
    const t = decode(p.code), n = t.n, len = n - 2;
    let trees = 1, notV = 1; for (let i = 0; i < len; i++) { trees *= n; notV *= n - 1; }
    return [t.d[p.v], trees, notV];
  },
  /* q37b: p.edges lists the disturbing pairs; masts 1..8 (a mast in no pair still counts). Largest all-linked set, largest no-link set. */
  q37b: p => { const g = graphNums(8, p.edges); return [g.omega, g.alpha]; },
  /* q37c: ring of p.N servers, p.c credits each: largest set with no two neighbours (found by search), cost, the rest. */
  q37c: p => {
    let best = 0;
    for (let mask = 0; mask < (1 << p.N); mask++) {
      let ok = true, size = 0;
      for (let i = 0; i < p.N; i++) if (mask & (1 << i)) { size++; if (mask & (1 << ((i + 1) % p.N))) { ok = false; break; } }
      if (ok && size > best) best = size;
    }
    return [best, best * p.c, p.N - best];
  },
  /* q37d: p.v servers, p.edges links: clique number, independence number, chromatic number. */
  q37d: p => { const g = graphNums(p.v, p.edges); return [g.omega, g.alpha, g.chi]; },
  /* q38b: triangles of K_N by listing triples; those containing depot p.v. */
  q38b: p => [subsets(p.N, 3), subsets(p.N, 3, s => s.includes(p.v))],
  /* q38c: triangles and 4-cliques of K_N by listing; total cost a per triangle, b per 4-clique. */
  q38c: p => { const t = subsets(p.N, 3), q = subsets(p.N, 4); return [t, q, t * p.a + q * p.b]; },
  /* q38d: K_N minus dome p.v; p.k is the clique size asked for in the third part. Count by listing sets that avoid p.v. */
  q38d: p => {
    const left3 = subsets(p.N, 3, s => !s.includes(p.v));
    return [left3, subsets(p.N, 3, s => s.includes(p.v)), subsets(p.N, p.k, s => !s.includes(p.v))];
  },
  /* q39b: p.v is only which archivist is named. The others split into two groups, so the bigger has at least half
     of them rounded up; a trio is certain exactly from 6 people on (Ramsey R(3,3) = 6; a pentagon-and-pentagram colouring of 5 avoids it). */
  q39b: p => {
    const others = p.N - 1; let k = 0; while (2 * k < others) k++;
    /* check the group bound against an even split: with others split k-1 and others-(k-1), the bigger has k. */
    return [k, p.N >= 6 ? 1 : 0];
  },
  /* q39c: links = pairs of domes; the larger kind has at least half rounded up; same at one dome with the other N-1 links. */
  q39c: p => { const half = m => { let k = 0; while (2 * k < m) k++; return k; }; const links = subsets(p.N, 2); return [links, half(links), half(p.N - 1)]; },
  /* q39d: three blocks of sizes a, b, c. Cable = same block, beam = different blocks. Check every triple of domes. */
  q39d: p => {
    const block = []; [p.a, p.b, p.c].forEach((s, i) => { for (let j = 0; j < s; j++) block.push(i); });
    let cable = 0, beam = 0, mixed = 0;
    for (let x = 0; x < block.length; x++) for (let y = x + 1; y < block.length; y++) for (let z = y + 1; z < block.length; z++) {
      const same = (block[x] === block[y]) + (block[y] === block[z]) + (block[x] === block[z]);
      if (same === 3) cable++; else if (same === 0) beam++; else mixed++;
    }
    return [cable, beam, mixed];
  },
  /* q40b: m rows by k columns of panels on a torus: build the grid with wrap-around and count corners, sides, panels; V - E + F. */
  q40b: p => {
    const corners = new Set(), sides = new Set(), faces = new Set();
    for (let r = 0; r < p.m; r++) for (let c = 0; c < p.k; c++) {
      const r2 = (r + 1) % p.m, c2 = (c + 1) % p.k;
      corners.add(r + ',' + c);
      sides.add('h' + r + ',' + c); sides.add('v' + r + ',' + c);
      faces.add(r + ',' + c + '|' + r2 + ',' + c2);
    }
    return [corners.size, sides.size, corners.size - sides.size + faces.size];
  },
  /* q40c: p.m channels one way and p.k the other: crossings m*k, stretches 2 per crossing, beds one per crossing.
     Cost: p.s per pump, p.c per pipe, p.p per planter. */
  q40c: p => {
    let crossings = 0, stretches = 0, beds = 0;
    for (let i = 0; i < p.m; i++) for (let j = 0; j < p.k; j++) { crossings++; stretches += 2; beds++; }
    return [stretches, beds, crossings * p.s + stretches * p.c + beds * p.p];
  },
  /* q40d: a rows by b columns grid. Flat map: Euler V - E + F = 2 gives F; wrapping adds one stretch per row and per column; torus V - E + F = 0. */
  q40d: p => {
    const V = p.a * p.b, E = p.a * (p.b - 1) + p.b * (p.a - 1), flat = 2 - V + E;
    const added = p.a + p.b, torus = (E + added) - V;
    return [flat, added, torus];
  },
});
})();
