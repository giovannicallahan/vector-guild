/* Number theory: the hidden life of whole numbers practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p1.js. */
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
/* Local helpers. */
const isPrime = v => { if (v < 2) return false; for (let d = 2; d * d <= v; d++) if (v % d === 0) return false; return true; };
const PRIMES = []; for (let v = 2; v <= 1200; v++) if (isPrime(v)) PRIMES.push(v);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const POW = Math.pow;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = e => String(e).split('').map(d => SUP[d]).join('');
const sub = e => String(e).split('').map(d => SUB[d]).join('');
/* "2⁴ × 3² × 5": primes with a non-zero exponent, an exponent 1 left unwritten. */
const fact = pairs => pairs.filter(([, e]) => e > 0).map(([p, e]) => e === 1 ? n(p) : n(p) + sup(e)).join(' × ');
/* "2, 3 and 5" */
const list = xs => xs.length < 2 ? xs.map(n).join('') : xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
const divs = k => k === 0 ? 'no divisions' : k === 1 ? 'one division' : `${n(k)} divisions`;
const P4 = [2, 3, 5, 7];
const val4 = e => P4.reduce((s, p, i) => s * POW(p, e[i]), 1);
/* Quotient and remainder with 0 ≤ r < b, for a negative a as well. */
const dm = (a, b) => { const q = Math.floor(a / b); return { q, r: a - b * q }; };
/* A draw that tries at most 1000 times, then falls back to the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* Digits of a base-b numeral written together: digits([2, 3, 5, 1]) is "2351". */
const dstr = ds => ds.join('');

