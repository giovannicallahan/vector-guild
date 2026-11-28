/* Discrete mathematics practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p7.js. */
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
const sup = k => String(k).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
const sub = k => String(k).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
const C = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
/* A coefficient written before a symbol: 1 is left out, −1 is a bare minus sign. */
const cf = (c, s) => c === 1 ? s : c === -1 ? '−' + s : n(c) + s;
const pl = (c, w) => `${n(c)} ${w}${c === 1 ? '' : 's'}`;
const WORD = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven' };
const WORDS = { 1: 'ones', 2: 'twos', 3: 'threes', 4: 'fours', 5: 'fives', 6: 'sixes', 7: 'sevens' };

/* ---- q31 helpers: aₙ = c1·aₙ₋₁ + c2·aₙ₋₂ with roots p > q, aₙ = A·pⁿ + B·qⁿ ---- */
const rec = (c1, c2) => `aₙ = ${cf(c1, 'aₙ₋₁')} ${c2 < 0 ? '−' : '+'} ${cf(Math.abs(c2), 'aₙ₋₂')}`;
const rhsOf = (c1, c2) => `${cf(c1, 'x')} ${c2 < 0 ? '−' : '+'} ${n(Math.abs(c2))}`;
const charEq = (c1, c2) => `x² ${c1 > 0 ? '−' : '+'} ${cf(Math.abs(c1), 'x')} ${c2 > 0 ? '−' : '+'} ${n(Math.abs(c2))} = 0`;
const factor = (p, q) => { const f = r => r < 0 ? `(x + ${n(-r)})` : `(x − ${n(r)})`; return f(p) + f(q); };
const eqAB = (p, q, a0, a1) => `A + B = ${n(a0)} and ${cf(p, 'A')} ${q < 0 ? '−' : '+'} ${cf(Math.abs(q), 'B')} = ${n(a1)}`;
const elimAB = (p, q, A, B) => { const a0 = A + B, a1 = p * A + q * B, d = p - q;
 return `Multiply the first equation by ${n(q)} and subtract it from the second: ${cf(d, 'A')} = ${n(a1)} − ${par(q)} × ${par(a0)} = ${n(a1 - q * a0)}${d === 1 ? '' : `, so A = ${n(A)}`}. Then B = ${n(a0)} − ${par(A)} = ${n(B)}.`; };
const closedOf = (A, B, p, q) => `aₙ = ${n(A)} × ${par(p)}ⁿ ${B < 0 ? '−' : '+'} ${n(Math.abs(B))} × ${par(q)}ⁿ`;
const finalOf = (A, B, p, q, N) => `a${sub(N)} = ${n(A)} × ${par(p)}${sup(N)} ${B < 0 ? '−' : '+'} ${n(Math.abs(B))} × ${par(q)}${sup(N)} = ${n(A)} × ${par(Math.pow(p, N))} ${B < 0 ? '−' : '+'} ${n(Math.abs(B))} × ${par(Math.pow(q, N))} = ${n(A * Math.pow(p, N) + B * Math.pow(q, N))}`;
/* Two different roots p > q from list whose sum is not 0, so that neither coefficient of the rule is 0. */
const rootPair = (R, list) => { let p, q; do { p = R.pick(list); q = R.pick(list); } while (p <= q || p + q === 0); return [p, q]; };
const HINT_CHAR = 'Write x² for aₙ, x for aₙ₋₁ and 1 for aₙ₋₂, then move every term to one side. The quadratic you get factors into two brackets, and each bracket gives a root.';

