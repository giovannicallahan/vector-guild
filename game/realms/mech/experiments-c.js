/* Mechanics: motion and force concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Targets that must be rounded are rounded to 2 decimal places and the model carries tolerance 0.005; its prompt says so. */
const r2 = x => Math.round(x * 100) / 100, E2 = (prompt, formula, values) => ({ ...E(prompt, formula, values), tolerance: 0.005 });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A 60 kg sled (weight 588 N) on a ramp at 0.1 to 0.8 rad. */
 q21: t => { t = T(t); const th = (1 + (t + 10) % 8) / 10, along = r2(588 * Math.sin(th)), normal = r2(588 * Math.cos(th));
  return E2('Predict the part of the weight along the ramp, in newtons to 2 decimal places.', `w = 60 × 9.8 = 588 N. Along the ramp: 588 × sin ${n(th)} ≈ ${n(along)} N. Into the ramp: 588 × cos ${n(th)} ≈ ${n(normal)} N.`, [['Along the ramp (N)', along], ['Normal force (N)', normal]]); },
 /* A 40 kg crate set down on a ramp at 0.1 to 1.1 rad with μs = 0.5 and μk = 0.3: it holds while tan θ ≤ 0.5 (θ up to 0.45 here). */
 q22: t => { t = T(t); const th = (2 + (t + 10)) / 20, N = 392 * Math.cos(th), along = 392 * Math.sin(th), holds = along <= 0.5 * N, a = holds ? 0 : r2((along - 0.3 * N) / 40);
  return E2('Predict the crate’s acceleration down the ramp in m/s², to 2 decimal places (0 if it stays put).', `N = 392 × cos ${n(th)} ≈ ${n(r2(N))} N, so static friction can give up to ≈ ${n(r2(0.5 * N))} N. The pull along the ramp is ≈ ${n(r2(along))} N. ` + (holds ? 'That is within reach of static friction, so the crate stays put: a = 0.' : `That is more, so it slides with kinetic friction ≈ ${n(r2(0.3 * N))} N: a ≈ (${n(r2(along))} − ${n(r2(0.3 * N))}) ÷ 40 ≈ ${n(a)} m/s².`), [['Acceleration (m/s²)', a], ['Pull along the ramp (N)', r2(along)], ['Greatest static friction (N)', r2(0.5 * N)]]); },
 /* A 30 kg crate pulled up a 0.3 rad ramp (μk = 0.2) by a counterweight of 20 to 60 kg. */
 q23: t => { t = T(t); const m2 = 20 + 2 * (t + 10), down = 30 * 9.8 * Math.sin(0.3) + 0.2 * 30 * 9.8 * Math.cos(0.3), a = (m2 * 9.8 - down) / (30 + m2), ar = r2(a);
  return E2('Predict the acceleration of the pair in m/s², to 2 decimal places.', `Down the slope on the crate: gravity and friction, ≈ ${n(r2(down))} N in all. The counterweight pulls with ${n(m2 * 9.8)} N. a = (${n(m2 * 9.8)} − ${n(r2(down))}) ÷ ${n(30 + m2)} ≈ ${n(ar)} m/s². Tension ≈ ${n(r2(m2 * (9.8 - a)))} N.`, [['Acceleration (m/s²)', ar], ['Tension (N)', r2(m2 * (9.8 - a))]]); },
 /* Greatest safe speed on a flat track with μs = 0.5 and radius 20 to 220 m. */
 q24: t => { t = T(t); const r = 20 + 10 * (t + 10), v = r2(Math.sqrt(0.5 * 9.8 * r));
  return E2('Predict the greatest speed without skidding, in m/s to 2 decimal places.', `mv² ÷ r = μs mg, so v = √(μs g r) = √(0.5 × 9.8 × ${n(r)}) = √${n(4.9 * r)} ≈ ${n(v)} m/s.`, [['Greatest speed (m/s)', v], ['v² (m²/s²)', Math.round(4.9 * r * 10) / 10]]); },
 /* An 80 kg pod (weight 784 N) with drag constant 0.05 to 0.25 kg/m. */
 q25: t => { t = T(t); const b = (5 + (t + 10)) / 100, v = r2(Math.sqrt(784 / b));
  return E2('Predict the terminal speed, in m/s to 2 decimal places.', `At terminal speed bv² = mg = 784 N, so v = √(784 ÷ ${n(b)}) ≈ ${n(v)} m/s.`, [['Terminal speed (m/s)', v], ['Weight (N)', 784]]); },
 /* Work of F(x) = 6x² + 4x from 0 to X, X from 1 to 8 m: 2X³ + 2X². */
 q26: t => { t = T(t); const X = 1 + (t + 10) % 8, W = 2 * X * X * X + 2 * X * X;
  return E('Predict the work the ram does, in joules.', `An antiderivative of 6x² + 4x is 2x³ + 2x². At x = ${n(X)} it is ${n(W)}, and at x = 0 it is 0, so W = ${n(W)} J.`, [['Work (J)', W], ['Force at the end (N)', 6 * X * X + 4 * X]]); },
 /* A 40 kg sled at 5 m/s (K = 500 J) receives net work 40t J. */
 q27: t => { t = T(t); const W = 40 * t, K = 500 + W, v = r2(Math.sqrt(K / 20));
  return E2('Predict the sled’s final speed, in m/s to 2 decimal places.', `K before = ½ × 40 × 25 = 500 J. K after = 500 ${W < 0 ? '−' : '+'} ${n(Math.abs(W))} = ${n(K)} J. v = √(2 × ${n(K)} ÷ 40) ≈ ${n(v)} m/s.`, [['Final speed (m/s)', v], ['Final kinetic energy (J)', K]]); },
 /* A 50 kg crate lifted 12 m (5880 J) in 5 to 25 s. */
 q28: t => { t = T(t); const s = 15 + t, P = r2(5880 / s);
  return E2('Predict the crane’s average power, in watts to 2 decimal places.', `W = mgh = 50 × 9.8 × 12 = 5880 J. P = 5880 ÷ ${n(s)} ≈ ${n(P)} W.`, [['Average power (W)', P], ['Work (J)', 5880]]); },
 /* A 50 kg sled from rest, μk = 0.2 (friction 98 N), 10 m, pull 150 to 350 N. */
 q29: t => { t = T(t); const F = 150 + 10 * (t + 10), Wn = 10 * (F - 98), v = r2(Math.sqrt(2 * Wn / 50));
  return E2('Predict the sled’s speed at the end of the pull, in m/s to 2 decimal places.', `Winch work ${n(10 * F)} J, friction work −980 J, net ${n(Wn)} J = ½ × 50 × v², so v = √(${n(2 * Wn)} ÷ 50) ≈ ${n(v)} m/s.`, [['End speed (m/s)', v], ['Net work (J)', Wn]]); },
 /* A spring with k = 800 N/m squeezed 0.05 to 0.5 m. */
 q30: t => { t = T(t); const x = (1 + (t + 10) % 10) / 20, U = Math.round(400 * x * x * 100) / 100;
  return E('Predict the energy stored in the spring, in joules.', `U = ½kx² = ½ × 800 × ${n(x)}² = 400 × ${n(Math.round(x * x * 10000) / 10000)} = ${n(U)} J.`, [['Stored energy (J)', U], ['Spring force (N)', Math.round(800 * x * 100) / 100]]); },
});
})();
