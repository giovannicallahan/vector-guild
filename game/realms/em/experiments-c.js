/* Electricity and magnetism: fields concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* 10 μF charged to 20 V (2 mJ), disconnected, then filled with κ from the list: U = 2 ÷ κ mJ, exact. */
 q21: t => { t = T(t); const k = [2, 4, 5, 8, 10][(t + 10) % 5], U = 2 / k;
  return E('Predict the energy now stored in the capacitor, in mJ.', `The charge stays Q = 10 × 20 = 200 μC and the capacitance becomes ${n(k)} × 10 = ${n(10 * k)} μF, so U = Q² ÷ (2C) = 40000 ÷ ${n(20 * k)} = ${n(U * 1000)} μJ = ${n(U)} mJ, the 2 mJ from before divided by κ.`, [['Energy now (mJ)', U], ['New capacitance (μF)', 10 * k], ['Energy before (mJ)', 2]]); },
 /* I(t) = 2 + 4t for T = 1 to 8 seconds: Q = 2T + 2T². */
 q22: t => { t = T(t); const s = 1 + (t + 10) % 8, Q = 2 * s + 2 * s * s;
  return E('Predict the charge that passes in that time, in coulombs.', `Q is the integral of 2 + 4t from 0 to ${n(s)}: 2 × ${n(s)} + 2 × ${n(s * s)} = ${n(Q)} C.`, [['Charge (C)', Q], ['Current at the end (A)', 2 + 4 * s]]); },
 /* A (6 μF) in series with B (4 μF) parallel to C (2 μF, κ = 4): 4 μF across V = 3 to 30 volts. */
 q23: t => { t = T(t); const V = 3 * (1 + (t + 10) % 10), Q = 4 * V;
  return E('Predict the total charge the supply puts on the bank, in μC.', `C becomes 4 × 2 = 8 μF; B and C in parallel make 12 μF; in series with A, 6 × 12 ÷ 18 = 4 μF. Q = 4 × ${n(V)} = ${n(Q)} μC.`, [['Total charge (μC)', Q], ['Bank capacitance (μF)', 4]]); },
 /* Copper, area 2 mm², length 100 to 1000 m: R = 0.0084 L ohms, exact. */
 q24: t => { t = T(t); const L = 100 * (1 + (t + 10) % 10), Rv = 0.0084 * L;
  return E('Predict the resistance of the cable, in ohms.', `R = ρL ÷ A = (1.68 × 10⁻⁸ × ${n(L)}) ÷ (2 × 10⁻⁶) = ${n(Rv)} Ω.`, [['Resistance (Ω)', Rv], ['Length (m)', L]]); },
 /* 6 Ω heater with V = 6I volts, I = 0.5 to 5 A: P = 6I². */
 q25: t => { t = T(t); const I = 0.5 * (1 + (t + 10) % 10), V = 6 * I, P = 6 * I * I;
  return E('Predict the power the heater turns into heat, in watts.', `I = V ÷ R = ${n(V)} ÷ 6 = ${n(I)} A, so P = IV = ${n(I)} × ${n(V)} = ${n(P)} W.`, [['Power (W)', P], ['Current (A)', I]]); },
 /* 4 Ω in series with 6 Ω ∥ 12 Ω (8 Ω in all), emf 4 to 48 volts: I = ε ÷ 8. */
 q26: t => { t = T(t); const e = 4 * (1 + (t + 10) % 12), I = e / 8;
  return E('Predict the current from the supply, in amperes.', `6 Ω and 12 Ω in parallel make 72 ÷ 18 = 4 Ω; with the 4 Ω cable that is 8 Ω, so I = ${n(e)} ÷ 8 = ${n(I)} A.`, [['Current (A)', I], ['Equivalent resistance (Ω)', 8]]); },
 /* The q27 circuit with ε₁ = 12 V, R = 2, 4, 2 ohms and ε₂ from 2 to 22 volts without 8 (where I₃ = 0): I₃ = 0.3ε₂ − 2.4. */
 q27: t => { t = T(t); const list = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], e2 = list[(t + 10) % 20], I1 = (72 - 4 * e2) / 20, I3 = (6 * e2 - 48) / 20;
  return E('Predict I₃, the current up the right branch, in amperes (negative if it flows down).', `Loops: 12 = 6 × I₁ + 4 × I₃ and ${n(e2)} = 4 × I₁ + 6 × I₃. Eliminating I₁: I₃ = (6 × ${n(e2)} − 4 × 12) ÷ 20 = ${n(I3)} A, and I₁ = ${n(I1)} A.`, [['I₃ (A)', I3], ['I₁ (A)', I1], ['I₂ (A)', I1 + I3]]); },
 /* R = 10 to 100 kΩ with 200 μF: τ = R × 0.2 seconds. */
 q28: t => { t = T(t); const R = 10 * (1 + (t + 10) % 10), tau = R / 5;
  return E('Predict the time constant of the circuit, in seconds.', `τ = RC = ${n(R)} × 10³ × 200 × 10⁻⁶ = ${n(tau)} s. After one time constant the capacitor is at about 63.2% of the emf.`, [['Time constant (s)', tau], ['Resistance (kΩ)', R]]); },
 /* The q29 canonical network (R₁ = 3, pair 3 ∥ 6 = 2, R₃ = 6 ohms, ε₂ = 9 V) with ε₁ = 3 + 6j volts: I₂ = 1.25 + j. */
 q29: t => { t = T(t); const j = (t + 10) % 10, e1 = 3 + 6 * j, I2 = (6 * e1 + 27) / 36;
  return E('Predict the total current down the middle branch, in amperes.', `The heaters make 2 Ω. Solving the loops ${n(e1)} = 5 × I₁ + 2 × I₃ and 9 = 2 × I₁ + 8 × I₃ gives I₂ = I₁ + I₃ = (${n(e1)} × 6 + 9 × 3) ÷ 36 = ${n(I2)} A.`, [['Middle current (A)', I2], ['Voltage across the pair (V)', 2 * I2]]); },
 /* +2e at 100 to 1000 km/s, at right angles to 50 mT: F = 1.6k × 10⁻¹⁵ N. */
 q30: t => { t = T(t); const k = 1 + (t + 10) % 10, V = 100 * k, F = 1.6 * k;
  return E('Predict the size of the magnetic force, in units of 10⁻¹⁵ N.', `F = |q|vB sin θ = 3.2 × 10⁻¹⁹ × ${n(V)} × 10³ × 50 × 10⁻³ × 1 = ${n(F)} × 10⁻¹⁵ N.`, [['Force (units of 10⁻¹⁵ N)', F], ['Speed (km/s)', V]]); },
});
})();
