/* Data and inference mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Small helpers. list: "3, 6, 8"; sum; sorted copy; median of a sorted list; r2: round to 2 decimals;
   tie2: a value whose third decimal is exactly 5 (rounding to 2 decimals would be a toss-up), filtered from draws;
   exact2: a value that already has at most 2 decimals; f2: two decimals always shown (2.20); say2: "= 3.5" or "≈ 3.6742, which rounds to 3.67". */
const list = xs => xs.map(n).join(', ');
const sum = xs => xs.reduce((s, x) => s + x, 0);
const sorted = xs => xs.slice().sort((a, b) => a - b);
const med = s => s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
const r2 = x => Math.round(x * 100 + 1e-9) / 100;
const tie2 = x => Math.abs(x * 100 - Math.floor(x * 100 + 1e-9) - 0.5) < 1e-6;
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const f2 = x => r2(x).toFixed(2).replace('-', '−');
const say2 = x => exact2(x) ? `= ${n(x)}` : `≈ ${n(x)}, which rounds to ${f2(x)}`;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
/* Fisher–Yates with the draw's random source, so a list is never handed over already sorted. */
const shuffle = (R, xs) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* Quartiles by the median-of-halves method of OpenStax 2.3: with an odd count the median is left out of both halves. */
const halves = s => { const h = Math.floor(s.length / 2); return { lower: s.slice(0, h), upper: s.slice(s.length - h) }; };
const quart = s => { const { lower, upper } = halves(s); return { lower, upper, m: med(s), q1: med(lower), q3: med(upper) }; };
/* "the 5th reading, 21" or "halfway between the 5th and 6th readings: (21 + 24) ÷ 2 = 22.5" */
const medSay = (s, noun) => s.length % 2
 ? `the ${(s.length + 1) / 2}th ${noun}, ${n(med(s))}`
 : `halfway between the ${s.length / 2}th and ${s.length / 2 + 1}th ${noun}s: (${n(s[s.length / 2 - 1])} + ${n(s[s.length / 2])}) ÷ 2 = ${n(med(s))}`;
