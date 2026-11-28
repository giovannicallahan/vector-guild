/* Abstract algebra: patterns of moves concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A 12-position dial: 9 steps forward, then b = 1 … 21 more. */
 q01: t => { t = T(t); const b = t + 11, s = 9 + b, r = s % 12;
  return E('Predict where the dial ends: (9 + b) mod 12.', `9 + ${n(b)} = ${n(s)}, and ${s < 12 ? `${n(s)} already lies from 0 to 11` : `${n(s)} = ${n(Math.floor(s / 12))} × 12 + ${n(r)}`}, so the dial ends at ${n(r)}.`, [['Position', r], ['Steps in all', s]]); },
 /* A ratchet of 7 steps per click on an 11-position dial, b = 1 … 21 clicks. */
 q02: t => { t = T(t); const b = t + 11, p = 7 * b, r = p % 11;
  return E('Predict where the dial is after the clicks: (7 × b) mod 11.', `7 × ${n(b)} = ${n(p)}, and ${p < 11 ? `${n(p)} already lies from 0 to 10` : `${n(p)} = ${n(Math.floor(p / 11))} × 11 + ${n(r)}`}, so the dial is at ${n(r)}.`, [['Position', r], ['Steps in all', p]]); },
 /* x ∗ y = (x + y + 3) mod 7, row 5, column c = 0 … 6. */
 q03: t => { t = T(t); const c = (t + 10) % 7, s = 5 + c + 3, r = s % 7;
  return E('Predict the table entry in row 5 and this column.', `5 ∗ ${n(c)} = (5 + ${n(c)} + 3) mod 7 = ${n(s)} mod 7 = ${n(r)}.`, [['Entry', r], ['Sum before the remainder', s]]); },
 /* x ∗ y = (x + y + 4) mod 9 has identity 5; the inverse of a = 0 … 8 is (1 − a) mod 9. */
 q04: t => { t = T(t); const a = (t + 10) % 9, b = ((1 - a) % 9 + 9) % 9;
  return E('Predict the inverse of this setting: the b with a ∗ b = 5, the identity.', `The identity is 5, since 5 + 4 = 9 is one whole turn. ${n(a)} ∗ b = (${n(a)} + b + 4) mod 9 must be 5, so b = (5 − ${n(a + 4)}) mod 9 = ${n(1 - a)} mod 9 = ${n(b)}.`, [['Inverse', b], ['Identity', 5]]); },
 /* The settings 1 to n − 1 multiplied mod n, n = 4 … 20: a group exactly when n is prime. */
 q05: t => { t = T(t); const m = 4 + (t + 10) % 17; let d = 2; while (m % d) d++; const prime = d === m ? 1 : 0;
  return E('Predict whether this set and operation form a group: 1 for yes, 0 for no.', prime ? `${n(m)} is prime, so no product of two settings is a multiple of ${n(m)}: the set is closed, 1 is the identity and every setting has an inverse. It is a group.` : `${n(m)} = ${n(d)} × ${n(m / d)}, and (${n(d)} × ${n(m / d)}) mod ${n(m)} leaves 0, which is not a setting. The set is not closed, so it is not a group.`, [['Group (1 or 0)', prime], ['Modulus', m]]); },
 /* |U(n)| for n = 10 … 30. */
 q06: t => { t = T(t); const m = t + 20, us = []; for (let x = 1; x < m; x++) { let a = x, b = m; while (b) { const r = a % b; a = b; b = r; } if (a === 1) us.push(x); }
  return E('Predict |U(n)|, the number of settings from 1 to n − 1 that are coprime to n.', `The numbers from 1 to ${n(m - 1)} coprime to ${n(m)} are ${us.map(n).join(', ')}, so |U(${n(m)})| = ${n(us.length)}.`, [['|U(n)|', us.length], ['n', m]]); },
 /* Order of a = 1 … 21 in Z₂₄: 24 ÷ gcd(a, 24). */
 q07: t => { t = T(t); const a = t + 11; let x = a, y = 24; while (y) { const r = x % y; x = y; y = r; } const o = 24 / x;
  return E('Predict the order of the jump in Z₂₄: the beats until the pulse is back at lamp 0.', `gcd(${n(a)}, 24) = ${n(x)}, so the order of ${n(a)} is 24 ÷ ${n(x)} = ${n(o)}.`, [['Order', o], ['gcd with 24', x]]); },
 /* Order of a = 2 … 12 in U(13), from the table of powers. */
 q08: t => { t = T(t); const a = 2 + (t + 10) % 11, ps = [a]; while (ps[ps.length - 1] !== 1) ps.push((ps[ps.length - 1] * a) % 13);
  return E('Predict the order of this element in U(13): the first power that leaves 1.', `Powers of ${n(a)} mod 13: ${ps.map(n).join(', ')}. The first 1 is power ${n(ps.length)}, so the order is ${n(ps.length)}.`, [['Order', ps.length], ['Square mod 13', ps[1]]]); },
 /* Number of generators of Zₙ, n = 8 … 28. */
 q09: t => { t = T(t); const m = t + 18, gs = []; for (let x = 1; x < m; x++) { let a = x, b = m; while (b) { const r = a % b; a = b; b = r; } if (a === 1) gs.push(x); }
  return E('Predict how many generators Zₙ has.', `The generators are the numbers from 1 to ${n(m - 1)} coprime to ${n(m)}: ${gs.map(n).join(', ')}. That is ${n(gs.length)} generators.`, [['Generators', gs.length], ['n', m]]); },
 /* 3ᵏ mod 11 with k = 400 … 420; the order of 3 is 5 (powers 3, 9, 5, 4, 1). */
 q10: t => { t = T(t); const k = 410 + t, r = k % 5, ps = [3, 9, 5, 4, 1], v = r === 0 ? 1 : ps[r - 1];
  return E('Predict 3ᵏ mod 11 for this exponent k.', `The powers of 3 mod 11 are 3, 9, 5, 4, 1, so the order of 3 is 5. ${n(k)} = ${n(Math.floor(k / 5))} × 5 + ${n(r)}, so 3ᵏ mod 11 is the same as ${r === 0 ? 'a whole number of blocks of 3⁵, which leaves 1' : `the power ${n(r)} of 3, which leaves ${n(v)}`}.`, [['Value', v], ['k mod 5', r]]); },
});
})();
