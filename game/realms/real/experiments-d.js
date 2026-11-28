/* Real analysis concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* x² on [1, 3]: U − L = 16 ÷ n for n equal pieces; ε = m ÷ 100 for m from 1 to 21. */
 q31: t => { t = T(t); const m = t + 11, eps = m / 100, N = Math.floor(1600 / m) + 1;
  return E('Predict the smallest number n of equal pieces with U − L < ε.', `U − L = (9 − 1) × 2 ÷ n = 16 ÷ n. 16 ÷ n < ${n(eps)} means n > ${n(1600 / m)}, so the smallest n is ${n(N)}.`, [['Smallest n', N], ['ε', eps], ['U − L for 16 pieces', 1]]); },
 /* f(t) = (t − 4)² + 2 on [3, 3 + j], j from 1 to 6: upper bound M × j. */
 q32: t => { t = T(t); const j = 1 + (t + 10) % 6, e = 3 + j, fe = (e - 4) * (e - 4) + 2, M = Math.max(3, fe);
  return E('Predict the upper bound M × (length) for the integral of f over the piece.', `f(3) = 3 and f(${n(e)}) = ${n(fe)}, so M = ${n(M)}. The piece has length ${n(j)}, so the upper bound is ${n(M)} × ${n(j)} = ${n(M * j)}.`, [['Upper bound', M * j], ['M', M], ['Length', j]]); },
 /* Rate 4 before t = 3, 7 after: F(x) for x from 0 to 8. */
 q33: t => { t = T(t); const x = (t + 10) % 9, F = x <= 3 ? 4 * x : 12 + 7 * (x - 3);
  return E('Predict the running total F(x).', x <= 3 ? `Before the switch the rate is 4, so F(${n(x)}) = 4 × ${n(x)} = ${n(F)}.` : `F(3) = 12, and after the switch the rate is 7, so F(${n(x)}) = 12 + 7 × ${n(x - 3)} = ${n(F)}.`, [['F(x)', F], ['x', x]]); },
 /* Sum of 1 ÷ n³ with N first terms, N from 2 to 8: lower bound to 3 decimal places. */
 q34: t => { t = T(t); const N = 2 + (t + 10) % 7; let s = 0; for (let k = 1; k <= N; k++) s += 1 / (k * k * k);
  const I = 1 / (2 * (N + 1) * (N + 1)), lo = Math.round((s + I) * 1000) / 1000;
  return E('Predict the lower bound for the sum, to 3 decimal places.', `The first ${n(N)} terms add to ${n(Math.round(s * 10000) / 10000)} (4 decimal places), and the integral of 1 ÷ x³ from ${n(N + 1)} to infinity is 1 ÷ (2 × ${n((N + 1) * (N + 1))}) = ${n(Math.round(I * 10000) / 10000)}. The lower bound is ${n(lo)}.`, [['Lower bound', lo], ['Terms added', N]]); },
 /* fₙ(x) = (2 + 8nx) ÷ (1 + nx), ε = 0.1: gap 6 ÷ (1 + nx) < 0.1 needs n > 59 ÷ x, for x = j ÷ 2, j from 1 to 10. */
 q35: t => { t = T(t); const j = 1 + (t + 10) % 10, x = j / 2, N = Math.floor(118 / j) + 1;
  return E('Predict the smallest N with |fₙ(x) − f(x)| < 0.1 for every n ≥ N.', `The gap is 6 ÷ (1 + ${n(x)}n), below 0.1 when 1 + ${n(x)}n > 60, that is n > 59 ÷ ${n(x)} = ${n(59 / x)}. So N = ${n(N)}.`, [['N', N], ['Limit f(x)', 8]]); },
 /* fₙ(x) = 3x ÷ (1 + nx²): norm 3 ÷ (2√n) < ε = e ÷ 100 needs n > 22500 ÷ e², e from 5 to 25. */
 q36: t => { t = T(t); const e = 15 + t, N = Math.floor(22500 / (e * e)) + 1;
  return E('Predict the smallest N with ‖fₙ − 0‖_u < ε.', `‖fₙ − 0‖_u = 3 ÷ (2√n). It is below ${n(e / 100)} when n > 22500 ÷ ${n(e * e)} = ${n(Math.round(22500 / (e * e) * 10000) / 10000)}, so N = ${n(N)}.`, [['N', N], ['ε', e / 100]]); },
 /* g(x) = 4 + the sum of m cos(2πkx) ÷ 2ᵏ for m from 2 to 12: Mₖ = m ÷ 2ᵏ, total m, tail after 2 terms m ÷ 4. */
 q37: t => { t = T(t); const m = 2 + (t + 10) % 11, tail = m / 4;
  return E('Predict the uniform error bound after the first 2 terms.', `Mₖ = ${n(m)} ÷ 2ᵏ, with total ${n(m)}. After 2 terms the tail is ${n(m)} ÷ 4 = ${n(tail)}.`, [['Error bound after 2 terms', tail], ['Sum of the Mₖ', m]]); },
 /* Sum of 6xᵏ ÷ bᵏ on [−2, 2]: bound 6b ÷ (b − 2). */
 q38: t => { t = T(t); const b = [3, 4, 5, 6, 7, 8, 12][(t + 10) % 7], S = 6 * b / (b - 2);
  return E('Predict the M-test bound on [−2, 2].', `The radius is ${n(b)}. On [−2, 2], Mₖ = 6 × (2/${n(b)})ᵏ, which sums to 6 ÷ (1 − 2/${n(b)}) = ${n(S)}.`, [['M-test bound', S], ['Radius', b]]); },
 /* Taxicab distance from (2, −1) to (x, 3), x from −10 to 10. */
 q39: t => { t = T(t); const d = Math.abs(t - 2) + 4;
  return E('Predict the taxicab distance d(P, Q).', `The gaps are |2 − ${par(t)}| = ${n(Math.abs(t - 2))} and |−1 − 3| = 4, so d(P, Q) = ${n(Math.abs(t - 2))} + 4 = ${n(d)}.`, [['Taxicab distance', d], ['First gap', Math.abs(t - 2)]]); },
 /* Sum of 5(−1)ᵏxᵏ ÷ 6ᵏ on [−r, r], r from 1 to 5: bound 30 ÷ (6 − r). */
 q40: t => { t = T(t); const r = 1 + (t + 10) % 5, S = 30 / (6 - r);
  return E('Predict the M-test bound on [−r, r].', `On [−${n(r)}, ${n(r)}], Mₖ = 5 × (${n(r)}/6)ᵏ, which sums to 5 ÷ (1 − ${n(r)}/6) = 30 ÷ ${n(6 - r)} = ${n(S)}.`, [['M-test bound', S], ['r', r]]); },
});
})();
