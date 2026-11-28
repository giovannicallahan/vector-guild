/* Topology: shape without size review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
const RULE = 'read counterclockwise from corner 1, with edge 1 from corner 1 to corner 2 and so on; ⁻¹ means the arrow points back, and edges with the same letter are sewn arrow to arrow';
/* Same lists as experiments-c.js. */
const WORDS22 = ['a a', 'a b a⁻¹ b⁻¹', 'a b a⁻¹ b', 'a a b b', 'a b b⁻¹ a⁻¹', 'a b c a⁻¹ b⁻¹ c⁻¹', 'a b c a b c', 'a b c c⁻¹ b a'];
const WORDS23 = ['a free a free', 'a free a⁻¹ free', 'free free free', 'a b a⁻¹ b⁻¹ free', 'a a free', 'a b a⁻¹ free b free', 'a free free a'];
const WORDS28 = ['a b a⁻¹ b⁻¹', 'a b a⁻¹ b', 'a a b b', 'a b c a⁻¹ b⁻¹ c⁻¹', 'a b c a b c', 'a b a⁻¹ b⁻¹ c d c⁻¹ d⁻¹', 'a a b b c c', 'a b b⁻¹ a⁻¹'];
const SURF = [['sphere', 2], ['torus', 0], ['projective plane', 1], ['Klein bottle', 0]];
const CURVES = [0.0004, 0.0016, 0.0025, 0.0064, 0.01, 0.04, 0.16, 0.25, 0.64, 4];
const edges = w => w.split(' ').length;
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A cable loom is a grid of junctions in 3 rows and ${3 + (t + 10) % 6} columns, each junction joined by a cable to the next one along its row and the next one down its column.`,
 q22: t => { const w = WORDS22[(t + 10) % WORDS22.length]; return `A panel with ${edges(w)} edges has gluing word ${w}, ${RULE}.`; },
 q23: t => { const w = WORDS23[(t + 10) % WORDS23.length]; return `A panel with ${edges(w)} edges reads ${w}, ${RULE}; each “free” edge is sewn to nothing.`; },
 q24: t => { const [A, a] = SURF[(t + 10) % 4], [B, b] = SURF[Math.floor((t + 10) / 4) % 4]; return `Join a ${A} (χ = ${n(a)}) and a ${B} (χ = ${n(b)}) by connected sum.`; },
 q25: t => `A hull is the connected sum of ${pl(1 + (t + 10) % 12, 'torus', 'tori')}: the sphere with that many handles.`,
 q26: t => `A hull is the sphere with ${pl(1 + (t + 10) % 12, 'cross-cap', 'cross-caps')} sewn in; each cross-cap is a projective plane (χ = 1) with a hole.`,
 q27: t => `A hull is the connected sum of ${pl(1 + (t + 10) % 4, 'torus', 'tori')} and ${pl(1 + Math.floor((t + 10) / 4) % 5, 'projective plane', 'projective planes')}.`,
 q28: t => { const w = WORDS28[(t + 10) % WORDS28.length]; return `A panel with ${edges(w)} edges has gluing word ${w}, ${RULE}.`; },
 q29: t => `A panel with gluing word a b a⁻¹ b (4 edges, ${RULE}) is sewn shut, and then ${pl(1 + (t + 10) % 8, 'torus is', 'tori are')} joined on by connected sum.`,
 q30: t => `A spherical tank has curvature ${n(CURVES[(t + 10) % CURVES.length])} per square metre at every point of its wall.`,
});
Object.assign(window.VARIANT_POOL, {
});
})();
