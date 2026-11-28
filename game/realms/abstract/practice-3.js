/* Abstract algebra: patterns of moves practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p3.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator cannot drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const mod = (a, m) => ((a % m) + m) % m;
const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sub = k => String(k).split('').map(d => SUB[+d]).join('');
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const Z = m => 'Z' + sub(m);
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
/* Every draw loop is bounded: 1000 tries, then the canonical parameters. */
const bounded = (R, canonical, make, ok) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return canonical; };
/* Permutations are lists p with p[i − 1] = where symbol i goes. */
const shuffle = (R, m) => { const p = Array.from({ length: m }, (_, i) => i + 1); for (let i = m - 1; i > 0; i--) { const j = R.int(0, i); [p[i], p[j]] = [p[j], p[i]]; } return p; };
const arrows = p => p.map((v, i) => `${i + 1} → ${v}`).join(', ');
const cyclesOf = p => { const seen = new Set(), out = []; for (let s = 1; s <= p.length; s++) { if (seen.has(s)) continue; const c = []; let x = s; while (!seen.has(x)) { seen.add(x); c.push(x); x = p[x - 1]; } out.push(c); } return out; };
const cyc = c => '(' + c.join(' ') + ')';
const cycText = cs => cs.map(cyc).join('');
const same = (p, q) => p.length === q.length && p.every((v, i) => v === q[i]);
const isId = p => p.every((v, i) => v === i + 1);
const inv = p => { const q = []; p.forEach((v, i) => { q[v - 1] = i + 1; }); return q; };
/* comp(s, t) is the list of σ ∘ τ: τ first, then σ. */
const comp = (s, t) => t.map(x => s[x - 1]);
const powers = (a, m) => { const out = []; let x = 1; for (let k = 1; k <= m; k++) { x = x * a % m; out.push(x); if (x === 1) break; } return out; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const U_MODS = [9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28];
const remText = (x, m) => x < m ? `${n(x)}, which is already less than ${n(m)}` : `${n(x)} = ${n(Math.floor(x / m))} × ${n(m)} + ${n(x % m)}`;

/* ---- q11 Chapter review: orders and inverses mixed [4.1, 3.2] ---- */

/* Order k of a in U(m) (3 to 10) and its inverse a^(k − 1). Not the worked example (3 in U(11)). */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The vault keypad code',
 brief: 'A vault keypad scrambles its stored code on every press, and Mira needs to know when it resets and which key number undoes a press.',
 labels: ['presses until reset', 'undoing key number'], tolerance: 0.01,
 gl: [['order'], ['undoing key number']]
}, {
 canonical: { m: 17, a: 4 },
 draw: R => bounded(R, { m: 17, a: 4 }, R => { const m = R.pick(U_MODS); return { m, a: R.int(2, m - 2) }; },
  p => gcd(p.a, p.m) === 1 && powers(p.a, p.m).length >= 3 && powers(p.a, p.m).length <= 10 && !(p.m === 11 && p.a === 3)),
 build: ({ m, a }) => { const pw = powers(a, m), k = pw.length, b = pw[k - 2], prod = a * b; return {
  prompt: `A vault keypad stores a code that starts at 1. Each press multiplies the code by ${n(a)} and keeps the remainder after dividing by ${n(m)}, so every code is a number of U(${n(m)}): a whole number from 1 to ${n(m - 1)} with no factor in common with ${n(m)} except 1. After some presses the keypad shows 1 again and resets. Enter how many presses that takes, which is the order of ${n(a)} in U(${n(m)}). Then enter the number b of U(${n(m)}) that undoes a press: multiplying by ${n(a)} and then by b gives back the code you started with, so ${n(a)} × b leaves remainder 1 when divided by ${n(m)}.`,
  answer: [k, b],
  hints: ['Press again and again, keeping only the remainder each time, and write the codes in a row. The number of presses to the first 1 is the order.', 'The code just before the first 1 is the one that, multiplied by the key, makes exactly 1. That is the undoing number.'],
  solution: `The codes after 1, 2, 3, … presses are ${pw.map(n).join(', ')}. The first 1 comes at press ${n(k)}, so the order of ${n(a)} in U(${n(m)}) is ${n(k)}. The code before it is ${n(b)}, and ${n(a)} × ${n(b)} = ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + 1, so b = ${n(b)}.`,
  guidance: [
   { prompt: `Press repeatedly and keep the remainder mod ${n(m)}. After how many presses does the code first show 1?`, answer: [k], explanation: `The codes are ${pw.map(n).join(', ')}, and the first 1 is press number ${n(k)}.` },
   { prompt: `The undoing number is the code one press before the first 1. What is it?`, answer: [b], explanation: `That code is ${n(b)}. Check: ${n(a)} × ${n(b)} = ${n(prod)}, which leaves remainder 1 when divided by ${n(m)}.` }
  ] }; }
});

/* Order, inverse and the dial after t beats (t reduced mod the order, remainder at least 2). */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The dial that must reset',
 brief: 'A beacon dial must be reset by hand once in a while, and the crew needs its cycle length, its undo number and where it stands after a long watch.',
 labels: ['beats per cycle', 'undoing number', 'dial after the watch'], tolerance: 0.01,
 gl: [['beats per cycle'], ['undoing number'], ['dial after the watch']]
}, {
 canonical: { m: 19, a: 7, t: 251 },
 draw: R => bounded(R, { m: 19, a: 7, t: 251 }, R => { const m = R.pick(U_MODS); return { m, a: R.int(2, m - 2), t: R.int(40, 999) }; },
  p => gcd(p.a, p.m) === 1 && powers(p.a, p.m).length >= 3 && powers(p.a, p.m).length <= 10 && p.t % powers(p.a, p.m).length >= 2),
 build: ({ m, a, t }) => { const pw = powers(a, m), k = pw.length, b = pw[k - 2], r = t % k, q = Math.floor(t / k), st = pw[r - 1]; return {
  prompt: `A beacon dial holds a number of U(${n(m)}), a whole number from 1 to ${n(m - 1)} with no factor in common with ${n(m)} except 1. It starts at 1. On every beat the dial is multiplied by ${n(a)} and only the remainder after dividing by ${n(m)} is kept. The dial must be reset by hand whenever it shows 1 again. Enter, in this order: the number of beats between resets (the order of ${n(a)} in U(${n(m)})); the number that undoes one beat, meaning ${n(a)} times it leaves remainder 1 mod ${n(m)}; and the number the dial shows after ${n(t)} beats with no reset by hand, counting from the start. Type each answer without commas.`,
  answer: [k, b, st],
  hints: ['List the powers of the multiplier mod the modulus until 1 appears. The position of the first 1 is the order, and the entry just before it is the undoing number.', 'The list repeats every order steps. Divide the number of beats by the order and keep the remainder r: the dial then shows the same as after r beats.'],
  solution: `The dial shows ${pw.map(n).join(', ')} after 1, 2, … beats, and the first 1 is at beat ${n(k)}: the order is ${n(k)}. The entry before it, ${n(b)}, is the undoing number: ${n(a)} × ${n(b)} = ${n(a * b)} = ${n(Math.floor(a * b / m))} × ${n(m)} + 1. The pattern repeats every ${n(k)} beats and ${n(t)} = ${n(q)} × ${n(k)} + ${n(r)}, so after ${n(t)} beats the dial shows what it shows after ${pl(r, 'beat')}: ${n(st)}.`,
  guidance: [
   { prompt: `Multiply by ${n(a)} again and again, keeping the remainder mod ${n(m)}. After how many beats is the dial first back at 1?`, answer: [k], explanation: `The dial shows ${pw.map(n).join(', ')}, so the first 1 is at beat ${n(k)}.` },
   { prompt: `What number does the dial show one beat before it returns to 1? That is the number that undoes a beat.`, answer: [b], explanation: `That is ${n(b)}, and ${n(a)} × ${n(b)} = ${n(a * b)} leaves remainder 1 when divided by ${n(m)}.` },
   { prompt: `The pattern repeats every ${n(k)} beats. What does the dial show after ${n(t)} beats? Divide ${n(t)} by ${n(k)} and look at the remainder.`, answer: [st], explanation: `${n(t)} = ${n(q)} × ${n(k)} + ${n(r)}, so the dial shows the same as after ${pl(r, 'beat')}: ${n(st)}.` }
  ] }; }
});

