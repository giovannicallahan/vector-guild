/* Independent oracles for Data and inference learn missions, file c: q21–q30 (game/realms/stats/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Shared helpers, local to this file. */
const rd = (x, k) => Number((x + (x >= 0 ? 1 : -1) * 1e-9).toFixed(k));
/* Standard normal area to the left of z, by the power series Φ(z) = ½ + φ(z)·Σ z^(2k+1)/(1·3·5···(2k+1)), then
   rounded to 4 decimal places as the printed table rows are. */
const phi = z => {
  let term = z, sum = z;
  for (let k = 1; k < 300; k++) { term *= z * z / (2 * k + 1); sum += term; }
  return 0.5 + Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) * sum;
};
const tbl = z => rd(phi(z), 4);
/* p-value from the table row of z. tail: 1 left, 2 right, 3 both tails (double the smaller tail). */
const pval = (z, tail) => {
  const left = tbl(z), right = rd(1 - left, 4);
  return tail === 1 ? left : tail === 2 ? right : rd(2 * Math.min(left, right), 4);
};
const reject = (p, a) => (p < a - 1e-12 ? 1 : 0);
/* Student t: area to the left of x by Simpson's rule on the density, and the critical value by bisection. */
const lgam = x => { /* Lanczos */
  const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015; for (let j = 0; j < 6; j++) s += g[j] / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
};
const tdens = (x, df) => Math.exp(lgam((df + 1) / 2) - lgam(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + x * x / df, -(df + 1) / 2);
const tupper = (x, df) => { /* area to the right of x >= 0 */
  const n = 4000, h = x / n; let s = tdens(0, df) + tdens(x, df);
  for (let i = 1; i < n; i++) s += tdens(i * h, df) * (i % 2 ? 4 : 2);
  return 0.5 - s * h / 3;
};
const tcrit = (df, upper) => { /* x with area `upper` to its right, 3 d.p. */
  let lo = 0, hi = 10;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (tupper(m, df) > upper) lo = m; else hi = m; }
  return rd((lo + hi) / 2, 3);
};
/* Sample sizes and standard deviations the two-sample prompts print: index -> [n, s] (q24 and q29 only store the index). */
const NS = [[10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 8], [16, 2], [16, 4], [16, 6], [16, 8], [20, 2], [20, 3], [20, 4],
  [20, 5], [20, 6], [20, 8], [25, 2], [25, 3], [25, 4], [25, 5], [25, 6], [25, 8]];
