/* Waves: sound and light practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p1.js. */
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
const TAU = 2 * Math.PI, g = 9.8;
/* Rounding to d places, and a rounded value as text with all its places and a typographic minus. */
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const fx = (x, d) => { const r = rd(x, d); return (Object.is(r, -0) ? 0 : r).toFixed(d).replace('-', '−'); };
const fp = (x, d) => rd(x, d) < 0 ? `(${fx(x, d)})` : fx(x, d);
const exactAt = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;
/* An answer rounded to d places that is clear of a rounding edge: the dropped part is at least 0.1 of a step from one half. */
const clear = (x, d) => { if (exactAt(x, d)) return true; const s = Math.abs(x) * Math.pow(10, d), fr = s - Math.floor(s); return Math.abs(fr - 0.5) >= 0.1; };
/* '=' when the rounded value is exact, '≈' when it is not. */
const eq = (x, d) => exactAt(x, d) ? '=' : '≈';
/* A 4-place intermediate as text without trailing zeros, with its sign: r4(5.00001) is '5'. ap4 gives '= 5' or '≈ 0.2475'. */
const r4 = x => n(rd(x, 4));
const ap4 = x => `${eq(x, 4)} ${r4(x)}`;
const tid = x => Math.round(x * 1e6) / 1e6;
const whole = x => Math.abs(x - Math.round(x)) < 1e-9;
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* '1 second', '2.5 seconds'. */
const secs = x => n(x) + (x === 1 ? ' second' : ' seconds');
const PERIODS = [0.2, 0.25, 0.4, 0.5, 0.8, 1.25, 2, 2.5, 4, 5];

/* ---- q01 Period and frequency of a repeating motion [V1 15.1] ---- */

/* q01b: the frequency is given, not counted. Answers: period 1/f (at most two decimals) and the whole number of vibrations f·t. */
const FREQS = [0.5, 1.25, 2, 2.5, 4, 5, 10, 20, 25, 50];
const okQ01b = ({ f, t }) => whole(f * t) && f * t < 1000;
mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The test shaker',
 brief: 'The Quake Station tests its instruments on a shaker plate, and the plate is set by its frequency, not by a count.',
 labels: ['period (s)', 'full vibrations'], tolerance: 0.001,
 gl: [['period (s)'], ['full vibrations']]
}, {
 canonical: { f: 4, t: 15 },
 draw: R => retry(() => ({ f: R.pick(FREQS), t: R.int(2, 30) }), okQ01b, { f: 4, t: 15 }),
 build: ({ f, t }) => { const T = tid(1 / f), N = tid(f * t); return {
  prompt: `Mira's test shaker at the Quake Station vibrates a plate at a steady ${n(f)} hertz. Enter the period of one full vibration in seconds. Then enter how many full vibrations the plate makes in ${n(t)} seconds.`,
  answer: [T, N],
  hints: ['The frequency counts the vibrations in each second and the period is the time for one, so each is the reciprocal of the other: T = 1/f.', 'Each second adds f full vibrations, so in a stretch of time the number of vibrations is the frequency times the time.'],
  solution: `The period is 1 divided by the frequency: T = 1 ÷ ${n(f)} = ${n(T)} s. In ${n(t)} s the number of full vibrations is f × t = ${n(f)} × ${n(t)} = ${n(N)}.`,
  guidance: [
   { prompt: `The plate makes ${n(f)} full vibrations every second. How long does one vibration take, in seconds?`, answer: [T], explanation: `T = 1 ÷ f = 1 ÷ ${n(f)} = ${n(T)} s.` },
   { prompt: `How many full vibrations does the plate make in ${n(t)} seconds?`, answer: [N], explanation: `Each second gives ${n(f)} vibrations, so ${n(t)} s give ${n(f)} × ${n(t)} = ${n(N)}.` }
  ] }; }
});

/* q01c: two arms, one timed by a count and one by its period; the frequencies and the difference in swings over a window. */
const okQ01c = ({ TA, TB, W }) => TA !== TB && whole(W / TA) && whole(W / TB);
mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Which arm swings more',
 brief: 'Two seismometer arms at the Quake Station are timed in different ways, and Mira wants to compare them over one recording window.',
 labels: ['frequency of arm A (Hz)', 'frequency of arm B (Hz)', 'extra swings'], tolerance: 0.005,
 gl: [['frequency of arm A (Hz)'], ['frequency of arm B (Hz)'], ['extra swings']]
}, {
 canonical: { N: 8, TA: 1.25, TB: 0.5, W: 5 },
 draw: R => retry(() => ({ N: R.int(4, 20), TA: R.pick(PERIODS), TB: R.pick(PERIODS), W: R.int(2, 40) }), okQ01c, { N: 8, TA: 1.25, TB: 0.5, W: 5 }),
 build: ({ N, TA, TB, W }) => { const tA = tid(N * TA), fA = tid(1 / TA), fB = tid(1 / TB), cA = tid(W / TA), cB = tid(W / TB), d = tid(Math.abs(cA - cB)), fast = cB > cA ? 'B' : 'A'; return {
  prompt: `Two seismometer arms swing at the Quake Station. Arm A makes ${n(N)} full swings in ${secs(tA)}. Arm B takes ${secs(TB)} for each full swing. Enter the frequency of arm A and then of arm B, both in hertz. Then enter how many more full swings the faster arm makes than the slower arm in a window of ${secs(W)}.`,
  answer: [fA, fB, d],
  hints: ['For arm A, the period is the time divided by the number of swings; arm B already has its period. Each frequency is 1 divided by the period.', 'In a window of time an arm makes (frequency × time) full swings. Work out the count for each arm and subtract the smaller from the larger.'],
  solution: `Arm A: T = ${n(tA)} ÷ ${n(N)} = ${n(TA)} s, so f = 1 ÷ ${n(TA)} = ${n(fA)} Hz. Arm B: f = 1 ÷ ${n(TB)} = ${n(fB)} Hz. In ${n(W)} s arm A makes ${n(fA)} × ${n(W)} = ${n(cA)} swings and arm B makes ${n(fB)} × ${n(W)} = ${n(cB)} swings. Arm ${fast} is the faster, and it makes ${n(Math.max(cA, cB))} − ${n(Math.min(cA, cB))} = ${n(d)} more swings.`,
  guidance: [
   { prompt: `Arm A makes ${n(N)} full swings in ${secs(tA)}. What is its frequency, in hertz?`, answer: [fA], explanation: `T = ${n(tA)} ÷ ${n(N)} = ${n(TA)} s, so f = 1 ÷ ${n(TA)} = ${n(fA)} Hz.` },
   { prompt: `Arm B takes ${secs(TB)} for one full swing. What is its frequency, in hertz?`, answer: [fB], explanation: `f = 1 ÷ T = 1 ÷ ${n(TB)} = ${n(fB)} Hz.` },
   { prompt: `Over ${secs(W)} each arm makes (frequency × time) swings. How many more swings does the faster arm make than the slower arm?`, answer: [d], explanation: `Arm A makes ${n(fA)} × ${n(W)} = ${n(cA)} and arm B makes ${n(fB)} × ${n(W)} = ${n(cB)}, so the faster arm makes ${n(d)} more.` }
  ] }; }
});