/* Challenge, uses q07: the order of a step s in Z_M (M ÷ gcd(s, M)) next to the order and inverse of a in U(n), n up to 49. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q07', title: 'Counter and keypad on one beat',
 brief: 'A tower beacon runs a counter and a keypad off the same beat, and both rhythms must be known before the tower is timed.',
 labels: ['counter order', 'keypad order', 'undoing number'], tolerance: 0.01,
 gl: [['counter order'], ['keypad order'], ['undoing number']]
}, {
 canonical: { M: 36, s: 15, n: 37, a: 6 },
 draw: R => bounded(R, { M: 36, s: 15, n: 37, a: 6 }, R => { const nn = R.int(19, 49); return { M: R.int(12, 48), s: 0, n: nn, a: R.int(2, nn - 2) }; },
  p => { p.s = R.int(2, p.M - 2); return gcd(p.s, p.M) > 1 && gcd(p.a, p.n) === 1 && powers(p.a, p.n).length >= 6 && powers(p.a, p.n).length <= 20; }),
 build: ({ M, s, n: nn, a }) => { const g = gcd(s, M), ord = M / g, pw = powers(a, nn), k = pw.length, b = pw[k - 2]; return {
  prompt: `A tower beacon has two parts driven by the same beat. A counter starts at 0; on every beat it adds ${n(s)} and keeps the remainder after dividing by ${n(M)}, so it lives in ${Z(M)}. A keypad starts at 1; on every beat it multiplies by ${n(a)} and keeps the remainder after dividing by ${n(nn)}, so its code lives in U(${n(nn)}), the whole numbers from 1 to ${n(nn - 1)} with no factor in common with ${n(nn)} except 1. Enter how many beats until the counter first shows 0 again (the order of ${n(s)} in ${Z(M)}), then how many beats until the keypad first shows 1 again (the order of ${n(a)} in U(${n(nn)})), then the number b of U(${n(nn)}) that undoes one keypad beat, so that ${n(a)} × b leaves remainder 1 when divided by ${n(nn)}.`,
  answer: [ord, k, b],
  hints: [`The counter returns to 0 when the total added is a multiple of ${n(M)}. The order of a number s in Zₙ is n ÷ gcd(s, n).`, 'For the keypad, list the powers of the multiplier mod the modulus until the first 1; the number of entries is the order, and the entry before the 1 is the undoing number.'],
  solution: `The order of ${n(s)} in ${Z(M)} is ${n(M)} ÷ gcd(${n(s)}, ${n(M)}) = ${n(M)} ÷ ${n(g)} = ${n(ord)}. The keypad codes are ${pw.map(n).join(', ')}, and the first 1 is at beat ${n(k)}, so the order of ${n(a)} in U(${n(nn)}) is ${n(k)}. The code before it, ${n(b)}, undoes a beat: ${n(a)} × ${n(b)} = ${n(a * b)} = ${n(Math.floor(a * b / nn))} × ${n(nn)} + 1.`,
  guidance: [
   { prompt: `What is gcd(${n(s)}, ${n(M)}), and so how many beats until the counter in ${Z(M)} is back at 0? Enter the number of beats, ${n(M)} divided by that gcd.`, answer: [ord], explanation: `gcd(${n(s)}, ${n(M)}) = ${n(g)}, so the counter returns to 0 after ${n(M)} ÷ ${n(g)} = ${n(ord)} beats.` },
   { prompt: `Multiply by ${n(a)} and keep the remainder mod ${n(nn)} until the code first shows 1. How many beats is that?`, answer: [k], explanation: `The codes are ${pw.map(n).join(', ')}, so the first 1 is beat ${n(k)}.` },
   { prompt: `What is the code one beat before the keypad shows 1? It is the number that undoes a beat.`, answer: [b], explanation: `It is ${n(b)}, and ${n(a)} × ${n(b)} = ${n(a * b)} leaves remainder 1 when divided by ${n(nn)}.` }
  ] }; }
});

/* ---- q12 Permutations and composition [5.1] ---- */

