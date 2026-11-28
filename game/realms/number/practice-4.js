/* Number theory: the hidden life of whole numbers practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* An ordinal for a whole number: ord(1) is '1st', ord(12) is '12th', ord(23) is '23rd'. */
const ord = v => `${n(v)}${v % 100 >= 11 && v % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][v % 10] || 'th')}`;
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
/* Whole-number helpers. mod always gives a least residue 0 … m − 1, also for a negative a. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mod = (a, m) => ((a % m) + m) % m;
const powmod = (a, k, m) => { let r = 1 % m, b = mod(a, m); while (k > 0) { if (k & 1) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const egcd = (a, b) => { if (b === 0) return [a, 1, 0]; const [g, x, y] = egcd(b, a % b); return [g, y, x - Math.floor(a / b) * y]; };
const inverse = (a, m) => mod(egcd(mod(a, m), m)[1], m);
const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUPD[Number(d)]).join('');
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const isPow2 = k => (k & (k - 1)) === 0;
/* The division steps of Euclid's algorithm on a ≥ b, as '9 = 1 × 6 + 3, 6 = 2 × 3 + 0'. */
const euclidText = (a, b) => { const out = []; while (b) { out.push(`${n(a)} = ${n(Math.floor(a / b))} × ${n(b)} + ${n(a % b)}`); [a, b] = [b, a % b]; } return out.join(', '); };
/* A draw loop that gives up after 1000 tries and returns the canonical parameters. */
const bounded = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* Repeated squaring of a mod m up to the largest power of 2 not above k, then the product of the needed squares. */
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
/* Solving ax ≡ b (mod m) when gcd(a, m) = d divides b: d, the reduced congruence, the inverse, the smallest solution
   and all the solutions from 0 to m − 1; `main` is the worked text up to the smallest solution. */
const lin = (a, b, m) => {
 const d = gcd(a, m), n1 = m / d, a1 = a / d, b1 = b / d, inv = inverse(a1, n1), ib = inv * b1, x0 = ib % n1, sols = [];
 for (let k = 0; k < d; k++) sols.push(x0 + k * n1);
 const head = `gcd(${n(a)}, ${n(m)}) = ${n(d)}, which divides ${n(b)}, so there are ${n(d)} solutions from 0 to ${n(m - 1)}. Divide a, b and n by ${n(d)}: ${n(a1)}x ≡ ${n(b1)} (mod ${n(n1)}).`;
 const mul = `Multiply both sides by ${n(inv)}: x ≡ ${n(inv)} × ${n(b1)} = ${n(ib)}${ib === x0 ? '' : ` ≡ ${n(x0)}`} (mod ${n(n1)}).`;
 const main = `${head} The inverse of ${n(a1)} mod ${n(n1)} is ${n(inv)}, since ${n(a1)} × ${n(inv)} = ${n(a1 * inv)} ≡ 1 (mod ${n(n1)}). ${mul}`;
 return { d, n1, a1, b1, inv, ib, x0, sols, last: sols[d - 1], head, mul, main };
};
/* Two congruences x ≡ r1 (mod m1), x ≡ r2 (mod m2) with coprime moduli: the numbers listed by the sieve and the smallest fit. */
const sieve2 = (m1, r1, m2, r2) => { const list = []; let v = r1; while (v % m2 !== r2) { list.push(v); v += m1; } list.push(v); return { list, x: v }; };
const listText = l => l.map(n).join(', ');
const PAIRS = [5, 7, 8, 9, 11, 13];

/* ---- q16 Linear congruences [R3.3] ---- */

mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The roof lamp ring',
 brief: 'The roof of the Timetable Office carries a ring of lamps, and the crew wants to know which button presses leave the spotlight on a chosen lamp.',
 labels: ['number of solutions', 'largest solution'], tolerance: 0.01,
 gl: [['number of solutions'], ['inverse'], ['smallest solution', 'largest solution']]
}, {
 /* ax ≡ b (mod n) with d = gcd(a, n) from 2 to 6, n = d·n1 with n1 from 5 to 12, a1 = a ÷ d from 2 to n1 − 1 coprime to n1 and
    b = d·b1 with b1 from 1 to n1 − 1, so there are always d ≥ 2 solutions. Neither the q16 worked example (6x ≡ 4 mod 10) nor its
    prompt (12x ≡ 8 mod 28) is drawn. */
 canonical: { n: 30, a: 21, b: 12 },
 draw: R => bounded(() => { const d = R.int(2, 6), n1 = R.int(5, 12), a1 = R.int(2, n1 - 1), b1 = R.int(1, n1 - 1); return { n: d * n1, a: d * a1, b: d * b1, ok: gcd(a1, n1) === 1 }; },
  p => p.ok && !(p.n === 10 && p.a === 6 && p.b === 4) && !(p.n === 28 && p.a === 12 && p.b === 8), { n: 30, a: 21, b: 12 }),
 build: ({ n: m, a, b }) => { const L = lin(a, b, m); return {
  prompt: `The lamp ring on the roof of the Timetable Office has ${n(m)} lamps, numbered 0 to ${n(m - 1)}. The spotlight starts on lamp 0, and each press of the button turns it ${n(a)} lamps clockwise, wrapping from the last lamp round to lamp 0. The crew wants the numbers of presses x, from 0 to ${n(m - 1)}, after which it shines on lamp ${n(b)}: the solutions of the linear congruence ${n(a)}x ≡ ${n(b)} (mod ${n(m)}). Enter how many solutions there are from 0 to ${n(m - 1)}, then the largest one.`,
  answer: [L.d, L.last],
  hints: ['Let d = gcd(a, n). When d divides b there are exactly d solutions from 0 to n − 1.', 'Divide a, b and n by d and solve the smaller congruence with a modular inverse. The solutions are n ÷ d apart, so the largest is the smallest plus d − 1 steps of n ÷ d.'],
  solution: `${L.main} The solutions from 0 to ${n(m - 1)} are ${listText(L.sols)}, each ${n(L.n1)} more than the last, so the largest is ${n(L.last)}. Check: ${n(a)} × ${n(L.last)} = ${n(a * L.last)}${a * L.last === b ? '' : ` ≡ ${n(b)} (mod ${n(m)})`}.`,
  guidance: [
   { prompt: `What is d = gcd(${n(a)}, ${n(m)})? It is also the number of solutions, since it divides ${n(b)}.`, answer: [L.d], explanation: `${euclidText(m, a)}. The last non-zero remainder is ${n(L.d)}.` },
   { prompt: `After dividing by ${n(L.d)} the congruence is ${n(L.a1)}x ≡ ${n(L.b1)} (mod ${n(L.n1)}). What is the inverse of ${n(L.a1)} mod ${n(L.n1)}?`, answer: [L.inv], explanation: `${n(L.a1)} × ${n(L.inv)} = ${n(L.a1 * L.inv)} ≡ 1 (mod ${n(L.n1)}).` },
   { prompt: `Multiply both sides by that inverse to get the smallest solution, then keep adding ${n(L.n1)} until the next one would pass ${n(m - 1)}. What are the smallest and the largest solution?`, answer: [L.x0, L.last], explanation: `x ≡ ${n(L.inv)} × ${n(L.b1)} = ${n(L.ib)}${L.ib === L.x0 ? '' : ` ≡ ${n(L.x0)}`} (mod ${n(L.n1)}). Adding ${n(L.n1)} gives ${listText(L.sols)}.` }
  ] }; }
});

mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'The cargo shuttle ring road',
 brief: 'The cargo shuttle drives round a ring road and the loader waits at one dock, so the crew needs the trips after which the two meet.',
 labels: ['smallest number of trips', 'number of trip numbers that work'], tolerance: 0.01,
 gl: [['b'], ['number of solutions'], ['smallest number of trips']]
}, {
 /* The shuttle starts at dock s, so ax ≡ t − s (mod n). d = gcd(a, n) from 2 to 5, n = d·n1 with n1 from 5 to 12, b = d·b1 with b1 from
    1 to n1 − 1 and t = (s + b) mod n, so t is never s, and the right-hand side b may need n added when t < s. */
 canonical: { n: 24, a: 20, s: 15, b: 12 },
 draw: R => bounded(() => { const d = R.int(2, 5), n1 = R.int(5, 12), a1 = R.int(2, n1 - 1), b1 = R.int(1, n1 - 1); return { n: d * n1, a: d * a1, s: R.int(0, d * n1 - 1), b: d * b1, ok: gcd(a1, n1) === 1 }; },
  p => p.ok, { n: 24, a: 20, s: 15, b: 12 }),
 build: ({ n: m, a, s, b }) => { const t = (s + b) % m, L = lin(a, b, m), diff = t - s; return {
  prompt: `The cargo shuttle serves a ring road of ${n(m)} docks, numbered 0 to ${n(m - 1)}. It waits at dock ${n(s)}, and on every trip it drives ${n(a)} docks forward, wrapping from dock ${n(m - 1)} round to dock 0. The loader waits at dock ${n(t)}. Let x be the number of trips, from 0 to ${n(m - 1)}, after which the shuttle stands at dock ${n(t)}. Enter the smallest such x, then how many different trip numbers from 0 to ${n(m - 1)} work.`,
  answer: [L.x0, L.d],
  hints: ['After x trips the shuttle has moved ax docks, so it stands at dock (start + ax) mod n. Write the condition as ax ≡ (target − start) (mod n), adding n to the right-hand side if it is negative.', 'Let d = gcd(a, n). When d divides the right-hand side there are exactly d solutions from 0 to n − 1. Divide through by d, multiply by a modular inverse, and reduce to find the smallest.'],
  solution: `After x trips the shuttle is at dock (${n(s)} + ${n(a)}x) mod ${n(m)}, so ${n(a)}x ≡ ${n(t)} − ${n(s)} (mod ${n(m)}). ${diff < 0 ? `${n(t)} − ${n(s)} = ${n(diff)}, and ${n(diff)} + ${n(m)} = ${n(b)}` : `${n(t)} − ${n(s)} = ${n(b)}`}, so ${n(a)}x ≡ ${n(b)} (mod ${n(m)}). ${L.main} The solutions from 0 to ${n(m - 1)} are ${listText(L.sols)}, so the smallest is ${n(L.x0)} and ${n(L.d)} trip numbers work. Check: ${n(s)} + ${n(a)} × ${n(L.x0)} = ${n(s + a * L.x0)}${s + a * L.x0 === t ? '' : ` ≡ ${n(t)} (mod ${n(m)})`}.`,
  guidance: [
   { prompt: `The condition is ${n(a)}x ≡ ${n(t)} − ${n(s)} (mod ${n(m)}). What is the right-hand side b, as a number from 0 to ${n(m - 1)}?`, answer: [b], explanation: `${diff < 0 ? `${n(t)} − ${n(s)} = ${n(diff)}, which is negative, so add ${n(m)}: ${n(b)}.` : `${n(t)} − ${n(s)} = ${n(b)}.`}` },
   { prompt: `What is d = gcd(${n(a)}, ${n(m)})? It is also the number of solutions, since it divides ${n(b)}.`, answer: [L.d], explanation: `${euclidText(m, a)}. The last non-zero remainder is ${n(L.d)}.` },
   { prompt: `Divide a, b and n by ${n(L.d)}, multiply by the inverse of ${n(L.a1)} mod ${n(L.n1)}, and reduce. What is the smallest solution x?`, answer: [L.x0], explanation: `${n(L.a1)}x ≡ ${n(L.b1)} (mod ${n(L.n1)}); the inverse of ${n(L.a1)} is ${n(L.inv)}, so x ≡ ${n(L.inv)} × ${n(L.b1)} = ${n(L.ib)}${L.ib === L.x0 ? '' : ` ≡ ${n(L.x0)}`} (mod ${n(L.n1)}).` }
  ] }; }
});

mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q07', title: 'The antenna notch ring',
 brief: 'The big antenna dish turns on a ring with hundreds of notches, and its pulse counts have to be found with Euclid’s algorithm rather than by trial.',
 labels: ['number of solutions', 'smallest solution', 'largest solution'], tolerance: 0.01,
 gl: [['number of solutions'], ['inverse'], ['smallest solution'], ['largest solution']]
}, {
 /* Bigger numbers: d = gcd(a, n) from 2 to 8, n = d·n1 with n1 from 20 to 37 (n at most 296), a1 coprime to n1 from 2 to n1 − 1 and b1 from 1 to n1 − 1.
    The inverse needs a full run of Euclid's algorithm with back-substitution (q07). */
 canonical: { n: 148, a: 88, b: 76 },
 draw: R => bounded(() => { const d = R.int(2, 8), n1 = R.int(20, 37), a1 = R.int(2, n1 - 1), b1 = R.int(1, n1 - 1); return { n: d * n1, a: d * a1, b: d * b1, ok: gcd(a1, n1) === 1 }; }, p => p.ok, { n: 148, a: 88, b: 76 }),
 build: ({ n: m, a, b }) => { const L = lin(a, b, m), [, x0e, y0e] = egcd(L.a1, L.n1); return {
  prompt: `A telescope mount turns on a ring of ${n(m)} notches, numbered 0 to ${n(m - 1)}. Starting on notch 0, every motor pulse moves it ${n(a)} notches forward, and after notch ${n(m - 1)} it wraps to notch 0. The astronomers want every pulse count x from 0 to ${n(m - 1)} that leaves the mount on notch ${n(b)}, the solutions of ${n(a)}x ≡ ${n(b)} (mod ${n(m)}). Enter how many there are, then the smallest and the largest.`,
  answer: [L.d, L.x0, L.last],
  hints: ['Let d = gcd(a, n); if d divides b there are exactly d solutions from 0 to n − 1. Divide a, b and n by d.', 'Find the inverse of the reduced a with Euclid’s algorithm and back-substitution as for Bézout coefficients, then reduce it to the range 1 to n ÷ d − 1.', 'The other solutions are n ÷ d apart, so the largest is the smallest plus d − 1 steps of n ÷ d.'],
  solution: `${L.head} Euclid’s algorithm on ${n(L.n1)} and ${n(L.a1)}: ${euclidText(L.n1, L.a1)}. Back-substitution gives ${n(L.a1)} × ${par(x0e)} + ${n(L.n1)} × ${par(y0e)} = 1, so the inverse of ${n(L.a1)} mod ${n(L.n1)} is ${n(L.inv)}. ${L.mul} The solutions from 0 to ${n(m - 1)} are ${listText(L.sols)}, so the smallest is ${n(L.x0)} and the largest is ${n(L.last)}. Check: ${n(a)} × ${n(L.x0)} = ${n(a * L.x0)}${a * L.x0 === b ? '' : ` ≡ ${n(b)} (mod ${n(m)})`}.`,
  guidance: [
   { prompt: `What is d = gcd(${n(a)}, ${n(m)})? It is also the number of solutions, since it divides ${n(b)}.`, answer: [L.d], explanation: `${euclidText(m, a)}. The last non-zero remainder is ${n(L.d)}.` },
   { prompt: `After dividing by ${n(L.d)} the congruence is ${n(L.a1)}x ≡ ${n(L.b1)} (mod ${n(L.n1)}). Use Euclid’s algorithm on ${n(L.n1)} and ${n(L.a1)} and back-substitute. What is the inverse of ${n(L.a1)} mod ${n(L.n1)}, from 1 to ${n(L.n1 - 1)}?`, answer: [L.inv], explanation: `${euclidText(L.n1, L.a1)}. Back-substitution gives ${n(L.a1)} × ${par(x0e)} + ${n(L.n1)} × ${par(y0e)} = 1, so the inverse is ${n(L.inv)}.` },
   { prompt: `Multiply both sides by the inverse and reduce mod ${n(L.n1)}. What is the smallest solution?`, answer: [L.x0], explanation: `x ≡ ${n(L.inv)} × ${n(L.b1)} = ${n(L.ib)}${L.ib === L.x0 ? '' : ` ≡ ${n(L.x0)}`} (mod ${n(L.n1)}).` },
   { prompt: `Add ${n(L.n1)} again and again to list the solutions up to ${n(m - 1)}. What is the largest?`, answer: [L.last], explanation: `${listText(L.sols)}: ${n(L.d)} solutions, the last one ${n(L.last)}.` }
  ] }; }
});

