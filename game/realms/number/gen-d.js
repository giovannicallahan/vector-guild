/* Number theory: the hidden life of whole numbers mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Shared helpers. All numbers stay below 10⁶ before reduction, so plain Number arithmetic is exact. */
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(c => SUP[c]).join('');
const mod = (a, m) => ((a % m) + m) % m;
const pow = (a, k, m) => { let r = 1, b = mod(a, m); while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const isPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const primesIn = (lo, hi) => { const out = []; for (let x = lo; x <= hi; x++) if (isPrime(x)) out.push(x); return out; };
/* Prime factorisation as [prime, exponent] pairs, and as text such as 2² × 3 × 5. */
const factor = x => { const out = []; for (let d = 2; d * d <= x; d++) { let e = 0; while (x % d === 0) { x /= d; e++; } if (e) out.push([d, e]); } if (x > 1) out.push([x, 1]); return out; };
const factText = x => factor(x).map(([p, e]) => e > 1 ? `${n(p)}${sup(e)}` : n(p)).join(' × ');
/* Repeated squaring of a mod m up to the exponent k, as text, with the result. */
const chain = (a, k, m) => {
 const pw = [], vals = {}; let v = mod(a, m);
 for (let e = 1; e <= k; e *= 2) { vals[e] = v; pw.push(`${n(a)}${sup(e)} ≡ ${n(v)}`); v = v * v % m; }
 const parts = []; for (let e = 1, r = k; r > 0; e *= 2, r = Math.floor(r / 2)) if (r & 1) parts.unshift(e);
 let text = `Repeated squaring mod ${n(m)}: ${pw.join(', ')}.`, r = vals[parts[0]];
 if (parts.length === 1) text += ` So ${n(a)}${sup(k)} ≡ ${n(r)}.`;
 else {
  const steps = [];
  for (const e of parts.slice(1)) { const t = r * vals[e]; steps.push(`${n(r)} × ${n(vals[e])} = ${red(t, m)}`); r = t % m; }
  text += ` ${n(k)} = ${parts.map(n).join(' + ')}, so ${n(a)}${sup(k)} ≡ ${parts.map(e => n(vals[e])).join(' × ')}: ${steps.join(', ')}.`;
 }
 return { text, r };
};
/* Non-zero squares mod an odd prime p, in increasing order. */
const squaresMod = p => { const s = new Set(); for (let x = 1; x <= (p - 1) / 2; x++) s.add(x * x % p); return [...s].sort((u, w) => u - w); };
const legendre = (a, p) => pow(a, (p - 1) / 2, p) === 1 ? 1 : -1;
/* Partial quotients of P/Q by Euclid's algorithm. */
const cfrac = (P, Q) => { const a = []; while (Q) { a.push(Math.floor(P / Q)); [P, Q] = [Q, P % Q]; } return a; };
/* Ways to write x = a² + b² with 0 ≤ a ≤ b. */
const twoSquares = x => { const w = []; for (let a = 0; 2 * a * a <= x; a++) { const b = Math.round(Math.sqrt(x - a * a)); if (b * b === x - a * a) w.push([a, b]); } return w; };
const inverse = (e, m) => { for (let d = 1; d < m; d++) if (e * d % m === 1) return d; return 0; };
/* t, reduced mod m when it is m or more: "100 ≡ 9" or just "4". */
const red = (t, m) => t >= m ? `${n(t)} ≡ ${n(t % m)}` : n(t);
const listText = list => list.length === 1 ? list[0] : list.length === 2 ? `${list[0]} and ${list[1]}` : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;

const SMALL_PRIMES = [11, 13, 17, 19, 23, 29];
const REC_SMALL = [3, 5, 7, 11, 13], REC_BIG = primesIn(17, 97);
const P101_599 = primesIn(101, 599);
const RSA_PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
const KEY_PRIMES = [5, 7, 11, 13, 17, 19, 23];

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Euler's criterion for a prime p from 11 to 29 (exponent 5 to 14, so a² and a⁴ are always needed) and 2 ≤ a ≤ p − 2.
    The worked example is p = 7, which no draw uses. */
 q31: {
  canonical: { p: 13, a: 10 },
  draw: R => { const p = R.pick(SMALL_PRIMES); return { p, a: R.int(2, p - 2) }; },
  build: ({ p, a }) => { const k = (p - 1) / 2, s2 = a * a % p, s4 = s2 * s2 % p, c = chain(a, k, p), r = c.r, sym = r === 1 ? 1 : -1; return {
   prompt: `The Survey Field files each plot under the remainder of its area on division by the prime ${n(p)}. Mira wants to know whether ${n(a)} is a quadratic residue mod ${n(p)}: the remainder of some whole number squared. Use Euler’s criterion. Enter ${n(a)}${sup(k)} mod ${n(p)} as a least residue (0 to ${n(p - 1)}), then the Legendre symbol (${n(a)}/${n(p)}), typed 1 or −1.`,
   answer: [r, sym],
   hints: ['The exponent is (p − 1) ÷ 2. By Fermat’s little theorem, the square of a to that power leaves remainder 1, so a to the power (p − 1) ÷ 2 leaves either 1 or p − 1, which stands for −1.', 'Euler’s criterion: the Legendre symbol (a/p) is 1 when a to the power (p − 1) ÷ 2 leaves remainder 1, and −1 when it leaves remainder p − 1.'],
   solution: `The exponent is (${n(p)} − 1) ÷ 2 = ${n(k)}. ${c.text} ${r === 1 ? `The remainder is 1, so (${n(a)}/${n(p)}) = 1: ${n(a)} is a quadratic residue mod ${n(p)}.` : `The remainder is ${n(p - 1)}, which is −1 mod ${n(p)}, so (${n(a)}/${n(p)}) = −1: ${n(a)} is not a quadratic residue mod ${n(p)}.`}`,
   guidance: [
    { prompt: `Euler’s criterion raises ${n(a)} to the power (p − 1) ÷ 2. What is that exponent for p = ${n(p)}?`, answer: [k], explanation: `(${n(p)} − 1) ÷ 2 = ${n(k)}.` },
    { prompt: `Square repeatedly, reducing mod ${n(p)} each time. What are ${n(a)}² mod ${n(p)} and ${n(a)}⁴ mod ${n(p)}?`, answer: [s2, s4], explanation: `${n(a)}² = ${red(a * a, p)}, and ${n(a)}⁴ ≡ ${n(s2)}² = ${red(s2 * s2, p)} (mod ${n(p)}).` },
    { prompt: `Combine the squares. What is ${n(a)}${sup(k)} mod ${n(p)}?`, answer: [r], explanation: c.text },
    { prompt: `The remainder is ${n(r)}. What is the Legendre symbol (${n(a)}/${n(p)}), as 1 or −1?`, answer: [sym], explanation: r === 1 ? `A remainder of 1 means (${n(a)}/${n(p)}) = 1.` : `A remainder of ${n(p - 1)} is −1 mod ${n(p)}, so (${n(a)}/${n(p)}) = −1.` }
   ] }; }
 },
 /* (p/q) for a small odd prime p (3 to 13) and an odd prime q from 17 to 97: flip with reciprocity, then reduce q mod p.
    The pair of the worked example, (3/43), is never drawn. */
 q32: {
  canonical: { p: 7, q: 59 },
  draw: R => { let p, q; do { p = R.pick(REC_SMALL); q = R.pick(REC_BIG); } while (p === 3 && q === 43); return { p, q }; },
  build: ({ p, q }) => { const r = q % p, m = (q - r) / p, rs = legendre(r, p), both = p % 4 === 3 && q % 4 === 3, pq = both ? -rs : rs, sq = squaresMod(p); return {
   prompt: `Two survey plots are numbered with the odd primes ${n(p)} and ${n(q)}. Mira needs the Legendre symbol (${n(p)}/${n(q)}), which says whether ${n(p)} is a square mod ${n(q)}. Working mod ${n(q)} is slow, so turn the symbol over with quadratic reciprocity. Enter the remainder of ${n(q)} on division by ${n(p)}, then the symbol (${n(q)}/${n(p)}), then (${n(p)}/${n(q)}), each symbol typed 1 or −1.`,
   answer: [r, rs, pq],
   hints: ['Quadratic reciprocity: for two different odd primes p and q, (p/q) and (q/p) are equal, except when both p and q leave remainder 3 on division by 4; then they are opposite.', 'The symbol (a/p) depends only on the remainder of a on division by p, so reduce the top number first, then compare it with the list of squares mod the small prime.'],
   solution: `Reduce first: ${n(q)} = ${n(m)} × ${n(p)} + ${n(r)}, so (${n(q)}/${n(p)}) = (${n(r)}/${n(p)}). ${sq.length === 1 ? `The only non-zero square mod ${n(p)} is ${n(sq[0])}` : `The non-zero squares mod ${n(p)} are ${listText(sq.map(n))}`}, so ${n(r)} ${rs === 1 ? 'is' : 'is not'} a quadratic residue and (${n(q)}/${n(p)}) = ${n(rs)}. On division by 4, ${n(p)} leaves ${n(p % 4)} and ${n(q)} leaves ${n(q % 4)}. ${both ? 'Both leave 3, so the symbol changes sign when it is turned over' : 'They do not both leave 3, so the symbol keeps its value when it is turned over'}: (${n(p)}/${n(q)}) = ${n(pq)}.`,
   guidance: [
    { prompt: `What remainders do ${n(p)} and ${n(q)} leave on division by 4?`, answer: [p % 4, q % 4], explanation: `${n(p)} = ${n((p - p % 4) / 4)} × 4 + ${n(p % 4)} and ${n(q)} = ${n((q - q % 4) / 4)} × 4 + ${n(q % 4)}. ${both ? 'Both leave 3, so (p/q) = −(q/p).' : 'They do not both leave 3, so (p/q) = (q/p).'}` },
    { prompt: `Reduce the top of the turned symbol (${n(q)}/${n(p)}). What is the remainder of ${n(q)} on division by ${n(p)}?`, answer: [r], explanation: `${n(q)} = ${n(m)} × ${n(p)} + ${n(r)}, so (${n(q)}/${n(p)}) = (${n(r)}/${n(p)}).` },
    { prompt: `${sq.length === 1 ? `The only non-zero square mod ${n(p)} is ${n(sq[0])}` : `The non-zero squares mod ${n(p)} are ${listText(sq.map(n))}`}. What is (${n(r)}/${n(p)}), as 1 or −1?`, answer: [rs], explanation: `${n(r)} ${rs === 1 ? 'is in the list, so the symbol is 1' : 'is not in the list, so the symbol is −1'}.` },
    { prompt: `Now turn back. What is (${n(p)}/${n(q)})?`, answer: [pq], explanation: both ? `The sign flips: (${n(p)}/${n(q)}) = −(${n(q)}/${n(p)}) = ${n(pq)}.` : `The sign stays: (${n(p)}/${n(q)}) = (${n(q)}/${n(p)}) = ${n(pq)}.` }
   ] }; }
 },
 /* A block of 30 to 500 square metres, half the draws a sum of two squares and half not. Not the worked
    example's 65 or 21. */
 q33: {
  canonical: { x: 325 },
  draw: R => { const want = R.bool(); let x, ok; do { x = R.int(30, 500); ok = twoSquares(x).length > 0; } while (ok !== want || x === 65 || x === 21); return { x }; },
  build: ({ x }) => { const f = factor(x), bad = f.filter(([p, e]) => p % 4 === 3 && e % 2 === 1), three = f.filter(([p]) => p % 4 === 3), w = twoSquares(x), yes = bad.length ? 0 : 1;
   const threeText = three.length === 1 ? `Its only prime that leaves remainder 3 on division by 4 is ${n(three[0][0])} (exponent ${n(three[0][1])}).` : three.length ? `Its primes that leave remainder 3 on division by 4 are ${listText(three.map(([p, e]) => `${n(p)} (exponent ${n(e)})`))}.` : 'None of its primes leaves remainder 3 on division by 4.';
   const top = Math.floor(Math.sqrt(x / 2));
   const waysText = yes ? `Trying a = 0 to ${n(top)}: ${w.map(([a, b]) => `${n(x)} = ${n(a)}² + ${n(b)}²`).join(', ')}. That is ${w.length === 1 ? '1 way' : `${n(w.length)} ways`}.` : 'So there are 0 ways.';
   return {
   prompt: `The Survey Field has a block of ${n(x)} square metres to share out as two square plots whose sides are whole numbers of metres, a and b with a ≤ b (a side of 0 means the block is one square plot). Enter 1 if ${n(x)} is a sum of two squares and 0 if it is not, then the number of ways to write ${n(x)} = a² + b² with 0 ≤ a ≤ b.`,
   answer: [yes, w.length],
   hints: ['A whole number is a sum of two squares exactly when every prime in its factorisation that leaves remainder 3 on division by 4 has an even exponent.', 'To count the ways, try each a from 0 upwards while 2a² is at most the number, and check whether the number minus a² is a perfect square.'],
   solution: `${n(x)} = ${factText(x)}. ${threeText} ${yes ? `No such prime has an odd exponent, so ${n(x)} is a sum of two squares.` : `${three.length === 1 ? 'That prime has' : bad.length === 1 ? 'One of them has' : 'Some of them have'} an odd exponent, so ${n(x)} is not a sum of two squares.`} ${waysText}`,
   guidance: [
    { prompt: `Factorise ${n(x)} into primes. How many of its primes that leave remainder 3 on division by 4 have an odd exponent?`, answer: [bad.length], explanation: `${n(x)} = ${factText(x)}. ${threeText}` },
    { prompt: `So is ${n(x)} a sum of two squares? Enter 1 for yes, 0 for no.`, answer: [yes], explanation: yes ? 'Every prime that leaves remainder 3 on division by 4 has an even exponent, so it is.' : 'A prime that leaves remainder 3 on division by 4 has an odd exponent, so it is not.' },
    { prompt: `In how many ways is ${n(x)} = a² + b² with 0 ≤ a ≤ b?`, answer: [w.length], explanation: waysText }
   ] }; }
 },
 /* The Fermat test to base 2 for an odd n from 101 to 599: a sixth of the draws a pseudoprime (341 or 561), a third a
    prime, half a composite that fails. The worked example is n = 15. */
 q34: {
  canonical: { x: 561 },
  draw: R => { const kind = R.int(0, 5); if (kind === 0) return { x: R.pick([341, 561]) }; if (kind <= 2) return { x: R.pick(P101_599) };
   let x; do { x = 2 * R.int(51, 299) + 1; } while (isPrime(x) || x === 341 || x === 561); return { x }; },
  build: ({ x }) => { const c = chain(2, x - 1, x), r = c.r, pass = r === 1 ? 1 : 0, prime = isPrime(x);
   const verdict = pass ? (prime ? `${n(x)} passes the test, and in fact ${n(x)} is prime.` : `${n(x)} passes the test, yet ${n(x)} = ${factText(x)} is composite, so the working above shows that it is a pseudoprime to base 2.`) : `${n(x)} fails the test, so it is certainly composite: ${n(x)} = ${factText(x)}.`;
   return {
   prompt: `The Survey Field’s plot register runs a quick check before it treats a plot number as prime. For the odd number n = ${n(x)}, enter 2ⁿ⁻¹ mod n, that is 2${sup(x - 1)} mod ${n(x)}, as a least residue, then 1 if ${n(x)} passes the Fermat test (the remainder is 1) and 0 if it fails.`,
   answer: [r, pass],
   hints: ['Use repeated squaring: write n − 1 as a sum of powers of 2, square 2 again and again mod n, and multiply the squares you need, reducing mod n after every step.', 'n passes the Fermat test when 2ⁿ⁻¹ leaves remainder 1 on division by n. A fail proves n is composite; a pass does not prove n is prime.'],
   solution: `${c.text} ${verdict}`,
   guidance: [
    { prompt: `The test raises 2 to the power n − 1. What is that power for n = ${n(x)}?`, answer: [x - 1], explanation: `${n(x)} − 1 = ${n(x - 1)}.` },
    { prompt: `With repeated squaring, what is 2${sup(x - 1)} mod ${n(x)}?`, answer: [r], explanation: c.text },
    { prompt: `The remainder is ${n(r)}. Does ${n(x)} pass the Fermat test? Enter 1 for yes, 0 for no.`, answer: [pass], explanation: verdict }
   ] }; }
 },
 /* p/q = [a₀; a₁, a₂, a₃] with a₃ ≥ 2 (so the expansion is the unique one with exactly four partial quotients)
    and p below 1000. Not the worked example's 30/13. */
 q35: {
  canonical: { a0: 2, a1: 3, a2: 1, a3: 4 },
  draw: R => { let p; do { p = { a0: R.int(1, 5), a1: R.int(1, 9), a2: R.int(1, 9), a3: R.int(2, 9) }; } while ((p.a0 * (p.a1 * (p.a2 * p.a3 + 1) + p.a3) + p.a2 * p.a3 + 1) >= 1000); return p; },
  build: ({ a0, a1, a2, a3 }) => { const r1 = a3, r0 = a2 * a3 + 1, q = a1 * r0 + r1, p = a0 * q + r0; return {
   prompt: `Mira sets the cipher wheel from the continued fraction of ${n(p)}/${n(q)}, which has exactly four partial quotients. Enter a₀, a₁, a₂ and a₃, where ${n(p)}/${n(q)} = [a₀; a₁, a₂, a₃].`,
   answer: [a0, a1, a2, a3],
   hints: ['Divide with remainder: a₀ is the quotient of the top by the bottom. Then divide the old bottom by the remainder, and keep going, exactly as in Euclid’s algorithm.', 'The quotients of the divisions, in order, are the partial quotients. Stop when a remainder is 0.'],
   solution: `${n(p)} = ${n(a0)} × ${n(q)} + ${n(r0)}, ${n(q)} = ${n(a1)} × ${n(r0)} + ${n(r1)}, ${n(r0)} = ${n(a2)} × ${n(r1)} + 1 and ${n(r1)} = ${n(a3)} × 1 + 0. The quotients are ${n(a0)}, ${n(a1)}, ${n(a2)} and ${n(a3)}, so ${n(p)}/${n(q)} = [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}].`,
   guidance: [
    { prompt: `Divide ${n(p)} by ${n(q)}. What are the quotient a₀ and the remainder?`, answer: [a0, r0], explanation: `${n(p)} = ${n(a0)} × ${n(q)} + ${n(r0)}.` },
    { prompt: `Now divide ${n(q)} by the remainder ${n(r0)}. What are the quotient a₁ and the new remainder?`, answer: [a1, r1], explanation: `${n(q)} = ${n(a1)} × ${n(r0)} + ${n(r1)}.` },
    { prompt: `Divide ${n(r0)} by ${n(r1)}. What are the quotient a₂ and the new remainder?`, answer: [a2, 1], explanation: `${n(r0)} = ${n(a2)} × ${n(r1)} + 1.` },
    { prompt: `Divide ${n(r1)} by 1. What is the quotient a₃?`, answer: [a3], explanation: `${n(r1)} = ${n(a3)} × 1 + 0. The remainder is 0, so the expansion stops: [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}].` }
   ] }; }
 },
 /* C₂ of [a₀; a₁, a₂, a₃]; a₃ only checks that the player stops at the right place. Not the worked example [1; 2, 3, 4]. */
 q36: {
  canonical: { a0: 3, a1: 4, a2: 2, a3: 5 },
  draw: R => { let p; do { p = { a0: R.int(1, 5), a1: R.int(1, 9), a2: R.int(2, 9), a3: R.int(2, 9) }; } while (p.a0 === 1 && p.a1 === 2 && p.a2 === 3); return p; },
  build: ({ a0, a1, a2, a3 }) => { const p1 = a1 * a0 + 1, q1 = a1, p2 = a2 * p1 + a0, q2 = a2 * q1 + 1; return {
   prompt: `The Cipher Room’s key is the continued fraction [${n(a0)}; ${n(a1)}, ${n(a2)}, ${n(a3)}]. Its convergents are C₀ = [${n(a0)}], C₁ = [${n(a0)}; ${n(a1)}], C₂ = [${n(a0)}; ${n(a1)}, ${n(a2)}] and C₃, the whole fraction. Enter the numerator, then the denominator, of the third convergent C₂, in lowest terms.`,
   answer: [p2, q2],
   hints: ['Start from p₋₁ = 1 and q₋₁ = 0, and C₀ = a₀ ÷ 1, so p₀ = a₀ and q₀ = 1.', 'Each new convergent uses the two before it: pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂. The fractions it gives are already in lowest terms.'],
   solution: `p₀ = ${n(a0)} and q₀ = 1. Then p₁ = ${n(a1)} × ${n(a0)} + 1 = ${n(p1)} and q₁ = ${n(a1)} × 1 + 0 = ${n(q1)}. Then p₂ = ${n(a2)} × ${n(p1)} + ${n(a0)} = ${n(p2)} and q₂ = ${n(a2)} × ${n(q1)} + 1 = ${n(q2)}. So C₂ = ${n(p2)}/${n(q2)}.`,
   guidance: [
    { prompt: `C₀ = [${n(a0)}]. What are its numerator p₀ and denominator q₀?`, answer: [a0, 1], explanation: `C₀ = ${n(a0)} = ${n(a0)}/1.` },
    { prompt: `C₁ = [${n(a0)}; ${n(a1)}] = ${n(a0)} + 1/${n(a1)}. What are p₁ and q₁?`, answer: [p1, q1], explanation: `p₁ = ${n(a1)} × ${n(a0)} + 1 = ${n(p1)} and q₁ = ${n(a1)} × 1 + 0 = ${n(q1)}, so C₁ = ${n(p1)}/${n(q1)}.` },
    { prompt: `Use a₂ = ${n(a2)} with the two convergents before it. What are p₂ and q₂?`, answer: [p2, q2], explanation: `p₂ = ${n(a2)} × ${n(p1)} + ${n(a0)} = ${n(p2)} and q₂ = ${n(a2)} × ${n(q1)} + 1 = ${n(q2)}.` }
   ] }; }
 },
 /* P/Q = [0; a₁, a₂, a₃] with Q < 100, shown rounded to six decimals. Only fractions whose decimal expands as
    [0; a₁, a₂, a₃, A, …] with A ≥ 100 are drawn (52 of them), so cutting before the large quotient always gives P/Q
    after exactly three steps. The reading is given in millionths, because generated text may not show five or more decimals
    (qa/generators.js); its last digit is never 0. Not the worked example 5/26. */
 q37: {
  canonical: { a1: 2, a2: 3, a3: 5 },
  draw: R => { for (;;) { const p = { a1: R.int(1, 6), a2: R.int(1, 6), a3: R.int(2, 6) }, q2 = p.a2 * p.a1 + 1, Q = p.a3 * q2 + p.a1, P = p.a3 * p.a2 + 1;
   if (Q >= 100) continue; const N = Math.round(P / Q * 1e6), c = cfrac(N, 1e6);
   if (N % 10 && c[1] === p.a1 && c[2] === p.a2 && c[3] === p.a3 && c[4] >= 100) return p; } },
  build: ({ a1, a2, a3 }) => { const q2 = a2 * a1 + 1, P = a3 * a2 + 1, Q = a3 * q2 + a1, N = Math.round(P / Q * 1e6);
   const r1 = 1e6 - a1 * N, r2 = N - a2 * r1, r3 = r1 - a3 * r2, big = Math.floor(r2 / r3); return {
   prompt: `A garbled log in the Cipher Room gives the code wheel’s turn per tick as ${n(N)} millionths of a turn: the true value rounded to six decimal places, written as a whole number of millionths. The true value is a fraction whose denominator is under 100. Enter its numerator, then its denominator, in lowest terms.`,
   answer: [P, Q],
   hints: ['Write the reading as a fraction over 1000000 and expand it as a continued fraction with Euclid’s algorithm. Its whole-number part is 0, so a₀ = 0.', 'The rounding shows up as one very large partial quotient. Cut the continued fraction just before it, and work out that convergent with pₖ = aₖ × pₖ₋₁ + pₖ₋₂ and qₖ = aₖ × qₖ₋₁ + qₖ₋₂.'],
   solution: `The reading is ${n(N)}/1000000. Euclid’s algorithm: 1000000 = ${n(a1)} × ${n(N)} + ${n(r1)}, ${n(N)} = ${n(a2)} × ${n(r1)} + ${n(r2)}, ${n(r1)} = ${n(a3)} × ${n(r2)} + ${n(r3)}, and then ${n(r2)} ÷ ${n(r3)} has quotient ${n(big)}. So the reading is [0; ${n(a1)}, ${n(a2)}, ${n(a3)}, ${n(big)}, …]. The partial quotient ${n(big)} is huge, so cut before it: [0; ${n(a1)}, ${n(a2)}, ${n(a3)}]. Convergents: C₁ = 1/${n(a1)}, C₂ = ${n(a2)}/${n(q2)}, C₃ = (${n(a3)} × ${n(a2)} + 1)/(${n(a3)} × ${n(q2)} + ${n(a1)}) = ${n(P)}/${n(Q)}. Check: ${n(P)} ÷ ${n(Q)} × 1000000 ≈ ${n(P * 1e6 / Q)}, which rounds to ${n(N)}.`,
   guidance: [
    { prompt: `Expand ${n(N)}/1000000 with Euclid’s algorithm. a₀ = 0; what are the next three partial quotients a₁, a₂ and a₃?`, answer: [a1, a2, a3], explanation: `1000000 = ${n(a1)} × ${n(N)} + ${n(r1)}, ${n(N)} = ${n(a2)} × ${n(r1)} + ${n(r2)} and ${n(r1)} = ${n(a3)} × ${n(r2)} + ${n(r3)}. The next quotient, ${n(big)}, is huge: that is where the rounding hides.` },
    { prompt: `With p₀ = 0, q₀ = 1, C₁ = 1/${n(a1)}, what are the numerator and denominator of C₂ = [0; ${n(a1)}, ${n(a2)}]?`, answer: [a2, q2], explanation: `p₂ = ${n(a2)} × 1 + 0 = ${n(a2)} and q₂ = ${n(a2)} × ${n(a1)} + 1 = ${n(q2)}.` },
    { prompt: `Cut before the huge quotient. What are the numerator and denominator of C₃ = [0; ${n(a1)}, ${n(a2)}, ${n(a3)}]?`, answer: [P, Q], explanation: `p₃ = ${n(a3)} × ${n(a2)} + 1 = ${n(P)} and q₃ = ${n(a3)} × ${n(q2)} + ${n(a1)} = ${n(Q)}, so the fraction is ${n(P)}/${n(Q)}.` }
   ] }; }
 },
 /* RSA with two primes from 11 to 43 (n below 1000), e from 5 to 17 coprime to φ(n), and a message m coprime to n that
    the key does not leave unchanged. e ≥ 5, so m² and m⁴ are always used. The worked example is n = 33. */
 q38: {
  canonical: { p: 13, q: 37, e: 5, m: 123 },
  draw: R => { for (;;) { const p = R.pick(RSA_PRIMES), q = R.pick(RSA_PRIMES), N = p * q; if (p >= q || N >= 1000) continue;
   const e = R.pick([5, 7, 11, 13, 17]), m = R.int(2, N - 2); if (gcd(e, (p - 1) * (q - 1)) !== 1 || gcd(m, N) !== 1 || pow(m, e, N) === m) continue; return { p, q, e, m }; } },
  build: ({ p, q, e, m }) => { const N = p * q, c = chain(m, e, N), m2 = m * m % N, m4 = m2 * m2 % N; return {
   prompt: `Mira chose the secret primes ${n(p)} and ${n(q)} and published her public key: the modulus n, which is the product of the two primes, and the encryption exponent e = ${n(e)}. To send her the message m = ${n(m)} with RSA, enter n, then the ciphertext c = ${n(m)}${sup(e)} mod n as a least residue.`,
   answer: [N, c.r],
   hints: ['The modulus n is the product of the two primes.', 'Work out mᵉ mod n by repeated squaring: square m again and again, reducing mod n each time, then multiply the powers whose exponents add up to e.'],
   solution: `n = ${n(p)} × ${n(q)} = ${n(N)}. ${c.text} The ciphertext is c = ${n(c.r)}.`,
   guidance: [
    { prompt: `What is the modulus n = ${n(p)} × ${n(q)}?`, answer: [N], explanation: `${n(p)} × ${n(q)} = ${n(N)}.` },
    { prompt: `Square the message twice. What are ${n(m)}² mod ${n(N)} and ${n(m)}⁴ mod ${n(N)}?`, answer: [m2, m4], explanation: `${n(m)}² = ${red(m * m, N)}, and ${n(m)}⁴ ≡ ${n(m2)}² = ${red(m2 * m2, N)} (mod ${n(N)}).` },
    { prompt: `Combine the powers. What is the ciphertext ${n(m)}${sup(e)} mod ${n(N)}?`, answer: [c.r], explanation: c.text }
   ] }; }
 },
 /* RSA decryption with two primes from 5 to 23 (n from 50 to 399), e from 3 to 17 coprime to φ(n) with d ≠ e, and a
    message coprime to n that the key moves. The worked example is n = 55, which no draw uses. */
 q39: {
  canonical: { p: 11, q: 23, e: 3, m: 42 },
  draw: R => { for (;;) { const p = R.pick(KEY_PRIMES), q = R.pick(KEY_PRIMES), N = p * q, phi = (p - 1) * (q - 1); if (p >= q || N < 50 || N >= 400 || N === 55) continue;
   const e = R.pick([3, 5, 7, 11, 13, 17]), m = R.int(2, N - 2); if (e >= phi || gcd(e, phi) !== 1 || inverse(e, phi) === e || gcd(m, N) !== 1 || pow(m, e, N) === m) continue; return { p, q, e, m }; } },
  build: ({ p, q, e, m }) => { const N = p * q, phi = (p - 1) * (q - 1), d = inverse(e, phi), c = pow(m, e, N), k = (e * d - 1) / phi, ch = chain(c, d, N);
   const steps = []; { let A = phi, B = e; while (B) { steps.push(`${n(A)} = ${n(Math.floor(A / B))} × ${n(B)} + ${n(A % B)}`); [A, B] = [B, A % B]; } }
   return {
   prompt: `A reply for the outpost arrived as the RSA ciphertext c = ${n(c)}. The public key is n = ${n(N)} with encryption exponent e = ${n(e)}, and Mira keeps the secret primes: ${n(N)} = ${n(p)} × ${n(q)}. Enter φ(n), then the decryption exponent d (the inverse of e mod φ(n), from 1 to φ(n) − 1), then the message m = cᵈ mod n as a least residue.`,
   answer: [phi, d, m],
   hints: ['For two different primes, φ(pq) = (p − 1) × (q − 1).', 'd is the number from 1 to φ(n) − 1 with e × d leaving remainder 1 on division by φ(n): find it with Euclid’s algorithm worked backwards. Then work out cᵈ mod n by repeated squaring.'],
   solution: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(phi)}. Euclid’s algorithm on ${n(phi)} and ${n(e)}: ${steps.join(', ')}. Working backwards gives d = ${n(d)}; check: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1. ${ch.text} The message is m = ${n(m)}.`,
   guidance: [
    { prompt: `${n(N)} = ${n(p)} × ${n(q)}. What is φ(${n(N)})?`, answer: [phi], explanation: `φ(${n(N)}) = (${n(p)} − 1) × (${n(q)} − 1) = ${n(p - 1)} × ${n(q - 1)} = ${n(phi)}.` },
    { prompt: `Find d from 1 to ${n(phi - 1)} with ${n(e)} × d leaving remainder 1 on division by ${n(phi)}.`, answer: [d], explanation: `${steps.join(', ')}. Working backwards gives d = ${n(d)}: ${n(e)} × ${n(d)} = ${n(e * d)} = ${n(k)} × ${n(phi)} + 1.` },
    { prompt: `Decrypt. What is ${n(c)}${sup(d)} mod ${n(N)}?`, answer: [m], explanation: ch.text }
   ] }; }
 },
 /* The divisor network on 1 … N for N from 12 to 40, and gcd(x, y) of two numbers up to N with neither dividing the
    other and gcd at least 2. Not the worked example's N = 6. */
 q40: {
  canonical: { N: 24, x: 16, y: 20 },
  draw: R => { for (;;) { const N = R.int(12, 40), x = R.int(4, N - 1), y = R.int(x + 1, N); if (y % x === 0 || gcd(x, y) < 2) continue; return { N, x, y }; } },
  build: ({ N, x, y }) => { const half = Math.floor(N / 2), counts = []; for (let a = 1; a <= half; a++) counts.push(Math.floor(N / a) - 1);
   const links = counts.reduce((s, v) => s + v, 0), g = gcd(x, y); return {
   prompt: `For the hand-over to the Map Room, Mira draws the outpost’s divisor network: one dot for each code number from 1 to ${n(N)}, and one link between a and b whenever a < b and a divides b. Enter the number of links in the network, then gcd(${n(x)}, ${n(y)}), the largest code number that divides both ${n(x)} and ${n(y)}.`,
   answer: [links, g],
   hints: ['The links that go up from a lead to its multiples 2a, 3a, … that are at most N. There are (the quotient of N ÷ a) − 1 of them.', 'Add these counts for a = 1, 2, 3 and so on. Once a is more than half of N, it has no multiple left to link to. For the gcd, compare the two prime factorisations and keep the smaller exponent of each prime.'],
   solution: `Links going up from a = 1, 2, …, ${n(half)}: ${counts.map(n).join(' + ')} = ${n(links)}; a number above ${n(half)} has no multiple up to ${n(N)}. So the network has ${n(links)} links. ${n(x)} = ${factText(x)} and ${n(y)} = ${factText(y)}, so gcd(${n(x)}, ${n(y)}) = ${n(g)}.`,
   guidance: [
    { prompt: `How many links go up from 1, from 2 and from 3 when the numbers run to ${n(N)}?`, answer: [N - 1, Math.floor(N / 2) - 1, Math.floor(N / 3) - 1], explanation: `1 divides every number from 2 to ${n(N)}: ${n(N - 1)} links. The quotient of ${n(N)} ÷ 2 is ${n(Math.floor(N / 2))}, so 2 has ${n(Math.floor(N / 2) - 1)}; the quotient of ${n(N)} ÷ 3 is ${n(Math.floor(N / 3))}, so 3 has ${n(Math.floor(N / 3) - 1)}.` },
    { prompt: `Add the counts for every a up to ${n(half)}. How many links are there in all?`, answer: [links], explanation: `${counts.map(n).join(' + ')} = ${n(links)}.` },
    { prompt: `What is gcd(${n(x)}, ${n(y)})?`, answer: [g], explanation: `${n(x)} = ${factText(x)} and ${n(y)} = ${factText(y)}; the shared part is ${factText(g) === n(g) ? n(g) : `${factText(g)} = ${n(g)}`}.` }
   ] }; }
 }
});
})();
