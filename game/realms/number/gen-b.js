/* Number theory: the hidden life of whole numbers mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Whole-number helpers. mod always gives a least residue 0 … m − 1, also for a negative a. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mod = (a, m) => ((a % m) + m) % m;
const powmod = (a, k, m) => { let r = 1 % m, b = mod(a, m); while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
/* Extended Euclid: [g, x, y] with a·x + b·y = g. */
const egcd = (a, b) => { if (b === 0) return [a, 1, 0]; const [g, x, y] = egcd(b, a % b); return [g, y, x - Math.floor(a / b) * y]; };
const inverse = (a, m) => mod(egcd(mod(a, m), m)[1], m);
/* Superscript digits for an exponent: sup(13) is '¹³'. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
/* Prime factorisation as [[p, e], …], its text ('96 = 2⁵ × 3') and the divisor count τ(n). */
const factor = v => { const out = []; for (let p = 2; p * p <= v; p++) { let e = 0; while (v % p === 0) { v /= p; e++; } if (e) out.push([p, e]); } if (v > 1) out.push([v, 1]); return out; };
const power = (p, e) => e === 1 ? n(p) : `${n(p)}${sup(e)}`;
const factorText = v => factor(v).map(([p, e]) => power(p, e)).join(' × ');
/* The division steps of Euclid's algorithm on a ≥ b, as '9 = 1 × 6 + 3, 6 = 2 × 3 + 0'. */
const euclidText = (a, b) => { const out = []; while (b) { out.push(`${n(a)} = ${n(Math.floor(a / b))} × ${n(b)} + ${n(a % b)}`); [a, b] = [b, a % b]; } return out.join(', '); };
/* Repeated squaring of a mod m up to the largest power of 2 not above k, then the product of the needed squares.
   Returns the list of squares, the number of squarings j and the text of the working. */
