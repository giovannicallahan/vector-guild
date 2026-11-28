/* Independent oracles for Data and inference practice missions, file 8 of 8: q36b–q40d (game/realms/stats/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* ---- numerical toolkit: distributions by series and continued fractions, critical values by bisection ---- */
const rnd = (x, d) => { const f = Math.pow(10, d); return Math.round((x + (x >= 0 ? 1 : -1) * 1e-9 / f) * f) / f; };
const lgam = x => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const k of c) s += k / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
/* regularised lower incomplete gamma P(a, x) */
const gammaP = (a, x) => {
  if (x <= 0) return 0;
  if (x < a + 1) { let sum = 1 / a, term = sum; for (let n = 1; n < 500; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(-x + a * Math.log(x) - lgam(a)); }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; }
  return 1 - Math.exp(-x + a * Math.log(x) - lgam(a)) * h;
};
/* regularised incomplete beta I_x(a, b) */
const betaI = (x, a, b) => {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const cf = (x, a, b) => { let c = 1, d = 1 - (a + b) * x / (a + 1); if (Math.abs(d) < 1e-300) d = 1e-300; d = 1 / d; let h = d;
    for (let m = 1; m < 500; m++) { const m2 = 2 * m; let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; h *= d * c;
      aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) d = 1e-300; c = 1 + aa / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; }
    return h; };
  const bt = Math.exp(lgam(a + b) - lgam(a) - lgam(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * cf(x, a, b) / a : 1 - bt * cf(1 - x, b, a) / b;
};
const normCdf = z => z >= 0 ? 0.5 + 0.5 * gammaP(0.5, z * z / 2) : 0.5 - 0.5 * gammaP(0.5, z * z / 2);
const chiCdf = (x, df) => gammaP(df / 2, x / 2);
const fCdf = (x, d1, d2) => betaI(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2);
const tCdf2 = (t, df) => 1 - betaI(df / (df + t * t), df / 2, 0.5);      /* P(|T| <= t) */
const solve = (cdf, target) => { let lo = 0, hi = 1000; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (cdf(mid) < target) lo = mid; else hi = mid; } return (lo + hi) / 2; };
/* table values as printed in the prompts: chi-square and t to 3 places, F to 2 */
const chiRight = df => rnd(solve(x => chiCdf(x, df), 0.95), 3);
const chiLeft = df => rnd(solve(x => chiCdf(x, df), 0.05), 3);
const tTwo = df => rnd(solve(t => tCdf2(t, df), 0.95), 3);
const fRight = (d1, d2) => rnd(solve(x => fCdf(x, d1, d2), 0.95), 2);
const ZSTAR = { 90: 1.645, 95: 1.96, 99: 2.576 };
const sum = a => a.reduce((s, v) => s + v, 0);
const mean = a => sum(a) / a.length;
const ss = a => { const m = mean(a); return sum(a.map(v => (v - m) * (v - m))); };
const b01 = v => v ? 1 : 0;
/* one-way ANOVA from raw groups: [SSB, SSW, dfB, dfW] */
const anova = groups => { const all = [].concat(...groups), gm = mean(all);
  return [sum(groups.map(g => g.length * (mean(g) - gm) * (mean(g) - gm))), sum(groups.map(ss)), groups.length - 1, all.length - groups.length]; };
/* test number and degrees of freedom for each kind of study. The generator's `kind` is only an index into its list of
   scenario texts; the numbers here come from the scenario each text describes (one mean with known σ, one mean with σ
   estimated, one share, two independent means (df printed in the story, from the formula), two shares, matched pairs, goodness of fit, two-way table, several means). */
