/* Real analysis practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p3.js. */
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
/* Subscript digits for indices (x₄, s₉); ordinals (1st, 2nd, 3rd, 11th); a linear expression ax + b with no written 1 and no "+ 0". */
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = k => String(k).split('').map(ch => SUB[Number(ch)]).join('');
const ord = k => { const t = k % 100, u = k % 10; return k + ((t >= 11 && t <= 13) ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
const cst = v => v === 0 ? '' : ` ${v < 0 ? '−' : '+'} ${n(Math.abs(v))}`;
const lin = (a, b, x = 'x') => `${a === 1 ? '' : a === -1 ? '−' : n(a)}${x}${cst(b)}`;
const co = x => x === 1 ? '' : n(x);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => a / gcd(a, b) * b;
const POW = ['', '', '²', '³'];
/* Bounded retry: at most 1000 tries, then the canonical parameters (wave 2 rule). */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* Signed sum of numbers as worked: signed([8, −8, 10]) is '8 − 8 + 10'. */
const signed = list => list.map((v, i) => i ? (v < 0 ? ' − ' : ' + ') + n(Math.abs(v)) : n(v)).join('');
/* Added to a prompt whose answers can reach 1000 or more. */
const wc = ans => Math.max(...ans.map(Math.abs)) >= 1000 ? ' Type any number of 1000 or more without commas.' : '';
const EPS = [0.1, 0.05, 0.02, 0.01];
const EPS2 = [0.1, 0.05, 0.04, 0.025, 0.02, 0.01];

/* ---- q11 Chapter review: certifying a signal log [2.1–2.3] ---- */

{
/* Channel P: pₙ = (cLn + b) ÷ (cn + d) tends to L, with |pₙ − L| = D ÷ (cn + d), D = |b − Ld|; the distance falls as n grows, so the
   smallest N has cN + d > K = D ÷ ε and is floor((K − d) ÷ c) + 1. Channel Q: qₙ = C + r(−1)ⁿ − s ÷ n rises towards C + r along the even
   terms and towards C − r along the odd ones, so liminf is C − r. D ≤ 9 keeps N small. Not the parent's worked example (2n + 1) ÷ (n + 1). */
const CAN = { L: 3, c: 2, b: 7, d: 3, e: 0.05, C: 8, r: 3, s: 5 };
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The pressure gauge log',
 brief: 'A pressure gauge reports through two channels, and Mira will sign only if one channel provably settles and the other has a known lowest swing.',
 labels: ['limit L', 'smallest N', 'liminf of qₙ'], tolerance: 0.01,
 gl: [['L'], ['cn + d must exceed'], ['N'], ['liminf']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ L: R.int(2, 7), c: R.int(2, 4), b: R.nz(-9, 9), d: R.int(1, 5), e: R.pick(EPS), C: R.int(5, 12), r: R.int(2, 4), s: R.int(1, 9) }),
  p => { const D = Math.abs(p.b - p.L * p.d); return D >= 1 && D <= 9; }, CAN),
 build: ({ L, c, b, d, e, C, r, s }) => { const diff = b - L * d, D = Math.abs(diff), K = Math.round(D / e), N = Math.floor((K - d) / c) + 1, hi = C + r, lo = C - r,
  top = lin(c * L, b, 'n'), bot = `${n(c)}n + ${n(d)}`; return {
  prompt: `A pressure gauge in the signal log reports through two channels, read at n = 1, 2, 3, …. Channel P reads pₙ = (${top}) ÷ (${bot}). Channel Q reads qₙ = ${n(C)} + ${n(r)} × (−1)ⁿ − ${n(s)} ÷ n. Enter the limit L of channel P, then the smallest N such that |pₙ − L| < ${n(e)} for every n ≥ N, then the limit inferior of channel Q.${wc([L, N, lo])}`,
  answer: [L, N, lo],
  hints: ['The limit of a ratio of two linear expressions in n is the ratio of the numbers in front of n.', 'Write pₙ − L as one fraction, with n only in the bottom, and solve the inequality for n. For channel Q, follow the even terms and the odd terms separately, and note that the part taken away shrinks.'],
  solution: `Dividing the top and the bottom by n shows that pₙ tends to ${n(c * L)} ÷ ${n(c)} = ${n(L)}, so L = ${n(L)}. Then pₙ − ${n(L)} = (${top} − ${n(L)}(${bot})) ÷ (${bot}) = ${n(diff)} ÷ (${bot}), so |pₙ − ${n(L)}| = ${n(D)} ÷ (${bot}). This is below ${n(e)} exactly when ${bot} > ${n(D)} ÷ ${n(e)} = ${n(K)}. The distance shrinks as n grows. At n = ${n(N - 1)} the bottom is ${n(c * (N - 1) + d)}, not above ${n(K)}, and at n = ${n(N)} it is ${n(c * N + d)}, which is above ${n(K)}, so the smallest N is ${n(N)}. For channel Q, the even terms are ${n(hi)} − ${n(s)} ÷ n and rise towards ${n(hi)}; the odd terms are ${n(lo)} − ${n(s)} ÷ n and rise towards ${n(lo)}. For a late start, the smallest term of the tail is its first odd term, just below ${n(lo)}, and these smallest terms rise to ${n(lo)}, so liminf qₙ = ${n(lo)}.`,
  guidance: [
   { prompt: `Divide the top and the bottom of pₙ = (${top}) ÷ (${bot}) by n. What number L does pₙ tend to?`, answer: [L], explanation: `Both pieces carrying 1 ÷ n tend to 0, so pₙ tends to ${n(c * L)} ÷ ${n(c)} = ${n(L)}.` },
   { prompt: `|pₙ − ${n(L)}| = ${n(D)} ÷ (${bot}). For this to be below ${n(e)}, the bottom ${bot} must be larger than which number?`, answer: [K], explanation: `${n(D)} ÷ (${bot}) < ${n(e)} exactly when ${bot} > ${n(D)} ÷ ${n(e)} = ${n(K)}.` },
   { prompt: `So ${bot} must be above ${n(K)}. What is the smallest whole number N for which this holds at n = N (and so at every later n)?`, answer: [N], explanation: `At n = ${n(N - 1)} the bottom is ${n(c * (N - 1) + d)}, which is not above ${n(K)}; at n = ${n(N)} it is ${n(c * N + d)}, which is. The bottom only grows, so ${n(N)} is the smallest N.` },
   { prompt: `The even terms of qₙ are ${n(hi)} − ${n(s)} ÷ n and the odd terms are ${n(lo)} − ${n(s)} ÷ n. What is the limit inferior of qₙ?`, answer: [lo], explanation: `The even terms rise towards ${n(hi)} and the odd ones towards ${n(lo)}. The infima of late tails rise to the smaller of the two, so liminf qₙ = ${n(lo)}.` }
  ] }; }
});
}

