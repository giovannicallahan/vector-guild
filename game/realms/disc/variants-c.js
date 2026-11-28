/* Discrete mathematics review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `${3 + (t + 10) % 4} different jobs go to 3 crews, each job to exactly one crew.`,
 q22: t => `${2 + (t + 10) % 6} labelled crates go back into their ${2 + (t + 10) % 6} labelled bins, one crate to a bin.`,
 q23: t => `${5 + (t + 10) % 8} identical crates are shared among 3 domes, and each dome can hold at most 4.`,
 q24: t => `A crate stack has a₁ = ${1 + (t + 10) % 9} and aₙ = 2aₙ₋₁ + 1 for n ≥ 2.`,
 q25: t => `An arithmetic sequence starts at 5 with common difference ${1 + (t + 10) % 9}.`,
 q26: t => `A geometric sequence starts at 3 and doubles each time. Take its first ${3 + (t + 10) % 6} terms.`,
 q27: t => { const k = (t + 10) % 11 - 2, list = [1, 2, 3, 4, 5].map(m => 2 * m * m + k * m + 1); return `A list comes from the simplest polynomial in n that fits it: ${list.join(', ')}, ….`; },
 q28: t => `A sequence has a₀ = 2, a₁ = ${1 + (t + 10) % 10} and aₙ = aₙ₋₁ + aₙ₋₂ for n ≥ 2.`,
 q29: t => `A stock line starts with ${1 + (t + 10) % 7} in week 1 and doubles every week.`,
 q30: t => { const N = 5 + (t + 10) % 16; return `A store has a₀ = 3 and aₙ = aₙ₋₁ + 2n for n ≥ 1. Look ahead to week ${N}.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