/* (σ ∘ τ)(i) and (τ ∘ σ)(i) for one channel; 5 to 7 channels, the two answers always differ. */
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The relay switchboard',
 brief: 'A relay switchboard has two patches that can be run in either order, and the crew must know where a call ends in each case.',
 labels: ['τ then σ', 'σ then τ'], tolerance: 0.01,
 gl: [['channel after the first patch'], ['channel after the second patch'], ['channel after σ'], ['channel after τ']]
}, {
 canonical: { s: [2, 4, 1, 5, 3], t: [3, 1, 5, 2, 4], i: 1 },
 draw: R => bounded(R, { s: [2, 4, 1, 5, 3], t: [3, 1, 5, 2, 4], i: 1 }, R => { const m = R.int(5, 7); return { s: shuffle(R, m), t: shuffle(R, m), i: R.int(1, m) }; },
  p => !isId(p.s) && !isId(p.t) && !same(p.s, p.t) && p.s[p.i - 1] !== p.i && p.t[p.i - 1] !== p.i && p.s[p.t[p.i - 1] - 1] !== p.t[p.s[p.i - 1] - 1]),
 build: ({ s, t, i }) => { const m = s.length, ti = t[i - 1], si = s[i - 1], a = s[ti - 1], b = t[si - 1]; return {
  prompt: `A relay switchboard has ${n(m)} channels numbered 1 to ${n(m)}. A patch sends every call to a channel again, one call per channel, so a patch is a permutation of the channel numbers. An arrow 2 → 5 means a call on channel 2 is sent to channel 5. Patch σ is ${arrows(s)}. Patch τ is ${arrows(t)}. A call starts on channel ${n(i)}. In σ ∘ τ the patch τ is run first and then σ; in τ ∘ σ it is the other way round. Enter the channel where the call ends after τ then σ, that is (σ ∘ τ)(${n(i)}), and then the channel where it ends after σ then τ, that is (τ ∘ σ)(${n(i)}).`,
  answer: [a, b],
  hints: ['In (σ ∘ τ)(i) the patch written on the right goes first. Look i up in that patch, then look the result up in the other.', 'For (τ ∘ σ)(i) swap the roles: look i up in σ first, then look that channel up in τ. The two orders usually end on different channels.'],
  solution: `τ then σ: τ(${n(i)}) = ${n(ti)} and σ(${n(ti)}) = ${n(a)}, so (σ ∘ τ)(${n(i)}) = ${n(a)}. σ then τ: σ(${n(i)}) = ${n(si)} and τ(${n(si)}) = ${n(b)}, so (τ ∘ σ)(${n(i)}) = ${n(b)}. The answers differ, so the order of patches matters.`,
  guidance: [
   { prompt: `Run τ first. Where does τ send the call on channel ${n(i)}?`, answer: [ti], explanation: `τ’s list has ${n(i)} → ${n(ti)}.` },
   { prompt: `Now σ moves that call. What is σ(${n(ti)}), the end of τ then σ?`, answer: [a], explanation: `σ’s list has ${n(ti)} → ${n(a)}, so (σ ∘ τ)(${n(i)}) = ${n(a)}.` },
   { prompt: `Now the other order. Where does σ send the call on channel ${n(i)}?`, answer: [si], explanation: `σ’s list has ${n(i)} → ${n(si)}.` },
   { prompt: `Then τ moves it. What is τ(${n(si)}), the end of σ then τ?`, answer: [b], explanation: `τ’s list has ${n(si)} → ${n(b)}, so (τ ∘ σ)(${n(i)}) = ${n(b)}.` }
  ] }; }
});

/* A crate through three gates α, β, γ (the move γ ∘ β ∘ α); 6 or 7 slots, two crates. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Three sorting gates',
 brief: 'Crates pass three sorting gates on the way to the hatch, and the crew must know which slot each lands in.',
 labels: ['slot of the first crate', 'slot of the second crate'], tolerance: 0.01,
 gl: [['slot after gate 1'], ['slot after gate 2'], ['slot after gate 3']]
}, {
 canonical: { a: [3, 1, 5, 6, 2, 4], b: [4, 3, 6, 1, 5, 2], c: [2, 5, 1, 3, 6, 4], i: 1, j: 4 },
 draw: R => bounded(R, { a: [3, 1, 5, 6, 2, 4], b: [4, 3, 6, 1, 5, 2], c: [2, 5, 1, 3, 6, 4], i: 1, j: 4 }, R => { const m = R.int(6, 7), i = R.int(1, m); return { a: shuffle(R, m), b: shuffle(R, m), c: shuffle(R, m), i, j: R.except(1, m, [i]) }; },
  p => [p.a, p.b, p.c].every(x => !isId(x)) && [p.i, p.j].every(x => p.a[x - 1] !== x && p.b[p.a[x - 1] - 1] !== p.a[x - 1] && p.c[p.b[p.a[x - 1] - 1] - 1] !== x)),
 build: ({ a, b, c, i, j }) => { const m = a.length, a1 = a[i - 1], b1 = b[a1 - 1], c1 = c[b1 - 1], a2 = a[j - 1], b2 = b[a2 - 1], c2 = c[b2 - 1]; return {
  prompt: `Crates ride a belt with ${n(m)} slots numbered 1 to ${n(m)} and pass three sorting gates, one after the other. Each gate moves every crate to a slot again, one crate per slot, so each gate is a permutation of the slot numbers. An arrow 2 → 5 means the crate in slot 2 is moved to slot 5. Gate 1 is ${arrows(a)}. Gate 2 is ${arrows(b)}. Gate 3 is ${arrows(c)}. The whole trip is the composition of the three gates, gate 3 ∘ gate 2 ∘ gate 1, which runs gate 1 first. Enter the slot where the crate that starts in slot ${n(i)} ends, then the slot where the crate that starts in slot ${n(j)} ends.`,
  answer: [c1, c2],
  hints: ['In a composition the gate written on the right is run first. Follow one crate gate by gate: look its slot up in gate 1’s list, then that new slot in gate 2’s list, then in gate 3’s.', 'Do the same for the second crate. Each look-up uses only the slot the crate is in at that moment.'],
  solution: `The crate from slot ${n(i)}: gate 1 sends it to ${n(a1)}, gate 2 to ${n(b1)} and gate 3 to ${n(c1)}. The crate from slot ${n(j)}: gate 1 sends it to ${n(a2)}, gate 2 to ${n(b2)} and gate 3 to ${n(c2)}. So the crates end in slots ${n(c1)} and ${n(c2)}.`,
  guidance: [
   { prompt: `Follow the crate from slot ${n(i)}. Where does gate 1 send it?`, answer: [a1], explanation: `Gate 1’s list has ${n(i)} → ${n(a1)}.` },
   { prompt: `Gate 2 acts on the crate in slot ${n(a1)}. Where does it go?`, answer: [b1], explanation: `Gate 2’s list has ${n(a1)} → ${n(b1)}.` },
   { prompt: `Gate 3 acts on the crate in slot ${n(b1)}. Where does it end?`, answer: [c1], explanation: `Gate 3’s list has ${n(b1)} → ${n(c1)}. The other crate is followed the same way.` }
  ] }; }
});

/* Challenge, uses q04: τ⁻¹ sends each socket back to where its bolt came from. Answers (σ ∘ τ⁻¹)(i) and (τ⁻¹ ∘ σ)(j). */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q04', title: 'Undoing a bolt move',
 brief: 'A hatch repair needs one bolt move undone before another is run, and the crew must know where two bolts end.',
 labels: ['(σ ∘ τ⁻¹)(first socket)', '(τ⁻¹ ∘ σ)(second socket)'], tolerance: 0.01,
 gl: [['socket after τ⁻¹'], ['socket after σ'], ['end socket of σ ∘ τ⁻¹'], ['socket after σ'], ['end socket of τ⁻¹ ∘ σ']]
}, {
 canonical: { s: [4, 6, 1, 7, 2, 3, 5], t: [3, 5, 7, 1, 6, 2, 4], i: 2, j: 3 },
 draw: R => bounded(R, { s: [4, 6, 1, 7, 2, 3, 5], t: [3, 5, 7, 1, 6, 2, 4], i: 2, j: 3 }, R => { const m = R.int(6, 8), i = R.int(1, m); return { s: shuffle(R, m), t: shuffle(R, m), i, j: R.except(1, m, [i]) }; },
  p => { const u = inv(p.t), sj = p.s[p.j - 1]; return !isId(p.s) && !isId(p.t) && u[p.i - 1] !== p.i && p.t[p.i - 1] !== u[p.i - 1] && sj !== p.j && u[sj - 1] !== p.t[sj - 1]; }),
 build: ({ s, t, i, j }) => { const m = s.length, u = inv(t), ui = u[i - 1], r1 = s[ui - 1], sj = s[j - 1], r2 = u[sj - 1]; return {
  prompt: `A hatch has ${n(m)} bolt sockets numbered 1 to ${n(m)}. Move σ is ${arrows(s)}. Move τ is ${arrows(t)}. An arrow 2 → 5 means the bolt in socket 2 drops into socket 5. The move τ⁻¹ undoes τ: if τ sends the bolt in socket 2 to socket 5, then τ⁻¹ sends the bolt in socket 5 back to socket 2. In σ ∘ τ⁻¹ the move τ⁻¹ is run first and then σ; in τ⁻¹ ∘ σ the move σ is run first and then τ⁻¹. Enter (σ ∘ τ⁻¹)(${n(i)}), then (τ⁻¹ ∘ σ)(${n(j)}).`,
  answer: [r1, r2],
  hints: ['To find τ⁻¹(x), look in τ’s list for the arrow that ends at x; the socket it starts from is τ⁻¹(x).', 'Then compose as usual: the move written on the right is run first, and its result is looked up in the other move.'],
  solution: `τ sends ${n(ui)} to ${n(i)}, so τ⁻¹(${n(i)}) = ${n(ui)}. Then σ(${n(ui)}) = ${n(r1)}, so (σ ∘ τ⁻¹)(${n(i)}) = ${n(r1)}. For the second, σ(${n(j)}) = ${n(sj)}. τ sends ${n(r2)} to ${n(sj)}, so τ⁻¹(${n(sj)}) = ${n(r2)}, and (τ⁻¹ ∘ σ)(${n(j)}) = ${n(r2)}.`,
  guidance: [
   { prompt: `Find τ⁻¹(${n(i)}): which socket does τ send to socket ${n(i)}?`, answer: [ui], explanation: `τ’s list has ${n(ui)} → ${n(i)}, so τ⁻¹(${n(i)}) = ${n(ui)}.` },
   { prompt: `Now σ acts on socket ${n(ui)}. What is σ(${n(ui)}), the end of σ ∘ τ⁻¹ for socket ${n(i)}?`, answer: [r1], explanation: `σ’s list has ${n(ui)} → ${n(r1)}, so (σ ∘ τ⁻¹)(${n(i)}) = ${n(r1)}.` },
   { prompt: `For the second answer σ goes first. What is σ(${n(j)})?`, answer: [sj], explanation: `σ’s list has ${n(j)} → ${n(sj)}.` },
   { prompt: `Then τ⁻¹ acts on socket ${n(sj)}. Which socket does τ send to ${n(sj)}? That is (τ⁻¹ ∘ σ)(${n(j)}).`, answer: [r2], explanation: `τ’s list has ${n(r2)} → ${n(sj)}, so τ⁻¹(${n(sj)}) = ${n(r2)}.` }
  ] }; }
});

