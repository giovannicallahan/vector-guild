/* Electricity and magnetism: fields concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Rounded targets carry their own tolerance (0.005, so a slip of 0.01 is rejected) and say "to 2 decimal places". */
const r2 = x => (x < 0 ? -1 : 1) * Math.round(Math.abs(x) * 100 + 1e-9) / 100;
const E2 = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1], tolerance: 0.005 });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A grain with charge −c × 1.60 × 10⁻¹⁸ C, c from 2 to 22: it carries 10c extra electrons. */
 q01: t => { t = T(t); const c = t + 12, N = 10 * c;
  return E('Predict how many extra electrons the grain carries.', `(${n(c * 1.6)} × 10⁻¹⁸ C) ÷ (1.60 × 10⁻¹⁹ C) = ${n(c)} × 10 = ${n(N)} electrons.`, [['Extra electrons', N], ['Charge (× 10⁻¹⁸ C)', -c * 1.6]]); },
 /* q₁ from 1 to 9 μC and q₂ = −4 μC, 0.3 m apart: F = 8.99 × 10⁹ × 4q₁ × 10⁻¹² ÷ 0.09. */
 q02: t => { t = T(t); const a = 1 + (t + 10) % 9, F = 0.899 * 4 * a / 9;
  return E2('Predict the size of the force between the spheres, in newtons to 2 decimal places.', `F = k|q₁q₂| ÷ r² = 8.99 × 10⁹ × ${n(4 * a)} × 10⁻¹² ÷ 0.09 ≈ ${n(F)} N, so ${n(r2(F))} N. Opposite signs, so they attract.`, [['Force (N)', r2(F)], ['|q₁q₂| (× 10⁻¹² C²)', 4 * a]]); },
 /* 1 μC at x = 0, 2 μC at x = −0.1 m, t μC at x = 0.2 m: Fₓ = 1.798 − 0.22475t newtons. */
 q03: t => { t = T(t); const F1 = 1.798, F2 = -0.22475 * t, F = F1 + F2;
  return E2('Predict the x component of the net force on the charge at x = 0, in newtons to 2 decimal places.', `The 2 μC charge on the left repels it towards +x: 8.99 × 10⁹ × 2 × 10⁻¹² ÷ 0.01 = 1.798 N. The ${n(t)} μC charge on the right gives 8.99 × 10⁹ × ${n(Math.abs(t))} × 10⁻¹² ÷ 0.04 = ${n(Math.abs(F2))} N towards ${F2 > 0 ? '+x' : '−x'}. Net: ${n(F)} N, so ${n(r2(F))} N.`, [['Net force Fₓ (N)', r2(F)], ['From the left charge (N)', F1], ['From the right charge (N)', F2]]); },
 /* t nC at the origin, P at x = 0.2 m: Eₓ = 224.75t N/C exactly; a 2 μC test charge feels 449.5t μN. */
 q04: t => { t = T(t); const Ev = 224.75 * t;
  return E('Predict the x component of the field at P, in N/C.', `Size 8.99 × 10⁹ × ${n(Math.abs(t))} × 10⁻⁹ ÷ 0.04 = ${n(Math.abs(Ev))} N/C, pointing ${t > 0 ? 'away from the positive charge, towards +x' : 'towards the negative charge, towards −x'}: Eₓ = ${n(Ev)} N/C. A 2 μC test charge there feels ${n(2 * Ev)} μN.`, [['Field Eₓ (N/C)', Ev], ['Force on 2 μC (μN)', 2 * Ev]]); },
 /* A rod from x = 0.1 m to x = 0.5 m with λ = 5(t + 11) nC/m: Ev = 8.99λ × (10 − 2) N/C at the origin. */
 q05: t => { t = T(t); const lam = 5 * (t + 11), Ev = 8.99 * lam * 8 / 1000;
  return E2('Predict the size of the field at the origin, in kN/C to 2 decimal places.', `E = kλ(1 ÷ 0.1 − 1 ÷ 0.5) = 8.99 × 10⁹ × ${n(lam)} × 10⁻⁹ × 8 = ${n(Ev * 1000)} N/C, which is ${n(r2(Ev))} kN/C.`, [['Field (kN/C)', r2(Ev)], ['Total charge (nC)', lam * 0.4]]); },
 /* Charges ±q nC with q = t + 11, 0.02 m apart, in 50 kN/C at θ = π/2: p = 0.02q nC·m and τ = q μN·m. */
 q06: t => { t = T(t); const q = t + 11, p = 0.02 * q, tau = p * 50;
  return E('Predict the size of the torque on the dipole, in μN·m.', `p = qd = ${n(q)} × 0.02 = ${n(p)} nC·m, and τ = pE sin θ = ${n(p)} × 50 × sin(π/2) = ${n(tau)} μN·m.`, [['Torque (μN·m)', tau], ['Dipole moment (nC·m)', p]]); },
 /* A 2 m² panel in a field of 100(t + 11) N/C at π/3 to its normal: Φ = EA × 0.5. */
 q07: t => { t = T(t); const Ev = 100 * (t + 11), F = Ev * 2 * 0.5;
  return E('Predict the flux through the panel, in N·m²/C.', `Φ = EA cos θ = ${n(Ev)} × 2 × cos(π/3) = ${n(Ev * 2)} × 0.5 = ${n(F)} N·m²/C.`, [['Flux (N·m²/C)', F], ['EA (N·m²/C)', Ev * 2]]); },
 /* A closed surface around t nC: Φ = t × 10⁻⁹ ÷ (8.85 × 10⁻¹²), to the nearest whole number. */
 q08: t => { t = T(t); const F = t * 1000 / 8.85, Fr = Math.round(F);
  return E('Predict the net flux out of the closed surface, in N·m²/C to the nearest whole number.', `Φ = q_enc ÷ ε₀ = ${n(t)} × 10⁻⁹ ÷ (8.85 × 10⁻¹²) ≈ ${n(F)}, which rounds to ${n(Fr)} N·m²/C.`, [['Flux (N·m²/C)', Fr], ['Charge inside (nC)', t]]); },
 /* Shells of radius 1 m (10 nC) and 3 m (5t nC); the radial field 4 m from the centre is 8.99 × (10 + 5t) ÷ 16. */
 q09: t => { t = T(t); const s = 10 + 5 * t, Ev = 8.99 * s / 16;
  return E2('Predict the radial field 4 m from the centre, in N/C to 2 decimal places (positive outwards).', `A Gaussian sphere of radius 4 m encloses both shells: 10 ${5 * t < 0 ? '−' : '+'} ${n(Math.abs(5 * t))} = ${n(s)} nC. E = kq_enc ÷ r² = 8.99 × ${par(s)} ÷ 16 ≈ ${n(Ev)} N/C, so ${n(r2(Ev))} N/C.`, [['Radial field (N/C)', r2(Ev)], ['Charge enclosed (nC)', s]]); },
 /* A large sheet with σ = 20(t + 11) nC/m²: E = σ ÷ (2ε₀) = σ ÷ 17.7 kN/C. */
 q10: t => { t = T(t); const sig = 20 * (t + 11), Ev = sig / 17.7;
  return E2('Predict the size of the field near the sheet, in kN/C to 2 decimal places.', `E = σ ÷ (2ε₀) = ${n(sig)} × 10⁻⁹ ÷ (1.77 × 10⁻¹¹) ≈ ${n(Ev * 1000)} N/C, which is ${n(r2(Ev))} kN/C.`, [['Field (kN/C)', r2(Ev)], ['σ (nC/m²)', sig]]); },
});
})();
