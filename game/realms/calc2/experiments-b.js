/* Calculus 2: accumulation concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Plate between y = 3x² and y = 3cx, c from 1 to 6: they cross at x = c and the area is c³/2. */
 q11: t => { t = T(t); const c = 1 + (t + 10) % 6, c3 = c * c * c;
  return E('Predict the area of the plate, in square metres.', `3x² = ${n(3 * c)}x at x = 0 and x = ${n(c)}. The line is on top, so the area is ∫ from 0 to ${n(c)} of (${n(3 * c)}x − 3x²) dx = ${n(3 * c)} × ${n(c * c)} ÷ 2 − ${n(c3)} = ${n(c3 / 2)}.`, [['Area (m²)', c3 / 2], ['Crossing x', c]]); },
 /* The region under y = 3x − x² spun about x = −c, c from 1 to 8, by shells: k = 13.5 + 9c. */
 q12: t => { t = T(t); const c = 1 + (t + 10) % 8, k = 13.5 + 9 * c;
  return E('Predict k, where the volume is kπ.', `The shell through x has radius x + ${n(c)} and height 3x − x². V = 2π ∫ from 0 to 3 of x(3x − x²) dx + 2π × ${n(c)} × ∫ from 0 to 3 of (3x − x²) dx = 13.5π + ${n(9 * c)}π = ${n(k)}π.`, [['k', k], ['Distance from the y-axis to the axis', c]]); },
 /* y = 2x^(3/2) from 0 to b, b from 1 to 6: u = 1 + 9x runs to 1 + 9b, L = (2/27)((1 + 9b)^(3/2) − 1), to 2 decimal places. */
 q13: t => { t = T(t); const b = 1 + (t + 10) % 6, U = 1 + 9 * b, U15 = Math.pow(U, 1.5), L = Math.round(2 * (U15 - 1) / 27 * 100) / 100;
  return { ...E('Predict the arc length, to 2 decimal places.', `dy/dx = 3√x, so 1 + (dy/dx)² = 1 + 9x. With u = 1 + 9x the limits are 1 and ${n(U)}, and L = (2 ÷ 27)(${n(U)}^(3/2) − 1) = (2 ÷ 27)(${n(U15)} − 1), about ${L.toFixed(2)}.`, [['Arc length', L], ['Upper limit in u', U]]), tolerance: 0.005 }; },
 /* A spring with k = 150 N/m (30 N holds it 0.2 m out) stretched from 0 to d = 0.1 to 0.6 m: W = 75d². */
 q14: t => { t = T(t); const D = 1 + (t + 10) % 6, d = D / 10, W = 75 * D * D / 100;
  return E('Predict the work, in joules.', `k = 30 ÷ 0.2 = 150 N/m. W = ∫ from 0 to ${n(d)} of 150x dx = 75 × ${n(d)}² = 75 × ${n(D * D / 100)} = ${n(W)} J.`, [['Work (J)', W], ['Force at the end (N)', 15 * D]]); },
 /* A full box tank 3 m × 2 m × H m, H from 1 to 5, pumped to 1 m above its top: W = 58.8(H²/2 + H) kJ. */
 q15: t => { t = T(t); const H = 1 + (t + 10) % 5, I = H * H / 2 + H, W = Math.round(588 * I) / 10;
  return E('Predict the work, in kilojoules.', `A layer weighs 1000 × 9.8 × 6 dy = 58800 dy newtons, and the layer at height y rises ${n(H + 1)} − y metres. W = 58800 ∫ from 0 to ${n(H)} of (${n(H + 1)} − y) dy = 58800 × ${n(I)} = ${n(W * 1000)} J, which is ${n(W)} kJ.`, [['Work (kJ)', W], ['Lift from the bottom (m)', H + 1]]); },
 /* A rod of length L, 1 to 8 m, with density 3 + 2x kg/m: mass 3L + L². */
 q16: t => { t = T(t); const L = 1 + (t + 10) % 8, m = 3 * L + L * L;
  return E('Predict the mass of the rod, in kilograms.', `m = ∫ from 0 to ${n(L)} of (3 + 2x) dx = 3 × ${n(L)} + ${n(L * L)} = ${n(m)} kg.`, [['Mass (kg)', m], ['Length (m)', L]]); },
 /* A cable of 2 kg/m and length 5 to 40 m wound up: W = 9.8 L². */
 q17: t => { t = T(t); const L = 5 * (1 + (t + 10) % 8), W = Math.round(98 * L * L) / 10;
  return E('Predict the work, in joules.', `Each metre weighs 9.8 × 2 = 19.6 N, and the piece y metres down rises y metres. W = ∫ from 0 to ${n(L)} of 19.6y dy = 19.6 × ${n(L * L)} ÷ 2 = ${n(W)} J.`, [['Work (J)', W], ['Weight per metre (N)', 19.6]]); },
 /* ∫ from 1 to b of ln x dx = b ln b − b + 1, b from 2 to 9, to 3 decimal places. */
 q18: t => { t = T(t); const b = 2 + (t + 10) % 8, B = b * Math.log(b), V = Math.round((B - b + 1) * 1000) / 1000;
  return { ...E('Predict the value of the integral, to 3 decimal places.', `With u = ln x and dv = dx: du = (1 ÷ x) dx and v = x. [x ln x] from 1 to ${n(b)} = ${n(b)} ln ${n(b)}, about ${B.toFixed(3)}, and ∫ from 1 to ${n(b)} of 1 dx = ${n(b - 1)}. The integral is about ${V.toFixed(3)}.`, [['Value', V], ['Boundary term', Math.round(B * 1000) / 1000]]), tolerance: 0.0005 }; },
 /* ∫ from 0 to mπ/2 of sin²x dx = mπ/4, m from 1 to 8: k = m/4. */
 q19: t => { t = T(t); const m = 1 + (t + 10) % 8, top = m % 2 ? `${m === 1 ? '' : n(m)}π/2` : `${m === 2 ? '' : n(m / 2)}π`;
  return E('Predict k, where the integral equals kπ.', `sin²x = (1 − cos 2x) ÷ 2, so the integral is [x ÷ 2 − sin 2x ÷ 4] from 0 to ${top}. sin 2x is 0 at both ends, so the value is (${top}) ÷ 2 = ${n(m / 4)}π.`, [['k', m / 4], ['Upper limit ÷ π', m / 2]]); },
 /* Area under y = √(r² − x²) from 0 to r/2, r from 1 to 10: r²(π/12 + √3/8), to 3 decimal places. */
 q20: t => { t = T(t); const r = 1 + (t + 10) % 10, A = Math.round(r * r * (Math.PI / 12 + Math.sqrt(3) / 8) * 1000) / 1000;
  return { ...E('Predict the area of the piece, to 3 decimal places.', `x = ${n(r)} sin θ; x = ${n(r / 2)} gives sin θ = 1/2, so θ = π/6. The area is (${n(r * r)} ÷ 2)(π/6 + sin θ cos θ) = (${n(r * r)} ÷ 2)(π/6 + (1/2) × (√3/2)), about ${A.toFixed(3)}.`, [['Area', A], ['θ at the cut (radians)', 0.524]]), tolerance: 0.0005 }; },
});
})();
