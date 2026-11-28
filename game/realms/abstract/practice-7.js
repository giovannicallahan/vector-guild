/* Abstract algebra: patterns of moves practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p7.js. */
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

/* Small helpers (the generators of the learn missions keep theirs private). */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const phi = m => { let c = 0; for (let i = 1; i <= m; i++) if (gcd(i, m) === 1) c++; return c; };
const primesOf = m => { const out = []; let x = m; for (let p = 2; p * p <= x; p++) if (x % p === 0) { let e = 0; while (x % p === 0) { x /= p; e++; } out.push([p, e]); } if (x > 1) out.push([x, 1]); return out; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const Z = m => 'Z' + String(m).split('').map(d => SUB[+d]).join('');
const pw = (p, e) => e === 1 ? n(p) : `${n(p)}${sup(e)}`;
const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
/* Plural from a helper, never a glued "s": pl(1, 'step') is "1 step", pl(3, 'step') is "3 steps". */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const list = xs => xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const shuf = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* Partitions of e, largest part first. */
const parts = (e, max = e) => { if (e === 0) return [[]]; const out = []; for (let k = Math.min(e, max); k >= 1; k--) for (const rest of parts(e - k, k)) out.push([k, ...rest]); return out; };
const PART = [1, 1, 2, 3, 5, 7, 11, 15, 22];
const wr = t => t.map(n).join(' + ');
/* Cycle types for S_m: lists of cycle lengths, all at least 2, adding to at most m (the rest are fixed symbols). */
const types = m => { const out = []; for (let s = 2; s <= m; s++) for (const t of parts(s)) if (t[t.length - 1] >= 2) out.push(t); return out; };
/* A cycle type in words, with the size of its class n! ÷ (product of k^m × m!) and the order, as the q32 mission works them. */
const type32 = (m, type) => { const fixed = m - type.reduce((s, k) => s + k, 0), groups = [];
 for (const k of [...new Set(type)]) groups.push([k, type.filter(x => x === k).length]);
 const words = groups.map(([k, c]) => `${WORD[c]} ${n(k)}-cycle${c === 1 ? '' : 's'}`);
 const desc = `${list(words)}, ${fixed === 0 ? 'with no tile left in its place' : fixed === 1 ? 'with 1 tile left in its place' : `with ${n(fixed)} tiles left in their places`}`;
 const all = fixed ? [...groups, [1, fixed]] : groups;
 const factors = all.map(([k, c]) => ({ k, c, v: Math.pow(k, c) * fact(c), text: `${pw(k, c)} × ${n(c)}! = ${n(Math.pow(k, c) * fact(c))}` }));
 const den = factors.reduce((s, f) => s * f.v, 1), N = fact(m), size = N / den, order = type.reduce((s, k) => lcm(s, k), 1);
 const ordText = type.length === 1 ? `${n(order)}, the length of its one cycle` : `lcm(${type.map(n).join(', ')}) = ${n(order)}`;
 return { fixed, desc, factors, den, N, size, order, ordText };
};
/* Burnside for a ring of m tiles in k colours that is turned but never flipped. */
const ring33 = (m, k) => { const fix = []; for (let r = 0; r < m; r++) fix.push(Math.pow(k, gcd(r, m))); const sum = fix.reduce((s, v) => s + v, 0); return { fix, sum, count: sum / m }; };
const abel = N => { const f = primesOf(N); return { f, total: f.reduce((s, [, e]) => s * PART[e], 1) }; };
const facText = f => f.map(([p, e]) => pw(p, e)).join(' × ');
const waysText = ([p, e]) => e === 1 ? `${pw(p, e)}: the exponent 1 can only be 1, so 1 way` : `${pw(p, e)}: ${n(e)} can be written as ${list(parts(e).map(wr))}, so ${n(PART[e])} ways`;
/* Orders from 12 to 500 with two or more primes and at least one exponent of 2 or more; never 72 or 144 (q34's own examples). */
const ABEL = []; for (let N = 12; N <= 500; N++) { const f = primesOf(N); if (f.length >= 2 && f.some(([, e]) => e >= 2) && N !== 72 && N !== 144) ABEL.push(N); }
/* The orders in ABEL with two or more primes raised to a power of 2 or more: half the q34b draws use them, so that the two answers differ. */
const ABEL2 = ABEL.filter(N => primesOf(N).filter(([, e]) => e >= 2).length >= 2);
const divisors = m => { const d = []; for (let i = 1; i <= m; i++) if (m % i === 0) d.push(i); return d; };
const COMP = (lo, hi, skip) => { const out = []; for (let N = lo; N <= hi; N++) if (!skip.includes(N) && primesOf(N).reduce((s, [, e]) => s + e, 0) >= 2) out.push(N); return out; };
const many = (...xs) => xs.some(x => x >= 1000);

/* ---- q31 Orbit–stabiliser theorem [14.1] ---- */

/* A rack of m items in m places, every reordering allowed: any item reaches any place, so the orbit is m and the stabiliser N ÷ m. */
const RACK = [
 { it: 'bolt', its: 'bolts', pc: 'slot', pcs: 'slots' },
 { it: 'lamp', its: 'lamps', pc: 'socket', pcs: 'sockets' },
 { it: 'tile', its: 'tiles', pc: 'frame', pcs: 'frames' },
 { it: 'sensor', its: 'sensors', pc: 'bracket', pcs: 'brackets' }
];
mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The rack of swappable parts',
 brief: 'A parts rack lets every part be swapped into any place, and the crew wants to know how many swaps keep one or two chosen parts where they are.',
 labels: ['stabiliser of one part', 'reorderings fixing both parts'], tolerance: 0.01,
 gl: [['stabiliser size'], ['reorderings fixing both parts']]
}, {
 /* Every reordering of m items among m places, so the group has fact(m) moves. m from 4 to 8, the item numbers j and k (j ≠ k)
    from 1 to m, and one of four wordings (an index into RACK). The stabiliser of j has (m − 1)! moves; inside it, k can still go to
    any of the other m − 1 places, so (m − 2)! moves fix both. */
 canonical: { m: 5, j: 3, k: 1, w: 0 },
 draw: R => { const m = R.int(4, 8), j = R.int(1, m); let k = R.int(1, m - 1); if (k >= j) k++; return { m, j, k, w: R.int(0, 3) }; },
 build: ({ m, j, k, w }) => { const { it, its, pc, pcs } = RACK[w], N = fact(m), s = N / m, s2 = s / (m - 1), big = many(s, N); return {
  prompt: `A rack in the Tile Studio holds ${n(m)} ${its}, one in each of ${n(m)} ${pcs} numbered 1 to ${n(m)}. Any reordering of the ${its} among the ${pcs} is allowed (the do-nothing reordering included), and the ${n(N)} reorderings form a group. Any ${it} can be sent to any ${pc}. Enter the size of the stabiliser of ${it} number ${n(j)}: the number of these reorderings that leave it in its own ${pc}. Then enter how many of the reorderings leave both ${it} number ${n(j)} and ${it} number ${n(k)} in their own ${pcs}${big ? ' (type the numbers without commas)' : ''}.`,
  answer: [s, s2],
  hints: [`The orbit of one ${it} is every ${pc} it can be sent to. The orbit–stabiliser theorem: the size of the orbit times the size of the stabiliser is the size of the group.`, `The reorderings that keep the first ${it} in place form a group of their own, and they can still send the second ${it} to any ${pc} except the one the first ${it} keeps. Use the theorem again inside that group.`],
  solution: `Any ${it} can be sent to any ${pc}, so the orbit of ${it} number ${n(j)} is all ${n(m)} ${pcs}. By the orbit–stabiliser theorem, its stabiliser has ${n(N)} ÷ ${n(m)} = ${n(s)} reorderings. Those ${n(s)} reorderings form a group, and in it ${it} number ${n(k)} can still reach any of the other ${pl(m - 1, pc)}, so the reorderings that also keep ${it} number ${n(k)} in place number ${n(s)} ÷ ${n(m - 1)} = ${n(s2)}.`,
  guidance: [
   { prompt: `The orbit of ${it} number ${n(j)} is all ${n(m)} ${pcs}, and the group has ${n(N)} reorderings. How many reorderings leave ${it} number ${n(j)} in its own ${pc}?`, answer: [s], explanation: `Orbit size × stabiliser size = group size, so the stabiliser has ${n(N)} ÷ ${n(m)} = ${n(s)} reorderings.` },
   { prompt: `Inside that stabiliser, ${it} number ${n(k)} can still be sent to any of the other ${pl(m - 1, pc)}. How many of those ${n(s)} reorderings also leave ${it} number ${n(k)} in its own ${pc}?`, answer: [s2], explanation: `Use the theorem inside the stabiliser: ${n(s)} ÷ ${n(m - 1)} = ${n(s2)}. Check: with both held, the other ${pl(m - 2, it)} can be reordered in ${n(s2)} ways.` }
  ] }; }
});