/* ---- q17 Chapter review: calendar arithmetic [R3.1, R3.3] ---- */

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The pump station logbook',
 brief: 'A pump fault is in the station logbook from many days back, and the tanker crew wants to know which weekday it was and when the tanker next lines up.',
 labels: ['weekday of the fault', 'calls x'], tolerance: 0.01,
 gl: [['N mod 7'], ['weekday of the fault'], ['calls x']]
}, {
 /* Today is day s of a 7-day week and the fault was N days ago (4 digits), so its weekday is (s − N) mod 7. The tanker calls every k days with
    k mod 7 from 2 to 5 and N mod 7 at least 2 (no '1 calls' or '0 days') and must call on the weekday before today's, so kx ≡ 6 (mod 7). The worked example (N = 100) is never drawn. */
 canonical: { s: 2, N: 3517, k: 19 },
 draw: R => bounded(() => { let k; do k = R.int(8, 40); while (k % 7 < 2 || k % 7 > 5); return { s: R.int(0, 6), N: R.int(1000, 9999), k }; }, p => p.N % 7 >= 2, { s: 2, N: 3517, k: 19 }),
 build: ({ s, N, k }) => { const q = Math.floor(N / 7), r = N % 7, back = s - r, w = mod(back, 7), k7 = k % 7, iv = inverse(k7, 7), x = mod(6 * iv, 7), prev = mod(s - 1, 7); return {
  prompt: `The pump station logbook uses a week of 7 days numbered 0 to 6, and after day 6 comes day 0 again. Today is day ${n(s)}. A pump fault was logged ${n(N)} days ago: enter the number of the weekday it happened on. A tanker also calls today and then every ${n(k)} days. Enter the smallest number x of further calls, at least 1 (x = 0 would be today’s call), after which it calls on day ${n(prev)}, one day back in the week from today’s day ${n(s)}.`,
  answer: [w, x],
  hints: ['Only the days left over after whole weeks matter. Reduce the number of days mod 7, count back that many days from today, and add 7 if you go below 0.', 'In a 7-day week the weekday before today is the same as 6 days later, so you need kx ≡ 6 (mod 7). Reduce k mod 7, find its inverse, multiply by 6 and reduce.'],
  solution: `${n(N)} = ${n(q)} × 7 + ${n(r)}, so ${n(N)} ≡ ${n(r)} (mod 7). Going back ${n(r)} days from day ${n(s)} gives ${n(s)} − ${n(r)} = ${n(back)}${back < 0 ? `, and ${n(back)} + 7 = ${n(w)}` : ''}: day ${n(w)}. For the tanker, ${n(k)} ≡ ${n(k7)} (mod 7), and the weekday before today is 6 days later, so ${n(k7)}x ≡ 6 (mod 7). The inverse of ${n(k7)} is ${n(iv)}, since ${n(k7)} × ${n(iv)} = ${n(k7 * iv)} ≡ 1 (mod 7), so x ≡ 6 × ${n(iv)} = ${n(6 * iv)}${6 * iv === x ? '' : ` ≡ ${n(x)}`} (mod 7). Check: ${n(x)} calls take ${n(x * k)} days, and ${n(s)} + ${n(x * k)} leaves day ${n(prev)} after whole weeks.`,
  guidance: [
   { prompt: `What is ${n(N)} mod 7?`, answer: [r], explanation: `${n(N)} = ${n(q)} × 7 + ${n(r)}.` },
   { prompt: `Count back that many days from today’s day ${n(s)}, adding 7 if you go below 0. On which weekday did the fault happen?`, answer: [w], explanation: `${n(s)} − ${n(r)} = ${n(back)}${back < 0 ? `, which is below 0, so add 7: ${n(w)}` : ', already 0 or more'}.` },
   { prompt: `The tanker needs ${n(k)}x ≡ 6 (mod 7). Reduce ${n(k)} mod 7, multiply 6 by its inverse mod 7 and reduce. What is the smallest x from 1 to 6?`, answer: [x], explanation: `${n(k)} ≡ ${n(k7)}; the inverse of ${n(k7)} mod 7 is ${n(iv)}; x ≡ 6 × ${n(iv)} = ${n(6 * iv)}${6 * iv === x ? '' : ` ≡ ${n(x)}`} (mod 7).` }
  ] }; }
});

mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'The freight ship schedule',
 brief: 'A freight ship calls at the outpost on a fixed gap of days, and the dock crew needs the weekday of one call far down the schedule.',
 labels: ['days until the arrival', 'weekday of the arrival'], tolerance: 0.01,
 gl: [['total days'], ['days left over after whole weeks'], ['weekday of the arrival']]
}, {
 /* A ship reaches the outpost today and then every k days; the m-th arrival after today is m·k days ahead, so its weekday is (s + mk) mod 7.
    Neither m nor k is a multiple of 7, so the weekday always differs from today's. */
 canonical: { s: 3, k: 16, m: 125 },
 draw: R => bounded(() => ({ s: R.int(0, 6), k: R.int(8, 40), m: R.int(60, 400) }), p => p.k % 7 !== 0 && p.m % 7 !== 0, { s: 3, k: 16, m: 125 }),
 build: ({ s, k, m }) => { const T = k * m, q = Math.floor(T / 7), r = T % 7, S = s + r, w = S % 7; return {
  prompt: `A freight ship reaches the Kepler outpost today and then every ${n(k)} days. The calendar week has 7 days, numbered 0 to 6, and today is day ${n(s)}. Enter the total number of days from today until the ${ord(m)} arrival after today’s (type it without commas), then the number of the weekday it arrives on.`,
  answer: [T, w],
  hints: ['The ship arrives a whole number of gaps after today, so multiply the gap by the number of arrivals to get the days ahead.', 'Only the days left over after whole weeks matter: divide the days ahead by 7, keep the remainder, add it to today’s number and reduce mod 7.'],
  solution: `The ${ord(m)} arrival is ${n(m)} × ${n(k)} = ${n(T)} days ahead. ${n(T)} = ${n(q)} × 7 + ${n(r)}, so ${n(T)} ≡ ${n(r)} (mod 7), and the ship arrives on day ${n(s)} + ${n(r)} = ${n(S)}${S >= 7 ? ` ≡ ${n(w)} (mod 7)` : ''}: day ${n(w)}.`,
  guidance: [
   { prompt: `How many days from today is the ${ord(m)} arrival, at ${n(k)} days apart?`, answer: [T], explanation: `${n(m)} × ${n(k)} = ${n(T)} days.` },
   { prompt: `What is ${n(T)} mod 7, the days left over after whole weeks?`, answer: [r], explanation: `${n(T)} = ${n(q)} × 7 + ${n(r)}.` },
   { prompt: `Add that to today’s day ${n(s)} and reduce mod 7. On which weekday does the ship arrive?`, answer: [w], explanation: `${n(s)} + ${n(r)} = ${n(S)}${S >= 7 ? `, and ${n(S)} − 7 = ${n(w)}` : ', already below 7'}.` }
  ] }; }
});

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q15', title: 'Two calendars at once',
 brief: 'The outpost runs a seven-day week beside a longer rest cycle, and a convoy far in the future must be placed on both.',
 labels: ['weekday', 'rest-cycle day', 'visits x'], tolerance: 0.01,
 gl: [['weekday'], ['rest-cycle day'], ['visits x']]
}, {
 /* Today is day s of the week and day c of a rest cycle of m days (m prime from 11 to 19). A convoy returns in N days (6 or 7 digits); a drone
    visits today and every k days, k from 20 to 300 with k mod m at least 2, and x is the inverse of k mod m, so the drone lands on cycle day
    (c + 1) mod m. The q17 worked example (N = 100, mod 7 only) is never drawn. */
 canonical: { s: 5, m: 13, c: 9, N: 4837264, k: 47 },
 draw: R => bounded(() => ({ s: R.int(0, 6), m: R.pick([11, 13, 17, 19]), c: R.int(0, 18), N: R.int(100000, 9999999), k: R.int(20, 300) }), p => p.c < p.m && p.k % p.m >= 2, { s: 5, m: 13, c: 9, N: 4837264, k: 47 }),
 build: ({ s, m, c, N, k }) => { const r7 = N % 7, q7 = Math.floor(N / 7), S = s + r7, w = S % 7, rm = N % m, qm = Math.floor(N / m), C = c + rm, cd = C % m, km = k % m, x = inverse(km, m), next = (c + 1) % m; return {
  prompt: `The Kepler outpost keeps a week of 7 days, numbered 0 to 6, and a separate rest cycle of ${n(m)} days, numbered 0 to ${n(m - 1)}. Each calendar starts again at 0 after its last day. Today is day ${n(s)} of the week and day ${n(c)} of the rest cycle. A survey convoy returns in ${n(N)} days: enter the weekday and the rest-cycle day it returns on. A relief drone also visits today and then every ${n(k)} days. Enter the smallest number x of further visits, at least 1 (x = 0 would be today’s visit), after which it visits on rest-cycle day ${n(next)}, one day on in the rest cycle from today’s day ${n(c)}: this x is the inverse of ${n(k)} mod ${n(m)}, from 1 to ${n(m - 1)}.`,
  answer: [w, cd, x],
  hints: ['Only the days left over after whole cycles matter. Reduce the days ahead mod 7 for the week and mod the cycle length for the rest cycle, add each to today’s number and reduce again.', 'x visits later is x × k days later, so you need kx ≡ 1 (mod the cycle length). Reduce k first, then find its modular inverse with Euclid’s algorithm and Bézout coefficients.'],
  solution: `Week: ${n(N)} = ${n(q7)} × 7 + ${n(r7)}, so ${n(N)} ≡ ${n(r7)} (mod 7), and the convoy returns on day ${n(s)} + ${n(r7)} = ${n(S)}${S >= 7 ? ` ≡ ${n(w)} (mod 7)` : ''}: day ${n(w)} of the week. Rest cycle: ${n(N)} = ${n(qm)} × ${n(m)} + ${n(rm)}, so ${n(N)} ≡ ${n(rm)} (mod ${n(m)}), and the convoy returns on day ${n(c)} + ${n(rm)} = ${n(C)}${C >= m ? ` ≡ ${n(cd)} (mod ${n(m)})` : ''}: day ${n(cd)} of the cycle. Drone: ${n(k)} ≡ ${n(km)} (mod ${n(m)}), and ${n(km)} × ${n(x)} = ${n(km * x)} = ${n(Math.floor(km * x / m))} × ${n(m)} + 1, so the inverse is ${n(x)}.`,
  guidance: [
   { prompt: `What is ${n(N)} mod 7? Add it to today’s weekday ${n(s)} and reduce mod 7. On which weekday does the convoy return?`, answer: [w], explanation: `${n(N)} = ${n(q7)} × 7 + ${n(r7)}, and ${n(s)} + ${n(r7)} = ${n(S)}${S >= 7 ? `, which leaves ${n(w)} after taking away 7` : ', already below 7'}.` },
   { prompt: `What is ${n(N)} mod ${n(m)}? Add it to today’s rest-cycle day ${n(c)} and reduce mod ${n(m)}. On which rest-cycle day does the convoy return?`, answer: [cd], explanation: `${n(N)} = ${n(qm)} × ${n(m)} + ${n(rm)}, and ${n(c)} + ${n(rm)} = ${n(C)}${C >= m ? `, which leaves ${n(cd)} after taking away ${n(m)}` : `, already below ${n(m)}`}.` },
   { prompt: `Reduce ${n(k)} mod ${n(m)}, then find the inverse of the result mod ${n(m)}. What is x?`, answer: [x], explanation: `${n(k)} ≡ ${n(km)} (mod ${n(m)}), and ${n(km)} × ${n(x)} = ${n(km * x)} ≡ 1 (mod ${n(m)}).` }
  ] }; }
});

