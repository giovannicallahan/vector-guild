/* Data and inference practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p1.js. */
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
/* list: "3, 6, 8"; sum; sorted copy; median of a sorted list; same: equal lists; shuffle: Fisher–Yates with the draw's random source. */
const list = xs => xs.map(n).join(', ');
const sum = xs => xs.reduce((s, x) => s + x, 0);
const sorted = xs => xs.slice().sort((a, b) => a - b);
const med = s => s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const shuffle = (R, xs) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* 1st, 2nd, 3rd, 4th … 11th, 12th, 21st, 51st. */
const ord = k => { const r = k % 100, t = k % 10; return k + (r >= 11 && r <= 13 ? 'th' : t === 1 ? 'st' : t === 2 ? 'nd' : t === 3 ? 'rd' : 'th'); };
/* Quartiles by the median-of-halves method of OpenStax 2.3: with an odd count the median is left out of both halves. */
const halves = s => { const h = Math.floor(s.length / 2); return { lower: s.slice(0, h), upper: s.slice(s.length - h) }; };
const quart = s => { const { lower, upper } = halves(s); return { lower, upper, m: med(s), q1: med(lower), q3: med(upper) }; };
/* "the 5th reading, 21" or "halfway between the 5th and 6th readings: (21 + 24) ÷ 2 = 22.5" */
const medSay = (s, noun) => s.length % 2
 ? `the ${ord((s.length + 1) / 2)} ${noun}, ${n(med(s))}`
 : `halfway between the ${ord(s.length / 2)} and ${ord(s.length / 2 + 1)} ${noun}s: (${n(s[s.length / 2 - 1])} + ${n(s[s.length / 2])}) ÷ 2 = ${n(med(s))}`;
const halfSay = h => h.length % 2 ? `${n(med(h))}, the middle of ${list(h)}` : `(${n(h[h.length / 2 - 1])} + ${n(h[h.length / 2])}) ÷ 2 = ${n(med(h))}, halfway between the two middle values of ${list(h)}`;
/* A note for the prompt when a number to type is 1000 or more. */
const nc = x => x >= 1000 ? ' (type it without commas)' : '';

