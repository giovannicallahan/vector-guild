/* Calculus 2: accumulation concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const r3 = x => Math.round(x * 1000) / 1000;
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''), sub = k => String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
const C = window.CALC2_C = {
 q21: t => 1 + (t + 10) % 6,
 q22: t => 20 + t,
 q23: t => 1 + (t + 10) % 4,
 q23f: ['6x ÷ (x² + 4)', '5x·eˣ', '6 ÷ ((x + 1)(x + 4))', '(x² + 9) ÷ x'],
 q24: t => 2 + (t + 10) % 4,
 q25: t => 1 + (t + 10) % 5,
 q26: t => 4 + (t + 10) % 9,
 q27: t => 2 + (t + 10) % 11,
 q28: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6], [1, 9], [3, 8], [5, 8], [7, 8]],
 q29: [0.5, 1, 1.5, 2, 3],
 q30: [2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]
};
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* ((A + 3)x + 2A + 3) ÷ ((x + 1)(x + 2)) = A ÷ (x + 1) + 3 ÷ (x + 2), A from 1 to 6. */
 q21: t => { t = T(t); const A = C.q21(t);
  return E('Predict A, the numerator over x + 1.', `Put x = −1: ${n(A + 3)} × (−1) + ${n(2 * A + 3)} = ${n(A)}, and the A part is A × 1, so A = ${n(A)}. Put x = −2: ${n(A + 3)} × (−2) + ${n(2 * A + 3)} = −3, and the B part is B × (−1), so B = 3.`, [['A', A], ['B', 3]]); },
 /* Readings 8, 14, m, 16, 9 every 3 minutes, m from 10 to 30. With h = 3, Simpson's (h ÷ 3) is 1, so the estimate is whole. */
 q22: t => { t = T(t); const m = C.q22(t), sS = 137 + 2 * m, sT = 77 + 2 * m;
  return E('Predict the Simpson’s rule estimate of the litres that flowed.', `Simpson: (3 ÷ 3) × (8 + 4 × 14 + 2 × ${n(m)} + 4 × 16 + 9) = ${n(sS)}. Trapezoidal: (3 ÷ 2) × (8 + 2 × 14 + 2 × ${n(m)} + 2 × 16 + 9) = 1.5 × ${n(sT)} = ${n(1.5 * sT)}.`, [['Simpson estimate (L)', sS], ['Trapezoidal estimate (L)', 1.5 * sT]]); },
 /* One of four integrands from x = 1 to x = 2; the target is the number of the technique that fits. */
 q23: t => { t = T(t); const k = C.q23(t), f = C.q23f[k - 1];
  const v = [3 * Math.log(8 / 5), 5 * Math.exp(2), 2 * (Math.log(3 / 6) - Math.log(2 / 5)), 1.5 + 9 * Math.log(2)][k - 1];
  const why = ['the top is 3 times the derivative of the bottom: substitution with u = x² + 4', 'it is a product of x and eˣ: integration by parts with u = x', 'the bottom is two different linear factors over a constant: partial fractions', 'the top has the higher power and the bottom is just x: divide it out to x + 9 ÷ x'][k - 1];
  return E('Predict the number of the technique that fits (1 to 4).', `For ${f}, ${why}. That is technique ${k}, and the integral from 1 to 2 is about ${n(r3(v))}.`, [['Technique number', k], ['Integral from 1 to 2', r3(v)]]); },
 /* 60 ÷ tᵖ from 1 to ∞ with p from 2 to 5 converges to 60 ÷ (p − 1). */
 q24: t => { t = T(t); const p = C.q24(t), v = 60 / (p - 1), w = p === 2 ? '' : sup(p - 1);
  return E('Predict the value of the improper integral.', `An antiderivative is −${n(v)} ÷ t${w}. From 1 to b the integral is ${n(v)} − ${n(v)} ÷ b${w}, and as b → ∞ the second part shrinks to 0, so the integral converges to ${n(v)}.`, [['Value', v], ['Power p', p]]); },
 /* 3 ÷ √t from 0 to s², s from 1 to 5, converges to 6s. */
 q25: t => { t = T(t); const s = C.q25(t), L = s * s;
  return E('Predict the value of the improper integral.', `An antiderivative is 6√t. From c to ${n(L)} the integral is 6 × ${n(s)} − 6√c = ${n(6 * s)} − 6√c, and as c comes down to 0, √c shrinks to 0, so the integral converges to ${n(6 * s)}.`, [['Value', 6 * s], ['√ of the top limit', s]]); },
 /* Half-life from 4 to 12 days: k = ln 2 ÷ T, to 4 decimal places. */
 q26: t => { t = T(t); const h = C.q26(t), k = Math.round(Math.LN2 / h * 10000) / 10000;
  return { ...E('Predict the rate constant k per day, to 4 decimal places.', `One half-life halves the fuel, so e^(−${n(h)}k) = 1/2 and k = ln 2 ÷ ${n(h)} = 0.693147 ÷ ${n(h)}, which is ${k.toFixed(4)} to 4 decimal places.`, [['k per day', k], ['Half-life (days)', h]]), tolerance: 0.00005 }; },
 /* aₙ = (pn + 5) ÷ (2n + 3), p from 2 to 12: the limit is p ÷ 2. */
 q27: t => { t = T(t); const p = C.q27(t);
  return E('Predict the limit of the sequence as n → ∞.', `Divide the top and the bottom by n: (${n(p)} + 5 ÷ n) ÷ (2 + 3 ÷ n). The parts divided by n shrink to 0, so aₙ approaches ${n(p)} ÷ 2 = ${n(p / 2)}. The first term is a₁ = ${n(p + 5)} ÷ 5 = ${n((p + 5) / 5)}.`, [['Limit', p / 2], ['a₁', (p + 5) / 5]]); },
 /* First term 72, ratio p/q from the list: the sum 72 ÷ (1 − p/q) is a short decimal. */
 q28: t => { t = T(t); const [p, q] = C.q28[(t + 10) % 11], S = 72 * q / (q - p);
  return E('Predict the sum of the geometric series.', `The ratio ${p}/${q} is between −1 and 1, so the series converges to 72 ÷ (1 − ${p}/${q}) = 72 ÷ (${q - p}/${q}) = ${n(S)}.`, [['Sum', S], ['Second term', 72 * p / q]]); },
 /* Tone 6e^(−kt) from 0 to ∞ (6 ÷ k) plus pulses 40, 20, 10, … (80). */
 q29: t => { t = T(t); const k = C.q29[(t + 10) % 5], I = 6 / k, e = k === 1 ? 'e^(−t)' : `e^(−${n(k)}t)`;
  return E('Predict the total energy: the tone’s improper integral plus the sum of the pulses.', `Tone: ∫ from 0 to ∞ of 6${e} dt = 6 ÷ ${n(k)} = ${n(I)}. Pulses: ratio 1/2, so 40 ÷ (1 − 1/2) = 80. Total ${n(I)} + 80 = ${n(I + 80)}.`, [['Total energy', I + 80], ['Tone energy', I]]); },
 /* aₙ = 60 ÷ (n(n + 1)) telescopes: S_N = 60 − 60 ÷ (N + 1), with N + 1 a divisor of 60. */
 q30: t => { t = T(t); const N = C.q30[(t + 10) % 11] - 1, S = 60 - 60 / (N + 1);
  return E(`Predict the partial sum S${sub(N)}.`, `60 ÷ (n(n + 1)) = 60 × (1 ÷ n − 1 ÷ (n + 1)). Adding a₁ to a${sub(N)}, everything cancels except 60 × (1 − 1 ÷ ${n(N + 1)}) = 60 − ${n(60 / (N + 1))} = ${n(S)}.`, [[`S${sub(N)}`, S], ['Sum of the whole series', 60]]); },
});
})();
