/* Logic and proof practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p8.js. */
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
const sup = s => String(s).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const list = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const gcd = (x, y) => y ? gcd(y, x % y) : x;
/* “pn + q” written the way a person would: no 1 in front of n, no “+ 0”. */
const lin = (p, q) => `${p === 1 ? '' : n(p)}n${q > 0 ? ` + ${n(q)}` : q < 0 ? ` − ${n(-q)}` : ''}`;

/* Proved sum formulas used by q37b, q37c and q37d: term(i) is the i-th term, S(m) the total of the first m terms,
   termAt(i) and Sat(m) show the working. */
const SUMS = {
 odd: { formula: '1 + 3 + 5 + … + (2n − 1) = n²', per: 'i', each: '2i − 1', term: i => 2 * i - 1, S: m => m * m,
  termAt: i => `2 × ${n(i)} − 1 = ${n(2 * i - 1)}`, Sat: m => `${n(m)}² = ${n(m * m)}` },
 even: { formula: '2 + 4 + 6 + … + 2n = n(n + 1)', each: '2i', term: i => 2 * i, S: m => m * (m + 1),
  termAt: i => `2 × ${n(i)} = ${n(2 * i)}`, Sat: m => `${n(m)} × ${n(m + 1)} = ${n(m * (m + 1))}` },
 nat: { formula: '1 + 2 + 3 + … + n = n(n + 1) ÷ 2', each: 'i', term: i => i, S: m => m * (m + 1) / 2,
  termAt: i => `${n(i)}`, Sat: m => `${n(m)} × ${n(m + 1)} ÷ 2 = ${n(m * (m + 1) / 2)}` },
 sq: { formula: '1² + 2² + 3² + … + n² = n(n + 1)(2n + 1) ÷ 6', last: 'n²', term: i => i * i, S: m => m * (m + 1) * (2 * m + 1) / 6,
  termAt: i => `${n(i)}² = ${n(i * i)}`, Sat: m => `${n(m)} × ${n(m + 1)} × ${n(2 * m + 1)} ÷ 6 = ${n(m * (m + 1) * (2 * m + 1) / 6)}` },
 cube: { formula: '1³ + 2³ + 3³ + … + n³ = (n(n + 1) ÷ 2)²', last: 'n³', term: i => i * i * i, S: m => Math.pow(m * (m + 1) / 2, 2),
  termAt: i => `${n(i)}³ = ${n(i * i * i)}`, Sat: m => `(${n(m)} × ${n(m + 1)} ÷ 2)² = ${n(m * (m + 1) / 2)}² = ${n(Math.pow(m * (m + 1) / 2, 2))}` }
};

/* ---- q36 The inductive step: from k to k + 1 [Levin 2.5] ---- */

/* A rack filled in layers: layer 1 holds a bolts and each layer 3 more, so layer n holds 3n + (a − 3) and n layers hold
   n(3n + 2a − 3) ÷ 2 (always whole: 3n(n − 1) is even). Asked: the total for k layers, the next layer, the total for k + 1. */
mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The bolt rack, layer by layer',
 brief: 'The store crew fill a bolt rack one layer at a time, and Mira wants the claim about its total carried from each layer to the next.',
 labels: ['bolts in k layers', 'bolts in the new layer', 'bolts in k + 1 layers'], tolerance: 0.01,
 gl: [['bolts in k layers'], ['bolts in the new layer'], ['bolts in k + 1 layers']]
}, {
 canonical: { a: 1, k: 9 },
 draw: R => ({ a: R.int(1, 6), k: R.int(4, 50) }),
 build: ({ a, k }) => { const S = m => m * (3 * m + 2 * a - 3) / 2, L = m => 3 * m + a - 3, t = L(k + 1), Sk = S(k), S1 = S(k + 1), Tn = lin(3, a - 3), F = `n(${lin(3, 2 * a - 3)}) ÷ 2`,
  tk = lin(3, a).replace('n', 'k'), Fk = lin(3, 2 * a - 3).replace('n', 'k'), F1 = lin(3, 2 * a).replace('n', 'k'), at = m => `${n(m)} × ${n(3 * m + 2 * a - 3)} ÷ 2`; return {
  prompt: `A bolt rack is filled in layers: layer 1 holds ${n(a)} ${a === 1 ? 'bolt' : 'bolts'}, layer 2 holds ${n(a + 3)}, layer 3 holds ${n(a + 6)}, and each new layer holds 3 more than the one below, so layer n holds ${Tn}. The claim to prove by induction is that n layers hold ${F} bolts in all. In the inductive step the claim is assumed for k layers. Take k = ${n(k)}. Enter the bolts in ${n(k)} layers by the formula, then the bolts in layer ${n(k + 1)}, then the bolts in ${n(k + 1)} layers (type them without commas).`,
  answer: [Sk, t, S1],
  hints: [`Layer ${n(k + 1)} is the new layer: put n = ${n(k + 1)} into ${Tn}.`, `The total for ${n(k + 1)} layers is the total for ${n(k)} layers plus the new layer. The formula at n = ${n(k + 1)} should give the same total; showing that it always does is the inductive step.`],
  solution: `By the formula, ${n(k)} layers hold ${at(k)} = ${n(Sk)} bolts. Layer ${n(k + 1)} holds 3 × ${n(k + 1)}${a === 3 ? '' : a > 3 ? ` + ${n(a - 3)}` : ` − ${n(3 - a)}`} = ${n(t)} bolts. So ${n(k + 1)} layers hold ${n(Sk)} + ${n(t)} = ${n(S1)} bolts, and the formula at n = ${n(k + 1)} gives ${at(k + 1)} = ${n(S1)} as well. The same algebra works for every k: k(${Fk}) ÷ 2 + (${tk}) = (k + 1)(${F1}) ÷ 2.`,
  guidance: [
   { prompt: `Use the formula for k = ${n(k)} layers. How many bolts do ${n(k)} layers hold?`, answer: [Sk], explanation: `The inductive hypothesis lets us use the formula at n = ${n(k)}: ${at(k)} = ${n(Sk)}.` },
   { prompt: `How many bolts does the new layer, layer ${n(k + 1)}, hold?`, answer: [t], explanation: `Layer n holds ${Tn}, so layer ${n(k + 1)} holds 3 × ${n(k + 1)}${a === 3 ? '' : a > 3 ? ` + ${n(a - 3)}` : ` − ${n(3 - a)}`} = ${n(t)}.` },
   { prompt: 'Add the new layer to the first total. How many bolts do the layers hold now?', answer: [S1], explanation: `${n(Sk)} + ${n(t)} = ${n(S1)}, which matches the formula: ${at(k + 1)} = ${n(S1)}.` }
  ] }; }
});

