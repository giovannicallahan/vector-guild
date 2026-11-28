/* Number theory: the hidden life of whole numbers practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p5.js. */
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

/* ---- helpers (the same ideas as gen-c.js) ---- */
/* Superscript digits for exponents: sup(34) is '³⁴'. pw(2, 3) is '2³', pw(5, 1) is '5'. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const pw = (p, a) => a === 1 ? n(p) : `${n(p)}${sup(a)}`;
/* Prime factorisation as a list of [prime, exponent], smallest prime first; fac() writes it as '2³ × 3² × 5'. */
const factor = x => { const out = []; for (let p = 2; p * p <= x; p++) { let a = 0; while (x % p === 0) { x /= p; a++; } if (a) out.push([p, a]); } if (x > 1) out.push([x, 1]); return out; };
const fac = f => f.map(([p, a]) => pw(p, a)).join(' × ');
const ipow = (p, a) => { let v = 1; for (let i = 0; i < a; i++) v *= p; return v; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* φ of one prime power, as a value and as working: 'φ(2³) = 8 − 4 = 4', 'φ(5) = 5 − 1 = 4'. */
const phiPP = (p, a) => ipow(p, a) - ipow(p, a - 1);
const phiPPText = (p, a) => a === 1 ? `φ(${n(p)}) = ${n(p)} − 1 = ${n(p - 1)}` : `φ(${pw(p, a)}) = ${n(ipow(p, a))} − ${n(ipow(p, a - 1))} = ${n(phiPP(p, a))}`;
const phi = x => factor(x).reduce((s, [p, a]) => s * phiPP(p, a), 1);
/* 'N = 2² × 3, so φ(N) = 2 × 2 = 4' (one prime power: 'N = 2³, so φ(2³) = 8 − 4 = 4'; a prime: 'N is prime, so φ(N) = N − 1 = …'). */
const phiWork = x => { const f = factor(x), v = phi(x);
 if (f.length === 1 && f[0][1] === 1) return `${n(x)} is prime, so φ(${n(x)}) = ${n(x)} − 1 = ${n(v)}`;
 if (f.length === 1) return `${n(x)} = ${fac(f)}, so ${phiPPText(f[0][0], f[0][1])}`;
 return `${n(x)} = ${fac(f)}, so φ(${n(x)}) = ${f.map(([p, a]) => n(phiPP(p, a))).join(' × ')} = ${n(v)}`; };
/* Repeated squaring of a mod m for an exponent r ≥ 2: the squares, then how the powers of 2 in r combine. */
const red = (w, m) => w < m ? n(w) : `${n(w)} ≡ ${n(w % m)}`;
const squaring = (a, r, m) => {
 const sq = [], vals = { 1: a % m }; let e = 1, v = a % m;
 while (2 * e <= r) { const w = v * v; e *= 2; v = w % m; vals[e] = v; sq.push(e === 2 ? `${n(a)}² = ${red(a * a, m)}` : `${n(a)}${sup(e)} ≡ ${n(vals[e / 2])}² = ${red(vals[e / 2] * vals[e / 2], m)}`); }
 const parts = []; let rest = r; for (let p = e; p >= 1; p /= 2) if (rest >= p) { parts.push(p); rest -= p; }
 let text = `${sq.join(', ')}. `, acc = vals[parts[0]];
 if (parts.length === 1) text += `${n(r)} is itself a power of 2, so ${n(a)}${sup(r)} ≡ ${n(acc)}.`;
 else {
  const steps = [];
  for (let i = 1; i < parts.length; i++) { const w = acc * vals[parts[i]]; steps.push(`${n(acc)} × ${n(vals[parts[i]])} = ${red(w, m)}`); acc = w % m; }
  text += `${n(r)} = ${parts.map(n).join(' + ')}, so ${n(a)}${sup(r)} ≡ ${parts.map(p => p === 1 ? n(a) : `${n(a)}${sup(p)}`).join(' × ')}: ${steps.join(', then ')}.`;
 }
 return { text, value: acc };
};
/* Every draw retries at most 1000 times, then falls back to a known-good parameter set (the canonical one). */
const retry = (make, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (p) return p; } return fallback; };
const two = v => v < 10 ? `0${v}` : String(v);
const three = v => v < 10 ? `00${v}` : v < 100 ? `0${v}` : String(v);
const isPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
/* Primes from 11 to 199. */
const PR = []; for (let x = 11; x < 200; x++) if (isPrime(x)) PR.push(x);
/* Numbers r, r + m, r + 2m, … (starting at `start`, stepping by `step`), up to and including the first that leaves remainder rem mod mod. */
const climb = (start, step, mod, rem) => { const list = []; let x = start; for (let i = 0; i < 1000; i++) { list.push(x); if (x % mod === rem) break; x += step; } return list; };
const lst = list => list.map(n).join(', ');
/* The smallest positive x with x ≡ r1 (mod m1) and x ≡ r2 (mod m2), as the list that finds it (m1, m2 coprime). */
const crtList = (m1, r1, m2, r2) => climb(r2 > 0 ? r2 : m2, m2, m1, r1);
const last = list => list[list.length - 1];
const COPRIME100 = [3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49, 51, 53, 57, 59, 61, 63, 67, 69, 71, 73, 77, 79, 81, 83, 87, 89, 91, 93, 97, 99];
const coprime1000 = x => x % 2 !== 0 && x % 5 !== 0;
/* The square-free divisors of a factorisation f, smallest first, each with its number of primes. */
const sqfreeDivs = f => { let list = [{ d: 1, k: 0 }]; f.forEach(([p]) => { list = list.concat(list.map(e => ({ d: e.d * p, k: e.k + 1 }))); }); return list.sort((x, y) => x.d - y.d); };
/* The y in 1 … p − 1 with −c × y ≡ target (mod p), as the list p − target, p − target + p, … that ends at the first number divisible by c. */
const negSolve = (c, target, p) => { const T = p - target, list = []; for (let k = 0; k < c; k++) { list.push(T + k * p); if ((T + k * p) % c === 0) return { T, list, s: T + k * p, y: (T + k * p) / c }; } return { T, list, s: 0, y: 0 }; };