/* q01d: revolutions per minute and milliseconds. 60f = rpm with f a divisor-friendly number, so 1000/f is whole. */
const RPMS = [120, 240, 300, 480, 600, 1200, 1500, 2400, 3000];
mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The rotary drill',
 brief: 'The rotary drill at the Quake Station is rated in turns per minute, and the instruments that record it need hertz and milliseconds.',
 labels: ['frequency (Hz)', 'period (ms)', 'turns'], tolerance: 0.01,
 gl: [['frequency (Hz)'], ['period (ms)'], ['turns']]
}, {
 canonical: { rpm: 480, m: 3 },
 draw: R => ({ rpm: R.pick(RPMS), m: R.int(2, 9) }),
 build: ({ rpm, m }) => { const f = tid(rpm / 60), T = tid(1 / f), Tms = tid(1000 * T), turns = rpm * m; return {
  prompt: `A rotary drill at the Quake Station turns ${n(rpm)} times each minute, and each full turn counts as one cycle. Enter its frequency in hertz. Then enter its period in milliseconds (1 second is 1000 milliseconds). Then enter how many full turns it makes in ${n(m)} minutes (type it without commas).`,
  answer: [f, Tms, turns],
  hints: ['There are 60 seconds in a minute, so cycles per minute divided by 60 gives cycles per second, which is the frequency in hertz.', 'The period in seconds is 1 divided by the frequency. Multiply by 1000 to turn seconds into milliseconds.', 'The turns in a number of minutes are the turns each minute times the minutes.'],
  solution: `${n(rpm)} turns a minute is ${n(rpm)} ÷ 60 = ${n(f)} turns each second, so f = ${n(f)} Hz. The period is 1 ÷ ${n(f)} = ${n(T)} s, and ${n(T)} × 1000 = ${n(Tms)} ms. In ${n(m)} minutes the drill makes ${n(rpm)} × ${n(m)} = ${n(turns)} turns.`,
  guidance: [
   { prompt: `The drill turns ${n(rpm)} times in 60 seconds. How many turns is that each second, in hertz?`, answer: [f], explanation: `${n(rpm)} ÷ 60 = ${n(f)} Hz.` },
   { prompt: `What is the period 1 ÷ ${n(f)} in milliseconds (multiply seconds by 1000)?`, answer: [Tms], explanation: `1 ÷ ${n(f)} = ${n(T)} s, and ${n(T)} × 1000 = ${n(Tms)} ms.` },
   { prompt: `How many full turns does the drill make in ${n(m)} minutes?`, answer: [turns], explanation: `${n(rpm)} turns each minute × ${n(m)} minutes = ${n(turns)} turns.` }
  ] }; }
});

/* ---- q02 Mass on a spring: ω = √(k/m) and the period [V1 15.1] ---- */

/* q02b: the period is timed; ω = 2π/T and k = mω², both to 2 places and clear, k from the unrounded ω. */
const okQ02b = ({ m, T }) => { const w = TAU / T, k = m * w * w; return clear(w, 2) && clear(k, 2) && k < 1000; };
mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Weighing the spring',
 brief: 'A spring in the quake shed has lost its label, so Mira finds its stiffness from how fast a pod bobs on it.',
 labels: ['angular frequency ω (rad/s)', 'spring constant k (N/m)'], tolerance: 0.005,
 gl: [['angular frequency ω (rad/s)'], ['spring constant k (N/m)']]
}, {
 canonical: { m: 3, T: 1.5 },
 draw: R => retry(() => ({ m: R.int(2, 30) / 2, T: R.int(4, 30) / 10 }), okQ02b, { m: 3, T: 1.5 }),
 build: ({ m, T }) => { const w = TAU / T, k = m * w * w; return {
  prompt: `Mira hangs a ${n(m)} kg sensor pod on an unlabelled spring in the quake shed and times it: one full bob takes ${n(T)} s. Enter the angular frequency ω = 2π/T in radians per second. Then enter the spring constant k in N/m. Squaring ω = √(k/m) and multiplying by m gives k = mω²; use the unrounded ω for it. Give both answers to 2 decimal places.`,
  answer: [rd(w, 2), rd(k, 2)],
  hints: ['One full bob is 2π radians and takes the period, so ω is 2π divided by T.', 'Square both sides of ω = √(k/m) to get ω² = k/m, so k = mω². Keep every digit of ω on the calculator until the end.'],
  solution: `ω = 2π ÷ T = 2π ÷ ${n(T)} ${eq(w, 2)} ${fx(w, 2)} rad/s. Then k = mω² = ${n(m)} × (2π ÷ ${n(T)})² ${eq(k, 2)} ${fx(k, 2)} N/m.`,
  guidance: [
   { prompt: `What is ω = 2π/T for a period of ${n(T)} s, in radians per second to 2 decimal places?`, answer: [rd(w, 2)], explanation: `One cycle is 2π radians and takes ${n(T)} s, so ω = 2π ÷ ${n(T)} ${eq(w, 2)} ${fx(w, 2)} rad/s.` },
   { prompt: `What is k = mω² for m = ${n(m)} kg and the unrounded ω = 2π/${n(T)}, in N/m to 2 decimal places?`, answer: [rd(k, 2)], explanation: `ω² ${ap4(w * w)}, and ${n(m)} × ${r4(w * w)} ≈ ${fx(k, 2)} N/m.` }
  ] }; }
});

/* q02c: a camera is added to the pod. ω before and the period after, to 2 places and clear; the period difference
   agrees whether it is taken from rounded or unrounded periods. */
const okQ02c = ({ k, m1, dm }) => { const w1 = Math.sqrt(k / m1), T1 = TAU / w1, T2 = TAU * Math.sqrt((m1 + dm) / k);
 return clear(w1, 2) && clear(T2, 2) && clear(T2 - T1, 2) && tid(rd(T2, 2) - rd(T1, 2)) === rd(T2 - T1, 2); };
mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Adding the camera',
 brief: 'Mira bolts a camera onto a seismometer pod and needs to know how much slower the pod will bob.',
 labels: ['ω before (rad/s)', 'new period (s)', 'longer by (s)'], tolerance: 0.005,
 gl: [['ω before (rad/s)'], ['new period (s)'], ['longer by (s)']]
}, {
 canonical: { k: 100, m1: 2, dm: 2 },
 draw: R => retry(() => ({ k: 10 * R.int(5, 40), m1: R.int(2, 20) / 2, dm: R.int(1, 10) / 2 }), okQ02c, { k: 100, m1: 2, dm: 2 }),
 build: ({ k, m1, dm }) => { const M = tid(m1 + dm), w1 = Math.sqrt(k / m1), T1 = TAU / w1, w2 = Math.sqrt(k / M), T2 = TAU / w2, dT = T2 - T1; return {
  prompt: `A spring with spring constant k = ${n(k)} N/m carries a ${n(m1)} kg seismometer pod. Mira then bolts a ${n(dm)} kg camera onto the same pod, and the spring is not changed. Enter the angular frequency ω = √(k/m) of the pod before the camera is added, in radians per second, then its period after the camera is added, in seconds, then how many seconds longer that new period is than the old one. Give each answer to 2 decimal places and work from unrounded values.`,
  answer: [rd(w1, 2), rd(T2, 2), rd(dT, 2)],
  hints: ['ω = √(k/m), where m is the whole mass the spring carries at that moment. The camera adds to the pod mass.', 'The period is 2π divided by ω, found with the new total mass. The difference is the new period minus the old one.'],
  solution: `Before: ω = √(${n(k)} ÷ ${n(m1)}) ${eq(w1, 2)} ${fx(w1, 2)} rad/s, so the old period is 2π ÷ ω ≈ ${fx(T1, 2)} s. With the camera the mass is ${n(m1)} + ${n(dm)} = ${n(M)} kg, so ω = √(${n(k)} ÷ ${n(M)}) ${ap4(w2)} rad/s and the new period is 2π ÷ ω ≈ ${fx(T2, 2)} s. The new period is ${fx(T2, 2)} − ${fx(T1, 2)} = ${fx(dT, 2)} s longer.`,
  guidance: [
   { prompt: `What is ω = √(k/m) before the camera, with k = ${n(k)} N/m and m = ${n(m1)} kg, in radians per second to 2 decimal places?`, answer: [rd(w1, 2)], explanation: `${n(k)} ÷ ${n(m1)} = ${n(tid(k / m1))}, and its square root is ${eq(w1, 2)} ${fx(w1, 2)} rad/s.` },
   { prompt: `With the camera the pod has ${n(M)} kg. What is the new period 2π√(m/k), in seconds to 2 decimal places?`, answer: [rd(T2, 2)], explanation: `ω = √(${n(k)} ÷ ${n(M)}) ${ap4(w2)} rad/s, and 2π ÷ ω ≈ ${fx(T2, 2)} s.` },
   { prompt: `The old period was ${fx(T1, 2)} s and the new one is ${fx(T2, 2)} s, both to 2 decimal places. How many seconds longer is the new one?`, answer: [rd(dT, 2)], explanation: `${fx(T2, 2)} − ${fx(T1, 2)} = ${fx(dT, 2)} s.` }
  ] }; }
});

/* q02d (uses q01): a count and a time give f; ω = 2πf; the mass is k/ω². Periods from a list so f is short. */
const TIMED = [0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.25, 2];
const okQ02d = ({ T, k }) => { const w = TAU / T, m = k / (w * w); return clear(w, 2) && clear(m, 2) && m >= 0.05; };
mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'The worn label',
 brief: 'The mass label on a seismometer pod has worn away, but the spring is rated and the bobs can be counted.',
 labels: ['frequency (Hz)', 'angular frequency ω (rad/s)', 'mass (kg)'], tolerance: 0.005,
 gl: [['frequency (Hz)'], ['angular frequency ω (rad/s)'], ['mass (kg)']]
}, {
 canonical: { N: 15, T: 0.8, k: 200 },
 draw: R => retry(() => ({ N: R.int(5, 30), T: R.pick(TIMED), k: 10 * R.int(2, 40) }), okQ02d, { N: 15, T: 0.8, k: 200 }),
 build: ({ N, T, k }) => { const t = tid(N * T), f = tid(1 / T), w = TAU * f, m = k / (w * w); return {
  prompt: `A seismometer pod hangs on a spring of spring constant k = ${n(k)} N/m, and the label with its mass has worn away. Mira times it: ${n(N)} full bobs take ${n(t)} s. Enter the frequency in hertz. Then enter ω = 2πf in radians per second, and the mass in kg, both to 2 decimal places. Squaring ω = √(k/m) gives m = k ÷ ω²; use the unrounded ω for it.`,
  answer: [f, rd(w, 2), rd(m, 2)],
  hints: ['The period is the total time divided by the number of bobs, and the frequency is 1 divided by the period.', 'ω = 2πf. Square both sides of ω = √(k/m) to get ω² = k/m, then solve for the mass: m = k ÷ ω².'],
  solution: `Each bob takes ${n(t)} ÷ ${n(N)} = ${n(T)} s, so f = 1 ÷ ${n(T)} = ${n(f)} Hz. Then ω = 2πf = 2π × ${n(f)} ${eq(w, 2)} ${fx(w, 2)} rad/s, and m = k ÷ ω² = ${n(k)} ÷ ${r4(w * w)} ${eq(m, 2)} ${fx(m, 2)} kg.`,
  guidance: [
   { prompt: `${n(N)} full bobs take ${n(t)} seconds. What is the frequency, in hertz?`, answer: [f], explanation: `Each bob takes ${n(t)} ÷ ${n(N)} = ${n(T)} s, so f = 1 ÷ ${n(T)} = ${n(f)} Hz.` },
   { prompt: `What is ω = 2πf for f = ${n(f)} Hz, in radians per second to 2 decimal places?`, answer: [rd(w, 2)], explanation: `ω = 2π × ${n(f)} ${eq(w, 2)} ${fx(w, 2)} rad/s.` },
   { prompt: `What mass m = k ÷ ω² does that give, with k = ${n(k)} N/m and the unrounded ω, in kg to 2 decimal places?`, answer: [rd(m, 2)], explanation: `ω² ${ap4(w * w)}, and ${n(k)} ÷ ${r4(w * w)} ${eq(m, 2)} ${fx(m, 2)} kg.` }
  ] }; }
});

/* ---- q03 x(t) = A cos(ωt + φ): position, greatest speed and acceleration [V1 15.1, 15.3] ---- */

