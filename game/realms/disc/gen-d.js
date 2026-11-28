/* Discrete mathematics mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Superscript and subscript digits: sup(12) is '¹²', sub(3) is '₃'. */
const sup = k => String(k).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
const sub = k => String(k).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
/* "3, 2, 4 and 1". */
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const L = i => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i];
const C = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
/* Graphs on v vertices as lists of [i, j] with i < j. */
const degreesOf = (v, edges) => { const d = Array(v).fill(0); for (const [i, j] of edges) { d[i]++; d[j]++; } return d; };
const connected = (v, edges) => { const seen = new Set([0]), stack = [0];
 while (stack.length) { const x = stack.pop(); for (const [i, j] of edges) { const y = i === x ? j : j === x ? i : -1; if (y >= 0 && !seen.has(y)) { seen.add(y); stack.push(y); } } }
 return seen.size === v; };
const randomGraph = (R, v, p) => { const e = []; for (let i = 0; i < v; i++) for (let j = i + 1; j < v; j++) if (R.next() < p) e.push([i, j]); return e; };
const oddCount = d => d.filter(x => x % 2).length;
const eulerCode = odd => odd === 0 ? 2 : odd === 2 ? 1 : 0;
/* q31: the four recurrences aₙ = c·aₙ₋₁ + d·aₙ₋₂ whose characteristic roots are ±2 and ±1 (no coefficient 0). */
const lead = c => c === 1 ? '' : c === -1 ? '−' : n(c);
const sgnTerm = (c, x) => `${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${x}`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* aₙ = A·pⁿ + B·qⁿ with p = ±2, q = ±1, A from 1 to 4 and B from −3 to 3 (not 0). a₁₂ = 4096A + B is always
    at least 4093, so the prompt says "without commas". Never the worked example (roots 3 and −2). */
 q31: {
  canonical: { p: 2, q: 1, A: 3, B: 2 },
  draw: R => { let x; do { const pr = R.pick([[2, 1], [2, -1], [-2, 1], [-2, -1]]); x = { p: pr[0], q: pr[1], A: R.int(1, 4), B: R.pick([-3, -2, -1, 1, 2, 3]) }; } while (x.p === 2 && x.q === 1 && x.A === 3 && x.B === 2); return x; },
  build: ({ p, q, A, B }) => { const c1 = p + q, c2 = -p * q, a0 = A + B, a1 = A * p + B * q, a12 = A * Math.pow(p, 12) + B * Math.pow(q, 12);
   const big = Math.max(p, q), small = Math.min(p, q);
   const rec = `aₙ = ${lead(c1)}aₙ₋₁ ${c2 < 0 ? '−' : '+'} ${n(Math.abs(c2))}aₙ₋₂`;
   const rhs = `${lead(c1)}x ${c2 < 0 ? '−' : '+'} ${n(Math.abs(c2))}`;
   const eq = `x² ${sgnTerm(-c1, 'x')} ${-c2 < 0 ? '−' : '+'} ${n(Math.abs(c2))} = 0`;
   const fac = `(x ${p < 0 ? '+' : '−'} ${n(Math.abs(p))})(x ${q < 0 ? '+' : '−'} ${n(Math.abs(q))})`;
   const eq1 = `${p < 0 ? '−' : ''}2A ${q < 0 ? '−' : '+'} B = ${n(a1)}`;
   const k = q === 1 ? p - 1 : p + 1, kA = k === 1 ? 'A' : k === -1 ? '−A' : `${n(k)}A`;
   const elim = q === 1 ? `Subtracting the first equation from the second removes B: ${kA} = ${n(a1)} − ${par(a0)} = ${n(a1 - a0)}` : `Adding the two equations removes B: ${kA} = ${n(a1)} + ${par(a0)} = ${n(a1 + a0)}`;
   const solveAB = `${elim}${k === 1 ? '' : `, so A = ${n(A)}`}. Then B = ${n(a0)} − ${n(A)} = ${n(B)}.`;
   const bT = (e) => `${B < 0 ? '−' : '+'} ${n(Math.abs(B))} × ${par(q)}${e}`;
   const closed = `aₙ = ${n(A)} × ${par(p)}ⁿ ${bT('ⁿ')}`;
   const last = `a₁₂ = ${n(A)} × ${par(p)}¹² ${bT('¹²')} = ${n(A)} × 4096 ${B < 0 ? '−' : '+'} ${n(Math.abs(B))} × 1 = ${n(a12)}`;
   return {
   prompt: `The pattern counter in the Tiling Works follows the rule ${rec}, with initial conditions a₀ = ${n(a0)} and a₁ = ${n(a1)}. Its characteristic equation has two whole-number roots. Enter the larger root, then the smaller root, then a₁₂ (type it without commas).`,
   answer: [big, small, a12],
   hints: ['Replace aₙ by x², aₙ₋₁ by x and aₙ₋₂ by 1 to get the characteristic equation. Move every term to one side and factor it.', 'With roots r and s, the closed formula is aₙ = A × rⁿ + B × sⁿ. Put n = 0 and n = 1 into it and match the initial conditions to find A and B.'],
   solution: `The characteristic equation is x² = ${rhs}, that is ${eq}, which factors as ${fac} = 0. The roots are ${n(big)} and ${n(small)}, so aₙ = A × ${par(p)}ⁿ + B × ${par(q)}ⁿ. Putting in n = 0 gives A + B = ${n(a0)}, and n = 1 gives ${eq1}. ${solveAB} So ${closed}, and ${last}.`,
   guidance: [
    { prompt: `The characteristic equation of ${rec} is ${eq}. Factor it. What are its two roots, larger first?`, answer: [big, small], explanation: `${eq} factors as ${fac} = 0, so the roots are ${n(big)} and ${n(small)}.` },
    { prompt: `So aₙ = A × ${par(p)}ⁿ + B × ${par(q)}ⁿ. Putting in n = 0 and n = 1 gives A + B = ${n(a0)} and ${eq1}. What are A and B?`, answer: [A, B], explanation: solveAB },
    { prompt: `Now ${closed}. What is a₁₂? Use ${par(p)}¹² = 4096 and ${par(q)}¹² = 1.`, answer: [a12], explanation: `${last}. Stepping through the rule twelve times gives the same number.` }
   ] }; }
 },
 /* Tilings of a strip n long with 1-long and k-long tiles (k = 2 or 3), and m-bit strings with no two 1 digits side by
    side. All counts stay below 400. */
 q32: {
  canonical: { k: 2, n: 9, m: 6 },
  draw: R => { let x; do { const k = R.pick([2, 3]); x = { k, n: k === 2 ? R.int(6, 13) : R.int(8, 15), m: R.int(5, 12) }; } while (x.k === 2 && x.n === 9 && x.m === 6); return x; },
  build: ({ k, n: len, m }) => { const t = [1]; for (let i = 1; i <= len; i++) t.push(t[i - 1] + (i >= k ? t[i - k] : 0));
   const b = [0, 2, 3]; for (let i = 3; i <= m; i++) b.push(b[i - 1] + b[i - 2]);
   const rec = `tₙ = tₙ₋₁ + tₙ₋${sub(k)}`, start = k === 2 ? 't₀ = 1 (the empty strip) and t₁ = 1' : 't₀ = 1 (the empty strip), t₁ = 1 and t₂ = 1';
   return {
   prompt: `The Tiling Works lays strips 1 unit wide. A strip ${n(len)} units long is to be covered end to end with tiles 1 unit long and tiles ${n(k)} units long. Enter the number of different tilings of the strip. Then enter the number of ${n(m)}-bit strings in which no 1 sits next to another 1.`,
   answer: [t[len], b[m]],
   hints: [`Look at the last tile of the strip: it is 1 long or ${n(k)} long, and taking it away leaves a shorter strip. So ${rec}, starting from t₀ = 1 for the empty strip.`, 'A good bit string ends in 0 or in 01, and taking that end away leaves a shorter good string. So bₘ = bₘ₋₁ + bₘ₋₂, with b₁ = 2 and b₂ = 3.'],
   solution: `Let tₙ be the number of tilings of a strip n long. Its last tile is 1 long or ${n(k)} long, so ${rec}. Starting from ${start}, the counts for lengths 0 to ${n(len)} are ${t.join(', ')}, so the strip has ${n(t[len])} tilings. For the bit strings, bₘ = bₘ₋₁ + bₘ₋₂ with b₁ = 2 and b₂ = 3 gives ${b.slice(1).join(', ')} for lengths 1 to ${n(m)}, so there are ${n(b[m])} good strings of length ${n(m)}.`,
   guidance: [
    { prompt: `Count short strips first. A strip shorter than ${n(k)} can only take 1-long tiles, so ${start}; after that ${rec}. What are t${sub(k)}, t${sub(k + 1)} and t${sub(k + 2)}?`, answer: [t[k], t[k + 1], t[k + 2]], explanation: `t${sub(k)} = ${t[k - 1]} + ${t[0]} = ${t[k]}, t${sub(k + 1)} = ${t[k]} + ${t[1]} = ${t[k + 1]} and t${sub(k + 2)} = ${t[k + 1]} + ${t[2]} = ${t[k + 2]}.` },
    { prompt: `Keep adding with ${rec}. What is t${sub(len)}, the number of tilings of the strip ${n(len)} long?`, answer: [t[len]], explanation: `The counts for lengths 0 to ${n(len)} are ${t.join(', ')}. Each is the one before it plus the one ${n(k)} places before it.` },
    { prompt: `For the bit strings, b₁ = 2 (0 and 1), b₂ = 3 (00, 01 and 10) and bₘ = bₘ₋₁ + bₘ₋₂. What is b${sub(m)}?`, answer: [b[m]], explanation: `The counts for lengths 1 to ${n(m)} are ${b.slice(1).join(', ')}: each is the sum of the two before it.` }
   ] }; }
 },
 /* Up to a one-credit tokens (1 + x + … + xᵃ), up to b two-credit tokens (1 + x² + … + x²ᵇ) and up to 2 five-credit
    tokens (1 + x⁵ + x¹⁰). The coefficient of xᵏ is at least 2. */
 q33: {
  canonical: { a: 4, b: 3, k: 9 },
  draw: R => { const ways = (a, b, k) => { let c = 0; for (let f = 0; f <= 2; f++) for (let w = 0; w <= b; w++) { const o = k - 5 * f - 2 * w; if (o >= 0 && o <= a) c++; } return c; };
   let x; do { const a = R.int(2, 5), b = R.int(1, 4); x = { a, b, k: R.int(4, a + 2 * b + 10) }; } while (ways(x.a, x.b, x.k) < 2 || (x.a === 4 && x.b === 3 && x.k === 9)); return x; },
  build: ({ a, b, k }) => {
   const f1 = '(1 + x' + Array.from({ length: a - 1 }, (_, i) => ' + x' + sup(i + 2)).join('') + ')';
   const f2 = '(1' + Array.from({ length: b }, (_, i) => ' + x' + sup(2 * i + 2)).join('') + ')';
   const gf = `${f1}${f2}(1 + x⁵ + x¹⁰)`;
   const cases = [0, 1, 2].map(f => { const rest = k - 5 * f, list = []; for (let w = 0; w <= b; w++) { const o = rest - 2 * w; if (o >= 0 && o <= a) list.push(`(${f}, ${w}, ${o})`); } return { rest, list }; });
   const cnt = cases.map(c => c.list.length), coef = cnt[0] + cnt[1] + cnt[2], total = (a + 1) * (b + 1) * 3;
   const way = c => `${c} way${c === 1 ? '' : 's'}`;
   const say = (c, f) => { const head = f === 0 ? 'With no five-credit token' : f === 1 ? 'With one five-credit token' : 'With two five-credit tokens';
    if (c.rest < 0) return `${head} the value is already over ${n(k)}: 0 ways.`;
    return `${head} the rest must make ${n(c.rest)}: ${c.list.length ? c.list.join(', ') + ', ' : ''}${way(c.list.length)}.`; };
   const why = (c, f) => c.rest < 0 ? `${n(k)} − ${5 * f} is below 0, so no choice works.` : c.list.length ? `Write a choice as (fives, twos, ones). The ones must be from 0 to ${n(a)}: ${c.list.join(', ')}.` : `No number of two-credit tokens leaves a number of one-credit tokens from 0 to ${n(a)}.`;
   return {
   prompt: `At the Tiling Works pay desk Mira has ${n(a)} one-credit tokens, ${n(b)} two-credit token${b === 1 ? '' : 's'} and 2 five-credit tokens. Tokens of the same value are alike. The generating function for paying with them is ${gf}. Enter the coefficient of x${sup(k)}: the number of ways to pay exactly ${n(k)} credits. Then enter the value of the product at x = 1.`,
   answer: [coef, total],
   hints: ['Picking one term from each bracket is picking how many of each token to use, and the powers add up to the value paid. So the coefficient of xᵏ counts the picks whose values add up to k.', 'Sort the picks by the number of five-credit tokens: none, one or two. For each, try every number of two-credit tokens and keep those that leave a number of one-credit tokens Mira really has.'],
   solution: `Write a choice as (fives, twos, ones). ${say(cases[0], 0)} ${say(cases[1], 1)} ${say(cases[2], 2)} In all ${cnt[0]} + ${cnt[1]} + ${cnt[2]} = ${coef}, so the coefficient of x${sup(k)} is ${coef}. At x = 1 every power of x is 1, so each bracket becomes its number of terms: ${a + 1} × ${b + 1} × 3 = ${total}, the number of ways to pick tokens with no target at all.`,
   guidance: [
    { prompt: `How many choices use no five-credit token, so that the one- and two-credit tokens make ${n(k)} by themselves?`, answer: [cnt[0]], explanation: why(cases[0], 0) },
    { prompt: `How many use exactly one five-credit token? Then the other tokens must make ${n(k)} − 5.`, answer: [cnt[1]], explanation: why(cases[1], 1) },
    { prompt: `How many use both five-credit tokens? Then the other tokens must make ${n(k)} − 10.`, answer: [cnt[2]], explanation: why(cases[2], 2) },
    { prompt: `Put x = 1 into ${gf}. What number do you get?`, answer: [total], explanation: `Every term becomes 1, so the brackets become ${a + 1}, ${b + 1} and 3, and ${a + 1} × ${b + 1} × 3 = ${total}.` }
   ] }; }
 },
 /* Crews of k from n tilers, with or without one named tiler: C(n − 1, k − 1) + C(n − 1, k) = C(n, k). k >= 3 and
    k <= n − 2, so no case is a single crew and "the other 1" never appears; C(12, 6) = 924 is the largest count. */
 q34: {
  canonical: { n: 9, k: 4 },
  draw: R => { let x; do { const N = R.int(7, 12); x = { n: N, k: R.int(3, N - 2) }; } while (x.n === 9 && x.k === 4); return x; },
  build: ({ n: N, k }) => { const w = C(N - 1, k - 1), wo = C(N - 1, k), all = C(N, k); return {
   prompt: `The Tiling Works needs a crew of ${n(k)} from its ${n(N)} tilers, and Mira checks the ledger by counting the crews two ways. One of the tilers is Oskar, the foreman. Enter the number of crews that include Oskar, then the number that leave him out, then the number of all crews of ${n(k)} counted directly as C(${n(N)}, ${n(k)}).`,
   answer: [w, wo, all],
   hints: ['If Oskar is in the crew, he fills one place, and only the other places are left to fill from the other tilers.', 'If Oskar is left out, the whole crew comes from the other tilers. The two cases never overlap and between them cover every crew, so their counts add up to the direct count.'],
   solution: `Crews with Oskar: he takes one place, and the other ${n(k - 1)} come from the other ${n(N - 1)} tilers, so there are C(${n(N - 1)}, ${n(k - 1)}) = ${n(w)}. Crews without him: all ${n(k)} come from the other ${n(N - 1)}, so there are C(${n(N - 1)}, ${n(k)}) = ${n(wo)}. Directly, C(${n(N)}, ${n(k)}) = ${n(N)}! ÷ (${n(k)}! × ${n(N - k)}!) = ${n(all)}. Both ways count the same crews, and ${n(w)} + ${n(wo)} = ${n(all)}: the identity C(n, k) = C(n − 1, k − 1) + C(n − 1, k) at n = ${n(N)} and k = ${n(k)}.`,
   guidance: [
    { prompt: `Oskar is in the crew. The other ${n(k - 1)} places are filled from the other ${n(N - 1)} tilers. How many crews is that?`, answer: [w], explanation: `C(${n(N - 1)}, ${n(k - 1)}) = ${n(N - 1)}! ÷ (${n(k - 1)}! × ${n(N - k)}!) = ${n(w)}.` },
    { prompt: `Oskar is left out. All ${n(k)} places are filled from the other ${n(N - 1)} tilers. How many crews is that?`, answer: [wo], explanation: `C(${n(N - 1)}, ${n(k)}) = ${n(N - 1)}! ÷ (${n(k)}! × ${n(N - 1 - k)}!) = ${n(wo)}.` },
    { prompt: `Now count all crews of ${n(k)} from ${n(N)} at once. What is C(${n(N)}, ${n(k)})?`, answer: [all], explanation: `C(${n(N)}, ${n(k)}) = ${n(all)}, the same as ${n(w)} + ${n(wo)}: two honest counts of one set of crews always agree.` }
   ] }; }
 },
 /* Division by b from 4 to 12 of a positive a1 and a negative a2, both with a remainder that is not 0, so the
    negative case always needs the step down to the multiple below. */
 q35: {
  canonical: { b: 7, a1: 100, a2: -45 },
  draw: R => { let x; do { x = { b: R.int(4, 12), a1: R.int(30, 200), a2: -R.int(10, 150) }; } while (x.a1 % x.b === 0 || x.a2 % x.b === 0 || (x.b === 7 && x.a1 === 100 && x.a2 === -45) || (x.b === 5 && x.a1 === 23)); return x; },
  build: ({ b, a1, a2 }) => { const q1 = Math.floor(a1 / b), r1 = a1 - b * q1, q2 = Math.floor(a2 / b), r2 = a2 - b * q2, m2 = b * q2; return {
   prompt: `The Road Office beacon runs on a timer that starts a new round every ${n(b)} seconds. A clock reading t is logged as t = ${n(b)} × quotient + remainder, where the quotient is the round and the remainder, from 0 to ${n(b - 1)}, is the seconds into it. A signal came at t = ${n(a1)}, and a fault began at t = ${n(a2)}, before the clock was set. Enter the quotient and the remainder for ${n(a1)}, then the quotient and the remainder for ${n(a2)}.`,
   answer: [q1, r1, q2, r2],
   hints: [`For a positive reading, the quotient is how many whole ${n(b)}s fit into it, and the remainder is what is left over.`, `For a negative reading, step down to the first multiple of ${n(b)} at or below it, so that the remainder is still from 0 to ${n(b - 1)}. The quotient is then negative, but the remainder is not.`],
   solution: `${n(a1)} = ${n(b)} × ${n(q1)} + ${n(r1)}, with ${n(r1)} from 0 to ${n(b - 1)}, so the quotient is ${n(q1)} and the remainder is ${n(r1)}. For ${n(a2)}, the first multiple of ${n(b)} at or below it is ${n(b)} × ${par(q2)} = ${n(m2)}, and ${n(a2)} − ${par(m2)} = ${n(r2)}. So ${n(a2)} = ${n(b)} × ${par(q2)} + ${n(r2)}: the quotient is ${n(q2)} and the remainder is ${n(r2)}. The quotient ${n(q2 + 1)} would leave ${n(r2 - b)}, and a remainder is never negative.`,
   guidance: [
    { prompt: `How many whole ${n(b)}s fit into ${n(a1)}, and how much is left over?`, answer: [q1, r1], explanation: `${n(b)} × ${n(q1)} = ${n(b * q1)}, and ${n(a1)} − ${n(b * q1)} = ${n(r1)}, so ${n(a1)} = ${n(b)} × ${n(q1)} + ${n(r1)}.` },
    { prompt: `Which multiple of ${n(b)} is the first one at or below ${n(a2)}?`, answer: [m2], explanation: `${n(b)} × ${par(q2 + 1)} = ${n(m2 + b)} is above ${n(a2)}, and ${n(b)} × ${par(q2)} = ${n(m2)} is the first multiple at or below it.` },
    { prompt: `So ${n(a2)} = ${n(b)} × quotient + remainder with the remainder from 0 to ${n(b - 1)}. What are the quotient and the remainder?`, answer: [q2, r2], explanation: `${n(a2)} − ${par(m2)} = ${n(r2)}, so ${n(a2)} = ${n(b)} × ${par(q2)} + ${n(r2)}.` }
   ] }; }
 },
 /* (a × b + c) mod m for two-digit a and b, and the weekday N days on, with N mod 7 not 0. */
 q36: {
  canonical: { a: 38, b: 47, c: 15, m: 9, d: 2, N: 100 },
  draw: R => { let x; do { x = { a: R.int(20, 99), b: R.int(20, 99), c: R.int(2, 30), m: R.int(5, 12), d: R.int(0, 6), N: R.int(30, 999) }; } while (x.N % 7 === 0 || x.a % x.m === 0 || x.b % x.m === 0 || (x.a === 38 && x.b === 47)); return x; },
  build: ({ a, b, c, m, d, N }) => { const ra = a % m, rb = b % m, small = ra * rb + c, r = small % m, big = a * b + c, Nq = Math.floor(N / 7), Nr = N % 7, day = (d + Nr) % 7; return {
   prompt: `The Road Office stamps each permit with a check number: the remainder of ${n(a)} × ${n(b)} + ${n(c)} on division by ${n(m)}, written (${n(a)} × ${n(b)} + ${n(c)}) mod ${n(m)}. Enter that check number. Then: today is ${DAYS[d]}, and the next convoy leaves in ${n(N)} days. With the days coded 0 for Monday, 1 for Tuesday, 2 for Wednesday, 3 for Thursday, 4 for Friday, 5 for Saturday and 6 for Sunday, enter the code of the day the convoy leaves.`,
   answer: [r, day],
   hints: ['Replace each number by its remainder first. Numbers that are congruent mod m give congruent results in sums and products, so the small numbers give the same check number.', 'The weekday comes round again every 7 days, so only the number of days mod 7 matters. Add it to today’s code, and take mod 7 again if the sum reaches 7.'],
   solution: `${n(a)} mod ${n(m)} = ${n(ra)} and ${n(b)} mod ${n(m)} = ${n(rb)}, so ${n(a)} × ${n(b)} + ${n(c)} ≡ ${n(ra)} × ${n(rb)} + ${n(c)} = ${n(small)} ≡ ${n(r)} (mod ${n(m)}). As a check, ${n(a)} × ${n(b)} + ${n(c)} = ${n(big)} = ${n(m)} × ${n(Math.floor(big / m))} + ${n(r)}. The check number is ${n(r)}. Today is ${DAYS[d]}, code ${n(d)}. ${n(N)} = 7 × ${n(Nq)} + ${n(Nr)}, so the weekday moves on by ${n(Nr)}: ${n(d)} + ${n(Nr)} = ${n(d + Nr)}${d + Nr >= 7 ? ` ≡ ${n(day)} (mod 7)` : ''}, which is ${DAYS[day]}, code ${n(day)}.`,
   guidance: [
    { prompt: `What are ${n(a)} mod ${n(m)} and ${n(b)} mod ${n(m)}?`, answer: [ra, rb], explanation: `${n(a)} = ${n(m)} × ${n(Math.floor(a / m))} + ${n(ra)} and ${n(b)} = ${n(m)} × ${n(Math.floor(b / m))} + ${n(rb)}.` },
    { prompt: `Now work out (${n(ra)} × ${n(rb)} + ${n(c)}) mod ${n(m)}.`, answer: [r], explanation: `${n(ra)} × ${n(rb)} + ${n(c)} = ${n(small)}, and ${n(small)} = ${n(m)} × ${n(Math.floor(small / m))} + ${n(r)}, so the check number is ${n(r)}.` },
    { prompt: `What is ${n(N)} mod 7?`, answer: [Nr], explanation: `${n(N)} = 7 × ${n(Nq)} + ${n(Nr)}. The ${n(Nq)} whole weeks bring back the same weekday.` },
    { prompt: `Today’s code is ${n(d)}. Add ${n(Nr)} and take mod 7. What is the code of the convoy’s day?`, answer: [day], explanation: `${n(d)} + ${n(Nr)} = ${n(d + Nr)}${d + Nr >= 7 ? `, and ${n(d + Nr)} mod 7 = ${n(day)}` : ''}: ${DAYS[day]}.` }
   ] }; }
 },
 /* Two road maps drawn as random simple graphs: every junction has a road. The east yard's degrees give its number
    of roads; the west yard gives its roads and all degrees but the last. */
 q37: {
  canonical: { d1: [3, 2, 4, 1, 2, 2], d2: [3, 3, 2, 2, 4], e2: 7 },
  draw: R => { const make = (lo, hi) => { for (let i = 0; i < 500; i++) { const v = R.int(lo, hi), e = randomGraph(R, v, 0.45), d = degreesOf(v, e);
     if (d.every(x => x >= 1) && e.length >= v && e.length <= 2 * v) return { d, e: e.length }; } return null; };
   let g1, g2; do { g1 = make(5, 8); g2 = make(5, 7); } while (!g1 || !g2 || g2.d[g2.d.length - 1] < 2);
   return { d1: g1.d, d2: g2.d, e2: g2.e }; },
  build: ({ d1, d2, e2 }) => { const S1 = d1.reduce((s, x) => s + x, 0), E1 = S1 / 2, known = d2.slice(0, -1), K = known.reduce((s, x) => s + x, 0), dT = 2 * e2 - K;
   const n1 = `A to ${L(d1.length - 1)}`, last = L(15 + d2.length - 1), names2 = known.map((_, i) => L(15 + i)); return {
   prompt: `The Road Office maps the depot roads as a graph: each junction is a vertex, and each road is an edge joining two junctions. The degree of a junction is the number of roads that meet there. In the east yard, junctions ${n1} have degrees ${and(d1.map(n))}. Enter the number of roads in the east yard. The west yard has ${n(e2)} roads and ${n(d2.length)} junctions, P to ${last}; ${and(names2)} have degrees ${and(known.map(n))}. Enter the degree of ${last}.`,
   answer: [E1, dT],
   hints: ['Every road has two ends, and each end adds 1 to the degree of a junction. So the degrees add up to twice the number of roads.', `In the west yard the degrees must add up to twice the number of roads. The degree of ${last} is whatever the other junctions leave short of that total.`],
   solution: `East yard: the degrees add up to ${d1.map(n).join(' + ')} = ${n(S1)}. By the handshake lemma that is twice the number of roads, so there are ${n(S1)} ÷ 2 = ${n(E1)} roads. West yard: ${n(e2)} roads give a degree sum of 2 × ${n(e2)} = ${n(2 * e2)}. The other degrees add up to ${n(K)}, so ${last} has degree ${n(2 * e2)} − ${n(K)} = ${n(dT)}.`,
   guidance: [
    { prompt: `What do the degrees in the east yard add up to?`, answer: [S1], explanation: `${d1.map(n).join(' + ')} = ${n(S1)}.` },
    { prompt: `Each road adds 2 to that sum, one for each end. How many roads are in the east yard?`, answer: [E1], explanation: `${n(S1)} ÷ 2 = ${n(E1)}. This is the handshake lemma: the degrees add up to twice the number of edges.` },
    { prompt: `In the west yard, what must all ${n(d2.length)} degrees add up to, and what do the degrees of ${and(names2)} add up to?`, answer: [2 * e2, K], explanation: `${n(e2)} roads give 2 × ${n(e2)} = ${n(2 * e2)}. The known degrees give ${known.map(n).join(' + ')} = ${n(K)}.` },
    { prompt: `What is the degree of ${last}?`, answer: [dT], explanation: `${n(2 * e2)} − ${n(K)} = ${n(dT)}.` }
   ] }; }
 },
 /* A tree on v1 domes; a connected network of v2 junctions and e2 roads cut down to a tree; a tree whose t inner
    junctions have degree 3 and whose leaves have degree 1 (it has t + 2 leaves). */
 q38: {
  canonical: { v1: 12, v2: 9, e2: 14, t: 5 },
  draw: R => { let x; do { const v2 = R.int(6, 15); x = { v1: R.int(8, 40), v2, e2: v2 + R.int(1, 10), t: R.int(2, 12) }; } while (x.e2 > x.v2 * (x.v2 - 1) / 2 || (x.v1 === 12 && x.v2 === 9) || x.v1 === 7); return x; },
  build: ({ v1, v2, e2, t }) => { const keep = v2 - 1, cut = e2 - keep, leaves = t + 2; return {
   prompt: `Mira is planning roads for the outer domes. She wants to link ${n(v1)} domes so that every dome can reach every other one, with no cycle: no route that leaves a dome and comes back to it without using a road twice. Enter the number of roads she needs. Next, an old network links ${n(v2)} junctions with ${n(e2)} roads and is connected. Enter the fewest roads to close so that what is left is a tree. Last, a tree in the plan has ${n(t)} junctions of degree 3, and every other junction has degree 1. Enter the number of junctions of degree 1.`,
   answer: [v1 - 1, cut, leaves],
   hints: ['A connected network with no cycle is a tree, and a tree with v vertices always has v − 1 edges. Closing roads to leave a tree keeps exactly that many.', `For the last tree, write L for the number of junctions of degree 1. It has ${n(t)} + L junctions and so ${n(t)} + L − 1 roads, and by the handshake lemma its degrees add up to twice the number of roads.`],
   solution: `A tree on ${n(v1)} vertices has ${n(v1)} − 1 = ${n(v1 - 1)} edges, so Mira needs ${n(v1 - 1)} roads. A tree on ${n(v2)} junctions keeps ${n(keep)} of the ${n(e2)} roads, so ${n(e2)} − ${n(keep)} = ${n(cut)} must close. For the last tree, with L leaves: 3 × ${n(t)} + L = 2 × (${n(t)} + L − 1), that is ${n(3 * t)} + L = ${n(2 * t - 2)} + 2L, so L = ${n(3 * t)} − ${n(2 * t - 2)} = ${n(leaves)}.`,
   guidance: [
    { prompt: `A tree on ${n(v1)} vertices has how many edges?`, answer: [v1 - 1], explanation: `${n(v1)} − 1 = ${n(v1 - 1)}. Start from one dome; each road then reaches one new dome, so ${n(v1 - 1)} roads reach the other ${n(v1 - 1)}.` },
    { prompt: `A tree on ${n(v2)} junctions has how many roads, and how many of the ${n(e2)} roads must close?`, answer: [keep, cut], explanation: `The tree keeps ${n(v2)} − 1 = ${n(keep)} roads, so ${n(e2)} − ${n(keep)} = ${n(cut)} close. Each one closed breaks one cycle without cutting the network.` },
    { prompt: `The degrees of the last tree add up to 3 × ${n(t)} + L, and the tree has ${n(t)} + L − 1 roads. Solve 3 × ${n(t)} + L = 2 × (${n(t)} + L − 1). What is L?`, answer: [leaves], explanation: `${n(3 * t)} + L = ${n(2 * t - 2)} + 2L, so L = ${n(3 * t)} − ${n(2 * t - 2)} = ${n(leaves)}.` }
   ] }; }
 },
 /* A connected simple graph on six junctions A to F with 6 to 10 roads. The draw first picks the kind (circuit, path
    only, neither) so the three codes come up about equally often. */
 q39: {
  canonical: { edges: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [2, 4], [2, 5], [4, 5]] },
  draw: R => { const want = R.pick([0, 1, 2]);
   for (let i = 0; i < 4000; i++) { const e = randomGraph(R, 6, 0.5); if (e.length < 6 || e.length > 10 || !connected(6, e)) continue;
    if (eulerCode(oddCount(degreesOf(6, e))) === want && JSON.stringify(e) !== '[[0,1],[0,2],[0,3],[1,2],[2,3],[2,4],[2,5],[4,5]]') return { edges: e }; }
   return { edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 5], [0, 3]] }; },
  build: ({ edges }) => { const d = degreesOf(6, edges), odd = oddCount(d), code = eulerCode(odd), oddNames = d.map((x, i) => x % 2 ? L(i) : null).filter(Boolean);
   const roads = and(edges.map(([i, j]) => `${L(i)}–${L(j)}`)), degs = d.map((x, i) => `${L(i)} ${x}`).join(', ');
   const verdict = odd === 0 ? 'Every degree is even, so the yard has an Euler circuit: code 2.' : odd === 2 ? `Exactly two are odd, so there is an Euler path from ${oddNames[0]} to ${oddNames[1]} but no Euler circuit: code 1.` : `${odd} odd degrees is more than two, so there is neither an Euler path nor an Euler circuit: code 0.`;
   const which = odd === 0 ? 'No junction has odd degree' : `The odd ones are ${and(oddNames)}`;
   return {
   prompt: `The night patrol wants to drive along every road of the north yard exactly once. The yard is connected, with junctions A to F and these ${edges.length} roads: ${roads}. Enter the number of junctions of odd degree. Then enter 2 if the yard has an Euler circuit, 1 if it has an Euler path but no Euler circuit, or 0 if it has neither.`,
   answer: [odd, code],
   hints: ['Count the roads that meet at each junction to get its degree, then count how many of the six degrees are odd.', 'A connected graph has an Euler circuit when every degree is even, an Euler path but no circuit when exactly two degrees are odd, and neither when more than two are odd.'],
   solution: `The degrees are ${degs}. ${odd === 0 ? 'None of them is odd' : `The odd ones are ${and(oddNames)}, ${odd} in all`}. ${verdict}`,
   guidance: [
    { prompt: `Count the roads at each junction. What are the degrees of A, B and C?`, answer: [d[0], d[1], d[2]], explanation: `A ${d[0]}, B ${d[1]}, C ${d[2]}: each road listed with that letter adds 1.` },
    { prompt: `And the degrees of D, E and F?`, answer: [d[3], d[4], d[5]], explanation: `D ${d[3]}, E ${d[4]}, F ${d[5]}. All six add up to ${2 * edges.length}, twice the ${edges.length} roads.` },
    { prompt: `How many of the six degrees are odd?`, answer: [odd], explanation: `${which}: ${odd} in all. By the handshake lemma this count is always even.` },
    { prompt: `Which code fits: 2 for an Euler circuit, 1 for an Euler path but no circuit, 0 for neither?`, answer: [code], explanation: verdict }
   ] }; }
 },
 /* A connected simple graph on 6 to 8 junctions, given by its degrees, and N posts shared among its roads. */
 q40: {
  canonical: { deg: [2, 4, 3, 3, 2, 4, 2], N: 247 },
  draw: R => { const want = R.pick([0, 1, 2]);
   for (let i = 0; i < 4000; i++) { const v = R.int(6, 8), e = randomGraph(R, v, 0.4); if (e.length < 7 || e.length > 13 || !connected(v, e)) continue;
    const d = degreesOf(v, e); if (eulerCode(oddCount(d)) !== want) continue;
    let N; do { N = R.int(100, 999); } while (N % e.length === 0); return { deg: d, N }; }
   return { deg: [2, 2, 2, 2, 2, 2, 2, 2], N: 300 }; },
  build: ({ deg, N }) => { const S = deg.reduce((s, x) => s + x, 0), E = S / 2, odd = oddCount(deg), code = eulerCode(odd), q = Math.floor(N / E), r = N - E * q;
   const oddNames = deg.map((x, i) => x % 2 ? L(i) : null).filter(Boolean);
   const verdict = odd === 0 ? 'Every degree is even, so the network has an Euler circuit: code 2' : odd === 2 ? `Exactly two are odd, so it has an Euler path from ${oddNames[0]} to ${oddNames[1]} but no circuit: code 1` : 'More than two are odd, so it has neither an Euler path nor an Euler circuit: code 0';
   const which = odd === 0 ? 'No degree is odd' : `The odd degrees are at ${and(oddNames)}, ${odd} in all`;
   return {
   prompt: `Mira’s final depot plan joins junctions A to ${L(deg.length - 1)} in one connected network. Their degrees, in order, are ${and(deg.map(n))}. Before opening, ${n(N)} reflector posts are shared out equally among the roads, as many to each road as possible. Enter the number of roads, then the Euler code (2 for an Euler circuit, 1 for an Euler path but no circuit, 0 for neither), then the number of posts left over.`,
   answer: [E, code, r],
   hints: ['The handshake lemma turns the list of degrees into the number of roads.', 'Count the odd degrees to choose the Euler code. The posts left over are the remainder when the number of posts is divided by the number of roads.'],
   solution: `The degrees add up to ${n(S)}, so there are ${n(S)} ÷ 2 = ${n(E)} roads. ${which}. ${verdict}. ${n(N)} = ${n(E)} × ${n(q)} + ${n(r)}, with ${n(r)} from 0 to ${n(E - 1)}, so each road gets ${n(q)} posts and ${n(r)} ${r === 1 ? 'is' : 'are'} left over.`,
   guidance: [
    { prompt: `The degrees add up to ${n(S)}. How many roads are there?`, answer: [E], explanation: `By the handshake lemma, ${n(S)} ÷ 2 = ${n(E)}.` },
    { prompt: `How many of the degrees are odd?`, answer: [odd], explanation: `${which}.` },
    { prompt: `Which Euler code fits: 2, 1 or 0?`, answer: [code], explanation: `The network is connected. ${verdict}.` },
    { prompt: `Share ${n(N)} posts among ${n(E)} roads. What are the quotient and the remainder of ${n(N)} on division by ${n(E)}?`, answer: [q, r], explanation: `${n(E)} × ${n(q)} = ${n(E * q)}, and ${n(N)} − ${n(E * q)} = ${n(r)}.` }
   ] }; }
 }
});
})();
