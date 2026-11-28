/* Number theory: the hidden life of whole numbers review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const PR = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const UNITS40 = [3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37, 39];
/* The same 21 fractions as experiments-d.js (q37), in the same order. */
const cfrac = (P, Q) => { const a = []; while (Q) { a.push(Math.floor(P / Q)); [P, Q] = [Q, P % Q]; } return a; };
const FR = []; for (let a1 = 1; a1 <= 6; a1++) for (let a2 = 1; a2 <= 6; a2++) for (let a3 = 2; a3 <= 6; a3++) {
 const q2 = a2 * a1 + 1, P = a3 * a2 + 1, Q = a3 * q2 + a1; if (Q >= 100) continue; const N = Math.round(P / Q * 1e6), c = cfrac(N, 1e6);
 if (N % 10 && c[1] === a1 && c[2] === a2 && c[3] === a3 && c[4] >= 100 && FR.length < 21) FR.push(N); }
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => { const a = 2 + (t + 10) % 11; return `Take the prime 13 and a = ${a}. Use Euler’s criterion: work out ${a}⁶ mod 13.`; },
 q32: t => { const q = PR[(t + 10) % 21]; return `Find the Legendre symbol (7/${q}), where ${q} is an odd prime, by quadratic reciprocity.`; },
 q33: t => `Write ${100 + 5 * (t + 10)} = a² + b² with whole numbers 0 ≤ a ≤ b.`,
 q34: t => `Run the Fermat test to base 2 on n = ${21 + 2 * (t + 10)}.`,
 q35: t => { const k = 1 + (t + 10) % 10, r0 = 3 * k + 1, q = 2 * r0 + 3; return `Expand ${q + r0}/${q} as a continued fraction [a₀; a₁, a₂, a₃].`; },
 q36: t => { const k = 1 + (t + 10) % 10; return `Take the continued fraction [2; 3, ${k}, 4] and its third convergent C₂ = [2; 3, ${k}].`; },
 q37: t => `A reading of ${FR[(t + 10) % 21]} millionths is a fraction with a denominator under 100, rounded to six decimal places. Recover the fraction in lowest terms.`,
 q38: t => `Encrypt the message m = ${t + 12} with the RSA public key n = 55, e = 3.`,
 q39: t => `The RSA public key is n = 55 = 5 × 11 with encryption exponent e = ${UNITS40[(t + 10) % 15]}.`,
 q40: t => `The divisor network has one dot for each number from 1 to ${t + 20}, with a link from a to b whenever a < b and a divides b.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