/* Claimed share (as a fraction) and sample size the one-proportion prompts print: index -> [p0, n] (q22 and q23 k=1). */
const PN = [[0.5, 100], [0.2, 100], [0.1, 100], [0.8, 100], [0.9, 100], [0.2, 400], [0.1, 400], [0.5, 400], [0.8, 400], [0.9, 400], [0.5, 625]];
/* Claimed shares large/medium/small the goodness-of-fit prompts print: index -> percentages (q27 and q29 k=3). */
const SH = [[50, 30, 20], [40, 40, 20], [60, 25, 15], [25, 50, 25], [45, 35, 20], [70, 20, 10], [30, 45, 25]];
/* Two-sample (Welch) t from summary numbers: [t, df rounded down]. */
const welch = (n1, s1, n2, s2, d) => {
  const a = s1 * s1 / n1, b = s2 * s2 / n2;
  return [d / Math.sqrt(a + b), Math.floor((a + b) * (a + b) / (a * a / (n1 - 1) + b * b / (n2 - 1)) + 1e-9)];
};
/* Chi-square statistic over parallel lists of observed and expected counts. */
const chi = (O, E) => O.reduce((s, o, i) => s + (o - E[i]) * (o - E[i]) / E[i], 0);
/* Two-way table: chi-square from a grid of observed counts (rows × columns). */
const chiGrid = G => {
  const rt = G.map(r => r.reduce((a, b) => a + b, 0)), ct = G[0].map((_, j) => G.reduce((a, r) => a + r[j], 0));
  const N = rt.reduce((a, b) => a + b, 0); let s = 0;
  G.forEach((r, i) => r.forEach((o, j) => { const e = rt[i] * ct[j] / N; s += (o - e) * (o - e) / e; }));
  return s;
};
Object.assign(window.ORACLE, {
  /* tail 1 left (<), 2 right (>), 3 two-tailed (≠); z is the stated statistic, a is α. */
  q21: p => { const pv = pval(p.z, p.tail); return [pv, reject(pv, p.a)]; },
  /* c is only an index into the list of claimed shares and sample sizes (PN); x is the count that sprouted
     (always a whole number; for the 625 row the generator centres its draws on 313). off only places the row of z among
     the three printed table rows and does not change the answer. z from the normal
     approximation, rounded to 2 d.p., then the table row of the rounded z. */
  q22: p => {
    const [p0, n] = PN[p.c], z = rd((p.x - n * p0) / Math.sqrt(n * p0 * (1 - p0)), 2);
    return [z, reject(pval(z, p.tail), p.a)];
  },
  /* k = 0: mean test with known σ (m0 claimed mean, N cells, sg σ, xb sample mean); k = 1: share test (c indexes PN,
     x is the count). tail is stated by the wording: 1 lower, 2 higher, 3 different. */
  q23: p => {
    let z;
    if (p.k === 0) z = (p.xb - p.m0) / (p.sg / Math.sqrt(p.N));
    else { const [p0, n] = PN[p.c]; z = (p.x / n - p0) / Math.sqrt(p0 * (1 - p0) / n); }
    z = rd(z, 2);
    return [p.tail, z, reject(pval(z, p.tail), p.a)];
  },
  /* i and j are only indexes into NS (plots and standard deviation for new and old seed); x1, x2 the means;
     tail 2 is Hₐ: μ₁ > μ₂ (area 0.05 right), tail 3 is ≠ (0.025 each side). Critical value looked up in a t table. */
  q24: p => {
    const [n1, s1] = NS[p.i], [n2, s2] = NS[p.j];
    const [t, df] = welch(n1, s1, n2, s2, p.x1 - p.x2);
    const tc = tcrit(df, p.tail === 2 ? 0.05 : 0.025);
    const rej = p.tail === 2 ? t > tc : Math.abs(t) > tc;
    return [rd(t, 2), rej ? 1 : 0];
  },
  /* Pooled share from all successes over all seeds; z from the standard error under H₀. */
  q25: p => {
    const ph = (p.x1 + p.x2) / (p.n1 + p.n2);
    const z = (p.x1 / p.n1 - p.x2 / p.n2) / Math.sqrt(ph * (1 - ph) * (1 / p.n1 + 1 / p.n2));
    return [rd(ph, 3), rd(z, 2)];
  },
  /* old holds the old-seed yields; dif the new minus old differences, so the new yields are old + dif. */
  q26: p => {
    const n = p.dif.length, newY = p.old.map((o, i) => o + p.dif[i]);
    const dd = newY.map((v, i) => v - p.old[i]);
    const mean = dd.reduce((a, b) => a + b, 0) / n;
    const ss = dd.reduce((a, d) => a + (d - mean) * (d - mean), 0);
    return [rd(mean, 2), rd(mean / Math.sqrt(ss / (n - 1) / n), 2)];
  },
  /* s is only an index into SH (claimed percentages); N seeds; d1 and d2 are the large and medium counts
     above expected, and the small count is what is left of N. */
  q27: p => {
    const E = SH[p.s].map(q => p.N * q / 100);
    const O = [E[0] + p.d1, E[1] + p.d2]; O.push(p.N - O[0] - O[1]);
    return [E[0], E[1], E[2], rd(chi(O, E), 2)];
  },
  /* 2 × 3 table. a/10 of the N plots had the new seed; b are the poor/fair/good column shares in tenths.
     New-seed counts: expected + d1 (poor), expected + d2 (fair), the rest of the new total (good); the old row
     is the column total minus the new row. r (0 new, 1 old) and c (0 poor, 1 fair, 2 good) pick the cell asked. */
  q28: p => {
    const rt = [p.N * p.a / 10, p.N - p.N * p.a / 10], ct = p.b.map(x => p.N * x / 10);
    const E = rt.map(r => ct.map(c => r * c / p.N));
    const nw = [E[0][0] + p.d1, E[0][1] + p.d2]; nw.push(rt[0] - nw[0] - nw[1]);
    const G = [nw, ct.map((c, j) => c - nw[j])];
    return [E[p.r][p.c], 2, rd(chiGrid(G), 2)];
  },
  /* k is the right test and the scenario: 1 two-sample (A and B index NS, means C and D); 2 matched pairs (A pairs,
     mean B, sd C); 3 goodness of fit (A indexes SH, B seeds, C and D the large and medium counts above expected);
     4 independence (A plots, B/10 had new seed, C/10 healthy, D = new-seed healthy count above expected). */
  q29: p => {
    if (p.k === 1) {
      const [n1, s1] = NS[p.A], [n2, s2] = NS[p.B];
      return [1, rd(welch(n1, s1, n2, s2, p.C - p.D)[0], 2)];
    }
    if (p.k === 2) return [2, rd(p.B / (p.C / Math.sqrt(p.A)), 2)];
    if (p.k === 3) {
      const E = SH[p.A].map(q => p.B * q / 100), O = [E[0] + p.C, E[1] + p.D]; O.push(p.B - O[0] - O[1]);
      return [3, rd(chi(O, E), 2)];
    }
    const nt = p.A * p.B / 10, ht = p.A * p.C / 10, nh = nt * ht / p.A + p.D;
    return [4, rd(chiGrid([[nh, nt - nh], [ht - nh, p.A - nt - (ht - nh)]]), 2)];
  },
  /* Pearson r as the average product of z-scores (n − 1 divisor). k is only the scenario text (sunlight or haze). */
  q30: p => {
    const n = p.x.length, mx = p.x.reduce((a, b) => a + b, 0) / n, my = p.y.reduce((a, b) => a + b, 0) / n;
    const sx = Math.sqrt(p.x.reduce((a, v) => a + (v - mx) * (v - mx), 0) / (n - 1));
    const sy = Math.sqrt(p.y.reduce((a, v) => a + (v - my) * (v - my), 0) / (n - 1));
    let s = 0; for (let i = 0; i < n; i++) s += (p.x[i] - mx) / sx * (p.y[i] - my) / sy;
    return [rd(s / (n - 1), 2)];
  }
});
})();
