/* Logic and proof practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p1.js. */
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
const TV = b => b ? 1 : 0;
const word = b => b ? 'true' : 'false';
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;
const upTo = N => Array.from({ length: N }, (_, i) => i + 1);
const list = (N, f) => upTo(N).filter(f);
/* "label 25" or "labels 3, 12 and 26" */
const labs = xs => xs.length === 1 ? `label ${n(xs[0])}` : `labels ${and(xs.map(n))}`;

/* ---- q01 Statements and truth values [CM 2.1] ---- */

/* Four claims about numbers on a notice board; each is true or false at random. Asked: the product, then the number true. */
mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The greenhouse notice board',
 brief: 'The greenhouse crew pin four claims about the seed counts on a notice board, and nobody has checked which of them are true.',
 labels: ['value of the product', 'claims that are true'], tolerance: 0.01,
 gl: [['value of the product', 'true claims among 1 and 2'], ['true claims among 3 and 4'], ['true claims in all']]
}, {
 canonical: { a: 23, b: 19, c: 40, d: 6, e: 7, f: 43, g: 65, h: 18, i: 50, j: 34, k: 28, m: 62 },
 draw: R => { const t = [R.bool(), R.bool(), R.bool(), R.bool()], a = R.int(12, 40), b = R.int(12, 40), d = R.int(3, 9), e = R.except(4, 9, d === 4 ? [7] : []), g = R.int(40, 90), h = R.int(10, 30), j = R.int(20, 60), k = R.int(20, 60);
  const s1 = a + b, s3 = g - h;
  return { a, b, c: t[0] ? s1 - R.int(1, 8) : s1 + R.int(0, 6), d, e, f: t[1] ? d * e : d * e + R.pick([-3, -2, -1, 1, 2, 3, 10]),
   g, h, i: t[2] ? s3 + R.int(1, 6) : Math.max(1, s3 - R.int(0, 6)), j, k, m: t[3] ? j + k : j + k + R.pick([-10, -1, 1, 10]) }; },
 build: ({ a, b, c, d, e, f, g, h, i, j, k, m }) => {
  const s1 = a + b > c, s2 = d * e === f, s3 = g - h < i, s4 = j + k === m, c12 = TV(s1) + TV(s2), c34 = TV(s3) + TV(s4), cnt = c12 + c34;
  return {
  prompt: `The greenhouse notice board shows four claims. Claim 1: “${n(a)} + ${n(b)} is greater than ${n(c)}.” Claim 2: “${n(d)} × ${n(e)} equals ${n(f)}.” Claim 3: “${n(g)} − ${n(h)} is less than ${n(i)}.” Claim 4: “${n(j)} + ${n(k)} equals ${n(m)}.” Each claim is a statement. Enter the value of ${n(d)} × ${n(e)} first. Then enter how many of the four claims are true.`,
  answer: [d * e, cnt],
  hints: ['Work out the calculation in each claim, then compare the two sides.', '“Greater than” and “less than” are both false when the two sides are equal. Count the true claims at the end.'],
  solution: `Claim 1: ${n(a)} + ${n(b)} = ${n(a + b)}, which is ${s1 ? '' : 'not '}greater than ${n(c)}, so it is ${word(s1)}. Claim 2: ${n(d)} × ${n(e)} = ${n(d * e)}, which ${s2 ? 'equals' : 'does not equal'} ${n(f)}, so it is ${word(s2)}. Claim 3: ${n(g)} − ${n(h)} = ${n(g - h)}, which is ${s3 ? '' : 'not '}less than ${n(i)}, so it is ${word(s3)}. Claim 4: ${n(j)} + ${n(k)} = ${n(j + k)}, which ${s4 ? 'equals' : 'does not equal'} ${n(m)}, so it is ${word(s4)}. ${pl(cnt, 'claim is', 'claims are')} true.`,
  guidance: [
   { prompt: `Claim 1 compares ${n(a)} + ${n(b)} with ${n(c)}, and claim 2 compares ${n(d)} × ${n(e)} with ${n(f)}. What is ${n(d)} × ${n(e)}, and how many of these two claims are true?`, answer: [d * e, c12],
    explanation: `${n(d)} × ${n(e)} = ${n(d * e)}. Claim 1 is ${word(s1)} (${n(a + b)} against ${n(c)}) and claim 2 is ${word(s2)}, so ${n(c12)} of the first two ${c12 === 1 ? 'is' : 'are'} true.` },
   { prompt: `Claim 3 compares ${n(g)} − ${n(h)} with ${n(i)}, and claim 4 compares ${n(j)} + ${n(k)} with ${n(m)}. How many of these two claims are true?`, answer: [c34],
    explanation: `Claim 3 is ${word(s3)} (${n(g - h)} against ${n(i)}) and claim 4 is ${word(s4)} (${n(j + k)} against ${n(m)}), so ${n(c34)} of the last two ${c34 === 1 ? 'is' : 'are'} true.` },
   { prompt: 'Add the two counts. How many of the four claims are true?', answer: [cnt], explanation: `${n(c12)} + ${n(c34)} = ${pl(cnt, 'claim is', 'claims are')} true.` }
  ] }; }
});

/* Depot stock after a delivery and a withdrawal, then the truth of a "more than" notice. */
mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'What the notice claims',
 brief: 'A notice about the ration depot has been pinned up, and Mira wants to know whether it is true before anyone plans meals around it.',
 labels: ['packs received', 'packs left', 'notice (1 or 0)'], tolerance: 0.01,
 gl: [['packs received'], ['packs left'], ['notice (1 or 0)']]
}, {
 canonical: { a: 6, b: 12, c: 25, T: 44 },
 draw: R => { const a = R.int(4, 9), b = R.int(6, 15), c = R.int(8, a * b - 10), left = a * b - c;
  return { a, b, c, T: R.bool() ? left - R.int(1, 9) : left + R.int(0, 8) }; },
 build: ({ a, b, c, T }) => { const rec = a * b, left = rec - c, ok = left > T; return {
  prompt: `The ration depot receives ${n(a)} crates, each holding ${n(b)} ration packs. The kitchen then draws out ${n(c)} packs. Mira’s notice reads: “The depot holds more than ${n(T)} packs.” Enter how many packs were received, then how many are left. Then enter the truth value of Mira’s notice (1 for true, 0 for false).`,
  answer: [rec, left, TV(ok)],
  hints: ['Packs received is the number of crates times the packs in each crate. Packs left is what was received, less what was drawn out.', 'The notice is true only if the packs left are more than the number in the notice. If the two are equal, it is false.'],
  solution: `Received: ${n(a)} × ${n(b)} = ${n(rec)} packs. Left: ${n(rec)} − ${n(c)} = ${n(left)} packs. The notice says more than ${n(T)}, and ${n(left)} is ${ok ? '' : 'not '}more than ${n(T)}, so the notice is ${word(ok)}: ${n(TV(ok))}.`,
  guidance: [
   { prompt: `${n(a)} crates each hold ${n(b)} packs. How many packs were received?`, answer: [rec], explanation: `${n(a)} × ${n(b)} = ${n(rec)} packs.` },
   { prompt: `The kitchen draws out ${n(c)} of the ${n(rec)} packs. How many packs are left?`, answer: [left], explanation: `${n(rec)} − ${n(c)} = ${n(left)} packs are left.` },
   { prompt: `The notice says the depot holds more than ${n(T)} packs. Is it true (1) or false (0)?`, answer: [TV(ok)], explanation: `${n(left)} is ${ok ? '' : 'not '}more than ${n(T)}, so the notice is ${word(ok)}.` }
  ] }; }
});

