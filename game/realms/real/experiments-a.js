/* Real analysis concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* S = {c − 6/n} with c from 2 to 22: sup c, never attained. */
 q01: t => { t = T(t); const c = t + 12;
  return E('Predict sup S, the least upper bound of the set.', `The members ${n(c - 6)}, ${n(c - 3)}, ${n(c - 1.5)}, … (n = 1, 2, 4) rise towards ${n(c)}, and every one is below it because 6/n is positive. Any number below ${n(c)} is passed once 6/n is small enough, so sup S = ${n(c)}.`, [['sup S', c], ['Member at n = 1', c - 6], ['Member at n = 2', c - 3]]); },
 /* S = {k − 4/n} with k from 1 to 21: the members rise, so inf S = k − 4 is attained at n = 1. */
 q02: t => { t = T(t); const k = t + 11;
  return E('Predict inf S, the greatest lower bound of the set.', `The members ${n(k - 4)}, ${n(k - 2)}, ${n(k - 1)}, … (n = 1, 2, 4) rise as n grows, so the first, ${n(k - 4)}, is below all the others. So inf S = ${n(k - 4)}, attained at n = 1, while sup S = ${n(k)} is never reached.`, [['inf S', k - 4], ['sup S', k]]); },
 /* ε = k/100 with k from 2 to 20: the smallest n with 1/n < ε is the whole part of 100/k, plus 1. */
 q03: t => { t = T(t); const k = 2 + (t + 10) % 19, w = Math.floor(100 / k), N = w + 1, tie = 100 % k === 0, q = n(100 / k) + ((100 * 10000) % k === 0 ? '' : '…');
  return E('Predict the smallest n ∈ ℕ with 1/n < ε.', tie ? `1/n < ${n(k / 100)} means n > 1 ÷ ${n(k / 100)} = ${q}. At n = ${n(w)} the step equals ε rather than being smaller, so the smallest n is ${n(N)}.` : `1/n < ${n(k / 100)} means n > 1 ÷ ${n(k / 100)} = ${q}, and the next whole number is ${n(N)}.`, [['Smallest n', N], ['Whole part of 1 ÷ ε', w]]); },
 /* |e₁| ≤ 3 mm and |e₂| ≤ k mm, k from 2 to 22: the largest |e₁ + e₂| is 3 + k. */
 q04: t => { t = T(t); const k = t + 12;
  return E('Predict the largest possible value of |e₁ + e₂|, in millimetres.', `By the triangle inequality |e₁ + e₂| ≤ |e₁| + |e₂| ≤ 3 + ${n(k)} = ${n(3 + k)}, and e₁ = 3, e₂ = ${n(k)} reaches it.`, [['Largest |e₁ + e₂| (mm)', 3 + k], ['Bound on |e₁| (mm)', 3], ['Bound on |e₂| (mm)', k]]); },
 /* f(x) = (x − 2)² + 1 on (0, c) with c from 3 to 10: inf 1 at x = 2, sup the larger of f(0) = 5 and f(c). */
 q05: t => { t = T(t); const c = 3 + (t + 10) % 8, fc = (c - 2) * (c - 2) + 1, S = Math.max(5, fc);
  return E('Predict sup f over the open interval.', `At the ends f(0) = 5 and f(${n(c)}) = ${n(fc)}, approached but not taken. The square is 0 at x = 2, inside the interval, where f(2) = 1. So sup f = ${n(S)} and inf f = 1.`, [['sup f', S], ['inf f', 1], ['f at the right end', fc]]); },
 /* The pair (2, k), k from 1 to 9, in the diagonal listing of ℕ × ℕ: position (1 + … + k) + 2. */
 q06: t => { t = T(t); const k = 1 + (t + 10) % 9, s = k + 2, before = k * (k + 1) / 2;
  return E('Predict the position of the pair in the diagonal listing.', `(2, ${n(k)}) is on the diagonal with sum ${n(s)}. The diagonals before it hold 1 + … + ${n(k)} = ${n(before)} pairs, and it is the 2nd pair of its own diagonal, so its position is ${n(before + 2)}.`, [['Position', before + 2], ['Diagonal sum', s], ['Pairs before the diagonal', before]]); },
 /* xₙ = (3n + b) ÷ (n + 2), b from 7 to 27: |xₙ − 3| = (b − 6) ÷ (n + 2) < 0.1 from N = 10(b − 6) − 1 on. */
 q07: t => { t = T(t); const b = t + 17, D = b - 6, N = 10 * D - 1;
  return E('Predict the smallest N with |xₙ − 3| < 0.1 for every n ≥ N.', `xₙ − 3 = (3n + ${n(b)} − 3n − 6) ÷ (n + 2) = ${n(D)} ÷ (n + 2). This is below 0.1 when n + 2 > ${n(10 * D)}, that is n > ${n(10 * D - 2)}, so N = ${n(N)}.`, [['Smallest N', N], ['Limit', 3], ['Top of |xₙ − 3|', D]]); },
 /* x₁ = 0 and xₙ₊₁ = (xₙ + 3c) ÷ 4, c from 2 to 22: increasing, bounded above by c, limit c. */
 q08: t => { t = T(t); const c = t + 12;
  return E('Predict the limit of the sequence.', `x₂ = ${n(3 * c / 4)} and x₃ = ${n(15 * c / 16)}. The terms rise and stay below ${n(c)}, so they converge, and the limit L satisfies L = (L + ${n(3 * c)}) ÷ 4: 4L = L + ${n(3 * c)}, 3L = ${n(3 * c)}, L = ${n(c)}.`, [['Limit', c], ['x₂', 3 * c / 4], ['x₃', 15 * c / 16]]); },
 /* xₙ = 2 + k sin(n) ÷ n with k from 2 to 22 and ε = 0.1: the squeeze bound k ÷ n is below 0.1 from N = 10k + 1. */
 q09: t => { t = T(t); const k = t + 12;
  return E('Predict the smallest N at which the squeeze bound is below ε.', `−1 ≤ sin(n) ≤ 1 gives |xₙ − 2| ≤ ${n(k)} ÷ n. ${n(k)} ÷ n < 0.1 means n > ${n(10 * k)}; at n = ${n(10 * k)} the bound equals 0.1, so N = ${n(10 * k + 1)}.`, [['Smallest N', 10 * k + 1], ['Limit', 2]]); },
 /* xₙ = k(−1)ⁿ + 6 ÷ n with k from 2 to 22: limsup k, liminf −k. */
 q10: t => { t = T(t); const k = t + 12;
  return E('Predict limsup xₙ.', `Even n give ${n(k)} + 6 ÷ n, falling towards ${n(k)}; odd n give −${n(k)} + 6 ÷ n, falling towards −${n(k)}. The largest subsequence limit is ${n(k)}, so limsup xₙ = ${n(k)} and liminf xₙ = −${n(k)}.`, [['limsup', k], ['liminf', -k], ['x₂', k + 3]]); },
});
})();
