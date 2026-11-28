/* Independent oracles for Data and inference learn missions, file d: q31–q40 (game/realms/stats/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Numerical helpers: tables of critical values are rebuilt from the distributions themselves (incomplete beta and
   gamma functions, then a bisection search), and the normal curve comes from an erf series. */
const lgamma = x => {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015;
  for (const k of c) s += k / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
};
const betacf = (a, b, x) => {
  const tiny = 1e-300; let c = 1, d = 1 - (a + b) * x / (a + 1);
  if (Math.abs(d) < tiny) d = tiny; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m; let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny; c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny; d = 1 / d; h *= d * c;
    aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny; c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny; d = 1 / d;
    const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-14) break;
  }
  return h;
};
const ibeta = (a, b, x) => {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
};
const gammaP = (a, x) => {              // regularised lower incomplete gamma, by its power series
  if (x <= 0) return 0;
  let term = 1 / a, sum = term;
  for (let n = 1; n < 2000; n++) { term *= x / (a + n); sum += term; if (term < sum * 1e-15) break; }
  return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
};
const bisect = (f, lo, hi) => { for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; } return (lo + hi) / 2; };
/* F value with 5% of the area to its right. */
const fCrit = (d1, d2) => bisect(f => ibeta(d1 / 2, d2 / 2, d1 * f / (d1 * f + d2)) - 0.95, 0, 1e4);
/* χ² value with the given area to its left. */
const chiLeft = (df, area) => bisect(x => gammaP(df / 2, x / 2) - area, 0, 1e3);
/* Critical |r| at the 5% level (two tails): the r whose t statistic sits at the two-tailed 5% point. */
const rCrit = df => {
  const t = bisect(t => 0.05 - ibeta(df / 2, 0.5, df / (df + t * t)), 0, 1e3);
  return t / Math.sqrt(t * t + df);
};
const phi = z => { // normal area to the left of z, by the Maclaurin series of erf (|z| below 6)
  let term = z, sum = z;
  for (let n = 1; n < 200; n++) { term *= -z * z / (2 * n); sum += term / (2 * n + 1); }
  return 0.5 + sum / Math.sqrt(2 * Math.PI);
};
const r4 = x => Math.round(x * 1e4 + 1e-9) / 1e4;
const r2 = x => Math.round(x * 100 + 1e-9) / 100;

