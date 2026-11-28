/* Logic and proof concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
/* x and y each run over 1 to 5; key y fits airlock x when x + y = s, with s from 2 to 12. */
const FIT = t => { const s = 2 + (t + 10) % 11, xs = [1, 2, 3, 4, 5].filter(x => s - x >= 1 && s - x <= 5); return { s, xs }; };
/* Eight knights-and-knaves puzzles, each with exactly one fitting row (checked against the q22 solver). v: Ada, Bo, Cal; 1 knight. */
const PUZZLES = [
 { said: ['Cal is a knave.', 'Ada is a knave.', 'None of us three is a knight.'], v: [1, 0, 0] },
 { said: ['Bo and I are different kinds.', 'Ada is a knight.', 'Ada and Bo are both knights.'], v: [0, 0, 0] },
 { said: ['At least one of Bo and Cal is a knave.', 'Ada and I are different kinds.', 'Bo is a knight.'], v: [0, 1, 1] },
 { said: ['Bo and Cal are both knights.', 'None of us three is a knight.', 'Bo and I are different kinds.'], v: [0, 0, 1] },
 { said: ['Bo is a knave.', 'Cal and I are different kinds.', 'Bo is a knave.'], v: [0, 1, 0] },
 { said: ['At least one of Bo and Cal is a knave.', 'Cal and I are different kinds.', 'Bo and I are the same kind.'], v: [1, 1, 0] },
 { said: ['Bo and Cal are both knights.', 'Ada and I are the same kind.', 'Ada and Bo are both knights.'], v: [1, 1, 1] },
 { said: ['Bo and I are different kinds.', 'At least one of Ada and Cal is a knave.', 'At least one of Ada and Bo is a knave.'], v: [1, 0, 1] }
];
const WHO = ['Ada', 'Bo', 'Cal'];
/* Yes votes in eight sessions; the threshold k runs from 2 to 22. */
const VOTES = [12, 7, 15, 9, 20, 4, 11, 17];
/* Euclid lists: the product plus 1 and its smallest prime factor. */
const LISTS = [[3, 5], [2, 7], [2, 3], [2, 11, 13], [2, 5, 11], [2, 7, 11], [2, 3, 5], [2, 13], [3, 7], [2, 7, 13]];
const spf = N => { for (let q = 2; q * q <= N; q++) if (N % q === 0) return q; return N; };

window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 q21: t => { t = T(t); const { s, xs } = FIT(t);
  return E('Predict how many airlocks x have a key y that fits them.', `For each x from 1 to 5 the only key that could fit is y = ${n(s)} − x, and it must be one of 1 to 5. ${xs.length ? `That works for x = ${xs.join(', ')}` : 'That works for no x'}, so ${n(xs.length)} airlock${xs.length === 1 ? ' has' : 's have'} a key. ∀x ∃y is ${xs.length === 5 ? 'true' : 'false'} here.`, [['Airlocks with a key', xs.length], ['Sum s', s]]); },
 q22: t => { t = T(t); const P = PUZZLES[(t + 10) % 8], c = P.v.filter(Boolean).length;
  return E('Predict the number of knights among Ada, Bo and Cal.', `The only row that fits is ${P.v.map((b, i) => `${WHO[i]} ${b ? 'knight' : 'knave'}`).join(', ')}: each knight’s statement is true there and each knave’s is false. So the number of knights is ${n(c)}.`, [['Knights', c], ['Ada (1 knight, 0 knave)', P.v[0]]]); },
 q23: t => { t = T(t); const k = t + 12, over = VOTES.filter(v => v > k);
  return E('Predict the number of witnesses to the claim.', `The yes votes were ${VOTES.join(', ')}. ${over.length ? `Those above ${n(k)} are ${over.join(', ')}` : `None is above ${n(k)}`}, so the claim has ${n(over.length)} witness${over.length === 1 ? '' : 'es'}.`, [['Witnesses', over.length], ['Threshold k', k]]); },
 q24: t => { t = T(t); const k = t + 20, N = 2 * k + 1;
  return E('Predict the whole number k with n = 2k + 1.', `${n(N)} − 1 = ${n(N - 1)} and ${n(N - 1)} ÷ 2 = ${n(k)}, so ${n(N)} = 2 × ${n(k)} + 1.`, [['k', k], ['n', N]]); },
 q25: t => { t = T(t); const a = 1 + (t + 10) % 9, b = 3, br = 2 * a * b + a + b;
  return E('Predict the value of the bracket 2ab + a + b.', `With a = ${n(a)} and b = 3: 2 × ${n(a)} × 3 + ${n(a)} + 3 = ${n(br)}, and ${n(2 * a + 1)} × 7 = ${n((2 * a + 1) * 7)} = 2 × ${n(br)} + 1.`, [['Bracket 2ab + a + b', br], ['m × n', (2 * a + 1) * 7]]); },
 q26: t => { t = T(t); const s = t + 12, a = 3 * s, m = s + 4;
  return E('Predict the whole number m with a + b = 3m.', `${n(a)} = 3 × ${n(s)} and 12 = 3 × 4, so ${n(a)} + 12 = 3 × (${n(s)} + 4) = 3 × ${n(m)}.`, [['m', m], ['a + b', a + 12]]); },
 q27: t => { t = T(t); const x = 2 * ((t + 10) % 12) + 3, v = x * x, k = (v - 1) / 2;
  return E('Predict the whole number k with n² = 2k + 1.', `${n(x)}² = ${n(v)}, and ${n(v)} − 1 = ${n(v - 1)}, which halves to ${n(k)}. So ${n(v)} = 2 × ${n(k)} + 1 is odd, as the contrapositive says.`, [['k', k], ['n²', v]]); },
 q28: t => { t = T(t); const x = t + 12, v = x * x + x;
  return E('Predict the whole number (n² + n) ÷ 2.', `${n(x)}² + ${n(x)} = ${n(v)}, and ${n(v)} ÷ 2 = ${n(v / 2)}. n = ${n(x)} is ${x % 2 ? 'odd' : 'even'}, so it falls in the ${x % 2 ? 'odd' : 'even'} case.`, [['(n² + n) ÷ 2', v / 2], ['n² + n', v]]); },
 q29: t => { t = T(t); const m = 2 * (t + 10) + 1, k = (m + 9) / 2;
  return E('Predict the whole number k with m + n = 2k.', `${n(m)} + 9 = ${n(m + 9)} = 2 × ${n(k)}. The direct proof gives the same: m = 2a + 1 and n = 2b + 1 make m + n = 2(a + b + 1).`, [['k', k], ['m + n', m + 9]]); },
 q30: t => { t = T(t); const ps = LISTS[(t + 10) % 10], N = ps.reduce((a, b) => a * b, 1) + 1, p = spf(N);
  return E('Predict the smallest prime factor of N.', `N = ${ps.join(' × ')} + 1 = ${n(N)}. ${p === N ? `No prime whose square is at most ${n(N)} divides it, so ${n(N)} is prime` : `${n(N)} = ${n(p)} × ${n(N / p)}, and no smaller prime divides it`}. ${n(p)} is not on the list.`, [['Smallest prime factor', p], ['N', N]]); },
});
})();
