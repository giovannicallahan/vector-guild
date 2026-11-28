/* Logic and proof mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Small number tools. sup(7) is '⁷'. */
const isPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const leastDiv = x => { for (let d = 2; d * d <= x; d++) if (x % d === 0) return d; return x; };
const sup = s => String(s).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const list = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

/* q31: the claimed-prime expressions. quad n² + n + c, lin an + b, pow 2ⁿ + c. */
const E31 = {
 quad: p => ({ text: `n² + n + ${n(p.c)}`, at: i => `${n(i)}² + ${n(i)} + ${n(p.c)}`, val: i => i * i + i + p.c }),
 lin: p => ({ text: `${n(p.a)}n + ${n(p.b)}`, at: i => `${n(p.a)} × ${n(i)} + ${n(p.b)}`, val: i => p.a * i + p.b }),
 pow: p => ({ text: `2ⁿ + ${n(p.c)}`, at: i => `2${sup(i)} + ${n(p.c)}`, val: i => Math.pow(2, i) + p.c })
};
const first31 = e => { for (let i = 1; ; i++) if (!isPrime(e.val(i))) return i; };
/* Every quad c (1 … 150), pow c (odd, 1 … 199) and lin a, b (a even 2 … 30, b odd 1 … 49) whose smallest counterexample is at
   least 2 (quad, pow) or 3 (lin) and whose divisor there is at most 13 (the primes the hint lists). Left out: c = 41
   (q16's n² − n + 41 family) and the worked example 4n + 3. */
const POOL31 = { quad: [], pow: [], lin: [] };
const ok31 = (f, p, min) => { const e = E31[f](p), k = first31(e); return k >= min && leastDiv(e.val(k)) <= 13; };
for (let c = 1; c <= 150; c++) if (c !== 41 && ok31('quad', { c }, 2)) POOL31.quad.push({ f: 'quad', a: 0, b: 0, c });
for (let c = 1; c <= 199; c += 2) if (ok31('pow', { c }, 2)) POOL31.pow.push({ f: 'pow', a: 0, b: 0, c });
for (let a = 2; a <= 30; a += 2) for (let b = 1; b <= 49; b += 2) if (!(a === 4 && b === 3) && ok31('lin', { a, b }, 3)) POOL31.lin.push({ f: 'lin', a, b, c: 0 });

/* q32: the smallest witness above c. mult: a and b both divide it; twin: p and p + d both prime; sq: a square number that a divides. */
const W32 = {
 mult: p => { let m = (Math.floor(p.c / p.a) + 1) * p.a; const tried = [m]; while (m % p.b) { m += p.a; tried.push(m); } return { w: m, tried }; },
 twin: p => { let m = p.c + 1; while (!isPrime(m)) m++; const tried = [m]; while (!isPrime(m + p.d)) { m++; while (!isPrime(m)) m++; tried.push(m); } return { w: m, tried }; },
 sq: p => { let r = Math.floor(Math.sqrt(p.c)) + 1; while (r * r <= p.c) r++; const tried = [r]; while ((r * r) % p.a) { r++; tried.push(r); } return { w: r * r, tried }; }
};

/* q33: the three if-and-only-if claims. L is the left side, R the right side; forward is "if L then R". */
const C33 = {
 sq: () => ({ L: 'n² is even', R: 'n is even', notL: 'n² is odd', notR: 'n is odd', count: N => Math.floor(N / 2), which: 'the even numbers',
  fwdArg: 'Suppose n is odd, so n = 2k + 1 for a whole number k. Then n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, which is odd. So when n is not even, n² is not even.', fwdContra: true,
  bwdArg: 'Suppose n is even, so n = 2k for a whole number k. Then n² = 4k² = 2(2k²), which is even.' }),
 lin: ({ a, b }) => ({ L: `${n(a)}n + ${n(b)} is even`, R: 'n is odd', notL: `${n(a)}n + ${n(b)} is odd`, notR: 'n is even', count: N => Math.floor((N + 1) / 2), which: 'the odd numbers',
  fwdArg: `Suppose n is even, so n = 2k for a whole number k. Then ${n(a)}n + ${n(b)} = ${n(2 * a)}k + ${n(b)} = 2(${n(a)}k + ${n((b - 1) / 2)}) + 1, which is odd. So when n is not odd, ${n(a)}n + ${n(b)} is not even.`, fwdContra: true,
  bwdArg: `Suppose n is odd, so n = 2k + 1 for a whole number k. Then ${n(a)}n + ${n(b)} = ${n(2 * a)}k + ${n(a + b)} = 2(${n(a)}k + ${n((a + b) / 2)}), which is even.` }),
 div: ({ a, b }) => { const s = a * b; return { L: `${n(a)} divides n`, R: `${n(a)} divides n + ${n(s)}`, count: N => Math.floor(N / a), which: `the multiples of ${n(a)}`,
  fwdArg: `Suppose ${n(a)} divides n, so n = ${n(a)}k for a whole number k. Then n + ${n(s)} = ${n(a)}k + ${n(s)} = ${n(a)}(k + ${n(b)}), so ${n(a)} divides n + ${n(s)}.`, fwdContra: false,
  bwdArg: `Suppose ${n(a)} divides n + ${n(s)}, so n + ${n(s)} = ${n(a)}k for a whole number k. Then n = ${n(a)}k − ${n(s)} = ${n(a)}(k − ${n(b)}), so ${n(a)} divides n.` }; }
};

/* q34: five flawed proofs. Each gives its claim, its steps and the first wrong step; v = 1 adds one sound step
   before the wrong one, so the wrong step moves down by one. */
