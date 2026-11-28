/* Number theory: the hidden life of whole numbers practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p3.js. */
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
/* Whole-number helpers. mod always gives a least residue 0 … m − 1, also for a negative a. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mod = (a, m) => ((a % m) + m) % m;
const egcd = (a, b) => { if (b === 0) return [a, 1, 0]; const [g, x, y] = egcd(b, a % b); return [g, y, x - Math.floor(a / b) * y]; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
const sub = k => String(k).split('').map(d => SUB[Number(d)]).join('');
const factor = v => { const out = []; for (let p = 2; p * p <= v; p++) { let e = 0; while (v % p === 0) { v /= p; e++; } if (e) out.push([p, e]); } if (v > 1) out.push([v, 1]); return out; };
const power = (p, e) => e === 1 ? n(p) : `${n(p)}${sup(e)}`;
const factorText = v => factor(v).map(([p, e]) => power(p, e)).join(' × ');
const euclidText = (a, b) => { const out = []; while (b) { out.push(`${n(a)} = ${n(Math.floor(a / b))} × ${n(b)} + ${n(a % b)}`); [a, b] = [b, a % b]; } return out.join(', '); };
/* The positive solutions (x, y) of ax + by = c, found from the smallest y up. */
const positive = (a, b, c) => { const out = []; for (let y = 1; b * y < c; y++) if ((c - b * y) % a === 0) out.push([(c - b * y) / a, y]); return out; };
/* Bounded retry for a draw: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canonical }; };
/* ax + by = c reduced by the gcd, with its positive solutions. */
const dio = (a, b, c) => { const d = gcd(a, b), a1 = a / d, b1 = b / d, c1 = c / d, sols = positive(a1, b1, c1), K = sols.length, [X, Y] = sols[0], [X2, Y2] = sols[K - 1];
 return { d, a1, b1, c1, sols, K, X, Y, X2, Y2,
  reduced: d === 1 ? `The gcd is 1, so the equation stays ${n(a)}x + ${n(b)}y = ${n(c)}.` : `Divide every term by ${n(d)}: ${n(a1)}x + ${n(b1)}y = ${n(c1)}.`,
  list: sols.map(([x, y]) => `(${n(x)}, ${n(y)})`).join(', ') }; };
/* Divisor count τ(v) with its working. */
const tau = v => { const fs = factor(v), T = fs.reduce((t, [, e]) => t * (e + 1), 1);
 return { T, text: factorText(v), calc: fs.length === 1 ? `${n(fs[0][1])} + 1 = ${n(T)}` : `${fs.map(([, e]) => `(${n(e)} + 1)`).join(' × ')} = ${n(T)}` }; };
/* Digits of N, the digit sum, and the remainders by 3, 9 and 11 (alternating sum from the units digit). */
const serial = N => { const ds = String(N).split('').map(Number), s = ds.reduce((t, x) => t + x, 0), back = ds.slice().reverse(),
 alt = back.reduce((t, x, i) => t + (i % 2 ? -x : x), 0);
 return { ds, s, m3: s % 3, m9: s % 9, alt, m11: mod(alt, 11), altText: back.map((x, i) => i === 0 ? n(x) : `${i % 2 ? '−' : '+'} ${n(x)}`).join(' ') }; };
/* The modular inverse of a mod m in 1 … m − 1, with its Euclid working. */
const inv = (a, m) => { const [, x0, y0] = egcd(a, m), i = mod(x0, m), y = (1 - a * i) / m;
 return { x0, y0, i, y, P: a * i, k: (a * i - 1) / m, adjust: x0 === i ? '' : ` That x is negative, so add ${n(m)}: ${n(x0)} + ${n(m)} = ${n(i)}, and y becomes ${n(y)}.` }; };

/* ---- q11 Chapter review: depot measures [R2.4, R2.5] ---- */

mk({ id: 'q11b', parent: 'q11', kind: 'setting', title: 'The spares shed kits',
 brief: 'The spares shed packs washers in sealed bags, and the keeper wants every way a repair kit can be made up and every way its washers can be laid out.',
 labels: ['gcd of the bag sizes', 'bag mixes', 'grids'], tolerance: 0.01,
 gl: [['gcd of the bag sizes'], ['smallest y', 'its x'], ['bag mixes'], ['grids']] }, {
 /* Bags of a and b washers, a kit of c. a = d·a1 and b = d·b1 with a1 < b1 coprime, both at least 2; 2 to 5 positive mixes; c at most 300.
    Not the parent's worked example (4, 6, 30) nor its canonical (6, 9, 96). */
 canonical: { a: 8, b: 12, c: 100 },
 draw: R => tries(() => { const d = R.pick([1, 2, 3, 4]), a1 = R.int(2, 8), b1 = R.int(a1 + 1, 9), c1 = R.int(10, 80); return { a: d * a1, b: d * b1, c: d * c1 }; },
  p => { const g = gcd(p.a, p.b); if (gcd(p.a / g, p.b / g) !== 1 || p.a / g < 2 || p.c > 300 || p.c % g) return false; const K = positive(p.a / g, p.b / g, p.c / g).length;
   return K >= 2 && K <= 5 && !(p.a === 4 && p.b === 6 && p.c === 30) && !(p.a === 6 && p.b === 9 && p.c === 96); }, { a: 8, b: 12, c: 100 }),
 build: ({ a, b, c }) => { const o = dio(a, b, c), t = tau(c); return {
  prompt: `The Fuel Depot’s spares shed packs washers in sealed bags of ${n(a)} and ${n(b)}, always full and never opened. A repair kit needs exactly ${n(c)} washers, with at least one bag of each size. Enter the greatest common divisor gcd(${n(a)}, ${n(b)}). Then enter the number of different bag mixes: x bags of ${n(a)} and y bags of ${n(b)}, with ${n(a)}x + ${n(b)}y = ${n(c)} and x and y whole numbers of at least 1. Last, the ${n(c)} washers may be laid out in a rectangular grid of equal rows with none left over: r rows of s washers, with r × s = ${n(c)}. A grid of 2 rows of 5 and a grid of 5 rows of 2 count as different grids, and a single row counts. Enter the number of grids, which is the number of divisors τ(${n(c)}).`,
  answer: [o.d, o.K, t.T],
  hints: ['The gcd of the two bag sizes decides whether a kit can be made at all: ax + by = c has whole-number solutions only when the gcd divides c. Divide every term by the gcd to get a smaller equation with the same solutions.',
   'List the mixes from the smallest y up. Each further mix adds (first bag size ÷ gcd) to y and takes (second bag size ÷ gcd) from x. Stop before x would reach 0.',
   'Each choice of the number of rows r that divides the kit size gives exactly one grid, so the number of grids is the number of divisors: factorise the kit size and multiply (exponent + 1) over its primes.'],
  solution: `Euclid’s algorithm: ${euclidText(b, a)}. The last non-zero remainder is ${n(o.d)}, so gcd(${n(a)}, ${n(b)}) = ${n(o.d)}, and ${n(o.d)} divides ${n(c)}, so a kit can be made. ${o.reduced} The smallest y that leaves a whole x is y = ${n(o.Y)}, with x = ${n(o.X)}. Each further mix adds ${n(o.a1)} to y and takes ${n(o.b1)} from x, so the mixes (x, y) are ${o.list}; one more step would make x 0 or less. That is ${n(o.K)} mixes. Each number of rows that divides ${n(c)} gives one grid, so the count is τ(${n(c)}). ${n(c)} = ${t.text}, so τ(${n(c)}) = ${t.calc} grids.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(b)} and ${n(a)}. What is gcd(${n(a)}, ${n(b)})?`, answer: [o.d], explanation: `${euclidText(b, a)}. The last non-zero remainder, ${n(o.d)}, is the gcd.` },
   { prompt: `${o.reduced} Try y = 1, 2, 3, … in turn. What is the smallest y that leaves a whole number x of at least 1, and what is that x?`, answer: [o.Y, o.X], explanation: `With y = ${n(o.Y)}: ${n(o.c1)} − ${n(o.b1)} × ${n(o.Y)} = ${n(o.c1 - o.b1 * o.Y)} = ${n(o.a1)} × ${n(o.X)}, so x = ${n(o.X)}.${o.Y === 1 ? ' No smaller y is allowed, since y must be at least 1.' : o.Y === 2 ? ` With y = 1, ${n(o.c1 - o.b1)} leaves a remainder when divided by ${n(o.a1)}.` : ` Every smaller y, from 1 to ${n(o.Y - 1)}, makes ${n(o.c1)} − ${n(o.b1)}y leave a remainder when divided by ${n(o.a1)}.`}` },
   { prompt: `Each further mix adds ${n(o.a1)} to y and takes ${n(o.b1)} from x. How many mixes have x and y both at least 1?`, answer: [o.K], explanation: `The mixes are ${o.list}. The next step would make x 0 or less, so there are ${n(o.K)}.` },
   { prompt: `Factorise ${n(c)} into primes. How many divisors does it have, and so how many grids?`, answer: [t.T], explanation: `${n(c)} = ${t.text}. Each divisor picks an exponent for each prime, from 0 up to its exponent here, so τ(${n(c)}) = ${t.calc}.` }
  ] }; }
});

