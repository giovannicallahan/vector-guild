/* Independent oracles for Discrete mathematics practice missions, file 6 of 8: q26b–q30d (game/realms/disc/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Term list of a geometric sequence, built by repeated multiplying. */
const geo = (a, r, n) => { const t = [a]; while (t.length < n) t.push(t[t.length - 1] * r); return t; };
/* Term list of an arithmetic sequence, built by repeated adding. */
const arith = (f, d, n) => { const t = [f]; while (t.length < n) t.push(t[t.length - 1] + d); return t; };
const sum = list => list.reduce((s, x) => s + x, 0);
/* Terms of a polynomial in the term number, n = 1, 2, 3, ... (coefficients highest power first). */
const poly = (coef, n) => { const t = []; for (let x = 1; x <= n; x++) t.push(coef.reduce((s, c) => s * x + c, 0)); return t; };
/* Rows of differences: rows[0] is the terms, rows[k] the k-th differences, until a row is constant. */
const diffRows = terms => {
  const rows = [terms.slice()];
  for (;;) {
    const last = rows[rows.length - 1];
    if (last.length > 1 && last.every(x => x === last[0])) return rows;
    const next = []; for (let i = 1; i < last.length; i++) next.push(last[i] - last[i - 1]);
    rows.push(next);
  }
};
/* Extend every row of a difference table by one term (the constant row gets another copy of its constant). */
const extendOnce = rows => {
  const top = rows.length - 1;
  rows[top].push(rows[top][0]);
  for (let k = top - 1; k >= 0; k--) rows[k].push(rows[k][rows[k].length - 1] + rows[k + 1][rows[k + 1].length - 1]);
};
const extendTo = (terms, n) => { const rows = diffRows(terms); while (rows[0].length < n) extendOnce(rows); return rows; };
/* Linear recurrence a(n) = c a(n-1) + d a(n-2), list of terms a0.. */
const rec2 = (c, d, a0, a1, upto) => { const t = [a0, a1]; while (t.length <= upto) t.push(c * t[t.length - 1] + d * t[t.length - 2]); return t; };
Object.assign(window.ORACLE, {
  /* q26b: list the calls hour by hour, then add them. */
  q26b: p => { const t = geo(p.a, p.r, p.m); return [t[p.m - 1], sum(t)]; },
  /* q26c: weekly packs listed, summed, then priced. */
  q26c: p => { const t = geo(p.a, p.r, p.m), s = sum(t); return [t[p.m - 1], s, s * p.k]; },
  /* q26d: the growing line by repeated multiplying, the steady line by repeated adding. */
  q26d: p => { const g = sum(geo(p.a, p.r, p.m)), s = sum(arith(p.f, p.d, p.m)); return [g, s, g - s]; },
  /* q27b: readings n^3 e + a n^2 + b n + c (e is 0 for a quadratic); read the degree and constant off the difference table. */
  q27b: p => {
    const rows = diffRows(poly([p.e, p.a, p.b, p.c], 6)), degree = rows.length - 1, constant = rows[degree][0];
    extendOnce(rows);
    return [degree, constant, rows[0][6]];
  },
  /* q27c: a n^2 + b n + c, weeks 1..5 shown; extend the table to weeks 6 and 7. */
  q27c: p => {
    const rows = extendTo(poly([p.a, p.b, p.c], 5), 7), w6 = rows[0][5], w7 = rows[0][6];
    return [w6, w7, w6 + w7];
  },
  /* q27d: the same table pushed on to week 20. */
  q27d: p => {
    const rows = extendTo(poly([p.a, p.b, p.c], 5), 20), t = rows[0];
    return [rows[2][0], t[19] - t[18], t[19]];
  },
  /* q28b: step the recurrence forward from the two starting values. */
  q28b: p => { const t = rec2(p.c, p.d, p.a0, p.a1, 7); return [t[5], t[7]]; },
  /* q28c: terms a0..a6, their sum, and the price. */
  q28c: p => { const t = rec2(p.c, p.d, p.a0, p.a1, 6), s = sum(t); return [t[6], s, s * p.k]; },
  /* q28d: stock by the recurrence, demand m n + k, spare = stock - demand. */
  q28d: p => { const t = rec2(p.c, p.d, p.a0, p.a1, 6), b = p.m * 6 + p.k; return [t[6], b, t[6] - b]; },
  /* q29b: P arithmetic (total of n1 terms), Q geometric (term n2), R = A n^2 + B n + C (term 6, by differences). */
  q29b: p => {
    const P = sum(arith(p.f, p.d, p.n1)), Q = geo(p.a, p.r, p.n2)[p.n2 - 1];
    const R = extendTo(poly([p.A, p.B, p.C], 5), 6)[0][5];
    return [P, Q, R];
  },
  /* q29c: week 6 of each line, then their sum. */
  q29c: p => {
    const A = arith(p.f, p.d, 6)[5], B = geo(p.a, p.r, 6)[5], C = extendTo(poly([p.A, p.B, p.C], 5), 6)[0][5];
    return [A, B, C, A + B + C];
  },
  /* q29d: X arithmetic total, Y geometric total, Z = D n^3 + A n^2 + B n + C week 7 (by differences from the six shown). */
  q29d: p => {
    const X = sum(arith(p.f, p.d, p.n1)), Y = sum(geo(p.a, p.r, p.n2));
    const Z = extendTo(poly([p.D, p.A, p.B, p.C], 6), 7)[0][6];
    return [X, Y, Z];
  },
  /* q30b: add the daily gains p n + q one day at a time. */
  q30b: p => {
    let a = p.a0, a4 = null;
    for (let n = 1; n <= p.N; n++) { a += p.p * n + p.q; if (n === 4) a4 = a; }
    return [a4, a];
  },
  /* q30c: gains listed week by week, summed; the racks start at a0; the excess over the capacity is moved. */
  q30c: p => {
    const gains = []; for (let n = 1; n <= p.N; n++) gains.push(p.p * n + p.q);
    const gained = sum(gains), count = p.a0 + gained;
    return [gained, count, count - p.cap];
  },
  /* q30d: start from a5 and add the gains of weeks 6, 7, ... one at a time. */
  q30d: p => {
    let a = p.a5, a7 = null;
    for (let n = 6; n <= p.N; n++) { a += p.p * n + p.q; if (n === 7) a7 = a; }
    return [a7, a];
  },
});
})();