/* Three claims that need the order of operations: a trap in claim 1. Asked: the value of a + b × c, then how many claims are true. */
mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The switch room checking screen',
 brief: 'The switch room checking screen shows three longer claims, and the outpost cannot wire in a rule until each one is marked true or false.',
 labels: ['value of the first left side', 'claims that are true'], tolerance: 0.01,
 gl: [['value of the first left side', 'claim 1 (1 or 0)'], ['true claims among 2 and 3'], ['true claims in all']]
}, {
 canonical: { a: 4, b: 5, c: 3, d: 27, e: 6, f: 4, g: 3, h: 33, i: 8, j: 7, k: 3, l: 4, m: 40 },
 draw: R => { const t = [R.bool(), R.bool(), R.bool()], a = R.int(3, 9), b = R.int(2, 9), c = R.int(2, 9), e = R.int(2, 9), f = R.int(3, 9), g = R.int(2, 6), i = R.int(5, 9), j = R.int(5, 9), k = R.int(2, 4), l = R.int(2, 4), pr = (e + f) * g, s = i * j - k * l;
  return { a, b, c, d: t[0] ? a + b * c : (a + b) * c, e, f, g, h: t[1] ? pr + R.int(1, 6) : pr - R.int(0, 5), i, j, k, l, m: t[2] ? s - R.int(1, 5) : s + R.int(0, 4) }; },
 build: ({ a, b, c, d, e, f, g, h, i, j, k, l, m }) => {
  const v1 = a + b * c, s1 = v1 === d, pr = (e + f) * g, s2 = pr < h, s3v = i * j - k * l, s3 = s3v > m, c23 = TV(s2) + TV(s3), cnt = TV(s1) + c23; return {
  prompt: `The switch room’s checking screen shows three claims. Claim 1: “${n(a)} + ${n(b)} × ${n(c)} equals ${n(d)}.” Claim 2: “(${n(e)} + ${n(f)}) × ${n(g)} is less than ${n(h)}.” Claim 3: “${n(i)} × ${n(j)} − ${n(k)} × ${n(l)} is greater than ${n(m)}.” Each claim is a statement. Brackets are worked out first, then multiplication, then addition and subtraction. Enter the value of ${n(a)} + ${n(b)} × ${n(c)} first. Then enter how many of the three claims are true.`,
  answer: [v1, cnt],
  hints: ['Work out both sides of each claim before you compare them. Brackets first, then multiplication, then addition and subtraction.', 'Claim 1 has a trap: do the multiplication before the addition, not from left to right.'],
  solution: `Claim 1: ${n(b)} × ${n(c)} = ${n(b * c)}, and ${n(a)} + ${n(b * c)} = ${n(v1)}, which ${s1 ? 'equals' : 'does not equal'} ${n(d)}, so it is ${word(s1)}. Claim 2: (${n(e)} + ${n(f)}) × ${n(g)} = ${n(e + f)} × ${n(g)} = ${n(pr)}, which is ${s2 ? '' : 'not '}less than ${n(h)}, so it is ${word(s2)}. Claim 3: ${n(i)} × ${n(j)} = ${n(i * j)} and ${n(k)} × ${n(l)} = ${n(k * l)}, so the left side is ${n(s3v)}, which is ${s3 ? '' : 'not '}greater than ${n(m)}, so it is ${word(s3)}. ${pl(cnt, 'claim is', 'claims are')} true.`,
  guidance: [
   { prompt: `Claim 1 says ${n(a)} + ${n(b)} × ${n(c)} equals ${n(d)}. What is ${n(a)} + ${n(b)} × ${n(c)}, and is the claim true (1) or false (0)?`, answer: [v1, TV(s1)],
    explanation: `Multiply first: ${n(b)} × ${n(c)} = ${n(b * c)}. Then ${n(a)} + ${n(b * c)} = ${n(v1)}, which ${s1 ? 'equals' : 'does not equal'} ${n(d)}, so claim 1 is ${word(s1)}.` },
   { prompt: `Claim 2 compares (${n(e)} + ${n(f)}) × ${n(g)} with ${n(h)}, and claim 3 compares ${n(i)} × ${n(j)} − ${n(k)} × ${n(l)} with ${n(m)}. How many of these two claims are true?`, answer: [c23],
    explanation: `Claim 2 has ${n(pr)} on the left, so it is ${word(s2)}. Claim 3 has ${n(s3v)} on the left, so it is ${word(s3)}. That is ${n(c23)} true.` },
   { prompt: 'Claim 1 adds 1 to the count if it is true and 0 if it is false. Add that to the count of true claims among 2 and 3. How many of the three claims are true?', answer: [cnt], explanation: `${n(TV(s1))} + ${n(c23)} = ${pl(cnt, 'claim is', 'claims are')} true.` }
  ] }; }
});

/* ---- q02 Negation ¬ [CM 2.1] ---- */