/* Daily hauls of 1, 1 + d, 1 + 2d, …: day n hauls dn − (d − 1) and the total is n(dn − (d − 2)) ÷ 2.
   Asked: the formula's total at k, at k + 1, and their difference (the haul of day k + 1). d = 3 is left out, it is the layers of q36b. */
mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Checking the hauling log',
 brief: 'The supply crew’s hauling log comes with a total formula, and Mira wants to see that adding one more day keeps the formula true.',
 labels: ['total after k days', 'total after k + 1 days', 'crates hauled on day k + 1'], tolerance: 0.01,
 gl: [['total after k days'], ['total after k + 1 days'], ['crates hauled on day k + 1']]
}, {
 canonical: { d: 5, k: 12 },
 draw: R => ({ d: R.int(4, 8), k: R.int(5, 40) }),
 build: ({ d, k }) => { const S = m => m * (d * m - d + 2) / 2, h = d * (k + 1) - (d - 1), Sk = S(k), S1 = S(k + 1), F = `n(${lin(d, -(d - 2))}) ÷ 2`; return {
  prompt: `The supply crew keep a hauling log. On day 1 they haul 1 crate, and every day after that they haul ${n(d)} more than the day before, so day n has ${lin(d, -(d - 1))} crates. The log claims that the total hauled in the first n days is ${F}. Take k = ${n(k)}. Using only the formula, enter the total after ${n(k)} days, then the total after ${n(k + 1)} days, then the difference between those two totals (type them without commas).`,
  answer: [Sk, S1, S1 - Sk],
  hints: [`Put n = ${n(k)} into ${F}, then n = ${n(k + 1)}.`, `The difference of the two totals is the number of crates the formula says were hauled on day ${n(k + 1)}. Put n = ${n(k + 1)} into ${lin(d, -(d - 1))} to see whether the day’s own haul agrees.`],
  solution: `The formula gives ${n(k)} × ${n(d * k - d + 2)} ÷ 2 = ${n(Sk)} crates after ${n(k)} days and ${n(k + 1)} × ${n(d * (k + 1) - d + 2)} ÷ 2 = ${n(S1)} crates after ${n(k + 1)} days. The difference is ${n(S1)} − ${n(Sk)} = ${n(S1 - Sk)}. Day ${n(k + 1)} really has ${n(d)} × ${n(k + 1)} − ${n(d - 1)} = ${n(h)} crates, so one more day adds exactly what the log says, and the formula survives the step from k to k + 1.`,
  guidance: [
   { prompt: `Put n = ${n(k)} into the formula. What total does it give after ${n(k)} days?`, answer: [Sk], explanation: `${n(k)} × ${n(d * k - d + 2)} ÷ 2 = ${n(Sk)}.` },
   { prompt: `Put n = ${n(k + 1)} into the formula. What total does it give after ${n(k + 1)} days?`, answer: [S1], explanation: `${n(k + 1)} × ${n(d * (k + 1) - d + 2)} ÷ 2 = ${n(S1)}.` },
   { prompt: `Subtract the first total from the second. How many crates does the formula say were hauled on day ${n(k + 1)}?`, answer: [S1 - Sk], explanation: `${n(S1)} − ${n(Sk)} = ${n(S1 - Sk)}, and day ${n(k + 1)} really has ${n(d)} × ${n(k + 1)} − ${n(d - 1)} = ${n(h)} crates, so they agree.` }
  ] }; }
});

/* Terms a, a + 2h, a + 4h, …: term n is 2hn + (a − 2h) and the total is n(hn + (a − h)). Not a = h (it would print “n(hn)”).
   Asked: both sides at n = 1 (the base case, q35), then the amount added from k to k + 1 and the total at k + 1. */
mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'The first rung and the next',
 brief: 'Mira is checking a whole railing formula, from its first section to the step between any two, before the crew trust it.',
 labels: ['left side at n = 1', 'right side at n = 1', 'amount added', 'total at n = k + 1'], tolerance: 0.01,
 gl: [['left side at n = 1', 'right side at n = 1'], ['amount added'], ['total at n = k + 1']]
}, {
 canonical: { a: 2, h: 3, k: 14 },
 draw: R => { let a; const h = R.int(2, 5); do { a = R.int(1, 9); } while (a === h); return { a, h, k: R.int(9, 40) }; },
 build: ({ a, h, k }) => { const pm = x => x > 0 ? ` + ${n(x)}` : x < 0 ? ` − ${n(-x)}` : '', S = m => m * (h * m + a - h), t = 2 * h * (k + 1) + a - 2 * h, Sk = S(k), S1 = S(k + 1), T = lin(2 * h, a - 2 * h), F = `n(${lin(h, a - h)})`; return {
  prompt: `The railing on the Long Stair is built in sections: the first is ${n(a)} ${a === 1 ? 'metre' : 'metres'} long and each section is ${n(2 * h)} metres longer than the one before, so section n is ${T} metres. Mira wants to prove by induction that the first n sections are ${F} metres in all. For the base case, enter the left side at n = 1 (the first section), then the right side at n = 1. For the inductive step, take k = ${n(k)} and enter the length added going from k sections to k + 1 sections, then the total length of ${n(k + 1)} sections, built from the formula for k sections (type them without commas).`,
  answer: [a, a, t, S1],
  hints: ['The base case checks both sides of the claim at n = 1: the left side is just the first section, and the right side is the formula with n = 1.', `The amount added is section ${n(k + 1)}: put n = ${n(k + 1)} into ${T}. Add it to the formula’s total for ${n(k)} sections, which the inductive hypothesis allows.`],
  solution: `At n = 1 the left side is the first section, ${n(a)}, and the right side is 1 × (${n(h)}${pm(a - h)}) = ${n(a)}, so the two sides agree. The formula for ${n(k)} sections gives ${n(k)} × ${n(h * k + a - h)} = ${n(Sk)}. Section ${n(k + 1)} is ${n(2 * h)} × ${n(k + 1)}${pm(a - 2 * h)} = ${n(t)}, the amount added. So ${n(k + 1)} sections come to ${n(Sk)} + ${n(t)} = ${n(S1)}, and the formula at n = ${n(k + 1)} gives ${n(k + 1)} × ${n(h * (k + 1) + a - h)} = ${n(S1)} as well.`,
  guidance: [
   { prompt: `Put n = 1 into both sides. What are the left side (the first section) and the right side ${F}?`, answer: [a, a], explanation: `The left side is the first section, ${n(a)}. The right side is 1 × (${n(h)}${pm(a - h)}) = ${n(a)}. The base case holds.` },
   { prompt: `What is the length of section ${n(k + 1)}, the amount added going from ${n(k)} sections to ${n(k + 1)}?`, answer: [t], explanation: `Section n is ${T}, so section ${n(k + 1)} is ${n(2 * h)} × ${n(k + 1)}${pm(a - 2 * h)} = ${n(t)}.` },
   { prompt: `The formula for ${n(k)} sections gives ${n(Sk)}. Add the new section. What is the total for ${n(k + 1)} sections?`, answer: [S1], explanation: `${n(Sk)} + ${n(t)} = ${n(S1)}, which matches the formula: ${n(k + 1)} × ${n(h * (k + 1) + a - h)} = ${n(S1)}.` }
  ] }; }
});

