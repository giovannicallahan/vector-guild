/* Probability review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const d = 15 + t; return `A log of 200 crates: Northway sent 86 sound and 14 cracked; Ridgeline sent ${100 - d} sound and ${d} cracked. A crate is picked at random.`; },
 q12: t => `2% of the crew carry a virus. A screen is positive for 90% of carriers and gives a false alarm for ${11 + t}% of crew who do not carry it. A crew member tests positive.`,
 q13: t => { const a = 12 + t; return `The odds in favour of a scanner repair working are ${a} : ${25 - a}.`; },
 q14: t => `X is the number of crew who visit the medical bay in a day, never more than 3: P(X = 0) = 0.1, P(X = 1) = ${window.Gen.n((25 + t) / 100)}, P(X = 2) is missing and P(X = 3) = 0.15.`,
 q15: t => `X is the number of scanner repairs in a day: P(X = 0) = ${window.Gen.n((20 - t) / 100)}, P(X = 1) = ${window.Gen.n((40 + t) / 100)}, P(X = 2) = 0.3, P(X = 3) = 0.1.`,
 q16: t => { const a = window.Gen.n((15 + t) / 100), b = window.Gen.n((70 - 2 * t) / 100); return `X is the number of patients waiting at noon: P(X = 0) = ${a}, P(X = 1) = ${b}, P(X = 2) = ${a}.`; },
 q17: t => `The medical bay sells 1000 raffle tickets at 2 credits each. One ticket wins ${800 + 50 * t} credits, 10 tickets win 40 credits each and 50 tickets win 6 credits each; the rest win nothing.`,
 q18: t => `Each seed sprouts with probability ${window.Gen.n((1 + (t + 10) % 9) / 10)}, independently of the others. A row of 4 seeds is planted.`,
 q19: t => `A row of 8 seeds is planted and exactly ${(t + 10) % 9} of them sprout. Count the orders in which the sprouts can fall.`,
 q20: t => `Each of 4 seeds sprouts with probability 0.5, independently, and X is the number that sprout. Take k = ${(t + 10) % 5}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
