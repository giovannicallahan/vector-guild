/* Differential equations concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* m = 1 kg springs from the q21 table: c = 2j, k = p² + 2j²; the practical resonance frequency is p. */
 q21: t => { t = T(t); const P = [[3, 4], [4, 3], [6, 8], [8, 6], [12, 5]][(t + 10) % 5], p = P[0], j = P[1], c = 2 * j, k = p * p + 2 * j * j;
  return E('Predict the practical resonance frequency, the forcing ω that makes the steady amplitude largest, in rad/s.', `ω² = k/m − c²/(2m²) = ${n(k)} − ${n(c * c)} ÷ 2 = ${n(k)} − ${n(c * c / 2)} = ${n(p * p)}, so ω = ${n(p)} rad/s.`, [['Practical resonance frequency (rad/s)', p], ['k/m', k], ['c²/(2m²)', c * c / 2]]); },
 /* y₁ = e^t, y₂ = e^(2t), y₃ = e^(rt): W(0) is the Vandermonde determinant (2 − 1)(r − 1)(r − 2). */
 q22: t => { t = T(t); const r = [-4, -3, -2, -1, 3, 4, 5][(t + 10) % 7], W = (r - 1) * (r - 2);
  return E('Predict the Wronskian of the three solutions at t = 0.', `At t = 0 the matrix has rows (1, 1, 1), (1, 2, ${n(r)}) and (1, 4, ${n(r * r)}). Its determinant is (2 − 1)(${n(r)} − 1)(${n(r)} − 2) = ${n(W)}, not zero, so the solutions are independent.`, [['Wronskian at t = 0', W], ['y₃″(0)', r * r], ['y₃′(0)', r]]); },
 /* x″ + 4x′ + 10x = F₀ cos(2t): k − mω² = 6, cω = 8, D² = 100; F₀ from 5 to 50 newtons. */
 q23: t => { t = T(t); const F = 5 * (1 + (t + 10) % 10), A = F * 6 / 100, B = F * 8 / 100, C = F / 10;
  return E('Predict the coefficient A of cos(2t) in the steady swing, in metres.', `k − mω² = 10 − 4 = 6 and cω = 8, so D² = 36 + 64 = 100. A = ${n(F)} × 6 ÷ 100 = ${n(A)}, B = ${n(F)} × 8 ÷ 100 = ${n(B)} and the amplitude is ${n(F)} ÷ 10 = ${n(C)}.`, [['A (m)', A], ['B (m)', B], ['Amplitude (m)', C]]); },
 /* x″ + 3x′ + kx = 0 with k from 1 to 9, x(0) = 2, x′(0) = −1, one Euler step of 0.1. */
 q24: t => { t = T(t); const k = 1 + (t + 10) % 9, acc = -2 * k + 3, x2 = Math.round((-1 + 0.1 * acc) * 100) / 100;
  return E('Predict the Euler estimate of x₂ = x′ after one step.', `The bottom row of A is (${n(-k)}, −3), so x₂′ = ${n(-k)} × 2 − 3 × (−1) = ${n(acc)}. One step: x₂ ≈ −1 + 0.1 × ${par(acc)} = ${n(x2)}, and x₁ ≈ 2 + 0.1 × (−1) = 1.9.`, [['x₂ after one step', x2], ['x₁ after one step', 1.9], ['Bottom-left entry of A', -k]]); },
 /* A with rows (2, 1) and (1, 2) at the point (t, 1). */
 q25: t => { t = T(t); const y1 = 2 * t + 1, y2 = t + 2;
  return E('Predict x₁′ at that point.', `x₁′ = 2 × ${par(t)} + 1 × 1 = ${n(y1)} and x₂′ = 1 × ${par(t)} + 2 × 1 = ${n(y2)}.`, [['x₁′', y1], ['x₂′', y2]]); },
 /* Eigenvalues −2 (eigenvector (1, 1)) and λ (eigenvector (1, 2)), x(0) = (1, 0) = 2(1, 1) − (1, 2). */
 q26: t => { t = T(t); const l = [-3, -1, 1, 2, 3][(t + 10) % 5], x1 = 0.5 - Math.pow(2, l);
  return E('Predict x₁ at t = ln 2.', `x(0) = (1, 0) = 2 × (1, 1) − (1, 2), so x₁(t) = 2e^(−2t) − ${l === 1 ? 'e^t' : `e^(${n(l)}t)`}. At t = ln 2 that is 2 × 0.25 − ${n(Math.pow(2, l))} = ${n(x1)}.`, [['x₁ at t = ln 2', x1], ['c₁', 2], ['c₂', -1]]); },
 /* A with rows (a + 2, −2) and (4, a − 2): trace 2a, determinant a² + 4, eigenvalues a ± 2i. */
 q27: t => { t = T(t); const a = (t + 10) % 7 - 3;
  return E('Predict the growth rate a, the real part of the eigenvalues.', `The trace is ${n(2 * a)} and the determinant is ${n(a * a + 4)}, so the eigenvalues are ${n(a)} ± 2i: growth rate ${n(a)} and angular frequency 2 rad/s.`, [['Growth rate a', a], ['Trace', 2 * a], ['Determinant', a * a + 4]]); },
 /* A with rows (t, 1) and (−4, 0): trace t, determinant 4; |t| > 4 node, 0 < |t| < 4 spiral, t = 0 centre. ±4 (a repeated eigenvalue) is left out of the drill pool and moved to ±5 on the bench. */
 q28: t => { t = T(t); if (Math.abs(t) === 4) t = 5 * Math.sign(t); const disc = t * t - 16, code = disc > 0 ? 1 : t === 0 ? 4 : 3;
  return E('Predict the phase portrait code: 1 node, 2 saddle, 3 spiral, 4 centre.', `Trace ${n(t)}, determinant 4, discriminant ${n(t * t)} − 16 = ${n(disc)}. ${disc > 0 ? 'Positive, with a positive determinant: a node.' : t === 0 ? 'Negative with trace 0: a centre.' : 'Negative with a non-zero trace: a spiral.'}`, [['Portrait code', code], ['Trace', t], ['Discriminant', disc]]); },
 /* The q29 canonical tanks (20 L each, eigenvalues −3 and −1), tank 2 empty, tank 1 starting with 2 to 20 kg. */
 q29: t => { t = T(t); const s = 2 * (1 + (t + 10) % 10), d0 = -2 * s, p = (d0 + s) / -2, q = s - p, x1 = p / 8 + q / 2;
  return E('Predict the salt in tank 1, in kg, at t = ln 2.', `x₁′(0) = −2 × ${n(s)} + 0.5 × 0 = ${n(d0)}. With x₁ = pe^(−3t) + qe^(−t): p + q = ${n(s)} and −3p − q = ${n(d0)}, so p = ${n(p)} and q = ${n(q)}. At t = ln 2, x₁ = ${n(p)} × 0.125 + ${n(q)} × 0.5 = ${n(x1)} kg.`, [['Salt in tank 1 (kg)', x1], ['p', p], ['q', q]]); },
 /* ℒ{8e^(at)} at s = 6, with 6 − a from a list that gives short decimals. */
 q30: t => { t = T(t); const d = [1, 2, 4, 5, 8, 10][(t + 10) % 6], a = 6 - d, F = 8 / d;
  return E('Predict ℒ{f}(6).', `ℒ{8e^(at)} = 8 ÷ (s − a) for s > a. At s = 6 with a = ${n(a)}: 8 ÷ (6 − ${par(a)}) = 8 ÷ ${n(d)} = ${n(F)}.`, [['ℒ{f}(6)', F], ['s − a', d], ['a', a]]); },
});
})();
