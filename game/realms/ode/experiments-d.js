/* Differential equations concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Signed terms, as in gen-d.js: expr([[3, 's'], [−4, '']]) is '3s − 4'; zero terms are dropped. */
const one = (v, x) => `${v < 0 ? '−' : '+'} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}`;
const expr = terms => { const t = terms.filter(([v]) => v !== 0).map(([v, x]) => one(v, x)).join(' '); return t.startsWith('+ ') ? t.slice(2) : t.startsWith('− ') ? '−' + t.slice(2) : t; };
const r3 = x => Math.round(x * 1000) / 1000, r2 = x => Math.round(x * 100) / 100;
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* F(s) = (αs + β) ÷ ((s − 2)(s + 1)) with B = 2 and A from 1 to 6: α = A + 2, β = A − 4. */
 q31: t => { t = T(t); const A = 1 + (t + 10) % 6, top = expr([[A + 2, 's'], [A - 4, '']]);
  return E('Predict A, the coefficient of e^(2t) in the inverse transform.', `Cover up (s − 2) and put s = 2 into (${top}) ÷ (s + 1): the top is ${n(3 * A)} and the bottom is 3, so A = ${n(3 * A)} ÷ 3 = ${n(A)}. The other factor gives B = 2.`, [['A', A], ['B', 2], ['top at s = 2', 3 * A]]); },
 /* y″ + 3y′ + 2y = 0, y(0) = y₀ from 1 to 7, y′(0) = 0: Y = (y₀s + 3y₀) ÷ ((s + 1)(s + 2)), so A = 2y₀ and B = −y₀. */
 q32: t => { t = T(t); const y0 = 1 + (t + 10) % 7;
  return E('Predict A, the coefficient of e^(−t) in the solution.', `Transforming gives (s² + 3s + 2)Y = ${n(y0)}s + ${n(3 * y0)}. Cover up (s + 1) and put s = −1: A = ${n(2 * y0)} ÷ 1 = ${n(2 * y0)}. At s = −2, B = ${n(y0)} ÷ (−1) = ${n(-y0)}.`, [['A', 2 * y0], ['B', -y0], ['y(0)', y0]]); },
 /* v′ + 2v = 2m·u(t − 3), v(0) = 0, m from 1 to 9: v(4) = m(1 − e^(−2)), to 3 decimal places. */
 q33: t => { t = T(t); const m = 1 + (t + 10) % 9, v = r3(m * (1 - Math.exp(-2)));
  return Object.assign(E('Predict v(4), one second after the switch, to 3 decimal places.', `The part without e^(−3s) is ${n(2 * m)} ÷ (s(s + 2)) = ${n(m)} ÷ s − ${n(m)} ÷ (s + 2), so after the switch v = ${n(m)}(1 − e^(−2(t − 3))). At t = 4, v = ${n(m)}(1 − e^(−2)) ≈ ${n(v)}.`, [['v(4) (V)', v], ['Long-run voltage (V)', m]]), { tolerance: 0.0005 }); },
 /* (f ∗ g)(T) for f(t) = t and g(t) = 2: the integral of 2τ from 0 to T is T², for T from 1 to 8. */
 q34: t => { t = T(t); const S = 1 + (t + 10) % 8;
  return E('Predict the convolution (f ∗ g) at the time given.', `f(τ)g(${n(S)} − τ) = τ × 2 = 2τ. Its integral from 0 to ${n(S)} is ${n(S)}² = ${n(S * S)}.`, [['(f ∗ g)', S * S], ['Upper limit', S]]); },
 /* y″ + xy′ + 4y = 0 with a₀ from 1 to 21: a₂ = −4a₀ ÷ 2 = −2a₀. */
 q35: t => { t = T(t); const a0 = t + 11;
  return E('Predict the coefficient a₂ of the power series solution.', `The coefficient of x⁰ gives 2a₂ + 4a₀ = 0, so a₂ = −4 × ${n(a0)} ÷ 2 = ${n(-2 * a0)}.`, [['a₂', -2 * a0], ['a₀', a0]]); },
 /* x′ = xy − k, y′ = y − x + (k − 1), k from 1 to 5: critical points x = k and x = −1, with y = x − (k − 1). */
 q36: t => { t = T(t); const k = 1 + (t + 10) % 5;
  return E('Predict x at the critical point with the larger x.', `y′ = 0 gives y = ${expr([[1, 'x'], [1 - k, '']])}. Then x(${expr([[1, 'x'], [1 - k, '']])}) = ${n(k)}, which is (x − ${n(k)})(x + 1) = 0. The larger root is x = ${n(k)}, with y = 1, and the Jacobian matrix there is [[1, ${n(k)}], [−1, 1]].`, [['x', k], ['y', 1], ['∂f/∂y', k]]); },
 /* x′ = y, y′ = −x² + Dx − 2y, D from 1 to 8: at (D, 0), ∂g/∂x = −2D + D = −D. */
 q37: t => { t = T(t); const D = 1 + (t + 10) % 8;
  return E('Predict ∂g/∂x at the critical point (D, 0), the entry that sets its type.', `∂g/∂x = −2x + ${n(D)}, which is ${n(-D)} at x = ${n(D)}. The Jacobian matrix is [[0, 1], [${n(-D)}, −2]], with trace −2 and determinant ${n(D)}, so λ² + 2λ + ${n(D)} = 0.`, [['∂g/∂x', -D], ['Determinant', D]]); },
 /* x′ = x − 0.2xy, y′ = −0.1k·y + 0.1xy, k from 1 to 10: the prey level at coexistence is 0.1k ÷ 0.1 = k. */
 q38: t => { t = T(t); const k = 1 + (t + 10) % 10, c = k / 10;
  return E('Predict the insect level x at the coexistence point, in hundreds.', `y′ = y(−${n(c)} + 0.1x) is 0 with y non-zero when x = ${n(c)} ÷ 0.1 = ${n(k)}. The bird level is 1 ÷ 0.2 = 5.`, [['x (hundreds)', k], ['y (tens)', 5]]); },
 /* y″ + λy = 0, y(0) = y(2) = 0: the kth allowed λ is k²π² ÷ 4, for k from 1 to 6. */
 q39: t => { t = T(t); const k = 1 + (t + 10) % 6;
  return E('Predict the allowed λ as a multiple of π².', `√λ × 2 = ${n(k)}π, so √λ = ${n(k / 2)}π and λ = ${n(k * k / 4)}π².`, [['λ ÷ π²', k * k / 4], ['√λ ÷ π', k / 2]]); },
 /* A string 2 metres long with wave speed w from 20 to 110 m/s: ω = w × π ÷ 2, to 2 decimal places. */
 q40: t => { t = T(t); const w = 20 + 10 * ((t + 10) % 10), om = r2(w * Math.PI / 2);
  return Object.assign(E('Predict the lowest allowed angular frequency in rad/s, to 2 decimal places.', `The lowest λ is (π ÷ 2)², so √λ = 0.5π and ω = ${n(w)} × 0.5π = ${n(w / 2)}π ≈ ${n(om)} rad/s.`, [['ω (rad/s)', om], ['ω ÷ π', w / 2]]), { tolerance: 0.005 }); }
});
})();