const study = s => ({
  1: [1, 0], 2: [2, s.n - 1], 3: [3, 0], 4: [4, s.df], 5: [5, 0], 6: [6, s.n - 1], 7: [7, s.c - 1], 8: [8, (s.r - 1) * (s.c - 1)], 9: [9, s.k - 1]
}[s.kind]);
/* one-sided or two-sided z test on a mean; direction code: 1 less than, 2 more than, 3 different from (index into texts) */
const ztest = (xbar, mu, sigma, n, dir, alpha) => {
  const z = rnd((xbar - mu) / (sigma / Math.sqrt(n)), 2);
  const left = rnd(normCdf(z), 4);                      /* area to the left from a 4-place table */
  const pv = dir === 1 ? left : dir === 2 ? rnd(1 - left, 4) : rnd(2 * (1 - rnd(normCdf(Math.abs(z)), 4)), 4);
  const exact = (xbar - mu) / (sigma / Math.sqrt(n));
  const pe = dir === 1 ? normCdf(exact) : dir === 2 ? 1 - normCdf(exact) : 2 * (1 - normCdf(Math.abs(exact)));
  return [z, pv, b01(pe < alpha)];
};
Object.assign(window.ORACLE, {
  /* q36b: df from groups and readings, mean squares from sums of squares, then compare F with the 5% critical value. */
  q36b: p => {
    const ssb = p.msb * (p.k - 1), ssw = p.msw * (p.n - p.k), dfb = p.k - 1, dfw = p.n - p.k;
    const F = (ssb / dfb) / (ssw / dfw);
    return [dfb, dfw, rnd(F, 2), b01(F > fRight(dfb, dfw))];
  },
  /* q36c: sum of squares between from the group means (equal groups of m), F from the stated within sum of squares. */
  q36c: p => {
    const N = p.k * p.m, gm = mean(p.means), ssb = sum(p.means.map(x => p.m * (x - gm) * (x - gm)));
    const dfb = p.k - 1, dfw = N - p.k, F = (ssb / dfb) / ((p.msw * dfw) / dfw);
    return [ssb, rnd(F, 2), b01(F > fRight(dfb, dfw))];
  },
  /* q36d: one-way ANOVA straight from the raw readings. */
  q36d: p => { const [ssb, ssw, dfb, dfw] = anova(p.g), F = (ssb / dfb) / (ssw / dfw); return [ssb, ssw, rnd(F, 2), b01(F > fRight(dfb, dfw))]; },
  /* q37b: chi-square for one variance from n, s and σ (tenths); tail R = suspects more spread, L = less (index into texts). */
  q37b: p => {
    const df = p.n - 1, s = p.s10 / 10, sg = p.sig10 / 10, x2 = df * s * s / (sg * sg);
    return [df, rnd(x2, 2), b01(p.tail === 'R' ? x2 > chiRight(df) : x2 < chiLeft(df))];
  },
  /* q37c: sum of squared deviations from the readings, then chi-square against σ². */
  q37c: p => {
    const df = p.x.length - 1, sq = ss(p.x), sg = p.sig10 / 10, x2 = sq / (sg * sg);
    return [sq, rnd(x2, 2), b01(p.tail === 'R' ? x2 > chiRight(df) : x2 < chiLeft(df))];
  },
  /* q37d: sample variance from the readings, chi-square from the exact variance against σ² (tenths). */
  q37d: p => {
    const df = p.x.length - 1, s2 = ss(p.x) / df, v = p.v10 / 10, x2 = df * s2 / v;
    return [df, rnd(s2, 2), rnd(x2, 2), b01(p.tail === 'R' ? x2 > chiRight(df) : x2 < chiLeft(df))];
  },
  /* q38b: the interval is x̄ ± margin; a two-tailed test at the matching level rejects a claim outside it (hundredths, whole-number arithmetic). */
  q38b: p => {
    const lo = p.xb10 * 10 - p.e100, hi = p.xb10 * 10 + p.e100;
    return [p.xb10 / 10, p.e100 / 100].concat(p.m10.map(m => b01(m * 10 < lo || m * 10 > hi)));
  },
  /* q38c: margin z*·σ/√n, the interval, and which claims fall outside it. */
  q38c: p => {
    const me = ZSTAR[p.lvl] * p.sg / Math.sqrt(p.k), x = p.xb10 / 10;
    return [rnd(me, 2), rnd(x - me, 2), rnd(x + me, 2)].concat(p.m10.map(m => b01(Math.abs(x - m / 10) > me)));
  },
  /* q38d: the three margins, then reject when the gap |x̄ − μ| is larger than the margin of that level. */
  q38d: p => {
    const gap = Math.abs(p.d10) / 10, m = [90, 95, 99].map(l => ZSTAR[l] * p.sg / Math.sqrt(p.k));
    return m.map(v => rnd(v, 2)).concat(m.map(v => b01(gap > v)));
  },
  /* q39b: name the study's test and its degrees of freedom. */
  q39b: p => study(p),
  /* q39c: two studies in order. */
  q39c: p => study(p.a).concat(study(p.b)),
  /* q39d: the test and df, then compare the reported statistic (a stated multiple f% of the critical value for the right df) with that critical value. */
  q39d: p => {
    const [t, df] = study(p), sgn = p.neg ? -1 : 1;
    const crit = t === 4 || t === 6 ? tTwo(df) : t === 7 || t === 8 ? chiRight(df) : t === 9 ? fRight(df, p.N - p.k) : ZSTAR[95];
    const stat = rnd(crit * p.f / 100, 2) * sgn;
    return [t, df, b01(Math.abs(stat) > crit)];
  },
  /* q40b: z test on one mean; x̄ = μ + d10/10. */
  q40b: p => ztest(p.mu + p.d10 / 10, p.mu, p.sigma, p.n, p.tail, p.alpha),
  /* q40c: sample mean from the readings, then the z test. */
  q40c: p => { const x = mean(p.x); return [x].concat(ztest(x, p.mu, p.sigma, p.n, p.tail, p.alpha)); },
  /* q40d: two-tailed z test and the matching interval. */
  q40d: p => {
    const x = p.mu + p.d10 / 10, me = ZSTAR[p.lvl] * p.sigma / Math.sqrt(p.n);
    return ztest(x, p.mu, p.sigma, p.n, 3, 1 - p.lvl / 100).concat([rnd(x - me, 2), rnd(x + me, 2)]);
  },
});
})();
