/* Discrete mathematics practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p4.js. */
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
/* Counting helpers. fact(5) = 120; perm(8, 3) = 8 × 7 × 6; choose(10, 3) = 120; chain(8, 3) is the text "8 × 7 × 6". */
const fact = k => { let p = 1; for (let i = 2; i <= k; i++) p *= i; return p; };
const perm = (a, k) => { let p = 1; for (let i = 0; i < k; i++) p *= a - i; return p; };
const choose = (a, k) => k < 0 || k > a ? 0 : Math.round(perm(a, k) / fact(k));
const chain = (a, k) => Array.from({ length: k }, (_, i) => n(a - i)).join(' × ');
/* Running products of a chain: "8 × 7 = 56 and 56 × 6 = 336". */
const running = (a, k) => { const out = []; let p = a; for (let i = 1; i < k; i++) { out.push(`${n(p)} × ${n(a - i)} = ${n(p * (a - i))}`); p *= a - i; }
 return out.length === 1 ? out[0] : out.slice(0, -1).join(', ') + ' and ' + out[out.length - 1]; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(d => SUP[+d]).join('');
const supE = e => e === 1 ? '' : sup(e);
/* A term c·v of a binomial ("2x", or "x" for c = 1) and its power ("(2x)³", "x³", "2x" for a power of 1). */
const term = (c, v) => c === 1 ? v : `${n(c)}${v}`;
const termPow = (c, v, e) => c === 1 ? `${v}${supE(e)}` : e === 1 ? `${n(c)}${v}` : `(${n(c)}${v})${sup(e)}`;
const list = words => words.length === 1 ? words[0] : words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1];

/* ---- q16 The binomial theorem [Levin 1.2] ---- */

/* q16b: coefficient of f^(N−j) w^j in (a f + b w)^N, asked by the power of the second letter. a, b in 1–3, not both 1;
   N 4–7; j 1..N − 1. The learn mission's example, (x + 3y)⁴, uses other letters. */
mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The fan schedule formula',
 brief: 'The greenhouse fans run on a bracket formula, and Mira needs one term of it without multiplying the whole thing out.',
 labels: ['coefficient'], tolerance: 0.01,
 gl: [['binomial coefficient'], ['number for f to its power', 'number for w to its power'], ['coefficient']]
}, {
 canonical: { a: 2, b: 3, N: 5, j: 2 },
 draw: R => { let p; do { const N = R.int(4, 7); p = { a: R.int(1, 3), b: R.int(1, 3), N, j: R.int(1, N - 1) }; } while (p.a === 1 && p.b === 1); return p; },
 build: ({ a, b, N, j }) => { const k = N - j, bc = choose(N, j), ak = Math.pow(a, k), bj = Math.pow(b, j), coef = bc * ak * bj,
  expr = `(${term(a, 'f')} + ${term(b, 'w')})${sup(N)}`, mono = `f${supE(k)}w${supE(j)}`,
  pows = [[a, k, ak], [b, j, bj]].filter(([c]) => c !== 1), powText = list(pows.map(([c, e]) => `${n(c)}${sup(e)}`)),
  factors = [bc, ...pows.map(x => x[2])].map(n).join(' × '); return {
  prompt: `The greenhouse fan schedule is set by the formula ${expr}, where f stands for the day fan bank and w for the wet-bench fan bank. Multiply it out and find the term that has w to the power ${n(j)}. Enter the coefficient of that term, the number in front of it once like terms are collected (type it without commas if it is 1000 or more).`,
  answer: [coef],
  hints: [`The letter w is picked from ${n(j)} of the ${n(N)} brackets, and f from the other ${n(k)}. Count the ways to choose those ${n(j)} brackets.`, `Each f brings a factor ${n(a)} and each w a factor ${n(b)}. Multiply the number of ways by ${powText}.`],
  solution: `The term with w${supE(j)} also has f${supE(k)}, since the powers add up to ${n(N)}. By the binomial theorem it is C(${n(N)}, ${n(j)}) × ${termPow(a, 'f', k)} × ${termPow(b, 'w', j)}. Here ${list([`C(${n(N)}, ${n(j)}) = ${n(bc)}`, ...pows.map(([c, e, v]) => `${n(c)}${sup(e)} = ${n(v)}`)])}, so the coefficient is ${factors} = ${n(coef)}.`,
  guidance: [
   { prompt: `The term with w${supE(j)} takes w from ${n(j)} of the ${n(N)} brackets and f from the rest. In how many ways can those ${n(j)} brackets be chosen? Enter C(${n(N)}, ${n(j)}).`, answer: [bc], explanation: `C(${n(N)}, ${n(j)}) = ${n(bc)}, a number in row ${n(N)} of Pascal’s triangle.` },
   { prompt: `Each f brings a factor ${n(a)} and each w a factor ${n(b)}. The term has ${n(k)} ${k === 1 ? 'f' : 'f’s'} and ${n(j)} ${j === 1 ? 'w' : 'w’s'}. What are ${n(a)}${sup(k)} and ${n(b)}${sup(j)}?`, answer: [ak, bj], explanation: `${n(a)}${sup(k)} = ${n(ak)} and ${n(b)}${sup(j)} = ${n(bj)}.` },
   { prompt: `Multiply the three numbers. What is ${n(bc)} × ${n(ak)} × ${n(bj)}?`, answer: [coef], explanation: `${n(bc)} × ${n(ak)} × ${n(bj)} = ${n(coef)}, so the term is ${n(coef)}${mono}.` }
  ] }; }
});

