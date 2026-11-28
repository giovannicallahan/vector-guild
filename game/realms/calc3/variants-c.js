/* Calculus 3: many variables review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const n = x => window.Gen.n(x);
/* The same helper as gen-c.js and experiments-c.js. */
const poly = terms => { let s = ''; for (const [c, x] of terms) { if (!c) continue; const m = Math.abs(c), body = m === 1 && x ? x : n(m) + x; s = s ? s + (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; } return s || '0'; };
Object.assign(window.VARIANT_SETUP, {
 q21: t => `f(x, y) = ${poly([[1, 'x²'], [t, 'xy'], [3, 'y²']])} has a critical point at (0, 0).`,
 q22: t => { const r = 1 + (t + 10) % 10; return `A sensor moves on the circle x² + y² = ${r * r}, and it reads f(x, y) = 3x + 4y.`; },
 q23: t => `f(x, y) = ${poly([[1, 'x²'], [2, 'y²'], [-2 * t, 'x'], [5, '']])} has exactly one critical point.`,
 q24: t => `A roof of height h(x, y) = 4 + xy metres stands over the floor 0 ≤ x ≤ 4, 0 ≤ y ≤ ${1 + (t + 10) % 6}.`,
 q25: t => `Find ∬ 4x dA over the region between the x-axis, the line x = ${1 + (t + 10) % 5} and the curve y = x².`,
 q26: t => `Integrate f(x, y) = x² + y² over the whole disc of radius ${1 + (t + 10) % 5} round the origin, in polar coordinates.`,
 q27: t => `A block fills 0 ≤ x ≤ 2, 0 ≤ y ≤ 2, 0 ≤ z ≤ ${1 + (t + 10) % 6} metres, with density δ = 1 + z tonnes per cubic metre.`,
 q28: t => `A solid ball of radius ${3 * (1 + (t + 10) % 3)} m is centred at the origin. Find its volume in spherical coordinates.`,
 q29: t => { const R = 2 + (t + 10) % 10; return `A half shell above the floor lies between radii ${R} m and ${R + 1} m, with density δ = 6 ÷ ρ tonnes per cubic metre.`; },
 q30: t => { const s = [1, 2, 4, 8][(t + 10) % 4]; return `A plate lies between the lines x + y = 0 and x + y = 4, and between ${poly([[1, 'x'], [1 - s, 'y']])} = 0 and ${poly([[1, 'x'], [1 - s, 'y']])} = 2.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
