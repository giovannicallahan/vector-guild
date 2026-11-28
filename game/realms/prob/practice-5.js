/* Probability practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p5.js. */
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
const rd = (x, dp) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const r2 = x => rd(x, 2), r4 = x => rd(x, 4), r6 = x => rd(x, 6);
/* The value is not within 2% of a unit of a rounding tie, so the rounded answer cannot depend on how it is worked out. */
const tieFree = (x, dp) => { const f = Math.abs(x) * Math.pow(10, dp), fr = f - Math.floor(f); return Math.abs(fr - 0.5) > 0.02; };
const exact = (x, dp) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-6;
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const choose = (N, k) => fact(N) / (fact(k) * fact(N - k));
const many = (c, one, more) => `${n(c)} ${c === 1 ? one : more}`;
const ex6 = v => r4(Math.exp(-v));
const eTo = v => `e^(−${n(v)})`;
const pw = (x, k) => Math.pow(x, k);
/* Binomial pieces: mean np, sd √(npq) and qⁿ must be tidy, with qⁿ well away from 0 and 1. */
const binOk = (N, p) => { const q = 1 - p, none = pw(q, N); return N * p >= 0.5 && none >= 0.02 && none <= 0.9 && tieFree(Math.sqrt(N * p * q), 2) && tieFree(none, 4); };
/* Geometric pieces: P(X = k) = qᵏ⁻¹ p and its rounding from the printed qᵏ⁻¹. */
const geoOk = (p, k) => { const q = 1 - p, P = pw(q, k - 1) * p; return P >= 0.01 && tieFree(P, 4) && r4(r4(pw(q, k - 1)) * p) === r4(P); };
const poissonOk = (lam, k) => { const lk = pw(lam, k), e = ex6(lam), P = lk * Math.exp(-lam) / fact(k);
 return exact(lk, 4) && lk < 1000 && P >= 0.01 && tieFree(P, 4) && r4(lk * e / fact(k)) === r4(P); };
const WIDTHS = [4, 5, 8, 10, 16, 20, 25, 40];
/* Every canonical and every draw passes poissonOk, so working from the printed 4-place e^(−λ) gives the same 4-place answer
   as the exact value (λ = 3 never does: 81 × 0.0498 ÷ 24 rounds to 0.1681, the exact value to 0.1680).
   λ in tenths from 0.5 to 5.6 (not 1, which would read "an average of 1 calls"); poissonOk keeps the pairs that work. */
const LAMS = Array.from({ length: 52 }, (_, i) => (i + 5) / 10).filter(l => l !== 1);

