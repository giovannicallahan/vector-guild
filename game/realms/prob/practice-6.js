/* Probability practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance, uses. Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p6.js. */
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

/* Rounding to a number of places; tieFree says the value is not within 2% of a unit of a rounding tie, so the
   rounded answer cannot depend on how it is worked out. */
const rd = (x, dp) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const r4 = x => rd(x, 4);
const tieFree = (x, dp) => { const f = Math.abs(x) * Math.pow(10, dp), fr = f - Math.floor(f); return Math.abs(fr - 0.5) > 0.02; };
const exact = (x, dp) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-6;
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const T = G.tidy;
/* e^(−v) to 4 places, and the way it is written. */
const ex4 = v => r4(Math.exp(-v));
const eTo = v => `e^(−${n(v)})`;
/* Empirical-rule pieces between whole numbers of standard deviations: piece[i + 3] runs from iσ to (i + 1)σ. */
const PIECE = [2.35, 13.5, 34, 34, 13.5, 2.35];
const mark = i => i === 0 ? 'μ' : `μ ${i < 0 ? '−' : '+'} ${Math.abs(i) === 1 ? '' : Math.abs(i)}σ`;
const pieces = (i, j) => PIECE.slice(i + 3, j + 3);
const addUp = parts => T(parts.reduce((t, x) => t + x, 0));
const sumText = parts => parts.length === 1 ? `that piece is ${n(parts[0])}%` : `the pieces are ${parts.map(x => n(x) + '%').join(' + ')} = ${n(addUp(parts))}%`;

/* Shared draws. A uniform range of width w from a, with a "left" range after the first mark d, and a strip start c. */
const drawUni = (R, aMax, widths, lefts) => { const w = R.pick(widths), a = R.int(2, aMax), b = a + w, left = R.pick(lefts.filter(x => x < w)), d = b - left;
 return { a, b, k: 5 * R.int(2, 18), c: R.int(d + 1, b - 2), d }; };
const WIDTHS = [4, 5, 8, 10, 16, 20, 25, 40];
const drawUniform = R => { let p; do { const w = R.pick(WIDTHS), a = R.int(0, 20), c = R.int(a, a + w - 2); p = { a, b: a + w, c, d: R.int(c + 2, a + w) }; } while (p.c === p.a && p.d === p.b); return p; };
const poissonOk = (lam, k) => { const lk = Math.pow(lam, k), e = ex4(lam), P = lk * Math.exp(-lam) / fact(k);
 return exact(lk, 4) && lk < 1000 && P >= 0.01 && tieFree(P, 4) && r4(lk * e / fact(k)) === r4(P); };
const drawPoisson = R => { let p; do { p = { lam: R.pick([0.5, 1.5, 2, 2.5, 3, 3.5, 4, 5]), k: R.int(2, 5) }; } while (!poissonOk(p.lam, p.k)); return p; };
const MS = [0.01, 0.02, 0.025, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5];
const expOk = (m, x) => { const v = r4(m * x), P = 1 - Math.exp(-v); return v >= 0.1 && v <= 3 && tieFree(P, 4) && r4(1 - ex4(v)) === r4(P); };
const drawExp = R => { let p; do { const m = R.pick(MS); p = { m, x: R.int(Math.max(2, Math.ceil(0.1 / m)), Math.floor(3 / m)) }; } while (!expOk(m_(p), p.x) || (p.m === 0.2 && p.x === 3) || (p.m === 0.5 && p.x === 2)); return p; };  // not the worked examples of q27 and q29
function m_(p) { return p.m; }
/* Memoryless draws: working from the printed powers of e rounds to the same answers as the exact values. */
const memOk = (m, a, b) => { const ma = r4(m * a), mab = r4(m * (a + b)), mb = r4(m * b);
 return tieFree(Math.exp(-mab), 4) && tieFree(Math.exp(-mb), 4) && tieFree(Math.exp(-ma), 4) && r4(ex4(mab) / ex4(ma)) === r4(Math.exp(-mb)); };
const drawMem = R => { let p; do { const m = R.pick([0.02, 0.05, 0.1, 0.2, 0.25]), lo = Math.max(2, Math.ceil(0.1 / m)), hi = Math.floor(1.5 / m); p = { m, a: R.int(lo, hi), b: R.int(lo, hi) }; }
 while (p.a === p.b || !memOk(p.m, p.a, p.b)); return p; };

/* ---- q26 Uniform mean, percentiles and conditional chances [IS 5.2] ---- */

/* b: percentile first, then the mean, then the conditional chance. Not the worked example (0 to 10). */
mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The probe’s dusk pass',
 brief: 'A survey probe flies over the mast once each dusk, and the radio watch wants to plan around when it passes.',
 labels: ['percentile (min)', 'mean (min)', 'probability'], tolerance: 0.00005,
 gl: [['range width (min)', 'percentile (min)'], ['mean (min)'], ['range left (min)', 'probability']]
}, {
 canonical: { a: 6, b: 26, k: 35, c: 22, d: 16 },
 draw: R => drawUni(R, 30, [10, 12, 16, 20, 24, 30, 40], [4, 5, 8, 10, 16, 20, 25]),
 build: ({ a, b, k, c, d }) => { const w = b - a, mean = T((a + b) / 2), share = T(k / 100), pct = T(a + share * w), left = b - d, above = b - c, cond = T(above / left); return {
  prompt: `The orbiting survey probe passes over the radio mast at a random time T between ${n(a)} and ${n(b)} minutes after dusk, and every moment in that range is equally likely. Enter the ${n(k)}th percentile of T, then the mean time of the pass, then the probability that the pass is later than ${n(c)} minutes after dusk, given that it has not happened by ${n(d)} minutes after dusk.`,
  answer: [pct, mean, cond],
  hints: ['The kth percentile has k% of the area to its left, so start at the first time and add k% of the width of the range. The mean is halfway along the range.', `Once the probe has not passed by ${n(d)}, T is spread evenly from ${n(d)} to ${n(b)}. Count how much of that shorter range lies after ${n(c)}.`],
  solution: `The range is ${n(b)} − ${n(a)} = ${n(w)} minutes wide, so the ${n(k)}th percentile is ${n(a)} + ${n(share)} × ${n(w)} = ${n(pct)} minutes. The mean is (${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes. Given T > ${n(d)}, T is uniform from ${n(d)} to ${n(b)}, a range ${n(left)} minutes wide, of which ${n(above)} minutes lie after ${n(c)}: P(T > ${n(c)} | T > ${n(d)}) = ${n(above)} ÷ ${n(left)} = ${n(cond)}.`,
  guidance: [
   { prompt: `How wide is the range from ${n(a)} to ${n(b)}, and what time has ${n(k)}% of the range to its left?`, answer: [w, pct], explanation: `${n(b)} − ${n(a)} = ${n(w)} minutes. ${n(k)}% is ${n(share)}, and ${n(share)} × ${n(w)} = ${n(T(share * w))}, so the percentile is ${n(a)} + ${n(T(share * w))} = ${n(pct)}.` },
   { prompt: `What is the mean, halfway between ${n(a)} and ${n(b)}?`, answer: [mean], explanation: `(${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes.` },
   { prompt: `Given T > ${n(d)}, how wide is the range that is left, and what is P(T > ${n(c)} | T > ${n(d)})?`, answer: [left, cond], explanation: `The range left runs from ${n(d)} to ${n(b)}, ${n(left)} minutes, and ${n(above)} of them are after ${n(c)}: ${n(above)} ÷ ${n(left)} = ${n(cond)}.` }
  ] }; }
});

