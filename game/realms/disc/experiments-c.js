/* Discrete mathematics concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]), sub = k => String(k).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
const fact = a => { let f = 1; for (let i = 2; i <= a; i++) f *= i; return f; };
const C = (a, b) => (b < 0 || b > a) ? 0 : Math.round(fact(a) / (fact(b) * fact(a - b)));
const alt = vals => vals.map((v, i) => i === 0 ? n(v) : `${i % 2 ? '−' : '+'} ${n(v)}`).join(' ');
/* Slider settings, shared with variants-c.js (same formulas). */
const S = {
 q21: t => 3 + (t + 10) % 4,          // jobs, 3 to 6, for 3 crews
 q22: t => 2 + (t + 10) % 6,          // crates, 2 to 7
 q23: t => 5 + (t + 10) % 8,          // crates, 5 to 12, for 3 domes of at most 4
 q24: t => 1 + (t + 10) % 9,          // a₁, 1 to 9, with aₙ = 2aₙ₋₁ + 1
 q25: t => 1 + (t + 10) % 9,          // common difference, 1 to 9, from 5 over 10 terms
 q26: t => 3 + (t + 10) % 6,          // number of terms, 3 to 8, from 3 doubling
 q27: t => (t + 10) % 11 - 2,         // k in 2n² + kn + 1, −2 to 8
 q28: t => 1 + (t + 10) % 10,         // a₁, 1 to 10, with a₀ = 2 and the Fibonacci rule
 q29: t => 1 + (t + 10) % 7,          // week 1 stock, 1 to 7, doubling
 q30: t => 5 + (t + 10) % 16          // N, 5 to 20, for a₀ = 3 and aₙ = aₙ₋₁ + 2n
};
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Onto assignments of N jobs to 3 crews: 3ᴺ − 3 × 2ᴺ + 3. */
 q21: t => { t = T(t); const N = S.q21(t), all = Math.pow(3, N), one = Math.pow(2, N), miss = 3 * one - 3;
  return E('Predict the number of onto assignments, where every crew gets at least one job.', `All assignments: 3${sup(N)} = ${n(all)}. One named crew left out: 2${sup(N)} = ${n(one)}, for each of 3 crews; two named crews left out: 1 way, for each of 3 pairs. Some crew left out: 3 × ${n(one)} − 3 × 1 = ${n(miss)}. Onto: ${n(all)} − ${n(miss)} = ${n(all - miss)}.`, [['Onto assignments', all - miss], ['All assignments', all], ['Some crew left out', miss]]); },
 /* Derangements of N crates: N! minus the orders with at least one crate home. */
 q22: t => { t = T(t); const N = S.q22(t), f = fact(N), parts = []; for (let j = 1; j <= N; j++) parts.push(f / fact(j));
  const home = parts.reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v, 0);
  return E('Predict the number of derangements: the orders with no crate in its own bin.', `All orders: ${n(N)}! = ${n(f)}. At least one crate home, by inclusion–exclusion: ${alt(parts)} = ${n(home)}. Derangements: ${n(f)} − ${n(home)} = ${n(f - home)}.`, [['Derangements', f - home], ['All orders', f], ['At least one home', home]]); },
 /* N identical crates to 3 domes, each at most 4. */
 q23: t => { t = T(t); const N = S.q23(t), all = C(N + 2, 2), terms = []; for (let i = 1; i <= 3 && N - 5 * i >= 0; i++) terms.push(C(3, i) * C(N - 5 * i + 2, 2));
  const over = terms.reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v, 0);
  return E('Predict the number of ways in which every dome gets at most 4 crates.', `No limit: C(${n(N + 2)}, 2) = ${n(all)}. Some dome over the limit, by inclusion–exclusion: ${alt(terms)} = ${n(over)}. Within the limit: ${n(all)} − ${n(over)} = ${n(all - over)}.`, [['Ways within the limit', all - over], ['Ways with no limit', all], ['Ways over the limit', over]]); },
 /* a₁ = s and aₙ = 2aₙ₋₁ + 1, up to a₅. */
 q24: t => { t = T(t); const s = S.q24(t), a = [0, s]; for (let k = 2; k <= 5; k++) a.push(2 * a[k - 1] + 1);
  return E('Predict a₅ from the recursive definition.', `Start from a₁ = ${n(s)} and double and add 1 each time: ${a.slice(1).map(n).join(', ')}.`, [['a₅', a[5]], ['a₂', a[2]], ['a₃', a[3]]]); },
 /* Arithmetic from 5 with common difference d, 10 terms. */
 q25: t => { t = T(t); const d = S.q25(t), last = 5 + 9 * d, sum = 10 * (5 + last) / 2;
  return E('Predict the sum of the first 10 terms.', `a₁₀ = 5 + 9 × ${n(d)} = ${n(last)}, so the sum is 10 × (5 + ${n(last)}) ÷ 2 = ${n(sum)}.`, [['Sum of first 10 terms', sum], ['10th term', last]]); },
 /* Geometric from 3 with common ratio 2, N terms. */
 q26: t => { t = T(t); const N = S.q26(t), last = 3 * Math.pow(2, N - 1), sum = 3 * (Math.pow(2, N) - 1);
  return E('Predict the sum of the terms.', `The last term is 3 × 2${sup(N - 1)} = ${n(last)}. The sum is 3 × (2${sup(N)} − 1) ÷ (2 − 1) = ${n(sum)}.`, [['Sum of the terms', sum], ['Last term', last]]); },
 /* 2n² + kn + 1 at n = 1 … 5; the next term at n = 6. */
 q27: t => { t = T(t); const k = S.q27(t), f = m => 2 * m * m + k * m + 1, list = [1, 2, 3, 4, 5].map(f), d1 = [1, 2, 3, 4].map(i => list[i] - list[i - 1]), nd = d1[3] + 4;
  return E('Predict the next term of the list.', `First differences: ${d1.map(n).join(', ')}. Second differences: 4, 4, 4, constant, so the degree is 2. The next first difference is ${n(d1[3])} + 4 = ${n(nd)}, so the next term is ${n(list[4])} + ${n(nd)} = ${n(list[4] + nd)}.`, [['Next term', list[4] + nd], ['Second difference', 4], ['Last first difference', d1[3]]]); },
 /* a₀ = 2, a₁ = s, aₙ = aₙ₋₁ + aₙ₋₂; a₆ = 8s + 10. */
 q28: t => { t = T(t); const s = S.q28(t), a = [2, s]; for (let k = 2; k <= 6; k++) a.push(a[k - 1] + a[k - 2]);
  return E('Predict a₆.', `Each term is the sum of the two before it: ${a.map((v, i) => `a${sub(i)} = ${n(v)}`).join(', ')}.`, [['a₆', a[6]], ['a₂', a[2]], ['a₃', a[3]]]); },
 /* Stock that doubles each week from g; the total over 6 weeks is 63g. */
 q29: t => { t = T(t); const g = S.q29(t), w6 = 32 * g, tot = 63 * g;
  return E('Predict the total over the first 6 weeks.', `Common ratio 2, so the total is ${n(g)} × (2⁶ − 1) ÷ (2 − 1) = ${n(g)} × 63 = ${n(tot)}. Week 6 alone has ${n(g)} × 2⁵ = ${n(w6)}.`, [['Total over 6 weeks', tot], ['Week 6 stock', w6]]); },
 /* a₀ = 3 and aₙ = aₙ₋₁ + 2n: a_N = 3 + (2 + 4 + … + 2N) = 3 + N(N + 1). */
 q30: t => { t = T(t); const N = S.q30(t), sum = N * (2 + 2 * N) / 2;
  return E(`Predict a${sub(N)} by iteration.`, `a${sub(N)} = a₀ + (2 + 4 + … + ${n(2 * N)}). The ${n(N)} amounts are arithmetic, with sum ${n(N)} × (2 + ${n(2 * N)}) ÷ 2 = ${n(sum)}, so a${sub(N)} = 3 + ${n(sum)} = ${n(3 + sum)}.`, [[`a${sub(N)}`, 3 + sum], ['Sum of the amounts', sum]]); },
});
})();