const squaring = (a, k, m) => {
 const sq = [mod(a, m)]; while (2 ** sq.length <= k) { const s = sq[sq.length - 1]; sq.push(s * s % m); }
 const j = sq.length - 1, steps = [];
 const pw = i => i === 0 ? n(a) : `${n(a)}${sup(2 ** i)}`;
 for (let i = 1; i <= j; i++) { const s = sq[i - 1], v = s * s; steps.push(`${pw(i)} ${i === 1 ? '=' : `≡ ${n(s)}² =`} ${n(v)}${v === sq[i] ? '' : ` ≡ ${n(sq[i])}`}`); }
 const used = []; for (let i = j; i >= 0; i--) if (Math.floor(k / 2 ** i) % 2) used.push(i);
 const parts = used.map(i => 2 ** i), mult = [];
 let acc = sq[used[0]];
 for (const i of used.slice(1)) { const v = acc * sq[i]; mult.push(`${n(acc)} × ${n(sq[i])} = ${n(v)}${v % m === v ? '' : ` ≡ ${n(v % m)}`}`); acc = v % m; }
 const listText = steps.length ? `${steps.join(', ')} (mod ${n(m)})` : '';
 const productText = used.length === 1 ? `${n(a)}${sup(k)} ≡ ${n(acc)}` : `${n(a)}${sup(k)} = ${used.map(pw).join(' × ')} ≡ ${used.map(i => n(sq[i])).join(' × ')}: ${mult.join(', then ')}`;
 return { sq, j, used, parts, result: acc, listText, productText };
};
/* q11: the positive solutions of ax + by = c, found from the smallest y up. */
const positive = (a, b, c) => { const out = []; for (let y = 1; b * y < c; y++) if ((c - b * y) % a === 0) out.push([(c - b * y) / a, y]); return out; };
/* q18: pairwise coprime moduli from this list keep the product below 1000. */
const MODULI = [3, 4, 5, 7, 8, 9, 11];
/* q16: the smallest solution of ax ≡ b (mod n), searched directly; draws keep it at 2 or more. */
const smallest = ({ n: m, a, b }) => { for (let x = 0; x < m; x++) if ((a * x - b) % m === 0) return x; return -1; };
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Cans of a and b litres, an order of c litres. a = d·a1 and b = d·b1 with a1 < b1 coprime, both at least 2, so the
    stepping is never by 1; 2 to 5 positive solutions; c at most 300. Not the worked example (4, 6, 30). */
 q11: {
  canonical: { a: 6, b: 9, c: 96 },
  draw: R => { let p; do { const d = R.pick([1, 2, 3, 4]), a1 = R.int(2, 8), b1 = R.int(a1 + 1, 9), c1 = R.int(10, 80); p = { a: d * a1, b: d * b1, c: d * c1 }; }
   while (gcd(p.a / gcd(p.a, p.b), p.b / gcd(p.a, p.b)) !== 1 || p.a / gcd(p.a, p.b) < 2 || p.c > 300 || (p.a === 4 && p.b === 6 && p.c === 30) || p.c % gcd(p.a, p.b) || positive(p.a, p.b, p.c).length < 2 || positive(p.a, p.b, p.c).length > 5); return p; },
  build: ({ a, b, c }) => { const d = gcd(a, b), a1 = a / d, b1 = b / d, c1 = c / d, sols = positive(a1, b1, c1), K = sols.length, [X, Y] = sols[0],
   fs = factor(c), T = fs.reduce((t, [, e]) => t * (e + 1), 1), tauText = fs.length === 1 ? `${n(fs[0][1])} + 1 = ${n(T)}` : `${fs.map(([, e]) => `(${n(e)} + 1)`).join(' × ')} = ${n(T)}`,
   reduced = d === 1 ? `The gcd is 1, so the equation stays ${n(a)}x + ${n(b)}y = ${n(c)}.` : `Divide every term by ${n(d)}: ${n(a1)}x + ${n(b1)}y = ${n(c1)}.`,
   list = sols.map(([x, y]) => `(${n(x)}, ${n(y)})`).join(', '); return {
   prompt: `The Fuel Depot fills orders with two sizes of sealed can, ${n(a)} litres and ${n(b)} litres, always full and never opened. An order of exactly ${n(c)} litres must use at least one can of each size. Enter the greatest common divisor gcd(${n(a)}, ${n(b)}). Then enter the number of different ways to make up the order: x cans of ${n(a)} litres and y cans of ${n(b)} litres, with ${n(a)}x + ${n(b)}y = ${n(c)} and x and y whole numbers of at least 1. Last, the order may instead go into equal drums of one whole-number size, filled exactly with nothing left over (one drum of ${n(c)} litres counts, and so does a 1-litre drum): enter how many drum sizes would work, which is the number of divisors τ(${n(c)}).`,
   answer: [d, K, T],
   hints: ['Euclid’s algorithm gives the gcd. An equation ax + by = c has whole-number solutions only when the gcd divides c, so divide every term by the gcd before you search.', 'Find the solution with the smallest y. Each further solution adds (first can size ÷ gcd) to y and takes (second can size ÷ gcd) from x; count them while x is still at least 1.', 'For the drum sizes, factorise the order into primes: τ(n) is the product of (exponent + 1) over its primes.'],
   solution: `Euclid’s algorithm: ${euclidText(b, a)}. The last non-zero remainder is ${n(d)}, so gcd(${n(a)}, ${n(b)}) = ${n(d)}, and ${n(d)} divides ${n(c)}, so the order can be filled. ${reduced} The smallest y that leaves a whole x is y = ${n(Y)}, with x = ${n(X)}. Each further solution adds ${n(a1)} to y and takes ${n(b1)} from x, so the solutions (x, y) are ${list}; one more step would make x 0 or less. That is ${n(K)} ways. For the drums, ${n(c)} = ${factorText(c)}, so τ(${n(c)}) = ${tauText} drum sizes.`,
   guidance: [
    { prompt: `Run Euclid’s algorithm on ${n(b)} and ${n(a)}. What is gcd(${n(a)}, ${n(b)})?`, answer: [d], explanation: `${euclidText(b, a)}. The last non-zero remainder, ${n(d)}, is the gcd.` },
    { prompt: `${reduced} Try y = 1, 2, 3, … in turn. What is the smallest y that leaves a whole number x of at least 1, and what is that x?`, answer: [Y, X], explanation: `With y = ${n(Y)}: ${n(c1)} − ${n(b1)} × ${n(Y)} = ${n(c1 - b1 * Y)} = ${n(a1)} × ${n(X)}, so x = ${n(X)}.${Y === 1 ? ' No smaller y is allowed, since y must be at least 1.' : Y === 2 ? ` With y = 1, ${n(c1 - b1)} leaves a remainder when divided by ${n(a1)}.` : ` Every smaller y, from 1 to ${n(Y - 1)}, makes ${n(c1)} − ${n(b1)}y leave a remainder when divided by ${n(a1)}.`}` },
    { prompt: `Each further solution adds ${n(a1)} to y and takes ${n(b1)} from x. How many solutions have x and y both at least 1?`, answer: [K], explanation: `The solutions are ${list}. The next step would make x 0 or less, so there are ${n(K)}.` },
    { prompt: `Factorise ${n(c)} into primes. How many divisors does it have?`, answer: [T], explanation: `${n(c)} = ${factorText(c)}. Each divisor picks an exponent for each prime, from 0 up to its exponent here, so τ(${n(c)}) = ${tauText}.` }
   ] }; }
 },
 /* A loop of n stops (7 to 15, not 10). A forward count A of 100 to 999, a backward count B (not a multiple of n) and
    a pair C, D with D − C a multiple of n half the time. The worked example uses n = 6, never drawn. */
 q12: {
  canonical: { n: 9, A: 470, B: 41, C: 38, D: 101 },
  draw: R => { const m = R.pick([7, 8, 9, 11, 12, 13, 14, 15]), C = R.int(20, 200), same = R.bool(); let B; do B = R.int(11, 99); while (B % m === 0);
   const D = C + m * R.int(2, 9) + (same ? 0 : R.int(1, m - 1)); return { n: m, A: R.int(100, 999), B, C, D }; },
  build: ({ n: m, A, B, C, D }) => { const q1 = Math.floor(A / m), r1 = A % m, q2 = Math.floor(-B / m), r2 = mod(-B, m), diff = D - C, qd = Math.floor(diff / m), rd = diff % m, same = rd === 0 ? 1 : 0; return {
   prompt: `The cargo tram at the Timetable Office runs round a loop of ${n(m)} stops, numbered 0 to ${n(m - 1)}, so every count of stops is read mod ${n(m)}. Starting at stop 0 it has gone ${n(A)} stops forward: enter the least residue of ${n(A)} mod ${n(m)}, which is the stop it has reached. A test run went ${n(B)} stops backward from stop 0, a count of −${n(B)}: enter the least residue of −${n(B)} mod ${n(m)}. Last, enter 1 if ${n(C)} ≡ ${n(D)} (mod ${n(m)}) and 0 if not.`,
   answer: [r1, r2, same],
   hints: ['Divide by the modulus: a = qn + r with 0 ≤ r < n, and r is the least residue. For a negative number the quotient q is negative too, chosen so that r still lies from 0 to n − 1.', 'a ≡ b (mod n) exactly when n divides a − b, which is the same as a and b leaving the same remainder.'],
   solution: `${n(A)} = ${n(q1)} × ${n(m)} + ${n(r1)}, so ${n(A)} ≡ ${n(r1)} (mod ${n(m)}) and the tram is at stop ${n(r1)}. −${n(B)} = ${n(q2)} × ${n(m)} + ${n(r2)}, so the least residue of −${n(B)} is ${n(r2)}: going ${n(B)} stops back lands on stop ${n(r2)}. ${n(D)} − ${n(C)} = ${n(diff)} = ${n(qd)} × ${n(m)}${rd ? ` + ${n(rd)}, so ${n(m)} does not divide it and ${n(C)} is not congruent to ${n(D)}: enter 0.` : `, so ${n(m)} divides it and ${n(C)} ≡ ${n(D)} (mod ${n(m)}): enter 1.`}`,
   guidance: [
    { prompt: `Divide ${n(A)} by ${n(m)}. What are the quotient and the least residue?`, answer: [q1, r1], explanation: `${n(A)} = ${n(q1)} × ${n(m)} + ${n(r1)}, and ${n(r1)} lies from 0 to ${n(m - 1)}.` },
    { prompt: `Write −${n(B)} = q × ${n(m)} + r with 0 ≤ r < ${n(m)}. What are q and r?`, answer: [q2, r2], explanation: `${n(q2)} × ${n(m)} = ${n(q2 * m)}, and −${n(B)} − ${par(q2 * m)} = ${n(r2)}, which lies from 0 to ${n(m - 1)}. One step less negative, ${n(q2 + 1)} × ${n(m)} = ${n((q2 + 1) * m)}, would leave a negative remainder.` },
    { prompt: `What is ${n(D)} − ${n(C)}, and what remainder does it leave on division by ${n(m)}?`, answer: [diff, rd], explanation: `${n(D)} − ${n(C)} = ${n(diff)} = ${n(qd)} × ${n(m)} + ${n(rd)}. ${rd ? 'The remainder is not 0, so the two numbers are not congruent.' : 'The remainder is 0, so the two numbers are congruent.'}` }
   ] }; }
 },
 /* A rota of n shifts (not 10) and two four-digit runs A and B whose residues are at least 2. The worked example
    uses n = 5, never drawn. */
 q13: {
  canonical: { n: 13, A: 4831, B: 2968 },
  draw: R => { let p; do p = { n: R.pick([7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19]), A: R.int(1000, 9999), B: R.int(1000, 9999) }; while (p.A % p.n < 2 || p.B % p.n < 2 || p.A === p.B); return p; },
  build: ({ n: m, A, B }) => { const rA = A % m, rB = B % m, S = rA + rB, s = S % m, P = rA * rB, p = P % m; return {
   prompt: `The Timetable Office runs its shift rota on a cycle of ${n(m)} shifts, numbered 0 to ${n(m - 1)}. Starting from shift 0, one supply run lasts ${n(A)} shifts and the next lasts ${n(B)} shifts. Enter the shift of the cycle at which the second run ends: the least residue of ${n(A)} + ${n(B)} mod ${n(m)}. Then a convoy repeats a run of ${n(B)} shifts ${n(A)} times, starting from shift 0: enter the shift at which it ends, the least residue of ${n(A)} × ${n(B)} mod ${n(m)}. Reduce each number mod ${n(m)} first.`,
   answer: [s, p],
   hints: ['Replace each large number by its least residue first: if a ≡ a′ and b ≡ b′ (mod n), then a + b ≡ a′ + b′ and a × b ≡ a′ × b′ (mod n).', 'After adding or multiplying the small residues, reduce once more so that the result lies from 0 to n − 1.'],
   solution: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)} and ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)}, so ${n(A)} ≡ ${n(rA)} and ${n(B)} ≡ ${n(rB)} (mod ${n(m)}). Sum: ${n(rA)} + ${n(rB)} = ${n(S)}${S < m ? `, already below ${n(m)}` : ` ≡ ${n(s)} (mod ${n(m)})`}, so the second run ends at shift ${n(s)}. Product: ${n(rA)} × ${n(rB)} = ${n(P)}${P < m ? `, already below ${n(m)}` : ` ≡ ${n(p)} (mod ${n(m)})`}, so the convoy ends at shift ${n(p)}. Check: ${n(A)} × ${n(B)} = ${n(A * B)}, which also leaves ${n(p)} on division by ${n(m)}.`,
   guidance: [
    { prompt: `Reduce both runs first. What are the least residues of ${n(A)} and of ${n(B)} mod ${n(m)}?`, answer: [rA, rB], explanation: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)} and ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)}.` },
    { prompt: `Add the two residues and reduce mod ${n(m)}. At which shift does the second run end?`, answer: [s], explanation: `${n(rA)} + ${n(rB)} = ${n(S)}${S < m ? `, which is already below ${n(m)}.` : `, and ${n(S)} − ${n(m)} = ${n(s)}.`}` },
    { prompt: `Multiply the two residues and reduce mod ${n(m)}. At which shift does the convoy end?`, answer: [p], explanation: `${n(rA)} × ${n(rB)} = ${n(P)} = ${n(Math.floor(P / m))} × ${n(m)} + ${n(p)}.` }
   ] }; }
 },
 /* A ticket serial of 6 to 9 digits. The worked example (75284) has 5 digits, so it is never drawn. */
 q14: {
  canonical: { N: 38472915 },
  draw: R => { const len = R.int(6, 9); let N = R.int(1, 9); for (let i = 1; i < len; i++) N = 10 * N + R.int(0, 9); return { N }; },
  build: ({ N }) => { const ds = String(N).split('').map(Number), s = ds.reduce((t, x) => t + x, 0), m9 = s % 9, m3 = s % 3, back = ds.slice().reverse(),
   alt = back.reduce((t, x, i) => t + (i % 2 ? -x : x), 0), m11 = mod(alt, 11), altText = back.map((x, i) => i === 0 ? n(x) : `${i % 2 ? '−' : '+'} ${n(x)}`).join(' ');
   const altEnd = alt >= 0 && alt <= 10 ? `, which already lies from 0 to 10` : ` ≡ ${n(m11)} (mod 11)`; return {
   prompt: `Every ticket at the Timetable Office carries a serial number, and the clerk checks it without long division. Today’s serial is ${n(N)}. Enter the remainder when ${n(N)} is divided by 3, then when it is divided by 9, then when it is divided by 11.`,
   answer: [m3, m9, m11],
   hints: ['A number leaves the same remainder on division by 9, and on division by 3, as the sum of its digits does, because 10 ≡ 1 (mod 9).', 'For 11 use the alternating digit sum: start with the units digit, subtract the tens digit, add the hundreds digit, and so on, because 10 ≡ −1 (mod 11). If the result is negative or above 10, add or take away 11s until it lies from 0 to 10.'],
   solution: `Digit sum: ${ds.map(n).join(' + ')} = ${n(s)}. ${n(s)} = ${n(Math.floor(s / 3))} × 3 + ${n(m3)} and ${n(s)} = ${n(Math.floor(s / 9))} × 9 + ${n(m9)}, so ${n(N)} ≡ ${n(m3)} (mod 3) and ${n(N)} ≡ ${n(m9)} (mod 9). Alternating digit sum from the units digit: ${altText} = ${n(alt)}${altEnd}, so ${n(N)} ≡ ${n(m11)} (mod 11).`,
   guidance: [
    { prompt: `Add up the digits of ${n(N)}. What is the digit sum?`, answer: [s], explanation: `${ds.map(n).join(' + ')} = ${n(s)}.` },
    { prompt: `The serial leaves the same remainders as its digit sum ${n(s)}. What are the remainders on division by 9 and by 3?`, answer: [m9, m3], explanation: `${n(s)} = ${n(Math.floor(s / 9))} × 9 + ${n(m9)} and ${n(s)} = ${n(Math.floor(s / 3))} × 3 + ${n(m3)}.` },
    { prompt: `Start from the units digit and alternate: plus, minus, plus, … What is the alternating digit sum?`, answer: [alt], explanation: `${altText} = ${n(alt)}.` },
    { prompt: `Bring ${n(alt)} into the range 0 to 10 by adding or taking away 11s. What is the remainder of the serial on division by 11?`, answer: [m11], explanation: `${n(alt)}${altEnd}, so the serial leaves ${n(m11)} on division by 11.` }
   ] }; }
 },
 /* An inverse of a mod n for n from 11 to 60, gcd(a, n) = 1, a from 2 to n − 2. Not the worked example (5 mod 17). */
 q15: {
  canonical: { n: 29, a: 11 },
  draw: R => { let p; do { const m = R.int(11, 60); p = { n: m, a: R.int(2, m - 2) }; } while (gcd(p.a, p.n) !== 1 || (p.n === 17 && p.a === 5)); return p; },
  build: ({ n: m, a }) => { const [, x0, y0] = egcd(a, m), inv = mod(x0, m), y = (1 - a * inv) / m, P = a * inv, k = (P - 1) / m;
   const adjust = x0 === inv ? '' : x0 < 0 ? ` That x is negative, so add ${n(m)}: ${n(x0)} + ${n(m)} = ${n(inv)}, and y becomes ${n(y)}.` : ''; return {
   prompt: `The tram loop at the Timetable Office has ${n(m)} stops, numbered 0 to ${n(m - 1)}. On its express setting the tram jumps ${n(a)} stops at a time, and the crew wants it to stop exactly 1 stop past where it started. Enter the modular inverse of ${n(a)} mod ${n(m)}: the number of jumps k, from 1 to ${n(m - 1)}, with ${n(a)}k ≡ 1 (mod ${n(m)}).`,
   answer: [inv],
   hints: ['An inverse of a mod n exists when gcd(a, n) = 1. Run Euclid’s algorithm, then work back up through its steps to write 1 = ax + ny, as for Bézout coefficients.', 'The x of that equation is an inverse of a. If it is negative or bigger than n − 1, add or take away n until it lies from 1 to n − 1.'],
   solution: `Euclid’s algorithm: ${euclidText(m, a)}. The last non-zero remainder is 1, so gcd(${n(a)}, ${n(m)}) = 1 and the inverse exists. Working back up the steps gives ${n(a)} × ${par(x0)} + ${n(m)} × ${par(y0)} = 1.${adjust} So ${n(a)} × ${n(inv)} ≡ 1 (mod ${n(m)}) and the inverse is ${n(inv)}. Check: ${n(a)} × ${n(inv)} = ${n(P)} = ${n(k)} × ${n(m)} + 1.`,
   guidance: [
    { prompt: `Run Euclid’s algorithm on ${n(m)} and ${n(a)}. What is gcd(${n(a)}, ${n(m)})?`, answer: [1], explanation: `${euclidText(m, a)}. The last non-zero remainder is 1, so an inverse exists.` },
    { prompt: `Work back up the steps to write ${n(a)}x + ${n(m)}y = 1, with x from 1 to ${n(m - 1)}. What are x and y?`, answer: [inv, y], explanation: `Back-substitution gives ${n(a)} × ${par(x0)} + ${n(m)} × ${par(y0)} = 1.${adjust} So x = ${n(inv)} and y = ${n(y)}.` },
    { prompt: `Check the inverse. What is ${n(a)} × ${n(inv)}, and what is its least residue mod ${n(m)}?`, answer: [P, 1], explanation: `${n(a)} × ${n(inv)} = ${n(P)} = ${n(k)} × ${n(m)} + 1, so ${n(inv)} jumps of ${n(a)} stops end 1 stop past the start.` }
   ] }; }
 },
 /* ax ≡ b (mod n) with d = gcd(a, n) from {1, 2, 3, 4, 6}, n = d·n1 at most 60, a1 = a ÷ d from 2 to n1 − 1 with
    gcd(a1, n1) = 1, and b = d·b1 with b1 from 1 to n1 − 1, so there are always d solutions; the smallest is at least 2, never a plain 0 or 1 jump.
    Not the worked example (6x ≡ 4 mod 10). */
 q16: {
  canonical: { n: 28, a: 12, b: 8 },
  draw: R => { let p; do { const d = R.pick([1, 2, 3, 4, 6]), n1 = R.int(5, 15), a1 = R.int(2, n1 - 1), b1 = R.int(1, n1 - 1); p = { n: d * n1, a: d * a1, b: d * b1, ok: gcd(a1, n1) === 1 && d * n1 <= 60 }; }
   while (!p.ok || (p.n === 10 && p.a === 6 && p.b === 4) || smallest(p) < 2); delete p.ok; return p; },
  build: ({ n: m, a, b }) => { const d = gcd(a, m), n1 = m / d, a1 = a / d, b1 = b / d, inv = inverse(a1, n1), x0 = inv * b1 % n1, sols = [];
   for (let k = 0; k < d; k++) sols.push(x0 + k * n1);
   const reduce = d === 1 ? `gcd(${n(a)}, ${n(m)}) = 1, which divides ${n(b)}, so there is exactly 1 solution from 0 to ${n(m - 1)}.` : `gcd(${n(a)}, ${n(m)}) = ${n(d)}, which divides ${n(b)}, so there are ${n(d)} solutions from 0 to ${n(m - 1)}. Divide a, b and n by ${n(d)}: ${n(a1)}x ≡ ${n(b1)} (mod ${n(n1)}).`;
   const invStep = `${n(a1)} × ${n(inv)} = ${n(a1 * inv)} ≡ 1 (mod ${n(n1)})`, ib = inv * b1; return {
   prompt: `On a loop of ${n(m)} stops, numbered 0 to ${n(m - 1)}, the tram starts at stop 0 and jumps ${n(a)} stops at a time. The crew wants the numbers of jumps x, from 0 to ${n(m - 1)}, after which it stands at stop ${n(b)}: the solutions of the linear congruence ${n(a)}x ≡ ${n(b)} (mod ${n(m)}). Enter how many solutions there are from 0 to ${n(m - 1)}, then the smallest one.`,
   answer: [d, x0],
   hints: ['Let d = gcd(a, n). If d does not divide b there is no solution; if it does, there are exactly d solutions from 0 to n − 1.', 'Divide a, b and n by d, solve the smaller congruence by multiplying both sides by a modular inverse, then add n ÷ d again and again to list the other solutions.'],
   solution: `${reduce} The inverse of ${n(a1)} mod ${n(n1)} is ${n(inv)}, since ${invStep}. Multiply both sides by ${n(inv)}: x ≡ ${n(inv)} × ${n(b1)} = ${n(ib)}${ib === x0 ? '' : ` ≡ ${n(x0)}`} (mod ${n(n1)}). ${d === 1 ? `The only solution is ${n(x0)}.` : `The solutions from 0 to ${n(m - 1)} are ${sols.map(n).join(', ')}, each ${n(n1)} more than the last, and the smallest is ${n(x0)}.`} Check: ${n(a)} × ${n(x0)} = ${n(a * x0)}${a * x0 === b ? '' : ` ≡ ${n(b)} (mod ${n(m)})`}.`,
   guidance: [
    { prompt: `What is d = gcd(${n(a)}, ${n(m)})? It is also the number of solutions, since it divides ${n(b)}.`, answer: [d], explanation: `${euclidText(m, a)}. The last non-zero remainder is ${n(d)}.` },
    { prompt: d === 1 ? `Nothing needs dividing here. What is the inverse of ${n(a)} mod ${n(m)}?` : `After dividing by ${n(d)} the congruence is ${n(a1)}x ≡ ${n(b1)} (mod ${n(n1)}). What is the inverse of ${n(a1)} mod ${n(n1)}?`, answer: [inv], explanation: `${invStep}.` },
    { prompt: `Multiply both sides by that inverse and reduce. What is the smallest solution?`, answer: [x0], explanation: `x ≡ ${n(inv)} × ${n(b1)} = ${n(ib)}${ib === x0 ? '' : ` ≡ ${n(x0)}`} (mod ${n(n1)}). ${d === 1 ? 'It is the only one.' : `Adding ${n(n1)} gives the others: ${sols.map(n).join(', ')}.`}` }
   ] }; }
 },
 /* A 7-day week, today day s, a convoy in N days (4 digits) and a drone every k days with k mod 7 from 2 to 6, so
    its inverse is never 1. The worked example (N = 100) is never drawn. */
 q17: {
  canonical: { s: 4, N: 2851, k: 12 },
  draw: R => { let k; do k = R.int(8, 40); while (k % 7 < 2); return { s: R.int(0, 6), N: R.int(1000, 9999), k }; },
  build: ({ s, N, k }) => { const q = Math.floor(N / 7), r = N % 7, S = s + r, w = S % 7, k7 = k % 7, x = inverse(k7, 7), next = (s + 1) % 7; return {
   prompt: `The Kepler calendar has a week of 7 days, numbered 0 to 6, and today is day ${n(s)} of the week. The next convoy leaves in ${n(N)} days: enter the number of the weekday it leaves on. A supply drone also lands today and then every ${n(k)} days. Enter the smallest number x of further landings, from 1 to 6, after which it lands on day ${n(next)}, one day on in the week from today’s day ${n(s)}${s === 6 ? ' (after day 6 the week starts again at day 0)' : ''}: this x is the inverse of ${n(k)} mod 7.`,
   answer: [w, x],
   hints: ['Only the days left over after whole weeks matter: reduce the number of days mod 7, add it to today’s number and reduce again.', 'x landings after today is x × k days later, so you need kx ≡ 1 (mod 7). Reduce k mod 7 first, then find its modular inverse.'],
   solution: `${n(N)} = ${n(q)} × 7 + ${n(r)}, so ${n(N)} ≡ ${n(r)} (mod 7), and the convoy leaves on day ${n(s)} + ${n(r)} = ${n(S)}${S >= 7 ? ` ≡ ${n(w)} (mod 7)` : ''}: day ${n(w)}. For the drone, ${n(k)} ≡ ${n(k7)} (mod 7), and ${n(k7)} × ${n(x)} = ${n(k7 * x)} ≡ 1 (mod 7), so the inverse is ${n(x)}: ${n(x)} landings later, ${n(x * k)} days from today, the drone lands on day ${n(next)}.`,
   guidance: [
    { prompt: `What is ${n(N)} mod 7?`, answer: [r], explanation: `${n(N)} = ${n(q)} × 7 + ${n(r)}.` },
    { prompt: `Add that to today’s day ${n(s)} and reduce mod 7. On which weekday does the convoy leave?`, answer: [w], explanation: `${n(s)} + ${n(r)} = ${n(S)}${S >= 7 ? `, and ${n(S)} − 7 = ${n(w)}` : ', already below 7'}.` },
    { prompt: `Reduce the drone’s gap of ${n(k)} days mod 7. What is it?`, answer: [k7], explanation: `${n(k)} = ${n(Math.floor(k / 7))} × 7 + ${n(k7)}.` },
    { prompt: `Which x from 1 to 6 makes ${n(k7)}x ≡ 1 (mod 7)?`, answer: [x], explanation: `${n(k7)} × ${n(x)} = ${n(k7 * x)} = ${n(Math.floor(k7 * x / 7))} × 7 + 1, so x = ${n(x)}.` }
   ] }; }
 },
 /* Three pairwise coprime moduli m1 < m2 < m3 from MODULI and remainders from 1 to m − 1. The product is at most
    8 × 9 × 11 = 792. Not the worked example (3, 4, 5 with remainders 1, 2, 3). */
 q18: {
  canonical: { m1: 4, m2: 5, m3: 9, r1: 3, r2: 1, r3: 7 },
  draw: R => { let p; do { const ms = [R.pick(MODULI), R.pick(MODULI), R.pick(MODULI)].sort((u, v) => u - v); p = { m1: ms[0], m2: ms[1], m3: ms[2] }; }
   while (gcd(p.m1, p.m2) !== 1 || gcd(p.m1, p.m3) !== 1 || gcd(p.m2, p.m3) !== 1);
   p.r1 = R.int(1, p.m1 - 1); p.r2 = R.int(1, p.m2 - 1); p.r3 = R.int(1, p.m3 - 1);
   if (p.m1 === 3 && p.m2 === 4 && p.m3 === 5 && p.r1 === 1 && p.r2 === 2 && p.r3 === 3) p.r3 = 4; return p; },
  build: ({ m1, m2, m3, r1, r2, r3 }) => { const first = []; let v = r1; while (v % m2 !== r2) { first.push(v); v += m1; } first.push(v); const x12 = v, m12 = m1 * m2;
   const second = []; v = x12; while (v % m3 !== r3) { second.push(v); v += m12; } second.push(v); const x = v, M = m12 * m3; return {
   prompt: `The Signal Office stores a message whose length x, in characters, nobody wrote down. The repeater mast only reports remainders: sent in blocks of ${n(m1)} characters the message leaves ${n(r1)} over, in blocks of ${n(m2)} it leaves ${n(r2)} over, and in blocks of ${n(m3)} it leaves ${n(r3)} over. No two of ${n(m1)}, ${n(m2)} and ${n(m3)} share a factor bigger than 1. Enter the shortest length x that fits all three reports, then the product ${n(m1)} × ${n(m2)} × ${n(m3)}, which is the gap between one length that fits and the next.`,
   answer: [x, M],
   hints: ['By the Chinese remainder theorem, when no two moduli share a factor bigger than 1, exactly one number from 1 to the product of the moduli fits every condition, and the others differ from it by multiples of that product.', 'Sieve: start at the first remainder and add the first modulus again and again until a number also fits the second condition. Then add the product of the first two moduli again and again until the third condition fits too.'],
   solution: `${first.length === 1 ? `${n(r1)} leaves ${n(r1)} in blocks of ${n(m1)} and already leaves ${n(r2)} in blocks of ${n(m2)}, so the first two conditions start at ${n(x12)}.` : `Numbers that leave ${n(r1)} in blocks of ${n(m1)}: ${first.map(n).join(', ')}. The first of them that leaves ${n(r2)} in blocks of ${n(m2)} is ${n(x12)}.`} The numbers that fit both conditions repeat every ${n(m1)} × ${n(m2)} = ${n(m12)}${second.length === 1 ? `, and ${n(x12)} already leaves ${n(r3)} in blocks of ${n(m3)}: ${n(x)} =` : `: ${second.map(n).join(', ')}. The first of these that leaves ${n(r3)} in blocks of ${n(m3)} is ${n(x)} =`} ${n(Math.floor(x / m3))} × ${n(m3)} + ${n(r3)}. By the Chinese remainder theorem the lengths that fit repeat every ${n(m1)} × ${n(m2)} × ${n(m3)} = ${n(M)}, so the shortest is ${n(x)}.`,
   guidance: [
    { prompt: `List ${n(r1)}, ${n(r1 + m1)}, ${n(r1 + 2 * m1)}, … (adding ${n(m1)} each time). Which is the first that leaves ${n(r2)} in blocks of ${n(m2)}?`, answer: [x12], explanation: first.length === 1 ? `The first number on the list, ${n(x12)}, already does: ${n(x12)} = ${n(Math.floor(x12 / m2))} × ${n(m2)} + ${n(r2)}.` : `${first.map(n).join(', ')}: the last of these, ${n(x12)}, is ${n(Math.floor(x12 / m2))} × ${n(m2)} + ${n(r2)}.` },
    { prompt: `Every number that fits the first two conditions is ${n(x12)} plus a multiple of one step. What is that step?`, answer: [m12], explanation: `${n(m1)} and ${n(m2)} share no factor bigger than 1, so the step is ${n(m1)} × ${n(m2)} = ${n(m12)}.` },
    { prompt: `Add ${n(m12)} again and again, starting from ${n(x12)}. Which is the first number that leaves ${n(r3)} in blocks of ${n(m3)}?`, answer: [x], explanation: `${second.length === 1 ? `${n(x)} itself already does` : second.map(n).join(', ')}: ${n(x)} = ${n(Math.floor(x / m3))} × ${n(m3)} + ${n(r3)}.` }
   ] }; }
 },
 /* a^k mod n with n from 11 to 99, a from 2 to n − 2, k from 20 to 500 with at least two binary digits 1 (not a
    power of 2) and a result of at least 2. The worked example (5 to the 11 mod 13) has k below 20. */
 q19: {
  canonical: { a: 12, k: 77, n: 41 },
  draw: R => { let p; do { const m = R.int(11, 99); p = { a: R.int(2, m - 2), k: R.int(20, 500), n: m }; } while ((p.k & (p.k - 1)) === 0 || powmod(p.a, p.k, p.n) < 2); return p; },
  build: ({ a, k, n: m }) => { const sq = squaring(a, k, m), top = 2 ** sq.j, sum = sq.parts.join(' + '); return {
   prompt: `The Signal Office’s channel only carries numbers below ${n(m)}, so every big number goes out as its least residue mod ${n(m)}. Mira needs ${n(a)}${sup(k)} mod ${n(m)}. Using repeated squaring, enter how many squarings it takes to build the list ${n(a)}, ${n(a)}², ${n(a)}⁴, ${n(a)}⁸, … (each entry the square of the last, reduced mod ${n(m)}) up to the last entry whose exponent is not more than ${n(k)}. Then enter the least residue of ${n(a)}${sup(k)} mod ${n(m)}.`,
   answer: [sq.j, sq.result],
   hints: ['Write the exponent as a sum of different powers of 2: 1, 2, 4, 8, 16, … The largest power in that sum is as far as the list of squares has to go, and each new entry is the last one squared and reduced.', 'Multiply together the entries whose exponents add up to the exponent you need, reducing mod n after every multiplication.'],
   solution: `${n(k)} = ${sum}, and the largest power of 2 here is ${n(top)}. The list: ${sq.listText}. Reaching ${n(a)}${sup(top)} takes ${n(sq.j)} squarings. Then ${sq.productText}. So ${n(a)}${sup(k)} ≡ ${n(sq.result)} (mod ${n(m)}).`,
   guidance: [
    { prompt: `Write ${n(k)} as a sum of different powers of 2. The largest of them is 2 to the power j: how many squarings j does the list need?`, answer: [sq.j], explanation: `${n(k)} = ${sum}. The largest power is ${n(top)}, and 1, 2, 4, … reach ${n(top)} after ${n(sq.j)} doublings, so ${n(sq.j)} squarings.` },
    { prompt: `Square and reduce mod ${n(m)} again and again. What is the last entry of the list, ${n(a)}${sup(top)} mod ${n(m)}?`, answer: [sq.sq[sq.j]], explanation: `${sq.listText}.` },
    { prompt: `Multiply the entries for ${sum}, reducing as you go. What is ${n(a)}${sup(k)} mod ${n(m)}?`, answer: [sq.result], explanation: `${sq.productText}.` }
   ] }; }
 },
 /* a^k mod p for a prime p from 11 to 97, a from 2 to p − 2 and k from 1000 to 999999, with k mod (p − 1) at least 2.
    The worked example (3 to the 1000 mod 7) has p = 7, never drawn. */
 q20: {
  canonical: { p: 23, a: 5, k: 481213 },
  draw: R => { let q; do { const p = R.pick(PRIMES); q = { p, a: R.int(2, p - 2), k: R.int(1000, 999999) }; } while (q.k % (q.p - 1) < 2); return q; },
  build: ({ p, a, k }) => { const e = p - 1, q = Math.floor(k / e), r = k % e, sq = squaring(a, r, p), res = sq.result; return {
   prompt: `The long-range channel of the Signal Office works mod ${n(p)}, and ${n(p)} is prime. Mira needs ${n(a)}${sup(k)} mod ${n(p)}. Enter the remainder when the exponent ${n(k)} is divided by ${n(p)} − 1, the only part of the exponent that matters by Fermat’s little theorem. Then enter the least residue of ${n(a)}${sup(k)} mod ${n(p)}.`,
   answer: [r, res],
   hints: ['Fermat’s little theorem: when p is prime and does not divide a, a to the power p − 1 is ≡ 1 (mod p). Every whole block of p − 1 in the exponent multiplies by 1, so it can be dropped.', 'Write the exponent as q × (p − 1) + r, keep only r, and find a to the power r mod p by repeated squaring.'],
   solution: `${n(p)} is prime and does not divide ${n(a)}, so ${n(a)}${sup(e)} ≡ 1 (mod ${n(p)}). ${n(k)} = ${n(q)} × ${n(e)} + ${n(r)}, so ${n(a)}${sup(k)} = (${n(a)}${sup(e)})${sup(q)} × ${n(a)}${sup(r)} ≡ 1 × ${n(a)}${sup(r)} (mod ${n(p)}). By repeated squaring: ${sq.listText ? `${sq.listText}; ` : ''}${sq.productText}. So ${n(a)}${sup(k)} ≡ ${n(res)} (mod ${n(p)}).`,
   guidance: [
    { prompt: `By Fermat’s little theorem, ${n(a)} to which power is ≡ 1 (mod ${n(p)})?`, answer: [e], explanation: `${n(p)} is prime and does not divide ${n(a)}, so ${n(a)}${sup(e)} ≡ 1 (mod ${n(p)}).` },
    { prompt: `Divide ${n(k)} by ${n(e)}. What is the remainder r?`, answer: [r], explanation: `${n(k)} = ${n(q)} × ${n(e)} + ${n(r)}, so only ${n(a)}${sup(r)} is left.` },
    { prompt: `Find ${n(a)}${sup(r)} mod ${n(p)} by repeated squaring. What is it?`, answer: [res], explanation: `${sq.listText ? `${sq.listText}; ` : ''}${sq.productText}.` }
   ] }; }
 },
});
})();