Object.assign(window.ORACLE, {
  /* Least-squares line through five points x = c, c+1, …, c+4, found by solving the two normal equations
     n·a + Σx·b = Σy and Σx·a + Σx²·b = Σxy with Cramer's rule. Returns [slope, intercept]. */
  q31: p => {
    const xs = [0, 1, 2, 3, 4].map(i => p.c + i), ys = p.y, n = 5;
    const sx = xs.reduce((s, v) => s + v, 0), sy = ys.reduce((s, v) => s + v, 0);
    const sxx = xs.reduce((s, v) => s + v * v, 0), sxy = xs.reduce((s, v, i) => s + v * ys[i], 0);
    const det = n * sxx - sx * sx;
    return [r4((n * sxy - sx * sy) / det), r4((sy * sxx - sx * sxy) / det)];
  },
  /* ŷ = a + bx. Prediction at x1; residual is observed y2 minus the line's value at x2; the fitted range is lo..hi. */
  q32: p => [r4(p.a + p.b * p.x1), r4(p.y2 - (p.a + p.b * p.x2)), (p.x1 >= p.lo && p.x1 <= p.hi) ? 1 : 0],
  /* r = r100 ÷ 100. Work in hundredths of a percent: r² as a percentage is r100² ÷ 100, rounded to tenths. */
  q33: p => {
    const sq = p.r100 * p.r100;                        // r² × 10000
    return [Math.round(sq / 10) / 10, Math.round((10000 - sq) / 10) / 10];
  },
  /* df = n − 2. The critical r comes from the t distribution (r = t ÷ √(t² + df)); s is the residual spread with
     n − 2 in the divisor, rounded to 1 decimal as the prompt states it; outliers lie beyond 2s. res is in tenths. */
  q34: p => {
    const df = p.n - 2, crit = rCrit(df), r = p.r100 / 100;
    const ss = p.res.reduce((s, e) => s + (e / 10) * (e / 10), 0);
    const s = Math.round(Math.sqrt(ss / df) * 10 + 1e-9) / 10;
    const out = p.res.filter(e => Math.abs(e / 10) > 2 * s).length;
    return [df, Math.abs(r) > crit ? 1 : 0, out];
  },
  /* g is an array of groups. Within-group SS from each reading's distance to its own mean; total SS from the grand
     mean; the between-group SS is what the total has beyond the within part. */
  q35: p => {
    const all = p.g.flat(), M = all.reduce((s, v) => s + v, 0) / all.length;
    const sst = all.reduce((s, v) => s + (v - M) * (v - M), 0);
    const ssw = p.g.reduce((s, grp) => { const m = grp.reduce((a, v) => a + v, 0) / grp.length; return s + grp.reduce((a, v) => a + (v - m) * (v - m), 0); }, 0);
    return [Math.round((sst - ssw) * 1e6) / 1e6, Math.round(ssw * 1e6) / 1e6];
  },
  /* k groups, n readings. The prompt gives the sums of squares: SSB = msb × (k − 1) and SSW = msw × (n − k)
     (ctx only picks the wording). F is compared with the 5% right-tail point of the F curve for (df between, df within). */
  q36: p => {
    const db = p.k - 1, dw = p.n - p.k;
    const ssb = p.msb * db, ssw = p.msw * dw;
    const F = (ssb / db) / (ssw / dw);
    return [db, dw, r2(F), F > fCrit(db, dw) ? 1 : 0];
  },
  /* χ² = (n − 1)s² ÷ σ² with s = s10/10 and σ = sig10/10. Left-tailed ('L') rejects below the 5%-left value,
     right-tailed ('R') above the 5%-right value. */
  q37: p => {
    const df = p.n - 1, s = p.s10 / 10, sig = p.sig10 / 10;
    const chi = df * s * s / (sig * sig);
    const rej = p.tail === 'L' ? chi < chiLeft(df, 0.05) : chi > chiLeft(df, 0.95);
    return [df, r2(chi), rej ? 1 : 0];
  },
  /* Interval x̄ ± margin (x̄ = xb10 ÷ 10, margin = e100 ÷ 100). A two-tailed test at α = 1 − lvl% rejects exactly the
     claims outside it; the comparison is done in hundredths to avoid rounding. lvl only words the prompt. */
  q38: p => {
    const lo = (p.xb10 * 10 - p.e100) / 100, hi = (p.xb10 * 10 + p.e100) / 100;
    const out = m10 => (m10 * 10 < p.xb10 * 10 - p.e100 || m10 * 10 > p.xb10 * 10 + p.e100) ? 1 : 0;
    return [Math.round(lo * 100) / 100, Math.round(hi * 100) / 100, ...p.m10.map(out)];
  },
  /* kind is only an index into the nine scenarios of the prompt. Each scenario is described by what was recorded,
     how many groups, and what the design is; the test and its df follow from those answers. */
  q39: p => {
    const d = {
      1: { out: 'measure', groups: 1, sigmaKnown: true },
      2: { out: 'measure', groups: 1, sigmaKnown: false },
      3: { out: 'count', groups: 1, vars: 1, shares: 'one' },
      4: { out: 'measure', groups: 2 },
      5: { out: 'count', groups: 2, vars: 1 },
      6: { out: 'measure', groups: 1, paired: true },
      7: { out: 'count', groups: 1, vars: 1, shares: 'many' },
      8: { out: 'count', vars: 2 },
      9: { out: 'measure', groups: 3 }
    }[p.kind];
    if (d.out === 'measure') {
      if (d.groups >= 3) return [9, p.k - 1];
      if (d.paired) return [6, p.n - 1];
      if (d.groups === 2) return [4, p.df];   // df printed in the story, from the two-sample formula
      return d.sigmaKnown ? [1, 0] : [2, p.n - 1];
    }
    if (d.vars === 2) return [8, (p.r - 1) * (p.c - 1)];
    if (d.groups === 2) return [5, 0];
    return d.shares === 'one' ? [3, 0] : [7, p.c - 1];
  },
  /* z = (x̄ − μ₀) ÷ (σ ÷ √n), with x̄ − μ₀ = d10 ÷ 10. The p-value is read the way the table is: the area to the left
     of |z|, rounded to 4 decimals, then 1 minus it for one tail, doubled for two. tail 1 = left, 2 = right, 3 = two. */
  q40: p => {
    const z = (p.d10 / 10) / (p.sigma / Math.sqrt(p.n));
    const T = r4(phi(Math.abs(z)));                    // table entry for |z|
    const left = z < 0 ? 1 - T : T;                    // area to the left of z
    const one = p.tail === 1 ? left : p.tail === 2 ? 1 - left : 1 - T;
    const pval = r4(p.tail === 3 ? 2 * one : one);
    return [r2(z), pval, pval < p.alpha ? 1 : 0];
  }
});
})();