/* ---- q13 Cycle notation and the order of a permutation [5.1] ---- */

/* Cycles (fixed points counted) and order; 7 to 9 shelves with at least two cycles longer than 1. */
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The storeroom shifts',
 brief: 'The storeroom crew shuffles every crate to a new shelf at the end of each shift, and they want to know when the shelves are back as they began.',
 labels: ['cycles', 'shifts until back'], tolerance: 0.01,
 gl: [['loop length from shelf 1'], ['cycles'], ['shifts until back']]
}, {
 canonical: { p: [3, 5, 1, 7, 2, 4, 6, 8] },
 draw: R => bounded(R, { p: [3, 5, 1, 7, 2, 4, 6, 8] }, R => ({ p: shuffle(R, R.int(7, 9)) }), q => cyclesOf(q.p).filter(c => c.length > 1).length >= 2),
 build: ({ p }) => { const m = p.length, cs = cyclesOf(p), lens = cs.map(c => c.length), ord = lens.reduce(lcm, 1), c1 = cs[0], trace = [...c1, c1[0]].join(' → '); return {
  prompt: `A storeroom has ${n(m)} shelves numbered 1 to ${n(m)}, each holding one crate. At the end of every shift the crew moves each crate to another shelf, or leaves it, one crate per shelf. An arrow 2 → 5 means the crate on shelf 2 goes to shelf 5. This shift’s move is ${arrows(p)}. A cycle is the loop of shelves one crate visits before it is back where it began; a crate that never moves is a cycle of length 1, and it counts. Enter the number of cycles, then the smallest number of shifts, repeating the same move each time, after which every crate is back on its own shelf.`,
  answer: [cs.length, ord],
  hints: ['Pick a shelf and follow the arrows until you return to it: that loop is one cycle. Then pick the lowest shelf not yet in a loop, and repeat.', 'A loop of length L has its crates home after L, 2L, 3L, … shifts. All the crates are home together first after the lcm of the loop lengths.'],
  solution: `Following the arrows gives ${cycText(cs)}: ${pl(cs.length, 'cycle')}, of lengths ${and(lens.map(n))}. A loop of length L is home after every multiple of L, so all crates are home at once first after lcm(${lens.map(n).join(', ')}) = ${n(ord)} shifts.`,
  guidance: [
   { prompt: 'Start at shelf 1 and follow the arrows until you are back at shelf 1. How many shelves are in that loop?', answer: [c1.length], explanation: c1.length === 1 ? 'The crate on shelf 1 never moves, so its loop has length 1.' : `${trace}, so the loop ${cyc(c1)} has ${n(c1.length)} shelves.` },
   { prompt: 'Keep going from the lowest shelf not yet used until every shelf is in a loop. How many cycles are there, with fixed shelves counted?', answer: [cs.length], explanation: `The move is ${cycText(cs)}, which has ${pl(cs.length, 'cycle')}.` },
   { prompt: `The loop lengths are ${and(lens.map(n))}. What is their lcm, the number of shifts until every crate is home?`, answer: [ord], explanation: `${n(ord)} is the smallest number that every loop length divides exactly.` }
  ] }; }
});

