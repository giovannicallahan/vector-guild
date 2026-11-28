/* Calculus 3: many variables concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
/* A sum of letter terms, skipping zeros and never writing a coefficient 1 (the same helper as gen-c.js and variants-c.js). */
const poly = terms => { let s = ''; for (const [c, x] of terms) { if (!c) continue; const m = Math.abs(c), body = m === 1 && x ? x : n(m) + x; s = s ? s + (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; } return s || '0'; };
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* f = x² + txy + 3y², critical point (0, 0): D = 12 − t², never 0 for a whole t; a minimum for |t| ≤ 3, a saddle beyond. */
 q21: t => { t = T(t); const D = 12 - t * t, code = D > 0 ? 2 : 3;
  return E('Predict the discriminant D at the critical point (0, 0).', `f_xx = 2, f_yy = 6 and f_xy = ${n(t)}, so D = 2 × 6 − ${par(t)}² = ${n(D)}. ${D > 0 ? 'D is positive and f_xx is positive: a local minimum' : 'D is negative: a saddle point'}.`, [['D', D], ['f_xy', t], ['code', code]]); },
 /* f = 3x + 4y on x² + y² = r², r from 1 to 10: the largest value is 5r, at λ = 5 ÷ (2r). */
 q22: t => { t = T(t); const r = 1 + (t + 10) % 10;
  return E('Predict the largest value of f on the circle.', `∇f = (3, 4) = λ(2x, 2y) gives x = 3 ÷ (2λ) and y = 4 ÷ (2λ). The constraint gives 25 ÷ (4λ²) = ${n(r * r)}, so λ = ${n(5 / (2 * r))} and the point is (${n(3 * r / 5)}, ${n(4 * r / 5)}), where f = ${n(5 * r)}.`, [['Largest value', 5 * r], ['Radius', r]]); },
 /* f = x² + 2y² − 2tx + 5: critical point (t, 0), a minimum, with value 5 − t². */
 q23: t => { t = T(t);
  return E('Predict the value of f at its critical point.', `f_x = ${poly([[2, 'x'], [-2 * t, '']])} and f_y = 4y are both 0 at (${n(t)}, 0). D = 2 × 4 − 0 = 8 with f_xx positive, so it is a local minimum, where f = ${par(t)}² − 2 × ${par(t)} × ${par(t)} + 5 = ${n(5 - t * t)}.`, [['Value at the critical point', 5 - t * t], ['x of the critical point', t]]); },
 /* h = 4 + xy over 0 ≤ x ≤ 4, 0 ≤ y ≤ Y with Y from 1 to 6: volume 16Y + 4Y². */
 q24: t => { t = T(t); const Y = 1 + (t + 10) % 6, V = 16 * Y + 4 * Y * Y;
  return E('Predict the volume under the roof, in cubic metres.', `Inside: the integral of 4 + xy with respect to x from 0 to 4 is 16 + 8y. Outside: the integral of 16 + 8y from 0 to ${n(Y)} is 16 × ${n(Y)} + 4 × ${n(Y * Y)} = ${n(V)}.`, [['Volume (m³)', V], ['Floor area (m²)', 4 * Y]]); },
 /* ∬ 4x dA under y = x² from x = 0 to a, a from 1 to 5: a⁴. */
 q25: t => { t = T(t); const a = 1 + (t + 10) % 5;
  return E('Predict the value of the double integral.', `For each x, y runs from 0 to x², so the inner integral is 4x × x² = 4x³. Its integral from 0 to ${n(a)} is ${n(a)}⁴ = ${n(a ** 4)}. Switched, y runs from 0 to ${n(a * a)} and x from √y to ${n(a)}.`, [['Integral', a ** 4], ['Top limit of y', a * a]]); },
 /* x² + y² over the whole disc of radius R, R from 1 to 5: (R⁴ ÷ 4) × 2π, so k = R⁴ ÷ 2. */
 q26: t => { t = T(t); const R = 1 + (t + 10) % 5, I = R ** 4 / 4;
  return E('Predict k, where the integral is k·π.', `In polar coordinates the integrand is r² × r = r³, whose integral from 0 to ${n(R)} is ${n(R ** 4)} ÷ 4 = ${n(I)}. The full turn is 2π wide, so the integral is ${n(I)} × 2π = ${n(2 * I)}π.`, [['k', 2 * I], ['Inner integral', I]]); },
 /* A block 0 ≤ x ≤ 2, 0 ≤ y ≤ 2, 0 ≤ z ≤ H, density 1 + z, H from 1 to 6: mass 4H + 2H². */
 q27: t => { t = T(t); const H = 1 + (t + 10) % 6, M = 4 * H + 2 * H * H;
  return E('Predict the mass of the block, in tonnes.', `The integral of 1 + z with respect to z from 0 to ${n(H)} is ${n(H)} + ${n(H * H)} ÷ 2 = ${n(H + H * H / 2)}. The y- and x-integrals multiply it by 2 and by 2: ${n(M)} tonnes.`, [['Mass (t)', M], ['Volume (m³)', 4 * H]]); },
 /* A ball of radius R = 3, 6 or 9: k = 4R³ ÷ 3, a whole number. */
 q28: t => { t = T(t); const R = 3 * (1 + (t + 10) % 3), rad = R ** 3 / 3;
  return E('Predict k, where the volume is k·π.', `The radial integral of ρ² from 0 to ${n(R)} is ${n(R ** 3)} ÷ 3 = ${n(rad)}. The integral of sin φ from 0 to π is 2, and θ gives 2π, so the volume is ${n(rad)} × 2 × 2π = ${n(4 * rad)}π.`, [['k', 4 * rad], ['Radial integral', rad]]); },
 /* A half shell between R and R + 1, density 6 ÷ ρ, R from 2 to 11: mass 6(2R + 1)π. */
 q29: t => { t = T(t); const R = 2 + (t + 10) % 10, r = 3 * (2 * R + 1);
  return E('Predict k, where the mass is k·π tonnes.', `δ × ρ² = 6ρ, whose integral from ${n(R)} to ${n(R + 1)} is 6 × (${n((R + 1) ** 2)} − ${n(R * R)}) ÷ 2 = ${n(r)}. The integral of sin φ from 0 to π/2 is 1 and θ gives 2π, so the mass is ${n(2 * r)}π tonnes.`, [['k', 2 * r], ['Radial integral', r]]); },
 /* u = x + y, v = x − (s − 1)y with s = 1, 2, 4 or 8: ∂(u, v)/∂(x, y) = −s, and the plate 0 ≤ u ≤ 4, 0 ≤ v ≤ 2 has area 8 ÷ s. */
 q30: t => { t = T(t); const s = [1, 2, 4, 8][(t + 10) % 4], v = poly([[1, 'x'], [1 - s, 'y']]);
  return E('Predict the area of the plate, in square metres.', `With u = x + y and v = ${v}, ∂(u, v)/∂(x, y) = 1 × ${par(1 - s)} − 1 × 1 = ${n(-s)}, so J = ${n(-1 / s)} and |J| = ${n(1 / s)}. In u and v the plate is a 4 by 2 rectangle, so its area is 8 × ${n(1 / s)} = ${n(8 / s)}.`, [['Area (m²)', 8 / s], ['∂(u, v)/∂(x, y)', -s]]); },
});
})();