/* p is "colder than k" or "at most k". Asked: ¬p for the last reading, then how many of six readings make ¬p true. */
mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The thermostat log',
 brief: 'The greenhouse thermostat answers to one rule and its opposite, and the log of last night’s readings has to be sorted by the opposite.',
 labels: ['¬p for the last reading (1 or 0)', 'readings with ¬p true'], tolerance: 0.01,
 gl: [['p (1 or 0)', '¬p (1 or 0)'], ['readings with ¬p true']]
}, {
 canonical: { kind: 'colder', k: 18, log: [16, 21, 18, 15, 19, 17] },
 draw: R => { let o; do { const k = R.int(14, 24), kind = R.pick(['colder', 'atmost']), log = upTo(6).map(() => R.int(k - 6, k + 6)); log[R.int(0, 5)] = k;
   o = { kind, k, log }; const c = log.filter(x => kind === 'colder' ? x >= k : x > k).length; if (c >= 2 && c <= 4) return o; } while (true); },
 build: ({ kind, k, log }) => { const w = kind === 'colder' ? 'colder than' : 'at most', p = x => kind === 'colder' ? x < k : x <= k, last = log[log.length - 1],
  yes = log.filter(x => !p(x)), notp = kind === 'colder' ? `${n(k)} degrees or more` : `more than ${n(k)} degrees`; return {
  prompt: `The greenhouse thermostat rule p says: “The greenhouse is ${w} ${n(k)} degrees.” Its negation ¬p says: “The greenhouse is not ${w} ${n(k)} degrees.” The hourly log shows these temperatures, in degrees: ${log.map(n).join(', ')}. Enter the truth value of ¬p for the last reading (1 for true, 0 for false). Then enter how many readings in the log make ¬p true.`,
  answer: [TV(!p(last)), yes.length],
  hints: ['¬p is the opposite of p. Decide p for a reading first, then flip it.', 'A reading equal to the limit needs care: decide whether p is true for it, then flip.'],
  solution: `For the last reading, ${n(last)} degrees, p is ${word(p(last))}, so ¬p is ${word(!p(last))}: ${n(TV(!p(last)))}. ¬p means the greenhouse is ${notp}. The readings that make ¬p true are ${and(yes.map(n))}, which is ${n(yes.length)} readings.`,
  guidance: [
   { prompt: `The last reading is ${n(last)} degrees. Is p, “the greenhouse is ${w} ${n(k)} degrees”, true (1) or false (0) for it? Then what is ¬p?`, answer: [TV(p(last)), TV(!p(last))],
    explanation: `${n(last)} ${p(last) ? 'is' : 'is not'} ${w} ${n(k)}, so p is ${word(p(last))} and ¬p, its opposite, is ${word(!p(last))}.` },
   { prompt: `¬p means the greenhouse is ${notp}. How many of the six readings make ¬p true?`, answer: [yes.length], explanation: `The readings ${and(yes.map(n))} are ${notp}: ${n(yes.length)} readings.` }
  ] }; }
});

/* A battery that drains by a fixed amount each hour. p: "above k percent". Asked: level after h hours, ¬p then, and the hours with ¬p. */
mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'The rover’s fading battery',
 brief: 'A survey rover heads out at full charge, and the base needs to know in which hours its rule sends it home.',
 labels: ['battery level (per cent)', '¬p at that hour (1 or 0)', 'hours with ¬p true'], tolerance: 0.01,
 gl: [['battery level (per cent)'], ['¬p at that hour (1 or 0)'], ['hours with ¬p true']]
}, {
 canonical: { s: 96, a: 7, k: 50, h: 5, H: 9 },
 draw: R => { let o; do { const k = R.int(40, 60), s = R.int(90, 100), a = R.int(5, 9); o = { s, a, k, h: R.int(3, 7), H: 9 };
   const c = upTo(9).filter(t => s - a * t <= k).length; if (c >= 2 && c <= 6) return o; } while (true); },
 build: ({ s, a, k, h, H }) => { const lvl = s - a * h, notp = lvl <= k, hrs = list(H, t => s - a * t <= k); return {
  prompt: `A survey rover leaves base with its battery at ${n(s)} per cent, and every hour the reading on the gauge goes down by ${n(a)}: from ${n(s)} per cent to ${n(s - a)} per cent after the first hour, then ${n(s - 2 * a)} per cent, and so on. Rule p says: “The battery is above ${n(k)} per cent.” The rover must turn back whenever ¬p is true. Enter the battery level after ${n(h)} hours. Then enter the truth value of ¬p at that moment (1 for true, 0 for false). Then enter in how many of the first ${n(H)} hours, counted at the end of each hour, ¬p is true.`,
  answer: [lvl, TV(notp), hrs.length],
  hints: ['After some hours the level is the starting level less the drop for each hour: start − drop × hours.', 'p is “above the limit”, so ¬p is “at the limit or below it”. Check the end of each hour in turn.'],
  solution: `After ${n(h)} hours the level is ${n(s)} − ${n(a)} × ${n(h)} = ${n(lvl)} per cent. p says the battery is above ${n(k)}; ${n(lvl)} is ${notp ? 'not ' : ''}above ${n(k)}, so p is ${word(!notp)} and ¬p is ${word(notp)}: ${n(TV(notp))}. ¬p is true when the level is ${n(k)} or less, which happens at the end of hours ${and(hrs.map(n))}: ${n(hrs.length)} hours.`,
  guidance: [
   { prompt: `The battery starts at ${n(s)} per cent and the reading goes down by ${n(a)} each hour. What is the level after ${n(h)} hours?`, answer: [lvl], explanation: `${n(s)} − ${n(a)} × ${n(h)} = ${n(s)} − ${n(a * h)} = ${n(lvl)} per cent.` },
   { prompt: `At ${n(lvl)} per cent, is ¬p, “the battery is not above ${n(k)} per cent”, true (1) or false (0)?`, answer: [TV(notp)], explanation: `${n(lvl)} is ${notp ? 'not ' : ''}above ${n(k)}, so p is ${word(!notp)} and ¬p is ${word(notp)}.` },
   { prompt: `¬p is true when the level is ${n(k)} or less. In how many of the first ${n(H)} hours, counted at the end of each hour, is that so?`, answer: [hrs.length], explanation: `The level is ${n(k)} or less at the end of hours ${and(hrs.map(n))}: ${n(hrs.length)} hours.` }
  ] }; }
});

/* p: "n × m is less than k". Asked: how many n from 1 to N make ¬p true, how many make ¬(¬p) true, and the smallest n that makes ¬p true. */
mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'Flipping the rule twice',
 brief: 'A switch-room rule is wired in backwards on one line and forwards on another, and Mira needs to know how many panel numbers each wiring picks out.',
 labels: ['numbers with ¬p true', 'numbers with ¬(¬p) true', 'smallest number with ¬p true'], tolerance: 0.01,
 gl: [['numbers with p true'], ['numbers with ¬p true', 'numbers with ¬(¬p) true'], ['smallest number with ¬p true']]
}, {
 canonical: { m: 6, k: 47, N: 26 },
 draw: R => { let o; do { const m = R.int(3, 8), k = R.int(30, 70), N = R.int(24, 30), pc = list(N, x => x * m < k).length; o = { m, k, N }; if (pc >= 4 && pc + 1 <= N - 3) return o; } while (true); },
 build: ({ m, k, N }) => { const pc = list(N, x => x * m < k).length, np = N - pc, sm = pc + 1; return {
  prompt: `A switch-room rule p says: “${'n × ' + n(m)} is less than ${n(k)}”, where n is a panel number. Take the panel numbers 1 to ${n(N)}. Enter how many of them make ¬p true, then how many make ¬(¬p) true. Then enter the smallest panel number that makes ¬p true. (¬(¬p) means: take the negation of ¬p.)`,
  answer: [np, pc, sm],
  hints: [`Find first the panel numbers that make p true. n × ${n(m)} gets bigger as n grows, so p is true for the small panels and false for the rest.`, '¬(¬p) turns the truth value over twice. Compare it with p itself.'],
  solution: `n × ${n(m)} is less than ${n(k)} for n = 1 up to ${n(pc)} (${n(pc)} × ${n(m)} = ${n(pc * m)}, but ${n(sm)} × ${n(m)} = ${n(sm * m)} is not less than ${n(k)}). So p is true for ${n(pc)} numbers and false for the other ${n(np)}. ¬p is true for those ${n(np)} numbers. Turning ¬p over again gives p back, so ¬(¬p) is true for ${n(pc)} numbers. The smallest number that makes ¬p true is ${n(sm)}.`,
  guidance: [
   { prompt: `For how many panel numbers from 1 to ${n(N)} is n × ${n(m)} less than ${n(k)}? That is how many make p true.`, answer: [pc], explanation: `n × ${n(m)} stays below ${n(k)} up to n = ${n(pc)} and reaches ${n(sm * m)} at n = ${n(sm)}, so p is true for ${n(pc)} numbers.` },
   { prompt: `Of the ${n(N)} panel numbers, p is true for ${n(pc)}. How many make ¬p true, and how many make ¬(¬p) true?`, answer: [np, pc], explanation: `¬p is true exactly where p is false: ${n(N)} − ${n(pc)} = ${n(np)} numbers. ¬(¬p) flips twice, so it matches p: ${n(pc)} numbers.` },
   { prompt: 'p is true for the first panels in order and false from then on. What is the smallest panel number that makes ¬p true?', answer: [sm], explanation: `The first number where p fails is ${n(pc)} + 1 = ${n(sm)}, so ¬p is true from ${n(sm)} on.` }
  ] }; }
});

