/* Independent oracles for Topology: shape without size practice missions, file 4 of 8: q16b–q20d (game/realms/topo/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Printed function from the draw: kind K: s(x^3 - 3k x^2) + c; kind F: s(x^4 - 2m^2 x^2) + c; kind Q: s(x - h)^2 + c
   (the parameters s, k, m, h, c are the printed coefficients; they are not indices into text). */
const fn = f => {
  if (f.kind === 'K') return x => f.s * (x * x * x - 3 * f.k * x * x) + f.c;
  if (f.kind === 'F') return x => f.s * (x * x * x * x - 2 * f.m * f.m * x * x) + f.c;
  return x => f.s * (x - f.h) * (x - f.h) + f.c;
};
/* Numerical scan of g over [a, b] in steps of 1/1000 (the extremes of every printed function sit at whole numbers). */
const scan = (g, a, b) => {
  let hi = -Infinity, lo = Infinity, at = null;
  for (let i = a * 1000; i <= b * 1000; i++) { const v = g(i / 1000); if (v > hi) { hi = v; at = i / 1000; } if (v < lo) lo = v; }
  return { hi: Math.round(hi), lo: Math.round(lo), at };
};
/* Open intervals of length L (= L10 / 10) needed to cover the closed interval [a, b]: k intervals work only when k L > b - a. */
const beams = (a, b, L10) => { let k = 1; while (k * L10 <= 10 * (b - a)) k++; return k; };
/* Pieces [a, b, closedLeft, closedRight] (a = b is an isolated point). Membership of x. */
const inS = (pieces, x) => pieces.some(([a, b, lo, hi]) => (x > a && x < b) || (x === a && lo === 1) || (x === b && hi === 1));
/* Components: sample every half unit (all end points are whole numbers) and count runs of consecutive samples in S. */
const comps = pieces => {
  const ends = [].concat(...pieces.map(q => [q[0], q[1]]));
  const lo = Math.min(...ends) - 1, hi = Math.max(...ends) + 1;
  let runs = 0, prev = false;
  for (let x = lo; x <= hi; x += 0.5) { const m = inS(pieces, x); if (m && !prev) runs++; prev = m; }
  return runs;
};
/* Boundary points: a whole-number end point c where a tiny ball round c holds points in S and points outside S. */
const bdry = pieces => {
  const ends = [...new Set([].concat(...pieces.map(q => [q[0], q[1]])))];
  const e = 1e-6; let n = 0;
  for (const c of ends) { const s = [inS(pieces, c - e), inS(pieces, c), inS(pieces, c + e)]; if (s.some(v => v) && s.some(v => !v)) n++; }
  return n;
};
/* Square or n-gon words: w[i] = [letter index, sign]; sign +1 = arrow clockwise (corner i to i+1), -1 = the other way.
   Corners are joined by a flood fill over the "same corner" links made by each pair of edges with the same letter. */
