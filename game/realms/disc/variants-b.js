/* Discrete mathematics review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `Crate codes are one letter from A to F, then a first digit from 1 to 4, then a second digit from 0 to ${3 + (t + 10) % 7}. A function f sends each code to the sum of its two digits.`,
 q12: t => `${3 + (t + 10) % 6} different crates go on a shelf of ${3 + (t + 10) % 6} spaces, one in each space.`,
 q13: t => `${5 + (t + 10) % 8} crew are on shift, and three different jobs, a driver, a loader and a checker, need one person each; nobody does two.`,
 q14: t => `A team of 3 is picked from ${5 + (t + 10) % 11} crew; only who goes matters, not the order they were picked in.`,
 q15: t => `The duty log is a bit string of ${4 + (t + 10) % 9} places, each 0 or 1.`,
 q16: t => `The rota formula is (2x + y) to the power ${3 + (t + 10) % 6}, multiplied out.`,
 q17: t => { const N = 5 + (t + 10) % 8; return t % 2 === 0 ? `A supply run stops at 3 of the ${N} domes, one after another, and a different order of stops is a different route.` : `Mira picks 3 of the ${N} crew to share a night shift; they all do the same work.`; },
 q18: t => `The packing floor has 3 engineers and ${3 + (t + 10) % 7} packers, and a crew of 3 must include at least one engineer.`,
 q19: t => `${3 + (t + 10) % 10} identical crates are shared among 3 domes; only how many each dome gets matters.`,
 q20: t => `Crate codes run from 1 to ${100 + 10 * (t + 10)}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
