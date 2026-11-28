/* Graph theory: networks review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => { const s = 2 + (t + 10) % 4, j = 1 + Math.floor((t + 10) / 4); return `A group of ${s} technicians are all certified for exactly the same ${j === 1 ? 'job' : `${j} jobs`} and for nothing else. Each job takes one technician.`; },
 q32: t => { const k = 2 + (t + 10) % 5, m = 2 + Math.floor((t + 10) / 5); return `One-way pipes run from a source to ${k} first junctions, from every first junction to each of ${m} second junctions, and from every second junction to a sink.`; },
 q33: t => `Source 1 and sink 4, with capacities 1→2 (5), 1→3 (6), 2→3 (2), 2→4 (${1 + (t + 10) % 12}) and 3→4 (7). Take the cut with 1 and 2 on the source side.`,
 q34: t => `Two separate routes run from 1 to 4: 1→2 with capacity ${1 + (t + 10) % 9} then 2→4 with capacity 5, and 1→3 with capacity 6 then 3→4 with capacity ${2 + (t + 10) % 7}.`,
 q35: t => `Cable plans link ${3 + (t + 10) % 5} numbered domes as a tree.`,
 q36: t => { const k = 1 + (t + 10) % 5; return `A tree on 8 vertices has the Prüfer code (${[...Array(k).fill(1), ...Array(6 - k).fill(2)].join(', ')}).`; },
 q37: t => `The ring C${String(4 + (t + 10) % 12).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('')} has ${4 + (t + 10) % 12} vertices, each joined to the next and the last to the first.`,
 q38: t => `The complete graph on ${4 + (t + 10) % 12} vertices, with every pair joined.`,
 q39: t => `Every edge of the complete graph on ${3 + (t + 10)} vertices is coloured cable or beam.`,
 q40: t => `A grid on a torus has ${3 + (t + 10) % 8} circles round the tube and 5 round the ring, each circle of one kind crossing each of the other kind once.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
