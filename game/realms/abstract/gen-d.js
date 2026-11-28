/* Abstract algebra: patterns of moves mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Small number helpers shared by the generators below. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const mod = (a, m) => ((a % m) + m) % m;
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const phi = m => { let c = 0; for (let i = 1; i <= m; i++) if (gcd(i, m) === 1) c++; return c; };
const primesOf = m => { const out = []; let x = m; for (let p = 2; p * p <= x; p++) if (x % p === 0) { let e = 0; while (x % p === 0) { x /= p; e++; } out.push([p, e]); } if (x > 1) out.push([x, 1]); return out; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const Z = m => 'Z' + String(m).split('').map(d => SUB[+d]).join('');
const pw = (p, e) => e === 1 ? n(p) : `${n(p)}${sup(e)}`;
const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
/* Plural from a helper, never a glued "s": pl(1, 'tile') is "1 tile", pl(3, 'tile') is "3 tiles". */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const list = xs => xs.length === 1 ? xs[0] : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
/* A monic polynomial with coefficients cs (from x^(d−1) down to the constant), zero terms left out, no written 1. */
const poly = cs => { const d = cs.length; let s = `x${sup(d)}`.replace(/x¹$/, 'x');
 cs.forEach((c, i) => { const e = d - 1 - i; if (!c) return; const v = e === 0 ? n(c) : `${c === 1 ? '' : n(c)}x${e === 1 ? '' : sup(e)}`; s += ` + ${v}`; }); return s; };
const pval = (cs, x) => { let v = 1; for (const c of cs) v = v * x + c; return v; };
/* Partitions of e, largest part first, written as sums. */
const parts = (e, max = e) => { if (e === 0) return [[]]; const out = []; for (let k = Math.min(e, max); k >= 1; k--) for (const rest of parts(e - k, k)) out.push([k, ...rest]); return out; };

/* q31: the objects whose turning groups act on their faces, edges or corners. */
const SOLIDS = {
 cubeF: { solid: 'a solid cube', G: 24, item: 'face', orbit: 6, stab: 4, how: 'the do-nothing move and the quarter, half and three-quarter turns about the axis through the centre of that face' },
 cubeE: { solid: 'a solid cube', G: 24, item: 'edge', orbit: 12, stab: 2, how: 'the do-nothing move and the half turn about the axis through the middle of that edge and the middle of the opposite edge' },
 cubeC: { solid: 'a solid cube', G: 24, item: 'corner', orbit: 8, stab: 3, how: 'the do-nothing move and the two third turns about the long diagonal through that corner' },
 octF: { solid: 'a regular octahedron, two square-based pyramids joined base to base with every face an equal triangle', G: 24, item: 'face', orbit: 8, stab: 3, how: 'the do-nothing move and the two third turns about the axis through the centre of that face and the centre of the opposite face' },
 octC: { solid: 'a regular octahedron, two square-based pyramids joined base to base with every face an equal triangle', G: 24, item: 'corner', orbit: 6, stab: 4, how: 'the do-nothing move and the quarter, half and three-quarter turns about the axis through that corner and the opposite corner' },
 octE: { solid: 'a regular octahedron, two square-based pyramids joined base to base with every face an equal triangle', G: 24, item: 'edge', orbit: 12, stab: 2, how: 'the do-nothing move and the half turn about the axis through the middle of that edge and the middle of the opposite edge' },
 tetF: { solid: 'a regular tetrahedron, a pyramid whose base and three sides are equal triangles', G: 12, item: 'face', orbit: 4, stab: 3, how: 'the do-nothing move and the two third turns about the axis through the centre of that face and the opposite corner' },
 tetC: { solid: 'a regular tetrahedron, a pyramid whose base and three sides are equal triangles', G: 12, item: 'corner', orbit: 4, stab: 3, how: 'the do-nothing move and the two third turns about the axis through that corner and the centre of the opposite face' },
 tetE: { solid: 'a regular tetrahedron, a pyramid whose base and three sides are equal triangles', G: 12, item: 'edge', orbit: 6, stab: 2, how: 'the do-nothing move and the half turn about the axis through the middle of that edge and the middle of the opposite edge' }
};
const shape31 = ({ kind, m }) => {
 if (kind === 'polyC') return { solid: `a flat regular hatch with ${n(m)} sides`, G: 2 * m, item: 'corner', orbit: m, stab: 2, moves: `${n(2 * m)} moves that carry it onto itself (${n(m)} turns, the do-nothing turn included, and ${n(m)} flips)`, how: 'the do-nothing move and the flip across the line through that corner and the centre' };
 if (kind === 'polyE') return { solid: `a flat regular hatch with ${n(m)} sides`, G: 2 * m, item: 'edge', orbit: m, stab: 2, moves: `${n(2 * m)} moves that carry it onto itself (${n(m)} turns, the do-nothing turn included, and ${n(m)} flips)`, how: 'the do-nothing move and the flip across the line through the middle of that edge and the centre' };
 const s = SOLIDS[kind]; return { ...s, moves: `${n(s.G)} turns that carry it onto itself (the do-nothing turn included)` };
};
/* q32: a cycle type in words, and the size of its class n! ÷ (product of k^m × m!). */
const type32 = ({ m, type }) => { const fixed = m - type.reduce((s, k) => s + k, 0), groups = [];
 for (const k of [...new Set(type)]) groups.push([k, type.filter(x => x === k).length]);
 const words = groups.map(([k, c]) => `${WORD[c]} ${n(k)}-cycle${c === 1 ? '' : 's'}`);
 const desc = `${list(words)}, ${fixed === 0 ? 'with no tile left in its place' : fixed === 1 ? 'with 1 tile left in its place' : `with ${n(fixed)} tiles left in their places`}`;
 const all = fixed ? [...groups, [1, fixed]] : groups;
 const factors = all.map(([k, c]) => ({ k, c, v: Math.pow(k, c) * fact(c), text: `${pw(k, c)} × ${n(c)}! = ${n(Math.pow(k, c) * fact(c))}` }));
 const den = factors.reduce((s, f) => s * f.v, 1), N = fact(m), size = N / den, order = type.reduce((s, k) => lcm(s, k), 1);
 const ordText = type.length === 1 ? `${n(order)}, the length of its one cycle` : `lcm(${type.map(n).join(', ')}) = ${n(order)}`;
 return { fixed, desc, factors, den, N, size, order, ordText };
};
/* q33: colourings of an n-bead ring fixed by a turn of r steps, and the Burnside count. */
const ring33 = ({ m, k }) => { const fix = []; for (let r = 0; r < m; r++) fix.push(Math.pow(k, gcd(r, m))); const sum = fix.reduce((s, v) => s + v, 0); return { fix, sum, count: sum / m }; };
/* q34: the number of partitions of each exponent. */
const PART = [1, 1, 2, 3, 5, 7, 11, 15, 22];
const abel34 = N => { const f = primesOf(N); let top = f[0]; for (const pe of f) if (pe[1] > top[1]) top = pe;
 return { f, top, sub: Math.pow(top[0], top[1]), ways: PART[top[1]], total: f.reduce((s, [, e]) => s * PART[e], 1) }; };