/* Loop length of one crate, order of the move, and the shelf of that crate after t shifts. t mod L is never 0. */
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The night shift crate',
 brief: 'Mira must find one crate after a long run of night shifts without moving a single box.',
 labels: ['shelves in its loop', 'shifts until all home', 'shelf after the shifts'], tolerance: 0.01,
 gl: [['shelves in its loop'], ['shifts until all home'], ['shelf after the shifts']]
}, {
 canonical: { p: [4, 6, 1, 7, 8, 2, 5, 3], i: 1, t: 100 },
 draw: R => bounded(R, { p: [4, 6, 1, 7, 8, 2, 5, 3], i: 1, t: 100 }, R => { const m = R.int(7, 9); return { p: shuffle(R, m), i: R.int(1, m), t: R.int(30, 200) }; },
  q => { const cs = cyclesOf(q.p), L = cs.find(c => c.includes(q.i)).length; return cs.filter(c => c.length > 1).length >= 2 && L > 1 && q.t % L !== 0; }),
 build: ({ p, i, t }) => { const m = p.length, cs = cyclesOf(p), lens = cs.map(c => c.length), ord = lens.reduce(lcm, 1), c = cs.find(x => x.includes(i)), L = c.length, r = t % L, q = Math.floor(t / L), pos = c[(c.indexOf(i) + r) % L]; return {
  prompt: `A storeroom has ${n(m)} shelves numbered 1 to ${n(m)}, each holding one crate. At the end of every night shift the crew moves each crate to another shelf, or leaves it, one crate per shelf. An arrow 2 → 5 means the crate on shelf 2 goes to shelf 5. The same move is made every night: ${arrows(p)}. Write the move in cycle notation, counting each crate that never moves as a cycle of length 1. Enter the number of shelves in the cycle that contains shelf ${n(i)}, then the smallest number of nights after which every crate is back on its own shelf, then the shelf where the crate that started on shelf ${n(i)} sits after ${n(t)} nights. Type each answer without commas.`,
  answer: [L, ord, pos],
  hints: ['Follow the arrows from the shelf until you return to it. The crate is back on its start shelf after every multiple of the loop length.', 'To find where a crate is after many nights, divide the number of nights by its loop length and keep only the remainder: the crate has made that many steps round the loop from where it started. The order of the move is the lcm of all the loop lengths.'],
  solution: `The move is ${cycText(cs)}. The cycle with shelf ${n(i)} is ${cyc(c)}, so it has ${n(L)} shelves. The loop lengths are ${and(lens.map(n))}, and their lcm is ${n(ord)}. After ${n(t)} nights the crate has gone round its ${n(L)}-shelf loop ${n(q)} full times and ${pl(r, 'step')} more, since ${n(t)} = ${n(q)} × ${n(L)} + ${n(r)}. Taking ${pl(r, 'step')} along ${cyc(c)} from shelf ${n(i)} gives shelf ${n(pos)}.`,
  guidance: [
   { prompt: `Follow the arrows from shelf ${n(i)} until you are back at it. How many shelves are in that loop?`, answer: [L], explanation: `${[...c, c[0]].join(' → ')}, so the loop ${cyc(c)} has ${n(L)} shelves.` },
   { prompt: `Write every loop of the move and note its length. What is the lcm of the lengths, the number of nights until every crate is home?`, answer: [ord], explanation: `The loops are ${cycText(cs)}, of lengths ${and(lens.map(n))}, and their lcm is ${n(ord)}.` },
   { prompt: `Divide ${n(t)} by the loop length ${n(L)} and keep the remainder. Moving that many steps along the loop from shelf ${n(i)}, which shelf does the crate reach?`, answer: [pos], explanation: `${n(t)} = ${n(q)} × ${n(L)} + ${n(r)}, so the crate takes ${pl(r, 'step')} along ${cyc(c)} from shelf ${n(i)} and reaches shelf ${n(pos)}.` }
  ] }; }
});

