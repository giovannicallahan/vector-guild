/* Complex analysis: the plane of numbers review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const N = x => window.Gen.n(x);
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const TR = [[3, 4], [-6, 8], [5, -12], [-8, -15], [7, 24], [-9, 12], [12, 5], [-15, 8], [24, -7], [-4, -3], [8, 6]], [a, b] = TR[(t + 10) % 11]; return `The rotor log stores the position z = ${N(a)} ${b < 0 ? '−' : '+'} ${N(Math.abs(b))}i.`; },
 q12: t => { const s = (t + 10) % 7 - 3; return `f(z) = z³ + 2z² − 5z + 4. Take z₀ = ${s === 0 ? '1' : `1 ${s < 0 ? '−' : '+'} ${Math.abs(s) === 1 ? '' : N(Math.abs(s))}i`}.`; },
 q13: t => { const a = 1 + (t + 10) % 6; return `u(x, y) = ${a === 1 ? '' : a}x³ − kxy² + 2x and v(x, y) = ${3 * a}x²y − ${a === 1 ? '' : a}y³ + 2y, with k a constant.`; },
 q14: t => { const b = t < 0 ? t : t + 1; return `f(z) = (z² + 3)(z ${b < 0 ? '−' : '+'} ${N(Math.abs(b))}). Take z₀ = 1 + i.`; },
 q15: t => `Take y = ${N(0.5 + 0.5 * ((t + 10) % 6))}. Angles are in radians.`,
 q16: t => { const c = t < 0 ? t : t + 1; return `u(x, y) = ax² + 4xy ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : N(Math.abs(c))}y², with a a constant.`; },
 q17: t => { const a = t < 0 ? t : t + 1; return `u(x, y) = ${a === 1 ? '' : a === -1 ? '−' : N(a)}x³ + kxy² + 3y, with k a constant.`; },
 q18: t => `Integrate z along the straight segment from 0 to B = ${t === 0 ? '2i' : `${N(t)} + 2i`}, parametrised as γ(t) = tB for t from 0 to 1.`,
 q19: t => { const s = (t + 10) % 7 - 3; return `Integrate 3z² along any route from 0 to b = ${s === 0 ? 'i' : `${N(s)} + i`}.`; },
 q20: t => `Round the circle |z − 1| = 2, once anticlockwise, take A = ${N(t < 0 ? t : t + 1)}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
