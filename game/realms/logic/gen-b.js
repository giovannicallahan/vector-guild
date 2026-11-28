/* Logic and proof mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;

/* ---- Statements over the letters p, q, r, written as small trees ------------------------------------------
   ['v', 'p'] a letter, ['not', A], ['and', A, B], ['or', A, B], ['imp', A, B], ['iff', A, B]. */
const V = x => ['v', x], N = a => ['not', a], A = (a, b) => ['and', a, b], O = (a, b) => ['or', a, b], I = (a, b) => ['imp', a, b], B = (a, b) => ['iff', a, b];
const SYM = { and: '∧', or: '∨', imp: '→', iff: '↔' };
/* Text: a letter or a negated letter needs no brackets; every compound part inside a larger statement is bracketed. */
const txt = (f, top = true) => {
 if (f[0] === 'v') return f[1];
 if (f[0] === 'not') return '¬' + (f[1][0] === 'v' ? f[1][1] : '(' + txt(f[1]) + ')');
 const s = `${txt(f[1], false)} ${SYM[f[0]]} ${txt(f[2], false)}`;
 return top ? s : '(' + s + ')';
};
const ev = (f, row) => {
 switch (f[0]) {
  case 'v': return row[f[1]];
  case 'not': return !ev(f[1], row);
  case 'and': return ev(f[1], row) && ev(f[2], row);
  case 'or': return ev(f[1], row) || ev(f[2], row);
  case 'imp': return !ev(f[1], row) || ev(f[2], row);
  default: return ev(f[1], row) === ev(f[2], row);
 }
};
/* The rows in the standard order of q07: the first letter is true on the first half of the rows, the next letter
   alternates in blocks half as long, and the last letter switches on every row. */
const rows = letters => { const out = [], k = letters.length;
 for (let i = 0; i < (1 << k); i++) { const row = {}; letters.forEach((x, j) => { row[x] = !(i & (1 << (k - 1 - j))); }); out.push(row); }
 return out; };
