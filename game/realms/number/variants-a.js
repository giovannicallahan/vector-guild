/* Number theory: the hidden life of whole numbers review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const Q03 = [91, 119, 143, 187, 209, 247, 299, 323, 341, 377, 403, 437, 451, 481, 493, 527, 551, 589, 629, 667, 697];
Object.assign(window.VARIANT_SETUP, {
 q01: t => `Divide a = ${window.Gen.n(10 * t + 3)} by 7, in the form a = 7q + r with 0 ≤ r < 7.`,
 q02: t => `A crate label reads (213), a numeral in base ${4 + (t + 10) % 6}.`,
 q03: t => `A delivery of ${Q03[Math.max(-10, Math.min(10, t)) + 10]} washers must go into equal crates of more than 1 washer each, with nothing left over.`,
 q04: t => `A delivery of ${Math.pow(2, 1 + (t + 10) % 5) * Math.pow(3, 1 + Math.floor((t + 10) / 5) % 4) * 5} rivets is filed under its prime factorisation.`,
 q05: t => `Bolts come in boxes of ${6 * (t + 12)} and nuts in boxes of 90.`,
 q06: t => `Run Euclid’s algorithm on 600 and ${21 + 4 * (t + 10)}.`,
 q07: t => `Find whole numbers x and y with 11x + ${2 + (t + 10) % 9}y = 1, taking x as the smallest positive choice.`,
 q08: t => `A tank needs ${40 + t} litres from full 3-litre and 5-litre cans, at least one of each: 3x + 5y = ${40 + t} with x and y positive whole numbers.`,
 q09: t => `The crate store has ${Math.pow(2, 1 + (t + 10) % 5) * Math.pow(3, 1 + Math.floor((t + 10) / 5) % 4)} identical tins, and every divisor is a possible crate size.`,
 q10: t => `The fuel depot keeps one can of every size that divides ${Math.pow(2, 1 + (t + 10) % 7) * 3} litres.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