mk({ id: 'q11c', parent: 'q11', kind: 'applied', title: 'The two-size sled',
 brief: 'A depot sled hauls sealed drums of two sizes, every drum costs the same fee, and the keeper wants the cheapest load for a standing order.',
 labels: ['loads', 'fewest drums'], tolerance: 0.01,
 gl: [['smallest y', 'its x'], ['loads'], ['fewest drums']] }, {
 /* Drums of a < b litres, an order of c. a = d·a1, b = d·b1, a1 < b1 coprime, a1 at least 2; 2 to 6 loads; c at most 400.
    The first size is smaller, so each step to the next load swaps b1 small drums for a1 large ones and the last load has the fewest drums. */
 canonical: { a: 10, b: 15, c: 180 },
 draw: R => tries(() => { const d = R.pick([1, 2, 3, 4, 5]), a1 = R.int(2, 9), b1 = R.int(a1 + 1, 11), c1 = R.int(15, 90); return { a: d * a1, b: d * b1, c: d * c1 }; },
  p => { const g = gcd(p.a, p.b); if (gcd(p.a / g, p.b / g) !== 1 || p.a / g < 2 || p.c > 400 || p.c % g) return false; const K = positive(p.a / g, p.b / g, p.c / g).length;
   return K >= 2 && K <= 6 && !(p.a === 4 && p.b === 6 && p.c === 30); }, { a: 10, b: 15, c: 180 }),
 build: ({ a, b, c }) => { const o = dio(a, b, c), tot = o.X2 + o.Y2; return {
  prompt: `A depot sled carries sealed drums of ${n(a)} litres and ${n(b)} litres, never opened. A delivery must total exactly ${n(c)} litres, with at least one drum of each size. Every drum on the sled costs the same handling fee, so the keeper wants the load with the fewest drums. Enter how many different loads can make the delivery: x drums of ${n(a)} litres and y drums of ${n(b)} litres, with ${n(a)}x + ${n(b)}y = ${n(c)} and x and y whole numbers of at least 1. Then enter the fewest drums, x + y, that any of those loads uses.`,
  answer: [o.K, tot],
  hints: ['Divide every term of the equation by the gcd of the two drum sizes, then list the loads from the smallest y up: each further load adds (first size ÷ gcd) to y and takes (second size ÷ gcd) from x. Stop before x would reach 0.',
   'Each step swaps (second size ÷ gcd) of the smaller drums for (first size ÷ gcd) of the larger ones, which is fewer drums in all. So the fewest drums come from the last load in your list: add its x and y.'],
  solution: `The gcd of ${n(a)} and ${n(b)} is ${n(o.d)}, which divides ${n(c)}. ${o.reduced} The smallest y that leaves a whole x is y = ${n(o.Y)}, with x = ${n(o.X)}. Each further load adds ${n(o.a1)} to y and takes ${n(o.b1)} from x, so the loads (x, y) are ${o.list}; one more step would make x 0 or less. That is ${n(o.K)} loads. A step swaps ${n(o.b1)} drums of ${n(a)} litres for ${n(o.a1)} drums of ${n(b)} litres, so every step uses fewer drums, and the last load, ${n(o.X2)} drums of ${n(a)} litres and ${n(o.Y2)} of ${n(b)} litres, has the fewest: ${n(o.X2)} + ${n(o.Y2)} = ${n(tot)}.`,
  guidance: [
   { prompt: `${o.reduced} Try y = 1, 2, 3, … in turn. What is the smallest y that leaves a whole number x of at least 1, and what is that x?`, answer: [o.Y, o.X], explanation: `With y = ${n(o.Y)}: ${n(o.c1)} − ${n(o.b1)} × ${n(o.Y)} = ${n(o.c1 - o.b1 * o.Y)} = ${n(o.a1)} × ${n(o.X)}, so x = ${n(o.X)}.` },
   { prompt: `Each further load adds ${n(o.a1)} to y and takes ${n(o.b1)} from x. How many loads have x and y both at least 1?`, answer: [o.K], explanation: `The loads are ${o.list}. The next step would make x 0 or less, so there are ${n(o.K)}.` },
   { prompt: `Each step swaps ${n(o.b1)} drums of ${n(a)} litres for ${n(o.a1)} drums of ${n(b)} litres, so the last load has the fewest drums. How many drums does the last load use in all?`, answer: [tot], explanation: `The last load is ${n(o.X2)} drums of ${n(a)} litres and ${n(o.Y2)} of ${n(b)} litres: ${n(o.X2)} + ${n(o.Y2)} = ${n(tot)} drums.` }
  ] }; }
});

mk({ id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q05', title: 'The calibration tank',
 brief: 'The depot calibrates its gauges on a tank that both can sizes fill exactly, and the keeper wants its size, the orders that use both cans, and the drums that would fit it.',
 labels: ['tank size', 'ways to fill the order', 'drum sizes'], tolerance: 0.01,
 gl: [['gcd', 'tank size'], ['smallest y', 'its x'], ['ways to fill the order'], ['drum sizes']] }, {
 /* a = d·a1, b = d·b1, a1 < b1 coprime from 3 to 12 (d from 2 to 6), c = d·c1 with 3 to 7 positive solutions and c at most 600, so the
    tank lcm = d·a1·b1 stays below 1000 and has at least 6 divisors. Not the parent's worked example (4, 6, 30) nor its canonical (6, 9, 96). */
 canonical: { a: 12, b: 21, c: 300 },
 draw: R => tries(() => { const d = R.int(2, 6), a1 = R.int(3, 9), b1 = R.int(a1 + 1, 12), c1 = R.int(30, 200); return { a: d * a1, b: d * b1, c: d * c1 }; },
  p => { const g = gcd(p.a, p.b); if (gcd(p.a / g, p.b / g) !== 1 || p.a / g < 2 || p.c > 600 || p.c % g) return false; const K = positive(p.a / g, p.b / g, p.c / g).length, L = p.a / g * p.b;
   return K >= 3 && K <= 7 && L < 1000 && tau(L).T >= 6 && !(p.a === 6 && p.b === 9 && p.c === 96); }, { a: 12, b: 21, c: 300 }),
 build: ({ a, b, c }) => { const o = dio(a, b, c), L = a / o.d * b, t = tau(L); return {
  prompt: `The Fuel Depot’s two sealed can sizes are ${n(a)} litres and ${n(b)} litres. A calibration tank is filled once using only cans of the first size and once using only cans of the second size, each time exactly full with no can opened. The smallest tank that can be filled both ways holds lcm(${n(a)}, ${n(b)}) litres, the least common multiple. Enter that number of litres. A separate order of exactly ${n(c)} litres must use at least one can of each size: enter the number of ways to make it up, x cans of ${n(a)} litres and y cans of ${n(b)} litres, with ${n(a)}x + ${n(b)}y = ${n(c)} and x and y whole numbers of at least 1. Last, a tank of that calibration size may go into equal drums of one whole-number size, filled exactly with nothing left over: enter how many drum sizes would work, which is the number of divisors of the tank size.`,
  answer: [L, o.K, t.T],
  hints: ['The gcd and the lcm of two numbers multiply to give the product of the numbers, so the lcm is the product divided by the gcd. Euclid’s algorithm, or the two factorisations, gives the gcd.',
   'For the order, divide every term by the gcd, find the solution with the smallest y, then step: each further way adds (first can size ÷ gcd) to y and takes (second can size ÷ gcd) from x, until x would reach 0.',
   'For the drum sizes, factorise the tank size into primes: the number of divisors is the product of (exponent + 1).'],
  solution: `Euclid’s algorithm: ${euclidText(b, a)}, so gcd(${n(a)}, ${n(b)}) = ${n(o.d)}. The lcm is ${n(a)} × ${n(b)} ÷ ${n(o.d)} = ${n(L)} litres. For the order, ${n(o.d)} divides ${n(c)}. ${o.reduced} The smallest y that leaves a whole x is y = ${n(o.Y)}, with x = ${n(o.X)}. Each further way adds ${n(o.a1)} to y and takes ${n(o.b1)} from x, so the ways (x, y) are ${o.list}; one more step would make x 0 or less. That is ${n(o.K)} ways. For the drums, ${n(L)} = ${t.text}, so its number of divisors is ${t.calc}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(b)} and ${n(a)} to find gcd(${n(a)}, ${n(b)}). Then use lcm = product ÷ gcd. What are the gcd and the tank size?`, answer: [o.d, L], explanation: `${euclidText(b, a)}, so the gcd is ${n(o.d)}. The lcm is ${n(a)} × ${n(b)} ÷ ${n(o.d)} = ${n(a * b)} ÷ ${n(o.d)} = ${n(L)}.` },
   { prompt: `${o.reduced} Try y = 1, 2, 3, … in turn. What is the smallest y that leaves a whole number x of at least 1, and what is that x?`, answer: [o.Y, o.X], explanation: `With y = ${n(o.Y)}: ${n(o.c1)} − ${n(o.b1)} × ${n(o.Y)} = ${n(o.c1 - o.b1 * o.Y)} = ${n(o.a1)} × ${n(o.X)}, so x = ${n(o.X)}.` },
   { prompt: `Each further way adds ${n(o.a1)} to y and takes ${n(o.b1)} from x. How many ways have x and y both at least 1?`, answer: [o.K], explanation: `The ways are ${o.list}. The next step would make x 0 or less, so there are ${n(o.K)}.` },
   { prompt: `Factorise the tank size ${n(L)} into primes. How many divisors does it have?`, answer: [t.T], explanation: `${n(L)} = ${t.text}. Each divisor picks an exponent for each prime, from 0 up to its exponent here, so the count is ${t.calc}.` }
  ] }; }
});

