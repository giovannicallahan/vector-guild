/* Data and inference practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p8.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};

/* Helpers. r2: round to 2 decimals; tie2: third decimal exactly 5 (filtered from draws); exact: at most dp decimals;
   ap/to2: "= 4.3636…, which is 4.36 to 2 decimal places", or just the value when it is already exact. */
const r2 = x => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
const tie2 = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-6;
const exact = (x, dp) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-7;
const ap = x => exact(x, 4) ? n(x) : n(x) + '…';
const to2 = x => exact(x, 2) ? n(x) : `${ap(x)}, which is ${(r2(x)).toFixed(2).replace('-', '−')} to 2 decimal places`;
const list = xs => xs.map(n).join(', ');
const sum = xs => xs.reduce((s, x) => s + x, 0);
const cap = s => s[0].toUpperCase() + s.slice(1);
/* Copies of the printed tables the learn missions use (gen-d.js): 5% critical values of F (numerator df 2 and 3, denominator
   df 6–20), χ² with 5% to the left (CHIL) and right (CHIR), and two-tailed 5% critical values of t. */
const FCRIT = {
 2: { 6: 5.14, 7: 4.74, 8: 4.46, 9: 4.26, 10: 4.1, 11: 3.98, 12: 3.89, 13: 3.81, 14: 3.74, 15: 3.68, 16: 3.63, 17: 3.59, 18: 3.55, 19: 3.52, 20: 3.49 },
 3: { 6: 4.76, 7: 4.35, 8: 4.07, 9: 3.86, 10: 3.71, 11: 3.59, 12: 3.49, 13: 3.41, 14: 3.34, 15: 3.29, 16: 3.24, 17: 3.2, 18: 3.16, 19: 3.13, 20: 3.1 }
};
const CHIL = { 3: 0.352, 4: 0.711, 5: 1.145, 6: 1.635, 7: 2.167, 8: 2.733, 9: 3.325, 10: 3.94, 11: 4.575, 12: 5.226, 13: 5.892, 14: 6.571, 15: 7.261, 16: 7.962, 17: 8.672, 18: 9.39, 19: 10.117, 20: 10.851 };
const CHIR = { 1: 3.841, 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.07, 6: 12.592, 7: 14.067, 8: 15.507, 9: 16.919, 10: 18.307, 11: 19.675, 12: 21.026, 13: 22.362, 14: 23.685, 15: 24.996, 16: 26.296, 17: 27.587, 18: 28.869, 19: 30.144, 20: 31.41 };
const TCRIT = { 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228, 11: 2.201, 12: 2.179, 13: 2.16, 14: 2.145, 15: 2.131, 16: 2.12, 17: 2.11 };
/* Area to the left of z under the standard normal curve, and its 4-place table value. */
const Phi = z => { let s = z, term = z; for (let k = 1; k < 200; k++) { term *= -z * z / 2 / k; const add = term / (2 * k + 1); s += add; if (Math.abs(add) < 1e-17) break; } return 0.5 + s / Math.sqrt(2 * Math.PI); };
const Phi4 = z => Math.round(Phi(z) * 1e4) / 1e4;
const fTable = (dw, off, dbs) => dbs.flatMap(a => [0, 1, 2].map(i => `F(${a}, ${dw - off + i}) = ${n(FCRIT[a][dw - off + i])}`)).join(', ');
const chiRows = (df, off, both) => [0, 1, 2].map(i => Math.max(1, df - off) + i).map(d => both ? `df ${d}, ${n(CHIL[d])} and ${n(CHIR[d])}` : `df ${d}, ${n(CHIR[d])}`).join('; ');
const zRows = (az, off) => [0, 1, 2, 3, 4].map(i => Math.round((az - (off - i) / 100) * 100) / 100).map(z => `z = ${n(z)}, ${n(Phi4(z))}`).join('; ');

/* ---- q36 The F ratio and the decision [13.2] ---- */

/* q36b: new setting. k = 3 or 4 groups, df within 9 to 16, whole mean squares (so F needs one rounding only). F is never on a
   rounding tie and never within 0.1 of the critical value. Three table columns start at df within − off. */
const F_B = [['The water engineer', 'filter designs', 'tanks'], ['The site surveyor', 'insulation types', 'test walls'], ['The power technician', 'battery makes', 'trial charges'], ['The paint chemist', 'coatings', 'steel strips']];
mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The filter trial report',
 brief: 'A trial of competing designs has produced two sums of squares, and the engineer must say whether the designs really differ.',
 labels: ['df between', 'df within', 'F ratio', '1 reject, 0 not'], tolerance: 0.005,
 gl: [['df between', 'df within'], ['mean square between', 'mean square within', 'F ratio'], ['1 reject, 0 not']]
}, {
 canonical: { ctx: 0, k: 4, n: 20, msb: 30, msw: 8, off: 0 },
 draw: R => { let p; for (;;) { const k = R.int(3, 4), dw = R.int(9, 16); p = { ctx: R.int(0, F_B.length - 1), k, n: dw + k, msb: 0, msw: R.int(4, 25), off: R.int(0, 2) };
  p.msb = R.int(Math.max(4, p.msw), 7 * p.msw); const F = p.msb / p.msw;
  if (tie2(F) || F < 0.5 || F > 12 || Math.abs(r2(F) - FCRIT[k - 1][dw]) < 0.1) continue; return p; } },
 build: ({ ctx, k, n: N, msb, msw, off }) => { const [who, grp, unit] = F_B[ctx], db = k - 1, dw = N - k, ssb = msb * db, ssw = msw * dw, F = msb / msw, F2 = r2(F), crit = FCRIT[db][dw], dec = F2 > crit ? 1 : 0; return {
  prompt: `${who} compared ${n(k)} ${grp} on ${n(N)} ${unit} in all. The lab’s analysis of variance reports a sum of squares between groups of ${n(ssb)} and a sum of squares within groups of ${n(ssw)}. Critical values of F with 5% of the area to their right, written F(df between, df within): ${fTable(dw, off, [2, 3])}. Enter the degrees of freedom between groups, then within groups, then the F ratio to 2 decimal places, then 1 if the claim that all the group means are equal should be rejected at the 5% level, or 0 if not.`,
  answer: [db, dw, F2, dec],
  hints: ['Between groups the degrees of freedom are the number of groups minus 1. Within groups they are the number of readings minus the number of groups.', 'A mean square is a sum of squares divided by its degrees of freedom, and F is the mean square between groups divided by the mean square within. Reject when F is larger than the critical value for your two df.'],
  solution: `df between = ${n(k)} − 1 = ${n(db)} and df within = ${n(N)} − ${n(k)} = ${n(dw)}. Mean square between = ${n(ssb)} ÷ ${n(db)} = ${n(msb)} and mean square within = ${n(ssw)} ÷ ${n(dw)} = ${n(msw)}, so F = ${n(msb)} ÷ ${n(msw)} = ${to2(F)}. The critical value F(${n(db)}, ${n(dw)}) is ${n(crit)}. ${dec ? `${n(F2)} is larger, so the p-value is below 0.05: reject the claim that the means are all equal, and enter 1. At least one of the ${grp} has a different mean.` : `${n(F2)} is not larger, so the p-value is above 0.05: do not reject the claim that the means are all equal, and enter 0. The differences could be chance.`}`,
  guidance: [
   { prompt: 'What are the degrees of freedom between groups and within groups?', answer: [db, dw], explanation: `Between: ${n(k)} groups − 1 = ${n(db)}. Within: ${n(N)} readings − ${n(k)} groups = ${n(dw)}.` },
   { prompt: 'Divide each sum of squares by its degrees of freedom. What are the mean square between, the mean square within, and F to 2 decimal places?', answer: [msb, msw, F2], explanation: `${n(ssb)} ÷ ${n(db)} = ${n(msb)} and ${n(ssw)} ÷ ${n(dw)} = ${n(msw)}. F = ${n(msb)} ÷ ${n(msw)} = ${to2(F)}.` },
   { prompt: `The critical value for ${n(db)} and ${n(dw)} degrees of freedom is ${n(crit)}. Enter 1 to reject the claim that all the means are equal, 0 not to.`, answer: [dec], explanation: dec ? `${n(F2)} is larger than ${n(crit)}, so reject.` : `${n(F2)} is not larger than ${n(crit)}, so do not reject.` }
  ] }; }
});

/* q36c: applied. k groups of m, whole group means with a whole grand mean (deviations from it add to 0). The sum of squares
   between is m × Σ(mean − grand)², and must divide by df between exactly; the mean square within is whole. F is never on a
   rounding tie and never within 0.1 of the critical value. */
