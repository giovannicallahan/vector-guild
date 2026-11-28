/* Mechanics: motion and force concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* a(t) = 2 + 3t m/s², v(0) = 4 m/s, x(0) = 10 m, at a time T from 2 to 6 s: v = 4 + 2T + 1.5T², x = 10 + 4T + T² + 0.5T³. */
 q11: t => { t = T(t); const s = 2 + (t + 10) % 5, v = 4 + 2 * s + 1.5 * s * s, x = 10 + 4 * s + s * s + 0.5 * s * s * s;
  return E('Predict the sled’s velocity at that time, in metres per second.', `Integrating a(t) = 2 + 3t and adding v(0) = 4 gives v(t) = 4 + 2t + 1.5t². At t = ${n(s)}: v = 4 + ${n(2 * s)} + ${n(1.5 * s * s)} = ${n(v)} m/s. Integrating again and adding x(0) = 10 gives x(t) = 10 + 4t + t² + 0.5t³, so x = ${n(x)} m.`, [['Velocity (m/s)', v], ['Position (m)', x]]); },
 /* Horizontal launch from h = 4.9τ² m (τ from 1 to 4 s, so the fall time is exactly τ) at u from 5 to 11 m/s: distance uτ. */
 q12: t => { t = T(t); const tau = 1 + (t + 10) % 4, h = 4.9 * tau * tau, u = 5 + (t + 10) % 7, x = u * tau;
  return E('Predict how far from the foot of the platform the pod lands, in metres.', `${n(h)} = ½ × 9.8 × t² gives t² = ${n(tau * tau)}, so the pod falls for ${n(tau)} s. Sideways it keeps ${n(u)} m/s, so it lands ${n(u)} × ${n(tau)} = ${n(x)} m out.`, [['Distance (m)', x], ['Time in the air (s)', tau], ['Height (m)', h]]); },
 /* Level-ground launch at 0.5 radians and v from 10 to 30 m/s: range v² sin 1 ÷ 9.8, to 2 decimal places. */
 q13: t => { t = T(t); const v = 20 + t, R = v * v * Math.sin(1) / 9.8, H = Math.pow(v * Math.sin(0.5), 2) / 19.6;
  return { ...E('Predict the range on level ground, in metres to 2 decimal places.', `Range = v² sin(2θ) ÷ g = ${n(v * v)} × sin 1 ÷ 9.8 ≈ ${n(v * v)} × ${n(Math.sin(1))} ÷ 9.8 ≈ ${n(R)}, which is ${n(Math.round(R * 100) / 100)} m. The greatest height is (${n(v)} × sin 0.5)² ÷ 19.6 ≈ ${n(Math.round(H * 100) / 100)} m.`, [['Range (m)', Math.round(R * 100) / 100], ['Greatest height (m)', Math.round(H * 100) / 100]]), tolerance: 0.005 }; },
 /* Steady speed v from 2 to 10 m/s on a circle of radius 4 m: centripetal acceleration v² ÷ 4. */
 q14: t => { t = T(t); const v = 2 + (t + 10) % 9, a = v * v / 4;
  return E('Predict the size of the centripetal acceleration, in metres per second squared.', `a_c = v² ÷ r = ${n(v)}² ÷ 4 = ${n(v * v)} ÷ 4 = ${n(a)} m/s², pointing at the centre.`, [['Centripetal acceleration (m/s²)', a], ['Speed (m/s)', v]]); },
 /* Radius 5 m, speed v from 2 to 10 m/s, speeding up at 2 m/s²: total √((v² ÷ 5)² + 4), to 2 decimal places. */
 q15: t => { t = T(t); const v = 2 + (t + 10) % 9, ac = v * v / 5, tot = Math.hypot(ac, 2), r = Math.round(tot * 100) / 100;
  return { ...E('Predict the size of the total acceleration, in metres per second squared to 2 decimal places.', `Centripetal: ${n(v)}² ÷ 5 = ${n(ac)} m/s². Tangential: 2 m/s², at a right angle. Total: √(${n(ac)}² + 2²) ≈ ${n(tot)}, which is ${n(r)} m/s².`, [['Total acceleration (m/s²)', r], ['Centripetal acceleration (m/s²)', ac]]), tolerance: 0.005 }; },
 /* Rover (k, 2) m/s with k from 1 to 7 over the ground; wind measured from the rover (−3, 4) m/s. Ground wind (k − 3, 6). */
 q16: t => { t = T(t); const k = 1 + (t + 10) % 7, wx = k - 3, w = Math.hypot(wx, 6), r = Math.round(w * 100) / 100;
  return { ...E('Predict the wind’s speed over the ground, in metres per second to 2 decimal places.', `v_PG = v_PR + v_RG = (−3, 4) + (${n(k)}, 2) = (${n(wx)}, 6) m/s. Its speed is √(${n(wx * wx)} + 36) ≈ ${n(w)}, which is ${n(r)} m/s.`, [['Wind speed over the ground (m/s)', r], ['Wind x over the ground (m/s)', wx]]), tolerance: 0.005 }; },
 /* Release at v from 8 to 17 m/s, 0.7 radians up, onto level ground: range v² sin 1.4 ÷ 9.8, to 2 decimal places. */
 q17: t => { t = T(t); const v = 8 + (t + 10) % 10, R = v * v * Math.sin(1.4) / 9.8, r = Math.round(R * 100) / 100, ac = v * v / 3;
  return { ...E('Predict the range of the pod after release, in metres to 2 decimal places.', `On the sling the centripetal acceleration was ${n(v * v)} ÷ 3 ≈ ${n(ac)} m/s². After release it is a projectile: range = ${n(v * v)} × sin 1.4 ÷ 9.8 ≈ ${n(R)}, which is ${n(r)} m.`, [['Range (m)', r], ['Release speed (m/s)', v]]), tolerance: 0.005 }; },
 /* A 4 kg sled pulled east with F from 20 to 60 N and west with 8 N: a = (F − 8) ÷ 4. */
 q18: t => { t = T(t); const F = 40 + 2 * t, net = F - 8, a = net / 4;
  return E('Predict the size of the sled’s acceleration, in metres per second squared.', `ΣF = ${n(F)} − 8 = ${n(net)} N east. By Newton’s second law, a = ΣF ÷ m = ${n(net)} ÷ 4 = ${n(a)} m/s².`, [['Acceleration (m/s²)', a], ['Net force (N)', net]]); },
 /* A 60 kg crate in a cage with acceleration t ÷ 2 m/s² (up positive): F_N = 60(9.8 + a) = 588 + 30t. */
 q19: t => { t = T(t); const a = t / 2, N = 588 + 30 * t;
  return E('Predict the normal force the floor pushes up on the crate with, in newtons.', `Weight 60 × 9.8 = 588 N. F_N − 588 = 60 × ${par(a)} = ${n(30 * t)}, so F_N = ${n(N)} N.`, [['Normal force (N)', N], ['Weight (N)', 588], ['Acceleration (m/s²)', a]]); },
 /* Crane pull F from 500 to 700 N on a 30 kg crate with a 20 kg crate below: a = F ÷ 50 − 9.8, T = 0.4F. */
 q20: t => { t = T(t); const F = 600 + 10 * t, a = F / 50 - 9.8, Tn = 0.4 * F;
  return E('Predict the tension in the lower cable, in newtons.', `Both crates: 50 kg, weight 490 N, so a = (${n(F)} − 490) ÷ 50 = ${n(a)} m/s². Bottom crate: T = 20 × (9.8 + ${n(a)}) = ${n(Tn)} N.`, [['Lower cable tension (N)', Tn], ['Acceleration (m/s²)', a]]); },
});
})();