const ABEL = []; for (let N = 12; N <= 500; N++) { const f = primesOf(N); if (f.length >= 2 && f.some(([, e]) => e >= 2) && N !== 72) ABEL.push(N); }
/* The orders in ABEL with two or more primes raised to a power of 2 or more: half the q34 draws use them, so that the two answers differ. */
const ABEL2 = ABEL.filter(N => primesOf(N).filter(([, e]) => e >= 2).length >= 2);
/* q40: the prime powers p^k (k >= 2) below 2500, without GF(2³) (the worked example). */
const GF = []; for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]) for (let k = 2; Math.pow(p, k) < 2500; k++) if (!(p === 2 && k === 3)) GF.push({ p, k });
/* q38: Euclid's algorithm with the steps written out, and whole x, y with ax + by = gcd. */
const euclid = (a, b) => { const steps = []; let x = Math.max(a, b), y = Math.min(a, b); while (y) { const q = Math.floor(x / y), r = x % y; steps.push(`${n(x)} = ${n(q)} × ${n(y)} + ${n(r)}`); [x, y] = [y, r]; } return { steps, g: x }; };
const bezout = (a, b) => { let [r0, r1, s0, s1, t0, t1] = [a, b, 1, 0, 0, 1]; while (r1) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; [t0, t1] = [t1, t0 - q * t1]; } return { g: r0, x: s0, y: t0 }; };
const PRIMES36 = [5, 7, 11, 13, 17, 19, 23, 29, 31];
const inv = (a, p) => { for (let x = 1; x < p; x++) if (mod(a * x, p) === 1) return x; return 0; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* The orbit of one face, edge or corner is all of them (the prompt says any can reach any other), so the stabiliser is
    |G| ÷ |orbit|. Not the worked example (the square hatch's corners). 33 different objects. */
 q31: {
  canonical: { kind: 'cubeF', m: 0 },
  draw: R => { if (R.next() < 0.35) return { kind: R.pick(Object.keys(SOLIDS)), m: 0 }; const kind = R.pick(['polyC', 'polyE']); let m = R.int(3, 14); if (kind === 'polyC' && m === 4) m = 5; return { kind, m }; },
  build: p => { const s = shape31(p), it = s.item, its = it + 's'; return {
   prompt: `The Tile Studio’s pattern stamp is ${s.solid}. The ${s.moves} form a group, and one of them carries any ${it} to the place of any other ${it}. Enter the size of the orbit of one ${it}, then the size of its stabiliser: the number of these moves that leave that ${it} in its own place.`,
   answer: [s.orbit, s.stab],
   hints: [`The orbit of one ${it} is every place it can be carried to. Since any ${it} can reach any other, count the ${its}.`, 'The orbit–stabiliser theorem: the size of the orbit times the size of the stabiliser is the size of the group.'],
   solution: `Any ${it} can be carried to the place of any other, so the orbit of one ${it} is all ${n(s.orbit)} ${its}. By the orbit–stabiliser theorem, |stabiliser| = |G| ÷ |orbit| = ${n(s.G)} ÷ ${n(s.orbit)} = ${n(s.stab)}. Check: the moves that leave one ${it} in its place are ${s.how}, which is ${n(s.stab)} moves.`,
   guidance: [
    { prompt: `Any ${it} can be carried to the place of any other. How many places can one ${it} reach: how many ${its} are there?`, answer: [s.orbit], explanation: `The orbit is all the places the ${it} can be sent to, which is every ${it}: ${n(s.orbit)} of them.` },
    { prompt: `The group has ${n(s.G)} moves and the orbit has ${n(s.orbit)} places. How many moves leave one ${it} in its own place?`, answer: [s.stab], explanation: `Orbit size × stabiliser size = group size, so the stabiliser has ${n(s.G)} ÷ ${n(s.orbit)} = ${n(s.stab)} moves: ${s.how}.` }
   ] }; }
 },
 /* A cycle type in S_m, m from 4 to 7, never the identity and never the worked example (two 2-cycles in S_5). 34 types. */
 q32: {
  canonical: { m: 6, type: [3, 2] },
  draw: R => { const m = R.int(4, 7), all = parts(m).map(t => t.filter(k => k > 1)).filter(t => t.length && !(m === 5 && t.length === 2 && t[0] === 2 && t[1] === 2)); return { m, type: R.pick(all) }; },
  build: p => { const c = type32(p), { m } = p, many = c.size >= 1000; return {
   prompt: `The Tile Studio reorders a row of ${n(m)} floor tiles, labelled 1 to ${n(m)}, with permutations. One reordering is made of ${c.desc}. Its conjugacy class is every permutation of the ${n(m)} tiles with exactly the same cycle lengths. Enter how many permutations are in that class${many ? ' (type it without commas)' : ''}, then the order of each of them.`,
   answer: [c.size, c.order],
   hints: ['Write the n symbols in any of the n! orders into the brackets of the pattern. Each k-cycle can be started at any of its k symbols, and cycles of the same length can be listed in any order, so divide n! by kᵐ × m! for each length k that appears m times (fixed symbols count as cycles of length 1).', 'The order of a permutation is the lcm of its cycle lengths, and every permutation in the class has the same cycle lengths.'],
   solution: `There are ${n(m)}! = ${n(c.N)} ways to write the tiles into the pattern. Each permutation comes up once for every way of writing it: for the cycles of length ${list(c.factors.map(f => n(f.k)))} that is ${list(c.factors.map(f => f.text))}, so ${n(c.den)} ways in all. So the class has ${n(c.N)} ÷ ${n(c.den)} = ${n(c.size)} permutations. Each has order ${c.ordText}.`,
   guidance: [
    { prompt: `How many ways are there to write the ${n(m)} tiles in a row: what is ${n(m)}!${c.N >= 1000 ? ' (type it without commas)' : ''}?`, answer: [c.N], explanation: `${n(m)}! = ${Array.from({ length: m }, (_, i) => n(i + 1)).join(' × ')} = ${n(c.N)}.` },
    { prompt: `Each permutation of this type is written ${n(c.den)} different ways. How many permutations are in the class?`, answer: [c.size], explanation: `${n(c.N)} ÷ ${n(c.den)} = ${n(c.size)}. The ${n(c.den)} comes from ${list(c.factors.map(f => f.text))}, multiplied together.` },
    { prompt: `What is the order of a permutation made of ${c.desc}?`, answer: [c.order], explanation: `The order is the lcm of the cycle lengths: ${c.ordText}.` }
   ] }; }
 },
 /* A ring of m beads (3–8) in k colours (2–4), turned r steps (1 to m − 1). Not the worked example (4 beads, 2 colours). */
 q33: {
  canonical: { m: 6, k: 3, r: 2 },
  draw: R => { let p; for (let i = 0; i < 1000; i++) { p = { m: R.int(3, 8), k: R.int(2, 4) }; if (!(p.m === 4 && p.k === 2)) break; } if (p.m === 4 && p.k === 2) p = { m: 6, k: 3 }; p.r = R.int(1, p.m - 1); return p; },
  build: ({ m, k, r }) => { const c = ring33({ m, k }), g = gcd(r, m), f = Math.pow(k, g), fx = g === 1 ? n(f) : `${pw(k, g)} = ${n(f)}`, many = c.count >= 1000 || f >= 1000 || c.sum >= 1000; return {
   prompt: `A ring of ${n(m)} tiles runs round the dome’s skylight in a frame that can be turned but never flipped over. Each tile is one of ${n(k)} colours, and two colourings count as the same design when a turn of the ring carries one onto the other. Enter how many colourings are left unchanged by a turn of ${pl(r, 'step')}, then how many truly different designs there are${many ? ' (type the numbers without commas)' : ''}.`,
   answer: [f, c.count],
   hints: ['A turn of r steps around n tiles splits them into gcd(r, n) cycles, and a colouring is unchanged only if every tile in a cycle has the same colour.', 'Burnside’s theorem: the number of different designs is the average, over all the turns (the do-nothing turn included), of the number of colourings each turn leaves unchanged.'],
   solution: `A turn of ${pl(r, 'step')} splits the ${n(m)} tiles into gcd(${n(r)}, ${n(m)}) = ${pl(g, 'cycle')}, and each cycle must be one colour, so it leaves ${fx} colourings unchanged. Over the turns of 0 to ${n(m - 1)} steps the unchanged counts are ${list(c.fix.map(n))}, which add up to ${n(c.sum)}. Burnside’s theorem divides by the ${n(m)} turns: ${n(c.sum)} ÷ ${n(m)} = ${n(c.count)} different designs.`,
   guidance: [
    { prompt: `A turn of ${pl(r, 'step')} splits the ${n(m)} tiles into cycles, and every tile in a cycle must have the same colour. How many colourings does the turn leave unchanged?`, answer: [f], explanation: `It makes gcd(${n(r)}, ${n(m)}) = ${pl(g, 'cycle')}; each is one of ${n(k)} colours, so ${fx} colourings are unchanged.` },
    { prompt: `Add up the unchanged colourings over all ${n(m)} turns, from 0 steps (which changes nothing) to ${pl(m - 1, 'step')}. What is the total?`, answer: [c.sum], explanation: `The counts are ${list(c.fix.map(n))}, one for each turn, and they add up to ${n(c.sum)}.` },
    { prompt: `Divide the total by the number of turns. How many different designs are there?`, answer: [c.count], explanation: `${n(c.sum)} ÷ ${n(m)} = ${n(c.count)}: Burnside’s theorem says the number of orbits, here the designs, is the average number of colourings a move leaves unchanged.` }
   ] }; }
 },
 /* An order N ≤ 500 with at least two primes and one exponent of 2 or more; never 72, the worked example. */
 q34: {
  canonical: { N: 144 },
  draw: R => ({ N: R.pick(R.bool() ? ABEL2 : ABEL) }),
  build: ({ N }) => { const a = abel34(N), [tp, te] = a.top, fac = a.f.map(([p, e]) => pw(p, e)).join(' × ');
   const ways = a.f.map(([p, e]) => `${pw(p, e)}: ${e === 1 ? 'the exponent 1 can only be 1, so 1 way' : `${n(e)} can be written as ${list(parts(e).map(t => t.map(n).join(' + ')))}, so ${n(PART[e])} ways`}`); return {
   prompt: `The Tile Studio is listing every abelian group a dome pattern could follow, counting groups that are isomorphic (copies of each other) as one. Take the order ${n(N)} = ${fac}. Enter the number of abelian groups of order ${n(a.sub)} (the part ${pw(tp, te)}), then the number of abelian groups of order ${n(N)}.`,
   answer: [a.ways, a.total],
   hints: ['By the fundamental theorem, an abelian group of order pᵉ is a product of cyclic groups whose orders are powers of p, with exponents adding up to e. Count the partitions of e.', 'Each prime is split on its own, so multiply the numbers of partitions of the exponents.'],
   solution: `Each abelian group of order ${n(N)} is a product of cyclic groups of prime-power order, one splitting of the exponent for each prime. ${ways.join('; ')}. So there are ${n(a.ways)} abelian groups of order ${n(a.sub)}, and ${a.f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(a.total)} abelian groups of order ${n(N)}.`,
   guidance: [
    { prompt: `In how many ways can the exponent ${n(te)} be written as a sum of positive whole numbers, ignoring order?`, answer: [a.ways], explanation: `${n(te)} can be written as ${list(parts(te).map(t => t.map(n).join(' + ')))}: ${n(a.ways)} partitions, so ${n(a.ways)} abelian groups of order ${n(a.sub)}.` },
    { prompt: `Multiply the numbers of partitions of the exponents of ${fac}. How many abelian groups of order ${n(N)} are there?`, answer: [a.total], explanation: `The exponents ${list(a.f.map(([, e]) => n(e)))} have ${list(a.f.map(([, e]) => n(PART[e])))} partitions, and ${a.f.map(([, e]) => n(PART[e])).join(' × ')} = ${n(a.total)}.` }
   ] }; }
 },
 /* A composite N from 6 to 40 (not 10, the worked example) and a zero divisor a of Z_N. */
 q35: {
  canonical: { N: 15, a: 6 },
  draw: R => { const Ns = []; for (let N = 6; N <= 40; N++) if (N !== 10 && primesOf(N).reduce((s, [, e]) => s + e, 0) >= 2) Ns.push(N); const N = R.pick(Ns), zs = []; for (let a = 2; a < N; a++) if (gcd(a, N) > 1) zs.push(a); return { N, a: R.pick(zs) }; },
  build: ({ N, a }) => { const units = [], zd = []; for (let x = 1; x < N; x++) (gcd(x, N) === 1 ? units : zd).push(x); const g = gcd(a, N), b = N / g; return {
   prompt: `The Cipher Vault’s dial works in the ring ${Z(N)}: the numbers 0 to ${n(N - 1)}, added and multiplied mod ${n(N)}. Enter how many units the ring has, then how many zero divisors, then the smallest b from 1 to ${n(N - 1)} with ${n(a)} × b = 0 in ${Z(N)}.`,
   answer: [units.length, zd.length, b],
   hints: ['A non-zero x in Zₙ is a unit when gcd(x, n) = 1 and a zero divisor when gcd(x, n) > 1. Every non-zero x is exactly one of the two.', 'For a zero divisor a, the product a × b is a multiple of n first when b = n ÷ gcd(a, n).'],
   solution: `The units are the x with gcd(x, ${n(N)}) = 1: ${list(units.map(n))}, ${n(units.length)} of them. The other non-zero numbers, ${list(zd.map(n))}, are the ${n(zd.length)} zero divisors (${n(N - 1)} − ${n(units.length)} = ${n(zd.length)}). gcd(${n(a)}, ${n(N)}) = ${n(g)}, so ${n(a)} × b is first a multiple of ${n(N)} at b = ${n(N)} ÷ ${n(g)} = ${n(b)}: ${n(a)} × ${n(b)} = ${n(a * b)}, which is 0 mod ${n(N)}.`,
   guidance: [
    { prompt: `How many of the numbers 1 to ${n(N - 1)} have gcd 1 with ${n(N)}?`, answer: [units.length], explanation: `They are ${list(units.map(n))}: ${n(units.length)} units.` },
    { prompt: `The other non-zero numbers share a factor with ${n(N)}. How many zero divisors are there?`, answer: [zd.length], explanation: `${n(N - 1)} non-zero numbers minus ${n(units.length)} units leaves ${n(zd.length)} zero divisors.` },
    { prompt: `gcd(${n(a)}, ${n(N)}) = ${n(g)}. What is the smallest b from 1 to ${n(N - 1)} with ${n(a)} × b = 0 in ${Z(N)}?`, answer: [b], explanation: `${n(a)} × b must be a multiple of ${n(N)}, which first happens at b = ${n(N)} ÷ ${n(g)} = ${n(b)}.` }
   ] }; }
 },
 /* (ax + b) mod p = c in the field Z_p, p a prime from 5 to 31, a from 2 to p − 1, b from 1 to p − 1. Not the worked example. */
 q36: {
  canonical: { p: 11, a: 4, b: 5, c: 3 },
  draw: R => { let q; for (let i = 0; i < 1000; i++) { const p = R.pick(PRIMES36); q = { p, a: R.int(2, p - 1), b: R.int(1, p - 1), c: R.int(0, p - 1) }; if (!(q.p === 7 && q.a === 3 && q.b === 2 && q.c === 6)) return q; } return { p: 11, a: 4, b: 5, c: 3 }; },
  build: ({ p, a, b, c }) => { const d = mod(c - b, p), ia = inv(a, p), x = mod(d * ia, p); return {
   prompt: `A vault lock works in the field ${Z(p)}. It opens at the setting x, a whole number from 0 to ${n(p - 1)}, with (${n(a)}x + ${n(b)}) mod ${n(p)} = ${n(c)}. Enter the inverse of ${n(a)} in ${Z(p)}, then x.`,
   answer: [ia, x],
   hints: ['In a field you can undo each step: subtract the constant (mod p), then multiply by the inverse of the coefficient.', 'The inverse of a in Zₚ is the number y from 1 to p − 1 with a × y mod p = 1.'],
   solution: `Subtract ${n(b)}: ${n(a)}x mod ${n(p)} = (${n(c)} − ${n(b)}) mod ${n(p)} = ${n(d)}. The inverse of ${n(a)} is ${n(ia)}, since ${n(a)} × ${n(ia)} = ${n(a * ia)}, which is 1 mod ${n(p)}. So x = ${n(d)} × ${n(ia)} mod ${n(p)} = ${n(d * ia)} mod ${n(p)} = ${n(x)}. Check: ${n(a)} × ${n(x)} + ${n(b)} = ${n(a * x + b)}, which is ${n(c)} mod ${n(p)}.`,
   guidance: [
    { prompt: `Subtract ${n(b)} from both sides. What is (${n(c)} − ${n(b)}) mod ${n(p)}?`, answer: [d], explanation: `${n(c)} − ${n(b)} = ${n(c - b)}, which is ${n(d)} mod ${n(p)}. So ${n(a)}x mod ${n(p)} = ${n(d)}.` },
    { prompt: `Which y from 1 to ${n(p - 1)} has ${n(a)} × y mod ${n(p)} = 1?`, answer: [ia], explanation: `${n(a)} × ${n(ia)} = ${n(a * ia)}, which is 1 more than a multiple of ${n(p)}, so the inverse of ${n(a)} is ${n(ia)}.` },
    { prompt: `Multiply ${n(d)} by the inverse ${n(ia)} and reduce mod ${n(p)}. What is x?`, answer: [x], explanation: `${n(d)} × ${n(ia)} = ${n(d * ia)}, which is ${n(x)} mod ${n(p)}.` }
   ] }; }
 },
 /* A monic f of degree 2 or 3 over Z_5 or Z_7 with a non-zero constant, divided by x − a, a from 1 to p − 1. */
 q37: {
  canonical: { p: 7, cs: [0, 2, 3], a: 2 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = R.pick([5, 7]), d = R.int(2, 3), cs = []; for (let j = 0; j < d - 1; j++) cs.push(R.int(0, p - 1)); cs.push(R.int(1, p - 1)); const q = { p, cs, a: R.int(1, p - 1) }; if (!(p === 5 && d === 2 && cs[0] === 0 && cs[1] === 1)) return q; } return { p: 7, cs: [0, 2, 3], a: 2 }; },
  build: ({ p, cs, a }) => { const f = poly(cs), vals = []; for (let r = 0; r < p; r++) vals.push(mod(pval(cs, r), p)); const fa = pval(cs, a), rem = mod(fa, p), roots = vals.map((v, r) => v === 0 ? r : -1).filter(r => r >= 0); return {
   prompt: `Vault codes are polynomials with coefficients in ${Z(p)}, so all their arithmetic is done mod ${n(p)}. Take f(x) = ${f} in ${Z(p)}[x]. Enter the remainder when f(x) is divided by x − ${n(a)} (a number from 0 to ${n(p - 1)}), then how many roots f has in ${Z(p)}: the r from 0 to ${n(p - 1)} with f(r) mod ${n(p)} = 0.`,
   answer: [rem, roots.length],
   hints: ['Write f(x) = (x − a) × q(x) + remainder and put x = a: the first part becomes 0, so the remainder is f(a), reduced mod p.', 'A field this small can be searched: work out f(r) mod p for every r from 0 to p − 1 and count the zeros.'],
   solution: `Putting x = ${n(a)} into f(x) = (x − ${n(a)}) × q(x) + remainder leaves the remainder alone, so it is f(${n(a)}) = ${n(fa)}, which is ${n(rem)} mod ${n(p)}. For r = 0 to ${n(p - 1)}, f(r) mod ${n(p)} is ${list(vals.map(n))}. ${roots.length === 0 ? 'None of them is 0, so f has no roots' : `It is 0 at r = ${list(roots.map(n))}, so f has ${pl(roots.length, 'root')}`} in ${Z(p)}.`,
   guidance: [
    { prompt: `Work out f(${n(a)}) and reduce it mod ${n(p)}. What is the remainder on dividing by x − ${n(a)}?`, answer: [rem], explanation: `f(${n(a)}) = ${n(fa)}, and ${n(fa)} mod ${n(p)} = ${n(rem)}. By the factor theorem, that is the remainder.` },
    { prompt: `The values of f(r) mod ${n(p)} for r = 0 to ${n(p - 1)} are ${list(vals.map(n))}. How many roots does f have in ${Z(p)}?`, answer: [roots.length], explanation: roots.length === 0 ? 'No value is 0, so there are no roots.' : `The value is 0 at r = ${list(roots.map(n))}: ${pl(roots.length, 'root')}.` }
   ] }; }
 },
 /* Two sizes a, b from 6 to 90 with gcd at least 2, neither dividing the other; c from 20 to 200, in the ideal about half the time. */
 q38: {
  canonical: { a: 28, b: 42, c: 63 },
  draw: R => { for (let i = 0; i < 1000; i++) { const a = R.int(6, 90), b = R.int(6, 90), g = gcd(a, b); if (a === b || g < 2 || a % b === 0 || b % a === 0 || (a === 12 && b === 18) || (a === 18 && b === 12)) continue;
   const inside = R.bool(), c = inside ? g * R.int(Math.ceil(20 / g), Math.floor(200 / g)) : g * R.int(Math.ceil(20 / g), Math.floor(200 / g) - 1) + R.int(1, g - 1); if (c >= 20 && c <= 200) return { a, b, c }; } return { a: 28, b: 42, c: 63 }; },
  build: ({ a, b, c }) => { const e = euclid(a, b), g = e.g, bz = bezout(a, b), inI = c % g === 0 ? 1 : 0, q = Math.floor(c / g), r = c % g; return {
   prompt: `A vault dial accepts a number c of clicks when c = ${n(a)}x + ${n(b)}y for some whole numbers x and y, which may be negative. These numbers form an ideal of the integers. Enter the positive number that generates it (the smallest positive number in it), then 1 if ${n(c)} is in the ideal and 0 if it is not.`,
   answer: [g, inI],
   hints: ['Every ideal of the integers is all the multiples of its smallest positive member, and for the ideal made by a and b that member is gcd(a, b). Euclid’s algorithm finds it.', 'A number is in the ideal exactly when it is a multiple of the generator.'],
   solution: `Euclid’s algorithm: ${e.steps.join('; ')}. So gcd(${n(a)}, ${n(b)}) = ${n(g)}, and it is in the ideal: ${n(a)} × ${par(bz.x)} + ${n(b)} × ${par(bz.y)} = ${n(g)}. Every member is a multiple of ${n(g)}, so ${n(g)} generates the ideal. ${inI ? `${n(c)} = ${n(q)} × ${n(g)}, a multiple of ${n(g)}, so it is in the ideal: 1.` : `${n(c)} ÷ ${n(g)} leaves ${n(r)}, so ${n(c)} is not a multiple of ${n(g)} and is not in the ideal: 0.`}`,
   guidance: [
    { prompt: `Use Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${e.steps.join('; ')}. The last non-zero remainder is ${n(g)}.` },
    { prompt: `The ideal is all the multiples of ${n(g)}. Is ${n(c)} in it? Enter 1 for yes, 0 for no.`, answer: [inI], explanation: inI ? `${n(c)} = ${n(q)} × ${n(g)}, so yes: 1.` : `${n(c)} = ${n(q)} × ${n(g)} + ${n(r)}, so it is not a multiple of ${n(g)}: 0.` }
   ] }; }
 },
 /* x² + bx + c over Z_p, p in 3, 5, 7, c non-zero; irreducible about half the time. Not the worked example (x² + 1 over Z_3). */
 q39: {
  canonical: { p: 5, b: 1, c: 1 },
  draw: R => { const want = R.bool(); for (let i = 0; i < 1000; i++) { const p = R.pick([3, 5, 7]), b = R.int(0, p - 1), c = R.int(1, p - 1); if (p === 3 && b === 0 && c === 1) continue; let roots = 0; for (let x = 0; x < p; x++) if (mod(x * x + b * x + c, p) === 0) roots++; if ((roots === 0) === want) return { p, b, c }; } return { p: 5, b: 1, c: 1 }; },
  build: ({ p, b, c }) => { const f = poly([b, c]), vals = []; for (let x = 0; x < p; x++) vals.push(mod(x * x + b * x + c, p)); const roots = vals.map((v, r) => v === 0 ? r : -1).filter(r => r >= 0), irr = roots.length ? 0 : 1, count = (p * p - p) / 2, red = p * (p + 1) / 2; return {
   prompt: `A vault cipher needs a quadratic that cannot be factored over ${Z(p)}. Take f(x) = ${f}, with arithmetic mod ${n(p)}. Enter 1 if f is irreducible over ${Z(p)} and 0 if it is not, then how many monic quadratics x² + Bx + C (B and C each from 0 to ${n(p - 1)}) are irreducible over ${Z(p)}.`,
   answer: [irr, count],
   hints: ['A quadratic that factors has a factor x − r, so it has a root r. A quadratic with no root in the field is irreducible.', 'Count the reducible monic quadratics (x − r)(x − s): p with r = s, and p(p − 1) ÷ 2 with r and s different. Take them away from all p² monic quadratics.'],
   solution: `For x = 0 to ${n(p - 1)}, f(x) mod ${n(p)} is ${list(vals.map(n))}. ${irr ? `No value is 0, so f has no root and no factor x − r: it is irreducible, 1.` : `It is 0 at x = ${list(roots.map(n))}, so x − ${n(roots[0])} is a factor and f is not irreducible: 0.`} There are ${n(p)}² = ${n(p * p)} monic quadratics. The reducible ones are (x − r)(x − s): ${n(p)} with r = s and ${n(p)} × ${n(p - 1)} ÷ 2 = ${n(p * (p - 1) / 2)} with r ≠ s, ${n(red)} in all. So ${n(p * p)} − ${n(red)} = ${n(count)} are irreducible.`,
   guidance: [
    { prompt: `The values of f(x) mod ${n(p)} for x = 0 to ${n(p - 1)} are ${list(vals.map(n))}. Is f irreducible? Enter 1 for yes, 0 for no.`, answer: [irr], explanation: irr ? 'No value is 0, so there is no root and no linear factor: irreducible.' : `f(${n(roots[0])}) = 0, so x − ${n(roots[0])} divides f: not irreducible.` },
    { prompt: `How many monic quadratics (x − r)(x − s) can be made with r and s from 0 to ${n(p - 1)}, counting (x − r)(x − s) and (x − s)(x − r) once?`, answer: [red], explanation: `${n(p)} with r = s, and ${n(p)} × ${n(p - 1)} ÷ 2 = ${n(p * (p - 1) / 2)} with r ≠ s: ${n(red)} in all.` },
    { prompt: `There are ${n(p * p)} monic quadratics. How many are irreducible?`, answer: [count], explanation: `${n(p * p)} − ${n(red)} = ${n(count)}.` }
   ] }; }
 },
 /* GF(p^k) for k >= 2 and p^k below 2500, not GF(2³), the worked example: 32 fields. */
 q40: {
  canonical: { p: 3, k: 4 },
  draw: R => R.pick(GF),
  build: ({ p, k }) => { const q = Math.pow(p, k), m = q - 1, ph = phi(m), f = primesOf(m), many = q >= 1000;
   const fac = f.length === 1 && f[0][1] === 1 ? `${n(m)} is prime` : `${n(m)} = ${f.map(([r, e]) => pw(r, e)).join(' × ')}`, terms = f.map(([r]) => `(1 − 1 ÷ ${n(r)})`).join(' × '); return {
   prompt: `The vault’s strongest cipher runs in the finite field GF(${pw(p, k)}). Enter how many elements the field has, then the order of its multiplication group (the non-zero elements under ×), then how many generators that cyclic group has${many ? '. Type the numbers without commas' : ''}.`,
   answer: [q, m, ph],
   hints: ['GF(pᵏ) has exactly pᵏ elements, and every element except 0 has an inverse under ×, so the non-zero ones form a group.', 'That group is cyclic. A cyclic group of order m has one generator for each number from 1 to m that is coprime to m: m × (1 − 1 ÷ r) for each prime r dividing m.'],
   solution: `GF(${pw(p, k)}) has ${pw(p, k)} = ${n(q)} elements. Leaving out 0, the multiplication group has order ${n(q)} − 1 = ${n(m)}, and it is cyclic. ${fac}, so ${n(m)} × ${terms} = ${n(ph)} of the numbers from 1 to ${n(m)} are coprime to ${n(m)}, and the group has ${n(ph)} generators.`,
   guidance: [
    { prompt: `How many elements does GF(${pw(p, k)}) have?`, answer: [q], explanation: `${pw(p, k)} = ${n(q)}.` },
    { prompt: `Leave out 0. What is the order of the multiplication group?`, answer: [m], explanation: `${n(q)} − 1 = ${n(m)}: every non-zero element has an inverse, so they form a group.` },
    { prompt: `${fac}. How many numbers from 1 to ${n(m)} are coprime to ${n(m)}: how many generators does the cyclic group have?`, answer: [ph], explanation: `${n(m)} × ${terms} = ${n(ph)}. Each such number a makes gᵃ a generator, where g is any one generator.` }
   ] }; }
 }
});
})();
