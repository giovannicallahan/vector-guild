/* Abstract algebra: patterns of moves concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const phi = m => { let c = 0; for (let i = 1; i <= m; i++) if (gcd(i, m) === 1) c++; return c; };
/* The same table is copied in variants-d.js: keep the two files in step. */
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
const PART = [1, 1, 2, 3, 5, 7, 11, 15];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Any item can reach any other, so |stabiliser| = |G| ÷ (number of items). */
 q31: t => { const [s, G, its, o] = D.solid(t);
  return E('Predict the size of the stabiliser of one of them.', `The orbit of one of the ${its} is all ${n(o)} of them, so by the orbit–stabiliser theorem the stabiliser has ${n(G)} ÷ ${n(o)} = ${n(G / o)} turns.`, [['Stabiliser size', G / o], ['Orbit size', o], ['Group size', G]]); },
 /* Class size 720 ÷ (k^m × m! over the cycle lengths, fixed points as 1-cycles). */
 q32: t => { const ty = D.type(t), fixed = 6 - ty.reduce((s, k) => s + k, 0), all = fixed ? [...ty, ...Array(fixed).fill(1)] : ty;
  const f = x => x <= 1 ? 1 : x * f(x - 1); let den = 1; for (const k of new Set(all)) { const m = all.filter(x => x === k).length; den *= Math.pow(k, m) * f(m); }
  return E('Predict how many permutations of 6 symbols have this cycle type.', `6! = 720. Dividing by kᵐ × m! for each cycle length gives ${n(den)}, so the class has 720 ÷ ${n(den)} = ${n(720 / den)} permutations.`, [['Class size', 720 / den], ['Ways to write each one', den]]); },
 /* Necklaces of n beads in 2 colours under turns: (1/n) Σ 2^gcd(r, n). */
 q33: t => { const m = D.ring(t), fix = []; for (let r = 0; r < m; r++) fix.push(Math.pow(2, gcd(r, m))); const s = fix.reduce((a, b) => a + b, 0);
  return E('Predict the number of different designs.', `The turns of 0 to ${n(m - 1)} steps leave ${fix.map(n).join(', ')} colourings unchanged, ${n(s)} in all, and ${n(s)} ÷ ${n(m)} = ${n(s / m)}.`, [['Different designs', s / m], ['Total unchanged', s], ['Turns', m]]); },
 /* 2^a × 3 has p(a) × 1 abelian groups. */
 q34: t => { const a = D.expo(t), N = Math.pow(2, a) * 3;
  return E('Predict the number of abelian groups of this order.', `${n(N)} = 2 to the power ${n(a)} × 3. The exponent ${n(a)} has ${n(PART[a])} partitions and the exponent 1 has 1, so there are ${n(PART[a])} × 1 = ${n(PART[a])} abelian groups.`, [['Abelian groups', PART[a]], ['Order', N]]); },
 /* Z_n: n − 1 − φ(n) zero divisors. */
 q35: t => { const N = D.zn(t), u = phi(N);
  return E('Predict the number of zero divisors.', `${n(u)} of the ${n(N - 1)} non-zero elements are coprime to ${n(N)} (units), so ${n(N - 1)} − ${n(u)} = ${n(N - 1 - u)} are zero divisors.`, [['Zero divisors', N - 1 - u], ['Units', u]]); },
 /* (a x + 3) mod 13 = 8, so a x mod 13 = 5. */
 q36: t => { const a = D.coef(t); let y = 1; while ((a * y) % 13 !== 1) y++; const x = (5 * y) % 13;
  return E('Predict x.', `Subtract 3: ${n(a)}x mod 13 = 5. The inverse of ${n(a)} is ${n(y)}, so x = 5 × ${n(y)} mod 13 = ${n(x)}.`, [['x', x], ['Inverse of a', y]]); },
 /* Roots of x² + c in Z_7. */
 q37: t => { const c = D.cst(t), vals = []; for (let r = 0; r < 7; r++) vals.push((r * r + c) % 7); const k = vals.filter(v => v === 0).length;
  return E('Predict the number of roots in Z₇.', `For r = 0 to 6 the values mod 7 are ${vals.map(n).join(', ')}, and ${n(k)} of them ${k === 1 ? 'is' : 'are'} 0.`, [['Roots', k], ['f(0) mod 7', c]]); },
 /* The ideal made by 36 and b is generated by gcd(36, b). */
 q38: t => { const b = D.step(t), g = gcd(36, b);
  return E('Predict the positive generator of the ideal.', `Euclid’s algorithm gives gcd(36, ${n(b)}) = ${n(g)}, and every 36x + ${n(b)}y is a multiple of it.`, [['Generator', g], ['Second number', b]]); },
 /* (p² − p) ÷ 2 monic irreducible quadratics over Z_p. */
 q39: t => { const p = D.prime(t);
  return E('Predict the number of monic irreducible quadratics.', `There are ${n(p * p)} monic quadratics and ${n(p * (p + 1) / 2)} products (x − r)(x − s), so ${n(p * p)} − ${n(p * (p + 1) / 2)} = ${n((p * p - p) / 2)} are irreducible.`, [['Irreducible quadratics', (p * p - p) / 2], ['Monic quadratics', p * p]]); },
 /* GF(2^k): a cyclic multiplication group of order 2^k − 1 with φ(2^k − 1) generators. */
 q40: t => { const k = D.gfk(t), q = Math.pow(2, k), m = q - 1, f = phi(m);
  return E('Predict the number of generators of the multiplication group.', `GF(2 to the power ${n(k)}) has ${n(q)} elements, so its multiplication group is cyclic of order ${n(m)}, with one generator for each of the ${n(f)} numbers from 1 to ${n(m)} coprime to ${n(m)}.`, [['Generators', f], ['Group order', m], ['Elements', q]]); }
});
})();
