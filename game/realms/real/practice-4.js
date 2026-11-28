/* Real analysis practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p4.js. */
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
/* Subscript digits (s₄, x₁₀); signed constants (" + 3", " − 3", "" for 0); a linear expression ax + b with no written
   coefficient 1 and no "+ 0"; "+ 5" or "− 5" for subtracting a value without writing "− −5". */
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = k => String(k).split('').map(ch => SUB[Number(ch)]).join('');
const cst = v => v === 0 ? '' : ` ${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;
const lin = (a, b, x = 'x') => `${a === 1 ? '' : a === -1 ? '−' : n(a)}${x}${cst(b)}`;
const mns = v => v < 0 ? `+ ${n(-v)}` : `− ${n(v)}`;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => a / gcd(a, b) * b;
const tidy = G.tidy;
/* True when x has at most k decimal places, so n() shows it exactly. */
const short = (x, k = 4) => Math.abs(Math.round(x * Math.pow(10, k)) / Math.pow(10, k) - x) < 1e-9;
/* Bounded retry: at most 1000 tries, then the canonical parameters (wave 2 rule). */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* Ordinals (1st, 2nd, 3rd, 11th) and superscript digits for an exponent (3⁴). */
const ord = k => { const t = k % 100, u = k % 10; return k + ((t >= 11 && t <= 13) ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
const SUP_N = k => String(k).split('').map(ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(ch)]).join('');

/* ---- q16 Ratio, root and alternating series tests [2.6] ---- */

/* Root test on aₙ = ((pn + a) ÷ (qn + b))ⁿ: the n-th root of |aₙ| is the bracket itself, which tends to p ÷ q (p, q coprime,
   p ≠ q), so the code is 1 when p < q and 0 when p > q. Series B: (−1)ⁿ⁺¹ c ÷ (n + d), whose bound c ÷ (N + 1 + d) is below e
   exactly when N + 1 + d > K = c ÷ e, so the smallest N is K − d. Not the parent's worked example (n × 3ⁿ ÷ 4ⁿ). */
mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The repeater echo audit',
 brief: 'Echo readings from a repeater arrive as two series, and the audit needs one judged by its n-th roots and the other pinned to a stated accuracy.',
 labels: ['root-test numerator', 'root-test denominator', '1 converges, 0 diverges', 'smallest N'], tolerance: 0.01,
 gl: [['numerator'], ['denominator'], ['1 converges, 0 diverges'], ['N']]
}, {
 canonical: { p: 3, q: 5, a: 2, b: 1, c: 6, d: 2, e: 0.02 },
 draw: R => tries(() => ({ p: R.int(2, 9), q: R.int(2, 9), a: R.int(1, 6), b: R.int(1, 6), c: R.int(2, 9), d: R.int(1, 5), e: R.pick([0.1, 0.05, 0.02, 0.01]) }),
  p => p.p !== p.q && gcd(p.p, p.q) === 1, GEN.q16b.canonical),
 build: ({ p, q, a, b, c, d, e }) => { const code = p < q ? 1 : 0, K = Math.round(c / e), N = K - d, base = `(${lin(p, a, 'n')}) ÷ (${lin(q, b, 'n')})`; return {
  prompt: `Two echo series are logged at a repeater. Series A has terms aₙ = (${base})ⁿ, for n = 1, 2, 3, …. A ratio of two expressions of the form (a number × n + a number) tends to the ratio of the numbers in front of n. The root test looks at L, the limit of the n-th root of |aₙ|: if L < 1 then Σ aₙ converges, and if L > 1 it diverges. Enter L as a fraction in lowest terms, numerator then denominator, then 1 if the root test shows that Σ aₙ converges, or 0 if it shows that Σ aₙ diverges. Series B has terms (−1)ⁿ⁺¹ × ${n(c)} ÷ (n + ${n(d)}), with sum S. Its sizes shrink to 0, so S lies within the next term of every partial sum: |S − s_N| ≤ ${n(c)} ÷ (N + 1 + ${n(d)}). Enter the smallest N for which this bound guarantees |S − s_N| < ${n(e)}.`,
  answer: [p, q, code, N],
  hints: ['The n-th root undoes the n-th power, so the n-th root of |aₙ| is the expression inside the brackets. Only the numbers in front of n matter as n grows.', 'Root test: L below 1 means convergence, above 1 means divergence. For series B, solve the bound inequality for N + 1 plus the shift first, then take the shift and the 1 away.'],
  solution: `The n-th root of |aₙ| is (${base}) itself. The numbers in front of n are ${n(p)} and ${n(q)}, so it tends to ${n(p)}/${n(q)}, which is in lowest terms: L = ${n(p)}/${n(q)}. ${code ? `This is below 1, so by the root test Σ aₙ converges: 1.` : `This is above 1, so by the root test Σ aₙ diverges: 0.`} For series B, ${n(c)} ÷ (N + 1 + ${n(d)}) < ${n(e)} means N + 1 + ${n(d)} > ${n(c)} ÷ ${n(e)} = ${n(K)}, so N + 1 + ${n(d)} is at least ${n(K + 1)} and N is at least ${n(N)}. The smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `For large n, (${base}) tends to the ratio of the numbers in front of n. What is the numerator of that ratio?`, answer: [p], explanation: `The number in front of n on top is ${n(p)}, so the numerator is ${n(p)}.` },
   { prompt: `Now the bottom: what is the denominator of that ratio, the number in front of n below?`, answer: [q], explanation: `The number in front of n below is ${n(q)}, so L = ${n(p)}/${n(q)}, already in lowest terms.` },
   { prompt: `L = ${n(p)}/${n(q)}. Enter 1 if the root test shows convergence, 0 if it shows divergence.`, answer: [code], explanation: code ? `${n(p)}/${n(q)} < 1, so Σ aₙ converges: 1.` : `${n(p)}/${n(q)} > 1, so Σ aₙ diverges: 0.` },
   { prompt: `The bound ${n(c)} ÷ (N + 1 + ${n(d)}) < ${n(e)} needs N + 1 + ${n(d)} > ${n(c)} ÷ ${n(e)} = ${n(K)}. What is the smallest whole number N that does it?`, answer: [N], explanation: `N + 1 + ${n(d)} must be at least ${n(K + 1)}, so N is at least ${n(K + 1)} − ${n(d)} − 1 = ${n(N)}.` }
  ] }; }
});

/* The n-th correction has size c ÷ n²; the bound c ÷ (N + 1)² is below e exactly when (N + 1)² > c ÷ e = K², so N = K.
   c = e × K² is a whole number, K ≤ 31 so that K² is below 1000. Not the parent's worked example. */
mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'The correction time budget',
 brief: 'The relay applies its corrections one at a time, and the shift supervisor needs to know how many to schedule and how long they will take.',
 labels: ['smallest N', 'total minutes'], tolerance: 0.01,
 gl: [['c ÷ ε'], ['N'], ['total minutes']]
}, {
 canonical: { c: 4, K: 20, e: 0.01, t: 3 },
 draw: R => tries(() => ({ K: R.int(4, 31), e: R.pick([0.01, 0.04, 0.09, 0.1, 0.16, 0.25]), t: R.int(2, 9) }),
  p => { const c = tidy(p.e * p.K * p.K); p.c = c; return Number.isInteger(c) && c >= 2 && c <= 30; }, GEN.q16c.canonical),
 build: ({ c, K, e, t }) => { const N = K, time = N * t; return {
  prompt: `A relay applies a chain of corrections one after another, alternately up and down, and the n-th correction has size ${n(c)} ÷ n² millivolts, for n = 1, 2, 3, …. The corrections add up to a total S. The sizes shrink to 0, so S lies within the next correction of every partial sum: |S − s_N| ≤ ${n(c)} ÷ (N + 1)². The certificate needs the error below ${n(e)} millivolts, and each correction takes ${n(t)} minutes to apply. Enter the smallest number of corrections N for which this bound guarantees |S − s_N| < ${n(e)}, then the total minutes needed to apply those N corrections.`,
  answer: [N, time],
  hints: ['The bound is the size of the next correction. Put it below the allowed error and solve for (N + 1)².', 'Take the square root: N + 1 must be larger than the square root of (the size constant ÷ the allowed error). The time is the number of corrections times the time for one.'],
  solution: `The bound ${n(c)} ÷ (N + 1)² < ${n(e)} needs (N + 1)² > ${n(c)} ÷ ${n(e)} = ${n(K * K)}, so N + 1 > ${n(K)}. The first whole number above ${n(K)} for N + 1 is ${n(K + 1)}, so the smallest N is ${n(N)}. Applying ${n(N)} corrections at ${n(t)} minutes each takes ${n(N)} × ${n(t)} = ${n(time)} minutes.`,
  guidance: [
   { prompt: `The bound ${n(c)} ÷ (N + 1)² < ${n(e)} needs (N + 1)² to be larger than ${n(c)} ÷ ${n(e)}. What is ${n(c)} ÷ ${n(e)}?`, answer: [K * K], explanation: `${n(c)} ÷ ${n(e)} = ${n(K * K)}, so (N + 1)² must be larger than ${n(K * K)}.` },
   { prompt: `(N + 1)² > ${n(K * K)} means N + 1 > ${n(K)}, since ${n(K)} × ${n(K)} = ${n(K * K)}. What is the smallest whole number N?`, answer: [N], explanation: `N + 1 must be at least ${n(K + 1)}, so N = ${n(N)}. N = ${n(K - 1)} would make the bound exactly ${n(e)}, which is not below it.` },
   { prompt: `Each correction takes ${n(t)} minutes. How many minutes do ${n(N)} corrections take?`, answer: [time], explanation: `${n(N)} × ${n(t)} = ${n(time)} minutes.` }
  ] }; }
});