/* Solids whose turns reach every face, edge or corner from any other (the cube's faces are the learn mission's own example). */
const SOL = {
 cubeE: { solid: 'a solid cube', G: 24, item: 'edge', orbit: 12, stab: 2 },
 cubeC: { solid: 'a solid cube', G: 24, item: 'corner', orbit: 8, stab: 3 },
 octF: { solid: 'a regular octahedron (two square-based pyramids joined base to base, every face an equal triangle)', G: 24, item: 'face', orbit: 8, stab: 3 },
 octC: { solid: 'a regular octahedron (two square-based pyramids joined base to base, every face an equal triangle)', G: 24, item: 'corner', orbit: 6, stab: 4 },
 octE: { solid: 'a regular octahedron (two square-based pyramids joined base to base, every face an equal triangle)', G: 24, item: 'edge', orbit: 12, stab: 2 },
 tetF: { solid: 'a regular tetrahedron (a pyramid whose base and three sides are equal triangles)', G: 12, item: 'face', orbit: 4, stab: 3 },
 tetC: { solid: 'a regular tetrahedron (a pyramid whose base and three sides are equal triangles)', G: 12, item: 'corner', orbit: 4, stab: 3 },
 tetE: { solid: 'a regular tetrahedron (a pyramid whose base and three sides are equal triangles)', G: 12, item: 'edge', orbit: 6, stab: 2 }
};
mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The jig that accepts several places',
 brief: 'A printing jig will take a marked part of the stamp in several accepted places, and the crew needs to know how many turns satisfy it.',
 labels: ['orbit size', 'stabiliser size', 'turns that fit'], tolerance: 0.01,
 gl: [['orbit size'], ['stabiliser size'], ['turns that fit']]
}, {
 /* The k accepted places are some of the orbit's places, 2 ≤ k < orbit, so the answer is k × stabiliser. Never the cube's faces. */
 canonical: { kind: 'octC', k: 3 },
 draw: R => { const kind = R.pick(Object.keys(SOL)); return { kind, k: R.int(2, SOL[kind].orbit - 1) }; },
 build: ({ kind, k }) => { const s = SOL[kind], it = s.item, its = it + 's', fit = k * s.stab; return {
  prompt: `The Tile Studio’s printing jig presses ${s.solid}. The ${n(s.G)} turns that carry the solid onto itself (the do-nothing turn included) form a group, and one of them carries any ${it} to the place of any other ${it}. One ${it} is marked. The jig accepts the marked ${it} in any of ${n(k)} particular ${its}’ places and does not care where the rest of the solid ends up. Each place the marked ${it} can reach is reached by the same number of turns. Enter the size of the orbit of the marked ${it}, the size of its stabiliser, then how many of the ${n(s.G)} turns put the marked ${it} in one of the ${n(k)} accepted places.`,
  answer: [s.orbit, s.stab, fit],
  hints: [`The orbit of the marked ${it} is every place it can be carried to. Any ${it} can reach any other, so count the ${its}.`, 'The orbit–stabiliser theorem gives the stabiliser: group size ÷ orbit size. The turns that carry the marked part to one particular place are as many as the stabiliser has.', 'The accepted places are different places, so the turns that reach them are different turns: add up one lot for each place.'],
  solution: `Any ${it} can be carried to the place of any other, so the orbit is all ${n(s.orbit)} ${its}. By the orbit–stabiliser theorem the stabiliser has ${n(s.G)} ÷ ${n(s.orbit)} = ${n(s.stab)} turns. Each place in the orbit is reached by ${n(s.stab)} turns, so the ${n(k)} accepted places are reached by ${n(k)} × ${n(s.stab)} = ${n(fit)} turns.`,
  guidance: [
   { prompt: `Any ${it} can be carried to the place of any other. How many places can the marked ${it} reach: how many ${its} does the solid have?`, answer: [s.orbit], explanation: `The orbit is every place the marked ${it} can be carried to: ${n(s.orbit)} ${its}.` },
   { prompt: `The group has ${n(s.G)} turns and the orbit has ${n(s.orbit)} places. How many turns leave the marked ${it} in its own place?`, answer: [s.stab], explanation: `Orbit size × stabiliser size = group size, so the stabiliser has ${n(s.G)} ÷ ${n(s.orbit)} = ${n(s.stab)} turns.` },
   { prompt: `Each place is reached by ${n(s.stab)} turns. How many turns put the marked ${it} in one of the ${n(k)} accepted places?`, answer: [fit], explanation: `${n(k)} places, ${n(s.stab)} turns for each: ${n(k)} × ${n(s.stab)} = ${n(fit)} turns.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q20', title: 'Two families of layouts',
 brief: 'The studio’s layout file splits into two families, and the crew knows only how many moves hold one layout of each family still.',
 labels: ['orbit of A', 'orbit of B', 'layouts on file'], tolerance: 0.01,
 gl: [['orbit of A'], ['orbit of B'], ['layouts on file']]
}, {
 /* g from a list of group sizes; the two stabiliser sizes are different divisors of g with an orbit of at least 3 (so at most g ÷ 3).
    The two orbits are different, so they share no layout and their sizes add. */
 canonical: { g: 120, sa: 8, sb: 20 },
 draw: R => { const g = R.pick([60, 72, 84, 90, 120, 144, 180, 240, 360]), ds = divisors(g).filter(d => d >= 2 && d <= g / 3), sa = R.pick(ds), sb = R.pick(ds.filter(d => d !== sa)); return { g, sa, sb }; },
 build: ({ g, sa, sb }) => { const oa = g / sa, ob = g / sb, tot = oa + ob; return {
  prompt: `A group of ${n(g)} moves acts on the tile layouts that the Tile Studio keeps on file. Layout A is held in place by ${n(sa)} of the moves (its stabiliser), and layout B is held in place by ${n(sb)} of them. A and B lie in different orbits, and the layouts on file are exactly these two orbits and nothing else. Enter the size of the orbit of A, the size of the orbit of B, then the number of layouts on file.`,
  answer: [oa, ob, tot],
  hints: ['The orbit–stabiliser theorem: the size of an orbit is the size of the group divided by the size of the stabiliser (the index of the stabiliser, as in Lagrange’s theorem).', 'Two different orbits have no layout in common, so the number of layouts on file is the sum of the sizes of the two orbits.'],
  solution: `By the orbit–stabiliser theorem, |orbit of A| = ${n(g)} ÷ ${n(sa)} = ${n(oa)} and |orbit of B| = ${n(g)} ÷ ${n(sb)} = ${n(ob)}. The two orbits share no layout and make up the whole file, so there are ${n(oa)} + ${n(ob)} = ${n(tot)} layouts on file.`,
  guidance: [
   { prompt: `The group has ${n(g)} moves and the stabiliser of A has ${n(sa)}. What is the size of the orbit of A?`, answer: [oa], explanation: `Orbit size = group size ÷ stabiliser size = ${n(g)} ÷ ${n(sa)} = ${n(oa)}.` },
   { prompt: `The stabiliser of B has ${n(sb)} moves. What is the size of the orbit of B?`, answer: [ob], explanation: `${n(g)} ÷ ${n(sb)} = ${n(ob)}.` },
   { prompt: `The two orbits have no layout in common and fill the file. How many layouts are on file?`, answer: [tot], explanation: `${n(oa)} + ${n(ob)} = ${n(tot)} layouts.` }
  ] }; }
});

/* ---- q32 Conjugacy classes in Sₙ [14.2] ---- */

const cyc = c => `(${c.map(n).join(' ')})`;
mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'The forklift run',
 brief: 'A forklift moves pallets in loops and swaps, and the loading bay wants to know how many runs have exactly the same shape.',
 labels: ['class size', 'order'], tolerance: 0.01,
 gl: [['ways each is written'], ['class size'], ['order']]
}, {
 /* A permutation of m pallets given in cycle notation (pallets not written stay put). m from 4 to 7, any type with a cycle of length 2 or
    more, never the learn mission's two examples (S₅ with two 2-cycles, S₆ with a 3-cycle and a 2-cycle). The labels in the cycles are a
    random arrangement of 1 to m. */
 canonical: { m: 7, cycles: [[2, 5, 1, 7], [3, 6]] },
 draw: R => { const m = R.int(4, 7), ts = types(m).filter(t => !(m === 5 && t.join() === '2,2') && !(m === 6 && t.join() === '3,2')), t = R.pick(ts), lab = shuf(R, Array.from({ length: m }, (_, i) => i + 1)); let at = 0; const cycles = t.map(k => { const c = lab.slice(at, at + k); at += k; return c; }); return { m, cycles }; },
 build: ({ m, cycles }) => { const t = type32(m, cycles.map(c => c.length)), used = cycles.flat(), left = Array.from({ length: m }, (_, i) => i + 1).filter(x => !used.includes(x)), big = t.size >= 1000; return {
  prompt: `A loading bay in the Tile Studio holds ${n(m)} pallets, numbered 1 to ${n(m)}, and a forklift run moves them by the permutation ${cycles.map(cyc).join('')}, in cycle notation. A pallet that is not written stays in its place. Enter how many permutations of the ${n(m)} pallets have exactly the same cycle lengths as this one (this one included, and each pallet left in its place counting as a cycle of length 1), then the order of this permutation${big ? ' (type the first number without commas)' : ''}.`,
  answer: [t.size, t.order],
  hints: ['Write the n symbols in any of the n! orders into the brackets of the pattern. Each k-cycle can be started at any of its k symbols, and cycles of the same length can be listed in any order, so divide n! by kᵐ × m! for each length k that appears m times (fixed symbols count as cycles of length 1).', 'The order of a permutation is the lcm of its cycle lengths, and every permutation with the same cycle lengths has that same order.'],
  solution: `The cycle lengths are ${list(cycles.map(c => n(c.length)))}${left.length ? `, and ${left.length === 1 ? `pallet ${n(left[0])} is` : `pallets ${list(left.map(n))} are`} not written, so ${left.length === 1 ? 'it stays' : 'they stay'} in place as ${left.length === 1 ? 'a cycle' : 'cycles'} of length 1` : ''}. Writing the pallets into this pattern in all ${n(m)}! = ${n(t.N)} orders writes each permutation once for every way of writing it: ${list(t.factors.map(f => f.text))}, so ${n(t.den)} ways in all. So the class has ${n(t.N)} ÷ ${n(t.den)} = ${n(t.size)} permutations. Each has order ${t.ordText}.`,
  guidance: [
   { prompt: `Reading the cycle lengths off the permutation, count its fixed pallets as cycles of length 1. For each length k that appears m times, work out kᵐ × m!, and multiply these together. How many ways is each permutation of this shape written?`, answer: [t.den], explanation: `${list(t.factors.map(f => f.text))}; multiplied together: ${n(t.den)}.` },
   { prompt: `There are ${n(t.N)} ways to write the ${n(m)} pallets in a row. Divide by the number of ways each permutation is written. How many permutations are in the class?`, answer: [t.size], explanation: `${n(t.N)} ÷ ${n(t.den)} = ${n(t.size)}.` },
   { prompt: `What is the order of the permutation ${cycles.map(cyc).join('')}?`, answer: [t.order], explanation: `The order is the lcm of the cycle lengths: ${t.ordText}.` }
  ] }; }
});

const BOT = ['sorting line', 'laying robot', 'tile sorter'];
mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Testing every shuffle of one shape',
 brief: 'The tile robot is tested on every reordering of one shape, and the crew wants to know how many repeats the whole test takes.',
 labels: ['class size', 'repeats for one', 'repeats in all'], tolerance: 0.01,
 gl: [['class size'], ['repeats for one'], ['repeats in all']]
}, {
 /* m from 5 to 7 and a type with a cycle of length 2 or more, never the learn mission's two examples. w picks one of three wordings (index into BOT). */
 canonical: { m: 7, type: [3, 3], w: 1 },
 draw: R => { const m = R.int(5, 7), ts = types(m).filter(t => !(m === 5 && t.join() === '2,2') && !(m === 6 && t.join() === '3,2')); return { m, type: R.pick(ts), w: R.int(0, 2) }; },
 build: ({ m, type, w }) => { const t = type32(m, type), tot = t.size * t.order, big = many(t.size, tot); return {
  prompt: `A ${BOT[w]} in the Tile Studio reorders a row of ${n(m)} tiles with a permutation made of ${t.desc}. It repeats the same permutation again and again until the tiles are back in their starting order. The crew tests every permutation of the ${n(m)} tiles with exactly these cycle lengths, once each, repeating each one until the tiles are back in order. Enter how many permutations are tested, how many repeats one of them needs, then the total number of repeats over the whole test${big ? ' (type the numbers without commas)' : ''}.`,
  answer: [t.size, t.order, tot],
  hints: ['Write the n symbols in any of the n! orders into the brackets of the pattern. Each k-cycle can be started at any of its k symbols, and cycles of the same length can be listed in any order, so divide n! by kᵐ × m! for each length k that appears m times (fixed symbols count as cycles of length 1).', 'The tiles are back in order after as many repeats as the order of the permutation: the lcm of its cycle lengths.'],
  solution: `There are ${n(m)}! = ${n(t.N)} ways to write the tiles into the pattern, and each permutation comes up ${list(t.factors.map(f => f.text))} times over, ${n(t.den)} ways in all, so ${n(t.N)} ÷ ${n(t.den)} = ${n(t.size)} permutations are tested. One permutation needs its order, ${t.ordText}, repeats. All of them have the same cycle lengths, so the whole test takes ${n(t.size)} × ${n(t.order)} = ${n(tot)} repeats.`,
  guidance: [
   { prompt: `How many permutations of the ${n(m)} tiles have exactly these cycle lengths (${t.desc})? Divide ${n(m)}! = ${n(t.N)} by the product of kᵐ × m! over the cycle lengths.`, answer: [t.size], explanation: `The product is ${list(t.factors.map(f => f.text))}, which is ${n(t.den)} in all, and ${n(t.N)} ÷ ${n(t.den)} = ${n(t.size)}.` },
   { prompt: `After how many repeats of one such permutation are the tiles back in their starting order?`, answer: [t.order], explanation: `The order is the lcm of the cycle lengths: ${t.ordText}.` },
   { prompt: `Every tested permutation needs ${n(t.order)} repeats, and ${n(t.size)} of them are tested. How many repeats are made in all?`, answer: [tot], explanation: `${n(t.size)} × ${n(t.order)} = ${n(tot)}.` }
  ] }; }
});

const FLOOR = ['grand floor', 'arena floor', 'plaza floor'];
mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q15', title: 'The grand floor shuffle',
 brief: 'The grand floor has far more tiles than any ring, and the crew wants to know how rare one shuffle shape is among all of them.',
 labels: ['class size', 'order', 'permutations outside the class'], tolerance: 0.01,
 gl: [['ways to order the tiles'], ['class size'], ['order'], ['permutations outside the class']]
}, {
 /* m is 7 or 8 (so every answer stays under 100000); any type with a cycle of length 2 or more; w picks one of three floors (an index into FLOOR).
    The third answer is large, so "without commas" is always said. */
 canonical: { m: 8, type: [4, 3], w: 0 },
 draw: R => { const m = R.pick([7, 8]); return { m, type: R.pick(types(m)), w: R.int(0, 2) }; },
 build: ({ m, type, w }) => { const t = type32(m, type), out = t.N - t.size; return {
  prompt: `The ${FLOOR[w]} of the Tile Studio has a row of ${n(m)} tiles, labelled 1 to ${n(m)}. One reordering is made of ${t.desc}. Its conjugacy class is every permutation of the ${n(m)} tiles with exactly the same cycle lengths. Enter how many permutations are in that class, the order of each of them, then how many of all the permutations of the ${n(m)} tiles are not in that class. Type the numbers without commas.`,
  answer: [t.size, t.order, out],
  hints: ['Write the n symbols in any of the n! orders into the brackets of the pattern. Each k-cycle can be started at any of its k symbols, and cycles of the same length can be listed in any order, so divide n! by kᵐ × m! for each length k that appears m times (fixed symbols count as cycles of length 1).', 'The order of a permutation is the lcm of its cycle lengths. Every permutation of the tiles is in exactly one class, so the ones not in this class are all the permutations (n! of them) minus the class.'],
  solution: `There are ${n(m)}! = ${n(t.N)} ways to write the tiles into the pattern. Each permutation comes up once for every way of writing it: ${list(t.factors.map(f => f.text))}, so ${n(t.den)} ways in all, and the class has ${n(t.N)} ÷ ${n(t.den)} = ${n(t.size)} permutations. Each has order ${t.ordText}. All ${n(t.N)} permutations of the tiles are in all, so ${n(t.N)} − ${n(t.size)} = ${n(out)} are not in the class.`,
  guidance: [
   { prompt: `How many ways are there to write the ${n(m)} tiles in a row: what is ${n(m)}!?`, answer: [t.N], explanation: `${n(m)}! = ${Array.from({ length: m }, (_, i) => n(i + 1)).join(' × ')} = ${n(t.N)}.` },
   { prompt: `Each permutation of this type is written ${n(t.den)} different ways. How many permutations are in the class?`, answer: [t.size], explanation: `${n(t.N)} ÷ ${n(t.den)} = ${n(t.size)}. The ${n(t.den)} comes from ${list(t.factors.map(f => f.text))}, multiplied together.` },
   { prompt: `What is the order of a permutation made of ${t.desc}?`, answer: [t.order], explanation: `The order is the lcm of the cycle lengths: ${t.ordText}.` },
   { prompt: `All ${n(t.N)} permutations of the tiles are counted once. How many are not in the class of ${n(t.size)}?`, answer: [out], explanation: `${n(t.N)} − ${n(t.size)} = ${n(out)}.` }
  ] }; }
});

/* ---- q33 Burnside's counting theorem [14.3] ---- */

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The wheel of lit lamps',
 brief: 'A display wheel lights each lamp in one colour, and the crew wants to know how many truly different light patterns it can show.',
 labels: ['unchanged patterns', 'different designs'], tolerance: 0.01,
 gl: [['unchanged patterns'], ['total'], ['different designs']]
}, {
 /* A wheel of m lamps (3–8) in k colours (2–4), turned r steps (1 to m − 1). Never the learn mission's two examples (6 tiles, 3 colours; 4 tiles, 2 colours). */
 canonical: { m: 8, k: 2, r: 4 },
 draw: R => { let m, k; for (let i = 0; i < 1000; i++) { m = R.int(3, 8); k = R.int(2, 4); if (!(m === 4 && k === 2) && !(m === 6 && k === 3)) break; } if ((m === 4 && k === 2) || (m === 6 && k === 3)) { m = 8; k = 2; } return { m, k, r: R.int(1, m - 1) }; },
 build: ({ m, k, r }) => { const c = ring33(m, k), g = gcd(r, m), f = Math.pow(k, g), fx = g === 1 ? n(f) : `${pw(k, g)} = ${n(f)}`, big = many(c.count, f, c.sum); return {
  prompt: `A display wheel in the Tile Studio has ${n(m)} lamps spaced evenly round its rim. Each lamp is lit in one of ${n(k)} colours. The wheel can be turned but never flipped over, and two light patterns count as the same design when a turn of the wheel carries one onto the other. Enter how many patterns are left unchanged by a turn of ${pl(r, 'step')} (one step moves every lamp on to the next place), then how many truly different designs there are${big ? ' (type the numbers without commas)' : ''}.`,
  answer: [f, c.count],
  hints: ['A turn of r steps around n places splits them into gcd(r, n) cycles, and a pattern is unchanged only if every place in a cycle has the same colour.', 'Burnside’s theorem: the number of different designs is the average, over all the turns (the do-nothing turn included), of the number of patterns each turn leaves unchanged.'],
  solution: `A turn of ${pl(r, 'step')} splits the ${n(m)} lamps into gcd(${n(r)}, ${n(m)}) = ${pl(g, 'cycle')}, and each cycle must be one colour, so it leaves ${fx} patterns unchanged. Over the turns of 0 to ${n(m - 1)} steps the unchanged counts are ${list(c.fix.map(n))}, which add up to ${n(c.sum)}. Burnside’s theorem divides by the ${n(m)} turns: ${n(c.sum)} ÷ ${n(m)} = ${n(c.count)} different designs.`,
  guidance: [
   { prompt: `A turn of ${pl(r, 'step')} splits the ${n(m)} lamps into cycles, and every lamp in a cycle must have the same colour. How many patterns does the turn leave unchanged?`, answer: [f], explanation: `It makes gcd(${n(r)}, ${n(m)}) = ${pl(g, 'cycle')}; each is one of ${n(k)} colours, so ${fx} patterns are unchanged.` },
   { prompt: `Add up the unchanged patterns over all ${n(m)} turns, from 0 steps (which changes nothing) to ${pl(m - 1, 'step')}. What is the total?`, answer: [c.sum], explanation: `The counts are ${list(c.fix.map(n))}, one for each turn, and they add up to ${n(c.sum)}.` },
   { prompt: `Divide the total by the number of turns. How many different designs are there?`, answer: [c.count], explanation: `${n(c.sum)} ÷ ${n(m)} = ${n(c.count)}: the number of orbits, here the designs, is the average number of patterns a turn leaves unchanged.` }
  ] }; }
});

const WH = ['round the skylight', 'round the fountain basin', 'round the dome’s lantern', 'round the tool-store door'];
mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Stocking one of each ring',
 brief: 'The studio will stock one ring of each truly different design, and the crew wants to know how many fewer rings that is than one per colouring.',
 labels: ['total over all turns', 'different designs', 'fewer rings'], tolerance: 0.01,
 gl: [['total over all turns'], ['different designs'], ['fewer rings']]
}, {
 /* m from 4 to 9 tiles, k 2 or 3 colours, four wordings (an index into WH); never the learn mission's two examples. */
 canonical: { m: 5, k: 3, w: 0 },
 draw: R => { let m, k; for (let i = 0; i < 1000; i++) { m = R.int(4, 9); k = R.int(2, 3); if (!(m === 4 && k === 2) && !(m === 6 && k === 3)) break; } if ((m === 4 && k === 2) || (m === 6 && k === 3)) { m = 5; k = 3; } return { m, k, w: R.int(0, 3) }; },
 build: ({ m, k, w }) => { const c = ring33(m, k), all = Math.pow(k, m), fewer = all - c.count, big = many(c.sum, c.count, fewer); return {
  prompt: `The Tile Studio will stock rings of ${n(m)} tiles to fit ${WH[w]}. Each tile is one of ${n(k)} colours. A ring can be turned but never flipped over, and two rings count as the same design when a turn of one carries it onto the other. The studio will make one ring of each truly different design, instead of one for every colouring (there are ${n(all)} colourings). Enter the total, over all ${n(m)} turns of 0 to ${n(m - 1)} steps, of the colourings each turn leaves unchanged, then the number of different designs, then how many fewer rings the studio makes than if it made one for every colouring${big ? ' (type the numbers without commas)' : ''}.`,
  answer: [c.sum, c.count, fewer],
  hints: ['A turn of r steps around n tiles splits them into gcd(r, n) cycles, and a colouring is unchanged only if every tile in a cycle has the same colour, so with k colours it leaves k to the power gcd(r, n) colourings unchanged (the do-nothing turn leaves all of them).', 'Burnside’s theorem: the number of different designs is the total divided by the number of turns.'],
  solution: `The turns of 0 to ${n(m - 1)} steps split the ring into ${list(Array.from({ length: m }, (_, r) => n(gcd(r, m))))} cycles, so they leave ${list(c.fix.map(n))} colourings unchanged, which add up to ${n(c.sum)}. Burnside’s theorem divides by the ${n(m)} turns: ${n(c.sum)} ÷ ${n(m)} = ${n(c.count)} different designs. One ring for every colouring would be ${n(all)} rings, so the studio makes ${n(all)} − ${n(c.count)} = ${n(fewer)} fewer.`,
  guidance: [
   { prompt: `Add up, over the ${n(m)} turns from 0 steps (which changes nothing) to ${pl(m - 1, 'step')}, the colourings each turn leaves unchanged. What is the total?`, answer: [c.sum], explanation: `The counts are ${list(c.fix.map(n))}, one for each turn, and they add up to ${n(c.sum)}.` },
   { prompt: `Divide the total by the number of turns. How many different designs are there?`, answer: [c.count], explanation: `${n(c.sum)} ÷ ${n(m)} = ${n(c.count)} different designs.` },
   { prompt: `There are ${n(all)} colourings. How many fewer rings is ${n(c.count)} designs than one ring for every colouring?`, answer: [fewer], explanation: `${n(all)} − ${n(c.count)} = ${n(fewer)}.` }
  ] }; }
});

const WH2 = ['round the lantern of the dome', 'round the crater window', 'round the courtyard fountain'];
mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', title: 'The long ring of tiles',
 brief: 'A long ring needs a count of its designs, and the crew has spotted that only some of its turns scramble the colours completely.',
 labels: ['turns that leave only k colourings unchanged', 'different designs'], tolerance: 0.01,
 gl: [['turns'], ['total'], ['different designs']]
}, {
 /* Larger rings: k = 2 with 9 to 16 tiles, k = 3 with 9 to 12, k = 4 with 9 tiles (so every answer stays under 100000 and every count stays in whole-number range). w picks a wording (index into WH2).
    The turns that leave exactly k colourings unchanged are those with gcd(r, m) = 1 (k to the power g equals k only when g is 1, since k ≥ 2), so r from 1 to m − 1; there are phi(m). */
 canonical: { m: 10, k: 2, w: 0 },
 draw: R => { const k = R.int(2, 4), m = k === 2 ? R.int(9, 16) : k === 3 ? R.int(9, 12) : 9; return { m, k, w: R.int(0, 2) }; },
 build: ({ m, k, w }) => { const c = ring33(m, k), ph = phi(m), big = many(c.count, c.sum); return {
  prompt: `A ring of ${n(m)} tiles runs ${WH2[w]}. Each tile is one of ${n(k)} colours. The ring can be turned but never flipped over, and two colourings count as the same design when a turn of the ring carries one onto the other. A turn of r steps, for r from 0 to ${n(m - 1)} (0 steps is the do-nothing turn), leaves some of the colourings unchanged. Enter how many of these ${n(m)} turns leave exactly ${n(k)} colourings unchanged, then how many truly different designs there are${big ? ' (type the second number without commas)' : ''}.`,
  answer: [ph, c.count],
  hints: ['A turn of r steps around n tiles splits them into gcd(r, n) cycles, and it leaves k to the power gcd(r, n) colourings unchanged. With k at least 2, k to the power g is as small as k only when g is 1.', 'Burnside’s theorem: the number of different designs is the average, over all the turns (the do-nothing turn included), of the number of colourings each turn leaves unchanged.'],
  solution: `A turn of r steps leaves ${n(k)} to the power gcd(r, ${n(m)}) colourings unchanged, and this equals ${n(k)} only when gcd(r, ${n(m)}) = 1. Among r from 1 to ${n(m - 1)} these r are ${list(Array.from({ length: m - 1 }, (_, i) => i + 1).filter(r => gcd(r, m) === 1).map(n))}: ${n(ph)} turns. Over all ${n(m)} turns the unchanged counts are ${list(c.fix.map(n))}, which add up to ${n(c.sum)}. Burnside’s theorem divides by ${n(m)}: ${n(c.sum)} ÷ ${n(m)} = ${n(c.count)} different designs.`,
  guidance: [
   { prompt: `A turn of r steps leaves exactly ${n(k)} colourings unchanged only when gcd(r, ${n(m)}) = 1. How many r from 1 to ${n(m - 1)} have gcd(r, ${n(m)}) = 1?`, answer: [ph], explanation: `The r with gcd(r, ${n(m)}) = 1 are ${list(Array.from({ length: m - 1 }, (_, i) => i + 1).filter(r => gcd(r, m) === 1).map(n))}: ${n(ph)} of them.` },
   { prompt: `Add up the unchanged colourings over all ${n(m)} turns, from 0 steps (which changes nothing) to ${pl(m - 1, 'step')}. What is the total?`, answer: [c.sum], explanation: `The counts are ${list(c.fix.map(n))}, one for each turn, and they add up to ${n(c.sum)}.` },
   { prompt: `Divide the total by the number of turns. How many different designs are there?`, answer: [c.count], explanation: `${n(c.sum)} ÷ ${n(m)} = ${n(c.count)} different designs.` }
  ] }; }
});

/* ---- q34 Finite abelian groups [13.1] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'Glaze shelves by symmetry',
 brief: 'The glaze store files its pigments by symmetry group, and the crew wants to know how many shelves each order of group needs.',
 labels: ['groups of the prime part', 'groups of the whole order'], tolerance: 0.01,
 gl: [['groups of the prime part'], ['groups of the whole order']]
}, {
 /* An order from ABEL (12 to 500, two or more primes, one exponent of 2 or more, never 72 or 144). P is the prime with the largest exponent
    (the smallest of them if tied). The order is given without its factorisation. */
 canonical: { N: 360 },
 draw: R => ({ N: R.pick(R.bool() ? ABEL2 : ABEL) }),
 build: ({ N }) => { const a = abel(N); let top = a.f[0]; for (const pe of a.f) if (pe[1] > top[1]) top = pe; const [P, E] = top; return {
  prompt: `The Tile Studio’s glaze store files pigments on shelves, one shelf for each abelian group a pattern of order ${n(N)} could follow, counting groups that are isomorphic (copies of each other) as one. Write ${n(N)} as a product of prime powers. Enter the number of abelian groups whose order is the largest power of ${n(P)} that divides ${n(N)}, then the number of abelian groups of order ${n(N)}.`,
  answer: [PART[E], a.total],
  hints: ['By the fundamental theorem, an abelian group of order pᵉ is a product of cyclic groups whose orders are powers of p, with exponents adding up to e. Count the partitions of e.', 'Each prime is split on its own, so multiply the numbers of partitions of the exponents.'],
  solution: `${n(N)} = ${facText(a.f)}. Each abelian group of order ${n(N)} is a product of cyclic groups of prime-power order, one splitting of the exponent for each prime. ${a.f.map(waysText).join('; ')}. The largest power of ${n(P)} that divides ${n(N)} is ${pw(P, E)}, so there are ${n(PART[E])} abelian groups of that order, and ${a.f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(a.total)} abelian groups of order ${n(N)}.`,
  guidance: [
   { prompt: `${n(N)} = ${facText(a.f)}. In how many ways can the exponent ${n(E)} of ${n(P)} be written as a sum of positive whole numbers, ignoring order?`, answer: [PART[E]], explanation: `${n(E)} can be written as ${list(parts(E).map(wr))}: ${n(PART[E])} partitions, so ${n(PART[E])} abelian groups of order ${pw(P, E)}.` },
   { prompt: `Multiply the numbers of partitions of all the exponents of ${facText(a.f)}. How many abelian groups of order ${n(N)} are there?`, answer: [a.total], explanation: `The exponents ${list(a.f.map(([, e]) => n(e)))} have ${list(a.f.map(([, e]) => n(PART[e])))} partitions, and ${a.f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(a.total)}.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Drawers for two batches',
 brief: 'Two batches of patterns arrive with different orders, and the crew needs one drawer for every abelian group they could follow.',
 labels: ['groups of the first order', 'groups of the second order', 'drawers in all'], tolerance: 0.01,
 gl: [['groups of the first order'], ['groups of the second order'], ['drawers in all']]
}, {
 /* Two different orders from ABEL; never the learn mission's own 72 or the practice file's 360 (canonical of q34b) is not needed: both come from ABEL. */
 canonical: { N1: 200, N2: 126 },
 draw: R => { const N1 = R.pick(ABEL); return { N1, N2: R.pick(ABEL.filter(x => x !== N1)) }; },
 build: ({ N1, N2 }) => { const a = abel(N1), b = abel(N2), tot = a.total + b.total, ex = f => `${f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(f.reduce((s, [, e]) => s * PART[e], 1))}`; return {
  prompt: `Two batches of patterns arrive at the Tile Studio. The first follows a group of order ${n(N1)} and the second follows a group of order ${n(N2)}, and every group is abelian. The crew files one drawer for each abelian group of each order, counting groups that are isomorphic (copies of each other) as one. Enter the number of drawers for order ${n(N1)}, the number for order ${n(N2)}, then the number of drawers in all${tot >= 1000 ? ' (type the numbers without commas)' : ''}.`,
  answer: [a.total, b.total, tot],
  hints: ['An abelian group of order pᵉ is a product of cyclic groups whose orders are powers of p, with exponents adding up to e. The number of ways is the number of partitions of e.', 'Each prime is split on its own, so multiply the numbers of partitions of the exponents. Do this for each order, then add.'],
  solution: `${n(N1)} = ${facText(a.f)}: ${a.f.map(waysText).join('; ')}, so ${ex(a.f)} abelian groups. ${n(N2)} = ${facText(b.f)}: ${b.f.map(waysText).join('; ')}, so ${ex(b.f)} abelian groups. In all that is ${n(a.total)} + ${n(b.total)} = ${n(tot)} drawers.`,
  guidance: [
   { prompt: `${n(N1)} = ${facText(a.f)}. Multiply the numbers of partitions of its exponents. How many abelian groups of order ${n(N1)} are there?`, answer: [a.total], explanation: `The exponents ${list(a.f.map(([, e]) => n(e)))} have ${list(a.f.map(([, e]) => n(PART[e])))} partitions, and ${ex(a.f)}.` },
   { prompt: `${n(N2)} = ${facText(b.f)}. How many abelian groups of order ${n(N2)} are there?`, answer: [b.total], explanation: `The exponents ${list(b.f.map(([, e]) => n(e)))} have ${list(b.f.map(([, e]) => n(PART[e])))} partitions, and ${ex(b.f)}.` },
   { prompt: `One drawer is filed for each group of either order. How many drawers are there in all?`, answer: [tot], explanation: `${n(a.total)} + ${n(b.total)} = ${n(tot)}.` }
  ] }; }
});

/* Orders with two or three primes taken from 2, 3, 5, 7, every exponent from 2 to 6, at most 100000; never 144 (q34's own order). */
const BIG34 = (() => { const out = [], P = [2, 3, 5, 7];
 const go = (i, chosen, N) => { if (i === P.length) { if (chosen.length >= 2 && N <= 100000 && N !== 144) out.push(chosen.slice()); return; }
  go(i + 1, chosen, N); for (let e = 2; e <= 6; e++) { const M = N * Math.pow(P[i], e); if (M <= 100000) { chosen.push([P[i], e]); go(i + 1, chosen, M); chosen.pop(); } } };
 go(0, [], 1); return out; })();
mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', title: 'Orders with high powers',
 brief: 'The biggest dome patterns follow groups of very high order, and the crew wants to know how many of their abelian groups are really tangled.',
 labels: ['abelian groups of the order', 'with no cyclic prime part'], tolerance: 0.01,
 gl: [['partitions of the first exponent'], ['abelian groups of the order'], ['with no cyclic prime part']]
}, {
 /* A list of [prime, exponent] with two or three primes, every exponent 2 to 6. A group is a product of its prime-power parts; the part for a
    prime is cyclic exactly when its partition of the exponent is the single number e, so the count with no cyclic part is the product of
    (partitions − 1). */
 canonical: { f: [[2, 5], [3, 3]] },
 draw: R => ({ f: R.pick(BIG34) }),
 build: ({ f }) => { const N = f.reduce((s, [p, e]) => s * Math.pow(p, e), 1), total = f.reduce((s, [, e]) => s * PART[e], 1), nc = f.reduce((s, [, e]) => s * (PART[e] - 1), 1), [p1, e1] = f[0], big = many(total, nc); return {
  prompt: `One of the biggest dome patterns follows an abelian group of order ${n(N)} = ${facText(f)}. Groups that are isomorphic (copies of each other) count as one. Each such group is a product of its prime-power parts, one for each prime, and the part for a prime p is cyclic only when its exponent is not split up at all, that is, it is a single cyclic group of order pᵉ. Enter the number of abelian groups of order ${n(N)}, then how many of them have a non-cyclic part for each of the primes${big ? ' (type the numbers without commas)' : ''}.`,
  answer: [total, nc],
  hints: ['An abelian group of order pᵉ is a product of cyclic groups whose orders are powers of p, with exponents adding up to e. The number of ways is the number of partitions of e. List them with the parts in decreasing order, starting from e itself, so that none is missed or counted twice. The primes are split independently.', 'For one prime, exactly one of the partitions of e is the single number e, which is the cyclic part. Every other partition gives a part that is not cyclic.'],
  solution: `${f.map(waysText).join('; ')}. So there are ${f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(total)} abelian groups of order ${n(N)}. For each prime exactly one partition is the cyclic one, so ${f.map(([, e]) => n(PART[e] - 1)).join(' × ')} = ${n(nc)} of the groups have a non-cyclic part for each of the primes.`,
  guidance: [
   { prompt: `In how many ways can the exponent ${n(e1)} of ${n(p1)} be written as a sum of positive whole numbers, ignoring order?`, answer: [PART[e1]], explanation: `${n(e1)} can be written as ${list(parts(e1).map(wr))}: ${n(PART[e1])} partitions.` },
   { prompt: `Multiply the numbers of partitions of all the exponents of ${facText(f)}. How many abelian groups of order ${n(N)} are there?`, answer: [total], explanation: `The exponents ${list(f.map(([, e]) => n(e)))} have ${list(f.map(([, e]) => n(PART[e])))} partitions, and ${f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(total)}.` },
   { prompt: `For each prime, one partition is the cyclic one and the rest are not. Multiply, over the primes, the number of partitions that are not the cyclic one. How many groups have a non-cyclic part for each of the primes?`, answer: [nc], explanation: `${f.map(([, e]) => `${n(PART[e])} − 1 = ${n(PART[e] - 1)}`).join(', ')}, and ${f.map(([, e]) => n(PART[e] - 1)).join(' × ')} = ${n(nc)}.` }
  ] }; }
});

/* ---- q35 Rings and zero divisors [16.3] ---- */

const unitsOf = N => { const u = [], z = []; for (let x = 1; x < N; x++) (gcd(x, N) === 1 ? u : z).push(x); return { u, z }; };
mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The gear counter',
 brief: 'A gear counter clicks round a ring of positions, and Mira wants to know which settings can be undone and which can wipe a count out.',
 labels: ['units', 'zero divisors', 'smallest b'], tolerance: 0.01,
 gl: [['units'], ['zero divisors'], ['smallest b']]
}, {
 /* A composite N from 6 to 40 (never 10, the worked example, or 15, the learn mission's own) and a zero divisor a of Z_N. */
 canonical: { N: 18, a: 8 },
 draw: R => { const N = R.pick(COMP(6, 40, [10, 15])), zs = []; for (let a = 2; a < N; a++) if (gcd(a, N) > 1) zs.push(a); return { N, a: R.pick(zs) }; },
 build: ({ N, a }) => { const { u, z } = unitsOf(N), g = gcd(a, N), b = N / g; return {
  prompt: `A gear counter in the Cipher Vault clicks round a ring of ${n(N)} positions, numbered 0 to ${n(N - 1)}. Its settings are added and multiplied mod ${n(N)}, so it works in the ring ${Z(N)}. A non-zero setting is a unit if some setting multiplies with it to give 1, and a zero divisor if some non-zero setting multiplies with it to give 0. Enter how many units the ring has, then how many zero divisors, then the smallest non-zero setting b with ${n(a)} × b = 0 in ${Z(N)}.`,
  answer: [u.length, z.length, b],
  hints: ['A non-zero x in Zₙ is a unit when gcd(x, n) = 1 and a zero divisor when gcd(x, n) > 1. Every non-zero x is exactly one of the two.', 'For a zero divisor a, the product a × b is a multiple of n first when b = n ÷ gcd(a, n).'],
  solution: `The units are the x with gcd(x, ${n(N)}) = 1: ${list(u.map(n))}, ${n(u.length)} of them. The other non-zero numbers, ${list(z.map(n))}, are the ${n(z.length)} zero divisors (${n(N - 1)} − ${n(u.length)} = ${n(z.length)}). gcd(${n(a)}, ${n(N)}) = ${n(g)}, so ${n(a)} × b is first a multiple of ${n(N)} at b = ${n(N)} ÷ ${n(g)} = ${n(b)}: ${n(a)} × ${n(b)} = ${n(a * b)}, which is 0 mod ${n(N)}.`,
  guidance: [
   { prompt: `How many of the numbers 1 to ${n(N - 1)} have gcd 1 with ${n(N)}?`, answer: [u.length], explanation: `They are ${list(u.map(n))}: ${n(u.length)} units.` },
   { prompt: `The other non-zero numbers share a factor with ${n(N)}. How many zero divisors are there?`, answer: [z.length], explanation: `${n(N - 1)} non-zero numbers minus ${n(u.length)} units leaves ${n(z.length)} zero divisors.` },
   { prompt: `gcd(${n(a)}, ${n(N)}) = ${n(g)}. What is the smallest non-zero b with ${n(a)} × b = 0 in ${Z(N)}?`, answer: [b], explanation: `${n(a)} × b must be a multiple of ${n(N)}, which first happens at b = ${n(N)} ÷ ${n(g)} = ${n(b)}.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'The multiplier lock',
 brief: 'A multiplier lock must refuse any setting that wipes a code out, and the crew wants to know how many settings it accepts, refuses and wipes.',
 labels: ['settings accepted', 'settings refused', 'codes wiped out'], tolerance: 0.01,
 gl: [['settings accepted'], ['settings refused'], ['codes wiped out']]
}, {
 /* A composite N from 8 to 40 (never 10 or 15) and a zero divisor a of Z_N. The non-zero b with a × b = 0 are the multiples of N ÷ gcd(a, N)
    below N: gcd(a, N) − 1 of them, and the prompt states that rule. */
 canonical: { N: 24, a: 9 },
 draw: R => { const N = R.pick(COMP(8, 40, [10, 15])), zs = []; for (let a = 2; a < N; a++) if (gcd(a, N) > 1) zs.push(a); return { N, a: R.pick(zs) }; },
 build: ({ N, a }) => { const { u, z } = unitsOf(N), g = gcd(a, N), step = N / g, wiped = g - 1, bs = Array.from({ length: g - 1 }, (_, i) => step * (i + 1)); return {
  prompt: `The Cipher Vault’s multiplier lock multiplies each code by a setting x mod ${n(N)}, so it works in the ring ${Z(N)}. The lock accepts a setting from 1 to ${n(N - 1)} only if some setting multiplies with it to give 1 (a unit) and refuses the rest, which are zero divisors. Enter how many settings the lock accepts, how many it refuses, then, for the refused setting ${n(a)}, how many codes b from 1 to ${n(N - 1)} it wipes out to 0, that is ${n(a)} × b = 0 in ${Z(N)}. (Those codes b are exactly the non-zero multiples of ${n(N)} ÷ gcd(${n(a)}, ${n(N)}) below ${n(N)}.)`,
  answer: [u.length, z.length, wiped],
  hints: ['A non-zero x in Zₙ is a unit when gcd(x, n) = 1 and a zero divisor when gcd(x, n) > 1. Every non-zero x is exactly one of the two.', 'Work out d = gcd(a, n), then list the multiples of n ÷ d that are less than n and count them.'],
  solution: `The accepted settings are the units, the x with gcd(x, ${n(N)}) = 1: ${list(u.map(n))}, ${n(u.length)} of them. The other ${n(N - 1)} − ${n(u.length)} = ${n(z.length)} settings are refused. gcd(${n(a)}, ${n(N)}) = ${n(g)}, so ${n(a)} wipes out the multiples of ${n(N)} ÷ ${n(g)} = ${n(step)} below ${n(N)}: ${list(bs.map(n))}, which is ${pl(wiped, 'code')}. Check: ${n(a)} × ${n(bs[0])} = ${n(a * bs[0])}, which is 0 mod ${n(N)}.`,
  guidance: [
   { prompt: `How many of the settings 1 to ${n(N - 1)} have gcd 1 with ${n(N)}, so that the lock accepts them?`, answer: [u.length], explanation: `They are ${list(u.map(n))}: ${n(u.length)} units.` },
   { prompt: `The other settings from 1 to ${n(N - 1)} are refused. How many are there?`, answer: [z.length], explanation: `${n(N - 1)} settings minus ${n(u.length)} accepted leaves ${n(z.length)} refused.` },
   { prompt: `gcd(${n(a)}, ${n(N)}) = ${n(g)}, so the codes ${n(a)} wipes out are the multiples of ${n(step)} from ${n(step)} up to ${n(N - 1)}. How many are there?`, answer: [wiped], explanation: `They are ${list(bs.map(n))}: ${pl(wiped, 'code')}.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q06', title: 'The master dial',
 brief: 'The vault’s master dial has many more positions than the practice dials, and Mira wants its dead settings counted and one setting undone.',
 labels: ['zero divisors', 'inverse of u', 'smallest b'], tolerance: 0.01,
 gl: [['zero divisors'], ['inverse of u'], ['smallest b']]
}, {
 /* A composite N from 41 to 99, a unit u from 2 to N − 2 (its inverse is found by trying every setting, so it is unique) and a zero divisor a. */
 canonical: { N: 56, u: 5, a: 14 },
 draw: R => { const N = R.pick(COMP(41, 99, [])), { u: us, z } = unitsOf(N); return { N, u: R.pick(us.filter(x => x >= 2 && x <= N - 2)), a: R.pick(z) }; },
 build: ({ N, u, a }) => { const { u: us, z } = unitsOf(N); let v = 0; for (let x = 1; x < N; x++) if ((u * x) % N === 1) v = x; const g = gcd(a, N), b = N / g; return {
  prompt: `The Cipher Vault’s master dial works in the ring ${Z(N)}: the numbers 0 to ${n(N - 1)}, added and multiplied mod ${n(N)}. A unit is a number with gcd 1 with ${n(N)}, and a zero divisor is a non-zero number that is not a unit. Enter how many zero divisors the ring has, then the inverse of the unit ${n(u)}: the number c from 1 to ${n(N - 1)} with ${n(u)} × c = 1 in ${Z(N)}, then the smallest non-zero b with ${n(a)} × b = 0 in ${Z(N)}.`,
  answer: [z.length, v, b],
  hints: ['Every non-zero x in Zₙ is a unit when gcd(x, n) = 1 and a zero divisor otherwise, so the zero divisors are the numbers from 1 to n − 1 that are not units.', 'The inverse of a unit u is the c with u × c one more than a multiple of n. For a zero divisor a, the product a × b is a multiple of n first when b = n ÷ gcd(a, n).'],
  solution: `The numbers 1 to ${n(N - 1)} with gcd 1 with ${n(N)} are the ${n(us.length)} units, so the other ${n(N - 1)} − ${n(us.length)} = ${n(z.length)} non-zero numbers are zero divisors. Trying numbers for the inverse of ${n(u)} gives c = ${n(v)}, since ${n(u)} × ${n(v)} = ${n(u * v)}, which is 1 mod ${n(N)}. gcd(${n(a)}, ${n(N)}) = ${n(g)}, so ${n(a)} × b is first a multiple of ${n(N)} at b = ${n(N)} ÷ ${n(g)} = ${n(b)}: ${n(a)} × ${n(b)} = ${n(a * b)}, which is 0 mod ${n(N)}.`,
  guidance: [
   { prompt: `There are ${n(us.length)} numbers from 1 to ${n(N - 1)} with gcd 1 with ${n(N)}. How many of the non-zero numbers are zero divisors?`, answer: [z.length], explanation: `${n(N - 1)} non-zero numbers minus ${n(us.length)} units leaves ${n(z.length)} zero divisors.` },
   { prompt: `Which c from 1 to ${n(N - 1)} has ${n(u)} × c = 1 in ${Z(N)}?`, answer: [v], explanation: `${n(u)} × ${n(v)} = ${n(u * v)}, which is 1 more than a multiple of ${n(N)}, so the inverse of ${n(u)} is ${n(v)}.` },
   { prompt: `gcd(${n(a)}, ${n(N)}) = ${n(g)}. What is the smallest non-zero b with ${n(a)} × b = 0 in ${Z(N)}?`, answer: [b], explanation: `${n(a)} × b must be a multiple of ${n(N)}, which first happens at b = ${n(N)} ÷ ${n(g)} = ${n(b)}.` }
  ] }; }
});

})();