/* q03b: ω is hidden inside 2π × f. All three answers to 3 places, clear; x and the speed non-trivial. */
const okQ03b = ({ A, f, ph, t }) => { const w = TAU * f, x = A * Math.cos(w * t + ph);
 return clear(w, 3) && clear(x, 3) && clear(A * w, 3) && Math.abs(x) >= 0.005; };
mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'The borehole trace',
 brief: 'A borehole sensor at the Quake Station reports its shaking as a frequency, and Mira needs the same three numbers as before.',
 labels: ['angular frequency ω (rad/s)', 'position x (m)', 'greatest speed (m/s)'], tolerance: 0.0005,
 gl: [['angular frequency ω (rad/s)'], ['position x (m)'], ['greatest speed (m/s)']]
}, {
 canonical: { A: 0.12, f: 2.5, ph: 0.7, t: 0.6 },
 draw: R => retry(() => ({ A: R.int(5, 40) / 100, f: R.int(2, 16) / 2, ph: R.int(1, 15) / 10, t: R.int(1, 20) / 10 }), okQ03b, { A: 0.12, f: 2.5, ph: 0.7, t: 0.6 }),
 build: ({ A, f, ph, t }) => { const w = TAU * f, ang = w * t + ph, c = Math.cos(ang), x = A * c, vm = A * w; return {
  prompt: `A borehole sensor at the Quake Station shakes as x(t) = ${n(A)} cos(2π × ${n(f)} × t + ${n(ph)}) metres, with t in seconds and the angle in radians. In the form x(t) = A cos(ωt + φ) the number multiplying t is ω. Enter ω in radians per second, then the position x at t = ${n(t)} s in metres, then the greatest speed in m/s, all to 3 decimal places. Work from the unrounded ω.`,
  answer: [rd(w, 3), rd(x, 3), rd(vm, 3)],
  hints: ['Match the trace to A cos(ωt + φ): the number multiplying t is ω, here 2π times the frequency in hertz.', 'Put t into the whole angle ωt + φ, take its cosine with the calculator in radian mode and multiply by A. The greatest speed is Aω.'],
  solution: `ω = 2π × ${n(f)} ${eq(w, 3)} ${fx(w, 3)} rad/s. At t = ${n(t)} s the angle is ωt + φ ≈ ${r4(w)} × ${n(t)} + ${n(ph)} ≈ ${fx(ang, 4)} rad, and cos ${fx(ang, 4)} ≈ ${fx(c, 4)}, so x ≈ ${n(A)} × ${fp(c, 4)} ≈ ${fx(x, 3)} m. The greatest speed is Aω ≈ ${n(A)} × ${r4(w)} ≈ ${fx(vm, 3)} m/s.`,
  guidance: [
   { prompt: `What is ω = 2π × ${n(f)}, in radians per second to 3 decimal places?`, answer: [rd(w, 3)], explanation: `ω = 2π × ${n(f)} ${eq(w, 3)} ${fx(w, 3)} rad/s.` },
   { prompt: `What is x = ${n(A)} cos(ωt + ${n(ph)}) at t = ${n(t)} s, with the unrounded ω, in metres to 3 decimal places?`, answer: [rd(x, 3)], explanation: `The angle is about ${fx(ang, 4)} rad, its cosine is about ${fx(c, 4)}, and ${n(A)} × ${fp(c, 4)} ≈ ${fx(x, 3)} m.` },
   { prompt: 'The greatest speed is Aω. What is it, in m/s to 3 decimal places?', answer: [rd(vm, 3)], explanation: `Aω ≈ ${n(A)} × ${r4(w)} ≈ ${fx(vm, 3)} m/s.` }
  ] }; }
});

/* q03c: a bracket limit. ω from the period, the greatest acceleration Aω² (A in cm → m), and the largest amplitude for a limit. */
const TRACE_T = [0.5, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4];
const okQ03c = ({ T, A, al }) => { const w2 = (TAU / T) * (TAU / T), am = A / 100 * w2, Al = al / w2 * 100;
 return clear(TAU / T, 2) && clear(am, 2) && clear(Al, 2) && Al >= 0.05; };
mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The cracking bracket',
 brief: 'A bracket on the station wall shakes with each tremor, and Mira must know how big a tremor it can take.',
 labels: ['angular frequency ω (rad/s)', 'greatest acceleration (m/s²)', 'largest amplitude (cm)'], tolerance: 0.005,
 gl: [['angular frequency ω (rad/s)'], ['greatest acceleration (m/s²)'], ['largest amplitude (cm)']]
}, {
 canonical: { T: 1.5, A: 3, al: 3 },
 draw: R => retry(() => ({ T: R.pick(TRACE_T), A: R.int(1, 10), al: R.int(4, 40) / 2 }), okQ03c, { T: 1.5, A: 3, al: 3 }),
 build: ({ T, A, al }) => { const w = TAU / T, Am = tid(A / 100), am = Am * w * w, Al = al / (w * w) * 100; return {
  prompt: `A bracket on the Quake Station wall shakes in simple harmonic motion with period ${n(T)} s and amplitude ${n(A)} cm. It cracks if its greatest acceleration is more than ${n(al)} m/s². Enter ω = 2π/T in radians per second. Then enter the greatest acceleration Aω² of the shaking in m/s², with A in metres. Then enter the largest amplitude in centimetres that the bracket could take at the same period without the greatest acceleration passing the limit. Give each answer to 2 decimal places and work from unrounded values.`,
  answer: [rd(w, 2), rd(am, 2), rd(Al, 2)],
  hints: ['One cycle is 2π radians and takes the period, so ω is 2π divided by T. Change the amplitude from centimetres to metres before using it.', 'The greatest acceleration is Aω². For the largest amplitude, set Aω² equal to the limit and solve for A, then change metres back to centimetres.'],
  solution: `ω = 2π ÷ ${n(T)} ${eq(w, 2)} ${fx(w, 2)} rad/s. With A = ${n(A)} cm = ${n(Am)} m, the greatest acceleration is Aω² ≈ ${n(Am)} × ${r4(w * w)} ≈ ${fx(am, 2)} m/s². At the limit Aω² = ${n(al)}, so A = ${n(al)} ÷ ω² ≈ ${n(al)} ÷ ${r4(w * w)} ${ap4(Al / 100)} m, which is ${fx(Al, 2)} cm.`,
  guidance: [
   { prompt: `What is ω = 2π/T for T = ${n(T)} s, in radians per second to 2 decimal places?`, answer: [rd(w, 2)], explanation: `ω = 2π ÷ ${n(T)} ${eq(w, 2)} ${fx(w, 2)} rad/s.` },
   { prompt: `What is Aω² for A = ${n(Am)} m, in m/s² to 2 decimal places, using the unrounded ω?`, answer: [rd(am, 2)], explanation: `ω² ${ap4(w * w)}, and ${n(Am)} × ${r4(w * w)} ≈ ${fx(am, 2)} m/s².` },
   { prompt: `For Aω² to equal ${n(al)} m/s², what must the amplitude be, in centimetres to 2 decimal places?`, answer: [rd(Al, 2)], explanation: `A = ${n(al)} ÷ ω² ${ap4(Al / 100)} m, which is ${fx(Al, 2)} cm.` }
  ] }; }
});

