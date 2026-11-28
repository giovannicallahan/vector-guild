/* Waves: sound and light concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Drone at 400 to 1200 m/s, sound 343 m/s: the cone half-angle arcsin(343 ÷ vs), to 3 decimals. */
 q21: t => { t = T(t); const vs = 800 + 40 * t, M = Math.round(vs / 343 * 100) / 100, s = 343 / vs, th = Math.round(Math.asin(s) * 1000) / 1000;
  return E('Predict the half-angle of the shock cone, in radians to 3 decimal places.', `M = ${n(vs)} ÷ 343 ≈ ${n(M)}. sin θ = 343 ÷ ${n(vs)} ≈ ${n(s)}, so θ = arcsin(${n(s)}) ≈ ${n(th)} rad.`, [['Half-angle (rad)', th], ['Mach number', M]]); },
 /* Two speakers in phase at 686 Hz (λ = 0.5 m); the path difference is 0.25(t + 11) m, a whole or half number of wavelengths. */
 q22: t => { t = T(t); const dr = 0.25 * (t + 11), w = dr / 0.5, loud = (t + 11) % 2 === 0 ? 1 : 0;
  return E('Predict the path difference in wavelengths.', `λ = 343 ÷ 686 = 0.5 m, so ${n(dr)} m is ${n(dr)} ÷ 0.5 = ${n(w)} wavelengths: ${loud ? 'a whole number, so the spot is loud' : 'a whole number and a half, so the spot is quiet'}.`, [['Path difference (wavelengths)', w], ['Path difference (m)', dr], ['Loud (1) or quiet (0)', loud]]); },
 /* Heard 500 + 5t Hz approaching and 440 Hz leaving: the rover's speed 343(fa − 440) ÷ (fa + 440), to 1 decimal. */
 q23: t => { t = T(t); const fa = 500 + 5 * t, vs = 343 * (fa - 440) / (fa + 440), v1 = Math.round(vs * 10) / 10, fs = Math.round(fa * (343 - vs) / 343 * 10) / 10;
  return E('Predict the rover’s speed, in m/s to 1 decimal place.', `v_s = 343 × (${n(fa)} − 440) ÷ (${n(fa)} + 440) = 343 × ${n(fa - 440)} ÷ ${n(fa + 440)} ≈ ${n(v1)} m/s, and the siren’s own frequency is about ${n(fs)} Hz.`, [['Rover speed (m/s)', v1], ['Siren’s own frequency (Hz)', fs]]); },
 /* Vacuum wavelength 500 + 10t nm into crown glass, n = 1.52: the wavelength inside, to 1 decimal. */
 q24: t => { t = T(t); const lam = 500 + 10 * t, li = Math.round(lam / 1.52 * 10) / 10;
  return E('Predict the wavelength inside the glass, in nanometres to 1 decimal place.', `The frequency stays the same and the speed drops by the factor n = 1.52, so λ inside = ${n(lam)} ÷ 1.52 ≈ ${n(li)} nm. The speed in the glass is 3.00 ÷ 1.52 ≈ 1.974 × 10⁸ m/s.`, [['Wavelength inside (nm)', li], ['Speed in glass (10⁸ m/s)', 1.974]]); },
 /* Air into fresh water at 0.55 + 0.04t rad (0.15 to 0.95): the refracted angle, to 3 decimals. */
 q25: t => { t = T(t); const a = Math.round((0.55 + 0.04 * t) * 100) / 100, s = Math.sin(a) / 1.333, b = Math.round(Math.asin(s) * 1000) / 1000;
  return E('Predict the refracted angle from the normal, in radians to 3 decimal places.', `sin θ₂ = 1.00 × sin ${n(a)} ÷ 1.333 ≈ ${n(s)}, so θ₂ = arcsin(${n(s)}) ≈ ${n(b)} rad, smaller than ${n(a)} rad: the ray bends towards the normal.`, [['Refracted angle (rad)', b], ['Incident angle (rad)', a]]); },
 /* A material of index 1.30 + 0.05(t + 10) (1.30 to 2.30) against air: the critical angle, to 3 decimals. */
 q26: t => { t = T(t); const n1 = Math.round((1.3 + 0.05 * (t + 10)) * 100) / 100, s = 1 / n1, c = Math.round(Math.asin(s) * 1000) / 1000;
  return E('Predict the critical angle, in radians to 3 decimal places.', `sin θc = 1.00 ÷ ${n(n1)} ≈ ${n(s)}, so θc = arcsin(${n(s)}) ≈ ${n(c)} rad.`, [['Critical angle (rad)', c], ['Index of refraction', n1]]); },
 /* Unpolarised 200 W/m² through two filters at 0.15 + 0.05(t + 10) rad (0.15 to 1.15): the intensity after the second, to 2 decimals. */
 q27: t => { t = T(t); const a = Math.round((0.15 + 0.05 * (t + 10)) * 100) / 100, c2 = Math.cos(a) ** 2, I = Math.round(100 * c2 * 100) / 100;
  return E('Predict the intensity after the second filter, in W/m² to 2 decimal places.', `The first filter passes 200 ÷ 2 = 100 W/m². cos²(${n(a)}) ≈ ${n(c2)}, so the second passes 100 × ${n(c2)} ≈ ${n(I)} W/m².`, [['After filter 2 (W/m²)', I], ['After filter 1 (W/m²)', 100]]); },
 /* Converging lens f = 10 cm, lamp at 25 + t cm (15 to 35): the image distance 10d ÷ (d − 10), to 1 decimal. */
 q28: t => { t = T(t); const d = 25 + t, di = 10 * d / (d - 10), r = Math.round(di * 10) / 10, m = Math.round(-di / d * 100) / 100;
  return E('Predict the image distance, in centimetres to 1 decimal place.', `dᵢ = 10 × ${n(d)} ÷ (${n(d)} − 10) = ${n(10 * d)} ÷ ${n(d - 10)} ≈ ${n(r)} cm, a real image. m = −dᵢ ÷ d₀ ≈ ${n(m)}.`, [['Image distance (cm)', r], ['Magnification', m]]); },
 /* Target 2 cm tall at 31 + 2t cm (11 to 51, never 20) from a lens with f = 20 cm: the image height, to 2 decimals. */
 q29: t => { t = T(t); const d = 31 + 2 * t, di = 20 * d / (d - 20), h = Math.round(-2 * di / d * 100) / 100, r = Math.round(di * 10) / 10;
  return E('Predict the image height, in centimetres to 2 decimal places (negative if upside down).', `dᵢ = 20 × ${n(d)} ÷ (${n(d)} − 20) ≈ ${n(r)} cm. m = −dᵢ ÷ d₀, so hᵢ = 2 × m ≈ ${n(h)} cm${h < 0 ? ', upside down' : ', upright'}.`, [['Image height (cm)', h], ['Image distance (cm)', r]]); },
 /* Slits 5 μm apart, light of 600 + 10t nm (500 to 700): the first bright fringe arcsin(λ ÷ 5000), to 3 decimals. */
 q30: t => { t = T(t); const lam = 600 + 10 * t, s = lam / 5000, th = Math.round(Math.asin(s) * 1000) / 1000, top = Math.floor(5000 / lam - 1e-9);
  return E('Predict the angle of the first bright fringe (m = 1), in radians to 3 decimal places.', `d = 5 μm = 5000 nm. sin θ = 1 × ${n(lam)} ÷ 5000 = ${n(s)}, so θ = arcsin(${n(s)}) ≈ ${n(th)} rad. The highest order below sin θ = 1 is ${n(top)}.`, [['First bright fringe (rad)', th], ['Highest order', top]]); },
});
})();
