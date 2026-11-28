/* Independent oracles for Topology: learn missions, file b: q11–q20 (game/realms/topo/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): lists of open sets, graphs built letter by letter,
   union-find over sewn corners, grids built point by point. Do not import game files. */
(function(){ 'use strict';
const clean = x => Math.round(x * 1e9) / 1e9;
const pc = n => { let c = 0; for (; n; n >>= 1) c += n & 1; return c; };

/* ---- shared: letters of the stencil font as graphs (strokes = edges, corners and ends = vertices). ---- */
const path = (...v) => v.slice(1).map((x, i) => [v[i], x]);
const LETTER = {
  A: [['ap','cl'],['cl','lf'],['ap','cr'],['cr','rf'],['cl','cr']],
  B: [['t','m'],['m','b'],['t','u'],['u','m'],['m','w'],['w','b']],
  C: path('p','q'), I: path('p','q'), J: path('p','q'), S: path('p','q'), U: path('p','q'),
  D: [['t','b'],['t','u'],['u','b']],
  E: [['t','m'],['m','b'],['t','a'],['m','c'],['b','d']],
  F: [['t','m'],['m','b'],['t','a'],['m','c']],
  H: [['l1','lm'],['lm','l2'],['r1','rm'],['rm','r2'],['lm','rm']],
  K: [['s1','m'],['m','s2'],['m','a1'],['m','a2']],
  L: [['t','c'],['c','f']],
  M: path('1','2','3','4','5'), W: path('1','2','3','4','5'),
  N: path('1','2','3','4'), Z: path('1','2','3','4'),
  O: [['1','2'],['2','3'],['3','1']],
  P: [['t','m'],['m','b'],['t','u'],['u','m']],
  R: [['t','m'],['m','b'],['t','u'],['u','m'],['m','g']],
  T: [['l','c'],['c','r'],['c','b']],
  V: [['l','v'],['v','r']],
  X: [['c','1'],['c','2'],['c','3'],['c','4']],
  Y: [['l','j'],['r','j'],['j','b']],
};
/* Smooth away degree-2 vertices (they are not branch points or ends), then compare two graphs by trying every
   relabelling of the vertices that remain. Two letters are homeomorphic exactly when the reduced graphs match. */
const reduce = edges => {
  let E = edges.map(e => e.slice());
  for (;;) {
    const deg = {};
    E.forEach(([a, b]) => { deg[a] = (deg[a] || 0) + 1; deg[b] = (deg[b] || 0) + 1; });
    const v = Object.keys(deg).find(x => deg[x] === 2 && !E.some(e => e[0] === x && e[1] === x));
    if (v === undefined) break;
    const inc = E.filter(e => e[0] === v || e[1] === v);
    const o = inc.map(e => (e[0] === v ? e[1] : e[0]));
    E = E.filter(e => !(e[0] === v || e[1] === v)); E.push([o[0], o[1]]);
  }
  return E;
};
const sameGraph = (E1, E2) => {
  const names = E => [...new Set([].concat(...E))];
  const v1 = names(E1), v2 = names(E2);
  if (v1.length !== v2.length || E1.length !== E2.length) return false;
  const mat = (E, v) => { const m = v.map(() => v.map(() => 0)); E.forEach(([a, b]) => { const i = v.indexOf(a), j = v.indexOf(b); m[i][j]++; if (i !== j) m[j][i]++; }); return m; };
  const A = mat(E1, v1), B = mat(E2, v2), n = v1.length;
  const perm = (used, map) => {
    const k = map.length;
    if (k === n) return true;
    for (let c = 0; c < n; c++) {
      if (used[c]) continue;
      let ok = A[k][k] === B[c][c];
      for (let i = 0; ok && i < k; i++) if (A[k][i] !== B[c][map[i]]) ok = false;
      if (!ok) continue;
      used[c] = true; map.push(c);
      if (perm(used, map)) return true;
      map.pop(); used[c] = false;
    }
    return false;
  };
  return perm([], []);
};
const homeo = (X, Y) => sameGraph(reduce(LETTER[X]), reduce(LETTER[Y]));

/* The cut points of q13 by (letter, p). p is only an index into the list of snip positions printed in the prompt:
   a string is a vertex of the graph above, a pair is the middle of that stroke. */
const CUT = {
  A: ['ap', 'cl', ['cl','cr'], ['cl','lf']],
  B: ['m', 'u'],
  D: ['t', ['t','b']],
  E: ['m', 't', ['b','d'], 'c'],
  F: ['m', 't', ['m','b']],
  H: ['lm', ['lm','rm'], ['l1','lm']],
  K: ['m', ['m','a1']],
  L: ['c', 't'],
  O: ['1'],
  P: ['m', 'u', ['m','b']],
  R: ['m', 'u', ['m','g']],
  T: ['c', ['c','b'], ['l','c'], 'b'],
  V: ['v', ['l','v']],
  X: ['c', ['c','1']],
  Y: ['j', ['j','b'], 'l'],
};
const pieces = (edges, spec) => {
  let E = edges.map(e => e.slice()), v = spec;
  if (typeof spec !== 'string') {
    const i = E.findIndex(e => (e[0] === spec[0] && e[1] === spec[1]) || (e[0] === spec[1] && e[1] === spec[0]));
    const [a, b] = E.splice(i, 1)[0]; E.push([a, '#'], ['#', b]); v = '#';
  }
  const verts = [...new Set([].concat(...E))].filter(x => x !== v);
  const root = {}; verts.forEach(x => root[x] = x);
  const find = x => root[x] === x ? x : (root[x] = find(root[x]));
  E.forEach(([a, b]) => { if (a !== v && b !== v) root[find(a)] = find(b); });
  return new Set(verts.map(find)).size;
};
const ends = edges => { const d = {}; edges.forEach(([a, b]) => { d[a] = (d[a] || 0) + 1; d[b] = (d[b] || 0) + 1; }); return Object.values(d).filter(x => x === 1).length; };

/* Components of a union of intervals [l, r, closedLeft, closedRight]: sweep left to right, joining the next piece when it
   overlaps the running piece or shares its end point with that point belonging to at least one of them. */
const components = pcs => {
  const s = pcs.slice().sort((x, y) => x[0] - y[0] || y[2] - x[2]);
  let n = 0, curR = null, curC = 0;
  for (const [l, r, cl, cr] of s) {
    if (n > 0 && (l < curR || (l === curR && (curC || cl)))) {
      if (r > curR) { curR = r; curC = cr; } else if (r === curR) curC = curC || cr;
    } else { n++; curR = r; curC = cr; }
  }
  return n;
};
/* Fewest open intervals of length L10/10 covering a closed interval of length b − a: n of them cover when n × L > b − a (strict, overlapping slightly). */
const clamps = (a, b, L10) => { let n = 1; while (n * L10 <= 10 * (b - a)) n++; return n; };
const polyVal = (f, x) => f.kind === 'c' ? f.s * (x * x * x - 3 * f.m * f.m * x) + f.c : f.s * (x - f.h) * (x - f.h) + f.c;
const range = (f, a, b) => {
  let hi = -Infinity, lo = Infinity;
  for (let i = 0; i <= 4000; i++) { const x = a + (b - a) * i / 4000, y = polyVal(f, x); if (y > hi) hi = y; if (y < lo) lo = y; }
  return [clean(Math.round(hi * 1e4) / 1e4), clean(Math.round(lo * 1e4) / 1e4)];
};

Object.assign(window.ORACLE, {
  /* basis masks (bit i = node i from A = 0); x = node index counted from A = 0; on = mask of nodes sent to "on". Open sets = every union of basis sets. */
  q11: p => {
    const k = p.basis.length, full = (1 << p.N) - 1, open = new Set();
    for (let pick = 0; pick < (1 << k); pick++) { let u = 0; for (let i = 0; i < k; i++) if (pick >> i & 1) u |= p.basis[i]; open.add(u); }
    let cl = full; for (const o of open) { const c = full ^ o; if (c >> p.x & 1) cl &= c; }
    return [open.size, pc(cl), open.has(p.on) ? 1 : 0];
  },
  /* pieces [l, r, 1 if the left end is included, 1 if the right end is included]; k points removed from the line, m circles from the plane. */
  q12: p => [components(p.pieces), p.k + 1, p.m + 1],
  /* (L, p): p indexes the snip positions the prompt lists for letter L; the answer is the pieces left and the end points of the whole letter. */
  q13: p => { const E = LETTER[p.L]; return [pieces(E, CUT[p.L][p.p]), ends(E)]; },
  /* w = the word, T = the letter to match; count letters of the word homeomorphic to T. */
  q14: p => [p.w.split('').filter(c => homeo(c, p.T)).length],
  /* Cover [a, b] with open intervals of length L10 ÷ 10. kind is an index into the printed sets; compact means closed and bounded (Heine–Borel). */
  q15: p => {
    /* [closed, bounded] for each printed set, in the order of the prompt's list of kinds:
       0 [c,d]; 1 (c,d); 2 [c,d); 3 [c,∞); 4 three points; 5 two closed intervals; 6 the whole numbers; 7 {1/k}; 8 {0} ∪ {1/k}; 9 (c,∞) */
    const CB = [[1,1],[0,1],[0,1],[1,0],[1,1],[1,1],[1,0],[0,1],[1,1],[0,0]];
    return [clamps(p.a, p.b, p.L10), CB[p.kind][0] && CB[p.kind][1] ? 1 : 0];
  },
  q16: p => range(p.f, p.a, p.b),
  q17: p => [components(p.pieces), clamps(p.a, p.b, p.L10), range(p.f, p.a, p.b)[0]],
  /* w = four [letter, sign] pairs read clockwise (sign 1 clockwise, −1 anticlockwise). Edge i runs from corner i to corner i + 1 when clockwise.
     Sewing arrow on arrow joins tail to tail and head to head; edges left = one per distinct letter. */
  q18: p => {
    const root = [0, 1, 2, 3], find = x => root[x] === x ? x : (root[x] = find(root[x]));
    const tail = i => p.w[i][1] > 0 ? i : (i + 1) % 4, head = i => p.w[i][1] > 0 ? (i + 1) % 4 : i;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (p.w[i][0] === p.w[j][0]) { root[find(tail(i))] = find(tail(j)); root[find(head(i))] = find(head(j)); }
    return [new Set([0, 1, 2, 3].map(find)).size, new Set(p.w.map(x => x[0])).size];
  },
  /* base is an index into the printed shapes: [boundary circles, orientable]. Each of the k holes adds one boundary circle and leaves orientability alone. */
  q19: p => {
    const B = [[1,1],[2,1],[2,1],[1,0],[3,1],[1,1],[1,0],[0,1],[0,1],[0,0],[0,0]];
    return [B[p.base][0] + p.k, B[p.base][1]];
  },
  /* Count by building the cell division: points, edges and squares are named by grid position, and sewing wraps the position. */
  q20: p => {
    let V = new Set(), Ed = new Set(), F = 0;
    if (p.kind === 'pyramid' || p.kind === 'prism') {
      const n = p.a;
      if (p.kind === 'pyramid') {
        for (let i = 0; i < n; i++) { V.add('b' + i); Ed.add('r' + i); Ed.add('s' + i); F++; }
        V.add('apex'); F++;
      } else {
        for (let i = 0; i < n; i++) { V.add('t' + i); V.add('u' + i); Ed.add('t' + i); Ed.add('u' + i); Ed.add('v' + i); F++; }
        F += 2;
      }
    } else {
      const wrapX = p.kind !== 'flat', wrapY = p.kind === 'torus';
      const X = i => wrapX ? i % p.a : i, Y = j => wrapY ? j % p.b : j;
      for (let i = 0; i <= p.a; i++) for (let j = 0; j <= p.b; j++) {
        V.add(X(i) + ',' + Y(j));
        if (i < p.a) Ed.add('h' + X(i) + ',' + Y(j));
        if (j < p.b) Ed.add('v' + X(i) + ',' + Y(j));
      }
      F = p.a * p.b;
    }
    return [V.size, Ed.size, F, V.size - Ed.size + F];
  },
});
})();