{
/* Sensor reading rₙ = L − k ÷ (n + d) rises to L from below; |rₙ − L| = k ÷ (n + d) < ε exactly when n + d > K = k ÷ ε, so the smallest N is K − d + 1
   and N − 1 readings are discarded, each costing h minutes. k ÷ ε is a whole number for these ε. Not the parent's worked example. */
const CAN = { L: 18, k: 4, d: 3, e: 0.05, h: 5 };
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The thermal sensor certificate',
 brief: 'A thermal sensor can be certified only from the reading after which it stays close to its limit, and the earlier readings cost testing time.',
 labels: ['limit L (degrees)', 'smallest N', 'minutes discarded'], tolerance: 0.01,
 gl: [['L (degrees)'], ['N'], ['minutes wasted']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ L: R.int(10, 60), k: R.int(2, 9), d: R.int(1, 6), e: R.pick(EPS), h: R.pick([2, 3, 5, 10]) }), p => true, CAN),
 build: ({ L, k, d, e, h }) => { const K = Math.round(k / e), N = K - d + 1, lost = (N - 1) * h; return {
  prompt: `The signal log certifies a thermal sensor. Its n-th reading is rₙ = L − ${n(k)} ÷ (n + ${n(d)}) degrees, for n = 1, 2, 3, …, where L is the limit of the readings, and the sensor is read once every ${n(h)} minutes. The certificate counts only readings from the N-th on, where N is the smallest number such that |rₙ − L| < ${n(e)} for every n ≥ N. Every reading before the N-th is discarded, and each discarded reading wasted ${n(h)} minutes. Enter the limit L, then N, then the number of minutes wasted.${wc([L, N, lost])}`,
  answer: [L, N, lost],
  hints: ['The readings are a fixed number minus a fraction whose bottom grows, so the fraction tends to 0 and the limit is the fixed number.', 'The distance |rₙ − L| is the fraction itself. Solve fraction < tolerance for n + d, then count whole readings. The discarded readings are all those before the N-th.'],
  solution: `The fraction ${n(k)} ÷ (n + ${n(d)}) tends to 0, so rₙ tends to L = ${n(L)}. The distance is |rₙ − ${n(L)}| = ${n(k)} ÷ (n + ${n(d)}), which shrinks as n grows. It is below ${n(e)} exactly when n + ${n(d)} > ${n(k)} ÷ ${n(e)} = ${n(K)}, that is when n > ${n(K - d)}, so the smallest N is ${n(N)}. The readings before the ${ord(N)} are the first ${n(N - 1)}, and at ${n(h)} minutes each they wasted ${n(N - 1)} × ${n(h)} = ${n(lost)} minutes.`,
  guidance: [
   { prompt: `The fraction ${n(k)} ÷ (n + ${n(d)}) tends to 0 as n grows, and rₙ = L − that fraction. What is the limit L of the readings, in degrees?`, answer: [L], explanation: `rₙ = ${n(L)} − ${n(k)} ÷ (n + ${n(d)}) and the fraction tends to 0, so the readings tend to ${n(L)}.` },
   { prompt: `|rₙ − ${n(L)}| = ${n(k)} ÷ (n + ${n(d)}), which is below ${n(e)} exactly when n + ${n(d)} > ${n(k)} ÷ ${n(e)}. What is the smallest whole number N for which this holds for every n ≥ N?`, answer: [N], explanation: `${n(k)} ÷ ${n(e)} = ${n(K)}, so n + ${n(d)} > ${n(K)}, that is n > ${n(K - d)}. The first whole number above ${n(K - d)} is ${n(N)}, and every later n also works because the distance keeps shrinking.` },
   { prompt: `The first ${n(N - 1)} readings are discarded, at ${n(h)} minutes each. How many minutes were wasted?`, answer: [lost], explanation: `${n(N - 1)} × ${n(h)} = ${n(lost)} minutes.` }
  ] }; }
});
}

{
/* wₙ is squeezed by (Ln − a) ÷ n and (Ln + b) ÷ n, so |wₙ − L| ≤ M ÷ n with M = max(a, b); M ÷ n < ε exactly when n > K = M ÷ ε, so the bounds
   guarantee the closeness from N = K + 1. Channel Z has period 3 plus s ÷ n falling towards each value from above, so limsup is the largest of
   the three values and liminf the smallest. M ÷ ε is a whole number for these ε. */
const CAN = { L: 4, a: 3, b: 6, e: 0.02, U: 9, V: 2, W: 5, s: 4 };
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q09', title: 'The squeezed calibration rod',
 brief: 'A calibration rod cannot be read exactly, but it is trapped between two certified bounds, and a second channel cycles through three levels.',
 labels: ['limit of wₙ', 'smallest N', 'limsup of zₙ', 'liminf of zₙ'], tolerance: 0.01,
 gl: [['limit'], ['n must exceed'], ['N'], ['limsup'], ['liminf']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ L: R.int(2, 9), a: R.int(1, 9), b: R.int(1, 9), e: R.pick([0.1, 0.05, 0.02, 0.01, 0.005]), U: R.int(0, 12), V: R.int(0, 12), W: R.int(0, 12), s: R.int(1, 9) }),
  p => p.a !== p.b && p.U !== p.V && p.V !== p.W && p.U !== p.W, CAN),
 build: ({ L, a, b, e, U, V, W, s }) => { const M = Math.max(a, b), K = Math.round(M / e), N = K + 1, hi = Math.max(U, V, W), lo = Math.min(U, V, W),
  lowB = lin(L, -a, 'n'), upB = lin(L, b, 'n'); return {
  prompt: `A calibration rod is read at n = 1, 2, 3, …. Its reading wₙ cannot be found exactly, but the lab has proved that (${lowB}) ÷ n ≤ wₙ ≤ (${upB}) ÷ n for every n. The squeeze lemma says that a sequence trapped between two sequences with the same limit has that limit too. Enter the limit of wₙ. Then enter the smallest N for which these two bounds alone guarantee |wₙ − limit| < ${n(e)} for every n ≥ N. A second channel reads zₙ = ${n(U)} + ${n(s)} ÷ n when n leaves remainder 1 on division by 3, zₙ = ${n(V)} + ${n(s)} ÷ n when it leaves remainder 2, and zₙ = ${n(W)} + ${n(s)} ÷ n when n is a multiple of 3. Enter its limit superior, then its limit inferior.${wc([L, N, hi, lo])}`,
  answer: [L, N, hi, lo],
  hints: ['Divide the top and the bottom of each bound by n: if both bounds tend to the same number, so does the squeezed reading.', 'Subtract the limit from every part of the double inequality to see how far wₙ can be from it, and use the larger of the two gaps. For channel Z, the terms with the same remainder form a subsequence; the limsup is the largest limit among the subsequences and the liminf the smallest.'],
  solution: `The lower bound is ${n(L)} − ${n(a)} ÷ n and the upper bound is ${n(L)} + ${n(b)} ÷ n. Both tend to ${n(L)}, so by the squeeze lemma wₙ tends to ${n(L)}. Subtracting ${n(L)} from every part gives −${n(a)} ÷ n ≤ wₙ − ${n(L)} ≤ ${n(b)} ÷ n, so |wₙ − ${n(L)}| ≤ ${n(M)} ÷ n, where ${n(M)} is the larger of ${n(a)} and ${n(b)}. This is below ${n(e)} exactly when n > ${n(M)} ÷ ${n(e)} = ${n(K)}, so the bounds guarantee it from N = ${n(N)} (at n = ${n(K)} the bounds allow a gap as large as ${n(e)}, which is not below it). The three subsequences of zₙ tend to ${n(U)}, ${n(V)} and ${n(W)}, so limsup zₙ = ${n(hi)} and liminf zₙ = ${n(lo)}.`,
  guidance: [
   { prompt: `Divide the top and the bottom of both bounds, (${lowB}) ÷ n and (${upB}) ÷ n, by n. What number do both tend to, so that wₙ is squeezed to it?`, answer: [L], explanation: `The bounds are ${n(L)} − ${n(a)} ÷ n and ${n(L)} + ${n(b)} ÷ n. Both pieces carrying 1 ÷ n tend to 0, so both bounds tend to ${n(L)}, and so does wₙ.` },
   { prompt: `Subtracting ${n(L)} from every part gives |wₙ − ${n(L)}| ≤ ${n(M)} ÷ n, where ${n(M)} is the larger of ${n(a)} and ${n(b)}. For ${n(M)} ÷ n to be below ${n(e)}, n must be larger than which number?`, answer: [K], explanation: `${n(M)} ÷ n < ${n(e)} exactly when n > ${n(M)} ÷ ${n(e)} = ${n(K)}.` },
   { prompt: `The bounds guarantee closeness for every n above ${n(K)}. What is the smallest whole number N that works?`, answer: [N], explanation: `The first whole number above ${n(K)} is ${n(K + 1)}. At n = ${n(K)} the bounds allow a gap as large as ${n(e)}, which is not below ${n(e)}, so ${n(K)} is not enough.` },
   { prompt: `The terms of zₙ with remainder 1, remainder 2 and remainder 0 form three subsequences that tend to ${n(U)}, ${n(V)} and ${n(W)}. What is the limit superior of zₙ?`, answer: [hi], explanation: `The limsup is the largest limit of a subsequence, ${n(hi)}.` },
   { prompt: `With the same three subsequence limits ${n(U)}, ${n(V)} and ${n(W)}, what is the limit inferior of zₙ?`, answer: [lo], explanation: `The liminf is the smallest limit of a subsequence, ${n(lo)}.` }
  ] }; }
});
}

/* ---- q12 Cauchy sequences [2.4] ---- */

