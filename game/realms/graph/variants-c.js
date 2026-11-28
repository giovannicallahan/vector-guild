/* Graph theory: networks review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `Four stations, every pair joined by a road. Lengths in km: 1–2: ${[2, 3, 4, 5, 7, 8, 9, 10, 11, 12][(t + 10) % 10]}, 1–3: 6, 1–4: 9, 2–3: 4, 2–4: 7, 3–4: 3. Use the nearest-neighbour method from station 1.`,
 q22: t => `A simple network has ${3 + (t + 10) % 18} stations. Dirac’s theorem guarantees a Hamilton cycle when every degree is at least half the number of stations.`,
 q23: t => `Roads in km: 1–2: 4, 2–4: ${1 + (t + 10) % 15}, 1–3: 7, 3–4: 5. There are no other roads.`,
 q24: t => `A connected network with 10 vertices and ${9 + (t + 10) % 16} edges is drawn flat with no crossings.`,
 q25: t => `A planar network has ${13 + t} vertices, no loops and no two edges joining the same pair.`,
 q26: t => `A prism has two end faces with ${3 + (t + 10) % 18} sides each, joined by rectangles.`,
 q27: t => `The complete bipartite graph K_{${2 + (t + 10) % 8},5} joins each of ${2 + (t + 10) % 8} vertices to each of 5 others.`,
 q28: t => `A ring of ${3 + (t + 10) % 18} parts, each linked to the next and the last back to the first. Linked parts must get different colours.`,
 q29: t => `A hub exam conflicts with every exam in a ring of ${3 + (t + 10) % 18}, and each ring exam conflicts with the next, the last with the first. The network is drawn flat with no crossings.`,
 q30: t => { const k = 2 + (t + 10) % 9; return `${k} crew and ${k - 1} tasks, numbered from 1. Crew member i can do task i − 1 or task i, where that task exists. Each person takes at most one task and each task at most one person.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
