/* Logic and proof practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p2.js. */
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
/* Truth values: 1 for true, 0 for false; words for the solutions. */
const TV = b => b ? 1 : 0;
const word = b => b ? 'true' : 'false';
const TF = b => b ? 'T' : 'F';
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const upTo = N => Array.from({ length: N }, (_, i) => i + 1);
const countIf = (N, f) => upTo(N).filter(f).length;
const shuffle = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* Compound statements as trees: a letter 'p', ['not', A], or [op, A, B] with op 'and', 'or', 'imp', 'iff'. */
const SYM = { and: '∧', or: '∨', imp: '→', iff: '↔' };
const show = (f, top = true) => typeof f === 'string' ? f : f[0] === 'not' ? '¬' + show(f[1], false)
 : (top ? '' : '(') + show(f[1], false) + ' ' + SYM[f[0]] + ' ' + show(f[2], false) + (top ? '' : ')');
const ev = (f, v) => typeof f === 'string' ? v[f] : f[0] === 'not' ? !ev(f[1], v) : f[0] === 'and' ? ev(f[1], v) && ev(f[2], v)
 : f[0] === 'or' ? ev(f[1], v) || ev(f[2], v) : f[0] === 'imp' ? !ev(f[1], v) || ev(f[2], v) : ev(f[1], v) === ev(f[2], v);
const lettersOf = (...fs) => { const s = new Set(); const walk = f => { if (typeof f === 'string') s.add(f); else f.slice(1).forEach(walk); }; fs.forEach(walk); return ['p', 'q', 'r', 's', 't', 'u', 'v'].filter(x => s.has(x)); };
/* The rows of a truth table in the standard order: the first letter is T on the top half, the last letter alternates. */
const rowsOf = letters => Array.from({ length: 2 ** letters.length }, (_, i) => { const v = {}; letters.forEach((x, j) => { v[x] = ((i >> (letters.length - 1 - j)) & 1) === 0; }); return v; });
const caseText = (letters, v) => letters.map(x => TF(v[x])).join('');
const sub = (f, m) => typeof f === 'string' ? m[f] : [f[0], ...f.slice(1).map(g => sub(g, m))];
const NOT = x => ['not', x], AND = (x, y) => ['and', x, y], OR = (x, y) => ['or', x, y], IMP = (x, y) => ['imp', x, y], IFF = (x, y) => ['iff', x, y];
const OPS = ['and', 'or', 'imp', 'iff'];
const lit = (R, x) => R.next() < 0.3 ? NOT(x) : x;
const column = (f, L) => rowsOf(L).map(v => ev(f, v));
const tcount = (f, L) => column(f, L).filter(x => x).length;
const perm3 = R => shuffle(R, ['p', 'q', 'r']);
const randomTree3 = R => { const [x, y, z] = perm3(R), inner = [R.pick(OPS), lit(R, x), lit(R, y)], part = R.next() < 0.2 ? NOT(inner) : inner, op = R.pick(OPS);
 return R.bool() ? [op, part, lit(R, z)] : [op, lit(R, z), part]; };
/* Conditions on a whole number n: { t: 'gt' | 'lt' | 'mul', v }. */
const cond = c => c.t === 'gt' ? `n is greater than ${n(c.v)}` : c.t === 'lt' ? `n is less than ${n(c.v)}` : `n is a multiple of ${n(c.v)}`;
const holds = (c, x) => c.t === 'gt' ? x > c.v : c.t === 'lt' ? x < c.v : x % c.v === 0;
const names = L => L.length === 2 ? 'p and q' : L.slice(0, -1).join(', ') + ' and ' + L[L.length - 1];
const pairList = list => list.map(([a, b]) => `(${n(a)}, ${n(b)})`).join(', ');

/* ---- q06 If and only if (↔) [CM 2.4] ---- */

mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The greenhouse vent log',
 brief: 'The greenhouse vent is meant to open exactly when the humidity is high, and Mira wants the last shift’s log checked against that rule.',
 labels: ['hours the rule was true', 'hours with p true and q false'], tolerance: 0.01,
 gl: [['p ↔ q in hour 1 (1 or 0)'], ['hours with both 1', 'hours with both 0'], ['hours with p 1 and q 0']]
}, {
 canonical: { log: [[1, 1], [1, 0], [0, 0], [0, 1], [1, 0], [1, 1], [0, 0], [0, 0]] },
 draw: R => { let log, m, c, d; do { log = Array.from({ length: 8 }, () => [TV(R.bool()), TV(R.bool())]);
   m = log.filter(([a, b]) => a === b).length; c = log.filter(([a, b]) => a && !b).length; d = log.filter(([a, b]) => !a && b).length;
  } while (m < 3 || m > 6 || c < 1 || d < 1 || (m === 5 && c === 2 && log[0][0] === 1 && log[0][1] === 1 && log[1][1] === 0)); return { log }; },
 build: ({ log }) => { const b1 = log.filter(([a, b]) => a && b).length, b0 = log.filter(([a, b]) => !a && !b).length, m = b1 + b0, c = log.filter(([a, b]) => a && !b).length, [a1, q1] = log[0]; return {
  prompt: `The greenhouse vent controller follows the rule p ↔ q, where p is “the humidity sensor reads high” and q is “the vent is open”. Over 8 hours the log records each hour as a pair (p, q), with 1 for true and 0 for false: ${pairList(log)}. Enter how many hours the rule p ↔ q was true. Then enter how many hours had p true and q false.`,
  answer: [m, c],
  hints: ['p ↔ q is true in an hour when the two values match: (1, 1) or (0, 0).', 'A pair that does not match is (1, 0) or (0, 1). The second answer counts only the first kind.'],
  solution: `Both values are 1 in ${pl(b1, 'hour')} and both are 0 in ${pl(b0, 'hour')}, so p ↔ q is true in ${n(b1)} + ${n(b0)} = ${pl(m, 'hour')}. The pair (1, 0) means p true and q false, and it appears in ${pl(c, 'hour')}.`,
  guidance: [
   { prompt: `Look at hour 1, (p, q) = (${n(a1)}, ${n(q1)}). Is p ↔ q true (1) or false (0)?`, answer: [TV(a1 === q1)], explanation: `${a1 === q1 ? 'The two values match' : 'The two values differ'}, so p ↔ q is ${word(a1 === q1)} in hour 1.` },
   { prompt: 'How many hours have both values 1? How many have both values 0?', answer: [b1, b0], explanation: `${pl(b1, 'hour has', 'hours have')} (1, 1) and ${pl(b0, 'hour has', 'hours have')} (0, 0). Adding them gives ${n(m)} hours with a match.` },
   { prompt: 'How many hours have p = 1 and q = 0?', answer: [c], explanation: `The pair (1, 0) appears in ${pl(c, 'hour')}.` }
  ] }; }
});

mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'Boiler alarm, two rules',
 brief: 'The boiler alarm rule is under review, and the crew wants to know how much looser a one-way rule would be on the same readings.',
 labels: ['readings with p ↔ q true', 'readings with p → q true'], tolerance: 0.01,
 gl: [['p (1 or 0)', 'q (1 or 0)'], ['readings where p and q match'], ['readings with p → q true']]
}, {
 canonical: { A: 40, B: 70, rd: [[47, 76], [35, 81], [52, 63], [33, 58], [44, 66], [38, 74]] },
 draw: R => { let o, a, b, iff, imp, ft, tf; do { a = R.int(20, 60); b = R.int(40, 90);
   const rd = Array.from({ length: 6 }, () => [a + R.nz(-14, 14), b + R.nz(-14, 14)]); o = { A: a, B: b, rd };
   iff = rd.filter(([x, y]) => (x > a) === (y > b)).length; ft = rd.filter(([x, y]) => x <= a && y > b).length; tf = rd.filter(([x, y]) => x > a && y <= b).length;
  } while (iff < 2 || iff > 5 || ft < 1 || tf < 1 || (o.A === 40 && o.B === 70)); return o; },
 build: ({ A, B, rd }) => { const P = ([x]) => x > A, Q = ([, y]) => y > B, iff = rd.filter(r => P(r) === Q(r)).length, imp = rd.filter(r => !P(r) || Q(r)).length, r1 = rd[0]; return {
  prompt: `The boiler alarm rule is p ↔ q, where p is “the pressure is above ${n(A)} bar” and q is “the temperature is above ${n(B)} degrees”. Six readings (pressure, temperature) are logged: ${pairList(rd)}. Enter on how many readings p ↔ q is true. Then enter on how many readings the weaker one-way rule p → q would be true.`,
  answer: [iff, imp],
  hints: ['For each reading decide p and q separately, then compare them: ↔ needs the two to match.', 'p → q is false only when p is true and q is false. Every other pair makes it true.'],
  solution: `Decide p and q for each reading: ${rd.map(r => `(${n(r[0])}, ${n(r[1])}): p ${word(P(r))}, q ${word(Q(r))}`).join('; ')}. The two match on ${pl(iff, 'reading')}, so p ↔ q is true ${iff === 1 ? 'once' : n(iff) + ' times'}. p → q fails only when p is true and q false, which happens on ${pl(6 - imp, 'reading')}, so it is true on ${pl(imp, 'reading')}.`,
  guidance: [
   { prompt: `Take the first reading, (${n(r1[0])}, ${n(r1[1])}). Is p true (1) or false (0)? Is q?`, answer: [TV(P(r1)), TV(Q(r1))], explanation: `${n(r1[0])} is ${P(r1) ? 'above' : 'not above'} ${n(A)}, so p is ${word(P(r1))}. ${n(r1[1])} is ${Q(r1) ? 'above' : 'not above'} ${n(B)}, so q is ${word(Q(r1))}.` },
   { prompt: 'Do the same for all six readings. On how many do p and q match?', answer: [iff], explanation: `p and q match on ${pl(iff, 'reading')}, and that is how often p ↔ q is true.` },
   { prompt: 'p → q is false only when p is true and q is false. On how many of the six readings is p → q true?', answer: [imp], explanation: `p is true with q false on ${pl(6 - imp, 'reading')}, so p → q is true on 6 − ${n(6 - imp)} = ${n(imp)}.` }
  ] }; }
});

mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q03', title: 'The vault door’s matching rule',
 brief: 'The vault door opens by a rule that joins two code conditions and matches them against a third, and Mira wants the whole dial mapped.',
 labels: ['rule for the code (1 or 0)', 'numbers with the rule true'], tolerance: 0.01,
 gl: [['p ∧ q (1 or 0)', 'r (1 or 0)'], ['numbers with both true'], ['numbers with both false']]
}, {
 canonical: { a: 7, b: 22, m: 4, N: 36, x: 9 },
 draw: R => { let o; do { const N = R.int(30, 45), a = R.int(3, 10), b = a + R.int(10, 20), m = R.int(3, 6), x = R.int(1, N);
   o = { a, b, m, N, x }; const pq = k => k > a && k < b, r = k => k % m === 0;
  } while (countIf(o.N, k => k > o.a && k < o.b && k % o.m === 0) < 1 || countIf(o.N, k => !(k > o.a && k < o.b) && k % o.m !== 0) < 1 || (o.a === 7 && o.b === 22 && o.m === 4)); return o; },
 build: ({ a, b, m, N, x }) => { const pq = k => k > a && k < b, r = k => k % m === 0, ok = k => pq(k) === r(k),
  c1 = countIf(N, k => pq(k) && r(k)), c0 = countIf(N, k => !pq(k) && !r(k)), cf = countIf(N, k => !pq(k)), l1 = upTo(N).filter(k => pq(k) && r(k)); return {
  prompt: `The vault door obeys the rule (p ∧ q) ↔ r, where p is “n is greater than ${n(a)}”, q is “n is less than ${n(b)}” and r is “n is a multiple of ${n(m)}”. Enter the truth value of (p ∧ q) ↔ r for n = ${n(x)} (1 for true, 0 for false). Then enter how many whole numbers from 1 to ${n(N)} make it true.`,
  answer: [TV(ok(x)), c1 + c0],
  hints: ['Work out p ∧ q first: it needs both parts true. Then compare it with r: ↔ needs the two to match.', 'Count the numbers where p ∧ q and r are both true, then the numbers where both are false, and add.'],
  solution: `For n = ${n(x)}, p ∧ q is ${word(pq(x))} and r is ${word(r(x))}, so (p ∧ q) ↔ r is ${word(ok(x))}: ${TV(ok(x))}. From 1 to ${n(N)}, ${pl(c1, 'number makes', 'numbers make')} p ∧ q and r both true and ${pl(c0, 'number makes', 'numbers make')} both false, so the rule is true for ${n(c1)} + ${n(c0)} = ${pl(c1 + c0, 'number')}.`,
  guidance: [
   { prompt: `For n = ${n(x)}, is p ∧ q true (1) or false (0)? Is r?`, answer: [TV(pq(x)), TV(r(x))], explanation: `${n(x)} is ${x > a ? '' : 'not '}greater than ${n(a)} and ${x < b ? '' : 'not '}less than ${n(b)}, so p ∧ q is ${word(pq(x))}. r is ${word(r(x))}, so the two ${pq(x) === r(x) ? 'match' : 'differ'}.` },
   { prompt: `From 1 to ${n(N)}, how many numbers make p ∧ q and r both true?`, answer: [c1], explanation: `${pl(c1, 'number is', 'numbers are')} greater than ${n(a)}, less than ${n(b)} and a multiple of ${n(m)}: ${and(l1.map(n))}.` },
   { prompt: 'How many make p ∧ q and r both false?', answer: [c0], explanation: `p ∧ q is false for the ${n(cf)} numbers that are ${n(a)} or less or ${n(b)} or more. Of those, ${pl(c0, 'is not a multiple', 'are not multiples')} of ${n(m)}, so ${n(c0)} make both false. Adding the two counts gives ${n(c1 + c0)}.` }
  ] }; }
});

/* ---- q07 Truth tables: one row per case, doubling with each letter [CM 2.3] ---- */

mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'Council votes, row by row',
 brief: 'The council chamber logs every possible pattern of votes on a motion, and Mira needs to read a pattern straight off its row number.',
 labels: ['rows in the table', 'first member votes yes on the row (1 or 0)', 'last member votes yes on the row (1 or 0)'], tolerance: 0.01,
 gl: [['rows'], ['first member votes yes (1 or 0)'], ['last member votes yes (1 or 0)']]
}, {
 canonical: { k: 4, row: 11 },
 draw: R => { let o; do { const k = R.int(3, 5); o = { k, row: R.int(2, 2 ** k - 1) }; } while (o.k === 4 && o.row === 11); return o; },
 build: ({ k, row }) => { const L = ['p', 'q', 'r', 's', 't'].slice(0, k), rows = 2 ** k, half = rows / 2, first = row <= half, last = row % 2 === 1; return {
  prompt: `The council has ${n(k)} members, ${names(L)}. Each votes yes (true) or no (false) on a motion, and a truth table lists every pattern of votes in the standard order: the first letter is true on the top half of the rows, each next letter switches twice as often, and the last letter switches on every row. Enter how many rows the table has. Then look at row ${n(row)} and enter 1 if member ${L[0]} votes yes on it, 0 if no. Then do the same for member ${L[k - 1]}.`,
  answer: [rows, TV(first), TV(last)],
  hints: ['One member alone needs 2 rows, and each further member doubles the number of rows.', 'The first letter is true on the top half of the rows. The last letter goes T, F, T, F down the table, starting with T on row 1.'],
  solution: `With ${n(k)} letters the table has ${Array(k).fill('2').join(' × ')} = ${n(rows)} rows. The top half is rows 1 to ${n(half)}, so on row ${n(row)} ${L[0]} is ${word(first)}: ${TV(first)}. The last letter is true on odd rows and false on even rows, and ${n(row)} is ${last ? 'odd' : 'even'}, so ${L[k - 1]} is ${word(last)}: ${TV(last)}.`,
  guidance: [
   { prompt: `How many rows does a truth table for ${n(k)} letters have?`, answer: [rows], explanation: `Each letter doubles the count: ${Array(k).fill('2').join(' × ')} = ${n(rows)}.` },
   { prompt: `The first letter, ${L[0]}, is true on rows 1 to ${n(half)}. Is row ${n(row)} among them? Enter 1 if ${L[0]} is true on row ${n(row)}, 0 if not.`, answer: [TV(first)], explanation: `Row ${n(row)} is ${first ? 'in' : 'below'} the top half, so ${L[0]} is ${word(first)} there.` },
   { prompt: `The last letter, ${L[k - 1]}, is true on row 1, false on row 2, true on row 3, and so on. Enter 1 if it is true on row ${n(row)}, 0 if not.`, answer: [TV(last)], explanation: `Row ${n(row)} is ${last ? 'odd' : 'even'}, so ${L[k - 1]} is ${word(last)}.` }
  ] }; }
});

mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'Every setting, tested by hand',
 brief: 'The crew will add switches to the panel, and the test team wants to know how long trying every setting will take.',
 labels: ['rows now', 'rows after the new switches', 'minutes to test the new table'], tolerance: 0.01,
 gl: [['rows now'], ['rows after'], ['minutes']]
}, {
 canonical: { a: 3, b: 2, t: 4 },
 draw: R => { let o; do { const a = R.int(2, 5), b = R.int(1, 3); o = { a, b, t: R.int(2, 6) }; } while (o.a + o.b > 7 || (o.a === 3 && o.b === 2 && o.t === 4)); return o; },
 build: ({ a, b, t }) => { const r0 = 2 ** a, r1 = 2 ** (a + b), tot = r1 * t; return {
  prompt: `The control panel has ${n(a)} switches, and a truth table lists every setting of them, one setting per row. Mira adds ${n(b)} more ${b === 1 ? 'switch' : 'switches'}, and the test crew must then try every row of the new table, taking ${n(t)} minutes per row. Enter the number of rows before the new ${b === 1 ? 'switch is' : 'switches are'} added, the number of rows after, and the total minutes needed to try every row of the new table.`,
  answer: [r0, r1, tot],
  hints: ['Each switch doubles the number of rows, so each extra switch doubles the table again.', 'The total time is the number of rows times the minutes each row takes.'],
  solution: `With ${n(a)} switches the table has ${Array(a).fill('2').join(' × ')} = ${n(r0)} rows. With ${n(a + b)} switches it has ${Array(a + b).fill('2').join(' × ')} = ${n(r1)} rows. At ${n(t)} minutes a row the test takes ${n(r1)} × ${n(t)} = ${n(tot)} minutes.`,
  guidance: [
   { prompt: `How many rows does a table for ${n(a)} switches have?`, answer: [r0], explanation: `Each switch doubles the count: ${Array(a).fill('2').join(' × ')} = ${n(r0)}.` },
   { prompt: `How many rows does the table have with ${n(a + b)} switches?`, answer: [r1], explanation: `${n(b)} more ${b === 1 ? 'switch doubles' : 'switches double'} the table ${b === 1 ? 'once' : b === 2 ? 'twice' : 'three times'}: ${n(r0)} × ${n(2 ** b)} = ${n(r1)}.` },
   { prompt: `Each row takes ${n(t)} minutes. How many minutes for every row of the new table?`, answer: [tot], explanation: `${n(r1)} rows × ${n(t)} minutes = ${n(tot)} minutes.` }
  ] }; }
});

mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', title: 'One case in a giant table',
 brief: 'A reactor has far more alarm lines than the panel, and Mira wants one dangerous case found in its table without writing the table out.',
 labels: ['rows in the table', 'row number of the case', 'rows below that row'], tolerance: 0.01,
 gl: [['rows'], ['rows above the case’s row'], ['row number of the case', 'rows below it']]
}, {
 canonical: { k: 6, c: [1, 0, 1, 1, 0, 1] },
 draw: R => { let o; do { const k = R.int(6, 7); o = { k, c: Array.from({ length: k }, () => TV(R.bool())) };
  } while (o.c.every(x => x === 1) || o.c.every(x => x === 0) || (o.k === 6 && o.c.join('') === '101101')); return o; },
 build: ({ k, c }) => { const L = ['p', 'q', 'r', 's', 't', 'u', 'v'].slice(0, k), rows = 2 ** k, worth = L.map((_, j) => 2 ** (k - 1 - j)),
  fw = worth.filter((_, j) => !c[j]), falseL = L.filter((_, j) => !c[j]), skip = fw.reduce((s, x) => s + x, 0), row = skip + 1, below = rows - row,
  caseW = L.map((x, j) => `${x} ${c[j] ? 'true' : 'false'}`).join(', '); return {
  prompt: `A reactor has ${n(k)} alarm lines, ${names(L)}, each true when it is firing. Its truth table uses the standard order: the first letter is true on the top half of the rows, each next letter switches twice as often, and the last letter switches on every row. Enter how many rows the table has. Then enter the row number of the case ${caseW}. Then enter how many rows come below that row, down to the end of the table.`,
  answer: [rows, row, below],
  hints: ['Each letter doubles the rows. Row 1 has every letter true, and the blocks of rows get half as long with each letter.', 'Add the block lengths of the letters that are false in the case, then add 1. The rows below are all the rows after that one.'],
  solution: `${n(k)} letters give ${Array(k).fill('2').join(' × ')} = ${n(rows)} rows. The blocks are ${worth.map((w, j) => `${n(w)} for ${L[j]}`).join(', ')}. ${falseL.length === 1 ? `The only false letter is ${falseL[0]}` : `The false letters are ${and(falseL)}`}, so the case sits ${fw.length === 1 ? pl(skip, 'row') : `${fw.map(n).join(' + ')} = ${n(skip)} rows`} below row 1, which is row ${n(row)}. The table ends at row ${n(rows)}, so ${n(rows)} − ${n(row)} = ${pl(below, 'row comes', 'rows come')} below it.`,
  guidance: [
   { prompt: `How many rows does a truth table for ${n(k)} letters have?`, answer: [rows], explanation: `${Array(k).fill('2').join(' × ')} = ${n(rows)}.` },
   { prompt: `${falseL.length === 1 ? `The only letter that is false in the case is ${falseL[0]}` : `The letters that are false in the case are ${and(falseL)}`}. The block lengths are ${worth.map((w, j) => `${n(w)} for ${L[j]}`).join(', ')}. Add the block lengths of the false letters.`, answer: [skip], explanation: `${fw.length === 1 ? `Only the block of ${falseL[0]} counts: ${n(skip)}` : `${fw.map(n).join(' + ')} = ${n(skip)}`}, so the case is ${pl(skip, 'row')} below row 1.` },
   { prompt: `Add 1 to get the row number. Then work out how many rows come below that row, down to row ${n(rows)}.`, answer: [row, below], explanation: `${n(skip)} + 1 = ${n(row)}, and ${n(rows)} − ${n(row)} = ${pl(below, 'row')} below it.` }
  ] }; }
});

