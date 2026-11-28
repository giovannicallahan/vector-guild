/* Real analysis practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p2.js. */
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
const rd = x => Math.round(x * 1e6) / 1e6;
/* A number with "…" when its decimals go on past the four that n() shows. */
const dots = (top, bottom) => n(top / bottom) + ((top * 10000) % bottom === 0 ? '' : '…');
/* Triangular numbers: tri(m) = 1 + 2 + … + m. */
const tri = m => m * (m + 1) / 2;
/* "1 + 2 + 3", "1 + 2 + 3 + 4" or "1 + 2 + … + m" for m >= 3. */
const upTo = m => m <= 4 ? Array.from({ length: m }, (_, i) => i + 1).join(' + ') : `1 + 2 + … + ${m}`;
/* "5 + 6 ÷ n", "−3 + 6 ÷ n", or "6 ÷ n" when the level is 0. */
const lev = (v, c) => v === 0 ? `${n(c)} ÷ n` : `${n(v)} + ${n(c)} ÷ n`;

/* ---- q06 Countable sets [0.3, 1.4] ---- */

/* Diagonal listing of ℕ × ℕ with the SECOND entry going up inside a diagonal: (a, b) is at tri(a + b − 2) + b, and the pair at
   position P on diagonal s2 has second entry P − tri(s2 − 2). The pair is never among the six the prompt prints, and a draw never
   uses the parent's numbers ((3, 4), position 20) or its worked example (position 12). */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The shelf and slot register',
 brief: 'The stores office numbers every shelf and slot pair in one long register, and the clerk needs to find entries both ways.',
 labels: ['position of the pair', 'first entry', 'second entry'], tolerance: 0.01,
 gl: [['pairs before the diagonal'], ['position of the pair'], ['diagonal sum'], ['second entry'], ['first entry']]
}, {
 canonical: { a: 5, b: 3, P: 17 },
 draw: R => retry(() => ({ a: R.int(1, 9), b: R.int(1, 9), P: R.int(7, 80) }), p => p.a + p.b >= 5 && !(p.a === 3 && p.b === 4) && p.P !== 12 && p.P !== 20, { a: 5, b: 3, P: 17 }),
 build: ({ a, b, P }) => { const s = a + b, before = tri(s - 2), pos = before + b; let s2 = 2; while (tri(s2 - 1) < P) s2++;
  const before2 = tri(s2 - 2), k = P - before2, f2 = s2 - k; return {
  prompt: `The stores office files every (shelf, slot) pair of natural numbers in one register. It lists them along diagonals: first the pair whose entries add to 2, then the pairs adding to 3, then 4, and so on; inside each diagonal the first entry goes down, so the second goes up. So the register starts (1, 1), (2, 1), (1, 2), (3, 1), (2, 2), (1, 3), …, with (1, 1) in position 1. Enter the position of the pair (${n(a)}, ${n(b)}). Then enter the pair in position ${n(P)}: its first entry, then its second.`,
  answer: [pos, f2, k],
  hints: ['The diagonal with entries adding to s holds s − 1 pairs, so the diagonals before it hold 1 + 2 + … + (s − 2) pairs between them. In this register the second entry counts up inside a diagonal, so a pair with second entry b is the b-th one.', 'To go back from a position to a pair, add 1 + 2 + 3 + … until the total first reaches the position. That tells you the diagonal; how far into it the position falls gives the second entry, and the two entries add up to the diagonal sum.'],
  solution: `(${n(a)}, ${n(b)}) lies on the diagonal with sum ${n(s)}. The diagonals before it, with sums 2 to ${n(s - 1)}, hold ${upTo(s - 2)} = ${n(before)} pairs. Here the second entry goes up inside a diagonal, so (${n(a)}, ${n(b)}) is pair number ${n(b)} of its own diagonal and its position is ${n(before)} + ${n(b)} = ${n(pos)}. For position ${n(P)}: the diagonals up to sum ${n(s2 - 1)} hold ${n(before2)} pairs and those up to sum ${n(s2)} hold ${n(tri(s2 - 1))}, so position ${n(P)} is on the diagonal with sum ${n(s2)}, at place ${n(P)} − ${n(before2)} = ${n(k)} in it. Its second entry is ${n(k)} and its first is ${n(s2)} − ${n(k)} = ${n(f2)}: the pair (${n(f2)}, ${n(k)}).`,
  guidance: [
   { prompt: `(${n(a)}, ${n(b)}) is on the diagonal with sum ${n(s)}. How many pairs come before that diagonal?`, answer: [before], explanation: `The diagonals with sums 2 to ${n(s - 1)} hold ${upTo(s - 2)} = ${n(before)} pairs.` },
   { prompt: `In this register the second entry counts the places inside a diagonal. What is the position of (${n(a)}, ${n(b)})?`, answer: [pos], explanation: `It is pair number ${n(b)} of its diagonal, so its position is ${n(before)} + ${n(b)} = ${n(pos)}.` },
   { prompt: `Which diagonal sum does position ${n(P)} fall on?`, answer: [s2], explanation: `The diagonals up to sum ${n(s2 - 1)} hold ${n(before2)} pairs and those up to sum ${n(s2)} hold ${n(tri(s2 - 1))}, so position ${n(P)} is on the diagonal with sum ${n(s2)}.` },
   { prompt: `What is the second entry of the pair in position ${n(P)}?`, answer: [k], explanation: `It is place ${n(P)} − ${n(before2)} = ${n(k)} in its diagonal, and the second entry counts the places: ${n(k)}.` },
   { prompt: `What is its first entry?`, answer: [f2], explanation: `The entries add to ${n(s2)}, so the first is ${n(s2)} − ${n(k)} = ${n(f2)}.` }
  ] }; }
});

