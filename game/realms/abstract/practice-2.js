/* Abstract algebra: patterns of moves practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p2.js. */
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
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const r = a % b; a = b; b = r; } return a; };
const isPrime = m => { if (m < 2) return false; for (let d = 2; d * d <= m; d++) if (m % d === 0) return false; return true; };
const unitsOf = m => { const out = []; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) out.push(x); return out; };
const invOf = (a, m) => { for (let b = 1; b < m; b++) if ((a * b) % m === 1) return b; return 0; };
/* a¹ … a^order mod m (a coprime to m). */
const powers = (a, m) => { const out = [a % m]; while (out[out.length - 1] !== 1 && out.length < 200) out.push((out[out.length - 1] * a) % m); return out; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
const sub = k => String(k).split('').map(d => SUB[Number(d)]).join('');
const Z = m => 'Z' + sub(m);
/* Euclid's algorithm on the pair, larger first: "24 = 1 × 18 + 6, 18 = 3 × 6 + 0". */
const euclid = (x, y) => { let a = Math.max(x, y), b = Math.min(x, y); const out = []; while (b) { out.push(`${n(a)} = ${n(Math.floor(a / b))} × ${n(b)} + ${n(a % b)}`); const r = a % b; a = b; b = r; } return out.join(', '); };
const euclidLen = (x, y) => { let a = Math.max(x, y), b = Math.min(x, y), k = 0; while (b) { const r = a % b; a = b; b = r; k++; } return k; };
const beats = k => k === 1 ? '1 beat' : `${n(k)} beats`;
const list = xs => xs.map(n).join(', ');
const CANON = { q06: [20, 7], q07: [24, 18], q08: [13, 5], q09: [18, 10], q10: [11, 3] };

/* ---- q06 Units and U(n) [3.2, 2.2] ---- */

/* Parent: m = 20, a = 7 (asks |U(m)|, then the inverse). Here the inverse comes first and the setting is a drawer keypad. */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The drawer keypad',
 brief: 'A parts drawer in the Lock Workshop opens with a keypad that scrambles its code, and the crew needs to know which keys can be undone.',
 labels: ['inverse', '|U(n)|'], tolerance: 0.01,
 gl: [['inverse'], ['|U(n)|']]
}, {
 canonical: { m: 18, a: 5 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(9, 32), us = unitsOf(m).filter(x => x !== 1);
   if (!us.length) continue; const a = R.pick(us); if (m === CANON.q06[0] && a === CANON.q06[1]) continue; return { m, a }; } return { m: 18, a: 5 }; },
 build: ({ m, a }) => { const u = unitsOf(m), inv = invOf(a, m), prod = a * inv; return {
  prompt: `A parts drawer in the Lock Workshop has a keypad with keys 1 to ${n(m - 1)}. Pressing a key multiplies the stored code by that key, mod ${n(m)}. Only keys coprime to ${n(m)} (gcd 1 with ${n(m)}) can be undone, and they form the group U(${n(m)}). Enter the inverse of ${n(a)} in U(${n(m)}): the key b with (${n(a)} × b) mod ${n(m)} = 1. Then enter |U(${n(m)})|, the number of keys that can be undone.`,
  answer: [inv, u.length],
  hints: ['The inverse is the key that, multiplied by the given key, leaves remainder 1 on division by the modulus. Try the keys in turn.', 'A key can be undone when its greatest common divisor with the modulus is 1. Count those from 1 up to one less than the modulus.'],
  solution: `${n(a)} × ${n(inv)} = ${n(prod)}, and ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + 1, so the inverse of ${n(a)} is ${n(inv)}. The keys from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(u)}, so |U(${n(m)})| = ${n(u.length)}.`,
  guidance: [
   { prompt: `Which key b in U(${n(m)}) gives (${n(a)} × b) mod ${n(m)} = 1?`, answer: [inv], explanation: `${n(a)} × ${n(inv)} = ${n(prod)}, and ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + 1. So b = ${n(inv)}.` },
   { prompt: `How many of the keys from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}? That is |U(${n(m)})|.`, answer: [u.length], explanation: `They are ${list(u)}: ${n(u.length)} keys.` }
  ] }; }
});

