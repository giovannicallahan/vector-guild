/* Waves: sound and light concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Rounding to k places, and float noise removed. */
const R = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k), W = x => R(x, 9);
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A 50 m cable of 4 kg (μ = 0.08 kg/m) at the tension that gives a speed of 40 to 80 m/s. */
 q11: t => { t = T(t); const v = 40 + 2 * (t + 10), F = W(0.08 * v * v), time = R(50 / v, 3);
  return E('Predict the wave speed on the cable, in m/s.', `μ = 4 ÷ 50 = 0.08 kg/m, so v = √(${n(F)} ÷ 0.08) = √${n(v * v)} = ${n(v)} m/s. A pulse takes 50 ÷ ${n(v)} ≈ ${n(time)} s to run the cable.`, [['Wave speed (m/s)', v], ['Linear mass density (kg/m)', 0.08], ['Travel time (s)', time]]); },
 /* Two 5 cm waves with a phase difference of 0.2 to 2.2 rad. */
 q12: t => { t = T(t); const phi = W(0.2 + 0.1 * (t + 10)), AR = R(10 * Math.cos(phi / 2), 2);
  return { ...E('Predict the amplitude of the combined wave, in cm to 2 decimal places.', `2A cos(φ ÷ 2) = 2 × 5 × cos(${n(W(phi / 2))}) ≈ ${n(AR)} cm.`, [['Combined amplitude (cm)', AR], ['Phase difference (rad)', phi]]), tolerance: 0.005 }; },
 /* A 1.2 m cable with waves at 180 m/s, in its 1st to 6th harmonic. */
 q13: t => { t = T(t); const h = 1 + (t + 10) % 6, lam = W(2.4 / h);
  return E('Predict the frequency of that harmonic, in Hz.', `λ = 2L ÷ n = 2.4 ÷ ${n(h)} ≈ ${n(lam)} m, and f = nv ÷ (2L) = ${n(h)} × 180 ÷ 2.4 = ${n(75 * h)} Hz.`, [['Frequency (Hz)', 75 * h], ['Harmonic number', h], ['Node spacing (m)', W(1.2 / h)]]); },
 /* Air from −20 to 40 °C in steps of 3 °C. */
 q14: t => { t = T(t); const Tc = -20 + 3 * (t + 10), v = R(331 * Math.sqrt(1 + Tc / 273), 2);
  return { ...E('Predict the speed of sound, in m/s to 2 decimal places.', `v = 331 × √(1 + ${par(Tc)} ÷ 273) ≈ ${n(v)} m/s.`, [['Speed of sound (m/s)', v], ['Temperature (°C)', Tc]]), tolerance: 0.005 }; },
 /* An intensity of k × 10⁻⁶ W/m² for k from 1 to 21. */
 q15: t => { t = T(t); const k = t + 11, b = R(10 * Math.log10(k) + 60, 1);
  return { ...E('Predict the sound intensity level, in dB to 1 decimal place.', `I ÷ I₀ = ${n(k)} × 10⁶, so β = 10 × (log₁₀ ${n(k)} + 6) ≈ ${n(b)} dB.`, [['Level (dB)', b], ['Intensity (millionths of a W/m²)', k]]), tolerance: 0.04 }; },
 /* A pipe closed at one end, 0.4 to 1.4 m long. */
 q16: t => { t = T(t); const L = W(0.4 + 0.05 * (t + 10)), f = R(343 / (4 * L), 2);
  return { ...E('Predict the fundamental frequency, in Hz to 2 decimal places.', `f₁ = v ÷ (4L) = 343 ÷ ${n(W(4 * L))} ≈ ${n(f)} Hz. The next harmonic is the 3rd, at about ${n(R(3 * 343 / (4 * L), 2))} Hz.`, [['Fundamental (Hz)', f], ['Pipe length (m)', L]]), tolerance: 0.005 }; },
 /* A 0.8 m string with waves at 200 m/s in its 1st to 4th harmonic, matched by an open pipe. */
 q17: t => { t = T(t); const h = 1 + (t + 10) % 4, f = 125 * h, L = R(343 / (2 * f), 3);
  return { ...E('Predict the length of the open pipe, in metres to 3 decimal places.', `The note is ${n(h)} × 200 ÷ 1.6 = ${n(f)} Hz, and an open pipe needs L = 343 ÷ (2 × ${n(f)}) ≈ ${n(L)} m.`, [['Pipe length (m)', L], ['Frequency of the note (Hz)', f]]), tolerance: 0.0005 }; },
 /* A 440 Hz fork and a pipe 0.5t Hz away. */
 q18: t => { t = T(t); const f2 = W(440 + 0.5 * t), fb = Math.abs(W(0.5 * t));
  return E('Predict the beat frequency, in Hz.', `f_beat = |440 − ${n(f2)}| = ${n(fb)} Hz.`, [['Beat frequency (Hz)', fb], ['Pipe frequency (Hz)', f2]]); },
 /* A 600 Hz siren approaching at 10 to 50 m/s. */
 q19: t => { t = T(t); const vs = 10 + 2 * (t + 10), f = R(600 * 343 / (343 - vs), 1);
  return { ...E('Predict the frequency heard while the rover approaches, in Hz to 1 decimal place.', `f_o = 600 × 343 ÷ (343 − ${n(vs)}) = 600 × 343 ÷ ${n(343 - vs)} ≈ ${n(f)} Hz.`, [['Heard frequency (Hz)', f], ['Rover speed (m/s)', vs]]), tolerance: 0.04 }; },
 /* A 750 Hz siren at 20 m/s and a listener at 5 to 25 m/s, moving towards each other. */
 q20: t => { t = T(t); const vo = 15 + t, f = R(750 * (343 + vo) / 323, 1);
  return { ...E('Predict the frequency Mira hears, in Hz to 1 decimal place.', `f_o = 750 × (343 + ${n(vo)}) ÷ (343 − 20) = 750 × ${n(343 + vo)} ÷ 323 ≈ ${n(f)} Hz.`, [['Heard frequency (Hz)', f], ['Mira’s speed (m/s)', vo]]), tolerance: 0.04 }; },
});
})();
