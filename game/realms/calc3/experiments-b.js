/* Calculus 3: many variables concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* r(t) = ⟨2t, 3t, t²⟩ and the plane x + y + z = d with d = T² + 5T, T from 1 to 6. */
 q11: t => { t = T(t); const m = 1 + (t + 10) % 6, d = m * m + 5 * m;
  return E('Predict the time t > 0, in seconds, when the shuttle passes through the plane.', `Substituting gives 2t + 3t + t² = ${n(d)}, so t² + 5t − ${n(d)} = 0 = (t − ${n(m)})(t + ${n(m + 5)}). The positive root is t = ${n(m)}, where the velocity is ⟨2, 3, ${n(2 * m)}⟩.`, [['Meeting time (s)', m], ['Third velocity component (m/s)', 2 * m]]); },
 /* h = 50 − x² − 2y² at (a, 2), a from 1 to 6. */
 q12: t => { t = T(t); const a = 1 + (t + 10) % 6, c = 42 - a * a;
  return E('Predict the level c of the contour line through the beacon, in metres.', `h(${n(a)}, 2) = 50 − ${n(a * a)} − 2 × 4 = ${n(c)}, so the beacon is on the level curve h(x, y) = ${n(c)}.`, [['Contour level (m)', c], ['x² at the beacon', a * a]]); },
 /* 10xy ÷ (x² + y²) along y = mx, m from 1 to 3: 10m ÷ (1 + m²) is 5, 4 or 3. */
 q13: t => { t = T(t); const m = 1 + (t + 10) % 3, v = 10 * m / (1 + m * m);
  return E('Predict the limit of f as (x, y) approaches (0, 0) along that line.', `Along y = ${m === 1 ? '' : n(m)}x, f = ${n(10 * m)}x² ÷ (${n(1 + m * m)}x²) = ${n(v)} for every x other than 0. Different lines give different values, so f itself has no limit at (0, 0).`, [['Limit along the line', v], ['Denominator factor 1 + m²', 1 + m * m]]); },
 /* h = 3x²y − 2xy² + 4e^(x − y) at (p, p), p from 1 to 4: h_x = 4p² + 4. */
 q14: t => { t = T(t); const p = 1 + (t + 10) % 4, hx = 4 * p * p + 4;
  return E('Predict ∂h/∂x at the point.', `∂h/∂x = 6xy − 2y² + 4e^(x − y). At (${n(p)}, ${n(p)}), e^(x − y) = 1, so this is ${n(6 * p * p)} − ${n(2 * p * p)} + 4 = ${n(hx)}.`, [['∂h/∂x', hx], ['∂h/∂y', -p * p - 4]]); },
 /* h = 2x³ − 3x²y + xy² + y³ at (2, r), r from −3 to 3: h_xy = −6x + 2y = 2r − 12. */
 q15: t => { t = T(t); const r = -3 + (t + 10) % 7, xy = 2 * r - 12;
  return E('Predict the mixed partial derivative h_xy at the point.', `h_x = 6x² − 6xy + y², so h_xy = −6x + 2y. At (2, ${n(r)}) this is −12 + ${par(2 * r)} = ${n(xy)}.`, [['h_xy', xy], ['h_xx', 24 - 6 * r]]); },
 /* h = 80 − 2x² + xy − y² from (3, 2), where h = 64, h_x = −10, h_y = −1; step Δx = 0.1 and Δy = k ÷ 10, k from −3 to 3. */
 q16: t => { t = T(t); const k = -3 + (t + 10) % 7, Dy = k / 10, L = (630 - k) / 10;
  return E('Predict the linear estimate of the height at the nearby point, in metres.', `h(3, 2) = 64, h_x(3, 2) = −10 and h_y(3, 2) = −1. With Δx = 0.1 and Δy = ${n(Dy)}, L = 64 + (−10) × 0.1 + (−1) × ${par(Dy)} = ${n(L)}.`, [['Estimated height (m)', L], ['Δy', Dy]]); },
 /* h = 40 + x²y − y³ + 3x at (2, r), r from 1 to 4: h_y = 4 − 3r². */
 q17: t => { t = T(t); const r = 1 + (t + 10) % 4, fy = 4 - 3 * r * r;
  return E('Predict the slope of the ground going north, h_y, at the rover.', `h_y = x² − 3y². At (2, ${n(r)}) this is 4 − ${n(3 * r * r)} = ${n(fy)}.`, [['Slope north h_y', fy], ['Height (m)', 46 + 4 * r - r * r * r]]); },
 /* T = 3x² − 2xy + y² along x = 1 + 2t, y = t², at a time s from 1 to 4. */
 q18: t => { t = T(t); const s = 1 + (t + 10) % 4, X = 1 + 2 * s, Y = s * s, Tx = 6 * X - 2 * Y, Ty = -2 * X + 2 * Y, r = 2 * Tx + 2 * s * Ty;
  return E('Predict dT/dt at that time, in degrees per hour.', `At t = ${n(s)} the balloon is at (${n(X)}, ${n(Y)}). ∂T/∂x = ${n(Tx)}, ∂T/∂y = ${n(Ty)}, dx/dt = 2 and dy/dt = ${n(2 * s)}, so dT/dt = ${par(Tx)} × 2 + ${par(Ty)} × ${n(2 * s)} = ${n(r)}.`, [['dT/dt (°C per hour)', r], ['∂T/∂x', Tx], ['∂T/∂y', Ty]]); },
 /* T = x² + 3xy − 2y² at (2, 1), where ∇T = ⟨7, 2⟩, in one of eight directions of length 5. */
 q19: t => { t = T(t); const D = [[3, 4], [4, 3], [3, -4], [-3, 4], [4, -3], [-4, 3], [-3, -4], [-4, -3]][(t + 10) % 8], u = D[0] / 5, v = D[1] / 5, r = Math.round(2 * (7 * D[0] + 2 * D[1])) / 10;
  return E('Predict the directional derivative of T in the wind’s direction, in degrees per kilometre.', `∇T(2, 1) = ⟨7, 2⟩ and the unit vector is u = ⟨${n(u)}, ${n(v)}⟩, so ∇T · u = 7 × ${par(u)} + 2 × ${par(v)} = ${n(r)}.`, [['Rate with the wind (°C per km)', r], ['u first component', u], ['u second component', v]]); },
 /* P = 2x² + 2y² at (3k, 4k), k from 1 to 5: ∇P = ⟨12k, 16k⟩ and ‖∇P‖ = 20k. */
 q20: t => { t = T(t); const k = 1 + (t + 10) % 5;
  return E('Predict the greatest rate of increase of P at the point, in pascals per kilometre.', `∇P = ⟨4x, 4y⟩ = ⟨${n(12 * k)}, ${n(16 * k)}⟩ at (${n(3 * k)}, ${n(4 * k)}). Its magnitude is √(${n(144 * k * k)} + ${n(256 * k * k)}) = ${n(20 * k)}, the greatest rate of increase, in the direction of ∇P.`, [['Greatest rate (Pa per km)', 20 * k], ['∂P/∂x', 12 * k], ['∂P/∂y', 16 * k]]); },
});
})();
