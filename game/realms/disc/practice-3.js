/* Discrete mathematics practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p3.js. */
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
/* Counting helpers. fact(5) = 120; perm(8, 3) = 8 × 7 × 6; choose(10, 3) = 120; chain(8, 3) is the text "8 × 7 × 6". */
const fact = k => { let p = 1; for (let i = 2; i <= k; i++) p *= i; return p; };
const perm = (a, k) => { let p = 1; for (let i = 0; i < k; i++) p *= a - i; return p; };
const choose = (a, k) => k < 0 || k > a ? 0 : Math.round(perm(a, k) / fact(k));
const chain = (a, k) => Array.from({ length: k }, (_, i) => n(a - i)).join(' × ');
const LETTERS = 'ABCDEFGHIJKLMNOP';
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(d => SUP[+d]).join('');

/* ---- q11 Chapter review: labels and codes [Levin 0.4, 1.1] ---- */

/* Tags: colour (C options), row digit 1..r, bay digit 0..b; h = the larger digit, range {1, …, max(r, b)}. The parent draws letters, not colours. */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The pallet tag run',
 brief: 'The pallet racks are getting new tags, and Mira wants to know how many the printer can make and how many check values they give.',
 labels: ['tags', 'size of the range'], tolerance: 0.01,
 gl: [['colours', 'row digits', 'bay digits'], ['tags'], ['smallest value', 'largest value'], ['size of the range']]
}, {
 canonical: { C: 5, r: 6, b: 4 },
 draw: R => ({ C: R.int(3, 8), r: R.int(3, 9), b: R.int(3, 9) }),
 build: ({ C, r, b }) => { const count = C * r * (b + 1), top = Math.max(r, b); return {
  prompt: `Pallet tags in the labelling bay are printed with one colour from a set of ${n(C)} colours, then a row digit from 1 to ${n(r)}, then a bay digit from 0 to ${n(b)}. So (red, 2, 1) is one tag. A function h sends each tag to the larger of its two digits, so h(red, 2, 1) = 2, and its codomain is the whole numbers from 0 to 9. Enter the number of different tags, then the size of the range of h.`,
  answer: [count, top],
  hints: ['A tag is three choices made one after another, so multiply the numbers of options for the three places. Remember that a run of digits starting at 0 has one more digit than its last number.', 'The range holds only the values h really gives. Find the smallest and the largest value, and check that every whole number between them is reached. The row digit is never 0.'],
  solution: `There are ${n(C)} colours, ${n(r)} row digits (1 to ${n(r)}) and ${n(b + 1)} bay digits (0 to ${n(b)}). By the multiplicative principle there are ${n(C)} × ${n(r)} × ${n(b + 1)} = ${n(count)} tags. The row digit is at least 1, so the larger digit is at least 1, and it is at most ${n(top)}. Every whole number from 1 to ${n(top)} is reached (for example, a tag with that number as one digit and 1 as the other), so the range is {1, 2, …, ${n(top)}} and has ${n(top)} elements. The codomain also holds 0 and the numbers above ${n(top)}, which no tag reaches.`,
  guidance: [
   { prompt: 'How many options does each place of a tag have: the colour, the row digit and the bay digit?', answer: [C, r, b + 1], explanation: `${n(C)} colours, 1 to ${n(r)} is ${n(r)} digits, and 0 to ${n(b)} is ${n(b + 1)} digits, because 0 counts too.` },
   { prompt: 'Multiply the three numbers of options. How many tags are there?', answer: [count], explanation: `By the multiplicative principle, ${n(C)} × ${n(r)} × ${n(b + 1)} = ${n(count)}.` },
   { prompt: 'What are the smallest and the largest values h can give? The row digit is never 0.', answer: [1, top], explanation: `The larger digit is never below the row digit, which is at least 1, so the smallest value is 1. The largest possible digit is ${n(Math.max(r, b))}, so the largest value is ${n(top)}.` },
   { prompt: `Every whole number from 1 to ${n(top)} is reached. How many elements does the range of h have?`, answer: [top], explanation: `The range is {1, 2, …, ${n(top)}}, so it has ${n(top)} elements, far fewer than the ${n(count)} tags: many tags share a value.` }
  ] }; }
});