const F34 = {
 zero: (p, v) => { const k = p.k, s = [`Let a = ${n(k)} and b = ${n(k)}, so a = b.`, 'Multiply both sides of a = b by a: a² = ab.'];
  if (v) s.push('Subtract b² from both sides: a² − b² = ab − b².', 'Factor both sides: (a + b)(a − b) = b(a − b).'); else s.push('Subtract b² from both sides and factor: (a + b)(a − b) = b(a − b).');
  s.push('Divide both sides by a − b: a + b = b.', `Put in the numbers: ${n(2 * k)} = ${n(k)}, and dividing by ${n(k)} gives 2 = 1.`);
  return { claim: '2 = 1', steps: s, wrong: 4 + v, why: `divides by a − b, which is ${n(k)} − ${n(k)} = 0` }; },
 conv: (p, v) => { const pq = p.p * p.q, s = [`Let n be a multiple of ${n(p.p)}, so n = ${n(p.p)}k for some whole number k.`];
  if (v) s.push(`Note that ${n(pq)} = ${n(p.p)} × ${n(p.q)}.`);
  s.push(`Every multiple of ${n(pq)} is a multiple of ${n(p.p)}, since ${n(pq)}j = ${n(p.p)} × ${n(p.q)}j.`, `So n, being a multiple of ${n(p.p)}, is a multiple of ${n(pq)}.`, `Therefore every multiple of ${n(p.p)} is a multiple of ${n(pq)}. ∎`);
  return { claim: `every multiple of ${n(p.p)} is a multiple of ${n(pq)}`, steps: s, wrong: 3 + v, why: `uses the converse of the step before it: every multiple of ${n(pq)} is a multiple of ${n(p.p)}, but not the other way round, since ${n(p.p)} itself is not a multiple of ${n(pq)}` }; },
 ex: (p, v) => { const e = 2 + v, s = [];
  for (let i = 1; i <= e; i++) s.push(`n = ${n(i)} gives ${n(i * i + i + p.c)}, which is prime.`);
  s.push('The claim holds in every case tried, so it holds for every whole number n. ∎');
  return { claim: `n² + n + ${n(p.c)} is prime for every whole number n`, steps: s, wrong: e + 1, why: `treats ${n(e)} checked examples as a proof for every n; in fact n = ${n(p.c - 1)} gives ${n(p.c * p.c)} = ${n(p.c)} × ${n(p.c)}` }; },
 root: (p, v) => { const k = p.k, s = [`Both (−${n(k)})² and ${n(k)}² equal ${n(k * k)}, so (−${n(k)})² = ${n(k)}².`];
  if (v) s.push('If two numbers are equal, their squares are equal.');
  s.push(`The squares are equal, so the numbers are equal: −${n(k)} = ${n(k)}.`, `Adding ${n(k)} to both sides gives 0 = ${n(2 * k)}.`);
  return { claim: `−${n(k)} = ${n(k)}`, steps: s, wrong: 2 + v, why: 'uses the converse of “equal numbers have equal squares”: equal squares do not make equal numbers, since a number and its negative have the same square' }; },
 divx: (p, v) => { const r = p.r, s = [`Start from x² = ${n(r)}x.`];
  if (v) s.push(`Write both sides as products: x × x = ${n(r)} × x.`);
  s.push(`Divide both sides by x: x = ${n(r)}.`, `So x = ${n(r)} is the only solution. ∎`);
  return { claim: `the only number x with x² = ${n(r)}x is x = ${n(r)}`, steps: s, wrong: 2 + v, why: `divides by x, which may be 0; x = 0 also solves x² = ${n(r)}x, since both sides are then 0` }; }
};
const steps34 = s => s.map((t, i) => `(${i + 1}) ${t}`).join(' ');
const sound34 = w => w === 2 ? 'step 1 is sound' : w === 3 ? 'steps 1 and 2 are sound' : `steps 1 to ${n(w - 1)} are sound`;

/* Sum formulas proved by induction (q36, q37, q40). term(i) is the i-th term; S(m) the total of the first m terms;
   termAt(i) and Sat(m) show the working. step is the algebra of the inductive step (q36). */