/* Challenge, uses q07: two rings, x → x + s (mod m). Each ring splits into gcd(s, m) cycles of length m ÷ gcd(s, m). */
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q07', title: 'The twin bolt rings',
 brief: 'A hatch has two bolt rings that turn together, and the crew must know after how many turns every bolt is back in place.',
 labels: ['cycle length on ring A', 'cycle length on ring B', 'cycles in the whole move', 'turns until all home'], tolerance: 0.01,
 gl: [['cycle length on ring A'], ['cycle length on ring B'], ['cycles in the whole move'], ['turns until all home']]
}, {
 canonical: { ma: 12, sa: 8, mb: 20, sb: 8 },
 draw: R => bounded(R, { ma: 12, sa: 8, mb: 20, sb: 8 }, R => ({ ma: R.int(8, 30), sa: R.int(2, 28), mb: R.int(8, 30), sb: R.int(2, 28) }),
  p => p.sa < p.ma && p.sb < p.mb && gcd(p.sa, p.ma) > 1 && gcd(p.sb, p.mb) > 1 && p.ma / gcd(p.sa, p.ma) > 1 && p.mb / gcd(p.sb, p.mb) > 1 && p.ma / gcd(p.sa, p.ma) !== p.mb / gcd(p.sb, p.mb)),
 build: ({ ma, sa, mb, sb }) => { const ga = gcd(sa, ma), gb = gcd(sb, mb), la = ma / ga, lb = mb / gb, tot = ga + gb, ord = lcm(la, lb); return {
  prompt: `A hatch has two separate rings of bolt sockets. Ring A has ${n(ma)} sockets numbered 0 to ${n(ma - 1)}, and ring B has ${n(mb)} sockets numbered 0 to ${n(mb - 1)}. One turn of the hatch drops the bolt in socket x of ring A into socket (x + ${n(sa)}) mod ${n(ma)}, and the bolt in socket y of ring B into socket (y + ${n(sb)}) mod ${n(mb)}. No bolt ever leaves its ring. Think of the whole turn as one permutation of all the sockets, written in cycle notation with fixed sockets counted as cycles of length 1. Enter the length of the cycle through socket 0 of ring A, then the length of the cycle through socket 0 of ring B, then the number of cycles in the whole move, then the smallest number of turns that puts every bolt back in its own socket.`,
  answer: [la, lb, tot, ord],
  hints: ['The cycle through socket 0 is 0, s, 2s, … and comes back to 0 after as many steps as the order of s in Zₘ, which is m ÷ gcd(s, m). Every cycle of that ring has the same length.', 'The cycles of a ring fill all its sockets, so their number is the ring size divided by the cycle length. For the whole move, every cycle must be home at once: take the lcm of the cycle lengths.'],
  solution: `On ring A the cycle through 0 is 0, ${n(sa)}, ${n(2 * sa % ma)}, … and returns after ${n(ma)} ÷ gcd(${n(sa)}, ${n(ma)}) = ${n(ma)} ÷ ${n(ga)} = ${n(la)} steps, so every cycle of ring A has length ${n(la)}. On ring B it is ${n(mb)} ÷ gcd(${n(sb)}, ${n(mb)}) = ${n(mb)} ÷ ${n(gb)} = ${n(lb)}. Ring A splits into ${n(ma)} ÷ ${n(la)} = ${n(ga)} cycles and ring B into ${n(mb)} ÷ ${n(lb)} = ${n(gb)}, ${n(tot)} in all. Every bolt is home when the turns are a multiple of both ${n(la)} and ${n(lb)}: lcm(${n(la)}, ${n(lb)}) = ${n(ord)}.`,
  guidance: [
   { prompt: `On ring A the step is ${n(sa)} in ${Z(ma)}. How long is the cycle through socket 0, the order of ${n(sa)} in ${Z(ma)}?`, answer: [la], explanation: `${n(ma)} ÷ gcd(${n(sa)}, ${n(ma)}) = ${n(ma)} ÷ ${n(ga)} = ${n(la)}.` },
   { prompt: `On ring B the step is ${n(sb)} in ${Z(mb)}. How long is the cycle through socket 0?`, answer: [lb], explanation: `${n(mb)} ÷ gcd(${n(sb)}, ${n(mb)}) = ${n(mb)} ÷ ${n(gb)} = ${n(lb)}.` },
   { prompt: `Ring A has ${n(ma)} sockets in cycles of length ${n(la)}, and ring B has ${n(mb)} sockets in cycles of length ${n(lb)}. How many cycles are there in the whole move?`, answer: [tot], explanation: `${n(ma)} ÷ ${n(la)} = ${n(ga)} cycles on ring A and ${n(mb)} ÷ ${n(lb)} = ${n(gb)} on ring B, so ${n(tot)}.` },
   { prompt: `The cycle lengths are ${n(la)} and ${n(lb)}. What is their lcm, the number of turns until every bolt is home?`, answer: [ord], explanation: `The smallest number that both ${n(la)} and ${n(lb)} divide exactly is ${n(ord)}.` }
  ] }; }
});

/* ---- q14 Transpositions, even and odd [5.1] ---- */

/* Fewest swaps (sockets minus cycles) and the sign; 7 to 9 slots, never the identity. Not the worked example. */
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The sample tray swaps',
 brief: 'A lab robot can only swap two sample trays at a time, and the crew wants the fewest swaps and the kind of reshuffle each rack needs.',
 labels: ['fewest swaps', 'sign'], tolerance: 0.01,
 gl: [['cycles'], ['fewest swaps'], ['sign']]
}, {
 canonical: { p: [2, 4, 1, 3, 6, 7, 5] },
 draw: R => bounded(R, { p: [2, 4, 1, 3, 6, 7, 5] }, R => ({ p: shuffle(R, R.int(7, 9)) }), q => !isId(q.p)),
 build: ({ p }) => { const m = p.length, cs = cyclesOf(p), c = cs.length, T = m - c, sign = T % 2 ? -1 : 1, word = T % 2 ? 'odd' : 'even'; return {
  prompt: `A lab rack has ${n(m)} slots numbered 1 to ${n(m)}, each holding one sample tray. The robot arm can only swap the trays in two slots at a time, which is a transposition. A reshuffle is the permutation ${arrows(p)}, where 2 → 5 means the tray in slot 2 ends in slot 5. Write the reshuffle in cycle notation, with trays that stay put as cycles of length 1. Using one swap fewer than the length for each cycle, enter the number of swaps the reshuffle takes, then its sign: 1 if the reshuffle is an even permutation, −1 if it is odd.`,
  answer: [T, sign],
  hints: ['A cycle of L slots takes L − 1 swaps, and a tray that stays put takes none. So the total is the number of slots minus the number of cycles.', 'An even count of swaps makes an even permutation (sign 1); an odd count makes an odd permutation (sign −1).'],
  solution: `The reshuffle is ${cycText(cs)}, which has ${pl(c, 'cycle')} on ${n(m)} slots. It takes ${cs.map(x => n(x.length - 1)).join(' + ')} = ${n(T)} swaps, which is ${n(m)} − ${n(c)}. ${n(T)} is ${word}, so the reshuffle is ${word} and its sign is ${n(sign)}.`,
  guidance: [
   { prompt: 'Write the reshuffle in cycle notation. How many cycles are there, with stay-put trays counted?', answer: [c], explanation: `The reshuffle is ${cycText(cs)}, which has ${pl(c, 'cycle')}.` },
   { prompt: `There are ${n(m)} slots and ${pl(c, 'cycle')}. How many swaps does the reshuffle take?`, answer: [T], explanation: `${n(m)} − ${n(c)} = ${n(T)}, the same as adding L − 1 over the cycles.` },
   { prompt: `${n(T)} swaps: is the reshuffle even or odd? Enter the sign, 1 for even or −1 for odd.`, answer: [sign], explanation: `${n(T)} is ${word}, so the sign is ${n(sign)}.` }
  ] }; }
});

