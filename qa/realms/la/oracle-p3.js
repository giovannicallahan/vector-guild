/* Independent oracles for linear algebra practice missions, file 3 of 14: q11–q15 (game/realms/la/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Determinant by cofactor expansion along the first row (any size). */
const det = M => {
  if (M.length === 1) return M[0][0];
  let s = 0;
  for (let j = 0; j < M.length; j++) {
    if (M[0][j] === 0) continue;
    const minor = M.slice(1).map(row => row.filter((_, c) => c !== j));
    s += (j % 2 ? -1 : 1) * M[0][j] * det(minor);
  }
  return s;
};
/* Solve M x = r by Cramer's rule (no elimination), then check by putting the solution back into every equation. */
const cramer = (M, r) => {
  const d = det(M), n = M.length;
  if (d === 0) return new Array(n).fill(NaN);
  const x = M.map((_, k) => det(M.map((row, i) => row.map((v, j) => j === k ? r[i] : v))) / d);
  const ok = M.every((row, i) => Math.abs(row.reduce((s, v, j) => s + v * x[j], 0) - r[i]) < 1e-9);
  return ok ? x : new Array(n).fill(NaN);
};
/* All ways to choose k of the indices 0..n-1. */
const choose = (n, k) => {
  const out = [];
  const go = (from, picked) => {
    if (picked.length === k) { out.push(picked); return; }
    for (let i = from; i < n; i++) go(i + 1, picked.concat(i));
  };
  go(0, []);
  return out;
};
/* Rank from the definition by minors: the largest k for which some k by k sub-determinant is not zero. */
const rank = M => {
  const rows = M.length, cols = M[0].length;
  for (let k = Math.min(rows, cols); k >= 1; k--)
    for (const R of choose(rows, k)) for (const C of choose(cols, k))
      if (det(R.map(i => C.map(j => M[i][j]))) !== 0) return k;
  return 0;
};
/* Columns side by side as a matrix: entry [i][j] is component i of column j. */
const fromColumns = cols => cols[0].map((_, i) => cols.map(c => c[i]));

Object.assign(window.ORACLE, {
  /* Café: try every whole-dollar price pair and keep the one that pays both bills; it must be the only one. */
  q11b: p => {
    const hits = [];
    for (let x = 0; x <= 60; x++) for (let y = 0; y <= 60; y++)
      if (p.a * x + p.b * y === p.r1 && p.c * x + p.b * y === p.r2) hits.push([x, y]);
    return hits.length === 1 ? hits[0] : [NaN, NaN];
  },
  /* Ferry: search for the boat and current speeds whose two trips take exactly the stated hours. */
  q11c: p => {
    const hits = [];
    for (let boat = 1; boat <= 200; boat++) for (let cur = 0; cur < boat; cur++)
      if ((boat + cur) * p.t1 === p.D && (boat - cur) * p.t2 === p.D) hits.push([boat, cur]);
    return hits.length === 1 ? hits[0] : [NaN, NaN];
  },
  /* Theatre: start with every ticket a child ticket and swap one to adult at a time until the takings match. */
  q11d: p => {
    const hits = [];
    for (let adults = 0; adults <= p.N; adults++) if (p.P * adults + p.C * (p.N - adults) === p.R) hits.push([adults, p.N - adults]);
    return hits.length === 1 ? hits[0] : [NaN, NaN];
  },
  /* Balance: the three readings as one system in (pump, valve, filter), solved by Cramer's rule; answer order filter, valve, pump. */
  q12b: p => {
    const [x, y, z] = cramer([[1, p.a[0], -p.a[1]], [0, p.b[0], -p.b[1]], [0, 0, p.c]], p.r);
    return [z, y, x];
  },
  /* Workshop: the three jobs as one system in (lead, fitter, apprentice), by Cramer's rule; then price the new job hour by hour. */
  q12c: p => {
    const [x, y, z] = cramer([[p.a[0], p.a[1], p.a[2]], [0, p.b[0], p.b[1]], [0, 0, p.c]], p.r);
    return [z, y, x, p.h[0] * x + p.h[1] * y + p.h[2] * z];
  },
  /* Drone trims: the full 3 by 3 system as written (third row has minus b[0]), by Cramer's rule. */
  q12d: p => cramer([[1, p.a[1], p.a[2]], [0, p.b[0], p.b[1]], [0, -p.b[0], p.f]], p.r),
  /* Players' table: rank by minors; nullity = columns minus rank. */
  q13b: p => { const r = rank(p.rows); return [r, p.rows[0].length - r]; },
  /* Club spending: rank by minors; nullity = columns minus rank; spare rows = rows minus rank. */
  q13c: p => { const r = rank(p.rows); return [r, p.rows[0].length - r, p.rows.length - r]; },
  /* Sensors: search for the one t that makes sensors 1 and 2 a rank 1 pair; rank by minors at that t and at other values of t. */
  q13d: p => {
    const rows = t => [p.r1, [p.k * p.r1[0], p.k * p.r1[1], t], p.r3];
    const ts = [];
    for (let t = -60; t <= 60; t++) if (rank(rows(t).slice(0, 2)) === 1) ts.push(t);
    if (ts.length !== 1) return [NaN, NaN, NaN, NaN];
    const t = ts[0], r = rank(rows(t));
    const others = [];
    for (let u = -60; u <= 60; u++) if (u !== t) { const ru = rank(rows(u)); if (!others.includes(ru)) others.push(ru); }
    return [t, r, 3 - r, others.length === 1 ? others[0] : NaN];
  },
  /* Hiker: with z oat bars added, the protein and fibre changes must both be zero; two equations in (cheese, nuts) by Cramer's rule. */
  q14b: p => cramer([[p.A[0][0], p.A[0][1]], [p.A[1][0], p.A[1][1]]], [-p.A[0][2] * p.z, -p.A[1][2] * p.z]),
  /* Motors: fix motor 1 at T turns; both sensors at zero gives two equations in (motor 2, motor 3), by Cramer's rule. */
  q14c: p => cramer([[p.A[0][1], p.A[0][2]], [p.A[1][1], p.A[1][2]]], [-p.A[0][0] * p.T, -p.A[1][0] * p.T]),
  /* Tugs: east and north pulls must each cancel tug 3's pull; columns d1, d2, by Cramer's rule. */
  q14d: p => cramer(fromColumns([p.d1, p.d2]), p.d3.map(v => -p.z * v)),
  /* Trams: columns b1, b2 must reach t, by Cramer's rule. */
  q15b: p => cramer(fromColumns([p.b1, p.b2]), p.t),
  /* Pen plotter: columns (g, g) and (h, -h) must make the move from P to Q, by Cramer's rule. */
  q15c: p => cramer(fromColumns([[p.g, p.g], [p.h, -p.h]]), [p.Q[0] - p.P[0], p.Q[1] - p.P[1]]),
  /* Lamp: columns A, B, C must mix to t; the whole 3 by 3 system by Cramer's rule, answer order A, B, C. */
  q15d: p => cramer(fromColumns([p.A, p.B, p.C]), p.t),
});
})();