/* ---- q12 Congruences and least residues [R3.1] ---- */

mk({ id: 'q12b', parent: 'q12', kind: 'setting', title: 'The lamp board ring',
 brief: 'The departures lamp board steps round a ring of lamps one signal at a time, and the clerk needs to know which lamp is lit after counts forward and back.',
 labels: ['lamp after the forward count', 'lamp after the backward count', 'same lamp (1 or 0)'], tolerance: 0.01,
 gl: [['quotient', 'lamp after the forward count'], ['quotient', 'lamp after the backward count'], ['difference', 'remainder of the difference']] }, {
 /* A ring of m lamps (7 to 16, never 6, the worked example's modulus). A forward count of 100 to 999 and a backward count of 11 to 99,
    neither a multiple of m, and a pair C, D with D − C a multiple of m half the time. */
 canonical: { n: 11, A: 365, B: 58, C: 24, D: 123 },
 draw: R => tries(() => { const m = R.int(7, 16), C = R.int(20, 200), same = R.bool(), D = C + m * R.int(2, 9) + (same ? 0 : R.int(1, m - 1)); return { n: m, A: R.int(100, 999), B: R.int(11, 99), C, D }; },
  p => p.A % p.n !== 0 && p.B % p.n !== 0, { n: 11, A: 365, B: 58, C: 24, D: 123 }),
 build: ({ n: m, A, B, C, D }) => { const q1 = Math.floor(A / m), r1 = A % m, q2 = Math.floor(-B / m), r2 = mod(-B, m), diff = D - C, qd = Math.floor(diff / m), rd = diff % m, same = rd === 0 ? 1 : 0; return {
  prompt: `The Timetable Office’s departures board has a ring of ${n(m)} lamps, numbered 0 to ${n(m - 1)}. Each signal moves the lit lamp on by one place, so lamp numbers are read mod ${n(m)}. With lamp 0 lit, ${n(A)} signals arrive: enter the least residue of ${n(A)} mod ${n(m)}, the number of the lamp now lit. Running the board backwards for ${n(B)} signals from lamp 0 is a count of −${n(B)}: enter the least residue of −${n(B)} mod ${n(m)}. Last, two logbook counts, ${n(C)} and ${n(D)}, light the same lamp when ${n(C)} ≡ ${n(D)} (mod ${n(m)}): enter 1 if they do and 0 if not.`,
  answer: [r1, r2, same],
  hints: ['Divide the count by the number of lamps: a = qn + r with 0 ≤ r < n, and r is the lamp. For a negative count the quotient is negative too, chosen so that r still lies from 0 to n − 1.',
   'Two counts light the same lamp exactly when n divides their difference, which is the same as both counts leaving the same remainder on division by n.'],
  solution: `${n(A)} = ${n(q1)} × ${n(m)} + ${n(r1)}, so ${n(A)} ≡ ${n(r1)} (mod ${n(m)}) and lamp ${n(r1)} is lit. −${n(B)} = ${n(q2)} × ${n(m)} + ${n(r2)}, so the least residue of −${n(B)} is ${n(r2)}: running back ${n(B)} signals lights lamp ${n(r2)}. ${n(D)} − ${n(C)} = ${n(diff)} = ${n(qd)} × ${n(m)}${rd ? ` + ${n(rd)}, so ${n(m)} does not divide it and ${n(C)} is not congruent to ${n(D)}: enter 0.` : `, so ${n(m)} divides it and ${n(C)} ≡ ${n(D)} (mod ${n(m)}): enter 1.`}`,
  guidance: [
   { prompt: `Divide ${n(A)} by ${n(m)}. What are the quotient and the least residue?`, answer: [q1, r1], explanation: `${n(A)} = ${n(q1)} × ${n(m)} + ${n(r1)}, and ${n(r1)} lies from 0 to ${n(m - 1)}.` },
   { prompt: `Write −${n(B)} = q × ${n(m)} + r with 0 ≤ r < ${n(m)}. What are q and r?`, answer: [q2, r2], explanation: `${n(q2)} × ${n(m)} = ${n(q2 * m)}, and −${n(B)} − ${par(q2 * m)} = ${n(r2)}, which lies from 0 to ${n(m - 1)}. One step less negative, ${n(q2 + 1)} × ${n(m)} = ${n((q2 + 1) * m)}, would leave a negative remainder.` },
   { prompt: `What is ${n(D)} − ${n(C)}, and what remainder does it leave on division by ${n(m)}?`, answer: [diff, rd], explanation: `${n(D)} − ${n(C)} = ${n(diff)} = ${n(qd)} × ${n(m)} + ${n(rd)}. ${rd ? 'The remainder is not 0, so the two counts are not congruent.' : 'The remainder is 0, so the two counts are congruent.'}` }
  ] }; }
});

mk({ id: 'q12c', parent: 'q12', kind: 'applied', title: 'The inspection robot’s rounds',
 brief: 'An inspection robot walks a ring corridor on two orders, the first of which sends it back past door 0, and the dispatcher needs to know where it stands after each.',
 labels: ['door after the first order', 'door after the second order'], tolerance: 0.01,
 gl: [['net count'], ['quotient', 'door after the first order'], ['door after the second order']] }, {
 /* A ring of m doors (7 to 15, not 6 or 10). The robot starts at door s, goes A forward then B back with B > s + A, so the first net count is negative;
    then C forward. */
 canonical: { m: 9, s: 4, A: 17, B: 52, C: 30 },
 draw: R => tries(() => { const m = R.pick([7, 8, 9, 11, 12, 13, 14, 15]), s = R.int(1, m - 1), A = R.int(10, 60); return { m, s, A, B: s + A + R.int(5, 80), C: R.int(5, 80) }; },
  p => (p.s + p.A - p.B) % p.m !== 0 && (p.s + p.A - p.B + p.C) % p.m !== 0, { m: 9, s: 4, A: 17, B: 52, C: 30 }),
 build: ({ m, s, A, B, C }) => { const N1 = s + A - B, q1 = Math.floor(N1 / m), r1 = mod(N1, m), N2 = N1 + C, q2 = Math.floor(N2 / m), r2 = mod(N2, m); return {
  prompt: `An inspection robot patrols a ring corridor with ${n(m)} doors, numbered 0 to ${n(m - 1)}, so door counts are read mod ${n(m)}. It starts at door ${n(s)}. Its first order sends it ${n(A)} doors forward and then ${n(B)} doors back, and a step back counts as negative. Enter the door it stands at after the first order. Its second order then sends it ${n(C)} doors forward from there. Enter the door it stands at after the second order. Each answer is a least residue, from 0 to ${n(m - 1)}.`,
  answer: [r1, r2],
  hints: ['Add up the steps from where it started, counting forward steps as positive and backward steps as negative. The total can be negative.',
   'Write the total as qn + r with 0 ≤ r < n, where n is the number of doors. For a negative total the quotient is negative too, chosen so that r lies from 0 to n − 1. For the second order, add its steps to the first total (or to the first door) and reduce again.'],
  solution: `The net count after the first order is ${n(s)} + ${n(A)} − ${n(B)} = ${n(N1)}. ${n(N1)} = ${n(q1)} × ${n(m)} + ${n(r1)}, so the robot stands at door ${n(r1)}. After the second order the net count is ${n(N1)} + ${n(C)} = ${n(N2)}, and ${n(N2)} = ${n(q2)} × ${n(m)} + ${n(r2)}, so it stands at door ${n(r2)}.`,
  guidance: [
   { prompt: `Add the steps from door ${n(s)}: forward ${n(A)}, back ${n(B)}. What is the net count ${n(s)} + ${n(A)} − ${n(B)}?`, answer: [N1], explanation: `${n(s)} + ${n(A)} = ${n(s + A)}, and ${n(s + A)} − ${n(B)} = ${n(N1)}.` },
   { prompt: `Write ${n(N1)} = q × ${n(m)} + r with 0 ≤ r < ${n(m)}. What are q and r?`, answer: [q1, r1], explanation: `${n(q1)} × ${n(m)} = ${n(q1 * m)}, and ${n(N1)} − ${par(q1 * m)} = ${n(r1)}, which lies from 0 to ${n(m - 1)}. So the robot stands at door ${n(r1)}.` },
   { prompt: `The second order adds ${n(C)} to the net count ${n(N1)}. Reduce the new count ${n(N2)} mod ${n(m)}. At which door does the robot stand?`, answer: [r2], explanation: `${n(N2)} = ${n(q2)} × ${n(m)} + ${n(r2)}, with ${n(r2)} from 0 to ${n(m - 1)}.` }
  ] }; }
});