{
/* vₙ = c − k ÷ (n + d) rises; for m, n ≥ N the gap |vₘ − vₙ| stays below k ÷ (N + d) and comes as close to it as we like, so N works exactly when
   k ÷ (N + d) ≤ ε: the smallest N is K − d with K = k ÷ ε, a whole number for these ε. The pair of readings has bottoms U = u + d and V = v + d,
   so the gap is k(1 ÷ U − 1 ÷ V), at most three decimals. Not the parent's worked example (5 + 2 ÷ n). */
const CAN = { c: 7, k: 3, d: 2, e: 0.02, U: 4, V: 10 };
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The voltage monitor audit',
 brief: 'A relay voltage monitor creeps upwards, and Mira wants a Cauchy certificate that does not depend on knowing where it ends.',
 labels: ['gap (volts)', 'smallest N'], tolerance: 0.0005,
 gl: [['gap (volts)'], ['N + d at least'], ['N']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ c: R.int(1, 9), k: R.int(2, 9), d: R.int(1, 3), e: R.pick(EPS2), U: R.pick([4, 5, 8, 10]), V: R.pick([20, 25, 40, 50]) }), p => true, CAN),
 build: ({ c, k, d, e, U, V }) => { const u = U - d, v = V - d, gap = G.tidy(k * (1 / U - 1 / V)), K = Math.round(k / e), N = K - d, vu = G.tidy(c - k / U), vv = G.tidy(c - k / V); return {
  prompt: `A relay’s voltage monitor logs vₙ = ${n(c)} − ${n(k)} ÷ (n + ${n(d)}) volts, for n = 1, 2, 3, …. A Cauchy certificate must not use the limit. Enter the gap |v${sub(u)} − v${sub(v)}| in volts. Then enter the smallest N such that |vₘ − vₙ| < ${n(e)} for all m, n ≥ N.${wc([gap, N])}`,
  answer: [gap, N],
  hints: ['The constant part of the reading cancels in every gap, so only the shrinking fraction matters.', 'For m and n both at least N, both fractions lie between 0 and their value at N. Find the largest gap they can come close to, then compare it with ε.'],
  solution: `v${sub(u)} = ${n(c)} − ${n(k)} ÷ (${n(u)} + ${n(d)}) = ${n(c)} − ${n(k)} ÷ ${n(U)} = ${n(vu)} and v${sub(v)} = ${n(c)} − ${n(k)} ÷ ${n(V)} = ${n(vv)}, so the gap is ${n(gap)}; the ${n(c)} cancels. For m, n ≥ N, both ${n(k)} ÷ (m + ${n(d)}) and ${n(k)} ÷ (n + ${n(d)}) lie between 0 and ${n(k)} ÷ (N + ${n(d)}), so every gap is less than ${n(k)} ÷ (N + ${n(d)}). Taking m = N and n very large makes the gap as close to that as we like. So N works exactly when ${n(k)} ÷ (N + ${n(d)}) ≤ ${n(e)}, that is N + ${n(d)} ≥ ${n(k)} ÷ ${n(e)} = ${n(K)}. The smallest N is ${n(K)} − ${n(d)} = ${n(N)}.`,
  guidance: [
   { prompt: `Work out v${sub(u)} and v${sub(v)} from vₙ = ${n(c)} − ${n(k)} ÷ (n + ${n(d)}). What is the gap |v${sub(u)} − v${sub(v)}|, in volts?`, answer: [gap], explanation: `v${sub(u)} = ${n(vu)} and v${sub(v)} = ${n(vv)}, so the gap is ${n(gap)}. The ${n(c)} cancels, which is why a Cauchy test never needs the limit.` },
   { prompt: `For m, n ≥ N the gaps stay below ${n(k)} ÷ (N + ${n(d)}) and come as close to it as we like. So N works exactly when ${n(k)} ÷ (N + ${n(d)}) ≤ ${n(e)}. N + ${n(d)} must be at least which number?`, answer: [K], explanation: `${n(k)} ÷ (N + ${n(d)}) ≤ ${n(e)} means N + ${n(d)} ≥ ${n(k)} ÷ ${n(e)} = ${n(K)}.` },
   { prompt: `So N + ${n(d)} ≥ ${n(K)}. What is the smallest whole number N?`, answer: [N], explanation: `N ≥ ${n(K)} − ${n(d)} = ${n(N)}. At N = ${n(N)} every gap is strictly below ${n(k)} ÷ ${n(K)} = ${n(e)}.` }
  ] }; }
});
}

{
/* xₙ = c + k ÷ n, tolerance t millivolts = t ÷ 1000 volts, N = k ÷ ε = 1000k ÷ t (t divides 1000), blocks of B: ceil(N ÷ B). */
const CAN = { c: 6, k: 4, t: 25, B: 50 };
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'The repeater block store',
 brief: 'The repeater stores its readings in blocks, and the lab needs to know how many blocks must be kept before the log is certified as settled.',
 labels: ['tolerance (volts)', 'smallest N', 'blocks'], tolerance: 0.0005,
 gl: [['tolerance (volts)'], ['N'], ['blocks']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ c: R.int(1, 9), k: R.int(2, 9), t: R.pick([10, 20, 25, 40, 50, 100]), B: R.pick([25, 50, 100]) }), p => true, CAN),
 build: ({ c, k, t, B }) => { const eps = t / 1000, N = Math.round(k * 1000 / t), blocks = Math.ceil(N / B); return {
  prompt: `A relay monitor logs xₙ = ${n(c)} + ${n(k)} ÷ n volts, for n = 1, 2, 3, …. The lab allows a tolerance of ${n(t)} millivolts between any two late readings (1 millivolt is 0.001 volt). Enter the tolerance in volts. Then enter the smallest N such that |xₘ − xₙ| is below this tolerance for all m, n ≥ N. The monitor saves its readings in order, in blocks of ${n(B)}; enter how many blocks must be saved to include the N-th reading (a block that is only partly filled still counts as one block).${wc([eps, N, blocks])}`,
  answer: [eps, N, blocks],
  hints: ['A millivolt is a thousandth of a volt, so divide the millivolts by 1000. For the Cauchy test the constant part cancels and only the shrinking fraction matters.', 'For m and n both at least N, the gaps stay below the fraction’s value at N and come as close to it as we like. Then divide N by the block size and round up.'],
  solution: `${n(t)} millivolts is ${n(t)} ÷ 1000 = ${n(eps)} volts. For m, n ≥ N the gaps stay below ${n(k)} ÷ N and come as close to it as we like, so N works exactly when ${n(k)} ÷ N ≤ ${n(eps)}, that is N ≥ ${n(k)} ÷ ${n(eps)} = ${n(N)}. The smallest N is ${n(N)}. At ${n(B)} readings a block, ${n(N)} ÷ ${n(B)} = ${n(N / B)}, and rounding up to whole blocks gives ${n(blocks)}.`,
  guidance: [
   { prompt: `One millivolt is 0.001 volt. What is a tolerance of ${n(t)} millivolts in volts?`, answer: [eps], explanation: `${n(t)} × 0.001 = ${n(eps)} volts.` },
   { prompt: `The gaps stay below ${n(k)} ÷ N and come as close to it as we like, so N works exactly when ${n(k)} ÷ N ≤ ${n(eps)}. What is the smallest whole number N?`, answer: [N], explanation: `N ≥ ${n(k)} ÷ ${n(eps)} = ${n(N)}.` },
   { prompt: `Blocks hold ${n(B)} readings each. How many blocks are needed to reach reading number ${n(N)}, counting a partly filled block as one?`, answer: [blocks], explanation: `${n(N)} ÷ ${n(B)} = ${n(N / B)}, and rounding up to whole blocks gives ${n(blocks)}.` }
  ] }; }
});
}

