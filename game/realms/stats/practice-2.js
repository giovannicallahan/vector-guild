/* Data and inference practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p2.js. */
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

/* Small helpers (the same ones gen-a.js uses). list: "3, 6, 8"; sum; sorted copy; median of a sorted list; r2: round to
   2 decimals; tie2: a value whose third decimal is exactly 5, filtered from draws; exact2: at most 2 decimals; f2: two
   decimals always shown; say2: "= 3.5" or "≈ 3.6742, which rounds to 3.67". */
const list = xs => xs.map(n).join(', ');
const sum = xs => xs.reduce((s, x) => s + x, 0);
const sorted = xs => xs.slice().sort((a, b) => a - b);
const med = s => s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
const r2 = x => Math.round(x * 100 + 1e-9) / 100;
const tie2 = x => Math.abs(x * 100 - Math.floor(x * 100 + 1e-9) - 0.5) < 1e-6;
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const f2 = x => r2(x).toFixed(2).replace('-', '−');
const say2 = x => exact2(x) ? `= ${n(x)}` : n(x) === n(r2(x)) ? `≈ ${n(x)}` : `≈ ${n(x)}, which rounds to ${f2(x)}`;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const shuffle = (R, xs) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const halves = s => { const h = Math.floor(s.length / 2); return { lower: s.slice(0, h), upper: s.slice(s.length - h) }; };
const quart = s => { const { lower, upper } = halves(s); return { lower, upper, m: med(s), q1: med(lower), q3: med(upper) }; };
const ordN = k => { const r = k % 100, t = k % 10; return k + (r >= 11 && r <= 13 ? 'th' : t === 1 ? 'st' : t === 2 ? 'nd' : t === 3 ? 'rd' : 'th'); };
const medSay = (s, noun) => s.length % 2
 ? `the ${ordN((s.length + 1) / 2)} ${noun}, ${n(med(s))}`
 : `halfway between the ${ordN(s.length / 2)} and ${ordN(s.length / 2 + 1)} ${noun}s: (${n(s[s.length / 2 - 1])} + ${n(s[s.length / 2])}) ÷ 2 = ${n(med(s))}`;
const spread = xs => { const N = xs.length, mean = sum(xs) / N, dev = xs.map(x => x - mean), sq = dev.map(d => d * d), SS = sum(sq), s2 = SS / (N - 1); return { N, mean, dev, sq, SS, s2, s: Math.sqrt(s2) }; };
const andList = xs => xs.length < 2 ? xs.map(n).join('') : xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
const mm = x => x === 1 ? 'millimetre' : 'millimetres';
const plural = (k, one, many) => k === 1 ? one : many;

/* ---- q06 IQR, box plots and outliers [2.3, 2.4] ---- */

/* Sorted readings: a steady climb from 40 to 70 upwards in steps of 1 to 4, then hiK of the top readings raised and lowK
   of the bottom readings lowered. */
const climb = (R, N, lowK, hiK) => { const x = [R.int(40, 70)]; while (x.length < N) x.push(x[x.length - 1] + R.int(1, 4));
 if (hiK) { const J = R.int(8, 30); for (let i = N - hiK; i < N; i++) x[i] += J + (i - (N - hiK)) * R.int(0, 6); }
 if (lowK) { const J = R.int(10, 30); for (let i = 0; i < lowK; i++) x[i] -= J + (lowK - 1 - i) * R.int(0, 6); }
 return sorted(x); };
/* Quartiles, fences and the outliers of sorted readings. ok: the IQR is positive and no reading sits on a fence. */
const fences = x => { const Q = quart(x), I = Q.q3 - Q.q1, st = 1.5 * I, lf = Q.q1 - st, uf = Q.q3 + st, out = x.filter(v => v < lf || v > uf), rest = x.filter(v => v >= lf && v <= uf);
 return { Q, I, st, lf, uf, out, rest, k: out.length, ok: I > 0 && !x.some(v => v === lf || v === uf) }; };
const outSay = (F, x) => F.k === 0 ? 'Every reading lies between the fences, so there are no outliers.'
 : F.k === 1 ? `Only ${n(F.out[0])} lies outside the fences, so there is 1 outlier.` : `${andList(F.out)} lie outside the fences, so there are ${n(F.k)} outliers.`;
const halfNote = 'with an odd number of readings the median is left out of both halves';

/* Parent worked example: 12, 14, 15, 16, 18, 19, 21, 22, 40. */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The rover charge log',
 brief: 'Some rover charges ran out far too early, and the depot wants a plain rule for which ones to look into.',
 labels: ['IQR', 'lower fence', 'outliers'], tolerance: 0.005,
 gl: [['Q1', 'Q3'], ['IQR', 'lower fence'], ['outliers']]
}, {
 canonical: { x: [33, 55, 57, 58, 60, 61, 63, 64, 66, 67] },
 draw: R => { let x, F; do { x = climb(R, R.int(9, 12), R.int(1, 2), R.int(0, 1)); F = fences(x); } while (!F.ok || F.k < 1); return { x }; },
 build: ({ x }) => { const N = x.length, F = fences(x), { Q, I, st, lf, uf, k } = F; return {
  prompt: `The depot’s rover charge log lists how many hours each rover ran on ${n(N)} full charges, sorted: ${list(x)}. Find Q1 and Q3 by the median-of-halves method (${halfNote}). Enter the interquartile range IQR = Q3 − Q1, then the lower fence Q1 − 1.5 × IQR, then the number of outliers: charges below the lower fence or above the upper fence Q3 + 1.5 × IQR.`,
  answer: [I, lf, k],
  hints: ['Q1 is the median of the lower half and Q3 is the median of the upper half. The IQR is the gap between them.', 'Take 1.5 times the IQR away from Q1 for the lower fence and add it to Q3 for the upper fence. A charge can be an outlier at either end, so check both fences.'],
  solution: `The lower half is ${list(Q.lower)}, so Q1 = ${n(Q.q1)}; the upper half is ${list(Q.upper)}, so Q3 = ${n(Q.q3)}. IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)}, and 1.5 × ${n(I)} = ${n(st)}. The lower fence is ${n(Q.q1)} − ${n(st)} = ${n(lf)} and the upper fence is ${n(Q.q3)} + ${n(st)} = ${n(uf)}. ${outSay(F, x)}`,
  guidance: [
   { prompt: `Split the ${n(N)} readings into a lower and an upper half${N % 2 ? ', leaving the median out' : ''}. What are Q1 and Q3?`, answer: [Q.q1, Q.q3], explanation: `Lower half ${list(Q.lower)} gives Q1 = ${n(Q.q1)}; upper half ${list(Q.upper)} gives Q3 = ${n(Q.q3)}.` },
   { prompt: `Q1 = ${n(Q.q1)} and Q3 = ${n(Q.q3)}. What are the IQR and the lower fence Q1 − 1.5 × IQR?`, answer: [I, lf], explanation: `IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)}. 1.5 × ${n(I)} = ${n(st)}, so the lower fence is ${n(Q.q1)} − ${n(st)} = ${n(lf)}.` },
   { prompt: `The upper fence is ${n(uf)}. How many of the ${n(N)} readings lie below ${n(lf)} or above ${n(uf)}?`, answer: [k], explanation: k === 0 ? `None: the smallest reading, ${n(x[0])}, and the largest, ${n(x[N - 1])}, are both inside the fences.` : `${andList(F.out)} ${plural(k, 'is', 'are')} outside the fences, so the count is ${n(k)}.` }
  ] }; }
});