/* The parent's order (first entry goes up): (a, b) is at tri(a + b − 2) + a. Two pairs, the first strictly earlier in the list;
   the audit counts both ends. Neither pair is the parent's (3, 4) or its worked example's (2, 3), and each lies on a diagonal with
   sum at least 4. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The tag audit',
 brief: 'Every batch and item pair at the outpost gets a tag in one fixed order, and the auditor must know how many tags a check covers.',
 labels: ['tag of the first pair', 'tag of the second pair', 'tags audited'], tolerance: 0.01,
 gl: [['tag of the first pair'], ['tag of the second pair'], ['tags audited']]
}, {
 canonical: { a1: 2, b1: 5, a2: 6, b2: 3 },
 draw: R => retry(() => ({ a1: R.int(1, 9), b1: R.int(1, 9), a2: R.int(1, 9), b2: R.int(1, 9) }),
  p => p.a1 + p.b1 >= 4 && p.a2 + p.b2 >= 4 && tri(p.a1 + p.b1 - 2) + p.a1 < tri(p.a2 + p.b2 - 2) + p.a2
   && !(p.a1 === 3 && p.b1 === 4) && !(p.a2 === 3 && p.b2 === 4) && !(p.a1 === 2 && p.b1 === 3) && !(p.a2 === 2 && p.b2 === 3), { a1: 2, b1: 5, a2: 6, b2: 3 }),
 build: ({ a1, b1, a2, b2 }) => { const s1 = a1 + b1, s2 = a2 + b2, c1 = tri(s1 - 2), c2 = tri(s2 - 2), t1 = c1 + a1, t2 = c2 + a2, cnt = t2 - t1 + 1; return {
  prompt: `The stores office gives every (batch, item) pair of natural numbers a numbered tag, one tag per pair with no gaps. Tags are issued along diagonals: first the pair whose entries add to 2, then the pairs adding to 3, then 4, and so on; inside each diagonal the batch number goes up. So tag 1 goes to (1, 1), then (1, 2), (2, 1), (1, 3), (2, 2), (3, 1), … in that order. An audit covers every tag from the tag of the pair (${n(a1)}, ${n(b1)}) to the tag of the pair (${n(a2)}, ${n(b2)}), both of those tags included. Enter the tag number of (${n(a1)}, ${n(b1)}), then the tag number of (${n(a2)}, ${n(b2)}), then how many tags the audit covers.`,
  answer: [t1, t2, cnt],
  hints: ['The diagonal with entries adding to s holds s − 1 pairs, so the diagonals before it hold 1 + 2 + … + (s − 2) pairs between them. Inside its diagonal, a pair with first entry a is the a-th one.', 'To count the tags from one tag to another with both ends included, take the difference of the two tag numbers and add one: the first tag itself is also covered.'],
  solution: `(${n(a1)}, ${n(b1)}) lies on the diagonal with sum ${n(s1)}. The diagonals before it, with sums 2 to ${n(s1 - 1)}, hold ${upTo(s1 - 2)} = ${n(c1)} pairs, and it is pair number ${n(a1)} of its own diagonal, so its tag is ${n(c1)} + ${n(a1)} = ${n(t1)}. In the same way (${n(a2)}, ${n(b2)}) lies on the diagonal with sum ${n(s2)}, after ${upTo(s2 - 2)} = ${n(c2)} pairs, and is pair number ${n(a2)} of it, so its tag is ${n(c2)} + ${n(a2)} = ${n(t2)}. Both end tags are covered, so the audit covers ${n(t2)} − ${n(t1)} + 1 = ${n(cnt)} tags.`,
  guidance: [
   { prompt: `(${n(a1)}, ${n(b1)}) is on the diagonal with sum ${n(s1)}, and it is pair number ${n(a1)} of that diagonal. What is its tag number?`, answer: [t1], explanation: `The diagonals before it hold ${upTo(s1 - 2)} = ${n(c1)} pairs, so its tag is ${n(c1)} + ${n(a1)} = ${n(t1)}.` },
   { prompt: `(${n(a2)}, ${n(b2)}) is on the diagonal with sum ${n(s2)}, and it is pair number ${n(a2)} of that diagonal. What is its tag number?`, answer: [t2], explanation: `The diagonals before it hold ${upTo(s2 - 2)} = ${n(c2)} pairs, so its tag is ${n(c2)} + ${n(a2)} = ${n(t2)}.` },
   { prompt: `The audit starts at tag ${n(t1)} and ends at tag ${n(t2)}, and both of those tags are covered. How many tags does it cover?`, answer: [cnt], explanation: `${n(t2)} − ${n(t1)} + 1 = ${n(cnt)}. The extra 1 counts the first tag itself.` }
  ] }; }
});

/* A long register in the parent's order. (a, b) with entries 10 to 60 is at tri(a + b − 2) + a. Position P (500 to 9000) is on the first
   diagonal s2 with tri(s2 − 1) ≥ P, and tri(s2 − 1) − P pairs of it come after P (never 0). Answers may reach 1000. */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', title: 'The long register',
 brief: 'The register has grown to thousands of entries, and the clerk must still find a place and a diagonal without writing the list out.',
 labels: ['position of the pair', 'diagonal sum', 'pairs after the position'], tolerance: 0.01,
 gl: [['pairs before the diagonal'], ['position of the pair'], ['diagonal sum'], ['pairs after the position']]
}, {
 canonical: { a: 23, b: 17, P: 2950 },
 draw: R => retry(() => ({ a: R.int(10, 60), b: R.int(10, 60), P: R.int(500, 9000) }), p => { let s2 = 2; while (tri(s2 - 1) < p.P) s2++; return tri(s2 - 1) > p.P; }, { a: 23, b: 17, P: 2950 }),
 build: ({ a, b, P }) => { const s = a + b, before = tri(s - 2), pos = before + a; let s2 = 2; while (tri(s2 - 1) < P) s2++; const prev = tri(s2 - 2), end = tri(s2 - 1), after = end - P; return {
  prompt: `The lab's long register lists every pair (a, b) of natural numbers along diagonals: the pair whose entries add to 2 first, then the pairs adding to 3, then 4, and so on; inside each diagonal the first entry goes up, so the list starts (1, 1), (1, 2), (2, 1), (1, 3), (2, 2), (3, 1), …, with (1, 1) in position 1. The diagonal with sum s holds s − 1 pairs. Enter the position of the pair (${n(a)}, ${n(b)}), typed without commas. Then enter the sum of the diagonal that holds position ${n(P)}, and how many pairs of that diagonal come after position ${n(P)}.`,
  answer: [pos, s2, after],
  hints: ['The diagonals before the one with sum s hold 1 + 2 + … + (s − 2) pairs, and 1 + 2 + … + m = m(m + 1) ÷ 2 saves writing the sum out. A pair with first entry a is the a-th pair of its diagonal.', 'The diagonals with sums 2 to m hold m(m − 1) ÷ 2 pairs in all. The position falls on the first diagonal where that total reaches it, and the pairs after the position are the ones from there to the end of the diagonal.'],
  solution: `(${n(a)}, ${n(b)}) lies on the diagonal with sum ${n(s)}. The diagonals before it, with sums 2 to ${n(s - 1)}, hold 1 + 2 + … + ${n(s - 2)} = ${n(s - 2)} × ${n(s - 1)} ÷ 2 = ${n(before)} pairs, and it is pair number ${n(a)} of its diagonal, so its position is ${n(before)} + ${n(a)} = ${n(pos)}. The diagonals with sums 2 to m hold m(m − 1) ÷ 2 pairs. For m = ${n(s2 - 1)} that is ${n(prev)}, which is below ${n(P)}; for m = ${n(s2)} it is ${n(end)}, which reaches it. So position ${n(P)} is on the diagonal with sum ${n(s2)}, which ends at position ${n(end)}, and ${n(end)} − ${n(P)} = ${n(after)} pairs of it come after position ${n(P)}.`,
  guidance: [
   { prompt: `(${n(a)}, ${n(b)}) is on the diagonal with sum ${n(s)}. How many pairs come before that diagonal? (Use 1 + 2 + … + m = m(m + 1) ÷ 2.)`, answer: [before], explanation: `The diagonals with sums 2 to ${n(s - 1)} hold 1 + 2 + … + ${n(s - 2)} = ${n(s - 2)} × ${n(s - 1)} ÷ 2 = ${n(before)} pairs.` },
   { prompt: `(${n(a)}, ${n(b)}) is pair number ${n(a)} of its diagonal. What is its position?`, answer: [pos], explanation: `${n(before)} + ${n(a)} = ${n(pos)}.` },
   { prompt: `The diagonals with sums 2 to m hold m(m − 1) ÷ 2 pairs in all. What is the smallest sum m for which this total is at least ${n(P)}?`, answer: [s2], explanation: `For m = ${n(s2 - 1)} the total is ${n(prev)}, which is below ${n(P)}. For m = ${n(s2)} it is ${n(end)}, which reaches it. So the diagonal sum is ${n(s2)}.` },
   { prompt: `The diagonal with sum ${n(s2)} ends at position ${n(end)}. How many of its pairs come after position ${n(P)}?`, answer: [after], explanation: `${n(end)} − ${n(P)} = ${n(after)}.` }
  ] }; }
});

/* ---- q07 The limit of a sequence with ε and N [2.1] ---- */