/* ---- q08 Building a truth table [CM 2.3] ---- */

mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The hatch interlock',
 brief: 'The refuelling hatch interlock reads two inputs through a bracketed rule, and Mira wants its table before the hatch is ever opened.',
 labels: ['rows with the bracketed part true', 'rows with the whole statement true'], tolerance: 0.01,
 gl: [['rows'], ['rows with the bracketed part true'], ['rows with the whole statement true']]
}, {
 canonical: { f: AND('q', IMP('p', NOT('q'))) },
 draw: R => { let f, a, b; do { const x = R.pick(['p', 'q']), [y, z] = R.bool() ? ['p', 'q'] : ['q', 'p'];
   f = [R.pick(OPS), lit(R, x), [R.pick(OPS), lit(R, y), lit(R, z)]]; a = tcount(f[2], ['p', 'q']); b = tcount(f, ['p', 'q']);
  } while (a < 1 || a > 3 || b < 1 || b > 3 || show(f) === 'q ∧ (p → ¬q)'); return { f }; },
 build: ({ f }) => { const L = ['p', 'q'], rows = rowsOf(L), inner = f[2], vi = rows.map(v => ev(inner, v)), vf = rows.map(v => ev(f, v)), ki = vi.filter(x => x).length, kf = vf.filter(x => x).length, SI = show(inner), S = show(f); return {
  prompt: `The refuelling hatch interlock reads two inputs, p and q, and releases the hatch when the statement ${S} is true. Build its truth table in the standard order, with a column for the bracketed part ${SI} and a column for the whole statement. Enter how many rows make ${SI} true. Then enter how many rows make the whole statement true.`,
  answer: [ki, kf],
  hints: ['Two letters need 4 rows. Fill in the column for the bracketed part first, row by row.', `The last column joins ${show(f[1], false)} to that column with ${SYM[f[0]]}. Use the rule for ${SYM[f[0]]} on each row.`],
  solution: `Row by row (p, q: ${SI}, whole statement): ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vi[i])}, ${TF(vf[i])}`).join('; ')}. The bracketed part is true on ${pl(ki, 'row')} and the whole statement on ${pl(kf, 'row')}.`,
  guidance: [
   { prompt: 'How many rows does the table for p and q need?', answer: [4], explanation: 'Two letters: 2 × 2 = 4 rows.' },
   { prompt: `On how many of the 4 rows is ${SI} true?`, answer: [ki], explanation: `Down the rows ${SI} reads ${vi.map(TF).join('')}: ${pl(ki, 'row')} with T.` },
   { prompt: `Join ${show(f[1], false)} to that column with ${SYM[f[0]]}. On how many rows is ${S} true?`, answer: [kf], explanation: `Down the rows the whole statement reads ${vf.map(TF).join('')}: ${pl(kf, 'row')} with T.` }
  ] }; }
});

mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Which logged cases broke the rule',
 brief: 'The monitor logged four switch settings during a shift, and Mira wants to know which broke the lab rule and how often the rule can hold at all.',
 labels: ['logged cases that make the rule false', 'rows of the table that make the rule true'], tolerance: 0.01,
 gl: [['rule for the first logged case (1 or 0)'], ['logged cases that make the rule false'], ['rows that make the rule true']]
}, {
 canonical: { f: IMP(AND('p', 'q'), 'r'), log: ['TTF', 'TFT', 'FFF', 'TTT'] },
 draw: R => { let f, log, k, br; do { f = randomTree3(R); const L = ['p', 'q', 'r'], rows = rowsOf(L), vals = rows.map(v => ev(f, v)); k = vals.filter(x => x).length;
   log = shuffle(R, rows.map((v, i) => i)).slice(0, 4); br = log.filter(i => !vals[i]).length; log = log.map(i => caseText(L, rows[i]));
  } while (k < 2 || k > 6 || br < 1 || br > 3 || show(f) === '(p ∧ q) → r' || show(f) === '(p ∧ ¬q) ∨ r'); return { f, log }; },
 build: ({ f, log }) => { const L = ['p', 'q', 'r'], rows = rowsOf(L), vals = rows.map(v => ev(f, v)), S = show(f), k = vals.filter(x => x).length,
  val = s => ev(f, { p: s[0] === 'T', q: s[1] === 'T', r: s[2] === 'T' }), br = log.filter(s => !val(s)).length, w = s => L.map((x, j) => `${x} ${s[j] === 'T' ? 'true' : 'false'}`).join(', '); return {
  prompt: `The lab rule is ${S}, with p, q and r three switches. During a shift the monitor logged 4 cases, written in the order p, q, r with T for true and F for false: ${log.join(', ')}. Enter how many of the logged cases make ${S} false, which means they broke the rule. Then build the whole truth table and enter how many of its 8 rows make ${S} true.`,
  answer: [br, k],
  hints: ['Each logged case is one row of the table: read its letters in the order p, q, r, and work out the statement for that case.', 'For the second answer build all 8 rows in the standard order, working out the parts in brackets first, and count the T entries.'],
  solution: `Logged cases: ${log.map(s => `${s}: ${TF(val(s))}`).join('; ')}. ${pl(br, 'logged case makes', 'logged cases make')} the statement false. The whole table (p, q, r: statement) reads ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i])}`).join('; ')}, which is ${pl(k, 'row')} with T.`,
  guidance: [
   { prompt: `Take the first logged case, ${w(log[0])}. Work out ${S} for it. Is it true (1) or false (0)?`, answer: [TV(val(log[0]))], explanation: `For ${log[0]} the statement is ${word(val(log[0]))}, so that case ${val(log[0]) ? 'keeps' : 'breaks'} the rule.` },
   { prompt: `Do the same for all four logged cases. How many make ${S} false?`, answer: [br], explanation: `The values are ${log.map(s => `${s}: ${TF(val(s))}`).join(', ')}, so ${pl(br, 'case breaks', 'cases break')} the rule.` },
   { prompt: `Now build the whole table of 8 rows. On how many rows is ${S} true?`, answer: [k], explanation: `Down the 8 rows it reads ${vals.map(TF).join('')}: ${pl(k, 'row')} with T.` }
  ] }; }
});

mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q06', title: 'The reactor trip circuit',
 brief: 'The reactor trip circuit compares two pairs of sensor lines, and Mira wants all sixteen cases counted before it goes live.',
 labels: ['rows with the left bracket true', 'rows with the right bracket true', 'rows with the whole statement true'], tolerance: 0.01,
 gl: [['rows'], ['rows with the left bracket true', 'rows with the right bracket true'], ['rows with the whole statement true']]
}, {
 canonical: { f: IFF(AND('p', 'q'), OR('r', 's')) },
 draw: R => { let f, k; do { const op = () => R.pick(['and', 'or', 'imp']);
   f = ['iff', [op(), lit(R, 'p'), lit(R, 'q')], [op(), lit(R, 'r'), lit(R, 's')]]; k = tcount(f, ['p', 'q', 'r', 's']);
  } while (k < 3 || k > 13 || show(f) === '(p ∧ q) ↔ (r ∨ s)'); return { f }; },
 build: ({ f }) => { const L = ['p', 'q', 'r', 's'], rows = rowsOf(L), [A, B] = [f[1], f[2]], vals = rows.map(v => [ev(A, v), ev(B, v), ev(f, v)]),
  cA = vals.filter(x => x[0]).length, cB = vals.filter(x => x[1]).length, cS = vals.filter(x => x[2]).length, S = show(f), SA = show(A), SB = show(B); return {
  prompt: `The reactor trip circuit reads four lines, p, q, r and s, and trips when the statement ${S} is true. Build its truth table in the standard order, with a column for ${SA}, a column for ${SB} and a column for the whole statement. Enter how many rows make ${SA} true, then how many make ${SB} true, then how many make the whole statement true.`,
  answer: [cA, cB, cS],
  hints: ['Four letters need 16 rows. Work out the column of each bracket on its own letters first.', 'The whole statement is a biconditional: it is true on the rows where the two bracket columns match, both T or both F.'],
  solution: `Four letters give 16 rows. ${SA} is true on ${pl(cA, 'row')} and ${SB} on ${pl(cB, 'row')}. Down the 16 rows the three columns read ${vals.map(x => TF(x[0])).join('')}, ${vals.map(x => TF(x[1])).join('')} and ${vals.map(x => TF(x[2])).join('')}. The whole statement is true where the first two match, which is ${pl(cS, 'row')}.`,
  guidance: [
   { prompt: 'How many rows does the table for p, q, r and s need?', answer: [16], explanation: 'Four letters: 2 × 2 × 2 × 2 = 16 rows.' },
   { prompt: `On how many rows is ${SA} true? On how many is ${SB} true?`, answer: [cA, cB], explanation: `${SA} is true on ${pl(cA, 'row')} and ${SB} on ${pl(cB, 'row')}.` },
   { prompt: `Join the two columns with ↔. On how many rows do they match, so that ${S} is true?`, answer: [cS], explanation: `The two columns match on ${pl(cS, 'row')}: ${n(vals.filter(x => x[0] && x[1]).length)} where both are true and ${n(vals.filter(x => !x[0] && !x[1]).length)} where both are false.` }
  ] }; }
});

/* ---- q09 Tautologies and contradictions [CM 2.3, Levin 3.1] ---- */

/* Shapes that are true on every row, false on every row, or neither, over the letters A and B. */
const TAUT2 = [OR('A', NOT('A')), IMP(AND('A', 'B'), 'A'), IMP('A', OR('A', 'B')), NOT(AND('A', NOT('A'))), OR(IMP('A', 'B'), IMP('B', 'A')),
 IMP(AND(IMP('A', 'B'), NOT('B')), NOT('A')), IFF(IMP('A', 'B'), OR(NOT('A'), 'B')), IMP(AND(OR('A', 'B'), NOT('A')), 'B')];
const CONTRA2 = [AND('A', NOT('A')), AND(AND('A', 'B'), NOT('B')), NOT(OR('A', NOT('A'))), AND(IFF('A', 'B'), IFF('A', NOT('B'))), AND(IMP('A', 'B'), AND('A', NOT('B'))), AND(OR('A', 'B'), NOT(OR('A', 'B')))];
const randomTree2 = R => { const x = R.pick(['p', 'q']), [y, z] = R.bool() ? ['p', 'q'] : ['q', 'p']; return [R.pick(OPS), lit(R, x), [R.pick(OPS), lit(R, y), lit(R, z)]]; };
const kindCode = (k, total) => k === total ? 1 : k === 0 ? 2 : 3;
const kindWord = code => code === 1 ? 'a tautology' : code === 2 ? 'a contradiction' : 'neither a tautology nor a contradiction';
const draw2 = (R, avoid) => { let f; do { const u = R.next(), m = R.bool() ? { A: 'p', B: 'q' } : { A: 'q', B: 'p' };
  if (u < 0.35) f = sub(R.pick(TAUT2), m); else if (u < 0.65) f = sub(R.pick(CONTRA2), m);
  else { do { f = randomTree2(R); } while (tcount(f, ['p', 'q']) === 0 || tcount(f, ['p', 'q']) === 4); }
 } while (lettersOf(f).length < 2 || avoid.includes(show(f))); return f; };

mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The council motion’s wording',
 brief: 'A motion before the council boils down to one compound statement, and Mira wants to know whether it can ever fail or ever hold.',
 labels: ['rows making it false', 'kind (1, 2 or 3)'], tolerance: 0.01,
 gl: [['rows'], ['rows making it false'], ['kind (1, 2 or 3)']]
}, {
 canonical: { f: AND(IMP('p', 'q'), AND('p', NOT('q'))) },
 draw: R => ({ f: draw2(R, ['((p → q) ∧ p) → q', '(p → q) ∧ (p ∧ ¬q)', '(p ∧ q) → p', '(q ∧ p) → q']) }),
 build: ({ f }) => { const L = ['p', 'q'], rows = rowsOf(L), vals = rows.map(v => ev(f, v)), kT = vals.filter(x => x).length, kF = 4 - kT, code = kindCode(kT, 4), S = show(f); return {
  prompt: `A motion before the council boils down to the statement ${S}. Build its truth table, with a row for each case of p and q. Enter how many rows make the statement false. Then enter a code for its kind: 1 if it is a tautology, 2 if it is a contradiction, 3 if it is neither.`,
  answer: [kF, code],
  hints: ['Two letters need 4 rows. Work out the statement on each row and mark it T or F.', 'A tautology has no false row, and a contradiction has no true row. Anything else is neither.'],
  solution: `The rows (p, q) give: ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i])}`).join('; ')}. The statement is false on ${pl(kF, 'row')} and true on ${pl(kT, 'row')}, so it is ${kindWord(code)}: enter ${n(kF)} and ${n(code)}.`,
  guidance: [
   { prompt: 'How many rows does the table for p and q have?', answer: [4], explanation: 'Two letters: 2 × 2 = 4 rows.' },
   { prompt: `Work out ${S} on each row. On how many rows is it false?`, answer: [kF], explanation: `Down the rows it reads ${vals.map(TF).join('')}: false on ${pl(kF, 'row')}.` },
   { prompt: 'Enter 1 if it is false on no row (a tautology), 2 if it is false on every row (a contradiction), 3 otherwise.', answer: [code], explanation: `It is false on ${n(kF)} of 4 rows, so it is ${kindWord(code)}: ${n(code)}.` }
  ] }; }
});

mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'A rule and its opposite',
 brief: 'Mira wants to see what happens when a panel rule is joined to its own opposite, before anyone wires such a thing in.',
 labels: ['rows with the rule true', 'rows with its negation true', 'rows with the joined statement true'], tolerance: 0.01,
 gl: [['rows with the rule true'], ['rows with its negation true'], ['rows with the joined statement true']]
}, {
 canonical: { f: IMP('p', 'q'), op: 'or' },
 draw: R => { let f; do { const x = lit(R, 'p'), y = lit(R, 'q'); f = R.bool() ? [R.pick(OPS), x, y] : [R.pick(OPS), y, x]; } while (tcount(f, ['p', 'q']) < 1 || tcount(f, ['p', 'q']) > 3 || (show(f) === 'p → q')); return { f, op: R.pick(['or', 'and']) }; },
 build: ({ f, op }) => { const L = ['p', 'q'], S = show(f), NS = '¬(' + S + ')', J = show([op, f, NOT(f)]), kf = tcount(f, L), kn = 4 - kf, kj = tcount([op, f, NOT(f)], L), kind = kj === 4 ? 'a tautology' : 'a contradiction'; return {
  prompt: `A panel rule reads ${S}. Its opposite is the same rule with a negation in front of the whole thing, written ${NS}. Mira joins the two into the single statement ${J}. Build one truth table for the 2 letters p and q. Enter how many of the 4 rows make ${S} true, then how many make ${NS} true, then how many make ${J} true.`,
  answer: [kf, kn, kj],
  hints: ['A negation flips every row of the column it is put in front of: T becomes F and F becomes T.', `${op === 'or' ? '∨' : '∧'} joins the rule’s column to its flipped column. Look at one row: can both columns be ${op === 'or' ? 'F' : 'T'} there?`],
  solution: `${S} is true on ${pl(kf, 'row')}. Putting ¬ in front flips each row, so ${NS} is true on the other ${pl(kn, 'row')}. On every row exactly one of the two columns is T, so ${J} is true on ${n(kj)} of the 4 rows: it is ${kind}.`,
  guidance: [
   { prompt: `On how many of the 4 rows is ${S} true?`, answer: [kf], explanation: `Down the rows it reads ${column(f, L).map(TF).join('')}: ${pl(kf, 'row')} with T.` },
   { prompt: `${NS} flips every row of that column. On how many rows is it true?`, answer: [kn], explanation: `The flipped column reads ${column(f, L).map(x => TF(!x)).join('')}: ${pl(kn, 'row')} with T.` },
   { prompt: `On every row exactly one of the two columns is T. On how many rows is ${J} true?`, answer: [kj], explanation: op === 'or' ? `With ∨, one T is enough, so it is true on all 4 rows.` : `With ∧, both must be T, and that never happens, so it is true on 0 rows.` }
  ] }; }
});

/* Three-letter shapes over A, B and C. */
const TAUT3 = [IMP(AND(IMP('A', 'B'), IMP('B', 'C')), IMP('A', 'C')), IFF(IMP('A', IMP('B', 'C')), IMP(AND('A', 'B'), 'C')), OR(IMP('A', 'B'), IMP('B', 'C')),
 IMP(AND(OR('A', 'B'), AND(NOT('A'), 'C')), 'B'), IMP(AND('A', 'B'), OR('B', 'C')), IFF(NOT(OR('A', 'B')), AND(NOT('A'), NOT('B')))];
const CONTRA3 = [AND(AND('A', IMP('A', 'B')), AND(NOT('B'), 'C')), AND(AND('A', 'B'), AND(NOT('A'), 'C')), NOT(OR(IMP('A', 'B'), IMP('B', 'C'))), AND(IFF('A', 'B'), AND('B', AND(NOT('A'), 'C'))),
 AND(IMP('A', 'B'), AND(OR('A', 'C'), AND(NOT('B'), NOT('C'))))];
const NEITHER3 = [IMP(AND(IMP('A', 'B'), IMP('B', 'C')), IMP('C', 'A')), IFF(IMP('A', IMP('B', 'C')), IMP(IMP('A', 'B'), 'C')), IMP(OR('A', 'B'), AND('A', 'C')), IMP(IMP('A', 'B'), IMP('A', NOT('C'))), OR(AND('A', 'B'), IMP('C', NOT('A')))];

mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q07', title: 'The first row that fails',
 brief: 'The cooling circuit’s rule has three inputs, and Mira wants to know whether it can fail and, if so, on which row she should look first.',
 labels: ['rows with the statement true', 'first row where it is false (0 if none)', 'tautology (1 or 0)'], tolerance: 0.01,
 gl: [['rows'], ['rows with the statement true'], ['first row where it is false (0 if none)', 'tautology (1 or 0)']]
}, {
 canonical: { f: IMP(AND(IMP('p', 'q'), IMP('q', 'r')), IMP('r', 'p')) },
 draw: R => { let f; do { const u = R.next(), [x, y, z] = perm3(R), m = { A: x, B: y, C: z };
   f = sub(R.pick(u < 0.35 ? TAUT3 : u < 0.6 ? CONTRA3 : NEITHER3), m);
  } while (lettersOf(f).length < 3 || show(f) === '((p → q) ∧ (q → r)) → (r → p)'); return { f }; },
 build: ({ f }) => { const L = ['p', 'q', 'r'], rows = rowsOf(L), vals = rows.map(v => ev(f, v)), k = vals.filter(x => x).length, first = vals.indexOf(false) + 1, taut = k === 8, S = show(f); return {
  prompt: `The cooling circuit’s rule is the statement ${S}, on the three inputs p, q and r. Build its truth table in the standard order, with row 1 at the top. Enter how many rows make the statement true. Then enter the number of the first row, counting from the top, on which it is false (enter 0 if there is no such row). Then enter 1 if the statement is a tautology, 0 if not.`,
  answer: [k, first, TV(taut)],
  hints: ['Three letters need 8 rows. Row 1 has p, q and r all true, and the last letter switches on every row.', 'Work out the statement on each row from the top, and note the first F. A tautology has no F at all.'],
  solution: `The rows (p, q, r) give: ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i])}`).join('; ')}. The statement is true on ${pl(k, 'row')}. ${taut ? 'It is never false, so there is no first false row (0) and it is a tautology (1).' : `The first F is on row ${n(first)}, and since there is a false row it is not a tautology (0).`}`,
  guidance: [
   { prompt: 'How many rows does the table for p, q and r need?', answer: [8], explanation: 'Three letters: 2 × 2 × 2 = 8 rows.' },
   { prompt: `Work out ${S} on every row. On how many rows is it true?`, answer: [k], explanation: `Down the rows it reads ${vals.map(TF).join('')}: ${pl(k, 'row')} with T.` },
   { prompt: 'Which is the first row, from the top, on which it is false (0 if none)? Then is the statement a tautology (1) or not (0)?', answer: [first, TV(taut)], explanation: taut ? 'There is no F, so the first false row is 0 and the statement is a tautology.' : `The first F is on row ${n(first)}, so it is not a tautology.` }
  ] }; }
});

/* ---- q10 Logical equivalence: rows where two statements differ [CM 2.5, Levin 3.1] ---- */

