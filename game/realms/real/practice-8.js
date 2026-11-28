/* Real analysis practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p8.js. */
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
/* True when x has at most d decimals. */
const places = (x, d) => Math.abs(Math.round(x * Math.pow(10, d)) - x * Math.pow(10, d)) < 1e-9;
/* A coefficient written only when it is not 1: "3", or "" for 1. */
const cf = c => c === 1 ? '' : n(c);
/* The first whole number N >= 1 with num · u^N · den < e · v^(N−1) · (extra), using whole-number arithmetic;
   here: first N with m·r^N·d < e·b^(N−1), or null when none is found by 3000. */
const firstN = (m, r, b, e, d) => { for (let N = 1; N <= 3000; N++) if (BigInt(m) * BigInt(r) ** BigInt(N) * BigInt(d) < BigInt(e) * BigInt(b) ** BigInt(N - 1)) return N; return null; };
/* Tolerances written as e/d: [e, d] pairs for 0.1, 0.05, 0.01, 0.005, 0.001. */
const EPS = [[1, 10], [5, 100], [1, 100], [5, 1000], [1, 1000]];
/* "x", "(x − 3)" or "(x + 2)" for a centre x0, and the same raised to the power k. */
const cen = x0 => x0 === 0 ? 'x' : `(x ${x0 > 0 ? '−' : '+'} ${n(Math.abs(x0))})`;
const cenK = x0 => x0 === 0 ? 'xᵏ' : `${cen(x0)}ᵏ`;
/* "x − 3", "x + 2" or "x" without brackets. */
const dist = x0 => x0 === 0 ? 'x' : `x ${x0 > 0 ? '−' : '+'} ${n(Math.abs(x0))}`;
/* Plane metrics 0 euclidean, 1 taxicab, 2 maximum. */
const MET = ['euclidean metric', 'taxicab metric', 'maximum metric'];
const mdist = (kind, dx, dy) => kind === 0 ? Math.sqrt(dx * dx + dy * dy) : kind === 1 ? Math.abs(dx) + Math.abs(dy) : Math.max(Math.abs(dx), Math.abs(dy));
const mhow = (kind, ax, ay) => kind === 0 ? `√(${n(ax * ax)} + ${n(ay * ay)}) = √${n(ax * ax + ay * ay)} = ${n(mdist(0, ax, ay))}`
 : kind === 1 ? `${n(ax)} + ${n(ay)} = ${n(ax + ay)}` : `the larger of ${n(ax)} and ${n(ay)}, which is ${n(Math.max(ax, ay))}`;
const TRI = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]];
/* A gap in a signed triple: [dx, dy] with random signs. */
const sgn = (R, t) => [R.bool() ? t[0] : -t[0], R.bool() ? t[1] : -t[1]];
const pt = (x, y) => `(${n(x)}, ${n(y)})`;
const MHINT = 'Start from the two coordinate gaps |x₁ − x₂| and |y₁ − y₂|. Euclidean: square, add, take the root. Taxicab: add them. Maximum: take the larger.';