/* q16c: coefficient of c^k w^(N−k) in (a c + b w)^N, then its cost at p credits a unit. Cost under 100000. */
mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Pricing the stock formula',
 brief: 'The stock formula gives the crates in each term, and the ledger needs one term turned into credits.',
 labels: ['coefficient', 'cost in credits'], tolerance: 0.01,
 gl: [['binomial coefficient'], ['coefficient'], ['cost in credits']]
}, {
 canonical: { a: 3, b: 2, N: 5, k: 3, p: 4 },
 draw: R => { let p; do { const N = R.int(4, 7); p = { a: R.int(1, 3), b: R.int(1, 3), N, k: R.int(1, N - 1), p: R.int(2, 6) }; }
  while ((p.a === 1 && p.b === 1) || choose(p.N, p.k) * Math.pow(p.a, p.k) * Math.pow(p.b, p.N - p.k) * p.p >= 100000); return p; },
 build: ({ a, b, N, k, p }) => { const j = N - k, bc = choose(N, k), ak = Math.pow(a, k), bj = Math.pow(b, j), coef = bc * ak * bj, cost = coef * p,
  expr = `(${term(a, 'c')} + ${term(b, 'w')})${sup(N)}`, mono = `c${supE(k)}w${supE(j)}`,
  pows = [[a, k, ak], [b, j, bj]].filter(([c]) => c !== 1), factors = [bc, ...pows.map(x => x[2])].map(n).join(' × '); return {
  prompt: `The depot stock formula is ${expr}, where c stands for a crate of cable and w for a crate of wire. In the formula’s expansion, the coefficient of the term ${mono} is the number of crates that term stands for, and each of those crates is priced at ${n(p)} credits. Enter that coefficient, then the cost in credits of the crates the term ${mono} stands for (type each without commas if it is 1000 or more).`,
  answer: [coef, cost],
  hints: [`The term ${mono} takes c from ${n(k)} of the ${n(N)} brackets. Count the ways to choose those brackets, then multiply by the numbers in front of c and w raised to their powers.`, 'Once you have the coefficient, the cost is the number of crates times the price of one crate.'],
  solution: `By the binomial theorem the term ${mono} of ${expr} has coefficient ${[`C(${n(N)}, ${n(k)})`, ...pows.map(([c, e]) => `${n(c)}${sup(e)}`)].join(' × ')}, that is ${factors} = ${n(coef)}. At ${n(p)} credits a crate, ${n(coef)} crates cost ${n(coef)} × ${n(p)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `The term ${mono} takes c from ${n(k)} of the ${n(N)} brackets. In how many ways can those brackets be chosen? Enter C(${n(N)}, ${n(k)}).`, answer: [bc], explanation: `C(${n(N)}, ${n(k)}) = ${n(bc)}.` },
   { prompt: `Each c brings a factor ${n(a)} and each w a factor ${n(b)}. Multiply ${n(bc)} by ${n(a)}${sup(k)} and by ${n(b)}${sup(j)}. What is the coefficient?`, answer: [coef], explanation: `${n(a)}${sup(k)} = ${n(ak)} and ${n(b)}${sup(j)} = ${n(bj)}, so the coefficient is ${n(bc)} × ${n(ak)} × ${n(bj)} = ${n(coef)}.` },
   { prompt: `Each crate costs ${n(p)} credits. What is ${n(coef)} × ${n(p)}?`, answer: [cost], explanation: `${n(coef)} × ${n(p)} = ${n(cost)} credits.` }
  ] }; }
});

/* q16d (uses q15, Pascal's triangle): two neighbouring terms of (a u + b v)^N. a, b in 2–3, N 7–8, every answer under 100000. */
mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', title: 'Two neighbouring terms', uses: 'q15',
 brief: 'Mira has a long rota formula, and the ledger needs two terms that sit side by side in its expansion.',
 labels: ['first coefficient', 'second coefficient'], tolerance: 0.01,
 gl: [['first binomial coefficient', 'second binomial coefficient'], ['first coefficient'], ['second coefficient']]
}, {
 canonical: { a: 2, b: 3, N: 7, k: 4 },
 draw: R => { let p; do { const N = R.int(7, 8); p = { a: R.int(2, 3), b: R.int(2, 3), N, k: R.int(2, N - 2) }; }
  while (choose(p.N, p.k + 1) * Math.pow(p.a, p.k + 1) * Math.pow(p.b, p.N - p.k - 1) >= 100000 || choose(p.N, p.k) * Math.pow(p.a, p.k) * Math.pow(p.b, p.N - p.k) >= 100000); return p; },
 build: ({ a, b, N, k }) => { const j = N - k, k2 = k + 1, j2 = j - 1, c1 = choose(N, k), c2 = choose(N, k2), a1 = Math.pow(a, k), b1 = Math.pow(b, j), a2 = Math.pow(a, k2), b2 = Math.pow(b, j2),
  r1 = c1 * a1 * b1, r2 = c2 * a2 * b2, expr = `(${n(a)}u + ${n(b)}v)${sup(N)}`, m1 = `u${supE(k)}v${supE(j)}`, m2 = `u${supE(k2)}v${supE(j2)}`; return {
  prompt: `The long-range rota formula is ${expr}. When it is multiplied out, the terms ${m1} and ${m2} sit side by side. Enter the coefficient of ${m1}, then the coefficient of ${m2} (type each without commas if it is 1000 or more).`,
  answer: [r1, r2],
  hints: [`Both coefficients come from row ${n(N)} of Pascal’s triangle: the entries for ${n(k)} and for ${n(k2)} of the ${n(N)} brackets giving u.`, `Multiply each entry by ${n(a)} to the power of u’s exponent and by ${n(b)} to the power of v’s exponent.`],
  solution: `By the binomial theorem the term ${m1} has coefficient C(${n(N)}, ${n(k)}) × ${n(a)}${sup(k)} × ${n(b)}${sup(j)} = ${n(c1)} × ${n(a1)} × ${n(b1)} = ${n(r1)}. The term ${m2} has coefficient C(${n(N)}, ${n(k2)}) × ${n(a)}${sup(k2)} × ${n(b)}${supE(j2)} = ${n(c2)} × ${n(a2)} × ${n(b2)} = ${n(r2)}.`,
  guidance: [
   { prompt: `Row ${n(N)} of Pascal’s triangle holds the binomial coefficients. Enter C(${n(N)}, ${n(k)}) and C(${n(N)}, ${n(k2)}).`, answer: [c1, c2], explanation: `C(${n(N)}, ${n(k)}) = ${n(c1)} and C(${n(N)}, ${n(k2)}) = ${n(c2)}, two neighbours in row ${n(N)}.` },
   { prompt: `For ${m1}, multiply ${n(c1)} by ${n(a)}${sup(k)} and by ${n(b)}${sup(j)}. What is the coefficient?`, answer: [r1], explanation: `${n(a)}${sup(k)} = ${n(a1)} and ${n(b)}${sup(j)} = ${n(b1)}, so ${n(c1)} × ${n(a1)} × ${n(b1)} = ${n(r1)}.` },
   { prompt: `For ${m2}, multiply ${n(c2)} by ${n(a)}${sup(k2)} and by ${n(b)}${supE(j2)}. What is the coefficient?`, answer: [r2], explanation: `${n(a)}${sup(k2)} = ${n(a2)} and ${n(b)}${supE(j2)} = ${n(b2)}, so ${n(c2)} × ${n(a2)} × ${n(b2)} = ${n(r2)}.` }
  ] }; }
});

/* ---- q17 Chapter review: order or no order? [Levin 1.3] ---- */

/* q17b: four new stories, two where order matters (kind 1) and two where it does not (kind 2). N 8–12, k 3–5. */
const STORY2 = {
 1: [
  { text: (N, k) => `The observatory lists ${n(k)} of its ${n(N)} telescopes in the order they will be used through the night, and a different order is a different night plan.`, noun: 'telescopes',
    check: 'If two of the listed telescopes swap places in the plan, is it still the same night plan?', why: 'Swapping two telescopes gives a different night plan, so order matters: this is a permutation.' },
  { text: (N, k) => `Seedlings from a tray of ${n(N)} are planted one each into ${n(k)} pots standing in a row, and the pots are numbered, so which seedling goes in which pot counts.`, noun: 'seedlings',
    check: 'If two seedlings swap pots, is it still the same planting?', why: 'Swapping two seedlings gives a different planting, so order matters: this is a permutation.' }
 ],
 2: [
  { text: (N, k) => `A first-aid box is packed with ${n(k)} of the ${n(N)} different vials in the medicine store, all tipped in together.`, noun: 'vials',
    check: 'If the same vials are tipped into the box in another order, is it still the same box?', why: 'The same vials in another order make the same box, so order does not matter: this is a combination.' },
  { text: (N, k) => `The greenhouse sends ${n(k)} of its ${n(N)} gardeners to one meeting where they all take the same part.`, noun: 'gardeners',
    check: 'If you list the same gardeners in another order, is it still the same meeting group?', why: 'Listing the same gardeners in another order gives the same group, so order does not matter: this is a combination.' }
 ]
};
mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'Night plan or first-aid box',
 brief: 'More depot jobs have landed on Mira’s desk, and each one needs sorting into arrangement or selection before it is counted.',
 labels: ['1 permutation, 2 combination', 'ways'], tolerance: 0.01,
 gl: [['1 permutation, 2 combination'], ['ordered choices'], ['ways']]
}, {
 canonical: { kind: 2, s: 0, N: 10, k: 4 },
 draw: R => ({ kind: R.pick([1, 2]), s: R.int(0, 1), N: R.int(8, 12), k: R.int(3, 5) }),
 build: ({ kind, s, N, k }) => { const st = STORY2[kind][s], p = perm(N, k), kf = fact(k), c = choose(N, k), ch = chain(N, k), count = kind === 1 ? p : c; return {
  prompt: `${st.text(N, k)} Decide whether the order of the chosen ${st.noun} matters. Enter 1 for a permutation or 2 for a combination, then the number of ways (type it without commas if it is 1000 or more).`,
  answer: [kind, count],
  hints: [`Imagine the same ${st.noun} chosen again but in another order. If the result is not the same, order matters.`, `A permutation is the product of ${n(k)} numbers going down from ${n(N)}. A combination is that product divided by ${n(k)}!.`],
  solution: kind === 1 ? `${st.why} P(${n(N)}, ${n(k)}) = ${ch} = ${n(p)}.` : `${st.why} C(${n(N)}, ${n(k)}) = (${ch}) ÷ ${n(k)}! = ${n(p)} ÷ ${n(kf)} = ${n(c)}.`,
  guidance: [
   { prompt: `${st.check} Enter 1 if it changes (order matters) or 2 if it stays the same (order does not matter).`, answer: [kind], explanation: st.why },
   { prompt: `First count ordered choices of ${n(k)} from ${n(N)}. What is ${ch}?`, answer: [p], explanation: `${running(N, k)}: P(${n(N)}, ${n(k)}) = ${n(p)}.` },
   kind === 1
    ? { prompt: 'Order matters here, so nothing is divided out. How many ways are there?', answer: [p], explanation: `Each ordered choice is a different outcome, so there are ${n(p)} ways.` }
    : { prompt: `Order does not matter, so each group was counted ${n(k)}! = ${n(kf)} times. What is ${n(p)} ÷ ${n(kf)}?`, answer: [c], explanation: `${n(p)} ÷ ${n(kf)} = ${n(c)} ways.` }
  ] }; }
});

/* q17c: pick a team (a selection), then name a leader and a deputy from it (an arrangement), then multiply. N 8–12, k 3–5. */
mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'A team, then a leader and a deputy',
 brief: 'The night team is built in two stages, and Mira wants to know how many different set-ups the office can end up with.',
 labels: ['ways to choose the team', 'ways to name leader and deputy', 'ways to do both'], tolerance: 0.01,
 gl: [['ways to choose the team'], ['ways to name leader and deputy'], ['ways to do both']]
}, {
 canonical: { N: 9, k: 4 },
 draw: R => ({ N: R.int(8, 12), k: R.int(3, 5) }),
 build: ({ N, k }) => { const team = choose(N, k), lead = perm(k, 2), tot = team * lead, ch = chain(N, k); return {
  prompt: `The crew office has ${n(N)} people and builds the night team in two stages. First ${n(k)} of them are chosen as the team, and only who is on it matters. Then two members of that team are named, one as leader and one as deputy, and swapping the two jobs gives a different pair. Enter the number of ways to choose the team, then the number of ways to name the leader and the deputy, then the number of ways to do both stages (type each without commas if it is 1000 or more).`,
  answer: [team, lead, tot],
  hints: ['Choosing the team is a selection, so order does not matter. Naming a leader and then a deputy is an arrangement of 2 people out of the team, so order does matter.', 'The two stages follow one another, so the ways to do both stages come from the ways for each stage put together.'],
  solution: `Choosing the team is a combination: C(${n(N)}, ${n(k)}) = (${ch}) ÷ ${n(k)}! = ${n(team)}. Naming the leader and then the deputy from the ${n(k)} team members is a permutation: P(${n(k)}, 2) = ${n(k)} × ${n(k - 1)} = ${n(lead)}. Each team goes with each naming, so there are ${n(team)} × ${n(lead)} = ${n(tot)} ways to do both.`,
  guidance: [
   { prompt: `Only who is on the team matters, so order does not matter. How many ways are there to choose ${n(k)} people from ${n(N)}? Enter C(${n(N)}, ${n(k)}).`, answer: [team], explanation: `C(${n(N)}, ${n(k)}) = (${ch}) ÷ ${n(k)}! = ${n(perm(N, k))} ÷ ${n(fact(k))} = ${n(team)}.` },
   { prompt: `From the ${n(k)} team members, name a leader first and then a deputy. Order matters here. What is ${n(k)} × ${n(k - 1)}?`, answer: [lead], explanation: `There are ${n(k)} choices for the leader and then ${n(k - 1)} for the deputy: ${n(k)} × ${n(k - 1)} = ${n(lead)}.` },
   { prompt: `Every team can be paired with every naming. What is ${n(team)} × ${n(lead)}?`, answer: [tot], explanation: `${n(team)} × ${n(lead)} = ${n(tot)} ways to do both stages.` }
  ] }; }
});

/* q17d (uses q09, the additive principle): one trip is either a supply run (a permutation) or a repair visit (a combination),
   and the plans are added. n 9–14, a 3–4, m 10–16, b 3–5. */
mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', title: 'A run or a repair visit', uses: 'q09',
 brief: 'The depot can afford only one trip this week, either a supply run or a repair visit, and Mira has to count every plan on offer.',
 labels: ['supply runs', 'repair visits', 'plans in all'], tolerance: 0.01,
 gl: [['supply runs'], ['repair visits'], ['plans in all']]
}, {
 canonical: { N: 11, a: 4, M: 13, b: 3 },
 draw: R => ({ N: R.int(9, 14), a: R.int(3, 4), M: R.int(10, 16), b: R.int(3, 5) }),
 build: ({ N, a, M, b }) => { const runs = perm(N, a), visits = choose(M, b), tot = runs + visits; return {
  prompt: `The depot can afford just one trip, and it will be one of two kinds, never both. A supply run stops at ${n(a)} of the ${n(N)} domes one after another, and a different order of stops is a different run. A repair visit sends ${n(b)} of ${n(M)} technicians together, all doing the same work. Enter the number of different supply runs, then the number of different repair visits, then the number of different plans for the one trip (type each without commas if it is 1000 or more).`,
  answer: [runs, visits, tot],
  hints: [`For the runs, order matters: multiply ${n(a)} numbers going down from ${n(N)}. For the visits, order does not matter: take a product of ${n(b)} numbers going down from ${n(M)} and divide it by ${n(b)}!.`, 'The trip is one kind or the other, never both, so the numbers of plans of the two kinds are put together by the additive principle.'],
  solution: `Supply runs are permutations: P(${n(N)}, ${n(a)}) = ${chain(N, a)} = ${n(runs)}. Repair visits are combinations: C(${n(M)}, ${n(b)}) = (${chain(M, b)}) ÷ ${n(b)}! = ${n(perm(M, b))} ÷ ${n(fact(b))} = ${n(visits)}. The trip is one kind or the other, so the plans add: ${n(runs)} + ${n(visits)} = ${n(tot)}.`,
  guidance: [
   { prompt: `Order matters for the stops. What is ${chain(N, a)}?`, answer: [runs], explanation: `${running(N, a)}: P(${n(N)}, ${n(a)}) = ${n(runs)}.` },
   { prompt: `Order does not matter for the technicians. The product ${chain(M, b)} counts each group ${n(b)}! = ${n(fact(b))} times. How many different visits are there?`, answer: [visits], explanation: `${chain(M, b)} = ${n(perm(M, b))}, and ${n(perm(M, b))} ÷ ${n(fact(b))} = ${n(visits)}.` },
   { prompt: `Only one kind of trip happens, so add the two counts. What is ${n(runs)} + ${n(visits)}?`, answer: [tot], explanation: `${n(runs)} + ${n(visits)} = ${n(tot)} plans for the one trip.` }
  ] }; }
});

/* ---- q18 Counting the complement: "at least one" [Levin 1.1, 1.3] ---- */

/* q18b: batches of k from f faulty and g good cells with at least one faulty. g > k so the no-fault count is at least 4; under 1000. */
mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The relay rack test',
 brief: 'A relay rack of look-alike cells has some bad ones in it, and the technician wants to know how many test batches catch at least one.',
 labels: ['all batches', 'batches with no faulty cell', 'batches with at least one faulty cell'], tolerance: 0.01,
 gl: [['cells', 'all batches'], ['batches with no faulty cell'], ['batches with at least one faulty cell']]
}, {
 canonical: { f: 4, g: 7, k: 3 },
 draw: R => { let p; do { const k = R.int(3, 4); p = { f: R.int(2, 5), g: R.int(k + 1, 9), k }; } while (choose(p.f + p.g, p.k) >= 1000); return p; },
 build: ({ f, g, k }) => { const T = f + g, all = choose(T, k), none = choose(g, k), some = all - none; return {
  prompt: `A relay rack holds ${n(f)} faulty cells and ${n(g)} good ones, and each cell has its own serial number. A technician pulls ${n(k)} cells at once for a test, and the test is only worth running if the batch has at least one faulty cell in it. Enter the number of batches of ${n(k)} with no rule at all, then the number of batches with no faulty cell, then the number with at least one faulty cell.`,
  answer: [all, none, some],
  hints: [`With no rule, a batch is any ${n(k)} of the ${n(T)} cells, in no order.`, 'A batch with no faulty cell is made of good cells only. Every batch has either no faulty cell or at least one, never both, so take one count away from the other.'],
  solution: `With no rule there are C(${n(T)}, ${n(k)}) = ${n(all)} batches. A batch with no faulty cell is ${n(k)} of the ${n(g)} good cells: C(${n(g)}, ${n(k)}) = ${n(none)}. Every other batch has at least one faulty cell, so the count is ${n(all)} − ${n(none)} = ${n(some)}.`,
  guidance: [
   { prompt: `How many cells are there in all, and how many batches of ${n(k)} can be made from them with no rule?`, answer: [T, all], explanation: `${n(f)} + ${n(g)} = ${n(T)} cells, and C(${n(T)}, ${n(k)}) = ${n(all)} batches.` },
   { prompt: `How many batches of ${n(k)} can be made from the ${n(g)} good cells alone?`, answer: [none], explanation: `C(${n(g)}, ${n(k)}) = ${n(none)}: these are exactly the batches with no faulty cell.` },
   { prompt: `Take away the batches with no faulty cell. What is ${n(all)} − ${n(none)}?`, answer: [some], explanation: `${n(all)} − ${n(none)} = ${n(some)} batches have at least one faulty cell.` }
  ] }; }
});

/* q18c: codes of L positions with s symbols, one of them the alarm symbol, using it at least once: s^L − (s − 1)^L. L 3–6, s 3–5. */
mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Door codes with the alarm symbol',
 brief: 'The door panel takes symbol codes, and Mira wants to know how many of them include the alarm symbol somewhere.',
 labels: ['all codes', 'codes with no alarm symbol', 'codes with at least one alarm symbol'], tolerance: 0.01,
 gl: [['all codes'], ['codes with no alarm symbol'], ['codes with at least one alarm symbol']]
}, {
 canonical: { L: 4, s: 5 },
 draw: R => ({ L: R.int(3, 6), s: R.int(3, 5) }),
 build: ({ L, s }) => { const all = Math.pow(s, L), none = Math.pow(s - 1, L), some = all - none; return {
  prompt: `A door panel takes a code of ${n(L)} symbols, and each of the ${n(L)} positions can show any one of ${n(s)} symbols, one of which is the alarm symbol. Mira wants to count the codes that use the alarm symbol at least once, in any positions. Enter the number of codes with no rule at all, then the number of codes with no alarm symbol, then the number with at least one alarm symbol (type each without commas if it is 1000 or more).`,
  answer: [all, none, some],
  hints: ['Each position is chosen in turn, so the choices multiply. With no rule every position has all the symbols to choose from.', 'A code with no alarm symbol has one fewer symbol to choose from in every position. Then take the codes with no alarm symbol away from all the codes.'],
  solution: `With no rule, each of the ${n(L)} positions has ${n(s)} choices, so there are ${n(s)}${sup(L)} = ${n(all)} codes. With no alarm symbol each position has ${n(s - 1)} choices: ${n(s - 1)}${sup(L)} = ${n(none)} codes. Every other code uses the alarm symbol at least once, so the count is ${n(all)} − ${n(none)} = ${n(some)}.`,
  guidance: [
   { prompt: `Every position has ${n(s)} choices, and there are ${n(L)} positions. What is ${n(s)}${sup(L)}, the number of codes with no rule?`, answer: [all], explanation: `${n(s)}${sup(L)} = ${n(all)} codes in all.` },
   { prompt: `Leave the alarm symbol out, so every position has ${n(s - 1)} choices. What is ${n(s - 1)}${sup(L)}?`, answer: [none], explanation: `${n(s - 1)}${sup(L)} = ${n(none)} codes with no alarm symbol.` },
   { prompt: `Take away the codes with no alarm symbol. What is ${n(all)} − ${n(none)}?`, answer: [some], explanation: `${n(all)} − ${n(none)} = ${n(some)} codes use the alarm symbol at least once.` }
  ] }; }
});

/* q18d (uses q10, the multiplicative principle): a crew of k from e engineers, m packers and d drivers with at least one engineer,
   then a captain named from the crew: crews × k. k 4–5, 6 or more people with no engineer, crews × k under 100000. */
mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', title: 'A crew with a captain', uses: 'q10',
 brief: 'Mira is picking a three-trade crew that must have an engineer in it, and then one member is to be named captain.',
 labels: ['crews with no engineer', 'crews with at least one engineer', 'crews with a captain named'], tolerance: 0.01,
 gl: [['all crews'], ['crews with no engineer', 'crews with at least one engineer'], ['crews with a captain named']]
}, {
 canonical: { e: 3, m: 5, d: 4, k: 4 },
 draw: R => { let p; do { p = { e: R.int(2, 5), m: R.int(3, 6), d: R.int(2, 5), k: R.int(4, 5) }; } while (p.m + p.d < p.k + 2 || choose(p.e + p.m + p.d, p.k) * p.k >= 100000); return p; },
 build: ({ e, m, d, k }) => { const T = e + m + d, R2 = m + d, all = choose(T, k), none = choose(R2, k), some = all - none, tot = some * k; return {
  prompt: `The packing floor has ${n(e)} engineers, ${n(m)} packers and ${n(d)} drivers. Mira needs a crew of ${n(k)} that includes at least one engineer, and then one member of the crew is named captain, whoever they are. Enter the number of crews of ${n(k)} with no engineer, then the number of crews with at least one engineer, then the number of ways to pick such a crew and name its captain (type each without commas if it is 1000 or more).`,
  answer: [none, some, tot],
  hints: ['A crew with no engineer is made of packers and drivers only. Count the crews with no rule and the crews with no engineer, and take one away from the other.', `The captain can be any one of the ${n(k)} people in the crew, so each crew can be paired with that many captains.`],
  solution: `With no rule there are C(${n(T)}, ${n(k)}) = ${n(all)} crews. A crew with no engineer is ${n(k)} of the ${n(R2)} packers and drivers: C(${n(R2)}, ${n(k)}) = ${n(none)}. So ${n(all)} − ${n(none)} = ${n(some)} crews have at least one engineer. Each of those crews can name any of its ${n(k)} members as captain, so there are ${n(some)} × ${n(k)} = ${n(tot)} ways to pick the crew and its captain.`,
  guidance: [
   { prompt: `There are ${n(T)} people in all. How many crews of ${n(k)} can be made with no rule?`, answer: [all], explanation: `C(${n(T)}, ${n(k)}) = ${n(all)} crews with no rule.` },
   { prompt: `A crew with no engineer comes from the ${n(R2)} packers and drivers. How many such crews are there, and so how many crews have at least one engineer?`, answer: [none, some], explanation: `C(${n(R2)}, ${n(k)}) = ${n(none)} crews have no engineer, so ${n(all)} − ${n(none)} = ${n(some)} have at least one.` },
   { prompt: `Each of those crews can name any of its ${n(k)} members as captain. What is ${n(some)} × ${n(k)}?`, answer: [tot], explanation: `${n(some)} × ${n(k)} = ${n(tot)} ways to pick the crew and name its captain.` }
  ] }; }
});

/* ---- q19 Stars and bars [Levin 1.5] ---- */

/* q19b: N identical trays on k benches, none allowed or at least one each. k 3–5, N 6–14, at least 2 left after one each. */
mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'Seed trays on the benches',
 brief: 'A shipment of seed trays that all look the same has to be spread over the greenhouse benches.',
 labels: ['ways, none allowed', 'ways, at least one each'], tolerance: 0.01,
 gl: [['symbols', 'ways, none allowed'], ['trays left'], ['ways, at least one each']]
}, {
 canonical: { N: 9, k: 4 },
 draw: R => { let p; do { p = { N: R.int(6, 14), k: R.int(3, 5) }; } while (p.N - p.k < 2); return p; },
 build: ({ N, k }) => { const bars = k - 1, slots = N + bars, free = choose(slots, bars), left = N - k, each = choose(N - 1, bars); return {
  prompt: `${n(N)} seed trays that look exactly alike have arrived for the greenhouse, and they are to be set out on ${n(k)} benches. Only the number of trays on each bench matters. Enter the number of ways if a bench may stay empty, then the number of ways if every bench gets at least one tray. (Type each without commas if it is 1000 or more.)`,
  answer: [free, each],
  hints: [`Line the ${n(N)} trays up as stars and use ${n(bars)} bars to cut the line into ${n(k)} groups, one per bench. The bars can go in any of the places in the whole row of symbols.`, `For “at least one each”, first put one tray on every bench, then share the trays that are left with no rule.`],
  solution: `A sharing is a row of ${n(N)} stars and ${n(bars)} bars: ${n(slots)} symbols, and the bars can be in any ${n(bars)} of the ${n(slots)} places. So there are C(${n(slots)}, ${n(bars)}) = ${n(free)} ways when a bench may stay empty. If every bench gets at least one tray, put one on each first; the other ${n(left)} are shared freely, as ${n(left)} stars and ${n(bars)} bars, in C(${n(N - 1)}, ${n(bars)}) = ${n(each)} ways.`,
  guidance: [
   { prompt: `How many symbols are in a row of ${n(N)} stars and ${n(bars)} bars, and in how many ways can the bars be placed among them?`, answer: [slots, free], explanation: `${n(N)} + ${n(bars)} = ${n(slots)} symbols. Choosing the ${n(bars)} places for the bars gives C(${n(slots)}, ${n(bars)}) = ${n(free)}.` },
   { prompt: `Now every bench must get at least one tray. Put one tray on each bench first. How many trays are left to share?`, answer: [left], explanation: `${n(N)} − ${n(k)} = ${n(left)} trays are left, and they can go anywhere.` },
   { prompt: `Share the ${n(left)} trays with no rule: ${n(left)} stars and ${n(bars)} bars. How many ways is that?`, answer: [each], explanation: `${n(left)} + ${n(bars)} = ${n(N - 1)} symbols, so C(${n(N - 1)}, ${n(bars)}) = ${n(each)} ways.` }
  ] }; }
});

/* q19c: every dome must get at least m crates first, then the rest are shared freely. k 3–4, m 2–3, N 10–16, 2 or more left. */
mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'A minimum for every dome',
 brief: 'Each dome needs a fixed minimum of water crates to keep running, and Mira wants the ways to share what is left.',
 labels: ['crates left to share', 'ways'], tolerance: 0.01,
 gl: [['crates promised'], ['crates left to share'], ['ways']]
}, {
 canonical: { N: 13, k: 3, m: 2 },
 draw: R => { let p; do { p = { N: R.int(10, 16), k: R.int(3, 4), m: R.int(2, 3) }; } while (p.N - p.k * p.m < 2); return p; },
 build: ({ N, k, m }) => { const bars = k - 1, promised = k * m, left = N - promised, slots = left + bars, ways = choose(slots, bars); return {
  prompt: `Mira has ${n(N)} identical crates of water for ${n(k)} domes. Every dome must get at least ${n(m)} crates to keep running, and the rest can go to any dome. Only the number of crates each dome gets matters. Enter the number of crates left to share once every dome has its ${n(m)}, then the number of ways to share the whole delivery.`,
  answer: [left, ways],
  hints: [`Count the crates that every dome must receive first, all ${n(k)} domes together, and take them away from the delivery.`, `Share the crates that are left with no rule at all, as stars in a row cut by ${n(bars)} bars. Count the places the bars can go.`],
  solution: `Every dome gets ${n(m)} crates first, which uses ${n(k)} × ${n(m)} = ${n(promised)} crates, so ${n(N)} − ${n(promised)} = ${n(left)} crates are left. They can go anywhere, as ${n(left)} stars and ${n(bars)} bars: ${n(slots)} symbols with the bars in any ${n(bars)} places, so there are C(${n(slots)}, ${n(bars)}) = ${n(ways)} ways.`,
  guidance: [
   { prompt: `Every one of the ${n(k)} domes gets ${n(m)} crates first. How many crates is that in all?`, answer: [promised], explanation: `${n(k)} × ${n(m)} = ${n(promised)} crates are promised.` },
   { prompt: `How many of the ${n(N)} crates are left to share?`, answer: [left], explanation: `${n(N)} − ${n(promised)} = ${n(left)} crates are left, and they can go anywhere.` },
   { prompt: `Share the ${n(left)} crates with no rule: ${n(left)} stars and ${n(bars)} bars. How many ways is that?`, answer: [ways], explanation: `${n(left)} + ${n(bars)} = ${n(slots)} symbols, so C(${n(slots)}, ${n(bars)}) = ${n(ways)} ways.` }
  ] }; }
});

/* q19d (uses q10, the multiplicative principle): two separate sharings among k domes, with none allowed, multiplied.
   k 3–4, N 5–9 water, P 4–8 food, both under 100000 in the product. */
mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', title: 'Water and food together', uses: 'q10',
 brief: 'A water delivery and a food delivery are due at the same domes, and Mira wants every way to share both.',
 labels: ['ways to share the water', 'ways to share the food', 'ways to share both'], tolerance: 0.01,
 gl: [['water ways'], ['food ways'], ['ways to share both']]
}, {
 canonical: { N: 7, P: 5, k: 3 },
 draw: R => { let p; do { p = { N: R.int(5, 9), P: R.int(4, 8), k: R.int(3, 4) }; } while (p.N === p.P); return p; },
 build: ({ N, P, k }) => { const bars = k - 1, w = choose(N + bars, bars), f = choose(P + bars, bars), both = w * f; return {
  prompt: `Two deliveries are due at the same ${n(k)} domes: ${n(N)} identical crates of water and ${n(P)} identical crates of food. Each delivery is shared out on its own, only the number of crates each dome gets matters, and a dome may get none of either kind. Enter the number of ways to share the water, then the number of ways to share the food, then the number of ways to share both deliveries (type each without commas if it is 1000 or more).`,
  answer: [w, f, both],
  hints: [`Each delivery is its own stars-and-bars row: its crates as stars, and ${n(bars)} bars to cut the row into ${n(k)} groups.`, 'The two sharings are done one after the other and every water sharing can go with every food sharing, so the ways combine by the multiplicative principle.'],
  solution: `The water is ${n(N)} stars and ${n(bars)} bars: C(${n(N + bars)}, ${n(bars)}) = ${n(w)} ways. The food is ${n(P)} stars and ${n(bars)} bars: C(${n(P + bars)}, ${n(bars)}) = ${n(f)} ways. Every water sharing goes with every food sharing, so there are ${n(w)} × ${n(f)} = ${n(both)} ways to share both.`,
  guidance: [
   { prompt: `Write the water as ${n(N)} stars and ${n(bars)} bars. How many symbols is that, and in how many ways can the bars be placed? Enter C(${n(N + bars)}, ${n(bars)}).`, answer: [w], explanation: `${n(N)} + ${n(bars)} = ${n(N + bars)} symbols, and C(${n(N + bars)}, ${n(bars)}) = ${n(w)} ways.` },
   { prompt: `Do the same for the food: ${n(P)} stars and ${n(bars)} bars. Enter C(${n(P + bars)}, ${n(bars)}).`, answer: [f], explanation: `${n(P)} + ${n(bars)} = ${n(P + bars)} symbols, and C(${n(P + bars)}, ${n(bars)}) = ${n(f)} ways.` },
   { prompt: `Each water sharing can go with each food sharing. What is ${n(w)} × ${n(f)}?`, answer: [both], explanation: `${n(w)} × ${n(f)} = ${n(both)} ways to share both deliveries.` }
  ] }; }
});

/* ---- q20 Inclusion–exclusion with three sets [Levin 1.6] ---- */

/* Sets of three whole numbers with no common factor between any two, so a multiple of two of them is a multiple of their product. */
const TRIPLES = [[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 4, 5], [3, 4, 7], [3, 5, 7], [2, 5, 9], [3, 5, 8], [4, 5, 7], [2, 7, 9]];
const TRIPLES2 = [[3, 4, 5], [4, 5, 7], [5, 7, 9], [4, 7, 9], [5, 8, 9], [3, 5, 8], [3, 7, 8], [4, 5, 9], [3, 7, 10]];

/* q20b: days 1..N of a season on which at least one of three drones flies (multiples of a, b or c), and the quiet days. N 120–400. */
mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Quiet days for the drones',
 brief: 'Three survey drones fly on their own cycles, and Mira wants to know how many days of the season stay quiet.',
 labels: ['quiet days', 'flying days'], tolerance: 0.01,
 gl: [['days for drone A', 'days for drone B', 'days for drone C'], ['days for A and B', 'days for A and C', 'days for B and C'], ['days for all three drones', 'flying days'], ['quiet days']]
}, {
 canonical: { N: 150, t: 1 },
 draw: R => { let p; do { p = { N: R.int(120, 400), t: R.int(0, TRIPLES.length - 1) }; } while (TRIPLES[p.t].reduce((x, y) => x * y, 1) > p.N); return p; },
 build: ({ N, t }) => { const [a, b, c] = TRIPLES[t], f = d => Math.floor(N / d), ab = a * b, ac = a * c, bc = b * c, abc = a * b * c,
  na = f(a), nb = f(b), nc = f(c), nab = f(ab), nac = f(ac), nbc = f(bc), nabc = f(abc), S1 = na + nb + nc, S2 = nab + nac + nbc, U = S1 - S2 + nabc, none = N - U; return {
  prompt: `The season at the outpost lasts ${n(N)} days, numbered 1 to ${n(N)}. Drone A flies on every day whose number is a multiple of ${n(a)}, drone B on every multiple of ${n(b)} and drone C on every multiple of ${n(c)}. A day on which two or three of them fly is still just one flying day. Enter the number of quiet days, when no drone flies, then the number of flying days.`,
  answer: [none, U],
  hints: [`Each drone’s flying days are the multiples of its number up to ${n(N)}. Count them by dividing ${n(N)} by the number and throwing away any decimal part. No two of the three numbers share a factor, so a day shared by two drones is a multiple of the product of their numbers.`, 'Count the flying days first: add the three single counts, take away the three pair counts, then add back the days when all three fly. The quiet days are the rest of the season.'],
  solution: `Drone A flies on ${n(na)} days, B on ${n(nb)} and C on ${n(nc)}: ${n(S1)} together. Days shared by two drones are multiples of ${n(ab)}, ${n(ac)} or ${n(bc)}: ${n(nab)}, ${n(nac)} and ${n(nbc)}, which is ${n(S2)} together. Days when all three fly are multiples of ${n(abc)}: ${n(nabc)}. By inclusion–exclusion there are ${n(S1)} − ${n(S2)} + ${n(nabc)} = ${n(U)} flying days, so ${n(N)} − ${n(U)} = ${n(none)} quiet days.`,
  guidance: [
   { prompt: `How many days from 1 to ${n(N)} are multiples of ${n(a)}, how many of ${n(b)}, and how many of ${n(c)}?`, answer: [na, nb, nc], explanation: `${n(N)} ÷ ${n(a)}, ${n(N)} ÷ ${n(b)} and ${n(N)} ÷ ${n(c)}, each without its decimal part: ${n(na)}, ${n(nb)} and ${n(nc)}.` },
   { prompt: `Days shared by two drones were counted twice. How many days are multiples of ${n(ab)}, of ${n(ac)} and of ${n(bc)}?`, answer: [nab, nac, nbc], explanation: `${n(N)} ÷ ${n(ab)}, ${n(N)} ÷ ${n(ac)} and ${n(N)} ÷ ${n(bc)} without decimal parts: ${n(nab)}, ${n(nac)} and ${n(nbc)}.` },
   { prompt: `How many days are multiples of ${n(abc)}? Then put the counts together: the singles, minus the pairs, plus this one. How many days have at least one drone flying?`, answer: [nabc, U], explanation: `Multiples of ${n(abc)}: ${n(nabc)}. Then ${n(S1)} − ${n(S2)} + ${n(nabc)} = ${n(U)} flying days.` },
   { prompt: `Take the flying days away from the whole season. How many days are quiet?`, answer: [none], explanation: `${n(N)} − ${n(U)} = ${n(none)} quiet days.` }
  ] }; }
});

/* q20c: bays 1..N that get a sensor (a multiple of a, b or c), and the cost at s credits a sensor. N 150–400, s 3–9. */
mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Sensors for the marked bays',
 brief: 'Bays with certain numbers get a sensor fitted, and the ledger needs the bill before the order goes in.',
 labels: ['bays with a sensor', 'cost in credits'], tolerance: 0.01,
 gl: [['single counts total', 'pair counts total'], ['multiples of all three', 'bays with a sensor'], ['cost in credits']]
}, {
 canonical: { N: 240, t: 3, s: 7 },
 draw: R => { let p; do { p = { N: R.int(150, 400), t: R.int(0, TRIPLES.length - 1), s: R.int(3, 9) }; } while (TRIPLES[p.t].reduce((x, y) => x * y, 1) > p.N); return p; },
 build: ({ N, t, s }) => { const [a, b, c] = TRIPLES[t], f = d => Math.floor(N / d), ab = a * b, ac = a * c, bc = b * c, abc = a * b * c,
  na = f(a), nb = f(b), nc = f(c), nab = f(ab), nac = f(ac), nbc = f(bc), nabc = f(abc), S1 = na + nb + nc, S2 = nab + nac + nbc, U = S1 - S2 + nabc, cost = U * s; return {
  prompt: `The depot has ${n(N)} bays, numbered 1 to ${n(N)}. A sensor is fitted in every bay whose number is a multiple of ${n(a)}, of ${n(b)} or of ${n(c)}, and a bay that qualifies more than once still gets just one sensor. Each sensor costs ${n(s)} credits. Enter the number of bays that get a sensor, then the total cost of the sensors in credits (type each without commas if it is 1000 or more).`,
  answer: [U, cost],
  hints: [`Find the multiples of ${n(a)}, of ${n(b)} and of ${n(c)} up to ${n(N)} by dividing and throwing away any decimal part. No two of the three numbers share a factor, so a bay that is a multiple of two of them is a multiple of their product.`, 'Add the three single counts, take away the three pair counts and add back the multiples of all three. The cost is the number of sensors times the price of one.'],
  solution: `Multiples of ${n(a)}: ${n(na)}; of ${n(b)}: ${n(nb)}; of ${n(c)}: ${n(nc)}; together ${n(S1)}. Multiples of ${n(ab)}: ${n(nab)}; of ${n(ac)}: ${n(nac)}; of ${n(bc)}: ${n(nbc)}; together ${n(S2)}. Multiples of ${n(abc)}: ${n(nabc)}. By inclusion–exclusion ${n(S1)} − ${n(S2)} + ${n(nabc)} = ${n(U)} bays get a sensor. At ${n(s)} credits each the cost is ${n(U)} × ${n(s)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Count the multiples of ${n(a)}, of ${n(b)} and of ${n(c)} up to ${n(N)} and add them. Then count the multiples of ${n(ab)}, of ${n(ac)} and of ${n(bc)} and add those. Enter the two totals.`, answer: [S1, S2], explanation: `${n(na)} + ${n(nb)} + ${n(nc)} = ${n(S1)} for the singles, and ${n(nab)} + ${n(nac)} + ${n(nbc)} = ${n(S2)} for the pairs.` },
   { prompt: `How many bays are multiples of ${n(abc)}? Then take the pairs from the singles and add them back: how many bays get a sensor?`, answer: [nabc, U], explanation: `Multiples of ${n(abc)}: ${n(nabc)}. Then ${n(S1)} − ${n(S2)} + ${n(nabc)} = ${n(U)} bays.` },
   { prompt: `Each sensor costs ${n(s)} credits. What is ${n(U)} × ${n(s)}?`, answer: [cost], explanation: `${n(U)} × ${n(s)} = ${n(cost)} credits.` }
  ] }; }
});

/* q20d (uses q04, difference): codes 1..N that are multiples of a or b but not of c. N 400–900, pairwise coprime triples. */
mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', title: 'Kept unless the third divides', uses: 'q04',
 brief: 'Codes are kept for inspection under an either-or rule with an exception, and Mira has to count the survivors.',
 labels: ['multiples of the first or second', 'of those, multiples of the third too', 'codes kept'], tolerance: 0.01,
 gl: [['multiples of the first', 'multiples of the second', 'multiples of both'], ['multiples of the first or second'], ['multiples of the first and third', 'multiples of the second and third', 'multiples of all three'], ['of those, multiples of the third too', 'codes kept']]
}, {
 canonical: { N: 600, t: 1 },
 draw: R => ({ N: R.int(400, 900), t: R.int(0, TRIPLES2.length - 1) }),
 build: ({ N, t }) => { const [a, b, c] = TRIPLES2[t], f = d => Math.floor(N / d), ab = a * b, ac = a * c, bc = b * c, abc = a * b * c,
  na = f(a), nb = f(b), nab = f(ab), nac = f(ac), nbc = f(bc), nabc = f(abc), U2 = na + nb - nab, W = nac + nbc - nabc, kept = U2 - W; return {
  prompt: `Crate codes run from 1 to ${n(N)}. A code is kept for inspection if it is a multiple of ${n(a)} or of ${n(b)}, unless it is also a multiple of ${n(c)}, in which case it is dropped. Enter how many codes are multiples of ${n(a)} or of ${n(b)}, then how many of those are also multiples of ${n(c)}, then how many codes are kept.`,
  answer: [U2, W, kept],
  hints: [`No two of ${n(a)}, ${n(b)} and ${n(c)} share a factor, so a code that is a multiple of two of them is a multiple of their product. For “${n(a)} or ${n(b)}”, add the two single counts and take away the count of multiples of ${n(ab)}.`, `The multiples of ${n(a)} or ${n(b)} that are also multiples of ${n(c)} are the multiples of ${n(ac)} or of ${n(bc)}. Count those the same way, with the multiples of all three as the double count. Then take them away from the first count.`],
  solution: `Multiples of ${n(a)}: ${n(na)}; of ${n(b)}: ${n(nb)}; of ${n(ab)}: ${n(nab)}. So ${n(na)} + ${n(nb)} − ${n(nab)} = ${n(U2)} codes are multiples of ${n(a)} or of ${n(b)}. Of those, the ones that are also multiples of ${n(c)} are the multiples of ${n(ac)} or of ${n(bc)}: ${n(nac)} + ${n(nbc)} − ${n(nabc)} = ${n(W)}, where ${n(nabc)} is the count of multiples of ${n(abc)}. The codes kept are the others: ${n(U2)} − ${n(W)} = ${n(kept)}.`,
  guidance: [
   { prompt: `How many codes from 1 to ${n(N)} are multiples of ${n(a)}, how many of ${n(b)}, and how many of both, which are the multiples of ${n(ab)}?`, answer: [na, nb, nab], explanation: `${n(N)} ÷ ${n(a)}, ${n(N)} ÷ ${n(b)} and ${n(N)} ÷ ${n(ab)} without decimal parts: ${n(na)}, ${n(nb)} and ${n(nab)}.` },
   { prompt: `Add the first two counts and take away the count of both. How many codes are multiples of ${n(a)} or of ${n(b)}?`, answer: [U2], explanation: `${n(na)} + ${n(nb)} − ${n(nab)} = ${n(U2)}.` },
   { prompt: `Codes in that group that are also multiples of ${n(c)} are the multiples of ${n(ac)} or of ${n(bc)}. How many codes are multiples of ${n(ac)}, how many of ${n(bc)}, and how many of ${n(abc)}?`, answer: [nac, nbc, nabc], explanation: `${n(N)} ÷ ${n(ac)}, ${n(N)} ÷ ${n(bc)} and ${n(N)} ÷ ${n(abc)} without decimal parts: ${n(nac)}, ${n(nbc)} and ${n(nabc)}.` },
   { prompt: `Combine those the same way, singles minus the double count: how many of the multiples of ${n(a)} or ${n(b)} are also multiples of ${n(c)}? Then take that from ${n(U2)}: how many codes are kept?`, answer: [W, kept], explanation: `${n(nac)} + ${n(nbc)} − ${n(nabc)} = ${n(W)}, and ${n(U2)} − ${n(W)} = ${n(kept)} codes are kept.` }
  ] }; }
});

})();