/* A water main's pressure readings with 1 to 3 outliers at either end. The mean of the unflagged readings is an exact
   decimal with at most 1 place, and at least 7 readings are left. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The water main re-checks',
 brief: 'Every odd pressure reading on the water main gets re-checked by hand, and the Records Office needs the bill and the clean average.',
 labels: ['flagged points', 'total minutes', 'mean of the rest'], tolerance: 0.005,
 gl: [['lower fence', 'upper fence'], ['flagged points', 'total minutes'], ['mean of the rest']]
}, {
 canonical: { x: [48, 71, 74, 75, 77, 78, 80, 82, 83, 91, 111], c: 12 },
 draw: R => { let x, F, c; do { const N = R.int(10, 13); x = climb(R, N, R.int(0, 2), R.int(0, 2)); F = fences(x); c = R.pick([6, 8, 10, 12, 15, 20]); }
  while (!F.ok || F.k < 1 || F.k > 3 || F.rest.length < 7 || (10 * sum(F.rest)) % F.rest.length !== 0); return { x, c }; },
 build: ({ x, c }) => { const N = x.length, F = fences(x), { Q, I, st, lf, uf, out, rest, k } = F, cost = k * c, S = sum(rest), mean = S / rest.length; return {
  prompt: `The Records Office logged the pressure, in kilopascals, at ${n(N)} points along the water main, sorted: ${list(x)}. Find Q1 and Q3 by the median-of-halves method (${halfNote}). A point is flagged if it is an outlier: below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR. Each flagged point costs ${n(c)} technician minutes to re-check. Enter how many points are flagged, then the total re-check minutes, then the mean pressure of the points that are not flagged, as an exact decimal.`,
  answer: [k, cost, mean],
  hints: ['Find Q1 and Q3, then the IQR = Q3 − Q1. Take 1.5 times the IQR away from Q1 and add it to Q3: those are the two fences.', 'The bill is the number of flagged points times the minutes for one. For the last answer leave the flagged points out, then add the rest and divide by how many are left.'],
  solution: `The lower half is ${list(Q.lower)}, so Q1 = ${n(Q.q1)}; the upper half is ${list(Q.upper)}, so Q3 = ${n(Q.q3)}. IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)} and 1.5 × ${n(I)} = ${n(st)}. The fences are ${n(Q.q1)} − ${n(st)} = ${n(lf)} and ${n(Q.q3)} + ${n(st)} = ${n(uf)}. ${andList(out)} ${plural(k, 'lies', 'lie')} outside them, so ${n(k)} ${plural(k, 'point is', 'points are')} flagged and the re-checks take ${n(k)} × ${n(c)} = ${n(cost)} minutes. The other ${n(rest.length)} points add up to ${n(S)}, so their mean is ${n(S)} ÷ ${n(rest.length)} = ${n(mean)} kilopascals.`,
  guidance: [
   { prompt: `Find Q1 and Q3 (${halfNote}), then the IQR. What are the lower fence Q1 − 1.5 × IQR and the upper fence Q3 + 1.5 × IQR?`, answer: [lf, uf], explanation: `Q1 = ${n(Q.q1)} and Q3 = ${n(Q.q3)}, so IQR = ${n(I)} and 1.5 × ${n(I)} = ${n(st)}. The fences are ${n(Q.q1)} − ${n(st)} = ${n(lf)} and ${n(Q.q3)} + ${n(st)} = ${n(uf)}.` },
   { prompt: `How many of the ${n(N)} readings lie below ${n(lf)} or above ${n(uf)}, and how many technician minutes do they cost at ${n(c)} minutes each?`, answer: [k, cost], explanation: `${andList(out)} ${plural(k, 'is', 'are')} outside the fences, so ${n(k)} ${plural(k, 'point is', 'points are')} flagged: ${n(k)} × ${n(c)} = ${n(cost)} minutes.` },
   { prompt: `Leave the flagged ${plural(k, 'point', 'points')} out. The other ${n(rest.length)} readings add up to ${n(S)}. What is their mean?`, answer: [mean], explanation: `${n(S)} ÷ ${n(rest.length)} = ${n(mean)} kilopascals.` }
  ] }; }
});

/* Relay delays in the order they came in, 13 to 16 of them, with outliers; the median is needed to split them (q03). */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q03', title: 'The relay beacon pings',
 brief: 'The relay beacon on the ridge has been dropping signals, and Mira wants to know how much its odd delays drag the middle of the log.',
 labels: ['IQR', 'outliers', 'median of all', 'median without outliers'], tolerance: 0.005,
 gl: [['median', 'Q1', 'Q3'], ['IQR', 'lower fence', 'upper fence'], ['outliers', 'median without outliers']]
}, {
 canonical: { x: [66, 48, 71, 29, 63, 69, 62, 74, 64, 67, 72, 61, 68, 65, 102] },
 draw: R => { let x, F; do { const s = climb(R, R.int(13, 16), R.int(0, 2), R.int(0, 2)); x = shuffle(R, s); F = fences(s); } while (!F.ok || F.k < 1 || F.rest.length < 10); return { x }; },
 build: ({ x }) => { const N = x.length, s = sorted(x), F = fences(s), { Q, I, st, lf, uf, out, rest, k } = F, M = med(s), M2 = med(rest); return {
  prompt: `The relay beacon pinged the camp ${n(N)} times, and the log lists the delays in milliseconds in the order they arrived: ${list(x)}. Put them in order first. Find Q1 and Q3 by the median-of-halves method (${halfNote}). Enter the IQR, then the number of outliers (delays below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR), then the median of all the delays, then the median of the delays that are not outliers.`,
  answer: [I, k, M, M2],
  hints: ['Sort the delays from smallest to largest before anything else. Q1 is the median of the lower half and Q3 the median of the upper half; the IQR is Q3 − Q1.', 'Take 1.5 times the IQR away from Q1 and add it to Q3 for the fences. For the last answer, delete the outliers from the sorted list and find the median of what is left, counting the new total.'],
  solution: `In order the delays are ${list(s)}. The median is ${medSay(s, 'delay')}. The lower half is ${list(Q.lower)}, so Q1 = ${n(Q.q1)}; the upper half is ${list(Q.upper)}, so Q3 = ${n(Q.q3)}. IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)} and 1.5 × ${n(I)} = ${n(st)}, so the fences are ${n(lf)} and ${n(uf)}. ${outSay(F, s)} Without ${plural(k, 'it', 'them')} ${n(rest.length)} delays are left: ${list(rest)}, and their median is ${medSay(rest, 'delay')}.`,
  guidance: [
   { prompt: `In order the delays are ${list(s)}. What are the median, Q1 and Q3 (${halfNote})?`, answer: [M, Q.q1, Q.q3], explanation: `The median is ${medSay(s, 'delay')}. The lower half ${list(Q.lower)} gives Q1 = ${n(Q.q1)} and the upper half ${list(Q.upper)} gives Q3 = ${n(Q.q3)}.` },
   { prompt: `With Q1 = ${n(Q.q1)} and Q3 = ${n(Q.q3)}, what are the IQR, the lower fence and the upper fence?`, answer: [I, lf, uf], explanation: `IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)}, and 1.5 × ${n(I)} = ${n(st)}. The fences are ${n(Q.q1)} − ${n(st)} = ${n(lf)} and ${n(Q.q3)} + ${n(st)} = ${n(uf)}.` },
   { prompt: `How many delays lie below ${n(lf)} or above ${n(uf)}? Delete them from the sorted list: what is the median of the delays that are left?`, answer: [k, M2], explanation: `${andList(out)} ${plural(k, 'is', 'are')} outside the fences, so the count is ${n(k)}. The ${n(rest.length)} delays left are ${list(rest)}; their median is ${medSay(rest, 'delay')}.` }
  ] }; }
});

/* ---- q07 Sample variance and standard deviation, dividing by n − 1 [2.7] ---- */

/* Whole numbers with a whole mean, whose s² and s are never on a rounding tie and whose s, worked from the rounded s²,
   agrees with s worked from the exact s². */