const C36 = [['The farm tried', 'fertiliser mixes', 'beds', 'kilograms of yield per bed'], ['The workshop tried', 'coatings', 'steel panels', 'grams of rust per panel'], ['The repair crew tried', 'toolkits', 'repair jobs', 'minutes per job'], ['The rover team tried', 'tyre types', 'test laps', 'seconds per lap']];
mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'From group means to a verdict',
 brief: 'The clerk has lost the between-groups figure from a trial, but the group means and the within-groups figure survive.',
 labels: ['SS between groups', 'F ratio', '1 reject, 0 not'], tolerance: 0.005,
 gl: [['grand mean', 'SS between groups'], ['mean square between', 'mean square within', 'F ratio'], ['1 reject, 0 not']]
}, {
 canonical: { ctx: 1, k: 3, m: 5, means: [34, 38, 30], msw: 14, off: 1 },
 draw: R => { let p; for (;;) { const k = R.int(3, 4), m = R.int(4, 6), dw = k * (m - 1), g = R.int(15, 60), dev = [];
  for (let i = 0; i < k - 1; i++) dev.push(R.int(-6, 6)); dev.push(-sum(dev));
  if (dev.every(v => v === 0) || dev.some(v => Math.abs(v) > 7)) continue;
  const ssb = m * sum(dev.map(v => v * v)), db = k - 1; if (ssb % db) continue;
  p = { ctx: R.int(0, C36.length - 1), k, m, means: dev.map(v => g + v), msw: R.int(3, 14), off: R.int(0, 2) };
  if (dw < 8 || dw > 18) continue; const F = ssb / db / p.msw; if (tie2(F) || F < 0.5 || F > 12 || Math.abs(r2(F) - FCRIT[db][dw]) < 0.1) continue; return p; } },
 build: ({ ctx, k, m, means, msw, off }) => { const [who, grp, unit, meas] = C36[ctx], N = k * m, db = k - 1, dw = N - k, g = sum(means) / k, parts = means.map(x => (x - g) * (x - g)), ssb = m * sum(parts), msb = ssb / db, ssw = msw * dw, F = msb / msw, F2 = r2(F), crit = FCRIT[db][dw], dec = F2 > crit ? 1 : 0; return {
  prompt: `${who} ${n(k)} ${grp}, each on ${n(m)} ${unit}, so ${n(N)} ${unit} in all. The mean results, in ${meas}, were ${list(means)} for the ${n(k)} ${grp} in that order. The clerk’s analysis of variance gives a sum of squares within groups of ${n(ssw)}. Critical values of F with 5% of the area to their right, written F(df between, df within): ${fTable(dw, off, [2, 3])}. Enter the sum of squares between groups, then the F ratio to 2 decimal places, then 1 if the claim that all the group means are equal should be rejected at the 5% level, or 0 if not.`,
  answer: [ssb, F2, dec],
  hints: ['The grand mean is the mean of the group means when the groups are the same size. The sum of squares between groups is the group size times the sum of (group mean − grand mean)².', 'Degrees of freedom between are the number of groups minus 1, and within are the number of readings minus the number of groups. Divide each sum of squares by its df; F is the mean square between divided by the mean square within. Reject when F is larger than the critical value.'],
  solution: `The grand mean is ${n(sum(means))} ÷ ${n(k)} = ${n(g)}. The sum of squares between groups is ${n(m)} × (${means.map(x => `(${n(x)} − ${n(g)})²`).join(' + ')}) = ${n(m)} × ${n(sum(parts))} = ${n(ssb)}. df between = ${n(k)} − 1 = ${n(db)} and df within = ${n(N)} − ${n(k)} = ${n(dw)}, so the mean squares are ${n(ssb)} ÷ ${n(db)} = ${n(msb)} and ${n(ssw)} ÷ ${n(dw)} = ${n(msw)}. F = ${n(msb)} ÷ ${n(msw)} = ${to2(F)}. The critical value F(${n(db)}, ${n(dw)}) is ${n(crit)}. ${dec ? `${n(F2)} is larger, so reject the claim that the means are all equal: enter 1.` : `${n(F2)} is not larger, so do not reject the claim that the means are all equal: enter 0.`}`,
  guidance: [
   { prompt: `What is the grand mean of the ${n(k)} group means, and what is the sum of squares between groups, ${n(m)} × Σ(group mean − grand mean)²?`, answer: [g, ssb], explanation: `The grand mean is ${n(sum(means))} ÷ ${n(k)} = ${n(g)}. The squared distances are ${list(parts)}, which add to ${n(sum(parts))}, and ${n(m)} × ${n(sum(parts))} = ${n(ssb)}.` },
   { prompt: `Divide each sum of squares by its degrees of freedom (${n(db)} between, ${n(dw)} within). What are the mean square between, the mean square within, and F to 2 decimal places?`, answer: [msb, msw, F2], explanation: `${n(ssb)} ÷ ${n(db)} = ${n(msb)} and ${n(ssw)} ÷ ${n(dw)} = ${n(msw)}. F = ${n(msb)} ÷ ${n(msw)} = ${to2(F)}.` },
   { prompt: `The critical value for ${n(db)} and ${n(dw)} degrees of freedom is ${n(crit)}. Enter 1 to reject the claim that all the means are equal, 0 not to.`, answer: [dec], explanation: dec ? `${n(F2)} is larger than ${n(crit)}, so reject.` : `${n(F2)} is not larger than ${n(crit)}, so do not reject.` }
  ] }; }
});

/* q36d: challenge, uses q35. Three groups of m (4 to 6) raw readings; every group mean and the grand mean are whole, and
   each group's readings sit within 6 of its mean. F is never on a rounding tie and never within 0.1 of the critical value. */
const anova3 = G3 => { const m = G3[0].length, means = G3.map(a => sum(a) / m), grand = sum(means) / 3, parts = means.map(x => m * (x - grand) * (x - grand)), ssb = sum(parts),
 within = G3.map((a, j) => a.map(x => (x - means[j]) * (x - means[j]))), ssw = sum(within.flat()); return { m, means, grand, parts, ssb, within, ssw, dw: 3 * (m - 1) }; };
mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'Three schedules from raw plots',
 brief: 'Three irrigation schedules were trialled, and the council wants the whole verdict worked from the raw plot yields.',
 labels: ['SS between groups', 'SS within groups', 'F ratio', '1 reject, 0 not'], tolerance: 0.005,
 gl: [['mean of A', 'mean of B', 'mean of C', 'grand mean'], ['SS between groups', 'SS within groups'], ['F ratio', '1 reject, 0 not']]
}, {
 canonical: { g: [[22, 25, 19, 26, 23], [30, 27, 32, 29, 32], [25, 22, 27, 26, 25]] },
 draw: R => { let G3; for (;;) { const m = R.int(4, 6), gr = R.int(15, 60); let d = [R.int(-5, 5), R.int(-5, 5)]; d.push(-sum(d)); if (d.every(v => v === 0) || d.some(v => Math.abs(v) > 6)) continue;
  G3 = []; let bad = false; for (const dj of d) { const off = []; for (let i = 0; i < m - 1; i++) off.push(R.int(-4, 4)); off.push(-sum(off)); if (Math.abs(off[m - 1]) > 6) { bad = true; break; } G3.push(off.map(o => gr + dj + o)); }
  if (bad) continue; const A = anova3(G3), F = A.ssb / 2 / (A.ssw / A.dw); if (A.ssw === 0 || tie2(F) || F < 0.5 || F > 12 || Math.abs(r2(F) - FCRIT[2][A.dw]) < 0.1) continue; return { g: G3 }; } },
 build: ({ g }) => { const A = anova3(g), names = ['A', 'B', 'C'], N = 3 * A.m, F = A.ssb / 2 / (A.ssw / A.dw), F2 = r2(F), crit = FCRIT[2][A.dw], dec = F2 > crit ? 1 : 0, msb = A.ssb / 2, msw = A.ssw / A.dw; return {
  prompt: `The council trialled three irrigation schedules on ${n(N)} plots, ${n(A.m)} plots for each. The yields, in kilograms per plot, were: ${g.map((a, j) => `schedule ${names[j]}: ${list(a)}`).join('; ')}. Critical values of F with 5% of the area to their right, written F(df between, df within): ${fTable(A.dw, 1, [2, 3])}. Enter the sum of squares between groups, then the sum of squares within groups (both come out as whole numbers), then the F ratio to 2 decimal places, then 1 if the claim that all three schedules have the same mean yield should be rejected at the 5% level, or 0 if not.`,
  answer: [A.ssb, A.ssw, F2, dec],
  hints: ['Find each group’s mean and then the grand mean of all the readings. The sum of squares between groups is the group size times the sum of (group mean − grand mean)².', 'The sum of squares within groups adds the squared distance of every reading from its own group’s mean. Divide each sum of squares by its df (groups − 1 between, readings − groups within) to get the mean squares, and F is the first over the second. Reject when F beats the critical value.'],
  solution: `The group means are ${list(A.means)}, and the grand mean is ${n(sum(A.means))} ÷ 3 = ${n(A.grand)}. Between groups: ${A.means.map((x, i) => `${n(A.m)} × (${n(x)} − ${n(A.grand)})² = ${n(A.parts[i])}`).join(', ')}, which add to ${n(A.ssb)}. Within groups: ${A.within.map((w, j) => `${names[j]}: ${w.map(n).join(' + ')}`).join('; ')}, together ${n(A.ssw)}. df between = 2 and df within = ${n(N)} − 3 = ${n(A.dw)}, so the mean squares are ${n(A.ssb)} ÷ 2 = ${n(msb)} and ${n(A.ssw)} ÷ ${n(A.dw)} = ${ap(msw)}. F = ${ap(msb)} ÷ ${ap(msw)} = ${to2(F)}. The critical value F(2, ${n(A.dw)}) is ${n(crit)}. ${dec ? `${n(F2)} is larger, so reject: the schedules do not all give the same mean yield. Enter 1.` : `${n(F2)} is not larger, so do not reject: the differences could be chance. Enter 0.`}`,
  guidance: [
   { prompt: 'What are the means of schedules A, B and C, and the grand mean of all the yields?', answer: [...A.means, A.grand], explanation: `${g.map((a, j) => `${names[j]}: ${n(sum(a))} ÷ ${n(A.m)} = ${n(A.means[j])}`).join('; ')}. The three means add to ${n(sum(A.means))}, and ${n(sum(A.means))} ÷ 3 = ${n(A.grand)} is the grand mean.` },
   { prompt: 'For each group, multiply its size by (group mean − grand mean)², and add: that is the sum of squares between groups. Then square each yield’s distance from its own group’s mean and add them all: the sum of squares within groups. What are the two sums?', answer: [A.ssb, A.ssw], explanation: `Between: ${list(A.parts)} add to ${n(A.ssb)}. Within: ${A.within.map((w, j) => `${names[j]}: ${w.map(n).join(' + ')}`).join('; ')}, together ${n(A.ssw)}.` },
   { prompt: `Divide by df (2 between, ${n(A.dw)} within) to get the mean squares. The critical value F(2, ${n(A.dw)}) is ${n(crit)}. What is F to 2 decimal places, and is it a reject (1) or not (0)?`, answer: [F2, dec], explanation: `${n(A.ssb)} ÷ 2 = ${n(msb)} and ${n(A.ssw)} ÷ ${n(A.dw)} = ${ap(msw)}, so F = ${to2(F)}. ${dec ? `${n(F2)} is larger than ${n(crit)}: reject.` : `${n(F2)} is not larger than ${n(crit)}: do not reject.`}` }
  ] }; }
});

/* ---- q37 Testing a single variance [11.6] ---- */

/* q37b: new setting. Right-tailed (more spread, valves in kPa) or left-tailed (less spread, fill times in min). n 8 to 19;
   three table rows start at df − off. χ² is never on a rounding tie and never within 0.3 of the critical value. s and σ have
   one decimal; s is 1.05 to 1.7 times σ (right tail) or 0.45 to 0.95 times σ (left tail). */
