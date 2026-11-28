/* Graph theory: networks review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const m = 3 + 2 * ((t + 10) % 3), k = 3 + 2 * (Math.floor((t + 10) / 3) % 3); return `A street grid is ${m} blocks wide and ${k} blocks deep. A sweeper must drive every block-long road and finish where it started.`; },
 q12: t => `A tree of cables links ${t + 15} domes.`,
 q13: t => { const d3 = 1 + (t + 10) % 5, d4 = 1 + Math.floor((t + 10) / 5) % 3; return `In a tree, the number of domes of degree 3 is ${d3} and of degree 4 is ${d4}. Every other dome is a leaf.`; },
 q14: t => { const V = 6 + (t + 10) % 4, E2 = V + 2 + Math.floor((t + 10) / 4) % 4; return `A connected network has ${V} domes and ${E2} tunnels.`; },
 q15: t => `Two hub domes are joined by three routes that meet only at the hubs, of 2, 3 and ${2 + (t + 10) % 11} cables.`,
 q16: t => `Four domes, cable lengths 1–2 (3), 2–3 (15), 3–4 (4), 4–1 (${t + 11}) and 1–3 (16).`,
 q17: t => `Hubs 1 and 2 are joined by the routes 1–3–2 with lengths 4 and 9, 1–4–2 with 7 and 2, and 1–5–2 with ${t + 11} and 22.`,
 q18: t => `Road times in minutes: 1–2 (2), 1–3 (16), 2–3 (${t + 11}), 2–4 (12), 3–4 (1), 3–5 (6), 4–5 (3).`,
 q19: t => `Every pair of ${4 + (t + 10) % 6} stations is linked. A drone leaves the depot, calls at every other station once and returns.`,
 q20: t => `Four stations, every pair linked, flight times 1–2 (5), 1–3 (${t + 11}), 1–4 (20), 2–3 (6), 2–4 (9), 3–4 (4).`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