const varData = (R, Nlo, Nhi, lo, hi) => { let x, S; do { const N = R.int(Nlo, Nhi); x = []; for (let i = 0; i < N; i++) x.push(R.int(lo, hi)); S = spread(x); }
 while (sum(x) % x.length !== 0 || S.SS === 0 || tie2(S.s2) || tie2(S.s) || r2(Math.sqrt(r2(S.s2))) !== r2(S.s)); return x; };
const NOT_Q07 = x => same(x, [6, 10, 7, 9, 8]);

/* Parent worked example: 6, 10, 7, 9, 8. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The well salt readings',
 brief: 'The camp’s wells are tested for salt, and the water engineer wants to know how much the readings wobble from well to well.',
 labels: ['sum of squared deviations', 's²', 's'], tolerance: 0.005,
 gl: [['x̄ (mg/L)'], ['sum of squared deviations'], ['s²', 's']]
}, {
 canonical: { x: [41, 52, 47, 38, 61, 43] },
 draw: R => { let x; do { x = varData(R, 5, 7, 20, 90); } while (NOT_Q07(x)); return { x }; },
 build: ({ x }) => { const S = spread(x), N = S.N; return {
  prompt: `A survey team tested the salt in the water of ${n(N)} wells and recorded these amounts, in milligrams per litre: ${list(x)}. Treat these as a sample. Enter the sum of the squared deviations Σ(x − x̄)² (type it without commas), then the sample variance s², then the sample standard deviation s, the last two to 2 decimal places.`,
  answer: [S.SS, r2(S.s2), r2(S.s)],
  hints: ['The deviation of a reading is the reading minus the mean. Square each deviation and add the squares: that sum is the first answer.', 'Divide that sum by n − 1, one less than the number of readings, for s². Then s is the square root of s², worked out from the exact s² before any rounding.'],
  solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} mg/L. The deviations x − x̄ are ${list(S.dev)}, and their squares are ${list(S.sq)}, which add up to ${n(S.SS)}. With n − 1 = ${n(N - 1)}, s² = ${n(S.SS)} ÷ ${n(N - 1)} ${say2(S.s2)}, and s = √(${n(S.SS)} ÷ ${n(N - 1)}) ${say2(S.s)}.`,
  guidance: [
   { prompt: `What is the mean x̄ of the ${n(N)} readings?`, answer: [S.mean], explanation: `${x.map(n).join(' + ')} = ${n(sum(x))}, and ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} mg/L.` },
   { prompt: `Subtract ${n(S.mean)} from each reading, square the results and add them. What is the sum of the squared deviations?`, answer: [S.SS], explanation: `The deviations are ${list(S.dev)}; squared they are ${list(S.sq)}, and the sum is ${n(S.SS)}.` },
   { prompt: `Divide ${n(S.SS)} by n − 1 = ${n(N - 1)}, then take the square root. What are s² and s, to 2 decimal places?`, answer: [r2(S.s2), r2(S.s)], explanation: `s² = ${n(S.SS)} ÷ ${n(N - 1)} ${say2(S.s2)}, and s = √(${n(S.SS)} ÷ ${n(N - 1)}) ${say2(S.s)}.` }
  ] }; }
});

/* Two probes read the same number of times; the steadier one has the smaller s. Both means are whole, and the two s differ
   by at least 15%, so no rounding can swap them. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'Choosing the steadier probe',
 brief: 'The camp can afford to send only one moisture probe out onto the plain, and Mira wants the one whose readings wobble least.',
 labels: ['s of probe A', 's of probe B', 'steadier probe'], tolerance: 0.005,
 gl: [['sum of squares A', 'sum of squares B'], ['s of probe A', 's of probe B'], ['steadier probe']]
}, {
 canonical: { a: [31, 28, 35, 30, 26], b: [29, 33, 30, 28, 30] },
 draw: R => { let a, b, Sa, Sb; do { const N = R.int(5, 6); a = varData(R, N, N, 15, 45); b = varData(R, N, N, 15, 45); Sa = spread(a); Sb = spread(b); }
  while (Math.max(Sa.s, Sb.s) < 1.15 * Math.min(Sa.s, Sb.s)); return { a, b }; },
 build: ({ a, b }) => { const N = a.length, A = spread(a), B = spread(b), pick = A.s < B.s ? 1 : 2, sA = r2(A.s), sB = r2(B.s); return {
  prompt: `Two soil-moisture probes, A and B, were each left at one test plot and read ${n(N)} times, in grams of water per kilogram of soil. Probe A read ${list(a)}. Probe B read ${list(b)}. Treat each set as a sample. The crew will send out the steadier probe, the one with the smaller sample standard deviation. Enter the sample standard deviation of A, then of B, each to 2 decimal places. Then enter 1 if probe A is the steadier one, or 2 if probe B is.`,
  answer: [sA, sB, pick],
  hints: ['For each probe find its mean, then each reading minus that mean, square those deviations and add them up. Do the two probes one at a time.', 'Divide each sum by n − 1 and take the square root to get that probe’s s. The probe with the smaller s is steadier.'],
  solution: `Probe A: x̄ = ${n(sum(a))} ÷ ${n(N)} = ${n(A.mean)}; the squared deviations are ${list(A.sq)}, adding to ${n(A.SS)}; s = √(${n(A.SS)} ÷ ${n(N - 1)}) ${say2(A.s)}. Probe B: x̄ = ${n(sum(b))} ÷ ${n(N)} = ${n(B.mean)}; the squared deviations are ${list(B.sq)}, adding to ${n(B.SS)}; s = √(${n(B.SS)} ÷ ${n(N - 1)}) ${say2(B.s)}. Probe ${pick === 1 ? 'A' : 'B'} has the smaller s, so it is the steadier one: the answer is ${n(pick)}.`,
  guidance: [
   { prompt: `The means are x̄ = ${n(A.mean)} for probe A and x̄ = ${n(B.mean)} for probe B. For each probe subtract its mean from each reading, square the results and add them. What are the two sums of squared deviations?`, answer: [A.SS, B.SS], explanation: `A: the squares are ${list(A.sq)}, which add up to ${n(A.SS)}. B: the squares are ${list(B.sq)}, which add up to ${n(B.SS)}.` },
   { prompt: `Divide each sum by n − 1 = ${n(N - 1)} and take the square root. What are s for A and for B, to 2 decimal places?`, answer: [sA, sB], explanation: `A: √(${n(A.SS)} ÷ ${n(N - 1)}) ${say2(A.s)}. B: √(${n(B.SS)} ÷ ${n(N - 1)}) ${say2(B.s)}.` },
   { prompt: `Which probe has the smaller s? Enter 1 for probe A or 2 for probe B.`, answer: [pick], explanation: `${f2(sA)} for A and ${f2(sB)} for B: probe ${pick === 1 ? 'A' : 'B'} varies less, so it is the steadier one.` }
  ] }; }
});

/* The full data has a whole mean; one reading is lost. n × x̄ gives the total, and the lost reading is that total less the
   rest (q02). m is the position of the lost reading in the list, only used to hide it. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q02', title: 'The smudged log line',
 brief: 'One line of the ground-temperature log is smudged away, but the camp still needs the spread of the full set.',
 labels: ['missing reading', 's²', 's'], tolerance: 0.005,
 gl: [['total of all readings'], ['missing reading'], ['sum of squared deviations', 's²', 's']]
}, {
 canonical: { x: [18, 23, 15, 27, 21, 30, 20], m: 3 },
 draw: R => { let x; do { x = varData(R, 6, 8, 8, 40); } while (NOT_Q07(x)); return { x, m: R.int(0, x.length - 1) }; },
 build: ({ x, m }) => { const S = spread(x), N = S.N, known = x.filter((_, i) => i !== m), lost = x[m], T = sum(x); return {
  prompt: `A survey team logged the ground temperature, in degrees, at ${n(N)} stakes. One line of the log is smudged. The ${n(N - 1)} readings that can be read are ${list(known)}, and the sample mean of all ${n(N)} readings was x̄ = ${n(S.mean)}. Treat the ${n(N)} readings as a sample. Enter the missing reading, then the sample variance s² and the sample standard deviation s of all ${n(N)} readings, both to 2 decimal places.`,
  answer: [lost, r2(S.s2), r2(S.s)],
  hints: ['The mean is the total of all the readings divided by n, so the total is n times the mean. The missing reading is that total less the readings you can see.', 'With all n readings, find each deviation from the mean, square them and add them. Divide by n − 1 for s², and take the square root of the exact s² for s.'],
  solution: `The readings add up to ${n(N)} × ${n(S.mean)} = ${n(T)}. The readable ones add up to ${n(sum(known))}, so the missing reading is ${n(T)} − ${n(sum(known))} = ${n(lost)}. The deviations from ${n(S.mean)} are then ${list(S.dev)}, their squares ${list(S.sq)}, adding to ${n(S.SS)}. With n − 1 = ${n(N - 1)}, s² = ${n(S.SS)} ÷ ${n(N - 1)} ${say2(S.s2)}, and s = √(${n(S.SS)} ÷ ${n(N - 1)}) ${say2(S.s)}.`,
  guidance: [
   { prompt: `The mean of ${n(N)} readings is ${n(S.mean)}. What do all ${n(N)} readings add up to?`, answer: [T], explanation: `The mean is the total ÷ n, so the total is n × x̄ = ${n(N)} × ${n(S.mean)} = ${n(T)}.` },
   { prompt: `The readable readings add up to ${n(sum(known))}. What is the missing reading?`, answer: [lost], explanation: `${n(T)} − ${n(sum(known))} = ${n(lost)}.` },
   { prompt: `Now take all ${n(N)} readings with mean ${n(S.mean)}. What is the sum of the squared deviations, and then s² and s to 2 decimal places?`, answer: [S.SS, r2(S.s2), r2(S.s)], explanation: `The deviations are ${list(S.dev)}; squared they are ${list(S.sq)}, adding to ${n(S.SS)}. s² = ${n(S.SS)} ÷ ${n(N - 1)} ${say2(S.s2)}, and s = √(${n(S.SS)} ÷ ${n(N - 1)}) ${say2(S.s)}.` }
  ] }; }
});

/* ---- q08 Skew and the z-score of a reading [2.6, 2.7] ---- */

