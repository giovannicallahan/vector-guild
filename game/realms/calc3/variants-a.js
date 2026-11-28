/* Calculus 3: many variables review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => { const k = 1 + (t + 10) % 7; return `Beacon A is at (1, 2, 0) and beacon B at (${n(1 + 2 * k)}, ${n(2 + 3 * k)}, ${n(6 * k)}), in metres.`; },
 q02: t => `u = ⟨3, −1, 2⟩ and v = ⟨1, 4, −2⟩. Take s = ${n(t)} and form su − v.`,
 q03: t => { const k = 1 + (t + 10) % 10; return `v = ⟨${n(2 * k)}, ${n(3 * k)}, ${n(6 * k)}⟩.`; },
 q04: t => `u = ⟨1, 2, 2⟩ and v = ⟨${n(t)}, 3, −2⟩.`,
 q05: t => `A constant force F = ⟨4, 2, ${n(t)}⟩ newtons moves a sled along d = ⟨3, 0, 4⟩ metres.`,
 q06: t => `u = ⟨2, 1, 0⟩ and v = ⟨1, ${n(t)}, 3⟩.`,
 q07: t => `A path is x = 2 + 3t, y = −1 + t, z = 2t. Take t = ${n(t)}.`,
 q08: t => `A panel passes through P(1, 0, 0), Q(0, 2, 0) and R(0, 0, ${n(t + 11)}).`,
 q09: t => `The point (${n(t)}, 1, 1) and the plane 2x + y + 2z = 4.`,
 q10: t => `A drone moves along r(t) = ⟨2t², 5t, t³⟩ metres, t in seconds. Take t = ${n(1 + (t + 10) % 5)}.`,
});
Object.assign(window.VARIANT_POOL, {
 q02: [-5, -4, -3, -2, 2, 3, 4, 5],
 q05: [1, 2, 3, 4, 5, 6],
 q09: [-5, -3, -2, 3, 4, 6],   // |2t − 1| is not a multiple of 3, so the distance is not whole
});
})();