const V_B = {
 R: { unit: 'kPa', who: 'The valve supplier says the pressure at which its safety valves open has a standard deviation of', worry: 'The council suspects the pressure varies more than that.', what: 'valves', word: '“Varies more” makes the test right-tailed' },
 L: { unit: 'min', who: 'The old pump’s fill times for one tank had a standard deviation of', worry: 'The council wants to know whether the new pump is more consistent, with less spread.', what: 'fills by the new pump', word: '“Less spread” makes the test left-tailed' }
};
mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'The safety valve spread',
 brief: 'A supplier of safety valves is believed to be less steady than promised, and the council wants the spread tested, not the average.',
 labels: ['df', 'χ²', '1 reject, 0 not'], tolerance: 0.0005,
 gl: [['df'], ['χ²'], ['table value', '1 reject, 0 not']]
}, {
 canonical: { tail: 'R', n: 13, s10: 41, sig10: 30, off: 1 },
 draw: R => { let p; for (;;) { const tail = R.bool() ? 'R' : 'L', k = R.int(8, 19), sig10 = R.int(15, 60), s10 = Math.max(5, Math.round(sig10 * (tail === 'R' ? R.int(105, 170) : R.int(45, 95)) / 100)); if (s10 === sig10) continue;
  p = { tail, n: k, s10, sig10, off: R.int(0, 2) }; const x = (k - 1) * s10 * s10 / (sig10 * sig10), crit = tail === 'R' ? CHIR[k - 1] : CHIL[k - 1];
  if (tie2(x) || Math.abs(x - crit) < 0.3) continue; return p; } },
 build: ({ tail, n: N, s10, sig10, off }) => { const C = V_B[tail], s = s10 / 10, sg = sig10 / 10, df = N - 1, s2 = s10 * s10 / 100, g2 = sig10 * sig10 / 100, top = df * s2, x = df * s10 * s10 / (sig10 * sig10), x2 = r2(x),
  crit = tail === 'R' ? CHIR[df] : CHIL[df], dec = tail === 'R' ? (x2 > crit ? 1 : 0) : (x2 < crit ? 1 : 0); return {
  prompt: `${C.who} σ = ${n(sg)} ${C.unit}. ${C.worry} A random sample of ${n(N)} ${C.what} has sample standard deviation s = ${n(s)} ${C.unit}; assume the population is normal. Test at the 5% level. Chi-square table, the value with 5% of the area to its left and the value with 5% to its right: ${chiRows(df, off, true)}. Enter the degrees of freedom, then the test statistic χ² to 2 decimal places, then 1 to reject H₀: σ = ${n(sg)} ${C.unit}, or 0 not to.`,
  answer: [df, x2, dec],
  hints: ['The degrees of freedom are n − 1. The statistic compares the sample variance with the claimed variance: χ² = (n − 1)s² ÷ σ².', 'A test for more spread is right-tailed: reject when χ² is above the value with 5% to its right. A test for less spread is left-tailed: reject when χ² is below the value with 5% to its left.'],
  solution: `df = ${n(N)} − 1 = ${n(df)}. χ² = ${n(df)} × ${n(s)}² ÷ ${n(sg)}² = ${n(df)} × ${n(s2)} ÷ ${n(g2)} = ${n(top)} ÷ ${n(g2)} = ${to2(x)}. ${C.word}, and the table value for df ${n(df)} is ${n(crit)}. ${dec ? `${n(x2)} is ${tail === 'R' ? 'above' : 'below'} it, so reject H₀: enter 1. The spread really is ${tail === 'R' ? 'larger' : 'smaller'} than σ = ${n(sg)} ${C.unit}.` : `${n(x2)} is not ${tail === 'R' ? 'above' : 'below'} it, so do not reject H₀: enter 0. The sample’s spread is within what chance easily explains.`}`,
  guidance: [
   { prompt: 'How many degrees of freedom does the test have?', answer: [df], explanation: `df = n − 1 = ${n(N)} − 1 = ${n(df)}.` },
   { prompt: 'What is χ² = (n − 1)s² ÷ σ², to 2 decimal places?', answer: [x2], explanation: `${n(s)}² = ${n(s2)} and ${n(sg)}² = ${n(g2)}, so χ² = ${n(df)} × ${n(s2)} ÷ ${n(g2)} = ${to2(x)}.` },
   { prompt: 'Which table value fits the tail of this test? Enter that value, then 1 to reject H₀ or 0 not to.', answer: [crit, dec], explanation: `${C.word}, so the value is ${n(crit)}. ${dec ? `χ² = ${n(x2)} is beyond it: reject.` : `χ² = ${n(x2)} is not beyond it: do not reject.`}` }
  ] }; }
});

/* q37c: applied. n 6 to 9 readings with a whole mean (so Σ(x − x̄)² is a whole number and equals (n − 1)s²). σ has one decimal;
   the sample s is 1.05 to 1.7 times σ (right tail) or 0.45 to 0.95 times σ (left tail). χ² never on a tie, never within 0.3
   of the critical value. */
const V_C = {
 R: { unit: 'kg', intro: (xs, N, sg) => `A packing crew weighed ${n(N)} sacks of seed picked at random from a delivery, in kilograms: ${list(xs)}. The supplier’s label says the weights of its sacks have a standard deviation of σ = ${n(sg)} kg. The council suspects the sacks vary more than that.`, word: '“Vary more” makes the test right-tailed' },
 L: { unit: '°C', intro: (xs, N, sg) => `The council’s old gauge read the temperature of a tank with a standard deviation of σ = ${n(sg)} °C. A new gauge is read ${n(N)} times on the same tank, giving, in °C: ${list(xs)}. The council wants to know whether the new gauge reads with less spread.`, word: '“Less spread” makes the test left-tailed' }
};
const dataC = (R, N, lo, hi, spreadMax) => { for (;;) { const base = R.int(lo, hi), off = []; for (let i = 0; i < N - 1; i++) off.push(R.int(-spreadMax, spreadMax)); off.push(-sum(off)); if (Math.abs(off[N - 1]) > spreadMax + 2) continue; return off.map(o => base + o); } };
const meanSS = xs => { const N = xs.length, mean = sum(xs) / N, SS = sum(xs.map(x => (x - mean) * (x - mean))); return { N, mean, SS, dev: xs.map(x => x - mean) }; };
mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Sacks that should not vary',
 brief: 'A delivery of seed sacks has been weighed one by one, and the council wants to know whether their spread breaks the supplier’s promise.',
 labels: ['sum of squared deviations', 'χ²', '1 reject, 0 not'], tolerance: 0.0005,
 gl: [['x̄', 'sum of squared deviations'], ['df', 'χ²'], ['table value', '1 reject, 0 not']]
}, {
 canonical: { tail: 'R', x: [52, 47, 55, 49, 58, 51, 52], sig10: 28, off: 1 },
 draw: R => { let p; for (;;) { const tail = R.bool() ? 'R' : 'L', N = R.int(6, 9), x = dataC(R, N, 30, 90, 7), M = meanSS(x), s = Math.sqrt(M.SS / (N - 1)), sig10 = Math.round(s * 10 / (tail === 'R' ? R.int(60, 95) : R.int(105, 180)) * 100);
  if (sig10 < 10 || M.SS === 0) continue; const xx = M.SS * 100 / (sig10 * sig10), crit = tail === 'R' ? CHIR[N - 1] : CHIL[N - 1]; if (tie2(xx) || Math.abs(xx - crit) < 0.3) continue; return { tail, x, sig10, off: R.int(0, 2) }; } },
 build: ({ tail, x, sig10, off }) => { const C = V_C[tail], M = meanSS(x), N = M.N, df = N - 1, sg = sig10 / 10, g2 = sig10 * sig10 / 100, xx = M.SS / g2, x2 = r2(xx), crit = tail === 'R' ? CHIR[df] : CHIL[df], dec = tail === 'R' ? (x2 > crit ? 1 : 0) : (x2 < crit ? 1 : 0); return {
  prompt: `${C.intro(x, N, sg)} Treat the readings as a random sample from a normal population. Test at the 5% level. Chi-square table, the value with 5% of the area to its left and the value with 5% to its right: ${chiRows(df, off, true)}. Enter the sum of the squared deviations Σ(x − x̄)², then the test statistic χ² to 2 decimal places, then 1 to reject H₀: σ = ${n(sg)} ${C.unit}, or 0 not to.`,
  answer: [M.SS, x2, dec],
  hints: ['Find the mean, subtract it from each reading, square the results and add them. That sum is Σ(x − x̄)², and it equals (n − 1)s².', 'So χ² = (n − 1)s² ÷ σ² is that sum divided by σ². The degrees of freedom are n − 1. More spread is a right-tailed test and less spread is a left-tailed test: compare χ² with the matching table value.'],
  solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(M.mean)}. The deviations are ${list(M.dev)}, their squares are ${list(M.dev.map(d => d * d))}, and they add to ${n(M.SS)}. This equals (n − 1)s², so χ² = ${n(M.SS)} ÷ ${n(sg)}² = ${n(M.SS)} ÷ ${n(g2)} = ${to2(xx)}, with df = ${n(N)} − 1 = ${n(df)}. ${C.word}, and the table value for df ${n(df)} is ${n(crit)}. ${dec ? `${n(x2)} is ${tail === 'R' ? 'above' : 'below'} it, so reject H₀: enter 1.` : `${n(x2)} is not ${tail === 'R' ? 'above' : 'below'} it, so do not reject H₀: enter 0.`}`,
  guidance: [
   { prompt: `What is the mean x̄ of the ${n(N)} readings, and what is the sum of the squared deviations Σ(x − x̄)²?`, answer: [M.mean, M.SS], explanation: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(M.mean)}. The deviations ${list(M.dev)} squared are ${list(M.dev.map(d => d * d))}, and they add to ${n(M.SS)}.` },
   { prompt: `The degrees of freedom are n − 1. Since Σ(x − x̄)² = (n − 1)s², χ² = Σ(x − x̄)² ÷ σ². What are the df and χ² to 2 decimal places?`, answer: [df, x2], explanation: `df = ${n(N)} − 1 = ${n(df)}, and χ² = ${n(M.SS)} ÷ ${n(sg)}² = ${n(M.SS)} ÷ ${n(g2)} = ${to2(xx)}.` },
   { prompt: 'Which table value fits the tail of this test? Enter that value, then 1 to reject H₀ or 0 not to.', answer: [crit, dec], explanation: `${C.word}, so the value is ${n(crit)}. ${dec ? `χ² = ${n(x2)} is beyond it: reject.` : `χ² = ${n(x2)} is not beyond it: do not reject.`}` }
  ] }; }
});

/* q37d: challenge, uses q07. n 9 to 14 readings with a whole mean, and a claimed variance σ² with one decimal. s² is printed
   to 2 decimals but χ² comes from the exact sum, so a draw where χ² worked from the rounded s² would differ is left out. */
