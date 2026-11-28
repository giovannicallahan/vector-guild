/* Logic and proof review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `Claim: for every whole number n from 1 up, n² + n + ${[1, 5, 11, 17, 35][(t + 10) % 5]} is prime.`,
 q32: t => `Claim: there is a whole number greater than ${30 + 4 * (t + 10)} that both 4 and 6 divide.`,
 q33: t => { const d = 3 + (t + 10) % 5; return `Claim: for every whole number n, ${d} divides n if and only if ${d} divides n + ${2 * d}. Look at n from 1 to 40.`; },
 q34: t => { const e = 2 + (t + 10) % 4, s = []; for (let i = 1; i <= e; i++) s.push(`(${i}) n = ${i} gives ${i * i + i + 11}, which is prime.`);
  return `A “proof” that n² + n + 11 is prime for every whole number n: ${s.join(' ')} (${e + 1}) The claim holds in every case tried, so it holds for every whole number n.`; },
 q35: t => `Claim: 2ⁿ > ${3 + (t + 10) % 8}n + 1, for every whole number n from some step on.`,
 q36: t => `Induction for 1 + 3 + 5 + … + (2n − 1) = n², with k = ${13 + t}.`,
 q37: t => `The formula 1 + 3 + 5 + … + (2n − 1) = n² has been proved by induction. Take n = ${70 + 5 * t}.`,
 q38: t => { const c = [1, 2, 3, 4, 5, 6, 8, 10][(t + 10) % 8]; return `The inequality 2ⁿ > ${c === 1 ? '' : c}n² is false for some small n and true from some point on.`; },
 q39: t => `A post office sells only 3-credit and ${[4, 5, 7, 8, 10, 11][(t + 10) % 6]}-credit stamps, any number of each.`,
 q40: t => `The claim: 1 ÷ n < ε for every whole number n ≥ N, with ε = ${window.Gen.n([5, 8, 10, 12, 16, 20, 25, 30, 40, 60][(t + 10) % 10] / 1000)}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
