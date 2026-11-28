/* Abstract algebra: patterns of moves concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const SUB = '₀₁₂₃₄₅₆₇₈₉', Z = m => 'Z' + String(m).split('').map(d => SUB[d]).join('');
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* 3 to the power 1000 + (t + 10) mod 7: by Fermat only the remainder of the power on division by 6 matters. */
 q21: t => { t = T(t); const k = 1010 + t, r = k % 6; let v = 1; for (let i = 0; i < r; i++) v = v * 3 % 7;
  return E('Predict the remainder of 3 to this power on division by 7.', `7 is prime, so by Fermat’s little theorem 3⁶ mod 7 = 1 and φ(7) = 6. ${n(k)} leaves ${n(r)} on division by 6, so the answer is 3 to the power ${n(r)} mod 7 = ${n(v)}.`, [['Remainder mod 7', v], ['Power mod 6', r], ['φ(7)', 6]]); },
 /* σ: 1→2, 2→4, 3→1, 4→5, 5→3, and τ the turn i ↦ i + s round 1 … 5 with s from 1 to 4; the slot j from 1 to 5. */
 q22: t => { t = T(t); const s = 1 + (t + 10) % 4, j = 1 + (t + 10) % 5, sig = [2, 4, 1, 5, 3], tau = x => (x - 1 + s) % 5 + 1, inv = x => (x - 1 - s + 10) % 5 + 1;
  const a = inv(j), b = sig[a - 1], v = tau(b);
  return E('Predict (τ ∘ σ ∘ τ⁻¹) of the slot.', `τ⁻¹(${n(j)}) = ${n(a)}, σ(${n(a)}) = ${n(b)} and τ(${n(b)}) = ${n(v)}.`, [['(τ ∘ σ ∘ τ⁻¹)(slot)', v], ['τ⁻¹(slot)', a], ['Turn of τ', s]]); },
 /* ⟨a⟩ in Z₃₆ for a from 2 to 22. */
 q23: t => { t = T(t); const a = t + 12, g = gcd(a, 36);
  return E('Predict the number of elements of ⟨a⟩ in Z₃₆.', `gcd(${n(a)}, 36) = ${n(g)}, so ⟨${n(a)}⟩ = ⟨${n(g)}⟩ has 36 ÷ ${n(g)} = ${n(36 / g)} elements, and its index is ${n(g)}.`, [['Elements of ⟨a⟩', 36 / g], ['Index', g], ['gcd(a, 36)', g]]); },
 /* φ(x) = 3x mod 18 from Z₁₂ (well defined: 3 × 12 = 36), at x from 1 to 11. */
 q24: t => { t = T(t); const x = 1 + (t + 10) % 11, v = 3 * x % 18;
  return E('Predict φ(x) for this reading.', `φ(${n(x)}) = 3 × ${n(x)} mod 18 = ${n(3 * x)} mod 18 = ${n(v)}. The rule is well defined because 3 × 12 = 36 is a multiple of 18.`, [['φ(x)', v], ['3x', 3 * x]]); },
 /* x ↦ kx mod 36 on Z₃₆ for k from 2 to 21. */
 q25: t => { t = T(t); const k = 2 + (t + 10) % 20, g = gcd(k, 36);
  return E('Predict the number of elements of the kernel.', `gcd(${n(k)}, 36) = ${n(g)}, so ${n(k)}x mod 36 = 0 exactly when x is a multiple of ${n(36 / g)}: the kernel has ${n(g)} elements and the image ${n(36 / g)}.`, [['Kernel size', g], ['Image size', 36 / g]]); },
 /* Z₄ × Z_b for b from 3 to 12. */
 q26: t => { t = T(t); const b = 3 + (t + 10) % 10, g = gcd(4, b), L = 4 * b / g;
  return E('Predict the largest order of an element of Z₄ × Z_b.', `gcd(4, ${n(b)}) = ${n(g)}, so the largest order is lcm(4, ${n(b)}) = ${n(4 * b)} ÷ ${n(g)} = ${n(L)}, the order of (1, 1). It is ${L === 4 * b ? '' : 'not '}a copy of ${Z(4 * b)}.`, [['Largest order', L], ['Number of states', 4 * b], ['gcd(4, b)', g]]); },
 /* The reading w of Z₃₅ matched to the pair (x, y) of Z₅ × Z₇. */
 q27: t => { t = T(t); const u = t + 10, x = (2 * u + 1) % 5, y = (3 * u + 2) % 7; let w = y; while (w % 5 !== x) w += 7;
  return E('Predict the reading w of Z₃₅ with w mod 5 = x and w mod 7 = y.', `The numbers below 35 that leave ${n(y)} on division by 7 are ${[0, 1, 2, 3, 4].map(i => n(y + 7 * i)).join(', ')}; ${n(w)} is the one that leaves ${n(x)} on division by 5.`, [['w', w], ['x', x], ['y', y]]); },
 /* The coset x + ⟨12⟩ in Z₂₄ / ⟨12⟩ for x from 1 to 11. */
 q28: t => { t = T(t); const x = 1 + (t + 10) % 11, g = gcd(x, 12);
  return E('Predict the order of the coset x + H in Z₂₄/H, where H = ⟨12⟩.', `The quotient has 12 elements. The order of ${n(x)} + H is the smallest k with ${n(x)}k a multiple of 12: 12 ÷ gcd(${n(x)}, 12) = 12 ÷ ${n(g)} = ${n(12 / g)}.`, [['Order of x + H', 12 / g], ['gcd(x, 12)', g], ['Elements of Z₂₄/H', 12]]); },
 /* φ(x) = kx mod 12 from Z₂₄ for k from 1 to 11 (well defined: 24k is a multiple of 12). */
 q29: t => { t = T(t); const k = 1 + (t + 10) % 11, g = gcd(k, 12), ker = 24 / (12 / g);
  return E('Predict the number of elements of the image.', `gcd(${n(k)}, 12) = ${n(g)}, so the kernel is the multiples of ${n(12 / g)} below 24: ${n(ker)} elements. By the first isomorphism theorem the image has 24 ÷ ${n(ker)} = ${n(24 / ker)} elements.`, [['Image size', 24 / ker], ['Kernel size', ker]]); },
 /* A ring of 12 slots made by repeating R followed by p − 1 B tiles, p from 2, 3, 4, 6, 12. */
 q30: t => { t = T(t); const p = [2, 3, 4, 6, 12][(t + 10) % 5];
  return E('Predict the size of the orbit of this colouring under the 12 turns.', `The colouring first comes back after a turn of ${n(p)} slots, so the orbit has ${n(p)} colourings and ${n(12 / p)} of the 12 turns leave it unchanged.`, [['Orbit size', p], ['Turns that leave it unchanged', 12 / p]]); },
});
})();
