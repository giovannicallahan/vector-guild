/* Calculus 3: many variables concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A cable from (0, 0, 0) to (2, 1, 2), length 3, with density s + 2z for s from 1 to 21: mass 3(s + 2). */
 q31: t => { t = T(t); const s = t + 11, m = 3 * (s + 2);
  return E('Predict the mass of the cable, in kilograms.', `r(t) = ⟨2t, t, 2t⟩ for t from 0 to 1, so ‖r′(t)‖ = √(4 + 1 + 4) = 3 and ρ(r(t)) = ${n(s)} + 4t. The mass is 3 × (${n(s)} + 4 ÷ 2) = 3 × ${n(s + 2)} = ${n(m)} kilograms.`, [['Mass (kg)', m], ['Cable length (m)', 3], ['Density at the lower end (kg/m)', s]]); },
 /* F = ⟨y, kx⟩ along the straight track ⟨t, 2t⟩ from t = 0 to 3, k from 2 to 22: work 9(1 + k). */
 q32: t => { t = T(t); const k = t + 12, B = 2 + 2 * k, w = 9 * (1 + k);
  return E('Predict the work the force does along the track, in joules.', `F(r(t)) = ⟨2t, ${n(k)}t⟩ and r′(t) = ⟨1, 2⟩, so F(r(t)) · r′(t) = 2t + ${n(2 * k)}t = ${n(B)}t. The work is the integral of ${n(B)}t from 0 to 3: ${n(B)} × 9 ÷ 2 = ${n(w)} joules.`, [['Work (J)', w], ['F · r′ at t = 1', B]]); },
 /* F = ⟨2x + ky, kx⟩ = ∇(x² + kxy), k from 2 to 22, from (0, 0) to (2, 1): work 4 + 2k. */
 q33: t => { t = T(t); const k = t + 12, w = 4 + 2 * k;
  return E('Predict the work the field does from (0, 0) to (2, 1), in joules.', `∂P/∂y = ${n(k)} = ∂Q/∂x, so the field is conservative, with potential φ = x² + ${n(k)}xy. The work is φ(2, 1) − φ(0, 0) = 4 + ${n(2 * k)} − 0 = ${n(w)} joules.`, [['Work (J)', w], ['Conservative (1 or 0)', 1]]); },
 /* F = ⟨−ky, x⟩ round the rectangle 0 ≤ x ≤ 2, 0 ≤ y ≤ 3, k from 2 to 22: circulation 6(1 + k). */
 q34: t => { t = T(t); const k = t + 12, c = 6 * (1 + k);
  return E('Predict the circulation of F once round the rectangle, anticlockwise, in joules.', `∂Q/∂x − ∂P/∂y = 1 − (−${n(k)}) = ${n(1 + k)}, the same everywhere. By Green’s theorem the circulation is ${n(1 + k)} × the area 6 = ${n(c)} joules.`, [['Circulation (J)', c], ['∂Q/∂x − ∂P/∂y', 1 + k]]); },
 /* F = ⟨kxy, y², xz⟩ at (1, 2, 3), k from 2 to 22: div = 2k + 4 + 1. */
 q35: t => { t = T(t); const k = t + 12, d = 2 * k + 5;
  return E('Predict div F at the point (1, 2, 3).', `∂P/∂x = ${n(k)}y = ${n(2 * k)}, ∂Q/∂y = 2y = 4 and ∂R/∂z = x = 1, so div F = ${n(2 * k)} + 4 + 1 = ${n(d)}.`, [['div F', d], ['∂P/∂x', 2 * k], ['∂Q/∂y', 4]]); },
 /* Half of a cylinder of radius r from 1 to 6, 4 m tall: area 4rπ. */
 q36: t => { t = T(t); const r = 1 + (t + 10) % 6, k = 4 * r;
  return E('Predict the panel’s area as k in k·π square metres: enter k.', `‖r_θ × r_z‖ = ${n(r)}, the radius. The area is ${n(r)} × π × 4 = ${n(k)}π, so k = ${n(k)}.`, [['k in k·π', k], ['‖r_θ × r_z‖ (m)', r]]); },
 /* A flat panel at height h from 1 to 21 over 0 ≤ x ≤ 2, 0 ≤ y ≤ 3, field ⟨1, 2, z⟩, upward: flux 6h. */
 q37: t => { t = T(t); const h = t + 11, f = 6 * h;
  return E('Predict the upward flux of F through the panel, in cubic metres per second.', `On the flat panel N = ⟨0, 0, 1⟩ and z = ${n(h)}, so F · N = ${n(h)}. Over the area 6 the flux is ${n(h)} × 6 = ${n(f)} cubic metres per second.`, [['Flux (m³/s)', f], ['F · N on the panel', h]]); },
 /* F = ⟨−ky, x, z⟩ round a circle of radius 2, anticlockwise, k from 2 to 22: circulation 4(k + 1)π. */
 q38: t => { t = T(t); const k = t + 12, c = 4 * (k + 1);
  return E('Predict the circulation round the rim as k in k·π: enter k.', `The z-component of curl F is 1 − (−${n(k)}) = ${n(k + 1)}. By Stokes’ theorem the circulation is the flux of the curl up through the floor disc, ${n(k + 1)} × 4π = ${n(c)}π.`, [['k in k·π', c], ['z-component of curl F', k + 1]]); },
 /* F = ⟨kx, y, z⟩ out of the box 2 × 2 × 3, k from 2 to 22: flux 12(k + 2). */
 q39: t => { t = T(t); const k = t + 12, f = 12 * (k + 2);
  return E('Predict the flux of F out of the box, in cubic metres per second.', `div F = ${n(k)} + 1 + 1 = ${n(k + 2)} everywhere. By the divergence theorem the flux out is ${n(k + 2)} × the volume 12 = ${n(f)} cubic metres per second.`, [['Flux out (m³/s)', f], ['div F', k + 2]]); },
 /* F = ⟨kx, y, z⟩ in a half-ball dome of radius 3 (volume 18π), k from 2 to 22: air leaves at 18(k + 2)π. */
 q40: t => { t = T(t); const k = t + 12, f = 18 * (k + 2);
  return E('Predict the rate at which air leaves the dome through its shell, as k in k·π: enter k.', `div F = ${n(k)} + 1 + 1 = ${n(k + 2)}. On the floor z = 0, so no air crosses it, and the dome holds 2π × 27 ÷ 3 = 18π. The air leaves at ${n(k + 2)} × 18π = ${n(f)}π cubic metres per second.`, [['k in k·π', f], ['div F', k + 2]]); },
});
})();