/* c: the crew wait from the start of the window, so the expected wait is the mean arrival minus a, at r credits a minute. */
mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'The rover and the waiting crew',
 brief: 'A cargo rover is due at the unloading dock some time in a window, and the crew are paid for every minute they wait.',
 labels: ['mean arrival (min past six)', 'expected cost (credits)', 'probability'], tolerance: 0.00005,
 gl: [['mean arrival (min past six)'], ['mean wait (min)', 'expected cost (credits)'], ['range left (min)', 'probability']]
}, {
 canonical: { a: 15, b: 35, r: 4, c: 32, d: 30 },
 draw: R => { const u = drawUni(R, 15, [10, 12, 16, 20, 24, 30, 40], [4, 5, 8, 10, 16, 20, 25]); return { a: u.a, b: u.b, r: R.pick([2, 3, 4, 5, 6]), c: u.c, d: u.d }; },
 build: ({ a, b, r, c, d }) => { const mean = T((a + b) / 2), wait = T(mean - a), cost = T(wait * r), left = b - d, above = b - c, cond = T(above / left); return {
  prompt: `The cargo rover reaches the unloading dock at a random time X between ${n(a)} and ${n(b)} minutes past six, and every moment in that range is equally likely. The dock crew stand waiting from ${n(a)} minutes past six, and each minute of waiting costs ${n(r)} credits. Enter the mean arrival time (minutes past six), then the expected cost of the crew’s waiting in credits, then the probability that the rover arrives after ${n(c)} minutes past six, given that it has not arrived by ${n(d)} minutes past six.`,
  answer: [mean, cost, cond],
  hints: ['The mean of a uniform distribution is halfway along the range. The crew’s expected wait is the mean arrival time minus the time they start waiting.', `Once the rover has not arrived by ${n(d)}, X is spread evenly from ${n(d)} to ${n(b)}. The chance it is after ${n(c)} is the share of that shorter range lying after ${n(c)}.`],
  solution: `The mean arrival is (${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes past six. The crew wait from ${n(a)}, so the expected wait is ${n(mean)} − ${n(a)} = ${n(wait)} minutes, which costs ${n(wait)} × ${n(r)} = ${n(cost)} credits. Given X > ${n(d)}, X is uniform from ${n(d)} to ${n(b)}, a range ${n(left)} minutes wide, of which ${n(above)} minutes lie after ${n(c)}: P(X > ${n(c)} | X > ${n(d)}) = ${n(above)} ÷ ${n(left)} = ${n(cond)}.`,
  guidance: [
   { prompt: `What is the mean arrival time, halfway between ${n(a)} and ${n(b)}?`, answer: [mean], explanation: `(${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes past six.` },
   { prompt: `The crew start waiting at ${n(a)}. How many minutes do they wait on average, and what does that cost at ${n(r)} credits a minute?`, answer: [wait, cost], explanation: `${n(mean)} − ${n(a)} = ${n(wait)} minutes, and ${n(wait)} × ${n(r)} = ${n(cost)} credits.` },
   { prompt: `Given X > ${n(d)}, how wide is the range that is left, and what is P(X > ${n(c)} | X > ${n(d)})?`, answer: [left, cond], explanation: `The range left runs from ${n(d)} to ${n(b)}, ${n(left)} minutes, and ${n(above)} of them are after ${n(c)}: ${n(above)} ÷ ${n(left)} = ${n(cond)}.` }
  ] }; }
});

/* d: the end of the range is unknown and is found from a percentile. w is the width of the hidden range. */
mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', title: 'The range with no end date',
 brief: 'The log of a deep-space probe lost the end of its signal window, and Mira has to rebuild it from one percentile.',
 labels: ['end time (min after noon)', 'mean (min after noon)', 'probability'], tolerance: 0.00005,
 gl: [['distance from start (min)', 'share to the left'], ['range width (min)', 'end time (min after noon)'], ['mean (min after noon)', 'probability']]
}, {
 canonical: { a: 12, w: 40, k: 25, c: 46, d: 42 },
 draw: R => { const w = R.pick([20, 40, 60]), a = R.int(2, 20), b = a + w, left = R.pick([5, 8, 10, 16, 20, 25].filter(x => x < w)), d = b - left;
  return { a, w, k: R.pick([20, 25, 40, 60, 75, 80]), c: R.int(d + 1, b - 2), d }; },
 build: ({ a, w, k, c, d }) => { const b = a + w, share = T(k / 100), pct = T(a + share * w), dist = T(pct - a), mean = T((a + b) / 2), left = b - d, above = b - c, cond = T(above / left); return {
  prompt: `A deep-space probe’s signal arrives at a random time X, equally likely anywhere from ${n(a)} minutes after noon up to an end time that the log has lost. The ${n(k)}th percentile of X is ${n(pct)} minutes after noon. Enter the end time (minutes after noon), then the mean arrival time, then the probability that the signal arrives after ${n(c)} minutes after noon, given that it has not arrived by ${n(d)} minutes after noon.`,
  answer: [b, mean, cond],
  hints: [`The ${n(k)}th percentile is ${n(k)}% of the way along the range, so the distance from the start to it is ${n(k)}% of the whole width. Divide that distance by the share to find the width, then add the width to the start.`, `The mean is halfway between the start and the end time. Once the signal has not arrived by ${n(d)}, X is spread evenly from ${n(d)} to the end time.`],
  solution: `The percentile is ${n(pct)} − ${n(a)} = ${n(dist)} minutes from the start, and that is ${n(share)} of the range. So the range is ${n(dist)} ÷ ${n(share)} = ${n(w)} minutes wide and the end time is ${n(a)} + ${n(w)} = ${n(b)}. The mean is (${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes after noon. Given X > ${n(d)}, X is uniform from ${n(d)} to ${n(b)}, a range ${n(left)} minutes wide, of which ${n(above)} minutes lie after ${n(c)}: P(X > ${n(c)} | X > ${n(d)}) = ${n(above)} ÷ ${n(left)} = ${n(cond)}.`,
  guidance: [
   { prompt: `How far above the start of ${n(a)} is the percentile of ${n(pct)}, and what share of the range lies to its left, as a decimal?`, answer: [dist, share], explanation: `${n(pct)} − ${n(a)} = ${n(dist)} minutes, and the ${n(k)}th percentile has ${n(k)}% = ${n(share)} of the range to its left.` },
   { prompt: `${n(dist)} minutes is ${n(share)} of the range. How wide is the whole range, and what is the end time?`, answer: [w, b], explanation: `${n(dist)} ÷ ${n(share)} = ${n(w)} minutes, so the end time is ${n(a)} + ${n(w)} = ${n(b)}.` },
   { prompt: `What is the mean, halfway between ${n(a)} and ${n(b)}, and what is P(X > ${n(c)} | X > ${n(d)})?`, answer: [mean, cond], explanation: `The mean is (${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)}. Given X > ${n(d)} the range left is ${n(left)} minutes and ${n(above)} of them are after ${n(c)}: ${n(above)} ÷ ${n(left)} = ${n(cond)}.` }
  ] }; }
});

