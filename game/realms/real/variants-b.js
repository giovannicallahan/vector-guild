/* Real analysis review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const EPS = [0.5, 0.25, 0.2, 0.1, 0.05, 0.04, 0.02, 0.01];
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `A signal channel reads xₙ = (2n + 11) ÷ (n + 3) for n = 1, 2, 3, …, which tends to 2. Take ε = ${n(EPS[(t + 10) % 8])}.`,
 q12: t => `A repeater reads xₙ = 4 + 6 ÷ n for n = 1, 2, 3, …. Take ε = ${n(EPS[(t + 10) % 8])}.`,
 q13: t => `The series 64 + 32 + 16 + 8 + … halves each term. Take N = ${1 + (t + 10) % 6} terms.`,
 q14: t => `The series has terms aₙ = (−1)ⁿ⁺¹ × 60 ÷ n, for n = 1, 2, 3, …. Take the first ${1 + (t + 10) % 6} terms.`,
 q15: t => { const q = 2 + (t + 10) % 5; return `A series has terms aₙ = 60 ÷ (${q}ⁿ + 1), for n = 1, 2, 3, …. Compare it with Σ 60 ÷ ${q}ⁿ.`; },
 q16: t => { const c = 1 + (t + 10) % 9; return `The alternating series ${c} − ${c} ÷ 2 + ${c} ÷ 3 − … has sum S, and |S − s_N| ≤ ${c} ÷ (N + 1).`; },
 q17: t => `A chain of corrections has terms cₙ = (−1)ⁿ⁺¹ × 60 ÷ (n + 1), for n = 1, 2, 3, …. Stop after N = ${[1, 2, 3, 4, 8, 10, 13, 18, 28][(t + 10) % 9]} terms.`,
 q18: t => `A dial reads f(x) = 4x − 3, and f(x) → 5 as x → 2. Take ε = ${n(0.1 * (1 + (t + 10) % 10))}.`,
 q19: t => `A heater’s output is f(x) = 2x + 1, tested at x = 3 with the settings xₙ = 3 + 1 ÷ n. Take ε = ${n(EPS[(t + 10) % 8])}.`,
 q20: t => `f(x) = 3x − 1 for x < 2, and f(x) = ${t === 0 ? 'x²' : `x² ${t < 0 ? '−' : '+'} ${Math.abs(t)}`} for x > 2.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