const sew = w => {
  const n = w.length, link = Array.from({ length: n }, () => []);
  const ends = i => w[i][1] === 1 ? [i, (i + 1) % n] : [(i + 1) % n, i]; // [tail, head]
  const letters = new Map();
  w.forEach((e, i) => { if (!letters.has(e[0])) letters.set(e[0], []); letters.get(e[0]).push(i); });
  let pairs = 0, single = 0;
  for (const idx of letters.values()) {
    if (idx.length === 2) {
      pairs++;
      const [t1, h1] = ends(idx[0]), [t2, h2] = ends(idx[1]);
      link[t1].push(t2); link[t2].push(t1); link[h1].push(h2); link[h2].push(h1);
    } else single += idx.length;
  }
  const seen = new Array(n).fill(false); let V = 0;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue; V++;
    const st = [s]; seen[s] = true;
    while (st.length) { const u = st.pop(); for (const v of link[u]) if (!seen[v]) { seen[v] = true; st.push(v); } }
  }
  return { V, pairs, single, E: pairs + single };
};
Object.assign(window.ORACLE, {
  /* T(x) on [a, b]: scan. */
  q16b: p => { const r = scan(fn(p.f), p.a, p.b); return [r.hi, r.lo]; },
  /* Fence 4m metres on three sides, depth x in [lo, hi]: A(x) = x (4m - 2x). Answers: depth of the largest, largest, smallest. */
  q16c: p => { const r = scan(x => x * (4 * p.m - 2 * x), p.lo, p.hi); return [r.at, r.hi, r.lo]; },
  /* F(x) on [a, b]: highest, lowest, and the whole numbers from lowest to highest counted one by one. */
  q16d: p => { const r = scan(fn(p.f), p.a, p.b); let n = 0; for (let v = r.lo; v <= r.hi; v++) n++; return [r.hi, r.lo, n]; },
  /* Components of S, fewest open beams (L10 / 10 metres) for [a, b], largest g on [a, b]. */
  q17b: p => [comps(p.pieces), beams(p.a, p.b, p.L10), scan(fn(p.f), p.a, p.b).hi],
  /* Clamps of length L10 / 10, cost each; margin = T - largest strain. */
  q17c: p => { const k = beams(p.a, p.b, p.L10); return [k, k * p.cost, p.T - scan(fn(p.f), p.a, p.b).hi]; },
  /* Components, boundary points, beams, largest f. */
  q17d: p => [comps(p.pieces), bdry(p.pieces), beams(p.a, p.b, p.L10), scan(fn(p.f), p.a, p.b).hi],
  /* Square word w: distinct corner points and distinct edges (a sewn pair is one edge, an unsewn edge is one edge). */
  q18b: p => { const r = sew(p.w); return [r.V, r.E]; },
  /* m identical panels: studs = m V; cost = m (c1 per seam + c2 per unsewn edge). */
  q18c: p => { const r = sew(p.w); return [p.m * r.V, p.m * (r.pairs * p.c1 + r.single * p.c2)]; },
  /* n-gon word w. */
  q18d: p => { const r = sew(p.w); return [r.V, r.E]; },
  /* base is an index: 0 sphere, 1 torus, 2 Klein bottle, 3 disc, -1 strip with t half-twists (odd = Moebius strip, even = cylinder).
     Boundary circles and orientability of each start; each porthole adds one circle and does not change orientability. */
  q19b: p => {
    let circles, orientable;
    if (p.base === 0 || p.base === 1) { circles = 0; orientable = true; }
    else if (p.base === 2) { circles = 0; orientable = false; }
    else if (p.base === 3) { circles = 1; orientable = true; }
    else { orientable = p.t % 2 === 0; circles = orientable ? 2 : 1; }
    return [circles + p.k, orientable ? 1 : 0];
  },
  /* d discs, y cylinders, m Moebius strips, t pairs of trousers: tally circles panel by panel. */
  q19c: p => {
    const kinds = [[p.d, 1, true], [p.y, 2, true], [p.m, 1, false], [p.t, 3, true]];
    let circles = 0, non = 0;
    for (const [n, b, o] of kinds) for (let i = 0; i < n; i++) { circles += b; if (!o) non++; }
    return [circles, non, circles * p.c];
  },
  /* s[i] = [left arrow up (1) or down (0), right arrow up/down, holes]. Same direction = cylinder (2 circles), opposite = Moebius (1). */
  q19d: p => {
    let circles = 0, non = 0;
    for (const [l, r, h] of p.s) { if (l === r) circles += 2 + h; else { circles += 1 + h; non++; } }
    return [circles, non];
  },
  /* Build the cell division explicitly and count its pieces. */
  q20b: p => {
    const V = new Set(), E = new Set(), F = [];
    const edge = (u, v) => E.add(u < v ? u + '|' + v : v + '|' + u);
    const a = p.a, b = p.b;
    if (p.kind === 'antiprism') {
      for (let i = 0; i < a; i++) {
        V.add('T' + i); V.add('B' + i);
        edge('T' + i, 'T' + (i + 1) % a); edge('B' + i, 'B' + (i + 1) % a);
        edge('T' + i, 'B' + i); edge('T' + i, 'B' + (i + a - 1) % a);
        F.push(['T' + i, 'T' + (i + 1) % a, 'B' + i]); F.push(['B' + i, 'B' + (i + 1) % a, 'T' + (i + 1) % a]);
      }
      F.push(['top ring']); F.push(['bottom ring']);
    } else if (p.kind === 'bipyramid') {
      V.add('N'); V.add('S');
      for (let i = 0; i < a; i++) {
        V.add('R' + i); edge('R' + i, 'R' + (i + 1) % a); edge('N', 'R' + i); edge('S', 'R' + i);
        F.push(['N', 'R' + i, 'R' + (i + 1) % a]); F.push(['S', 'R' + i, 'R' + (i + 1) % a]);
      }
    } else {
      for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) {
        V.add(i + ',' + j);
        /* a tile edge is named by its tile corner and direction, so two edges that join the same pair of corners (a = 2 or b = 2) stay two edges */
        E.add('h' + i + ',' + j); E.add('v' + i + ',' + j);
        F.push([i, j]);
      }
    }
    return [V.size, E.size, F.length, V.size - E.size + F.length];
  },
  /* Euler characteristic of the surface: sphere 2, torus 0, disc 1 (surf 0, 1, 2 is an index into those). The missing count
     (miss 0 = corner joints, 1 = struts, 2 = panels) is found from V - E + F = chi by trying values; the price multiplies it. */
  q20c: p => {
    const chi = [2, 0, 1][p.surf];
    let ans = null;
    for (let x = 0; x <= 400 && ans === null; x++) {
      const V = p.miss === 0 ? x : p.V, E = p.miss === 1 ? x : p.E, F = p.miss === 2 ? x : p.F;
      if (V - E + F === chi) ans = x;
    }
    return [ans, ans * p.price];
  },
  /* a x b torus tiling with k tiles removed: count faces left, V - E + F, and one boundary circle per removed tile. */
  q20d: p => {
    const V = new Set(), E = new Set(); let F = 0;
    for (let i = 0; i < p.a; i++) for (let j = 0; j < p.b; j++) {
      V.add(i + ',' + j); E.add('h' + i + ',' + j); E.add('v' + i + ',' + j); F++;
    }
    F -= p.k;
    return [F, V.size - E.size + F, p.k];
  },
});
})();
