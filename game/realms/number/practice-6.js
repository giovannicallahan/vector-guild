/* Number theory: the hidden life of whole numbers practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p6.js. */
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
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[+d]).join('');
const pw = (p, a) => a === 1 ? n(p) : `${n(p)}${sup(a)}`;
const factor = x => { const out = []; for (let p = 2; p * p <= x; p++) { let a = 0; while (x % p === 0) { x /= p; a++; } if (a) out.push([p, a]); } if (x > 1) out.push([x, 1]); return out; };
const fac = f => f.map(([p, a]) => pw(p, a)).join(' × ');
const ipow = (p, a) => { let v = 1; for (let i = 0; i < a; i++) v *= p; return v; };
const powmod = (a, k, m) => { let r = 1 % m, b = a % m; while (k > 0) { if (k % 2) r = r * b % m; b = b * b % m; k = Math.floor(k / 2); } return r; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const phiPP = (p, a) => ipow(p, a) - ipow(p, a - 1);
const phiPPText = (p, a) => a === 1 ? `φ(${n(p)}) = ${n(p)} − 1 = ${n(p - 1)}` : `φ(${pw(p, a)}) = ${n(ipow(p, a))} − ${n(ipow(p, a - 1))} = ${n(phiPP(p, a))}`;
const phi = x => factor(x).reduce((s, [p, a]) => s * phiPP(p, a), 1);
const phiWork = x => { const f = factor(x), v = phi(x);
 if (f.length === 1 && f[0][1] === 1) return `${n(x)} is prime, so φ(${n(x)}) = ${n(x)} − 1 = ${n(v)}`;
 if (f.length === 1) return `${n(x)} = ${fac(f)}, so ${phiPPText(f[0][0], f[0][1])}`;
 return `${n(x)} = ${fac(f)}, so φ(${n(x)}) = ${f.map(([p, a]) => n(phiPP(p, a))).join(' × ')} = ${n(v)}`; };
const sigPP = (p, a) => { let s = 0; for (let i = 0; i <= a; i++) s += ipow(p, i); return s; };
const sigPPText = (p, a) => { const t = []; for (let i = 0; i <= a; i++) t.push(n(ipow(p, i))); return `σ(${pw(p, a)}) = ${t.join(' + ')} = ${n(sigPP(p, a))}`; };
const order = (a, m) => { let v = a % m, k = 1; while (v !== 1 && k <= m) { v = v * a % m; k++; } return k; };
const powList = (a, m, upto) => { const t = []; let v = 1; for (let k = 1; k <= upto; k++) { v = v * a % m; t.push(`${n(a)}${sup(k)} ≡ ${n(v)}`); } return t.join(', '); };
const and = t => t.length < 2 ? t.join('') : `${t.slice(0, -1).join(', ')} and ${t[t.length - 1]}`;
/* Every draw retries at most 1000 times, then falls back to a known-good parameter set (the canonical one). */
const retry = (make, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (p) return p; } return fallback; };
const isPR = (g, p) => order(g, p) === p - 1;
const divisors = x => { const d = []; for (let i = 1; i <= x; i++) if (x % i === 0) d.push(i); return d; };
const SMALL = [11, 13, 17, 19, 23];
/* Working for the order of g mod a prime p: the test powers (p − 1) ÷ q when g is a primitive root, otherwise the divisors of p − 1 in turn. */
const ordWork = (g, p) => { const f = factor(p - 1), tests = f.map(([q]) => (p - 1) / q);
 if (isPR(g, p)) return `${n(p - 1)} = ${fac(f)}, so test the powers ${and(tests.map(n))}: ${tests.map(e => `${n(g)}${sup(e)} ≡ ${n(powmod(g, e, p))}`).join(', ')} (mod ${n(p)}). None of them is 1, so the order of ${n(g)} is ${n(p - 1)}`;
 const k = order(g, p), ds = divisors(p - 1).filter(d => d <= k);
 return `The order divides ${n(p - 1)}, so try its divisors in turn: ${ds.map(d => `${n(g)}${sup(d)} ≡ ${n(powmod(g, d, p))}`).join(', ')} (mod ${n(p)}). The first 1 comes at ${n(k)}, so the order of ${n(g)} is ${n(k)}`; };
const indexOf = (g, p, b) => { let k = 1, v = g % p; while (v !== b && k < p) { v = v * g % p; k++; } return k; };

/* ---- q26 Perfect numbers and Mersenne primes [R4.4] ---- */

/* N from 12 to 999 built from primes up to 13 (a quarter of the time one of 6, 28, 496), p in 2, 3, 5, 7.
   Not the worked example (28 with p = 3) and not the parent's N = 100 with p = 7. */
mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The lamp rota test',
 brief: 'The mast crew flash their lamps in repeating cycles, and the hall wants to know whether a rota is perfect and what the next perfect rota would be.',
 labels: ['sum of the other divisors', 'perfect (1 or 0)', 'perfect number'], tolerance: 0.01,
 gl: [['σ(N)'], ['sum of the other divisors'], ['perfect (1 or 0)'], ['perfect number']]
}, {
 canonical: { N: 120, p: 5 },
 draw: R => retry(() => { const p = R.pick([2, 3, 5, 7]); let N;
  if (R.int(1, 4) === 1) N = R.pick([6, 28, 496]); else { N = R.int(12, 999); const f = factor(N); if (f.some(([q]) => q > 13) || (f.length === 1 && f[0][1] === 1)) N = 0; }
  return !N || (N === 28 && p === 3) || (N === 100 && p === 7) ? null : { N, p }; }, { N: 120, p: 5 }),
 build: ({ N, p }) => { const f = factor(N), s = f.map(([q, a]) => sigPP(q, a)), S = s.reduce((x, y) => x * y, 1), d = S - N, perfect = d === N ? 1 : 0, M = ipow(2, p) - 1, P = ipow(2, p - 1) * M; return {
  prompt: `A lamp group on the signal mast flashes on a cycle of ${n(N)} days, where ${n(N)} = ${fac(f)}. Every divisor of ${n(N)} is a shorter lamp cycle that fits into it exactly. The hall calls the cycle perfect when the shorter cycles (all the divisors of ${n(N)} except ${n(N)} itself) add up to exactly ${n(N)} days. Enter the sum of the divisors of ${n(N)} other than ${n(N)} itself, then 1 if the cycle is perfect and 0 if it is not. Then, for p = ${n(p)}, 2${sup(p)} − 1 is a Mersenne prime: enter the perfect number ${pw(2, p - 1)} × (2${sup(p)} − 1) it gives. Type every answer without commas.`,
  answer: [d, perfect, P],
  hints: ['The divisors other than n itself add up to σ(n) − n. For a prime power add 1, p, p², … up to that power; for powers of different primes, multiply their σ values.', 'The cycle is perfect exactly when that sum equals n. Euclid’s rule: whenever 2ᵖ − 1 is prime, 2ᵖ⁻¹ × (2ᵖ − 1) is perfect, so for the last answer just multiply.'],
  solution: `${f.map(([q, a]) => sigPPText(q, a)).join('; ')}. ${f.length > 1 ? `σ multiplies across powers of different primes, so σ(${n(N)}) = ${s.map(n).join(' × ')} = ${n(S)}` : `So σ(${n(N)}) = ${n(S)}`}. The divisors other than ${n(N)} itself add up to ${n(S)} − ${n(N)} = ${n(d)}, ${perfect ? `which is exactly ${n(N)}, so the cycle is perfect` : `which is not ${n(N)}, so the cycle is not perfect`}. For p = ${n(p)}, 2${sup(p)} − 1 = ${n(M)}, so ${pw(2, p - 1)} × ${n(M)} = ${n(ipow(2, p - 1))} × ${n(M)} = ${n(P)}.`,
  guidance: [
   { prompt: `Add the divisors of each prime power in ${fac(f)} and multiply the results. What is σ(${n(N)})?`, answer: [S], explanation: `${f.map(([q, a]) => sigPPText(q, a)).join('; ')}. ${f.length > 1 ? `Multiplied: ${s.map(n).join(' × ')} = ${n(S)}.` : `So σ(${n(N)}) = ${n(S)}.`}` },
   { prompt: `σ(${n(N)}) counts ${n(N)} itself. Take ${n(N)} away: what do the other divisors add up to?`, answer: [d], explanation: `${n(S)} − ${n(N)} = ${n(d)}.` },
   { prompt: `Is that sum equal to ${n(N)}? Enter 1 for yes and 0 for no.`, answer: [perfect], explanation: perfect ? `${n(d)} equals ${n(N)}, so the cycle is perfect.` : `${n(d)} is not ${n(N)}, so the cycle is not perfect.` },
   { prompt: `What is ${pw(2, p - 1)} × (2${sup(p)} − 1)?`, answer: [P], explanation: `2${sup(p)} − 1 = ${n(M)}, and ${n(ipow(2, p - 1))} × ${n(M)} = ${n(P)}.` }
  ] }; }
});

