/* Topology: shape without size concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
/* q13: a letter, a marked point on it, and the pieces left when that point is removed. */
const SNIPS = [['T', 'the point where the stem meets the crossbar', 3], ['X', 'the crossing point', 4], ['A', 'the apex at the top', 1], ['H', 'the middle of the crossbar', 2],
 ['K', 'the point where the two arms meet the stem', 4], ['O', 'the top of the loop', 1], ['E', 'the point where the middle arm meets the stem', 3], ['P', 'the point where the bowl meets the middle of the stem', 2],
 ['B', 'the point where both bowls meet the middle of the stem', 2], ['R', 'the point where the bowl and the leg meet the stem', 3], ['L', 'the corner', 2]];
/* q14: letters compared with the word TEXTBOOK: [letter, how many letters of TEXTBOOK are homeomorphic to it]. */
const TARGETS = [['T', 3], ['O', 2], ['X', 2], ['B', 1], ['Y', 3], ['L', 0], ['D', 2], ['K', 2], ['I', 0], ['F', 3], ['A', 0]];
/* q18: gluing words and the points the 4 corners become. */
const WORDS = [['a b a⁻¹ b⁻¹', 1], ['a a⁻¹ b b⁻¹', 3], ['a b a b', 2], ['a b a⁻¹ b', 1], ['a b c a', 2], ['a a b c', 3], ['a b c a⁻¹', 3], ['a a⁻¹ b c', 3], ['a b⁻¹ a b', 1]];
/* q19: surfaces with an edge, their boundary circles before any holes. */
const SURF = [['a disc', 1], ['an annulus', 2], ['a Möbius strip', 1], ['a pair of trousers', 3], ['a cylinder', 2]];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Six nodes A–F with the nested open sets ∅, {A}, {A, B}, …: the closure of the k-th node is it and every node after it. */
 q11: t => { t = T(t); const k = 1 + (t + 10) % 6, L = 'ABCDEF'[k - 1], cl = 7 - k;
  return E('Predict the number of nodes in the closure of the chosen node.', `The open sets that miss ${L} are ∅ and the sets of nodes before ${L}; the largest of them has ${n(k - 1)} nodes. The closure is everything else: ${L} and the nodes after it, ${n(cl)} in all.`, [['Nodes in the closure', cl], ['Open sets', 7], ['Largest open set missing it', k - 1]]); },
 /* The number line with k points removed, k from 1 to 9. */
 q12: t => { t = T(t); const k = 1 + (t + 10) % 9;
  return E('Predict the number of components of the line with those points removed.', `Each removed point splits one piece into two, so ${n(k)} removed points leave ${n(k)} + 1 = ${n(k + 1)} components.`, [['Components', k + 1], ['Points removed', k]]); },
 q13: t => { t = T(t); const [L, pt, k] = SNIPS[(t + 10) % SNIPS.length];
  return E('Predict how many pieces the cable falls into when that one point is snipped out.', `Snipping out ${pt} of the letter ${L} leaves ${n(k)} ${k === 1 ? 'piece' : 'pieces'}${k === 1 ? ', so it is not a cut point' : ', so it is a cut point'}.`, [['Pieces', k], ['Cut point (1 or 0)', k > 1 ? 1 : 0]]); },
 q14: t => { t = T(t); const [L, c] = TARGETS[(t + 10) % TARGETS.length];
  return E('Predict how many letters of TEXTBOOK are homeomorphic to the letter.', `Compare end points, branch points and holes: T and E have 3, 1 and 0; X and K have 4 end points and 1 branch point where 4 strokes meet; B has 1 branch point and 2 holes; O has only 1 hole. ${n(c)} of the letters match ${L}.`, [['Letters homeomorphic to it', c], ['Letters in TEXTBOOK', 8]]); },
 /* The cable [0, D] with open clamps 2 metres long, D from 4 to 24. */
 q15: t => { t = T(t); const D = t + 14, k = Math.floor(D / 2) + 1;
  return E('Predict the fewest 2-metre open clamps that cover the cable.', `${n(k)} clamps give ${n(2 * k)} metres, more than ${n(D)}; ${n(k - 1)} give ${n(2 * k - 2)} metres, which is not more than ${n(D)}. So ${n(k)} clamps.`, [['Clamps', k], ['Cable length (m)', D]]); },
 /* f(x) = x² − 4x + 1 on [0, b], b from 1 to 8: the largest value is at an end. */
 q16: t => { t = T(t); const b = 1 + (t + 10) % 8, fb = b * b - 4 * b + 1, max = Math.max(1, fb), min = b > 2 ? -3 : fb;
  return E('Predict the largest value of f on the interval.', `f(0) = 1 and f(${n(b)}) = ${n(fb)}. The critical point x = 2 ${b > 2 ? 'lies inside, where f(2) = −3' : 'is not strictly inside'}. The largest value is ${n(max)} and the smallest ${n(min)}.`, [['Largest value', max], ['Smallest value', min], ['Value at the right end', fb]]); },
 /* The cable [0, D] with open clamps 3 metres long, D from 3 to 23. */
 q17: t => { t = T(t); const D = t + 13, k = Math.floor(D / 3) + 1;
  return E('Predict the fewest 3-metre open clamps that cover the cable.', `${n(k)} clamps give ${n(3 * k)} metres, more than ${n(D)}; ${n(k - 1)} give ${n(3 * k - 3)} metres, which is not more than ${n(D)}. So ${n(k)} clamps.`, [['Clamps', k], ['Cable length (m)', D]]); },
 q18: t => { t = T(t); const [w, V] = WORDS[(t + 10) % WORDS.length], E2 = new Set(w.replace(/⁻¹/g, '').split(' ')).size;
  return E('Predict how many distinct points the 4 corners of the square become.', `Following the tails and heads of the sewn arrows for ${w}, the corners fall into ${n(V)} ${V === 1 ? 'group' : 'groups'}, and ${n(E2)} edges are left.`, [['Corner points', V], ['Edges left', E2]]); },
 q19: t => { t = T(t); const [s, b0] = SURF[(t + 10) % 5], k = Math.floor((t + 10) / 5) % 4, b = b0 + k;
  return E('Predict the number of boundary circles of the finished surface.', `${s.replace(/^an? /, 'The ')} starts with ${n(b0)}; each of the ${n(k)} holes adds one: ${n(b0)} + ${n(k)} = ${n(b)}.`, [['Boundary circles', b], ['Holes cut', k]]); },
 /* A prism with a-sided ends, a from 3 to 9: V = 2a, E = 3a, F = a + 2. */
 q20: t => { t = T(t); const a = 3 + (t + 10) % 7;
  return E('Predict the number of edges E of the prism frame.', `${n(a)} struts round each end and ${n(a)} between the ends: E = ${n(3 * a)}. With V = ${n(2 * a)} and F = ${n(a + 2)}, V − E + F = 2.`, [['Edges E', 3 * a], ['Vertices V', 2 * a], ['Faces F', a + 2], ['Euler characteristic', 2]]); },
});
})();
