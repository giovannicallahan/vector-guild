/* Data and inference practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p6.js. */
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
/* fx: fixed decimals with a typographic minus; rd: round half away from zero to d places; tie: x sits on a rounding tie
   at d places; same: equal up to float noise. */
const fx = (x, d) => { const k = Math.pow(10, d), v = Math.round(Math.abs(x) * k + 1e-9) / k; return (x < 0 && v > 0 ? '−' : '') + v.toFixed(d); };
const rd = (x, d) => Number(fx(x, d).replace('−', '-'));
const tie = (x, d) => { const v = Math.abs(x) * Math.pow(10, d), f = v - Math.floor(v); return Math.abs(f - 0.5) < 1e-6; };
const same = (a, b) => Math.abs(a - b) < 1e-9;
const f4 = x => fx(x, 4), z2 = x => fx(x, 2), t3 = x => fx(x, 3);
const sum = xs => xs.reduce((s, x) => s + x, 0);
const LETTERS = 'ABCDEFGH';
/* Sum of (O − E)² ÷ E. */
const chi = (O, E) => O.reduce((s, o, i) => s + (o - E[i]) * (o - E[i]) / E[i], 0);
/* "= 2.14" when x has at most d places, "rounds to 2.14" otherwise. */
const isR = (x, d) => same(x, rd(x, d));

/* ---- q26 Matched pairs: testing the differences [10.4] ---- */

/* Mean, sum of squared distances, s_d and t of a list of differences. */
const pm = dif => { const N = dif.length, tot = sum(dif), m = tot / N, ss = rd(sum(dif.map(v => (v - m) * (v - m))), 4), sd = Math.sqrt(ss / (N - 1)), se = sd / Math.sqrt(N);
 return { N, tot, m, ss, sd, se, t: sd > 0 ? m / se : 0 }; };
/* The same filter as the parent: the answer never rests on a rounded s_d, and no value sits on a rounding tie. */
const okPm = (dif, lo, hi, whole) => { const q = pm(dif); if (q.ss === 0 || q.m < lo || q.m > hi) return false; if (whole && q.tot % q.N !== 0) return false;
 return !tie(q.t, 2) && !tie(q.sd, 2) && same(rd(q.t, 2), rd(q.m / (rd(q.sd, 2) / Math.sqrt(q.N)), 2)); };
const parentQ26 = dif => dif.join() === '4,1,6,3,5,0,2' || dif.join() === '2,4,0,3,6';
const dev = (dif, m) => dif.map(x => n(rd((x - m) * (x - m), 4))).join(' + ');

/* q26b: seedling heights before and after a grow lamp (cm), differences after − before. Same filter as the parent. */
mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Seedlings under the grow lamp',
 brief: 'The greenhouse has tried a grow lamp on some seedlings, and the council wants to know whether it really adds height.',
 labels: ['mean difference x̄d (cm)', 't (2 d.p.)'], tolerance: 0.005,
 gl: [['sum of differences (cm)', 'mean x̄d (cm)'], ['sum of squared distances'], ['s_d (2 d.p.)'], ['t (2 d.p.)']]
}, {
 canonical: { bef: [14, 22, 18, 25, 12, 20], dif: [3, 5, 1, 6, 0, 3] },
 draw: R => { for (;;) { const N = R.int(5, 8), bef = [], dif = []; for (let i = 0; i < N; i++) { bef.push(R.int(10, 30)); dif.push(R.int(-3, 9)); }
  if (!okPm(dif, 1, 6, true) || parentQ26(dif)) continue; return { bef, dif }; } },
 build: ({ bef, dif }) => { const q = pm(dif), { N, tot, m, ss, sd, t } = q, tr = rd(t, 2), aft = bef.map((b, i) => b + dif[i]);
  const list = bef.map((b, i) => `${LETTERS[i]} ${b} and ${aft[i]}`).join('; '), dl = dif.map(n).join(', '); return {
  prompt: `The Trial Fields greenhouse measured ${N} tomato seedlings before and after a week under a new grow lamp, so each seedling gives a matched pair. Heights in cm, before then after: ${list}. Take each difference as after minus before. Enter the mean difference x̄d in cm, then the t statistic for testing H₀: μd = 0, to 2 decimal places.`,
  answer: [m, tr],
  hints: ['Subtract within each seedling, always after minus before. The differences are now the data.', 'Find the mean x̄d and the sample standard deviation s_d of the differences (divide by n − 1), then t = x̄d ÷ (s_d ÷ √n), with n the number of pairs.'],
  solution: `The differences are ${dl}. Their sum is ${n(tot)}, so x̄d = ${n(tot)} ÷ ${N} = ${n(m)} cm. The squared distances from the mean add to ${dev(dif, m)} = ${n(ss)}, so s_d = √(${n(ss)} ÷ ${N - 1}) = ${f4(sd)} (to 4 decimal places). t = ${n(m)} ÷ (${f4(sd)} ÷ √${N}) = ${n(m)} ÷ ${f4(sd / Math.sqrt(N))}${isR(t, 2) ? ` = ${z2(tr)}` : `, which is ${z2(tr)} to 2 decimal places`}, with df = ${N - 1}. Enter ${n(m)} and ${z2(tr)}.`,
  guidance: [
   { prompt: `Work out the ${N} differences, after minus before. What is their sum, and what is their mean x̄d?`, answer: [tot, m], explanation: `The differences are ${dl}. They add to ${n(tot)}, and ${n(tot)} ÷ ${N} = ${n(m)}.` },
   { prompt: `Subtract the mean ${n(m)} from each difference and square. What do the squares add to?`, answer: [ss], explanation: `${dev(dif, m)} = ${n(ss)}.` },
   { prompt: `What is the standard deviation of the differences, s_d = √(${n(ss)} ÷ ${N - 1}), to 2 decimal places?`, answer: [rd(sd, 2)], explanation: `${n(ss)} ÷ ${N - 1} = ${n(rd(ss / (N - 1), 4))}${isR(ss / (N - 1), 4) ? '' : ' (to 4 decimal places)'}, and its square root is ${f4(sd)}, which is ${(rd(sd, 2)).toFixed(2).replace('-', '−')} to 2 decimal places.` },
   { prompt: `What is t = x̄d ÷ (s_d ÷ √${N}), to 2 decimal places?`, answer: [tr], explanation: `s_d ÷ √${N} = ${f4(sd)} ÷ ${f4(Math.sqrt(N))} = ${f4(se4(q))}, and ${n(m)} ÷ ${f4(se4(q))}${isR(t, 2) ? ` = ${z2(tr)}` : ` rounds to ${z2(tr)}`}.` }
  ] }; }
});
function se4(q) { return q.sd / Math.sqrt(q.N); }

/* q26c: shade cloth over benches, noon temperature (°C), differences after − before are falls (negative). */
mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Shade cloth on the benches',
 brief: 'Shade cloth has been fitted over the nursery benches, and the council wants to know whether it really cools them.',
 labels: ['mean difference x̄d (°C)', 't (2 d.p.)'], tolerance: 0.005,
 gl: [['sum of differences (°C)', 'mean x̄d (°C)'], ['sum of squared distances', 's_d (2 d.p.)'], ['t (2 d.p.)']]
}, {
 canonical: { bef: [31, 28, 34, 30, 33, 29], dif: [-4, -1, -6, -3, -3, -1] },
 draw: R => { for (;;) { const N = R.int(5, 8), bef = [], dif = []; for (let i = 0; i < N; i++) { bef.push(R.int(26, 38)); dif.push(R.int(-9, 3)); }
  if (!okPm(dif, -6, -1, true)) continue; return { bef, dif }; } },
 build: ({ bef, dif }) => { const q = pm(dif), { N, tot, m, ss, sd, t } = q, tr = rd(t, 2), aft = bef.map((b, i) => b + dif[i]);
  const list = bef.map((b, i) => `${LETTERS[i]} ${b} and ${aft[i]}`).join('; '), dl = dif.map(n).join(', '); return {
  prompt: `The Trial Fields fitted shade cloth over ${N} nursery benches and want to know whether it lowers the noon temperature. Each bench was read at noon before the cloth and again at noon after it, so each bench gives a matched pair. Temperatures in °C, before then after: ${list}. Take each difference as after minus before, so a fall in temperature is a negative number. Enter the mean difference x̄d in °C, then the t statistic for testing H₀: μd = 0, to 2 decimal places.`,
  answer: [m, tr],
  hints: ['Subtract within each bench, always after minus before, so a cooler bench gives a negative difference. The differences are the data.', 'Find the mean x̄d and the sample standard deviation s_d of the differences (divide by n − 1), then t = x̄d ÷ (s_d ÷ √n). The sign of t follows the sign of x̄d.'],
  solution: `The differences are ${dl}. Their sum is ${n(tot)}, so x̄d = ${n(tot)} ÷ ${N} = ${n(m)} °C. The squared distances from the mean add to ${dev(dif, m)} = ${n(ss)}, so s_d = √(${n(ss)} ÷ ${N - 1}) = ${f4(sd)} (to 4 decimal places). t = ${n(m)} ÷ (${f4(sd)} ÷ √${N}) = ${n(m)} ÷ ${f4(sd / Math.sqrt(N))}${isR(t, 2) ? ` = ${z2(tr)}` : `, which is ${z2(tr)} to 2 decimal places`}. The negative sign shows the benches were cooler after the cloth. Enter ${n(m)} and ${z2(tr)}.`,
  guidance: [
   { prompt: `Work out the ${N} differences, after minus before. What is their sum, and what is their mean x̄d?`, answer: [tot, m], explanation: `The differences are ${dl}. They add to ${n(tot)}, and ${n(tot)} ÷ ${N} = ${n(m)}.` },
   { prompt: `Subtract the mean ${n(m)} from each difference and square. What do the squares add to, and what is s_d = √(that sum ÷ ${N - 1}) to 2 decimal places?`, answer: [ss, rd(sd, 2)], explanation: `${dev(dif, m)} = ${n(ss)}. Then ${n(ss)} ÷ ${N - 1} = ${n(rd(ss / (N - 1), 4))}${isR(ss / (N - 1), 4) ? '' : ' (to 4 decimal places)'}, and its square root is ${f4(sd)}, which is ${(rd(sd, 2)).toFixed(2).replace('-', '−')} to 2 decimal places.` },
   { prompt: `What is t = x̄d ÷ (s_d ÷ √${N}), to 2 decimal places? Keep the sign.`, answer: [tr], explanation: `s_d ÷ √${N} = ${f4(sd)} ÷ ${f4(Math.sqrt(N))} = ${f4(se4(q))}, and ${n(m)} ÷ ${f4(se4(q))}${isR(t, 2) ? ` = ${z2(tr)}` : ` rounds to ${z2(tr)}`}.` }
  ] }; }
});