/* A scrambled code is undone by the inverse. Parent: m = 20, a = 7. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'Unscrambling the door code',
 brief: 'The workshop door logged only a scrambled code, and the crew must recover the code that was typed.',
 labels: ['|U(n)|', 'inverse', 'original code'], tolerance: 0.01,
 gl: [['|U(n)|'], ['inverse'], ['original code']]
}, {
 canonical: { m: 15, a: 7, s: 11 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(10, 40), us = unitsOf(m).filter(x => x !== 1);
   if (!us.length) continue; const a = R.pick(us), s = R.int(2, m - 1), x = (invOf(a, m) * s) % m;
   if (m === CANON.q06[0] && a === CANON.q06[1]) continue; if (x < 2 || x === s) continue; return { m, a, s }; } return { m: 15, a: 7, s: 11 }; },
 build: ({ m, a, s }) => { const u = unitsOf(m), inv = invOf(a, m), x = (inv * s) % m, prod = inv * s; return {
  prompt: `The Lock Workshop's door scrambles a typed code x, a whole number from 0 to ${n(m - 1)}, into (${n(a)} × x) mod ${n(m)}. Only multipliers coprime to ${n(m)} can be undone, and they form the group U(${n(m)}). The log shows the scrambled code ${n(s)}. Enter |U(${n(m)})|, the number of multipliers that can be undone. Then enter the inverse of ${n(a)} in U(${n(m)}). Then enter the typed code x, the number from 0 to ${n(m - 1)} with (${n(a)} × x) mod ${n(m)} = ${n(s)}.`,
  answer: [u.length, inv, x],
  hints: ['Count the numbers from 1 up to one less than the modulus whose greatest common divisor with it is 1.', 'The inverse is the number that, multiplied by the multiplier, leaves remainder 1 on division by the modulus.', 'Multiplying the scrambled code by the inverse undoes the multiplier. Reduce the product mod the modulus.'],
  solution: `The numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(u)}, so |U(${n(m)})| = ${n(u.length)}. ${n(a)} × ${n(inv)} = ${n(a * inv)}, and ${n(a * inv)} = ${n(Math.floor(a * inv / m))} × ${n(m)} + 1, so the inverse of ${n(a)} is ${n(inv)}. Multiplying the scrambled code by the inverse undoes the multiplier: ${n(inv)} × ${n(s)} = ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + ${n(x)}, so x = ${n(x)}. Check: ${n(a)} × ${n(x)} = ${n(a * x)} = ${n(Math.floor(a * x / m))} × ${n(m)} + ${n(s)}.`,
  guidance: [
   { prompt: `How many of the numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}? That is |U(${n(m)})|.`, answer: [u.length], explanation: `They are ${list(u)}: ${n(u.length)} numbers.` },
   { prompt: `Which number b in U(${n(m)}) gives (${n(a)} × b) mod ${n(m)} = 1?`, answer: [inv], explanation: `${n(a)} × ${n(inv)} = ${n(a * inv)}, and ${n(a * inv)} = ${n(Math.floor(a * inv / m))} × ${n(m)} + 1. So b = ${n(inv)}.` },
   { prompt: `Multiply the scrambled code ${n(s)} by ${n(inv)} and reduce mod ${n(m)}. What is the typed code x?`, answer: [x], explanation: `${n(inv)} × ${n(s)} = ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + ${n(x)}. Undoing the multiplier by ${n(a)} means multiplying by its inverse.` }
  ] }; }
});

/* Challenge: two dials in a row (q02: multiplying on a clock) in a bigger group. Parent: m = 20, a = 7. */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', title: 'Two dials in a row', uses: 'q02',
 brief: 'Two vault dials are wired one after the other, and the crew needs to know what single dial would do the same job and how to undo it.',
 labels: ['|U(n)|', 'combined multiplier', 'inverse'], tolerance: 0.01,
 gl: [['|U(n)|'], ['combined multiplier'], ['inverse']]
}, {
 canonical: { m: 40, a: 7, b: 11 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.pick([30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 48]), us = unitsOf(m).filter(x => x !== 1);
   const a = R.pick(us), b = R.pick(us), p = (a * b) % m; if (p === 1 || p === m - 1 || a === b) continue; return { m, a, b }; } return { m: 40, a: 7, b: 11 }; },
 build: ({ m, a, b }) => { const u = unitsOf(m), p = (a * b) % m, inv = invOf(p, m); return {
  prompt: `Two vault dials are wired in a row. A code enters the first dial and is multiplied by ${n(a)}, mod ${n(m)}. The result enters the second dial and is multiplied by ${n(b)}, mod ${n(m)}. Together they act like one dial that multiplies by a single number p, the remainder of ${n(a)} × ${n(b)} on division by ${n(m)}. Only multipliers coprime to ${n(m)} can be undone, and they form the group U(${n(m)}). Enter |U(${n(m)})|, then p, then the inverse of p in U(${n(m)}): the number c with (p × c) mod ${n(m)} = 1.`,
  answer: [u.length, p, inv],
  hints: ['Count the numbers from 1 up to one less than the modulus whose greatest common divisor with it is 1.', 'Multiply the two multipliers, then divide by the modulus and keep the remainder.', 'The inverse is the number that, multiplied by p, leaves remainder 1 on division by the modulus. It lies in U of the modulus.'],
  solution: `The numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(u)}, so |U(${n(m)})| = ${n(u.length)}. ${n(a)} × ${n(b)} = ${n(a * b)} = ${n(Math.floor(a * b / m))} × ${n(m)} + ${n(p)}, so p = ${n(p)}. For the inverse: ${n(p)} × ${n(inv)} = ${n(p * inv)} = ${n(Math.floor(p * inv / m))} × ${n(m)} + 1, so c = ${n(inv)}.`,
  guidance: [
   { prompt: `How many of the numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}? That is |U(${n(m)})|.`, answer: [u.length], explanation: `They are ${list(u)}: ${n(u.length)} numbers.` },
   { prompt: `What is ${n(a)} × ${n(b)} mod ${n(m)}?`, answer: [p], explanation: `${n(a)} × ${n(b)} = ${n(a * b)} = ${n(Math.floor(a * b / m))} × ${n(m)} + ${n(p)}.` },
   { prompt: `Which number c in U(${n(m)}) gives (${n(p)} × c) mod ${n(m)} = 1?`, answer: [inv], explanation: `${n(p)} × ${n(inv)} = ${n(p * inv)} = ${n(Math.floor(p * inv / m))} × ${n(m)} + 1. So c = ${n(inv)}.` }
  ] }; }
});

/* ---- q07 Order of an element in Z_n [4.1] ---- */

