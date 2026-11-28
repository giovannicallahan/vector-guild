/* Data and inference practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p3.js. */
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
/* Fixed decimals with a typographic minus; rd rounds to a number; tie: x sits on a rounding tie at d decimals (such draws are
   rejected); eq: '= 5.88' when x has at most d decimals, '≈ 5.88' when it was rounded; list: "14, 18, 11". */
const fx = (x, d) => { const k = Math.pow(10, d), v = Math.round(Math.abs(x) * k + 1e-9) / k; return (x < 0 && v > 0 ? '−' : '') + v.toFixed(d); };
const rd = (x, d) => Number(fx(x, d).replace('−', '-'));
const tie = (x, d) => { const v = Math.abs(x) * Math.pow(10, d); return Math.abs(v - Math.floor(v) - 0.5) < 1e-6; };
const eq = (x, d) => { const v = x * Math.pow(10, d); return Math.abs(v - Math.round(v)) < 1e-7 ? '= ' + n(x) : '≈ ' + fx(x, d); };
const list = xs => xs.map(n).join(', ');
const sum = xs => xs.reduce((s, x) => s + x, 0);
/* Critical values as printed in the learn missions: z* for 90, 95 and 99% (thousandths in ZT for exact sums) and rows of the t table. */
const ZS = { 90: '1.645', 95: '1.96', 99: '2.576' }, ZT = { 90: 1645, 95: 1960, 99: 2576 };
const ZLINE = 'Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576.';
const TT = {
 3: ['2.353', '3.182', '5.841'], 4: ['2.132', '2.776', '4.604'], 5: ['2.015', '2.571', '4.032'], 6: ['1.943', '2.447', '3.707'],
 7: ['1.895', '2.365', '3.499'], 8: ['1.860', '2.306', '3.355'], 9: ['1.833', '2.262', '3.250'], 10: ['1.812', '2.228', '3.169'],
 11: ['1.796', '2.201', '3.106'], 12: ['1.782', '2.179', '3.055'], 13: ['1.771', '2.160', '3.012'], 14: ['1.761', '2.145', '2.977'],
 15: ['1.753', '2.131', '2.947'], 16: ['1.746', '2.120', '2.921'], 17: ['1.740', '2.110', '2.898'], 18: ['1.734', '2.101', '2.878'],
 19: ['1.729', '2.093', '2.861'], 20: ['1.725', '2.086', '2.845'], 21: ['1.721', '2.080', '2.831']
};
const COL = { 90: 0, 95: 1, 99: 2 };
const trow = df => `df ${df}: 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}`;
const tstar = (df, L) => TT[df][COL[L]];
/* σ ÷ √n has at most 2 decimals when σ × 100 is a multiple of √n. */
const tidySE = (sig, r) => (sig * 100) % r === 0;
const ROOTS = [4, 5, 6, 8, 10];
/* q12c confidence-level pairs: lv is only an index into this list. */
const LV = [[90, 95], [95, 99], [90, 99]];
/* Mean, sum of squared distances, s and s ÷ √n of a small data set. */
const summ = d => { const k = d.length, tot = sum(d), m = tot / k, dev = d.map(x => x - m), ss = sum(dev.map(v => v * v)), s = Math.sqrt(ss / (k - 1)), se = s / Math.sqrt(k); return { k, tot, m, dev, ss, s, se }; };
/* s and s ÷ √n are safe to ask for: no rounding ties, and dividing the rounded s by √n keeps the second decimal of the standard error. */
const sOK = (s, se, k) => !tie(s, 2) && !tie(se, 2) && rd(rd(s, 2) / Math.sqrt(k), 2) === rd(se, 2);

/* ---- q11 Chapter review: summarising a survey [2.7, 7.1] ---- */

mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'Wind on the lookout posts',
 brief: 'The survey team has read the wind at a few lookout posts, and the beacon planners want the readings boiled down to three numbers.',
 labels: ['sample mean x̄ (m/s)', 's (m/s)', 'standard error (m/s)'], tolerance: 0.005,
 gl: [['sum of readings (m/s)', 'sample mean x̄ (m/s)'], ['sum of squared distances'], ['s (m/s)'], ['standard error (m/s)']]
}, {
 /* Five to seven readings with a whole-number mean, as in the learn mission but with other ranges. Draws where s or s ÷ √n lands on a rounding
    tie, or where dividing the rounded s by √n would change the second decimal, are redrawn. Never the readings of the q11 worked example (8, 12, 10, 9, 11). */
 canonical: { d: [22, 31, 25, 18, 27, 27] },
 draw: R => { for (;;) { const k = R.int(5, 7), m = R.int(10, 40), dev = []; let tot = 0;
  for (let i = 0; i < k - 1; i++) { const v = R.int(-8, 8); dev.push(v); tot += v; }
  if (Math.abs(tot) > 8) continue; dev.push(-tot); const d = dev.map(v => m + v), c = summ(d);
  if (c.ss === 0 || !sOK(c.s, c.se, k) || d.join() === '8,12,10,9,11') continue; return { d }; } },
 build: ({ d }) => { const { k, tot, m, dev, ss, s, se } = summ(d), ds = dev.map(v => v === 0 ? '0' : plus(v)), devText = ds.slice(0, -1).join(', ') + ' and ' + ds[ds.length - 1]; return {
  prompt: `The survey team read the wind speed, in metres per second, at ${n(k)} lookout posts chosen at random: ${list(d)}. Enter the sample mean x̄ in metres per second, then the sample standard deviation s to 2 decimal places, then the estimated standard error of the mean, s ÷ √n, to 2 decimal places.`,
  answer: [m, rd(s, 2), rd(se, 2)],
  hints: ['Add the readings and divide by how many there are for the mean. Then find how far each reading lies from that mean.', 'Square the distances, add them, divide by n − 1 and take the square root to get s. The standard error is s divided by the square root of the number of readings.'],
  solution: `The readings add up to ${n(tot)}, so x̄ = ${n(tot)} ÷ ${n(k)} = ${n(m)} m/s. The distances from the mean are ${devText}, and their squares add up to ${n(ss)}. Then s = √(${n(ss)} ÷ ${n(k - 1)}) ${eq(s, 2)} m/s. The standard error is s ÷ √${n(k)} ${eq(se, 2)} m/s.`,
  guidance: [
   { prompt: `Add the ${n(k)} readings. What is their sum, and what is the sample mean x̄?`, answer: [tot, m], explanation: `The sum is ${n(tot)}, and ${n(tot)} ÷ ${n(k)} = ${n(m)}, so x̄ = ${n(m)} m/s.` },
   { prompt: `Subtract x̄ = ${n(m)} from each reading, square each result and add the squares. What is the total?`, answer: [ss], explanation: `The distances are ${devText}. Their squares add up to ${n(ss)}.` },
   { prompt: `Divide ${n(ss)} by n − 1 = ${n(k - 1)} and take the square root. What is s, to 2 decimal places?`, answer: [rd(s, 2)], explanation: `${n(ss)} ÷ ${n(k - 1)} ${eq(ss / (k - 1), 4)}, and its square root is s ${eq(s, 2)} m/s.` },
   { prompt: `Divide s by √${n(k)}. What is the standard error, to 2 decimal places?`, answer: [rd(se, 2)], explanation: `√${n(k)} ${eq(Math.sqrt(k), 4)}, so s ÷ √${n(k)} ${eq(se, 2)} m/s.` }
  ] }; }
});

mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The lost snow-pit readings',
 brief: 'A field computer at Survey Camp crashed with the snow-pit readings on it, and only two running totals survived.',
 labels: ['sample mean x̄ (mm)', 's (mm)', 'standard error (mm)'], tolerance: 0.005,
 gl: [['sample mean x̄ (mm)'], ['s (mm)'], ['standard error (mm)']]
}, {
 /* Mean a whole number, sum of squared distances a whole number from 12 to 160. Rounding ties and a rounded-s change of the standard error are redrawn. */
 canonical: { k: 6, m: 42, ss: 70 },
 draw: R => { for (;;) { const k = R.int(5, 8), m = R.int(20, 90), ss = R.int(12, 160), s = Math.sqrt(ss / (k - 1)), se = s / Math.sqrt(k);
  if (!sOK(s, se, k)) continue; return { k, m, ss }; } },
 build: ({ k, m, ss }) => { const tot = k * m, s = Math.sqrt(ss / (k - 1)), se = s / Math.sqrt(k); return {
  prompt: `A snow survey took ${n(k)} snow-pit samples chosen at random and measured the water held in each, in millimetres. The field computer then lost the individual readings, but two totals survived: the ${n(k)} readings add up to ${n(tot)} mm, and the squares of their distances from the sample mean add up to ${n(ss)}. Mira needs the usual three-number summary. Enter the sample mean x̄ in millimetres, then the sample standard deviation s to 2 decimal places, then the estimated standard error of the mean, s ÷ √n, to 2 decimal places.`,
  answer: [m, rd(s, 2), rd(se, 2)],
  hints: ['The sample mean is the total of the readings divided by how many readings there are.', 'The sum of squared distances is already worked out: divide it by n − 1 and take the square root to get s. The standard error is s divided by the square root of the number of readings.'],
  solution: `x̄ = ${n(tot)} ÷ ${n(k)} = ${n(m)} mm. The sum of squared distances is ${n(ss)}, so s = √(${n(ss)} ÷ ${n(k - 1)}) ${eq(s, 2)} mm. The standard error is s ÷ √${n(k)} ${eq(se, 2)} mm.`,
  guidance: [
   { prompt: `Divide the total ${n(tot)} mm by the number of samples, ${n(k)}. What is x̄?`, answer: [m], explanation: `${n(tot)} ÷ ${n(k)} = ${n(m)}, so x̄ = ${n(m)} mm.` },
   { prompt: `Divide the sum of squared distances, ${n(ss)}, by n − 1 = ${n(k - 1)} and take the square root. What is s, to 2 decimal places?`, answer: [rd(s, 2)], explanation: `${n(ss)} ÷ ${n(k - 1)} ${eq(ss / (k - 1), 4)}, and its square root is s ${eq(s, 2)} mm.` },
   { prompt: `Divide s by √${n(k)}. What is the standard error, to 2 decimal places?`, answer: [rd(se, 2)], explanation: `√${n(k)} ${eq(Math.sqrt(k), 4)}, so s ÷ √${n(k)} ${eq(se, 2)} mm.` }
  ] }; }
});

mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q10', title: 'Thin ice, bigger survey',
 brief: 'The ice-core survey is too uncertain to plan a landing pad on, so the camp wants the summary and the size of a better survey.',
 labels: ['sample mean x̄ (cm)', 's (cm)', 'standard error (cm)', 'cores needed'], tolerance: 0.005,
 gl: [['sum of readings (cm)', 'sample mean x̄ (cm)'], ['sum of squared distances'], ['s (cm)', 'standard error (cm)'], ['cores needed']]
}, {
 /* Seven or eight readings to one decimal, built from a whole number of tenths for the mean and whole-tenth distances that add to 0.
    Then the sample size that halves the standard error (4n, from q10). Rounding ties and a rounded-s change of the standard error are redrawn. */
 canonical: { k: 7, mt: 342, dv: [-8, 5, -3, 9, 2, -6, 1] },
 draw: R => { for (;;) { const k = R.int(7, 8), mt = R.int(150, 600), dv = []; let tot = 0;
  for (let i = 0; i < k - 1; i++) { const v = R.int(-9, 9); dv.push(v); tot += v; }
  if (Math.abs(tot) > 10) continue; dv.push(-tot); const sq = sum(dv.map(v => v * v)), s = Math.sqrt(sq / (k - 1)) / 10, se = s / Math.sqrt(k);
  if (sq === 0 || !sOK(s, se, k)) continue; return { k, mt, dv }; } },
 build: ({ k, mt, dv }) => { const d = dv.map(v => (mt + v) / 10), m = mt / 10, tot = Math.round(sum(d) * 10) / 10, sq = sum(dv.map(v => v * v)), ss = sq / 100, s = Math.sqrt(ss / (k - 1)), se = s / Math.sqrt(k), more = 4 * k; return {
  prompt: `The survey team drilled ${n(k)} ice cores chosen at random and measured the thickness of the ice in centimetres: ${list(d)}. Enter the sample mean x̄ in centimetres, then the sample standard deviation s to 2 decimal places, then the estimated standard error of the mean, s ÷ √n, to 2 decimal places. A second survey will take more cores from the same ice, and its single readings will vary as much as these do. Enter how many cores in all that second survey needs for the standard error of its mean to be half of this one.`,
  answer: [m, rd(s, 2), rd(se, 2), more],
  hints: ['Add the readings and divide by how many there are for the mean. Square each reading’s distance from the mean, add them, divide by n − 1 and take the square root to get s.', 'The standard error is s ÷ √n. To halve it, √n has to double, so n must grow by a fixed factor: work out which.'],
  solution: `The readings add up to ${n(tot)}, so x̄ = ${n(tot)} ÷ ${n(k)} = ${n(m)} cm. The squares of the distances from the mean add up to ${n(ss)}, so s = √(${n(ss)} ÷ ${n(k - 1)}) ${eq(s, 2)} cm, and the standard error is s ÷ √${n(k)} ${eq(se, 2)} cm. Halving the standard error means doubling √n, which makes n four times as big: 4 × ${n(k)} = ${n(more)} cores.`,
  guidance: [
   { prompt: `Add the ${n(k)} readings. What is their sum, and what is the sample mean x̄?`, answer: [tot, m], explanation: `The sum is ${n(tot)}, and ${n(tot)} ÷ ${n(k)} = ${n(m)}, so x̄ = ${n(m)} cm.` },
   { prompt: `Subtract x̄ = ${n(m)} from each reading, square each result and add the squares. What is the total?`, answer: [ss], explanation: `The squares of the distances add up to ${n(ss)}.` },
   { prompt: `Divide ${n(ss)} by n − 1 = ${n(k - 1)} and take the square root for s, then divide s by √${n(k)}. What are s and the standard error, to 2 decimal places?`, answer: [rd(s, 2), rd(se, 2)], explanation: `${n(ss)} ÷ ${n(k - 1)} ${eq(ss / (k - 1), 4)}, so s ${eq(s, 2)} cm. Then s ÷ √${n(k)} ${eq(se, 2)} cm.` },
   { prompt: `The standard error is s ÷ √n. To halve it, √n must double. n must grow by a factor of 2 × 2 = 4. How many cores is that in all?`, answer: [more], explanation: `Doubling √n means multiplying n by 2 × 2 = 4, so the second survey needs 4 × ${n(k)} = ${n(more)} cores.` }
  ] }; }
});

