/* Probability concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Rounded targets carry their own tolerance (half a unit in the last place the prompt asks for). */
const ET = (prompt, formula, values, tolerance) => ({ ...E(prompt, formula, values), tolerance });
const rd = (x, dp) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const f6 = x => String(rd(x, 6));
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
/* The 21 pairs of whole-σ marks i < j from −3 to 3, and the empirical-rule pieces between neighbouring marks. */
const PAIRS = []; for (let i = -3; i < 3; i++) for (let j = i + 1; j <= 3; j++) PAIRS.push([i, j]);
const PIECE = [2.35, 13.5, 34, 34, 13.5, 2.35];
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* N = 5 … 25 seeds with p = 0.2: σ = √(0.16N) = 0.4√N to 2 places. */
 q21: t => { t = T(t); const N = t + 15, mean = rd(0.2 * N, 4), v = rd(0.16 * N, 4), sd = rd(Math.sqrt(v), 2);
  return ET('Predict the standard deviation √(npq) of the number of seeds that sprout, to 2 decimal places.', `q = 1 − 0.2 = 0.8, np = ${n(N)} × 0.2 = ${n(mean)} and npq = ${n(N)} × 0.2 × 0.8 = ${n(v)}, so σ = √${n(v)} ≈ ${n(sd)}.`, [['Standard deviation', sd], ['Mean np', mean], ['Variance npq', v]], 0.005); },
 /* p = 0.25, first sprout on seed k = 1 … 8: 0.75^(k − 1) × 0.25 to 4 places. */
 q22: t => { t = T(t); const k = 1 + (t + 10) % 8, P = rd(Math.pow(0.75, k - 1) * 0.25, 4);
  return ET('Predict the chance that the first sprout is that seed, to 4 decimal places.', `Seed ${n(k)} is the first sprout when the ${n(k - 1)} seeds before it fail: 0.75${sup(k - 1)} × 0.25 ≈ ${n(P)}. The mean wait is 1 ÷ 0.25 = 4 seeds.`, [['P(first sprout on that seed)', P], ['Failures first', k - 1], ['Mean seeds to the first sprout', 4]], 0.00005); },
 /* A row of N = 2 … 7 seeds with p = 0.3: P(exactly one) = N × 0.3 × 0.7^(N − 1), against the geometric chance for seed N. */
 q23: t => { t = T(t); const N = 2 + (t + 10) % 6, P = rd(N * 0.3 * Math.pow(0.7, N - 1), 4), G = rd(0.3 * Math.pow(0.7, N - 1), 4);
  return ET('Predict the chance that exactly one seed of the row sprouts, to 4 decimal places.', `The row is fixed, so this is binomial. The sprout can be any of the ${n(N)} seeds, so there are ${n(N)} orders: ${n(N)} × 0.3 × 0.7${sup(N - 1)} ≈ ${n(P)}. The geometric chance that the first sprout is seed ${n(N)} has one order only: ${n(G)}.`, [['P(exactly one sprouts)', P], ['Number of orders', N], ['Geometric P(first sprout is the last seed)', G]], 0.00005); },
 /* λ = 2, exactly k = 0 … 5 pings: 2ᵏ × e^(−2) ÷ k!. */
 q24: t => { t = T(t); const k = (t + 10) % 6, kf = fact(k), lk = Math.pow(2, k), P = rd(lk * Math.exp(-2) / kf, 4);
  return ET('Predict the probability of exactly that many pings in a minute, to 4 decimal places.', `${n(k)}! = ${n(kf)} and 2${sup(k)} = ${n(lk)}, so P(X = ${n(k)}) = ${n(lk)} × 0.135335 ÷ ${n(kf)} ≈ ${n(P)}.`, [['Probability', P], ['k!', kf], ['λ to the power k', lk]], 0.00005); },
 /* Uniform from 0 to 20 minutes, strip from 2 to d = 3 … 19. */
 q25: t => { t = T(t); const d = 3 + (t + 10) % 17, P = rd((d - 2) / 20, 4);
  return E('Predict the probability that the signal arrives in that stretch.', `The height is 1 ÷ 20 = 0.05, and the strip from 2 to ${n(d)} has width ${n(d - 2)}, so P(2 < X < ${n(d)}) = ${n(d - 2)} × 0.05 = ${n(P)}.`, [['Probability', P], ['Density height', 0.05], ['Strip width', d - 2]]); },
 /* Uniform from 10 to 30 minutes, kth percentile for k = 5, 10, … 95: 10 + 0.2k. */
 q26: t => { t = T(t); const k = 5 + 5 * ((t + 10) % 19), pct = rd(10 + k / 5, 4);
  return E('Predict that percentile, in minutes after midnight.', `The range is 30 − 10 = 20 minutes wide, so the ${n(k)}th percentile is 10 + ${n(k / 100)} × 20 = ${n(pct)} minutes. The mean is (10 + 30) ÷ 2 = 20.`, [['Percentile (min)', pct], ['Share to the left', k / 100], ['Mean (min)', 20]]); },
 /* Decay rate 0.1 per hour, failing within x = 2 … 22 hours: 1 − e^(−0.1x). */
 q27: t => { t = T(t); const x = t + 12, v = rd(0.1 * x, 4), P = rd(1 - Math.exp(-v), 4);
  return ET('Predict the probability that the valve fails within that time, to 4 decimal places.', `mx = 0.1 × ${n(x)} = ${n(v)}, so P(X < ${n(x)}) = 1 − ${f6(Math.exp(-v))} ≈ ${n(P)}. The mean lifetime is 1 ÷ 0.1 = 10 hours.`, [['Probability', P], ['mx', v], ['Mean lifetime (h)', 10]], 0.00005); },
 /* Decay rate 0.2 per hour, already run 5 hours, another b = 2 … 11 hours: e^(−0.2b). */
 q28: t => { t = T(t); const b = 2 + (t + 10) % 10, v = rd(0.2 * b, 4), P = rd(Math.exp(-v), 4), late = rd(Math.exp(-0.2 * (5 + b)), 4);
  return ET('Predict the chance that the battery lasts that many hours more, to 4 decimal places.', `P(X > ${n(5 + b)} | X > 5) = e^(−${n(rd(0.2 * (5 + b), 4))}) ÷ e^(−1) = e^(−${n(v)}) ≈ ${n(P)}, the same as P(X > ${n(b)}) for a new battery. A new battery lasts past ${n(5 + b)} hours with chance ${n(late)}.`, [['Conditional probability', P], ['P(new battery lasts past a + b)', late], ['Hours more', b]], 0.00005); },
 /* Model 1, 2 or 3 in turn; idx = 0 … 6 sets the numbers. */
 q29: t => { t = T(t); const kind = 1 + (t + 10) % 3, idx = Math.floor((t + 10) / 3); let P, say;
  if (kind === 1) { const k = 1 + idx % 5, lk = Math.pow(3, k), kf = fact(k); P = rd(lk * Math.exp(-3) / kf, 4); say = `Poisson with λ = 3: 3${sup(k)} × 0.049787 ÷ ${n(k)}! = ${n(lk)} × 0.049787 ÷ ${n(kf)} ≈ ${n(P)}.`; }
  else if (kind === 2) { const d = 10 + 4 * idx; P = rd((d - 4) / 40, 4); say = `Uniform from 0 to 40: (${n(d)} − 4) ÷ 40 = ${n(P)}.`; }
  else { const x = 3 + 2 * idx, v = rd(0.1 * x, 4); P = rd(1 - Math.exp(-v), 4); say = `Exponential with m = 0.1: 1 − e^(−${n(v)}) = 1 − ${f6(Math.exp(-v))} ≈ ${n(P)}.`; }
  return ET('Predict the probability asked for, to 4 decimal places.', `Model ${n(kind)}. ${say}`, [['Probability', P], ['Model', kind]], 0.00005); },
 /* Normal with μ = 50 mm and σ = 2 mm; the pair of marks runs through all 21 pairs i < j. */
 q30: t => { t = T(t); const [i, j] = PAIRS[(t + 10) % 21], parts = PIECE.slice(i + 3, j + 3), pct = rd(parts.reduce((s, x) => s + x, 0), 4);
  return E('Predict the percentage of bolts between the two lengths, by the empirical rule.', `${n(50 + 2 * i)} mm is ${n(i)} standard deviations from the mean and ${n(50 + 2 * j)} mm is ${n(j)}. The pieces between them are ${parts.map(x => n(x) + '%').join(' + ')}, which make ${n(pct)}%.`, [['Percentage', pct], ['Shorter length (σ from mean)', i], ['Longer length (σ from mean)', j]]); },
});
})();
