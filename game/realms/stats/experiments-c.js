/* Data and inference concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Normal table: area to the left of z to 4 decimal places (Simpson's rule on the bell curve); r2 rounds to 2 places. */
const phi4 = z => { const m = Math.abs(z), N = 2000, h = m / N, f = x => Math.exp(-x * x / 2); let s = f(0) + f(m);
 for (let i = 1; i < N; i++) s += f(i * h) * (i % 2 ? 4 : 2);
 const half = s * h / 3 / Math.sqrt(2 * Math.PI); return Math.round((z < 0 ? 0.5 - half : 0.5 + half) * 1e4) / 1e4; };
const r2 = x => Math.sign(x) * Math.round(Math.abs(x) * 100) / 100, f4 = x => x.toFixed(4);
/* q30: five points with x = 1 to 5 and y = 60 + t·x + a fixed scatter. */
const Q30 = t => { const x = [1, 2, 3, 4, 5], y = x.map((v, i) => 60 + t * v + [3, 5, 4, 7, 6][i]), s = f => x.reduce((a, v, i) => a + f(v, y[i]), 0);
 const Sx = s(v => v), Sy = s((v, w) => w), top = 5 * s((v, w) => v * w) - Sx * Sy, A = 5 * s(v => v * v) - Sx * Sx, B = 5 * s((v, w) => w * w) - Sy * Sy; return { x, y, top, A, B, r: top / Math.sqrt(A * B) }; };
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Two-tailed p-value for z from 1.00 to 3.00 in steps of 0.1. */
 q21: t => { t = T(t); const z = (100 + 10 * (t + 10)) / 100, a = phi4(z), r = Math.round((1 - a) * 1e4) / 1e4, p = Math.round(2 * r * 1e4) / 1e4;
  return { ...E('Predict the two-tailed p-value, to 4 decimal places.', `The area to the left of z = ${z.toFixed(2)} is ${f4(a)}, so the area to the right is 1 − ${f4(a)} = ${n(r)}. Two-tailed: p-value = 2 × ${n(r)} = ${n(p)}.`, [['p-value', p], ['Area to the left of z', a], ['Area to the right of z', r]]), tolerance: 0.00005 }; },
 /* p₀ = 0.5, n = 100 and 50 + t packets sprout: z = t ÷ 5. */
 q22: t => { t = T(t); const x = 50 + t, ph = x / 100, z = t / 5;
  return E('Predict the test statistic z.', `p̂ = ${x} ÷ 100 = ${n(ph)}. The standard error is √(0.5 × 0.5 ÷ 100) = 0.05, so z = (${n(ph)} − 0.5) ÷ 0.05 = ${n(ph - 0.5)} ÷ 0.05 = ${n(z)}.`, [['z', z], ['Sample proportion p̂', ph], ['Standard error', 0.05]]); },
 /* μ₀ = 50, σ = 5, n = 25 and x̄ = 50 + 0.3t: z = 0.3t. */
 q23: t => { t = T(t); const xb = Math.round((50 + 0.3 * t) * 10) / 10, z = Math.round((xb - 50) * 10) / 10;
  return E('Predict the test statistic z.', `The standard error is σ ÷ √n = 5 ÷ 5 = 1, so z = (${n(xb)} − 50) ÷ 1 = ${n(z)}.`, [['z', z], ['Sample mean x̄', xb], ['Standard error', 1]]); },
 /* s₁ = 8 and s₂ = 6 on 25 plots each, so SE = √(2.56 + 1.44) = 2; x̄₁ = 40 + t and x̄₂ = 40. */
 q24: t => { t = T(t); const x1 = 40 + t, tt = t / 2;
  return E('Predict the two-sample t statistic.', `s₁² ÷ n₁ = 64 ÷ 25 = 2.56 and s₂² ÷ n₂ = 36 ÷ 25 = 1.44, so SE = √(2.56 + 1.44) = √4 = 2. t = (${n(x1)} − 40) ÷ 2 = ${n(tt)}.`, [['t', tt], ['Difference of means', t], ['Standard error', 2]]); },
 /* 60 + t of 100 new seeds and 50 of 100 old seeds sprouted. */
 q25: t => { t = T(t); const x1 = 60 + t, pc = (x1 + 50) / 200;
  return E('Predict the pooled proportion p_c.', `p_c = (${x1} + 50) ÷ (100 + 100) = ${x1 + 50} ÷ 200 = ${n(pc)}.`, [['Pooled proportion', pc], ['p̂₁', x1 / 100], ['p̂₂', 0.5]]); },
 /* Five differences t − 2, t, t + 2, t − 1, t + 1: mean t, s_d = √2.5, so t-statistic = t × √2, to 2 places. */
 q26: t => { t = T(t); const d = [-2, 0, 2, -1, 1].map(v => v + t), sd = Math.sqrt(2.5), st = r2(t / (sd / Math.sqrt(5)));
  return { ...E('Predict the matched-pairs t statistic, to 2 decimal places.', `The differences ${d.map(n).join(', ')} have mean ${n(t)}. Their squared distances from the mean add to 4 + 0 + 4 + 1 + 1 = 10, so s_d = √(10 ÷ 4) = 1.5811 and s_d ÷ √5 = 0.7071. t = ${n(t)} ÷ 0.7071, which is ${n(st)} to 2 decimal places.`, [['t', st], ['Mean difference', t], ['s_d', 1.5811]]), tolerance: 0.005 }; },
 /* Claimed 40%, 40%, 20% of 100; observed 40 + t, 40 − t, 20: χ² = t² ÷ 20. */
 q27: t => { t = T(t); const o1 = 40 + t, o2 = 40 - t, x = t * t / 20;
  return E('Predict χ² for the three categories.', `The expected counts are 40, 40 and 20. χ² = (${o1} − 40)² ÷ 40 + (${o2} − 40)² ÷ 40 + (20 − 20)² ÷ 20 = ${n(t * t / 40)} + ${n(t * t / 40)} + 0 = ${n(x)}.`, [['χ²', x], ['Expected large', 40], ['Observed large', o1]]); },
 /* 100 plots: 40 + t new-seed plots, 50 good harvests. */
 q28: t => { t = T(t); const R = 40 + t, e = R * 50 / 100;
  return E('Predict the expected count for new seed with a good harvest.', `Row total × column total ÷ grand total = ${R} × 50 ÷ 100 = ${n(R * 50)} ÷ 100 = ${n(e)}.`, [['Expected count', e], ['Row total', R], ['df', 2]]); },
 /* A 2 × 2 table of 100 plots, every expected count 25, observed 25 ± t: χ² = 4t² ÷ 25. */
 q29: t => { t = T(t); const x = 4 * t * t / 25;
  return E('Predict χ² for the test of independence.', `Every expected count is 50 × 50 ÷ 100 = 25, and every cell is ${n(Math.abs(t))} away from it. χ² = 4 × ${n(t * t)} ÷ 25 = ${n(x)}.`, [['χ²', x], ['Expected count', 25], ['Gap in each cell', Math.abs(t)]]); },
 /* Five points (x, 60 + t·x + scatter): r to 2 places. */
 q30: t => { t = T(t); const q = Q30(t), r = r2(q.r);
  return { ...E('Predict the correlation coefficient r, to 2 decimal places.', `For the points ${q.x.map((v, i) => `(${v}, ${q.y[i]})`).join(', ')}: nΣxy − ΣxΣy = ${n(q.top)}, nΣx² − (Σx)² = ${q.A} and nΣy² − (Σy)² = ${q.B}, so r = ${n(q.top)} ÷ √(${q.A} × ${q.B}), which is ${n(r)} to 2 decimal places.`, [['r', r], ['nΣxy − ΣxΣy', q.top], ['nΣx² − (Σx)²', q.A]]), tolerance: 0.005 }; },
});
})();
