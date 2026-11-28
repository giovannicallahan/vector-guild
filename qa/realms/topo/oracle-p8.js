/* Independent oracles for Topology: shape without size practice missions, file 8 of 8: q36b–q40d (game/realms/topo/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
/* A loop is a list of signed crossings of the marker line: +1 anticlockwise, -1 clockwise. Joining = concatenating,
   running backwards = reversing the list and flipping every sign; the winding number is the sum of the list. */
const loopOf = (up, down) => [].concat(Array(up).fill(1), Array(down).fill(-1));
const join = (...ls) => [].concat(...ls);
const back = l => l.slice().reverse().map(v => -v);
const wind = l => l.reduce((s, v) => s + v, 0);
const rep = (l, n) => join(...Array(n).fill(l));
/* Winding number of a loop of crossings under the map theta -> m*theta: every crossing becomes |m| crossings of sign sgn(m)*v. */
const mapLoop = (l, m) => join(...l.map(v => Array(Math.abs(m)).fill(m < 0 ? -v : v)));
/* Winding numbers round posts 0..n-1: each circuit is [first post, last post, turns], a post is round by a circuit when
   its index lies in the stated range; the loops are joined, so the turns add. */
const windAround = (n, circuits) => {
  const out = [];
  for (let r = 0; r < n; r++) { let w = 0; for (const [i, j, t] of circuits) if (r >= i && r <= j) w += t; out.push(w); }
  return out;
};
/* Graphs: edge lists on numbered vertices; independent loops counted as the edges that join two vertices already
   connected when the edges are added one by one (union-find), so loops = edges that close a cycle. */
