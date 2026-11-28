/* Calculus 2: accumulation review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
/* The slider-to-number rules live in experiments-c.js (window.CALC2_C), so the two files cannot drift apart. */
const C = () => window.CALC2_C, n = x => window.Gen.n(x);
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''), sub = k => String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
Object.assign(window.VARIANT_SETUP, {
 q21: t => { const A = C().q21(t); return `The Computing Core splits (${A + 3}x + ${2 * A + 3}) ÷ ((x + 1)(x + 2)) into partial fractions A ÷ (x + 1) + B ÷ (x + 2).`; },
 q22: t => `Coolant flow readings in litres per minute, every 3 minutes from t = 0 to t = 12: 8, 14, ${C().q22(t)}, 16, 9.`,
 q23: t => `The Computing Core must find ∫ from 1 to 2 of ${C().q23f[C().q23(t) - 1]} dx. Its techniques: 1 substitution, 2 integration by parts, 3 partial fractions, 4 dividing the fraction out first.`,
 q24: t => `An echo’s power is 60 ÷ t${sup(C().q24(t))} units for t ≥ 1. Its energy is the improper integral ∫ from 1 to ∞ of 60 ÷ t${sup(C().q24(t))} dt, which converges.`,
 q25: t => { const s = C().q25(t); return `A receiver’s power is 3 ÷ √t units for 0 < t ≤ ${s * s}. Its energy is the improper integral ∫ from 0 to ${s * s} of 3 ÷ √t dt, which converges.`; },
 q26: t => `An isotope fuel has a half-life of ${C().q26(t)} days, so the amount left after t days is y(t) = y₀e^(−kt).`,
 q27: t => `A noise reading after sweep n is aₙ = (${C().q27(t)}n + 5) ÷ (2n + 3).`,
 q28: t => { const [p, q] = C().q28[(t + 10) % 11]; return `Echo strengths form a geometric series with first term 72 and common ratio ${p}/${q}.`; },
 q29: t => { const k = C().q29[(t + 10) % 5]; return `A beacon’s tone has power 6${k === 1 ? 'e^(−t)' : `e^(−${n(k)}t)`} units for t ≥ 0, and its pulses carry 40, 20, 10, … units for ever.`; },
 q30: t => { const N = C().q30[(t + 10) % 11] - 1; return `Relay pulses carry aₙ = 60 ÷ (n(n + 1)) units. Add the first ${N === 1 ? 'term' : N + ' terms'} to get the partial sum S${sub(N)}.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