/* ---- q03 And (∧) [CM 2.2] ---- */

/* Six sensor samples (temperature, pressure). p: temperature greater than T; q: pressure less than P. Asked: p ∧ q for sample 1, how many true, how many with p true and q false. */
mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'The vent that needs two keys',
 brief: 'A greenhouse vent opens only when two sensors agree, and the crew want to see how often that happened in six samples.',
 labels: ['p ∧ q for sample 1 (1 or 0)', 'samples with p ∧ q true', 'samples with p true and q false'], tolerance: 0.01,
 gl: [['p (1 or 0)', 'q (1 or 0)'], ['samples with p ∧ q true'], ['samples with p true, q false']]
}, {
 canonical: { T: 24, P: 100, log: [[26, 103], [22, 98], [27, 97], [25, 99], [23, 101], [28, 104]] },
 draw: R => { let o; do { const T = R.int(20, 28), P = R.int(95, 105), log = upTo(6).map(() => [R.int(T - 4, T + 5), R.int(P - 6, P + 6)]);
   o = { T, P, log }; const both = log.filter(([t, p]) => t > T && p < P).length, po = log.filter(([t, p]) => t > T && p >= P).length; if (both >= 1 && po >= 1) return o; } while (true); },
 build: ({ T, P, log }) => { const hp = ([t]) => t > T, hq = ([, p]) => p < P, idx = f => log.map((x, i) => i + 1).filter(i => f(log[i - 1])), both = idx(x => hp(x) && hq(x)), po = idx(x => hp(x) && !hq(x)), pl1 = idx(hp), s1 = log[0]; return {
  prompt: `A greenhouse sensor takes six samples, each a temperature in degrees and a pressure in kPa (kilopascals, a unit of pressure): ${log.map(([t, p], i) => `sample ${i + 1}, ${n(t)} and ${n(p)}`).join('; ')}. The vent opens for a sample when p ∧ q is true, where p is “the temperature is greater than ${n(T)}” and q is “the pressure is less than ${n(P)}”. Enter the truth value of p ∧ q for sample 1 (1 for true, 0 for false). Then enter how many samples make p ∧ q true, and how many make p true but q false.`,
  answer: [TV(hp(s1) && hq(s1)), both.length, po.length],
  hints: ['Check each sample against p and against q. p ∧ q needs both parts true.', 'A sample with p true and q false has one part true, so it does not open the vent.'],
  solution: `Sample 1: p is ${word(hp(s1))} and q is ${word(hq(s1))}, so p ∧ q is ${word(hp(s1) && hq(s1))}: ${n(TV(hp(s1) && hq(s1)))}. The samples with p true are ${and(pl1.map(n))}. Of these, ${both.length === 1 ? 'sample' : 'samples'} ${and(both.map(n))} also ${both.length === 1 ? 'has' : 'have'} q true, so ${pl(both.length, 'sample')} make${both.length === 1 ? 's' : ''} p ∧ q true. The other ${pl(po.length, 'sample')} (${and(po.map(n))}) ha${po.length === 1 ? 's' : 've'} p true and q false.`,
  guidance: [
   { prompt: `Sample 1 is ${n(s1[0])} degrees and ${n(s1[1])} kPa. Is p true (1) or false (0)? Is q?`, answer: [TV(hp(s1)), TV(hq(s1))], explanation: `${n(s1[0])} is ${hp(s1) ? '' : 'not '}greater than ${n(T)}, so p is ${word(hp(s1))}; ${n(s1[1])} is ${hq(s1) ? '' : 'not '}less than ${n(P)}, so q is ${word(hq(s1))}.` },
   { prompt: 'In how many of the six samples are p and q both true?', answer: [both.length], explanation: `${both.length === 1 ? 'Sample' : 'Samples'} ${and(both.map(n))} ${both.length === 1 ? 'has' : 'have'} both parts true: ${pl(both.length, 'sample')}.` },
   { prompt: 'In how many samples is p true while q is false?', answer: [po.length], explanation: `p is true in samples ${and(pl1.map(n))}. Those that are not in the both-true list are ${and(po.map(n))}: ${pl(po.length, 'sample')}.` }
  ] }; }
});