/* N trips: N − 1 bunched within 6 minutes and one far trip on one side. The mean is whole; s is printed to 2 decimals and
   z is worked from the printed s. A draw where s or z sits on a rounding tie, or where z from the exact s rounds
   differently, is left out. which: 'far' takes z of the far trip; 'near' takes z of the opposite extreme. */
const tailData = (R, Nlo, Nhi, baseLo, baseHi, which) => { let x, S, M, right, t, sr, z, ok;
 do { const N = R.int(Nlo, Nhi), off = R.int(baseLo, baseHi); right = R.bool(); x = [];
  for (let i = 0; i < N - 1; i++) x.push(off + R.int(0, 6));
  x.push(right ? off + 6 + R.int(8, 20) : off - R.int(8, 12)); x = shuffle(R, x);
  S = spread(x); M = med(sorted(x)); const far = right ? Math.max(...x) : Math.min(...x), near = right ? Math.min(...x) : Math.max(...x);
  t = which === 'far' ? far : near; sr = r2(S.s); z = (t - S.mean) / sr;
  ok = sum(x) % N === 0 && (S.mean > M) === right && S.mean !== M && !tie2(S.s) && t !== S.mean && !tie2(z) && r2(z) !== 0 && r2(z) === r2((t - S.mean) / S.s) && x.every(v => v > 0) && !same(sorted(x), [30, 31, 32, 33, 34, 50]); } while (!ok);
 return x; };
const NOT_Q08 = x => same(sorted(x), [30, 31, 32, 33, 34, 50]);

/* Parent worked example: 30, 31, 32, 33, 34, 50 with s = 7.48. */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The tank refill times',
 brief: 'Now and then the water tank takes far longer or far shorter to refill than usual, and the engineer wants to see how that one odd morning bends the average.',
 labels: ['mean', 'median', 'z-score'], tolerance: 0.005,
 gl: [['mean', 'median'], ['deviation from the mean'], ['z-score']]
}, {
 canonical: { x: [26, 24, 41, 25, 27, 23, 26, 24] },
 draw: R => ({ x: tailData(R, 6, 9, 14, 45, 'far') }),
 build: ({ x }) => { const S = spread(x), N = S.N, s = sorted(x), M = med(s), D = S.mean - M, right = D > 0, t = right ? s[N - 1] : s[0], sr = r2(S.s), z = (t - S.mean) / sr; return {
  prompt: `A tank crew timed how long the water tank took to refill, in minutes, on ${n(N)} mornings: ${list(x)}. The sample standard deviation of these times is s = ${f2(sr)} minutes, rounded to 2 decimal places. Enter the mean, then the median. Then enter the z-score of the odd one out, the ${right ? 'longest' : 'shortest'} refill of ${n(t)} minutes, using s = ${f2(sr)}, to 2 decimal places.`,
  answer: [S.mean, M, r2(z)],
  hints: ['Add the times and divide by how many there are for the mean. For the median, put the times in order first and take the middle one, or halfway between the two middle ones.', 'A z-score is (x − x̄) ÷ s. A reading below the mean has a negative z-score, so keep the minus sign.'],
  solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} minutes. In order the times are ${list(s)}, so the median is ${medSay(s, 'time')}. The mean is ${right ? 'above' : 'below'} the median, so the data are skewed to the ${right ? 'right' : 'left'}, pulled by the one ${right ? 'long' : 'short'} refill. The z-score of ${n(t)} is (${n(t)} − ${n(S.mean)}) ÷ ${f2(sr)} = ${n(t - S.mean)} ÷ ${f2(sr)} ${say2(z)}.`,
  guidance: [
   { prompt: `What are the mean and the median of the ${n(N)} times?`, answer: [S.mean, M], explanation: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)}. In order, ${list(s)}: the median is ${medSay(s, 'time')}.` },
   { prompt: `How far is ${n(t)} from the mean ${n(S.mean)}? Work out ${n(t)} − ${n(S.mean)} and keep its sign.`, answer: [t - S.mean], explanation: `${n(t)} − ${n(S.mean)} = ${n(t - S.mean)}. It is negative when the reading is below the mean.` },
   { prompt: `Divide ${n(t - S.mean)} by s = ${f2(sr)}. What is the z-score, to 2 decimal places?`, answer: [r2(z)], explanation: `${n(t - S.mean)} ÷ ${f2(sr)} ${say2(z)}. This refill is about ${n(Math.abs(r2(z)))} standard deviations ${z < 0 ? 'below' : 'above'} the mean.` }
  ] }; }
});

