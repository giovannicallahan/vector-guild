/* Independent oracles for Topology: shape without size practice missions, file 5 of 8: q21b–q25d (game/realms/topo/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (explicit counting, breadth-first search over the
   corners and the boundary edges, repeated connected sums, a search for the genus).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Breadth-first search: number the connected pieces of a graph on n nodes given its edge pairs; returns {comp, sizes}. */
const pieces = (n, pairs) => {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) { adj[a].push(b); adj[b].push(a); }
  const comp = new Array(n).fill(-1), sizes = [];
  for (let s = 0; s < n; s++) {
    if (comp[s] >= 0) continue;
    const id = sizes.length; let size = 0; const queue = [s]; comp[s] = id;
    while (queue.length) {
      const x = queue.shift(); size++;
      for (const y of adj[x]) if (comp[y] < 0) { comp[y] = id; queue.push(y); }
    }
    sizes.push(size);
  }
  return { comp, sizes };
};
/* Corner identifications of a polygon word. Corner c (0-based) is the start of edge c; edge c ends at corner c+1.
   A plain letter has tail at its start corner and tip at its end corner; with exponent −1 they swap. Two edges with
   the same letter are sewn tail to tail and tip to tip, so those corner pairs are glued. */
const gluePairs = w => {
  const n = w.length, pairs = [], at = {};
  w.forEach((x, i) => {
    if (x.free) return;
    const start = i, end = (i + 1) % n;
    const tail = x.e === 1 ? start : end, tip = x.e === 1 ? end : start;
    (at[x.L] = at[x.L] || []).push({ tail, tip });
  });
  let letters = 0;
  for (const L of Object.keys(at)) {
    letters++;
    pairs.push([at[L][0].tail, at[L][1].tail], [at[L][0].tip, at[L][1].tip]);
  }
  return { n, pairs, letters };
};
/* Sew a word: vertex classes, number of lettered edges, free-edge count, boundary circles (pieces of the free edges). */
const sewn = w => {
  const g = gluePairs(w), pc = pieces(g.n, g.pairs);
  const free = []; w.forEach((x, i) => { if (x.free) free.push(i); });
  /* a free edge i joins the vertex classes of corners i and i+1; count the pieces that contain at least one free edge */
  const cls = pc.sizes.length, edgePairs = free.map(i => [pc.comp[i], pc.comp[(i + 1) % g.n]]);
  const bd = pieces(cls, edgePairs);
  const used = new Set(); for (const i of free) used.add(bd.comp[pc.comp[i]]);
  return { V: cls, letters: g.letters, free: free.length, circles: used.size, corners: pc.sizes };
};
/* Euler characteristics by index in the printed table: 0 sphere 2, 1 torus 0, 2 projective plane 1, 3 Klein bottle 0
   (an index into the printed list only). */