/* ---- q37 Induction for sums [Levin 2.5] ---- */

/* Square pads in a pyramid: 1² + 2² + … + n² = n(n + 1)(2n + 1) ÷ 6. Asked: the total at a drawn n and the next term. */
mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Pads in the landing pyramid',
 brief: 'The builders are laying square landing pads in a pyramid, and Mira wants the total for the whole pyramid without counting pad by pad.',
 labels: ['pads in the pyramid', 'pads in the next layer'], tolerance: 0.01,
 gl: [['pads in the pyramid'], ['pads in the next layer']]
}, {
 canonical: { m: 24 },
 draw: R => ({ m: R.int(10, 55) }),
 build: ({ m }) => { const F = SUMS.sq, S = F.S(m), t = F.term(m + 1); return {
  prompt: `A pyramid of landing pads is built in layers: layer 1 is a single pad, layer 2 is a 2 by 2 square of pads, layer 3 is a 3 by 3 square, and so on, so layer i has i × i pads. This formula for n layers has been proved by induction, so it holds for every whole number n: ${F.formula}. The pyramid has ${n(m)} layers. Enter the number of pads in the whole pyramid (type it without commas), then the number of pads the next layer, layer ${n(m + 1)}, would need.`,
  answer: [S, t],
  hints: [`There is no need to count ${n(m)} layers one by one: put n = ${n(m)} into the right side of the formula, and take care to multiply before you divide.`, `Layer ${n(m + 1)} is a square with ${n(m + 1)} pads on each side, so count the pads in it with the pattern for one layer.`],
  solution: `The formula holds for every n, so put n = ${n(m)} into its right side: ${F.Sat(m)}. Adding ${n(m)} layers one at a time would give the same total. Layer ${n(m + 1)} is ${F.termAt(m + 1)} pads.`,
  guidance: [
   { prompt: `Put n = ${n(m)} into the right side of the formula. How many pads are there in all?`, answer: [S], explanation: F.Sat(m) + '.' },
   { prompt: `Layer i has i × i pads. How many pads does layer ${n(m + 1)} have?`, answer: [t], explanation: `${F.termAt(m + 1)}.` }
  ] }; }
});

/* Treads of the stair carry 2i − 1, 2i or i bolts. Asked: the total for treads 1 to hi, for treads 1 to lo, and for treads lo + 1 to hi. */
mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Bolts between two landings',
 brief: 'The repair crew only work on the treads between two landings, and Mira needs their bolt count without adding up every tread.',
 labels: ['bolts for treads 1 to the top one', 'bolts for the treads below the work', 'bolts for the treads worked on'], tolerance: 0.01,
 gl: [['bolts for treads 1 to the top one'], ['bolts for the treads below the work'], ['bolts for the treads worked on']]
}, {
 canonical: { f: 'odd', lo: 30, hi: 50 },
 draw: R => { const f = R.pick(['odd', 'even', 'nat']), lo = R.int(10, 110); return { f, lo, hi: lo + R.int(10, 120) }; },
 build: ({ f, lo, hi }) => { const F = SUMS[f], Ahi = F.S(hi), Alo = F.S(lo), mid = Ahi - Alo; return {
  prompt: `The Long Stair has a numbered tread for every whole number, and tread i takes ${F.each} bolts to repair. So the first n treads take ${F.formula} bolts, a formula proved by induction that holds for every n. The repair crew only work on the treads from tread ${n(lo + 1)} up to tread ${n(hi)}. Enter the bolts for treads 1 to ${n(hi)}, then the bolts for treads 1 to ${n(lo)}, then the bolts for treads ${n(lo + 1)} to ${n(hi)} (type them without commas).`,
  answer: [Ahi, Alo, mid],
  hints: [`The formula gives the bolts for all the treads from tread 1 up to tread n. Use it twice: once with n = ${n(hi)} and once with n = ${n(lo)}.`, `The treads from ${n(lo + 1)} to ${n(hi)} are what is left when the treads from 1 to ${n(lo)} are taken away from the treads from 1 to ${n(hi)}.`],
  solution: `The formula holds for every n. For treads 1 to ${n(hi)} it gives ${F.Sat(hi)}. For treads 1 to ${n(lo)} it gives ${F.Sat(lo)}. The treads from ${n(lo + 1)} to ${n(hi)} are the first ${n(hi)} treads without the first ${n(lo)}, so they take ${n(Ahi)} − ${n(Alo)} = ${n(mid)} bolts.`,
  guidance: [
   { prompt: `Put n = ${n(hi)} into the right side of the formula. How many bolts do treads 1 to ${n(hi)} take?`, answer: [Ahi], explanation: F.Sat(hi) + '.' },
   { prompt: `Put n = ${n(lo)} into the right side of the formula. How many bolts do treads 1 to ${n(lo)} take?`, answer: [Alo], explanation: F.Sat(lo) + '.' },
   { prompt: `Treads ${n(lo + 1)} to ${n(hi)} are the first ${n(hi)} treads without the first ${n(lo)}. How many bolts do they take?`, answer: [mid], explanation: `${n(Ahi)} − ${n(Alo)} = ${n(mid)}.` }
  ] }; }
});

/* A proved sum formula carried one step up with q36's idea: the total at m, the term for m + 1, the total at m + 1.
   Cubes stay at m <= 22 and squares at m <= 55 so every total is below 100000. */
mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'The vault count, one level further',
 brief: 'The vault shelving has been counted up to one level, and Mira wants the count for the next level taken straight from the proved formula.',
 labels: ['total for the given n', 'term for the next n', 'total for the next n'], tolerance: 0.01,
 gl: [['total for the given n'], ['term for the next n'], ['total for the next n']]
}, {
 canonical: { f: 'cube', m: 18 },
 draw: R => { const f = R.pick(['cube', 'sq']); return { f, m: f === 'cube' ? R.int(8, 22) : R.int(25, 55) }; },
 build: ({ f, m }) => { const F = SUMS[f], S = F.S(m), t = F.term(m + 1), S1 = F.S(m + 1); return {
  prompt: `Level i of the vault shelving holds ${f === 'cube' ? 'i × i × i' : 'i × i'} crates, so ${F.formula} crates for the first n levels, a formula proved by induction that holds for every n. The vault has ${n(m)} levels now and a new level is about to be built on top. Enter the crates in the ${n(m)} levels (type it without commas), then the crates in the new level, level ${n(m + 1)}, then the crates in all ${n(m + 1)} levels, by adding the new level to the first total.`,
  answer: [S, t, S1],
  hints: [`Put n = ${n(m)} into the right side of the formula, keeping the brackets and the order of the working.`, `The new level is the term for n = ${n(m + 1)}: its pattern is ${F.last}. The total for ${n(m + 1)} levels is the old total plus this level, and the formula at n = ${n(m + 1)} must agree.`],
  solution: `The formula holds for every n, so the ${n(m)} levels hold ${F.Sat(m)}. The new level is ${F.termAt(m + 1)}. So all ${n(m + 1)} levels hold ${n(S)} + ${n(t)} = ${n(S1)}, and the formula at n = ${n(m + 1)} agrees: ${F.Sat(m + 1)}.`,
  guidance: [
   { prompt: `Put n = ${n(m)} into the right side of the formula. How many crates do ${n(m)} levels hold?`, answer: [S], explanation: F.Sat(m) + '.' },
   { prompt: `How many crates does level ${n(m + 1)} hold?`, answer: [t], explanation: `${F.termAt(m + 1)}.` },
   { prompt: `Add the new level to the first total. How many crates do ${n(m + 1)} levels hold?`, answer: [S1], explanation: `${n(S)} + ${n(t)} = ${n(S1)}, which matches the formula at n = ${n(m + 1)}: ${F.Sat(m + 1)}.` }
  ] }; }
});

/* ---- q38 Induction for inequalities: where it starts [Levin 2.5] ---- */

/* aⁿ > c·nᵇ: the smallest N from which it holds at every n >= N (checked 80 steps further). */
const good38 = ({ a, b, c }) => { const ok = i => Math.pow(a, i) > c * Math.pow(i, b); for (let i = 1; i < 60; i++) { let all = true; for (let j = i; j < i + 80; j++) if (!ok(j)) { all = false; break; } if (all) return i; } return -1; };
/* Every (a, b, c) with N >= minN, the right side's growth factor ((N + 1) ÷ N)ᵇ below a (so the step works) and every number printed below 100000. */
const pool38 = (minN, cs) => { const out = [];
 for (const a of [2, 3, 4, 5]) for (const b of [2, 3, 4]) for (const c of cs) {
  const N = good38({ a, b, c }); if (N < minN || (a === 2 && b === 2 && c === 1) || (a === 3 && b === 3 && c === 1)) continue;
  if (Math.pow(a, N + 3) >= 100000 || Math.pow((N + 1) / N, b) >= a) continue; out.push({ a, b, c }); }
 return out; };
