/* Discrete mathematics concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Codes: a letter from A to F, a first digit 1 to 4, a second digit 0 to b with b from 3 to 9; f is the digit sum. */
 q11: t => { t = T(t); const b = 3 + (t + 10) % 7, count = 6 * 4 * (b + 1);
  return E('Predict the number of different codes.', `6 letters, 4 first digits and ${n(b + 1)} second digits (0 to ${n(b)}). By the multiplicative principle there are 6 × 4 × ${n(b + 1)} = ${n(count)} codes, and their digit sums run from 1 to ${n(4 + b)}.`, [['Codes', count], ['Size of the range', 4 + b], ['Second digits', b + 1]]); },
 /* k! orders of k crates, k from 3 to 8 (9! is over the 100000 answer limit). */
 q12: t => { t = T(t); const k = 3 + (t + 10) % 6; let f = 1; const xs = []; for (let i = k; i >= 1; i--) { f *= i; xs.push(n(i)); }
  return E('Predict the number of orders of the crates on the shelf.', `${n(k)}! = ${xs.join(' × ')} = ${n(f)}.`, [['Orders', f], ['Choices for the first space', k]]); },
 /* P(N, 3) for N from 5 to 12. */
 q13: t => { t = T(t); const N = 5 + (t + 10) % 8, p = N * (N - 1) * (N - 2);
  return E('Predict P(N, 3), the number of ways to fill the three jobs.', `P(${n(N)}, 3) = ${n(N)} × ${n(N - 1)} × ${n(N - 2)} = ${n(p)}.`, [['Ways', p], ['Choices for the first job', N]]); },
 /* C(N, 3) for N from 5 to 15. */
 q14: t => { t = T(t); const N = 5 + (t + 10) % 11, p = N * (N - 1) * (N - 2), c = p / 6;
  return E('Predict C(N, 3), the number of different teams of 3.', `P(${n(N)}, 3) = ${n(N)} × ${n(N - 1)} × ${n(N - 2)} = ${n(p)} ordered picks, and each team of 3 appears 3! = 6 times, so C(${n(N)}, 3) = ${n(p)} ÷ 6 = ${n(c)}.`, [['Teams', c], ['Ordered picks', p]]); },
 /* N-bit strings with exactly two ones, C(N, 2), for N from 4 to 12; all strings 2^N. */
 q15: t => { t = T(t); const N = 4 + (t + 10) % 9, c = N * (N - 1) / 2, s = Math.pow(2, N);
  return E('Predict the number of strings with exactly two ones.', `Choose the 2 places of the ones: C(${n(N)}, 2) = ${n(N)} × ${n(N - 1)} ÷ 2 = ${n(c)}. In Pascal’s triangle that is C(${n(N - 1)}, 1) + C(${n(N - 1)}, 2) = ${n(N - 1)} + ${n((N - 1) * (N - 2) / 2)}. All ${n(N)}-bit strings, one per subset: 2 to the power ${n(N)} = ${n(s)}.`, [['Strings with two ones', c], ['All strings (subsets)', s]]); },
 /* Coefficient of x²y^(N−2) in (2x + y)^N, N from 3 to 8: C(N, 2) × 4. */
 q16: t => { t = T(t); const N = 3 + (t + 10) % 6, c = N * (N - 1) / 2;
  return E('Predict the coefficient of x² times the power of y.', `The term with x² is C(${n(N)}, 2) × (2x)² × y to the power ${n(N - 2)}. C(${n(N)}, 2) = ${n(c)} and 2² = 4, so the coefficient is ${n(c)} × 4 = ${n(4 * c)}.`, [['Coefficient', 4 * c], ['Binomial coefficient', c]]); },
 /* Even slider values: a route through 3 of N domes (permutation). Odd: a team of 3 of N crew (combination). N from 5 to 12. */
 q17: t => { t = T(t); const N = 5 + (t + 10) % 8, p = N * (N - 1) * (N - 2), route = t % 2 === 0, w = route ? p : p / 6;
  return E('Predict the number of ways.', route ? `Swapping two stops gives a new route, so order matters: P(${n(N)}, 3) = ${n(N)} × ${n(N - 1)} × ${n(N - 2)} = ${n(p)}.` : `Swapping two team members changes nothing, so order does not matter: C(${n(N)}, 3) = ${n(p)} ÷ 6 = ${n(w)}.`, [['Ways', w], ['Code (1 permutation, 2 combination)', route ? 1 : 2], ['Ordered choices', p]]); },
 /* Crews of 3 from 3 engineers and m packers, m from 3 to 9, with at least one engineer. */
 q18: t => { t = T(t); const m = 3 + (t + 10) % 7, T3 = x => x * (x - 1) * (x - 2) / 6, all = T3(m + 3), none = T3(m);
  return E('Predict the number of crews of 3 with at least one engineer.', `All crews: C(${n(m + 3)}, 3) = ${n(all)}. Crews of packers only: C(${n(m)}, 3) = ${n(none)}. At least one engineer: ${n(all)} − ${n(none)} = ${n(all - none)}.`, [['Crews with an engineer', all - none], ['All crews', all], ['Crews with no engineer', none]]); },
 /* N identical crates among 3 domes, N from 3 to 12, a dome may get none: C(N + 2, 2). */
 q19: t => { t = T(t); const N = 3 + (t + 10) % 10, free = (N + 2) * (N + 1) / 2, each = (N - 1) * (N - 2) / 2;
  return E('Predict the number of ways to share the crates if a dome may get none.', `${n(N)} stars and 2 bars make ${n(N + 2)} places, so there are C(${n(N + 2)}, 2) = ${n(N + 2)} × ${n(N + 1)} ÷ 2 = ${n(free)} ways. With at least one crate each it would be C(${n(N - 1)}, 2) = ${n(each)}.`, [['Ways, none allowed', free], ['Ways, at least one each', each]]); },
 /* Codes 1 to N, N = 100 + 10(t + 10) from 100 to 300, that are multiples of none of 2, 3 and 5. */
 q20: t => { t = T(t); const N = 100 + 10 * (t + 10), f = d => Math.floor(N / d), S1 = f(2) + f(3) + f(5), S2 = f(6) + f(10) + f(15), U = S1 - S2 + f(30);
  return E('Predict how many codes are multiples of none of 2, 3 and 5.', `Singles: ${n(f(2))} + ${n(f(3))} + ${n(f(5))} = ${n(S1)}. Pairs (multiples of 6, 10, 15): ${n(f(6))} + ${n(f(10))} + ${n(f(15))} = ${n(S2)}. Triple (multiples of 30): ${n(f(30))}. At least one: ${n(S1)} − ${n(S2)} + ${n(f(30))} = ${n(U)}, so none: ${n(N)} − ${n(U)} = ${n(N - U)}.`, [['Multiples of none', N - U], ['Multiples of at least one', U]]); },
});
})();