/* Ridge times with a far trip, and a river route given only by its mean and standard deviation; a trip is more unusual
   when |z| is bigger, and the two |z| differ by at least 0.3. The river z is checked for ties as well. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Which trip was stranger?',
 brief: 'Two survey routes each had one odd day, and Mira wants to know which odd day was the stranger one.',
 labels: ['ridge mean', 'ridge z-score', 'river z-score', 'stranger trip'], tolerance: 0.005,
 gl: [['ridge mean'], ['ridge z-score', 'river z-score'], ['stranger trip']]
}, {
 canonical: { x: [18, 21, 16, 19, 17, 20, 36], mB: 40, sB: 4.5, tB: 33 },
 draw: R => { let p, ok; do { const x = tailData(R, 6, 8, 16, 40, 'far'), S = spread(x), right = S.mean > med(sorted(x)), tA = right ? Math.max(...x) : Math.min(...x);
   const mB = R.int(20, 60), sB = R.int(20, 90) / 10, tB = mB + R.int(-3, 3) * R.pick([1, 2, 3, 4]) + R.pick([-2, -1, 1, 2]);
   const zA = (tA - S.mean) / r2(S.s), zB = (tB - mB) / sB; p = { x, mB, sB, tB };
   ok = tB > 0 && Math.abs(tB - mB) >= 1 && !tie2(zB) && r2(zB) !== 0 && Math.abs(zB) < 4 && Math.abs(Math.abs(zA) - Math.abs(zB)) >= 0.3 && r2(zB) === r2((tB - mB) / sB); } while (!ok); return p; },
 build: ({ x, mB, sB, tB }) => { const S = spread(x), N = S.N, s = sorted(x), right = S.mean > med(s), tA = right ? s[N - 1] : s[0], sr = r2(S.s), zA = (tA - S.mean) / sr, zB = (tB - mB) / sB, which = Math.abs(r2(zA)) > Math.abs(r2(zB)) ? 1 : 2; return {
  prompt: `The survey team walks two routes. On the ridge route the times, in minutes, on ${n(N)} trips were ${list(x)}, and their sample standard deviation is s = ${f2(sr)} minutes, rounded to 2 decimal places. On the river route the team’s long records give a mean of ${n(mB)} minutes and a standard deviation of ${n(sB)} minutes. One day the ridge trip took ${n(tA)} ${plural(tA, 'minute', 'minutes')} and the river trip took ${n(tB)} ${plural(tB, 'minute', 'minutes')}. A trip is stranger the further its z-score is from 0, above or below. Enter the mean of the ridge times, then the z-score of the ${n(tA)}-minute ridge trip using s = ${f2(sr)}, then the z-score of the ${n(tB)}-minute river trip, each z-score to 2 decimal places. Then enter 1 if the ridge trip was the stranger one, or 2 if the river trip was.`,
  answer: [S.mean, r2(zA), r2(zB), which],
  hints: ['The ridge mean is the total of the ridge times divided by the number of trips. Use it, with the s given, in z = (x − x̄) ÷ s. The river route’s mean and standard deviation are already given.', 'Compare the sizes of the two z-scores, ignoring the minus signs: the bigger size is the stranger trip. A negative z-score can be the stranger one.'],
  solution: `Ridge mean: ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} minutes. Ridge z-score: (${n(tA)} − ${n(S.mean)}) ÷ ${f2(sr)} = ${n(tA - S.mean)} ÷ ${f2(sr)} ${say2(zA)}. River z-score: (${n(tB)} − ${n(mB)}) ÷ ${n(sB)} = ${n(tB - mB)} ÷ ${n(sB)} ${say2(zB)}. The size ${f2(Math.abs(zA))} for the ridge trip is ${which === 1 ? 'bigger' : 'smaller'} than ${f2(Math.abs(zB))} for the river trip, so the ${which === 1 ? 'ridge' : 'river'} trip was the stranger one: the answer is ${n(which)}.`,
  guidance: [
   { prompt: `What is the mean of the ${n(N)} ridge times?`, answer: [S.mean], explanation: `${x.map(n).join(' + ')} = ${n(sum(x))}, and ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} minutes.` },
   { prompt: `What are the z-scores, to 2 decimal places, of the ${n(tA)}-minute ridge trip (mean ${n(S.mean)}, s = ${f2(sr)}) and the ${n(tB)}-minute river trip (mean ${n(mB)}, standard deviation ${n(sB)})?`, answer: [r2(zA), r2(zB)], explanation: `Ridge: ${n(tA - S.mean)} ÷ ${f2(sr)} ${say2(zA)}. River: ${n(tB - mB)} ÷ ${n(sB)} ${say2(zB)}.` },
   { prompt: `Which z-score is further from 0? Enter 1 for the ridge trip or 2 for the river trip.`, answer: [which], explanation: `Ignoring signs, ${f2(Math.abs(zA))} for the ridge trip and ${f2(Math.abs(zB))} for the river trip: the ${which === 1 ? 'ridge' : 'river'} trip is further from its mean in standard deviations, so it was stranger.` }
  ] }; }
});

/* The parent's steps, then the idea run backwards: a reading with z-score k has x = x̄ + k × s. k is a whole number, so
   with s printed to 2 decimals the answer has at most 2 decimals, and the reading is above 0. */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', title: 'The convoy leg times',
 brief: 'One supply convoy leg ran far off the usual pace, and Mira wants to know how it bends the average and where a really odd leg would fall.',
 labels: ['mean − median', 'z-score', 'time at the given z-score'], tolerance: 0.005,
 gl: [['mean', 'median'], ['mean − median', 'z-score'], ['time at the given z-score']]
}, {
 canonical: { x: [35, 38, 33, 36, 34, 37, 65, 35, 38], k: -2 },
 draw: R => { const x = tailData(R, 8, 10, 25, 50, 'far'); return { x, k: R.pick([-2, -1, 1, 2, 3]) }; },
 build: ({ x, k }) => { const S = spread(x), N = S.N, s = sorted(x), M = med(s), D = S.mean - M, right = D > 0, t = right ? s[N - 1] : s[0], sr = r2(S.s), z = (t - S.mean) / sr, T = S.mean + k * sr; return {
  prompt: `A survey team timed ${n(N)} legs of the supply convoy route, in minutes: ${list(x)}. The sample standard deviation of these times is s = ${f2(sr)} minutes, rounded to 2 decimal places. Enter the mean minus the median. Then enter the z-score of the ${right ? 'longest' : 'shortest'} leg, ${n(t)} minutes, using s = ${f2(sr)}, to 2 decimal places. Last, enter the time, in minutes to 2 decimal places, of a leg whose z-score would be ${n(k)}.`,
  answer: [D, r2(z), T],
  hints: ['Find the mean and the median, then take the median from the mean. A positive result points to a long tail on the right, a negative one to a tail on the left.', 'A z-score counts standard deviations from the mean: z = (x − x̄) ÷ s. To go backwards from a z-score to a time, multiply z by s and add the mean, keeping the sign of z.'],
  solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} minutes. In order the times are ${list(s)}, so the median is ${medSay(s, 'time')}. The mean minus the median is ${n(S.mean)} − ${n(M)} = ${n(D)}, so the data are skewed to the ${right ? 'right' : 'left'}. The z-score of ${n(t)} is (${n(t)} − ${n(S.mean)}) ÷ ${f2(sr)} = ${n(t - S.mean)} ÷ ${f2(sr)} ${say2(z)}. A z-score of ${n(k)} means ${n(Math.abs(k))} standard ${Math.abs(k) === 1 ? 'deviation' : 'deviations'} ${k < 0 ? 'below' : 'above'} the mean: x = ${n(S.mean)} ${k < 0 ? '−' : '+'} ${n(Math.abs(k))} × ${f2(sr)} = ${n(T)} minutes.`,
  guidance: [
   { prompt: `What are the mean and the median of the ${n(N)} times?`, answer: [S.mean, M], explanation: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)}. In order, ${list(s)}: the median is ${medSay(s, 'time')}.` },
   { prompt: `What is the mean minus the median, ${n(S.mean)} − ${n(M)}? And what is z = (${n(t)} − ${n(S.mean)}) ÷ ${f2(sr)}, to 2 decimal places?`, answer: [D, r2(z)], explanation: `${n(S.mean)} − ${n(M)} = ${n(D)}, ${D > 0 ? 'positive, so the tail is on the right' : 'negative, so the tail is on the left'}. ${n(t - S.mean)} ÷ ${f2(sr)} ${say2(z)}.` },
   { prompt: `A z-score of ${n(k)} means ${n(k)} standard ${Math.abs(k) === 1 ? 'deviation' : 'deviations'} from the mean. Work out ${n(S.mean)} + ${par(k)} × ${f2(sr)}. What time is that?`, answer: [T], explanation: `${n(k)} × ${f2(sr)} = ${n(k * sr)}, and ${n(S.mean)} + ${par(k * sr)} = ${n(T)} minutes.` }
  ] }; }
});

