/* Independent oracles for Data and inference practice missions, file 7 of 8: q31b–q35d (game/realms/stats/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const clean = v => Math.round(v * 1e9) / 1e9;
const rnd = (v, d) => { const k = Math.pow(10, d); return Math.round(clean(v * k)) / k; };
/* Least-squares line by solving the two normal equations  n a + Sx b = Sy  and  Sx a + Sxx b = Sxy  (Cramer's rule). */
const fit = (xs, ys) => {
  const n = xs.length; let Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
  for (let i = 0; i < n; i++) { Sx += xs[i]; Sy += ys[i]; Sxx += xs[i] * xs[i]; Sxy += xs[i] * ys[i]; }
  const det = n * Sxx - Sx * Sx;
  return { a: clean((Sy * Sxx - Sx * Sxy) / det), b: clean((n * Sxy - Sx * Sy) / det) };
};
/* Five consecutive hours starting at c (p.c is the first x; the prompt lists x as c, c+1, ..., c+4). */
const five = c => [c, c + 1, c + 2, c + 3, c + 4];
/* Table of 95% critical values of r, as printed in the prompts, keyed by degrees of freedom. */
const CRIT = { 4: 0.811, 5: 0.754, 6: 0.707, 7: 0.666, 8: 0.632, 9: 0.602, 10: 0.576, 11: 0.555, 12: 0.532, 13: 0.514 };
/* Residuals are stored in tenths of a kWh (p.res); s is the printed standard deviation about the line (divide by n − 2), 2 d.p. */
const sOf = res => { const e = res.map(v => v / 10); let ss = 0; for (const v of e) ss += v * v; return rnd(Math.sqrt(ss / (e.length - 2)), 2); };
const outliers = res => { const s = sOf(res); let k = 0; for (const v of res) if (Math.abs(v / 10) > 2 * s) k++; return k; };
const sig = (r100, N) => (Math.abs(r100) / 100 > CRIT[N - 2] ? 1 : 0);
const sumSq = (xs, m) => { let t = 0; for (const x of xs) t += (x - m) * (x - m); return t; };
const mean = xs => xs.reduce((s, v) => s + v, 0) / xs.length;
/* Sums of squares for groups of readings: between (replace each reading by its group mean), within, total. */
const anova = g => {
  const all = [].concat.apply([], g), G = mean(all);
  let between = 0, within = 0;
  for (const grp of g) { const m = mean(grp); for (const x of grp) { between += (m - G) * (m - G); within += (x - m) * (x - m); } }
  return { G: clean(G), between: clean(between), within: clean(within), total: clean(sumSq(all, G)) };
};
Object.assign(window.ORACLE, {
  /* q31b: x = c..c+4 (p.c is the first x, y is the list); normal equations. */
  q31b: p => { const f = fit(five(p.c), p.y); return [f.b, f.a]; },
  /* q31c: x = c..c+4; forecast at x1; payment = p credits per kWh (p.p is the price). */
  q31c: p => { const f = fit(five(p.c), p.y), yh = clean(f.a + f.b * p.x1); return [f.b, f.a, yh, clean(yh * p.p)]; },
  /* q31d: uneven x list. */
  q31d: p => { const f = fit(p.x, p.y); return [f.b, f.a]; },
  /* q32b: residual = recorded − predicted at x2 (y2 recorded); prediction at x1; inside [lo, hi] = 1. */
  q32b: p => [clean(p.y2 - (p.a + p.b * p.x2)), clean(p.a + p.b * p.x1), p.x1 >= p.lo && p.x1 <= p.hi ? 1 : 0],
  /* q32c: forecasts at x1 and x2, their total, residual of day 1 (y1 real). */
  q32c: p => { const f = x => clean(p.a + p.b * x); return [f(p.x1), f(p.x2), clean(f(p.x1) + f(p.x2)), clean(p.y1 - f(p.x1))]; },
  /* q32d: x = c..c+4; new day at x1; tested day at xr; interpolation if x1 within c..c+4. */
  q32d: p => {
    const xs = five(p.c), f = fit(xs, p.y), at = x => clean(f.a + f.b * x);
    return [f.b, f.a, at(p.x1), clean(p.y[xs.indexOf(p.xr)] - at(p.xr)), p.x1 >= xs[0] && p.x1 <= xs[4] ? 1 : 0];
  },
  /* q33b: r = r100/100; unexplained percentage = 100 × (1 − r²), 1 d.p. */
  q33b: p => { const r = p.r100 / 100, r2 = clean(r * r); return [r2, rnd(100 * (1 - r2), 1)]; },
  /* q33c: r = m/10, negative when neg is 1; total variation = 100 k kWh² (k is a multiplier of 100 in the prompt). */
  q33c: p => { const r = (p.neg ? -p.m : p.m) / 10, r2 = clean(r * r), T = 100 * p.k; return [r2, clean(r2 * T), clean(T - r2 * T)]; },
  /* q33d: r² found as explained variation ÷ total variation from the fitted line (not from the top/A/B formula). */
  q33d: p => {
    const xs = p.pts.map(q => q[0]), ys = p.pts.map(q => q[1]), f = fit(xs, ys), my = mean(ys);
    let sst = 0, sse = 0;
    for (let i = 0; i < xs.length; i++) { sst += (ys[i] - my) * (ys[i] - my); const e = ys[i] - (f.a + f.b * xs[i]); sse += e * e; }
    const r2 = 1 - sse / sst; return [rnd(100 * r2, 1), rnd(100 * (1 - r2), 1)];
  },
  /* q34b: critical value from the table at df = N − 2; significant when |r| beats it; outliers beyond 2 s. */
  q34b: p => [CRIT[p.N - 2], sig(p.r100, p.N), outliers(p.res)],
  /* q34c: as q34b, then crew-hours = c per outlier day (p.c is the crew-hours per day). */
  q34c: p => { const k = outliers(p.res); return [CRIT[p.N - 2], sig(p.r100, p.N), k, k * p.c]; },
  /* q34d: as q34b with the percentage of variation explained = 100 r², 1 d.p. */
  q34d: p => { const r = p.r100 / 100; return [CRIT[p.N - 2], sig(p.r100, p.N), rnd(100 * r * r, 1), outliers(p.res)]; },
  /* q35b: groups g of readings. */
  q35b: p => { const a = anova(p.g); return [a.between, a.within, a.total]; },
  /* q35c: percentage of the total spread that lies between groups, 1 d.p. */
  q35c: p => { const a = anova(p.g); return [a.between, a.within, rnd(100 * a.between / a.total, 1)]; },
  /* q35d: unequal group sizes; grand mean of all readings together. */
  q35d: p => { const a = anova(p.g); return [a.G, a.between, a.within]; },
});
})();
