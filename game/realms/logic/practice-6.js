/* Logic and proof practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p6.js. */
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
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const shuffle = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const choices = items => items.map((s, i) => `(${i + 1}) ${s}`).join(' ');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const evenIn = (R, lo, hi) => 2 * R.int(lo, hi);
const oddIn = (R, lo, hi) => 2 * R.int(lo, hi) + 1;
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const spf = N => { for (let q = 2; q * q <= N; q++) if (N % q === 0) return q; return N; };
const prod = ps => ps.reduce((a, b) => a * b, 1);
const listText = ps => and(ps.map(String));
const prodText = ps => ps.map(String).join(' × ');
/* The unlisted primes tried in turn, each with the remainder it leaves; p is the smallest prime factor of N. */
const tryText = (N, p, ps) => PRIMES.filter(q => !ps.includes(q) && (p === N ? q * q <= N : q < p)).map(q => `${n(q)} (remainder ${n(N % q)})`).join(', ');
const findText = (N, p, ps) => { const t = tryText(N, p, ps);
 return p === N ? `${t ? `trying the unlisted primes in order, with the remainder each leaves: ${t}; none divides it. That rules out every prime whose square is at most ${n(N)}: the next prime, ${n(PRIMES.find(q => q * q > N))}, has ${n(PRIMES.find(q => q * q > N))} × ${n(PRIMES.find(q => q * q > N))} = ${n(PRIMES.find(q => q * q > N) ** 2)}, which is more than ${n(N)}` : `every prime whose square is at most ${n(N)} is on the list, so none of the others needs trying`}. So ${n(N)} is itself prime: its smallest prime factor is ${n(N)}, and ${n(N)} ÷ ${n(N)} = 1`
  : `${t ? `trying the unlisted primes in order, with the remainder each leaves: ${t}; but ` : ''}${n(N)} = ${n(p)} × ${n(N / p)}. So its smallest prime factor is ${n(p)}, and ${n(N)} ÷ ${n(p)} = ${n(N / p)}`; };

/* ---- q26 Direct proofs with “divides” [Levin 3.2] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The bolt stores',
 brief: 'Two stores of bolts are being merged on paper, and the stockroom wants a proof that the leftover count still comes out in whole boxes.',
 labels: ['boxes in store A', 'boxes in store B', 'm'], tolerance: 0.01,
 gl: [['boxes in store A'], ['boxes in store B'], ['m']]
}, {
 canonical: { d: 6, s: 14, t: 5 },
 draw: R => { let p; do { p = { d: R.int(3, 12), s: R.int(5, 25), t: R.int(2, 20) }; } while (p.s <= p.t || (p.d === 6 && p.s === 14 && p.t === 5)); return p; },
 build: ({ d, s, t }) => { const a = d * s, b = d * t, m = s - t; return {
  prompt: `Two stores hold bolts packed in boxes of ${n(d)}. Store A holds ${n(a)} bolts and store B holds ${n(b)}, so ${n(d)} | ${n(a)} and ${n(d)} | ${n(b)}. Mira proves that ${n(d)} also divides the difference. With d = ${n(d)}, a = ${n(a)} and b = ${n(b)}: a = d × s and b = d × t, so a − b = d × s − d × t = d × (s − t), and s − t is a whole number. Follow her proof: enter s, the boxes in store A, then t, the boxes in store B, then the whole number m with a − b = ${n(d)}m.`,
  answer: [s, t, m],
  hints: [`Each box holds ${n(d)} bolts, so the boxes in a store are its bolts ÷ ${n(d)}.`, `Take ${n(d)} out of both terms: ${n(d)} × s − ${n(d)} × t = ${n(d)} × (s − t).`],
  solution: `${n(a)} = ${n(d)} × ${n(s)}, so s = ${n(s)}; ${n(b)} = ${n(d)} × ${n(t)}, so t = ${n(t)}. Then ${n(a)} − ${n(b)} = ${n(d)} × ${n(s)} − ${n(d)} × ${n(t)} = ${n(d)} × (${n(s)} − ${n(t)}) = ${n(d)} × ${n(m)}, so m = ${n(m)}. Check: ${n(a - b)} = ${n(d)} × ${n(m)}, so ${n(d)} | ${n(a - b)}.`,
  guidance: [
   { prompt: `Store A holds ${n(a)} bolts in boxes of ${n(d)}, so ${n(a)} = ${n(d)} × s. What is s?`, answer: [s], explanation: `${n(a)} ÷ ${n(d)} = ${n(s)}, so ${n(a)} = ${n(d)} × ${n(s)}.` },
   { prompt: `Store B holds ${n(b)} bolts, so ${n(b)} = ${n(d)} × t. What is t?`, answer: [t], explanation: `${n(b)} ÷ ${n(d)} = ${n(t)}, so ${n(b)} = ${n(d)} × ${n(t)}.` },
   { prompt: `The proof says a − b = ${n(d)} × (s − t). What is the whole number m = s − t?`, answer: [m], explanation: `${n(s)} − ${n(t)} = ${n(m)}, and ${n(d)} × ${n(m)} = ${n(a - b)} = ${n(a)} − ${n(b)}.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Three runs of pipe',
 brief: 'A water line is laid in three runs cut from standard sections, and the stores clerk needs the section count and the bill before the order goes out.',
 labels: ['total sections', 'cost in credits'], tolerance: 0.01,
 gl: [['sections in run 1', 'sections in run 2', 'sections in run 3'], ['total sections'], ['cost in credits']]
}, {
 canonical: { d: 5, s: 8, t: 11, u: 6, c: 18 },
 draw: R => { let p; do { p = { d: R.int(3, 9), s: R.int(3, 15), t: R.int(3, 15), u: R.int(3, 15), c: R.int(12, 40) }; } while ((p.s === p.t && p.t === p.u) || (p.d === 5 && p.s === 8 && p.t === 11 && p.u === 6)); return p; },
 build: ({ d, s, t, u, c }) => { const a = d * s, b = d * t, e = d * u, m = s + t + u, cost = m * c; return {
  prompt: `A water line is laid in three runs, each cut from pipe sections of ${n(d)} m, so every run’s length is a multiple of ${n(d)}: the runs are ${n(a)} m, ${n(b)} m and ${n(e)} m. The sum rule for “divides” stretches to three terms: a = d × s, b = d × t and c = d × u give a + b + c = d × (s + t + u). Enter the total number of sections, m = s + t + u. Then enter the cost in credits when each section costs ${n(c)} credits (type it without commas).`,
  answer: [m, cost],
  hints: [`A run of ${n(d)}-metre sections uses its length ÷ ${n(d)} sections.`, 'Add the three section counts, then multiply by the price of one section.'],
  solution: `${n(a)} = ${n(d)} × ${n(s)}, ${n(b)} = ${n(d)} × ${n(t)} and ${n(e)} = ${n(d)} × ${n(u)}, so the runs use ${n(s)}, ${n(t)} and ${n(u)} sections. Then ${n(a)} + ${n(b)} + ${n(e)} = ${n(d)} × (${n(s)} + ${n(t)} + ${n(u)}) = ${n(d)} × ${n(m)}, so m = ${n(m)}. At ${n(c)} credits a section the cost is ${n(m)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `How many ${n(d)} m sections does each run use: ${n(a)} m, ${n(b)} m and ${n(e)} m?`, answer: [s, t, u], explanation: `${n(a)} ÷ ${n(d)} = ${n(s)}, ${n(b)} ÷ ${n(d)} = ${n(t)} and ${n(e)} ÷ ${n(d)} = ${n(u)}.` },
   { prompt: `The proof says a + b + c = ${n(d)} × (s + t + u). What is the whole number m = s + t + u?`, answer: [m], explanation: `${n(s)} + ${n(t)} + ${n(u)} = ${n(m)}, and ${n(d)} × ${n(m)} = ${n(a + b + e)}, the total length.` },
   { prompt: `Each section costs ${n(c)} credits. What do ${n(m)} sections cost?`, answer: [cost], explanation: `${n(m)} × ${n(c)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q24', title: 'Even rods, even sum',
 brief: 'Two support beams are built from even-length rods laid end to end, and the workshop wants proof that the pair is an even total length too.',
 labels: ['s', 't', 'm', 'j'], tolerance: 0.01,
 gl: [['s', 't'], ['m'], ['j']]
}, {
 canonical: { d: 8, s: 17, t: 12 },
 draw: R => { let p; do { p = { d: evenIn(R, 2, 7), s: R.int(6, 35), t: R.int(6, 35) }; } while (p.s === p.t || (p.d === 8 && p.s === 17 && p.t === 12)); return p; },
 build: ({ d, s, t }) => { const a = d * s, b = d * t, m = s + t, sum = a + b, j = sum / 2; return {
  prompt: `Two support beams are each built from whole rods of ${n(d)} m, an even length, laid end to end: the beams are ${n(a)} m and ${n(b)} m long, so ${n(d)} | ${n(a)} and ${n(d)} | ${n(b)}. With d = ${n(d)}, a = ${n(a)} and b = ${n(b)}, Mira’s proof writes a = d × s and b = d × t and gets a + b = d × (s + t). Enter s, then t, then the whole number m with a + b = ${n(d)}m. Because ${n(d)} is even, the total length is even too: enter the whole number j with a + b = 2j.`,
  answer: [s, t, m, j],
  hints: [`Since ${n(d)} | ${n(a)}, a ÷ ${n(d)} is s. Find t the same way.`, `Once you have a + b = ${n(d)}m, use that ${n(d)} is 2 times ${n(d / 2)}, so the total is 2 times something.`],
  solution: `${n(a)} = ${n(d)} × ${n(s)}, so s = ${n(s)}; ${n(b)} = ${n(d)} × ${n(t)}, so t = ${n(t)}. Then ${n(a)} + ${n(b)} = ${n(d)} × (${n(s)} + ${n(t)}) = ${n(d)} × ${n(m)}, so m = ${n(m)} and the total is ${n(sum)}. As ${n(d)} = 2 × ${n(d / 2)}, the total is 2 × (${n(d / 2)} × ${n(m)}) = 2 × ${n(j)}, so j = ${n(j)} and the total is even.`,
  guidance: [
   { prompt: `${n(d)} | ${n(a)} and ${n(d)} | ${n(b)}. Enter s with ${n(a)} = ${n(d)} × s, then t with ${n(b)} = ${n(d)} × t.`, answer: [s, t], explanation: `${n(a)} ÷ ${n(d)} = ${n(s)} and ${n(b)} ÷ ${n(d)} = ${n(t)}.` },
   { prompt: `What is the whole number m = s + t, so that a + b = ${n(d)}m?`, answer: [m], explanation: `${n(s)} + ${n(t)} = ${n(m)}, and ${n(d)} × ${n(m)} = ${n(sum)}.` },
   { prompt: `${n(d)} is even, so ${n(d)} = 2 × ${n(d / 2)}. What whole number j gives a + b = 2j?`, answer: [j], explanation: `${n(sum)} = 2 × ${n(d / 2)} × ${n(m)} = 2 × ${n(j)}, so the total is even.` }
  ] }; }
});

/* ---- q27 Proof by contrapositive [Levin 3.2] ---- */