/* q26d: ten test rows, soil moisture (%) dry then wet; the mean of ten differences has one decimal place. */
mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', title: 'Ten rows, dry and wet',
 brief: 'Ten test rows were read on a dry morning and again after irrigation, and the council wants the evidence worked out exactly.',
 labels: ['mean difference x̄d (%)', 't (2 d.p.)'], tolerance: 0.005,
 gl: [['sum of differences (%)', 'mean x̄d (%)'], ['sum of squared distances'], ['t (2 d.p.)']]
}, {
 canonical: { dry: [22, 31, 27, 35, 24, 29, 33, 26, 30, 28], dif: [5, 2, 8, 3, 6, 1, 4, 7, 2, 4] },
 draw: R => { for (;;) { const dry = [], dif = []; for (let i = 0; i < 10; i++) { dry.push(R.int(20, 40)); dif.push(R.int(-3, 9)); }
  const q = pm(dif); if (q.ss === 0 || q.m < 1 || q.m > 6 || Number.isInteger(q.m) || tie(q.t, 2)) continue; return { dry, dif }; } },
 build: ({ dry, dif }) => { const q = pm(dif), { N, tot, m, ss, se, t } = q, tr = rd(t, 2), wet = dry.map((b, i) => b + dif[i]);
  const list = dry.map((b, i) => `${'ABCDEFGHJK'[i]} ${b} and ${wet[i]}`).join('; '), dl = dif.map(n).join(', '); return {
  prompt: `The Trial Fields read the soil moisture, in per cent, in ${N} test rows on a dry morning and again the morning after irrigation, so each row gives a matched pair. Dry then wet: ${list}. Take each difference as wet minus dry. Enter the mean difference x̄d in per cent (it has one decimal place), then the t statistic for testing H₀: μd = 0, to 2 decimal places.`,
  answer: [m, tr],
  hints: ['Subtract within each row, wet minus dry. The mean of the differences may not be a whole number; keep its decimal place when you subtract it from each difference.', 'The standard error is s_d ÷ √n, where s_d divides the sum of squared distances by n − 1. Then t = x̄d ÷ (s_d ÷ √n), with n the number of pairs. Round only the final t.'],
  solution: `The differences are ${dl}. Their sum is ${n(tot)}, so x̄d = ${n(tot)} ÷ ${N} = ${n(m)}. The squared distances from the mean add to ${dev(dif, m)} = ${n(ss)}, so s_d = √(${n(ss)} ÷ ${N - 1}) = ${f4(q.sd)} (to 4 decimal places) and s_d ÷ √${N} = ${f4(se)}. t = ${n(m)} ÷ ${f4(se)}${isR(t, 2) ? ` = ${z2(tr)}` : `, which is ${z2(tr)} to 2 decimal places`}, with df = ${N - 1}. Enter ${n(m)} and ${z2(tr)}.`,
  guidance: [
   { prompt: `Work out the ${N} differences, wet minus dry. What is their sum, and what is their mean x̄d?`, answer: [tot, m], explanation: `The differences are ${dl}. They add to ${n(tot)}, and ${n(tot)} ÷ ${N} = ${n(m)}.` },
   { prompt: `Subtract the mean ${n(m)} from each difference and square. What do the squares add to?`, answer: [ss], explanation: `${dev(dif, m)} = ${n(ss)}.` },
   { prompt: `What is t = x̄d ÷ (s_d ÷ √${N}), with s_d = √(${n(ss)} ÷ ${N - 1})? Keep the full calculator value for s_d and round only t, to 2 decimal places.`, answer: [tr], explanation: `s_d = ${f4(q.sd)} and s_d ÷ √${N} = ${f4(se)}. Then ${n(m)} ÷ ${f4(se)}${isR(t, 2) ? ` = ${z2(tr)}` : ` rounds to ${z2(tr)}`}.` }
  ] }; }
});

/* ---- q27 Chi-square goodness of fit [11.2] ---- */

/* Claimed shares (percent) for three categories and for four; sample sizes make every expected count whole and at least 5. */
const SH3 = [[55, 30, 15], [35, 45, 20], [40, 35, 25], [65, 25, 10], [20, 50, 30], [50, 25, 25], [45, 40, 15]];
const SH4 = [[40, 30, 20, 10], [35, 30, 20, 15], [50, 25, 15, 10], [30, 30, 25, 15], [45, 25, 20, 10], [40, 25, 20, 15]];

