/* Number theory: the hidden life of whole numbers mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Superscript digits for exponents: sup(34) is '³⁴'. pw(2, 3) is '2³', pw(5, 1) is '5'. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const pw = (p, a) => a === 1 ? n(p) : `${n(p)}${sup(a)}`;
/* Prime factorisation as a list of [prime, exponent], smallest prime first; fac() writes it as '2³ × 3² × 5'. */
const factor = x => { const out = []; for (let p = 2; p * p <= x; p++) { let a = 0; while (x % p === 0) { x /= p; a++; } if (a) out.push([p, a]); } if (x > 1) out.push([x, 1]); return out; };
const fac = f => f.map(([p, a]) => pw(p, a)).join(' × ');
const ipow = (p, a) => { let v = 1; for (let i = 0; i < a; i++) v *= p; return v; };
const powmod = (a, k, m) => { let r = 1 % m, b = a % m; while (k > 0) { if (k % 2) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* φ of one prime power, as a value and as working: 'φ(2³) = 8 − 4 = 4', 'φ(5) = 5 − 1 = 4'. */
const phiPP = (p, a) => ipow(p, a) - ipow(p, a - 1);
const phiPPText = (p, a) => a === 1 ? `φ(${n(p)}) = ${n(p)} − 1 = ${n(p - 1)}` : `φ(${pw(p, a)}) = ${n(ipow(p, a))} − ${n(ipow(p, a - 1))} = ${n(phiPP(p, a))}`;
const phi = x => factor(x).reduce((s, [p, a]) => s * phiPP(p, a), 1);
/* 'N = 2² × 3, so φ(N) = φ(2²) × φ(3) = 2 × 2 = 4' (one prime power: 'N is prime, so φ(N) = N − 1 = …'). */
const phiWork = x => { const f = factor(x), v = phi(x);
 if (f.length === 1 && f[0][1] === 1) return `${n(x)} is prime, so φ(${n(x)}) = ${n(x)} − 1 = ${n(v)}`;
 if (f.length === 1) return `${n(x)} = ${fac(f)}, so ${phiPPText(f[0][0], f[0][1])}`;
 return `${n(x)} = ${fac(f)}, so φ(${n(x)}) = ${f.map(([p, a]) => n(phiPP(p, a))).join(' × ')} = ${n(v)}`; };
/* σ of one prime power, written as a sum: 'σ(2²) = 1 + 2 + 4 = 7'. */
const sigPP = (p, a) => { let s = 0; for (let i = 0; i <= a; i++) s += ipow(p, i); return s; };
const sigPPText = (p, a) => { const t = []; for (let i = 0; i <= a; i++) t.push(n(ipow(p, i))); return `σ(${pw(p, a)}) = ${t.join(' + ')} = ${n(sigPP(p, a))}`; };
/* Order of a mod m and the list 'a¹ ≡ …, a² ≡ …' up to the power that gives 1. */
const order = (a, m) => { let v = a % m, k = 1; while (v !== 1 && k <= m) { v = v * a % m; k++; } return k; };
const powList = (a, m, upto) => { const t = []; let v = 1; for (let k = 1; k <= upto; k++) { v = v * a % m; t.push(`${n(a)}${sup(k)} ≡ ${n(v)}`); } return t.join(', '); };
/* Repeated squaring of a mod m for an exponent r ≥ 2: the squares, then how the powers of 2 in r combine. */
const red = (w, m) => w < m ? n(w) : `${n(w)} ≡ ${n(w % m)}`;
/* 'a, b and c' */
const and = t => t.length < 2 ? t.join('') : `${t.slice(0, -1).join(', ')} and ${t[t.length - 1]}`;
const squaring = (a, r, m) => {
 const sq = [], vals = { 1: a % m }; let e = 1, v = a % m;
 while (2 * e <= r) { const w = v * v; e *= 2; v = w % m; vals[e] = v; sq.push(e === 2 ? `${n(a)}² = ${red(w, m)}` : `${n(a)}${sup(e)} ≡ ${n(vals[e / 2])}² = ${red(w, m)}`); }
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
const PR = [5, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
const isPrimRoot = (g, p) => order(g, p) === p - 1;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* N = p^a × q^b × r^c with three different primes up to 13 and N ≤ 1000. Not the worked example, 60. */
 q21: {
  canonical: { N: 360 },
  draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13], i = R.int(0, 3), j = R.int(i + 1, 4), k = R.int(j + 1, 5),
   N = ipow(P[i], R.int(1, 5)) * ipow(P[j], R.int(1, 3)) * ipow(P[k], R.int(1, 2)); return N > 1000 || N === 60 ? null : { N }; }, { N: 360 }),
  build: ({ N }) => { const f = factor(N), v = f.map(([p, a]) => phiPP(p, a)), F = phi(N), terms = f.map(([p, a]) => phiPPText(p, a)).join('; '); return {
   prompt: `The Signal Office numbers the codes on one channel from 1 to ${n(N)}, and ${n(N)} = ${fac(f)}. A code is clean when it is coprime to ${n(N)}: it shares no prime factor with ${n(N)}. Enter φ(${n(N)}), the number of clean codes, then the number of codes from 1 to ${n(N)} that are not clean.`,
   answer: [F, N - F],
   hints: ['For one prime power pᵃ, φ(pᵃ) = pᵃ − pᵃ⁻¹: the numbers that share a factor with pᵃ are exactly the multiples of p, and every p-th number is one.', 'φ of a product of powers of different primes is the product of their φ values. The codes that are not clean are the rest: n − φ(n) of them.'],
   solution: `${n(N)} = ${fac(f)}. ${terms}. The three prime powers belong to different primes, so φ(${n(N)}) = ${v.map(n).join(' × ')} = ${n(F)}. That leaves ${n(N)} − ${n(F)} = ${n(N - F)} codes that share a prime factor with ${n(N)}.`,
   guidance: [
    { prompt: `Work out φ of each prime power in ${fac(f)}, in that order.`, answer: v, explanation: `${terms}. Each count leaves out the multiples of its own prime.` },
    { prompt: `Multiply the three values. What is φ(${n(N)})?`, answer: [F], explanation: `${v.map(n).join(' × ')} = ${n(F)}, because φ multiplies across powers of different primes.` },
    { prompt: `How many of the codes 1 to ${n(N)} are not clean?`, answer: [N - F], explanation: `${n(N)} − ${n(F)} = ${n(N - F)}. These are the codes that share at least one of the primes ${f.map(([p]) => n(p)).join(', ')} with ${n(N)}.` }
   ] }; }
 },
 /* a coprime to 100, k from 100 to 9999 with k mod 40 at least 2. Not the worked example, 3²⁰³. */
 q22: {
  canonical: { a: 13, k: 1234 },
  draw: R => retry(() => { const p = { a: R.pick([3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47]), k: R.int(100, 9999) }; return p.k % 40 < 2 || (p.a === 3 && p.k === 203) ? null : p; }, { a: 13, k: 1234 }),
  build: ({ a, k }) => { const r = k % 40, Q = (k - r) / 40, S = squaring(a, r, 100), v = S.value, t = Math.floor(v / 10); return {
   prompt: `The Signal Office’s check code for a message is the last two digits of ${n(a)}${sup(k)}: its remainder on division by 100. ${n(a)} and 100 are coprime. Enter r, the remainder of ${n(k)} on division by φ(100), then ${n(a)}${sup(k)} mod 100 as a number from 0 to 99, then the tens digit of the check code (0 when the last two digits are 00 to 09).`,
   answer: [r, v, t],
   hints: ['Euler’s theorem: when a and n are coprime, a to the power φ(n) leaves remainder 1 on division by n. Here φ(100) = 40, so every whole block of 40 in the exponent can be dropped.', 'Write r as a sum of powers of 2, build those powers by squaring again and again, and reduce mod 100 after every multiplication.'],
   solution: `100 = 2² × 5², so φ(100) = 2 × 20 = 40, and ${n(a)} is coprime to 100. ${n(k)} = 40 × ${n(Q)} + ${n(r)}, and ${n(a)}⁴⁰ ≡ 1 (mod 100), so ${n(a)}${sup(k)} ≡ ${n(a)}${sup(r)} (mod 100). Squaring: ${S.text} So the last two digits are ${two(v)}: ${n(a)}${sup(k)} mod 100 = ${n(v)}, and the tens digit is ${n(t)}.`,
   guidance: [
    { prompt: '100 = 2² × 5². What is φ(100)?', answer: [40], explanation: 'φ(2²) = 4 − 2 = 2 and φ(5²) = 25 − 5 = 20, so φ(100) = 2 × 20 = 40.' },
    { prompt: `Divide ${n(k)} by 40. What is the remainder r?`, answer: [r], explanation: `${n(k)} = 40 × ${n(Q)} + ${n(r)}. By Euler’s theorem ${n(a)}⁴⁰ ≡ 1 (mod 100), so each block of 40 contributes a factor 1 and ${n(a)}${sup(k)} ≡ ${n(a)}${sup(r)} (mod 100).` },
    { prompt: `Square repeatedly mod 100 and combine the powers you need. What is ${n(a)}${sup(r)} mod 100?`, answer: [v], explanation: S.text },
    { prompt: `The last two digits are ${two(v)}. What is the tens digit?`, answer: [t], explanation: `The tens digit is the first of the two: ${n(t)}.` }
   ] }; }
 },
 /* x ≡ r1 (mod m1), x ≡ r2 (mod m2), coprime m1 < m2 with m1 × m2 ≤ 100; the smallest positive x is coprime to 100;
    k from 100 to 9999 with k mod 40 at least 2. Not the worked example (x ≡ 1 mod 3, x ≡ 3 mod 4). */
 q23: {
  canonical: { m1: 5, r1: 2, m2: 7, r2: 3, k: 3215 },
  draw: R => retry(() => { const M = [3, 4, 5, 7, 8, 9, 11, 13], i = R.int(0, 6), m1 = M[i], m2 = M[R.int(i + 1, 7)],
   p = { m1, r1: R.int(0, m1 - 1), m2, r2: R.int(0, m2 - 1), k: R.int(100, 9999) };
   if (gcd(m1, m2) !== 1 || m1 * m2 > 100 || p.k % 40 < 2 || (m1 === 3 && p.r1 === 1 && m2 === 4 && p.r2 === 3)) return null;
   let x = 1; while (x <= m1 * m2 && (x % m1 !== p.r1 || x % m2 !== p.r2)) x++;
   return x > m1 * m2 || x % 2 === 0 || x % 5 === 0 || x < 3 || x * x % 100 === 1 ? null : p; }, { m1: 5, r1: 2, m2: 7, r2: 3, k: 3215 }),
  build: ({ m1, r1, m2, r2, k }) => { const list = []; let x = r2 > 0 ? r2 : m2; while (x % m1 !== r1 && list.length <= m1) { list.push(x); x += m2; } list.push(x);
   const r = k % 40, Q = (k - r) / 40, S = squaring(x, r, 100), v = S.value; return {
   prompt: `Two relay counters on the repeater mast fix a signal number x: x leaves remainder ${n(r1)} on division by ${n(m1)} and remainder ${n(r2)} on division by ${n(m2)}. The smallest positive such x is coprime to 100. Enter that x, then r, the remainder of ${n(k)} on division by 40, then the check code x${sup(k)} mod 100, a number from 0 to 99.`,
   answer: [x, r, v],
   hints: ['List the positive numbers with the right remainder for the larger modulus, adding that modulus each time, and keep the first one that also has the right remainder for the smaller modulus.', 'φ(100) = 40 and x is coprime to 100, so by Euler’s theorem whole blocks of 40 can be dropped from the exponent before you square.'],
   solution: `${list.length === 1 ? `${n(x)} has remainder ${n(r2)} on division by ${n(m2)} and already leaves remainder ${n(r1)} on division by ${n(m1)}` : `The numbers with remainder ${n(r2)} on division by ${n(m2)} are ${list.map(n).join(', ')}; the last of these leaves remainder ${n(r1)} on division by ${n(m1)}`}, so x = ${n(x)}. ${n(m1)} and ${n(m2)} are coprime, so by the Chinese remainder theorem this is the only answer below ${n(m1 * m2)}. Next, ${n(k)} = 40 × ${n(Q)} + ${n(r)} and φ(100) = 40, so ${n(x)}${sup(k)} ≡ ${n(x)}${sup(r)} (mod 100). Squaring: ${S.text} The check code is ${n(v)}.`,
   guidance: [
    { prompt: `List ${n(list[0])}, ${n(list[0] + m2)}, … (adding ${n(m2)} each time) and find the first that leaves remainder ${n(r1)} on division by ${n(m1)}. What is x?`, answer: [x], explanation: `${list.map(n).join(', ')}: ${n(x)} = ${n(m1)} × ${n((x - r1) / m1)} + ${n(r1)}, so x = ${n(x)}.` },
    { prompt: `Divide ${n(k)} by 40. What is the remainder r?`, answer: [r], explanation: `${n(k)} = 40 × ${n(Q)} + ${n(r)}, and ${n(x)}⁴⁰ ≡ 1 (mod 100) by Euler’s theorem, so ${n(x)}${sup(k)} ≡ ${n(x)}${sup(r)} (mod 100).` },
    { prompt: `Square repeatedly mod 100. What is ${n(x)}${sup(r)} mod 100?`, answer: [v], explanation: S.text }
   ] }; }
 },
 /* Two different primes from 5 to 101 (not 7, the worked example). */
 q24: {
  canonical: { p: 31, q: 13 },
  draw: R => retry(() => { const p = R.pick(PR), q = R.pick(PR); return q === p ? null : { p, q }; }, { p: 31, q: 13 }),
  build: ({ p, q }) => { const h = (q - 1) / 2; return {
   prompt: `The Calendar Hall’s lock takes three codes from its two gear wheels, whose tooth counts are the primes ${n(p)} and ${n(q)}. Enter (${n(p)} − 1)! mod ${n(p)}, then (${n(p)} − 2)! mod ${n(p)}, then (${n(q)} − 3)! mod ${n(q)}. Type each as a least residue: a remainder from 0 to one less than the prime.`,
   answer: [p - 1, 1, h],
   hints: ['Wilson’s theorem: for a prime p, (p − 1)! ≡ −1 (mod p), and the least residue of −1 is p − 1.', 'Peel off the last factor: (p − 1)! = (p − 2)! × (p − 1) with p − 1 ≡ −1, and (p − 2)! = (p − 3)! × (p − 2) with p − 2 ≡ −2. Then find the residue that the factor turns into the known value.'],
   solution: `By Wilson’s theorem (${n(p)} − 1)! ≡ −1 ≡ ${n(p - 1)} (mod ${n(p)}). Next, ${n(p - 1)}! = ${n(p - 2)}! × ${n(p - 1)} and ${n(p - 1)} ≡ −1, so −${n(p - 2)}! ≡ −1 and ${n(p - 2)}! ≡ 1 (mod ${n(p)}). For the second wheel the same step gives ${n(q - 2)}! ≡ 1 (mod ${n(q)}). Then ${n(q - 2)}! = ${n(q - 3)}! × ${n(q - 2)} with ${n(q - 2)} ≡ −2, so −2 × ${n(q - 3)}! ≡ 1 (mod ${n(q)}). y = ${n(h)} works: −2 × ${n(h)} = −${n(q - 1)} = 1 − ${n(q)} ≡ 1. Only one residue works, because ${n(q)} is an odd prime, so (${n(q)} − 3)! ≡ ${n(h)} (mod ${n(q)}).`,
   guidance: [
    { prompt: `By Wilson’s theorem, what is (${n(p)} − 1)! mod ${n(p)}?`, answer: [p - 1], explanation: `(${n(p)} − 1)! ≡ −1 (mod ${n(p)}), and −1 + ${n(p)} = ${n(p - 1)} is its least residue.` },
    { prompt: `${n(p - 1)}! = ${n(p - 2)}! × ${n(p - 1)}, and ${n(p - 1)} ≡ −1 (mod ${n(p)}). What is ${n(p - 2)}! mod ${n(p)}?`, answer: [1], explanation: `−${n(p - 2)}! ≡ ${n(p - 1)}! ≡ −1, so ${n(p - 2)}! ≡ 1 (mod ${n(p)}).` },
    { prompt: `For the second wheel ${n(q - 2)}! ≡ 1 (mod ${n(q)}), and ${n(q - 2)}! = ${n(q - 3)}! × ${n(q - 2)} with ${n(q - 2)} ≡ −2. Which residue y gives −2 × y ≡ 1 (mod ${n(q)})?`, answer: [h], explanation: `−2 × ${n(h)} = −${n(q - 1)}, which is 1 − ${n(q)}, so it leaves remainder 1. Hence ${n(q - 3)}! ≡ ${n(h)} (mod ${n(q)}).` }
   ] }; }
 },
 /* N ≤ 1000 with 2 to 4 different primes up to 13; half square-free, half not. Not the worked example, 30. */
 q25: {
  canonical: { N: 84 },
  draw: R => retry(() => { const P = [2, 3, 5, 7, 11, 13].filter(() => R.bool()), sq = R.bool();
   const N = P.length < 2 || P.length > 4 ? 0 : P.reduce((s, p, i) => s * ipow(p, sq && (i === 0 || R.bool()) ? R.int(2, 3) : 1), 1); return N < 2 || N > 1000 || N === 30 ? null : { N }; }, { N: 84 }),
  build: ({ N }) => { const f = factor(N), k = f.length, free = f.every(([, a]) => a === 1), mu = free ? (k % 2 ? -1 : 1) : 0, half = ipow(2, k - 1),
   big = f.find(([, a]) => a > 1); return {
   prompt: `A calendar cycle in the hall is ${n(N)} days long, and ${n(N)} = ${fac(f)}. Enter μ(${n(N)}) (type −1, 0 or 1), then how many divisors d of ${n(N)} have μ(d) not equal to 0, then the sum of μ(d) over all the divisors d of ${n(N)}.`,
   answer: [mu, 2 * half, 0],
   hints: ['μ(n) is 0 when some prime appears twice or more in the factorisation of n. Otherwise n is square-free, and μ(n) is 1 for an even number of distinct primes and −1 for an odd number.', 'A square-free divisor takes each distinct prime of n once or leaves it out, so there are 2 to the power (number of distinct primes) of them. Pair each one with the divisor that swaps the smallest prime in or out: the pair’s μ values cancel.'],
   solution: `${n(N)} = ${fac(f)} has ${n(k)} distinct primes. ${free ? `No prime appears twice, so ${n(N)} is square-free and μ(${n(N)}) = (−1)${sup(k)} = ${n(mu)}.` : `${pw(big[0], 2)} divides ${n(N)}, so ${n(N)} is not square-free and μ(${n(N)}) = 0.`} The divisors with μ(d) not 0 are the square-free ones: products of some of the primes ${f.map(([p]) => n(p)).join(', ')}, each used at most once. There are 2${sup(k)} = ${n(2 * half)} of them. ${n(half)} use an even number of primes (μ = 1) and ${n(half)} an odd number (μ = −1), and every other divisor has μ(d) = 0, so the sum is ${n(half)} − ${n(half)} = 0.`,
   guidance: [
    { prompt: `How many distinct primes divide ${n(N)}?`, answer: [k], explanation: `${n(N)} = ${fac(f)}: the distinct primes are ${f.map(([p]) => n(p)).join(', ')}.` },
    { prompt: `Does the square of a prime divide ${n(N)}? Use that and the number of distinct primes to give μ(${n(N)}).`, answer: [mu], explanation: free ? `No square divides ${n(N)}, and ${n(k)} is ${k % 2 ? 'odd' : 'even'}, so μ(${n(N)}) = ${n(mu)}.` : `${pw(big[0], 2)} divides ${n(N)}, so μ(${n(N)}) = 0.` },
    { prompt: `How many divisors of ${n(N)} are square-free?`, answer: [2 * half], explanation: `Each of the ${n(k)} primes is either in or out: 2${sup(k)} = ${n(2 * half)} choices, 1 included (no primes at all).` },
    { prompt: `What is the sum of μ(d) over all the divisors d of ${n(N)}?`, answer: [0], explanation: `${n(half)} square-free divisors give 1 and ${n(half)} give −1; the rest give 0. The sum is 0, as it is for every n above 1.` }
   ] }; }
 },
 /* N ≤ 999 built from primes up to 13 (a quarter of the time one of the perfect numbers 6, 28, 496), p in 2, 3, 5, 7.
    Not the worked example (N = 28 with p = 3). */
 q26: {
  canonical: { N: 100, p: 7 },
  draw: R => retry(() => { const p = R.pick([2, 3, 5, 7]); let N;
   if (R.int(1, 4) === 1) N = R.pick([6, 28, 496]); else { N = R.int(10, 999); const f = factor(N); if (f.some(([q]) => q > 13) || (f.length === 1 && f[0][1] === 1)) N = 0; }
   return !N || (N === 28 && p === 3) ? null : { N, p }; }, { N: 100, p: 7 }),
  build: ({ N, p }) => { const f = factor(N), s = f.map(([q, a]) => sigPP(q, a)), S = s.reduce((x, y) => x * y, 1), d = S - 2 * N, M = ipow(2, p) - 1, P = ipow(2, p - 1) * M,
   verdict = d === 0 ? `${n(N)} is perfect` : d > 0 ? `${n(N)} is not perfect: its divisors other than itself add up to more than ${n(N)}` : `${n(N)} is not perfect: its divisors other than itself add up to less than ${n(N)}`; return {
   prompt: `The Calendar Hall keeps a list of perfect numbers for its anniversary cycles. Test N = ${n(N)} = ${fac(f)}: enter σ(${n(N)}), the sum of all its divisors, then σ(${n(N)}) − 2 × ${n(N)} (0 means perfect). Then, for p = ${n(p)}, enter the Mersenne prime 2${sup(p)} − 1 and the perfect number ${pw(2, p - 1)} × (2${sup(p)} − 1). Type every answer without commas.`,
   answer: [S, d, M, P],
   hints: ['σ(n) adds every divisor of n, n itself included. For a prime power add 1, p, p², … up to that power; for powers of different primes, multiply their σ values.', 'n is perfect when σ(n) = 2n, that is, when its divisors other than n add up to n. Euclid’s rule: whenever 2ᵖ − 1 is prime, 2ᵖ⁻¹ × (2ᵖ − 1) is perfect.'],
   solution: `${f.map(([q, a]) => sigPPText(q, a)).join('; ')}. ${f.length > 1 ? `σ multiplies across powers of different primes, so σ(${n(N)}) = ${s.map(n).join(' × ')} = ${n(S)}` : `So σ(${n(N)}) = ${n(S)}`}. Then σ(${n(N)}) − 2 × ${n(N)} = ${n(S)} − ${n(2 * N)} = ${n(d)}, so ${verdict}. For p = ${n(p)}, 2${sup(p)} − 1 = ${n(M)}, which is prime, so ${pw(2, p - 1)} × ${n(M)} = ${n(ipow(2, p - 1))} × ${n(M)} = ${n(P)} is perfect.`,
   guidance: [
    { prompt: `Add the divisors of each prime power in ${fac(f)} and multiply the results. What is σ(${n(N)})?`, answer: [S], explanation: `${f.map(([q, a]) => sigPPText(q, a)).join('; ')}. ${f.length > 1 ? `Multiplied: ${s.map(n).join(' × ')} = ${n(S)}.` : `So σ(${n(N)}) = ${n(S)}.`}` },
    { prompt: `What is σ(${n(N)}) − 2 × ${n(N)}?`, answer: [d], explanation: `${n(S)} − ${n(2 * N)} = ${n(d)}. ${d === 0 ? `It is 0, so ${n(N)} is perfect.` : `It is not 0, so ${n(N)} is not perfect.`}` },
    { prompt: `What is 2${sup(p)} − 1?`, answer: [M], explanation: `2${sup(p)} = ${n(M + 1)}, so 2${sup(p)} − 1 = ${n(M)}. It has no divisor other than 1 and itself, so it is a Mersenne prime.` },
    { prompt: `What is ${pw(2, p - 1)} × ${n(M)}?`, answer: [P], explanation: `${n(ipow(2, p - 1))} × ${n(M)} = ${n(P)}, the perfect number that belongs to this Mersenne prime.` }
   ] }; }
 },
 /* N from 8 to 50, a from 2 to N − 2 coprime to N, order 3 to 12 (a list short enough to write out). Not the worked example (2 mod 7). */
 q27: {
  canonical: { N: 26, a: 3 },
  draw: R => retry(() => { const N = R.int(8, 50), a = R.int(2, N - 2); if (gcd(a, N) !== 1) return null; const k = order(a, N); return k < 3 || k > 12 ? null : { N, a }; }, { N: 26, a: 3 }),
  build: ({ N, a }) => { const F = phi(N), k = order(a, N), a2 = a * a % N; return {
   prompt: `A calendar wheel has ${n(N)} positions, 0 to ${n(N - 1)}. Each step moves the pointer from position x to the remainder of ${n(a)} × x on division by ${n(N)}. It starts at 1, so after k steps it shows ${n(a)}ᵏ mod ${n(N)}. ${n(a)} and ${n(N)} are coprime. Enter φ(${n(N)}), then the order of ${n(a)} mod ${n(N)}: the fewest steps, at least one, that bring the pointer back to 1.`,
   answer: [F, k],
   hints: ['φ(n) comes from the factorisation of n: multiply φ of each prime power. The order always divides φ(n), so it is one of the divisors of φ(n).', 'Multiply by a again and again, reducing mod n each time, and stop at the first power that leaves remainder 1.'],
   solution: `${phiWork(N)}. Powers of ${n(a)} mod ${n(N)}: ${powList(a, N, k)}. The first power that gives 1 is ${n(a)}${sup(k)}, so the order of ${n(a)} mod ${n(N)} is ${n(k)}. It divides φ(${n(N)}) = ${n(F)}, as an order always does.`,
   guidance: [
    { prompt: `What is φ(${n(N)})?`, answer: [F], explanation: `${phiWork(N)}.` },
    { prompt: `What is ${n(a)}² mod ${n(N)}?`, answer: [a2], explanation: `${n(a)}² = ${n(a * a)}, which leaves remainder ${n(a2)} on division by ${n(N)}.` },
    { prompt: `Keep multiplying by ${n(a)}. After how many steps is the pointer back at 1?`, answer: [k], explanation: `${powList(a, N, k)}. The first 1 comes at step ${n(k)}.` }
   ] }; }
 },
 /* A prime p from 11 to 61 and g from 2 to p − 2; half the time g is a primitive root. Not the worked example (3 mod 7). */
 q28: {
  canonical: { p: 23, g: 5 },
  draw: R => retry(() => { const p = R.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]), want = R.bool(), g = R.int(2, p - 2); return isPrimRoot(g, p) === want ? { p, g } : null; }, { p: 23, g: 5 }),
  build: ({ p, g }) => { const f = factor(p - 1), tests = f.map(([q]) => [q, (p - 1) / q, powmod(g, (p - 1) / q, p)]), prim = tests.every(([, , v]) => v !== 1) ? 1 : 0,
   half = powmod(g, (p - 1) / 2, p), F = phi(p - 1), bad = tests.find(([, , v]) => v === 1); return {
   prompt: `The Calendar Hall wants a pointer step whose powers visit every position 1 to ${n(p - 1)} of a ${n(p)}-position wheel before returning to 1: a primitive root mod ${n(p)}. Test g = ${n(g)}. Enter ${n(g)}${sup((p - 1) / 2)} mod ${n(p)}, then 1 if ${n(g)} is a primitive root mod ${n(p)} and 0 if it is not, then how many primitive roots mod ${n(p)} there are among 1 to ${n(p - 1)}.`,
   answer: [half, prim, F],
   hints: ['The order of g mod p divides p − 1. If it is smaller, it divides (p − 1) ÷ q for some prime q that divides p − 1, so g is a primitive root exactly when g to the power (p − 1) ÷ q is not 1 for every such q.', 'A prime p has exactly φ(p − 1) primitive roots: work out φ of p − 1 from its factorisation.'],
   solution: `${n(p - 1)} = ${fac(f)}, so test the powers ${and(tests.map(([, e]) => n(e)))}: ${tests.map(([, e, v]) => `${n(g)}${sup(e)} ≡ ${n(v)}`).join(', ')} (mod ${n(p)}). ${prim ? `None of them is 1, so the order of ${n(g)} is ${n(p - 1)} and ${n(g)} is a primitive root mod ${n(p)}.` : `${n(g)}${sup(bad[1])} ≡ 1, so the order of ${n(g)} is at most ${n(bad[1])} and ${n(g)} is not a primitive root mod ${n(p)}.`} The number of primitive roots is φ(${n(p - 1)}): ${phiWork(p - 1)}.`,
   guidance: [
    { prompt: `${n(p - 1)} is even, so one test power is ${n(p - 1)} ÷ 2 = ${n((p - 1) / 2)}. What is ${n(g)}${sup((p - 1) / 2)} mod ${n(p)}?`, answer: [half], explanation: `By repeated squaring mod ${n(p)}, ${n(g)}${sup((p - 1) / 2)} ≡ ${n(half)}.` },
    { prompt: `The prime factors of ${n(p - 1)} give the test powers ${and(tests.map(([, e]) => n(e)))}. Is ${n(g)} a primitive root mod ${n(p)}? Enter 1 for yes, 0 for no.`, answer: [prim], explanation: `${tests.map(([, e, v]) => `${n(g)}${sup(e)} ≡ ${n(v)}`).join(', ')}. ${prim ? 'None is 1, so yes.' : 'One of them is 1, so no.'}` },
    { prompt: `How many primitive roots does ${n(p)} have? Work out φ(${n(p - 1)}).`, answer: [F], explanation: `${phiWork(p - 1)}.` }
   ] }; }
 },
 /* p from 11 to 23, g a primitive root mod p, b from 2 to p − 1. Not the worked example (6 = 3³ mod 7). */
 q29: {
  canonical: { p: 17, g: 3, b: 13 },
  draw: R => retry(() => { const p = R.pick([11, 13, 17, 19, 23]), g = R.int(2, p - 2), b = R.int(2, p - 1); return isPrimRoot(g, p) && b !== g ? { p, g, b } : null; }, { p: 17, g: 3, b: 13 }),
  build: ({ p, g, b }) => { let k = 1, v = g % p; while (v !== b && k < p) { v = v * g % p; k++; } const d = (p - 1) / gcd(k, p - 1), g2 = g * g % p, g3 = g2 * g % p; return {
   prompt: `On the Calendar Hall’s ${n(p)}-position wheel, ${n(g)} is a primitive root mod ${n(p)}, so every position from 1 to ${n(p - 1)} is ${n(g)}ᵏ mod ${n(p)} for exactly one k from 1 to ${n(p - 1)}. That k is the index of the position. Enter the index of ${n(b)} (base ${n(g)}, mod ${n(p)}), then the order of ${n(b)} mod ${n(p)}.`,
   answer: [k, d],
   hints: ['Multiply by g again and again, reducing mod p each time, and count the steps until you reach b.', 'If b ≡ gᵏ, then b to the power j is g to the power k × j, which is 1 exactly when p − 1 divides k × j. The order of b is the smallest such j.'],
   solution: `Powers of ${n(g)} mod ${n(p)}: ${powList(g, p, k)}, so the index of ${n(b)} is ${n(k)}. Then ${n(b)}ʲ ≡ ${n(g)} to the power ${n(k)}j, which is 1 exactly when ${n(p - 1)} divides ${n(k)} × j, because ${n(g)} has order ${n(p - 1)}. The smallest such j is ${n(d)} (${n(k)} × ${n(d)} = ${n(k * d)}), so the order of ${n(b)} mod ${n(p)} is ${n(d)}.`,
   guidance: [
    { prompt: `Start the list of powers. What are ${n(g)}² mod ${n(p)} and ${n(g)}³ mod ${n(p)}?`, answer: [g2, g3], explanation: `${n(g)}² = ${n(g * g)}${g * g === g2 ? '' : ` ≡ ${n(g2)}`}, and ${n(g2)} × ${n(g)} = ${n(g2 * g)}${g2 * g === g3 ? '' : ` ≡ ${n(g3)}`} (mod ${n(p)}).` },
    { prompt: `Carry on multiplying by ${n(g)}. Which power of ${n(g)} is ${n(b)} mod ${n(p)}?`, answer: [k], explanation: `${powList(g, p, k)}, so the index is ${n(k)}.` },
    { prompt: `${n(b)} ≡ ${n(g)}${sup(k)} and ${n(g)} has order ${n(p - 1)}. What is the smallest j for which ${n(p - 1)} divides ${n(k)} × j?`, answer: [d], explanation: `${n(k)} × ${n(d)} = ${n(k * d)} is the first multiple of ${n(k)} that ${n(p - 1)} divides, so the order of ${n(b)} is ${n(d)}.` }
   ] }; }
 },
 /* An odd prime p from 13 to 43 and a from 1 to p − 1; half the time a is a square mod p. Not the worked example (5 mod 11). */
 q30: {
  canonical: { p: 19, a: 17 },
  draw: R => retry(() => { const p = R.pick([13, 17, 19, 23, 29, 31, 37, 41, 43]); if (R.bool()) { const x = R.int(1, (p - 1) / 2); return { p, a: x * x % p }; } const a = R.int(1, p - 1); return powmod(a, (p - 1) / 2, p) === 1 ? null : { p, a }; }, { p: 19, a: 17 }),
  build: ({ p, a }) => { const h = (p - 1) / 2, sq = []; let x = 0; for (let i = 1; i <= h; i++) { const v = i * i % p; sq.push(`${n(i)}² ≡ ${n(v)}`); if (v === a && !x) x = i; }
   const count = x ? 2 : 0; return {
   prompt: `The Survey Field marks plot corners on a ring of ${n(p)} stakes, numbered 0 to ${n(p - 1)}. A square plot with side x rods, x from 1 to ${n(p - 1)}, puts its corner flag on stake x² mod ${n(p)}. Enter how many sides x give stake ${n(a)} (the number of solutions of x² ≡ ${n(a)} (mod ${n(p)})), then the smallest such x (0 if there is none), then how many of the stakes 1 to ${n(p - 1)} are quadratic residues mod ${n(p)}.`,
   answer: [count, x, h],
   hints: ['Square only 1 to (p − 1) ÷ 2 and reduce mod p: (p − x)² leaves the same remainder as x², so the other half adds nothing new.', 'For an odd prime p and a from 1 to p − 1, x² ≡ a has either no solution or exactly two, x and p − x (for a = 0 only x = 0 works). The squares of 1 to (p − 1) ÷ 2 are all different, so there are (p − 1) ÷ 2 quadratic residues.'],
   solution: `Squares mod ${n(p)}: ${sq.join(', ')}. ${x ? `${n(a)} appears at x = ${n(x)}, so the solutions are ${n(x)} and ${n(p)} − ${n(x)} = ${n(p - x)}: two solutions, the smallest ${n(x)}. ${n(a)} is a quadratic residue mod ${n(p)}.` : `${n(a)} is not in the list, and the other half repeats it, so x² ≡ ${n(a)} (mod ${n(p)}) has no solution: ${n(a)} is a quadratic nonresidue mod ${n(p)}.`} The list holds ${n(h)} different values, so there are ${n(h)} quadratic residues mod ${n(p)}.`,
   guidance: [
    { prompt: `Square 1 to ${n(h)} and reduce mod ${n(p)}. How many solutions does x² ≡ ${n(a)} (mod ${n(p)}) have?`, answer: [count], explanation: `${sq.join(', ')}. ${x ? `${n(a)} is there, so there are two solutions, x and ${n(p)} − x.` : `${n(a)} is not there, so there are none.`}` },
    { prompt: `What is the smallest solution? Enter 0 if there is none.`, answer: [x], explanation: x ? `${n(x)}² ≡ ${n(a)}, and the other solution is ${n(p - x)}, which is larger.` : `No square leaves remainder ${n(a)}, so the answer is 0.` },
    { prompt: `How many of 1 to ${n(p - 1)} are quadratic residues mod ${n(p)}?`, answer: [h], explanation: `The ${n(h)} squares in the list are all different, and the other half repeats them, so there are ${n(h)}.` }
   ] }; }
 }
});
})();
