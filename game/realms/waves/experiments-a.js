/* Waves: sound and light concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
/* A value rounded to d places, and the same value as text with all its places. */
const R = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const F = (x, d) => R(x, d).toFixed(d);
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* q01: N swings in 20 s, N from 4 to 24; f = N ÷ 20 has at most two decimals. */
 q01: t => { t = T(t); const N = 14 + t, f = N / 20;
  return E('Predict the frequency of the swing, in hertz.', `The frequency is the number of swings per second: f = ${n(N)} ÷ 20 = ${n(f)} Hz. The period is 20 ÷ ${n(N)} ≈ ${n(20 / N)} s, and 1 ÷ ${n(f)} gives the same.`, [['Frequency (Hz)', f], ['Period (s)', Math.round(20000 / N) / 1000]]); },
 /* q02: k = 200 N/m, m from 0.5 to 4 kg in steps of 0.5; ω = √(k/m) to 2 decimal places. */
 q02: t => { t = T(t); const m = 0.5 * (1 + (t + 10) % 8), w = Math.sqrt(200 / m), wr = R(w, 2);
  return { ...E('Predict the angular frequency ω, in radians per second to 2 decimal places.', `ω = √(k/m) = √(200 ÷ ${n(m)}) ≈ ${F(w, 2)} rad/s. The period is 2π ÷ ω ≈ ${F(2 * Math.PI / w, 2)} s.`, [['ω (rad/s)', wr], ['Period (s)', R(2 * Math.PI / w, 2)]]), tolerance: 0.005 }; },
 /* q03: A = 0.2 m, ω from 2 to 10 rad/s; the greatest speed Aω is exact. */
 q03: t => { t = T(t); const w = 2 + (t + 10) % 9, vm = R(0.2 * w, 4);
  return E('Predict the greatest speed of the mass, in m/s.', `The velocity is −Aω sin(ωt + φ), and the sine is at most 1 in size, so the greatest speed is Aω = 0.2 × ${n(w)} = ${n(vm)} m/s. The greatest acceleration is Aω² = ${n(R(0.2 * w * w, 4))} m/s².`, [['Greatest speed (m/s)', vm], ['Greatest acceleration (m/s²)', R(0.2 * w * w, 4)]]); },
 /* q04: k = 100 N/m, A = 0.3 m, m = 1 kg, x from 0 to 0.27 m in steps of 0.03; v = √(k(A² − x²)/m) to 2 places. */
 q04: t => { t = T(t); const x = R(0.03 * ((t + 10) % 10), 2), K = R(50 * (0.09 - x * x), 4), v = Math.sqrt(2 * K);
  return { ...E('Predict the speed of the mass at that point, in m/s to 2 decimal places.', `The total energy is ½ × 100 × 0.3² = 4.5 J. At x = ${n(x)} m the spring holds ½ × 100 × ${n(R(x * x, 4))} = ${n(R(4.5 - K, 4))} J, leaving ${n(K)} J of kinetic energy, so v = √(2 × ${n(K)} ÷ 1) ≈ ${F(v, 2)} m/s.`, [['Speed (m/s)', R(v, 2)], ['Kinetic energy (J)', K]]), tolerance: 0.005 }; },
 /* q05: L from 0.25 to 3 m in steps of 0.25, g = 9.8 m/s²; T = 2π√(L/g) to 2 places. */
 q05: t => { t = T(t); const L = 0.25 * (1 + (t + 10) % 12), Tp = 2 * Math.PI * Math.sqrt(L / 9.8);
  return { ...E('Predict the period of the pendulum, in seconds to 2 decimal places.', `T = 2π√(L/g) = 2π√(${n(L)} ÷ 9.8) ≈ 2π × ${n(R(Math.sqrt(L / 9.8), 4))} ≈ ${F(Tp, 2)} s. The mass of the bob does not enter.`, [['Period (s)', R(Tp, 2)], ['Length (m)', L]]), tolerance: 0.005 }; },
 /* q06: A₀ = 10 cm, b = 0.4 kg/s, m = 2 kg, after 1 to 21 s: A = 10e^(−0.1t) to 2 places. */
 q06: t => { t = T(t); const s = 11 + t, A = 10 * Math.exp(-0.1 * s);
  return { ...E('Predict the amplitude at that time, in cm to 2 decimal places.', `bt/2m = 0.4 × ${n(s)} ÷ 4 = ${n(R(0.1 * s, 4))}, so A = 10e^(−${n(R(0.1 * s, 4))}) ≈ ${F(A, 2)} cm.`, [['Amplitude (cm)', R(A, 2)], ['bt/2m', R(0.1 * s, 4)]]), tolerance: 0.005 }; },
 /* q07: f = 5 Hz, λ from 0.5 to 5 m in steps of 0.5; v = fλ is exact. */
 q07: t => { t = T(t); const lam = 0.5 * (1 + (t + 10) % 10), v = R(5 * lam, 4);
  return E('Predict the speed of the wave, in m/s.', `v = fλ = 5 × ${n(lam)} = ${n(v)} m/s: in each period of 0.2 s the wave moves on one wavelength.`, [['Wave speed (m/s)', v], ['Wavelength (m)', lam]]); },
 /* q08: λ from 0.5 to 5 m in steps of 0.5; k = 2π/λ to 3 places. */
 q08: t => { t = T(t); const lam = 0.5 * (1 + (t + 10) % 10), k = 2 * Math.PI / lam;
  return { ...E('Predict the wave number k, in rad/m to 3 decimal places.', `k = 2π/λ = 2π ÷ ${n(lam)} ≈ ${F(k, 3)} rad/m: one wavelength of ${n(lam)} m is an angle of 2π radians.`, [['Wave number (rad/m)', R(k, 3)], ['Wavelength (m)', lam]]), tolerance: 0.0005 }; },
 /* q09: μ = 0.02 kg/m, tension from 20 to 200 N in steps of 20; v = √(F_T/μ) to 2 places. */
 q09: t => { t = T(t); const F0 = 20 * (1 + (t + 10) % 10), v = Math.sqrt(F0 / 0.02);
  return { ...E('Predict the wave speed, in m/s to 2 decimal places.', `v = √(F_T/μ) = √(${n(F0)} ÷ 0.02) = √${n(F0 / 0.02)} ≈ ${F(v, 2)} m/s.`, [['Wave speed (m/s)', R(v, 2)], ['Tension (N)', F0]]), tolerance: 0.005 }; },
 /* q10: 1 W/m² at 2 m from a horn; the intensity at r from 3 to 12 m is 4 ÷ r², to 4 places. */
 q10: t => { t = T(t); const r = 3 + (t + 10) % 10, I = 4 / (r * r);
  return { ...E('Predict the intensity at that distance, in W/m² to 4 decimal places.', `The intensity falls as 1/r², so I = 1 × (2 ÷ ${n(r)})² = 4 ÷ ${n(r * r)} ≈ ${F(I, 4)} W/m².`, [['Intensity (W/m²)', R(I, 4)], ['Distance (m)', r]]), tolerance: 0.00005 }; },
});
})();