/* A Mersenne exponent p in 2, 3, 5, 7 and a lamp stock S = k × P + r with k from 3 and r from 1 to P − 1, S below 100000. */
mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Lamps for a perfect display',
 brief: 'The hall has a stock of lamps and wants as many anniversary displays as it can light, each as long as a perfect cycle.',
 labels: ['display length', 'whole displays', 'lamps left over'], tolerance: 0.01,
 gl: [['display length'], ['whole displays'], ['lamps left over']]
}, {
 canonical: { p: 5, k: 4, r: 416 },
 draw: R => { const p = R.pick([2, 3, 5, 7]), P = ipow(2, p - 1) * (ipow(2, p) - 1), kmax = Math.min(15, Math.floor(99999 / P) - 1); return { p, k: R.int(3, kmax), r: R.int(1, P - 1) }; },
 build: ({ p, k, r }) => { const M = ipow(2, p) - 1, P = ipow(2, p - 1) * M, S = k * P + r; return {
  prompt: `The Calendar Hall has ${n(S)} lamps in stock. For its next anniversary the keepers will light displays whose length in days is the perfect number from Euclid’s rule ${pw(2, p - 1)} × (2${sup(p)} − 1), where 2${sup(p)} − 1 is prime. A display uses one lamp for each day of its length, and two displays never share a lamp. Enter the length of one display in days, then how many whole displays the stock can light, then how many lamps are left over. Type every answer without commas.`,
  answer: [P, k, r],
  hints: ['Euclid’s rule: whenever 2ᵖ − 1 is prime, 2ᵖ⁻¹ × (2ᵖ − 1) is a perfect number. Work out 2ᵖ − 1 first, then multiply by 2ᵖ⁻¹.', 'Each display uses as many lamps as it has days. Divide the stock by that length: the whole part of the answer is the number of displays, and what remains is the leftover.'],
  solution: `2${sup(p)} − 1 = ${n(M)}, so a display lasts ${pw(2, p - 1)} × ${n(M)} = ${n(ipow(2, p - 1))} × ${n(M)} = ${n(P)} days and uses ${n(P)} lamps. ${n(k)} displays use ${n(k)} × ${n(P)} = ${n(k * P)} lamps, and one more would need ${n((k + 1) * P)}, which is more than ${n(S)}. So ${n(k)} whole displays can be lit, and ${n(S)} − ${n(k * P)} = ${n(r)} ${r === 1 ? 'lamp is' : 'lamps are'} left over.`,
  guidance: [
   { prompt: `What is ${pw(2, p - 1)} × (2${sup(p)} − 1)? This is the length of one display in days.`, answer: [P], explanation: `2${sup(p)} − 1 = ${n(M)}, and ${n(ipow(2, p - 1))} × ${n(M)} = ${n(P)}.` },
   { prompt: `One display uses ${n(P)} lamps. How many whole displays can ${n(S)} lamps light?`, answer: [k], explanation: `${n(k)} × ${n(P)} = ${n(k * P)} is within ${n(S)}, but ${n(k + 1)} × ${n(P)} = ${n((k + 1) * P)} is not.` },
   { prompt: `How many lamps are left after those ${n(k)} displays?`, answer: [r], explanation: `${n(S)} − ${n(k * P)} = ${n(r)}.` }
  ] }; }
});

/* N from 200 to 5000 built from at least two primes up to 13 (one time in six the perfect number 496). Not 28 or 100. */
mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q09', title: 'Auditing a long cycle',
 brief: 'The record-keeper has a long anniversary cycle written only as a number of days, and the hall needs its divisors counted and added before it can be called perfect or not.',
 labels: ['number of divisors', 'σ(N)', 'σ(N) − 2N'], tolerance: 0.01,
 gl: [['number of divisors'], ['σ(N)'], ['σ(N) − 2N']]
}, {
 canonical: { N: 360 },
 /* One draw in six is the perfect number 496; the rest are built from two or three distinct primes up to 13, each to a power from 1 to 4, kept from 200 to 5000. */
 draw: R => R.int(1, 6) === 1 ? { N: 496 } : retry(() => { const ps = [2, 3, 5, 7, 11, 13].filter(() => R.int(0, 1) === 1); if (ps.length < 2 || ps.length > 3) return null;
  const N = ps.reduce((x, q) => x * q ** R.int(1, 4), 1); return N >= 200 && N <= 5000 ? { N } : null; }, { N: 360 }),
 build: ({ N }) => { const f = factor(N), s = f.map(([q, a]) => sigPP(q, a)), S = s.reduce((x, y) => x * y, 1), t = f.reduce((x, [, a]) => x * (a + 1), 1), d = S - 2 * N; return {
  prompt: `The Calendar Hall’s record-keeper is checking an anniversary cycle of ${n(N)} days. Every divisor of ${n(N)} is a shorter lamp cycle that fits into it exactly. Enter how many divisors ${n(N)} has (counting 1 and ${n(N)} itself), then σ(${n(N)}), the sum of all its divisors, then σ(${n(N)}) − 2 × ${n(N)} (0 means perfect). Type every answer without commas.`,
  answer: [t, S, d],
  hints: ['Factorise the number first. The number of divisors is the product of (exponent + 1) over its prime powers.', 'For σ, add 1, p, p², … up to the power for each prime power and multiply those sums. Then take away twice the number: 0 means perfect, a positive result means the other divisors overshoot.'],
  solution: `${n(N)} = ${fac(f)}. The number of divisors is ${f.map(([, a]) => `(${n(a)} + 1)`).join(' × ')} = ${f.map(([, a]) => n(a + 1)).join(' × ')} = ${n(t)}. ${f.map(([q, a]) => sigPPText(q, a)).join('; ')}, so σ(${n(N)}) = ${s.map(n).join(' × ')} = ${n(S)}. Then σ(${n(N)}) − 2 × ${n(N)} = ${n(S)} − ${n(2 * N)} = ${n(d)}${d === 0 ? ', so the cycle is perfect' : ''}.`,
  guidance: [
   { prompt: `Factorise ${n(N)} into prime powers and add 1 to each exponent. What do the results multiply to? That is the number of divisors.`, answer: [t], explanation: `${n(N)} = ${fac(f)}, so the count is ${f.map(([, a]) => n(a + 1)).join(' × ')} = ${n(t)}.` },
   { prompt: `Add the divisors of each prime power and multiply the sums. What is σ(${n(N)})?`, answer: [S], explanation: `${f.map(([q, a]) => sigPPText(q, a)).join('; ')}. Multiplied: ${s.map(n).join(' × ')} = ${n(S)}.` },
   { prompt: `What is σ(${n(N)}) − 2 × ${n(N)}?`, answer: [d], explanation: `${n(S)} − ${n(2 * N)} = ${n(d)}.` }
  ] }; }
});