/* Parent: m = 24, a = 18. Here: an airlock hatch, and laps instead of a check step. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The airlock hatch turns',
 brief: 'An airlock hatch turns a fixed number of notches every cycle, and the crew needs to know when it next seals and how far round it has gone.',
 labels: ['order of a', 'laps'], tolerance: 0.01,
 gl: [['gcd(a, n)'], ['order of a'], ['laps']]
}, {
 canonical: { m: 30, a: 12 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(8, 45), a = R.int(2, m - 1);
   if (gcd(a, m) < 2 || (m === CANON.q07[0] && a === CANON.q07[1])) continue; return { m, a }; } return { m: 30, a: 12 }; },
 build: ({ m, a }) => { const g = gcd(a, m), o = m / g, laps = a / g; return {
  prompt: `A rotating airlock hatch has ${n(m)} notches, numbered 0 to ${n(m - 1)}, and it is sealed at notch 0. On every cycle it turns ${n(a)} notches forward, wrapping round from notch ${n(m - 1)} to notch 0, so after k cycles it sits at notch (k × ${n(a)}) mod ${n(m)}. Enter the order of ${n(a)} in ${Z(m)}: the smallest number of cycles, at least 1, after which the hatch is sealed again at notch 0. Then enter how many full laps of the dial it has made by then, which is the total notches turned divided by ${n(m)}.`,
  answer: [o, laps],
  hints: ['The order of a in Zₙ is n ÷ gcd(a, n). Find the gcd with Euclid\'s algorithm first.', 'The total number of notches turned is the number of cycles times the notches per cycle. Divide it by the number of notches in the dial.'],
  solution: `${euclid(m, a)}, so gcd(${n(a)}, ${n(m)}) = ${n(g)}. The order of ${n(a)} is ${n(m)} ÷ ${n(g)} = ${n(o)}. In ${n(o)} cycles the hatch turns ${n(o)} × ${n(a)} = ${n(o * a)} notches, and ${n(o * a)} ÷ ${n(m)} = ${n(laps)} full laps.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${euclid(m, a)}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `The order is ${n(m)} ÷ gcd(${n(a)}, ${n(m)}). What is it?`, answer: [o], explanation: `${n(m)} ÷ ${n(g)} = ${n(o)} cycles.` },
   { prompt: `In ${n(o)} cycles the hatch turns ${n(o)} × ${n(a)} = ${n(o * a)} notches. How many full laps of ${n(m)} notches is that?`, answer: [laps], explanation: `${n(o * a)} ÷ ${n(m)} = ${n(laps)}. The hatch comes back to notch 0 after a whole number of laps.` }
  ] }; }
});

/* Returns to lamp 0 within T beats, and the lamp at beat T. Parent: m = 24, a = 18. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'Servicing the pulse lens',
 brief: 'The pulse lens must be serviced every time the light is back at lamp 0, and the crew wants a schedule for a long run.',
 labels: ['order of a', 'visits to lamp 0', 'lamp at the end'], tolerance: 0.01,
 gl: [['order of a'], ['visits to lamp 0'], ['lamp at the end']]
}, {
 canonical: { m: 28, a: 21, T: 150 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(12, 42), a = R.int(2, m - 1), g = gcd(a, m), o = m / g, T = R.int(60, 200);
   if (g < 2 || o < 3 || o > 15 || T % o === 0 || (m === CANON.q07[0] && a === CANON.q07[1])) continue; return { m, a, T }; } return { m: 28, a: 21, T: 150 }; },
 build: ({ m, a, T }) => { const g = gcd(a, m), o = m / g, ret = Math.floor(T / o), r = T % o, lamp = (T * a) % m; return {
  prompt: `A ring of ${n(m)} lamps on the Beacon Tower is numbered 0 to ${n(m - 1)}. A light pulse starts at lamp 0 and jumps ${n(a)} lamps round the ring on every beat, so after k beats it is at lamp (k × ${n(a)}) mod ${n(m)}. The lens is serviced each time the pulse is back at lamp 0, counting beat 1 onward. The run lasts ${n(T)} beats. Enter the order of ${n(a)} in ${Z(m)}, the smallest number of beats, at least 1, that brings the pulse back to lamp 0. Then enter how many times the pulse is at lamp 0 during the run, counting the last beat if it lands there. Then enter the lamp the pulse is on after beat ${n(T)}.`,
  answer: [o, ret, lamp],
  hints: ['The order of a in Zₙ is n ÷ gcd(a, n).', 'The pulse is at lamp 0 on beat order, 2 × order, 3 × order, and so on. Count how many of those fit within the run.', 'After whole returns the pulse starts again from lamp 0, so only the beats left over after the last return move it. Multiply them by the jump and reduce mod the ring size.'],
  solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)} (${euclid(m, a)}), so the order of ${n(a)} is ${n(m)} ÷ ${n(g)} = ${n(o)}. The pulse is at lamp 0 on beats ${n(o)}, ${n(2 * o)}, ${n(3 * o)}, …, and ${n(T)} = ${n(ret)} × ${n(o)} + ${n(r)}, so it is there ${n(ret)} times. After the last return ${beats(r)} are left over, so the pulse is on lamp (${n(r)} × ${n(a)}) mod ${n(m)} = ${n(lamp)}. Check: ${n(T)} × ${n(a)} = ${n(T * a)} = ${n(Math.floor(T * a / m))} × ${n(m)} + ${n(lamp)}.`,
  guidance: [
   { prompt: `What is the order of ${n(a)} in ${Z(m)}? Use ${n(m)} ÷ gcd(${n(a)}, ${n(m)}).`, answer: [o], explanation: `gcd(${n(a)}, ${n(m)}) = ${n(g)} (${euclid(m, a)}), so the order is ${n(m)} ÷ ${n(g)} = ${n(o)} beats.` },
   { prompt: `The pulse is home on beats ${n(o)}, ${n(2 * o)}, ${n(3 * o)}, … How many of those are ${n(T)} or less?`, answer: [ret], explanation: `${n(T)} = ${n(ret)} × ${n(o)} + ${n(r)}, so ${n(ret)} whole blocks of ${n(o)} beats fit.` },
   { prompt: `What is (${n(T)} × ${n(a)}) mod ${n(m)}, the lamp after beat ${n(T)}?`, answer: [lamp], explanation: `${n(T)} × ${n(a)} = ${n(T * a)} = ${n(Math.floor(T * a / m))} × ${n(m)} + ${n(lamp)}. The same lamp comes from the ${beats(r)} left over: ${n(r)} × ${n(a)} = ${n(r * a)}, which leaves ${n(lamp)}.` }
  ] }; }
});

/* Challenge: larger numbers; the lamp after many beats is a multiplication on a clock (q02). Parent: m = 24, a = 18. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', title: 'The long relay ring', uses: 'q02',
 brief: 'The relay ring at the tower base is much bigger than the lamp rings, and the crew wants its beat and a far-off position.',
 labels: ['gcd(a, n)', 'order of a', 'lamp after the run'], tolerance: 0.01,
 gl: [['gcd(a, n)'], ['order of a'], ['lamp after the run']]
}, {
 canonical: { m: 132, a: 108, T: 611 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(60, 150), a = R.int(20, m - 1), g = gcd(a, m), o = m / g, T = R.int(300, 900);
   if (g < 3 || o < 7 || euclidLen(m, a) < 3 || T % o === 0) continue; return { m, a, T }; } return { m: 132, a: 108, T: 611 }; },
 build: ({ m, a, T }) => { const g = gcd(a, m), o = m / g, r = T % o, lamp = (T * a) % m; return {
  prompt: `The relay ring at the base of the Beacon Tower has ${n(m)} lamps, numbered 0 to ${n(m - 1)}. A pulse starts at lamp 0 and jumps ${n(a)} lamps round the ring on every beat, so after k beats it is at lamp (k × ${n(a)}) mod ${n(m)}. Enter gcd(${n(a)}, ${n(m)}), then the order of ${n(a)} in ${Z(m)}, the smallest number of beats, at least 1, that brings the pulse back to lamp 0. Then enter the lamp the pulse is on after ${n(T)} beats.`,
  answer: [g, o, lamp],
  hints: ['Euclid\'s algorithm: divide, keep the remainder, and repeat with the last two numbers until the remainder is 0. The last non-zero remainder is the gcd.', 'The order of a in Zₙ is n ÷ gcd(a, n).', 'The lamp after k beats is the remainder of k × a on division by the ring size. You may first cut k down by whole blocks of the order, which bring the pulse back to lamp 0.'],
  solution: `${euclid(m, a)}, so gcd(${n(a)}, ${n(m)}) = ${n(g)}. The order is ${n(m)} ÷ ${n(g)} = ${n(o)}. After ${n(T)} beats the pulse is on lamp (${n(T)} × ${n(a)}) mod ${n(m)}: ${n(T)} × ${n(a)} = ${n(T * a)} = ${n(Math.floor(T * a / m))} × ${n(m)} + ${n(lamp)}, so lamp ${n(lamp)}. Check with the order: ${n(T)} = ${n(Math.floor(T / o))} × ${n(o)} + ${n(r)}, and ${n(r)} × ${n(a)} = ${n(r * a)} leaves ${n(lamp)} on division by ${n(m)}.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${euclid(m, a)}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `The order is ${n(m)} ÷ gcd(${n(a)}, ${n(m)}). What is it?`, answer: [o], explanation: `${n(m)} ÷ ${n(g)} = ${n(o)} beats.` },
   { prompt: `What is (${n(T)} × ${n(a)}) mod ${n(m)}?`, answer: [lamp], explanation: `${n(T)} × ${n(a)} = ${n(T * a)} = ${n(Math.floor(T * a / m))} × ${n(m)} + ${n(lamp)}.` }
  ] }; }
});

/* ---- q08 Order of an element in U(n) [4.1] ---- */

