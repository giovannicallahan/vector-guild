/* Number theory: the hidden life of whole numbers concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(c => SUP[c]).join('');
const pow = (a, k, m) => { let r = 1, b = a % m; while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const cfrac = (P, Q) => { const a = []; while (Q) { a.push(Math.floor(P / Q)); [P, Q] = [Q, P % Q]; } return a; };
const twoSquares = x => { const w = []; for (let a = 0; 2 * a * a <= x; a++) { const b = Math.round(Math.sqrt(x - a * a)); if (b * b === x - a * a) w.push([a, b]); } return w; };
/* q32: the 21 odd primes from 11 to 97. q37: the first 21 fractions [0; a₁, a₂, a₃] (a₁, a₂ from 1 to 6, a₃ from 2 to 6,
   denominator under 100) whose six-place decimal expands as [0; a₁, a₂, a₃, A, …] with A ≥ 100 and a last digit that is not 0. */
const PR = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const FR = []; for (let a1 = 1; a1 <= 6; a1++) for (let a2 = 1; a2 <= 6; a2++) for (let a3 = 2; a3 <= 6; a3++) {
 const q2 = a2 * a1 + 1, P = a3 * a2 + 1, Q = a3 * q2 + a1; if (Q >= 100) continue; const N = Math.round(P / Q * 1e6), c = cfrac(N, 1e6);
 if (N % 10 && c[1] === a1 && c[2] === a2 && c[3] === a3 && c[4] >= 100 && FR.length < 21) FR.push({ a1, a2, a3, P, Q, N, big: c[4] }); }