/* xₙ = (an − b) ÷ (cn + d), c in {2, 4, 5}: limit a ÷ c, and |xₙ − a/c| = D ÷ (c(cn + d)) with D = bc + ad, which falls with n.
   ε = e/1000; N is the first n with e·c(cn + d) > 1000D, found by whole-number comparison, 2 <= N <= 2000, and no draw lands exactly on the tolerance. The parent's example
   (3n + 1) ÷ (2n + 5) has a plus sign, so no draw repeats it. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The fuel tank gauge',
 brief: 'A pressure gauge on the fuel tank is settling after a refill, and its certificate must name the reading from which every value is inside the tolerance.',
 labels: ['limit L', 'smallest N'], tolerance: 0.001,
 gl: [['limit L'], ['size of the top'], ['smallest N']]
}, {
 canonical: { a: 5, b: 3, c: 4, d: 2, e: 5 },
 draw: R => retry(() => ({ a: R.int(3, 9), b: R.int(1, 9), c: R.pick([2, 4, 5]), d: R.int(1, 9), e: R.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]) }),
  p => { const D = p.b * p.c + p.a * p.d, T = 1000 * D; return p.e * p.c * (p.c + p.d) <= T && T / (p.e * p.c * p.c) < 2000 && !(T % (p.e * p.c) === 0 && (T / (p.e * p.c) - p.d) % p.c === 0); }, { a: 5, b: 3, c: 4, d: 2, e: 5 }),
 build: ({ a, b, c, d, e }) => { const eps = e / 1000, L = a / c, D = b * c + a * d; let N = 1; while (e * c * (c * N + d) <= 1000 * D) N++;
  const lhs = m => c * (c * m + d); return {
  prompt: `A pressure gauge on the fuel tank logs xₙ = (${n(a)}n − ${n(b)}) ÷ (${n(c)}n + ${n(d)}) bar as its nth reading. Enter the limit L of the readings, then the smallest N such that |xₙ − L| < ${n(eps)} for every n ≥ N (type it without commas).`,
  answer: [L, N],
  hints: ['Divide the top and the bottom by n to see the limit: the parts with 1/n die away.', 'Write xₙ − L as one fraction. Its top is a fixed number and its bottom grows with n, so once the size of the fraction drops below ε it stays below. Find the first n where it does.'],
  solution: `Dividing the top and the bottom by n, xₙ = (${n(a)} − ${n(b)}/n) ÷ (${n(c)} + ${n(d)}/n), which tends to ${n(a)} ÷ ${n(c)} = ${n(L)}. Then xₙ − ${n(L)} = (−${n(b)} × ${n(c)} − ${n(a)} × ${n(d)}) ÷ (${n(c)}(${n(c)}n + ${n(d)})), so |xₙ − ${n(L)}| = ${n(D)} ÷ (${n(c * c)}n + ${n(c * d)}), which shrinks as n grows. It is below ${n(eps)} exactly when ${n(c * c)}n + ${n(c * d)} > ${n(D)} ÷ ${n(eps)} = ${dots(1000 * D, e)}. At n = ${n(N - 1)} the left side is ${n(lhs(N - 1))}, which is not above it; at n = ${n(N)} it is ${n(lhs(N))}, which is. So N = ${n(N)}.`,
  guidance: [
   { prompt: `What is the limit L of xₙ = (${n(a)}n − ${n(b)}) ÷ (${n(c)}n + ${n(d)})?`, answer: [L], explanation: `Divide the top and the bottom by n: (${n(a)} − ${n(b)}/n) ÷ (${n(c)} + ${n(d)}/n) tends to ${n(a)} ÷ ${n(c)} = ${n(L)}.` },
   { prompt: `xₙ − L is one fraction with bottom ${n(c)}(${n(c)}n + ${n(d)}) and top −${n(b)} × ${n(c)} − ${n(a)} × ${n(d)}. What is the size of that top?`, answer: [D], explanation: `−${n(b)} × ${n(c)} − ${n(a)} × ${n(d)} = −${n(D)}, whose size is ${n(D)}. So |xₙ − L| = ${n(D)} ÷ (${n(c * c)}n + ${n(c * d)}).` },
   { prompt: `What is the smallest N with ${n(D)} ÷ (${n(c * c)}n + ${n(c * d)}) < ${n(eps)} for every n ≥ N?`, answer: [N], explanation: `The bound is below ${n(eps)} when ${n(c * c)}n + ${n(c * d)} > ${dots(1000 * D, e)}. At n = ${n(N - 1)} the left side is ${n(lhs(N - 1))}; at n = ${n(N)} it is ${n(lhs(N))}. So N = ${n(N)}.` }
  ] }; }
});

/* xₙ = L − m ÷ n volts, so |xₙ − L| = m ÷ n. The tolerance is pct% of L: ε = pct·L ÷ 100 (at most two decimals). N is the first n
   with n·pct·L > 100m, 3 <= N <= 999; the Nth reading is taken at minute N·h. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The battery monitor',
 brief: 'A battery monitor creeps up to its full voltage after switch-on, and the certificate must say when the readings are close enough to rely on.',
 labels: ['tolerance ε (volts)', 'smallest N', 'minute of reading N'], tolerance: 0.0005,
 gl: [['tolerance ε (volts)'], ['smallest N'], ['minute of reading N']]
}, {
 canonical: { L: 24, m: 7, pct: 2, h: 10 },
 draw: R => retry(() => ({ L: R.int(5, 40), m: R.int(2, 9), pct: R.pick([1, 2, 4, 5, 8, 10]), h: R.pick([2, 3, 5, 10, 15]) }),
  p => { const N = Math.floor(100 * p.m / (p.pct * p.L)) + 1; return N >= 3 && N <= 999; }, { L: 24, m: 7, pct: 2, h: 10 }),
 build: ({ L, m, pct, h }) => { const eps = rd(pct * L / 100), N = Math.floor(100 * m / (pct * L)) + 1, Q = m / eps, tie = (100 * m) % (pct * L) === 0, mins = N * h; return {
  prompt: `A battery monitor logs the voltage xₙ = ${n(L)} − ${n(m)} ÷ n volts as its nth reading, so the readings creep up towards ${n(L)} volts. Reading 1 is taken ${n(h)} minutes after switch-on, and each later reading is taken ${n(h)} minutes after the one before. The lab certifies the log when every reading from reading N on is strictly closer to the limit ${n(L)} volts than ${n(pct)}% of ${n(L)} volts (a reading exactly that far away does not count). Enter the tolerance ε in volts, then the smallest N that is certified (type it without commas), then the minute after switch-on at which reading N is taken (also without commas).`,
  answer: [eps, N, mins],
  hints: ['A percentage of a number is the percentage divided by 100, times the number. That is the tolerance ε in volts.', 'The distance from the limit is |xₙ − L| = m ÷ n, which shrinks as n grows. Find the first n where it is strictly below ε. Reading n is taken n times the gap between readings after switch-on.'],
  solution: `The tolerance is ${n(pct)}% of ${n(L)} volts: ${n(pct)} ÷ 100 × ${n(L)} = ${n(eps)} volts. The limit is ${n(L)} and |xₙ − ${n(L)}| = ${n(m)} ÷ n, which shrinks as n grows. It is below ${n(eps)} when n > ${n(m)} ÷ ${n(eps)} = ${dots(100 * m, pct * L)}. ${tie ? `At n = ${n(Q)} the distance equals ${n(eps)} exactly, which does not count, so N = ${n(N)}.` : `The first whole number above ${n(rd(Q))} is ${n(N)}, so N = ${n(N)}.`} Reading n is taken ${n(h)} × n minutes after switch-on, so reading ${n(N)} is taken at ${n(h)} × ${n(N)} = ${n(mins)} minutes.`,
  guidance: [
   { prompt: `What is ${n(pct)}% of ${n(L)} volts, in volts?`, answer: [eps], explanation: `${n(pct)} ÷ 100 × ${n(L)} = ${n(eps)} volts.` },
   { prompt: `|xₙ − L| = ${n(m)} ÷ n. What is the smallest N for which ${n(m)} ÷ n is strictly below ${n(eps)} at n = N, and so for every n ≥ N?`, answer: [N], explanation: `${n(m)} ÷ n < ${n(eps)} means n > ${dots(100 * m, pct * L)}. ${tie ? `At n = ${n(Q)} the distance equals ${n(eps)}, which does not count, so N = ${n(N)}.` : `The first whole number above that is ${n(N)}.`}` },
   { prompt: `Reading n is taken ${n(h)} × n minutes after switch-on. At what minute is reading ${n(N)} taken?`, answer: [mins], explanation: `${n(h)} × ${n(N)} = ${n(mins)} minutes.` }
  ] }; }
});

/* xₙ = (an² + b) ÷ (cn² + d), c in {2, 4, 5}: limit a ÷ c, |xₙ − L| = D ÷ (c(cn² + d)) with D = |bc − ad| > 0, which falls with n.
   ε1 = e/1000 and ε2 = e/10000; N1 and N2 are the first n with e·c(cn² + d) > 1000D and > 10000D, by whole-number comparison,
   2 <= N1, N2 <= 600, and no draw lands exactly on a tolerance. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', title: 'The resonance log',
 brief: 'A resonance log settles faster than the signal logs did, and the certificate must show how the starting reading moves when the tolerance is tightened.',
 labels: ['limit L', 'smallest N for ε', 'smallest N for ε ÷ 10'], tolerance: 0.001,
 gl: [['limit L'], ['size of the top'], ['smallest N for ε'], ['smallest N for ε ÷ 10']]
}, {
 canonical: { a: 3, b: 8, c: 4, d: 1, e: 4 },
 draw: R => retry(() => ({ a: R.int(2, 9), b: R.int(1, 12), c: R.pick([2, 4, 5]), d: R.int(1, 9), e: R.pick([1, 2, 4, 5, 8, 10, 20, 25]) }),
  p => { const D = Math.abs(p.b * p.c - p.a * p.d); if (D === 0) return false; let n1 = 1; while (p.e * p.c * (p.c * n1 * n1 + p.d) <= 1000 * D) n1++; let n2 = n1; while (p.e * p.c * (p.c * n2 * n2 + p.d) <= 10000 * D) n2++; const tie = (m, T) => T % (p.e * p.c) === 0 && (T / (p.e * p.c) - p.d) >= 0 && Math.sqrt((T / (p.e * p.c) - p.d) / p.c) % 1 === 0; return n1 >= 2 && n2 <= 600 && !tie(0, 1000 * D) && !tie(0, 10000 * D); }, { a: 3, b: 8, c: 4, d: 1, e: 4 }),
 build: ({ a, b, c, d, e }) => { const e1 = e / 1000, e2 = e / 10000, L = a / c, D = Math.abs(b * c - a * d), top = b * c - a * d;
  let N1 = 1; while (e * c * (c * N1 * N1 + d) <= 1000 * D) N1++; let N2 = N1; while (e * c * (c * N2 * N2 + d) <= 10000 * D) N2++;
  const lhs = m => c * c * m * m + c * d; return {
  prompt: `A resonance log records xₙ = (${n(a)}n² + ${n(b)}) ÷ (${n(c)}n² + ${n(d)}) as its nth reading. Divide the top and the bottom by n² to see the limit. Enter the limit L, then the smallest N such that |xₙ − L| < ${n(e1)} for every n ≥ N, then the smallest N such that |xₙ − L| < ${n(e2)}, a tolerance ten times tighter, for every n ≥ N (type both without commas).`,
  answer: [L, N1, N2],
  hints: ['Divide the top and the bottom by n²: the parts with 1/n² die away, and what is left gives the limit.', 'Write xₙ − L as one fraction. Its top is a fixed number and its bottom grows with n, so once its size is below the tolerance it stays below. Solve for n² first, then find the first whole n that works, once for each tolerance.'],
  solution: `Dividing the top and the bottom by n², xₙ = (${n(a)} + ${n(b)}/n²) ÷ (${n(c)} + ${n(d)}/n²), which tends to ${n(a)} ÷ ${n(c)} = ${n(L)}. Then xₙ − ${n(L)} = (${n(b)} × ${n(c)} − ${n(a)} × ${n(d)}) ÷ (${n(c)}(${n(c)}n² + ${n(d)})) = ${n(top)} ÷ (${n(c * c)}n² + ${n(c * d)}), so |xₙ − ${n(L)}| = ${n(D)} ÷ (${n(c * c)}n² + ${n(c * d)}), which shrinks as n grows. For ${n(e1)} it is below the tolerance exactly when ${n(c * c)}n² + ${n(c * d)} > ${n(D)} ÷ ${n(e1)} = ${dots(1000 * D, e)}: at n = ${n(N1 - 1)} the left side is ${n(lhs(N1 - 1))}, which is not above it; at n = ${n(N1)} it is ${n(lhs(N1))}, which is. So the first N is ${n(N1)}. For ${n(e2)} the bottom must exceed ${n(D)} ÷ ${n(e2)} = ${dots(10000 * D, e)}: at n = ${n(N2 - 1)} the left side is ${n(lhs(N2 - 1))}, not above it; at n = ${n(N2)} it is ${n(lhs(N2))}, which is. So the second N is ${n(N2)}.`,
  guidance: [
   { prompt: `What is the limit L of xₙ = (${n(a)}n² + ${n(b)}) ÷ (${n(c)}n² + ${n(d)})?`, answer: [L], explanation: `Divide the top and the bottom by n²: (${n(a)} + ${n(b)}/n²) ÷ (${n(c)} + ${n(d)}/n²) tends to ${n(a)} ÷ ${n(c)} = ${n(L)}.` },
   { prompt: `xₙ − L is one fraction with bottom ${n(c)}(${n(c)}n² + ${n(d)}) and top ${n(b)} × ${n(c)} − ${n(a)} × ${n(d)}. What is the size of that top?`, answer: [D], explanation: `${n(b)} × ${n(c)} − ${n(a)} × ${n(d)} = ${n(top)}, whose size is ${n(D)}. So |xₙ − L| = ${n(D)} ÷ (${n(c * c)}n² + ${n(c * d)}).` },
   { prompt: `What is the smallest N with ${n(D)} ÷ (${n(c * c)}n² + ${n(c * d)}) < ${n(e1)} for every n ≥ N?`, answer: [N1], explanation: `The bound is below ${n(e1)} when ${n(c * c)}n² + ${n(c * d)} > ${dots(1000 * D, e)}. At n = ${n(N1 - 1)} the left side is ${n(lhs(N1 - 1))}; at n = ${n(N1)} it is ${n(lhs(N1))}. So N = ${n(N1)}.` },
   { prompt: `Now the tolerance is ${n(e2)}. What is the smallest N with ${n(D)} ÷ (${n(c * c)}n² + ${n(c * d)}) < ${n(e2)} for every n ≥ N?`, answer: [N2], explanation: `The bound is below ${n(e2)} when ${n(c * c)}n² + ${n(c * d)} > ${dots(10000 * D, e)}. At n = ${n(N2 - 1)} the left side is ${n(lhs(N2 - 1))}; at n = ${n(N2)} it is ${n(lhs(N2))}. So N = ${n(N2)}.` }
  ] }; }
});

/* ---- q08 Monotone bounded sequences and recursive limits [2.1, 2.2] ---- */