/* Parent: m = 13, a = 5 (asks a², a³, order). Here: the order, then the power just before 1 (the inverse). */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The cargo lift code wheel',
 brief: 'A cargo lift scrambles its code wheel on every trip, and the crew needs to know how many trips bring it home.',
 labels: ['a² mod n', 'order of a', 'last power before 1'], tolerance: 0.01,
 gl: [['a² mod n'], ['order of a'], ['last power before 1']]
}, {
 canonical: { m: 17, a: 4 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(7, 31), us = unitsOf(m).filter(x => x !== 1); if (!us.length) continue; const a = R.pick(us), o = powers(a, m).length;
   if (o < 4 || o > 12 || (m === CANON.q08[0] && a === CANON.q08[1])) continue; return { m, a }; } return { m: 17, a: 4 }; },
 build: ({ m, a }) => { const pw = powers(a, m), o = pw.length, last = pw[o - 2]; return {
  prompt: `A cargo lift's code wheel holds a code from U(${n(m)}). On every trip the wheel multiplies its code by ${n(a)}, mod ${n(m)}, so after k trips the factor is ${n(a)}ᵏ mod ${n(m)}. Make the table of powers ${n(a)}¹, ${n(a)}², ${n(a)}³, … mod ${n(m)}. Enter ${n(a)}² mod ${n(m)}. Then enter the order of ${n(a)} in U(${n(m)}), the smallest k, at least 1, with ${n(a)}ᵏ mod ${n(m)} = 1. Then enter the last power in the table before the 1, the entry for k − 1 where k is that order.`,
  answer: [pw[1], o, last],
  hints: ['Each power is the one before it multiplied by the element, then reduced mod the modulus. You never need the full power.', 'Keep going until the table reaches 1. The number of the power where 1 first appears is the order.', 'The last power before the 1 is the entry just before it in the table. Multiply it by the element and you should get 1.'],
  solution: `Mod ${n(m)}: ${pw.map((v, i) => i === 0 ? `${n(a)}¹ = ${n(v)}` : `${n(a)}${sup(i + 1)} = ${n(pw[i - 1])} × ${n(a)} = ${n(pw[i - 1] * a)}, which leaves ${n(v)}`).join('; ')}. The first power to reach 1 is ${n(a)}${sup(o)}, so the order of ${n(a)} in U(${n(m)}) is ${n(o)}. The entry before it is ${n(a)}${sup(o - 1)} mod ${n(m)} = ${n(last)}. Check: ${n(last)} × ${n(a)} = ${n(last * a)} = ${n(Math.floor(last * a / m))} × ${n(m)} + 1.`,
  guidance: [
   { prompt: `What is ${n(a)}² mod ${n(m)}?`, answer: [pw[1]], explanation: `${n(a)} × ${n(a)} = ${n(a * a)}, and ${n(a * a)} = ${n(Math.floor(a * a / m))} × ${n(m)} + ${n(pw[1])}.` },
   { prompt: `Keep multiplying by ${n(a)} and reducing. At which power does the table first reach 1?`, answer: [o], explanation: `The powers mod ${n(m)} are ${list(pw)}. The last of these is ${n(a)}${sup(o)}, so the order is ${n(o)}.` },
   { prompt: `Which power in your table comes just before the 1?`, answer: [last], explanation: `The entry before the 1 is ${n(last)}. It times ${n(a)} gives ${n(last * a)}, which leaves 1 mod ${n(m)}.` }
  ] }; }
});

