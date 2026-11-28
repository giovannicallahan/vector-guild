/* Electricity and magnetism: fields concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A proton at 2u × 10⁵ m/s in 0.25 T, u = t + 11 from 1 to 21: r = 8.35u mm exactly. */
 q31: t => { t = T(t); const u = t + 11, r = Math.round(835 * u) / 100;
  return E('Predict the radius of the proton\'s circle, in millimetres.', `r = mv/(qB) = (1.67 × 10⁻²⁷ × ${n(2 * u)} × 10⁵) ÷ (1.60 × 10⁻¹⁹ × 0.25) m = ${n(r)} mm.`, [['Radius (mm)', r], ['Speed (10⁵ m/s)', 2 * u]]); },
 /* A 2 m bar carrying u amperes, u from 1 to 21, at π/6 to a 0.5 T field: F = 0.5u N. */
 q32: t => { t = T(t); const u = t + 11, F = u / 2;
  return E('Predict the size of the force on the bar, in newtons.', `F = ILB sin θ = ${n(u)} × 2 × 0.5 × sin(π/6) = ${n(u)} × 0.5 = ${n(F)} N.`, [['Force (N)', F], ['Force at right angles (N)', u]]); },
 /* A wire carrying 5u amperes, u from 1 to 21; the field 4 cm away is 25u μT. */
 q33: t => { t = T(t); const u = t + 11, I = 5 * u, B = 25 * u;
  return E('Predict the field 4 cm from the wire, in microtesla.', `B = μ₀I/(2πr) = 2 × 10⁻⁷ × ${n(I)} ÷ 0.04 T = ${n(B)} μT.`, [['Field (μT)', B], ['Current (A)', I]]); },
 /* A solenoid of 1000 turns per metre carrying u amperes, u from 1 to 21: B = 4πu × 10⁻⁴ T, to 2 decimal places in mT. */
 q34: t => { t = T(t); const u = t + 11, B = Math.round(400 * Math.PI * u / 1000 * 100) / 100;
  return E('Predict the field inside the solenoid in millitesla, to 2 decimal places.', `B = μ₀nI = 4π × 10⁻⁷ × 1000 × ${n(u)} T ≈ ${n(B)} mT.`, [['Field (mT)', B], ['Current (A)', u]]); },
 /* A coil of 10u turns, u from 1 to 21, of 0.05 m², field rising by 40 mT in 0.5 s: emf 40u mV. */
 q35: t => { t = T(t); const u = t + 11, N = 10 * u, emf = 40 * u;
  return E('Predict the size of the induced emf, in millivolts.', `ΔΦ = 0.05 × 40 mT = 2 mWb per turn, so emf = ${n(N)} × 2 ÷ 0.5 = ${n(emf)} mV.`, [['Emf (mV)', emf], ['Turns', N]]); },
 /* A 100-turn coil of 0.05 m² in 0.2 T spinning at 10u rad/s, u from 1 to 21: peak emf 10u V. */
 q36: t => { t = T(t); const u = t + 11, w = 10 * u, e = 10 * u;
  return E('Predict the peak emf of the generator, in volts.', `NBAω = 100 × 0.2 × 0.05 × ${n(w)} = ${n(e)} V.`, [['Peak emf (V)', e], ['Angular speed (rad/s)', w]]); },
 /* A 200 mH coil with 4 Ω on a supply of 2u volts, u from 1 to 21: settled current u/2 A, energy 25u² mJ. */
 q37: t => { t = T(t); const u = t + 11, I = u / 2, U = 25 * u * u;
  return E('Predict the energy stored once the current has settled, in millijoules.', `The settled current is ${n(2 * u)} ÷ 4 = ${n(I)} A, so U = ½LI² = ½ × 0.2 × ${n(I)}² J = ${n(U)} mJ.`, [['Energy (mJ)', U], ['Settled current (A)', I]]); },
 /* A 10u mH inductor on a 50 Hz supply, u from 1 to 21: X_L = πu Ω, to 2 decimal places. */
 q38: t => { t = T(t); const u = t + 11, X = Math.round(Math.PI * u * 100) / 100;
  return E('Predict the inductor\'s reactance in ohms, to 2 decimal places.', `X_L = ωL = 2π × 50 × ${n(10 * u)} × 10⁻³ ≈ ${n(X)} Ω.`, [['Reactance (Ω)', X], ['Inductance (mH)', 10 * u]]); },
 /* R = 3u Ω and X_L − X_C = 4u Ω, u from 1 to 21: Z = 5u Ω. */
 q39: t => { t = T(t); const u = t + 11, R = 3 * u, X = 4 * u, Z = 5 * u;
  return E('Predict the impedance of the circuit, in ohms.', `Z = √(R² + (X_L − X_C)²) = √(${n(R * R)} + ${n(X * X)}) = √${n(Z * Z)} = ${n(Z)} Ω.`, [['Impedance (Ω)', Z], ['Resistance (Ω)', R]]); },
 /* A wave of 15u MHz, u from 1 to 21: λ = 20/u m, to 2 decimal places (never a tie). */
 q40: t => { t = T(t); const u = t + 11, f = 15 * u, lam = Math.round(2000 / u) / 100;
  return E('Predict the wavelength in metres, to 2 decimal places.', `λ = c/f = 3.00 × 10⁸ ÷ (${n(f)} × 10⁶) ≈ ${n(lam)} m.`, [['Wavelength (m)', lam], ['Frequency (MHz)', f]]); },
});
})();
