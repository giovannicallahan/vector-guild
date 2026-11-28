/* Real analysis concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. EPS is the ε list both files index with (t + 10) % 8. */
const EPS = [0.5, 0.25, 0.2, 0.1, 0.05, 0.04, 0.02, 0.01];
const tidy = x => Math.round(x * 1e9) / 1e9;
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* xₙ = (2n + 11) ÷ (n + 3): |xₙ − 2| = 5 ÷ (n + 3), so N = 5 ÷ ε − 2. */
 q11: t => { t = T(t); const e = EPS[(t + 10) % 8], K = Math.round(5 / e), N = K - 2;
  return E('Predict the smallest N with |xₙ − 2| < ε for every n ≥ N.', `|xₙ − 2| = 5 ÷ (n + 3), which is below ${n(e)} exactly when n + 3 > ${n(K)}, that is n > ${n(K - 3)}. The distance shrinks as n grows, so N = ${n(N)}.`, [['Smallest N', N], ['n + 3 must exceed', K]]); },
 /* xₙ = 4 + 6 ÷ n: gaps for m, n ≥ N stay below 6 ÷ N and come close to it, so N = 6 ÷ ε. */
 q12: t => { t = T(t); const e = EPS[(t + 10) % 8], N = Math.round(6 / e);
  return E('Predict the smallest N with |xₘ − xₙ| < ε for all m, n ≥ N.', `For m, n ≥ N the gap |6 ÷ m − 6 ÷ n| stays below 6 ÷ N and comes as close to it as we like, so N must satisfy 6 ÷ N ≤ ${n(e)}: N ≥ ${n(N)}.`, [['Smallest N', N], ['ε', e]]); },
 /* 64 + 32 + 16 + … sums to 128; the tail after N terms is 128 ÷ 2^N, N from 1 to 6. */
 q13: t => { t = T(t); const N = 1 + (t + 10) % 6, tail = 128 / Math.pow(2, N);
  return E('Predict the tail: the sum of every term after the first N.', `The series is geometric with first term 64 and ratio 1 ÷ 2, so it sums to 64 ÷ (1 − 1 ÷ 2) = 128. The first ${n(N)} terms add up to ${n(128 - tail)}, so the tail is 128 − ${n(128 - tail)} = ${n(tail)}.`, [['Tail after N terms', tail], ['Partial sum', 128 - tail]]); },
 /* aₙ = (−1)ⁿ⁺¹ × 60 ÷ n: the partial sum of the first N terms, N from 1 to 6 (every term is whole). */
 q14: t => { t = T(t); const N = 1 + (t + 10) % 6, terms = []; for (let i = 1; i <= N; i++) terms.push((i % 2 ? 1 : -1) * 60 / i); const s = terms.reduce((a, b) => a + b, 0);
  return E('Predict the partial sum of the first N terms.', `The terms are ${terms.map(n).join(', ')}, which add up to ${n(s)}. The sizes 60 ÷ n form a multiple of the harmonic series, so this series converges only conditionally.`, [['Partial sum', s], ['Last term added', terms[N - 1]]]); },
 /* aₙ = 60 ÷ (qⁿ + 1) < 60 ÷ qⁿ, q from 2 to 6: the comparison bound is 60 ÷ (q − 1). */
 q15: t => { t = T(t); const q = 2 + (t + 10) % 5, B = 60 / (q - 1);
  return E('Predict the upper bound on the sum from the comparison series Σ 60 ÷ qⁿ.', `Since qⁿ + 1 > qⁿ, each term is below 60 ÷ ${n(q)}ⁿ. That geometric series has first term ${n(60 / q)} and ratio 1 ÷ ${n(q)}, so it sums to 60 ÷ ${n(q - 1)} = ${n(B)}.`, [['Comparison bound', B], ['First comparison term', 60 / q]]); },
 /* c − c ÷ 2 + c ÷ 3 − …, c from 1 to 9: the bound c ÷ (N + 1) < 0.01 needs N = 100c. */
 q16: t => { t = T(t); const c = 1 + (t + 10) % 9, N = 100 * c;
  return E('Predict the smallest N for which the alternating-series bound guarantees an error below 0.01.', `|S − s_N| ≤ ${n(c)} ÷ (N + 1), and ${n(c)} ÷ (N + 1) < 0.01 needs N + 1 > ${n(N)}, so N = ${n(N)}.`, [['Smallest N', N], ['c', c]]); },
 /* cₙ = (−1)ⁿ⁺¹ × 60 ÷ (n + 1): the error bound after N terms is 60 ÷ (N + 2), for N with N + 2 dividing 60. */
 q17: t => { t = T(t); const N = [1, 2, 3, 4, 8, 10, 13, 18, 28][(t + 10) % 9], b = 60 / (N + 2);
  return E('Predict the guaranteed bound on the error after N terms.', `The sizes 60 ÷ (n + 1) decrease to 0, so the error after ${n(N)} terms is at most the next term’s size: 60 ÷ (${n(N + 1)} + 1) = ${n(b)}.`, [['Error bound', b], ['Index of the next term', N + 1]]); },
 /* f(x) = 4x − 3 near x = 2 with ε = 0.1s, s from 1 to 10: δ = ε ÷ 4. */
 q18: t => { t = T(t); const e = tidy(0.1 * (1 + (t + 10) % 10)), d = tidy(e / 4);
  return E('Predict the largest δ that keeps |f(x) − 5| below ε.', `|f(x) − 5| = 4 × |x − 2|, which is below ${n(e)} exactly when |x − 2| < ${n(e)} ÷ 4 = ${n(d)}.`, [['Largest δ', d], ['ε', e]]); },
 /* f(x) = 2x + 1 with xₙ = 3 + 1 ÷ n: |f(xₙ) − 7| = 2 ÷ n, below ε from n = 2 ÷ ε + 1 on. */
 q19: t => { t = T(t); const e = EPS[(t + 10) % 8], K = Math.round(2 / e), d = tidy(e / 2);
  return E('Predict the smallest n from which |f(xₙ) − f(3)| stays below ε.', `|f(xₙ) − 7| = 2 × (1 ÷ n) = 2 ÷ n, which is below ${n(e)} exactly when n > ${n(K)}, so from n = ${n(K + 1)} on. The largest δ is ${n(e)} ÷ 2 = ${n(d)}.`, [['Smallest n', K + 1], ['Largest δ', d]]); },
 /* f(x) = 3x − 1 for x < 2 and x² + q for x > 2, q = t: the jump is (4 + q) − 5 = q − 1. */
 q20: t => { t = T(t); const q = t, Rt = 4 + q, piece = q === 0 ? 'x²' : `x² ${q < 0 ? '−' : '+'} ${n(Math.abs(q))}`;
  return E('Predict the right-hand limit minus the left-hand limit at x = 2.', `From the left, 3x − 1 tends to 5. From the right, ${piece} tends to ${n(Rt)}. The difference is ${n(Rt)} − 5 = ${n(Rt - 5)}${Rt === 5 ? ', so there is no jump' : ''}.`, [['Right minus left limit', Rt - 5], ['Right-hand limit', Rt], ['Left-hand limit', 5]]); },
});
})();
