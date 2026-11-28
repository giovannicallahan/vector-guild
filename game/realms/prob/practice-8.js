/* Probability practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p8.js. */
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

/* The stored normal table, as in gen-d.js: z is held in hundredths (h = 130 is z = 1.30); A(h) is the area to the left
   of z as a whole number of ten-thousandths. Every mission prints the rows it needs (offline game). */
const memo = {};
const A = h => { if (memo[h] === undefined) { const z = h / 100; let term = z, sum = z;
 for (let k = 1; k < 400 && term !== 0; k++) { term *= -z * z / (2 * k); sum += term / (2 * k + 1); if (Math.abs(term) < 1e-18) break; }
 memo[h] = Math.round((0.5 + sum / Math.sqrt(2 * Math.PI)) * 1e4); } return memo[h]; };
const zt = h => (h < 0 ? '−' : '') + (Math.abs(h) / 100).toFixed(2);
const ar = v => (v / 1e4).toFixed(4);
const rowList = hs => [...new Set(hs)].sort((a, b) => a - b).map(h => `${zt(h)} → ${ar(A(h))}`).join(', ');
const tri = (h, o) => [h - o, h - o + 1, h - o + 2];
const TABLE = 'Rows from the normal table (z → area to the left of z)';
const near = x => Math.round(x * 100);
/* A value to 4 decimal places as written: exact if it has at most 4, otherwise cut (not rounded) with “…” after it. */
const dig4 = x => { if (Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6) return n(x); const t = Math.trunc(x * 1e4 + Math.sign(x) * 1e-7) / 1e4; return (t < 0 ? '−' : '') + Math.abs(t).toFixed(4) + '…'; };
const tie = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 0.02;
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const zText = (x, h) => exact2(x) ? zt(h) : `${dig4(x)}, which rounds to ${zt(h)}`;
const r2 = x => Math.round(x * 100) / 100;
const q100 = p => (100 - Math.round(p * 100)) / 100;
const sq = (x, ex, r) => ex ? n(r) : `${dig4(x)}, which rounds to ${n(r)}`;
/* Rows nearest an area of k%, as in gen-d.js (q34); only k with a single nearest row is used. */
const nearestRow = k => { let best = 0, gap = Infinity, second = Infinity; for (let h = -349; h <= 349; h++) { const g = Math.abs(A(h) - 100 * k); if (g < gap) { second = gap; gap = g; best = h; } else if (g < second) second = g; } return { h: best, clear: second - gap >= 2 }; };
const PCT = [10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90].filter(k => nearestRow(k).clear);
/* (n, p, √(npq)) with a whole or half standard deviation (as q39) and (n, p, √(pq ÷ n)) for a sample proportion (as q40). */
const BIN = [[36, 0.5, 3], [100, 0.5, 5], [100, 0.9, 3], [100, 0.1, 3], [144, 0.5, 6], [225, 0.2, 6], [400, 0.1, 6], [48, 0.25, 3], [192, 0.25, 6], [300, 0.25, 7.5], [400, 0.5, 10]];
const PROP = [[100, 0.5, 0.05], [100, 0.2, 0.04], [100, 0.1, 0.03], [100, 0.9, 0.03], [400, 0.2, 0.02], [400, 0.5, 0.025], [100, 0.8, 0.04], [400, 0.1, 0.015]];
/* Pairs whose count has a whole standard deviation and a whole np, for the two-ways mission q40d (no sd of 4 or 8). */
const TWO = [[100, 0.5, 5], [100, 0.1, 3], [100, 0.9, 3], [400, 0.5, 10], [400, 0.1, 6]];
/* Binomials with an irrational standard deviation (npq is not a perfect square) and np a whole number, for q39d.
   (90 and 0.3 is left out: with √18.9 every cut-off's z sits on or near the edge between two table rows.) */
const IRR = [[200, 0.3], [250, 0.6], [120, 0.7], [160, 0.15], [150, 0.2]];
/* The parameters carry n and p themselves (not a place in these lists), so an oracle needs no copy of the lists;
   the stored spread is looked up from them. */
const spread = (list, nn, pr) => list.find(e => e[0] === nn && e[1] === pr)[2];

