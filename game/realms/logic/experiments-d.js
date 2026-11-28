/* Logic and proof concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* n² + n + c with c from 1, 5, 11, 17, 35: the first n where the value is not prime. */
 q31: t => { t = T(t); const c = [1, 5, 11, 17, 35][(t + 10) % 5], val = i => i * i + i + c, prime = x => { for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return x > 1; };
  let k = 1; while (prime(val(k))) k++; const v = val(k); let d = 2; while (v % d) d++;
  return E('Predict the smallest counterexample n.', `n = 1 to ${n(k - 1)} give prime values. n = ${n(k)} gives ${n(k)}² + ${n(k)} + ${n(c)} = ${n(v)} = ${n(d)} × ${n(v / d)}, which is not prime.`, [['Smallest counterexample n', k], ['Value there', v], ['Smallest divisor above 1', d]]); },
 /* The smallest number above c = 30 … 110 that both 4 and 6 divide: the next multiple of 12. */
 q32: t => { t = T(t); const c = 30 + 4 * (t + 10), w = 12 * (Math.floor(c / 12) + 1);
  return E('Predict the smallest witness.', `A number that both 4 and 6 divide is a multiple of 12. The first multiple of 12 above ${n(c)} is ${n(w)} = 4 × ${n(w / 4)} = 6 × ${n(w / 6)}.`, [['Smallest witness', w], ['Witness ÷ 12', w / 12]]); },
 /* d divides n if and only if d divides n + 2d, d from 3 to 7, n from 1 to 40. */
 q33: t => { t = T(t); const d = 3 + (t + 10) % 5, c = Math.floor(40 / d);
  return E(`Predict how many n from 1 to 40 make “${n(d)} divides n” true.`, `The numbers from 1 to 40 that ${n(d)} divides are the multiples of ${n(d)}: ${n(c)} of them. Both sides are true for exactly these numbers, so “${n(d)} divides n + ${n(2 * d)}” also holds for ${n(c)} of them.`, [['Count for the left side', c], ['Count for the right side', c]]); },
 /* A "proof" that checks e = 2 … 5 examples of n² + n + 11 and then claims every n: the wrong step is e + 1. */
 q34: t => { t = T(t); const e = 2 + (t + 10) % 4;
  return E('Predict the number of the first wrong step.', `Steps 1 to ${n(e)} each check one example correctly. Step ${n(e + 1)} concludes the claim for every n from ${n(e)} examples, which does not follow: n = 10 gives 121 = 11 × 11.`, [['First wrong step', e + 1], ['Examples checked', e]]); },
 /* 2ⁿ > an + 1 with a from 3 to 10: the first n where it holds. */
 q35: t => { t = T(t); const a = 3 + (t + 10) % 8; let k = 1; while (Math.pow(2, k) <= a * k + 1) k++;
  return E('Predict the first n at which the claim is true, where the base case must go.', `At n = ${n(k - 1)}: ${n(Math.pow(2, k - 1))} against ${n(a * (k - 1) + 1)}, false. At n = ${n(k)}: ${n(Math.pow(2, k))} against ${n(a * k + 1)}, true.`, [['First n where it holds', k], ['Left side there', Math.pow(2, k)], ['Right side there', a * k + 1]]); },
 /* 1 + 3 + … + (2n − 1) = n², step from k = 3 … 23 to k + 1. */
 q36: t => { t = T(t); const k = 13 + t;
  return E('Predict the amount added going from n = k to n = k + 1.', `The term for n = ${n(k + 1)} is 2 × ${n(k + 1)} − 1 = ${n(2 * k + 1)}. Then ${n(k * k)} + ${n(2 * k + 1)} = ${n((k + 1) * (k + 1))} = ${n(k + 1)}², as the formula says.`, [['Amount added', 2 * k + 1], ['Sum up to n = k', k * k], ['Total at n = k + 1', (k + 1) * (k + 1)]]); },
 /* 1 + 3 + … + (2n − 1) = n² at n = 20 … 120. */
 q37: t => { t = T(t); const m = 70 + 5 * t;
  return E('Predict the sum, using the formula.', `Put n = ${n(m)} into the right side: ${n(m)}² = ${n(m * m)}. The next term is 2 × ${n(m + 1)} − 1 = ${n(2 * m + 1)}.`, [['Sum', m * m], ['Next term', 2 * m + 1]]); },
 /* 2ⁿ > c·n² with c from 1, 2, 3, 4, 5, 6, 8, 10: the N from which it holds for good. */
 q38: t => { t = T(t); const c = [1, 2, 3, 4, 5, 6, 8, 10][(t + 10) % 8], ok = i => Math.pow(2, i) > c * i * i; let N = 30; while (N > 1 && ok(N - 1)) N--;
  return E('Predict the smallest N from which the inequality holds for good.', `At n = ${n(N - 1)}: ${n(Math.pow(2, N - 1))} against ${n(c * (N - 1) * (N - 1))}, false. From n = ${n(N)} on it is true: ${n(Math.pow(2, N))} against ${n(c * N * N)}, and the left side keeps pulling away.`, [['N', N], ['Left side at N', Math.pow(2, N)], ['Right side at N', c * N * N]]); },
 /* 3-credit and b-credit stamps, b from 4, 5, 7, 8, 10, 11: the largest amount that cannot be paid is 2b − 3. */
 q39: t => { t = T(t); const b = [4, 5, 7, 8, 10, 11][(t + 10) % 6], F = 3 * b - 3 - b;
  return E('Predict the largest amount that cannot be paid.', `${n(F)} cannot be paid, but ${n(F + 1)}, ${n(F + 2)} and ${n(F + 3)} can, and every larger amount follows by adding 3-credit stamps. Check: 3 × ${n(b)} − 3 − ${n(b)} = ${n(F)}.`, [['Largest amount that cannot be paid', F], ['Base cases needed', 3]]); },
 /* ε = e ÷ 1000 for e from 5, 8, 10, 12, 16, 20, 25, 30, 40, 60: N is the first whole number above 1 ÷ ε. */
 q40: t => { t = T(t); const e = [5, 8, 10, 12, 16, 20, 25, 30, 40, 60][(t + 10) % 10], q = Math.floor(1000 / e), N = q + 1, whole = 1000 % e === 0;
  return E('Predict the smallest N with 1 ÷ n < ε for every n ≥ N.', `1 ÷ ${n(e / 1000)} is ${whole ? `${n(q)} exactly` : `about ${n(Math.round(100000 / e) / 100)}`}, and N must be strictly above it, so N = ${n(N)}.`, [['N', N], ['Whole-number part of 1 ÷ ε', q]]); },
});
})();
