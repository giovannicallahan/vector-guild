/* Abstract algebra: patterns of moves practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p6.js. */
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
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
/* Zₘ written with subscript digits. */
const Z = m => 'Z' + String(m).split('').map(d => SUB[d]).join('');
const list = xs => xs.map(n).join(', ');
const multiples = (step, below) => { const out = []; for (let x = 0; x < below; x += step) out.push(x); return out; };
/* A set written out in full when short, otherwise its first three members, "…" and the last. */
const set = xs => xs.length <= 8 ? `{${list(xs)}}` : `{${list(xs.slice(0, 3))}, …, ${n(xs[xs.length - 1])}}`;
const coprimeCount = m => { let c = 0; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) c++; return c; };
const coprimeList = m => { const out = []; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) out.push(x); return out; };
/* The numbers y, y + b, y + 2b, … below a × b. */
const chain = (y, b, N) => { const out = []; for (let z = y; z < N; z += b) out.push(z); return out; };
/* The smallest turn r >= 1 that brings a ring colouring back to itself. */
const period = s => { for (let r = 1; r <= s.length; r++) if (s.slice(r) + s.slice(0, r) === s) return r; return s.length; };
const tiles = s => s.split('').join(' ');
const rotates = (s, t) => s.length === t.length && (s + s).includes(t);
const divisorsOf = m => { const out = []; for (let d = 1; d <= m; d++) if (m % d === 0) out.push(d); return out; };
/* A ring of r slots: a block of length p (p divides r, p >= 2) whose own smallest repeat is p, repeated r ÷ p times. */
const ringPattern = (R, r, cols) => { const ps = divisorsOf(r).filter(p => p >= 2);
 for (let i = 0; i < 1000; i++) { const p = R.pick(ps); let block = ''; for (let j = 0; j < p; j++) block += R.pick(cols.split(''));
  if (period(block) === p) return block.repeat(r / p); }
 return 'RB'.repeat(r / 2); };
/* A homomorphism x ↦ kx mod M from Z_N: s = M ÷ gcd(k, M) generates the kernel, which holds N ÷ s elements; the image has s. */
const hom = (N, M, k) => { const g = gcd(k, M), s = M / g, ker = multiples(s, N); return { g, s, ker, K: ker.length, im: N / ker.length }; };
const drawHom = (R, Mlo, Mhi, ulo, uhi, Nmax, bad) => { for (let i = 0; i < 1000; i++) { const M = R.int(Mlo, Mhi), k = R.int(2, M - 1), s = M / gcd(k, M), u = R.int(ulo, uhi), N = s * u;
  if (N <= Nmax && N !== M && !bad(N, M, k)) return { N, M, k }; } return null; };

/* ---- q26 Isomorphisms [9.1, 9.2] ---- */

