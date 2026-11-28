/* Data and inference concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* 50 days of check-ups: counts 0, 1, 2, 3 on 5, 10, c and 35 − c days, c from 5 to 25. */
 q01: t => { t = T(t); const c = t + 15, cum = (15 + c) / 50;
  return E('Predict the cumulative relative frequency of the days with 2 check-ups or fewer, as an exact decimal.', `The frequencies add up to 5 + 10 + ${n(c)} + ${n(35 - c)} = 50 days. The days with 2 or fewer number 5 + 10 + ${n(c)} = ${n(15 + c)}, so the cumulative relative frequency is ${n(15 + c)} ÷ 50 = ${n(cum)}.`, [['Cumulative relative frequency', cum], ['Relative frequency of 2', c / 50], ['Days with 2 or fewer', 15 + c]]); },
 /* Readings 12, 15, 18, 21 and 24 + t: the mean is 18 + t ÷ 5. */
 q02: t => { t = T(t); const x = 24 + t, S = 90 + t;
  return E('Predict the sample mean x̄ of the five readings.', `Σx = 12 + 15 + 18 + 21 + ${n(x)} = ${n(S)}, and x̄ = ${n(S)} ÷ 5 = ${n(S / 5)}.`, [['Sample mean', S / 5], ['Σx', S]]); },
 /* Readings 8, 11, 14, 17, 20 and x = 15 + t: the median moves with x while x is in the middle. */
 q03: t => { t = T(t); const x = 15 + t, s = [8, 11, 14, 17, 20, x].sort((a, b) => a - b), M = (s[2] + s[3]) / 2;
  return E('Predict the median of the six readings.', `In order: ${s.map(n).join(', ')}. Six readings have two middle ones, ${n(s[2])} and ${n(s[3])}, so the median is (${n(s[2])} + ${n(s[3])}) ÷ 2 = ${n(M)}.`, [['Median', M], ['Smallest reading', s[0]]]); },
 /* Crew sizes 2, 3, 4, 5 with frequencies 3, 5, f, 12 − f over 20 runs, f from 1 to 11: the mean is (81 − f) ÷ 20. */
 q04: t => { t = T(t); const f = 1 + (t + 10) % 11, total = 81 - f;
  return E('Predict the mean crew size per run, as an exact decimal.', `Totals: 2 × 3 = 6, 3 × 5 = 15, 4 × ${n(f)} = ${n(4 * f)}, 5 × ${n(12 - f)} = ${n(5 * (12 - f))}; together ${n(total)}. The runs number 3 + 5 + ${n(f)} + ${n(12 - f)} = 20, so the mean is ${n(total)} ÷ 20 = ${n(total / 20)}.`, [['Mean crew size', total / 20], ['Total crew', total], ['Runs', 20]]); },
 /* Sorted readings 5, 8, x, 14, 17, 21, 24, 30 with x from 8 to 14: Q1 = (8 + x) ÷ 2. */
 q05: t => { t = T(t); const x = 8 + (t + 10) % 7;
  return E('Predict the first quartile Q1 by the median-of-halves method.', `Eight readings: the lower half is 5, 8, ${n(x)}, 14, so Q1 = (8 + ${n(x)}) ÷ 2 = ${n((8 + x) / 2)}. The upper half 17, 21, 24, 30 gives Q3 = (21 + 24) ÷ 2 = 22.5.`, [['Q1', (8 + x) / 2], ['Q3', 22.5]]); },
 /* Q1 = 12 and Q3 = 12 + d, d from 2 to 22: the upper fence is 12 + 2.5d. */
 q06: t => { t = T(t); const d = t + 12, q3 = 12 + d, st = 1.5 * d;
  return E('Predict the upper fence Q3 + 1.5 × IQR.', `IQR = ${n(q3)} − 12 = ${n(d)}, and 1.5 × ${n(d)} = ${n(st)}. The upper fence is ${n(q3)} + ${n(st)} = ${n(q3 + st)}, and the lower fence is 12 − ${n(st)} = ${n(12 - st)}.`, [['Upper fence', q3 + st], ['IQR', d], ['Lower fence', 12 - st]]); },
 /* Readings 20 − k, 20, 20, 20, 20 + k with k from 1 to 8: the squared deviations add up to 2k², so s² = k² ÷ 2. */
 q07: t => { t = T(t); const k = 1 + (t + 10) % 8, SS = 2 * k * k;
  return E('Predict the sample variance s², as an exact decimal.', `x̄ = 20. The deviations are −${n(k)}, 0, 0, 0, ${n(k)}, and their squares add up to ${n(SS)}. Dividing by n − 1 = 4 gives s² = ${n(SS)} ÷ 4 = ${n(SS / 4)}.`, [['Sample variance', SS / 4], ['Sum of squared deviations', SS], ['Mean', 20]]); },
 /* x̄ = 50 and s = 4; the reading is 50 + t, so z = t ÷ 4. */
 q08: t => { t = T(t); const x = 50 + t;
  return E('Predict the z-score of the reading.', `z = (${n(x)} − 50) ÷ 4 = ${n(t)} ÷ 4 = ${n(t / 4)}.`, [['z-score', t / 4], ['Distance from the mean', t]]); },
 /* A list of 200 numbered 1 to 200, a systematic sample of 20 (step 10) from a start s of 1 to 10. */
 q09: t => { t = T(t); const s = 1 + (t + 10) % 10;
  return E('Predict the number of the third person chosen.', `The step is 200 ÷ 20 = 10. From the start ${n(s)} the picks are ${n(s)}, ${n(s + 10)}, ${n(s + 20)}, so the third is ${n(s + 20)}.`, [['Third pick', s + 20], ['Step', 10], ['Start', s]]); },
 /* σ = 24 and n = r² with r from the list, so the standard error 24 ÷ r is an exact decimal. */
 q10: t => { t = T(t); const r = [2, 3, 4, 5, 6, 8, 10, 12][(t + 10) % 8];
  return E('Predict the standard error σ ÷ √n of the sample mean, as an exact decimal.', `√${n(r * r)} = ${n(r)}, so the standard error is 24 ÷ ${n(r)} = ${n(24 / r)}.`, [['Standard error', 24 / r], ['√n', r]]); },
});
})();
