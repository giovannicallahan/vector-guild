/* Number theory: the hidden life of whole numbers concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
/* Small helpers, copied in variants-c.js where a statement needs them. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = k => String(k).split('').map(d => SUP[+d]).join('');
const factor = x => { const out = []; for (let p = 2; p * p <= x; p++) { let a = 0; while (x % p === 0) { x /= p; a++; } if (a) out.push([p, a]); } if (x > 1) out.push([x, 1]); return out; };
const fac = f => f.map(([p, a]) => a === 1 ? n(p) : `${n(p)}${sup(a)}`).join(' × ');
const phi = x => factor(x).reduce((s, [p, a]) => s * (Math.pow(p, a) - Math.pow(p, a - 1)), 1);
const powmod = (a, k, m) => { let r = 1 % m, b = a % m; while (k > 0) { if (k % 2) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const order = (a, m) => { let v = a % m, k = 1; while (v !== 1 && k <= m) { v = v * a % m; k++; } return k; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const sigma = x => factor(x).reduce((s, [p, a]) => s * (Math.pow(p, a + 1) - 1) / (p - 1), 1);
const mu = x => { const f = factor(x); return f.some(([, a]) => a > 1) ? 0 : (f.length % 2 ? -1 : 1); };
/* q27: pairs (N, a) with N from 8 to 30, a coprime to N and an order from 3 to 8. */
const PAIRS = []; for (let N = 8; N <= 30; N++) for (let a = 2; a <= N - 2; a++) if (gcd(a, N) === 1 && order(a, N) >= 3 && order(a, N) <= 8) PAIRS.push([N, a]);
const L25 = [6, 10, 12, 14, 15, 18, 20, 21, 22, 26, 28, 42, 44, 45, 50, 66, 70, 75, 105, 110, 210];
const L26 = [6, 12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 56, 60, 70, 72, 88, 96, 100, 120, 496, 945];
const P24 = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53], P28 = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
const A22 = [3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* N = 2^a × 3 × P with a from 1 to 4 and P from 5 to 13. */
 q21: t => { t = T(t); const i = t + 10, a = 1 + i % 4, P = [5, 7, 11, 13][Math.floor(i / 4) % 4], N = Math.pow(2, a) * 3 * P, F = phi(N);
  return E('Predict φ(N): how many of the codes 1 to N are coprime to N.', `${n(N)} = ${fac(factor(N))}. φ(${fac([[2, a]])}) = ${n(Math.pow(2, a - 1))}, φ(3) = 2 and φ(${n(P)}) = ${n(P - 1)}, so φ(${n(N)}) = ${n(Math.pow(2, a - 1))} × 2 × ${n(P - 1)} = ${n(F)}.`, [['φ(N)', F], ['N', N], ['codes not coprime', N - F]]); },
 /* a coprime to 100 and k = 1003 + 37 × (t + 10). */
 q22: t => { t = T(t); const i = t + 10, a = A22[i % 11], k = 1003 + 37 * i, r = k % 40, v = powmod(a, k, 100);
  return E('Predict the last two digits of the power, as a number from 0 to 99.', `${n(a)} is coprime to 100 and φ(100) = 40. ${n(k)} = 40 × ${n((k - r) / 40)} + ${n(r)}, so ${n(a)}${sup(k)} ≡ ${n(a)}${sup(r)} ≡ ${n(v)} (mod 100).`, [['Last two digits', v], ['Reduced exponent r', r]]); },
 /* x mod 9 and x mod 11 given; x from 1 to 98. */
 q23: t => { t = T(t); const i = t + 10, r1 = 2 * i % 9, r2 = (i + 3) % 11; let x = 1; while (x < 99 && (x % 9 !== r1 || x % 11 !== r2)) x++;
  return E('Predict the smallest positive x.', `Numbers with remainder ${n(r2)} on division by 11: ${n(r2 || 11)}, ${n((r2 || 11) + 11)}, … The first that leaves remainder ${n(r1)} on division by 9 is ${n(x)}.`, [['x', x], ['x mod 9', r1], ['x mod 11', r2]]); },
 /* A prime p from 11 to 53. */
 q24: t => { t = T(t); const p = P24[(t + 10) % 12], h = (p - 1) / 2;
  return E('Predict (p − 3)! mod p as a least residue.', `Wilson: (${n(p)} − 1)! ≡ −1, so ${n(p - 2)}! ≡ 1 (mod ${n(p)}). ${n(p - 2)}! = ${n(p - 3)}! × ${n(p - 2)} with ${n(p - 2)} ≡ −2, and −2 × ${n(h)} = 1 − ${n(p)} ≡ 1, so (${n(p)} − 3)! ≡ ${n(h)}.`, [['(p − 3)! mod p', h], ['(p − 1)! mod p', p - 1], ['(p − 2)! mod p', 1]]); },
 /* N from a list of small numbers, square-free and not. */
 q25: t => { t = T(t); const N = L25[t + 10], f = factor(N), m = mu(N);
  return E('Predict μ(N), typed as −1, 0 or 1.', `${n(N)} = ${fac(f)}. ${m === 0 ? 'A prime appears more than once, so μ = 0.' : `It is square-free with ${n(f.length)} distinct primes, so μ = ${n(m)}.`}`, [['μ(N)', m], ['distinct primes', f.length], ['square-free divisors', Math.pow(2, f.length)]]); },
 /* N from a list that includes the perfect numbers 6, 28 and 496. */
 q26: t => { t = T(t); const N = L26[t + 10], S = sigma(N);
  return E('Predict σ(N) − 2N, which is 0 exactly when N is perfect.', `${n(N)} = ${fac(factor(N))}, so σ(${n(N)}) = ${n(S)} and σ(${n(N)}) − 2 × ${n(N)} = ${n(S)} − ${n(2 * N)} = ${n(S - 2 * N)}.`, [['σ(N) − 2N', S - 2 * N], ['σ(N)', S]]); },
 /* (N, a) from the list PAIRS. */
 q27: t => { t = T(t); const [N, a] = PAIRS[(t + 10) * 7 % PAIRS.length], k = order(a, N), list = []; let v = 1; for (let j = 1; j <= k; j++) { v = v * a % N; list.push(`${n(a)}${sup(j)} ≡ ${n(v)}`); }
  return E('Predict the order of a mod N: the smallest k of at least 1 with aᵏ ≡ 1.', `${list.join(', ')} (mod ${n(N)}), so the order is ${n(k)}. It divides φ(${n(N)}) = ${n(phi(N))}.`, [['Order', k], ['φ(N)', phi(N)]]); },
 /* A prime p from 11 to 47. */
 q28: t => { t = T(t); const p = P28[(t + 10) % 11], F = phi(p - 1);
  return E('Predict how many primitive roots p has among 1 to p − 1.', `A prime p has φ(p − 1) primitive roots. ${n(p - 1)} = ${fac(factor(p - 1))}, so φ(${n(p - 1)}) = ${n(F)}.`, [['Primitive roots', F], ['p − 1', p - 1]]); },
 /* 2 is a primitive root mod 13; b from 2 to 12. */
 q29: t => { t = T(t); const b = 2 + (t + 10) % 11; let k = 1, v = 2; const list = ['2¹ ≡ 2']; while (v !== b && k < 13) { v = v * 2 % 13; k++; list.push(`2${sup(k)} ≡ ${n(v)}`); }
  return E('Predict the index of b: the k from 1 to 12 with 2ᵏ ≡ b (mod 13).', `${list.join(', ')} (mod 13), so the index of ${n(b)} is ${n(k)}.`, [['Index', k], ['b', b]]); },
 /* x² ≡ a (mod 23) for a from 1 to 21. */
 q30: t => { t = T(t); const a = t + 11; let x = 0; for (let i = 1; i <= 11 && !x; i++) if (i * i % 23 === a) x = i;
  return E('Predict the smallest x from 1 to 22 with x² ≡ a (mod 23), or 0 if there is none.', x ? `${n(x)}² = ${n(x * x)} ≡ ${n(a)} (mod 23), and no smaller square leaves ${n(a)}; the other solution is ${n(23 - x)}.` : `The squares of 1 to 11 mod 23 are 1, 4, 9, 16, 2, 13, 3, 18, 12, 8, 6; ${n(a)} is not among them, so there is no solution.`, [['Smallest solution', x], ['Number of solutions', x ? 2 : 0]]); },
});
})();