/* The closing sentences shared by q26b and q26c. */
const isoEnd = (a, b, g, L, size, iso) => iso
 ? `gcd(${n(a)}, ${n(b)}) = 1, so the largest order is ${n(a)} × ${n(b)} = ${n(size)}, the same as the order of the reading 1 in ${Z(size)}. The pair (1, 1) reaches every state, so matching k(1, 1) with k in ${Z(size)} is an isomorphism: enter 1.`
 : `gcd(${n(a)}, ${n(b)}) = ${n(g)}, so the largest order is ${n(L)}, less than ${n(size)}. ${Z(size)} has an element of order ${n(size)} (the reading 1), and an isomorphism keeps every order, so the two are not isomorphic: enter 0.`;

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Selector and channel wheel',
 brief: 'A hatch panel has a selector switch and a channel wheel wired to one button, and Mira wants to know whether one wheel could do the same job.',
 labels: ['number of states', 'largest order', 'isomorphic (1 or 0)'], tolerance: 0.01,
 gl: [['number of states'], ['gcd'], ['largest order'], ['isomorphic (1 or 0)']]
}, {
 /* Z_a × Z_b with 2 <= a < b <= 13; half the draws coprime. Not the parent's examples (Z₄ × Z₆, Z₂ × Z₃). */
 canonical: { a: 6, b: 10 },
 draw: R => { const want = R.bool();
  for (let i = 0; i < 1000; i++) { const a = R.int(2, 12), b = R.int(a + 1, 13);
   if (!(a === 2 && b === 3) && !(a === 4 && b === 6) && (gcd(a, b) === 1) === want) return { a, b }; }
  return { a: 6, b: 10 }; },
 build: ({ a, b }) => { const size = a * b, g = gcd(a, b), L = lcm(a, b), iso = g === 1 ? 1 : 0; return {
  prompt: `A hatch panel has a selector switch with ${n(a)} positions, numbered 0 to ${n(a - 1)}, and a channel wheel with ${n(b)} positions, numbered 0 to ${n(b - 1)}. One press of the master button moves each of them on by one position, and the pair of readings (s, c) is the state of the panel: the direct product ${Z(a)} × ${Z(b)}. Enter the number of states of the panel, then the largest order of any state, then 1 if the panel acts like one wheel with as many positions as it has states (that is, it is isomorphic to it) and 0 if it does not.`,
  answer: [size, L, iso],
  hints: ['Count the pairs: every selector reading can sit with every wheel reading. The order of a pair is the lcm of the orders of its parts, so the largest order is the lcm of the two sizes.', 'A single wheel with N positions has a state of order N, and an isomorphism keeps orders. So the panel matches one wheel exactly when its largest order equals its number of states.'],
  solution: `The panel has ${n(a)} × ${n(b)} = ${n(size)} states. No pair has an order above lcm(${n(a)}, ${n(b)}) = ${n(size)} ÷ gcd(${n(a)}, ${n(b)}) = ${n(size)} ÷ ${n(g)} = ${n(L)}, and the pair (1, 1) reaches it. ${isoEnd(a, b, g, L, size, iso)}`,
  guidance: [
   { prompt: `How many states (s, c) are there, with s from 0 to ${n(a - 1)} and c from 0 to ${n(b - 1)}?`, answer: [size], explanation: `${n(a)} choices of s times ${n(b)} choices of c: ${n(size)} states.` },
   { prompt: `What is gcd(${n(a)}, ${n(b)})?`, answer: [g], explanation: `${n(g)} is the largest whole number that divides both ${n(a)} and ${n(b)}.` },
   { prompt: `What is the largest order of any state, the lcm of ${n(a)} and ${n(b)}, which is ${n(a)} × ${n(b)} ÷ gcd?`, answer: [L], explanation: `${n(size)} ÷ ${n(g)} = ${n(L)}: the pair (1, 1) is home again after ${n(L)} presses, and no state takes longer.` },
   { prompt: `Is ${Z(a)} × ${Z(b)} isomorphic to ${Z(size)}? Enter 1 for yes, 0 for no.`, answer: [iso], explanation: isoEnd(a, b, g, L, size, iso) }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'The twin dial test',
 brief: 'Before ordering a single big dial, the crew runs a test on a pair of coupled dials and counts the states the pair never reaches.',
 labels: ['presses to return', 'states never visited', 'isomorphic (1 or 0)'], tolerance: 0.01,
 gl: [['presses to return'], ['states never visited'], ['isomorphic (1 or 0)']]
}, {
 /* Z_a × Z_b with 3 <= a < b <= 15; half the draws coprime. Not the parent's example (Z₄ × Z₆). */
 canonical: { a: 8, b: 12 },
 draw: R => { const want = R.bool();
  for (let i = 0; i < 1000; i++) { const a = R.int(3, 14), b = R.int(a + 1, 15);
   if (!(a === 4 && b === 6) && !(a === 6 && b === 10) && (gcd(a, b) === 1) === want) return { a, b }; }
  return { a: 8, b: 12 }; },
 build: ({ a, b }) => { const size = a * b, g = gcd(a, b), L = lcm(a, b), miss = size - L, iso = g === 1 ? 1 : 0; return {
  prompt: `The Relay Exchange tests two coupled dials, ${Z(a)} and ${Z(b)}, both starting at the state (0, 0). Each press of the test button adds 1 to each dial, so after k presses the state is (k mod ${n(a)}, k mod ${n(b)}). The two dials together have ${n(size)} possible states, but the test may not reach all of them. Enter the number of presses after which the pair first shows (0, 0) again, then the number of the ${n(size)} states that the test never visits (the states repeat once the pair is back at (0, 0)). Then enter 1 if one dial of ${n(size)} positions could replace the pair (${Z(a)} × ${Z(b)} ≅ ${Z(size)}) and 0 if not.`,
  answer: [L, miss, iso],
  hints: ['The pair is back at (0, 0) when both dials are home together, which is the lcm of the two dial sizes. The test visits exactly that many different states before it starts to repeat.', 'The states never visited are all the states minus the states visited. One big dial acts like the pair only when the test reaches every state.'],
  solution: `The pair is home when both dials are, which first happens after lcm(${n(a)}, ${n(b)}) = ${n(size)} ÷ gcd(${n(a)}, ${n(b)}) = ${n(size)} ÷ ${n(g)} = ${n(L)} presses. Those ${n(L)} presses show ${n(L)} different states before the pattern repeats, so the test misses ${n(size)} − ${n(L)} = ${n(miss)} of the ${n(size)} states. ${isoEnd(a, b, g, L, size, iso)}`,
  guidance: [
   { prompt: `What is lcm(${n(a)}, ${n(b)}), the number of presses after which both dials are home together for the first time?`, answer: [L], explanation: `gcd(${n(a)}, ${n(b)}) = ${n(g)}, so lcm = ${n(size)} ÷ ${n(g)} = ${n(L)}.` },
   { prompt: `The test shows ${n(L)} different states before it repeats, out of ${n(size)} possible states. How many states does it never visit?`, answer: [miss], explanation: `${n(size)} − ${n(L)} = ${n(miss)}.` },
   { prompt: `Could one dial of ${n(size)} positions replace the pair? Enter 1 for yes (the test reaches every state), 0 for no.`, answer: [iso], explanation: isoEnd(a, b, g, L, size, iso) }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q07', title: 'Three dials in one stack',
 brief: 'A relay stack couples three dials at once, and Mira wants to know whether one dial could stand in for the whole stack.',
 labels: ['largest order', 'order of the state', 'isomorphic (1 or 0)'], tolerance: 0.01,
 gl: [['largest order'], ['order of the state'], ['isomorphic (1 or 0)']]
}, {
 /* Z_a × Z_b × Z_c with 2 <= a < b < c <= 10; half the draws pairwise coprime. The state (x, y, z) has x, y, z not 0. */
 canonical: { a: 4, b: 6, c: 9, x: 2, y: 3, z: 6 },
 draw: R => { const want = R.bool();
  for (let i = 0; i < 1000; i++) { const a = R.int(2, 8), b = R.int(a + 1, 9), c = R.int(b + 1, 10), co = gcd(a, b) === 1 && gcd(a, c) === 1 && gcd(b, c) === 1;
   if (co === want) return { a, b, c, x: R.int(1, a - 1), y: R.int(1, b - 1), z: R.int(1, c - 1) }; }
  return { a: 4, b: 6, c: 9, x: 2, y: 3, z: 6 }; },
 build: ({ a, b, c, x, y, z }) => { const size = a * b * c, L = lcm(lcm(a, b), c), oa = a / gcd(x, a), ob = b / gcd(y, b), oc = c / gcd(z, c), o = lcm(lcm(oa, ob), oc), iso = L === size ? 1 : 0;
  const end = iso ? `The largest order ${n(L)} equals ${n(a)} × ${n(b)} × ${n(c)} = ${n(size)}, the order of the reading 1 in ${Z(size)}, so the stack is a copy of ${Z(size)}: enter 1.`
   : `The largest order ${n(L)} is less than ${n(a)} × ${n(b)} × ${n(c)} = ${n(size)}, and ${Z(size)} has an element of order ${n(size)} (the reading 1). An isomorphism keeps every order, so the two are not isomorphic: enter 0.`;
  return {
  prompt: `A relay stack couples three dials, ${Z(a)}, ${Z(b)} and ${Z(c)}. A state is a triple (x, y, z), and a step adds 1 in each dial separately, so the triple is home again when all three dials are home at once. The order of a triple is therefore the lcm of the orders of its three parts, and the lcm of three numbers is the smallest positive number that all three divide. Enter the largest order of any state of ${Z(a)} × ${Z(b)} × ${Z(c)}. Then enter the order of the state (${n(x)}, ${n(y)}, ${n(z)}). Then enter 1 if the stack is isomorphic to one dial with as many positions as it has states, and 0 if it is not.`,
  answer: [L, o, iso],
  hints: ['Every order in the stack divides the lcm of the three dial sizes, and the triple (1, 1, 1) reaches it. Take the lcm two numbers at a time.', 'The order of x in Zₙ is n ÷ gcd(x, n). The order of the triple is the lcm of its three part orders. The stack matches one dial when its largest order equals its number of states.'],
  solution: `The lcm of ${n(a)}, ${n(b)} and ${n(c)}: lcm(${n(a)}, ${n(b)}) = ${n(lcm(a, b))}, then lcm(${n(lcm(a, b))}, ${n(c)}) = ${n(L)}. The triple (1, 1, 1) reaches it and no state goes beyond it. For (${n(x)}, ${n(y)}, ${n(z)}): ${n(x)} has order ${n(a)} ÷ gcd(${n(x)}, ${n(a)}) = ${n(oa)} in ${Z(a)}, ${n(y)} has order ${n(b)} ÷ gcd(${n(y)}, ${n(b)}) = ${n(ob)} in ${Z(b)}, and ${n(z)} has order ${n(c)} ÷ gcd(${n(z)}, ${n(c)}) = ${n(oc)} in ${Z(c)}, so the order is lcm(${n(oa)}, ${n(ob)}, ${n(oc)}) = ${n(o)}. ${end}`,
  guidance: [
   { prompt: `What is lcm(${n(a)}, ${n(b)}, ${n(c)}), the largest order of any state? Take lcm(${n(a)}, ${n(b)}) first, then the lcm of that with ${n(c)}.`, answer: [L], explanation: `lcm(${n(a)}, ${n(b)}) = ${n(lcm(a, b))}, and lcm(${n(lcm(a, b))}, ${n(c)}) = ${n(L)}.` },
   { prompt: `What is the order of the state (${n(x)}, ${n(y)}, ${n(z)})? Find the order of each part first, then take their lcm.`, answer: [o], explanation: `The parts have orders ${n(oa)}, ${n(ob)} and ${n(oc)} (each n ÷ gcd(part, n)), and lcm(${n(oa)}, ${n(ob)}, ${n(oc)}) = ${n(o)}.` },
   { prompt: `Is ${Z(a)} × ${Z(b)} × ${Z(c)} isomorphic to ${Z(size)}? Enter 1 for yes, 0 for no.`, answer: [iso], explanation: end }
  ] }; }
});

/* ---- q27 Direct products [9.2] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The vault code panel',
 brief: 'A vault door shows one control counter on a lock ring and a key wheel, and the crew must read the two dials off the counter.',
 labels: ['lock ring reading', 'key wheel reading', 'order of the state'], tolerance: 0.01,
 gl: [['lock ring reading'], ['key wheel reading'], ['order of the state']]
}, {
 /* Z_a × Z_b with a, b coprime, 3 <= a <= 9, 4 <= b <= 11, a ≠ b; the counter reading w gives x = w mod a and y = w mod b, both not 0.
    Not the parent's example (Z₄ × Z₉ with (2, 5)) or its worked example (Z₂ × Z₅). */
 canonical: { a: 5, b: 8, w: 27 },
 draw: R => { for (let i = 0; i < 1000; i++) { const a = R.int(3, 9), b = R.int(4, 11);
   if (a !== b && gcd(a, b) === 1) { const w = R.int(1, a * b - 1);
    if (w % a !== 0 && w % b !== 0 && !(a === 4 && b === 9 && w === 14)) return { a, b, w }; } }
  return { a: 5, b: 8, w: 27 }; },
 build: ({ a, b, w }) => { const N = a * b, x = w % a, y = w % b, ox = a / gcd(x, a), oy = b / gcd(y, b), o = lcm(ox, oy); return {
  prompt: `The code panel of a vault door has a lock ring with ${n(a)} positions and a key wheel with ${n(b)} positions. ${n(a)} and ${n(b)} are coprime, so ${Z(a)} × ${Z(b)} ≅ ${Z(N)}: the door's control counter, which reads w from 0 to ${n(N - 1)}, is matched to the pair of ring readings (w mod ${n(a)}, w mod ${n(b)}). The counter now reads ${n(w)}. Enter the lock ring reading x and the key wheel reading y that match it. Then enter the order of the state (x, y) in ${Z(a)} × ${Z(b)}.`,
  answer: [x, y, o],
  hints: ['The ring shows the remainder of the counter reading on division by the ring size, and the wheel shows the remainder on division by the wheel size.', 'The order of x in Zₙ is n ÷ gcd(x, n). The order of a pair is the lcm of the orders of its two parts.'],
  solution: `${n(w)} = ${n(a)} × ${n(Math.floor(w / a))} + ${n(x)}, so x = ${n(w)} mod ${n(a)} = ${n(x)}. ${n(w)} = ${n(b)} × ${n(Math.floor(w / b))} + ${n(y)}, so y = ${n(w)} mod ${n(b)} = ${n(y)}. The order of ${n(x)} in ${Z(a)} is ${n(a)} ÷ gcd(${n(x)}, ${n(a)}) = ${n(ox)} and the order of ${n(y)} in ${Z(b)} is ${n(b)} ÷ gcd(${n(y)}, ${n(b)}) = ${n(oy)}, so (${n(x)}, ${n(y)}) has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}.`,
  guidance: [
   { prompt: `What is ${n(w)} mod ${n(a)}, the remainder when ${n(w)} is divided by ${n(a)}?`, answer: [x], explanation: `${n(w)} = ${n(a)} × ${n(Math.floor(w / a))} + ${n(x)}, so the remainder is ${n(x)}.` },
   { prompt: `What is ${n(w)} mod ${n(b)}, the remainder when ${n(w)} is divided by ${n(b)}?`, answer: [y], explanation: `${n(w)} = ${n(b)} × ${n(Math.floor(w / b))} + ${n(y)}, so the remainder is ${n(y)}.` },
   { prompt: `What is the order of the pair (${n(x)}, ${n(y)}) in ${Z(a)} × ${Z(b)}?`, answer: [o], explanation: `${n(x)} has order ${n(ox)} and ${n(y)} has order ${n(oy)}, so the pair has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'When the door opens',
 brief: 'A vault door opens at one setting of its two rings, and the crew needs to know on which press of the test button it first does.',
 labels: ['presses to open', 'service moves to return', 'press of the second opening'], tolerance: 0.01,
 gl: [['presses to open'], ['service moves to return'], ['press of the second opening']]
}, {
 /* Z_a × Z_b with a, b coprime, 3 <= a <= 9, 4 <= b <= 13, a ≠ b, a × b <= 100; the target (x, y) has x, y not 0. */
 canonical: { a: 7, b: 12, x: 3, y: 8 },
 draw: R => { for (let i = 0; i < 1000; i++) { const a = R.int(3, 9), b = R.int(4, 13);
   if (a !== b && gcd(a, b) === 1 && a * b <= 100 && !(a === 4 && b === 9)) return { a, b, x: R.int(1, a - 1), y: R.int(1, b - 1) }; }
  return { a: 7, b: 12, x: 3, y: 8 }; },
 build: ({ a, b, x, y }) => { const N = a * b, cands = chain(y, b, N), w = cands.find(z => z % a === x), ox = a / gcd(x, a), oy = b / gcd(y, b), o = lcm(ox, oy), second = w + N; return {
  prompt: `A vault door has a lock ring with ${n(a)} positions and a key wheel with ${n(b)} positions, both starting at 0. Each press of the test button moves the ring on one position and the wheel on one position, so after k presses they show (k mod ${n(a)}, k mod ${n(b)}). Because ${n(a)} and ${n(b)} are coprime, the pattern of readings only repeats after ${n(N)} presses. The door opens when the two rings show (${n(x)}, ${n(y)}). Enter the smallest number of presses that opens it. A service move adds ${n(x)} to the ring and ${n(y)} to the wheel in one go; enter how many service moves, starting from (0, 0), bring the pair back to (0, 0). Then enter the number of the press at which the door opens for the second time.`,
  answer: [w, o, second],
  hints: ['Press k shows the remainders of k on division by the two ring sizes. List the numbers that leave the right remainder on division by the wheel size, and pick the one that also leaves the right remainder on division by the ring size.', 'The service moves bring the pair home when both parts are home, which is the lcm of the two part orders. The second opening comes one full repeat of the pattern after the first.'],
  solution: `The numbers below ${n(N)} that leave ${n(y)} on division by ${n(b)} are ${list(cands)}; only ${n(w)} leaves ${n(x)} on division by ${n(a)}, so the door first opens on press ${n(w)}. For the service moves: ${n(x)} has order ${n(a)} ÷ gcd(${n(x)}, ${n(a)}) = ${n(ox)} in ${Z(a)} and ${n(y)} has order ${n(b)} ÷ gcd(${n(y)}, ${n(b)}) = ${n(oy)} in ${Z(b)}, so ${n(o)} = lcm(${n(ox)}, ${n(oy)}) moves bring the pair home. The pattern repeats after ${n(N)} presses, so the second opening is on press ${n(w)} + ${n(N)} = ${n(second)}.`,
  guidance: [
   { prompt: `The numbers below ${n(N)} that leave ${n(y)} on division by ${n(b)} are ${list(cands)}. Which one leaves ${n(x)} on division by ${n(a)}?`, answer: [w], explanation: `${n(w)} = ${n(a)} × ${n(Math.floor(w / a))} + ${n(x)} and ${n(w)} mod ${n(b)} = ${n(y)}, so the door first opens on press ${n(w)}.` },
   { prompt: `What is the order of the pair (${n(x)}, ${n(y)}) in ${Z(a)} × ${Z(b)}?`, answer: [o], explanation: `${n(x)} has order ${n(ox)} and ${n(y)} has order ${n(oy)}, so the pair has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}.` },
   { prompt: `The first opening is on press ${n(w)} and the pattern repeats every ${n(N)} presses. On which press does the door open for the second time?`, answer: [second], explanation: `${n(w)} + ${n(N)} = ${n(second)}: the rings show the same pair again.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q09', title: 'The master key state',
 brief: 'The vault wants a master state that steps through every combination of its two rings, and the crew must check a candidate.',
 labels: ['order of the state', 'matching counter reading w', 'generates (1 or 0)'], tolerance: 0.01,
 gl: [['order of the state'], ['matching counter reading w'], ['generates (1 or 0)']]
}, {
 /* Z_a × Z_b with a, b coprime, 5 <= a <= 13, 8 <= b <= 16, a ≠ b, a × b <= 200; x, y not 0; about half the states generate (both parts coprime to their dial). */
 canonical: { a: 9, b: 14, x: 4, y: 6 },
 draw: R => { const want = R.bool();
  for (let i = 0; i < 1000; i++) { const a = R.int(5, 13), b = R.int(8, 16);
   if (a !== b && gcd(a, b) === 1 && a * b <= 200) { const x = R.int(1, a - 1), y = R.int(1, b - 1);
    if ((gcd(x, a) === 1 && gcd(y, b) === 1) === want) return { a, b, x, y }; } }
  return { a: 9, b: 14, x: 4, y: 6 }; },
 build: ({ a, b, x, y }) => { const N = a * b, cands = chain(y, b, N), w = cands.find(z => z % a === x), ox = a / gcd(x, a), oy = b / gcd(y, b), o = lcm(ox, oy), gen = o === N ? 1 : 0;
  const end = gen ? `The order ${n(o)} equals the number of states ${n(N)}, so (${n(x)}, ${n(y)}) reaches every state: it is a generator, enter 1.`
   : `The order ${n(o)} is less than the number of states ${n(N)}, so (${n(x)}, ${n(y)}) misses some states: it is not a generator, enter 0.`;
  return {
  prompt: `The master lock of a vault has a lock ring with ${n(a)} positions and a key wheel with ${n(b)} positions. ${n(a)} and ${n(b)} are coprime, so ${Z(a)} × ${Z(b)} ≅ ${Z(N)}, with the reading w from 0 to ${n(N - 1)} of the ${n(N)}-position counter matched to the pair (w mod ${n(a)}, w mod ${n(b)}). A state generates the product when its order equals the number of states, so that stepping it again and again reaches every state. Enter the order of the state (${n(x)}, ${n(y)}). Enter the counter reading w that is matched to it. Then enter 1 if (${n(x)}, ${n(y)}) generates ${Z(a)} × ${Z(b)} and 0 if it does not.`,
  answer: [o, w, gen],
  hints: ['The order of x in Zₙ is n ÷ gcd(x, n), and the order of a pair is the lcm of the orders of its parts. Compare the result with the number of states.', 'For w, list the numbers below the number of states that leave the right remainder on division by the wheel size, and pick the one that also leaves the right remainder on division by the ring size.'],
  solution: `${n(x)} has order ${n(a)} ÷ gcd(${n(x)}, ${n(a)}) = ${n(ox)} in ${Z(a)} and ${n(y)} has order ${n(b)} ÷ gcd(${n(y)}, ${n(b)}) = ${n(oy)} in ${Z(b)}, so (${n(x)}, ${n(y)}) has order lcm(${n(ox)}, ${n(oy)}) = ${n(o)}. The numbers below ${n(N)} that leave ${n(y)} on division by ${n(b)} are ${list(cands)}; only ${n(w)} leaves ${n(x)} on division by ${n(a)}, so w = ${n(w)}. ${end}`,
  guidance: [
   { prompt: `What is the order of the state (${n(x)}, ${n(y)}) in ${Z(a)} × ${Z(b)}?`, answer: [o], explanation: `${n(x)} has order ${n(ox)} and ${n(y)} has order ${n(oy)}, so the order is lcm(${n(ox)}, ${n(oy)}) = ${n(o)}.` },
   { prompt: `The numbers below ${n(N)} that leave ${n(y)} on division by ${n(b)} are ${list(cands)}. Which one leaves ${n(x)} on division by ${n(a)}?`, answer: [w], explanation: `${n(w)} = ${n(a)} × ${n(Math.floor(w / a))} + ${n(x)}, so w mod ${n(a)} = ${n(x)} and w mod ${n(b)} = ${n(y)}.` },
   { prompt: `The product has ${n(N)} states and the order of (${n(x)}, ${n(y)}) is ${n(o)}. Does the state generate the product? Enter 1 for yes, 0 for no.`, answer: [gen], explanation: end }
  ] }; }
});

/* ---- q28 Quotient groups [10.1] ---- */

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Crates in batches',
 brief: 'The depot racks its crates in batches that differ by whole steps of one size, and the manifest only needs to name the batch.',
 labels: ['number of batches', 'lowest crate number in the batch', 'order of the batch'], tolerance: 0.01,
 gl: [['number of batches'], ['lowest crate number in the batch'], ['order of the batch']]
}, {
 /* Z_m / ⟨d⟩ with d a divisor of m, 12 <= m <= 60, 3 <= d <= m ÷ 2; x is not in ⟨d⟩. Not the parent's examples (Z₂₄ / ⟨8⟩, Z₁₈ / ⟨6⟩). */
 canonical: { m: 30, d: 10, x: 14 },
 draw: R => { const low = R.bool(); for (let i = 0; i < 1000; i++) { const m = R.int(12, 60), d = R.int(3, Math.floor(m / 2)), x = R.int(1, m - 1);
   if (m % d === 0 && x % d !== 0 && (gcd(x, d) > 1) === low && !(m === 24 && d === 8) && !(m === 18 && d === 6)) return { m, d, x }; }
  return { m: 30, d: 10, x: 14 }; },
 build: ({ m, d, x }) => { const sz = m / d, g = gcd(x, d), o = d / g, low = x % d, H = multiples(d, m), steps = [];
  for (let j = 1; j <= o; j++) steps.push(j * x); return {
  prompt: `A depot rack holds ${n(m)} crates, numbered 0 to ${n(m - 1)} like the readings of ${Z(m)}. The crew sorts them into batches: two crates are in the same batch when their numbers differ by a multiple of ${n(d)}, so the batches are the cosets of H = ⟨${n(d)}⟩ = ${set(H)}. Each batch is one element of the quotient group ${Z(m)}/H, and batches are added by adding one crate number from each. Enter the number of batches, then the lowest crate number in the batch of crate ${n(x)} (the coset ${n(x)} + H), then the order of ${n(x)} + H in ${Z(m)}/H.`,
  answer: [d, low, o],
  hints: ['The size of H is the size of the group divided by the step size, and the number of cosets is the size of the group divided by the size of H. The crates of one batch are the crates of the first batch moved on by the same amount.', 'Every crate in the batch of x differs from x by a multiple of the step size, so the lowest number in it is the remainder of x on division by the step size. Adding the batch to itself k times gives kx + H, which is H exactly when kx is a multiple of the step size.'],
  solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(sz)} elements, so the ${n(m)} crates split into ${n(m)} ÷ ${n(sz)} = ${n(d)} batches. The batch of ${n(x)} holds the crates that differ from ${n(x)} by a multiple of ${n(d)}; the lowest is the remainder of ${n(x)} on division by ${n(d)}, which is ${n(low)}. Adding ${n(x)} + H to itself k times gives k × ${n(x)} + H, which is H when k × ${n(x)} is a multiple of ${n(d)}. The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(d)}, so the order of ${n(x)} + H is ${n(o)}.`,
  guidance: [
   { prompt: `H = ⟨${n(d)}⟩ has ${n(sz)} elements, so each batch holds ${n(sz)} crates. How many batches do the ${n(m)} crates make?`, answer: [d], explanation: `${n(m)} ÷ ${n(sz)} = ${n(d)} batches: ${Z(m)}/H has ${n(d)} elements.` },
   { prompt: `What is the remainder of ${n(x)} on division by ${n(d)}? That is the lowest crate number in the batch of ${n(x)}.`, answer: [low], explanation: `${n(x)} = ${n(d)} × ${n(Math.floor(x / d))} + ${n(low)}, so ${n(low)} + H is the same batch as ${n(x)} + H, and no lower crate is in it.` },
   { prompt: `What is the smallest k, 1 or more, for which ${n(x)} × k is a multiple of ${n(d)}? That k is the order of ${n(x)} + H.`, answer: [o], explanation: `The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(d)}. So k = ${n(o)}.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Fine dial, coarse gauge',
 brief: 'A fine dial drives a coarse gauge that only shows batches, and the crew compares how long each takes to come home.',
 labels: ['batches the gauge shows', 'steps for the gauge', 'steps for the fine dial'], tolerance: 0.01,
 gl: [['batches the gauge shows'], ['steps for the gauge'], ['steps for the fine dial']]
}, {
 /* Z_m / ⟨d⟩ with d a divisor of m, 12 <= m <= 60, 3 <= d <= m ÷ 2; x is not in ⟨d⟩, and the fine dial takes more steps than the gauge. */
 canonical: { m: 40, d: 10, x: 6 },
 draw: R => { const low = R.bool(); for (let i = 0; i < 1000; i++) { const m = R.int(12, 60), d = R.int(3, Math.floor(m / 2)), x = R.int(1, m - 1);
   if (m % d === 0 && x % d !== 0 && (gcd(x, d) > 1) === low && m / gcd(x, m) > d / gcd(x, d)) return { m, d, x }; }
  return { m: 40, d: 10, x: 6 }; },
 build: ({ m, d, x }) => { const sz = m / d, oq = d / gcd(x, d), of = m / gcd(x, m), H = multiples(d, m), sq = [], sf = [];
  for (let j = 1; j <= oq; j++) sq.push(j * x); for (let j = 1; j <= Math.min(of, 6); j++) sf.push(j * x); return {
  prompt: `A fine dial with ${n(m)} positions, the readings of ${Z(m)}, drives a coarse gauge. The gauge cannot tell two readings apart when they differ by a multiple of ${n(d)}: it only shows which coset of H = ⟨${n(d)}⟩ = ${set(H)} the reading is in, and its batches form the quotient group ${Z(m)}/H. A calibration step adds ${n(x)} to the fine reading each time, starting from 0. Enter the number of different batches the gauge can show. Then enter the number of steps after which the gauge first shows the batch of 0 (H itself) again. Then enter the number of steps after which the fine dial first shows 0 again.`,
  answer: [d, oq, of],
  hints: ['H holds the group size divided by the step size elements, and the number of batches is the group size divided by the size of H. The gauge is home when the fine reading lands in H.', 'After k steps the fine reading is kx mod the dial size. The gauge is home when that is a multiple of the batch step size, the fine dial when it is 0. The fine dial is the same as the order of x in Zₘ.'],
  solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(sz)} elements, so the ${n(m)} readings make ${n(m)} ÷ ${n(sz)} = ${n(d)} batches. The gauge is home when ${n(x)} × k is a multiple of ${n(d)}; the multiples of ${n(x)} go ${list(sq)}, and ${n(oq * x)} is the first, so after ${n(oq)} steps. The fine dial is home when ${n(x)} × k is a multiple of ${n(m)}, which first happens at k = ${n(m)} ÷ gcd(${n(x)}, ${n(m)}) = ${n(m)} ÷ ${n(gcd(x, m))} = ${n(of)}. The gauge is home sooner, after ${n(oq)} steps against ${n(of)}.`,
  guidance: [
   { prompt: `H = ⟨${n(d)}⟩ has ${n(sz)} elements. How many batches (cosets of H) does the gauge show?`, answer: [d], explanation: `${n(m)} ÷ ${n(sz)} = ${n(d)} batches.` },
   { prompt: `What is the smallest k, 1 or more, for which ${n(x)} × k is a multiple of ${n(d)}? That is the number of steps for the gauge.`, answer: [oq], explanation: `The multiples of ${n(x)} go ${list(sq)}, and ${n(oq * x)} is the first that is a multiple of ${n(d)}. So k = ${n(oq)}, which is ${n(d)} ÷ gcd(${n(x)}, ${n(d)}).` },
   { prompt: `What is the smallest k, 1 or more, for which ${n(x)} × k is a multiple of ${n(m)}? That is the number of steps for the fine dial, the order of ${n(x)} in ${Z(m)}.`, answer: [of], explanation: `${n(m)} ÷ gcd(${n(x)}, ${n(m)}) = ${n(m)} ÷ ${n(gcd(x, m))} = ${n(of)} steps.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q09', title: 'A coarse dial of its own',
 brief: 'The coarse gauge is itself a small dial, and Mira wants to know which of its batches could drive it round every position.',
 labels: ['number of elements of the quotient', 'order of x + H', 'number of generators'], tolerance: 0.01,
 gl: [['number of elements of the quotient'], ['order of x + H'], ['number of generators']]
}, {
 /* Z_m / ⟨d⟩ with d a divisor of m, 36 <= m <= 120, 4 <= d <= 24 and d <= m ÷ 2; x is not in ⟨d⟩. */
 canonical: { m: 72, d: 18, x: 12 },
 draw: R => { const low = R.bool(); for (let i = 0; i < 1000; i++) { const m = R.int(36, 120), d = R.int(4, 24), x = R.int(1, m - 1);
   if (m % d === 0 && d <= m / 2 && x % d !== 0 && (gcd(x, d) > 1) === low) return { m, d, x }; }
  return { m: 72, d: 18, x: 12 }; },
 build: ({ m, d, x }) => { const sz = m / d, g = gcd(x, d), o = d / g, cop = coprimeList(d), cnt = cop.length, steps = [];
  for (let j = 1; j <= o; j++) steps.push(j * x); return {
  prompt: `The cosets of H = ⟨${n(d)}⟩ in ${Z(m)} form the quotient group ${Z(m)}/H, which behaves like a dial with as many positions as it has elements, so it is cyclic. A coset generates the quotient when its order equals the number of elements of ${Z(m)}/H, so that adding it to itself again and again reaches every coset. Enter the number of elements of ${Z(m)}/H. Then enter the order of the coset ${n(x)} + H. Then enter how many of the cosets generate the quotient.`,
  answer: [d, o, cnt],
  hints: ['H holds the group size divided by the step size elements, and the number of cosets is the group size divided by the size of H. The order of x + H is the smallest k with kx a multiple of the step size.', 'A cyclic group of N elements has as many generators as there are numbers from 1 to N − 1 that share no factor bigger than 1 with N. The quotient has the same pattern as a dial with that many positions.'],
  solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(sz)} elements, so the ${n(m)} readings make ${n(m)} ÷ ${n(sz)} = ${n(d)} cosets: ${Z(m)}/H has ${n(d)} elements. The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(d)}, so ${n(x)} + H has order ${n(o)}. The quotient acts like ${Z(d)}, whose generators are the numbers from 1 to ${n(d - 1)} coprime to ${n(d)}: ${list(cop)}. That is ${n(cnt)} generators.`,
  guidance: [
   { prompt: `H = ⟨${n(d)}⟩ has ${n(sz)} elements. How many cosets does it have in ${Z(m)}?`, answer: [d], explanation: `${n(m)} ÷ ${n(sz)} = ${n(d)} cosets, so ${Z(m)}/H has ${n(d)} elements.` },
   { prompt: `What is the smallest k, 1 or more, for which ${n(x)} × k is a multiple of ${n(d)}? That k is the order of ${n(x)} + H.`, answer: [o], explanation: `The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(d)}. So k = ${n(o)}.` },
   { prompt: `The quotient has ${n(d)} elements and acts like a dial of ${n(d)} positions. How many numbers from 1 to ${n(d - 1)} are coprime to ${n(d)}? That is the number of generators.`, answer: [cnt], explanation: `They are ${list(cop)}: ${n(cnt)} numbers, so ${n(cnt)} cosets generate the quotient.` }
  ] }; }
});

/* ---- q29 Chapter review: the first isomorphism theorem [11.2] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The gear train',
 brief: 'A gear train turns an output dial from an input dial, and the crew wants to know what it loses and what it can still show.',
 labels: ['|kernel|', '|image|', 'output reading'], tolerance: 0.01,
 gl: [['smallest x in the kernel'], ['|kernel|'], ['|image|'], ['output reading']]
}, {
 /* φ(x) = kx mod M from Z_N, M divides kN (N = s × u with s = M ÷ gcd(k, M), u >= 2), N <= 48, N ≠ M; t is not in the kernel.
    Not the parent's example (Z₂₀ to Z₁₂ with k = 9) or its worked example (Z₁₂ to Z₈). */
 canonical: { N: 16, M: 8, k: 6, t: 5 },
 draw: R => { const h = drawHom(R, 4, 24, 2, 8, 48, (N, M, k) => (N === 20 && M === 12 && k === 9) || (N === 12 && M === 8));
  if (!h) return { N: 16, M: 8, k: 6, t: 5 };
  for (let i = 0; i < 1000; i++) { const t = R.int(1, h.N - 1); if ((h.k * t) % h.M !== 0) return { ...h, t }; }
  return { N: 16, M: 8, k: 6, t: 5 }; },
 build: ({ N, M, k, t }) => { const { g, s, ker, K, im } = hom(N, M, k), out = (k * t) % M; return {
  prompt: `A gear train in the Relay Exchange turns an output dial of ${n(M)} positions from an input dial of ${n(N)} positions: input reading x gives output reading ${n(k)}x mod ${n(M)}, a map φ from ${Z(N)} to ${Z(M)}. It is a homomorphism, because ${n(k)} × ${n(N)} = ${n(k * N)} is a multiple of ${n(M)}. Enter the number of input readings that give the output reading 0 (the kernel of φ), then the number of different output readings the train can show (the image of φ). Then enter the output reading when the input reading is ${n(t)}.`,
  answer: [K, im, out],
  hints: ['The kernel holds the input readings x with kx mod M equal to 0, which are the multiples of M ÷ gcd(k, M) below the size of the input dial.', 'The first isomorphism theorem says G / kernel ≅ image, so the image has |G| ÷ |kernel| elements. For the output reading, multiply the input reading by k and take the remainder on division by M.'],
  solution: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, so ${n(k)}x mod ${n(M)} = 0 exactly when x is a multiple of ${n(M)} ÷ ${n(g)} = ${n(s)}. From 0 to ${n(N - 1)} these are ${list(ker)}: the kernel has ${n(K)} elements. By the first isomorphism theorem the image has ${n(N)} ÷ ${n(K)} = ${n(im)} elements. For the input reading ${n(t)}: ${n(k)} × ${n(t)} = ${n(k * t)}, and ${n(k * t)} mod ${n(M)} = ${n(out)}.`,
  guidance: [
   { prompt: `What is the smallest x, 1 or more, with ${n(k)}x mod ${n(M)} = 0?`, answer: [s], explanation: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, and the smallest such x is ${n(M)} ÷ ${n(g)} = ${n(s)}: ${n(k)} × ${n(s)} = ${n(k * s)}, a multiple of ${n(M)}.` },
   { prompt: `The kernel is the multiples of ${n(s)} from 0 to ${n(N - 1)}. How many are there?`, answer: [K], explanation: `They are ${list(ker)}: ${n(K)} elements.` },
   { prompt: `By the first isomorphism theorem, how many elements does the image have?`, answer: [im], explanation: `|image| = |G| ÷ |kernel| = ${n(N)} ÷ ${n(K)} = ${n(im)}. As a check, the image is the multiples of ${n(g)} in ${Z(M)}: ${set(multiples(g, M))}.` },
   { prompt: `What is ${n(k)} × ${n(t)} mod ${n(M)}, the output reading for the input reading ${n(t)}?`, answer: [out], explanation: `${n(k)} × ${n(t)} = ${n(k * t)}, and the remainder of ${n(k * t)} on division by ${n(M)} is ${n(out)}.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Lamps that never light',
 brief: 'An output panel has a lamp for every reading, and the crew wants to know how many lamps the relay can never light.',
 labels: ['|kernel|', '|image|', 'lamps that never light'], tolerance: 0.01,
 gl: [['|kernel|'], ['|image|'], ['lamps that never light']]
}, {
 /* φ(x) = kx mod M from Z_N, M divides kN, N <= 48, N ≠ M; the image has fewer elements than M. Not the parent's example. */
 canonical: { N: 24, M: 18, k: 15 },
 draw: R => { for (let i = 0; i < 1000; i++) { const h = drawHom(R, 6, 30, 2, 8, 48, (N, M, k) => (N === 20 && M === 12 && k === 9) || (N === 12 && M === 8));
   if (h && hom(h.N, h.M, h.k).im < h.M) return h; }
  return { N: 24, M: 18, k: 15 }; },
 build: ({ N, M, k }) => { const { g, s, ker, K, im } = hom(N, M, k), dark = M - im; return {
  prompt: `A relay in the Relay Exchange sends an input dial of ${n(N)} positions to an output panel with ${n(M)} lamps, numbered 0 to ${n(M - 1)}: input reading x lights the lamp ${n(k)}x mod ${n(M)} (a homomorphism, because ${n(k)} × ${n(N)} = ${n(k * N)} is a multiple of ${n(M)}). The lamp of an output reading can only light if some input reading gives it. Enter the number of input readings that light lamp 0 (the kernel of the map), then the number of different lamps that can ever light (its image). Then enter the number of lamps on the panel that can never light.`,
  answer: [K, im, dark],
  hints: ['The input readings that light lamp 0 are the multiples of M ÷ gcd(k, M) below the size of the input dial.', 'By the first isomorphism theorem the number of lamps that can light is the number of input readings divided by the size of the kernel. The lamps that can never light are all the lamps minus those that can.'],
  solution: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, so ${n(k)}x mod ${n(M)} = 0 exactly when x is a multiple of ${n(M)} ÷ ${n(g)} = ${n(s)}. From 0 to ${n(N - 1)} these are ${list(ker)}: the kernel has ${n(K)} elements. By the first isomorphism theorem the image has ${n(N)} ÷ ${n(K)} = ${n(im)} elements, so ${n(im)} lamps can light. The other ${n(M)} − ${n(im)} = ${n(dark)} lamps never light.`,
  guidance: [
   { prompt: `The input readings that light lamp 0 are the multiples of ${n(M)} ÷ gcd(${n(k)}, ${n(M)}) from 0 to ${n(N - 1)}. How many are there?`, answer: [K], explanation: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, so they are the multiples of ${n(s)}: ${list(ker)}, which is ${n(K)} readings.` },
   { prompt: `By the first isomorphism theorem, how many different lamps can the relay light (the size of the image)?`, answer: [im], explanation: `|image| = |G| ÷ |kernel| = ${n(N)} ÷ ${n(K)} = ${n(im)}. As a check, they are the multiples of ${n(g)} in ${Z(M)}: ${set(multiples(g, M))}.` },
   { prompt: `How many of the ${n(M)} lamps can never light?`, answer: [dark], explanation: `${n(M)} − ${n(im)} = ${n(dark)} lamps.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q28', title: 'The kernel quotient',
 brief: 'Mira wants a relay checked by its kernel quotient: what the relay loses, what it shows, and how long a batch takes to come home.',
 labels: ['|kernel|', '|image|', 'order of x + K'], tolerance: 0.01,
 gl: [['|kernel|'], ['|image|'], ['order of x + K']]
}, {
 /* φ(x) = kx mod M from Z_N, M divides kN, 6 <= M <= 36, N <= 72, N ≠ M; the kernel K = ⟨s⟩ has at least 2 elements, and x is not in K. */
 canonical: { N: 36, M: 24, k: 10, x: 8 },
 draw: R => { const part = R.bool(); for (let i = 0; i < 1000; i++) { const h = drawHom(R, 6, 36, 2, 9, 72, (N, M, k) => (N === 20 && M === 12 && k === 9) || (N === 12 && M === 8));
   /* In half the draws gcd(x, s) > 1, so the order of x + K is less than the size of the image. */
   if (h) { const s = hom(h.N, h.M, h.k).s, x = R.int(1, h.N - 1); if (x % s !== 0 && (gcd(x, s) > 1) === part) return { ...h, x }; } }
  return { N: 36, M: 24, k: 10, x: 8 }; },
 build: ({ N, M, k, x }) => { const { g, s, ker, K, im } = hom(N, M, k), o = s / gcd(x, s), steps = [];
  for (let j = 1; j <= o; j++) steps.push(j * x); return {
  prompt: `The relay sends ${Z(N)} to ${Z(M)} by φ(x) = ${n(k)}x mod ${n(M)}, a homomorphism because ${n(k)} × ${n(N)} = ${n(k * N)} is a multiple of ${n(M)}. Let K be the kernel of φ. The cosets of K in ${Z(N)} form the quotient group ${Z(N)}/K, whose cosets are added by adding one reading from each. Enter the number of elements of the kernel and the number of elements of the image. Then enter the order of the coset ${n(x)} + K in ${Z(N)}/K.`,
  answer: [K, im, o],
  hints: ['The kernel is the set of multiples of d = M ÷ gcd(k, M) below the size of the input dial, so K = ⟨d⟩. The first isomorphism theorem gives the image as the number of cosets of K.', 'For a subgroup ⟨d⟩ of Zₙ, the coset x + ⟨d⟩ added to itself k times is kx + ⟨d⟩, which is the identity exactly when kx is a multiple of d. The order is the smallest such k.'],
  solution: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, so ${n(k)}x mod ${n(M)} = 0 exactly when x is a multiple of ${n(M)} ÷ ${n(g)} = ${n(s)}. From 0 to ${n(N - 1)} these are ${list(ker)}: the kernel K = ⟨${n(s)}⟩ has ${n(K)} elements. By the first isomorphism theorem the image has ${n(N)} ÷ ${n(K)} = ${n(im)} elements, the same as the number of cosets of K. In ${Z(N)}/K the multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(s)}, so ${n(x)} + K has order ${n(o)}, which is ${n(s)} ÷ gcd(${n(x)}, ${n(s)}).`,
  guidance: [
   { prompt: `The kernel is the multiples of ${n(M)} ÷ gcd(${n(k)}, ${n(M)}) from 0 to ${n(N - 1)}. How many are there?`, answer: [K], explanation: `gcd(${n(k)}, ${n(M)}) = ${n(g)}, so they are the multiples of ${n(s)}: ${list(ker)}. That is ${n(K)} elements.` },
   { prompt: `By the first isomorphism theorem, how many elements does the image have?`, answer: [im], explanation: `|image| = |G| ÷ |kernel| = ${n(N)} ÷ ${n(K)} = ${n(im)}.` },
   { prompt: `What is the smallest k, 1 or more, for which ${n(x)} × k is a multiple of ${n(s)}? That k is the order of ${n(x)} + K in the quotient.`, answer: [o], explanation: `The multiples of ${n(x)} go ${list(steps)}, and ${n(o * x)} is the first that is a multiple of ${n(s)}. So k = ${n(o)}.` }
  ] }; }
});

/* ---- q30 Group actions and orbits [14.1] ---- */

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The beacon lamp ring',
 brief: 'A beacon ring of lit and dark lamps is turned by a motor, and the crew needs to know how many different-looking rings it can show.',
 labels: ['orbit size', 'turns that leave it unchanged'], tolerance: 0.01,
 gl: [['orbit size'], ['turns that leave it unchanged']]
}, {
 /* A ring of r lamps, 4 <= r <= 12, set by repeating a block of length p (p divides r, p >= 2) whose own smallest repeat is p, in lit (L), dark (D) or flashing (F).
    Not the parent's example (R B B Y R B B Y) or its worked example (R B R B R B). */
 canonical: { pat: 'LLDLLD' },
 draw: R => { for (let i = 0; i < 1000; i++) { const r = R.int(4, 12), pat = ringPattern(R, r, R.bool() ? 'LD' : 'LDF'); if (pat !== 'LDLDLD') return { pat }; }
  return { pat: 'LLDLLD' }; },
 build: ({ pat }) => { const r = pat.length, p = period(pat), fix = r / p, fixed = multiples(p, r), steps = r - fix;
  const back = p === r ? `only comes back after a full turn of ${n(r)} positions` : `first comes back after a turn of ${n(p)} positions`;
  const upTo = p === 2 ? 'by 0 and 1 positions' : `by 0 to ${n(p - 1)} positions`; return {
  prompt: `A beacon ring has ${n(r)} lamps in a circle, numbered clockwise from 1. Reading clockwise from lamp 1, they are ${tiles(pat)} (L lit, D dark, F flashing). The motor can turn the whole ring by 0, 1, 2 and so on up to ${n(r - 1)} positions, and these ${n(r)} turns act on the ring's patterns. Enter the number of different patterns the motor can make from this one (the size of its orbit), then the number of the ${n(r)} turns that leave the pattern exactly as it is.`,
  answer: [p, fix],
  hints: ['Turn the ring one position at a time and look for the first turn after which every lamp shows what it showed at the start. The patterns made before that turn are all different.', 'If the first turn that brings the pattern back is by p positions, the turns that leave it unchanged are 0, p, 2p and so on below the number of lamps, and the orbit holds p patterns.'],
  solution: `Turning the ring one position at a time, the pattern ${back}. So the turns ${upTo} give ${n(p)} different patterns, and every other turn repeats one of them: the orbit has ${n(p)} patterns. The turns that leave it unchanged are by ${list(fixed)} positions: ${n(fix)} of the ${n(r)}. And ${n(p)} × ${n(fix)} = ${n(r)}.`,
  guidance: [
   { prompt: `What is the smallest turn, by 1 position or more, after which every lamp shows what it showed before? That number is the size of the orbit.`, answer: [p], explanation: `The pattern ${tiles(pat)} ${back}, so the turns ${upTo} make ${n(p)} different patterns: the orbit.` },
   { prompt: `The turns that leave the pattern unchanged are the multiples of ${n(p)} below ${n(r)}, starting with the turn by 0. How many are there?`, answer: [fix], explanation: `They are the turns by ${list(fixed)} positions: ${n(fix)} of them, and ${n(p)} × ${n(fix)} = ${n(r)}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Two designs, one sample shelf',
 brief: 'The studio keeps one sample ring for every different-looking turn of a design, and the shelf must be sized for two designs.',
 labels: ['samples for design 1', 'samples for design 2', 'samples in all'], tolerance: 0.01,
 gl: [['samples for design 1'], ['samples for design 2'], ['samples in all']]
}, {
 /* Two ring colourings of the same r slots, 6 <= r <= 12, each a repeated block of length p >= 2 with own smallest repeat p;
    design 2 is not a turn of design 1, so their orbits do not overlap. */
 canonical: { A: 'RBRBBRBB', B: 'RRBYRRBY' },
 draw: R => { for (let i = 0; i < 1000; i++) { const r = R.int(6, 12), A = ringPattern(R, r, 'RBY'), B = ringPattern(R, r, 'RBY');
   if (!rotates(A, B) && !(r === 8 && A === 'RBRBBRBB' && B === 'RRBYRRBY')) return { A, B }; }
  return { A: 'RBRBBRBB', B: 'RRBYRRBY' }; },
 build: ({ A, B }) => { const r = A.length, pa = period(A), pb = period(B), tot = pa + pb; return {
  prompt: `The Tile Studio lays rings of ${n(r)} tile slots, numbered clockwise from 1, and keeps one sample ring for every different-looking ring a design can show when it is turned by 0, 1, 2 and so on up to ${n(r - 1)} slots. Design 1 reads ${tiles(A)} clockwise from slot 1, and design 2 reads ${tiles(B)} (R red, B blue, Y yellow). No turn of one design gives the other. Enter the number of sample rings design 1 needs, then the number design 2 needs, then the number of sample rings the shelf must hold for both designs together.`,
  answer: [pa, pb, tot],
  hints: ['For each design, find the first turn that brings back the same colour in every slot. The number of different-looking rings the design shows is that turn, in slots.', 'The two designs never give the same ring, because no turn of one is the other. So the shelf holds the samples of design 1 and the samples of design 2 side by side: add the two orbit sizes.'],
  solution: `Design 1, ${tiles(A)}, ${pa === r ? `only comes back after a full turn of ${n(r)} slots` : `first comes back after a turn of ${n(pa)} slots`}, so its orbit has ${n(pa)} rings. Design 2, ${tiles(B)}, ${pb === r ? `only comes back after a full turn of ${n(r)} slots` : `first comes back after a turn of ${n(pb)} slots`}, so its orbit has ${n(pb)} rings. No turn of one design is the other, so the two orbits share no ring and the shelf holds ${n(pa)} + ${n(pb)} = ${n(tot)} sample rings.`,
  guidance: [
   { prompt: `What is the smallest turn, by 1 slot or more, that brings back the same colour in every slot of design 1 (${tiles(A)})? That is its number of sample rings.`, answer: [pa], explanation: `${pa === r ? `The pattern only comes back after a full turn of ${n(r)} slots` : `The pattern first comes back after a turn of ${n(pa)} slots`}, so the orbit of design 1 has ${n(pa)} rings.` },
   { prompt: `What is the smallest turn, by 1 slot or more, that brings back the same colour in every slot of design 2 (${tiles(B)})? That is its number of sample rings.`, answer: [pb], explanation: `${pb === r ? `The pattern only comes back after a full turn of ${n(r)} slots` : `The pattern first comes back after a turn of ${n(pb)} slots`}, so the orbit of design 2 has ${n(pb)} rings.` },
   { prompt: `The two orbits share no ring. How many sample rings does the shelf hold for both designs?`, answer: [tot], explanation: `${n(pa)} + ${n(pb)} = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q07', title: 'A motor with one step size',
 brief: 'The studio motor only turns the ring by one fixed step, again and again, and Mira wants to know how much of the orbit it can reach.',
 labels: ['orbit size', 'order of the step', 'patterns the motor makes'], tolerance: 0.01,
 gl: [['orbit size'], ['order of the step'], ['patterns the motor makes']]
}, {
 /* A ring of r slots, 6 <= r <= 24, a repeated block of length p (p divides r, 2 <= p < r) in red, blue or yellow; the step s, 2 <= s <= r − 1,
    is not a multiple of p, and the motor makes fewer colourings than the order of its step (so the two answers differ). In half the
    draws gcd(s, p) > 1, so the motor reaches only part of the orbit. */
 canonical: { pat: 'RBBYRBBYRBBYRBBY', st: 6 },
 draw: R => { const part = R.bool(); for (let i = 0; i < 1000; i++) { const r = R.int(6, 24), pat = ringPattern(R, r, 'RBY'), p = period(pat), st = R.int(2, r - 1);
   if (p < r && (gcd(st, p) > 1) === part && st % p !== 0 && p / gcd(st, p) !== r / gcd(st, r) && !(pat === 'RBBYRBBYRBBYRBBY' && st === 6)) return { pat, st }; }
  return { pat: 'RBBYRBBYRBBYRBBY', st: 6 }; },
 build: ({ pat, st }) => { const r = pat.length, p = period(pat), g = gcd(st, r), ord = r / g, gp = gcd(st, p), made = p / gp, steps = [];
  for (let j = 1; j <= ord; j++) steps.push(j * st); const stp = [];
  for (let j = 1; j <= made; j++) stp.push(j * st); return {
  prompt: `A dome ring has ${n(r)} tile slots, numbered clockwise from 1, and reads ${tiles(pat)} (R red, B blue, Y yellow). The ${n(r)} turns of the ring, by 0, 1, 2 and so on up to ${n(r - 1)} slots, act on its colourings. The studio motor can only turn the ring by ${n(st)} slots, again and again: after j such moves the ring has been turned by j × ${n(st)} slots, counted mod ${n(r)}. Enter the size of the orbit of this colouring under all ${n(r)} turns. Then enter the order of the turn by ${n(st)} slots, the smallest number j of moves, 1 or more, that brings the ring back to the turn by 0. Then enter the number of different colourings the motor makes by repeating its ${n(st)}-slot turn, counting the starting colouring.`,
  answer: [p, ord, made],
  hints: ['The orbit has as many colourings as the first turn, 1 slot or more, that brings back the same colour in every slot. The order of a turn by s slots on a ring of n slots is n ÷ gcd(s, n).', 'After j moves the colouring is the starting one again exactly when j times the step is a multiple of the first turn that brings the colouring back. The motor makes that many different colourings before it repeats.'],
  solution: `The colouring first comes back after a turn of ${n(p)} slots, so its orbit has ${n(p)} colourings. The turn by ${n(st)} slots has order ${n(r)} ÷ gcd(${n(st)}, ${n(r)}) = ${n(r)} ÷ ${n(g)} = ${n(ord)}: the multiples of ${n(st)} go ${list(steps)}, and ${n(ord * st)} is the first multiple of ${n(r)}. The motor brings the colouring back when j × ${n(st)} is a multiple of ${n(p)}: the multiples go ${list(stp)}, and ${n(made * st)} is the first multiple of ${n(p)}, so it makes ${n(made)} different colourings, which is ${n(p)} ÷ gcd(${n(st)}, ${n(p)}) = ${n(p)} ÷ ${n(gp)}.`,
  guidance: [
   { prompt: `What is the smallest turn, by 1 slot or more, that brings back the same colour in every slot? That number is the size of the orbit.`, answer: [p], explanation: `The pattern ${tiles(pat)} ${p === r ? `only comes back after a full turn of ${n(r)} slots` : `first comes back after a turn of ${n(p)} slots`}, so the orbit has ${n(p)} colourings.` },
   { prompt: `What is the smallest j, 1 or more, for which j × ${n(st)} is a multiple of ${n(r)}? That j is the order of the turn by ${n(st)} slots.`, answer: [ord], explanation: `The multiples of ${n(st)} go ${list(steps)}, and ${n(ord * st)} is the first multiple of ${n(r)}: j = ${n(ord)}, which is ${n(r)} ÷ gcd(${n(st)}, ${n(r)}).` },
   { prompt: `What is the smallest j, 1 or more, for which j × ${n(st)} is a multiple of ${n(p)}, the turn that brings the colouring back? That j is the number of colourings the motor makes.`, answer: [made], explanation: `The multiples of ${n(st)} go ${list(stp)}, and ${n(made * st)} is the first multiple of ${n(p)}: j = ${n(made)}, so the motor makes ${n(made)} different colourings.` }
  ] }; }
});

})();