/* ---- q18 Chinese remainder theorem [R3.4] ---- */

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The seed tray stacks',
 brief: 'The greenhouse has lost its tray count, but two stacking crews each remember what was left over.',
 labels: ['smallest count x', 'next count'], tolerance: 0.01,
 gl: [['smallest count x'], ['gap between counts', 'next count']]
}, {
 /* Two coprime moduli m1 < m2 and remainders from 1 to m − 1, so x is never a multiple of either modulus. The q18 worked example has three
    moduli (3, 4, 5), so it is never drawn. */
 canonical: { m1: 8, m2: 11, r1: 5, r2: 3 },
 draw: R => bounded(() => { const m1 = R.pick([5, 7, 8, 9, 11, 12]), m2 = R.pick([7, 8, 9, 11, 13, 14, 15]); return { m1, m2, r1: R.int(1, m1 - 1), r2: R.int(1, m2 - 1) }; }, p => p.m1 < p.m2 && gcd(p.m1, p.m2) === 1, { m1: 8, m2: 11, r1: 5, r2: 3 }),
 build: ({ m1, m2, r1, r2 }) => { const { list, x } = sieve2(m1, r1, m2, r2), M = m1 * m2; return {
  prompt: `The greenhouse stored x seed trays and nobody wrote x down. Two crews remember what was left over when they stacked them: stacked in piles of ${n(m1)} the trays leave ${n(r1)} over, and stacked in piles of ${n(m2)} they leave ${n(r2)} over. ${n(m1)} and ${n(m2)} share no factor bigger than 1, and x is a whole number of at least 1. Enter the smallest x that fits both reports, then the next larger x that fits both.`,
  answer: [x, x + M],
  hints: ['Sieve: start at the first remainder and add the first pile size again and again until a number also fits the second report.', 'By the Chinese remainder theorem, when the two moduli share no factor bigger than 1, the numbers that fit both reports repeat every m1 × m2. Add that gap to the smallest to get the next.'],
  solution: `Numbers that leave ${n(r1)} in piles of ${n(m1)}: ${listText(list)}. The first of them that leaves ${n(r2)} in piles of ${n(m2)} is ${n(x)} = ${n(Math.floor(x / m2))} × ${n(m2)} + ${n(r2)}. The numbers that fit both reports repeat every ${n(m1)} × ${n(m2)} = ${n(M)}, so the next is ${n(x)} + ${n(M)} = ${n(x + M)}.`,
  guidance: [
   { prompt: `List ${n(r1)}, ${n(r1 + m1)}, ${n(r1 + 2 * m1)}, … (adding ${n(m1)} each time). Which is the first that leaves ${n(r2)} in piles of ${n(m2)}?`, answer: [x], explanation: `${listText(list)}: the last of these, ${n(x)}, is ${n(Math.floor(x / m2))} × ${n(m2)} + ${n(r2)}.` },
   { prompt: `Every number that fits both reports is ${n(x)} plus a multiple of one step. What is that step, and what is the next number that fits?`, answer: [M, x + M], explanation: `${n(m1)} and ${n(m2)} share no factor bigger than 1, so the step is ${n(m1)} × ${n(m2)} = ${n(M)}, and the next is ${n(x)} + ${n(M)} = ${n(x + M)}.` }
  ] }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'The battery store count',
 brief: 'Two crews boxed the batteries in the Signal Office store and each remembers its leftovers, and the stock sheet must have one exact total.',
 labels: ['product of the box sizes', 'batteries in the store'], tolerance: 0.01,
 gl: [['smallest x that fits both'], ['product of the box sizes'], ['batteries in the store']]
}, {
 /* Two coprime moduli m1 < m2 with product M from 40 to 150; remainders from 1 to m − 1; the store holds more than L and at most L + M batteries, with L from M to 2M,
    so exactly one number in that window fits both reports and it is x0 plus at least one step of M. */
 canonical: { m1: 7, m2: 9, r1: 3, r2: 5, L: 80 },
 draw: R => bounded(() => { const m1 = R.pick([5, 6, 7, 8, 9]), m2 = R.pick([7, 8, 9, 10, 11, 13]), M = m1 * m2; return { m1, m2, r1: R.int(1, m1 - 1), r2: R.int(1, m2 - 1), L: R.int(M, 2 * M), M }; },
  p => p.m1 < p.m2 && gcd(p.m1, p.m2) === 1 && p.M >= 40 && p.M <= 150, { m1: 7, m2: 9, r1: 3, r2: 5, L: 80 }),
 build: ({ m1, m2, r1, r2, L }) => { const { list, x: x0 } = sieve2(m1, r1, m2, r2), M = m1 * m2, t = Math.ceil((L + 1 - x0) / M), cnt = x0 + t * M, U = L + M; return {
  prompt: `Two crews counted the batteries in the Signal Office store. Crew A packed them into boxes of ${n(m1)} and had ${n(r1)} left over; crew B packed them into boxes of ${n(m2)} and had ${n(r2)} left over. ${n(m1)} and ${n(m2)} share no factor bigger than 1. The store holds more than ${n(L)} batteries and at most ${n(U)}. Enter the product ${n(m1)} × ${n(m2)}, then the number of batteries in the store.`,
  answer: [M, cnt],
  hints: ['Sieve: start at the first remainder and add the first box size again and again until a number also fits the second report. That is the smallest number that fits both.', 'By the Chinese remainder theorem the numbers that fit both reports repeat every m1 × m2. Add that gap to the smallest again and again until you land in the range the store is known to be in.'],
  solution: `Numbers that leave ${n(r1)} in boxes of ${n(m1)}: ${listText(list)}. The first of them that leaves ${n(r2)} in boxes of ${n(m2)} is ${n(x0)}. The numbers that fit both reports repeat every ${n(m1)} × ${n(m2)} = ${n(M)}: ${n(x0)}, ${n(x0 + M)}${x0 + 2 * M <= cnt ? `, ${n(x0 + 2 * M)}` : ''}${x0 + 3 * M <= cnt ? ', …' : ''}. The only one above ${n(L)} and at most ${n(U)} is ${n(cnt)}, so the store holds ${n(cnt)} batteries.`,
  guidance: [
   { prompt: `List ${n(r1)}, ${n(r1 + m1)}, ${n(r1 + 2 * m1)}, … (adding ${n(m1)} each time). Which is the first that leaves ${n(r2)} in boxes of ${n(m2)}?`, answer: [x0], explanation: `${listText(list)}: the last of these, ${n(x0)}, is ${n(Math.floor(x0 / m2))} × ${n(m2)} + ${n(r2)}.` },
   { prompt: `Every number that fits both reports is ${n(x0)} plus a multiple of one step. What is that step?`, answer: [M], explanation: `${n(m1)} and ${n(m2)} share no factor bigger than 1, so the step is ${n(m1)} × ${n(m2)} = ${n(M)}.` },
   { prompt: `Add ${n(M)} again and again, starting from ${n(x0)}. Which number lies above ${n(L)} and at most ${n(U)}?`, answer: [cnt], explanation: `${n(x0)} + ${n(t)} × ${n(M)} = ${n(cnt)}, which is above ${n(L)} and at most ${n(U)}; the number before it, ${n(cnt - M)}, is at most ${n(L)}.` }
  ] }; }
});

mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q16', title: 'The message copies report',
 brief: 'The mast measured several stored copies of a message together, so one report has to be solved as a linear congruence before the three reports can be combined.',
 labels: ['x mod the first block size', 'shortest length x'], tolerance: 0.01,
 gl: [['x mod the first block size'], ['smallest number fitting the last two reports'], ['shortest length x']]
}, {
 /* Three pairwise coprime moduli from PAIRS with product at most 1200. The first report concerns a copies of the message: a·x ≡ b (mod m1) with a from 2 to m1 − 1
    coprime to m1 and b from 1 to m1 − 1, so x ≡ r1 = a⁻¹b (mod m1) with r1 at least 1 (q16). The other two reports are plain remainders from 1 to m − 1. */
 canonical: { m1: 7, a: 3, b: 5, m2: 8, r2: 3, m3: 11, r3: 6 },
 draw: R => bounded(() => { const m1 = R.pick(PAIRS), m2 = R.pick(PAIRS), m3 = R.pick(PAIRS), a = R.int(2, Math.max(2, m1 - 1)); return { m1, a, b: R.int(1, m1 - 1), m2, r2: R.int(1, m2 - 1), m3, r3: R.int(1, m3 - 1) }; },
  p => p.m1 !== p.m2 && p.m1 !== p.m3 && p.m2 !== p.m3 && gcd(p.m1, p.m2) === 1 && gcd(p.m1, p.m3) === 1 && gcd(p.m2, p.m3) === 1 && gcd(p.a, p.m1) === 1 && p.m1 * p.m2 * p.m3 <= 1200 && p.a < p.m1, { m1: 7, a: 3, b: 5, m2: 8, r2: 3, m3: 11, r3: 6 }),
 build: ({ m1, a, b, m2, r2, m3, r3 }) => { const ia = inverse(a, m1), r1 = ia * b % m1, s12 = sieve2(m1, r1, m2, r2), x12 = s12.x, m12 = m1 * m2, s3 = sieve2(m12, x12, m3, r3), x = s3.x, M = m12 * m3; return {
  prompt: `The Signal Office stores a message whose length x, in characters, nobody wrote down, and the repeater mast reports three things. The first report is about ${n(a)} copies of the message laid end to end, a total length of ${n(a)}x characters: cut into blocks of ${n(m1)} they leave ${n(b)} over. One copy on its own leaves ${n(r2)} over in blocks of ${n(m2)} and ${n(r3)} over in blocks of ${n(m3)}. No two of ${n(m1)}, ${n(m2)} and ${n(m3)} share a factor bigger than 1. Enter what x leaves over in blocks of ${n(m1)}, then the shortest length x that fits all three reports (type it without commas).`,
  answer: [r1, x],
  hints: ['The first report says ax ≡ b (mod m). Multiply both sides by the inverse of a mod m to find what x leaves over by itself, and from then on it is an ordinary Chinese remainder problem.', 'Sieve: start at the first remainder and add its modulus again and again until a number also fits the second; then add the product of those two moduli until the third fits too. The shortest length is below the product of all three moduli.'],
  solution: `${n(a)}x ≡ ${n(b)} (mod ${n(m1)}). The inverse of ${n(a)} mod ${n(m1)} is ${n(ia)}, since ${n(a)} × ${n(ia)} = ${n(a * ia)} ≡ 1 (mod ${n(m1)}), so x ≡ ${n(ia)} × ${n(b)} = ${n(ia * b)}${ia * b === r1 ? '' : ` ≡ ${n(r1)}`} (mod ${n(m1)}). Now the three reports are x ≡ ${n(r1)} (mod ${n(m1)}), x ≡ ${n(r2)} (mod ${n(m2)}) and x ≡ ${n(r3)} (mod ${n(m3)}). Numbers leaving ${n(r1)} in blocks of ${n(m1)}: ${listText(s12.list)}; the first that leaves ${n(r2)} in blocks of ${n(m2)} is ${n(x12)}. The numbers that fit both repeat every ${n(m1)} × ${n(m2)} = ${n(m12)}${s3.list.length === 1 ? `, and ${n(x12)} already leaves ${n(r3)} in blocks of ${n(m3)}, so the first that does is ${n(x)}` : `: ${listText(s3.list)}. The first that leaves ${n(r3)} in blocks of ${n(m3)} is ${n(x)}`}. The lengths that fit repeat every ${n(M)}, so the shortest is ${n(x)}.`,
  guidance: [
   { prompt: `Multiply both sides of ${n(a)}x ≡ ${n(b)} (mod ${n(m1)}) by the inverse of ${n(a)} mod ${n(m1)}. What does x leave over in blocks of ${n(m1)}?`, answer: [r1], explanation: `The inverse of ${n(a)} mod ${n(m1)} is ${n(ia)}, so x ≡ ${n(ia)} × ${n(b)} = ${n(ia * b)}${ia * b === r1 ? '' : ` ≡ ${n(r1)}`} (mod ${n(m1)}).` },
   { prompt: `List ${n(r1)}, ${n(r1 + m1)}, ${n(r1 + 2 * m1)}, … (adding ${n(m1)} each time). Which is the first that leaves ${n(r2)} in blocks of ${n(m2)}?`, answer: [x12], explanation: `${s12.list.length === 1 ? `The first number on the list, ${n(x12)}, already does: it` : `${listText(s12.list)}: the last of these, ${n(x12)},`} is ${n(Math.floor(x12 / m2))} × ${n(m2)} + ${n(r2)}.` },
   { prompt: `Add ${n(m12)} again and again, starting from ${n(x12)}. Which is the first number that leaves ${n(r3)} in blocks of ${n(m3)}?`, answer: [x], explanation: `${s3.list.length === 1 ? `${n(x)} itself already does` : listText(s3.list)}: ${n(x)} = ${n(Math.floor(x / m3))} × ${n(m3)} + ${n(r3)}.` }
  ] }; }
});

