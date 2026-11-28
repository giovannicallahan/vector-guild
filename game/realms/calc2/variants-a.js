/* Calculus 2: accumulation review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `A settling tank holds 150 litres at t = 0 and is fed at r(t) = 3t² + 4t litres per minute. Look at the moment t = ${2 + (t + 10) % 5}.`,
 q02: t => `The reservoir’s running total is F(x) = ∫ from 1 to x of (3t² − 4t + 5) dt kilolitres, x hours in. Take x = ${2 + (t + 10) % 6}.`,
 q03: t => `The intake passes water at r(t) = 3t² + 2 litres per second. Take the interval from t = 0 to t = ${1 + (t + 10) % 8}.`,
 q04: t => `A mixing tank is fed at r(t) = 6t(t² + 1)² litres per minute. Find ∫ from 0 to ${1 + (t + 10) % 3} of r(t) dt, with u = t² + 1.`,
 q05: t => `A feed line delivers 6 ÷ (t + 2) litres per minute. Take the interval from t = 0 to t = ${1 + (t + 10) % 8}.`,
 q06: t => `A camera 2 metres from a channel turns at 2 ÷ (4 + t²) radians per second. Take the interval from t = 0 to t = ${1 + (t + 10) % 8}.`,
 q07: t => { const w = 1 + (t + 10) % 5; return `A plate is cut between the line y = ${6 * w}x and the curve y = 6x², in metres.`; },
 q08: t => { const h = 1 + (t + 10) % 5; return `A fin lies between the curve x = 3y² and the straight edge x = ${3 * h * h}, in metres.`; },
 q09: t => `A solid stands on the region under y = 2√x from x = 0 to x = ${1 + (t + 10) % 8}, in metres; every cross-section perpendicular to the x-axis is a square.`,
 q10: t => `The region under y = √x from x = 0 to x = ${1 + (t + 10) % 8}, in metres, is spun about the x-axis.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
