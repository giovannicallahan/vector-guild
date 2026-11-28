/* Probability mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Rounding to a number of places; tieFree says the value is not within 2% of a unit of a rounding tie, so the
   rounded answer cannot depend on how it is worked out. */
const rd = (x, dp) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const r2 = x => rd(x, 2), r4 = x => rd(x, 4), r6 = x => rd(x, 6);
const tieFree = (x, dp) => { const f = Math.abs(x) * Math.pow(10, dp), fr = f - Math.floor(f); return Math.abs(fr - 0.5) > 0.02; };
/* At most `dp` decimal places, exactly. */
const exact = (x, dp) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-6;
/* Superscript digits for a numeric power: sup(12) is '¹²'. */
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const choose = (N, k) => fact(N) / (fact(k) * fact(N - k));
const many = (c, one, more) => `${n(c)} ${c === 1 ? one : more}`;
const ex6 = v => r4(Math.exp(-v));
/* The printed powers of e have 4 decimal places (the checks allow no more); every draw is checked so that working
   from the printed value rounds to the same answer as the exact value. */
const f6 = x => n(x);
/* e^(−v) with v printed by n(). */
const eTo = v => `e^(−${n(v)})`;
/* Empirical-rule pieces between whole numbers of standard deviations: piece[i + 3] runs from iσ to (i + 1)σ. */
const PIECE = [2.35, 13.5, 34, 34, 13.5, 2.35];
const mark = i => i === 0 ? 'μ' : `μ ${i < 0 ? '−' : '+'} ${Math.abs(i) === 1 ? '' : Math.abs(i)}σ`;
/* Shared draws for the Poisson, uniform and exponential stories (q24, q25, q27 and the review q29). */
const poissonOk = (lam, k) => { const lk = Math.pow(lam, k), e = ex6(lam), P = lk * Math.exp(-lam) / fact(k);
 return exact(lk, 4) && lk < 1000 && P >= 0.01 && tieFree(P, 4) && r4(lk * e / fact(k)) === r4(P); };
