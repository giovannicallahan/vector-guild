/* Logic and proof practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p7.js. */
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
/* Small number tools. sup(7) is '⁷'; list([1,2,3]) is '1, 2 and 3'; orList is the same with "or". */
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const isPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const leastDiv = x => { for (let d = 2; d * d <= x; d++) if (x % d === 0) return d; return x; };
const sup = s => String(s).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const join = (xs, w) => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ${w} ${xs[xs.length - 1]}`;
const list = xs => join(xs, 'and'), orList = xs => join(xs, 'or');
const st = x => `${n(x)} ${x === 1 ? 'step' : 'steps'}`;
const firstBad = f => { for (let i = 1; ; i++) if (!isPrime(f(i))) return i; };

/* ---- q31 Disproving with a counterexample [Levin 3.2] ---- */

/* If a and b both divide n then a × b divides n: false whenever a and b share a factor. The smallest counterexample is
   the smallest number both divide. a < b, so that number is at least b and the multiples of a give at least two tries;
   b ÷ gcd(a, b) is at most 8, so the list of multiples stays short. */
mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The cargo lock rule',
 brief: 'The stores clerk has pinned a rule for the cargo-bay locks, and the Inquiry Office must find the first number that breaks it.',
 labels: ['smallest counterexample n', 'n ÷ first divisor', 'n ÷ second divisor'], tolerance: 0.01,
 gl: [['smallest counterexample n'], ['n ÷ first divisor', 'n ÷ second divisor']]
}, {
 canonical: { a: 6, b: 9 },
 draw: R => { let a, b; do { a = R.int(2, 15); b = R.int(a + 1, 24); } while (gcd(a, b) === 1 || b / gcd(a, b) > 8); return { a, b }; },
 build: ({ a, b }) => { const ab = a * b, l = ab / gcd(a, b), ms = []; for (let m = a; m <= l; m += a) ms.push(m); return {
  prompt: `The stores clerk has pinned a rule for the cargo-bay locks: “For every whole number n from 1 up, if both ${n(a)} and ${n(b)} divide n, then ${n(ab)} divides n.” Disprove it. Enter the smallest counterexample n, then n ÷ ${n(a)}, then n ÷ ${n(b)}.`,
  answer: [l, l / a, l / b],
  hints: [`List the multiples of ${n(a)} in order: ${n(a)} × 1, ${n(a)} × 2 and so on. Test each one: does ${n(b)} divide it too?`, `A counterexample needs both ${n(a)} and ${n(b)} to divide n, but ${n(ab)} not to divide it. A number smaller than ${n(ab)} cannot be divided by ${n(ab)}.`],
  solution: `The multiples of ${n(a)} are ${list(ms.map(n))}, and so on. ${n(b)} does not divide ${orList(ms.slice(0, -1).map(n))}, but it divides ${n(l)}: ${n(l)} = ${n(a)} × ${n(l / a)} = ${n(b)} × ${n(l / b)}. Yet ${n(l)} is smaller than ${n(ab)}, so ${n(ab)} does not divide it. One failing case is enough, and no smaller n has both ${n(a)} and ${n(b)} dividing it, so n = ${n(l)} is the smallest counterexample.`,
  guidance: [
   { prompt: `Find the first multiple of ${n(a)} that ${n(b)} divides as well. That is the smallest n with both divisors going in.`, answer: [l], explanation: `The multiples of ${n(a)} are ${list(ms.map(n))}, and so on. ${n(b)} does not divide ${orList(ms.slice(0, -1).map(n))}, but it divides ${n(l)}.` },
   { prompt: `Check it: enter n ÷ ${n(a)}, then n ÷ ${n(b)}, for that n. Both should be whole numbers.`, answer: [l / a, l / b], explanation: `${n(l)} = ${n(a)} × ${n(l / a)} = ${n(b)} × ${n(l / b)}. Yet ${n(l)} is smaller than ${n(ab)}, so ${n(ab)} does not divide it, and the rule fails.` }
  ] }; }
});

/* Locker n gets the code a·n + b. The batch stops at the first code that is not prime. Pool: every a (even, 2 … 60)
   and b (odd, 1 … 99) whose first failure is at n = 4 … 8, leaving out q31's worked example 4n + 3. */
const LIN31 = [];
for (let a = 2; a <= 60; a += 2) for (let b = 1; b <= 99; b += 2) { const k = firstBad(i => a * i + b); if (k >= 4 && k <= 8 && !(a === 4 && b === 3)) LIN31.push([a, b]); }
mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'Locker codes in order',
 brief: 'The annex lockers are being given codes one after another, and the batch must stop at the first code that breaks the supplier’s promise.',
 labels: ['stopping locker', 'its code', 'total of the earlier codes'], tolerance: 0.01,
 gl: [['code 1', 'code 2', 'code 3'], ['stopping locker', 'its code'], ['total of the earlier codes']]
}, {
 canonical: { a: 6, b: 5 },
 draw: R => { const [a, b] = R.pick(LIN31); return { a, b }; },
 build: ({ a, b }) => { const f = i => a * i + b, k = firstBad(f), v = f(k), d = leastDiv(v), good = []; for (let i = 1; i < k; i++) good.push(f(i)); const sum = good.reduce((s, x) => s + x, 0);
  const early = `${list(good.map(n))} are all prime`; return {
  prompt: `Lockers in the Inquiry Office annex are given access codes in order, locker 1 first: locker n gets the code ${n(a)}n + ${n(b)}. The supplier swears that every code will be prime. The batch is stopped at the first locker whose code is not prime. Enter the number of that locker, then its code, then the total of all the codes issued before it (type the total without commas).`,
  answer: [k, v, sum],
  hints: [`Work out the code for locker 1, 2, 3 and so on, and test each one for a divisor other than 1 and itself.`, 'The batch stops at the first code that is not prime. Every code before it is prime, so add those up.'],
  solution: `The codes for lockers 1 to ${n(k - 1)} are ${list(good.map(n))}, all prime. Locker ${n(k)} gets ${n(a)} × ${n(k)} + ${n(b)} = ${n(v)}, and ${n(v)} = ${n(d)} × ${n(v / d)}, so it is not prime and the batch stops there. The codes issued before it total ${good.map(n).join(' + ')} = ${n(sum)}.`,
  guidance: [
   { prompt: `Work out the codes for lockers 1, 2 and 3. Enter the three codes.`, answer: [f(1), f(2), f(3)], explanation: `${n(a)} × 1 + ${n(b)} = ${n(f(1))}, ${n(a)} × 2 + ${n(b)} = ${n(f(2))} and ${n(a)} × 3 + ${n(b)} = ${n(f(3))}.` },
   { prompt: 'Keep going, testing each code for a divisor. Which locker is the first with a code that is not prime, and what is its code?', answer: [k, v], explanation: `The codes for lockers 1 to ${n(k - 1)} are ${list(good.map(n))}, all prime. Locker ${n(k)} gets ${n(v)} = ${n(d)} × ${n(v / d)}, which is not prime.` },
   { prompt: `Add up the codes of the lockers before it, all of which are prime. What is the total?`, answer: [sum], explanation: `${good.map(n).join(' + ')} = ${n(sum)}.` }
  ] }; }
});

/* "For every n" claims for the challenge, written as a negation: n² − n + c, n² + 3n + c, n² + 5n + c, n² − 3n + c, 2n² + c. */
const E31D = {
 nm1: c => ({ text: `n² − n + ${n(c)}`, at: i => `${n(i)}² − ${n(i)} + ${n(c)}`, val: i => i * i - i + c }),
 n3: c => ({ text: `n² + 3n + ${n(c)}`, at: i => `${n(i)}² + 3 × ${n(i)} + ${n(c)}`, val: i => i * i + 3 * i + c }),
 n5: c => ({ text: `n² + 5n + ${n(c)}`, at: i => `${n(i)}² + 5 × ${n(i)} + ${n(c)}`, val: i => i * i + 5 * i + c }),
 nm3: c => ({ text: `n² − 3n + ${n(c)}`, at: i => `${n(i)}² − 3 × ${n(i)} + ${n(c)}`, val: i => i * i - 3 * i + c }),
 two: c => ({ text: `2n² + ${n(c)}`, at: i => `2 × ${n(i)}² + ${n(c)}`, val: i => 2 * i * i + c })
};
/* Pool: every c from 1 to 80 whose first failure is at n = 3 … 16 (a real search, but not an endless one), leaving
   out q16's n² − n + 41. */
const POOL31D = {};
for (const f of Object.keys(E31D)) { POOL31D[f] = []; for (let c = 1; c <= 80; c++) { const k = firstBad(E31D[f](c).val); if (k >= 3 && k <= 16 && !(f === 'nm1' && c === 41)) POOL31D[f].push(c); } }
mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', title: 'The negated promise', uses: 'q16',
 brief: 'A longer promise has gone up on the board, and the Inquiry Office must turn it round into a “there is” claim and find its first failure.',
 labels: ['smallest counterexample n', 'value of the expression there', 'smallest divisor above 1'], tolerance: 0.01,
 gl: [['value at n = 1', 'value at n = 2', 'value at n = 3'], ['smallest counterexample n', 'value there'], ['smallest divisor above 1']]
}, {
 canonical: { f: 'nm1', c: 17 },
 draw: R => { const f = R.pick(Object.keys(POOL31D)); return { f, c: R.pick(POOL31D[f]) }; },
 build: ({ f, c }) => { const e = E31D[f](c), k = firstBad(e.val), v = e.val(k), d = leastDiv(v), before = []; for (let i = 1; i < k; i++) before.push(n(e.val(i)));
  const early = k === 3 ? `The values for n = 1 and 2 are ${list(before)}, both prime` : `The values for n = 1 to ${n(k - 1)} are ${list(before)}, all prime`; return {
  prompt: `A long promise is pinned to the Inquiry Office board: “For every whole number n from 1 up, ${e.text} is prime.” The negation of a “for every” claim is a “there is” claim: “there is a whole number n from 1 up for which ${e.text} is not prime.” Any n that makes the negation true is a counterexample. Find the smallest one. Enter that n, then the value of ${e.text} there, then the smallest whole number above 1 that divides the value.`,
  answer: [k, v, d],
  hints: [`Work out ${e.text} for n = 1, 2, 3 and so on, and test each value for a divisor other than 1 and itself. The search can be long, so keep a list.`, 'Once a value has a divisor other than 1 and itself, stop: that n makes the negation true. Then find the smallest divisor of that value by trying 2, 3, 5, 7 and so on.'],
  solution: `${early}. At n = ${n(k)} the value is ${e.at(k)} = ${n(v)}, and ${n(v)} = ${n(d)} × ${n(v / d)}, so it is not prime. That n makes the negation true, so it is a counterexample, and since every smaller n gave a prime it is the smallest. The value there is ${n(v)}, and the smallest whole number above 1 that divides it is ${n(d)}.`,
  guidance: [
   { prompt: `Work out ${e.text} for n = 1, 2 and 3. Enter the three values.`, answer: [e.val(1), e.val(2), e.val(3)], explanation: `${e.at(1)} = ${n(e.val(1))}, ${e.at(2)} = ${n(e.val(2))} and ${e.at(3)} = ${n(e.val(3))}.` },
   { prompt: 'Keep going, testing each value for a divisor. At which n is the value first not prime, and what is the value there?', answer: [k, v], explanation: `${early}. At n = ${n(k)} the value is ${n(v)}, which is not prime.` },
   { prompt: `${n(v)} is not prime. What is the smallest whole number above 1 that divides it?`, answer: [d], explanation: `${n(v)} = ${n(d)} × ${n(v / d)}, and no smaller whole number above 1 divides ${n(v)}.` }
  ] }; }
});

/* ---- q32 Existence proofs: finding a witness [Levin 3.2] ---- */

/* The smallest n above c for which a divides n × (n + 1); 2 to 8 candidates are tried. */
const first32b = (a, c) => { let m = c + 1; while ((m * (m + 1)) % a) m++; return m; };
mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'A pump cycle that fits',
 brief: 'The water pumps can be reset only on a cycle number that fits a timing rule, and the engineers doubt that one exists.',
 labels: ['smallest witness n', 'times it goes in'], tolerance: 0.01,
 gl: [['n × (n + 1) at the first candidate'], ['smallest witness n', 'times it goes in']]
}, {
 canonical: { a: 15, c: 41 },
 draw: R => { let a, c, w; do { a = R.int(10, 40); c = R.int(20, 90); w = first32b(a, c); } while (w - c < 2 || w - c > 8); return { a, c }; },
 build: ({ a, c }) => { const w = first32b(a, c), tried = []; for (let i = c + 1; i <= w; i++) tried.push(i); const pr = i => i * (i + 1), q = pr(w) / a;
  const sol = `The cycle numbers above ${n(c)} in order: ${tried.map(i => `${n(i)} × ${n(i + 1)} = ${n(pr(i))}`).join('; ')}. ${n(a)} does not divide ${orList(tried.slice(0, -1).map(i => n(pr(i))))}, but it divides ${n(pr(w))}: ${n(pr(w))} = ${n(a)} × ${n(q)}.`;
  const claim = `there is a whole number n greater than ${n(c)} for which ${n(a)} divides n × (n + 1)`; return {
  prompt: `The pump controller can be reset only on a cycle number n that fits a timing rule. The engineers doubt the rule can ever be met: “${claim}.” Show that it can with a witness. Find the smallest witness n, then enter how many times ${n(a)} goes into n × (n + 1).`,
  answer: [w, q],
  hints: [`Try n = ${n(c + 1)}, ${n(c + 2)} and so on. Work out n × (n + 1) each time and test whether ${n(a)} divides it.`, `Stop at the first n that passes: that is the witness. Divide its n × (n + 1) by ${n(a)} for the second answer.`],
  solution: `${sol} So ${n(w)} is the smallest witness, and ${n(a)} goes into ${n(pr(w))} exactly ${n(q)} times. Showing it and checking it proves that ${claim}.`,
  guidance: [
   { prompt: `Start at the first number above ${n(c)}, which is ${n(c + 1)}. What is n × (n + 1) there?`, answer: [pr(c + 1)], explanation: `${n(c + 1)} × ${n(c + 2)} = ${n(pr(c + 1))}.` },
   { prompt: `Test ${n(a)} against each n × (n + 1) in order. Which n is the first that passes, and how many times does ${n(a)} go into its n × (n + 1)?`, answer: [w, q], explanation: `${sol} So the smallest witness is ${n(w)}, and ${n(a)} goes in ${n(q)} times.` }
  ] }; }
});

/* The smallest delivery above c that a divides and that is one more than a multiple of b (a and b share no factor). */
const first32c = ({ a, b, c }) => { const ms = []; let m = (Math.floor(c / a) + 1) * a; ms.push(m); while ((m - 1) % b) { m += a; ms.push(m); } return { w: m, ms }; };
mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'The rivet shipment',
 brief: 'The greenhouse frame needs a rivet delivery that meets three packing conditions at once, and the foreman doubts one exists.',
 labels: ['smallest delivery', 'sacks', 'full bags'], tolerance: 0.01,
 gl: [['first multiple above the bound'], ['smallest delivery'], ['sacks', 'full bags']]
}, {
 canonical: { a: 7, b: 4, c: 60 },
 draw: R => { let p; do { p = { a: R.int(3, 12), b: R.int(3, 12), c: R.int(30, 150) }; } while (p.a === p.b || gcd(p.a, p.b) !== 1 || first32c(p).ms.length < 2 || first32c(p).ms.length > 8); return p; },
 build: p => { const { a, b, c } = p, { w, ms } = first32c(p), sacks = w / a, bags = (w - 1) / b;
  const sol = `The multiples of ${n(a)} above ${n(c)} are ${list(ms.map(n))}, and so on. One less than each: ${ms.map(m => `${n(m)} − 1 = ${n(m - 1)}`).join('; ')}. ${n(b)} does not divide ${orList(ms.slice(0, -1).map(m => n(m - 1)))}, but it divides ${n(w - 1)}: ${n(w - 1)} = ${n(b)} × ${n(bags)}.`;
  const claim = `there is a delivery of more than ${n(c)} rivets that packs exactly into sacks of ${n(a)} and is one more than a multiple of ${n(b)}`; return {
  prompt: `The greenhouse frame needs a delivery of rivets that meets three conditions: more than ${n(c)} rivets; packed exactly into sacks of ${n(a)}; and one more than a multiple of ${n(b)}, so that bags of ${n(b)} would leave exactly one rivet loose. The foreman doubts that such a delivery exists. Prove that it does with a witness. Enter the smallest delivery size, then the number of sacks it makes, then the number of full bags of ${n(b)} it makes.`,
  answer: [w, sacks, bags],
  hints: [`List the multiples of ${n(a)} above ${n(c)}, in order. For each one, take away 1 and test whether ${n(b)} divides what is left.`, `Stop at the first multiple that passes. The sacks are that number ÷ ${n(a)}, and the full bags are that number minus 1, ÷ ${n(b)}.`],
  solution: `${sol} So ${n(w)} is the smallest delivery. It makes ${n(w)} ÷ ${n(a)} = ${n(sacks)} sacks, and ${n(bags)} full bags of ${n(b)} with one rivet left over. Showing it and checking it proves that ${claim}.`,
  guidance: [
   { prompt: `What is the first multiple of ${n(a)} above ${n(c)}?`, answer: [ms[0]], explanation: `${n(a)} × ${n(ms[0] / a - 1)} = ${n(ms[0] - a)} is not above ${n(c)}, so the first multiple of ${n(a)} above ${n(c)} is ${n(a)} × ${n(ms[0] / a)} = ${n(ms[0])}.` },
   { prompt: `Test the multiples in order: take away 1 and see whether ${n(b)} divides what is left. Which is the first one that passes?`, answer: [w], explanation: `${sol} So the smallest delivery is ${n(w)}.` },
   { prompt: `For that delivery, how many sacks of ${n(a)} does it make, and how many full bags of ${n(b)}?`, answer: [sacks, bags], explanation: `${n(w)} ÷ ${n(a)} = ${n(sacks)} sacks. ${n(w)} − 1 = ${n(w - 1)} and ${n(w - 1)} ÷ ${n(b)} = ${n(bags)} full bags, with one rivet left over.` }
  ] }; }
});

/* The smallest prime p above c with p + d1 and p + d2 prime too. */
const first32d = ({ c, d1, d2 }) => { const tried = []; let m = c; for (;;) { m++; while (!isPrime(m)) m++; tried.push(m); if (isPrime(m + d1) && isPrime(m + d2)) return { w: m, tried }; } };
mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', title: 'Three beacon channels',
 brief: 'The beacon network needs three channel numbers that are all prime, and the council wants a witness before it commits the frequencies.',
 labels: ['smallest witness p', 'second channel', 'third channel'], tolerance: 0.01,
 gl: [['first prime above the bound'], ['smallest witness p', 'second channel', 'third channel']]
}, {
 canonical: { c: 100, d1: 4, d2: 6 },
 draw: R => { let p; do { const [d1, d2] = R.pick([[2, 6], [4, 6], [2, 8], [6, 8]]); p = { c: R.int(30, 420), d1, d2 }; } while (first32d(p).tried.length < 2 || first32d(p).tried.length > 8); return p; },
 build: p => { const { c, d1, d2 } = p, { w, tried } = first32d(p), say = q => { const x = q + d1, y = q + d2;
   return !isPrime(x) ? `${n(q)}, but ${n(q)} + ${n(d1)} = ${n(x)} = ${n(leastDiv(x))} × ${n(x / leastDiv(x))} is not prime` : !isPrime(y) ? `${n(q)}, and ${n(q)} + ${n(d1)} = ${n(x)} is prime, but ${n(q)} + ${n(d2)} = ${n(y)} = ${n(leastDiv(y))} × ${n(y / leastDiv(y))} is not` : `${n(q)}, with ${n(q)} + ${n(d1)} = ${n(x)} and ${n(q)} + ${n(d2)} = ${n(y)}, both prime`; };
  const sol = `The primes above ${n(c)} in order: ${tried.map(say).join('; ')}.`;
  const claim = `there is a prime p greater than ${n(c)} for which p + ${n(d1)} and p + ${n(d2)} are also prime`; return {
  prompt: `The beacon network needs three channel numbers p, p + ${n(d1)} and p + ${n(d2)} that are all prime, with p greater than ${n(c)}. The council doubts that such a triple exists: “${claim}.” Prove that it does with a witness. A prime is a whole number above 1 that no whole number divides except 1 and itself. To test a number, try dividing it by 2, 3, 5, 7, 11, 13, 17 and 19 in turn, and stop once the divisor times itself is bigger than the number: if none of them divides it exactly, it is prime. Enter the smallest witness p, then the other two channel numbers, p + ${n(d1)} and then p + ${n(d2)}.`,
  answer: [w, w + d1, w + d2],
  hints: [`List the primes above ${n(c)} in order. For each one, test whether both p + ${n(d1)} and p + ${n(d2)} are prime.`, 'Stop at the first prime p that passes both tests. That p is the witness, and its two partners are the other answers.'],
  solution: `${sol} So ${n(w)} is the smallest witness, with the channels ${n(w)}, ${n(w + d1)} and ${n(w + d2)}. Showing it and checking it proves that ${claim}.`,
  guidance: [
   { prompt: `What is the first prime above ${n(c)}?`, answer: [tried[0]], explanation: `Testing ${n(c)} + 1, ${n(c)} + 2 and so on for divisors, the first prime above ${n(c)} is ${n(tried[0])}.` },
   { prompt: `Test each prime in order. Which is the first witness p, and what are p + ${n(d1)} and p + ${n(d2)}?`, answer: [w, w + d1, w + d2], explanation: `${sol} So the smallest witness is ${n(w)}, with the channels ${n(w)}, ${n(w + d1)} and ${n(w + d2)}.` }
  ] }; }
});

/* ---- q33 If-and-only-if proofs: both directions [Levin 3.2] ---- */

/* The iff claims. L and R are the two sides; "forward" is "if L then R". fwdArg proves forward (through the
   contrapositive when fwdContra), bwdArg proves backward. cnt(N) counts the n from 1 to N that make L (and R) true. */
const even = N => Math.floor(N / 2), odd = N => Math.floor((N + 1) / 2);
const C33 = {
 plus: a => ({ L: `n + ${n(a)} is odd`, R: 'n is even', notL: `n + ${n(a)} is even`, notR: 'n is odd', cnt: even, which: 'the even numbers', fwdContra: true,
  fwdArg: `Suppose n is odd, so n = 2k + 1 for a whole number k. Then n + ${n(a)} = 2k + ${n(a + 1)} = 2(k + ${n((a + 1) / 2)}), which is even. So when n is not even, n + ${n(a)} is not odd.`,
  bwdArg: `Suppose n is even, so n = 2k for a whole number k. Then n + ${n(a)} = 2k + ${n(a)} = 2(k + ${n((a - 1) / 2)}) + 1, which is odd.` }),
 mult: a => ({ L: `${n(a)}n is even`, R: 'n is even', notL: `${n(a)}n is odd`, notR: 'n is odd', cnt: even, which: 'the even numbers', fwdContra: true,
  fwdArg: `Suppose n is odd, so n = 2k + 1 for a whole number k. Then ${n(a)}n = ${n(2 * a)}k + ${n(a)} = 2(${n(a)}k + ${n((a - 1) / 2)}) + 1, which is odd. So when n is not even, ${n(a)}n is not even.`,
  bwdArg: `Suppose n is even, so n = 2k for a whole number k. Then ${n(a)}n = ${n(2 * a)}k = 2(${n(a)}k), which is even.` }),
 sum2: a => ({ L: `n + ${n(a)} is even`, R: 'n is even', cnt: even, which: 'the even numbers', fwdContra: false,
  fwdArg: `Suppose n + ${n(a)} is even, so n + ${n(a)} = 2m for a whole number m. Then n = 2m − ${n(a)} = 2(m − ${n(a / 2)}), which is even.`,
  bwdArg: `Suppose n is even, so n = 2k for a whole number k. Then n + ${n(a)} = 2k + ${n(a)} = 2(k + ${n(a / 2)}), which is even.` }),
 cube: () => ({ L: 'n³ is even', R: 'n is even', notL: 'n³ is odd', notR: 'n is odd', cnt: even, which: 'the even numbers', fwdContra: true,
  fwdArg: 'Suppose n is odd, so n = 2k + 1 for a whole number k. Then n³ = 8k³ + 12k² + 6k + 1 = 2(4k³ + 6k² + 3k) + 1, which is odd. So when n is not even, n³ is not even.',
  bwdArg: 'Suppose n is even, so n = 2k for a whole number k. Then n³ = 8k³ = 2(4k³), which is even.' }),
 sqodd: () => ({ L: 'n² is odd', R: 'n is odd', notL: 'n² is even', notR: 'n is even', cnt: odd, which: 'the odd numbers', fwdContra: true,
  fwdArg: 'Suppose n is even, so n = 2k for a whole number k. Then n² = 4k² = 2(2k²), which is even. So when n is not odd, n² is not odd.',
  bwdArg: 'Suppose n is odd, so n = 2k + 1 for a whole number k. Then n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, which is odd.' }),
 lin2: a => ({ L: `${n(a)}n is odd`, R: 'n is odd', notL: `${n(a)}n is even`, notR: 'n is even', cnt: odd, which: 'the odd numbers', fwdContra: true,
  fwdArg: `Suppose n is even, so n = 2k for a whole number k. Then ${n(a)}n = ${n(2 * a)}k = 2(${n(a)}k), which is even. So when n is not odd, ${n(a)}n is not odd.`,
  bwdArg: `Suppose n is odd, so n = 2k + 1 for a whole number k. Then ${n(a)}n = ${n(2 * a)}k + ${n(a)} = 2(${n(a)}k + ${n((a - 1) / 2)}) + 1, which is odd.` })
};
/* Common parts: the two directions listed (swap puts the backward one first), which one the argument proves and why. */
const iff33 = (C, fwd, swap) => { const fw = `If ${C.L}, then ${C.R}`, bw = `If ${C.R}, then ${C.L}`, items = swap ? [bw, fw] : [fw, bw],
 idx = fwd ? (swap ? 2 : 1) : (swap ? 1 : 2), arg = fwd ? C.fwdArg : C.bwdArg, proved = fwd ? fw : bw;
 const how = fwd && C.fwdContra
  ? `The argument supposes “${C.notR}” and concludes “${C.notL}”. That is the contrapositive of “${fw}”, which says the same thing, so the argument proves that direction: number ${idx}.`
  : `The argument supposes “${fwd ? C.L : C.R}” and concludes “${fwd ? C.R : C.L}”, so it proves “${proved}”: direction number ${idx}.`;
 return { items, idx, arg, how }; };
const drawA33 = (R, f) => ['plus', 'mult', 'lin2', 'sum2'].includes(f) ? (f === 'sum2' ? R.pick([2, 6, 8, 10]) : R.pick([3, 5, 7, 9])) : 0;

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'The hangar door rule',
 brief: 'The hangar doors follow a two-way rule about door numbers, and the crew needs to know which half of its proof a technician has handed in.',
 labels: ['direction proved', 'count where the left side is true', 'count where both sides are true'], tolerance: 0.01,
 gl: [['direction proved'], ['count where the left side is true'], ['count where both sides are true']]
}, {
 canonical: { f: 'plus', a: 5, fwd: 0, swap: 0, N: 40 },
 draw: R => { const f = R.pick(['plus', 'mult']); return { f, a: drawA33(R, f), fwd: R.int(0, 1), swap: R.int(0, 1), N: R.int(20, 60) }; },
 build: p => { const C = C33[p.f](p.a), I = iff33(C, p.fwd, p.swap), N = p.N, c = C.cnt(N);
  const counts = `For n from 1 to ${n(N)}, “${C.L}” is true for ${n(c)} numbers, ${C.which}. Those are exactly the numbers that make “${C.R}” true, so both sides are true together for the same ${n(c)} numbers, as an if-and-only-if claim requires.`; return {
  prompt: `The hangar crew is checking a door rule: “For every whole number n, ${C.L} if and only if ${C.R}.” Its two directions are: 1. ${I.items[0]}. 2. ${I.items[1]}. A technician hands in this argument: “${I.arg}” Enter the number of the direction this argument proves. Then, for n from 1 to ${n(N)}, enter how many n make “${C.L}” true, and how many n make both “${C.L}” and “${C.R}” true.`,
  answer: [I.idx, c, c],
  hints: ['Read what the argument supposes at the start and what it reaches at the end. If it supposes the opposite of one side and reaches the opposite of the other, it is proving a contrapositive.', 'An if-and-only-if claim says the two sides are true for exactly the same numbers. So the numbers that make the left side true are also the numbers that make both sides true.'],
  solution: `${I.how} The other direction needs its own argument before the claim is proved. ${counts}`,
  guidance: [
   { prompt: 'Which direction does the argument prove? Enter its number from the list.', answer: [I.idx], explanation: I.how },
   { prompt: `For n from 1 to ${n(N)}, how many n make “${C.L}” true?`, answer: [c], explanation: `“${C.L}” is true exactly for ${C.which}, and there are ${n(c)} of them from 1 to ${n(N)}.` },
   { prompt: `How many n from 1 to ${n(N)} make both “${C.L}” and “${C.R}” true?`, answer: [c], explanation: counts }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Does the door log agree',
 brief: 'The door log records two checks for each door number, and the Inquiry Office must show that the checks never disagree.',
 labels: ['direction proved', 'count where the left side is true', 'count where the two checks agree'], tolerance: 0.01,
 gl: [['direction proved'], ['count where the left side is true'], ['count where the two checks agree']]
}, {
 canonical: { f: 'sum2', a: 6, fwd: 1, swap: 1, N: 36 },
 draw: R => ({ f: 'sum2', a: drawA33(R, 'sum2'), fwd: R.int(0, 1), swap: R.int(0, 1), N: R.int(20, 60) }),
 build: p => { const C = C33.sum2(p.a), I = iff33(C, p.fwd, p.swap), N = p.N, c = C.cnt(N);
  const agree = `Since the claim holds in both directions, “${C.L}” and “${C.R}” are true together or false together for every n. A two-way claim “P if and only if Q” is true when both sides have the same truth value, so it is true for all ${n(N)} of the numbers.`; return {
  prompt: `Every door number n from 1 to ${n(N)} gets two checks in the log: check L is “${C.L}” and check R is “${C.R}”. The log is meant to show that L is true exactly when R is true. The two directions of that claim are: 1. ${I.items[0]}. 2. ${I.items[1]}. A clerk hands in this argument for one of them: “${I.arg}” Enter the number of the direction the argument proves. Then enter how many doors pass check L, and how many doors have the two checks agreeing, both true or both false.`,
  answer: [I.idx, c, N],
  hints: ['Read what the argument supposes at the start and what it reaches at the end, and match that to one of the two directions.', 'Two checks agree when they are both true or both false. If the two-way claim holds, they agree on every door.'],
  solution: `${I.how} The other direction still needs its own argument. Check L is true for ${C.which}, and there are ${n(c)} of them from 1 to ${n(N)}. ${agree}`,
  guidance: [
   { prompt: 'Which direction does the argument prove? Enter its number from the list.', answer: [I.idx], explanation: I.how },
   { prompt: `How many doors from 1 to ${n(N)} pass check L, “${C.L}”?`, answer: [c], explanation: `“${C.L}” is true exactly for ${C.which}, and there are ${n(c)} of them from 1 to ${n(N)}.` },
   { prompt: 'Once both directions are proved, how many of the doors have the two checks agreeing, both true or both false?', answer: [N], explanation: agree }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', title: 'Two sides of the hatch', uses: 'q27',
 brief: 'A long hatch log needs both of its two-way rules counted, with the proof that the sides cannot disagree.',
 labels: ['direction proved', 'count where the left side is true', 'count where the right side is false'], tolerance: 0.01,
 gl: [['direction proved'], ['count where the left side is true'], ['count where the right side is false']]
}, {
 canonical: { f: 'cube', a: 0, fwd: 1, swap: 0, N: 150 },
 draw: R => { const f = R.pick(['cube', 'sqodd', 'lin2']); return { f, a: drawA33(R, f), fwd: R.int(0, 1), swap: R.int(0, 1), N: R.int(100, 200) }; },
 build: p => { const C = C33[p.f](p.a), I = iff33(C, p.fwd, p.swap), N = p.N, c = C.cnt(N), nr = N - c;
  const counts = `For n from 1 to ${n(N)}, “${C.L}” is true for ${n(c)} numbers, ${C.which}, and “${C.R}” is true for the same ${n(c)} numbers, as an if-and-only-if claim requires. So “${C.R}” is false for the other ${n(N)} − ${n(c)} = ${n(nr)} numbers.`; return {
  prompt: `The hatch log for doors 1 to ${n(N)} rests on a two-way rule: “For every whole number n, ${C.L} if and only if ${C.R}.” Its two directions are: 1. ${I.items[0]}. 2. ${I.items[1]}. One of them has been proved by this argument, which may go through a contrapositive: “${I.arg}” Enter the number of the direction the argument proves. Then, for n from 1 to ${n(N)}, enter how many n make “${C.L}” true, and how many n make “${C.R}” false.`,
  answer: [I.idx, c, nr],
  hints: ['A contrapositive argument supposes the opposite of the conclusion and reaches the opposite of the starting claim. Match what the argument supposes and reaches to one of the two directions.', 'Both sides are true for exactly the same numbers, so count one side. The numbers that make a side false are all the others from 1 up to the last one.'],
  solution: `${I.how} The other direction needs its own argument before the claim is proved. ${counts}`,
  guidance: [
   { prompt: 'Which direction does the argument prove? Enter its number from the list.', answer: [I.idx], explanation: I.how },
   { prompt: `For n from 1 to ${n(N)}, how many n make “${C.L}” true?`, answer: [c], explanation: `“${C.L}” is true exactly for ${C.which}, and there are ${n(c)} of them from 1 to ${n(N)}.` },
   { prompt: `How many n from 1 to ${n(N)} make “${C.R}” false?`, answer: [nr], explanation: counts }
  ] }; }
});

/* ---- q34 Spotting the flawed step [Levin 3.2] ---- */

/* Four flawed proofs of false claims. Each gives its claim, its numbered steps, the first wrong step and why, and the kind
   of mistake (1 dividing by 0, 2 a rule used backwards, 3 a few examples taken for every case). v adds 0, 1 or 2 sound
   steps before the wrong one. p holds r, s, t (cancel), a (conv2), c (ex3) and k (sq2). */
const FL = {
 cancel: (p, v) => { const { r, s, t } = p, x = t - s, eq = `(x − ${n(r)})(x + ${n(s)}) = ${n(t)}(x − ${n(r)})`, st = [`Both sides of ${eq} contain the factor x − ${n(r)}.`];
  if (v >= 1) st.push(`The left side is the product of x − ${n(r)} and x + ${n(s)}.`); if (v >= 2) st.push(`The right side is the product of ${n(t)} and x − ${n(r)}.`);
  st.push(`Divide both sides by x − ${n(r)}: x + ${n(s)} = ${n(t)}.`, `So x = ${n(x)}.`, `Therefore x = ${n(x)} is the only solution. ∎`);
  return { claim: `the only solution of ${eq} is x = ${n(x)}`, steps: st, wrong: 2 + v, kind: 1, why: `divides both sides by x − ${n(r)}, which is 0 when x = ${n(r)}; x = ${n(r)} also solves the equation, since both sides are then 0` }; },
 conv2: (p, v) => { const a = p.a, st = ['Let n be even, so n = 2k for some whole number k.'];
  if (v >= 1) st.push(`Note that ${n(a)} = 2 × ${n(a / 2)}.`); if (v >= 2) st.push('Even numbers are exactly the numbers that 2 divides.');
  st.push(`Every multiple of ${n(a)} is even, since ${n(a)}j = 2 × ${n(a / 2)}j.`, `So n, being even, is a multiple of ${n(a)}.`, `Therefore every even number is a multiple of ${n(a)}. ∎`);
  return { claim: `every even number is a multiple of ${n(a)}`, steps: st, wrong: 3 + v, kind: 2, why: `uses the converse of the step before it: every multiple of ${n(a)} is even, but not every even number is a multiple of ${n(a)}, since 2 itself is not` }; },
 ex3: (p, v) => { const e = 2 + v, c = p.c, st = []; for (let i = 1; i <= e; i++) st.push(`n = ${n(i)} gives ${n(i)}² − ${n(i)} + ${n(c)} = ${n(i * i - i + c)}, which is prime.`);
  st.push('The claim holds in every case tried, so it holds for every whole number n. ∎');
  return { claim: `n² − n + ${n(c)} is prime for every whole number n`, steps: st, wrong: e + 1, kind: 3, why: `treats ${n(e)} checked examples as a proof for every n; in fact n = ${n(c)} gives ${n(c)}² − ${n(c)} + ${n(c)} = ${n(c * c)} = ${n(c)} × ${n(c)}` }; },
 sq2: (p, v) => { const k = p.k, st = [`${n(k)}² = ${n(k * k)}.`];
  if (v >= 1) st.push(`The number ${n(k)} is one number whose square is ${n(k * k)}.`); if (v >= 2) st.push(`Any number equal to ${n(k)} has a square equal to ${n(k * k)}.`);
  st.push(`So any number whose square is ${n(k * k)} equals ${n(k)}.`, `Therefore ${n(k)} is the only number, positive or negative, whose square is ${n(k * k)}. ∎`);
  return { claim: `${n(k)} is the only number, positive or negative, whose square is ${n(k * k)}`, steps: st, wrong: 2 + v, kind: 2, why: `runs the rule backwards: a number equal to ${n(k)} has square ${n(k * k)}, but a number with square ${n(k * k)} need not equal ${n(k)}, since −${n(k)} has the same square` }; }
};
const sound34 = w => w === 2 ? 'step 1 is sound' : w === 3 ? 'steps 1 and 2 are sound' : `steps 1 to ${n(w - 1)} are sound`;
const steps34 = s => s.map((t, i) => `(${i + 1}) ${t}`).join(' ');
const draw34 = R => { const [r, s] = [R.int(2, 9), R.int(1, 6)]; let t; do { t = R.int(s + 1, s + 9); } while (t - s === r); return { r, s, t, a: R.pick([4, 6, 8, 10, 12]), c: R.pick([11, 17, 41]), k: R.int(3, 9) }; };
const pick34 = (R, kinds) => { const K = R.pick(kinds), p = draw34(R); p.K = K; p.v = R.int(0, 2); return p; };

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The secretary’s proof',
 brief: 'The council secretary pinned up a proof of a claim that cannot be true, and Mira wants the faulty step and the kind of mistake named.',
 labels: ['first wrong step', 'kind of mistake'], tolerance: 0.01,
 gl: [['first wrong step'], ['kind of mistake']]
}, {
 canonical: { K: 'cancel', v: 1, r: 4, s: 2, t: 7, a: 6, c: 11, k: 5 },
 draw: R => pick34(R, ['cancel', 'conv2', 'ex3']),
 build: p => { const f = FL[p.K](p, p.v), kinds = ['dividing by 0', 'using an “if … then” rule backwards', 'taking a few examples for every case']; return {
  prompt: `The council secretary has pinned up a proof of a claim that is false. The claim: ${f.claim}. The proof: ${steps34(f.steps)} Enter the number of the first wrong step. Then enter the number that names the mistake: 1 for dividing by 0, 2 for using an “if … then” rule backwards, 3 for taking a few examples for every case.`,
  answer: [f.wrong, f.kind],
  hints: ['Check the steps one at a time. Is each one true, and does it follow from the steps before it?', 'To name the mistake, ask: was something divided by that could be 0, was a rule used backwards, or was a claim about every number drawn from a few examples?'],
  solution: `${sound34(f.wrong)[0].toUpperCase()}${sound34(f.wrong).slice(1)}, but step ${n(f.wrong)} ${f.why}. That is mistake number ${n(f.kind)}: ${kinds[f.kind - 1]}. Every step after a wrong one inherits the error, so the first wrong step is ${n(f.wrong)}.`,
  guidance: [
   { prompt: 'Which is the first step that is false or does not follow from the steps before it?', answer: [f.wrong], explanation: `${sound34(f.wrong)[0].toUpperCase()}${sound34(f.wrong).slice(1)}, but step ${n(f.wrong)} ${f.why}.` },
   { prompt: 'Which mistake is it? Enter 1 for dividing by 0, 2 for using a rule backwards, or 3 for taking a few examples for every case.', answer: [f.kind], explanation: `The step ${f.why.split(';')[0]}, which is mistake number ${n(f.kind)}: ${kinds[f.kind - 1]}.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Strike out the bad steps',
 brief: 'Before a false proof is withdrawn, the council wants to know how many of its steps were sound and how many must be struck out.',
 labels: ['first wrong step', 'sound steps before it', 'steps struck out'], tolerance: 0.01,
 gl: [['first wrong step'], ['sound steps before it'], ['steps struck out']]
}, {
 canonical: { K: 'conv2', v: 1, r: 4, s: 2, t: 7, a: 6, c: 11, k: 5 },
 draw: R => pick34(R, ['cancel', 'conv2', 'ex3', 'sq2']),
 build: p => { const f = FL[p.K](p, p.v), T = f.steps.length, w = f.wrong, out = T - w + 1; return {
  prompt: `A proof pinned to the council wall has ${n(T)} steps and ends on a false claim. The claim: ${f.claim}. The proof: ${steps34(f.steps)} Once the first wrong step is found, that step and every step after it are struck out, because each one inherits the error. Enter the number of the first wrong step, then how many steps before it are sound, then how many steps are struck out.`,
  answer: [w, w - 1, out],
  hints: ['Check the steps one at a time. Is each one true, and does it follow from the steps before it? The first one that fails is the wrong step.', 'The sound steps are all those before the wrong one. The struck-out steps run from the wrong one to the last step, and include both ends.'],
  solution: `${sound34(w)[0].toUpperCase()}${sound34(w).slice(1)}, but step ${n(w)} ${f.why}. So the first wrong step is ${n(w)}, and ${st(w - 1)} before it ${w === 2 ? 'is' : 'are'} sound. The proof has ${n(T)} steps, so ${T === w ? `step ${n(w)} is` : `steps ${n(w)} to ${n(T)} are`} struck out: ${n(T)} − ${n(w)} + 1 = ${st(out)}.`,
  guidance: [
   { prompt: 'Which is the first step that is false or does not follow from the steps before it?', answer: [w], explanation: `${sound34(w)[0].toUpperCase()}${sound34(w).slice(1)}, but step ${n(w)} ${f.why}.` },
   { prompt: 'How many steps come before it, all of them sound?', answer: [w - 1], explanation: (w === 2 ? 'The only step before step 2 is step 1, which is 1 step.' : `The steps before step ${n(w)} are steps 1 to ${n(w - 1)}, which is ${n(w - 1)} steps.`) },
   { prompt: `The proof has ${n(T)} steps. How many are struck out, counting the wrong step and every step after it?`, answer: [out], explanation: `${T === w ? `Step ${n(w)} is` : `Steps ${n(w)} to ${n(T)} are`} struck out, and ${n(T)} − ${n(w)} + 1 = ${n(out)}.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', title: 'Three proofs on the wall',
 brief: 'Three different false proofs are on the wall at once, and Mira wants the first wrong step of each, with no two of them failing in the same way.',
 labels: ['first wrong step in A', 'first wrong step in B', 'first wrong step in C'], tolerance: 0.01,
 gl: [['first wrong step in A'], ['first wrong step in B'], ['first wrong step in C']]
}, {
 canonical: { K: ['sq2', 'ex3', 'cancel'], v: [1, 0, 2], r: 3, s: 4, t: 9, a: 8, c: 17, k: 6 },
 /* One proof of each kind of mistake: cancel (1), ex3 (3), and conv2 or sq2 (both kind 2), in a random order. */
 draw: R => { const base = draw34(R), ks = ['cancel', 'ex3', R.pick(['conv2', 'sq2'])], K = []; while (K.length < 3) { const x = R.pick(ks); if (!K.includes(x)) K.push(x); } return { ...base, K, v: [R.int(0, 2), R.int(0, 2), R.int(0, 2)] }; },
 build: p => { const F = p.K.map((K, i) => FL[K](p, p.v[i])), names = ['A', 'B', 'C']; return {
  prompt: `Three investigators have each pinned up a proof, and all three conclusions are false. ${F.map((f, i) => `Proof ${names[i]}, that ${f.claim}: ${steps34(f.steps)}`).join(' ')} Enter the number of the first wrong step in proof A, then in proof B, then in proof C.`,
  answer: F.map(f => f.wrong),
  hints: ['Check each proof on its own, one step at a time. Is each step true, and does it follow from the steps before it?', 'Look for a division by something that may be 0, an “if … then” rule used backwards, and a conclusion drawn from a few examples.'],
  solution: `${F.map((f, i) => `Proof ${names[i]}: ${sound34(f.wrong)}, but step ${n(f.wrong)} ${f.why}.`).join(' ')} Every step after a wrong one inherits the error, so the first wrong steps are ${n(F[0].wrong)} in proof A, ${n(F[1].wrong)} in proof B and ${n(F[2].wrong)} in proof C.`,
  guidance: F.map((f, i) => ({ prompt: `Proof ${names[i]}: which is the first step that is false or does not follow from the steps before it?`, answer: [f.wrong], explanation: `In proof ${names[i]}, ${sound34(f.wrong)}, but step ${n(f.wrong)} ${f.why}.` })) }; }
});

/* ---- q35 Induction: the base case and the domino idea [Levin 2.5] ---- */

/* q35b: n² > an + b. The first true n is above a, and from there the left side keeps winning. */
const first35b = ({ a, b }) => { for (let i = 1; ; i++) if (i * i > a * i + b) return i; };
const rowsB = ({ a, b }, N) => { const r = []; for (let i = 1; i <= N; i++) r.push(`n = ${n(i)}: ${n(i * i)} against ${n(a * i + b)}, ${i * i > a * i + b ? 'true' : 'false'}`); return r.join('; '); };
mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'Tank sizes and pump lines',
 brief: 'The Long Stair’s water tanks grow faster than their pump lines only from some tank on, and the proof must start at the right one.',
 labels: ['first n where it holds', 'left side there', 'right side there'], tolerance: 0.01,
 gl: [['left side at n = 1', 'right side at n = 1'], ['first n where it holds', 'left side there', 'right side there']]
}, {
 canonical: { a: 5, b: 6 },
 draw: R => { let p; do { p = { a: R.int(2, 8), b: R.int(1, 15) }; } while (first35b(p) < 3 || first35b(p) > 10); return p; },
 build: p => { const { a, b } = p, N = first35b(p), L = N * N, Rt = a * N + b; return {
  prompt: `The water tanks along the Long Stair are numbered from 1: tank n holds n² litres, and its pump line moves ${n(a)}n + ${n(b)} litres in a shift. Mira’s claim is that n² > ${n(a)}n + ${n(b)} for every tank number n from some tank on. An induction proof must start at a base case where the claim really holds. Find the first whole number n at which the claim is true, then enter the left side and the right side there.`,
  answer: [N, L, Rt],
  hints: ['Work out both sides for n = 1, 2, 3 and so on, and compare them each time.', 'The base case is the first n where the left side is bigger than the right side. A tie does not count, because the claim says “greater than”.'],
  solution: `${rowsB(p, N)}. The first true case is n = ${n(N)}, so the base case goes there: the left side is ${n(N)}² = ${n(L)} and the right side is ${n(a)} × ${n(N)} + ${n(b)} = ${n(Rt)}. The claim is false for every smaller n, so the proof cannot start before ${n(N)}.`,
  guidance: [
   { prompt: 'Work out both sides at n = 1. Enter the left side, then the right side.', answer: [1, a + b], explanation: `1² = 1 and ${n(a)} × 1 + ${n(b)} = ${n(a + b)}, so the claim is false at n = 1.` },
   { prompt: 'Try n = 2, 3 and so on. Which is the first n where the left side is bigger, and what are the two sides there?', answer: [N, L, Rt], explanation: `${rowsB(p, N)}. The first true case is n = ${n(N)}, with ${n(L)} against ${n(Rt)}.` }
  ] }; }
});

/* q35c and q35d: cⁿ > an + b. */
const first35 = ({ c, a, b }) => { for (let i = 1; ; i++) if (Math.pow(c, i) > a * i + b) return i; };
const rowsE = ({ c, a, b }, N) => { const r = []; for (let i = 1; i <= N; i++) { const L = Math.pow(c, i), Rt = a * i + b; r.push(`n = ${n(i)}: ${n(L)} against ${n(Rt)}, ${L > Rt ? 'true' : 'false'}`); } return r.join('; '); };
mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'The battery log',
 brief: 'The battery cells of the Long Stair hold more charge than they drain only after some cycle, and the log must show where the proof can begin.',
 labels: ['first cycle where it holds', 'cycles where it is false', 'cycles where it is true'], tolerance: 0.01,
 gl: [['first cycle where it holds'], ['cycles where it is false'], ['cycles where it is true']]
}, {
 canonical: { c: 3, a: 7, b: 5, M: 12 },
 draw: R => { let p, N; do { p = { c: R.pick([2, 2, 3]), a: R.int(2, 12), b: R.int(1, 12), M: 0 }; N = first35(p); } while (N < 3 || N > 7 || (p.c === 3 && p.a === 4 && p.b === 2)); p.M = N + R.int(4, 12); return p; },
 build: p => { const { c, a, b, M } = p, N = first35(p), fals = N - 1, tru = M - N + 1; return {
  prompt: `A claim about the battery cells of the Long Stair says that after n charging cycles a cell holds ${n(c)}ⁿ units of charge, which is more than its drain allowance of ${n(a)}n + ${n(b)} units. The claim is false for the early cycles and true from some cycle on. The log covers cycles 1 to ${n(M)}. Enter the first cycle at which the claim is true, then how many of the logged cycles it is false, then how many it is true.`,
  answer: [N, fals, tru],
  hints: [`Work out ${n(c)}ⁿ and ${n(a)}n + ${n(b)} for n = 1, 2, 3 and so on, and compare them. The first cycle where the first is bigger is where the claim starts to hold.`, 'The claim is false for every cycle before that one and true from that cycle to the last logged cycle, counting both ends.'],
  solution: `${rowsE(p, N)}. The first true cycle is n = ${n(N)}. Before it the claim is false, which is ${n(N)} − 1 = ${n(fals)} logged cycles. From it to cycle ${n(M)} the claim is true, which is ${n(M)} − ${n(N)} + 1 = ${n(tru)} logged cycles. The base case of an induction proof is cycle ${n(N)}.`,
  guidance: [
   { prompt: `Work out both sides for n = 1, 2, 3 and so on. What is the first n where ${n(c)}ⁿ > ${n(a)}n + ${n(b)}?`, answer: [N], explanation: `${rowsE(p, N)}. The first true case is n = ${n(N)}.` },
   { prompt: 'The claim is false for every cycle before that one. How many of the logged cycles is it false?', answer: [fals], explanation: `The false cycles are ${N === 3 ? '1 and 2' : `1 to ${n(N - 1)}`}, which is ${n(fals)} cycles.` },
   { prompt: `The claim is true from that cycle to cycle ${n(M)}. How many of the logged cycles is it true?`, answer: [tru], explanation: `Cycles ${n(N)} to ${n(M)} are true, and ${n(M)} − ${n(N)} + 1 = ${n(tru)}.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', title: 'A claim that starts late',
 brief: 'A heavier claim about the Long Stair’s lamps only starts to hold many steps up, and Mira wants to see the gap between its sides open out from there.',
 labels: ['first n where it holds', 'gap there', 'gap at the next n'], tolerance: 0.01,
 gl: [['first n where it holds'], ['gap there', 'gap at the next n']]
}, {
 canonical: { c: 2, a: 25, b: 30 },
 draw: R => { let p, N; do { p = { c: R.pick([2, 2, 3]), a: 0, b: R.int(5, 40) }; p.a = p.c === 2 ? R.int(12, 40) : R.int(30, 90); N = first35(p); } while (p.c === 2 ? (N < 7 || N > 11) : (N < 5 || N > 8)); return p; },
 build: p => { const { c, a, b } = p, N = first35(p), g = i => Math.pow(c, i) - (a * i + b), pw = i => Math.pow(c, i); return {
  prompt: `A heavier claim about the lamps of the Long Stair says that ${n(c)}ⁿ > ${n(a)}n + ${n(b)} for every whole number n from some step on, and an induction proof must start at its base case. The gap is the left side minus the right side. Enter the first whole number n at which the claim is true, then the gap at that n, then the gap at the next n, to see it widen. Type the numbers without commas.`,
  answer: [N, g(N), g(N + 1)],
  hints: [`Work out ${n(c)}ⁿ and ${n(a)}n + ${n(b)} for n = 1, 2, 3 and so on. The left side starts far behind, so expect to go on for a while.`, 'The base case is the first n where the left side is bigger. The gap is the left side minus the right side, at that n and then at n + 1.'],
  solution: `${rowsE(p, N)}. The first true case is n = ${n(N)}, so that is the base case. The gap there is ${n(pw(N))} − ${n(a * N + b)} = ${n(g(N))}. At n = ${n(N + 1)} the sides are ${n(pw(N + 1))} and ${n(a * (N + 1) + b)}, so the gap is ${n(g(N + 1))}, bigger than before. Each step multiplies the left side by ${n(c)} while the right side grows by only ${n(a)}, which is why the claim keeps holding once it starts.`,
  guidance: [
   { prompt: `Work out both sides for n = 1, 2, 3 and so on. What is the first n where ${n(c)}ⁿ > ${n(a)}n + ${n(b)}?`, answer: [N], explanation: `${rowsE(p, N)}. The first true case is n = ${n(N)}.` },
   { prompt: `Enter the gap, the left side minus the right side, at n = ${n(N)}, then at n = ${n(N + 1)}.`, answer: [g(N), g(N + 1)], explanation: `At n = ${n(N)}: ${n(pw(N))} − ${n(a * N + b)} = ${n(g(N))}. At n = ${n(N + 1)}: ${n(pw(N + 1))} − ${n(a * (N + 1) + b)} = ${n(g(N + 1))}, so the gap has widened.` }
  ] }; }
});

})();
