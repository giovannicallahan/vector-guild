/* Data and inference concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
const DEV11 = [-2, 2, -5, 4, 0, 1], LV = [90, 95, 99], ZV = { 90: 1.645, 95: 1.96, 99: 2.576 };
/* The 95% column of Student's t table, df 5 to 20. */
const TT95 = { 5: '2.571', 6: '2.447', 7: '2.365', 8: '2.306', 9: '2.262', 10: '2.228', 11: '2.201', 12: '2.179', 13: '2.160', 14: '2.145', 15: '2.131', 16: '2.120', 17: '2.110', 18: '2.101', 19: '2.093', 20: '2.086' };
/* q18 claims: [story, value, tail code, sign in H₀, sign in Hₐ, name]. */
const CL18 = [['oxygen canisters', 40, 1, '≥', '<', 'left-tailed'], ['bean sprouting time', 9, 2, '≤', '>', 'right-tailed'], ['bolt length', 85, 3, '=', '≠', 'two-tailed'],
 ['filter life', 350, 1, '≥', '<', 'left-tailed'], ['charging time', 75, 2, '≤', '>', 'right-tailed'], ['cable strength', 220, 3, '=', '≠', 'two-tailed']];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* q11: six depths 30 + t + (−2, +2, −5, +4, 0, +1); the mean is 30 + t and s stays √10. */
 q11: t => { t = T(t); const m = 30 + t, d = DEV11.map(v => m + v);
  return E('Predict the sample mean x̄ of the six depths, in centimetres.', `The six depths add up to ${n(6 * m)}, and ${n(6 * m)} ÷ 6 = ${n(m)}, so x̄ = ${n(m)} cm. Moving every reading by the same amount moves the mean too, but s stays √10 ≈ 3.16 cm.`, [['Sample mean x̄ (cm)', m], ['Sum of the depths (cm)', 6 * m], ['Smallest depth (cm)', Math.min(...d)]]); },
 /* q12: standard error 1 to 7 g/kg and a level that cycles 90%, 95%, 99%: the margin z* × SE has at most 3 decimals. */
 q12: t => { t = T(t); const i = t + 10, L = LV[i % 3], se = 1 + Math.floor(i / 3), z = ZV[L], m = Math.round(z * se * 1000) / 1000;
  return E('Predict the margin of error z* × σ ÷ √n, in g/kg.', `For ${L}% confidence z* = ${n(z)}, so the margin of error is ${n(z)} × ${n(se)} = ${n(m)} g/kg.`, [['Margin of error (g/kg)', m], ['z*', z], ['Standard error (g/kg)', se]]); },
 /* q13: x̄ = 50 g/kg, standard error 1 to 8 g/kg, 95%: the lower bound 50 − 1.96 × SE. */
 q13: t => { t = T(t); const se = 1 + (t + 10) % 8, m = Math.round(196 * se) / 100, lo = Math.round(5000 - 196 * se) / 100;
  return E('Predict the lower bound of the 95% confidence interval, in g/kg.', `The margin of error is 1.96 × ${n(se)} = ${n(m)} g/kg, so the lower bound is 50 − ${n(m)} = ${n(lo)} g/kg.`, [['Lower bound (g/kg)', lo], ['Margin of error (g/kg)', m], ['Upper bound (g/kg)', Math.round(5000 + 196 * se) / 100]]); },
 /* q14: n from 6 to 21, 95% column of the t table. */
 q14: t => { t = T(t); const N = 6 + (t + 10) % 16, df = N - 1, ts = Number(TT95[df]);
  return E('Predict the critical value t* for 95% confidence.', `df = ${n(N)} − 1 = ${n(df)}, and the row df ${df} reads ${TT95[df]} in the 95% column, so t* = ${TT95[df]}.`, [['t*', ts], ['Degrees of freedom', df]]); },
 /* q15: 16 lumps (df 15, t* = 2.131 at 95%) and s = 4k: the margin 2.131 × s ÷ 4 = 2.131k. */
 q15: t => { t = T(t); const k = 1 + (t + 10) % 7, s = 4 * k, m = Math.round(2131 * k) / 1000;
  return E('Predict the margin of error t* × s ÷ √n, in g/kg.', `df = 15, so t* = 2.131. s ÷ √16 = ${n(s)} ÷ 4 = ${n(k)}, and the margin of error is 2.131 × ${n(k)} = ${n(m)} g/kg.`, [['Margin of error (g/kg)', m], ['s ÷ √n (g/kg)', k], ['t*', 2.131]]); },
 /* q16: x = 50 + 2t veins in 100 cores, 95%: the margin is rounded to 3 decimals, so the model sets its tolerance. */
 q16: t => { t = T(t); const x = 50 + 2 * t, p = x / 100, se = Math.sqrt(p * (1 - p) / 100), m = Math.round(1.96 * se * 1000) / 1000;
  return { ...E('Predict the margin of error z* × √(p̂(1 − p̂) ÷ n) for 95% confidence, to 3 decimal places.', `p̂ = ${n(x)} ÷ 100 = ${n(p)}, the standard error is √(${n(p)} × ${n(1 - p)} ÷ 100) ≈ ${n(Math.round(se * 10000) / 10000)}, and 1.96 times that is ${n(m)} to 3 decimal places.`, [['Margin of error', m], ['p̂', p]]), tolerance: 0.0005 }; },
 /* q17: the story cycles through the three intervals. */
 q17: t => { t = T(t); const k = 1 + (t + 10) % 3;
  return E('Predict the number of the right interval: 1 z interval, 2 t interval, 3 interval for a proportion.', k === 1 ? 'σ is known from the records, so the z interval fits: number 1.' : k === 2 ? 'Only s from the sample is known, so the t interval fits: number 2.' : 'The data are a count of yes-or-no results, so the interval for a proportion fits: number 3.', [['Interval number', k], ['Sample size', [36, 10, 200][k - 1]]]); },
 /* q18: the claim cycles through six suppliers; codes 1 left, 2 right, 3 two-tailed. */
 q18: t => { t = T(t); const c = CL18[(t + 10) % 6];
  return E('Predict the tail code of the test: 1 left-tailed, 2 right-tailed, 3 two-tailed.', `H₀: μ ${c[3]} ${n(c[1])} and Hₐ: μ ${c[4]} ${n(c[1])}, so the test is ${c[5]}: code ${c[2]}.`, [['Tail code', c[2]], ['Value in H₀', c[1]]]); },
 /* q19: β from 0.10 to 0.30. */
 q19: t => { t = T(t); const B = 20 + t, pw = (100 - B) / 100;
  return E('Predict the power of the test.', `Power = 1 − β = 1 − ${n(B / 100)} = ${n(pw)}.`, [['Power', pw], ['β', B / 100]]); },
 /* q20: H₀: μ = 500 g, σ = 12 g, n = 36 (standard error 2 g), x̄ = 496 + 0.6 × (t + 10) g. */
 q20: t => { t = T(t); const i = t + 10, d = Math.round(6 * i - 40) / 10, xb = Math.round(5000 + 10 * d) / 10, z = Math.round(5 * d * 10) / 100;
  return E('Predict the test statistic z.', `The standard error is 12 ÷ √36 = 2 g. x̄ − μ₀ = ${n(xb)} − 500 = ${n(d)} g, so z = ${n(d)} ÷ 2 = ${n(z)}.`, [['Test statistic z', z], ['x̄ − μ₀ (g)', d]]); },
});
})();