/* Table of powers: order, a code after B trips, the first trip that gives a target code. Parent: m = 13, a = 5. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Waiting for the target code',
 brief: 'The beacon code must hit a target value before a hatch will open, and the crew wants to know how long that takes.',
 labels: ['order of a', 'code after B beats', 'first beat at the target'], tolerance: 0.01,
 gl: [['order of a'], ['code after B beats'], ['first beat at the target']]
}, {
 canonical: { m: 19, a: 4, B: 5, j: 7 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(11, 40), us = unitsOf(m).filter(x => x !== 1); if (!us.length) continue; const a = R.pick(us), o = powers(a, m).length;
   if (o < 6 || o > 14 || (m === CANON.q08[0] && a === CANON.q08[1])) continue; const B = R.int(3, o - 1), j = R.int(2, o - 1); if (j === B) continue; return { m, a, B, j }; } return { m: 19, a: 4, B: 5, j: 7 }; },
 build: ({ m, a, B, j }) => { const pw = powers(a, m), o = pw.length, cb = pw[B - 1], t = pw[j - 1]; return {
  prompt: `A beacon on the Beacon Tower starts with the code 1. On every beat the code is multiplied by ${n(a)}, mod ${n(m)}, so after k beats it is ${n(a)}ᵏ mod ${n(m)}. The codes all lie in U(${n(m)}). Enter the order of ${n(a)} in U(${n(m)}), the smallest k, at least 1, with ${n(a)}ᵏ mod ${n(m)} = 1. Then enter the code after ${n(B)} beats. Then enter the first beat on which the code equals ${n(t)}, counting beats from 1.`,
  answer: [o, cb, j],
  hints: ['Make a table of powers. Each power is the one before it multiplied by the element, then reduced mod the modulus.', 'The code after k beats is the k-th entry of the table.', 'Before the table reaches 1 no entry repeats, so the target appears at one position only. Read off which one.'],
  solution: `Mod ${n(m)} the powers of ${n(a)} are ${list(pw)}. The first 1 is at power ${n(o)}, so the order is ${n(o)}. The code after ${n(B)} beats is entry ${n(B)}, which is ${n(cb)}. The code ${n(t)} first appears at entry ${n(j)}, so the first beat is ${n(j)}.`,
  guidance: [
   { prompt: `Make the table of powers of ${n(a)} mod ${n(m)}, multiplying by ${n(a)} and reducing each time. What is the order of ${n(a)}?`, answer: [o], explanation: `The powers are ${list(pw)}. The first 1 is the power ${n(o)}.` },
   { prompt: `What is the code after ${n(B)} beats, ${n(a)}${sup(B)} mod ${n(m)}?`, answer: [cb], explanation: `It is entry ${n(B)} of the table: ${n(cb)}.` },
   { prompt: `On which beat does the code first equal ${n(t)}?`, answer: [j], explanation: `${n(t)} is entry ${n(j)} of the table, and no earlier entry equals it.` }
  ] }; }
});

/* Challenge: bigger group, with the inverse from q06. Parent: m = 13, a = 5. */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', title: 'The long code table', uses: 'q06',
 brief: 'The vault door runs on a bigger set of codes, and the crew needs its size, how long its beat is and how to run it backwards.',
 labels: ['|U(n)|', 'order of a', 'inverse of a'], tolerance: 0.01,
 gl: [['|U(n)|'], ['order of a'], ['inverse of a']]
}, {
 canonical: { m: 35, a: 3 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(26, 48), us = unitsOf(m).filter(x => x !== 1 && x !== m - 1); if (!us.length) continue; const a = R.pick(us), o = powers(a, m).length;
   if (o < 6 || o > 18 || (m === CANON.q08[0] && a === CANON.q08[1])) continue; return { m, a }; } return { m: 35, a: 3 }; },
 build: ({ m, a }) => { const u = unitsOf(m), pw = powers(a, m), o = pw.length, inv = invOf(a, m); return {
  prompt: `The vault door multiplies its stored code by ${n(a)}, mod ${n(m)}, on every beat. The codes are the elements of U(${n(m)}), the numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)}. Enter |U(${n(m)})|, the number of codes. Then enter the order of ${n(a)} in U(${n(m)}), the smallest k, at least 1, with ${n(a)}ᵏ mod ${n(m)} = 1. Then enter the inverse of ${n(a)} in U(${n(m)}): the number b with (${n(a)} × b) mod ${n(m)} = 1.`,
  answer: [u.length, o, inv],
  hints: ['Count the numbers from 1 up to one less than the modulus whose greatest common divisor with it is 1.', 'Make a table of powers: each is the one before it times the element, reduced mod the modulus. The order is the position of the first 1.', 'The inverse times the element leaves remainder 1. In the table of powers it is the entry just before the 1.'],
  solution: `The numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(u)}, so |U(${n(m)})| = ${n(u.length)}. The powers of ${n(a)} mod ${n(m)} are ${list(pw)}. The first 1 is at power ${n(o)}, so the order is ${n(o)}. The entry before the 1 is ${n(inv)}, and ${n(a)} × ${n(inv)} = ${n(a * inv)} = ${n(Math.floor(a * inv / m))} × ${n(m)} + 1, so the inverse of ${n(a)} is ${n(inv)}.`,
  guidance: [
   { prompt: `How many of the numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}? That is |U(${n(m)})|.`, answer: [u.length], explanation: `They are ${list(u)}: ${n(u.length)} numbers.` },
   { prompt: `Make the table of powers of ${n(a)} mod ${n(m)}. At which power does it first reach 1?`, answer: [o], explanation: `The powers are ${list(pw)}. The first 1 is the power ${n(o)}.` },
   { prompt: `Which number b in U(${n(m)}) gives (${n(a)} × b) mod ${n(m)} = 1?`, answer: [inv], explanation: `${n(a)} × ${n(inv)} = ${n(a * inv)} = ${n(Math.floor(a * inv / m))} × ${n(m)} + 1. It is also the entry just before the 1 in the table.` }
  ] }; }
});

/* ---- q09 Cyclic groups and generators [4.1] ---- */

