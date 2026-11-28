/* Number theory: the hidden life of whole numbers review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `Cans of 6 litres and 9 litres, always full, fill an order of ${3 * (30 + t)} litres, using at least one can of each size.`,
 q12: t => `Find the least residue of ${window.Gen.n(23 * t - 4)} mod 9.`,
 q13: t => `A rota has 11 shifts, numbered 0 to 10. Starting from shift 0, a convoy repeats a run of ${2000 + 53 * (t + 10)} shifts 4831 times.`,
 q14: t => `A ticket serial reads ${6153820 + 7 * (t + 10)}.`,
 q15: t => `On a loop of 23 stops the tram jumps ${2 + (t + 10) % 20} stops at a time.`,
 q16: t => `Solve the linear congruence 4x ≡ ${2 * (1 + (t + 10) % 8)} (mod 18), with x from 0 to 17.`,
 q17: t => `The Kepler week has 7 days, numbered 0 to 6, and today is day 2. A convoy leaves in ${1000 + 37 * (t + 10)} days.`,
 q18: t => `A message leaves ${1 + (t + 10) % 3} over in blocks of 4, ${1 + Math.floor((t + 10) / 3) % 4} over in blocks of 5 and 2 over in blocks of 7.`,
 q19: t => `Find 3${String(40 + 13 * (t + 10)).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('')} mod 47 by repeated squaring.`,
 q20: t => `31 is prime. Find 3${String(123456 + 11 * (t + 10)).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('')} mod 31.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