/* ---- q09 Fair samples: simple random, systematic, stratified [1.2] ---- */

/* Three strata of f × a crates, a from 2 to 9 with at most 25 in all, so every proportional share is whole. */
const strata3 = (R, fLo, fHi) => { let p; do { p = { f: R.int(fLo, fHi), a: [R.int(2, 9), R.int(2, 9), R.int(2, 9)] }; } while (sum(p.a) > 25); p.s = R.int(1, p.f); return p; };

/* Parent worked example: f 5, a 6, 4, 2, start 2. The fourth pick is three steps on from the start. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'Inspecting the supply stores',
 brief: 'Mira cannot open every supply crate in the outpost, so she wants a fair handful from each store to inspect.',
 labels: ['from Store 1', 'from Store 2', 'from Store 3', 'fourth pick'], tolerance: 0.01,
 gl: [['crates per sampled crate'], ['from Store 1', 'from Store 2', 'from Store 3'], ['fourth pick']]
}, {
 canonical: { f: 7, a: [4, 6, 3], s: 5 },
 draw: R => { let p; do { p = strata3(R, 4, 12); } while (p.f === 5 && same(p.a, [6, 4, 2])); return p; },
 build: ({ f, a, s }) => { const D = a.map(k => k * f), K = sum(a), N = f * K, fourth = s + 3 * f; return {
  prompt: `The outpost’s three stores hold ${n(N)} supply crates: ${n(D[0])} in Store 1, ${n(D[1])} in Store 2 and ${n(D[2])} in Store 3. Mira will inspect a sample of ${n(K)} crates. For a proportional stratified sample, enter how many crates to take from Store 1, from Store 2 and from Store 3. Then, for a systematic sample of ${n(K)} crates instead, the whole crate list is numbered 1 to ${n(N)} and the first crate chosen is number ${n(s)}, picked at random from numbers 1 to ${n(f)}. Enter the number of the fourth crate chosen.`,
  answer: [a[0], a[1], a[2], fourth],
  hints: ['In a proportional stratified sample each store gets the same share of the sample as it has of all the crates: its size divided by the total, times the sample size.', 'In a systematic sample the step is the number of crates divided by the sample size. Start at the first pick and add the step each time: the fourth pick is three steps on from the first.'],
  solution: `Store 1: ${n(D[0])} ÷ ${n(N)} × ${n(K)} = ${n(a[0])}; Store 2: ${n(D[1])} ÷ ${n(N)} × ${n(K)} = ${n(a[1])}; Store 3: ${n(D[2])} ÷ ${n(N)} × ${n(K)} = ${n(a[2])}. Together ${a.map(n).join(' + ')} = ${n(K)}, the whole sample. For the systematic sample the step is ${n(N)} ÷ ${n(K)} = ${n(f)}, so the picks are number ${n(s)}, ${n(s + f)}, ${n(s + 2 * f)}, ${n(fourth)} and so on: the fourth crate chosen is number ${n(fourth)}.`,
  guidance: [
   { prompt: `The sample is ${n(K)} crates out of ${n(N)}. How many crates does each sampled crate stand for: what is ${n(N)} ÷ ${n(K)}?`, answer: [f], explanation: `${n(N)} ÷ ${n(K)} = ${n(f)}: the sample takes 1 crate in every ${n(f)}.` },
   { prompt: `Taking 1 in every ${n(f)} from each store, how many crates come from Store 1, Store 2 and Store 3?`, answer: [a[0], a[1], a[2]], explanation: `${n(D[0])} ÷ ${n(f)} = ${n(a[0])}, ${n(D[1])} ÷ ${n(f)} = ${n(a[1])} and ${n(D[2])} ÷ ${n(f)} = ${n(a[2])}.` },
   { prompt: `The systematic sample starts at number ${n(s)} and steps by ${n(f)}. What number is the fourth pick?`, answer: [fourth], explanation: `${n(s)}, then ${n(s + f)}, then ${n(s + 2 * f)}, then ${n(fourth)}: three steps of ${n(f)} after the start.` }
  ] }; }
});

/* A share given as a percentage, p = 100 ÷ f with f in {4, 5, 10, 20, 25}. The last pick of a systematic sample is
   K − 1 steps after the start. x is the position (0, 1 or 2) of the block the prompt names; it only picks a name. */
const BLOCKS = ['Block A', 'Block B', 'Block C'];
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The ration menu poll',
 brief: 'Mira has a fixed share of the crew to poll about the new ration menu, and needs the head-count for one habitat block and the last name on the list.',
 labels: ['sample size', 'from the named block', 'last pick'], tolerance: 0.01,
 gl: [['sample size'], ['from the named block'], ['last pick']]
}, {
 canonical: { f: 10, a: [3, 5, 4], s: 6, x: 1 },
 draw: R => { let p; do { p = { f: R.pick([4, 5, 10, 20, 25]), a: [R.int(2, 9), R.int(2, 9), R.int(2, 9)] }; } while (sum(p.a) > 25 || (p.f === 5 && same(p.a, [6, 4, 2]))); p.s = R.int(1, p.f); p.x = R.int(0, 2); return p; },
 build: ({ f, a, s, x }) => { const D = a.map(k => k * f), K = sum(a), N = f * K, pct = 100 / f, last = s + (K - 1) * f; return {
  prompt: `The outpost’s ${n(N)} crew live in three habitat blocks: ${n(D[0])} in Block A, ${n(D[1])} in Block B and ${n(D[2])} in Block C. Mira will poll ${n(pct)}% of the crew about the new ration menu. Enter the size of the sample. Then, for a proportional stratified sample, enter how many to take from ${BLOCKS[x]}. Then, for a systematic sample of that size, the whole crew list is numbered 1 to ${n(N)} and the first person chosen is number ${n(s)}, picked at random from numbers 1 to ${n(f)}. Enter the number of the last person chosen.`,
  answer: [K, a[x], last],
  hints: ['The sample size is the stated percentage of all the crew: that percentage written as a fraction, times the number of crew.', 'A stratified share is the block’s size divided by the total, times the sample size. In a systematic sample the step is the number of crew divided by the sample size; the last pick is (sample size − 1) steps after the start, because the first pick is the start itself.'],
  solution: `${n(pct)}% of ${n(N)} is ${n(N)} ÷ ${n(f)} = ${n(K)} crew, the sample size. ${BLOCKS[x]} has ${n(D[x])} of the ${n(N)} crew, so it supplies ${n(D[x])} ÷ ${n(N)} × ${n(K)} = ${n(a[x])}. For the systematic sample the step is ${n(N)} ÷ ${n(K)} = ${n(f)}. The first pick is number ${n(s)}, and the ${n(K)}th pick is ${n(K - 1)} steps later: ${n(s)} + ${n(K - 1)} × ${n(f)} = ${n(last)}.`,
  guidance: [
   { prompt: `${n(pct)}% of the crew is 1 person in every ${n(f)}. How many people is that out of ${n(N)}?`, answer: [K], explanation: `${n(N)} ÷ ${n(f)} = ${n(K)}, the sample size.` },
   { prompt: `${BLOCKS[x]} holds ${n(D[x])} of the ${n(N)} crew. Taking 1 in every ${n(f)}, how many come from it?`, answer: [a[x]], explanation: `${n(D[x])} ÷ ${n(f)} = ${n(a[x])}.` },
   { prompt: `The picks start at number ${n(s)} and step by ${n(f)}. The last of the ${n(K)} picks is ${n(K - 1)} steps after the start. What number is it?`, answer: [last], explanation: `${n(s)} + ${n(K - 1)} × ${n(f)} = ${n(last)}.` }
  ] }; }
});

