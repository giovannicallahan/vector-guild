/* Discrete mathematics review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `B is the set of all multiples of ${2 + (t + 10) % 8} from 10 to 60, including both ends.`,
 q02: t => `B = {1, 2, 3, …, 20}, and A is the set of the multiples of ${2 + (t + 10) % 8} from 1 to 20, so A ⊆ B.`,
 q03: t => { const s = 1 + (t + 10) % 12; return `A = {1, 2, …, 10}, and B is the set of the 8 whole numbers from ${s} to ${s + 7}.`; },
 q04: t => `Of 60 crates, 25 are fragile (set F), 30 are heavy (set H), and ${2 + (t + 10) % 14} are both fragile and heavy.`,
 q05: t => `Of 60 crates, 28 are fragile (F), 21 cold-stored (C) and 24 heavy (H); 8 are fragile and cold, 9 fragile and heavy, 7 cold and heavy, and ${2 + (t + 10) % 6} are all three.`,
 q06: t => `A = {1, 2, 3, 4, 5, 6} and B = {1, 2, 3, 4, 5, 6}. The target is a + b = ${2 + (t + 10) % 11}.`,
 q07: t => { const m = 1 + (t + 10) % 10; return `f: {1, 2, …, 10} → {1, 2, …, 10} sends each x to the larger of x and ${m} (to x itself when x is ${m} or more).`; },
 q08: t => `f: {1, 2, 3, 4, 5, 6} → {1, 2, …, ${12 + (t + 10) % 9}} doubles each input: f(x) = 2x.`,
 q09: t => `The shelves hold 7 different filters, 5 different valves and ${2 + (t + 10) % 14} different seals, and no part is on two shelves. A repair needs one part.`,
 q10: t => `A crate code is one letter from ${2 + (t + 10) % 11} letters, then two digits; the first digit is not 0, and the two digits are different.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