const CHI = [2, 0, 1, 0];
const join = (a, b) => a + b - 2;
Object.assign(window.ORACLE, {
  /* Wheel of k posts plus a hub: count spokes and rim cables one post at a time. s indexes the hull (0 sphere χ 2, 1 torus χ 0);
     b vents each lower χ by 1. */
  q21b: p => {
    let E = 0; for (let post = 1; post <= p.k; post++) E += 2;
    const V = p.k + 1, chiHull = [2, 0][p.s] - p.b;
    return [E, V - E, [2, 0][p.s] - chiHull];
  },
  /* m rows and c columns of boxes; count cables by walking the grid; d braces; s indexes the hull (0 sphere, 1 torus). */
  q21c: p => {
    let E = 0;
    for (let r = 0; r < p.m; r++) for (let c = 0; c < p.c; c++) { if (c < p.c - 1) E++; if (r < p.m - 1) E++; }
    E += p.d;
    const chi = p.m * p.c - E;
    return [E, chi, [2, 0][p.s] - chi];
  },
  /* Two rails of p posts and p rungs; a Möbius strip (χ 0, 1 boundary circle) with t holes. */
  q21d: p => {
    let E = 0; for (let i = 0; i < p.p; i++) { E += 1; if (i < p.p - 1) E += 2; }
    let chi = 0, circles = 1; for (let i = 0; i < p.t; i++) { chi--; circles++; }
    return [E, 2 * p.p - E, chi, circles];
  },
  /* Word w sewn by breadth-first search over corner pairs: V classes, E = lettered pairs, χ = V − E + 1. */
  q22b: p => { const s = sewn(p.w); return [s.letters, s.V, s.V - s.letters + 1]; },
  /* Letter a, b, c, … has length lens[0], lens[1], …; one tape strip per letter; patches = vertex classes. */
  q22c: p => {
    const s = sewn(p.w); let tape = 0;
    const done = new Set();
    for (const x of p.w) if (!done.has(x.L)) { done.add(x.L); tape += p.lens[x.L.charCodeAt(0) - 97]; }
    return [s.V, tape, s.V - s.letters + 1];
  },
  /* Vertex classes and the biggest class by corner count. */
  q22d: p => { const s = sewn(p.w); return [s.V, Math.max(...s.corners), s.V - s.letters + 1]; },
  /* Boundary circles are the pieces of the free edges after sewing; capping each adds a face. */
  q23b: p => {
    const s = sewn(p.w), chi = s.V - (s.letters + s.free) + 1;
    return [s.V, s.circles, chi + s.circles];
  },
  /* len metres per free edge at tape kg per metre, cap kg per boundary circle. */
  q23c: p => {
    const s = sewn(p.w), chi = s.V - (s.letters + s.free) + 1;
    return [s.circles, chi + s.circles, s.free * p.len * p.tape + s.circles * p.cap];
  },
  /* Panel χ; cap k circles (each disc adds 1 to χ and removes a circle); cut p portholes (each −1 χ, +1 circle). */
  q23d: p => {
    const s = sewn(p.w), chi = s.V - (s.letters + s.free) + 1;
    let circles = s.circles, c = chi;
    for (let i = 0; i < p.k; i++) { circles--; c++; }
    for (let i = 0; i < p.p; i++) { circles++; c--; }
    return [s.circles, chi, circles, c];
  },
  /* a, b, c, d index the printed table (0 sphere, 1 torus, 2 projective plane, 3 Klein bottle). */
  q24b: p => {
    const first = join(CHI[p.a], CHI[p.b]);
    return [first, join(join(first, CHI[p.c]), CHI[p.d])];
  },
  /* x indexes the printed table; m pods joined one at a time by m − 1 tubes of w kg. */
  q24c: p => {
    let chi = CHI[p.x], tubes = 0, first = null;
    for (let i = 2; i <= p.m; i++) { chi = join(chi, CHI[p.x]); tubes++; if (i === 2) first = chi; }
    return [first, chi, tubes * p.w];
  },
  /* a, b index the printed table; pa, pb portholes. */
  q24d: p => {
    const A = CHI[p.a] - p.pa, B = CHI[p.b] - p.pb;
    return [A, B, join(A, B)];
  },
  /* Genus: join tori onto a sphere one at a time until χ is −2h... the first shell has χ = 2 − 2h (h is a count of arms
     used to print "Euler characteristic −(2h − 2)"); find its genus by search. The second has g arms. */
  q25b: p => {
    const target = 2 - 2 * p.h;
    let chi = 2, genus = 0;
    while (chi > target) { chi = join(chi, 0); genus++; }
    let second = 2; for (let i = 0; i < p.g; i++) second = join(second, 0);
    return [genus, second];
  },
  /* Shell of genus g has χ = 2 − 2g; merge by the stated rule; genus of the result found by search on χ = 2 − 2G. */
  q25c: p => {
    const c1 = 2 - 2 * p.g1, c2 = 2 - 2 * p.g2, m = join(c1, c2);
    let G = 0; while (2 - 2 * G > m) G++;
    return [c1, m, G];
  },
  /* Closed hull χ = 2 − 2g; b portholes already cut (printed χ = that minus b); d more cut later. */
  q25d: p => {
    const before = 2 - 2 * p.g;
    let chi = before; for (let i = 0; i < p.b + p.d; i++) chi--;
    return [before, p.g, chi];
  },
});
})();