/* ---- q27 The order of a mod n [R5.1] ---- */

/* N from 8 to 50, a from 2 to N − 2 coprime to N, order 3 to 12. Not the worked example (2 mod 7) and not the parent's 3 mod 26. */
mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The greenhouse carousel',
 brief: 'A seed tray rides a rotating carousel that moves it by a multiplying rule each night, and the growers need to know when it is back in its first slot.',
 labels: ['φ(n)', 'nights'], tolerance: 0.01,
 gl: [['φ(n)'], ['slot after two nights'], ['nights']]
}, {
 canonical: { N: 21, a: 4 },
 draw: R => retry(() => { const N = R.int(8, 50), a = R.int(2, N - 2); if (gcd(a, N) !== 1 || (N === 26 && a === 3)) return null; const k = order(a, N); return k < 3 || k > 12 ? null : { N, a }; }, { N: 21, a: 4 }),
 build: ({ N, a }) => { const F = phi(N), k = order(a, N), a2 = a * a % N; return {
  prompt: `A greenhouse carousel has ${n(N)} slots, numbered 0 to ${n(N - 1)}. Each night it turns so that a tray in slot x moves to the slot numbered by the remainder of ${n(a)} × x on division by ${n(N)}. A seed tray starts in slot 1, so after k nights it sits in slot ${n(a)}ᵏ mod ${n(N)}. ${n(a)} and ${n(N)} are coprime. Enter φ(${n(N)}), then the fewest nights, at least one, after which the tray is back in slot 1.`,
  answer: [F, k],
  hints: ['Factorise the number of slots and multiply φ of each prime power to get φ. The number of nights always divides that φ, which shortens the list of nights worth trying.', 'Multiply by the step again and again, keeping only the remainder each night, and stop at the first night that shows slot 1.'],
  solution: `${phiWork(N)}. The tray’s slot after each night: ${powList(a, N, k)}. The first night that gives 1 is night ${n(k)}. It divides φ(${n(N)}) = ${n(F)}, as it must.`,
  guidance: [
   { prompt: `What is φ(${n(N)})?`, answer: [F], explanation: `${phiWork(N)}.` },
   { prompt: `Which slot is the tray in after two nights?`, answer: [a2], explanation: `${n(a)} × ${n(a)} = ${n(a * a)}, which leaves remainder ${n(a2)} on division by ${n(N)}.` },
   { prompt: `Keep turning the carousel. After how many nights is the tray first back in slot 1?`, answer: [k], explanation: `${powList(a, N, k)}. The first 1 comes at night ${n(k)}.` }
  ] }; }
});

/* N from 8 to 60, a and b coprime to N, both orders from 2 to 12, neither dividing the other, lcm at most 60. */
mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'Two lamps, one wheel',
 brief: 'Two lamps move round the same wheel by different multiplying steps, and the keepers want the first night on which both are back at their start together.',
 labels: ['nights for lamp A', 'nights for lamp B', 'nights for both'], tolerance: 0.01,
 gl: [['nights for lamp A'], ['nights for lamp B'], ['nights for both']]
}, {
 canonical: { N: 31, a: 2, b: 5 },
 draw: R => retry(() => { const N = R.int(8, 60), a = R.int(2, N - 2), b = R.int(2, N - 2); if (a === b || gcd(a, N) !== 1 || gcd(b, N) !== 1) return null;
  const x = order(a, N), y = order(b, N); if (x < 2 || y < 2 || x > 12 || y > 12 || x % y === 0 || y % x === 0) return null; return x * y / gcd(x, y) > 60 ? null : { N, a, b }; }, { N: 31, a: 2, b: 5 }),
 build: ({ N, a, b }) => { const x = order(a, N), y = order(b, N), L = x * y / gcd(x, y); return {
  prompt: `Two lamps, A and B, share a wheel of ${n(N)} positions numbered 0 to ${n(N - 1)}. Both start at position 1. Each night lamp A moves from position x to the remainder of ${n(a)} × x on division by ${n(N)}, and lamp B does the same with ${n(b)} in place of ${n(a)}. Both ${n(a)} and ${n(b)} are coprime to ${n(N)}. Enter the fewest nights, at least one, after which lamp A is back at 1, then the same for lamp B, then the fewest nights, at least one, after which both lamps are back at 1 on the same night.`,
  answer: [x, y, L],
  hints: ['Each lamp’s return time is the order of its step mod the number of positions: multiply by the step again and again, keeping only remainders, until 1 appears.', 'A lamp is home on night m exactly when m is a multiple of its return time. Both are home together on the smallest night that is a multiple of both return times.'],
  solution: `Lamp A: ${powList(a, N, x)}, so it is home after ${n(x)} nights. Lamp B: ${powList(b, N, y)}, so it is home after ${n(y)} nights. Lamp A is home on multiples of ${n(x)} and lamp B on multiples of ${n(y)}. The first night in both lists is ${n(L)}.`,
  guidance: [
   { prompt: `How many nights until lamp A, stepping by ${n(a)}, is first back at 1?`, answer: [x], explanation: `${powList(a, N, x)}. The first 1 comes at night ${n(x)}.` },
   { prompt: `How many nights until lamp B, stepping by ${n(b)}, is first back at 1?`, answer: [y], explanation: `${powList(b, N, y)}. The first 1 comes at night ${n(y)}.` },
   { prompt: `Lamp A is home on multiples of ${n(x)} and lamp B on multiples of ${n(y)}. What is the first night that is on both lists?`, answer: [L], explanation: `Multiples of ${n(x)}: ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => n(i * x)).join(', ')}, … Multiples of ${n(y)}: ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => n(i * y)).join(', ')}, … The first number in both is ${n(L)}.` }
  ] }; }
});

