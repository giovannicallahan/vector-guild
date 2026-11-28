/* Calculus 3: many variables concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* From (1, 2, 0) to (1 + 2k, 2 + 3k, 6k), k from 1 to 7: the distance is 7k. */
 q01: t => { t = T(t); const k = 1 + (t + 10) % 7;
  return E('Predict the distance between the two beacons, in metres.', `The changes are ${n(2 * k)}, ${n(3 * k)} and ${n(6 * k)}. Squared and added: ${n(4 * k * k)} + ${n(9 * k * k)} + ${n(36 * k * k)} = ${n(49 * k * k)}, and √${n(49 * k * k)} = ${n(7 * k)} metres.`, [['Distance (m)', 7 * k], ['Change in z (m)', 6 * k], ['Sum of squares', 49 * k * k]]); },
 /* s·u − v with u = ⟨3, −1, 2⟩ and v = ⟨1, 4, −2⟩: the x component is 3s − 1. */
 q02: t => { t = T(t);
  return E('Predict the x component of su − v.', `su = ⟨${n(3 * t)}, ${n(-t)}, ${n(2 * t)}⟩. Subtracting v component by component: su − v = ⟨${n(3 * t - 1)}, ${n(-t - 4)}, ${n(2 * t + 2)}⟩.`, [['x component', 3 * t - 1], ['y component', -t - 4], ['z component', 2 * t + 2]]); },
 /* ⟨2k, 3k, 6k⟩ for k from 1 to 10: the magnitude is 7k. */
 q03: t => { t = T(t); const k = 1 + (t + 10) % 10;
  return E('Predict the magnitude ‖v‖.', `‖v‖ = √(${n(4 * k * k)} + ${n(9 * k * k)} + ${n(36 * k * k)}) = √${n(49 * k * k)} = ${n(7 * k)}. The unit vector is ⟨2/7, 3/7, 6/7⟩ whatever k is.`, [['Magnitude', 7 * k], ['Unit x', 2 / 7], ['Unit z', 6 / 7]]); },
 /* u = ⟨1, 2, 2⟩ and v = ⟨t, 3, −2⟩: u · v = t + 2. */
 q04: t => { t = T(t); const d = t + 2, lv = Math.sqrt(t * t + 13), th = Math.acos(d / (3 * lv));
  return E('Predict the dot product u · v.', `u · v = 1 × ${par(t)} + 2 × 3 + 2 × (−2) = ${n(t)} + 6 − 4 = ${n(d)}. ${d === 0 ? 'It is 0, so the vectors are orthogonal.' : d > 0 ? 'It is positive, so the angle is below π/2.' : 'It is negative, so the angle is above π/2.'}`, [['u · v', d], ['‖u‖', 3], ['Angle (rad)', Math.round(th * 1000) / 1000]]); },
 /* F = ⟨4, 2, k⟩ newtons along d = ⟨3, 0, 4⟩ metres: the work is 12 + 4k joules. */
 q05: t => { t = T(t); const W = 12 + 4 * t;
  return E('Predict the work F · d, in joules.', `F · d = 4 × 3 + 2 × 0 + ${par(t)} × 4 = ${n(W)} joules. ‖d‖ = 5, so the scalar projection is ${n(W)} ÷ 5 = ${n(W / 5)} newtons.`, [['Work (J)', W], ['Scalar projection (N)', W / 5], ['‖d‖ (m)', 5]]); },
 /* u = ⟨2, 1, 0⟩ and v = ⟨1, t, 3⟩: u × v = ⟨3, −6, 2t − 1⟩. */
 q06: t => { t = T(t); const z = 2 * t - 1;
  return E('Predict the z component of u × v.', `x: 1 × 3 − 0 × ${par(t)} = 3. y: 0 × 1 − 2 × 3 = −6. z: 2 × ${par(t)} − 1 × 1 = ${n(z)}. So u × v = ⟨3, −6, ${n(z)}⟩.`, [['z component', z], ['x component', 3], ['y component', -6]]); },
 /* The line (2, −1, 0) + s⟨3, 1, 2⟩ at s = t: x = 2 + 3t. */
 q07: t => { t = T(t);
  return E('Predict the x coordinate of the point at that value of t.', `x = 2 + 3 × ${par(t)} = ${n(2 + 3 * t)}, y = −1 + ${par(t)} = ${n(t - 1)} and z = 2 × ${par(t)} = ${n(2 * t)}.`, [['x', 2 + 3 * t], ['y', t - 1], ['z', 2 * t]]); },
 /* P(1, 0, 0), Q(0, 2, 0), R(0, 0, k) with k from 1 to 21: n = PQ × PR = ⟨2k, k, 2⟩ and d = 2k. */
 q08: t => { t = T(t); const k = t + 11;
  return E('Predict d in the plane’s equation ax + by + cz = d, with ⟨a, b, c⟩ = PQ × PR.', `PQ = ⟨−1, 2, 0⟩ and PR = ⟨−1, 0, ${n(k)}⟩. n = ⟨2 × ${n(k)} − 0, 0 − (−1) × ${n(k)}, 0 − 2 × (−1)⟩ = ⟨${n(2 * k)}, ${n(k)}, 2⟩. d = n · P = ${n(2 * k)} × 1 = ${n(2 * k)}.`, [['d', 2 * k], ['a', 2 * k], ['b', k]]); },
 /* The point (t, 1, 1) and the plane 2x + y + 2z = 4: the distance is |2t − 1| ÷ 3, rounded to 2 decimals. */
 q09: t => { t = T(t); const v = 2 * t - 1, D = Math.round(Math.abs(v) / 3 * 100) / 100;
  return { ...E('Predict the distance from the point to the plane, rounded to 2 decimal places.', `2 × ${par(t)} + 1 + 2 × 1 − 4 = ${n(v)}. ‖n‖ = √(4 + 1 + 4) = 3, so the distance is ${n(Math.abs(v))} ÷ 3, which is ${n(D)} to 2 decimal places.`, [['Distance', D], ['Value at the point', v], ['‖n‖', 3]]), ...(Number.isInteger(D) ? {} : { tolerance: 0.005 }) }; },
 /* r(t) = ⟨2t², 5t, t³⟩ at a time s from 1 to 5: the z velocity is 3s². */
 q10: t => { t = T(t); const s = 1 + (t + 10) % 5, vx = 4 * s, vz = 3 * s * s;
  return E('Predict the z component of the velocity at that time, in metres per second.', `v(t) = ⟨4t, 5, 3t²⟩, so v(${n(s)}) = ⟨${n(vx)}, 5, ${n(vz)}⟩ m/s.`, [['z velocity (m/s)', vz], ['x velocity (m/s)', vx], ['Speed (m/s)', Math.round(Math.hypot(vx, 5, vz) * 100) / 100]]); },
});
})();