{
/* yₙ = c + k ÷ (n + d) has limit c. Limit test: k ÷ (n + d) < ε₁ exactly when n + d > K₁ = k ÷ ε₁, so N = K₁ − d + 1. Cauchy test: gaps stay below
   k ÷ (N + d) and approach it, so N works exactly when k ÷ (N + d) ≤ ε₂ and N = K₂ − d. Both K are whole numbers for these ε. */
const CAN = { c: 5, k: 6, d: 3, e1: 0.05, e2: 0.04, U: 5, V: 25 };
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q07', title: 'Two ways to certify a repeater',
 brief: 'Mira wants the same repeater certified twice, once against its known limit and once by its own gaps, to see how the two certificates differ.',
 labels: ['gap', 'N for the limit test', 'N for the Cauchy test'], tolerance: 0.0005,
 gl: [['gap'], ['N (limit test)'], ['N (Cauchy test)']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ c: R.int(1, 9), k: R.int(2, 9), d: R.int(1, 4), e1: R.pick([0.1, 0.05, 0.04, 0.025, 0.02, 0.01, 0.005]), e2: R.pick([0.1, 0.05, 0.04, 0.025, 0.02, 0.01, 0.005]), U: R.pick([4, 5, 8, 10]), V: R.pick([20, 25, 40, 50]) }), p => p.e1 !== p.e2, CAN),
 build: ({ c, k, d, e1, e2, U, V }) => { const u = U - d, v = V - d, gap = G.tidy(k * (1 / U - 1 / V)), K1 = Math.round(k / e1), K2 = Math.round(k / e2), N1 = K1 - d + 1, N2 = K2 - d, yu = G.tidy(c + k / U), yv = G.tidy(c + k / V); return {
  prompt: `A relay logs yₙ = ${n(c)} + ${n(k)} ÷ (n + ${n(d)}), for n = 1, 2, 3, …, and the sequence tends to ${n(c)}. Enter the gap |y${sub(u)} − y${sub(v)}|. Then enter the smallest N such that |yₙ − ${n(c)}| < ${n(e1)} for every n ≥ N (the test against the limit). Then enter the smallest N such that |yₘ − yₙ| < ${n(e2)} for all m, n ≥ N (the Cauchy test, which does not use the limit).${wc([gap, N1, N2])}`,
  answer: [gap, N1, N2],
  hints: ['In the test against the limit, the distance is the fraction itself, and it must be below the tolerance for every n from N on.', 'In the Cauchy test, for m and n both at least N the gaps stay below the fraction’s value at N and come as close to it as we like, so that value must be at most the tolerance. The two tests use different tolerances here.'],
  solution: `y${sub(u)} = ${n(c)} + ${n(k)} ÷ ${n(U)} = ${n(yu)} and y${sub(v)} = ${n(c)} + ${n(k)} ÷ ${n(V)} = ${n(yv)}, so the gap is ${n(gap)}. Test against the limit: |yₙ − ${n(c)}| = ${n(k)} ÷ (n + ${n(d)}), which is below ${n(e1)} exactly when n + ${n(d)} > ${n(k)} ÷ ${n(e1)} = ${n(K1)}, that is n > ${n(K1 - d)}, so N = ${n(N1)}. Cauchy test: the gaps stay below ${n(k)} ÷ (N + ${n(d)}) and come as close to it as we like, so N works exactly when ${n(k)} ÷ (N + ${n(d)}) ≤ ${n(e2)}, that is N + ${n(d)} ≥ ${n(k)} ÷ ${n(e2)} = ${n(K2)}, so N = ${n(N2)}.`,
  guidance: [
   { prompt: `Work out y${sub(u)} and y${sub(v)} from yₙ = ${n(c)} + ${n(k)} ÷ (n + ${n(d)}). What is the gap |y${sub(u)} − y${sub(v)}|?`, answer: [gap], explanation: `y${sub(u)} = ${n(yu)} and y${sub(v)} = ${n(yv)}, so the gap is ${n(gap)}.` },
   { prompt: `|yₙ − ${n(c)}| = ${n(k)} ÷ (n + ${n(d)}) must be below ${n(e1)}, so n + ${n(d)} > ${n(k)} ÷ ${n(e1)}. What is the smallest whole number N for the test against the limit?`, answer: [N1], explanation: `${n(k)} ÷ ${n(e1)} = ${n(K1)}, so n + ${n(d)} > ${n(K1)}, that is n > ${n(K1 - d)}. The smallest whole number is ${n(N1)}.` },
   { prompt: `For the Cauchy test, N works exactly when ${n(k)} ÷ (N + ${n(d)}) ≤ ${n(e2)}. What is the smallest whole number N?`, answer: [N2], explanation: `N + ${n(d)} ≥ ${n(k)} ÷ ${n(e2)} = ${n(K2)}, so N = ${n(N2)}.` }
  ] }; }
});
}

/* ---- q13 Series as limits of partial sums; the tail [2.5] ---- */

{
/* Alternating geometric series: first term a = qᴺ⁻¹(q + 1)m and ratio −1 ÷ q, so the sum is a ÷ (1 + 1 ÷ q) = qᴺm and the tail after N terms is
   (−1)ᴺm. N is 3 or 4, so the first three terms a, −a ÷ q, a ÷ q² are whole numbers. Not the parent's worked example (18, 6, 2, …). */
const CAN = { q: 3, N: 3, m: 2 };
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The feedback loop that flips',
 brief: 'A relay feedback loop reverses and shrinks each correction, and Mira asks how much it has applied so far and how much is still to come.',
 labels: ['partial sum', 'tail'], tolerance: 0.01,
 gl: [['partial sum'], ['sum of the series'], ['tail']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ q: R.pick([2, 3, 4]), N: R.pick([3, 4]), m: R.int(1, 9) }), p => Math.pow(p.q, p.N - 1) * (p.q + 1) * p.m < 3000, CAN),
 build: ({ q, N, m }) => { const a = Math.pow(q, N - 1) * (q + 1) * m, S = Math.pow(q, N) * m, terms = []; for (let i = 0; i < N; i++) terms.push((i % 2 ? -1 : 1) * a / Math.pow(q, i));
  const sN = terms.reduce((s, t) => s + t, 0), tail = (N % 2 ? -1 : 1) * m, NN = sub(N), next = ord(N + 1); return {
  prompt: `A relay’s feedback loop reverses and shrinks every correction: the corrections are ${n(terms[0])}, ${n(terms[1])}, ${n(terms[2])}, …, and each one is the previous one multiplied by −1 ÷ ${n(q)}, so the signs alternate. The total correction is the sum of this series. Enter the partial sum s${NN}, the sum of the first ${n(N)} corrections, then the tail after ${n(N)} corrections: the sum of all the corrections from the ${next} on (it is negative if those remaining corrections pull the total down).${wc([sN, tail])}`,
  answer: [sN, tail],
  hints: ['A geometric series with first term a and ratio r between −1 and 1 sums to a ÷ (1 − r), also when r is negative. The sum of the whole series is the limit of its partial sums.', 'Add the first few terms with their signs for the partial sum. The tail is the whole sum minus the partial sum, and it can be negative.'],
  solution: `The first ${n(N)} terms are ${terms.map(n).join(', ')}, so s${NN} = ${signed(terms)} = ${n(sN)}. The series is geometric with first term ${n(a)} and ratio −1 ÷ ${n(q)}, so its sum is ${n(a)} ÷ (1 + 1 ÷ ${n(q)}) = ${n(a)} × ${n(q)} ÷ ${n(q + 1)} = ${n(S)}. The tail after ${n(N)} terms is the sum minus the partial sum: ${n(S)} − ${par(sN)} = ${n(tail)}.`,
  guidance: [
   { prompt: `Add the first ${n(N)} corrections, ${terms.map(n).join(', ')}, with their signs. What is s${NN}?`, answer: [sN], explanation: `${signed(terms)} = ${n(sN)}.` },
   { prompt: `The series is geometric with first term ${n(a)} and ratio −1 ÷ ${n(q)}. What is its sum, ${n(a)} ÷ (1 − (−1 ÷ ${n(q)}))?`, answer: [S], explanation: `1 − (−1 ÷ ${n(q)}) = ${n(q + 1)} ÷ ${n(q)}, so the sum is ${n(a)} × ${n(q)} ÷ ${n(q + 1)} = ${n(S)}.` },
   { prompt: `The tail is everything after the first ${n(N)} terms. What is the sum ${n(S)} minus the partial sum ${par(sN)}?`, answer: [tail], explanation: `${n(S)} − ${par(sN)} = ${n(tail)}. The partial sums close in on ${n(S)}, and the tail is the part still missing.` }
  ] }; }
});
}

