/* Abstract algebra: patterns of moves mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Remainder from 0 to m − 1, also for negative x. */
const md = (x, m) => ((x % m) + m) % m;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const r = a % b; a = b; b = r; } return a; };
const isPrime = m => { if (m < 2) return false; for (let d = 2; d * d <= m; d++) if (m % d === 0) return false; return true; };
const unitsOf = m => { const out = []; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) out.push(x); return out; };
const invOf = (a, m) => { for (let b = 1; b < m; b++) if ((a * b) % m === 1) return b; return 0; };
/* Multiplicative order of a mod m (a coprime to m), with the list of powers a¹ … a^order. */
const powers = (a, m) => { const out = [a % m]; while (out[out.length - 1] !== 1 && out.length < 100) out.push((out[out.length - 1] * a) % m); return out; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
/* "64 = 3 × 17 + 13", or "13 already lies from 0 to 16" when no division is needed. */
const divText = (x, m) => x < m ? `${n(x)} already lies from 0 to ${n(m - 1)}` : `${n(x)} = ${n(Math.floor(x / m))} × ${n(m)} + ${n(x % m)}`;
/* Bring a negative number into 0 … m − 1 by adding m: "−18 + 17 = −1" style, written as one sum. */
const upText = (x, m) => { const k = Math.ceil(-x / m); return k === 1 ? `${n(x)} + ${n(m)} = ${n(x + m)}` : `${n(x)} + ${n(k)} × ${n(m)} = ${n(x)} + ${n(k * m)} = ${n(x + k * m)}`; };
/* The remainder of any whole number x, worked in words. */
const modText = (x, m) => x < 0 ? `add ${n(m)} until the result lies from 0 to ${n(m - 1)}: ${upText(x, m)}` : divText(x, m);
/* Euclid's algorithm on (a, b), a > b > 0: "20 = 2 × 8 + 4, 8 = 2 × 4 + 0". */
const euclid = (a, b) => { const out = []; while (b) { out.push(`${n(a)} = ${n(Math.floor(a / b))} × ${n(b)} + ${n(a % b)}`); const r = a % b; a = b; b = r; } return out.join(', '); };
const steps = k => k === 1 ? '1 step' : `${n(k)} steps`;
const beats = k => k === 1 ? '1 beat' : `${n(k)} beats`;
const PRIMES = [5, 7, 11, 13, 17, 19];
const COMPOSITES = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* (a + b) mod n and (a − b) mod n on a dial of n positions. a + b reaches at least n, so the first answer always
    needs a division; a ≠ b. Not the worked example (n = 12, 9 + 8 and 3 − 7). */
 q01: {
  canonical: { m: 17, a: 23, b: 41 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = { m: R.int(5, 24), a: R.int(1, 60), b: R.int(1, 60) }; if (p.a !== p.b && p.a + p.b >= p.m && p.m !== 12) return p; } return { m: 17, a: 23, b: 41 }; },
  build: ({ m, a, b }) => { const s = a + b, d = a - b, rs = md(s, m), rd = md(d, m); return {
   prompt: `A combination dial in the Lock Workshop has ${n(m)} positions, numbered 0 to ${n(m - 1)}, and it counts round like a clock: one step on from ${n(m - 1)} is 0 again. Starting from 0, a technician turns it ${steps(a)} forward and then ${steps(b)} forward. Enter where it ends, (${n(a)} + ${n(b)}) mod ${n(m)}. In a second test she turns it ${steps(a)} forward from 0 and then ${steps(b)} back. Enter where it ends, (${n(a)} − ${n(b)}) mod ${n(m)}.`,
   answer: [rs, rd],
   hints: ['Add first, then divide by the number of positions. The position is the remainder, which always lies from 0 up to one less than the number of positions.', 'A step back is a step of −1. If the difference is negative, add the number of positions, as many times as needed, until the result lies from 0 up to one less than the number of positions.'],
   solution: `${n(a)} + ${n(b)} = ${n(s)}, and ${divText(s, m)}, so (${n(a)} + ${n(b)}) mod ${n(m)} = ${n(rs)}. ${n(a)} − ${n(b)} = ${n(d)}${d < 0 ? `. It is negative, so ${modText(d, m)}` : `, and ${divText(d, m)}`}. So (${n(a)} − ${n(b)}) mod ${n(m)} = ${n(rd)}.`,
   guidance: [
    { prompt: `How many steps forward does the dial turn in all in the first test? What is ${n(a)} + ${n(b)}?`, answer: [s], explanation: `${n(a)} + ${n(b)} = ${n(s)} steps forward from 0.` },
    { prompt: `Every ${n(m)} steps bring the dial back to 0. What is the remainder when ${n(s)} is divided by ${n(m)}?`, answer: [rs], explanation: `${divText(s, m)}. The full turns of ${n(m)} steps change nothing, so the dial ends at ${n(rs)}.` },
    { prompt: `In the second test the steps back count as negative. What is ${n(a)} − ${n(b)}?`, answer: [d], explanation: `${n(a)} − ${n(b)} = ${n(d)}.` },
    { prompt: `What is ${n(d)} mod ${n(m)}, the position from 0 to ${n(m - 1)} where the dial ends?`, answer: [rd], explanation: `${d < 0 ? `${n(d)} is negative, so ${modText(d, m)}` : divText(d, m)}. The dial ends at ${n(rd)}.` }
   ] }; }
 },
 /* (a × b) mod n and a² mod n, a ratchet of a steps per click. a is larger than n and not a multiple of it, so reducing
    first is worth it; b is not a multiple of n. Not the worked example (n = 10, a = 13, b = 6). */
 q02: {
  canonical: { m: 19, a: 27, b: 12 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(5, 24), p = { m, a: R.int(m + 2, 60), b: R.int(2, 60) }; if (p.a % m >= 2 && p.b % m >= 2 && !(m === 10 && p.a === 13)) return p; } return { m: 19, a: 27, b: 12 }; },
  build: ({ m, a, b }) => { const ar = a % m, br = b % m, pr = ar * br, r = pr % m, sq = ar * ar, rq = sq % m; return {
   prompt: `A ratchet on ${/^(8|11|18)/.test(String(m)) ? 'an' : 'a'} ${n(m)}-position dial, numbered 0 to ${n(m - 1)}, moves it ${steps(a)} forward with every click. Starting from 0, enter where the dial is after ${n(b)} clicks, (${n(a)} × ${n(b)}) mod ${n(m)}. Then enter where it is after ${n(a)} clicks, ${n(a)}² mod ${n(m)}.`,
   answer: [r, rq],
   hints: ['Each click adds the same number of steps, so the clicks multiply. You may first replace each number by its remainder: the final position does not change, and the numbers stay small.', 'After multiplying the remainders, divide the product by the number of positions and keep the remainder.'],
   solution: `First the remainders: ${divText(a, m)}, so ${n(a)} mod ${n(m)} = ${n(ar)}${b >= m ? `, and ${divText(b, m)}, so ${n(b)} mod ${n(m)} = ${n(br)}` : ''}. Then ${n(ar)} × ${n(br)} = ${n(pr)}, and ${divText(pr, m)}, so (${n(a)} × ${n(b)}) mod ${n(m)} = ${n(r)}. For the square, ${n(ar)} × ${n(ar)} = ${n(sq)}, and ${divText(sq, m)}, so ${n(a)}² mod ${n(m)} = ${n(rq)}.`,
   guidance: [
    { prompt: `Full turns of ${n(m)} steps change nothing. What is ${n(a)} mod ${n(m)}?`, answer: [ar], explanation: `${divText(a, m)}, so each click moves the dial as if it were ${steps(ar)}.` },
    { prompt: `What is ${n(b)} mod ${n(m)}?`, answer: [br], explanation: b >= m ? `${divText(b, m)}, so ${n(b)} clicks act like ${n(br)} clicks.` : `${n(b)} is already below ${n(m)}, so it stays ${n(br)}.` },
    { prompt: `Multiply the remainders and take the remainder again. What is (${n(ar)} × ${n(br)}) mod ${n(m)}?`, answer: [r], explanation: `${n(ar)} × ${n(br)} = ${n(pr)}, and ${divText(pr, m)}. This is also (${n(a)} × ${n(b)}) mod ${n(m)}.` },
    { prompt: `Now the square. What is (${n(ar)} × ${n(ar)}) mod ${n(m)}?`, answer: [rq], explanation: `${n(ar)} × ${n(ar)} = ${n(sq)}, and ${divText(sq, m)}. So ${n(a)}² mod ${n(m)} = ${n(rq)}.` }
   ] }; }
 },
 /* Two entries of the table of x ∗ y = (x + y + k) mod n on {0, …, n − 1}. The two cells differ, and at least one sum
    wraps past n. Not the worked example (n = 5, k = 2). */
 q03: {
  canonical: { m: 7, k: 3, x1: 5, y1: 4, x2: 2, y2: 6 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(5, 12), p = { m, k: R.int(1, m - 1), x1: R.int(1, m - 1), y1: R.int(1, m - 1), x2: R.int(0, m - 1), y2: R.int(0, m - 1) };
   if ((p.x1 !== p.x2 || p.y1 !== p.y2) && (p.x1 !== p.y2 || p.y1 !== p.x2) && p.x1 + p.y1 + p.k >= m && !(m === 5 && p.k === 2)) return p; } return { m: 7, k: 3, x1: 5, y1: 4, x2: 2, y2: 6 }; },
  build: ({ m, k, x1, y1, x2, y2 }) => { const s1 = x1 + y1 + k, s2 = x2 + y2 + k, r1 = s1 % m, r2 = s2 % m; return {
   prompt: `The Lock Workshop links two dials of ${n(m)} positions, 0 to ${n(m - 1)}, with a new rule: x ∗ y = (x + y + ${n(k)}) mod ${n(m)}. The crew is filling in its operation table, where the entry in row x and column y is x ∗ y. Enter the entry in row ${n(x1)}, column ${n(y1)}, then the entry in row ${n(x2)}, column ${n(y2)}.`,
   answer: [r1, r2],
   hints: ['The entry in row x and column y is x ∗ y: put the row number in for x and the column number in for y.', 'Add the row number, the column number and the fixed extra amount, then take the remainder on division by the number of positions.'],
   solution: `Row ${n(x1)}, column ${n(y1)}: ${n(x1)} ∗ ${n(y1)} = (${n(x1)} + ${n(y1)} + ${n(k)}) mod ${n(m)} = ${n(s1)} mod ${n(m)}, and ${divText(s1, m)}, so the entry is ${n(r1)}. Row ${n(x2)}, column ${n(y2)}: ${n(x2)} ∗ ${n(y2)} = (${n(x2)} + ${n(y2)} + ${n(k)}) mod ${n(m)} = ${n(s2)} mod ${n(m)}, and ${divText(s2, m)}, so the entry is ${n(r2)}.`,
   guidance: [
    { prompt: `For row ${n(x1)}, column ${n(y1)}, add before taking the remainder. What is ${n(x1)} + ${n(y1)} + ${n(k)}?`, answer: [s1], explanation: `${n(x1)} + ${n(y1)} + ${n(k)} = ${n(s1)}.` },
    { prompt: `What is ${n(s1)} mod ${n(m)}, the entry in row ${n(x1)}, column ${n(y1)}?`, answer: [r1], explanation: `${divText(s1, m)}, so ${n(x1)} ∗ ${n(y1)} = ${n(r1)}.` },
    { prompt: `Now row ${n(x2)}, column ${n(y2)}. What is ${n(x2)} ∗ ${n(y2)} = (${n(x2)} + ${n(y2)} + ${n(k)}) mod ${n(m)}?`, answer: [r2], explanation: `${n(x2)} + ${n(y2)} + ${n(k)} = ${n(s2)}, and ${divText(s2, m)}, so the entry is ${n(r2)}.` }
   ] }; }
 },
 /* x ∗ y = (x + y + k) mod n: the identity is e = n − k, and the inverse of a is (e − a − k) mod n. a is not e (whose
    inverse is itself). Not the worked example (n = 6, k = 1, a = 4). */
 q04: {
  canonical: { m: 9, k: 4, a: 3 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(5, 15), k = R.int(1, m - 1), p = { m, k, a: R.int(0, m - 1) }; if (p.a !== m - k && !(m === 6 && k === 1)) return p; } return { m: 9, k: 4, a: 3 }; },
  build: ({ m, k, a }) => { const e = m - k, s = a + k, raw = e - s, b = md(raw, m), tot = a + b + k; return {
   prompt: `A pair of linked dials in the Lock Workshop combine two settings from 0 to ${n(m - 1)} by the rule x ∗ y = (x + y + ${n(k)}) mod ${n(m)}. Enter the identity element e of ∗, the setting with e ∗ x = x and x ∗ e = x for every x. Then enter the inverse of ${n(a)}: the setting b with ${n(a)} ∗ b = e.`,
   answer: [e, b],
   hints: ['For e ∗ x to come back to x, the amount e adds, together with the fixed extra amount, must make a whole number of full turns.', 'For the inverse of a, the setting b must make (a + b + the extra amount) leave the remainder e. Subtract, then bring the result into the range of the dial.'],
   solution: `e ∗ x = (e + x + ${n(k)}) mod ${n(m)} equals x for every x only when e + ${n(k)} is a whole number of turns of ${n(m)}. With e from 0 to ${n(m - 1)} that means e + ${n(k)} = ${n(m)}, so e = ${n(e)}. Check: ${n(e)} ∗ 1 = (${n(e)} + 1 + ${n(k)}) mod ${n(m)} = ${n(m + 1)} mod ${n(m)} = 1. For the inverse, ${n(a)} ∗ b = (${n(a)} + b + ${n(k)}) mod ${n(m)} must be ${n(e)}, so b = (${n(e)} − ${n(s)}) mod ${n(m)} = ${n(raw)} mod ${n(m)} = ${n(b)}. Check: ${n(a)} ∗ ${n(b)} = (${n(a)} + ${n(b)} + ${n(k)}) mod ${n(m)} = ${n(tot)} mod ${n(m)} = ${n(e)}.`,
   guidance: [
    { prompt: `e ∗ x = x for every x means e + ${n(k)} is a whole number of turns of ${n(m)}. Which multiple of ${n(m)} lies from ${n(k)} to ${n(m - 1 + k)}?`, answer: [m], explanation: `The only multiple of ${n(m)} in that range is ${n(m)} itself, so e + ${n(k)} = ${n(m)}.` },
    { prompt: `So what is the identity element e?`, answer: [e], explanation: `e = ${n(m)} − ${n(k)} = ${n(e)}. Check: ${n(e)} ∗ 1 = ${n(m + 1)} mod ${n(m)} = 1.` },
    { prompt: `The inverse b of ${n(a)} needs (${n(a)} + b + ${n(k)}) mod ${n(m)} = ${n(e)}. What is b = (${n(e)} − ${n(s)}) mod ${n(m)}?`, answer: [b], explanation: `${n(e)} − ${n(s)} = ${n(raw)}, and ${n(raw)} mod ${n(m)} = ${n(b)}. Check: ${n(a)} ∗ ${n(b)} = ${n(tot)} mod ${n(m)} = ${n(e)}.` }
   ] }; }
 },
 /* {1, …, n − 1} under × mod n, n from 4 to 20: closed and with inverses exactly when n is prime; 1 is always the
    identity. The warm-up product uses a, b from 2 to n − 1. Not the worked example (n = 6). */
 q05: {
  canonical: { m: 15, a: 4, b: 7 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.bool() ? R.pick(PRIMES) : R.pick(COMPOSITES), p = { m, a: R.int(2, m - 1), b: R.int(2, m - 1) }; if (m !== 6 && p.a !== p.b) return p; } return { m: 15, a: 4, b: 7 }; },
  build: ({ m, a, b }) => { const pr = a * b, r = pr % m, prime = isPrime(m); let d = 2; while (m % d) d++; const q = m / d, big = (m - 1) * (m - 1);
   const closed = prime ? 1 : 0, invs = prime ? 1 : 0; return {
   prompt: `The Lock Workshop tests a dial whose settings are the numbers 1 to ${n(m - 1)}, combined by multiplying mod ${n(m)}; the setting 0 is not part of it. First enter (${n(a)} × ${n(b)}) mod ${n(m)}. Then check the group rules for this set and this operation: enter 1 if the set is closed, 0 if not; 1 if it has an identity element, 0 if not; 1 if every element has an inverse, 0 if not.`,
   answer: [r, closed, 1, invs],
   hints: ['Closed means every product lands back in the set. Look for two settings whose product is a whole number of turns of the dial: its remainder is 0, which is not in the set.', 'Multiplying by 1 changes nothing. For inverses: if the dial size is a product d × q with d at least 2, then every product d × x minus whole turns is still a multiple of d, so it can never leave the remainder 1.'],
   solution: `${n(a)} × ${n(b)} = ${n(pr)}, and ${divText(pr, m)}, so the product is ${n(r)}. ` + (prime
    ? `${n(m)} is prime, so a product of two numbers from 1 to ${n(m - 1)} is never a multiple of ${n(m)}: the remainder is never 0, and the set is closed (1). 1 × x = x for every x, so 1 is the identity element (1). For any setting a, the ${n(m - 1)} products a × 1, a × 2, …, a × ${n(m - 1)} mod ${n(m)} are all different and none is 0, so one of them is 1: every element has an inverse (1). For example ${n(m - 1)} × ${n(m - 1)} = ${n(big)}, which leaves 1, so ${n(m - 1)} is its own inverse.`
    : `${n(m)} = ${n(d)} × ${n(q)}, and both ${n(d)} and ${n(q)} are settings, but (${n(d)} × ${n(q)}) mod ${n(m)} = 0, which is not in the set: it is not closed (0). 1 × x = x for every x, so 1 is the identity element (1). Every product ${n(d)} × x is a multiple of ${n(d)}, and so is ${n(m)}, so its remainder is a multiple of ${n(d)} and never 1: ${n(d)} has no inverse (0).`),
   guidance: [
    { prompt: `What is (${n(a)} × ${n(b)}) mod ${n(m)}?`, answer: [r], explanation: `${n(a)} × ${n(b)} = ${n(pr)}, and ${divText(pr, m)}.` },
    prime
     ? { prompt: `Try the largest setting with itself. What is (${n(m - 1)} × ${n(m - 1)}) mod ${n(m)}?`, answer: [1], explanation: `${n(m - 1)} × ${n(m - 1)} = ${n(big)}, and ${divText(big, m)}. The product lands back in the set, and since ${n(m)} is prime no product of two settings is a multiple of it, so none lands on 0.` }
     : { prompt: `${n(m)} = ${n(d)} × ${n(q)}. What is (${n(d)} × ${n(q)}) mod ${n(m)}?`, answer: [0], explanation: `${n(d)} × ${n(q)} = ${n(m)}, exactly one full turn, so the remainder is 0, and 0 is not one of the settings.` },
    { prompt: `So is the set closed? Enter 1 for yes, 0 for no.`, answer: [closed], explanation: prime ? `Yes: every product of two settings leaves a remainder from 1 to ${n(m - 1)}.` : `No: ${n(d)} and ${n(q)} are in the set but their product is not.` },
    { prompt: `Does every element have an inverse? Enter 1 for yes, 0 for no.`, answer: [invs], explanation: prime ? `Yes: for each setting a, the products a × 1 to a × ${n(m - 1)} are all different and never 0, so one of them is 1.` : `No: every product ${n(d)} × x leaves a multiple of ${n(d)}, never 1, so ${n(d)} has no inverse.` }
   ] }; }
 },
 /* |U(n)| and the inverse of a in U(n), for composite n from 10 to 30. g is the largest number below n that shares
    a factor with n (shown with Euclid's algorithm). a is a unit other than 1. Not the worked example (n = 9). */
 q06: {
  canonical: { m: 20, a: 7 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(10, 30); if (isPrime(m)) continue; const us = unitsOf(m).filter(x => x !== 1); return { m, a: R.pick(us) }; } return { m: 20, a: 7 }; },
  build: ({ m, a }) => { const us = unitsOf(m), b = invOf(a, m), pr = a * b; let g = m - 2; while (gcd(g, m) === 1) g--; const dg = gcd(g, m); return {
   prompt: `A vault dial with settings 0 to ${n(m - 1)} combines them by multiplying mod ${n(m)}. Only the settings coprime to ${n(m)} can be undone, and they form the group U(${n(m)}). Enter |U(${n(m)})|, the number of elements of U(${n(m)}). Then enter the inverse of ${n(a)} in U(${n(m)}): the setting b with (${n(a)} × b) mod ${n(m)} = 1.`,
   answer: [us.length, b],
   hints: ['Go through the numbers from 1 to one less than the dial size and keep those whose greatest common divisor with the dial size is 1. Count them.', 'To find an inverse, multiply the setting by each element of the group in turn until the product leaves remainder 1 on division by the dial size.'],
   solution: `A number from 1 to ${n(m - 1)} is in U(${n(m)}) when its gcd with ${n(m)} is 1. Those numbers are ${us.map(n).join(', ')}, so |U(${n(m)})| = ${n(us.length)}. For the inverse of ${n(a)}: ${n(a)} × ${n(b)} = ${n(pr)}, and ${divText(pr, m)}, so the inverse of ${n(a)} is ${n(b)}.`,
   guidance: [
    { prompt: `Is ${n(g)} in U(${n(m)})? Use Euclid's algorithm: what is gcd(${n(m)}, ${n(g)})?`, answer: [dg], explanation: `${euclid(m, g)}. The last remainder that is not 0 is ${n(dg)}, so gcd(${n(m)}, ${n(g)}) = ${n(dg)}, not 1, and ${n(g)} is not in U(${n(m)}).` },
    { prompt: `How many of the numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}? That is |U(${n(m)})|.`, answer: [us.length], explanation: `They are ${us.map(n).join(', ')}: ${n(us.length)} numbers.` },
    { prompt: `Which element b of U(${n(m)}) gives (${n(a)} × b) mod ${n(m)} = 1?`, answer: [b], explanation: `${n(a)} × ${n(b)} = ${n(pr)}, and ${divText(pr, m)}. So b = ${n(b)}.` }
   ] }; }
 },
 /* Order of a in Z_n (adding): n ÷ gcd(a, n), n from 6 to 40, gcd at least 2 so the beacon comes home early, order
    at least 2. Not the worked example (n = 12, a = 8). */
 q07: {
  canonical: { m: 24, a: 18 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(6, 40), a = R.int(2, m - 1), g = gcd(a, m); if (g >= 2 && !(m === 12 && a === 8)) return { m, a }; } return { m: 24, a: 18 }; },
  build: ({ m, a }) => { const g = gcd(a, m), o = m / g, tot = o * a; return {
   prompt: `A ring of ${n(m)} lamps on the Beacon Tower is numbered 0 to ${n(m - 1)}. A light pulse starts at lamp 0 and jumps ${n(a)} lamps round the ring on every beat, so after k beats it is at (k × ${n(a)}) mod ${n(m)}. In Z_${n(m)} this asks for the order of ${n(a)}. Enter gcd(${n(a)}, ${n(m)}), then the order of ${n(a)}: the smallest number of beats, at least 1, that brings the pulse back to lamp 0.`,
   answer: [g, o],
   hints: ['The greatest common divisor is the largest number that divides both. Euclid\'s algorithm finds it: divide, keep the remainder, and repeat until the remainder is 0.', 'The order of a in Z_n is n ÷ gcd(a, n): after that many jumps the pulse has gone a whole number of times round the ring, and not before.'],
   solution: `${euclid(m, a)}, so gcd(${n(a)}, ${n(m)}) = ${n(g)}. Write ${n(a)} = ${n(g)} × ${n(a / g)} and ${n(m)} = ${n(g)} × ${n(o)}. After k beats the pulse is home when k × ${n(a)} is a multiple of ${n(m)}, that is when k × ${n(a / g)} is a multiple of ${n(o)}. ${n(a / g)} and ${n(o)} share no factor, so k itself must be a multiple of ${n(o)}. The order of ${n(a)} is ${n(m)} ÷ ${n(g)} = ${n(o)}. Check: ${n(o)} × ${n(a)} = ${n(tot)} = ${n(tot / m)} × ${n(m)}, a whole number of times round.`,
   guidance: [
    { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${euclid(m, a)}. The last remainder that is not 0 is ${n(g)}.` },
    { prompt: `The order is ${n(m)} ÷ gcd(${n(a)}, ${n(m)}). What is it?`, answer: [o], explanation: `${n(m)} ÷ ${n(g)} = ${n(o)} beats.` },
    { prompt: `Check: after ${beats(o)} the pulse has jumped ${n(o)} × ${n(a)} = ${n(tot)} lamps. What is ${n(tot)} mod ${n(m)}?`, answer: [0], explanation: `${n(tot)} = ${n(tot / m)} × ${n(m)} + 0, so the pulse is back at lamp 0.` }
   ] }; }
 },
 /* Order of a in U(n), n from 5 to 25, read off the powers a, a², a³, …; the order is at least 4, so the first
    two guided powers are never 1. Not the worked example (n = 7, a = 2). */
 q08: {
  canonical: { m: 13, a: 5 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(5, 25), us = unitsOf(m).filter(x => x !== 1), a = R.pick(us); if (us.length && powers(a, m).length >= 4 && !(m === 7 && a === 2)) return { m, a }; } return { m: 13, a: 5 }; },
  build: ({ m, a }) => { const ps = powers(a, m), o = ps.length, p2 = ps[1], p3 = ps[2];
   const chain = ps.map((v, i) => i === 0 ? `${n(a)}¹ = ${n(a)}` : `${n(a)}${sup(i + 1)} = ${n(ps[i - 1])} × ${n(a)} = ${n(ps[i - 1] * a)}, which leaves ${n(v)}`).join('; '); return {
   prompt: `A beacon on the Beacon Tower stores a code from U(${n(m)}). On every beat its code is multiplied by ${n(a)}, mod ${n(m)}, so after k beats it has been multiplied by ${n(a)}${'ᵏ'} mod ${n(m)}. Enter ${n(a)}² mod ${n(m)} and ${n(a)}³ mod ${n(m)}. Then enter the order of ${n(a)} in U(${n(m)}): the smallest k, at least 1, with ${n(a)}${'ᵏ'} mod ${n(m)} = 1.`,
   answer: [p2, p3, o],
   hints: ['Make a table of powers. Each power is the one before it multiplied by the element, then reduced mod the modulus: you never need the full power.', 'Keep going until the table reaches 1. The number of the power where 1 first appears is the order.'],
   solution: `Mod ${n(m)}: ${chain}. The first power to reach 1 is ${n(a)}${sup(o)}, so the order of ${n(a)} in U(${n(m)}) is ${n(o)}.`,
   guidance: [
    { prompt: `What is ${n(a)}² mod ${n(m)}?`, answer: [p2], explanation: `${n(a)} × ${n(a)} = ${n(a * a)}, and ${divText(a * a, m)}.` },
    { prompt: `Multiply that by ${n(a)} and reduce. What is ${n(a)}³ mod ${n(m)}?`, answer: [p3], explanation: `${n(p2)} × ${n(a)} = ${n(p2 * a)}, and ${divText(p2 * a, m)}.` },
    { prompt: `Keep multiplying by ${n(a)} and reducing. At which power does the table first reach 1?`, answer: [o], explanation: `The powers mod ${n(m)} are ${ps.map(n).join(', ')}. The last of these is ${n(a)}${sup(o)}, so the order is ${n(o)}.` }
   ] }; }
 },
 /* Generators of Z_n: the a from 1 to n − 1 with gcd(a, n) = 1. n from 8 to 40, not prime (so some a fail);
    a from 2 to n − 1, half the time coprime to n. Not the worked example (n = 8, a = 3). */
 q09: {
  canonical: { m: 18, a: 10 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(8, 40); if (isPrime(m)) continue; const want = R.bool(), as = []; for (let x = 2; x < m; x++) if ((gcd(x, m) === 1) === want) as.push(x); if (!as.length) continue; const a = R.pick(as); if (m === 8 && a === 3) continue; return { m, a }; } return { m: 18, a: 10 }; },
  build: ({ m, a }) => { const us = unitsOf(m), g = gcd(a, m), o = m / g, gen = g === 1 ? 1 : 0; return {
   prompt: `The Beacon Tower's ring of ${n(m)} lamps, 0 to ${n(m - 1)}, works like Z_${n(m)}. A pulse that jumps g lamps per beat lights the lamps of ⟨g⟩, and g is a generator of Z_${n(m)} when it lights every lamp. Enter how many generators Z_${n(m)} has. Then enter 1 if ${n(a)} generates Z_${n(m)}, 0 if not.`,
   answer: [us.length, gen],
   hints: ['g lights every lamp exactly when its order is the whole ring size, and its order is the ring size divided by gcd(g, ring size).', 'So the generators are the numbers from 1 to one less than the ring size that share no factor bigger than 1 with the ring size. Count them.'],
   solution: `g generates Z_${n(m)} exactly when its order ${n(m)} ÷ gcd(g, ${n(m)}) is ${n(m)}, that is when gcd(g, ${n(m)}) = 1. The numbers from 1 to ${n(m - 1)} coprime to ${n(m)} are ${us.map(n).join(', ')}, so Z_${n(m)} has ${n(us.length)} generators. gcd(${n(a)}, ${n(m)}) = ${n(g)}, so the order of ${n(a)} is ${n(m)} ÷ ${n(g)} = ${n(o)}` + (gen ? `, the whole ring: ${n(a)} is a generator (1).` : `, less than ${n(m)}: ⟨${n(a)}⟩ lights only ${n(o)} lamps, and ${n(a)} is not a generator (0).`),
   guidance: [
    { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${euclid(m, a)}. The last remainder that is not 0 is ${n(g)}.` },
    { prompt: `How many lamps does ⟨${n(a)}⟩ light? That is the order of ${n(a)}, ${n(m)} ÷ gcd(${n(a)}, ${n(m)}).`, answer: [o], explanation: `${n(m)} ÷ ${n(g)} = ${n(o)}. ${gen ? `That is every lamp, so ${n(a)} is a generator.` : `That is fewer than ${n(m)}, so ${n(a)} is not a generator.`}` },
    { prompt: `How many numbers from 1 to ${n(m - 1)} have gcd 1 with ${n(m)}?`, answer: [us.length], explanation: `They are ${us.map(n).join(', ')}: ${n(us.length)} generators.` }
   ] }; }
 },
 /* aᵏ mod n with k from 100 to 1000, through the order m of a in U(n). n from 7 to 30, order from 3 to 12, and k
    not a multiple of the order (the answer is then never simply 1). Not the worked example (n = 7, a = 2, k = 100). */
 q10: {
  canonical: { m: 11, a: 3, k: 437 },
  draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(7, 30), us = unitsOf(m).filter(x => x !== 1), a = R.pick(us), o = powers(a, m).length, k = R.int(100, 1000);
   if (o >= 3 && o <= 12 && k % o !== 0 && !(m === 7 && a === 2)) return { m, a, k }; } return { m: 11, a: 3, k: 437 }; },
  build: ({ m, a, k }) => { const ps = powers(a, m), o = ps.length, q = Math.floor(k / o), r = k % o, v = ps[r - 1]; return {
   prompt: `The Beacon Tower's master beacon multiplies its code by ${n(a)}, mod ${n(m)}, on every beat. The crew needs the factor after ${n(k)} beats, ${n(a)}${sup(k)} mod ${n(m)}, without multiplying ${n(k)} times. Enter the order of ${n(a)} in U(${n(m)}), then ${n(k)} mod that order, then ${n(a)}${sup(k)} mod ${n(m)}.`,
   answer: [o, r, v],
   hints: ['Find the order first with a table of powers: multiply by the element and reduce until you reach 1.', 'Once the order is m, every block of m factors multiplies to 1, so only the remainder of the exponent on division by m matters.'],
   solution: `Powers of ${n(a)} mod ${n(m)}: ${ps.map(n).join(', ')}. The first 1 is at power ${n(o)}, so the order of ${n(a)} is ${n(o)}. ${divText(k, o)}, so ${n(a)}${sup(k)} = (${n(a)}${sup(o)})${sup(q)} × ${n(a)}${sup(r)}. Since ${n(a)}${sup(o)} mod ${n(m)} = 1, this leaves ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}.`,
   guidance: [
    { prompt: `Make the table of powers of ${n(a)} mod ${n(m)}. What is the order of ${n(a)}?`, answer: [o], explanation: `The powers are ${ps.map(n).join(', ')}. The first 1 is the power ${n(o)}.` },
    { prompt: `What is the remainder when ${n(k)} is divided by ${n(o)}?`, answer: [r], explanation: `${divText(k, o)}. The ${n(q)} full blocks of ${n(o)} factors each multiply to 1.` },
    { prompt: `So ${n(a)}${sup(k)} mod ${n(m)} is the same as ${n(a)}${sup(r)} mod ${n(m)}. What is it?`, answer: [v], explanation: `From the table of powers, ${n(a)}${sup(r)} mod ${n(m)} = ${n(v)}.` }
   ] }; }
 }
});
})();