const V_D = {
 R: { unit: 'kPa', intro: (xs, N, v) => `The gauge maker states that the variance of the pressure readings from its gauges is σ² = ${n(v)} kPa². The council suspects the variance is larger. It takes ${n(N)} readings at random, in kPa: ${list(xs)}.`, word: '“Larger variance” makes the test right-tailed' },
 L: { unit: 'g', intro: (xs, N, v) => `The old sieve left the weights of grain batches with a variance of σ² = ${n(v)} g². A new sieve should make the batches more uniform, so the council wants to know whether the variance is smaller. It weighs ${n(N)} batches at random, in grams: ${list(xs)}.`, word: '“Smaller variance” makes the test left-tailed' }
};
mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q07', title: 'A claim made as a variance',
 brief: 'This time the supplier’s promise is written as a variance, and the sample comes as raw readings.',
 labels: ['df', 's²', 'χ²', '1 reject, 0 not'], tolerance: 0.0005,
 gl: [['x̄', 'sum of squared deviations'], ['df', 's²'], ['χ²'], ['table value', '1 reject, 0 not']]
}, {
 canonical: { tail: 'L', x: [118, 121, 116, 124, 119, 115, 122, 120, 117, 128], v10: 128, off: 0 },
 draw: R => { for (;;) { const tail = R.bool() ? 'R' : 'L', N = R.int(9, 14), x = dataC(R, N, 80, 200, 9), M = meanSS(x); if (M.SS === 0) continue; const s2 = M.SS / (N - 1), v10 = Math.round(s2 * 10 / (tail === 'R' ? R.int(60, 95) : R.int(105, 180)) * 100);
  if (v10 < 10) continue; const xx = M.SS * 10 / v10, crit = tail === 'R' ? CHIR[N - 1] : CHIL[N - 1]; if (tie2(xx) || tie2(s2) || Math.abs(xx - crit) < 0.3 || r2((N - 1) * r2(s2) * 10 / v10) !== r2(xx)) continue; return { tail, x, v10, off: R.int(0, 2) }; } },
 build: ({ tail, x, v10, off }) => { const C = V_D[tail], M = meanSS(x), N = M.N, df = N - 1, v = v10 / 10, s2 = M.SS / df, xx = M.SS / v, x2 = r2(xx), crit = tail === 'R' ? CHIR[df] : CHIL[df], dec = tail === 'R' ? (x2 > crit ? 1 : 0) : (x2 < crit ? 1 : 0); return {
  prompt: `${C.intro(x, N, v)} Treat them as a random sample from a normal population. Test at the 5% level. Chi-square table, the value with 5% of the area to its left and the value with 5% to its right: ${chiRows(df, off, true)}. Enter the degrees of freedom, then the sample variance s² to 2 decimal places, then the test statistic χ² to 2 decimal places (worked from the exact s², not the rounded one), then 1 to reject H₀: σ² = ${n(v)}, or 0 not to.`,
  answer: [df, r2(s2), x2, dec],
  hints: ['Find the mean, then add the squared deviations. The sample variance is that sum divided by n − 1, and the degrees of freedom are n − 1.', 'The claim is already a variance, so do not square it again: χ² = (n − 1)s² ÷ σ², and (n − 1)s² is the sum of squared deviations. Choose the table value by the tail: larger variance is right-tailed, smaller is left-tailed.'],
  solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(M.mean)}. The deviations are ${list(M.dev)}, their squares are ${list(M.dev.map(d => d * d))}, and they add to ${n(M.SS)}. df = ${n(N)} − 1 = ${n(df)}, so s² = ${n(M.SS)} ÷ ${n(df)} = ${to2(s2)}. The statistic is χ² = ${n(df)} × s² ÷ σ² = ${n(M.SS)} ÷ ${n(v)} = ${to2(xx)}. ${C.word}, and the table value for df ${n(df)} is ${n(crit)}. ${dec ? `${n(x2)} is ${tail === 'R' ? 'above' : 'below'} it, so reject H₀: enter 1.` : `${n(x2)} is not ${tail === 'R' ? 'above' : 'below'} it, so do not reject H₀: enter 0.`}`,
  guidance: [
   { prompt: `What is the mean x̄ of the ${n(N)} readings, and the sum of the squared deviations Σ(x − x̄)²?`, answer: [M.mean, M.SS], explanation: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(M.mean)}. The deviations ${list(M.dev)} squared are ${list(M.dev.map(d => d * d))}, and they add to ${n(M.SS)}.` },
   { prompt: 'What are the degrees of freedom, and the sample variance s² to 2 decimal places?', answer: [df, r2(s2)], explanation: `df = ${n(N)} − 1 = ${n(df)}, and s² = ${n(M.SS)} ÷ ${n(df)} = ${to2(s2)}.` },
   { prompt: `What is χ² = (n − 1)s² ÷ σ² for the claimed variance ${n(v)}, to 2 decimal places?`, answer: [x2], explanation: `(n − 1)s² is the sum ${n(M.SS)}, so χ² = ${n(M.SS)} ÷ ${n(v)} = ${to2(xx)}.` },
   { prompt: 'Which table value fits the tail of this test? Enter that value, then 1 to reject H₀ or 0 not to.', answer: [crit, dec], explanation: `${C.word}, so the value is ${n(crit)}. ${dec ? `χ² = ${n(x2)} is beyond it: reject.` : `χ² = ${n(x2)} is not beyond it: do not reject.`}` }
  ] }; }
});

/* ---- q38 Intervals and tests agree [9.4, 8.1] ---- */

const ALPHA = { 90: '0.10', 95: '0.05', 99: '0.01' };
/* Three claims in tenths, each inside or outside an interval (bounds in hundredths) at random, at least 0.1 from a bound. */
const claims3 = (R, lo, hi) => { const m10 = []; while (m10.length < 3) { let v; const r = R.int(0, 2);
 if (r === 0) v = R.int(Math.ceil((lo + 10) / 10), Math.floor((hi - 10) / 10)); else if (r === 1) v = Math.floor((lo - 10) / 10) - R.int(0, 30); else v = Math.ceil((hi + 10) / 10) + R.int(0, 30);
 if (!m10.includes(v)) m10.push(v); } return m10; };
const verdict = (v, L, U) => v < L || v > U ? 1 : 0;
const say38 = (v, d, L, U) => d ? `${n(v)} lies ${v < L ? `below ${n(L)}` : `above ${n(U)}`}, outside the interval: reject (1).` : `${n(v)} lies inside the interval: do not reject (0).`;

/* q38b: new setting. The interval is printed as its two ends (tenths for x̄, hundredths for the margin, so both ends have two
   decimals); x̄ is the middle and the margin is half the width. Not the worked example (90%, 11.6 to 13.2). */
mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'Three suppliers, one battery interval',
 brief: 'The lab has published one interval for the mean life of a new battery, and three suppliers have each named a different life.',
 labels: ['sample mean', 'margin of error', 'claim 1: 1 reject, 0 not', 'claim 2: 1 reject, 0 not', 'claim 3: 1 reject, 0 not'], tolerance: 0.005,
 gl: [['sample mean', 'margin of error'], ['claim 1', 'claim 2', 'claim 3']]
}, {
 canonical: { lvl: 99, xb10: 724, e100: 190, m10: [680, 731, 760] },
 draw: R => { for (;;) { const lvl = R.pick([90, 95, 99]), xb10 = R.int(200, 900), e100 = R.int(100, 600), lo = xb10 * 10 - e100, hi = xb10 * 10 + e100; if (lvl === 90 && xb10 === 124 && e100 === 80) continue; return { lvl, xb10, e100, m10: claims3(R, lo, hi) }; } },
 build: ({ lvl, xb10, e100, m10 }) => { const xb = xb10 / 10, E = e100 / 100, L = (xb10 * 10 - e100) / 100, U = (xb10 * 10 + e100) / 100, m = m10.map(v => v / 10), d = m.map(v => verdict(v, L, U)), al = ALPHA[lvl]; return {
  prompt: `A test lab publishes a ${n(lvl)}% confidence interval for the mean life of a new battery: from ${n(L)} to ${n(U)} hours, with σ known. Three suppliers state mean lives of ${n(m[0])}, ${n(m[1])} and ${n(m[2])} hours. Enter the sample mean x̄ at the middle of the interval, then the margin of error, then, for each stated life in that order, 1 if a two-tailed test at α = ${al} rejects it or 0 if not.`,
  answer: [xb, E, ...d],
  hints: ['The sample mean is exactly halfway between the two ends of the interval, and the margin of error is half the distance from one end to the other.', 'A two-tailed test at α = 1 − (confidence level) rejects a stated mean exactly when it lies outside the interval.'],
  solution: `The middle of the interval is (${n(L)} + ${n(U)}) ÷ 2 = ${n(xb)}, and the margin of error is (${n(U)} − ${n(L)}) ÷ 2 = ${n(E)}. A two-tailed test at α = ${al} matches the ${n(lvl)}% interval. ${m.map((v, i) => say38(v, d[i], L, U)).join(' ')}`,
  guidance: [
   { prompt: `What is the sample mean at the middle of the interval from ${n(L)} to ${n(U)}, and what is the margin of error?`, answer: [xb, E], explanation: `(${n(L)} + ${n(U)}) ÷ 2 = ${n(xb)}, and (${n(U)} − ${n(L)}) ÷ 2 = ${n(E)}.` },
   { prompt: `For each stated life, ${n(m[0])}, ${n(m[1])} and ${n(m[2])} in that order, enter 1 if it lies outside the interval from ${n(L)} to ${n(U)} (reject) or 0 if it lies inside.`, answer: d, explanation: m.map((v, i) => say38(v, d[i], L, U)).join(' ') }
  ] }; }
});

/* q38c: applied. σ known, so the margin is z* × σ ÷ √n, with z* printed: 1.645 (90%), 1.96 (95%), 2.576 (99%). The pairs are
   chosen so the margin has at most 2 decimals. Each claim is inside or outside at random, at least 0.1 from a bound. */
const ZSTAR = { 90: 1.645, 95: 1.96, 99: 2.576 };
const SE_PAIRS = {
 90: [[10, 25], [8, 16], [12, 36], [6, 9], [20, 25], [16, 16], [24, 36], [30, 25]],
 95: [[5, 25], [4, 16], [6, 36], [10, 100], [10, 25], [8, 16], [12, 36], [10, 16], [15, 36], [20, 25], [24, 36], [25, 25]],
 99: [[10, 16], [15, 36], [5, 4], [20, 64], [20, 16], [25, 25], [30, 36], [5, 16]]
};
mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'Cable strength and the three claims',
 brief: 'A sample of cables has been pulled to breaking point, and three suppliers each name a different mean strength.',
 labels: ['margin of error', 'lower bound', 'upper bound', 'claim 1: 1 reject, 0 not', 'claim 2: 1 reject, 0 not', 'claim 3: 1 reject, 0 not'], tolerance: 0.005,
 gl: [['standard error', 'margin of error'], ['lower bound', 'upper bound'], ['claim 1', 'claim 2', 'claim 3']]
}, {
 canonical: { lvl: 95, sg: 12, k: 36, xb10: 612, m10: [580, 610, 641] },
 draw: R => { for (;;) { const lvl = R.pick([90, 95, 99]), [sg, k] = R.pick(SE_PAIRS[lvl]), xb10 = R.int(300, 900), E100 = Math.round(ZSTAR[lvl] * sg / Math.sqrt(k) * 100);
  if (lvl === 95 && sg === 12 && k === 36 && xb10 === 612) continue; return { lvl, sg, k, xb10, m10: claims3(R, xb10 * 10 - E100, xb10 * 10 + E100) }; } },
 build: ({ lvl, sg, k, xb10, m10 }) => { const xb = xb10 / 10, z = ZSTAR[lvl], se = sg / Math.sqrt(k), root = Math.sqrt(k), E100 = Math.round(z * se * 100), E = E100 / 100, L = (xb10 * 10 - E100) / 100, U = (xb10 * 10 + E100) / 100, m = m10.map(v => v / 10), d = m.map(v => verdict(v, L, U)), al = ALPHA[lvl]; return {
  prompt: `An engineer pulls ${n(k)} cables of one design to breaking point and finds a sample mean strength of x̄ = ${n(xb)} kilonewtons (kN). The population standard deviation is known: σ = ${n(sg)} kN. A ${n(lvl)}% confidence interval has margin of error z* × σ ÷ √n, where z* = ${n(z)} for this level. Three suppliers claim mean strengths of ${n(m[0])}, ${n(m[1])} and ${n(m[2])} kN. Enter the margin of error, then the lower and upper bounds of the interval (all three come out exact to 2 decimal places), then, for each claim in that order, 1 if a two-tailed test at α = ${al} rejects it or 0 if not.`,
  answer: [E, L, U, ...d],
  hints: ['First find the standard error σ ÷ √n, then multiply it by z* to get the margin of error. The interval runs from x̄ minus the margin to x̄ plus the margin.', 'A two-tailed test at α = 1 − (confidence level) rejects a claimed mean exactly when the claim lies outside the interval.'],
  solution: `The standard error is ${n(sg)} ÷ √${n(k)} = ${n(sg)} ÷ ${n(root)} = ${n(se)}, so the margin of error is ${n(z)} × ${n(se)} = ${n(E)}. The interval runs from ${n(xb)} − ${n(E)} = ${n(L)} to ${n(xb)} + ${n(E)} = ${n(U)}. A two-tailed test at α = ${al} matches the ${n(lvl)}% interval. ${m.map((v, i) => say38(v, d[i], L, U)).join(' ')}`,
  guidance: [
   { prompt: `What are the standard error σ ÷ √n and the margin of error z* × (standard error), with z* = ${n(z)}?`, answer: [se, E], explanation: `${n(sg)} ÷ √${n(k)} = ${n(sg)} ÷ ${n(root)} = ${n(se)}, and ${n(z)} × ${n(se)} = ${n(E)}.` },
   { prompt: 'What are the lower and upper bounds of the interval?', answer: [L, U], explanation: `${n(xb)} − ${n(E)} = ${n(L)} and ${n(xb)} + ${n(E)} = ${n(U)}.` },
   { prompt: `For each claim, ${n(m[0])}, ${n(m[1])} and ${n(m[2])} in that order, enter 1 if it lies outside the interval (reject) or 0 if it lies inside.`, answer: d, explanation: m.map((v, i) => say38(v, d[i], L, U)).join(' ') }
  ] }; }
});

