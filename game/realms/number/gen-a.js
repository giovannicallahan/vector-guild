/* Number theory: the hidden life of whole numbers mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, par } = G;
/* Small helpers shared by the generators below. */
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const isPrime = v => { if (v < 2) return false; for (let d = 2; d * d <= v; d++) if (v % d === 0) return false; return true; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = e => String(e).split('').map(d => SUP[d]).join('');
const sub = e => String(e).split('').map(d => SUB[d]).join('');
/* "2⁴ × 3² × 5": the primes with a non-zero exponent, an exponent 1 left unwritten. */
const fact = pairs => pairs.filter(([, e]) => e > 0).map(([p, e]) => e === 1 ? n(p) : n(p) + sup(e)).join(' × ');
/* "2, 3 and 5" */
const list = xs => xs.length < 2 ? xs.map(n).join('') : xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
/* Euclid's algorithm: every division a = q × b + r, down to the one with remainder 0. */
const euclid = (a, b) => { const rows = []; while (b) { const q = Math.floor(a / b), r = a % b; rows.push({ a, b, q, r }); [a, b] = [b, r]; } return { g: a, rows }; };
/* Extended Euclid: [g, x, y] with ax + by = g (the coefficients that working back up Euclid's lines gives). */
const ext = (a, b) => { if (b === 0) return [a, 1, 0]; const [g, x, y] = ext(b, a % b); return [g, y, x - Math.floor(a / b) * y]; };
/* Exponents of 2, 3, 5 and 7 in n. */
const exps = v => [2, 3, 5, 7].map(p => { let e = 0; while (v % p === 0) { v /= p; e++; } return e; });
const POW = (p, e) => Math.pow(p, e);
/* q08: "(1, 22) and (6, 11)" */
const list2 = ps => { const t = ps.map(([u, v]) => `(${n(u)}, ${n(v)})`); return t.length < 2 ? t.join('') : t.slice(0, -1).join(', ') + ' and ' + t[t.length - 1]; };
const times = k => k === 0 ? 'no times' : k === 1 ? 'once' : `${n(k)} times`;
/* q04: "no divisions", "one division", "3 divisions". */
const divs = k => k === 0 ? 'no divisions' : k === 1 ? 'one division' : `${n(k)} divisions`;
const sigmaPP = (p, e) => (POW(p, e + 1) - 1) / (p - 1);
const powSum = (p, e) => Array.from({ length: e + 1 }, (_, i) => n(POW(p, i))).join(' + ');
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* a = bq + r for a delivery a and for a shortfall −m. Neither a nor m is a multiple of b, so both remainders are
    above 0 and the negative case needs the extra step down. Not the worked example (53 ÷ 7, −20 ÷ 6). */
 q01: {
  canonical: { a: 287, b: 12, m: 95 },
  draw: R => { let p; do { p = { a: R.int(40, 999), b: R.int(3, 15), m: R.int(10, 200) }; } while (p.a % p.b === 0 || p.m % p.b === 0 || p.m < p.b || p.a < 2 * p.b || (p.a === 53 && p.b === 7) || (p.m === 20 && p.b === 6) || (p.a === 287 && p.b === 12)); return p; },
  build: ({ a, b, m }) => { const q1 = Math.floor(a / b), r1 = a - b * q1, mq = Math.floor(m / b), mr = m - b * mq, Q = mq + 1, r2 = b * Q - m; return {
   prompt: `A delivery of ${n(a)} bolts reaches the crate store, and each crate holds ${n(b)} bolts. Write ${n(a)} = ${n(b)}q + r with 0 ≤ r < ${n(b)}, and enter the quotient q (the full crates) and the remainder r (the bolts left over). The stock ledger also shows −${n(m)}: the store owes ${n(m)} bolts. Write −${n(m)} = ${n(b)}q + r with 0 ≤ r < ${n(b)} too, and enter that q and r.`,
   answer: [q1, r1, -Q, r2],
   hints: ['The quotient is how many whole times the divisor fits into the number; the remainder is what is left, and it must be at least zero and less than the divisor.', 'For a negative number, go down to the first multiple of the divisor at or below it. That gives a negative quotient, and the remainder is the distance back up.'],
   solution: `${n(b)} × ${n(q1)} = ${n(b * q1)} and ${n(a)} − ${n(b * q1)} = ${n(r1)}, so ${n(a)} = ${n(b)} × ${n(q1)} + ${n(r1)}: q = ${n(q1)} and r = ${n(r1)}. For −${n(m)}: ${n(m)} = ${n(b)} × ${n(mq)} + ${n(mr)}, so −${n(b * mq)} is above −${n(m)}, and the first multiple of ${n(b)} at or below −${n(m)} is ${n(b)} × (−${n(Q)}) = −${n(b * Q)}. From −${n(b * Q)} up to −${n(m)} is ${n(r2)}, so −${n(m)} = ${n(b)} × (−${n(Q)}) + ${n(r2)}: q = −${n(Q)} and r = ${n(r2)}.`,
   guidance: [
    { prompt: `How many whole times does ${n(b)} go into ${n(a)}, and how many bolts are left over?`, answer: [q1, r1], explanation: `${n(b)} × ${n(q1)} = ${n(b * q1)} is the largest multiple of ${n(b)} that is not above ${n(a)}, and ${n(a)} − ${n(b * q1)} = ${n(r1)}, which is less than ${n(b)}.` },
    { prompt: `Leave the minus sign aside for a moment and divide ${n(m)} by ${n(b)}. What are the quotient and the remainder?`, answer: [mq, mr], explanation: `${n(m)} = ${n(b)} × ${n(mq)} + ${n(mr)}. Putting a minus in front would give a remainder of −${n(mr)}, which is not allowed.` },
    { prompt: `The remainder may not be negative, so go one more multiple of ${n(b)} down, below −${n(m)}. What are q and r for −${n(m)}?`, answer: [-Q, r2], explanation: `${n(b)} × (−${n(Q)}) = −${n(b * Q)} is the first multiple at or below −${n(m)}, and −${n(m)} − (−${n(b * Q)}) = ${n(r2)}, so −${n(m)} = ${n(b)} × (−${n(Q)}) + ${n(r2)}.` }
   ] }; }
 },
 /* A four-digit base-b numeral to read, and a count n with b³ ≤ n < b⁴ to write in four base-b digits.
    Not the worked example ((123) in base 5, and 47 in base 4). */
 q02: {
  canonical: { b: 6, w: 2, x: 3, y: 5, z: 1, k: 845 },
  draw: R => { let p; do { const b = R.int(3, 9); p = { b, w: R.int(1, b - 1), x: R.int(0, b - 1), y: R.int(0, b - 1), z: R.int(0, b - 1), k: R.int(b * b * b, b * b * b * b - 1) }; } while (p.b === 6 && p.k === 845); return p; },
  build: ({ b, w, x, y, z, k }) => { const b2 = b * b, b3 = b2 * b, V = w * b3 + x * b2 + y * b + z;
   const q1 = Math.floor(k / b), e0 = k % b, q2 = Math.floor(q1 / b), e1 = q1 % b, e3 = Math.floor(q2 / b), e2 = q2 % b; return {
   prompt: `The crate store’s old labeller works in base ${n(b)}, so it prints only the digits 0 to ${n(b - 1)}. One crate is labelled (${w}${x}${y}${z})${sub(b)}. Enter the number of parts in that crate, written in base ten (type it without commas). Then the labeller must print a new count of ${n(k)} parts in base ${n(b)}, which takes exactly four digits: enter those digits from left to right.`,
   answer: [V, e3, e2, e1, e0],
   hints: ['In a base, each place from the right is worth the base times the place before it: ones, then the base, then the base squared, then the base cubed. Multiply each digit by its place value and add.', 'To write a number in a base, divide by the base again and again. The remainders are the digits from the right, so read them from the last one back to the first.'],
   solution: `In base ${n(b)} the four places are worth ${n(b3)}, ${n(b2)}, ${n(b)} and 1, so (${w}${x}${y}${z})${sub(b)} = ${n(w)} × ${n(b3)} + ${n(x)} × ${n(b2)} + ${n(y)} × ${n(b)} + ${n(z)} = ${n(V)}. For ${n(k)}: ${n(k)} = ${n(b)} × ${n(q1)} + ${n(e0)}, ${n(q1)} = ${n(b)} × ${n(q2)} + ${n(e1)}, ${n(q2)} = ${n(b)} × ${n(e3)} + ${n(e2)}, and ${n(e3)} = ${n(b)} × 0 + ${n(e3)}. Reading the remainders from the last to the first gives (${e3}${e2}${e1}${e0})${sub(b)}.`,
   guidance: [
    { prompt: `In base ${n(b)}, what are the place values of the first two of the four places, ${n(b)}³ and ${n(b)}²?`, answer: [b3, b2], explanation: `${n(b)}³ = ${n(b)} × ${n(b)} × ${n(b)} = ${n(b3)} and ${n(b)}² = ${n(b)} × ${n(b)} = ${n(b2)}. The last two places are worth ${n(b)} and 1.` },
    { prompt: `What is (${w}${x}${y}${z})${sub(b)} in base ten?`, answer: [V], explanation: `${n(w)} × ${n(b3)} + ${n(x)} × ${n(b2)} + ${n(y)} × ${n(b)} + ${n(z)} × 1 = ${n(w * b3)} + ${n(x * b2)} + ${n(y * b)} + ${n(z)} = ${n(V)}.` },
    { prompt: `Divide ${n(k)} by ${n(b)}. What are the quotient and the remainder? The remainder is the last digit.`, answer: [q1, e0], explanation: `${n(k)} = ${n(b)} × ${n(q1)} + ${n(e0)}, so the ones digit in base ${n(b)} is ${n(e0)}, and the rest of the number is ${n(q1)} groups of ${n(b)}.` },
    { prompt: `Keep dividing each quotient by ${n(b)}. What are the four digits of ${n(k)} in base ${n(b)}, from left to right?`, answer: [e3, e2, e1, e0], explanation: `${n(q1)} = ${n(b)} × ${n(q2)} + ${n(e1)} and ${n(q2)} = ${n(b)} × ${n(e3)} + ${n(e2)}, and ${n(e3)} is less than ${n(b)}, so the digits are ${n(e3)}, ${n(e2)}, ${n(e1)}, ${n(e0)}. Check: ${n(e3)} × ${n(b3)} + ${n(e2)} × ${n(b2)} + ${n(e1)} × ${n(b)} + ${n(e0)} = ${n(k)}.` }
   ] }; }
 },
 /* An odd n from 101 to 997, either a prime or p × q with p ≤ q odd primes; and a limit N from 20 to 100.
    Not the worked example (221 and 30). */
 q03: {
  canonical: { k: 391, N: 60 },
  draw: R => { let p; do { let k; if (R.next() < 0.25) { do { k = R.int(101, 997); } while (!isPrime(k)); }
    else { let a, b; do { a = R.pick([3, 5, 7, 11, 13, 17, 19, 23, 29, 31]); b = R.pick(PRIMES.concat([101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199])); k = a * b; } while (b < a || k < 101 || k > 997); }
    p = { k, N: R.int(20, 100) }; } while (p.k === 221 || p.N === 30 || (p.k === 391 && p.N === 60)); return p; },
  build: ({ k, N }) => { const s = Math.floor(Math.sqrt(k)), small = PRIMES.filter(p => p <= s), spf = small.find(p => k % p === 0) || k,
   failed = small.filter(p => p < spf), upto = PRIMES.filter(p => p <= N);
   const first = spf === k
    ? `None of the primes up to ${n(s)} (${list(small)}) divides ${n(k)}, so ${n(k)} is prime and the smallest crate size is ${n(k)} itself: one crate holding everything.`
    : `${list(failed)} ${failed.length === 1 ? 'does' : 'do'} not divide ${n(k)}, but ${n(spf)} does: ${n(k)} = ${n(spf)} × ${n(k / spf)}. So ${n(k)} is composite and the smallest crate size is ${n(spf)}.`;
   return {
   prompt: `A delivery of ${n(k)} washers must go into equal crates with nothing left over, each crate holding more than 1 washer. Enter the smallest crate size that works (if ${n(k)} is prime, the only size is a single crate of all ${n(k)}). Then the store keeps one shelf for each prime from 2 up to ${n(N)}, including ${n(N)} if it is prime: enter how many shelves that is.`,
   answer: [spf, upto.length],
   hints: ['Test the primes in order, smallest first. You only need primes whose square is not more than the number: if none of those divides it, the number is prime.', 'For the count, write out the numbers from two up to the limit and cross out every multiple of each prime up to seven, but not the prime itself. What is left are the primes.'],
   solution: `${n(s)} × ${n(s)} = ${n(s * s)} is not more than ${n(k)}, but ${n(s + 1)} × ${n(s + 1)} = ${n((s + 1) * (s + 1))} is, so only primes up to ${n(s)} need testing. ${first} The sieve leaves these primes up to ${n(N)}: ${list(upto)}. There are ${n(upto.length)} of them.`,
   guidance: [
    { prompt: `What is the largest whole number whose square is not more than ${n(k)}? Only primes up to it need testing.`, answer: [s], explanation: `${n(s)} × ${n(s)} = ${n(s * s)} and ${n(s + 1)} × ${n(s + 1)} = ${n((s + 1) * (s + 1))}, which is more than ${n(k)}. If ${n(k)} had two factors both bigger than ${n(s)}, their product would be too big.` },
    { prompt: `Test the primes from 2 up to ${n(s)} in order. What is the smallest crate size?`, answer: [spf], explanation: first },
    { prompt: `In the list from 2 to ${n(N)}, cross out the multiples of 2, 3, 5 and 7 but not those four primes. How many numbers are left?`, answer: [upto.length], explanation: `Every composite number up to ${n(N)} has a prime factor no bigger than 7, so it is crossed out. What is left are the primes: ${list(upto)}, which is ${n(upto.length)} numbers.` }
   ] }; }
 },
 /* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ from 100 to 10000 with at least three of the four primes. Not the worked example (360). */
 q04: {
  canonical: { a: 4, b: 2, c: 1, d: 1 },
  draw: R => { let p, v; do { p = { a: R.int(0, 6), b: R.int(0, 4), c: R.int(0, 3), d: R.int(0, 2) }; v = POW(2, p.a) * POW(3, p.b) * POW(5, p.c) * POW(7, p.d); } while (v < 100 || v > 10000 || [p.a, p.b, p.c, p.d].filter(e => e > 0).length < 3 || v === 360 || v === 5040); return p; },
  build: ({ a, b, c, d }) => { const k = POW(2, a) * POW(3, b) * POW(5, c) * POW(7, d), m1 = k / POW(2, a), m2 = m1 / POW(3, b), m3 = m2 / POW(5, c), F = fact([[2, a], [3, b], [5, c], [7, d]]); return {
   prompt: `The crate store files every delivery under its prime factorisation. A delivery of ${n(k)} rivets has arrived. Write ${n(k)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ and enter the exponents a, b, c and d, in that order. An exponent is 0 when that prime does not divide ${n(k)}.`,
   answer: [a, b, c, d],
   hints: ['Divide by the smallest prime for as long as the result stays a whole number, counting the divisions. Then do the same with the next prime, and the next.', 'Check by multiplying the prime powers back together: you must get the number you started with.'],
   solution: `Dividing ${n(k)} by 2 for as long as possible takes ${divs(a)} and leaves ${n(m1)}. Dividing ${n(m1)} by 3 takes ${divs(b)} and leaves ${n(m2)}. Dividing ${n(m2)} by 5 takes ${divs(c)} and leaves ${n(m3)}, and ${n(m3)} = 7${sup(d)}. So ${n(k)} = ${F}, and the exponents are ${n(a)}, ${n(b)}, ${n(c)} and ${n(d)}.`,
   guidance: [
    { prompt: `How many times can ${n(k)} be halved before the result is odd, and what odd number is left?`, answer: [a, m1], explanation: `Halving ${n(k)} takes ${divs(a)} before the result is odd: ${n(m1)} is left, so the exponent of 2 is ${n(a)}.` },
    { prompt: `How many times can ${n(m1)} be divided by 3, and what is left?`, answer: [b, m2], explanation: `Dividing ${n(m1)} by 3 takes ${divs(b)} before 3 no longer divides: ${n(m2)} is left, so the exponent of 3 is ${n(b)}.` },
    { prompt: `What are the exponents of 5 and of 7 in ${n(m2)}?`, answer: [c, d], explanation: `${n(m2)} = 5${sup(c)} × 7${sup(d)} (a power 0 is 1), so the exponents of 5 and 7 are ${n(c)} and ${n(d)}. Altogether ${n(k)} = ${F}.` }
   ] }; }
 },
 /* A and B built from 2, 3, 5, 7, from 20 to 1000, gcd above 1, neither dividing the other. Not the worked example (12, 18). */
 q05: {
  canonical: { a2: 3, a3: 2, a5: 1, a7: 0, b2: 2, b3: 3, b5: 0, b7: 1 },
  draw: R => { let p, A, B; do { p = { a2: R.int(0, 3), a3: R.int(0, 3), a5: R.int(0, 2), a7: R.int(0, 1), b2: R.int(0, 3), b3: R.int(0, 3), b5: R.int(0, 2), b7: R.int(0, 1) };
    A = POW(2, p.a2) * POW(3, p.a3) * POW(5, p.a5) * POW(7, p.a7); B = POW(2, p.b2) * POW(3, p.b3) * POW(5, p.b5) * POW(7, p.b7); }
   while (A < 20 || B < 20 || A > 1000 || B > 1000 || A % B === 0 || B % A === 0 || gcd(A, B) === 1 || (A === 360 && B === 756) || (A === 12 && B === 18) || (A === 18 && B === 12)); return p; },
  build: ({ a2, a3, a5, a7, b2, b3, b5, b7 }) => { const ea = [a2, a3, a5, a7], eb = [b2, b3, b5, b7], P = [2, 3, 5, 7];
   const A = P.reduce((s, p, i) => s * POW(p, ea[i]), 1), B = P.reduce((s, p, i) => s * POW(p, eb[i]), 1);
   const lo = P.map((p, i) => [p, Math.min(ea[i], eb[i])]), hi = P.map((p, i) => [p, Math.max(ea[i], eb[i])]);
   const g = lo.reduce((s, [p, e]) => s * POW(p, e), 1), L = hi.reduce((s, [p, e]) => s * POW(p, e), 1); return {
   prompt: `Bolts reach the crate store in boxes of ${n(A)} and nuts in boxes of ${n(B)}. Mira wants the largest crate size that packs a box of bolts, and also a box of nuts, into equal crates with nothing left over. She also wants the smallest stock that is a whole number of bolt boxes and also a whole number of nut boxes. Factorise both numbers, then enter gcd(${n(A)}, ${n(B)}) and lcm(${n(A)}, ${n(B)}) (type them without commas).`,
   answer: [g, L],
   hints: ['For the greatest common divisor, take each prime to the smaller of its two exponents. A prime missing from either number is left out.', 'For the least common multiple, take each prime to the larger of its two exponents.'],
   solution: `${n(A)} = ${fact(P.map((p, i) => [p, ea[i]]))} and ${n(B)} = ${fact(P.map((p, i) => [p, eb[i]]))}. The smaller exponents give gcd = ${fact(lo)} = ${n(g)}, and the larger exponents give lcm = ${fact(hi)} = ${n(L)}. Check: ${n(g)} × ${n(L)} = ${n(g * L)}, which is ${n(A)} × ${n(B)}.`,
   guidance: [
    { prompt: `Write ${n(A)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are the four exponents?`, answer: ea, explanation: `${n(A)} = ${fact(P.map((p, i) => [p, ea[i]]))}, so the exponents are ${n(a2)}, ${n(a3)}, ${n(a5)} and ${n(a7)}.` },
    { prompt: `Now write ${n(B)} the same way. What are its four exponents?`, answer: eb, explanation: `${n(B)} = ${fact(P.map((p, i) => [p, eb[i]]))}, so the exponents are ${n(b2)}, ${n(b3)}, ${n(b5)} and ${n(b7)}.` },
    { prompt: `Take each prime to the smaller of its two exponents. What is gcd(${n(A)}, ${n(B)})?`, answer: [g], explanation: `The smaller exponents of 2, 3, 5 and 7 are ${lo.map(([, e]) => n(e)).join(', ')}, so the gcd is ${fact(lo)} = ${n(g)}.` },
    { prompt: `Take each prime to the larger of its two exponents. What is lcm(${n(A)}, ${n(B)})?`, answer: [L], explanation: `The larger exponents are ${hi.map(([, e]) => n(e)).join(', ')}, so the lcm is ${fact(hi)} = ${n(L)}.` }
   ] }; }
 },
 /* a = g × a′ and b = g × b′ with a′, b′ sharing no factor, a ≤ 5000, b ≥ 100, four to eight divisions.
    Not the worked example (84, 30). */
 q06: {
  canonical: { a: 4389, b: 1683 },
  draw: R => { let p, e; do { const g = R.int(2, 40), b1 = R.int(5, 200), a1 = R.int(b1 + 1, 400); p = { a: g * a1, b: g * b1 }; e = gcd(a1, b1) === 1 ? euclid(p.a, p.b) : null; }
   while (!e || p.a > 5000 || p.b < 100 || e.rows.length < 4 || e.rows.length > 8 || (p.a === 4389 && p.b === 1683)); return p; },
  build: ({ a, b }) => { const { g, rows } = euclid(a, b), k = rows.length, r1 = rows[0], r2 = rows[1];
   const lines = rows.map(r => `${n(r.a)} = ${n(r.q)} × ${n(r.b)} + ${n(r.r)}`).join('; '); return {
   prompt: `Two deliveries, of ${n(a)} cans and of ${n(b)} cans, must be packed into crates of one size with nothing left over, and Mira wants the largest such size without factorising. Run Euclid’s algorithm: divide ${n(a)} by ${n(b)}, then divide each divisor by the remainder it left, until a remainder is 0. Enter gcd(${n(a)}, ${n(b)}), then the number of divisions you made, counting the last one, whose remainder is 0.`,
   answer: [g, k],
   hints: ['Each new division divides the previous divisor by the previous remainder. The remainders keep getting smaller, so the process must stop.', 'The greatest common divisor is the last remainder that is not zero: the divisor in the final division.'],
   solution: `${lines}. The last remainder that is not 0 is ${n(g)}, so gcd(${n(a)}, ${n(b)}) = ${n(g)}, found in ${n(k)} divisions.`,
   guidance: [
    { prompt: `First division: ${n(a)} = q × ${n(b)} + r. What are q and r?`, answer: [r1.q, r1.r], explanation: `${n(r1.q)} × ${n(b)} = ${n(r1.q * b)}, and ${n(a)} − ${n(r1.q * b)} = ${n(r1.r)}, so ${n(a)} = ${n(r1.q)} × ${n(b)} + ${n(r1.r)}.` },
    { prompt: `Second division: ${n(b)} = q × ${n(r1.r)} + r. What are q and r?`, answer: [r2.q, r2.r], explanation: `${n(r2.q)} × ${n(r1.r)} = ${n(r2.q * r1.r)}, and ${n(b)} − ${n(r2.q * r1.r)} = ${n(r2.r)}. Every number that divides both ${n(a)} and ${n(b)} also divides ${n(r1.r)} and ${n(r2.r)}, so the gcd has not changed.` },
    { prompt: 'Keep going until a remainder is 0. What is the gcd, and how many divisions did you make in all?', answer: [g, k], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}, and there were ${n(k)} divisions.` }
   ] }; }
 },
 /* ax + by = g with a > b, b ÷ g at least 3 and a not a multiple of b. Not the worked example (17, 5). */
 q07: {
  canonical: { a: 84, b: 33 },
  draw: R => { let p; do { const g = R.pick([1, 1, 2, 3, 4, 5, 6, 7]), b1 = R.int(3, 30), a1 = R.int(b1 + 1, 60); p = { a: g * a1, b: g * b1, ok: gcd(a1, b1) === 1 }; }
   while (!p.ok || p.a > 200 || p.b < 10 || (p.a === 84 && p.b === 33) || (p.a === 17 && p.b === 5)); delete p.ok; return p; },
  build: ({ a, b }) => { const [g, x0, y0] = ext(a, b), sb = b / g, sa = a / g;
   let x = ((x0 % sb) + sb) % sb; if (x === 0) x = sb; const t = (x - x0) / sb, y = y0 - sa * t;
   const lines = euclid(a, b).rows.map(r => `${n(r.a)} = ${n(r.q)} × ${n(r.b)} + ${n(r.r)}`).join('; ');
   const move = t === 0 ? 'This x is already the smallest positive choice.' : `Adding ${n(sb)} to x and taking ${n(sa)} from y keeps the total the same; doing that ${t > 0 ? times(t) : times(-t) + ' in reverse'} gives the smallest positive x.`; return {
   prompt: `The fuel depot has only two measuring cans, holding ${n(a)} litres and ${n(b)} litres. Mira can pour full ${n(a)}-litre cans into a tank and scoop full ${n(b)}-litre cans back out, and the smallest positive amount she can leave in the tank this way is gcd(${n(a)}, ${n(b)}) litres. Find whole numbers x and y with ${n(a)}x + ${n(b)}y = gcd(${n(a)}, ${n(b)}), taking x as the smallest positive choice; y comes out negative, the cans scooped out. Enter the gcd, then x, then y.`,
   answer: [g, x, y],
   hints: ['Run Euclid’s algorithm, then work back up from the last line: write the gcd using the last two remainders, and replace each remainder by the division that made it.', 'From one solution you get another by adding b ÷ gcd to x and taking a ÷ gcd from y. Use this to bring x down to the smallest positive value.'],
   solution: `Euclid’s algorithm: ${lines}, so the gcd is ${n(g)}. Working back up the lines gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. ${move} So x = ${n(x)} and y = ${n(y)}. Check: ${n(a)} × ${n(x)} − ${n(b)} × ${n(-y)} = ${n(a * x)} − ${n(-b * y)} = ${n(g)}.`,
   guidance: [
    { prompt: `Run Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
    { prompt: `If ${n(a)}x + ${n(b)}y = ${n(g)}, by how much can x go up, and y go down, so that the total stays ${n(g)}? Use the smallest whole steps.`, answer: [sb, sa], explanation: `${n(a)} × ${n(sb)} = ${n(b)} × ${n(sa)} = ${n(a * sb)}, so adding ${n(sb)} to x adds ${n(a * sb)} and taking ${n(sa)} from y removes the same amount. These are ${n(b)} ÷ ${n(g)} and ${n(a)} ÷ ${n(g)}.` },
    { prompt: 'Work back up Euclid’s lines to get one solution, then shift it. What are the smallest positive x and its y?', answer: [x, y], explanation: `Working back gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. ${move} So x = ${n(x)} and y = ${n(y)}.` }
   ] }; }
 },
 /* ax + by = c in positive whole numbers with two to six solutions. Not the worked example (3x + 5y = 31). */
 q08: {
  canonical: { a: 7, b: 11, c: 200 },
  draw: R => { let p, s; do { p = { a: R.int(3, 15), b: R.int(4, 20), c: R.int(30, 300) }; const g = gcd(p.a, p.b);
    s = []; if (p.c % g === 0 && p.a !== p.b && p.b / g >= 2 && p.a / g >= 2) for (let x = 1; p.a * x < p.c; x++) if ((p.c - p.a * x) % p.b === 0) s.push(x); }
   while (s.length < 2 || s.length > 6 || (p.a === 7 && p.b === 11 && p.c === 200) || (p.a === 3 && p.b === 5 && p.c === 31)); return p; },
  build: ({ a, b, c }) => { const g = gcd(a, b), sb = b / g, sa = a / g, pairs = [];
   for (let x = 1; a * x < c; x++) if ((c - a * x) % b === 0) pairs.push([x, (c - a * x) / b]);
   const [x, y] = pairs[0], k = pairs.length; return {
   prompt: `A tank at the fuel depot needs exactly ${n(c)} litres, and the only cans hold ${n(a)} litres and ${n(b)} litres. Mira pours in x full ${n(a)}-litre cans and y full ${n(b)}-litre cans, using at least one of each, so ${n(a)}x + ${n(b)}y = ${n(c)} with x and y positive whole numbers. Enter how many such pairs (x, y) there are, then the smallest x among them.`,
   answer: [k, x],
   hints: ['There are whole-number solutions only when gcd(a, b) divides c. Once you have one solution, every other one comes from adding b ÷ gcd to x and taking a ÷ gcd from y.', 'Start from the smallest positive x that works, then keep shifting until y would drop below one. Count the pairs on the way.'],
   solution: `gcd(${n(a)}, ${n(b)}) = ${n(g)}, which divides ${n(c)}, so there are whole-number solutions; whether any are positive is checked next. The smallest positive x that leaves a multiple of ${n(b)} is x = ${n(x)}: ${n(c)} − ${n(a)} × ${n(x)} = ${n(c - a * x)} = ${n(b)} × ${n(y)}, so y = ${n(y)}. Every solution is x = ${n(x)} + ${n(sb)}t, y = ${n(y)} − ${n(sa)}t for a whole number t. y stays positive for t = 0 to ${n(k - 1)}, which gives the pairs ${list2(pairs)}: ${n(k)} pairs, and the smallest x is ${n(x)}.`,
   guidance: [
    { prompt: `What is gcd(${n(a)}, ${n(b)})? It must divide ${n(c)} for any solution to exist.`, answer: [g], explanation: g === 1 ? `gcd(${n(a)}, ${n(b)}) = 1, and 1 divides every whole number, so whole-number solutions exist, though not always positive ones.` : `gcd(${n(a)}, ${n(b)}) = ${n(g)}, and ${n(c)} = ${n(g)} × ${n(c / g)}, so whole-number solutions exist, though not always positive ones.` },
    { prompt: `What is the smallest positive x for which ${n(c)} − ${n(a)}x is a positive multiple of ${n(b)}, and what is y then?`, answer: [x, y], explanation: `${n(c)} − ${n(a)} × ${n(x)} = ${n(c - a * x)} = ${n(b)} × ${n(y)}, and no smaller positive x leaves a multiple of ${n(b)}.` },
    { prompt: `Each further solution adds ${n(sb)} to x and takes ${n(sa)} from y. How many pairs keep y at least 1, counting the first?`, answer: [k], explanation: `The pairs are ${list2(pairs)}. One more shift would make y ${n(pairs[k - 1][1] - sa)}, which is not positive.` }
   ] }; }
 },
 /* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ from 60 to 10000 with two primes or more, and m = r^u × s^v given factorised (r < s from 11 to 23).
    Not the worked example (12). */
 q09: {
  canonical: { a: 4, b: 2, c: 1, d: 0, r: 11, u: 3, s: 13, v: 1 },
  draw: R => { let p, k; do { p = { a: R.int(0, 5), b: R.int(0, 3), c: R.int(0, 2), d: R.int(0, 2), r: R.pick([11, 13, 17]), u: R.int(1, 3), s: R.pick([19, 23, 29]), v: R.int(1, 3) };
    k = POW(2, p.a) * POW(3, p.b) * POW(5, p.c) * POW(7, p.d); } while (k < 60 || k > 10000 || [p.a, p.b, p.c, p.d].filter(e => e > 0).length < 2 || k === 720 || k === 12); return p; },
  build: ({ a, b, c, d, r, u, s, v }) => { const k = POW(2, a) * POW(3, b) * POW(5, c) * POW(7, d), E = [[2, a], [3, b], [5, c], [7, d]].filter(([, e]) => e > 0);
   const tau = E.reduce((t, [, e]) => t * (e + 1), 1), M = fact([[r, u], [s, v]]), tm = (u + 1) * (v + 1);
   const work = `${E.map(([, e]) => `(${n(e)} + 1)`).join(' × ')} = ${E.map(([, e]) => n(e + 1)).join(' × ')} = ${n(tau)}`; return {
   prompt: `The crate store has ${n(k)} identical tins, and every divisor of ${n(k)} is a possible crate size, from crates of 1 tin up to one crate of all ${n(k)}. Enter τ(${n(k)}), the number of divisors of ${n(k)}. A second delivery has ${M} tins, written as its prime factorisation: enter its number of divisors too.`,
   answer: [tau, tm],
   hints: ['A divisor picks an exponent for each prime, anywhere from zero up to that prime’s exponent in the number. So a prime with exponent e gives one more than e choices.', 'Multiply the numbers of choices for all the primes together.'],
   solution: `${n(k)} = ${fact(E)}, so τ(${n(k)}) = ${work}. For ${M}, the number of divisors is (${n(u)} + 1) × (${n(v)} + 1) = ${n(u + 1)} × ${n(v + 1)} = ${n(tm)}.`,
   guidance: [
    { prompt: `Write ${n(k)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are a, b, c and d?`, answer: [a, b, c, d], explanation: `${n(k)} = ${fact(E)}, so the exponents are ${n(a)}, ${n(b)}, ${n(c)} and ${n(d)}.` },
    { prompt: `Add 1 to each exponent that is not 0 and multiply. What is τ(${n(k)})?`, answer: [tau], explanation: `τ(${n(k)}) = ${work}. Each divisor is one way of choosing the exponents.` },
    { prompt: `Do the same for ${M}. How many divisors does it have?`, answer: [tm], explanation: `The exponents are ${n(u)} and ${n(v)}, so there are ${n(u + 1)} × ${n(v + 1)} = ${n(tm)} divisors.` }
   ] }; }
 },
 /* n = p^a × q^b (p < q from 2, 3, 5, 7), and m = r^u, k = s^v with r ≠ s. Not the worked example (12; 4 and 9). */
 q10: {
  canonical: { p: 2, a: 3, q: 3, b: 2, r: 2, u: 3, s: 5, v: 2 },
  draw: R => { let x; do { const pq = R.pick([[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [5, 7]]), rs = R.pick([[2, 3], [2, 5], [3, 2], [5, 2], [3, 5], [7, 2], [2, 7], [3, 7], [5, 3], [11, 2], [2, 11], [7, 3]]);
    x = { p: pq[0], a: R.int(1, 4), q: pq[1], b: R.int(1, 2), r: rs[0], u: R.int(1, 3), s: rs[1], v: R.int(1, 2) }; }
   while (POW(x.p, x.a) * POW(x.q, x.b) > 2000 || POW(x.p, x.a) * POW(x.q, x.b) === 12 || POW(x.r, x.u) * POW(x.s, x.v) > 5000 || (POW(x.r, x.u) === 4 && POW(x.s, x.v) === 9) || (x.p === 2 && x.a === 3 && x.q === 3 && x.b === 2)); return x; },
  build: ({ p, a, q, b, r, u, s, v }) => { const P = POW(p, a), Q = POW(q, b), k = P * Q, s1 = sigmaPP(p, a), s2 = sigmaPP(q, b), S = s1 * s2;
   const m = POW(r, u), j = POW(s, v), sm = sigmaPP(r, u), sj = sigmaPP(s, v), T = sm * sj; return {
   prompt: `The fuel depot keeps one can of every size that divides ${n(k)}, in litres. Enter σ(${n(k)}), the sum of divisors of ${n(k)}: the litres all those cans hold together. Then the depot log says σ(${n(m)}) = ${n(sm)} and σ(${n(j)}) = ${n(sj)}, and ${n(m)} and ${n(j)} have no prime factor in common. Enter σ(${n(m * j)}). Type both without commas.`,
   answer: [S, T],
   hints: ['For a prime power, σ is the sum of all the powers of the prime from the zeroth up to that one.', 'σ is multiplicative: when two numbers share no prime factor, σ of their product is the product of their σ values.'],
   solution: `${n(k)} = ${fact([[p, a], [q, b]])}. σ(${fact([[p, a]])}) = ${powSum(p, a)} = ${n(s1)} and σ(${fact([[q, b]])}) = ${powSum(q, b)} = ${n(s2)}. The two prime powers share no prime factor, so σ(${n(k)}) = ${n(s1)} × ${n(s2)} = ${n(S)}. ${n(m)} and ${n(j)} share no prime factor either, so σ(${n(m * j)}) = σ(${n(m)}) × σ(${n(j)}) = ${n(sm)} × ${n(sj)} = ${n(T)}.`,
   guidance: [
    { prompt: `What is σ(${fact([[p, a]])}), the sum ${powSum(p, a)}?`, answer: [s1], explanation: `The divisors of ${fact([[p, a]])} are its powers ${powSum(p, a).split(' + ').join(', ')}, which add up to ${n(s1)}.` },
    { prompt: `What is σ(${fact([[q, b]])})?`, answer: [s2], explanation: `${powSum(q, b)} = ${n(s2)}.` },
    { prompt: `${n(k)} = ${fact([[p, a]])} × ${fact([[q, b]])}, and the two share no prime factor. What is σ(${n(k)})?`, answer: [S], explanation: `Each divisor of ${n(k)} is a divisor of ${fact([[p, a]])} times a divisor of ${fact([[q, b]])}, so the sum of them all is ${n(s1)} × ${n(s2)} = ${n(S)}.` },
    { prompt: `What is σ(${n(m * j)}) = σ(${n(m)} × ${n(j)})?`, answer: [T], explanation: `${n(m)} and ${n(j)} share no prime factor, so σ(${n(m * j)}) = ${n(sm)} × ${n(sj)} = ${n(T)}.` }
   ] }; }
 }
});
})();