/* Cold-store tags: letter A..Z-th, first digit 1..9, second digit 0..9 different from the first: 9 options. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'Cold store tag budget',
 brief: 'The cold store is tagging every crate it holds, and Mira must check that the tag pattern does not run out.',
 labels: ['tags the pattern can make', 'tags left over'], tolerance: 0.01,
 gl: [['zones', 'first digits', 'second digits'], ['tags'], ['tags left over']]
}, {
 canonical: { Z: 8, N: 420 },
 draw: R => { const Z = R.int(4, 12); return { Z, N: R.int(60, 81 * Z - 20) }; },
 build: ({ Z, N }) => { const last = LETTERS[Z - 1], count = 81 * Z, spare = count - N; return {
  prompt: `The cold store marks each crate with a zone letter from A to ${last}, then a first digit from 1 to 9, then a second digit from 0 to 9 that must be different from the first digit. So A52 is allowed but A55 is not. The store holds ${n(N)} crates, and every crate needs its own different tag. Enter the number of tags the pattern can make, then the number of tags left over once every crate has one.`,
  answer: [count, spare],
  hints: ['Count the options place by place. The second digit has all ten digits to choose from, except the one the first digit has used.', 'Multiply the three numbers of options, then take away the tags that the crates use up.'],
  solution: `There are ${n(Z)} zone letters (A to ${last}), 9 first digits (1 to 9), and 9 second digits (the 10 digits 0 to 9, less the one already used by the first digit). By the multiplicative principle there are ${n(Z)} × 9 × 9 = ${n(count)} tags. The ${n(N)} crates use ${n(N)} of them, so ${n(count)} − ${n(N)} = ${n(spare)} are left over.`,
  guidance: [
   { prompt: 'How many options does each place have: the zone letter, the first digit, and the second digit (which must differ from the first)?', answer: [Z, 9, 9], explanation: `A to ${last} is ${n(Z)} letters and 1 to 9 is 9 digits. Whatever the first digit is, the second can be any of the other 9 digits (0 to 9 has 10, less one).` },
   { prompt: 'Multiply the three numbers of options. How many tags can the pattern make?', answer: [count], explanation: `${n(Z)} × 9 × 9 = ${n(count)}.` },
   { prompt: `The store has ${n(N)} crates. How many tags are left over?`, answer: [spare], explanation: `${n(count)} − ${n(N)} = ${n(spare)}.` }
  ] }; }
});

/* Seals: letter (L), digit 1..a, digit 1..b; f = |d1 − d2|, range {0, …, max(a, b) − 1}; codomain 0..9. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q08', title: 'The seal check audit',
 brief: 'The tamper seals use a new check rule, and Mira wants the seal count, the check values in use and the ones nothing reaches.',
 labels: ['seals', 'size of the range', 'values never reached'], tolerance: 0.01,
 gl: [['letters', 'first digits', 'second digits'], ['seals'], ['smallest value', 'largest value'], ['size of the range', 'values never reached']]
}, {
 canonical: { L: 7, a: 5, b: 8 },
 draw: R => ({ L: R.int(4, 12), a: R.int(3, 8), b: R.int(5, 8) }),
 build: ({ L, a, b }) => { const last = LETTERS[L - 1], count = L * a * b, top = Math.max(a, b) - 1, size = top + 1, unreached = 10 - size; return {
  prompt: `Tamper seals carry one letter from A to ${last}, then a first digit from 1 to ${n(a)}, then a second digit from 1 to ${n(b)}. A checker function f sends each seal to the difference between its two digits, taken as a positive number or 0, so the seal with digits 3 and 5 gives f = 2. Its codomain is the whole numbers from 0 to 9. Enter the number of different seals, then the size of the range of f, then the number of codomain elements that no seal reaches.`,
  answer: [count, size, unreached],
  hints: ['The seal is three choices made one after another, so multiply the numbers of options. Here neither digit can be 0.', 'The smallest difference is 0, when the digits match. Find the largest difference, check that every whole number between is reached, then compare the range with the codomain, which has 10 elements.'],
  solution: `There are ${n(L)} letters, ${n(a)} first digits and ${n(b)} second digits, so ${n(L)} × ${n(a)} × ${n(b)} = ${n(count)} seals. The difference is 0 when the digits match. The largest difference is ${n(top)}, between ${n(Math.max(a, b))} and 1. Every whole number from 0 to ${n(top)} is reached (keep one digit at 1 and move the other), so the range is {0, 1, …, ${n(top)}} and has ${n(size)} elements. The codomain 0 to 9 has 10 elements, so ${n(unreached)} of them are never reached, which means f is not onto.`,
  guidance: [
   { prompt: 'How many options does each place of a seal have: the letter, the first digit and the second digit?', answer: [L, a, b], explanation: `A to ${last} is ${n(L)} letters, 1 to ${n(a)} is ${n(a)} digits, and 1 to ${n(b)} is ${n(b)} digits. Neither digit can be 0 here.` },
   { prompt: 'Multiply the three numbers of options. How many seals are there?', answer: [count], explanation: `${n(L)} × ${n(a)} × ${n(b)} = ${n(count)}.` },
   { prompt: 'What are the smallest and the largest values f can give?', answer: [0, top], explanation: `Equal digits give 0. The biggest gap is between ${n(Math.max(a, b))} and 1: ${n(Math.max(a, b))} − 1 = ${n(top)}.` },
   { prompt: `Every whole number from 0 to ${n(top)} is reached. How many elements does the range have, and how many of the 10 codomain elements are never reached?`, answer: [size, unreached], explanation: `The range {0, …, ${n(top)}} has ${n(size)} elements, and 10 − ${n(size)} = ${n(unreached)} codomain elements are never reached.` }
  ] }; }
});

/* ---- q12 Permutations and factorials [Levin 1.3] ---- */