/* q03d (uses q02): ω = √(k/m) is a whole number by building k = mω²; x and v at t, 3 places, clear and not near zero. */
const okQ03d = ({ m, w, A, ph, t }) => { const ang = w * t + ph, x = A * Math.cos(ang), v = -A * w * Math.sin(ang);
 return clear(x, 3) && clear(v, 3) && Math.abs(x) >= 0.005 && Math.abs(v) >= 0.005; };
mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'A spring, traced',
 brief: 'Mira knows the pod and its spring, and wants to read from them where the pod is and which way it is moving.',
 labels: ['angular frequency ω (rad/s)', 'position x (m)', 'velocity v (m/s)'], tolerance: 0.0005,
 gl: [['angular frequency ω (rad/s)'], ['position x (m)'], ['velocity v (m/s)']]
}, {
 canonical: { m: 1, w: 4, A: 0.1, ph: 0.8, t: 0.6 },
 draw: R => retry(() => ({ m: R.int(1, 8) / 2, w: R.int(2, 10), A: R.int(5, 40) / 100, ph: R.int(1, 15) / 10, t: R.int(1, 20) / 10 }), okQ03d, { m: 1, w: 4, A: 0.1, ph: 0.8, t: 0.6 }),
 build: ({ m, w, A, ph, t }) => { const k = tid(m * w * w), ang = tid(w * t + ph), c = Math.cos(ang), s = Math.sin(ang), x = A * c, v = -A * w * s; return {
  prompt: `A ${n(m)} kg pod hangs on a spring with k = ${n(k)} N/m at the Quake Station. It is set moving so that its height above equilibrium is x(t) = ${n(A)} cos(ωt + ${n(ph)}) metres, with t in seconds and the angle in radians. Enter ω = √(k/m) in radians per second. Then enter the position x at t = ${n(t)} s in metres, then the velocity v = −Aω sin(ωt + φ) at that time in m/s (positive means moving upwards), both to 3 decimal places.`,
  answer: [w, rd(x, 3), rd(v, 3)],
  hints: ['For a mass on a spring ω = √(k/m). Divide k by m, then take the square root.', 'Put t into the whole angle ωt + φ, in radians. The position is A times the cosine of the angle, and the velocity is −Aω times the sine of the same angle.'],
  solution: `ω = √(${n(k)} ÷ ${n(m)}) = √${n(tid(w * w))} = ${n(w)} rad/s. The angle at t = ${n(t)} s is ${n(w)} × ${n(t)} + ${n(ph)} = ${n(ang)} rad, where cos ≈ ${fx(c, 4)} and sin ≈ ${fx(s, 4)}. So x ≈ ${n(A)} × ${fp(c, 4)} ≈ ${fx(x, 3)} m and v ≈ −${n(A)} × ${n(w)} × ${fp(s, 4)} ≈ ${fx(v, 3)} m/s.`,
  guidance: [
   { prompt: `What is ω = √(k/m) for k = ${n(k)} N/m and m = ${n(m)} kg, in radians per second?`, answer: [w], explanation: `${n(k)} ÷ ${n(m)} = ${n(tid(w * w))}, and its square root is ${n(w)} rad/s.` },
   { prompt: `What is x = ${n(A)} cos(${n(ang)}) in metres to 3 decimal places, with the angle ωt + φ = ${n(ang)} rad at t = ${n(t)} s?`, answer: [rd(x, 3)], explanation: `In radian mode cos ${n(ang)} ≈ ${fx(c, 4)}, and ${n(A)} × ${fp(c, 4)} ≈ ${fx(x, 3)} m.` },
   { prompt: `What is v = −${n(A)} × ${n(w)} × sin(${n(ang)}) in m/s to 3 decimal places?`, answer: [rd(v, 3)], explanation: `In radian mode sin ${n(ang)} ≈ ${fx(s, 4)}, so v ≈ −${n(A)} × ${n(w)} × ${fp(s, 4)} ≈ ${fx(v, 3)} m/s.` }
  ] }; }
});

/* ---- q04 Energy in simple harmonic motion [V1 15.2] ---- */

/* q04b: k a multiple of 40 and A a multiple of 0.05 m, so E has at most two decimals and the amplitude is exact;
   the greatest speed √(2E/m) to 2 places, clear. */