const bits = (f, rs) => rs.map(r => ev(f, r) ? 1 : 0);
const used = (f, set = new Set()) => { if (f[0] === 'v') set.add(f[1]); else f.slice(1).forEach(g => used(g, set)); return set; };
const lettersOf = fs => { const s = new Set(); fs.forEach(f => used(f, s)); return ['p', 'q', 'r'].filter(x => s.has(x)); };
const PERMS3 = ['pqr', 'prq', 'qpr', 'qrp', 'rpq', 'rqp'];
const letter = (perm, i) => V(PERMS3[perm][i]);
/* All orders of k items, in a fixed order, so a shuffle is one whole number in the parameters. */
const orders = k => { const out = [], go = (pre, rest) => { if (!rest.length) out.push(pre); rest.forEach((x, i) => go([...pre, x], rest.filter((_, j) => j !== i))); }; go([], [...Array(k).keys()]); return out; };
const ORD3 = orders(3), ORD4 = orders(4);
const listText = items => items.map((s, i) => `${i + 1}: ${s}`).join('; ');
const ones = bs => bs.join(', ');
const rowList = idx => idx.length === 1 ? `row ${idx[0]}` : `rows ${idx.slice(0, -1).join(', ')} and ${idx[idx.length - 1]}`;
const cap = s => s[0].toUpperCase() + s.slice(1);
const andList = xs => xs.length === 1 ? String(xs[0]) : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const rowsWord = k => `${n(k)} ${k === 1 ? 'row' : 'rows'}`;
const count = (lo, hi, test) => { let c = 0; for (let x = lo; x <= hi; x++) if (test(x)) c++; return c; };
const range = (lo, hi, test) => { const out = []; for (let x = lo; x <= hi; x++) if (test(x)) out.push(x); return out; };
const numList = xs => xs.map(n).join(', ');
const shuffled = (R, k) => { const a = [...Array(k).keys()]; for (let i = k - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---- q11: two wiring proposals over p, q and r. Templates in the same group are logically equivalent. ---- */
const TPL = [
 [(x, y, z) => I(A(x, y), z), 0], [(x, y, z) => I(x, I(y, z)), 0], [(x, y, z) => O(O(N(x), N(y)), z), 0], [(x, y, z) => O(I(x, z), I(y, z)), 0],
 [(x, y, z) => I(O(x, y), z), 1], [(x, y, z) => A(I(x, z), I(y, z)), 1],
 [(x, y, z) => I(x, O(y, z)), 2], [(x, y, z) => I(A(x, N(y)), z), 2],
 [(x, y, z) => O(A(x, y), z), 3], [(x, y, z) => A(O(x, z), O(y, z)), 3],
 [(x, y, z) => A(x, O(y, z)), 4], [(x, y, z) => O(A(x, y), A(x, z)), 4],
 [(x, y, z) => B(x, O(y, z)), 5], [(x, y, z) => I(I(x, y), z), 6], [(x, y, z) => A(I(x, y), I(y, z)), 7]
];
const tpl = (t, perm) => TPL[t][0](letter(perm, 0), letter(perm, 1), letter(perm, 2));

/* ---- q16, q17: "for every n from 1 to N" claims that hold for the first few n and then fail. ---- */
const CLAIM = {
 sq: { text: ({ k, c }) => `n² < ${n(k)}n + ${n(c)}`, holds: ({ k, c }, x) => x * x < k * x + c,
  show: ({ k, c }, x) => `${n(x * x)} < ${n(k * x + c)}` },
 pow: { text: ({ k, c }) => `2ⁿ < ${n(k)}n + ${n(c)}`, holds: ({ k, c }, x) => Math.pow(2, x) < k * x + c,
  show: ({ k, c }, x) => `${n(Math.pow(2, x))} < ${n(k * x + c)}` },
 sum: { text: ({ c }) => `1 + 2 + … + n < ${n(c)}`, holds: ({ c }, x) => x * (x + 1) / 2 < c,
  show: ({ c }, x) => `${x === 1 ? '1' : x <= 4 ? [1, 2, 3, 4].slice(0, x).join(' + ') + ' = ' + n(x * (x + 1) / 2) : `1 + 2 + … + ${n(x)} = ${n(x * (x + 1) / 2)}`} < ${n(c)}` },
 mult: { text: ({ k, c }) => `n² + ${n(c)} is not a multiple of ${n(k)}`, holds: ({ k, c }, x) => (x * x + c) % k !== 0,
  show: ({ k, c }, x) => `${n(x * x)} + ${n(c)} = ${n(x * x + c)}, ${(x * x + c) % k ? 'not ' : ''}a multiple of ${n(k)}` }
};
/* The sum family needs its “…” explained the first time a prompt shows it. */
const claimNote = p => p.fam === 'sum' ? ` Here 1 + 2 + … + n means every whole number from 1 up to n, added together.` : '';
const firstFail = p => { for (let x = 1; x <= p.N; x++) if (!CLAIM[p.fam].holds(p, x)) return x; return 0; };
const drawClaim = (R, fams) => { let p;
 do {
  const fam = R.pick(fams), N = R.int(8, 14);
  if (fam === 'sq') p = { fam, k: R.int(2, 5), c: R.int(3, 20), N };
  else if (fam === 'pow') p = { fam, k: R.int(2, 9), c: R.int(1, 12), N };
  else if (fam === 'sum') p = { fam, k: 1, c: R.int(10, 60), N };
  else p = { fam, k: R.pick([5, 7, 10, 13]), c: R.int(1, 12), N };
 } while (!(firstFail(p) >= 3 && firstFail(p) <= p.N - 1) || (p.fam === 'pow' && p.k === 4 && p.c === 4) || (p.fam === 'sq' && p.k === 2 && p.c === 5));
 return p; };
/* The working of a claim, case by case up to its first failure. */
const claimWork = p => { const x0 = firstFail(p), C = CLAIM[p.fam], lines = [];
 for (let x = 1; x <= x0; x++) lines.push(`n = ${n(x)} gives ${C.show(p, x)}${C.holds(p, x) ? ', true' : ', false'}`);
 return lines.join('; '); };

/* ---- q19, q20: outpost sentences, each with its plain form and its opposite. ---- */
const SENT = [
 ['the east pump is running', 'the east pump is not running'], ['the tank pressure rises', 'the tank pressure does not rise'],
 ['the beacon is lit', 'the beacon is not lit'], ['the hatch is sealed', 'the hatch is not sealed'],
 ['the fan is on', 'the fan is off'], ['the heater is on', 'the heater is off'],
 ['the solar array is deployed', 'the solar array is not deployed'], ['the battery is charging', 'the battery is not charging'],
 ['the alarm sounds', 'the alarm does not sound'], ['the rover is docked', 'the rover is not docked'],
 ['the dome lights are dim', 'the dome lights are not dim'], ['the radio is silent', 'the radio is not silent']
];
const RULES19 = ['modus ponens', 'modus tollens'];
const case19 = (s, t, x, y, r) => { const X = SENT[s][x], Y = SENT[t][y], fact = r === 0 ? X : SENT[t][1 - y],
 asked = r === 0 ? SENT[t][0] : SENT[s][0], value = r === 0 ? (y ? 0 : 1) : (x ? 1 : 0);
 return { X, Y, fact, asked, value, rule: `If ${X}, then ${Y}`, forced: r === 0 ? Y : SENT[s][1 - x] }; };
const FORMS20 = {
 mp: { valid: 1, name: 'modus ponens', text: (a, b) => `If ${a[0]}, then ${b[0]}. ${cap(a[0])}. So ${b[0]}.` },
 mt: { valid: 1, name: 'modus tollens', text: (a, b) => `If ${a[0]}, then ${b[0]}. ${cap(b[1])}. So ${a[1]}.` },
 ac: { valid: 0, name: 'affirming the conclusion', text: (a, b) => `If ${a[0]}, then ${b[0]}. ${cap(b[0])}. So ${a[0]}.` },
 dh: { valid: 0, name: 'denying the hypothesis', text: (a, b) => `If ${a[0]}, then ${b[0]}. ${cap(a[1])}. So ${b[1]}.` },
 chain: { valid: 1, name: 'the chain rule', text: (a, b, c) => `If ${a[0]}, then ${b[0]}. If ${b[0]}, then ${c[0]}. So if ${a[0]}, then ${c[0]}.` },
 back: { valid: 0, name: 'a chain read backwards', text: (a, b, c) => `If ${a[0]}, then ${b[0]}. If ${b[0]}, then ${c[0]}. So if ${c[0]}, then ${a[0]}.` }
};
const WHY20 = {
 mp: 'the hypothesis of the rule is given, so its conclusion is forced',
 mt: 'the conclusion of the rule is denied, so its hypothesis must be false',
 ac: 'the conclusion of the rule is given and its hypothesis is claimed, but the conclusion can be true for some other reason',
 dh: 'the hypothesis of the rule is denied and so is its conclusion, but the conclusion can still be true for some other reason',
 chain: 'each rule passes truth on to the next, so the first part leads to the last',
 back: 'the rules lead from the first part to the last, not back again, so the conclusion does not follow'
};

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Two proposals A and B over p, q and r. About one draw in three pairs a statement with an equivalent rewrite
    (answer 0 rows differ); otherwise the templates come from different groups. */
 q11: {
  canonical: { a: 4, pa: 0, b: 3, pb: 0 },
  draw: R => { const a = R.int(0, TPL.length - 1), pa = R.int(0, 5);
   if (R.int(1, 3) === 1) { const mates = TPL.map((t, i) => i).filter(i => i !== a && TPL[i][1] === TPL[a][1]);
    if (mates.length) return { a, pa, b: R.pick(mates), pb: pa }; }
   let b; do { b = R.int(0, TPL.length - 1); } while (TPL[b][1] === TPL[a][1]);
   return { a, pa, b, pb: R.int(0, 5) }; },
  build: ({ a, pa, b, pb }) => { const fa = tpl(a, pa), fb = tpl(b, pb), rs = rows(['p', 'q', 'r']), ba = bits(fa, rs), bb = bits(fb, rs),
   ta = ba.reduce((s, x) => s + x, 0), tb = bb.reduce((s, x) => s + x, 0), diff = ba.map((x, i) => x !== bb[i] ? i + 1 : 0).filter(Boolean), d = diff.length;
   return {
    prompt: `Two crews have wired the airlock lamp. Proposal A lights it when ${txt(fa)} is true; proposal B lights it when ${txt(fb)} is true. Build the truth table over p, q and r, with its 8 rows in the standard order. Enter the number of rows on which A is true, then the number on which B is true, then the number of rows where A and B have different truth values.`,
    answer: [ta, tb, d],
    hints: ['Work out the inner brackets first, as their own columns, and only then the main connective. A statement X → Y is false only when X is true and Y is false.',
     'Write the two final columns side by side, as ones and zeros, and compare them row by row. If they never differ, the two statements are logically equivalent.'],
    solution: `In the standard order (row 1 has p, q and r all true, row 8 has all three false), A gives ${ones(ba)} and B gives ${ones(bb)}. A is true on ${n(ta)} of the 8 rows and B on ${n(tb)}. ${d ? `They differ on ${rowList(diff)}, so ${n(d)} ${d === 1 ? 'row differs' : 'rows differ'} and the proposals are not logically equivalent.` : 'They agree on every row, so 0 rows differ: the two proposals are logically equivalent and light the lamp in exactly the same cases.'}`,
    guidance: [
     { prompt: `Build the column for A, ${txt(fa)}, over the 8 rows. On how many rows is it true?`, answer: [ta], explanation: `Row by row, A is ${ones(ba)}: ${n(ta)} ones.` },
     { prompt: `Now the column for B, ${txt(fb)}. On how many rows is it true?`, answer: [tb], explanation: `Row by row, B is ${ones(bb)}: ${n(tb)} ones.` },
     { prompt: `Compare the columns A: ${ones(ba)} and B: ${ones(bb)}. On how many rows do they differ?`, answer: [d], explanation: d ? `They differ on ${rowList(diff)}. Equal true-row counts would not be enough: the true rows must be the same rows.` : 'They match on all 8 rows, so the two statements are logically equivalent.' }
    ] }; }
 },

 /* ¬(p ∧ q) or ¬(p ∨ q) with p "n is greater than a" and q "n is a multiple of k", for n from 1 to N.
    Three rewrites are listed in a drawn order; the answer is the number of the one De Morgan's laws give. */
 q12: {
  canonical: { form: 'and', a: 12, k: 4, N: 30, ord: 2 },
  draw: R => { let p;
   do { p = { form: R.pick(['and', 'or']), k: R.int(3, 6), N: R.int(24, 40), ord: R.int(0, 5) }; p.a = R.int(8, p.N - 8); }
   while ((p.form === 'and' ? Math.floor(p.N / p.k) - Math.floor(p.a / p.k) : Math.floor(p.a / p.k)) < 2 || (p.form === 'and' && p.a === 12 && p.k === 4));
   return p; },
  build: ({ form, a, k, N, ord }) => { const and = form === 'and',
   opts = and ? ['¬p ∨ ¬q', '¬p ∧ ¬q', 'p ∨ ¬q'] : ['¬p ∧ ¬q', '¬p ∨ ¬q', '¬p ∧ q'], shown = ORD3[ord].map(i => opts[i]), pick = ORD3[ord].indexOf(0) + 1,
   neg = and ? '¬(p ∧ q)' : '¬(p ∨ q)', both = range(a + 1, N, x => x % k === 0), low = range(1, a, x => x % k === 0),
   total = and ? N - both.length : a - low.length;
   return {
    prompt: `Regulation 7 is about crate numbers n from 1 to ${n(N)}. Let p be “n is greater than ${n(a)}” and q be “n is a multiple of ${n(k)}”. The regulation allows exactly the crates for which ${neg} is true. Which rewrite says the same thing? ${listText(shown)}. Enter its number, then how many crate numbers from 1 to ${n(N)} the regulation allows.`,
    answer: [pick, total],
    hints: [`De Morgan’s laws: the negation of an “and” is the “or” of the negations, and the negation of an “or” is the “and” of the negations. The ¬ moves inside and the connective flips.`,
     and ? `Count the crates that make p ∧ q true (greater than ${n(a)} and a multiple of ${n(k)}), then take them away from all ${n(N)}.` : `¬p means n is at most ${n(a)}. Count the numbers from 1 to ${n(a)}, then take away those that are multiples of ${n(k)}.`],
    solution: and
     ? `By De Morgan’s laws, ¬(p ∧ q) says the same as ¬p ∨ ¬q: n is at most ${n(a)}, or n is not a multiple of ${n(k)}. That is rewrite ${pick}. The crates it rules out are those that make p ∧ q true, the multiples of ${n(k)} above ${n(a)}: ${numList(both)}, which is ${n(both.length)} numbers. So ${n(N)} − ${n(both.length)} = ${n(total)} crate numbers are allowed.`
     : `By De Morgan’s laws, ¬(p ∨ q) says the same as ¬p ∧ ¬q: n is at most ${n(a)}, and n is not a multiple of ${n(k)}. That is rewrite ${pick}. From 1 to ${n(a)} there are ${n(a)} numbers, and the multiples of ${n(k)} among them are ${numList(low)}, which is ${n(low.length)} numbers. So ${n(a)} − ${n(low.length)} = ${n(total)} crate numbers are allowed.`,
    guidance: [
     { prompt: `Move the ¬ inside ${neg}: each letter gets its own ¬ and the connective flips. Which of the listed rewrites is that? ${listText(shown)}.`, answer: [pick], explanation: and ? `¬(p ∧ q) ≡ ¬p ∨ ¬q, which is rewrite ${pick}. “Not both” means at least one of the two fails.` : `¬(p ∨ q) ≡ ¬p ∧ ¬q, which is rewrite ${pick}. “Neither” means both fail.` },
     and
      ? { prompt: `How many crate numbers from 1 to ${n(N)} make p ∧ q true, that is, are greater than ${n(a)} and a multiple of ${n(k)}?`, answer: [both.length], explanation: `They are ${numList(both)}: ${n(both.length)} numbers. Every other crate number makes ¬p ∨ ¬q true.` }
      : { prompt: `How many of the numbers from 1 to ${n(a)} are multiples of ${n(k)}?`, answer: [low.length], explanation: `They are ${numList(low)}: ${n(low.length)} numbers. They make ¬q false, so they are not allowed.` },
     { prompt: and ? `Take those ${n(both.length)} away from all ${n(N)} crate numbers. How many are allowed?` : `Take those ${n(low.length)} away from the ${n(a)} numbers that make ¬p true. How many are allowed?`, answer: [total], explanation: and ? `${n(N)} − ${n(both.length)} = ${n(total)}.` : `${n(a)} − ${n(low.length)} = ${n(total)}.` }
    ] }; }
 },

 /* A rule "if n > a, then n > b" or "if n is a multiple of a, then n is a multiple of b" about every whole number n.
    Its converse, inverse and contrapositive are listed in a drawn order. */
 q13: {
  canonical: { fam: 'gt', a: 9, b: 6, ord: 3 },
  draw: R => { let p;
   do {
    const fam = R.pick(['gt', 'mult']);
    if (fam === 'gt') { p = { fam, a: R.int(2, 15), b: R.int(2, 15) }; }
    else { const [x, y] = R.pick([[6, 3], [12, 4], [14, 7], [8, 4], [9, 3], [12, 6], [15, 5], [3, 6], [4, 12], [5, 10], [2, 8], [3, 9], [4, 6], [6, 9], [4, 10], [6, 8]]); p = { fam, a: x, b: y }; }
    p.ord = R.int(0, 5);
   } while (p.a === p.b || (p.fam === 'gt' && p.a === 9 && p.b === 6));
   return p; },
  build: ({ fam, a, b, ord }) => { const gt = fam === 'gt';
   const P = gt ? `n > ${n(a)}` : `n is a multiple of ${n(a)}`, Q = gt ? `n > ${n(b)}` : `n is a multiple of ${n(b)}`,
    nP = gt ? `n ≤ ${n(a)}` : `n is not a multiple of ${n(a)}`, nQ = gt ? `n ≤ ${n(b)}` : `n is not a multiple of ${n(b)}`;
   /* true when every n that has the first property has the second: for "greater than", a ≥ b; for multiples, b divides a */
   const ruleT = gt ? a > b : a % b === 0, convT = gt ? b > a : b % a === 0;
   const items = [
    { name: 'converse', text: `If ${Q}, then ${P}.`, v: convT ? 1 : 0, why: convT ? (gt ? `every n above ${n(b)} is also above ${n(a)}` : `every multiple of ${n(b)} is a multiple of ${n(a)}, because ${n(b)} is`) : `n = ${n(gt ? a : b)} breaks it` },
    { name: 'inverse', text: `If ${nP}, then ${nQ}.`, v: convT ? 1 : 0, why: convT ? 'it is the contrapositive of the converse, so it matches the converse' : `n = ${n(gt ? a : b)} breaks it` },
    { name: 'contrapositive', text: `If ${nQ}, then ${nP}.`, v: ruleT ? 1 : 0, why: ruleT ? 'it always has the same truth value as the rule, which is true' : `n = ${n(gt ? b : a)} breaks it` }
   ];
   const shown = ORD3[ord].map(i => items[i]), idx = ORD3[ord].indexOf(2) + 1;
   return {
    prompt: `The door rule says: “If ${P}, then ${Q}”, about every whole number n = 1, 2, 3 and so on. A rule like this is true (1) when no whole number breaks it, and false (0) when at least one does. Statement 1: ${shown[0].text} Statement 2: ${shown[1].text} Statement 3: ${shown[2].text} Enter 1 or 0 for statements 1, 2 and 3, in that order, then the number of the statement that is the contrapositive of the rule.`,
    answer: [shown[0].v, shown[1].v, shown[2].v, idx],
    hints: ['The converse swaps the two parts. The inverse puts ¬ on both parts and keeps the order. The contrapositive does both: it swaps the parts and negates them.',
     'To show a statement is false, find one whole number that makes its “if” part true and its “then” part false.'],
    solution: `The rule is ${ruleT ? 'true' : `false: n = ${n(gt ? b : a)} breaks it`}. ${shown.map((s, i) => `Statement ${i + 1} is the ${s.name}, and it is ${s.v ? 'true' : 'false'} (${s.v}): ${s.why}.`).join(' ')} The contrapositive is statement ${idx}; it is the one that always has the same truth value as the rule.`,
    guidance: [
     { prompt: `Is the rule “If ${P}, then ${Q}” itself true (1) or false (0)?`, answer: [ruleT ? 1 : 0], explanation: ruleT ? (gt ? `Any n above ${n(a)} is above ${n(b)} too, because ${n(a)} > ${n(b)}.` : `${n(a)} is a multiple of ${n(b)}, so every multiple of ${n(a)} is a multiple of ${n(b)}.`) : `n = ${n(gt ? b : a)} makes “${P}” true and “${Q}” false.` },
     { prompt: `The contrapositive swaps the parts and negates both: “If ${nQ}, then ${nP}.” Which statement number is it?`, answer: [idx], explanation: `It is statement ${idx}. It is logically equivalent to the rule, so it is ${ruleT ? 'true' : 'false'} as well.` },
     { prompt: `The converse and the inverse are contrapositives of each other, so they share one truth value. Is the converse “If ${Q}, then ${P}” true (1) or false (0)?`, answer: [convT ? 1 : 0], explanation: convT ? `Yes: ${items[0].why}.` : `No: ${items[0].why}, so the inverse is false too.` }
    ] }; }
 },

 /* Rule "if the reading is below a, then the inner door is locked" against a log of 8 cycles; breakers make p ∧ ¬q true.
    Four candidate negations are listed in a drawn order. */
 q14: {
  canonical: { a: 100, log: [[96, 1], [104, 0], [93, 0], [110, 1], [88, 1], [99, 0], [107, 0], [91, 1]], ord: 9 },
  draw: R => { let p;
   do {
    const a = R.int(95, 105), log = [];
    for (let i = 0; i < 8; i++) { let v; do { v = R.int(82, 118); } while (v === a || log.some(e => e[0] === v)); log.push([v, R.int(0, 1)]); }
    p = { a, log, ord: R.int(0, 23) };
   } while (!(() => { const br = p.log.filter(([v, l]) => v < p.a && !l).length, trap = p.log.filter(([v, l]) => v > p.a && !l).length, ok = p.log.filter(([v, l]) => v < p.a && l).length; return br >= 1 && br <= 4 && trap >= 1 && ok >= 1; })());
   return p; },
  build: ({ a, log, ord }) => {
   const opts = ['p ∧ ¬q', '¬p → ¬q', 'p → ¬q', '¬p ∧ q'], shown = ORD4[ord].map(i => opts[i]), pick = ORD4[ord].indexOf(0) + 1;
   const entry = ([v, l], i) => `cycle ${i + 1}, reading ${n(v)}, door ${l ? 'locked' : 'open'}`;
   const br = log.map((e, i) => e[0] < a && !e[1] ? i + 1 : 0).filter(Boolean), low = log.map((e, i) => e[0] < a ? i + 1 : 0).filter(Boolean);
   const cyc = xs => xs.length === 1 ? `cycle ${xs[0]}` : `cycles ${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
   return {
    prompt: `Airlock rule: “If the pressure reading is below ${n(a)}, then the inner door is locked.” Let p be “the reading is below ${n(a)}” and q be “the inner door is locked”. Log: ${log.map(entry).join('; ')}. Which statement is the negation of the rule, true exactly when the rule is broken? ${listText(shown)}. Enter its number, then how many logged cycles broke the rule.`,
    answer: [pick, br.length],
    hints: ['A conditional p → q is false in one case only: p true and q false. Its negation must be true in exactly that case.',
     `Pick out the cycles with a reading below ${n(a)} first. A cycle with a higher reading cannot break the rule, whatever the door did.`],
    solution: `The rule p → q is false only when p is true and q is false, so its negation is p ∧ ¬q: the reading is below ${n(a)} and the door is not locked. That is statement ${pick}. The readings below ${n(a)} are in ${cyc(low)}; of those, the door was open in ${cyc(br)}. So ${n(br.length)} ${br.length === 1 ? 'cycle' : 'cycles'} broke the rule.`,
    guidance: [
     { prompt: `The negation of “if p, then q” is true exactly when p is true and q is false. Which listed statement says that? ${listText(shown)}.`, answer: [pick], explanation: `p ∧ ¬q is statement ${pick}. Note that it is an “and”, not another “if … then”.` },
     { prompt: `How many logged cycles have a reading below ${n(a)}, so that p is true?`, answer: [low.length], explanation: `${cap(cyc(low))}: ${n(low.length)} in all.` },
     { prompt: `Of those, in how many was the door open, so that ¬q is true as well?`, answer: [br.length], explanation: `${cap(cyc(br))}. Those are the rule-breakers.` }
    ] }; }
 },

 /* A domain of 7 whole numbers, a "for every" claim A and a "there is" claim B, with B's witnesses counted. */
 q15: {
  canonical: { dom: [4, 7, 9, 12, 15, 18, 22], pf: 'gt', pc: 3, qf: 'sq', qc: 100 },
  draw: R => { let p;
   do {
    const s = new Set(); while (s.size < 7) s.add(R.int(2, 30));
    const dom = [...s].sort((x, y) => x - y), mn = dom[0], mx = dom[6], pf = R.pick(['gt', 'lt', 'lin']), qf = R.pick(['gt', 'lt', 'sq', 'mult']), t = R.bool();
    let pc, qc;
    if (pf === 'gt') pc = t ? mn - R.int(1, 3) : dom[R.int(1, 4)] - 1;
    else if (pf === 'lt') pc = t ? mx + R.int(1, 3) : dom[R.int(2, 5)] + 1;
    else pc = t ? 2 * mn - 1 - R.int(1, 4) : 2 * dom[R.int(1, 4)] - 2;
    const j = R.int(-1, 3);
    if (qf === 'gt') qc = j < 0 ? mx + R.int(0, 3) : dom[6 - 1 - j];
    else if (qf === 'lt') qc = j < 0 ? mn - R.int(0, 2) : dom[j] + 1;
    else if (qf === 'sq') qc = j < 0 ? mn * mn - R.int(0, 3) : dom[j] * dom[j] + R.int(1, 2 * dom[j]);
    else qc = R.int(3, 7);
    p = { dom, pf, pc, qf, qc };
   } while (JSON.stringify(p) === JSON.stringify(window.MISSION_GEN.q15.canonical));
   return p; },
  build: ({ dom, pf, pc, qf, qc }) => {
   const PT = { gt: `x > ${n(pc)}`, lt: `x < ${n(pc)}`, lin: `2x − 1 > ${n(pc)}` }[pf], PF = { gt: x => x > pc, lt: x => x < pc, lin: x => 2 * x - 1 > pc }[pf];
   const QT = { gt: `x > ${n(qc)}`, lt: `x < ${n(qc)}`, sq: `x² < ${n(qc)}`, mult: `x is a multiple of ${n(qc)}` }[qf], QF = { gt: x => x > qc, lt: x => x < qc, sq: x => x * x < qc, mult: x => x % qc === 0 }[qf];
   const fails = dom.filter(x => !PF(x)), wit = dom.filter(QF), all = fails.length ? 0 : 1, some = wit.length ? 1 : 0;
   const failText = x => pf === 'lin' ? `2 × ${n(x)} − 1 = ${n(2 * x - 1)}, which is not greater than ${n(pc)}` : `${n(x)} is not ${pf === 'gt' ? 'greater' : 'less'} than ${n(pc)}`;
   return {
    prompt: `The stores computer checks the shelf numbers in its domain, the list ${numList(dom)}. Claim A: ∀x (${PT}). Claim B: ∃x (${QT}). Enter 1 or 0 for claim A, then 1 or 0 for claim B, then the number of witnesses for claim B (0 if there are none).`,
    answer: [all, some, wit.length],
    hints: ['∀ asks every number in the domain to pass; a single failure makes claim A false. ∃ needs just one number to pass.',
     'Test claim B on each of the 7 numbers in turn and count the ones that make it true; each of those is a witness.'],
    solution: `Claim A is ${all ? `true (1): every number in the list passes, including ${pf === 'lt' ? `the largest, ${n(dom[6])}` : `the smallest, ${n(dom[0])}`}` : `false (0): ${failText(fails[0])}`}. ${some ? `Claim B is true (1): ${wit.length === 1 ? `its only witness is ${n(wit[0])}` : `its witnesses are ${numList(wit)}, which is ${n(wit.length)} witnesses`}.` : `Claim B is false (0): no number in the list makes ${QT} true, so there are 0 witnesses.`}`,
    guidance: [
     { prompt: `Check ${PT} for each number in ${numList(dom)}. Does every one pass? Enter 1 for yes, 0 for no.`, answer: [all], explanation: all ? 'Every one passes, so ∀x holds.' : `${n(fails[0])} does not pass, and one failure is enough to make the ∀ claim false.` },
     { prompt: `Now check ${QT} for each number. How many make it true?`, answer: [wit.length], explanation: wit.length ? `${numList(wit)}: ${n(wit.length)} in all.` : 'None of them does.' },
     { prompt: `Claim B is ∃x (${QT}). With that many witnesses, is it true (1) or false (0)?`, answer: [some], explanation: some ? 'One witness is enough, so it is true.' : 'With no witness at all, a “there is” claim is false.' }
    ] }; }
 },

 /* "For every n from 1 to N" claims from four families that hold for n = 1 and 2 and fail later; the answers are
    the smallest counterexample and how many n in the domain break the claim. */
 q16: {
  canonical: { fam: 'sq', k: 3, c: 10, N: 10 },
  draw: R => { let p; do { p = drawClaim(R, ['sq', 'pow', 'sum', 'mult']); } while (p.fam === 'sq' && p.k === 3 && p.c === 10); return p; },
  build: p => { const C = CLAIM[p.fam], x0 = firstFail(p), bad = range(1, p.N, x => !C.holds(p, x));
   return {
    prompt: `A regulation claims: for every whole number n from 1 to ${n(p.N)}, ${C.text(p)}.${claimNote(p)} Write its negation, then test it. Enter the smallest n in the domain that is a counterexample to the claim, then how many numbers from 1 to ${n(p.N)} are counterexamples.`,
    answer: [x0, bad.length],
    hints: ['The negation of “for every n, the claim holds” is “there is an n for which the claim fails”. A counterexample is such an n.',
     `Try n = 1, 2, 3 and so on, in order. The first n that fails is the smallest counterexample; then check the rest of the domain up to ${n(p.N)} as well.`],
    solution: `The negation is: there is an n from 1 to ${n(p.N)} for which ${C.text(p)} is false. Testing in order: ${claimWork(p)}. So the smallest counterexample is n = ${n(x0)}. Checking every n up to ${n(p.N)}, the counterexamples are ${numList(bad)}: ${n(bad.length)} of them. One is already enough to show the claim is false.`,
    guidance: [
     { prompt: `Test n = 1, 2, 3 and so on in ${C.text(p)}. What is the first n for which it is false?`, answer: [x0], explanation: `${claimWork(p)}. So n = ${n(x0)} is the smallest counterexample.` },
     { prompt: `Check every n up to ${n(p.N)}. How many make ${C.text(p)} false?`, answer: [bad.length], explanation: `The counterexamples are ${numList(bad)}: ${n(bad.length)} in all.` }
    ] }; }
 },

 /* Review: a two-part rule checked against a log of 8 crates (breakers make p ∧ q ∧ ¬r true), and a "for every n"
    claim with its smallest counterexample. */
 q17: {
  canonical: { w: 30, log: [[34, 1, 1], [41, 1, 0], [22, 1, 0], [38, 0, 0], [45, 1, 0], [27, 0, 1], [52, 0, 0], [31, 1, 1]], fam: 'sum', k: 1, c: 40, N: 12 },
  draw: R => { let p;
   do {
    const w = R.pick([20, 25, 30, 35, 40]), log = [];
    for (let i = 0; i < 8; i++) { let v; do { v = R.int(w - 18, w + 22); } while (v === w || log.some(e => e[0] === v)); log.push([v, R.int(0, 1), R.int(0, 1)]); }
    p = { w, log, ...drawClaim(R, ['sq', 'pow', 'sum', 'mult']) };
   } while (!(() => { const br = p.log.filter(([v, f, s]) => v > p.w && f && !s).length, trap = p.log.filter(([v, f, s]) => !s && !(v > p.w && f)).length; return br >= 1 && br <= 3 && trap >= 2; })());
   return p; },
  build: p => { const { w, log } = p, C = CLAIM[p.fam], x0 = firstFail(p);
   const entry = ([v, f, s], i) => `crate ${i + 1}, ${n(v)} kg, ${f ? 'fragile' : 'not fragile'}, ${s ? 'strapped' : 'loose'}`;
   const hyp = log.map((e, i) => e[0] > w && e[1] ? i + 1 : 0).filter(Boolean), br = log.map((e, i) => e[0] > w && e[1] && !e[2] ? i + 1 : 0).filter(Boolean);
   const cr = xs => xs.length === 1 ? `crate ${xs[0]}` : `crates ${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
   return {
    prompt: `Two regulations need checking. First: “If a crate weighs more than ${n(w)} kg and is marked fragile, then it is strapped down.” Hold log: ${log.map(entry).join('; ')}. Second: “For every whole number n from 1 to ${n(p.N)}, ${C.text(p)}.”${claimNote(p)} Enter how many crates break the first regulation, then the smallest counterexample to the second.`,
    answer: [br.length, x0],
    hints: ['The first regulation has the form (p ∧ q) → r. Its negation is (p ∧ q) ∧ ¬r: heavy, fragile and loose, all three at once.',
     'For the second, try n = 1, 2, 3 and so on in order, and stop at the first n that makes the claim false.'],
    solution: `The first regulation is broken exactly when p ∧ q ∧ ¬r is true: a crate over ${n(w)} kg, marked fragile, and loose. Over ${n(w)} kg and fragile: ${cr(hyp)}; of those, loose: ${cr(br)}. So ${n(br.length)} ${br.length === 1 ? 'crate breaks' : 'crates break'} it. For the second, the negation is “there is an n with ${C.text(p)} false”. Testing in order: ${claimWork(p)}. The smallest counterexample is n = ${n(x0)}.`,
    guidance: [
     { prompt: `Which crates are over ${n(w)} kg and marked fragile, so that the “if” part is true? Enter how many there are.`, answer: [hyp.length], explanation: `${cap(cr(hyp))}. Only these can break the regulation.` },
     { prompt: 'Of those, how many are loose, so that the regulation is broken?', answer: [br.length], explanation: `${cap(cr(br))}: heavy, fragile and loose.` },
     { prompt: `Test n = 1, 2, 3 and so on in ${C.text(p)}. What is the first n for which it is false?`, answer: [x0], explanation: `${claimWork(p)}.` }
    ] }; }
 },

 /* Arguments from a pool, with their letters renamed: rows where every premise is true, the bad rows among them
    (conclusion false), and 1 if valid. */
 q18: {
  canonical: { arg: 9, perm: 0 },
  draw: R => { let p; do { p = { arg: R.int(0, ARGS.length - 1) }; p.perm = lettersOf([...ARGS[p.arg][0](V('p'), V('q'), V('r')), ARGS[p.arg][1](V('p'), V('q'), V('r'))]).length === 2 ? R.pick([0, 2]) : R.int(0, 5); } while ((p.arg === 9 && p.perm === 0) || (p.arg === 3 && p.perm === 0)); return p; },
  build: ({ arg, perm }) => { const x = letter(perm, 0), y = letter(perm, 1), z = letter(perm, 2), prem = ARGS[arg][0](x, y, z), conc = ARGS[arg][1](x, y, z);
   const ls = lettersOf([...prem, conc]), rs = rows(ls), good = rs.map((r, i) => prem.every(f => ev(f, r)) ? i + 1 : 0).filter(Boolean), bad = good.filter(i => !ev(conc, rs[i - 1])), valid = bad.length ? 0 : 1;
   const rowName = i => rs[i - 1] && ls.map(l => `${l} ${rs[i - 1][l] ? 1 : 0}`).join(', ');
   return {
    prompt: `In the council chamber a speaker argues: ${prem.map((f, i) => `premise ${i + 1}, ${txt(f)}`).join('; ')}; so, conclusion: ${txt(conc)}. Build the truth table over ${andList(ls)} (${rs.length} rows). Enter the number of rows on which every premise is true, then the number of those rows on which the conclusion is false, then 1 if the argument is valid or 0 if it is not.`,
    answer: [good.length, bad.length, valid],
    hints: ['Only the rows where every premise is true matter. Cross out every row where some premise is false.',
     'On the rows that are left, look at the conclusion. One row with the conclusion false is enough to make the argument invalid.'],
    solution: `Every premise is true on ${n(good.length)} of the ${n(rs.length)} rows: ${good.map(i => `row ${i} (${rowName(i)})`).join(', ')}. ${bad.length ? `The conclusion ${txt(conc)} is false on ${bad.map(i => `row ${i}`).join(' and ')}, so ${n(bad.length)} ${bad.length === 1 ? 'row has' : 'rows have'} true premises and a false conclusion. The argument is not valid (0).` : `The conclusion ${txt(conc)} is true on all of them, so 0 rows have true premises and a false conclusion. The argument is valid (1).`}`,
    guidance: [
     { prompt: `On how many of the ${n(rs.length)} rows are all the premises (${prem.map(f => txt(f)).join(' and ')}) true?`, answer: [good.length], explanation: `${cap(good.map(i => `row ${i} (${rowName(i)})`).join(', '))}: ${rowsWord(good.length)}.` },
     { prompt: `On how many of those rows is the conclusion ${txt(conc)} false?`, answer: [bad.length], explanation: bad.length ? `${cap(bad.map(i => `row ${i}`).join(' and '))}: true premises with a false conclusion.` : 'None: on every row with true premises the conclusion is true too.' },
     { prompt: 'Is the argument valid (1) or not (0)?', answer: [valid], explanation: valid ? 'No row has true premises and a false conclusion, so it is valid.' : 'At least one row has true premises and a false conclusion, so it is not valid.' }
    ] }; }
 },

 /* Two council cases, each a rule "if X, then Y" and one fact. The fact either affirms X (modus ponens) or denies Y
    (modus tollens); either part of the rule may be a negative sentence. The two rule names are listed in a drawn order. */
 q19: {
  canonical: { s1: 0, t1: 1, x1: 0, y1: 0, r1: 1, s2: 4, t2: 3, x2: 1, y2: 0, r2: 0, ord: 0 },
  draw: R => { let p;
   do { const o = shuffled(R, SENT.length); p = { s1: o[0], t1: o[1], x1: R.int(0, 1), y1: R.int(0, 1), r1: R.int(0, 1), s2: o[2], t2: o[3], x2: R.int(0, 1), y2: R.int(0, 1), r2: R.int(0, 1), ord: R.int(0, 1) }; }
   while (JSON.stringify(p) === JSON.stringify(window.MISSION_GEN.q19.canonical) || [[p.s1, p.t1, p.x1, p.y1, p.r1], [p.s2, p.t2, p.x2, p.y2, p.r2]].some(c => c.join() === '9,7,0,0,1'));
   return p; },
  build: ({ s1, t1, x1, y1, r1, s2, t2, x2, y2, r2, ord }) => {
   const names = ord ? [RULES19[1], RULES19[0]] : RULES19, num = r => names.indexOf(RULES19[r]) + 1;
   const c1 = case19(s1, t1, x1, y1, r1), c2 = case19(s2, t2, x2, y2, r2);
   const say = (c, r, k) => `In case ${k} the fact “${c.fact}” ${r === 0 ? 'is the hypothesis of the rule, so modus ponens forces its conclusion' : 'denies the conclusion of the rule, so modus tollens forces its hypothesis to be false'}: ${c.forced}. So “${c.asked}” is ${c.value ? 'true (1)' : 'false (0)'}, and the rule of inference is number ${num(r)}, ${RULES19[r]}.`;
   return {
    prompt: `Two cases come before the council. Case 1: the rule is “${c1.rule}”, and the log shows that ${c1.fact}. Case 2: the rule is “${c2.rule}”, and the log shows that ${c2.fact}. The rules of inference: ${listText(names)}. For case 1, enter the truth value the facts force on “${c1.asked}” (1 or 0), then the number of the rule of inference used; then the same two for case 2 and “${c2.asked}”.`,
    answer: [c1.value, num(r1), c2.value, num(r2)],
    hints: ['Modus ponens: from “if X, then Y” and X, conclude Y. Modus tollens: from “if X, then Y” and “not Y”, conclude “not X”.',
     'Check whether the fact matches the “if” part of the rule or contradicts the “then” part. Then read off the truth value of the asked sentence, which may be the opposite of the part you concluded.'],
    solution: `${say(c1, r1, 1)} ${say(c2, r2, 2)}`,
    guidance: [
     { prompt: `Case 1: the rule is “${c1.rule}”, and the fact is “${c1.fact}”. What truth value does that force on “${c1.asked}”, and which rule of inference gives it? (${listText(names)}.)`, answer: [c1.value, num(r1)], explanation: `${r1 === 0 ? 'The fact is the hypothesis' : 'The fact denies the conclusion'}, so ${c1.forced}: “${c1.asked}” is ${c1.value}. That is ${RULES19[r1]}, rule ${num(r1)}.` },
     { prompt: `Case 2: the rule is “${c2.rule}”, and the fact is “${c2.fact}”. What truth value does that force on “${c2.asked}”, and which rule of inference gives it?`, answer: [c2.value, num(r2)], explanation: `${r2 === 0 ? 'The fact is the hypothesis' : 'The fact denies the conclusion'}, so ${c2.forced}: “${c2.asked}” is ${c2.value}. That is ${RULES19[r2]}, rule ${num(r2)}.` }
    ] }; }
 },

 /* Three arguments; exactly one is the chain rule, and at least one of the other two is a fallacy. */
 q20: {
  canonical: { f: ['ac', 'chain', 'mt'], o: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  draw: R => { let p;
   do { const j = R.int(0, 2), f = [0, 1, 2].map(i => i === j ? 'chain' : R.pick(['mp', 'mt', 'ac', 'dh', 'back'])); p = { f, o: shuffled(R, SENT.length).slice(0, 9) }; }
   while (!p.f.some(x => !FORMS20[x].valid) || JSON.stringify(p) === JSON.stringify(window.MISSION_GEN.q20.canonical) || p.f.some((x, i) => x === 'ac' && p.o[3 * i] === 9 && p.o[3 * i + 1] === 7));
   return p; },
  build: ({ f, o }) => { const s = i => SENT[o[i]], text = f.map((x, i) => FORMS20[x].text(s(3 * i), s(3 * i + 1), s(3 * i + 2))), v = f.map(x => FORMS20[x].valid), chain = f.indexOf('chain') + 1;
   return {
    prompt: `Three speeches in the council. Argument 1: ${text[0]} Argument 2: ${text[1]} Argument 3: ${text[2]} Enter 1 if the argument is valid or 0 if it is a fallacy, for arguments 1, 2 and 3 in that order, then the number of the argument that uses the chain rule.`,
    answer: [v[0], v[1], v[2], chain],
    hints: ['Match each argument to a pattern. Valid: modus ponens, modus tollens, the chain rule. Fallacies: affirming the conclusion, denying the hypothesis, a chain read backwards.',
     'The chain rule links two conditionals end to end: if X then Y, if Y then Z, so if X then Z. Read the order of the parts carefully.'],
    solution: `${f.map((x, i) => `Argument ${i + 1} is ${FORMS20[x].name}, ${FORMS20[x].valid ? 'valid (1)' : 'a fallacy (0)'}: ${WHY20[x]}.`).join(' ')} The chain rule is argument ${chain}.`,
    guidance: [
     { prompt: `Argument 1: ${text[0]} Valid (1) or a fallacy (0)?`, answer: [v[0]], explanation: `It is ${FORMS20[f[0]].name}, ${FORMS20[f[0]].valid ? 'valid' : 'a fallacy'}: ${WHY20[f[0]]}.` },
     { prompt: `Argument 2: ${text[1]} Valid (1) or a fallacy (0)?`, answer: [v[1]], explanation: `It is ${FORMS20[f[1]].name}, ${FORMS20[f[1]].valid ? 'valid' : 'a fallacy'}: ${WHY20[f[1]]}.` },
     { prompt: `Argument 3: ${text[2]} Valid (1) or a fallacy (0)? Then which argument links two rules end to end, the chain rule?`, answer: [v[2], chain], explanation: `Argument 3 is ${FORMS20[f[2]].name}, ${FORMS20[f[2]].valid ? 'valid' : 'a fallacy'}: ${WHY20[f[2]]}. The chain rule is argument ${chain}.` }
    ] }; }
 }
});

/* q18's pool: [premises, conclusion] over x, y, z (the letters after renaming). */
const ARGS = [
 [(x, y) => [I(x, y), x], (x, y) => y], [(x, y) => [I(x, y), y], (x, y) => x], [(x, y) => [I(x, y), N(y)], (x) => N(x)],
 [(x, y) => [I(x, y), N(x)], (x, y) => N(y)], [(x, y) => [O(x, y), N(x)], (x, y) => y], [(x, y) => [O(x, y), x], (x, y) => N(y)],
 [(x, y, z) => [I(x, y), I(y, z)], (x, y, z) => I(x, z)], [(x, y, z) => [I(x, y), I(y, z)], (x, y, z) => I(z, x)],
 [(x, y, z) => [I(x, z), I(y, z)], (x, y, z) => I(O(x, y), z)], [(x, y, z) => [O(x, y), I(x, z)], (x, y, z) => z],
 [(x, y, z) => [O(x, y), I(x, z), I(y, z)], (x, y, z) => z], [(x, y, z) => [I(A(x, y), z), x], (x, y, z) => I(y, z)],
 [(x, y, z) => [I(x, y), I(z, y)], (x, y, z) => I(x, z)], [(x, y, z) => [I(x, O(y, z)), N(y)], (x, y, z) => I(x, z)],
 [(x, y) => [B(x, y), N(y)], (x) => N(x)], [(x, y) => [I(x, y), N(A(x, y))], (x) => N(x)]
];
})();