const loopsOf = (V, edges) => {
  const par = Array.from({ length: V }, (_, i) => i);
  const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  let closing = 0;
  for (const [a, b] of edges) { const ra = find(a), rb = find(b); if (ra === rb) closing++; else par[ra] = rb; }
  let comps = 0; for (let i = 0; i < V; i++) if (find(i) === i) comps++;
  return { closing, comps };
};
/* Zero of g on [lo, hi] by halving the interval where g changes sign (g(lo) and g(hi) of opposite sign). */
const bisect = (g, lo, hi) => {
  let a = lo, b = hi; const sa = Math.sign(g(a));
  for (let k = 0; k < 200; k++) { const m = (a + b) / 2; if (Math.sign(g(m)) === sa) a = m; else b = m; }
  return (a + b) / 2;
};
/* Number of sign changes of g over [lo, hi] on a fine grid: the prompts say the fixed point is the only one. */
const signChanges = (g, lo, hi) => {
  let n = 0, prev = g(lo); const N = 20000;
  for (let k = 1; k <= N; k++) { const v = g(lo + (hi - lo) * k / N); if (v === 0 || (prev < 0) !== (v < 0)) n++; prev = v; }
  return n;
};
const only = (g, lo, hi) => { if (signChanges(g, lo, hi) !== 1) throw new Error('not exactly one fixed point'); return bisect(g, lo, hi); };
Object.assign(window.ORACLE, {
  /* u = anticlockwise crossings and d = clockwise crossings, for p (1) and q (2): each loop is a list of crossings. */
  q36b: p => {
    const P = loopOf(p.u1, p.d1), Q = loopOf(p.u2, p.d2);
    return [wind(P), wind(Q), wind(join(P, back(Q), P))];
  },
  /* wa, wb, wc = winding numbers of a, b, c (a loop of winding w is |w| single laps the right way round); T = the target.
     Extra anticlockwise laps are added one at a time until the winding number reaches T. */
  q36c: p => {
    const lap = w => loopOf(w > 0 ? w : 0, w < 0 ? -w : 0);
    const A = lap(p.wa), B = lap(p.wb), C = lap(p.wc);
    const run = join(A, back(B), A, C);
    const backRun = back(run);
    let n = 0; while (n < 1000 && wind(run) + n < p.T) n++;
    return [wind(run), wind(backRun), n];
  },
  /* Sectors 0 NE, 1 NW, 2 SW, 3 SE in anticlockwise order; j = which border is used as the ray: the ray between sector j and
     sector j+1 (0 north, 1 west, 2 south, 3 east). a and b are the sector sequences logged. Winding number = anticlockwise
     crossings of that ray minus clockwise ones. */
  q36d: p => {
    const cross = seq => {
      const l = [];
      for (let k = 0; k + 1 < seq.length; k++) {
        const s = seq[k], t = seq[k + 1];
        if (s === p.j && t === (p.j + 1) % 4) l.push(1);
        else if (t === p.j && s === (p.j + 1) % 4) l.push(-1);
      }
      return l;
    };
    const A = cross(p.a), B = cross(p.b);
    return [wind(A), wind(B), wind(join(A, A, back(B)))];
  },
  /* a, b, c = the three factors (the sign gives the direction); k = the whole number of times the test loop goes round, an
     index of nothing else: the printed image winding number is k times the degree. The degree is found by lifting the image of a
     fine ring of M equally spaced angles (step by step, the shortest way round); the preimages of angle 0 are counted
     over the same ring. */
  q37b: p => {
    const M = 64 * 27 * 5 * 7, mod = x => ((x % M) + M) % M;
    const comb = j => mod(p.c * mod(p.b * mod(p.a * j)));
    let lift = 0, zeros = 0;
    for (let j = 0; j < M; j++) {
      let d = mod(comb((j + 1) % M) - comb(j)); if (d > M / 2) d -= M;
      lift += d;
      if (comb(j) === 0) zeros++;
    }
    const deg = lift / M, printed = deg * p.k;
    let w = null; for (let t = -1000; t <= 1000; t++) if (deg * t === printed) w = t;
    return [deg, zeros, w];
  },
  /* p, q = stage factors (magnitude), s1, s2 = +1 same direction / -1 opposite; k1 = laps of the input on the first run;
     T = signed turns the mast must make on the second run (negative = clockwise). k2 is not used: the input winding is found by
     searching the whole numbers for the one the drive turns into T. */
  q37c: p => {
    const deg = p.s1 * p.p * p.s2 * p.q;
    let w = null; for (let t = -1000; t <= 1000; t++) if (deg * t === p.T) w = t;
    return [deg, deg * p.k1, w];
  },
  /* wa, wb = winding numbers; "a x times in a row, then b backwards y times". Degree of g after f (f = a, g = b): scale the
     crossings of a loop through each map in turn. */
  q37d: p => {
    const lap = w => loopOf(w > 0 ? w : 0, w < 0 ? -w : 0);
    const route = join(rep(lap(p.wa), p.x), rep(back(lap(p.wb)), p.y));
    const image = mapLoop(mapLoop(route, p.a), p.b);
    const one = mapLoop(mapLoop(loopOf(1, 0), p.a), p.b);
    return [wind(route), wind(one), wind(image)];
  },
  /* nm indexes a list of names only. kind 0 prism of x-gons, 1 ladder of x rungs, 2 strip of x square cells each with one
     diagonal, 3 ring of x junctions with two hubs. Built vertex by vertex and edge by edge, then counted. */
  q38b: p => {
    const x = p.x; let V = 0, E = [];
    if (p.kind === 0) {
      V = 2 * x;
      for (let i = 0; i < x; i++) { E.push([i, (i + 1) % x], [x + i, x + (i + 1) % x], [i, x + i]); }
    } else if (p.kind === 1) {
      V = 2 * x;
      for (let i = 0; i < x; i++) E.push([i, x + i]);
      for (let i = 0; i + 1 < x; i++) E.push([i, i + 1], [x + i, x + i + 1]);
    } else if (p.kind === 2) {
      V = 2 * (x + 1);                       // column c holds vertices 2c (bottom) and 2c+1 (top)
      for (let c = 0; c <= x; c++) E.push([2 * c, 2 * c + 1]);
      for (let c = 0; c < x; c++) E.push([2 * c, 2 * c + 2], [2 * c + 1, 2 * c + 3], [2 * c, 2 * c + 3]);
    } else {
      V = x + 2;
      for (let i = 0; i < x; i++) E.push([i, (i + 1) % x], [i, x], [i, x + 1]);
    }
    return [V, E.length, loopsOf(V, E).closing];
  },
  /* V junctions, E pipes, connected: lay the pipes as a path through all junctions plus E-(V-1) extra pipes, count loops as the
     pipes that close a cycle. Then add a junction on one pipe and m more pipes between old junctions. */
  q38c: p => {
    const build = (V, E, extraV, extraE) => {
      const edges = []; for (let i = 0; i + 1 < V; i++) edges.push([i, i + 1]);
      let a = 0, b = 2; while (edges.length < E) { edges.push([a % V, b % V]); a += 1; b += 3; if (a % V === b % V) b++; }
      let n = V;
      for (let i = 0; i < extraV; i++) { edges.push([0, n]); n++; }
      for (let i = 0; i < extraE; i++) { edges.push([i % n, (i + 2) % n]); }
      return { V: n, edges };
    };
    const g0 = build(p.V, p.E, 0, 0), g1 = build(p.V, p.E, 1, p.m);
    return [loopsOf(g0.V, g0.edges).closing, g1.edges.length, loopsOf(g1.V, g1.edges).closing];
  },
  /* Wheel of s spokes (hub + s rim junctions, 2s cables), a w-by-h grid of cells, and j cables linking them. Counted from vertex
     and edge lists; the loops are the edges that close a cycle (the network is in one piece). */
  q38d: p => {
    const E = []; let V = p.s + 1;               // wheel: hub 0, rim 1..s
    for (let i = 1; i <= p.s; i++) { E.push([0, i], [i, i % p.s + 1]); }
    const base = V, id = (c, r) => base + r * (p.w + 1) + c;
    V += (p.w + 1) * (p.h + 1);
    for (let r = 0; r <= p.h; r++) for (let c = 0; c <= p.w; c++) { if (c < p.w) E.push([id(c, r), id(c + 1, r)]); if (r < p.h) E.push([id(c, r), id(c, r + 1)]); }
    for (let k = 0; k < p.j; k++) E.push([1 + k, id(k % (p.w + 1), 0)]);
    const { closing, comps } = loopsOf(V, E);
    if (comps !== 1) throw new Error('network not in one piece');
    return [V, E.length, V - E.length, closing];
  },
  /* g(x) = f(x) - x with f(x) = (x^3 + k)/d on [0, L]: g(0), g(L), and the zero of g by halving. */
  q39b: p => {
    const g = x => (x * x * x + p.k) / p.d - x;
    return [rd(g(0), 6), rd(g(p.L), 6), rd(only(g, 0, p.L), 2)];
  },
  /* nm indexes a list of names only. f(x) = (P - x^3)/d; start at x0, apply f twice, then the fixed point by halving. */
  q39c: p => {
    const f = x => (p.P - x * x * x) / p.d;
    const x1 = f(p.x0), x2 = f(x1);
    return [rd(x1, 6), rd(x2, 2), rd(only(x => f(x) - x, 0, p.L), 2)];
  },
  /* f(x) = (x^2 + P)/d on [lo, hi], increasing there: smallest and largest values are at the ends. The fixed point by halving. */
  q39d: p => {
    const f = x => (x * x + p.P) / p.d;
    let mn = Infinity, mx = -Infinity;
    for (let k = 0; k <= 3000; k++) { const v = f(p.lo + (p.hi - p.lo) * k / 3000); if (v < mn) mn = v; if (v > mx) mx = v; }
    return [rd(mn, 6), rd(mx, 6), rd(only(x => f(x) - x, p.lo, p.hi), 3)];
  },
  /* Posts W X Y Z = 0..3. Circuits are [first post, last post, turns] with turns negative for clockwise. */
  q40b: p => windAround(4, [[p.i1, p.j1, p.t1], [p.i2, p.j2, p.t2], [p.i3, p.j3, p.t3]]),
  /* Meters A B C = 0..2; c = units per net turn. */
  q40c: p => {
    const w = windAround(3, [[p.i1, p.j1, p.t1], [p.i2, p.j2, p.t2], [p.i3, p.j3, p.t3]]);
    const tot = w[0] + w[1] + w[2];
    return [w[1], tot, p.c * tot];
  },
  /* Sensors A..E = 0..4. u has tu turns round i1..j1, v has tv turns round i2..j2; the survey is u, v backwards, u. */
  q40d: p => {
    const w = windAround(5, [[p.i1, p.j1, 2 * p.tu], [p.i2, p.j2, -p.tv]]);
    return [w[2], w.filter(v => v === 0).length, w.reduce((s, v) => s + v, 0)];
  }
});
})();