/* ---- q21 Binomial mean np, spread √(npq), and "at least one" [IS 4.3] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'Frost on the cold shelf',
 brief: 'A cold night is forecast, and Mira wants to know how many pepper seedlings on the cold shelf the frost may nip, and whether any will escape unharmed or all will be hit.',
 labels: ['mean', 'standard deviation', 'P(at least one nipped)'], tolerance: 0.00005,
 gl: [['q', 'mean np'], ['variance npq', 'standard deviation'], ['P(none nipped)', 'P(at least one nipped)']]
}, {
 canonical: { n: 15, p: 0.2 },
 draw: R => { let p; do { p = { n: R.int(5, 25), p: R.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4]) }; }
  while ((p.n === 12 && p.p === 0.15) || (p.n === 8 && p.p === 0.25) || !binOk(p.n, p.p)); return p; },
 build: ({ n: N, p }) => { const q = r6(1 - p), mean = G.tidy(N * p), v = G.tidy(N * p * q), sd = r2(Math.sqrt(v)), none = r4(pw(q, N)), some = r4(1 - pw(q, N)); return {
  prompt: `A forecast frost may nip the ${n(N)} pepper seedlings on the cold shelf. Each seedling is nipped with probability ${n(p)}, independently of the others, and X is the number of seedlings that are nipped. Enter the mean of X, then its standard deviation to 2 decimal places, then the probability that at least one seedling is nipped, to 4 decimal places.`,
  answer: [mean, sd, some],
  hints: ['A seedling that is nipped counts as a “success” here. The mean of a binomial count is np, and its standard deviation is the square root of npq, with q = 1 − p.', `“At least one nipped” is the opposite of “none nipped”. None nipped means all ${n(N)} seedlings escape, which has probability q${sup(N)}.`],
  solution: `q = 1 − ${n(p)} = ${n(q)}. The mean is np = ${n(N)} × ${n(p)} = ${n(mean)}. The variance is npq = ${n(N)} × ${n(p)} × ${n(q)} = ${n(v)}, so the standard deviation is √${n(v)} ≈ ${n(sd)}. The chance that none is nipped is q${sup(N)} = ${n(q)}${sup(N)} ≈ ${n(none)}, so the chance that at least one is nipped is 1 − ${n(none)} = ${n(some)}.`,
  guidance: [
   { prompt: `What is q, the chance that one seedling escapes the frost, and what is the mean np of the ${n(N)} seedlings?`, answer: [q, mean], explanation: `q = 1 − ${n(p)} = ${n(q)}, and np = ${n(N)} × ${n(p)} = ${many(mean, 'seedling', 'seedlings')} nipped on average.` },
   { prompt: 'What is the variance npq, and the standard deviation √(npq) to 2 decimal places?', answer: [v, sd], explanation: `npq = ${n(N)} × ${n(p)} × ${n(q)} = ${n(v)}, and √${n(v)} ≈ ${n(sd)}.` },
   { prompt: `What is q${sup(N)}, the chance that all ${n(N)} seedlings escape, to 4 decimal places? Then what is the chance that at least one is nipped?`, answer: [none, some], explanation: `${n(q)}${sup(N)} ≈ ${n(none)}. Every outcome other than “none nipped” has at least one nipped, so the chance is 1 − ${n(none)} = ${n(some)}.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'A drip line that must not fail',
 brief: 'The drip line along a greenhouse bench only waters properly when every valve opens, and Mira wants to know how often it lets a row down.',
 labels: ['P(every valve works)', 'P(at least one fails)', 'mean number of failed valves'], tolerance: 0.00005,
 gl: [['chance one valve fails', 'P(every valve works)'], ['P(at least one fails)'], ['mean number of failed valves']]
}, {
 canonical: { n: 20, p: 0.97 },
 draw: R => { let p; do { p = { n: R.int(6, 30), p: R.pick([0.9, 0.92, 0.94, 0.95, 0.96, 0.97, 0.98]) }; }
  while (pw(p.p, p.n) < 0.05 || pw(p.p, p.n) > 0.9 || !tieFree(pw(p.p, p.n), 4)); return p; },
 build: ({ n: N, p }) => { const q = r6(1 - p), all = r4(pw(p, N)), some = r4(1 - pw(p, N)), mean = G.tidy(N * q); return {
  prompt: `A drip line along a greenhouse bench has ${n(N)} valves in a row. Each valve opens on a given morning with probability ${n(p)}, independently of the others, and the bench is watered properly only if every valve opens. Enter the probability that every valve opens, to 4 decimal places. Then enter the probability that at least one valve fails to open, to 4 decimal places. Then enter the mean number of valves that fail to open on a morning.`,
  answer: [all, some, mean],
  hints: ['Every valve opening is a run of independent successes: multiply p by itself once for each valve.', '“At least one fails” is the opposite of “every valve opens”. For the mean, count the failures instead: each valve fails with probability 1 − p, so the mean number of failures is n times that.'],
  solution: `Each valve opens with probability ${n(p)}, so all ${n(N)} open with probability ${n(p)}${sup(N)} ≈ ${n(all)}. “At least one fails” is the complement: 1 − ${n(all)} = ${n(some)}. A valve fails with probability q = 1 − ${n(p)} = ${n(q)}, so the mean number of failures is nq = ${n(N)} × ${n(q)} = ${n(mean)}.`,
  guidance: [
   { prompt: `What is q, the chance that one valve fails, and what is ${n(p)}${sup(N)}, the chance that all ${n(N)} valves open, to 4 decimal places?`, answer: [q, all], explanation: `q = 1 − ${n(p)} = ${n(q)}. All ${n(N)} open when ${n(N)} independent successes come in a row: ${n(p)}${sup(N)} ≈ ${n(all)}.` },
   { prompt: `Take ${n(all)} away from 1. What is the chance that at least one valve fails?`, answer: [some], explanation: `The only way for no valve to fail is for every valve to open. So P(at least one fails) = 1 − ${n(all)} = ${n(some)}.` },
   { prompt: `Each valve fails with probability ${n(q)}. What is the mean number of failures among ${n(N)} valves, n × q?`, answer: [mean], explanation: `Counting failures as the successes of interest, the mean is n × ${n(q)} = ${n(N)} × ${n(q)} = ${many(mean, 'valve', 'valves')}.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', title: 'Sowing for a target',
 brief: 'Mira wants a tray of stubborn seeds that gives a set number of sprouts on average, so the greenhouse must first work out how many to sow.',
 labels: ['seeds to sow', 'standard deviation', 'P(at least one)'], tolerance: 0.00005,
 gl: [['seeds to sow'], ['variance npq', 'standard deviation'], ['P(none)', 'P(at least one)']]
}, {
 canonical: { p: 0.05, m: 3 },
 draw: R => { let r; do { const p = R.pick([0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.075, 0.08, 0.1, 0.125, 0.15, 0.2, 0.25, 0.3]), m = R.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]), N = m / p;
   r = { p, m, N }; } while (!Number.isInteger(rd(r.N, 6)) || r.N < 8 || r.N > 60 || !binOk(rd(r.N, 6), r.p) || (r.p === 0.15 && r.N === 80)); return { p: r.p, m: r.m }; },
 build: ({ p, m }) => { const N = Math.round(m / p), q = r6(1 - p), v = G.tidy(N * p * q), sd = r2(Math.sqrt(v)), none = r4(pw(q, N)), some = r4(1 - pw(q, N)); return {
  prompt: `Mira wants a tray of black-pepper seeds that gives ${n(m)} sprouts on average. Each seed sprouts with probability ${n(p)}, independently of the others, and X is the number of seeds in the tray that sprout. Enter the number of seeds she must sow for the mean of X to be ${n(m)}. Then, for a tray of that size, enter the standard deviation of X to 2 decimal places and the probability that at least one seed sprouts, to 4 decimal places.`,
  answer: [N, sd, some],
  hints: ['The mean of a binomial count is np. Here the mean and p are known, so work out which number of seeds n gives np equal to the mean wanted.', `With n found, the standard deviation is √(npq), and “at least one” is 1 minus the chance that all n seeds fail, which is q to the power n.`],
  solution: `The mean is np, so n × ${n(p)} = ${n(m)} and n = ${n(m)} ÷ ${n(p)} = ${n(N)} seeds. Then q = 1 − ${n(p)} = ${n(q)} and npq = ${n(N)} × ${n(p)} × ${n(q)} = ${n(v)}, so the standard deviation is √${n(v)} ≈ ${n(sd)}. The chance that no seed sprouts is q${sup(N)} = ${n(q)}${sup(N)} ≈ ${n(none)}, so the chance that at least one sprouts is 1 − ${n(none)} = ${n(some)}.`,
  guidance: [
   { prompt: `The mean np must be ${n(m)} and p is ${n(p)}. How many seeds n must she sow?`, answer: [N], explanation: `n = ${n(m)} ÷ ${n(p)} = ${n(N)}, since ${n(N)} × ${n(p)} = ${n(m)}.` },
   { prompt: `With ${n(N)} seeds, what is the variance npq, and the standard deviation √(npq) to 2 decimal places?`, answer: [v, sd], explanation: `q = ${n(q)}, so npq = ${n(N)} × ${n(p)} × ${n(q)} = ${n(v)}, and √${n(v)} ≈ ${n(sd)}.` },
   { prompt: `What is q${sup(N)}, the chance that none of the ${n(N)} seeds sprouts, to 4 decimal places? Then what is the chance that at least one sprouts?`, answer: [none, some], explanation: `${n(q)}${sup(N)} ≈ ${n(none)}, so P(at least one) = 1 − ${n(none)} = ${n(some)}.` }
  ] }; }
});

/* ---- q22 Geometric distribution: waiting for the first success [IS 4.4] ---- */

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Patching the leaky pane',
 brief: 'A pane in the greenhouse roof is leaking, and Mira wants to know how many patches she may have to try before one holds.',
 labels: ['P(first patch that holds is that one)', 'mean number of patches'], tolerance: 0.00005,
 gl: [['failed patches', 'q'], ['P(first patch that holds is that one)'], ['mean number of patches']]
}, {
 canonical: { p: 0.25, k: 5 },
 draw: R => { let p; do { p = { p: R.pick([0.05, 0.08, 0.1, 0.125, 0.16, 0.2, 0.25, 0.4, 0.5, 0.8]), k: R.int(3, 10) }; }
  while ((p.p === 0.2 && p.k === 4) || (p.p === 0.25 && p.k === 3) || !geoOk(p.p, p.k)); return p; },
 build: ({ p, k }) => { const q = r6(1 - p), f = k - 1, qf = pw(q, f), P = r4(qf * p), mean = G.tidy(1 / p); return {
  prompt: `A pane in the greenhouse roof leaks, and Mira presses on one sealing patch after another until a patch holds. Each patch holds with probability ${n(p)}, independently of the others. Enter the probability that the first patch to hold is patch number ${n(k)}, to 4 decimal places, then the mean number of patches she presses on.`,
  answer: [P, mean],
  hints: [`For patch ${n(k)} to be the first that holds, the first ${n(f)} patches must all fail and then patch ${n(k)} holds. Multiply the chances in that one order.`, 'The mean number of trials up to and including the first success is 1 ÷ p.'],
  solution: `A patch fails with probability q = 1 − ${n(p)} = ${n(q)}. Patch ${n(k)} is the first to hold when ${f === 1 ? '1 failure comes' : `${n(f)} failures come`} first, so P(X = ${n(k)}) = q${sup(f)} × p = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(qf)} × ${n(p)} ≈ ${n(P)}. The mean is 1 ÷ p = 1 ÷ ${n(p)} = ${n(mean)} patches.`,
  guidance: [
   { prompt: `How many patches fail before patch ${n(k)} holds, and what is q, the chance that one patch fails?`, answer: [f, q], explanation: `Patches 1 to ${n(f)} fail, so ${many(f, 'patch fails', 'patches fail')}. q = 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Multiply q${sup(f)} by p. What is P(X = ${n(k)}) to 4 decimal places?`, answer: [P], explanation: `${n(q)}${sup(f)} ≈ ${n(qf)}, and ${n(qf)} × ${n(p)} ≈ ${n(P)}.` },
   { prompt: 'What is the mean number of patches, 1 ÷ p?', answer: [mean], explanation: `1 ÷ ${n(p)} = ${n(mean)}: a patch holds once in every ${n(mean)} tries on average.` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'The price of a first shoot',
 brief: 'Glass-bean seeds are bought from the stores one at a time, and Mira needs to know both how long she will plant and what the packet of waiting will cost.',
 labels: ['P(first sprout on that seed)', 'mean number of seeds', 'mean cost in credits'], tolerance: 0.00005,
 gl: [['failures before the sprout', 'q'], ['P(first sprout on that seed)'], ['mean number of seeds', 'mean cost in credits']]
}, {
 canonical: { p: 0.125, k: 4, c: 4 },
 draw: R => { let p; do { p = { p: R.pick([0.1, 0.125, 0.2, 0.25, 0.4, 0.5]), k: R.int(3, 7), c: R.pick([3, 4, 5, 6, 8]) }; } while (!geoOk(p.p, p.k)); return p; },
 build: ({ p, k, c }) => { const q = r6(1 - p), f = k - 1, qf = pw(q, f), P = r4(qf * p), mean = G.tidy(1 / p), cost = G.tidy(c / p); return {
  prompt: `The stores sell glass-bean seeds at ${n(c)} credits a seed. Each seed sprouts with probability ${n(p)}, independently of the others, and Mira plants them one at a time, buying a new seed each time, until the first one sprouts. Enter the probability that the first sprout comes from seed number ${n(k)}, to 4 decimal places. Then enter the mean number of seeds she buys, and the mean cost in credits.`,
  answer: [P, mean, cost],
  hints: ['Seed number k is the first sprout when the k − 1 seeds before it all fail, then it sprouts. There is only one order.', 'The mean number of seeds is 1 ÷ p. Each seed costs the same, so the mean cost is the mean number of seeds times the price of one seed.'],
  solution: `q = 1 − ${n(p)} = ${n(q)}. The first sprout is seed ${n(k)} when ${f === 1 ? '1 failure comes' : `${n(f)} failures come`} first: P(X = ${n(k)}) = q${sup(f)} × p = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(qf)} × ${n(p)} ≈ ${n(P)}. The mean number of seeds is 1 ÷ p = ${n(mean)}, and at ${n(c)} credits each the mean cost is ${n(mean)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `How many seeds fail before seed ${n(k)} sprouts, and what is q, the chance that one seed fails?`, answer: [f, q], explanation: `Seeds 1 to ${n(f)} fail, so ${many(f, 'seed fails', 'seeds fail')}. q = 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Multiply q${sup(f)} by p. What is P(X = ${n(k)}) to 4 decimal places?`, answer: [P], explanation: `${n(q)}${sup(f)} ≈ ${n(qf)}, and ${n(qf)} × ${n(p)} ≈ ${n(P)}.` },
   { prompt: `What is the mean number of seeds, 1 ÷ p, and the mean cost in credits at ${n(c)} credits a seed?`, answer: [mean, cost], explanation: `1 ÷ ${n(p)} = ${n(mean)} seeds, and ${n(mean)} × ${n(c)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', title: 'Bulbs from the damaged box',
 brief: 'A box of grow-lamp bulbs was dropped in transit, and Mira tests them one at a time, wanting the odds that she has a working one within a few tries.',
 uses: 'q03',
 labels: ['P(first lit bulb is that one)', 'P(a bulb lights within those tests)', 'mean number of bulbs tested'], tolerance: 0.00005,
 gl: [['P(first lit bulb is that one)'], ['P(all those bulbs fail)', 'P(a bulb lights within those tests)'], ['mean number of bulbs tested']]
}, {
 canonical: { p: 0.2, k: 6 },
 draw: R => { let p; do { p = { p: R.pick([0.05, 0.08, 0.1, 0.125, 0.16, 0.2, 0.25, 0.4]), k: R.int(5, 12) }; }
  while (!geoOk(p.p, p.k) || !tieFree(pw(1 - p.p, p.k), 4) || r4(1 - r4(pw(1 - p.p, p.k))) !== r4(1 - pw(1 - p.p, p.k))); return p; },
 build: ({ p, k }) => { const q = r6(1 - p), f = k - 1, qf = pw(q, f), P = r4(qf * p), qk = r4(pw(q, k)), within = r4(1 - pw(q, k)), mean = G.tidy(1 / p); return {
  prompt: `A box of grow-lamp bulbs was dropped, and each bulb now lights with probability ${n(p)}, independently of the others. Mira tests the bulbs one at a time and stops at the first that lights. She has plenty of bulbs from the same delivery, so she never runs out before one lights. Enter the probability that the first bulb to light is bulb number ${n(k)}, to 4 decimal places. Then enter the probability that she finds a bulb that lights within her first ${n(k)} tests (that is, at least one of the first ${n(k)} bulbs lights), to 4 decimal places. Then enter the mean number of bulbs she tests.`,
  answer: [P, within, mean],
  hints: [`The first lit bulb is bulb ${n(k)} when the ${n(f)} bulbs before it fail and bulb ${n(k)} lights. For the second answer, use the complement: the opposite of “at least one of the first ${n(k)} lights” is “all ${n(k)} fail”, and the chances of an event and its opposite add to 1.`, 'All k bulbs failing has probability q to the power k. The mean is 1 ÷ p.'],
  solution: `q = 1 − ${n(p)} = ${n(q)}. P(first lit bulb is bulb ${n(k)}) = q${sup(f)} × p = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(qf)} × ${n(p)} ≈ ${n(P)}. Finding no lit bulb in the first ${n(k)} tests means ${n(k)} failures in a row, with probability q${sup(k)} = ${n(q)}${sup(k)} ≈ ${n(qk)}, so the chance of at least one lit bulb is 1 − ${n(qk)} = ${n(within)}. The mean number tested is 1 ÷ ${n(p)} = ${n(mean)}.`,
  guidance: [
   { prompt: `${many(f, 'bulb fails', 'bulbs fail')} first and then bulb ${n(k)} lights. What is P(X = ${n(k)}) = q${sup(f)} × p, to 4 decimal places?`, answer: [P], explanation: `q = ${n(q)}, and ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(qf)} × ${n(p)} ≈ ${n(P)}.` },
   { prompt: `What is q${sup(k)}, the chance that all ${n(k)} bulbs fail, to 4 decimal places? Then what is the chance that at least one of them lights?`, answer: [qk, within], explanation: `${n(q)}${sup(k)} ≈ ${n(qk)}. By the complement rule, P(at least one lights) = 1 − ${n(qk)} = ${n(within)}.` },
   { prompt: 'What is the mean number of bulbs tested, 1 ÷ p?', answer: [mean], explanation: `1 ÷ ${n(p)} = ${n(mean)} bulbs.` }
  ] }; }
});

/* ---- q23 Chapter review: binomial or geometric? [IS 4.3, 4.4] ---- */

const tidyP = (kind, N, k, p) => kind === 1 ? choose(N, k) * pw(p, k) * pw(1 - p, N - k) : pw(1 - p, k - 1) * p;

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The failing heating cables',
 brief: 'The greenhouse heating cables sometimes burn out overnight, and Mira has to know which model fits each question the night shift asks.',
 labels: ['model number', 'probability'], tolerance: 0.00005,
 gl: [['model number'], ['failures in the outcome'], ['probability']]
}, {
 canonical: { kind: 2, n: 5, k: 4, p: 0.4 },
 draw: R => { let p; do { const kind = R.pick([1, 2]), N = R.int(4, 8);
   p = { kind, n: N, k: kind === 1 ? R.int(1, N - 1) : R.int(2, 7), p: R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]) }; }
  while (p.kind === 1 && p.n === 6 && p.k === 2 && p.p === 0.3 || (() => { const P = tidyP(p.kind, p.n, p.k, p.p); return P < 0.01 || !tieFree(P, 4); })()); return p; },
 build: ({ kind, n: N, k, p }) => { const q = r6(1 - p), C = choose(N, k), bin = kind === 1, f = bin ? N - k : k - 1,
  P = r4(bin ? C * pw(p, k) * pw(q, N - k) : pw(q, k - 1) * p),
  story = bin ? `a bench has ${n(N)} heating cables, and each cable burns out overnight with probability ${n(p)}, independently of the others. Mira wants the chance that exactly ${n(k)} of the cables ${k === 1 ? 'burns' : 'burn'} out. The number of orders of ${n(k)} ${k === 1 ? 'burn-out' : 'burn-outs'} among ${n(N)} cables is ${n(C)}.`
   : `she tests spare heating cables one at a time, and each one burns out within the hour with probability ${n(p)}, independently of the others. She stops at the first cable that burns out, and wants the chance that this is cable number ${n(k)}.`; return {
  prompt: `Two models are chalked on the greenhouse board: 1, the binomial distribution (a fixed number of trials, counting the successes) and 2, the geometric distribution (trials one at a time until the first success). Tonight ${story.replace(/^she /, 'Mira ')} Here a burn-out is the success. Enter the number of the model that fits, then the probability, to 4 decimal places. Round only at the end, not the powers on the way.`,
  answer: [kind, P],
  hints: ['Ask what is fixed. A fixed number of cables with the burn-outs counted is binomial. Testing one at a time until the first burn-out is geometric.', 'Binomial: (number of orders) × pᵏ × qⁿ⁻ᵏ. Geometric: qᵏ⁻¹ × p, with one order only.'],
  solution: bin ? `The number of cables is fixed at ${n(N)} and the burn-outs are counted, so it is model 1, binomial. q = 1 − ${n(p)} = ${n(q)}. P(X = ${n(k)}) = ${n(C)} × ${n(p)}${sup(k)} × ${n(q)}${sup(N - k)} ≈ ${n(P)}.`
   : `Testing stops at the first burn-out, so it is model 2, geometric. q = 1 − ${n(p)} = ${n(q)}. Cable ${n(k)} is the first to burn out when ${f === 1 ? '1 cable holds' : `${n(f)} cables hold`} first, so P(X = ${n(k)}) = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(P)}.`,
  guidance: [
   { prompt: 'Is the number of cables fixed, with the burn-outs counted (model 1), or does testing stop at the first burn-out (model 2)? Enter the model number.', answer: [kind], explanation: bin ? `The bench has a fixed ${n(N)} cables and we count how many burn out: model 1, binomial.` : 'Nothing fixes the number of cables: she stops at the first burn-out. That is model 2, geometric.' },
   { prompt: bin ? 'How many cables do not burn out in the outcome asked about? That is the power of q.' : 'How many cables hold before the first burn-out? That is the power of q.', answer: [f], explanation: bin ? `${n(N)} − ${n(k)} = ${n(f)}: ${f === 1 ? '1 cable holds' : `${n(f)} cables hold`}, so q is raised to the power ${n(f)}, and p to the power ${n(k)}.` : `${f === 1 ? 'Cable 1 holds' : `Cables 1 to ${n(f)} hold`}, so q is raised to the power ${n(f)}.` },
   { prompt: 'Put the numbers into the formula of that model. What is the probability, to 4 decimal places?', answer: [P], explanation: bin ? `${n(C)} × ${n(p)}${sup(k)} × ${n(q)}${sup(N - k)} ≈ ${n(P)}. The ${n(C)} counts every order the burn-outs could come in.` : `${n(q)}${sup(f)} × ${n(p)} ≈ ${n(P)}. There is one order only: the cables that hold come first, then the burn-out.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Two jobs for one morning',
 brief: 'Mira has two seed jobs before lunch, and each needs its own model before she can say how likely it is to go the way she hopes.',
 labels: ['P(part A)', 'P(part B)'], tolerance: 0.00005,
 gl: [['model for part A', 'model for part B'], ['P(part A)'], ['P(part B)']]
}, {
 canonical: { n: 6, k: 4, pa: 0.6, m: 3, pb: 0.25 },
 draw: R => { let p; do { const N = R.int(4, 8);
   p = { n: N, k: R.int(1, N - 1), pa: R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7]), m: R.int(2, 7), pb: R.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]) }; }
  while ((() => { const A = tidyP(1, p.n, p.k, p.pa), B = tidyP(2, 0, p.m, p.pb); return A < 0.01 || B < 0.01 || !tieFree(A, 4) || !tieFree(B, 4); })()); return p; },
 build: ({ n: N, k, pa, m, pb }) => { const qa = r6(1 - pa), qb = r6(1 - pb), C = choose(N, k), A = r4(C * pw(pa, k) * pw(qa, N - k)), B = r4(pw(qb, m - 1) * pb); return {
  prompt: `Two models are chalked on the greenhouse board: 1, the binomial distribution (a fixed number of trials, counting the successes) and 2, the geometric distribution (trials one at a time until the first success). Mira has two jobs. Part A: she plants a row of ${n(N)} chicory seeds, each sprouting with probability ${n(pa)}, independently of the others, and wants the chance that exactly ${n(k)} of them sprout. The number of orders of ${many(k, 'sprout', 'sprouts')} among ${n(N)} seeds is ${n(C)}. Part B: from a packet of old fennel seeds, each sprouting with probability ${n(pb)}, independently of the others, she plants one at a time until the first sprout, and wants the chance that it is seed number ${n(m)}. Enter the probability for part A and then for part B, each to 4 decimal places. Round only at the end, not the powers on the way.`,
  answer: [A, B],
  hints: ['Decide the model for each part separately. Part A has a fixed number of seeds and counts sprouts. Part B stops at the first sprout.', 'Binomial: (number of orders) × pᵏ × qⁿ⁻ᵏ. Geometric: qᵏ⁻¹ × p. Use the p and q of each part, not the other’s.'],
  solution: `Part A has a fixed ${n(N)} seeds and counts sprouts, so it is model 1, binomial. q = 1 − ${n(pa)} = ${n(qa)}, so P = ${n(C)} × ${n(pa)}${sup(k)} × ${n(qa)}${sup(N - k)} ≈ ${n(A)}. Part B stops at the first sprout, so it is model 2, geometric. q = 1 − ${n(pb)} = ${n(qb)}, so P = ${n(qb)}${sup(m - 1)} × ${n(pb)} ≈ ${n(B)}.`,
  guidance: [
   { prompt: 'Which model fits part A, and which fits part B? Enter the model number for A, then the model number for B.', answer: [1, 2], explanation: `Part A fixes the number of seeds and counts the sprouts: model 1. Part B plants until the first sprout: model 2.` },
   { prompt: `Part A: put the numbers into ${n(C)} × p${sup(k)} × q${sup(N - k)}. What is the probability, to 4 decimal places?`, answer: [A], explanation: `q = ${n(qa)}, and ${n(C)} × ${n(pa)}${sup(k)} × ${n(qa)}${sup(N - k)} ≈ ${n(A)}.` },
   { prompt: `Part B: put the numbers into q${sup(m - 1)} × p. What is the probability, to 4 decimal places?`, answer: [B], explanation: `q = ${n(qb)}, and ${n(qb)}${sup(m - 1)} × ${n(pb)} ≈ ${n(B)}.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', title: 'Tomato rows and the mean',
 brief: 'Mira asks the night shift about her tomato plants, and each question needs the right model before the probability and its mean can be given.',
 uses: 'q21',
 labels: ['model number', 'probability', 'mean'], tolerance: 0.00005,
 gl: [['model number'], ['probability'], ['mean']]
}, {
 canonical: { kind: 1, n: 8, k: 3, p: 0.4 },
 draw: R => { let p; do { const kind = R.pick([1, 2]), N = R.int(6, 8);
   p = { kind, n: N, k: kind === 1 ? R.int(2, N - 2) : R.int(3, 7), p: R.pick([0.2, 0.25, 0.4, 0.5]) }; }
  while ((() => { const P = tidyP(p.kind, p.n, p.k, p.p); return P < 0.01 || !tieFree(P, 4); })()); return p; },
 build: ({ kind, n: N, k, p }) => { const q = r6(1 - p), C = choose(N, k), bin = kind === 1, f = bin ? N - k : k - 1,
  P = r4(bin ? C * pw(p, k) * pw(q, N - k) : pw(q, k - 1) * p), mean = G.tidy(bin ? N * p : 1 / p),
  story = bin ? `she puts ${n(N)} tomato cuttings in a row, each taking root with probability ${n(p)}, independently of the others, and wants the chance that exactly ${n(k)} of them take root. The number of orders of ${n(k)} ${k === 1 ? 'rooted cutting' : 'rooted cuttings'} among ${n(N)} is ${n(C)}. She also wants the mean number of cuttings that take root.`
   : `she roots tomato cuttings one at a time, each taking root with probability ${n(p)}, independently of the others, and stops at the first that takes root. She wants the chance that it is cutting number ${n(k)}, and the mean number of cuttings she tries.`; return {
  prompt: `Two models are chalked on the greenhouse board: 1, the binomial distribution (a fixed number of trials, counting the successes) and 2, the geometric distribution (trials one at a time until the first success). Today ${story.replace(/^she /, 'Mira ')} Enter the number of the model that fits, then the probability to 4 decimal places, then the mean. Round only at the end, not the powers on the way.`,
  answer: [kind, P, mean],
  hints: ['Ask what is fixed. A fixed number of cuttings with the roots counted is binomial. Trying one at a time until the first one roots is geometric.', 'Binomial: probability (number of orders) × pᵏ × qⁿ⁻ᵏ and mean np. Geometric: probability qᵏ⁻¹ × p and mean 1 ÷ p.'],
  solution: bin ? `The number of cuttings is fixed at ${n(N)} and the ones that root are counted, so it is model 1, binomial. q = 1 − ${n(p)} = ${n(q)}. P(X = ${n(k)}) = ${n(C)} × ${n(p)}${sup(k)} × ${n(q)}${sup(N - k)} ≈ ${n(P)}, and the mean is np = ${n(N)} × ${n(p)} = ${n(mean)}.`
   : `Cuttings are tried until the first roots, so it is model 2, geometric. q = 1 − ${n(p)} = ${n(q)}. P(X = ${n(k)}) = ${n(q)}${sup(f)} × ${n(p)} ≈ ${n(P)}, and the mean is 1 ÷ p = 1 ÷ ${n(p)} = ${n(mean)}.`,
  guidance: [
   { prompt: 'Is the number of cuttings fixed, with the roots counted (model 1), or does she stop at the first that roots (model 2)? Enter the model number.', answer: [kind], explanation: bin ? `The row has a fixed ${n(N)} cuttings and we count how many root: model 1, binomial.` : 'Nothing fixes the number of cuttings: she stops at the first to root. That is model 2, geometric.' },
   { prompt: 'Put the numbers into the formula of that model. What is the probability, to 4 decimal places?', answer: [P], explanation: bin ? `${n(C)} × ${n(p)}${sup(k)} × ${n(q)}${sup(N - k)} ≈ ${n(P)}. The ${n(C)} counts every order the roots could come in.` : `${n(q)}${sup(f)} × ${n(p)} ≈ ${n(P)}. There is one order only: the failures first, then the success.` },
   { prompt: bin ? 'What is the mean number of cuttings that root, np?' : 'What is the mean number of cuttings tried, 1 ÷ p?', answer: [mean], explanation: bin ? `np = ${n(N)} × ${n(p)} = ${n(mean)} cuttings.` : `1 ÷ ${n(p)} = ${n(mean)} cuttings.` }
  ] }; }
});

/* ---- q24 Poisson distribution: counts of rare events [IS 4.6] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'Calls at the desk',
 brief: 'Calls from the outer relays come into the radio desk at random, and Mira wants to know how often an hour brings exactly the number the night staff can handle.',
 labels: ['k!', 'probability'], tolerance: 0.00005,
 gl: [['k!'], ['λ to the power k'], ['probability']]
}, {
 canonical: { lam: 2.5, k: 4 },
 draw: R => { let p; do { p = { lam: R.pick(LAMS), k: R.int(2, 5) }; } while ((p.lam === 1.5 && p.k === 2) || (p.lam === 2 && p.k === 3) || !poissonOk(p.lam, p.k)); return p; },
 build: ({ lam, k }) => { const kf = fact(k), lk = G.tidy(pw(lam, k)), e = ex6(lam), P = r4(lk * Math.exp(-lam) / kf), chain = Array.from({ length: k }, (_, i) => k - i).join(' × '); return {
  prompt: `Calls from the outer relays reach the radio desk at random, at an average of ${n(lam)} calls an hour, and they come independently of one another. Model the number of calls X in one hour with a Poisson distribution with λ = ${n(lam)}; ${eTo(lam)} = ${n(e)} to 4 decimal places. Enter ${n(k)}!, then the probability of exactly ${n(k)} calls in an hour, to 4 decimal places.`,
  answer: [kf, P],
  hints: [`${n(k)}! multiplies the whole numbers from ${n(k)} down to 1.`, `P(X = k) = λᵏ × e^(−λ) ÷ k!. Find λᵏ first, here ${n(lam)} multiplied by itself ${n(k)} times.`],
  solution: `${n(k)}! = ${chain} = ${n(kf)}, and λ${sup(k)} = ${n(lam)}${sup(k)} = ${n(lk)}. So P(X = ${n(k)}) = ${n(lk)} × ${n(e)} ÷ ${n(kf)} ≈ ${n(P)}.`,
  guidance: [
   { prompt: `Work out ${n(k)}! = ${chain}.`, answer: [kf], explanation: `${chain} = ${n(kf)}.` },
   { prompt: `What is λ${sup(k)} = ${n(lam)}${sup(k)}?`, answer: [lk], explanation: `${n(lam)} multiplied by itself ${n(k)} times is ${n(lk)}.` },
   { prompt: `Multiply λ${sup(k)} by ${eTo(lam)} = ${n(e)} and divide by ${n(k)}!. What is P(X = ${n(k)}) to 4 decimal places?`, answer: [P], explanation: `${n(lk)} × ${n(e)} ÷ ${n(kf)} ≈ ${n(P)}. About ${n(rd(P * 100, 2))}% of hours bring exactly ${n(k)} calls.` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'A longer watch on the mast',
 brief: 'The static counter on the mast runs for a whole watch rather than a minute, and Mira wants the chance of exactly the number of bursts that would trip the alarm.',
 labels: ['λ', 'probability'], tolerance: 0.00005,
 gl: [['λ for the watch'], ['k!', 'λ to the power k'], ['probability']]
}, {
 canonical: { r: 0.5, t: 5, k: 3 },
 draw: R => { let p; do { p = { r: R.pick([0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.2, 1.5, 2, 2.5]), t: R.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]), k: R.int(2, 5) }; }
  while ((() => { const lam = G.tidy(p.r * p.t); return lam < 1.5 || lam > 6 || !poissonOk(lam, p.k); })()); return p; },
 build: ({ r, t, k }) => { const lam = G.tidy(r * t), kf = fact(k), lk = G.tidy(pw(lam, k)), e = ex6(lam), P = r4(lk * Math.exp(-lam) / kf), chain = Array.from({ length: k }, (_, i) => k - i).join(' × '); return {
  prompt: `The static counter on the mast picks up bursts at random, at an average of ${n(r)} bursts a minute, and the bursts come independently of one another. Mira reads it over a watch of ${n(t)} minutes, and the number of bursts X in the watch has a Poisson distribution whose λ is the average number of bursts in the whole watch; for that λ, e^(−λ) = ${n(e)} to 4 decimal places. Enter λ, then the probability of exactly ${n(k)} bursts in the watch, to 4 decimal places.`,
  answer: [lam, P],
  hints: ['λ is the average number in the stretch of time you are asking about. If bursts come at a steady average rate, find the average for the whole watch before anything else.', `Then P(X = k) = λᵏ × e^(−λ) ÷ k!, with k = ${n(k)}.`],
  solution: `The average for the whole watch is λ = ${n(r)} × ${n(t)} = ${n(lam)} bursts. Then ${n(k)}! = ${chain} = ${n(kf)} and λ${sup(k)} = ${n(lam)}${sup(k)} = ${n(lk)}, so P(X = ${n(k)}) = ${n(lk)} × ${n(e)} ÷ ${n(kf)} ≈ ${n(P)}.`,
  guidance: [
   { prompt: `Bursts average ${n(r)} a minute, and the watch lasts ${n(t)} minutes. What is the average number of bursts in the watch, λ?`, answer: [lam], explanation: `${n(r)} × ${n(t)} = ${n(lam)}. The Poisson distribution needs the average for the stretch asked about.` },
   { prompt: `What is ${n(k)}! = ${chain}, and what is λ${sup(k)}?`, answer: [kf, lk], explanation: `${chain} = ${n(kf)}, and ${n(lam)}${sup(k)} = ${n(lk)}.` },
   { prompt: `Multiply λ${sup(k)} by ${n(e)} and divide by ${n(k)}!. What is P(X = ${n(k)}) to 4 decimal places?`, answer: [P], explanation: `${n(lk)} × ${n(e)} ÷ ${n(kf)} ≈ ${n(P)}.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', title: 'A busy night on the line',
 brief: 'On a busy night the relay line crackles often, and Mira wants both the chance of one exact count and the chance that the line is not silent at all.',
 uses: 'q21',
 labels: ['k!', 'P(exactly k)', 'P(at least one)'], tolerance: 0.00005,
 gl: [['k!'], ['λ to the power k', 'P(exactly k)'], ['P(none)', 'P(at least one)']]
}, {
 canonical: { lam: 3.5, k: 4 },
 draw: R => { let p; do { p = { lam: R.pick(LAMS.filter(l => l >= 2)), k: R.int(2, 5) }; } while (!poissonOk(p.lam, p.k) || r4(1 - ex6(p.lam)) !== r4(1 - Math.exp(-p.lam)) || (p.lam === 2 && p.k === 3)); return p; },
 build: ({ lam, k }) => { const kf = fact(k), lk = G.tidy(pw(lam, k)), e = ex6(lam), P = r4(lk * Math.exp(-lam) / kf), some = r4(1 - e), chain = Array.from({ length: k }, (_, i) => k - i).join(' × '); return {
  prompt: `On a busy night the relay line crackles at random, at an average of ${n(lam)} crackles a minute, independently of one another. Model the number of crackles X in one minute with a Poisson distribution with λ = ${n(lam)}; ${eTo(lam)} = ${n(e)} to 4 decimal places. Enter ${n(k)}!, then the probability of exactly ${n(k)} crackles in a minute, then the probability of at least one crackle in a minute, each to 4 decimal places.`,
  answer: [kf, P, some],
  hints: [`P(X = k) = λᵏ × e^(−λ) ÷ k!. For no crackles, k = 0, and 0! = 1, λ⁰ = 1.`, '“At least one” is the complement of “none”, so its chance is 1 minus the chance of none. The chance of none is the Poisson chance with k = 0, which simplifies to e^(−λ).'],
  solution: `${n(k)}! = ${chain} = ${n(kf)}, and λ${sup(k)} = ${n(lam)}${sup(k)} = ${n(lk)}, so P(X = ${n(k)}) = ${n(lk)} × ${n(e)} ÷ ${n(kf)} ≈ ${n(P)}. For no crackles, P(X = 0) = λ⁰ × e^(−λ) ÷ 0! = 1 × ${n(e)} ÷ 1 = ${n(e)}, so the chance of at least one is 1 − ${n(e)} = ${n(some)}.`,
  guidance: [
   { prompt: `Work out ${n(k)}! = ${chain}.`, answer: [kf], explanation: `${chain} = ${n(kf)}.` },
   { prompt: `What is λ${sup(k)} = ${n(lam)}${sup(k)}, and then P(X = ${n(k)}) = λ${sup(k)} × ${n(e)} ÷ ${n(kf)} to 4 decimal places?`, answer: [lk, P], explanation: `${n(lam)}${sup(k)} = ${n(lk)}, and ${n(lk)} × ${n(e)} ÷ ${n(kf)} ≈ ${n(P)}.` },
   { prompt: `For no crackles, k = 0: λ⁰ = 1 and 0! = 1, so P(X = 0) = ${eTo(lam)}. What is it, and what is the chance of at least one crackle?`, answer: [e, some], explanation: `P(X = 0) = 1 × ${n(e)} ÷ 1 = ${n(e)}. By the complement rule, P(at least one) = 1 − ${n(e)} = ${n(some)}.` }
  ] }; }
});

/* ---- q25 Probability as area; the uniform distribution [IS 5.1, 5.2] ---- */

/* A uniform range a to b of width w from WIDTHS, so 1 ÷ w and every strip's chance are short exact decimals. */
mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The repeater restart',
 brief: 'After a power dip the relay repeater restarts at an unpredictable moment, and Mira wants the chance it is back before the next scheduled message.',
 labels: ['density height', 'probability'], tolerance: 0.00005,
 gl: [['range width', 'density height'], ['strip width', 'probability']]
}, {
 canonical: { a: 6, b: 14, c: 8, d: 13 },
 draw: R => { let p; do { const w = R.pick(WIDTHS), a = R.int(0, 20), c = R.int(a, a + w - 2); p = { a, b: a + w, c, d: R.int(c + 2, a + w) }; }
  while ((p.a === 10 && p.b === 30) || (p.c === p.a && p.d === p.b)); return p; },
 build: ({ a, b, c, d }) => { const w = b - a, h = G.tidy(1 / w), s = d - c, P = G.tidy(s / w); return {
  prompt: `After a power dip, the relay repeater restarts at a random moment between ${n(a)} and ${n(b)} seconds, and every moment in that range is equally likely. Let X be the restart time in seconds. Enter the height of the density curve of X, then the probability that the repeater restarts between ${n(c)} and ${n(d)} seconds.`,
  answer: [h, P],
  hints: [`The density curve is a flat rectangle over the range from ${n(a)} to ${n(b)} seconds, with a total area of 1. Divide 1 by the width of the range to get the height.`, `The probability is the area of the strip from ${n(c)} to ${n(d)}: its width times the height.`],
  solution: `The range is ${n(b)} − ${n(a)} = ${n(w)} seconds wide, so the height is 1 ÷ ${n(w)} = ${n(h)}. The strip from ${n(c)} to ${n(d)} is ${n(d)} − ${n(c)} = ${n(s)} seconds wide, so P(${n(c)} < X < ${n(d)}) = ${n(s)} × ${n(h)} = ${n(P)}.`,
  guidance: [
   { prompt: `How wide is the range of restart times, ${n(b)} − ${n(a)}, and what height gives the rectangle over it an area of 1?`, answer: [w, h], explanation: `${n(b)} − ${n(a)} = ${n(w)} seconds, and ${n(w)} × height = 1 gives a height of 1 ÷ ${n(w)} = ${n(h)}.` },
   { prompt: `How wide is the strip from ${n(c)} to ${n(d)}, and what is its area?`, answer: [s, P], explanation: `${n(d)} − ${n(c)} = ${n(s)} seconds, and ${n(s)} × ${n(h)} = ${n(P)}. That area is the probability.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'The operator steps away',
 brief: 'The operator must leave the desk for part of her shift, and Mira wants to know how many of the mast’s daily check messages will arrive while nobody is there.',
 labels: ['P(arrives while away)', 'P(arrives while at the desk)', 'expected messages heard'], tolerance: 0.00005,
 gl: [['range width', 'strip width'], ['P(arrives while away)'], ['P(arrives while at the desk)', 'expected messages heard']]
}, {
 canonical: { a: 5, b: 25, c: 9, d: 14, N: 20 },
 draw: R => { const w = R.pick(WIDTHS.filter(x => x >= 8)), a = R.int(0, 20), c = R.int(a + 1, a + w - 3); return { a, b: a + w, c, d: R.int(c + 2, a + w - 1), N: R.pick([10, 20, 40, 50]) }; },
 build: ({ a, b, c, d, N }) => { const w = b - a, s = d - c, away = G.tidy(s / w), desk = G.tidy(1 - away), heard = G.tidy(N * desk); return {
  prompt: `The mast sends a daily check message that reaches the radio room at a random moment between ${n(a)} and ${n(b)} minutes after the shift starts, every moment in that range equally likely. The operator is away from the desk from ${n(c)} to ${n(d)} minutes after the shift starts. Enter the probability that the message arrives while she is away, then the probability that it arrives while she is at the desk, then the number of the next ${n(N)} daily messages you expect to arrive while she is at the desk.`,
  answer: [away, desk, heard],
  hints: ['The density curve is flat, so the chance of a time range is its width divided by the width of the whole window. Use the strip from the start to the end of her absence.', 'Being at the desk is the opposite of being away, so take the chance of being away from 1. To expect a count, multiply the chance by the number of messages.'],
  solution: `The window is ${n(b)} − ${n(a)} = ${n(w)} minutes wide, so the height is 1 ÷ ${n(w)} = ${n(G.tidy(1 / w))}. Her absence is ${n(d)} − ${n(c)} = ${n(s)} minutes wide, so P(away) = ${n(s)} × ${n(G.tidy(1 / w))} = ${n(away)}. She is at the desk otherwise: 1 − ${n(away)} = ${n(desk)}. Out of ${n(N)} messages you expect ${n(N)} × ${n(desk)} = ${n(heard)} to arrive while she is there.`,
  guidance: [
   { prompt: `How wide is the whole window, ${n(b)} − ${n(a)}, and how wide is her absence, ${n(d)} − ${n(c)}?`, answer: [w, s], explanation: `${n(b)} − ${n(a)} = ${n(w)} minutes, and ${n(d)} − ${n(c)} = ${n(s)} minutes.` },
   { prompt: `The density height is 1 ÷ ${n(w)}. What is the area of the strip for her absence, P(away)?`, answer: [away], explanation: `${n(s)} × ${n(G.tidy(1 / w))} = ${n(away)}.` },
   { prompt: `What is the probability that the message arrives while she is at the desk, and how many of ${n(N)} messages do you expect to arrive then?`, answer: [desk, heard], explanation: `1 − ${n(away)} = ${n(desk)}, and ${n(N)} × ${n(desk)} = ${n(heard)}.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', title: 'Two overlapping listening windows',
 brief: 'Two operators cover overlapping stretches of the same hour, and Mira wants the chance that a buoy signal lands in at least one of their windows.',
 uses: 'q06',
 labels: ['P(A)', 'P(B)', 'P(A and B)', 'P(A or B)'], tolerance: 0.00005,
 gl: [['P(A)', 'P(B)'], ['overlap width', 'P(A and B)'], ['P(A or B)']]
}, {
 canonical: { a: 0, b: 40, u: [4, 12, 25, 34] },
 draw: R => { const w = R.pick([16, 20, 25, 40]), a = R.int(0, 20); const set = new Set(); while (set.size < 4) set.add(R.int(1, w - 1));
  return { a, b: a + w, u: Array.from(set).sort((x, y) => x - y) }; },
 build: ({ a, b, u }) => { const w = b - a, c1 = a + u[0], c2 = a + u[1], d1 = a + u[2], d2 = a + u[3], h = G.tidy(1 / w),
  PA = G.tidy((d1 - c1) / w), PB = G.tidy((d2 - c2) / w), PAB = G.tidy((d1 - c2) / w), POR = G.tidy(PA + PB - PAB); return {
  prompt: `A relay buoy’s signal reaches the radio room at a random moment between ${n(a)} and ${n(b)} minutes past the hour, every moment in that range equally likely. Let X be the arrival time. Operator A listens from ${n(c1)} to ${n(d1)} minutes past, and operator B from ${n(c2)} to ${n(d2)} minutes past, so their windows overlap. Let A be the event that the signal arrives in A’s window, and B the event that it arrives in B’s window. Enter P(A), P(B), P(A and B) and P(A or B).`,
  answer: [PA, PB, PAB, POR],
  hints: ['Each window is a strip under the flat density curve: its probability is its width divided by the width of the whole range.', 'A and B both happen when the signal lands in the part where the two windows overlap. Then use the addition rule: P(A or B) = P(A) + P(B) − P(A and B).'],
  solution: `The range is ${n(w)} minutes wide, so the height is 1 ÷ ${n(w)} = ${n(h)}. Window A is ${n(d1)} − ${n(c1)} = ${n(d1 - c1)} minutes wide, so P(A) = ${n(PA)}, and window B is ${n(d2)} − ${n(c2)} = ${n(d2 - c2)} minutes wide, so P(B) = ${n(PB)}. The windows overlap from ${n(c2)} to ${n(d1)}, ${many(d1 - c2, 'minute', 'minutes')}, so P(A and B) = ${n(PAB)}. By the addition rule P(A or B) = ${n(PA)} + ${n(PB)} − ${n(PAB)} = ${n(POR)}.`,
  guidance: [
   { prompt: `What is P(A), the area of the strip from ${n(c1)} to ${n(d1)}, and P(B), the area of the strip from ${n(c2)} to ${n(d2)}? The height is 1 ÷ ${n(w)} = ${n(h)}.`, answer: [PA, PB], explanation: `A: ${n(d1)} − ${n(c1)} = ${n(d1 - c1)} minutes, ${n(d1 - c1)} × ${n(h)} = ${n(PA)}. B: ${n(d2)} − ${n(c2)} = ${n(d2 - c2)} minutes, ${n(d2 - c2)} × ${n(h)} = ${n(PB)}.` },
   { prompt: `The windows overlap from ${n(c2)} to ${n(d1)}. How wide is the overlap, and what is P(A and B)?`, answer: [d1 - c2, PAB], explanation: `${n(d1)} − ${n(c2)} = ${many(d1 - c2, 'minute', 'minutes')}, and ${n(d1 - c2)} × ${n(h)} = ${n(PAB)}.` },
   { prompt: 'Use the addition rule: P(A or B) = P(A) + P(B) − P(A and B). What is it?', answer: [POR], explanation: `${n(PA)} + ${n(PB)} − ${n(PAB)} = ${n(POR)}. Taking the overlap away once stops its area being counted twice.` }
  ] }; }
});

})();