/* Pairs over A and B that are equivalent, and pairs that look alike but are not. */
const PAIRS2 = [
 [IMP('A', 'B'), OR(NOT('A'), 'B')], [IMP('A', 'B'), IMP(NOT('B'), NOT('A'))], [NOT(AND('A', 'B')), OR(NOT('A'), NOT('B'))], [NOT(OR('A', 'B')), AND(NOT('A'), NOT('B'))],
 [IFF('A', 'B'), AND(IMP('A', 'B'), IMP('B', 'A'))], [IMP('A', 'B'), IMP(NOT('A'), NOT('B'))], [NOT(AND('A', 'B')), AND(NOT('A'), NOT('B'))], [NOT(OR('A', 'B')), OR(NOT('A'), NOT('B'))],
 [IFF('A', 'B'), IFF(NOT('A'), NOT('B'))], [OR('A', 'B'), IFF('A', NOT('B'))], [OR('A', 'B'), IMP(NOT('A'), 'B')], [AND('A', 'B'), NOT(IMP('A', NOT('B')))],
 [IMP('A', 'B'), AND('A', 'B')], [IFF('A', 'B'), OR(AND('A', 'B'), AND(NOT('A'), NOT('B')))], [NOT(IMP('A', 'B')), AND('A', NOT('B'))], [NOT(IFF('A', 'B')), IFF('A', NOT('B'))],
 [AND('A', NOT('B')), NOT(IMP('B', 'A'))], [OR('A', NOT('B')), IMP('B', 'A')]
];
const drawPair2 = (R, avoid) => { let f, g; do { const [a, b] = R.pick(PAIRS2), m = R.bool() ? { A: 'p', B: 'q' } : { A: 'q', B: 'p' }, sw = R.bool();
  f = sub(sw ? b : a, m); g = sub(sw ? a : b, m); } while (show(f) === show(g) || avoid.includes(show(f) + ' | ' + show(g))); return { f, g }; };

mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'Night crew and day crew',
 brief: 'The night crew and the day crew each wrote down the airlock cycle rule, and Mira wants to know where, if anywhere, their versions part ways.',
 labels: ['rows where the two differ', 'first row where they differ (0 if none)'], tolerance: 0.01,
 gl: [['rows with the night version true', 'rows with the day version true'], ['rows where the two differ'], ['first row where they differ (0 if none)']]
}, {
 canonical: { f: OR('p', 'q'), g: IFF('p', NOT('q')) },
 draw: R => drawPair2(R, ['p ∨ q | p ↔ ¬q', 'q ∨ p | q ↔ ¬p', '¬(p ∧ q) | ¬p ∨ ¬q', '¬p ∨ ¬q | ¬(p ∧ q)', '¬(q ∧ p) | ¬q ∨ ¬p', '¬q ∨ ¬p | ¬(q ∧ p)']),
 build: ({ f, g }) => { const L = ['p', 'q'], rows = rowsOf(L), vals = rows.map(v => [ev(f, v), ev(g, v)]), kf = vals.filter(x => x[0]).length, kg = vals.filter(x => x[1]).length,
  diff = vals.map((x, i) => [x, i + 1]).filter(([x]) => x[0] !== x[1]).map(([, i]) => i), F = show(f), H = show(g); return {
  prompt: `The night crew wrote the airlock cycle rule as ${F}. The day crew wrote it as ${H}. Build one truth table for both, with a row for each case of p and q in the standard order. Enter on how many rows the two versions have different truth values. Then enter the number of the first row, counting from the top, on which they differ (enter 0 if they never differ).`,
  answer: [diff.length, diff.length ? diff[0] : 0],
  hints: ['Two letters need 4 rows. Work out both versions on every row.', 'Mark each row where one version is T and the other is F. The first such row from the top is the second answer.'],
  solution: `Row by row (p, q: night, day): ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i][0])}, ${TF(vals[i][1])}`).join('; ')}. ${diff.length === 0 ? 'The two columns agree on every row, so 0 rows differ and there is no first row where they differ: 0.' : `The columns differ on ${diff.length === 1 ? 'row' : 'rows'} ${and(diff.map(n))}, so ${pl(diff.length, 'row differs', 'rows differ')} and the first is row ${n(diff[0])}.`}`,
  guidance: [
   { prompt: `On how many rows is ${F} true? On how many is ${H} true?`, answer: [kf, kg], explanation: `${F} is true on ${pl(kf, 'row')} and ${H} on ${pl(kg, 'row')}. Equal counts do not prove the versions agree, so compare row by row.` },
   { prompt: 'Compare the two columns row by row. On how many rows do they differ?', answer: [diff.length], explanation: diff.length === 0 ? 'They agree on every row.' : `They differ on ${diff.length === 1 ? 'row' : 'rows'} ${and(diff.map(n))}.` },
   { prompt: 'Which is the first row where they differ? Enter 0 if there is none.', answer: [diff.length ? diff[0] : 0], explanation: diff.length ? `The first row where the columns differ is row ${n(diff[0])}.` : 'There is no row where they differ, so the answer is 0.' }
  ] }; }
});

/* Families over p and q: a regulation, rewrites that are equivalent to it, and rewrites that only look alike. */
const FAMILIES = [
 { f: IMP('p', 'q'), eq: [OR(NOT('p'), 'q'), IMP(NOT('q'), NOT('p')), NOT(AND('p', NOT('q')))], ne: [IMP('q', 'p'), IMP(NOT('p'), NOT('q')), OR('p', NOT('q')), AND(NOT('p'), 'q')] },
 { f: NOT(AND('p', 'q')), eq: [OR(NOT('p'), NOT('q')), IMP('p', NOT('q')), IMP('q', NOT('p'))], ne: [AND(NOT('p'), NOT('q')), IMP(NOT('p'), 'q'), AND('p', NOT('q'))] },
 { f: IFF('p', 'q'), eq: [AND(IMP('p', 'q'), IMP('q', 'p')), OR(AND('p', 'q'), AND(NOT('p'), NOT('q'))), IFF(NOT('p'), NOT('q'))], ne: [IMP('p', 'q'), AND('p', 'q'), IFF('p', NOT('q')), OR(NOT('p'), 'q')] },
 { f: OR('p', 'q'), eq: [IMP(NOT('p'), 'q'), IMP(NOT('q'), 'p'), NOT(AND(NOT('p'), NOT('q')))], ne: [AND('p', 'q'), OR(NOT('p'), 'q'), IMP('p', 'q'), IMP(NOT('p'), NOT('q'))] }
];
const swapPQ = f => sub(f, { p: 'q', q: 'p' });

mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Three proposed rewrites',
 brief: 'The council wants one regulation rewritten, and three rewrites have been proposed; Mira wants to know which of them say the same thing.',
 labels: ['rewrite 1 equivalent (1 or 0)', 'rewrite 2 equivalent (1 or 0)', 'rewrite 3 equivalent (1 or 0)'], tolerance: 0.01,
 gl: [['rows where rewrite 1 differs'], ['rows where rewrite 2 differs'], ['rows where rewrite 3 differs']]
}, {
 /* Not the q10 worked example's pair, ¬(p ∧ q) and ¬p ∨ ¬q. */
 canonical: { f: IFF('p', 'q'), rw: [IMP('p', 'q'), AND(IMP('p', 'q'), IMP('q', 'p')), IFF(NOT('p'), NOT('q'))] },
 draw: R => { let o; do { const fam = R.pick(FAMILIES), ne = R.int(1, 2), eq = 3 - ne, flip = R.bool(), fx = flip ? swapPQ : x => x,
   rw = shuffle(R, [...shuffle(R, fam.eq).slice(0, eq), ...shuffle(R, fam.ne).slice(0, ne)]);
   o = { f: fx(fam.f), rw: rw.map(fx) }; } while (show(o.f) === 'p ↔ q' && show(o.rw[0]) === 'p → q' && show(o.rw[1]) === '(p → q) ∧ (q → p)'); return o; },
 build: ({ f, rw }) => { const L = ['p', 'q'], rows = rowsOf(L), F = show(f), d = rw.map(g => rows.filter(v => ev(f, v) !== ev(g, v)).length); return {
  prompt: `A council regulation reads ${F}. Three rewrites are proposed. Rewrite 1: ${show(rw[0])}. Rewrite 2: ${show(rw[1])}. Rewrite 3: ${show(rw[2])}. For each rewrite, build a truth table for it and the regulation together, and enter 1 if the rewrite is logically equivalent to the regulation, 0 if it is not.`,
  answer: d.map(x => TV(x === 0)),
  hints: ['Use one table with 4 rows for p and q, and put the regulation’s column beside each rewrite’s column in turn.', 'A rewrite is equivalent only if its column matches the regulation’s on every row. One row that differs makes the answer 0.'],
  solution: `The regulation ${F} reads ${column(f, L).map(TF).join('')} down the rows TT, TF, FT, FF. ${rw.map((g, i) => `Rewrite ${n(i + 1)}, ${show(g)}, reads ${column(g, L).map(TF).join('')}, which differs on ${pl(d[i], 'row')}, so it is ${d[i] === 0 ? 'equivalent: 1' : 'not equivalent: 0'}.`).join(' ')}`,
  guidance: rw.map((g, i) => ({ prompt: `On how many of the 4 rows do ${F} and rewrite ${n(i + 1)}, ${show(g)}, have different truth values?`, answer: [d[i]],
   explanation: d[i] === 0 ? `Rewrite ${n(i + 1)} reads ${column(g, L).map(TF).join('')}, the same as the regulation, so 0 rows differ and it is equivalent.` : `Rewrite ${n(i + 1)} reads ${column(g, L).map(TF).join('')} against ${column(f, L).map(TF).join('')} for the regulation, so ${pl(d[i], 'row differs', 'rows differ')} and it is not equivalent.` }))
  }; }
});

/* Three-letter pairs over A, B and C that are equivalent, and pairs that are not. */
const PAIRS3 = [
 [AND('A', OR('B', 'C')), OR(AND('A', 'B'), AND('A', 'C'))], [OR('A', AND('B', 'C')), AND(OR('A', 'B'), OR('A', 'C'))],
 [AND('A', OR('B', 'C')), OR(AND('A', 'B'), 'C')], [IMP('A', IMP('B', 'C')), IMP(IMP('A', 'B'), 'C')],
 [IMP(AND('A', 'B'), 'C'), IMP('A', IMP('B', 'C'))], [IMP('A', AND('B', 'C')), AND(IMP('A', 'B'), IMP('A', 'C'))],
 [IMP(OR('A', 'B'), 'C'), OR(IMP('A', 'C'), IMP('B', 'C'))], [NOT(IMP('A', 'B')), AND('A', NOT('B'))],
 [IMP(OR('A', 'B'), 'C'), AND(IMP('A', 'C'), IMP('B', 'C'))], [OR('A', IMP('B', 'C')), IMP(NOT('A'), IMP('B', 'C'))],
 [IMP('A', OR('B', 'C')), OR(IMP('A', 'B'), IMP('A', 'C'))], [IMP('A', OR('B', 'C')), AND(IMP('A', 'B'), IMP('A', 'C'))]
];

mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'Equivalence as a tautology',
 brief: 'Mira has a faster test for equivalent rules: join them with a two-way arrow and see whether the joined statement can ever fail.',
 labels: ['rows where the two differ', 'rows with the joined statement true', 'joined statement is a tautology (1 or 0)'], tolerance: 0.01,
 gl: [['rows with the first true', 'rows with the second true'], ['rows where the two differ'], ['rows with the joined statement true', 'tautology (1 or 0)']]
}, {
 canonical: { f: IMP(OR('p', 'q'), 'r'), g: OR(IMP('p', 'r'), IMP('q', 'r')) },
 draw: R => { let o; do { let f, g;
   if (R.next() < 0.85) { const [a, b] = R.pick(PAIRS3), [x, y, z] = perm3(R), m = { A: x, B: y, C: z }, sw = R.bool(); f = sub(sw ? b : a, m); g = sub(sw ? a : b, m); }
   else { do { f = randomTree3(R); g = randomTree3(R); } while (show(f) === show(g)); }
   o = { f, g }; } while (lettersOf(o.f, o.g).length < 3 || (show(o.f) === '(p ∨ q) → r' && show(o.g) === '(p → r) ∨ (q → r)')); return o; },
 build: ({ f, g }) => { const L = ['p', 'q', 'r'], rows = rowsOf(L), vals = rows.map(v => [ev(f, v), ev(g, v)]), kf = vals.filter(x => x[0]).length, kg = vals.filter(x => x[1]).length,
  d = vals.filter(x => x[0] !== x[1]).length, kj = 8 - d, F = show(f), H = show(g), J = `(${F}) ↔ (${H})`; return {
  prompt: `Mira sets two statements against each other on the vault door, which reads three lines p, q and r. The first statement is ${F}. The second statement is ${H}. She also writes the single statement ${J}. Build one truth table with 8 rows in the standard order. Enter on how many rows the first and second statements have different truth values. Then enter how many rows make ${J} true. Then enter 1 if ${J} is a tautology, 0 if not.`,
  answer: [d, kj, TV(d === 0)],
  hints: ['Work out both statements on all 8 rows, and mark each row where they match and each where they differ.', 'A biconditional is true on exactly the rows where its two sides match. A tautology is true on every row.'],
  solution: `Row by row (p, q, r: first, second): ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i][0])}, ${TF(vals[i][1])}`).join('; ')}. The two differ on ${pl(d, 'row')}. The joined statement is true where they match, so on 8 − ${n(d)} = ${pl(kj, 'row')}. ${d === 0 ? 'It is true on every row, so it is a tautology: 1. The two statements are logically equivalent.' : 'It is false on some row, so it is not a tautology: 0. The two statements are not equivalent.'}`,
  guidance: [
   { prompt: `On how many of the 8 rows is the first statement true? On how many is the second true?`, answer: [kf, kg], explanation: `The first is true on ${pl(kf, 'row')} and the second on ${pl(kg, 'row')}.` },
   { prompt: 'Compare the two columns row by row. On how many rows do they differ?', answer: [d], explanation: d === 0 ? 'They agree on every row.' : `They differ on ${pl(d, 'row')}.` },
   { prompt: `The joined statement is true on the rows where the two sides match. On how many rows is it true? Is it a tautology (1) or not (0)?`, answer: [kj, TV(d === 0)], explanation: `8 − ${n(d)} = ${pl(kj, 'row')} match. ${d === 0 ? 'All 8 match, so it is a tautology.' : 'It is false on some row, so it is not a tautology.'}` }
  ] }; }
});

})();