/* Cycles, swaps and minutes (swaps × minutes per swap); 7 to 9 slots. */
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'The swap robot shift',
 brief: 'The tray robot is booked by the minute, and the lab wants to know how long one reshuffle of the rack will take.',
 labels: ['cycles', 'swaps', 'minutes'], tolerance: 0.01,
 gl: [['cycles'], ['swaps'], ['minutes']]
}, {
 canonical: { p: [3, 1, 2, 6, 4, 5, 8, 7], w: 4 },
 draw: R => bounded(R, { p: [3, 1, 2, 6, 4, 5, 8, 7], w: 4 }, R => ({ p: shuffle(R, R.int(7, 9)), w: R.int(2, 9) }), q => !isId(q.p) && cyclesOf(q.p).length <= q.p.length - 3),
 build: ({ p, w }) => { const m = p.length, cs = cyclesOf(p), c = cs.length, T = m - c, tot = T * w; return {
  prompt: `A lab rack has ${n(m)} slots numbered 1 to ${n(m)}, each holding one sample tray. The robot can only swap the trays in two slots at a time, and each swap takes it ${pl(w, 'minute')}. Tonight’s reshuffle is the permutation ${arrows(p)}, where 2 → 5 means the tray in slot 2 must end in slot 5. Write the reshuffle in cycle notation, with trays that stay put as cycles of length 1. A cycle of length L takes L − 1 swaps. Enter the number of cycles, the number of swaps the reshuffle takes, and the total minutes the robot needs. Type each answer without commas.`,
  answer: [c, T, tot],
  hints: ['Follow each tray’s arrows until the loop closes: each closed loop is one cycle. Count the stay-put trays as cycles too.', 'The swaps are the number of slots minus the number of cycles. The time is the number of swaps times the minutes each takes.'],
  solution: `The reshuffle is ${cycText(cs)}: ${pl(c, 'cycle')} on ${n(m)} slots. It takes ${cs.map(x => n(x.length - 1)).join(' + ')} = ${n(T)} swaps, which is ${n(m)} − ${n(c)}. At ${pl(w, 'minute')} each, the robot needs ${n(T)} × ${n(w)} = ${n(tot)} minutes.`,
  guidance: [
   { prompt: 'Follow the arrows to write the reshuffle in cycles, stay-put trays included. How many cycles are there?', answer: [c], explanation: `The reshuffle is ${cycText(cs)}, which has ${pl(c, 'cycle')}.` },
   { prompt: `With ${n(m)} slots and ${pl(c, 'cycle')}, how many swaps does the reshuffle take?`, answer: [T], explanation: `${n(m)} − ${n(c)} = ${n(T)} swaps.` },
   { prompt: `Each swap takes ${pl(w, 'minute')}. How many minutes for ${n(T)} swaps?`, answer: [tot], explanation: `${n(T)} × ${n(w)} = ${n(tot)} minutes.` }
  ] }; }
});

/* Challenge, uses q12: the combined move σ ∘ τ on 6 or 7 symbols; swaps and sign of it. */
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q12', title: 'Swaps for a double move',
 brief: 'Two bolt moves are run back to back, and the swap robot must be programmed for the single move they make together.',
 labels: ['swaps', 'sign'], tolerance: 0.01,
 gl: [['end socket of socket 1'], ['cycles of the combined move'], ['swaps'], ['sign']]
}, {
 canonical: { s: [2, 3, 1, 5, 6, 4, 7], t: [4, 1, 5, 2, 7, 3, 6] },
 draw: R => bounded(R, { s: [2, 3, 1, 5, 6, 4, 7], t: [4, 1, 5, 2, 7, 3, 6] }, R => { const m = R.int(6, 7); return { s: shuffle(R, m), t: shuffle(R, m) }; },
  q => !isId(q.s) && !isId(q.t) && !isId(comp(q.s, q.t))),
 build: ({ s, t }) => { const m = s.length, f = comp(s, t), cs = cyclesOf(f), c = cs.length, T = m - c, sign = T % 2 ? -1 : 1, word = T % 2 ? 'odd' : 'even'; return {
  prompt: `A hatch has ${n(m)} bolt sockets numbered 1 to ${n(m)}. Move σ is ${arrows(s)}. Move τ is ${arrows(t)}. An arrow 2 → 5 means the bolt in socket 2 drops into socket 5. The crew runs τ first and then σ, which is the single move σ ∘ τ. The robot can only swap two sockets at a time (a transposition), and a cycle of length L takes L − 1 swaps, fixed sockets taking none. Work out the combined move σ ∘ τ and write it in cycle notation. Enter the number of swaps it takes, then its sign: 1 if σ ∘ τ is an even permutation, −1 if it is odd.`,
  answer: [T, sign],
  hints: ['Find where each socket ends under σ ∘ τ: look it up in τ first, then look the result up in σ. Do this for every socket to get the combined list.', 'Then follow that list into cycles. The swaps are the number of sockets minus the number of cycles, fixed sockets counted as cycles, and an even count gives sign 1, an odd count −1.'],
  solution: `Running τ then σ sends the sockets 1 to ${n(m)} to ${f.map(n).join(', ')} in turn. In cycle notation ${cycText(cs)}: ${pl(c, 'cycle')} on ${n(m)} sockets. It takes ${n(m)} − ${n(c)} = ${n(T)} swaps. ${n(T)} is ${word}, so σ ∘ τ is ${word} and its sign is ${n(sign)}.`,
  guidance: [
   { prompt: `τ goes first. Where does socket 1 end under σ ∘ τ? Find τ(1), then look that up in σ.`, answer: [f[0]], explanation: `τ(1) = ${n(t[0])} and σ(${n(t[0])}) = ${n(f[0])}.` },
   { prompt: 'Work out the end socket of every socket in the same way, then write σ ∘ τ in cycles. How many cycles are there, fixed sockets counted?', answer: [c], explanation: `The combined list is ${f.map(n).join(', ')} for sockets 1 to ${n(m)}, which is ${cycText(cs)}: ${pl(c, 'cycle')}.` },
   { prompt: `How many swaps does σ ∘ τ take, with ${n(m)} sockets and ${pl(c, 'cycle')}?`, answer: [T], explanation: `${n(m)} − ${n(c)} = ${n(T)}.` },
   { prompt: `${n(T)} swaps: enter the sign, 1 for even or −1 for odd.`, answer: [sign], explanation: `${n(T)} is ${word}, so the sign is ${n(sign)}.` }
  ] }; }
});

/* ---- q15 Counting S_n and A_n [5.1] ---- */

