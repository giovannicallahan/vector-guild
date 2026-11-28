/* Abstract algebra: patterns of moves review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const arrows = p => p.map((v, i) => `${i + 1} → ${v}`).join(', ');
/* The bench moves of experiments-b.js (MOVES there), in the same order. */
const BENCH_MOVES = [[2, 1, 4, 5, 3, 7, 8, 6], [3, 4, 1, 2, 6, 5, 8, 7], [2, 3, 4, 1, 6, 7, 5, 8], [5, 1, 2, 3, 4, 7, 6, 8], [2, 1, 3, 5, 6, 7, 8, 4], [4, 2, 6, 1, 3, 8, 5, 7], [1, 3, 2, 5, 6, 4, 8, 7]];
const SIZES = [2, 3, 4, 6, 8, 9, 12, 18, 24, 36];
Object.assign(window.VARIANT_SETUP, {
 q11: t => `A beacon timer works in U(13), multiplying by a mod 13 on every beat. Take a = ${2 + (t + 10) % 11}.`,
 q12: t => `On 6 sockets, σ is 1 → 2, 2 → 5, 3 → 1, 4 → 6, 5 → 3, 6 → 4 and τ is 1 → 4, 2 → 1, 3 → 6, 4 → 2, 5 → 5, 6 → 3. Take socket i = ${1 + (t + 10) % 6}.`,
 q13: t => `A hatch move on 8 sockets is ${arrows(BENCH_MOVES[(t + 10) % 7])}.`,
 q14: t => `A hatch move on 8 sockets is ${arrows(BENCH_MOVES[(t + 10) % 7])}. Write each cycle of length L as L − 1 transpositions.`,
 q15: t => `A hatch has ${3 + (t + 10) % 5} free bolts that can be rearranged among their own sockets in any order.`,
 q16: t => `An 8-cornered hatch has marks 0 to 7 anticlockwise. The corner at mark 2 is turned by ${1 + (t + 10) % 7} steps anticlockwise, then flipped across the line through mark 0.`,
 q17: t => `A 12-cornered hatch, marks 0 to 11, runs the routine: flip across the line through mark 0, then turn by ${1 + (t + 10) % 11} steps anticlockwise, then flip again.`,
 q18: t => `In Z₆₀, take the subgroup ⟨${24 + 2 * t}⟩ made by adding ${24 + 2 * t} again and again, mod 60.`,
 q19: t => `In Z₄₈, H = ⟨8⟩ = {0, 8, 16, 24, 32, 40}. Take the coset ${21 + t} + H.`,
 q20: t => `A group G has 72 elements and a subgroup H has ${SIZES[(t + 10) % 10]}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