const C38 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50];
const POOL38 = pool38(3, C38), POOL38D = pool38(7, [...C38, 60, 75, 100]);
const rhs38 = (c, b) => `${c === 1 ? '' : n(c)}n${sup(b)}`;
const rhsAt38 = (c, b, i) => c === 1 ? `${n(i)}${sup(b)}` : `${n(c)} × ${n(i)}${sup(b)}`;
/* The table of both sides from n = 1 to n = upTo, as text, and the n below N where the inequality is true. */
const table38 = ({ a, b, c }, upTo) => { const rows = []; for (let i = 1; i <= upTo; i++) { const L = Math.pow(a, i), Rt = c * Math.pow(i, b); rows.push(`n = ${n(i)}: ${n(L)} against ${n(Rt)}, ${L > Rt ? 'true' : 'false'}`); } return rows.join('; '); };
const early38 = ({ a, b, c }, N) => { const e = []; for (let i = 1; i < N; i++) if (Math.pow(a, i) > c * Math.pow(i, b)) e.push(i); return e; };

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The backlog that overtakes the crew',
 brief: 'A backlog of repair jobs grows by a fixed factor each day, and Mira wants the day from which it beats what the crew can clear, for good.',
 labels: ['N', 'backlog minus what the crew can clear at N'], tolerance: 0.01,
 gl: [['true at n = 1 (1 or 0)', 'true at n = 2 (1 or 0)'], ['N'], ['backlog minus what the crew can clear at N']]
}, {
 canonical: { a: 3, b: 2, c: 10 },
 draw: R => R.pick(POOL38),
 build: ({ a, b, c }) => { const N = good38({ a, b, c }), L = i => Math.pow(a, i), Rt = i => c * Math.pow(i, b), gap = L(N) - Rt(N), early = early38({ a, b, c }, N), claim = `${n(a)}ⁿ > ${rhs38(c, b)}`; return {
  prompt: `On day n the repair backlog stands at ${n(a)}ⁿ jobs, while the crew can clear ${rhs38(c, b)} jobs by day n. Mira wants to prove by induction that the backlog is bigger than what the crew can clear, ${claim}, but it is not so on every early day. Find the smallest whole number N such that it is true on day N and on every day after. Enter N, then how many more jobs the backlog holds than the crew can clear on day N (type them without commas).`,
  answer: [N, gap],
  hints: ['Make a table of the backlog and of what the crew can clear for day 1, day 2, day 3 and so on. A day can be true early on, then fail, and only later hold for good.', `Once the backlog is ahead, check that it keeps pulling away: each day it is multiplied by ${n(a)}, while the crew’s total grows by a smaller factor.`],
  solution: `${table38({ a, b, c }, N + 1)}. ${early.length ? `It is true at n = ${list(early.map(n))}, but it fails after that, so the start is later.` : 'It fails on every day before the start.'} From n = ${n(N)} on it is true, and each day the backlog is multiplied by ${n(a)} while the crew’s total is multiplied by less than ${n(a)}, so N = ${n(N)}. On that day the backlog is ${n(a)}${sup(N)} = ${n(L(N))} and the crew can clear ${rhsAt38(c, b, N)} = ${n(Rt(N))}, so the backlog is ahead by ${n(L(N))} − ${n(Rt(N))} = ${n(gap)}.`,
  guidance: [
   { prompt: 'Is the claim true on day 1? And on day 2? Enter 1 for true or 0 for false for each.', answer: [Math.pow(a, 1) > c ? 1 : 0, Math.pow(a, 2) > c * Math.pow(2, b) ? 1 : 0], explanation: `${table38({ a, b, c }, 2)}.` },
   { prompt: 'Keep going down the table. What is the smallest N from which the backlog stays ahead on every day?', answer: [N], explanation: `${table38({ a, b, c }, N + 1)}. From n = ${n(N)} on, the backlog stays ahead.` },
   { prompt: `How many more jobs does the backlog hold than the crew can clear on day ${n(N)}?`, answer: [gap], explanation: `${n(a)}${sup(N)} = ${n(L(N))} and ${rhsAt38(c, b, N)} = ${n(Rt(N))}, so the backlog is ahead by ${n(gap)}.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The queue and the clearing crew',
 brief: 'Messages pile up at the relay faster and faster, and Mira needs to know when the queue pulls ahead of the clearing crew and by how much a little later.',
 labels: ['N', 'queue minus crew limit at N + 3'], tolerance: 0.01,
 gl: [['N'], ['queue at N + 3', 'crew limit at N + 3'], ['queue minus crew limit at N + 3']]
}, {
 canonical: { a: 4, b: 3, c: 2 },
 draw: R => R.pick(POOL38),
 build: ({ a, b, c }) => { const N = good38({ a, b, c }), M = N + 3, L = i => Math.pow(a, i), Rt = i => c * Math.pow(i, b), gap = L(M) - Rt(M); return {
  prompt: `At the relay, the message queue holds ${n(a)}ⁿ messages at hour n, and the clearing crew can handle ${rhs38(c, b)} messages by hour n. Mira wants to prove by induction that the queue is bigger than the crew can handle, ${n(a)}ⁿ > ${rhs38(c, b)}, from some hour on. First find the smallest whole number N from which this is true at N and at every hour after. Then find how far ahead the queue is three hours after that, at hour N + 3. Enter N, then the queue minus the crew’s figure at hour N + 3 (type them without commas).`,
  answer: [N, gap],
  hints: ['Make a table of both sides for hour 1, 2, 3 and so on, and mark each row true or false. The start is after the last false row, not at the first true one.', 'When N is found, add 3 to it, put that hour into both sides, and subtract the crew’s figure from the queue.'],
  solution: `${table38({ a, b, c }, N + 1)}. From n = ${n(N)} on it is true and stays true, since each hour the queue is multiplied by ${n(a)} and the crew’s figure by less than ${n(a)}, so N = ${n(N)}. At hour ${n(M)} the queue holds ${n(a)}${sup(M)} = ${n(L(M))} and the crew’s figure is ${rhsAt38(c, b, M)} = ${n(Rt(M))}. The queue is ahead by ${n(L(M))} − ${n(Rt(M))} = ${n(gap)}.`,
  guidance: [
   { prompt: 'Make the table for hour 1, 2, 3 and so on. What is the smallest N from which the queue stays bigger at every hour?', answer: [N], explanation: `${table38({ a, b, c }, N + 1)}. From n = ${n(N)} on, the queue stays ahead.` },
   { prompt: `Now take hour N + 3, which is hour ${n(M)}. Enter the queue, then the crew’s figure, at that hour.`, answer: [L(M), Rt(M)], explanation: `${n(a)}${sup(M)} = ${n(L(M))} and ${rhsAt38(c, b, M)} = ${n(Rt(M))}.` },
   { prompt: 'Subtract the crew’s figure from the queue. How far ahead is the queue?', answer: [gap], explanation: `${n(L(M))} − ${n(Rt(M))} = ${n(gap)}.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', title: 'A late overtaking',
 brief: 'A relay’s power draw takes many nights to overtake its supply cap for good, and Mira wants to know where it settles and on how many earlier nights it was already ahead.',
 labels: ['N', 'nights below N when it is true'], tolerance: 0.01,
 gl: [['N'], ['nights below N when it is true']]
}, {
 canonical: { a: 2, b: 3, c: 1 },
 draw: R => R.pick(POOL38D),
 build: ({ a, b, c }) => { const N = good38({ a, b, c }), early = early38({ a, b, c }, N), claim = `${n(a)}ⁿ > ${rhs38(c, b)}`; return {
  prompt: `The power draw of a new relay is ${n(a)}ⁿ units on night n, and the supply cap is ${rhs38(c, b)} units. Mira wants to prove ${claim} by induction, but it takes a while to settle. Find the smallest whole number N such that it is true at N and at every whole number after N. Enter N, then how many of the whole numbers n from 1 up to N − 1 make the claim true (it may be none).`,
  answer: [N, early.length],
  hints: ['Make a table of both sides for n = 1, 2, 3 and so on and mark each row true or false. Rows that are true early on do not count as the start if a false row comes after them.', 'The start N is the row right after the last false row. Then count the true rows above it.'],
  solution: `${table38({ a, b, c }, N + 1)}. The last false row is n = ${n(N - 1)}, and from n = ${n(N)} on the left side stays ahead, because each step multiplies it by ${n(a)} and the right side by less than ${n(a)}. So N = ${n(N)}. ${early.length ? `Below N the claim is true at n = ${list(early.map(n))}, which is ${n(early.length)} ${early.length === 1 ? 'number' : 'numbers'}.` : 'Below N the claim is never true, so the count is 0.'}`,
  guidance: [
   { prompt: 'Make the table for n = 1, 2, 3 and so on. What is the smallest N from which every row is true?', answer: [N], explanation: `${table38({ a, b, c }, N + 1)}. The last false row is n = ${n(N - 1)}, so from n = ${n(N)} on the left side stays ahead.` },
   { prompt: `How many of the rows above n = ${n(N)}, from n = 1 to n = ${n(N - 1)}, are true?`, answer: [early.length], explanation: `${early.length ? `The true rows are n = ${list(early.map(n))}, which is ${n(early.length)} ${early.length === 1 ? 'row' : 'rows'}.` : 'No row is true, so the count is 0.'}` }
  ] }; }
});

/* ---- q39 Strong induction: postage stamps [Levin 2.5] ---- */

/* One way to pay m with x stamps of a and y of b, or null. */
const pay = (m, a, b) => { for (let y = 0; y * b <= m; y++) if ((m - y * b) % a === 0) return [(m - y * b) / a, y]; return null; };
const payText = (m, a, b) => { const [x, y] = pay(m, a, b), parts = [];
 if (x) parts.push(x === 1 ? n(a) : `${n(x)} × ${n(a)}`); if (y) parts.push(y === 1 ? n(b) : `${n(y)} × ${n(b)}`); return `${n(m)} = ${parts.join(' + ')}`; };
/* The fewest stamps that pay T exactly: [stamps, b-stamps, a-stamps]. With b > a it is the most b-stamps that leave a multiple of a. */
const fewest = (T, a, b) => { let best = null;
 for (let y = 0; y * b <= T; y++) if ((T - y * b) % a === 0) { const x = (T - y * b) / a; if (!best || x + y < best[0]) best = [x + y, y, x]; }
 return best; };
/* Two stamp values 3 <= a < b with no common factor and largest unpayable amount ab − a − b at most 50 (so the list of
   unpayable amounts stays short), never 3 and 5 or 4 and 5 (the learn mission's own numbers). */
const draw39 = (R, aLo, aHi, bHi) => { let p; do { p = { a: R.int(aLo, aHi) }; p.b = R.int(p.a + 1, bHi); } while (gcd(p.a, p.b) !== 1 || p.a * p.b - p.a - p.b > 50 || (p.a === 3 && p.b === 5) || (p.a === 4 && p.b === 5)); return p; };
/* "m = x × a + y × b" for a given split, leaving out a part that is 0 and a count of 1. */
const splitText = (m, a, b, x, y) => { const parts = []; if (x) parts.push(x === 1 ? n(a) : `${n(x)} × ${n(a)}`); if (y) parts.push(y === 1 ? n(b) : `${n(y)} × ${n(b)}`); return `${n(m)} = ${parts.join(' + ')}`; };
const unpayable = (a, b) => { const F = a * b - a - b, no = []; for (let m = 1; m <= F; m++) if (!pay(m, a, b)) no.push(m); return no; };

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'Fuel cans of two sizes',
 brief: 'The fuel store only has two sizes of can, and Mira wants to know which top-up amounts it can always measure out.',
 labels: ['largest top-up that cannot be measured', 'top-ups that cannot be measured'], tolerance: 0.01,
 gl: [['top-ups that cannot be measured'], ['largest top-up that cannot be measured']]
}, {
 canonical: { a: 4, b: 7 },
 draw: R => draw39(R, 3, 7, 13),
 build: ({ a, b }) => { const no = unpayable(a, b), F = a * b - a - b, base = []; for (let m = F + 1; m <= F + a; m++) base.push(payText(m, a, b)); return {
  prompt: `The fuel store at the foot of the Long Stair only has cans that hold ${n(a)} litres and cans that hold ${n(b)} litres. A top-up is measured out by emptying whole cans of either size, any number of each, so it can only be a whole number of litres made from ${n(a)}s and ${n(b)}s. Mira wants to prove by strong induction that every top-up above some point can be measured. Enter the largest top-up that cannot be measured, then how many different top-ups cannot be measured at all.`,
  answer: [F, no.length],
  hints: [`List the top-ups 1, 2, 3 and so on in litres, and mark each one that can be made from ${n(a)}s and ${n(b)}s. A top-up may use the same size of can more than once.`, `Look for a run of ${n(a)} top-ups in a row that can all be measured. The top-up just before that run is the largest that cannot, and the ones that cannot be measured are all the unmarked ones before it.`],
  solution: `The top-ups that cannot be measured are ${list(no.map(n))}. The next ${n(a)} top-ups can all be measured: ${list(base)}. These are the base cases, and every larger top-up is ${n(a)} more than one that can be measured, so it can be measured with one more ${n(a)}-litre can. So ${n(F)} is the largest top-up that cannot be measured, and there are ${n(no.length)} top-ups that cannot be measured.`,
  guidance: [
   { prompt: 'List the top-ups that cannot be measured. How many are there?', answer: [no.length], explanation: `They are ${list(no.map(n))}: ${n(no.length)} top-ups.` },
   { prompt: 'What is the largest of them?', answer: [F], explanation: `${n(F)} cannot be measured, and the ${n(a)} top-ups after it can: ${list(base)}.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'The parcel with an exact charge',
 brief: 'A heavy parcel has an exact postage charge, and Mira wants to know that it can be paid and with how few stamps.',
 labels: ['largest amount that cannot be paid', 'fewest stamps'], tolerance: 0.01,
 gl: [['largest amount that cannot be paid'], ['bigger stamps used'], ['fewest stamps']]
}, {
 canonical: { a: 4, b: 7, T: 45 },
 draw: R => { const p = draw39(R, 3, 7, 13), F = p.a * p.b - p.a - p.b; return { ...p, T: F + R.int(5, 30) }; },
 build: ({ a, b, T }) => { const F = a * b - a - b, no = unpayable(a, b), [s, y, x] = fewest(T, a, b); return {
  prompt: `The post at the foot of the Long Stair sells only ${n(a)}-credit and ${n(b)}-credit stamps, and any number of each may go on a parcel. A heavy parcel must carry exactly ${n(T)} credits of stamps. First find the largest amount that cannot be paid with these stamps, to be sure that ${n(T)} can be. Then enter the fewest stamps that pay exactly ${n(T)} credits.`,
  answer: [F, s],
  hints: [`List the amounts 1, 2, 3 and so on that can be made from ${n(a)}s and ${n(b)}s until a run of ${n(a)} amounts in a row can all be paid. Every amount above the amount just before that run can be paid.`, `The ${n(b)}-credit stamp is worth more, so to use the fewest stamps use as many of them as you can. Try the number of ${n(b)}-credit stamps from the most that fit downwards, until what is left is a multiple of ${n(a)}.`],
  solution: `The amounts that cannot be paid are ${list(no.map(n))}, and every amount above ${n(F)} can be paid, so the largest that cannot be paid is ${n(F)}. Since ${n(T)} is above ${n(F)}, the parcel can be paid. To use the fewest stamps, use as many ${n(b)}-credit stamps as possible: ${n(y)} of them cost ${n(y * b)}, leaving ${n(T - y * b)}, which is ${n(x)} stamps of ${n(a)}. In all that is ${n(y)} + ${n(x)} = ${n(s)} stamps: ${splitText(T, a, b, x, y)}. ${y > 0 ? `Using fewer ${n(b)}-credit stamps would need more ${n(a)}-credit ones.` : `Every number of ${n(b)}-credit stamps that fits leaves an amount that ${n(a)} does not divide, so here none can be used.`}`,
  guidance: [
   { prompt: 'List the amounts that cannot be paid. What is the largest of them?', answer: [F], explanation: `They are ${list(no.map(n))}, and the ${n(a)} amounts after ${n(F)} can all be paid, so ${n(F)} is the largest that cannot.` },
   { prompt: `Use as many ${n(b)}-credit stamps as possible, so that what is left of ${n(T)} credits is a multiple of ${n(a)}. How many ${n(b)}-credit stamps is that?`, answer: [y], explanation: `${n(y)} stamps of ${n(b)} make ${n(y * b)}, and ${n(T)} − ${n(y * b)} = ${n(T - y * b)} is ${n(x)} stamps of ${n(a)}. ${(y + 1) * b > T ? `One more would cost ${n((y + 1) * b)}, which is more than ${n(T)}.` : `Any larger number of ${n(b)}-credit stamps that still fits would leave an amount that ${n(a)} does not divide.`}` },
   { prompt: `The rest is paid with ${n(a)}-credit stamps. How many stamps are used in all?`, answer: [s], explanation: `${n(y)} + ${n(x)} = ${n(s)} stamps.` }
  ] }; }
});

/* Larger stamp values (a from 6 to 9, b up to 14). Mira claims every amount from M up can be paid: M is F + 1 … F + 4 (true) or F … F − 3 (false).
   F is not payable because F − y·b is never a multiple of a for y = 0, 1, … */
mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', title: 'Mira’s claim about large amounts',
 brief: 'Mira has a claim about large amounts for a pair of stamp values the crew rarely use, and she wants it checked.',
 labels: ['largest amount that cannot be paid', 'claim true (1 or 0)', 'base cases needed'], tolerance: 0.01,
 gl: [['largest amount that cannot be paid'], ['claim true (1 or 0)'], ['base cases needed']]
}, {
 canonical: { a: 6, b: 11, M: 56 },
 draw: R => { let p; do { p = { a: R.int(6, 9) }; p.b = R.int(p.a + 1, 14); } while (gcd(p.a, p.b) !== 1);
  const F = p.a * p.b - p.a - p.b; p.M = R.bool() ? F + R.int(1, 4) : F - R.int(0, 3); return p; },
 build: ({ a, b, M }) => { const F = a * b - a - b, claim = M > F ? 1 : 0, base = [], left = []; for (let m = F + 1; m <= F + a; m++) base.push(payText(m, a, b));
  for (let y = 0; y * b <= F; y++) left.push(n(F - y * b)); return {
  prompt: `The relay post at the foot of the Long Stair has found a drawer of ${n(a)}-credit and ${n(b)}-credit stamps, and nothing else. Any number of each may go on a parcel. Mira claims that every amount from ${n(M)} credits upward can be paid exactly. Enter the largest amount that cannot be paid. Then enter 1 if Mira’s claim is true or 0 if it is false. Then enter how many base cases the strong induction for this pair of stamps needs, when its step pays each larger amount by adding one ${n(a)}-credit stamp to an amount already paid.`,
  answer: [F, claim, a],
  hints: [`An amount can be paid when taking away some ${n(b)}-credit stamps leaves a multiple of ${n(a)}. To test an amount, write it down, then subtract ${n(b)} again and again, and stop before you would go below zero. Check every number on that list, the amount itself included: if any is a multiple of ${n(a)} (0 counts, meaning no ${n(a)}-credit stamps), the amount can be paid; if none is, it cannot. Look for a run of payable amounts in a row as long as the smaller stamp value.`, 'Mira’s claim is true exactly when the amount she names is above the largest amount that cannot be paid. The base cases are the run of payable amounts just above it, as many as the smaller stamp value.'],
  solution: `Take ${n(F)} and take away ${n(b)}-credit stamps one at a time, stopping before the amount would go below zero: ${list(left)}. None of these is a multiple of ${n(a)}, so ${n(F)} cannot be paid. The next ${n(a)} amounts can all be paid: ${list(base)}. Strong induction then reaches every larger amount by adding ${n(a)}-credit stamps, so ${n(F)} is the largest amount that cannot be paid. Mira says every amount from ${n(M)} up can be paid, and ${n(M)} is ${M > F ? `above ${n(F)}, so her claim is true` : `${M === F ? 'itself the amount' : `not above ${n(F)}, so ${n(F)} is still in her range and`} that cannot be paid, so her claim is false`}. The run of ${n(a)} amounts needs ${n(a)} base cases.`,
  guidance: [
   { prompt: `Find the largest amount that cannot be paid with ${n(a)}-credit and ${n(b)}-credit stamps. Test an amount by taking away ${n(b)}-credit stamps one at a time, stopping before you go below zero, and looking for a multiple of ${n(a)} among the results, the amount itself included.`, answer: [F], explanation: `${n(F)} minus ${n(b)}-credit stamps leaves ${list(left)}, none a multiple of ${n(a)}, so ${n(F)} cannot be paid. The ${n(a)} amounts after it can all be paid: ${list(base)}.` },
   { prompt: `Mira says every amount from ${n(M)} upward can be paid. Is that true? Enter 1 for true or 0 for false.`, answer: [claim], explanation: M > F ? `Every amount above ${n(F)} can be paid, and ${n(M)} is above ${n(F)}, so the claim is true.` : `${n(F)} cannot be paid and it is ${M === F ? 'exactly the amount she names' : `in the range from ${n(M)} upward`}, so the claim is false.` },
   { prompt: `The inductive step goes back ${n(a)} credits at a time. How many amounts in a row, just above ${n(F)}, are checked as base cases?`, answer: [a], explanation: `Each larger amount leans on the one ${n(a)} below it, so each of the ${n(a)} amounts from ${n(F + 1)} to ${n(F + a)} must be checked on its own.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Real analysis: “for every ε there is an N” [Levin 0.2, 2.5] ---- */

/* The first whole number strictly above p ÷ q, from integers: Math.floor(p / q) + 1. */
const firstAbove = (p, q) => Math.floor(p / q) + 1;

/* ε = e ÷ 100 and ε ÷ 2 = e ÷ 200, e from 4 to 40. Not e = 5, 7 or 8 (0.05, 0.07 and 0.08 are the lesson's own numbers). */
mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Drift below the tolerance',
 brief: 'The signal mast drifts a little less every night, and Mira wants the night after which the drift stays inside a tolerance, and a stricter one.',
 labels: ['N', 'N for half the tolerance'], tolerance: 0.01,
 gl: [['whole-number part of 1 ÷ ε'], ['N'], ['N for half the tolerance']]
}, {
 canonical: { e: 12 },
 draw: R => ({ e: R.except(4, 40, [5, 7, 8]) }),
 build: ({ e }) => { const eps = n(e / 100), half = n(e / 200), q = Math.floor(100 / e), N = q + 1, q2 = Math.floor(200 / e), N2 = q2 + 1, whole = 100 % e === 0, whole2 = 200 % e === 0;
  const inv = (num, w, v) => w ? `${n(v)} exactly` : `about ${n(Math.round(num * 100 / e) / 100)}`; return {
  prompt: `Each night the mast’s signal drifts by 1 ÷ n units, where n is the number of the night. A tolerance is a small positive number ε that the drift must stay under. For ε = ${eps}, enter the smallest whole number N such that the drift is under ε on night N and on every night after it. Then do the same for the stricter tolerance of half that size, ε = ${half}, and enter the new N.`,
  answer: [N, N2],
  hints: ['The drift 1 ÷ n is under ε exactly when n is above 1 ÷ ε. Work out 1 ÷ ε and take the first whole number strictly above it. If 1 ÷ ε is itself a whole number, that is not enough.', 'The stricter tolerance is a smaller ε, so 1 ÷ ε is bigger and N is bigger. Work it out the same way.'],
  solution: `1 ÷ n < ${eps} exactly when n > 1 ÷ ${eps}, which is ${inv(100, whole, q)}. The first whole number strictly above it is N = ${n(N)}. For ε = ${half}, 1 ÷ ${half} is ${inv(200, whole2, q2)}, and the first whole number strictly above it is N = ${n(N2)}. The stricter tolerance needs the later night.`,
  guidance: [
   { prompt: `What is 1 ÷ ${eps}? If it is not a whole number, enter its whole-number part.`, answer: [q], explanation: `1 ÷ ${eps} is ${inv(100, whole, q)}${whole ? '' : `, so its whole-number part is ${n(q)}`}.` },
   { prompt: `What is the smallest whole number N with 1 ÷ N < ${eps}?`, answer: [N], explanation: `N must be strictly above 1 ÷ ${eps}, so N = ${n(N)}.${whole ? ` At n = ${n(q)} the drift equals ${eps}, which is not under it.` : ''}` },
   { prompt: `Now take ε = ${half}. What is the smallest whole number N with 1 ÷ N < ${half}?`, answer: [N2], explanation: `1 ÷ ${half} is ${inv(200, whole2, q2)}, so N = ${n(N2)}.` }
  ] }; }
});

/* Two tolerances e1 > e2 (in thousandths): the extra readings that fail the stricter gate are N2 − N1. */
mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Two quality gates',
 brief: 'The sensor readings must pass a quality gate, and the depot is about to switch to a stricter one that Mira must plan for.',
 labels: ['N for the first gate', 'N for the stricter gate', 'extra readings that fail'], tolerance: 0.01,
 gl: [['N for the first gate'], ['N for the stricter gate'], ['extra readings that fail']]
}, {
 canonical: { e1: 40, e2: 25 },
 draw: R => { const e1 = R.pick([30, 40, 60, 90, 100, 120, 150]); return { e1, e2: R.pick([12, 15, 20, 25, 30, 40].filter(e => e < e1)) }; },
 build: ({ e1, e2 }) => { const x1 = n(e1 / 1000), x2 = n(e2 / 1000), N1 = firstAbove(1000, e1), N2 = firstAbove(1000, e2),
  inv = e => 1000 % e === 0 ? `${n(1000 / e)} exactly` : `about ${n(Math.round(100000 / e) / 100)}`; return {
  prompt: `The depot’s sensor sends reading number n as the value 1 ÷ n, so the readings are 1, 1 ÷ 2, 1 ÷ 3 and so on. A reading passes a quality gate with tolerance ε if it is under ε. Under the first gate, ε = ${x1}, every reading from number N onward passes. Under the stricter gate, ε = ${x2}, every reading from number N onward passes, with a larger N. Enter the smallest N for the first gate, then the smallest N for the stricter gate, then how many more readings fail the stricter gate than the first.`,
  answer: [N1, N2, N2 - N1],
  hints: ['A reading 1 ÷ n is under ε exactly when n is above 1 ÷ ε. For each gate, work out 1 ÷ ε and take the first whole number strictly above it; a whole-number value of 1 ÷ ε is not enough.', 'The readings that fail are the ones numbered below N. The stricter gate fails the numbers from the first gate’s N up to one below its own N.'],
  solution: `For ε = ${x1}, 1 ÷ ${x1} is ${inv(e1)}, so the first whole number strictly above it is N = ${n(N1)}. For ε = ${x2}, 1 ÷ ${x2} is ${inv(e2)}, so N = ${n(N2)}. Readings numbered below N fail, which is ${n(N1 - 1)} readings for the first gate and ${n(N2 - 1)} for the stricter one, so ${n(N2 - 1)} − ${n(N1 - 1)} = ${n(N2 - N1)} more readings fail.`,
  guidance: [
   { prompt: `What is the smallest whole number N with 1 ÷ N < ${x1}?`, answer: [N1], explanation: `1 ÷ ${x1} is ${inv(e1)}, and N must be strictly above it, so N = ${n(N1)}.` },
   { prompt: `What is the smallest whole number N with 1 ÷ N < ${x2}?`, answer: [N2], explanation: `1 ÷ ${x2} is ${inv(e2)}, and N must be strictly above it, so N = ${n(N2)}.` },
   { prompt: `Readings numbered below N fail. How many more readings fail the stricter gate than the first, N − 1 for each?`, answer: [N2 - N1], explanation: `${n(N2 - 1)} − ${n(N1 - 1)} = ${n(N2 - N1)}.` }
  ] }; }
});

/* ε = p ÷ q with p from 2 to 5, so N is the first whole number above q ÷ p; then a proved sum formula at n = N.
   Not 2 ÷ 25 or 3 ÷ 100 (0.08 and 0.03 are the learn mission's own numbers). */
mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q37', title: 'A tolerance written as a fraction',
 brief: 'The tolerance for the new relay is written as a fraction, and Mira wants the point after which every reading is under it, then a proved count for that many steps.',
 labels: ['N', 'formula value at n = N'], tolerance: 0.01,
 gl: [['whole-number part of q ÷ p'], ['N'], ['formula value at n = N']]
}, {
 canonical: { p: 3, q: 40, f: 'sq' },
 draw: R => { let p, q; do { p = R.int(2, 5); q = R.int(12 * p, 60 * p); } while (gcd(p, q) !== 1 || (p === 2 && q === 25) || (p === 3 && q === 100)); return { p, q, f: R.pick(['sq', 'nat', 'even']) }; },
 build: ({ p, q, f }) => { const F = SUMS[f], w = Math.floor(q / p), N = w + 1, V = F.S(N), exact = q % p === 0, eps = `${n(p)} ÷ ${n(q)}`; return {
  prompt: `The tolerance for a new relay is the fraction ε = ${eps}. The claim “for every ε there is an N” is that 1 ÷ n < ε for every whole number n ≥ N. Enter the smallest whole number N that works for this ε. Then the formula ${F.formula}, proved by induction, gives a value for n = N: enter it (type it without commas).`,
  answer: [N, V],
  hints: [`1 ÷ n < ${eps} means the same as n > 1 ÷ (${eps}), which is ${n(q)} ÷ ${n(p)}. Work out ${n(q)} ÷ ${n(p)} and take the first whole number strictly above it.`, 'Put your N in place of n on the right side of the formula.'],
  solution: `1 ÷ n < ${eps} exactly when n > ${n(q)} ÷ ${n(p)}, which is ${exact ? `${n(w)} exactly` : `about ${n(Math.round(q * 100 / p) / 100)}`}. The first whole number strictly above it is N = ${n(N)}. The formula at n = ${n(N)} gives ${F.Sat(N)}.`,
  guidance: [
   { prompt: `What is ${n(q)} ÷ ${n(p)}? If it is not a whole number, enter its whole-number part.`, answer: [w], explanation: `${n(q)} ÷ ${n(p)} is ${exact ? `${n(w)} exactly` : `about ${n(Math.round(q * 100 / p) / 100)}, so its whole-number part is ${n(w)}`}.` },
   { prompt: `What is the smallest whole number N with 1 ÷ N < ${eps}?`, answer: [N], explanation: `N must be strictly above ${n(q)} ÷ ${n(p)}, so N = ${n(N)}.${exact ? ` At n = ${n(w)}, 1 ÷ n equals ${eps}, which is not less than it.` : ''}` },
   { prompt: `Put n = ${n(N)} into the right side of ${F.formula}. What is the value?`, answer: [V], explanation: F.Sat(N) + '.' }
  ] }; }
});

})();