/* xₙ₊₁ = r·xₙ + t with r = 1 − loss/100, loss in {10, 20, 25, 50}: limit L = t ÷ (1 − r) = 100t ÷ loss, a whole number. x₁ is a whole
   number other than L. x₃ has at most four decimals. The parent's rule is (xₙ + 30) ÷ 4 and the worked example's (xₙ + 6) ÷ 2. */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The reservoir top-up',
 brief: 'A reservoir loses water to evaporation every day and is topped up by the pumps, and the operators want to know the level it will settle at.',
 labels: ['x₃', 'limit'], tolerance: 0.00005,
 gl: [['x₂'], ['x₃'], ['limit']]
}, {
 canonical: { loss: 25, t: 12, a: 20 },
 draw: R => retry(() => ({ loss: R.pick([10, 20, 25, 50]), t: R.int(3, 40), a: R.int(0, 120) }), p => p.a !== 100 * p.t / p.loss, { loss: 25, t: 12, a: 20 }),
 build: ({ loss, t, a }) => { const r = rd(1 - loss / 100), L = 100 * t / loss, x2 = rd(r * a + t), x3 = rd(r * x2 + t), up = a < L; return {
  prompt: `A reservoir holds ${n(a)} megalitres at the start of day 1, so x₁ = ${n(a)}. Each day it loses ${n(loss)}% of its water to evaporation, and then the pumps add ${n(t)} megalitres. So the level at the start of day n + 1 is xₙ₊₁ = ${n(r)} × xₙ + ${n(t)}. Enter x₃ (as a decimal or a fraction), then the limit of the levels.`,
  answer: [x3, L],
  hints: ['Put x₁ into the rule to get x₂, then put x₂ in to get x₃.', 'If the levels settle on L, then xₙ₊₁ tends to L as well, so L satisfies the rule with L on both sides. Solve that equation. To see that they do settle, subtract L from both sides of the rule and compare each distance from L with the one before.'],
  solution: `x₂ = ${n(r)} × ${n(a)} + ${n(t)} = ${n(x2)} and x₃ = ${n(r)} × ${n(x2)} + ${n(t)} = ${n(x3)}. A limit L must satisfy L = ${n(r)}L + ${n(t)}, so ${n(rd(1 - r))}L = ${n(t)} and L = ${n(L)}. The limit does exist: subtracting L = ${n(r)}L + ${n(t)} from the rule gives xₙ₊₁ − ${n(L)} = ${n(r)}(xₙ − ${n(L)}), so each day the level stays on the same side of ${n(L)} and its distance from ${n(L)} shrinks by the factor ${n(r)}. The levels start ${up ? 'below' : 'above'} ${n(L)}, so they are ${up ? 'increasing and bounded above' : 'decreasing and bounded below'} by ${n(L)}, and a monotone bounded sequence converges.`,
  guidance: [
   { prompt: `What is x₂ = ${n(r)} × ${n(a)} + ${n(t)}?`, answer: [x2], explanation: `${n(r)} × ${n(a)} = ${n(rd(r * a))}, and adding ${n(t)} gives ${n(x2)}.` },
   { prompt: `What is x₃ = ${n(r)} × x₂ + ${n(t)}?`, answer: [x3], explanation: `${n(r)} × ${n(x2)} = ${n(rd(r * x2))}, and adding ${n(t)} gives ${n(x3)}.` },
   { prompt: `The levels are monotone and bounded, so they have a limit L, and L = ${n(r)}L + ${n(t)}. What is L?`, answer: [L], explanation: `Move the L terms together: ${n(rd(1 - r))}L = ${n(t)}, so L = ${n(t)} ÷ ${n(rd(1 - r))} = ${n(L)}.` }
  ] }; }
});