/* A bell every a minutes and a shift that starts after minute w. Asked: bells up to N, bells up to w, and bells in the evening shift (p ∧ q). */
mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Bells in the evening shift',
 brief: 'The docking bay rings a bell on a fixed beat, and the evening crew, who start late, want to know how many bells fall in their watch.',
 labels: ['bells from minute 1 to the end', 'bells up to the shift start', 'bells in the evening shift'], tolerance: 0.01,
 gl: [['bells from minute 1 to the end'], ['bells up to the shift start'], ['bells in the evening shift']]
}, {
 canonical: { a: 7, N: 60, w: 20 },
 draw: R => { let o; do { const a = R.int(3, 9), N = R.int(40, 70), w = R.int(10, 30); o = { a, N, w }; const pc = Math.floor(N / a), pw = Math.floor(w / a); if (pw >= 1 && pc - pw >= 2) return o; } while (true); },
 build: ({ a, N, w }) => { const pc = Math.floor(N / a), pw = Math.floor(w / a), both = pc - pw; return {
  prompt: `The docking bay rings a bell at every minute that is a multiple of ${n(a)}: minute ${n(a)}, minute ${n(2 * a)}, and so on. The evening crew start after minute ${n(w)}. Let p be “the bell rings at minute n” and q be “minute n is after minute ${n(w)}”. Look at the minutes 1 to ${n(N)}. Enter how many of them make p true. Then enter how many of the minutes 1 to ${n(w)} make p true. Then enter how many of the minutes 1 to ${n(N)} make p ∧ q true.`,
  answer: [pc, pw, both],
  hints: ['To count the multiples of a number up to a limit, see how many times the number fits into the limit and ignore the remainder.', 'The minutes up to the shift start make q false, so they cannot count for p ∧ q. Take their bells away from the total.'],
  solution: `Multiples of ${n(a)} up to ${n(N)}: ${n(a)} fits ${n(pc)} times, so p is true for ${n(pc)} minutes. Up to minute ${n(w)} it fits ${n(pw)} times. The minutes up to ${n(w)} make q false. So p ∧ q is true for ${n(pc)} − ${n(pw)} = ${n(both)} minutes.`,
  guidance: [
   { prompt: `How many multiples of ${n(a)} are there from 1 to ${n(N)}? That is how many minutes make p true.`, answer: [pc], explanation: `${n(a)} × ${n(pc)} = ${n(a * pc)} is the last multiple that fits, so there are ${n(pc)}.` },
   { prompt: `How many multiples of ${n(a)} are there from 1 to ${n(w)}? Those minutes have q false.`, answer: [pw], explanation: `${n(a)} × ${n(pw)} = ${n(a * pw)} is the last multiple that fits, so there are ${n(pw)}.` },
   { prompt: 'Take the second count away from the first. How many minutes make p ∧ q true?', answer: [both], explanation: `${n(pc)} − ${n(pw)} = ${n(both)}. These bells ring after the shift starts.` }
  ] }; }
});

/* p: multiple of a; q: less than v. Asked: p ∧ ¬q at code x, then counts of p ∧ q and p ∧ ¬q. */
mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'The vault door code',
 brief: 'The vault door obeys a rule with a “not” inside it, and the council wants to know how many codes the rule lets through.',
 labels: ['p ∧ ¬q for the code (1 or 0)', 'codes with p ∧ q true', 'codes with p ∧ ¬q true'], tolerance: 0.01,
 gl: [['p (1 or 0)', '¬q (1 or 0)'], ['codes with p true'], ['codes with p ∧ q true', 'codes with p ∧ ¬q true']]
}, {
 canonical: { a: 6, v: 40, N: 80, x: 54 },
 draw: R => { const a = R.int(4, 9), N = R.int(70, 95), v = R.int(25, 55), x = R.bool() ? a * R.int(2, Math.floor(N / a)) : R.int(10, N); return { a, v, N, x }; },
 build: ({ a, v, N, x }) => { const pc = Math.floor(N / a), c1 = list(N, y => y % a === 0 && y < v).length, c2 = pc - c1, px = x % a === 0, nq = x >= v; return {
  prompt: `The vault door opens for a code number n when p ∧ ¬q is true, where p is “n is a multiple of ${n(a)}” and q is “n is less than ${n(v)}”. Enter the truth value of p ∧ ¬q for the code ${n(x)} (1 for true, 0 for false). Then enter how many whole numbers from 1 to ${n(N)} make p ∧ q true, and how many make p ∧ ¬q true.`,
  answer: [TV(px && nq), c1, c2],
  hints: ['¬q is true when q is false: a code that is not less than the limit. The limit itself counts as ¬q true.', 'Every code that makes p true makes exactly one of q and ¬q true. So the two counts add up to the number of codes that make p true.'],
  solution: `For ${n(x)}: p is ${word(px)}, q is ${word(!nq)}, so ¬q is ${word(nq)} and p ∧ ¬q is ${word(px && nq)}: ${n(TV(px && nq))}. From 1 to ${n(N)} there are ${n(pc)} multiples of ${n(a)}. Of them, ${n(c1)} are less than ${n(v)}, so p ∧ q is true for ${n(c1)} numbers. The other ${n(pc)} − ${n(c1)} = ${n(c2)} have ¬q true, so p ∧ ¬q is true for ${n(c2)} numbers.`,
  guidance: [
   { prompt: `For the code ${n(x)}, is p, “a multiple of ${n(a)}”, true (1) or false (0)? Is ¬q, “not less than ${n(v)}”?`, answer: [TV(px), TV(nq)], explanation: `p is ${word(px)} for ${n(x)}. ${n(x)} is ${nq ? 'not ' : ''}less than ${n(v)}, so q is ${word(!nq)} and ¬q is ${word(nq)}.` },
   { prompt: `How many whole numbers from 1 to ${n(N)} make p true?`, answer: [pc], explanation: `${n(a)} × ${n(pc)} = ${n(a * pc)} is the last multiple of ${n(a)} up to ${n(N)}, so ${n(pc)} numbers are multiples of ${n(a)}.` },
   { prompt: `Of those ${n(pc)} multiples, how many are less than ${n(v)} (p ∧ q), and how many are not (p ∧ ¬q)?`, answer: [c1, c2], explanation: `${n(c1)} multiples are less than ${n(v)}. The rest, ${n(pc)} − ${n(c1)} = ${n(c2)}, are not.` }
  ] }; }
});

/* ---- q04 Inclusive or (∨) [CM 2.2] ---- */