/* A roster as a frequency table of four teams (q01): relative frequency = frequency ÷ total, here a[x] ÷ K. The pairs [f, K]
   make N = f × K one of 40, 50, 80, 100 or 200, so every relative frequency has at most 3 decimals. The team sizes are f times
   a whole number of sampled crew, at least 1 each. x only picks which team the prompt names. */
const PAIRS = [[4, 10], [5, 8], [5, 10], [8, 10], [10, 8], [5, 20], [10, 10], [4, 25], [4, 20], [10, 20]];
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q01', title: 'The crew roster table',
 brief: 'The crew roster is a frequency table of four teams, and Mira wants the share of one team and a fair sample drawn from it.',
 labels: ['total crew', 'relative frequency', 'from the named team', 'third pick'], tolerance: 0.0005,
 gl: [['total crew'], ['relative frequency', 'from the named team'], ['third pick']]
}, {
 canonical: { f: 5, a: [2, 3, 1, 2], s: 4, x: 2 },
 draw: R => { const [f, K] = R.pick(PAIRS), a = [1, 1, 1, 1]; for (let i = 0; i < K - 4; i++) a[R.int(0, 3)]++; return { f, a, s: R.int(1, f), x: R.int(0, 3) }; },
 build: ({ f, a, s, x }) => { const D = a.map(k => k * f), K = sum(a), N = f * K, rf = D[x] / N, third = s + 2 * f; return {
  prompt: `The crew roster is a frequency table of four teams: team 1, 2, 3 and 4 have ${list(D)} crew. Mira wants a sample of ${n(K)} crew. Enter the total number of crew, then the relative frequency of team ${n(x + 1)} as an exact decimal. Then, for a proportional stratified sample, enter how many to take from team ${n(x + 1)}. Then, for a systematic sample of ${n(K)} instead, the whole crew list is numbered 1 to ${n(N)} and the first person chosen is number ${n(s)}, picked at random from numbers 1 to ${n(f)}. Enter the number of the third person chosen.`,
  answer: [N, rf, a[x], third],
  hints: ['The total is the sum of the frequencies. A relative frequency is one team’s frequency divided by that total.', 'A stratified share is the team’s size divided by the total, times the sample size, which is the same as its relative frequency times the sample size. In a systematic sample the step is the total divided by the sample size, and the third pick is two steps after the start.'],
  solution: `The total is ${D.map(n).join(' + ')} = ${n(N)} crew. Team ${n(x + 1)} has ${n(D[x])}, so its relative frequency is ${n(D[x])} ÷ ${n(N)} = ${n(rf)}. In the stratified sample it supplies ${n(rf)} × ${n(K)} = ${n(a[x])}. For the systematic sample the step is ${n(N)} ÷ ${n(K)} = ${n(f)}, so the picks are number ${n(s)}, ${n(s + f)}, ${n(third)} and so on: the third person chosen is number ${n(third)}.`,
  guidance: [
   { prompt: `Add the four frequencies ${list(D)}. How many crew are there in all?`, answer: [N], explanation: `${D.map(n).join(' + ')} = ${n(N)} crew.` },
   { prompt: `Team ${n(x + 1)} has ${n(D[x])} of the ${n(N)} crew. What is its relative frequency, and what is that times the sample size ${n(K)}?`, answer: [rf, a[x]], explanation: `${n(D[x])} ÷ ${n(N)} = ${n(rf)}, and ${n(rf)} × ${n(K)} = ${n(a[x])}: the sample takes that many from team ${n(x + 1)}.` },
   { prompt: `The step is ${n(N)} ÷ ${n(K)} = ${n(f)} and the first pick is number ${n(s)}. What number is the third pick?`, answer: [third], explanation: `${n(s)}, then ${n(s)} + ${n(f)} = ${n(s + f)}, then ${n(s + f)} + ${n(f)} = ${n(third)}.` }
  ] }; }
});

/* ---- q10 Sampling variability and the standard error of x̄ [7.1] ---- */

/* Parent worked example: σ 9, n 25. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The solar cell trial',
 brief: 'The power team will average the output of a batch of solar cells, and wants to know how much that average could wander and how big a batch tames it.',
 labels: ['standard error (W)', 'sample size'], tolerance: 0.005,
 gl: [['√n'], ['standard error (W)'], ['sample size']]
}, {
 canonical: { g: 62, r: 6 },
 draw: R => { let p; do { p = { g: R.int(20, 200), r: R.int(3, 8) }; } while (tie2(p.g / 10 / p.r) || (p.g === 90 && p.r === 5)); return p; },
 build: ({ g, r }) => { const sg = g / 10, N = r * r, se = sg / r, N9 = 9 * N; return {
  prompt: `The solar shed’s records show that the output of one cell on a test day varies with standard deviation σ = ${n(sg)} watts. The crew will average the output of n = ${n(N)} cells chosen at random. Enter the standard error of the sample mean, σ ÷ √n, in watts to 2 decimal places. Then enter the sample size that would cut the standard error to one third of that.`,
  answer: [r2(se), N9],
  hints: ['The standard error of the sample mean is σ ÷ √n. Find √n first, then divide σ by it.', 'To divide the standard error by 3, √n must be multiplied by 3. Because n sits under the square root, n is then multiplied by 3 × 3.'],
  solution: `√${n(N)} = ${n(r)}, so the standard error is ${n(sg)} ÷ ${n(r)} ${say2(se)} ${plural(r2(se), 'watt', 'watts')}. For one third of it, √n must triple from ${n(r)} to ${n(3 * r)}, so n = ${n(3 * r)} × ${n(3 * r)} = ${n(N9)} cells: nine times as many.`,
  guidance: [
   { prompt: `What is √n for n = ${n(N)}?`, answer: [r], explanation: `${n(r)} × ${n(r)} = ${n(N)}, so √${n(N)} = ${n(r)}.` },
   { prompt: `What is σ ÷ √n = ${n(sg)} ÷ ${n(r)}, to 2 decimal places?`, answer: [r2(se)], explanation: `${n(sg)} ÷ ${n(r)} ${say2(se)}. A typical sample mean of ${n(N)} cells lands about that far from the true mean.` },
   { prompt: `For one third of the standard error, √n must be three times ${n(r)}. What sample size n has √n = ${n(3 * r)}?`, answer: [N9], explanation: `${n(3 * r)} × ${n(3 * r)} = ${n(N9)}, which is 9 × ${n(N)}.` }
  ] }; }
});

/* t ∈ {0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2} and σ = k × t with k from 3 to 12, so the readings needed, n = (σ ÷ t)² = k², is
   exact and "at most t" is met exactly by n = k². The current plan has n0 = r0², r0 from 2 to k − 1. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The rain gauge plan',
 brief: 'The farm planners want the plain’s average rainfall pinned down to a set accuracy, and need to know how many more readings that takes.',
 labels: ['standard error now (mm)', 'readings needed', 'extra readings'], tolerance: 0.005,
 gl: [['standard error now (mm)'], ['√n needed'], ['readings needed', 'extra readings']]
}, {
 canonical: { t: 0.5, k: 8, r0: 3 },
 draw: R => { let p; do { p = { t: R.pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2]), k: R.int(3, 12) }; p.r0 = R.int(2, p.k - 1); } while (tie2(Math.round(p.t * p.k * 100) / 100 / p.r0)); return p; },
 build: ({ t, k, r0 }) => { const sg = Math.round(t * k * 100) / 100, n0 = r0 * r0, se0 = sg / r0, need = k * k, extra = need - n0; return {
  prompt: `Survey Camp’s planners want the average daily rainfall over the plain to have a standard error of at most ${n(t)} ${mm(t)}. Single daily readings, taken at random, vary with standard deviation σ = ${n(sg)} ${mm(sg)}. The crew’s current plan is to average n = ${n(n0)} readings. Enter the standard error of that plan, σ ÷ √n, to 2 decimal places. Then enter the smallest number of readings whose average has a standard error of at most ${n(t)} ${mm(t)}, and how many more readings than the current plan that is.`,
  answer: [r2(se0), need, extra],
  hints: ['The standard error of the sample mean is σ ÷ √n. For the first answer put the current n into it.', 'You want σ ÷ √n to be at most the target, so √n must be at least σ divided by the target. Square that for n, and take away the current plan’s n to see how many more.'],
  solution: `√${n(n0)} = ${n(r0)}, so the current standard error is ${n(sg)} ÷ ${n(r0)} ${say2(se0)} ${mm(se0)}. To reach ${n(t)} we need ${n(sg)} ÷ √n = ${n(t)}, so √n = ${n(sg)} ÷ ${n(t)} = ${n(k)} and n = ${n(k)} × ${n(k)} = ${n(need)} readings. That is ${n(need)} − ${n(n0)} = ${n(extra)} more than the current plan.`,
  guidance: [
   { prompt: `What is σ ÷ √n = ${n(sg)} ÷ ${n(r0)}, with √${n(n0)} = ${n(r0)}, to 2 decimal places?`, answer: [r2(se0)], explanation: `${n(sg)} ÷ ${n(r0)} ${say2(se0)} ${mm(se0)}.` },
   { prompt: `For σ ÷ √n to equal ${n(t)}, what must √n be? Divide σ = ${n(sg)} by ${n(t)}.`, answer: [k], explanation: `${n(sg)} ÷ ${n(t)} = ${n(k)}, so √n must be ${n(k)}.` },
   { prompt: `What sample size n has √n = ${n(k)}, and how many more readings is that than the current ${n(n0)}?`, answer: [need, extra], explanation: `${n(k)} × ${n(k)} = ${n(need)}, and ${n(need)} − ${n(n0)} = ${n(extra)}.` }
  ] }; }
});

/* A pilot sample of 5 or 6 readings whose deviations from a whole mean give a whole s (3 to 5), so s needs no rounding.
   Deviation sets are listed for n = 5 and n = 6; d is the index of the set and flip mirrors it. t = s ÷ k with k in {4, 5, 10},
   so t has at most 2 decimals and the readings needed are exactly k². Parent: q07 (the sample standard deviation). */