/* Parent: m = 18, a = 10 (asks the number of generators, then 1 or 0). Here: the number of generators and |<a>|. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The hatch dial generators',
 brief: 'A rotating hatch dial must be driven by a key that reaches every notch, and the crew needs to know how many keys do that.',
 labels: ['number of generators', 'notches reached'], tolerance: 0.01,
 gl: [['gcd'], ['notches reached'], ['number of generators']]
}, {
 canonical: { m: 15, a: 6 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(8, 40), a = R.int(2, m - 1); if (isPrime(m) || (m === CANON.q09[0] && a === CANON.q09[1])) continue; return { m, a }; } return { m: 15, a: 6 }; },
 build: ({ m, a }) => { const g = gcd(a, m), o = m / g, gens = unitsOf(m); return {
  prompt: `A hatch dial in Hatch Hall has ${n(m)} notches, numbered 0 to ${n(m - 1)}, and works like ${Z(m)}. A key that turns the dial ${n(a)} notches per press reaches the notches of ⟨${n(a)}⟩, the notches ${n(a)} × k mod ${n(m)} for k = 1, 2, 3, … A number g is a generator of ${Z(m)} when ⟨g⟩ reaches every notch. Enter how many generators ${Z(m)} has. Then enter how many different notches the key ${n(a)} reaches, which is the number of elements of ⟨${n(a)}⟩.`,
  answer: [gens.length, o],
  hints: ['A number g is a generator exactly when its order, the ring size divided by gcd(g, ring size), is the whole ring size. That is when the gcd is 1.', 'The number of notches ⟨a⟩ reaches is the order of a, the ring size divided by gcd(a, ring size).'],
  solution: `g generates ${Z(m)} exactly when gcd(g, ${n(m)}) = 1. The numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(gens)}, so ${Z(m)} has ${n(gens.length)} generators. For the key ${n(a)}: gcd(${n(a)}, ${n(m)}) = ${n(g)} (${euclid(m, a)}), so its order is ${n(m)} ÷ ${n(g)} = ${n(o)}, and ⟨${n(a)}⟩ reaches ${n(o)} different notches.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${euclid(m, a)}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `How many notches does ⟨${n(a)}⟩ reach? That is the order of ${n(a)}, ${n(m)} ÷ gcd(${n(a)}, ${n(m)}).`, answer: [o], explanation: `${n(m)} ÷ ${n(g)} = ${n(o)}.` },
   { prompt: `How many numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}?`, answer: [gens.length], explanation: `They are ${list(gens)}: ${n(gens.length)} generators.` }
  ] }; }
});

/* Parent: m = 18, a = 10. Four spare keys, some of which are generators. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'Choosing the spare pulse units',
 brief: 'Four spare pulse units are in the store, and only a unit that lights every lamp can drive the ring.',
 labels: ['number of generators', 'usable units', 'fewest lamps lit'], tolerance: 0.01,
 gl: [['number of generators'], ['usable units'], ['fewest lamps lit']]
}, {
 canonical: { m: 20, js: [6, 7, 15, 9] },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(12, 36); if (isPrime(m) || (m === CANON.q09[0])) continue; const js = [];
   let guard = 0; while (js.length < 4 && guard++ < 200) { const j = R.int(2, m - 1); if (!js.includes(j)) js.push(j); }
   const k = js.filter(j => gcd(j, m) === 1).length; if (js.length === 4 && k >= 1 && k <= 3) return { m, js }; } return { m: 20, js: [6, 7, 15, 9] }; },
 build: ({ m, js }) => { const gens = unitsOf(m), ok = js.filter(j => gcd(j, m) === 1), orders = js.map(j => m / gcd(j, m)), least = Math.min(...orders); return {
  prompt: `The Beacon Tower's ring of ${n(m)} lamps, 0 to ${n(m - 1)}, works like ${Z(m)}. A pulse unit with jump g lamps per beat lights the lamps of ⟨g⟩, and it can drive the ring only if g is a generator of ${Z(m)}, that is if it lights every lamp. The store has four spare units, with jumps ${list(js)}. Enter how many generators ${Z(m)} has in all. Then enter how many of the four spare units can drive the ring. Then enter how many lamps the weakest unit lights, the one that lights the fewest lamps.`,
  answer: [gens.length, ok.length, least],
  hints: ['A jump g is a generator exactly when gcd(g, ring size) is one. Count those from one up to one less than the ring size.', 'Find the gcd of each spare jump with the ring size and keep the jumps whose gcd is one.', 'The number of lamps lit by a jump is its order, the ring size divided by its gcd with the ring size. Compare the four.'],
  solution: `The numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(gens)}, so ${Z(m)} has ${n(gens.length)} generators. The gcds of the spare jumps with ${n(m)} are ${js.map(j => `gcd(${n(j)}, ${n(m)}) = ${n(gcd(j, m))}`).join(', ')}, so the units that drive the ring are those with gcd 1: ${ok.length ? list(ok) : 'none'}, which is ${n(ok.length)} of the four. The lamps lit are ${js.map((j, i) => `${n(m)} ÷ ${n(gcd(j, m))} = ${n(orders[i])}`).join(', ')}, so the weakest unit lights ${n(least)} lamps.`,
  guidance: [
   { prompt: `How many numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}?`, answer: [gens.length], explanation: `They are ${list(gens)}: ${n(gens.length)} generators.` },
   { prompt: `Find gcd(j, ${n(m)}) for each spare jump j in ${list(js)}. How many of the four jumps have gcd 1?`, answer: [ok.length], explanation: `${js.map(j => `gcd(${n(j)}, ${n(m)}) = ${n(gcd(j, m))}`).join(', ')}. Those with gcd 1 are generators.` },
   { prompt: `Each jump lights ${n(m)} ÷ gcd lamps. What is the smallest number of lamps lit by one of the four units?`, answer: [least], explanation: `${js.map((j, i) => `${n(m)} ÷ ${n(gcd(j, m))} = ${n(orders[i])}`).join(', ')}. The smallest is ${n(least)}.` }
  ] }; }
});

/* Challenge: bigger ring, with the inverse in U(n) from q06. Parent: m = 18, a = 10. */
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', title: 'Generators and their undo keys', uses: 'q06',
 brief: 'The tower\'s coded ring is much larger, and the crew wants its generators, the undo number for one of them and the reach of a weaker unit.',
 labels: ['number of generators', 'inverse of g', 'lamps lit by h'], tolerance: 0.01,
 gl: [['number of generators'], ['inverse of g'], ['lamps lit by h']]
}, {
 canonical: { m: 42, g: 5, h: 18 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(30, 60); if (isPrime(m)) continue; const us = unitsOf(m).filter(x => x !== 1 && x !== m - 1), g = R.pick(us), h = R.int(4, m - 1), e = gcd(h, m);
   if (e < 2 || m === CANON.q09[0]) continue; return { m, g, h }; } return { m: 42, g: 5, h: 18 }; },
 build: ({ m, g, h }) => { const gens = unitsOf(m), inv = invOf(g, m), e = gcd(h, m), o = m / e; return {
  prompt: `The Beacon Tower's coded ring has ${n(m)} lamps, 0 to ${n(m - 1)}, and works like ${Z(m)}. A jump g is a generator of ${Z(m)} when ⟨g⟩ lights every lamp. The crew's main unit has jump ${n(g)}, which has no factor above 1 in common with ${n(m)}, so it lies in U(${n(m)}). A spare unit has jump ${n(h)}. Enter how many generators ${Z(m)} has. Then enter the inverse of ${n(g)} in U(${n(m)}): the number b with (${n(g)} × b) mod ${n(m)} = 1. Then enter how many lamps the spare unit ${n(h)} lights.`,
  answer: [gens.length, inv, o],
  hints: ['A jump is a generator exactly when its gcd with the ring size is 1. Count those from 1 up to one less than the ring size.', 'The inverse is the number that, multiplied by the given jump, leaves remainder 1 on division by the ring size.', 'The number of lamps lit by a jump is its order, the ring size divided by its gcd with the ring size.'],
  solution: `The numbers from 1 to ${n(m - 1)} with gcd 1 with ${n(m)} are ${list(gens)}, so ${Z(m)} has ${n(gens.length)} generators. ${n(g)} × ${n(inv)} = ${n(g * inv)} = ${n(Math.floor(g * inv / m))} × ${n(m)} + 1, so the inverse of ${n(g)} is ${n(inv)}. For the spare unit: gcd(${n(h)}, ${n(m)}) = ${n(e)} (${euclid(m, h)}), so it lights ${n(m)} ÷ ${n(e)} = ${n(o)} lamps.`,
  guidance: [
   { prompt: `How many numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}? That is the number of generators.`, answer: [gens.length], explanation: `They are ${list(gens)}: ${n(gens.length)} numbers.` },
   { prompt: `Which number b in U(${n(m)}) gives (${n(g)} × b) mod ${n(m)} = 1?`, answer: [inv], explanation: `${n(g)} × ${n(inv)} = ${n(g * inv)} = ${n(Math.floor(g * inv / m))} × ${n(m)} + 1. So b = ${n(inv)}.` },
   { prompt: `What is gcd(${n(h)}, ${n(m)})? The unit lights ${n(m)} divided by it lamps. How many lamps is that?`, answer: [o], explanation: `${euclid(m, h)}, so the gcd is ${n(e)} and the unit lights ${n(m)} ÷ ${n(e)} = ${n(o)} lamps.` }
  ] }; }
});

