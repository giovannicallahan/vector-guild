/* Complex analysis: the plane of numbers concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
/* Shared with variants-b.js: the same parameter maps of t. cz writes a + bi; nz skips 0 (t below 0 stays, t from 0 shifts up by 1). */
const cz = (a, b) => b === 0 ? n(a) : `${a === 0 ? '' : n(a) + ' ' + (b < 0 ? '−' : '+') + ' '}${a === 0 && b < 0 ? '−' : ''}${Math.abs(b) === 1 ? '' : n(Math.abs(b))}i`;
const nz = t => t < 0 ? t : t + 1;
const TR = [[3, 4], [-6, 8], [5, -12], [-8, -15], [7, 24], [-9, 12], [12, 5], [-15, 8], [24, -7], [-4, -3], [8, 6]];
const lead = (v, x) => (v === 1 ? '' : v === -1 ? '−' : n(v)) + x;
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* q11: z from a fixed list of Pythagorean pairs; the target is |z|. */
 q11: t => { t = T(t); const [a, b] = TR[(t + 10) % 11], m = Math.round(Math.sqrt(a * a + b * b));
  return E('Predict the modulus |z|.', `|z| = √(${n(a * a)} + ${n(b * b)}) = √${n(m * m)} = ${n(m)}. So |z²| = ${n(m * m)} and Re Log(z²) = ln ${n(m * m)}.`, [['|z|', m], ['|z|²', m * m], ['Re z', a]]); },
 /* q12: f(z) = z³ + 2z² − 5z + 4 at z₀ = 1 + si, s from −3 to 3: f′(z₀) = (2 − 3s²) + 10si. */
 q12: t => { t = T(t); const s = (t + 10) % 7 - 3, re = 2 - 3 * s * s, im = 10 * s;
  return E('Predict the real part of f′(z₀).', `f′(z) = 3z² + 4z − 5. z₀² = ${cz(1 - s * s, 2 * s)}, so f′(z₀) = 3 × (${cz(1 - s * s, 2 * s)}) + 4 × (${cz(1, s)}) − 5 = ${cz(re, im)}.`, [['Re f′(z₀)', re], ['Im f′(z₀)', im]]); },
 /* q13: u = ax³ − kxy² + 2x, v = 3ax²y − ay³ + 2y with a from 1 to 6: k = 3a. */
 q13: t => { t = T(t); const a = 1 + (t + 10) % 6, k = 3 * a;
  return E('Predict the k that makes u + iv analytic.', `∂u/∂x = ${n(3 * a)}x² − ky² + 2 and ∂v/∂y = ${n(3 * a)}x² − ${n(3 * a)}y² + 2, so k = ${n(k)}. Then ∂u/∂y = −${n(2 * k)}xy = −∂v/∂x as well.`, [['k', k], ['coefficient of y² in ∂v/∂y', -k]]); },
 /* q14: f(z) = (z² + 3)(z + b) at z₀ = 1 + i, b from −10 to 11 without 0: f′(z₀) = (2b + 3) + (2b + 6)i. */
 q14: t => { t = T(t); const b = nz(t), re = 2 * b + 3, im = 2 * b + 6;
  return E('Predict the real part of f′(z₀).', `By the product rule f′(z) = 2z(z ${b < 0 ? '−' : '+'} ${n(Math.abs(b))}) + (z² + 3). With z₀² = 2i this is ${cz(2 * b, 4 + 2 * b)} + (3 + 2i) = ${cz(re, im)}.`, [['Re f′(z₀)', re], ['Im f′(z₀)', im]]); },
 /* q15: y from 0.5 to 3 in steps of 0.5; cos(iy) = cosh y, rounded to 2 decimal places. */
 q15: t => { t = T(t); const y = 0.5 + 0.5 * ((t + 10) % 6), c = Math.round(Math.cosh(y) * 100) / 100;
  return E('Predict cos(iy), to 2 decimal places.', `cos(iy) = (e^(−y) + e^y) ÷ 2 = cosh ${n(y)} ≈ ${n(Math.cosh(y))}, which is ${n(c)} to 2 decimal places.`, [['cos(iy)', c], ['y', y]]); },
 /* q16: u = ax² + 4xy + cy², c from −10 to 11 without 0: harmonic when a = −c. */
 q16: t => { t = T(t); const c = nz(t);
  return E('Predict the a that makes u harmonic.', `∂²u/∂x² = 2a and ∂²u/∂y² = ${n(2 * c)}; the xy term gives 0. 2a + ${par(2 * c)} = 0, so a = ${n(-c)}.`, [['a', -c], ['∂²u/∂y²', 2 * c]]); },
 /* q17: u = ax³ + kxy² + 3y with a from −10 to 11 without 0: harmonic when k = −3a. */
 q17: t => { t = T(t); const a = nz(t);
  return E('Predict the k that makes u harmonic.', `∂²u/∂x² = ${n(6 * a)}x and ∂²u/∂y² = 2kx, so ${n(6 * a)} + 2k = 0 and k = ${n(-3 * a)}.`, [['k', -3 * a], ['∂²u/∂x² at x = 1', 6 * a]]); },
 /* q18: ∫ z dz along the segment from 0 to B = s + 2i, s from −10 to 10: B² ÷ 2 = (s² − 4) ÷ 2 + 2si. */
 q18: t => { t = T(t); const s = t, re = (s * s - 4) / 2, im = 2 * s;
  return E('Predict the real part of the integral.', `γ(t) = tB with γ′(t) = B, so the integrand is tB², which integrates to B² ÷ 2. B² = ${cz(s * s - 4, 4 * s)}, so the integral is ${cz(re, im)}.`, [['real part', re], ['imaginary part', im]]); },
 /* q19: ∫ 3z² dz from 0 to b = s + i, s from −3 to 3: the antiderivative z³ gives b³ = (s³ − 3s) + (3s² − 1)i. */
 q19: t => { t = T(t); const s = (t + 10) % 7 - 3, re = s * s * s - 3 * s, im = 3 * s * s - 1;
  return E('Predict the real part of the integral.', `z³ is an antiderivative of 3z², so the integral is b³ − 0³ = (${cz(s, 1)})³ = ${cz(re, im)}, along any route.`, [['real part', re], ['imaginary part', im]]); },
 /* q20: ∮ (A ÷ (z − 1) + 2(z − 1)²) dz round |z − 1| = 2, A from −10 to 11 without 0: k = 2A. */
 q20: t => { t = T(t); const A = nz(t);
  return E('Predict k in ∮ (A ÷ (z − 1) + 2(z − 1)²) dz = kπi.', `${n(A)} ÷ (z − 1) gives ${n(A)} × 2πi = ${n(2 * A)}πi, and 2(z − 1)² has an antiderivative, so it gives 0. k = ${n(2 * A)}.`, [['k', 2 * A], ['A', A]]); },
});
})();
