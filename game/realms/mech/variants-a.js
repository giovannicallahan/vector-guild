/* Mechanics: motion and force review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `The survey rover’s dashboard shows ${9 * (2 + (t + 10) % 9)} km/h.`,
 q02: t => `A timing-gate pulse lasts ${window.Gen.n((15 + 10 * ((t + 10) % 9)) / 10)} × 10⁻⁵ s.`,
 q03: t => `A survey marker is 20 m from the mast, in the direction ${window.Gen.n(Math.round(3 * (t + 11)) / 10)} radians anticlockwise from the positive x-axis (east).`,
 q04: t => { const k = Math.max(-10, Math.min(10, Math.round(Number(t) || 0))); return `A drone flies A = 3î + 4ĵ metres and then B = ${k === 0 ? '2ĵ' : `${k < 0 ? '−' : ''}${Math.abs(k) === 1 ? '' : Math.abs(k)}î + 2ĵ`} metres.`; },
 q05: t => { const k = Math.max(-10, Math.min(10, Math.round(Number(t) || 0))); return `Two sight lines run along A = 3î − 2ĵ and B = ${k === 0 ? '4ĵ' : `${k < 0 ? '−' : ''}${Math.abs(k) === 1 ? '' : Math.abs(k)}î + 4ĵ`}, in metres.`; },
 q06: t => `A sled starts at x = 0 m, slides up to x = 20 m, turns round and stops at x = ${window.Gen.n(2 * Math.max(-10, Math.min(10, Math.round(Number(t) || 0))))} m, 4 s after it started.`,
 q07: t => `A sled’s position is x(t) = 10 + 4t + 3t² − t³ metres. Look at the moment t = ${(t + 10) % 6} s.`,
 q08: t => `A sled’s velocity is v(t) = 2t² − 3t + 5 metres per second. Look at the moment t = ${t + 10} s.`,
 q09: t => `A sled moving at ${2 * (t + 12)} m/s brakes with a constant deceleration of 2 m/s².`,
 q10: t => `A pod is thrown straight up at ${window.Gen.n(4.9 * (t + 12))} m/s from a hand 10 m above the ground (g = 9.8 m/s², no air resistance).`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
 q04: [-9, -7, -5, -4, -2, -1, 1, 2, 4, 5, 7, 9],
});
})();
