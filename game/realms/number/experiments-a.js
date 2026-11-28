/* Number theory: the hidden life of whole numbers concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const Q03 = [91, 119, 143, 187, 209, 247, 299, 323, 341, 377, 403, 437, 451, 481, 493, 527, 551, 589, 629, 667, 697];
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* a = 10t + 3 from −97 to 103, divided by 7. */
 q01: t => { t = T(t); const a = 10 * t + 3, q = Math.floor(a / 7), r = a - 7 * q;
  return E('Predict the remainder r when a is divided by 7.', `${n(a)} = 7 × ${par(q)} + ${n(r)}, and 0 ≤ ${n(r)} < 7, so q = ${n(q)} and r = ${n(r)}.`, [['Remainder r', r], ['Quotient q', q]]); },
 /* (213) in base b for b from 4 to 9. */
 q02: t => { t = T(t); const b = 4 + (t + 10) % 6, V = 2 * b * b + b + 3;
  return E('Predict the value of the numeral in base ten.', `In base ${n(b)} the places are worth ${n(b * b)}, ${n(b)} and 1, so (213) is 2 × ${n(b * b)} + 1 × ${n(b)} + 3 = ${n(V)}.`, [['Value in base ten', V], ['Place value of the first digit', b * b]]); },
 /* Odd composites from a fixed list; the slider picks one. */
 q03: t => { t = T(t); const k = Q03[t + 10], s = Math.floor(Math.sqrt(k)); let p = 3; while (k % p) p += 2;
  return E('Predict the smallest crate size above 1 that works: the smallest prime factor.', `Only primes up to ${n(s)} need testing, since ${n(s + 1)} × ${n(s + 1)} is more than ${n(k)}. The first prime that divides ${n(k)} is ${n(p)}: ${n(k)} = ${n(p)} × ${n(k / p)}.`, [['Smallest prime factor', p], ['Largest number to test', s]]); },
 /* 2ᵃ × 3ᵇ × 5 with a from 1 to 5 and b from 1 to 4. */
 q04: t => { t = T(t); const a = 1 + (t + 10) % 5, b = 1 + Math.floor((t + 10) / 5) % 4, k = Math.pow(2, a) * Math.pow(3, b) * 5;
  return E('Predict the exponent of 3 in the prime factorisation.', `${n(k)} can be halved ${n(a)} times, leaving ${n(k / Math.pow(2, a))}, which is 3 to the power ${n(b)} times 5. So ${n(k)} = 2 to the power ${n(a)} × 3 to the power ${n(b)} × 5.`, [['Exponent of 3', b], ['Exponent of 2', a]]); },
 /* gcd and lcm of a = 6(t + 12), from 12 to 132, and 90. */
 q05: t => { t = T(t); const a = 6 * (t + 12), g = gcd(a, 90), L = a * 90 / g;
  return E('Predict gcd(a, 90), the largest crate size for both.', `90 = 2 × 3² × 5. Taking the smaller exponents of 2, 3 and 5 in ${n(a)} and in 90 gives gcd(${n(a)}, 90) = ${n(g)}, and lcm = ${n(a)} × 90 ÷ ${n(g)} = ${n(L)}.`, [['gcd', g], ['lcm', L]]); },
 /* Euclid on 600 and b = 21 + 4(t + 10), from 21 to 101. */
 q06: t => { t = T(t); const b = 21 + 4 * (t + 10), rows = []; let x = 600, y = b; while (y) { rows.push(`${n(x)} = ${n(Math.floor(x / y))} × ${n(y)} + ${n(x % y)}`); [x, y] = [y, x % y]; }
  return E('Predict gcd(600, b), found by Euclid’s algorithm.', `${rows.join('; ')}. The last remainder that is not 0 is ${n(x)}.`, [['gcd', x], ['Divisions', rows.length]]); },
 /* 11x + by = 1 with b from 2 to 10. */
 q07: t => { t = T(t); const b = 2 + (t + 10) % 9; let x = 1; while ((11 * x - 1) % b) x++; const y = (1 - 11 * x) / b;
  return E('Predict x, the smallest positive choice.', `11 × ${n(x)} + ${n(b)} × ${par(y)} = ${n(11 * x)} − ${n(-b * y)} = 1, and no smaller positive x leaves a multiple of ${n(b)}.`, [['x', x], ['y', y]]); },
 /* 3x + 5y = c in positive whole numbers, c from 30 to 50. */
 q08: t => { t = T(t); const c = 40 + t, xs = []; for (let x = 1; 3 * x < c; x++) if ((c - 3 * x) % 5 === 0) xs.push(x);
  return E('Predict how many pairs of positive whole numbers solve the equation.', `The solutions are ${xs.map(x => `(${n(x)}, ${n((c - 3 * x) / 5)})`).join(', ')}: each adds 5 to x and takes 3 from y.`, [['Pairs', xs.length], ['Smallest x', xs[0]]]); },
 /* τ(2ᵃ × 3ᵇ) with a from 1 to 5 and b from 1 to 4. */
 q09: t => { t = T(t); const a = 1 + (t + 10) % 5, b = 1 + Math.floor((t + 10) / 5) % 4, k = Math.pow(2, a) * Math.pow(3, b);
  return E('Predict τ(n), the number of divisors of n.', `${n(k)} = 2 to the power ${n(a)} × 3 to the power ${n(b)}, so τ = (${n(a)} + 1) × (${n(b)} + 1) = ${n((a + 1) * (b + 1))}.`, [['Number of divisors', (a + 1) * (b + 1)], ['Exponent of 2', a]]); },
 /* σ(2ᵃ × 3) with a from 1 to 7. */
 q10: t => { t = T(t); const a = 1 + (t + 10) % 7, k = Math.pow(2, a) * 3, s1 = Math.pow(2, a + 1) - 1;
  return E('Predict σ(n), the sum of divisors: the litres all the cans hold together.', `${n(k)} = 2 to the power ${n(a)} × 3. The powers of 2 up to ${n(Math.pow(2, a))} add up to ${n(s1)}, and σ(3) = 4. They share no prime, so σ = ${n(s1)} × 4 = ${n(4 * s1)}.`, [['Sum of divisors', 4 * s1], ['Sum of the powers of 2', s1]]); },
});
})();
