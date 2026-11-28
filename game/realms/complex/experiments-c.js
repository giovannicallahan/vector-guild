/* Complex analysis: the plane of numbers concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* ∮ c ÷ (z − t) dz round |z| = 4 for a point t on the real line, c from 1 to 5: k = 2c inside, 0 outside. */
 q21: t => { t = T(t); const c = 1 + (t + 10) % 5, inside = Math.abs(t) < 4, k = inside ? 2 * c : 0;
  return E('Predict k in ∮ c ÷ (z − a) dz = kπi round the circle |z| = 4, once anticlockwise.', inside ? `a = ${n(t)} is ${n(Math.abs(t))} from 0, less than 4, so it is inside. Shrinking the circle to a small one round a gives 2πi × ${n(c)} = ${n(k)}πi, so k = ${n(k)}.` : `a = ${n(t)} is ${n(Math.abs(t))} from 0, not less than 4, so it is not inside${Math.abs(t) === 4 ? '; the drill keeps a off the circle itself' : ''}. Off the circle and outside it, Cauchy’s theorem gives k = 0.`, [['k', k], ['Distance of a from 0', Math.abs(t)], ['Number on top c', c]]); },
 /* A path that winds t times round |z| = 2 (clockwise for negative t); ∮ 3 ÷ (z − 1) dz = 6t πi. */
 q22: t => { t = T(t); const k = 6 * t;
  return E('Predict k in ∮ 3 ÷ (z − 1) dz = kπi along the whole path.', `1 is inside |z| = 2, and the path winds ${n(t)} times round it (anticlockwise turns +1, clockwise −1), so the winding number is ${n(t)} and the integral is 2πi × 3 × ${par(t)} = ${n(k)}πi.`, [['k', k], ['Winding number', t]]); },
 /* Round |z| = 3: t ÷ (z − 1) + 4 ÷ (z − 5) + 2 ÷ (z − 1)²; only t ÷ (z − 1) counts: k = 2t. */
 q23: t => { t = T(t); const k = 2 * t;
  return E('Predict k in the integral round |z| = 3 written as kπi.', `5 is outside |z| = 3, so 4 ÷ (z − 5) gives 0. Round the inside point 1 the square term 2 ÷ (z − 1)² gives 0 and ${n(t)} ÷ (z − 1) gives 2πi × ${par(t)} = ${n(k)}πi, so k = ${n(k)}.`, [['k', k], ['Coefficient of 1 ÷ (z − 1)', t]]); },
 /* f(z) = z² + tz + 3 at a = 2 inside |z| = 3: k = 2f(2) = 2(7 + 2t). */
 q24: t => { t = T(t); const fa = 7 + 2 * t, k = 2 * fa;
  return E('Predict k in ∮ f(z) ÷ (z − 2) dz = kπi round |z| = 3.', `2 is inside |z| = 3. f(2) = 4 + ${par(2 * t)} + 3 = ${n(fa)}, so Cauchy’s integral formula gives 2πi × ${par(fa)} = ${n(k)}πi.`, [['k', k], ['f(2)', fa]]); },
 /* f(z) = z³ + tz² over (z − 1)² inside |z| = 3: n = 1, f′(1) = 3 + 2t, k = 2(3 + 2t). */
 q25: t => { t = T(t); const d = 3 + 2 * t, k = 2 * d;
  return E('Predict k in ∮ f(z) ÷ (z − 1)² dz = kπi round |z| = 3.', `The power 2 is n + 1, so n = 1. f′(z) = 3z²${t ? ` ${t < 0 ? '−' : '+'} ${n(Math.abs(2 * t))}z` : ''}, so f′(1) = ${n(d)}, and the integral is 2πi × ${par(d)} ÷ 1! = ${n(k)}πi.`, [['k', k], ['f′(1)', d]]); },
 /* |f| ≤ M = 4(t + 11) on |z − 2| = 2: Cauchy's bound on |f′′(2)| is 2! M ÷ 2² = 2(t + 11). */
 q26: t => { t = T(t); const M = 4 * (t + 11), b = 2 * M / 4;
  return E('Predict the largest value Cauchy’s inequality allows for |f′′(2)|.', `n = 2, M = ${n(M)} and R = 2: 2! × ${n(M)} ÷ 2² = ${n(2 * M)} ÷ 4 = ${n(b)}.`, [['Bound', b], ['M', M]]); },
 /* u = x² − y² + tx round the circle of radius 3 centred at (2, 1): the average is u(2, 1) = 3 + 2t. */
 q27: t => { t = T(t); const mid = 3 + 2 * t, edge = 24 + 5 * t;
  return E('Predict the average of u round the ring.', `u is harmonic (2 − 2 = 0), so the average round the ring is u at its centre: u(2, 1) = 4 − 1 + ${par(2 * t)} = ${n(mid)}.`, [['Average round the ring', mid], ['u at (5, 1) on the ring', edge]]); },
 /* f(z) = z³ + t on |z| ≤ 3: the largest |f| is 27 + |t|. */
 q28: t => { t = T(t); const top = 27 + Math.abs(t);
  return E('Predict the largest value of |f(z)| on the disc |z| ≤ 3.', `On the edge |z³| = 27, and z³ passes through 27 and −27. The largest |z³${t ? ` ${t < 0 ? '−' : '+'} ${n(Math.abs(t))}` : ''}| is 27 + ${n(Math.abs(t))} = ${n(top)}, on the edge, by the maximum modulus principle.`, [['Largest |f|', top], ['|z³| on the edge', 27]]); },
 /* f(z) = z² + tz + 1 over (z − 1)² round |z| = 2: k = 2f′(1) = 2(2 + t). */
 q29: t => { t = T(t); const d = 2 + t, k = 2 * d;
  return E('Predict k in ∮ f(z) ÷ (z − 1)² dz = kπi round |z| = 2.', `1 is inside |z| = 2. f′(z) = 2z${t ? ` ${t < 0 ? '−' : '+'} ${n(Math.abs(t))}` : ''}, so f′(1) = ${n(d)}, and the formula for derivatives gives 2πi × ${par(d)} = ${n(k)}πi.`, [['k', k], ['f′(1)', d]]); },
 /* z = ti ÷ 10 (|t| ≤ 9, so |z| < 1): the real part of 1 ÷ (1 − z) is 100 ÷ (100 + t²), to 2 decimal places. */
 q30: t => { t = Math.max(-9, Math.min(9, T(t))); const den = 100 + t * t, re = Math.round(10000 / den) / 100;
  return { ...E('Predict the real part of the sum 1 + z + z² + …, to 2 decimal places.', t === 0 ? 'z = 0, so the sum is 1 ÷ (1 − 0) = 1, and its real part is 1.' : `1 ÷ (1 − z) = 10 ÷ (10 ${t < 0 ? '+' : '−'} ${Math.abs(t) === 1 ? '' : n(Math.abs(t))}i). Multiplying the top and the bottom by the conjugate gives (100 ${t < 0 ? '−' : '+'} ${n(Math.abs(10 * t))}i) ÷ ${n(den)}, so the real part is 100 ÷ ${n(den)}, which is ${n(re)} to 2 decimal places.`, [['Real part', re], ['Bottom after the conjugate', den]]), tolerance: 0.005 }; },
});
})();
