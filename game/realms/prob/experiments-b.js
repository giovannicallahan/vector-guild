/* Probability concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* 200 crates: Northway 86 sound, 14 cracked; Ridgeline 85 − t sound, 15 + t cracked (100 crates). */
 q11: t => { t = T(t); const d = 15 + t, c = 100 - d;
  return E('Predict P(cracked | Ridgeline) as a decimal.', `Ridgeline sent ${n(c)} + ${n(d)} = 100 crates, ${n(d)} of them cracked, so P(cracked | Ridgeline) = ${n(d)} ÷ 100 = ${n(d / 100)}. P(Ridgeline or cracked) = (100 + 14 + ${n(d)} − ${n(d)}) ÷ 200 = 0.57.`, [['P(cracked | Ridgeline)', d / 100], ['P(Ridgeline or cracked)', 0.57], ['Ridgeline cracked', d]]); },
 /* 2 % carriers, 90 % hit rate, false-alarm rate f = 11 + t % (1 to 21), pictured on 10000 crew. */
 q12: t => { t = T(t); const f = 11 + t, fp = 98 * f, pos = 180 + fp, x = Math.round(180 / pos * 1000) / 1000;
  return { ...E('Predict P(carrier | positive), to 3 decimal places.', `Of 10000 crew, 200 are carriers and 180 of them test positive; ${n(f)}% of the other 9800 is ${n(fp)} false alarms. So ${n(pos)} test positive and P(carrier | positive) = 180 ÷ ${n(pos)} ≈ ${n(x)}.`, [['P(carrier | positive)', x], ['Positive results', pos], ['False alarms', fp]]), tolerance: 0.0005 }; },
 /* Odds in favour a : (25 − a) with a = 12 + t (2 to 22), so the probability a ÷ 25 is exact. */
 q13: t => { t = T(t); const a = 12 + t, b = 25 - a;
  return E('Predict the probability that the repair works, as a decimal.', `Odds of ${n(a)} : ${n(b)} in favour are ${n(a)} parts for and ${n(b)} against, ${n(a + b)} parts in all, so the probability is ${n(a)} ÷ 25 = ${n(a / 25)}.`, [['Probability', a / 25], ['Parts in all', 25]]); },
 /* P(0) = 0.1, P(1) = 0.25 + 0.01t, P(2) missing, P(3) = 0.15. */
 q14: t => { t = T(t); const p1 = 25 + t, miss = 50 - t;
  return E('Predict the missing probability P(X = 2).', `The known probabilities add to 0.1 + ${n(p1 / 100)} + 0.15 = ${n((25 + p1) / 100)}, so P(X = 2) = 1 − ${n((25 + p1) / 100)} = ${n(miss / 100)}. Then P(X ≥ 2) = ${n(miss / 100)} + 0.15 = ${n((miss + 15) / 100)}.`, [['P(X = 2)', miss / 100], ['P(X ≥ 2)', (miss + 15) / 100]]); },
 /* P(0) = 0.2 − 0.01t, P(1) = 0.4 + 0.01t, P(2) = 0.3, P(3) = 0.1. */
 q15: t => { t = T(t); const p0 = 20 - t, p1 = 40 + t, mu = (p1 + 60 + 30) / 100;
  return E('Predict the expected value E(X), the mean number of repairs a day.', `E(X) = 0 × ${n(p0 / 100)} + 1 × ${n(p1 / 100)} + 2 × 0.3 + 3 × 0.1 = ${n(p1 / 100)} + 0.6 + 0.3 = ${n(mu)}.`, [['E(X)', mu], ['P(X = 1)', p1 / 100]]); },
 /* P(0) = P(2) = a, P(1) = 1 − 2a with a = (15 + t) ÷ 100: μ = 1 and σ² = 2a. */
 q16: t => { t = T(t); const a = (15 + t) / 100, v = 2 * a, sd = Math.round(Math.sqrt(v) * 100) / 100;
  return E('Predict the variance σ².', `μ = 1 × ${n(1 - 2 * a)} + 2 × ${n(a)} = 1. The squared distances are 1, 0 and 1, so σ² = 1 × ${n(a)} + 0 × ${n(1 - 2 * a)} + 1 × ${n(a)} = ${n(v)}, and σ = √${n(v)} ≈ ${n(sd)}.`, [['σ²', v], ['σ (2 decimal places)', sd], ['μ', 1]]); },
 /* 1000 tickets at 2 credits: 1 wins A = 800 + 50t, 10 win 40 and 50 win 6. Expected net gain −0.5 + 0.05t. */
 q17: t => { t = T(t); const A = 800 + 50 * t, ev = A / 1000 + 0.7, net = Math.round((ev - 2) * 100) / 100;
  return E('Predict the expected net gain of one ticket, in credits.', `Expected prize: ${n(A)} × 0.001 + 40 × 0.01 + 6 × 0.05 = ${n(A / 1000)} + 0.4 + 0.3 = ${n(ev)} credits. Expected net gain: ${n(ev)} − 2 = ${n(net)} credits.`, [['Expected net gain (credits)', net], ['Expected prize (credits)', ev]]); },
 /* Pattern S, S, F, S with sprout chance p = 0.1 to 0.9: p³ × q is exact to 4 places. */
 q18: t => { t = T(t); const j = 1 + (t + 10) % 9, p = j / 10, q = (10 - j) / 10, x = Math.round(j * j * j * (10 - j)) / 10000;
  return { ...E('Predict the probability of the pattern S, S, F, S.', `q = 1 − ${n(p)} = ${n(q)}. P(S, S, F, S) = ${n(p)} × ${n(p)} × ${n(q)} × ${n(p)} = ${n(p)}³ × ${n(q)} = ${n(x)}.`, [['P(S, S, F, S)', x], ['q', q]]), tolerance: 0.00005 }; },
 /* k = 0 to 8 sprouts among 8 seeds: row 8 of the triangle of orders. */
 q19: t => { t = T(t); const k = (t + 10) % 9, r8 = [1, 8, 28, 56, 70, 56, 28, 8, 1], r7 = [1, 7, 21, 35, 35, 21, 7, 1];
  return E('Predict the number of orders.', `Row 8 of the triangle of orders is 1 8 28 56 70 56 28 8 1, and entry ${n(k)}, counting from 0, is ${n(r8[k])}.${k > 0 && k < 8 ? ` It is the sum of entries ${n(k - 1)} and ${n(k)} of row 7: ${n(r7[k - 1])} + ${n(r7[k])}.` : ''}`, [['Number of orders', r8[k]], ['Sprouts', k]]); },
 /* P(X = k) for 4 seeds that each sprout with probability 0.5: row 4 entries ÷ 16. */
 q20: t => { t = T(t); const k = (t + 10) % 5, c = [1, 4, 6, 4, 1][k];
  return { ...E('Predict P(X = k), the probability that exactly that many sprout.', `Row 4 of the triangle of orders is 1 4 6 4 1, so there ${c === 1 ? 'is 1 order' : `are ${n(c)} orders`}. Each order has probability 0.5 to the power 4 = 0.0625, so P(X = ${n(k)}) = ${n(c)} × 0.0625 = ${n(c / 16)}.`, [['P(X = k)', c / 16], ['Number of orders', c]]), tolerance: 0.00005 }; },
});
})();