/* ---- q31 The characteristic root technique [Levin 2.4] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The recycler pressure log',
 brief: 'The water recycler logs its pressure once a cycle, and Mira wants a reading far down the log without stepping through every cycle.',
 labels: ['larger root', 'smaller root', 'A', 'a₇'], tolerance: 0.01,
 gl: [['larger root', 'smaller root'], ['A', 'B'], ['a₇']]
}, {
 canonical: { p: 3, q: -1, A: 2, B: 1 },
 draw: R => { let x; do { const [p, q] = rootPair(R, [-3, -2, -1, 1, 2, 3]); x = { p, q, A: R.int(1, 4), B: R.int(1, 4) }; }
  while ((x.p === 3 && x.q === -1 && x.A === 2 && x.B === 1) || (x.p === 3 && x.q === -2 && x.A === 1 && x.B === 1)); return x; },
 build: ({ p, q, A, B }) => { const c1 = p + q, c2 = -p * q, a0 = A + B, a1 = p * A + q * B, N = 7, aN = A * Math.pow(p, N) + B * Math.pow(q, N); return {
  prompt: `The water recycler at the Tiling Works logs its pressure once every cycle, and the reading of cycle n follows ${rec(c1, c2)}, with a₀ = ${n(a0)} and a₁ = ${n(a1)}. Its characteristic equation has two whole-number roots r (the larger) and s (the smaller), and the closed formula is aₙ = A × rⁿ + B × sⁿ. Enter r, then s, then the number A, then the reading a₇ of cycle 7 (type it without commas).`,
  answer: [p, q, A, aN],
  hints: [HINT_CHAR, 'Put n = 0 and n = 1 into aₙ = A × rⁿ + B × sⁿ. That gives two equations in A and B, and they must match a₀ and a₁. Then put n = 7 into the formula.'],
  solution: `The characteristic equation is x² = ${rhsOf(c1, c2)}, that is ${charEq(c1, c2)}, which factors as ${factor(p, q)} = 0. So r = ${n(p)} and s = ${n(q)}, and aₙ = A × ${par(p)}ⁿ + B × ${par(q)}ⁿ. At n = 0 and n = 1 the formula gives ${eqAB(p, q, a0, a1)}. ${elimAB(p, q, A, B)} So ${closedOf(A, B, p, q)}, and ${finalOf(A, B, p, q, N)}.`,
  guidance: [
   { prompt: `The characteristic equation of ${rec(c1, c2)} is ${charEq(c1, c2)}. Factor it. What are its two roots, larger first?`, answer: [p, q], explanation: `${charEq(c1, c2)} factors as ${factor(p, q)} = 0, so the roots are ${n(p)} and ${n(q)}.` },
   { prompt: `So aₙ = A × ${par(p)}ⁿ + B × ${par(q)}ⁿ. Putting in n = 0 and n = 1 gives ${eqAB(p, q, a0, a1)}. What are A and B?`, answer: [A, B], explanation: elimAB(p, q, A, B) },
   { prompt: `Now ${closedOf(A, B, p, q)}. What is a₇? Use ${par(p)}⁷ = ${n(Math.pow(p, 7))} and ${par(q)}⁷ = ${n(Math.pow(q, 7))}.`, answer: [aN], explanation: `${finalOf(A, B, p, q, N)}.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The reservoir forecast',
 brief: 'The reservoir level follows a two-week rule, and Mira needs the level at the start of week 6 before the dry spell.',
 labels: ['A', 'B', 'a₆'], tolerance: 0.01,
 gl: [['A', 'B'], ['larger root to the sixth', 'smaller root to the sixth'], ['a₆']]
}, {
 canonical: { p: 3, q: 2, A: 2, B: 1 },
 draw: R => { let x; do { const p = R.int(2, 4), q = R.int(1, p - 1); x = { p, q, A: R.int(1, 3), B: R.int(1, 3) }; } while (x.p === 3 && x.q === 2 && x.A === 2 && x.B === 1); return x; },
 build: ({ p, q, A, B }) => { const c1 = p + q, c2 = -p * q, a0 = A + B, a1 = p * A + q * B, N = 6, pN = Math.pow(p, N), qN = Math.pow(q, N), aN = A * pN + B * qN; return {
  prompt: `The reservoir at the Tiling Works holds aₙ kilolitres at the start of week n. Each week's level follows ${rec(c1, c2)}, starting from a₀ = ${n(a0)} and a₁ = ${n(a1)}. The characteristic roots are ${n(p)} and ${n(q)}, so aₙ = A × ${n(p)}ⁿ + B × ${n(q)}ⁿ. Enter the numbers A and B, then the level a₆ at the start of week 6 (type it without commas).`,
  answer: [A, B, aN],
  hints: ['Put n = 0 and n = 1 into the closed formula. Every power at n = 0 is 1, so the first equation is a sum. The two equations must match a₀ and a₁.', `Once A and B are known, put n = 6 into aₙ = A × ${n(p)}ⁿ + B × ${n(q)}ⁿ. Work out each power first.`],
  solution: `At n = 0 and n = 1 the formula gives ${eqAB(p, q, a0, a1)}. ${elimAB(p, q, A, B)} So ${closedOf(A, B, p, q)}, and ${finalOf(A, B, p, q, N)} kilolitres.`,
  guidance: [
   { prompt: `Putting n = 0 and n = 1 into aₙ = A × ${n(p)}ⁿ + B × ${n(q)}ⁿ gives ${eqAB(p, q, a0, a1)}. What are A and B?`, answer: [A, B], explanation: elimAB(p, q, A, B) },
   { prompt: `Now aₙ = ${n(A)} × ${n(p)}ⁿ + ${n(B)} × ${n(q)}ⁿ. What are ${n(p)}⁶ and ${n(q)}⁶?`, answer: [pN, qN], explanation: `${n(p)}⁶ = ${n(pN)} and ${n(q)}⁶ = ${n(qN)}.` },
   { prompt: `Put those powers into the formula. What is a₆?`, answer: [aN], explanation: `${finalOf(A, B, p, q, N)}.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q26', title: 'The six-term forecast card',
 brief: 'The forecast card needs the total of its first six readings, and adding them one by one is how mistakes creep in.',
 labels: ['larger root', 'smaller root', 'total of a₀ to a₅'], tolerance: 0.01,
 gl: [['larger root', 'smaller root'], ['A', 'B'], ['sum of the A-part', 'sum of the B-part'], ['total of a₀ to a₅']]
}, {
 canonical: { p: 4, q: -1, A: 2, B: -3 },
 draw: R => { let x; do { const [p, q] = rootPair(R, [-3, -2, -1, 2, 3, 4]); x = { p, q, A: R.pick([-3, -2, -1, 1, 2, 3]), B: R.pick([-3, -2, -1, 1, 2, 3]) }; }
  while (x.p === 4 && x.q === -1 && x.A === 2 && x.B === -3); return x; },
 build: ({ p, q, A, B }) => { const c1 = p + q, c2 = -p * q, a0 = A + B, a1 = p * A + q * B, gP = (Math.pow(p, 6) - 1) / (p - 1), gQ = (Math.pow(q, 6) - 1) / (q - 1), SA = A * gP, SB = B * gQ, S = SA + SB; return {
  prompt: `A forecast card at the Tiling Works follows ${rec(c1, c2)}, with a₀ = ${n(a0)} and a₁ = ${n(a1)}. Its characteristic equation has two whole-number roots, and neither is 1. Find the closed formula, then add up the first six readings: a₀ + a₁ + a₂ + a₃ + a₄ + a₅. Enter the larger root, the smaller root, then that total (type it without commas).`,
  answer: [p, q, S],
  hints: [HINT_CHAR + ' Then use n = 0 and n = 1 to find A and B in aₙ = A × rⁿ + B × sⁿ.', 'Each part of the closed formula, A × rⁿ and B × sⁿ, is a geometric sequence. A geometric sum is first term × (ratioⁿ − 1) ÷ (ratio − 1), with n the number of terms. Find the sum of each part, then add the two sums.'],
  solution: `The characteristic equation is x² = ${rhsOf(c1, c2)}, that is ${charEq(c1, c2)}, which factors as ${factor(p, q)} = 0. The roots are ${n(p)} and ${n(q)}. At n = 0 and n = 1 the formula gives ${eqAB(p, q, a0, a1)}. ${elimAB(p, q, A, B)} So ${closedOf(A, B, p, q)}. The A-part is a geometric sequence with first term ${n(A)} and ratio ${n(p)}, so its first six terms sum to ${n(A)} × (${n(Math.pow(p, 6))} − 1) ÷ (${par(p)} − 1) = ${n(A)} × ${n(gP)} = ${n(SA)}. The B-part has first term ${n(B)} and ratio ${n(q)}: ${n(B)} × (${n(Math.pow(q, 6))} − 1) ÷ (${par(q)} − 1) = ${n(B)} × ${n(gQ)} = ${n(SB)}. The total is ${n(SA)} + ${par(SB)} = ${n(S)}.`,
  guidance: [
   { prompt: `The characteristic equation of ${rec(c1, c2)} is ${charEq(c1, c2)}. Factor it. What are its two roots, larger first?`, answer: [p, q], explanation: `${charEq(c1, c2)} factors as ${factor(p, q)} = 0, so the roots are ${n(p)} and ${n(q)}.` },
   { prompt: `So aₙ = A × ${par(p)}ⁿ + B × ${par(q)}ⁿ. Putting in n = 0 and n = 1 gives ${eqAB(p, q, a0, a1)}. What are A and B?`, answer: [A, B], explanation: elimAB(p, q, A, B) },
   { prompt: `The A-part ${n(A)} × ${par(p)}ⁿ is a geometric sequence with first term ${n(A)} and ratio ${n(p)}. The B-part ${n(B)} × ${par(q)}ⁿ has first term ${n(B)} and ratio ${n(q)}. What does each part sum to over its first six terms?`, answer: [SA, SB], explanation: `A-part: ${n(A)} × (${n(Math.pow(p, 6))} − 1) ÷ (${par(p)} − 1) = ${n(A)} × ${n(gP)} = ${n(SA)}. B-part: ${n(B)} × (${n(Math.pow(q, 6))} − 1) ÷ (${par(q)} − 1) = ${n(B)} × ${n(gQ)} = ${n(SB)}.` },
   { prompt: `The six readings are the A-part terms plus the B-part terms. What is their total?`, answer: [S], explanation: `${n(SA)} + ${par(SB)} = ${n(S)}.` }
  ] }; }
});

/* ---- q32 Counting with recurrences: tilings and spaced-out bit strings [Levin 2.4] ---- */