mk({ id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q02', title: 'The cipher dial setting',
 brief: 'The cipher room sets its dial from a code word written in an old base, and the operator needs the dial positions for turning forwards and for turning back.',
 labels: ['value in base ten', 'position turned forward', 'position turned back'], tolerance: 0.01,
 gl: [['value in base ten'], ['quotient', 'position turned forward'], ['quotient', 'position turned back']] }, {
 /* A four-digit base-β numeral (β from 5 to 9, first digit at least 1) and a dial of m positions (11 to 29) on which the value is not a multiple of m. */
 canonical: { b: 7, w: 3, x: 5, y: 0, z: 6, m: 13 },
 draw: R => tries(() => ({ b: R.int(5, 9), w: R.int(1, 4), x: R.int(0, 4), y: R.int(0, 4), z: R.int(1, 4), m: R.int(11, 29) }),
  p => { const V = p.w * p.b ** 3 + p.x * p.b ** 2 + p.y * p.b + p.z; return V % p.m !== 0; }, { b: 7, w: 3, x: 5, y: 0, z: 6, m: 13 }),
 build: ({ b, w, x, y, z, m }) => { const V = w * b ** 3 + x * b ** 2 + y * b + z, q1 = Math.floor(V / m), r1 = V % m, q2 = Math.floor(-V / m), r2 = mod(-V, m); return {
  prompt: `The cipher room sets its dial from a code word written in base ${n(b)}: the numeral (${w}${x}${y}${z})${sub(b)}, where the places from the right are worth 1, ${n(b)}, ${n(b)}² and ${n(b)}³. Enter the code word’s value in base ten (type it without commas). The dial is a ring of ${n(m)} positions, numbered 0 to ${n(m - 1)}, so counts on it are read mod ${n(m)}. Turning it forward from position 0 by that many steps leaves it at a position: enter it. Turning it backward from position 0 by the same number of steps is a count of the negative of the value: enter the position it leaves the dial at.`,
  answer: [V, r1, r2],
  hints: ['In a base, each place from the right is worth the base times the place before it. Multiply each digit by its place value and add to get the value in base ten.',
   'The forward position is the least residue of the value: divide by the number of positions, and the remainder is the position. For the backward turn, take the negative of the value and write it as qn + r with 0 ≤ r < n; the quotient is negative, chosen so that r lies from 0 to n − 1.'],
  solution: `The places are worth ${n(b ** 3)}, ${n(b ** 2)}, ${n(b)} and 1, so (${w}${x}${y}${z})${sub(b)} = ${n(w)} × ${n(b ** 3)} + ${n(x)} × ${n(b ** 2)} + ${n(y)} × ${n(b)} + ${n(z)} = ${n(V)}. Forward: ${n(V)} = ${n(q1)} × ${n(m)} + ${n(r1)}, so the dial stops at position ${n(r1)}. Backward: −${n(V)} = ${n(q2)} × ${n(m)} + ${n(r2)}, so it stops at position ${n(r2)}.`,
  guidance: [
   { prompt: `Multiply each digit of (${w}${x}${y}${z})${sub(b)} by its place value (${n(b ** 3)}, ${n(b ** 2)}, ${n(b)}, 1) and add. What is the value in base ten?`, answer: [V], explanation: `${n(w)} × ${n(b ** 3)} + ${n(x)} × ${n(b ** 2)} + ${n(y)} × ${n(b)} + ${n(z)} = ${n(w * b ** 3)} + ${n(x * b ** 2)} + ${n(y * b)} + ${n(z)} = ${n(V)}.` },
   { prompt: `Divide ${n(V)} by ${n(m)}. What are the quotient and the least residue, the position when turned forward?`, answer: [q1, r1], explanation: `${n(V)} = ${n(q1)} × ${n(m)} + ${n(r1)}, and ${n(r1)} lies from 0 to ${n(m - 1)}.` },
   { prompt: `Write −${n(V)} = q × ${n(m)} + r with 0 ≤ r < ${n(m)}. What are q and r, the position when turned back?`, answer: [q2, r2], explanation: `${n(q2)} × ${n(m)} = ${n(q2 * m)}, and −${n(V)} − ${par(q2 * m)} = ${n(r2)}, which lies from 0 to ${n(m - 1)}.` }
  ] }; }
});

/* ---- q13 Arithmetic mod n [R3.1] ---- */

mk({ id: 'q13b', parent: 'q13', kind: 'setting', title: 'The departures counter',
 brief: 'The departures board counts passengers on a counter that wraps round, and the clerk needs its reading after a day of sales and after a run of full trams.',
 labels: ['reading after the three counts', 'reading after the full trams'], tolerance: 0.01,
 gl: [['residue of first count', 'residue of second count', 'residue of third count'], ['reading after the three counts'], ['reading after the full trams']] }, {
 /* A counter of m (7 to 19, not 5, the worked example's modulus) and three four-digit counts, each with a residue of at least 2. */
 canonical: { m: 11, A: 3482, B: 2915, C: 6038 },
 draw: R => tries(() => ({ m: R.pick([7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19]), A: R.int(1000, 9999), B: R.int(1000, 9999), C: R.int(1000, 9999) }),
  p => p.A % p.m >= 2 && p.B % p.m >= 2 && p.C % p.m >= 2 && new Set([p.A, p.B, p.C]).size === 3, { m: 11, A: 3482, B: 2915, C: 6038 }),
 build: ({ m, A, B, C }) => { const rA = A % m, rB = B % m, rC = C % m, S = rA + rB + rC, s = S % m, P1 = rA * rB, p1 = P1 % m, P2 = p1 * rC, p2 = P2 % m; return {
  prompt: `The counter on the Timetable Office’s departures board wraps round: it shows only the least residue mod ${n(m)}, from 0 to ${n(m - 1)}, and it starts the day at 0. In the morning ${n(A)} passengers are scanned, at noon ${n(B)} more and in the evening ${n(C)} more. Enter the reading after all three counts: the least residue of ${n(A)} + ${n(B)} + ${n(C)} mod ${n(m)}. Then the counter is reset to 0 and a run of ${n(A)} trams starts, each with ${n(B)} carriages holding ${n(C)} passengers apiece. Enter the reading after the whole run: the least residue of ${n(A)} × ${n(B)} × ${n(C)} mod ${n(m)}. Reduce each number mod ${n(m)} first.`,
  answer: [s, p2],
  hints: ['Replace each large number by its least residue first: if a ≡ a′, b ≡ b′ and c ≡ c′ (mod n), then a + b + c ≡ a′ + b′ + c′ and a × b × c ≡ a′ × b′ × c′ (mod n).',
   'Add the three small residues and reduce once more. For the product, multiply two residues, reduce, then multiply by the third and reduce again, so the numbers stay small. The last result must lie from 0 to n − 1.'],
  solution: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)}, ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)} and ${n(C)} = ${n(Math.floor(C / m))} × ${n(m)} + ${n(rC)}, so the three counts are ≡ ${n(rA)}, ${n(rB)} and ${n(rC)} (mod ${n(m)}). Sum: ${n(rA)} + ${n(rB)} + ${n(rC)} = ${n(S)}${S < m ? `, already below ${n(m)}` : ` ≡ ${n(s)} (mod ${n(m)})`}, so the counter reads ${n(s)}. Product: ${n(rA)} × ${n(rB)} = ${n(P1)}${P1 < m ? `, already below ${n(m)}` : ` ≡ ${n(p1)}`}, then ${n(p1)} × ${n(rC)} = ${n(P2)}${P2 < m ? `, already below ${n(m)}` : ` ≡ ${n(p2)} (mod ${n(m)})`}, so the counter reads ${n(p2)}.`,
  guidance: [
   { prompt: `Reduce all three counts first. What are the least residues of ${n(A)}, ${n(B)} and ${n(C)} mod ${n(m)}?`, answer: [rA, rB, rC], explanation: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)}, ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)} and ${n(C)} = ${n(Math.floor(C / m))} × ${n(m)} + ${n(rC)}.` },
   { prompt: `Add the three residues and reduce mod ${n(m)}. What does the counter read after the three counts?`, answer: [s], explanation: `${n(rA)} + ${n(rB)} + ${n(rC)} = ${n(S)}${S < m ? `, which is already below ${n(m)}.` : `, and ${n(S)} − ${n(Math.floor(S / m) * m)} = ${n(s)}.`}` },
   { prompt: `Multiply the first two residues and reduce mod ${n(m)}, then multiply the result by the third residue and reduce again. What does the counter read after the run?`, answer: [p2], explanation: `${n(rA)} × ${n(rB)} = ${n(P1)}, which leaves ${n(p1)}. Then ${n(p1)} × ${n(rC)} = ${n(P2)} = ${n(Math.floor(P2 / m))} × ${n(m)} + ${n(p2)}.` }
  ] }; }
});