/* k free tubes (3, 5, 6 or 7: the worked example has 4): |S_k|, odd ones (k! ÷ 2) and pairs k(k − 1) ÷ 2. */
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The clamped tube rack',
 brief: 'A sample rack has some tubes clamped fast, and the crew wants to count every way to reseat the rest.',
 labels: ['arrangements', 'odd arrangements', 'pairs'], tolerance: 0.01,
 gl: [['arrangements'], ['odd arrangements'], ['pairs']]
}, {
 canonical: { N: 10, w: 3 },
 draw: R => bounded(R, { N: 10, w: 3 }, R => { const N = R.int(5, 14); return { N, w: R.int(1, N - 3) }; }, p => [3, 5, 6, 7].includes(p.N - p.w)),
 build: ({ N, w }) => { const k = N - w, f = fact(k), half = f / 2, tr = k * (k - 1) / 2, chain = Array.from({ length: k }, (_, i) => n(k - i)).join(' × '); return {
  prompt: `A sample rack has ${n(N)} positions, and ${w === 1 ? 'one tube is' : n(w) + ' of the tubes are'} clamped in place and never move. The other ${n(k)} tubes can be lifted out and put back into their own ${n(k)} positions in any order, one tube per position. Each way of doing this is a permutation of those ${n(k)} positions, and leaving everything where it was counts as one way. Enter the number of ways, then how many of them are odd permutations, then how many pairs of the ${n(k)} positions a robot could choose to swap. Type each answer without commas.`,
  answer: [f, half, tr],
  hints: ['Fill the positions one at a time: the first tube has as many choices as there are positions, the next one fewer, and so on down to 1.', 'For two or more symbols exactly half of the permutations are even, so the other half are odd. A pair of positions is counted once, not twice, so for k positions it is k(k − 1) ÷ 2.'],
  solution: `Only the ${n(k)} free tubes move, so the ways are ${n(k)}! = ${chain} = ${n(f)}. Half are even and half odd, so ${n(f)} ÷ 2 = ${n(half)} are odd. Pairs of positions: ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(tr)}.`,
  guidance: [
   { prompt: `How many ways are there to reseat the ${n(k)} free tubes? Work out ${n(k)}!.`, answer: [f], explanation: `${n(k)}! = ${chain} = ${n(f)}. ${w === 1 ? 'The clamped tube never moves, so it changes nothing.' : `The ${n(w)} clamped tubes never move, so they change nothing.`}` },
   { prompt: 'Half of all the ways are even permutations. How many are odd?', answer: [half], explanation: `${n(f)} ÷ 2 = ${n(half)} odd ones.` },
   { prompt: `How many pairs of the ${n(k)} positions are there?`, answer: [tr], explanation: `${n(k)} × ${n(k - 1)} ÷ 2 = ${n(tr)}: each pair is counted twice by ${n(k)} × ${n(k - 1)}.` }
  ] }; }
});

/* k trays (3, 5, 6 or 7), only the even arrangements are tested, w minutes each. */
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The safe arrangement test',
 brief: 'A test robot will try only the safe, even arrangements of a tray set, and the crew must book its time.',
 labels: ['arrangements', 'even arrangements', 'minutes'], tolerance: 0.01,
 gl: [['arrangements'], ['even arrangements'], ['minutes']]
}, {
 canonical: { k: 5, w: 4 },
 draw: R => ({ k: R.pick([3, 5, 6, 7]), w: R.int(2, 9) }),
 build: ({ k, w }) => { const f = fact(k), half = f / 2, tot = half * w, chain = Array.from({ length: k }, (_, i) => n(k - i)).join(' × '); return {
  prompt: `A test robot has ${n(k)} different trays that can sit in ${n(k)} slots, one tray per slot. Each way of placing them is a permutation of the ${n(k)} slots, and the placement that leaves every tray where it started counts as one way. The robot tests only the even permutations, and each test takes ${pl(w, 'minute')}. Enter the number of ways to place the trays, then the number of even permutations, then the total minutes the robot needs to test them all. Type each answer without commas.`,
  answer: [f, half, tot],
  hints: ['The first tray can go in any slot, the next in any slot left, and so on down to the last. The number of ways is the product of the counts of choices.', 'For two or more trays exactly half of the placements are even. The time is the number of tests times the minutes each takes.'],
  solution: `The number of ways is ${n(k)}! = ${chain} = ${n(f)}. Half are even: ${n(f)} ÷ 2 = ${n(half)}. At ${pl(w, 'minute')} per test the robot needs ${n(half)} × ${n(w)} = ${n(tot)} minutes.`,
  guidance: [
   { prompt: `How many ways are there to place ${n(k)} trays in ${n(k)} slots? Work out ${n(k)}!.`, answer: [f], explanation: `${n(k)}! = ${chain} = ${n(f)}.` },
   { prompt: 'The robot tests only the even permutations. How many are even?', answer: [half], explanation: `Half of ${n(f)} is ${n(half)}.` },
   { prompt: `Each test takes ${pl(w, 'minute')}. How many minutes do ${n(half)} tests take?`, answer: [tot], explanation: `${n(half)} × ${n(w)} = ${n(tot)} minutes.` }
  ] }; }
});

/* Challenge, uses q14: k = 5 to 8 symbols; even permutations and the odd ones that are not transpositions (k! ÷ 2 − k(k − 1) ÷ 2). */
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q14', title: 'Odd moves that are not swaps',
 brief: 'The hatch crew wants to know how many odd bolt moves are more than a single swap, because those need a longer program.',
 labels: ['even moves', 'odd moves that are not swaps'], tolerance: 0.01,
 gl: [['all moves'], ['odd moves'], ['odd moves that are not swaps']]
}, {
 canonical: { N: 11, w: 5 },
 draw: R => bounded(R, { N: 11, w: 5 }, R => { const N = R.int(6, 17); return { N, w: R.int(1, N - 5) }; }, p => [5, 6, 7, 8].includes(p.N - p.w)),
 build: ({ N, w }) => { const k = N - w, f = fact(k), half = f / 2, tr = k * (k - 1) / 2, rest = half - tr, chain = Array.from({ length: k }, (_, i) => n(k - i)).join(' × '); return {
  prompt: `A hatch has ${n(N)} bolt sockets, but ${w === 1 ? 'one bolt is' : n(w) + ' of the bolts are'} locked in place. Every way of dropping the other ${n(k)} bolts back into their own ${n(k)} sockets, one per socket, is a permutation of those ${n(k)} sockets. Doing nothing counts as one of them. A transposition swaps two sockets and leaves the rest alone, and every transposition is an odd permutation. For two or more symbols exactly half of the permutations are even. Enter how many of these moves are even permutations, then how many are odd permutations that are not transpositions. Type each answer without commas.`,
  answer: [half, rest],
  hints: ['The total is the product of the number of choices for each socket in turn. Half of it is even, and the other half is odd.', 'The transpositions are some of the odd permutations. Count them as the pairs of sockets, each pair once, k(k − 1) ÷ 2, and take them away from the odd ones.'],
  solution: `Only the ${n(k)} free bolts move. There are ${n(k)}! = ${chain} = ${n(f)} moves. Half are even: ${n(f)} ÷ 2 = ${n(half)}, and the other ${n(half)} are odd. There are ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(tr)} transpositions, all odd. The odd moves that are not transpositions number ${n(half)} − ${n(tr)} = ${n(rest)}.`,
  guidance: [
   { prompt: `How many moves of the free bolts are there in all? Work out ${n(k)}!.`, answer: [f], explanation: `${n(k)}! = ${chain} = ${n(f)}.` },
   { prompt: 'Half of them are even and half are odd. How many are odd?', answer: [half], explanation: `${n(f)} ÷ 2 = ${n(half)}, so there are ${n(half)} even and ${n(half)} odd moves.` },
   { prompt: `There are ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(tr)} transpositions, all odd. How many odd moves are not transpositions?`, answer: [rest], explanation: `${n(half)} − ${n(tr)} = ${n(rest)}.` }
  ] }; }
});

})();
