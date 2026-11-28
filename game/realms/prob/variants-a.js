/* Probability review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `A bag holds 20 tokens, ${1 + (t + 10) % 19} of them green and the rest red. One token is drawn without looking, every token equally likely.`,
 q02: t => `The dispatch log shows that ${35 + t} of the last 50 supply runs arrived on time. Assume the pattern holds for the next 200 runs.`,
 q03: t => `A deck of 25 equally likely route cards has ${t + 11} cards that name the canyon route. A is the event “the card names the canyon route”.`,
 q04: t => `Two fair spinners are each numbered 1 to 6, so the grid of outcomes has 36 cells. Both are spun and the numbers added; look at the sum ${2 + (t + 10) % 11}.`,
 q05: t => `On a Venn diagram of crates, 6 sit in circle F outside the overlap, ${1 + (t + 10) % 10} sit in the overlap, 4 sit in circle C outside the overlap and 5 sit outside both.`,
 q06: t => `P(A) = 0.5, P(B) = 0.3 and P(A and B) = ${window.Gen.n((t + 11) / 100)}.`,
 q07: t => `The shed table: Rhea Depot sent 40 intact and 10 cracked crates; Tycho Works sent ${39 - t} intact and ${t + 11} cracked crates. A crate is known to come from Tycho Works.`,
 q08: t => `A stack holds 10 crates, ${2 + (t + 10) % 8} of them faulty. Two are taken at random without replacement.`,
 q09: t => `P(A) = 0.4 and P(B) = ${window.Gen.n((4 * (t + 11)) / 100)}, and A and B are independent.`,
 q10: t => `Crates come from Rhea Depot with probability 0.6 and from Tycho Works with probability 0.4. A Rhea crate is damaged with probability 0.05, a Tycho crate with probability ${window.Gen.n((t + 11) / 100)}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