/* q38d: challenge, uses q13. One claim, one sample, and all three levels. σ ÷ √n has at most 1 decimal, so each margin
   z* × se is rounded to 2 decimals once. The distance |x̄ − μ₀| (one decimal) is at least 0.05 from each unrounded margin,
   and no margin is on a rounding tie. */
const SE38 = [[6, 16], [9, 36], [12, 16], [15, 25], [10, 25], [8, 16], [7, 49], [5, 25], [20, 16], [10, 16], [15, 36], [9, 9], [14, 49], [24, 16]];
mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q13', title: 'One claim at three confidence levels',
 brief: 'A mill’s flour bags are weighed once, and the council wants to know how firmly the data speak against the label at three different levels of doubt.',
 labels: ['margin at 90%', 'margin at 95%', 'margin at 99%', '90%: 1 reject, 0 not', '95%: 1 reject, 0 not', '99%: 1 reject, 0 not'], tolerance: 0.005,
 gl: [['|x̄ − μ₀|', 'standard error'], ['margin at 90%', 'margin at 95%', 'margin at 99%'], ['90%', '95%', '99%']]
}, {
 canonical: { sg: 12, k: 16, mu: 500, d10: 70 },
 draw: R => { for (;;) { const [sg, k] = R.pick(SE38), se = sg / Math.sqrt(k), d10 = R.int(Math.max(2, Math.ceil(8 * se)), Math.floor(32 * se)), mu = R.int(250, 750);
  const Es = [90, 95, 99].map(l => ZSTAR[l] * se); if (Es.some(e => Math.abs(d10 / 10 - e) < 0.05 || tie2(e))) continue; if (sg === 12 && k === 16 && mu === 500 && d10 === 70) continue; return { sg, k, mu, d10: R.bool() ? d10 : -d10 }; } },
 build: ({ sg, k, mu, d10 }) => { const xb = mu + d10 / 10, dist = Math.abs(d10) / 10, se = sg / Math.sqrt(k), root = Math.sqrt(k), Es = [90, 95, 99].map(l => ZSTAR[l] * se), E2 = Es.map(r2), dec = Es.map(e => dist > e ? 1 : 0), als = [90, 95, 99].map(l => ALPHA[l]); return {
  prompt: `A flour mill’s label says its bags hold a mean of ${n(mu)} grams. The council weighs ${n(k)} bags and finds a sample mean x̄ = ${n(xb)} grams, and the population standard deviation is known: σ = ${n(sg)} grams. For each of a 90%, a 95% and a 99% confidence interval, the margin of error is z* × σ ÷ √n, with z* = 1.645, 1.96 and 2.576 in that order. Enter the three margins of error, each to 2 decimal places, then, for each level in that order, 1 if a two-tailed test of the label’s claim at α = 0.10, 0.05 and 0.01 respectively rejects it, or 0 if not.`,
  answer: [...E2, ...dec],
  hints: ['The standard error is σ ÷ √n. Multiply it by each z* in turn to get the three margins of error.', 'A two-tailed test at α = 1 − (confidence level) rejects the claim exactly when the claimed mean lies outside that interval, that is, when the distance between x̄ and the claimed mean is larger than the margin of error.'],
  solution: `The distance from the claim is |${n(xb)} − ${n(mu)}| = ${n(dist)} and the standard error is ${n(sg)} ÷ √${n(k)} = ${n(sg)} ÷ ${n(root)} = ${n(se)}. The margins of error are 1.645 × ${n(se)} ${E2[0] === Es[0] ? '=' : '≈'} ${n(E2[0])}, 1.96 × ${n(se)} ${E2[1] === Es[1] ? '=' : '≈'} ${n(E2[1])} and 2.576 × ${n(se)} ${E2[2] === Es[2] ? '=' : '≈'} ${n(E2[2])}. The claim is rejected when the distance ${n(dist)} is larger than the margin: ${dec.map((v, i) => `at ${[90, 95, 99][i]}% (α = ${als[i]}), ${n(dist)} is ${v ? 'larger' : 'not larger'} than ${n(E2[i])}, so ${v ? 'reject (1)' : 'do not reject (0)'}`).join('; ')}.`,
  guidance: [
   { prompt: 'How far is x̄ from the claimed mean (the distance, without a sign), and what is the standard error σ ÷ √n?', answer: [dist, se], explanation: `|${n(xb)} − ${n(mu)}| = ${n(dist)}, and ${n(sg)} ÷ √${n(k)} = ${n(sg)} ÷ ${n(root)} = ${n(se)}.` },
   { prompt: `Multiply the standard error ${n(se)} by 1.645, 1.96 and 2.576. What are the three margins of error, to 2 decimal places?`, answer: E2, explanation: `1.645 × ${n(se)} ${E2[0] === Es[0] ? '=' : '≈'} ${n(E2[0])}; 1.96 × ${n(se)} ${E2[1] === Es[1] ? '=' : '≈'} ${n(E2[1])}; 2.576 × ${n(se)} ${E2[2] === Es[2] ? '=' : '≈'} ${n(E2[2])}.` },
   { prompt: `The claim is rejected at a level when the distance ${n(dist)} is larger than that level’s margin of error. For the 90%, 95% and 99% levels in that order, enter 1 to reject or 0 not to.`, answer: dec, explanation: dec.map((v, i) => `${[90, 95, 99][i]}%: ${n(dist)} is ${v ? 'larger' : 'not larger'} than ${n(E2[i])}, so ${v ? 'reject (1)' : 'do not reject (0)'}`).join('; ') + '.' }
  ] }; }
});

/* ---- q39 Choosing the right test [9.5] ---- */