mk({ id: 'q13c', parent: 'q13', kind: 'applied', title: 'The ticket machine delivery',
 brief: 'A new delivery of ticket boxes and loose tickets is going into a machine whose counter wraps round, and the clerk wants the reading after each load.',
 labels: ['reading after the boxes', 'reading after the loose tickets'], tolerance: 0.01,
 gl: [['residue of box count', 'residue of tickets per box', 'residue of loose tickets'], ['reading after the boxes'], ['reading after the loose tickets']] }, {
 /* A counter of m (7 to 19, not 5) and three counts of 3 or 4 digits, each with a residue of at least 2; the product residue is at least 1. */
 canonical: { m: 17, A: 842, B: 3615, C: 927 },
 draw: R => tries(() => ({ m: R.pick([7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 19]), A: R.int(300, 9999), B: R.int(300, 9999), C: R.int(300, 9999) }),
  p => p.A % p.m >= 2 && p.B % p.m >= 2 && p.C % p.m >= 2 && (p.A % p.m) * (p.B % p.m) % p.m >= 1, { m: 17, A: 842, B: 3615, C: 927 }),
 build: ({ m, A, B, C }) => { const rA = A % m, rB = B % m, rC = C % m, P = rA * rB, pr = P % m, F = pr + rC, f = F % m; return {
  prompt: `A ticket machine at the Timetable Office numbers its tickets round a cycle of ${n(m)}: its counter shows only the least residue mod ${n(m)}, from 0 to ${n(m - 1)}, and it starts at 0. A delivery holds ${n(A)} boxes of ${n(B)} tickets each, plus ${n(C)} loose tickets. The machine counts every ticket once. Enter the reading after all the boxes have been counted: the least residue of ${n(A)} × ${n(B)} mod ${n(m)}. Then enter the reading after the loose tickets have been counted as well.`,
  answer: [pr, f],
  hints: ['Replace each large number by its least residue first. A product mod n can be worked out from the residues of its factors: if a ≡ a′ and b ≡ b′ (mod n), then a × b ≡ a′ × b′.',
   'The loose tickets are counted after the boxes, so add their residue to the reading you already have, then reduce once more so that the answer lies from 0 to n − 1.'],
  solution: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)}, ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)} and ${n(C)} = ${n(Math.floor(C / m))} × ${n(m)} + ${n(rC)}, so the three counts are ≡ ${n(rA)}, ${n(rB)} and ${n(rC)} (mod ${n(m)}). Boxes: ${n(rA)} × ${n(rB)} = ${n(P)}${P < m ? `, already below ${n(m)}` : ` ≡ ${n(pr)} (mod ${n(m)})`}, so the counter reads ${n(pr)}. Loose tickets: ${n(pr)} + ${n(rC)} = ${n(F)}${F < m ? `, already below ${n(m)}` : ` ≡ ${n(f)} (mod ${n(m)})`}, so the counter reads ${n(f)}.`,
  guidance: [
   { prompt: `Reduce first. What are the least residues of ${n(A)}, ${n(B)} and ${n(C)} mod ${n(m)}?`, answer: [rA, rB, rC], explanation: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)}, ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)} and ${n(C)} = ${n(Math.floor(C / m))} × ${n(m)} + ${n(rC)}.` },
   { prompt: `Multiply the residues of the box count and of the tickets per box, and reduce mod ${n(m)}. What does the counter read after the boxes?`, answer: [pr], explanation: `${n(rA)} × ${n(rB)} = ${n(P)} = ${n(Math.floor(P / m))} × ${n(m)} + ${n(pr)}.` },
   { prompt: `Add the residue of the loose tickets to that reading and reduce mod ${n(m)}. What does the counter read at the end?`, answer: [f], explanation: `${n(pr)} + ${n(rC)} = ${n(F)}${F < m ? `, which is already below ${n(m)}.` : `, and ${n(F)} − ${n(m)} = ${n(f)}.`}` }
  ] }; }
});

mk({ id: 'q13d', parent: 'q13', kind: 'challenge', title: 'The pulse counter audit',
 brief: 'The auditors want the pulse counter’s reading after four big batches have been combined, and after one batch size has been multiplied by itself twice.',
 labels: ['reading for the batches', 'reading for the cube'], tolerance: 0.01,
 gl: [['residue of first batch', 'residue of second batch', 'residue of third batch', 'residue of fourth batch'], ['reading for the batches'], ['reading for the cube']] }, {
 /* A counter of m (11 to 31) and four five-digit batch sizes, each with a residue of at least 2. */
 canonical: { m: 23, A: 48617, B: 92354, C: 71829, D: 30566 },
 draw: R => tries(() => ({ m: R.int(11, 31), A: R.int(10000, 99999), B: R.int(10000, 99999), C: R.int(10000, 99999), D: R.int(10000, 99999) }),
  p => [p.A, p.B, p.C, p.D].every(v => v % p.m >= 2) && new Set([p.A, p.B, p.C, p.D]).size === 4, { m: 23, A: 48617, B: 92354, C: 71829, D: 30566 }),
 build: ({ m, A, B, C, D }) => { const rA = A % m, rB = B % m, rC = C % m, rD = D % m, P1 = rA * rB, P2 = rC * rD, T = P1 % m + P2 % m, t = T % m, c1 = rA * rA % m, C3 = c1 * rA, c3 = C3 % m; return {
  prompt: `The Timetable Office’s pulse counter works on a cycle of ${n(m)}: it shows only the least residue mod ${n(m)}, from 0 to ${n(m - 1)}. Four batch sizes are ${n(A)}, ${n(B)}, ${n(C)} and ${n(D)} pulses. Enter the reading for ${n(A)} × ${n(B)} + ${n(C)} × ${n(D)} pulses. Then enter the reading for ${n(A)} × ${n(A)} × ${n(A)}, the first batch size multiplied by itself twice. The full products are too big to do by hand, so reduce each number mod ${n(m)} first.`,
  answer: [t, c3],
  hints: ['Replace every number by its least residue first. Sums and products of congruent numbers stay congruent: a × b + c × d ≡ a′ × b′ + c′ × d′ (mod n).',
   'Reduce each product before you add, and reduce the sum again at the end. For the cube, multiply the residue by itself, reduce, then multiply by the residue once more and reduce again.'],
  solution: `${n(A)} ≡ ${n(rA)}, ${n(B)} ≡ ${n(rB)}, ${n(C)} ≡ ${n(rC)} and ${n(D)} ≡ ${n(rD)} (mod ${n(m)}). ${n(rA)} × ${n(rB)} = ${n(P1)} ≡ ${n(P1 % m)} and ${n(rC)} × ${n(rD)} = ${n(P2)} ≡ ${n(P2 % m)}. Their sum ${n(P1 % m)} + ${n(P2 % m)} = ${n(T)}${T < m ? `, already below ${n(m)}` : ` ≡ ${n(t)} (mod ${n(m)})`}, so the first reading is ${n(t)}. For the cube, ${n(rA)} × ${n(rA)} = ${n(rA * rA)}${rA * rA === c1 ? '' : ` ≡ ${n(c1)}`}, then ${n(c1)} × ${n(rA)} = ${n(C3)}${C3 === c3 ? '' : ` ≡ ${n(c3)}`} (mod ${n(m)}), so the second reading is ${n(c3)}.`,
  guidance: [
   { prompt: `Reduce first. What are the least residues of ${n(A)}, ${n(B)}, ${n(C)} and ${n(D)} mod ${n(m)}?`, answer: [rA, rB, rC, rD], explanation: `Divide each by ${n(m)} and keep the remainder: ${n(rA)}, ${n(rB)}, ${n(rC)} and ${n(rD)}.` },
   { prompt: `Multiply the residues in each pair, reduce each product mod ${n(m)}, add the two results and reduce again. What is the first reading?`, answer: [t], explanation: `${n(rA)} × ${n(rB)} = ${n(P1)} ≡ ${n(P1 % m)} and ${n(rC)} × ${n(rD)} = ${n(P2)} ≡ ${n(P2 % m)}. ${n(P1 % m)} + ${n(P2 % m)} = ${n(T)}${T < m ? '.' : `, which leaves ${n(t)}.`}` },
   { prompt: `Square the residue of ${n(A)} and reduce mod ${n(m)}, then multiply by that residue once more and reduce. What is the reading for the cube?`, answer: [c3], explanation: `${n(rA)} × ${n(rA)} = ${n(rA * rA)} ≡ ${n(c1)}. Then ${n(c1)} × ${n(rA)} = ${n(C3)} = ${n(Math.floor(C3 / m))} × ${n(m)} + ${n(c3)}.` }
  ] }; }
});