/* A prime from 29 to 73, a from 2 to p − 2 with order from 4 up, and a number of pulses K from 1000 to 99999 with K mod order at least 2. */
mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q20', title: 'The mirror after many pulses',
 brief: 'A signal mirror has pulsed thousands of times along a prime ring, and the keepers need its cycle length and where it points now without stepping through every pulse.',
 labels: ['pulses to return', 'position after the pulses'], tolerance: 0.01,
 gl: [['pulses to return'], ['K mod order'], ['position after the pulses']]
}, {
 canonical: { p: 41, a: 3, K: 5003 },
 draw: R => retry(() => { const p = R.pick([29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73]), a = R.int(2, p - 2), k = order(a, p), K = R.int(1000, 99999); return k < 4 || K % k < 2 ? null : { p, a, K }; }, { p: 41, a: 3, K: 5003 }),
 build: ({ p, a, K }) => { const k = order(a, p), r = K % k, v = powmod(a, r, p); return {
  prompt: `A signal mirror ring has ${n(p)} positions, numbered 0 to ${n(p - 1)}, and ${n(p)} is prime. Each pulse moves the mirror from position x to the remainder of ${n(a)} × x on division by ${n(p)}. It starts at position 1, so after j pulses it shows ${n(a)}ʲ mod ${n(p)}. Enter the fewest pulses, at least one, that bring the mirror back to 1, then the position the mirror shows after ${n(K)} pulses.`,
  answer: [k, v],
  hints: ['By Fermat’s little theorem the order divides p − 1, so only the divisors of p − 1 need testing. Work each power by repeated squaring and stop at the first one that is 1.', 'The mirror repeats every “order” pulses, so after K pulses it shows the same position as after K mod order pulses. Divide K by the order and keep the remainder.'],
  solution: `${ordWork(a, p)}. The mirror repeats every ${n(k)} pulses. ${n(K)} = ${n(Math.floor(K / k))} × ${n(k)} + ${n(r)}, so after ${n(K)} pulses it shows what it shows after ${n(r)}: ${n(a)}${sup(r)} ≡ ${n(v)} (mod ${n(p)}).`,
  guidance: [
   { prompt: `Try the divisors of ${n(p - 1)} as exponents of ${n(a)}, working mod ${n(p)}. What is the order of ${n(a)} mod ${n(p)}?`, answer: [k], explanation: `${ordWork(a, p)}.` },
   { prompt: `The mirror repeats every ${n(k)} pulses. What is the remainder when ${n(K)} is divided by ${n(k)}?`, answer: [r], explanation: `${n(K)} = ${n(Math.floor(K / k))} × ${n(k)} + ${n(r)}.` },
   { prompt: `What is ${n(a)}${sup(r)} mod ${n(p)}? That is where the mirror points after ${n(K)} pulses.`, answer: [v], explanation: `${n(a)}${sup(r)} ≡ ${n(v)} (mod ${n(p)}).` }
  ] }; }
});

/* ---- q28 Primitive roots [R5.1, R5.2] ---- */

/* A prime p from 11 to 61 and g from 2 to p − 2; half the time g is a primitive root. Not the worked example (3 mod 7) and not 5 mod 23. */
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The seed vault dial',
 brief: 'The seed vault’s dial must turn through every mark before it repeats, and the keepers have a turning step to test.',
 labels: ['g to the (p − 1) ÷ q', 'primitive root (1 or 0)', 'number of primitive roots'], tolerance: 0.01,
 gl: [['g to the (p − 1) ÷ q'], ['primitive root (1 or 0)'], ['number of primitive roots']]
}, {
 canonical: { p: 19, g: 2 },
 draw: R => retry(() => { const p = R.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]), want = R.bool(), g = R.int(2, p - 2); return (p === 23 && g === 5) || isPR(g, p) !== want ? null : { p, g }; }, { p: 19, g: 2 }),
 build: ({ p, g }) => { const f = factor(p - 1), q = f[f.length - 1][0], e = (p - 1) / q, tests = f.map(([r]) => [r, (p - 1) / r, powmod(g, (p - 1) / r, p)]), prim = tests.every(([, , v]) => v !== 1) ? 1 : 0,
  big = powmod(g, e, p), F = phi(p - 1), bad = tests.find(([, , v]) => v === 1); return {
  prompt: `The seed vault’s dial has ${n(p)} marks, and ${n(p)} is prime. One turn moves the dial from mark x to the remainder of ${n(g)} × x on division by ${n(p)}, starting from mark 1. The keepers want the dial to show every mark from 1 to ${n(p - 1)} before it repeats: ${n(g)} must be a primitive root mod ${n(p)}. The largest prime that divides ${n(p - 1)} is ${n(q)}. Enter ${n(g)}${sup(e)} mod ${n(p)}, then 1 if ${n(g)} is a primitive root mod ${n(p)} and 0 if it is not, then how many primitive roots mod ${n(p)} there are among 1 to ${n(p - 1)}.`,
  answer: [big, prim, F],
  hints: ['List the distinct primes q that divide p − 1. The step g is a primitive root exactly when g to the power (p − 1) ÷ q is not 1 for every one of them.', 'A prime p has exactly φ(p − 1) primitive roots, so factorise p − 1 and work out φ of it.'],
  solution: `${n(p - 1)} = ${fac(f)}, so test the powers ${and(tests.map(([, e2]) => n(e2)))}: ${tests.map(([, e2, v]) => `${n(g)}${sup(e2)} ≡ ${n(v)}`).join(', ')} (mod ${n(p)}). ${prim ? `None of them is 1, so the order of ${n(g)} is ${n(p - 1)} and ${n(g)} is a primitive root mod ${n(p)}.` : `${n(g)}${sup(bad[1])} ≡ 1, so the order of ${n(g)} is at most ${n(bad[1])} and ${n(g)} is not a primitive root mod ${n(p)}.`} The number of primitive roots is φ(${n(p - 1)}): ${phiWork(p - 1)}.`,
  guidance: [
   { prompt: `The largest prime dividing ${n(p - 1)} is ${n(q)}, so one test power is ${n(p - 1)} ÷ ${n(q)} = ${n(e)}. What is ${n(g)}${sup(e)} mod ${n(p)}?`, answer: [big], explanation: `By repeated squaring mod ${n(p)}, ${n(g)}${sup(e)} ≡ ${n(big)}.` },
   { prompt: `The prime factors of ${n(p - 1)} give the test powers ${and(tests.map(([, e2]) => n(e2)))}. Is ${n(g)} a primitive root mod ${n(p)}? Enter 1 for yes, 0 for no.`, answer: [prim], explanation: `${tests.map(([, e2, v]) => `${n(g)}${sup(e2)} ≡ ${n(v)}`).join(', ')}. ${prim ? 'None is 1, so yes.' : 'One of them is 1, so no.'}` },
   { prompt: `How many primitive roots does ${n(p)} have? Work out φ(${n(p - 1)}).`, answer: [F], explanation: `${phiWork(p - 1)}.` }
  ] }; }
});