/* xₙ₊₁ = xₙ ÷ 2 + t: limit L = 2t, x₁ = L ± g, and cycle n is g ÷ 2^(n − 1) from L. The answer is the first cycle number k with
   g < tol·2^(k − 1), found by whole-number comparison; 3 <= k <= 9. Never the parent's rule or its worked example. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The heat exchanger',
 brief: 'A heat exchanger sets each cycle\'s temperature from the one before, and the operators want to know where it settles and when it is close enough.',
 labels: ['limit', 'distance of x₁ from the limit', 'first cycle number n'], tolerance: 0.01,
 gl: [['limit'], ['distance of x₁ from the limit'], ['first cycle number n']]
}, {
 canonical: { t: 15, g: 64, above: true, tol: 3 },
 draw: R => retry(() => ({ t: R.int(3, 30), g: R.int(10, 200), above: R.bool(), tol: R.pick([1, 2, 3, 5]) }),
  p => { if (!p.above && p.g > 2 * p.t) return false; let k = 1; while (p.g >= p.tol * 2 ** (k - 1)) k++; return k >= 3 && k <= 9; }, { t: 15, g: 64, above: true, tol: 3 }),
 build: ({ t, g, above, tol }) => { const L = 2 * t, x1 = above ? L + g : L - g; let k = 1; while (g >= tol * 2 ** (k - 1)) k++;
  const P = 2 ** (k - 1), Pp = P / 2; return {
  prompt: `A heat exchanger sets the temperature of each cycle from the cycle before: xₙ₊₁ = xₙ ÷ 2 + ${n(t)} degrees. Cycle 1 runs at x₁ = ${n(x1)} degrees, and the temperatures settle on a limit. Enter that limit, then how many degrees x₁ is from the limit, then the number n of the first cycle whose temperature is closer to the limit than ${n(tol)} ${tol === 1 ? 'degree' : 'degrees'} (a cycle exactly ${n(tol)} ${tol === 1 ? 'degree' : 'degrees'} away does not count).`,
  answer: [L, g, k],
  hints: ['If the temperatures settle on L, then xₙ₊₁ tends to L as well, so L satisfies the rule with L on both sides. Solve that equation.', 'Subtract L from both sides of the rule, using L = L ÷ 2 + t: xₙ₊₁ − L = (xₙ − L) ÷ 2. So each cycle halves the distance from the limit. List the distances cycle by cycle until one is below the tolerance.'],
  solution: `A limit L must satisfy L = L ÷ 2 + ${n(t)}, so L ÷ 2 = ${n(t)} and L = ${n(L)}. Then x₁ = ${n(x1)} is ${n(g)} degrees ${above ? 'above' : 'below'} the limit. Subtracting L = L ÷ 2 + ${n(t)} from the rule gives xₙ₊₁ − ${n(L)} = (xₙ − ${n(L)}) ÷ 2, so each cycle halves the distance: cycle 1 is ${n(g)} away, cycle 2 is ${n(g)} ÷ 2 away, cycle 3 is ${n(g)} ÷ 4 away, and so on. Cycle ${n(k - 1)} is ${n(g)} ÷ ${n(Pp)} = ${dots(g, Pp)} away, which is not below ${n(tol)}. Cycle ${n(k)} is ${n(g)} ÷ ${n(P)} = ${dots(g, P)} away, which is. So n = ${n(k)}.`,
  guidance: [
   { prompt: `The temperatures settle on a limit L, so L = L ÷ 2 + ${n(t)}. What is L?`, answer: [L], explanation: `Subtract L ÷ 2 from both sides: L ÷ 2 = ${n(t)}, so L = ${n(L)}.` },
   { prompt: `How many degrees is x₁ = ${n(x1)} from the limit?`, answer: [g], explanation: `The distance is |${n(x1)} − ${n(L)}| = ${n(g)} degrees.` },
   { prompt: `Each cycle halves the distance from the limit: cycle 1 is ${n(g)} away, cycle 2 is ${n(g)} ÷ 2, cycle 3 is ${n(g)} ÷ 4, and so on. What is the number of the first cycle whose distance is below ${n(tol)}?`, answer: [k], explanation: `Cycle ${n(k - 1)} is ${n(g)} ÷ ${n(Pp)} = ${dots(g, Pp)} away, not below ${n(tol)}. Cycle ${n(k)} is ${n(g)} ÷ ${n(P)} = ${dots(g, P)} away, which is. So n = ${n(k)}.` }
  ] }; }
});

/* xₙ₊₁ = √(xₙ + k) with k = L0² − L0 (L0 from 3 to 7), so the limit is L0 (the other root of L² − L − k is 1 − L0, negative). x₂ = s = L0 + j/4 and
   x₁ = s² − k >= 0, with s ≠ L0 and j a whole number of quarters. s below L0: the sequence rises towards L0 and never reaches it
   (sup L0, no maximum). s above L0: it falls, x₁ is the largest (sup x₁, a maximum). Combines q01 (sup and maximum). */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q01', title: 'The pressure regulator',
 brief: 'A pressure regulator feeds each cycle\'s setting through a square root, and the certificate must record the limit and the highest setting ever reached.',
 labels: ['x₂', 'limit', 'supremum of all settings', 'maximum? (1 or 0)'], tolerance: 0.00005,
 gl: [['x₂'], ['limit'], ['supremum of all settings'], ['maximum? (1 or 0)']]
}, {
 canonical: { L0: 4, j: -1 },
 draw: R => { const L0 = R.int(3, 7), k = L0 * L0 - L0, js = [];
  for (let j = -8; j <= 16; j++) if (j !== 0) { const s = L0 + j / 4; if (s * s >= k && s > 0) js.push(j); }
  const lo = js.filter(j => j < 0), hi = js.filter(j => j > 0), pool = R.bool() && lo.length ? lo : hi;
  return pool.length ? { L0, j: R.pick(pool) } : { L0: 4, j: -1 }; },
 build: ({ L0, j }) => { const k = L0 * L0 - L0, s = L0 + j / 4, x1 = rd(s * s - k), rising = s < L0, sup = rising ? L0 : x1, flag = rising ? 0 : 1; return {
  prompt: `A pressure regulator sets the pressure of each cycle from the one before: x₁ = ${n(x1)} bar and then xₙ₊₁ = √(xₙ + ${n(k)}). Every pressure is at least 0, and you may take it that the sequence is monotone and bounded, so it converges. Enter x₂ (as a decimal), then the limit, then the supremum of the set of all the pressures {xₙ : n ∈ ℕ}, then 1 if that set has a maximum (the supremum is itself one of the pressures) or 0 if it does not.`,
  answer: [s, L0, sup, flag],
  hints: ['Put x₁ into the rule: the number under the root is the square of a number with at most two decimals, so x₂ comes out exactly.', 'If the limit is L, then xₙ₊₁ tends to L as well, so L = √(L + k). Square both sides to get a quadratic, solve it by factoring or the formula, and keep the root that is at least 0 (every pressure is).', 'Compare x₁ with the limit. A monotone sequence that rises has its supremum at its limit; one that falls has its first term as its largest. Then ask whether some pressure actually equals the supremum.'],
  solution: `x₂ = √(${n(x1)} + ${n(k)}) = √${n(rd(s * s))} = ${n(s)}. A limit L must satisfy L = √(L + ${n(k)}), so L² = L + ${n(k)}, that is L² − L − ${n(k)} = 0, which factors as (L − ${n(L0)})(L + ${n(L0 - 1)}) = 0. The pressures are at least 0, so L = ${n(L0)}. ${rising ? `x₁ = ${n(x1)} is below ${n(L0)}, so the pressures rise towards ${n(L0)}: the supremum is the limit, ${n(L0)}. Each step stays strictly below ${n(L0)}, so no pressure equals it and there is no maximum: 0.` : `x₁ = ${n(x1)} is above ${n(L0)}, so the pressures fall towards ${n(L0)}, and the largest of them is the first, ${n(x1)}. That is the supremum, and it is itself one of the pressures, so it is a maximum: 1.`}`,
  guidance: [
   { prompt: `What is x₂ = √(${n(x1)} + ${n(k)})?`, answer: [s], explanation: `${n(x1)} + ${n(k)} = ${n(rd(s * s))}, and its square root is ${n(s)}.` },
   { prompt: `The limit L satisfies L = √(L + ${n(k)}), so L² − L − ${n(k)} = 0. What is the root that is at least 0?`, answer: [L0], explanation: `The quadratic factors as (L − ${n(L0)})(L + ${n(L0 - 1)}) = 0, with roots ${n(L0)} and −${n(L0 - 1)}. The pressures are at least 0, so L = ${n(L0)}.` },
   { prompt: `x₁ = ${n(x1)} is ${rising ? 'below' : 'above'} the limit ${n(L0)}, so the pressures ${rising ? 'rise' : 'fall'}. What is the supremum of all the pressures?`, answer: [sup], explanation: rising ? `A rising bounded sequence has its limit as supremum: ${n(L0)}.` : `A falling sequence has its first term as its largest, so the supremum is x₁ = ${n(x1)}.` },
   { prompt: `Is the supremum ${n(sup)} one of the pressures? Enter 1 if it is, 0 if it is not.`, answer: [flag], explanation: rising ? `The pressures keep rising but stay strictly below ${n(L0)}, so none equals it: 0.` : `The supremum is x₁ itself, so it is a maximum: 1.` }
  ] }; }
});

/* ---- q09 Limit laws and the squeeze lemma [2.2] ---- */