/* ---- q14 Divisibility tests for 3, 9 and 11 [BC1.18] ---- */

mk({ id: 'q14b', parent: 'q14', kind: 'setting', title: 'The parcel label check',
 brief: 'Parcels at the Timetable Office carry long label numbers, and the clerk wants to catch a mistyped digit and sort the multiples of 3 by eye.',
 labels: ['remainder mod 9', 'remainder mod 11', 'multiple of 3 (1 or 0)'], tolerance: 0.01,
 gl: [['digit sum'], ['remainder mod 9', 'multiple of 3 (1 or 0)'], ['alternating digit sum'], ['remainder mod 11']] }, {
 /* A label of 6 to 9 digits, a multiple of 3 half the time, with remainders mod 9 and mod 11 both non-zero.
    Never the parent's serial (38472915) nor its worked example (75284, five digits). */
 canonical: { N: 6159824 },
 draw: R => tries(() => { const len = R.int(6, 9), ds = [R.int(1, 9)]; for (let i = 1; i < len - 1; i++) ds.push(R.int(0, 9));
  const s = ds.reduce((t, x) => t + x, 0); let last = R.int(0, 9); if (R.bool()) last = R.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => (s + d) % 3 === 0)); ds.push(last); return { N: Number(ds.join('')) }; },
  p => { const t = serial(p.N); return t.m9 !== 0 && t.m11 !== 0 && p.N !== 38472915; }, { N: 6159824 }),
 build: ({ N }) => { const t = serial(N), flag = t.m3 === 0 ? 1 : 0, altEnd = t.alt >= 0 && t.alt <= 10 ? ', which already lies from 0 to 10' : ` ≡ ${n(t.m11)} (mod 11)`; return {
  prompt: `Every parcel at the Timetable Office carries a label number, and the clerk checks it without long division. Today’s label is ${n(N)}. Enter the remainder when ${n(N)} is divided by 9, then the remainder when it is divided by 11. Last, parcels whose label is a multiple of 3 go to the bay by the south door: enter 1 if ${n(N)} is a multiple of 3 and 0 if it is not.`,
  answer: [t.m9, t.m11, flag],
  hints: ['A number leaves the same remainder on division by 9 as the sum of its digits does, because 10 ≡ 1 (mod 9). It is a multiple of 3 exactly when its digit sum is.',
   'For 11 use the alternating digit sum: start with the units digit, subtract the tens digit, add the hundreds digit, and so on, because 10 ≡ −1 (mod 11). If the result is negative or above 10, add or take away 11s until it lies from 0 to 10.'],
  solution: `Digit sum: ${t.ds.map(n).join(' + ')} = ${n(t.s)}. ${n(t.s)} = ${n(Math.floor(t.s / 9))} × 9 + ${n(t.m9)}, so ${n(N)} leaves ${n(t.m9)} on division by 9. ${n(t.s)} ${t.m3 === 0 ? `is a multiple of 3 (${n(t.s / 3)} × 3), so the label is a multiple of 3: enter 1` : `= ${n(Math.floor(t.s / 3))} × 3 + ${n(t.m3)}, so the label is not a multiple of 3: enter 0`}. Alternating digit sum from the units digit: ${t.altText} = ${n(t.alt)}${altEnd}, so ${n(N)} leaves ${n(t.m11)} on division by 11.`,
  guidance: [
   { prompt: `Add up the digits of ${n(N)}. What is the digit sum?`, answer: [t.s], explanation: `${t.ds.map(n).join(' + ')} = ${n(t.s)}.` },
   { prompt: `The label leaves the same remainders as its digit sum ${n(t.s)}. What is the remainder on division by 9, and is the label a multiple of 3 (1 for yes, 0 for no)?`, answer: [t.m9, flag], explanation: `${n(t.s)} = ${n(Math.floor(t.s / 9))} × 9 + ${n(t.m9)}. ${n(t.s)} leaves ${n(t.m3)} on division by 3, so the answer is ${n(flag)}.` },
   { prompt: `Start from the units digit and alternate: plus, minus, plus, … What is the alternating digit sum?`, answer: [t.alt], explanation: `${t.altText} = ${n(t.alt)}.` },
   { prompt: `Bring ${n(t.alt)} into the range 0 to 10 by adding or taking away 11s. What is the remainder of the label on division by 11?`, answer: [t.m11], explanation: `${n(t.alt)}${altEnd}, so the label leaves ${n(t.m11)} on division by 11.` }
  ] }; }
});

mk({ id: 'q14c', parent: 'q14', kind: 'applied', title: 'The season pass check digit',
 brief: 'New season passes are numbered with a final check digit, and the clerk must work out that digit and then the remainder of the finished number.',
 labels: ['check digit', 'remainder mod 11'], tolerance: 0.01,
 gl: [['digit sum'], ['check digit'], ['remainder mod 11']] }, {
 /* The pass so far has 6 to 8 digits, first digit at least 1; the check digit c from 0 to 8 makes the whole number a multiple of 9 (one choice only),
    and the finished number leaves a non-zero remainder mod 11. */
 canonical: { K: 4269175 },
 draw: R => tries(() => { const len = R.int(6, 8); let K = R.int(1, 9); for (let i = 1; i < len; i++) K = 10 * K + R.int(0, 9); return { K }; },
  p => { const s = serial(p.K).s, c = (9 - s % 9) % 9, t = serial(10 * p.K + c); return t.m11 !== 0 && c !== 0; }, { K: 4269175 }),
 build: ({ K }) => { const t0 = serial(K), c = (9 - t0.s % 9) % 9, N = 10 * K + c, t = serial(N), altEnd = t.alt >= 0 && t.alt <= 10 ? ', which already lies from 0 to 10' : ` ≡ ${n(t.m11)} (mod 11)`; return {
  prompt: `Every season pass at the Timetable Office ends in a check digit, a single digit from 0 to 8 chosen so that the whole pass number is a multiple of 9. A new pass has the number ${n(K)} so far, and its last digit, to be written at the right-hand end, is still blank. Enter the check digit. Then enter the remainder when the finished pass number is divided by 11.`,
  answer: [c, t.m11],
  hints: ['A number is a multiple of 9 exactly when its digit sum is, so pick the digit that brings the digit sum of the whole number up to a multiple of 9 (or adds nothing, if it already is one).',
   'Write the finished number with its check digit at the right-hand end. Then use the alternating digit sum for 11, starting with the check digit as the units digit: plus, minus, plus, …, reduced to the range 0 to 10.'],
  solution: `Digit sum of ${n(K)}: ${t0.ds.map(n).join(' + ')} = ${n(t0.s)}. The next multiple of 9 at or above ${n(t0.s)} is ${n(t0.s + c)}, so the check digit is ${n(c)}. The finished number is ${n(N)}. Alternating digit sum from the units digit: ${t.altText} = ${n(t.alt)}${altEnd}, so ${n(N)} leaves ${n(t.m11)} on division by 11.`,
  guidance: [
   { prompt: `Add up the digits of ${n(K)}. What is the digit sum?`, answer: [t0.s], explanation: `${t0.ds.map(n).join(' + ')} = ${n(t0.s)}.` },
   { prompt: `The finished number is a multiple of 9 when its digit sum is, so ${n(t0.s)} plus the check digit must be a multiple of 9. Which digit from 0 to 8 is the check digit?`, answer: [c], explanation: `${n(t0.s)} + ${n(c)} = ${n(t0.s + c)} = ${n((t0.s + c) / 9)} × 9. No other digit from 0 to 8 gives a multiple of 9.` },
   { prompt: `The finished number is ${n(N)}. Take the alternating digit sum from the units digit and bring it into the range 0 to 10. What is the remainder on division by 11?`, answer: [t.m11], explanation: `${t.altText} = ${n(t.alt)}${altEnd}, so ${n(N)} leaves ${n(t.m11)} on division by 11.` }
  ] }; }
});