const DEV5 = [[-7, -3, 1, 4, 5], [-7, -1, 0, 1, 7], [-6, -2, 2, 2, 4], [-5, -5, 0, 5, 5], [-5, -4, -1, 3, 7], [-5, -3, 1, 2, 5], [-5, -2, -1, 3, 5], [-4, -4, 0, 4, 4], [-4, -2, -2, 2, 6], [-4, -1, -1, 3, 3], [-3, -3, 1, 1, 4]];
const DEV6 = [[-7, -2, 0, 3, 3, 3], [-7, -2, 1, 1, 3, 4], [-7, -1, -1, 2, 3, 4], [-6, -4, 1, 3, 3, 3], [-6, -3, -1, 3, 3, 4], [-6, -2, 0, 0, 2, 6], [-5, -5, 1, 2, 3, 4], [-5, -3, -2, 1, 4, 5], [-4, -4, -2, 2, 2, 6], [-4, -3, -2, -1, 5, 5], [-4, -2, -2, -2, 4, 6]];
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q07', title: 'The pilot dust-fall run',
 brief: 'A short pilot run is the only record of how much dust-fall readings vary, and the planners must size the full survey from it.',
 labels: ['s', 'standard error (g/m²)', 'readings needed'], tolerance: 0.005,
 gl: [['x̄', 'sum of squared deviations'], ['s', 'standard error (g/m²)'], ['readings needed']]
}, {
 canonical: { N: 5, d: 5, flip: false, m: 36, k: 5, r0: 2, order: [2, 0, 4, 1, 3] },
 draw: R => { const N = R.int(5, 6), d = R.int(0, (N === 5 ? DEV5 : DEV6).length - 1), k = R.pick([4, 5, 10]); return { N, d, flip: R.bool(), m: R.int(20, 60), k, r0: R.int(2, k - 1), order: shuffle(R, [...Array(N).keys()]) }; },
 build: ({ N, d, flip, m, k, r0, order }) => { const dev = (N === 5 ? DEV5 : DEV6)[d].map(v => flip ? -v : v), x = order.map(i => m + dev[i]), S = spread(x), s = Math.round(S.s), t = Math.round(s / k * 100) / 100, n0 = r0 * r0, se0 = s / r0, need = k * k; return {
  prompt: `A pilot run at Survey Camp measured the dust-fall, in grams per square metre, on ${n(N)} days: ${list(x)}. Treat these as a sample, and use the sample standard deviation s you find from it as the standard deviation σ of single daily readings. Enter s (it comes out a whole number). Then enter the standard error of the mean of n = ${n(n0)} readings taken at random, σ ÷ √n, to 2 decimal places. Then enter the smallest number of readings whose mean has a standard error of at most ${n(t)} ${plural(t, 'gram', 'grams')} per square metre.`,
  answer: [s, r2(se0), need],
  hints: ['Find the mean of the pilot readings, square each reading’s deviation from it and add them. Divide by n − 1, one less than the number of readings, and take the square root: that is s.', 'Use s as σ in σ ÷ √n for the standard error. To reach a target, √n must be at least σ divided by the target, so square that for n.'],
  solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)}. The deviations are ${list(S.dev)}, and their squares ${list(S.sq)} add up to ${n(S.SS)}. s² = ${n(S.SS)} ÷ ${n(N - 1)} = ${n(S.s2)}, so s = √${n(S.s2)} = ${n(s)}. Taking σ = ${n(s)}, the standard error of ${n(n0)} readings is ${n(s)} ÷ √${n(n0)} = ${n(s)} ÷ ${n(r0)} ${say2(se0)}. To reach ${n(t)} we need √n = ${n(s)} ÷ ${n(t)} = ${n(k)}, so n = ${n(k)} × ${n(k)} = ${n(need)} readings.`,
  guidance: [
   { prompt: `What is the mean x̄ of the ${n(N)} pilot readings, and what is the sum of the squared deviations from it?`, answer: [S.mean, S.SS], explanation: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)}. The deviations are ${list(S.dev)}; squared they are ${list(S.sq)}, and the sum is ${n(S.SS)}.` },
   { prompt: `Divide ${n(S.SS)} by one less than the ${n(N)} pilot readings, ${n(N - 1)}, and take the square root: what is s? Then, with σ = s and n = ${n(n0)} new readings, so √${n(n0)} = ${n(r0)}, what is the standard error σ ÷ √n, to 2 decimal places?`, answer: [s, r2(se0)], explanation: `${n(S.SS)} ÷ ${n(N - 1)} = ${n(S.s2)}, and √${n(S.s2)} = ${n(s)}. Then ${n(s)} ÷ ${n(r0)} ${say2(se0)}.` },
   { prompt: `For σ ÷ √n to be ${n(t)}, √n must be ${n(s)} ÷ ${n(t)} = ${n(k)}. What sample size n has √n = ${n(k)}?`, answer: [need], explanation: `${n(k)} × ${n(k)} = ${n(need)} readings.` }
  ] }; }
});

})();