const okQ04b = ({ k, A, m }) => clear(Math.sqrt(2 * (0.5 * k * A * A) / m), 2) && !(k === 120 && A === 0.25 && m === 1.5);
mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The sampler arm',
 brief: 'A spring-loaded sampler arm is rated by its energy, and Mira needs its reach and its top speed.',
 labels: ['amplitude (m)', 'greatest speed (m/s)'], tolerance: 0.005,
 gl: [['amplitude (m)'], ['greatest speed (m/s)']]
}, {
 canonical: { k: 160, A: 0.3, m: 2 },
 draw: R => retry(() => ({ k: 40 * R.int(1, 10), A: tid(0.05 * R.int(2, 10)), m: R.int(1, 8) / 2 }), okQ04b, { k: 160, A: 0.3, m: 2 }),
 build: ({ k, A, m }) => { const E = tid(0.5 * k * A * A), v = Math.sqrt(2 * E / m); return {
  prompt: `A spring-loaded sampler arm at the Quake Station has a ${n(m)} kg head on a spring with k = ${n(k)} N/m. With no friction the head swings back and forth with a total energy of ${n(E)} J. Enter the amplitude of the swing in metres. Then enter the greatest speed of the head in m/s to 2 decimal places.`,
  answer: [A, rd(v, 2)],
  hints: ['At the end of a swing the head stops for an instant, so all the energy is in the spring: E = ½kA². Solve that for A.', 'At equilibrium none of the energy is in the spring, so all of it is kinetic: E = ½mv². Solve that for v.'],
  solution: `At the end of a swing all the energy is in the spring: E = ½kA², so A = √(2E ÷ k) = √(2 × ${n(E)} ÷ ${n(k)}) = ${n(A)} m. At equilibrium all of it is kinetic: ½mv² = E, so v = √(2E ÷ m) = √(2 × ${n(E)} ÷ ${n(m)}) ${eq(v, 2)} ${fx(v, 2)} m/s.`,
  guidance: [
   { prompt: `At the end of a swing all ${n(E)} J is in the spring, ½kA². What is the amplitude A for k = ${n(k)} N/m, in metres?`, answer: [A], explanation: `A = √(2E ÷ k) = √(2 × ${n(E)} ÷ ${n(k)}) = ${n(A)} m.` },
   { prompt: `At equilibrium all ${n(E)} J is kinetic, ½mv². What is the speed v for m = ${n(m)} kg, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `v = √(2E ÷ m) = √(2 × ${n(E)} ÷ ${n(m)}) ${eq(v, 2)} ${fx(v, 2)} m/s.` }
  ] }; }
});

/* q04c: E, the greatest speed (2 places) and the distance where the speed is a given value (3 places), all clear. */
const okQ04c = ({ k, A, m, vt }) => { const E = 0.5 * k * A * A, vm = Math.sqrt(2 * E / m); if (vt >= 0.8 * vm) return false;
 const K = E - 0.5 * m * vt * vt, x = Math.sqrt(2 * K / k); return clear(vm, 2) && clear(x, 3) && x >= 0.01 && !(k === 120 && A === 0.25 && m === 1.5); };
mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Speed on the scale',
 brief: 'Mira has marked a scale along the sampler arm and wants to know where on it the head reaches a chosen speed.',
 labels: ['total energy (J)', 'greatest speed (m/s)', 'distance from equilibrium (m)'], tolerance: 0.0005,
 gl: [['total energy (J)'], ['greatest speed (m/s)'], ['distance from equilibrium (m)']]
}, {
 canonical: { k: 200, A: 0.2, m: 1.5, vt: 0.6 },
 draw: R => retry(() => ({ k: 40 * R.int(1, 10), A: tid(0.05 * R.int(2, 10)), m: R.int(1, 8) / 2, vt: R.int(1, 30) / 10 }), okQ04c, { k: 200, A: 0.2, m: 1.5, vt: 0.6 }),
 build: ({ k, A, m, vt }) => { const E = tid(0.5 * k * A * A), vm = Math.sqrt(2 * E / m), Kt = tid(0.5 * m * vt * vt), Us = tid(E - Kt), x = Math.sqrt(2 * Us / k); return {
  prompt: `The sampler arm's ${n(m)} kg head moves on a spring with k = ${n(k)} N/m, with amplitude ${n(A)} m and no friction. Enter the total energy in joules. Then enter the greatest speed of the head in m/s to 2 decimal places. Then enter how far from equilibrium the head is, in metres to 3 decimal places, at an instant when its speed is ${n(vt)} m/s.`,
  answer: [E, rd(vm, 2), rd(x, 3)],
  hints: ['The total energy is set by the amplitude: E = ½kA². At equilibrium all of it is kinetic energy, ½mv².', 'At a given speed the kinetic energy is ½mv². Take it away from the total to get the energy in the spring, then solve ½kx² = that energy for x.'],
  solution: `E = ½kA² = ½ × ${n(k)} × ${n(tid(A * A))} = ${n(E)} J. At equilibrium ½mv² = E, so v = √(2E ÷ m) = √(2 × ${n(E)} ÷ ${n(m)}) ${eq(vm, 2)} ${fx(vm, 2)} m/s. At ${n(vt)} m/s the kinetic energy is ½ × ${n(m)} × ${n(tid(vt * vt))} = ${n(Kt)} J, so the spring holds ${n(E)} − ${n(Kt)} = ${n(Us)} J. From ½kx² = ${n(Us)}: x = √(2 × ${n(Us)} ÷ ${n(k)}) ${eq(x, 3)} ${fx(x, 3)} m.`,
  guidance: [
   { prompt: 'What is the total energy ½kA², in joules?', answer: [E], explanation: `½ × ${n(k)} × ${n(tid(A * A))} = ${n(E)} J.` },
   { prompt: 'At equilibrium all that energy is kinetic, ½mv². What is the speed, in m/s to 2 decimal places?', answer: [rd(vm, 2)], explanation: `v = √(2 × ${n(E)} ÷ ${n(m)}) ${eq(vm, 2)} ${fx(vm, 2)} m/s.` },
   { prompt: `At ${n(vt)} m/s the kinetic energy is ${n(Kt)} J. How far from equilibrium is the head, in metres to 3 decimal places?`, answer: [rd(x, 3)], explanation: `The spring holds ${n(E)} − ${n(Kt)} = ${n(Us)} J, and ½kx² = ${n(Us)} gives x = √(2 × ${n(Us)} ÷ ${n(k)}) ${eq(x, 3)} ${fx(x, 3)} m.` }
  ] }; }
});

/* q04d (uses q03): the trace x(t) = A cos(ωt + φ) gives k = mω², E, and the kinetic energy at a time; 3 places, clear. */
const okQ04d = ({ m, w, A, ph, t }) => { const k = m * w * w, E = 0.5 * k * A * A, v = -A * w * Math.sin(w * t + ph), KE = 0.5 * m * v * v;
 return clear(E, 3) && clear(KE, 3) && KE >= 0.005 && E >= 0.01; };
mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'Energy from the trace',
 brief: 'All Mira has for one seismometer is the cosine trace of its pod, and she needs the spring and the energy behind it.',
 labels: ['spring constant k (N/m)', 'total energy (J)', 'kinetic energy (J)'], tolerance: 0.0005,
 gl: [['spring constant k (N/m)'], ['total energy (J)'], ['kinetic energy (J)']]
}, {
 canonical: { m: 1, w: 4, A: 0.2, ph: 0.5, t: 0.6 },
 draw: R => retry(() => ({ m: R.int(1, 8) / 2, w: R.int(2, 10), A: R.int(5, 40) / 100, ph: R.int(1, 15) / 10, t: R.int(1, 20) / 10 }), okQ04d, { m: 1, w: 4, A: 0.2, ph: 0.5, t: 0.6 }),
 build: ({ m, w, A, ph, t }) => { const k = tid(m * w * w), E = 0.5 * k * A * A, ang = tid(w * t + ph), s = Math.sin(ang), v = -A * w * s, KE = 0.5 * m * v * v; return {
  prompt: `A ${n(m)} kg pod on a spring at the Quake Station moves as x(t) = ${n(A)} cos(${n(w)}t + ${n(ph)}) metres, with t in seconds and the angle in radians, and there is no friction. Enter the spring constant k in N/m, using k = mω², where ω is the number multiplying t. Then enter the total energy ½kA² in joules, then the kinetic energy ½mv² at t = ${n(t)} s in joules, both to 3 decimal places. The velocity is v = −Aω sin(ωt + φ).`,
  answer: [k, rd(E, 3), rd(KE, 3)],
  hints: ['In x(t) = A cos(ωt + φ) the number multiplying t is ω. For a mass on a spring ω² = k/m, so k = mω².', 'The total energy is ½kA². For the kinetic energy put t into the angle, find the velocity from −Aω sin of the angle, and take ½mv²; squaring removes the sign of v.'],
  solution: `Here ω = ${n(w)} rad/s, so k = mω² = ${n(m)} × ${n(w * w)} = ${n(k)} N/m. The total energy is ½kA² = ½ × ${n(k)} × ${n(tid(A * A))} ${eq(E, 3)} ${fx(E, 3)} J. At t = ${n(t)} s the angle is ${n(w)} × ${n(t)} + ${n(ph)} = ${n(ang)} rad, where sin ≈ ${fx(s, 4)}, so v ≈ −${n(A)} × ${n(w)} × ${fp(s, 4)} ≈ ${fx(v, 4)} m/s and the kinetic energy is ½ × ${n(m)} × v² ≈ ${fx(KE, 3)} J.`,
  guidance: [
   { prompt: `What is k = mω² for m = ${n(m)} kg and ω = ${n(w)} rad/s, in N/m?`, answer: [k], explanation: `k = ${n(m)} × ${n(w)}² = ${n(m)} × ${n(w * w)} = ${n(k)} N/m.` },
   { prompt: `What is the total energy ½kA² for k = ${n(k)} N/m and A = ${n(A)} m, in joules to 3 decimal places?`, answer: [rd(E, 3)], explanation: `½ × ${n(k)} × ${n(tid(A * A))} ${eq(E, 3)} ${fx(E, 3)} J.` },
   { prompt: `At t = ${n(t)} s the angle is ${n(ang)} rad. What is the kinetic energy ½mv², with v = −Aω sin(${n(ang)}), in joules to 3 decimal places?`, answer: [rd(KE, 3)], explanation: `sin ${n(ang)} ≈ ${fx(s, 4)}, so v ≈ ${fx(v, 4)} m/s and ½ × ${n(m)} × v² ≈ ${fx(KE, 3)} J.` }
  ] }; }
});