mk({ id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13', title: 'The two manifests',
 brief: 'Two freight manifests carry very long serial numbers, and the clerk wants the remainder of their sum on division by 9 and of their product on division by 11 without adding or multiplying them out.',
 labels: ['sum mod 9', 'product mod 11'], tolerance: 0.01,
 gl: [['X mod 9', 'Y mod 9'], ['sum mod 9'], ['X mod 11', 'Y mod 11'], ['product mod 11']] }, {
 /* Two serials of 10 to 12 digits; each has a remainder of at least 2 mod 9 and mod 11, and the product leaves a non-zero remainder mod 11. */
 canonical: { X: 5738204186, Y: 80162953747 },
 draw: R => tries(() => { const mkN = () => { let v = R.int(1, 9); const len = R.int(10, 12); for (let i = 1; i < len; i++) v = 10 * v + R.int(0, 9); return v; }; return { X: mkN(), Y: mkN() }; },
  p => { const a = serial(p.X), b = serial(p.Y); return a.m9 >= 2 && b.m9 >= 2 && a.m11 >= 2 && b.m11 >= 2 && a.m11 * b.m11 % 11 !== 0 && p.X !== p.Y; }, { X: 5738204186, Y: 80162953747 }),
 build: ({ X, Y }) => { const a = serial(X), b = serial(Y), S = a.m9 + b.m9, s = S % 9, P = a.m11 * b.m11, p = P % 11,
  alt = t => t.alt >= 0 && t.alt <= 10 ? `${n(t.alt)}` : `${n(t.alt)} ≡ ${n(t.m11)}`; return {
  prompt: `Two freight manifests at the Timetable Office carry the serial numbers ${n(X)} and ${n(Y)}. If each serial is replaced by its remainder on division by a number n, sums and products of the serials leave the same remainders on division by n as the sums and products of those remainders. The clerk will not add or multiply the long serials. Enter the remainder when ${n(X)} + ${n(Y)} is divided by 9. Then enter the remainder when ${n(X)} × ${n(Y)} is divided by 11.`,
  answer: [s, p],
  hints: ['Use the digit sum to find each serial’s remainder on division by 9, add the two remainders and reduce mod 9 again.',
   'Use the alternating digit sum, from the units digit, to find each serial’s remainder on division by 11 (bring it into the range 0 to 10). Multiply the two remainders and reduce mod 11.'],
  solution: `Digit sums: ${a.ds.map(n).join(' + ')} = ${n(a.s)} and ${b.ds.map(n).join(' + ')} = ${n(b.s)}, so ${n(X)} leaves ${n(a.m9)} and ${n(Y)} leaves ${n(b.m9)} on division by 9. The sum leaves ${n(a.m9)} + ${n(b.m9)} = ${n(S)}${S < 9 ? '' : ` ≡ ${n(s)}`}: the remainder is ${n(s)}. Alternating digit sums from the units digit: ${a.altText} = ${alt(a)}, and ${b.altText} = ${alt(b)} (mod 11), so ${n(X)} leaves ${n(a.m11)} and ${n(Y)} leaves ${n(b.m11)} on division by 11. The product leaves ${n(a.m11)} × ${n(b.m11)} = ${n(P)}${P < 11 ? '' : ` ≡ ${n(p)}`}: the remainder is ${n(p)}.`,
  guidance: [
   { prompt: `Add the digits of each serial and take the remainder on division by 9. What are the remainders of ${n(X)} and of ${n(Y)}?`, answer: [a.m9, b.m9], explanation: `The digit sums are ${n(a.s)} and ${n(b.s)}. ${n(a.s)} = ${n(Math.floor(a.s / 9))} × 9 + ${n(a.m9)} and ${n(b.s)} = ${n(Math.floor(b.s / 9))} × 9 + ${n(b.m9)}.` },
   { prompt: `Add those two remainders and reduce mod 9. What is the remainder of ${n(X)} + ${n(Y)} on division by 9?`, answer: [s], explanation: `${n(a.m9)} + ${n(b.m9)} = ${n(S)}${S < 9 ? ', which is already below 9.' : `, and ${n(S)} − 9 = ${n(s)}.`}` },
   { prompt: `Take the alternating digit sum of each serial from its units digit and bring it into the range 0 to 10. What are the remainders of ${n(X)} and of ${n(Y)} on division by 11?`, answer: [a.m11, b.m11], explanation: `${a.altText} = ${n(a.alt)}, which leaves ${n(a.m11)}. ${b.altText} = ${n(b.alt)}, which leaves ${n(b.m11)}.` },
   { prompt: `Multiply those two remainders and reduce mod 11. What is the remainder of ${n(X)} × ${n(Y)} on division by 11?`, answer: [p], explanation: `${n(a.m11)} × ${n(b.m11)} = ${n(P)} = ${n(Math.floor(P / 11))} × 11 + ${n(p)}.` }
  ] }; }
});

/* ---- q15 Modular inverses [R3.3] ---- */

mk({ id: 'q15b', parent: 'q15', kind: 'setting', title: 'The clock drive ratchets',
 brief: 'The station clock’s drive wheel can be pushed by either of two ratchets, and the clockmaker needs the number of pushes that bring the wheel one tooth past its start.',
 labels: ['inverse of the first ratchet', 'inverse of the second ratchet'], tolerance: 0.01,
 gl: [['gcd(a, n)'], ['x, the inverse of the first ratchet', 'y'], ['inverse of the second ratchet']] }, {
 /* A wheel of m teeth (11 to 60), two different ratchet sizes from 2 to m − 2, each coprime to m. Not the worked example (5 mod 17). */
 canonical: { m: 31, a: 12, b: 7 },
 draw: R => tries(() => { const m = R.int(11, 60); return { m, a: R.int(2, m - 2), b: R.int(2, m - 2) }; },
  p => gcd(p.a, p.m) === 1 && gcd(p.b, p.m) === 1 && p.a !== p.b && !(p.m === 17 && (p.a === 5 || p.b === 5)), { m: 31, a: 12, b: 7 }),
 build: ({ m, a, b }) => { const f = inv(a, m), g = inv(b, m); return {
  prompt: `The drive wheel of the station clock has ${n(m)} teeth, numbered 0 to ${n(m - 1)}. Its first ratchet pushes it ${n(a)} teeth at a time round the wheel, and the clockmaker wants to know how many pushes k, from 1 to ${n(m - 1)}, leave it standing exactly 1 tooth past where it started: ${n(a)}k ≡ 1 (mod ${n(m)}). Enter that modular inverse of ${n(a)} mod ${n(m)}. The spare ratchet pushes it ${n(b)} teeth at a time: enter the modular inverse of ${n(b)} mod ${n(m)} as well.`,
  answer: [f.i, g.i],
  hints: ['An inverse of a mod n exists when gcd(a, n) = 1. Run Euclid’s algorithm, then work back up through its steps to write 1 = ax + ny, as for Bézout coefficients.',
   'The x of that equation is an inverse of a. If it is negative or bigger than n − 1, add or take away n until it lies from 1 to n − 1. Do the same for the second ratchet, starting from its own Euclid steps.'],
  solution: `First ratchet. Euclid’s algorithm: ${euclidText(m, a)}. The last non-zero remainder is 1, so the inverse exists. Working back up gives ${n(a)} × ${par(f.x0)} + ${n(m)} × ${par(f.y0)} = 1.${f.adjust} So the inverse of ${n(a)} is ${n(f.i)}: ${n(a)} × ${n(f.i)} = ${n(f.P)} = ${n(f.k)} × ${n(m)} + 1. Spare ratchet. Euclid’s algorithm: ${euclidText(m, b)}. Working back up gives ${n(b)} × ${par(g.x0)} + ${n(m)} × ${par(g.y0)} = 1.${g.adjust} So the inverse of ${n(b)} is ${n(g.i)}: ${n(b)} × ${n(g.i)} = ${n(g.P)} = ${n(g.k)} × ${n(m)} + 1.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(m)} and ${n(a)}. What is gcd(${n(a)}, ${n(m)})?`, answer: [1], explanation: `${euclidText(m, a)}. The last non-zero remainder is 1, so an inverse exists.` },
   { prompt: `Work back up the steps to write ${n(a)}x + ${n(m)}y = 1, with x from 1 to ${n(m - 1)}. What are x and y?`, answer: [f.i, f.y], explanation: `Back-substitution gives ${n(a)} × ${par(f.x0)} + ${n(m)} × ${par(f.y0)} = 1.${f.adjust} So x = ${n(f.i)} and y = ${n(f.y)}.` },
   { prompt: `Do the same for ${n(b)}: Euclid on ${n(m)} and ${n(b)}, then back up to ${n(b)}x + ${n(m)}y = 1. What is the inverse of ${n(b)} mod ${n(m)}, from 1 to ${n(m - 1)}?`, answer: [g.i], explanation: `${euclidText(m, b)}. Back-substitution gives ${n(b)} × ${par(g.x0)} + ${n(m)} × ${par(g.y0)} = 1.${g.adjust} Check: ${n(b)} × ${n(g.i)} = ${n(g.P)} = ${n(g.k)} × ${n(m)} + 1.` }
  ] }; }
});