/* xₙ = (an + b cos n) ÷ (cn), n in radians, c in {2, 4, 5}: limit a ÷ c and |xₙ − a/c| ≤ b ÷ (cn). ε = e/1000; N is the first n with
   n·c·e > 1000b, found exactly. The parent has L + k sin(n) ÷ n^p, and its worked example 5 + 3cos(n) ÷ n; this one is a quotient. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The vibration sensor',
 brief: 'A vibration sensor wobbles around its working level as it warms up, and the log needs the level and a sample from which the wobble is certified small.',
 labels: ['limit', 'smallest N'], tolerance: 0.001,
 gl: [['limit'], ['b ÷ (c × ε)'], ['smallest N']]
}, {
 canonical: { a: 5, b: 6, c: 4, e: 5 },
 draw: R => retry(() => ({ a: R.int(2, 9), b: R.int(2, 9), c: R.pick([2, 4, 5]), e: R.pick([1, 2, 4, 5, 10, 20, 25, 50]) }), p => !(p.a === 7 && p.b === 4), { a: 5, b: 6, c: 4, e: 5 }),
 build: ({ a, b, c, e }) => { const eps = e / 1000, L = a / c, Qt = 1000 * b, Qb = c * e, N = Math.floor(Qt / Qb) + 1, tie = Qt % Qb === 0; return {
  prompt: `A vibration sensor reports xₙ = (${n(a)}n + ${n(b)} cos(n)) ÷ (${n(c)}n) on its nth sample, with n read in radians. Enter the limit of xₙ, then the smallest N for which the squeeze bound ${n(b)} ÷ (${n(c)}n), the largest that |xₙ − limit| can be when cos(n) is replaced by 1, is below ε = ${n(eps)} at n = N (and so for every n ≥ N). Type N without commas.`,
  answer: [L, N],
  hints: ['Split the fraction into two pieces over the same bottom. One piece is a plain number; the other has cos(n) on top and a multiple of n below. Use −1 ≤ cos(n) ≤ 1 and the squeeze lemma on that piece.', 'The distance from xₙ to its limit is at most the cos piece with cos(n) replaced by 1. Find the first n where that bound is smaller than ε. It must be strictly smaller.'],
  solution: `Splitting the fraction, xₙ = ${n(a)} ÷ ${n(c)} + (${n(b)} ÷ ${n(c)}) cos(n) ÷ n. Since −1 ≤ cos(n) ≤ 1, ${n(L)} − ${n(b)} ÷ (${n(c)}n) ≤ xₙ ≤ ${n(L)} + ${n(b)} ÷ (${n(c)}n). Both outer sequences tend to ${n(L)}, because ${n(b)} ÷ (${n(c)}n) tends to 0, so by the squeeze lemma xₙ tends to ${n(L)}. The same bounds give |xₙ − ${n(L)}| ≤ ${n(b)} ÷ (${n(c)}n). Now ${n(b)} ÷ (${n(c)}n) < ${n(eps)} means n > ${n(b)} ÷ (${n(c)} × ${n(eps)}) = ${dots(Qt, Qb)}. ${tie ? `At n = ${n(Qt / Qb)} the bound equals ε rather than being below it. So N = ${n(N)}.` : `The first whole number above ${dots(Qt, Qb)} is ${n(N)}. So N = ${n(N)}.`}`,
  guidance: [
   { prompt: `What is the limit of xₙ = (${n(a)}n + ${n(b)} cos(n)) ÷ (${n(c)}n)?`, answer: [L], explanation: `xₙ = ${n(a)} ÷ ${n(c)} + (${n(b)} ÷ ${n(c)}) cos(n) ÷ n. The cos piece is trapped between ±${n(b)} ÷ (${n(c)}n), which tend to 0, so by the squeeze lemma the limit is ${n(a)} ÷ ${n(c)} = ${n(L)}.` },
   { prompt: `${n(b)} ÷ (${n(c)}n) < ${n(eps)} is the same as n > ${n(b)} ÷ (${n(c)} × ${n(eps)}). What is ${n(b)} ÷ (${n(c)} × ${n(eps)})?`, answer: [Qt / Qb], explanation: `${n(b)} ÷ ${n(c * eps)} = ${dots(Qt, Qb)}.` },
   { prompt: `What is the smallest whole number N with N > ${dots(Qt, Qb)}?`, answer: [N], explanation: tie ? `n must be greater than ${n(Qt / Qb)}: at n = ${n(Qt / Qb)} the bound equals ε rather than being below it. So N = ${n(N)}.` : `The first whole number above ${dots(Qt, Qb)} is ${n(N)}.` }
  ] }; }
});

/* Sensor 1: A + p ÷ n; sensor 2: B + q sin(n) ÷ n (radians); the log adds them, so L = A + B and |xₙ − L| ≤ (p + q) ÷ n. The tolerance is
   pct% of L (exact, at most two decimals); N is the first n with n·pct·L > 100(p + q), 2 <= N <= 2000. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'Two sensors, one log',
 brief: 'A thermal log adds the readings of two sensors, one smooth and one noisy, and the lab certifies it once both have settled to within a percentage of the total.',
 labels: ['limit', 'tolerance ε', 'smallest N'], tolerance: 0.0005,
 gl: [['limit'], ['tolerance ε'], ['smallest N']]
}, {
 canonical: { A: 12, B: 8, p: 3, q: 4, pct: 2 },
 draw: R => retry(() => ({ A: R.int(3, 20), B: R.int(3, 20), p: R.int(1, 9), q: R.int(2, 9), pct: R.pick([1, 2, 4, 5, 8, 10]) }),
  p => { const N = Math.floor(100 * (p.p + p.q) / (p.pct * (p.A + p.B))) + 1; return N >= 2 && N <= 2000; }, { A: 12, B: 8, p: 3, q: 4, pct: 2 }),
 build: ({ A, B, p, q, pct }) => { const L = A + B, S = p + q, eps = rd(pct * L / 100), Q = 100 * S / (pct * L), N = Math.floor(100 * S / (pct * L)) + 1, tie = (100 * S) % (pct * L) === 0; return {
  prompt: `A thermal log adds the readings of two sensors. On sample n, sensor 1 reads ${n(A)} + ${n(p)} ÷ n and sensor 2 reads ${n(B)} + ${n(q)} sin(n) ÷ n, with n read in radians, and the log records the sum xₙ. The lab certifies the log from sample N on when every sample is strictly closer to the limit than ${n(pct)}% of the limit (a sample exactly that far away does not count). Enter the limit of xₙ, then that tolerance ε, then the smallest N for which the squeeze bound ${n(S)} ÷ n, the largest that |xₙ − limit| can be, is below ε at n = N (and so for every n ≥ N). Type N without commas.`,
  answer: [L, eps, N],
  hints: ['The limit of a sum is the sum of the limits. For the sin piece, −1 ≤ sin(n) ≤ 1 traps it between two sequences that tend to 0, and the squeeze lemma gives its limit.', 'A percentage of a number is the percentage divided by 100, times the number. The distance |xₙ − limit| is at most the p ÷ n piece plus the q piece with sin(n) replaced by 1: add the two tops. Find the first n where that bound is strictly below ε.'],
  solution: `Sensor 1 tends to ${n(A)}. Sensor 2 is trapped between ${n(B)} − ${n(q)} ÷ n and ${n(B)} + ${n(q)} ÷ n, which both tend to ${n(B)}, so by the squeeze lemma it tends to ${n(B)}. By the limit law for sums, xₙ tends to ${n(A)} + ${n(B)} = ${n(L)}. The tolerance is ${n(pct)}% of ${n(L)}: ${n(pct)} ÷ 100 × ${n(L)} = ${n(eps)}. Since xₙ − ${n(L)} = ${n(p)} ÷ n + ${n(q)} sin(n) ÷ n, |xₙ − ${n(L)}| ≤ (${n(p)} + ${n(q)}) ÷ n = ${n(S)} ÷ n. Now ${n(S)} ÷ n < ${n(eps)} means n > ${n(S)} ÷ ${n(eps)} = ${dots(100 * S, pct * L)}. ${tie ? `At n = ${n(Q)} the bound equals ε rather than being below it. So N = ${n(N)}.` : `The first whole number above that is ${n(N)}. So N = ${n(N)}.`}`,
  guidance: [
   { prompt: `Sensor 1 tends to ${n(A)}, and the squeeze lemma gives sensor 2 the limit ${n(B)}. What is the limit of their sum xₙ?`, answer: [L], explanation: `The limit of a sum is the sum of the limits: ${n(A)} + ${n(B)} = ${n(L)}.` },
   { prompt: `What is ${n(pct)}% of the limit ${n(L)}?`, answer: [eps], explanation: `${n(pct)} ÷ 100 × ${n(L)} = ${n(eps)}.` },
   { prompt: `${n(S)} ÷ n < ${n(eps)} is the same as n > ${n(S)} ÷ ${n(eps)} = ${dots(100 * S, pct * L)}. What is the smallest whole number N for which the bound is strictly below ε?`, answer: [N], explanation: tie ? `n must be greater than ${n(Q)}: at n = ${n(Q)} the bound equals ε rather than being below it. So N = ${n(N)}.` : `The first whole number above ${dots(100 * S, pct * L)} is ${n(N)}.` }
  ] }; }
});

/* Bounds (an − p) ÷ (cn) ≤ xₙ ≤ (an² + q) ÷ (cn²), c in {2, 4, 5}: both tend to a ÷ c; L − lower = p ÷ (cn), upper − L = q ÷ (cn²).
   ε = e/1000. Nl is the first n with n·c·e > 1000p and Nu the first with n²·c·e > 1000q, found exactly; N is the larger, and
   Nl ≠ Nu, 3 <= both <= 500. Combines q07 (finding N from ε). */
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q07', title: 'The drift sandwich',
 brief: 'A drift log is known only to lie between two bounds that close in at different speeds, and the certificate must start where both are tight enough.',
 labels: ['limit', 'smallest N'], tolerance: 0.001,
 gl: [['limit'], ['N for the lower bound'], ['N for the upper bound'], ['smallest N']]
}, {
 canonical: { a: 3, c: 4, p: 2, q: 400, e: 5 },
 draw: R => retry(() => ({ a: R.int(2, 9), c: R.pick([2, 4, 5]), p: R.int(1, 30), q: R.int(1, 500), e: R.pick([2, 4, 5, 8, 10, 20, 25, 40, 50]) }),
  p => { const Nl = Math.floor(1000 * p.p / (p.c * p.e)) + 1; let Nu = 1; while (Nu * Nu * p.c * p.e <= 1000 * p.q) Nu++; return Nl >= 3 && Nu >= 3 && Nl <= 500 && Nu <= 500 && Nl !== Nu; }, { a: 3, c: 4, p: 2, q: 400, e: 5 }),
 build: ({ a, c, p, q, e }) => { const eps = e / 1000, L = a / c, Nl = Math.floor(1000 * p / (c * e)) + 1; let Nu = 1; while (Nu * Nu * c * e <= 1000 * q) Nu++; const N = Math.max(Nl, Nu), tl = dots(1000 * p, c * e), tu = dots(1000 * q, c * e); return {
  prompt: `A drift log's samples are only known to satisfy (${n(a)}n − ${n(p)}) ÷ (${n(c)}n) ≤ xₙ ≤ (${n(a)}n² + ${n(q)}) ÷ (${n(c)}n²) for every n ≥ 1. Enter the limit L of xₙ, then the smallest N for which these two bounds together guarantee |xₙ − L| < ${n(eps)} for every n ≥ N (type it without commas).`,
  answer: [L, N],
  hints: ['Divide the top and the bottom of each bound by its highest power of n: both bounds then tend to the same number, and the squeeze lemma gives the limit of xₙ.', 'xₙ is guaranteed to be within ε of L when both bounds are: the lower bound must be less than ε below L and the upper bound less than ε above L. Find the first n for each bound separately. The guarantee needs both, so take the later one.'],
  solution: `Dividing the top and the bottom of the lower bound by n gives (${n(a)} − ${n(p)}/n) ÷ ${n(c)}, and of the upper bound by n² gives (${n(a)} + ${n(q)}/n²) ÷ ${n(c)}. Both tend to ${n(a)} ÷ ${n(c)} = ${n(L)}, so by the squeeze lemma xₙ tends to ${n(L)}. The lower bound is ${n(L)} − ${n(p)} ÷ (${n(c)}n), and the upper bound is ${n(L)} + ${n(q)} ÷ (${n(c)}n²). The lower one is within ${n(eps)} when ${n(p)} ÷ (${n(c)}n) < ${n(eps)}, that is n > ${tl}, which first holds at n = ${n(Nl)}. The upper one is within ${n(eps)} when ${n(q)} ÷ (${n(c)}n²) < ${n(eps)}, that is n² > ${tu}: ${n(Nu - 1)}² = ${n((Nu - 1) ** 2)} is not above it and ${n(Nu)}² = ${n(Nu * Nu)} is, so n = ${n(Nu)}. The guarantee needs both bounds, so N is the larger: ${n(N)}.`,
  guidance: [
   { prompt: `What is the limit L of xₙ? Both bounds tend to the same number: divide each top and bottom by its highest power of n.`, answer: [L], explanation: `The lower bound tends to ${n(a)} ÷ ${n(c)} and so does the upper bound. By the squeeze lemma, L = ${n(L)}.` },
   { prompt: `The lower bound is ${n(p)} ÷ (${n(c)}n) below L. What is the smallest N with ${n(p)} ÷ (${n(c)}n) < ${n(eps)} for every n ≥ N?`, answer: [Nl], explanation: `It needs n > ${tl}, so the first whole number is ${n(Nl)}.` },
   { prompt: `The upper bound is ${n(q)} ÷ (${n(c)}n²) above L. What is the smallest N with ${n(q)} ÷ (${n(c)}n²) < ${n(eps)} for every n ≥ N?`, answer: [Nu], explanation: `It needs n² > ${tu}. ${n(Nu - 1)}² = ${n((Nu - 1) ** 2)} is not above it and ${n(Nu)}² = ${n(Nu * Nu)} is, so N = ${n(Nu)}.` },
   { prompt: `The two bounds guarantee |xₙ − L| < ${n(eps)} only when both are tight enough. What is the smallest N that works for both?`, answer: [N], explanation: `The larger of ${n(Nl)} and ${n(Nu)} is ${n(N)}.` }
  ] }; }
});

