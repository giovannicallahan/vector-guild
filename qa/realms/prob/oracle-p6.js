/* Independent oracles for Probability practice missions, file 6 of 8: q26b–q30d (game/realms/prob/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round((x + 1e-12) * 1e6) / 1e6;
const r4 = x => Math.round((x + 1e-12) * 1e4) / 1e4;
/* The reference value the prompt prints: e^(-z) to 4 decimal places. */
const e4 = z => r4(Math.exp(-z));
/* Uniform on [lo, hi]: share of the range lying after t, given nothing before s (hi - t over hi - s). */
const lateGiven = (hi, t, s) => (hi - Math.max(t, s)) / (hi - s);
/* Empirical rule: percentage of a normal curve in each one-sd band from z to z+1 (z = -3 … 2); 0.15 in each far tail. */
const BAND = { '-3': 2.35, '-2': 13.5, '-1': 34, '0': 34, '1': 13.5, '2': 2.35 };
const between = (i, j) => { let t = 0; for (let z = i; z < j; z++) t += BAND[z] || 0; return r6(t); };
const above = j => r6(between(j, 3) + 0.15);
Object.assign(window.ORACLE, {
  /* q26b: uniform on [a, b]: k-th percentile, midpoint, and the share of [d, b] lying after c. */
  q26b: p => [r6(p.a + (p.k / 100) * (p.b - p.a)), r6((p.a + p.b) / 2), r6(lateGiven(p.b, p.c, p.d))],
  /* q26c: mean arrival, crew wait (mean minus start) times cost, then the conditional share. */
  q26c: p => { const m = (p.a + p.b) / 2; return [r6(m), r6((m - p.a) * p.r), r6(lateGiven(p.b, p.c, p.d))]; },
  /* q26d: the k-th percentile sits at a + (k/100) w; search the width that puts it there, then the end, mean, share. */
  q26d: p => {
    const pct = p.a + (p.k / 100) * p.w;
    let w = 0; while (p.a + (p.k / 100) * w < pct - 1e-9) w++;
    const end = p.a + w;
    return [end, r6((p.a + end) / 2), r6(lateGiven(end, p.c, p.d))];
  },
  /* q27b: m is 1 over the mean (given as m); P(X < x) = 1 - e^(-m x) with the printed reference value. */
  q27b: p => [p.m, r4(1 - e4(p.m * p.x))],
  /* q27c: failure probability, expected failures out of N, cost at r each (from the 4-decimal probability). */
  q27c: p => { const q = r4(1 - e4(p.m * p.x)); return [q, r6(q * p.N), r6(q * p.N * p.r)]; },
  /* q27d: before x1; between x1 and x2 (difference of survival values); mean 1 over m. */
  q27d: p => [r4(1 - e4(p.m * p.x1)), r6(e4(p.m * p.x1) - e4(p.m * p.x2)), r6(1 / p.m)],
  /* q28b: survive a, then b further: survival at a + b over survival at a; and survival at a + b for a new element. */
  q28b: p => [r4(e4(p.m * (p.a + p.b)) / e4(p.m * p.a)), e4(p.m * (p.a + p.b))],
  /* q28c: chance one lamp lasts b further after a hours, then expected survivors and failures among N. */
  q28c: p => { const q = r4(e4(p.m * (p.a + p.b)) / e4(p.m * p.a)); return [q, r6(q * p.N), r6(p.N - q * p.N)]; },
  /* q28d: new seal fails within a; this seal lasts b more; fails in those b hours. */
  q28d: p => { const s = r4(e4(p.m * (p.a + p.b)) / e4(p.m * p.a)); return [r4(1 - e4(p.m * p.a)), s, r4(1 - s)]; },
  /* q29b: kind 1 Poisson (lam, k), kind 2 uniform on [a, b] between c and d, kind 3 exponential within x. */
  q29b: p => {
    if (p.kind === 1) { let f = 1; for (let i = 2; i <= p.k; i++) f *= i; return [1, r4(e4(p.lam) * Math.pow(p.lam, p.k) / f)]; }
    if (p.kind === 2) return [2, r4((p.d - p.c) / (p.b - p.a))];
    return [3, r4(1 - e4(p.m * p.x))];
  },
  /* q29c: the same three models, then the expected number out of N from the 4-decimal probability. */
  q29c: p => {
    let q, kind = p.kind;
    if (kind === 1) { let f = 1; for (let i = 2; i <= p.k; i++) f *= i; q = r4(e4(p.lam) * Math.pow(p.lam, p.k) / f); }
    else if (kind === 2) q = r4((p.d - p.c) / (p.b - p.a));
    else q = r4(1 - e4(p.m * p.x));
    return [kind, q, r6(q * p.N)];
  },
  /* q29d: kind 2 uniform on [a, b], not by d, after c; kind 3 exponential, run x, lasts y more. */
  q29d: p => {
    if (p.kind === 2) return [2, r4(lateGiven(p.b, p.c, p.d))];
    if (p.kind === 1) { let f = 1; for (let i = 2; i <= p.k; i++) f *= i; return [1, r4(e4(p.lam) * Math.pow(p.lam, p.k) / f)]; }
    return [3, r4(e4(p.m * (p.x + p.y)) / e4(p.m * p.x))];
  },
  /* q30b: limits are i and j sds from the mean; the rejected share is what the bands outside them hold. */
  q30b: p => [p.i, p.j, r6(100 - between(p.i, p.j))],
  /* q30c: accepted share, rejected washers out of N, cost at r each. */
  q30c: p => { const acc = between(p.i, p.j), rej = r6((100 - acc) / 100 * p.N); return [acc, rej, r6(rej * p.r)]; },
  /* q30d: mean and sd from the limits (q = 1, 2, 3 sds either side), then the tail beyond j sds. */
  q30d: p => [p.mu, p.s, above(p.j)],
});
})();
