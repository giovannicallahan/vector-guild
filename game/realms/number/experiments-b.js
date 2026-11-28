/* Number theory: the hidden life of whole numbers concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
const mod = (a, m) => ((a % m) + m) % m;
const powmod = (a, k, m) => { let r = 1, b = a % m; while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
const twos = k => { const out = []; for (let p = 1 << 30; p >= 1; p = Math.floor(p / 2)) if (k & p) out.push(p); return out; };
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Cans of 6 and 9 litres, an order of 3c₁ litres with c₁ from 20 to 40. */
 q11: t => { t = T(t); const c1 = 20 + (t + 10), c = 3 * c1, sols = []; for (let y = 1; 3 * y < c1; y++) if ((c1 - 3 * y) % 2 === 0) sols.push(`(${n((c1 - 3 * y) / 2)}, ${n(y)})`);
  return E('Predict the number of ways to fill the order.', `gcd(6, 9) = 3, and 3 divides ${n(c)}, so divide by 3: 2x + 3y = ${n(c1)}. The solutions with x and y both at least 1 are ${sols.join(', ')}: ${n(sols.length)} ways.`, [['Ways to fill the order', sols.length], ['gcd of the can sizes', 3], ['Order (litres)', c]]); },
 /* The least residue of 23t − 4 mod 9, from −234 to 226. */
 q12: t => { t = T(t); const a = 23 * t - 4, r = mod(a, 9), q = (a - r) / 9;
  return E('Predict the least residue mod 9.', `${n(a)} = ${n(q)} × 9 + ${n(r)}, and ${n(r)} lies from 0 to 8, so ${n(a)} ≡ ${n(r)} (mod 9).`, [['Least residue', r], ['Quotient', q]]); },
 /* 4831 × B mod 11 with B = 2000 + 53(t + 10). */
 q13: t => { t = T(t); const B = 2000 + 53 * (t + 10), rA = 4831 % 11, rB = B % 11, P = rA * rB, p = P % 11;
  return E('Predict the shift at which the convoy ends: the least residue of 4831 × B mod 11.', `4831 ≡ ${n(rA)} and ${n(B)} ≡ ${n(rB)} (mod 11). ${n(rA)} × ${n(rB)} = ${n(P)} ≡ ${n(p)} (mod 11).`, [['Shift at the end', p], ['Residue of 4831', rA], ['Residue of the run', rB]]); },
 /* A seven-digit serial 6153820 + 7(t + 10): its remainder mod 11 from the alternating digit sum. */
 q14: t => { t = T(t); const N = 6153820 + 7 * (t + 10), back = String(N).split('').map(Number).reverse(), alt = back.reduce((s, d, i) => s + (i % 2 ? -d : d), 0), m11 = mod(alt, 11), m9 = N % 9;
  return E('Predict the remainder of the serial on division by 11.', `Alternating digit sum from the units digit: ${back.map((d, i) => i ? `${i % 2 ? '−' : '+'} ${d}` : `${d}`).join(' ')} = ${n(alt)}, and ${n(alt)} ≡ ${n(m11)} (mod 11).`, [['Remainder mod 11', m11], ['Alternating digit sum', alt], ['Remainder mod 9', m9]]); },
 /* The inverse of a mod 23 for a from 2 to 21. */
 q15: t => { t = T(t); const a = 2 + (t + 10) % 20; let k = 1; while (a * k % 23 !== 1) k++; const P = a * k;
  return E('Predict the modular inverse of the jump mod 23: the number of jumps, from 1 to 22, that ends 1 stop past the start.', `${n(a)} × ${n(k)} = ${n(P)} = ${n((P - 1) / 23)} × 23 + 1, so ${n(a)} × ${n(k)} ≡ 1 (mod 23).`, [['Modular inverse', k], ['Product', P]]); },
 /* 4x ≡ 2k (mod 18) for k from 1 to 8: 2x ≡ k (mod 9), and 5 is the inverse of 2 mod 9. */
 q16: t => { t = T(t); const k = 1 + (t + 10) % 8, b = 2 * k, x0 = 5 * k % 9;
  return E('Predict the smallest solution from 0 to 17.', `gcd(4, 18) = 2 divides ${n(b)}, so there are 2 solutions. Divide by 2: 2x ≡ ${n(k)} (mod 9). The inverse of 2 mod 9 is 5, so x ≡ 5 × ${n(k)} = ${n(5 * k)}${5 * k === x0 ? '' : ` ≡ ${n(x0)}`} (mod 9). The solutions are ${n(x0)} and ${n(x0 + 9)}.`, [['Smallest solution', x0], ['Number of solutions', 2]]); },
 /* Today day 2 of the week; a convoy in N = 1000 + 37(t + 10) days. */
 q17: t => { t = T(t); const N = 1000 + 37 * (t + 10), r = N % 7, S = 2 + r, w = S % 7;
  return E('Predict the number of the weekday the convoy leaves on.', `${n(N)} = ${n(Math.floor(N / 7))} × 7 + ${n(r)}, so the convoy leaves on day 2 + ${n(r)} = ${n(S)}${S >= 7 ? ` ≡ ${n(w)} (mod 7)` : ''}.`, [['Weekday', w], ['Days mod 7', r]]); },
 /* x ≡ r₁ (mod 4), x ≡ r₂ (mod 5), x ≡ 2 (mod 7), with r₁ from 1 to 3 and r₂ from 1 to 4. */
 q18: t => { t = T(t); const r1 = 1 + (t + 10) % 3, r2 = 1 + Math.floor((t + 10) / 3) % 4; let x = 1; while (x % 4 !== r1 || x % 5 !== r2 || x % 7 !== 2) x++;
  return E('Predict the shortest length that fits all three reports.', `${n(x)} = ${n(Math.floor(x / 4))} × 4 + ${n(r1)} = ${n(Math.floor(x / 5))} × 5 + ${n(r2)} = ${n(Math.floor(x / 7))} × 7 + 2, and by the Chinese remainder theorem it is the only fit from 1 to 4 × 5 × 7 = 140.`, [['Shortest length', x], ['Product of the moduli', 140]]); },
 /* 3 to the power k mod 47 with k = 40 + 13(t + 10), from 40 to 300. */
 q19: t => { t = T(t); const k = 40 + 13 * (t + 10), parts = twos(k), j = Math.log2(parts[0]), r = powmod(3, k, 47);
  return E('Predict the least residue of the power mod 47.', `${n(k)} = ${parts.join(' + ')}. Squaring 3 again and again mod 47 reaches 3${sup(parts[0])} after ${n(j)} squarings, and the product of the entries for ${parts.join(', ')}, reduced mod 47, is ${n(r)}.`, [['Least residue of the power', r], ['Squarings', j]]); },
 /* 3 to the power k mod 31 with k = 123456 + 11(t + 10); 31 is prime, so the exponent is reduced mod 30. */
 q20: t => { t = T(t); const k = 123456 + 11 * (t + 10), r = k % 30, res = powmod(3, r, 31);
  return E('Predict the least residue of the power mod 31.', `31 is prime and does not divide 3, so 3³⁰ ≡ 1 (mod 31). ${n(k)} = ${n(Math.floor(k / 30))} × 30 + ${n(r)}, so the power is ≡ 3${sup(r)} ≡ ${n(res)} (mod 31).`, [['Least residue of the power', res], ['Reduced exponent', r]]); },
});
})();