/* ---- q05 The simple pendulum [V1 15.4] ---- */

/* q05b: g from a timed pendulum, and the period the same cord would have where g = 9.8; both to 2 places, clear. */
const okQ05b = ({ L, T }) => { const gl = 4 * Math.PI * Math.PI * L / (T * T), Te = TAU * Math.sqrt(L / g); return gl >= 3 && gl <= 20 && clear(gl, 2) && clear(Te, 2); };
mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Gravity at the new site',
 brief: 'Mira is checking the pull of gravity at a new site and has only a cord, a bob and a stopwatch.',
 labels: ['local g (m/s²)', 'period with g = 9.8 (s)'], tolerance: 0.005,
 gl: [['local g (m/s²)'], ['period with g = 9.8 (s)']]
}, {
 canonical: { L: 1.5, T: 2.4 },
 draw: R => retry(() => ({ L: R.int(5, 40) / 10, T: R.int(10, 40) / 10 }), okQ05b, { L: 1.5, T: 2.4 }),
 build: ({ L, T }) => { const gl = 4 * Math.PI * Math.PI * L / (T * T), Te = TAU * Math.sqrt(L / g); return {
  prompt: `Mira hangs a small heavy bob on a light cord ${n(L)} m long at a new site beside the Quake Station, lets it swing through a small angle and times it: one full swing takes ${n(T)} s. Squaring T = 2π√(L/g) and solving for g gives g = 4π²L ÷ T². Enter the local g in m/s², to 2 decimal places. Then enter the period in seconds, to 2 decimal places, that the same pendulum would have if g were 9.8 m/s².`,
  answer: [rd(gl, 2), rd(Te, 2)],
  hints: ['Square both sides of T = 2π√(L/g) to get T² = 4π²L ÷ g, then swap g and T² to solve for g.', 'The cord is the same, so only g changes: put g = 9.8 into T = 2π√(L/g).'],
  solution: `g = 4π²L ÷ T² = 4π² × ${n(L)} ÷ ${n(tid(T * T))} ${eq(gl, 2)} ${fx(gl, 2)} m/s². With g = 9.8 m/s² the same cord gives T = 2π√(${n(L)} ÷ 9.8) ${eq(Te, 2)} ${fx(Te, 2)} s.`,
  guidance: [
   { prompt: `What is g = 4π²L ÷ T² for L = ${n(L)} m and T = ${n(T)} s, in m/s² to 2 decimal places?`, answer: [rd(gl, 2)], explanation: `4π² ≈ ${fx(4 * Math.PI * Math.PI, 4)}, so g ≈ ${fx(4 * Math.PI * Math.PI, 4)} × ${n(L)} ÷ ${n(tid(T * T))} ≈ ${fx(gl, 2)} m/s².` },
   { prompt: `What is T = 2π√(L/g) for L = ${n(L)} m and g = 9.8 m/s², in seconds to 2 decimal places?`, answer: [rd(Te, 2)], explanation: `${n(L)} ÷ 9.8 ${ap4(L / g)}, its square root is about ${r4(Math.sqrt(L / g))}, and 2π times that is about ${fx(Te, 2)} s.` }
  ] }; }
});

/* q05c: the cord length of a clock. The present period, the length for a wanted period and the amount to cut (cm);
   the cut is the same whether taken from the rounded or the unrounded wanted length. */
const WANT = [1, 1.2, 1.5, 1.6, 1.8, 2];
const okQ05c = ({ L1, Tt }) => { const T1 = TAU * Math.sqrt(L1 / g), Lt = g * (Tt / TAU) * (Tt / TAU), cut = (L1 - Lt) * 100;
 return clear(T1, 2) && clear(Lt, 3) && clear(cut, 1) && cut >= 1 && tid((L1 - rd(Lt, 3)) * 100) !== undefined && rd((L1 - rd(Lt, 3)) * 100, 1) === rd(cut, 1) && Math.abs(T1 - Tt) > 0.05; };
mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Regulating the clock',
 brief: 'The station clock runs slow, and Mira will shorten its pendulum cord until one swing takes exactly the wanted time.',
 labels: ['present period (s)', 'wanted length (m)', 'cut off (cm)'], tolerance: 0.0005,
 gl: [['present period (s)'], ['wanted length (m)'], ['cut off (cm)']]
}, {
 canonical: { L1: 1.5, Tt: 2 },
 draw: R => retry(() => ({ L1: R.int(10, 40) / 10, Tt: R.pick(WANT) }), okQ05c, { L1: 1.5, Tt: 2 }),
 build: ({ L1, Tt }) => { const T1 = TAU * Math.sqrt(L1 / g), Lt = g * (Tt / TAU) * (Tt / TAU), cut = (L1 - Lt) * 100; return {
  prompt: `The Quake Station clock has a pendulum, a small heavy bob on a light cord ${n(L1)} m long, swinging through a small angle; take g = 9.8 m/s². The clock keeps time only if one full swing takes ${n(Tt)} s. Enter the present period in seconds to 2 decimal places. Then enter, in metres to 3 decimal places, the cord length that gives the wanted period. Then enter how many centimetres must be cut off the cord, to 1 decimal place, working from the unrounded wanted length.`,
  answer: [rd(T1, 2), rd(Lt, 3), rd(cut, 1)],
  hints: ['The present period is T = 2π√(L/g) with the present length.', 'Turn the rule round for the wanted length: L = g(T/2π)². The amount to cut off is the present length minus the wanted length, changed from metres to centimetres.'],
  solution: `T = 2π√(${n(L1)} ÷ 9.8) ≈ ${fx(T1, 2)} s. For a period of ${n(Tt)} s the length must be L = g(T/2π)² = 9.8 × (${n(Tt)} ÷ 2π)² ≈ ${fx(Lt, 3)} m. The cord is ${n(L1)} − ${r4(Lt)} ${ap4(cut / 100)} m too long, which is about ${fx(cut, 1)} cm to cut off.`,
  guidance: [
   { prompt: `What is the present period 2π√(L/g) for L = ${n(L1)} m, in seconds to 2 decimal places?`, answer: [rd(T1, 2)], explanation: `${n(L1)} ÷ 9.8 ${ap4(L1 / g)}, its square root is about ${r4(Math.sqrt(L1 / g))}, and 2π times that is about ${fx(T1, 2)} s.` },
   { prompt: `What length L = g(T/2π)² gives a period of ${n(Tt)} s, in metres to 3 decimal places?`, answer: [rd(Lt, 3)], explanation: `L = 9.8 × (${n(Tt)} ÷ 2π)² ≈ ${fx(Lt, 3)} m.` },
   { prompt: `The cord is ${n(L1)} m long and the wanted length is about ${fx(Lt, 3)} m. How many centimetres must be cut off, to 1 decimal place?`, answer: [rd(cut, 1)], explanation: `${n(L1)} − ${r4(Lt)} ${ap4(cut / 100)} m, which is about ${fx(cut, 1)} cm.` }
  ] }; }
});

/* q05d (uses q03): θ(t) = θ₀ cos(ωt) with ω = √(g/L); all three answers to 3 places, clear; θ not near zero. */
const okQ05d = ({ L, th0, t }) => { const w = Math.sqrt(g / L), th = th0 * Math.cos(w * t); return clear(w, 3) && clear(th, 3) && clear(th0 * w, 3) && Math.abs(th) >= 0.005; };
mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q03', title: 'The swinging angle',
 brief: 'Mira lets a pendulum go from rest and wants to know how its angle changes with time and how fast it turns at best.',
 labels: ['angular frequency ω (rad/s)', 'angle θ (rad)', 'greatest angular speed (rad/s)'], tolerance: 0.0005,
 gl: [['angular frequency ω (rad/s)'], ['angle θ (rad)'], ['greatest angular speed (rad/s)']]
}, {
 canonical: { L: 1.6, th0: 0.12, t: 0.9 },
 draw: R => retry(() => ({ L: R.int(3, 40) / 10, th0: R.int(5, 25) / 100, t: R.int(1, 40) / 10 }), okQ05d, { L: 1.6, th0: 0.12, t: 0.9 }),
 build: ({ L, th0, t }) => { const w = Math.sqrt(g / L), ang = w * t, c = Math.cos(ang), th = th0 * c, wm = th0 * w; return {
  prompt: `A pendulum at the Quake Station has a small heavy bob on a light cord ${n(L)} m long. Mira pulls it aside by ${n(th0)} radians and lets go from rest at t = 0. Take g = 9.8 m/s². For a small swing the angle from the vertical follows θ(t) = θ₀ cos(ωt), the same form as x(t) = A cos(ωt + φ) with φ = 0, where θ₀ is the starting angle and ω = √(g/L). Enter ω in radians per second. Then enter the angle θ at t = ${n(t)} s in radians. Then enter the greatest angular speed θ₀ω in radians per second, the angle's version of the greatest speed Aω. Give each answer to 3 decimal places and work from the unrounded ω.`,
  answer: [rd(w, 3), rd(th, 3), rd(wm, 3)],
  hints: ['For a small swing g/L takes the place of k/m in the spring rule, so ω = √(g/L).', 'Put t into ωt, with the calculator in radian mode, take its cosine and multiply by θ₀. The greatest angular speed is θ₀ times ω.'],
  solution: `ω = √(g/L) = √(9.8 ÷ ${n(L)}) ${eq(w, 3)} ${fx(w, 3)} rad/s. At t = ${n(t)} s the angle ωt ≈ ${fx(ang, 4)} rad, and cos ${fx(ang, 4)} ≈ ${fx(c, 4)}, so θ ≈ ${n(th0)} × ${fp(c, 4)} ≈ ${fx(th, 3)} rad. The greatest angular speed is θ₀ω ≈ ${n(th0)} × ${r4(w)} ≈ ${fx(wm, 3)} rad/s.`,
  guidance: [
   { prompt: `What is ω = √(g/L) for L = ${n(L)} m, in radians per second to 3 decimal places?`, answer: [rd(w, 3)], explanation: `9.8 ÷ ${n(L)} ${ap4(g / L)}, and its square root is ${eq(w, 3)} ${fx(w, 3)} rad/s.` },
   { prompt: `What is θ = ${n(th0)} cos(ωt) at t = ${n(t)} s, with the unrounded ω, in radians to 3 decimal places?`, answer: [rd(th, 3)], explanation: `ωt ≈ ${fx(ang, 4)} rad, its cosine is about ${fx(c, 4)}, and ${n(th0)} × ${fp(c, 4)} ≈ ${fx(th, 3)} rad.` },
   { prompt: `What is the greatest angular speed θ₀ω for θ₀ = ${n(th0)} rad, in rad/s to 3 decimal places?`, answer: [rd(wm, 3)], explanation: `θ₀ω ≈ ${n(th0)} × ${r4(w)} ≈ ${fx(wm, 3)} rad/s.` }
  ] }; }
});

})();