/* λ in tenths from 0.5 to 5.6 (not 1, which would read "an average of 1 pings"); poissonOk keeps the pairs that work. */
const LAMS = Array.from({ length: 52 }, (_, i) => (i + 5) / 10).filter(l => l !== 1);
const drawPoisson = R => { let p; do { p = { lam: R.pick(LAMS), k: R.int(2, 5) }; } while (!poissonOk(p.lam, p.k)); return p; };
const WIDTHS = [4, 5, 8, 10, 16, 20, 25, 40];
const drawUniform = R => { let p; do { const w = R.pick(WIDTHS), a = R.int(0, 20), c = R.int(a, a + w - 2); p = { a, b: a + w, c, d: R.int(c + 2, a + w) }; } while (p.c === p.a && p.d === p.b); return p; };
const expOk = (m, x) => { const v = r4(m * x), P = 1 - Math.exp(-v); return v >= 0.1 && v <= 3 && tieFree(P, 4) && r4(1 - ex6(v)) === r4(P); };
const drawExp = R => { let p; do { const m = R.pick([0.01, 0.02, 0.025, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5]); p = { m, x: R.int(Math.max(2, Math.ceil(0.1 / m)), Math.floor(3 / m)) }; } while (!expOk(p.m, p.x) || (p.m === 0.5 && p.x === 2)); return p; };  // not q29's worked example
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* X ~ binomial(n, p): mean np, standard deviation √(npq) to 2 places, P(X ≥ 1) = 1 − qⁿ to 4 places.
    qⁿ is kept between 0.02 and 0.9 so neither chance rounds to 0 or 1. Not the worked example (8 seeds, 0.25). */
 q21: {
  canonical: { n: 12, p: 0.15 },
  draw: R => { let p; do { p = { n: R.int(4, 20), p: R.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4]) }; }
   while ((p.n === 8 && p.p === 0.25) || p.n * p.p < 0.5 || Math.pow(1 - p.p, p.n) < 0.02 || Math.pow(1 - p.p, p.n) > 0.9
    || !tieFree(Math.sqrt(p.n * p.p * (1 - p.p)), 2) || !tieFree(Math.pow(1 - p.p, p.n), 4)); return p; },
  build: ({ n: N, p }) => { const q = r6(1 - p), mean = G.tidy(N * p), v = G.tidy(N * p * q), sd = r2(Math.sqrt(v)), none = r4(Math.pow(q, N)), some = r4(1 - Math.pow(q, N)); return {
   prompt: `The greenhouse has a tray of ${n(N)} blue kelp-vine seeds, a variety that seldom sprouts. Each seed sprouts with probability ${n(p)}, whatever the others do, and X is the number of seeds in the tray that sprout. Enter the mean of X, then its standard deviation to 2 decimal places, then the probability that at least one seed sprouts, to 4 decimal places.`,
   answer: [mean, sd, some],
   hints: ['For a binomial count the mean is np and the variance is npq, where q = 1 − p is the chance that a seed does not sprout. The standard deviation is the square root of the variance.', `“At least one sprouts” is the complement of “none sprouts”, and none sprouting means ${n(N)} failures in a row, with probability q${sup(N)}.`],
   solution: `q = 1 − ${n(p)} = ${n(q)}. The mean is np = ${n(N)} × ${n(p)} = ${n(mean)}. The variance is npq = ${n(N)} × ${n(p)} × ${n(q)} = ${n(v)}, so the standard deviation is √${n(v)} ≈ ${n(sd)}. The chance that no seed sprouts is q${sup(N)} = ${n(q)}${sup(N)} ≈ ${n(none)}, so the chance that at least one sprouts is 1 − ${n(none)} = ${n(some)}.`,
   guidance: [
    { prompt: `What is q, the chance that one seed does not sprout, and what is the mean np of the ${n(N)} seeds?`, answer: [q, mean], explanation: `q = 1 − ${n(p)} = ${n(q)}, and np = ${n(N)} × ${n(p)} = ${n(mean)}: on average that many seeds of the tray sprout.` },
    { prompt: `What is the variance npq, and the standard deviation √(npq) to 2 decimal places?`, answer: [v, sd], explanation: `npq = ${n(N)} × ${n(p)} × ${n(q)} = ${n(v)}, and √${n(v)} ≈ ${n(sd)}.` },
    { prompt: `What is q${sup(N)}, the chance that none of the ${n(N)} seeds sprouts, to 4 decimal places? Then what is the chance that at least one sprouts?`, answer: [none, some], explanation: `${n(q)}${sup(N)} ≈ ${n(none)}. Every outcome other than “none” has at least one sprout, so the chance is 1 − ${n(none)} = ${n(some)}.` }
   ] }; }
 },
 /* Geometric: first sprout on seed k, P = q^(k−1) p to 4 places, mean 1 ÷ p. k >= 3 so at least two failures come first;
    the chance stays at least 0.01. Not the worked example (p = 0.25, seed 3). */
 q22: {
  canonical: { p: 0.2, k: 4 },
  draw: R => { let p; do { p = { p: R.pick([0.05, 0.08, 0.1, 0.125, 0.16, 0.2, 0.25, 0.4, 0.5, 0.8]), k: R.int(3, 10) }; }
   while ((p.p === 0.25 && p.k === 3) || (() => { const P = Math.pow(1 - p.p, p.k - 1) * p.p; return P < 0.01 || !tieFree(P, 4) || r4(r4(Math.pow(1 - p.p, p.k - 1)) * p.p) !== r4(P); })()); return p; },
  build: ({ p, k }) => { const q = r6(1 - p), f = k - 1, qf = Math.pow(q, f), P = r4(qf * p), mean = G.tidy(1 / p); return {
   prompt: `Mira has a packet of old moon-squash seeds. Each one sprouts with probability ${n(p)}, whatever the others do, and she plants them one at a time until the first one sprouts. Enter the probability that the first sprout comes from seed number ${n(k)}, to 4 decimal places, then the mean number of seeds she plants to get her first sprout.`,
   answer: [P, mean],
   hints: [`The first sprout is seed ${n(k)} only if the first ${n(f)} seeds all fail and seed ${n(k)} sprouts: that is one particular sequence of ${n(k)} trials.`, 'For a geometric distribution the mean number of trials up to and including the first success is 1 ÷ p.'],
   solution: `q = 1 − ${n(p)} = ${n(q)}. Seed ${n(k)} is the first sprout when ${n(f)} failures come before one success, so P(X = ${n(k)}) = q${sup(f)} × p = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(qf)} × ${n(p)} ≈ ${n(P)}. The mean is 1 ÷ p = 1 ÷ ${n(p)} = ${n(mean)} seeds.`,
   guidance: [
    { prompt: `If the first sprout is seed ${n(k)}, how many failures come before it? And what is q, the chance that one seed fails?`, answer: [f, q], explanation: `Seeds 1 to ${n(f)} all fail before seed ${n(k)} sprouts, so there are ${n(f)} failures. q = 1 − ${n(p)} = ${n(q)}.` },
    { prompt: `Multiply q${sup(f)} by p. What is P(X = ${n(k)}) to 4 decimal places?`, answer: [P], explanation: `${n(q)}${sup(f)} ≈ ${n(qf)}, and ${n(qf)} × ${n(p)} ≈ ${n(P)}. There is only one order here: all the failures first, then the success.` },
    { prompt: `What is the mean number of seeds up to the first sprout, 1 ÷ p?`, answer: [mean], explanation: `1 ÷ ${n(p)} = ${n(mean)}. With a chance of ${n(p)} each time, a sprout comes once in every ${n(mean)} seeds on average.` }
   ] }; }
 },
 /* Model 1, binomial: exactly k of n seeds sprout, C(n, k) pᵏ qⁿ⁻ᵏ with the number of orders printed.
    Model 2, geometric: the first sprout is seed k, qᵏ⁻¹ p. n is used by model 1 only. Chances at least 0.01. */
 q23: {
  canonical: { kind: 1, n: 6, k: 2, p: 0.3 },
  draw: R => { let p; do { const kind = R.pick([1, 2]), N = R.int(4, 8);
    p = { kind, n: N, k: kind === 1 ? R.int(1, N - 1) : R.int(2, 7), p: R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]) }; }
   while ((() => { const q = 1 - p.p, P = p.kind === 1 ? choose(p.n, p.k) * Math.pow(p.p, p.k) * Math.pow(q, p.n - p.k) : Math.pow(q, p.k - 1) * p.p; return P < 0.01 || !tieFree(P, 4); })()); return p; },
  build: ({ kind, n: N, k, p }) => { const q = r6(1 - p), C = choose(N, k), bin = kind === 1, f = bin ? N - k : k - 1,
   P = r4(bin ? C * Math.pow(p, k) * Math.pow(q, N - k) : Math.pow(q, k - 1) * p),
   story = bin ? `she plants a row of ${n(N)} sun-wheat seeds, each sprouting with probability ${n(p)} whatever the others do, and wants the chance that exactly ${n(k)} of them sprout. The number of orders of ${n(k)} ${k === 1 ? 'sprout' : 'sprouts'} among ${n(N)} seeds is ${n(C)}.`
    : `she plants sun-wheat seeds one at a time, each sprouting with probability ${n(p)} whatever the others do, and stops at the first one that sprouts. She wants the chance that the first sprout is seed number ${n(k)}.`; return {
   prompt: `Two models are chalked on the greenhouse board: 1, the binomial distribution (a fixed number of trials, counting the successes) and 2, the geometric distribution (trials one at a time until the first success). Today ${story.replace(/^she /, 'Mira ')} Enter the number of the model that fits, then the probability, to 4 decimal places. Round only at the end, not the powers on the way.`,
   answer: [kind, P],
   hints: ['Ask what is fixed. If the number of seeds is fixed and the sprouts are counted, it is binomial. If planting stops at the first sprout, it is geometric.', 'Binomial: (number of orders) × pᵏ × qⁿ⁻ᵏ. Geometric: qᵏ⁻¹ × p, with only one order.'],
   solution: bin ? `The number of seeds is fixed at ${n(N)} and the sprouts are counted, so it is model 1, binomial. q = 1 − ${n(p)} = ${n(q)}. P(X = ${n(k)}) = ${n(C)} × ${n(p)}${sup(k)} × ${n(q)}${sup(N - k)} ≈ ${n(P)}.`
    : `Planting stops at the first sprout, so it is model 2, geometric. q = 1 − ${n(p)} = ${n(q)}. Seed ${n(k)} is the first sprout when ${f === 1 ? '1 failure comes' : `${n(f)} failures come`} first, so P(X = ${n(k)}) = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(P)}.`,
   guidance: [
    { prompt: 'Is the number of seeds fixed, with the sprouts counted (model 1), or does planting stop at the first sprout (model 2)? Enter the model number.', answer: [kind], explanation: bin ? `The row has a fixed ${n(N)} seeds and we count how many sprout: model 1, binomial.` : 'Nothing fixes the number of seeds: she stops at the first sprout. That is model 2, geometric.' },
    { prompt: `How many seeds fail in the outcome asked about?`, answer: [f], explanation: bin ? `${n(k)} of the ${n(N)} seeds sprout, so ${many(f, 'seed fails', 'seeds fail')}: the power of q is ${n(f)}.` : `Every seed before seed ${n(k)} fails, so ${many(f, 'seed fails', 'seeds fail')}: the power of q is ${n(f)}.` },
    { prompt: 'Put the numbers into the formula of that model. What is the probability, to 4 decimal places?', answer: [P], explanation: bin ? `${n(C)} × ${n(p)}${sup(k)} × ${n(q)}${sup(N - k)} ≈ ${n(P)}. The ${n(C)} counts every order the sprouts could come in.` : `${n(q)}${sup(f)} × ${n(p)} ≈ ${n(P)}. There is one order only: the failures first, then the sprout.` }
   ] }; }
 },
 /* Poisson with mean λ: P(X = k) = λᵏ e^(−λ) ÷ k! for k from 2 to 5, with e^(−λ) printed to 6 places. λᵏ has at most
    4 decimals and is below 1000; the answer from the printed e^(−λ) rounds the same as the exact one. Not the worked example (λ = 1.5, k = 2). */
 q24: {
  canonical: { lam: 2, k: 3 },
  draw: R => { let p; do { p = drawPoisson(R); } while (p.lam === 1.5 && p.k === 2); return p; },
  build: ({ lam, k }) => { const kf = fact(k), lk = G.tidy(Math.pow(lam, k)), e = ex6(lam), P = r4(lk * Math.exp(-lam) / kf),
   chain = Array.from({ length: k }, (_, i) => k - i).join(' × '); return {
   prompt: `The radio room’s meteor counter clicks at random, at an average of ${n(lam)} pings a minute, and the pings come independently of one another. Model the number of pings X in one minute with a Poisson distribution with λ = ${n(lam)}; ${eTo(lam)} = ${f6(e)} to 4 decimal places. Enter ${n(k)}!, then the probability of exactly ${n(k)} pings in a minute, to 4 decimal places.`,
   answer: [kf, P],
   hints: [`k! means k × (k − 1) × … × 1, so ${n(k)}! multiplies the whole numbers from ${n(k)} down to 1.`, `P(X = k) = λᵏ × e^(−λ) ÷ k!. Here λᵏ is ${n(lam)}${sup(k)}.`],
   solution: `${n(k)}! = ${chain} = ${n(kf)}, and λ${sup(k)} = ${n(lam)}${sup(k)} = ${n(lk)}. So P(X = ${n(k)}) = ${n(lk)} × ${f6(e)} ÷ ${n(kf)} ≈ ${n(P)}.`,
   guidance: [
    { prompt: `Work out ${n(k)}! = ${chain}.`, answer: [kf], explanation: `${chain} = ${n(kf)}.` },
    { prompt: `What is λ${sup(k)} = ${n(lam)}${sup(k)}?`, answer: [lk], explanation: `${n(lam)} multiplied by itself ${n(k)} times is ${n(lk)}.` },
    { prompt: `Multiply λ${sup(k)} by ${eTo(lam)} = ${f6(e)} and divide by ${n(k)}!. What is P(X = ${n(k)}) to 4 decimal places?`, answer: [P], explanation: `${n(lk)} × ${f6(e)} ÷ ${n(kf)} ≈ ${n(P)}. About ${n(rd(P * 100, 2))}% of minutes have exactly ${n(k)} pings.` }
   ] }; }
 },
 /* Uniform from a to b with width b − a in WIDTHS, so 1 ÷ (b − a) and every strip's chance are short exact decimals.
    The strip is at least 2 minutes wide and is never the whole range. */
 q25: {
  canonical: { a: 10, b: 30, c: 14, d: 23 },
  draw: R => { let p; do { p = drawUniform(R); } while (p.a === 0 && p.b === 8); return p; },
  build: ({ a, b, c, d }) => { const w = b - a, h = G.tidy(1 / w), s = d - c, P = G.tidy(s / w); return {
   prompt: `The relay buoy’s signal reaches the radio room at a random moment between ${n(a)} and ${n(b)} minutes past the hour, and every moment in that range is equally likely. Let X be the arrival time in minutes past the hour. Enter the height of the density curve of X, then the probability that the signal arrives between ${n(c)} and ${n(d)} minutes past the hour.`,
   answer: [h, P],
   hints: [`The density curve is a flat rectangle over the range from ${n(a)} to ${n(b)}. Its total area is 1, so its height is 1 ÷ (${n(b)} − ${n(a)}).`, `The probability is the area of the strip from ${n(c)} to ${n(d)}: its width times the height.`],
   solution: `The range is ${n(b)} − ${n(a)} = ${n(w)} minutes wide, so the height is 1 ÷ ${n(w)} = ${n(h)}. The strip from ${n(c)} to ${n(d)} is ${n(d)} − ${n(c)} = ${n(s)} minutes wide, so P(${n(c)} < X < ${n(d)}) = ${n(s)} × ${n(h)} = ${n(P)}.`,
   guidance: [
    { prompt: `How wide is the range of arrival times, ${n(b)} − ${n(a)}, and what height gives the rectangle over it an area of 1?`, answer: [w, h], explanation: `${n(b)} − ${n(a)} = ${n(w)} minutes, and ${n(w)} × height = 1 gives a height of 1 ÷ ${n(w)} = ${n(h)}.` },
    { prompt: `How wide is the strip from ${n(c)} to ${n(d)}, and what is its area?`, answer: [s, P], explanation: `${n(d)} − ${n(c)} = ${n(s)} minutes, and ${n(s)} × ${n(h)} = ${n(P)}. That area is the probability.` }
   ] }; }
 },
 /* Uniform from a to b: mean, kth percentile (k a multiple of 5) and P(X > c | X > d) = (b − c) ÷ (b − d) with d < c,
    b − d chosen so the answer is a short exact decimal. Not the worked example (0 to 10). */
 q26: {
  canonical: { a: 4, b: 20, k: 75, c: 17, d: 12 },
  draw: R => { let p; do { const w = R.pick([10, 12, 16, 20, 24, 30, 40]), a = R.int(0, 30), b = a + w, left = R.pick([4, 5, 8, 10, 16, 20, 25].filter(x => x < w)), d = b - left;
    p = { a, b, k: 5 * R.int(2, 18), c: R.int(d + 1, b - 2), d }; } while (p.a === 0 && p.b === 10); return p; },
  build: ({ a, b, k, c, d }) => { const w = b - a, mean = G.tidy((a + b) / 2), share = G.tidy(k / 100), pct = G.tidy(a + share * w), left = b - d, above = b - c, cond = G.tidy(above / left); return {
   prompt: `The supply beacon checks in with the radio room at a random time X between ${n(a)} and ${n(b)} minutes after midnight, and every moment in that range is equally likely. Enter the mean check-in time, then the ${n(k)}th percentile of X, then the probability that it checks in after ${n(c)} minutes, given that it has not checked in by ${n(d)} minutes.`,
   answer: [mean, pct, cond],
   hints: ['The mean of a uniform distribution is halfway along the range. The kth percentile is the time with k% of the area to its left: a + (k ÷ 100) × (b − a).', `Once you know X > ${n(d)}, X is spread evenly from ${n(d)} to ${n(b)}. The chance it is after ${n(c)} is the share of that shorter range lying above ${n(c)}.`],
   solution: `The mean is (${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes. The range is ${n(w)} minutes wide, so the ${n(k)}th percentile is ${n(a)} + ${n(share)} × ${n(w)} = ${n(pct)} minutes. Given X > ${n(d)}, X is uniform from ${n(d)} to ${n(b)}, a range ${n(left)} minutes wide, of which ${n(above)} minutes lie above ${n(c)}: P(X > ${n(c)} | X > ${n(d)}) = ${n(above)} ÷ ${n(left)} = ${n(cond)}.`,
   guidance: [
    { prompt: `What is the mean, halfway between ${n(a)} and ${n(b)}?`, answer: [mean], explanation: `(${n(a)} + ${n(b)}) ÷ 2 = ${n(mean)} minutes. The flat density balances at the middle of the range.` },
    { prompt: `What share of the range, as a decimal, lies to the left of the ${n(k)}th percentile, and what time is that?`, answer: [share, pct], explanation: `${n(k)}% is ${n(share)}, and ${n(share)} of the ${n(w)}-minute range is ${many(G.tidy(share * w), "minute", "minutes")}, so the percentile is ${n(a)} + ${n(G.tidy(share * w))} = ${n(pct)}.` },
    { prompt: `Given X > ${n(d)}, how wide is the range that is left, and what is P(X > ${n(c)} | X > ${n(d)})?`, answer: [left, cond], explanation: `The range left runs from ${n(d)} to ${n(b)}, ${n(left)} minutes, and ${n(above)} of them are above ${n(c)}: ${n(above)} ÷ ${n(left)} = ${n(cond)}.` }
   ] }; }
 },
 /* Exponential with decay rate m: P(X < x) = 1 − e^(−mx) to 4 places, with e^(−mx) printed to 6 places, and the mean 1 ÷ m.
    mx is from 0.1 to 3, x at least 2 hours. Not the worked example (m = 0.2, x = 3). */
 q27: {
  canonical: { m: 0.05, x: 10 },
  draw: R => { let p; do { p = drawExp(R); } while (p.m === 0.2 && p.x === 3); return p; },
  build: ({ m, x }) => { const v = r4(m * x), e = ex6(v), P = r4(1 - Math.exp(-v)), mean = G.tidy(1 / m); return {
   prompt: `The radio room’s receiver uses amplifier valves that burn out at random, without warning. A valve’s lifetime X in hours follows an exponential distribution with decay rate m = ${n(m)} per hour; ${eTo(v)} = ${f6(e)} to 4 decimal places. Enter the probability that a new valve fails within ${n(x)} hours, to 4 decimal places, then the mean lifetime of a valve in hours.`,
   answer: [P, mean],
   hints: [`For an exponential distribution P(X < x) = 1 − e^(−mx). Here mx = ${n(m)} × ${n(x)}.`, 'The mean lifetime is 1 ÷ m.'],
   solution: `mx = ${n(m)} × ${n(x)} = ${n(v)}, so P(X < ${n(x)}) = 1 − ${eTo(v)} = 1 − ${f6(e)} ≈ ${n(P)}. The mean lifetime is 1 ÷ ${n(m)} = ${n(mean)} hours.`,
   guidance: [
    { prompt: `What is mx = ${n(m)} × ${n(x)}?`, answer: [v], explanation: `${n(m)} × ${n(x)} = ${n(v)}.` },
    { prompt: `What is 1 − ${eTo(v)}, to 4 decimal places?`, answer: [P], explanation: `1 − ${f6(e)} = ${n(P)}: the area under the density curve to the left of ${n(x)} hours.` },
    { prompt: `What is the mean lifetime, 1 ÷ ${n(m)}?`, answer: [mean], explanation: `1 ÷ ${n(m)} = ${n(mean)} hours.` }
   ] }; }
 },
 /* Memoryless: P(X > a + b) = e^(−m(a + b)) and P(X > a + b | X > a) = e^(−mb), both to 4 places, with the three
    powers printed to 6 places. Not the worked example (m = 0.2, a = 3, b = 4). */
 q28: {
  canonical: { m: 0.05, a: 4, b: 8 },
  draw: R => { let p; do { const m = R.pick([0.02, 0.05, 0.1, 0.2, 0.25]), lo = Math.max(2, Math.ceil(0.1 / m)), hi = Math.floor(1.5 / m); p = { m, a: R.int(lo, hi), b: R.int(lo, hi) }; }
   while ((p.m === 0.2 && p.a === 3 && p.b === 4) || p.a === p.b || (() => { const ma = r4(p.m * p.a), mab = r4(p.m * (p.a + p.b)), mb = r4(p.m * p.b);
    return !tieFree(Math.exp(-mab), 4) || !tieFree(Math.exp(-mb), 4) || !tieFree(Math.exp(-ma), 4) || r4(ex6(mab) / ex6(ma)) !== r4(Math.exp(-mb)) || r4(ex6(mb)) !== r4(Math.exp(-mb)); })()); return p; },
  build: ({ m, a, b }) => { const ab = a + b, ma = r4(m * a), mab = r4(m * ab), mb = r4(m * b), eA = ex6(ma), eAB = ex6(mab), eB = ex6(mb),
   pA = r4(Math.exp(-ma)), pAB = r4(Math.exp(-mab)), cond = r4(Math.exp(-mb)); return {
   prompt: `A radio beacon’s battery life X in hours is exponential with decay rate m = ${n(m)} per hour. The battery in the beacon has already run ${n(a)} hours without failing. For reference, ${eTo(ma)} = ${f6(eA)}, ${eTo(mab)} = ${f6(eAB)} and ${eTo(mb)} = ${f6(eB)}, each to 4 decimal places. Enter P(X > ${n(ab)}), the chance that a new battery lasts more than ${n(ab)} hours, then P(X > ${n(ab)} | X > ${n(a)}), the chance that this battery lasts another ${n(b)} hours. Give both to 4 decimal places.`,
   answer: [pAB, cond],
   hints: ['For an exponential lifetime P(X > x) = e^(−mx).', `By the rule for conditional probability, P(X > ${n(ab)} | X > ${n(a)}) = P(X > ${n(ab)} and X > ${n(a)}) ÷ P(X > ${n(a)}), and lasting past ${n(ab)} hours already means lasting past ${n(a)}.`],
   solution: `P(X > ${n(ab)}) = ${eTo(mab)} ≈ ${n(pAB)}. Lasting past ${n(ab)} hours includes lasting past ${n(a)}, so P(X > ${n(ab)} | X > ${n(a)}) = ${eTo(mab)} ÷ ${eTo(ma)} = ${f6(eAB)} ÷ ${f6(eA)} ≈ ${n(cond)}. That is ${eTo(mb)} = P(X > ${n(b)}): the battery’s chances ahead do not depend on the ${n(a)} hours it has already run.`,
   guidance: [
    { prompt: `Which of the printed values are P(X > ${n(a)}) and P(X > ${n(ab)})?`, answer: [pA, pAB], explanation: `P(X > x) = e^(−mx), so P(X > ${n(a)}) = ${eTo(ma)} = ${f6(eA)} and P(X > ${n(ab)}) = ${eTo(mab)} = ${f6(eAB)}.` },
    { prompt: `Divide P(X > ${n(ab)}) by P(X > ${n(a)}). What is P(X > ${n(ab)} | X > ${n(a)}) to 4 decimal places?`, answer: [cond], explanation: `${f6(eAB)} ÷ ${f6(eA)} ≈ ${n(cond)}.` },
    { prompt: `Compare with the chance that a new battery lasts more than ${n(b)} hours, P(X > ${n(b)}) = ${eTo(mb)}. What is it, from the printed values?`, answer: [cond], explanation: `${eTo(mb)} = ${f6(eB)}, the same as the conditional chance: the exponential distribution is memoryless.` }
   ] }; }
 },
 /* Review: model 1 Poisson (exactly k crackles, λ a minute), 2 uniform (a call between c and d), 3 exponential
    (flat within x hours, rate m). Every field is drawn; the story uses those of its model. */
 q29: {
  canonical: { kind: 3, lam: 3, k: 2, a: 0, b: 20, c: 5, d: 12, m: 0.04, x: 20 },
  draw: R => ({ kind: R.pick([1, 2, 3]), ...drawPoisson(R), ...drawUniform(R), ...drawExp(R) }),
  build: ({ kind, lam, k, a, b, c, d, m, x }) => { const v = r4(m * x), kf = fact(k), lk = G.tidy(Math.pow(lam, k));
   const P = kind === 1 ? r4(lk * Math.exp(-lam) / kf) : kind === 2 ? G.tidy((d - c) / (b - a)) : r4(1 - Math.exp(-v));
   const story = kind === 1 ? `Static crackles hit the receiver at random, at an average of ${n(lam)} a minute. What is the probability of exactly ${n(k)} crackles in one minute? (${eTo(lam)} = ${f6(ex6(lam))} to 4 decimal places.)`
    : kind === 2 ? `The night courier calls in at a random time between ${n(a)} and ${n(b)} minutes past nine, and every moment in that range is equally likely. What is the probability that the call comes between ${n(c)} and ${n(d)} minutes past nine?`
    : `A headset battery runs for a random time with decay rate m = ${n(m)} per hour. What is the probability that it runs flat within ${n(x)} hours? (${eTo(v)} = ${f6(ex6(v))} to 4 decimal places.)`;
   const name = ['', 'Poisson', 'uniform', 'exponential'][kind];
   const why = kind === 1 ? 'It counts rare events in a fixed minute' : kind === 2 ? 'The time is equally likely anywhere in a range' : 'It is a lifetime with a decay rate';
   const work = kind === 1 ? `${n(lam)}${sup(k)} × ${eTo(lam)} ÷ ${n(k)}! = ${n(lk)} × ${f6(ex6(lam))} ÷ ${n(kf)} ≈ ${n(P)}`
    : kind === 2 ? `(${n(d)} − ${n(c)}) ÷ (${n(b)} − ${n(a)}) = ${n(d - c)} ÷ ${n(b - a)} = ${n(P)}`
    : `1 − ${eTo(v)} = 1 − ${f6(ex6(v))} ≈ ${n(P)}, with mx = ${n(m)} × ${n(x)} = ${n(v)}`; return {
   prompt: `Three models are pinned above the radio desk: 1, Poisson (a count of rare events in a fixed time); 2, uniform (a time equally likely anywhere in a range); 3, exponential (a waiting time or lifetime with a decay rate). ${story} Enter the number of the model that fits, then the probability, to 4 decimal places.`,
   answer: [kind, P],
   hints: ['A count of events in a fixed time is Poisson. A time equally likely anywhere in a range is uniform. A waiting time or lifetime with a decay rate is exponential.', 'Poisson: λᵏ × e^(−λ) ÷ k!. Uniform: (d − c) ÷ (b − a). Exponential: P(X < x) = 1 − e^(−mx).'],
   solution: `${why}, so it is model ${n(kind)}, ${name}. The probability is ${work}.`,
   guidance: [
    { prompt: 'Is this a count of rare events (1), a time equally likely anywhere in a range (2) or a lifetime with a decay rate (3)? Enter the model number.', answer: [kind], explanation: `${why}: model ${n(kind)}, ${name}.` },
    { prompt: `Use the ${name} formula. What is the probability, to 4 decimal places?`, answer: [P], explanation: `${work}.` }
   ] }; }
 },
 /* Normal bolt lengths with mean μ and standard deviation σ; two marks a whole number of σ from μ (from −3 to 3), and the
    empirical-rule percentage between them. Not the worked example (μ = 120, σ = 5). */
 q30: {
  canonical: { mu: 50, s: 0.4, i: -1, j: 2 },
  draw: R => { let p; do { const i = R.int(-3, 2); p = { mu: R.int(20, 120), s: R.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2, 2.5]), i, j: R.int(i + 1, 3) }; } while (p.mu === 120 && p.s === 5); return p; },
  build: ({ mu, s, i, j }) => { const lo = r4(mu + i * s), hi = r4(mu + j * s), parts = PIECE.slice(i + 3, j + 3), pct = G.tidy(parts.reduce((t, x) => t + x, 0));
   const sum = parts.length === 1 ? `that piece is ${n(pct)}%` : `the pieces are ${parts.map(x => n(x) + '%').join(' + ')} = ${n(pct)}%`; return {
   prompt: `The quality lab makes bolts whose lengths follow a normal distribution with mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm. Using the empirical rule, find the percentage of bolts between ${n(lo)} mm and ${n(hi)} mm long. Enter how many standard deviations the shorter length is from the mean (negative if it is below the mean), then the same for the longer length, then the percentage.`,
   answer: [i, j, pct],
   hints: ['Subtract the mean from each length and divide by σ: that says how many standard deviations from the mean it is.', 'The empirical rule puts 68% within 1σ of the mean, 95% within 2σ and 99.7% within 3σ. Halve each to get the pieces on one side, then add the pieces between your two marks.'],
   solution: `(${n(lo)} − ${n(mu)}) ÷ ${n(s)} = ${n(i)} and (${n(hi)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so the lengths are at ${mark(i)} and ${mark(j)}. Between them ${sum}.`,
   guidance: [
    { prompt: `How many standard deviations from the mean is ${n(lo)} mm? Enter a negative number if it is below the mean.`, answer: [i], explanation: `(${n(lo)} − ${n(mu)}) ÷ ${n(s)} = ${n(i)}, so ${n(lo)} mm is at ${mark(i)}.` },
    { prompt: `How many standard deviations from the mean is ${n(hi)} mm?`, answer: [j], explanation: `(${n(hi)} − ${n(mu)}) ÷ ${n(s)} = ${n(j)}, so ${n(hi)} mm is at ${mark(j)}.` },
    { prompt: `Add the empirical-rule pieces from ${mark(i)} to ${mark(j)}. What percentage of bolts is that?`, answer: [pct], explanation: `Each side of the mean holds 34% within 1σ, 13.5% from 1σ to 2σ and 2.35% from 2σ to 3σ. From ${mark(i)} to ${mark(j)} ${sum}.` }
   ] }; }
 },
});
})();
