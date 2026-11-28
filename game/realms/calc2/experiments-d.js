/* Calculus 2: accumulation concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Σ 1 ÷ n²: the tail after N terms is below the integral from N to ∞, which is 1 ÷ N (N chosen so it ends within 3 decimals). */
 q31: t => { t = T(t); const N = [2, 4, 5, 8, 10, 20, 25, 40, 50, 100][(t + 10) % 10];
  return E('Predict the integral bound on the tail of Σ 1 ÷ n² after the first N terms.', `The tail after ${n(N)} terms is less than the integral of 1 ÷ x² from ${n(N)} to ∞: [−1 ÷ x] from ${n(N)} to ∞ = 0 + 1 ÷ ${n(N)} = ${n(1 / N)}.`, [['Tail bound', 1 / N], ['Terms added', N], ['Integral from 1 to ∞', 1]]); },
 /* (An + 1) ÷ (2n³ + 5) against 1 ÷ n²: the limit is A ÷ 2, and the series converges. */
 q32: t => { t = T(t); const A = 2 + (t + 10) % 10;
  return E('Predict the limit of aₙ ÷ bₙ as n → ∞.', `aₙ ÷ bₙ = (${n(A)}n³ + n²) ÷ (2n³ + 5). Dividing the top and the bottom by n³ gives (${n(A)} + 1 ÷ n) ÷ (2 + 5 ÷ n³), which approaches ${n(A)} ÷ 2 = ${n(A / 2)}. It is positive and finite, and Σ 1 ÷ n² converges, so Σ aₙ converges.`, [['Limit of aₙ ÷ bₙ', A / 2], ['Converges (1 or 0)', 1]]); },
 /* 1 − 1/4 + 1/9 − …: the smallest N with 1 ÷ (N + 1)² below 1 ÷ M. */
 q33: t => { t = T(t); const M = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000][(t + 10) % 10]; let m = 1; while (m * m <= M) m++;
  return E(`Predict the smallest number of terms N for which the alternating series bound is itself below ${n(1 / M)}.`, `The error after N terms is less than 1 ÷ (N + 1)², which is below ${n(1 / M)} when (N + 1)² > ${n(M)}. ${n(m - 1)}² = ${n((m - 1) * (m - 1))} is not enough and ${n(m)}² = ${n(m * m)} is, so N + 1 = ${n(m)} and N = ${n(m - 1)}.`, [['Terms needed N', m - 1], ['N + 1', m]]); },
 /* n × aⁿ ÷ 4ⁿ: the ratio test gives L = a ÷ 4 (a is never 4). */
 q34: t => { t = T(t); const a = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12][(t + 10) % 10], L = a / 4;
  return E('Predict the limit L of aₙ₊₁ ÷ aₙ as n → ∞.', `aₙ₊₁ ÷ aₙ = ((n + 1) ÷ n) × ${n(a)} ÷ 4, and (n + 1) ÷ n approaches 1, so L = ${n(a)} ÷ 4 = ${n(L)}. ${L < 1 ? 'L < 1, so the series converges.' : 'L > 1, so the series diverges.'}`, [['L', L], ['Converges (1 or 0)', L < 1 ? 1 : 0]]); },
 /* Σ (x − c)ⁿ ÷ (n × Rⁿ): centre c, radius R; the target is the right end c + R. */
 q35: t => { t = T(t); const c = -5 + (t + 10) % 11, R = 2 + (t + 10) % 3, xc = c === 0 ? 'x' : `(x ${c < 0 ? '+' : '−'} ${n(Math.abs(c))})`;
  return E('Predict the right end of the interval of convergence.', `The series is centred at ${n(c)}. The ratio test gives the limit |${xc.replace(/[()]/g, '')}| ÷ ${n(R)}, which is below 1 when x is within ${n(R)} of the centre, so the radius is ${n(R)} and the interval runs from ${n(c - R)} to ${n(c + R)}.`, [['Right end', c + R], ['Centre', c], ['Radius', R]]); },
 /* P(x) = (x − 1) − (x − 1)² ÷ 2, the degree-2 Taylor polynomial of ln x about 1, at x = 1 + h. */
 q36: t => { t = T(t); const h = (1 + (t + 10) % 10) / 10, P = Math.round((h - h * h / 2) * 1e6) / 1e6;
  return E('Predict the value of the Taylor polynomial at that point.', `x − 1 = ${n(h)}, so P = ${n(h)} − ${n(h * h)} ÷ 2 = ${n(h)} − ${n(h * h / 2)} = ${n(P)}. For comparison, ln ${n(1 + h)} ≈ ${n(Math.log(1 + h))}.`, [['P(x)', P], ['x − 1', h]]); },
 /* cos(kx) = 1 − (kx)²/2! + …: the coefficient of x² is −k² ÷ 2. */
 q37: t => { t = T(t); const k = 1 + (t + 10) % 10, c = -k * k / 2;
  return E('Predict the coefficient of x² in the Maclaurin series.', `cos u = 1 − u²/2! + u⁴/4! − …. With u = ${k === 1 ? 'x' : `${n(k)}x`}, the u² term is −(${k === 1 ? 'x' : `${n(k)}x`})² ÷ 2 = −${n(k * k)}x² ÷ 2, so the coefficient is ${n(c)}.`, [['Coefficient of x²', c], ['k²', k * k]]); },
 /* cos x at x0: the smallest degree n with x0ⁿ⁺¹ ÷ (n + 1)! below 0.001. */
 q38: t => { t = T(t); const x = [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 1.5, 2, 3][(t + 10) % 10]; let d = 0; const b = k => Math.pow(x, k + 1) / [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600][k + 1];
  while (b(d) >= 0.001) d++;
  return E('Predict the smallest degree n whose Taylor remainder bound is below 0.001.', `With M = 1 the bound is ${n(x)}ⁿ⁺¹ ÷ (n + 1)!. For n = ${n(d)} it is ${b(d) >= 0.0001 ? `about ${n(b(d))}` : 'less than 0.0001'}, below 0.001; ${d > 0 ? `for n = ${n(d - 1)} it is about ${n(b(d - 1))}, which is not.` : 'no lower degree is needed.'}`, [['Smallest degree n', d], ['x', x]]); },
 /* ∫ from 0 to b of e^(−x²) from the first two terms, b − b³ ÷ 3, with b = 0.3m (exact within 3 decimals). */
 q39: t => { t = T(t); const b = 0.3 * (1 + (t + 10) % 4), c = Math.round(b * b * b / 3 * 1e6) / 1e6, est = Math.round((b - c) * 1e6) / 1e6;
  return E('Predict the two-term estimate of the integral.', `e^(−x²) = 1 − x² + …, so the integral from 0 to ${n(b)} is about ${n(b)} − ${n(b)}³ ÷ 3 = ${n(b)} − ${n(c)} = ${n(est)}.`, [['Estimate', est], ['b³ ÷ 3', c]]); },
 /* x = 3t², y = t³ − 3t: speed 3(t² + 1), length from 0 to T is T³ + 3T. */
 q40: t => { t = T(t); const e = 1 + (t + 10) % 6, L = e * e * e + 3 * e;
  return E('Predict the length of the path in metres.', `dx/dt = 6t and dy/dt = 3t² − 3, so the speed is √(36t² + (3t² − 3)²) = 3(t² + 1). The length is [t³ + 3t] from 0 to ${n(e)} = ${n(e * e * e)} + ${n(3 * e)} = ${n(L)} metres.`, [['Length (m)', L], ['Speed at the end (m/s)', 3 * (e * e + 1)]]); },
});
})();