/* Seven crates (label, mass). p: mass more than M; q: label a multiple of m. Asked: crates inspected (p ∨ q) and crates with both. */
mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The crates flagged on the dock',
 brief: 'Crates are being flagged for inspection on the loading dock by two separate checks, and the dock manager wants the day’s total.',
 labels: ['crates inspected', 'crates with p and q both true'], tolerance: 0.01,
 gl: [['crates with p true', 'crates with q true'], ['crates with both true'], ['crates inspected']]
}, {
 canonical: { M: 22, m: 4, items: [[3, 31], [8, 15], [12, 24], [17, 9], [20, 19], [26, 28], [31, 12]] },
 draw: R => { let o; do { const M = R.int(18, 28), m = R.int(3, 6), labs = new Set(); while (labs.size < 7) labs.add(R.int(1, 40));
   const items = [...labs].sort((x, y) => x - y).map(l => [l, R.int(8, 40)]); o = { M, m, items };
   const both = items.filter(([l, w]) => w > M && l % m === 0).length, un = items.filter(([l, w]) => w > M || l % m === 0).length; if (both >= 1 && un <= 6 && un >= both + 2) return o; } while (true); },
 build: ({ M, m, items }) => { const hp = ([, w]) => w > M, hq = ([l]) => l % m === 0, lab = f => items.filter(f).map(x => x[0]), pL = lab(hp), qL = lab(hq), bL = lab(x => hp(x) && hq(x)), uL = lab(x => hp(x) || hq(x)); return {
  prompt: `The loading dock inspects a crate when p ∨ q is true, where p is “the crate’s mass is more than ${n(M)} kg” and q is “the crate’s label number is a multiple of ${n(m)}”. Here “or” is inclusive. Seven crates arrive, each given as label number and mass in kg: ${items.map(([l, w]) => `${n(l)} and ${n(w)}`).join('; ')}. Enter how many of the seven crates are inspected. Then enter for how many crates both p and q are true.`,
  answer: [uL.length, bL.length],
  hints: ['Check each crate against p and against q. One true part is enough for p ∨ q.', 'A crate where both parts are true is inspected once. It shows up in both lists, so count it only once in the total.'],
  solution: `Crates with p true (mass over ${n(M)}): ${labs(pL)}. Crates with q true (label a multiple of ${n(m)}): ${labs(qL)}. Both are true for ${and(bL.map(n))}, which is ${pl(bL.length, 'crate')}. The inspected crates are ${and(uL.map(n))}: ${n(pL.length)} + ${n(qL.length)} − ${n(bL.length)} = ${pl(uL.length, 'crate')}.`,
  guidance: [
   { prompt: 'How many of the seven crates make p true, and how many make q true?', answer: [pL.length, qL.length], explanation: `p is true for ${labs(pL)} (${pl(pL.length, 'crate')}) and q for ${labs(qL)} (${pl(qL.length, 'crate')}).` },
   { prompt: 'How many crates make both p and q true?', answer: [bL.length], explanation: `${bL.length === 1 ? `Label ${n(bL[0])} is` : `Labels ${and(bL.map(n))} are`} in both lists: ${pl(bL.length, 'crate')}.` },
   { prompt: 'Add the two counts and take the overlap away once. How many crates make p ∨ q true?', answer: [uL.length], explanation: `${n(pL.length)} + ${n(qL.length)} − ${n(bL.length)} = ${n(uL.length)} crates are inspected.` }
  ] }; }
});

/* Lockers 1..N painted red (multiples of a) and blue (multiples of b). Asked: painted both, painted at least once, not painted. */
mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Painting the airlock lockers',
 brief: 'The crew are colour-coding the airlock lockers in two coats, and the paint store needs to know how many lockers end up with no paint at all.',
 labels: ['lockers painted both colours', 'lockers painted at least once', 'lockers not painted'], tolerance: 0.01,
 gl: [['lockers painted red', 'lockers painted blue'], ['lockers painted both colours'], ['lockers painted at least once', 'lockers not painted']]
}, {
 canonical: { a: 4, b: 6, N: 50 },
 draw: R => { let o; do { const a = R.int(3, 6), b = R.int(4, 9), N = R.int(40, 70); o = { a, b, N }; if (a !== b && lcm(a, b) <= N / 2 && lcm(a, b) > Math.max(a, b)) return o; } while (true); },
 build: ({ a, b, N }) => { const L = lcm(a, b), pc = Math.floor(N / a), qc = Math.floor(N / b), both = Math.floor(N / L), un = pc + qc - both, none = N - un; return {
  prompt: `The outpost has ${n(N)} airlock lockers, numbered 1 to ${n(N)}. The crew paint red every locker whose number is a multiple of ${n(a)}, and blue every locker whose number is a multiple of ${n(b)}. A locker that is both gets both coats. Let p be “locker n is painted red” and q be “locker n is painted blue”. Enter how many lockers make p ∧ q true, then how many make p ∨ q true, then how many lockers are not painted at all.`,
  answer: [both, un, none],
  hints: ['A locker painted both colours has a number that is a multiple of both. Find the smallest number that is in both lists, then count its multiples.', 'For p ∨ q add the two counts and take the overlap away once. The lockers not painted are all the others.'],
  solution: `Red: ${n(a)} × ${n(pc)} = ${n(a * pc)} is the last multiple of ${n(a)} up to ${n(N)}, so ${n(pc)} lockers. Blue: ${n(b)} × ${n(qc)} = ${n(b * qc)} is the last multiple of ${n(b)}, so ${n(qc)} lockers. The smallest number that is a multiple of both ${n(a)} and ${n(b)} is ${n(L)}, so ${n(both)} lockers get both coats. Painted at least once: ${n(pc)} + ${n(qc)} − ${n(both)} = ${n(un)}. Not painted: ${n(N)} − ${n(un)} = ${n(none)}.`,
  guidance: [
   { prompt: `How many lockers from 1 to ${n(N)} are red (multiples of ${n(a)}), and how many are blue (multiples of ${n(b)})?`, answer: [pc, qc], explanation: `${n(a)} × ${n(pc)} = ${n(a * pc)} is the last multiple of ${n(a)} up to ${n(N)}, and ${n(b)} × ${n(qc)} = ${n(b * qc)} is the last multiple of ${n(b)}, so ${n(pc)} red and ${n(qc)} blue.` },
   { prompt: `The smallest number that is a multiple of both ${n(a)} and ${n(b)} is ${n(L)}. How many lockers from 1 to ${n(N)} get both coats?`, answer: [both], explanation: `Lockers with both coats are the multiples of ${n(L)}: ${n(L)} × ${n(both)} = ${n(L * both)} is the last one up to ${n(N)}, so ${pl(both, 'locker')}.` },
   { prompt: 'How many lockers make p ∨ q true, and how many are not painted at all?', answer: [un, none], explanation: `${n(pc)} + ${n(qc)} − ${n(both)} = ${n(un)} lockers have at least one coat, so ${n(N)} − ${n(un)} = ${n(none)} have none.` }
  ] }; }
});