const TESTS = 'Tests: 1 z test for one mean (σ known); 2 t test for one mean (σ unknown); 3 z test for one proportion; 4 two-sample t test for two independent means; 5 z test for two proportions, with the pooled proportion; 6 matched-pairs t test on the differences; 7 χ² goodness-of-fit test; 8 χ² test of independence; 9 one-way ANOVA F test. A χ² test with only two categories, or on a 2 × 2 table, gives the same verdict as the z test for one or two proportions: for such data, choose the z test. ANOVA is for three or more groups.';
/* The stories, by kind (the test's number) and version v (0 = setting, 1 = applied, 2 = challenge). Never the learn mission's wording. */
const STORY = {
 1: [p => `The farm’s moisture sensor has a known population standard deviation of ${n(p.s)} units, and the engineer takes ${n(p.n)} readings from one bed to test whether the bed’s mean moisture is still ${n(p.mu)} units.`,
  p => `The depot’s old scale has a known population standard deviation of ${n(p.s)} grams. A crew weighs ${n(p.n)} sacks to test whether the mean sack weight is still ${n(p.mu)} grams.`],
 2: [p => `The engineer times ${n(p.n)} charging cycles of a new battery to test whether the mean charging time is still ${n(p.mu)} minutes. Nobody knows the population standard deviation, so the sample must supply it.`,
  p => `The kitchen weighs ${n(p.n)} loaves from a new oven and tests whether the mean loaf weight is still ${n(p.mu)} grams. The population standard deviation is not known and has to be estimated from the loaves.`],
 3: [p => `Of the ${n(p.n)} solar panels inspected, the engineer counts how many pass, and tests whether the share that pass is still ${n(p.pc)}%.`,
  p => `The council asks ${n(p.n)} settlers whether the new lighting suits them, and tests whether the share who say yes is still ${n(p.pc)}%.`],
 4: [p => `The engineer runs ${n(p.n1)} pumps with the old seals and ${n(p.n2)} other pumps with the new seals, measures each pump’s hours before a leak, and tests whether the two mean times differ. Neither population standard deviation is known, and the degrees-of-freedom formula for two independent samples gives df = ${n(p.df)}.`,
  p => `The kitchen bakes ${n(p.n1)} loaves in the old oven and ${n(p.n2)} different loaves in the new one, weighs every loaf, and tests whether the two mean weights differ. Neither population standard deviation is known, and the degrees-of-freedom formula for two independent samples gives df = ${n(p.df)}.`,
  p => `The Trial Fields grow a new pea strain on ${n(p.n1)} plots and the old strain on ${n(p.n2)} other plots, chosen at random, and test whether the two mean yields differ. Neither population standard deviation is known, and the degrees-of-freedom formula for two independent samples gives df = ${n(p.df)}.`],
 5: [p => `The depot test-fires ${n(p.n1)} flares from one supplier and ${n(p.n2)} from another, counts how many ignite from each, and tests whether the two ignition shares differ.`,
  p => `A lab seeds ${n(p.n1)} dishes with the old culture and ${n(p.n2)} with the new one, counts how many grow, and tests whether the two growth shares differ.`],
 6: [p => `The same ${n(p.n)} pumps are flow-tested before and after a new filter is fitted, and the engineer tests whether the mean change in flow is zero.`,
  p => `Each of ${n(p.n)} plants is measured on the day it is potted and again a month later, and the council tests whether the mean change in height is zero.`,
  p => `A tester times ${n(p.n)} drivers on one route, once in the old rover and once in the new, the same drivers in both, and tests whether the mean difference in time is zero.`],
 7: [p => `The depot logs which of its ${n(p.c)} delivery windows each of ${n(p.N)} deliveries arrives in, and tests whether the arrivals follow the shares the schedule planned.`,
  p => `The lab sorts ${n(p.N)} pebbles into ${n(p.c)} size grades and tests whether they fall in the shares the geologist predicted.`,
  p => `The council counts which of its ${n(p.c)} proposals each of ${n(p.N)} votes went to, and tests whether the votes follow the shares the chair claimed.`],
 8: [p => `A survey sorts ${n(p.N)} settlers by their shift (${n(p.r)} shifts) and by their favourite of ${n(p.c)} meals, and tests whether the favourite meal depends on the shift.`,
  p => `The clinic sorts ${n(p.N)} visits by day group (${n(p.r)} groups) and by the main complaint (${n(p.c)} kinds), and tests whether the complaint depends on the day group.`,
  p => `The workshop tabulates ${n(p.N)} jobs in a table with ${n(p.r)} rows for the crew that did them and ${n(p.c)} columns for the fault found, and tests whether the fault depends on the crew.`],
 9: [p => `The lab grows plants in ${n(p.k)} soils on ${n(p.N)} pots in all and tests whether the mean heights for the soils are all equal.`,
  p => `The workshop tries ${n(p.k)} lubricants on ${n(p.N)} machines in all and tests whether the mean wear is the same for every lubricant.`,
  p => `The depot tries ${n(p.k)} route plans on ${n(p.N)} trips in all and tests whether the mean trip times of the plans are all equal.`]
};
/* kind → why the test fits, and why the df. */
const INFO = (kind, p) => { switch (kind) {
 case 1: return { test: 1, df: 0, data: 1, why: 'one group of measurements is compared with a claimed mean and σ is known, so the test is 1, the z test for one mean', dfWhy: 'A z statistic has no degrees of freedom: enter 0.' };
 case 2: return { test: 2, df: p.n - 1, data: 1, why: 'one group of measurements is compared with a claimed mean and σ is not known, so the test is 2, the t test for one mean', dfWhy: `df = n − 1 = ${n(p.n)} − 1 = ${n(p.n - 1)}.` };
 case 3: return { test: 3, df: 0, data: 2, why: 'each answer is a category, counted for one group and compared with a claimed share, so the test is 3, the z test for one proportion', dfWhy: 'A z statistic has no degrees of freedom: enter 0.' };
 case 4: return { test: 4, df: p.df, data: 1, why: 'two independent groups of measurements are compared and neither σ is known, so the test is 4, the two-sample t test', dfWhy: `Its df comes from the two-sample formula, which the story gives: ${n(p.df)}.` };
 case 5: return { test: 5, df: 0, data: 2, why: 'each result is a counted category, and two independent groups are compared, so the test is 5, the z test for two proportions', dfWhy: 'A z statistic has no degrees of freedom: enter 0.' };
 case 6: return { test: 6, df: p.n - 1, data: 1, why: `the measurements come in pairs, the same ${n(p.n)} subjects measured twice, so the test is 6, the matched-pairs t test on the differences`, dfWhy: `df = pairs − 1 = ${n(p.n)} − 1 = ${n(p.n - 1)}.` };
 case 7: return { test: 7, df: p.c - 1, data: 2, why: 'the outcome is a category, counted for one variable and compared with claimed shares, so the test is 7, the χ² goodness-of-fit test', dfWhy: `df = categories − 1 = ${n(p.c)} − 1 = ${n(p.c - 1)}.` };
 case 8: return { test: 8, df: (p.r - 1) * (p.c - 1), data: 2, why: `two categorical variables are counted in one table with ${n(p.r)} rows and ${n(p.c)} columns, so the test is 8, the χ² test of independence`, dfWhy: `df = (rows − 1) × (columns − 1) = (${n(p.r)} − 1) × (${n(p.c)} − 1) = ${n((p.r - 1) * (p.c - 1))}.` };
 default: return { test: 9, df: p.k - 1, data: 1, why: `a measurement is compared across ${n(p.k)} groups at once, so the test is 9, the one-way ANOVA F test`, dfWhy: `Its df between groups is groups − 1 = ${n(p.k)} − 1 = ${n(p.k - 1)}.` };
} };
const KINDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const draw39 = (R, kind) => { switch (kind) {
 case 4: { const n1 = R.int(8, 20), n2 = R.int(8, 20); return { kind, n1, n2, df: R.int(Math.min(n1, n2) - 1, n1 + n2 - 2) }; }
 case 1: return { kind, n: R.int(10, 40), s: R.int(3, 12), mu: R.int(40, 90) };
 case 2: return { kind, n: R.int(8, 30), mu: R.int(30, 60) };
 case 3: return { kind, n: R.int(5, 30) * 10, pc: R.int(5, 18) * 5 };
 case 5: return { kind, n1: R.int(8, 30) * 5, n2: R.int(8, 30) * 5 };
 case 6: return { kind, n: R.int(6, 16) };
 case 7: return { kind, c: R.int(3, 6), N: R.int(6, 20) * 10 };
 case 8: { const r = R.int(2, 4), c = R.int(2, 4); return { kind, r, c: r === 2 && c === 2 ? 3 : c, N: R.int(10, 30) * 10 }; }
 default: { const k = R.int(3, 5); return { kind, k, N: k * R.int(4, 8) }; }
} };
const why1 = (I, text) => `${cap(I.why)}. ${I.dfWhy}`;

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'Which test for the engineer’s study',
 brief: 'The engineers keep bringing studies to the council, and each one must be matched to a test before any arithmetic is done.',
 labels: ['test number', 'df'], tolerance: 0.01,
 gl: [['1 measurement, 2 counted category'], ['test number'], ['df']]
}, {
 canonical: { kind: 9, k: 4, N: 24 },
 draw: R => draw39(R, R.pick(KINDS)),
 build: p => { const I = INFO(p.kind, p); return {
  prompt: `${STORY[p.kind][0](p)} ${TESTS} Enter the number of the right test, then its degrees of freedom. For a z test, which has none, enter 0; for the F test, enter the df between groups.`,
  answer: [I.test, I.df],
  hints: ['Ask three questions. Is the outcome a measurement or a counted category? How many groups or variables are compared? Are two sets of measurements independent, or pairs of the same subjects measured twice?', 'One group of measurements: z if σ is known, t if not (df n − 1). Two independent groups: the two-sample t test (df from its formula, given in the story). Pairs: t on the differences (df pairs − 1). Counts of one variable against claimed shares: goodness of fit (df categories − 1); two variables in a table: independence (df (rows − 1) × (columns − 1)). Three or more means: ANOVA (df between groups k − 1).'],
  solution: why1(I),
  guidance: [
   { prompt: 'Is the outcome a measurement, such as a time or a weight (enter 1), or a category that is counted (enter 2)?', answer: [I.data], explanation: I.data === 1 ? 'Each subject gives a number on a scale, so the outcome is a measurement.' : 'Each subject falls into a category, and the categories are counted.' },
   { prompt: 'Which test from the list fits this design? Enter its number.', answer: [I.test], explanation: `${cap(I.why)}.` },
   { prompt: 'What are the degrees of freedom of its statistic (0 for a z test)?', answer: [I.df], explanation: I.dfWhy }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Two studies on the clerk’s desk',
 brief: 'Two studies have been filed together, and the council needs the right test and df for each before the clerk starts work.',
 labels: ['study A test', 'study A df', 'study B test', 'study B df'], tolerance: 0.01,
 gl: [['test number', 'df'], ['test number', 'df']]
}, {
 canonical: { a: { kind: 8, r: 3, c: 4, N: 180 }, b: { kind: 1, n: 24, s: 6, mu: 55 } },
 draw: R => { const ka = R.pick(KINDS), kb = R.pick(KINDS.filter(k => k !== ka)); return { a: draw39(R, ka), b: draw39(R, kb) }; },
 build: ({ a, b }) => { const A = INFO(a.kind, a), B = INFO(b.kind, b); return {
  prompt: `The clerk’s file holds two studies. Study A: ${STORY[a.kind][1](a)} Study B: ${STORY[b.kind][1](b)} ${TESTS} For each study in order, enter the number of the right test, then its degrees of freedom (0 for a z test; for the F test, the df between groups).`,
  answer: [A.test, A.df, B.test, B.df],
  hints: ['For each study ask three questions. Is the outcome a measurement or a counted category? How many groups or variables are compared? Are two sets of measurements independent, or pairs of the same subjects measured twice?', 'One group of measurements: z if σ is known, t if not (df n − 1). Two independent groups: the two-sample t test (df from its formula, given in the story). Pairs: t on the differences (df pairs − 1). Counts of one variable against claimed shares: goodness of fit (df categories − 1); two variables in a table: independence (df (rows − 1) × (columns − 1)). Three or more means: ANOVA (df between groups k − 1).'],
  solution: `Study A: ${A.why}. ${A.dfWhy} Study B: ${B.why}. ${B.dfWhy}`,
  guidance: [
   { prompt: 'Study A: which test from the list fits, and what are its degrees of freedom (0 for a z test)?', answer: [A.test, A.df], explanation: `${cap(A.why)}. ${A.dfWhy}` },
   { prompt: 'Study B: which test from the list fits, and what are its degrees of freedom (0 for a z test)?', answer: [B.test, B.df], explanation: `${cap(B.why)}. ${B.dfWhy}` }
  ] }; }
});

/* q39d: challenge, uses q36. A paired t, χ² (goodness of fit or independence) or ANOVA story with its statistic printed. The
   statistic is 55–92% or 110–160% of the right critical value, and never within 6% of it. The critical values are printed for
   three neighbouring df (for F, three df within and both df between), so the right df has to be worked out first. */
const crit39 = p => { switch (p.kind) {
 case 4: return { df: p.df, crit: TCRIT[p.df], sym: 't' };
 case 6: return { df: p.n - 1, crit: TCRIT[p.n - 1], sym: 't' };
 case 7: return { df: p.c - 1, crit: CHIR[p.c - 1], sym: 'χ²' };
 case 8: return { df: (p.r - 1) * (p.c - 1), crit: CHIR[(p.r - 1) * (p.c - 1)], sym: 'χ²' };
 default: return { df: p.k - 1, crit: FCRIT[p.k - 1][p.N - p.k], sym: 'F' };
} };
mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q36', title: 'Choose the test, then reach the verdict',
 brief: 'Mira has the test statistics back from the clerk, and the council must name the test, find its df and read the verdict from the table.',
 labels: ['test number', 'df', '1 reject, 0 not'], tolerance: 0.0005,
 gl: [['test number'], ['df'], ['critical value', '1 reject, 0 not']]
}, {
 canonical: { kind: 7, c: 5, N: 120, f: 148, off: 1, neg: 0 },
 draw: R => { for (;;) { const kind = R.pick([4, 6, 7, 8, 9]); let p; switch (kind) {
   case 4: { const n1 = R.int(6, 10), n2 = R.int(6, 10); p = { kind, n1, n2, df: R.int(Math.min(n1, n2) - 1, Math.min(15, n1 + n2 - 2)) }; break; }
   case 6: p = { kind, n: R.int(6, 16) }; break;
   case 7: p = { kind, c: R.int(3, 7), N: R.int(8, 30) * 10 }; break;
   case 8: { const r = R.int(2, 4), c = R.int(2, 4); if (r === 2 && c === 2) continue; p = { kind, r, c, N: R.int(10, 30) * 10 }; break; }
   default: { const k = R.int(3, 4); p = { kind, k, N: k + R.int(8, 18) }; } }
  const C = crit39(p), f = R.bool() ? R.int(55, 92) : R.int(110, 160); if (Math.abs(f / 100 - 1) < 0.06) continue; if (kind === 7 && p.N === 120 && p.c === 5) continue;
  return { ...p, f, off: R.int(0, 2), neg: kind === 4 || kind === 6 ? R.int(0, 1) : 0 }; } },
 build: p => { const I = INFO(p.kind, p), C = crit39(p), stat = r2(C.crit * p.f / 100), dec = stat > C.crit ? 1 : 0, shown = (p.neg ? '−' : '') + n(stat);
  const rows = p.kind === 4 || p.kind === 6 ? 'Critical values of t for a two-tailed test at the 5% level: ' + [0, 1, 2].map(i => Math.max(4, C.df - p.off) + i).map(d => `df ${d}, ${n(TCRIT[d])}`).join('; ') + '. Compare the size of t, without its sign, with the critical value.'
   : p.kind === 9 ? `Critical values of F with 5% of the area to their right, written F(df between, df within): ${fTable(p.N - p.k, p.off, [2, 3])}.`
   : 'Critical values of χ² with 5% of the area to their right: ' + chiRows(C.df, p.off, false) + '.';
  const out = dec ? 'larger' : 'not larger'; return {
  prompt: `${STORY[p.kind][2](p)} The clerk reports the test statistic ${C.sym} = ${shown}. ${rows} ${TESTS} Enter the number of the right test, then its degrees of freedom (for the F test, the df between groups), then 1 if the statistic is beyond the critical value for the right df, or 0 if not.`,
  answer: [I.test, I.df, dec],
  hints: ['First choose the test by asking whether the outcome is a measurement or a count, how many groups or variables there are, and whether measurements are paired. Then work out its degrees of freedom from the story.', 'Read the critical value for exactly those degrees of freedom (for the F test, both df between and df within), and reject when the statistic is beyond it: for t, when its size without the sign is larger, for χ² and F, when it is larger.'],
  solution: `${cap(I.why)}. ${I.dfWhy}${p.kind === 9 ? ` Its df within groups is ${n(p.N)} − ${n(p.k)} = ${n(p.N - p.k)}.` : ''} The critical value${p.kind === 9 ? ` F(${n(C.df)}, ${n(p.N - p.k)})` : ` for df ${n(C.df)}`} is ${n(C.crit)}. The statistic ${(p.kind === 4 || p.kind === 6) && p.neg ? `${shown} has size ${n(stat)}, which is` : `${n(stat)} is`} ${out} than ${n(C.crit)}, so ${dec ? 'reject: enter 1' : 'do not reject: enter 0'}.`,
  guidance: [
   { prompt: 'Which test from the list fits this design? Enter its number.', answer: [I.test], explanation: `${cap(I.why)}.` },
   { prompt: 'What are the degrees of freedom of its statistic (for the F test, the df between groups)?', answer: [I.df], explanation: `${I.dfWhy}${p.kind === 9 ? ` (Its df within groups is ${n(p.N)} − ${n(p.k)} = ${n(p.N - p.k)}, needed for the table.)` : ''}` },
   { prompt: `Read the critical value for these degrees of freedom from the table. Enter it, then 1 if the statistic is beyond it (reject) or 0 if not.`, answer: [C.crit, dec], explanation: `The critical value is ${n(C.crit)}. The statistic ${(p.kind === 4 || p.kind === 6) && p.neg ? `has size ${n(stat)}, which is` : `${n(stat)} is`} ${out} than that, so ${dec ? 'reject (1)' : 'do not reject (0)'}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge: a full study from sample to conclusion [9.5] ---- */

const TAILS = { 1: ['less than', 'left-tailed'], 2: ['more than', 'right-tailed'], 3: ['different from', 'two-tailed'] };
/* One-sample z test with σ known; d10 is x̄ − μ₀ in tenths. z is exact to 2 decimals, so the table row is exact. */
const ztest = p => { const se = p.sigma / Math.sqrt(p.n), d = p.d10 / 10, xb = Math.round((p.mu + d) * 10) / 10, z = Math.round(d / se * 100) / 100, az = Math.abs(z), area = Phi4(az),
 tail1 = Math.round((1 - area) * 1e4) / 1e4, pv = p.tail === 3 ? Math.round(2 * tail1 * 1e4) / 1e4 : tail1, dec = pv < p.alpha ? 1 : 0; return { se, d, xb, z, az, area, tail1, pv, dec }; };
const pwork = (p, Z) => p.tail === 3 ? `the area beyond ${n(Z.az)} in one tail is 1 − ${n(Z.area)} = ${n(Z.tail1)}, and a two-tailed test doubles it: p-value = 2 × ${n(Z.tail1)} = ${n(Z.pv)}` : `the p-value is the area to the ${p.tail === 1 ? `left of ${n(Z.z)}, which by symmetry equals the area to the right of ${n(Z.az)}` : `right of ${n(Z.z)}`}: 1 − ${n(Z.area)} = ${n(Z.pv)}`;
const Z_HINTS = ['z = (x̄ − μ₀) ÷ (σ ÷ √n): how many standard errors the sample mean lies from the claimed mean.', 'The table gives the area to the left of a positive z. The area beyond it in one tail is 1 minus that area, and by symmetry the left tail beyond −z is the same size. A two-tailed p-value doubles the one-tail area. Reject when the p-value is below α.'];

/* q40b: new setting. The standard error σ ÷ √n is 0.5, 1, 2, 2.5 or 5 and x̄ − μ₀ has one decimal, so z is exact to 2 decimals.
   |z| from 0.8 to 2.9, on the side of Hₐ for a one-tailed test. Five table rows start at |z| − off × 0.01. The p-value is never
   within 0.002 of α. */
const Z_B = [
 { claim: 'The workshop manual says its pumps move a mean of', unit: 'litres per minute', of: 'pumps', stat: 'mean flow', mu: [40, 90], sig: [[4, 16], [6, 9], [10, 25], [12, 36], [5, 4], [2, 16]] },
 { claim: 'The depot’s label says its ration packs weigh, on average,', unit: 'grams', of: 'ration packs', stat: 'mean weight', mu: [400, 600], sig: [[20, 16], [30, 36], [25, 25], [10, 16], [15, 9], [40, 64]] },
 { claim: 'The seed catalogue says its bean plants reach a mean height of', unit: 'centimetres', of: 'bean plants', stat: 'mean height', mu: [30, 60], sig: [[3, 9], [4, 16], [5, 25], [6, 36], [2, 16], [3, 36]] }
];
const drawZ = (R, CT, tails, alphas, skip) => { for (;;) { const ctx = R.int(0, CT.length - 1), C = CT[ctx], [sigma, k] = R.pick(C.sig), se = sigma / Math.sqrt(k), tail = R.pick(tails);
 let d10 = R.int(Math.ceil(8 * se), Math.floor(29 * se)); if (tail === 1 || (tail === 3 && R.bool())) d10 = -d10;
 const p = { ctx, tail, mu: R.int(C.mu[0], C.mu[1]), sigma, n: k, d10, alpha: R.pick(alphas), off: R.int(0, 4) }; const Z = ztest(p);
 if (Math.abs(Z.pv - p.alpha) < 0.002 || skip(p)) continue; return p; } };
mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The pump rating inquiry',
 brief: 'A maker’s rating has come before the council, and Mira wants the claim tested from hypotheses to conclusion.',
 labels: ['z', 'p-value', '1 reject, 0 not'], tolerance: 0.00005,
 gl: [['tail: 1 left, 2 right, 3 two-tailed'], ['standard error', 'z'], ['p-value'], ['1 reject, 0 not']]
}, {
 canonical: { ctx: 0, tail: 2, mu: 62, sigma: 6, n: 9, d10: 47, alpha: 0.05, off: 3 },
 draw: R => drawZ(R, Z_B, [1, 2, 3], [0.01, 0.05, 0.1], () => false),
 build: p => { const C = Z_B[p.ctx], Z = ztest(p), [word, tname] = TAILS[p.tail], root = Math.sqrt(p.n); return {
  prompt: `${C.claim} ${n(p.mu)} ${C.unit}, and the population standard deviation is known: σ = ${n(p.sigma)} ${C.unit}. The council suspects the ${C.stat} is ${word} the rating. A random sample of ${n(p.n)} ${C.of} has x̄ = ${n(Z.xb)} ${C.unit}. Test at α = ${n(p.alpha)}. Normal table, the area to the left of z: ${zRows(Z.az, p.off)}. Enter the test statistic z (it comes out exact to 2 decimal places), then the p-value to 4 decimal places, read from the table rows (for a two-tailed test, double the smaller tail area), then 1 to reject the rating or 0 not to.`,
  answer: [Z.z, Z.pv, Z.dec],
  hints: Z_HINTS,
  solution: `H₀: μ = ${n(p.mu)} and Hₐ: μ is ${word} ${n(p.mu)}, a ${tname} test. The standard error is ${n(p.sigma)} ÷ √${n(p.n)} = ${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, so z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.d)} ÷ ${n(Z.se)} = ${n(Z.z)}. The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork(p, Z)}. ${Z.dec ? `${n(Z.pv)} is below α = ${n(p.alpha)}, so reject the rating: enter 1. The ${C.stat} is ${word} ${n(p.mu)} ${C.unit}.` : `${n(Z.pv)} is not below α = ${n(p.alpha)}, so do not reject the rating: enter 0. The sample does not give strong enough evidence against it.`}`,
  guidance: [
   { prompt: 'Which tail does the council’s suspicion give? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.', answer: [p.tail], explanation: `“${cap(word)}” the rating makes the test ${tname}.` },
   { prompt: 'What is the standard error σ ÷ √n, and the test statistic z?', answer: [Z.se, Z.z], explanation: `${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, and z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.z)}.` },
   { prompt: 'Use the table row for the size of z, without its sign. What is the p-value?', answer: [Z.pv], explanation: `The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork(p, Z)}.` },
   { prompt: `Compare the p-value with α = ${n(p.alpha)}. Enter 1 to reject the rating, 0 not to.`, answer: [Z.dec], explanation: Z.dec ? `${n(Z.pv)} is below ${n(p.alpha)}: reject.` : `${n(Z.pv)} is not below ${n(p.alpha)}: do not reject.` }
  ] }; }
});

/* q40c: applied. The sample comes as raw readings. n is 4 (σ 2, 4 or 5) or 9 (σ 3 or 6), so the standard error is 1, 2 or 2.5
   and x̄ is a multiple of 0.5 (n = 4) or whole (n = 9): z is exact to 2 decimals. |z| from 0.8 to 2.9, on the side of Hₐ for a
   one-tailed test. The p-value is never within 0.002 of α. */
const Z_C = [
 { claim: 'The depot’s guide says the tent poles it supplies have a mean length of', unit: 'cm', of: 'poles', stat: 'mean length', mu: [150, 250] },
 { claim: 'The assay lab’s sheet gives ore from the north seam a mean grade of', unit: 'g/t', of: 'ore samples', stat: 'mean grade', mu: [30, 60] },
 { claim: 'The catalogue says its beetroots weigh, on average,', unit: 'g', of: 'beetroots', stat: 'mean weight', mu: [200, 400] }
];
const C_PAIRS = [[2, 4], [4, 4], [5, 4], [3, 9], [6, 9]];
mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'From raw readings to a conclusion',
 brief: 'A small batch has been measured reading by reading, and the council wants the claim settled from those raw numbers.',
 labels: ['x̄', 'z', 'p-value', '1 reject, 0 not'], tolerance: 0.00005,
 gl: [['x̄'], ['standard error', 'z'], ['p-value', '1 reject, 0 not']]
}, {
 canonical: { ctx: 0, tail: 1, mu: 180, sigma: 4, n: 4, x: [175, 178, 176, 177], alpha: 0.05, off: 2 },
 draw: R => { for (;;) { const ctx = R.int(0, Z_C.length - 1), C = Z_C[ctx], [sigma, k] = R.pick(C_PAIRS), se = sigma / Math.sqrt(k), tail = R.int(1, 3), step = k === 4 ? 5 : 10;
  const units = R.int(Math.ceil(8 * se / step - 1e-9), Math.floor(29 * se / step)); let d10 = units * step; if (tail === 1 || (tail === 3 && R.bool())) d10 = -d10;
  const mu = R.int(C.mu[0], C.mu[1]), S = Math.round((mu + d10 / 10) * k), xbar = S / k; const x = [];
  for (let i = 0; i < k - 1; i++) x.push(Math.round(xbar) + R.int(-Math.ceil(1.5 * sigma), Math.ceil(1.5 * sigma))); x.push(S - sum(x)); if (Math.abs(x[k - 1] - xbar) > 2.2 * sigma + 1 || x.some(v => v <= 0)) continue;
  const p = { ctx, tail, mu, sigma, n: k, x, alpha: R.pick([0.01, 0.05, 0.1]), off: R.int(0, 4), d10 }; const Z = ztest(p); if (Math.abs(Z.pv - p.alpha) < 0.002) continue; const { d10: _d, ...q } = p; return q; } },
 build: q => { const C = Z_C[q.ctx], k = q.n, xbar = sum(q.x) / k, p = { ...q, d10: Math.round((xbar - q.mu) * 10) }, Z = ztest(p), [word, tname] = TAILS[p.tail], root = Math.sqrt(k); return {
  prompt: `${C.claim} ${n(p.mu)} ${C.unit}, and the population standard deviation is known: σ = ${n(p.sigma)} ${C.unit}. The council suspects the ${C.stat} is ${word} the claimed value. It measures ${n(k)} ${C.of} at random and gets, in ${C.unit}: ${list(p.x)}. Test at α = ${n(p.alpha)}. Normal table, the area to the left of z: ${zRows(Z.az, p.off)}. Enter the sample mean x̄, then the test statistic z (it comes out exact to 2 decimal places), then the p-value to 4 decimal places, read from the table rows (for a two-tailed test, double the smaller tail area), then 1 to reject the claim or 0 not to.`,
  answer: [Z.xb, Z.z, Z.pv, Z.dec],
  hints: ['The sample mean is the total of the readings divided by how many there are.', 'z = (x̄ − μ₀) ÷ (σ ÷ √n). The table gives the area to the left of a positive z, so the one-tail area beyond it is 1 minus that. A two-tailed p-value doubles the one-tail area, and you reject when the p-value is below α.'],
  solution: `x̄ = ${n(sum(p.x))} ÷ ${n(k)} = ${n(Z.xb)}. H₀: μ = ${n(p.mu)} and Hₐ: μ is ${word} ${n(p.mu)}, a ${tname} test. The standard error is ${n(p.sigma)} ÷ √${n(k)} = ${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, so z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.d)} ÷ ${n(Z.se)} = ${n(Z.z)}. The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork(p, Z)}. ${Z.dec ? `${n(Z.pv)} is below α = ${n(p.alpha)}, so reject the claim: enter 1. The ${C.stat} is ${word} ${n(p.mu)} ${C.unit}.` : `${n(Z.pv)} is not below α = ${n(p.alpha)}, so do not reject the claim: enter 0. The sample does not give strong enough evidence against it.`}`,
  guidance: [
   { prompt: `What is the mean x̄ of the ${n(k)} readings?`, answer: [Z.xb], explanation: `${p.x.map(n).join(' + ')} = ${n(sum(p.x))}, and ${n(sum(p.x))} ÷ ${n(k)} = ${n(Z.xb)}.` },
   { prompt: 'What is the standard error σ ÷ √n, and the test statistic z?', answer: [Z.se, Z.z], explanation: `${n(p.sigma)} ÷ √${n(k)} = ${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, and z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.z)}.` },
   { prompt: `The test is ${tname}, because the suspicion is “${word}” the claim. Use the table row for the size of z, without its sign. What is the p-value, and is it a reject (1) or not (0) at α = ${n(p.alpha)}?`, answer: [Z.pv, Z.dec], explanation: `The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork(p, Z)}. ${Z.dec ? `${n(Z.pv)} is below ${n(p.alpha)}: reject.` : `${n(Z.pv)} is not below ${n(p.alpha)}: do not reject.`}` }
  ] }; }
});

/* q40d: challenge, uses q38. Two-tailed, with the matching confidence interval. The standard error is 0.5, 1, 2 or 2.5, so z
   is exact to 2 decimals. |z| is at least 0.05 from z* (so the test and the interval cannot disagree), the p-value is never
   within 0.002 of α, and the bounds, rounded once to 2 decimals, are never on a rounding tie. */
const Z_D = [
 { claim: 'The mine’s manual says its rock drills advance, on average,', unit: 'm per shift', of: 'drills', stat: 'mean advance', mu: [10, 40], sig: [[1, 4], [2, 16], [3, 36], [4, 64], [2, 4], [5, 100], [5, 4]] },
 { claim: 'The sawmill’s datasheet says its planks have a mean thickness of', unit: 'millimetres', of: 'planks', stat: 'mean thickness', mu: [20, 60], sig: [[4, 64], [3, 36], [2, 16], [5, 25], [4, 16], [10, 16]] },
 { claim: 'The cell lab says its solar cells reach a mean output of', unit: 'watts', of: 'cells', stat: 'mean output', mu: [50, 150], sig: [[4, 16], [6, 36], [10, 25], [5, 100], [15, 36], [10, 16]] }
];
const ZS = { 90: 1.645, 95: 1.96, 99: 2.576 };
mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q38', title: 'The two-tailed inquiry with its interval',
 brief: 'A rating can be wrong in either direction, so the council runs a two-tailed test and checks it against the matching interval.',
 labels: ['z', 'p-value', '1 reject, 0 not', 'lower bound', 'upper bound'], tolerance: 0.00005,
 gl: [['standard error', 'z'], ['p-value', '1 reject, 0 not'], ['lower bound', 'upper bound']]
}, {
 canonical: { ctx: 1, lvl: 95, mu: 40, sigma: 4, n: 64, d10: 12, off: 2 },
 draw: R => { for (;;) { const ctx = R.int(0, Z_D.length - 1), C = Z_D[ctx], [sigma, k] = R.pick(C.sig), se = sigma / Math.sqrt(k), lvl = R.pick([90, 95, 99]);
  if (![0.5, 1, 2, 2.5].some(v => Math.abs(v - se) < 1e-9)) continue; let d10 = R.int(Math.ceil(8 * se), Math.floor(29 * se)); if (R.bool()) d10 = -d10;
  const p = { ctx, lvl, mu: R.int(C.mu[0], C.mu[1]), sigma, n: k, d10, off: R.int(0, 4) }; const q = { ...p, tail: 3, alpha: 1 - lvl / 100 }, Z = ztest(q), xb = Z.xb, E = ZS[lvl] * se;
  if (Math.abs(Z.pv - q.alpha) < 0.002 || Math.abs(Z.az - ZS[lvl]) < 0.05 || tie2(xb - E) || tie2(xb + E)) continue; return p; } },
 build: p => { const C = Z_D[p.ctx], q = { ...p, tail: 3, alpha: Math.round((1 - p.lvl / 100) * 100) / 100 }, Z = ztest(q), root = Math.sqrt(p.n), zs = ZS[p.lvl], E = zs * Z.se, L = Z.xb - E, U = Z.xb + E, L2 = r2(L), U2 = r2(U), al = ALPHA[p.lvl], outside = p.mu < L || p.mu > U; return {
  prompt: `${C.claim} ${n(p.mu)} ${C.unit}, and the population standard deviation is known: σ = ${n(p.sigma)} ${C.unit}. The council has no idea which way the claim might be wrong, so it tests whether the ${C.stat} is different from ${n(p.mu)} ${C.unit}, two-tailed, at α = ${al}. A random sample of ${n(p.n)} ${C.of} has x̄ = ${n(Z.xb)} ${C.unit}. Normal table, the area to the left of z: ${zRows(Z.az, p.off)}. The matching ${n(p.lvl)}% confidence interval uses z* = ${n(zs)}. Enter the test statistic z (it comes out exact to 2 decimal places), then the p-value to 4 decimal places, read from the table rows (double the smaller tail area, as the test is two-tailed), then 1 to reject the claim or 0 not to. Then enter the lower and upper bounds of the interval, each to 2 decimal places.`,
  answer: [Z.z, Z.pv, Z.dec, L2, U2],
  hints: ['z = (x̄ − μ₀) ÷ (σ ÷ √n). For a two-tailed test, the p-value is twice the area beyond the size of z in one tail, and you reject when it is below α.', 'The interval is x̄ plus and minus z* × σ ÷ √n, with the standard error already found for z. Round each bound once, at the end. The test and the interval agree: the claim is rejected exactly when it lies outside the interval.'],
  solution: `H₀: μ = ${n(p.mu)} and Hₐ: μ is different from ${n(p.mu)}, a two-tailed test. The standard error is ${n(p.sigma)} ÷ √${n(p.n)} = ${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, so z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.d)} ÷ ${n(Z.se)} = ${n(Z.z)}. The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork(q, Z)}. ${Z.dec ? `${n(Z.pv)} is below α = ${al}: reject the claim, and enter 1.` : `${n(Z.pv)} is not below α = ${al}: do not reject the claim, and enter 0.`} The margin of error is ${n(zs)} × ${n(Z.se)} = ${ap(E)}, so the lower bound is ${n(Z.xb)} − ${ap(E)} = ${to2(L)}, and the upper bound is ${n(Z.xb)} + ${ap(E)} = ${to2(U)}. The claim ${n(p.mu)} lies ${outside ? 'outside' : 'inside'} the interval, which agrees with the test.`,
  guidance: [
   { prompt: 'What is the standard error σ ÷ √n, and the test statistic z?', answer: [Z.se, Z.z], explanation: `${n(p.sigma)} ÷ √${n(p.n)} = ${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, and z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.z)}.` },
   { prompt: `Use the table row for the size of z, without its sign, and double the one-tail area. What is the p-value, and is it a reject (1) or not (0) at α = ${al}?`, answer: [Z.pv, Z.dec], explanation: `The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork(q, Z)}. ${Z.dec ? `${n(Z.pv)} is below ${al}: reject.` : `${n(Z.pv)} is not below ${al}: do not reject.`}` },
   { prompt: `The margin of error is z* × (standard error), with z* = ${n(zs)}. What are the lower and upper bounds of the ${n(p.lvl)}% interval, to 2 decimal places?`, answer: [L2, U2], explanation: `${n(zs)} × ${n(Z.se)} = ${ap(E)}, so the bounds are ${n(Z.xb)} − ${ap(E)} = ${to2(L)} and ${n(Z.xb)} + ${ap(E)} = ${to2(U)}.` }
  ] }; }
});

})();