{
/* Telescoping with an offset: the n-th term is k ÷ ((n + d)(n + d + 1)) = k ÷ (n + d) − k ÷ (n + d + 1), so s_N = k ÷ (d + 1) − k ÷ (N + d + 1), the sum is
   k ÷ (d + 1) = m (k = (d + 1)m) and the tail after N terms is k ÷ (N + d + 1). The tail is below ε exactly when N + d + 1 > K = k ÷ ε, so N = K − d. */
const CAN = { d: 2, m: 4, e: 0.02 };
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'How long must the relay log',
 brief: 'The relay may stop logging once everything still to come is negligible, and Mira needs the total and the stopping point.',
 labels: ['total (millivolts)', 'smallest N'], tolerance: 0.01,
 gl: [['sum of the series'], ['N + d + 1 must exceed'], ['N']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ d: R.int(1, 4), m: R.int(1, 6), e: R.pick([0.5, 0.25, 0.2, 0.1, 0.05, 0.04, 0.02]) }), p => true, CAN),
 build: ({ d, m, e }) => { const k = (d + 1) * m, K = Math.round(k / e), N = K - d; return {
  prompt: `A relay applies corrections without end: the n-th correction is ${n(k)} ÷ ((n + ${n(d)})(n + ${n(d + 1)})) millivolts, for n = 1, 2, 3, …. Use the fact that 1 ÷ ((n + ${n(d)})(n + ${n(d + 1)})) = 1 ÷ (n + ${n(d)}) − 1 ÷ (n + ${n(d + 1)}). Enter the total of all the corrections, the sum of the series. Then enter the smallest number N of corrections such that everything still to come after them, the tail, is below ${n(e)} millivolts.${wc([m, N])}`,
  answer: [m, N],
  hints: ['Split each term as a difference of two fractions. In a partial sum almost every piece cancels, leaving the first piece and one last piece, which shrinks to 0.', 'The tail after N terms is the whole sum minus the partial sum, so it equals the last leftover piece. Solve that piece < tolerance for N.'],
  solution: `Each term is ${n(k)} ÷ (n + ${n(d)}) − ${n(k)} ÷ (n + ${n(d + 1)}). Adding the first N terms, every piece cancels except the first and the last: the partial sum is ${n(k)} ÷ ${n(d + 1)} − ${n(k)} ÷ (N + ${n(d + 1)}) = ${n(m)} − ${n(k)} ÷ (N + ${n(d + 1)}). The last piece shrinks to 0, so the sum is ${n(m)}, and the tail after N terms is ${n(k)} ÷ (N + ${n(d + 1)}). This is below ${n(e)} exactly when N + ${n(d + 1)} > ${n(k)} ÷ ${n(e)} = ${n(K)}, so N + ${n(d + 1)} ≥ ${n(K + 1)} and the smallest N is ${n(K + 1)} − ${n(d + 1)} = ${n(N)}.`,
  guidance: [
   { prompt: `Each term is ${n(k)} ÷ (n + ${n(d)}) − ${n(k)} ÷ (n + ${n(d + 1)}), so the partial sums are ${n(k)} ÷ ${n(d + 1)} − ${n(k)} ÷ (N + ${n(d + 1)}). What number do they tend to as N grows?`, answer: [m], explanation: `${n(k)} ÷ (N + ${n(d + 1)}) shrinks to 0, so the partial sums tend to ${n(k)} ÷ ${n(d + 1)} = ${n(m)}: that is the sum of the series.` },
   { prompt: `The tail after N terms is ${n(k)} ÷ (N + ${n(d + 1)}). For it to be below ${n(e)}, N + ${n(d + 1)} must be larger than which number?`, answer: [K], explanation: `${n(k)} ÷ (N + ${n(d + 1)}) < ${n(e)} exactly when N + ${n(d + 1)} > ${n(k)} ÷ ${n(e)} = ${n(K)}.` },
   { prompt: `So N + ${n(d + 1)} > ${n(K)}. What is the smallest whole number N?`, answer: [N], explanation: `N + ${n(d + 1)} must be at least ${n(K + 1)}, so N = ${n(K + 1)} − ${n(d + 1)} = ${n(N)}.` }
  ] }; }
});
}

{
/* Positive geometric series a = (q − 1)qᴶ⁻¹m, ratio 1 ÷ q: the sum is qᴶm and the tail after N terms is qᴶ⁻ᴺm. For positive terms the gaps |sₘ − sₙ| with m, n ≥ N
   stay below the tail after N terms and come as close to it as we like, so N works exactly when that tail is at most ε. The smallest such N is Ns, built
   so that tail(Ns) = t = qˣm < ε < q·t = tail(Ns − 1). J = Ns + x ≥ 3 keeps a, a ÷ q, a ÷ q² whole. */
const CAN = { q: 2, m: 1, Ns: 3, x: 1, ex: 1 };
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q12', title: 'A certificate for the running total',
 brief: 'Mira wants the running total of the relay’s corrections certified as a Cauchy sequence, so that no one needs to know the final total in advance.',
 labels: ['sum of the series', 'smallest N', 'partial sum at that N'], tolerance: 0.01,
 gl: [['sum of the series'], ['N'], ['partial sum']]
}, {
 canonical: CAN,
 draw: R => tries(() => { const q = R.pick([2, 3, 4]), m = R.int(1, q === 4 ? 3 : 4), Ns = R.int(2, 4), x = R.int(1, 2), t = m * Math.pow(q, x); return { q, m, Ns, x, ex: R.int(1, (q - 1) * t - 1) }; },
  p => Math.pow(p.q, p.Ns + p.x) * p.m < 20000, CAN),
 build: ({ q, m, Ns, x, ex }) => { const J = Ns + x, a = (q - 1) * m * Math.pow(q, J - 1), S = m * Math.pow(q, J), t = m * Math.pow(q, x), eps = t + ex, sN = S - t, NN = sub(Ns),
  tails = []; for (let i = 1; i <= Ns; i++) tails.push(m * Math.pow(q, J - i)); return {
  prompt: `A relay applies corrections that are all positive: ${n(a)}, ${n(a / q)}, ${n(a / (q * q))}, …, each one the previous one divided by ${n(q)}. The partial sums s₁, s₂, s₃, … form a sequence. Enter the sum of the series. Then enter the smallest N such that |sₘ − sₙ| < ${n(eps)} for all m, n ≥ N (the Cauchy test, applied to the partial sums). Then enter the sum of the first N terms, for that N.${wc([S, Ns, sN])}`,
  answer: [S, Ns, sN],
  hints: ['A geometric series with first term a and ratio 1 ÷ q has sum a ÷ (1 − 1 ÷ q). With positive terms, |sₘ − sₙ| for m > n is the sum of the terms from the (n + 1)th to the mth.', 'For m, n ≥ N these gaps stay below the tail after N terms and come as close to it as we like, so N works exactly when that tail (the sum minus the sum of the first N terms) is at most the tolerance. Try N = 1, 2, 3, … until it is.'],
  solution: `The series is geometric with first term ${n(a)} and ratio 1 ÷ ${n(q)}, so its sum is ${n(a)} ÷ (1 − 1 ÷ ${n(q)}) = ${n(a)} × ${n(q)} ÷ ${n(q - 1)} = ${n(S)}. All terms are positive, so for m > n ≥ N the gap sₘ − sₙ is less than the tail after N terms and comes as close to it as we like. So N works exactly when the tail after N terms is at most ${n(eps)}. The tails after 1, 2, 3, … terms are ${tails.map(n).join(', ')}, …; the first one at most ${n(eps)} is the tail after ${n(Ns)} terms, ${n(t)}, so N = ${n(Ns)}. The partial sum is s${NN} = ${n(S)} − ${n(t)} = ${n(sN)}.`,
  guidance: [
   { prompt: `The series is geometric with first term ${n(a)} and ratio 1 ÷ ${n(q)}. What is its sum, ${n(a)} ÷ (1 − 1 ÷ ${n(q)})?`, answer: [S], explanation: `1 − 1 ÷ ${n(q)} = ${n(q - 1)} ÷ ${n(q)}, so the sum is ${n(a)} × ${n(q)} ÷ ${n(q - 1)} = ${n(S)}.` },
   { prompt: `Because all terms are positive, N works exactly when the tail after N terms (the sum ${n(S)} minus the sum of the first N terms) is at most ${n(eps)}. Try N = 1, 2, 3, … What is the smallest N that works?`, answer: [Ns], explanation: `The tails after 1, 2, 3, … terms are ${tails.map(n).join(', ')}, …. The first that is at most ${n(eps)} is the one after ${n(Ns)} terms, ${n(t)}, and the one before it, ${n(q * t)}, is too big.` },
   { prompt: `The tail after ${n(Ns)} terms is ${n(t)}. What is the partial sum s${NN}, the sum ${n(S)} minus that tail?`, answer: [sN], explanation: `${n(S)} − ${n(t)} = ${n(sN)}.` }
  ] }; }
});
}

/* ---- q14 Absolute and conditional convergence [2.5] ---- */

/* (p, N, c-unit, most multiples): c is a multiple of the least common multiple of iᵖ for i ≤ N, so every term and partial sum is a whole number.
   p = 1 converges only conditionally (code 0); p = 2 or 3 converges absolutely (code 1). */
const FORMS = [[1, 3, 6, 12], [1, 4, 12, 8], [1, 5, 60, 3], [1, 6, 60, 3], [2, 3, 36, 6], [2, 4, 144, 2], [3, 3, 216, 2], [2, 2, 4, 12]];
const drawForm = R => { const f = R.pick(FORMS); return { p: f[0], N: f[1], c: f[2] * R.int(1, f[3]) }; };