/* A prime p from 11 to 43 and g from 2 to p − 2; half the time g is a primitive root. Not the parent's 5 mod 23. */
mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'How many positions does the lamp reach',
 brief: 'A lamp steps round a prime wheel by a multiplying rule, and the keepers want to know whether it reaches every position, how many it does reach, and how many good steps exist.',
 labels: ['primitive root (1 or 0)', 'positions visited', 'number of primitive roots'], tolerance: 0.01,
 gl: [['primitive root (1 or 0)'], ['positions visited'], ['number of primitive roots']]
}, {
 canonical: { p: 29, g: 4 },
 draw: R => retry(() => { const p = R.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43]), want = R.bool(), g = R.int(2, p - 2); return (p === 23 && g === 5) || isPR(g, p) !== want ? null : { p, g }; }, { p: 29, g: 4 }),
 build: ({ p, g }) => { const k = order(g, p), prim = k === p - 1 ? 1 : 0, F = phi(p - 1), f = factor(p - 1); return {
  prompt: `A lamp on the Calendar Hall’s wheel moves each night from position x to the remainder of ${n(g)} × x on division by ${n(p)}, where ${n(p)} is prime. It starts at position 1. The keepers want it to show every position from 1 to ${n(p - 1)} before it repeats. Enter 1 if ${n(g)} is a primitive root mod ${n(p)} and 0 if it is not. Then enter how many different positions the lamp shows before it first returns to 1 (counting position 1 itself). Then enter how many of the steps from 1 to ${n(p - 1)} would make a lamp show every position.`,
  answer: [prim, k, F],
  hints: ['The lamp shows a position again only when a power of the step comes back to 1, so the number of different positions is the order of the step. The order divides p − 1; a primitive root is a step whose order is p − 1.', 'A prime p has exactly φ(p − 1) primitive roots. Factorise p − 1 and work out φ of it.'],
  solution: `${ordWork(g, p)}. ${prim ? `So ${n(g)} is a primitive root mod ${n(p)} and the lamp shows all ${n(k)} positions.` : `That is less than ${n(p - 1)}, so ${n(g)} is not a primitive root, and the lamp shows only ${n(k)} different positions.`} The number of steps that would show every position is φ(${n(p - 1)}): ${phiWork(p - 1)}.`,
  guidance: [
   { prompt: `${n(p - 1)} = ${fac(f)}. Test ${n(g)} to the power ${n(p - 1)} divided by each prime factor, mod ${n(p)}. Is ${n(g)} a primitive root? Enter 1 for yes, 0 for no.`, answer: [prim], explanation: `${f.map(([q]) => `${n(g)}${sup((p - 1) / q)} ≡ ${n(powmod(g, (p - 1) / q, p))}`).join(', ')}. ${prim ? 'None is 1, so yes.' : 'One of them is 1, so no.'}` },
   { prompt: `How many different positions does the lamp show before it first returns to 1? This is the order of ${n(g)} mod ${n(p)}.`, answer: [k], explanation: `${ordWork(g, p)}.` },
   { prompt: `How many steps from 1 to ${n(p - 1)} are primitive roots mod ${n(p)}? Work out φ(${n(p - 1)}).`, answer: [F], explanation: `${phiWork(p - 1)}.` }
  ] }; }
});

/* A prime p from 31 to 97 (p − 1 with two or three different prime factors) and g from 2 to p − 2; half the time g is a primitive root. */
mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q19', title: 'A bigger wheel to test',
 brief: 'The hall is extending its wheel to a larger prime, and the keepers must test a candidate step with repeated squaring before they trust it.',
 labels: ['number of test powers', 'primitive root (1 or 0)', 'number of primitive roots'], tolerance: 0.01,
 gl: [['number of test powers'], ['primitive root (1 or 0)'], ['number of primitive roots']]
}, {
 canonical: { p: 43, g: 3 },
 draw: R => retry(() => { const p = R.pick([31, 37, 41, 43, 53, 61, 67, 71, 73, 79, 89, 97]), want = R.bool(), g = R.int(2, p - 2); return isPR(g, p) !== want ? null : { p, g }; }, { p: 43, g: 3 }),
 build: ({ p, g }) => { const f = factor(p - 1), tests = f.map(([q]) => [q, (p - 1) / q, powmod(g, (p - 1) / q, p)]), prim = tests.every(([, , v]) => v !== 1) ? 1 : 0, F = phi(p - 1), bad = tests.find(([, , v]) => v === 1); return {
  prompt: `The Calendar Hall is extending its wheel to ${n(p)} positions, and ${n(p)} is prime. A lamp steps from position x to the remainder of ${n(g)} × x on division by ${n(p)}, starting at 1. The keepers want it to show every position from 1 to ${n(p - 1)} before it repeats. Enter how many different primes divide ${n(p - 1)}, then 1 if ${n(g)} is a primitive root mod ${n(p)} and 0 if it is not, then how many primitive roots mod ${n(p)} there are among 1 to ${n(p - 1)}.`,
  answer: [f.length, prim, F],
  hints: ['Factorise p − 1. Each different prime q that divides it gives one test: work out g to the power (p − 1) ÷ q mod p by repeated squaring, and g is a primitive root exactly when none of the tests gives 1.', 'A prime p has exactly φ(p − 1) primitive roots.'],
  solution: `${n(p - 1)} = ${fac(f)}, which has ${n(f.length)} different primes, so there are ${n(f.length)} test powers: ${and(tests.map(([, e]) => n(e)))}. ${tests.map(([, e, v]) => `${n(g)}${sup(e)} ≡ ${n(v)}`).join(', ')} (mod ${n(p)}). ${prim ? `None of them is 1, so ${n(g)} is a primitive root mod ${n(p)}.` : `${n(g)}${sup(bad[1])} ≡ 1, so the order of ${n(g)} is at most ${n(bad[1])} and ${n(g)} is not a primitive root mod ${n(p)}.`} The number of primitive roots is φ(${n(p - 1)}): ${phiWork(p - 1)}.`,
  guidance: [
   { prompt: `Factorise ${n(p - 1)}. How many different primes divide it?`, answer: [f.length], explanation: `${n(p - 1)} = ${fac(f)}, so ${n(f.length)} different primes divide it, and there are ${n(f.length)} test powers.` },
   { prompt: `The test powers are ${and(tests.map(([, e]) => n(e)))}. Work each ${n(g)} power mod ${n(p)} by repeated squaring. Is ${n(g)} a primitive root? Enter 1 for yes, 0 for no.`, answer: [prim], explanation: `${tests.map(([, e, v]) => `${n(g)}${sup(e)} ≡ ${n(v)}`).join(', ')}. ${prim ? 'None is 1, so yes.' : 'One of them is 1, so no.'}` },
   { prompt: `How many primitive roots does ${n(p)} have? Work out φ(${n(p - 1)}).`, answer: [F], explanation: `${phiWork(p - 1)}.` }
  ] }; }
});

/* ---- q29 Chapter review: the index of a number [R5.1] ---- */

/* p from 11 to 23, g a primitive root mod p, b and c different, from 2 to p − 1 and not g. Not the parent's 13 mod 17 (base 3). */
mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Which hour lights the beacon',
 brief: 'A ring of relay beacons is lit one per hour by a multiplying rule, and the crew need the hour at which two particular beacons shine.',
 labels: ['index of the first beacon', 'index of the second beacon'], tolerance: 0.01,
 gl: [['index of the first beacon'], ['index of the second beacon']]
}, {
 canonical: { p: 19, g: 2, b: 14, c: 11 },
 draw: R => retry(() => { const p = R.pick(SMALL), g = R.int(2, p - 2), b = R.int(2, p - 1), c = R.int(2, p - 1); return isPR(g, p) && b !== g && c !== g && b !== c && !(p === 17 && g === 3 && (b === 13 || c === 13)) ? { p, g, b, c } : null; }, { p: 19, g: 2, b: 14, c: 11 }),
 build: ({ p, g, b, c }) => { const kb = indexOf(g, p, b), kc = indexOf(g, p, c), top = Math.max(kb, kc); return {
  prompt: `A ring of relay beacons is numbered 1 to ${n(p - 1)}, and ${n(p)} is prime. Each hour the lit beacon changes: if beacon x is lit now, the beacon numbered by the remainder of ${n(g)} × x on division by ${n(p)} is lit next. The ring starts with beacon 1 lit at hour 0, so at hour k beacon ${n(g)}ᵏ mod ${n(p)} is lit. ${n(g)} is a primitive root mod ${n(p)}, so every beacon is lit at exactly one hour k from 1 to ${n(p - 1)}: that hour is the index of the beacon. Enter the index of beacon ${n(b)}, then the index of beacon ${n(c)}.`,
  answer: [kb, kc],
  hints: ['Multiply by the step again and again, keeping only the remainder mod p, and count the hours until the beacon you want appears. Start counting with the step itself as hour 1.', 'One list of powers is enough for both beacons: carry on past the first one until the second appears.'],
  solution: `Powers of ${n(g)} mod ${n(p)}: ${powList(g, p, top)}. Beacon ${n(b)} is lit at hour ${n(kb)} and beacon ${n(c)} at hour ${n(kc)}, so their indexes are ${n(kb)} and ${n(kc)}.`,
  guidance: [
   { prompt: `Write the powers of ${n(g)} mod ${n(p)} one hour at a time. At which hour is beacon ${n(b)} lit?`, answer: [kb], explanation: `${powList(g, p, kb)}, so the index of ${n(b)} is ${n(kb)}.` },
   { prompt: `Carry on until beacon ${n(c)} appears. At which hour is it lit?`, answer: [kc], explanation: `${powList(g, p, kc)}, so the index of ${n(c)} is ${n(kc)}.` }
  ] }; }
});

