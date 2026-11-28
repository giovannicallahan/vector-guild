/* Independent oracles for Data and inference practice missions, file 4 of 8: q16b–q20d (game/realms/stats/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round half away from zero to d places, with a tiny nudge against binary noise. */
const rd = (x, d) => { const m = Math.pow(10, d); return Math.sign(x) * Math.round(Math.abs(x) * m + 1e-7) / m; };
const Z = { 90: 1.645, 95: 1.96, 99: 2.576 };
const TT = { 8: { 90: 1.860, 95: 2.306, 99: 3.355 }, 9: { 90: 1.833, 95: 2.262, 99: 3.250 },
             10: { 90: 1.812, 95: 2.228, 99: 3.169 }, 11: { 90: 1.796, 95: 2.201, 99: 3.106 } };
/* Standard error of a proportion from the 0/1 data itself: the mean and variance of x ones and n − x zeros. */
const propSE = (x, n) => {
  const data = []; for (let i = 0; i < n; i++) data.push(i < x ? 1 : 0);
  let m = 0; for (const v of data) m += v; m /= n;
  let ss = 0; for (const v of data) ss += (v - m) * (v - m);
  return { ph: m, se: Math.sqrt((ss / n) / n) };
};
/* Interval for a proportion at a confidence level: [p̂, SE, margin, lower, upper]. */
const propCI = (x, n, level) => { const q = propSE(x, n), me = Z[level] * q.se; return { ph: q.ph, se: q.se, me, lo: q.ph - me, hi: q.ph + me }; };
/* Tail code from the wording: 1 for "less / lower / sooner" (left), 2 for "more / longer" (right), 3 for "different" (two). */
/* q18b, q18c: c only indexes the list of supplier stories: 0 and 3 are "at least ... suspect less" (left),
   1 and 4 are "a mean of / at most ... suspect more" (right), 2 and 5 are "different, either direction" (two-tailed). */
const tailC = c => [1, 2, 3, 1, 2, 3][c];
/* q18d: a and b only index the list of eight claims: 0 no less than (left), 1 no more than (right), 2 has changed (two),
   3 not under (left), 4 at most (right), 5 off either way (two), 6 not more than (right), 7 at least (left). */
