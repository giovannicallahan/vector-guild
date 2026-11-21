/* Independent oracles for linear algebra practice missions, file 2 of 14: q06–q10 (game/realms/la/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Helpers written for this file only (no game code). */
/* Repeated addition: add each table entry once per unit of the matching count. */
const tally = (row, counts) => { let sum = 0; row.forEach((per, i) => { for (let k = 0; k < counts[i]; k++) sum += per; }); return sum; };
/* A matrix acting on a vector, as a mix of the matrix's columns (not row by row). */
const mixColumns = (M, v) => M.map((_, r) => 0).map((_, r) => v.reduce((s, weight, c) => s + weight * M[r][c], 0));
const act = (M, v) => { const out = M.map(() => 0); v.forEach((weight, c) => M.forEach((row, r) => { out[r] += weight * row[c]; })); return out; };
/* The quarter turn counterclockwise found by search: the whole-number point at the same distance from the centre,
   at a right angle to the start, on the counterclockwise side. */
const quarterTurn = d => {
  const len2 = d[0] * d[0] + d[1] * d[1], R = Math.abs(d[0]) + Math.abs(d[1]), hits = [];
  for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++)
    if (x * x + y * y === len2 && x * d[0] + y * d[1] === 0 && d[0] * y - d[1] * x > 0) hits.push([x, y]);
  if (hits.length !== 1) throw new Error('quarter turn not unique');
  return hits[0];
};
/* Signed area of the parallelogram on arrows u, v by the shoelace rule on its corners 0, u, u+v, v. */
const signedArea = (u, v) => {
  const c = [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v]; let twice = 0;
  c.forEach((pt, i) => { const nx = c[(i + 1) % 4]; twice += pt[0] * nx[1] - nx[0] * pt[1]; });
  return twice / 2;
};
const col = (M, j) => M.map(row => row[j]);
/* The matrix of "first, then second" built from where the two unit arrows end up. */
const compose = (first, second) => {
  const n = first[0].length, images = [];
  for (let j = 0; j < n; j++) { const e = first[0].map((_, k) => (k === j ? 1 : 0)); images.push(act(second, act(first, e))); }
  return images[0].map((_, r) => images.map(img => img[r]));
};
/* Solve M (x, y) = target by trying every candidate on a grid. */
const solveBySearch = (M, target, lo, hi, step) => {
  const hits = [];
  for (let x = lo; x <= hi; x += step) for (let y = lo; y <= hi; y += step)
    if (Math.abs(M[0][0] * x + M[0][1] * y - target[0]) < 1e-9 && Math.abs(M[1][0] * x + M[1][1] * y - target[1]) < 1e-9) hits.push([x, y]);
  if (hits.length !== 1) throw new Error('solution not unique: ' + hits.length);
  return hits[0];
};
const inverseBySearch = (M, lo, hi, step) => {
  const c1 = solveBySearch(M, [1, 0], lo, hi, step), c2 = solveBySearch(M, [0, 1], lo, hi, step);
  return [c1[0], c2[0], c1[1], c2[1]];
};

Object.assign(window.ORACLE, {
  /* Add up the grams one serving at a time. */
  q06b: p => [tally(p.A[0], p.x), tally(p.A[1], p.x)],
  /* Count parts one kit at a time, then take them off the shelf one by one. */
  q06c: p => {
    const need = [tally(p.A[0], p.x), tally(p.A[1], p.x)];
    const left = need.map((n, i) => { let shelf = p.stock[i]; for (let k = 0; k < n; k++) shelf--; return shelf; });
    return [need[0], need[1], left[0], left[1]];
  },
  /* Mix each command on its own, then add the two outputs (M(a+b) = Ma + Mb). */
  q06d: p => { const ma = act(p.M, p.a), mb = act(p.M, p.b); return ma.map((v, i) => v + mb[i]); },
  /* Find each turned point by search. */
  q07b: p => { const b = quarterTurn(p.p), l = quarterTurn(p.q); return [b[0], b[1], l[0], l[1]]; },
  /* Search for the turned arrow from hinge to latch, then put it back on the hinge. */
  q07c: p => { const t = quarterTurn([p.L[0] - p.H[0], p.L[1] - p.H[1]]); return [p.H[0] + t[0], p.H[1] + t[1]]; },
  /* Search for the whole-number point at the same distance whose dot and cross products with the start match the angle. */
  q07d: p => {
    const v = p.v, len2 = v[0] * v[0] + v[1] * v[1], R = Math.ceil(Math.sqrt(len2)), hits = [];
    for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++)
      if (x * x + y * y === len2 && Math.abs(v[0] * x + v[1] * y - p.cos * len2) < 1e-6 && Math.abs(v[0] * y - v[1] * x - p.sin * len2) < 1e-6) hits.push([x, y]);
    if (hits.length !== 1) throw new Error('q07d: turned point not unique');
    return hits[0];
  },
  /* Follow one Small basket and one Large basket through both tables. */
  q08b: p => { const P = compose(p.B, p.A); return [P[0][0], P[0][1], P[1][0], P[1][1]]; },
  /* Build the combined matrix from where the unit arrows land; move the corner through the two steps one at a time. */
  q08c: p => {
    const T = [[0, -1], [1, 0]];
    const first = p.turnFirst ? T : p.S, second = p.turnFirst ? p.S : T;
    const P = compose(first, second);
    const turn = w => [-w[1], w[0]], reshape = w => mixColumns(p.S, w);
    const end = p.turnFirst ? reshape(turn(p.v)) : turn(reshape(p.v));
    return [P[0][0], P[0][1], P[1][0], P[1][1], end[0], end[1]];
  },
  /* Count the two-flight trips one by one: city, hub, island. */
  q08d: p => {
    const out = [];
    for (let island = 0; island < 2; island++) for (let city = 0; city < 2; city++) {
      let trips = 0;
      for (let hub = 0; hub < 3; hub++) for (let f1 = 0; f1 < p.B[hub][city]; f1++) for (let f2 = 0; f2 < p.A[island][hub]; f2++) trips++;
      out.push(trips);
    }
    return out;
  },
  /* Determinant as the signed area of the square's image (shoelace rule on the columns). */
  q09b: p => { const d = signedArea(col(p.A, 0), col(p.A, 1)); return [d, Math.abs(d) * p.area]; },
  q09c: p => { const d = signedArea(p.u, p.v), area = Math.abs(d); return [d, area, area * p.price]; },
  /* Shoelace areas for A and B; for AB, the area of the image of the unit square after B then A. */
  q09d: p => {
    const P = compose(p.B, p.A), dAB = signedArea(col(P, 0), col(P, 1));
    return [signedArea(col(p.A, 0), col(p.A, 1)), signedArea(col(p.B, 0), col(p.B, 1)), dAB, Math.abs(dAB)];
  },
  /* Search the halves for the two columns that A sends to (1,0) and (0,1). */
  q10b: p => inverseBySearch(p.A, -6, 6, 0.5),
  /* Try every pair of bag counts until the scoops match. */
  q10c: p => solveBySearch(p.A, p.t, 0, 20, 1),
  /* Search whole numbers for the matrix that undoes "B, then A". */
  q10d: p => inverseBySearch(compose(p.B, p.A), -40, 40, 1),
});
})();