/* Ratio test on |aₙ| = (n + a) pⁿ ÷ qⁿ: the ratio is ((n + 1 + a) ÷ (n + a)) × p ÷ q → p ÷ q. Series B: (−1)ⁿ⁺¹ c ÷ (n(n + 1)),
   bound c ÷ ((N + 1)(N + 2)), with c ÷ e = K(K + 1); N = K because (K + 1)(K + 2) > K(K + 1) and K(K + 1) is only equal. */
mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q14', title: 'Signed echoes and a tight bound',
 brief: 'A long relay logs signed echoes, and the audit must settle whether they add up absolutely and how many terms pin down a second chain.',
 labels: ['ratio numerator', 'ratio denominator', '1 absolute, 0 diverges', 'smallest N'], tolerance: 0.01,
 gl: [['numerator'], ['denominator'], ['1 absolute, 0 diverges'], ['N']]
}, {
 canonical: { p: 7, q: 5, a: 3, c: 9, K: 9, e: 0.1 },
 draw: R => tries(() => ({ p: R.int(2, 9), q: R.int(2, 9), a: R.int(1, 6), K: R.int(4, 30), e: R.pick([0.5, 0.25, 0.2, 0.1, 0.05, 0.02, 0.01]) }),
  p => { const c = tidy(p.e * p.K * (p.K + 1)); p.c = c; return p.p !== p.q && gcd(p.p, p.q) === 1 && Number.isInteger(c) && c >= 2 && c <= 60; }, GEN.q16d.canonical),
 build: ({ p, q, a, c, K, e }) => { const code = p < q ? 1 : 0, M = K * (K + 1), N = K; return {
  prompt: `The relay also logs signed echoes. Series A has terms aₙ = (−1)ⁿ × (n + ${n(a)}) × ${n(p)}ⁿ ÷ ${n(q)}ⁿ, for n = 1, 2, 3, …. Apply the ratio test to the sizes |aₙ|: if the limit L of |aₙ₊₁ ÷ aₙ| is below 1, then Σ aₙ converges absolutely, and if L is above 1, then Σ aₙ diverges. Enter L as a fraction in lowest terms, numerator then denominator, then 1 if Σ aₙ converges absolutely, or 0 if it diverges. Series B has terms (−1)ⁿ⁺¹ × ${n(c)} ÷ (n(n + 1)), with sum S. Its sizes shrink to 0, so |S − s_N| ≤ ${n(c)} ÷ ((N + 1)(N + 2)). Enter the smallest N for which this bound guarantees |S − s_N| < ${n(e)}.`,
  answer: [p, q, code, N],
  hints: ['Divide the size of term n + 1 by the size of term n. The signs drop out, and (n + 1 + shift) ÷ (n + shift) tends to 1.', 'Compare L with 1. For series B, (N + 1)(N + 2) grows with N: find where it first passes the constant divided by the allowed error.'],
  solution: `|aₙ₊₁ ÷ aₙ| = ((n + 1 + ${n(a)}) ÷ (n + ${n(a)})) × ${n(p)} ÷ ${n(q)}. The first factor tends to 1, so L = ${n(p)}/${n(q)}, in lowest terms. ${code ? `This is below 1, so Σ aₙ converges absolutely: 1.` : `This is above 1, so by the ratio test Σ aₙ diverges: 0.`} For series B, ${n(c)} ÷ ((N + 1)(N + 2)) < ${n(e)} needs (N + 1)(N + 2) > ${n(c)} ÷ ${n(e)} = ${n(M)}. Since ${n(K)} × ${n(K + 1)} = ${n(M)}, N + 1 = ${n(K)} only reaches ${n(M)}, which is not enough, while N + 1 = ${n(K + 1)} gives ${n(K + 1)} × ${n(K + 2)}, which is more. The smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `|aₙ₊₁ ÷ aₙ| = ((n + 1 + ${n(a)}) ÷ (n + ${n(a)})) × ${n(p)} ÷ ${n(q)}. The first factor tends to 1. What is the numerator of L?`, answer: [p], explanation: `L = 1 × ${n(p)} ÷ ${n(q)}, so the numerator is ${n(p)}.` },
   { prompt: `What is the denominator of L, in lowest terms?`, answer: [q], explanation: `L = ${n(p)}/${n(q)}, and ${n(p)} and ${n(q)} share no factor, so the denominator is ${n(q)}.` },
   { prompt: `L = ${n(p)}/${n(q)}. Enter 1 if Σ aₙ converges absolutely, 0 if it diverges.`, answer: [code], explanation: code ? `${n(p)}/${n(q)} < 1, so the sizes add up to a finite total: absolute convergence, 1.` : `${n(p)}/${n(q)} > 1, so the sizes grow in the long run and Σ aₙ diverges: 0.` },
   { prompt: `The bound needs (N + 1)(N + 2) > ${n(c)} ÷ ${n(e)} = ${n(M)}. What is the smallest whole number N?`, answer: [N], explanation: `${n(K)} × ${n(K + 1)} = ${n(M)} is not more than ${n(M)}, so N + 1 = ${n(K)} fails. N + 1 = ${n(K + 1)} gives ${n(K + 1)} × ${n(K + 2)} = ${n((K + 1) * (K + 2))}, which passes. So N = ${n(N)}.` }
  ] }; }
});

/* ---- q17 Chapter review: a relay of corrections [2.5, 2.6] ---- */

/* pₙ = (−1)ⁿ⁺¹ k ÷ (mn + d) (kind 0, conditional, code 0) or (−1)ⁿ⁺¹ k ÷ (n² + d) (kind 1, absolute, code 1). The error bound after N terms
   is k ÷ D with D the bottom at n = N + 1; k ÷ D has at most four decimals. kind 1 does not use m. Not the parent's worked example. */
mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The pressure line audit',
 brief: 'A pressure line logs a signed correction at every checkpoint, and the audit needs to know how the corrections add up and how far a short sum can be wrong.',
 labels: ['1 absolute, 0 conditional', 'error bound'], tolerance: 0.00005,
 gl: [['1 converges, 0 diverges'], ['bottom at the next term'], ['error bound']]
}, {
 canonical: { kind: 0, k: 7, m: 3, d: 2, N: 5 },
 draw: R => tries(() => ({ kind: R.int(0, 1), k: R.int(2, 9), m: R.int(2, 4), d: R.int(1, 4), N: R.int(2, 8) }),
  p => { if (p.kind === 1) p.m = 0; const D = p.kind === 0 ? p.m * (p.N + 1) + p.d : (p.N + 1) * (p.N + 1) + p.d; return short(p.k / D); }, GEN.q17b.canonical),
 build: ({ kind, k, m, d, N }) => { const D = kind === 0 ? m * (N + 1) + d : (N + 1) * (N + 1) + d, bound = tidy(k / D), code = kind === 1 ? 1 : 0, den = kind === 0 ? lin(m, d, 'n') : `n²${cst(d)}`, NN = sub(N), nxt = kind === 0 ? `${n(m)} × ${n(N + 1)}${cst(d)}` : `${n(N + 1)}²${cst(d)}`; return {
  prompt: `A pressure line logs a correction at each checkpoint n = 1, 2, 3, …. The n-th correction is pₙ = (−1)ⁿ⁺¹ × ${n(k)} ÷ (${den}), so the corrections alternate in sign and their sizes decrease to 0. Let S be the sum of all of them. Enter 1 if the sizes add up to a finite total, Σ |pₙ| converging (so Σ pₙ converges absolutely), or 0 if Σ |pₙ| diverges (so Σ pₙ converges only conditionally). Then enter the largest error |S − s${NN}| can have after ${n(N)} corrections, as the alternating series estimate guarantees.`,
  answer: [code, bound],
  hints: ['Compare the sizes |pₙ| with a p-series: a multiple of 1 ÷ n diverges, and a multiple of 1 ÷ n² converges.', 'The alternating series estimate: the error after N terms is at most the size of term N + 1, so put n = N + 1 into |pₙ| and work the number out.'],
  solution: `${kind === 0 ? `For n ≥ 1, ${lin(m, d, 'n')} ≤ ${n(m + d)}n, so |pₙ| = ${n(k)} ÷ (${den}) ≥ ${n(k)} ÷ (${n(m + d)}n), a multiple of the harmonic series, which diverges. So Σ |pₙ| diverges, and the series, whose terms alternate and shrink to 0, converges only conditionally: 0.` : `For n ≥ 1, n²${cst(d)} ≥ n², so |pₙ| ≤ ${n(k)} ÷ n², a p-series with p = 2 > 1, which converges. By comparison Σ |pₙ| converges, so the series converges absolutely: 1.`} The sizes decrease to 0, so |S − s${NN}| ≤ |p${sub(N + 1)}| = ${n(k)} ÷ (${nxt}) = ${n(k)} ÷ ${n(D)} = ${n(bound)}.`,
  guidance: [
   { prompt: kind === 0 ? `Compare |pₙ| = ${n(k)} ÷ (${den}) with a multiple of 1 ÷ n. Enter 1 if Σ |pₙ| converges, 0 if it diverges.` : `Compare |pₙ| = ${n(k)} ÷ (${den}) with ${n(k)} ÷ n², a multiple of a p-series. Enter 1 if Σ |pₙ| converges, 0 if it diverges.`, answer: [code], explanation: code ? `${n(k)} ÷ (${den}) ≤ ${n(k)} ÷ n², a p-series with p = 2 > 1, so Σ |pₙ| converges: 1.` : `${n(k)} ÷ (${den}) ≥ ${n(k)} ÷ (${n(m + d)}n), a multiple of the harmonic series, so Σ |pₙ| diverges: 0.` },
   { prompt: `The error after ${n(N)} terms is at most the size of the next term, |p${sub(N + 1)}|. What is the bottom ${den} for n = ${n(N + 1)}?`, answer: [D], explanation: `${nxt} = ${n(D)}.` },
   { prompt: `What is the bound |p${sub(N + 1)}| = ${n(k)} ÷ ${n(D)}?`, answer: [bound], explanation: `${n(k)} ÷ ${n(D)} = ${n(bound)}.` }
  ] }; }
});

/* cₙ = (−1)ⁿ⁺¹ k ÷ (n + d)ᵖ with p = 1 (conditional, 0) or p = 2 (absolute, 1). k ÷ ε = Kᵖ, so the smallest N with
   k ÷ (N + 1 + d)ᵖ < ε is N = K − d. Total time N × t stays below 1000 so no "without commas" is needed. */
mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'Sealing the last chain',
 brief: 'Before the relay’s last chain is sealed, the lab must say how it converges, how many corrections to apply, and how long that will take.',
 labels: ['1 absolute, 0 conditional', 'smallest N', 'total minutes'], tolerance: 0.01,
 gl: [['1 or 0'], ['N'], ['total minutes']]
}, {
 canonical: { p: 2, k: 4, d: 2, K: 10, e: 0.04, t: 3 },
 draw: R => tries(() => { const p = R.int(1, 2), d = R.int(1, 3), t = R.int(2, 9); if (p === 1) { const k = R.int(2, 9), e = R.pick([0.5, 0.25, 0.1, 0.05]); return { p, k, d, K: Math.round(k / e), e, t }; }
   const K = R.int(6, 30), e = R.pick([0.01, 0.04, 0.09, 0.1, 0.16, 0.25]); return { p, k: tidy(e * K * K), d, K, e, t }; },
  p => Number.isInteger(p.k) && p.k >= 2 && p.k <= 30 && p.K - p.d >= 3 && (p.K - p.d) * p.t < 1000, GEN.q17c.canonical),
 build: ({ p, k, d, K, e, t }) => { const N = K - d, time = N * t, code = p === 2 ? 1 : 0, pw = p === 2 ? '²' : '', big = p === 2 ? K * K : K; return {
  prompt: `Before the relay’s last chain is sealed, the lab must know its sum to within ${n(e)}. The chain’s n-th correction is cₙ = (−1)ⁿ⁺¹ × ${n(k)} ÷ (n + ${n(d)})${pw}, for n = 1, 2, 3, …, with sum S. The corrections are applied in order and each takes ${n(t)} minutes. Their sizes decrease to 0. Enter 1 if Σ cₙ converges absolutely, or 0 if it converges only conditionally. Then enter the smallest number of corrections N for which the alternating series estimate (|S − s_N| is at most the size of term N + 1) guarantees |S − s_N| < ${n(e)}. Finally enter the total minutes needed to apply those N corrections.`,
  answer: [code, N, time],
  hints: ['Compare the sizes with a p-series: a multiple of 1 ÷ n diverges, a multiple of 1 ÷ n² converges.', 'The size of term N + 1 is the constant divided by (N + 1 + shift) to the power of the exponent. Put it below the allowed error, solve for N + 1 + shift (take a square root if the exponent is 2), then take away the shift and the 1. The time is N times the time for one correction.'],
  solution: `${p === 2 ? `|cₙ| = ${n(k)} ÷ (n + ${n(d)})² ≤ ${n(k)} ÷ n², a p-series with p = 2 > 1, so Σ |cₙ| converges and the series converges absolutely: 1.` : `For n ≥ 1, n + ${n(d)} ≤ ${n(1 + d)}n, so |cₙ| ≥ ${n(k)} ÷ (${n(1 + d)}n), a multiple of the harmonic series, which diverges. The series converges only conditionally: 0.`} The size of term N + 1 is ${n(k)} ÷ (N + 1 + ${n(d)})${pw}, and it is below ${n(e)} when ${p === 2 ? `(N + 1 + ${n(d)})² > ${n(k)} ÷ ${n(e)} = ${n(big)}, that is N + 1 + ${n(d)} > ${n(K)}` : `N + 1 + ${n(d)} > ${n(k)} ÷ ${n(e)} = ${n(K)}`}. So N + 1 + ${n(d)} is at least ${n(K + 1)}, and the smallest N is ${n(K)} − ${n(d)} = ${n(N)}. Applying ${n(N)} corrections at ${n(t)} minutes each takes ${n(time)} minutes.`,
  guidance: [
   { prompt: p === 2 ? `Compare |cₙ| = ${n(k)} ÷ (n + ${n(d)})² with ${n(k)} ÷ n². Enter 1 if Σ |cₙ| converges, 0 if it diverges.` : `Compare |cₙ| = ${n(k)} ÷ (n + ${n(d)}) with a multiple of 1 ÷ n. Enter 1 if Σ |cₙ| converges, 0 if it diverges.`, answer: [code], explanation: p === 2 ? `${n(k)} ÷ (n + ${n(d)})² ≤ ${n(k)} ÷ n², a p-series with p = 2 > 1, so Σ |cₙ| converges: 1.` : `${n(k)} ÷ (n + ${n(d)}) ≥ ${n(k)} ÷ (${n(1 + d)}n), a multiple of the harmonic series, so Σ |cₙ| diverges: 0.` },
   { prompt: `The bound ${n(k)} ÷ (N + 1 + ${n(d)})${pw} < ${n(e)} needs N + 1 + ${n(d)} to be larger than ${n(K)}. What is the smallest whole number N?`, answer: [N], explanation: `N + 1 + ${n(d)} must be at least ${n(K + 1)}, so N = ${n(K + 1)} − ${n(d)} − 1 = ${n(N)}.` },
   { prompt: `Each correction takes ${n(t)} minutes. How many minutes do ${n(N)} corrections take?`, answer: [time], explanation: `${n(N)} × ${n(t)} = ${n(time)} minutes.` }
  ] }; }
});

/* Geometric comparison for the sizes k ÷ (qⁿ + c) ≤ bₙ = k ÷ qⁿ: Σ bₙ = k ÷ (q − 1); sharper |c₁| + (Σ bₙ − b₁). k is a multiple of
   lcm(q − 1, q, q + c), so every bound before the last is whole; the error k ÷ (q^(N+1) + c) has at most four decimals.
   Not the parent's worked example, and not q15's. */
mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q15', title: 'Bounding the relay two ways',
 brief: 'A signed echo chain has no tidy sum, so the audit bounds its total size by comparison and then bounds the error of a short sum.',
 labels: ['comparison bound', 'sharper bound', 'error bound'], tolerance: 0.00005,
 gl: [['Σ bₙ'], ['|c₁|'], ['sharper bound'], ['error bound']]
}, {
 canonical: { q: 3, c: 3, N: 2, k: 12 },
 draw: R => tries(() => { const q = R.int(2, 5), c = R.int(1, 5); return { q, c, N: R.int(2, 5), k: lcm(lcm(q - 1, q), q + c) * R.int(1, 8) }; },
  p => short(p.k / (Math.pow(p.q, p.N + 1) + p.c)) && p.k <= 600, GEN.q17d.canonical),
 build: ({ q, c, N, k }) => { const B = k / (q - 1), b1 = k / q, a1 = k / (q + c), S2 = a1 + B - b1, D = Math.pow(q, N + 1) + c, err = tidy(k / D), NN = sub(N); return {
  prompt: `The relay’s signed echo chain is cₙ = (−1)ⁿ⁺¹ × ${n(k)} ÷ (${n(q)}ⁿ + ${n(c)}), for n = 1, 2, 3, …, with sum S. Compare the sizes |cₙ| with bₙ = ${n(k)} ÷ ${n(q)}ⁿ, each of which is at least as big as |cₙ|. Enter first the upper bound on Σ |cₙ| that the whole comparison series Σ bₙ gives, then the sharper upper bound |c₁| + (b₂ + b₃ + b₄ + …), which keeps the first size exact. Finally enter the largest error |S − s${NN}| can have after ${n(N)} terms, as the alternating series estimate guarantees (the sizes decrease to 0).`,
  answer: [B, S2, err],
  hints: ['Σ bₙ is geometric: its sum is its first term divided by 1 minus its ratio. For the sharper bound, swap its first term for the exact first size |c₁|.', 'The error after N terms is at most the size of the next term, so put n = N + 1 into |cₙ|.'],
  solution: `Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} = ${n(b1)} and ratio 1 ÷ ${n(q)}, so it sums to ${n(b1)} ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(B)}. Every |cₙ| is at most bₙ, so Σ |cₙ| ≤ ${n(B)}. For the sharper bound, |c₁| = ${n(k)} ÷ (${n(q)} + ${n(c)}) = ${n(a1)}, so Σ |cₙ| ≤ ${n(a1)} + (${n(B)} − ${n(b1)}) = ${n(S2)}. The error after ${n(N)} terms is at most |c${sub(N + 1)}| = ${n(k)} ÷ (${n(q)}${SUP_N(N + 1)} + ${n(c)}) = ${n(k)} ÷ ${n(D)} = ${n(err)}.`,
  guidance: [
   { prompt: `Σ bₙ is geometric with first term ${n(b1)} and ratio 1 ÷ ${n(q)}. What is its sum?`, answer: [B], explanation: `${n(b1)} ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(B)}.` },
   { prompt: `What is the exact first size |c₁| = ${n(k)} ÷ (${n(q)} + ${n(c)})?`, answer: [a1], explanation: `${n(k)} ÷ ${n(q + c)} = ${n(a1)}.` },
   { prompt: `Keep |c₁| exact and compare only the rest: |c₁| + (Σ bₙ − b₁), with b₁ = ${n(b1)}. What is the sharper bound?`, answer: [S2], explanation: `${n(a1)} + (${n(B)} − ${n(b1)}) = ${n(S2)}.` },
   { prompt: `The error after ${n(N)} terms is at most |c${sub(N + 1)}| = ${n(k)} ÷ (${n(q)}${SUP_N(N + 1)} + ${n(c)}). What is that number?`, answer: [err], explanation: `${n(q)}${SUP_N(N + 1)} + ${n(c)} = ${n(D)}, and ${n(k)} ÷ ${n(D)} = ${n(err)}.` }
  ] }; }
});

/* ---- q18 ε–δ limits of functions [3.1] ---- */

/* r(x) = x ÷ s + b at c: |r(x) − L| = |x − c| ÷ s, so the largest δ is ε × s. h(x) = x² at the negative point −c2, with
   ε₂ = 2 c2 δ + δ² so that √(c2² + ε₂) = c2 + δ exactly; the left side binds (|x| grows there), so the largest δ is δ.
   c2 ≥ 1 and δ ≤ 0.5 keep δ below c2. Not the parent's worked example (3x + 1 at 1, x² at 1). */
mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The flow meter window',
 brief: 'A flow meter and a strain gauge each need a written input window, so that every reading inside it stays within the stated tolerance.',
 labels: ['largest δ for the meter', 'largest δ for the gauge'], tolerance: 0.00005,
 gl: [['δ for the meter'], ['square root'], ['δ for the gauge']]
}, {
 canonical: { s: 4, b: 3, c: 2, e: 0.1, c2: 4, dl: 0.2 },
 draw: R => ({ s: R.pick([2, 4, 5, 10]), b: R.int(-9, 9), c: R.nz(-6, 6), e: R.pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.25]), c2: R.int(1, 6), dl: R.pick([0.1, 0.2, 0.5]) }),
 build: ({ s, b, c, e, c2, dl }) => { const L = tidy(c / s + b), d1 = tidy(e * s), sq = c2 * c2, e2 = tidy(2 * c2 * dl + dl * dl), top = tidy(sq + e2), rt = tidy(c2 + dl), lo = tidy((c2 - dl) * (c2 - dl)), low = tidy(sq - e2); return {
  prompt: `A flow meter reports r(x) = x ÷ ${n(s)}${cst(b)} for a valve setting x, and r(x) → ${n(L)} as x → ${n(c)}. Enter the largest δ such that |r(x) ${mns(L)}| < ${n(e)} whenever 0 < |x ${mns(c)}| < δ. A strain gauge reads h(x) = x², and h(x) → ${n(sq)} as x → −${n(c2)}. Enter the largest δ such that |x² − ${n(sq)}| < ${n(e2)} whenever 0 < |x + ${n(c2)}| < δ.`,
  answer: [d1, dl],
  hints: ['For a straight line, the output gap is the size of the slope times the input gap. Here the slope is 1 divided by a number, so solve (size of slope) × δ = ε.', 'For x² near a negative point, |x| grows to the left of the point, so x² rises fastest there and the left side is the one that limits δ: the edge is where x² = c² + ε, at x = −√(c² + ε).'],
  solution: `r(x) ${mns(L)} = (x ${mns(c)}) ÷ ${n(s)}, so |r(x) ${mns(L)}| = |x ${mns(c)}| ÷ ${n(s)}. That is below ${n(e)} exactly when |x ${mns(c)}| < ${n(e)} × ${n(s)} = ${n(d1)}, so the largest δ for the meter is ${n(d1)}. For h, x² < ${n(sq)} + ${n(e2)} = ${n(top)} means |x| < √${n(top)} = ${n(rt)}, so on the left x must stay above −${n(rt)}, which is ${n(dl)} from −${n(c2)}. On the right, every x between −${n(c2)} and −${n(c2 - dl)} has x² > ${n(c2 - dl)}² = ${n(lo)}, which is above ${n(sq)} − ${n(e2)} = ${n(low)}, so the right side never fails first. The largest δ for the gauge is ${n(dl)}.`,
  guidance: [
   { prompt: `|r(x) ${mns(L)}| = |x ${mns(c)}| ÷ ${n(s)}. What is the largest δ with δ ÷ ${n(s)} ≤ ${n(e)}?`, answer: [d1], explanation: `δ = ${n(e)} × ${n(s)} = ${n(d1)}. Inside that distance the output gap is below ${n(e)}; just outside it is not.` },
   { prompt: `Left of −${n(c2)}, x² stays below ${n(sq)} + ${n(e2)} = ${n(top)} only while |x| < √${n(top)}. What is √${n(top)}?`, answer: [rt], explanation: `${n(rt)} × ${n(rt)} = ${n(top)}, so √${n(top)} = ${n(rt)}.` },
   { prompt: `The right side is safe, since ${n(c2 - dl)}² = ${n(lo)} is above ${n(low)}. The left edge is x = −${n(rt)}. What is the largest δ for the gauge?`, answer: [dl], explanation: `δ is the distance from −${n(c2)} to −${n(rt)}: ${n(rt)} − ${n(c2)} = ${n(dl)}.` }
  ] }; }
});

/* Two linear stages: w(x) = k (a x + b) + e0 has slope k a, so |w(x) − W| = A |x − c| with A = |k a|. The largest δ for ε is ε ÷ A (ε = A × δ0
   is built from a chosen δ0), and the smallest ε for which a window d0 works is A × d0. */
mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'The sensor and amplifier chain',
 brief: 'A thermostat’s sensor feeds an amplifier, and the lab must turn the output tolerance into a window for the dial, and back again.',
 labels: ['largest δ', 'smallest ε'], tolerance: 0.00005,
 gl: [['size of the slope'], ['δ'], ['ε']]
}, {
 canonical: { a: 3, b: -2, k: -4, e0: 5, c: 2, d1: 0.05, d0: 0.2 },
 draw: R => tries(() => ({ a: R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), b: R.int(-9, 9), k: R.pick([-4, -3, -2, 2, 3, 4]), e0: R.int(-9, 9), c: R.int(1, 6), d1: R.pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.25]), d0: R.pick([0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.3]) }),
  p => p.d0 !== p.d1, GEN.q18c.canonical),
 build: ({ a, b, k, e0, c, d1, d0 }) => { const A = Math.abs(a * k), W = k * (a * c + b) + e0, e = tidy(A * d1), emin = tidy(A * d0); return {
  prompt: `A thermostat’s sensor turns a dial setting x into a voltage v(x) = ${lin(a, b)}, and an amplifier turns each voltage v into an output w = ${lin(k, e0, 'v')}. So the output for a setting x is w(x) = ${lin(k, e0, 'v')} with v = v(x), and w(x) → ${n(W)} as x → ${n(c)}. Enter the largest δ such that |w(x) ${mns(W)}| < ${n(e)} whenever 0 < |x ${mns(c)}| < δ. Then enter the smallest ε for which |w(x) ${mns(W)}| < ε whenever 0 < |x ${mns(c)}| < ${n(d0)}.`,
  answer: [d1, emin],
  hints: ['Put v(x) into the amplifier: w(x) minus its limit is the product of the two slopes times (x − c), so the output gap is the size of that product times the input gap.', 'A tolerance ε gives the window δ = ε ÷ (size of the combined slope). Going the other way, a window d gives the smallest tolerance (size of the combined slope) × d.'],
  solution: `w(x) = ${n(k)}(${lin(a, b)})${cst(e0)}, whose slope is ${par(k)} × ${par(a)} = ${n(k * a)}. So w(x) ${mns(W)} = ${n(k * a)}(x ${mns(c)}) and |w(x) ${mns(W)}| = ${n(A)} × |x ${mns(c)}|. That is below ${n(e)} exactly when |x ${mns(c)}| < ${n(e)} ÷ ${n(A)} = ${n(d1)}, so the largest δ is ${n(d1)}. For a window of ${n(d0)}, every x inside it has ${n(A)} × |x ${mns(c)}| < ${n(A)} × ${n(d0)} = ${n(emin)}, so ε = ${n(emin)} works; a smaller ε fails, because some x inside the window has an output gap above it. The smallest ε is ${n(emin)}.`,
  guidance: [
   { prompt: `The slope of w(x) is the product ${par(k)} × ${par(a)}. What is its size, ignoring the sign?`, answer: [A], explanation: `${par(k)} × ${par(a)} = ${n(k * a)}, and its size is ${n(A)}. So |w(x) ${mns(W)}| = ${n(A)} × |x ${mns(c)}|.` },
   { prompt: `|w(x) ${mns(W)}| = ${n(A)} × |x ${mns(c)}|. What is the largest δ with ${n(A)} × δ ≤ ${n(e)}?`, answer: [d1], explanation: `δ = ${n(e)} ÷ ${n(A)} = ${n(d1)}.` },
   { prompt: `For |x ${mns(c)}| < ${n(d0)}, the output gap ${n(A)} × |x ${mns(c)}| stays below ${n(A)} × ${n(d0)}. What is the smallest ε that works for this window?`, answer: [emin], explanation: `${n(A)} × ${n(d0)} = ${n(emin)}. Any smaller ε is beaten by an x just inside the window.` }
  ] }; }
});

/* f(x) = (px + b) ÷ q at c: |f(x) − L| = (p ÷ q)|x − c|, so δf = ε q ÷ p. g(x) = x² at c2 with ε₂ = 2 c2 δ + δ², largest δg = δ (right side binds).
   Then the smallest n with 1 ÷ n < min(δf, δg) is ⌊1 ÷ min⌋ + 1. p, q coprime, so p ÷ q is in lowest terms. Not the parent's worked example. */
mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q03', title: 'One window for two gauges',
 brief: 'Two gauges share one input dial, so the lab needs a single window that serves both and a step count fine enough to fit inside it.',
 labels: ['largest δ for f', 'largest δ for g', 'smallest n'], tolerance: 0.00005,
 gl: [['δ for f'], ['square root'], ['δ for g'], ['n']]
}, {
 canonical: { p: 5, q: 4, b: -1, c: 3, e: 0.25, c2: 6, dl: 0.1 },
 draw: R => tries(() => ({ p: R.pick([2, 3, 4, 5, 7]), q: R.pick([2, 3, 4, 5, 8]), b: R.int(-9, 9), c: R.int(1, 6), e: R.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1.2]), c2: R.int(1, 9), dl: R.pick([0.05, 0.1, 0.25, 0.5]) }),
  p => { const df = p.e * p.q / p.p; return gcd(p.p, p.q) === 1 && short(df, 3) && df >= 0.02 && short((p.p * p.c + p.b) / p.q, 4) && Math.min(df, p.dl) >= 0.02; }, GEN.q18d.canonical),
 build: ({ p, q, b, c, e, c2, dl }) => { const L = tidy((p * c + b) / q), df = tidy(e * q / p), sq = c2 * c2, e2 = tidy(2 * c2 * dl + dl * dl), top = tidy(sq + e2), rt = tidy(c2 + dl), dm = Math.min(df, dl), nn = Math.floor(1 / dm + 1e-9) + 1; return {
  prompt: `Two gauges share one input dial. The first reads f(x) = ${b === 0 ? lin(p, b) : `(${lin(p, b)})`} ÷ ${n(q)}, and f(x) → ${n(L)} as x → ${n(c)}. Enter the largest δ such that |f(x) ${mns(L)}| < ${n(e)} whenever 0 < |x − ${n(c)}| < δ. The second reads g(x) = x², and g(x) → ${n(sq)} as x → ${n(c2)}. Enter the largest δ such that |x² − ${n(sq)}| < ${n(e2)} whenever 0 < |x − ${n(c2)}| < δ. One window on the dial must serve both gauges, so it can be no wider than the smaller of the two largest δ values. Finally enter the smallest whole number n such that 1 ÷ n is below that smaller δ (a whole number n with 1 ÷ n below any δ > 0 always exists, by the Archimedean property).`,
  answer: [df, dl, nn],
  hints: ['The slope of f is a fraction, so |f(x) − L| = (size of the slope) × |x − c|. For x² at a positive point, the right side limits δ: solve (c + δ)² = c² + ε.', 'The window that serves both gauges is the smaller of the two δ values. Then 1 ÷ n < δ means n > 1 ÷ δ, so take the first whole number above 1 ÷ δ.'],
  solution: `f(x) ${mns(L)} = (${n(p)} ÷ ${n(q)})(x − ${n(c)}), so |f(x) ${mns(L)}| = (${n(p)} ÷ ${n(q)}) × |x − ${n(c)}|. That is below ${n(e)} exactly when |x − ${n(c)}| < ${n(e)} × ${n(q)} ÷ ${n(p)} = ${n(df)}. For g, the right side binds: x² < ${n(sq)} + ${n(e2)} = ${n(top)} means x < √${n(top)} = ${n(rt)}, which is ${n(c2)} + ${n(dl)}, and the left side never fails first. So the largest δ for g is ${n(dl)}. The smaller of ${n(df)} and ${n(dl)} is ${n(dm)}. 1 ÷ n < ${n(dm)} means n > 1 ÷ ${n(dm)} = ${n(tidy(1 / dm))}, so the smallest whole number n is ${n(nn)}.`,
  guidance: [
   { prompt: `|f(x) ${mns(L)}| = (${n(p)} ÷ ${n(q)}) × |x − ${n(c)}|. What is the largest δ with (${n(p)} ÷ ${n(q)}) × δ ≤ ${n(e)}?`, answer: [df], explanation: `δ = ${n(e)} × ${n(q)} ÷ ${n(p)} = ${n(df)}.` },
   { prompt: `On the right of ${n(c2)}, x² stays below ${n(sq)} + ${n(e2)} = ${n(top)} only while x < √${n(top)}. What is √${n(top)}?`, answer: [rt], explanation: `${n(rt)} × ${n(rt)} = ${n(top)}, so √${n(top)} = ${n(rt)}.` },
   { prompt: `The left side of ${n(c2)} is safe. What is the largest δ for g, the distance from ${n(c2)} to ${n(rt)}?`, answer: [dl], explanation: `${n(rt)} − ${n(c2)} = ${n(dl)}.` },
   { prompt: `The smaller of the two largest δ values is ${n(dm)}. What is the smallest whole number n with 1 ÷ n < ${n(dm)}?`, answer: [nn], explanation: `1 ÷ n < ${n(dm)} means n > ${n(tidy(1 / dm))}, so the first whole number that does it is ${n(nn)}.` }
  ] }; }
});

/* ---- q19 Continuity by ε–δ and by sequences [3.2] ---- */

/* f(x) = m x + b at c with xₙ = c − k ÷ n² (from below). |f(xₙ) − f(c)| = |m| k ÷ n², below ε exactly when n² > K², where
   ε = |m| k ÷ K² (K in {4, 5, 10, 20, 25} keeps ε a short decimal), so the smallest n is K + 1 and the largest δ is ε ÷ |m| = k ÷ K².
   j is one of 2, 4, 5, 10 so that x_j is a short decimal. Not the parent's worked example (3x − 2 at 1) or its canonical. */
mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The vent damper lever',
 brief: 'A vent damper’s opening must be certified continuous at its working position, checked by a window on the lever and by a creeping run of test positions.',
 labels: ['f at the test position', 'largest δ', 'smallest n'], tolerance: 0.00005,
 gl: [['f at the position'], ['δ'], ['n']]
}, {
 canonical: { m: -4, b: 5, c: 2, k: 3, K: 5, j: 4 },
 draw: R => ({ m: R.pick([-5, -4, -2, 2, 4, 5]), b: R.int(-9, 9), c: R.int(1, 6), k: R.int(2, 5), K: R.pick([4, 5, 10, 20, 25]), j: R.pick([2, 4, 5, 10]) }),
 build: ({ m, b, c, k, K, j }) => { const am = Math.abs(m), e = tidy(am * k / (K * K)), X = tidy(c - k / (j * j)), F = tidy(m * X + b), d = tidy(k / (K * K)), n0 = K + 1, fc = m * c + b; return {
  prompt: `A vent damper’s opening is f(x) = ${lin(m, b)} for a lever position x. To test continuity at x = ${n(c)}, the lab moves the lever through the positions xₙ = ${n(c)} − ${n(k)} ÷ n², which creep up to ${n(c)} from below. Enter f(x${sub(j)}). Then enter the largest δ such that |f(x) − f(${n(c)})| < ${n(e)} whenever |x − ${n(c)}| < δ. Finally enter the smallest n such that |f(xₙ) − f(${n(c)})| < ${n(e)} for that n and every later one.`,
  answer: [F, d, n0],
  hints: ['For a straight line, the output gap is the size of the slope times the input gap.', 'The n-th position is a constant divided by n² away from the point, so the output gap is the size of the slope times that. Put it below ε, solve for n², then take the square root: n must be larger than it.'],
  solution: `x${sub(j)} = ${n(c)} − ${n(k)} ÷ ${n(j * j)} = ${n(X)}, so f(x${sub(j)}) = ${n(m)} × ${par(X)}${cst(b)} = ${n(F)}. Since f(${n(c)}) = ${n(fc)}, |f(x) ${mns(fc)}| = ${n(am)} × |x − ${n(c)}|, which is below ${n(e)} exactly when |x − ${n(c)}| < ${n(e)} ÷ ${n(am)} = ${n(d)}; so the largest δ is ${n(d)}. For the positions, |xₙ − ${n(c)}| = ${n(k)} ÷ n², so |f(xₙ) ${mns(fc)}| = ${n(am * k)} ÷ n². This is below ${n(e)} exactly when n² > ${n(am * k)} ÷ ${n(e)} = ${n(K * K)}, that is n > ${n(K)}, so from n = ${n(n0)} on. Those are exactly the n with ${n(k)} ÷ n² < ${n(d)}.`,
  guidance: [
   { prompt: `The ${ord(j)} position is x${sub(j)} = ${n(c)} − ${n(k)} ÷ ${n(j * j)}. What is f(x${sub(j)})?`, answer: [F], explanation: `x${sub(j)} = ${n(X)}, and f(${n(X)}) = ${n(m)} × ${par(X)}${cst(b)} = ${n(F)}.` },
   { prompt: `|f(x) − f(${n(c)})| = ${n(am)} × |x − ${n(c)}|. What is the largest δ that keeps this below ${n(e)}?`, answer: [d], explanation: `${n(am)} × δ = ${n(e)} gives δ = ${n(d)}.` },
   { prompt: `|f(xₙ) − f(${n(c)})| = ${n(am * k)} ÷ n². What is the smallest n from which this stays below ${n(e)}?`, answer: [n0], explanation: `${n(am * k)} ÷ n² < ${n(e)} means n² > ${n(K * K)}, so n > ${n(K)}. The first such n is ${n(n0)}, and the gap keeps shrinking after it.` }
  ] }; }
});

/* Two straight pieces: f(x) = m x + b for x ≤ c and m2 x + b2 for x > c, with b2 = b + (m − m2) c + J, so J = 0 means the pieces meet.
   Right limit = m2 c + b2 = f(c) + J; code 1 when J = 0, else 0. y_j = c + k ÷ j with j in {2, 4, 5, 10}. */
mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'The second heating element',
 brief: 'A heater switches on a second element when the setting passes its working point, and the lab must test whether the output jumps there.',
 labels: ['f at the test setting', 'number f(yₙ) closes in on', '1 continuous, 0 not'], tolerance: 0.00005,
 gl: [['f at the setting'], ['limit of f(yₙ)'], ['1 or 0']]
}, {
 canonical: { m: 3, b: -2, c: 2, m2: -1, J: 4, k: 1, j: 5 },
 draw: R => tries(() => ({ m: R.nz(-5, 5), b: R.int(-9, 9), c: R.int(1, 5), m2: R.nz(-5, 5), J: R.next() < 0.3 ? 0 : R.nz(-6, 6), k: R.int(1, 3), j: R.pick([2, 4, 5, 10]) }),
  p => p.m2 !== p.m, GEN.q19c.canonical),
 build: ({ m, b, c, m2, J, k, j }) => { const b2 = b + (m - m2) * c + J, fc = m * c + b, Rt = m2 * c + b2, Y = tidy(c + k / j), F = tidy(m2 * Y + b2), code = Rt === fc ? 1 : 0; return {
  prompt: `A heater switches on a second element once its setting passes ${n(c)}. Its output is f(x) = ${lin(m, b)} for x ≤ ${n(c)}, and f(x) = ${lin(m2, b2)} for x > ${n(c)}. Each piece is a straight line, so f can only fail to be continuous at x = ${n(c)}, and the outputs for settings below ${n(c)} always close in on f(${n(c)}), so one test from above settles it. The lab feeds in the settings yₙ = ${n(c)} + ${n(k)} ÷ n, which fall towards ${n(c)} from above. Enter f(y${sub(j)}). Then enter the number that f(yₙ) closes in on as n grows. Finally enter 1 if f is continuous at ${n(c)}, or 0 if it is not.`,
  answer: [F, Rt, code],
  hints: ['A straight piece has no jumps, so as yₙ closes in on the point, the output of the upper piece closes in on that piece’s value at the point.', 'f is continuous at the point when the number the outputs close in on from above equals f at the point, which comes from the piece for x ≤ the point.'],
  solution: `y${sub(j)} = ${n(c)} + ${n(k)} ÷ ${n(j)} = ${n(Y)}, which is above ${n(c)}, so f(y${sub(j)}) = ${n(m2)} × ${par(Y)}${cst(b2)} = ${n(F)}. As n grows, yₙ closes in on ${n(c)} from above and f(yₙ) = ${lin(m2, b2, 'yₙ')} closes in on ${n(m2)} × ${par(c)}${cst(b2)} = ${n(Rt)}. But f(${n(c)}) comes from the piece for x ≤ ${n(c)}: ${n(m)} × ${par(c)}${cst(b)} = ${n(fc)}. ${code ? `The two numbers agree, so f is continuous at ${n(c)}: 1.` : `The two numbers differ, so f jumps at ${n(c)} and is not continuous there: 0.`}`,
  guidance: [
   { prompt: `The ${ord(j)} setting is y${sub(j)} = ${n(c)} + ${n(k)} ÷ ${n(j)}, which is above ${n(c)}. What is f(y${sub(j)})?`, answer: [F], explanation: `y${sub(j)} = ${n(Y)}, so f(y${sub(j)}) = ${n(m2)} × ${par(Y)}${cst(b2)} = ${n(F)}.` },
   { prompt: `For settings above ${n(c)}, f(yₙ) = ${lin(m2, b2, 'yₙ')}. As yₙ closes in on ${n(c)}, what number does f(yₙ) close in on?`, answer: [Rt], explanation: `${n(m2)} × ${par(c)}${cst(b2)} = ${n(Rt)}.` },
   { prompt: `f(${n(c)}) = ${n(fc)}, from the piece for x ≤ ${n(c)}. Enter 1 if the number f(yₙ) closes in on equals f(${n(c)}) so that f is continuous, 0 if not.`, answer: [code], explanation: code ? `${n(Rt)} equals ${n(fc)}, so f is continuous at ${n(c)}: 1.` : `${n(Rt)} is not ${n(fc)}, so f is not continuous at ${n(c)}: 0.` }
  ] }; }
});

/* f(x) = a x² + b at c > 0 with xₙ = c + k ÷ n, from above. ε = a(2cδ + δ²) is built from the chosen δ, so √(c² + ε ÷ a) = c + δ exactly;
   the right side binds, so the largest δ is δ, and the xₙ lie on the right, so |f(xₙ) − f(c)| < ε exactly when k ÷ n < δ, i.e.
   n > k ÷ δ; with δ in {0.05, 0.1, 0.25, 0.5} the number k ÷ δ is whole and the smallest n is k ÷ δ + 1. c ≥ 1 and δ ≤ 0.5 keep c − δ positive. */
mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'The squared regulator',
 brief: 'A regulator’s response grows with the square of its setting, and the lab must certify continuity at the working point with a window and a run of settings.',
 labels: ['f at the test setting', 'largest δ', 'smallest n'], tolerance: 0.00005,
 gl: [['f at the setting'], ['square root'], ['δ'], ['n']]
}, {
 canonical: { a: 3, b: -4, c: 2, dl: 0.1, k: 2, j: 5 },
 draw: R => ({ a: R.int(2, 6), b: R.int(-9, 9), c: R.int(1, 6), dl: R.pick([0.05, 0.1, 0.25, 0.5]), k: R.int(1, 4), j: R.pick([2, 4, 5, 10]) }),
 build: ({ a, b, c, dl, k, j }) => { const e = tidy(a * (2 * c * dl + dl * dl)), X = tidy(c + k / j), F = tidy(a * X * X + b), fc = a * c * c + b, top = tidy((c + dl) * (c + dl)), rt = tidy(c + dl), T = Math.round(k / dl), n0 = T + 1; return {
  prompt: `A regulator’s response is f(x) = ${n(a)}x²${cst(b)} for a setting x. To test continuity at x = ${n(c)}, the lab feeds in the settings xₙ = ${n(c)} + ${n(k)} ÷ n, which fall towards ${n(c)} from above. Enter f(x${sub(j)}). Then enter the largest δ such that |f(x) − f(${n(c)})| < ${n(e)} whenever |x − ${n(c)}| < δ. Finally enter the smallest n such that |f(xₙ) − f(${n(c)})| < ${n(e)} for that n and every later one.`,
  answer: [F, dl, n0],
  hints: ['Near a positive point, x² grows faster to the right, so for a function a x² + b the right side limits δ: solve a(c + δ)² + b = f(c) + ε.', 'The settings xₙ all sit to the right of the point, so the n-th gap is a constant divided by n. The outputs stay within ε exactly while that gap is below δ: solve for n.'],
  solution: `x${sub(j)} = ${n(c)} + ${n(k)} ÷ ${n(j)} = ${n(X)}, so f(x${sub(j)}) = ${n(a)} × ${n(X)}²${cst(b)} = ${n(F)}. Since f(${n(c)}) = ${n(fc)}, f(x) < ${n(fc)} + ${n(e)} means ${n(a)}x² < ${n(a * c * c)} + ${n(e)}, that is x² < ${n(top)}, so x < ${n(rt)}, which is ${n(c)} + ${n(dl)}. On the left of ${n(c)} the output gap is smaller, so the largest δ is ${n(dl)}. The settings are ${n(k)} ÷ n above ${n(c)}, and the outputs stay within ${n(e)} exactly while ${n(k)} ÷ n < ${n(dl)}, that is n > ${n(T)}. So the smallest n is ${n(n0)}.`,
  guidance: [
   { prompt: `The ${ord(j)} setting is x${sub(j)} = ${n(c)} + ${n(k)} ÷ ${n(j)}. What is f(x${sub(j)})?`, answer: [F], explanation: `x${sub(j)} = ${n(X)}, and ${n(a)} × ${n(X)}²${cst(b)} = ${n(F)}.` },
   { prompt: `On the right of ${n(c)}, the output stays below f(${n(c)}) + ${n(e)} only while x² < ${n(c * c)} + ${n(e)} ÷ ${n(a)} = ${n(top)}. What is √${n(top)}?`, answer: [rt], explanation: `${n(rt)} × ${n(rt)} = ${n(top)}, so √${n(top)} = ${n(rt)}.` },
   { prompt: `The left side of ${n(c)} is safe. What is the largest δ, the distance from ${n(c)} to ${n(rt)}?`, answer: [dl], explanation: `${n(rt)} − ${n(c)} = ${n(dl)}.` },
   { prompt: `The n-th setting is ${n(k)} ÷ n above ${n(c)}, and the outputs stay within ${n(e)} exactly while ${n(k)} ÷ n < ${n(dl)}. What is the smallest n from which this holds?`, answer: [n0], explanation: `${n(k)} ÷ n < ${n(dl)} means n > ${n(k)} ÷ ${n(dl)} = ${n(T)}, so the first such n is ${n(n0)}.` }
  ] }; }
});

/* ---- q20 Discontinuities [3.2] ---- */

/* g(p) = p² + q for p < c, g(c) = v, g(p) = m p + b for p > c, with b = c² + q + J − m c so the right limit is the left limit plus J.
   kind 0: J = 0 and v = left limit (continuous); kind 1: J = 0 and v differs (removable); kind 2: J ≠ 0 (jump). Code: 2, 1, 0. */
mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'The calibration seam',
 brief: 'A pressure gauge’s calibration curve is stitched together from two formulas, and the lab must say what kind of seam sits at the join.',
 labels: ['left-hand limit', 'right-hand limit', 'code'], tolerance: 0.01,
 gl: [['left-hand limit'], ['right-hand limit'], ['code']]
}, {
 canonical: { c: -2, q: -1, m: 3, kind: 2, J: 2, v: 3 },
 draw: R => { const c = R.pick([-3, -2, -1, 1, 2, 3, 4]), q = R.int(-9, 9), m = R.nz(-4, 4), kind = R.int(0, 2), J = kind === 2 ? R.nz(-6, 6) : 0, L = c * c + q;
  const v = kind === 0 ? L : kind === 1 ? L + R.nz(-5, 5) : R.pick([L, L + J, L + R.nz(-3, 3)]); return { c, q, m, kind, J, v }; },
 build: ({ c, q, m, J, v }) => { const L = c * c + q, b = L + J - m * c, Rt = m * c + b, code = L !== Rt ? 2 : (v === L ? 0 : 1); return {
  prompt: `A pressure gauge’s calibration curve is stitched together at p = ${n(c)}: g(p) = p²${cst(q)} for p < ${n(c)}, g(${n(c)}) = ${n(v)}, and g(p) = ${lin(m, b, 'p')} for p > ${n(c)}. A removable discontinuity is one where the limit exists but is not g(${n(c)}); a jump discontinuity is one where the two one-sided limits differ. Enter the left-hand limit of g at ${n(c)}, then the right-hand limit, then a code: 0 if g is continuous at ${n(c)}, 1 if it has a removable discontinuity there, 2 if it has a jump discontinuity.`,
  answer: [L, Rt, code],
  hints: ['Each one-sided limit uses only the formula for that side, with the stitching point put in; the single value g at the point plays no part in either limit.', 'One-sided limits that differ make a jump. Equal limits that are not the value at the point make a removable discontinuity. Equal limits that equal the value mean continuity.'],
  solution: `From the left, p²${cst(q)} tends to ${par(c)}²${cst(q)} = ${n(c * c)}${cst(q)} = ${n(L)}. From the right, ${lin(m, b, 'p')} tends to ${n(m)} × ${par(c)}${cst(b)} = ${n(Rt)}. ${code === 2 ? `The one-sided limits differ, so g has a jump discontinuity at ${n(c)}: code 2.` : code === 1 ? `The one-sided limits agree, so the limit is ${n(L)}, but g(${n(c)}) = ${n(v)} is different: redefining that one value would mend the seam, so this is a removable discontinuity, code 1.` : `The one-sided limits agree at ${n(L)}, and g(${n(c)}) = ${n(v)} matches, so g is continuous at ${n(c)}: code 0.`}`,
  guidance: [
   { prompt: `Only the formula p²${cst(q)} matters for p just below ${n(c)}. What is the left-hand limit?`, answer: [L], explanation: `${par(c)}²${cst(q)} = ${n(c * c)}${cst(q)} = ${n(L)}.` },
   { prompt: `Only the formula ${lin(m, b, 'p')} matters for p just above ${n(c)}. What is the right-hand limit?`, answer: [Rt], explanation: `${n(m)} × ${par(c)}${cst(b)} = ${n(Rt)}.` },
   { prompt: `The one-sided limits are ${n(L)} and ${n(Rt)}, and g(${n(c)}) = ${n(v)}. Which code fits: 0 continuous, 1 removable, 2 jump?`, answer: [code], explanation: code === 2 ? `The one-sided limits differ: a jump, code 2.` : code === 1 ? `The limits agree but the value is different: removable, code 1.` : `The limits agree and match the value: continuous, code 0.` }
  ] }; }
});

/* Kind 0: f(x) = a x + b for x < c and x² + k for x ≥ c, k unknown; the left limit is a c + b and continuity needs k = a c + b − c²; the checking
   setting w = c + wd is on the right, f(w) = w² + k. Kind 1: f(x) = k x + b for x < c and x² + q for x ≥ c, k unknown, c ≠ 0; the right value is
   c² + q, k = (c² + q − b) ÷ c is a whole number because b = c² + q − k c is built from k; w = c − wd is on the left, f(w) = k w + b. */
mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Stitching the heating law',
 brief: 'The hall’s heating law has one unknown constant at its seam, and the engineers must choose it so that the dial never jumps there.',
 labels: ['limit of the piece with no k', 'value of k', 'f at the checking setting'], tolerance: 0.01,
 gl: [['limit of the known piece'], ['k'], ['f at the checking setting']]
}, {
 canonical: { kind: 0, c: 2, a: 3, b: -1, kk: 0, q: 0, wd: 1 },
 draw: R => { const kind = R.int(0, 1), c = kind === 0 ? R.int(1, 5) : R.pick([-3, -2, -1, 1, 2, 3, 4]), wd = R.int(1, 2);
  if (kind === 0) return { kind, c, a: R.int(2, 6), b: R.int(-9, 9), kk: 0, q: 0, wd };
  const kk = R.nz(-5, 5), q = R.int(-9, 9); return { kind, c, a: 0, b: c * c + q - kk * c, kk, q, wd }; },
 build: ({ kind, c, a, b, kk, q, wd }) => { const w = kind === 0 ? c + wd : c - wd;
  const known = kind === 0 ? a * c + b : c * c + q, k = kind === 0 ? a * c + b - c * c : kk, fw = kind === 0 ? w * w + k : k * w + b;
  const left = kind === 0 ? lin(a, b) : `kx${cst(b)}`, right = kind === 0 ? 'x² + k' : `x²${cst(q)}`, kpiece = kind === 0 ? 'x² + k' : `kx${cst(b)}`;
  const eq = kind === 0 ? `${n(c * c)} + k = ${n(known)}` : `${lin(c, b, 'k')} = ${n(known)}`;
  const fwText = kind === 0 ? `${n(w)}² + k` : `${n(k)} × ${par(w)}${cst(b)}`; return {
  prompt: `The hall’s heating law is stitched together at x = ${n(c)}: f(x) = ${left} for x < ${n(c)}, and f(x) = ${right} for x ≥ ${n(c)}, where k is a constant the engineers must choose. Each piece is a polynomial, so its limit at ${n(c)} is its value at ${n(c)}. The law is continuous at ${n(c)} when its left-hand limit, its right-hand limit and f(${n(c)}) are all equal. Enter the limit at ${n(c)} of the piece that has no k, then the value of k that makes f continuous at ${n(c)}, then f(${n(w)}) with that k.`,
  answer: [known, k, fw],
  hints: ['With k unknown, only the piece with no k has a limit you can write down. Continuity means the other piece, with the stitching point put in, must give that same number.', 'Put the stitching point into the piece with k, set it equal to the known limit, and solve for k. Then put k and the checking setting into the piece on the correct side of the stitching point.'],
  solution: `The piece with no k is ${kind === 0 ? left : right}, and at x = ${n(c)} it gives ${kind === 0 ? `${n(a)} × ${par(c)}${cst(b)}` : `${n(c * c)}${cst(q)}`} = ${n(known)}. For continuity the piece ${kpiece} must give ${n(known)} there too: ${eq}, so k = ${n(k)}. The checking setting ${n(w)} is ${kind === 0 ? 'above' : 'below'} ${n(c)}, so the piece ${kpiece} applies: f(${n(w)}) = ${fwText} = ${n(fw)}.`,
  guidance: [
   { prompt: `The piece ${kind === 0 ? left : right} has no k. What does it tend to as x → ${n(c)}?`, answer: [known], explanation: `${kind === 0 ? `${n(a)} × ${par(c)}${cst(b)}` : `${n(c * c)}${cst(q)}`} = ${n(known)}.` },
   { prompt: `For continuity the piece ${kpiece} must also give ${n(known)} at x = ${n(c)}, so ${eq}. What is k?`, answer: [k], explanation: `Solving ${eq} gives k = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, the checking setting ${n(w)} is ${kind === 0 ? 'above' : 'below'} ${n(c)}, so use the piece ${kpiece}. What is f(${n(w)})?`, answer: [fw], explanation: `${fwText} = ${n(fw)}.` }
  ] }; }
});

/* f(x) = (x² − c²) ÷ (x − c) + t |x − c| ÷ (x − c) for x ≠ c, f(c) = v. For x ≠ c the fraction is x + c, and |x − c| ÷ (x − c) is −1 on the left and 1 on the right,
   so the left limit is 2c − t and the right limit is 2c + t. t ≠ 0: jump (2); t = 0: removable (1) unless v = 2c (0). */
mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q19', title: 'The gauge law with a hidden seam',
 brief: 'A gauge law is a fraction that cannot be evaluated at its own working point, and the lab must classify what happens there.',
 labels: ['left-hand limit', 'right-hand limit', 'code'], tolerance: 0.01,
 gl: [['limit of the fraction'], ['left-hand limit'], ['right-hand limit'], ['code']]
}, {
 canonical: { c: -4, t: -3, v: -8 },
 draw: R => { const c = R.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]), t = R.next() < 0.35 ? 0 : R.nz(-6, 6);
  const v = t === 0 ? (R.bool() ? 2 * c : 2 * c + R.nz(-5, 5)) : R.pick([2 * c, 2 * c + t, 2 * c - t, 2 * c + R.nz(-3, 3)]); return { c, t, v }; },
 build: ({ c, t, v }) => { const b0 = 2 * c, L = b0 - t, Rt = b0 + t, code = L !== Rt ? 2 : (v === b0 ? 0 : 1), d = `x ${mns(c)}`, absPart = t === 0 ? '' : ` ${t < 0 ? '−' : '+'} ${n(Math.abs(t))} × |${d}| ÷ (${d})`; return {
  prompt: `A gauge law is defined for every x except x = ${n(c)} by f(x) = (x² − ${n(c * c)}) ÷ (${d})${absPart}, and the lab sets f(${n(c)}) = ${n(v)}. ${t === 0 ? '' : `For x < ${n(c)}, |${d}| ÷ (${d}) equals −1, and for x > ${n(c)} it equals 1. `}A removable discontinuity is one where the limit exists but is not f(${n(c)}); a jump discontinuity is one where the two one-sided limits differ. Enter the left-hand limit of f at ${n(c)}, then the right-hand limit, then a code: 0 if f is continuous at ${n(c)}, 1 if it has a removable discontinuity there, 2 if it has a jump discontinuity.`,
  answer: [L, Rt, code],
  hints: [`For x ≠ ${n(c)}, x² − ${n(c * c)} equals (${d})(x${cst(c)}), so the fraction is just x${cst(c)} away from ${n(c)}.${t === 0 ? '' : ' The absolute value part is a fixed number on each side.'}`, 'Put the stitching point into what is left on each side. Different one-sided limits make a jump; equal ones that differ from the value make a removable discontinuity; equal ones that match the value mean continuity.'],
  solution: `For x ≠ ${n(c)}, x² − ${n(c * c)} = (${d})(x${cst(c)}), so (x² − ${n(c * c)}) ÷ (${d}) = x${cst(c)}, which tends to ${n(b0)} as x → ${n(c)}.${t === 0 ? '' : ` On the left, f(x) = x${cst(c)}${cst(-t)}, which tends to ${n(L)}. On the right, f(x) = x${cst(c)}${cst(t)}, which tends to ${n(Rt)}.`} ${code === 2 ? `The one-sided limits ${n(L)} and ${n(Rt)} differ, so f has a jump discontinuity at ${n(c)}: code 2.` : code === 1 ? `Both one-sided limits are ${n(L)}, but f(${n(c)}) = ${n(v)}: redefining that one value would mend it, so this is a removable discontinuity, code 1.` : `Both one-sided limits are ${n(L)}, and f(${n(c)}) = ${n(v)} matches, so f is continuous at ${n(c)}: code 0.`}`,
  guidance: [
   { prompt: `For x ≠ ${n(c)}, (x² − ${n(c * c)}) ÷ (${d}) is the same as x${cst(c)}. What does it tend to as x → ${n(c)}?`, answer: [b0], explanation: `${n(c)}${cst(c)} = ${n(b0)}.` },
   { prompt: t === 0 ? `Nothing else is added, so f(x) = x${cst(c)} for x < ${n(c)}. What is the left-hand limit?` : `For x < ${n(c)}, |${d}| ÷ (${d}) = −1, so f(x) = x${cst(c)}${cst(-t)}. What is the left-hand limit?`, answer: [L], explanation: `${n(c)}${cst(c)}${cst(-t)} = ${n(L)}.` },
   { prompt: t === 0 ? `Nothing else is added, so f(x) = x${cst(c)} for x > ${n(c)}. What is the right-hand limit?` : `For x > ${n(c)}, |${d}| ÷ (${d}) = 1, so f(x) = x${cst(c)}${cst(t)}. What is the right-hand limit?`, answer: [Rt], explanation: `${n(c)}${cst(c)}${cst(t)} = ${n(Rt)}.` },
   { prompt: `The one-sided limits are ${n(L)} and ${n(Rt)}, and f(${n(c)}) = ${n(v)}. Which code fits: 0 continuous, 1 removable, 2 jump?`, answer: [code], explanation: code === 2 ? `The one-sided limits differ: a jump, code 2.` : code === 1 ? `The limits agree but the value is different: removable, code 1.` : `The limits agree and match the value: continuous, code 0.` }
  ] }; }
});

})();