/* ---- q12 Point estimate, confidence level and margin of error (σ known) [8.1] ---- */

mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'Nitrate in the wells',
 brief: 'The outpost’s wells are tested every season, and the council wants the lab’s nitrate figure with its margin of error.',
 labels: ['standard error (mg/L)', 'margin of error (mg/L)'], tolerance: 0.005,
 gl: [['square root of n', 'standard error (mg/L)'], ['margin of error (mg/L)']]
}, {
 /* σ ÷ √n with n a square (16, 25, 36, 64, 100) and at most 2 decimals; the margin z* × σ ÷ √n is never a rounding tie.
    Never the q12 worked example (σ = 10, n = 25, 90%). */
 canonical: { L: 99, sig: 14, r: 4, xb: 31.6 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), sig: R.int(4, 30), r: R.pick(ROOTS), xb: R.int(100, 600) / 10 };
  if (!tidySE(p.sig, p.r) || tie(Number(ZS[p.L]) * p.sig / p.r, 2) || (p.sig === 10 && p.r === 5 && p.L === 90)) continue; return p; } },
 build: ({ L, sig, r, xb }) => { const N = r * r, se = sig / r, z = ZS[L], m = Number(z) * se; return {
  prompt: `The assay lab tests the nitrate level of the outpost’s well water, in milligrams per litre (mg/L). Records from the same wells give a standard deviation of σ = ${n(sig)} mg/L. This season ${n(N)} water samples were drawn at random, and their mean, x̄ = ${n(xb)} mg/L, is the lab’s point estimate of the mean nitrate level in the wells. ${ZLINE} Enter the standard error σ ÷ √n, then the margin of error for ${L}% confidence, to 2 decimal places.`,
  answer: [se, rd(m, 2)],
  hints: ['The standard error is σ divided by the square root of the number of samples.', 'The margin of error is the critical value z* for the chosen confidence level times the standard error.'],
  solution: `√${n(N)} = ${n(r)}, so the standard error is ${n(sig)} ÷ ${n(r)} = ${n(se)} mg/L. At ${L}% confidence z* = ${z}, so the margin of error is ${z} × ${n(se)} ${eq(m, 2)} mg/L. The lab can say, with ${L}% confidence, that the wells’ mean lies within ${fx(m, 2)} mg/L of ${n(xb)} mg/L.`,
  guidance: [
   { prompt: `What is √${n(N)}, and what is the standard error σ ÷ √n?`, answer: [r, se], explanation: `${n(r)} × ${n(r)} = ${n(N)}, so √${n(N)} = ${n(r)}, and ${n(sig)} ÷ ${n(r)} = ${n(se)} mg/L.` },
   { prompt: `Read z* for ${L}% confidence from the list. What is the margin of error z* × ${n(se)}, to 2 decimal places?`, answer: [rd(m, 2)], explanation: `z* = ${z} for ${L}%, and ${z} × ${n(se)} ${eq(m, 2)} mg/L.` }
  ] }; }
});

mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'What extra confidence costs',
 brief: 'The farm council wants the lab’s sugar figure for the beet crop at two confidence levels, to see what the extra certainty costs in precision.',
 labels: ['lower-level margin (g/kg)', 'higher-level margin (g/kg)', 'extra width (g/kg)'], tolerance: 0.005,
 gl: [['standard error (g/kg)'], ['lower-level margin (g/kg)', 'higher-level margin (g/kg)'], ['extra width (g/kg)']]
}, {
 /* Two levels (90 and 95, 95 and 99, or 90 and 99), σ ÷ √n with n a square and at most 2 decimals. Neither margin is a rounding tie, and the
    difference of the rounded margins equals the rounded difference. Never the q12 worked example (σ = 10, n = 25, 90%). */
 canonical: { lv: 1, sig: 24, r: 6, xb: 62.5 },
 draw: R => { for (;;) { const p = { lv: R.int(0, 2), sig: R.int(6, 40), r: R.pick(ROOTS), xb: R.int(300, 900) / 10 }, [a, b] = LV[p.lv];
  const se = p.sig / p.r, ma = Number(ZS[a]) * se, mb = Number(ZS[b]) * se;
  if (!tidySE(p.sig, p.r) || tie(ma, 2) || tie(mb, 2) || rd(mb - ma, 2) !== rd(rd(mb, 2) - rd(ma, 2), 2) || (p.sig === 10 && p.r === 5 && a === 90)) continue; return p; } },
 build: ({ lv, sig, r, xb }) => { const [a, b] = LV[lv], N = r * r, se = sig / r, za = ZS[a], zb = ZS[b], ma = Number(za) * se, mb = Number(zb) * se, ma2 = rd(ma, 2), mb2 = rd(mb, 2), diff = rd(mb2 - ma2, 2); return {
  prompt: `The farm council asks the lab to quote its estimate of the beet crop’s mean sugar content at two confidence levels, ${a}% and ${b}%, to see what the extra confidence costs. Records give σ = ${n(sig)} g/kg for the sugar content of single beets. ${n(N)} beets were tested at random, and their mean x̄ = ${n(xb)} g/kg is the point estimate. ${ZLINE} Enter the margin of error at ${a}% confidence, then at ${b}% confidence, each to 2 decimal places, then how much larger the ${b}% margin is than the ${a}% margin.`,
  answer: [ma2, mb2, diff],
  hints: ['Work out the standard error σ ÷ √n once: both margins use it. Each margin is the critical value z* for its level times that standard error.', 'The last answer is one margin minus the other. A higher confidence level has a larger z*, so its margin is the bigger one.'],
  solution: `√${n(N)} = ${n(r)}, so the standard error is ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg. At ${a}%, z* = ${za} and the margin is ${za} × ${n(se)} ${eq(ma, 2)} g/kg. At ${b}%, z* = ${zb} and the margin is ${zb} × ${n(se)} ${eq(mb, 2)} g/kg. The ${b}% margin is ${fx(mb2, 2)} − ${fx(ma2, 2)} = ${n(diff)} g/kg larger: more confidence gives a wider margin.`,
  guidance: [
   { prompt: `What is the standard error σ ÷ √n = ${n(sig)} ÷ √${n(N)}, to 2 decimal places?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg.` },
   { prompt: `Read z* for ${a}% and for ${b}% from the list. What are the two margins of error z* × ${n(se)}, to 2 decimal places?`, answer: [ma2, mb2], explanation: `${za} × ${n(se)} ${eq(ma, 2)} g/kg and ${zb} × ${n(se)} ${eq(mb, 2)} g/kg.` },
   { prompt: `Subtract the smaller margin from the larger. How much larger is the ${b}% margin, to 2 decimal places?`, answer: [diff], explanation: `${fx(mb2, 2)} − ${fx(ma2, 2)} = ${n(diff)} g/kg.` }
  ] }; }
});

mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q10', title: 'Halving the fuel margin',
 brief: 'The lab’s margin on the sulphur in a new fuel is too loose, and Mira wants to know what it takes to cut it in half.',
 labels: ['margin of error (g/kg)', 'samples needed', 'new margin of error (g/kg)'], tolerance: 0.005,
 gl: [['standard error (g/kg)'], ['margin of error (g/kg)'], ['samples needed', 'new margin of error (g/kg)']]
}, {
 /* σ with one decimal (5.0 to 40.0) and a sample size from 30 to 95 that is not a square, so the standard error needs rounding. The standard error,
    the margin and half the margin are never rounding ties, and rounding the standard error to 4 decimals or the margin to 2 does not move the answers.
    Never the q12 worked example (σ = 10, n = 25, 90%): n is never a square. */
 canonical: { L: 95, s10: 125, N: 40 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), s10: R.int(50, 400), N: R.int(30, 95) }; if (Number.isInteger(Math.sqrt(p.N))) continue;
  const se = p.s10 / 10 / Math.sqrt(p.N), z = Number(ZS[p.L]), m = z * se;
  if (tie(se, 2) || tie(m, 2) || tie(m / 2, 2) || rd(z * rd(se, 4), 2) !== rd(m, 2) || rd(rd(m, 2) / 2, 2) !== rd(m / 2, 2)) continue; return p; } },
 build: ({ L, s10, N }) => { const sig = s10 / 10, se = sig / Math.sqrt(N), z = ZS[L], m = Number(z) * se, m2 = rd(m, 2), N4 = 4 * N, h = rd(m / 2, 2); return {
  prompt: `The assay lab tests the sulphur content of a new fuel, in grams per kilogram (g/kg). Records give σ = ${n(sig)} g/kg, and ${n(N)} samples were tested. ${ZLINE} Enter the margin of error for ${L}% confidence, to 2 decimal places. Mira wants that margin cut to half at the same confidence level, and the standard error depends on √n: enter the number of samples needed, then the new margin of error, to 2 decimal places.`,
  answer: [m2, N4, h],
  hints: ['The margin of error is z* × σ ÷ √n. Keep 4 decimal places in σ ÷ √n until the end.', 'Halving the margin means halving σ ÷ √n, so √n must double. Think about what that does to n, and what half of the first margin is.'],
  solution: `σ ÷ √${n(N)} = ${n(sig)} ÷ ${fx(Math.sqrt(N), 4)} ${eq(se, 4)} g/kg, so the margin of error is ${z} × ${fx(se, 4)} ${eq(m, 2)} g/kg. Halving it means doubling √n, which makes n four times as big: 4 × ${n(N)} = ${n(N4)} samples. The new margin is half of ${fx(m2, 2)}, which is ${fx(h, 2)} g/kg.`,
  guidance: [
   { prompt: `What is the standard error σ ÷ √n = ${n(sig)} ÷ √${n(N)}, to 2 decimal places?`, answer: [rd(se, 2)], explanation: `√${n(N)} ${eq(Math.sqrt(N), 4)}, and ${n(sig)} ÷ ${fx(Math.sqrt(N), 4)} ${eq(se, 2)} g/kg.` },
   { prompt: `Read z* for ${L}% confidence from the list. What is the margin of error z* × σ ÷ √n, to 2 decimal places?`, answer: [m2], explanation: `${z} × ${fx(se, 4)} ${eq(m, 2)} g/kg.` },
   { prompt: `To halve the margin, √n must double. How many samples is that, and what is the new margin, to 2 decimal places?`, answer: [N4, h], explanation: `Doubling √n means multiplying n by 4, so 4 × ${n(N)} = ${n(N4)} samples. The new margin is ${fx(m2, 2)} ÷ 2 = ${fx(h, 2)} g/kg.` }
  ] }; }
});

/* ---- q13 The confidence interval for a mean, and the sample size for a target margin [8.1] ---- */

/* Interval x̄ ± z* σ ÷ √n and the smallest n with z* σ ÷ E ... (z* σ ÷ E)² ≤ n, from thousandths of z* so the comparison is exact. */
const core13 = ({ L, sig, r, xb, e10 }) => { const N = r * r, se = sig / r, z = ZS[L], m = Number(z) * se, m2 = rd(m, 2), E = e10 / 10,
 num = Math.pow(ZT[L] * sig, 2), den = Math.pow(100 * e10, 2), q = num / den, need = Math.floor((num + den - 1) / den);
 return { N, se, z, m, m2, lo: rd(xb - m, 2), hi: rd(xb + m, 2), E, q, need, whole: num % den === 0 }; };
/* The same draw rules as the learn mission: the margin and (z* σ ÷ E)² are never rounding ties, (z* σ ÷ E)² is never just above a whole number,
   the new n is larger than the sample's and below 1000, and the target margin is smaller than the current one. */
const ok13 = p => { const c = core13(p); return tidySE(p.sig, p.r) && !tie(c.m, 2) && !tie(c.q, 2) && (c.whole || c.q - Math.floor(c.q) >= 0.005) && c.E < c.m && c.need > c.N && c.need < 1000; };
const how13 = c => c.whole ? `= ${n(c.q)}, a whole number, so ${n(c.need)} are just enough` : `${eq(c.q, 2)}, which rounds up to ${n(c.need)}`;

mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'Phosphate in the fields',
 brief: 'The farm council wants a range it can quote for the phosphate in the new field’s soil, and a sample big enough to tighten it.',
 labels: ['lower bound (mg/kg)', 'upper bound (mg/kg)', 'soil cores needed'], tolerance: 0.005,
 gl: [['margin of error (mg/kg)'], ['lower bound (mg/kg)', 'upper bound (mg/kg)'], ['(z* × σ ÷ E)²', 'soil cores needed']]
}, {
 /* Same rules as q13: never its worked example (x̄ = 40, σ = 5, n = 16, 90%). */
 canonical: { L: 90, sig: 12, r: 6, xb: 63.8, e10: 20 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), sig: R.int(4, 30), r: R.pick(ROOTS), xb: R.int(200, 900) / 10, e10: R.int(5, 30) };
  if (!ok13(p) || (p.sig === 5 && p.r === 4 && p.L === 90 && p.xb === 40)) continue; return p; } },
 build: p => { const { L, sig, xb } = p, c = core13(p), { N, se, z, m, m2, lo, hi, E, q, need } = c; return {
  prompt: `The farm’s soil records give σ = ${n(sig)} milligrams per kilogram (mg/kg) for the phosphate in single soil cores. A sample of ${n(N)} cores from the new field has mean x̄ = ${n(xb)} mg/kg. ${ZLINE} Enter the lower and then the upper bound of the ${L}% confidence interval for the field’s mean phosphate, each to 2 decimal places. Then the council wants a margin of error of at most ${n(E)} mg/kg at the same confidence level: enter the smallest number of cores that gives it.`,
  answer: [lo, hi, need],
  hints: ['The interval runs from x̄ minus the margin of error to x̄ plus it, where the margin is z* × σ ÷ √n.', 'For the number of cores, solve margin = z* × σ ÷ √n for n, giving n = (z* × σ ÷ E)², where E is the margin wanted. Round up to the next whole number.'],
  solution: `The standard error is ${n(sig)} ÷ √${n(N)} = ${n(sig)} ÷ ${n(c.N ** 0.5)} = ${n(se)} mg/kg, so the margin of error is ${z} × ${n(se)} ${eq(m, 2)} mg/kg. The interval runs from ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} to ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)} mg/kg. For a margin of at most ${n(E)} mg/kg, n = (${z} × ${n(sig)} ÷ ${n(E)})² ${how13(c)} cores.`,
  guidance: [
   { prompt: `The standard error is ${n(sig)} ÷ ${n(c.N ** 0.5)} = ${n(se)} mg/kg. What is the margin of error for ${L}% confidence, to 2 decimal places?`, answer: [m2], explanation: `z* = ${z}, and ${z} × ${n(se)} ${eq(m, 2)} mg/kg.` },
   { prompt: `Subtract the margin from x̄ = ${n(xb)}, then add it. What are the lower and upper bounds?`, answer: [lo, hi], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} and ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)}. The interval is ${fx(lo, 2)} to ${fx(hi, 2)} mg/kg.` },
   { prompt: `For a margin of at most ${n(E)} mg/kg, what is (z* × σ ÷ E)² to 2 decimal places, and the smallest whole number of cores?`, answer: [rd(q, 2), need], explanation: `${z} × ${n(sig)} ÷ ${n(E)} ${eq(Number(z) * sig / E, 4)}, and its square ${eq(q, 2)}. ${c.whole ? `That is a whole number, so ${n(need)} cores give a margin of exactly ${n(E)} mg/kg.` : `Fewer than ${n(q)} cores would leave the margin above ${n(E)} mg/kg, so round up to ${n(need)}.`}` }
  ] }; }
});

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The smelter’s price floor',
 brief: 'A smelter will pay for a new seam at its guaranteed grade, and the lab must say what that grade is and what a tighter one would cost to prove.',
 labels: ['lower bound (g/kg)', 'lumps needed', 'cost of the extra lumps (credits)'], tolerance: 0.005,
 gl: [['margin of error (g/kg)'], ['lower bound (g/kg)'], ['lumps needed', 'cost of the extra lumps (credits)']]
}, {
 /* Same rules as q13 for the numbers; the cost per lump is one of 4, 5, 6, 8, 10 or 12 credits (a whole number). Never the q13 worked example. */
 canonical: { L: 95, sig: 8, r: 5, xb: 71.4, e10: 20, c: 5 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), sig: R.int(4, 30), r: R.pick(ROOTS), xb: R.int(300, 900) / 10, e10: R.int(5, 30), c: R.pick([4, 5, 6, 8, 10, 12]) };
  if (!ok13(p) || (p.sig === 5 && p.r === 4 && p.L === 90 && p.xb === 40)) continue; return p; } },
 build: p => { const { L, sig, xb, c: cost } = p, c = core13(p), { N, se, z, m, m2, lo, E, q, need } = c, extra = need - N, total = extra * cost; return {
  prompt: `A smelter will pay for a new seam at its guaranteed grade, taken as the lower bound of the ${L}% confidence interval for the seam’s mean copper content. Records give σ = ${n(sig)} g/kg for single ore lumps, and a trial of ${n(N)} lumps has mean x̄ = ${n(xb)} g/kg. ${ZLINE} Enter the lower bound to 2 decimal places. The lab could prove a higher grade with a margin of error of at most ${n(E)} g/kg at the same confidence level: enter the smallest number of lumps in all that gives it, then what the lumps beyond the trial cost to assay at ${n(cost)} outpost credits each${total >= 1000 ? ' (type the cost without commas)' : ''}.`,
  answer: [lo, need, total],
  hints: ['The lower bound is x̄ minus the margin of error z* × σ ÷ √n.', 'The number of lumps is (z* × σ ÷ E)², rounded up to a whole number. Only the lumps beyond the ones already assayed cost extra: subtract, then multiply by the price per lump.'],
  solution: `The standard error is ${n(sig)} ÷ √${n(N)} = ${n(sig)} ÷ ${n(N ** 0.5)} = ${n(se)} g/kg, so the margin of error is ${z} × ${n(se)} ${eq(m, 2)} g/kg and the lower bound is ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} g/kg. For a margin of at most ${n(E)} g/kg, n = (${z} × ${n(sig)} ÷ ${n(E)})² ${how13(c)} lumps. That is ${n(need)} − ${n(N)} = ${n(extra)} lumps beyond the trial, and ${n(extra)} × ${n(cost)} = ${n(total)} credits.`,
  guidance: [
   { prompt: `The standard error is ${n(sig)} ÷ ${n(N ** 0.5)} = ${n(se)} g/kg. What is the margin of error for ${L}% confidence, to 2 decimal places?`, answer: [m2], explanation: `z* = ${z}, and ${z} × ${n(se)} ${eq(m, 2)} g/kg.` },
   { prompt: `Subtract the margin from x̄ = ${n(xb)}. What is the lower bound?`, answer: [lo], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} g/kg.` },
   { prompt: `Work out (z* × σ ÷ E)² for E = ${n(E)} and round up for the number of lumps. Then multiply the lumps beyond the trial of ${n(N)} by ${n(cost)} credits. What are the two answers?`, answer: [need, total], explanation: `${z} × ${n(sig)} ÷ ${n(E)} ${eq(Number(z) * sig / E, 4)}, and its square ${eq(q, 2)}, so ${n(need)} lumps in all. ${n(need)} − ${n(N)} = ${n(extra)} more lumps, and ${n(extra)} × ${n(cost)} = ${n(total)} credits.` }
  ] }; }
});

mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q02', title: 'The manganese readings',
 brief: 'The lab has a short list of raw manganese readings from a new seam and must turn them into a quotable range and a bigger plan.',
 labels: ['sample mean x̄ (g/kg)', 'lower bound (g/kg)', 'upper bound (g/kg)', 'lumps needed'], tolerance: 0.005,
 gl: [['sum of readings (g/kg)', 'sample mean x̄ (g/kg)'], ['standard error (g/kg)', 'margin of error (g/kg)'], ['lower bound (g/kg)', 'upper bound (g/kg)'], ['(z* × σ ÷ E)²', 'lumps needed']]
}, {
 /* Four readings (σ ÷ 2) or nine (σ ÷ 3), whole numbers from 20 to 80; with nine the total is a multiple of 9, so the mean has at most 2 decimals.
    σ makes the standard error a number with at most 2 decimals. The interval and sample-size rules of q13 apply; the target margin E is below the margin. */
 canonical: { r: 2, d: [42, 51, 47, 56], sig: 9, L: 90, e10: 20 },
 draw: R => { for (;;) { const r = R.pick([2, 3]), d = []; for (let i = 0; i < r * r; i++) d.push(R.int(20, 80));
  const p = { r, d, sig: R.int(4, 30), L: R.pick([90, 95, 99]), e10: R.int(5, 30) }, t = sum(d);
  if ((r === 3 && t % 9 !== 0) || !ok13({ ...p, xb: t / (r * r) })) continue; return p; } },
 build: p => { const { r, d, sig, L } = p, N = r * r, tot = sum(d), xb = tot / N, c = core13({ ...p, xb }), { se, z, m, m2, lo, hi, E, q, need } = c; return {
  prompt: `The assay lab’s records give σ = ${n(sig)} g/kg for the manganese content of ore lumps. A new seam’s ${n(N)} lumps gave these readings in g/kg: ${list(d)}. ${ZLINE} Enter the sample mean x̄, then the lower and the upper bound of the ${L}% confidence interval for the seam’s mean, each to 2 decimal places. Then the council wants a margin of error of at most ${n(E)} g/kg at the same confidence level: enter the smallest number of lumps that gives it.`,
  answer: [xb, lo, hi, need],
  hints: ['The sample mean is the sum of the readings divided by how many there are. The margin of error is z* × σ ÷ √n.', 'The interval runs from x̄ minus the margin to x̄ plus it. For the number of lumps, n = (z* × σ ÷ E)², rounded up to a whole number.'],
  solution: `The readings add up to ${n(tot)}, so x̄ = ${n(tot)} ÷ ${n(N)} ${eq(xb, 2)} g/kg. The standard error is ${n(sig)} ÷ √${n(N)} = ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg, so the margin of error is ${z} × ${n(se)} ${eq(m, 2)} g/kg. The interval runs from ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} to ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)} g/kg. For a margin of at most ${n(E)} g/kg, n = (${z} × ${n(sig)} ÷ ${n(E)})² ${how13(c)} lumps.`,
  guidance: [
   { prompt: `Add the ${n(N)} readings. What is their sum, and what is the sample mean x̄?`, answer: [tot, xb], explanation: `The sum is ${n(tot)}, and ${n(tot)} ÷ ${n(N)} ${eq(xb, 2)}, so x̄ = ${n(xb)} g/kg.` },
   { prompt: `What is the standard error σ ÷ √${n(N)}, and the margin of error for ${L}% confidence, to 2 decimal places?`, answer: [se, m2], explanation: `√${n(N)} = ${n(r)}, so ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg. With z* = ${z}, the margin is ${z} × ${n(se)} ${eq(m, 2)} g/kg.` },
   { prompt: `Subtract the margin from x̄ = ${n(xb)}, then add it. What are the lower and upper bounds?`, answer: [lo, hi], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} and ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)}.` },
   { prompt: `For a margin of at most ${n(E)} g/kg, what is (z* × σ ÷ E)² to 2 decimal places, and the smallest whole number of lumps?`, answer: [rd(q, 2), need], explanation: `${z} × ${n(sig)} ÷ ${n(E)} ${eq(Number(z) * sig / E, 4)}, and its square ${eq(q, 2)}. ${c.whole ? `That is a whole number, so ${n(need)} lumps give a margin of exactly ${n(E)} g/kg.` : `Fewer than ${n(q)} lumps would leave the margin above ${n(E)} g/kg, so round up to ${n(need)}.`}` }
  ] }; }
});

/* ---- q14 Student's t distribution and degrees of freedom [8.2] ---- */

mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'Chloride in a new well',
 brief: 'A newly dug well has only a few water samples and no records, so the lab must pick the right critical value before it can report.',
 labels: ['degrees of freedom', 't*'], tolerance: 0.0005,
 gl: [['degrees of freedom'], ['t*']]
}, {
 /* df = n − 1 from 4 to 20; the prompt prints the rows df − 1, df and df + 1. Never the q14 worked example (n = 8, 90%). */
 canonical: { L: 99, N: 15 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), N: R.int(5, 21) }; if (p.N === 8 && p.L === 90) continue; return p; } },
 build: ({ L, N }) => { const df = N - 1, t = tstar(df, L); return {
  prompt: `The assay lab has drawn only ${n(N)} water samples from a newly dug well, and it has no records of σ. It will use the sample standard deviation s, so its critical value comes from Student’s t distribution and not from the normal curve. Part of the t table, one row for each number of degrees of freedom (df), with columns for the confidence level: ${trow(df - 1)}; ${trow(df)}; ${trow(df + 1)}. Enter the degrees of freedom for this sample, then the critical value t* for ${L}% confidence.`,
  answer: [df, Number(t)],
  hints: ['For one sample of n readings, the degrees of freedom are n − 1.', 'Find the row for your degrees of freedom, then read across to the column for the confidence level.'],
  solution: `The sample has n = ${n(N)} water samples, so df = ${n(N)} − 1 = ${n(df)}. In the row df ${df}, the ${L}% column reads t* = ${t}. That is larger than the normal curve’s z* = ${ZS[L]} for the same level, because with σ unknown the interval has to be wider.`,
  guidance: [
   { prompt: `How many degrees of freedom does a sample of ${n(N)} water samples have?`, answer: [df], explanation: `df = n − 1 = ${n(N)} − 1 = ${n(df)}.` },
   { prompt: `In the row df ${df}, what does the ${L}% column say?`, answer: [Number(t)], explanation: `The row reads 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}, so t* = ${t}.` }
  ] }; }
});

mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Is a longer run worth it?',
 brief: 'Before the report goes to the council, Mira asks how much a few extra samples would shrink the lab’s critical value.',
 labels: ['t* now', 't* after the extra samples', 'drop in t*'], tolerance: 0.0005,
 gl: [['degrees of freedom now', 't* now'], ['degrees of freedom after', 't* after the extra samples'], ['drop in t*']]
}, {
 /* n now from 5 to 13 and 3 to 8 extra samples (so at most 21 in all, within the printed rows). The two rows needed are printed. */
 canonical: { L: 95, N: 7, x: 5 },
 draw: R => { const N = R.int(5, 13); return { L: R.pick([90, 95, 99]), N, x: R.int(3, Math.min(8, 21 - N)) }; },
 build: ({ L, N, x }) => { const d1 = N - 1, d2 = N + x - 1, t1 = tstar(d1, L), t2 = tstar(d2, L), drop = rd(Number(t1) - Number(t2), 3); return {
  prompt: `The assay lab has tested ${n(N)} samples of well water, and it has no records of σ, so it uses s and the critical value t* from Student’s t distribution. Before the report goes to the council, Mira asks how much the lab’s critical value would shrink if ${n(x)} more samples were added to the ${n(N)}. Two rows of the t table, with columns for the confidence level: ${trow(d1)}; ${trow(d2)}. Enter t* for ${L}% confidence now, then t* after the extra samples, then how much smaller the new t* is.`,
  answer: [Number(t1), Number(t2), drop],
  hints: ['For one sample of n readings, the degrees of freedom are n − 1. Work out the degrees of freedom for each sample size, then read the row and the confidence-level column.', 'The last answer is the older critical value minus the newer one.'],
  solution: `Now n = ${n(N)}, so df = ${n(d1)} and the ${L}% column of row df ${d1} gives t* = ${t1}. After the extra samples n = ${n(N)} + ${n(x)} = ${n(N + x)}, so df = ${n(d2)} and the ${L}% column of row df ${d2} gives t* = ${t2}. The critical value falls by ${t1} − ${t2} = ${fx(drop, 3)}: more samples mean a narrower interval, partly through a smaller t*.`,
  guidance: [
   { prompt: `How many degrees of freedom does the present sample of ${n(N)} have, and what is t* for ${L}% confidence in that row?`, answer: [d1, Number(t1)], explanation: `df = ${n(N)} − 1 = ${n(d1)}. The row df ${d1} reads 90% ${TT[d1][0]}, 95% ${TT[d1][1]}, 99% ${TT[d1][2]}, so t* = ${t1}.` },
   { prompt: `With ${n(x)} more samples there are ${n(N + x)}. How many degrees of freedom is that, and what is t* for ${L}% confidence in that row?`, answer: [d2, Number(t2)], explanation: `df = ${n(N + x)} − 1 = ${n(d2)}. The row df ${d2} reads 90% ${TT[d2][0]}, 95% ${TT[d2][1]}, 99% ${TT[d2][2]}, so t* = ${t2}.` },
   { prompt: `Subtract the new t* from the old one. How much smaller is it?`, answer: [drop], explanation: `${t1} − ${t2} = ${fx(drop, 3)}.` }
  ] }; }
});

mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q12', title: 'Two shifts, one sample',
 brief: 'The morning and evening shifts each assayed a few lumps, and the lab wants one critical value for the pooled batch and its gap from the normal curve’s.',
 labels: ['degrees of freedom', 't*', 'how much t* exceeds z*'], tolerance: 0.0005,
 gl: [['lumps in all', 'degrees of freedom'], ['t*'], ['how much t* exceeds z*']]
}, {
 /* a morning lumps and b evening lumps (3 to 10 each), 6 to 20 in all, so rows df − 1 to df + 1 are in the table. Never the q14 worked example (n = 8, 90%). */
 canonical: { L: 99, a: 6, b: 7 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), a: R.int(3, 10), b: R.int(3, 10) }; if (p.a + p.b === 8 && p.L === 90) continue; return p; } },
 build: ({ L, a, b }) => { const N = a + b, df = N - 1, t = tstar(df, L), z = ZS[L], gap = rd(Number(t) - Number(z), 3); return {
  prompt: `The morning shift assayed ${n(a)} ore lumps from a new seam and the evening shift assayed ${n(b)} more. There are no records of σ, and the lab treats all the lumps as one random sample and uses s, so its critical value comes from Student’s t distribution. Part of the t table, one row for each number of degrees of freedom (df), with columns for the confidence level: ${trow(df - 1)}; ${trow(df)}; ${trow(df + 1)}. Enter the degrees of freedom for the pooled sample, then the critical value t* for ${L}% confidence. Then enter how much larger t* is than the normal curve’s critical value z* = ${z} for the same level.`,
  answer: [df, Number(t), gap],
  hints: ['Count all the lumps first: df is one less than the number in the pooled sample, not one less than each shift’s number.', 'Read the row for df and the column for the confidence level. The last answer is t* minus z*.'],
  solution: `The pooled sample has ${n(a)} + ${n(b)} = ${n(N)} lumps, so df = ${n(N)} − 1 = ${n(df)}. In the row df ${df}, the ${L}% column reads t* = ${t}. The normal curve’s z* is ${z}, so t* is larger by ${t} − ${z} = ${fx(gap, 3)}: with σ unknown, the critical value is bigger.`,
  guidance: [
   { prompt: `How many lumps are in the pooled sample, and how many degrees of freedom does it have?`, answer: [N, df], explanation: `${n(a)} + ${n(b)} = ${n(N)} lumps, and df = ${n(N)} − 1 = ${n(df)}.` },
   { prompt: `In the row df ${df}, what does the ${L}% column say?`, answer: [Number(t)], explanation: `The row reads 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}, so t* = ${t}.` },
   { prompt: `Subtract z* = ${z} from t*. How much larger is t*, to 3 decimal places?`, answer: [gap], explanation: `${t} − ${z} = ${fx(gap, 3)}.` }
  ] }; }
});

/* ---- q15 The t interval for a mean [8.2] ---- */

/* Draw rule shared by the q15 settings: s ÷ √n and the margin are never rounding ties, and t* times the rounded s ÷ √n keeps the margin's second decimal. */
const ok15 = (s, N, L) => { const se = s / Math.sqrt(N), t = Number(tstar(N - 1, L)), m = t * se; return !tie(se, 2) && !tie(m, 2) && rd(t * rd(se, 2), 2) === rd(m, 2); };

mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'Copper in the stream',
 brief: 'The outpost’s stream has no records at all, and the council wants a range for its copper level built from a handful of samples.',
 labels: ['margin of error (mg/L)', 'lower bound (mg/L)', 'upper bound (mg/L)'], tolerance: 0.005,
 gl: [['degrees of freedom'], ['s ÷ √n (mg/L)'], ['margin of error (mg/L)'], ['lower bound (mg/L)', 'upper bound (mg/L)']]
}, {
 /* Never the q15 worked example (n = 16, x̄ = 20.5, s = 2.4, 90%). */
 canonical: { L: 90, N: 9, xb: 12.8, s10: 31 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), N: R.int(5, 21), xb: R.int(50, 300) / 10, s10: R.int(10, 60) };
  if (!ok15(p.s10 / 10, p.N, p.L) || (p.N === 16 && p.xb === 20.5 && p.s10 === 24 && p.L === 90)) continue; return p; } },
 build: ({ L, N, xb, s10 }) => { const df = N - 1, s = s10 / 10, se = s / Math.sqrt(N), t = tstar(df, L), m = Number(t) * se, m2 = rd(m, 2), lo = rd(xb - m, 2), hi = rd(xb + m, 2); return {
  prompt: `The assay lab took ${n(N)} water samples from the outpost’s stream, which has no records of σ. Their copper level has mean x̄ = ${n(xb)} milligrams per litre (mg/L) and sample standard deviation s = ${n(s)} mg/L. Row of the t table for df ${df}: 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}. Enter the margin of error t* × s ÷ √n for ${L}% confidence, then the lower and the upper bound of the confidence interval, each to 2 decimal places.`,
  answer: [m2, lo, hi],
  hints: ['The row of the table is the one for df = n − 1, and the column is the confidence level: that gives t*.', 'The margin of error is t* times s ÷ √n; the bounds are x̄ minus and plus the margin.'],
  solution: `df = ${n(N)} − 1 = ${n(df)}, so for ${L}% confidence t* = ${t}. s ÷ √${n(N)} = ${n(s)} ÷ √${n(N)} ${eq(se, 4)}, so the margin of error is ${t} × ${fx(se, 4)} ${eq(m, 2)} mg/L. The interval runs from ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} to ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)} mg/L.`,
  guidance: [
   { prompt: `How many degrees of freedom does the sample have?`, answer: [df], explanation: `df = ${n(N)} − 1 = ${n(df)}, so the row to read is df ${df}, where the ${L}% column gives t* = ${t}.` },
   { prompt: `What is s ÷ √n = ${n(s)} ÷ √${n(N)}, to 2 decimal places?`, answer: [rd(se, 2)], explanation: `√${n(N)} ${eq(Math.sqrt(N), 4)}, and ${n(s)} ÷ ${fx(Math.sqrt(N), 4)} ${eq(se, 2)} mg/L.` },
   { prompt: `Multiply by t* = ${t}. What is the margin of error, to 2 decimal places?`, answer: [m2], explanation: `${t} × ${fx(se, 4)} ${eq(m, 2)} mg/L.` },
   { prompt: `Subtract the margin from x̄ = ${n(xb)}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} and ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)}.` }
  ] }; }
});

mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Clearing the furnace limit',
 brief: 'The furnace crew will only burn a new coal seam if even the low end of the lab’s interval clears their minimum.',
 labels: ['margin of error (g/kg)', 'lower bound (g/kg)', 'lower bound above the minimum (g/kg)'], tolerance: 0.005,
 gl: [['degrees of freedom'], ['s ÷ √n (g/kg)', 'margin of error (g/kg)'], ['lower bound (g/kg)', 'lower bound above the minimum (g/kg)']]
}, {
 /* Never the q15 worked example. The furnace minimum is a whole number 1 to 4 below the lower bound's whole part, so the lower bound always clears it. */
 canonical: { L: 95, N: 10, xb: 41.7, s10: 38, k: 2 },
 draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), N: R.int(5, 21), xb: R.int(250, 700) / 10, s10: R.int(15, 60), k: R.int(1, 4) };
  if (!ok15(p.s10 / 10, p.N, p.L) || (p.N === 16 && p.xb === 20.5 && p.s10 === 24 && p.L === 90)) continue; return p; } },
 build: ({ L, N, xb, s10, k }) => { const df = N - 1, s = s10 / 10, se = s / Math.sqrt(N), t = tstar(df, L), m = Number(t) * se, m2 = rd(m, 2), lo = rd(xb - m, 2), min = Math.floor(lo) - k, clear = rd(lo - min, 2); return {
  prompt: `The furnace crew will only burn coal from a new seam if the lower bound of the ${L}% confidence interval for the seam’s mean carbon content is above their minimum of ${n(min)} g/kg. The seam has no records of σ. The lab measured ${n(N)} coal samples: mean x̄ = ${n(xb)} g/kg and sample standard deviation s = ${n(s)} g/kg. Row of the t table for df ${df}: 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}. Enter the margin of error t* × s ÷ √n to 2 decimal places, then the lower bound of the interval, then how far that lower bound lies above the crew’s minimum.`,
  answer: [m2, lo, clear],
  hints: ['Pick the row for df = n − 1 and the column for the confidence level to get t*. The margin of error is t* times s ÷ √n.', 'The lower bound is x̄ minus the margin. How far it lies above the minimum is the lower bound minus the minimum.'],
  solution: `df = ${n(N)} − 1 = ${n(df)}, so for ${L}% confidence t* = ${t}. s ÷ √${n(N)} = ${n(s)} ÷ √${n(N)} ${eq(se, 4)}, so the margin of error is ${t} × ${fx(se, 4)} ${eq(m, 2)} g/kg. The lower bound is ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} g/kg, which is ${fx(lo, 2)} − ${n(min)} = ${fx(clear, 2)} g/kg above the crew’s minimum.`,
  guidance: [
   { prompt: `How many degrees of freedom does the sample have?`, answer: [df], explanation: `df = ${n(N)} − 1 = ${n(df)}, so the row to read is df ${df}, where the ${L}% column gives t* = ${t}.` },
   { prompt: `What is s ÷ √n = ${n(s)} ÷ √${n(N)}, to 2 decimal places, and the margin of error t* × s ÷ √n, to 2 decimal places?`, answer: [rd(se, 2), m2], explanation: `√${n(N)} ${eq(Math.sqrt(N), 4)}, so ${n(s)} ÷ ${fx(Math.sqrt(N), 4)} ${eq(se, 2)} g/kg. Then ${t} × ${fx(se, 4)} ${eq(m, 2)} g/kg.` },
   { prompt: `Subtract the margin from x̄ = ${n(xb)} for the lower bound, then subtract the minimum ${n(min)}. What are the two answers?`, answer: [lo, clear], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)}, and ${fx(lo, 2)} − ${n(min)} = ${fx(clear, 2)} g/kg above the minimum.` }
  ] }; }
});

mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q07', title: 'Raw readings, no records',
 brief: 'A short list of raw tin readings has come in from a new seam, and the lab must work out its spread before it can build any interval.',
 labels: ['s (g/kg)', 'margin of error (g/kg)', 'lower bound (g/kg)', 'upper bound (g/kg)'], tolerance: 0.005,
 gl: [['sum of readings (g/kg)', 'sample mean x̄ (g/kg)'], ['sum of squared distances', 's (g/kg)'], ['margin of error (g/kg)'], ['lower bound (g/kg)', 'upper bound (g/kg)']]
}, {
 /* Five to eight readings with a whole-number mean (distances that add to 0), so x̄ is exact. s and the margin are never rounding ties,
    and t* times the rounded s ÷ √n keeps the margin's second decimal; the margin is worked from the rounded s ÷ √n only where it agrees. */
 canonical: { L: 95, N: 6, m: 52, dv: [-5, 3, 6, -2, 4, -6] },
 draw: R => { for (;;) { const N = R.int(5, 8), dv = []; let tot = 0; for (let i = 0; i < N - 1; i++) { const v = R.int(-8, 8); dv.push(v); tot += v; }
  if (Math.abs(tot) > 8) continue; dv.push(-tot); const sq = sum(dv.map(v => v * v)), p = { L: R.pick([90, 95, 99]), N, m: R.int(20, 80), dv };
  const s = Math.sqrt(sq / (N - 1)); if (sq === 0 || tie(s, 2) || !ok15(s, N, p.L) || rd(Number(tstar(N - 1, p.L)) * rd(s, 2) / Math.sqrt(N), 2) !== rd(Number(tstar(N - 1, p.L)) * s / Math.sqrt(N), 2)) continue; return p; } },
 build: ({ L, N, m, dv }) => { const d = dv.map(v => m + v), df = N - 1, tot = sum(d), ss = sum(dv.map(v => v * v)), s = Math.sqrt(ss / df), se = s / Math.sqrt(N), t = tstar(df, L), mg = Number(t) * se, m2 = rd(mg, 2), lo = rd(m - mg, 2), hi = rd(m + mg, 2); return {
  prompt: `The assay lab measured the tin content of ${n(N)} ore lumps from a new seam with no records of σ. The readings in g/kg are ${list(d)}. Row of the t table for df ${df}: 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}. Enter the sample standard deviation s to 2 decimal places, then the margin of error t* × s ÷ √n for ${L}% confidence, then the lower and the upper bound of the confidence interval, each to 2 decimal places.`,
  answer: [rd(s, 2), m2, lo, hi],
  hints: ['Find the mean first. For s, square each reading’s distance from the mean, add the squares, divide by n − 1 and take the square root.', 'Use the row for df = n − 1 and the confidence-level column to get t*. The margin of error is t* times s ÷ √n, and the bounds are x̄ minus and plus the margin.'],
  solution: `The readings add up to ${n(tot)}, so x̄ = ${n(tot)} ÷ ${n(N)} = ${n(m)} g/kg. The squares of the distances from the mean add up to ${n(ss)}, so s = √(${n(ss)} ÷ ${n(df)}) ${eq(s, 2)} g/kg. For ${L}% confidence t* = ${t}, and s ÷ √${n(N)} ${eq(se, 4)}, so the margin of error is ${t} × ${fx(se, 4)} ${eq(mg, 2)} g/kg. The interval runs from ${n(m)} − ${fx(m2, 2)} = ${fx(lo, 2)} to ${n(m)} + ${fx(m2, 2)} = ${fx(hi, 2)} g/kg.`,
  guidance: [
   { prompt: `Add the ${n(N)} readings. What is their sum, and what is the sample mean x̄?`, answer: [tot, m], explanation: `The sum is ${n(tot)}, and ${n(tot)} ÷ ${n(N)} = ${n(m)}, so x̄ = ${n(m)} g/kg.` },
   { prompt: `Subtract x̄ = ${n(m)} from each reading, square each result and add the squares. Divide by n − 1 = ${n(df)} and take the square root. What are the sum of squares and s, to 2 decimal places?`, answer: [ss, rd(s, 2)], explanation: `The squares of the distances add up to ${n(ss)}. ${n(ss)} ÷ ${n(df)} ${eq(ss / df, 4)}, and its square root is s ${eq(s, 2)} g/kg.` },
   { prompt: `Use df = ${n(df)} and the ${L}% column to read t*. What is the margin of error t* × s ÷ √${n(N)}, to 2 decimal places?`, answer: [m2], explanation: `t* = ${t}. s ÷ √${n(N)} ${eq(se, 4)}, and ${t} × ${fx(se, 4)} ${eq(mg, 2)} g/kg.` },
   { prompt: `Subtract the margin from x̄ = ${n(m)}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${n(m)} − ${fx(m2, 2)} = ${fx(lo, 2)} and ${n(m)} + ${fx(m2, 2)} = ${fx(hi, 2)}.` }
  ] }; }
});


})();
