/* Graph theory: networks review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => { const k = 3 + (t + 10) % 8; return `A hub dome and a row of ${k} domes. Each row dome is linked by a tunnel to the next one along the row, and every row dome has one tunnel to the hub.`; },
 q02: t => `A simple network has ${2 + (t + 10) % 10} domes of degree 4 and 6 domes of degree 3.`,
 q03: t => `Plan a tunnel between every pair of ${t + 15} domes: the complete graph on ${t + 15} vertices.`,
 q04: t => { const k = 6 + (t + 10) % 5; return `A simple graph has ${k} domes and ${k + 2} tunnels, and dome 1 has 3 of them.`; },
 q05: t => `A row of ${4 + (t + 10) % 10} domes, each joined by a tunnel to the next one along, and no other tunnels.`,
 q06: t => `Domes A and B are each joined to all ${2 + (t + 10) % 10} middle domes, and to nothing else. Each middle dome also has one tunnel to an outer dome of its own, which has no other tunnels.`,
 q07: t => { const k = 6 + (t + 10) % 10; return `${k} depots stand in a circle, numbered 1 to ${k} in order. Each is joined by a road to the next, and depot ${k} to depot 1.`; },
 q08: t => `A road map has ${2 + (t + 10) % 5} separate pairs of depots, each pair joined by one road, and ${1 + (t + 10) % 3} more depots with no roads at all.`,
 q09: t => `A hub depot has a road to each of ${3 + (t + 10) % 10} depots that stand in a circle; each depot on the circle also has a road to the next one round the circle.`,
 q10: t => { const a = 1 + (t + 10) % 4, b = a + 2 + (t + 10) % 3; return `Depots 1 to 8 stand in a circle, each joined by a road to the next and depot 8 to depot 1. One more road joins depot ${a} to depot ${b}.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
