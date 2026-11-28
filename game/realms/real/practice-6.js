/* Real analysis practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p6.js. */
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
/* Retry a draw at most 1000 times, then fall back to the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const SUPD = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(d => SUPD[d]).join('');
/* "x³ + 2x − 5": terms [coefficient, variable text]; a zero term is dropped and a coefficient 1 is not written. */
const poly = terms => { const out = [];
 for (const [v, x] of terms) { if (!v) continue; const a = Math.abs(v), body = x ? `${a === 1 ? '' : n(a)}${x}` : n(a);
  out.push(out.length ? `${v < 0 ? '−' : '+'} ${body}` : `${v < 0 ? '−' : ''}${body}`); }
 return out.length ? out.join(' ') : '0'; };
/* " + 3" / " − 3" to follow another term; '' for 0. */
const tail = v => v ? ` ${v < 0 ? '−' : '+'} ${n(Math.abs(v))}` : '';
/* "1 litre", "2.5 litres". */
const pl = (v, one, many) => `${n(v)} ${n(v) === '1' ? one : many}`;
/* A decimal answer without floating-point dust. */
const rd = x => Math.round(x * 1e6) / 1e6;
/* "x + 2", "x − 2". */
const xp = v => `x ${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;

/* ---- Lagrange remainder helpers (q27, q29) ----
   The bound for f(x) = eˣ, sin x or cos x about 0 is M·xᵏ ÷ k! with k = n + 1: M = 3 for eˣ at x = 1 (e < 3), M = 8 for eˣ at
   x = 2 (e² < 8), M = 1 for sin and cos. A converter that outputs K times f has K times the bound. "inv" is 1 ÷ ε, a whole number,
   so "K·M·xᵏ ÷ k! < ε" is the whole-number test k! > K·M·xᵏ·inv. */
const FN = { exp: 'eˣ', sin: 'sin x', cos: 'cos x' };
const tay = ({ fn, x, K, inv, n0 }) => { const M = fn === 'exp' ? (x === 1 ? 3 : 8) : 1, c = K * M;
 let N = 0; while (!(fact(N + 1) > c * Math.pow(x, N + 1) * inv)) N++;
 const k0 = n0 + 1, raw0 = c * Math.pow(x, k0), den0 = fact(k0), g0 = gcd(raw0, den0);
 const kN = N + 1, rawN = c * Math.pow(x, kN), denN = fact(kN), gN = gcd(rawN, denN);
 return { M, c, N, k0, raw0, den0, num0: raw0 / g0, dn0: den0 / g0, g0, kN, rawN, denN, numN: rawN / gN, dnN: denN / gN, gN,
  before: c * Math.pow(x, N) * inv, factBefore: fact(N), at: c * Math.pow(x, N + 1) * inv, factAt: fact(N + 1) }; };
/* The bound for f itself, as text. */
const bnd = (fn, x) => fn === 'exp' ? (x === 1 ? '3 ÷ (n + 1)!' : '8 × 2ⁿ⁺¹ ÷ (n + 1)!') : (x === 1 ? '1 ÷ (n + 1)!' : `${n(x)}ⁿ⁺¹ ÷ (n + 1)!`);
/* The sentence that states the derivative bound and the error bound in the prompt. */
const setup = (fn, x) => fn === 'exp'
 ? `Every derivative of eˣ is eˣ, and eᶜ < ${x === 1 ? '3' : '8 (because e² is less than 8)'} for every c between 0 and ${n(x)}, so the error at x = ${n(x)} is at most ${bnd(fn, x)}`
 : `Every derivative of ${FN[fn]} is ±sin x or ±cos x, which is never bigger than 1 in size, so the error at x = ${n(x)} is at most ${bnd(fn, x)}`;
/* The working for the smallest degree. lim: the text of the number the bound must be below. */
const degWork = (t, x, inv, lim) => `The bound is below ${lim} exactly when (n + 1)! is bigger than ${x !== 1 ? `${t.c === 1 ? '' : n(t.c) + ' × '}${n(x)}ⁿ⁺¹ × ${n(inv)}` : t.c === 1 ? n(inv) : `${n(t.c)} × ${n(inv)} = ${n(t.c * inv)}`}. For degree ${n(t.N - 1)}: ${n(t.N)}! = ${n(t.factBefore)}, which is not bigger than ${n(t.before)}. For degree ${n(t.N)}: ${n(t.N + 1)}! = ${n(t.factAt)}, which is bigger than ${n(t.at)}. So the smallest degree is ${n(t.N)}.`;
/* The top of the bound as text: scale × M × xᵏ, leaving out factors equal to 1. */
const topTxt = (t, K, x, k) => { const parts = [K !== 1 ? n(K) : null, t.M !== 1 ? n(t.M) : null, x !== 1 ? `${n(x)}${sup(k)}` : null].filter(Boolean); return parts.length ? parts.join(' × ') : '1'; };
const EPS = [0.01, 0.005, 0.001, 0.0005, 0.0001];

/* ---- q26 Bounds from the mean value theorem [4.2] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'A tank that cannot change fast',
 brief: 'A coolant tank is being topped up while its pump is tuned, and the log needs a guaranteed window for the level.',
 labels: ['largest change (litres)', 'least level (litres)', 'most level (litres)'], tolerance: 0.01,
 gl: [['largest change (litres)'], ['least level (litres)'], ['most level (litres)']]
}, {
 /* |L′| ≤ M tenths of a litre per minute on [a, b], L(a) = r0. Not the parent's worked example (r0 = 40, 0.5 per hour, 0 to 6). */
 canonical: { M: 6, a: 3, b: 8, r0: 50 },
 draw: R => retry(() => { const a = R.int(0, 4); return { M: R.int(2, 25), a, b: a + R.int(2, 9), r0: R.int(20, 80) }; },
  p => p.r0 * 10 - p.M * (p.b - p.a) > 0 && !(p.M === 5 && p.a === 0 && p.b === 6 && p.r0 === 40), { M: 6, a: 3, b: 8, r0: 50 }),
 build: ({ M, a, b, r0 }) => { const m = M / 10, len = b - a, X = M * len / 10, lo = rd(r0 - X), hi = rd(r0 + X); return {
  prompt: `A coolant tank is filling and draining while its pump is tuned. Between minute ${n(a)} and minute ${n(b)} its level L(t), in litres, is a differentiable function of the time t in minutes, and the level never changes faster than ${pl(m, 'litre', 'litres')} per minute in either direction: |L′(t)| ≤ ${n(m)}. At minute ${n(a)} the tank holds ${n(r0)} litres. Enter the largest possible change |L(${n(b)}) − L(${n(a)})|, then the least and the most the tank could hold at minute ${n(b)}.`,
  answer: [X, lo, hi],
  hints: ['The mean value theorem says the change in level equals L′(c) times the length of the time interval, for some c in between. Bound |L′(c)| by the limit on the rate.', 'The level can fall or rise by at most that largest change, starting from the level at the first minute.'],
  solution: `The interval from minute ${n(a)} to minute ${n(b)} is ${n(len)} minutes long. By the mean value theorem, L(${n(b)}) − L(${n(a)}) = L′(c) × ${n(len)} for some c between ${n(a)} and ${n(b)}, and |L′(c)| ≤ ${n(m)}, so |L(${n(b)}) − L(${n(a)})| ≤ ${n(m)} × ${n(len)} = ${pl(X, 'litre', 'litres')}. A level that rises (or falls) at exactly ${n(m)} per minute reaches that change, so no smaller bound is safe. At minute ${n(b)} the level lies between ${n(r0)} − ${n(X)} = ${n(lo)} and ${n(r0)} + ${n(X)} = ${pl(hi, 'litre', 'litres')}.`,
  guidance: [
   { prompt: `The time interval is ${n(b)} − ${n(a)} = ${n(len)} minutes long and |L′| ≤ ${n(m)}. What is the largest possible change |L(${n(b)}) − L(${n(a)})|?`, answer: [X], explanation: `|L(${n(b)}) − L(${n(a)})| = |L′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)}.` },
   { prompt: `The tank started at ${n(r0)} litres. What is the least it could hold at minute ${n(b)}?`, answer: [lo], explanation: `It can fall by at most ${n(X)}: ${n(r0)} − ${n(X)} = ${n(lo)}.` },
   { prompt: `And the most it could hold at minute ${n(b)}?`, answer: [hi], explanation: `It can rise by at most ${n(X)}: ${n(r0)} + ${n(X)} = ${n(hi)}.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Before the safety valve opens',
 brief: 'A sensor housing has a safety valve that opens at a set pressure, and Mira needs to know how long the sensor is certain to stay below it.',
 labels: ['largest change (kPa)', 'highest reading (kPa)', 'latest safe time (hours)'], tolerance: 0.01,
 gl: [['largest change (kPa)'], ['highest reading (kPa)'], ['latest safe time (hours)']]
}, {
 /* |f′| ≤ M tenths on [a, b]. The limit is r0 + M·T/10 with 1 ≤ T < len, so the latest time up to which every such gauge is
    guaranteed not to pass the limit is a + T (the gauge climbing at exactly the limit rate reaches it then); a + T lies inside the window. */
 canonical: { M: 4, a: 1, len: 7, r0: 42, T: 3 },
 draw: R => { const a = R.int(0, 4), len = R.int(3, 9); return { M: R.int(2, 25), a, len, r0: R.int(20, 80), T: R.int(1, len - 1) }; },
 build: ({ M, a, len, r0, T }) => { const b = a + len, m = M / 10, X = M * len / 10, hi = rd(r0 + X), gap = M * T / 10, lim = rd(r0 + gap), tS = a + T; return {
  prompt: `A sensor housing has a safety valve that opens if the pressure ever passes ${n(lim)} kilopascals. While the sensor warms up, from t = ${n(a)} to t = ${n(b)} hours, its reading f(t) is a differentiable function of the time t, and the drift limit |f′(t)| ≤ ${n(m)} kilopascals per hour holds. At t = ${n(a)} the sensor reads ${n(r0)}. Enter the largest possible change |f(${n(b)}) − f(${n(a)})|, then the highest reading the sensor could show at t = ${n(b)}. Then enter the latest time t, in hours, up to which every sensor that obeys the drift limit is certain not to have passed ${n(lim)} kilopascals; for a later time, some sensor that obeys the limit could have passed it.`,
  answer: [X, hi, tS],
  hints: ['The mean value theorem writes the change as f′(c) times the length of the time interval, so the largest change is the drift limit times the length.', 'The reading cannot pass the valve level before the biggest possible climb, at the drift limit, has used up the room between the start reading and that level. Divide the room by the drift limit to get the time, and add it to the start time.'],
  solution: `By the mean value theorem, |f(${n(b)}) − f(${n(a)})| = |f′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)} kilopascals, so the highest reading at t = ${n(b)} is ${n(r0)} + ${n(X)} = ${n(hi)}. The same argument on the interval from ${n(a)} to any later time t gives f(t) ≤ ${n(r0)} + ${n(m)}(t − ${n(a)}). That is at most ${n(lim)} exactly when t − ${n(a)} ≤ (${n(lim)} − ${n(r0)}) ÷ ${n(m)} = ${n(gap)} ÷ ${n(m)} = ${n(T)}, that is when t ≤ ${n(tS)}. At t = ${n(tS)} the sensor that climbs at exactly ${n(m)} per hour reaches ${n(lim)}, and after it, it passes it. So the latest certain-safe time is t = ${n(tS)}.`,
  guidance: [
   { prompt: `The window is ${n(b)} − ${n(a)} = ${n(len)} hours long and |f′| ≤ ${n(m)}. What is the largest possible change |f(${n(b)}) − f(${n(a)})|?`, answer: [X], explanation: `${n(m)} × ${n(len)} = ${n(X)}.` },
   { prompt: `The sensor started at ${n(r0)}. What is the highest reading it could show at t = ${n(b)}?`, answer: [hi], explanation: `${n(r0)} + ${n(X)} = ${n(hi)}.` },
   { prompt: `The valve level is ${n(lim)}, which is ${n(gap)} above the start reading, and the reading can climb by at most ${n(m)} per hour. After how many hours from t = ${n(a)} could it first reach the valve level? Enter the time t at which that happens.`, answer: [tS], explanation: `${n(gap)} ÷ ${n(m)} = ${pl(T, 'hour', 'hours')} after t = ${n(a)}, which is t = ${n(tS)}. Up to then, every sensor obeying the limit is certain to be at or below the valve level.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q04', title: 'Two sensors on one bracket',
 brief: 'Two sensors share one bracket and the workshop reads only their total, so the certificate needs a window for the sum.',
 labels: ['largest change in the total (kPa)', 'lowest total (kPa)', 'highest total (kPa)'], tolerance: 0.01,
 gl: [['bound on |h′| (kPa per hour)'], ['largest change in the total (kPa)'], ['lowest total (kPa)']]
}, {
 /* h = f + g, |f′| ≤ M1/10, |g′| ≤ M2/10: |h′| ≤ (M1 + M2)/10 by the triangle inequality, and the bound is reached when both drift
    the same way at their limits. */
 canonical: { M1: 3, M2: 5, a: 0, len: 6, r0: 90 },
 draw: R => retry(() => ({ M1: R.int(2, 15), M2: R.int(2, 15), a: R.int(0, 4), len: R.int(2, 9), r0: R.int(40, 120) }),
  p => p.r0 * 10 - (p.M1 + p.M2) * p.len > 0, { M1: 3, M2: 5, a: 0, len: 6, r0: 90 }),
 build: ({ M1, M2, a, len, r0 }) => { const b = a + len, m1 = M1 / 10, m2 = M2 / 10, mt = rd(m1 + m2), X = (M1 + M2) * len / 10, lo = rd(r0 - X), hi = rd(r0 + X); return {
  prompt: `Two pressure sensors share one bracket, and the workshop only reads their total h(t) = f(t) + g(t), in kilopascals. Both f and g are differentiable from t = ${n(a)} to t = ${n(b)} hours, with |f′(t)| ≤ ${n(m1)} and |g′(t)| ≤ ${n(m2)} kilopascals per hour. The derivative of a sum is the sum of the derivatives, h′ = f′ + g′, and the triangle inequality says |x + y| ≤ |x| + |y|. Each sensor can drift at its own limit, in the same direction at the same time. At t = ${n(a)} the total reads ${n(r0)}. Enter the largest possible change |h(${n(b)}) − h(${n(a)})|, then the lowest and the highest totals the bracket could show at t = ${n(b)}.`,
  answer: [X, lo, hi],
  hints: ['The triangle inequality bounds |f′(t) + g′(t)| by the sum of the two limits. That is a drift limit for the total, h.', 'Apply the mean value theorem to h with that limit: the largest change is the limit times the length of the interval. Then add it to and subtract it from the starting total.'],
  solution: `h′ = f′ + g′, so by the triangle inequality |h′(t)| ≤ |f′(t)| + |g′(t)| ≤ ${n(m1)} + ${n(m2)} = ${n(mt)}. The interval is ${n(b)} − ${n(a)} = ${n(len)} hours long, so by the mean value theorem |h(${n(b)}) − h(${n(a)})| ≤ ${n(mt)} × ${n(len)} = ${n(X)} kilopascals, and the two sensors drifting together at their limits reach it, so no smaller bound is safe. At t = ${n(b)} the total lies between ${n(r0)} − ${n(X)} = ${n(lo)} and ${n(r0)} + ${n(X)} = ${n(hi)}.`,
  guidance: [
   { prompt: `By the triangle inequality, |h′| = |f′ + g′| is at most |f′| + |g′|. With |f′| ≤ ${n(m1)} and |g′| ≤ ${n(m2)}, what drift limit does h have?`, answer: [mt], explanation: `${n(m1)} + ${n(m2)} = ${n(mt)} kilopascals per hour.` },
   { prompt: `The interval is ${n(len)} hours long and |h′| ≤ ${n(mt)}. What is the largest possible change |h(${n(b)}) − h(${n(a)})|?`, answer: [X], explanation: `${n(mt)} × ${n(len)} = ${n(X)}, by the mean value theorem.` },
   { prompt: `The total started at ${n(r0)}. What is the lowest total it could show at t = ${n(b)}?`, answer: [lo], explanation: `${n(r0)} − ${n(X)} = ${n(lo)}. (The highest is ${n(r0)} + ${n(X)} = ${n(hi)}.)` }
  ] }; }
});

/* ---- q27 Taylor's theorem with remainder [4.3] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The tone filter certificate',
 brief: 'A relay tone filter uses a short polynomial in place of a wave function, and its certificate must state the worst error and the degree needed.',
 labels: ['numerator', 'denominator', 'smallest degree'], tolerance: 0.01,
 gl: [['numerator'], ['denominator'], ['smallest degree']]
}, {
 /* Not the parent's worked example (sin x at x = 1, degree 3, ε = 0.01). */
 canonical: { fn: 'cos', x: 2, n0: 5, e: 0.001 },
 draw: R => retry(() => { const fn = R.pick(['exp', 'sin', 'cos']); return { fn, x: fn === 'exp' ? 1 : R.pick([1, 2]), n0: R.int(3, 6), e: R.pick(EPS) }; },
  p => !(p.fn === 'sin' && p.x === 1 && p.n0 === 3 && p.e === 0.01), { fn: 'cos', x: 2, n0: 5, e: 0.001 }),
 build: ({ fn, x, n0, e }) => { const inv = Math.round(1 / e), t = tay({ fn, x, K: 1, inv, n0 }), k = n0 + 1; return {
  prompt: `A relay’s tone filter uses the Taylor polynomial of degree n about 0 in place of ${FN[fn]} when x = ${n(x)}, and its certificate must state the worst error it can make. Taylor’s theorem gives that error as f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x (the Lagrange form of the remainder). ${setup(fn, x)}. Enter this bound for degree ${n(n0)} as a fraction in lowest terms, numerator then denominator (type them without commas), then the smallest degree n for which the bound is below ${n(e)}.`,
  answer: [t.num0, t.dn0, t.N],
  hints: ['The bound for degree n has (n + 1)! underneath and the power n + 1 of x on top (times the constant M that bounds the derivatives). Cancel common factors to reach lowest terms.', 'The bound shrinks as the degree grows. Try degrees one after another until it first drops below ε.'],
  solution: `For degree ${n(n0)}, k = n + 1 = ${n(k)}, so the bound is ${topTxt(t, 1, x, k)} ÷ ${n(k)}! = ${n(t.raw0)} ÷ ${n(t.den0)} = ${n(t.num0)}/${n(t.dn0)} in lowest terms. ${degWork(t, x, inv, n(e))}`,
  guidance: [
   { prompt: `For degree ${n(n0)} the bound is ${n(t.raw0)} ÷ ${n(k)}!, and ${n(k)}! = ${n(t.den0)}. In lowest terms, what is the numerator?`, answer: [t.num0], explanation: `${n(t.raw0)} and ${n(t.den0)} have highest common factor ${n(t.g0)}, so ${n(t.raw0)} ÷ ${n(t.den0)} = ${n(t.num0)}/${n(t.dn0)}.` },
   { prompt: 'And the denominator in lowest terms?', answer: [t.dn0], explanation: `${n(t.den0)} ÷ ${n(t.g0)} = ${n(t.dn0)}.` },
   { prompt: `What is the smallest degree n whose bound is below ${n(e)}?`, answer: [t.N], explanation: degWork(t, x, inv, n(e)) }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'A scaled converter and its error',
 brief: 'A pressure converter multiplies a wave function by a scale, and the certificate must show the degree it needs and the error it then leaves.',
 labels: ['smallest degree', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['smallest degree'], ['numerator'], ['denominator']]
}, {
 /* Output V = K·f(x); the error of V is K times the error of f. Both the numerator and the denominator of the bound at the smallest
    degree stay below 100000. */
 canonical: { fn: 'sin', x: 2, K: 3, e: 0.01 },
 draw: R => retry(() => { const fn = R.pick(['exp', 'sin', 'cos']); return { fn, x: fn === 'exp' ? 1 : R.pick([1, 2]), K: R.pick([2, 3, 4, 5, 6, 8, 10]), e: R.pick([0.01, 0.005, 0.001, 0.0005]) }; },
  p => { const t = tay({ ...p, inv: Math.round(1 / p.e), n0: 3 }); return t.N >= 3 && t.dnN <= 1e5 && t.numN <= 1e5; }, { fn: 'sin', x: 2, K: 3, e: 0.01 }),
 build: ({ fn, x, K, e }) => { const inv = Math.round(1 / e), t = tay({ fn, x, K, inv, n0: 3 }); return {
  prompt: `The workshop’s pressure converter outputs V = ${n(K)} × ${FN[fn]} volts at x = ${n(x)}, and replaces ${FN[fn]} by its Taylor polynomial of degree n about 0. By Taylor’s theorem the error in ${FN[fn]} is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. ${setup(fn, x)}. The polynomial for V is ${n(K)} times the polynomial for ${FN[fn]}, so the error in V is ${n(K)} times as big, at most ${n(K)} × (${bnd(fn, x)}). Mira needs the error in V below ${n(e)} volts. Enter the smallest degree n for which that bound is below ${n(e)}, then the bound at that degree as a fraction in lowest terms, numerator then denominator (type them without commas).`,
  answer: [t.N, t.numN, t.dnN],
  hints: ['The error bound for V is the scale times the bound for the function itself. It is below ε exactly when (n + 1)! is bigger than the top of the bound (scale, constant M and the power of x) divided by ε. Try degrees in turn.', 'At the degree you found, put the top of the bound over (n + 1)! and cancel the common factors to reach lowest terms.'],
  solution: `${degWork(t, x, inv, n(e))} At degree ${n(t.N)}, k = ${n(t.kN)} and the bound is ${topTxt(t, K, x, t.kN)} ÷ ${n(t.kN)}! = ${n(t.rawN)} ÷ ${n(t.denN)} = ${n(t.numN)}/${n(t.dnN)} in lowest terms.`,
  guidance: [
   { prompt: `The error bound for V is below ${n(e)} exactly when ${n(t.c)}${x === 1 ? '' : ` × ${n(x)}ⁿ⁺¹`} ÷ (n + 1)! < ${n(e)}, that is when (n + 1)! is bigger than ${x === 1 ? n(t.c * inv) : `${n(t.c * inv)} × ${n(x)}ⁿ⁺¹`}. What is the smallest degree n that works?`, answer: [t.N], explanation: degWork(t, x, inv, n(e)) },
   { prompt: `At degree ${n(t.N)} the bound is ${n(t.rawN)} ÷ ${n(t.kN)}!, and ${n(t.kN)}! = ${n(t.denN)}. In lowest terms, what is the numerator?`, answer: [t.numN], explanation: `${n(t.rawN)} and ${n(t.denN)} have highest common factor ${n(t.gN)}, so the fraction is ${n(t.numN)}/${n(t.dnN)}.` },
   { prompt: 'And the denominator in lowest terms?', answer: [t.dnN], explanation: `${n(t.denN)} ÷ ${n(t.gN)} = ${n(t.dnN)}.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', title: 'A converter that must be almost exact',
 brief: 'The deepest converter in the workshop works far from its centre and must be certified to a very small error.',
 labels: ['numerator', 'denominator', 'smallest degree'], tolerance: 0.01,
 gl: [['numerator'], ['denominator'], ['smallest degree']]
}, {
 /* Harder: eˣ at x = 2 (M = 8) or sin x, cos x at x = 3, and ε = 1 ÷ inv from 1/10000 to 1/1000000 (n() would print 0 for the small ones,
    so ε is written as a quotient). Every product is below 2⁵³, and the fraction's numerator and denominator stay below 100000. */
 canonical: { fn: 'exp', x: 2, n0: 6, inv: 100000 },
 draw: R => retry(() => { const fn = R.pick(['exp', 'sin', 'cos']); return { fn, x: fn === 'exp' ? 2 : 3, n0: R.int(5, 9), inv: R.pick([10000, 20000, 50000, 100000, 1000000]) }; },
  p => { const t = tay({ ...p, K: 1 }); return t.dn0 <= 1e5 && t.num0 <= 1e5; }, { fn: 'exp', x: 2, n0: 6, inv: 100000 }),
 build: ({ fn, x, n0, inv }) => { const t = tay({ fn, x, K: 1, inv, n0 }), k = n0 + 1, lim = `1 ÷ ${n(inv)}`; return {
  prompt: `The deepest converter in the workshop approximates ${FN[fn]} at x = ${n(x)}, a long way from the centre 0 of its Taylor polynomial of degree n. By Taylor’s theorem the error is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. ${setup(fn, x)}. Enter this bound for degree ${n(n0)} as a fraction in lowest terms, numerator then denominator (type them without commas), then the smallest degree n for which the bound is below ${lim}.`,
  answer: [t.num0, t.dn0, t.N],
  hints: ['For degree n the bound has (n + 1)! underneath. On top is the constant M that bounds the derivatives times the power n + 1 of x. Cancel common factors to reach lowest terms.', 'The bound is below 1 ÷ N exactly when (n + 1)! is bigger than the top of the bound times N. Try degrees one after another until that first holds, and compare the two numbers carefully.'],
  solution: `For degree ${n(n0)}, k = n + 1 = ${n(k)}, so the bound is ${topTxt(t, 1, x, k)} ÷ ${n(k)}! = ${n(t.raw0)} ÷ ${n(t.den0)} = ${n(t.num0)}/${n(t.dn0)} in lowest terms. ${degWork(t, x, inv, lim)}`,
  guidance: [
   { prompt: `For degree ${n(n0)} the bound is ${n(t.raw0)} ÷ ${n(k)}!, and ${n(k)}! = ${n(t.den0)}. In lowest terms, what is the numerator?`, answer: [t.num0], explanation: `${n(t.raw0)} and ${n(t.den0)} have highest common factor ${n(t.g0)}, so ${n(t.raw0)} ÷ ${n(t.den0)} = ${n(t.num0)}/${n(t.dn0)}.` },
   { prompt: 'And the denominator in lowest terms?', answer: [t.dn0], explanation: `${n(t.den0)} ÷ ${n(t.g0)} = ${n(t.dn0)}.` },
   { prompt: `What is the smallest degree n whose bound is below ${lim}?`, answer: [t.N], explanation: degWork(t, x, inv, lim) }
  ] }; }
});

/* ---- q28 The derivative of an inverse function [4.4] ---- */

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'From flow back to valve turns',
 brief: 'A flow meter reports flow for each valve setting, and the operator needs to know the setting behind a reading and how sensitive it is.',
 labels: ['x₀', 'f′(x₀)', '(f⁻¹)′(y)'], tolerance: 0.00005,
 gl: [['x₀'], ['f′(x₀)'], ['(f⁻¹)′(y)']]
}, {
 /* f(x) = kx³ + mx + c0 with k ≥ 2 and m ≥ 1, so f′ = 3kx² + m ≥ 1 is positive; x0 a whole number with f′(x0) ≥ 2. */
 canonical: { k: 2, m: 3, c0: -4, x0: 2 },
 draw: R => retry(() => ({ k: R.int(2, 4), m: R.int(1, 5), c0: R.int(-6, 6), x0: R.int(-3, 3) }), p => 3 * p.k * p.x0 * p.x0 + p.m >= 2, { k: 2, m: 3, c0: -4, x0: 2 }),
 build: ({ k, m, c0, x0 }) => { const y = k * x0 ** 3 + m * x0 + c0, D = 3 * k * x0 * x0 + m, fx = poly([[k, 'x³'], [m, 'x'], [c0, '']]), dfx = poly([[3 * k, 'x²'], [m, '']]); return {
  prompt: `A flow meter turns a valve setting x into a flow f(x) = ${fx}. Its derivative f′(x) = ${dfx} is positive for every x (it is at least ${n(m)}), so f is strictly increasing and has an inverse function f⁻¹ that turns a measured flow back into a valve setting. The meter reads the flow y = ${n(y)}, and the setting behind it is a whole number between −3 and 3. Enter x₀ = f⁻¹(${n(y)}), then f′(x₀), then the derivative (f⁻¹)′(${n(y)}), either as a fraction typed like 2/3 or as a decimal rounded to 5 decimal places.`,
  answer: [x0, D, 1 / D],
  hints: ['Try the whole numbers from −3 to 3 for x until f(x) equals the measured flow; that x is the setting f⁻¹ gives.', 'The inverse function theorem: (f⁻¹)′(f(x₀)) = 1 ÷ f′(x₀), provided f′(x₀) is not 0.'],
  solution: `f(${n(x0)}) = ${n(k)} × ${par(x0)}³ + ${n(m)} × ${par(x0)} ${c0 < 0 ? '−' : '+'} ${n(Math.abs(c0))} = ${poly([[k * x0 ** 3, ''], [m * x0, ''], [c0, '']])} = ${n(y)}, and f is strictly increasing, so no other x gives ${n(y)}: x₀ = ${n(x0)}. f′(${n(x0)}) = ${n(3 * k)} × ${par(x0)}² + ${n(m)} = ${n(D)}. By the inverse function theorem, (f⁻¹)′(${n(y)}) = 1 ÷ f′(${n(x0)}) = 1/${n(D)}.`,
  guidance: [
   { prompt: `Which whole number x₀ gives f(x₀) = ${n(y)}?`, answer: [x0], explanation: `f(${n(x0)}) = ${n(y)}. Since f is strictly increasing, it is the only one.` },
   { prompt: `What is f′(${n(x0)})?`, answer: [D], explanation: `f′(${n(x0)}) = ${n(3 * k)} × ${par(x0)}² + ${n(m)} = ${n(D)}.` },
   { prompt: `What is (f⁻¹)′(${n(y)}) = 1 ÷ f′(${n(x0)})? Enter it as a fraction, or as a decimal rounded to 5 decimal places.`, answer: [1 / D], explanation: `1 ÷ ${n(D)} = 1/${n(D)}.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'How wrong can the dial be?',
 brief: 'A gauge reading carries a small error, and the operator must know how far the dial position behind it could be off.',
 labels: ['x₀', 'f′(x₀)', 'dial shift'], tolerance: 0.00005,
 gl: [['x₀'], ['f′(x₀)'], ['dial shift']]
}, {
 /* f(x) = kx³ + mx + c0 as in q28b; the shift is (f⁻¹)′(y) × error = error ÷ D, kept to at most four decimals. */
 canonical: { k: 2, m: 2, c0: 3, x0: 1, E: 3 },
 draw: R => retry(() => ({ k: R.int(2, 4), m: R.int(1, 5), c0: R.int(-6, 6), x0: R.int(-3, 3), E: R.pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20]) }),
  p => { const D = 3 * p.k * p.x0 * p.x0 + p.m; return D >= 2 && (p.E * 10000) % D === 0; }, { k: 2, m: 2, c0: 3, x0: 1, E: 3 }),
 build: ({ k, m, c0, x0, E }) => { const y = k * x0 ** 3 + m * x0 + c0, D = 3 * k * x0 * x0 + m, sh = rd(E / D), fx = poly([[k, 'x³'], [m, 'x'], [c0, '']]), dfx = poly([[3 * k, 'x²'], [m, '']]); return {
  prompt: `A pressure gauge turns a dial setting x into a reading f(x) = ${fx} kilopascals. Its derivative f′(x) = ${dfx} is positive for every x (it is at least ${n(m)}), so f is strictly increasing and has an inverse function f⁻¹ that turns a reading into a dial setting. The gauge reads y = ${n(y)}, and the setting behind that reading is a whole number between −3 and 3. The reading may be wrong by a small amount Δy = ${n(E)} kilopascals; use the rule that a small change Δy in the reading moves the dial setting by about (f⁻¹)′(y) × Δy. Enter x₀ = f⁻¹(${n(y)}), then f′(x₀), then how far the dial setting moves for the change Δy = ${n(E)} (as a decimal, using that rule).`,
  answer: [x0, D, sh],
  hints: ['Try the whole numbers from −3 to 3 for x until f(x) equals the reading. Then the inverse function theorem gives (f⁻¹)′(f(x₀)) = 1 ÷ f′(x₀).', 'Multiply (f⁻¹)′(y), the reciprocal of f′(x₀), by the change Δy in the reading.'],
  solution: `f(${n(x0)}) = ${n(k)} × ${par(x0)}³ + ${n(m)} × ${par(x0)} ${c0 < 0 ? '−' : '+'} ${n(Math.abs(c0))} = ${poly([[k * x0 ** 3, ''], [m * x0, ''], [c0, '']])} = ${n(y)}, and f is strictly increasing, so x₀ = ${n(x0)}. f′(${n(x0)}) = ${n(3 * k)} × ${par(x0)}² + ${n(m)} = ${n(D)}, so (f⁻¹)′(${n(y)}) = 1/${n(D)}. The dial setting moves by about (1/${n(D)}) × ${n(E)} = ${n(sh)}.`,
  guidance: [
   { prompt: `Which whole number x₀ gives f(x₀) = ${n(y)}?`, answer: [x0], explanation: `f(${n(x0)}) = ${n(y)}. Since f is strictly increasing, it is the only one.` },
   { prompt: `What is f′(${n(x0)})?`, answer: [D], explanation: `f′(${n(x0)}) = ${n(3 * k)} × ${par(x0)}² + ${n(m)} = ${n(D)}.` },
   { prompt: `By the inverse function theorem (f⁻¹)′(${n(y)}) = 1/${n(D)}. About how far does the dial setting move when the reading changes by ${n(E)}?`, answer: [sh], explanation: `(1/${n(D)}) × ${n(E)} = ${n(sh)}.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', title: 'A dial that bends before it climbs',
 brief: 'The workshop’s newest gauge has a curved response with a quadratic term, and the reading must still be turned back into a dial position.',
 labels: ['x₀', 'f′(x₀)', '(f⁻¹)′(y)'], tolerance: 0.00005,
 gl: [['x₀'], ['f′(x₀)'], ['(f⁻¹)′(y)']]
}, {
 /* f(x) = x³ + 3px² + bx + c0 with p = ±1, ±2 and b = 3p² + j, j from 1 to 5, so f′ = 3(x + p)² + j ≥ j > 0 everywhere; x0 a whole number
    from −4 to 3 with f′(x0) ≥ 2. */
 canonical: { p: 1, j: 2, c0: -3, x0: -2 },
 draw: R => retry(() => ({ p: R.pick([-2, -1, 1, 2]), j: R.int(1, 5), c0: R.int(-6, 6), x0: R.int(-4, 3) }),
  p => 3 * (p.x0 + p.p) ** 2 + p.j >= 2, { p: 1, j: 2, c0: -3, x0: -2 }),
 build: ({ p, j, c0, x0 }) => { const b = 3 * p * p + j, y = x0 ** 3 + 3 * p * x0 * x0 + b * x0 + c0, D = 3 * (x0 + p) ** 2 + j;
  const fx = poly([[1, 'x³'], [3 * p, 'x²'], [b, 'x'], [c0, '']]), dfx = poly([[3, 'x²'], [6 * p, 'x'], [b, '']]); return {
  prompt: `The newest gauge in the workshop has a curved response: it turns a dial position x into a reading f(x) = ${fx}. Its derivative is f′(x) = ${dfx}, which can be written 3(${xp(p)})² + ${n(j)}. A square is never negative, so f′(x) is at least ${n(j)} for every x: f is strictly increasing and has an inverse function f⁻¹. The reading is y = ${n(y)}, and the dial position behind it is a whole number between −4 and 3. Enter x₀ = f⁻¹(${n(y)}), then f′(x₀), then the derivative (f⁻¹)′(${n(y)}), either as a fraction typed like 2/3 or as a decimal rounded to 5 decimal places.`,
  answer: [x0, D, 1 / D],
  hints: ['Try the whole numbers from −4 to 3 for x, taking care with the signs of the cubes and squares, until f(x) equals the reading.', 'The inverse function theorem: (f⁻¹)′(f(x₀)) = 1 ÷ f′(x₀). Use the form of f′ given in the problem to evaluate f′(x₀).'],
  solution: `f(${n(x0)}) = ${par(x0)}³ + 3 × ${par(p)} × ${par(x0)}² + ${n(b)} × ${par(x0)} ${c0 < 0 ? '−' : '+'} ${n(Math.abs(c0))} = ${poly([[x0 ** 3, ''], [3 * p * x0 * x0, ''], [b * x0, ''], [c0, '']])} = ${n(y)}, and f is strictly increasing, so no other x gives ${n(y)}: x₀ = ${n(x0)}. f′(${n(x0)}) = 3(${n(x0)} ${p < 0 ? '−' : '+'} ${n(Math.abs(p))})² + ${n(j)} = 3 × ${n((x0 + p) ** 2)} + ${n(j)} = ${n(D)}. By the inverse function theorem, (f⁻¹)′(${n(y)}) = 1 ÷ f′(${n(x0)}) = 1/${n(D)}.`,
  guidance: [
   { prompt: `Which whole number x₀ gives f(x₀) = ${n(y)}?`, answer: [x0], explanation: `f(${n(x0)}) = ${n(y)}. Since f is strictly increasing, it is the only one.` },
   { prompt: `What is f′(${n(x0)})?`, answer: [D], explanation: `f′(${n(x0)}) = 3(${n(x0)} ${p < 0 ? '−' : '+'} ${n(Math.abs(p))})² + ${n(j)} = 3 × ${n((x0 + p) ** 2)} + ${n(j)} = ${n(D)}.` },
   { prompt: `What is (f⁻¹)′(${n(y)}) = 1 ÷ f′(${n(x0)})? Enter it as a fraction, or as a decimal rounded to 5 decimal places.`, answer: [1 / D], explanation: `1 ÷ ${n(D)} = 1/${n(D)}.` }
  ] }; }
});

/* ---- q29 Chapter review: a drifting gauge [4.2, 4.3] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Certifying the relay amplifier',
 brief: 'The relay amplifier’s output drifts as it warms and its converter uses a polynomial, and Mira must sign off both.',
 labels: ['highest output (V)', 'smallest degree'], tolerance: 0.01,
 gl: [['largest change (V)'], ['highest output (V)'], ['smallest degree']]
}, {
 /* MVT part: M tenths of a volt per hour on [a, b], start r0: highest output r0 + M(b − a)/10. Taylor part: smallest degree for the
    bound at x. Not the parent's canonical parameters. */
 canonical: { M: 4, a: 1, len: 6, r0: 30, fn: 'exp', x: 1, e: 0.0005 },
 draw: R => retry(() => { const fn = R.pick(['exp', 'sin', 'cos']); return { M: R.int(2, 25), a: R.int(0, 4), len: R.int(2, 9), r0: R.int(10, 60), fn, x: fn === 'exp' ? 1 : R.pick([1, 2]), e: R.pick(EPS) }; },
  p => !(p.M === 3 && p.a === 0 && p.len === 8 && p.fn === 'sin' && p.x === 2 && p.e === 0.001), { M: 4, a: 1, len: 6, r0: 30, fn: 'exp', x: 1, e: 0.0005 }),
 build: ({ M, a, len, r0, fn, x, e }) => { const b = a + len, m = M / 10, X = M * len / 10, hi = rd(r0 + X), inv = Math.round(1 / e), t = tay({ fn, x, K: 1, inv, n0: 1 }); return {
  prompt: `Mira certifies the relay amplifier in two parts. First, from t = ${n(a)} to t = ${n(b)} hours its output f(t), in volts, is differentiable with |f′(t)| ≤ ${n(m)} volts per hour, and at t = ${n(a)} it reads ${n(r0)} volts: enter the highest output it could show at t = ${n(b)}. Second, its converter replaces ${FN[fn]} at x = ${n(x)} by the Taylor polynomial of degree n about 0. By Taylor’s theorem the error is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. ${setup(fn, x)}. Enter the smallest degree n that makes this bound less than ${n(e)}.`,
  answer: [hi, t.N],
  hints: ['The mean value theorem: the change is f′(c) times the length of the time interval, for some c in between. The highest output is the start reading plus the largest change.', 'The remainder bound shrinks as the degree grows; try degrees in turn until it first drops below ε.'],
  solution: `By the mean value theorem, |f(${n(b)}) − f(${n(a)})| = |f′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)} volts, and an output that rises at exactly ${n(m)} per hour reaches it, so the highest output at t = ${n(b)} is ${n(r0)} + ${n(X)} = ${n(hi)}. ${degWork(t, x, inv, n(e))}`,
  guidance: [
   { prompt: `The interval is ${n(len)} hours long and |f′| ≤ ${n(m)}. What is the largest possible change?`, answer: [X], explanation: `${n(m)} × ${n(len)} = ${n(X)}.` },
   { prompt: `The output started at ${n(r0)} volts. What is the highest it could show at t = ${n(b)}?`, answer: [hi], explanation: `${n(r0)} + ${n(X)} = ${n(hi)}.` },
   { prompt: `What is the smallest degree n whose remainder bound is below ${n(e)}?`, answer: [t.N], explanation: degWork(t, x, inv, n(e)) }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Sharing the error budget',
 brief: 'A certificate allows one total error for a reading, and the drift of the gauge uses part of it before the converter gets the rest.',
 labels: ['largest drift (kPa)', 'budget left (kPa)', 'smallest degree'], tolerance: 0.00001,
 gl: [['largest drift (kPa)'], ['budget left (kPa)'], ['smallest degree']]
}, {
 /* Budget B = X + ε, where X = M(b − a)/10 is the largest drift. The converter gets B − X = ε exactly. */
 canonical: { M: 6, a: 0, len: 5, fn: 'cos', x: 2, e: 0.0005 },
 draw: R => { const fn = R.pick(['exp', 'sin', 'cos']); return { M: R.int(2, 25), a: R.int(0, 4), len: R.int(2, 9), fn, x: fn === 'exp' ? 1 : R.pick([1, 2]), e: R.pick(EPS) }; },
 build: ({ M, a, len, fn, x, e }) => { const b = a + len, m = M / 10, X = M * len / 10, B = rd(X + e), inv = Math.round(1 / e), t = tay({ fn, x, K: 1, inv, n0: 1 }); return {
  prompt: `The workshop must certify a pressure reading to within a total error budget of ${n(B)} kilopascals. Two things spoil the reading, and for this certificate their worst cases simply add: the drift of the gauge and the error of its converter. The gauge reading f(t) is differentiable from t = ${n(a)} to t = ${n(b)} hours with |f′(t)| ≤ ${n(m)} kilopascals per hour, and the drift is the largest possible change |f(${n(b)}) − f(${n(a)})|. The converter replaces ${FN[fn]} at x = ${n(x)} by the Taylor polynomial of degree n about 0; by Taylor’s theorem the error is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. ${setup(fn, x)}. Enter the largest possible drift, then the budget left for the converter (the total budget minus the drift), then the smallest degree n whose bound is below that leftover budget.`,
  answer: [X, e, t.N],
  hints: ['The mean value theorem: the largest drift is the drift limit times the length of the time interval.', 'Subtract the drift from the total budget to see what the converter may use. The remainder bound shrinks as the degree grows; try degrees in turn until it first drops below that leftover.'],
  solution: `By the mean value theorem, |f(${n(b)}) − f(${n(a)})| = |f′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)} kilopascals, and a reading drifting at exactly ${n(m)} per hour reaches it. The converter may use ${n(B)} − ${n(X)} = ${n(e)} kilopascals. ${degWork(t, x, inv, n(e))}`,
  guidance: [
   { prompt: `The interval is ${n(len)} hours long and |f′| ≤ ${n(m)}. What is the largest possible drift?`, answer: [X], explanation: `${n(m)} × ${n(len)} = ${n(X)}.` },
   { prompt: `The total budget is ${n(B)} and the drift can use ${n(X)}. How much is left for the converter?`, answer: [e], explanation: `${n(B)} − ${n(X)} = ${n(e)}.` },
   { prompt: `What is the smallest degree n whose remainder bound is below ${n(e)}?`, answer: [t.N], explanation: degWork(t, x, inv, n(e)) }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', title: 'A long warm-up and a far-off point',
 brief: 'The longest warm-up in the workshop has a drift limit given to two decimals, and its converter works far from its centre.',
 labels: ['largest change (kPa)', 'smallest degree'], tolerance: 0.001,
 gl: [['largest change (kPa)'], ['smallest degree']]
}, {
 /* Harder: the drift limit to hundredths (M hundredths, not a multiple of 10), a long interval, and the harder Taylor cases of q27d
    (eˣ at x = 2, sin x or cos x at x = 3, ε = 1 ÷ inv). */
 canonical: { M: 35, a: 2, len: 12, fn: 'sin', x: 3, inv: 100000 },
 draw: R => retry(() => { const fn = R.pick(['exp', 'sin', 'cos']); return { M: R.int(5, 95), a: R.int(0, 6), len: R.int(8, 16), fn, x: fn === 'exp' ? 2 : 3, inv: R.pick([10000, 20000, 50000, 100000, 1000000]) }; },
  p => p.M % 10 !== 0, { M: 35, a: 2, len: 12, fn: 'sin', x: 3, inv: 100000 }),
 build: ({ M, a, len, fn, x, inv }) => { const b = a + len, m = M / 100, X = rd(M * len / 100), t = tay({ fn, x, K: 1, inv, n0: 1 }), lim = `1 ÷ ${n(inv)}`; return {
  prompt: `Mira signs off the longest warm-up in the workshop in two parts. First, from t = ${n(a)} to t = ${n(b)} hours a gauge reading f(t) is differentiable with |f′(t)| ≤ ${n(m)} kilopascals per hour: enter the largest possible change |f(${n(b)}) − f(${n(a)})|. Second, its converter replaces ${FN[fn]} at x = ${n(x)}, far from the centre 0, by the Taylor polynomial of degree n about 0. By Taylor’s theorem the error is the Lagrange form of the remainder, f⁽ⁿ⁺¹⁾(c) ÷ (n + 1)! × xⁿ⁺¹ for some c between 0 and x. ${setup(fn, x)}. Enter the smallest degree n that makes this bound less than ${lim}.`,
  answer: [X, t.N],
  hints: ['The mean value theorem: the change is f′(c) times the length of the time interval, so the largest change is the drift limit times the length.', 'The bound is below 1 ÷ N exactly when (n + 1)! is bigger than the top of the bound times N. Try degrees in turn until that first holds, and compare the two numbers carefully.'],
  solution: `By the mean value theorem, |f(${n(b)}) − f(${n(a)})| = |f′(c)| × ${n(len)} ≤ ${n(m)} × ${n(len)} = ${n(X)} kilopascals, and a reading that drifts at exactly ${n(m)} per hour reaches it. ${degWork(t, x, inv, lim)}`,
  guidance: [
   { prompt: `The interval is ${n(len)} hours long and |f′| ≤ ${n(m)}. What is the largest possible change?`, answer: [X], explanation: `${n(m)} × ${n(len)} = ${n(X)}.` },
   { prompt: `What is the smallest degree n whose remainder bound is below ${lim}?`, answer: [t.N], explanation: degWork(t, x, inv, lim) }
  ] }; }
});

/* ---- q30 Partitions, lower and upper sums [5.1] ---- */

/* f for the monotone kinds. 'sq+' x² + k, 'sq−' k − x², 'lin+' sx + k, 'lin−' k − sx, 'cu+' x³ + k, 'cu−' k − x³ (all on x ≥ 0). */
const f30 = ({ kind, s, k }) => ({ 'sq+': x => x * x + k, 'sq−': x => k - x * x, 'lin+': x => s * x + k, 'lin−': x => k - s * x, 'cu+': x => x ** 3 + k, 'cu−': x => k - x ** 3 })[kind];
const fx30 = ({ kind, s, k }) => ({ 'sq+': poly([[1, 'x²'], [k, '']]), 'sq−': `${n(k)} − x²`, 'lin+': poly([[s, 'x'], [k, '']]), 'lin−': `${n(k)} − ${s === 1 ? '' : n(s)}x`, 'cu+': poly([[1, 'x³'], [k, '']]), 'cu−': `${n(k)} − x³` })[kind];
const sums30 = p => { const f = f30(p), up = p.kind.endsWith('+'), pts = p.pts, pieces = [];
 for (let i = 1; i < pts.length; i++) { const l = pts[i - 1], r = pts[i], len = r - l, lo = up ? l : r, hi = up ? r : l;
  pieces.push({ l, r, len, lo, hi, inf: f(lo), sup: f(hi) }); }
 return { up, pieces, L: pieces.reduce((s, q) => s + q.inf * q.len, 0), U: pieces.reduce((s, q) => s + q.sup * q.len, 0), mesh: Math.max(...pieces.map(q => q.len)) }; };
/* A partition with whole-number points: start 0 to 2, then 3 or 4 pieces of length 1 or 2, not all of length 1. */
const parts30 = R => { const pts = [R.int(0, 2)], pieces = R.int(3, 4); for (let j = 0; j < pieces; j++) pts.push(pts[j] + R.int(1, 2)); return pts; };
const allOnes = pts => pts.every((v, j) => !j || v - pts[j - 1] === 1);
const sumWork = z => ({ lw: z.pieces.map(q => `${n(q.inf)} × ${n(q.len)}`).join(' + '), uw: z.pieces.map(q => `${n(q.sup)} × ${n(q.len)}`).join(' + '),
 each: z.pieces.map(q => `on [${n(q.l)}, ${n(q.r)}] the infimum is f(${n(q.lo)}) = ${n(q.inf)} and the supremum is f(${n(q.hi)}) = ${n(q.sup)}`).join('; ') });
const sumDef = 'L(P, f) adds up (the smallest value of f on a piece) × (the length of the piece) over all the pieces, and U(P, f) does the same with the largest value of f on each piece';

/* The hill f(x) = k − (x − h)² on a partition: per piece the end values, the infimum (the smaller end) and the supremum (k when the piece holds h). */
const sums30h = ({ pts, h, k }) => { const f = x => k - (x - h) ** 2, pieces = [];
 for (let i = 1; i < pts.length; i++) { const l = pts[i - 1], r = pts[i], fl = f(l), fr = f(r);
  pieces.push({ l, r, len: r - l, fl, fr, inf: Math.min(fl, fr), sup: l <= h && h <= r ? k : Math.max(fl, fr) }); }
 return { pieces, L: pieces.reduce((s, q) => s + q.inf * q.len, 0), U: pieces.reduce((s, q) => s + q.sup * q.len, 0) }; };

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The cargo pump log',
 brief: 'A cargo pump’s flow was only logged at a few minutes, and the audit needs two guaranteed totals for the fuel it moved.',
 labels: ['lower sum', 'upper sum', 'U − L'], tolerance: 0.01,
 gl: [['lower sum'], ['upper sum'], ['U − L']]
}, {
 /* Cubic flow x³ + k (increasing) or k − x³ (decreasing, k above the cube of the right end). Both sums below 1500. */
 canonical: { kind: 'cu+', s: 1, k: 2, pts: [0, 1, 3, 4] },
 draw: R => retry(() => { const kind = R.pick(['cu+', 'cu−']), pts = parts30(R), end = pts[pts.length - 1]; return { kind, s: 1, k: kind === 'cu−' ? end ** 3 + R.int(1, 10) : R.int(0, 6), pts }; },
  p => !allOnes(p.pts) && sums30(p).U < 1500, { kind: 'cu+', s: 1, k: 2, pts: [0, 1, 3, 4] }),
 build: p => { const z = sums30(p), fx = fx30(p), a = p.pts[0], b = p.pts[p.pts.length - 1], w = sumWork(z), d = z.U - z.L; return {
  prompt: `A cargo pump’s flow rate, in litres per minute, is f(x) = ${fx} at minute x, for x from ${n(a)} to ${n(b)}, and f is ${z.up ? 'increasing' : 'decreasing'} there. The audit splits the time at the partition P = {${p.pts.map(n).join(', ')}}, which cuts the interval into ${n(z.pieces.length)} pieces. ${sumDef[0].toUpperCase() + sumDef.slice(1)}. Enter the lower sum L(P, f), then the upper sum U(P, f), then the difference U(P, f) − L(P, f). Type each number without commas.`,
  answer: [z.L, z.U, d],
  hints: ['A monotone function takes its smallest and its largest value on each piece at the two ends of that piece. Decide which end gives which.', 'Multiply each smallest value by its piece’s length and add for L; do the same with the largest values for U. Then subtract.'],
  solution: `f is ${z.up ? 'increasing, so on each piece the infimum is at the left end and the supremum at the right end' : 'decreasing, so on each piece the infimum is at the right end and the supremum at the left end'}: ${w.each}. L(P, f) = ${w.lw} = ${n(z.L)} and U(P, f) = ${w.uw} = ${n(z.U)}, so U(P, f) − L(P, f) = ${n(z.U)} − ${n(z.L)} = ${n(d)}. The litres pumped lie between ${n(z.L)} and ${n(z.U)}.`,
  guidance: [
   { prompt: `On each piece take the smallest value of f times the length of the piece. Add them: what is L(P, f)?`, answer: [z.L], explanation: `${w.each}. So L(P, f) = ${w.lw} = ${n(z.L)}.` },
   { prompt: 'Now use the largest value of f on each piece. What is U(P, f)?', answer: [z.U], explanation: `U(P, f) = ${w.uw} = ${n(z.U)}.` },
   { prompt: `What is U(P, f) − L(P, f)?`, answer: [d], explanation: `${n(z.U)} − ${n(z.L)} = ${n(d)}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'The midpoint estimate and its worst error',
 brief: 'Mira wants to report one number for the fuel a heater burned, and the audit must say how far from the truth it could be.',
 labels: ['lower sum', 'upper sum', 'worst error'], tolerance: 0.01,
 gl: [['lower sum'], ['upper sum'], ['worst error']]
}, {
 /* Mixed monotone kinds. The true total I satisfies L ≤ I ≤ U, so the midpoint (L + U) ÷ 2 is wrong by at most (U − L) ÷ 2, and this
    is reached when I is an end. Not the parent's worked example (2x + 1 on {0, 1, 2, 4}). */
 canonical: { kind: 'sq−', s: 1, k: 20, pts: [0, 2, 3, 4] },
 draw: R => retry(() => { const kind = R.pick(['sq+', 'sq−', 'lin+', 'lin−']), pts = parts30(R), end = pts[pts.length - 1], s = R.int(2, 5);
  return { kind, s: kind.startsWith('lin') ? s : 1, k: kind === 'sq−' ? end * end + R.int(1, 10) : kind === 'lin−' ? s * end + R.int(1, 10) : R.int(0, 6), pts }; },
  p => !allOnes(p.pts) && sums30(p).U < 1000 && !(p.kind === 'lin+' && p.s === 2 && p.k === 1 && p.pts.join() === '0,1,2,4'), { kind: 'sq−', s: 1, k: 20, pts: [0, 2, 3, 4] }),
 build: p => { const z = sums30(p), fx = fx30(p), a = p.pts[0], b = p.pts[p.pts.length - 1], w = sumWork(z), mid = (z.L + z.U) / 2, err = (z.U - z.L) / 2; return {
  prompt: `Mira estimates the fuel a heater burned from minute ${n(a)} to minute ${n(b)}. Its burn rate, in litres per minute, is f(x) = ${fx} at minute x, and f is ${z.up ? 'increasing' : 'decreasing'} on that interval. She splits the time at P = {${p.pts.map(n).join(', ')}}. ${sumDef[0].toUpperCase() + sumDef.slice(1)}, and the true total fuel burned always lies between L(P, f) and U(P, f). She will report the number exactly halfway between them. Enter L(P, f), then U(P, f), then the largest amount by which her reported number could differ from the true total, given only that the true total lies between L(P, f) and U(P, f).`,
  answer: [z.L, z.U, err],
  hints: ['A monotone function takes its smallest and its largest value on each piece at the two ends of that piece. Decide which end gives which, then multiply by the piece lengths and add.', 'The reported number sits in the middle of the interval from L to U, and the truth could be anywhere in it. How far is the middle from each end?'],
  solution: `f is ${z.up ? 'increasing, so on each piece the infimum is at the left end and the supremum at the right end' : 'decreasing, so on each piece the infimum is at the right end and the supremum at the left end'}: ${w.each}. L(P, f) = ${w.lw} = ${n(z.L)} and U(P, f) = ${w.uw} = ${n(z.U)}. Her reported number is (${n(z.L)} + ${n(z.U)}) ÷ 2 = ${n(mid)}. The true total could be anywhere from ${n(z.L)} to ${n(z.U)}, so it can be as far from ${n(mid)} as half the width of that interval: (${n(z.U)} − ${n(z.L)}) ÷ 2 = ${n(err)} litres.`,
  guidance: [
   { prompt: `On each piece take the smallest value of f times the length of the piece. Add them: what is L(P, f)?`, answer: [z.L], explanation: `${w.each}. So L(P, f) = ${w.lw} = ${n(z.L)}.` },
   { prompt: 'Now use the largest value of f on each piece. What is U(P, f)?', answer: [z.U], explanation: `U(P, f) = ${w.uw} = ${n(z.U)}.` },
   { prompt: `The true total lies between ${n(z.L)} and ${n(z.U)}, and Mira reports the number halfway between. What is the largest possible gap between her number and the truth?`, answer: [err], explanation: `Her number is ${n(mid)}, and the ends are each (${n(z.U)} − ${n(z.L)}) ÷ 2 = ${n(err)} away.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q05', title: 'A heater that ramps up and eases off',
 brief: 'A heater’s burn rate rises to a peak and then falls, so no piece of the audit is simply rising or falling.',
 labels: ['lower sum', 'upper sum'], tolerance: 0.01,
 gl: [['infimum on the peak piece'], ['lower sum'], ['upper sum']]
}, {
 /* f(x) = k − (x − h)², a hill with its top f(h) = k at the whole number h, which lies strictly inside one piece (so the partition
    has a piece of length at least 2 around it). On a piece, inf = the smaller end value; sup = k when the piece holds h, else the
    end value nearer h. k keeps f at least 2. Both sums below 1000. */
 canonical: { pts: [0, 1, 4, 5], h: 2, k: 12 },
 draw: R => retry(() => { const a = R.int(0, 2), pts = [a], pieces = R.int(3, 4); for (let j = 0; j < pieces; j++) pts.push(pts[j] + R.int(1, 3));
   const end = pts[pts.length - 1], h = R.int(a + 1, end - 1), far = Math.max((h - a) ** 2, (end - h) ** 2); return { pts, h, k: far + R.int(2, 9) }; },
  p => p.pts.some((v, j) => j && p.pts[j - 1] < p.h && p.h < v) && sums30h(p).U < 1000, { pts: [0, 1, 4, 5], h: 2, k: 12 }),
 build: p => { const z = sums30h(p), a = p.pts[0], b = p.pts[p.pts.length - 1], pk = z.pieces.find(q => q.l < p.h && p.h < q.r), shape = `${n(p.k)} − (${p.h === 0 ? 'x' : `x − ${n(p.h)}`})²`; 
  const lw = z.pieces.map(q => `${n(q.inf)} × ${n(q.len)}`).join(' + '), uw = z.pieces.map(q => `${n(q.sup)} × ${n(q.len)}`).join(' + ');
  const each = z.pieces.map(q => q === pk ? `on [${n(q.l)}, ${n(q.r)}] the top x = ${n(p.h)} is inside, so the supremum is f(${n(p.h)}) = ${n(p.k)}, and the infimum is the smaller end value, f(${n(q.l)}) = ${n(q.fl)} or f(${n(q.r)}) = ${n(q.fr)}, which is ${n(q.inf)}`
   : `on [${n(q.l)}, ${n(q.r)}] f is ${q.r <= p.h ? 'rising' : 'falling'}, the infimum is f(${n(q.r <= p.h ? q.l : q.r)}) = ${n(q.inf)} and the supremum is f(${n(q.r <= p.h ? q.r : q.l)}) = ${n(q.sup)}`).join('; '); return {
  prompt: `A heater ramps up and then eases off: its burn rate, in litres per minute, is f(x) = ${shape} at minute x, for x from ${n(a)} to ${n(b)}. Its graph is a hill. It rises until its top at x = ${n(p.h)}, where f(${n(p.h)}) = ${n(p.k)}, and falls after it. Take the partition P = {${p.pts.map(n).join(', ')}}. ${sumDef[0].toUpperCase() + sumDef.slice(1)}. Enter the lower sum L(P, f), then the upper sum U(P, f). Type each number without commas.`,
  answer: [z.L, z.U],
  hints: ['On a piece wholly on the rising side, the smallest value is at the left end and the largest at the right; on a piece wholly on the falling side it is the other way round. A piece that contains the top needs separate care: where is the largest value, and which end is lower?', 'Multiply each smallest value by its piece’s length and add for L; do the same with the largest values for U.'],
  solution: `${each}. L(P, f) = ${lw} = ${n(z.L)} and U(P, f) = ${uw} = ${n(z.U)}.`,
  guidance: [
   { prompt: `The top x = ${n(p.h)} lies inside the piece [${n(pk.l)}, ${n(pk.r)}]. What is the infimum of f on that piece? (It is at one of the two ends.)`, answer: [pk.inf], explanation: `f(${n(pk.l)}) = ${n(pk.fl)} and f(${n(pk.r)}) = ${n(pk.fr)}, so the infimum is ${n(pk.inf)}. The supremum on that piece is the top value ${n(p.k)}.` },
   { prompt: 'Add (smallest value) × (length) over all the pieces. What is L(P, f)?', answer: [z.L], explanation: `${each}. So L(P, f) = ${lw} = ${n(z.L)}.` },
   { prompt: 'Add (largest value) × (length) over all the pieces. What is U(P, f)?', answer: [z.U], explanation: `U(P, f) = ${uw} = ${n(z.U)}.` }
  ] }; }
});

})();
