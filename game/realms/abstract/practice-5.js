/* Abstract algebra: patterns of moves practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p5.js. */
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
const coprimes = m => { const out = []; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) out.push(x); return out; };
const isPrime = m => m > 1 && coprimes(m).length === m - 1;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[d]).join('');
const Z = m => 'Z' + String(m).split('').map(d => SUB[d]).join('');
const list = xs => xs.map(n).join(', ');
/* "a 6-position dial", "an 8-position dial", "an 11-position dial". */
const an = x => /^(8|11|18|8\d)$/.test(String(x)) ? 'an' : 'a';
/* 1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st. */
const ord = k => { const t = k % 100, u = k % 10; return n(k) + (t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'); };
const set = xs => xs.length <= 8 ? `{${list(xs)}}` : `{${list(xs.slice(0, 3))}, …, ${n(xs[xs.length - 1])}}`;
const multiples = (step, below) => { const out = []; for (let x = 0; x < below; x += step) out.push(x); return out; };
const powmod = (a, e, m) => { let r = 1 % m, b = a % m; while (e > 0) { if (e % 2 === 1) r = r * b % m; b = b * b % m; e = Math.floor(e / 2); } return r; };
/* The order of a mod m (a coprime to m): the smallest j of 1 or more with a to the power j leaving remainder 1. */
const ordMod = (a, m) => { let v = a % m, j = 1; while (v !== 1 && j <= m) { v = v * a % m; j++; } return j; };
/* The powers a, a², …, aʳ of a mod m, as a list. */
const chain = (a, r, m) => { const out = []; let v = 1; for (let i = 0; i < r; i++) { v = v * a % m; out.push(v); } return out; };
const divisors = x => { const out = []; for (let d = 1; d <= x; d++) if (x % d === 0) out.push(d); return out; };
/* A permutation of slots 1 … k is the list of where slots 1, 2, … are sent. */
const perm = (name, p) => `${name}: ${p.map((v, i) => `${i + 1} → ${v}`).join(', ')}`;
const shuffle = (R, k) => { const p = []; for (let i = 1; i <= k; i++) p.push(i); for (let i = k - 1; i > 0; i--) { const j = R.int(0, i); [p[i], p[j]] = [p[j], p[i]]; } return p; };
const isId = p => p.every((v, i) => v === i + 1);
/* Two non-identity rearrangements of k slots, with a bounded retry and a fixed fallback. */
const twoPerms = (R, k, fb) => { for (let g = 0; g < 1000; g++) { const s = shuffle(R, k), t = shuffle(R, k); if (!isId(s) && !isId(t)) return { s, t }; } return fb; };
const cyclesOf = p => { const seen = {}, out = []; for (let i = 1; i <= p.length; i++) { if (seen[i]) continue; const c = []; let j = i; while (!seen[j]) { seen[j] = 1; c.push(j); j = p[j - 1]; } out.push(c); } return out; };
const rackWord = xs => xs.length === 1 ? 'rack ' + n(xs[0]) : 'racks ' + list(xs);

/* ---- q21 Euler's and Fermat's theorems [6.3] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The tag printer ring',
 brief: 'The depot tag printer stamps each crate with a huge power worked out on a ring of slots, and Mira wants the slot without printing the power.',
 labels: ['p − 1', 'remainder of the power', 'tag slot'], tolerance: 0.01,
 gl: [['p − 1'], ['remainder of the power'], ['tag slot']]
}, {
 /* p is prime, so φ(p) = p − 1 and this is Fermat’s little theorem. a is from 2 to p − 2, the power is 1000 to 9999 and
    its remainder on division by p − 1 is at least 2. Never the worked example (2¹⁰⁰³ mod 15): 15 is not prime. */
 canonical: { a: 5, k: 2000, p: 13 },
 draw: R => { const ps = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  for (let i = 0; i < 1000; i++) { const p = R.pick(ps), a = R.int(2, p - 2), k = R.int(1000, 9999); if (k % (p - 1) >= 2) return { a, k, p }; }
  return { a: 5, k: 2000, p: 13 }; },
 build: ({ a, k, p }) => { const f = p - 1, q = Math.floor(k / f), r = k % f, pw = chain(a, r, p), v = pw[r - 1]; return {
  prompt: `The depot tag printer works on a ring of ${n(p)} tag slots, numbered 0 to ${n(p - 1)}, and ${n(p)} is a prime number. A crate’s tag is slot ${n(a)}${sup(k)} mod ${n(p)}: ${n(a)} to the power ${n(k)}, divided by ${n(p)}, keeping only the remainder. Fermat’s little theorem says that when p is prime and a is not a multiple of p, a to the power p − 1 leaves remainder 1 on division by p. Enter ${n(p)} − 1, then the remainder when ${n(k)} is divided by ${n(p)} − 1, then the crate’s tag slot.`,
  answer: [f, r, v],
  hints: ['Fermat’s little theorem is Euler’s theorem for a prime: a to the power p − 1 leaves remainder 1, so every full block of p − 1 in the power can be dropped.', 'Divide the power by p − 1 and keep the remainder r. The tag slot is a to the power r, mod p: multiply by a step by step, keeping the remainder mod p each time.'],
  solution: `${n(p)} is prime, so ${n(p)} − 1 = ${n(f)}. ${n(k)} = ${n(f)} × ${n(q)} + ${n(r)}, so the remainder is ${n(r)}. By Fermat’s little theorem ${n(a)}${sup(f)} mod ${n(p)} = 1, so ${n(a)}${sup(k)} mod ${n(p)} = ${n(a)}${sup(r)} mod ${n(p)}. The powers of ${n(a)} mod ${n(p)} go ${list(pw)}, so the tag slot is ${n(v)}.`,
  guidance: [
   { prompt: `${n(p)} is prime. What is ${n(p)} − 1, the power of ${n(a)} that leaves remainder 1 on division by ${n(p)}?`, answer: [f], explanation: `${n(p)} − 1 = ${n(f)}, so ${n(a)}${sup(f)} mod ${n(p)} = 1 by Fermat’s little theorem.` },
   { prompt: `Divide the power ${n(k)} by ${n(f)}. What is the remainder?`, answer: [r], explanation: `${n(f)} × ${n(q)} = ${n(f * q)}, and ${n(k)} − ${n(f * q)} = ${n(r)}. So ${n(k)} = ${n(f)} × ${n(q)} + ${n(r)}.` },
   { prompt: `Only the remainder ${n(r)} of the power matters. What is ${n(a)}${sup(r)} mod ${n(p)}?`, answer: [v], explanation: `Multiply by ${n(a)} and keep the remainder mod ${n(p)} each time: ${list(pw)}. So ${n(a)}${sup(r)} mod ${n(p)} = ${n(v)}, and that is also ${n(a)}${sup(k)} mod ${n(p)}.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Presses on the stamping machine',
 brief: 'The stamping machine has run for weeks without a reset, and the crew needs its setting now without replaying every press.',
 labels: ['total presses', 'remainder', 'final setting'], tolerance: 0.01,
 gl: [['total presses'], ['remainder'], ['final setting']]
}, {
 /* m is composite (9 to 50, not 15) with φ(m) from 4 to 24; a is coprime to m; the total number of presses is at least 1000
    and leaves a remainder of at least 2 on division by φ(m). */
 canonical: { a: 7, m: 22, per: 45, days: 63 },
 draw: R => { const ms = []; for (let m = 9; m <= 50; m++) { const f = coprimes(m).length; if (m !== 15 && !isPrime(m) && f >= 4 && f <= 24) ms.push(m); }
  for (let i = 0; i < 1000; i++) { const m = R.pick(ms), cs = coprimes(m).filter(x => x > 1 && x < m - 1), a = R.pick(cs), per = R.int(20, 90), days = R.int(30, 120), T = per * days;
   if (T >= 1000 && T % coprimes(m).length >= 2) return { a, m, per, days }; }
  return { a: 7, m: 22, per: 45, days: 63 }; },
 build: ({ a, m, per, days }) => { const cs = coprimes(m), f = cs.length, T = per * days, q = Math.floor(T / f), r = T % f, pw = chain(a, r, m), v = pw[r - 1]; return {
  prompt: `A depot stamping machine multiplies its setting by ${n(a)}, mod ${n(m)}, at every press: it keeps only the remainder on division by ${n(m)}. It starts at setting 1, and ${n(a)} and ${n(m)} are coprime. After T presses its setting is ${n(a)} to the power T, mod ${n(m)}. The machine presses ${n(per)} times a day for ${n(days)} days without a reset. Let φ(${n(m)}) be the number of whole numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)}. Enter the total number of presses (type it without commas), then the remainder when that total is divided by φ(${n(m)}), then the machine’s setting after all the presses.`,
  answer: [T, r, v],
  hints: ['The total is the presses per day times the number of days. Each press multiplies by the same number, so after T presses the setting is that number to the power T, mod the ring size.', 'Euler’s theorem: when a and n are coprime, a to the power φ(n) leaves remainder 1, so full blocks of φ(n) presses change nothing. Count the coprime numbers to find φ(n), divide the total by it, and keep the remainder r. The setting is a to the power r, mod n.'],
  solution: `${n(per)} presses a day for ${n(days)} days is ${n(per)} × ${n(days)} = ${n(T)} presses. The numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)} are ${list(cs)}, so φ(${n(m)}) = ${n(f)}. ${n(T)} = ${n(f)} × ${n(q)} + ${n(r)}, so the remainder is ${n(r)}. By Euler’s theorem ${n(a)}${sup(f)} mod ${n(m)} = 1, so the setting after ${n(T)} presses is ${n(a)}${sup(r)} mod ${n(m)}. Multiplying by ${n(a)} and keeping the remainder each time gives ${list(pw)}, so the final setting is ${n(v)}.`,
  guidance: [
   { prompt: `How many presses are there in total: ${n(per)} presses a day for ${n(days)} days?`, answer: [T], explanation: `${n(per)} × ${n(days)} = ${n(T)} presses.` },
   { prompt: `Count the numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)} to get φ(${n(m)}), then divide ${n(T)} by it. What is the remainder?`, answer: [r], explanation: `The coprime numbers are ${list(cs)}, so φ(${n(m)}) = ${n(f)}. ${n(f)} × ${n(q)} = ${n(f * q)}, and ${n(T)} − ${n(f * q)} = ${n(r)}.` },
   { prompt: `By Euler’s theorem only the remainder ${n(r)} matters. What is ${n(a)}${sup(r)} mod ${n(m)}, the machine’s final setting?`, answer: [v], explanation: `Multiply by ${n(a)} and keep the remainder mod ${n(m)} each time: ${list(pw)}. So the final setting is ${n(v)}.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q08', title: 'A code wheel that repeats early',
 brief: 'One vault code wheel comes home to 1 far sooner than the theorem guarantees, and the crew wants to use that shortcut for a very long run.',
 labels: ['φ(n)', 'order of a', 'setting after the run'], tolerance: 0.01,
 gl: [['φ(n)'], ['order of a'], ['setting after the run']]
}, {
 /* The order of a mod m is a divisor of φ(m) and is below it (so the wheel repeats earlier than Euler’s theorem promises), at
    least 4, with the number of steps leaving a remainder of at least 2 on division by the order. m is 7 to 50, not 15. */
 canonical: { a: 5, m: 21, k: 1000 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(7, 50); if (m === 15) continue; const f = coprimes(m).length, a = R.int(2, m - 2); if (gcd(a, m) !== 1) continue;
   const o = ordMod(a, m), k = R.int(1000, 9999); if (o >= 4 && o < f && k % o >= 2) return { a, m, k }; }
  return { a: 5, m: 21, k: 1000 }; },
 build: ({ a, m, k }) => { const cs = coprimes(m), f = cs.length, o = ordMod(a, m), pw = chain(a, o, m), q = Math.floor(k / o), r = k % o, v = pw[r - 1]; return {
  prompt: `A vault door’s code wheel multiplies its setting by ${n(a)}, mod ${n(m)}, at every step, starting from 1; ${n(a)} and ${n(m)} are coprime. The order of ${n(a)} mod ${n(m)} is the smallest number of steps j, 1 or more, with ${n(a)} to the power j leaving remainder 1 on division by ${n(m)}: after j steps the wheel is back at 1 and the settings repeat. The order always divides φ(${n(m)}), the number of whole numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)}. Enter φ(${n(m)}), then the order of ${n(a)} mod ${n(m)}, then the wheel’s setting after ${n(k)} steps, ${n(a)}${sup(k)} mod ${n(m)}.`,
  answer: [f, o, v],
  hints: ['Count the numbers from 1 to n − 1 that share no factor with n except 1 to get φ(n). For the order, list the powers of a mod n by multiplying by a and keeping the remainder; the first one equal to 1 gives the order.', 'The settings repeat every j steps, where j is the order, so divide the number of steps by j and keep the remainder r. The setting is a to the power r, mod n. Cutting by φ(n) instead also works but needs a longer run of powers.'],
  solution: `The numbers from 1 to ${n(m - 1)} coprime to ${n(m)} are ${list(cs)}, so φ(${n(m)}) = ${n(f)}. The powers of ${n(a)} mod ${n(m)} go ${list(pw)}: the first 1 comes at step ${n(o)}, so the order is ${n(o)}, a divisor of ${n(f)}. ${n(k)} = ${n(o)} × ${n(q)} + ${n(r)}, so ${n(a)}${sup(k)} mod ${n(m)} = ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}.`,
  guidance: [
   { prompt: `List the numbers from 1 to ${n(m - 1)} that are coprime to ${n(m)}. How many are there? That count is φ(${n(m)}).`, answer: [f], explanation: `They are ${list(cs)}: ${n(f)} numbers, so φ(${n(m)}) = ${n(f)}.` },
   { prompt: `Multiply by ${n(a)} and keep the remainder mod ${n(m)} each time, starting from 1. At which step does the setting first come back to 1? That step number is the order.`, answer: [o], explanation: `The settings go ${list(pw)}. The first 1 is at step ${n(o)}, so the order of ${n(a)} mod ${n(m)} is ${n(o)}.` },
   { prompt: `The settings repeat every ${n(o)} steps. Divide ${n(k)} by ${n(o)}, keep the remainder, and use it as the power: what is ${n(a)}${sup(k)} mod ${n(m)}?`, answer: [v], explanation: `${n(o)} × ${n(q)} = ${n(o * q)}, and ${n(k)} − ${n(o * q)} = ${n(r)}. So ${n(a)}${sup(k)} mod ${n(m)} = ${n(a)}${sup(r)} mod ${n(m)}, which is step ${n(r)} of the list: ${n(v)}.` }
  ] }; }
});