/* tₖ-style counts: strips (or ramps) of length 0..len covered by 1-long pieces and k-long pieces. */
const tilesOf = (k, len) => { const t = []; for (let i = 0; i <= len; i++) t.push(i < k ? 1 : t[i - 1] + t[i - k]); return t; };
/* Rows of m lamps with no two neighbours both on: l₁ = 2, l₂ = 3, then add the two before. */
const lampsOf = m => { const b = [0, 2, 3]; for (let i = 3; i <= m; i++) b.push(b[i - 1] + b[i - 2]); return b; };

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The ramp and the lamp row',
 brief: 'The depot ramp is climbed by strides of two sizes, and the lamp row beside it may never have two neighbours lit together.',
 labels: ['ways to climb the ramp', 'good lamp rows'], tolerance: 0.01,
 gl: [['first new count', 'second new count', 'third new count'], ['ways to climb the ramp'], ['good lamp rows']]
}, {
 canonical: { len: 8, k: 3, m: 7 },
 draw: R => { let x; do { x = { len: R.int(7, 12), k: R.pick([2, 3]), m: R.int(5, 9) }; } while (x.len === 9 && x.k === 2 && x.m === 6); return x; },
 build: ({ len, k, m }) => { const t = tilesOf(k, len), b = lampsOf(m), r = `cₙ = cₙ₋₁ + cₙ₋${sub(k)}`, start = k === 2 ? 'c₀ = 1 (stay where you are) and c₁ = 1' : 'c₀ = 1 (stay where you are), c₁ = 1 and c₂ = 1'; return {
  prompt: `The ramp at the Tiling Works depot has ${n(len)} steps. A climber takes each stride as 1 step or as ${n(k)} steps, and must end exactly on the top step. Enter the number of different ways to climb the ramp. Then enter the number of ways to set a row of ${n(m)} lamps, each on or off, so that no two lamps next to each other are both on.`,
  answer: [t[len], b[m]],
  hints: [`Look at the last stride: it is 1 step or ${n(k)} steps, and taking it away leaves a shorter ramp. So ${r}, where cₙ counts the ways to climb n steps.`, 'Look at the last lamp. If it is off, the lamps before it can be any good row one shorter. If it is on, the lamp before it must be off, and the lamps before that can be any good row two shorter.'],
  solution: `Let cₙ be the number of ways to climb n steps. The last stride is 1 step or ${n(k)} steps, so ${r}. Starting from ${start}, the counts for 0 to ${n(len)} steps are ${t.join(', ')}, so there are ${n(t[len])} ways to climb the ramp. For the lamps, a good row ends with a lamp off (any good row one shorter before it) or with a lamp on after an off lamp (any good row two shorter before that), so lₘ = lₘ₋₁ + lₘ₋₂ with l₁ = 2 and l₂ = 3. The counts for 1 to ${n(m)} lamps are ${b.slice(1, m + 1).join(', ')}, so there are ${n(b[m])} good rows.`,
  guidance: [
   { prompt: `Count short ramps first. A ramp shorter than ${n(k)} steps can only be climbed in 1-step strides, so ${start}; after that ${r}. What are c${sub(k)}, c${sub(k + 1)} and c${sub(k + 2)}?`, answer: [t[k], t[k + 1], t[k + 2]], explanation: `c${sub(k)} = ${t[k - 1]} + ${t[0]} = ${t[k]}, c${sub(k + 1)} = ${t[k]} + ${t[1]} = ${t[k + 1]} and c${sub(k + 2)} = ${t[k + 1]} + ${t[2]} = ${t[k + 2]}.` },
   { prompt: `Keep adding with ${r}. What is c${sub(len)}, the number of ways to climb ${n(len)} steps?`, answer: [t[len]], explanation: `The counts for 0 to ${n(len)} steps are ${t.join(', ')}. Each is the one before it plus the one ${n(k)} places before it.` },
   { prompt: `For the lamp rows, l₁ = 2 (off or on), l₂ = 3 (off-off, off-on, on-off) and lₘ = lₘ₋₁ + lₘ₋₂. What is l${sub(m)}?`, answer: [b[m]], explanation: `The counts for 1 to ${n(m)} lamps are ${b.slice(1, m + 1).join(', ')}: each is the sum of the two before it.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'The strip with a fixed hatch plate',
 brief: 'A service strip has one hatch plate that cannot move, and the crew wants to know how many tile patterns remain for the two parts either side of it.',
 labels: ['ways to tile the part before the plate', 'ways to tile the part after the plate', 'ways to tile the whole strip'], tolerance: 0.01,
 gl: [['ways to tile the part before the plate'], ['ways to tile the part after the plate'], ['ways to tile the whole strip']]
}, {
 canonical: { a: 5, b: 7 },
 draw: R => { let x; do { x = { a: R.int(3, 9), b: R.int(3, 9) }; } while (x.a === 5 && x.b === 7); return x; },
 build: ({ a, b }) => { const t = tilesOf(2, Math.max(a, b)), ta = t[a], tb = t[b], prod = ta * tb; return {
  prompt: `A service strip at the Tiling Works has a fixed hatch plate in it that cannot move. The part before the plate is ${n(a)} units long and the part after it is ${n(b)} units long. Each part is covered end to end with tiles 1 unit long and tiles 2 units long, and no tile crosses the plate. Enter the number of ways to tile the part before the plate, then the part after it, then the number of ways to tile the whole strip (type it without commas).`,
  answer: [ta, tb, prod],
  hints: ['Each part is a strip of its own. Look at its last tile, which is 1 long or 2 long, and build the counts up from the shortest strips.', 'Every tiling of the first part can go with every tiling of the second part, because the plate keeps them apart. So the count for the whole strip is a product.'],
  solution: `Let tₙ be the number of tilings of a strip n long. Its last tile is 1 long or 2 long, so tₙ = tₙ₋₁ + tₙ₋₂, with t₀ = 1 and t₁ = 1. The counts for lengths 0 to ${n(Math.max(a, b))} are ${t.slice(0, Math.max(a, b) + 1).join(', ')}. So the part before the plate has t${sub(a)} = ${n(ta)} tilings and the part after it has t${sub(b)} = ${n(tb)}. Each tiling of one part goes with each tiling of the other, so the whole strip has ${n(ta)} × ${n(tb)} = ${n(prod)} tilings.`,
  guidance: [
   { prompt: `Count the tilings of the part before the plate, ${n(a)} units long. Start with t₀ = 1 and t₁ = 1, and use tₙ = tₙ₋₁ + tₙ₋₂. What is t${sub(a)}?`, answer: [ta], explanation: `The counts for lengths 0 to ${n(a)} are ${t.slice(0, a + 1).join(', ')}, so t${sub(a)} = ${n(ta)}.` },
   { prompt: `Now the part after the plate, ${n(b)} units long. What is t${sub(b)}?`, answer: [tb], explanation: `The counts for lengths 0 to ${n(b)} are ${t.slice(0, b + 1).join(', ')}, so t${sub(b)} = ${n(tb)}.` },
   { prompt: `Each tiling of the first part goes with each tiling of the second. How many tilings does the whole strip have?`, answer: [prod], explanation: `${n(ta)} × ${n(tb)} = ${n(prod)}.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q15', title: 'Tilings with a set number of long tiles',
 brief: 'The Tiling Works wants the patterns that use a fixed number of the long tiles, to compare with the count of every pattern.',
 labels: ['tiles used', 'tilings with exactly that many long tiles', 'all tilings'], tolerance: 0.01,
 gl: [['tiles used'], ['tilings with exactly that many long tiles'], ['all tilings']]
}, {
 canonical: { len: 11, j: 3 },
 draw: R => { let x; do { x = { len: R.int(10, 13), j: R.int(2, 4) }; } while (x.len === 11 && x.j === 3); return x; },
 build: ({ len, j }) => { const t = tilesOf(2, len), tiles = len - j, ways = C(tiles, j); return {
  prompt: `A strip ${n(len)} units long at the Tiling Works is covered end to end with tiles 1 unit long and tiles 2 units long. Enter the number of tiles used by a tiling that has exactly ${n(j)} tiles of length 2. Then enter how many different tilings of the strip have exactly ${n(j)} tiles of length 2. Then enter the number of tilings of the strip with any mix of the two sizes (type it without commas).`,
  answer: [tiles, ways, t[len]],
  hints: [`The tiles must add up to the length of the strip. Each 2-long tile covers 2 units and each 1-long tile covers 1, so a tiling with exactly ${n(j)} tiles of length 2 uses a fixed number of 1-long tiles, and so a fixed number of tiles in all.`, 'Such a tiling is a row of tiles. It is fixed once you say which places in the row are the 2-long tiles, and that is a choice of some places from the row, a binomial coefficient. For all tilings, use the last-tile rule.'],
  solution: `The ${n(j)} long tiles cover ${n(2 * j)} units, so ${n(len - 2 * j)} units are covered by 1-long tiles, which makes ${n(len - 2 * j)} short tiles. In all that is ${n(len - 2 * j)} + ${n(j)} = ${n(tiles)} tiles. A tiling is fixed by which ${n(j)} of the ${n(tiles)} places hold the 2-long tiles, so there are C(${n(tiles)}, ${n(j)}) = ${n(ways)} of them. For all tilings, tₙ = tₙ₋₁ + tₙ₋₂ with t₀ = 1 and t₁ = 1 gives ${t.join(', ')} for lengths 0 to ${n(len)}, so there are ${n(t[len])} tilings.`,
  guidance: [
   { prompt: `The ${n(j)} tiles of length 2 cover ${n(2 * j)} units. The rest of the ${n(len)}-unit strip is covered by 1-long tiles. How many tiles does the tiling use in all?`, answer: [tiles], explanation: `${n(len)} − ${n(2 * j)} = ${n(len - 2 * j)} units of 1-long tiles, so ${n(len - 2 * j)} + ${n(j)} = ${n(tiles)} tiles.` },
   { prompt: `The tiling is a row of ${n(tiles)} tiles. Choose which ${n(j)} places hold the 2-long tiles. How many tilings is that, C(${n(tiles)}, ${n(j)})?`, answer: [ways], explanation: `C(${n(tiles)}, ${n(j)}) = ${n(ways)}.` },
   { prompt: `Now allow any mix of the two sizes. With t₀ = 1, t₁ = 1 and tₙ = tₙ₋₁ + tₙ₋₂, what is t${sub(len)}?`, answer: [t[len]], explanation: `The counts for lengths 0 to ${n(len)} are ${t.join(', ')}.` }
  ] }; }
});

/* ---- q33 Generating functions: reading off a coefficient [Levin 5.1] ---- */

const xp = e => e === 0 ? '1' : e === 1 ? 'x' : 'x' + sup(e);
/* The bracket for cnt alike items of value v: (1 + xᵛ + x²ᵛ + … + xᶜⁿᵗᵛ). */
const bracket = (v, cnt) => '(' + Array.from({ length: cnt + 1 }, (_, i) => xp(v * i)).join(' + ') + ')';
/* Every choice (counts of each kind, kinds in the order given) with total value k. */
const combos = (kinds, k) => { const out = [];
 const go = (i, rest, acc) => { if (i === kinds.length) { if (rest === 0) out.push(acc); return; }
  for (let c = 0; c <= kinds[i].cnt && c * kinds[i].v <= rest; c++) go(i + 1, rest - c * kinds[i].v, [...acc, c]); };
 go(0, k, []); return out; };
const tup = c => `(${c.join(', ')})`;
const waysOf = c => `${c} way${c === 1 ? '' : 's'}`;

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'Washers at the stores hatch',
 brief: 'The stores hatch takes only exact payment in washers, and Oskar wants to know how many handfuls pay one price.',
 labels: ['value at x = 1', 'coefficient of xᵏ'], tolerance: 0.01,
 gl: [['value at x = 1'], ['ways with none of the largest'], ['ways with one of the largest'], ['ways with two of the largest']]
}, {
 canonical: { a: 4, b: 2, c: 2, v: 3, w: 6, k: 13 },
 draw: R => { let x; for (;;) { x = { a: R.int(3, 5), b: R.int(2, 3), c: R.int(1, 2), v: R.pick([3, 4]), w: R.pick([6, 7]), k: 0 };
   x.k = R.int(8, 16); const cnt = combos([{ v: x.w, cnt: x.c }, { v: x.v, cnt: x.b }, { v: 1, cnt: x.a }], x.k).length;
   if (cnt >= 2 && cnt <= 7 && !(x.a === 4 && x.b === 2 && x.c === 2 && x.v === 3 && x.w === 6 && x.k === 13)) return x; } },
 build: ({ a, b, c, v, w, k }) => { const kinds = [{ v: w, cnt: c }, { v, cnt: b }, { v: 1, cnt: a }], all = combos(kinds, k), coef = all.length, total = (a + 1) * (b + 1) * (c + 1);
  const gf = `${bracket(1, a)}${bracket(v, b)}${bracket(w, c)}`;
  const groups = Array.from({ length: c + 1 }, (_, f) => { const rest = k - w * f, list = all.filter(t => t[0] === f); return { f, rest, list }; });
  const head = f => f === 0 ? `With no ${WORD[w]}-credit washer` : `With ${f === 1 ? 'one' : 'two'} ${WORD[w]}-credit washer${f === 1 ? '' : 's'}`;
  const say = g => g.rest < 0 ? `${head(g.f)} the value is already over ${n(k)}: 0 ways.` : `${head(g.f)} the rest must make ${n(g.rest)}: ${g.list.length ? g.list.map(t => tup(t)).join(', ') + ', ' : ''}${waysOf(g.list.length)}.`;
  const why = g => g.rest < 0 ? `${n(k)} − ${n(w * g.f)} is below 0, so no choice works.` : g.list.length ? `Write a choice as (${WORDS[w]}, ${WORDS[v]}, ones). The ones must be from 0 to ${n(a)}: ${g.list.map(t => tup(t)).join(', ')}.` : `No number of ${WORD[v]}-credit washers leaves a number of one-credit washers from 0 to ${n(a)}.`;
  return {
  prompt: `Oskar's stores hatch at the Tiling Works takes only exact payment in washers. He holds ${pl(a, 'one-credit washer')}, ${pl(b, WORD[v] + '-credit washer')} and ${pl(c, WORD[w] + '-credit washer')}. Washers of the same value are alike. The generating function for paying with them is ${gf}. Enter the value of the product at x = 1. Then enter the coefficient of x${sup(k)}: the number of ways to pay exactly ${n(k)} credits.`,
  answer: [total, coef],
  hints: ['At x = 1 every power of x is 1, so each bracket becomes its number of terms. Each bracket lists the choices for one kind of washer as powers of x, and the powers add up to the value paid.', `Sort the picks by the number of ${WORD[w]}-credit washers: from none up to all of them. For each, try every number of ${WORD[v]}-credit washers and keep those that leave a number of one-credit washers Oskar really has.`],
  solution: `At x = 1 every power of x is 1, so each bracket becomes its number of terms: ${n(a + 1)} × ${n(b + 1)} × ${n(c + 1)} = ${n(total)}. For the coefficient, write a choice as (${WORDS[w]}, ${WORDS[v]}, ones). ${groups.map(say).join(' ')} In all ${groups.map(g => g.list.length).join(' + ')} = ${n(coef)}, so the coefficient of x${sup(k)} is ${n(coef)}.`,
  guidance: [
   { prompt: `Put x = 1 into ${gf}. What number do you get?`, answer: [total], explanation: `Every term becomes 1, so the brackets become ${n(a + 1)}, ${n(b + 1)} and ${n(c + 1)}, and ${n(a + 1)} × ${n(b + 1)} × ${n(c + 1)} = ${n(total)}.` },
   ...groups.map(g => ({ prompt: g.f === 0 ? `How many choices use no ${WORD[w]}-credit washer, so that the other washers make ${n(k)} by themselves?` : `How many choices use ${g.f === 1 ? 'exactly one' : 'both'} ${WORD[w]}-credit washer${g.f === 1 ? '' : 's'}? Then the other washers must make ${n(k)} − ${n(w * g.f)}.`, answer: [g.list.length], explanation: why(g) }))
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Two prices at the repair desk',
 brief: 'The repair desk accepts exact payment of either of two prices, and Mira wants every handful of tokens that would be accepted.',
 labels: ['handfuls that pay the first price', 'handfuls that pay the second price', 'handfuls accepted in all'], tolerance: 0.01,
 gl: [['handfuls that pay the first price'], ['handfuls that pay the second price'], ['handfuls accepted in all']]
}, {
 canonical: { a: 3, b: 2, c: 2, k1: 6, k2: 8 },
 draw: R => { let x; for (;;) { x = { a: R.int(2, 4), b: R.int(2, 3), c: R.int(1, 3), k1: R.int(4, 9), k2: 0 }; x.k2 = x.k1 + R.int(1, 3);
   const kinds = [{ v: 3, cnt: x.c }, { v: 2, cnt: x.b }, { v: 1, cnt: x.a }];
   if (combos(kinds, x.k1).length >= 1 && combos(kinds, x.k2).length >= 1 && !(x.a === 3 && x.b === 2 && x.c === 2 && x.k1 === 6 && x.k2 === 8)) return x; } },
 build: ({ a, b, c, k1, k2 }) => { const kinds = [{ v: 3, cnt: c }, { v: 2, cnt: b }, { v: 1, cnt: a }], l1 = combos(kinds, k1), l2 = combos(kinds, k2), gf = `${bracket(1, a)}${bracket(2, b)}${bracket(3, c)}`;
  const say = (l, k) => `For ${n(k)}: ${l.map(t => tup(t)).join(', ')}, ${waysOf(l.length)}.`;
  return {
  prompt: `Mira holds ${pl(a, 'one-credit token')}, ${pl(b, 'two-credit token')} and ${pl(c, 'three-credit token')}, and tokens of the same value are alike. The repair desk accepts exact payment of either ${n(k1)} credits or ${n(k2)} credits. The generating function for her tokens is ${gf}. Enter the number of different handfuls that pay exactly ${n(k1)}, then the number that pay exactly ${n(k2)}, then the number of handfuls the desk would accept.`,
  answer: [l1.length, l2.length, l1.length + l2.length],
  hints: ['A handful is a pick from each bracket, and the powers add up to the value paid. So the coefficient of xᵏ counts the handfuls worth exactly k credits. Sort the picks by the number of three-credit tokens, then try each number of two-credit tokens.', 'A handful has one total value, so it cannot pay both prices. The handfuls that pay the first price and the handfuls that pay the second price are separate groups, and the desk accepts both groups.'],
  solution: `Write a choice as (threes, twos, ones). ${say(l1, k1)} ${say(l2, k2)} A handful cannot be worth both ${n(k1)} and ${n(k2)}, so the two groups do not overlap and the desk accepts ${n(l1.length)} + ${n(l2.length)} = ${n(l1.length + l2.length)} handfuls.`,
  guidance: [
   { prompt: `How many handfuls pay exactly ${n(k1)}? Write each as (threes, twos, ones), with at most ${pl(c, 'three')}, ${pl(b, 'two')} and ${pl(a, 'one')}.`, answer: [l1.length], explanation: say(l1, k1) },
   { prompt: `How many handfuls pay exactly ${n(k2)}?`, answer: [l2.length], explanation: say(l2, k2) },
   { prompt: `A handful pays one price or the other, never both. How many handfuls does the desk accept?`, answer: [l1.length + l2.length], explanation: `${n(l1.length)} + ${n(l2.length)} = ${n(l1.length + l2.length)}: the two groups share no handful, so they add.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q16', title: 'Different tags and alike tokens',
 brief: 'The desk takes some tags that are all different and some tokens that are all alike, and Mira wants the handfuls for one price.',
 labels: ['coefficient of xᵏ', 'value at x = 1'], tolerance: 0.01,
 gl: [['ways with no two-credit token'], ['ways with one two-credit token'], ['ways with two two-credit tokens'], ['ways with three two-credit tokens'], ['value at x = 1']]
}, {
 canonical: { m: 6, c: 3, k: 7 },
 draw: R => { let x; do { const m = R.int(5, 8), c = R.int(2, 3); x = { m, c, k: R.int(4, m + 2 * c - 1) }; } while ((x.m === 6 && x.c === 3 && x.k === 7)); return x; },
 build: ({ m, c, k }) => { const ways = Array.from({ length: c + 1 }, (_, j) => C(m, k - 2 * j)), coef = ways.reduce((s, x) => s + x, 0), total = Math.pow(2, m) * (c + 1), gf = `(1 + x)${sup(m)}${bracket(2, c)}`;
  const nm = j => j === 0 ? 'no two-credit token' : j === 1 ? 'one two-credit token' : j === 2 ? 'two two-credit tokens' : 'three two-credit tokens';
  const sayJ = j => `With ${nm(j)} the tags must make ${n(k - 2 * j)}: ${k - 2 * j < 0 || k - 2 * j > m ? '0 ways, since a tag count must be from 0 to ' + n(m) : `C(${n(m)}, ${n(k - 2 * j)}) = ${n(ways[j])}`}.`;
  return {
  prompt: `Mira holds ${n(m)} one-credit tags, all different from one another, and ${n(c)} two-credit tokens that are all alike. The bracket (1 + x)${sup(m)} is for the tags: the coefficient of xʲ in it is the number of ways to pick j different tags. The generating function for handing over some of them is ${gf}. Enter the coefficient of x${sup(k)}: the number of different handfuls worth exactly ${n(k)} credits. Then enter the value of the product at x = 1 (type it without commas).`,
  answer: [coef, total],
  hints: ['In (1 + x)ᵐ the coefficient of xʲ is the binomial coefficient C(m, j), the number of ways to pick j of the m different tags. So the tags can make j credits in C(m, j) ways, and in 0 ways if j is below 0 or above m.', 'Sort the picks by the number of two-credit tokens used. For each, the tags must make up the rest of the value. Then, at x = 1, every power of x is 1 and each bracket becomes its number of terms; for (1 + x)ᵐ that is 2ᵐ.'],
  solution: `Sort by the number of two-credit tokens. ${ways.map((_, j) => sayJ(j)).join(' ')} In all ${ways.map(x => n(x)).join(' + ')} = ${n(coef)}, so the coefficient of x${sup(k)} is ${n(coef)}. At x = 1, (1 + 1)${sup(m)} = ${n(Math.pow(2, m))} and the other bracket has ${n(c + 1)} terms, so the product is ${n(Math.pow(2, m))} × ${n(c + 1)} = ${n(total)}.`,
  guidance: [
   ...ways.map((w, j) => ({ prompt: `How many handfuls use ${nm(j)}? The tags must then make ${j ? `${n(k)} − ${n(2 * j)}, which is ${n(k - 2 * j)}` : n(k)}.`, answer: [w], explanation: sayJ(j) })),
   { prompt: `Put x = 1 into ${gf}. What number do you get?`, answer: [total], explanation: `(1 + 1)${sup(m)} = ${n(Math.pow(2, m))}, and the other bracket has ${n(c + 1)} terms, so ${n(Math.pow(2, m))} × ${n(c + 1)} = ${n(total)}.` }
  ] }; }
});

/* ---- q34 Counting one thing two ways [Levin 1.4] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The lamp panel recount',
 brief: 'The control room checks how many ways its lamp panel can be set, by a second count that splits on the master lamp.',
 labels: ['patterns with the master lamp lit', 'patterns with it dark', 'all patterns'], tolerance: 0.01,
 gl: [['patterns with the master lamp lit'], ['patterns with it dark'], ['all patterns']]
}, {
 canonical: { n: 10, k: 3 },
 draw: R => { let x; do { const N = R.int(7, 12); x = { n: N, k: R.int(3, N - 2) }; } while (x.n === 10 && x.k === 3); return x; },
 build: ({ n: N, k }) => { const w = C(N - 1, k - 1), wo = C(N - 1, k), all = C(N, k); return {
  prompt: `The control room's lamp panel has ${n(N)} lamps, and a setting lights exactly ${n(k)} of them. Lamp 1 is the master lamp. Mira checks the number of settings by counting them two ways. Enter the number of settings with the master lamp lit, then the number with it dark, then the number of all settings counted directly as C(${n(N)}, ${n(k)}).`,
  answer: [w, wo, all],
  hints: ['If the master lamp is lit, it is one of the lit lamps, so only the other lit lamps are left to choose, from the other lamps.', 'If the master lamp is dark, all the lit lamps come from the other lamps. The two cases never overlap and between them cover every setting, so their counts add up to the direct count.'],
  solution: `Settings with the master lamp lit: it is one of the ${n(k)} lit lamps, and the other ${n(k - 1)} come from the other ${n(N - 1)} lamps, so there are C(${n(N - 1)}, ${n(k - 1)}) = ${n(w)}. Settings with it dark: all ${n(k)} lit lamps come from the other ${n(N - 1)}, so there are C(${n(N - 1)}, ${n(k)}) = ${n(wo)}. Directly, C(${n(N)}, ${n(k)}) = ${n(N)}! ÷ (${n(k)}! × ${n(N - k)}!) = ${n(all)}. Both ways count the same settings, and ${n(w)} + ${n(wo)} = ${n(all)}.`,
  guidance: [
   { prompt: `The master lamp is lit. The other ${n(k - 1)} lit lamps are chosen from the other ${n(N - 1)} lamps. How many settings is that?`, answer: [w], explanation: `C(${n(N - 1)}, ${n(k - 1)}) = ${n(N - 1)}! ÷ (${n(k - 1)}! × ${n(N - k)}!) = ${n(w)}.` },
   { prompt: `The master lamp is dark. All ${n(k)} lit lamps are chosen from the other ${n(N - 1)}. How many settings is that?`, answer: [wo], explanation: `C(${n(N - 1)}, ${n(k)}) = ${n(N - 1)}! ÷ (${n(k)}! × ${n(N - 1 - k)}!) = ${n(wo)}.` },
   { prompt: `Now count all settings at once. What is C(${n(N)}, ${n(k)})?`, answer: [all], explanation: `C(${n(N)}, ${n(k)}) = ${n(all)}, the same as ${n(w)} + ${n(wo)}: two honest counts of one set of settings always agree.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Sorting crews by two named tilers',
 brief: 'The foreman and the planner cannot always be spared together, so Mira sorts every possible crew by how many of the two it holds.',
 labels: ['crews with both', 'crews with exactly one', 'crews with neither', 'all crews'], tolerance: 0.01,
 gl: [['crews with both'], ['crews with exactly one'], ['crews with neither', 'all crews']]
}, {
 canonical: { n: 10, k: 4 },
 draw: R => { let x; do { const N = R.int(8, 12); x = { n: N, k: R.int(3, N - 3) }; } while (x.n === 10 && x.k === 4); return x; },
 build: ({ n: N, k }) => { const both = C(N - 2, k - 2), one = 2 * C(N - 2, k - 1), none = C(N - 2, k), all = C(N, k); return {
  prompt: `The Tiling Works needs a crew of ${n(k)} from its ${n(N)} tilers. Two of them are Oskar, the foreman, and Tamsin, the planner. Mira sorts the possible crews by how many of those two they include. Enter the number of crews with both of them, then the number with exactly one of them, then the number with neither. Then enter the number of all crews, C(${n(N)}, ${n(k)}), to check that the three groups add up to it.`,
  answer: [both, one, none, all],
  hints: ['If both are in, they fill two places, and the other places are filled from the other tilers. If neither is in, all the places are filled from the other tilers.', 'For exactly one, first decide which of the two it is: that is 2 choices, and each has the same count. Then the one who is in fills a place, and the rest come from the other tilers, leaving out the one who is not in.'],
  solution: `Both in: they fill 2 places and the other ${n(k - 2)} ${k - 2 === 1 ? 'comes' : 'come'} from the other ${n(N - 2)} tilers, so C(${n(N - 2)}, ${n(k - 2)}) = ${n(both)}. Exactly one in: 2 choices of which one, and then the other ${n(k - 1)} come from the other ${n(N - 2)}, so 2 × C(${n(N - 2)}, ${n(k - 1)}) = 2 × ${n(one / 2)} = ${n(one)}. Neither in: all ${n(k)} come from the other ${n(N - 2)}, so C(${n(N - 2)}, ${n(k)}) = ${n(none)}. Every crew is in exactly one group, and ${n(both)} + ${n(one)} + ${n(none)} = ${n(all)} = C(${n(N)}, ${n(k)}).`,
  guidance: [
   { prompt: `Both Oskar and Tamsin are in. The other ${pl(k - 2, 'place')} ${k - 2 === 1 ? 'is' : 'are'} filled from the other ${n(N - 2)} tilers. How many crews is that?`, answer: [both], explanation: `C(${n(N - 2)}, ${n(k - 2)}) = ${n(both)}.` },
   { prompt: `Exactly one of them is in. There are 2 choices of which one. The other ${n(k - 1)} places are filled from the other ${n(N - 2)} tilers. How many crews is that in all?`, answer: [one], explanation: `Each choice gives C(${n(N - 2)}, ${n(k - 1)}) = ${n(one / 2)} crews, and 2 × ${n(one / 2)} = ${n(one)}.` },
   { prompt: `Neither is in, so all ${n(k)} places come from the other ${n(N - 2)} tilers. How many crews is that? Then what is C(${n(N)}, ${n(k)}), the number of all crews?`, answer: [none, all], explanation: `C(${n(N - 2)}, ${n(k)}) = ${n(none)} and C(${n(N)}, ${n(k)}) = ${n(all)}. The groups add up: ${n(both)} + ${n(one)} + ${n(none)} = ${n(all)}.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q10', title: 'The crew with a lead',
 brief: 'Every crew has one member named lead, and Mira wants the crew-and-lead pairs counted in two different orders as a check.',
 labels: ['crews', 'ways to fill the other places', '(crew, lead) pairs'], tolerance: 0.01,
 gl: [['crews'], ['ways to fill the other places'], ['(crew, lead) pairs']]
}, {
 canonical: { n: 11, k: 4 },
 draw: R => { let x; do { const N = R.int(8, 13); x = { n: N, k: R.int(3, Math.min(6, N - 2)) }; } while (x.n === 11 && x.k === 4); return x; },
 build: ({ n: N, k }) => { const crews = C(N, k), rest = C(N - 1, k - 1), pairs = crews * k; return {
  prompt: `The Tiling Works needs a crew of ${n(k)} from its ${n(N)} tilers, and one member of the crew is named its lead. Mira counts the (crew, lead) pairs two ways. Way 1: pick the crew, then pick its lead from the crew. Way 2: pick the lead first from all ${n(N)} tilers, then fill the other ${n(k - 1)} places from the ${n(N - 1)} tilers left. Enter the number of crews, C(${n(N)}, ${n(k)}). Then enter the number of ways to fill the other ${n(k - 1)} places once the lead is picked, C(${n(N - 1)}, ${n(k - 1)}). Then enter the number of (crew, lead) pairs (type it without commas).`,
  answer: [crews, rest, pairs],
  hints: ['In way 1, every crew has the same number of members, and any one of them can be the lead. So the number of pairs is the number of crews times the number of possible leads.', 'In way 2 there is a choice of lead and then a choice of the rest of the crew, so the two numbers multiply. Both ways count the same pairs, so they must agree.'],
  solution: `C(${n(N)}, ${n(k)}) = ${n(N)}! ÷ (${n(k)}! × ${n(N - k)}!) = ${n(crews)} crews. After the lead is picked, C(${n(N - 1)}, ${n(k - 1)}) = ${n(rest)} ways fill the other ${n(k - 1)} places. Way 1: each of the ${n(crews)} crews has ${n(k)} possible leads, so there are ${n(crews)} × ${n(k)} = ${n(pairs)} pairs. Way 2: ${n(N)} choices of lead, each with ${n(rest)} ways to fill the rest: ${n(N)} × ${n(rest)} = ${n(N * rest)}. The two ways agree, as two honest counts of the same pairs must.`,
  guidance: [
   { prompt: `How many crews of ${n(k)} can be chosen from ${n(N)} tilers? That is C(${n(N)}, ${n(k)}).`, answer: [crews], explanation: `C(${n(N)}, ${n(k)}) = ${n(N)}! ÷ (${n(k)}! × ${n(N - k)}!) = ${n(crews)}.` },
   { prompt: `The lead is picked first. How many ways can the other ${n(k - 1)} places be filled from the ${n(N - 1)} tilers left? That is C(${n(N - 1)}, ${n(k - 1)}).`, answer: [rest], explanation: `C(${n(N - 1)}, ${n(k - 1)}) = ${n(rest)}.` },
   { prompt: `By way 1, each crew has ${n(k)} possible leads. How many (crew, lead) pairs are there?`, answer: [pairs], explanation: `${n(crews)} × ${n(k)} = ${n(pairs)}. Way 2 gives ${n(N)} × ${n(rest)} = ${n(N * rest)}, the same number.` }
  ] }; }
});

/* ---- q35 Divisibility, quotients and remainders [Levin 5.2] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The pump crew cycles',
 brief: 'The pump crews work in repeating cycles of days, and the log needs a cycle and a day for a fill after landing and a leak before it.',
 labels: ['cycle for the fill', 'day-in-cycle for the fill', 'cycle for the leak', 'day-in-cycle for the leak'], tolerance: 0.01,
 gl: [['cycle', 'day-in-cycle'], ['multiple at or below'], ['cycle', 'day-in-cycle']]
}, {
 canonical: { b: 9, a1: 250, a2: -62 },
 draw: R => { let x; do { x = { b: R.int(5, 12), a1: R.int(100, 400), a2: -R.int(20, 200) }; } while (x.a1 % x.b === 0 || x.a2 % x.b === 0 || (x.b === 9 && x.a1 === 250 && x.a2 === -62)); return x; },
 build: ({ b, a1, a2 }) => { const q1 = Math.floor(a1 / b), r1 = a1 - b * q1, q2 = Math.floor(a2 / b), r2 = a2 - b * q2, m2 = b * q2; return {
  prompt: `The pump crews at the depot work in cycles of ${n(b)} days. Day 0 is landing day, and any day d is logged as d = ${n(b)} × cycle + day-in-cycle, where the day-in-cycle runs from 0 to ${n(b - 1)}. A tank was filled on day ${n(a1)}, and a leak began on day ${n(a2)}, before landing. Enter the cycle and the day-in-cycle for day ${n(a1)}, then the cycle and the day-in-cycle for day ${n(a2)}.`,
  answer: [q1, r1, q2, r2],
  hints: [`For a day after landing, the cycle is how many whole ${n(b)}s fit into it, and the day-in-cycle is what is left over.`, `For a day before landing, step down to the first multiple of ${n(b)} at or below it, so that the day-in-cycle is still from 0 to ${n(b - 1)}. The cycle is then negative, but the day-in-cycle is not.`],
  solution: `${n(a1)} = ${n(b)} × ${n(q1)} + ${n(r1)}, with ${n(r1)} from 0 to ${n(b - 1)}, so the cycle is ${n(q1)} and the day-in-cycle is ${n(r1)}. For ${n(a2)}, the first multiple of ${n(b)} at or below it is ${n(b)} × ${par(q2)} = ${n(m2)}, and ${n(a2)} − ${par(m2)} = ${n(r2)}. So ${n(a2)} = ${n(b)} × ${par(q2)} + ${n(r2)}: the cycle is ${n(q2)} and the day-in-cycle is ${n(r2)}. The cycle ${n(q2 + 1)} would leave ${n(r2 - b)}, and a day-in-cycle is never negative.`,
  guidance: [
   { prompt: `How many whole ${n(b)}s fit into ${n(a1)}, and how much is left over?`, answer: [q1, r1], explanation: `${n(b)} × ${n(q1)} = ${n(b * q1)}, and ${n(a1)} − ${n(b * q1)} = ${n(r1)}, so ${n(a1)} = ${n(b)} × ${n(q1)} + ${n(r1)}.` },
   { prompt: `Which multiple of ${n(b)} is the first one at or below ${n(a2)}?`, answer: [m2], explanation: `${n(b)} × ${par(q2 + 1)} = ${n(b * (q2 + 1))} is above ${n(a2)}, and ${n(b)} × ${par(q2)} = ${n(m2)} is the first multiple at or below it.` },
   { prompt: `So ${n(a2)} = ${n(b)} × cycle + day-in-cycle with the day-in-cycle from 0 to ${n(b - 1)}. What are the cycle and the day-in-cycle?`, answer: [q2, r2], explanation: `${n(a2)} − ${par(m2)} = ${n(r2)}, so ${n(a2)} = ${n(b)} × ${par(q2)} + ${n(r2)}.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Boxing the seed packets',
 brief: 'A shipment of seed packets must be packed in boxes of a fixed size, and the stores need to know how many boxes to bring out.',
 labels: ['full boxes', 'packets left over', 'boxes needed'], tolerance: 0.01,
 gl: [['full boxes'], ['packets left over'], ['boxes needed']]
}, {
 canonical: { N: 137, b: 12 },
 draw: R => { let x; do { x = { N: R.int(60, 400), b: R.int(6, 24) }; } while (x.N % x.b === 0 || (x.N === 137 && x.b === 12)); return x; },
 build: ({ N, b }) => { const q = Math.floor(N / b), r = N - b * q; return {
  prompt: `A shipment of ${n(N)} seed packets arrives at the Road Office store. The packets go into boxes that each hold ${n(b)}, and each box is filled before the next is started, so only the last box may be part full. Enter the number of full boxes, then the number of packets left over, then the number of boxes needed to pack the whole shipment, counting a part-full box.`,
  answer: [q, r, q + 1],
  hints: [`Divide ${n(N)} by ${n(b)}. The quotient is the number of full boxes, and the remainder is what is left over; it must be from 0 to ${n(b - 1)}.`, 'The packets left over still need a box of their own, even if it is only part full.'],
  solution: `${n(b)} × ${n(q)} = ${n(b * q)}, and ${n(N)} − ${n(b * q)} = ${n(r)}, so ${n(N)} = ${n(b)} × ${n(q)} + ${n(r)}. That is ${n(q)} full boxes and ${pl(r, 'packet')} left over. The ${n(r)} left over ${r === 1 ? 'needs' : 'need'} one more box, so ${n(q)} + 1 = ${n(q + 1)} boxes are needed.`,
  guidance: [
   { prompt: `How many whole boxes of ${n(b)} can be filled from ${n(N)} packets?`, answer: [q], explanation: `${n(b)} × ${n(q)} = ${n(b * q)} is the largest multiple of ${n(b)} at or below ${n(N)}, so ${n(q)} boxes are full.` },
   { prompt: `How many packets are left over after those full boxes?`, answer: [r], explanation: `${n(N)} − ${n(b * q)} = ${n(r)}, so ${n(N)} = ${n(b)} × ${n(q)} + ${n(r)}.` },
   { prompt: `The packets left over go in one more box. How many boxes are needed in all?`, answer: [q + 1], explanation: `${n(q)} full boxes and one part-full box make ${n(q + 1)} boxes.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q01', title: 'Counting marker posts',
 brief: 'Marker posts stand at every few metres along the highway, and Mira wants the number between two milestones, one of them west of the beacon.',
 labels: ['quotient for the east end', 'quotient for the step before the west end', 'posts from end to end'], tolerance: 0.01,
 gl: [['quotient'], ['quotient'], ['posts from end to end']]
}, {
 canonical: { m: 7, L: -50, H: 100 },
 draw: R => { let x; do { x = { m: R.int(4, 9), L: -R.int(20, 90), H: R.int(30, 120) }; } while (x.m === 7 && x.L === -50 && x.H === 100); return x; },
 build: ({ m, L, H }) => { const F1 = Math.floor(H / m), F2 = Math.floor((L - 1) / m), cnt = F1 - F2, mult = m * F2; return {
  prompt: `Marker posts stand along the Road Office highway at every position that ${n(m)} divides, counting the beacon at position 0 as one of them. Positions east of the beacon are positive and positions west of it are negative. Mira counts the posts from position ${n(L)} to position ${n(H)}, both ends included, using two quotients. Each quotient here is the one that leaves a remainder from 0 to ${n(m - 1)}, so a position below 0 has a negative quotient. Enter the quotient when ${n(H)} is divided by ${n(m)}, then the quotient when ${n(L - 1)} is divided by ${n(m)}, then the number of posts from ${n(L)} to ${n(H)}.`,
  answer: [F1, F2, cnt],
  hints: [`The quotient of a position by ${n(m)} says which multiple of ${n(m)} is the first one at or below it: for a position below 0 that quotient is negative, and the remainder still goes from 0 to ${n(m - 1)}.`, `The posts are ${n(m)} × j for whole numbers j. The last post at or below the east end has j equal to that end’s quotient. The posts to leave out are those at or below the position just west of the west end, so the first post that counts has j one more than that position’s quotient.`],
  solution: `${n(H)} = ${n(m)} × ${n(F1)} + ${n(H - m * F1)}, so the quotient for ${n(H)} is ${n(F1)}. For ${n(L - 1)}, the first multiple of ${n(m)} at or below it is ${n(m)} × ${par(F2)} = ${n(mult)}, and ${n(L - 1)} − ${par(mult)} = ${n(L - 1 - mult)}, so the quotient is ${n(F2)}. The posts from ${n(L)} to ${n(H)} are ${n(m)} × j for j from ${n(F2 + 1)} up to ${n(F1)}, which is ${n(F1)} − ${par(F2)} = ${n(cnt)} posts.`,
  guidance: [
   { prompt: `How many whole ${n(m)}s fit into ${n(H)}? That is the quotient of ${n(H)} by ${n(m)}.`, answer: [F1], explanation: `${n(m)} × ${n(F1)} = ${n(m * F1)}, and ${n(H)} − ${n(m * F1)} = ${n(H - m * F1)}, so the quotient is ${n(F1)}.` },
   { prompt: `Which multiple of ${n(m)} is the first one at or below ${n(L - 1)}, and so what is the quotient of ${n(L - 1)} by ${n(m)}? Enter the quotient.`, answer: [F2], explanation: `${n(m)} × ${par(F2 + 1)} = ${n(m * (F2 + 1))} is above ${n(L - 1)}, and ${n(m)} × ${par(F2)} = ${n(mult)} is the first multiple at or below it, so the quotient is ${n(F2)}.` },
   { prompt: `The posts from ${n(L)} to ${n(H)} are ${n(m)} × j for j from ${n(F2 + 1)} up to ${n(F1)}. How many posts is that?`, answer: [cnt], explanation: `${n(F1)} − ${par(F2)} = ${n(cnt)} values of j, so ${n(cnt)} posts.` }
  ] }; }
});

})();