/* ---- q27 The exponential distribution [IS 5.3] ---- */

/* b: the average life is given, so the decay rate is its reciprocal. Not the worked example (m = 0.2, x = 3). */
mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'How long a dust filter lasts',
 brief: 'The aerial’s dust filters clog at random, and the radio room wants to know how soon a new one is likely to need changing.',
 labels: ['decay rate m (per day)', 'probability'], tolerance: 0.00005,
 gl: [['decay rate m (per day)'], ['mx'], ['probability']]
}, {
 canonical: { m: 0.025, x: 16 },
 draw: R => drawExp(R),
 build: ({ m, x }) => { const mean = T(1 / m), v = r4(m * x), e = ex4(v), P = r4(1 - Math.exp(-v)); return {
  prompt: `Dust filters on the radio mast clog at random. The time X in days until a new filter clogs follows an exponential distribution, and a new filter lasts ${n(mean)} days on average. For reference, ${eTo(v)} = ${n(e)} to 4 decimal places. Enter the decay rate m per day, then the probability that a new filter clogs within ${n(x)} days, to 4 decimal places.`,
  answer: [m, P],
  hints: ['The mean of an exponential distribution is 1 ÷ m, so the decay rate is 1 divided by the mean.', 'For an exponential distribution P(X < x) = 1 − e^(−mx).'],
  solution: `The mean is 1 ÷ m, so m = 1 ÷ ${n(mean)} = ${n(m)} per day. Then mx = ${n(m)} × ${n(x)} = ${n(v)}, so P(X < ${n(x)}) = 1 − ${eTo(v)} = 1 − ${n(e)} ≈ ${n(P)}.`,
  guidance: [
   { prompt: `The mean is 1 ÷ m. What is m, as 1 ÷ ${n(mean)}?`, answer: [m], explanation: `1 ÷ ${n(mean)} = ${n(m)} per day.` },
   { prompt: `What is mx = ${n(m)} × ${n(x)}?`, answer: [v], explanation: `${n(m)} × ${n(x)} = ${n(v)}.` },
   { prompt: `What is 1 − ${eTo(v)}, to 4 decimal places?`, answer: [P], explanation: `1 − ${n(e)} = ${n(P)}: the area under the density curve to the left of ${n(x)} days.` }
  ] }; }
});