/* ---- q01 Data, samples and frequency tables [1.3] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The drill bit tally',
 brief: 'The mine office checks its drill bits at the end of every shift, and the foreman wants to know how often a shift ends with several of them broken.',
 labels: ['shifts logged', 'relative frequency', 'cumulative relative frequency'], tolerance: 0.0005,
 gl: [['shifts logged'], ['frequency', 'relative frequency'], ['shifts with that count or fewer', 'cumulative relative frequency']]
}, {
 /* Six classes (0 to 5 broken bits) over N shifts, N in {20, 25, 40, 50} so every relative frequency is an exact decimal with at most 3 places.
    Every class has at least one shift and at most a third of them. k and j are different classes from 1 to 4. */
 canonical: { N: 40, c: [5, 9, 12, 8, 4, 2], k: 1, j: 3 },
 draw: R => { let N, c; do { N = R.pick([20, 25, 40, 50]); const top = Math.floor(N / 3); c = [R.int(1, top), R.int(1, top), R.int(1, top), R.int(1, top), R.int(1, top)]; c.push(N - sum(c)); } while (c[5] < 1 || c[5] > Math.floor(N / 3));
  const k = R.int(1, 4); return { N, c, k, j: R.except(1, 4, [k]) }; },
 build: ({ N, c, k, j }) => { const rf = c[k] / N, upto = c.slice(0, j + 1), cnt = sum(upto), cum = cnt / N; return {
  prompt: `The mine office logs how many drill bits were found broken at the end of each shift and sends the log to the Records Office. Its frequency table reads: broken bits at the end of a shift 0, 1, 2, 3, 4, 5; number of shifts ${list(c)}. Enter the number of shifts in the log, then the relative frequency of the shifts on which the count was ${n(k)}, then the cumulative relative frequency of the shifts on which the count was ${n(j)} or fewer. Give the last two as exact decimals.`,
  answer: [N, rf, cum],
  hints: ['The frequencies of all the classes add up to the number of shifts. A relative frequency is the frequency of one class divided by that total.', 'For a cumulative relative frequency, add the frequencies of the class and of every class before it in the table, then divide by the total.'],
  solution: `The frequencies add up to the number of shifts: ${c.map(n).join(' + ')} = ${n(N)}. The class ${n(k)} has frequency ${n(c[k])}, so its relative frequency is ${n(c[k])} ÷ ${n(N)} = ${n(rf)}. The classes from 0 to ${n(j)} cover ${upto.map(n).join(' + ')} = ${n(cnt)} shifts, so the cumulative relative frequency is ${n(cnt)} ÷ ${n(N)} = ${n(cum)}.`,
  guidance: [
   { prompt: `How many shifts does the log cover? Add the frequencies ${list(c)}.`, answer: [N], explanation: `${c.map(n).join(' + ')} = ${n(N)} shifts.` },
   { prompt: `On how many shifts was the count ${n(k)}, and what is that frequency divided by ${n(N)}?`, answer: [c[k], rf], explanation: `The table gives the frequency ${n(c[k])}, and ${n(c[k])} ÷ ${n(N)} = ${n(rf)}.` },
   { prompt: `On how many shifts was the count ${n(j)} or fewer, and what is that number divided by ${n(N)}?`, answer: [cnt, cum], explanation: `${upto.map(n).join(' + ')} = ${n(cnt)} shifts, and ${n(cnt)} ÷ ${n(N)} = ${n(cum)}.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Rostering for busy days',
 brief: 'The pump crew can only be on call for the days that bring several alarms, so Mira needs to know how many such days to plan for.',
 labels: ['relative frequency of busy days', 'busy days expected'], tolerance: 0.0005,
 gl: [['days logged'], ['busy days', 'relative frequency of busy days'], ['busy days expected']]
}, {
 /* Five classes (0 to 4 alarms) over N days, N in {20, 25, 40, 50}. A busy day has k or more alarms, k is 2 or 3. The expected number of busy days in
    200 is the relative frequency times 200, which is a whole number for every N. Not the q01 canonical or worked example. */
 canonical: { N: 40, c: [6, 12, 11, 7, 4], k: 3 },
 draw: R => { let N, c; do { N = R.pick([20, 25, 40, 50]); const top = Math.floor(N / 3); c = [R.int(1, top), R.int(1, top), R.int(1, top), R.int(1, top)]; c.push(N - sum(c)); } while (c[4] < 1 || c[4] > Math.floor(N / 3) || same(c, [3, 6, 8, 5, 3]) || same(c, [2, 5, 7, 4, 2]));
  return { N, c, k: R.int(2, 3) }; },
 build: ({ N, c, k }) => { const busy = c.slice(k), B = sum(busy), rf = B / N, exp = Math.round(rf * 200 * 1e9) / 1e9, cls = k === 2 ? '2, 3 and 4' : '3 and 4'; return {
  prompt: `The farm domes log how many times the irrigation pump raised an alarm each day. Over the last ${n(N)} days the frequency table reads: alarms in a day 0, 1, 2, 3, 4; number of days ${list(c)}. Mira calls a day busy when the pump raised ${n(k)} or more alarms, and wants a crew on call for the busy days. Enter the relative frequency of busy days as an exact decimal, then how many of the next 200 days to expect to be busy, if the next 200 days follow the same shares as this log.`,
  answer: [rf, exp],
  hints: ['Add the frequencies of every class that counts as busy, then divide by the total number of days in the log.', 'If the shares stay the same, the number of busy days in 200 days is the relative frequency of busy days times 200.'],
  solution: `The frequencies add up to ${c.map(n).join(' + ')} = ${n(N)} days. The busy classes are ${cls} alarms: ${busy.map(n).join(' + ')} = ${n(B)} busy days, so the relative frequency of busy days is ${n(B)} ÷ ${n(N)} = ${n(rf)}. If the same share holds, ${n(rf)} × 200 = ${n(exp)} of the next 200 days are busy.`,
  guidance: [
   { prompt: `How many days does the log cover? Add the frequencies ${list(c)}.`, answer: [N], explanation: `${c.map(n).join(' + ')} = ${n(N)} days.` },
   { prompt: `A day is busy with ${n(k)} or more alarms. How many days were busy, and what is that number divided by ${n(N)}?`, answer: [B, rf], explanation: `The busy classes are ${cls} alarms: ${busy.map(n).join(' + ')} = ${n(B)} days, and ${n(B)} ÷ ${n(N)} = ${n(rf)}.` },
   { prompt: `If the next 200 days have the same share of busy days, how many of them are busy? Multiply the relative frequency ${n(rf)} by 200.`, answer: [exp], explanation: `${n(rf)} × 200 = ${n(exp)} busy days.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The smudged airlock log',
 brief: 'One entry of the airlock log has been smudged, and the safety review still needs its shares.',
 labels: ['missing frequency', 'relative frequency', 'cumulative relative frequency'], tolerance: 0.00005,
 gl: [['frequencies added', 'missing frequency'], ['relative frequency'], ['cycles with that count or fewer', 'cumulative relative frequency']]
}, {
 /* Six classes (0 to 5 warnings) over N cycles, N in {80, 125, 200}: every relative frequency is an exact decimal with at most 4 places.
    Class m (1 to 3) is smudged. j is 1 or 2 classes after m, at most 4. Every class has at least 2 cycles and at most a third of them. */
 canonical: { N: 125, c: [14, 22, 31, 27, 19, 12], m: 2, j: 4 },
 draw: R => { let N, c; do { N = R.pick([80, 125, 200]); const lo = Math.floor(N / 12), hi = Math.floor(N / 4); c = [R.int(lo, hi), R.int(lo, hi), R.int(lo, hi), R.int(lo, hi), R.int(lo, hi)]; c.push(N - sum(c)); } while (c[5] < 2 || c[5] > Math.floor(N / 3));
  const m = R.int(1, 3); return { N, c, m, j: m + R.int(1, 2) }; },
 build: ({ N, c, m, j }) => { const known = N - c[m], shown = c.map((v, i) => i === m ? '?' : n(v)).join(', '), upto = c.slice(0, j + 1), cnt = sum(upto), rf = c[m] / N, cum = cnt / N; return {
  prompt: `The airlock crew logs how many seal warnings each cycle of the lock raised. The log covers ${n(N)} cycles in all. Its frequency table reads: warnings in a cycle 0, 1, 2, 3, 4, 5; number of cycles ${shown}. One frequency was smudged and shows as ?. Enter the missing frequency, then the relative frequency of the smudged class, then the cumulative relative frequency of the cycles with ${n(j)} warnings or fewer. Give the last two as exact decimals.`,
  answer: [c[m], rf, cum],
  hints: ['The frequencies of all six classes must add up to the number of cycles in the log, so the smudged one is what is left after the known ones are taken away.', 'Once the table is complete, divide by the total of all the frequencies: a class alone for a relative frequency, and that class with every class before it for a cumulative one.'],
  solution: `The five known frequencies add up to ${n(known)}, and the log covers ${n(N)} cycles, so the smudged frequency is ${n(N)} − ${n(known)} = ${n(c[m])}. Its relative frequency is ${n(c[m])} ÷ ${n(N)} = ${n(rf)}. The classes from 0 to ${n(j)} cover ${upto.map(n).join(' + ')} = ${n(cnt)} cycles, so the cumulative relative frequency is ${n(cnt)} ÷ ${n(N)} = ${n(cum)}.`,
  guidance: [
   { prompt: `Add the five known frequencies, then take that total away from ${n(N)}. What is the missing frequency?`, answer: [known, c[m]], explanation: `The known frequencies add up to ${n(known)}, and ${n(N)} − ${n(known)} = ${n(c[m])} cycles.` },
   { prompt: `What is the relative frequency of the smudged class, ${n(c[m])} divided by ${n(N)}?`, answer: [rf], explanation: `${n(c[m])} ÷ ${n(N)} = ${n(rf)}.` },
   { prompt: `How many cycles had ${n(j)} warnings or fewer, and what is that number divided by ${n(N)}?`, answer: [cnt, cum], explanation: `${upto.map(n).join(' + ')} = ${n(cnt)} cycles, and ${n(cnt)} ÷ ${n(N)} = ${n(cum)}.` }
  ] }; }
});

/* ---- q02 The mean of a data set, x̄ = Σx ÷ n [2.5] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Cycle times at the water recycler',
 brief: 'The water recycler runs a cleaning cycle every day, and the engineers want one fair number for how long a cycle takes.',
 labels: ['Σx (minutes)', 'x̄ (minutes)'], tolerance: 0.01,
 gl: [['n'], ['Σx (minutes)'], ['x̄ (minutes)']]
}, {
 /* N = 6 to 10 cycle times from 15 to 45 minutes whose mean has at most one decimal. Not the q02 canonical or worked example. */
 canonical: { x: [32, 27, 41, 35, 29, 38, 34, 32] },
 draw: R => { let x; do { const N = R.int(6, 10); x = []; for (let i = 0; i < N; i++) x.push(R.int(15, 45)); } while ((10 * sum(x)) % x.length !== 0 || same(x, [42, 37, 51, 45, 39, 48, 44, 46]) || same(x, [30, 26, 34, 29, 31])); return { x }; },
 build: ({ x }) => { const N = x.length, S = sum(x), mean = S / N; return {
  prompt: `The water recycler runs one cleaning cycle a day, and the Records Office has the length of ${n(N)} cycles, in minutes: ${list(x)}. Treat these cycles as a sample of all the cycles the recycler will ever run. Enter the total time Σx in minutes, then the sample mean x̄ in minutes.`,
  answer: [S, mean],
  hints: ['Σx means “add up every reading x”. Add the cycle times one at a time and keep a running total.', 'The sample mean x̄ is the total Σx divided by n, the number of readings.'],
  solution: `Σx = ${x.map(n).join(' + ')} = ${n(S)} minutes. There are n = ${n(N)} cycles, so x̄ = Σx ÷ n = ${n(S)} ÷ ${n(N)} = ${n(mean)} minutes.`,
  guidance: [
   { prompt: `How many readings are there? That number is n.`, answer: [N], explanation: `Counting the cycle times gives n = ${n(N)}.` },
   { prompt: `Add the ${n(N)} times. What is Σx?`, answer: [S], explanation: `${x.map(n).join(' + ')} = ${n(S)} minutes.` },
   { prompt: `Divide the total by n. What is ${n(S)} ÷ ${n(N)}?`, answer: [mean], explanation: `${n(S)} ÷ ${n(N)} = ${n(mean)}, so the sample mean is x̄ = ${n(mean)} minutes per cycle.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Crates for the tomato harvest',
 brief: 'Mira must order harvest crates for every tomato plot before picking starts, and she only has a few weighed plots to go on.',
 labels: ['x̄ (kg)', 'planned harvest (kg)'], tolerance: 0.01,
 gl: [['n', 'Σx (kg)'], ['x̄ (kg)'], ['planned harvest (kg)']]
}, {
 /* N = 5 to 8 plot yields from 8 to 19 kg whose mean has at most one decimal; M plots in all, M a multiple of 10 up to 50, so the plan is a
    whole number under 1000. Not the q02 canonical or worked example. */
 canonical: { x: [12, 15, 11, 14, 13, 16], M: 40 },
 draw: R => { let x; do { const N = R.int(5, 8); x = []; for (let i = 0; i < N; i++) x.push(R.int(8, 19)); } while ((10 * sum(x)) % x.length !== 0 || same(x, [30, 26, 34, 29, 31])); return { x, M: R.pick([20, 30, 40, 50]) }; },
 build: ({ x, M }) => { const N = x.length, S = sum(x), mean = S / N, plan = mean * M; return {
  prompt: `The greenhouse has ${n(M)} tomato plots in all. To plan the crate order, the Records Office weighed the harvest of ${n(N)} of them, in kilograms: ${list(x)}. Treat these ${n(N)} plots as a sample, and assume every plot in the greenhouse yields about the sample mean. Enter the sample mean x̄ in kilograms, then the harvest in kilograms to plan for from all ${n(M)} plots.`,
  answer: [mean, plan],
  hints: ['Add the weighed yields and divide by how many plots were weighed to get x̄.', 'If every plot yields about x̄, the harvest from all the plots is x̄ times the number of plots in the greenhouse, not the number weighed.'],
  solution: `Σx = ${x.map(n).join(' + ')} = ${n(S)} kg over n = ${n(N)} plots, so x̄ = ${n(S)} ÷ ${n(N)} = ${n(mean)} kg. With ${n(M)} plots each yielding about ${n(mean)} kg, the plan is ${n(mean)} × ${n(M)} = ${n(plan)} kg.`,
  guidance: [
   { prompt: `How many plots were weighed, and what do their yields add up to?`, answer: [N, S], explanation: `${n(N)} plots, and ${x.map(n).join(' + ')} = ${n(S)} kg.` },
   { prompt: `What is the sample mean x̄, the total ${n(S)} divided by ${n(N)}?`, answer: [mean], explanation: `${n(S)} ÷ ${n(N)} = ${n(mean)} kg per plot.` },
   { prompt: `If each of the ${n(M)} plots yields about ${n(mean)} kg, what harvest should Mira plan for?`, answer: [plan], explanation: `${n(mean)} × ${n(M)} = ${n(plan)} kg.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The lost fuel-cell reading',
 brief: 'The test bench kept the mean running time of its fuel cells but lost one cell\'s own reading, and the log has to be completed.',
 labels: ['Σx (hours)', 'missing reading (hours)'], tolerance: 0.01,
 gl: [['Σx (hours)'], ['total of the readings you have (hours)'], ['missing reading (hours)']]
}, {
 /* N = 6 to 9 cells, mean m a whole number from 30 to 60, or half a whole number when N is even, so Σx = m × N is a whole number.
    The N − 1 known readings are 20 to 70 and the missing one is 20 to 70. Not the q02 canonical or worked example. */
 canonical: { m: 45, x: [38, 52, 41, 47, 36, 50] },
 draw: R => { let m, x, N, S, miss; do { N = R.int(6, 9); m = R.int(30, 60) + (N % 2 === 0 ? R.pick([0, 0.5]) : 0); S = m * N; x = [];
   for (let i = 0; i < N - 1; i++) x.push(R.int(20, 70)); miss = S - sum(x); } while (miss < 20 || miss > 70); return { m, x }; },
 build: ({ m, x }) => { const N = x.length + 1, S = m * N, have = sum(x), miss = S - have; return {
  prompt: `A test bench ran ${n(N)} fuel cells until they were flat and found that the cells lasted a mean of ${n(m)} hours each. The Records Office has lost one of the readings. The other ${n(N - 1)}, in hours, are: ${list(x)}. Enter the total Σx of all ${n(N)} readings, then the missing reading.`,
  answer: [S, miss],
  hints: ['The mean is Σx ÷ n, so the total of all the readings is the mean times n.', 'The missing reading is the total of all the readings minus the total of the readings you still have.'],
  solution: `Since x̄ = Σx ÷ n, the total is Σx = x̄ × n = ${n(m)} × ${n(N)} = ${n(S)} hours. The ${n(N - 1)} known readings add up to ${x.map(n).join(' + ')} = ${n(have)}, so the missing reading is ${n(S)} − ${n(have)} = ${n(miss)} hours.`,
  guidance: [
   { prompt: `The mean of ${n(N)} readings is ${n(m)}. What must the total Σx of all of them be?`, answer: [S], explanation: `Σx = x̄ × n = ${n(m)} × ${n(N)} = ${n(S)} hours.` },
   { prompt: `What do the ${n(N - 1)} known readings add up to?`, answer: [have], explanation: `${x.map(n).join(' + ')} = ${n(have)} hours.` },
   { prompt: `What is the missing reading: the full total ${n(S)} minus the known total ${n(have)}?`, answer: [miss], explanation: `${n(S)} − ${n(have)} = ${n(miss)} hours.` }
  ] }; }
});

/* ---- q03 Median and mode [2.5] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Waiting at the clinic desk',
 brief: 'Patients at the clinic desk are grumbling about the queue, and the nurse wants a typical wait that one slow afternoon cannot distort.',
 labels: ['mode (minutes)', 'median (minutes)'], tolerance: 0.01,
 gl: [['smallest (minutes)', 'largest (minutes)'], ['mode (minutes)'], ['median (minutes)']]
}, {
 /* N = 9 to 12 waits: one wait repeated 2 or 3 times (the only mode), the rest different from each other. Shuffled. Not the q03 canonical or worked example. */
 canonical: { x: [18, 25, 31, 22, 25, 40, 29, 14, 35, 27] },
 draw: R => { let x; do { const N = R.int(9, 12), m = R.int(8, 30), reps = R.int(2, 3), pool = [];
   while (pool.length < N - reps) { const v = R.int(5, 45); if (v !== m && !pool.includes(v)) pool.push(v); }
   for (let i = 0; i < reps; i++) pool.push(m); x = shuffle(R, pool); } while (same(sorted(x), [12, 15, 15, 18, 20, 24, 29]) || same(sorted(x), [19, 22, 23, 26, 27, 31, 31, 35])); return { x }; },
 build: ({ x }) => { const N = x.length, s = sorted(x), M = med(s), count = {}; x.forEach(v => { count[v] = (count[v] || 0) + 1; });
  const mode = Number(Object.keys(count).find(k => count[k] > 1)), reps = count[mode]; return {
  prompt: `The clinic desk wrote down how many minutes each of ${n(N)} patients waited, in the order the patients were seen: ${list(x)}. Enter the mode of the waits, then the median wait, both in minutes.`,
  answer: [mode, M],
  hints: ['The mode is the wait that appears most often in the list.', 'For the median, put the waits in order from smallest to largest first. With an odd number of waits it is the middle one; with an even number it is halfway between the two middle ones.'],
  solution: `The wait ${n(mode)} appears ${reps === 2 ? 'twice' : 'three times'} and every other wait once, so the mode is ${n(mode)} minutes. In order the waits are ${list(s)}. There are ${n(N)} waits, an ${N % 2 ? 'odd' : 'even'} number, so the median is ${medSay(s, 'wait')} minutes.`,
  guidance: [
   { prompt: `Put the ${n(N)} waits in order. What are the smallest and the largest?`, answer: [s[0], s[N - 1]], explanation: `In order: ${list(s)}. The smallest is ${n(s[0])} and the largest is ${n(s[N - 1])}.` },
   { prompt: `Which wait appears most often in the list?`, answer: [mode], explanation: `${n(mode)} appears ${reps === 2 ? 'twice' : 'three times'}; every other wait appears once. So the mode is ${n(mode)} minutes.` },
   { prompt: `There are ${n(N)} waits. What is the median?`, answer: [M], explanation: `${N % 2 ? 'An odd number of waits has one middle wait' : 'An even number of waits has two middle waits'}: the median is ${medSay(s, 'wait')} minutes.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The long repair job',
 brief: 'One huge repair has dragged the workshop\'s average up, and Mira wants to see how far before she quotes a typical repair time to the crews.',
 labels: ['median (minutes)', 'mean (minutes)', 'mean above median (minutes)'], tolerance: 0.005,
 gl: [['median (minutes)'], ['mean (minutes)'], ['mean above median (minutes)']]
}, {
 /* N = 6 to 9 jobs: N − 1 ordinary jobs of 15 to 30 minutes and one rebuild of 70 to 140, in any place in the list. The mean is an exact decimal with at most
    2 places and is above the median. Not the q03 canonical or worked example. */
 canonical: { x: [22, 18, 96, 25, 20, 19, 24] },
 draw: R => { let x; do { const N = R.int(6, 9); x = []; for (let i = 0; i < N - 1; i++) x.push(R.int(15, 30)); x.splice(R.int(0, N - 1), 0, R.int(70, 140)); }
  while ((100 * sum(x)) % x.length !== 0 || sum(x) / x.length <= med(sorted(x)) || same(sorted(x), [12, 15, 15, 18, 20, 24, 29])); return { x }; },
 build: ({ x }) => { const N = x.length, s = sorted(x), M = med(s), S = sum(x), mean = S / N, diff = mean - M; return {
  prompt: `The workshop logged how long each of ${n(N)} repair jobs took, in minutes, in the order they were done: ${list(x)}. One of them was a full rebuild. Mira will quote one number to the crews as the typical repair time, and wants to see how much a single long job can move the mean. Enter the median, then the mean as an exact decimal, then how many minutes the mean is above the median.`,
  answer: [M, mean, diff],
  hints: ['Put the times in order for the median. The longest job sits at the very end of the list, so it does not matter how long it was.', 'The mean is the total of all the times divided by the number of jobs. The difference is the mean minus the median.'],
  solution: `In order the times are ${list(s)}. There are ${n(N)} jobs, an ${N % 2 ? 'odd' : 'even'} number, so the median is ${medSay(s, 'time')} minutes. The total is ${x.map(n).join(' + ')} = ${n(S)}, so the mean is ${n(S)} ÷ ${n(N)} = ${n(mean)} minutes. The mean is ${n(mean)} − ${n(M)} = ${n(diff)} minutes above the median.`,
  guidance: [
   { prompt: `Put the ${n(N)} times in order. What is the median?`, answer: [M], explanation: `In order: ${list(s)}. The median is ${medSay(s, 'time')} minutes.` },
   { prompt: `Add the ${n(N)} times and divide by ${n(N)}. What is the mean?`, answer: [mean], explanation: `${x.map(n).join(' + ')} = ${n(S)}, and ${n(S)} ÷ ${n(N)} = ${n(mean)} minutes.` },
   { prompt: `How many minutes is the mean above the median?`, answer: [diff], explanation: `${n(mean)} − ${n(M)} = ${n(diff)} minutes. The one long job pulls the mean up but leaves the median where it was.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'How long the filters last',
 brief: 'The dome air filters are tested to destruction, and the maintenance crew needs the typical life of a cartridge, found three ways.',
 labels: ['median (hours)', 'mode (hours)', 'mean (hours)'], tolerance: 0.005,
 gl: [['median (hours)'], ['mode (hours)'], ['mean (hours)']]
}, {
 /* N = 8 to 12 lifetimes of 3.1 to 9.9 hours with one decimal (never a whole number of hours), kept as tenths in v. One value is repeated 2 or 3 times and is the only mode.
    The mean is an exact decimal with at most 2 places. Not the q03 canonical or worked example. */
 canonical: { v: [47, 63, 52, 38, 63, 71, 45, 61] },
 draw: R => { let v; do { const N = R.int(8, 12), m = R.except(31, 99, [40, 50, 60, 70, 80, 90]), reps = R.int(2, 3), pool = [];
   while (pool.length < N - reps) { const t = R.int(31, 99); if (t !== m && !pool.includes(t) && t % 10 !== 0) pool.push(t); }
   for (let i = 0; i < reps; i++) pool.push(m); v = shuffle(R, pool); } while ((10 * sum(v)) % v.length !== 0); return { v }; },
 build: ({ v }) => { const x = v.map(t => t / 10), N = x.length, s = sorted(x), M = med(s), S = sum(v) / 10, mean = sum(v) / (10 * N), count = {}; x.forEach(t => { count[t] = (count[t] || 0) + 1; });
  const mode = Number(Object.keys(count).find(k => count[k] > 1)), reps = count[mode]; return {
  prompt: `The Records Office tested the filter cartridges of the dome air system and wrote down how many hours each of ${n(N)} cartridges lasted, in the order they were tested: ${list(x)}. Enter the median, the mode and the mean of the lifetimes, all in hours, with the mean as an exact decimal.`,
  answer: [M, mode, mean],
  hints: ['For the median, put the lifetimes in order from smallest to largest, then take the middle one or halfway between the two middle ones. The mode is the lifetime that appears most often.', 'The mean is the total of all the lifetimes divided by how many there are.'],
  solution: `In order the lifetimes are ${list(s)}. There are ${n(N)} readings, an ${N % 2 ? 'odd' : 'even'} number, so the median is ${medSay(s, 'reading')} hours. The lifetime ${n(mode)} appears ${reps === 2 ? 'twice' : 'three times'} and every other one once, so the mode is ${n(mode)} hours. The total is ${n(S)}, so the mean is ${n(S)} ÷ ${n(N)} = ${n(mean)} hours.`,
  guidance: [
   { prompt: `Put the ${n(N)} lifetimes in order. What is the median?`, answer: [M], explanation: `In order: ${list(s)}. The median is ${medSay(s, 'reading')} hours.` },
   { prompt: `Which lifetime appears most often?`, answer: [mode], explanation: `${n(mode)} appears ${reps === 2 ? 'twice' : 'three times'}; every other lifetime appears once. So the mode is ${n(mode)} hours.` },
   { prompt: `Add all ${n(N)} lifetimes and divide by ${n(N)}. What is the mean?`, answer: [mean], explanation: `${x.map(n).join(' + ')} = ${n(S)}, and ${n(S)} ÷ ${n(N)} = ${n(mean)} hours.` }
  ] }; }
});

/* ---- q04 The mean from a frequency table [2.5] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'Containers on the crawler',
 brief: 'The mine crawler hauls containers down to the shuttle bay, and the depot wants the mean load it carries per trip.',
 labels: ['trips', 'total containers', 'mean containers per trip'], tolerance: 0.005,
 gl: [['trips'], ['total containers'], ['mean containers per trip']]
}, {
 /* Five rows: loads s to s + 4 containers, s from 1 to 4, frequencies at least 1 over N trips, N in {20, 25, 40, 50}. The mean is an exact decimal with at most 2 places. */
 canonical: { s: 1, f: [3, 7, 8, 5, 2] },
 draw: R => { let s, f, N, T; do { N = R.pick([20, 25, 40, 50]); const top = Math.floor(N / 3); s = R.int(1, 4); f = [R.int(1, top), R.int(1, top), R.int(1, top), R.int(1, top)]; f.push(N - sum(f)); T = sum(f.map((k, i) => (s + i) * k)); }
   while (f[4] < 1 || f[4] > Math.floor(N / 2) || (100 * T) % N !== 0); return { s, f }; },
 build: ({ s, f }) => { const v = f.map((_, i) => s + i), N = sum(f), rows = f.map((k, i) => v[i] * k), T = sum(rows), mean = T / N; return {
  prompt: `The crawler hauls containers from the mine to the shuttle bay. The Records Office keeps the number of containers each trip carried as a frequency table for the last ${n(N)} trips: containers on a trip ${list(v)}; frequency (number of trips) ${list(f)}. Enter the number of trips, then the total number of containers carried over all the trips, then the mean number of containers per trip as an exact decimal.`,
  answer: [N, T, mean],
  hints: ['A row stands for several trips with the same load: multiply each load by its frequency to get the containers that row carried.', 'The mean is the total number of containers divided by the number of trips, which is the sum of the frequencies, not the number of rows.'],
  solution: `The number of trips is ${f.map(n).join(' + ')} = ${n(N)}. The row totals are ${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}, and they add up to ${n(T)}. The mean is ${n(T)} ÷ ${n(N)} = ${n(mean)} containers per trip.`,
  guidance: [
   { prompt: `How many trips does the table cover? Add the frequencies.`, answer: [N], explanation: `${f.map(n).join(' + ')} = ${n(N)} trips.` },
   { prompt: `Multiply each load by its frequency and add the five products. What is the total number of containers?`, answer: [T], explanation: `${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}; together ${rows.map(n).join(' + ')} = ${n(T)}.` },
   { prompt: `Divide the total by the number of trips. What is ${n(T)} ÷ ${n(N)}?`, answer: [mean], explanation: `${n(T)} ÷ ${n(N)} = ${n(mean)} containers per trip on average.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Empty beds at dawn',
 brief: 'The clinic checks its beds every dawn, and Mira wants to know how many sit empty on an average morning before she trims the ward.',
 labels: ['mean beds in use', 'mean empty beds'], tolerance: 0.005,
 gl: [['checks', 'total beds in use'], ['mean beds in use'], ['mean empty beds']]
}, {
 /* Four rows: beds in use s to s + 3, s from 2 to 4 (at most 7 of the 8 beds), frequencies at least 1 over N checks, N in {20, 25, 40, 50}.
    The mean is an exact decimal with at most 2 places. */
 canonical: { s: 3, f: [4, 9, 7, 5] },
 draw: R => { let s, f, N, T; do { N = R.pick([20, 25, 40, 50]); const top = Math.floor(N / 3); s = R.int(2, 4); f = [R.int(1, top), R.int(1, top), R.int(1, top)]; f.push(N - sum(f)); T = sum(f.map((k, i) => (s + i) * k)); }
   while (f[3] < 1 || f[3] > Math.floor(N / 2) || (100 * T) % N !== 0); return { s, f }; },
 build: ({ s, f }) => { const v = f.map((_, i) => s + i), N = sum(f), rows = f.map((k, i) => v[i] * k), T = sum(rows), mean = T / N, empty = Math.round((8 - mean) * 1e9) / 1e9; return {
  prompt: `The clinic has 8 beds. At the dawn check the Records Office writes down how many beds are in use, and the last ${n(N)} checks make a frequency table: beds in use ${list(v)}; number of checks ${list(f)}. Mira wants to know how many beds sit empty at a check on average. Enter the mean number of beds in use as an exact decimal, then the mean number of empty beds.`,
  answer: [mean, empty],
  hints: ['Multiply each number of beds in use by the number of checks that showed it, add the products, and divide by the total number of checks.', 'Every check has 8 beds in all, so the mean number of empty beds is 8 minus the mean number in use.'],
  solution: `The number of checks is ${f.map(n).join(' + ')} = ${n(N)}. The row totals are ${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}, which add up to ${n(T)} beds in use. The mean in use is ${n(T)} ÷ ${n(N)} = ${n(mean)}. Of 8 beds, the mean number empty is 8 − ${n(mean)} = ${n(empty)}.`,
  guidance: [
   { prompt: `How many checks does the table cover, and what is the total of beds in use? Multiply each number of beds by its frequency and add.`, answer: [N, T], explanation: `${f.map(n).join(' + ')} = ${n(N)} checks. ${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}; together ${rows.map(n).join(' + ')} = ${n(T)}.` },
   { prompt: `What is the mean number of beds in use, ${n(T)} divided by ${n(N)}?`, answer: [mean], explanation: `${n(T)} ÷ ${n(N)} = ${n(mean)} beds in use per check.` },
   { prompt: `The clinic has 8 beds. How many are empty on average?`, answer: [empty], explanation: `8 − ${n(mean)} = ${n(empty)} empty beds per check.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'Waits in the clinic queue',
 brief: 'The clinic files its waiting times as a table over many patients, and the council wants both the mean wait and the middle wait.',
 labels: ['mean wait (minutes)', 'median wait (minutes)'], tolerance: 0.005,
 gl: [['patients', 'total of all the waits (minutes)'], ['mean wait (minutes)'], ['lower middle wait (minutes)', 'upper middle wait (minutes)', 'median wait (minutes)']]
}, {
 /* Six rows of waits taken from one of four lists of values, N patients, N in {40, 50, 80, 100} (always even, so the median is halfway between two middle patients).
    Each frequency is at least 2 and at most a third of N. The mean is an exact decimal with at most 2 places. */
 canonical: { v: [5, 10, 15, 20, 30, 45], f: [4, 9, 14, 12, 8, 3] },
 draw: R => { let v, f, N, T; do { N = R.pick([40, 50, 80, 100]); v = R.pick([[5, 10, 15, 20, 30, 45], [10, 15, 20, 30, 40, 60], [2, 4, 6, 9, 12, 15], [20, 25, 30, 40, 50, 75]]);
   const lo = Math.floor(N / 12), hi = Math.floor(N / 4); f = [R.int(lo, hi), R.int(lo, hi), R.int(lo, hi), R.int(lo, hi), R.int(lo, hi)]; f.push(N - sum(f)); T = sum(f.map((k, i) => v[i] * k)); }
   while (f[5] < 2 || f[5] > Math.floor(N / 3) || (100 * T) % N !== 0); return { v, f }; },
 build: ({ v, f }) => { const N = sum(f), rows = f.map((k, i) => v[i] * k), T = sum(rows), mean = T / N, at = p => { let c = 0; for (let i = 0; i < f.length; i++) { c += f[i]; if (p <= c) return v[i]; } return v[v.length - 1]; },
  lo = at(N / 2), hi = at(N / 2 + 1), M = (lo + hi) / 2; return {
  prompt: `The clinic logs how long each patient waited before being seen, in minutes, as a frequency table over ${n(N)} patients: waiting time ${list(v)}; number of patients ${list(f)}. A row stands for that many patients who all waited that long, and the table is already in order of waiting time. Enter the mean waiting time as an exact decimal, then the median waiting time.`,
  answer: [mean, M],
  hints: ['For the mean, multiply each waiting time by its number of patients, add the products, and divide by the total number of patients.', 'For the median, think of the table as the full list of waits written in order, row after row. With an even number of patients the median is halfway between the two middle patients in that list.'],
  solution: `The number of patients is ${f.map(n).join(' + ')} = ${n(N)}. The row totals are ${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}, and they add up to ${n(T)}, so the mean is ${n(T)} ÷ ${n(N)} = ${n(mean)} minutes. With ${n(N)} patients the median is halfway between the ${ord(N / 2)} and ${ord(N / 2 + 1)} patients in order. Counting down the rows, the ${ord(N / 2)} patient waited ${n(lo)} minutes and the ${ord(N / 2 + 1)} waited ${n(hi)} minutes, so the median is (${n(lo)} + ${n(hi)}) ÷ 2 = ${n(M)} minutes.`,
  guidance: [
   { prompt: `How many patients does the table cover, and what do all their waits add up to${nc(T)}? Multiply each waiting time by its frequency and add the products.`, answer: [N, T], explanation: `${f.map(n).join(' + ')} = ${n(N)} patients. ${v.map((x, i) => `${n(x)} × ${n(f[i])} = ${n(rows[i])}`).join(', ')}; together ${rows.map(n).join(' + ')} = ${n(T)}.` },
   { prompt: `What is the mean wait, ${n(T)} divided by ${n(N)}?`, answer: [mean], explanation: `${n(T)} ÷ ${n(N)} = ${n(mean)} minutes.` },
   { prompt: `With ${n(N)} patients, the median is halfway between the ${ord(N / 2)} and ${ord(N / 2 + 1)} patients in order. Count down the rows: what did each of those two patients wait, and what is the median?`, answer: [lo, hi, M], explanation: `Adding the frequencies row by row, the ${ord(N / 2)} patient waited ${n(lo)} minutes and the ${ord(N / 2 + 1)} waited ${n(hi)} minutes. The median is (${n(lo)} + ${n(hi)}) ÷ 2 = ${n(M)} minutes.` }
  ] }; }
});

/* ---- q05 Percentiles and quartiles [2.3] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Ore truck turnaround',
 brief: 'The ore trucks queue at the weighbridge, and the dispatcher wants to know what counts as a quick and a slow turnaround.',
 labels: ['median', 'Q1', 'Q3'], tolerance: 0.01,
 gl: [['smallest (minutes)', 'largest (minutes)'], ['median'], ['Q1', 'Q3']]
}, {
 /* N = 9 to 13 distinct turnaround times from 10 to 70 minutes, in the order the trucks came back (shuffled, so the player sorts them first). Not the q05 canonical or worked example. */
 canonical: { x: [34, 18, 52, 27, 45, 23, 60, 38, 31, 49, 41] },
 draw: R => { let x; do { const N = R.int(9, 13), pool = []; while (pool.length < N) { const v = R.int(10, 70); if (!pool.includes(v)) pool.push(v); } x = shuffle(R, pool); }
  while (same(sorted(x), [12, 15, 17, 18, 21, 24, 26, 29, 33, 38]) || same(sorted(x), [3, 5, 6, 8, 9, 11, 12, 14, 15])); return { x }; },
 build: ({ x }) => { const N = x.length, s = sorted(x), Q = quart(s); return {
  prompt: `The dispatcher logged the turnaround time, in minutes, of ${n(N)} ore trucks at the weighbridge in the order the trucks came back: ${list(x)}. Find the quartiles by the median-of-halves method (with an odd count, the median goes in neither half). Enter the median, then the first quartile Q1, then the third quartile Q3.`,
  answer: [Q.m, Q.q1, Q.q3],
  hints: ['Put the times in order first. The median splits them into a lower half and an upper half; with an odd number of times the median itself is in neither half.', 'Q1 is the median of the lower half, and Q3 is the median of the upper half.'],
  solution: `In order the times are ${list(s)}. There are ${n(N)} times, so the median is ${medSay(s, 'time')}. ${N % 2 ? 'Leaving the median out, the' : 'The'} lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}.`,
  guidance: [
   { prompt: `Put the ${n(N)} times in order. What are the smallest and the largest?`, answer: [s[0], s[N - 1]], explanation: `In order: ${list(s)}. The smallest is ${n(s[0])} and the largest is ${n(s[N - 1])}.` },
   { prompt: `There are ${n(N)} times in order. What is the median?`, answer: [Q.m], explanation: `The median is ${medSay(s, 'time')}.` },
   { prompt: `The lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. What are their medians, Q1 and Q3?`, answer: [Q.q1, Q.q3], explanation: `Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Warning days at the recycling plant',
 brief: 'The recycling plant wants an alert on its unusually quiet and unusually heavy power days, and Mira needs to know how many days that would have flagged.',
 labels: ['Q1', 'Q3', 'low-use warnings', 'high-use warnings'], tolerance: 0.01,
 gl: [['median'], ['Q1', 'Q3'], ['days below Q1', 'days above Q3']]
}, {
 /* N = 8 to 12 sorted daily readings, 20 to about 90 kilowatt-hours, repeats allowed (so a reading can equal Q1 or Q3 and is then not counted: the prompt says strictly). Not the q05 canonical or worked example. */
 canonical: { x: [31, 34, 34, 38, 41, 43, 47, 47, 52, 60] },
 draw: R => { let x; do { const N = R.int(8, 12); x = [R.int(20, 50)]; while (x.length < N) x.push(x[x.length - 1] + R.int(0, 6)); } while (same(x, [12, 15, 17, 18, 21, 24, 26, 29, 33, 38]) || same(x, [3, 5, 6, 8, 9, 11, 12, 14, 15])); return { x }; },
 build: ({ x }) => { const N = x.length, Q = quart(x), low = x.filter(v => v < Q.q1).length, high = x.filter(v => v > Q.q3).length; return {
  prompt: `The recycling plant sorted its daily power use, in kilowatt-hours, on ${n(N)} days from smallest to largest: ${list(x)}. Mira will set a low-use warning for any day with use strictly below Q1 and a high-use warning for any day with use strictly above Q3, with the quartiles found by the median-of-halves method (with an odd count, the median goes in neither half). Enter Q1, then Q3, then the number of days that would have earned a low-use warning, then the number that would have earned a high-use warning.`,
  answer: [Q.q1, Q.q3, low, high],
  hints: ['Find the median, split the sorted list into a lower and an upper half (the median itself is in neither half when the count is odd), and take the median of each half for Q1 and Q3.', 'Then count the readings strictly below Q1 and the readings strictly above Q3. A reading equal to Q1 or to Q3 earns no warning.'],
  solution: `There are ${n(N)} readings, so the median is ${medSay(x, 'reading')}. ${N % 2 ? 'Leaving the median out, the' : 'The'} lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}. ${low} ${low === 1 ? 'day lies' : 'days lie'} strictly below Q1 = ${n(Q.q1)}, and ${high} ${high === 1 ? 'day lies' : 'days lie'} strictly above Q3 = ${n(Q.q3)}.`,
  guidance: [
   { prompt: `There are ${n(N)} readings. What is the median?`, answer: [Q.m], explanation: `The median is ${medSay(x, 'reading')}.` },
   { prompt: `The lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. What are their medians, Q1 and Q3?`, answer: [Q.q1, Q.q3], explanation: `Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}.` },
   { prompt: `How many readings are strictly below Q1 = ${n(Q.q1)}, and how many are strictly above Q3 = ${n(Q.q3)}?`, answer: [low, high], explanation: `Reading down the sorted list, ${low} ${low === 1 ? 'reading is' : 'readings are'} below ${n(Q.q1)} and ${high} ${high === 1 ? 'reading is' : 'readings are'} above ${n(Q.q3)}. A reading equal to a quartile is not counted.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q02', title: 'Pressure drop across the filters',
 brief: 'The dome air filters show a pressure drop every day, and the engineers want the quartiles and the mean to see how lopsided the readings are.',
 labels: ['Q1 (kPa)', 'Q3 (kPa)', 'mean (kPa)'], tolerance: 0.005,
 gl: [['median (kPa)'], ['Q1 (kPa)', 'Q3 (kPa)'], ['total (kPa)', 'mean (kPa)']]
}, {
 /* N = 13 to 16 sorted readings of 1.5 to about 9 kilopascals, kept as tenths in v (never a whole number of kPa). Repeats allowed. The mean is an exact decimal with at most 2 places.
    The halves have 6 to 8 readings, so Q1 and Q3 may be halfway between two readings and have 2 places. Not the q05 canonical or worked example. */
 canonical: { v: [22, 31, 34, 39, 43, 47, 51, 52, 58, 63, 67, 71, 74, 76] },
 draw: R => { let v; do { const N = R.int(13, 16); v = [R.int(15, 40)]; if (v[0] % 10 === 0) v[0]++; while (v.length < N) { let t = v[v.length - 1] + R.int(0, 9); if (t % 10 === 0) t++; v.push(t); } } while ((10 * sum(v)) % v.length !== 0); return { v }; },
 build: ({ v }) => { const x = v.map(t => t / 10), N = x.length, Q = quart(x), S = sum(v) / 10, mean = sum(v) / (10 * N); return {
  prompt: `The dome air filters lose pressure across them, and the Records Office noted the pressure drop, in kilopascals, on ${n(N)} days, sorted from smallest to largest: ${list(x)}. Find the quartiles by the median-of-halves method (with an odd count, the median goes in neither half). Enter the first quartile Q1, then the third quartile Q3, then the mean of all ${n(N)} readings as an exact decimal.`,
  answer: [Q.q1, Q.q3, mean],
  hints: ['Find the median, split the sorted list into a lower and an upper half (the median itself is in neither half when the count is odd), and take the median of each half. When a half has an even number of readings, its median is halfway between its two middle readings.', 'The mean is the total of all the readings divided by how many there are.'],
  solution: `There are ${n(N)} readings, so the median is ${medSay(x, 'reading')}. ${N % 2 ? 'Leaving the median out, the' : 'The'} lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}. The readings add up to ${n(S)}, so the mean is ${n(S)} ÷ ${n(N)} = ${n(mean)} kPa.`,
  guidance: [
   { prompt: `There are ${n(N)} readings. What is the median?`, answer: [Q.m], explanation: `The median is ${medSay(x, 'reading')}.` },
   { prompt: `The lower half is ${list(Q.lower)} and the upper half is ${list(Q.upper)}. What are their medians, Q1 and Q3?`, answer: [Q.q1, Q.q3], explanation: `Q1 = ${halfSay(Q.lower)}. Q3 = ${halfSay(Q.upper)}.` },
   { prompt: `Add all ${n(N)} readings and divide by ${n(N)}. What are the total and the mean?`, answer: [S, mean], explanation: `${x.map(n).join(' + ')} = ${n(S)}, and ${n(S)} ÷ ${n(N)} = ${n(mean)} kPa.` }
  ] }; }
});

})();