const SUMS = {
 odd: { formula: '1 + 3 + 5 + … + (2n − 1) = n²', last: '2n − 1', term: i => 2 * i - 1, S: m => m * m,
  termAt: i => `2 × ${n(i)} − 1 = ${n(2 * i - 1)}`, Sat: m => `${n(m)}² = ${n(m * m)}`, step: 'k² + (2k + 1) = (k + 1)²' },
 nat: { formula: '1 + 2 + 3 + … + n = n(n + 1) ÷ 2', last: 'n', term: i => i, S: m => m * (m + 1) / 2,
  termAt: i => `${n(i)}`, Sat: m => `${n(m)} × ${n(m + 1)} ÷ 2 = ${n(m * (m + 1) / 2)}`, step: 'k(k + 1) ÷ 2 + (k + 1) = (k + 1)(k + 2) ÷ 2' },
 even: { formula: '2 + 4 + 6 + … + 2n = n(n + 1)', last: '2n', term: i => 2 * i, S: m => m * (m + 1),
  termAt: i => `2 × ${n(i)} = ${n(2 * i)}`, Sat: m => `${n(m)} × ${n(m + 1)} = ${n(m * (m + 1))}`, step: 'k(k + 1) + 2(k + 1) = (k + 1)(k + 2)' },
 three: { formula: '1 + 4 + 7 + … + (3n − 2) = n(3n − 1) ÷ 2', last: '3n − 2', term: i => 3 * i - 2, S: m => m * (3 * m - 1) / 2,
  termAt: i => `3 × ${n(i)} − 2 = ${n(3 * i - 2)}`, Sat: m => `${n(m)} × ${n(3 * m - 1)} ÷ 2 = ${n(m * (3 * m - 1) / 2)}`, step: 'k(3k − 1) ÷ 2 + (3k + 1) = (k + 1)(3k + 2) ÷ 2' },
 pow: { formula: '1 + 2 + 4 + … + 2ⁿ⁻¹ = 2ⁿ − 1', last: '2ⁿ⁻¹', term: i => Math.pow(2, i - 1), S: m => Math.pow(2, m) - 1,
  termAt: i => `2${sup(i - 1)} = ${n(Math.pow(2, i - 1))}`, Sat: m => `2${sup(m)} − 1 = ${n(Math.pow(2, m) - 1)}`, step: '(2ᵏ − 1) + 2ᵏ = 2ᵏ⁺¹ − 1' },
 sq: { formula: '1² + 2² + 3² + … + n² = n(n + 1)(2n + 1) ÷ 6', last: 'n²', term: i => i * i, S: m => m * (m + 1) * (2 * m + 1) / 6,
  termAt: i => `${n(i)}² = ${n(i * i)}`, Sat: m => `${n(m)} × ${n(m + 1)} × ${n(2 * m + 1)} ÷ 6 = ${n(m * (m + 1) * (2 * m + 1) / 6)}` },
 cube: { formula: '1³ + 2³ + 3³ + … + n³ = (n(n + 1) ÷ 2)²', last: 'n³', term: i => i * i * i, S: m => Math.pow(m * (m + 1) / 2, 2),
  termAt: i => `${n(i)}³ = ${n(i * i * i)}`, Sat: m => `(${n(m)} × ${n(m + 1)} ÷ 2)² = ${n(m * (m + 1) / 2)}² = ${n(Math.pow(m * (m + 1) / 2, 2))}` }
};

/* q35: the first n with cⁿ > an + b. Once it holds it keeps holding: cⁿ > an + b >= a, so each step adds more on the left. */
const first35 = ({ c, a, b }) => { for (let i = 1; ; i++) if (Math.pow(c, i) > a * i + b) return i; };
/* q38: the smallest N from which aⁿ > c·nᵇ holds at every n >= N (checked 80 steps further). */
const good38 = ({ a, b, c }) => { const ok = i => Math.pow(a, i) > c * Math.pow(i, b); for (let i = 1; i < 60; i++) { let all = true; for (let j = i; j < i + 80; j++) if (!ok(j)) { all = false; break; } if (all) return i; } return -1; };
/* Every (a, b, c), c from the list below, with N >= 3, both sides below 100000 at N, and the right side's growth factor ((N + 1) ÷ N)ᵇ below a,
   leaving out the worked example 3ⁿ > n³. */
const POOL38 = [];
for (const a of [2, 3, 4, 5]) for (const b of [2, 3, 4]) for (const c of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25, 30, 40, 50]) {
 const N = good38({ a, b, c }); if (N < 3 || (a === 3 && b === 3 && c === 1)) continue;
 if (Math.pow(a, N) >= 100000 || Math.pow((N + 1) / N, b) >= a) continue; POOL38.push({ a, b, c });
}
const rhs38 = (c, b) => `${c === 1 ? '' : n(c)}n${sup(b)}`;
const rhsAt38 = (c, b, i) => c === 1 ? `${n(i)}${sup(b)}` : `${n(c)} × ${n(i)}${sup(b)}`;

/* q39: one way to pay m with x stamps of a and y of b, or null. */
const pay = (m, a, b) => { for (let y = 0; y * b <= m; y++) if ((m - y * b) % a === 0) return [(m - y * b) / a, y]; return null; };
const payText = (m, a, b) => { const [x, y] = pay(m, a, b), parts = [];
 if (x) parts.push(x === 1 ? n(a) : `${n(x)} × ${n(a)}`); if (y) parts.push(y === 1 ? n(b) : `${n(y)} × ${n(b)}`); return `${n(m)} = ${parts.join(' + ')}`; };
