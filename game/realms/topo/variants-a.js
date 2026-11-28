/* Topology: shape without size review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `Two rovers stand on the Survey Grid at P = (0, 0) and Q = (${window.Gen.n(t)}, 4), in kilometres.`,
 q02: t => `A beacon stands at a grid point of the Survey Grid. Count the grid points (both coordinates whole numbers), the beacon included, at taxicab distance at most ${1 + (t + 10) % 10} from it.`,
 q03: t => `Three masts on a flat plain have d(x, y) = 10 km and d(y, z) = ${1 + (t + 10) % 9} km, with the usual straight-line distance.`,
 q04: t => `A cable runs along the open interval (0, 22), and a sensor sits at x = ${t + 11}.`,
 q05: t => { const k = 2 + (t + 10) % 6, parts = []; for (let i = 0; i < k; i++) parts.push(`[${2 * i}, ${2 * i + 1}]`); return `S = ${parts.join(' ∪ ')} on the x-axis, with the usual distance.`; },
 q06: t => `Three drones cover the open stretches (−5, 5), (0, 9) and (${window.Gen.n(-4 + (t + 10) % 9)}, ${-4 + (t + 10) % 9 + 10}) of the x-axis.`,
 q07: t => `A relay network has ${2 + (t + 10) % 10} nodes and the discrete topology, in which every subset is open.`,
 q08: t => { const m = 4 + (t + 10) % 8, sets = ['∅']; for (let i = 1; i <= m; i++) sets.push(`{${Array.from({ length: i }, (_, j) => j + 1).join(', ')}}`); return `X = {${Array.from({ length: m }, (_, j) => j + 1).join(', ')}} has the open sets ${sets.join(', ')}.`; },
 q09: t => { const m = 2 + (t + 10) % 9, sets = []; for (let i = 1; i <= m; i++) sets.push(`{${Array.from({ length: i }, (_, j) => j + 1).join(', ')}}`); return `A basis on X = {${Array.from({ length: m }, (_, j) => j + 1).join(', ')}} is ${sets.join(', ')}. The open sets are all unions of basis sets, with ∅ as the union of none.`; },
 q10: t => { const m = 2 + (t + 10) % 8, sets = ['∅']; for (let i = 1; i <= m; i++) sets.push(`{${Array.from({ length: i }, (_, j) => j + 1).join(', ')}}`); return `X = {${Array.from({ length: m }, (_, j) => j + 1).join(', ')}} has the open sets ${sets.join(', ')}. Y = {a, b} has the open sets ∅, {a}, {a, b}. Count all the maps f from X to Y for which every open set of Y has an open preimage.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