/* ---- q10 Large powers through the order [4.1, 4.3] ---- */

/* Parent: m = 11, a = 3, k = 437 (start code 1). Here: a start code c, k in the thousands. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The lift after many trips',
 brief: 'A cargo lift\'s code wheel has made thousands of trips, and the crew wants its code now without replaying them.',
 labels: ['order of a', 'k mod order', 'final code'], tolerance: 0.01,
 gl: [['order of a'], ['k mod order'], ['final code']]
}, {
 canonical: { m: 14, a: 3, c: 5, k: 2504 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(9, 30), us = unitsOf(m).filter(x => x !== 1); if (!us.length) continue; const a = R.pick(us), c = R.pick(us.concat([1])), o = powers(a, m).length, k = R.int(1100, 4900), r = k % o;
   if (o < 4 || o > 12 || r < 2 || c === 1 || (m === CANON.q10[0] && a === CANON.q10[1])) continue; return { m, a, c, k }; } return { m: 14, a: 3, c: 5, k: 2504 }; },
 build: ({ m, a, c, k }) => { const pw = powers(a, m), o = pw.length, r = k % o, f = (c * pw[r - 1]) % m, q = Math.floor(k / o); return {
  prompt: `A cargo lift's code wheel holds a code from U(${n(m)}). It starts at the code ${n(c)}. On every trip the code is multiplied by ${n(a)}, mod ${n(m)}, so after k trips it is (${n(c)} × ${n(a)}ᵏ) mod ${n(m)}. The lift makes ${n(k)} trips, and the crew will not multiply ${n(k)} times. Enter the order of ${n(a)} in U(${n(m)}), the smallest k, at least 1, with ${n(a)}ᵏ mod ${n(m)} = 1. Then enter ${n(k)} mod that order. Then enter the code after the ${n(k)} trips.`,
  answer: [o, r, f],
  hints: ['Find the order first with a table of powers: multiply by the element and reduce until you reach 1.', 'Every block of order-many factors multiplies to 1, so only the remainder of the number of trips on division by the order matters.', 'The code is the start code times the element to the power of that remainder, reduced mod the modulus.'],
  solution: `Powers of ${n(a)} mod ${n(m)}: ${list(pw)}. The first 1 is at power ${n(o)}, so the order of ${n(a)} is ${n(o)}. ${n(k)} = ${n(q)} × ${n(o)} + ${n(r)}, so ${n(a)}${sup(k)} leaves the same remainder as ${n(a)}${sup(r)}, which is ${n(pw[r - 1])}. The code is ${n(c)} × ${n(pw[r - 1])} = ${n(c * pw[r - 1])} = ${n(Math.floor(c * pw[r - 1] / m))} × ${n(m)} + ${n(f)}, so the code is ${n(f)}.`,
  guidance: [
   { prompt: `Make the table of powers of ${n(a)} mod ${n(m)}. What is the order of ${n(a)}?`, answer: [o], explanation: `The powers are ${list(pw)}. The first 1 is the power ${n(o)}.` },
   { prompt: `What is the remainder when ${n(k)} is divided by ${n(o)}?`, answer: [r], explanation: `${n(k)} = ${n(q)} × ${n(o)} + ${n(r)}. The ${n(q)} full blocks multiply to 1.` },
   { prompt: `The factor is the same as ${n(a)}${sup(r)} mod ${n(m)}. Multiply it by the start code ${n(c)} and reduce mod ${n(m)}. What is the code?`, answer: [f], explanation: `From the table, ${n(a)}${sup(r)} mod ${n(m)} = ${n(pw[r - 1])}. ${n(c)} × ${n(pw[r - 1])} = ${n(c * pw[r - 1])} = ${n(Math.floor(c * pw[r - 1] / m))} × ${n(m)} + ${n(f)}.` }
  ] }; }
});

/* Parent: m = 11, a = 3, k = 437. Here: the code after k beats, and the beats still to wait for the next 1. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The next time the code is 1',
 brief: 'A beacon code resets whenever it reads 1, and the crew needs to know the code mid-run and how long until the next reset.',
 labels: ['order of a', 'code after k beats', 'beats still to wait'], tolerance: 0.01,
 gl: [['order of a'], ['code after k beats'], ['beats still to wait']]
}, {
 canonical: { m: 22, a: 5, k: 1237 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(9, 40), us = unitsOf(m).filter(x => x !== 1); if (!us.length) continue; const a = R.pick(us), o = powers(a, m).length, k = R.int(500, 2999);
   if (o < 4 || o > 14 || k % o === 0 || (m === CANON.q10[0] && a === CANON.q10[1])) continue; return { m, a, k }; } return { m: 22, a: 5, k: 1237 }; },
 build: ({ m, a, k }) => { const pw = powers(a, m), o = pw.length, r = k % o, v = pw[r - 1], q = Math.floor(k / o), wait = o - r; return {
  prompt: `A beacon on the Beacon Tower starts with the code 1. On every beat the code is multiplied by ${n(a)}, mod ${n(m)}, so after k beats it is ${n(a)}ᵏ mod ${n(m)}. The beacon resets itself on any beat on which its code is 1 again. Enter the order of ${n(a)} in U(${n(m)}), the smallest k, at least 1, with ${n(a)}ᵏ mod ${n(m)} = 1. Then enter the code after ${n(k)} beats. Then enter how many more beats after beat ${n(k)} pass before the code is next 1.`,
  answer: [o, v, wait],
  hints: ['Find the order first with a table of powers: multiply by the element and reduce until you reach 1.', 'Only the remainder of the number of beats on division by the order matters: whole blocks of the order bring the code back to 1.', 'The code is 1 again when the beat number is a multiple of the order. Count the beats from the leftover to the next multiple.'],
  solution: `Powers of ${n(a)} mod ${n(m)}: ${list(pw)}. The first 1 is at power ${n(o)}, so the order is ${n(o)}. ${n(k)} = ${n(q)} × ${n(o)} + ${n(r)}, so the code after ${n(k)} beats is the code after ${beats(r)}, ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}. The code is next 1 on beat ${n((q + 1) * o)}, the next multiple of ${n(o)}, which is ${n(o)} − ${n(r)} = ${n(wait)} beats after beat ${n(k)}.`,
  guidance: [
   { prompt: `Make the table of powers of ${n(a)} mod ${n(m)}. What is the order of ${n(a)}?`, answer: [o], explanation: `The powers are ${list(pw)}. The first 1 is the power ${n(o)}.` },
   { prompt: `${n(k)} = ${n(q)} × ${n(o)} + ${n(r)}. So the code after ${n(k)} beats equals the code after ${beats(r)}. What is ${n(a)}${sup(r)} mod ${n(m)}?`, answer: [v], explanation: `From the table, ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}.` },
   { prompt: `The code is 1 on every beat that is a multiple of ${n(o)}. After ${beats(r)} left over in the current block, how many more beats finish the block?`, answer: [wait], explanation: `${n(o)} − ${n(r)} = ${n(wait)}. On beat ${n((q + 1) * o)} the code is 1 again.` }
  ] }; }
});

/* Challenge: a five-digit number of beats, and the inverse of the final code (q06). Parent: m = 11, a = 3, k = 437. */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', title: 'The far-off beat', uses: 'q06',
 brief: 'The master beacon has run for tens of thousands of beats, and the crew needs its code and the number that undoes it.',
 labels: ['order of a', 'aᵏ mod n', 'inverse of the code'], tolerance: 0.01,
 gl: [['order of a'], ['k mod order'], ['aᵏ mod n'], ['inverse of the code']]
}, {
 canonical: { m: 35, a: 2, k: 48219 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(21, 50), us = unitsOf(m).filter(x => x !== 1); if (!us.length) continue; const a = R.pick(us), pw = powers(a, m), o = pw.length, k = R.int(10001, 99999), r = k % o;
   if (o < 6 || o > 20 || r < 2 || pw[r - 1] === 1 || (m === CANON.q10[0] && a === CANON.q10[1])) continue; return { m, a, k }; } return { m: 35, a: 2, k: 48219 }; },
 build: ({ m, a, k }) => { const pw = powers(a, m), o = pw.length, r = k % o, v = pw[r - 1], q = Math.floor(k / o), inv = invOf(v, m); return {
  prompt: `The Beacon Tower's master beacon multiplies its code by ${n(a)}, mod ${n(m)}, on every beat. After ${n(k)} beats its factor is ${n(a)}ᵏ mod ${n(m)} with k = ${n(k)}, and the crew will then undo it with the inverse of that factor in U(${n(m)}): the number c with (factor × c) mod ${n(m)} = 1. Enter the order of ${n(a)} in U(${n(m)}). Then enter ${n(a)}ᵏ mod ${n(m)} for k = ${n(k)}. Then enter the inverse of that factor in U(${n(m)}).`,
  answer: [o, v, inv],
  hints: ['Find the order first with a table of powers: multiply by the element and reduce until you reach 1.', 'Every block of order-many factors multiplies to 1, so replace the huge exponent by its remainder on division by the order, then read the table.', 'The inverse is the number that, multiplied by the factor, leaves remainder 1 on division by the modulus.'],
  solution: `Powers of ${n(a)} mod ${n(m)}: ${list(pw)}. The first 1 is at power ${n(o)}, so the order is ${n(o)}. ${n(k)} = ${n(q)} × ${n(o)} + ${n(r)}, so ${n(a)}${sup(k)} leaves the same remainder as ${n(a)}${sup(r)}, which is ${n(v)}. For the inverse: ${n(v)} × ${n(inv)} = ${n(v * inv)} = ${n(Math.floor(v * inv / m))} × ${n(m)} + 1, so the inverse is ${n(inv)}.`,
  guidance: [
   { prompt: `Make the table of powers of ${n(a)} mod ${n(m)}. What is the order of ${n(a)}?`, answer: [o], explanation: `The powers are ${list(pw)}. The first 1 is the power ${n(o)}.` },
   { prompt: `What is the remainder when ${n(k)} is divided by ${n(o)}?`, answer: [r], explanation: `${n(k)} = ${n(q)} × ${n(o)} + ${n(r)}. The ${n(q)} full blocks multiply to 1.` },
   { prompt: `What is ${n(a)}${sup(r)} mod ${n(m)}, the same as ${n(a)}${sup(k)} mod ${n(m)}?`, answer: [v], explanation: `From the table, ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}.` },
   { prompt: `Which number c in U(${n(m)}) gives (${n(v)} × c) mod ${n(m)} = 1?`, answer: [inv], explanation: `${n(v)} × ${n(inv)} = ${n(v * inv)} = ${n(Math.floor(v * inv / m))} × ${n(m)} + 1. So c = ${n(inv)}.` }
  ] }; }
});

})();