const gcd = (x, y) => y ? gcd(y, x % y) : x;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Smallest n >= 1 at which the expression is not prime. Families and constants chosen so the counterexample is at
    least 2 (quad, pow) or 3 (lin): POOL31. */
 q31: {
  canonical: { f: 'quad', a: 0, b: 0, c: 11 },
  draw: R => ({ ...R.pick(POOL31[R.pick(['quad', 'lin', 'pow'])]) }),
  build: p => { const e = E31[p.f](p), k = first31(e), v = e.val(k), d = leastDiv(v), before = [];
   for (let i = 1; i < k; i++) before.push(n(e.val(i)));
   const early = k === 2 ? `n = 1 gives ${before[0]}, which is prime.` : k === 3 ? `n = 1 and 2 give ${list(before)}, both prime.` : `n = 1 to ${n(k - 1)} give ${list(before)}, all prime.`;
   return {
   prompt: `A note on the Inquiry Office board claims: “For every whole number n from 1 up, ${e.text} is prime.” A prime is a whole number above 1 that no whole number divides except 1 and itself. Disprove the claim. Enter the smallest counterexample n, then the value of ${e.text} at that n, then the smallest whole number above 1 that divides that value.`,
   answer: [k, v, d],
   hints: [`Work out ${e.text} for n = 1, 2, 3 and so on, and test each value for a divisor other than 1 and itself.`, 'For each value, try dividing by 2, 3, 5, 7, 11 and 13 in turn. The first value that one of them divides exactly, without being that value itself, is not prime.'],
   solution: `${early} n = ${n(k)} gives ${e.at(k)} = ${n(v)}, and ${n(v)} = ${n(d)} × ${n(v / d)}, so it is not prime. One failing case is enough to disprove a claim about every n, so n = ${n(k)} is the smallest counterexample. The value there is ${n(v)}, and the smallest whole number above 1 that divides it is ${n(d)}.`,
   guidance: [
    { prompt: `Work out ${e.text} for n = 1, 2 and 3. Enter the three values.`, answer: [e.val(1), e.val(2), e.val(3)], explanation: `${e.at(1)} = ${n(e.val(1))}, ${e.at(2)} = ${n(e.val(2))} and ${e.at(3)} = ${n(e.val(3))}.` },
    { prompt: 'Keep going, testing each value for a divisor. At which n is the value first not prime, and what is the value there?', answer: [k, v], explanation: `${early} At n = ${n(k)} the value is ${n(v)}, which is not prime.` },
    { prompt: `${n(v)} is not prime. What is the smallest whole number above 1 that divides it?`, answer: [d], explanation: `${n(v)} = ${n(d)} × ${n(v / d)}, and no smaller whole number above 1 divides ${n(v)}.` }
   ] }; }
 },
 /* The smallest witness above c (W32). The worked example (4 and 6 above 50) is left out. */
 q32: {
  canonical: { f: 'mult', a: 6, b: 10, c: 100, d: 0 },
  /* Redrawn until the first candidate fails, so the search has at least two steps. */
  draw: R => { const one = () => { const f = R.pick(['mult', 'twin', 'sq']);
    if (f === 'mult') { const [a, b] = R.pick([[4, 10], [6, 9], [6, 10], [6, 8], [8, 12], [9, 12], [10, 15], [4, 6], [12, 18]]); return { f, a, b, c: R.int(60, 300), d: 0 }; }
    if (f === 'twin') return { f, a: 0, b: 0, c: R.int(20, 150), d: R.pick([2, 4, 6]) };
    return { f, a: R.pick([8, 12, 18, 20, 27, 28, 45, 50]), b: 0, c: R.int(50, 600), d: 0 }; };
   let p; do { p = one(); } while (W32[p.f](p).tried.length < 2); return p; },
  build: p => { const { w, tried } = W32[p.f](p), c = n(p.c); let claim, cand, h1, sol, first, firstExpl, def = '';
   if (p.f === 'mult') {
    claim = `there is a whole number greater than ${c} that both ${n(p.a)} and ${n(p.b)} divide`;
    h1 = `List the numbers above ${c} that ${n(p.a)} divides, in order, and test each one: does ${n(p.b)} divide it too?`;
    cand = `What is the first number above ${c} that ${n(p.a)} divides?`; first = tried[0];
    firstExpl = `${n(p.a)} × ${n(first / p.a - 1)} = ${n(first - p.a)} is not above ${c}, so the first multiple of ${n(p.a)} above ${c} is ${n(p.a)} × ${n(first / p.a)} = ${n(first)}.`;
    sol = `The numbers above ${c} that ${n(p.a)} divides are ${list(tried.map(n))}, and so on. ${tried.length > 1 ? `${n(p.b)} does not divide ${list(tried.slice(0, -1).map(n)).replace(/ and (?=[^ ]+$)/, ' or ')}, but it divides ${n(w)}` : `${n(p.b)} divides the first of them`}: ${n(w)} = ${n(p.a)} × ${n(w / p.a)} = ${n(p.b)} × ${n(w / p.b)}.`;
   } else if (p.f === 'twin') {
    claim = `there is a prime p greater than ${c} for which p + ${n(p.d)} is also prime`;
    /* q32 can be reached before q30 teaches primes, so the prompt says what a prime is and how to test one (every number here is below 23 × 23). */
    def = ' A prime is a whole number above 1 that no whole number divides except 1 and itself. To test a number, try dividing it by 2, 3, 5, 7, 11, 13, 17 and 19 in turn, and stop once the divisor times itself is bigger than the number: if none of them divides it exactly, it is prime.';
    h1 = `List the primes above ${c} in order, and for each one test whether p + ${n(p.d)} is prime too.`;
    cand = `What is the first prime above ${c}?`; first = tried[0];
    firstExpl = `Testing ${c} + 1, ${c} + 2 and so on for divisors, the first prime above ${c} is ${n(first)}.`;
    sol = `The primes above ${c} in order: ${tried.map(q => { const s = q + p.d; return isPrime(s) ? `${n(q)}, with ${n(q)} + ${n(p.d)} = ${n(s)}, which is prime` : `${n(q)}, with ${n(q)} + ${n(p.d)} = ${n(s)} = ${n(leastDiv(s))} × ${n(s / leastDiv(s))}, not prime`; }).join('; ')}.`;
   } else {
    claim = `there is a square number greater than ${c} that ${n(p.a)} divides`;
    h1 = `A square number is a whole number times itself, such as 49 = 7 × 7. List the square numbers above ${c} in order and test each one: does ${n(p.a)} divide it?`;
    cand = `What is the first square number above ${c}?`; first = tried[0] * tried[0];
    firstExpl = `${n(tried[0] - 1)}² = ${n((tried[0] - 1) * (tried[0] - 1))} is not above ${c}, but ${n(tried[0])}² = ${n(first)} is.`;
    sol = `The square numbers above ${c} are ${list(tried.map(r => `${n(r)}² = ${n(r * r)}`))}, and so on. ${tried.length > 1 ? `${n(p.a)} does not divide the ones before ${n(w)}, but` : 'The first of them already works:'} ${n(w)} = ${n(p.a)} × ${n(w / p.a)}.`;
   }
   return {
   prompt: `The council doubts this storage rule can ever be met: “${claim}.”${def} An existence proof only has to show one such number, a witness, and check it. Find the smallest witness and enter it.`,
   answer: [w],
   hints: [h1, 'Stop at the first number that passes the test. That number is the witness, and checking it is the whole proof.'],
   solution: `${sol} So ${n(w)} is the smallest witness. Showing it and checking it proves that ${claim}.`,
   guidance: [
    { prompt: cand, answer: [first], explanation: firstExpl },
    { prompt: 'Test the candidates in order, starting there. Which is the first one that passes?', answer: [w], explanation: `${sol} So the smallest witness is ${n(w)}.` }
   ] }; }
 },
 /* f: 'sq' (n² even ↔ n even), 'lin' (an + b even ↔ n odd; a, b odd, b >= 3), 'div' (a divides n ↔ a divides
    n + ab). fwd 1: the argument proves "if L then R" (for sq and lin through the contrapositive); fwd 0: "if R then L".
    swap 0 lists the forward direction first, swap 1 the backward one. Counts are over n = 1 … N. */
 q33: {
  canonical: { f: 'sq', a: 0, b: 0, fwd: 1, swap: 1, N: 30 },
  draw: R => { const f = R.pick(['sq', 'lin', 'div']), p = { f, a: 0, b: 0, fwd: R.int(0, 1), swap: R.int(0, 1), N: R.int(20, 60) };
   if (f === 'lin') { p.a = R.pick([3, 5, 7, 9]); p.b = R.pick([3, 5, 7, 9]); }
   if (f === 'div') { p.a = R.int(3, 7); p.b = R.int(2, 4); }
   return p; },
  build: p => { const C = C33[p.f](p), N = p.N, fw = `If ${C.L}, then ${C.R}`, bw = `If ${C.R}, then ${C.L}`,
   items = p.swap ? [bw, fw] : [fw, bw], idx = p.fwd ? (p.swap ? 2 : 1) : (p.swap ? 1 : 2), cnt = C.count(N),
   arg = p.fwd ? C.fwdArg : C.bwdArg, proved = p.fwd ? fw : bw;
   const how = p.fwd && C.fwdContra
    ? `The argument supposes “${C.notR}” and concludes “${C.notL}”. That is the contrapositive of “${fw}”, which says the same thing, so the argument proves that direction: number ${idx}.`
    : `The argument supposes “${p.fwd ? C.L : C.R}” and concludes “${p.fwd ? C.R : C.L}”, so it proves “${proved}”: direction number ${idx}.`;
   const counts = `For n from 1 to ${n(N)}, “${C.L}” is true for ${n(cnt)} numbers, ${C.which}, and “${C.R}” is true for the same ${n(cnt)} numbers, as an if-and-only-if claim requires.`;
   return {
   prompt: `The Inquiry Office is checking the claim: “For every whole number n, ${C.L} if and only if ${C.R}.” Its two directions are: 1. ${items[0]}. 2. ${items[1]}. An investigator hands in this argument: “${arg}” Enter the number of the direction this argument proves. Then, for n from 1 to ${n(N)}, enter how many n make “${C.L}” true, and then how many make “${C.R}” true.`,
   answer: [idx, cnt, cnt],
   hints: ['Read what the argument supposes at the start and what it reaches at the end. An argument that supposes the opposite of one side and reaches the opposite of the other is proving a contrapositive.', 'An if-and-only-if claim says both directions hold, so its two sides are true for exactly the same numbers. Count one side; the other must give the same count.'],
   solution: `${how} The other direction needs its own argument before the claim is proved. ${counts}`,
   guidance: [
    { prompt: 'Which direction does the argument prove? Enter its number from the list.', answer: [idx], explanation: how },
    { prompt: `For n from 1 to ${n(N)}, how many n make “${C.L}” true?`, answer: [cnt], explanation: `“${C.L}” is true exactly for ${C.which}, and there are ${n(cnt)} of them from 1 to ${n(N)}.` },
    { prompt: `And how many n from 1 to ${n(N)} make “${C.R}” true?`, answer: [cnt], explanation: counts }
   ] }; }
 },
 /* Two flawed proofs, A and B, of different kinds from F34; va and vb add one sound step before the wrong one.
    k feeds zero and root, p and q conv, c ex (11 or 17, prime for n up to 9), r divx. */
 q34: {
  canonical: { A: 'zero', B: 'conv', va: 1, vb: 0, k: 4, p: 3, q: 2, c: 11, r: 5 },
  draw: R => { const kinds = ['zero', 'conv', 'ex', 'root', 'divx'], A = R.pick(kinds); let B; do { B = R.pick(kinds); } while (B === A);
   const [p, q] = R.pick([[2, 2], [2, 3], [3, 2], [3, 3], [5, 2], [2, 5]]);
   return { A, B, va: R.int(0, 1), vb: R.int(0, 1), k: R.int(2, 9), p, q, c: R.pick([11, 17]), r: R.int(2, 9) }; },
  build: p => { const a = F34[p.A](p, p.va), b = F34[p.B](p, p.vb); return {
   prompt: `Two investigators each hand in a proof, and both conclusions are false. Proof A, that ${a.claim}: ${steps34(a.steps)} Proof B, that ${b.claim}: ${steps34(b.steps)} Enter the number of the first wrong step in proof A, then in proof B.`,
   answer: [a.wrong, b.wrong],
   hints: ['Check the steps one at a time. Is each one true for the numbers in play, and does it follow from the steps before it?', 'Look for a division by something that may be 0, an “if … then” rule used backwards, and a conclusion drawn from a few examples.'],
   solution: `Proof A: ${sound34(a.wrong)}, but step ${n(a.wrong)} ${a.why}. Proof B: ${sound34(b.wrong)}, but step ${n(b.wrong)} ${b.why}. Every step after a wrong one inherits the error, so the first wrong steps are ${n(a.wrong)} in proof A and ${n(b.wrong)} in proof B.`,
   guidance: [
    { prompt: 'Proof A: which is the first step that is false or does not follow from the steps before it?', answer: [a.wrong], explanation: `In proof A, ${sound34(a.wrong)}, but step ${n(a.wrong)} ${a.why}.` },
    { prompt: 'Proof B: which is the first step that is false or does not follow?', answer: [b.wrong], explanation: `In proof B, ${sound34(b.wrong)}, but step ${n(b.wrong)} ${b.why}.` }
   ] }; }
 },
 /* cⁿ > an + b, first true at N from 3 to 7, so the base case cannot be n = 1. Not the worked example 3ⁿ > 4n + 2. */
 q35: {
  canonical: { c: 2, a: 3, b: 4 },
  draw: R => { let p, N; do { p = { c: R.pick([2, 2, 3]), a: R.int(2, 12), b: R.int(1, 12) }; N = first35(p); } while (N < 3 || N > 7 || (p.c === 3 && p.a === 4 && p.b === 2)); return p; },
  build: ({ c, a, b }) => { const N = first35({ c, a, b }), rows = [];
   for (let i = 1; i <= N; i++) { const L = Math.pow(c, i), Rt = a * i + b; rows.push(`n = ${n(i)}: ${n(L)} against ${n(Rt)}, ${L > Rt ? 'true' : 'false'}`); }
   const claim = `${n(c)}ⁿ > ${n(a)}n + ${n(b)}`; return {
   prompt: `Mira’s claim about the lamps of the Long Stair is that ${claim} for every whole number n from some step on. Before an induction proof can start, it needs a base case where the claim really holds. Enter the left side and the right side at n = 1, then the first whole number n at which the claim is true.`,
   answer: [c, a + b, N],
   hints: [`At n = 1 the left side is ${n(c)}¹ and the right side is ${n(a)} × 1 + ${n(b)}.`, 'Raise n by 1 at a time and compare the two sides. The first n where the left side is bigger is where the base case goes.'],
   solution: `${rows.join('; ')}. The claim fails at n = 1, where the left side is ${n(c)} and the right side ${n(a + b)}, so the proof cannot start there. It first holds at n = ${n(N)}, so that is the base case, the first domino. The inductive step then shows that each true case makes the next one true, so the claim holds for every n from ${n(N)} on.`,
   guidance: [
    { prompt: 'Work out both sides at n = 1. Enter the left side, then the right side.', answer: [c, a + b], explanation: `${n(c)}¹ = ${n(c)} and ${n(a)} × 1 + ${n(b)} = ${n(a + b)}.` },
    { prompt: 'Is the claim true at n = 1? Enter 1 for true or 0 for false.', answer: [0], explanation: `${n(c)} is not bigger than ${n(a + b)}, so the claim is false at n = 1 and the base case cannot go there.` },
    { prompt: 'Try n = 2, 3 and so on. What is the first n where the left side is bigger?', answer: [N], explanation: `${rows.join('; ')}. The first true case is n = ${n(N)}.` }
   ] }; }
 },
 /* The inductive step of a sum formula at n = k: total up to k, the term for k + 1, the total up to k + 1. */
 q36: {
  canonical: { f: 'odd', k: 7 },
  draw: R => { const f = R.pick(['odd', 'nat', 'even', 'three', 'pow']); return { f, k: f === 'pow' ? R.int(4, 14) : R.int(4, 30) }; },
  build: ({ f, k }) => { const F = SUMS[f], Sk = F.S(k), t = F.term(k + 1), S1 = Sk + t; return {
   prompt: `An induction proof on the Long Stair is under way for the formula ${F.formula}. In the inductive step, the inductive hypothesis assumes the formula is true for n = k. Take k = ${n(k)}. Enter the sum up to n = ${n(k)} given by the formula, then the amount added to reach n = ${n(k + 1)}, then the total at n = ${n(k + 1)} (type them without commas).`,
   answer: [Sk, t, S1],
   hints: [`The amount added is the next term of the sum: put n = ${n(k + 1)} into the last term, ${F.last}.`, `Add that term to the sum up to n = ${n(k)}. The result should match the formula at n = ${n(k + 1)}; showing that it always does is the inductive step.`],
   solution: `By the formula, the sum up to n = ${n(k)} is ${F.Sat(k)}. The next term, for n = ${n(k + 1)}, is ${F.termAt(k + 1)}. So the total at n = ${n(k + 1)} is ${n(Sk)} + ${n(t)} = ${n(S1)}, and the formula at n = ${n(k + 1)} gives ${F.Sat(k + 1)} as well. The same algebra works for every k, ${F.step}, and that is the inductive step.`,
   guidance: [
    { prompt: `Use the formula at n = ${n(k)}. What is the sum up to n = ${n(k)}?`, answer: [Sk], explanation: `The inductive hypothesis lets us use the formula at n = ${n(k)}: ${F.Sat(k)}.` },
    { prompt: `What is the term added for n = ${n(k + 1)}?`, answer: [t], explanation: `The last term is ${F.last}; for n = ${n(k + 1)} it is ${F.termAt(k + 1)}.` },
    { prompt: `Add them. What is the total at n = ${n(k + 1)}?`, answer: [S1], explanation: `${n(Sk)} + ${n(t)} = ${n(S1)}, which matches the formula: ${F.Sat(k + 1)}.` }
   ] }; }
 },
 /* A proved sum formula used at a large n, and its next term. Ranges keep every total below 100000. */
 q37: {
  canonical: { f: 'odd', n: 40 },
  draw: R => { const f = R.pick(['odd', 'nat', 'even', 'sq', 'cube']), hi = { odd: 300, nat: 400, even: 300, sq: 60, cube: 24 }[f];
   let m; do { m = R.int(f === 'cube' ? 8 : 15, hi); } while ((f === 'nat' && m === 12) || (f === 'odd' && m === 30)); return { f, n: m }; },
  build: ({ f, n: m }) => { const F = SUMS[f], S = F.S(m), t = F.term(m + 1); return {
   prompt: `This formula has been proved by induction, so it holds for every whole number n: ${F.formula}. The crew needs the total for a flight of ${n(m)} steps. Enter the sum for n = ${n(m)} (type it without commas), then the next term of the sum, the one for n = ${n(m + 1)}.`,
   answer: [S, t],
   hints: [`There is no need to add ${n(m)} terms one by one: put n = ${n(m)} into the right side of the formula.`, `The next term is the last term of the sum, ${F.last}, with n replaced by ${n(m + 1)}.`],
   solution: `The formula holds for every n, so put n = ${n(m)} into its right side: ${F.Sat(m)}. Adding the ${n(m)} terms one by one would give the same total, only much more slowly. The next term, for n = ${n(m + 1)}, is ${F.termAt(m + 1)}.`,
   guidance: [
    { prompt: `Put n = ${n(m)} into the right side of the formula. What is the sum?`, answer: [S], explanation: F.Sat(m) + '.' },
    { prompt: `What is the term for n = ${n(m + 1)}?`, answer: [t], explanation: `The last term is ${F.last}, so for n = ${n(m + 1)} it is ${F.termAt(m + 1)}.` }
   ] }; }
 },
 /* aⁿ > c·nᵇ from POOL38: N is the smallest n from which it holds for good. */
 q38: {
  canonical: { a: 2, b: 2, c: 1 },
  draw: R => R.pick(POOL38),
  build: ({ a, b, c }) => { const N = good38({ a, b, c }), L = i => Math.pow(a, i), Rt = i => c * Math.pow(i, b), ok = i => L(i) > Rt(i), rows = [];
   for (let i = 1; i <= N + 1; i++) rows.push(`n = ${n(i)}: ${n(L(i))} against ${n(Rt(i))}, ${ok(i) ? 'true' : 'false'}`);
   const claim = `${n(a)}ⁿ > ${rhs38(c, b)}`, early = []; for (let i = 1; i < N; i++) if (ok(i)) early.push(n(i));
   const t1 = ok(1) ? 1 : 0, t2 = ok(2) ? 1 : 0; return {
   prompt: `Two power demands race up the Long Stair, and Mira wants to prove ${claim} by induction. It is false for some small n. Find the smallest whole number N from which it holds for good: true at N and at every whole number after N. Enter N, then the left side at N, then the right side at N (type them without commas).`,
   answer: [N, L(N), Rt(N)],
   hints: ['Make a table of both sides for n = 1, 2, 3 and so on. Careful: the inequality may be true for a small n, fail for a while, and only then hold for good.', `Each step multiplies the left side by ${n(a)}, while the right side grows by a factor that gets closer and closer to 1. Being ahead once is not enough: the left side stays ahead only from a point where it is ahead and the right side’s factor is below ${n(a)}.`],
   solution: `${rows.join('; ')}. ${early.length ? `It is true at n = ${list(early)}, but it fails after that, so the start is later.` : 'It fails at every n before the start.'} From n = ${n(N)} on it is true: ${n(a)}${sup(N)} = ${n(L(N))} is more than ${rhsAt38(c, b, N)} = ${n(Rt(N))}. From there each step multiplies the left side by ${n(a)} and the right side by (n + 1)${sup(b)} ÷ n${sup(b)}. From n = ${n(N)} on, that factor is at most ${n(N + 1)}${sup(b)} ÷ ${n(N)}${sup(b)} = ${n(Math.pow(N + 1, b))} ÷ ${n(Math.pow(N, b))}, which is less than ${n(a)}, and it shrinks as n grows, so the left side stays ahead; that is the inductive step, and N = ${n(N)} is the base case.`,
   guidance: [
    { prompt: 'Is the inequality true at n = 1? And at n = 2? Enter 1 for true or 0 for false for each.', answer: [t1, t2], explanation: `${rows[0]}; ${rows[1]}.` },
    { prompt: 'Keep going. What is the smallest N from which the left side stays bigger at every step?', answer: [N], explanation: `${rows.join('; ')}. From n = ${n(N)} on, the left side stays ahead.` },
    { prompt: `Enter both sides at n = ${n(N)}: the left side, then the right side.`, answer: [L(N), Rt(N)], explanation: `${n(a)}${sup(N)} = ${n(L(N))} and ${rhsAt38(c, b, N)} = ${n(Rt(N))}.` }
   ] }; }
 },
 /* Two stamp values a < b with no common factor: F = ab − a − b is the largest amount that cannot be paid,
    and the amounts F + 1 … F + a are the a base cases. Not the worked example (4 and 5). */
 q39: {
  canonical: { a: 3, b: 5 },
  /* a from 3 to 7, b up to 13, with the largest unpayable amount at most 50 so the list stays short. */
  draw: R => { let p; do { p = { a: R.int(3, 7) }; p.b = R.int(p.a + 1, 13); } while (gcd(p.a, p.b) !== 1 || p.a * p.b - p.a - p.b > 50 || (p.a === 4 && p.b === 5)); return p; },
  build: ({ a, b }) => { const F = a * b - a - b, no = [], base = [];
   for (let m = 1; m <= F; m++) if (!pay(m, a, b)) no.push(n(m));
   for (let m = F + 1; m <= F + a; m++) base.push(payText(m, a, b));
   return {
   prompt: `The relay post at the foot of the Long Stair sells only ${n(a)}-credit and ${n(b)}-credit stamps, and any number of each may go on a parcel. Mira wants to prove by strong induction that every amount above some point can be paid exactly. Enter the largest amount that cannot be paid. Then enter how many base cases the strong induction needs, when its step pays each larger amount by adding one ${n(a)}-credit stamp to an amount already paid.`,
   answer: [F, a],
   hints: [`List the amounts 1, 2, 3 and so on, and mark each one that can be made from ${n(a)}s and ${n(b)}s. Look for a run of amounts in a row that can all be paid, as long as the smaller stamp value.`, 'Once that many amounts in a row can be paid, every larger amount can be too: take the amount one small stamp below it and add one small stamp. Each amount in that first run is a base case.'],
   solution: `The amounts that cannot be paid are ${list(no)}. The next ${n(a)} amounts can all be paid: ${list(base)}. These are the base cases. Strong induction: any larger amount m is ${n(a)} more than m − ${n(a)}, an amount from ${n(F + 1)} up that can be paid by the hypothesis, so m can be paid with one more ${n(a)}-credit stamp. So ${n(F)} is the largest amount that cannot be paid, and ${n(a)} base cases are needed. For two stamp values with no common factor this always comes to ${n(a)} × ${n(b)} − ${n(a)} − ${n(b)} = ${n(F)}.`,
   guidance: [
    { prompt: 'List the amounts that cannot be paid. How many are there?', answer: [no.length], explanation: `They are ${list(no)}: ${n(no.length)} amounts.` },
    { prompt: 'What is the largest of them?', answer: [F], explanation: `${n(F)} cannot be paid, and the ${n(a)} amounts after it can: ${list(base)}.` },
    { prompt: `The inductive step goes back ${n(a)} credits at a time. How many amounts in a row, just above ${n(F)}, must be checked as base cases?`, answer: [a], explanation: `Each larger amount leans on the one ${n(a)} below it, so each of the ${n(a)} amounts from ${n(F + 1)} to ${n(F + a)} must be checked on its own.` }
   ] }; }
 },
 /* ε = e ÷ 1000; N = the first whole number above 1000 ÷ e. Then a proved sum formula at n = N. 50, 70 and 80
    (ε = 0.05, 0.07, 0.08) are the lesson's own numbers and are left out. */
 q40: {
  canonical: { e: 30, f: 'odd' },
  draw: R => ({ e: R.pick([4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 24, 25, 30, 32, 35, 40, 45, 60, 64, 75, 90]), f: R.pick(['odd', 'nat', 'even']) }),
  build: ({ e, f }) => { const F = SUMS[f], eps = n(e / 1000), whole = 1000 % e === 0, q = Math.floor(1000 / e), N = q + 1, V = F.S(N);
   const inv = whole ? `${n(q)} exactly` : `about ${n(Math.round(100000 / e) / 100)}`; return {
   prompt: `Real analysis will ask questions of the form “for every ε there is an N”. Here ε, the Greek letter epsilon, is a small positive number, and the claim is that 1 ÷ n < ε for every whole number n ≥ N. Take ε = ${eps}. Enter the smallest whole number N that works. Then the formula ${F.formula}, proved by induction, gives a value for n = N: enter it (type it without commas).`,
   answer: [N, V],
   hints: ['1 ÷ n < ε means the same as n > 1 ÷ ε. Work out 1 ÷ ε, then take the first whole number strictly above it.', 'Put your N in place of n on the right side of the formula.'],
   solution: `1 ÷ n < ${eps} exactly when n > 1 ÷ ${eps}, which is ${inv}. The first whole number strictly above it is N = ${n(N)}: 1 ÷ ${n(N)} is less than ${eps}, and every larger n makes 1 ÷ n smaller still. N = ${n(q)} is not enough, since 1 ÷ ${n(q)} ${whole ? 'equals' : 'is more than'} ${eps}. The formula at n = ${n(N)} gives ${F.Sat(N)}.`,
   guidance: [
    { prompt: `What is 1 ÷ ${eps}? If it is not a whole number, enter its whole-number part.`, answer: [q], explanation: `1 ÷ ${eps} is ${inv}${whole ? '' : `, so its whole-number part is ${n(q)}`}.` },
    { prompt: `What is the smallest whole number N with 1 ÷ N < ${eps}?`, answer: [N], explanation: `N must be strictly above 1 ÷ ${eps}, so N = ${n(N)}. ${whole ? `At n = ${n(q)}, 1 ÷ n equals ${eps}, which is not less than it.` : `At n = ${n(q)}, 1 ÷ n is still more than ${eps}.`}` },
    { prompt: `Put n = ${n(N)} into the right side of ${F.formula}. What is the value?`, answer: [V], explanation: F.Sat(N) + '.' }
   ] }; }
 }
});
})();
