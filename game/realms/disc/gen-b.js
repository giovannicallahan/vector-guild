/* Discrete mathematics mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Counting helpers. fact(5) = 120; perm(8, 3) = 8 × 7 × 6; choose(10, 3) = 120; chain(8, 3) is the text "8 × 7 × 6". */
const fact = k => { let p = 1; for (let i = 2; i <= k; i++) p *= i; return p; };
const perm = (a, k) => { let p = 1; for (let i = 0; i < k; i++) p *= a - i; return p; };
const choose = (a, k) => k < 0 || k > a ? 0 : Math.round(perm(a, k) / fact(k));
const chain = (a, k) => Array.from({ length: k }, (_, i) => n(a - i)).join(' × ');
/* Running products of a chain: "8 × 7 = 56 and 56 × 6 = 336". */
const running = (a, k) => { const out = []; let p = a; for (let i = 1; i < k; i++) { out.push(`${n(p)} × ${n(a - i)} = ${n(p * (a - i))}`); p *= a - i; }
 return out.length === 1 ? out[0] : out.slice(0, -1).join(', ') + ' and ' + out[out.length - 1]; };
/* Superscript exponents: sup(7) = '⁷'; supE leaves out an exponent of 1 (x³y, not x³y¹). */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(d => SUP[+d]).join('');
const supE = e => e === 1 ? '' : sup(e);
/* A term c·v of a binomial ("2x", or "x" for c = 1) and its power ("(2x)³", "x³", "2x" for a power of 1). */
const term = (c, v) => c === 1 ? v : `${n(c)}${v}`;
const termPow = (c, v, e) => c === 1 ? `${v}${supE(e)}` : e === 1 ? `${n(c)}${v}` : `(${n(c)}${v})${sup(e)}`;
const LETTERS = 'ABCDEFGHIJKLMNOP';
const JOBS = ['driver', 'loader', 'checker', 'runner'];
const ITEMS = ['crates', 'fuel drums', 'tool cases', 'seed sacks'], STORES = ['crew office', 'kit room', 'night store'];
const list = words => words.length === 1 ? words[0] : words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1];
/* q17 stories: two where order matters (kind 1) and two where it does not (kind 2). */
const STORY = {
 1: [
  { text: (N, k) => `Mira plans a supply run that stops at ${n(k)} of the ${n(N)} domes, one after another, and a different order of stops is a different route.`, noun: 'domes',
    check: 'If two of the chosen domes swap places in the run, is it still the same route?', why: 'Swapping two stops gives a different route, so order matters: this is a permutation.' },
  { text: (N, k) => `The crew office gives ${n(k)} different awards, from the top award down, to ${n(k)} of its ${n(N)} packers; nobody gets two.`, noun: 'packers',
    check: 'If two winners swap awards, is it still the same result?', why: 'Swapping two awards gives a different result, so order matters: this is a permutation.' }
 ],
 2: [
  { text: (N, k) => `Mira picks ${n(k)} of the ${n(N)} crew to share a night shift; they all do the same work.`, noun: 'crew',
    check: 'If you list the same night-shift crew in another order, is it still the same shift?', why: 'Listing the same people in another order gives the same shift, so order does not matter: this is a combination.' },
  { text: (N, k) => `For a spot check, ${n(k)} of ${n(N)} crates are pulled from a stack and dropped into one sack together.`, noun: 'crates',
    check: 'If the same crates go into the sack in another order, is it still the same sackful?', why: 'The same crates in another order make the same sackful, so order does not matter: this is a combination.' }
 ]
};
/* q20: sets of three whole numbers with no common factor between any two, so a multiple of two of them is a multiple of their product. */
const TRIPLES = [[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 4, 5], [3, 4, 7], [3, 5, 7], [2, 5, 9], [3, 5, 8], [4, 5, 7], [2, 7, 9]];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Codes: a letter from A to the Lth letter, a first digit 1..a, a second digit 0..b; f = digit sum, range {1, …, a + b}.
    a >= 2 and b >= 3 so the sample code B23 exists; a + b <= 16 so some sums (17, 18) are never reached; under 1000 codes. */
 q11: {
  canonical: { L: 6, a: 4, b: 7 },
  draw: R => { let p; do { p = { L: R.int(4, 12), a: R.int(3, 9), b: R.int(3, 9) }; } while (p.a + p.b > 16 || p.L * p.a * (p.b + 1) >= 1000); return p; },
  build: ({ L, a, b }) => { const last = LETTERS[L - 1], count = L * a * (b + 1), top = a + b; return {
   prompt: `The labelling bay prints a code on every crate: one letter from A to ${last}, then a first digit from 1 to ${n(a)}, then a second digit from 0 to ${n(b)}. So B23 is one code. A checking function f sends each code to the sum of its two digits, so f(B23) = 5, and its codomain is the whole numbers from 0 to 18. Enter the number of different codes, then the size of the range of f.`,
   answer: [count, top],
   hints: ['A code is three choices made one after another, so the multiplicative principle applies: multiply the numbers of options for the three places.', 'The range is the set of outputs f really gives. Find the smallest and the largest digit sum a code can have, and check that every whole number between them is reached.'],
   solution: `There are ${n(L)} letters (A to ${last}), ${n(a)} first digits (1 to ${n(a)}) and ${n(b + 1)} second digits (0 to ${n(b)}). By the multiplicative principle there are ${n(L)} × ${n(a)} × ${n(b + 1)} = ${n(count)} codes. The smallest digit sum is 1 + 0 = 1 and the largest is ${n(a)} + ${n(b)} = ${n(top)}. Every whole number in between is reached as well (keep the first digit at 1 and raise the second, then raise the first), so the range is {1, 2, …, ${n(top)}}, which has ${n(top)} elements. The codomain also holds 0 and the sums from ${n(top + 1)} to 18, but no code reaches them, so f is not onto.`,
   guidance: [
    { prompt: 'How many options does each place of a code have: the letter, the first digit and the second digit?', answer: [L, a, b + 1], explanation: `A to ${last} is ${n(L)} letters, 1 to ${n(a)} is ${n(a)} digits, and 0 to ${n(b)} is ${n(b + 1)} digits, because 0 counts too.` },
    { prompt: 'Multiply the three numbers of options. How many codes are there?', answer: [count], explanation: `By the multiplicative principle, ${n(L)} × ${n(a)} × ${n(b + 1)} = ${n(count)}.` },
    { prompt: 'What are the smallest and the largest values f can give?', answer: [1, top], explanation: `The first digit is never 0, so the smallest sum is 1 + 0 = 1. The largest is ${n(a)} + ${n(b)} = ${n(top)}.` },
    { prompt: `Every whole number from 1 to ${n(top)} is the digit sum of some code. How many elements does the range of f have?`, answer: [top], explanation: `The range is {1, 2, …, ${n(top)}}, so it has ${n(top)} elements, far fewer than the ${n(count)} codes: many codes share a digit sum.` }
   ] }; }
 },
 /* k! orders of k different items on a shelf, k from 5 to 8 (the worked example is 4; 9! is above the 100000 answer limit).
    The item and the store vary too, so the prompts differ by more than one number. */
 q12: {
  canonical: { k: 6, i: 0, s: 0 },
  draw: R => ({ k: R.int(5, 8), i: R.int(0, ITEMS.length - 1), s: R.int(0, STORES.length - 1) }),
  build: ({ k, i, s }) => { const f = fact(k), ch = chain(k, k), it = ITEMS[i]; return {
   prompt: `A shelf in the ${STORES[s]} has ${n(k)} spaces in a row, and ${n(k)} different ${it} must go on it, one in each space. Mira wants to know how many different orders there are. Enter ${n(k)}!, the number of orders (type it without commas if it is 1000 or more).`,
   answer: [f],
   hints: [`Fill the spaces from left to right. The first space can take any of the ${n(k)} ${it}; the next can take any that are left.`, `Multiply the numbers of choices for all the spaces: ${ch}.`],
   solution: `The first space has ${n(k)} choices, the second ${n(k - 1)}, and so on down to 1 choice for the last space. By the multiplicative principle the number of orders is ${n(k)}! = ${ch} = ${n(f)}.`,
   guidance: [
    { prompt: `How many of the ${it} can go in the first space, and how many are left to choose from for the second space?`, answer: [k, k - 1], explanation: `Any of the ${n(k)} can go first. Whichever it is, ${n(k - 1)} remain for the second space.` },
    { prompt: `The choices keep dropping by one, down to a single choice for the last space. What is ${ch}?`, answer: [f], explanation: `${running(k, k)}. So ${n(k)}! = ${n(f)}.` }
   ] }; }
 },
 /* P(N, k): k ranked jobs from N crew, N 6–12, k 2–4 (the worked example is P(5, 2)). */
 q13: {
  canonical: { N: 8, k: 3 },
  draw: R => ({ N: R.int(6, 12), k: R.int(2, 4) }),
  build: ({ N, k }) => { const p = perm(N, k), ch = chain(N, k), jobs = JOBS.slice(0, k); return {
   prompt: `Mira has ${n(N)} crew members on shift and needs ${list(jobs.map(j => 'a ' + j))}: ${n(k)} different jobs, one person each, and nobody does two. Enter P(${n(N)}, ${n(k)}), the number of ways to fill the jobs (type it without commas if it is 1000 or more).`,
   answer: [p],
   hints: [`Fill the jobs in order. The ${jobs[0]} can be any of the ${n(N)} crew; the ${jobs[1]} can be anyone except the ${jobs[0]}.`, `Multiply ${n(k)} numbers, starting at ${n(N)} and going down by one each time. The same count is ${n(N)}! ÷ ${n(N - k)}!.`],
   solution: `${list([`The ${jobs[0]} can be chosen in ${n(N)} ways`, ...jobs.slice(1).map((j, i) => `the ${j} in ${n(N - 1 - i)}`)])}. By the multiplicative principle P(${n(N)}, ${n(k)}) = ${ch} = ${n(p)}. The same number is ${n(N)}! ÷ ${n(N - k)}!, because the factors from ${n(N - k)} down to 1 cancel.`,
   guidance: [
    { prompt: `How many crew could be the ${jobs[0]}? Once the ${jobs[0]} is picked, how many could be the ${jobs[1]}?`, answer: [N, N - 1], explanation: `Anyone of the ${n(N)} can be the ${jobs[0]}. The ${jobs[1]} is anyone else: ${n(N - 1)} people.` },
    { prompt: `Each job after that has one fewer choice. What is ${ch}?`, answer: [p], explanation: `${running(N, k)}. So P(${n(N)}, ${n(k)}) = ${n(p)}.` }
   ] }; }
 },
 /* C(N, k) = P(N, k) ÷ k!, N 7–15, k 2–5, with P(N, k) below 100000 (the worked example is C(6, 2)). */
 q14: {
  canonical: { N: 10, k: 3 },
  draw: R => { let p; do { p = { N: R.int(7, 15), k: R.int(2, 5) }; } while (perm(p.N, p.k) >= 100000); return p; },
  build: ({ N, k }) => { const p = perm(N, k), kf = fact(k), c = choose(N, k), ch = chain(N, k); return {
   prompt: `Mira must send ${n(k)} of the ${n(N)} crew on shift to the ice field as one team. Everyone on the team does the same work, so only who goes matters, not the order they were picked in. Enter C(${n(N)}, ${n(k)}), the number of different teams (type it without commas if it is 1000 or more).`,
   answer: [c],
   hints: [`First count the ordered picks, P(${n(N)}, ${n(k)}). Each team then turns up once for every order of its ${n(k)} members.`, `A team of ${n(k)} can be put in order in ${n(k)}! = ${n(kf)} ways, so divide P(${n(N)}, ${n(k)}) by ${n(kf)}.`],
   solution: `Picking the team one person at a time gives P(${n(N)}, ${n(k)}) = ${ch} = ${n(p)} ordered picks. Each team of ${n(k)} appears ${n(k)}! = ${n(kf)} times in that count, once for each order of its members. So C(${n(N)}, ${n(k)}) = ${n(p)} ÷ ${n(kf)} = ${n(c)}, which is also ${n(N)}! ÷ (${n(k)}! × ${n(N - k)}!).`,
   guidance: [
    { prompt: `If the order of picking did matter, how many ordered picks of ${n(k)} from ${n(N)} would there be? That is P(${n(N)}, ${n(k)}) = ${ch}.`, answer: [p], explanation: `${running(N, k)}: ${n(p)} ordered picks.` },
    { prompt: `In how many orders can one team of ${n(k)} be listed? That is ${n(k)}!.`, answer: [kf], explanation: `${n(k)}! = ${chain(k, k)} = ${n(kf)}. Every team was counted that many times among the ordered picks.` },
    { prompt: `Divide the ordered picks by the orders of each team. What is ${n(p)} ÷ ${n(kf)}?`, answer: [c], explanation: `${n(p)} ÷ ${n(kf)} = ${n(c)} different teams.` }
   ] }; }
 },
 /* N-bit strings with exactly k ones, C(N, k), built from row N − 1 of Pascal's triangle; and 2^N subsets. N 5–12, k 2..N − 2. */
 q15: {
  canonical: { N: 7, k: 3 },
  draw: R => { const N = R.int(5, 12); return { N, k: R.int(2, N - 2) }; },
  build: ({ N, k }) => { const left = choose(N - 1, k - 1), right = choose(N - 1, k), c = choose(N, k), s = Math.pow(2, N); return {
   prompt: `The crew office logs each shift as a bit string: a row of ${n(N)} digits, one for each crew member, each 0 (off duty) or 1 (on duty). Enter the number of ${n(N)}-bit strings with exactly ${n(k)} ones, then the number of subsets of a set of ${n(N)} crew (type them without commas if they are 1000 or more).`,
   answer: [c, s],
   hints: [`A string with exactly ${n(k)} ones is fixed by choosing which ${n(k)} of the ${n(N)} places hold a 1, so the count is C(${n(N)}, ${n(k)}): entry ${n(k)} of row ${n(N)} of Pascal’s triangle, counting rows and entries from 0.`, `A subset is fixed by saying “in” or “out” for each of the ${n(N)} crew, which is exactly a bit string. Count all the ${n(N)}-bit strings.`],
   solution: `Choosing the ${n(k)} places that hold a 1 gives C(${n(N)}, ${n(k)}) strings. In Pascal’s triangle it is the sum of the two entries above it in row ${n(N - 1)}: C(${n(N - 1)}, ${n(k - 1)}) + C(${n(N - 1)}, ${n(k)}) = ${n(left)} + ${n(right)} = ${n(c)}. Each subset of the ${n(N)} crew matches one bit string (1 means in the subset, 0 means out), and each of the ${n(N)} places has 2 choices, so there are 2${sup(N)} = ${n(s)} subsets.`,
   guidance: [
    { prompt: `In row ${n(N - 1)} of Pascal’s triangle, what are C(${n(N - 1)}, ${n(k - 1)}) and C(${n(N - 1)}, ${n(k)}), the two entries above C(${n(N)}, ${n(k)})?`, answer: [left, right], explanation: `C(${n(N - 1)}, ${n(k - 1)}) = ${n(left)} and C(${n(N - 1)}, ${n(k)}) = ${n(right)}, from the row or from n! ÷ (k! × (n − k)!).` },
    { prompt: `Each entry of Pascal’s triangle is the sum of the two entries above it. What is ${n(left)} + ${n(right)}?`, answer: [c], explanation: `${n(left)} + ${n(right)} = ${n(c)}: that many ${n(N)}-bit strings have exactly ${n(k)} ones.` },
    { prompt: `Each of the ${n(N)} places in a bit string is 0 or 1. How many ${n(N)}-bit strings are there in all, and so how many subsets of ${n(N)} crew?`, answer: [s], explanation: `${n(N)} places with 2 choices each give 2${sup(N)} = ${n(s)} strings, one for each subset.` }
   ] }; }
 },
 /* Coefficient of x^k y^(N−k) in (ax + by)^N: C(N, k) a^k b^(N−k). a, b in 1–3, not both 1; N 4–7; k 1..N − 1.
    Never the worked example, (x + 3y)⁴ and x²y². */
 q16: {
  canonical: { a: 2, b: 1, N: 5, k: 3 },
  draw: R => { let p; do { const N = R.int(4, 7); p = { a: R.int(1, 3), b: R.int(1, 3), N, k: R.int(1, N - 1) }; } while ((p.a === 1 && p.b === 1) || (p.a === 1 && p.b === 3 && p.N === 4 && p.k === 2)); return p; },
  build: ({ a, b, N, k }) => { const j = N - k, bc = choose(N, k), ak = Math.pow(a, k), bj = Math.pow(b, j), coef = bc * ak * bj,
   expr = `(${term(a, 'x')} + ${term(b, 'y')})${sup(N)}`, mono = `x${supE(k)}y${supE(j)}`,
   /* Powers of a number 1 are left out of the working (one of a and b is always above 1). */
   pows = [[a, k, ak], [b, j, bj]].filter(([c]) => c !== 1), powText = list(pows.map(([c, e]) => `${n(c)}${sup(e)}`)),
   factors = [bc, ...pows.map(x => x[2])].map(n).join(' × '); return {
   prompt: `Mira’s rota formula has to be multiplied out: ${expr}. Enter the coefficient of ${mono} in the expansion, the number in front of it once like terms are collected (type it without commas if it is 1000 or more).`,
   answer: [coef],
   hints: [`By the binomial theorem, the term with ${mono} is C(${n(N)}, ${n(k)}) × ${termPow(a, 'x', k)} × ${termPow(b, 'y', j)}.`, `Work out C(${n(N)}, ${n(k)}) and ${powText}, and multiply them.`],
   solution: `By the binomial theorem, the term of ${expr} with ${mono} is C(${n(N)}, ${n(k)}) × ${termPow(a, 'x', k)} × ${termPow(b, 'y', j)}. Here ${list([`C(${n(N)}, ${n(k)}) = ${n(bc)}`, ...pows.map(([c, e, v]) => `${n(c)}${sup(e)} = ${n(v)}`)])}, so the coefficient is ${factors} = ${n(coef)}.`,
   guidance: [
    { prompt: `The term with ${mono} picks x from ${n(k)} of the ${n(N)} brackets and y from the rest. In how many ways can those ${n(k)} brackets be chosen? Enter C(${n(N)}, ${n(k)}).`, answer: [bc], explanation: `C(${n(N)}, ${n(k)}) = ${n(bc)}, the binomial coefficient in row ${n(N)} of Pascal’s triangle.` },
    { prompt: `Each chosen x brings a factor ${n(a)} and each y a factor ${n(b)}. What are ${n(a)}${sup(k)} and ${n(b)}${sup(j)}?`, answer: [ak, bj], explanation: `${n(a)}${sup(k)} = ${n(ak)} and ${n(b)}${sup(j)} = ${n(bj)}.` },
    { prompt: `Multiply the three numbers. What is ${n(bc)} × ${n(ak)} × ${n(bj)}?`, answer: [coef], explanation: `${n(bc)} × ${n(ak)} × ${n(bj)} = ${n(coef)}, so the term is ${n(coef)}${mono}.` }
   ] }; }
 },
 /* Order or no order: kind 1 (permutation) or 2 (combination), story s, N 6–12, k 2–4. */
 q17: {
  canonical: { kind: 1, s: 0, N: 7, k: 3 },
  draw: R => ({ kind: R.pick([1, 2]), s: R.int(0, 1), N: R.int(6, 12), k: R.int(2, 4) }),
  build: ({ kind, s, N, k }) => { const st = STORY[kind][s], p = perm(N, k), kf = fact(k), c = choose(N, k), ch = chain(N, k), count = kind === 1 ? p : c; return {
   prompt: `${st.text(N, k)} Is this a count of arrangements, where order matters, or of selections, where it does not? Enter 1 for a permutation or 2 for a combination, then the number of ways (type it without commas if it is 1000 or more).`,
   answer: [kind, count],
   hints: [`Swap two of the chosen ${st.noun} around. If that gives a different outcome, order matters.`, `For a permutation multiply ${n(k)} numbers going down from ${n(N)}; for a combination, divide that product by ${n(k)}!.`],
   solution: kind === 1 ? `${st.why} P(${n(N)}, ${n(k)}) = ${ch} = ${n(p)}.` : `${st.why} C(${n(N)}, ${n(k)}) = (${ch}) ÷ ${n(k)}! = ${n(p)} ÷ ${n(kf)} = ${n(c)}.`,
   guidance: [
    { prompt: `${st.check} Enter 1 if it changes (order matters) or 2 if it stays the same (order does not matter).`, answer: [kind], explanation: st.why },
    { prompt: `First count ordered choices of ${n(k)} from ${n(N)}. What is ${ch}?`, answer: [p], explanation: `${running(N, k)}: P(${n(N)}, ${n(k)}) = ${n(p)}.` },
    kind === 1
     ? { prompt: 'Order matters here, so nothing is divided out. How many ways are there?', answer: [p], explanation: `Each ordered choice is a different outcome, so there are ${n(p)} ways.` }
     : { prompt: `Order does not matter, so each group was counted ${n(k)}! = ${n(kf)} times. What is ${n(p)} ÷ ${n(kf)}?`, answer: [c], explanation: `${n(p)} ÷ ${n(kf)} = ${n(c)} ways.` }
   ] }; }
 },
 /* Crews of k from e engineers and m packers with at least one engineer: C(e + m, k) − C(m, k). m > k so the
    no-engineer count is at least 4; all crews under 1000. The worked example is e 2, m 4, k 2. */
 q18: {
  canonical: { e: 3, m: 6, k: 3 },
  draw: R => { let p; do { const k = R.int(3, 4); p = { e: R.int(2, 5), m: R.int(k + 1, 9), k }; } while (choose(p.e + p.m, p.k) >= 1000); return p; },
  build: ({ e, m, k }) => { const T = e + m, all = choose(T, k), none = choose(m, k), some = all - none; return {
   prompt: `The packing floor has ${n(e)} engineers and ${n(m)} packers. Mira needs a crew of ${n(k)}, and the crew must include at least one engineer. Enter the number of crews of ${n(k)} with no rule at all, then the number with no engineer, then the number with at least one engineer.`,
   answer: [all, none, some],
   hints: [`With no rule, a crew is any ${n(k)} of the ${n(T)} people, in no order.`, 'A crew with no engineer is made of packers only. Every crew has either no engineer or at least one, never both, so take one count away from the other.'],
   solution: `With no rule there are C(${n(T)}, ${n(k)}) = ${n(all)} crews. A crew with no engineer is ${n(k)} of the ${n(m)} packers: C(${n(m)}, ${n(k)}) = ${n(none)}. Every other crew has at least one engineer, so the count is ${n(all)} − ${n(none)} = ${n(some)}. Counting the crews with exactly one, two or more engineers and adding gives the same total with far more work.`,
   guidance: [
    { prompt: `How many people are there in all, and how many crews of ${n(k)} can be made from them with no rule?`, answer: [T, all], explanation: `${n(e)} + ${n(m)} = ${n(T)} people, and C(${n(T)}, ${n(k)}) = ${n(all)} crews.` },
    { prompt: `How many crews of ${n(k)} can be made from the ${n(m)} packers alone?`, answer: [none], explanation: `C(${n(m)}, ${n(k)}) = ${n(none)}: these are exactly the crews with no engineer.` },
    { prompt: `Take away the crews with no engineer. What is ${n(all)} − ${n(none)}?`, answer: [some], explanation: `${n(all)} − ${n(none)} = ${n(some)} crews have at least one engineer.` }
   ] }; }
 },
 /* N identical crates among k domes: C(N + k − 1, k − 1) with none allowed, C(N − 1, k − 1) with at least one each.
    k 3–4, N 5–12 with at least 2 crates left after one each. The worked example is 4 crates among 3 domes. */
 q19: {
  canonical: { N: 8, k: 3 },
  draw: R => { let p; do { p = { N: R.int(5, 12), k: R.int(3, 4) }; } while (p.N - p.k < 2); return p; },
  build: ({ N, k }) => { const bars = k - 1, slots = N + bars, free = choose(slots, bars), left = N - k, each = choose(N - 1, bars); return {
   prompt: `A delivery of ${n(N)} identical crates of water must be shared among ${n(k)} domes; all that matters is how many crates each dome gets. Enter the number of ways if a dome may get no crates, then the number of ways if every dome gets at least one crate.`,
   answer: [free, each],
   hints: [`Write the ${n(N)} crates as stars in a row and put ${n(bars)} bars among them to cut the row into ${n(k)} groups, one group per dome. Count the ways to choose which of the ${n(slots)} places in the row hold bars.`, `For “at least one each”, first give every dome one crate, then share the ${n(left)} crates that are left with no rule.`],
   solution: `A sharing is a row of ${n(N)} stars and ${n(bars)} bars: ${n(slots)} symbols, and the bars can be in any ${n(bars)} of the ${n(slots)} places. So there are C(${n(slots)}, ${n(bars)}) = ${n(free)} ways when a dome may get none. If every dome gets at least one crate, hand one to each dome first; the other ${n(left)} are shared freely, as ${n(left)} stars and ${n(bars)} bars, in C(${n(N - 1)}, ${n(bars)}) = ${n(each)} ways.`,
   guidance: [
    { prompt: `How many symbols are in a row of ${n(N)} stars and ${n(bars)} bars, and in how many ways can the bars be placed among them?`, answer: [slots, free], explanation: `${n(N)} + ${n(bars)} = ${n(slots)} symbols. Choosing the ${n(bars)} places for the bars gives C(${n(slots)}, ${n(bars)}) = ${n(free)}.` },
    { prompt: 'Now every dome must get at least one crate. Give each dome one crate first. How many crates are left to share?', answer: [left], explanation: `${n(N)} − ${n(k)} = ${n(left)} crates are left, and they can go anywhere.` },
    { prompt: `Share the ${n(left)} crates with no rule: ${n(left)} stars and ${n(bars)} bars. How many ways is that?`, answer: [each], explanation: `${n(left)} + ${n(bars)} = ${n(N - 1)} symbols, so C(${n(N - 1)}, ${n(bars)}) = ${n(each)} ways.` }
   ] }; }
 },
 /* Codes 1..N that are multiples of at least one, and of none, of a, b, c (no common factor between any two).
    N 100–400 with abc <= N, so every count in the working is at least 1. The worked example is N 50 with 2, 3, 7. */
 q20: {
  canonical: { N: 200, t: 0 },
  draw: R => { let p; do { p = { N: R.int(100, 400), t: R.int(0, TRIPLES.length - 1) }; } while (TRIPLES[p.t].reduce((x, y) => x * y, 1) > p.N); return p; },
  build: ({ N, t }) => { const [a, b, c] = TRIPLES[t], f = d => Math.floor(N / d), ab = a * b, ac = a * c, bc = b * c, abc = a * b * c,
   na = f(a), nb = f(b), nc = f(c), nab = f(ab), nac = f(ac), nbc = f(bc), nabc = f(abc), S1 = na + nb + nc, S2 = nab + nac + nbc, U = S1 - S2 + nabc, none = N - U; return {
   prompt: `Crate codes run from 1 to ${n(N)}. Every code that is a multiple of ${n(a)}, ${n(b)} or ${n(c)} is kept for special stock. Enter how many codes are multiples of at least one of ${n(a)}, ${n(b)} and ${n(c)}, then how many are multiples of none of them.`,
   answer: [U, none],
   hints: [`The number of multiples of ${n(a)} from 1 to ${n(N)} is ${n(N)} ÷ ${n(a)} with any decimal part thrown away. No two of the three numbers share a factor, so a code that is a multiple of both ${n(a)} and ${n(b)} is a multiple of ${n(ab)}.`, `Add the three single counts, take away the three pair counts, then add back the count of multiples of all three, which are the multiples of ${n(abc)}.`],
   solution: `Multiples of ${n(a)}: ${n(na)}; of ${n(b)}: ${n(nb)}; of ${n(c)}: ${n(nc)}; together ${n(S1)}. Multiples of ${n(ab)}: ${n(nab)}; of ${n(ac)}: ${n(nac)}; of ${n(bc)}: ${n(nbc)}; together ${n(S2)}. Multiples of ${n(abc)}: ${n(nabc)}. By inclusion–exclusion, ${n(S1)} − ${n(S2)} + ${n(nabc)} = ${n(U)} codes are multiples of at least one of the three, so ${n(N)} − ${n(U)} = ${n(none)} are multiples of none.`,
   guidance: [
    { prompt: `How many codes from 1 to ${n(N)} are multiples of ${n(a)}, how many of ${n(b)}, and how many of ${n(c)}?`, answer: [na, nb, nc], explanation: `${n(N)} ÷ ${n(a)}, ${n(N)} ÷ ${n(b)} and ${n(N)} ÷ ${n(c)}, each without its decimal part: ${n(na)}, ${n(nb)} and ${n(nc)}.` },
    { prompt: `Codes that are multiples of two of the numbers were counted twice. How many are multiples of ${n(ab)}, of ${n(ac)} and of ${n(bc)}?`, answer: [nab, nac, nbc], explanation: `${n(N)} ÷ ${n(ab)}, ${n(N)} ÷ ${n(ac)} and ${n(N)} ÷ ${n(bc)} without decimal parts: ${n(nab)}, ${n(nac)} and ${n(nbc)}.` },
    { prompt: `How many codes are multiples of ${n(abc)}? Then put the counts together: the singles, minus the pairs, plus this one.`, answer: [nabc, U], explanation: `Multiples of ${n(abc)}: ${n(nabc)}. Then ${n(S1)} − ${n(S2)} + ${n(nabc)} = ${n(U)} codes are multiples of at least one of the three.` },
    { prompt: `Take those away from all ${n(N)} codes. How many are multiples of none of the three?`, answer: [none], explanation: `${n(N)} − ${n(U)} = ${n(none)} codes are multiples of none of ${n(a)}, ${n(b)} and ${n(c)}.` }
   ] }; }
 }
});
})();
