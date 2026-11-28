/* Abstract algebra: patterns of moves review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js (the table D below is copied from it).
   Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
/* The same table as in experiments-d.js: keep the two files in step. */
const D = {
 /* q31: nine solids and the item each acts on; t picks one. */
 solid: t => [['cube', 24, 'faces', 6], ['cube', 24, 'edges', 12], ['cube', 24, 'corners', 8], ['regular octahedron', 24, 'faces', 8], ['regular octahedron', 24, 'corners', 6],
  ['regular octahedron', 24, 'edges', 12], ['regular tetrahedron', 12, 'faces', 4], ['regular tetrahedron', 12, 'edges', 6], ['regular tetrahedron', 12, 'corners', 4]][(T(t) + 10) % 9],
 /* q32: the cycle types of S_6 other than the identity; t picks one. */
 type: t => [[6], [5], [4, 2], [4], [3, 3], [3, 2], [3], [2, 2, 2], [2, 2], [2]][(T(t) + 10) % 10],
 ring: t => 3 + (T(t) + 10) % 6,               // q33: beads, 2 colours
 expo: t => 1 + (T(t) + 10) % 7,               // q34: order 2^a × 3
 zn: t => 12 + T(t),                            // q35: Z_n, n from 2 to 22
 coef: t => 2 + (T(t) + 10) % 11,               // q36: (a x + 3) mod 13 = 8
 cst: t => (T(t) + 10) % 7,                     // q37: x² + c over Z_7
 step: t => 20 + T(t),                          // q38: ideal made by 36 and b, b from 10 to 30
 prime: t => [2, 3, 5, 7, 11, 13, 17, 19][(T(t) + 10) % 8],   // q39
 gfk: t => 2 + (T(t) + 10) % 10                 // q40: GF(2^k), k from 2 to 11
};
const n = x => window.Gen.n(x), SUB = '₀₁₂₃₄₅₆₇₈₉', Z = m => 'Z' + String(m).split('').map(d => SUB[+d]).join('');
const cyc = ty => ty.map(k => `a ${n(k)}-cycle`).join(', ');
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => { const [s, G, its] = D.solid(t); return `The ${n(G)} turns of a ${s} (the do-nothing turn included) act on its ${its}, and any one can be carried to the place of any other.`; },
 q32: t => { const ty = D.type(t), fixed = 6 - ty.reduce((s, k) => s + k, 0); return `In S₆, take the permutations made of ${cyc(ty)}${fixed ? `, and ${fixed === 1 ? '1 fixed symbol' : `${n(fixed)} fixed symbols`}` : ''}.`; },
 q33: t => `A ring of ${n(D.ring(t))} tiles, each black or white, can be turned but not flipped. Colourings that a turn carries onto each other count as one design.`,
 q34: t => { const a = D.expo(t); return `Count the abelian groups of order ${n(Math.pow(2, a) * 3)}, isomorphic groups counted once.`; },
 q35: t => `Take the ring ${Z(D.zn(t))}: the numbers 0 to ${n(D.zn(t) - 1)}, added and multiplied mod ${n(D.zn(t))}.`,
 q36: t => `In the field of the numbers mod 13, solve (${n(D.coef(t))}x + 3) mod 13 = 8 for x from 0 to 12.`,
 q37: t => { const c = D.cst(t); return `Take f(x) = ${c ? `x² + ${n(c)}` : 'x²'} with coefficients mod 7.`; },
 q38: t => `Take the ideal of all the numbers 36x + ${n(D.step(t))}y, for whole numbers x and y.`,
 q39: t => `Count the monic quadratics x² + Bx + C with B and C mod ${n(D.prime(t))} that have no root.`,
 q40: t => `Take the finite field with 2 to the power ${n(D.gfk(t))} elements.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
