/* Topology: shape without size review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
/* The same tables as experiments-b.js, in the same order. */
const SNIPS = [['T', 'a straight crossbar with a stem hanging from its midpoint', 'the point where the stem meets the crossbar'], ['X', 'two straight strokes crossing at their midpoints', 'the crossing point'],
 ['A', 'two strokes meeting at the apex, joined by a crossbar, with feet below the bar', 'the apex at the top'], ['H', 'two stems joined by a crossbar between their midpoints', 'the middle of the crossbar'],
 ['K', 'a stem with two arms going right from one point at its middle', 'the point where the two arms meet the stem'], ['O', 'a single closed loop', 'the top of the loop'],
 ['E', 'a stem with three arms going right, from its top, middle and bottom', 'the point where the middle arm meets the stem'], ['P', 'a stem with a bowl from its top back to its middle', 'the point where the bowl meets the middle of the stem'],
 ['B', 'a stem with two bowls, from its top to its middle and from its middle to its bottom', 'the point where both bowls meet the middle of the stem'],
 ['R', 'a stem with a bowl from its top back to its middle and a leg from that middle point', 'the point where the bowl and the leg meet the stem'], ['L', 'a stem with a foot going right from its bottom', 'the corner']];
const TARGETS = ['T', 'O', 'X', 'B', 'Y', 'L', 'D', 'K', 'I', 'F', 'A'];
const WORDS = ['a b a⁻¹ b⁻¹', 'a a⁻¹ b b⁻¹', 'a b a b', 'a b a⁻¹ b', 'a b c a', 'a a b c', 'a b c a⁻¹', 'a a⁻¹ b c', 'a b⁻¹ a b'];
const SURF = ['a disc', 'an annulus', 'a Möbius strip', 'a pair of trousers', 'a cylinder'];
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const k = 1 + (t + 10) % 6; return `Six relay nodes A, B, C, D, E, F have the open sets ∅, {A}, {A, B}, {A, B, C}, {A, B, C, D}, {A, B, C, D, E} and {A, B, C, D, E, F}. Take the closure of {${'ABCDEF'[k - 1]}}.`; },
 q12: t => { const k = 1 + (t + 10) % 9; return `Remove ${k} ${k === 1 ? 'point' : 'different points'} from the real line, which runs for ever both ways.`; },
 q13: t => { const [L, d, p] = SNIPS[(t + 10) % SNIPS.length]; return `A cable is bent into the stencil letter ${L}, ${d}. Snip out ${p}.`; },
 q14: t => `The stencil word is TEXTBOOK, in thin strokes. Take the letter ${TARGETS[(t + 10) % TARGETS.length]}. Count a letter each time it appears.`,
 q15: t => `A cable runs along the closed interval [0, ${t + 14}] metres. Each clamp grips an open interval 2 metres long and may reach past either end.`,
 q16: t => `f(x) = x² − 4x + 1 on the closed interval [0, ${1 + (t + 10) % 8}].`,
 q17: t => `A cable runs along the closed interval [0, ${t + 13}] metres. Each clamp grips an open interval 3 metres long and may reach past either end.`,
 q18: t => `A square's edges, read clockwise from the top-left corner, are labelled ${WORDS[(t + 10) % WORDS.length]}; a letter alone points clockwise, ⁻¹ anticlockwise. Edges with the same letter are sewn arrow on arrow.`,
 q19: t => { const k = Math.floor((t + 10) / 5) % 4; return `Take ${SURF[(t + 10) % 5]} and cut ${k} small round ${k === 1 ? 'hole' : 'holes'} in it, away from its edges and from each other.`; },
 q20: t => `A dome frame is a prism with two flat ${3 + (t + 10) % 7}-sided ends joined by rectangular side panels.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
