/* Calculus 2: accumulation practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p7.js. */
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
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => k === 1 ? '' : String(k).split('').map(d => SUP[d]).join('');
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const red = (a, b) => { const g = gcd(a, b) || 1; return [a / g, b / g]; };
const frt = (a, b) => b === 1 ? n(a) : `${n(a)}/${n(b)}`;
/* n to the power k, the coefficient c not written when it is 1: mono(3, 2) is '3n²', mono(1, 1) is 'n'. */
const mono = (c, k, v = 'n') => `${c === 1 ? '' : n(c)}${v}${sup(k)}`;
/* (x − c) written with the sign of c, and its size. */
const xc = c => c === 0 ? 'x' : `(x ${c < 0 ? '+' : '−'} ${n(Math.abs(c))})`;
const absxc = c => c === 0 ? '|x|' : `|x ${c < 0 ? '+' : '−'} ${n(Math.abs(c))}|`;
const pick = (R, list) => R.pick(list);

/* ---- q31 The integral test and p-series [5.3] ---- */

/* b: p-series with fractional powers. pc is 3/2 or 5/4 (converges), pd is 1/2, 2/3, 3/4 or 1 (diverges). */
const tN = p => p === '1' ? '1 ÷ n' : p === '1/2' ? '1 ÷ √n' : `1 ÷ n^(${p})`;
const tX = p => p === '1' ? '1 ÷ x' : p === '1/2' ? '1 ÷ √x' : `1 ÷ x^(${p})`;
const Q31B = { '3/2': { int1: 2, anti: '−2 ÷ √x', tails: [4, 16, 25, 64, 100, 400], root: N => Math.sqrt(N), top: 2, rt: N => `√${n(N)}` },
 '5/4': { int1: 4, anti: '−4 ÷ x^(1/4)', tails: [16, 256, 625, 10000], root: N => Math.round(Math.pow(N, 0.25)), top: 4, rt: N => `${n(N)}^(1/4)` } };

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'Dust on the dish shield',
 brief: 'Two dust counters on the dish shield keep logging hits, and the crew must know which log adds up to a finite total.',
 labels: ['log A converges (1 or 0)', 'log B converges (1 or 0)', 'tail bound'], tolerance: 0.005,
 gl: [['log A (1 or 0)', 'log B (1 or 0)'], ['integral from 1 to ∞'], ['tail bound']]
}, {
 canonical: { pc: '3/2', N: 100, pd: '2/3', swap: false },
 draw: R => { const pc = R.pick(['3/2', '5/4']); return { pc, N: R.pick(Q31B[pc].tails), pd: R.pick(['1/2', '2/3', '3/4', '1']), swap: R.bool() }; },
 build: ({ pc, N, pd, swap }) => { const F = Q31B[pc], pA = swap ? pc : pd, pB = swap ? pd : pc, cA = swap ? 1 : 0, cB = swap ? 0 : 1, cl = swap ? 'A' : 'B', dl = swap ? 'B' : 'A',
  s = F.root(N), tail = F.top / s, tailExpr = `${n(F.top)} ÷ ${F.rt(N)} = ${n(F.top)} ÷ ${n(s)}`; return {
  prompt: `The shield crew adds up two dust-counter logs. Log A records ${tN(pA)} micrograms for hit n = 1, 2, 3, … without end, and log B records ${tN(pB)}. Use the integral test: enter 1 if the sum of log A converges and 0 if it diverges, then the same for log B. Then, for the log whose sum converges, enter the integral bound on its tail after the first ${n(N)} hits: the integral of its formula from x = ${n(N)} to ∞.`,
  answer: [cA, cB, tail],
  hints: ['Both logs are p-series, Σ 1 ÷ nᵖ. Write each formula as 1 ÷ nᵖ to read off its p (√n is n^(1/2)). By the integral test a p-series converges only when p > 1, and p may be a fraction.',
   `The tail after ${n(N)} hits is smaller than the integral of the convergent formula from x = ${n(N)} to ∞. An antiderivative of 1 ÷ xᵖ is x^(1 − p) ÷ (1 − p), which for this log is ${F.anti}.`],
  solution: `Log A is the p-series with p = ${pA} and log B the one with p = ${pB}. Their terms are positive and shrink, so the integral test applies: Σ 1 ÷ nᵖ converges exactly when the integral of 1 ÷ xᵖ from 1 to ∞ is finite, which is when p > 1. Log ${dl} has p = ${pd} ≤ 1, so it diverges, and log ${cl} has p = ${pc} > 1, so it converges. The answers are ${cA} for log A and ${cB} for log B. The tail of log ${cl} after ${n(N)} hits is less than the integral of ${tX(pc)} from ${n(N)} to ∞: [${F.anti}] from ${n(N)} to ∞ = 0 + ${tailExpr} = ${n(tail)}.`,
  guidance: [
   { prompt: `Log A has p = ${pA} and log B has p = ${pB}. A p-series converges when p > 1 and diverges otherwise, and p may be a fraction. Enter 1 or 0 for log A, then for log B.`, answer: [cA, cB], explanation: `p = ${pc} is greater than 1, so log ${cl} converges; p = ${pd} is not, so log ${dl} diverges.` },
   { prompt: `For the convergent log, work out the integral of ${tX(pc)} from x = 1 to ∞. An antiderivative is ${F.anti}.`, answer: [F.int1], explanation: `[${F.anti}] from 1 to ∞ is 0 − (−${n(F.int1)}) = ${n(F.int1)}. The integral is finite, which is what the integral test needs.` },
   { prompt: `Now take the same integral from x = ${n(N)} to ∞. It bounds everything after the first ${n(N)} hits.`, answer: [tail], explanation: `[${F.anti}] from ${n(N)} to ∞ = 0 + ${tailExpr} = ${n(tail)}. The hits after the first ${n(N)} add up to less than ${n(tail)} micrograms.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'When the beacon log can stop',
 brief: 'The archive wants to stop logging beacon pings the moment what is still to come is provably small.',
 labels: ['bound after those pings', 'pings needed N'], tolerance: 0.0005,
 gl: [['bound'], ['pings needed N']]
}, {
 canonical: { k: 3, N0: 10, eps: 0.05 },
 draw: R => { let p; do { p = { k: R.pick([2, 3, 4, 5, 6, 8, 10]), N0: R.pick([4, 5, 8, 10, 20, 25]), eps: R.pick([0.5, 0.25, 0.2, 0.1, 0.05, 0.04, 0.02, 0.01]) };
   const N = Math.round(p.k / p.eps); if (!(N > p.N0 && N < 1000)) p = null; } while (!p); return p; },
 build: ({ k, N0, eps }) => { const bound = k / N0, N = Math.round(k / eps); return {
  prompt: `A deep-space beacon sends pings, and ping n carries ${n(k)} ÷ n² joules of energy, for n = 1, 2, 3, … without end. The archive adds up the pings it has received and stops as soon as the integral-test bound on the energy still to come is at most ${n(eps)} joules. Enter that bound after the first ${n(N0)} pings, then the smallest number of pings N after which the bound is at most ${n(eps)} joules.`,
  answer: [bound, N],
  hints: [`The bound after N pings is the integral of ${n(k)} ÷ x² from x = N to ∞. The constant ${n(k)} stays in front, and an antiderivative of 1 ÷ x² is −1 ÷ x.`,
   `Put the bound for N pings at most ${n(eps)} and solve for N: N must be at least ${n(k)} ÷ ${n(eps)}.`],
  solution: `The terms ${n(k)} ÷ n² are positive and shrinking, so the integral test applies, and the energy after N pings is less than the integral of ${n(k)} ÷ x² from N to ∞: [−${n(k)} ÷ x] from N to ∞ = ${n(k)} ÷ N. After ${n(N0)} pings that is ${n(k)} ÷ ${n(N0)} = ${n(bound)}. For ${n(k)} ÷ N to be at most ${n(eps)} we need N ≥ ${n(k)} ÷ ${n(eps)} = ${n(N)}, so the smallest N is ${n(N)}.`,
  guidance: [
   { prompt: `Find the bound after ${n(N0)} pings: the integral of ${n(k)} ÷ x² from x = ${n(N0)} to ∞.`, answer: [bound], explanation: `[−${n(k)} ÷ x] from ${n(N0)} to ∞ = 0 + ${n(k)} ÷ ${n(N0)} = ${n(bound)}. The pings after the first ${n(N0)} carry less than ${n(bound)} joules in all.` },
   { prompt: `The bound after N pings is ${n(k)} ÷ N. What is the smallest whole number N for which ${n(k)} ÷ N is at most ${n(eps)}?`, answer: [N], explanation: `${n(k)} ÷ N ≤ ${n(eps)} means N ≥ ${n(k)} ÷ ${n(eps)} = ${n(N)}, and ${n(N)} is a whole number, so N = ${n(N)}.` }
  ] }; }
});

/* d: shifted terms 1 ÷ (an + b)ᵖ. The integral from x = N to ∞ is 1 ÷ (a(p − 1)(aN + b)^(p − 1)). */
const dec4 = x => Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-7 && x * 1e4 >= 1;
const shiftInt = (a, b, N, pc) => 1 / (a * (pc - 1) * Math.pow(a * N + b, pc - 1));
const SH = []; for (const a of [2, 4, 5]) for (let b = 1; b <= 9; b++) for (let N = 2; N <= 30; N++) for (const pc of [2, 3])
 if (dec4(shiftInt(a, b, N, pc)) && dec4(shiftInt(a, b, 1, pc))) SH.push({ a, b, N, pc });
const shT = (a, b, p) => p === 1 ? `1 ÷ (${n(a)}n + ${n(b)})` : p === 0.5 ? `1 ÷ √(${n(a)}n + ${n(b)})` : `1 ÷ (${n(a)}n + ${n(b)})${sup(p)}`;
const shAnti = (a, b, p) => p === 2 ? `−1 ÷ (${n(a)}(${n(a)}x + ${n(b)}))` : `−1 ÷ (${n(2 * a)}(${n(a)}x + ${n(b)})²)`;
const shVal = (a, b, N, p) => p === 2 ? `1 ÷ (${n(a)} × ${n(a * N + b)})` : `1 ÷ (${n(2 * a)} × ${n(a * N + b)}²)`;

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q04', title: 'The shifted echo logs',
 brief: 'The timing chip starts its count from an offset, so each echo formula is shifted and Mira wants the integral test applied to it anyway.',
 labels: ['log A converges (1 or 0)', 'log B converges (1 or 0)', 'tail bound'], tolerance: 0.00005,
 gl: [['log A (1 or 0)', 'log B (1 or 0)'], ['integral from 1 to ∞'], ['tail bound']]
}, {
 canonical: { a: 2, b: 3, N: 11, pc: 2, pd: 1, swap: true },
 draw: R => { const h = R.pick(SH); return { ...h, pd: R.pick([1, 0.5]), swap: R.bool() }; },
 build: ({ a, b, N, pc, pd, swap }) => { const pA = swap ? pc : pd, pB = swap ? pd : pc, cA = swap ? 1 : 0, cB = swap ? 0 : 1, cl = swap ? 'A' : 'B', dl = swap ? 'B' : 'A',
  m = a * N + b, tail = shiftInt(a, b, N, pc), int1 = shiftInt(a, b, 1, pc), anti = shAnti(a, b, pc),
  divWhy = pd === 1 ? `the integral of 1 ÷ (${n(a)}x + ${n(b)}) is (1 ÷ ${n(a)}) ln(${n(a)}x + ${n(b)}), which grows without bound` : `the integral of 1 ÷ √(${n(a)}x + ${n(b)}) is (2 ÷ ${n(a)})√(${n(a)}x + ${n(b)}), which grows without bound`,
  tailExpr = `${shVal(a, b, N, pc)} = ${n(tail)}`; return {
  prompt: `The timing chip in the signal lab keeps two error logs that start counting at an offset. Log A adds ${shT(a, b, pA)} for n = 1, 2, 3, … without end, and log B adds ${shT(a, b, pB)}. Each formula is positive and falling, so the integral test applies, and the shift works like the substitution u = ${n(a)}x + ${n(b)}, du = ${n(a)} dx. Enter 1 if log A converges and 0 if it diverges, then the same for log B. Then, for the convergent log, enter the integral bound on its tail after the first ${n(N)} readings: the integral of its formula from x = ${n(N)} to ∞.`,
  answer: [cA, cB, tail],
  hints: [`With u = ${n(a)}x + ${n(b)} and du = ${n(a)} dx, each integral from 1 to ∞ behaves like the integral of 1 ÷ uᵖ, which is finite only when p > 1.`,
   `For the convergent log an antiderivative is ${anti}, where the factor 1 ÷ ${n(a)} comes from du = ${n(a)} dx. Put in x = ${n(N)}, and the value at ∞ is 0.`],
  solution: `The substitution u = ${n(a)}x + ${n(b)}, du = ${n(a)} dx turns each integral into one of 1 ÷ uᵖ, so the test works as for a p-series: convergence exactly when p > 1. Log ${dl} has p = ${pd === 1 ? '1' : '1/2'}: ${divWhy}, so it diverges. Log ${cl} has p = ${n(pc)} > 1, so it converges. The answers are ${cA} for log A and ${cB} for log B. The tail of log ${cl} after ${n(N)} readings is less than [${anti}] from ${n(N)} to ∞ = 0 + ${tailExpr}.`,
  guidance: [
   { prompt: `After the substitution log A behaves like a p-series with p = ${pA === 0.5 ? '1/2' : n(pA)} and log B like one with p = ${pB === 0.5 ? '1/2' : n(pB)}. Converges when p > 1. Enter 1 or 0 for log A, then for log B.`, answer: [cA, cB], explanation: `p = ${n(pc)} is greater than 1, so log ${cl} converges; the other log has p = ${pd === 1 ? '1' : '1/2'}, which is not, so it diverges.` },
   { prompt: `For the convergent log, work out the integral of its formula from x = 1 to ∞. An antiderivative is ${anti}.`, answer: [int1], explanation: `[${anti}] from 1 to ∞ = 0 + ${shVal(a, b, 1, pc)} = ${n(int1)}. The integral is finite.` },
   { prompt: `Now take the same integral from x = ${n(N)} to ∞. It bounds everything after the first ${n(N)} readings.`, answer: [tail], explanation: `[${anti}] from ${n(N)} to ∞ = 0 + ${tailExpr}. Here ${n(a)} × ${n(N)} + ${n(b)} = ${n(m)}.` }
  ] }; }
});

/* ---- q32 Comparison and limit comparison tests [5.4] ---- */

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'Noise creeping along the cable',
 brief: 'A long cable in the signal lab picks up a little noise at every segment, and the crew needs to know whether the total noise stays finite.',
 labels: ['limit of aₙ ÷ bₙ', 'converges (1 or 0)'], tolerance: 0.0005,
 gl: [['limit'], ['converges (1 or 0)']]
}, {
 canonical: { A: 7, B: 3, C: 8, D: 5, j: 1, d: 2 },
 draw: R => ({ A: R.int(2, 9), B: R.int(1, 9), C: R.pick([2, 4, 5, 8]), D: R.int(1, 7), j: R.int(1, 2), d: R.int(1, 3) }),
 build: ({ A, B, C, D, j, d }) => { const L = A / C, conv = d >= 2 ? 1 : 0, top = j + d, bn = `1 ÷ ${mono(1, d)}`; return {
  prompt: `A long cable in the signal lab picks up noise segment by segment: segment n adds aₙ = (${mono(A, j)} + ${n(B)}) ÷ (${mono(C, top)} − ${n(D)}) millivolts, for n = 2, 3, 4, … without end. The crew compares the noise with the p-series bₙ = ${bn}. Enter the limit of aₙ ÷ bₙ as n → ∞, then 1 if the total noise Σ aₙ converges and 0 if it diverges.`,
  answer: [L, conv],
  hints: [`Dividing by bₙ = ${bn} is the same as multiplying by ${mono(1, d)}. Then divide the top and the bottom by the highest power of n, ${mono(1, top)}; the − ${n(D)} on the bottom does not change the limit.`,
   'When the limit is a positive, finite number the two series do the same thing. A p-series Σ 1 ÷ nᵖ converges only when p > 1.'],
  solution: `aₙ ÷ bₙ = (${mono(A, j)} + ${n(B)}) × ${mono(1, d)} ÷ (${mono(C, top)} − ${n(D)}) = (${mono(A, top)} + ${mono(B, d)}) ÷ (${mono(C, top)} − ${n(D)}). Dividing the top and the bottom by ${mono(1, top)} gives (${n(A)} + ${n(B)} ÷ ${mono(1, j)}) ÷ (${n(C)} − ${n(D)} ÷ ${mono(1, top)}), which approaches ${n(A)} ÷ ${n(C)} = ${n(L)} as n → ∞. The limit is positive and finite, so by the limit comparison test Σ aₙ does what Σ ${bn} does. That is a p-series with p = ${n(d)}, ${d >= 2 ? `and ${n(d)} > 1, so it converges: enter 1.` : 'which is not above 1, so it diverges: enter 0.'}`,
  guidance: [
   { prompt: `Multiply aₙ by ${mono(1, d)} to get (${mono(A, top)} + ${mono(B, d)}) ÷ (${mono(C, top)} − ${n(D)}), then divide the top and the bottom by ${mono(1, top)}. What does it approach as n → ∞?`, answer: [L], explanation: `After dividing, ${n(B)} ÷ ${mono(1, j)} and ${n(D)} ÷ ${mono(1, top)} shrink to 0, so the limit is ${n(A)} ÷ ${n(C)} = ${n(L)}.` },
   { prompt: `The limit ${n(L)} is positive and finite, so Σ aₙ behaves like Σ ${bn}. Enter 1 if that p-series converges, 0 if it diverges.`, answer: [conv], explanation: d >= 2 ? `Σ ${bn} has p = ${n(d)} > 1, so it converges, and so does Σ aₙ.` : 'Σ 1 ÷ n is the harmonic series (p = 1), which diverges, so Σ aₙ diverges too.' }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Booster losses under a ceiling',
 brief: 'A signal booster loses power at every step, and the lab needs a ceiling its total loss can never pass.',
 labels: ['first term of the geometric series', 'ceiling on total loss'], tolerance: 0.0005,
 gl: [['first term'], ['ceiling']]
}, {
 canonical: { r: 3, j: 4 },
 draw: R => ({ r: R.pick([2, 3, 5, 6, 9, 11]), j: R.int(2, 9) }),
 build: ({ r, j }) => { const k = r * j, total = j * r / (r - 1); return {
  prompt: `A signal booster in the lab loses power in steps: step n costs aₙ = ${n(k)} ÷ (${n(r)}ⁿ + n) watts, for n = 1, 2, 3, … without end. Every step costs less than the matching term of the geometric series Σ ${n(k)} ÷ ${n(r)}ⁿ, so by the comparison test the total loss cannot pass the sum of that series. Enter the first term of that geometric series, then its sum: the ceiling on the booster's total loss.`,
  answer: [j, total],
  hints: [`The bottom ${n(r)}ⁿ + n is bigger than ${n(r)}ⁿ, which is why each aₙ is below ${n(k)} ÷ ${n(r)}ⁿ. The first term of the comparison series comes from n = 1.`,
   `A geometric series with first term t and common ratio q, where |q| < 1, adds up to t ÷ (1 − q). Here the ratio is 1 ÷ ${n(r)}.`],
  solution: `Since ${n(r)}ⁿ + n > ${n(r)}ⁿ, every aₙ is less than ${n(k)} ÷ ${n(r)}ⁿ, and by the comparison test the booster's total loss is held below the sum of Σ ${n(k)} ÷ ${n(r)}ⁿ. That is a geometric series with first term ${n(k)} ÷ ${n(r)} = ${n(j)} and common ratio 1 ÷ ${n(r)}, which is below 1 in size. Its sum is ${n(j)} ÷ (1 − 1 ÷ ${n(r)}) = ${n(j)} ÷ (${n(r - 1)} ÷ ${n(r)}) = ${n(j)} × ${n(r)} ÷ ${n(r - 1)} = ${n(total)}. The total loss stays below ${n(total)} watts.`,
  guidance: [
   { prompt: `The comparison series is Σ ${n(k)} ÷ ${n(r)}ⁿ, starting at n = 1. What is its first term?`, answer: [j], explanation: `Putting n = 1 gives ${n(k)} ÷ ${n(r)} = ${n(j)}.` },
   { prompt: `Its common ratio is 1 ÷ ${n(r)}. Use sum = first term ÷ (1 − ratio) to find what the series adds up to.`, answer: [total], explanation: `${n(j)} ÷ (1 − 1 ÷ ${n(r)}) = ${n(j)} × ${n(r)} ÷ ${n(r - 1)} = ${n(total)}. The booster's total loss is below this ceiling.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', title: 'The transmitter error bill',
 brief: 'The transmitter adds up an error bill whose terms are long polynomial fractions, and Mira wants the right p-series chosen for it.',
 labels: ['p of the comparison series', 'limit of aₙ ÷ bₙ', 'converges (1 or 0)'], tolerance: 0.0005,
 gl: [['p'], ['limit'], ['converges (1 or 0)']]
}, {
 canonical: { A: 5, B: 3, E: 2, C: 4, D: 6, F: 7, j: 2, d: 2 },
 draw: R => ({ A: R.int(2, 9), B: R.int(1, 9), E: R.int(1, 9), C: R.pick([2, 4, 5, 8]), D: R.int(1, 9), F: R.int(1, 9), j: R.int(2, 3), d: R.int(1, 3) }),
 build: ({ A, B, E, C, D, F, j, d }) => { const L = A / C, conv = d >= 2 ? 1 : 0, top = j + d, bn = `1 ÷ ${mono(1, d)}`; return {
  prompt: `The long-range transmitter in the signal lab bills its errors term by term: term n is aₙ = (${mono(A, j)} + ${mono(B, 1)} + ${n(E)}) ÷ (${mono(C, top)} + ${mono(D, 2)} + ${n(F)}) for n = 1, 2, 3, … without end. Build the comparison series yourself from the highest powers: it is a p-series bₙ = 1 ÷ nᵖ. Enter p, then the limit of aₙ ÷ bₙ as n → ∞, then 1 if Σ aₙ converges and 0 if it diverges.`,
  answer: [d, L, conv],
  hints: [`Keep only the highest power of n on the top and on the bottom: ${mono(A, j)} and ${mono(C, top)}. Their quotient is a number times 1 ÷ nᵖ, and that p is the one to use.`,
   `Multiply aₙ by nᵖ, then divide the top and the bottom by ${mono(1, top)}. Every other term is left with a power of n beneath it and shrinks to 0.`],
  solution: `The highest powers are ${mono(A, j)} on the top and ${mono(C, top)} on the bottom. Their quotient is (${n(A)} ÷ ${n(C)}) × 1 ÷ ${mono(1, d)}, so the comparison series is bₙ = ${bn}, with p = ${n(d)}. aₙ ÷ bₙ = (${mono(A, j)} + ${mono(B, 1)} + ${n(E)}) × ${mono(1, d)} ÷ (${mono(C, top)} + ${mono(D, 2)} + ${n(F)}). Dividing the top and the bottom by ${mono(1, top)} gives (${n(A)} + ${n(B)} ÷ ${mono(1, j - 1)} + ${n(E)} ÷ ${mono(1, j)}) ÷ (${n(C)} + ${n(D)} ÷ ${mono(1, top - 2)} + ${n(F)} ÷ ${mono(1, top)}), which approaches ${n(A)} ÷ ${n(C)} = ${n(L)}. The limit is positive and finite, so Σ aₙ does what Σ ${bn} does. With p = ${n(d)}, ${conv ? `${n(d)} > 1, so it converges: enter 1.` : 'p is not above 1, so it diverges: enter 0.'}`,
  guidance: [
   { prompt: `Compare the highest powers, ${mono(A, j)} on the top and ${mono(C, top)} on the bottom. Their quotient is a number times 1 ÷ nᵖ. What is p?`, answer: [d], explanation: `${mono(A, j)} ÷ ${mono(C, top)} = (${n(A)} ÷ ${n(C)}) × 1 ÷ ${mono(1, d)}, because ${n(top)} − ${n(j)} = ${n(d)}. So p = ${n(d)}.` },
   { prompt: `Multiply aₙ by ${mono(1, d)} and divide the top and the bottom by ${mono(1, top)}. What does aₙ ÷ bₙ approach as n → ∞?`, answer: [L], explanation: `The terms with a lower power of n shrink to 0, leaving ${n(A)} ÷ ${n(C)} = ${n(L)}.` },
   { prompt: `The limit ${n(L)} is positive and finite, so Σ aₙ does what Σ ${bn} does. Enter 1 if that p-series converges, 0 if it diverges.`, answer: [conv], explanation: conv ? `p = ${n(d)} > 1, so Σ ${bn} converges, and so does Σ aₙ.` : 'p = 1 is not above 1: Σ 1 ÷ n is the harmonic series and diverges, so Σ aₙ diverges too.' }
  ] }; }
});

/* ---- q33 Alternating series and the error bound [5.5] ---- */

/* The smallest whole number m with mᵖ > M, p = 1 or 2. */
const minM = (p, M) => { let m = 1; while (Math.pow(m, p) <= M) m++; return m; };
const joinAlt = list => list.reduce((s, t, i) => i ? `${s} ${i % 2 ? '−' : '+'} ${t}` : t, '') + ' + …';
const altC = (c, p) => joinAlt([1, 2, 3, 4].map(i => i === 1 ? n(c) : `${n(c)}/${Math.pow(i, p)}`));
const alt1 = p => joinAlt([1, 2, 3, 4].map(i => i === 1 ? '1' : `1/${Math.pow(i, p)}`));
const pwr = (m, p) => p === 1 ? n(m) : `${n(m)}${sup(p)}`;
const NP = (p, v = 'N + 1') => p === 1 ? `(${v})` : `(${v})${sup(p)}`;
const nt = p => p === 1 ? 'n' : `n${sup(p)}`;

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'Strain swings on the mast',
 brief: 'Strain gauges on the dish mast swing above and below zero, and the crew needs to know how many readings to add before the total is trustworthy.',
 labels: ['error bound after those terms', 'terms needed N'], tolerance: 0.00005,
 gl: [['size of first reading left out'], ['m = N + 1'], ['terms needed N']]
}, {
 canonical: { p: 1, c: 6, k: 7, eps: 0.1 },
 draw: R => { let q; do { const p = R.pick([1, 2]);
   q = { p, c: R.pick([2, 3, 4, 5, 6, 8]), k: R.pick(p === 1 ? [3, 4, 7, 9] : [3, 4]), eps: R.pick([0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001]) };
   } while (q.p === 1 && q.c / q.eps >= 1000); return q; },
 build: ({ p, c, k, eps }) => { const M = Math.round(c / eps), bound = c / Math.pow(k + 1, p), m = minM(p, M), N = m - 1; return {
  prompt: `Strain gauges on the dish mast report swings that alternate in sign: ${altC(c, p)}, the nth reading being (−1)ⁿ⁺¹ × ${n(c)} ÷ ${nt(p)} micrometres. The crew estimates the total swing with a partial sum. Enter the alternating series bound on the error after ${n(k)} terms, then the smallest number of terms N for which that bound is itself below ${n(eps)} micrometres.`,
  answer: [bound, N],
  hints: ['The readings alternate in sign and shrink towards 0, so the error of a partial sum is less than the size of the first reading left out.',
   `With N terms the first reading left out is ${n(c)} ÷ ${NP(p)}. It is below ${n(eps)} exactly when ${NP(p)} is bigger than ${n(c)} ÷ ${n(eps)}.`],
  solution: `The readings ${n(c)} ÷ ${nt(p)} shrink towards 0 and alternate in sign, so the alternating series test applies, and the remainder after a partial sum is smaller than the first reading left out. After ${n(k)} terms that is reading ${n(k + 1)}: ${n(c)} ÷ ${pwr(k + 1, p)}${p === 1 ? '' : ` = ${n(c)} ÷ ${n(Math.pow(k + 1, p))}`} = ${n(bound)}. For the bound to be below ${n(eps)} we need ${n(c)} ÷ ${NP(p)} < ${n(eps)}, that is ${NP(p)} > ${n(c)} ÷ ${n(eps)} = ${n(M)}. ${p === 1 ? `The smallest whole number above ${n(M)} is ${n(m)}, so N + 1 = ${n(m)}` : `${n(m - 1)}² = ${n((m - 1) * (m - 1))} is not above ${n(M)} and ${n(m)}² = ${n(m * m)} is, so N + 1 = ${n(m)}`} and N = ${n(N)} terms.`,
  guidance: [
   { prompt: `After ${n(k)} terms, the first reading left out is reading ${n(k + 1)}. What is its size, ${n(c)} ÷ ${pwr(k + 1, p)}?`, answer: [bound], explanation: `${n(c)} ÷ ${pwr(k + 1, p)}${p === 1 ? '' : ` = ${n(c)} ÷ ${n(Math.pow(k + 1, p))}`} = ${n(bound)}, so the partial sum of ${n(k)} terms is within ${n(bound)} of the total.` },
   { prompt: `With N terms the bound is ${n(c)} ÷ ${NP(p)}. For it to be below ${n(eps)}, ${NP(p)} must be above ${n(c)} ÷ ${n(eps)} = ${n(M)}. What is the smallest whole number m with ${p === 1 ? 'm' : 'm²'} > ${n(M)}?`, answer: [m], explanation: p === 1 ? `${n(M)} is not above ${n(M)}, but ${n(m)} is, so m = ${n(m)}.` : `${n(m - 1)}² = ${n((m - 1) * (m - 1))} is not above ${n(M)}, but ${n(m)}² = ${n(m * m)} is, so m = ${n(m)}.` },
   { prompt: 'That m is N + 1, the position of the first reading left out. How many terms N must be added?', answer: [N], explanation: `N = ${n(m)} − 1 = ${n(N)}. With ${n(N)} terms the first reading left out is ${n(c)} ÷ ${pwr(m, p)}, which is below ${n(eps)}.` }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Listening until the swings settle',
 brief: 'A relay logs one pulse every few seconds, and the lab wants to know how long it must listen before the estimate is good enough.',
 labels: ['pulses needed N', 'seconds of logging'], tolerance: 0.01,
 gl: [['m = N + 1'], ['pulses needed N'], ['seconds of logging']]
}, {
 canonical: { p: 2, tau: 4, eps: 0.02 },
 draw: R => { const p = R.pick([1, 2]); return { p, tau: R.int(2, 9), eps: R.pick(p === 1 ? [0.1, 0.05, 0.02, 0.01] : [0.1, 0.05, 0.02, 0.01, 0.005, 0.001]) }; },
 build: ({ p, tau, eps }) => { const M = Math.round(1 / eps), m = minM(p, M), N = m - 1, T = N * tau; return {
  prompt: `A relay logs one pulse of an alternating signal every ${n(tau)} seconds: ${alt1(p)}, the nth pulse being (−1)ⁿ⁺¹ ÷ ${nt(p)}. The lab stops logging as soon as the alternating series bound on the error of its partial sum (the size of the first pulse left out) is below ${n(eps)}. Enter the number of pulses N it must log, then the number of seconds the logging takes in all.`,
  answer: [N, T],
  hints: [`The error after N pulses is less than the size of the first pulse left out, 1 ÷ ${NP(p)}. Ask for that to be below ${n(eps)} and solve for N.`,
   `The logging time is the number of pulses times ${n(tau)} seconds for each one.`],
  solution: `The pulses shrink towards 0 and alternate in sign, so the error after N pulses is less than the first pulse left out, 1 ÷ ${NP(p)}. We need 1 ÷ ${NP(p)} < ${n(eps)}, that is ${NP(p)} > ${n(M)}. ${p === 1 ? `The smallest whole number above ${n(M)} is ${n(m)}` : `${n(m - 1)}² = ${n((m - 1) * (m - 1))} is not above ${n(M)} and ${n(m)}² = ${n(m * m)} is`}, so N + 1 = ${n(m)} and N = ${n(N)} pulses. At ${n(tau)} seconds each, the logging takes ${n(N)} × ${n(tau)} = ${n(T)} seconds.`,
  guidance: [
   { prompt: `With N pulses the bound is 1 ÷ ${NP(p)}. For it to be below ${n(eps)}, ${NP(p)} must be above 1 ÷ ${n(eps)} = ${n(M)}. What is the smallest whole number m with ${p === 1 ? 'm' : 'm²'} > ${n(M)}?`, answer: [m], explanation: p === 1 ? `${n(M)} is not above ${n(M)}, but ${n(m)} is, so m = ${n(m)}.` : `${n(m - 1)}² = ${n((m - 1) * (m - 1))} is not above ${n(M)}, but ${n(m)}² = ${n(m * m)} is, so m = ${n(m)}.` },
   { prompt: 'That m is N + 1, the position of the first pulse left out. How many pulses N must be logged?', answer: [N], explanation: `N = ${n(m)} − 1 = ${n(N)}.` },
   { prompt: `The relay logs one pulse every ${n(tau)} seconds. How many seconds do ${n(N)} pulses take?`, answer: [T], explanation: `${n(N)} × ${n(tau)} = ${n(T)} seconds.` }
  ] }; }
});

/* d: Σ (−1)ⁿ⁺¹ ÷ nᵖ with p = 1/2, 1, 3/2 or 2, as exact integer tests: gt(p, m, M) is mᵖ > M. */
const Q33D = {
 '1/2': { v: 0.5, t: '√n', conv: 0, ks: [4, 16, 25, 64, 100], Ms: [4, 5, 10], gt: (m, M) => m > M * M, nm: '1/2' },
 '1': { v: 1, t: 'n', conv: 0, ks: [4, 5, 8, 10, 20, 25], Ms: [20, 50, 100, 200, 500], gt: (m, M) => m > M, nm: '1' },
 '3/2': { v: 1.5, t: 'n^(3/2)', conv: 1, ks: [4, 25, 100], Ms: [8, 125, 1000], gt: (m, M) => m * m * m > M * M, nm: '3/2' },
 '2': { v: 2, t: 'n²', conv: 1, ks: [4, 5, 10], Ms: [50, 200, 1000, 5000], gt: (m, M) => m * m > M, nm: '2' }
};
const pRoot = (key, m) => key === '1/2' ? Math.sqrt(m) : key === '1' ? m : key === '3/2' ? m * Math.sqrt(m) : m * m;
const firstM = (key, M) => { let m = 1; while (!Q33D[key].gt(m, M)) m++; return m; };
const pTerm = (key, m) => key === '1/2' ? `√${n(m)}` : key === '1' ? n(m) : key === '3/2' ? `${n(m)}^(3/2)` : `${n(m)}²`;
const thr = (key, M) => key === '1/2' ? `${n(M)}² = ${n(M * M)}` : key === '1' ? n(M) : key === '3/2' ? `${n(M)}^(2/3) = ${n(Math.round(Math.cbrt(M * M)))}` : n(M);
const Ptxt = (key, v = 'N + 1') => key === '1/2' ? `√(${v})` : key === '1' ? `(${v})` : key === '3/2' ? `(${v})^(3/2)` : `(${v})²`;

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q31', title: 'The drift correction that flips sign',
 brief: 'A probe sends its drift correction as terms that flip sign, and Mira wants to know both whether it is safe and how many terms to trust.',
 labels: ['series without signs converges (1 or 0)', 'error bound after those terms', 'terms needed N'], tolerance: 0.00005,
 gl: [['without signs (1 or 0)'], ['error bound'], ['terms needed N']]
}, {
 canonical: { key: '3/2', k: 24, M: 1000 },
 draw: R => { const key = R.pick(['1/2', '1', '3/2', '2']), F = Q33D[key]; return { key, k: R.pick(F.ks) - 1, M: R.pick(F.Ms) }; },
 build: ({ key, k, M }) => { const F = Q33D[key], eps = 1 / M, bound = 1 / pRoot(key, k + 1), m = firstM(key, M), N = m - 1, conv = F.conv; return {
  prompt: `A deep-space probe sends its drift correction as the terms (−1)ⁿ⁺¹ ÷ ${F.t} for n = 1, 2, 3, … without end. Before the lab trusts it, Mira asks three things. Enter 1 if the series of the sizes alone (every term made positive) converges and 0 if it diverges. Then enter the alternating series bound on the error after ${n(k)} terms. Then enter the smallest number of terms N for which that bound is itself below ${n(eps)}.`,
  answer: [conv, bound, N],
  hints: [`Making every term positive leaves the p-series Σ 1 ÷ ${F.t}, and a p-series converges only when p > 1.`,
   `The terms alternate and shrink towards 0, so the error after N terms is less than the first term left out, 1 ÷ ${Ptxt(key)}. Work that out for N = ${n(k)}, then ask when it falls below ${n(eps)}.`],
  solution: `Without signs the series is the p-series Σ 1 ÷ ${F.t} with p = ${F.nm}, which ${conv ? `converges, because ${F.nm} > 1` : `diverges, because ${F.nm} is not above 1`}: enter ${conv}. With the signs the terms alternate and shrink towards 0, so the error after ${n(k)} terms is less than term ${n(k + 1)}: 1 ÷ ${pTerm(key, k + 1)} = ${n(bound)}. For the bound to be below ${n(eps)} we need 1 ÷ ${Ptxt(key)} < ${n(eps)}, that is ${Ptxt(key)} > ${n(M)}. ${key === '2' ? `${n(m - 1)}² = ${n((m - 1) * (m - 1))} is not above ${n(M)} and ${n(m)}² = ${n(m * m)} is, so N + 1 = ${n(m)}` : `That means N + 1 > ${thr(key, M)}, so the smallest N + 1 is ${n(m)}`} and N = ${n(N)} terms.`,
  guidance: [
   { prompt: `Make every term positive: what is left is the p-series Σ 1 ÷ ${F.t} with p = ${F.nm}. Enter 1 if it converges and 0 if it diverges.`, answer: [conv], explanation: conv ? `p = ${F.nm} is above 1, so the series of sizes converges.` : `p = ${F.nm} is not above 1, so the series of sizes diverges. The alternating series itself still converges.` },
   { prompt: `After ${n(k)} terms, the first term left out is term ${n(k + 1)}. What is its size, 1 ÷ ${pTerm(key, k + 1)}?`, answer: [bound], explanation: `1 ÷ ${pTerm(key, k + 1)} = ${n(bound)}, so the partial sum of ${n(k)} terms is within ${n(bound)} of the total.` },
   { prompt: `With N terms the bound is 1 ÷ ${Ptxt(key)}. It is below ${n(eps)} exactly when ${Ptxt(key)} > ${n(M)}. How many terms N is that?`, answer: [N], explanation: `${Ptxt(key)} > ${n(M)} first holds for N + 1 = ${n(m)}, so N = ${n(m)} − 1 = ${n(N)}.` }
  ] }; }
});

/* ---- q34 Ratio and root tests [5.6] ---- */

const sq = k => k === 1 ? '((n + 1) ÷ n)' : `((n + 1) ÷ n)${sup(k)}`;
const lowest = 'as a fraction in lowest terms, its numerator and then its denominator (a whole number has denominator 1)';
const reduceNote = (a, b, p, q) => gcd(a, b) > 1 ? `${n(a)}/${n(b)} in lowest terms is ${n(p)}/${n(q)}` : `${n(a)}/${n(b)} is already in lowest terms`;

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The antenna checksum',
 brief: 'The antenna drive checks its own work with a running sum of fast-growing terms, and the crew wants to know quickly whether the sum can be trusted.',
 labels: ['L numerator', 'L denominator', 'converges (1 or 0)'], tolerance: 0.01,
 gl: [['L numerator', 'L denominator'], ['converges (1 or 0)']]
}, {
 canonical: { fam: 'tri', b: 40 },
 draw: R => { if (R.bool()) return { fam: 'tri', b: R.pick([4, 5, 8, 10, 16, 20, 25, 40, 45, 50]) };
  let a, b; do { a = R.int(2, 9); b = R.int(2, 9); } while (a === b || gcd(a, b) !== 1); return { fam: 'rootk', a, b }; },
 build: p => { const tri = p.fam === 'tri', [Lp, Lq] = tri ? red(27, p.b) : red(p.a, p.b), conv = Lp < Lq ? 1 : 0, test = tri ? 'ratio' : 'root',
  term = tri ? `(3n)! ÷ ((n!)³ × ${n(p.b)}ⁿ)` : `(${n(p.a)}n ÷ (${n(p.b)}n + 1))ⁿ`, top = tri ? 27 : p.a, bot = tri ? p.b : p.b,
  verdict = conv ? `L = ${frt(Lp, Lq)} < 1, so the series converges: enter 1.` : `L = ${frt(Lp, Lq)} > 1, so the terms grow and the series diverges: enter 0.`;
  return {
  prompt: `The antenna drive’s checksum adds up the terms aₙ = ${term} for n = 1, 2, 3, … without end. Apply the ${test} test: find the limit L ${tri ? 'of aₙ₊₁ ÷ aₙ' : 'of the nth root of aₙ'} as n → ∞ and enter it ${lowest}. After that, enter 1 if the series converges and 0 if it diverges.`,
  answer: [Lp, Lq, conv],
  hints: [tri ? '(3n + 3)! = (3n + 3)(3n + 2)(3n + 1) × (3n)! and (n + 1)! = (n + 1) × n!, so most of the factorials cancel in aₙ₊₁ ÷ aₙ.' : 'The nth root of (something)ⁿ is the something itself. Then divide its top and bottom by n.',
   `The ${test} test: L < 1 means the series converges, L > 1 means it diverges, and L = 1 tells you nothing.`],
  solution: `${tri ? `aₙ₊₁ ÷ aₙ = (3n + 3)(3n + 2)(3n + 1) ÷ ((n + 1)³ × ${n(p.b)}) = 3(3n + 2)(3n + 1) ÷ (${n(p.b)}(n + 1)²). Dividing the top and the bottom by n², this is 3(3 + 2 ÷ n)(3 + 1 ÷ n) ÷ (${n(p.b)}(1 + 1 ÷ n)²), which approaches 27 ÷ ${n(p.b)}` : `The nth root of aₙ is ${n(p.a)}n ÷ (${n(p.b)}n + 1), because the power n undoes the root. Dividing the top and the bottom by n gives ${n(p.a)} ÷ (${n(p.b)} + 1 ÷ n), which approaches ${n(p.a)} ÷ ${n(p.b)}`}, which is ${frt(Lp, Lq)} in lowest terms. ${verdict}`,
  guidance: [
   { prompt: tri ? `Cancel the factorials: aₙ₊₁ ÷ aₙ = (3n + 3)(3n + 2)(3n + 1) ÷ ((n + 1)³ × ${n(p.b)}) = 3(3n + 2)(3n + 1) ÷ (${n(p.b)}(n + 1)²). What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`
     : `The nth root of aₙ is ${n(p.a)}n ÷ (${n(p.b)}n + 1). What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`,
    answer: [Lp, Lq], explanation: tri ? `Divide the top and the bottom by n²: 3(3 + 2 ÷ n)(3 + 1 ÷ n) ÷ (${n(p.b)}(1 + 1 ÷ n)²) approaches 27 ÷ ${n(p.b)}, and ${reduceNote(27, p.b, Lp, Lq)}.` : `Divide the top and the bottom by n: ${n(p.a)} ÷ (${n(p.b)} + 1 ÷ n) approaches ${n(p.a)} ÷ ${n(p.b)}, which is already in lowest terms.` },
   { prompt: `L = ${frt(Lp, Lq)}. Enter 1 if the ${test} test says the series converges, 0 if it says it diverges.`, answer: [conv], explanation: conv ? `${frt(Lp, Lq)} is less than 1, so the series converges.` : `${frt(Lp, Lq)} is greater than 1, so the terms grow and the series diverges.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Tuning the amplifier gain',
 brief: 'The signal amplifier chain has a gain dial, and the engineer needs the highest setting whose running sum still settles.',
 labels: ['L numerator', 'L denominator', 'largest whole gain'], tolerance: 0.01,
 gl: [['L numerator', 'L denominator'], ['largest gain g']]
}, {
 canonical: { k: 2, g: 4, b: 9 },
 draw: R => { const b = R.pick([5, 6, 7, 8, 9, 10, 12]); return { k: R.int(1, 3), g: R.int(2, b - 2), b }; },
 build: ({ k, g, b }) => { const [Lp, Lq] = red(g, b); return {
  prompt: `An amplifier chain in the signal lab has a whole-number gain g, and its running sum adds up the terms aₙ = ${mono(1, k)} × gⁿ ÷ ${n(b)}ⁿ for n = 1, 2, 3, … without end. With the gain set to ${n(g)}, use the ratio test to find L, entered as a fraction in lowest terms: numerator, then denominator. Then enter the largest whole-number gain g for which the ratio test guarantees that the sum converges.`,
  answer: [Lp, Lq, b - 1],
  hints: [`Write aₙ₊₁ ÷ aₙ: the powers of the gain and of ${n(b)} each leave one factor behind, and the power of n leaves a power of (n + 1) ÷ n, which approaches 1. L is what is left in the limit.`,
   'The ratio test guarantees convergence when L < 1. Work out L the same way for a general gain g, and look for the whole numbers g that keep it below 1.'],
  solution: `With g = ${n(g)}: aₙ₊₁ ÷ aₙ = ${sq(k)} × ${n(g)} ÷ ${n(b)}, because one more factor of ${n(g)} ÷ ${n(b)} appears. As n → ∞, (n + 1) ÷ n = 1 + 1 ÷ n approaches 1, so L = ${n(g)} ÷ ${n(b)}, which is ${frt(Lp, Lq)} in lowest terms. For a general gain g the limit is g ÷ ${n(b)}, and the test guarantees convergence when g ÷ ${n(b)} < 1, that is g < ${n(b)}. The largest whole number below ${n(b)} is ${n(b - 1)}.`,
  guidance: [
   { prompt: `With g = ${n(g)}, aₙ₊₁ ÷ aₙ = ${sq(k)} × ${n(g)} ÷ ${n(b)}. What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`, answer: [Lp, Lq], explanation: `(n + 1) ÷ n approaches 1, so the ratio approaches ${n(g)} ÷ ${n(b)}, and ${reduceNote(g, b, Lp, Lq)}.` },
   { prompt: `For a gain g the limit is g ÷ ${n(b)}, and the test guarantees convergence when it is below 1. What is the largest whole-number gain g that works?`, answer: [b - 1], explanation: `g ÷ ${n(b)} < 1 means g < ${n(b)}, so the largest whole number is ${n(b - 1)}.` }
  ] }; }
});

/* d: inverse factorials. inv: (n!)² × bⁿ ÷ (2n)!, L = b/4. inv3: (n!)³ × bⁿ ÷ (3n)!, L = b/27. */
mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', title: 'The calibration table turned upside down',
 brief: 'The star tracker’s calibration table has factorials on the bottom this time, and Mira wants to know whether its sum settles.',
 labels: ['L numerator', 'L denominator', 'converges (1 or 0)'], tolerance: 0.01,
 gl: [['L numerator', 'L denominator'], ['converges (1 or 0)']]
}, {
 canonical: { fam: 'inv', b: 3 },
 draw: R => R.bool() ? { fam: 'inv', b: R.pick([2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15]) } : { fam: 'inv3', b: R.pick([2, 4, 5, 7, 8, 9, 10, 11, 13, 20, 30, 36, 45, 54]) },
 build: ({ fam, b }) => { const inv = fam === 'inv', den = inv ? 4 : 27, [Lp, Lq] = red(b, den), conv = Lp < Lq ? 1 : 0,
  term = inv ? `(n!)² × ${n(b)}ⁿ ÷ (2n)!` : `(n!)³ × ${n(b)}ⁿ ÷ (3n)!`,
  bm = b === 1 ? '' : ` × ${n(b)}`, bc = b === 1 ? '' : n(b),
  ratio = inv ? `(n + 1)²${bm} ÷ ((2n + 2)(2n + 1)) = ${bc}(n + 1) ÷ (2(2n + 1)) = (${mono(b, 1)} + ${n(b)}) ÷ (4n + 2)` : `(n + 1)³${bm} ÷ ((3n + 3)(3n + 2)(3n + 1)) = ${bc}(n + 1)² ÷ (3(3n + 2)(3n + 1))`,
  work = inv ? `Dividing the top and the bottom by n, (${n(b)} + ${n(b)} ÷ n) ÷ (4 + 2 ÷ n) approaches ${n(b)} ÷ 4` : `Dividing the top and the bottom by n², ${n(b)}(1 + 1 ÷ n)² ÷ (3(3 + 2 ÷ n)(3 + 1 ÷ n)) approaches ${n(b)} ÷ 27`;
  return {
  prompt: `The star tracker’s calibration table adds up the terms aₙ = ${term} for n = 1, 2, 3, … without end. Use the ratio test and enter the limit L of aₙ₊₁ ÷ aₙ ${lowest}. Then enter 1 if the series converges and 0 if it diverges.`,
  answer: [Lp, Lq, conv],
  hints: [inv ? '(2n + 2)! = (2n + 2)(2n + 1) × (2n)! and ((n + 1)!)² = (n + 1)² × (n!)², so the factorials flip over and cancel in aₙ₊₁ ÷ aₙ.' : '(3n + 3)! = (3n + 3)(3n + 2)(3n + 1) × (3n)! and ((n + 1)!)³ = (n + 1)³ × (n!)³, so the factorials flip over and cancel in aₙ₊₁ ÷ aₙ.',
   'The ratio test: L < 1 means the series converges, L > 1 means it diverges, and L = 1 tells you nothing.'],
  solution: `aₙ₊₁ ÷ aₙ = ${ratio}. ${work}, which is ${frt(Lp, Lq)} in lowest terms. ${conv ? `L = ${frt(Lp, Lq)} < 1, so the series converges: enter 1.` : `L = ${frt(Lp, Lq)} > 1, so the terms grow and the series diverges: enter 0.`}`,
  guidance: [
   { prompt: `Cancel the factorials: aₙ₊₁ ÷ aₙ = ${ratio}. What fraction does it approach as n → ∞? Enter it in lowest terms: numerator, then denominator.`, answer: [Lp, Lq], explanation: `${work}, and ${reduceNote(b, den, Lp, Lq)}.` },
   { prompt: `L = ${frt(Lp, Lq)}. Enter 1 if the ratio test says the series converges, 0 if it says it diverges.`, answer: [conv], explanation: conv ? `${frt(Lp, Lq)} is less than 1, so the series converges.` : `${frt(Lp, Lq)} is greater than 1, so the terms grow and the series diverges.` }
  ] }; }
});

/* ---- q35 Power series: radius and interval of convergence [6.1] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The drift table',
 brief: 'The compass keeps a drift table as a series whose signs flip, and the navigator needs the range of settings it can be used for.',
 labels: ['radius of convergence', 'centre', 'left end', 'right end'], tolerance: 0.01,
 gl: [['radius'], ['centre'], ['left end', 'right end']]
}, {
 canonical: { c: -2, k: 5, j: 2 },
 draw: R => { let p; do { p = { c: R.int(-6, 6), k: R.int(2, 7), j: R.int(1, 2) }; } while (p.c === 0 || (p.c === -1 && p.k === 2)); return p; },
 build: ({ c, k, j }) => { const lo = c - k, hi = c + k, t = `(−1)ⁿ ${mono(1, j)} ${xc(c)}ⁿ ÷ ${n(k)}ⁿ`; return {
  prompt: `The star compass keeps its drift table as the power series Σ ${t}, summed from n = 1. Enter the radius of convergence, then the centre of the series, then the left end and the right end of its interval of convergence.`,
  answer: [k, c, lo, hi],
  hints: [`The sign (−1)ⁿ only flips the sign of each term, so it does not change the size of the ratio of one term to the one before. Work out that size and let n grow: (n + 1) ÷ n approaches 1.`,
   `The series converges where the size of that limit is below 1. A power series in powers of (x − a) is centred at a: write ${xc(c)} in that form to read off a.`],
  solution: `The size of the ratio of one term to the one before is ${absxc(c)} × ${sq(j)} ÷ ${n(k)}, which approaches ${absxc(c)} ÷ ${n(k)} because (n + 1) ÷ n approaches 1. The ratio test needs ${absxc(c)} ÷ ${n(k)} < 1, that is ${absxc(c)} < ${n(k)}, so the radius of convergence is ${n(k)}. ${c < 0 ? `${xc(c)} = (x − ${par(c)})` : `The series is written in powers of ${xc(c)}`}, so it is centred at ${n(c)}. The interval runs from ${n(c)} − ${n(k)} = ${n(lo)} to ${n(c)} + ${n(k)} = ${n(hi)}. At the two ends the ratio test says nothing, so put them in directly. At x = ${n(hi)} the terms are (−1)ⁿ ${mono(1, j)}, and at x = ${n(lo)} they are ${mono(1, j)}. Neither tends to 0, so by the divergence test the series diverges at both ends: it converges exactly for x strictly between ${n(lo)} and ${n(hi)}, with the ends left out.`,
  guidance: [
   { prompt: `The ratio test gives the limit ${absxc(c)} ÷ ${n(k)}, and the series converges when it is below 1. How far from the centre can x be?`, answer: [k], explanation: `${absxc(c)} ÷ ${n(k)} < 1 means ${absxc(c)} < ${n(k)}: x may be up to ${n(k)} away from the centre. That distance is the radius of convergence.` },
   { prompt: `Write ${xc(c)} in the form (x − a). What is the centre a?`, answer: [c], explanation: `${c < 0 ? `${xc(c)} = (x − ${par(c)})` : `${xc(c)} is already in that form`}, so the series is centred at ${n(c)}.` },
   { prompt: `The interval of convergence runs one radius either side of the centre ${n(c)}. What are its left and right ends?`, answer: [lo, hi], explanation: `${n(c)} − ${n(k)} = ${n(lo)} and ${n(c)} + ${n(k)} = ${n(hi)}. At either end the terms are ± ${mono(1, j)}, which do not tend to 0, so the ends themselves are left out.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Can the compass be trusted here',
 brief: 'The navigator wants to read a heading at one particular setting and must know whether the correction series can be trusted there.',
 labels: ['radius of convergence', 'distance from the centre', 'converges at the setting (1 or 0)'], tolerance: 0.01,
 gl: [['radius'], ['distance'], ['converges (1 or 0)']]
}, {
 canonical: { c: 2, k: 3, s: 5 },
 draw: R => { let p; do { const k = R.int(2, 6); p = { c: R.int(-5, 5), k, s: R.nz(-2 * k, 2 * k) }; } while (p.c === 0 || Math.abs(p.s) === p.k); return p; },
 build: ({ c, k, s }) => { const t = c + s, d = Math.abs(s), conv = d < k ? 1 : 0; return {
  prompt: `The star compass corrects its heading with the power series Σ ${xc(c)}ⁿ ÷ (n² × ${n(k)}ⁿ), summed from n = 1, and the navigator wants to use it at the setting x = ${n(t)}. Enter the radius of convergence of the series, then the distance from the setting x = ${n(t)} to the centre of the series, then 1 if the ratio test shows the series converges at that setting and 0 if it shows it diverges.`,
  answer: [k, d, conv],
  hints: ['Divide one term by the one before and let n grow: n² ÷ (n + 1)² approaches 1. The series converges where the size of that limit is below 1.',
   'Compare the distance from the setting to the centre with the radius: closer than the radius means converges, further means diverges.'],
  solution: `The size of the ratio of one term to the one before is ${absxc(c)} × n² ÷ (${n(k)}(n + 1)²), which approaches ${absxc(c)} ÷ ${n(k)}. That is below 1 when ${absxc(c)} < ${n(k)}, so the radius of convergence is ${n(k)}. ${c < 0 ? `${xc(c)} = (x − ${par(c)})` : `The series is written in powers of ${xc(c)}`}, so the centre is ${n(c)}. The setting x = ${n(t)} is ${n(d)} away from the centre: |${n(t)} − ${par(c)}| = ${n(d)}. ${n(d)} is ${conv ? `less than the radius ${n(k)}, so the series converges there: enter 1.` : `more than the radius ${n(k)}, so the ratio test limit is above 1 and the series diverges there: enter 0.`}`,
  guidance: [
   { prompt: `The ratio test gives the limit ${absxc(c)} ÷ ${n(k)}, and the series converges when it is below 1. What is the radius of convergence?`, answer: [k], explanation: `${absxc(c)} ÷ ${n(k)} < 1 means ${absxc(c)} < ${n(k)}, so the radius is ${n(k)}.` },
   { prompt: `The series is centred at ${n(c)}. How far is the setting x = ${n(t)} from the centre?`, answer: [d], explanation: `|${n(t)} − ${par(c)}| = ${n(d)}.` },
   { prompt: `The setting is ${n(d)} from the centre and the radius is ${n(k)}. Enter 1 if the setting is closer to the centre than the radius, so the series converges there, and 0 if it is further.`, answer: [conv], explanation: conv ? `${n(d)} < ${n(k)}, so the setting is inside the interval and the series converges.` : `${n(d)} > ${n(k)}, so the setting is outside the interval and the series diverges.` }
  ] }; }
});

/* d: geo: Σ kⁿ (x − c)ⁿ ÷ n, radius 1/k. binom: Σ ((2n)! ÷ (n!)²) × kⁿ (x − c)ⁿ, radius 1/(4k). */
mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q34', title: 'The fine-correction series',
 brief: 'The compass’s fine-correction series has coefficients that grow, so its trusted range is narrow and Mira wants it pinned down.',
 labels: ['centre', 'radius of convergence', 'left end', 'right end'], tolerance: 0.0005,
 gl: [['centre'], ['M'], ['radius', 'left end', 'right end']]
}, {
 canonical: { fam: 'binom', c: -3, k: 2 },
 draw: R => { let c; do { c = R.int(-5, 5); } while (c === 0); return R.bool() ? { fam: 'geo', c, k: R.pick([2, 4, 5, 8]) } : { fam: 'binom', c, k: R.pick([1, 2, 5]) }; },
 build: ({ fam, c, k }) => { const geo = fam === 'geo', M = geo ? k : 4 * k, R_ = 1 / M, lo = c - R_, hi = c + R_,
  term = geo ? `${n(k)}ⁿ ${xc(c)}ⁿ ÷ n` : `((2n)! ÷ (n!)²) × ${k === 1 ? '' : `${n(k)}ⁿ × `}${xc(c)}ⁿ`,
  ratio = geo ? `${n(k)} × ${absxc(c)} × n ÷ (n + 1)` : `(2n + 2)(2n + 1) ÷ (n + 1)² × ${k === 1 ? '' : `${n(k)} × `}${absxc(c)} = 2(2n + 1) ÷ (n + 1) × ${k === 1 ? '' : `${n(k)} × `}${absxc(c)}`; return {
  prompt: `The star compass’s fine-correction table is the power series Σ ${term}, summed from n = 1. Enter the centre of the series, then its radius of convergence (a decimal is fine), then the left end and the right end of its interval of convergence.`,
  answer: [c, R_, lo, hi],
  hints: [geo ? `In the ratio of one term to the one before, ${n(k)}ⁿ⁺¹ ÷ ${n(k)}ⁿ leaves a factor ${n(k)}, and n ÷ (n + 1) approaches 1. So the limit has the form M × ${absxc(c)} for some number M.` : `In the ratio of one term to the one before, (2n + 2)! ÷ (2n)! = (2n + 2)(2n + 1) and ((n + 1)!)² = (n + 1)² × (n!)². Here (2n + 2)(2n + 1) ÷ (n + 1)² approaches 4. The limit has the form M × ${absxc(c)} for some number M.`,
   `The series converges when M × ${absxc(c)} < 1, that is ${absxc(c)} < 1 ÷ M. So the radius is 1 ÷ M, and the interval runs one radius either side of the centre.`],
  solution: `The series is written in powers of ${xc(c)}, so ${c < 0 ? `${xc(c)} = (x − ${par(c)}) and ` : ''}the centre is ${n(c)}. The size of the ratio of one term to the one before is ${ratio}, which approaches ${n(M)} × ${absxc(c)}. The ratio test needs ${n(M)} × ${absxc(c)} < 1, that is ${absxc(c)} < 1 ÷ ${n(M)} = ${n(R_)}, so the radius of convergence is ${n(R_)}. The interval runs from ${n(c)} − ${n(R_)} = ${n(lo)} to ${n(c)} + ${n(R_)} = ${n(hi)}. At the two ends the ratio test says nothing. ${geo ? `Put them in directly: at x = ${n(hi)} the series is Σ 1 ÷ n, the harmonic series, which diverges, and at x = ${n(lo)} it is Σ (−1)ⁿ ÷ n, an alternating series that converges. So the left end belongs to the interval and the right end does not.` : 'Deciding whether the ends themselves belong needs a finer test than the ratio test; the question asks only where the ends lie.'}`,
  guidance: [
   { prompt: `Write ${xc(c)} in the form (x − a). What is the centre a?`, answer: [c], explanation: `${c < 0 ? `${xc(c)} = (x − ${par(c)})` : `${xc(c)} is already in that form`}, so the series is centred at ${n(c)}.` },
   { prompt: `In the ratio test the size of aₙ₊₁ ÷ aₙ approaches M × ${absxc(c)}, where M is a number. What is M?${geo ? '' : ''}`, answer: [M], explanation: geo ? `${n(k)}ⁿ⁺¹ ÷ ${n(k)}ⁿ leaves ${n(k)}, and n ÷ (n + 1) approaches 1, so M = ${n(k)}.` : `(2n + 2)(2n + 1) ÷ (n + 1)² = 2(2n + 1) ÷ (n + 1) approaches 4${k === 1 ? '' : `, and the factor ${n(k)}ⁿ adds ${n(k)}`}, so M = ${n(M)}.` },
   { prompt: `The series converges when M × ${absxc(c)} < 1, so the radius is 1 ÷ ${n(M)}. Enter the radius, then the left end and the right end: one radius either side of the centre ${n(c)}.`, answer: [R_, lo, hi], explanation: `1 ÷ ${n(M)} = ${n(R_)}. ${n(c)} − ${n(R_)} = ${n(lo)} and ${n(c)} + ${n(R_)} = ${n(hi)}.` }
  ] }; }
});

})();
