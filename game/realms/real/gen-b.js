/* Real analysis mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Subscript digits for indices (s₄, x₁₀); ordinals (1st, 2nd, 3rd, 11th); signed constants (" + 3", " − 3", "" for 0);
   a linear expression ax + b with no written coefficient 1 and no "+ 0". */
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = k => String(k).split('').map(ch => SUB[Number(ch)]).join('');
const ord = k => { const t = k % 100, u = k % 10; return k + ((t >= 11 && t <= 13) ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
const cst = v => v === 0 ? '' : ` ${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;
const lin = (a, b, x = 'x') => `${a === 1 ? '' : a === -1 ? '−' : n(a)}${x}${cst(b)}`;
/* "− 5" or, for a negative number, "+ 5": subtracting a value without writing "− −5". */
const mns = v => v < 0 ? `+ ${n(-v)}` : `− ${n(v)}`;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => a / gcd(a, b) * b;
const close = (x, y) => Math.abs(x - y) < 1e-9;
/* Bounded retry: at most 1000 tries, then the canonical parameters (wave 2 rule). */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const POW = ['', '', '²', '³'];
window.MISSION_GEN = window.MISSION_GEN || {};
const GEN = {
 /* Channel A: xₙ = (an + b) ÷ (n + d) tends to a, with |xₙ − a| = D ÷ (n + d), D = |b − ad|; the smallest N with
    D ÷ (n + d) < ε for all n ≥ N is D ÷ ε − d + 1 (the distance falls as n grows). Channel B: zₙ = c + r(−1)ⁿ + s ÷ n,
    whose even terms fall towards c + r, so limsup is c + r. D ≤ 9 keeps N below 1000. Not the worked example (2n + 1) ÷ (n + 1). */
 q11: {
  canonical: { a: 3, b: 5, d: 2, e: 0.01, c: 4, r: 2, s: 3 },
  draw: R => tries(() => { const r = R.int(2, 6); return { a: R.int(2, 6), b: R.nz(-9, 9), d: R.int(1, 5), e: R.pick([0.1, 0.05, 0.02, 0.01]), c: r + R.int(1, 6), r, s: R.int(2, 9) }; },
   p => { const D = Math.abs(p.b - p.a * p.d); return D >= 1 && D <= 9 && !(p.a === 2 && p.b === 1 && p.d === 1); }, GEN.q11.canonical),
  build: ({ a, b, d, e, c, r, s }) => { const diff = b - a * d, D = Math.abs(diff), K = Math.round(D / e), N = K - d + 1, hi = c + r, lo = c - r; return {
   prompt: `The signal log certifies two channels, read at n = 1, 2, 3, …. Channel A reads xₙ = (${lin(a, b, 'n')}) ÷ (n + ${n(d)}). Channel B reads zₙ = ${n(c)} + ${n(r)} × (−1)ⁿ + ${n(s)} ÷ n. Enter the limit L of channel A, then the smallest N such that |xₙ − L| < ${n(e)} for every n ≥ N, then the limit superior of channel B.`,
   answer: [a, N, hi],
   hints: ['The limit of a ratio of two linear expressions in n is the ratio of the numbers in front of n.', 'Write xₙ − L as one fraction with n in the bottom and solve the inequality for n. For channel B, follow the even terms and the odd terms separately.'],
   solution: `Dividing the top and the bottom by n gives xₙ = (${n(a)} ${b < 0 ? '−' : '+'} ${n(Math.abs(b))} ÷ n) ÷ (1 + ${n(d)} ÷ n), which tends to ${n(a)}, so L = ${n(a)}. Then xₙ − ${n(a)} = (${lin(a, b, 'n')} − ${n(a)}(n + ${n(d)})) ÷ (n + ${n(d)}) = ${n(diff)} ÷ (n + ${n(d)}), so |xₙ − ${n(a)}| = ${n(D)} ÷ (n + ${n(d)}). This is below ${n(e)} exactly when n + ${n(d)} > ${n(D)} ÷ ${n(e)} = ${n(K)}, that is when n > ${n(K - d)}. The distance shrinks as n grows, so the smallest N is ${n(N)}. For channel B, the even terms are ${n(hi)} + ${n(s)} ÷ n, which come down towards ${n(hi)}, and the odd terms are ${n(lo)} + ${n(s)} ÷ n, which come down towards ${n(lo)}. The supremum of the terms from any point on is an even term just above ${n(hi)}, and these suprema fall to ${n(hi)}, so limsup zₙ = ${n(hi)}.`,
   guidance: [
    { prompt: `Divide the top and the bottom of xₙ = (${lin(a, b, 'n')}) ÷ (n + ${n(d)}) by n. What number L does xₙ tend to?`, answer: [a], explanation: `xₙ = (${n(a)} ${b < 0 ? '−' : '+'} ${n(Math.abs(b))} ÷ n) ÷ (1 + ${n(d)} ÷ n). Both pieces divided by n tend to 0, so xₙ tends to ${n(a)} ÷ 1 = ${n(a)}.` },
    { prompt: `|xₙ − ${n(a)}| = ${n(D)} ÷ (n + ${n(d)}). For this to be below ${n(e)}, n + ${n(d)} must be larger than which number?`, answer: [K], explanation: `${n(D)} ÷ (n + ${n(d)}) < ${n(e)} exactly when n + ${n(d)} > ${n(D)} ÷ ${n(e)} = ${n(K)}.` },
    { prompt: `So |xₙ − L| < ${n(e)} exactly when n > ${n(K - d)}. What is the smallest such whole number N?`, answer: [N], explanation: `The first whole number above ${n(K - d)} is ${n(N)}, and every later n also works because the distance keeps shrinking.` },
    { prompt: `The even terms of zₙ are ${n(hi)} + ${n(s)} ÷ n and the odd terms are ${n(lo)} + ${n(s)} ÷ n. What is the limit superior of zₙ?`, answer: [hi], explanation: `The even terms come down towards ${n(hi)} and the odd ones towards ${n(lo)}. The suprema of the tails fall to the larger of the two, so limsup zₙ = ${n(hi)}.` }
   ] }; }
 },
 /* xₙ = c + k ÷ n. For m, n ≥ N the gap |k ÷ m − k ÷ n| is below k ÷ N and comes as close to it as we like, so N works
    exactly when k ÷ N ≤ ε: the smallest N is k ÷ ε, a whole number for these ε. The pair gap k(1 ÷ u − 1 ÷ v) has at most
    three decimals. Not the worked example (5 + 2 ÷ n, ε = 0.05). */
 q12: {
  canonical: { c: 7, k: 3, e: 0.02, u: 4, v: 10 },
  draw: R => tries(() => ({ c: R.nz(-5, 9), k: R.int(2, 9), e: R.pick([0.1, 0.05, 0.04, 0.025, 0.02, 0.01]), u: R.pick([2, 4, 5]), v: R.pick([8, 10, 20, 25, 40, 50]) }),
   p => !(p.k === 2 && p.e === 0.05), GEN.q12.canonical),
  build: ({ c, k, e, u, v }) => { const gap = G.tidy(k * (1 / u - 1 / v)), N = Math.round(k / e), xu = G.tidy(c + k / u), xv = G.tidy(c + k / v); return {
   prompt: `A relay repeater’s n-th reading is xₙ = ${n(c)} + ${n(k)} ÷ n, for n = 1, 2, 3, …. To certify it as a Cauchy sequence without using its limit, first enter the gap |x${sub(u)} − x${sub(v)}|. For m, n ≥ N the gap |xₘ − xₙ| is always strictly below ${n(k)} ÷ N, and some pairs come as close to ${n(k)} ÷ N as we like. Enter the smallest N such that |xₘ − xₙ| < ${n(e)} for all m, n ≥ N.`,
   answer: [gap, N],
   hints: ['The constant part of the reading cancels in every gap, so only the part that shrinks with n matters.', 'For m and n both at least N, the shrinking parts both lie between 0 and their value at N. Find the largest gap they can come close to, then compare it with ε.'],
   solution: `x${sub(u)} = ${n(c)} + ${n(k)} ÷ ${n(u)} = ${n(xu)} and x${sub(v)} = ${n(c)} + ${n(k)} ÷ ${n(v)} = ${n(xv)}, so the gap is ${n(k)} × (1 ÷ ${n(u)} − 1 ÷ ${n(v)}) = ${n(gap)}; the ${n(c)} cancels. For m, n ≥ N, both ${n(k)} ÷ m and ${n(k)} ÷ n lie between 0 and ${n(k)} ÷ N, so |xₘ − xₙ| = |${n(k)} ÷ m − ${n(k)} ÷ n| is less than ${n(k)} ÷ N. Taking m = N and n very large makes the gap as close to ${n(k)} ÷ N as we like. So N works exactly when ${n(k)} ÷ N ≤ ${n(e)}, that is N ≥ ${n(k)} ÷ ${n(e)} = ${n(N)}. The smallest N is ${n(N)}.`,
   guidance: [
    { prompt: `Work out x${sub(u)} and x${sub(v)} from xₙ = ${n(c)} + ${n(k)} ÷ n. What is the gap |x${sub(u)} − x${sub(v)}|?`, answer: [gap], explanation: `x${sub(u)} = ${n(xu)} and x${sub(v)} = ${n(xv)}, so the gap is ${n(gap)}. The ${n(c)} cancels, which is why a Cauchy test never needs the limit.` },
    { prompt: `For m, n ≥ N the gaps stay below ${n(k)} ÷ N and come as close to it as we like. So N works exactly when ${n(k)} ÷ N ≤ ${n(e)}. What is the smallest such N?`, answer: [N], explanation: `${n(k)} ÷ N ≤ ${n(e)} means N ≥ ${n(k)} ÷ ${n(e)} = ${n(N)}. At N = ${n(N)} every gap is strictly below ${n(k)} ÷ ${n(N)} = ${n(e)}.` },
    { prompt: `Does N = ${n(N - 1)} also work? Enter 1 if it does, 0 if it does not.`, answer: [0], explanation: `With m = ${n(N - 1)} and n very large, the gap comes as close to ${n(k)} ÷ ${n(N - 1)} as we like, and that is more than ${n(e)}, so some gap fails: 0.` }
   ] }; }
 },
 /* Geometric: first term a = (q − 1)q^(N−1)m and ratio 1 ÷ q, so the sum is mq^N, s_N = m(q^N − 1) and the tail is m.
    Telescoping: k ÷ (n(n + 1)) with k = (N + 1)m, so s_N = mN and the tail is m. Sums stay below 1000.
    Not the worked example (geometric 18, 6, 2, … after 2 terms). */
 q13: {
  canonical: { kind: 'geo', q: 2, N: 4, m: 3 },
  draw: R => tries(() => R.bool() ? { kind: 'geo', q: R.int(2, 5), N: R.int(3, 5), m: R.int(2, 9) } : { kind: 'tel', q: 0, N: R.int(3, 9), m: R.int(2, 9) },
   p => p.kind === 'tel' || (p.m * Math.pow(p.q, p.N) < 1000), GEN.q13.canonical),
  build: ({ kind, q, N, m }) => {
   const NN = sub(N), next = ord(N + 1);
   if (kind === 'geo') { const a = (q - 1) * Math.pow(q, N - 1) * m, S = m * Math.pow(q, N), sN = S - m, terms = []; for (let i = 0; i < N; i++) terms.push(a / Math.pow(q, i)); return {
    prompt: `The relay applies a chain of corrections without end: ${n(terms[0])}, ${n(terms[1])}, ${n(terms[2])}, …, each one the previous one divided by ${n(q)}. The total correction is the sum of this series. Enter the partial sum s${NN}, the sum of the first ${n(N)} corrections, then the tail after ${n(N)} corrections: the sum of all the corrections from the ${next} on.`,
    answer: [sN, m],
    hints: ['A partial sum adds only the first few terms. The sum of the whole series is the limit of its partial sums.', 'A geometric series with first term a and ratio r between −1 and 1 sums to a ÷ (1 − r). The tail is the whole sum minus the partial sum.'],
    solution: `The first ${n(N)} terms are ${terms.map(n).join(', ')}, so s${NN} = ${terms.map(n).join(' + ')} = ${n(sN)}. The series is geometric with first term ${n(a)} and ratio 1 ÷ ${n(q)}, so its sum is ${n(a)} ÷ (1 − 1 ÷ ${n(q)}) = ${q === 2 ? `${n(a)} × 2` : `${n(a)} × ${n(q)} ÷ ${n(q - 1)}`} = ${n(S)}. The tail after ${n(N)} terms is the sum minus the partial sum: ${n(S)} − ${n(sN)} = ${n(m)}.`,
    guidance: [
     { prompt: `Add the first ${n(N)} corrections, ${terms.map(n).join(', ')}. What is s${NN}?`, answer: [sN], explanation: `${terms.map(n).join(' + ')} = ${n(sN)}.` },
     { prompt: `The series is geometric with first term ${n(a)} and ratio 1 ÷ ${n(q)}. What is its sum, ${n(a)} ÷ (1 − 1 ÷ ${n(q)})?`, answer: [S], explanation: `1 − 1 ÷ ${n(q)} = ${n(q - 1)} ÷ ${n(q)}, so the sum is ${q === 2 ? `${n(a)} × 2` : `${n(a)} × ${n(q)} ÷ ${n(q - 1)}`} = ${n(S)}.` },
     { prompt: `The tail is everything after the first ${n(N)} terms. What is the sum ${n(S)} minus the partial sum ${n(sN)}?`, answer: [m], explanation: `${n(S)} − ${n(sN)} = ${n(m)}. The partial sums close in on ${n(S)}, and the tail is the part still missing.` }
    ] }; }
   const k = (N + 1) * m, sN = m * N; return {
    prompt: `The relay applies a chain of corrections without end: the n-th correction is ${n(k)} ÷ (n(n + 1)), for n = 1, 2, 3, …. The total correction is the sum of this series. Enter the partial sum s${NN}, the sum of the first ${n(N)} corrections, then the tail after ${n(N)} corrections: the sum of all the corrections from the ${next} on.`,
    answer: [sN, m],
    hints: ['A partial sum adds only the first few terms. The sum of the whole series is the limit of its partial sums.', 'Split each term as a difference, k ÷ n − k ÷ (n + 1). In a partial sum almost every piece cancels. The tail is the whole sum minus the partial sum.'],
    solution: `Since 1 ÷ n − 1 ÷ (n + 1) = 1 ÷ (n(n + 1)), each term is ${n(k)} ÷ n − ${n(k)} ÷ (n + 1). Adding the first ${n(N)} terms, every piece cancels except the first and the last: s${NN} = ${n(k)} − ${n(k)} ÷ ${n(N + 1)} = ${n(k)} − ${n(m)} = ${n(sN)}. In general the first N terms add up to ${n(k)} − ${n(k)} ÷ (N + 1), which tends to ${n(k)} as N grows, so the series sums to ${n(k)}. The tail after ${n(N)} terms is ${n(k)} − ${n(sN)} = ${n(m)}.`,
    guidance: [
     { prompt: `Each term is ${n(k)} ÷ n − ${n(k)} ÷ (n + 1), so the first ${n(N)} terms add up to ${n(k)} − ${n(k)} ÷ ${n(N + 1)}. What is s${NN}?`, answer: [sN], explanation: `${n(k)} ÷ ${n(N + 1)} = ${n(m)}, so s${NN} = ${n(k)} − ${n(m)} = ${n(sN)}.` },
     { prompt: `The partial sums are ${n(k)} − ${n(k)} ÷ (N + 1). What number do they tend to as N grows?`, answer: [k], explanation: `${n(k)} ÷ (N + 1) shrinks to 0, so the partial sums tend to ${n(k)}: that is the sum of the series.` },
     { prompt: `The tail is everything after the first ${n(N)} terms. What is the sum ${n(k)} minus the partial sum ${n(sN)}?`, answer: [m], explanation: `${n(k)} − ${n(sN)} = ${n(m)}. The partial sums close in on ${n(k)}, and the tail is the part still missing.` }
   ] }; }
 },
 /* aₙ = (−1)ⁿ⁺¹ c ÷ nᵖ with c a multiple of every nᵖ up to N, so every term and s_N are whole numbers. p = 1 converges only
    conditionally (code 0); p = 2 or 3 converges absolutely (code 1). Not the worked example (p = 1, c = 12, N = 4). */
 q14: {
  canonical: { p: 2, N: 3, c: 36 },
  draw: R => tries(() => {
    const opt = R.bool() ? R.pick([[1, 3, 6, 9], [1, 4, 12, 6], [1, 5, 60, 2]]) : R.pick([[2, 3, 36, 4], [2, 4, 144, 1], [3, 3, 216, 1], [2, 2, 4, 9]]);
    return { p: opt[0], N: opt[1], c: opt[2] * R.int(1, opt[3]) }; },
   p => !(p.p === 1 && p.N === 4 && p.c === 12), GEN.q14.canonical),
  build: ({ p, N, c }) => { const terms = []; for (let i = 1; i <= N; i++) terms.push((i % 2 ? 1 : -1) * c / Math.pow(i, p)); const sN = terms.reduce((s, t) => s + t, 0), code = p > 1 ? 1 : 0, NN = sub(N), pw = POW[p];
   const sumText = terms.map((t, i) => i === 0 ? n(t) : `${t < 0 ? '−' : '+'} ${n(Math.abs(t))}`).join(' ');
   return {
   prompt: `A relay’s correction readings alternate in sign: aₙ = (−1)ⁿ⁺¹ × ${n(c)} ÷ n${pw}, for n = 1, 2, 3, …. Enter 1 if the series Σ aₙ converges absolutely, or 0 if it converges only conditionally. Then enter the partial sum s${NN} of the first ${n(N)} terms.`,
   answer: [code, sN],
   hints: ['Absolute convergence asks about the series of sizes, Σ |aₙ|, with every sign made positive. That is a p-series times a constant.', 'A p-series Σ 1 ÷ nᵖ converges when p > 1 and diverges when p ≤ 1. For the partial sum, add the first terms with their signs.'],
   solution: `The sizes are |aₙ| = ${n(c)} ÷ n${pw}, ${n(c)} times the p-series with p = ${n(p)}. ${p > 1 ? `Because ${n(p)} > 1, Σ |aₙ| converges, so the series converges absolutely: 1.` : `Because p = 1 is not more than 1, Σ |aₙ| is a multiple of the harmonic series and diverges. The series itself still converges by the alternating series test, since its terms alternate in sign and shrink to 0 in size, so it converges only conditionally: 0.`} The first ${n(N)} terms are ${terms.map(n).join(', ')}, so s${NN} = ${sumText} = ${n(sN)}.`,
   guidance: [
    { prompt: `Make every sign positive: |aₙ| = ${n(c)} ÷ n${pw}. Which power p of n is this, up to the constant ${n(c)}?`, answer: [p], explanation: `${n(c)} ÷ n${pw} is ${n(c)} × 1 ÷ n${pw}, a p-series with p = ${n(p)}.` },
    { prompt: `A p-series converges exactly when p > 1. Enter 1 if Σ aₙ converges absolutely, 0 if only conditionally.`, answer: [code], explanation: p > 1 ? `p = ${n(p)} > 1, so the sizes add up to a finite total: absolute convergence, 1.` : `p = 1, so the sizes form a multiple of the harmonic series, which diverges. The signed series converges by the alternating series test, so only conditionally: 0.` },
    { prompt: `The first ${n(N)} terms are ${terms.map(n).join(', ')}. What is their sum s${NN}?`, answer: [sN], explanation: `${sumText} = ${n(sN)}.` }
   ] }; }
 },
 /* Geometric comparison: aₙ = k ÷ (qⁿ + c) < bₙ = k ÷ qⁿ, Σ bₙ = k ÷ (q − 1). Telescoping comparison: aₙ = k ÷ (n² + cn) ≤
    bₙ = k ÷ (n(n + 1)), Σ bₙ = k. k is a multiple of every denominator used, so a₁, b₁ and both bounds are whole numbers.
    The sharper bound is a₁ + Σ bₙ − b₁. Not the worked example (6 ÷ (2ⁿ + 1)). */
 q15: {
  canonical: { kind: 'geo', q: 3, c: 1, k: 12 },
  draw: R => tries(() => {
    if (R.bool()) { const q = R.int(2, 5), c = R.int(1, 5), L = lcm(lcm(q - 1, q), q + c); return { kind: 'geo', q, c, k: L * R.int(1, Math.max(1, Math.floor(240 / L))) }; }
    const c = R.int(2, 5), L = lcm(2, 1 + c); return { kind: 'tel', q: 0, c, k: L * R.int(1, Math.floor(60 / L)) }; },
   p => !(p.kind === 'geo' && p.q === 2 && p.c === 1 && p.k === 6) && p.k <= 240, GEN.q15.canonical),
  build: ({ kind, q, c, k }) => {
   if (kind === 'geo') { const B = k / (q - 1), a1 = k / (q + c), b1 = k / q, S2 = a1 + B - b1; return {
    prompt: `The relay’s corrections are aₙ = ${n(k)} ÷ (${n(q)}ⁿ + ${n(c)}), for n = 1, 2, 3, …. Compare each term with bₙ = ${n(k)} ÷ ${n(q)}ⁿ. Enter the upper bound on Σ aₙ given by the whole comparison series Σ bₙ, then the sharper upper bound a₁ + (b₂ + b₃ + b₄ + …), which keeps the first term exact.`,
    answer: [B, S2],
    hints: ['If 0 ≤ aₙ ≤ bₙ for every n and Σ bₙ converges, then Σ aₙ converges and its sum is at most Σ bₙ.', 'The comparison series here is geometric, so its sum is its first term divided by 1 minus its ratio. For the sharper bound, swap its first term for the exact first term of Σ aₙ.'],
    solution: `Since ${n(q)}ⁿ + ${n(c)} > ${n(q)}ⁿ, every aₙ is smaller than bₙ. Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} = ${n(b1)} and ratio 1 ÷ ${n(q)}, so it sums to ${n(b1)} ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(B)}. So Σ aₙ ≤ ${n(B)}. For the sharper bound, a₁ = ${n(k)} ÷ ${n(q + c)} = ${n(a1)} and b₁ = ${n(b1)}, so Σ aₙ ≤ ${n(a1)} + (${n(B)} − ${n(b1)}) = ${n(S2)}.`,
    guidance: [
     { prompt: `Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} and ratio 1 ÷ ${n(q)}. What is its sum?`, answer: [B], explanation: `(${n(k)} ÷ ${n(q)}) ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(B)}. Every aₙ is below bₙ, so Σ aₙ ≤ ${n(B)}.` },
     { prompt: `What is the exact first term a₁ = ${n(k)} ÷ (${n(q)} + ${n(c)})?`, answer: [a1], explanation: `a₁ = ${n(k)} ÷ ${n(q + c)} = ${n(a1)}.` },
     { prompt: `What is the comparison’s first term b₁ = ${n(k)} ÷ ${n(q)}?`, answer: [b1], explanation: `b₁ = ${n(k)} ÷ ${n(q)} = ${n(b1)}, a little more than a₁ = ${n(a1)}.` },
     { prompt: `Keep a₁ exact and compare only the rest: a₁ + (Σ bₙ − b₁). What is the sharper bound?`, answer: [S2], explanation: `${n(a1)} + (${n(B)} − ${n(b1)}) = ${n(S2)}.` }
    ] }; }
   const B = k, a1 = k / (1 + c), b1 = k / 2, S2 = a1 + B - b1; return {
    prompt: `The relay’s corrections are aₙ = ${n(k)} ÷ (n² + ${n(c)}n), for n = 1, 2, 3, …. Compare each term with bₙ = ${n(k)} ÷ (n² + n). Enter the upper bound on Σ aₙ given by the whole comparison series Σ bₙ, then the sharper upper bound a₁ + (b₂ + b₃ + b₄ + …), which keeps the first term exact.`,
    answer: [B, S2],
    hints: ['If 0 ≤ aₙ ≤ bₙ for every n and Σ bₙ converges, then Σ aₙ converges and its sum is at most Σ bₙ.', 'The comparison series telescopes: n² + n = n(n + 1). For the sharper bound, swap its first term for the exact first term of Σ aₙ.'],
    solution: `For n ≥ 1, n² + ${n(c)}n ≥ n² + n, so every aₙ is at most bₙ. Since bₙ = ${n(k)} ÷ (n(n + 1)) = ${n(k)} ÷ n − ${n(k)} ÷ (n + 1), the partial sums of Σ bₙ are ${n(k)} − ${n(k)} ÷ (N + 1), which tend to ${n(k)}. So Σ aₙ ≤ ${n(B)}. For the sharper bound, a₁ = ${n(k)} ÷ ${n(1 + c)} = ${n(a1)} and b₁ = ${n(k)} ÷ 2 = ${n(b1)}, so Σ aₙ ≤ ${n(a1)} + (${n(B)} − ${n(b1)}) = ${n(S2)}.`,
    guidance: [
     { prompt: `bₙ = ${n(k)} ÷ (n(n + 1)) telescopes, with partial sums ${n(k)} − ${n(k)} ÷ (N + 1). What is Σ bₙ?`, answer: [B], explanation: `${n(k)} ÷ (N + 1) shrinks to 0, so Σ bₙ = ${n(k)}. Every aₙ is at most bₙ, so Σ aₙ ≤ ${n(B)}.` },
     { prompt: `What is the exact first term a₁ = ${n(k)} ÷ (1 + ${n(c)})?`, answer: [a1], explanation: `a₁ = ${n(k)} ÷ ${n(1 + c)} = ${n(a1)}.` },
     { prompt: `What is the comparison’s first term b₁ = ${n(k)} ÷ 2?`, answer: [b1], explanation: `b₁ = ${n(k)} ÷ 2 = ${n(b1)}, at least as large as a₁ = ${n(a1)}.` },
     { prompt: `Keep a₁ exact and compare only the rest: a₁ + (Σ bₙ − b₁). What is the sharper bound?`, answer: [S2], explanation: `${n(a1)} + (${n(B)} − ${n(b1)}) = ${n(S2)}.` }
   ] }; }
 },
 /* Series A: aₙ = nᵏ pⁿ ÷ qⁿ with p, q coprime, 2 ≤ p, q ≤ 9, p ≠ q: the ratio tends to p ÷ q; code 1 if p < q (converges),
    0 if p > q (diverges). Series B: alternating c ÷ n with the next-term bound c ÷ (N + 1) < ε, so N + 1 > c ÷ ε = K and
    the smallest N is K. Not the worked example (n × 3ⁿ ÷ 4ⁿ; 3 ÷ n with ε = 0.1). */
 q16: {
  canonical: { k: 2, p: 2, q: 3, c: 5, e: 0.01 },
  draw: R => tries(() => ({ k: R.int(1, 3), p: R.int(2, 9), q: R.int(2, 9), c: R.int(2, 9), e: R.pick([0.1, 0.05, 0.02, 0.01]) }),
   p => p.p !== p.q && gcd(p.p, p.q) === 1 && !(p.k === 1 && p.p === 3 && p.q === 4), GEN.q16.canonical),
  build: ({ k, p, q, c, e }) => { const code = p < q ? 1 : 0, K = Math.round(c / e), nk = k === 1 ? 'n' : `n${POW[k]}`, rk = k === 1 ? '((n + 1) ÷ n)' : `((n + 1) ÷ n)${POW[k]}`; return {
   prompt: `Two correction series are logged at the relay station. Series A has terms aₙ = ${nk} × ${n(p)}ⁿ ÷ ${n(q)}ⁿ. Enter the limit of |aₙ₊₁ ÷ aₙ| as a fraction in lowest terms, numerator then denominator, then 1 if the ratio test shows that Σ aₙ converges, or 0 if it shows that Σ aₙ diverges. Series B is ${n(c)} − ${n(c)} ÷ 2 + ${n(c)} ÷ 3 − ${n(c)} ÷ 4 + …, with terms (−1)ⁿ⁺¹ × ${n(c)} ÷ n and sum S. Its sizes shrink to 0, so S lies within the next term of every partial sum: |S − s_N| ≤ ${n(c)} ÷ (N + 1). Enter the smallest N for which this bound guarantees |S − s_N| < ${n(e)}.`,
   answer: [p, q, code, K],
   hints: ['Divide the (n + 1)-th term by the n-th term and cancel. A power of n over a power of n + 1 tends to 1.', 'The ratio test: a limit below 1 means convergence, above 1 means divergence. For series B, solve the bound inequality for N + 1 first.'],
   solution: `aₙ₊₁ ÷ aₙ = ${rk} × ${n(p)} ÷ ${n(q)}. As n grows, (n + 1) ÷ n tends to 1, so the ratio tends to ${n(p)}/${n(q)}. ${code ? `This is below 1, so by the ratio test Σ aₙ converges (absolutely): 1.` : `This is above 1, so the terms eventually grow and by the ratio test Σ aₙ diverges: 0.`} The root test agrees: the n-th root of aₙ also tends to ${n(p)}/${n(q)}. For series B, ${n(c)} ÷ (N + 1) < ${n(e)} means N + 1 > ${n(c)} ÷ ${n(e)} = ${n(K)}, so N ≥ ${n(K)}. The smallest N is ${n(K)}.`,
   guidance: [
    { prompt: `aₙ₊₁ ÷ aₙ = ${rk} × ${n(p)} ÷ ${n(q)}. It tends to a fraction. Written in lowest terms, what is its numerator?`, answer: [p], explanation: `(n + 1) ÷ n tends to 1, so the ratio tends to ${n(p)}/${n(q)}, already in lowest terms. Its numerator is ${n(p)}.` },
    { prompt: `Same limit of the ratio, in lowest terms. What is its denominator?`, answer: [q], explanation: `The limit is ${n(p)}/${n(q)}, so its denominator is ${n(q)}.` },
    { prompt: `The ratio limit is ${n(p)}/${n(q)}. Enter 1 if the ratio test shows convergence, 0 if it shows divergence.`, answer: [code], explanation: code ? `${n(p)}/${n(q)} < 1, so Σ aₙ converges: 1.` : `${n(p)}/${n(q)} > 1, so Σ aₙ diverges: 0.` },
    { prompt: `For series B, the bound ${n(c)} ÷ (N + 1) must be strictly below ${n(e)}. Solve for N + 1 first. What is the smallest whole number N that does it?`, answer: [K], explanation: `${n(c)} ÷ (N + 1) < ${n(e)} needs N + 1 > ${n(c)} ÷ ${n(e)} = ${n(K)}, so N + 1 is at least ${n(K + 1)} and N is at least ${n(K)}. At N = ${n(K - 1)} the bound would equal ${n(e)} instead of being below it.` }
   ] }; }
 },
 /* cₙ = (−1)ⁿ⁺¹ k ÷ (n + d)ᵖ. p = 2: |cₙ| ≤ k ÷ n², a convergent p-series, so absolute (1). p = 1: |cₙ| ≥ k ÷ ((1 + d)n),
    a multiple of the harmonic series, so only conditional (0). Error bound after N terms: k ÷ (N + 1 + d)ᵖ = k ÷ Mᵖ, with
    M chosen so the bound has at most four decimals. Not the worked example (1 ÷ (n + 1), 4 terms). */
 q17: {
  canonical: { p: 2, k: 3, d: 1, M: 5 },
  draw: R => tries(() => { const p = R.int(1, 2); return { p, k: R.int(2, 9), d: R.int(1, 3), M: p === 2 ? R.pick([4, 5, 10]) : R.pick([5, 8, 10, 16, 20, 25]) }; },
   p => p.M - 1 - p.d >= 2 && !(p.p === 1 && p.k === 1), GEN.q17.canonical),
  build: ({ p, k, d, M }) => { const N = M - 1 - d, bound = G.tidy(k / Math.pow(M, p)), code = p === 2 ? 1 : 0, pw = POW[p], NN = sub(N); return {
   prompt: `The relay’s final chain of corrections is cₙ = (−1)ⁿ⁺¹ × ${n(k)} ÷ (n + ${n(d)})${pw}, for n = 1, 2, 3, …, with sum S. Enter 1 if Σ cₙ converges absolutely, or 0 if it converges only conditionally. Then enter the bound on the error |S − s${NN}| after ${n(N)} terms that the alternating series estimate guarantees.`,
   answer: [code, bound],
   hints: ['Compare the sizes |cₙ| with a p-series: make the bottom bigger or smaller in a way you can control.', 'When the sizes of an alternating series shrink to 0, the sum lies within the next term of every partial sum.'],
   solution: `${p === 2 ? `|cₙ| = ${n(k)} ÷ (n + ${n(d)})² ≤ ${n(k)} ÷ n², and Σ ${n(k)} ÷ n² is a p-series with p = 2 > 1, so it converges. By comparison Σ |cₙ| converges, and the series converges absolutely: 1.` : `For n ≥ 1, n + ${n(d)} ≤ ${n(1 + d)}n, so |cₙ| = ${n(k)} ÷ (n + ${n(d)}) ≥ ${n(k)} ÷ (${n(1 + d)}n). That is a multiple of the harmonic series, which diverges, so Σ |cₙ| diverges too. The terms alternate in sign and shrink to 0 in size, so the series still converges, but only conditionally: 0.`} The sizes decrease to 0, so S lies within the next term of s${NN}: |S − s${NN}| ≤ |c${sub(N + 1)}| = ${n(k)} ÷ (${n(N + 1)} + ${n(d)})${pw} = ${n(k)} ÷ ${n(Math.pow(M, p))} = ${n(bound)}.`,
   guidance: [
    { prompt: `Compare |cₙ| = ${n(k)} ÷ (n + ${n(d)})${pw} with a p-series. Enter 1 if Σ |cₙ| converges, 0 if it diverges.`, answer: [code], explanation: p === 2 ? `${n(k)} ÷ (n + ${n(d)})² ≤ ${n(k)} ÷ n², a p-series with p = 2 > 1, so Σ |cₙ| converges: 1.` : `${n(k)} ÷ (n + ${n(d)}) ≥ ${n(k)} ÷ (${n(1 + d)}n), a multiple of the harmonic series, so Σ |cₙ| diverges: 0.` },
    { prompt: `The error after ${n(N)} terms is at most the size of the next term, |c${sub(N + 1)}|. Which number is n + ${n(d)} for n = ${n(N + 1)}?`, answer: [M], explanation: `${n(N + 1)} + ${n(d)} = ${n(M)}.` },
    { prompt: `What is the bound |c${sub(N + 1)}| = ${n(k)} ÷ ${n(M)}${pw}?`, answer: [bound], explanation: `${n(k)} ÷ ${n(Math.pow(M, p))} = ${n(bound)}.` }
   ] }; }
 },
 /* Linear f(x) = mx + b at c: |f(x) − L| = |m||x − c|, so the largest δ is ε ÷ |m|. Quadratic g(x) = x² at c₂ with
    ε₂ = 2c₂δ₂ + δ₂², chosen so √(c₂² + ε₂) = c₂ + δ₂ exactly; the right side binds, so the largest δ is δ₂.
    c₂ ≥ 1 and δ₂ ≤ 0.5 keep c₂ − δ₂ positive. Not the worked example (3x + 1 at 1, ε = 0.6; x² at 1 with ε = 0.21). */
 q18: {
  canonical: { m: 4, b: -3, c: 2, e: 0.2, c2: 3, dl: 0.1 },
  draw: R => tries(() => ({ m: R.pick([-5, -4, -2, 2, 4, 5, 8]), b: R.int(-9, 9), c: R.int(1, 5), e: R.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), c2: R.int(1, 6), dl: R.pick([0.1, 0.2, 0.5]) }),
   p => !(p.c2 === 1 && p.dl === 0.1), GEN.q18.canonical),
  build: ({ m, b, c, e, c2, dl }) => { const L = m * c + b, d1 = G.tidy(e / Math.abs(m)), sq = c2 * c2, e2 = G.tidy(2 * c2 * dl + dl * dl), top = G.tidy(sq + e2), rt = G.tidy(c2 + dl), lo = G.tidy((c2 - dl) * (c2 - dl)), low = G.tidy(sq - e2); return {
   prompt: `A thermostat’s dial reads f(x) = ${lin(m, b)} for a control setting x, and f(x) → ${n(L)} as x → ${n(c)}. Enter the largest δ such that |f(x) ${mns(L)}| < ${n(e)} whenever 0 < |x − ${n(c)}| < δ. A second gauge reads g(x) = x², and g(x) → ${n(sq)} as x → ${n(c2)}. Enter the largest δ such that |x² − ${n(sq)}| < ${n(e2)} whenever 0 < |x − ${n(c2)}| < δ.`,
   answer: [d1, dl],
   hints: ['For a straight line, the output gap is the slope’s size times the input gap, so solve |slope| × δ = ε.', 'For x², the output grows faster to the right of the point, so the right side is the one that limits δ: solve (c + δ)² = c² + ε.'],
   solution: `f(x) ${mns(L)} = ${n(m)}(x − ${n(c)}), so |f(x) ${mns(L)}| = ${n(Math.abs(m))} × |x − ${n(c)}|. That is below ${n(e)} exactly when |x − ${n(c)}| < ${n(e)} ÷ ${n(Math.abs(m))} = ${n(d1)}. So δ = ${n(d1)} works, and any larger δ lets in an x whose gap from ${n(c)} is just above ${n(d1)}, where |f(x) ${mns(L)}| is ${n(e)} or more. For g, the right side binds: x² < ${n(sq)} + ${n(e2)} = ${n(top)} means x < √${n(top)} = ${n(rt)}, which is ${n(c2)} + ${n(dl)}. On the left, every x between ${n(c2 - dl)} and ${n(c2)} has x² > ${n(c2 - dl)}² = ${n(lo)}, which is above ${n(sq)} − ${n(e2)} = ${n(low)}, so the left side never fails first. The largest δ for g is ${n(dl)}.`,
   guidance: [
    { prompt: `|f(x) ${mns(L)}| = ${n(Math.abs(m))} × |x − ${n(c)}|. What is the largest δ with ${n(Math.abs(m))} × δ ≤ ${n(e)}?`, answer: [d1], explanation: `δ = ${n(e)} ÷ ${n(Math.abs(m))} = ${n(d1)}. Inside that distance the output gap is below ${n(e)}; just outside it is not.` },
    { prompt: `On the right of ${n(c2)}, x² stays below ${n(sq)} + ${n(e2)} = ${n(top)} only while x < √${n(top)}. What is √${n(top)}?`, answer: [rt], explanation: `${n(rt)} × ${n(rt)} = ${n(top)}, so √${n(top)} = ${n(rt)}.` },
    { prompt: `The left side is safe, since ${n(c2 - dl)}² = ${n(lo)} is above ${n(low)}. What is the largest δ for g?`, answer: [dl], explanation: `δ is the distance from ${n(c2)} to ${n(rt)}: ${n(rt)} − ${n(c2)} = ${n(dl)}.` }
   ] }; }
 },
 /* f(x) = mx + b at c with xₙ = c + (−1)ⁿk ÷ n. f(x_j) = mc + b ± mk ÷ j. Largest δ = ε ÷ |m|. |f(xₙ) − f(c)| = |m|k ÷ n,
    below ε from n = K + 1 on, K = |m|k ÷ ε. |m| in {2, 4, 5} and ε in {0.1, 0.2, 0.5} keep δ and K exact. Not the
    worked example (3x − 2 at 1 with xₙ = 1 + 1 ÷ n, ε = 0.3). */
 q19: {
  canonical: { m: 2, b: 1, c: 3, k: 2, e: 0.1, j: 10 },
  draw: R => tries(() => ({ m: R.pick([-5, -4, -2, 2, 4, 5]), b: R.int(-9, 9), c: R.int(1, 6), k: R.int(2, 5), e: R.pick([0.1, 0.2, 0.5]), j: R.pick([4, 5, 8, 10]) }),
   p => true, GEN.q19.canonical),
  build: ({ m, b, c, k, e, j }) => { const fc = m * c + b, sign = j % 2 ? -1 : 1, X = G.tidy(c + sign * k / j), F = G.tidy(m * X + b), am = Math.abs(m), d = G.tidy(e / am), K = Math.round(am * k / e), n0 = K + 1; return {
   prompt: `A heater’s output is f(x) = ${lin(m, b)} for a setting x. To test continuity at x = ${n(c)}, the lab feeds in the settings xₙ = ${n(c)} + (−1)ⁿ × ${n(k)} ÷ n, which tend to ${n(c)}. Enter f(x${sub(j)}). Then enter the largest δ such that |f(x) − f(${n(c)})| < ${n(e)} whenever |x − ${n(c)}| < δ. Finally enter the smallest n such that |f(xₙ) − f(${n(c)})| < ${n(e)} for that n and every later one.`,
   answer: [F, d, n0],
   hints: ['For a straight line, the output gap is the size of the slope times the input gap.', 'The n-th setting is k ÷ n away from the point, so the output gap is |slope| × k ÷ n. Solve that inequality for n.'],
   solution: `x${sub(j)} = ${n(c)} ${sign < 0 ? '−' : '+'} ${n(k)} ÷ ${n(j)} = ${n(X)}, so f(x${sub(j)}) = ${n(m)} × ${par(X)}${cst(b)} = ${n(F)}. Since f(${n(c)}) = ${n(fc)}, |f(x) ${mns(fc)}| = ${n(am)} × |x − ${n(c)}|, which is below ${n(e)} exactly when |x − ${n(c)}| < ${n(e)} ÷ ${n(am)} = ${n(d)}; so the largest δ is ${n(d)}. For the sequence, |xₙ − ${n(c)}| = ${n(k)} ÷ n, so |f(xₙ) ${mns(fc)}| = ${n(am * k)} ÷ n. This is below ${n(e)} exactly when n > ${n(am * k)} ÷ ${n(e)} = ${n(K)}, so from n = ${n(n0)} on. Those are exactly the n with ${n(k)} ÷ n < ${n(d)}, where xₙ is within δ of ${n(c)}.`,
   guidance: [
    { prompt: `The ${ord(j)} setting is x${sub(j)} = ${n(c)} ${sign < 0 ? '−' : '+'} ${n(k)} ÷ ${n(j)}. What is f(x${sub(j)})?`, answer: [F], explanation: `x${sub(j)} = ${n(X)}, and f(${n(X)}) = ${n(m)} × ${par(X)}${cst(b)} = ${n(F)}.` },
    { prompt: `|f(x) − f(${n(c)})| = ${n(am)} × |x − ${n(c)}|. What is the largest δ that keeps this below ${n(e)}?`, answer: [d], explanation: `${n(am)} × δ = ${n(e)} gives δ = ${n(d)}.` },
    { prompt: `|f(xₙ) − f(${n(c)})| = ${n(am * k)} ÷ n. What is the smallest n from which this stays below ${n(e)}?`, answer: [n0], explanation: `${n(am * k)} ÷ n < ${n(e)} means n > ${n(K)}, so the first such n is ${n(n0)}, and the gap keeps shrinking after it.` }
   ] }; }
 },
 /* f(x) = ax + b for x < c, f(c) = v, x² + q for x > c. kind 0: q = L − c² and v = L (continuous); kind 1: q = L − c²,
    v ≠ L (removable); kind 2: q ≠ L − c² (jump). Answers: left limit L = ac + b, right limit c² + q, code.
    Not the worked example (2x + 1 and x² + 2 at 1, f(1) = 4). */
 q20: {
  canonical: { a: 3, b: -1, c: 2, kind: 1, q: 1, v: 8 },
  draw: R => tries(() => { const a = R.int(2, 6), b = R.int(-9, 9), c = R.int(1, 4), kind = R.int(0, 2), L = a * c + b;
    const q = kind === 2 ? L - c * c + R.nz(-6, 6) : L - c * c; const v = kind === 1 ? L + R.nz(-5, 5) : kind === 0 ? L : R.pick([L, c * c + q, L + R.nz(-3, 3)]); return { a, b, c, kind, q, v }; },
   p => !(p.a === 2 && p.b === 1 && p.c === 1), GEN.q20.canonical),
  build: ({ a, b, c, kind, q, v }) => { const L = a * c + b, Rt = c * c + q, code = L !== Rt ? 2 : (v === L ? 0 : 1); return {
   prompt: `A thermostat switches its heating law at x = ${n(c)}: f(x) = ${lin(a, b)} for x < ${n(c)}, f(${n(c)}) = ${n(v)}, and f(x) = x²${cst(q)} for x > ${n(c)}. Enter the left-hand limit of f at ${n(c)}, then the right-hand limit, then a code: 0 if f is continuous at ${n(c)}, 1 if it has a removable discontinuity there, 2 if it has a jump discontinuity.`,
   answer: [L, Rt, code],
   hints: ['Each one-sided limit uses only the piece on that side, put in at the switching point; the value f(c) itself plays no part in either limit.', 'Different one-sided limits make a jump. Equal ones that differ from the value make a removable discontinuity. Equal ones that match the value mean continuity.'],
   solution: `From the left, ${lin(a, b)} tends to ${n(a)} × ${n(c)}${cst(b)} = ${n(L)}. From the right, x²${cst(q)} tends to ${n(c * c)}${cst(q)} = ${n(Rt)}. ${code === 2 ? `The one-sided limits differ, so f has a jump discontinuity at ${n(c)}: code 2.` : code === 1 ? `The one-sided limits agree, so the limit is ${n(L)}, but f(${n(c)}) = ${n(v)} is different: redefining that one value would mend it, so this is a removable discontinuity, code 1.` : `The one-sided limits agree at ${n(L)}, and f(${n(c)}) = ${n(v)} matches, so f is continuous at ${n(c)}: code 0.`}`,
   guidance: [
    { prompt: `Only the left piece ${lin(a, b)} matters for x just below ${n(c)}. What is the left-hand limit?`, answer: [L], explanation: `${n(a)} × ${n(c)}${cst(b)} = ${n(L)}.` },
    { prompt: `Only the right piece x²${cst(q)} matters for x just above ${n(c)}. What is the right-hand limit?`, answer: [Rt], explanation: `${n(c * c)}${cst(q)} = ${n(Rt)}.` },
    { prompt: `The limits are ${n(L)} and ${n(Rt)}, and f(${n(c)}) = ${n(v)}. Which code fits: 0 continuous, 1 removable, 2 jump?`, answer: [code], explanation: code === 2 ? `The one-sided limits differ: a jump, code 2.` : code === 1 ? `The limits agree but the value is different: removable, code 1.` : `The limits agree and match the value: continuous, code 0.` }
   ] }; }
 }
};
Object.assign(window.MISSION_GEN, GEN);
})();
