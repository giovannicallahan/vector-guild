/* Complex analysis: the plane of numbers review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const cx = (a, b) => { if (b === 0) return n(a); const im = (Math.abs(b) === 1 ? '' : n(Math.abs(b))) + 'i'; if (a === 0) return (b < 0 ? '−' : '') + im; return `${n(a)} ${b < 0 ? '−' : '+'} ${im}`; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const piT = (p, q) => { if (p === 0) return '0'; const g = gcd(p, q); p /= g; q /= g; const top = p === 1 ? 'π' : p === -1 ? '−π' : n(p) + 'π'; return q === 1 ? top : `${top} ÷ ${n(q)}`; };
const root = k => ({ 2: 'square', 3: 'cube', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth' })[k] + ' roots';
/* Each statement describes the numbers of the matching model in experiments-a.js. */
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `z = 3 + 2i and w = ${cx(t, 4)}. Work out the product zw.`,
 q02: t => `z = ${cx(t, 5)} and w = 1 + 2i. Work out z ÷ w.`,
 q03: t => `An antenna signal sits at the point z = ${cx(-4, t)} of the complex plane.`,
 q04: t => `A signal is z = 4e^(iθ) with θ = ${piT(t, 6)} radians.`,
 q05: t => `A rotor stage multiplies a signal by 1 + i each pass. Work out (1 + i) to the power ${n(1 + (t + 10) % 12)}.`,
 q06: t => `Find the ${root(2 + (t + 10) % 7)} of 1, the roots of unity of that order.`,
 q07: t => `The rotor controller maps z to f(z) = z² + 2 − 3i. Take the setting z = ${cx(t, 2)}, with z = x + yi and f(z) = u + vi.`,
 q08: t => `A rotor position is e^z with z = 1 + yi and y = ${piT(t, 6)} radians.`,
 q09: t => `A rotor reading is z = ${cx(-2, t)}; take its principal logarithm Log z.`,
 q10: t => `Take the principal value of i to the power ${cx(0, t / 4)}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
