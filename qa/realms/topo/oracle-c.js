/* Independent oracles for Topology: shape without size learn missions, file c: q21–q30 (game/realms/topo/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): explicit counting, union-find over the polygon's
   corners, repeated connected sums and searches. Do not import game files. */
(function(){ 'use strict';
/* Union-find over n items. */
const dsu = n => {
  const par = Array.from({ length: n }, (_, i) => i);
  const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  const join = (a, b) => { par[find(a)] = find(b); };
  return { find, join };
};
/* Sew the polygon word w (items {L, e} for a letter with exponent e = +1 or −1, or {free:true}). Edge i (0-based)
   runs from corner i to corner i+1 (mod n). A plain letter has tail at corner i and tip at corner i+1; with ⁻¹ the
   arrow points back, so tail at corner i+1 and tip at corner i. Two edges with one letter are sewn tail to tail and
   tip to tip. Returns the vertex classes, the sewn edges and the free edges. */
const sew = w => {
  const n = w.length, d = dsu(n);
  const ends = i => w[i].e === 1 ? { tail: i, tip: (i + 1) % n } : { tail: (i + 1) % n, tip: i };
  const byLetter = {};
  w.forEach((x, i) => { if (!x.free) (byLetter[x.L] = byLetter[x.L] || []).push(i); });
  let pairs = 0;
  for (const L of Object.keys(byLetter)) {
    const [i, j] = byLetter[L];
    const a = ends(i), b = ends(j);
    d.join(a.tail, b.tail); d.join(a.tip, b.tip); pairs++;
  }
  const roots = new Set(); for (let c = 0; c < n; c++) roots.add(d.find(c));
  const free = []; w.forEach((x, i) => { if (x.free) free.push(i); });
  return { n, d, V: roots.size, pairs, free };
};
/* Orientable iff no letter appears twice with the same exponent. */
const orientable = w => {
  const seen = {};
  for (const x of w) {
    if (x.free) continue;
    (seen[x.L] = seen[x.L] || []).push(x.e);
  }
  return Object.keys(seen).every(L => seen[L][0] !== seen[L][1]);
};
/* Connected sum by the stated rule, applied one surface at a time. */
const csum = (a, b) => a + b - 2;
const SURF = [2, 0, 1, 0]; /* the printed table: index 0 sphere, 1 torus, 2 projective plane, 3 Klein bottle */
Object.assign(window.ORACLE, {
  /* Loom: m rows and c columns of junctions; list every cable. s is an index: 0 sphere (χ 2), 1 torus (χ 0); b portholes. */
  q21: p => {
    const V = p.m * p.c;
    let E = 0;
    for (let r = 0; r < p.m; r++) for (let c = 0; c < p.c; c++) {
      if (c + 1 < p.c) E++;   /* cable to the right neighbour */
      if (r + 1 < p.m) E++;   /* cable to the neighbour below */
    }
    const chi0 = [2, 0][p.s];
    let chi = chi0; for (let i = 0; i < p.b; i++) chi -= 1;
    return [E, V - E, chi];
  },
  /* Polygon word sewn by union-find of corners; E = number of letters; χ = V − E + 1. */
  q22: p => {
    const s = sew(p.w);
    return [s.V, s.pairs, s.V - s.pairs + 1];
  },
  /* Sew the lettered pairs, then join the two ends of each free edge: connected pieces of free edges are the boundary
     circles. The panel has E = pairs + free edges, F = 1. A disc on each circle adds one face. */
  q23: p => {
    const s = sew(p.w), n = s.n, g = dsu(n);
    for (const i of s.free) g.join(s.d.find(i), s.d.find((i + 1) % n));
    const circles = new Set();
    for (const i of s.free) circles.add(g.find(s.d.find(i)));
    const chi = s.V - (s.pairs + s.free.length) + 1;
    return [circles.size, chi, chi + circles.size];
  },
  /* a, b, c index the printed table of surfaces (0 sphere, 1 torus, 2 projective plane, 3 Klein bottle). */
  q24: p => {
    const first = csum(SURF[p.a], SURF[p.b]);
    return [first, csum(first, SURF[p.c])];
  },
  /* Sphere, then join g tori one at a time; the genus for χ = 2 − 2h is found by joining tori until χ matches. */
  q25: p => {
    let chi = 2; for (let i = 0; i < p.g; i++) chi = csum(chi, 0);
    const target = 2 - 2 * p.h;
    let gen = 0, x = 2; while (x > target) { x = csum(x, 0); gen++; }
    return [chi, gen];
  },
  /* Sphere, then sew in cross-caps (a sum with a projective plane, χ 1) one at a time; j is the count whose χ is printed as 2 − j. */
  q26: p => {
    let chi = 2; for (let i = 0; i < p.k; i++) chi = csum(chi, 1);
    const target = 2 - p.j;
    let k = 0, x = 2; while (x > target) { x = csum(x, 1); k++; }
    return [chi, k];
  },
  /* t tori and p projective planes joined on; the standard surface has k cross-caps with χ = 2 − k. */
  q27: p => {
    let chi = 2;
    for (let i = 0; i < p.t; i++) chi = csum(chi, 0);
    for (let i = 0; i < p.p; i++) chi = csum(chi, 1);
    let k = 0, x = 2; while (x > chi) { x = csum(x, 1); k++; }
    return [chi, k];
  },
  q28: p => {
    const s = sew(p.w), chi = s.V - s.pairs + 1, ori = orientable(p.w);
    let third;
    if (ori) { third = 0; let x = 2; while (x > chi) { x = csum(x, 0); third++; } }
    else { third = 0; let x = 2; while (x > chi) { x = csum(x, 1); third++; } }
    return [ori ? 1 : 0, chi, third];
  },
  /* Panel sewn first, then t tori and p projective planes joined on. Orientable only if the panel is and nothing non-orientable is joined. */
  q29: p => {
    const s = sew(p.w);
    let chi = s.V - s.pairs + 1;
    for (let i = 0; i < p.t; i++) chi = csum(chi, 0);
    for (let i = 0; i < p.p; i++) chi = csum(chi, 1);
    const ori = orientable(p.w) && p.p === 0;
    let third = 0, x = 2;
    while (x > chi) { x = csum(x, ori ? 0 : 1); third++; }
    return [chi, ori ? 1 : 0, third];
  },
  /* Sphere of radius s: k = 1 ÷ s²; tank of curvature K: radius by bisection on s² K = 1. */
  q30: p => {
    const k = 1 / (p.s * p.s);
    let lo = 0, hi = 1e6;
    for (let i = 0; i < 300; i++) { const m = (lo + hi) / 2; if (m * m * p.K < 1) lo = m; else hi = m; }
    return [k, (lo + hi) / 2];
  },
});
})();