const tailD = i => [1, 2, 3, 1, 2, 3, 2, 1][i];
Object.assign(window.ORACLE, {
  /* x of n vials: p̂, its standard error, and the 99% interval (L is the confidence level, 90, 95 or 99). */
  q16b: p => { const c = propCI(p.x, p.N, p.L); return [rd(c.ph, 3), rd(c.se, 3), rd(c.lo, 3), rd(c.hi, 3)]; },
  /* 95/90/99% interval for the share of streaked cores, then whether the sheet's cs/100 lies inside it (cs is a percent). */
  q16c: p => {
    const c = propCI(p.x, p.N, p.L), claim = p.cs / 100;
    return [rd(c.me, 3), rd(c.lo, 3), rd(c.hi, 3), (claim >= c.lo && claim <= c.hi) ? 1 : 0];
  },
  /* pr only indexes the pair of levels: 0 is 90 and 95, 1 is 90 and 99, 2 is 95 and 99. Last, the smallest whole n whose
     margin at the higher level, with p̂ as the guess, is at most E (searched upward, not from the formula). */
  q16d: p => {
    const lv = [[90, 95], [90, 99], [95, 99]][p.pr], a = propCI(p.x, p.N, lv[0]), b = propCI(p.x, p.N, lv[1]), ph = p.x / p.N;
    let m = 1; while (Z[lv[1]] * Math.sqrt(ph * (1 - ph) / m) > p.E) m++;
    return [rd(a.lo, 3), rd(a.hi, 3), rd(b.lo, 3), rd(b.hi, 3), m];
  },
  /* k = 1: σ known, a z interval from a sample of r² items; k = 2: s = s10/10 from Nt items, a t interval with Nt − 1 df;
     k = 3: x of Np items, a proportion. L is the level. The answer is the interval number and its bounds. */
  q17b: p => {
    if (p.k === 1) { const n = p.r * p.r, me = Z[p.L] * p.sig / Math.sqrt(n); return [1, rd(p.xb - me, 2), rd(p.xb + me, 2)]; }
    if (p.k === 2) { const me = TT[p.Nt - 1][p.L] * (p.s10 / 10) / Math.sqrt(p.Nt); return [2, rd(p.xb - me, 2), rd(p.xb + me, 2)]; }
    const c = propCI(p.x, p.Np, p.L); return [3, rd(c.lo, 3), rd(c.hi, 3)];
  },
  /* As q17b, with the margin of error and whether it is at most the limit T (kept in the units of the margin). */
  q17c: p => {
    let me, k = p.k;
    if (k === 1) me = Z[p.L] * p.sig / Math.sqrt(p.r * p.r);
    else if (k === 2) me = TT[p.Nt - 1][p.L] * (p.s10 / 10) / Math.sqrt(p.Nt);
    else me = propCI(p.x, p.Np, p.L).me;
    return [k, rd(me, k === 3 ? 3 : 2), me <= p.T ? 1 : 0];
  },
  /* As q17b, with the critical value used in front of the bounds (2 places for means). */
  q17d: p => {
    if (p.k === 1) { const me = Z[p.L] * p.sig / Math.sqrt(p.r * p.r); return [1, Z[p.L], rd(p.xb - me, 2), rd(p.xb + me, 2)]; }
    if (p.k === 2) { const t = TT[p.Nt - 1][p.L], me = t * (p.s10 / 10) / Math.sqrt(p.Nt); return [2, t, rd(p.xb - me, 2), rd(p.xb + me, 2)]; }
    const c = propCI(p.x, p.Np, p.L); return [3, Z[p.L], rd(c.lo, 3), rd(c.hi, 3)];
  },
  /* The number in H0 is v; c indexes the story, which fixes the tail. */
  q18b: p => [p.v, tailC(p.c)],
  /* Sample mean is v + d. It can count against H0 only on the side Ha points to; two-tailed counts either side. */
  q18c: p => {
    const t = tailC(p.c), xbar = p.v + p.d;
    const ok = t === 1 ? xbar < p.v : t === 2 ? xbar > p.v : xbar !== p.v;
    return [p.v, t, ok ? 1 : 0];
  },
  /* Two claims: a and b index the claim lists, va and vb are their numbers. */
  q18d: p => [p.va, tailD(p.a), p.vb, tailD(p.b)],
  /* β is one minus the power (P percent); every one of N batches is below its rating, so the misses number N × β. */
  q19b: p => { const beta = (100 - p.P) / 100; return [rd(beta, 2), rd(p.N * beta, 4)]; },
  /* F tins meet their weight and S are underweight; P is the power in percent, A is α in percent. */
  q19c: p => [p.F, rd(p.S * p.P / 100, 4), rd(p.F * p.A / 100, 4)],
  /* t = 0: the claim is false for all N tests, so the error is Type II with probability B percent; t = 1: the claim is
     true, so the error is Type I with probability A percent. c only indexes the supplier story and its tail. */
  q19d: p => p.t === 0 ? [2, p.B / 100, p.N * p.B / 100] : [1, p.A / 100, p.N * p.A / 100],
  /* n = r², standard error σ ÷ r, and z from the sample mean μ + d10/10. */
  q20b: p => { const se = p.sig / p.r, d = p.d10 / 10; return [rd(se, 2), rd(d / se, 2)]; },
  /* Each supplier: n = r², mean μ + d10 / 10 where d is given in tenths. */
  q20c: p => {
    const zA = (p.dA / 10) / (p.sigA / p.rA), zB = (p.dB / 10) / (p.sigB / p.rB);
    return [rd(zA, 2), rd(zB, 2), Math.abs(zA) > Math.abs(zB) ? 1 : 2];
  },
  /* v is the number in H0; c indexes the story (tail as in q18b); the sample mean is v + d10/10 from N items. */
  q20d: p => [p.v, tailC(p.c), rd((p.d10 / 10) / (p.sig / Math.sqrt(p.N)), 2)]
});
})();