/* ---- q21 Euler's φ-function [R3.2, R4.2] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'Safe sockets on the patch panel',
 brief: 'The patch panel has a long row of numbered sockets, and only some of them are safe for the new cable.',
 labels: ['φ(n)', 'sockets not safe'], tolerance: 0.01,
 gl: [['φ of first power', 'φ of second power'], ['safe sockets', 'sockets not safe']]
}, {
 /* N = pᵃ × qᵇ with two different primes up to 23 and 100 ≤ N ≤ 1000. */
 canonical: { N: 675 },
 draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13, 17, 19, 23], i = R.int(0, P.length - 2), j = R.int(i + 1, P.length - 1),
  N = ipow(P[i], R.int(1, 5)) * ipow(P[j], R.int(1, 3)); return N < 100 || N > 1000 ? null : { N }; }, { N: 675 }),
 build: ({ N }) => { const f = factor(N), v = f.map(([p, a]) => phiPP(p, a)), F = phi(N), terms = f.map(([p, a]) => phiPPText(p, a)).join('; '); return {
  prompt: `The Signal Office’s patch panel has sockets numbered 1 to ${n(N)}, and ${n(N)} = ${fac(f)}. A cable fits socket s safely only when s is coprime to ${n(N)}: s shares no prime factor with ${n(N)}. Enter φ(${n(N)}), the number of safe sockets, then the number of sockets from 1 to ${n(N)} that are not safe.`,
  answer: [F, N - F],
  hints: ['Take the two prime powers one at a time. In a prime power pᵃ one number in every p is a multiple of p, so φ(pᵃ) is pᵃ with that share taken away: pᵃ − pᵃ⁻¹.', 'The two prime powers belong to different primes, so φ of the whole number is the product of the two φ values. The sockets that are not safe are all the others.'],
  solution: `${n(N)} = ${fac(f)}. ${terms}. The two prime powers belong to different primes, so φ(${n(N)}) = ${v.map(n).join(' × ')} = ${n(F)} safe sockets. The other ${n(N)} − ${n(F)} = ${n(N - F)} sockets share a prime factor with ${n(N)}, so they are not safe.`,
  guidance: [
   { prompt: `Work out φ of each of the two prime powers in ${fac(f)}, in that order.`, answer: v, explanation: `${terms}. Each count leaves out the multiples of its own prime.` },
   { prompt: `Multiply the two values to get φ(${n(N)}), then subtract it from ${n(N)}. How many sockets are safe, and how many are not?`, answer: [F, N - F], explanation: `${v.map(n).join(' × ')} = ${n(F)} safe sockets, and ${n(N)} − ${n(F)} = ${n(N - F)} sockets are not safe.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Joining two channels',
 brief: 'The office is joining two channels into one, and the clean codes of the joined channel must be counted before the switch.',
 labels: ['φ of channel A', 'φ of channel B', 'φ of joined channel', 'codes not clean'], tolerance: 0.01,
 gl: [['φ of channel A', 'φ of channel B'], ['φ of joined channel'], ['codes not clean']]
}, {
 /* M and K are built from disjoint sets of the primes 2 to 13 (so they share no prime factor), 4 ≤ M < K and 100 ≤ M × K ≤ 1000. Not the lesson's 60. */
 canonical: { M: 24, K: 35 },
 draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13], A = P.filter(() => R.bool()), B = P.filter(p => !A.includes(p)).filter(() => R.bool());
  if (!A.length || !B.length) return null;
  const a = A.reduce((s, p) => s * ipow(p, R.int(1, 3)), 1), b = B.reduce((s, p) => s * ipow(p, R.int(1, 3)), 1), M = Math.min(a, b), K = Math.max(a, b);
  return M < 4 || M * K < 100 || M * K > 1000 ? null : { M, K }; }, { M: 24, K: 35 }),
 build: ({ M, K }) => { const N = M * K, fM = phi(M), fK = phi(K), F = phi(N); return {
  prompt: `The Signal Office is joining two channels into one. Channel A has the codes 1 to ${n(M)}, channel B has the codes 1 to ${n(K)}, and ${n(M)} and ${n(K)} share no prime factor. The joined channel has the codes 1 to ${n(M)} × ${n(K)} = ${n(N)}, and a code is clean when it is coprime to its channel’s size. Enter φ(${n(M)}), then φ(${n(K)}), then φ(${n(N)}), then the number of codes on the joined channel that are not clean.`,
  answer: [fM, fK, F, N - F],
  hints: ['Write each channel size as a product of prime powers. φ of a prime power is pᵃ − pᵃ⁻¹, and φ of the size is the product of those values.', 'The two channel sizes share no prime factor, so φ of their product is the product of their two φ values: the big number need not be factorised again. The codes that are not clean are all the others.'],
  solution: `${phiWork(M)}. ${phiWork(K)}. ${n(M)} and ${n(K)} share no prime factor, so φ(${n(N)}) = φ(${n(M)}) × φ(${n(K)}) = ${n(fM)} × ${n(fK)} = ${n(F)}. That leaves ${n(N)} − ${n(F)} = ${n(N - F)} codes on the joined channel that are not clean.`,
  guidance: [
   { prompt: `Factorise ${n(M)} and ${n(K)}, and work out φ of each. What are φ(${n(M)}) and φ(${n(K)})?`, answer: [fM, fK], explanation: `${phiWork(M)}; ${phiWork(K)}.` },
   { prompt: `${n(M)} and ${n(K)} share no prime factor. What is φ(${n(N)})?`, answer: [F], explanation: `φ multiplies across numbers with no common prime factor: ${n(fM)} × ${n(fK)} = ${n(F)}.` },
   { prompt: `How many of the codes 1 to ${n(N)} are not clean?`, answer: [N - F], explanation: `${n(N)} − ${n(F)} = ${n(N - F)}. These are the codes that share a prime factor with ${n(N)}.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q04', title: 'A channel with no factorisation',
 brief: 'The long-range channel is labelled with a single large number, and the office must count its clean codes without a factorisation to hand.',
 labels: ['φ(n)', 'codes not clean'], tolerance: 0.01,
 gl: [['exponent of 2', 'exponent of 3', 'exponent of 5', 'exponent of 7'], ['φ(n)'], ['codes not clean']]
}, {
 /* N = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ from 1000 to 9999 with at least three of the four primes present. */
 canonical: { a: 3, b: 2, c: 1, d: 1 },
 draw: R => retry(() => { const p = { a: R.int(0, 6), b: R.int(0, 4), c: R.int(0, 3), d: R.int(0, 3) }, N = ipow(2, p.a) * ipow(3, p.b) * ipow(5, p.c) * ipow(7, p.d),
  count = [p.a, p.b, p.c, p.d].filter(e => e > 0).length; return N < 1000 || N > 9999 || count < 3 ? null : p; }, { a: 3, b: 2, c: 1, d: 1 }),
 build: ({ a, b, c, d }) => { const N = ipow(2, a) * ipow(3, b) * ipow(5, c) * ipow(7, d), f = factor(N), v = f.map(([p, e]) => phiPP(p, e)), F = phi(N), terms = f.map(([p, e]) => phiPPText(p, e)).join('; '); return {
  prompt: `A long-range channel at the Signal Office numbers its codes 1 to ${n(N)}, and ${n(N)} has no prime factor above 7. A code is clean when it is coprime to ${n(N)}. Enter φ(${n(N)}), the number of clean codes, then the number of codes that are not clean. Type both answers without commas.`,
  answer: [F, N - F],
  hints: ['Find the prime factorisation first: divide by 2 as many times as you can, then by 3, then by 5, then by 7, and count how many times each one divides.', 'Then φ(pᵃ) = pᵃ − pᵃ⁻¹ for each prime power, and φ of the whole number is the product of those values. The codes that are not clean are the rest of them.'],
  solution: `Dividing out the primes in turn gives ${n(N)} = ${fac(f)}. ${terms}. These prime powers belong to different primes, so φ(${n(N)}) = ${v.map(n).join(' × ')} = ${n(F)}. The other ${n(N)} − ${n(F)} = ${n(N - F)} codes share a prime factor with ${n(N)}, so they are not clean.`,
  guidance: [
   { prompt: `Divide ${n(N)} by 2, 3, 5 and 7 as often as you can. What are the exponents of 2, 3, 5 and 7?`, answer: [a, b, c, d], explanation: `${n(N)} = ${fac(f)}, so the exponents are ${n(a)}, ${n(b)}, ${n(c)} and ${n(d)}. A prime that does not divide the number has exponent 0.` },
   { prompt: `Work out φ of each prime power and multiply. What is φ(${n(N)})?`, answer: [F], explanation: `${terms}. Then ${v.map(n).join(' × ')} = ${n(F)}.` },
   { prompt: `How many of the codes 1 to ${n(N)} are not clean?`, answer: [N - F], explanation: `${n(N)} − ${n(F)} = ${n(N - F)} codes share a prime factor with ${n(N)}.` }
  ] }; }
});

/* ---- q22 Euler's theorem: last two digits [R3.5] ---- */

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The seal on every message',
 brief: 'Every outgoing message is stamped with a short seal taken from a huge power, and the stamp machine only has room for a small number.',
 labels: ['φ(n)', 'r', 'seal'], tolerance: 0.01,
 gl: [['φ(n)'], ['r'], ['seal']]
}, {
 /* M from a list of sizes with φ(M) between 8 and 24, a coprime to M with 3 ≤ a < M, K from 100 to 9999 with K mod φ(M) at least 2 and a seal other than 1. */
 canonical: { M: 36, a: 7, K: 2025 },
 draw: R => retry(() => { const M = R.pick([20, 24, 28, 30, 36, 40, 44, 45, 48, 50, 52, 60]), a = R.int(3, M - 1), K = R.int(100, 9999), F = phi(M);
  if (gcd(a, M) !== 1 || K % F < 2) return null; return squaring(a, K % F, M).value === 1 ? null : { M, a, K }; }, { M: 36, a: 7, K: 2025 }),
 build: ({ M, a, K }) => { const F = phi(M), r = K % F, Q = (K - r) / F, S = squaring(a, r, M), v = S.value; return {
  prompt: `Every outgoing message at the Signal Office is stamped with a seal: the remainder of ${n(a)}${sup(K)} on division by ${n(M)}. ${n(a)} and ${n(M)} are coprime. Enter φ(${n(M)}), then r, the remainder of ${n(K)} on division by φ(${n(M)}), then the seal as a number from 0 to ${n(M - 1)}.`,
  answer: [F, r, v],
  hints: ['Euler’s theorem: when a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n. Find φ(n) from the prime factorisation of n, then drop every whole block of φ(n) from the exponent.', 'Write r as a sum of powers of 2, build those powers by squaring again and again, reducing mod n after every multiplication, and multiply the ones you need.'],
  solution: `${phiWork(M)}. ${n(a)} is coprime to ${n(M)}, so ${n(a)}${sup(F)} ≡ 1 (mod ${n(M)}). ${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}, so ${n(a)}${sup(K)} ≡ ${n(a)}${sup(r)} (mod ${n(M)}). Squaring: ${S.text} So the seal is ${n(v)}.`,
  guidance: [
   { prompt: `What is φ(${n(M)})? Use its prime factorisation.`, answer: [F], explanation: `${phiWork(M)}.` },
   { prompt: `Divide ${n(K)} by ${n(F)}. What is the remainder r?`, answer: [r], explanation: `${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}. By Euler’s theorem ${n(a)}${sup(F)} ≡ 1 (mod ${n(M)}), so each block of ${n(F)} contributes a factor 1 and ${n(a)}${sup(K)} ≡ ${n(a)}${sup(r)} (mod ${n(M)}).` },
   { prompt: `Square repeatedly mod ${n(M)} and combine the powers you need. What is ${n(a)}${sup(r)} mod ${n(M)}?`, answer: [v], explanation: S.text }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'The ticking pulse counter',
 brief: 'A pulse counter on the mast multiplies its reading at every tick and keeps two digits, and the office wants its reading after a very long run.',
 labels: ['r', 'power mod 100', 'reading'], tolerance: 0.01,
 gl: [['r'], ['power mod 100'], ['reading']]
}, {
 /* A coprime to 100, S from 2 to 99, K from 100 to 9999 with K mod 40 at least 2. Not the lesson's 3²⁰³. */
 canonical: { A: 7, S: 12, K: 1234 },
 draw: R => retry(() => { const p = { A: R.pick(COPRIME100), S: R.int(2, 99), K: R.int(100, 9999) }; return p.K % 40 < 2 || (p.A === 3 && p.K === 203) ? null : p; }, { A: 7, S: 12, K: 1234 }),
 build: ({ A, S, K }) => { const r = K % 40, Q = (K - r) / 40, Sq = squaring(A, r, 100), w = Sq.value, fin = S * w % 100; return {
  prompt: `A pulse counter on the repeater mast starts by showing ${n(S)}. At every tick it multiplies its reading by ${n(A)} and keeps only the remainder on division by 100, so it always shows a number from 0 to 99. ${n(A)} and 100 are coprime. The counter ticks ${n(K)} times in a row. Enter r, the remainder of ${n(K)} on division by 40 (which is φ(100)), then ${n(A)}ʳ mod 100, then the reading on the counter after the ${n(K)} ticks.`,
  answer: [r, w, fin],
  hints: ['After k ticks the reading is the starting number times a to the power k, reduced mod 100. Euler’s theorem: a to the power φ(100) = 40 leaves remainder 1 mod 100, so every whole block of 40 ticks changes nothing.', 'Work out the power for the leftover ticks by repeated squaring mod 100, then multiply by the starting reading and reduce mod 100 once more.'],
  solution: `After ${n(K)} ticks the reading is the remainder of ${n(S)} × ${n(A)}${sup(K)} on division by 100. φ(100) = 40 and ${n(A)} is coprime to 100, so ${n(A)}⁴⁰ ≡ 1 (mod 100). ${n(K)} = 40 × ${n(Q)} + ${n(r)}, so ${n(A)}${sup(K)} ≡ ${n(A)}${sup(r)} (mod 100). Squaring: ${Sq.text} So ${n(A)}${sup(r)} ≡ ${n(w)}, and the reading is the remainder of ${n(S)} × ${n(w)} = ${n(S * w)} on division by 100, which is ${n(fin)}.`,
  guidance: [
   { prompt: `Divide ${n(K)} by 40. What is the remainder r?`, answer: [r], explanation: `${n(K)} = 40 × ${n(Q)} + ${n(r)}. Each block of 40 ticks multiplies the reading by ${n(A)}⁴⁰ ≡ 1, so only the last ${n(r)} ticks matter.` },
   { prompt: `Square repeatedly mod 100 and combine the powers you need. What is ${n(A)}${sup(r)} mod 100?`, answer: [w], explanation: Sq.text },
   { prompt: `The reading is the remainder of ${n(S)} × ${n(A)}${sup(r)} on division by 100. What does the counter show after the ${n(K)} ticks?`, answer: [fin], explanation: `${n(S)} × ${n(w)} = ${n(S * w)}, which leaves remainder ${n(fin)} on division by 100.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', title: 'The long-range seal',
 brief: 'The long-range link needs a three-digit seal from a power of a thousand-fold size, and the office wants its first digit too.',
 labels: ['φ(1000)', 'r', 'seal', 'hundreds digit'], tolerance: 0.01,
 gl: [['φ(1000)'], ['r'], ['seal'], ['hundreds digit']]
}, {
 /* A coprime to 1000 with 3 ≤ A ≤ 99, K from 1000 to 99999 with K mod 400 at least 2 and a seal other than 1. */
 canonical: { A: 7, K: 12345 },
 draw: R => retry(() => { const A = R.int(3, 99), K = R.int(1000, 99999); if (!coprime1000(A) || K % 400 < 2) return null; return squaring(A, K % 400, 1000).value === 1 ? null : { A, K }; }, { A: 7, K: 12345 }),
 build: ({ A, K }) => { const F = phi(1000), r = K % F, Q = (K - r) / F, S = squaring(A, r, 1000), v = S.value, h = Math.floor(v / 100); return {
  prompt: `The Signal Office’s long-range seal is the last three digits of ${n(A)}${sup(K)}: its remainder on division by 1000. ${n(A)} and 1000 are coprime. Enter φ(1000), then r, the remainder of ${n(K)} on division by φ(1000), then ${n(A)}${sup(K)} mod 1000 as a number from 0 to 999, then the hundreds digit of the seal (0 when the last three digits are 000 to 099).`,
  answer: [F, r, v, h],
  hints: ['Write 1000 as a product of prime powers and multiply φ of each. Euler’s theorem then lets you drop every whole block of φ(1000) from the exponent, because a and 1000 are coprime.', 'Write r as a sum of powers of 2, build those powers by squaring again and again, and reduce mod 1000 after every multiplication so the numbers stay small.'],
  solution: `${phiWork(1000)}. ${n(A)} is coprime to 1000, so ${n(A)}${sup(F)} ≡ 1 (mod 1000). ${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}, so ${n(A)}${sup(K)} ≡ ${n(A)}${sup(r)} (mod 1000). Squaring: ${S.text} So the last three digits are ${three(v)}: ${n(A)}${sup(K)} mod 1000 = ${n(v)}, and the hundreds digit is ${n(h)}.`,
  guidance: [
   { prompt: '1000 = 2³ × 5³. What is φ(1000)?', answer: [F], explanation: 'φ(2³) = 8 − 4 = 4 and φ(5³) = 125 − 25 = 100, so φ(1000) = 4 × 100 = 400.' },
   { prompt: `Divide ${n(K)} by ${n(F)}. What is the remainder r?`, answer: [r], explanation: `${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}. By Euler’s theorem ${n(A)}${sup(F)} ≡ 1 (mod 1000), so ${n(A)}${sup(K)} ≡ ${n(A)}${sup(r)} (mod 1000).` },
   { prompt: `Square repeatedly mod 1000 and combine the powers you need. What is ${n(A)}${sup(r)} mod 1000?`, answer: [v], explanation: S.text },
   { prompt: `The last three digits are ${three(v)}. What is the hundreds digit?`, answer: [h], explanation: `The hundreds digit is the first of the three digits: ${n(h)}.` }
  ] }; }
});

/* ---- q23 Chapter review: signal checks [R3.4, R3.5] ---- */

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Two lamps on the signal tower',
 brief: 'Two lamps on the tower blink in cycles of different lengths, and the lamp pair’s position fixes a code that the office must seal.',
 labels: ['x', 'r', 'check code'], tolerance: 0.01,
 gl: [['x'], ['φ(n)', 'r'], ['check code']]
}, {
 /* m1 < m2 coprime with m1 × m2 ≤ 100, M from a list with φ(M) between 8 and 24; the smallest positive x is coprime to M, at least 3,
    and its check code is not 1; K from 100 to 9999 with K mod φ(M) at least 2. Not the lesson's x ≡ 1 mod 3, x ≡ 3 mod 4. */
 canonical: { M: 40, m1: 4, r1: 3, m2: 9, r2: 5, K: 2468 },
 draw: R => retry(() => { const L = [3, 4, 5, 7, 8, 9, 11, 13], i = R.int(0, 6), m1 = L[i], m2 = L[R.int(i + 1, 7)], M = R.pick([30, 36, 40, 45, 50, 60]),
  p = { M, m1, r1: R.int(0, m1 - 1), m2, r2: R.int(0, m2 - 1), K: R.int(100, 9999) }, F = phi(M);
  if (gcd(m1, m2) !== 1 || m1 * m2 > 100 || p.K % F < 2 || (m1 === 3 && p.r1 === 1 && m2 === 4 && p.r2 === 3)) return null;
  const x = last(crtList(m1, p.r1, m2, p.r2)); if (x < 3 || gcd(x, M) !== 1) return null;
  return squaring(x, p.K % F, M).value === 1 ? null : p; }, { M: 40, m1: 4, r1: 3, m2: 9, r2: 5, K: 2468 }),
 build: ({ M, m1, r1, m2, r2, K }) => { const list = crtList(m1, r1, m2, r2), x = last(list), F = phi(M), r = K % F, Q = (K - r) / F, S = squaring(x, r, M), v = S.value; return {
  prompt: `Two lamps on the signal tower fix a code x: x leaves remainder ${n(r1)} on division by ${n(m1)} and remainder ${n(r2)} on division by ${n(m2)}. The smallest positive such x is coprime to ${n(M)}. Enter that x, then r, the remainder of ${n(K)} on division by φ(${n(M)}), then the tower’s check code x${sup(K)} mod ${n(M)}, a number from 0 to ${n(M - 1)}.`,
  answer: [x, r, v],
  hints: ['List the positive numbers with the right remainder for the larger of the two lamp cycles, adding that cycle length each time, and keep the first one that also has the right remainder for the smaller cycle.', 'Find φ of the second number from its prime factorisation. By Euler’s theorem whole blocks of φ in the exponent can be dropped, because x is coprime to that number. Then square repeatedly, reducing after every multiplication.'],
  solution: `${list.length === 1 ? `${n(x)} has remainder ${n(r2)} on division by ${n(m2)} and already leaves remainder ${n(r1)} on division by ${n(m1)}` : `The numbers with remainder ${n(r2)} on division by ${n(m2)} are ${lst(list)}; the last of these leaves remainder ${n(r1)} on division by ${n(m1)}`}, so x = ${n(x)}. ${n(m1)} and ${n(m2)} are coprime, so by the Chinese remainder theorem this is the only answer below ${n(m1 * m2)}. Next, ${phiWork(M)}, and x is coprime to ${n(M)}, so ${n(x)}${sup(F)} ≡ 1 (mod ${n(M)}). ${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}, so ${n(x)}${sup(K)} ≡ ${n(x)}${sup(r)} (mod ${n(M)}). Squaring: ${S.text} The check code is ${n(v)}.`,
  guidance: [
   { prompt: `List ${n(list[0])}, ${n(list[0] + m2)}, … (adding ${n(m2)} each time) and find the first that leaves remainder ${n(r1)} on division by ${n(m1)}. What is x?`, answer: [x], explanation: `${lst(list)}: ${n(x)} = ${n(m1)} × ${n((x - r1) / m1)} + ${n(r1)}, so x = ${n(x)}.` },
   { prompt: `What is φ(${n(M)}), and what is the remainder r when ${n(K)} is divided by it?`, answer: [F, r], explanation: `${phiWork(M)}. Then ${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}, and ${n(x)}${sup(F)} ≡ 1 (mod ${n(M)}) by Euler’s theorem, so ${n(x)}${sup(K)} ≡ ${n(x)}${sup(r)} (mod ${n(M)}).` },
   { prompt: `Square repeatedly mod ${n(M)}. What is ${n(x)}${sup(r)} mod ${n(M)}?`, answer: [v], explanation: S.text }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Three relay counters agree',
 brief: 'Three relay counters on the mast each know only a remainder, and the office must rebuild the signal number in two stages before it seals it.',
 labels: ['y', 'x', 'r', 'check code'], tolerance: 0.01,
 gl: [['y'], ['x'], ['r', 'check code']]
}, {
 /* Three pairwise coprime moduli from 3 to 13 in increasing order with product at most 500; the smallest positive x is coprime to 100,
    at least 3 and different from y (so the third counter matters); K from 100 to 9999 with K mod 40 at least 2; the check code is not 1. */
 canonical: { m1: 3, r1: 2, m2: 4, r2: 1, m3: 5, r3: 3, K: 1234 },
 draw: R => retry(() => { const L = [3, 4, 5, 7, 8, 9, 11, 13], pick = []; while (pick.length < 3) { const m = R.pick(L); if (!pick.includes(m)) pick.push(m); }
  pick.sort((a, b) => a - b); const [m1, m2, m3] = pick;
  if (gcd(m1, m2) !== 1 || gcd(m1, m3) !== 1 || gcd(m2, m3) !== 1 || m1 * m2 * m3 > 500) return null;
  const p = { m1, r1: R.int(0, m1 - 1), m2, r2: R.int(0, m2 - 1), m3, r3: R.int(0, m3 - 1), K: R.int(100, 9999) };
  const y = last(crtList(m1, p.r1, m2, p.r2)), x = last(climb(y, m1 * m2, m3, p.r3));
  if (x === y || x < 3 || x % 2 === 0 || x % 5 === 0 || p.K % 40 < 2) return null;
  return squaring(x, p.K % 40, 100).value === 1 ? null : p; }, { m1: 3, r1: 2, m2: 4, r2: 1, m3: 5, r3: 3, K: 1234 }),
 build: ({ m1, r1, m2, r2, m3, r3, K }) => { const list1 = crtList(m1, r1, m2, r2), y = last(list1), P = m1 * m2, list2 = climb(y, P, m3, r3), x = last(list2),
  r = K % 40, Q = (K - r) / 40, S = squaring(x, r, 100), v = S.value; return {
  prompt: `Three relay counters on the repeater mast fix a signal number x: x leaves remainder ${n(r1)} on division by ${n(m1)}, remainder ${n(r2)} on division by ${n(m2)} and remainder ${n(r3)} on division by ${n(m3)}. Let y be the smallest positive number that fits the first two counters only. The smallest positive x that fits all three is coprime to 100. Enter y, then x, then r, the remainder of ${n(K)} on division by 40, then the check code x${sup(K)} mod 100, a number from 0 to 99.`,
  answer: [y, x, r, v],
  hints: ['Do two counters at a time. List the positive numbers with the right remainder for the larger of the first two cycle lengths, adding that length each time, and keep the first one that fits the smaller one too.', 'Every number that fits the first two counters is y plus a multiple of the product of their cycle lengths. Add that product again and again to y until the third counter’s remainder is right. Then φ(100) = 40 lets you drop whole blocks of 40 from the exponent before you square.'],
  solution: `${list1.length === 1 ? `${n(y)} has remainder ${n(r2)} on division by ${n(m2)} and already leaves remainder ${n(r1)} on division by ${n(m1)}` : `The numbers with remainder ${n(r2)} on division by ${n(m2)} are ${lst(list1)}; the last of these leaves remainder ${n(r1)} on division by ${n(m1)}`}, so y = ${n(y)}. Every number that fits the first two counters is ${n(y)} plus a multiple of ${n(m1)} × ${n(m2)} = ${n(P)}: ${lst(list2)}. The last of these leaves remainder ${n(r3)} on division by ${n(m3)}, so x = ${n(x)}. The three cycle lengths share no prime factor, so by the Chinese remainder theorem this is the only answer below ${n(P * m3)}. Next, ${n(K)} = 40 × ${n(Q)} + ${n(r)} and φ(100) = 40, so ${n(x)}${sup(K)} ≡ ${n(x)}${sup(r)} (mod 100). Squaring: ${S.text} The check code is ${n(v)}.`,
  guidance: [
   { prompt: `List ${n(list1[0])}, ${n(list1[0] + m2)}, … (adding ${n(m2)} each time) and find the first that leaves remainder ${n(r1)} on division by ${n(m1)}. What is y?`, answer: [y], explanation: `${lst(list1)}: ${n(y)} = ${n(m1)} × ${n((y - r1) / m1)} + ${n(r1)}, so y = ${n(y)}.` },
   { prompt: `Now list ${lst(list2.slice(0, 2))}, … (adding ${n(P)} each time, which keeps the first two remainders) and find the first that leaves remainder ${n(r3)} on division by ${n(m3)}. What is x?`, answer: [x], explanation: `${lst(list2)}: ${n(x)} = ${n(m3)} × ${n((x - r3) / m3)} + ${n(r3)}, so x = ${n(x)}.` },
   { prompt: `Divide ${n(K)} by 40 to get r, then square repeatedly mod 100. What are r and ${n(x)}${sup(r)} mod 100?`, answer: [r, v], explanation: `${n(K)} = 40 × ${n(Q)} + ${n(r)}, and ${n(x)}⁴⁰ ≡ 1 (mod 100) by Euler’s theorem, so ${n(x)}${sup(K)} ≡ ${n(x)}${sup(r)} (mod 100). ${S.text}` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', title: 'The long-range relay seal',
 brief: 'The long-range relays use longer cycles and a three-digit seal, and the office must rebuild the number and seal it in one pass.',
 labels: ['x', 'φ(1000)', 'r', 'check code'], tolerance: 0.01,
 gl: [['x'], ['φ(1000)', 'r'], ['check code']]
}, {
 /* m1 < m2 coprime from 3 to 19 with m1 × m2 ≤ 400; the smallest positive x is coprime to 1000 and at least 3; K from 1000 to 99999
    with K mod 400 at least 2; the check code is not 1. */
 canonical: { m1: 8, r1: 3, m2: 13, r2: 5, K: 54321 },
 draw: R => retry(() => { const L = [3, 4, 7, 8, 9, 11, 13, 16, 17, 19], i = R.int(0, 8), m1 = L[i], m2 = L[R.int(i + 1, 9)], p = { m1, r1: R.int(0, m1 - 1), m2, r2: R.int(0, m2 - 1), K: R.int(1000, 99999) };
  if (gcd(m1, m2) !== 1 || m1 * m2 > 400 || p.K % 400 < 2) return null;
  const x = last(crtList(m1, p.r1, m2, p.r2)); if (x < 3 || !coprime1000(x)) return null;
  return squaring(x, p.K % 400, 1000).value === 1 ? null : p; }, { m1: 8, r1: 3, m2: 13, r2: 5, K: 54321 }),
 build: ({ m1, r1, m2, r2, K }) => { const list = crtList(m1, r1, m2, r2), x = last(list), F = phi(1000), r = K % F, Q = (K - r) / F, S = squaring(x, r, 1000), v = S.value; return {
  prompt: `Two long-range relay counters fix a signal number x: x leaves remainder ${n(r1)} on division by ${n(m1)} and remainder ${n(r2)} on division by ${n(m2)}. The smallest positive such x is coprime to 1000. Enter that x, then φ(1000), then r, the remainder of ${n(K)} on division by φ(1000), then the check code x${sup(K)} mod 1000, a number from 0 to 999.`,
  answer: [x, F, r, v],
  hints: ['List the positive numbers with the right remainder for the larger cycle length, adding that length each time, and keep the first one that also has the right remainder for the smaller one.', 'Write 1000 as a product of prime powers to find φ(1000). Euler’s theorem then lets you drop whole blocks of φ(1000) from the exponent, and repeated squaring mod 1000, reducing after every multiplication, finishes the job.'],
  solution: `${list.length === 1 ? `${n(x)} has remainder ${n(r2)} on division by ${n(m2)} and already leaves remainder ${n(r1)} on division by ${n(m1)}` : `The numbers with remainder ${n(r2)} on division by ${n(m2)} are ${lst(list)}; the last of these leaves remainder ${n(r1)} on division by ${n(m1)}`}, so x = ${n(x)}. ${n(m1)} and ${n(m2)} are coprime, so by the Chinese remainder theorem this is the only answer below ${n(m1 * m2)}. Next, ${phiWork(1000)}, and x is coprime to 1000, so ${n(x)}${sup(F)} ≡ 1 (mod 1000). ${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}, so ${n(x)}${sup(K)} ≡ ${n(x)}${sup(r)} (mod 1000). Squaring: ${S.text} The check code is ${n(v)}.`,
  guidance: [
   { prompt: `List ${n(list[0])}, ${n(list[0] + m2)}, … (adding ${n(m2)} each time) and find the first that leaves remainder ${n(r1)} on division by ${n(m1)}. What is x?`, answer: [x], explanation: `${lst(list)}: ${n(x)} = ${n(m1)} × ${n((x - r1) / m1)} + ${n(r1)}, so x = ${n(x)}.` },
   { prompt: `1000 = 2³ × 5³. What is φ(1000), and what is the remainder r when ${n(K)} is divided by it?`, answer: [F, r], explanation: `φ(2³) = 4 and φ(5³) = 100, so φ(1000) = 400. ${n(K)} = ${n(F)} × ${n(Q)} + ${n(r)}, and ${n(x)}${sup(F)} ≡ 1 (mod 1000) by Euler’s theorem, so ${n(x)}${sup(K)} ≡ ${n(x)}${sup(r)} (mod 1000).` },
   { prompt: `Square repeatedly mod 1000. What is ${n(x)}${sup(r)} mod 1000?`, answer: [v], explanation: S.text }
  ] }; }
});

/* ---- q24 Wilson's theorem [R3.5] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The year dial’s notch products',
 brief: 'The year dial in the hall has a prime number of notches, and the keeper reads a running product at three different stopping notches.',
 labels: ['(p − 3)! mod p', '(p − 1)! mod p', '(p − 2)! mod p'], tolerance: 0.01,
 gl: [['(p − 1)! mod p'], ['(p − 2)! mod p'], ['y']]
}, {
 /* A prime p from 11 to 199 (not 7, the lesson's worked example). */
 canonical: { p: 23 },
 draw: R => retry(() => ({ p: R.pick(PR) }), { p: 23 }),
 build: ({ p }) => { const h = (p - 1) / 2; return {
  prompt: `The Calendar Hall’s year dial has ${n(p)} notches, and ${n(p)} is prime. A keeper multiplies the notch numbers 1 × 2 × 3 × … up to a stopping notch and reads the remainder of the product on division by ${n(p)}. Enter the reading when the keeper stops at notch ${n(p - 3)}, then the reading when the keeper stops at notch ${n(p - 1)}, then the reading when the keeper stops at notch ${n(p - 2)}. Type each as a least residue: a remainder from 0 to ${n(p - 1)}.`,
  answer: [h, p - 1, 1],
  hints: ['A product 1 × 2 × … × k is k!. Use Wilson’s theorem for the full product: for a prime p, (p − 1)! ≡ −1 (mod p). Turn −1 into a least residue yourself.', 'Take factors off the end one at a time. The factor p − 1 is −1 mod p, which gives the reading one notch earlier. The factor p − 2 is −2 mod p, so you then need the residue y with −2 × y equal to the reading you have, mod p.'],
  solution: `Stopping at notch ${n(p - 1)} gives (${n(p)} − 1)!, and by Wilson’s theorem it is ≡ −1 ≡ ${n(p - 1)} (mod ${n(p)}). Next, ${n(p - 1)}! = ${n(p - 2)}! × ${n(p - 1)} and ${n(p - 1)} ≡ −1, so −${n(p - 2)}! ≡ −1 and the reading at notch ${n(p - 2)} is 1. Then ${n(p - 2)}! = ${n(p - 3)}! × ${n(p - 2)} with ${n(p - 2)} ≡ −2, so −2 × ${n(p - 3)}! ≡ 1 (mod ${n(p)}). y = ${n(h)} works: −2 × ${n(h)} = −${n(p - 1)} = 1 − ${n(p)} ≡ 1. Only one residue works, because ${n(p)} is an odd prime, so the reading at notch ${n(p - 3)} is ${n(h)}. In the order asked: ${n(h)}, ${n(p - 1)}, 1.`,
  guidance: [
   { prompt: `Stopping at notch ${n(p - 1)} gives (${n(p)} − 1)!. By Wilson’s theorem, what is its reading mod ${n(p)}?`, answer: [p - 1], explanation: `(${n(p)} − 1)! ≡ −1 (mod ${n(p)}), and −1 + ${n(p)} = ${n(p - 1)} is its least residue.` },
   { prompt: `${n(p - 1)}! = ${n(p - 2)}! × ${n(p - 1)}, and ${n(p - 1)} ≡ −1 (mod ${n(p)}). What is the reading when the keeper stops at notch ${n(p - 2)}?`, answer: [1], explanation: `−${n(p - 2)}! ≡ ${n(p - 1)}! ≡ −1, so ${n(p - 2)}! ≡ 1 (mod ${n(p)}).` },
   { prompt: `${n(p - 2)}! = ${n(p - 3)}! × ${n(p - 2)}, and ${n(p - 2)} ≡ −2. Which residue y gives −2 × y ≡ 1 (mod ${n(p)})? That y is the reading at notch ${n(p - 3)}.`, answer: [h], explanation: `−2 × ${n(h)} = −${n(p - 1)}, which is 1 − ${n(p)}, so it leaves remainder 1. Hence ${n(p - 3)}! ≡ ${n(h)} (mod ${n(p)}).` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'The two-dial vault lock',
 brief: 'The vault lock opens on a code built from two dials that each hide a huge factorial, and the keeper wants to set it without multiplying.',
 labels: ['dial A', 'dial B', 'lock code'], tolerance: 0.01,
 gl: [['(p − 1)! mod p'], ['(p − 3)! mod p'], ['dial B', 'lock code']]
}, {
 /* A prime p from 11 to 199 (not 7). Dial A is (p − 1)! ≡ p − 1, dial B is 2 × (p − 3)! ≡ p − 1, and the code is p − 2. */
 canonical: { p: 17 },
 draw: R => retry(() => ({ p: R.pick(PR) }), { p: 17 }),
 build: ({ p }) => { const h = (p - 1) / 2; return {
  prompt: `The Calendar Hall’s vault lock has two dials, each with ${n(p)} settings, and ${n(p)} is prime. Dial A shows the remainder of (${n(p)} − 1)! on division by ${n(p)}. Dial B shows the remainder of 2 × (${n(p)} − 3)! on division by ${n(p)}. The lock code is the remainder of A + B on division by ${n(p)}. Enter A, then B, then the lock code. Type each as a least residue: a remainder from 0 to ${n(p - 1)}.`,
  answer: [p - 1, p - 1, p - 2],
  hints: ['Dial A is Wilson’s theorem. For dial B, peel the last factors off (p − 1)! as in the lesson to find (p − 3)! mod p, then double it and reduce mod p.', 'Add the two readings and take the remainder on division by p: the sum can be larger than p, so it may need one reduction.'],
  solution: `Dial A: by Wilson’s theorem (${n(p)} − 1)! ≡ −1 ≡ ${n(p - 1)} (mod ${n(p)}). Dial B: ${n(p - 1)}! = ${n(p - 2)}! × ${n(p - 1)} and ${n(p - 1)} ≡ −1, so ${n(p - 2)}! ≡ 1. Then ${n(p - 2)}! = ${n(p - 3)}! × ${n(p - 2)} with ${n(p - 2)} ≡ −2, so −2 × ${n(p - 3)}! ≡ 1 and ${n(p - 3)}! ≡ ${n(h)}, because −2 × ${n(h)} = 1 − ${n(p)}. So 2 × ${n(p - 3)}! ≡ 2 × ${n(h)} = ${n(p - 1)}, and dial B shows ${n(p - 1)}. The lock code is the remainder of ${n(p - 1)} + ${n(p - 1)} = ${n(2 * p - 2)} on division by ${n(p)}: ${n(2 * p - 2)} = ${n(p)} × 1 + ${n(p - 2)}, so the code is ${n(p - 2)}.`,
  guidance: [
   { prompt: `Dial A is (${n(p)} − 1)! mod ${n(p)}. By Wilson’s theorem, what does it show?`, answer: [p - 1], explanation: `(${n(p)} − 1)! ≡ −1 (mod ${n(p)}), and −1 + ${n(p)} = ${n(p - 1)} is its least residue.` },
   { prompt: `Here ${n(p - 2)}! ≡ 1 (mod ${n(p)}), and ${n(p - 2)}! = ${n(p - 3)}! × ${n(p - 2)} with ${n(p - 2)} ≡ −2. Which residue y gives −2 × y ≡ 1 (mod ${n(p)})? That y is (${n(p)} − 3)! mod ${n(p)}.`, answer: [h], explanation: `−2 × ${n(h)} = −${n(p - 1)}, which is 1 − ${n(p)}, so it leaves remainder 1. Hence ${n(p - 3)}! ≡ ${n(h)} (mod ${n(p)}).` },
   { prompt: `Dial B shows the remainder of 2 × (${n(p)} − 3)! on division by ${n(p)}. What do dial B and the lock code (the remainder of A + B on division by ${n(p)}) show?`, answer: [p - 1, p - 2], explanation: `2 × ${n(h)} = ${n(p - 1)}, so dial B shows ${n(p - 1)}. A + B = ${n(p - 1)} + ${n(p - 1)} = ${n(2 * p - 2)} = ${n(p)} + ${n(p - 2)}, so the lock code is ${n(p - 2)}.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', title: 'Three steps down the factorial',
 brief: 'The master lock reads three products in a row, and each step down needs one more factor taken off the end of the product.',
 labels: ['(p − 3)! mod p', '(p − 4)! mod p', '(p − 5)! mod p'], tolerance: 0.01,
 gl: [['(p − 3)! mod p'], ['(p − 4)! mod p'], ['(p − 5)! mod p']]
}, {
 /* A prime p from 11 to 199 (not 7), so that p − 5 is at least 6 and neither 3 nor 4 shares a factor with p. */
 canonical: { p: 31 },
 draw: R => retry(() => ({ p: R.pick(PR) }), { p: 31 }),
 build: ({ p }) => { const h = (p - 1) / 2, A = negSolve(3, h, p), y = A.y, B = negSolve(4, y, p), z = B.y;
  const lines = (S, c) => S.list.length === 1 ? `${n(S.s)} = ${n(c)} × ${n(S.y)} already` : `${lst(S.list)}: ${n(S.s)} = ${n(c)} × ${n(S.y)}`; return {
  prompt: `The Calendar Hall’s master lock has a wheel of ${n(p)} teeth, and ${n(p)} is prime. It takes three codes from products of consecutive tooth numbers. Enter (${n(p)} − 3)! mod ${n(p)}, then (${n(p)} − 4)! mod ${n(p)}, then (${n(p)} − 5)! mod ${n(p)}. Type each as a least residue: a remainder from 0 to ${n(p - 1)}.`,
  answer: [h, y, z],
  hints: ['Start from Wilson’s theorem and take factors off the end, as in the lesson: p − 1 is −1 mod p, then p − 2 is −2, and these two steps give (p − 3)!.', 'The next factor to take off is p − 3, which is −3 mod p, so you need y with −3 × y ≡ the reading you have. Write that as 3y ≡ p minus the reading, then add p to the right side again and again until the total divides by 3, and divide. For the factor p − 4, which is −4 mod p, do the same with 4.'],
  solution: `Wilson’s theorem gives (${n(p)} − 1)! ≡ ${n(p - 1)}, so ${n(p - 2)}! ≡ 1, and since ${n(p - 2)} ≡ −2, −2 × ${n(p - 3)}! ≡ 1, which gives ${n(p - 3)}! ≡ ${n(h)} (mod ${n(p)}). Next, ${n(p - 3)}! = ${n(p - 4)}! × ${n(p - 3)} with ${n(p - 3)} ≡ −3, so −3 × y ≡ ${n(h)}, that is 3y ≡ ${n(p)} − ${n(h)} = ${n(A.T)} (mod ${n(p)}). Adding ${n(p)} until the total divides by 3: ${lines(A, 3)}, so ${n(p - 4)}! ≡ ${n(y)}. Then ${n(p - 4)}! = ${n(p - 5)}! × ${n(p - 4)} with ${n(p - 4)} ≡ −4, so −4 × z ≡ ${n(y)}, that is 4z ≡ ${n(p)} − ${n(y)} = ${n(B.T)} (mod ${n(p)}). Adding ${n(p)} until the total divides by 4: ${lines(B, 4)}, so ${n(p - 5)}! ≡ ${n(z)}.`,
  guidance: [
   { prompt: `Use Wilson’s theorem and take off the factors ${n(p - 1)} (≡ −1) and ${n(p - 2)} (≡ −2). What is (${n(p)} − 3)! mod ${n(p)}?`, answer: [h], explanation: `(${n(p)} − 1)! ≡ ${n(p - 1)}, so ${n(p - 2)}! ≡ 1, and −2 × ${n(p - 3)}! ≡ 1 gives ${n(p - 3)}! ≡ ${n(h)}, since −2 × ${n(h)} = 1 − ${n(p)}.` },
   { prompt: `${n(p - 3)}! = ${n(p - 4)}! × ${n(p - 3)} and ${n(p - 3)} ≡ −3, so −3 × y ≡ ${n(h)}, which is 3y ≡ ${n(A.T)} (mod ${n(p)}). Add ${n(p)} to ${n(A.T)} until the total divides by 3, then divide. What is y = (${n(p)} − 4)! mod ${n(p)}?`, answer: [y], explanation: `${lines(A, 3)}, so y = ${n(y)}. Check: 3 × ${n(y)} = ${n(A.s)} leaves remainder ${n(A.T)} on division by ${n(p)}, so −3 × ${n(y)} leaves remainder ${n(p)} − ${n(A.T)} = ${n(h)}.` },
   { prompt: `${n(p - 4)}! = ${n(p - 5)}! × ${n(p - 4)} and ${n(p - 4)} ≡ −4, so −4 × z ≡ ${n(y)}, which is 4z ≡ ${n(B.T)} (mod ${n(p)}). Add ${n(p)} until the total divides by 4, then divide. What is z = (${n(p)} − 5)! mod ${n(p)}?`, answer: [z], explanation: `${lines(B, 4)}, so z = ${n(z)}. Check: 4 × ${n(z)} = ${n(B.s)} leaves remainder ${n(B.T)} on division by ${n(p)}, so −4 × ${n(z)} leaves remainder ${n(p)} − ${n(B.T)} = ${n(y)}.` }
  ] }; }
});

/* ---- q25 The Möbius function [R4.3] ---- */

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'Signs for the festival rota',
 brief: 'The festival rota repeats on a long cycle, and each sub-cycle gets a plus, a minus or a blank before the keepers hang the banners.',
 labels: ['μ(n)', 'divisors with μ = 1', 'divisors with μ = −1'], tolerance: 0.01,
 gl: [['distinct primes'], ['μ(n)'], ['divisors with μ = 1', 'divisors with μ = −1']]
}, {
 /* N ≤ 1000 with 2 to 4 different primes up to 13; half square-free, half not. Not the lesson's 30. */
 canonical: { N: 105 },
 draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13].filter(() => R.bool()), sq = R.bool();
  const N = P.length < 2 || P.length > 4 ? 0 : P.reduce((s, p, i) => s * ipow(p, sq && (i === 0 || R.bool()) ? R.int(2, 3) : 1), 1); return N < 2 || N > 1000 || N === 30 ? null : { N }; }, { N: 105 }),
 build: ({ N }) => { const f = factor(N), k = f.length, free = f.every(([, a]) => a === 1), mu = free ? (k % 2 ? -1 : 1) : 0, half = ipow(2, k - 1), big = f.find(([, a]) => a > 1); return {
  prompt: `The Calendar Hall’s festival rota repeats every ${n(N)} days, and ${n(N)} = ${fac(f)}. For every divisor d of ${n(N)}, including 1 and ${n(N)} itself, the keepers write the sign μ(d) beside the sub-cycle of d days. Enter μ(${n(N)}) (type −1, 0 or 1), then how many divisors d of ${n(N)} have μ(d) = 1, then how many have μ(d) = −1.`,
  answer: [mu, half, half],
  hints: ['Only square-free divisors get a sign other than 0: they use each distinct prime of the number at most once. μ is 1 for an even number of primes and −1 for an odd number, and the divisor 1 uses no primes, which counts as even.', 'With k distinct primes there are 2 to the power k square-free divisors, each prime being in or out. Choosing an even number of the k primes and choosing an odd number of them can be done in equally many ways.'],
  solution: `${n(N)} = ${fac(f)} has ${n(k)} distinct primes. ${free ? `No prime appears twice, so ${n(N)} is square-free and μ(${n(N)}) = (−1)${sup(k)} = ${n(mu)}.` : `${pw(big[0], 2)} divides ${n(N)}, so ${n(N)} is not square-free and μ(${n(N)}) = 0.`} The divisors with μ(d) not 0 are the square-free ones: each of the primes ${f.map(([p]) => n(p)).join(', ')} is used once or not at all, so there are 2${sup(k)} = ${n(2 * half)} of them. ${n(half)} of them use an even number of primes (0 counts as even), so μ(d) = 1, and ${n(half)} use an odd number, so μ(d) = −1.`,
  guidance: [
   { prompt: `How many distinct primes divide ${n(N)}?`, answer: [k], explanation: `${n(N)} = ${fac(f)}: the distinct primes are ${f.map(([p]) => n(p)).join(', ')}.` },
   { prompt: `Does the square of a prime divide ${n(N)}? Use that and the number of distinct primes to give μ(${n(N)}).`, answer: [mu], explanation: free ? `No square divides ${n(N)}, and ${n(k)} is ${k % 2 ? 'odd' : 'even'}, so μ(${n(N)}) = ${n(mu)}.` : `${pw(big[0], 2)} divides ${n(N)}, so μ(${n(N)}) = 0.` },
   { prompt: `Each of the ${n(k)} primes is used once or left out. How many divisors d have μ(d) = 1 and how many have μ(d) = −1?`, answer: [half, half], explanation: `There are 2${sup(k)} = ${n(2 * half)} square-free divisors. Half of the choices use an even number of primes and half an odd number, so ${n(half)} divisors have μ(d) = 1 and ${n(half)} have μ(d) = −1.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'The keepers’ signed tally',
 brief: 'The keepers add up a signed count of sub-cycles for one long cycle, and the page must show both halves of the sum and the total.',
 labels: ['sum of positive entries', 'sum of negative entries', 'total of entries'], tolerance: 0.01,
 gl: [['sum of positive entries'], ['sum of negative entries'], ['total of entries']]
}, {
 /* N from 12 to 300 with 2 or 3 different primes up to 13, half of them square-free. Not the lesson's 30. */
 canonical: { N: 70 },
 draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13].filter(() => R.bool()), sq = R.bool();
  const N = P.length < 2 || P.length > 3 ? 0 : P.reduce((s, p, i) => s * ipow(p, sq && (i === 0 || R.bool()) ? R.int(2, 3) : 1), 1); return N < 12 || N > 300 || N === 30 ? null : { N }; }, { N: 70 }),
 build: ({ N }) => { const f = factor(N), D = sqfreeDivs(f), pos = D.filter(e => e.k % 2 === 0), neg = D.filter(e => e.k % 2 === 1),
  P = pos.reduce((s, e) => s + N / e.d, 0), Q = neg.reduce((s, e) => s + N / e.d, 0), terms = list => list.map(e => n(N / e.d)).join(' + '); return {
  prompt: `The Calendar Hall’s keepers tally one cycle of ${n(N)} days, and ${n(N)} = ${fac(f)}. For each divisor d of ${n(N)} they write the entry μ(d) × (${n(N)} ÷ d), where ${n(N)} ÷ d is how many sub-cycles of d days fit into the cycle. Enter the sum of the entries that are positive, then the sum of the entries that are negative with the minus sign left off, then the total of all the entries.`,
  answer: [P, Q, P - Q],
  hints: ['An entry is 0 unless d is square-free. For each square-free divisor d, μ(d) is 1 when d uses an even number of the distinct primes (the divisor 1 uses none) and −1 when it uses an odd number.', 'Add the positive entries on one side and the negative entries, without their signs, on the other. The total of all the entries is the first sum minus the second.'],
  solution: `The entries are 0 unless d is square-free, so list the square-free divisors of ${n(N)}: ${lst(D.map(e => e.d))}. Those with μ(d) = 1 (an even number of primes) are ${lst(pos.map(e => e.d))}, with entries ${terms(pos)}, which add up to ${n(P)}. Those with μ(d) = −1 (an odd number of primes) are ${lst(neg.map(e => e.d))}, with entries −(${terms(neg)}), and the sum without the minus sign is ${n(Q)}. The total of all the entries is ${n(P)} − ${n(Q)} = ${n(P - Q)}.`,
  guidance: [
   { prompt: `List the square-free divisors d of ${n(N)}. For those with μ(d) = 1, add ${n(N)} ÷ d. What is the sum of the positive entries?`, answer: [P], explanation: `The square-free divisors with an even number of primes are ${lst(pos.map(e => e.d))}. Their entries ${terms(pos)} add up to ${n(P)}.` },
   { prompt: `For the divisors with μ(d) = −1, add ${n(N)} ÷ d. What is the sum of the negative entries, with the minus sign left off?`, answer: [Q], explanation: `The square-free divisors with an odd number of primes are ${lst(neg.map(e => e.d))}. Their values ${terms(neg)} add up to ${n(Q)}.` },
   { prompt: `The positive entries add up to ${n(P)} and the negative ones to −${n(Q)}. What is the total of all the entries?`, answer: [P - Q], explanation: `${n(P)} − ${n(Q)} = ${n(P - Q)}. Entries with μ(d) = 0 add nothing.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q04', title: 'Signs on the long cycle',
 brief: 'The longest calendar cycle is known only by its length in days, and the keepers must find its sign and count the signed sub-cycles themselves.',
 labels: ['μ(n)', 'square-free divisors', 'divisors with μ = −1'], tolerance: 0.01,
 gl: [['distinct primes', 'largest exponent'], ['μ(n)'], ['square-free divisors', 'divisors with μ = −1']]
}, {
 /* N from 1000 to 9999 with 3 to 5 different primes up to 13; half of them square-free. */
 canonical: { N: 4620 },
 draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13].filter(() => R.bool()), sq = R.bool();
  const N = P.length < 3 || P.length > 5 ? 0 : P.reduce((s, p, i) => s * ipow(p, sq && (i === 0 || R.bool()) ? R.int(2, 3) : 1), 1); return N < 1000 || N > 9999 ? null : { N }; }, { N: 4620 }),
 build: ({ N }) => { const f = factor(N), k = f.length, top = Math.max(...f.map(([, a]) => a)), free = top === 1, mu = free ? (k % 2 ? -1 : 1) : 0, all = ipow(2, k), half = ipow(2, k - 1), big = f.find(([, a]) => a > 1); return {
  prompt: `The longest calendar cycle in the hall is ${n(N)} days, and ${n(N)} has no prime factor above 13. Enter μ(${n(N)}) (type −1, 0 or 1), then how many divisors d of ${n(N)} are square-free, then how many divisors d of ${n(N)} have μ(d) = −1.`,
  answer: [mu, all, half],
  hints: ['Factorise first: divide by 2 as many times as you can, then by 3, 5, 7, 11 and 13. Count the distinct primes and note whether any prime divides it twice or more.', 'A square-free divisor takes each distinct prime once or not at all. A divisor with an odd number of primes has μ(d) = −1, and exactly half of the square-free divisors use an odd number of primes.'],
  solution: `Dividing out the primes in turn gives ${n(N)} = ${fac(f)}, with ${n(k)} distinct primes. ${free ? `No prime appears twice, so ${n(N)} is square-free and μ(${n(N)}) = (−1)${sup(k)} = ${n(mu)}.` : `${pw(big[0], 2)} divides ${n(N)}, so ${n(N)} is not square-free and μ(${n(N)}) = 0.`} A square-free divisor uses each of the ${n(k)} primes once or not at all, so there are 2${sup(k)} = ${n(all)} of them. Half of those choices use an odd number of primes, so ${n(half)} divisors have μ(d) = −1.`,
  guidance: [
   { prompt: `Factorise ${n(N)}. How many distinct primes divide it, and what is the largest exponent in its prime factorisation?`, answer: [k, top], explanation: `${n(N)} = ${fac(f)}: the distinct primes are ${f.map(([p]) => n(p)).join(', ')}, and the largest exponent is ${n(top)}.` },
   { prompt: `Use the largest exponent and the number of distinct primes to give μ(${n(N)}).`, answer: [mu], explanation: free ? `The largest exponent is 1, so ${n(N)} is square-free, and ${n(k)} is ${k % 2 ? 'odd' : 'even'}, so μ(${n(N)}) = ${n(mu)}.` : `The largest exponent is ${n(top)}, so ${pw(big[0], 2)} divides ${n(N)} and μ(${n(N)}) = 0.` },
   { prompt: `Each of the ${n(k)} primes is used once or left out. How many divisors of ${n(N)} are square-free, and how many of them have μ(d) = −1?`, answer: [all, half], explanation: `2${sup(k)} = ${n(all)} square-free divisors. Half use an odd number of primes, so ${n(half)} have μ(d) = −1.` }
  ] }; }
});

})();
