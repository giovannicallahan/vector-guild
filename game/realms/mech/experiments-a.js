/* Mechanics: motion and force concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* V = 9k km/h for k from 2 to 10: the speed V ÷ 3.6 is a multiple of 2.5 m/s. */
 q01: t => { t = T(t); const V = 9 * (2 + (t + 10) % 9), ms = V / 3.6;
  return E('Predict the rover’s speed in metres per second.', `${n(V)} km/h × (1000 m ÷ 1 km) × (1 h ÷ 3600 s) = ${n(V * 1000)} m ÷ 3600 s = ${n(ms)} m/s.`, [['Speed (m/s)', ms], ['Metres per hour', V * 1000]]); },
 /* A pulse of m × 10⁻⁵ s with m from 1.5 to 9.5: in microseconds it is 10m. */
 q02: t => { t = T(t); const a = 15 + 10 * ((t + 10) % 9), m = a / 10;
  return E('Predict the length of the pulse in microseconds (μs).', `One microsecond is 10⁻⁶ s, so ${n(m)} × 10⁻⁵ s ÷ 10⁻⁶ = ${n(m)} × 10¹ = ${n(a)} μs.`, [['Pulse (μs)', a], ['Pulse (ms)', a / 1000]]); },
 /* A marker 20 m away at 0.3(t + 11) radians, rounded to 2 decimal places. */
 q03: t => { t = T(t); const th = Math.round(3 * (t + 11)) / 10, x = 20 * Math.cos(th), X = Math.round(x * 100) / 100, Y = Math.round(20 * Math.sin(th) * 100) / 100;
  return { ...E('Predict the x component of the marker’s position, in metres to 2 decimal places.', `The x component is 20 × cos ${n(th)} ≈ 20 × ${par(Math.cos(th))} ≈ ${n(x)}, which is ${n(X)} m to 2 decimal places. The y component is about ${n(Y)} m.`, [['x component (m)', X], ['y component (m)', Y]]), tolerance: 0.005 }; },
 /* A = 3î + 4ĵ and B = kî + 2ĵ with k = t: R = (3 + k)î + 6ĵ; its magnitude to 2 decimal places. */
 q04: t => { t = T(t); const x = 3 + t, m = Math.hypot(x, 6), M = Math.round(m * 100) / 100;
  return { ...E('Predict the magnitude of the resultant, in metres to 2 decimal places.', `R = A + B has Rx = 3 + ${par(t)} = ${n(x)} and Ry = 4 + 2 = 6. Its magnitude is √(${n(x * x)} + 36) = √${n(x * x + 36)} ≈ ${n(m)}, which is ${n(M)} m.`, [['Magnitude (m)', M], ['Rx (m)', x], ['Ry (m)', 6]]), tolerance: 0.005 }; },
 /* A = 3î − 2ĵ and B = kî + 4ĵ with k = t: A · B = 3k − 8. */
 q05: t => { t = T(t); const d = 3 * t - 8;
  return E('Predict the dot product A · B, in square metres.', `A · B = 3 × ${par(t)} + (−2) × 4 = ${n(3 * t)} − 8 = ${n(d)} m².`, [['A · B (m²)', d], ['AxBx (m²)', 3 * t]]); },
 /* A sled from x = 0 up to x = 20 m, then back to x = 2t m, in 4 seconds. Average velocity 2t ÷ 4. */
 q06: t => { t = T(t); const x = 2 * t, v = x / 4, d = 20 + Math.abs(20 - x);
  return E('Predict the sled’s average velocity over the trip, in metres per second.', `The displacement is ${n(x)} − 0 = ${n(x)} m, so the average velocity is ${n(x)} ÷ 4 = ${n(v)} m/s. (The distance travelled is 20 + ${n(Math.abs(20 - x))} = ${n(d)} m, which does not enter.)`, [['Average velocity (m/s)', v], ['Displacement (m)', x], ['Distance (m)', d]]); },
 /* x(t) = 10 + 4t + 3t² − t³, so v(t) = 4 + 6t − 3t², at a moment from 0 to 5 s. */
 q07: t => { t = T(t); const s = (t + 10) % 6, v = 4 + 6 * s - 3 * s * s;
  return E('Predict the sled’s velocity at that moment, in metres per second.', `v(t) = dx/dt = 4 + 6t − 3t², so v(${n(s)}) = 4 + ${n(6 * s)} − ${n(3 * s * s)} = ${n(v)} m/s.`, [['Velocity (m/s)', v], ['Speed (m/s)', Math.abs(v)]]); },
 /* v(t) = 2t² − 3t + 5, so a(t) = 4t − 3, at a moment from 0 to 20 s. */
 q08: t => { t = T(t); const s = t + 10, a = 4 * s - 3;
  return E('Predict the instantaneous acceleration at that moment, in m/s².', `a(t) = dv/dt = 4t − 3, so a(${n(s)}) = ${n(4 * s)} − 3 = ${n(a)} m/s².`, [['Acceleration (m/s²)', a], ['Velocity (m/s)', 2 * s * s - 3 * s + 5]]); },
 /* Braking from 2(t + 12) m/s at 2 m/s²: the stopping distance v₀² ÷ 4 is (t + 12)². */
 q09: t => { t = T(t); const v0 = 2 * (t + 12), d = v0 * v0 / 4;
  return E('Predict the stopping distance, in metres.', `v² = v₀² + 2a(x − x₀) with v = 0 and a = −2 gives x − x₀ = ${n(v0 * v0)} ÷ 4 = ${n(d)} m. It takes ${n(v0)} ÷ 2 = ${n(v0 / 2)} s.`, [['Stopping distance (m)', d], ['Stopping time (s)', v0 / 2]]); },
 /* Thrown up at 4.9(t + 12) m/s from 10 m: the greatest height 10 + v₀² ÷ 19.6 = 10 + 1.225(t + 12)² has at most 3 decimals. */
 q10: t => { t = T(t); const k = t + 12, v0 = 4.9 * k, rise = 1.225 * k * k, H = Math.round((10 + rise) * 1000) / 1000;
  return E('Predict the pod’s greatest height above the ground, in metres.', `The rise above the hand is v₀² ÷ (2g) = ${n(v0)}² ÷ 19.6 = ${n(rise)} m, so the greatest height is 10 + ${n(rise)} = ${n(H)} m, reached after ${n(v0)} ÷ 9.8 = ${n(k / 2)} s.`, [['Greatest height (m)', H], ['Time to the top (s)', k / 2]]); },
});
})();