/* q27b: three kinds of insect visit to a flower strip. */
mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'Visitors to the flower strip',
 brief: 'A beekeeper says how visits to the flower strip split between insects, and a volunteer has a tally to check it against.',
 labels: ['expected bee visits', 'expected hoverfly visits', 'expected butterfly visits', 'χ² (2 d.p.)'], tolerance: 0.005,
 gl: [['expected bee visits', 'expected hoverfly visits', 'expected butterfly visits'], ['(O − E)² for bees', '(O − E)² for hoverflies', '(O − E)² for butterflies'], ['χ² (2 d.p.)']]
}, {
 canonical: { s: 0, N: 120, d1: -9, d2: 6 },
 draw: R => { for (;;) { const s = R.int(0, SH3.length - 1), N = R.pick([80, 100, 120, 160, 200]), d1 = R.int(-12, 12), d2 = R.int(-12, 12), E = SH3[s].map(v => v * N / 100);
  if ((d1 === 0 && d2 === 0) || E.some(e => !Number.isInteger(e) || e < 5)) continue; const O = [E[0] + d1, E[1] + d2, E[2] - d1 - d2];
  if (O.some(o => o < 0) || tie(chi(O, E), 2)) continue; return { s, N, d1, d2 }; } },
 build: ({ s, N, d1, d2 }) => { const sh = SH3[s], E = sh.map(v => v * N / 100), O = [E[0] + d1, E[1] + d2, E[2] - d1 - d2], x = chi(O, E), xr = rd(x, 2), sq = O.map((o, i) => (o - E[i]) * (o - E[i]));
  const terms = O.map((o, i) => `${sq[i]} ÷ ${E[i]}`).join(' + '); return {
  prompt: `A beekeeper says that the visits to the Trial Fields flower strip are ${sh[0]}% bees, ${sh[1]}% hoverflies and ${sh[2]}% butterflies. A volunteer logged ${N} visits chosen at random: ${O[0]} by bees, ${O[1]} by hoverflies and ${O[2]} by butterflies. Enter the expected numbers of bee, hoverfly and butterfly visits if the beekeeper is right, then the chi-square statistic χ² to 2 decimal places.`,
  answer: [E[0], E[1], E[2], xr],
  hints: ['An expected count is the claimed share times the number of visits logged: what the claim says we should see.', 'For each kind of visitor work out (O − E)² ÷ E, with O the count logged and E the expected count, and add the three results.'],
  solution: `Expected counts: ${sh[0]}% of ${N} is ${E[0]}, ${sh[1]}% is ${E[1]} and ${sh[2]}% is ${E[2]}. The differences O − E are ${O.map((o, i) => n(o - E[i])).join(', ')}, with squares ${sq.join(', ')}. χ² = ${terms}${isR(x, 2) ? ` = ${n(xr)}` : `, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${E.join(', ')} and ${n(xr)}.`,
  guidance: [
   { prompt: `If the beekeeper is right, how many of ${N} visits should come from bees, hoverflies and butterflies?`, answer: E.slice(), explanation: `${sh[0]}% of ${N} = ${E[0]}, ${sh[1]}% of ${N} = ${E[1]} and ${sh[2]}% of ${N} = ${E[2]}. They add to ${N}, as they must.` },
   { prompt: `For each kind of visitor, what is (O − E)²?`, answer: sq.slice(), explanation: `${O.map((o, i) => `(${o} − ${E[i]})² = ${sq[i]}`).join(', ')}.` },
   { prompt: `What is χ² = ${terms}, to 2 decimal places?`, answer: [xr], explanation: `${O.map((o, i) => `${sq[i]} ÷ ${E[i]} = ${n(rd(sq[i] / E[i], 4))}`).join(', ')}. Their sum${isR(x, 2) ? ` is ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
  ] }; }
});

/* q27c: four colours of flower, the last count is "the rest"; asks for it, df = k − 1, and χ². */
mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The flower-seed packet',
 brief: 'A merchant promises a colour mix in every packet, and the Trial Fields have grown one packet to see whether it keeps the promise.',
 labels: ['pink flowers', 'df', 'χ² (2 d.p.)'], tolerance: 0.005,
 gl: [['pink flowers'], ['expected red', 'expected yellow', 'expected white', 'expected pink'], ['df', 'χ² (2 d.p.)']]
}, {
 canonical: { s: 0, N: 150, d1: -7, d2: 5, d3: 4 },
 draw: R => { for (;;) { const s = R.int(0, SH4.length - 1), N = R.pick([80, 100, 120, 160, 200]), d = [R.int(-10, 10), R.int(-10, 10), R.int(-10, 10)], E = SH4[s].map(v => v * N / 100);
  if (E.some(e => !Number.isInteger(e)) || (d[0] === 0 && d[1] === 0 && d[2] === 0)) continue; const O = [E[0] + d[0], E[1] + d[1], E[2] + d[2]]; O.push(N - sum(O));
  if (O.some(o => o < 0) || tie(chi(O, E), 2)) continue; return { s, N, d1: d[0], d2: d[1], d3: d[2] }; } },
 build: ({ s, N, d1, d2, d3 }) => { const sh = SH4[s], E = sh.map(v => v * N / 100), O = [E[0] + d1, E[1] + d2, E[2] + d3]; O.push(N - sum(O));
  const x = chi(O, E), xr = rd(x, 2), sq = O.map((o, i) => (o - E[i]) * (o - E[i])), terms = O.map((o, i) => `${sq[i]} ÷ ${E[i]}`).join(' + '); return {
  prompt: `A seed merchant claims that a packet of mixed flower seeds grows ${sh[0]}% red, ${sh[1]}% yellow, ${sh[2]}% white and ${sh[3]}% pink flowers. The Trial Fields grew a random sample of ${N} seeds from one packet and counted ${O[0]} red, ${O[1]} yellow and ${O[2]} white flowers; all the rest were pink. To test H₀: the claim is true, enter the number of pink flowers, then the degrees of freedom, then χ² to 2 decimal places.`,
  answer: [O[3], 3, xr],
  hints: ['The flowers that were not red, yellow or white are the pink ones: take the three counts away from the sample size.', 'Expected count = claimed share × sample size, for each of the four colours. df = k − 1 for k categories, and χ² = Σ(O − E)² ÷ E over all four.'],
  solution: `The pink flowers are ${N} − ${O[0]} − ${O[1]} − ${O[2]} = ${O[3]}. Expected counts: ${sh.map((v, i) => `${v}% of ${N} is ${E[i]}`).join(', ')}. There are 4 categories, so df = 4 − 1 = 3. χ² = ${terms}${isR(x, 2) ? ` = ${n(xr)}` : `, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${O[3]}, 3 and ${n(xr)}.`,
  guidance: [
   { prompt: `The sample is ${N} flowers, with ${O[0]} red, ${O[1]} yellow and ${O[2]} white. How many were pink?`, answer: [O[3]], explanation: `${N} − ${O[0]} − ${O[1]} − ${O[2]} = ${O[3]}.` },
   { prompt: `If the claim is true, how many red, yellow, white and pink flowers should ${N} seeds grow?`, answer: E.slice(), explanation: `${sh.map((v, i) => `${v}% of ${N} = ${E[i]}`).join(', ')}. They add to ${N}, as they must.` },
   { prompt: `The observed counts are ${O.join(', ')}. With 4 categories, what is df, and what is χ² to 2 decimal places?`, answer: [3, xr], explanation: `df = k − 1 = 4 − 1 = 3. χ² = ${terms}${isR(x, 2) ? ` = ${n(xr)}` : `, which rounds to ${xr.toFixed(2)}`}.` }
  ] }; }
});

/* q27d: four categories whose expected counts are not all whole numbers (sample sizes 90, 110, 130, 150, 170). */
const SH4D = [[35, 30, 20, 15], [40, 25, 20, 15], [30, 25, 25, 20], [45, 25, 20, 10], [35, 35, 15, 15]];
mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', title: 'The hedge visitor log',
 brief: 'A field guide gives the split of insects visiting a hedge, and a volunteer’s log has to be tested against it with exact expected counts.',
 labels: ['expected bees', 'expected hoverflies', 'expected wasps', 'expected butterflies', 'χ² (2 d.p.)'], tolerance: 0.005,
 gl: [['expected bees', 'expected hoverflies', 'expected wasps', 'expected butterflies'], ['(O − E)² for bees', '(O − E)² for hoverflies', '(O − E)² for wasps', '(O − E)² for butterflies'], ['χ² (2 d.p.)']]
}, {
 canonical: { s: 0, N: 90, e1: 2, e2: -4, e3: 3 },
 draw: R => { for (;;) { const s = R.int(0, SH4D.length - 1), N = R.pick([90, 110, 130, 150, 170]), e = [R.int(-5, 6), R.int(-5, 6), R.int(-5, 6)], E = SH4D[s].map(v => v * N / 100);
  const O = [Math.floor(E[0]) + e[0], Math.floor(E[1]) + e[1], Math.floor(E[2]) + e[2]]; O.push(N - sum(O));
  if (O.some(o => o < 0) || Math.abs(O[3] - E[3]) > 10 || tie(chi(O, E), 2)) continue; return { s, N, e1: e[0], e2: e[1], e3: e[2] }; } },
 build: ({ s, N, e1, e2, e3 }) => { const sh = SH4D[s], E = sh.map(v => v * N / 100), O = [Math.floor(E[0]) + e1, Math.floor(E[1]) + e2, Math.floor(E[2]) + e3]; O.push(N - sum(O));
  const x = chi(O, E), xr = rd(x, 2), sq = O.map((o, i) => rd((o - E[i]) * (o - E[i]), 4)), terms = O.map((o, i) => `${n(sq[i])} ÷ ${n(E[i])}`).join(' + '); return {
  prompt: `A field guide says that the insects visiting a hedge are ${sh[0]}% bees, ${sh[1]}% hoverflies, ${sh[2]}% wasps and ${sh[3]}% butterflies. A Trial Fields volunteer logged ${N} visits to one hedge, chosen at random: ${O[0]} bees, ${O[1]} hoverflies, ${O[2]} wasps and ${O[3]} butterflies. Enter the four expected counts if the guide is right (some are not whole numbers, so type them as decimals), then χ² to 2 decimal places.`,
  answer: [E[0], E[1], E[2], E[3], xr],
  hints: ['An expected count is the claimed share times the number of visits. A share in per cent means that many hundredths of the visits, and the result need not be a whole number.', 'For each of the four insects work out (O − E)² ÷ E, with O the count logged and E the expected count, and add the four results.'],
  solution: `Expected counts: ${sh.map((v, i) => `${v}% of ${N} is ${n(E[i])}`).join(', ')}. The differences O − E are ${O.map((o, i) => n(o - E[i])).join(', ')}, with squares ${sq.map(n).join(', ')}. χ² = ${terms}${isR(x, 2) ? ` = ${n(xr)}` : `, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${E.map(n).join(', ')} and ${n(xr)}.`,
  guidance: [
   { prompt: `If the guide is right, how many of ${N} visits should come from bees, hoverflies, wasps and butterflies?`, answer: E.slice(), explanation: `${sh.map((v, i) => `${v}% of ${N} = ${n(E[i])}`).join(', ')}. They add to ${N}, as they must.` },
   { prompt: `For each kind of insect, what is (O − E)²?`, answer: sq.slice(), explanation: `${O.map((o, i) => `(${o} − ${n(E[i])})² = ${n(sq[i])}`).join(', ')}.` },
   { prompt: `What is χ² = ${terms}, to 2 decimal places?`, answer: [xr], explanation: `${O.map((o, i) => `${n(sq[i])} ÷ ${n(E[i])} = ${n(rd(sq[i] / E[i], 4))}`).join(', ')}. Their sum${isR(x, 2) ? ` is ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
  ] }; }
});

/* ---- q28 Chi-square test of independence [11.3] ---- */

/* Two-way table from row shares a and column shares b (tenths of N) and moves D[i][j] that keep every row and column total. */
const tab = (N, a, b, D) => { const Rt = a.map(v => N * v / 10), Ct = b.map(v => N * v / 10), E = Rt.map(r => Ct.map(c => r * c / N)), O = E.map((row, i) => row.map((e, j) => e + D[i][j]));
 return { Rt, Ct, E, O, x: sum(O.map((row, i) => chi(row, E[i]))) }; };
const cells = (O, E) => O.flatMap((row, i) => row.map((o, j) => `(${o} − ${E[i][j]})² ÷ ${E[i][j]}`)).join(' + ');

/* q28b: three fertiliser mixes (rows) against healthy and blighted (columns): a 3 × 2 table, df = 2. */
const MIX = ['A', 'B', 'C'], CROP = ['healthy', 'blighted'];
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Three fertiliser mixes',
 brief: 'Three fertiliser mixes were tried on the trial plots, and the council wants to know whether blight has anything to do with the mix.',
 labels: ['expected count', 'df', 'χ² (2 d.p.)'], tolerance: 0.005,
 gl: [['row total', 'column total', 'grand total'], ['expected count'], ['df'], ['χ² (2 d.p.)']]
}, {
 canonical: { N: 200, a: [3, 3, 4], b: 6, d1: -8, d2: 5, r: 2, c: 0 },
 draw: R => { for (;;) { const N = R.pick([100, 200]), a1 = R.int(2, 5), a2 = R.int(2, 5), a = [a1, a2, 10 - a1 - a2]; if (a[2] < 2) continue;
  const p = { N, a, b: R.int(3, 7), d1: R.int(-9, 9), d2: R.int(-9, 9), r: R.int(0, 2), c: R.int(0, 1) }, q = t28b(p);
  if ((p.d1 === 0 && p.d2 === 0) || q.E.flat().some(e => e < 6) || q.O.flat().some(o => o < 1) || tie(q.x, 2)) continue; return p; } },
 build: P => { const q = t28b(P), { E, O, Rt, Ct, x } = q, { N, r, c } = P, xr = rd(x, 2), all = E.map((row, i) => `Mix ${MIX[i]} ${row.join(', ')}`).join('; '); return {
  prompt: `The Trial Fields tried three fertiliser mixes on ${N} plots and graded each plot healthy or blighted. Mix A: ${O[0][0]} healthy, ${O[0][1]} blighted. Mix B: ${O[1][0]} healthy, ${O[1][1]} blighted. Mix C: ${O[2][0]} healthy, ${O[2][1]} blighted. To test H₀: blight is independent of the mix, enter the expected count for Mix ${MIX[r]} with a ${CROP[c]} crop, then the degrees of freedom, then χ² to 2 decimal places.`,
  answer: [E[r][c], 2, xr],
  hints: ['If H₀ is true, the expected count of a cell is (row total × column total) ÷ grand total.', 'df = (number of rows − 1) × (number of columns − 1). χ² adds (O − E)² ÷ E over all six cells.'],
  solution: `The row totals are ${Rt.join(', ')}, the column totals ${Ct.join(' and ')}, and the grand total ${N}. The Mix ${MIX[r]}, ${CROP[c]} cell expects ${Rt[r]} × ${Ct[c]} ÷ ${N} = ${E[r][c]}. The table has 3 rows and 2 columns, so df = (3 − 1) × (2 − 1) = 2. The six expected counts are ${all}, and adding (O − E)² ÷ E over the six cells gives χ² = ${isR(x, 2) ? n(xr) : `${n(rd(x, 4))}, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${E[r][c]}, 2 and ${n(xr)}.`,
  guidance: [
   { prompt: `For the Mix ${MIX[r]}, ${CROP[c]} cell: what is its row total, its column total, and the grand total?`, answer: [Rt[r], Ct[c], N], explanation: `The Mix ${MIX[r]} row adds to ${Rt[r]}, the ${CROP[c]} column adds to ${Ct[c]}, and all the plots add to ${N}.` },
   { prompt: `What is that cell's expected count, row total × column total ÷ grand total?`, answer: [E[r][c]], explanation: `${Rt[r]} × ${Ct[c]} ÷ ${N} = ${Rt[r] * Ct[c]} ÷ ${N} = ${E[r][c]}.` },
   { prompt: `The table has 3 rows and 2 columns. What is df?`, answer: [2], explanation: `df = (3 − 1) × (2 − 1) = 2 × 1 = 2.` },
   { prompt: `The six expected counts are ${all}. What is χ², the sum of (O − E)² ÷ E over the six cells, to 2 decimal places?`, answer: [xr], explanation: `${cells(O, E)}${isR(x, 2) ? ` = ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
  ] }; }
});
function t28b({ N, a, b, d1, d2 }) { const D = [d1, d2, -d1 - d2]; return tab(N, a, [b, 10 - b], D.map(v => [v, -v])); }

/* q28c: a 2 × 2 table given by its totals and one cell; fill in the rest, then expected count, df = 1 and χ². */
mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'The half-filled harvest table',
 brief: 'The council’s harvest table has lost three of its four cells, but its totals survive, and the question about the seed still has to be answered.',
 labels: ['old-seed plots with a good harvest', 'expected count', 'df', 'χ² (2 d.p.)'], tolerance: 0.005,
 gl: [['old-seed plots, good harvest'], ['expected count'], ['df', 'χ² (2 d.p.)']]
}, {
 canonical: { N: 200, a: 4, b: 6, d: -8 },
 draw: R => { for (;;) { const p = { N: R.pick([100, 200]), a: R.int(3, 7), b: R.int(3, 7), d: R.nz(-9, 9) }, q = t28c(p);
  if (q.E.flat().some(e => e < 6) || q.O.flat().some(o => o < 1) || tie(q.x, 2)) continue; return p; } },
 build: P => { const q = t28c(P), { E, O, Rt, Ct, x } = q, { N } = P, xr = rd(x, 2), all = `new seed ${E[0].join(', ')}; old seed ${E[1].join(', ')}`; return {
  prompt: `The Trial Fields sowed ${N} plots, ${Rt[0]} with the new seed and the rest with the old, and graded each harvest good or poor. Altogether ${Ct[0]} plots gave a good harvest and the rest a poor one. Of the new-seed plots, ${O[0][0]} gave a good harvest. To test H₀: the grade is independent of the seed, enter how many old-seed plots gave a good harvest, then the expected count for new seed with a good harvest, then the degrees of freedom, then χ² to 2 decimal places.`,
  answer: [O[1][0], E[0][0], 1, xr],
  hints: ['Fill in the missing cells of the table from the totals: each row and each column must add up to its total.', 'The expected count of a cell is (row total × column total) ÷ grand total. df = (rows − 1) × (columns − 1), and χ² adds (O − E)² ÷ E over all four cells.'],
  solution: `The good harvests add to ${Ct[0]}, so old seed with a good harvest is ${Ct[0]} − ${O[0][0]} = ${O[1][0]}. The new-seed plots with a poor harvest are ${Rt[0]} − ${O[0][0]} = ${O[0][1]}, and the old-seed row holds ${N} − ${Rt[0]} = ${Rt[1]} plots, so the old-seed plots with a poor harvest are ${Rt[1]} − ${O[1][0]} = ${O[1][1]}. The new-seed, good cell expects ${Rt[0]} × ${Ct[0]} ÷ ${N} = ${E[0][0]}. The table has 2 rows and 2 columns, so df = (2 − 1) × (2 − 1) = 1. The four expected counts are ${all}, and adding (O − E)² ÷ E over the four cells gives χ² = ${isR(x, 2) ? n(xr) : `${n(rd(x, 4))}, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${O[1][0]}, ${E[0][0]}, 1 and ${n(xr)}.`,
  guidance: [
   { prompt: `${Ct[0]} plots in all had a good harvest, and ${O[0][0]} of them were new-seed plots. How many old-seed plots had a good harvest?`, answer: [O[1][0]], explanation: `${Ct[0]} − ${O[0][0]} = ${O[1][0]}.` },
   { prompt: `The new-seed row adds to ${Rt[0]} and the good-harvest column to ${Ct[0]}. What is the expected count for new seed with a good harvest?`, answer: [E[0][0]], explanation: `${Rt[0]} × ${Ct[0]} ÷ ${N} = ${Rt[0] * Ct[0]} ÷ ${N} = ${E[0][0]}.` },
   { prompt: `The full table is new seed ${O[0].join(' good, ')} poor; old seed ${O[1].join(' good, ')} poor, with expected counts ${all}. What is df for a table with 2 rows and 2 columns, and what is χ² to 2 decimal places?`, answer: [1, xr], explanation: `df = (2 − 1) × (2 − 1) = 1. χ² = ${cells(O, E)}${isR(x, 2) ? ` = ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
  ] }; }
});
function t28c({ N, a, b, d }) { return tab(N, [a, 10 - a], [b, 10 - b], [[d, -d], [-d, d]]); }

/* q28d: three beds against three levels of leaf damage: a 3 × 3 table, df = 4. */
const BED = ['North', 'Middle', 'South'], DAM = ['no', 'light', 'heavy'];
mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', title: 'Beds and leaf damage',
 brief: 'Three beds were scored for leaf damage, and the council wants to know whether the damage depends on the bed.',
 labels: ['expected count', 'df', 'χ² (2 d.p.)'], tolerance: 0.005,
 gl: [['row total', 'column total', 'grand total'], ['expected count'], ['df'], ['χ² (2 d.p.)']]
}, {
 canonical: { N: 200, a: [3, 3, 4], b: [2, 5, 3], d: [3, -5, -4, 6], r: 2, c: 1 },
 draw: R => { for (;;) { const N = R.pick([100, 200]), a1 = R.int(2, 5), a2 = R.int(2, 5), b1 = R.int(2, 5), b2 = R.int(2, 5), a = [a1, a2, 10 - a1 - a2], b = [b1, b2, 10 - b1 - b2]; if (a[2] < 2 || b[2] < 2) continue;
  const p = { N, a, b, d: [R.int(-6, 6), R.int(-6, 6), R.int(-6, 6), R.int(-6, 6)], r: R.int(0, 2), c: R.int(0, 2) }, q = t28d(p);
  if (p.d.every(v => v === 0) || q.E.flat().some(e => e < 6) || q.O.flat().some(o => o < 1) || tie(q.x, 2)) continue; return p; } },
 build: P => { const q = t28d(P), { E, O, Rt, Ct, x } = q, { N, r, c } = P, xr = rd(x, 2), all = E.map((row, i) => `${BED[i].toLowerCase()} ${row.join(', ')}`).join('; ');
  const row = i => `${BED[i]} bed: ${O[i][0]} none, ${O[i][1]} light, ${O[i][2]} heavy`; return {
  prompt: `The Trial Fields scored the leaf damage of ${N} plants in three beds as none, light or heavy. ${row(0)}. ${row(1)}. ${row(2)}. To test H₀: the damage is independent of the bed, enter the expected count for the ${BED[r].toLowerCase()} bed with ${DAM[c]} damage, then the degrees of freedom, then χ² to 2 decimal places.`,
  answer: [E[r][c], 4, xr],
  hints: ['If H₀ is true, the expected count of a cell is (row total × column total) ÷ grand total.', 'df = (number of rows − 1) × (number of columns − 1). χ² adds (O − E)² ÷ E over all nine cells.'],
  solution: `The row totals are ${Rt.join(', ')}, the column totals ${Ct.join(', ')}, and the grand total ${N}. The ${BED[r].toLowerCase()}-bed, ${DAM[c]}-damage cell expects ${Rt[r]} × ${Ct[c]} ÷ ${N} = ${E[r][c]}. The table has 3 rows and 3 columns, so df = (3 − 1) × (3 − 1) = 4. The nine expected counts are ${all}, and adding (O − E)² ÷ E over the nine cells gives χ² = ${isR(x, 2) ? n(xr) : `${n(rd(x, 4))}, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${E[r][c]}, 4 and ${n(xr)}.`,
  guidance: [
   { prompt: `For the ${BED[r].toLowerCase()}-bed, ${DAM[c]}-damage cell: what is its row total, its column total, and the grand total?`, answer: [Rt[r], Ct[c], N], explanation: `The ${BED[r].toLowerCase()}-bed row adds to ${Rt[r]}, the ${DAM[c]}-damage column adds to ${Ct[c]}, and all the plants add to ${N}.` },
   { prompt: `What is that cell's expected count, row total × column total ÷ grand total?`, answer: [E[r][c]], explanation: `${Rt[r]} × ${Ct[c]} ÷ ${N} = ${Rt[r] * Ct[c]} ÷ ${N} = ${E[r][c]}.` },
   { prompt: `The table has 3 rows and 3 columns. What is df?`, answer: [4], explanation: `df = (3 − 1) × (3 − 1) = 2 × 2 = 4.` },
   { prompt: `The nine expected counts are ${all}. What is χ², the sum of (O − E)² ÷ E over the nine cells, to 2 decimal places?`, answer: [xr], explanation: `${cells(O, E)}${isR(x, 2) ? ` = ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
  ] }; }
});
function t28d({ N, a, b, d }) { const [p, q, u, v] = d, D0 = [p, q, -p - q], D1 = [u, v, -u - v], D2 = D0.map((w, j) => -w - D1[j]); return tab(N, a, b, [D0, D1, D2]); }

/* ---- q29 Chapter review: choosing a two-group test [10.1, 10.4, 11.2, 11.3] ---- */

const TESTS = ['', 'two-sample t test', 'matched-pairs t test', 'chi-square goodness-of-fit test', 'chi-square test of independence'];
const LIST4 = '1 two-sample t test (two independent means; its standard error √(s₁² ÷ n₁ + s₂² ÷ n₂) keeps the two variances separate), 2 matched-pairs t test, 3 chi-square goodness-of-fit test, 4 chi-square test of independence';
const welch = (v1, n1, v2, n2) => Math.floor((v1 + v2) * (v1 + v2) / (v1 * v1 / (n1 - 1) + v2 * v2 / (n2 - 1)));
/* Two-sample summaries (s, n) with s² ÷ n at most 3 decimal places. */
const SN = []; for (const N of [10, 16, 20, 25]) for (const s of [2, 3, 4, 5, 6, 8]) { const v = s * s / N; if (same(rd(v, 3), v)) SN.push([s, N]); }
/* Right-tail t values with area 0.05 (OpenStax t table), df 1 to 30. */
const T05 = [0, 6.314, 2.920, 2.353, 2.132, 2.015, 1.943, 1.895, 1.860, 1.833, 1.812, 1.796, 1.782, 1.771, 1.761, 1.753, 1.746, 1.740, 1.734, 1.729, 1.725, 1.721, 1.717, 1.714, 1.711, 1.708, 1.706, 1.703, 1.701, 1.699, 1.697];
const SH3B = [[50, 30, 20], [40, 40, 20], [60, 25, 15], [25, 50, 25], [45, 35, 20], [70, 20, 10], [30, 45, 25]];
/* The statistic of each test with its working, for the b and d missions. k: 1 two-sample (i, j, x1, x2), 2 matched (A = pairs, B = mean, C = s_d),
   3 goodness of fit (A = share row, B = sample size, C and D = moves), 4 independence on a 2 × 2 table (A = N, B and C = tenths, D = move). */
function core29(P) {
 const { k, A, B, C, D } = P;
 if (k === 1) { const [s1, n1] = SN[A], [s2, n2] = SN[B], v1 = rd(s1 * s1 / n1, 3), v2 = rd(s2 * s2 / n2, 3), se = Math.sqrt(v1 + v2), x1 = C, x2 = D, df = welch(v1, n1, v2, n2);
  return { stat: (x1 - x2) / se, alt: (x1 - x2) / rd(se, 4), s1, n1, s2, n2, x1, x2, df, crit: T05[Math.min(df, 30)], ok: df >= 4 && df <= 30,
   work: `SE = √(${s1 * s1} ÷ ${n1} + ${s2 * s2} ÷ ${n2}) = √(${n(v1)} + ${n(v2)}) = ${n(rd(se, 4))}${isR(se, 4) ? '' : ' (to 4 decimal places)'}, and t = (${n(x1)} − ${n(x2)}) ÷ ${n(rd(se, 4))}` }; }
 if (k === 2) { const N = A, se = C / Math.sqrt(N);
  return { stat: B / se, alt: B / rd(se, 4), N, md: B, sd: C, df: N - 1, crit: T05[N - 1], ok: true, work: `s_d ÷ √n = ${n(C)} ÷ √${N} = ${n(C)} ÷ ${n(Math.sqrt(N))} = ${n(rd(se, 4))}, and t = ${n(B)} ÷ ${n(rd(se, 4))}` }; }
 if (k === 3) { const sh = SH3B[A], N = B, E = sh.map(v => v * N / 100), O = [E[0] + C, E[1] + D, E[2] - C - D], ok = E.every(e => Number.isInteger(e) && e >= 5) && O.every(o => o >= 0) && (C !== 0 || D !== 0);
  return { stat: chi(O, E), alt: chi(O, E), sh, N, E, O, crit: 5.991, ok, work: `The expected counts are ${E.join(', ')}, so χ² = ${O.map((o, i) => `(${o} − ${E[i]})² ÷ ${E[i]}`).join(' + ')}` }; }
 const t = tab(A, [B, 10 - B], [C, 10 - C], [[D, -D], [-D, D]]);
 return { stat: t.x, alt: t.x, t, N: A, crit: 3.841, ok: t.E.flat().every(e => e >= 6) && t.O.flat().every(o => o >= 0) && D !== 0,
  work: `Row totals ${t.Rt.join(' and ')}, column totals ${t.Ct.join(' and ')}, so the expected counts (row total × column total ÷ ${A}) are ${t.E.flat().join(', ')}, and χ² = ${cells(t.O, t.E)}` };
}
function draw29(R, forD) { for (;;) { const k = R.int(1, 4); let p;
 if (k === 1) { const i = R.int(0, SN.length - 1), j = R.int(0, SN.length - 1), x2 = R.int(300, 500) / 10, dd = R.int(5, 50) / 10 * (R.bool() ? 1 : -1); p = { k, A: i, B: j, C: rd(x2 + dd, 1), D: x2 }; }
 else if (k === 2) p = { k, A: R.pick(forD ? [9, 16, 25] : [9, 16, 25, 36]), B: R.int(5, 40) / 10, C: R.pick([1.2, 1.5, 1.8, 2.4, 3, 3.6, 4.2, 4.8, 6]) };
 else if (k === 3) p = { k, A: R.int(0, SH3B.length - 1), B: R.pick([80, 100, 120, 200]), C: R.int(-12, 12), D: R.int(-12, 12) };
 else p = { k, A: R.pick([100, 200]), B: R.int(3, 7), C: R.int(3, 7), D: R.nz(-9, 9) };
 const q = core29(p); if (!q.ok || tie(q.stat, 2) || !same(rd(q.stat, 2), rd(q.alt, 2)) || Math.abs(q.stat) < 0.3 || Math.abs(q.stat) > 9) continue;
 if (forD && Math.abs(q.stat - q.crit) < 0.15) continue;
 if (k === 4 && p.A === 100 && p.B === 4 && p.C === 6 && p.D === 6) continue; return p; } }

/* q29b: four stories set in the greenhouse. */
mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Choosing the test for the greenhouse',
 brief: 'The greenhouse has four kinds of result on file, and the council wants the right test and its statistic for the one on the desk.',
 labels: ['test number', 'statistic (2 d.p.)'], tolerance: 0.005,
 gl: [['test number'], ['statistic (2 d.p.)']]
}, {
 canonical: { k: 3, A: 3, B: 120, C: -9, D: 6 },
 draw: R => draw29(R, false),
 build: P => { const q = core29(P), { k } = P, sr = rd(q.stat, 2), sn = k <= 2 ? 't' : 'χ²', name = TESTS[k];
  const story = [null,
   () => `The greenhouse grew basil with the new feed on ${q.n1} benches and with the old feed on ${q.n2} other benches, chosen at random. New feed: mean height ${n(q.x1)} cm, standard deviation ${q.s1} cm. Old feed: mean ${n(q.x2)} cm, standard deviation ${q.s2} cm. The council asks whether the mean heights differ; take new minus old.`,
   () => `The same ${q.N} benches were measured before and after a shade net was fitted. The ${q.N} differences in height, after minus before, have mean ${n(q.md)} cm and standard deviation ${n(q.sd)} cm. The council asks whether the net changes the height, testing H₀: μd = 0.`,
   () => `A grower says that the blooms on her roses are ${q.sh[0]}% red, ${q.sh[1]}% pink and ${q.sh[2]}% white. A random sample of ${q.N} blooms held ${q.O[0]} red, ${q.O[1]} pink and ${q.O[2]} white. The council asks whether the claim fits.`,
   () => `The greenhouse sowed ${q.N} trays, some with compost mix A and some with mix B, and scored each tray sprouted or failed. Mix A: ${q.t.O[0][0]} sprouted, ${q.t.O[0][1]} failed. Mix B: ${q.t.O[1][0]} sprouted, ${q.t.O[1][1]} failed. The council asks whether failure is independent of the mix.`][k]();
  const why = [null, 'two different groups of benches give two separate sets of measurements, so the two means are independent', 'the same benches are measured twice, so each bench gives one difference and the differences are the data', 'counts in categories are checked against claimed shares', 'counts are sorted two ways at once in a two-way table'][k]; return {
  prompt: `${story} Which test fits? ${LIST4}. Enter the number of the test, then its statistic (${sn}) to 2 decimal places.`,
  answer: [k, sr],
  hints: ['First ask: are the data measurements (such as heights) or counts in categories? Measurements of two groups call for a t test; counts call for chi-square.', 'Measurements: the same units measured twice means matched pairs, different units mean two independent samples. Counts: claimed shares mean goodness of fit, a two-way table means independence.'],
  solution: `This is test ${k}, the ${name}: ${why}. ${q.work}${isR(q.stat, 2) ? ` = ${z2(sr)}` : `, which is ${z2(sr)} to 2 decimal places`}. Enter ${k} and ${z2(sr)}.`,
  guidance: [
   { prompt: `Measurements or counts, and how are the groups formed? Enter the number of the test that fits.`, answer: [k], explanation: `Test ${k}, the ${name}: ${why}.` },
   { prompt: `Work out the statistic ${sn} for this test, to 2 decimal places.`, answer: [sr], explanation: `${q.work}${isR(q.stat, 2) ? ` = ${z2(sr)}` : `, which rounds to ${z2(sr)}`}.` }
  ] }; }
});

/* q29c: three scenarios, each matched to one of the four tests (no two use the same test); no statistic. */
const SCEN = [null,
 ['Fifteen beds got the new feeder and a different fifteen beds got the old feeder, and the council compares the mean fruit weight of the two groups.', 'Tray X holds 20 seedlings and tray Y holds 25 other seedlings, and the council compares their mean heights.'],
 ['Twelve beds were weighed before and after a straw mulch was laid on each, and the council asks whether the mulch changed the mean weight.', 'Nine plots grew bean variety P one year and variety Q the next, and the council asks whether the mean yield differs, using each plot’s two yields.'],
 ['A merchant claims that a bag of beans is 60% round, 30% wrinkled and 10% split, and the council sorts 200 beans from one bag into those three kinds to compare with the claim.', 'A weather service claims that a month has 50% dry days, 30% cloudy days and 20% wet days, and the council tallies the 30 days of one month into those three kinds to compare with the claim.'],
 ['The council sorts 150 plots two ways at once, by soil (sand, clay or loam) and by whether the crop was blighted, and asks whether blight depends on the soil.', 'A table counts 80 beds by light (sun or shade) and by pests (none or some), and the council asks whether pests are independent of the light.']];
const WHY = [null, 'two different groups of plants give two separate sets of measurements, so the two means are independent', 'the same plants or plots are measured twice, so each gives one difference and the differences are the data', 'counts in categories are checked against claimed shares', 'counts are sorted two ways at once in a two-way table'];
mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Three results, three tests',
 brief: 'Three different results are waiting on the council’s desk, and each one needs the test that fits it before any sums are done.',
 labels: ['test for A', 'test for B', 'test for C'], tolerance: 0.01,
 gl: [['test for A'], ['test for B'], ['test for C']]
}, {
 canonical: { k: [3, 1, 4], v: [0, 1, 0] },
 draw: R => { const pool = [1, 2, 3, 4], k = []; while (k.length < 3) k.push(pool.splice(R.int(0, pool.length - 1), 1)[0]); return { k, v: [R.int(0, 1), R.int(0, 1), R.int(0, 1)] }; },
 build: ({ k, v }) => { const txt = k.map((t, i) => SCEN[t][v[i]]), L = ['A', 'B', 'C']; return {
  prompt: `Three results are on the council’s desk. Result A: ${txt[0]} Result B: ${txt[1]} Result C: ${txt[2]} Choose the test for each from this list: ${LIST4}. Enter the test number for A, then for B, then for C. No sums are needed.`,
  answer: k.slice(),
  hints: ['For each result ask: are the data measurements (such as weights or heights) or counts in categories? Measurements of two groups call for a t test; counts call for chi-square.', 'Measurements: the same units measured twice means matched pairs, separate groups mean two independent samples. Counts: one list checked against claimed shares means goodness of fit, a two-way table means independence.'],
  solution: `${k.map((t, i) => `Result ${L[i]} is test ${t}, the ${TESTS[t]}: ${WHY[t]}.`).join(' ')} Enter ${k.join(', ')}.`,
  guidance: k.map((t, i) => ({ prompt: `Result ${L[i]}: ${txt[i]} Which test number fits?`, answer: [t], explanation: `Test ${t}, the ${TESTS[t]}: ${WHY[t]}.` })) }; }
});