/* ---- q10 Subsequences, limsup and liminf [2.3] ---- */

/* Four levels r1..r4 by n mod 4 (all different), xₙ = rₙ + c ÷ n with c in {12, 24}, so c ÷ 1, c ÷ 2, c ÷ 3 and c ÷ 4 are whole.
   Each subsequence falls, so its first term is its largest: sup = max(r1 + c, r2 + c/2, r3 + c/3, r4 + c/4). The parent has
   one or two levels and three. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The four-step beacon',
 brief: 'A rotating beacon steps through four brightness levels as its lamp cools, and the log must record the brightest and dimmest levels it keeps returning to.',
 labels: ['sup of all samples', 'limsup', 'liminf'], tolerance: 0.01,
 gl: [['limsup'], ['liminf'], ['sup of all samples']]
}, {
 canonical: { c: 12, r1: 2, r2: 7, r3: -3, r4: 4 },
 draw: R => retry(() => ({ c: R.pick([12, 24]), r1: R.int(-6, 9), r2: R.int(-6, 9), r3: R.int(-6, 9), r4: R.int(-6, 9) }),
  p => new Set([p.r1, p.r2, p.r3, p.r4]).size === 4, { c: 12, r1: 2, r2: 7, r3: -3, r4: 4 }),
 build: ({ c, r1, r2, r3, r4 }) => { const f = [r1 + c, r2 + c / 2, r3 + c / 3, r4 + c / 4], hi = Math.max(r1, r2, r3, r4), lo = Math.min(r1, r2, r3, r4), sup = Math.max(...f); return {
  prompt: `A rotating beacon steps through four brightness levels as it cools: its nth sample is xₙ = rₙ + ${n(c)} ÷ n, where rₙ is ${n(r1)} when n = 1, 5, 9, …, then ${n(r2)} when n = 2, 6, 10, …, then ${n(r3)} when n = 3, 7, 11, …, and ${n(r4)} when n = 4, 8, 12, …. Enter the supremum of the set of all the samples, then limsup xₙ, then liminf xₙ.`,
  answer: [sup, hi, lo],
  hints: ['Split the samples into subsequences that each settle on one value. The limsup is the largest of these limits and the liminf the smallest.', 'The supremum of all the samples looks at every term, early ones included; the limsup looks only at the far tail. The part c ÷ n falls as n grows, so the largest term of each subsequence is its first.'],
  solution: `The four subsequences n = 1, 5, 9, …; n = 2, 6, 10, …; n = 3, 7, 11, …; and n = 4, 8, 12, … are ${lev(r1, c)}, ${lev(r2, c)}, ${lev(r3, c)} and ${lev(r4, c)}, falling towards ${n(r1)}, ${n(r2)}, ${n(r3)} and ${n(r4)}. Every tail contains terms of all four, so the sups of the tails tend to the largest of these limits and the infs to the smallest: limsup xₙ = ${n(hi)} and liminf xₙ = ${n(lo)}. The first terms are x₁ = ${n(f[0])}, x₂ = ${n(f[1])}, x₃ = ${n(f[2])} and x₄ = ${n(f[3])}, and each subsequence falls after its first term, so the supremum of all the samples is ${n(sup)}.`,
  guidance: [
   { prompt: `Each of the four subsequences settles on its level. What is the largest of the four limits?`, answer: [hi], explanation: `The limits are ${n(r1)}, ${n(r2)}, ${n(r3)} and ${n(r4)}; the largest is ${n(hi)}, so limsup xₙ = ${n(hi)}.` },
   { prompt: `What is the smallest of the four limits?`, answer: [lo], explanation: `The smallest is ${n(lo)}, so liminf xₙ = ${n(lo)}.` },
   { prompt: `What is the largest of all the samples, the supremum of the set?`, answer: [sup], explanation: `Each subsequence falls, so compare their first terms: x₁ = ${n(f[0])}, x₂ = ${n(f[1])}, x₃ = ${n(f[2])} and x₄ = ${n(f[3])}. The largest is ${n(sup)}.` }
  ] }; }
});

/* xₙ = a + b(−1)ⁿ + c ÷ n with b >= 2 and c from 4 to 12. The tail from sample N has supremum max(x_N, x_(N+1)), which is the first even-numbered
   sample in it, and exceeds limsup = a + b by c ÷ (that even index). With ε = e/100, E is the smallest even number with e·E > 100c
   (a tie, where 100c ÷ e is an even whole number, is never drawn) and N = E − 1, which is odd, because the tail from E − 1 already starts
   with E. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The falling high mark',
 brief: 'A fuel-line gauge swings between two levels, and the certificate must say from which sample its high mark has come down close to its long-run level.',
 labels: ['limsup', 'liminf', 'smallest N'], tolerance: 0.01,
 gl: [['limsup'], ['first even sample number'], ['smallest N']]
}, {
 canonical: { a: 4, b: 3, c: 8, e: 20 },
 draw: R => retry(() => ({ a: R.int(-5, 8), b: R.int(2, 6), c: R.pick([4, 6, 8, 10, 12]), e: R.pick([5, 8, 10, 12, 15, 20, 25, 40, 50]) }),
  p => !((100 * p.c) % p.e === 0 && (100 * p.c / p.e) % 2 === 0), { a: 4, b: 3, c: 8, e: 20 }),
 build: ({ a, b, c, e }) => { const eps = e / 100, hi = a + b, lo = a - b; let E = 2; while (e * E <= 100 * c) E += 2; const N = E - 1, T = dots(100 * c, e); return {
  prompt: `A gauge on the fuel line swings as it settles: its nth sample is xₙ = ${a === 0 ? '' : n(a) + ' + '}${n(b)}(−1)ⁿ + ${n(c)} ÷ n. The tail from sample N is the list of samples from sample N on (sample N, sample N + 1, sample N + 2, …), and the high mark of that tail is its supremum. The lab wants the high mark of the tail to be less than ε = ${n(eps)} above limsup xₙ. Enter limsup xₙ, then liminf xₙ, then the smallest N for which the high mark of the tail from sample N is less than ${n(eps)} above limsup xₙ (type it without commas).`,
  answer: [hi, lo, N],
  hints: ['Split the samples into the even-numbered and the odd-numbered ones. The limsup is the larger of their limits and the liminf the smaller.', 'The high mark of a tail comes from its even-numbered samples, which fall towards limsup xₙ: the first even-numbered sample in the tail is its largest. The tail from sample N begins at N, so ask which sample is the first even one in it, for each N.'],
  solution: `For even n, xₙ = ${n(hi)} + ${n(c)} ÷ n, falling towards ${n(hi)}; for odd n, xₙ = ${n(lo)} + ${n(c)} ÷ n, falling towards ${n(lo)}. So limsup xₙ = ${n(hi)} and liminf xₙ = ${n(lo)}. The even-numbered samples lie above the odd-numbered ones, so the high mark of a tail is its first even-numbered sample, and it is ${n(c)} ÷ n above ${n(hi)} when that sample is number n. We need ${n(c)} ÷ n < ${n(eps)}, that is n > ${T}, with n even: the first such even number is ${n(E)}. The tail from sample ${n(E - 1)} starts with the odd sample ${n(E - 1)} and then has the even sample ${n(E)}, so its high mark is x${E} (that is, ${n(c)} ÷ ${n(E)} above ${n(hi)}) and the condition holds. The tail from sample ${n(E - 2)} starts with the even sample ${n(E - 2)}, whose excess ${n(c)} ÷ ${n(E - 2)} is not below ${n(eps)}. So N = ${n(N)}.`.replace(`x${E}`, `sample ${E}`),
  guidance: [
   { prompt: `What is the limit of the even-numbered samples, which is limsup xₙ?`, answer: [hi], explanation: `For even n, xₙ = ${n(a)} + ${n(b)} + ${n(c)} ÷ n tends to ${n(hi)}, the larger of the two subsequence limits.` },
   { prompt: `An even-numbered sample number E has excess ${n(c)} ÷ E above ${n(hi)}. What is the smallest even number E with ${n(c)} ÷ E < ${n(eps)}? (E must be greater than ${T})`, answer: [E], explanation: `E must be even and greater than ${T}. The first such even number is ${n(E)}.` },
   { prompt: `The high mark of the tail from sample N is its first even-numbered sample. For which smallest N is that first even sample number ${n(E)}?`, answer: [N], explanation: `The tail from sample ${n(E - 1)} contains the even sample ${n(E)} as its first even one. The tail from sample ${n(E - 2)} starts with the even sample ${n(E - 2)}, which is too high. So N = ${n(N)}.` }
  ] }; }
});

/* xₙ = a + b(−1)ⁿ + k sin(n) ÷ nᵖ (n in radians), p = 1 or 2: limsup a + b, liminf a − b (the sin term tends to 0 by the squeeze lemma).
   ε = e/1000 with e dividing 1000, so Q = k ÷ ε is whole; N is the first n with nᵖ > Q. Combines q09 (squeeze). */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'The drum sensor',
 brief: 'A drum sensor swings between two levels while a noise term dies away, and the log needs both levels and the sample from which the noise is certified small.',
 labels: ['limsup', 'liminf', 'smallest N'], tolerance: 0.01,
 gl: [['limsup'], ['liminf'], ['smallest N']]
}, {
 canonical: { a: 3, b: 4, k: 6, p: 1, e: 25 },
 draw: R => retry(() => ({ a: R.int(-6, 8), b: R.int(2, 7), k: R.int(2, 9), p: R.pick([1, 2]), e: R.pick([10, 20, 25, 40, 50, 100, 200]) }), p => !(p.a === 0 && p.b === 1), { a: 3, b: 4, k: 6, p: 1, e: 25 }),
 build: ({ a, b, k, p, e }) => { const eps = e / 1000, Q = 1000 * k / e, hi = a + b, lo = a - b, pw = p === 1 ? 'n' : 'n²', pow = m => p === 1 ? m : m * m; let N = 1; while (pow(N) <= Q) N++;
  const last = p === 1 ? `n must be greater than ${n(Q)}: at n = ${n(Q)} the bound equals ε rather than being below it. So N = ${n(N)}.` : `${n(N - 1)}² = ${n(pow(N - 1))} is not above ${n(Q)}, but ${n(N)}² = ${n(pow(N))} is. So N = ${n(N)}.`; return {
  prompt: `A drum sensor swings as a noise term dies away: its nth sample is xₙ = ${n(a)} + ${n(b)}(−1)ⁿ + ${n(k)} sin(n) ÷ ${pw}, with n read in radians. Enter limsup xₙ, then liminf xₙ, then the smallest N for which the noise bound ${n(k)} ÷ ${pw}, the largest the noise term can be in size, is below ε = ${n(eps)} at n = N (and so for every n ≥ N). Type N without commas.`,
  answer: [hi, lo, N],
  hints: ['The noise term sin(n) is trapped between −1 and 1, so the squeeze lemma says the term with sin(n) on top tends to 0. What is left is the even-numbered and odd-numbered subsequences of the swing part, which each settle.', 'The noise bound is the size of the noise term with |sin(n)| replaced by 1. Find the first n where it is strictly below ε.'],
  solution: `Since −1 ≤ sin(n) ≤ 1, the noise term ${n(k)} sin(n) ÷ ${pw} is trapped between −${n(k)} ÷ ${pw} and ${n(k)} ÷ ${pw}, which both tend to 0, so the squeeze lemma makes it tend to 0. For even n, xₙ tends to ${n(a)} + ${n(b)} = ${n(hi)}; for odd n, it tends to ${n(a)} − ${n(b)} = ${n(lo)}. So limsup xₙ = ${n(hi)} and liminf xₙ = ${n(lo)}. The noise bound is below ${n(eps)} when ${pw} > ${n(k)} ÷ ${n(eps)} = ${n(Q)}. ${last}`,
  guidance: [
   { prompt: `The noise term tends to 0 by the squeeze lemma. What is the limit of the even-numbered samples, which is limsup xₙ?`, answer: [hi], explanation: `For even n, xₙ = ${n(a)} + ${n(b)} + noise, which tends to ${n(hi)}.` },
   { prompt: `What is the limit of the odd-numbered samples, which is liminf xₙ?`, answer: [lo], explanation: `For odd n, xₙ = ${n(a)} − ${n(b)} + noise, which tends to ${n(lo)}.` },
   { prompt: `${n(k)} ÷ ${pw} < ${n(eps)} is the same as ${pw} > ${n(k)} ÷ ${n(eps)} = ${n(Q)}. What is the smallest whole number N with ${p === 1 ? 'N' : 'N²'} > ${n(Q)}?`, answer: [N], explanation: last }
  ] }; }
});

})();
