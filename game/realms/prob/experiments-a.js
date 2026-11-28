/* Probability concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A bag of 20 tokens, g of them green (1 to 19); P(green) = g/20 has at most two decimals. */
 q01: t => { t = T(t); const g = 1 + (t + 10) % 19;
  return E('Predict P(green) as a decimal.', `The sample space has 20 equally likely outcomes and ${n(g)} are green, so P(green) = ${n(g)}/20 = ${n(g / 20)}.`, [['P(green)', g / 20], ['Green tokens', g], ['Outcomes in the sample space', 20]]); },
 /* A log of 50 runs, k on time (25 to 45); the next 200 runs. */
 q02: t => { t = T(t); const k = 35 + t, fr = (2 * k) / 100;
  return E('Predict the expected number of on-time runs in the next 200.', `The relative frequency is ${n(k)} ÷ 50 = ${n(fr)}, so the expected count is 200 × ${n(fr)} = ${n(4 * k)}.`, [['Expected on time in 200 runs', 4 * k], ['Relative frequency', fr], ['On time in the log', k]]); },
 /* A deck of 25 cards, k for the canyon (1 to 21). */
 q03: t => { t = T(t); const k = t + 11, pA = (4 * k) / 100, pN = (100 - 4 * k) / 100;
  return E('Predict P(A′), the chance that the card does not name the canyon, as a decimal.', `P(A) = ${n(k)}/25 = ${n(pA)}, so P(A′) = 1 − ${n(pA)} = ${n(pN)}, which is ${n(25 - k)} of the 25 cards.`, [['P(A′)', pN], ['P(A)', pA], ['Cards not for the canyon', 25 - k]]); },
 /* Two spinners numbered 1 to 6; the sum s runs from 2 to 12. */
 q04: t => { t = T(t); const s = 2 + (t + 10) % 11, c = 6 - Math.abs(s - 7);
  return E('Predict how many of the 36 cells give that sum.', `The sum ${n(s)} needs the second spinner to show ${n(s)} minus the first. That works in ${n(c)} of the 6 rows, so ${n(c)} cells and P = ${n(c)}/36.`, [['Cells with the sum', c], ['Cells in the grid', 36]]); },
 /* Venn regions: F only 6, overlap c (1 to 10), C only 4. */
 q05: t => { t = T(t); const c = 1 + (t + 10) % 10;
  return E('Predict the number of crates in “F or C”.', `Inside the circles: 6 + ${n(c)} + 4 = ${n(10 + c)}. The overlap, “F and C”, is ${n(c)}.`, [['Crates in F or C', 10 + c], ['Crates in F and C', c], ['Crates in F', 6 + c]]); },
 /* P(A) = 0.5, P(B) = 0.3, P(A and B) from 0.01 to 0.21. */
 q06: t => { t = T(t); const ab = t + 11;
  return E('Predict P(A or B) as a decimal.', `P(A or B) = 0.5 + 0.3 − ${n(ab / 100)} = ${n((80 - ab) / 100)}.`, [['P(A or B)', (80 - ab) / 100], ['P(A and B)', ab / 100]]); },
 /* Tycho Works sent 50 crates, c of them cracked (1 to 21); Rhea sent 40 intact and 10 cracked. */
 q07: t => { t = T(t); const c = t + 11;
  return E('Predict P(cracked | Tycho) as a decimal.', `Given Tycho, keep only its 50 crates. ${n(c)} are cracked, so P(cracked | Tycho) = ${n(c)}/50 = ${n((2 * c) / 100)}.`, [['P(cracked | Tycho)', (2 * c) / 100], ['Cracked Tycho crates', c], ['Tycho crates', 50]]); },
 /* A stack of 10 crates, f faulty (2 to 9); two taken without replacement. Rounded to 4 decimal places. */
 q08: t => { t = T(t); const f = 2 + (t + 10) % 8, p = Math.round(f * (f - 1) / 90 * 10000) / 10000;
  return { ...E('Predict P(both faulty) as a decimal, rounded to 4 decimal places.', `P(both faulty) = ${n(f)}/10 × ${n(f - 1)}/9 = ${n(f * (f - 1))}/90, which is ${n(p)} to 4 decimal places.`, [['P(both faulty)', p], ['Numerator before reducing', f * (f - 1)], ['Denominator', 90]]), tolerance: 0.00005 }; },
 /* P(A) = 0.4 and P(B) = 0.04k (k from 1 to 21): if independent, P(A and B) = 0.016k. */
 q09: t => { t = T(t); const k = t + 11, b = (4 * k) / 100, ab = (16 * k) / 1000;
  return E('Predict P(A and B) if the events are independent, as a decimal.', `Independent events multiply: P(A and B) = 0.4 × ${n(b)} = ${n(ab)}.`, [['P(A and B)', ab], ['P(B)', b]]); },
 /* Rhea sends 0.6 with damage rate 0.05; Tycho sends 0.4 with damage rate r (0.01 to 0.21). */
 q10: t => { t = T(t); const r = t + 11, tot = (300 + 40 * r) / 10000;
  return E('Predict P(damaged) as a decimal.', `Rhea path 0.6 × 0.05 = 0.03; Tycho path 0.4 × ${n(r / 100)} = ${n((40 * r) / 10000)}. P(damaged) = 0.03 + ${n((40 * r) / 10000)} = ${n(tot)}.`, [['P(damaged)', tot], ['Tycho path', (40 * r) / 10000]]); },
});
})();
