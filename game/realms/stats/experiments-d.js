/* Data and inference concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* "4.3636…, which is 4.36 to 2 decimal places", or the number alone when it has at most 2 decimals. */
const to2 = x => { const r = Math.round(x * 100) / 100; if (Math.abs(x - r) < 1e-9) return n(r); const e = Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-7; return `${n(x)}${e ? '' : '…'}, which is ${n(r)} to 2 decimal places`; };
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* q31: five days, x = 5 … 9; the first and last outputs move by t in opposite directions, so ȳ stays 26 and
    Σ(x − x̄)(y − ȳ) = 32 + 4t. */
 q31: t => { t = T(t); const sxy = 32 + 4 * t, b = sxy / 10, a = Math.round((26 - 7 * b) * 10) / 10;
  return E('Predict the slope b of the least-squares line, in kWh per hour of sunlight.', `x̄ = 7 and ȳ = 26. Σ(x − x̄)(y − ȳ) = ${n(sxy)} and Σ(x − x̄)² = 10, so b = ${n(sxy)} ÷ 10 = ${n(b)} and a = 26 − ${par(b)} × 7 = ${n(a)}.`, [['Slope b', b], ['Intercept a', a], ['Σ(x − x̄)(y − ȳ)', sxy]]); },
 /* q32: ŷ = 4.5 + 2.8x at x = 2 … 14 hours; the line was fitted to 3 to 10 hours. */
 q32: t => { t = T(t); const x = 2 + (t + 10) % 13, y = Math.round((4.5 + 2.8 * x) * 10) / 10, inside = x >= 3 && x <= 10 ? 1 : 0;
  return E('Predict the output the line gives for that day, in kWh.', `ŷ = 4.5 + 2.8 × ${n(x)} = ${n(y)} kWh. ${n(x)} hours is ${inside ? 'inside' : 'outside'} the fitted range of 3 to 10 hours, so this is an ${inside ? 'interpolation' : 'extrapolation'}.`, [['Predicted output ŷ (kWh)', y], ['1 interpolation, 0 extrapolation', inside]]); },
 /* q33: r = 0.32 … 0.72 in steps of 0.02; the target is 100r², exact to 2 decimals. */
 q33: t => { t = T(t); const v = 52 + 2 * t, r = v / 100, sq = v * v / 10000, pc = v * v / 100;
  return E('Predict the exact percentage of the variation in y that the line explains (100 × r², not rounded).', `r² = ${n(r)}² = ${n(sq)}, so the line explains ${n(pc)}% of the variation and leaves ${n(100 - pc)}% unexplained.`, [['Explained (%)', pc], ['r²', sq]]); },
 /* q34: ten fixed residuals; s runs from 0.85 to 2.85, so 2s (odd tenths from 1.7) never equals a residual's size. */
 q34: t => { t = T(t); const res = [1.2, -0.8, 0.5, -1.6, 4.6, -1.1, 0.3, -2, -0.4, -0.7], s = (85 + 10 * (t + 10)) / 100, two = Math.round(2 * s * 100) / 100, out = res.filter(x => Math.abs(x) > two);
  return E('Predict how many of the points are outliers by the two-standard-deviation rule.', `2s = 2 × ${n(s)} = ${n(two)} kWh. ${out.length ? `Residuals further than ${n(two)} from 0: ${out.map(n).join(', ')}.` : `No residual is further than ${n(two)} from 0.`}`, [['Outliers', out.length], ['2s (kWh)', two]]); },
 /* q35: A moves down by t and B up by t, so the grand mean stays 14 and the within-groups sum stays 28. */
 q35: t => { t = T(t); const ma = 13 - t, mb = 17 + t, ssb = 4 * ((ma - 14) * (ma - 14) + (mb - 14) * (mb - 14) + 4);
  return E('Predict the sum of squares between groups.', `Group means ${n(ma)}, ${n(mb)} and 12; grand mean 14. Between: 4 × ${par(ma - 14)}² + 4 × ${par(mb - 14)}² + 4 × (−2)² = ${n(ssb)}. Within groups the sum stays 28.`, [['Sum of squares between groups', ssb], ['Sum of squares within groups', 28], ['Grand mean', 14]]); },
 /* q36: 3 groups, 15 readings, SS within 132 (mean square 11), SS between 96 + 6t. F = (48 + 3t) ÷ 11 is never a rounding tie. */
 q36: t => { t = T(t); const msb = 48 + 3 * t, F = msb / 11, F2 = Math.round(F * 100) / 100, m = { ...E('Predict the F ratio, to 2 decimal places.', `Mean square between = ${n(2 * msb)} ÷ 2 = ${n(msb)} and mean square within = 132 ÷ 12 = 11, so F = ${n(msb)} ÷ 11 = ${to2(F)}. The critical value F(2, 12) is 3.89.`, [['F ratio', F2], ['Mean square between', msb], ['Mean square within', 11]]), tolerance: 0.005 };
  return m; },
 /* q37: n = 15, σ = 2.5 mm, s = 2.2 … 4.2 mm. χ² = 14s² ÷ 6.25 is never a rounding tie at 2 decimals. */
 q37: t => { t = T(t); const s10 = 32 + t, s2 = s10 * s10 / 100, x = 14 * s2 / 6.25, x2 = Math.round(x * 100) / 100;
  return { ...E('Predict the test statistic χ² = (n − 1)s² ÷ σ², to 2 decimal places.', `χ² = 14 × ${n(s10 / 10)}² ÷ 2.5² = 14 × ${n(s2)} ÷ 6.25 = ${to2(x)}. The right-hand 5% value for df 14 is 23.685.`, [['χ² (2 decimal places)', x2], ['Sample variance s²', s2], ['Degrees of freedom', 14]]), tolerance: 0.005 }; },
 /* q38: the 95% interval 46.25 to 50.95; the claim μ₀ = 48.6 + 0.4t never falls on a bound. */
 q38: t => { t = T(t); const m = Math.round((48.6 + 0.4 * t) * 10) / 10, d = m < 46.25 || m > 50.95 ? 1 : 0;
  return E('Predict the decision: 1 if the test rejects the claim, 0 if not.', `${n(m)} lies ${d ? 'outside' : 'inside'} the interval from 46.25 to 50.95, so the two-tailed test at α = 0.05 ${d ? 'rejects' : 'does not reject'} it.`, [['1 reject, 0 do not reject', d], ['Lower bound', 46.25], ['Upper bound', 50.95]]); },
 /* q39: a test of independence on a table of 2 to 4 rows and 2 to 5 columns. */
 q39: t => { t = T(t); const r = 2 + (t + 10) % 3, c = 2 + Math.floor((t + 10) / 3) % 4, df = (r - 1) * (c - 1);
  return E('Predict the degrees of freedom of the test.', `A χ² test of independence has (rows − 1) × (columns − 1) = (${n(r)} − 1) × (${n(c)} − 1) = ${n(df)} degrees of freedom.`, [['Degrees of freedom', df], ['Rows', r], ['Columns', c]]); },
 /* q40: μ₀ = 120, σ = 10, n = 25 (standard error 2), x̄ = 116.3 + 0.1t; z = (t − 37) ÷ 20 is exact to 2 decimals. */
 q40: t => { t = T(t); const d10 = t - 37, xb = (1200 + d10) / 10, z = d10 / 20;
  return E('Predict the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n).', `The standard error is 10 ÷ √25 = 2, so z = (${n(xb)} − 120) ÷ 2 = ${n(d10 / 10)} ÷ 2 = ${n(z)}.`, [['z', z], ['x̄ − μ₀', d10 / 10]]); },
});
})();