/* c: N new tubes, each failing within x hours with probability P; the replacement cost uses the 4-place probability. */
mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The tube locker restock',
 brief: 'The mast’s transmitter tubes fail at random, and Mira must budget for the ones that will need replacing.',
 labels: ['probability', 'expected tubes that fail', 'replacement cost (credits)'], tolerance: 0.00005,
 gl: [['mx', 'probability'], ['expected tubes that fail'], ['replacement cost (credits)']]
}, {
 canonical: { m: 0.04, x: 30, N: 50, r: 6 },
 draw: R => { const e = drawExp(R); return { m: e.m, x: e.x, N: R.pick([50, 100, 200]), r: R.pick([3, 4, 5, 6, 8, 10]) }; },
 build: ({ m, x, N, r }) => { const v = r4(m * x), e = ex4(v), P = r4(1 - Math.exp(-v)), fails = T(N * P), cost = T(fails * r); return {
  prompt: `Mira fits ${n(N)} new transmitter tubes to the mast. A tube’s lifetime in hours is exponential with decay rate m = ${n(m)} per hour, and tubes fail independently; ${eTo(v)} = ${n(e)} to 4 decimal places. Enter the probability that a tube fails within ${n(x)} hours, to 4 decimal places, then the number of the ${n(N)} tubes you expect to fail within ${n(x)} hours, then the cost in credits of replacing them at ${n(r)} credits a tube (type numbers without commas). Use the 4-decimal probability.`,
  answer: [P, fails, cost],
  hints: ['For an exponential distribution P(X < x) = 1 − e^(−mx). The expected number of tubes that fail is the number of tubes times that probability.', 'Each failed tube costs the same to replace, so multiply the expected number of tubes that fail by the price of one tube.'],
  solution: `mx = ${n(m)} × ${n(x)} = ${n(v)}, so P(X < ${n(x)}) = 1 − ${eTo(v)} = 1 − ${n(e)} ≈ ${n(P)}. Out of ${n(N)} tubes you expect ${n(N)} × ${n(P)} = ${n(fails)} to fail. Replacing them at ${n(r)} credits each costs ${n(fails)} × ${n(r)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `What is mx = ${n(m)} × ${n(x)}, and what is 1 − ${eTo(v)}, the chance that a tube fails within ${n(x)} hours, to 4 decimal places?`, answer: [v, P], explanation: `${n(m)} × ${n(x)} = ${n(v)}, and 1 − ${n(e)} = ${n(P)}.` },
   { prompt: `How many of the ${n(N)} tubes do you expect to fail? Work out ${n(N)} × ${n(P)}.`, answer: [fails], explanation: `${n(N)} × ${n(P)} = ${n(fails)} tubes expected to fail.` },
   { prompt: `Each replacement costs ${n(r)} credits. What is the cost for ${n(fails)} tubes?`, answer: [cost], explanation: `${n(fails)} × ${n(r)} = ${n(cost)} credits.` }
  ] }; }
});

/* d: uses q25, the probability of a strip is its area. P(x1 < X < x2) = e^(−m x1) − e^(−m x2), both powers printed. */
const drawStrip = R => { let p; do { const m = R.pick([0.02, 0.025, 0.04, 0.05, 0.1, 0.2, 0.25]), lo = Math.max(2, Math.ceil(0.1 / m)), hi = Math.floor(3 / m), x1 = R.int(lo, hi - 2), x2 = R.int(x1 + 2, hi); p = { m, x1, x2 }; }
 while (!(() => { const v1 = r4(p.m * p.x1), v2 = r4(p.m * p.x2); return v2 - v1 >= 0.3 && tieFree(1 - Math.exp(-v1), 4) && tieFree(Math.exp(-v1) - Math.exp(-v2), 4)
  && r4(1 - ex4(v1)) === r4(1 - Math.exp(-v1)) && r4(ex4(v1) - ex4(v2)) === r4(Math.exp(-v1) - Math.exp(-v2)); })() || (p.m === 0.2 && p.x1 === 3)); return p; };
mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q25', title: 'Between two checkpoints',
 brief: 'The mast’s relay tubes get a check at two set times, and Mira wants the chance that one fails between the checks.',
 labels: ['P(fails before the first check)', 'P(fails between the checks)', 'mean lifetime (h)'], tolerance: 0.00005,
 gl: [['m × first check', 'm × second check'], ['probability'], ['probability', 'mean lifetime (h)']]
}, {
 canonical: { m: 0.1, x1: 4, x2: 12 },
 draw: drawStrip,
 build: ({ m, x1, x2 }) => { const v1 = r4(m * x1), v2 = r4(m * x2), e1 = ex4(v1), e2 = ex4(v2), P1 = r4(1 - Math.exp(-v1)), mid = r4(Math.exp(-v1) - Math.exp(-v2)), mean = T(1 / m); return {
  prompt: `A relay tube’s lifetime X in hours is exponential with decay rate m = ${n(m)} per hour. The tube is checked at ${n(x1)} hours and again at ${n(x2)} hours. For reference, ${eTo(v1)} = ${n(e1)} and ${eTo(v2)} = ${n(e2)}, each to 4 decimal places. Enter the probability that the tube fails before the first check, then the probability that it fails between the two checks, then the mean lifetime of a tube in hours. Give the probabilities to 4 decimal places.`,
  answer: [P1, mid, mean],
  hints: ['A probability is the area under the density curve, so the chance of failing between the checks is the area between the two times: the area to the left of the second check minus the area to the left of the first, or the same strip counted from the right.', 'P(X < x) = 1 − e^(−mx) and P(X > x) = e^(−mx). The mean lifetime is 1 ÷ m.'],
  solution: `m × ${n(x1)} = ${n(v1)} and m × ${n(x2)} = ${n(v2)}. Before the first check: P(X < ${n(x1)}) = 1 − ${eTo(v1)} = 1 − ${n(e1)} ≈ ${n(P1)}. Between the checks the tube survives past ${n(x1)} but not past ${n(x2)}: P(${n(x1)} < X < ${n(x2)}) = P(X > ${n(x1)}) − P(X > ${n(x2)}) = ${n(e1)} − ${n(e2)} ≈ ${n(mid)}. The mean lifetime is 1 ÷ ${n(m)} = ${n(mean)} hours.`,
  guidance: [
   { prompt: `What are m × ${n(x1)} and m × ${n(x2)}?`, answer: [v1, v2], explanation: `${n(m)} × ${n(x1)} = ${n(v1)} and ${n(m)} × ${n(x2)} = ${n(v2)}.` },
   { prompt: `What is P(X < ${n(x1)}) = 1 − ${eTo(v1)}, to 4 decimal places?`, answer: [P1], explanation: `1 − ${n(e1)} = ${n(P1)}.` },
   { prompt: `The tube survives past ${n(x1)} hours with chance ${eTo(v1)} and past ${n(x2)} hours with chance ${eTo(v2)}. What is the chance it fails between the checks, to 4 decimal places, and what is the mean lifetime 1 ÷ m?`, answer: [mid, mean], explanation: `${n(e1)} − ${n(e2)} = ${n(mid)}: it survived the first check but not the second. The mean lifetime is 1 ÷ ${n(m)} = ${n(mean)} hours.` }
  ] }; }
});

/* ---- q28 Memoryless waiting [IS 5.3] ---- */

/* b: the chance of lasting a + b and the conditional chance, in that order, with only the two powers needed printed. Not the worked example (m = 0.2, a = 3, b = 4). */
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The heater that forgets',
 brief: 'A heating element in the weather mast has been running for some hours, and the crew want to know if it is likely to see the night out.',
 labels: ['P(X > a + b | X > a)', 'P(X > a + b)'], tolerance: 0.00005,
 gl: [['P(X > a)', 'P(X > a + b)'], ['conditional probability']]
}, {
 canonical: { m: 0.1, a: 5, b: 3 },
 draw: drawMem,
 build: ({ m, a, b }) => { const ab = a + b, ma = r4(m * a), mab = r4(m * ab), mb = r4(m * b), eA = ex4(ma), eAB = ex4(mab), pAB = r4(Math.exp(-mab)), cond = r4(Math.exp(-mb)); return {
  prompt: `A heating element in the weather mast has a lifetime X in hours that is exponential with decay rate m = ${n(m)} per hour. This element has already run ${n(a)} hours without failing. For reference, ${eTo(ma)} = ${n(eA)} and ${eTo(mab)} = ${n(eAB)}, each to 4 decimal places. Enter the probability that this element lasts a further ${n(b)} hours, P(X > ${n(ab)} | X > ${n(a)}), then the probability that a new element lasts more than ${n(ab)} hours. Give both to 4 decimal places.`,
  answer: [cond, pAB],
  hints: [`P(X > x) = e^(−mx) for a new element. Use it for ${n(a)} hours and for ${n(ab)} hours.`, `P(X > ${n(ab)} | X > ${n(a)}) = P(X > ${n(ab)}) ÷ P(X > ${n(a)}), because lasting past ${n(ab)} hours already means lasting past ${n(a)}.`],
  solution: `P(X > ${n(ab)}) = ${eTo(mab)} ≈ ${n(pAB)} for a new element. For the element that has run ${n(a)} hours, P(X > ${n(ab)} | X > ${n(a)}) = ${eTo(mab)} ÷ ${eTo(ma)} = ${n(eAB)} ÷ ${n(eA)} ≈ ${n(cond)}. The ${n(a)} hours already run change nothing: this is the same as ${eTo(mb)}, the chance that a new element lasts ${n(b)} hours.`,
  guidance: [
   { prompt: `Which are the chances that a new element lasts more than ${n(a)} hours and more than ${n(ab)} hours?`, answer: [eA, pAB], explanation: `P(X > x) = e^(−mx), so P(X > ${n(a)}) = ${eTo(ma)} = ${n(eA)} and P(X > ${n(ab)}) = ${eTo(mab)} = ${n(pAB)}.` },
   { prompt: `Divide P(X > ${n(ab)}) by P(X > ${n(a)}). What is P(X > ${n(ab)} | X > ${n(a)}), to 4 decimal places?`, answer: [cond], explanation: `${n(eAB)} ÷ ${n(eA)} ≈ ${n(cond)}.` }
  ] }; }
});

/* c: a fleet that has all run a hours; the survivors and the rest. N × cond uses the 4-place conditional chance. */
mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Lamps on the landing field',
 brief: 'The landing-field lamps have all burned for some hours, and the radio room wants to know how many will light the next arrival.',
 labels: ['probability', 'expected to last', 'expected to fail'], tolerance: 0.00005,
 gl: [['probability'], ['expected to last'], ['expected to fail']]
}, {
 canonical: { m: 0.05, a: 4, b: 8, N: 200 },
 draw: R => { const p = drawMem(R); return { m: p.m, a: p.a, b: p.b, N: R.pick([100, 200, 500, 1000]) }; },
 build: ({ m, a, b, N }) => { const ab = a + b, ma = r4(m * a), mab = r4(m * ab), eA = ex4(ma), eAB = ex4(mab), cond = r4(Math.exp(-r4(m * b))), last = T(N * cond), fail = T(N - last); return {
  prompt: `The landing field has ${n(N)} identical lamps. A lamp’s life X in hours is exponential with decay rate m = ${n(m)} per hour, and the lamps fail independently. All ${n(N)} have burned ${n(a)} hours and none has failed. For reference, ${eTo(ma)} = ${n(eA)} and ${eTo(mab)} = ${n(eAB)}, each to 4 decimal places. Enter the probability that one of these lamps lasts a further ${n(b)} hours, to 4 decimal places, then the number of the ${n(N)} lamps you expect to last the further ${n(b)} hours, then the number you expect to fail in that time. Use the 4-decimal probability.`,
  answer: [cond, last, fail],
  hints: [`Use the rule for conditional probability: the chance of lasting past ${n(ab)} hours, given that the lamp lasted past ${n(a)}, is P(X > ${n(ab)}) ÷ P(X > ${n(a)}).`, 'The expected number that last is the number of lamps times that probability. Every lamp either lasts or fails, so the two numbers add up to all the lamps.'],
  solution: `P(X > ${n(ab)} | X > ${n(a)}) = ${eTo(mab)} ÷ ${eTo(ma)} = ${n(eAB)} ÷ ${n(eA)} ≈ ${n(cond)}. Of ${n(N)} lamps you expect ${n(N)} × ${n(cond)} = ${n(last)} to last the further ${n(b)} hours, so ${n(N)} − ${n(last)} = ${n(fail)} are expected to fail.`,
  guidance: [
   { prompt: `Divide ${n(eAB)} by ${n(eA)}. What is the chance that a lamp that has burned ${n(a)} hours lasts another ${n(b)}, to 4 decimal places?`, answer: [cond], explanation: `${n(eAB)} ÷ ${n(eA)} ≈ ${n(cond)}.` },
   { prompt: `How many of the ${n(N)} lamps do you expect to last? Work out ${n(N)} × ${n(cond)}.`, answer: [last], explanation: `${n(N)} × ${n(cond)} = ${n(last)} lamps expected to last.` },
   { prompt: `How many of the ${n(N)} lamps do you expect to fail?`, answer: [fail], explanation: `${n(N)} − ${n(last)} = ${n(fail)} lamps expected to fail.` }
  ] }; }
});

/* d: uses q27. The chance a new seal fails before a hours, the conditional chance of lasting b more, and of failing in those b hours. */
mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q27', title: 'The seal that has run a while',
 brief: 'A pump seal at the water plant has run for some hours, and Mira wants its chances on both sides of the next stretch.',
 labels: ['P(fails within a hours)', 'P(lasts a further b hours)', 'P(fails in the further b hours)'], tolerance: 0.00005,
 gl: [['P(X < a)'], ['P(X > a + b | X > a)'], ['P(fails in the further b hours)']]
}, {
 canonical: { m: 0.02, a: 20, b: 35 },
 draw: drawMem,
 build: ({ m, a, b }) => { const ab = a + b, ma = r4(m * a), mab = r4(m * ab), eA = ex4(ma), eAB = ex4(mab), before = r4(1 - Math.exp(-ma)), cond = r4(Math.exp(-r4(m * b))), failNext = T(1 - cond); return {
  prompt: `A pump seal at the water plant has a lifetime X in hours that is exponential with decay rate m = ${n(m)} per hour. This seal has already run ${n(a)} hours without failing. For reference, ${eTo(ma)} = ${n(eA)} and ${eTo(mab)} = ${n(eAB)}, each to 4 decimal places. Enter the probability that a new seal fails within ${n(a)} hours, then the probability that this seal lasts a further ${n(b)} hours, then the probability that it fails during those ${n(b)} hours. Give all three to 4 decimal places.`,
  answer: [before, cond, failNext],
  hints: [`For a new seal P(X < x) = 1 − e^(−mx), and P(X > x) = e^(−mx).`, `For the seal that has run ${n(a)} hours, divide P(X > ${n(ab)}) by P(X > ${n(a)}). A seal that does not last the further ${n(b)} hours fails during them, so the two chances add up to 1.`],
  solution: `A new seal fails within ${n(a)} hours with probability 1 − ${eTo(ma)} = 1 − ${n(eA)} = ${n(before)}. For the seal that has run ${n(a)} hours, P(X > ${n(ab)} | X > ${n(a)}) = ${n(eAB)} ÷ ${n(eA)} ≈ ${n(cond)}. It either lasts the further ${n(b)} hours or fails during them, so the chance that it fails is 1 − ${n(cond)} = ${n(failNext)}.`,
  guidance: [
   { prompt: `What is 1 − ${eTo(ma)}, the chance that a new seal fails within ${n(a)} hours, to 4 decimal places?`, answer: [before], explanation: `1 − ${n(eA)} = ${n(before)}.` },
   { prompt: `Divide ${n(eAB)} by ${n(eA)}. What is the chance that the seal lasts a further ${n(b)} hours, to 4 decimal places?`, answer: [cond], explanation: `${n(eAB)} ÷ ${n(eA)} ≈ ${n(cond)}.` },
   { prompt: `The seal either lasts the further ${n(b)} hours or fails during them. What is the chance that it fails during them?`, answer: [failNext], explanation: `1 − ${n(cond)} = ${n(failNext)}.` }
  ] }; }
});

/* ---- q29 Chapter review: the right model for a count or a wait [IS 4.6, 5.3] ---- */

const MODELS = 'Three models are on the radio desk’s wall chart: 1, Poisson (a count of rare events in a fixed time); 2, uniform (a time equally likely anywhere in a range); 3, exponential (a waiting time or lifetime with a decay rate).';
const modelName = ['', 'Poisson', 'uniform', 'exponential'];

/* b: three new stories. The exponential story gives the average wait, so m = 1 ÷ the mean. Not the parent's (model 3, m = 0.04, x = 20). */
mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Three clues on the wall chart',
 brief: 'Three different logs have landed on the radio desk at once, and each needs the right model before it can be answered.',
 labels: ['model', 'probability'], tolerance: 0.00005,
 gl: [['model'], ['probability']]
}, {
 canonical: { kind: 1, lam: 2.5, k: 3, a: 10, b: 30, c: 14, d: 22, m: 0.05, x: 12 },
 draw: R => ({ kind: R.pick([1, 2, 3]), ...drawPoisson(R), ...drawUniform(R), ...drawExp(R) }),
 build: ({ kind, lam, k, a, b, c, d, m, x }) => { const v = r4(m * x), kf = fact(k), lk = T(Math.pow(lam, k)), mean = T(1 / m);
  const P = kind === 1 ? r4(lk * Math.exp(-lam) / kf) : kind === 2 ? T((d - c) / (b - a)) : r4(1 - Math.exp(-v));
  const story = kind === 1 ? `Tiny meteorites pit the mast array at random, at an average of ${n(lam)} strikes an hour, each independent of the others. What is the probability of exactly ${n(k)} strikes in the next hour? (${eTo(lam)} = ${n(ex4(lam))} to 4 decimal places.)`
   : kind === 2 ? `A relief glider flies over the mast at a random second between ${n(a)} and ${n(b)} seconds after the hour, and every moment in that range is equally likely. What is the probability that it passes between ${n(c)} and ${n(d)} seconds after the hour?`
   : `The wait between two signal pings is random and averages ${n(mean)} minutes, with a decay rate m = 1 ÷ ${n(mean)} per minute. What is the probability that the next ping comes within ${n(x)} minutes? (${eTo(v)} = ${n(ex4(v))} to 4 decimal places.)`;
  const why = kind === 1 ? 'It counts rare events in a fixed hour' : kind === 2 ? 'The time is equally likely anywhere in a range' : 'It is a wait with a decay rate';
  const work = kind === 1 ? `${n(lam)}${sup(k)} × ${eTo(lam)} ÷ ${n(k)}! = ${n(lk)} × ${n(ex4(lam))} ÷ ${n(kf)} ≈ ${n(P)}`
   : kind === 2 ? `the strip is ${n(d)} − ${n(c)} = ${n(d - c)} seconds wide and the range is ${n(b)} − ${n(a)} = ${n(b - a)} seconds wide, so the probability is ${n(d - c)} ÷ ${n(b - a)} = ${n(P)}`
   : `m = 1 ÷ ${n(mean)} = ${n(m)}, mx = ${n(m)} × ${n(x)} = ${n(v)}, and 1 − ${eTo(v)} = 1 − ${n(ex4(v))} ≈ ${n(P)}`; return {
  prompt: `${MODELS} ${story} Enter the number of the model that fits, then the probability, to 4 decimal places.`,
  answer: [kind, P],
  hints: ['Ask what is being measured. A count of events in a fixed time is Poisson. A time equally likely anywhere in a range is uniform. A wait with a decay rate, or an average wait, is exponential.', 'Poisson: P(X = k) = λᵏ × e^(−λ) ÷ k!. Uniform: the width of the strip ÷ the width of the range. Exponential: P(X < x) = 1 − e^(−mx), where m is 1 divided by the mean.'],
  solution: `${why}, so it is model ${n(kind)}, ${modelName[kind]}. The probability is ${work}.`.replace('is the probability is', 'is'),
  guidance: [
   { prompt: 'Is this a count of rare events (1), a time equally likely anywhere in a range (2) or a wait with a decay rate (3)? Enter the model number.', answer: [kind], explanation: `${why}: model ${n(kind)}, ${modelName[kind]}.` },
   { prompt: `Use the ${modelName[kind]} formula. What is the probability, to 4 decimal places?`, answer: [P], explanation: kind === 2 ? `${work.charAt(0).toUpperCase()}${work.slice(1)}.` : `${work}.` }
  ] }; }
});

/* c: the same three models, each over N repeats, with the expected number of repeats. */
mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Windows, nights and fans',
 brief: 'The radio room keeps a long log of one kind of event, and Mira wants to know how often it should turn up.',
 labels: ['model', 'probability', 'expected count'], tolerance: 0.00005,
 gl: [['model'], ['probability'], ['expected count']]
}, {
 canonical: { kind: 2, lam: 2, k: 3, a: 10, b: 50, c: 18, d: 30, m: 0.05, x: 20, N: 200 },
 draw: R => ({ kind: R.pick([1, 2, 3]), ...drawPoisson(R), ...drawUniform(R), ...drawExp(R), N: R.pick([100, 200, 500, 1000]) }),
 build: ({ kind, lam, k, a, b, c, d, m, x, N }) => { const v = r4(m * x), kf = fact(k), lk = T(Math.pow(lam, k));
  const P = kind === 1 ? r4(lk * Math.exp(-lam) / kf) : kind === 2 ? T((d - c) / (b - a)) : r4(1 - Math.exp(-v)), E = T(N * P);
  const story = kind === 1 ? `Dust specks land on the mast camera at random, at an average of ${n(lam)} a minute, each independent of the others. The night log holds ${n(N)} separate one-minute windows. Take the probability of exactly ${n(k)} specks in one window (${eTo(lam)} = ${n(ex4(lam))} to 4 decimal places), and enter the number of the ${n(N)} windows you expect to show exactly ${n(k)} specks.`
   : kind === 2 ? `The supply drone calls the radio room at a random time between ${n(a)} and ${n(b)} minutes past ten each night, and every moment in that range is equally likely. Take the probability that a call comes between ${n(c)} and ${n(d)} minutes past ten, and enter the number of the next ${n(N)} nights you expect to have a call in that time.`
   : `A cooling fan on the transmitter fails at random, without warning, with decay rate m = ${n(m)} per hour. The stores hold ${n(N)} new fans. Take the probability that a fan fails within ${n(x)} hours (${eTo(v)} = ${n(ex4(v))} to 4 decimal places), and enter the number of the ${n(N)} fans you expect to fail within ${n(x)} hours.`;
  const why = kind === 1 ? 'It counts rare events in a fixed minute' : kind === 2 ? 'The time is equally likely anywhere in a range' : 'It is a lifetime with a decay rate';
  const work = kind === 1 ? `${n(lam)}${sup(k)} × ${eTo(lam)} ÷ ${n(kf)} = ${n(lk)} × ${n(ex4(lam))} ÷ ${n(kf)} ≈ ${n(P)}`
   : kind === 2 ? `(${n(d)} − ${n(c)}) ÷ (${n(b)} − ${n(a)}) = ${n(d - c)} ÷ ${n(b - a)} = ${n(P)}`
   : `1 − ${eTo(v)} = 1 − ${n(ex4(v))} ≈ ${n(P)}, with mx = ${n(m)} × ${n(x)} = ${n(v)}`; return {
  prompt: `${MODELS} ${story} Enter the number of the model that fits, then the probability to 4 decimal places, then that expected number. Use the 4-decimal probability.`,
  answer: [kind, P, E],
  hints: ['A count of events in a fixed time is Poisson. A time equally likely anywhere in a range is uniform. A waiting time or lifetime with a decay rate is exponential.', 'Poisson: λᵏ × e^(−λ) ÷ k!. Uniform: (d − c) ÷ (b − a). Exponential: P(X < x) = 1 − e^(−mx). The expected number is the number of repeats times the probability.'],
  solution: `${why}, so it is model ${n(kind)}, ${modelName[kind]}. The probability is ${work}. Out of ${n(N)} you expect ${n(N)} × ${n(P)} = ${n(E)}.`,
  guidance: [
   { prompt: 'Is this a count of rare events (1), a time equally likely anywhere in a range (2) or a lifetime with a decay rate (3)? Enter the model number.', answer: [kind], explanation: `${why}: model ${n(kind)}, ${modelName[kind]}.` },
   { prompt: `Use the ${modelName[kind]} formula. What is the probability, to 4 decimal places?`, answer: [P], explanation: `${work}.` },
   { prompt: `Multiply the probability by the number of repeats. What is ${n(N)} × ${n(P)}?`, answer: [E], explanation: `${n(N)} × ${n(P)} = ${n(E)}.` }
  ] }; }
});

/* d: uses q28. A wait that has already gone on: uniform (the range shrinks) or exponential (memoryless). */
mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q28', title: 'Has it happened yet?',
 brief: 'A signal that should have arrived has not, and Mira has to say how likely it is to come soon, which depends on what sort of wait it is.',
 labels: ['model', 'probability'], tolerance: 0.00005,
 gl: [['model'], ['probability']]
}, {
 canonical: { kind: 2, a: 8, b: 48, c: 40, d: 32, m: 0.05, x: 6, y: 10 },
 /* Model 2 uses a, b, c, d (d, the time already waited, leaves a range of 4 to 25 minutes). Model 3 uses m, x (already waited) and y (further). */
 draw: R => { const u = drawUni(R, 30, [10, 12, 16, 20, 24, 30, 40], [4, 5, 8, 10, 16, 20, 25]), e = drawMem(R); return { kind: R.pick([2, 3]), a: u.a, b: u.b, c: u.c, d: u.d, m: e.m, x: e.a, y: e.b }; },
 build: ({ kind, a, b, c, d, m, x, y }) => { const xy = x + y, mx = r4(m * x), mxy = r4(m * xy), my = r4(m * y), left = b - d, above = b - c;
  const P = kind === 2 ? T(above / left) : r4(Math.exp(-my));
  const story = kind === 2 ? `The night courier’s ferry docks at a random time between ${n(a)} and ${n(b)} minutes past nine, and every moment in that range is equally likely. It has not docked by ${n(d)} minutes past nine. What is the probability that it docks after ${n(c)} minutes past nine?`
   : `A signal beacon’s battery lasts a random time with decay rate m = ${n(m)} per hour. The battery has already run ${n(x)} hours without failing; ${eTo(mx)} = ${n(ex4(mx))} and ${eTo(mxy)} = ${n(ex4(mxy))}, each to 4 decimal places. What is the probability that it lasts a further ${n(y)} hours?`;
  const why = kind === 2 ? 'The time is equally likely anywhere in a range' : 'It is a lifetime with a decay rate';
  const work = kind === 2 ? `Given that the ferry has not docked by ${n(d)}, its time is uniform from ${n(d)} to ${n(b)}, ${n(left)} minutes wide, and ${n(above)} minutes of that lie after ${n(c)}: ${n(above)} ÷ ${n(left)} = ${n(P)}`
   : `P(X > ${n(xy)} | X > ${n(x)}) = ${eTo(mxy)} ÷ ${eTo(mx)} = ${n(ex4(mxy))} ÷ ${n(ex4(mx))} ≈ ${n(P)}, the same as ${eTo(my)}, since the ${n(x)} hours already run do not matter`; return {
  prompt: `${MODELS} ${story} Enter the number of the model that fits, then the probability, to 4 decimal places.`,
  answer: [kind, P],
  hints: ['A count of events in a fixed time is Poisson. A time equally likely anywhere in a range is uniform. A waiting time or lifetime with a decay rate is exponential.', 'A uniform wait that has already gone on is still uniform, but over the shorter range that is left. An exponential wait is memoryless: the chance of lasting a further time does not depend on the time already run.'],
  solution: `${why}, so it is model ${n(kind)}, ${modelName[kind]}. ${work}.`,
  guidance: [
   { prompt: 'Is this a count of rare events (1), a time equally likely anywhere in a range (2) or a lifetime with a decay rate (3)? Enter the model number.', answer: [kind], explanation: `${why}: model ${n(kind)}, ${modelName[kind]}.` },
   { prompt: kind === 2 ? `Given that the ferry has not docked by ${n(d)}, what share of the range left, from ${n(d)} to ${n(b)}, lies after ${n(c)}? Give the probability to 4 decimal places.` : `Divide ${n(ex4(mxy))} by ${n(ex4(mx))}. What is the chance that the battery lasts a further ${n(y)} hours, to 4 decimal places?`, answer: [P], explanation: `${work}.` }
  ] }; }
});

/* ---- q30 The normal curve and the empirical rule [IS 6.1] ---- */

const drawMarks = R => { const i = R.int(-3, 2); return { i, j: R.int(i + 1, 3) }; };

/* b: cables with a band; the percentage outside the band is 100 minus the percentage inside. Not the worked example (μ = 120, σ = 5). */
mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The cable rejection bin',
 brief: 'The lab rejects any copper cable that is too thin or too thick for the mast clamps, and the bin has to be sized for the rejects.',
 labels: ['lower limit (σ from mean)', 'upper limit (σ from mean)', 'percentage rejected'], tolerance: 0.005,
 gl: [['lower limit (σ from mean)'], ['upper limit (σ from mean)'], ['percentage accepted', 'percentage rejected']]
}, {
 canonical: { mu: 24, s: 0.2, i: -2, j: 1 },
 draw: R => { const mk2 = drawMarks(R); return { mu: R.int(8, 60), s: R.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.5, 0.8, 1, 1.2, 1.5, 2]), ...mk2 }; },
 build: ({ mu, s, i, j }) => { const lo = r4(mu + i * s), hi = r4(mu + j * s), parts = pieces(i, j), inside = addUp(parts), out = T(100 - inside); return {
  prompt: `The quality lab draws copper cable whose diameters follow a normal distribution with mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm. A cable fits the mast clamps only if its diameter is between ${n(lo)} mm and ${n(hi)} mm; every other cable is rejected. Using the empirical rule, enter how many standard deviations the lower limit is from the mean (negative if it is below the mean), then the same for the upper limit, then the percentage of cables rejected.`,
  answer: [i, j, out],
  hints: ['Subtract the mean from each limit and divide by σ: that says how many standard deviations from the mean it is.', 'Add the empirical-rule pieces (34%, 13.5%, 2.35% on each side of the mean) between the two limits to get the cables that fit. Every cable either fits or is rejected, so the two percentages make 100%.'],
  solution: `(${n(lo)} − ${n(mu)}) ÷ ${n(s)} = ${n(i)} and (${n(hi)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so the limits are at ${mark(i)} and ${mark(j)}. Between them ${sumText(parts)}. The rest are rejected: 100% − ${n(inside)}% = ${n(out)}%.`,
  guidance: [
   { prompt: `How many standard deviations from the mean is ${n(lo)} mm? Enter a negative number if it is below the mean.`, answer: [i], explanation: `(${n(lo)} − ${n(mu)}) ÷ ${n(s)} = ${n(i)}, so ${n(lo)} mm is at ${mark(i)}.` },
   { prompt: `How many standard deviations from the mean is ${n(hi)} mm?`, answer: [j], explanation: `(${n(hi)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so ${n(hi)} mm is at ${mark(j)}.` },
   { prompt: `Add the empirical-rule pieces from ${mark(i)} to ${mark(j)} to get the percentage that fit, then subtract it from 100 to get the percentage rejected.`, answer: [inside, out], explanation: `Between the limits ${sumText(parts)}. Then 100 − ${n(inside)} = ${n(out)}.` }
  ] }; }
});

/* c: a box of N washers, the rejects and their recycling cost. */
mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'The washer batch',
 brief: 'A box of washers has come off the press, and Mira wants to know how many will fail the thickness gauge and what that costs.',
 labels: ['percentage accepted', 'washers rejected', 'recycling cost (credits)'], tolerance: 0.005,
 gl: [['lower limit (σ from mean)', 'upper limit (σ from mean)'], ['percentage accepted'], ['washers rejected', 'recycling cost (credits)']]
}, {
 canonical: { mu: 6, s: 0.05, i: -2, j: 3, N: 2000, r: 3 },
 draw: R => { const mk2 = drawMarks(R); return { mu: R.int(2, 12), s: R.pick([0.02, 0.05, 0.1, 0.2, 0.25, 0.5]), ...mk2, N: R.pick([200, 500, 1000, 2000]), r: R.pick([2, 3, 4, 5]) }; },
 build: ({ mu, s, i, j, N, r }) => { const lo = r4(mu + i * s), hi = r4(mu + j * s), parts = pieces(i, j), inside = addUp(parts), rejPct = T(100 - inside), rej = T(N * rejPct / 100), cost = T(rej * r); return {
  prompt: `A press makes washers whose thickness follows a normal distribution with mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm. The gauge accepts a washer only if its thickness is between ${n(lo)} mm and ${n(hi)} mm. A box holds ${n(N)} washers, and recycling each rejected washer costs ${n(r)} credits. Using the empirical rule, enter the percentage of washers accepted, then the number of the ${n(N)} washers you expect to be rejected, then the recycling cost in credits (type numbers without commas).`,
  answer: [inside, rej, cost],
  hints: ['Find how many standard deviations each limit is from the mean, then add the empirical-rule pieces between them to get the washers that pass.', 'The rejected washers are the share that does not pass, taken of the whole box. Each costs the same to recycle, so multiply the number rejected by the price of one.'],
  solution: `(${n(lo)} − ${n(mu)}) ÷ ${n(s)} = ${n(i)} and (${n(hi)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so the limits are at ${mark(i)} and ${mark(j)}. Between them ${sumText(parts)} accepted. So ${n(rejPct)}% are rejected: ${n(N)} × ${n(rejPct)} ÷ 100 = ${n(rej)} washers. Recycling them costs ${n(rej)} × ${n(r)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `How many standard deviations from the mean are ${n(lo)} mm and ${n(hi)} mm? Enter the lower limit first, negative if it is below the mean.`, answer: [i, j], explanation: `(${n(lo)} − ${n(mu)}) ÷ ${n(s)} = ${n(i)} and (${n(hi)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so the limits are at ${mark(i)} and ${mark(j)}.` },
   { prompt: `Add the empirical-rule pieces from ${mark(i)} to ${mark(j)}. What percentage of washers is accepted?`, answer: [inside], explanation: `Between the limits ${sumText(parts)}.` },
   { prompt: `The rest, ${n(rejPct)}%, are rejected. How many of the ${n(N)} washers is that, and what does recycling them cost at ${n(r)} credits each?`, answer: [rej, cost], explanation: `${n(N)} × ${n(rejPct)} ÷ 100 = ${n(rej)} washers, and ${n(rej)} × ${n(r)} = ${n(cost)} credits.` }
  ] }; }
});

/* d: the empirical rule read backwards. The middle 68%, 95% or 99.7% spans μ ± 1σ, 2σ or 3σ; the tail beyond μ + jσ is (100 − middle) ÷ 2. */
const MIDDLE = [0, 68, 95, 99.7], TAIL = [0, 16, 2.5, 0.15];
mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', title: 'Reading σ off the report',
 brief: 'The coating report gives only the band that holds most of the film, and Mira has to work back to the spread from it.',
 labels: ['mean (mm)', 'standard deviation (mm)', 'percentage thicker'], tolerance: 0.005,
 gl: [['mean (mm)'], ['band width (mm)', 'standard deviation (mm)'], ['standard deviations above the mean', 'percentage thicker']]
}, {
 canonical: { mu: 40, s: 1.5, q: 2, j: 3 },
 draw: R => ({ mu: R.int(10, 60), s: R.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2, 2.5]), q: R.int(1, 3), j: R.int(1, 3) }),
 build: ({ mu, s, q, j }) => { const lo = r4(mu - q * s), hi = r4(mu + q * s), t = r4(mu + j * s), band = r4(hi - lo), mid = MIDDLE[q], tail = TAIL[j]; return {
  prompt: `A coating machine lays film whose thickness follows a normal distribution. The lab report says that the middle ${n(mid)}% of films are between ${n(lo)} mm and ${n(hi)} mm thick, and gives no mean or standard deviation. Using the empirical rule, enter the mean thickness, then the standard deviation, then the percentage of films thicker than ${n(t)} mm.`,
  answer: [mu, s, tail],
  hints: ['A normal distribution is symmetric, so its mean is halfway between the two ends of a band centred on it. The middle 68% reaches 1σ each side of the mean, the middle 95% reaches 2σ and the middle 99.7% reaches 3σ.', `Find how many σ above the mean ${n(t)} mm lies. The films beyond a mark above the mean are half of those outside the matching middle band, because the other half lie below the mean.`],
  solution: `The mean is halfway between ${n(lo)} and ${n(hi)}: (${n(lo)} + ${n(hi)}) ÷ 2 = ${n(mu)} mm. The middle ${n(mid)}% reaches ${n(q)}σ each side of the mean, so the band is ${n(2 * q)}σ wide: ${n(hi)} − ${n(lo)} = ${n(band)} mm, and σ = ${n(band)} ÷ ${n(2 * q)} = ${n(s)} mm. Then (${n(t)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so ${n(t)} mm is at μ + ${j === 1 ? '' : n(j)}σ. The middle ${n(MIDDLE[j])}% lies within ${n(j)}σ, so ${n(T(100 - MIDDLE[j]))}% lies outside, half of it above: ${n(tail)}%.`,
  guidance: [
   { prompt: `The band from ${n(lo)} mm to ${n(hi)} mm is centred on the mean. What is the mean?`, answer: [mu], explanation: `(${n(lo)} + ${n(hi)}) ÷ 2 = ${n(mu)} mm.` },
   { prompt: `The middle ${n(mid)}% reaches ${n(q)}σ each side of the mean, so the band is ${n(2 * q)}σ wide. How wide is the band in mm, and what is σ?`, answer: [band, s], explanation: `${n(hi)} − ${n(lo)} = ${n(band)} mm, and ${n(band)} ÷ ${n(2 * q)} = ${n(s)} mm.` },
   { prompt: `How many standard deviations above the mean is ${n(t)} mm, and what percentage of films are thicker than that? (The middle ${n(MIDDLE[j])}% lies within that many σ of the mean.)`, answer: [j, tail], explanation: `(${n(t)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}. ${n(T(100 - MIDDLE[j]))}% lies outside ±${n(j)}σ, and half of that, ${n(tail)}%, is above the mean.` }
  ] }; }
});

})();
