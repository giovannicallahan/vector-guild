/* Complex analysis: the plane of numbers review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
/* ' + 3z', ' − z' or nothing for 0: a signed term after a leading term. */
const lin = (c, v) => c === 0 ? '' : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`;
Object.assign(window.VARIANT_SETUP, {
 q21: t => { const c = 1 + (t + 10) % 5; return `A source at the point a = ${window.Gen.n(t)} on the real line makes the field ${c} ÷ (z − a) round the circle |z| = 4, driven once anticlockwise.`; },
 q22: t => `A path drives round the circle |z| = 2 ${Math.abs(t) === 1 ? 'once' : Math.abs(t) + ' times'} ${t > 0 ? 'anticlockwise' : 'clockwise'}. The integrand is 3 ÷ (z − 1).`,
 q23: t => `Round |z| = 3, once anticlockwise, integrate ${window.Gen.n(t)} ÷ (z − 1) + 4 ÷ (z − 5) + 2 ÷ (z − 1)².`,
 q24: t => `f(z) = z²${lin(t, 'z')} + 3, and a coil follows |z| = 3 once anticlockwise.`,
 q25: t => `f(z) = z³${lin(t, 'z²')}, and a coil follows |z| = 3 once anticlockwise.`,
 q26: t => `f is analytic on and inside |z − 2| = 2, and |f(z)| ≤ ${4 * (t + 11)} on that circle.`,
 q27: t => `u(x, y) = x² − y²${lin(t, 'x')}, and a sensor ring is the circle of radius 3 centred at (2, 1).`,
 q28: t => `f(z) = z³${t ? ` ${t < 0 ? '−' : '+'} ${Math.abs(t)}` : ''} on the disc |z| ≤ 3.`,
 q29: t => `f(z) = z²${lin(t, 'z')} + 1, and a coil follows |z| = 2 once anticlockwise.`,
 q30: t => { t = Math.max(-9, Math.min(9, t)); return t === 0 ? 'z = 0, and the sum is 1 + z + z² + z³ + …' : `z = ${t < 0 ? '−' : ''}${Math.abs(t) === 1 ? '' : Math.abs(t)}i ÷ 10, and the sum is 1 + z + z² + z³ + …`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
 q21: [-7, -6, -5, -3, -2, -1, 1, 2, 3, 5, 6, 7],
 q22: [-4, -3, -2, -1, 1, 2, 3, 4],
 q23: [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6],
 q24: [-6, -5, -4, -2, -1, 1, 2, 3, 4, 5],
 q25: [-6, -5, -4, -3, -1, 1, 2, 3, 4, 5],
 q27: [-6, -5, -4, -3, -2, -1, 2, 3, 4, 5],
 q28: [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
 q29: [-6, -5, -4, -3, -1, 1, 2, 3, 4, 5],
 q30: [-9, -7, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 7, 9],
});
})();