/* (p ∨ q) ∧ r on 1..N, p: multiple of a, q: greater than v, r: less than w. */
mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'The dock gate with brackets',
 brief: 'The dock gate rule mixes an “or” and an “and”, and the controllers need to know which pass numbers get through.',
 labels: ['(p ∨ q) ∧ r for the pass (1 or 0)', 'numbers with p ∨ q true', 'numbers with (p ∨ q) ∧ r true'], tolerance: 0.01,
 gl: [['p ∨ q (1 or 0)', '(p ∨ q) ∧ r (1 or 0)'], ['numbers with p ∨ q true'], ['numbers with (p ∨ q) ∧ r true']]
}, {
 canonical: { a: 7, v: 38, w: 30, N: 60, x: 35 },
 draw: R => { let o; do { const a = R.int(4, 9), N = R.int(50, 80), v = R.int(30, 50), w = R.int(15, 45), x = R.int(5, N); o = { a, v, w, N, x };
   const c = list(N, y => (y % a === 0 || y > v) && y < w).length; if (c >= 3) return o; } while (true); },
 build: ({ a, v, w, N, x }) => { const h = y => y % a === 0 || y > v, f = y => h(y) && y < w, pq = list(N, h).length, fin = list(N, f).length,
  cm = list(N, y => y % a === 0).length, cg = list(N, y => y > v).length, cb = list(N, y => y % a === 0 && y > v).length; return {
  prompt: `A dock gate opens for a pass number n when (p ∨ q) ∧ r is true, where p is “n is a multiple of ${n(a)}”, q is “n is greater than ${n(v)}” and r is “n is less than ${n(w)}”. The brackets mean: decide p ∨ q first, then join the result to r with “and”. Enter the truth value of (p ∨ q) ∧ r for the pass ${n(x)} (1 for true, 0 for false). Then enter how many whole numbers from 1 to ${n(N)} make p ∨ q true, and how many make (p ∨ q) ∧ r true.`,
  answer: [TV(f(x)), pq, fin],
  hints: ['Decide p ∨ q first. Then (p ∨ q) ∧ r is true only when that result and r are both true.', 'Numbers that make p ∨ q true but r false do not pass the gate. List the p ∨ q numbers, then drop those that are not less than the limit in r.'],
  solution: `For ${n(x)}: p is ${word(x % a === 0)}, q is ${word(x > v)}, so p ∨ q is ${word(h(x))}; r is ${word(x < w)}. So (p ∨ q) ∧ r is ${word(f(x))}: ${n(TV(f(x)))}. From 1 to ${n(N)}, p ∨ q is true for ${n(pq)} numbers. Of these, ${n(fin)} are also less than ${n(w)}, so (p ∨ q) ∧ r is true for ${n(fin)} numbers.`,
  guidance: [
   { prompt: `For the pass ${n(x)}, is p ∨ q true (1) or false (0)? Then is (p ∨ q) ∧ r true?`, answer: [TV(h(x)), TV(f(x))], explanation: `p is ${word(x % a === 0)} and q is ${word(x > v)}, so p ∨ q is ${word(h(x))}. r is ${word(x < w)}, so (p ∨ q) ∧ r is ${word(f(x))}.` },
   { prompt: `How many whole numbers from 1 to ${n(N)} make p ∨ q true? Count the multiples of ${n(a)}, count those greater than ${n(v)}, and take the overlap away once.`, answer: [pq], explanation: `${pl(cm, 'number is a multiple', 'numbers are multiples')} of ${n(a)}, ${n(cg)} ${cg === 1 ? 'is' : 'are'} greater than ${n(v)}, and ${n(cb)} ${cb === 1 ? 'is' : 'are'} both. So ${n(cm)} + ${n(cg)} − ${n(cb)} = ${pl(pq, 'number makes', 'numbers make')} p ∨ q true.` },
   { prompt: `Of those numbers, how many are also less than ${n(w)}?`, answer: [fin], explanation: `Of the ${n(pq)}, ${n(pq - fin)} ${pq - fin === 1 ? 'is' : 'are'} ${n(w)} or more, so r is false for ${pq - fin === 1 ? 'it' : 'them'}. That leaves ${n(pq)} − ${n(pq - fin)} = ${pl(fin, 'number')} that make (p ∨ q) ∧ r true.` }
  ] }; }
});

/* ---- q05 If … then (→): hypothesis and conclusion [CM 2.2, 2.4] ---- */

/* Rule "if n is a multiple of a then n is less than v" on lockers 1..N. Asked: rule at locker x, lockers with a false hypothesis, lockers breaking the rule. */
mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'The storage locker rule',
 brief: 'The stores office has posted an if-then rule about locker numbers, and the inspector will check every locker against it.',
 labels: ['rule for the locker (1 or 0)', 'lockers with a false hypothesis', 'lockers that break the rule'], tolerance: 0.01,
 gl: [['hypothesis (1 or 0)', 'conclusion (1 or 0)'], ['lockers with a false hypothesis'], ['lockers that break the rule']]
}, {
 canonical: { a: 5, v: 30, N: 50, x: 40 },
 draw: R => { let o; do { const a = R.int(3, 8), v = R.int(20, 40), N = R.int(45, 70), br = list(N, y => y % a === 0 && y >= v); if (br.length < 2) continue;
   o = { a, v, N, x: R.bool() ? R.pick(br) : R.int(1, N) }; return o; } while (true); },
 build: ({ a, v, N, x }) => { const hy = y => y % a === 0, cn = y => y < v, br = list(N, y => hy(y) && !cn(y)), fh = N - Math.floor(N / a), val = !hy(x) || cn(x); return {
  prompt: `A storage rule says: “If a locker number is a multiple of ${n(a)}, then the number is less than ${n(v)}.” Take the lockers numbered 1 to ${n(N)}. Enter the truth value of the rule for locker ${n(x)} (1 for true, 0 for false). Then enter how many lockers have a false hypothesis, and how many lockers break the rule.`,
  answer: [TV(val), fh, br.length],
  hints: ['The hypothesis is “the number is a multiple of the first number”. The conclusion is “the number is less than the second”.', 'A locker whose hypothesis is false cannot break the rule. Only a true hypothesis with a false conclusion breaks it.'],
  solution: `Locker ${n(x)}: the hypothesis is ${word(hy(x))} and the conclusion is ${word(cn(x))}, so the rule is ${word(val)}: ${n(TV(val))}. Multiples of ${n(a)} from 1 to ${n(N)}: ${n(Math.floor(N / a))} of them, so ${n(N)} − ${n(Math.floor(N / a))} = ${n(fh)} lockers have a false hypothesis. The rule is broken by a multiple of ${n(a)} that is not less than ${n(v)}: ${and(br.map(n))}. That is ${n(br.length)} lockers.`,
  guidance: [
   { prompt: `For locker ${n(x)}, is the hypothesis “a multiple of ${n(a)}” true (1) or false (0)? Is the conclusion “less than ${n(v)}”?`, answer: [TV(hy(x)), TV(cn(x))], explanation: `The hypothesis is ${word(hy(x))} and the conclusion is ${word(cn(x))}, so the rule is ${word(val)} for this locker.` },
   { prompt: `How many of the lockers 1 to ${n(N)} are not multiples of ${n(a)}? Their hypothesis is false.`, answer: [fh], explanation: `${n(Math.floor(N / a))} lockers are multiples of ${n(a)}, so ${n(N)} − ${n(Math.floor(N / a))} = ${n(fh)} are not.` },
   { prompt: `How many multiples of ${n(a)} from 1 to ${n(N)} are not less than ${n(v)}? These have a true hypothesis and a false conclusion.`, answer: [br.length], explanation: `The lockers ${and(br.map(n))} break the rule: ${n(br.length)} lockers.` }
  ] }; }
});