/* Rovers in docking slots: m! for m = 5..8 (the parent's prompt uses 6, its example 4); 9! is above 100000. */
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The docking order',
 brief: 'Every rover is back at the depot at once, and Mira wants to know how many ways they can be parked in the docking slots.',
 labels: ['ways to park'], tolerance: 0.01,
 gl: [['first slot', 'second slot'], ['ways to park']]
}, {
 canonical: { m: 7, w: 0 },
 draw: R => ({ m: R.int(5, 8), w: R.int(0, 2) }),
 build: ({ m, w }) => { const f = fact(m), v = ['rover', 'drone', 'sledge'][w]; return {
  prompt: `The rover bay has ${n(m)} docking slots in a row, and ${n(m)} different ${v}s come back at the end of the shift, one to each slot. Enter ${n(m)}!, the number of different ways the ${v}s can fill the slots (type it without commas if it is 1000 or more).`,
  answer: [f],
  hints: [`Park the ${v}s slot by slot, from the left. Any ${v} can take the first slot; fewer are left for the next.`, `Multiply the numbers of choices for all ${n(m)} slots, counting down to 1.`],
  solution: `The first slot has ${n(m)} choices, the second ${n(m - 1)}, and so on down to 1 choice for the last. By the multiplicative principle the number of ways is ${n(m)}! = ${chain(m, m)} = ${n(f)}.`,
  guidance: [
   { prompt: `How many ${v}s can take the first slot? Once it is filled, how many are left for the second slot?`, answer: [m, m - 1], explanation: `Any of the ${n(m)} can go first, and then ${n(m - 1)} remain.` },
   { prompt: `The choices keep dropping by one down to 1. What is ${chain(m, m)}?`, answer: [f], explanation: `Multiplying all the way down gives ${n(m)}! = ${n(f)}.` }
  ] }; }
});

/* A patrol route: the airlock is fixed first, the other m − 1 checkpoints go in any order; d routes are tested per night. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'The patrol route trial',
 brief: 'The night patrol must pick a walking route, and Mira wants to know how long it would take to test every route.',
 labels: ['routes', 'nights'], tolerance: 0.01,
 gl: [['checkpoints that can be in any order'], ['routes'], ['nights']]
}, {
 canonical: { m: 7, d: 40 },
 draw: R => { const m = R.int(6, 8), f = fact(m - 1); const ds = []; for (let d = 8; d <= 120; d++) if (f % d === 0 && f / d >= 3 && f / d <= 150) ds.push(d); return { m, d: R.pick(ds) }; },
 build: ({ m, d }) => { const f = fact(m - 1), nights = f / d; return {
  prompt: `A night patrol must visit ${n(m)} different checkpoints, one after another. Every route starts at the airlock checkpoint, so the airlock stays first and the other ${n(m - 1)} can come in any order. The crew office can test ${n(d)} different routes in a night. Enter the number of different routes, then the number of nights needed to test them all (type them without commas if they are 1000 or more).`,
  answer: [f, nights],
  hints: [`The airlock is fixed, so only the other checkpoints are being put in order. Count the orders of those, as in a row of different objects.`, `Divide the number of routes by the number tested per night.`],
  solution: `The airlock is fixed first, so the other ${n(m - 1)} checkpoints are put in order: ${n(m - 1)}! = ${chain(m - 1, m - 1)} = ${n(f)} routes. Testing ${n(d)} a night takes ${n(f)} ÷ ${n(d)} = ${n(nights)} nights.`,
  guidance: [
   { prompt: 'The airlock is fixed first. How many checkpoints are left to put in order?', answer: [m - 1], explanation: `${n(m)} checkpoints less the airlock leaves ${n(m - 1)}.` },
   { prompt: `How many orders are there for those ${n(m - 1)} checkpoints? That is ${n(m - 1)}!.`, answer: [f], explanation: `${chain(m - 1, m - 1)} = ${n(f)}, and each order is one route.` },
   { prompt: `${n(d)} routes are tested each night. How many nights do all ${n(f)} routes take?`, answer: [nights], explanation: `${n(f)} ÷ ${n(d)} = ${n(nights)} nights.` }
  ] }; }
});

/* Heavy block left, light block right: p! × q!; either end doubles it. */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q10', title: 'Heavy crates to the left',
 brief: 'The crew office shelf can only take heavy crates together, and Mira wants every allowed order counted.',
 labels: ['ways with heavy at the left', 'ways with heavy at either end'], tolerance: 0.01,
 gl: [['orders of the heavy crates', 'orders of the light crates'], ['ways with heavy at the left'], ['ways with heavy at either end']]
}, {
 canonical: { p: 4, q: 3 },
 draw: R => { const p = R.int(2, 5); return { p, q: R.except(2, 5, [p]) }; },
 build: ({ p, q }) => { const left = fact(p) * fact(q), both = 2 * left; return {
  prompt: `A shelf in the crew office holds ${n(p + q)} different crates in a row: ${n(p)} heavy ones and ${n(q)} light ones. The heavy crates must stand together in one block and the light crates together in another, in any order inside each block. Enter the number of ways to fill the shelf when the heavy block is at the left end. Then enter the number of ways when the heavy block may be at either end of the shelf (type them without commas if they are 1000 or more).`,
  answer: [left, both],
  hints: [`Fill the shelf in two stages: put the heavy crates in order in their block, then the light crates in theirs. Combine the two counts with the multiplicative principle.`, `With the block at the other end, the shelf is the same count again. Add the two ends, or double.`],
  solution: `The ${n(p)} heavy crates can be put in order in ${n(p)}! = ${n(fact(p))} ways and the ${n(q)} light crates in ${n(q)}! = ${n(fact(q))} ways. By the multiplicative principle there are ${n(fact(p))} × ${n(fact(q))} = ${n(left)} ways with the heavy block at the left. With the heavy block at the right end there are the same number again, so ${n(left)} + ${n(left)} = ${n(both)} ways in all.`,
  guidance: [
   { prompt: `In how many orders can the ${n(p)} heavy crates stand in their block, and in how many the ${n(q)} light crates?`, answer: [fact(p), fact(q)], explanation: `${n(p)}! = ${n(fact(p))} and ${n(q)}! = ${n(fact(q))}.` },
   { prompt: 'The two blocks are filled one after the other. Multiply the two counts. How many ways are there with the heavy block at the left?', answer: [left], explanation: `${n(fact(p))} × ${n(fact(q))} = ${n(left)}.` },
   { prompt: 'With the heavy block at the right end the count is the same. How many ways are there when it may go at either end?', answer: [both], explanation: `${n(left)} + ${n(left)} = ${n(both)}.` }
  ] }; }
});