const halfSay = h => h.length % 2 ? `${n(med(h))}, the middle of ${list(h)}` : `(${n(h[h.length / 2 - 1])} + ${n(h[h.length / 2])}) ÷ 2 = ${n(med(h))}, halfway between the two middle values of ${list(h)}`;
/* q06 and q08 share the deviation working of q07. */
const spread = xs => { const N = xs.length, mean = sum(xs) / N, dev = xs.map(x => x - mean), sq = dev.map(d => d * d), SS = sum(sq), s2 = SS / (N - 1); return { N, mean, dev, sq, SS, s2, s: Math.sqrt(s2) }; };
const plural = (k, one, many) => k === 1 ? one : many;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A frequency table of daily check-ups (0 to 4) over N days, N in {20, 25, 40, 50} so every relative frequency is an
    exact decimal with at most 3 places. Every class has at least one day and at most a third of them. Not the worked
    example (20 days: 2, 5, 7, 4, 2). */
 q01: {
  canonical: { N: 25, c: [3, 6, 8, 5, 3], k: 2 },
  draw: R => { let N, c; do { N = R.pick([20, 25, 40, 50]); const top = Math.floor(N / 3); c = [R.int(1, top), R.int(1, top), R.int(1, top), R.int(1, top)]; c.push(N - sum(c)); } while (c[4] < 1 || c[4] > Math.floor(N / 3) || (N === 20 && same(c, [2, 5, 7, 4, 2]))); return { N, c, k: R.int(1, 3) }; },
  build: ({ N, c, k }) => { const rf = c[k] / N, upto = c.slice(0, k + 1), cnt = sum(upto), cum = cnt / N; return {
   prompt: `The clinic files a log at the Records Office of how many crew came in for a check-up each day. Over the last ${n(N)} days its frequency table reads: check-ups in a day 0, 1, 2, 3, 4; number of days ${list(c)}. Enter the relative frequency of the days on which the count was ${n(k)}, then the cumulative relative frequency of the days on which the count was ${n(k)} or fewer. Give both as exact decimals.`,
   answer: [rf, cum],
   hints: ['A relative frequency is the frequency of one class divided by the total of all the frequencies.', 'A cumulative relative frequency adds the relative frequency of a class to those of every class before it in the table.'],
   solution: `The frequencies add up to the number of days logged: ${c.map(n).join(' + ')} = ${n(N)}. The class ${n(k)} has frequency ${n(c[k])}, so its relative frequency is ${n(c[k])} ÷ ${n(N)} = ${n(rf)}. The counts from 0 to ${n(k)} cover ${upto.map(n).join(' + ')} = ${n(cnt)} days, so the cumulative relative frequency is ${n(cnt)} ÷ ${n(N)} = ${n(cum)}. Adding the relative frequencies row by row, ${upto.map(x => n(x / N)).join(' + ')}, gives the same ${n(cum)}.`,
   guidance: [
    { prompt: `How many days does the log cover? Add the frequencies ${list(c)}.`, answer: [N], explanation: `${c.map(n).join(' + ')} = ${n(N)}. The frequencies of a table always add up to the number of readings.` },
    { prompt: `On how many days was the count ${n(k)}, and what is that frequency divided by ${n(N)}?`, answer: [c[k], rf], explanation: `The table gives the frequency ${n(c[k])}, and ${n(c[k])} ÷ ${n(N)} = ${n(rf)}: that share of the days had a count of ${n(k)}.` },
    { prompt: `On how many days was the count ${n(k)} or fewer, and what is that number divided by ${n(N)}?`, answer: [cnt, cum], explanation: `${upto.map(n).join(' + ')} = ${n(cnt)} days, and ${n(cnt)} ÷ ${n(N)} = ${n(cum)}.` }
   ] }; }
 },
 /* N = 6 to 10 plot yields from 20 to 60 kg whose mean has at most one decimal. Not the worked example (30, 26, 34, 29, 31). */
 q02: {
  canonical: { x: [42, 37, 51, 45, 39, 48, 44, 46] },
  draw: R => { let x; do { const N = R.int(6, 10); x = []; for (let i = 0; i < N; i++) x.push(R.int(20, 60)); } while ((10 * sum(x)) % x.length !== 0 || same(x, [30, 26, 34, 29, 31])); return { x }; },
  build: ({ x }) => { const N = x.length, S = sum(x), mean = S / N; return {
   prompt: `The Records Office has the bean yields, in kilograms, of ${n(N)} trial plots in the greenhouse: ${list(x)}. Treat these plots as a sample of all the outpost’s plots. Enter the total yield Σx in kilograms, then the sample mean x̄ in kilograms.`,
   answer: [S, mean],
   hints: ['Σx means “add up every reading x”. Add the yields one at a time and keep a running total.', 'The sample mean x̄ is the total Σx divided by n, the number of readings.'],
   solution: `Σx = ${x.map(n).join(' + ')} = ${n(S)} kg. There are n = ${n(N)} plots, so x̄ = Σx ÷ n = ${n(S)} ÷ ${n(N)} = ${n(mean)} kg.`,
   guidance: [
    { prompt: `How many readings are there? That number is n.`, answer: [N], explanation: `Counting the yields gives n = ${n(N)}.` },
    { prompt: `Add the ${n(N)} yields. What is Σx?`, answer: [S], explanation: `${x.map(n).join(' + ')} = ${n(S)} kg.` },
    { prompt: `Divide the total by n. What is ${n(S)} ÷ ${n(N)}?`, answer: [mean], explanation: `${n(S)} ÷ ${n(N)} = ${n(mean)}, so the sample mean is x̄ = ${n(mean)} kg per plot.` }
   ] }; }
 },
 /* N = 7 to 10 pod counts: one count repeated 2 or 3 times (the only mode), the rest different from each other.
    Shuffled, so the player puts them in order. Not the worked example. */
 q03: {
  canonical: { x: [23, 31, 19, 27, 31, 22, 35, 26] },
  draw: R => { let x; do { const N = R.int(7, 10), m = R.int(14, 40), reps = R.int(2, 3), pool = [];
   while (pool.length < N - reps) { const v = R.int(10, 45); if (v !== m && !pool.includes(v)) pool.push(v); }
   for (let i = 0; i < reps; i++) pool.push(m); x = shuffle(R, pool); } while (same(sorted(x), [12, 15, 15, 18, 20, 24, 29])); return { x }; },
  build: ({ x }) => { const N = x.length, s = sorted(x), M = med(s), count = {}; x.forEach(v => { count[v] = (count[v] || 0) + 1; });
   const mode = Number(Object.keys(count).find(k => count[k] > 1)), reps = count[mode]; return {
   prompt: `A Records Office clerk counted the seed pods on ${n(N)} bean plants and wrote the counts down in the order she met the plants: ${list(x)}. Enter the median number of pods, then the mode.`,
   answer: [M, mode],
   hints: ['Put the counts in order from smallest to largest first. With an odd number of counts the median is the middle one; with an even number it is halfway between the two middle ones.', 'The mode is the count that appears most often.'],
   solution: `In order the counts are ${list(s)}. There are ${n(N)} counts, an ${N % 2 ? 'odd' : 'even'} number, so the median is ${medSay(s, 'count')}. The count ${n(mode)} appears ${reps === 2 ? 'twice' : 'three times'} and every other count once, so the mode is ${n(mode)}.`,
   guidance: [
    { prompt: `Put the ${n(N)} counts in order. What are the smallest and the largest?`, answer: [s[0], s[N - 1]], explanation: `In order: ${list(s)}. The smallest is ${n(s[0])} and the largest is ${n(s[N - 1])}.` },
    { prompt: `There are ${n(N)} counts. What is the median?`, answer: [M], explanation: `${N % 2 ? 'An odd number of counts has one middle count' : 'An even number of counts has two middle counts'}: the median is ${medSay(s, 'count')}.` },
    { prompt: `Which count appears most often?`, answer: [mode], explanation: `${n(mode)} appears ${reps === 2 ? 'twice' : 'three times'}; every other count appears once. So the mode is ${n(mode)}.` }
   ] }; }
 },
 /* Crew sizes s to s + 3 with frequencies at least 1 over N runs, N in {20, 25, 50, 100} (no 10, whose few tables repeated too often) so the mean is an exact decimal
    with at most 2 places. Not the worked example (sizes 1 to 4, frequencies 2, 3, 4, 1). */
 q04: {
  canonical: { s: 3, f: [4, 7, 6, 3] },
  draw: R => { let s, f, N; do { N = R.pick([20, 25, 50, 100]); const top = Math.floor(N / 3); s = R.int(2, 4); f = [R.int(1, top), R.int(1, top), R.int(1, top)]; f.push(N - sum(f)); } while (f[3] < 1 || f[3] > Math.floor(N / 2)); return { s, f }; },
  build: ({ s, f }) => { const v = f.map((_, i) => s + i), N = sum(f), rows = f.map((k, i) => v[i] * k), T = sum(rows), mean = T / N; return {
   prompt: `The Records Office lists the crew sizes of its recent shuttle runs in a frequency table: crew size ${list(v)}; frequency (number of runs) ${list(f)}. Enter the number of runs, then the total of all the crew sizes (every seat filled, counted over all the runs), then the mean crew size per run as an exact decimal.`,
   answer: [N, T, mean],
   hints: ['Each row stands for several runs of the same size: multiply each crew size by its frequency to get that row’s total.', 'The mean is the grand total divided by the number of runs, which is the sum of the frequencies, not the number of rows.'],
   solution: `The number of runs is ${f.map(n).join(' + ')} = ${n(N)}. The row totals are ${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}, and they add up to ${n(T)}. The mean crew size is ${n(T)} ÷ ${n(N)} = ${n(mean)}.`,
   guidance: [
    { prompt: `How many runs does the table cover? Add the frequencies.`, answer: [N], explanation: `${f.map(n).join(' + ')} = ${n(N)} runs.` },
    { prompt: `Multiply each crew size by its frequency and add the four products. What is the total?`, answer: [T], explanation: `${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}; together ${rows.map(n).join(' + ')} = ${n(T)}.` },
    { prompt: `Divide the total by the number of runs. What is ${n(T)} ÷ ${n(N)}?`, answer: [mean], explanation: `${n(T)} ÷ ${n(N)} = ${n(mean)} crew per run on average.` }
   ] }; }
 },
 /* N = 8 to 12 distinct sorted readings. Not the worked example (3, 5, 6, 8, 9, 11, 12, 14, 15). */
 q05: {
  canonical: { x: [12, 15, 17, 18, 21, 24, 26, 29, 33, 38] },
  draw: R => { let x; do { const N = R.int(8, 12); x = [R.int(5, 30)]; while (x.length < N) x.push(x[x.length - 1] + R.int(1, 6)); } while (same(x, [3, 5, 6, 8, 9, 11, 12, 14, 15])); return { x }; },
  build: ({ x }) => { const N = x.length, Q = quart(x); return {
   prompt: `The Records Office has the outpost’s water use, in hundreds of litres, on ${n(N)} days, already sorted from smallest to largest: ${list(x)}. Find the quartiles by the median-of-halves method. Enter the first quartile Q1, then the third quartile Q3.`,
   answer: [Q.q1, Q.q3],
   hints: ['Find the median first. The lower half is every reading before the median’s place and the upper half every reading after it; with an odd number of readings the median itself is in neither half.', 'Q1 is the median of the lower half, and Q3 is the median of the upper half.'],
   solution: `There are ${n(N)} readings, so the median is ${medSay(x, 'reading')}. ${N % 2 ? 'Leaving the median out, the' : 'The'} lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}.`,
   guidance: [
    { prompt: `There are ${n(N)} readings. What is the median?`, answer: [Q.m], explanation: `The median is ${medSay(x, 'reading')}.` },
    { prompt: `The lower half is ${list(Q.lower)}. What is its median, Q1?`, answer: [Q.q1], explanation: `Q1 = ${halfSay(Q.lower)}.` },
    { prompt: `The upper half is ${list(Q.upper)}. What is its median, Q3?`, answer: [Q.q3], explanation: `Q3 = ${halfSay(Q.upper)}.` }
   ] }; }
 },
 /* N = 9 to 12 sorted run times: a steady run of values, then 0 to 2 raised by a jump at the top and possibly one low
    value. No reading sits exactly on a fence. Not the worked example. */
 q06: {
  canonical: { x: [31, 34, 35, 37, 38, 40, 41, 43, 44, 47, 62] },
  draw: R => { let x, ok; do { const N = R.int(9, 12); x = [R.int(20, 40)]; while (x.length < N) x.push(x[x.length - 1] + R.int(1, 4));
   const hi = R.int(0, 2), J = R.int(8, 30); for (let i = N - hi; i < N; i++) x[i] += J + (i - (N - hi)) * R.int(0, 6);
   if (R.int(0, 2) === 0) x[0] -= R.int(8, 15);
   const Q = quart(x), I = Q.q3 - Q.q1, uf = Q.q3 + 1.5 * I, lf = Q.q1 - 1.5 * I;
   ok = I > 0 && !x.some(v => v === uf || v === lf) && !same(x, [12, 14, 15, 16, 18, 19, 21, 22, 40]); } while (!ok); return { x }; },
  build: ({ x }) => { const N = x.length, Q = quart(x), I = Q.q3 - Q.q1, st = 1.5 * I, uf = Q.q3 + st, lf = Q.q1 - st, out = x.filter(v => v < lf || v > uf), k = out.length; return {
   prompt: `The Records Office timed the supply drone on ${n(N)} delivery runs. The times in minutes, sorted: ${list(x)}. Find Q1 and Q3 by the median-of-halves method. Enter the interquartile range IQR = Q3 − Q1, then the upper fence Q3 + 1.5 × IQR, then the number of outliers: runs below the lower fence Q1 − 1.5 × IQR or above the upper fence.`,
   answer: [I, uf, k],
   hints: ['Find Q1 and Q3 by the median-of-halves method; the IQR is the gap between them.', 'Multiply the IQR by 1.5. Add that to Q3 for the upper fence and take it from Q1 for the lower fence, then count the readings outside the two fences.'],
   solution: `The lower half is ${list(Q.lower)}, so Q1 = ${n(Q.q1)}; the upper half is ${list(Q.upper)}, so Q3 = ${n(Q.q3)}. IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)}, and 1.5 × ${n(I)} = ${n(st)}. The upper fence is ${n(Q.q3)} + ${n(st)} = ${n(uf)} and the lower fence is ${n(Q.q1)} − ${n(st)} = ${n(lf)}. ${k === 0 ? 'Every run lies between the fences, so there are no outliers.' : k === 1 ? `Only ${n(out[0])} lies outside the fences, so there is 1 outlier.` : `${out.map(n).join(' and ')} lie outside the fences, so there are ${n(k)} outliers.`}`,
   guidance: [
    { prompt: `Split the ${n(N)} times into a lower and an upper half${N % 2 ? ', leaving the median out' : ''}. What are Q1 and Q3?`, answer: [Q.q1, Q.q3], explanation: `Lower half ${list(Q.lower)} gives Q1 = ${n(Q.q1)}; upper half ${list(Q.upper)} gives Q3 = ${n(Q.q3)}.` },
    { prompt: `IQR = ${n(Q.q3)} − ${n(Q.q1)} = ${n(I)}. What are the lower fence Q1 − 1.5 × IQR and the upper fence Q3 + 1.5 × IQR?`, answer: [lf, uf], explanation: `1.5 × ${n(I)} = ${n(st)}. ${n(Q.q1)} − ${n(st)} = ${n(lf)} and ${n(Q.q3)} + ${n(st)} = ${n(uf)}.` },
    { prompt: `How many of the ${n(N)} times lie below ${n(lf)} or above ${n(uf)}?`, answer: [k], explanation: k === 0 ? `None: the smallest time, ${n(x[0])}, and the largest, ${n(x[N - 1])}, are both inside the fences.` : `${out.map(n).join(' and ')} ${plural(k, 'is', 'are')} outside the fences, so the count is ${n(k)}.` }
   ] }; }
 },
 /* N = 5 to 7 whole-number depths with a whole mean. s² and s are shown to 2 decimals; draws where either sits on a
    rounding tie, or where s worked from the rounded s² rounds differently, are left out. Not the worked example. */
 q07: {
  canonical: { x: [14, 9, 12, 17, 8] },
  draw: R => { let x, ok; do { const N = R.int(5, 7); x = []; for (let i = 0; i < N; i++) x.push(R.int(5, 30));
   const S = spread(x); ok = sum(x) % N === 0 && S.SS > 0 && !tie2(S.s2) && !tie2(S.s) && r2(Math.sqrt(r2(S.s2))) === r2(S.s) && !same(x, [6, 10, 7, 9, 8]); } while (!ok); return { x }; },
  build: ({ x }) => { const S = spread(x), N = S.N; return {
   prompt: `At the Survey Camp the crew measured the depth of the dust layer, in millimetres, at ${n(N)} survey stakes: ${list(x)}. Treat these as a sample. Enter the sample variance s², then the sample standard deviation s, each to 2 decimal places.`,
   answer: [r2(S.s2), r2(S.s)],
   hints: ['Find the mean first, then each reading’s deviation from it: the reading minus the mean. Square every deviation and add the squares.', 'For a sample, divide that sum by n − 1, one less than the number of readings, to get s². Then s is the square root of s².'],
   solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} mm. The deviations x − x̄ are ${list(S.dev)} (they add up to 0, a useful check), and their squares are ${list(S.sq)}, which add up to ${n(S.SS)}. With n − 1 = ${n(N - 1)}, s² = ${n(S.SS)} ÷ ${n(N - 1)} ${say2(S.s2)} mm², and s = √(${n(S.SS)} ÷ ${n(N - 1)}) ${say2(S.s)} mm.`,
   guidance: [
    { prompt: `What is the mean x̄ of the ${n(N)} depths?`, answer: [S.mean], explanation: `${x.map(n).join(' + ')} = ${n(sum(x))}, and ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} mm.` },
    { prompt: `Subtract ${n(S.mean)} from each depth, square the results and add them. What is the sum of the squared deviations?`, answer: [S.SS], explanation: `The deviations are ${list(S.dev)}; squared they are ${list(S.sq)}, and the sum is ${n(S.SS)}.` },
    { prompt: `Divide ${n(S.SS)} by n − 1 = ${n(N - 1)}, then take the square root. What are s² and s, to 2 decimal places?`, answer: [r2(S.s2), r2(S.s)], explanation: `s² = ${n(S.SS)} ÷ ${n(N - 1)} ${say2(S.s2)}, and s = √(${n(S.SS)} ÷ ${n(N - 1)}) ${say2(S.s)}.` }
   ] }; }
 },
 /* N = 6 to 9 walk times: N − 1 bunched within 6 minutes and one far trip on one side (the tail). The mean is whole,
    s is printed to 2 decimals, and z is worked from that printed s; draws where z from the exact s would round
    differently, or where s or z sits on a rounding tie, are left out. Not the worked example. */
 q08: {
  canonical: { x: [8, 22, 7, 9, 6, 10, 8] },
  draw: R => { let x, ok; do { const N = R.int(6, 9), off = R.int(-3, 10), right = R.bool(); x = [];
   for (let i = 0; i < N - 1; i++) x.push(20 + off + R.int(0, 6));
   x.push(right ? 26 + off + R.int(8, 20) : 20 + off - R.int(8, 12)); x = shuffle(R, x);
   const S = spread(x), M = med(sorted(x)), t = right ? Math.max(...x) : Math.min(...x), sr = r2(S.s), z = (t - S.mean) / sr;
   ok = sum(x) % N === 0 && (S.mean > M) === right && S.mean !== M && !tie2(S.s) && !tie2(z) && r2(z) === r2((t - S.mean) / S.s) && !same(sorted(x), [30, 31, 32, 33, 34, 50]); } while (!ok); return { x }; },
  build: ({ x }) => { const S = spread(x), N = S.N, s = sorted(x), M = med(s), D = S.mean - M, right = D > 0, t = right ? s[N - 1] : s[0], sr = r2(S.s), z = (t - S.mean) / sr; return {
   prompt: `A survey team timed the walk along the ridge path, in minutes, on ${n(N)} trips: ${list(x)}. The sample standard deviation of these times is s = ${f2(sr)} minutes, rounded to 2 decimal places. Enter the mean minus the median; its sign shows the skew. Then enter the z-score of the ${right ? 'longest' : 'shortest'} trip, ${n(t)} minutes, using s = ${f2(sr)}, to 2 decimal places.`,
   answer: [D, r2(z)],
   hints: ['Find the mean and the median. A mean above the median usually means a long tail on the right (skewed to the right); a mean below it, a tail on the left.', 'A z-score counts standard deviations from the mean: z = (x − x̄) ÷ s. It is negative for a reading below the mean.'],
   solution: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)} minutes. In order the times are ${list(s)}, so the median is ${medSay(s, 'time')}. The mean minus the median is ${n(S.mean)} − ${n(M)} = ${n(D)}, which is ${right ? 'positive: the data are skewed to the right, pulled up by the one long trip' : 'negative: the data are skewed to the left, pulled down by the one short trip'}. The z-score of ${n(t)} is (${n(t)} − ${n(S.mean)}) ÷ ${n(sr)} = ${n(t - S.mean)} ÷ ${n(sr)} ${say2(z)}.`,
   guidance: [
    { prompt: `What are the mean and the median of the ${n(N)} times?`, answer: [S.mean, M], explanation: `x̄ = ${n(sum(x))} ÷ ${n(N)} = ${n(S.mean)}. In order, ${list(s)}: the median is ${medSay(s, 'time')}.` },
    { prompt: `What is the mean minus the median, ${n(S.mean)} − ${n(M)}?`, answer: [D], explanation: `${n(S.mean)} − ${n(M)} = ${n(D)}. It is ${right ? 'positive, so the tail is on the right' : 'negative, so the tail is on the left'}.` },
    { prompt: `What is z = (${n(t)} − ${n(S.mean)}) ÷ ${n(sr)}, to 2 decimal places?`, answer: [r2(z)], explanation: `${n(t - S.mean)} ÷ ${n(sr)} ${say2(z)}. The ${right ? 'longest' : 'shortest'} trip is about ${n(Math.abs(r2(z)))} standard deviations ${right ? 'above' : 'below'} the mean.` }
   ] }; }
 },
 /* Three domes of f × a crew (a = 2 to 9 sampled from each, at most 25 in all), so every proportional share is whole;
    the systematic step is f and the start s is from 1 to f. Not the worked example (f 5, a 6, 4, 2, start 2). */
 q09: {
  canonical: { f: 8, a: [5, 3, 2], s: 3 },
  draw: R => { let p; do { p = { f: R.int(4, 12), a: [R.int(2, 9), R.int(2, 9), R.int(2, 9)] }; p.s = R.int(1, p.f); } while (sum(p.a) > 25 || (p.f === 5 && same(p.a, [6, 4, 2]))); return p; },
  build: ({ f, a, s }) => { const D = a.map(k => k * f), K = sum(a), N = f * K, third = s + 2 * f; return {
   prompt: `Mira wants ${n(K)} crew members surveyed about the new ration menu. The crew live in three domes: ${n(D[0])} in Dome A, ${n(D[1])} in Dome B and ${n(D[2])} in Dome C, ${n(N)} in all. For a proportional stratified sample, enter how many to take from Dome A, from Dome B and from Dome C. Then, for a systematic sample of ${n(K)} instead, the whole crew list is numbered 1 to ${n(N)} and the first person chosen is number ${n(s)}, picked at random from numbers 1 to ${n(f)}. Enter the number of the third person chosen.`,
   answer: [a[0], a[1], a[2], third],
   hints: ['In a proportional stratified sample each stratum gets the same share of the sample as it has of the population: its size divided by the total, times the sample size.', 'In a systematic sample the step is the population size divided by the sample size. Start at the first pick and add the step each time: the third pick is two steps on.'],
   solution: `Dome A: ${n(D[0])} ÷ ${n(N)} × ${n(K)} = ${n(a[0])}; Dome B: ${n(D[1])} ÷ ${n(N)} × ${n(K)} = ${n(a[1])}; Dome C: ${n(D[2])} ÷ ${n(N)} × ${n(K)} = ${n(a[2])}. Together ${a.map(n).join(' + ')} = ${n(K)}, the whole sample. For the systematic sample the step is ${n(N)} ÷ ${n(K)} = ${n(f)}, so the picks are number ${n(s)}, ${n(s + f)}, ${n(third)} and so on: the third person chosen is number ${n(third)}.`,
   guidance: [
    { prompt: `The sample is ${n(K)} out of ${n(N)}. How many crew members does each person in the sample stand for: what is ${n(N)} ÷ ${n(K)}?`, answer: [f], explanation: `${n(N)} ÷ ${n(K)} = ${n(f)}: the sample takes 1 crew member in every ${n(f)}.` },
    { prompt: `Taking 1 in every ${n(f)} from each dome, how many come from Dome A, Dome B and Dome C?`, answer: [a[0], a[1], a[2]], explanation: `${n(D[0])} ÷ ${n(f)} = ${n(a[0])}, ${n(D[1])} ÷ ${n(f)} = ${n(a[1])} and ${n(D[2])} ÷ ${n(f)} = ${n(a[2])}.` },
    { prompt: `The systematic sample starts at number ${n(s)} and steps by ${n(f)}. What number is the third pick?`, answer: [third], explanation: `${n(s)}, then ${n(s)} + ${n(f)} = ${n(s + f)}, then ${n(s + f)} + ${n(f)} = ${n(third)}.` }
   ] }; }
 },
 /* σ = g ÷ 10 (2.0 to 20.0) and n = r² (9 to 144), so √n is whole; draws whose standard error sits on a rounding tie
    are left out. Not the worked example (σ 9, n 25). */
 q10: {
  canonical: { g: 74, r: 7 },
  draw: R => { let p; do { p = { g: R.int(20, 200), r: R.int(3, 12) }; } while (tie2(p.g / 10 / p.r) || (p.g === 90 && p.r === 5)); return p; },
  build: ({ g, r }) => { const sg = g / 10, N = r * r, se = sg / r, N4 = 4 * N; return {
   prompt: `Survey Camp records show that soil moisture readings across the plain vary with standard deviation σ = ${n(sg)} grams of water per kilogram of soil. The crew will average n = ${n(N)} readings taken at points chosen at random. Enter the standard error of the sample mean, σ ÷ √n, in grams per kilogram to 2 decimal places. Then enter the sample size that would halve the standard error.`,
   answer: [r2(se), N4],
   hints: ['The standard error of the sample mean is σ ÷ √n: the spread of single readings divided by the square root of the sample size.', 'Because n sits under a square root, halving the standard error needs √n to double, so n must be multiplied by 4.'],
   solution: `√${n(N)} = ${n(r)}, so the standard error is ${n(sg)} ÷ ${n(r)} ${say2(se)} ${r2(se) === 1 ? 'gram' : 'grams'} per kilogram. To halve it, √n must double from ${n(r)} to ${n(2 * r)}, so n = ${n(2 * r)} × ${n(2 * r)} = ${n(N4)} readings: four times as many.`,
   guidance: [
    { prompt: `What is √n for n = ${n(N)}?`, answer: [r], explanation: `${n(r)} × ${n(r)} = ${n(N)}, so √${n(N)} = ${n(r)}.` },
    { prompt: `What is σ ÷ √n = ${n(sg)} ÷ ${n(r)}, to 2 decimal places?`, answer: [r2(se)], explanation: `${n(sg)} ÷ ${n(r)} ${say2(se)}. A typical sample mean of ${n(N)} readings lands about that far from the true mean.` },
    { prompt: `For half the standard error, √n must be twice ${n(r)}. What sample size n has √n = ${n(2 * r)}?`, answer: [N4], explanation: `${n(2 * r)} × ${n(2 * r)} = ${n(N4)}, which is 4 × ${n(N)}.` }
   ] }; }
 },
});
})();