mk({ id: 'q15c', parent: 'q15', kind: 'applied', title: 'The baggage carousel',
 brief: 'A baggage carousel advances a fixed number of bays per push, and the crew wants the number of pushes that bring a case to its collection bay.',
 labels: ['inverse of the push size', 'pushes needed'], tolerance: 0.01,
 gl: [['inverse of the push size'], ['product of inverse and bay'], ['pushes needed']] }, {
 /* A carousel of m bays (17 to 60), a push size a coprime to m (2 to m − 2), a target bay p (2 to m − 1, not a); inverse × p at least m, so a reduction is needed. */
 canonical: { m: 37, a: 15, p: 23 },
 draw: R => tries(() => { const m = R.int(17, 60); return { m, a: R.int(2, m - 2), p: R.int(2, m - 1) }; },
  p => { if (gcd(p.a, p.m) !== 1 || p.p === p.a) return false; const i = inv(p.a, p.m).i, k = i * p.p % p.m; return i * p.p >= p.m && k >= 2 && !(p.m === 17 && p.a === 5); }, { m: 37, a: 15, p: 23 }),
 build: ({ m, a, p }) => { const f = inv(a, m), prod = f.i * p, k = prod % m, q = Math.floor(prod / m); return {
  prompt: `The baggage carousel at the Timetable Office has ${n(m)} bays, numbered 0 to ${n(m - 1)}. Each push turns it ${n(a)} bays round the ring from bay 0, and a case must come to bay ${n(p)}. The crew needs the number of pushes k, from 0 to ${n(m - 1)}, with ${n(a)}k ≡ ${n(p)} (mod ${n(m)}). One way to find it: if i is the modular inverse of ${n(a)} mod ${n(m)}, so that ${n(a)}i ≡ 1, then multiplying both sides by i gives k ≡ i × ${n(p)} (mod ${n(m)}). Enter the modular inverse i, from 1 to ${n(m - 1)}, then enter the number of pushes k.`,
  answer: [f.i, k],
  hints: ['An inverse of a mod n exists when gcd(a, n) = 1. Run Euclid’s algorithm, work back up its steps to write 1 = ax + ny, and read x as the inverse, adding or taking away n until it lies from 1 to n − 1.',
   'Once you have the inverse i, multiply it by the target bay, then reduce the product mod n to get k in the range 0 to n − 1. Check by multiplying k by the push size and reducing mod n.'],
  solution: `Euclid’s algorithm: ${euclidText(m, a)}. The last non-zero remainder is 1, so the inverse exists. Working back up gives ${n(a)} × ${par(f.x0)} + ${n(m)} × ${par(f.y0)} = 1.${f.adjust} So i = ${n(f.i)}. Then k ≡ ${n(f.i)} × ${n(p)} = ${n(prod)} = ${n(q)} × ${n(m)} + ${n(k)}, so k = ${n(k)}. Check: ${n(a)} × ${n(k)} = ${n(a * k)} = ${n(Math.floor(a * k / m))} × ${n(m)} + ${n(a * k % m)}, which is ${n(p)}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(m)} and ${n(a)} and work back up to write ${n(a)}x + ${n(m)}y = 1. What is the inverse i of ${n(a)} mod ${n(m)}, from 1 to ${n(m - 1)}?`, answer: [f.i], explanation: `${euclidText(m, a)}. Back-substitution gives ${n(a)} × ${par(f.x0)} + ${n(m)} × ${par(f.y0)} = 1.${f.adjust} So i = ${n(f.i)}.` },
   { prompt: `Multiply the inverse ${n(f.i)} by the target bay ${n(p)}. What is the product?`, answer: [prod], explanation: `${n(f.i)} × ${n(p)} = ${n(prod)}.` },
   { prompt: `Reduce ${n(prod)} mod ${n(m)} to the range 0 to ${n(m - 1)}. How many pushes k does the case need?`, answer: [k], explanation: `${n(prod)} = ${n(q)} × ${n(m)} + ${n(k)}, so k = ${n(k)}.` }
  ] }; }
});

mk({ id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q13', title: 'The route code wheel',
 brief: 'A route-code wheel is keyed from the product of two long counts, and the clerk needs both the key position and the number that undoes it.',
 labels: ['key position', 'inverse of the key'], tolerance: 0.01,
 gl: [['residue of first count', 'residue of second count'], ['key position'], ['inverse of the key']] }, {
 /* A wheel of m positions (61 to 140) and two four-digit counts whose product residue is at least 2 and coprime to m. */
 canonical: { m: 97, A: 4382, B: 7915 },
 draw: R => tries(() => ({ m: R.int(61, 140), A: R.int(1000, 9999), B: R.int(1000, 9999) }),
  p => { const P = (p.A % p.m) * (p.B % p.m) % p.m; return P >= 2 && gcd(P, p.m) === 1 && (p.A % p.m) >= 2 && (p.B % p.m) >= 2; }, { m: 97, A: 4382, B: 7915 }),
 build: ({ m, A, B }) => { const rA = A % m, rB = B % m, P = rA * rB, key = P % m, f = inv(key, m); return {
  prompt: `A route-code wheel at the Timetable Office has ${n(m)} positions, numbered 0 to ${n(m - 1)}. Its key position is the least residue of ${n(A)} × ${n(B)} mod ${n(m)}. Replace each count by its least residue first: the product of two residues leaves the same remainder as the product of the counts. Enter the key position. To undo the key the clerk needs its modular inverse mod ${n(m)}: the number i, from 1 to ${n(m - 1)}, with key × i ≡ 1 (mod ${n(m)}). Enter i.`,
  answer: [key, f.i],
  hints: ['Reduce each count mod the number of positions first, multiply the two residues and reduce again to get the key position, from 0 to n − 1.',
   'The inverse exists when gcd(key, n) = 1. Run Euclid’s algorithm on n and the key, work back up to write 1 = key × x + n × y, and read x as the inverse, adding or taking away n until it lies from 1 to n − 1.'],
  solution: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)} and ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)}, so the counts are ≡ ${n(rA)} and ${n(rB)} (mod ${n(m)}). ${n(rA)} × ${n(rB)} = ${n(P)}${P < m ? '' : ` = ${n(Math.floor(P / m))} × ${n(m)} + ${n(key)}`}, so the key position is ${n(key)}. Euclid’s algorithm: ${euclidText(m, key)}. The last non-zero remainder is 1, so the inverse exists. Working back up gives ${n(key)} × ${par(f.x0)} + ${n(m)} × ${par(f.y0)} = 1.${f.adjust} So i = ${n(f.i)}. Check: ${n(key)} × ${n(f.i)} = ${n(f.P)} = ${n(f.k)} × ${n(m)} + 1.`,
  guidance: [
   { prompt: `Reduce first. What are the least residues of ${n(A)} and of ${n(B)} mod ${n(m)}?`, answer: [rA, rB], explanation: `${n(A)} = ${n(Math.floor(A / m))} × ${n(m)} + ${n(rA)} and ${n(B)} = ${n(Math.floor(B / m))} × ${n(m)} + ${n(rB)}.` },
   { prompt: `Multiply the two residues and reduce mod ${n(m)}. What is the key position?`, answer: [key], explanation: `${n(rA)} × ${n(rB)} = ${n(P)}${P < m ? ', which is already below ' + n(m) + '.' : ` = ${n(Math.floor(P / m))} × ${n(m)} + ${n(key)}.`}` },
   { prompt: `Run Euclid’s algorithm on ${n(m)} and ${n(key)} and work back up to write ${n(key)}x + ${n(m)}y = 1. What is the inverse i of ${n(key)} mod ${n(m)}, from 1 to ${n(m - 1)}?`, answer: [f.i], explanation: `${euclidText(m, key)}. Back-substitution gives ${n(key)} × ${par(f.x0)} + ${n(m)} × ${par(f.y0)} = 1.${f.adjust} So i = ${n(f.i)}.` }
  ] }; }
});

})();