/* Claim families for q27b. P, Q: the claim; nQ, nP: the contrapositive; v: parity of the value of expr in the contrapositive's check;
   the checked n has the parity of nQ. */
const FB = [
 { P: '5n + 2 is odd', Q: 'n is odd', nQ: 'n is even', nP: '5n + 2 is even', expr: '5n + 2', f: x => 5 * x + 2, even: true, xEven: true,
   proof: 'Assume n is even, so n = 2j for a whole number j. Then 5n + 2 = 10j + 2 = 2(5j + 1), which is even. ∎' },
 { P: '3n is even', Q: 'n is even', nQ: 'n is odd', nP: '3n is odd', expr: '3n', f: x => 3 * x, even: false, xEven: false,
   proof: 'Assume n is odd, so n = 2j + 1 for a whole number j. Then 3n = 6j + 3 = 2(3j + 1) + 1, which is odd. ∎' },
 { P: '7n − 4 is odd', Q: 'n is odd', nQ: 'n is even', nP: '7n − 4 is even', expr: '7n − 4', f: x => 7 * x - 4, even: true, xEven: true,
   proof: 'Assume n is even, so n = 2j. Then 7n − 4 = 14j − 4 = 2(7j − 2), which is even. ∎' },
 { P: 'n² + 1 is even', Q: 'n is odd', nQ: 'n is even', nP: 'n² + 1 is odd', expr: 'n² + 1', f: x => x * x + 1, even: false, xEven: true,
   proof: 'Assume n is even, so n = 2j. Then n² + 1 = 4j² + 1 = 2(2j²) + 1, which is odd. ∎' }
];
/* Claim families for q27c: the player forms the contrapositive. */
const FC = [
 { P: '3n + 4 is odd', Q: 'n is odd', nQ: 'n is even', expr: '3n + 4', f: x => 3 * x + 4, even: true, xEven: true },
 { P: '5n is odd', Q: 'n is odd', nQ: 'n is even', expr: '5n', f: x => 5 * x, even: true, xEven: true },
 { P: 'n² − 3 is odd', Q: 'n is even', nQ: 'n is odd', expr: 'n² − 3', f: x => x * x - 3, even: true, xEven: false },
 { P: '9n + 1 is even', Q: 'n is odd', nQ: 'n is even', expr: '9n + 1', f: x => 9 * x + 1, even: false, xEven: true }
];
/* The four statements: the contrapositive, the converse, the inverse and a mixed one. */
const contraList = F => [`If ${F.nQ}, then ${F.nP}.`, `If ${F.Q}, then ${F.P}.`, `If ${F.nP}, then ${F.nQ}.`, `If ${F.P}, then ${F.nQ}.`];
const CONTRA_WHY = ['', 'is the converse, with the two parts swapped', 'is the inverse, with both parts negated', 'keeps the hypothesis and negates the conclusion, so it is not a version of the claim at all'];
const checkX = (R, F, hi) => { let x; do { x = F.xEven ? evenIn(R, 2, Math.floor(hi / 2)) : oddIn(R, 1, Math.floor((hi - 1) / 2)); } while (F.f(x) >= 1000); return x; };

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'Seed tray labels, back door',
 brief: 'The greenhouse labels its seed trays by a numbering rule, and Mira wants the rule proved through the back door before the labels are printed.',
 labels: ['statement proved', 'value', 'k'], tolerance: 0.01,
 gl: [['statement proved'], ['value'], ['k']]
}, {
 canonical: { f: 2, order: [3, 1, 0, 2], x: 12 },
 draw: R => { const f = R.int(0, 3); let o; do { o = { f, order: shuffle(R, [0, 1, 2, 3]), x: checkX(R, FB[f], 30) }; } while (f === 2 && o.x === 12 && o.order.join() === '3,1,0,2'); return o; },
 build: ({ f, order, x }) => { const F = FB[f], list = contraList(F), idx = order.indexOf(0) + 1, v = F.f(x), k = F.even ? v / 2 : (v - 1) / 2, form = F.even ? '2k' : '2k + 1', kind = F.even ? 'even' : 'odd'; return {
  prompt: `The greenhouse labels its seed trays with a whole number n, and the labelling rule says: “If ${F.P}, then ${F.Q}.” Mira goes in through the back door: “${F.proof}” Which statement have her lines proved? ${choices(order.map(i => list[i]))} Enter the number of that statement. Then check it for tray n = ${n(x)}: enter the value of ${F.expr}, then the whole number k with ${F.expr} = ${form}.`,
  answer: [idx, v, k],
  hints: ['What Mira assumes in her first line becomes the hypothesis of the statement she proves, and what her last line reaches becomes its conclusion.', `Put n = ${n(x)} into ${F.expr}. For the k, ${F.even ? 'halve the value' : 'take away 1 and halve what is left'}.`],
  solution: `Mira assumes “${F.nQ}” and reaches “${F.nP}”, so she has proved statement ${idx}, “If ${F.nQ}, then ${F.nP}”: the contrapositive of the rule, which is equivalent to it. ${order.map((i, j) => i === 0 ? '' : `Statement ${j + 1} ${CONTRA_WHY[i]}.`).filter(Boolean).join(' ')} For n = ${n(x)}, ${F.expr} = ${n(v)} = ${F.even ? `2 × ${n(k)}` : `2 × ${n(k)} + 1`}, which is ${kind}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `Mira’s lines assume “${F.nQ}” and end with “${F.nP}”. Which of the four statements is “If ${F.nQ}, then ${F.nP}”?`, answer: [idx], explanation: `Statement ${idx}. It is the contrapositive of “If ${F.P}, then ${F.Q}”: both parts negated and swapped.` },
   { prompt: `Check it for n = ${n(x)}. What is ${F.expr}?`, answer: [v], explanation: `With n = ${n(x)}, ${F.expr} = ${n(v)}.` },
   { prompt: `${n(v)} should be ${kind}. Which whole number k gives ${n(v)} = ${form}?`, answer: [k], explanation: `${F.even ? `${n(v)} ÷ 2 = ${n(k)}` : `${n(v)} − 1 = ${n(v - 1)} and ${n(v - 1)} ÷ 2 = ${n(k)}`}, so ${n(v)} = ${F.even ? `2 × ${n(k)}` : `2 × ${n(k)} + 1`}.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'Harbour crate census',
 brief: 'The harbour office wants to know which crates a back-door proof will cover, and to see the rule hold on one of them.',
 labels: ['crates with the conclusion false', 'value', 'k'], tolerance: 0.01,
 gl: [['crates'], ['value'], ['k']]
}, {
 canonical: { f: 2, N: 37, x: 15 },
 draw: R => { const f = R.int(0, 3), N = R.int(15, 60); let o; do { o = { f, N, x: checkX(R, FC[f], Math.min(N, 31)) }; } while (f === 2 && N === 37 && o.x === 15); return o; },
 build: ({ f, N, x }) => { const F = FC[f], v = F.f(x), k = F.even ? v / 2 : (v - 1) / 2, form = F.even ? '2k' : '2k + 1', kind = F.even ? 'even' : 'odd', cnt = F.xEven ? Math.floor(N / 2) : Math.ceil(N / 2), nQ = F.xEven ? 'even' : 'odd'; return {
  prompt: `Harbour crates are numbered 1 to ${n(N)}. The harbour rule says: “If ${F.P}, then ${F.Q}.” Mira will prove it by its contrapositive, which starts from the crates for which the conclusion “${F.Q}” is false. Enter how many of crates 1 to ${n(N)} are like that. Then take crate ${n(x)}, one of them: enter the value of ${F.expr} for it, then the whole number k with that value = ${form}.`,
  answer: [cnt, v, k],
  hints: ['The contrapositive negates both parts and swaps them, so it starts from the negation of the conclusion. For whole numbers the negation of “even” is “odd”.', `Put the crate number into ${F.expr}. For the k, ${F.even ? 'halve the value' : 'take away 1 and halve what is left'}.`],
  solution: `The conclusion “${F.Q}” is false when ${F.nQ}, and the contrapositive is “If ${F.nQ}, then ${F.expr} is ${kind}”. Among crates 1 to ${n(N)}, ${n(cnt)} are ${nQ}. For crate ${n(x)}, ${F.expr} = ${n(v)} = ${F.even ? `2 × ${n(k)}` : `2 × ${n(k)} + 1`}, which is ${kind}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `The contrapositive starts from “${F.nQ}”. How many of crates 1 to ${n(N)} are ${nQ}?`, answer: [cnt], explanation: `${nQ === 'even' ? `Every second crate is even, and ${n(N)} ÷ 2 rounded down is ${n(cnt)}` : `Every second crate is odd, starting at 1, and ${n(N)} ÷ 2 rounded up is ${n(cnt)}`}.` },
   { prompt: `For crate ${n(x)}, what is ${F.expr}?`, answer: [v], explanation: `With n = ${n(x)}, ${F.expr} = ${n(v)}.` },
   { prompt: `${n(v)} should be ${kind}. Which whole number k gives ${n(v)} = ${form}?`, answer: [k], explanation: `${F.even ? `${n(v)} ÷ 2 = ${n(k)}` : `${n(v)} − 1 = ${n(v - 1)} and ${n(v - 1)} ÷ 2 = ${n(k)}`}, so ${n(v)} = ${F.even ? `2 × ${n(k)}` : `2 × ${n(k)} + 1`}.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q16', title: 'The trainee’s wrong turn',
 brief: 'A trainee has proved the wrong direction of a divisibility rule, and Mira needs the smallest number that shows where it breaks.',
 labels: ['statement proved', 'smallest counterexample', 'remainder'], tolerance: 0.01,
 gl: [['statement proved'], ['smallest counterexample'], ['remainder']]
}, {
 canonical: { m: 4, k: 3, T: 20, x: 26, order: [2, 0, 3, 1] },
 draw: R => { let o; do { const m = R.int(3, 7), x = R.int(12, 70);
   o = { m, k: R.int(2, 4), T: R.int(10, 40), x, order: shuffle(R, [0, 1, 2, 3]) };
  } while (o.x % o.m === 0 || (o.m === 4 && o.k === 3 && o.T === 20)); return o; },
 build: ({ m, k, T, x, order }) => { const M = m * k, mult = z => `n is a multiple of ${n(z)}`, not = z => `n is not a multiple of ${n(z)}`,
  list = [`If ${not(m)}, then ${not(M)}.`, `If ${mult(m)}, then ${mult(M)}.`, `If ${not(M)}, then ${not(m)}.`, `If ${mult(M)}, then ${not(m)}.`], idx = order.indexOf(0) + 1;
  const tried = []; let c = (Math.floor(T / m) + 1) * m; while (c % M === 0) { tried.push(c); c += m; } const r = x % m; return {
  prompt: `The outpost rule says: “If ${mult(M)}, then ${mult(m)}.” Mira proves it by contrapositive. Which statement does she actually prove? ${choices(order.map(i => list[i]))} Enter its number. A trainee proved the converse of the rule instead, and the converse is false. Enter the smallest whole number n above ${n(T)} for which the converse fails. Then check Mira’s statement for n = ${n(x)}: enter the remainder when ${n(x)} is divided by ${n(m)}.`,
  answer: [idx, c, r],
  hints: ['The contrapositive of “If p, then q” is “If not q, then not p”: negate both parts and swap them. The converse only swaps them.', `The converse fails for a number that is a multiple of ${n(m)} but not of ${n(M)}. Run through the multiples of ${n(m)} above ${n(T)}.`],
  solution: `The contrapositive of “If ${mult(M)}, then ${mult(m)}” is “If ${not(m)}, then ${not(M)}”, statement ${idx}. ${order.map((i, j) => i === 0 ? '' : `Statement ${j + 1} ${CONTRA_WHY[i]}.`).filter(Boolean).join(' ')} The converse is “If ${mult(m)}, then ${mult(M)}”, and it fails for a multiple of ${n(m)} that is not a multiple of ${n(M)}. Going up through the multiples of ${n(m)} above ${n(T)}: ${tried.length ? `${and(tried.map(String))} ${tried.length === 1 ? 'is' : 'are'} also ${tried.length === 1 ? 'a multiple' : 'multiples'} of ${n(M)}, but ${n(c)} is not` : `the first, ${n(c)}, is not a multiple of ${n(M)}`}, so the smallest counterexample is ${n(c)}. For n = ${n(x)}, ${n(x)} = ${n(m)} × ${n(Math.floor(x / m))} + ${n(r)}, so the remainder is ${n(r)}: ${n(x)} is not a multiple of ${n(m)}, and so not of ${n(M)}.`,
  guidance: [
   { prompt: `Mira starts from “${not(m)}” and ends at “${not(M)}”. Which of the four statements is “If ${not(m)}, then ${not(M)}”?`, answer: [idx], explanation: `Statement ${idx}. It is the contrapositive of “If ${mult(M)}, then ${mult(m)}”: both parts negated and swapped.` },
   { prompt: `The converse is “If ${mult(m)}, then ${mult(M)}”. What is the smallest n above ${n(T)} that is a multiple of ${n(m)} but not of ${n(M)}?`, answer: [c], explanation: tried.length ? `The multiples of ${n(m)} above ${n(T)} start ${[...tried, c].map(String).join(', ')}. ${and(tried.map(String))} ${tried.length === 1 ? 'is' : 'are'} also ${tried.length === 1 ? 'a multiple' : 'multiples'} of ${n(M)}, so the first that is not is ${n(c)}.` : `The first multiple of ${n(m)} above ${n(T)} is ${n(c)}, and it is not a multiple of ${n(M)}.` },
   { prompt: `Check Mira’s statement at n = ${n(x)}. What remainder does ${n(x)} leave when divided by ${n(m)}?`, answer: [r], explanation: `${n(x)} = ${n(m)} × ${n(Math.floor(x / m))} + ${n(r)}, so the remainder is ${n(r)}. It is not 0, so ${n(x)} is not a multiple of ${n(m)}, and so not of ${n(M)}.` }
  ] }; }
});

/* ---- q28 Proof by cases [Levin 3.2] ---- */

/* The term a n² and the sum a n² + b n written out. */
const quad = (a, b) => `${a === 1 ? '' : n(a)}n² + ${b === 1 ? '' : n(b)}n`;

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Pairs in the planting bed',
 brief: 'The greenhouse plants its beds in rows, and the crew wants a proof that the seedlings can always be shared out in pairs.',
 labels: ['cases', 'pairs for the even n', 'pairs for the odd n'], tolerance: 0.01,
 gl: [['cases'], ['pairs for the even n'], ['pairs for the odd n']]
}, {
 canonical: { a: 5, b: 3, e: 14, o: 11 },
 draw: R => { let p; do { p = { a: R.pick([1, 3, 5, 7]), b: R.pick([1, 3, 5, 7]), e: evenIn(R, 2, 15), o: oddIn(R, 1, 14) }; } while (p.a === 5 && p.b === 3 && p.e === 14 && p.o === 11); return p; },
 build: ({ a, b, e, o }) => { const ex = quad(a, b), te = a * e * e + b * e, to = a * o * o + b * o, row = `${a === 1 ? '' : n(a)}n + ${n(b)}`; return {
  prompt: `A planting bed has n rows, and every row holds ${row} seedlings, so the bed holds n(${row}) = ${ex} seedlings in all. The crew wants to share the seedlings out in pairs, so Mira proves by cases that ${ex} is even for every whole number n. Enter the number of cases the proof needs. Then, as checks, enter the number of pairs, (${ex}) ÷ 2, for a bed of n = ${n(e)} rows, then for a bed of n = ${n(o)} rows (type them without commas).`,
  answer: [2, te / 2, to / 2],
  hints: ['The cases sort the whole numbers by whether they are even, the property that changes how the proof goes. Every whole number must land in exactly one group, with none left out. Count the groups.', `Work out ${ex} for the number of rows first, then halve it. The result must be a whole number, because the total is even.`],
  solution: `Two cases cover every whole number. Case 1, n even: n = 2j, so n(${row}) = 2j(${row}) is even. Case 2, n odd: ${a === 1 ? 'n' : `${n(a)}n`} is odd, ${n(b)} is odd, and odd + odd is even, so ${row} is even and so is the product. ∎ For n = ${n(e)}: ${n(a * e * e)} + ${n(b * e)} = ${n(te)}, and ${n(te)} ÷ 2 = ${n(te / 2)} pairs. For n = ${n(o)}: ${n(a * o * o)} + ${n(b * o)} = ${n(to)}, and ${n(to)} ÷ 2 = ${n(to / 2)} pairs.`,
  guidance: [
   { prompt: 'Each case is one group of whole numbers, sorted by whether they are even, and together the groups must cover every whole number. How many cases does the proof need?', answer: [2], explanation: 'Two: n even and n odd. Together they cover every whole number, which a proof by cases must do.' },
   { prompt: `In the even case, take n = ${n(e)}. What is (${ex}) ÷ 2?`, answer: [te / 2], explanation: `${ex} = ${n(a * e * e)} + ${n(b * e)} = ${n(te)}, and ${n(te)} ÷ 2 = ${n(te / 2)}.` },
   { prompt: `In the odd case, take n = ${n(o)}. What is (${ex}) ÷ 2?`, answer: [to / 2], explanation: `${ex} = ${n(a * o * o)} + ${n(b * o)} = ${n(to)}, and ${n(to)} ÷ 2 = ${n(to / 2)}.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Handshakes in the hall',
 brief: 'Two crews meet in the hall and shake hands all round, and the steward wants the counts worked out and the cases behind the arithmetic checked.',
 labels: ['handshakes in the even crew', 'handshakes in the odd crew', 'handshakes between the crews'], tolerance: 0.01,
 gl: [['handshakes in the even crew', 'handshakes in the odd crew'], ['handshakes in the whole group'], ['handshakes between the crews']]
}, {
 canonical: { e: 8, o: 5 },
 draw: R => { let p; do { p = { e: evenIn(R, 2, 12), o: oddIn(R, 1, 11) }; } while (p.e === 8 && p.o === 5); return p; },
 build: ({ e, o }) => { const h = x => x * (x - 1) / 2, A = h(e), B = h(o), T = h(e + o), X = T - A - B; return {
  prompt: `A crew of ${n(e)} people and a crew of ${n(o)} people meet in the hall. In a group of n people everyone shakes hands once with everyone else, which makes n(n − 1) ÷ 2 handshakes. Mira’s proof by cases shows n(n − 1) is even for every whole number n, so this count is always whole: for n even the factor n is even, and for n odd the factor n − 1 is even. Enter the handshakes inside the crew of ${n(e)}, then inside the crew of ${n(o)}. Then enter the handshakes between the two crews when all ${n(e + o)} people have shaken hands with one another.`,
  answer: [A, B, X],
  hints: ['Put the number of people into n(n − 1) ÷ 2. The product is even, so the half is whole.', 'The handshakes between the crews are the handshakes of the whole group, less those inside each crew.'],
  solution: `Crew of ${n(e)} (n even): ${n(e)} × ${n(e - 1)} ÷ 2 = ${n(A)}. Crew of ${n(o)} (n odd, so n − 1 = ${n(o - 1)} is even): ${n(o)} × ${n(o - 1)} ÷ 2 = ${n(B)}. The whole group of ${n(e + o)} people (n odd): ${n(e + o)} × ${n(e + o - 1)} ÷ 2 = ${n(T)}. The handshakes between the crews are ${n(T)} − ${n(A)} − ${n(B)} = ${n(X)}.`,
  guidance: [
   { prompt: `Use n(n − 1) ÷ 2. How many handshakes are there inside the crew of ${n(e)}, then inside the crew of ${n(o)}?`, answer: [A, B], explanation: `${n(e)} × ${n(e - 1)} ÷ 2 = ${n(A)} and ${n(o)} × ${n(o - 1)} ÷ 2 = ${n(B)}.` },
   { prompt: `How many handshakes are there in the whole group of ${n(e + o)} people?`, answer: [T], explanation: `${n(e + o)} × ${n(e + o - 1)} ÷ 2 = ${n(T)}.` },
   { prompt: `The whole group’s handshakes are those inside the first crew, those inside the second, and those between the crews. How many are between the crews?`, answer: [X], explanation: `${n(T)} − ${n(A)} − ${n(B)} = ${n(X)}.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q24', title: 'Three cases for three',
 brief: 'A claim about multiples of 3 will not yield to even and odd, so Mira splits the whole numbers a new way and the workshop checks every piece.',
 labels: ['cases', 'value for the first n', 'value for the second n', 'value for the third n'], tolerance: 0.01,
 gl: [['cases'], ['value for the first n'], ['value for the second n', 'value for the third n']]
}, {
 canonical: { j0: 4, j1: 6, j2: 3 },
 draw: R => { let p; do { p = { j0: R.int(2, 9), j1: R.int(2, 9), j2: R.int(2, 9) }; } while ((p.j0 === 4 && p.j1 === 6 && p.j2 === 3) || (p.j0 === p.j1 && p.j1 === p.j2)); return p; },
 build: ({ j0, j1, j2 }) => { const x0 = 3 * j0, x1 = 3 * j1 + 1, x2 = 3 * j2 + 2, f = x => x * (x + 1) * (x + 2) / 3, v0 = f(x0), v1 = f(x1), v2 = f(x2); return {
  prompt: `Mira has a new claim: for every whole number n, the product n(n + 1)(n + 2) is a multiple of 3. Even and odd will not do here, so she splits the whole numbers by the remainder when divided by 3, which is 0, 1 or 2. Case 1, n = 3j: the factor n is a multiple of 3. Case 2, n = 3j + 1: the factor n + 2 = 3(j + 1) is a multiple of 3. Case 3, n = 3j + 2: the factor n + 1 = 3(j + 1) is a multiple of 3. Enter the number of cases. Then enter n(n + 1)(n + 2) ÷ 3 for n = ${n(x0)}, which falls in case 1, for n = ${n(x1)} in case 2, and for n = ${n(x2)} in case 3 (type them without commas).`,
  answer: [3, v0, v1, v2],
  hints: ['Count the possible remainders when a whole number is divided by 3. Each one is a case, and together they cover every whole number.', 'Multiply the three consecutive numbers first, then divide by 3. The result must be a whole number, because the claim says the product is a multiple of 3.'],
  solution: `The remainder on dividing by 3 is 0, 1 or 2, so three cases cover every whole number. In each case one of the three factors is a multiple of 3, so the product is too. ∎ For n = ${n(x0)}: ${n(x0)} × ${n(x0 + 1)} × ${n(x0 + 2)} = ${n(3 * v0)}, and ${n(3 * v0)} ÷ 3 = ${n(v0)}. For n = ${n(x1)}: ${n(x1)} × ${n(x1 + 1)} × ${n(x1 + 2)} = ${n(3 * v1)}, and ${n(3 * v1)} ÷ 3 = ${n(v1)}. For n = ${n(x2)}: ${n(x2)} × ${n(x2 + 1)} × ${n(x2 + 2)} = ${n(3 * v2)}, and ${n(3 * v2)} ÷ 3 = ${n(v2)}.`,
  guidance: [
   { prompt: 'The remainder on dividing a whole number by 3 can be 0, 1 or 2. How many cases does the proof need?', answer: [3], explanation: 'Three: remainder 0, 1 and 2. Together they cover every whole number, which a proof by cases must do.' },
   { prompt: `In case 1, take n = ${n(x0)}. What is n(n + 1)(n + 2) ÷ 3?`, answer: [v0], explanation: `${n(x0)} × ${n(x0 + 1)} × ${n(x0 + 2)} = ${n(3 * v0)}, and ${n(3 * v0)} ÷ 3 = ${n(v0)}.` },
   { prompt: `Now n = ${n(x1)} (case 2) and n = ${n(x2)} (case 3). Enter n(n + 1)(n + 2) ÷ 3 for each, in that order.`, answer: [v1, v2], explanation: `${n(x1)} × ${n(x1 + 1)} × ${n(x1 + 2)} = ${n(3 * v1)}, and ${n(3 * v1)} ÷ 3 = ${n(v1)}. ${n(x2)} × ${n(x2 + 1)} × ${n(x2 + 2)} = ${n(3 * v2)}, and ${n(3 * v2)} ÷ 3 = ${n(v2)}.` }
  ] }; }
});

/* ---- q29 Chapter review: choosing a method [Levin 3.2] ---- */

const METHODS = ['direct proof', 'proof by contrapositive', 'proof by cases'];
const sq = (x, y) => (x * x - y);
/* One claim: m = method (0 direct, 1 contrapositive, 2 cases); pick(R, big) = {x, y}; ask(x, y), val(x, y), work(x, y). */
const dwhy = (forms, result) => `The hypothesis hands over usable forms, ${forms}, and ${result} at once, so a direct proof works.`;
const cwhy = (expr, flip) => `The hypothesis is about ${expr}, not about n itself, but the contrapositive “${flip}” starts from the form of n and is one line of algebra.`;
const kwhy = expr => `There is no hypothesis to work from, and ${expr} behaves differently for even and odd n, so a proof by cases, n even and n odd, works.`;
const rg = big => big ? [10, 60] : [2, 20];
const CLAIMS = [
 /* bank 1 */
 { m: 0, claim: 'If m is odd and n is even, then m + n is odd.', pick: (R, big) => ({ x: oddIn(R, ...rg(big)), y: evenIn(R, ...rg(big)) }),
   ask: (x, y) => `the whole number k with m + n = 2k + 1, for m = ${n(x)} and n = ${n(y)}`, val: (x, y) => (x + y - 1) / 2,
   why: dwhy('m = 2a + 1 and n = 2b', 'adding them gives 2(a + b) + 1'), work: (x, y) => `${n(x)} + ${n(y)} = ${n(x + y)} = 2 × ${n((x + y - 1) / 2)} + 1, so k = ${n((x + y - 1) / 2)}` },
 { m: 0, claim: 'If 4 | a and 4 | b, with a at least as big as b, then 4 | (a − b).', pick: (R, big) => { const [lo, hi] = rg(big); let s, t; do { s = R.int(lo, hi); t = R.int(lo, hi); } while (s === t); return { x: 4 * Math.max(s, t), y: 4 * Math.min(s, t) }; },
   ask: (x, y) => `the whole number m with a − b = 4m, for a = ${n(x)} and b = ${n(y)}`, val: (x, y) => (x - y) / 4,
   why: dwhy('a = 4s and b = 4t', 'a − b = 4(s − t)'), work: (x, y) => `${n(x)} − ${n(y)} = ${n(x - y)} = 4 × ${n((x - y) / 4)}, so m = ${n((x - y) / 4)}` },
 { m: 1, claim: 'If 5n + 1 is odd, then n is even.', pick: (R, big) => ({ x: oddIn(R, ...rg(big)), y: 0 }),
   ask: x => `the whole number k with 5n + 1 = 2k that the proof gives for n = ${n(x)}`, val: x => (5 * x + 1) / 2,
   why: cwhy('5n + 1', 'if n is odd, then 5n + 1 is even'), work: x => `the proof assumes n is odd; 5 × ${n(x)} + 1 = ${n(5 * x + 1)} = 2 × ${n((5 * x + 1) / 2)}, so k = ${n((5 * x + 1) / 2)}` },
 { m: 1, claim: 'If n² − 2 is odd, then n is odd.', pick: (R, big) => ({ x: evenIn(R, ...rg(big)), y: 0 }),
   ask: x => `the whole number k with n² − 2 = 2k that the proof gives for n = ${n(x)}`, val: x => (x * x - 2) / 2,
   why: cwhy('n² − 2', 'if n is even, then n² − 2 is even'), work: x => `the proof assumes n is even; ${n(x)}² − 2 = ${n(x * x - 2)} = 2 × ${n((x * x - 2) / 2)}, so k = ${n((x * x - 2) / 2)}` },
 { m: 2, claim: 'For every whole number n, (n + 1)(n + 4) is even.', pick: (R, big) => ({ x: R.int(...(big ? [20, 120] : [3, 30])), y: 0 }),
   ask: x => `the whole number (n + 1)(n + 4) ÷ 2 for n = ${n(x)}`, val: x => (x + 1) * (x + 4) / 2,
   why: kwhy('(n + 1)(n + 4)'), work: x => `${n(x + 1)} × ${n(x + 4)} = ${n((x + 1) * (x + 4))} and ${n((x + 1) * (x + 4))} ÷ 2 = ${n((x + 1) * (x + 4) / 2)}` },
 { m: 2, claim: 'For every whole number n, n(3n + 1) is even.', pick: (R, big) => ({ x: R.int(...(big ? [20, 120] : [3, 30])), y: 0 }),
   ask: x => `the whole number n(3n + 1) ÷ 2 for n = ${n(x)}`, val: x => x * (3 * x + 1) / 2,
   why: kwhy('n(3n + 1)'), work: x => `${n(x)} × ${n(3 * x + 1)} = ${n(x * (3 * x + 1))} and ${n(x * (3 * x + 1))} ÷ 2 = ${n(x * (3 * x + 1) / 2)}` },
 /* bank 2 */
 { m: 0, claim: 'If m and n are odd, then m × n is odd.', pick: (R, big) => ({ x: oddIn(R, ...rg(big)), y: oddIn(R, ...rg(big)) }),
   ask: (x, y) => `the whole number k with m × n = 2k + 1, for m = ${n(x)} and n = ${n(y)}`, val: (x, y) => (x * y - 1) / 2,
   why: dwhy('m = 2a + 1 and n = 2b + 1', 'multiplying them gives 2(2ab + a + b) + 1'), work: (x, y) => `${n(x)} × ${n(y)} = ${n(x * y)} = 2 × ${n((x * y - 1) / 2)} + 1, so k = ${n((x * y - 1) / 2)}` },
 { m: 0, claim: 'If 7 | a and 7 | b, with a at least as big as b, then 7 | (a − b).', pick: (R, big) => { const [lo, hi] = rg(big); let s, t; do { s = R.int(lo, hi); t = R.int(lo, hi); } while (s === t); return { x: 7 * Math.max(s, t), y: 7 * Math.min(s, t) }; },
   ask: (x, y) => `the whole number m with a − b = 7m, for a = ${n(x)} and b = ${n(y)}`, val: (x, y) => (x - y) / 7,
   why: dwhy('a = 7s and b = 7t', 'a − b = 7(s − t)'), work: (x, y) => `${n(x)} − ${n(y)} = ${n(x - y)} = 7 × ${n((x - y) / 7)}, so m = ${n((x - y) / 7)}` },
 { m: 1, claim: 'If 3n + 1 is even, then n is odd.', pick: (R, big) => ({ x: evenIn(R, ...rg(big)), y: 0 }),
   ask: x => `the whole number k with 3n + 1 = 2k + 1 that the proof gives for n = ${n(x)}`, val: x => 3 * x / 2,
   why: cwhy('3n + 1', 'if n is even, then 3n + 1 is odd'), work: x => `the proof assumes n is even; 3 × ${n(x)} + 1 = ${n(3 * x + 1)} = 2 × ${n(3 * x / 2)} + 1, so k = ${n(3 * x / 2)}` },
 { m: 1, claim: 'If n² + 4 is odd, then n is odd.', pick: (R, big) => ({ x: evenIn(R, ...rg(big)), y: 0 }),
   ask: x => `the whole number k with n² + 4 = 2k that the proof gives for n = ${n(x)}`, val: x => (x * x + 4) / 2,
   why: cwhy('n² + 4', 'if n is even, then n² + 4 is even'), work: x => `the proof assumes n is even; ${n(x)}² + 4 = ${n(x * x + 4)} = 2 × ${n((x * x + 4) / 2)}, so k = ${n((x * x + 4) / 2)}` },
 { m: 2, claim: 'For every whole number n, (n + 3)(n + 6) is even.', pick: (R, big) => ({ x: R.int(...(big ? [20, 120] : [3, 30])), y: 0 }),
   ask: x => `the whole number (n + 3)(n + 6) ÷ 2 for n = ${n(x)}`, val: x => (x + 3) * (x + 6) / 2,
   why: kwhy('(n + 3)(n + 6)'), work: x => `${n(x + 3)} × ${n(x + 6)} = ${n((x + 3) * (x + 6))} and ${n((x + 3) * (x + 6))} ÷ 2 = ${n((x + 3) * (x + 6) / 2)}` },
 { m: 2, claim: 'For every whole number n, (n − 1)(n + 4) is even.', pick: (R, big) => ({ x: R.int(...(big ? [20, 120] : [3, 30])), y: 0 }),
   ask: x => `the whole number (n − 1)(n + 4) ÷ 2 for n = ${n(x)}`, val: x => (x - 1) * (x + 4) / 2,
   why: kwhy('(n − 1)(n + 4)'), work: x => `${n(x - 1)} × ${n(x + 4)} = ${n((x - 1) * (x + 4))} and ${n((x - 1) * (x + 4))} ÷ 2 = ${n((x - 1) * (x + 4) / 2)}` }
];
const CL_HINT = 'Test the claim against the rule in the prompt. Does it have an “if” part? If it does, is that part about an expression built from n, such as n² or 3n + 5, or about the plain numbers themselves?';
/* The rule of thumb stated in each prompt, so that each claim has exactly one right method. */
const RULE29 = 'Use the workshop’s rule of thumb, which picks exactly one method for each claim. If the claim has no hypothesis (no “if” part) and starts “for every whole number n”, use proof by cases, n even and n odd. If the hypothesis is about an expression built from n, such as n² or 3n + 5, and the conclusion is about n alone, use proof by contrapositive. If the hypothesis is about the plain numbers themselves, such as m and n, or a and b, use direct proof.';

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The proof board, a new claim',
 brief: 'A fresh claim is pinned to the proof board, and the apprentices must name the method before anyone picks up a pen.',
 labels: ['method', 'value'], tolerance: 0.01,
 gl: [['method'], ['value']]
}, {
 canonical: { w: 3, order: [1, 2, 0], x: 14, y: 0 },
 draw: R => { const w = R.int(0, 5); let o; do { const pk = CLAIMS[w].pick(R, false); o = { w, order: shuffle(R, [0, 1, 2]), x: pk.x, y: pk.y }; } while (w === 3 && o.x === 14); return o; },
 build: ({ w, order, x, y }) => { const C = CLAIMS[w], idx = order.indexOf(C.m) + 1, ask = C.ask(x, y), val = C.val(x, y); return {
  prompt: `The proof board shows a new claim: “${C.claim}” ${RULE29} Which method does the rule pick? ${choices(order.map(i => `${cap(METHODS[i])}.`))} Enter the number of the method. Then enter ${ask} (type it without commas).`,
  answer: [idx, val],
  hints: [CL_HINT, 'For the value, put the numbers into the expression the prompt names and solve for the whole number it asks for.'],
  solution: `${C.why} So the rule picks ${METHODS[C.m]}, choice ${idx}. For the value: ${C.work(x, y)}.`,
  guidance: [
   { prompt: `Which method does the rule pick for “${C.claim.replace(/\.$/, '')}”? Enter its number in the list.`, answer: [idx], explanation: `${C.why} So the rule picks ${METHODS[C.m]}, choice ${idx}.` },
   { prompt: `Now enter ${ask}.`, answer: [val], explanation: `${cap(C.work(x, y))}.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Two claims on the board',
 brief: 'Two claims are waiting at once, and the workshop wants each matched to its method and both checked on real numbers in one go.',
 labels: ['method for claim X', 'method for claim Y', 'sum of the two values'], tolerance: 0.01,
 gl: [['method for claim X'], ['method for claim Y'], ['sum of the two values']]
}, {
 canonical: { a: 8, b: 10, order: [1, 2, 0], xa: 10, ya: 0, xb: 7, yb: 0 },
 draw: R => { const bank = [6, 7, 8, 9, 10, 11]; let o, a, b; do { a = R.pick(bank); b = R.pick(bank); const pa = CLAIMS[a].pick(R, false), pb = CLAIMS[b].pick(R, false);
   o = { a, b, order: shuffle(R, [0, 1, 2]), xa: pa.x, ya: pa.y, xb: pb.x, yb: pb.y };
  } while (CLAIMS[a].m === CLAIMS[b].m || (o.a === 8 && o.b === 10 && o.xa === 10 && o.xb === 7)); return o; },
 build: ({ a, b, order, xa, ya, xb, yb }) => { const A = CLAIMS[a], B = CLAIMS[b], ia = order.indexOf(A.m) + 1, ib = order.indexOf(B.m) + 1, va = A.val(xa, ya), vb = B.val(xb, yb), sum = va + vb; return {
  prompt: `Two claims are waiting on the proof board. Claim X: “${A.claim}” Claim Y: “${B.claim}” The methods on offer are: ${choices(order.map(i => `${cap(METHODS[i])}.`))} ${RULE29} Enter the number of the method the rule picks for claim X, then for claim Y. Then enter the sum of two whole numbers: the first is ${A.ask(xa, ya)}, and the second is ${B.ask(xb, yb)} (type it without commas).`,
  answer: [ia, ib, sum],
  hints: [CL_HINT, 'Work out each of the two whole numbers on its own, then add them.'],
  solution: `Claim X: ${A.why} So the rule picks ${METHODS[A.m]}, choice ${ia}. Claim Y: ${B.why} So the rule picks ${METHODS[B.m]}, choice ${ib}. The first number: ${A.work(xa, ya)}. The second: ${B.work(xb, yb)}. Their sum is ${n(va)} + ${n(vb)} = ${n(sum)}.`,
  guidance: [
   { prompt: `Which method does the rule pick for claim X, “${A.claim.replace(/\.$/, '')}”? Enter its number in the list.`, answer: [ia], explanation: `${A.why} So the rule picks ${METHODS[A.m]}, choice ${ia}.` },
   { prompt: `Which method does the rule pick for claim Y, “${B.claim.replace(/\.$/, '')}”? Enter its number in the list.`, answer: [ib], explanation: `${B.why} So the rule picks ${METHODS[B.m]}, choice ${ib}.` },
   { prompt: `Work out the two whole numbers: the first is ${A.ask(xa, ya)}, and the second is ${B.ask(xb, yb)}. Enter their sum.`, answer: [sum], explanation: `The first: ${A.work(xa, ya)}. The second: ${B.work(xb, yb)}. The sum is ${n(va)} + ${n(vb)} = ${n(sum)}.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q24', title: 'A full board of claims',
 brief: 'The board is full: three claims, each needing a different method, and the workshop wants all three matched and checked on larger numbers.',
 labels: ['method for claim X', 'method for claim Y', 'method for claim Z', 'sum of the three values'], tolerance: 0.01,
 gl: [['method for claim X', 'method for claim Y'], ['method for claim Z'], ['sum of the three values']]
}, {
 canonical: { c: [7, 3, 11], order: [2, 0, 1], pr: [[105, 63], [36, 0], [45, 0]] },
 draw: R => { let o; do { const ms = shuffle(R, [0, 1, 2]), c = ms.map(m => 6 * R.int(0, 1) + 2 * m + R.int(0, 1)), pr = c.map(i => { const p = CLAIMS[i].pick(R, true); return [p.x, p.y]; });
   o = { c, order: shuffle(R, [0, 1, 2]), pr };
  } while (o.c.join() === '7,3,11'); return o; },
 build: ({ c, order, pr }) => { const L = c.map(i => CLAIMS[i]), idx = L.map(C => order.indexOf(C.m) + 1), vals = L.map((C, i) => C.val(pr[i][0], pr[i][1])), sum = vals[0] + vals[1] + vals[2], tag = ['X', 'Y', 'Z'];
  const asks = L.map((C, i) => C.ask(pr[i][0], pr[i][1])), works = L.map((C, i) => C.work(pr[i][0], pr[i][1])); return {
  prompt: `The proof board is full. Claim X: “${L[0].claim}” Claim Y: “${L[1].claim}” Claim Z: “${L[2].claim}” The methods on offer are: ${choices(order.map(i => `${cap(METHODS[i])}.`))} ${RULE29} Enter the number of the method the rule picks for claim X, for claim Y, then for claim Z. Then enter the sum of three whole numbers: for X, ${asks[0]}; for Y, ${asks[1]}; for Z, ${asks[2]} (type it without commas).`,
  answer: [...idx, sum],
  hints: [CL_HINT, 'Work out the three whole numbers one at a time, then add them.'],
  solution: `${L.map((C, i) => `Claim ${tag[i]}: ${C.why} So the rule picks ${METHODS[C.m]}, choice ${idx[i]}.`).join(' ')} The three numbers: ${works.map((w, i) => `${tag[i]}, ${w}`).join('; ')}. Their sum is ${n(vals[0])} + ${n(vals[1])} + ${n(vals[2])} = ${n(sum)}.`,
  guidance: [
   { prompt: `Which method does the rule pick for claim X, “${L[0].claim.replace(/\.$/, '')}”, and which for claim Y, “${L[1].claim.replace(/\.$/, '')}”? Enter their numbers in the list, X first.`, answer: [idx[0], idx[1]], explanation: `X: ${L[0].why} So the rule picks ${METHODS[L[0].m]}, choice ${idx[0]}. Y: ${L[1].why} So the rule picks ${METHODS[L[1].m]}, choice ${idx[1]}.` },
   { prompt: `Which method does the rule pick for claim Z, “${L[2].claim.replace(/\.$/, '')}”? Enter its number in the list.`, answer: [idx[2]], explanation: `${L[2].why} So the rule picks ${METHODS[L[2].m]}, choice ${idx[2]}.` },
   { prompt: `Work out the three whole numbers: for X, ${asks[0]}; for Y, ${asks[1]}; for Z, ${asks[2]}. Enter their sum.`, answer: [sum], explanation: `${works.map((w, i) => `${tag[i]}: ${cap(w)}.`).join(' ')} The sum is ${n(vals[0])} + ${n(vals[1])} + ${n(vals[2])} = ${n(sum)}.` }
  ] }; }
});

/* ---- q30 Proof by contradiction [Levin 3.2] ---- */

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The vault keeper’s list',
 brief: 'The keeper of the seed vault says her list holds every prime, and the Inquiry Office wants to know whether Euclid’s number is itself a prime.',
 labels: ['N', 'smallest prime factor', 'N is prime (1 or 0)'], tolerance: 0.01,
 gl: [['N'], ['smallest prime factor'], ['N is prime (1 or 0)']]
}, {
 canonical: { ps: [2, 7, 11] },
 draw: R => { let ps; do { ps = shuffle(R, [2, 3, 5, 7, 11, 13, 17, 19, 23]).slice(0, R.int(2, 4)).sort((a, b) => a - b); } while (prod(ps) > 1500 || (!ps.includes(2) && R.next() < 0.7) || ps.join() === '2,7,11'); return { ps }; },
 build: ({ ps }) => { const P = prod(ps), N = P + 1, p = spf(N), pr = p === N ? 1 : 0; return {
  prompt: `The keeper of the seed vault declares that ${listText(ps)} are the only primes there are. The Inquiry Office answers with Euclid’s proof by contradiction. Assume the keeper’s list is complete, and let N be the product of the listed primes plus 1. Enter N. Then enter the smallest prime factor of N. Then enter 1 if N is itself a prime, or 0 if it is not (type numbers without commas).`,
  answer: [N, p, pr],
  hints: ['Multiply the listed primes together, then add one.', 'Try 2, 3, 5, 7, 11, … in turn. The first prime that divides N exactly is its smallest prime factor. If that factor is N itself, N is prime.'],
  solution: `N = ${prodText(ps)} + 1 = ${n(P)} + 1 = ${n(N)}. N is 1 more than a multiple of each listed prime, so none of them divides it. ${cap(findText(N, p, ps))}. ${pr ? `So N is prime, and it is not on the list.` : `So N is not prime: it is a product of ${n(p)} and ${n(N / p)}.`} Prime or not, N has a prime factor, ${n(p)}, that is not on the list, which contradicts the assumption that the list holds every prime. So no finite list holds every prime. ∎`,
  guidance: [
   { prompt: `What is N, the product ${prodText(ps)} plus 1?`, answer: [N], explanation: `${prodText(ps)} = ${n(P)}, and ${n(P)} + 1 = ${n(N)}.` },
   { prompt: `Find the smallest prime factor of ${n(N)} by trying 2, 3, 5, 7, … in turn.`, answer: [p], explanation: `${cap(findText(N, p, ps))}.` },
   { prompt: `Is ${n(N)} itself a prime? Enter 1 for yes, 0 for no.`, answer: [pr], explanation: pr ? `Its smallest prime factor is ${n(N)} itself, so ${n(N)} is prime.` : `Its smallest prime factor is ${n(p)}, which is less than ${n(N)}, so ${n(N)} is not prime. What matters is that ${n(p)} is missing from the list.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'The repaired list',
 brief: 'The council patches its short list of primes with the new prime Euclid found, and the Inquiry Office has to run the argument against the patched list as well.',
 labels: ['N', 'smallest prime factor', 'new N', 'new smallest prime factor'], tolerance: 0.01,
 gl: [['N', 'smallest prime factor'], ['new N'], ['new smallest prime factor']]
}, {
 canonical: { ps: [2, 5] },
 draw: R => { let ps, N, p, N2; do { ps = shuffle(R, [2, 3, 5, 7, 11, 13, 17, 19]).slice(0, R.int(2, 3)).sort((a, b) => a - b); N = prod(ps) + 1; p = spf(N); N2 = prod(ps) * p + 1;
  } while (prod(ps) > 400 || N2 > 9000 || ps.join() === '2,5'); return { ps }; },
 build: ({ ps }) => { const P = prod(ps), N = P + 1, p = spf(N), ps2 = [...ps, p].sort((a, b) => a - b), P2 = prod(ps2), N2 = P2 + 1, p2 = spf(N2); return {
  prompt: `A council member says ${listText(ps)} are the only primes. Mira runs Euclid’s argument: N is the product of the listed primes plus 1. The council adds the smallest prime factor of N to its list and claims the longer list is complete. Mira runs the argument again on the longer list: N is the product of all its primes plus 1. Enter the first N, then its smallest prime factor. Then enter the new N, then the smallest prime factor of the new N (type numbers without commas).`,
  answer: [N, p, N2, p2],
  hints: ['For each list, multiply all its primes together and add 1, then try 2, 3, 5, 7, … in turn for the smallest prime factor.', 'The longer list is the old list with the first smallest prime factor added.'],
  solution: `First list: N = ${prodText(ps)} + 1 = ${n(N)}. ${cap(findText(N, p, ps))}. The council adds ${n(p)}, so the longer list is ${listText(ps2)}. New N = ${prodText(ps2)} + 1 = ${n(P2)} + 1 = ${n(N2)}. ${cap(findText(N2, p2, ps2))}. Each time the smallest prime factor is missing from the list that was supposed to be complete, so mending the list never works: there is no finite complete list. ∎`,
  guidance: [
   { prompt: `For the list ${listText(ps)}, what is N, and what is its smallest prime factor?`, answer: [N, p], explanation: `N = ${prodText(ps)} + 1 = ${n(N)}. ${cap(findText(N, p, ps))}.` },
   { prompt: `The council adds ${n(p)} to the list, which is now ${listText(ps2)}. What is the new N, the product of these primes plus 1?`, answer: [N2], explanation: `${prodText(ps2)} = ${n(P2)}, and ${n(P2)} + 1 = ${n(N2)}.` },
   { prompt: `Find the smallest prime factor of ${n(N2)} by trying 2, 3, 5, 7, … in turn.`, answer: [p2], explanation: `${cap(findText(N2, p2, ps2))}. It is not on the longer list either.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q24', title: 'The long list',
 brief: 'A longer list of primes is put forward, and the Inquiry Office must follow Euclid’s argument through big numbers and show N is odd.',
 labels: ['N', 'k', 'smallest prime factor', 'N ÷ that factor'], tolerance: 0.01,
 gl: [['N'], ['k'], ['smallest prime factor', 'N ÷ that factor']]
}, {
 canonical: { ps: [2, 3, 5, 7, 11, 13] },
 draw: R => { let ps, N, p; do { ps = [2, ...shuffle(R, [3, 5, 7, 11, 13, 17, 19, 23]).slice(0, R.int(3, 5)).sort((a, b) => a - b)]; N = prod(ps) + 1; p = spf(N);
  } while (prod(ps) < 2000 || prod(ps) > 99998 || p === N || p > 97 || ps.join() === '2,3,5,7,11,13'); return { ps }; },
 build: ({ ps }) => { const P = prod(ps), N = P + 1, k = P / 2, p = spf(N), cof = N / p; return {
  prompt: `A longer list is put forward: ${listText(ps)} are said to be all the primes. Euclid’s N is the product of the listed primes plus 1. Enter N. Because 2 is on the list, the product is even, so N is odd: enter the whole number k with N = 2k + 1. Then enter the smallest prime factor of N, then N divided by that factor (type numbers without commas).`,
  answer: [N, k, p, cof],
  hints: ['Multiply the listed primes together, then add 1. For k, take away 1 and halve what is left.', 'Try the primes 3, 5, 7, 11, … in order. A listed prime leaves remainder 1, so you may skip it, but test every prime that is not on the list. The first prime that divides N exactly is its smallest prime factor.'],
  solution: `N = ${prodText(ps)} + 1 = ${n(P)} + 1 = ${n(N)}. It is odd: ${n(N)} − 1 = ${n(P)} and ${n(P)} ÷ 2 = ${n(k)}, so N = 2 × ${n(k)} + 1 and k = ${n(k)}. Each listed prime leaves remainder 1, so none divides N. ${cap(findText(N, p, ps))}. ${n(p)} is not on the list, which contradicts the assumption that the list holds every prime. ∎`,
  guidance: [
   { prompt: `What is N, the product ${prodText(ps)} plus 1?`, answer: [N], explanation: `${prodText(ps)} = ${n(P)}, and ${n(P)} + 1 = ${n(N)}.` },
   { prompt: `${n(N)} is odd. Which whole number k gives ${n(N)} = 2k + 1?`, answer: [k], explanation: `${n(N)} − 1 = ${n(P)} and ${n(P)} ÷ 2 = ${n(k)}, so ${n(N)} = 2 × ${n(k)} + 1.` },
   { prompt: `Find the smallest prime factor of ${n(N)} by trying 2, 3, 5, 7, … in turn. Enter it, then ${n(N)} divided by it.`, answer: [p, cof], explanation: `${cap(findText(N, p, ps))}. That prime is not on the list: the contradiction.` }
  ] }; }
});

})();