/* ---- q01 Quotient and remainder [R1.3] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'Spool racks in the wire annex',
 brief: 'A load of spools has reached the wire annex, and a stock check has found a shortage, so the racking plan needs both counts.',
 labels: ['full racks', 'spools left over', 'q for the shortage', 'r for the shortage'], tolerance: 0.01,
 gl: [['full racks', 'spools left over'], ['multiple at or below', 'distance up']]
}, {
 /* Neither the load nor the shortage is a multiple of the rack size, so both remainders are above 0. Not the learn mission's draw (287 ÷ 12, −95) or its worked example. */
 canonical: { a: 453, b: 14, m: 61 },
 draw: R => retry(() => ({ a: R.int(100, 999), b: R.int(4, 19), m: R.int(10, 150) }),
  p => p.a % p.b !== 0 && p.m % p.b !== 0 && p.m > p.b && p.a >= 2 * p.b && !(p.a === 287 && p.b === 12) && !(p.a === 453 && p.b === 14 && p.m === 61), { a: 453, b: 14, m: 61 }),
 build: ({ a, b, m }) => { const { q: q1, r: r1 } = dm(a, b), mq = Math.floor(m / b), Q = mq + 1, r2 = b * Q - m; return {
  prompt: `The wire annex stacks its spools in racks of ${n(b)}. A load of ${n(a)} spools arrives. Write ${n(a)} = ${n(b)}q + r with 0 ≤ r < ${n(b)}, and enter q (the full racks) and r (the spools left over). A stock check then finds the annex short by ${n(m)} spools, which the ledger records as −${n(m)}. Write −${n(m)} = ${n(b)}q + r with 0 ≤ r < ${n(b)} too, and enter that q and r.`,
  answer: [q1, r1, -Q, r2],
  hints: ['Divide by the rack size: q is how many times it fits, and r is what is left over, which must be at least 0 and below the rack size.', 'A shortage is a negative number. Step down to the first multiple of the rack size at or below it: q is then negative, and r is the distance back up to the number.'],
  solution: `${n(b)} × ${n(q1)} = ${n(b * q1)} and ${n(a)} − ${n(b * q1)} = ${n(r1)}, so ${n(a)} = ${n(b)} × ${n(q1)} + ${n(r1)}: q = ${n(q1)} and r = ${n(r1)}. For −${n(m)}, the multiples of ${n(b)} nearest to it are −${n(b * mq)}, which is above −${n(m)}, and −${n(b * Q)}, which is below it. Use the lower one: −${n(m)} − (−${n(b * Q)}) = ${n(r2)}, so −${n(m)} = ${n(b)} × (−${n(Q)}) + ${n(r2)}: q = −${n(Q)} and r = ${n(r2)}.`,
  guidance: [
   { prompt: `How many full racks of ${n(b)} can be made from ${n(a)} spools, and how many spools are left over?`, answer: [q1, r1], explanation: `${n(b)} × ${n(q1)} = ${n(b * q1)} is the largest multiple of ${n(b)} that is not above ${n(a)}, and ${n(a)} − ${n(b * q1)} = ${n(r1)}, which is below ${n(b)}.` },
   { prompt: `Go down from −${n(m)} to the first multiple of ${n(b)} at or below it. What is that multiple, and how far up from it is −${n(m)}?`, answer: [-b * Q, r2], explanation: `${n(b)} × (−${n(Q)}) = −${n(b * Q)} is the first multiple at or below −${n(m)}; the next one up, −${n(b * mq)}, is above −${n(m)}. From −${n(b * Q)} up to −${n(m)} is ${n(r2)}, so q = −${n(Q)} and r = ${n(r2)}.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Bolts, crates and trolleys',
 brief: 'A bolt delivery must be packed into crates and the crates sent out on trolleys, and the loading bay wants to know what is left behind.',
 labels: ['bolts left loose', 'full trolleys', 'crates left waiting'], tolerance: 0.01,
 gl: [['full crates', 'loose bolts'], ['full trolleys', 'crates waiting']]
}, {
 /* Two divisions in a row: bolts into crates, then crates onto trolleys. Both remainders are above 0 and there are at least two trolleys' worth of crates. */
 canonical: { a: 2371, b: 18, c: 7 },
 draw: R => retry(() => ({ a: R.int(600, 4000), b: R.int(6, 25), c: R.int(4, 12) }),
  p => { const q1 = Math.floor(p.a / p.b); return p.a % p.b !== 0 && q1 % p.c !== 0 && q1 >= 2 * p.c && !(p.a === 2371 && p.b === 18 && p.c === 7); }, { a: 2371, b: 18, c: 7 }),
 build: ({ a, b, c }) => { const { q: q1, r: r1 } = dm(a, b), { q: q2, r: r2 } = dm(q1, c); return {
  prompt: `A delivery of ${n(a)} bolts reaches the crate store. Each crate holds ${n(b)} bolts, and only full crates are packed. The packed crates go out on trolleys that each carry ${n(c)} crates, and only full trolleys leave. Enter the number of bolts left loose, the number of full trolleys that leave, and the number of packed crates left waiting for the next trolley.`,
  answer: [r1, q2, r2],
  hints: ['Divide twice. First divide the bolts by the crate size: the quotient is the number of full crates and the remainder is the loose bolts.', 'The second division starts from the number of full crates, not from the bolts: divide the crates by the number a trolley carries. The quotient is the full trolleys and the remainder is the crates left waiting.'],
  solution: `${n(a)} = ${n(b)} × ${n(q1)} + ${n(r1)}, so ${n(q1)} full crates are packed and the remainder, ${n(r1)}, is the number of loose bolts. Then ${n(q1)} = ${n(c)} × ${n(q2)} + ${n(r2)}, so ${n(q2)} full trolleys leave and the remainder, ${n(r2)}, is the number of crates left waiting.`,
  guidance: [
   { prompt: `Divide ${n(a)} by ${n(b)}. What are the quotient (the full crates) and the remainder (the loose bolts)?`, answer: [q1, r1], explanation: `${n(b)} × ${n(q1)} = ${n(b * q1)} and ${n(a)} − ${n(b * q1)} = ${n(r1)}, so there are ${n(q1)} full crates and the remainder is ${n(r1)}.` },
   { prompt: `Now divide the number of full crates, ${n(q1)}, by ${n(c)}. What are the quotient (the full trolleys) and the remainder (the crates left waiting)?`, answer: [q2, r2], explanation: `${n(c)} × ${n(q2)} = ${n(c * q2)} and ${n(q1)} − ${n(c * q2)} = ${n(r2)}, so ${n(q2)} full trolleys leave and the remainder is ${n(r2)}.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The ledger below zero',
 brief: 'A rivet ledger has gone below zero after a large loss, and the store needs the balance and the opening stock written in whole crates and a remainder.',
 labels: ['q for the balance', 'r for the balance', 'q for the opening stock', 'r for the opening stock'], tolerance: 0.01,
 gl: [['balance'], ['quotient without the sign', 'remainder without the sign'], ['q for the balance', 'r for the balance'], ['q for the opening stock', 'r for the opening stock']]
}, {
 /* Bigger numbers than the learn mission: crates of 23 to 97, a loss far above the opening stock so the balance is a large negative number. Neither the opening stock nor the size of the balance is a multiple of the crate size. */
 canonical: { b: 47, a: 683, m: 4170 },
 draw: R => retry(() => { const b = R.int(23, 97), a = R.int(100, 900); return { b, a, m: a + R.int(2 * b, 9000) }; },
  p => p.a % p.b !== 0 && (p.m - p.a) % p.b !== 0 && p.m <= 9900 && !(p.b === 47 && p.a === 683 && p.m === 4170), { b: 47, a: 683, m: 4170 }),
 build: ({ b, a, m }) => { const w = m - a, { q: wq, r: wr } = dm(w, b), Q = wq + 1, r2 = b * Q - w, { q: qa, r: ra } = dm(a, b); return {
  prompt: `The crate store packs rivet tins in crates of ${n(b)}. The ledger opens with ${n(a)} tins in stock, then records a loss of ${n(m)} tins, so the balance is ${n(a)} − ${n(m)}, which is below zero. Write that balance as ${n(b)}q + r with 0 ≤ r < ${n(b)}, and enter q and r. Then write the opening stock, ${n(a)}, as ${n(b)}q + r in the same way, and enter its q and r.`,
  answer: [-Q, r2, qa, ra],
  hints: ['Work out the balance first: it is a negative number. The remainder may not be negative, so divide the size of the balance by the crate size and then go one more crate size down.', 'The opening stock is positive, so one ordinary division gives its q and r.'],
  solution: `The balance is ${n(a)} − ${n(m)} = −${n(w)}. Since ${n(w)} = ${n(b)} × ${n(wq)} + ${n(wr)}, the first multiple of ${n(b)} at or below −${n(w)} is ${n(b)} × (−${n(Q)}) = −${n(b * Q)}, and −${n(w)} = ${n(b)} × (−${n(Q)}) + ${n(r2)}: q = −${n(Q)} and r = ${n(r2)}. For the opening stock, ${n(a)} = ${n(b)} × ${n(qa)} + ${n(ra)}: q = ${n(qa)} and r = ${n(ra)}.`,
  guidance: [
   { prompt: `What is the balance, ${n(a)} − ${n(m)}?`, answer: [-w], explanation: `${n(a)} − ${n(m)} = −${n(w)}: more tins were lost than were in stock.` },
   { prompt: `Leave the minus sign aside for a moment and divide ${n(w)} by ${n(b)}. What are the quotient and the remainder?`, answer: [wq, wr], explanation: `${n(w)} = ${n(b)} × ${n(wq)} + ${n(wr)}. Putting a minus in front would give a remainder of −${n(wr)}, which is not allowed.` },
   { prompt: `The remainder may not be negative, so go one more multiple of ${n(b)} down. What are q and r for −${n(w)}?`, answer: [-Q, r2], explanation: `${n(b)} × (−${n(Q)}) = −${n(b * Q)} is the first multiple at or below −${n(w)}, and −${n(w)} − (−${n(b * Q)}) = ${n(r2)}, so −${n(w)} = ${n(b)} × (−${n(Q)}) + ${n(r2)}.` },
   { prompt: `What are q and r for the opening stock, ${n(a)}?`, answer: [qa, ra], explanation: `${n(b)} × ${n(qa)} = ${n(b * qa)} and ${n(a)} − ${n(b * qa)} = ${n(ra)}, so ${n(a)} = ${n(b)} × ${n(qa)} + ${n(ra)}.` }
  ] }; }
});

/* ---- q02 Writing numbers in other bases [R1.4] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Rivet tray labels',
 brief: 'The old tin counter labels its rivet trays in a base other than ten, and the stock clerk must read one label and print another.',
 labels: ['rivets in base ten', 'first digit', 'middle digit', 'last digit'], tolerance: 0.01,
 gl: [['b³', 'b²'], ['value in base ten'], ['quotient', 'last digit'], ['first digit', 'middle digit', 'last digit']]
}, {
 /* A four-digit numeral to read, and a count k with b² ≤ k < b³ to write in exactly three digits (the learn mission does the reverse sizes). Base 5 to 9. Not the learn mission's numbers. */
 canonical: { b: 7, w: 4, x: 1, y: 6, z: 2, k: 211 },
 draw: R => retry(() => { const b = R.int(5, 9); return { b, w: R.int(1, b - 1), x: R.int(0, b - 1), y: R.int(0, b - 1), z: R.int(0, b - 1), k: R.int(b * b, b * b * b - 1) }; },
  p => !(p.b === 6 && p.k === 845) && !(p.b === 7 && p.k === 211 && p.w === 4 && p.x === 1 && p.y === 6 && p.z === 2), { b: 7, w: 4, x: 1, y: 6, z: 2, k: 211 }),
 build: ({ b, w, x, y, z, k }) => { const b2 = b * b, b3 = b2 * b, V = w * b3 + x * b2 + y * b + z, q1 = Math.floor(k / b), e0 = k % b, e2 = Math.floor(q1 / b), e1 = q1 % b; return {
  prompt: `The rivet trays of the old tin counter are labelled in base ${n(b)}, so each label uses only the digits 0 to ${n(b - 1)}. One tray is labelled (${dstr([w, x, y, z])})${sub(b)}. Enter the number of rivets in that tray, written in base ten (type it without commas). A second tray holds ${n(k)} rivets: enter its label in base ${n(b)}, which takes exactly three digits, from left to right.`,
  answer: [V, e2, e1, e0],
  hints: ['Each place is worth the base times the place to its right: ones, then the base, then the base squared, then the base cubed. Multiply each digit by its place value and add the results.', 'To write a number in a base, divide by the base again and again. The remainders are the digits, last digit first.'],
  solution: `The four places are worth ${n(b3)}, ${n(b2)}, ${n(b)} and 1, so (${dstr([w, x, y, z])})${sub(b)} = ${n(w)} × ${n(b3)} + ${n(x)} × ${n(b2)} + ${n(y)} × ${n(b)} + ${n(z)} = ${n(V)}. For ${n(k)}: ${n(k)} = ${n(b)} × ${n(q1)} + ${n(e0)}, and ${n(q1)} = ${n(b)} × ${n(e2)} + ${n(e1)}, where ${n(e2)} is below ${n(b)}. Reading the remainders from the last to the first gives (${dstr([e2, e1, e0])})${sub(b)}.`,
  guidance: [
   { prompt: `In base ${n(b)}, what are the place values of the first two of the four places, ${n(b)}³ and ${n(b)}²?`, answer: [b3, b2], explanation: `${n(b)}³ = ${n(b)} × ${n(b)} × ${n(b)} = ${n(b3)} and ${n(b)}² = ${n(b)} × ${n(b)} = ${n(b2)}. The last two places are worth ${n(b)} and 1.` },
   { prompt: `What is (${dstr([w, x, y, z])})${sub(b)} in base ten?`, answer: [V], explanation: `${n(w)} × ${n(b3)} + ${n(x)} × ${n(b2)} + ${n(y)} × ${n(b)} + ${n(z)} × 1 = ${n(w * b3)} + ${n(x * b2)} + ${n(y * b)} + ${n(z)} = ${n(V)}.` },
   { prompt: `Divide ${n(k)} by ${n(b)}. What are the quotient and the remainder? The remainder is the last digit.`, answer: [q1, e0], explanation: `${n(k)} = ${n(b)} × ${n(q1)} + ${n(e0)}, so the last digit in base ${n(b)} is ${n(e0)}.` },
   { prompt: `Divide the quotient again by ${n(b)}. What are the three digits of ${n(k)} in base ${n(b)}, from left to right?`, answer: [e2, e1, e0], explanation: `${n(q1)} = ${n(b)} × ${n(e2)} + ${n(e1)}, and ${n(e2)} is below ${n(b)}, so the digits are ${n(e2)}, ${n(e1)}, ${n(e0)}. Check: ${n(e2)} × ${n(b2)} + ${n(e1)} × ${n(b)} + ${n(e0)} = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Two pallets, one total',
 brief: 'Two pallets have been counted by a base-labelled counter, and the loading sheet needs their combined count in both bases.',
 labels: ['total in base ten', 'first digit', 'second digit', 'third digit', 'last digit'], tolerance: 0.01,
 gl: [['first pallet', 'second pallet'], ['total in base ten'], ['first digit', 'second digit', 'third digit', 'last digit']]
}, {
 /* Two three-digit numerals in base 5 to 9 whose sum is at least b³, so the total takes exactly four digits in base b (two three-digit numerals add to less than 2b³). */
 canonical: { b: 6, u2: 3, u1: 4, u0: 1, v2: 2, v1: 5, v0: 3 },
 draw: R => retry(() => { const b = R.int(5, 9); return { b, u2: R.int(1, b - 1), u1: R.int(0, b - 1), u0: R.int(0, b - 1), v2: R.int(1, b - 1), v1: R.int(0, b - 1), v0: R.int(0, b - 1) }; },
  p => { const b = p.b, U = p.u2 * b * b + p.u1 * b + p.u0, V = p.v2 * b * b + p.v1 * b + p.v0; return U !== V && U + V >= b * b * b && !(b === 6 && U === 133 && V === 105); }, { b: 6, u2: 3, u1: 4, u0: 1, v2: 2, v1: 5, v0: 3 }),
 build: ({ b, u2, u1, u0, v2, v1, v0 }) => { const b2 = b * b, b3 = b2 * b, U = u2 * b2 + u1 * b + u0, V = v2 * b2 + v1 * b + v0, T = U + V,
  t1 = Math.floor(T / b), d0 = T % b, t2 = Math.floor(t1 / b), d1 = t1 % b, d3 = Math.floor(t2 / b), d2 = t2 % b; return {
  prompt: `Two pallets arrive at the crate store with box counts printed in base ${n(b)}, using only the digits 0 to ${n(b - 1)}: one reads (${dstr([u2, u1, u0])})${sub(b)} and the other (${dstr([v2, v1, v0])})${sub(b)}. Enter the total number of boxes in base ten (type it without commas). Then write that total in base ${n(b)}, which takes exactly four digits, and enter those digits from left to right.`,
  answer: [T, d3, d2, d1, d0],
  hints: ['Change each count to base ten first, then add: the total is the same number whatever base it is written in.', 'To write the total in a base, divide by the base again and again. The remainders are the digits, last digit first.'],
  solution: `(${dstr([u2, u1, u0])})${sub(b)} = ${n(u2)} × ${n(b2)} + ${n(u1)} × ${n(b)} + ${n(u0)} = ${n(U)} and (${dstr([v2, v1, v0])})${sub(b)} = ${n(v2)} × ${n(b2)} + ${n(v1)} × ${n(b)} + ${n(v0)} = ${n(V)}, so the total is ${n(U)} + ${n(V)} = ${n(T)}. Then ${n(T)} = ${n(b)} × ${n(t1)} + ${n(d0)}, ${n(t1)} = ${n(b)} × ${n(t2)} + ${n(d1)}, and ${n(t2)} = ${n(b)} × ${n(d3)} + ${n(d2)}. Reading the remainders from the last to the first gives (${dstr([d3, d2, d1, d0])})${sub(b)}.`,
  guidance: [
   { prompt: `What are the two counts in base ten: (${dstr([u2, u1, u0])})${sub(b)} first, then (${dstr([v2, v1, v0])})${sub(b)}?`, answer: [U, V], explanation: `${n(u2)} × ${n(b2)} + ${n(u1)} × ${n(b)} + ${n(u0)} = ${n(U)}, and ${n(v2)} × ${n(b2)} + ${n(v1)} × ${n(b)} + ${n(v0)} = ${n(V)}.` },
   { prompt: `What is the total number of boxes in base ten?`, answer: [T], explanation: `${n(U)} + ${n(V)} = ${n(T)}.` },
   { prompt: `Divide ${n(T)} by ${n(b)} again and again. What are the four digits of ${n(T)} in base ${n(b)}, from left to right?`, answer: [d3, d2, d1, d0], explanation: `${n(T)} = ${n(b)} × ${n(t1)} + ${n(d0)}, ${n(t1)} = ${n(b)} × ${n(t2)} + ${n(d1)}, ${n(t2)} = ${n(b)} × ${n(d3)} + ${n(d2)}, and ${n(d3)} is below ${n(b)}. Check: ${n(d3)} × ${n(b3)} + ${n(d2)} × ${n(b2)} + ${n(d1)} × ${n(b)} + ${n(d0)} = ${n(T)}.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'The labeller and the box line',
 brief: 'The labeller has printed a long base-labelled crate count, and the box line needs it in whole boxes with a remainder.',
 labels: ['count in base ten', 'full boxes', 'crates left over'], tolerance: 0.01,
 gl: [['b⁴', 'b³', 'b²'], ['count in base ten'], ['full boxes', 'crates left over']]
}, {
 /* A five-digit numeral in base 4 to 9, then a division with remainder by a box size of 7 to 40 (q01). The count is at least ten boxes and not a multiple of the box size. */
 canonical: { b: 7, e4: 2, e3: 5, e2: 0, e1: 3, e0: 6, c: 25 },
 draw: R => retry(() => { const b = R.int(4, 9); return { b, e4: R.int(1, b - 1), e3: R.int(0, b - 1), e2: R.int(0, b - 1), e1: R.int(0, b - 1), e0: R.int(0, b - 1), c: R.int(7, 40) }; },
  p => { const V = [p.e4, p.e3, p.e2, p.e1, p.e0].reduce((s, d) => s * p.b + d, 0); return V % p.c !== 0 && V >= 10 * p.c && !(p.b === 7 && V === 6544); }, { b: 7, e4: 2, e3: 5, e2: 0, e1: 3, e0: 6, c: 25 }),
 build: ({ b, e4, e3, e2, e1, e0, c }) => { const b2 = b * b, b3 = b2 * b, b4 = b3 * b, V = e4 * b4 + e3 * b3 + e2 * b2 + e1 * b + e0, { q, r } = dm(V, c); return {
  prompt: `The old labeller prints a crate count as five digits in base ${n(b)}, using only the digits 0 to ${n(b - 1)}: this one reads (${dstr([e4, e3, e2, e1, e0])})${sub(b)}. Enter the count in base ten (type it without commas). The crates are then loaded into boxes of ${n(c)}, and only full boxes are sealed: write the count as ${n(c)}q + r with 0 ≤ r < ${n(c)}, and enter q (the full boxes) and r (the crates left over).`,
  answer: [V, q, r],
  hints: ['The five places are worth the base to the powers 4, 3, 2 and 1, and 1 for the last place. Multiply each digit by its place value and add the results.', 'Change to base ten before dividing. The division by the box size is an ordinary division with remainder: r is at least 0 and below the box size.'],
  solution: `The five places are worth ${n(b4)}, ${n(b3)}, ${n(b2)}, ${n(b)} and 1, so (${dstr([e4, e3, e2, e1, e0])})${sub(b)} = ${n(e4)} × ${n(b4)} + ${n(e3)} × ${n(b3)} + ${n(e2)} × ${n(b2)} + ${n(e1)} × ${n(b)} + ${n(e0)} = ${n(V)}. Then ${n(c)} × ${n(q)} = ${n(c * q)} and ${n(V)} − ${n(c * q)} = ${n(r)}, so ${n(V)} = ${n(c)} × ${n(q)} + ${n(r)}: q = ${n(q)} and r = ${n(r)}.`,
  guidance: [
   { prompt: `In base ${n(b)}, what are the place values of the first three of the five places, ${n(b)}⁴, ${n(b)}³ and ${n(b)}²?`, answer: [b4, b3, b2], explanation: `${n(b)}⁴ = ${n(b3)} × ${n(b)} = ${n(b4)}, ${n(b)}³ = ${n(b3)} and ${n(b)}² = ${n(b2)}. The last two places are worth ${n(b)} and 1.` },
   { prompt: `What is (${dstr([e4, e3, e2, e1, e0])})${sub(b)} in base ten?`, answer: [V], explanation: `${n(e4 * b4)} + ${n(e3 * b3)} + ${n(e2 * b2)} + ${n(e1 * b)} + ${n(e0)} = ${n(V)}.` },
   { prompt: `Divide ${n(V)} by ${n(c)}. What are the quotient (the full boxes) and the remainder (the crates left over)?`, answer: [q, r], explanation: `${n(c)} × ${n(q)} = ${n(c * q)} and ${n(V)} − ${n(c * q)} = ${n(r)}, which is below ${n(c)}.` }
  ] }; }
});

/* ---- q03 Primes and the sieve [R2.1] ---- */

/* Shared by q03b and q03d: the smallest prime factor of k, the primes that need testing, and the sentence that says so. */
const spfInfo = k => { const s = Math.floor(Math.sqrt(k)), small = PRIMES.filter(p => p <= s), spf = small.find(p => k % p === 0) || k, failed = small.filter(p => p < spf);
 const first = spf === k
  ? `None of the primes up to ${n(s)} (${list(small)}) divides ${n(k)}, so ${n(k)} is prime and the smallest row length is ${n(k)} itself: one row holding everything.`
  : `${list(failed)} ${failed.length === 1 ? 'does' : 'do'} not divide ${n(k)}, but ${n(spf)} does: ${n(k)} = ${n(spf)} × ${n(k / spf)}. So ${n(k)} is composite and the smallest row length is ${n(spf)}.`;
 return { s, small, spf, first }; };
/* A number from 101 to 997 that is prime (a quarter of the time) or a product of two primes. */
const drawK = R => { let k; if (R.next() < 0.25) { let t = 0; do { k = R.int(101, 997); t++; } while (!isPrime(k) && t < 1000); if (!isPrime(k)) k = 997; }
 else { let t = 0, a, b; do { a = R.pick([3, 5, 7, 11, 13, 17, 19, 23, 29, 31]); b = R.pick(PRIMES.filter(v => v < 200)); k = a * b; t++; } while ((b < a || k < 101 || k > 997) && t < 1000); if (b < a || k < 101 || k > 997) k = 589; }
 return k; };

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Prime bins in the annexe',
 brief: 'The annexe has numbered bins for small parts, and the packers need the prime bins counted and one pallet split into rows.',
 labels: ['prime bins', 'smallest row length'], tolerance: 0.01,
 gl: [['numbers left'], ['largest number to test'], ['smallest row length']]
}, {
 /* A bin count N from 20 to 100 and a pallet k from 101 to 997 that is prime or a product of two primes. Not the learn mission's worked example (221, 30) or its draw (391, 60). */
 canonical: { k: 589, N: 75 },
 draw: R => retry(() => ({ k: drawK(R), N: R.int(20, 100) }),
  p => !(p.k === 221 && p.N === 30) && !(p.k === 391 && p.N === 60) && !(p.k === 589 && p.N === 75), { k: 589, N: 75 }),
 build: ({ k, N }) => { const { s, spf, first } = spfInfo(k), upto = PRIMES.filter(p => p <= N); return {
  prompt: `The annexe has bins numbered 2, 3, 4 and so on up to ${n(N)}. A bin is a prime bin when its number is prime. Enter how many prime bins there are. A pallet of ${n(k)} tins must also be stacked in equal rows of more than 1 tin: enter the smallest row length that works (if ${n(k)} is prime, the only row is a single row of all ${n(k)} tins).`,
  answer: [upto.length, spf],
  hints: ['Write the numbers from 2 up to the limit and cross out every multiple of 2, 3, 5 and 7, but not those four primes themselves. Every number left is prime: count them.', 'For the row length, test the primes in order, smallest first. You only need primes whose square is not more than the number: if none of those divides it, the number is prime.'],
  solution: `Crossing out the multiples of 2, 3, 5 and 7 up to ${n(N)} leaves the primes ${list(upto)}: ${n(upto.length)} prime bins. For ${n(k)}: ${n(s)} × ${n(s)} = ${n(s * s)} is not more than ${n(k)}, but ${n(s + 1)} × ${n(s + 1)} = ${n((s + 1) * (s + 1))} is, so only primes up to ${n(s)} need testing. ${first}`,
  guidance: [
   { prompt: `In the list from 2 to ${n(N)}, cross out the multiples of 2, 3, 5 and 7 but not those four primes. How many numbers are left?`, answer: [upto.length], explanation: `Every composite number up to ${n(N)} has a prime factor no bigger than 7, so it is crossed out. What is left are the primes: ${list(upto)}, which is ${n(upto.length)} numbers.` },
   { prompt: `What is the largest whole number whose square is not more than ${n(k)}? Only primes up to it need testing.`, answer: [s], explanation: `${n(s)} × ${n(s)} = ${n(s * s)} and ${n(s + 1)} × ${n(s + 1)} = ${n((s + 1) * (s + 1))}, which is more than ${n(k)}. If ${n(k)} had two factors both bigger than ${n(s)}, their product would be too big.` },
   { prompt: `Test the primes from 2 up to ${n(s)} in order. What is the smallest row length?`, answer: [spf], explanation: first }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Fuel racks and crate racks',
 brief: 'The store racks are being allotted: prime-numbered racks for fuel, the rest for crates, and the crate racks need fixings.',
 labels: ['fuel racks', 'crate racks', 'bolts needed'], tolerance: 0.01,
 gl: [['fuel racks'], ['crate racks'], ['bolts needed']]
}, {
 /* N racks from 30 to 100, t bolts from 3 to 9 per crate rack. Rack 1 is empty, so the crate racks are N − 1 − (primes up to N). */
 canonical: { N: 64, t: 6 },
 draw: R => retry(() => ({ N: R.int(30, 100), t: R.int(3, 9) }), p => !(p.N === 64 && p.t === 6), { N: 64, t: 6 }),
 build: ({ N, t }) => { const upto = PRIMES.filter(p => p <= N), P = upto.length, C = N - 1 - P, B = C * t; return {
  prompt: `The racks of the crate store are numbered 1, 2, 3 and so on up to ${n(N)}. Rack 1 is kept empty. Fuel goes only on racks whose number is prime, and crates go on every other rack above 1 (a number above 1 that is not prime is called composite). Each crate rack needs ${n(t)} bolts to fix its shelf. Enter the number of fuel racks, the number of crate racks, and the total number of bolts needed for the crate racks.`,
  answer: [P, C, B],
  hints: ['Write the numbers from 2 up to the limit and cross out every multiple of 2, 3, 5 and 7, but not those four primes themselves. The numbers left are the prime racks.', 'The crate racks are all the racks except rack 1 and the fuel racks. Then multiply by the bolts for one rack.'],
  solution: `Crossing out the multiples of 2, 3, 5 and 7 up to ${n(N)} leaves the primes ${list(upto)}, so ${n(P)} racks hold fuel. Rack 1 is empty, so the crate racks are ${n(N)} − 1 − ${n(P)} = ${n(C)}. At ${n(t)} bolts each they need ${n(C)} × ${n(t)} = ${n(B)} bolts.`,
  guidance: [
   { prompt: `In the list from 2 to ${n(N)}, cross out the multiples of 2, 3, 5 and 7 but not those four primes. How many fuel racks are left?`, answer: [P], explanation: `Every composite number up to ${n(N)} has a prime factor no bigger than 7, so it is crossed out. What is left are the primes: ${list(upto)}, which is ${n(P)} racks.` },
   { prompt: `There are ${n(N)} racks in all. Rack 1 is empty and ${n(P)} racks hold fuel. How many crate racks are there?`, answer: [C], explanation: `${n(N)} − 1 − ${n(P)} = ${n(C)}.` },
   { prompt: `Each crate rack needs ${n(t)} bolts. How many bolts do ${n(C)} crate racks need?`, answer: [B], explanation: `${n(C)} × ${n(t)} = ${n(B)}.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q01', title: 'Tag check and wall chart',
 brief: 'A pallet tag carries a four-digit number, and the wall chart of primes must be checked for primes that leave a given remainder.',
 labels: ['smallest row length', 'primes with that remainder'], tolerance: 0.01,
 gl: [['largest number to test'], ['smallest row length'], ['primes with that remainder']]
}, {
 /* A tag k from 1001 to 2400 that is prime (a fifth of the time) or a product of two primes, so primes up to 47 are enough; and a count of the primes up to N (50 to 100)
    that leave remainder r on division by m (3, 4, 5 or 7): between 2 and 20 of them. Mixes in the division algorithm (q01). */
 canonical: { k: 1517, N: 80, m: 4, r: 3 },
 draw: R => retry(() => { let k;
   if (R.next() < 0.2) { const ps = PRIMES.filter(v => v > 1000 && v < 2400); k = R.pick(ps); }
   else { const a = R.pick(PRIMES.filter(v => v >= 3 && v <= 47)); const bs = PRIMES.filter(v => v >= a && a * v >= 1001 && a * v <= 2400); k = bs.length ? a * R.pick(bs) : 1517; }
   const m = R.pick([3, 4, 5, 7]); return { k, N: R.int(50, 100), m, r: R.int(1, m - 1) }; },
  p => { const c = PRIMES.filter(v => v <= p.N && v % p.m === p.r).length; return c >= 2 && c <= 20 && !(p.k === 1517 && p.N === 80 && p.m === 4 && p.r === 3); }, { k: 1517, N: 80, m: 4, r: 3 }),
 build: ({ k, N, m, r }) => { const { s, spf, first } = spfInfo(k), match = PRIMES.filter(p => p <= N && p % m === r); return {
  prompt: `A tag on a pallet reads ${n(k)}. The packers want to stack ${n(k)} bolts in equal rows of more than 1 bolt: enter the smallest row length that works (if ${n(k)} is prime, the only row is a single row of all ${n(k)} bolts; type it without commas). The wall chart also lists every prime from 2 up to ${n(N)}. Divide each of those primes p by ${n(m)} and write p = ${n(m)}q + r with 0 ≤ r < ${n(m)} (a prime below ${n(m)} has q = 0 and r = p). Enter how many of those primes leave r = ${n(r)}.`,
  answer: [spf, match.length],
  hints: ['For the row length, test the primes in order, smallest first. You only need primes whose square is not more than the number: if none of those divides it, the number is prime.', 'List the primes up to the limit first. Then divide each one by the divisor and keep a tally of those whose remainder is the one asked for.'],
  solution: `${n(s)} × ${n(s)} = ${n(s * s)} is not more than ${n(k)}, but ${n(s + 1)} × ${n(s + 1)} = ${n((s + 1) * (s + 1))} is, so only primes up to ${n(s)} need testing. ${first} The primes up to ${n(N)} that leave remainder ${n(r)} on division by ${n(m)} are ${list(match)}, which is ${n(match.length)} of them.`,
  guidance: [
   { prompt: `What is the largest whole number whose square is not more than ${n(k)}? Only primes up to it need testing.`, answer: [s], explanation: `${n(s)} × ${n(s)} = ${n(s * s)} and ${n(s + 1)} × ${n(s + 1)} = ${n((s + 1) * (s + 1))}, which is more than ${n(k)}. If ${n(k)} had two factors both bigger than ${n(s)}, their product would be too big.` },
   { prompt: `Test the primes from 2 up to ${n(s)} in order. What is the smallest row length?`, answer: [spf], explanation: first },
   { prompt: `List the primes up to ${n(N)}, divide each by ${n(m)}, and count those that leave remainder ${n(r)}. How many are there?`, answer: [match.length], explanation: `The primes that leave remainder ${n(r)} on division by ${n(m)} are ${list(match)}, which is ${n(match.length)} of them.` }
  ] }; }
});

/* ---- q04 Prime factorisation [R2.3] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'Tile pallet filing',
 brief: 'Wall tiles are filed by prime factorisation like everything else in the store, and the clerk also logs how many prime factors a pallet has.',
 labels: ['exponent of 2', 'exponent of 3', 'exponent of 5', 'exponent of 7', 'prime factors in all'], tolerance: 0.01,
 gl: [['exponent of 2', 'odd part left'], ['exponent of 3', 'part left'], ['exponent of 5', 'exponent of 7'], ['prime factors in all']]
}, {
 /* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ from 200 to 9999 with at least three of the four primes. Not the learn mission's worked example (360) or draw (5040). */
 canonical: { a: 3, b: 1, c: 2, d: 1 },
 draw: R => retry(() => ({ a: R.int(0, 6), b: R.int(0, 4), c: R.int(0, 3), d: R.int(0, 2) }),
  p => { const v = val4([p.a, p.b, p.c, p.d]); return v >= 200 && v <= 9999 && [p.a, p.b, p.c, p.d].filter(e => e > 0).length >= 3 && v !== 360 && v !== 5040 && v !== 4200; }, { a: 3, b: 1, c: 2, d: 1 }),
 build: ({ a, b, c, d }) => { const k = val4([a, b, c, d]), m1 = k / POW(2, a), m2 = m1 / POW(3, b), m3 = m2 / POW(5, c), F = fact([[2, a], [3, b], [5, c], [7, d]]), tot = a + b + c + d; return {
  prompt: `Wall tiles are filed by prime factorisation, like everything else in the store. A pallet of ${n(k)} tiles has arrived. Write ${n(k)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ and enter the exponents a, b, c and d, in that order (an exponent is 0 when that prime does not divide ${n(k)}). Then enter how many prime factors ${n(k)} has altogether when each prime is counted once for every time it divides (for 12 = 2 × 2 × 3 that is 3).`,
  answer: [a, b, c, d, tot],
  hints: ['Divide by 2 for as long as the result stays a whole number, counting the divisions. Then do the same with 3, with 5 and with 7.', 'The number of prime factors counted with repeats is the number of divisions you made in all: add the four exponents.'],
  solution: `Dividing ${n(k)} by 2 for as long as possible takes ${divs(a)} and leaves ${n(m1)}. Dividing ${n(m1)} by 3 takes ${divs(b)} and leaves ${n(m2)}. Dividing ${n(m2)} by 5 takes ${divs(c)} and leaves ${n(m3)}, and ${n(m3)} = 7${sup(d)}. So ${n(k)} = ${F}, and the exponents are ${n(a)}, ${n(b)}, ${n(c)} and ${n(d)}. Counted with repeats there are ${n(a)} + ${n(b)} + ${n(c)} + ${n(d)} = ${n(tot)} prime factors.`,
  guidance: [
   { prompt: `How many times can ${n(k)} be halved before the result is odd, and what odd number is left?`, answer: [a, m1], explanation: `Halving ${n(k)} takes ${divs(a)} before the result is odd: ${n(m1)} is left, so the exponent of 2 is ${n(a)}.` },
   { prompt: `How many times can ${n(m1)} be divided by 3, and what is left?`, answer: [b, m2], explanation: `Dividing ${n(m1)} by 3 takes ${divs(b)} before 3 no longer divides: ${n(m2)} is left, so the exponent of 3 is ${n(b)}.` },
   { prompt: `What are the exponents of 5 and of 7 in ${n(m2)}?`, answer: [c, d], explanation: `${n(m2)} = 5${sup(c)} × 7${sup(d)} (a power 0 is 1), so the exponents of 5 and 7 are ${n(c)} and ${n(d)}. Altogether ${n(k)} = ${F}.` },
   { prompt: `Each exponent counts how many times its prime divides. How many prime factors does ${n(k)} have altogether, counted with repeats?`, answer: [tot], explanation: `${n(a)} + ${n(b)} + ${n(c)} + ${n(d)} = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The square of panels',
 brief: 'Mira wants every panel in stock laid out as one square, so she must order exactly the right extra stock.',
 labels: ['multiplier m', 'panels along one side'], tolerance: 0.01,
 gl: [['exponent of 2', 'exponent of 3', 'exponent of 5', 'exponent of 7'], ['multiplier m'], ['panels along one side']]
}, {
 /* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ from 60 to 9999 with at least two of the four primes and at least one odd exponent, so m is above 1. */
 canonical: { a: 3, b: 1, c: 2, d: 1 },
 draw: R => retry(() => ({ a: R.int(0, 6), b: R.int(0, 4), c: R.int(0, 3), d: R.int(0, 2) }),
  p => { const v = val4([p.a, p.b, p.c, p.d]); return v >= 60 && v <= 9999 && [p.a, p.b, p.c, p.d].filter(e => e > 0).length >= 2 && [p.a, p.b, p.c, p.d].some(e => e % 2 === 1) && !(p.a === 3 && p.b === 1 && p.c === 2 && p.d === 1); }, { a: 3, b: 1, c: 2, d: 1 }),
 build: ({ a, b, c, d }) => { const e = [a, b, c, d], k = val4(e), odd = P4.filter((p, i) => e[i] % 2 === 1), m = odd.reduce((s, p) => s * p, 1), nm = k * m,
  e2 = e.map((x, i) => x + (x % 2)), half = e2.map(x => x / 2), s = val4(half), F = fact(P4.map((p, i) => [p, e[i]])), F2 = fact(P4.map((p, i) => [p, e2[i]])), Fh = fact(P4.map((p, i) => [p, half[i]])); return {
  prompt: `The store holds ${n(k)} panels, and Mira wants to lay every one of them out as a square, with the same number of panels along each side. Since ${n(k)} is not a perfect square, she will buy extra stock so that the new total is ${n(k)} × m, where m is the smallest whole number above 0 that makes the new total a perfect square. (A whole number is a perfect square exactly when every exponent in its prime factorisation is even.) Enter m, then enter the number of panels along one side of the finished square (type it without commas).`,
  answer: [m, s],
  hints: ['Factorise the stock first: divide by 2, 3, 5 and 7 as often as each goes, counting the divisions.', 'Multiplying by a prime adds 1 to its exponent. An odd exponent needs one more copy of that prime to become even; an even exponent needs nothing. So m is the product of the primes with an odd exponent.', 'The side of a square is found by halving every exponent in the new total.'],
  solution: `${n(k)} = ${F}. ${odd.length > 1 ? `The primes with an odd exponent are ${list(odd)}` : `The only prime with an odd exponent is ${list(odd)}`}, so m = ${odd.length > 1 ? odd.map(n).join(' × ') + ' = ' : ''}${n(m)}. The new total is ${n(k)} × ${n(m)} = ${n(nm)} = ${F2}, and every exponent is now even. Halving each exponent gives the side: ${Fh} = ${n(s)}. Check: ${n(s)} × ${n(s)} = ${n(s * s)}.`,
  guidance: [
   { prompt: `Write ${n(k)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are the four exponents?`, answer: e, explanation: `${n(k)} = ${F}, so the exponents are ${n(a)}, ${n(b)}, ${n(c)} and ${n(d)}.` },
   { prompt: `Which primes have an odd exponent? Multiply one copy of each of them together. What is m?`, answer: [m], explanation: `${odd.length > 1 ? `The odd exponents belong to ${list(odd)}. One more copy of each makes` : `Only ${list(odd)} has an odd exponent. One more copy of it makes`} every exponent even, so m = ${odd.length > 1 ? odd.map(n).join(' × ') + ' = ' : ''}${n(m)}.` },
   { prompt: `The new total is ${n(k)} × ${n(m)} = ${n(nm)}. Halve every exponent in its factorisation. How many panels are there along one side?`, answer: [s], explanation: `${n(nm)} = ${F2}. Halving each exponent gives ${Fh} = ${n(s)}, and ${n(s)} × ${n(s)} = ${n(s * s)}.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'The hidden big prime',
 brief: 'A large delivery number hides one big prime among its small prime factors, and the filing card needs all five exponents and the big prime.',
 labels: ['exponent of 2', 'exponent of 3', 'exponent of 5', 'exponent of 7', 'the larger prime q'], tolerance: 0.01,
 gl: [['exponent of 2', 'odd part left'], ['exponent of 3', 'part left'], ['exponent of 5', 'exponent of 7', 'the larger prime q']]
}, {
 /* N = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ × q from 1000 to 99999, with q a prime from 11 to 97 dividing it once and at least two of the small primes present. Uses q03 (a leftover is prime when no prime up to its square root divides it). */
 canonical: { a: 2, b: 3, c: 1, d: 0, q: 61 },
 draw: R => retry(() => ({ a: R.int(0, 5), b: R.int(0, 4), c: R.int(0, 2), d: R.int(0, 2), q: R.pick(PRIMES.filter(v => v >= 11 && v <= 97)) }),
  p => { const v = val4([p.a, p.b, p.c, p.d]) * p.q; return v >= 1000 && v <= 99999 && [p.a, p.b, p.c, p.d].filter(e => e > 0).length >= 2 && !(p.a === 2 && p.b === 3 && p.c === 1 && p.d === 0 && p.q === 61); }, { a: 2, b: 3, c: 1, d: 0, q: 61 }),
 build: ({ a, b, c, d, q }) => { const N = val4([a, b, c, d]) * q, m1 = N / POW(2, a), m2 = m1 / POW(3, b), m3 = m2 / POW(5, c), F = fact([[2, a], [3, b], [5, c], [7, d], [q, 1]]), s = Math.floor(Math.sqrt(q)), small = PRIMES.filter(p => p <= s); return {
  prompt: `A big delivery of ${n(N)} cans has arrived. Its prime factorisation has the form 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ × q, where q is one more prime, bigger than 7, that divides ${n(N)} exactly once. Enter the exponents a, b, c and d in that order (an exponent is 0 when that prime does not divide ${n(N)}), then enter q.`,
  answer: [a, b, c, d, q],
  hints: ['Divide out 2, 3, 5 and 7 as many times as each one goes, counting the divisions. What is left over has no prime factor up to 7.', 'The number left over is q. To be sure that it is prime, check that no prime whose square is not more than it divides it.'],
  solution: `Dividing ${n(N)} by 2 for as long as possible takes ${divs(a)} and leaves ${n(m1)}. Dividing ${n(m1)} by 3 takes ${divs(b)} and leaves ${n(m2)}. Dividing ${n(m2)} by 5 takes ${divs(c)} and leaves ${n(m3)}, and dividing ${n(m3)} by 7 takes ${divs(d)} and leaves ${n(q)}. ${n(q)} is prime: none of the primes up to ${n(s)} (${list(small)}) divides it. So ${n(N)} = ${F}.`,
  guidance: [
   { prompt: `How many times can ${n(N)} be halved before the result is odd, and what odd number is left?`, answer: [a, m1], explanation: `Halving ${n(N)} takes ${divs(a)} before the result is odd: ${n(m1)} is left, so the exponent of 2 is ${n(a)}.` },
   { prompt: `How many times can ${n(m1)} be divided by 3, and what is left?`, answer: [b, m2], explanation: `Dividing ${n(m1)} by 3 takes ${divs(b)} before 3 no longer divides: ${n(m2)} is left, so the exponent of 3 is ${n(b)}.` },
   { prompt: `Divide ${n(m2)} by 5 and then by 7, as often as each divides. What are the exponents c and d, and what prime q is left?`, answer: [c, d, q], explanation: `${n(m2)} takes ${divs(c)} by 5 and ${divs(d)} by 7, so c = ${n(c)} and d = ${n(d)}, and ${n(q)} is left. It is prime: none of the primes up to ${n(s)} (${list(small)}) divides it. Altogether ${n(N)} = ${F}.` }
  ] }; }
});

/* ---- q05 gcd and lcm from factorisations [R2.4] ---- */

/* A and B built from 2, 3, 5, 7 between 20 and 1000, neither dividing the other, gcd above 1: the draw shared by q05b and q05c. */
const drawPair = (R, skip, canon) => retry(() => ({ a2: R.int(0, 3), a3: R.int(0, 3), a5: R.int(0, 2), a7: R.int(0, 1), b2: R.int(0, 3), b3: R.int(0, 3), b5: R.int(0, 2), b7: R.int(0, 1) }),
 p => { const A = val4([p.a2, p.a3, p.a5, p.a7]), B = val4([p.b2, p.b3, p.b5, p.b7]);
  return A >= 20 && B >= 20 && A <= 1000 && B <= 1000 && A % B !== 0 && B % A !== 0 && gcd(A, B) > 1 && !(A === 360 && B === 756) && !(A === 12 && B === 18) && !(A === 18 && B === 12) && !skip(A, B); }, canon);
const pairInfo = p => { const ea = [p.a2, p.a3, p.a5, p.a7], eb = [p.b2, p.b3, p.b5, p.b7], A = val4(ea), B = val4(eb),
 lo = P4.map((q, i) => [q, Math.min(ea[i], eb[i])]), hi = P4.map((q, i) => [q, Math.max(ea[i], eb[i])]), g = lo.reduce((s, [q, e]) => s * POW(q, e), 1), L = hi.reduce((s, [q, e]) => s * POW(q, e), 1);
 return { ea, eb, A, B, lo, hi, g, L, FA: fact(P4.map((q, i) => [q, ea[i]])), FB: fact(P4.map((q, i) => [q, eb[i]])), Flo: fact(lo), Fhi: fact(hi) }; };

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Cable reels and warning lamps',
 brief: 'Two cable reels are to be cut into equal pieces and two warning lamps must be timed against each other.',
 labels: ['longest piece (m)', 'seconds until next joint flash'], tolerance: 0.01,
 gl: [['exponent of 2 in the first', 'exponent of 3 in the first', 'exponent of 5 in the first', 'exponent of 7 in the first'], ['exponent of 2 in the second', 'exponent of 3 in the second', 'exponent of 5 in the second', 'exponent of 7 in the second'], ['gcd'], ['lcm']]
}, {
 /* A and B built from 2, 3, 5, 7, from 20 to 1000, gcd above 1, neither dividing the other. Not the learn mission's numbers (12, 18) and (360, 756). */
 canonical: { a2: 2, a3: 1, a5: 2, a7: 0, b2: 3, b3: 0, b5: 1, b7: 1 },
 draw: R => drawPair(R, (A, B) => (A === 300 && B === 280) || (A === 280 && B === 300), { a2: 2, a3: 1, a5: 2, a7: 0, b2: 3, b3: 0, b5: 1, b7: 1 }),
 build: p => { const { ea, eb, A, B, lo, hi, g, L, FA, FB, Flo, Fhi } = pairInfo(p); return {
  prompt: `Two cable reels on the drum rack of the crate store hold ${n(A)} metres and ${n(B)} metres of cable. Mira wants to cut both reels into equal pieces of one length with nothing left over, and wants the longest such length: enter it in metres. Two warning lamps also flash every ${n(A)} seconds and every ${n(B)} seconds, and both flash together now: enter the number of seconds until they next flash together (type it without commas).`,
  answer: [g, L],
  hints: ['The longest piece that cuts both reels exactly is their greatest common divisor: write each length as a product of prime powers and take each prime to the smaller of its two exponents.', 'The lamps flash together at times that are multiples of both periods, and the first such time is the least common multiple: take each prime to the larger of its two exponents.'],
  solution: `${n(A)} = ${FA} and ${n(B)} = ${FB}. The smaller exponents give the longest piece, gcd = ${Flo} = ${n(g)} metres. The larger exponents give the next joint flash, lcm = ${Fhi} = ${n(L)} seconds. Check: ${n(g)} × ${n(L)} = ${n(g * L)}, which is ${n(A)} × ${n(B)}.`,
  guidance: [
   { prompt: `Write ${n(A)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are the four exponents?`, answer: ea, explanation: `${n(A)} = ${FA}, so the exponents are ${ea.map(n).join(', ')}.` },
   { prompt: `Now write ${n(B)} the same way. What are its four exponents?`, answer: eb, explanation: `${n(B)} = ${FB}, so the exponents are ${eb.map(n).join(', ')}.` },
   { prompt: `Take each prime to the smaller of its two exponents. What is the longest piece, in metres?`, answer: [g], explanation: `The smaller exponents of 2, 3, 5 and 7 are ${lo.map(([, e]) => n(e)).join(', ')}, so the gcd is ${Flo} = ${n(g)}.` },
   { prompt: `Take each prime to the larger of its two exponents. After how many seconds do the lamps next flash together?`, answer: [L], explanation: `The larger exponents are ${hi.map(([, e]) => n(e)).join(', ')}, so the lcm is ${Fhi} = ${n(L)}.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Kits with nothing left',
 brief: 'A shipment of bolts and nuts is to be made up into identical fitting kits, with as many kits as possible and nothing left in the crates.',
 labels: ['kits', 'bolts in each kit', 'nuts in each kit'], tolerance: 0.01,
 gl: [['kits'], ['bolts in each kit', 'nuts in each kit']]
}, {
 /* A bolts and B nuts built from 2, 3, 5, 7, from 20 to 1000, gcd above 1, neither dividing the other, so each kit holds at least 2 of each. */
 canonical: { a2: 3, a3: 2, a5: 0, a7: 1, b2: 2, b3: 1, b5: 1, b7: 1 },
 draw: R => drawPair(R, (A, B) => (A === 504 && B === 420) || (A === 420 && B === 504), { a2: 3, a3: 2, a5: 0, a7: 1, b2: 2, b3: 1, b5: 1, b7: 1 }),
 build: p => { const { A, B, g, FA, FB, Flo } = pairInfo(p), x = A / g, y = B / g; return {
  prompt: `A shipment has ${n(A)} bolts and ${n(B)} nuts. Mira makes them up into identical fitting kits: every kit has the same number of bolts and the same number of nuts, and every bolt and every nut goes into a kit with none left over. She wants as many kits as possible. Enter the number of kits, the number of bolts in each kit, and the number of nuts in each kit.`,
  answer: [g, x, y],
  hints: ['Every kit takes the same number of bolts and the same number of nuts, so the number of kits divides both totals. The most kits is the greatest common divisor: take each prime to the smaller of its two exponents.', 'Each kit then gets the bolts divided by the number of kits, and the nuts divided by the number of kits.'],
  solution: `${n(A)} = ${FA} and ${n(B)} = ${FB}. The smaller exponents give the most kits: gcd = ${Flo} = ${n(g)}. Each kit has ${n(A)} ÷ ${n(g)} = ${n(x)} bolts and ${n(B)} ÷ ${n(g)} = ${n(y)} nuts.`,
  guidance: [
   { prompt: `Write ${n(A)} and ${n(B)} as products of the primes 2, 3, 5 and 7, and take each prime to the smaller of its two exponents. What is the greatest number of kits?`, answer: [g], explanation: `${n(A)} = ${FA} and ${n(B)} = ${FB}, so the gcd is ${Flo} = ${n(g)}.` },
   { prompt: `With ${n(g)} kits, how many bolts and how many nuts go into each kit?`, answer: [x, y], explanation: `${n(A)} ÷ ${n(g)} = ${n(x)} and ${n(B)} ÷ ${n(g)} = ${n(y)}. Check: ${n(g)} × ${n(x)} = ${n(A)} and ${n(g)} × ${n(y)} = ${n(B)}.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q01', title: 'Lamps over a full shift',
 brief: 'Two signal lamps flash together at the start of a shift, and the night clerk must count the joint flashes over the whole shift.',
 labels: ['seconds between joint flashes', 'joint flashes in the shift', 'seconds since the last one'], tolerance: 0.01,
 gl: [['lcm'], ['joint flashes', 'seconds since the last one']]
}, {
 /* A and B built from 2, 3, 5, 7, from 20 to 1000, neither dividing the other, lcm from 100 to 5000; a shift of T seconds with 3 to 11 whole joint periods in it
    and T not a multiple of the lcm; one draw in six has a short shift (T from half the lcm to just below it) with no joint flash after second 0. Mixes in the division algorithm (q01): joint flashes = the quotient, seconds since the last = the remainder. */
 canonical: { a2: 3, a3: 2, a5: 0, a7: 0, b2: 2, b3: 0, b5: 1, b7: 1, T: 15000 },
 draw: R => retry(() => { const p = { a2: R.int(0, 3), a3: R.int(0, 3), a5: R.int(0, 2), a7: R.int(0, 1), b2: R.int(0, 3), b3: R.int(0, 3), b5: R.int(0, 2), b7: R.int(0, 1) }, L = pairInfo(p).L; p.T = R.int(0, 5) === 0 ? R.int(Math.ceil(L / 2), L - 1) : R.int(3 * L + 1, 12 * L - 1); return p; },
  p => { const { A, B, L } = pairInfo(p); return A >= 20 && B >= 20 && A <= 1000 && B <= 1000 && A % B !== 0 && B % A !== 0 && L >= 100 && L <= 5000 && p.T % L !== 0 && !(A === 72 && B === 140 && p.T === 15000); },
  { a2: 3, a3: 2, a5: 0, a7: 0, b2: 2, b3: 0, b5: 1, b7: 1, T: 15000 }),
 build: p => { const { A, B, L, FA, FB, Fhi } = pairInfo(p), T = p.T, { q, r } = dm(T, L); return {
  prompt: `Two signal lamps flash every ${n(A)} seconds and every ${n(B)} seconds, and both flash together at second 0, the start of a shift (that flash is not counted). Enter the number of seconds from one joint flash to the next. The shift lasts ${n(T)} seconds. Enter how many times the lamps flash together after second 0 and up to second ${n(T)}, and then how many seconds before the end of the shift they last flashed together (the flash at second 0 counts for this last answer). Type every answer without commas.`,
  answer: [L, q, r],
  hints: ['The joint flashes are at the common multiples of both periods, which are the multiples of their least common multiple. Take each prime to the larger of its two exponents to find it.', 'Divide the length of the shift by the least common multiple. The quotient is the number of joint flashes in the shift, and the remainder is the time since the last one.'],
  solution: `${n(A)} = ${FA} and ${n(B)} = ${FB}, so the lamps flash together every lcm = ${Fhi} = ${n(L)} seconds. Dividing the shift: ${n(T)} = ${n(L)} × ${n(q)} + ${n(r)}, ${q === 0 ? `so the shift ends before the first joint flash after second 0: there are 0 of them, and the last joint flash was the one at second 0, ${n(r)} seconds before the end.` : `so there are ${n(q)} joint flashes after second 0 (at ${n(L)}, 2 × ${n(L)} and so on up to ${n(q)} × ${n(L)} = ${n(q * L)}), and the last one was ${n(r)} seconds before the end.`}`,
  guidance: [
   { prompt: `Write ${n(A)} and ${n(B)} as products of the primes 2, 3, 5 and 7, and take each prime to the larger of its two exponents. What is the lcm?`, answer: [L], explanation: `${n(A)} = ${FA} and ${n(B)} = ${FB}, so the lcm is ${Fhi} = ${n(L)}.` },
   { prompt: `Divide ${n(T)} by ${n(L)}. What are the quotient (the joint flashes in the shift) and the remainder (the seconds since the last one)?`, answer: [q, r], explanation: `${n(L)} × ${n(q)} = ${n(q * L)} and ${n(T)} − ${n(q * L)} = ${n(r)}, so ${n(T)} = ${n(L)} × ${n(q)} + ${n(r)}.` }
  ] }; }
});

})();
