/* Discrete mathematics review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => { const k = t + 10, A = 1 + k % 3, B = 1 + Math.floor(k / 3); return `A pattern count follows aₙ = aₙ₋₁ + 2aₙ₋₂, with a₀ = ${A + B} and a₁ = ${window.Gen.n(2 * A - B)}.`; },
 q32: t => `A strip ${3 + (t + 10) % 11} units long is covered end to end with tiles 1 unit long and tiles 2 units long.`,
 q33: t => `Mira pays with up to 4 one-credit tokens, 3 two-credit tokens and 2 five-credit tokens, tokens of one value being alike: (1 + x + x² + x³ + x⁴)(1 + x² + x⁴ + x⁶)(1 + x⁵ + x¹⁰). Take k = ${1 + (t + 10) % 20}.`,
 q34: t => `A crew of 3 is chosen from ${5 + (t + 10) % 8} tilers, one of whom is the foreman.`,
 q35: t => `Divide ${window.Gen.n(-5 - 3 * (t + 10))} by 7, with a remainder from 0 to 6.`,
 q36: t => `Today is Wednesday (code 2), with the days coded 0 for Monday up to 6 for Sunday. A convoy leaves ${40 + 10 * (t + 10)} days from now.`,
 q37: t => { const pairs = [[4, 2], [4, 3], [5, 2], [5, 4], [6, 2], [6, 3], [6, 4], [6, 5], [7, 2], [7, 4], [7, 6], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]], [v, k] = pairs[(t + 10) % pairs.length]; return `A road map has ${v} junctions, and every junction has degree ${k}.`; },
 q38: t => { const v = 6 + (t + 10) % 10, e = v + 2 + (t + 10) % 4; return `A connected network links ${v} junctions with ${e} roads, and some roads are to close so that what is left is a tree.`; },
 q39: t => { const maps = [[2, 2, 2, 2], [1, 2, 2, 1], [3, 3, 3, 3], [2, 2, 4, 2, 2], [3, 2, 3, 2], [3, 1, 1, 1], [2, 3, 3, 2, 2], [3, 3, 3, 3, 2, 2]], d = maps[(t + 10) % maps.length]; return `A connected road map has junctions of degrees ${d.slice(0, -1).join(', ')} and ${d[d.length - 1]}.`; },
 q40: t => `A connected depot plan has junction degrees 2, 4, 3, 3, 2, 4 and 2, and ${200 + 13 * (t + 10)} reflector posts are shared equally among its roads.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