/* p from 11 to 23, g a primitive root mod p, b and c different, from 2 to p − 1 and not g. Not the parent's 13 mod 17 (base 3). */
mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Days between two flashes',
 brief: 'A lamp flashes a different position each day, round and round, and the keepers need to know how long to wait from one particular flash to another.',
 labels: ['index of today’s position', 'index of the later position', 'days to wait'], tolerance: 0.01,
 gl: [['index of today’s position'], ['index of the later position'], ['days to wait']]
}, {
 canonical: { p: 17, g: 5, b: 12, c: 14 },
 draw: R => retry(() => { const p = R.pick(SMALL), g = R.int(2, p - 2), b = R.int(2, p - 1), c = R.int(2, p - 1); return isPR(g, p) && b !== g && c !== g && b !== c && !(p === 17 && g === 3 && (b === 13 || c === 13)) ? { p, g, b, c } : null; }, { p: 17, g: 5, b: 12, c: 14 }),
 build: ({ p, g, b, c }) => { const kb = indexOf(g, p, b), kc = indexOf(g, p, c), d = ((kc - kb) % (p - 1) + (p - 1)) % (p - 1), top = Math.max(kb, kc); return {
  prompt: `A lamp on the Calendar Hall’s wheel of ${n(p)} positions (${n(p)} is prime) starts at position 1 on day 0. Each day it moves from position x to the remainder of ${n(g)} × x on division by ${n(p)}, so on day k it shows ${n(g)}ᵏ mod ${n(p)}. Since ${n(g)} is a primitive root mod ${n(p)}, the lamp shows each position from 1 to ${n(p - 1)} exactly once in every run of ${n(p - 1)} days, and the whole pattern then repeats. Today the lamp shows position ${n(b)}, and the keepers want to know when it will next show position ${n(c)}, which is a different position from today’s. Enter the day number k (from 1 to ${n(p - 1)}) on which the lamp shows ${n(b)}, then the day number k on which it shows ${n(c)}, then how many days from today until it next shows ${n(c)}, if the lamp goes round to the start of the run when it has to.`,
  answer: [kb, kc, d],
  hints: ['Multiply by the step again and again, keeping only remainders, and count the days until each position appears. The step itself is day 1.', 'If the second day number is larger, the wait is the difference. If it is smaller, the lamp must first finish the run of p − 1 days and start again, so add p − 1 to the difference.'],
  solution: `Powers of ${n(g)} mod ${n(p)}: ${powList(g, p, top)}. Position ${n(b)} is shown on day ${n(kb)} and position ${n(c)} on day ${n(kc)}. ${kc > kb ? `${n(kc)} is later than ${n(kb)} in the run, so the wait is ${n(kc)} − ${n(kb)} = ${n(d)} ${d === 1 ? 'day' : 'days'}.` : `${n(kc)} comes earlier in the run than ${n(kb)}, so the lamp first goes round: the wait is ${n(kc)} − ${n(kb)} + ${n(p - 1)} = ${n(d)} ${d === 1 ? 'day' : 'days'}.`}`,
  guidance: [
   { prompt: `Write the powers of ${n(g)} mod ${n(p)} one day at a time. On which day number is position ${n(b)} shown?`, answer: [kb], explanation: `${powList(g, p, kb)}, so position ${n(b)} is shown on day ${n(kb)}.` },
   { prompt: `On which day number is position ${n(c)} shown?`, answer: [kc], explanation: `${powList(g, p, kc)}, so position ${n(c)} is shown on day ${n(kc)}.` },
   { prompt: `Today is day ${n(kb)} of the run and position ${n(c)} is on day ${n(kc)}. A run lasts ${n(p - 1)} days. How many days must the keepers wait?`, answer: [d], explanation: kc > kb ? `${n(kc)} − ${n(kb)} = ${n(d)}.` : `${n(kc)} is earlier in the run, so go round: ${n(kc)} − ${n(kb)} + ${n(p - 1)} = ${n(d)}.` }
  ] }; }
});

/* p from 13 to 31, g a primitive root mod p, b and c different and not 1; half the time b to the x reaches c (gcd(index of b, p − 1) divides the index of c). */
mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q16', title: 'Steps until a second lamp lands',
 brief: 'A second lamp steps by a different multiplier, and the keepers use the index of each position to find out whether and when it reaches a target.',
 labels: ['index of b', 'index of c', 'nights'], tolerance: 0.01,
 gl: [['index of b'], ['index of c'], ['nights']]
}, {
 canonical: { p: 19, g: 2, b: 8, c: 12 },
 draw: R => retry(() => { const p = R.pick([13, 17, 19, 23, 29, 31]), g = R.int(2, p - 2), b = R.int(2, p - 1), c = R.int(2, p - 1); if (!isPR(g, p) || b === c) return null;
  const ok = indexOf(g, p, c) % gcd(indexOf(g, p, b), p - 1) === 0; return ok === R.bool() ? { p, g, b, c } : null; }, { p: 19, g: 2, b: 8, c: 12 }),
 build: ({ p, g, b, c }) => { const kb = indexOf(g, p, b), kc = indexOf(g, p, c), m = p - 1, h = gcd(kb, m); let x = 0; for (let j = 1; j <= m; j++) if (powmod(b, j, p) === c) { x = j; break; }
  return {
  prompt: `The Calendar Hall’s wheel has ${n(p)} positions, and ${n(p)} is prime. ${n(g)} is a primitive root mod ${n(p)}, so every position from 1 to ${n(p - 1)} is ${n(g)}ᵏ mod ${n(p)} for exactly one k from 1 to ${n(p - 1)}: its index. A second lamp starts at position 1 and each night moves from position x to the remainder of ${n(b)} × x on division by ${n(p)}, so after j nights it shows ${n(b)}ʲ mod ${n(p)}. Enter the index of ${n(b)}, then the index of ${n(c)}, then the fewest nights j, at least one, after which the second lamp shows position ${n(c)} (enter 0 if it never does).`,
  answer: [kb, kc, x],
  hints: ['Find each index by listing powers of g mod p. If the index of b is s and the index of c is t, then bʲ ≡ c exactly when s × j ≡ t (mod p − 1), because g has order p − 1.', 'A congruence s × j ≡ t (mod m) has solutions exactly when gcd(s, m) divides t. Then the solutions repeat every m ÷ gcd(s, m), and the fewest nights is the smallest positive one.'],
  solution: `Powers of ${n(g)} mod ${n(p)}: ${powList(g, p, Math.max(kb, kc))}. So the index of ${n(b)} is ${n(kb)} and the index of ${n(c)} is ${n(kc)}. ${n(b)}ʲ ≡ ${n(c)} exactly when ${n(kb)} × j ≡ ${n(kc)} (mod ${n(m)}). gcd(${n(kb)}, ${n(m)}) = ${n(h)}, ${x ? `which divides ${n(kc)}, so there are solutions, repeating every ${n(m)} ÷ ${n(h)} = ${n(m / h)}. The smallest positive one is j = ${n(x)}: ${n(kb)} × ${n(x)} = ${n(kb * x)}${kb * x < m ? '' : ` ≡ ${n(kb * x % m)} (mod ${n(m)})`}.` : `which does not divide ${n(kc)}, so there is no solution: the second lamp never shows ${n(c)}, and the answer is 0.`}`,
  guidance: [
   { prompt: `List the powers of ${n(g)} mod ${n(p)}. What is the index of ${n(b)}?`, answer: [kb], explanation: `${powList(g, p, kb)}, so the index of ${n(b)} is ${n(kb)}.` },
   { prompt: `What is the index of ${n(c)}?`, answer: [kc], explanation: `${powList(g, p, kc)}, so the index of ${n(c)} is ${n(kc)}.` },
   { prompt: `Solve ${n(kb)} × j ≡ ${n(kc)} (mod ${n(m)}) for the smallest positive j. Enter 0 if there is no solution.`, answer: [x], explanation: x ? `gcd(${n(kb)}, ${n(m)}) = ${n(h)} divides ${n(kc)}. The smallest positive j is ${n(x)}, since ${n(kb)} × ${n(x)} = ${n(kb * x)}${kb * x === kc ? '' : ` ≡ ${n(kc)} (mod ${n(m)})`}.` : `gcd(${n(kb)}, ${n(m)}) = ${n(h)} does not divide ${n(kc)}, so there is no solution.` }
  ] }; }
});

