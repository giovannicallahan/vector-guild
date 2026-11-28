/* Real analysis concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Bisection from an interval of length 1: the first k with 1 ÷ 2ᵏ < ε, for seven values of ε. */
 q21: t => { t = T(t); const e = [0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001][(t + 10) % 7]; let k = 0; while (1 / Math.pow(2, k) >= e) k++;
  return E('Predict the smallest number of halvings that traps the root in an interval shorter than ε.', `After ${n(k - 1)} halvings the length is 1 ÷ ${n(Math.pow(2, k - 1))}, which is not below ${n(e)}; after ${n(k)} it is 1 ÷ ${n(Math.pow(2, k))}, which is. So ${n(k)} halvings are needed.`, [['Halvings', k], ['Length after them', 1 / Math.pow(2, k)]]); },
 /* x² on [0, b] with b from 1 to 9: x² − y² = (x − y)(x + y), so the smallest Lipschitz constant is 2b. */
 q22: t => { t = T(t); const b = 1 + (t + 10) % 9;
  return E('Predict the smallest Lipschitz constant K of f on the interval.', `x² − y² = (x − y)(x + y), and on [0, ${n(b)}] the sum x + y comes as close as you like to ${n(2 * b)}, so K = ${n(2 * b)}.`, [['Smallest K', 2 * b], ['Right end of the interval', b]]); },
 /* g(x) = x² for x < 1, g(1) = v, and x + j for x > 1: kind 0 continuous, 1 removable, 2 jump; s shifts g(1) for variety. */
 q23: t => { t = T(t); const kind = (t + 10) % 3, s = Math.floor((t + 10) / 3), j = kind === 2 ? 1 + s : 0, v = kind === 1 ? 2 + s : 1, right = 1 + j;
  return E('Predict the code: 0 continuous at x = 1, 1 removable discontinuity, 2 jump discontinuity.', `The left-hand limit is 1 and the right-hand limit is 1${j ? ' + ' + n(j) : ''} = ${n(right)}; g(1) = ${n(v)}. ${right !== 1 ? 'The one-sided limits differ: a jump, code 2.' : v !== 1 ? 'The limits agree but the value differs: removable, code 1.' : 'Limits and value agree: continuous, code 0.'}`, [['Code', kind], ['Right-hand limit', right], ['g(1)', v]]); },
 /* f(x) = 2|x − 1| + kx: the difference quotient at 1 tends to k + 2 from the right and k − 2 from the left. */
 q24: t => { t = T(t);
  return E('Predict the limit of the difference quotient at x = 1 as h approaches 0 from the right.', `f(1 + h) − f(1) = 2|h|${t ? (t < 0 ? ' − ' : ' + ') + (Math.abs(t) === 1 ? '' : n(Math.abs(t))) + 'h' : ''}, so for h > 0 the quotient is 2 + ${par(t)} = ${n(t + 2)}; for h < 0 it is ${par(t)} − 2 = ${n(t - 2)}.`, [['Right-hand limit', t + 2], ['Left-hand limit', t - 2]]); },
 /* f(x) = x² + 3x on [t, t + 4]: the average slope is 2t + 7 and the mean value point is the midpoint t + 2. */
 q25: t => { t = T(t); const S = 2 * t + 7;
  return E('Predict the point c that the mean value theorem promises.', `The average slope is ((${par(t + 4)})² + 3 × ${par(t + 4)} − (${par(t)})² − 3 × ${par(t)}) ÷ 4 = ${n(S)}. f′(c) = 2c + 3 = ${n(S)} gives c = ${n(t + 2)}.`, [['c', t + 2], ['Average slope', S]]); },
 /* |f′| ≤ 0.5 over L = 1 to 10 hours: the change is at most 0.5L. */
 q26: t => { t = T(t); const L = 1 + (t + 10) % 10;
  return E('Predict the largest possible change in the reading over the interval.', `By the mean value theorem the change is f′(c) × ${n(L)} for some c, so it is at most 0.5 × ${n(L)} = ${n(L / 2)}.`, [['Largest change', L / 2], ['Hours', L]]); },
 /* eˣ at x = 1 with bound 3 ÷ (n + 1)!: the smallest n with the bound below 10⁻ʲ, j from 1 to 6. */
 q27: t => { t = T(t); const j = 1 + (t + 10) % 6, inv = Math.pow(10, j); let N = 0, f = 1; while (!(f * (N + 1) > 3 * inv)) { N++; f *= N; } const fN = f * (N + 1);
  return E('Predict the smallest degree n whose remainder bound 3 ÷ (n + 1)! is below ε.', `The bound is below 1 ÷ ${n(inv)} exactly when (n + 1)! is bigger than 3 × ${n(inv)} = ${n(3 * inv)}. ${n(N + 1)}! = ${n(fN)} is the first factorial that is, so n = ${n(N)}.`, [['Smallest degree', N], ['(n + 1)!', fN]]); },
 /* f(x) = x³ + x at x₀ = t: f′(x₀) = 3t² + 1 and (f⁻¹)′(f(x₀)) = 1 ÷ f′(x₀). */
 q28: t => { t = T(t); const D = 3 * t * t + 1, y = t * t * t + t;
  return { ...E('Predict (f⁻¹)′ at the reading y, as a fraction such as 1/7.', `f(${n(t)}) = ${n(y)}, so f⁻¹(${n(y)}) = ${n(t)}. f′(${n(t)}) = 3 × ${par(t)}² + 1 = ${n(D)}, so (f⁻¹)′(${n(y)}) = 1/${n(D)}.`, [['(f⁻¹)′(y)', 1 / D], ['f′(x₀)', D]]), tolerance: 0.00005 }; },
 /* sin x at x = 2 with bound 2ⁿ⁺¹ ÷ (n + 1)!: the smallest n with the bound below 10⁻ʲ, j from 1 to 6. */
 q29: t => { t = T(t); const j = 1 + (t + 10) % 6, inv = Math.pow(10, j); let N = 0; const fac = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
  while (!(fac(N + 1) > Math.pow(2, N + 1) * inv)) N++;
  return E('Predict the smallest degree n whose remainder bound 2ⁿ⁺¹ ÷ (n + 1)! is below ε.', `The bound is below 1 ÷ ${n(inv)} exactly when (n + 1)! is bigger than 2ⁿ⁺¹ × ${n(inv)}. For n = ${n(N)}: ${n(N + 1)}! = ${n(fac(N + 1))} is bigger than ${n(Math.pow(2, N + 1) * inv)}, and n = ${n(N - 1)} fails, so n = ${n(N)}.`, [['Smallest degree', N], ['(n + 1)!', fac(N + 1)]]); },
 /* x² on [0, m] with the partition {0, 1, …, m}, m from 2 to 7: U = 1² + 2² + … + m². */
 q30: t => { t = T(t); const m = 2 + (t + 10) % 6; let U = 0, L = 0; const parts = []; for (let i = 1; i <= m; i++) { U += i * i; L += (i - 1) * (i - 1); parts.push(n(i * i)); }
  return E('Predict the upper sum U(P, f).', `x² is increasing, so each piece of length 1 takes its supremum at its right end: U(P, f) = ${parts.join(' + ')} = ${n(U)}.`, [['Upper sum', U], ['Lower sum', L]]); },
});
})();