{
/* aₙ = (−1)ⁿ c ÷ nᵖ starts negative. Not the parent's worked example (12 ÷ n, 4 terms, starting positive). */
const CAN = { p: 2, N: 4, c: 144 };
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The loop that starts low',
 brief: 'A relay loop begins with a negative correction and alternates from there, and Mira must say whether it settles for good reason or only by cancellation.',
 labels: ['1 absolute, 0 conditional', 'partial sum'], tolerance: 0.01,
 gl: [['p'], ['1 or 0'], ['partial sum']]
}, {
 canonical: CAN,
 draw: R => drawForm(R),
 build: ({ p, N, c }) => { const terms = []; for (let i = 1; i <= N; i++) terms.push((i % 2 ? -1 : 1) * c / Math.pow(i, p)); const sN = terms.reduce((s, t) => s + t, 0), code = p > 1 ? 1 : 0, NN = sub(N), pw = POW[p]; return {
  prompt: `A relay’s feedback loop starts with a negative correction and then alternates: aₙ = (−1)ⁿ × ${n(c)} ÷ n${pw} millivolts, for n = 1, 2, 3, …. You may take it that the series Σ aₙ converges. Enter 1 if it converges absolutely, or 0 if it converges only conditionally. Then enter the partial sum s${NN} of the first ${n(N)} terms.${wc([code, sN])}`,
  answer: [code, sN],
  hints: ['Absolute convergence asks about the series of sizes, Σ |aₙ|, with every sign made positive. That is a p-series times a constant.', 'A p-series Σ 1 ÷ nᵖ converges when p > 1 and diverges when p ≤ 1. For the partial sum, add the first terms with their signs, starting with a negative one.'],
  solution: `The sizes are |aₙ| = ${n(c)} ÷ n${pw}, ${n(c)} times the p-series with p = ${n(p)}. ${p > 1 ? `Because ${n(p)} > 1, Σ |aₙ| converges, so the series converges absolutely: 1.` : `Because p = 1 is not more than 1, Σ |aₙ| is a multiple of the harmonic series and diverges. The series itself converges, so it converges only conditionally: 0.`} The first ${n(N)} terms are ${terms.map(n).join(', ')}, so s${NN} = ${signed(terms)} = ${n(sN)}.`,
  guidance: [
   { prompt: `Make every sign positive: |aₙ| = ${n(c)} ÷ n${pw}. Which power p of n is this, up to the constant ${n(c)}?`, answer: [p], explanation: `${n(c)} ÷ n${pw} is ${n(c)} × 1 ÷ n${pw}, a p-series with p = ${n(p)}.` },
   { prompt: `A p-series converges exactly when p > 1. Enter 1 if Σ aₙ converges absolutely, 0 if only conditionally.`, answer: [code], explanation: p > 1 ? `p = ${n(p)} > 1, so the sizes add up to a finite total: absolute convergence, 1.` : `p = 1, so the sizes form a multiple of the harmonic series, which diverges. The signed series does converge, so only conditionally: 0.` },
   { prompt: `The first ${n(N)} terms, starting with a negative one, are ${terms.map(n).join(', ')}. What is their sum s${NN}?`, answer: [sN], explanation: `${signed(terms)} = ${n(sN)}.` }
  ] }; }
});
}

{
/* Needle moves aₙ = (−1)ⁿ⁺¹ c ÷ nᵖ: net movement s_N (signed sum) and total travel t_N = Σ |aₙ| (sum of sizes). */
const CAN = { p: 1, N: 5, c: 60 };
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Net movement and total travel',
 brief: 'A dial needle is nudged right and left by shrinking corrections, and the audit logs both where it ends up and how far it travelled.',
 labels: ['1 absolute, 0 conditional', 'net movement (degrees)', 'total travel (degrees)'], tolerance: 0.01,
 gl: [['1 or 0'], ['net movement (degrees)'], ['total travel (degrees)']]
}, {
 canonical: CAN,
 draw: R => drawForm(R),
 build: ({ p, N, c }) => { const terms = [], sizes = []; for (let i = 1; i <= N; i++) { terms.push((i % 2 ? 1 : -1) * c / Math.pow(i, p)); sizes.push(c / Math.pow(i, p)); }
  const sN = terms.reduce((s, t) => s + t, 0), tN = sizes.reduce((s, t) => s + t, 0), code = p > 1 ? 1 : 0, NN = sub(N), pw = POW[p]; return {
  prompt: `A dial’s needle is moved by corrections aₙ = (−1)ⁿ⁺¹ × ${n(c)} ÷ n${pw} degrees, for n = 1, 2, 3, …, to the right when the correction is positive and to the left when it is negative. You may take it that the series Σ aₙ converges. Enter 1 if it converges absolutely, or 0 if it converges only conditionally. Then enter the net movement after the first ${n(N)} corrections (the signed sum, to the right counted positive). Then enter the total travel over the same corrections (the sum of their sizes, ignoring direction).${wc([code, sN, tN])}`,
  answer: [code, sN, tN],
  hints: ['Absolute convergence asks about the series of sizes, Σ |aₙ|. That is a p-series times a constant, and a p-series Σ 1 ÷ nᵖ converges when p > 1 and diverges when p ≤ 1.', 'Net movement adds the corrections with their signs. Total travel adds their sizes, all counted positive, so it can never be smaller than the size of the net movement.'],
  solution: `The sizes are ${n(c)} ÷ n${pw}, ${n(c)} times the p-series with p = ${n(p)}. ${p > 1 ? `Because ${n(p)} > 1, the sizes add up to a finite total, so the series converges absolutely: 1.` : `Because p = 1 is not more than 1, the sizes form a multiple of the harmonic series and diverge, while the signed series still converges: only conditionally, 0.`} The first ${n(N)} corrections are ${terms.map(n).join(', ')}, so the net movement is ${signed(terms)} = ${n(sN)} degrees. The total travel is the sum of the sizes, ${signed(sizes)} = ${n(tN)} degrees.`,
  guidance: [
   { prompt: `The sizes are |aₙ| = ${n(c)} ÷ n${pw}, ${n(c)} times a p-series with p = ${n(p)}. A p-series converges exactly when p > 1. Enter 1 if Σ aₙ converges absolutely, 0 if only conditionally.`, answer: [code], explanation: p > 1 ? `p = ${n(p)} > 1, so the sizes add up to a finite total: absolute convergence, 1.` : `p = 1, so the sizes form a multiple of the harmonic series, which diverges. The signed series does converge, so only conditionally: 0.` },
   { prompt: `The first ${n(N)} corrections are ${terms.map(n).join(', ')}. What is the net movement, their signed sum?`, answer: [sN], explanation: `${signed(terms)} = ${n(sN)} degrees.` },
   { prompt: `The sizes of those corrections are ${sizes.map(n).join(', ')}. What is the total travel, their sum?`, answer: [tN], explanation: `${signed(sizes)} = ${n(tN)} degrees.` }
  ] }; }
});
}