/* ---- q30 Quadratic residues [R5.4] ---- */

/* An odd prime p from 13 to 43 and a from 1 to p − 1; half the time a is a square mod p. Not the worked example (5 mod 11) and not the parent's 17 mod 19. */
mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The rangefinder dial',
 brief: 'The surveyors’ rangefinder squares its setting and shows only the remainder, and they need every setting that points at a given mark.',
 labels: ['number of settings', 'smallest setting', 'largest setting'], tolerance: 0.01,
 gl: [['number of settings'], ['smallest setting'], ['largest setting']]
}, {
 canonical: { p: 23, a: 13 },
 draw: R => retry(() => { const p = R.pick([13, 17, 19, 23, 29, 31, 37, 41, 43]); let a;
  if (R.bool()) { const x = R.int(1, (p - 1) / 2); a = x * x % p; } else { a = R.int(1, p - 1); if (powmod(a, (p - 1) / 2, p) === 1) return null; }
  return p === 19 && a === 17 ? null : { p, a }; }, { p: 23, a: 13 }),
 build: ({ p, a }) => { const h = (p - 1) / 2, sq = []; let x = 0; for (let i = 1; i <= h; i++) { const v = i * i % p; sq.push(`${n(i)}² ≡ ${n(v)}`); if (v === a && !x) x = i; }
  const count = x ? 2 : 0, big = x ? p - x : 0; return {
  prompt: `The Survey Field’s rangefinder dial has ${n(p)} marks, numbered 0 to ${n(p - 1)}, and ${n(p)} is prime. A setting x from 1 to ${n(p - 1)} makes the pointer show mark x² mod ${n(p)}. Enter how many settings x point at mark ${n(a)}, then the smallest such setting, then the largest such setting (enter 0 for both if there are none).`,
  answer: [count, x, big],
  hints: ['Square only 1 to (p − 1) ÷ 2 and reduce mod p: the settings p − x and x show the same mark, so the other half adds nothing new.', 'For an odd prime p, a mark is shown by no setting or by exactly two, x and p − x, so the largest setting is p minus the smallest.'],
  solution: `Squares mod ${n(p)}: ${sq.join(', ')}. ${x ? `Mark ${n(a)} appears at x = ${n(x)}, so the two settings are ${n(x)} and ${n(p)} − ${n(x)} = ${n(p - x)}: the smallest is ${n(x)} and the largest is ${n(p - x)}.` : `Mark ${n(a)} is not in the list, and the other half of the settings repeats the list, so no setting shows mark ${n(a)}: the answers are 0, 0 and 0.`}`,
  guidance: [
   { prompt: `Square 1 to ${n(h)} and reduce mod ${n(p)}. How many settings x point at mark ${n(a)}?`, answer: [count], explanation: `${sq.join(', ')}. ${x ? `Mark ${n(a)} is there, so there are two settings, x and ${n(p)} − x.` : `Mark ${n(a)} is not there, so there are none.`}` },
   { prompt: `What is the smallest setting? Enter 0 if there is none.`, answer: [x], explanation: x ? `${n(x)}² ≡ ${n(a)}, and the other setting, ${n(p - x)}, is larger.` : `No square leaves remainder ${n(a)}, so the answer is 0.` },
   { prompt: `What is the largest setting? Enter 0 if there is none.`, answer: [big], explanation: x ? `It is ${n(p)} − ${n(x)} = ${n(p - x)}.` : `There is no setting, so the answer is 0.` }
  ] }; }
});

