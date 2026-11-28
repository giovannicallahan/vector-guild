/* Discrete mathematics concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* B = multiples of k from 10 to 60, k from 2 to 9. */
 q01: t => { t = T(t); const k = 2 + (t + 10) % 8, first = Math.ceil(10 / k) * k, last = Math.floor(60 / k) * k, c = (last - first) / k + 1;
  return E('Predict |B|, the cardinality of B.', `The smallest multiple of ${n(k)} from 10 is ${n(first)} and the largest up to 60 is ${n(last)}, so |B| = (${n(last)} − ${n(first)}) ÷ ${n(k)} + 1 = ${n(c)}.`, [['|B|', c], ['Smallest element', first], ['Largest element', last]]); },
 /* B = {1, …, 20}, A = multiples of m up to 20, m from 2 to 9: A ⊆ B. */
 q02: t => { t = T(t); const m = 2 + (t + 10) % 8, a = Math.floor(20 / m);
  return E('Predict how many elements of B are not in A.', `A holds the ${n(a)} multiples of ${n(m)} up to 20, and A ⊆ B, so ${n(20)} − ${n(a)} = ${n(20 - a)} elements of B are not in A.`, [['Elements of B not in A', 20 - a], ['|A|', a], ['|B|', 20]]); },
 /* A = {1, …, 10}, B = the 8 numbers from s to s + 7, s from 1 to 12. */
 q03: t => { t = T(t); const s = 1 + (t + 10) % 12, i = Math.max(0, Math.min(10, s + 7) - s + 1), u = 18 - i;
  return E('Predict |A ∪ B|.', `A and B share ${i === 0 ? 'no numbers' : i === 1 ? `only the number ${n(s)}` : `the numbers from ${n(s)} to ${n(Math.min(10, s + 7))}`}, so |A ∩ B| = ${n(i)} and |A ∪ B| = 10 + 8 − ${n(i)} = ${n(u)}.`, [['|A ∪ B|', u], ['|A ∩ B|', i]]); },
 /* U = 60, |F| = 25, |H| = 30, |F ∩ H| from 2 to 15. */
 q04: t => { t = T(t); const ab = 2 + (t + 10) % 14, un = 55 - ab;
  return E('Predict the number of crates that are neither fragile nor heavy.', `|F ∪ H| = 25 + 30 − ${n(ab)} = ${n(un)}, so 60 − ${n(un)} = ${n(60 - un)} crates are neither.`, [['Neither', 60 - un], ['|F ∪ H|', un], ['|F \\ H|', 25 - ab]]); },
 /* Totals 28, 21, 24; pairs 8, 9, 7; all three c from 2 to 7; 60 crates. */
 q05: t => { t = T(t); const c = 2 + (t + 10) % 6, oF = 11 + c, oC = 6 + c, oH = 8 + c, one = oF + oC + oH, seven = 49 + c;
  return E('Predict the number of crates in exactly one of the three sets.', `Exactly two: ${n(8 - c)}, ${n(9 - c)} and ${n(7 - c)}. Only F: 28 − ${n(8 - c)} − ${n(9 - c)} − ${n(c)} = ${n(oF)}; only C: 21 − ${n(8 - c)} − ${n(7 - c)} − ${n(c)} = ${n(oC)}; only H: 24 − ${n(9 - c)} − ${n(7 - c)} − ${n(c)} = ${n(oH)}. Exactly one: ${n(one)}.`, [['Exactly one set', one], ['In none', 60 - seven], ['All three', c]]); },
 /* A = B = {1, …, 6}; pairs with a + b = s for s from 2 to 12. */
 q06: t => { t = T(t); const s = 2 + (t + 10) % 11, c = 6 - Math.abs(s - 7), lo = Math.max(1, s - 6);
  return E('Predict how many ordered pairs (a, b) in A × B have a + b equal to the target.', `${c === 1 ? `a must be ${n(lo)}` : `a can be ${n(lo)} to ${n(Math.min(6, s - 1))}`}, and each such a has exactly one b = ${n(s)} − a in B: ${n(c)} pair${c === 1 ? '' : 's'} out of |A × B| = 6 × 6 = 36.`, [['Pairs at the target', c], ['|A × B|', 36]]); },
 /* f(x) = the larger of x and m on {1, …, 10}, m from 1 to 10. */
 q07: t => { t = T(t); const m = 1 + (t + 10) % 10;
  return E('Predict the size of the range of f.', m === 1 ? 'Every x is 1 or more, so every x goes to itself and the range is all of {1, 2, …, 10}: 10 elements.' : `Every x below ${n(m)} goes to ${n(m)}, and every x from ${n(m)} up goes to itself, so the range is the numbers from ${n(m)} to 10: ${n(11 - m)} element${m === 10 ? '' : 's'}.`, [['Size of the range', 11 - m], ['f(1)', m], ['Size of the codomain', 10]]); },
 /* f(x) = 2x from {1, …, 6} to {1, …, N}, N from 12 to 20. */
 q08: t => { t = T(t); const N = 12 + (t + 10) % 9;
  return E('Predict the number of elements of the codomain that no input reaches.', `The images 2, 4, 6, 8, 10 and 12 are all different, so f is one-to-one. They are 6 of the ${n(N)} elements of the codomain, so ${n(N)} − 6 = ${n(N - 6)} are not reached.`, [['Not reached', N - 6], ['Size of the range', 6], ['One-to-one (1 yes, 0 no)', 1]]); },
 /* 7 filters, 5 valves and c seals, c from 2 to 15. */
 q09: t => { t = T(t); const c = 2 + (t + 10) % 14;
  return E('Predict the number of ways to choose one part.', `The shelves share nothing, so by the additive principle there are 7 + 5 + ${n(c)} = ${n(12 + c)} ways.`, [['Ways', 12 + c], ['Filters and valves', 12]]); },
 /* One letter from L, then two digits, the first not 0 and the two different: L × 9 × 9, L from 2 to 12. */
 q10: t => { t = T(t); const L = 2 + (t + 10) % 11;
  return E('Predict the number of codes.', `Letter: ${n(L)} choices. First digit 1 to 9: 9 choices. Last digit any but the first: 9 choices. ${n(L)} × 9 × 9 = ${n(81 * L)}.`, [['Codes', 81 * L], ['Letter choices', L], ['Digit pairs', 81]]); },
});
})();