/* ---- q36 Spread of a sum: variances add when independent [IS 7.2] ---- */

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'Valve drift in the greenhouse',
 brief: 'The greenhouse waters its beds through a line of valves that each drift a little, and the grower wants to know how far a whole day’s delivery can stray.',
 labels: ['variance of the total (L²)', 'standard deviation of the total (L)'], tolerance: 0.005,
 gl: [['variance of the total (L²)'], ['standard deviation (L)']]
}, {
 canonical: { c: 12, v: 5 },
 draw: R => { let p; do { p = { c: R.int(4, 30), v: R.int(3, 40) }; } while (tie(Math.sqrt(p.c * p.v)) || p.c === 8 && p.v === 9); return p; },
 build: ({ c, v }) => { const tot = c * v, sd = Math.sqrt(tot), sr = r2(sd), ex = exact2(sd); return {
  prompt: `The greenhouse irrigation line has ${n(c)} valves. The water each valve delivers in a day varies independently of the others, and the variance of one valve’s daily delivery is ${n(v)} L² (a variance, not a standard deviation). Enter the variance of the line’s total daily delivery in L² (type it without commas), then the standard deviation of the total in litres, rounded to 2 decimal places.`,
  answer: [tot, sr],
  hints: ['One valve’s variance is already given, so there is nothing to square. For independent random variables the variances add.', 'A standard deviation is the square root of a variance. Take the root of the total’s variance, not of one valve’s.'],
  solution: `Each valve has variance ${n(v)} L². The deliveries are independent, so the variances add: ${n(c)} × ${n(v)} = ${n(tot)} L². The standard deviation of the total is √${n(tot)} = ${sq(sd, ex, sr)} L${ex ? '' : ' to 2 decimal places'}.`,
  guidance: [
   { prompt: `The deliveries are independent, so the variances add. What is the variance of the total of ${n(c)} valves, each with variance ${n(v)} L²?`, answer: [tot], explanation: `${n(c)} × ${n(v)} = ${n(tot)} L².` },
   { prompt: `Take the square root of ${n(tot)} and round to 2 decimal places. What is the standard deviation of the total?`, answer: [sr], explanation: `√${n(tot)} = ${sq(sd, ex, sr)} L.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'The loaded sounding balloon',
 brief: 'A sounding balloon carries pods and a radio of different spreads, and the launch crew needs the spread of the whole payload before they check the lift.',
 labels: ['variance of the payload (g²)', 'standard deviation of the payload (g)'], tolerance: 0.005,
 gl: [['variance of the pods (g²)'], ['variance of the payload (g²)'], ['standard deviation (g)']]
}, {
 canonical: { c: 5, s: 2, r: 3 },
 draw: R => { let p; do { p = { c: R.int(3, 14), s: R.pick([1, 1.5, 2, 2.5, 3, 3.5, 4]), r: R.int(2, 6) }; } while (tie(Math.sqrt(p.c * p.s * p.s + p.r * p.r)) || p.c === 8 && p.s === 3); return p; },
 build: ({ c, s, r }) => { const pv = c * s * s, v = pv + r * r, sd = Math.sqrt(v), sr = r2(sd), ex = exact2(sd); return {
  prompt: `A sounding balloon carries ${n(c)} identical sensor pods and one radio. All the masses are independent. Each pod’s mass has standard deviation ${n(s)} g, and the radio’s mass has standard deviation ${n(r)} g. Enter the variance of the whole payload’s mass in g² (type it without commas), then its standard deviation in grams, rounded to 2 decimal places.`,
  answer: [v, sr],
  hints: ['Work in variances. The pods share one variance each and the radio has its own: square each standard deviation before adding anything.', 'The radio is one more independent item, so its variance joins the total. Take the square root only at the very end.'],
  solution: `One pod has variance ${n(s)}² = ${n(s * s)} g², so the ${n(c)} pods together have ${n(c)} × ${n(s * s)} = ${n(pv)} g². The radio has variance ${n(r)}² = ${n(r * r)} g². Everything is independent, so the variances add: ${n(pv)} + ${n(r * r)} = ${n(v)} g². The standard deviation of the payload is √${n(v)} = ${sq(sd, ex, sr)} g${ex ? '' : ' to 2 decimal places'}.`,
  guidance: [
   { prompt: `What is the variance of the total of the ${n(c)} pods, ${n(c)} × ${n(s)}²?`, answer: [pv], explanation: `One pod has variance ${n(s)}² = ${n(s * s)} g², and ${n(c)} × ${n(s * s)} = ${n(pv)} g².` },
   { prompt: `The radio is independent too, so its variance ${n(r)}² joins the sum. What is the variance of the whole payload?`, answer: [v], explanation: `${n(pv)} + ${n(r * r)} = ${n(v)} g².` },
   { prompt: `Take the square root of ${n(v)} and round to 2 decimal places. What is the standard deviation of the payload?`, answer: [sr], explanation: `√${n(v)} = ${sq(sd, ex, sr)} g.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'Pods, cells and a spare load',
 brief: 'A heavier balloon carries two kinds of part, and the crew needs both the expected load and how far it can wobble.',
 labels: ['expected total mass (g)', 'variance of the total (g²)', 'standard deviation of the total (g)'], tolerance: 0.005,
 gl: [['expected total mass (g)'], ['variance of the total (g²)'], ['standard deviation (g)']]
}, {
 canonical: { a: 9, m1: 40, s1: 1.5, b: 4, m2: 120, s2: 2 },
 draw: R => { let p; do { p = { a: R.int(3, 12), m1: R.int(30, 120), s1: R.pick([1, 1.5, 2, 2.5, 3]), b: R.int(2, 8), m2: R.int(80, 300), s2: R.pick([1, 2, 3, 4, 5]) }; } while (tie(Math.sqrt(p.a * p.s1 * p.s1 + p.b * p.s2 * p.s2)) || p.a === 6 && p.m1 === 85); return p; },
 build: ({ a, m1, s1, b, m2, s2 }) => { const mean = a * m1 + b * m2, v1 = a * s1 * s1, v2 = b * s2 * s2, v = v1 + v2, sd = Math.sqrt(v), sr = r2(sd), ex = exact2(sd); return {
  prompt: `A balloon carries ${n(a)} sensor pods and ${n(b)} battery cells, all with independent masses. Each pod has mean ${n(m1)} g and standard deviation ${n(s1)} g; each cell has mean ${n(m2)} g and standard deviation ${n(s2)} g. Enter the expected total mass in grams, then the variance of the total mass in g² (type both without commas), then the standard deviation of the total mass in grams, rounded to 2 decimal places.`,
  answer: [mean, v, sr],
  hints: ['Two separate jobs: means add directly, but spreads must go through variances. Do the expected total and the variance as two different sums.', 'Each group adds its count times one item’s variance, and then the two groups’ variances add. The standard deviation is the square root, taken last.'],
  solution: `Means add: ${n(a)} × ${n(m1)} + ${n(b)} × ${n(m2)} = ${n(a * m1)} + ${n(b * m2)} = ${n(mean)} g. For the spread, use variances: the pods give ${n(a)} × ${n(s1)}² = ${n(a)} × ${n(s1 * s1)} = ${n(v1)} g² and the cells give ${n(b)} × ${n(s2)}² = ${n(b)} × ${n(s2 * s2)} = ${n(v2)} g². The items are independent, so the variance of the total is ${n(v1)} + ${n(v2)} = ${n(v)} g², and its standard deviation is √${n(v)} = ${sq(sd, ex, sr)} g${ex ? '' : ' to 2 decimal places'}.`,
  guidance: [
   { prompt: `Means add. What is the expected total mass, ${n(a)} × ${n(m1)} + ${n(b)} × ${n(m2)}?`, answer: [mean], explanation: `${n(a)} × ${n(m1)} = ${n(a * m1)} and ${n(b)} × ${n(m2)} = ${n(b * m2)}, so the expected total is ${n(mean)} g.` },
   { prompt: `Now the spread. Add the variances of the two groups: ${n(a)} × ${n(s1)}² for the pods and ${n(b)} × ${n(s2)}² for the cells. What is the variance of the total?`, answer: [v], explanation: `${n(a)} × ${n(s1 * s1)} = ${n(v1)} and ${n(b)} × ${n(s2 * s2)} = ${n(v2)}, and ${n(v1)} + ${n(v2)} = ${n(v)} g².` },
   { prompt: `Take the square root of ${n(v)} and round to 2 decimal places. What is the standard deviation of the total?`, answer: [sr], explanation: `√${n(v)} = ${sq(sd, ex, sr)} g.` }
  ] }; }
});

/* ---- q37 The sample mean, standard error and the law of large numbers [IS 7.1, 7.3] ---- */

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Soil probes to a target',
 brief: 'The greenhouse wants its soil-moisture average to be steady to a set margin, and needs to know how many probes that takes.',
 labels: ['standard error (%)', 'probes needed'], tolerance: 0.005,
 gl: [['standard error (%)'], ['σ ÷ target'], ['probes needed']]
}, {
 canonical: { s: 9, c: 14, m: 6 },
 draw: R => { let p; do { p = { s: R.int(3, 20), c: R.int(5, 40), m: R.int(2, 12) }; } while (!exact2(p.s / p.m) || tie(p.s / Math.sqrt(p.c)) || p.m * p.m === p.c || p.s / p.m === p.s || p.s === 6 && p.c === 9); return p; },
 build: ({ s, c, m }) => { const rt = Math.sqrt(c), se = s / rt, sr = r2(se), ex = exact2(se), t = s / m, N = m * m; return {
  prompt: `Soil-moisture readings from one probe in the greenhouse beds vary with standard deviation σ = ${n(s)} percentage points. Mira averages the readings of n = ${n(c)} probes into one sample mean, X̄. Enter the standard error of X̄, σ ÷ √n, rounded to 2 decimal places. Then the grower asks for a standard error of just ${n(t)} percentage ${t === 1 ? 'point' : 'points'}: enter the number of probes that gives exactly that.`,
  answer: [sr, N],
  hints: ['The standard error is σ ÷ √n. Work out √n for the first part, then divide.', 'For the second part, turn σ ÷ √n = target round: first find what √n has to be, then undo the square root to get n.'],
  solution: `The standard error is σ ÷ √n = ${n(s)} ÷ √${n(c)} = ${sq(se, ex, sr)} percentage ${sr === 1 ? 'point' : 'points'}${ex ? '' : ' to 2 decimal places'}. For a standard error of ${n(t)}, we need ${n(s)} ÷ √n = ${n(t)}, so √n = ${n(s)} ÷ ${n(t)} = ${n(m)}. Then n = ${n(m)} × ${n(m)} = ${n(N)} probes.`,
  guidance: [
   { prompt: `What is σ ÷ √n = ${n(s)} ÷ √${n(c)}, rounded to 2 decimal places?`, answer: [sr], explanation: `√${n(c)} = ${n(Math.sqrt(c))}, and ${n(s)} ÷ ${n(Math.sqrt(c))} = ${sq(se, ex, sr)}.` },
   { prompt: `To get σ ÷ √n down to ${n(t)}, what must √n be? Divide σ = ${n(s)} by ${n(t)}.`, answer: [m], explanation: `${n(s)} ÷ ${n(t)} = ${n(m)}, so √n has to be ${n(m)}.` },
   { prompt: `If √n = ${n(m)}, how many probes is that? Multiply ${n(m)} by itself.`, answer: [N], explanation: `${n(m)} × ${n(m)} = ${n(N)} probes, and √${n(N)} = ${n(m)}.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Totals and averages of the night log',
 brief: 'The night log keeps both a running total and an average of the barometer errors, and Mira wants to know how steady each is and what a steadier average would cost.',
 labels: ['standard deviation of the total (hPa)', 'standard error of the average (hPa)', 'readings for a third'], tolerance: 0.005,
 gl: [['standard deviation of the total (hPa)'], ['standard error (hPa)'], ['readings needed']]
}, {
 canonical: { s: 5, c: 12 },
 draw: R => { let p; do { p = { s: R.int(2, 12), c: R.int(5, 40) }; } while (tie(p.s * Math.sqrt(p.c)) || tie(p.s / Math.sqrt(p.c)) || Number.isInteger(Math.sqrt(p.c)) || p.s === 4 && p.c === 7); return p; },
 build: ({ s, c }) => { const rt = Math.sqrt(c), tot = s * rt, se = s / rt, tr = r2(tot), sr = r2(se), N = 9 * c; return {
  prompt: `The weather station’s night log records n = ${n(c)} independent barometer errors, each with standard deviation σ = ${n(s)} hPa (hPa, hectopascals, is the barometer’s unit of air pressure). The log keeps both the total of the errors and their average, X̄. Enter the standard deviation of the total in hPa, then the standard error of the average in hPa, both rounded to 2 decimal places. Then enter the number of readings that would make the standard error of the average a third as big.`,
  answer: [tr, sr, N],
  hints: ['The total of n independent readings has standard deviation √n × σ. The average is that total divided by n, so its spread is σ ÷ √n.', 'To make σ ÷ √n a third as big, √n must be three times as big. Think about what that does to n.'],
  solution: `The total of ${n(c)} independent errors has standard deviation √${n(c)} × ${n(s)} = ${dig4(tot)}, which is ${n(tr)} hPa to 2 decimal places. The average divides the total by ${n(c)}, so its standard error is σ ÷ √n = ${n(s)} ÷ √${n(c)} = ${dig4(se)}, which is ${n(sr)} hPa. For a third of that, √n must be 3 times as big, so n is 3 × 3 = 9 times as big: 9 × ${n(c)} = ${n(N)} readings.`,
  guidance: [
   { prompt: `What is √n × σ = √${n(c)} × ${n(s)}, the standard deviation of the total, rounded to 2 decimal places?`, answer: [tr], explanation: `√${n(c)} = ${n(rt)}, and ${n(rt)} × ${n(s)} = ${dig4(tot)}, which rounds to ${n(tr)} hPa.` },
   { prompt: `What is σ ÷ √n = ${n(s)} ÷ √${n(c)}, the standard error of the average, rounded to 2 decimal places?`, answer: [sr], explanation: `${n(s)} ÷ ${n(rt)} = ${dig4(se)}, which rounds to ${n(sr)} hPa.` },
   { prompt: `A third of the error needs √n three times as big, so n nine times as big. How many readings is 9 × ${n(c)}?`, answer: [N], explanation: `9 × ${n(c)} = ${n(N)} readings.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'Tightening the pressure average',
 brief: 'The barometer’s readings are described by their variance, and Mira must find how many readings give an average steady enough for the forecast.',
 labels: ['standard error (hPa)', 'smallest number of readings'], tolerance: 0.005,
 gl: [['standard error (hPa)'], ['σ² ÷ target²'], ['smallest number of readings']]
}, {
 canonical: { v: 41, c: 15, k: 40 },
 draw: R => { let p; do { p = { v: R.int(10, 90), c: R.int(5, 50), k: R.pick([20, 25, 40, 50, 200]) }; const t = p.k / 100, rr = p.v / (t * t), fr = rr - Math.floor(rr);
   p.bad = tie(Math.sqrt(p.v / p.c)) || fr < 0.1 || fr > 0.9 || Math.ceil(rr) <= p.c || Math.ceil(rr) > 2000 || p.v === 36 && p.c === 9; } while (p.bad); delete p.bad; return p; },
 build: ({ v, c, k }) => { const se = Math.sqrt(v / c), sr = r2(se), ex = exact2(se), t = k / 100, rr = Math.round(v * 1e4 / (k * k) * 1e4) / 1e4 * 1, N = Math.ceil(v * 1e4 / (k * k)); return {
  prompt: `Single barometer readings at the weather station have a variance of σ² = ${n(v)} hPa², which is the standard deviation squared (hPa, hectopascals, is the barometer’s unit of air pressure). Mira averages n = ${n(c)} independent readings. Enter the standard error of the sample mean, √(σ² ÷ n), in hPa rounded to 2 decimal places. Then the forecast needs a standard error of ${n(t)} hPa or less: enter the smallest whole number of readings that achieves it.`,
  answer: [sr, N],
  hints: ['The standard error is σ ÷ √n, which is the square root of σ² ÷ n. Here the variance is given, so there is no need to square anything.', 'To get σ ÷ √n down to the target, square both sides: n must be at least σ² ÷ target². Readings come in whole numbers, so round up.'],
  solution: `The standard error is √(σ² ÷ n) = √(${n(v)} ÷ ${n(c)}) = ${sq(se, ex, sr)} hPa${ex ? '' : ' to 2 decimal places'}. For a standard error of at most ${n(t)}, we need σ ÷ √n ≤ ${n(t)}, which gives n ≥ σ² ÷ ${n(t)}² = ${n(v)} ÷ ${n(t * t)} = ${n(rr)}. Readings come in whole numbers, and ${n(Math.floor(rr))} would leave the error just above the target, so the smallest number is ${n(N)} readings.`,
  guidance: [
   { prompt: `What is √(σ² ÷ n) = √(${n(v)} ÷ ${n(c)}), rounded to 2 decimal places?`, answer: [sr], explanation: `${n(v)} ÷ ${n(c)} = ${n(v / c)}, and its square root is ${sq(se, ex, sr)} hPa.` },
   { prompt: `Squaring σ ÷ √n = ${n(t)} gives σ² ÷ n = ${n(t * t)}, so n = σ² ÷ ${n(t * t)}. What is ${n(v)} ÷ ${n(t * t)}?`, answer: [rr], explanation: `${n(v)} ÷ ${n(t * t)} = ${n(rr)}.` },
   { prompt: `Readings come in whole numbers, so ${n(rr)} must be rounded up: rounding down would leave the error above ${n(t)}. What is the smallest whole number of readings?`, answer: [N], explanation: `Round ${n(rr)} up to ${n(N)}.` }
  ] }; }
});

/* ---- q38 Central Limit Theorem: probability for a sample mean [IS 7.1] ---- */

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'A dry week for the rain gauge',
 brief: 'The rain gauge’s daily totals are lopsided, so the water-store crew asks how likely a long run of days is to average out low.',
 labels: ['standard error (mm)', 'z-score', 'P(X̄ < c)'], tolerance: 0.00005,
 gl: [['standard error (mm)'], ['z-score'], ['P(X̄ < c)']]
}, {
 canonical: { mu: 22, s: 6, r: 10, e: 9, o: 1 },
 draw: R => { let p; do { p = { mu: R.int(8, 30), s: R.int(2, 12), r: R.pick([6, 7, 8, 9, 10]), e: R.int(1, 18), o: R.int(0, 2) }; const zx = -p.e * p.r / (10 * p.s);
   p.bad = (100 * p.s) % p.r !== 0 || tie(zx) || Math.abs(zx) < 0.3 || Math.abs(zx) > 3.2 || p.mu === 18 && p.s === 4; } while (p.bad); delete p.bad; return p; },
 build: ({ mu, s, r, e, o }) => { const N = r * r, se = s / r, c = mu - e / 10, zx = -e * r / (10 * s), h = near(zx), P = A(h); return {
  prompt: `Daily rainfall at the weather station has mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm, and its spread is lopsided: most days are dry and a few are very wet. Mira averages the rainfall of n = ${n(N)} days, and one day’s rain does not affect another’s. Enter the standard error of the sample mean X̄ in mm, then the z-score of ${n(c)} mm for X̄, rounded to 2 decimal places, then P(X̄ < ${n(c)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [se, h / 100, P / 1e4],
  hints: ['By the Central Limit Theorem, X̄ is close to normal with mean μ and standard error σ ÷ √n. Measure the distance from μ in those units. For a value below the mean, z is negative.', 'The table gives the area to the left of z, which is exactly the probability of a value below the cut-off, so there is nothing to subtract.'],
  solution: `n = ${n(N)} is large, so by the Central Limit Theorem X̄ is close to normal, although single days are not. Its mean is ${n(mu)} mm and its standard error is σ ÷ √n = ${n(s)} ÷ √${n(N)} = ${n(s)} ÷ ${n(r)} = ${n(se)} mm. So z = (${n(c)} − ${n(mu)}) ÷ ${n(se)} = ${n(c - mu)} ÷ ${n(se)} = ${zText(zx, h)}. The question asks for the area below, which is the area to the left, so the table gives it directly: P(X̄ < ${n(c)}) = ${ar(P)}.`,
  guidance: [
   { prompt: `What is the standard error of X̄, σ ÷ √n = ${n(s)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(s)} ÷ ${n(r)} = ${n(se)} mm.` },
   { prompt: `Measure ${n(c)} in standard errors from the mean. What is z = (${n(c)} − ${n(mu)}) ÷ ${n(se)}, rounded to 2 decimal places?`, answer: [h / 100], explanation: `${n(c - mu)} ÷ ${n(se)} = ${zText(zx, h)}.` },
   { prompt: `The row for ${zt(h)} gives ${ar(P)} to the left. What is P(X̄ < ${n(c)})?`, answer: [P / 1e4], explanation: `Below the cut-off is the area to the left of z, so it is the table’s value itself: ${ar(P)}.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The heater’s fuel budget',
 brief: 'The greenhouse heater’s fuel budget holds if the average daily burn stays inside a band, and Mira wants the chance that it does.',
 labels: ['z-score of the lower limit', 'z-score of the upper limit', 'P(a < X̄ < b)'], tolerance: 0.00005,
 gl: [['standard error (kg)'], ['z-score of the lower limit', 'z-score of the upper limit'], ['P(a < X̄ < b)']]
}, {
 canonical: { mu: 30, s: 5, r: 10, ea: 6, eb: 9, oa: 1, ob: 1 },
 draw: R => { let p; do { p = { mu: R.int(15, 60), s: R.int(2, 10), r: R.pick([6, 7, 8, 9, 10]), ea: R.int(2, 20), eb: R.int(2, 20), oa: R.int(0, 2), ob: R.int(0, 2) };
   const za = -p.ea * p.r / (10 * p.s), zb = p.eb * p.r / (10 * p.s);
   p.bad = (100 * p.s) % p.r !== 0 || tie(za) || tie(zb) || Math.abs(za) < 0.3 || Math.abs(zb) < 0.3 || Math.abs(za) > 3.2 || zb > 3.2 || p.mu === 24 && p.s === 4; } while (p.bad); delete p.bad; return p; },
 build: ({ mu, s, r, ea, eb, oa, ob }) => { const N = r * r, se = s / r, a = mu - ea / 10, b = mu + eb / 10, za = -ea * r / (10 * s), zb = eb * r / (10 * s), ha = near(za), hb = near(zb), La = A(ha), Lb = A(hb), P = Lb - La; return {
  prompt: `A greenhouse heater burns a random amount of fuel each day, with mean μ = ${n(mu)} kg and standard deviation σ = ${n(s)} kg; single days are uneven, not bell-shaped. One day’s use does not affect another’s. Over n = ${n(N)} days the average daily fuel use X̄ needs to land between ${n(a)} kg and ${n(b)} kg for the budget to hold. Enter the z-score of ${n(a)} kg for X̄, then the z-score of ${n(b)} kg, both rounded to 2 decimal places, then P(${n(a)} < X̄ < ${n(b)}) to 4 decimal places, worked out from the table rows given here. ${TABLE}: ${rowList([...tri(ha, oa), ...tri(hb, ob)])}.`,
  answer: [ha / 100, hb / 100, P / 1e4],
  hints: ['A band has two limits, so you need two z-scores. Both are measured from μ in standard errors, σ ÷ √n, not in σ.', 'The table gives areas to the left. The area between the limits is the larger left-area minus the smaller one.'],
  solution: `n = ${n(N)} is large, so by the Central Limit Theorem X̄ is close to normal, with mean ${n(mu)} kg and standard error σ ÷ √n = ${n(s)} ÷ ${n(r)} = ${n(se)} kg. For ${n(a)} kg, z = (${n(a)} − ${n(mu)}) ÷ ${n(se)} = ${zText(za, ha)}; for ${n(b)} kg, z = (${n(b)} − ${n(mu)}) ÷ ${n(se)} = ${zText(zb, hb)}. The table gives ${ar(Lb)} to the left of ${zt(hb)} and ${ar(La)} to the left of ${zt(ha)}, so P(${n(a)} < X̄ < ${n(b)}) = ${ar(Lb)} − ${ar(La)} = ${ar(P)}.`,
  guidance: [
   { prompt: `What is the standard error of X̄, σ ÷ √n = ${n(s)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(s)} ÷ ${n(r)} = ${n(se)} kg.` },
   { prompt: `Measure both limits in standard errors from ${n(mu)}. What are the z-scores of ${n(a)} kg and of ${n(b)} kg, rounded to 2 decimal places?`, answer: [ha / 100, hb / 100], explanation: `(${n(a)} − ${n(mu)}) ÷ ${n(se)} = ${zText(za, ha)} and (${n(b)} − ${n(mu)}) ÷ ${n(se)} = ${zText(zb, hb)}.` },
   { prompt: `The rows give ${ar(La)} to the left of ${zt(ha)} and ${ar(Lb)} to the left of ${zt(hb)}. What is the area between them?`, answer: [P / 1e4], explanation: `${ar(Lb)} − ${ar(La)} = ${ar(P)}.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q34', title: 'Where to set the heat alarm',
 brief: 'The greenhouse sets a heat alarm at the level its average high stays under for a chosen share of the time, and Mira has to find that level from a percentile.',
 labels: ['z of the nearest row', 'alarm level c (°C)'], tolerance: 0.005,
 gl: [['z of the nearest row'], ['standard error (°C)'], ['alarm level c (°C)']]
}, {
 canonical: { mu: 20, s: 5, r: 10, k: 90 },
 draw: R => { let p; do { p = { mu: R.int(10, 32), s: R.int(2, 12), r: R.pick([6, 7, 8, 9, 10]), k: R.pick(PCT) }; const h = nearestRow(p.k).h, f = (h * p.s / p.r) - Math.floor(h * p.s / p.r);
   p.bad = (100 * p.s) % p.r !== 0 || Math.abs(f - 0.5) < 0.06 || p.mu === 20 && p.s === 5 && p.k === 75; } while (p.bad); delete p.bad; return p; },
 build: ({ mu, s, r, k }) => { const N = r * r, se = s / r, h = nearestRow(k).h, z = h / 100, x = mu + h * s / (100 * r), off = h * s / (100 * r), xr = r2(x), same = exact2(x), k2 = (k / 100).toFixed(2); return {
  prompt: `The weather station’s daily high temperature has mean μ = ${n(mu)} °C and standard deviation σ = ${n(s)} °C, and its spread is lopsided; one day’s high does not affect another’s. The greenhouse sets its heat alarm at the level c that the average high of n = ${n(N)} days stays below ${n(k)}% of the time, so that P(X̄ < c) is about ${k2}. Use the table row whose area is closest to ${k2}. Enter that row’s z, then the alarm level c in °C, rounded to 2 decimal places. ${TABLE}: ${rowList(tri(h, 1))}.`,
  answer: [z, xr],
  hints: [`By the Central Limit Theorem, X̄ is close to normal with standard error σ ÷ √n. Look down the areas, not the z values, for the one closest to ${k2}.`, 'Then go back from z to a value the way you did for a single reading, but with the standard error in place of σ: c = μ + z × standard error.'],
  solution: `The area to the left of c must be ${k2}, and the closest area in the table is ${ar(A(h))}, in the row z = ${zt(h)}. By the Central Limit Theorem X̄ is close to normal with mean ${n(mu)} °C and standard error σ ÷ √n = ${n(s)} ÷ √${n(N)} = ${n(s)} ÷ ${n(r)} = ${n(se)} °C. So c = μ + z × (standard error) = ${n(mu)} + ${par(z)} × ${n(se)} = ${n(mu)} ${off < 0 ? '−' : '+'} ${n(Math.abs(off))} = ${n(x)}${same ? '' : `, which is ${xr.toFixed(2)} °C to 2 decimal places`}.`,
  guidance: [
   { prompt: `Which z in the table has the area closest to ${k2}?`, answer: [z], explanation: `The area ${ar(A(h))} is the closest to ${k2}, in the row z = ${zt(h)}.` },
   { prompt: `What is the standard error of X̄, σ ÷ √n = ${n(s)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(s)} ÷ ${n(r)} = ${n(se)} °C.` },
   { prompt: `Now c = μ + z × (standard error) = ${n(mu)} + ${par(z)} × ${n(se)}. What is the alarm level, rounded to 2 decimal places?`, answer: [xr], explanation: `${par(z)} × ${n(se)} = ${n(off)}, and ${n(mu)} ${off < 0 ? '−' : '+'} ${n(Math.abs(off))} = ${n(x)}${same ? '' : `, which rounds to ${xr.toFixed(2)}`} °C.` }
  ] }; }
});

/* ---- q39 Normal approximation to the binomial [IS 7.3] ---- */

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'Vials that arrive intact',
 brief: 'A shipment of sealed sample vials is on its way to the station, and the lab wants the chance that no more than a few arrive intact.',
 labels: ['mean np', 'z-score', 'P(X ≤ k)'], tolerance: 0.00005,
 gl: [['mean np', 'standard deviation'], ['z-score'], ['P(X ≤ k)']]
}, {
 canonical: { nn: 225, pr: 0.2, k: 40, o: 1 },
 draw: R => { let p; do { const [nn, pr, sd] = BIN[R.int(0, BIN.length - 1)]; p = { nn, pr, k: Math.round(nn * pr) - R.int(1, Math.floor(2.6 * sd)), o: R.int(0, 2) }; const zx = (p.k + 0.5 - nn * pr) / sd;
   p.bad = tie(zx) || Math.abs(zx) < 0.1 || p.k < 0 || nn === 100 && pr === 0.9 && p.k === 85; } while (p.bad); delete p.bad; return p; },
 build: ({ nn, pr, k, o }) => { const sd = spread(BIN, nn, pr), qr = q100(pr), np = Math.round(nn * pr * 100) / 100, npq = Math.round(nn * pr * qr * 100) / 100, cut = k + 0.5, zx = (cut - np) / sd, h = near(zx), P = A(h); return {
  prompt: `A shipment of ${n(nn)} sealed sample vials is flown to the station. Each vial independently arrives intact with probability ${n(pr)}. Use the normal approximation, with the continuity correction, to find the probability that at most ${n(k)} vials arrive intact. Enter the mean number intact, np, then the z-score of the corrected cut-off, rounded to 2 decimal places, then the approximate P(X ≤ ${n(k)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [np, h / 100, P / 1e4],
  hints: ['The count X is binomial, with mean np and standard deviation √(npq), where q = 1 − p. Check that np and nq are both at least 5 before trusting the curve.', '“At most k” includes the bar for k, whose right edge is at k + 0.5, so the cut-off moves up by half a step. The table gives the area to the left of the cut-off.'],
  solution: `X is binomial with n = ${n(nn)} and p = ${n(pr)}, so q = ${n(qr)}. Its mean is np = ${n(nn)} × ${n(pr)} = ${n(np)} and its standard deviation is √(npq) = √(${n(nn)} × ${n(pr)} × ${n(qr)}) = √${n(npq)} = ${n(sd)}. The bar for ${n(k)} vials runs from ${n(k)} − 0.5 to ${n(k)} + 0.5, so with the continuity correction “at most ${n(k)}” ends at ${n(cut)}. Then z = (${n(cut)} − ${n(np)}) ÷ ${n(sd)} = ${zText(zx, h)}. The area to the left is what the table gives: P(X ≤ ${n(k)}) ≈ ${ar(P)}.`,
  guidance: [
   { prompt: `What are the mean np and the standard deviation √(npq) of the count, for n = ${n(nn)} and p = ${n(pr)}?`, answer: [np, sd], explanation: `np = ${n(nn)} × ${n(pr)} = ${n(np)}, and √(npq) = √(${n(nn)} × ${n(pr)} × ${n(qr)}) = √${n(npq)} = ${n(sd)}.` },
   { prompt: `The corrected cut-off is ${n(k)} + 0.5 = ${n(cut)}. What is its z-score, rounded to 2 decimal places?`, answer: [h / 100], explanation: `(${n(cut)} − ${n(np)}) ÷ ${n(sd)} = ${zText(zx, h)}.` },
   { prompt: `The row for ${zt(h)} gives ${ar(P)} to the left. What is the approximate P(X ≤ ${n(k)})?`, answer: [P / 1e4], explanation: `“At most” is the area to the left, so it is the table’s value: ${ar(P)}.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Sensors left online',
 brief: 'After a storm the mast crew need the chance that the number of wind sensors still online falls in the range the forecast model can use.',
 labels: ['z-score of the lower cut-off', 'z-score of the upper cut-off', 'P(a ≤ X ≤ b)'], tolerance: 0.00005,
 gl: [['mean np', 'standard deviation'], ['z-score of the lower cut-off', 'z-score of the upper cut-off'], ['P(a ≤ X ≤ b)']]
}, {
 canonical: { nn: 100, pr: 0.5, a: 46, b: 57, oa: 1, ob: 1 },
 draw: R => { let p; do { const [nn, pr, sd] = BIN[R.int(0, BIN.length - 1)], m = Math.round(nn * pr), w = Math.floor(2.4 * sd);
   p = { nn, pr, a: m - R.int(1, w), b: m + R.int(1, w), oa: R.int(0, 2), ob: R.int(0, 2) };
   const za = (p.a - 0.5 - nn * pr) / sd, zb = (p.b + 0.5 - nn * pr) / sd;
   p.bad = tie(za) || tie(zb) || Math.abs(za) < 0.1 || Math.abs(zb) < 0.1 || near(zb) - near(za) < 6 || p.a < 0 || nn === 144 && pr === 0.5 && p.a === 70; } while (p.bad); delete p.bad; return p; },
 build: ({ nn, pr, a, b, oa, ob }) => { const sd = spread(BIN, nn, pr), qr = q100(pr), np = Math.round(nn * pr * 100) / 100, npq = Math.round(nn * pr * qr * 100) / 100, ca = a - 0.5, cb = b + 0.5, za = (ca - np) / sd, zb = (cb - np) / sd, ha = near(za), hb = near(zb), La = A(ha), Lb = A(hb), P = Lb - La; return {
  prompt: `Each of the ${n(nn)} wind sensors on the station’s mast independently stays online through a storm with probability ${n(pr)}. Use the normal approximation, with the continuity correction, to find the probability that between ${n(a)} and ${n(b)} sensors, both numbers included, stay online. Enter the z-score of the lower corrected cut-off, then the z-score of the upper corrected cut-off, both rounded to 2 decimal places, then the approximate P(${n(a)} ≤ X ≤ ${n(b)}) to 4 decimal places, worked out from the table rows given here. ${TABLE}: ${rowList([...tri(ha, oa), ...tri(hb, ob)])}.`,
  answer: [ha / 100, hb / 100, P / 1e4],
  hints: ['“Between ${a} and ${b}, both included” takes in the bar for each end. The region starts at the left edge of the lowest bar and finishes at the right edge of the highest bar.'.replace('${a}', n(a)).replace('${b}', n(b)), 'Both z-scores use the same mean np and standard deviation √(npq). The area between the cut-offs is the larger left-area minus the smaller one.'],
  solution: `X is binomial with n = ${n(nn)} and p = ${n(pr)}, so q = ${n(qr)}. Its mean is np = ${n(np)} and its standard deviation is √(npq) = √${n(npq)} = ${n(sd)}. The bar for ${n(a)} starts at ${n(a)} − 0.5 = ${n(ca)} and the bar for ${n(b)} ends at ${n(b)} + 0.5 = ${n(cb)}. So z = (${n(ca)} − ${n(np)}) ÷ ${n(sd)} = ${zText(za, ha)} and z = (${n(cb)} − ${n(np)}) ÷ ${n(sd)} = ${zText(zb, hb)}. The table gives ${ar(Lb)} to the left of ${zt(hb)} and ${ar(La)} to the left of ${zt(ha)}, so P(${n(a)} ≤ X ≤ ${n(b)}) ≈ ${ar(Lb)} − ${ar(La)} = ${ar(P)}.`,
  guidance: [
   { prompt: `What are the mean np and the standard deviation √(npq) of the count, for n = ${n(nn)} and p = ${n(pr)}?`, answer: [np, sd], explanation: `np = ${n(nn)} × ${n(pr)} = ${n(np)}, and √(npq) = √(${n(nn)} × ${n(pr)} × ${n(qr)}) = √${n(npq)} = ${n(sd)}.` },
   { prompt: `The corrected cut-offs are ${n(a)} − 0.5 = ${n(ca)} and ${n(b)} + 0.5 = ${n(cb)}. What are their z-scores, rounded to 2 decimal places?`, answer: [ha / 100, hb / 100], explanation: `(${n(ca)} − ${n(np)}) ÷ ${n(sd)} = ${zText(za, ha)} and (${n(cb)} − ${n(np)}) ÷ ${n(sd)} = ${zText(zb, hb)}.` },
   { prompt: `The rows give ${ar(La)} to the left of ${zt(ha)} and ${ar(Lb)} to the left of ${zt(hb)}. What is the area between them?`, answer: [P / 1e4], explanation: `${ar(Lb)} − ${ar(La)} = ${ar(P)}, so P(${n(a)} ≤ X ≤ ${n(b)}) is about ${ar(P)}.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q21', title: 'More than the quota',
 brief: 'A batch of soil probes ships only if more than a quota pass calibration, and the spread of the count does not come out as a whole number this time.',
 labels: ['z-score', 'P(X > k)'], tolerance: 0.00005,
 gl: [['mean np', 'npq'], ['z-score'], ['P(X > k)']]
}, {
 canonical: { nn: 200, pr: 0.3, k: 66, o: 1 },
 draw: R => { let p; do { const [nn, pr] = IRR[R.int(0, IRR.length - 1)], np = Math.round(nn * pr), sd = Math.sqrt(nn * pr * q100(pr)); p = { nn, pr, k: np + R.int(2, Math.floor(2.4 * sd)), o: R.int(0, 2) };
   const zx = (p.k + 0.5 - np) / sd, zr = (p.k + 0.5 - np) / r2(sd); p.bad = tie(zx) || near(zx) !== near(zr) || Math.abs(zx) < 0.3; } while (p.bad); delete p.bad; return p; },
 build: ({ nn, pr, k, o }) => { const qr = q100(pr), np = Math.round(nn * pr), npq = Math.round(nn * pr * qr * 100) / 100, sd = Math.sqrt(npq), cut = k + 0.5, zx = (cut - np) / sd, h = near(zx), L = A(h), P = 1e4 - L; return {
  prompt: `A batch of ${n(nn)} soil probes is calibrated, and each probe independently passes with probability ${n(pr)}. The batch ships only if more than ${n(k)} probes pass. Use the normal approximation, with the continuity correction, to find P(X > ${n(k)}). The standard deviation √(npq) will not come out whole, so keep at least 3 decimal places until you have the z-score. Enter the z-score of the corrected cut-off, rounded to 2 decimal places, then the approximate P(X > ${n(k)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [h / 100, P / 1e4],
  hints: ['“More than k” means k + 1 or more, so the first bar in the event is the one for k + 1, whose left edge is at k + 0.5. That is the cut-off, with the area to its right wanted.', 'The standard deviation is √(npq), where q = 1 − p. Divide by it only after taking its square root to 3 decimal places or more, or the z-score may land on the wrong row.'],
  solution: `X is binomial with n = ${n(nn)} and p = ${n(pr)}, so q = ${n(qr)}. Its mean is np = ${n(nn)} × ${n(pr)} = ${n(np)} and npq = ${n(nn)} × ${n(pr)} × ${n(qr)} = ${n(npq)}, so its standard deviation is √${n(npq)} = ${(Math.round(sd * 1e4) / 1e4).toFixed(4)}. “More than ${n(k)}” means ${n(k + 1)} or more, whose bar starts at ${n(k + 1)} − 0.5 = ${n(cut)}. Then z = (${n(cut)} − ${n(np)}) ÷ ${(Math.round(sd * 1e4) / 1e4).toFixed(4)} = ${zText(zx, h)}. The table gives ${ar(L)} to the left of ${zt(h)}, so P(X > ${n(k)}) ≈ 1 − ${ar(L)} = ${ar(P)}.`,
  guidance: [
   { prompt: `What are the mean np and the value of npq, for n = ${n(nn)} and p = ${n(pr)}?`, answer: [np, npq], explanation: `np = ${n(nn)} × ${n(pr)} = ${n(np)}, and npq = ${n(nn)} × ${n(pr)} × ${n(qr)} = ${n(npq)}.` },
   { prompt: `The standard deviation is √${n(npq)}, about ${(Math.round(sd * 1e4) / 1e4).toFixed(4)}. The corrected cut-off is ${n(k)} + 0.5 = ${n(cut)}. What is its z-score, rounded to 2 decimal places?`, answer: [h / 100], explanation: `(${n(cut)} − ${n(np)}) ÷ ${(Math.round(sd * 1e4) / 1e4).toFixed(4)} = ${zText(zx, h)}.` },
   { prompt: `The row for ${zt(h)} gives ${ar(L)} to the left. What is the area to the right, the approximate P(X > ${n(k)})?`, answer: [P / 1e4], explanation: `1 − ${ar(L)} = ${ar(P)}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Data and inference: how surprising is this sample? [IS 7.3] ---- */

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Do the seed packs keep their promise?',
 brief: 'A nursery claims a fixed share of its seeds sprout in a week, and the greenhouse wants to know whether its own tray is an unlucky sample or a sign the claim is wrong.',
 labels: ['standard error', 'z-score', 'tail probability'], tolerance: 0.00005,
 gl: [['standard error'], ['z-score'], ['tail probability']]
}, {
 canonical: { nn: 400, pr: 0.2, k: 68, o: 1 },
 draw: R => { let p; do { const [nn, pr, se] = PROP[R.int(0, PROP.length - 1)]; p = { nn, pr, k: Math.round(nn * pr) + R.nz(-Math.floor(3 * se * nn), Math.floor(3 * se * nn)), o: R.int(0, 2) }; const zx = (p.k - nn * pr) / (nn * se);
   p.bad = tie(zx) || Math.abs(zx) < 0.3 || Math.abs(zx) > 3.2 || nn === 100 && pr === 0.5 && (p.k === 41 || p.k === 59); } while (p.bad); delete p.bad; return p; },
 build: ({ nn, pr, k, o }) => { const se = spread(PROP, nn, pr), qr = q100(pr), ph = k / nn, zx = (k - nn * pr) / (nn * se), h = near(zx), L = A(h), P = h < 0 ? L : 1e4 - L, over = h > 0; return {
  prompt: `A nursery claims that a share p = ${n(pr)} of its seeds sprout within a week. The greenhouse sows ${n(nn)} seeds and ${n(k)} sprout. If the claim is right, how surprising is a sample proportion at least this far ${over ? 'above' : 'below'} p? Enter the standard error of the sample proportion p̂ = ${n(k)} ÷ ${n(nn)}, then the z-score of p̂, rounded to 2 decimal places, then the probability of a sample proportion at least this far out on the same side, to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [se, h / 100, P / 1e4],
  hints: ['If the claim is right, p̂ = X ÷ n is close to normal with mean p and standard error √(pq ÷ n), where q = 1 − p. Measure p̂ in standard errors from p.', 'The tail is on the side of the mean where p̂ fell: the table’s area itself for a z below zero, and 1 minus the table’s area for a z above zero.'],
  solution: `The sample proportion is p̂ = ${n(k)} ÷ ${n(nn)} = ${n(ph)}. If the claim is right, p̂ is close to normal with mean ${n(pr)} and standard error √(pq ÷ n) = √(${n(pr)} × ${n(qr)} ÷ ${n(nn)}) = ${n(se)}. So z = (${n(ph)} − ${n(pr)}) ÷ ${n(se)} = ${zText(zx, h)}. ${over ? `The sample proportion is above the mean, so the tail is the area to the right of ${zt(h)}: 1 − ${ar(L)} = ${ar(P)}.` : `The sample proportion is below the mean, so the tail is the area to the left of ${zt(h)}, which the table gives directly: ${ar(P)}.`} ${P < 500 ? 'Fewer than 5 samples in 100 would land this far out by chance, so this one is surprising: the claim may be wrong.' : 'A sample this far out turns up by chance more than 5 times in 100, so on its own it is not surprising.'}`,
  guidance: [
   { prompt: `What is the standard error of the sample proportion, √(pq ÷ n) = √(${n(pr)} × ${n(qr)} ÷ ${n(nn)})?`, answer: [se], explanation: `${n(pr)} × ${n(qr)} = ${n(pr * qr)}, whose square root is ${n(Math.sqrt(pr * qr))}, and √${n(nn)} = ${n(Math.sqrt(nn))}, so the standard error is ${n(Math.sqrt(pr * qr))} ÷ ${n(Math.sqrt(nn))} = ${n(se)}.` },
   { prompt: `How many standard errors from p is p̂ = ${n(ph)}? Enter z = (${n(ph)} − ${n(pr)}) ÷ ${n(se)}, rounded to 2 decimal places.`, answer: [h / 100], explanation: `${n(ph - pr)} ÷ ${n(se)} = ${zText(zx, h)}.` },
   { prompt: `The row for ${zt(h)} gives ${ar(L)} to the left. What is the probability of a sample proportion at least this far out on the same side?`, answer: [P / 1e4], explanation: over ? `The tail is on the right: 1 − ${ar(L)} = ${ar(P)}.` : `The tail is on the left, so it is the table’s area itself: ${ar(P)}.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Did the new cable change the beds?',
 brief: 'A new heating cable has gone into the greenhouse beds, and Mira has to say whether the soil’s new average is a fluke or a real change.',
 labels: ['z-score', 'tail probability', 'surprising (1 or 0)'], tolerance: 0.00005,
 gl: [['standard error (°C)', 'z-score'], ['tail probability'], ['surprising (1 or 0)']]
}, {
 canonical: { mu: 14, s: 3, r: 10, e: -6, o: 2 },
 draw: R => { let p; do { p = { mu: R.int(10, 30), s: R.int(2, 12), r: R.pick([6, 7, 8, 9, 10]), e: R.nz(-30, 30), o: R.int(0, 2) }; const zx = p.e * p.r / (10 * p.s), h = near(zx), L = A(h), P = h < 0 ? L : 1e4 - L;
   p.bad = (100 * p.s) % p.r !== 0 || tie(zx) || Math.abs(zx) < 0.3 || Math.abs(zx) > 3.2 || Math.abs(P - 500) < 40 || p.mu === 12 && p.s === 4; } while (p.bad); delete p.bad; return p; },
 build: ({ mu, s, r, e, o }) => { const N = r * r, se = s / r, c = mu + e / 10, zx = e * r / (10 * s), h = near(zx), L = A(h), P = h < 0 ? L : 1e4 - L, over = e > 0, v = P < 500 ? 1 : 0; return {
  prompt: `Soil temperature in the greenhouse beds has a long-run mean of μ = ${n(mu)} °C and a standard deviation of σ = ${n(s)} °C for a single daily reading. After a new heating cable is fitted, the last ${n(N)} daily readings average x̄ = ${n(c)} °C. If the cable changed nothing, how surprising is a sample mean at least this far ${over ? 'above' : 'below'} μ? Enter the z-score of x̄, rounded to 2 decimal places, then the probability of a sample mean at least this far out on the same side, to 4 decimal places, then 1 if that probability is under 0.05 (surprising) or 0 if it is not. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [h / 100, P / 1e4, v],
  hints: ['If the cable changed nothing, the sample mean X̄ is close to normal with mean μ and standard error σ ÷ √n. Measure x̄ in standard errors from μ.', 'For a value below the mean the tail is the area to the left, read straight from the table. For a value above the mean it is 1 minus the table’s area. Then compare the tail with 0.05.'],
  solution: `If the cable changed nothing, the Central Limit Theorem makes X̄ close to normal with mean ${n(mu)} °C and standard error σ ÷ √n = ${n(s)} ÷ √${n(N)} = ${n(s)} ÷ ${n(r)} = ${n(se)} °C. So z = (${n(c)} − ${n(mu)}) ÷ ${n(se)} = ${n(e / 10)} ÷ ${n(se)} = ${zText(zx, h)}. ${over ? `The sample mean is above μ, so the tail is the area to the right of ${zt(h)}: 1 − ${ar(L)} = ${ar(P)}.` : `The sample mean is below μ, so the tail is the area to the left of ${zt(h)}, which the table gives directly: ${ar(P)}.`} ${v ? `That is under 0.05: fewer than 5 samples in 100 would land this far out by chance, so the sample is surprising and the cable may well have changed the beds. Answer 1.` : `That is over 0.05: a sample this far out turns up by chance more than 5 times in 100, so it is not surprising and gives no reason to think the cable changed anything. Answer 0.`}`,
  guidance: [
   { prompt: `What is the standard error of the sample mean, σ ÷ √n = ${n(s)} ÷ √${n(N)}, and the z-score of x̄ = ${n(c)}, rounded to 2 decimal places?`, answer: [se, h / 100], explanation: `√${n(N)} = ${n(r)}, so the standard error is ${n(s)} ÷ ${n(r)} = ${n(se)} °C, and z = (${n(c)} − ${n(mu)}) ÷ ${n(se)} = ${zText(zx, h)}.` },
   { prompt: `The row for ${zt(h)} gives ${ar(L)} to the left. What is the probability of a sample mean at least this far out on the same side?`, answer: [P / 1e4], explanation: over ? `The tail is on the right: 1 − ${ar(L)} = ${ar(P)}.` : `The tail is on the left, so it is the table’s area itself: ${ar(P)}.` },
   { prompt: `Is ${ar(P)} under 0.05? Enter 1 if it is, 0 if it is not.`, answer: [v], explanation: v ? `${ar(P)} is under 0.05, so the sample is surprising: 1.` : `${ar(P)} is not under 0.05, so the sample is not surprising: 0.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q39', title: 'Two ways to count a surprise',
 brief: 'The same count of working rain gauges can be judged as a proportion or as a count, and Mira wants to see how much the half-step correction moves the answer.',
 labels: ['z-score, proportion way', 'tail, proportion way', 'z-score, count way', 'tail, count way'], tolerance: 0.00005,
 gl: [['z-score, proportion way'], ['tail, proportion way'], ['z-score, count way'], ['tail, count way']]
}, {
 canonical: { nn: 100, pr: 0.5, k: 60, o1: 1, o2: 1 },
 draw: R => { let p; do { const [nn, pr, sd] = TWO[R.int(0, TWO.length - 1)], np = nn * pr; p = { nn, pr, k: np + R.int(2, Math.floor(2.6 * sd)), o1: R.int(0, 2), o2: R.int(0, 2) };
   const z1 = (p.k - np) / sd, z2 = (p.k - 0.5 - np) / sd; p.bad = tie(z1) || tie(z2) || Math.abs(z2) < 0.3 || near(z1) === near(z2) || nn === 400 && pr === 0.5 && p.k === 215 || nn === 100 && pr === 0.5 && p.k === 59; } while (p.bad); delete p.bad; return p; },
 build: ({ nn, pr, k, o1, o2 }) => { const sd = spread(TWO, nn, pr), qr = q100(pr), se = sd / nn, np = nn * pr, ph = k / nn, cut = k - 0.5, z1 = (k - np) / sd, z2 = (cut - np) / sd, h1 = near(z1), h2 = near(z2), L1 = A(h1), L2 = A(h2), P1 = 1e4 - L1, P2 = 1e4 - L2; return {
  prompt: `Each of the station’s ${n(nn)} remote rain gauges is expected to report on time with probability p = ${n(pr)}, independently of the others. Tonight ${n(k)} of them reported on time. Mira judges how surprising that is in two ways. Way one treats the sample proportion p̂ = ${n(k)} ÷ ${n(nn)} as normal with mean p and standard error √(pq ÷ n), and takes the tail beyond p̂. Way two treats the count X as normal with mean np and standard deviation √(npq), and finds P(X ≥ ${n(k)}) with the continuity correction. Enter the z-score of way one, its tail probability, the z-score of way two, then its tail probability. Round z-scores to 2 decimal places and probabilities to 4. ${TABLE}: ${rowList([...tri(h1, o1), ...tri(h2, o2)])}.`,
  answer: [h1 / 100, P1 / 1e4, h2 / 100, P2 / 1e4],
  hints: ['Way one uses p̂ itself, with no half-step. Way two is the count method: for “at least k” the cut-off moves down to k − 0.5.', 'Both tails are on the right, so each is 1 minus the table’s area. Expect way two to give the larger tail, because its cut-off is lower.'],
  solution: `Way one: p̂ = ${n(k)} ÷ ${n(nn)} = ${n(ph)}, and the standard error is √(pq ÷ n) = √(${n(pr)} × ${n(qr)} ÷ ${n(nn)}) = ${n(se)}. So z = (${n(ph)} − ${n(pr)}) ÷ ${n(se)} = ${zText(z1, h1)}, and the tail to the right is 1 − ${ar(L1)} = ${ar(P1)}. Way two: the mean is np = ${n(np)} and the standard deviation is √(npq) = ${n(sd)}. “At least ${n(k)}” starts at ${n(k)} − 0.5 = ${n(cut)}, so z = (${n(cut)} − ${n(np)}) ÷ ${n(sd)} = ${zText(z2, h2)}, and the tail is 1 − ${ar(L2)} = ${ar(P2)}. The half-step makes the count’s tail ${n(Math.round((P2 - P1) / 1e4 * 1e4) / 1e4)} larger, the more honest figure for a whole-number count.`,
  guidance: [
   { prompt: `Way one: the standard error is √(pq ÷ n) = ${n(se)}. What is the z-score of p̂ = ${n(ph)}, rounded to 2 decimal places?`, answer: [h1 / 100], explanation: `(${n(ph)} − ${n(pr)}) ÷ ${n(se)} = ${n(ph - pr)} ÷ ${n(se)} = ${zText(z1, h1)}.` },
   { prompt: `The row for ${zt(h1)} gives ${ar(L1)} to the left. What is the tail to the right?`, answer: [P1 / 1e4], explanation: `1 − ${ar(L1)} = ${ar(P1)}.` },
   { prompt: `Way two: the mean is ${n(np)} and the standard deviation is ${n(sd)}. For “at least ${n(k)}” the cut-off is ${n(cut)}. What is its z-score, rounded to 2 decimal places?`, answer: [h2 / 100], explanation: `z = (${n(cut)} − ${n(np)}) ÷ ${n(sd)} = ${zText(z2, h2)}.` },
   { prompt: `The row for ${zt(h2)} gives ${ar(L2)} to the left. What is the tail to the right?`, answer: [P2 / 1e4], explanation: `1 − ${ar(L2)} = ${ar(P2)}.` }
  ] }; }
});

})();
