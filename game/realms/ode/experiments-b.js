/* Differential equations concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A 200 L tank fed brine with (t + 11) ÷ 10 kg of salt per litre: the equilibrium is 20(t + 11) kg. */
 q11: t => { t = T(t); const c = (t + 11) / 10, eq = 20 * (t + 11);
  return E('Predict the long-run amount of salt in the tank, in kg.', `x′ = 4 × ${n(c)} − (4 ÷ 200)x = ${n(4 * c)} − 0.02x. Setting x′ = 0 gives x = ${n(4 * c)} ÷ 0.02 = ${n(eq)} kg: the tank ends up with the incoming concentration, ${n(c)} kg per litre in all 200 L.`, [['Equilibrium salt (kg)', eq], ['Inflow concentration (kg/L)', c], ['Volume (L)', 200]]); },
 /* y = C₁eᵗ + C₂e^(3t) with y(0) = 4 and y′(0) = 4 + 2j, j = t: C₂ = j and C₁ = 4 − j. */
 q12: t => { t = T(t); const v0 = 4 + 2 * t, C2 = t, C1 = 4 - t;
  return E('Predict C₁.', `C₁ + C₂ = 4 and C₁ + 3C₂ = ${n(v0)}. Subtracting, 2C₂ = ${n(v0 - 4)}, so C₂ = ${n(C2)} and C₁ = 4 − ${par(C2)} = ${n(C1)}.`, [['C₁', C1], ['C₂', C2]]); },
 /* Roots −1 and −1 − j, j from 1 to 6: y″ + (2 + j)y′ + (1 + j)y = 0. */
 q13: t => { t = T(t); const j = 1 + (t + 10) % 6, r1 = -1 - j;
  return E('Predict the smaller root of the characteristic equation.', `The characteristic equation is r² + ${n(2 + j)}r + ${n(1 + j)} = 0, which factors as (r + 1)(r + ${n(1 + j)}) = 0. The roots are −1 and ${n(r1)}, so the smaller is ${n(r1)}.`, [['Smaller root', r1], ['Larger root', -1]]); },
 /* Repeated root −j, j from 1 to 5, with y(0) = 2 and y′(0) = 1: C₂ = 1 + 2j. */
 q14: t => { t = T(t); const j = 1 + (t + 10) % 5, C2 = 1 + 2 * j;
  return E('Predict C₂ in y = (C₁ + C₂t)e^(rt).', `The repeated root is r = −${n(j)}, so C₁ = y(0) = 2 and C₂ = y′(0) − rC₁ = 1 + ${n(j)} × 2 = ${n(C2)}.`, [['C₂', C2], ['C₁', 2], ['Repeated root', -j]]); },
 /* y″ + 2y′ + (1 + b²)y = 0, b from 1 to 6: roots −1 ± bi. */
 q15: t => { t = T(t); const b = 1 + (t + 10) % 6, q = 1 + b * b;
  return E('Predict b, the positive imaginary part of the roots.', `r = (−2 ± √(4 − ${n(4 * q)})) ÷ 2 = (−2 ± √(${n(4 - 4 * q)})) ÷ 2 = −1 ± ${b === 1 ? '' : n(b)}i, so b = ${n(b)}.`, [['Imaginary part b', b], ['Real part a', -1]]); },
 /* m = 1, k = 9 and c = t + 11 from 1 to 21; critical at c = 6. */
 q16: t => { t = T(t); const c = t + 11, D = c * c - 36, code = D > 0 ? 1 : D === 0 ? 2 : 3;
  return E('Predict the damping code: 1 overdamped, 2 critically damped, 3 underdamped.', `c² − 4mk = ${n(c * c)} − 36 = ${n(D)}, which is ${D > 0 ? 'positive: overdamped' : D === 0 ? 'zero: critically damped' : 'negative: underdamped'}.`, [['Damping code', code], ['c² − 4mk', D], ['c (N·s/m)', c]]); },
 /* m = 2 and k = 2ω₀² with ω₀ from 1 to 6: critical damping c = 4ω₀. */
 q17: t => { t = T(t); const w = 1 + (t + 10) % 6, k = 2 * w * w, c = 4 * w;
  return E('Predict the critical damping c, in N·s/m.', `c = 2√(mk) = 2√(2 × ${n(k)}) = 2√${n(4 * w * w)} = 2 × ${n(2 * w)} = ${n(c)} N·s/m.`, [['Critical damping (N·s/m)', c], ['Stiffness k (N/m)', k]]); },
 /* y″ + 3y′ + 2y = 2jt + 3j + 2, j from 1 to 8: yₚ = jt + 1. */
 q18: t => { t = T(t); const j = 1 + (t + 10) % 8, A = 2 * j, B = 3 * j + 2;
  return E('Predict C in the particular solution yₚ = Ct + D.', `With yₚ = Ct + D the left-hand side is 2Ct + (3C + 2D). Matching the t terms, 2C = ${n(A)}, so C = ${n(j)}; then 3 × ${n(j)} + 2D = ${n(B)} gives D = 1.`, [['C', j], ['D', 1]]); },
 /* y″ + y′ + 5y = (j + 2) cos 2t + (1 − 2j) sin 2t, j from 1 to 8: yₚ = j cos 2t + sin 2t. */
 q19: t => { t = T(t); const j = 1 + (t + 10) % 8, F = j + 2, Gs = 1 - 2 * j;
  return E('Predict A in yₚ = A cos 2t + B sin 2t.', `q − ω² = 5 − 4 = 1 and pω = 2. The cos terms give A + 2B = ${n(F)} and the sin terms −2A + B = ${n(Gs)}. Then 5A = ${n(F)} − 2 × ${par(Gs)} = ${n(F - 2 * Gs)}, so A = ${n(j)} and B = 1.`, [['A', j], ['B', 1]]); },
 /* m = 1, c = 2, k = 7 pushed by 5j cos 2t, j from 1 to 10: amplitude 5j ÷ 5 = j. */
 q20: t => { t = T(t); const j = 1 + (t + 10) % 10, F = 5 * j;
  return E('Predict the steady amplitude, in metres.', `k − mω² = 7 − 4 = 3 and cω = 4, so √(3² + 4²) = 5 and C = ${n(F)} ÷ 5 = ${n(j)} m.`, [['Amplitude (m)', j], ['Force size F₀ (N)', F]]); },
});
})();