/* ---- q13 Partial permutations P(n, k) [Levin 1.3] ---- */

mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The rover race podium',
 brief: 'The outpost is holding a rover race, and Mira needs to know how many ways the prizes can be handed out.',
 labels: ['ways to give the prizes'], tolerance: 0.01,
 gl: [['first prize', 'second prize'], ['ways to give the prizes']]
}, {
 canonical: { N: 9, k: 3 },
 draw: R => { let p; do { p = { N: R.int(6, 12), k: R.int(2, 4) }; } while (p.N === 8 && p.k === 3); return p; },
 build: ({ N, k }) => { const P = perm(N, k); return {
  prompt: `${n(N)} crew enter the rover race. Prizes go to the top ${n(k)} places, one prize each, and the places are ranked: first place and second place are different prizes. Enter P(${n(N)}, ${n(k)}), the number of different ways the ${n(k)} prizes can be given out (type it without commas if it is 1000 or more).`,
  answer: [P],
  hints: ['Give out the prizes in order, first place first. Any entrant can win it; the next prize can go to anyone who has not won yet.', `Multiply ${n(k)} numbers, starting at ${n(N)} and going down by one each time.`],
  solution: `First prize: ${n(N)} choices, second: ${n(N - 1)}${k > 2 ? `, and so on, ${k} prizes in all` : ''}. By the multiplicative principle P(${n(N)}, ${n(k)}) = ${chain(N, k)} = ${n(P)}. The same number is ${n(N)}! ÷ ${n(N - k)}!.`,
  guidance: [
   { prompt: 'How many entrants could win first prize? Once it is won, how many could win the second prize?', answer: [N, N - 1], explanation: `Any of the ${n(N)} can win first, and the winner cannot take another prize, so ${n(N - 1)} remain.` },
   { prompt: `Each prize after that has one fewer choice. What is ${chain(N, k)}?`, answer: [P], explanation: `${running(N, k)}. So P(${n(N)}, ${n(k)}) = ${n(P)}.` }
  ] }; }
});
function running(a, k) { const out = []; let p = a; for (let i = 1; i < k; i++) { out.push(`${n(p)} × ${n(a - i)} = ${n(p * (a - i))}`); p *= a - i; } return out.length === 1 ? out[0] : out.slice(0, -1).join(', ') + ' and ' + out[out.length - 1]; }

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Day shift and night shift',
 brief: 'The depot runs two shifts from one crew, and Mira wants to know how many rosters she could write for the whole day.',
 labels: ['day shift ways', 'ways to fill both shifts'], tolerance: 0.01,
 gl: [['day shift ways'], ['night shift ways'], ['ways to fill both shifts']]
}, {
 canonical: { N: 9, a: 3, b: 2 },
 draw: R => { let p; do { p = { N: R.int(8, 10), a: R.int(2, 3), b: R.int(2, 3) }; } while (perm(p.N, p.a) * perm(p.N - p.a, p.b) > 99999); return p; },
 build: ({ N, a, b }) => { const day = perm(N, a), night = perm(N - a, b), total = day * night; return {
  prompt: `Mira has ${n(N)} crew. The day shift has ${n(a)} different jobs, one person each. The night shift then has ${n(b)} different jobs, one person each, filled from the crew who are not on the day shift. Nobody does two jobs. Enter the number of ways to fill the day shift, then the number of ways to fill both shifts (type them without commas if they are 1000 or more).`,
  answer: [day, total],
  hints: ['The day shift is a partial permutation of the whole crew. After it is filled, the night shift is a partial permutation of the crew who are left.', 'The two shifts are two stages, so multiply their counts.'],
  solution: `The day shift: P(${n(N)}, ${n(a)}) = ${chain(N, a)} = ${n(day)} ways. That leaves ${n(N - a)} crew for the night shift: P(${n(N - a)}, ${n(b)}) = ${chain(N - a, b)} = ${n(night)} ways. By the multiplicative principle both shifts can be filled in ${n(day)} × ${n(night)} = ${n(total)} ways.`,
  guidance: [
   { prompt: `How many ways can the ${n(a)} day jobs be filled from ${n(N)} crew? That is P(${n(N)}, ${n(a)}) = ${chain(N, a)}.`, answer: [day], explanation: `${chain(N, a)} = ${n(day)}.` },
   { prompt: `${n(N - a)} crew are left. How many ways can the ${n(b)} night jobs be filled from them? That is P(${n(N - a)}, ${n(b)}).`, answer: [night], explanation: `${chain(N - a, b)} = ${n(night)}.` },
   { prompt: 'The two shifts are filled one after the other. Multiply the two counts.', answer: [total], explanation: `${n(day)} × ${n(night)} = ${n(total)}.` }
  ] }; }
});

mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q10', title: 'A veteran for captain',
 brief: 'The expedition needs a veteran in the lead post, and Mira wants to see how many rosters that rule leaves her.',
 labels: ['ways with no rule', 'ways with a veteran captain'], tolerance: 0.01,
 gl: [['ways with no rule'], ['captain choices', 'crew left'], ['ways to fill the other posts'], ['ways with a veteran captain']]
}, {
 canonical: { N: 11, k: 4, m: 3 },
 draw: R => ({ N: R.int(9, 12), k: R.int(3, 4), m: R.int(2, 4) }),
 build: ({ N, k, m }) => { const all = perm(N, k), rest = perm(N - 1, k - 1), total = m * rest; return {
  prompt: `Mira has ${n(N)} crew on shift, and ${n(m)} of them are veterans. She must fill ${n(k)} different posts, one person each, with nobody in two posts. The first post is the captain. Enter the number of ways to fill the ${n(k)} posts with no other rule. Then enter the number of ways if the captain must be a veteran (type them without commas if they are 1000 or more).`,
  answer: [all, total],
  hints: ['With no rule, fill the posts in order: the number of choices drops by one for each post.', 'With the rule, fill the captain post first: only veterans are allowed. The remaining posts are then filled from everyone who is left, veterans included.'],
  solution: `With no rule, P(${n(N)}, ${n(k)}) = ${chain(N, k)} = ${n(all)} ways. With a veteran captain there are ${n(m)} choices for the captain. That leaves ${n(N - 1)} crew for the other ${n(k - 1)} posts: P(${n(N - 1)}, ${n(k - 1)}) = ${chain(N - 1, k - 1)} = ${n(rest)} ways. By the multiplicative principle there are ${n(m)} × ${n(rest)} = ${n(total)} ways.`,
  guidance: [
   { prompt: `With no rule, how many ways are there to fill the ${n(k)} posts? That is P(${n(N)}, ${n(k)}) = ${chain(N, k)}.`, answer: [all], explanation: `${chain(N, k)} = ${n(all)}.` },
   { prompt: 'Now fill the captain post first. How many veterans can be captain, and how many crew are left for the other posts?', answer: [m, N - 1], explanation: `Only the ${n(m)} veterans can be captain. After the captain is chosen, ${n(N)} − 1 = ${n(N - 1)} crew are left.` },
   { prompt: `How many ways can the other ${n(k - 1)} posts be filled from those ${n(N - 1)} crew? That is P(${n(N - 1)}, ${n(k - 1)}).`, answer: [rest], explanation: `${chain(N - 1, k - 1)} = ${n(rest)}.` },
   { prompt: 'Multiply the captain choices by the ways to fill the other posts.', answer: [total], explanation: `${n(m)} × ${n(rest)} = ${n(total)}.` }
  ] }; }
});

/* ---- q14 Combinations C(n, k) = n! ÷ (k!(n − k)!) [Levin 1.3] ---- */

mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'Ice cores for the lab',
 brief: 'The lab can test only a few of the ice cores the drill team has pulled, and Mira wants to know how many different sets it could receive.',
 labels: ['sets of cores'], tolerance: 0.01,
 gl: [['ordered picks'], ['orders of a set'], ['sets of cores']]
}, {
 canonical: { N: 12, k: 4 },
 draw: R => { let p; do { p = { N: R.int(8, 15), k: R.int(3, 5) }; } while (p.N === 10 && p.k === 3); return p; },
 build: ({ N, k }) => { const P = perm(N, k), F = fact(k), C = choose(N, k); return {
  prompt: `The drill team has pulled ${n(N)} different ice cores, and the lab has room to test ${n(k)} of them this week. Which cores go to the lab matters, but not the order they are put in the rack. Enter C(${n(N)}, ${n(k)}), the number of different sets of ${n(k)} cores (type it without commas if it is 1000 or more).`,
  answer: [C],
  hints: [`Count the ordered picks first, P(${n(N)}, ${n(k)}). A set of ${n(k)} cores turns up once for every order of its members.`, `A set of ${n(k)} can be put in order in ${n(k)}! ways. Divide the ordered picks by that.`],
  solution: `Picking one core at a time gives P(${n(N)}, ${n(k)}) = ${chain(N, k)} = ${n(P)} ordered picks. Each set of ${n(k)} appears ${n(k)}! = ${n(F)} times among them, so C(${n(N)}, ${n(k)}) = ${n(P)} ÷ ${n(F)} = ${n(C)}.`,
  guidance: [
   { prompt: `If order mattered, how many ordered picks of ${n(k)} from ${n(N)} would there be? That is P(${n(N)}, ${n(k)}) = ${chain(N, k)}.`, answer: [P], explanation: `${chain(N, k)} = ${n(P)}.` },
   { prompt: `In how many orders can one set of ${n(k)} cores be listed? That is ${n(k)}!.`, answer: [F], explanation: `${n(k)}! = ${n(F)}. Each set was counted that many times.` },
   { prompt: `Divide the ordered picks by the orders of each set. What is ${n(P)} ÷ ${n(F)}?`, answer: [C], explanation: `${n(P)} ÷ ${n(F)} = ${n(C)} different sets.` }
  ] }; }
});

mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Engineers and medics',
 brief: 'The ice-field team needs both engineers and medics, and Mira wants to know how many different teams she could send.',
 labels: ['ways to pick the engineers', 'ways to pick the whole team'], tolerance: 0.01,
 gl: [['ways to pick the engineers'], ['ways to pick the medics'], ['ways to pick the whole team']]
}, {
 canonical: { e: 7, a: 3, m: 6, b: 2 },
 draw: R => { let p; do { p = { e: R.int(5, 9), a: R.int(2, 4), m: R.int(4, 8), b: R.int(2, 3) }; } while (p.a >= p.e); return p; },
 build: ({ e, a, m, b }) => { const ce = choose(e, a), cm = choose(m, b), total = ce * cm; return {
  prompt: `The ice-field team needs ${n(a)} of the ${n(e)} engineers and ${n(b)} of the ${n(m)} medics. Within each group only who goes matters, not the order. The engineers and the medics are picked independently. Enter the number of ways to pick the engineers, then the number of ways to pick the whole team (type them without commas if they are 1000 or more).`,
  answer: [ce, total],
  hints: ['Each group is a combination: order does not matter inside it. Work out the count for one group at a time.', 'The two groups are picked one after the other, so multiply their counts.'],
  solution: `The engineers: C(${n(e)}, ${n(a)}) = ${chain(e, a)} ÷ ${n(fact(a))} = ${n(ce)} ways. The medics: C(${n(m)}, ${n(b)}) = ${chain(m, b)} ÷ ${n(fact(b))} = ${n(cm)} ways. By the multiplicative principle the whole team can be picked in ${n(ce)} × ${n(cm)} = ${n(total)} ways.`,
  guidance: [
   { prompt: `How many ways can ${n(a)} engineers be picked from ${n(e)}? That is C(${n(e)}, ${n(a)}).`, answer: [ce], explanation: `${chain(e, a)} ÷ ${n(fact(a))} = ${n(ce)}.` },
   { prompt: `How many ways can ${n(b)} medics be picked from ${n(m)}? That is C(${n(m)}, ${n(b)}).`, answer: [cm], explanation: `${chain(m, b)} ÷ ${n(fact(b))} = ${n(cm)}.` },
   { prompt: 'Each choice of engineers can go with each choice of medics. Multiply the two counts.', answer: [total], explanation: `${n(ce)} × ${n(cm)} = ${n(total)}.` }
  ] }; }
});

mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13', title: 'A survey team with a lead',
 brief: 'The glacier survey needs a team with a named lead and deputy, and Mira wants to count the ways to choose the team and name them.',
 labels: ['teams', 'teams with a lead and a deputy'], tolerance: 0.01,
 gl: [['teams'], ['ways to name a lead and a deputy'], ['teams with a lead and a deputy']]
}, {
 canonical: { N: 13, k: 5 },
 draw: R => { let p; do { p = { N: R.int(12, 15), k: R.int(4, 6) }; } while (choose(p.N, p.k) * p.k * (p.k - 1) > 99999); return p; },
 build: ({ N, k }) => { const C = choose(N, k), nm = k * (k - 1), total = C * nm; return {
  prompt: `From ${n(N)} crew, Mira picks a team of ${n(k)} for the glacier survey; only who is on it matters. Then she names one member of the team as lead and a different member as deputy. Enter the number of different teams of ${n(k)}. Then enter the number of ways to pick a team and name its lead and deputy (type them without commas if they are 1000 or more).`,
  answer: [C, total],
  hints: ['The team is a combination: order does not matter. Naming the lead and the deputy afterwards is a ranked choice, so it is a partial permutation of the team.', 'The two stages happen one after the other, so multiply their counts.'],
  solution: `Teams: C(${n(N)}, ${n(k)}) = ${chain(N, k)} ÷ ${n(fact(k))} = ${n(C)}. Inside a team, the lead can be any of ${n(k)} members and the deputy any of the other ${n(k - 1)}: P(${n(k)}, 2) = ${n(k)} × ${n(k - 1)} = ${n(nm)}. By the multiplicative principle there are ${n(C)} × ${n(nm)} = ${n(total)} ways.`,
  guidance: [
   { prompt: `How many teams of ${n(k)} can be picked from ${n(N)} crew? That is C(${n(N)}, ${n(k)}).`, answer: [C], explanation: `${chain(N, k)} ÷ ${n(fact(k))} = ${n(C)}.` },
   { prompt: `For one team, in how many ways can a lead and then a different deputy be named? That is P(${n(k)}, 2).`, answer: [nm], explanation: `${n(k)} choices for the lead and ${n(k - 1)} for the deputy: ${n(k)} × ${n(k - 1)} = ${n(nm)}.` },
   { prompt: 'Multiply the number of teams by the number of ways to name the two roles in a team.', answer: [total], explanation: `${n(C)} × ${n(nm)} = ${n(total)}.` }
  ] }; }
});

/* ---- q15 Pascal's triangle, bit strings and the 2ⁿ subsets [Levin 1.2] ---- */

mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The pump switchboard',
 brief: 'The greenhouse pumps can each be on or off, and Mira wants to know how many switch settings there are.',
 labels: ['settings with k pumps on', 'settings in all'], tolerance: 0.01,
 gl: [['left entry above', 'right entry above'], ['settings with k pumps on'], ['settings in all']]
}, {
 canonical: { N: 9, k: 4 },
 draw: R => { let p; do { p = { N: R.int(6, 11), k: R.int(2, 5) }; } while (p.N === 7 && p.k === 3); return p; },
 build: ({ N, k }) => { const A = choose(N - 1, k - 1), B = choose(N - 1, k), C = A + B, T = 2 ** N; return {
  prompt: `The greenhouse has ${n(N)} water pumps in a row, and each pump is either on or off. A setting is written as a string of ${n(N)} digits, with 1 for a pump that is on and 0 for a pump that is off. Enter the number of settings with exactly ${n(k)} pumps on, then the total number of settings (type them without commas if they are 1000 or more).`,
  answer: [C, T],
  hints: [`A setting with exactly ${n(k)} pumps on is fixed by choosing which ${n(k)} of the ${n(N)} places hold a 1. That count is an entry of Pascal's triangle, counting rows and entries from 0.`, 'Each pump is on or off, whatever the others do. Count all the strings, which is also the number of subsets of the pumps.'],
  solution: `Choosing the ${n(k)} places that hold a 1 gives C(${n(N)}, ${n(k)}) settings. In Pascal's triangle it is the sum of the two entries above it in row ${n(N - 1)}: C(${n(N - 1)}, ${n(k - 1)}) + C(${n(N - 1)}, ${n(k)}) = ${n(A)} + ${n(B)} = ${n(C)}. Each of the ${n(N)} pumps has 2 states, so there are 2${sup(N)} = ${n(T)} settings in all.`,
  guidance: [
   { prompt: `In row ${n(N - 1)} of Pascal's triangle, what are C(${n(N - 1)}, ${n(k - 1)}) and C(${n(N - 1)}, ${n(k)}), the two entries above C(${n(N)}, ${n(k)})?`, answer: [A, B], explanation: `C(${n(N - 1)}, ${n(k - 1)}) = ${n(A)} and C(${n(N - 1)}, ${n(k)}) = ${n(B)}, from the row or from n! ÷ (k! × (n − k)!).` },
   { prompt: `Each entry is the sum of the two above it. What is ${n(A)} + ${n(B)}?`, answer: [C], explanation: `${n(A)} + ${n(B)} = ${n(C)} settings with exactly ${n(k)} pumps on.` },
   { prompt: `Each of the ${n(N)} places is 0 or 1. How many strings of ${n(N)} digits are there in all?`, answer: [T], explanation: `${n(N)} places with 2 choices each give 2${sup(N)} = ${n(T)}.` }
  ] }; }
});

mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Sensor faults at the repair desk',
 brief: 'The repair desk only handles certain fault patterns, and Mira wants to know how many status strings it could be handed.',
 labels: ['strings with k faults', 'strings with k + 1 faults', 'strings handled in all'], tolerance: 0.01,
 gl: [['strings with k faults'], ['strings with k + 1 faults'], ['strings handled in all']]
}, {
 canonical: { N: 10, k: 3 },
 draw: R => ({ N: R.int(7, 12), k: R.int(2, 4) }),
 build: ({ N, k }) => { const A = choose(N, k), B = choose(N, k + 1), T = A + B; return {
  prompt: `A dome has ${n(N)} sensors in a row. Its status string has a 1 for every faulty sensor and a 0 for every working one. The repair desk takes a status string when exactly ${n(k)} sensors are faulty, or when exactly ${n(k + 1)} are. Enter the number of status strings with exactly ${n(k)} faulty sensors, then the number with exactly ${n(k + 1)}, then the number of status strings the desk takes in all (type them without commas if they are 1000 or more).`,
  answer: [A, B, T],
  hints: [`A string with exactly ${n(k)} ones is fixed by choosing the places of the ones. Find the entries of Pascal's triangle for that: they are in row ${n(N)}, counting rows and entries from 0.`, 'A string cannot have both counts of faults, so the two kinds do not overlap. Add them.'],
  solution: `Strings with exactly ${n(k)} ones: C(${n(N)}, ${n(k)}) = ${n(A)}. Strings with exactly ${n(k + 1)} ones: C(${n(N)}, ${n(k + 1)}) = ${n(B)}. No string is in both kinds, so the desk takes ${n(A)} + ${n(B)} = ${n(T)} strings. The two entries sit side by side in row ${n(N)} of Pascal's triangle, and their sum is the entry below them, C(${n(N + 1)}, ${n(k + 1)}).`,
  guidance: [
   { prompt: `How many ${n(N)}-bit strings have exactly ${n(k)} ones? That is C(${n(N)}, ${n(k)}).`, answer: [A], explanation: `${chain(N, k)} ÷ ${n(fact(k))} = ${n(A)}.` },
   { prompt: `How many have exactly ${n(k + 1)} ones? That is C(${n(N)}, ${n(k + 1)}).`, answer: [B], explanation: `${chain(N, k + 1)} ÷ ${n(fact(k + 1))} = ${n(B)}.` },
   { prompt: 'A string has one number of ones, not both. Add the two counts.', answer: [T], explanation: `${n(A)} + ${n(B)} = ${n(T)}.` }
  ] }; }
});

mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q02', title: 'Every possible tool kit',
 brief: 'The tool locker can be packed in many ways, and Mira wants to know how many kits there are and how many meet two rules.',
 labels: ['kits in all', 'kits with the named tool', 'kits of at most 2 tools'], tolerance: 0.01,
 gl: [['kits in all'], ['kits with the named tool'], ['kits of exactly 2 tools'], ['kits of at most 2 tools']]
}, {
 canonical: { N: 12, w: 0 },
 draw: R => ({ N: R.int(9, 15), w: R.int(0, 2) }),
 build: ({ N, w }) => { const tool = ['hammer', 'wrench', 'drill'][w], T = 2 ** N, H = 2 ** (N - 1), two = choose(N, 2), most = 1 + N + two; return {
  prompt: `A tool locker holds ${n(N)} different tools, and a kit is any subset of them, including the empty kit and the kit of all the tools. Enter the number of kits in all. Then enter the number of kits that contain the ${tool} (one of the ${n(N)} tools), and the number of kits with at most 2 tools (type them without commas if they are 1000 or more).`,
  answer: [T, H, most],
  hints: [`Each tool is in the kit or out of it, so a kit is a bit string. With the ${tool} forced in, one place is no longer free.`, 'A kit of at most 2 tools has 0, 1 or 2 tools. Count each size, then add. The empty kit counts.'],
  solution: `Each of the ${n(N)} tools is in or out, so there are 2${sup(N)} = ${n(T)} kits. If the ${tool} is in, the other ${n(N - 1)} tools are each in or out: 2${sup(N - 1)} = ${n(H)} kits. Kits with at most 2 tools: 1 with no tools, ${n(N)} with one tool and C(${n(N)}, 2) = ${n(two)} with two tools, so 1 + ${n(N)} + ${n(two)} = ${n(most)}.`,
  guidance: [
   { prompt: `Each of the ${n(N)} tools is in the kit or out of it. How many kits are there in all?`, answer: [T], explanation: `${n(N)} places with 2 choices each give 2${sup(N)} = ${n(T)}.` },
   { prompt: `The ${tool} is in the kit, and each of the other ${n(N - 1)} tools is in or out. How many kits contain the ${tool}?`, answer: [H], explanation: `2${sup(N - 1)} = ${n(H)}.` },
   { prompt: `How many kits have exactly 2 tools? That is C(${n(N)}, 2).`, answer: [two], explanation: `${n(N)} × ${n(N - 1)} ÷ 2 = ${n(two)}.` },
   { prompt: `Add the kits with no tools (1), with one tool (${n(N)}) and with exactly 2 tools. How many kits have at most 2 tools?`, answer: [most], explanation: `1 + ${n(N)} + ${n(two)} = ${n(most)}.` }
  ] }; }
});

})();
