/* Mechanics: motion and force concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Sled from rest down a frictionless ramp of height 0.4k² m (k from 1 to 5): the speed at the bottom is 2.8k m/s. */
 q31: t => { t = T(t); const k = 1 + (t + 10) % 5, h = 0.4 * k * k, v = 2.8 * k;
  return E('Predict the sled’s speed at the bottom of the ramp, in metres per second.', `Mechanical energy is kept: mgh = ½mv², so v = √(2gh) = √(2 × 9.8 × ${n(h)}) = √${n(19.6 * h)} = ${n(v)} m/s.`, [['Speed at the bottom (m/s)', v], ['Height (m)', h], ['Kinetic energy per kilogram (J/kg)', 9.8 * h]]); },
 /* A 200 kg module at v m/s (1 to 6) brought to rest in 0.5 s; towards the buffer is positive. */
 q32: t => { t = T(t); const v = 1 + (t + 10) % 6, p = 200 * v, J = -p, F = J / 0.5;
  return E('Predict the average force of the buffer on the module, in newtons (signs matter).', `Momentum before: 200 × ${n(v)} = ${n(p)} kg·m/s, and after: 0. Impulse = 0 − ${n(p)} = ${n(J)} N·s. Average force = ${n(J)} ÷ 0.5 = ${n(F)} N.`, [['Average force (N)', F], ['Impulse (N·s)', J], ['Momentum before (kg·m/s)', p]]); },
 /* A 200 kg module at v m/s (1 to 8) latches onto a 200 kg module at rest: the pair moves at v ÷ 2. */
 q33: t => { t = T(t); const v = 1 + (t + 10) % 8, P = 200 * v, vf = v / 2, lost = 100 * v * v - 200 * vf * vf;
  return E('Predict the common velocity of the latched pair, in metres per second.', `Momentum before: 200 × ${n(v)} = ${n(P)} kg·m/s. The pair has mass 400 kg, so v = ${n(P)} ÷ 400 = ${n(vf)} m/s. Kinetic energy lost: ${n(100 * v * v)} − ${n(200 * vf * vf)} = ${n(lost)} J.`, [['Common velocity (m/s)', vf], ['Total momentum (kg·m/s)', P], ['Kinetic energy lost (J)', lost]]); },
 /* 100 kg at x = 0 m and m kg at x = 10 m; m from a list chosen so the centre of mass is a short decimal. */
 q34: t => { t = T(t); const m = [25, 100, 150, 300, 400, 900][(t + 10) % 6], M = 100 + m, x = 10 * m / M;
  return E('Predict the x coordinate of the centre of mass, in metres.', `M = 100 + ${n(m)} = ${n(M)} kg and Σmx = 100 × 0 + ${n(m)} × 10 = ${n(10 * m)} kg·m, so x = ${n(10 * m)} ÷ ${n(M)} = ${n(x)} m.`, [['Centre of mass x (m)', x], ['Total mass (kg)', M], ['Σmx (kg·m)', 10 * m]]); },
 /* A flywheel at 60k rpm (k from 1 to 10): ω = 2πk rad/s, asked to 2 decimal places. */
 q35: t => { t = T(t); const k = 1 + (t + 10) % 10, N = 60 * k, w = Math.round(2 * Math.PI * k * 100) / 100;
  return { ...E('Predict the angular velocity in radians per second, to 2 decimal places.', `ω = ${n(N)} × 2π ÷ 60 = ${n(2 * k)}π ≈ ${n(w)} rad/s, and the flywheel makes ${n(k)} turns each second.`, [['Angular velocity (rad/s)', w], ['Turns per second', k], ['rpm', N]]), tolerance: 0.005 }; },
 /* Two 5 kg weights at r = 0.2k m (k from 1 to 5): I = 10r². */
 q36: t => { t = T(t); const k = 1 + (t + 10) % 5, r = 0.2 * k, I = 10 * r * r;
  return E('Predict the moment of inertia about the axle, in kg·m².', `I = Σmr² = 5 × ${n(r)}² + 5 × ${n(r)}² = 10 × ${n(r * r)} = ${n(I)} kg·m². At 4 rad/s its rotational kinetic energy would be ½ × ${n(I)} × 16 = ${n(8 * I)} J.`, [['Moment of inertia (kg·m²)', I], ['Distance from the axle (m)', r], ['Rotational kinetic energy at 4 rad/s (J)', 8 * I]]); },
 /* A pull of 8k N at right angles to a spanner, 0.5 m from the axle, on a flywheel with I = 4 kg·m²: α = k. */
 q37: t => { t = T(t); const k = 1 + (t + 10) % 10, F = 8 * k, tau = 0.5 * F, al = tau / 4;
  return E('Predict the angular acceleration, in radians per second squared.', `τ = rF sin θ = 0.5 × ${n(F)} × 1 = ${n(tau)} N·m, and α = τ ÷ I = ${n(tau)} ÷ 4 = ${n(al)} rad/s².`, [['Angular acceleration (rad/s²)', al], ['Torque (N·m)', tau], ['Force (N)', F]]); },
 /* Flywheel I = 6 kg·m² at 12 rad/s; a resting wheel of I_B from a list locks on: ω = 72 ÷ (6 + I_B). */
 q38: t => { t = T(t); const IB = [2, 3, 6, 12, 18, 30][(t + 10) % 6], I2 = 6 + IB, w = 72 / I2;
  return E('Predict the common angular velocity after the wheels lock, in radians per second.', `L = 6 × 12 = 72 kg·m²/s. Afterwards I = 6 + ${n(IB)} = ${n(I2)} kg·m², so ω = 72 ÷ ${n(I2)} = ${n(w)} rad/s.`, [['Common angular velocity (rad/s)', w], ['Moment of inertia after (kg·m²)', I2], ['Angular momentum (kg·m²/s)', 72]]); },
 /* A planet with GM = 4 × 10¹⁴ m³/s²; orbit radii chosen so the speed is a whole number of m/s. */
 q39: t => { t = T(t); const [rk, v] = [[25000, 4000], [16000, 5000], [6250, 8000], [4000, 10000]][(t + 10) % 4];
  return E('Predict the orbital speed, in metres per second.', `v = √(GM ÷ r) = √(4 × 10¹⁴ ÷ (${n(rk)} × 1000)) = ${n(v)} m/s.`, [['Orbital speed (m/s)', v], ['Orbit radius (km)', rk], ['Period (s)', Math.round(2 * Math.PI * rk * 1000 / v)]]); },
 /* A latched pair moving at 1.4k m/s (k from 1 to 10) coasts up a frictionless ramp: h = v² ÷ 19.6 = 0.1k². */
 q40: t => { t = T(t); const k = 1 + (t + 10) % 10, v = 1.4 * k, h = 0.1 * k * k;
  return E('Predict the height the pair climbs, in metres.', `½Mv² = Mgh, so h = v² ÷ (2 × 9.8) = ${n(v * v)} ÷ 19.6 = ${n(h)} m.`, [['Height climbed (m)', h], ['Speed (m/s)', v], ['Kinetic energy per kilogram (J/kg)', v * v / 2]]); },
});
})();
