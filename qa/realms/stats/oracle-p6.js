/* Independent oracles for Data and inference practice missions, file 6 of 8: q26b–q30d (game/realms/stats/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round half up to d places (small nudge so 0.285 style values do not fall the wrong way). */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const sq = Math.sqrt;
/* Simpson's rule on [a, b] with n (even) steps. */
const simpson = (f, a, b, n) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Log of the gamma function (Lanczos), for the t curve. */
const lgam = x => {
  const g = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  x -= 1; let a = 0.99999999999980993; const t = x + 7.5;
  for (let i = 0; i < 8; i++) a += g[i] / (x + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
};
const tPdf = (t, v) => Math.exp(lgam((v + 1) / 2) - lgam(v / 2)) / sq(v * Math.PI) * Math.pow(1 + t * t / v, -(v + 1) / 2);
const tCdf = (t, v) => { const h = simpson(x => tPdf(x, v), 0, Math.abs(t), 1000); return t >= 0 ? 0.5 + h : 0.5 - h; };
/* One-tailed 5% critical value t* of the t curve with df degrees of freedom: bisection on the area to the left (0.95). */
const tStar = df => { let lo = 0, hi = 20; for (let i = 0; i < 45; i++) { const mid = (lo + hi) / 2; if (tCdf(mid, df) < 0.95) lo = mid; else hi = mid; } return (lo + hi) / 2; };
/* Chi-square critical values at the 5% level: df 1 is the square of the two-tailed normal 1.96 point, found by integrating the
   bell curve; df 2 has the closed tail area exp(−x/2), so its 5% point is −2 ln 0.05. */
const chiStar = df => {
  if (df === 2) return -2 * Math.log(0.05);
  let lo = 0, hi = 5;
  for (let i = 0; i < 45; i++) { const mid = (lo + hi) / 2; if (0.5 + simpson(t => Math.exp(-t * t / 2) / sq(2 * Math.PI), 0, mid, 2000) < 0.975) lo = mid; else hi = mid; }
  return ((lo + hi) / 2) ** 2;
};
/* Pearson chi-square of observed against expected lists. */
const chi = (O, E) => { let c = 0; for (let i = 0; i < O.length; i++) c += (O[i] - E[i]) * (O[i] - E[i]) / E[i]; return c; };
/* Chi-square of a table of observed counts against the independence expectations; also returns the expected table. */
const indep = O => {
  const R = O.map(r => r.reduce((a, b) => a + b, 0)), C = O[0].map((_, j) => O.reduce((a, r) => a + r[j], 0)), N = R.reduce((a, b) => a + b, 0);
  const E = O.map((r, i) => r.map((_, j) => R[i] * C[j] / N));
  let x = 0; O.forEach((r, i) => r.forEach((o, j) => { x += (o - E[i][j]) * (o - E[i][j]) / E[i][j]; }));
  return { E, x };
};
/* Matched pairs: after = before + difference. Mean of the differences and t = mean ÷ (s ÷ √n), s found from the squared distances. */
const paired = (bef, dif) => {
  const d = bef.map((b, i) => (b + dif[i]) - b), n = d.length, m = d.reduce((a, b) => a + b, 0) / n;
  let ss = 0; for (const x of d) ss += (x - m) * (x - m);
  return { m, t: m / (sq(ss / (n - 1)) / sq(n)) };
};
/* Pearson r from the deviations from each mean. */
const corr = (x, y) => {
  const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return sxy / sq(sxx * syy);
};
/* A and B (q29b, q29d, test 1) and s only INDEX lists of texts; they are not quantities.
   NS is the list of 22 (group size, standard deviation) pairs: 10 with s = 2,3,4,5,6,8; 16 with s = 2,4,6,8; 20 and 25 with s = 2,3,4,5,6,8. */
const NS = [[10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 8], [16, 2], [16, 4], [16, 6], [16, 8],
  [20, 2], [20, 3], [20, 4], [20, 5], [20, 6], [20, 8], [25, 2], [25, 3], [25, 4], [25, 5], [25, 6], [25, 8]];
/* Index s lists the claimed shares (per cent) used by each prompt family; s is only an index into these lists. */
const SH27B = [[55, 30, 15], [35, 45, 20], [40, 35, 25], [65, 25, 10], [20, 50, 30], [50, 25, 25], [45, 40, 15]];
const SH27C = [[40, 30, 20, 10], [35, 30, 20, 15], [50, 25, 15, 10], [30, 30, 25, 15], [45, 25, 20, 10], [40, 25, 20, 15]];
const SH27D = [[35, 30, 20, 15], [40, 25, 20, 15], [30, 25, 25, 20], [45, 25, 20, 10], [35, 35, 15, 15]];
const SH29 = [[50, 30, 20], [40, 40, 20], [60, 25, 15], [25, 50, 25], [45, 35, 20], [70, 20, 10], [30, 45, 25]];
/* Observed counts = expected + deviations (q27d: from the expected count rounded down, because some expected counts end in .5), the last category taking what is left of the sample. */
const goodness = (N, share, dev, whole) => {
  const E = share.map(s => N * s / 100), O = E.slice(0, -1).map((e, i) => (whole ? Math.floor(e) : e) + dev[i]);
  O.push(N - O.reduce((a, b) => a + b, 0));
  return { E, O, x: chi(O, E) };
};
/* 2 x 2 table for q29b and q29d (test 4): first row has N*b/10 units, first column N*c/10, and the (1,1) cell is its expectation + d. */
const twoByTwo = (N, b, c, d) => {
  const r1 = N * b / 10, c1 = N * c / 10, a = r1 * c1 / N + d;
  return indep([[a, r1 - a], [c1 - a, N - r1 - c1 + a]]);
};
/* Two-sample t, separate variances, first minus second; df rounded down. */
const welch = (x1, s1, n1, x2, s2, n2) => {
  const a = s1 * s1 / n1, b = s2 * s2 / n2;
  return { t: (x1 - x2) / sq(a + b), df: Math.floor((a + b) * (a + b) / (a * a / (n1 - 1) + b * b / (n2 - 1))) };
};
Object.assign(window.ORACLE, {
  q26b: p => { const r = paired(p.bef, p.dif); return [r.m, rd(r.t, 2)]; },
  q26c: p => { const r = paired(p.bef, p.dif); return [r.m, rd(r.t, 2)]; },
  q26d: p => { const r = paired(p.dry, p.dif); return [r.m, rd(r.t, 2)]; },
  q27b: p => { const g = goodness(p.N, SH27B[p.s], [p.d1, p.d2]); return [...g.E, rd(g.x, 2)]; },
  q27c: p => { const g = goodness(p.N, SH27C[p.s], [p.d1, p.d2, p.d3]); return [g.O[3], 3, rd(g.x, 2)]; },
  q27d: p => { const g = goodness(p.N, SH27D[p.s], [p.e1, p.e2, p.e3], true); return [...g.E, rd(g.x, 2)]; },
  /* a: row sizes in tenths of N (mixes A, B, C); b: healthy share of all plots in tenths; d1, d2 = healthy deviation of rows A and B,
     row C taking the opposite of their sum; r picks the row (0 A, 1 B, 2 C), c the column (0 healthy, 1 blighted). */
  q28b: p => {
    const row = p.a.map(t => p.N * t / 10), H = p.N * p.b / 10, E = row.map(r => r * H / p.N);
    const h = [E[0] + p.d1, E[1] + p.d2, E[2] - p.d1 - p.d2];
    const t = indep(row.map((r, i) => [h[i], r - h[i]]));
    return [t.E[p.r][p.c], 2, rd(t.x, 2)];
  },
  /* a: new-seed plots in tenths of N; b: good harvests in tenths of N; d: new-seed good plots above their expectation. */
  q28c: p => {
    const nw = p.N * p.a / 10, good = p.N * p.b / 10, g1 = nw * good / p.N + p.d;
    const t = indep([[g1, nw - g1], [good - g1, p.N - nw - good + g1]]);
    return [good - g1, t.E[0][0], 1, rd(t.x, 2)];
  },
  /* a: bed sizes and b: damage totals, both in tenths of N; d = deviations of the north and middle beds' none and light cells. */
  q28d: p => {
    const R = p.a.map(t => p.N * t / 10), C = p.b.map(t => p.N * t / 10);
    const E = R.map(r => C.map(c => r * c / p.N)), d = p.d, O = [[], [], []];
    O[0][0] = E[0][0] + d[0]; O[0][1] = E[0][1] + d[1]; O[1][0] = E[1][0] + d[2]; O[1][1] = E[1][1] + d[3];
    O[0][2] = R[0] - O[0][0] - O[0][1]; O[1][2] = R[1] - O[1][0] - O[1][1];
    for (let j = 0; j < 3; j++) O[2][j] = C[j] - O[0][j] - O[1][j];
    const t = indep(O);
    return [t.E[p.r][p.c], 4, rd(t.x, 2)];
  },
  /* k is the test number; A, B, C, D mean different things for each k, see below. */
  q29b: p => {
    if (p.k === 1) { const [n1, s1] = NS[p.A], [n2, s2] = NS[p.B]; return [1, rd(welch(p.C, s1, n1, p.D, s2, n2).t, 2)]; }
    if (p.k === 2) return [2, rd(p.B / (p.C / sq(p.A)), 2)];
    if (p.k === 3) return [3, rd(goodness(p.B, SH29[p.A], [p.C, p.D]).x, 2)];
    return [4, rd(twoByTwo(p.A, p.B, p.C, p.D).x, 2)];
  },
  /* k already is the test number for each result; v only picks which wording of that test is shown. */
  q29c: p => p.k.slice(),
  q29d: p => {
    if (p.k === 1) {
      const [n1, s1] = NS[p.A], [n2, s2] = NS[p.B], w = welch(p.C, s1, n1, p.D, s2, n2);
      return [1, rd(w.t, 2), w.t > tStar(w.df) ? 1 : 0];
    }
    if (p.k === 2) { const t = p.B / (p.C / sq(p.A)); return [2, rd(t, 2), t > tStar(p.A - 1) ? 1 : 0]; }
    if (p.k === 3) { const x = goodness(p.B, SH29[p.A], [p.C, p.D]).x; return [3, rd(x, 2), x > chiStar(2) ? 1 : 0]; }
    const x = twoByTwo(p.A, p.B, p.C, p.D).x; return [4, rd(x, 2), x > chiStar(1) ? 1 : 0];
  },
  /* k only picks the wording. */
  q30b: p => [rd(corr(p.x, p.y), 2)],
  q30c: p => { const r = corr(p.x, p.y); return [rd(r, 2), r > 0 ? 1 : 2]; },
  q30d: p => [rd(corr(p.x, p.y), 2)],
});
})();