/* ---- q36 Uniform convergence and the uniform norm [6.1] ---- */

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The drift envelope of the tank gauge',
 brief: 'The fuel-tank gauge is rechecked every day and its error should shrink on every part of the scale at once, so the lab needs the worst error on the scale.',
 labels: ['uniform norm', 'smallest N'], tolerance: 0.005,
 gl: [['largest of x(L − x)'], ['uniform norm'], ['smallest N']]
}, {
 /* fₙ(x) = x(L − x) ÷ n on [0, L], L even. The parabola peaks at x = L/2 with value K = (L/2)², so the norm is K ÷ n.
    ε = e/10, so the smallest N is floor(10K ÷ e) + 1 (strict inequality; exact in whole numbers). n0 in {2, 4, 5, 10}: at most 2 decimals. */
 canonical: { L: 6, n0: 4, e: 2 },
 draw: R => ({ L: R.pick([2, 4, 6, 8, 10]), n0: R.pick([2, 4, 5, 10]), e: R.pick([1, 2, 4, 5, 8]) }),
 build: ({ L, n0, e }) => { const K = (L / 2) * (L / 2), norm = K / n0, eps = e / 10, bound = 10 * K / e, N = Math.floor(bound) + 1; return {
  prompt: `The fuel-tank gauge is checked along its scale 0 ≤ x ≤ ${n(L)}. On check n its error at the mark x is fₙ(x) = x(${n(L)} − x) ÷ n, and fₙ(x) → 0 for every mark. Enter the uniform norm ‖fₙ − 0‖_u for n = ${n(n0)} (the supremum of |fₙ(x)| over the whole scale), then the smallest N for which ‖fₙ − 0‖_u < ${n(eps)} holds for every n ≥ N (type it without commas).`,
  answer: [norm, N],
  hints: ['x(L − x) is a downward parabola with roots 0 and L, so it peaks halfway between them. Divide that peak by n.', 'The norm is the peak ÷ n, which only shrinks as n grows. Solve “norm < tolerance” for n; the inequality is strict, so take the first whole number strictly above the bound.'],
  solution: `The error x(${n(L)} − x) ÷ n is a downward parabola divided by n, with roots 0 and ${n(L)}, so it peaks at x = ${n(L / 2)}, where x(${n(L)} − x) = ${n(L / 2)} × ${n(L / 2)} = ${n(K)}. So ‖fₙ − 0‖_u = ${n(K)} ÷ n. For n = ${n(n0)} that is ${n(norm)}. The norm is below ${n(eps)} when n > ${n(K)} ÷ ${n(eps)} = ${n(bound)}. The norm only shrinks as n grows, so the smallest N is ${n(N)}, and one N works for every mark at once.`,
  guidance: [
   { prompt: `What is the largest value of x(${n(L)} − x) for 0 ≤ x ≤ ${n(L)}?`, answer: [K], explanation: `The parabola peaks halfway between its roots 0 and ${n(L)}, at x = ${n(L / 2)}, where it equals ${n(L / 2)} × ${n(L / 2)} = ${n(K)}.` },
   { prompt: `The largest value of x(${n(L)} − x) is ${n(K)}, so ‖fₙ − 0‖_u = ${n(K)} ÷ n. What is the uniform norm for n = ${n(n0)}?`, answer: [norm], explanation: `${n(K)} ÷ ${n(n0)} = ${n(norm)}.` },
   { prompt: `What is the smallest N with ${n(K)} ÷ n < ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `${n(K)} ÷ n < ${n(eps)} means n > ${n(bound)}. The smallest whole number strictly above it is ${n(N)}.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Shrinking the simulation error budget',
 brief: 'The simulation core’s error is a ratio raised to ever higher powers, and the lab must say how many passes make the worst error small enough.',
 labels: ['uniform norm', 'smallest N'], tolerance: 0.0005,
 gl: [['reading with the largest error'], ['uniform norm'], ['smallest N']]
}, {
 /* eₙ(x) = (x ÷ v)ⁿ on [0, u], u < v. It rises with x, so the norm is (u ÷ v)ⁿ. ε = e/d from EPS.
    N is the first n with u^n · d < e · v^n, in BigInt; 3 <= N <= 60. The norm for n0 has at most 3 decimals. */
 canonical: { u: 3, v: 5, n0: 3, ei: 1 },
 draw: R => retry(() => { const r = R.pick([[1, 2], [1, 5], [1, 10], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10]]); return { u: r[0], v: r[1], n0: R.int(2, 3), ei: R.int(0, 4) }; },
  p => { const N = firstN(1, p.u, p.v, EPS[p.ei][0], EPS[p.ei][1]); return N !== null && N >= 3 && N <= 60 && places(Math.pow(p.u / p.v, p.n0), 3); }, { u: 3, v: 5, n0: 3, ei: 1 }),
 build: ({ u, v, n0, ei }) => { const [e, d] = EPS[ei], eps = e / d, q = u / v, norm = Math.round(Math.pow(q, n0) * 1e6) / 1e6, N = (() => { for (let k = 1; k <= 3000; k++) if (BigInt(u) ** BigInt(k) * BigInt(d) < BigInt(e) * BigInt(v) ** BigInt(k)) return k; return 0; })(); return {
  prompt: `The simulation core’s error model on pass n is eₙ(x) = (x ÷ ${n(v)})ⁿ for instrument readings 0 ≤ x ≤ ${n(u)}, and eₙ(x) → 0 for every reading there. Enter the uniform norm ‖eₙ − 0‖_u for n = ${n(n0)}, then the smallest N for which ‖eₙ − 0‖_u < ${n(eps)} holds for every n ≥ N (type it without commas).`,
  answer: [norm, N],
  hints: ['A positive number raised to a power grows as the number grows, so the supremum over the readings sits at the right-hand end of the interval.', 'The norm is a ratio below 1 raised to the power n. Try successive whole powers until the value first drops below the tolerance; the values only fall, so that n is the smallest N and it holds for every larger n.'],
  solution: `For a fixed n, (x ÷ ${n(v)})ⁿ rises as x rises, so its largest value on 0 ≤ x ≤ ${n(u)} is at x = ${n(u)}: ‖eₙ − 0‖_u = (${n(u)} ÷ ${n(v)})ⁿ = ${n(q)}ⁿ. For n = ${n(n0)} that is ${n(norm)}. Since ${n(q)} is below 1, ${n(q)}ⁿ falls as n grows, so we look for the first n with ${n(q)}ⁿ < ${n(eps)}. Trying whole numbers, n = ${n(N - 1)} is not below ${n(eps)} and n = ${n(N)} is, so N = ${n(N)}; every larger n is smaller still.`,
  guidance: [
   { prompt: `For a fixed n, (x ÷ ${n(v)})ⁿ grows as x grows. At which reading x in 0 ≤ x ≤ ${n(u)} is the error largest?`, answer: [u], explanation: `The error rises with x, so it is largest at the right-hand end, x = ${n(u)}.` },
   { prompt: `So ‖eₙ − 0‖_u = (${n(u)} ÷ ${n(v)})ⁿ. What is it for n = ${n(n0)}?`, answer: [norm], explanation: `${n(q)}^${n(n0)} = ${n(norm)}.` },
   { prompt: `What is the smallest N with (${n(u)} ÷ ${n(v)})ⁿ < ${n(eps)} for every n ≥ N? Try whole numbers until it first holds.`, answer: [N], explanation: `${n(q)}ⁿ is not below ${n(eps)} at n = ${n(N - 1)} and is below it at n = ${n(N)}; the powers only fall, so N = ${n(N)}.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'Certifying a quadratic correction against its limit',
 brief: 'The simulation core predicts a curve whose correction term fades with every pass, and the lab must name its limit curve and certify how fast the gap closes.',
 labels: ['f at the mark', 'uniform norm', 'smallest N'], tolerance: 0.005,
 gl: [['f at the mark'], ['uniform norm'], ['smallest N']]
}, {
 /* fₙ(x) = qx + p x² ÷ n on [0, b]; pointwise limit f(x) = qx; fₙ − f = p x² ÷ n rises with x, norm = p b² ÷ n.
    ε = e/10, N = floor(10 p b² ÷ e) + 1. n0 in {2, 4, 5, 10}: at most 2 decimals. */
 canonical: { q: 2.5, p: 3, b: 4, x0: 3, n0: 4, e: 2 },
 draw: R => { const b = R.int(2, 6); return { q: R.pick([0.5, 1.5, 2, 2.5, 3, 4]), p: R.int(1, 6), b, x0: R.int(1, b), n0: R.pick([2, 4, 5, 10]), e: R.pick([1, 2, 4, 5, 8]) }; },
 build: ({ q, p, b, x0, n0, e }) => { const f0 = q * x0, big = p * b * b, norm = big / n0, eps = e / 10, bound = 10 * big / e, N = Math.floor(bound) + 1; return {
  prompt: `The simulation core’s n-th prediction is fₙ(x) = ${n(q)}x + ${cf(p)}x² ÷ n for 0 ≤ x ≤ ${n(b)}, for n = 1, 2, 3, …, and f(x) is the limit of fₙ(x) as n grows. Enter f(${n(x0)}), then the uniform norm ‖fₙ − f‖_u for n = ${n(n0)}, then the smallest N for which ‖fₙ − f‖_u < ${n(eps)} holds for every n ≥ N (type it without commas).`,
  answer: [f0, norm, N],
  hints: ['Find the pointwise limit first: let n grow in every term that contains n, and keep the rest. The gap fₙ(x) − f(x) is what is left over.', 'The gap is a positive multiple of x², which grows with x, so its supremum on the interval is at the right-hand end. Divide by n, then solve “norm < tolerance” strictly for n.'],
  solution: `As n grows, ${cf(p)}x² ÷ n → 0 for each x, so f(x) = ${n(q)}x and f(${n(x0)}) = ${n(f0)}. Then fₙ(x) − f(x) = ${cf(p)}x² ÷ n, which rises with x on 0 ≤ x ≤ ${n(b)}, so its largest value is at x = ${n(b)}: ‖fₙ − f‖_u = ${n(p)} × ${n(b * b)} ÷ n = ${n(big)} ÷ n. For n = ${n(n0)} that is ${n(norm)}. It is below ${n(eps)} when n > ${n(big)} ÷ ${n(eps)} = ${n(bound)}, and it only shrinks as n grows, so the smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `Let n grow in fₙ(x) = ${n(q)}x + ${cf(p)}x² ÷ n. What is the limit f(${n(x0)})?`, answer: [f0], explanation: `The term ${cf(p)}x² ÷ n → 0, so f(x) = ${n(q)}x and f(${n(x0)}) = ${n(f0)}.` },
   { prompt: `The gap fₙ(x) − f(x) = ${cf(p)}x² ÷ n is largest at x = ${n(b)}. What is ‖fₙ − f‖_u for n = ${n(n0)}?`, answer: [norm], explanation: `${n(p)} × ${n(b * b)} ÷ ${n(n0)} = ${n(norm)}.` },
   { prompt: `In general ‖fₙ − f‖_u = ${n(big)} ÷ n. What is the smallest N with this below ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `${n(big)} ÷ n < ${n(eps)} means n > ${n(bound)}. The smallest whole number strictly above it is ${n(N)}.` }
  ] }; }
});

/* ---- q37 Interchange of limits and the Weierstrass M-test [6.2, 11.2] ---- */

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'A thermostat trace and its integral',
 brief: 'The thermostat trace is rerun with finer sampling every night, and the lab must say how close each run stays and what total the runs settle to.',
 labels: ['error bound', 'smallest N', 'limit of the integral'], tolerance: 0.005,
 gl: [['error bound'], ['smallest N'], ['limit of the integral']]
}, {
 /* hₙ(x) = a x + c sin(nx) ÷ n on [0, L]; h(x) = a x; |hₙ − h| ≤ c ÷ n (|sin| ≤ 1). ε = e/10, N = floor(10c ÷ e) + 1.
    ∫₀ᴸ hₙ → ∫₀ᴸ a x dx = a L² ÷ 2. n0 in {2, 4, 5, 10}: at most 2 decimals. */
 canonical: { a: 3, c: 6, L: 4, n0: 4, e: 2 },
 draw: R => ({ a: R.int(1, 6), c: R.int(1, 9), L: R.int(1, 6), n0: R.pick([2, 4, 5, 10]), e: R.pick([1, 2, 4, 5, 8]) }),
 build: ({ a, c, L, n0, e }) => { const bd = c / n0, eps = e / 10, bound = 10 * c / e, N = Math.floor(bound) + 1, I = a * L * L / 2; return {
  prompt: `A thermostat trace is modelled by hₙ(x) = ${cf(a)}x + ${cf(c)} sin(nx) ÷ n for 0 ≤ x ≤ ${n(L)}, for n = 1, 2, 3, …, and its limit is h(x) = ${cf(a)}x. Using only |sin| ≤ 1, enter the bound on |hₙ(x) − h(x)| that holds for every x, for n = ${n(n0)}. Then enter the smallest N for which that bound is below ${n(eps)} for every n ≥ N (type it without commas). Because hₙ → h uniformly on [0, ${n(L)}], the limit of ∫ hₙ equals ∫ h: enter the limit of the integral of hₙ(x) from 0 to ${n(L)} as n grows.`,
  answer: [bd, N, I],
  hints: ['The sine term has size at most its coefficient, because |sin| ≤ 1. Divide that coefficient by n.', 'Uniform convergence lets you swap the limit and the integral: integrate the limit function h over the interval. The integral of a straight line ax from 0 to L is aL² ÷ 2.'],
  solution: `Since |sin(nx)| ≤ 1, |hₙ(x) − h(x)| = ${n(c)}|sin(nx)| ÷ n ≤ ${n(c)} ÷ n for every x. For n = ${n(n0)} the bound is ${n(c)} ÷ ${n(n0)} = ${n(bd)}. It is below ${n(eps)} when n > ${n(c)} ÷ ${n(eps)} = ${n(bound)}, and it only shrinks as n grows, so the smallest N is ${n(N)}. Because the convergence is uniform, the limit of the integrals is the integral of the limit: ∫ from 0 to ${n(L)} of ${cf(a)}x dx = ${n(a)} × ${n(L)}² ÷ 2 = ${n(I)}.`,
  guidance: [
   { prompt: `|sin(nx)| ≤ 1 and the sine term is ${n(c)} sin(nx) ÷ n. What bound on |hₙ(x) − h(x)| holds for every x when n = ${n(n0)}?`, answer: [bd], explanation: `The size is at most ${n(c)} ÷ n = ${n(c)} ÷ ${n(n0)} = ${n(bd)}.` },
   { prompt: `What is the smallest N with ${n(c)} ÷ n < ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `${n(c)} ÷ n < ${n(eps)} means n > ${n(bound)}. The smallest whole number strictly above it is ${n(N)}.` },
   { prompt: `The convergence is uniform, so the limit of the integrals is the integral of h(x) = ${cf(a)}x. What is it from 0 to ${n(L)}?`, answer: [I], explanation: `${n(a)} × ${n(L)}² ÷ 2 = ${n(I)}.` }
  ] }; }
});

/* Geometric bounds Mₖ = c·(u÷v)ᵏ for k = 0, 1, 2, …, with c = m(v − u) so the sum is m·v. */
const RHO = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10]];
mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'How many terms the relay filter needs',
 brief: 'A relay filter adds up correction terms, and the lab must say how large the filter can ever get and how many terms keep it within tolerance.',
 labels: ['sum of the Mₖ', 'uniform error bound', 'smallest N'], tolerance: 0.0005,
 gl: [['sum of the Mₖ'], ['uniform error bound'], ['smallest N']]
}, {
 /* Mₖ = c(u÷v)ᵏ, c = m(v − u), k from 0: the sum is c v ÷ (v − u) = m v. The error after the first N0 terms (k = 0 … N0 − 1) is
    at most the rest, m v (u÷v)^N0 = m v u^N0 ÷ v^N0, kept to at most 3 decimals. The smallest N with m·u^N·v·d < e·v^N is found in whole numbers (BigInt), 2 <= N <= 120. */
 canonical: { u: 3, v: 5, m: 4, N0: 3, ei: 0 },
 draw: R => retry(() => { const r = R.pick(RHO); return { u: r[0], v: r[1], m: R.int(2, 9), N0: R.int(2, 4), ei: R.int(0, 4) }; },
  p => { const t = p.m * p.v * Math.pow(p.u, p.N0) / Math.pow(p.v, p.N0); let N = 0; for (let k = 1; k <= 3000 && !N; k++) if (BigInt(p.m) * BigInt(p.v) * BigInt(p.u) ** BigInt(k) * BigInt(EPS[p.ei][1]) < BigInt(EPS[p.ei][0]) * BigInt(p.v) ** BigInt(k)) N = k; return places(t, 3) && N >= 2 && N <= 120; }, { u: 3, v: 5, m: 4, N0: 3, ei: 0 }),
 build: ({ u, v, m, N0, ei }) => { const [e, d] = EPS[ei], eps = e / d, c = m * (v - u), S = m * v, rho = u / v, tail = Math.round(S * Math.pow(rho, N0) * 1e6) / 1e6, N = (() => { for (let k = 1; k <= 3000; k++) if (BigInt(m) * BigInt(v) * BigInt(u) ** BigInt(k) * BigInt(d) < BigInt(e) * BigInt(v) ** BigInt(k)) return k; return 0; })(); return {
  prompt: `A relay filter corrects a signal with the sum, for k = 0, 1, 2, …, of ${n(c)} cos(kx) × (${n(u)} ÷ ${n(v)})ᵏ, where x is the phase. Each term is at most Mₖ in size for every x, using |cos| ≤ 1. Enter the sum of all the Mₖ. Then enter the uniform error bound after the first ${n(N0)} terms (k = 0 to ${n(N0 - 1)}), which is the sum of the Mₖ that are left. Then enter the smallest number of terms N for which that error bound is below ${n(eps)} (type it without commas).`,
  answer: [S, tail, N],
  hints: ['Take Mₖ = c × (ratio)ᵏ. A geometric series with first term c and ratio below 1 adds up to c ÷ (1 − ratio).', 'After the first N terms what is left is the same kind of geometric series, starting at k = N: it equals the whole sum times (ratio)ᴺ. Find the first whole N for which that is below the tolerance.'],
  solution: `Since |cos| ≤ 1, each term is at most Mₖ = ${n(c)} × ${n(rho)}ᵏ. These form a geometric series with first term ${n(c)} and ratio ${n(rho)}, so their sum is ${n(c)} ÷ (1 − ${n(rho)}) = ${n(S)}. The terms left after the first ${n(N0)} are bounded by the Mₖ from k = ${n(N0)} on, which add up to ${n(S)} × ${n(rho)}^${n(N0)} = ${n(tail)}, the same for every x. The bound after N terms is ${n(S)} × ${n(rho)}ᴺ, which falls as N grows; trying whole numbers, N = ${n(N - 1)} is not below ${n(eps)} and N = ${n(N)} is, so the smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `Each term is at most Mₖ = ${n(c)} × ${n(rho)}ᵏ in size, a geometric series from k = 0. What is the sum of all the Mₖ?`, answer: [S], explanation: `${n(c)} ÷ (1 − ${n(rho)}) = ${n(S)}.` },
   { prompt: `The Mₖ from k = ${n(N0)} on add up to the whole sum times ${n(rho)}^${n(N0)}. What is the error bound after ${n(N0)} terms?`, answer: [tail], explanation: `${n(S)} × ${n(rho)}^${n(N0)} = ${n(tail)}.` },
   { prompt: `The error bound after N terms is ${n(S)} × ${n(rho)}ᴺ. What is the smallest whole number N for which it is below ${n(eps)}?`, answer: [N], explanation: `The bound falls as N grows. It is not below ${n(eps)} at N = ${n(N - 1)} and is below it at N = ${n(N)}, so the smallest N is ${n(N)}.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q13', title: 'A telescoping bound for the core filter',
 brief: 'The core filter uses terms that fade like one over k squared, and the lab must certify its worst-case error with a bound that adds up exactly.',
 labels: ['sum of the Mₖ', 'uniform error bound', 'smallest N'], tolerance: 0.005,
 gl: [['sum of the Mₖ'], ['uniform error bound'], ['smallest N']]
}, {
 /* Mₖ = c ÷ (k(k + 1)) for k ≥ 1: the first N add to c(1 − 1÷(N+1)), the whole sum is c, the rest after N terms is c ÷ (N + 1).
    N0 + 1 in {4, 5, 10}: at most 2 decimals. ε = e/100, smallest N with c ÷ (N + 1) < ε is floor(100c ÷ e). */
 canonical: { A: 5, c: 6, N0: 3, e: 5 },
 draw: R => ({ A: R.int(1, 9), c: R.int(2, 9), N0: R.pick([3, 4, 9]), e: R.pick([1, 2, 4, 5, 8, 10]) }),
 build: ({ A, c, N0, e }) => { const rest = c / (N0 + 1), eps = e / 100, N = Math.floor(100 * c / e); return {
  prompt: `The simulation core’s filter output is g(x) = ${n(A)} + the sum, for k = 1, 2, 3, …, of ${n(c)} sin(kx) ÷ (k(k + 1)). Each term is at most Mₖ = ${n(c)} ÷ (k(k + 1)) in size for every x. Use this fact: 1 ÷ (k(k + 1)) = 1 ÷ k − 1 ÷ (k + 1), so the first N of the numbers 1 ÷ (k(k + 1)) add up to 1 − 1 ÷ (N + 1). Enter the sum of all the Mₖ, then the uniform error bound after the first ${n(N0)} terms (the sum of the Mₖ that are left), then the smallest number of terms N for which that error bound is below ${n(eps)} (type it without commas).`,
  answer: [c, rest, N],
  hints: ['The first N of the Mₖ add up to c times (1 − 1 ÷ (N + 1)). Let N grow to get the whole sum.', 'What is left after N terms is the whole sum minus the first N, which has a simple closed form. Solve “that < tolerance” for N; the inequality is strict.'],
  solution: `The first N of the Mₖ add up to ${n(c)} × (1 − 1 ÷ (N + 1)). As N grows this tends to ${n(c)}, so the sum of all the Mₖ is ${n(c)}. After the first ${n(N0)} terms what is left is ${n(c)} − ${n(c)} × (1 − 1 ÷ ${n(N0 + 1)}) = ${n(c)} ÷ ${n(N0 + 1)} = ${n(rest)}, the same for every x. After N terms the leftover bound is ${n(c)} ÷ (N + 1), and it is below ${n(eps)} when N + 1 > ${n(c)} ÷ ${n(eps)} = ${n(c / eps)}. The smallest such whole N is ${n(N)}.`,
  guidance: [
   { prompt: `The first N of the Mₖ add up to ${n(c)} × (1 − 1 ÷ (N + 1)). What number does this tend to as N grows?`, answer: [c], explanation: `1 ÷ (N + 1) → 0, so the sum tends to ${n(c)}.` },
   { prompt: `What is left after ${n(N0)} terms: ${n(c)} − ${n(c)} × (1 − 1 ÷ ${n(N0 + 1)})?`, answer: [rest], explanation: `${n(c)} × 1 ÷ ${n(N0 + 1)} = ${n(rest)}.` },
   { prompt: `The leftover bound after N terms is ${n(c)} ÷ (N + 1). What is the smallest N for which it is below ${n(eps)}?`, answer: [N], explanation: `${n(c)} ÷ (N + 1) < ${n(eps)} means N + 1 > ${n(c / eps)}, so N + 1 is at least ${n(N + 1)} and the smallest N is ${n(N)}.` }
  ] }; }
});

/* ---- q38 Power series converge uniformly inside the radius [6.2] ---- */

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The pressure gauge expansion',
 brief: 'A pressure gauge is corrected by a series in the pressure offset, and the lab must say how far the series can be trusted and bound it on a narrower range.',
 labels: ['radius of convergence', 'sum of the Mₖ'], tolerance: 0.005,
 gl: [['radius of convergence'], ['ratio'], ['sum of the Mₖ']]
}, {
 /* Terms c·qᵏ(x − x0)ᵏ: the ratio has size q|x − x0|, radius 1 ÷ q. Interval [x0 − h, x0 + h] with q·h = ρ = num ÷ den, so Mₖ = c ρᵏ
    and c = m(den − num) makes the sum c ÷ (1 − ρ) = m·den. q in {2, 4, 5, 10}; h and the endpoints have at most 4 decimals. */
 canonical: { q: 4, num: 3, den: 5, m: 3, x0: -2 },
 draw: R => retry(() => { const r = R.pick(RHO); return { q: R.pick([2, 4, 5, 10]), num: r[0], den: r[1], m: R.int(1, 6), x0: R.int(-4, 4) }; },
  p => { const h = p.num / (p.den * p.q); return places(h, 4) && places(p.x0 + h, 4) && places(p.x0 - h, 4) && !(p.q === 4 && p.num === 1 && p.den === 4); }, { q: 4, num: 3, den: 5, m: 3, x0: -2 }),
 build: ({ q, num, den, m, x0 }) => { const rad = 1 / q, rho = num / den, h = rho / q, c = m * (den - num), S = m * den, lo = x0 - h, hi = x0 + h; return {
  prompt: `A pressure gauge is corrected by the series that adds up ${cf(c)}${c === 1 ? '' : ' × '}${n(q)}ᵏ${cenK(x0)} for k = 0, 1, 2, …, where x is the pressure offset. Enter its radius of convergence, then the Weierstrass M-test bound (the sum of the Mₖ) that certifies uniform convergence on [${n(lo)}, ${n(hi)}].`,
  answer: [rad, S],
  hints: ['Ratio test: divide the (k + 1)-th term by the k-th and take the size. The series converges where that ratio is below 1.', 'On the interval, |x − x₀| is at most the half-width h, so each term is at most c(qh)ᵏ in size. Those bounds form a geometric series with ratio qh, which must be below 1.'],
  solution: `The ratio of the (k + 1)-th term to the k-th is ${n(q)}${x0 === 0 ? 'x' : cen(x0)}, of size ${n(q)}|${dist(x0)}|. It is below 1 when |${dist(x0)}| < 1 ÷ ${n(q)}, so the radius of convergence is ${n(rad)}. The interval [${n(lo)}, ${n(hi)}] is centred on ${n(x0)} with half-width ${n(h)}, which is below the radius, so each term is at most Mₖ = ${n(c)} × (${n(q)} × ${n(h)})ᵏ = ${n(c)} × ${n(rho)}ᵏ. These form a geometric series with ratio ${n(rho)} < 1, whose sum is ${n(c)} ÷ (1 − ${n(rho)}) = ${n(S)}. By the M-test the series converges uniformly on the interval, and its size there is never more than ${n(S)}.`,
  guidance: [
   { prompt: `The ratio of consecutive terms has size ${n(q)}|${dist(x0)}|. Below what distance from ${n(x0)} does the series converge?`, answer: [rad], explanation: `${n(q)}|${dist(x0)}| < 1 exactly when |${dist(x0)}| < ${n(rad)}, so the radius is ${n(rad)}.` },
   { prompt: `On [${n(lo)}, ${n(hi)}] the distance from ${n(x0)} is at most ${n(h)}. What is the ratio ${n(q)} × ${n(h)} of the bounding geometric series?`, answer: [rho], explanation: `${n(q)} × ${n(h)} = ${n(rho)}, which is below 1 because the interval sits strictly inside the radius.` },
   { prompt: `Mₖ = ${n(c)} × ${n(rho)}ᵏ. What is the sum of all the Mₖ?`, answer: [S], explanation: `${n(c)} ÷ (1 − ${n(rho)}) = ${n(S)}.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The thermostat range check',
 brief: 'The thermostat model is a power series that will only be run over one working range, and the lab must show the range sits safely inside where the series works.',
 labels: ['radius of convergence', 'farthest distance', 'sum of the Mₖ'], tolerance: 0.01,
 gl: [['radius of convergence'], ['farthest distance'], ['sum of the Mₖ']]
}, {
 /* Terms c(x − x0)ᵏ ÷ bᵏ; interval [x0 − dl, x0 + dr] with r = max(dl, dr) < b; c = m(b − r), so the sum is c ÷ (1 − r÷b) = m·b.
    b in {4, 5, 8, 10}. Not the worked example (c = 2, b = 3, r = 1) or the parent's (c = 6, b = 4, r = 2, x0 = 1). */
 canonical: { x0: -1, b: 5, r: 3, o: 1, side: 1, m: 2 },
 draw: R => retry(() => { const b = R.pick([4, 5, 8, 10]), r = R.int(1, b - 1); return { x0: R.int(-4, 4), b, r, o: R.int(0, r - 1), side: R.int(0, 1), m: R.int(1, 6) }; },
  p => !(p.m * (p.b - p.r) === 6 && p.b === 4 && p.r === 2 && p.x0 === 1), { x0: -1, b: 5, r: 3, o: 1, side: 1, m: 2 }),
 build: ({ x0, b, r, o, side, m }) => { const c = m * (b - r), dr = side ? r : o, dl = side ? o : r, lo = x0 - dl, hi = x0 + dr, rho = r / b, S = m * b; return {
  prompt: `The thermostat model adds up ${cf(c)}${cen(x0)}ᵏ ÷ ${n(b)}ᵏ for k = 0, 1, 2, …, where x is the temperature offset, and it will only be run for offsets from ${n(lo)} to ${n(hi)}. Enter the radius of convergence, then the largest distance |${dist(x0)}| over the interval [${n(lo)}, ${n(hi)}], then the Weierstrass M-test bound (the sum of the Mₖ) that certifies uniform convergence on the interval.`,
  answer: [b, r, S],
  hints: ['Ratio test: divide the (k + 1)-th term by the k-th and take the size. The series converges where that ratio is below 1.', 'The ends of the interval may be at different distances from the centre. Use the farther one for r, so that every term is at most c(r ÷ b)ᵏ in size.'],
  solution: `The ratio of the (k + 1)-th term to the k-th has size |${dist(x0)}| ÷ ${n(b)}, below 1 when the distance from ${n(x0)} is below ${n(b)}: the radius is ${n(b)}. The ends of the interval are ${n(dl)} to the left and ${n(dr)} to the right of ${n(x0)}, so the largest distance is r = ${n(r)}, which is below the radius. Each term is then at most Mₖ = ${n(c)} × (${n(r)} ÷ ${n(b)})ᵏ = ${n(c)} × ${n(rho)}ᵏ, a geometric series with sum ${n(c)} ÷ (1 − ${n(rho)}) = ${n(S)}. By the M-test the series converges uniformly on the interval.`,
  guidance: [
   { prompt: `The ratio of consecutive terms has size |${dist(x0)}| ÷ ${n(b)}. Below what distance from ${n(x0)} does the series converge?`, answer: [b], explanation: `|${dist(x0)}| ÷ ${n(b)} < 1 exactly when |${dist(x0)}| < ${n(b)}, so the radius is ${n(b)}.` },
   { prompt: `The interval [${n(lo)}, ${n(hi)}] has ends at distance ${n(dl)} and ${n(dr)} from ${n(x0)}. What is the larger distance?`, answer: [r], explanation: `The larger of ${n(dl)} and ${n(dr)} is ${n(r)}.` },
   { prompt: `With r = ${n(r)} the bounding ratio is ${n(r)} ÷ ${n(b)} = ${n(rho)}, and Mₖ = ${n(c)} × ${n(rho)}ᵏ. What is the sum of all the Mₖ?`, answer: [S], explanation: `${n(c)} ÷ (1 − ${n(rho)}) = ${n(S)}.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q16', title: 'The weighted series and its ratio',
 brief: 'The core uses a series whose terms carry a growing weight, and the lab must find where it converges and bound it on a safe interval.',
 labels: ['radius of convergence', 'converges at the point (1 or 0)', 'sum of the Mₖ'], tolerance: 0.005,
 gl: [['radius of convergence'], ['converges (1 or 0)'], ['sum of the Mₖ']]
}, {
 /* Terms c(k + 1)(x − x0)ᵏ ÷ bᵏ. The ratio of consecutive terms tends to |x − x0| ÷ b, so the radius is b and the series converges at x1
    exactly when |x1 − x0| < b (never equal). On [x0 − r, x0 + r], Mₖ = c(k + 1)(r÷b)ᵏ with sum c ÷ (1 − r÷b)² = c b² ÷ (b − r)²; pairs (b, r) keep it at most 2 decimals. */
 canonical: { x0: 1, c: 3, b: 5, r: 3, d: 7, s: 1 },
 draw: R => retry(() => { const b = R.pick([2, 4, 5, 8, 10]), r = R.int(1, b - 1); return { x0: R.int(-3, 3), c: R.int(1, 9), b, r, d: R.int(1, 2 * b + 2), s: R.bool() ? 1 : -1 }; },
  p => places(p.c * p.b * p.b / ((p.b - p.r) * (p.b - p.r)), 2) && p.d !== p.b && !(p.c === 2 && p.b === 3), { x0: 1, c: 3, b: 5, r: 3, d: 7, s: 1 }),
 build: ({ x0, c, b, r, d, s }) => { const x1 = x0 + s * d, code = d < b ? 1 : 0, rho = r / b, S = c * b * b / ((b - r) * (b - r)); return {
  prompt: `The simulation core adds up ${cf(c)}(k + 1)${cen(x0)}ᵏ ÷ ${n(b)}ᵏ for k = 0, 1, 2, … . The size of the ratio of consecutive terms is (k + 2) ÷ (k + 1) times |${dist(x0)}| ÷ ${n(b)}, which settles to |${dist(x0)}| ÷ ${n(b)} as k grows; the series converges where that limit is below 1 and diverges where it is above 1. Enter its radius of convergence. Then enter 1 if the series converges at x = ${n(x1)}, 0 if not. Then enter the Weierstrass M-test bound (the sum of the Mₖ) on [${n(x0 - r)}, ${n(x0 + r)}]. You may use this fact: for 0 ≤ ρ < 1, the sum of (k + 1)ρᵏ over k = 0, 1, 2, … is 1 ÷ (1 − ρ)².`,
  answer: [b, code, S],
  hints: ['The ratio limit is below 1 exactly when the distance from the centre is below the radius. Compare the distance of the given point from the centre with the radius.', 'On the interval, |x − x₀| is at most r, so Mₖ = c(k + 1)(r ÷ b)ᵏ. Use the stated fact with ρ = r ÷ b and multiply by c.'],
  solution: `The ratio limit is |${dist(x0)}| ÷ ${n(b)}, below 1 when the distance from ${n(x0)} is below ${n(b)}: the radius is ${n(b)}. The point x = ${n(x1)} is ${n(d)} from ${n(x0)}, which is ${code ? 'below' : 'above'} ${n(b)}, so the series ${code ? 'converges' : 'diverges'} there: enter ${n(code)}. On [${n(x0 - r)}, ${n(x0 + r)}] the distance from ${n(x0)} is at most ${n(r)}, so each term is at most Mₖ = ${n(c)}(k + 1)(${n(r)} ÷ ${n(b)})ᵏ = ${n(c)}(k + 1) × ${n(rho)}ᵏ. By the fact, the sum is ${n(c)} ÷ (1 − ${n(rho)})² = ${n(S)}.`,
  guidance: [
   { prompt: `The ratio limit is |${dist(x0)}| ÷ ${n(b)}. Below what distance from ${n(x0)} does the series converge?`, answer: [b], explanation: `|${dist(x0)}| ÷ ${n(b)} < 1 exactly when |${dist(x0)}| < ${n(b)}, so the radius is ${n(b)}.` },
   { prompt: `The point x = ${n(x1)} is ${n(d)} from ${n(x0)}. Enter 1 if ${n(d)} is below the radius ${n(b)}, 0 if not.`, answer: [code], explanation: `${n(d)} is ${code ? 'below' : 'above'} ${n(b)}, so the series ${code ? 'converges' : 'diverges'} at x = ${n(x1)}.` },
   { prompt: `On the interval the ratio is at most ${n(r)} ÷ ${n(b)} = ${n(rho)}, and Mₖ = ${n(c)}(k + 1) × ${n(rho)}ᵏ. What is the sum of all the Mₖ?`, answer: [S], explanation: `${n(c)} ÷ (1 − ${n(rho)})² = ${n(S)}.` }
  ] }; }
});

/* ---- q39 Metric spaces: distances and open balls [7.1] ---- */

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'Choosing the nearer spare mast',
 brief: 'A relay net has two spare masts and must link to the nearer one, but the lab has to say which metric decides what “nearer” means.',
 labels: ['d(A, B)', 'd(A, C)', 'B nearer (1 or 0)'], tolerance: 0.01,
 gl: [['d(A, B)'], ['d(A, C)'], ['B nearer (1 or 0)']]
}, {
 /* kind 0 euclidean (offsets are 3-4-5, 6-8-10 or 5-12-13 steps so distances are whole), 1 taxicab, 2 maximum. The two distances differ. */
 canonical: { kind: 0, a1: -2, a2: 1, bx: 6, by: -8, cx: -3, cy: 4 },
 draw: R => retry(() => { const kind = R.int(0, 2); let bx, by, cx, cy; if (kind === 0) { [bx, by] = sgn(R, R.pick(TRI)); [cx, cy] = sgn(R, R.pick(TRI)); } else { bx = R.nz(-9, 9); by = R.int(-9, 9); cx = R.nz(-9, 9); cy = R.int(-9, 9); }
   return { kind, a1: R.int(-6, 6), a2: R.int(-6, 6), bx, by, cx, cy }; },
  p => mdist(p.kind, p.bx, p.by) !== mdist(p.kind, p.cx, p.cy), { kind: 0, a1: -2, a2: 1, bx: 6, by: -8, cx: -3, cy: 4 }),
 build: ({ kind, a1, a2, bx, by, cx, cy }) => { const dB = mdist(kind, bx, by), dC = mdist(kind, cx, cy), code = dB < dC ? 1 : 0, B = [a1 + bx, a2 + by], C = [a1 + cx, a2 + cy]; return {
  prompt: `Mast A of the relay net stands at ${pt(a1, a2)} on the outpost grid, and two spare masts stand at B = ${pt(B[0], B[1])} and C = ${pt(C[0], C[1])}. The certificate measures distance with the ${MET[kind]}. Enter d(A, B), then d(A, C), then 1 if B is closer to A than C is, 0 if C is closer (the two distances are different).`,
  answer: [dB, dC, code],
  hints: [MHINT, 'The nearer mast is the one with the smaller distance from A, in the metric the certificate uses.'],
  solution: `For B the gaps are |${n(a1)} − ${par(B[0])}| = ${n(Math.abs(bx))} and |${n(a2)} − ${par(B[1])}| = ${n(Math.abs(by))}. In the ${MET[kind]}, d(A, B) = ${mhow(kind, Math.abs(bx), Math.abs(by))}. For C the gaps are |${n(a1)} − ${par(C[0])}| = ${n(Math.abs(cx))} and |${n(a2)} − ${par(C[1])}| = ${n(Math.abs(cy))}, so d(A, C) = ${mhow(kind, Math.abs(cx), Math.abs(cy))}. ${n(dB)} is ${code ? 'less' : 'more'} than ${n(dC)}, so ${code ? 'B' : 'C'} is closer: enter ${n(code)}.`,
  guidance: [
   { prompt: `What is d(A, B) in the ${MET[kind]}, with A = ${pt(a1, a2)} and B = ${pt(B[0], B[1])}?`, answer: [dB], explanation: `The gaps are ${n(Math.abs(bx))} and ${n(Math.abs(by))}, so d(A, B) = ${mhow(kind, Math.abs(bx), Math.abs(by))}.` },
   { prompt: `What is d(A, C) in the ${MET[kind]}, with C = ${pt(C[0], C[1])}?`, answer: [dC], explanation: `The gaps are ${n(Math.abs(cx))} and ${n(Math.abs(cy))}, so d(A, C) = ${mhow(kind, Math.abs(cx), Math.abs(cy))}.` },
   { prompt: `d(A, B) = ${n(dB)} and d(A, C) = ${n(dC)}. Enter 1 if B is closer to A, 0 if C is.`, answer: [code], explanation: `${n(dB)} is ${code ? 'less' : 'more'} than ${n(dC)}, so ${code ? 'B' : 'C'} is closer.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Driving route against radio range',
 brief: 'A rover can only drive along grid streets but its radio travels in a straight line, so the lab needs both distances and whether the beacon is in range.',
 labels: ['driving distance', 'straight-line distance', 'in range (1 or 0)'], tolerance: 0.01,
 gl: [['driving distance'], ['straight-line distance'], ['in range (1 or 0)']]
}, {
 /* Taxicab = route along streets, euclidean = straight line (3-4-5, 6-8-10 or 5-12-13 steps). Range ρ = D + off, off in −3 … 3 (0 puts the beacon on the edge, which an open ball leaves out). */
 canonical: { p1: 1, p2: -3, dx: -6, dy: 8, off: 2 },
 draw: R => retry(() => { const [dx, dy] = sgn(R, R.pick(TRI)); return { p1: R.int(-6, 6), p2: R.int(-6, 6), dx, dy, off: R.int(-3, 3) }; },
  p => Math.sqrt(p.dx * p.dx + p.dy * p.dy) + p.off > 0, { p1: 1, p2: -3, dx: -6, dy: 8, off: 2 }),
 build: ({ p1, p2, dx, dy, off }) => { const taxi = Math.abs(dx) + Math.abs(dy), D = mdist(0, dx, dy), rho = D + off, code = D < rho ? 1 : 0, q1 = p1 + dx, q2 = p2 + dy; return {
  prompt: `A rover leaves the depot P = ${pt(p1, p2)} for the beacon Q = ${pt(q1, q2)} on the outpost grid. It can only drive along the grid streets, so its driving distance is measured with the taxicab metric. The beacon’s radio is received at every point whose euclidean distance from P is less than ${n(rho)}, which is the open ball B(P, ${n(rho)}) in the euclidean metric. Enter the driving distance d(P, Q), then the straight-line distance d(P, Q) in the euclidean metric, then 1 if Q is inside the open ball B(P, ${n(rho)}) in the euclidean metric, 0 if not.`,
  answer: [taxi, D, code],
  hints: [MHINT, 'The open ball holds the points at distance strictly less than the radius; a point at distance exactly equal to the radius is not in it. Use the euclidean distance for the ball.'],
  solution: `The coordinate gaps are |${n(p1)} − ${par(q1)}| = ${n(Math.abs(dx))} and |${n(p2)} − ${par(q2)}| = ${n(Math.abs(dy))}. Driving (taxicab): ${n(Math.abs(dx))} + ${n(Math.abs(dy))} = ${n(taxi)}. Straight line (euclidean): √(${n(dx * dx)} + ${n(dy * dy)}) = √${n(dx * dx + dy * dy)} = ${n(D)}. Q is in B(P, ${n(rho)}) exactly when the euclidean distance ${n(D)} is less than ${n(rho)}. ${D < rho ? `${n(D)} < ${n(rho)}, so Q is inside` : D === rho ? `${n(D)} equals ${n(rho)}, so Q is on the edge, which an open ball leaves out` : `${n(D)} is more than ${n(rho)}, so Q is outside`}: enter ${n(code)}.`,
  guidance: [
   { prompt: `The gaps between P and Q are ${n(Math.abs(dx))} and ${n(Math.abs(dy))}. What is the driving distance in the taxicab metric?`, answer: [taxi], explanation: `Taxicab adds the gaps: ${n(Math.abs(dx))} + ${n(Math.abs(dy))} = ${n(taxi)}.` },
   { prompt: `What is the straight-line distance in the euclidean metric for the same gaps?`, answer: [D], explanation: `√(${n(dx * dx)} + ${n(dy * dy)}) = √${n(dx * dx + dy * dy)} = ${n(D)}.` },
   { prompt: `The euclidean distance is ${n(D)} and the radio ball has radius ${n(rho)}. Enter 1 if ${n(D)} is strictly less than ${n(rho)}, 0 if not.`, answer: [code], explanation: D < rho ? `${n(D)} < ${n(rho)}, so Q is inside the open ball.` : D === rho ? `${n(D)} is not less than ${n(rho)}: Q is on the edge, which an open ball leaves out.` : `${n(D)} is more than ${n(rho)}, so Q is outside the ball.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q04', title: 'The detour through the middle station',
 brief: 'A message can be sent direct or relayed through a middle station, and the lab must certify that a relay never beats the direct route.',
 labels: ['longest allowed d(P, R)', 'actual d(P, R)', 'how much shorter'], tolerance: 0.01,
 gl: [['longest allowed d(P, R)'], ['actual d(P, R)'], ['how much shorter']]
}, {
 /* kind 1 taxicab, 2 maximum. d(P, R) ≤ d(P, Q) + d(Q, R) (the triangle inequality for a metric); the gap is the slack. */
 canonical: { kind: 1, p1: -3, p2: 2, qx: 5, qy: -4, rx: 2, ry: 6 },
 draw: R => retry(() => ({ kind: R.int(1, 2), p1: R.int(-6, 6), p2: R.int(-6, 6), qx: R.int(-8, 8), qy: R.int(-8, 8), rx: R.int(-8, 8), ry: R.int(-8, 8) }),
  p => (p.qx || p.qy) && (p.rx || p.ry) && (p.qx + p.rx || p.qy + p.ry), { kind: 1, p1: -3, p2: 2, qx: 5, qy: -4, rx: 2, ry: 6 }),
 build: ({ kind, p1, p2, qx, qy, rx, ry }) => { const dPQ = mdist(kind, qx, qy), dQR = mdist(kind, rx, ry), sx = qx + rx, sy = qy + ry, dPR = mdist(kind, sx, sy), bound = dPQ + dQR, slack = bound - dPR, Q = [p1 + qx, p2 + qy], Rr = [Q[0] + rx, Q[1] + ry]; return {
  prompt: `Three relay stations stand at P = ${pt(p1, p2)}, Q = ${pt(Q[0], Q[1])} and R = ${pt(Rr[0], Rr[1])}. The certificate uses the ${MET[kind]}. A metric obeys the triangle inequality d(P, R) ≤ d(P, Q) + d(Q, R): the route through Q is never shorter than the direct one. Enter d(P, Q) + d(Q, R), the longest the triangle inequality allows d(P, R) to be. Then enter the actual d(P, R). Then enter how much shorter the direct distance is than the route through Q (the first answer minus the second).`,
  answer: [bound, dPR, slack],
  hints: [MHINT, 'Work out d(P, Q), d(Q, R) and d(P, R) separately from the coordinate gaps of each pair, then add the first two and compare.'],
  solution: `For P and Q the gaps are ${n(Math.abs(qx))} and ${n(Math.abs(qy))}, so d(P, Q) = ${mhow(kind, Math.abs(qx), Math.abs(qy))} in the ${MET[kind]}. For Q and R the gaps are ${n(Math.abs(rx))} and ${n(Math.abs(ry))}, so d(Q, R) = ${mhow(kind, Math.abs(rx), Math.abs(ry))}. The triangle inequality allows d(P, R) at most ${n(dPQ)} + ${n(dQR)} = ${n(bound)}. For P and R the gaps are ${n(Math.abs(sx))} and ${n(Math.abs(sy))}, so d(P, R) = ${mhow(kind, Math.abs(sx), Math.abs(sy))}. The direct distance is ${n(bound)} − ${n(dPR)} = ${n(slack)} shorter than the route through Q.`,
  guidance: [
   { prompt: `What are d(P, Q) and d(Q, R) added together? The gaps are ${n(Math.abs(qx))} and ${n(Math.abs(qy))} for P and Q, and ${n(Math.abs(rx))} and ${n(Math.abs(ry))} for Q and R.`, answer: [bound], explanation: `d(P, Q) = ${mhow(kind, Math.abs(qx), Math.abs(qy))} and d(Q, R) = ${mhow(kind, Math.abs(rx), Math.abs(ry))}, so the sum is ${n(bound)}.` },
   { prompt: `For P and R the gaps are ${n(Math.abs(sx))} and ${n(Math.abs(sy))}. What is d(P, R)?`, answer: [dPR], explanation: `d(P, R) = ${mhow(kind, Math.abs(sx), Math.abs(sy))}.` },
   { prompt: `The route through Q is ${n(bound)} and the direct distance is ${n(dPR)}. How much shorter is the direct distance?`, answer: [slack], explanation: `${n(bound)} − ${n(dPR)} = ${n(slack)}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Complex analysis [6.2, 7.1] ---- */

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The even-power correction and the maximum metric',
 brief: 'The core’s correction uses only even powers, and the certificate also needs the distance between two relay states under the maximum metric.',
 labels: ['radius of convergence', 'M-test bound', 'd(P, Q)'], tolerance: 0.01,
 gl: [['radius of convergence'], ['M-test bound'], ['d(P, Q)']]
}, {
 /* Terms c(x² ÷ B)ᵏ with B = b²: the ratio has size x² ÷ B, below 1 when |x| < b. On [−r, r], x² ≤ r², Mₖ = c(r² ÷ B)ᵏ; c = m(B − r²) gives the sum m·B. */
 canonical: { b: 4, r: 3, m: 2, p1: 1, p2: -2, dx: -5, dy: 3 },
 draw: R => { const b = R.int(2, 10); return { b, r: R.int(1, b - 1), m: R.int(1, 5), p1: R.int(-6, 6), p2: R.int(-6, 6), dx: R.nz(-9, 9), dy: R.int(-9, 9) }; },
 build: ({ b, r, m, p1, p2, dx, dy }) => { const B = b * b, c = m * (B - r * r), S = m * B, d = mdist(2, dx, dy); return {
  prompt: `The simulation core’s correction adds up ${n(c)}(x² ÷ ${n(B)})ᵏ for k = 0, 1, 2, … . Enter its radius of convergence, then the Weierstrass M-test bound on [${n(-r)}, ${n(r)}]. Then enter the distance from P = ${pt(p1, p2)} to Q = ${pt(p1 + dx, p2 + dy)} in the maximum metric.`,
  answer: [b, S, d],
  hints: ['The ratio of consecutive terms has size x² ÷ B. It is below 1 when x² < B, which tells you how far from 0 the series converges.', 'On [−r, r], x² is at most r², so each term is at most c(r² ÷ B)ᵏ. Sum that geometric series. The maximum metric takes the larger of the two coordinate gaps.'],
  solution: `The size of the ratio of consecutive terms is x² ÷ ${n(B)}, below 1 exactly when x² < ${n(B)}, that is |x| < ${n(b)}: the radius is ${n(b)}. On [${n(-r)}, ${n(r)}], x² ≤ ${n(r * r)}, so each term is at most Mₖ = ${n(c)} × (${n(r * r)} ÷ ${n(B)})ᵏ, a geometric series with ratio ${n(r * r)} ÷ ${n(B)} < 1 and sum ${n(c)} ÷ (1 − ${n(r * r)} ÷ ${n(B)}) = ${n(S)}. The coordinate gaps are ${n(Math.abs(dx))} and ${n(Math.abs(dy))}; in the maximum metric d(P, Q) is ${mhow(2, Math.abs(dx), Math.abs(dy))}.`,
  guidance: [
   { prompt: `The ratio of consecutive terms has size x² ÷ ${n(B)}. What is the radius of convergence?`, answer: [b], explanation: `x² ÷ ${n(B)} < 1 exactly when |x| < ${n(b)}, so the radius is ${n(b)}.` },
   { prompt: `On [${n(-r)}, ${n(r)}], Mₖ = ${n(c)} × (${n(r * r)} ÷ ${n(B)})ᵏ. What is the sum of the Mₖ?`, answer: [S], explanation: `${n(c)} ÷ (1 − ${n(r * r)} ÷ ${n(B)}) = ${n(S)}.` },
   { prompt: `The coordinate gaps are ${n(Math.abs(dx))} and ${n(Math.abs(dy))}. What is d(P, Q) in the maximum metric?`, answer: [d], explanation: `The maximum metric takes the larger gap: ${mhow(2, Math.abs(dx), Math.abs(dy))}.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Is the beacon inside the disc of the series?',
 brief: 'The core will soon evaluate its series at points of the plane, and the lab must say which beacons fall inside the disc where it works.',
 labels: ['radius of convergence', 'distance from the centre', 'inside (1 or 0)'], tolerance: 0.01,
 gl: [['radius of convergence'], ['distance from the centre'], ['inside (1 or 0)']]
}, {
 /* Terms c(−1)ᵏ(x − x0)ᵏ ÷ bᵏ: radius b. The point is (x0 + dx, dy), at euclidean distance D from the centre (x0, 0), D from 3-4-5, 6-8-10, 5-12-13 steps;
    b = D + off with off ≠ 0, so the point is never on the boundary. */
 canonical: { x0: 2, c: 4, dx: -3, dy: 4, off: -2 },
 draw: R => retry(() => { const [dx, dy] = sgn(R, R.pick(TRI)); return { x0: R.int(-4, 4), c: R.int(1, 9), dx, dy, off: R.pick([-3, -2, -1, 1, 2, 3]) }; },
  p => Math.sqrt(p.dx * p.dx + p.dy * p.dy) + p.off >= 2, { x0: 2, c: 4, dx: -3, dy: 4, off: -2 }),
 build: ({ x0, c, dx, dy, off }) => { const D = mdist(0, dx, dy), b = D + off, code = D < b ? 1 : 0; return {
  prompt: `For the final certificate the simulation core sums ${cf(c)}(−1)ᵏ${cen(x0)}ᵏ ÷ ${n(b)}ᵏ for k = 0, 1, 2, … . Complex analysis will next evaluate such a series at points of the plane. Take as given that it then converges at the points inside the open ball, in the euclidean metric, whose centre is (${n(x0)}, 0) and whose radius is the series’ radius of convergence, and diverges at the points outside it. Enter the radius of convergence, then the euclidean distance from the centre (${n(x0)}, 0) to the point (${n(x0 + dx)}, ${n(dy)}), then 1 if the series converges at that point, 0 if not.`,
  answer: [b, D, code],
  hints: ['The sign (−1)ᵏ never changes the size of a term, so the ratio test sees |x − x₀| ÷ b.', 'The gaps from the centre to the point are the horizontal and vertical differences. Euclidean distance: square, add, take the root. The point converges when that distance is less than the radius.'],
  solution: `The size of the ratio of consecutive terms is |${dist(x0)}| ÷ ${n(b)}, below 1 exactly when the distance from ${n(x0)} is below ${n(b)}: the radius is ${n(b)}. The gaps from the centre (${n(x0)}, 0) to the point (${n(x0 + dx)}, ${n(dy)}) are ${n(Math.abs(dx))} and ${n(Math.abs(dy))}, so the euclidean distance is √(${n(dx * dx)} + ${n(dy * dy)}) = √${n(dx * dx + dy * dy)} = ${n(D)}. The point is inside the open ball when ${n(D)} < ${n(b)}. ${code ? `That is true` : `That is false`}, so the series ${code ? 'converges' : 'diverges'} there: enter ${n(code)}.`,
  guidance: [
   { prompt: `The ratio of consecutive terms has size |${dist(x0)}| ÷ ${n(b)}. What is the radius of convergence?`, answer: [b], explanation: `|${dist(x0)}| ÷ ${n(b)} < 1 exactly when |${dist(x0)}| < ${n(b)}, so the radius is ${n(b)}.` },
   { prompt: `What is the euclidean distance from (${n(x0)}, 0) to (${n(x0 + dx)}, ${n(dy)}), where the gaps are ${n(Math.abs(dx))} and ${n(Math.abs(dy))}?`, answer: [D], explanation: `√(${n(dx * dx)} + ${n(dy * dy)}) = √${n(dx * dx + dy * dy)} = ${n(D)}.` },
   { prompt: `The distance is ${n(D)} and the radius is ${n(b)}. Enter 1 if the point is inside the open ball (distance less than the radius), 0 if not.`, answer: [code], explanation: `${n(D)} is ${code ? 'less' : 'more'} than ${n(b)}, so the point is ${code ? 'inside' : 'outside'} and the series ${code ? 'converges' : 'diverges'} there.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q36', title: 'The worst gap after N terms',
 brief: 'The core keeps only the first N terms of its series, and the lab must certify the worst gap that leaves on the whole working range.',
 labels: ['radius of convergence', 'uniform norm', 'smallest N'], tolerance: 0.0005,
 gl: [['radius of convergence'], ['uniform norm'], ['smallest N']]
}, {
 /* Terms c xᵏ ÷ bᵏ on [0, r], c = m(b − r) > 0. f − S_N = Σ_{k ≥ N} c(x÷b)ᵏ = c(x÷b)ᴺ ÷ (1 − x÷b), which rises with x, so ‖f − S_N‖_u = m b (r÷b)ᴺ = m rᴺ ÷ b^(N−1).
    N0 in {2, 3, 4}, at most 3 decimals; the smallest N with m rᴺ d < e b^(N−1) is found in whole numbers, 2 <= N <= 80. */
 canonical: { b: 5, r: 3, m: 4, N0: 3, ei: 1 },
 draw: R => retry(() => { const b = R.pick([2, 4, 5, 8, 10]); return { b, r: R.int(1, b - 1), m: R.int(1, 6), N0: R.int(2, 4), ei: R.int(0, 4) }; },
  p => { const N = firstN(p.m, p.r, p.b, EPS[p.ei][0], EPS[p.ei][1]); return places(p.m * Math.pow(p.r, p.N0) / Math.pow(p.b, p.N0 - 1), 3) && N !== null && N >= 2 && N <= 80; }, { b: 5, r: 3, m: 4, N0: 3, ei: 1 }),
 build: ({ b, r, m, N0, ei }) => { const [e, d] = EPS[ei], eps = e / d, c = m * (b - r), rho = r / b, norm = Math.round(m * Math.pow(r, N0) / Math.pow(b, N0 - 1) * 1e6) / 1e6, N = firstN(m, r, b, e, d), S = m * b; return {
  prompt: `The simulation core’s correction adds up ${cf(c)}xᵏ ÷ ${n(b)}ᵏ for k = 0, 1, 2, …, and f(x) is its sum for 0 ≤ x ≤ ${n(r)}. Let S_N(x) be the sum of its first N terms (k = 0 to N − 1). Every term is positive for these x, so f(x) − S_N(x) is the sum of the terms that are left, and it grows as x grows. Enter the radius of convergence, then the uniform norm ‖f − S_N‖_u over 0 ≤ x ≤ ${n(r)} for N = ${n(N0)}, then the smallest N for which ‖f − S_N‖_u < ${n(eps)} (type it without commas).`,
  answer: [b, norm, N],
  hints: ['The ratio of consecutive terms has size x ÷ b, which tells you where the series converges. The left-over terms form a geometric series starting at k = N.', 'The gap grows with x, so the uniform norm is its value at the right-hand end x = r. A geometric series starting at k = N with ratio ρ = r ÷ b and first term c ρᴺ adds up to c ρᴺ ÷ (1 − ρ).'],
  solution: `The ratio of consecutive terms has size x ÷ ${n(b)}, below 1 when |x| < ${n(b)}: the radius is ${n(b)}. For 0 ≤ x ≤ ${n(r)}, f(x) − S_N(x) = the sum of ${n(c)}(x ÷ ${n(b)})ᵏ from k = N on = ${n(c)}(x ÷ ${n(b)})ᴺ ÷ (1 − x ÷ ${n(b)}), which rises with x, so the uniform norm is its value at x = ${n(r)}: ${n(c)} × ${n(rho)}ᴺ ÷ (1 − ${n(rho)}) = ${n(S)} × ${n(rho)}ᴺ. For N = ${n(N0)} that is ${n(norm)}. The values ${n(S)} × ${n(rho)}ᴺ fall as N grows; trying whole numbers, N = ${n(N - 1)} is not below ${n(eps)} and N = ${n(N)} is, so the smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `The ratio of consecutive terms has size x ÷ ${n(b)}. What is the radius of convergence?`, answer: [b], explanation: `x ÷ ${n(b)} < 1 exactly when |x| < ${n(b)}, so the radius is ${n(b)}.` },
   { prompt: `The gap f − S_N is largest at x = ${n(r)}, where it equals ${n(c)} × ${n(rho)}ᴺ ÷ (1 − ${n(rho)}) = ${n(S)} × ${n(rho)}ᴺ. What is ‖f − S_N‖_u for N = ${n(N0)}?`, answer: [norm], explanation: `${n(S)} × ${n(rho)}^${n(N0)} = ${n(norm)}.` },
   { prompt: `What is the smallest whole number N for which ${n(S)} × ${n(rho)}ᴺ is below ${n(eps)}?`, answer: [N], explanation: `The values fall as N grows. At N = ${n(N - 1)} the value is not below ${n(eps)} and at N = ${n(N)} it is, so the smallest N is ${n(N)}.` }
  ] }; }
});

})();