/* p from 13 to 31 and three different real stakes r1, r2, r3 from 1 to p − 1, each written in the log as r + p × (1 to 6). */
mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Flags that a square plot can reach',
 brief: 'The crew’s logbook lists three flag stakes in numbers that run round the ring more than once, and the crew must find which of them a square plot can reach.',
 labels: ['real stake of the first flag', 'flags a square plot can reach', 'smallest side for the first flag'], tolerance: 0.01,
 gl: [['real stake of the first flag'], ['flags a square plot can reach'], ['smallest side for the first flag']]
}, {
 canonical: { p: 17, r1: 13, r2: 5, r3: 15, m1: 3, m2: 2, m3: 4 },
 draw: R => retry(() => { const p = R.pick([13, 17, 19, 23, 29, 31]), r1 = R.int(1, p - 1), r2 = R.int(1, p - 1), r3 = R.int(1, p - 1); return r1 === r2 || r1 === r3 || r2 === r3 ? null : { p, r1, r2, r3, m1: R.int(1, 6), m2: R.int(1, 6), m3: R.int(1, 6) }; }, { p: 17, r1: 13, r2: 5, r3: 15, m1: 3, m2: 2, m3: 4 }),
 build: ({ p, r1, r2, r3, m1, m2, m3 }) => { const A = [r1 + p * m1, r2 + p * m2, r3 + p * m3], h = (p - 1) / 2, sq = [], seen = new Set(); let x = 0;
  for (let i = 1; i <= h; i++) { const v = i * i % p; sq.push(`${n(i)}² ≡ ${n(v)}`); seen.add(v); if (v === r1 && !x) x = i; }
  const hit = [r1, r2, r3].filter(r => seen.has(r)), count = hit.length; return {
  prompt: `The Survey Field’s ring has ${n(p)} stakes, numbered 0 to ${n(p - 1)}, and ${n(p)} is prime. The logbook asks for flags at stake numbers ${n(A[0])}, ${n(A[1])} and ${n(A[2])}, but the log counts round the ring more than once: the real stake is the remainder on division by ${n(p)}. A square plot with whole side x rods, x from 1 to ${n(p - 1)}, puts its corner flag on stake x² mod ${n(p)}. Enter the real stake of the first flag (${n(A[0])}), then how many of the three real stakes some square plot can reach, then the smallest side x that reaches the first flag (0 if none does).`,
  answer: [r1, count, x],
  hints: ['Divide each logged number by p and keep the remainder: that is the real stake.', 'Square 1 to (p − 1) ÷ 2 and reduce mod p. A stake can be reached exactly when it appears in that list, and the smallest side for a stake is the first x that gives it.'],
  solution: `${n(A[0])} = ${n(m1)} × ${n(p)} + ${n(r1)}, ${n(A[1])} = ${n(m2)} × ${n(p)} + ${n(r2)} and ${n(A[2])} = ${n(m3)} × ${n(p)} + ${n(r3)}, so the real stakes are ${n(r1)}, ${n(r2)} and ${n(r3)}. Squares mod ${n(p)}: ${sq.join(', ')}. ${count === 0 ? 'None of the real stakes is in the list' : `${and(hit.map(n))} ${hit.length > 1 ? 'are' : 'is'} in the list`}, so ${n(count)} of the three can be reached. ${x ? `Stake ${n(r1)} first appears at x = ${n(x)}, so the smallest side for the first flag is ${n(x)}.` : `Stake ${n(r1)} is not in the list, so no side reaches the first flag: the answer is 0.`}`,
  guidance: [
   { prompt: `What is the remainder when ${n(A[0])} is divided by ${n(p)}? That is the real stake of the first flag.`, answer: [r1], explanation: `${n(A[0])} = ${n(m1)} × ${n(p)} + ${n(r1)}, so the real stake is ${n(r1)}.` },
   { prompt: `The other real stakes are ${n(r2)} and ${n(r3)}. Square 1 to ${n(h)} and reduce mod ${n(p)}. How many of the three real stakes (${n(r1)}, ${n(r2)}, ${n(r3)}) appear in your list?`, answer: [count], explanation: `${sq.join(', ')}. ${count === 0 ? 'None of the three appears.' : `${and(hit.map(n))} ${hit.length > 1 ? 'appear' : 'appears'}.`}` },
   { prompt: `What is the smallest side x whose square leaves remainder ${n(r1)} mod ${n(p)}? Enter 0 if there is none.`, answer: [x], explanation: x ? `${n(x)}² ≡ ${n(r1)} (mod ${n(p)}), and no smaller side does.` : `Stake ${n(r1)} is not in the list, so no side works.` }
  ] }; }
});

/* Two odd primes p < q from 5 to 19 and a from m + 1 to 3000 with a not a multiple of p or q; a is a square mod both primes about half the time. */
mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q18', title: 'A ring of two prime lengths',
 brief: 'The survey ring is being joined from two prime-length rings, and the surveyors must count the plot sides that land on a target stake in each ring and in the joined one.',
 labels: ['solutions mod p', 'solutions mod q', 'solutions mod pq'], tolerance: 0.01,
 gl: [['solutions mod p'], ['solutions mod q'], ['solutions mod pq']]
}, {
 canonical: { p: 7, q: 13, a: 79 },
 draw: R => retry(() => { const p = R.pick([5, 7, 11, 13]), q = R.pick([7, 11, 13, 17, 19]); if (q <= p) return null; const a = R.int(p * q + 1, 3000); if (a % p === 0 || a % q === 0) return null;
  const sp = powmod(a, (p - 1) / 2, p) === 1, sq = powmod(a, (q - 1) / 2, q) === 1, want = R.int(1, 4); return (want <= 2 ? sp && sq : want === 3 ? sp !== sq : !sp && !sq) ? { p, q, a } : null; }, { p: 7, q: 13, a: 79 }),
 build: ({ p, q, a }) => { const m = p * q, rp = a % p, rq = a % q, cnt = (r, pr) => { let c = 0; for (let x = 0; x < pr; x++) if (x * x % pr === r) c++; return c; }, cp = cnt(rp, p), cq = cnt(rq, q), tot = cp * cq,
  sqList = (pr, r) => { const t = []; for (let i = 1; i <= (pr - 1) / 2; i++) t.push(`${n(i)}² ≡ ${n(i * i % pr)}`); return `Squares mod ${n(pr)}: ${t.join(', ')}. ${n(r)} ${cnt(r, pr) ? 'is' : 'is not'} in the list`; }; return {
  prompt: `The Survey Field joins two rings of stakes, one of ${n(p)} stakes and one of ${n(q)} stakes (${n(p)} and ${n(q)} are both prime), into one ring of ${n(m)} stakes. A plot of side x puts its flag on stake x² mod ${n(m)}. The target stake is written as ${n(a)}, counting round the ring more than once. Enter how many x from 0 to ${n(p - 1)} satisfy x² ≡ ${n(a)} (mod ${n(p)}), then how many x from 0 to ${n(q - 1)} satisfy x² ≡ ${n(a)} (mod ${n(q)}), then how many x from 0 to ${n(m - 1)} satisfy x² ≡ ${n(a)} (mod ${n(m)}). A solution mod ${n(p)} and a solution mod ${n(q)} together fix exactly one solution mod ${n(m)} (Chinese remainder theorem).`,
  answer: [cp, cq, tot],
  hints: ['Reduce the target mod each prime first, then square the whole numbers from 1 up to half of p − 1 and reduce mod p: the target has two solutions mod p if its remainder is in the list, and none if it is not.', 'Every solution mod p can be paired with every solution mod q, and each pair gives exactly one solution mod pq by the Chinese remainder theorem. So the counts multiply.'],
  solution: `${n(a)} leaves remainder ${n(rp)} mod ${n(p)} and ${n(rq)} mod ${n(q)}. ${sqList(p, rp)}, so there ${cp ? 'are 2 solutions' : 'are no solutions'} mod ${n(p)}. ${sqList(q, rq)}, so there ${cq ? 'are 2 solutions' : 'are no solutions'} mod ${n(q)}. Each solution mod ${n(p)} pairs with each solution mod ${n(q)} to give one solution mod ${n(m)}, so the number mod ${n(m)} is ${n(cp)} × ${n(cq)} = ${n(tot)}.`,
  guidance: [
   { prompt: `What is ${n(a)} mod ${n(p)}, and how many x from 0 to ${n(p - 1)} satisfy x² ≡ ${n(a)} (mod ${n(p)})? Enter the count.`, answer: [cp], explanation: `${n(a)} leaves remainder ${n(rp)}. ${sqList(p, rp)}, so the count is ${n(cp)}.` },
   { prompt: `What is ${n(a)} mod ${n(q)}, and how many x from 0 to ${n(q - 1)} satisfy x² ≡ ${n(a)} (mod ${n(q)})? Enter the count.`, answer: [cq], explanation: `${n(a)} leaves remainder ${n(rq)}. ${sqList(q, rq)}, so the count is ${n(cq)}.` },
   { prompt: `Each solution mod ${n(p)} pairs with each solution mod ${n(q)} to give one solution mod ${n(m)}. How many solutions are there mod ${n(m)}?`, answer: [tot], explanation: `${n(cp)} × ${n(cq)} = ${n(tot)}.` }
  ] }; }
});

})();
