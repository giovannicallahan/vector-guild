/* Complex analysis: the plane of numbers concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Σ aₙzⁿ with aₙ = n² ÷ bⁿ, b from 2 to 9: the ratio test gives R = b. */
 q31: t => { t = T(t); const b = 2 + (t + 10) % 8;
  return E('Predict the radius of convergence R of the series.', `The ratio of neighbouring terms is ((n + 1) ÷ n)² × |z| ÷ ${n(b)}, which tends to |z| ÷ ${n(b)}. That is less than 1 exactly when |z| < ${n(b)}, so R = ${n(b)}.`, [['Radius R', b], ['Power of n in aₙ', 2]]); },
 /* 1 ÷ (1 + 2z) = Σ (−2)ⁿzⁿ; the coefficient of zᵐ for m from 1 to 8. */
 q32: t => { t = T(t); const m = 1 + (t + 10) % 8, c = Math.pow(-2, m);
  return E('Predict the Taylor coefficient of that power of z.', `With w = −2z, 1 ÷ (1 + 2z) = 1 + w + w² + … = Σ (−2)ⁿzⁿ, so the coefficient of z to the power ${n(m)} is (−2) to the power ${n(m)}, which is ${n(c)}.`, [['Coefficient', c], ['Power of z', m]]); },
 /* 3u ÷ (z(z − 3)) on 0 < |z| < 3, u from 1 to 21: the z⁻¹ coefficient is −u. */
 q33: t => { t = T(t); const u = t + 11, K = 3 * u;
  return E('Predict the coefficient of z⁻¹ in the Laurent series.', `On 0 < |z| < 3, 1 ÷ (z − 3) = −(1 ÷ 3)(1 + z ÷ 3 + …). Multiplying by ${n(K)} ÷ z, the z⁻¹ term is −(${n(K)} ÷ 3)z⁻¹, so the coefficient is ${n(-u)}.`, [['Coefficient of z⁻¹', -u], ['Number on top', K]]); },
 /* sin z ÷ zᵖ, p from 2 to 7: a pole of order p − 1 at 0. */
 q34: t => { t = T(t); const p = 2 + (t + 10) % 6;
  return E('Predict the order of the pole at z = 0.', `sin z = z − z³ ÷ 3! + …, so dividing by z to the power ${n(p)} leaves z to the power ${n(1 - p)} as the most negative power: a pole of order ${n(p - 1)}.`, [['Order of the pole', p - 1], ['Power on the bottom', p]]); },
 /* 2vz ÷ (z² − 1), v from 1 to 21: the residue at z = 1 is p(1) ÷ q′(1) = 2v ÷ 2 = v. */
 q35: t => { t = T(t); const v = t + 11;
  return E('Predict the residue at z = 1.', `p(1) = ${n(2 * v)} and q′(z) = 2z, so q′(1) = 2. The residue is ${n(2 * v)} ÷ 2 = ${n(v)}.`, [['Residue at 1', v], ['p(1)', 2 * v], ['q′(1)', 2]]); },
 /* (z³ + uz²) ÷ (z − 1)³, u from 2 to 22: the residue is g″(1) ÷ 2! = (6 + 2u) ÷ 2 = 3 + u. */
 q36: t => { t = T(t); const u = t + 12;
  return E('Predict the residue at the pole of order 3.', `g(z) = z³ + ${n(u)}z², so g″(z) = 6z + ${n(2 * u)} and g″(1) = ${n(6 + 2 * u)}. The residue is ${n(6 + 2 * u)} ÷ 2! = ${n(3 + u)}.`, [['Residue', 3 + u], ['g″(1)', 6 + 2 * u]]); },
 /* 3 ÷ (z − 2) + 5 ÷ (z − 4) + 7 ÷ (z − 6) round |z| = R, R = 1, 3, 5 or 7: k = 2 × (residues inside). */
 q37: t => { t = T(t); const R = 1 + 2 * ((t + 10) % 4), res = [[2, 3], [4, 5], [6, 7]].filter(([p]) => p < R), S = res.reduce((s, [, r]) => s + r, 0);
  return E('Predict k, where ∮ f(z) dz = kπi.', `Inside |z| = ${n(R)}: ${res.length ? res.map(([p, r]) => `the pole at ${n(p)}, residue ${n(r)}`).join('; ') : 'no pole'}. The sum of the residues inside is ${n(S)}, so ∮ f(z) dz = 2πi × ${n(S)} and k = ${n(2 * S)}.`, [['k', 2 * S], ['Poles inside', res.length]]); },
 /* ∫ 60 dx ÷ (x² + a²) over the whole line, a from 1 to 6: 60π ÷ a. */
 q38: t => { t = T(t); const a = 1 + (t + 10) % 6;
  return E('Predict k, where the integral is kπ.', `The only pole in the upper half-plane is ${a === 1 ? 'i' : `${n(a)}i`}, with residue 60 ÷ (${n(2 * a)}i). Times 2πi this gives 60π ÷ ${n(a)} = ${n(60 / a)}π.`, [['k', 60 / a], ['Poles in the upper half-plane', 1]]); },
 /* ∫ from 0 to 2π of 2u dθ ÷ (5 + 3 cos θ), u from 1 to 21: 2π × 2u ÷ 4 = uπ. */
 q39: t => { t = T(t); const u = t + 11;
  return E('Predict k, where the integral is kπ.', `√(5² − 3²) = 4, and the integral of c dθ ÷ (5 + 3 cos θ) over one turn is 2πc ÷ 4. With c = ${n(2 * u)} it is ${n(4 * u)}π ÷ 4 = ${n(u)}π.`, [['k', u], ['√(a² − b²)', 4]]); },
 /* zᵐ ÷ (z − 1)² round |z| = 3, m from 1 to 8: Z = m, P = 2, winding number m − 2. */
 q40: t => { t = T(t); const m = 1 + (t + 10) % 8;
  return E('Predict the winding number of the image curve f(z) round 0.', `Inside |z| = 3 the zero at 0 counts ${n(m)} ${m === 1 ? 'time' : 'times'} and the pole at 1 counts 2 times, so the winding number is ${n(m)} − 2 = ${n(m - 2)}.`, [['Winding number', m - 2], ['Zeros inside', m], ['Poles inside', 2]]); },
});
})();