/* Rule "if cycle n is a multiple of a then the filter is changed", filter changed on multiples of b. Asked: true hypotheses, true hypotheses with true conclusion, breaking cycles. */
const PAIRS5 = [[4, 6], [6, 4], [6, 9], [9, 6], [4, 10], [10, 4], [6, 8], [8, 6], [10, 15], [8, 12], [12, 8]];
mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'The filter schedule promise',
 brief: 'The life-support team promise a filter change on certain cycles, and the safety officer wants to know how often the promise is broken.',
 labels: ['cycles with a true hypothesis', 'cycles with hypothesis and conclusion true', 'cycles that break the rule'], tolerance: 0.01,
 gl: [['cycles with a true hypothesis'], ['cycles with both true'], ['cycles that break the rule']]
}, {
 canonical: { a: 4, b: 6, N: 50 },
 draw: R => { const [a, b] = R.pick(PAIRS5); return { a, b, N: R.int(40, 70) }; },
 build: ({ a, b, N }) => { const L = lcm(a, b), hc = Math.floor(N / a), bc = Math.floor(N / L), br = hc - bc; return {
  prompt: `The air filter is changed only in the cycles whose number is a multiple of ${n(b)}, and in every one of those cycles. The safety rule says: “If cycle n is a multiple of ${n(a)}, then the filter is changed in cycle n.” Look at the cycles 1 to ${n(N)}. Enter how many cycles have a true hypothesis, then how many of those also have a true conclusion. Then enter how many cycles break the rule.`,
  answer: [hc, bc, br],
  hints: ['The hypothesis is true in the multiples of the first number. The conclusion is true in the multiples of the second.', 'Cycles where both are true are multiples of both numbers. Find the smallest such number, then count its multiples. A cycle breaks the rule when the hypothesis is true and the conclusion is false.'],
  solution: `The hypothesis is true in the multiples of ${n(a)}: ${n(a)} × ${n(hc)} = ${n(a * hc)} is the last one up to ${n(N)}, so ${n(hc)} cycles. Of those, the conclusion is true only when the cycle is also a multiple of ${n(b)}. The smallest number that is a multiple of both is ${n(L)}, and ${n(L)} × ${n(bc)} = ${n(L * bc)} is the last multiple of ${n(L)} up to ${n(N)}, so ${pl(bc, 'cycle has', 'cycles have')} a true hypothesis and a true conclusion. The other ${n(hc)} − ${n(bc)} = ${n(br)} cycles have a true hypothesis and a false conclusion, and they break the rule.`,
  guidance: [
   { prompt: `How many cycles from 1 to ${n(N)} are multiples of ${n(a)}? These have a true hypothesis.`, answer: [hc], explanation: `${n(a)} × ${n(hc)} = ${n(a * hc)} is the last multiple of ${n(a)} up to ${n(N)}, so ${n(hc)} cycles.` },
   { prompt: `The smallest number that is a multiple of both ${n(a)} and ${n(b)} is ${n(L)}. How many cycles from 1 to ${n(N)} are multiples of ${n(L)}? These have the hypothesis and the conclusion both true.`, answer: [bc], explanation: `${n(L)} × ${n(bc)} = ${n(L * bc)} is the last multiple of ${n(L)} up to ${n(N)}, so ${pl(bc, 'cycle')}.` },
   { prompt: 'How many cycles have a true hypothesis and a false conclusion?', answer: [br], explanation: `${n(hc)} − ${n(bc)} = ${n(br)} cycles break the rule.` }
  ] }; }
});

/* Rule "if n is a multiple of a or n is greater than v, then n is less than w". Asked: rule at x, hypotheses true, breakers. */
mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'The council’s compound rule',
 brief: 'The council has voted in a rule whose hypothesis has an “or” inside it, and the clerk must count the pass numbers that break it.',
 labels: ['rule for the number (1 or 0)', 'numbers with a true hypothesis', 'numbers that break the rule'], tolerance: 0.01,
 gl: [['hypothesis (1 or 0)', 'conclusion (1 or 0)'], ['numbers with a true hypothesis'], ['numbers that break the rule']]
}, {
 canonical: { a: 7, v: 45, w: 30, N: 55, x: 42 },
 draw: R => { let o; do { const a = R.int(4, 9), N = R.int(50, 80), v = R.int(30, 55), w = R.int(20, 45), x = R.int(5, N); o = { a, v, w, N, x };
   const br = list(N, y => (y % a === 0 || y > v) && y >= w).length; if (br >= 3) return o; } while (true); },
 build: ({ a, v, w, N, x }) => { const hy = y => y % a === 0 || y > v, cn = y => y < w, hc = list(N, hy).length, br = list(N, y => hy(y) && !cn(y)).length, val = !hy(x) || cn(x),
  cm = list(N, y => y % a === 0).length, cg = list(N, y => y > v).length, cb = list(N, y => y % a === 0 && y > v).length, ok = hc - br; return {
  prompt: `A council rule says: “If n is a multiple of ${n(a)} or n is greater than ${n(v)}, then n is less than ${n(w)}.” Here “or” is inclusive. Take the whole numbers from 1 to ${n(N)}. Enter the truth value of the rule for n = ${n(x)} (1 for true, 0 for false). Then enter how many of the numbers have a true hypothesis, and how many break the rule.`,
  answer: [TV(val), hc, br],
  hints: ['The hypothesis is the whole “or” statement in front of “then”. It is true when either part is true.', 'The rule is broken only by a number whose hypothesis is true and whose conclusion is false. Take the numbers with a true hypothesis and drop those that are less than the limit.'],
  solution: `For ${n(x)}: the hypothesis is ${word(hy(x))} and the conclusion is ${word(cn(x))}, so the rule is ${word(val)}: ${n(TV(val))}. The hypothesis is true for ${n(hc)} numbers from 1 to ${n(N)} (multiples of ${n(a)}, or numbers greater than ${n(v)}, the overlap counted once). Of them, ${n(br)} are not less than ${n(w)}: the conclusion is false for them, so they break the rule.`,
  guidance: [
   { prompt: `For n = ${n(x)}, is the hypothesis true (1) or false (0)? Is the conclusion “n is less than ${n(w)}”?`, answer: [TV(hy(x)), TV(cn(x))], explanation: `The hypothesis is ${word(hy(x))} and the conclusion is ${word(cn(x))}, so the rule is ${word(val)} for ${n(x)}.` },
   { prompt: `How many whole numbers from 1 to ${n(N)} make the hypothesis true? Count the multiples of ${n(a)}, count those greater than ${n(v)}, and take the overlap away once.`, answer: [hc], explanation: `${pl(cm, 'number is a multiple', 'numbers are multiples')} of ${n(a)}, ${n(cg)} ${cg === 1 ? 'is' : 'are'} greater than ${n(v)}, and ${n(cb)} ${cb === 1 ? 'is' : 'are'} both. So ${n(cm)} + ${n(cg)} − ${n(cb)} = ${pl(hc, 'number has', 'numbers have')} a true hypothesis.` },
   { prompt: `Of those ${n(hc)} numbers, how many are not less than ${n(w)}?`, answer: [br], explanation: `Of the ${n(hc)}, ${n(ok)} ${ok === 1 ? 'is' : 'are'} less than ${n(w)}, so ${n(hc)} − ${n(ok)} = ${pl(br, 'number has', 'numbers have')} a false conclusion, and these break the rule.` }
  ] }; }
});

})();