/* ---- q22 Conjugates and normal subgroups [10.1] ---- */

/* The subgroup H of the second part of q22b. Cases 0–2 are the swaps of two slots in S₃ (not normal), 3 the three turns
   of S₃, 4 the identity alone, 5 the whole of S₃ (all normal). The case number only picks a text. */
const PAIRS = [[1, 2], [1, 3], [2, 3]];
const CYC = [0, 2, 3, 1];   // the move 1 → 2, 2 → 3, 3 → 1, indexed by slot
const subCase = c => {
 if (c < 3) { const [x, y] = PAIRS[c], u = CYC[x], v = CYC[y], lo = Math.min(u, v), hi = Math.max(u, v);
  return { what: `take S₃, the group of all six rearrangements of three slots, and its subgroup H = {identity, the swap of slots ${x} and ${y}}`,
   short: `H = {identity, the swap of slots ${x} and ${y}} in S₃`, yes: 0,
   why: `For H in S₃, take g = the move 1 → 2, 2 → 3, 3 → 1. Conjugating relabels the slots, so g h g⁻¹ swaps g(${x}) = ${u} and g(${y}) = ${v}: the swap of slots ${lo} and ${hi}, which is not in H. So H is not normal: enter 0.` }; }
 if (c === 3) return { what: 'take S₃, the group of all six rearrangements of three slots, and its subgroup H of the three turns: the identity, the move 1 → 2, 2 → 3, 3 → 1 and the move 1 → 3, 3 → 2, 2 → 1',
  short: 'H = the three turns of three slots in S₃', yes: 1,
  why: 'For H in S₃: a turn moves every slot, and g h g⁻¹ does the same job on relabelled slots, so it moves every slot too. The only rearrangements of three slots that move all three are the two turns, which are in H, and a conjugate of the identity is the identity. Every conjugate stays in H, so H is normal: enter 1.' };
 if (c === 4) return { what: 'take S₃, the group of all six rearrangements of three slots, and its subgroup H = {identity}, which holds the identity alone',
  short: 'H = {identity} in S₃', yes: 1,
  why: 'For H = {identity} in S₃: g ∘ identity ∘ g⁻¹ = g ∘ g⁻¹ = identity for every g, so every conjugate of the only element of H is that element itself. H is normal: enter 1.' };
 return { what: 'take S₃, the group of all six rearrangements of three slots, and its subgroup H = S₃ itself, all six rearrangements',
  short: 'H = S₃ itself, all six rearrangements', yes: 1,
  why: 'For H = S₃ itself: g h g⁻¹ is a combination of rearrangements of the three slots, so it is a rearrangement of the three slots, and every one of those is in H. H is normal: enter 1.' };
};

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Renumbering the cargo racks',
 brief: 'The cargo hall’s six racks are being renumbered, and the crew wants to see where a crate goes under the new numbers and which rack groups survive any renumbering.',
 labels: ['(ρ ∘ π ∘ ρ⁻¹)(i)', 'H normal (1 or 0)'], tolerance: 0.01,
 gl: [['ρ⁻¹(i)'], ['π of it'], ['(ρ ∘ π ∘ ρ⁻¹)(i)'], ['H normal (1 or 0)']]
}, {
 /* π and ρ are random rearrangements of six racks, neither the identity; i is a rack. c picks the subgroup H of S₃ of the second
    part (an index into subCase's texts); half the draws are not normal (c 0–2) and half are normal (c 3–5). */
 canonical: { s: [3, 6, 4, 1, 2, 5], t: [2, 1, 4, 5, 6, 3], i: 4, c: 0 },
 draw: R => { const { s, t } = twoPerms(R, 6, { s: [3, 6, 4, 1, 2, 5], t: [2, 1, 4, 5, 6, 3] });
  return { s, t, i: R.int(1, 6), c: R.bool() ? R.int(0, 2) : R.int(3, 5) }; },
 build: ({ s, t, i, c }) => { const j = t.indexOf(i) + 1, k = s[j - 1], v = t[k - 1], N = subCase(c); return {
  prompt: `Six racks in the cargo hall are numbered 1 to 6. A programme π and a renumbering ρ each send every rack’s crate to another rack: ${perm('π', s)}; ${perm('ρ', t)}. Moves are combined right to left, so ρ ∘ π means π first, then ρ, and ρ⁻¹ is the move that undoes ρ. Enter (ρ ∘ π ∘ ρ⁻¹)(${n(i)}), the rack that ρ⁻¹, then π, then ρ send rack ${n(i)} to. Then ${N.what}. Enter 1 if H is a normal subgroup and 0 if it is not.`,
  answer: [v, N.yes],
  hints: ['Work from the right. ρ⁻¹ sends a rack back to the rack that ρ sends there. Then apply π, then ρ.', 'H is normal when g h g⁻¹ is in H for every g in the group and every h in H. One g that takes some h outside H is enough to show H is not normal; if no g can, H is normal.'],
  solution: `ρ sends ${n(j)} to ${n(i)}, so ρ⁻¹(${n(i)}) = ${n(j)}. Then π(${n(j)}) = ${n(k)} and ρ(${n(k)}) = ${n(v)}, so (ρ ∘ π ∘ ρ⁻¹)(${n(i)}) = ${n(v)}. ${N.why}`,
  guidance: [
   { prompt: `Start on the right with ρ⁻¹. Which rack does ρ send to rack ${n(i)}? That rack is ρ⁻¹(${n(i)}).`, answer: [j], explanation: `ρ sends ${n(j)} to ${n(i)}, so ρ⁻¹ sends ${n(i)} back to ${n(j)}.` },
   { prompt: `Next apply π. What is π(${n(j)})?`, answer: [k], explanation: `π sends ${n(j)} to ${n(k)}.` },
   { prompt: `Last apply ρ. What is ρ(${n(k)})? That is (ρ ∘ π ∘ ρ⁻¹)(${n(i)}).`, answer: [v], explanation: `ρ sends ${n(k)} to ${n(v)}, so (ρ ∘ π ∘ ρ⁻¹)(${n(i)}) = ${n(v)}.` },
   { prompt: `Now the subgroup: ${N.short}. Is H normal? Enter 1 for yes, 0 for no.`, answer: [N.yes], explanation: N.why }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'The same job under new rack numbers',
 brief: 'The crew renumbers the racks but wants the sorter to do the same job as before, so the new programme has to be read off from the old one.',
 labels: ['where the new job sends the rack', 'racks the new job leaves in place'], tolerance: 0.01,
 gl: [['old number of the rack'], ['where the new job sends the rack'], ['racks the new job leaves in place']]
}, {
 /* σ and τ are rearrangements of six racks, neither the identity. σ leaves 0 to 4 racks in place (it is not the identity), and
    τ στ⁻¹ leaves exactly as many. */
 canonical: { s: [2, 4, 3, 6, 1, 5], t: [3, 1, 5, 2, 6, 4], i: 5 },
 draw: R => { const { s, t } = twoPerms(R, 6, { s: [2, 4, 3, 6, 1, 5], t: [3, 1, 5, 2, 6, 4] }); return { s, t, i: R.int(1, 6) }; },
 build: ({ s, t, i }) => { const j = t.indexOf(i) + 1, k = s[j - 1], v = t[k - 1], fix = []; s.forEach((x, idx) => { if (x === idx + 1) fix.push(idx + 1); });
  const f = fix.length, fixText = f === 0 ? 'σ leaves no rack in place' : `σ leaves ${rackWord(fix)} in place`; return {
  prompt: `The cargo hall’s sorter runs a job σ on six racks numbered 1 to 6: it sends the crate in each rack to another rack, or leaves it where it is. ${perm('σ', s)}. The crew now renumbers the racks: the rack that was numbered x gets the new number τ(x), where ${perm('τ', t)}. The sorter does the same job as before, but written in the new numbers: it sends the crate in new rack τ(x) to new rack τ(σ(x)). Enter the new rack that the job sends new rack ${n(i)} to, then the number of racks (out of six) that the job leaves in place under the new numbers.`,
  answer: [v, f],
  hints: ['To find where the job sends new rack i, first find which old rack had that new number: it is the rack x that τ sends to i. Do the old job σ on x, then give the result its new number with τ. In symbols this is τ ∘ σ ∘ τ⁻¹.', 'Renumbering only changes the names of the racks, not what the job does: a rack that stays in place under the old numbers stays in place under the new ones. Count the racks that σ leaves where they are.'],
  solution: `The new rack ${n(i)} is the old rack that τ sends to ${n(i)}, which is ${n(j)}. The old job sends ${n(j)} to σ(${n(j)}) = ${n(k)}, and the new number of ${n(k)} is τ(${n(k)}) = ${n(v)}. So the job sends new rack ${n(i)} to new rack ${n(v)}. Renaming does not change which racks stay put: ${fixText}, so the job leaves ${n(f)} in place under the new numbers too.`,
  guidance: [
   { prompt: `Which old rack carries the new number ${n(i)}? It is the rack that τ sends to ${n(i)}.`, answer: [j], explanation: `τ sends ${n(j)} to ${n(i)}, so the old rack ${n(j)} is new rack ${n(i)}.` },
   { prompt: `The old job sends rack ${n(j)} to σ(${n(j)}). Give that rack its new number: what is τ(σ(${n(j)}))?`, answer: [v], explanation: `σ(${n(j)}) = ${n(k)} and τ(${n(k)}) = ${n(v)}, so the job sends new rack ${n(i)} to new rack ${n(v)}.` },
   { prompt: 'Renumbering does not change which racks stay where they are. How many racks does σ leave in place (σ sends the rack to itself)?', answer: [f], explanation: `${fixText}, so the new job leaves ${n(f)} in place.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q13', title: 'A conjugate keeps its order',
 brief: 'A seven-bolt locking sequence is renumbered, and the crew must check where one bolt goes and how many repeats bring every bolt home.',
 labels: ['(τ ∘ σ ∘ τ⁻¹)(i)', 'order of τ ∘ σ ∘ τ⁻¹'], tolerance: 0.01,
 gl: [['τ⁻¹(i)'], ['(τ ∘ σ ∘ τ⁻¹)(i)'], ['order of σ']]
}, {
 /* σ and τ are rearrangements of seven bolts, neither the identity. The order of σ is the smallest number of repeats that brings
    every bolt home: the smallest number that every cycle length divides, which is at most 12 for seven bolts. */
 canonical: { s: [3, 1, 2, 6, 7, 5, 4], t: [2, 7, 1, 5, 3, 4, 6], i: 3 },
 draw: R => { const { s, t } = twoPerms(R, 7, { s: [3, 1, 2, 6, 7, 5, 4], t: [2, 7, 1, 5, 3, 4, 6] }); return { s, t, i: R.int(1, 7) }; },
 build: ({ s, t, i }) => { const j = t.indexOf(i) + 1, k = s[j - 1], v = t[k - 1], cs = cyclesOf(s).filter(c => c.length > 1), lens = cs.map(c => c.length), o = lens.reduce(lcm, 1),
  chains = cs.map(c => `${c.map(n).join(' → ')} → ${n(c[0])}`).join('; '); return {
  prompt: `A vault’s locking sequence works on seven bolts numbered 1 to 7. Two moves each send every bolt to another position, or leave it: ${perm('σ', s)}; ${perm('τ', t)}. Moves are combined right to left, so τ ∘ σ means σ first, then τ, and τ⁻¹ is the move that undoes τ. Enter (τ ∘ σ ∘ τ⁻¹)(${n(i)}), the position that τ⁻¹, then σ, then τ send bolt ${n(i)} to. Then enter the order of the move τ ∘ σ ∘ τ⁻¹: the smallest number of times, 1 or more, that the move must be repeated for every bolt to be back where it started. A conjugate has the same order as the move it comes from, so you can work the order out for σ: follow each bolt under σ until it is back, and the order is the smallest number that all these cycle lengths divide.`,
  answer: [v, o],
  hints: ['Work from the right. τ⁻¹ sends a position back to the position that τ sends there. Then apply σ, then τ.', 'Follow one bolt under σ again and again until it returns to where it began: the number of steps is the length of its cycle. Do the same for every bolt that moves. The order is the smallest number that all the cycle lengths divide.'],
  solution: `τ sends ${n(j)} to ${n(i)}, so τ⁻¹(${n(i)}) = ${n(j)}. Then σ(${n(j)}) = ${n(k)} and τ(${n(k)}) = ${n(v)}, so (τ ∘ σ ∘ τ⁻¹)(${n(i)}) = ${n(v)}. Following σ round gives the cycles ${chains}, with lengths ${list(lens)}; the other bolts stay put. Every bolt is home again after the smallest number that all these lengths divide, which is ${n(o)}. The conjugate has the same order, ${n(o)}.`,
  guidance: [
   { prompt: `Start on the right with τ⁻¹. Which position does τ send to ${n(i)}? That position is τ⁻¹(${n(i)}).`, answer: [j], explanation: `τ sends ${n(j)} to ${n(i)}, so τ⁻¹ sends ${n(i)} back to ${n(j)}.` },
   { prompt: `Now apply σ to ${n(j)}, then τ to the result. What is τ(σ(${n(j)}))? That is (τ ∘ σ ∘ τ⁻¹)(${n(i)}).`, answer: [v], explanation: `σ(${n(j)}) = ${n(k)} and τ(${n(k)}) = ${n(v)}, so (τ ∘ σ ∘ τ⁻¹)(${n(i)}) = ${n(v)}.` },
   { prompt: 'A conjugate has the same order as σ. Follow each bolt under σ until it returns, to find the cycle lengths. What is the smallest number of repeats that brings every bolt home (the order of σ)?', answer: [o], explanation: `The cycles of σ are ${chains}, with lengths ${list(lens)}. The smallest number that all these lengths divide is ${n(o)}, so the order is ${n(o)}.` }
  ] }; }
});

/* ---- q23 Chapter review: subgroups, cosets and Lagrange [6.1, 6.2] ---- */

/* A draw for ⟨a⟩ in Z_m with g = gcd(a, m) at least 2, a not equal to g, at least 3 elements in ⟨a⟩, and a start b that is larger than g
   and not a multiple of g, so the coset b + ⟨a⟩ is not ⟨a⟩ and b is not its smallest element. m is never 20 (the worked example). */
const cosetDraw = (R, lo, hi, ok, fb) => { for (let i = 0; i < 1000; i++) { const m = R.int(lo, hi), a = R.int(2, m - 1), g = gcd(a, m), b = R.int(1, m - 1);
  if (m !== 20 && g >= 2 && a !== g && m / g >= 3 && b % g !== 0 && b > g && ok(m, a, g, b)) return { m, a, b }; }
 return fb; };

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The ration pack run',
 brief: 'A loader serves the ration store’s lockers at a fixed step round the ring, and Mira wants the size of its run, the number of runs and the top locker of one run.',
 labels: ['|⟨a⟩|', 'number of cosets', 'highest locker in the coset'], tolerance: 0.01,
 gl: [['gcd'], ['|⟨a⟩|'], ['highest locker in the coset']]
}, {
 /* ⟨a⟩ in Z_m with the start b: the coset b + ⟨a⟩ is the labels with remainder r = b mod g, so its highest label is r + g(m ÷ g − 1) = m − g + r.
    The highest label is never b itself. */
 canonical: { m: 30, a: 9, b: 17 },
 draw: R => cosetDraw(R, 14, 50, (m, a, g, b) => b !== m - g + b % g, { m: 30, a: 9, b: 17 }),
 build: ({ m, a, b }) => { const g = gcd(a, m), h = m / g, rep = b % g, top = m - g + rep; return {
  prompt: `The ration store has ${n(m)} lockers numbered 0 to ${n(m - 1)}, and locker numbers are added mod ${n(m)}: the group ${Z(m)}. A pack run starts at locker 0 and keeps moving on ${n(a)} lockers, wrapping past locker ${n(m - 1)} back to 0, until it returns; the lockers it visits form the subgroup ⟨${n(a)}⟩. A run that starts at locker ${n(b)} instead visits the coset ${n(b)} + ⟨${n(a)}⟩. Enter the number of lockers in ⟨${n(a)}⟩, then the number of cosets of ⟨${n(a)}⟩ in ${Z(m)}, then the highest-numbered locker in the coset ${n(b)} + ⟨${n(a)}⟩.`,
  answer: [h, g, top],
  hints: ['The multiples of a mod n are exactly the multiples of gcd(a, n), so ⟨a⟩ = ⟨gcd(a, n)⟩, with n ÷ gcd(a, n) elements. By Lagrange’s theorem the number of cosets is |G| ÷ |H|.', 'The coset b + ⟨g⟩ holds the numbers that leave the same remainder as b on division by g. Its highest member is the largest number below n with that remainder.'],
  solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)}, so ⟨${n(a)}⟩ = ⟨${n(g)}⟩ = ${set(multiples(g, m))}, with ${n(m)} ÷ ${n(g)} = ${n(h)} lockers. By Lagrange’s theorem the number of cosets is ${n(m)} ÷ ${n(h)} = ${n(g)}. ${n(b)} leaves remainder ${n(rep)} on division by ${n(g)}, so the coset ${n(b)} + ⟨${n(a)}⟩ holds every locker from 0 to ${n(m - 1)} that leaves remainder ${n(rep)}: ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on up to ${n(top)}. The highest is ${n(top)}.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)}), the largest whole number that divides both?`, answer: [g], explanation: `${n(g)} divides ${n(a)} and ${n(m)}, and no larger number divides both. So ⟨${n(a)}⟩ = ⟨${n(g)}⟩, and its number of cosets is ${n(g)}.` },
   { prompt: `⟨${n(a)}⟩ = ⟨${n(g)}⟩ holds 0, ${n(g)}, ${n(2 * g)} and so on below ${n(m)}. How many lockers is that?`, answer: [h], explanation: `${n(m)} ÷ ${n(g)} = ${n(h)}. Check with Lagrange: ${n(h)} × ${n(g)} = ${n(m)}.` },
   { prompt: `The coset ${n(b)} + ⟨${n(a)}⟩ holds the lockers that leave the same remainder as ${n(b)} on division by ${n(g)}. What is the highest locker number in it?`, answer: [top], explanation: `${n(b)} leaves remainder ${n(rep)} on division by ${n(g)}, so the coset is ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on. The last one below ${n(m)} is ${n(top)}.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Couriers on the parts ring',
 brief: 'Couriers collect labelled parts in fixed steps round the depot, and the crew needs to know how many parts one collects, how many couriers cover the stock and where one starts.',
 labels: ['parts one courier collects', 'couriers needed', 'smallest label collected'], tolerance: 0.01,
 gl: [['couriers needed'], ['parts one courier collects'], ['smallest label collected']]
}, {
 /* Same structure as q23: the courier from s collects the coset s + ⟨a⟩ of Z_m, and the couriers needed are the cosets. */
 canonical: { m: 42, a: 15, b: 20 },
 draw: R => cosetDraw(R, 24, 72, () => true, { m: 42, a: 15, b: 20 }),
 build: ({ m, a, b }) => { const g = gcd(a, m), h = m / g, rep = b % g; return {
  prompt: `The Sorting Depot labels its parts 0 to ${n(m - 1)}, and labels are added mod ${n(m)}. A courier collects parts by starting at one part and moving on ${n(a)} labels each time, wrapping past ${n(m - 1)} back to 0, and stops when it reaches a part it has already collected. Every courier uses the same step ${n(a)}. The stock is covered when every part has been collected, and each new courier starts at a part that no earlier courier collected. Enter the number of parts one courier collects, then the number of couriers needed to cover the whole stock, then the smallest label among the parts collected by the courier that starts at part ${n(b)}.`,
  answer: [h, g, rep],
  hints: ['The parts a courier collects form a coset of ⟨a⟩ = ⟨gcd(a, n)⟩, which has n ÷ gcd(a, n) elements. Two parts are collected by the same courier exactly when they lie in the same coset.', 'The couriers needed are the number of different cosets: the index, |G| ÷ |H|. The coset of b holds the numbers that leave the same remainder as b on division by gcd(a, n), so its smallest element is that remainder.'],
  solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)}, so a courier collects the parts that differ by multiples of ${n(g)}: ${n(m)} ÷ ${n(g)} = ${n(h)} parts. The cosets are equal batches that cover the stock exactly once, so the number of couriers needed is ${n(m)} ÷ ${n(h)} = ${n(g)}. Part ${n(b)} leaves remainder ${n(rep)} on division by ${n(g)}, so its courier collects ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on, and the smallest label is ${n(rep)}.`,
  guidance: [
   { prompt: `Each courier collects the parts whose labels differ by multiples of gcd(${n(a)}, ${n(m)}). What is gcd(${n(a)}, ${n(m)})? It is also the number of couriers needed.`, answer: [g], explanation: `${n(g)} divides ${n(a)} and ${n(m)}, and no larger number divides both. The batches are ${n(g)} equal cosets, so ${n(g)} couriers cover the stock.` },
   { prompt: `One courier collects every ${ord(g)} label from its start, round the ring of ${n(m)}. How many parts is that?`, answer: [h], explanation: `${n(m)} ÷ ${n(g)} = ${n(h)}. Check with Lagrange: ${n(h)} × ${n(g)} = ${n(m)}.` },
   { prompt: `The courier from part ${n(b)} collects the labels that leave the same remainder as ${n(b)} on division by ${n(g)}. What is the smallest label it collects?`, answer: [rep], explanation: `${n(b)} = ${n(g)} × ${n(Math.floor(b / g))} + ${n(rep)}, so it collects ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on, starting at ${n(rep)}.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q18', title: 'Racks inside a rack',
 brief: 'A big batch is itself split into smaller sub-batches, and the crew wants the sizes and counts for a larger dial.',
 labels: ['|⟨a⟩|', 'subgroups inside ⟨a⟩', 'smallest element of the coset'], tolerance: 0.01,
 gl: [['gcd'], ['|⟨a⟩|'], ['subgroups inside ⟨a⟩'], ['smallest element of the coset']]
}, {
 /* Larger dials (m from 40 to 120). ⟨a⟩ has h = m ÷ gcd(a, m) elements and has at least 4 divisors of h, so it holds at least 4
    subgroups. One subgroup for each divisor of its size (q18). */
 canonical: { m: 72, a: 20, b: 35 },
 draw: R => cosetDraw(R, 40, 120, (m, a, g) => divisors(m / g).length >= 4, { m: 72, a: 20, b: 35 }),
 build: ({ m, a, b }) => { const g = gcd(a, m), h = m / g, rep = b % g, ds = divisors(h); return {
  prompt: `A sorting dial has ${n(m)} positions, 0 to ${n(m - 1)}, added mod ${n(m)}: the group ${Z(m)}. The batch ⟨${n(a)}⟩ is everything reached by adding ${n(a)} again and again, and it is a cyclic group in its own right. A cyclic group has exactly one subgroup for each divisor of its size, and no others. Enter the number of elements of ⟨${n(a)}⟩, then the number of subgroups inside ⟨${n(a)}⟩ (counting the one that holds only 0 and ⟨${n(a)}⟩ itself), then the smallest element of the coset ${n(b)} + ⟨${n(a)}⟩.`,
  answer: [h, ds.length, rep],
  hints: ['The multiples of a mod n are exactly the multiples of gcd(a, n), so ⟨a⟩ = ⟨gcd(a, n)⟩, with n ÷ gcd(a, n) elements.', 'Count the divisors of that size: each one is the size of exactly one subgroup inside. The coset b + ⟨a⟩ holds the numbers that leave the same remainder as b on division by gcd(a, n), so its smallest element is that remainder.'],
  solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)}, so ⟨${n(a)}⟩ = ⟨${n(g)}⟩ = ${set(multiples(g, m))}, with ${n(m)} ÷ ${n(g)} = ${n(h)} elements. ${n(h)} has ${n(ds.length)} divisors: ${list(ds)}. Each is the size of exactly one subgroup inside ⟨${n(a)}⟩, so there are ${n(ds.length)} subgroups. ${n(b)} leaves remainder ${n(rep)} on division by ${n(g)}, so the coset ${n(b)} + ⟨${n(a)}⟩ holds ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on, and its smallest element is ${n(rep)}.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)}), the largest whole number that divides both?`, answer: [g], explanation: `${n(g)} divides ${n(a)} and ${n(m)}, and no larger number divides both. So ⟨${n(a)}⟩ = ⟨${n(g)}⟩.` },
   { prompt: `⟨${n(a)}⟩ = ⟨${n(g)}⟩ holds 0, ${n(g)}, ${n(2 * g)} and so on below ${n(m)}. How many elements is that?`, answer: [h], explanation: `${n(m)} ÷ ${n(g)} = ${n(h)}. Check with Lagrange: ${n(h)} × ${n(g)} = ${n(m)}.` },
   { prompt: `⟨${n(a)}⟩ has ${n(h)} elements, and a cyclic group has one subgroup for each divisor of its size. How many divisors does ${n(h)} have (counting 1 and ${n(h)})?`, answer: [ds.length], explanation: `The divisors of ${n(h)} are ${list(ds)}: ${n(ds.length)} of them, so ⟨${n(a)}⟩ holds ${n(ds.length)} subgroups.` },
   { prompt: `The coset ${n(b)} + ⟨${n(a)}⟩ holds the labels that leave the same remainder as ${n(b)} on division by ${n(g)}. What is its smallest element?`, answer: [rep], explanation: `${n(b)} = ${n(g)} × ${n(Math.floor(b / g))} + ${n(rep)}, so the coset is ${n(rep)}, ${n(rep + g)}, ${n(rep + 2 * g)} and so on, starting at ${n(rep)}.` }
  ] }; }
});

/* ---- q24 Homomorphisms [11.1] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The gearbox between two dials',
 brief: 'A gearbox copies the reading of a small dial onto a larger one, and the crew must check that both ways of writing one position give the same output.',
 labels: ['φ(x)', 'φ(x + m)', 'well defined (1 or 0)'], tolerance: 0.01,
 gl: [['φ(x)'], ['φ(x + m)'], ['well defined (1 or 0)']]
}, {
 /* The reading x and x + m are the same position of the first dial. Half the draws are well defined (t divides km) and half are not.
    m from 5 to 14 (never 4, the dial of the worked example), t from 4 to 16. Whether kx and k(x + m) agree does not depend on x. */
 canonical: { m: 7, t: 10, k: 4, x: 3 },
 draw: R => { const want = R.bool();
  for (let i = 0; i < 1000; i++) { const m = R.int(5, 14), t = R.int(4, 16), k = R.int(2, t - 1), x = R.int(1, m - 1);
   if (t !== m && ((k * m) % t === 0) === want) return { m, t, k, x }; }
  return { m: 7, t: 10, k: 4, x: 3 }; },
 build: ({ m, t, k, x }) => { const x2 = x + m, f1 = k * x % t, f2 = k * x2 % t, km = k * m, wd = km % t === 0 ? 1 : 0;
  const end = wd
   ? `The outputs agree. ${n(k)} × ${n(m)} = ${n(km)} is a multiple of ${n(t)}, so adding ${n(m)} to a reading never changes the output: φ is well defined, and it is a homomorphism. Enter 1.`
   : `The outputs differ. ${n(k)} × ${n(m)} = ${n(km)} is not a multiple of ${n(t)}, so adding ${n(m)} to a reading changes the output: φ is not well defined. Enter 0.`;
  return {
  prompt: `A gearbox in the Relay Exchange copies readings from ${an(m)} ${n(m)}-position dial, ${Z(m)}, to ${an(t)} ${n(t)}-position dial, ${Z(t)}, by the rule φ(x) = ${n(k)}x mod ${n(t)}. On the first dial the readings x and x + ${n(m)} are the same position, so a gearbox that works must give both the same output; the rule is well defined when it always does, and then it is a homomorphism. Enter φ(${n(x)}), then φ(${n(x2)}), then 1 if φ is well defined and 0 if it is not.`,
  answer: [f1, f2, wd],
  hints: ['Multiply the reading by k and keep the remainder mod the size of the second dial. Do it once for each of the two readings.', 'The two readings give outputs k × x and k × (x + m) = k × x + k × m, which differ by k × m. They always agree exactly when k × m is a multiple of the size of the second dial.'],
  solution: `φ(${n(x)}) = ${n(k)} × ${n(x)} mod ${n(t)} = ${n(k * x)} mod ${n(t)} = ${n(f1)}, and φ(${n(x2)}) = ${n(k)} × ${n(x2)} mod ${n(t)} = ${n(k * x2)} mod ${n(t)} = ${n(f2)}. ${end}`,
  guidance: [
   { prompt: `What is φ(${n(x)}) = ${n(k)} × ${n(x)} mod ${n(t)}?`, answer: [f1], explanation: `${n(k)} × ${n(x)} = ${n(k * x)}, which leaves ${n(f1)} on division by ${n(t)}.` },
   { prompt: `What is φ(${n(x2)}) = ${n(k)} × ${n(x2)} mod ${n(t)}?`, answer: [f2], explanation: `${n(k)} × ${n(x2)} = ${n(k * x2)}, which leaves ${n(f2)} on division by ${n(t)}.` },
   { prompt: `Is ${n(k)} × ${n(m)} a multiple of ${n(t)}? Enter 1 if φ is well defined and 0 if it is not.`, answer: [wd], explanation: end }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Three nudges on the master dial',
 brief: 'A master dial is nudged three times in a row, and the slave dial it drives has to show the matching reading.',
 labels: ['master reading', 'slave reading'], tolerance: 0.01,
 gl: [['master reading'], ['slave reading'], ['sum of the three outputs']]
}, {
 /* t divides km, so φ is well defined. The three nudges add up to at least m, so the master dial wraps round, and the master
    reading and the slave reading are both above 0. */
 canonical: { m: 8, t: 12, k: 3, u: 5, v: 6, w: 7 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(6, 16), t = R.int(4, 18), k = R.int(2, t - 1), u = R.int(1, m - 1), v = R.int(1, m - 1), w = R.int(1, m - 1), tot = (u + v + w) % m;
   if (t !== m && (k * m) % t === 0 && u + v + w >= m && tot !== 0 && (k * tot) % t !== 0) return { m, t, k, u, v, w }; }
  return { m: 8, t: 12, k: 3, u: 5, v: 6, w: 7 }; },
 build: ({ m, t, k, u, v, w }) => { const raw = u + v + w, tot = raw % m, out = k * tot % t, fu = k * u % t, fv = k * v % t, fw = k * w % t, chk = (fu + fv + fw) % t; return {
  prompt: `At the Relay Exchange a master dial with ${n(m)} positions, ${Z(m)}, drives a slave dial with ${n(t)} positions, ${Z(t)}, by the rule φ(x) = ${n(k)}x mod ${n(t)}: the slave shows φ of the master’s reading. Here ${n(k)} × ${n(m)} is a multiple of ${n(t)}, so φ is well defined and keeps sums. The master starts at 0 and is nudged on by ${n(u)}, then by ${n(v)}, then by ${n(w)} position${w === 1 ? '' : 's'}, wrapping round past ${n(m - 1)} back to 0. Enter the master’s reading after the three nudges, then the slave’s reading.`,
  answer: [tot, out],
  hints: ['Add the three nudges on the master dial and wrap round: keep the remainder on division by the number of positions of the master dial.', 'The slave shows the rule applied to the master’s final reading: multiply by k and keep the remainder mod the size of the slave dial. Because φ keeps sums, adding the three separate outputs on the slave dial gives the same reading, which is a check.'],
  solution: `The master reaches ${n(u)} + ${n(v)} + ${n(w)} = ${n(raw)}, which is ${n(tot)} mod ${n(m)}. The slave shows φ(${n(tot)}) = ${n(k)} × ${n(tot)} mod ${n(t)} = ${n(k * tot)} mod ${n(t)} = ${n(out)}. Check: φ(${n(u)}) + φ(${n(v)}) + φ(${n(w)}) = ${n(fu)} + ${n(fv)} + ${n(fw)} = ${n(fu + fv + fw)}, which is ${n(chk)} mod ${n(t)}, the same reading.`,
  guidance: [
   { prompt: `Add the nudges on the master dial: what is ${n(u)} + ${n(v)} + ${n(w)} mod ${n(m)}?`, answer: [tot], explanation: `${n(u)} + ${n(v)} + ${n(w)} = ${n(raw)}, which leaves ${n(tot)} on division by ${n(m)}.` },
   { prompt: `The slave shows φ of the master’s reading ${n(tot)}. What is ${n(k)} × ${n(tot)} mod ${n(t)}?`, answer: [out], explanation: `${n(k)} × ${n(tot)} = ${n(k * tot)}, which leaves ${n(out)} on division by ${n(t)}.` },
   { prompt: `As a check, map each nudge separately and add on the slave dial: what is φ(${n(u)}) + φ(${n(v)}) + φ(${n(w)}) mod ${n(t)}?`, answer: [chk], explanation: `φ(${n(u)}) = ${n(fu)}, φ(${n(v)}) = ${n(fv)} and φ(${n(w)}) = ${n(fw)}; their sum ${n(fu + fv + fw)} leaves ${n(chk)} on division by ${n(t)}, the same as the slave’s reading.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q07', title: 'Orders through the gearbox',
 brief: 'The crew wants to know how many turns bring a reading home on each side of a gearbox, so that a long test run can be planned.',
 labels: ['φ(a)', 'order of a in the first dial', 'order of φ(a) in the second dial'], tolerance: 0.01,
 gl: [['φ(a)'], ['order of a'], ['order of φ(a)']]
}, {
 /* t divides km, so φ is well defined. φ(a) is not 0, and its order is a proper divisor of the order of a, at least 2. m from 12 to 40,
    t from 6 to 30, never m = 4 (the worked example). The order of x in Z_n is n ÷ gcd(x, n). */
 canonical: { m: 24, t: 18, k: 3, a: 10 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(12, 40), t = R.int(6, 30), k = R.int(2, t - 1), a = R.int(2, m - 1), fa = k * a % t;
   if (t !== m && (k * m) % t === 0 && fa !== 0) { const o1 = m / gcd(a, m), o2 = t / gcd(fa, t); if (o2 >= 2 && o2 < o1) return { m, t, k, a }; } }
  return { m: 24, t: 18, k: 3, a: 10 }; },
 build: ({ m, t, k, a }) => { const fa = k * a % t, g1 = gcd(a, m), o1 = m / g1, g2 = gcd(fa, t), o2 = t / g2; return {
  prompt: `A gearbox maps the ${n(m)}-position dial ${Z(m)} to the ${n(t)}-position dial ${Z(t)} by φ(x) = ${n(k)}x mod ${n(t)}. Because ${n(k)} × ${n(m)} is a multiple of ${n(t)}, φ is well defined, so it is a homomorphism. The order of x in ${Z(m)} is the number of times you add x to get back to 0, which is ${n(m)} ÷ gcd(x, ${n(m)}); in ${Z(t)} it is ${n(t)} ÷ gcd(x, ${n(t)}). Enter φ(${n(a)}), then the order of ${n(a)} in ${Z(m)}, then the order of φ(${n(a)}) in ${Z(t)}.`,
  answer: [fa, o1, o2],
  hints: ['Multiply the reading by k and keep the remainder mod the size of the second dial. Then find each gcd by listing the largest number that divides both.', 'A homomorphism sends an element of order d to an element whose order divides d. Use it to check that your second order divides the first.'],
  solution: `φ(${n(a)}) = ${n(k)} × ${n(a)} mod ${n(t)} = ${n(k * a)} mod ${n(t)} = ${n(fa)}. In ${Z(m)}, gcd(${n(a)}, ${n(m)}) = ${n(g1)}, so the order of ${n(a)} is ${n(m)} ÷ ${n(g1)} = ${n(o1)}. In ${Z(t)}, gcd(${n(fa)}, ${n(t)}) = ${n(g2)}, so the order of ${n(fa)} is ${n(t)} ÷ ${n(g2)} = ${n(o2)}, and ${n(o2)} divides ${n(o1)}, as it must.`,
  guidance: [
   { prompt: `What is φ(${n(a)}) = ${n(k)} × ${n(a)} mod ${n(t)}?`, answer: [fa], explanation: `${n(k)} × ${n(a)} = ${n(k * a)}, which leaves ${n(fa)} on division by ${n(t)}.` },
   { prompt: `What is the order of ${n(a)} in ${Z(m)}: ${n(m)} ÷ gcd(${n(a)}, ${n(m)})?`, answer: [o1], explanation: `gcd(${n(a)}, ${n(m)}) = ${n(g1)}, so the order is ${n(m)} ÷ ${n(g1)} = ${n(o1)}.` },
   { prompt: `What is the order of ${n(fa)} in ${Z(t)}: ${n(t)} ÷ gcd(${n(fa)}, ${n(t)})?`, answer: [o2], explanation: `gcd(${n(fa)}, ${n(t)}) = ${n(g2)}, so the order is ${n(t)} ÷ ${n(g2)} = ${n(o2)}, and ${n(o2)} divides ${n(o1)}.` }
  ] }; }
});

/* ---- q25 Kernel and image [11.1] ---- */

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'Which switches light lamp y',
 brief: 'A coupling sends each of a board’s switch positions to another lamp, and the crew wants to know how many lamps can be lit and how many switches light one chosen lamp.',
 labels: ['number of different outputs', 'readings that give the output'], tolerance: 0.01,
 gl: [['gcd(k, m)'], ['number of different outputs'], ['readings that give the output']]
}, {
 /* x ↦ kx mod m on Z_m with g = gcd(k, m) from 2 to m ÷ 2. y is a non-zero multiple of g, so it is in the image. Every output in the image
    comes from g readings, the size of the kernel. Not the worked example (8x on Z₁₂). */
 canonical: { m: 24, k: 9, y: 15 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(8, 40), k = R.int(2, m - 1), g = gcd(k, m);
   if (!(m === 12 && k === 8) && g >= 2 && 2 * g <= m) return { m, k, y: g * R.int(1, m / g - 1) }; }
  return { m: 24, k: 9, y: 15 }; },
 build: ({ m, k, y }) => { const g = gcd(k, m), st = m / g, xs = []; for (let x = 0; x < m; x++) if (k * x % m === y) xs.push(x); return {
  prompt: `A coupling in the Relay Exchange links a switch board of ${n(m)} positions, ${Z(m)}, to a lamp board of ${n(m)} lamps by φ(x) = ${n(k)}x mod ${n(m)}: switch position x lights lamp φ(x). The rule is a homomorphism. Enter the number of different lamps that some switch position can light, then the number of switch positions x from 0 to ${n(m - 1)} that light lamp ${n(y)}.`,
  answer: [st, xs.length],
  hints: ['The lamps that can be lit are exactly the multiples of gcd(k, n) below n. Count them.', 'Every lamp that can be lit is lit by the same number of switch positions: as many as light lamp 0, which is the size of the kernel. kx mod n is 0 exactly when x is a multiple of n ÷ gcd(k, n).'],
  solution: `gcd(${n(k)}, ${n(m)}) = ${n(g)}. The lamps that can be lit are the multiples of ${n(g)}: the image is ${set(multiples(g, m))}, with ${n(m)} ÷ ${n(g)} = ${n(st)} lamps. ${n(y)} is a multiple of ${n(g)}, so it can be lit. The kernel, the positions that light lamp 0, is ${set(multiples(st, m))}, with ${n(g)} positions, and every lamp in the image is lit by that many positions. Checking: ${list(xs)} are the positions x with ${n(k)}x mod ${n(m)} = ${n(y)}, ${n(xs.length)} of them.`,
  guidance: [
   { prompt: `What is gcd(${n(k)}, ${n(m)}), the largest whole number that divides both?`, answer: [g], explanation: `${n(g)} divides ${n(k)} and ${n(m)}, and no larger number divides both. The lamps that can be lit are the multiples of ${n(g)}.` },
   { prompt: `The lamps that can be lit are the multiples of ${n(g)} from 0 to ${n(m - 1)}. How many are there?`, answer: [st], explanation: `${n(m)} ÷ ${n(g)} = ${n(st)} lamps.` },
   { prompt: `List the switch positions x from 0 to ${n(m - 1)} with ${n(k)}x mod ${n(m)} = ${n(y)}. How many are there?`, answer: [xs.length], explanation: `They are ${list(xs)}: ${n(xs.length)} positions. That is the size of the kernel, ${n(g)}, as it is for every lamp that can be lit.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'The dark lamps on the signal board',
 brief: 'A signal board lights one lamp for every switch, and the crew wants to know how many switches light the home lamp and how many lamps can never be lit.',
 labels: ['switches that light lamp 0', 'lamps that cannot be lit'], tolerance: 0.01,
 gl: [['switches that light lamp 0'], ['lamps that can be lit'], ['lamps that cannot be lit']]
}, {
 /* x ↦ kx mod m with g = gcd(k, m) from 2 to m ÷ 2, so at least 2 lamps can never be lit. The kernel has g elements and the image m ÷ g,
    so m − m ÷ g lamps stay dark. */
 canonical: { m: 28, k: 8 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(10, 45), k = R.int(2, m - 1), g = gcd(k, m); if (m !== 12 && g >= 2 && 2 * g <= m) return { m, k }; }
  return { m: 28, k: 8 }; },
 build: ({ m, k }) => { const g = gcd(k, m), st = m / g, dark = m - st; return {
  prompt: `A signal board has ${n(m)} lamps numbered 0 to ${n(m - 1)}, and lamp numbers are added mod ${n(m)}: ${Z(m)}. Each lamp has a switch: switching lamp x lights lamp ${n(k)}x mod ${n(m)}, and this rule is a homomorphism. Enter the number of lamps x whose switch lights lamp 0, then the number of lamps that no switch can light.`,
  answer: [g, dark],
  hints: ['The switches that light lamp 0 are the kernel: kx mod n is 0 exactly when x is a multiple of n ÷ gcd(k, n). Count those multiples from 0 to n − 1.', 'The lamps that can be lit are the image: the multiples of gcd(k, n) below n. The lamps that cannot be lit are all the others: n minus the size of the image.'],
  solution: `gcd(${n(k)}, ${n(m)}) = ${n(g)}. ${n(k)}x mod ${n(m)} is 0 exactly when x is a multiple of ${n(m)} ÷ ${n(g)} = ${n(st)}, so the kernel is ${set(multiples(st, m))}: ${n(g)} switches light lamp 0. The lamps that can be lit are the multiples of ${n(g)}, ${n(st)} of them. That leaves ${n(m)} − ${n(st)} = ${n(dark)} lamps that no switch can light.`,
  guidance: [
   { prompt: `What is the number of switches x from 0 to ${n(m - 1)} with ${n(k)}x mod ${n(m)} = 0? (It equals gcd(${n(k)}, ${n(m)}).)`, answer: [g], explanation: `${n(k)}x mod ${n(m)} is 0 exactly when x is a multiple of ${n(m)} ÷ ${n(g)} = ${n(st)}, and there are ${n(g)} such multiples from 0 to ${n(m - 1)}: ${set(multiples(st, m))}.` },
   { prompt: `The lamps that can be lit are the multiples of ${n(g)} from 0 to ${n(m - 1)}. How many are there?`, answer: [st], explanation: `${n(m)} ÷ ${n(g)} = ${n(st)}, and ${n(g)} × ${n(st)} = ${n(m)}.` },
   { prompt: `Out of ${n(m)} lamps, ${n(st)} can be lit. How many cannot?`, answer: [dark], explanation: `${n(m)} − ${n(st)} = ${n(dark)} lamps stay dark.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24', title: 'A kernel between two dials',
 brief: 'A coupling joins two dials of different sizes, and the crew needs the kernel and image sizes before wiring the test rig.',
 labels: ['elements of the kernel', 'elements of the image'], tolerance: 0.01,
 gl: [['smallest x that goes to 0'], ['elements of the kernel'], ['elements of the image']]
}, {
 /* φ(x) = kx mod t from Z_m to Z_t, well defined because t divides km, which holds exactly when s = t ÷ gcd(k, t) divides m.
    The kernel is the multiples of s below m (m ÷ s of them) and the image is the multiples of gcd(k, t) below t (s of them). s is at least 2,
    m ÷ s is at least 2, and t is not m, so this is not the one-dial case of q25. */
 canonical: { m: 36, t: 24, k: 10 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(12, 48), t = R.int(6, 40), k = R.int(2, t - 1), s = t / gcd(k, t);
   if (t !== m && s >= 2 && m % s === 0 && m / s >= 2) return { m, t, k }; }
  return { m: 36, t: 24, k: 10 }; },
 build: ({ m, t, k }) => { const g = gcd(k, t), s = t / g, ker = m / s; return {
  prompt: `A coupling joins the ${n(m)}-position dial ${Z(m)} to the ${n(t)}-position dial ${Z(t)} by φ(x) = ${n(k)}x mod ${n(t)}. Because ${n(k)} × ${n(m)} is a multiple of ${n(t)}, φ is well defined, so it is a homomorphism. Enter the number of elements of the kernel of φ (the readings x from 0 to ${n(m - 1)} that go to 0), then the number of elements of the image of φ (the different outputs, as x runs through 0 to ${n(m - 1)}).`,
  answer: [ker, s],
  hints: ['kx mod t is 0 exactly when x is a multiple of t ÷ gcd(k, t). Count those multiples from 0 to m − 1 to get the kernel.', 'The outputs are exactly the multiples of gcd(k, t) below t. As a check, the kernel size times the image size is the size of the first dial.'],
  solution: `gcd(${n(k)}, ${n(t)}) = ${n(g)}. ${n(k)}x mod ${n(t)} is 0 exactly when x is a multiple of ${n(t)} ÷ ${n(g)} = ${n(s)}, so the kernel is ${set(multiples(s, m))}, with ${n(m)} ÷ ${n(s)} = ${n(ker)} elements. The outputs are the multiples of ${n(g)} below ${n(t)}: the image is ${set(multiples(g, t))}, with ${n(t)} ÷ ${n(g)} = ${n(s)} elements. Check: ${n(ker)} × ${n(s)} = ${n(m)}.`,
  guidance: [
   { prompt: `What is the smallest reading x, 1 or more, with ${n(k)}x mod ${n(t)} = 0?`, answer: [s], explanation: `gcd(${n(k)}, ${n(t)}) = ${n(g)}, and ${n(k)} × ${n(s)} = ${n(k * s)} is a multiple of ${n(t)}, while no smaller x works. That smallest x is ${n(t)} ÷ ${n(g)} = ${n(s)}.` },
   { prompt: `The kernel is every multiple of ${n(s)} from 0 to ${n(m - 1)}. How many elements does it have?`, answer: [ker], explanation: `The kernel is ${set(multiples(s, m))}: ${n(m)} ÷ ${n(s)} = ${n(ker)} elements.` },
   { prompt: `The image is every multiple of ${n(g)} from 0 to ${n(t - 1)}. How many elements does it have?`, answer: [s], explanation: `The image is ${set(multiples(g, t))}: ${n(t)} ÷ ${n(g)} = ${n(s)} elements, and ${n(ker)} × ${n(s)} = ${n(m)}.` }
  ] }; }
});

})();