{
/* Two channels A: (−1)ⁿ⁺¹ cA ÷ nᵖ and B: (−1)ⁿ cB ÷ nᵠ, three terms. c is a multiple of 6ᵖ (the least common multiple of 2ᵖ and 3ᵖ) so every term is whole.
   The combined channel's partial sum is the sum of the two partial sums. */
const UNIT = [0, 6, 36, 216];
const CAN = { pA: 1, mA: 5, pB: 2, mB: 1 };
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13', title: 'Two channels, one dial',
 brief: 'Two relay channels drive the same dial, and Mira needs each one classified and the combined drift after three steps.',
 labels: ['channel A: 1 absolute, 0 conditional', 'channel B: 1 absolute, 0 conditional', 'combined partial sum'], tolerance: 0.01,
 gl: [['A: 1 or 0'], ['B: 1 or 0'], ['combined partial sum']]
}, {
 canonical: CAN,
 draw: R => tries(() => ({ pA: R.int(1, 3), mA: R.int(1, 5), pB: R.int(1, 3), mB: R.int(1, 5) }), p => !(p.pA === p.pB && p.mA === p.mB), CAN),
 build: ({ pA, mA, pB, mB }) => { const cA = UNIT[pA] * mA, cB = UNIT[pB] * mB, ta = [], tb = [], tc = [];
  for (let i = 1; i <= 3; i++) { ta.push((i % 2 ? 1 : -1) * cA / Math.pow(i, pA)); tb.push((i % 2 ? -1 : 1) * cB / Math.pow(i, pB)); tc.push(ta[i - 1] + tb[i - 1]); }
  const sA = ta.reduce((s, t) => s + t, 0), sB = tb.reduce((s, t) => s + t, 0), sC = sA + sB, codeA = pA > 1 ? 1 : 0, codeB = pB > 1 ? 1 : 0; return {
  prompt: `Two relay channels drive the same dial. Channel A moves it by aₙ = (−1)ⁿ⁺¹ × ${n(cA)} ÷ n${POW[pA]} degrees and channel B by bₙ = (−1)ⁿ × ${n(cB)} ÷ n${POW[pB]} degrees, for n = 1, 2, 3, …. You may take it that both series converge. For channel A enter 1 if its series converges absolutely, or 0 if only conditionally; then the same for channel B. Then enter the partial sum of the first 3 terms of the combined channel, whose n-th term is aₙ + bₙ.${wc([codeA, codeB, sC])}`,
  answer: [codeA, codeB, sC],
  hints: ['For each channel, make every sign positive: the sizes are a constant times a p-series Σ 1 ÷ nᵖ, which converges when p > 1 and diverges when p ≤ 1.', 'The combined channel’s partial sum is the sum of the two channels’ partial sums, because adding terms in pairs does not change the total. Find each channel’s first three terms with their signs.'],
  solution: `Channel A has sizes ${n(cA)} ÷ n${POW[pA]}, a p-series with p = ${n(pA)}: ${pA > 1 ? 'it converges, so the series converges absolutely: 1.' : 'the sizes diverge, so only conditional convergence: 0.'} Channel B has sizes ${n(cB)} ÷ n${POW[pB]}, a p-series with p = ${n(pB)}: ${pB > 1 ? 'it converges, so the series converges absolutely: 1.' : 'the sizes diverge, so only conditional convergence: 0.'} The first 3 terms of A are ${ta.map(n).join(', ')}, with sum ${n(sA)}. The first 3 terms of B are ${tb.map(n).join(', ')}, with sum ${n(sB)}. The combined partial sum is ${n(sA)} + ${par(sB)} = ${n(sC)}.`,
  guidance: [
   { prompt: `Channel A has sizes ${n(cA)} ÷ n${POW[pA]}, a p-series with p = ${n(pA)}. A p-series converges exactly when p > 1. Enter 1 if channel A converges absolutely, 0 if only conditionally.`, answer: [codeA], explanation: pA > 1 ? `p = ${n(pA)} > 1, so the sizes add up to a finite total: 1.` : `p = 1, so the sizes form a multiple of the harmonic series, which diverges: only conditional, 0.` },
   { prompt: `Channel B has sizes ${n(cB)} ÷ n${POW[pB]}, a p-series with p = ${n(pB)}. Enter 1 if channel B converges absolutely, 0 if only conditionally.`, answer: [codeB], explanation: pB > 1 ? `p = ${n(pB)} > 1, so the sizes add up to a finite total: 1.` : `p = 1, so the sizes form a multiple of the harmonic series, which diverges: only conditional, 0.` },
   { prompt: `The first 3 terms of the combined channel are ${tc.map(n).join(', ')} (each is aₙ + bₙ). What is their sum?`, answer: [sC], explanation: `${signed(tc)} = ${n(sC)}. This equals the partial sum ${n(sA)} of A plus the partial sum ${par(sB)} of B.` }
  ] }; }
});
}

/* ---- q15 Comparison and p-series bounds [2.5] ---- */

{
/* aₙ = k ÷ (n qⁿ) ≤ bₙ = k ÷ qⁿ. Σ bₙ = k ÷ (q − 1); b₃ + b₄ + … = k ÷ (q²(q − 1)); a₁ = k ÷ q; a₂ = k ÷ (2q²). k is a multiple of 2q²(q − 1), so every
   number is whole. Not the parent's worked example (6 ÷ (2ⁿ + 1)). */
const CAN = { q: 3, m: 2 };
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The slowly fading echoes',
 brief: 'Echo pulses fade a little faster than a plain geometric series, and Mira wants the total bounded, first roughly and then with the two loudest pulses kept exact.',
 labels: ['comparison bound', 'sharper bound'], tolerance: 0.01,
 gl: [['comparison bound'], ['a₁ + a₂'], ['b₃ + b₄ + …']]
}, {
 canonical: CAN,
 draw: R => { const q = R.pick([2, 3, 4, 5]), cap = { 2: 15, 3: 10, 4: 6, 5: 4 }[q]; return { q, m: R.int(1, cap) }; },
 build: ({ q, m }) => { const k = 2 * q * q * (q - 1) * m, B = k / (q - 1), a1 = k / q, a2 = k / (2 * q * q), rest = k / (q * q * (q - 1)), S2 = a1 + a2 + rest; return {
  prompt: `A relay’s n-th echo correction is aₙ = ${n(k)} ÷ (n × ${n(q)}ⁿ), for n = 1, 2, 3, …. Compare each term with bₙ = ${n(k)} ÷ ${n(q)}ⁿ. Enter the upper bound on Σ aₙ given by the whole comparison series Σ bₙ. Then enter the sharper upper bound a₁ + a₂ + (b₃ + b₄ + b₅ + …), which keeps the first two terms exact.${wc([B, S2])}`,
  answer: [B, S2],
  hints: ['If 0 ≤ aₙ ≤ bₙ for every n and Σ bₙ converges, then Σ aₙ converges and its sum is at most Σ bₙ. Dividing by n ≥ 1 never makes a term bigger.', 'The comparison series is geometric: first term divided by 1 minus ratio. For b₃ + b₄ + …, use the same rule with the first term b₃. Then add the exact a₁ and a₂.'],
  solution: `Since n ≥ 1, ${n(k)} ÷ (n × ${n(q)}ⁿ) ≤ ${n(k)} ÷ ${n(q)}ⁿ, so every aₙ is at most bₙ. Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} = ${n(k / q)} and ratio 1 ÷ ${n(q)}, so it sums to ${n(k / q)} ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(B)}. So Σ aₙ ≤ ${n(B)}. For the sharper bound, a₁ = ${n(k)} ÷ ${n(q)} = ${n(a1)} and a₂ = ${n(k)} ÷ (2 × ${n(q * q)}) = ${n(a2)}. The rest b₃ + b₄ + … is geometric with first term ${n(k)} ÷ ${n(q ** 3)} and ratio 1 ÷ ${n(q)}, so it sums to ${n(rest)}. So Σ aₙ ≤ ${n(a1)} + ${n(a2)} + ${n(rest)} = ${n(S2)}.`,
  guidance: [
   { prompt: `Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} and ratio 1 ÷ ${n(q)}. What is its sum?`, answer: [B], explanation: `(${n(k)} ÷ ${n(q)}) ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(B)}. Every aₙ is at most bₙ, so Σ aₙ ≤ ${n(B)}.` },
   { prompt: `Keep two terms exact: a₁ = ${n(k)} ÷ (1 × ${n(q)}) and a₂ = ${n(k)} ÷ (2 × ${n(q * q)}). What is a₁ + a₂?`, answer: [a1 + a2], explanation: `a₁ = ${n(a1)} and a₂ = ${n(a2)}, so a₁ + a₂ = ${n(a1 + a2)}.` },
   { prompt: `Compare only the rest: b₃ + b₄ + … is geometric with first term b₃ = ${n(k)} ÷ ${n(q ** 3)} and ratio 1 ÷ ${n(q)}. What is its sum?`, answer: [rest], explanation: `(${n(k / q ** 3)}) ÷ (1 − 1 ÷ ${n(q)}) = ${n(rest)}. The sharper bound is ${n(a1 + a2)} + ${n(rest)} = ${n(S2)}.` }
  ] }; }
});
}