/* q29d: the test, its statistic and the decision at α = 0.05 with the critical value printed (right-tailed for t, always for chi-square). */
mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q24', title: 'The test and the verdict',
 brief: 'Four new trial results have come in, and for the one on the desk the council wants the test, its statistic and a verdict.',
 labels: ['test number', 'statistic (2 d.p.)', 'decision (1 reject, 0 do not)'], tolerance: 0.005,
 gl: [['test number'], ['statistic (2 d.p.)'], ['decision (1 reject, 0 do not)']]
}, {
 canonical: { k: 2, A: 16, B: 1.5, C: 3.6 },
 draw: R => draw29(R, true),
 build: P => { const q = core29(P), { k } = P, sr = rd(q.stat, 2), sn = k <= 2 ? 't' : 'χ²', name = TESTS[k], d = q.stat > q.crit ? 1 : 0, cr = t3(q.crit);
  const story = [null,
   () => `The Trial Fields sprayed ${q.n1} plots with a new spray and ${q.n2} other plots with the old spray, chosen at random. New spray: mean yield x̄₁ = ${n(q.x1)} kg, s₁ = ${q.s1} kg. Old spray: x̄₂ = ${n(q.x2)} kg, s₂ = ${q.s2} kg. The council asks whether the new spray raises the mean yield (H₀: μ₁ = μ₂ against Hₐ: μ₁ > μ₂, α = 0.05). The degrees-of-freedom formula gives df = ${q.df} (rounded down), and the t table gives t* = ${cr}, so H₀ is rejected when t is greater than ${cr}.`,
   () => `Each of ${q.N} fruit trees was pruned the old way one year and the new way the next. The ${q.N} differences in fruit yield, new minus old, have mean ${n(q.md)} kg and standard deviation ${n(q.sd)} kg. The council asks whether the new pruning raises the yield (H₀: μd = 0 against Hₐ: μd > 0, α = 0.05). The t table gives t* = ${cr} for df = ${q.N - 1}, so H₀ is rejected when t is greater than ${cr}.`,
   () => `A grader claims that a crate of apples holds ${q.sh[0]}% grade A, ${q.sh[1]}% grade B and ${q.sh[2]}% grade C. A random sample of ${q.N} apples held ${q.O[0]} grade A, ${q.O[1]} grade B and ${q.O[2]} grade C. The council tests H₀: the claim is true, at α = 0.05. For df = 2 the chi-square table gives the critical value ${cr}, so H₀ is rejected when χ² is greater than ${cr}.`,
   () => `The Trial Fields laid out ${q.N} plots, some mulched and some bare, and graded each crop good or poor. Mulched: ${q.t.O[0][0]} good, ${q.t.O[0][1]} poor. Bare: ${q.t.O[1][0]} good, ${q.t.O[1][1]} poor. The council tests H₀: the grade is independent of the mulch, at α = 0.05. For df = 1 the chi-square table gives the critical value ${cr}, so H₀ is rejected when χ² is greater than ${cr}.`][k]();
  const why = [null, 'two different groups of plots give two separate sets of measurements, so the two means are independent', 'the same trees are measured twice, so each tree gives one difference and the differences are the data', 'counts in categories are checked against claimed shares', 'counts are sorted two ways at once in a two-way table'][k];
  const verdict = d ? `${z2(sr)} is greater than ${cr}, so we reject H₀.` : `${z2(sr)} is not greater than ${cr}, so we do not reject H₀.`; return {
  prompt: `${story} Which test fits? ${LIST4}. Enter the number of the test, then its statistic (${sn}) to 2 decimal places, then 1 to reject H₀ or 0 not to reject it.`,
  answer: [k, sr, d],
  hints: ['First ask: are the data measurements (kilograms) or counts in categories? Then ask how the groups were formed: separate groups, the same units twice, claimed shares, or a two-way table.', 'Work out the statistic for that test, then compare it with the critical value printed in the prompt: reject H₀ only if the statistic is greater than it.'],
  solution: `This is test ${k}, the ${name}: ${why}. ${q.work}${isR(q.stat, 2) ? ` = ${z2(sr)}` : `, which is ${z2(sr)} to 2 decimal places`}. ${verdict} Enter ${k}, ${z2(sr)} and ${d}.`,
  guidance: [
   { prompt: `Measurements or counts, and how are the groups formed? Enter the number of the test that fits.`, answer: [k], explanation: `Test ${k}, the ${name}: ${why}.` },
   { prompt: `Work out the statistic ${sn} for this test, to 2 decimal places.`, answer: [sr], explanation: `${q.work}${isR(q.stat, 2) ? ` = ${z2(sr)}` : `, which rounds to ${z2(sr)}`}.` },
   { prompt: `Compare ${sn} = ${z2(sr)} with the critical value ${cr}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: verdict }
  ] }; }
});

/* ---- q30 Scatter plots and the correlation coefficient r [12.2, 12.3] ---- */

/* Sums, the top and the two parts of the bottom of r for any number of points. */
const pr = (x, y) => { const N = x.length, s = f => x.reduce((t, v, i) => t + f(v, y[i]), 0), Sx = s(v => v), Sy = s((v, w) => w), Sxx = s(v => v * v), Syy = s((v, w) => w * w), Sxy = s((v, w) => v * w);
 const top = N * Sxy - Sx * Sy, A = N * Sxx - Sx * Sx, B = N * Syy - Sy * Sy; return { N, Sx, Sy, Sxx, Syy, Sxy, top, A, B, r: top / Math.sqrt(A * B) }; };
const okR = (x, y) => { const q = pr(x, y); return q.A > 0 && q.B > 0 && Math.abs(q.r) >= 0.5 && Math.abs(q.r) <= 0.97 && !tie(q.r, 2); };
const WORD = { 5: 'five', 6: 'six', 7: 'seven' };
const pts = (x, y) => x.map((v, i) => `(${v}, ${y[i]})`).join(', ');
/* A line plus noise: k 0 rising, k 1 falling. */
const mkY = (R, k, x, base, slope, noise) => x.map(v => (k === 0 ? base + slope * v : base - slope * v) + R.int(-noise, noise));
const distinct = (R, cnt, lo, hi) => { const xs = new Set(); while (xs.size < cnt) xs.add(R.int(lo, hi)); return [...xs].sort((u, v) => u - v); };

/* q30b: five records at the Solar Farm control room. k 0: hours charged and lamp hours (rising); k 1: days since cleaning and output (falling). */
mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Logs from the control room',
 brief: 'The control room keeps two small logs, and the engineer wants to know how closely each pair of columns moves together.',
 labels: ['r (2 d.p.)'], tolerance: 0.005,
 gl: [['Σx', 'Σy'], ['Σx²', 'Σy²', 'Σxy'], ['top'], ['nΣx² − (Σx)²', 'nΣy² − (Σy)²'], ['r (2 d.p.)']]
}, {
 canonical: { k: 0, x: [1, 3, 4, 6, 8], y: [4, 8, 7, 11, 12] },
 draw: R => { for (;;) { const k = R.int(0, 1), x = distinct(R, 5, 1, 12), y = mkY(R, k, x, k === 0 ? R.int(2, 8) : 30, R.pick([1, 2]), 3); if (y.some(v => v < 2) || !okR(x, y)) continue; return { k, x, y }; } },
 build: ({ k, x, y }) => { const q = pr(x, y), { Sx, Sy, Sxx, Syy, Sxy, top, A, B, r } = q, rr = rd(r, 2), bt = rd(Math.sqrt(A * B), 4); return {
  prompt: `The Solar Farm control room kept five records, each giving ${k === 0 ? 'the hours x a battery was charged and the hours y the outpost lamps then ran' : 'the days x since a panel was last cleaned and its power output y in MWh'}: ${pts(x, y)}. Enter the correlation coefficient r to 2 decimal places.`,
  answer: [rr],
  hints: ['Tabulate the five sums first: Σx, Σy, Σx², Σy² and Σxy, where Σxy adds x × y for each point.', 'r = (nΣxy − ΣxΣy) ÷ √((nΣx² − (Σx)²)(nΣy² − (Σy)²)), with n the number of points. Its sign shows the direction of the pattern.'],
  solution: `Σx = ${Sx}, Σy = ${Sy}, Σx² = ${Sxx}, Σy² = ${Syy} and Σxy = ${Sxy}. The top is 5 × ${Sxy} − ${Sx} × ${Sy} = ${n(top)}. The bottom is √((5 × ${Sxx} − ${Sx}²)(5 × ${Syy} − ${Sy}²)) = √(${A} × ${B}) = ${n(bt)}. So r = ${n(top)} ÷ ${n(bt)}, which is ${z2(rr)} to 2 decimal places: ${k === 0 ? (r > 0 ? 'longer lamp running goes with more hours of charging' : 'shorter lamp running goes with more hours of charging') : (r > 0 ? 'more output goes with more days since cleaning' : 'less output goes with more days since cleaning')}, a ${Math.abs(r) >= 0.8 ? 'strong' : 'moderate'} ${r > 0 ? 'positive' : 'negative'} linear relationship. Enter ${z2(rr)}.`,
  guidance: [
   { prompt: `What are Σx and Σy, the sums of the x values and of the y values?`, answer: [Sx, Sy], explanation: `${x.join(' + ')} = ${Sx} and ${y.join(' + ')} = ${Sy}.` },
   { prompt: `What are Σx², Σy² and Σxy? Type each number in full, without commas inside it.`, answer: [Sxx, Syy, Sxy], explanation: `Σx² = ${x.map(v => `${v}²`).join(' + ')} = ${Sxx}; Σy² = ${y.map(v => `${v}²`).join(' + ')} = ${Syy}; Σxy = ${x.map((v, i) => `${v} × ${y[i]}`).join(' + ')} = ${Sxy}.` },
   { prompt: `What is the top of the formula, nΣxy − ΣxΣy, with n = 5?`, answer: [top], explanation: `5 × ${Sxy} − ${Sx} × ${Sy} = ${5 * Sxy} − ${Sx * Sy} = ${n(top)}.` },
   { prompt: `What are nΣx² − (Σx)² and nΣy² − (Σy)²? Type each number in full, without commas inside it.`, answer: [A, B], explanation: `5 × ${Sxx} − ${Sx}² = ${5 * Sxx} − ${Sx * Sx} = ${A}, and 5 × ${Syy} − ${Sy}² = ${5 * Syy} − ${Sy * Sy} = ${B}.` },
   { prompt: `What is r = ${n(top)} ÷ √(${A} × ${B}), to 2 decimal places?`, answer: [rr], explanation: `${A} × ${B} = ${A * B}, whose square root is ${n(bt)}, and ${n(top)} ÷ ${n(bt)} ${isR(r, 2) ? `= ${z2(rr)}` : `rounds to ${z2(rr)}`}.` }
  ] }; }
});

/* q30c: six days; k 0 irradiance (rising), k 1 cloud cover (falling). Asks r and the direction (1 rise, 2 fall). */
mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Cloud cover and the grid',
 brief: 'The grid engineer has six days of weather and output, and wants to know how the output follows the weather and in which direction.',
 labels: ['r (2 d.p.)', 'direction (1 rise, 2 fall)'], tolerance: 0.005,
 gl: [['Σx', 'Σy', 'Σx²', 'Σy²', 'Σxy'], ['top', 'nΣx² − (Σx)²', 'nΣy² − (Σy)²'], ['r (2 d.p.)', 'direction (1 rise, 2 fall)']]
}, {
 canonical: { k: 1, x: [1, 2, 4, 6, 7, 9], y: [26, 28, 22, 23, 17, 16] },
 draw: R => { for (;;) { const k = R.int(0, 1), x = distinct(R, 6, 1, 10), y = mkY(R, k, x, k === 0 ? R.int(2, 8) : 30, R.pick([1, 2]), 3); if (y.some(v => v < 2) || !okR(x, y)) continue; return { k, x, y }; } },
 build: ({ k, x, y }) => { const q = pr(x, y), { Sx, Sy, Sxx, Syy, Sxy, top, A, B, r } = q, rr = rd(r, 2), bt = rd(Math.sqrt(A * B), 4), dir = r > 0 ? 1 : 2; return {
  prompt: `A grid engineer at the Solar Farm logged six days, each with ${k === 0 ? 'the sunshine x in hundreds of watts per square metre' : 'the cloud cover x in tenths of the sky'} and the power output y in MWh: ${pts(x, y)}. Enter the correlation coefficient r to 2 decimal places, then enter 1 if the points tend to rise from left to right or 2 if they tend to fall.`,
  answer: [rr, dir],
  hints: ['Tabulate the sums first: Σx, Σy, Σx², Σy² and Σxy, where Σxy adds x × y for each point.', 'r = (nΣxy − ΣxΣy) ÷ √((nΣx² − (Σx)²)(nΣy² − (Σy)²)), with n the number of points. A positive r means the points rise from left to right, a negative r that they fall.'],
  solution: `With n = 6: Σx = ${Sx}, Σy = ${Sy}, Σx² = ${Sxx}, Σy² = ${Syy} and Σxy = ${Sxy}. The top is 6 × ${Sxy} − ${Sx} × ${Sy} = ${n(top)}. The bottom is √((6 × ${Sxx} − ${Sx}²)(6 × ${Syy} − ${Sy}²)) = √(${A} × ${B}) = ${n(bt)}. So r = ${n(top)} ÷ ${n(bt)}, which is ${z2(rr)} to 2 decimal places. The sign is ${r > 0 ? 'positive' : 'negative'}, so the points tend to ${r > 0 ? 'rise' : 'fall'}. Enter ${z2(rr)} and ${dir}.`,
  guidance: [
   { prompt: `What are Σx, Σy, Σx², Σy² and Σxy? Type each number in full, without commas inside it.`, answer: [Sx, Sy, Sxx, Syy, Sxy], explanation: `Σx = ${x.join(' + ')} = ${Sx}; Σy = ${y.join(' + ')} = ${Sy}; Σx² = ${x.map(v => `${v}²`).join(' + ')} = ${Sxx}; Σy² = ${y.map(v => `${v}²`).join(' + ')} = ${Syy}; Σxy = ${x.map((v, i) => `${v} × ${y[i]}`).join(' + ')} = ${Sxy}.` },
   { prompt: `With n = 6, what are the top nΣxy − ΣxΣy, and the two parts of the bottom, nΣx² − (Σx)² and nΣy² − (Σy)²? Type each number in full, without commas inside it.`, answer: [top, A, B], explanation: `6 × ${Sxy} − ${Sx} × ${Sy} = ${6 * Sxy} − ${Sx * Sy} = ${n(top)}; 6 × ${Sxx} − ${Sx}² = ${6 * Sxx} − ${Sx * Sx} = ${A}; 6 × ${Syy} − ${Sy}² = ${6 * Syy} − ${Sy * Sy} = ${B}.` },
   { prompt: `What is r = ${n(top)} ÷ √(${A} × ${B}), to 2 decimal places, and do the points tend to rise (1) or fall (2)?`, answer: [rr, dir], explanation: `${A} × ${B} = ${A * B}, whose square root is ${n(bt)}, and ${n(top)} ÷ ${n(bt)} ${isR(r, 2) ? `= ${z2(rr)}` : `rounds to ${z2(rr)}`}. The sign of r is ${r > 0 ? 'positive' : 'negative'}, so the points tend to ${r > 0 ? 'rise' : 'fall'}: enter ${dir}.` }
  ] }; }
});

/* q30d: seven weeks of larger numbers (x a multiple of 5 from 10 to 70, y up to about 150). */
mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', title: 'Panel area and power',
 brief: 'Seven weeks of larger readings are in, and the engineer wants to know how straight the pattern is.',
 labels: ['r (2 d.p.)'], tolerance: 0.005,
 gl: [['Σx', 'Σy'], ['Σx²', 'Σy²', 'Σxy'], ['top'], ['nΣx² − (Σx)²', 'nΣy² − (Σy)²'], ['r (2 d.p.)']]
}, {
 canonical: { k: 0, x: [10, 20, 25, 35, 45, 55, 70], y: [44, 62, 75, 83, 112, 118, 150] },
 draw: R => { for (;;) { const k = R.int(0, 1), u = distinct(R, 7, 2, 14), x = u.map(v => 5 * v), y = mkY(R, k, u, k === 0 ? R.int(10, 30) : 130, R.int(4, 6), 12); if (y.some(v => v < 10) || !okR(x, y)) continue; return { k, x, y }; } },
 build: ({ k, x, y }) => { const q = pr(x, y), { Sx, Sy, Sxx, Syy, Sxy, top, A, B, r } = q, rr = rd(r, 2), bt = rd(Math.sqrt(A * B), 4); return {
  prompt: `Over seven weeks the Solar Farm logged ${k === 0 ? 'the area x in square metres of panels in service' : 'the dust x in milligrams per square metre on its panels'} and the power y in kWh they produced: ${pts(x, y)}. Enter the correlation coefficient r to 2 decimal places.`,
  answer: [rr],
  hints: ['Tabulate the five sums first: Σx, Σy, Σx², Σy² and Σxy, where Σxy adds x × y for each point. With larger numbers, keep each column tidy and check each sum twice.', 'r = (nΣxy − ΣxΣy) ÷ √((nΣx² − (Σx)²)(nΣy² − (Σy)²)), with n the number of points. Its sign shows the direction of the pattern.'],
  solution: `With n = 7: Σx = ${Sx}, Σy = ${Sy}, Σx² = ${Sxx}, Σy² = ${Syy} and Σxy = ${Sxy}. The top is 7 × ${Sxy} − ${Sx} × ${Sy} = ${n(top)}. The bottom is √((7 × ${Sxx} − ${Sx}²)(7 × ${Syy} − ${Sy}²)) = √(${A} × ${B}) = ${n(bt)}. So r = ${n(top)} ÷ ${n(bt)}, which is ${z2(rr)} to 2 decimal places: a ${Math.abs(r) >= 0.8 ? 'strong' : 'moderate'} ${r > 0 ? 'positive' : 'negative'} linear relationship. Enter ${z2(rr)}.`,
  guidance: [
   { prompt: `What are Σx and Σy, the sums of the x values and of the y values?`, answer: [Sx, Sy], explanation: `${x.join(' + ')} = ${Sx} and ${y.join(' + ')} = ${Sy}.` },
   { prompt: `What are Σx², Σy² and Σxy? Type each number in full, without commas inside it.`, answer: [Sxx, Syy, Sxy], explanation: `Σx² = ${x.map(v => `${v}²`).join(' + ')} = ${Sxx}; Σy² = ${y.map(v => `${v}²`).join(' + ')} = ${Syy}; Σxy = ${x.map((v, i) => `${v} × ${y[i]}`).join(' + ')} = ${Sxy}.` },
   { prompt: `What is the top of the formula, nΣxy − ΣxΣy, with n = 7? Type it without commas.`, answer: [top], explanation: `7 × ${Sxy} − ${Sx} × ${Sy} = ${7 * Sxy} − ${Sx * Sy} = ${n(top)}.` },
   { prompt: `What are nΣx² − (Σx)² and nΣy² − (Σy)², with n = 7? Type each number in full, without commas inside it.`, answer: [A, B], explanation: `7 × ${Sxx} − ${Sx}² = ${7 * Sxx} − ${Sx * Sx} = ${A}, and 7 × ${Syy} − ${Sy}² = ${7 * Syy} − ${Sy * Sy} = ${B}.` },
   { prompt: `What is r = ${n(top)} ÷ √(${A} × ${B}), to 2 decimal places?`, answer: [rr], explanation: `${A} × ${B} = ${A * B}, whose square root is ${n(bt)}, and ${n(top)} ÷ ${n(bt)} ${isR(r, 2) ? `= ${z2(rr)}` : `rounds to ${z2(rr)}`}.` }
  ] }; }
});

})();
