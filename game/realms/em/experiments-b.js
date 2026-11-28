/* Electricity and magnetism: fields concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Bead of 3 to 6 nC at the centre of a −7 nC shell of radius 0.5 m; a Gaussian sphere of radius 0.1 to 0.9 m (never 0.5). */
 q11: t => { t = T(t); const i = (t + 10) % 8, r = [0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9][i], b = 3 + (t + 10) % 4, enc = r > 0.5 ? b - 7 : b;
  return E('Predict the charge enclosed by the Gaussian sphere, in nC.', `The sphere of radius ${n(r)} m is ${r > 0.5 ? 'outside' : 'inside'} the shell, so it encloses ${r > 0.5 ? `the bead and the shell: ${n(b)} + (−7) = ${n(enc)} nC` : `only the bead: ${n(b)} nC`}.`, [['Enclosed charge (nC)', enc], ['Sphere radius (m)', r], ['Bead charge (nC)', b]]); },
 /* 3 μC and t μC at 0.5 m: U = 8.99 × 3 × t ÷ 0.5 = 53.94t mJ. */
 q12: t => { t = T(t); const U = 53.94 * t;
  return E('Predict the electric potential energy of the pair, in mJ.', `U = kq₁q₂ ÷ r = 8.99 × 3 × ${par(t)} ÷ 0.5 = ${n(U)} mJ (charges in μC, r in m).`, [['Potential energy (mJ)', U], ['Second charge (μC)', t]]); },
 /* Helium nucleus (2e) through 100(t + 11) volts: energy 2V eV = 0.032V × 10⁻¹⁷ J. */
 q13: t => { t = T(t); const V = 100 * (t + 11), eV = 2 * V, J = 0.016 * eV;
  return E('Predict the energy it gains, as the number that multiplies 10⁻¹⁷ J.', `A helium nucleus carries 2e, so it gains 2 × ${n(V)} = ${n(eV)} eV, and ${n(eV)} × 1.60 × 10⁻¹⁹ J = ${n(J)} × 10⁻¹⁷ J.`, [['Energy (× 10⁻¹⁷ J)', J], ['Energy (eV)', eV], ['Voltage (V)', V]]); },
 /* +4 μC at 0.2 m and t μC at 0.5 m from the point: V = 8.99 × (20 + 2t) kV. */
 q14: t => { t = T(t); const a = 179.8, b = 17.98 * t, V = a + b;
  return E('Predict the potential at the point, in kV.', `8.99 × 4 ÷ 0.2 = 179.8 kV and 8.99 × ${par(t)} ÷ 0.5 = ${n(b)} kV. Potentials add as plain numbers: V = ${n(V)} kV.`, [['Potential (kV)', V], ['From the +4 μC charge (kV)', a], ['From the second charge (kV)', b]]); },
 /* V(x) = 2x³ − 9x² + 40 volts at x = t: E_x = −(6t² − 18t). */
 q15: t => { t = T(t); const s = 6 * t * t - 18 * t, Ex = -s;
  return E('Predict the field E_x at that position, in V/m.', `dV/dx = 6x² − 18x, which at x = ${n(t)} is 6 × ${n(t * t)} − 18 × ${par(t)} = ${n(s)} V/m, so E_x = −dV/dx = ${n(Ex)} V/m.`, [['Field E_x (V/m)', Ex], ['dV/dx (V/m)', s]]); },
 /* Plates 5 mm apart at 50(t + 11) volts: E = 10(t + 11) kV/m. */
 q16: t => { t = T(t); const V = 50 * (t + 11), Ef = V / 5;
  return E('Predict the field between the plates, in kV/m.', `E = V ÷ d = ${n(V)} V ÷ 5 mm = ${n(Ef)} V/mm, which is ${n(Ef)} kV/m.`, [['Field (kV/m)', Ef], ['Voltage (V)', V]]); },
 /* A proton at 40k km/s, k from 1 to 10: kinetic energy 8.35k² eV. */
 q17: t => { t = T(t); const k = 1 + (t + 10) % 10, v = 40 * k, KE = 8.35 * k * k;
  return E('Predict the proton’s kinetic energy, in eV (the volts of potential it can climb).', `½ × 1.67 × 10⁻²⁷ × (${n(v)} × 10³)² J ÷ 1.60 × 10⁻¹⁹ J per eV = ${n(KE)} eV.`, [['Kinetic energy (eV)', KE], ['Speed (km/s)', v]]); },
 /* Plates of 100(t + 11) cm² 2 mm apart: C = 44.25(t + 11) pF. */
 q18: t => { t = T(t); const A = 100 * (t + 11), C = 0.4425 * A;
  return E('Predict the capacitance, in pF.', `C = ε₀A ÷ d = 8.85 × 10⁻¹² × ${n(A / 10000)} ÷ 0.002 F, which is ${n(C)} pF.`, [['Capacitance (pF)', C], ['Area (cm²)', A]]); },
 /* 6 μF in series with 3 μF (together 2 μF), all in parallel with t + 11 μF. */
 q19: t => { t = T(t); const c3 = t + 11, C = 2 + c3;
  return E('Predict the equivalent capacitance, in μF.', `6 μF and 3 μF in series give 6 × 3 ÷ (6 + 3) = 2 μF. In parallel with ${n(c3)} μF the capacitances add: 2 + ${n(c3)} = ${n(C)} μF.`, [['Equivalent capacitance (μF)', C], ['Series pair (μF)', 2]]); },
 /* 200 μF charged to 10(t + 11) volts: U = 10(t + 11)² mJ. */
 q20: t => { t = T(t); const V = 10 * (t + 11), U = 200 * V * V / 2000;
  return E('Predict the energy stored, in mJ.', `U = ½CV² = ½ × 200 × ${n(V * V)} μJ = ${n(200 * V * V / 2)} μJ, which is ${n(U)} mJ.`, [['Energy (mJ)', U], ['Voltage (V)', V]]); },
});
})();