const UNITS40 = [3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37, 39];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Euler's criterion mod 13 for a from 2 to 12. */
 q31: t => { t = T(t); const a = 2 + (t + 10) % 11, r = pow(a, 6, 13), s = r === 1 ? 1 : -1;
  return E('Predict the Legendre symbol (a/13), typed 1 or −1.', `Euler’s criterion: ${n(a)}⁶ mod 13 = ${n(r)}, so (${n(a)}/13) = ${n(s)}.`, [['Legendre symbol (a/13)', s], ['a⁶ mod 13', r]]); },
 /* (7/q) for the odd primes q from 11 to 97, by reciprocity; 7 leaves remainder 3 on division by 4. */
 q32: t => { t = T(t); const q = PR[(t + 10) % 21], r = q % 7, rs = [1, 2, 4].includes(r) ? 1 : -1, both = q % 4 === 3, s = both ? -rs : rs;
  return E('Predict the Legendre symbol (7/q), typed 1 or −1.', `7 leaves remainder 3 on division by 4 and ${n(q)} leaves ${n(q % 4)}, so the sign ${both ? 'flips' : 'stays'} when the symbol is turned over. ${n(q)} leaves ${n(r)} on division by 7, and the squares mod 7 are 1, 2 and 4, so (${n(q)}/7) = ${n(rs)} and (7/${n(q)}) = ${n(s)}.`, [['Legendre symbol (7/q)', s], ['q mod 7', r], ['(q/7)', rs]]); },
 /* Ways to write x = a² + b², 0 ≤ a ≤ b, for x from 100 to 200 in steps of 5. */
 q33: t => { t = T(t); const x = 100 + 5 * (t + 10), w = twoSquares(x);
  return E('Predict the number of ways to write the number as a² + b² with 0 ≤ a ≤ b.', w.length ? `${w.map(([a, b]) => `${n(x)} = ${n(a)}² + ${n(b)}²`).join(', ')}: ${n(w.length)} in all.` : `No a from 0 to ${n(Math.floor(Math.sqrt(x / 2)))} leaves a perfect square ${n(x)} − a², so there are 0 ways.`, [['Number of ways', w.length], ['Sum of two squares (1 or 0)', w.length ? 1 : 0]]); },
 /* The Fermat test to base 2 for the odd numbers n from 21 to 61. */
 q34: t => { t = T(t); const x = 21 + 2 * (t + 10), r = pow(2, x - 1, x);
  return E('Predict 2ⁿ⁻¹ mod n as a least residue.', `2${sup(x - 1)} mod ${n(x)} = ${n(r)}, so ${n(x)} ${r === 1 ? 'passes' : 'fails'} the Fermat test.`, [['2ⁿ⁻¹ mod n', r], ['Passes (1 or 0)', r === 1 ? 1 : 0]]); },
 /* [1; 2, k, 3] = (9k + 6)/(6k + 5) for k from 1 to 10. */
 q35: t => { t = T(t); const k = 1 + (t + 10) % 10, r0 = 3 * k + 1, q = 2 * r0 + 3, p = q + r0;
  return E('Predict the partial quotient a₂.', `${n(p)} = 1 × ${n(q)} + ${n(r0)}, ${n(q)} = 2 × ${n(r0)} + 3, ${n(r0)} = ${n(k)} × 3 + 1 and 3 = 3 × 1 + 0, so ${n(p)}/${n(q)} = [1; 2, ${n(k)}, 3].`, [['a₂', k], ['a₁', 2], ['a₃', 3]]); },
 /* C₂ of [2; 3, k, 4] is (7k + 2)/(3k + 1) for k from 1 to 10. */
 q36: t => { t = T(t); const k = 1 + (t + 10) % 10, p2 = 7 * k + 2, q2 = 3 * k + 1;
  return E('Predict the numerator of C₂ in lowest terms.', `p₀ = 2 and q₀ = 1; p₁ = 3 × 2 + 1 = 7 and q₁ = 3; p₂ = ${n(k)} × 7 + 2 = ${n(p2)} and q₂ = ${n(k)} × 3 + 1 = ${n(q2)}. So C₂ = ${n(p2)}/${n(q2)}.`, [['Numerator of C₂', p2], ['Denominator of C₂', q2]]); },
 /* One of 21 fractions under 1 with denominator under 100, from its six-place decimal. */
 q37: t => { t = T(t); const f = FR[(t + 10) % 21];
  return E('Predict the numerator of the fraction in lowest terms.', `The reading ${n(f.N)}/1000000 expands as [0; ${n(f.a1)}, ${n(f.a2)}, ${n(f.a3)}, ${n(f.big)}, …]. Cutting before the huge ${n(f.big)} leaves [0; ${n(f.a1)}, ${n(f.a2)}, ${n(f.a3)}] = ${n(f.P)}/${n(f.Q)}.`, [['Numerator', f.P], ['Denominator', f.Q]]); },
 /* RSA with n = 55 and e = 3 for the messages m from 2 to 22. */
 q38: t => { t = T(t); const m = t + 12, m2 = m * m % 55, c = m2 * m % 55;
  return E('Predict the ciphertext c = m³ mod 55.', `${n(m)}² = ${n(m * m)} ≡ ${n(m2)}, and ${n(m)}³ ≡ ${n(m2)} × ${n(m)} = ${n(m2 * m)} ≡ ${n(c)} (mod 55).`, [['Ciphertext c', c], ['m² mod 55', m2]]); },
 /* The decryption exponent for n = 55 (φ = 40) and each e from 3 to 39 that shares no factor with 40. */
 q39: t => { t = T(t); const e = UNITS40[(t + 10) % 15]; let d = 1; while (e * d % 40 !== 1) d++; const k = (e * d - 1) / 40;
  return E('Predict the decryption exponent d, from 1 to 39.', `φ(55) = 4 × 10 = 40. ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × 40 + 1, so d = ${n(d)}.`, [['Decryption exponent d', d], ['φ(n)', 40]]); },
 /* The divisor network on 1 to N for N from 10 to 30. */
 q40: t => { t = T(t); const N = t + 20, counts = []; for (let a = 1; 2 * a <= N; a++) counts.push(Math.floor(N / a) - 1); const links = counts.reduce((s, v) => s + v, 0);
  return E('Predict the number of links.', `Links going up from a = 1, 2, …, ${n(counts.length)}: ${counts.map(n).join(' + ')} = ${n(links)}.`, [['Number of links', links], ['Links from 1', N - 1]]); },
});
})();