{
/* Loop A: k₁ ÷ (qⁿ + c₁) ≤ k₁ ÷ qⁿ with k₁ = (q − 1)m₁, bound m₁. Loop B: k₂ ÷ (n² + c₂n) ≤ k₂ ÷ (n(n + 1)), bound k₂. Margin = T − (m₁ + k₂), possibly negative. */
const CAN = { q: 4, c1: 2, m1: 7, k2: 15, c2: 3, T: 30 };
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Two loops and an allowance',
 brief: 'Two feedback loops share one correction allowance, and Mira will sign only if the comparison bounds show the combined total cannot exceed it.',
 labels: ['bound for loop A (millivolts)', 'bound for loop B (millivolts)', 'allowance minus bounds (millivolts)'], tolerance: 0.01,
 gl: [['bound for loop A'], ['bound for loop B'], ['allowance minus bounds']]
}, {
 canonical: CAN,
 draw: R => tries(() => { const m1 = R.int(2, 20), k2 = R.int(3, 40), total = m1 + k2; return { q: R.int(2, 5), c1: R.int(1, 5), m1, k2, c2: R.int(2, 5), T: Math.max(5, total + R.int(-8, 15)) }; }, p => true, CAN),
 build: ({ q, c1, m1, k2, c2, T }) => { const k1 = (q - 1) * m1, total = m1 + k2, margin = T - total; return {
  prompt: `Two feedback loops feed one relay, and the total correction is the sum of both series. Loop A applies aₙ = ${n(k1)} ÷ (${n(q)}ⁿ + ${n(c1)}) millivolts at step n, and loop B applies a′ₙ = ${n(k2)} ÷ (n² + ${co(c2)}n) millivolts, for n = 1, 2, 3, …. Compare loop A with bₙ = ${n(k1)} ÷ ${n(q)}ⁿ and loop B with b′ₙ = ${n(k2)} ÷ (n(n + 1)). Enter the upper bound for Σ aₙ given by Σ bₙ, then the upper bound for Σ a′ₙ given by Σ b′ₙ. Then enter the allowance of ${n(T)} millivolts minus the sum of those two bounds (a negative number means the bounds alone do not show that the total fits in the allowance).${wc([m1, k2, margin])}`,
  answer: [m1, k2, margin],
  hints: ['If 0 ≤ aₙ ≤ bₙ for every n and Σ bₙ converges, then Σ aₙ ≤ Σ bₙ. Loop A is compared with a geometric series, loop B with a series that telescopes.', 'A geometric series sums to its first term divided by 1 minus its ratio. For k ÷ (n(n + 1)) = k ÷ n − k ÷ (n + 1), the partial sums are k − k ÷ (N + 1), which tend to k. The total is bounded by the sum of the two bounds.'],
  solution: `Loop A: ${n(q)}ⁿ + ${n(c1)} > ${n(q)}ⁿ, so aₙ < bₙ. Σ bₙ is geometric with first term ${n(k1)} ÷ ${n(q)} and ratio 1 ÷ ${n(q)}, so it sums to ${n(k1)} ÷ ${n(q - 1)} = ${n(m1)}. Loop B: n² + ${co(c2)}n ≥ n² + n, so a′ₙ ≤ b′ₙ. Σ b′ₙ telescopes: its partial sums are ${n(k2)} − ${n(k2)} ÷ (N + 1), which tend to ${n(k2)}. So the total is at most ${n(m1)} + ${n(k2)} = ${n(total)}, and the allowance minus this bound is ${n(T)} − ${n(total)} = ${n(margin)}.`,
  guidance: [
   { prompt: `Σ bₙ is geometric with first term ${n(k1)} ÷ ${n(q)} and ratio 1 ÷ ${n(q)}. What is its sum, the bound for loop A?`, answer: [m1], explanation: `(${n(k1)} ÷ ${n(q)}) ÷ (1 − 1 ÷ ${n(q)}) = ${n(k1)} ÷ ${n(q - 1)} = ${n(m1)}.` },
   { prompt: `b′ₙ = ${n(k2)} ÷ (n(n + 1)) = ${n(k2)} ÷ n − ${n(k2)} ÷ (n + 1) has partial sums ${n(k2)} − ${n(k2)} ÷ (N + 1). What number do they tend to, the bound for loop B?`, answer: [k2], explanation: `${n(k2)} ÷ (N + 1) shrinks to 0, so Σ b′ₙ = ${n(k2)}.` },
   { prompt: `The two bounds are ${n(m1)} and ${n(k2)}. What is the allowance ${n(T)} minus their sum?`, answer: [margin], explanation: `${n(m1)} + ${n(k2)} = ${n(total)}, and ${n(T)} − ${n(total)} = ${n(margin)}.` }
  ] }; }
});
}

{
/* aₙ = k ÷ (qⁿ + cn) ≤ bₙ = k ÷ qⁿ, k = (q − 1)qᴶm. Σ bₙ = qᴶm; the tail of Σ bₙ after N terms is k ÷ (qᴺ(q − 1)) = qᴶ⁻ᴺm (N ≤ J). Ns is the smallest N with
   tail < ε: J = Ns + x, t = qˣm = tail(Ns), ε = t + ex with 1 ≤ ex ≤ (q − 1)t − 1, so t < ε < qt = tail(Ns − 1). */
const CAN = { q: 2, c: 3, m: 2, Ns: 3, x: 1, ex: 2, N0: 2 };
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q13', title: 'How far to log before the rest is negligible',
 brief: 'Mira wants a guaranteed limit on everything the relay can still add after a given number of corrections, and the point where that limit becomes negligible.',
 labels: ['bound on the whole series', 'bound on the tail', 'smallest N'], tolerance: 0.01,
 gl: [['bound on the whole series'], ['bound on the tail'], ['N']]
}, {
 canonical: CAN,
 draw: R => tries(() => { const q = R.pick([2, 3]), m = R.int(1, 3), Ns = R.int(2, 4), x = R.int(1, 2), t = m * Math.pow(q, x); return { q, c: R.int(1, 4), m, Ns, x, ex: R.int(1, (q - 1) * t - 1), N0: R.int(1, Ns + x) }; }, p => true, CAN),
 build: ({ q, c, m, Ns, x, ex, N0 }) => { const den = q === 2 ? '2ᴺ' : `${n(q)}ᴺ × ${n(q - 1)}`, J = Ns + x, k = (q - 1) * Math.pow(q, J) * m, full = m * Math.pow(q, J), tail0 = m * Math.pow(q, J - N0), t = m * Math.pow(q, x), eps = t + ex, tails = [];
  for (let i = 1; i <= Ns; i++) tails.push(m * Math.pow(q, J - i)); return {
  prompt: `The relay’s corrections are aₙ = ${n(k)} ÷ (${n(q)}ⁿ + ${co(c)}n) millivolts, for n = 1, 2, 3, …, all positive. Compare each term with bₙ = ${n(k)} ÷ ${n(q)}ⁿ. Because each aₙ is at most bₙ, the tail of Σ aₙ after N terms is at most the tail of Σ bₙ after N terms. Enter the bound on the whole series Σ aₙ given by Σ bₙ. Then enter the bound on the tail of Σ aₙ after ${n(N0)} ${N0 === 1 ? 'term' : 'terms'} given by the tail of Σ bₙ. Then enter the smallest N such that the bound on the tail after N terms is below ${n(eps)} millivolts.${wc([full, tail0, Ns])}`,
  answer: [full, tail0, Ns],
  hints: ['Σ bₙ is geometric: first term divided by 1 minus ratio. The tail of Σ bₙ after N terms is the sum of the terms from the (N + 1)th on, which is again geometric, with first term bₙ for n = N + 1.', 'The tail bound falls each time N goes up by 1, so try N = 1, 2, 3, … until it is below the tolerance. It must be strictly below.'],
  solution: `Since ${n(q)}ⁿ + ${co(c)}n > ${n(q)}ⁿ, every aₙ is less than bₙ. Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} and ratio 1 ÷ ${n(q)}, so it sums to ${n(k)} ÷ ${n(q - 1)} = ${n(full)}; so Σ aₙ ≤ ${n(full)}. The tail of Σ bₙ after N terms is geometric with ratio 1 ÷ ${n(q)} and first term ${n(k)} ÷ ${n(q)}ⁿ at n = N + 1, so it equals ${n(k)} ÷ (${den}). After ${n(N0)} ${N0 === 1 ? 'term' : 'terms'} that is ${n(tail0)}. The tail bounds after 1, 2, 3, … terms are ${tails.map(n).join(', ')}, …; the first one below ${n(eps)} is the one after ${n(Ns)} terms, ${n(t)}, and the one before it, ${n(q * t)}, is not below ${n(eps)}, so N = ${n(Ns)}.`,
  guidance: [
   { prompt: `Σ bₙ is geometric with first term ${n(k)} ÷ ${n(q)} and ratio 1 ÷ ${n(q)}. What is its sum, the bound on Σ aₙ?`, answer: [full], explanation: `(${n(k)} ÷ ${n(q)}) ÷ (1 − 1 ÷ ${n(q)}) = ${n(k)} ÷ ${n(q - 1)} = ${n(full)}.` },
   { prompt: `The tail of Σ bₙ after ${n(N0)} ${N0 === 1 ? 'term' : 'terms'} is the sum of ${n(k)} ÷ ${n(q)}ⁿ for n from ${n(N0 + 1)} on: geometric with first term ${n(k)} ÷ ${n(q ** (N0 + 1))} and ratio 1 ÷ ${n(q)}. What is that sum?`, answer: [tail0], explanation: `(${n(k / q ** (N0 + 1))}) ÷ (1 − 1 ÷ ${n(q)}) = ${n(tail0)}.` },
   { prompt: `The tail bound after N terms is ${n(k)} ÷ (${den}). Try N = 1, 2, 3, … What is the smallest N for which it is below ${n(eps)}?`, answer: [Ns], explanation: `The tail bounds after 1, 2, 3, … terms are ${tails.map(n).join(', ')}, …. The first below ${n(eps)} is the one after ${n(Ns)} terms, ${n(t)}; the one before it, ${n(q * t)}, is not.` }
  ] }; }
});
}

})();