/* ---- q19 Fast powers by repeated squaring [BC1.26] ---- */

mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The key wheel nights',
 brief: 'The cipher room’s key wheel is turned by the same multiplier every night, and Mira needs its setting after many nights.',
 labels: ['entries multiplied together', 'key after the nights'], tolerance: 0.01,
 gl: [['powers of 2 in the sum'], ['last entry of the list'], ['key after the nights']]
}, {
 /* a^k mod n with n from 11 to 99, a from 2 to n − 2, k from 20 to 500 and not a power of 2, so at least two entries are multiplied, with a result of at least 2.
    The parent's own numbers (12 to the 77 mod 41) and its worked example (5 to the 11 mod 13) are never drawn. */
 canonical: { a: 7, k: 45, n: 53 },
 draw: R => bounded(() => { const m = R.int(11, 99); return { a: R.int(2, m - 2), k: R.int(20, 500), n: m }; },
  p => !isPow2(p.k) && powmod(p.a, p.k, p.n) >= 2 && !(p.a === 12 && p.k === 77 && p.n === 41), { a: 7, k: 45, n: 53 }),
 build: ({ a, k, n: m }) => { const sq = squaring(a, k, m), sum = sq.parts.join(' + '), cnt = sq.used.length, top = 2 ** sq.j; return {
  prompt: `The key wheel in the cipher room starts at the code 1. Every night the wheel multiplies its code by ${n(a)} and keeps only the least residue mod ${n(m)}, so after k nights the code is ${n(a)}ᵏ mod ${n(m)}. Mira needs the code after k = ${n(k)} nights without turning the wheel night by night. Use repeated squaring to build the list ${n(a)}, ${n(a)}², ${n(a)}⁴, ${n(a)}⁸, … (each entry the square of the last, reduced mod ${n(m)}). Enter how many entries of that list have to be multiplied together to make ${n(a)}${sup(k)}, then the code after ${n(k)} nights.`,
  answer: [cnt, sq.result],
  hints: ['Write the exponent as a sum of different powers of 2: 1, 2, 4, 8, 16, … Each power in that sum is one entry of the list that has to be multiplied in.', 'Build the list by squaring the last entry and reducing, then multiply together the entries whose exponents add up to the exponent you need, reducing mod n after every multiplication.'],
  solution: `${n(k)} = ${sum}, so ${n(cnt)} entries are needed. The list: ${sq.listText}. Then ${sq.productText}. So the code after ${n(k)} nights is ${n(sq.result)}.`,
  guidance: [
   { prompt: `Write ${n(k)} as a sum of different powers of 2. How many powers are in the sum?`, answer: [cnt], explanation: `${n(k)} = ${sum}, which is ${n(cnt)} powers.` },
   { prompt: `Square and reduce mod ${n(m)} again and again. What is the last entry of the list, ${n(a)}${sup(top)} mod ${n(m)}?`, answer: [sq.sq[sq.j]], explanation: `${sq.listText}.` },
   { prompt: `Multiply the entries for ${sum}, reducing as you go. What is ${n(a)}${sup(k)} mod ${n(m)}?`, answer: [sq.result], explanation: `${sq.productText}.` }
  ] }; }
});

mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'Two relays, one signal',
 brief: 'Two relays each scramble their own code by a huge power, and the mast adds their outputs into one signal.',
 labels: ['relay A output', 'combined signal'], tolerance: 0.01,
 gl: [['relay A output'], ['relay B output'], ['combined signal']]
}, {
 /* n from 11 to 60, k from 20 to 200 and not a power of 2, two different codes a and b from 2 to n − 2 (outputs of at least 2) and their sum reduced mod n. */
 canonical: { a: 6, b: 11, k: 53, n: 29 },
 draw: R => bounded(() => { const m = R.int(11, 60); return { a: R.int(2, m - 2), b: R.int(2, m - 2), k: R.int(20, 200), n: m }; },
  p => p.a !== p.b && !isPow2(p.k) && powmod(p.a, p.k, p.n) >= 2 && powmod(p.b, p.k, p.n) >= 2, { a: 6, b: 11, k: 53, n: 29 }),
 build: ({ a, b, k, n: m }) => { const sa = squaring(a, k, m), sb = squaring(b, k, m), A = sa.result, B = sb.result, S = A + B, C = S % m; return {
  prompt: `The Signal Office sends a message through two relays that both work mod ${n(m)}. Relay A turns its code ${n(a)} into ${n(a)}${sup(k)} mod ${n(m)}, and relay B turns its code ${n(b)} into ${n(b)}${sup(k)} mod ${n(m)}. At the mast the two outputs are added and the sum is reduced mod ${n(m)}. Use repeated squaring for each relay. Enter relay A’s output, then the combined signal.`,
  answer: [A, C],
  hints: ['Write the exponent as a sum of different powers of 2, build the list of squares of the code reduced mod n, and multiply together the entries whose exponents add up to the exponent, reducing after every multiplication.', 'The two relays share the exponent but have different codes, so each needs its own list. Add the two outputs at the end and reduce once more.'],
  solution: `Relay A: ${sa.listText ? `${sa.listText}. ` : ''}${sa.productText}, so A = ${n(A)}. Relay B: ${sb.listText ? `${sb.listText}. ` : ''}${sb.productText}, so B = ${n(B)}. The mast adds ${n(A)} + ${n(B)} = ${n(S)}${S >= m ? `, and ${n(S)} − ${n(m)} = ${n(C)}` : ', already below ' + n(m)}. The combined signal is ${n(C)}.`,
  guidance: [
   { prompt: `Use repeated squaring. What is ${n(a)}${sup(k)} mod ${n(m)}, relay A’s output?`, answer: [A], explanation: `${sa.listText ? `${sa.listText}; ` : ''}${sa.productText}.` },
   { prompt: `Use repeated squaring again. What is ${n(b)}${sup(k)} mod ${n(m)}, relay B’s output?`, answer: [B], explanation: `${sb.listText ? `${sb.listText}; ` : ''}${sb.productText}.` },
   { prompt: `Add the two outputs ${n(A)} and ${n(B)} and reduce mod ${n(m)}. What is the combined signal?`, answer: [C], explanation: `${n(A)} + ${n(B)} = ${n(S)}${S >= m ? `, and ${n(S)} − ${n(m)} = ${n(C)}` : ', already below ' + n(m)}.` }
  ] }; }
});

mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q13', title: 'The session stamp',
 brief: 'The deep-space link uses a three-digit modulus and a long exponent, and each session’s key has to be stamped with its serial number.',
 labels: ['squarings', 'session key', 'stamp'], tolerance: 0.01,
 gl: [['squarings'], ['session key'], ['stamp']]
}, {
 /* Harder numbers: n from 101 to 499, a from 2 to n − 2, k from 500 to 9999 and not a power of 2, a serial s from 1000 to 9999 with s mod n at least 2 (q13: reduce first),
    key and stamp of at least 2. */
 canonical: { a: 23, k: 1234, n: 301, s: 5921 },
 draw: R => bounded(() => { const m = R.int(101, 499); return { a: R.int(2, m - 2), k: R.int(500, 9999), n: m, s: R.int(1000, 9999) }; },
  p => !isPow2(p.k) && powmod(p.a, p.k, p.n) >= 2 && p.s % p.n >= 2 && (powmod(p.a, p.k, p.n) * (p.s % p.n)) % p.n >= 2, { a: 23, k: 1234, n: 301, s: 5921 }),
 build: ({ a, k, n: m, s }) => { const sq = squaring(a, k, m), K = sq.result, sr = s % m, sq1 = Math.floor(s / m), prod = K * sr, stamp = prod % m, top = 2 ** sq.j; return {
  prompt: `The deep-space link of the Signal Office only carries numbers below ${n(m)}. The session key is ${n(a)}${sup(k)} mod ${n(m)}. The stamp sent with it is the key multiplied by the session’s serial number ${n(s)}, reduced mod ${n(m)}. Use repeated squaring on the list ${n(a)}, ${n(a)}², ${n(a)}⁴, … (each entry the square of the last, reduced mod ${n(m)}) up to the last entry whose exponent is not more than ${n(k)}. Enter how many squarings that takes, then the session key, then the stamp.`,
  answer: [sq.j, K, stamp],
  hints: ['Write the exponent as a sum of different powers of 2. The largest power in the sum is as far as the list needs to go, and each new entry is the last one squared and reduced.', 'Multiply together the entries whose exponents add up to the exponent. For the stamp, reduce the serial number mod n first, then multiply by the key and reduce again.'],
  solution: `${n(k)} = ${sq.parts.join(' + ')}, and the largest power of 2 here is ${n(top)}. The list: ${sq.listText}. Reaching ${n(a)}${sup(top)} takes ${n(sq.j)} squarings. Then ${sq.productText}, so the key is ${n(K)}. The serial: ${n(s)} = ${n(sq1)} × ${n(m)} + ${n(sr)}, so ${n(s)} ≡ ${n(sr)} (mod ${n(m)}). The stamp is ${n(K)} × ${n(sr)} = ${n(prod)}${prod === stamp ? `, already below ${n(m)}` : ` ≡ ${n(stamp)} (mod ${n(m)})`}.`,
  guidance: [
   { prompt: `Write ${n(k)} as a sum of different powers of 2. The largest of them is 2 to the power j: how many squarings j does the list need?`, answer: [sq.j], explanation: `${n(k)} = ${sq.parts.join(' + ')}. The largest power is ${n(top)}, and 1, 2, 4, … reach ${n(top)} after ${n(sq.j)} doublings, so ${n(sq.j)} squarings.` },
   { prompt: `Square and reduce mod ${n(m)}, then multiply the entries for the sum. What is ${n(a)}${sup(k)} mod ${n(m)}, the session key?`, answer: [K], explanation: `${sq.listText}. Then ${sq.productText}.` },
   { prompt: `Reduce ${n(s)} mod ${n(m)}, multiply by the key ${n(K)} and reduce again. What is the stamp?`, answer: [stamp], explanation: `${n(s)} ≡ ${n(sr)} (mod ${n(m)}), and ${n(K)} × ${n(sr)} = ${n(prod)} = ${n(Math.floor(prod / m))} × ${n(m)} + ${n(stamp)}.` }
  ] }; }
});

/* ---- q20 Fermat's little theorem [R3.5] ---- */

mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'The rotor tick count',
 brief: 'A rotor in the cipher room multiplies its code on every tick and has been running for hundreds of thousands of ticks.',
 labels: ['reduced tick count', 'code after the ticks'], tolerance: 0.01,
 gl: [['power p − 1'], ['reduced tick count'], ['code after the ticks']]
}, {
 /* a^k mod p for a prime p from 11 to 97, a from 2 to p − 2 and k from 1000 to 999999 with k mod (p − 1) at least 2. Neither the parent's numbers (5 to the 481213 mod 23)
    nor its worked example (p = 7) is drawn. */
 canonical: { p: 31, a: 3, k: 674855 },
 draw: R => bounded(() => { const p = R.pick(PRIMES); return { p, a: R.int(2, p - 2), k: R.int(1000, 999999) }; }, q => q.k % (q.p - 1) >= 2 && !(q.p === 23 && q.a === 5 && q.k === 481213), { p: 31, a: 3, k: 674855 }),
 build: ({ p, a, k }) => { const e = p - 1, q = Math.floor(k / e), r = k % e, sq = squaring(a, r, p), res = sq.result; return {
  prompt: `A rotor in the cipher room keeps a code that starts at 1. On every tick it multiplies the code by ${n(a)} and keeps only the least residue mod ${n(p)}, where ${n(p)} is prime and shares no factor bigger than 1 with ${n(a)}, so after k ticks the code is ${n(a)}ᵏ mod ${n(p)}. The rotor has run for k = ${n(k)} ticks. Enter the remainder when ${n(k)} is divided by ${n(p)} − 1, the only part of the tick count that matters by Fermat’s little theorem. Then enter the code after ${n(k)} ticks.`,
  answer: [r, res],
  hints: ['Fermat’s little theorem: when p is prime and does not divide a, a to the power p − 1 is ≡ 1 (mod p). Each whole block of p − 1 ticks multiplies the code by 1, so it can be dropped.', 'Write the tick count as q × (p − 1) + r, keep only r ticks, and find a to the power r mod p by repeated squaring.'],
  solution: `${n(p)} is prime and does not divide ${n(a)}, so ${n(a)}${sup(e)} ≡ 1 (mod ${n(p)}). ${n(k)} = ${n(q)} × ${n(e)} + ${n(r)}, so ${n(a)}${sup(k)} = (${n(a)}${sup(e)})${sup(q)} × ${n(a)}${sup(r)} ≡ 1 × ${n(a)}${sup(r)} (mod ${n(p)}). By repeated squaring: ${sq.listText ? `${sq.listText}; ` : ''}${sq.productText}. So the code after ${n(k)} ticks is ${n(res)}.`,
  guidance: [
   { prompt: `By Fermat’s little theorem, ${n(a)} to which power is ≡ 1 (mod ${n(p)})?`, answer: [e], explanation: `${n(p)} is prime and does not divide ${n(a)}, so ${n(a)}${sup(e)} ≡ 1 (mod ${n(p)}).` },
   { prompt: `Divide ${n(k)} by ${n(e)}. What is the remainder r?`, answer: [r], explanation: `${n(k)} = ${n(q)} × ${n(e)} + ${n(r)}, so only ${n(r)} ticks are left.` },
   { prompt: `Find ${n(a)}${sup(r)} mod ${n(p)} by repeated squaring. What is the code?`, answer: [res], explanation: `${sq.listText ? `${sq.listText}; ` : ''}${sq.productText}.` }
  ] }; }
});

mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Two rotors in series',
 brief: 'Two long-running rotors feed one prime channel, and the mast multiplies what they send.',
 labels: ['rotor A output', 'combined signal'], tolerance: 0.01,
 gl: [['rotor A output'], ['rotor B output'], ['combined signal']]
}, {
 /* A prime p from 11 to 53, codes a ≠ b from 2 to p − 2, tick counts k and m from 1000 to 99999 with k mod (p − 1) and m mod (p − 1) at least 2, and outputs of at least 2. */
 canonical: { p: 17, a: 3, b: 5, k: 38519, m: 71204 },
 draw: R => bounded(() => { const p = R.pick(PRIMES.filter(v => v <= 53)); return { p, a: R.int(2, p - 2), b: R.int(2, p - 2), k: R.int(1000, 99999), m: R.int(1000, 99999) }; },
  q => q.a !== q.b && q.k % (q.p - 1) >= 2 && q.m % (q.p - 1) >= 2 && powmod(q.a, q.k, q.p) >= 2 && powmod(q.b, q.m, q.p) >= 2, { p: 17, a: 3, b: 5, k: 38519, m: 71204 }),
 build: ({ p, a, b, k, m }) => { const e = p - 1, rk = k % e, rm = m % e, qk = Math.floor(k / e), qm = Math.floor(m / e), sa = squaring(a, rk, p), sb = squaring(b, rm, p), A = sa.result, B = sb.result, P = A * B, C = P % p; return {
  prompt: `Two rotors feed the long-range channel of the Signal Office, which works mod ${n(p)}, a prime that shares no factor bigger than 1 with either code. Rotor A has turned its code ${n(a)} into ${n(a)}${sup(k)} mod ${n(p)}, and rotor B has turned its code ${n(b)} into ${n(b)}${sup(m)} mod ${n(p)}. At the mast the two outputs are multiplied and the product is reduced mod ${n(p)}. Enter rotor A’s output, then the combined signal.`,
  answer: [A, C],
  hints: ['Fermat’s little theorem: when p is prime and does not divide a, a to the power p − 1 is ≡ 1 (mod p), so each exponent can be reduced to its remainder after dividing by p − 1. Do this for each rotor on its own.', 'Find each small power by repeated squaring, then multiply the two outputs and reduce mod p.'],
  solution: `${n(p)} is prime and divides neither ${n(a)} nor ${n(b)}, so ${n(a)}${sup(e)} ≡ 1 and ${n(b)}${sup(e)} ≡ 1 (mod ${n(p)}). Rotor A: ${n(k)} = ${n(qk)} × ${n(e)} + ${n(rk)}, so ${n(a)}${sup(k)} ≡ ${n(a)}${sup(rk)}; ${sa.listText ? `${sa.listText}; ` : ''}${sa.productText}, so A = ${n(A)}. Rotor B: ${n(m)} = ${n(qm)} × ${n(e)} + ${n(rm)}, so ${n(b)}${sup(m)} ≡ ${n(b)}${sup(rm)}; ${sb.listText ? `${sb.listText}; ` : ''}${sb.productText}, so B = ${n(B)}. The mast multiplies ${n(A)} × ${n(B)} = ${n(P)} = ${n(Math.floor(P / p))} × ${n(p)} + ${n(C)}, so the combined signal is ${n(C)}.`,
  guidance: [
   { prompt: `Reduce the exponent ${n(k)} mod ${n(e)}, then find ${n(a)} to that power mod ${n(p)}. What is rotor A’s output?`, answer: [A], explanation: `${n(k)} = ${n(qk)} × ${n(e)} + ${n(rk)}, so only ${n(a)}${sup(rk)} is left: ${sa.listText ? `${sa.listText}; ` : ''}${sa.productText}.` },
   { prompt: `Reduce the exponent ${n(m)} mod ${n(e)}, then find ${n(b)} to that power mod ${n(p)}. What is rotor B’s output?`, answer: [B], explanation: `${n(m)} = ${n(qm)} × ${n(e)} + ${n(rm)}, so only ${n(b)}${sup(rm)} is left: ${sb.listText ? `${sb.listText}; ` : ''}${sb.productText}.` },
   { prompt: `Multiply the two outputs ${n(A)} and ${n(B)} and reduce mod ${n(p)}. What is the combined signal?`, answer: [C], explanation: `${n(A)} × ${n(B)} = ${n(P)} = ${n(Math.floor(P / p))} × ${n(p)} + ${n(C)}.` }
  ] }; }
});

mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q19', title: 'The tower exponent',
 brief: 'The exponent itself is a power too large to write out, so Mira has to shrink it with repeated squaring before the prime channel can take it.',
 labels: ['reduced exponent', 'least residue of the power'], tolerance: 0.01,
 gl: [['power p − 1'], ['reduced exponent'], ['least residue of the power']]
}, {
 /* a raised to the power b^c mod a prime p from 11 to 53: b from 2 to 9, c from 20 to 120, a from 2 to p − 2. The exponent b^c is reduced mod p − 1 by repeated squaring (q19),
    with b^c mod (p − 1) at least 2 and an answer of at least 2. */
 canonical: { p: 23, a: 5, b: 7, c: 41 },
 draw: R => bounded(() => { const p = R.pick(PRIMES.filter(v => v <= 53)); return { p, a: R.int(2, p - 2), b: R.int(2, 9), c: R.int(20, 120) }; },
  q => { const r = powmod(q.b, q.c, q.p - 1); return r >= 2 && powmod(q.a, r, q.p) >= 2; }, { p: 23, a: 5, b: 7, c: 41 }),
 build: ({ p, a, b, c }) => { const e = p - 1, r = powmod(b, c, e), sb = squaring(b, c, e), sa = squaring(a, r, p), res = sa.result; return {
  prompt: `The prime channel of the Signal Office works mod ${n(p)}, a prime that shares no factor bigger than 1 with ${n(a)}. Mira needs ${n(a)} raised to the power ${n(b)}${sup(c)}, mod ${n(p)}: the exponent is a product of ${n(c)} copies of ${n(b)}, far too large to write out. Enter the remainder when that exponent ${n(b)}${sup(c)} is divided by ${n(p)} − 1, found by repeated squaring, then enter the least residue of ${n(a)} raised to the power ${n(b)}${sup(c)}, mod ${n(p)}.`,
  answer: [r, res],
  hints: ['Fermat’s little theorem: when p is prime and does not divide a, a to the power p − 1 is ≡ 1 (mod p), so only the remainder of the exponent after dividing by p − 1 matters.', 'The exponent is itself a big power. Find its remainder mod p − 1 by repeated squaring, working mod p − 1 instead of mod p, then use that remainder as the exponent of a.'],
  solution: `${n(p)} is prime and does not divide ${n(a)}, so ${n(a)}${sup(e)} ≡ 1 (mod ${n(p)}) and only the exponent mod ${n(e)} matters. By repeated squaring mod ${n(e)}: ${sb.listText ? `${sb.listText}; ` : ''}${sb.productText}, so ${n(b)}${sup(c)} ≡ ${n(r)} (mod ${n(e)}). Then ${n(a)} raised to the power ${n(b)}${sup(c)} ≡ ${n(a)}${sup(r)} (mod ${n(p)}). By repeated squaring: ${sa.listText ? `${sa.listText}; ` : ''}${sa.productText}. So the answer is ${n(res)}.`,
  guidance: [
   { prompt: `By Fermat’s little theorem, ${n(a)} to which power is ≡ 1 (mod ${n(p)})?`, answer: [e], explanation: `${n(p)} is prime and does not divide ${n(a)}, so ${n(a)}${sup(e)} ≡ 1 (mod ${n(p)}). Only the exponent mod ${n(e)} matters.` },
   { prompt: `Use repeated squaring mod ${n(e)}. What is ${n(b)}${sup(c)} mod ${n(e)}?`, answer: [r], explanation: `${sb.listText ? `${sb.listText}; ` : ''}${sb.productText}.` },
   { prompt: `Now find ${n(a)}${sup(r)} mod ${n(p)} by repeated squaring. What is it?`, answer: [res], explanation: `${sa.listText ? `${sa.listText}; ` : ''}${sa.productText}.` }
  ] }; }
});

})();
