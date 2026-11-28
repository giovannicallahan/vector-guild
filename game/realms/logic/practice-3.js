/* Logic and proof practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p3.js. */
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

/* ---- shared helpers ------------------------------------------------------------------------------------ */
const cap = s => s[0].toUpperCase() + s.slice(1);
const count = (lo, hi, test) => { let c = 0; for (let x = lo; x <= hi; x++) if (test(x)) c++; return c; };
const range = (lo, hi, test) => { const out = []; for (let x = lo; x <= hi; x++) if (test(x)) out.push(x); return out; };
const numList = xs => xs.map(n).join(', ');
const andList = xs => xs.length === 1 ? String(xs[0]) : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const orders = k => { const out = [], go = (pre, rest) => { if (!rest.length) out.push(pre); rest.forEach((x, i) => go([...pre, x], rest.filter((_, j) => j !== i))); }; go([], [...Array(k).keys()]); return out; };
const ORD3 = orders(3), ORD4 = orders(4);
const listText = items => items.map((s, i) => `${i + 1}: ${s}`).join('; ');

/* Statements over the letters p, q, r (s) as small trees: ['v', x], ['not', A], ['and', A, B], ['or', A, B], ['imp', A, B], ['iff', A, B]. */
const V = x => ['v', x], N = a => ['not', a], A = (a, b) => ['and', a, b], O = (a, b) => ['or', a, b], I = (a, b) => ['imp', a, b], B = (a, b) => ['iff', a, b];
const SYM = { and: '∧', or: '∨', imp: '→', iff: '↔' };
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
/* Rows in the standard order: the first letter is true on the first half, the last letter switches on every row. */
const rows = letters => { const out = [], k = letters.length;
 for (let i = 0; i < (1 << k); i++) { const row = {}; letters.forEach((x, j) => { row[x] = !(i & (1 << (k - 1 - j))); }); out.push(row); }
 return out; };
const bits = (f, rs) => rs.map(r => ev(f, r) ? 1 : 0);
const sum = bs => bs.reduce((s, x) => s + x, 0);
const ones = bs => bs.join(', ');
const rowList = idx => idx.length === 1 ? `row ${idx[0]}` : `rows ${idx.slice(0, -1).join(', ')} and ${idx[idx.length - 1]}`;
const PERMS3 = ['pqr', 'prq', 'qpr', 'qrp', 'rpq', 'rqp'];
const PERMS4 = orders(4).map(o => o.map(i => 'pqrs'[i]).join(''));
/* Templates over x, y, z (and w): the number is a group; templates in one group are logically equivalent. */
const TPL3 = [
 [(x, y, z) => I(A(x, y), z), 0], [(x, y, z) => I(x, I(y, z)), 0], [(x, y, z) => O(O(N(x), N(y)), z), 0],
 [(x, y, z) => I(O(x, y), z), 1], [(x, y, z) => A(I(x, z), I(y, z)), 1],
 [(x, y, z) => I(x, O(y, z)), 2], [(x, y, z) => I(A(x, N(y)), z), 2],
 [(x, y, z) => O(A(x, y), z), 3], [(x, y, z) => A(O(x, z), O(y, z)), 3],
 [(x, y, z) => A(x, O(y, z)), 4], [(x, y, z) => O(A(x, y), A(x, z)), 4],
 [(x, y, z) => B(x, O(y, z)), 5], [(x, y, z) => I(I(x, y), z), 6], [(x, y, z) => A(I(x, y), I(y, z)), 7],
 [(x, y, z) => I(N(x), A(y, z)), 8], [(x, y, z) => O(x, A(y, z)), 8]
];
const TPL4 = [
 [(x, y, z, w) => I(A(x, y), O(z, w)), 0], [(x, y, z, w) => O(N(A(x, y)), O(z, w)), 0], [(x, y, z, w) => I(x, I(y, O(z, w))), 0],
 [(x, y, z, w) => I(O(x, y), A(z, w)), 1], [(x, y, z, w) => A(I(x, A(z, w)), I(y, A(z, w))), 1],
 [(x, y, z, w) => A(O(x, y), O(z, w)), 2], [(x, y, z, w) => O(O(A(x, z), A(x, w)), O(A(y, z), A(y, w))), 2],
 [(x, y, z, w) => O(A(x, y), A(z, w)), 3], [(x, y, z, w) => A(A(O(x, z), O(x, w)), A(O(y, z), O(y, w))), 3],
 [(x, y, z, w) => I(A(x, y), A(z, w)), 4], [(x, y, z, w) => I(x, I(y, A(z, w))), 4],
 [(x, y, z, w) => B(A(x, y), O(z, w)), 5], [(x, y, z, w) => A(I(A(x, y), O(z, w)), I(O(z, w), A(x, y))), 5],
 [(x, y, z, w) => A(I(x, y), I(z, w)), 6],
 [(x, y, z, w) => O(I(x, y), I(z, w)), 7], [(x, y, z, w) => I(A(x, z), O(y, w)), 7]
];
const tpl3 = (T, t, perm) => { const L = PERMS3[perm]; return T[t][0](V(L[0]), V(L[1]), V(L[2])); };
const tpl4 = (T, t, perm) => { const L = PERMS4[perm]; return T[t][0](V(L[0]), V(L[1]), V(L[2]), V(L[3])); };
/* A pair of templates: about one draw in three is an equivalent pair (same group, same letter order). */
const drawPair = (R, T, nperm) => {
 const a = R.int(0, T.length - 1), pa = R.int(0, nperm - 1);
 if (R.int(1, 3) === 1) { const mates = T.map((t, i) => i).filter(i => i !== a && T[i][1] === T[a][1]);
  if (mates.length) return { a, pa, b: R.pick(mates), pb: pa }; }
 let b; do { b = R.int(0, T.length - 1); } while (T[b][1] === T[a][1]);
 return { a, pa, b, pb: R.int(0, nperm - 1) };
};
/* The two columns of a pair. */
const pairTable = (p, T, mkf, letters) => {
 const fa = mkf(T, p.a, p.pa), fb = mkf(T, p.b, p.pb), rs = rows(letters), ba = bits(fa, rs), bb = bits(fb, rs);
 const diff = ba.map((x, i) => x !== bb[i] ? i + 1 : 0).filter(Boolean);
 return { fa, fb, ba, bb, ta: sum(ba), tb: sum(bb), diff, d: diff.length };
};

/* ---- q11 Chapter review: tables and equivalence [CM 2.3, 2.5] ---- */

/* The greenhouse vents: two controllers over three sensors; the first row where they disagree. */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'Two vent controllers',
 brief: 'The greenhouse has two proposed vent controllers, and Mira wants to know on which sensor settings they would act differently before one is bought.',
 labels: ['rows where A opens the vent', 'rows where B opens the vent', 'first row where they disagree'], tolerance: 0.01,
 gl: [['rows where A opens the vent'], ['rows where B opens the vent'], ['first row where they disagree']]
}, {
 canonical: { a: 3, pa: 1, b: 12, pb: 0 },
 draw: R => { let p; do { p = drawPair(R, TPL3, 6); } while (p.a === 3 && p.pa === 1 && p.b === 12); return p; },
 build: p => { const t = pairTable(p, TPL3, tpl3, ['p', 'q', 'r']), f = t.diff.length ? t.diff[0] : 0; return {
  prompt: `The greenhouse sensors are p (humidity is high), q (heat is high) and r (the door is open). Controller A opens the vent when ${txt(t.fa)} is true; controller B opens it when ${txt(t.fb)} is true. List the 8 settings of the sensors as rows in the standard order, with row 1 having all three sensors true and row 8 all three false. Enter the number of rows on which A opens the vent, the number on which B does, and then the number of the first row where A and B disagree (0 if they never disagree).`,
  answer: [t.ta, t.tb, f],
  hints: ['Make a column for each bracket first and then one for the whole statement. A statement X → Y is false only when X is true and Y is false.',
   'Write the two final columns side by side as ones and zeros, and read down them together until the first row where one has a 1 and the other a 0.'],
  solution: `In the standard order, A gives ${ones(t.ba)} and B gives ${ones(t.bb)}. A opens the vent on ${n(t.ta)} rows and B on ${n(t.tb)}. ${f ? `The first row where one is 1 and the other 0 is row ${n(f)}, so that is the first disagreement.` : 'They match on every row, so they never disagree and the answer is 0: the two controllers are logically equivalent.'}`,
  guidance: [
   { prompt: `Build the column for A, ${txt(t.fa)}, over the 8 rows. On how many rows is it true?`, answer: [t.ta], explanation: `Row by row, A is ${ones(t.ba)}: ${n(t.ta)} ones.` },
   { prompt: `Now the column for B, ${txt(t.fb)}. On how many rows is it true?`, answer: [t.tb], explanation: `Row by row, B is ${ones(t.bb)}: ${n(t.tb)} ones.` },
   { prompt: `Compare A: ${ones(t.ba)} with B: ${ones(t.bb)}. What is the number of the first row where they differ? Enter 0 if they never do.`, answer: [f], explanation: f ? `Row ${n(f)} is the first with a 1 in one column and a 0 in the other.` : 'The columns are the same on every row, so there is no first disagreement.' }
  ] }; }
});

/* The rows where the controllers disagree need an engineer: a cost in minutes. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'Hand checks on the wiring',
 brief: 'Every sensor setting on which two lamp designs disagree needs an engineer to inspect it by hand, and the rota has to be booked.',
 labels: ['rows where A is true', 'rows that differ', 'minutes of hand checks'], tolerance: 0.01,
 gl: [['rows where A is true'], ['rows that differ'], ['minutes of hand checks']]
}, {
 canonical: { a: 9, pa: 3, b: 10, pb: 0, w: 6 },
 draw: R => { let p; do { p = { ...drawPair(R, TPL3, 6), w: R.int(3, 9) }; } while (p.a === 9 && p.b === 10 && p.pa === 3); return p; },
 build: p => { const t = pairTable(p, TPL3, tpl3, ['p', 'q', 'r']), w = p.w, tot = t.d * w; return {
  prompt: `Two lamp designs are tested on all 8 settings of the switches p, q and r. Design A lights the lamp when ${txt(t.fa)} is true; design B lights it when ${txt(t.fb)} is true. On every setting where the two designs give different answers, an engineer must check the wiring by hand, and each such check takes ${n(w)} minutes. Enter the number of settings (rows) on which A lights the lamp, the number of rows on which A and B differ, and the total minutes of hand checks.`,
  answer: [t.ta, t.d, tot],
  hints: ['Write the 8 rows in the standard order and build a column for each design, bracket by bracket. Only the final columns are compared.',
   'A row needs a hand check when one final column has a 1 and the other a 0. Count those rows, then multiply by the minutes for one check.'],
  solution: `In the standard order, A gives ${ones(t.ba)} and B gives ${ones(t.bb)}. A lights the lamp on ${n(t.ta)} rows. The columns differ on ${t.d ? rowList(t.diff) : 'no row'}, so ${n(t.d)} ${t.d === 1 ? 'row needs' : 'rows need'} a hand check. At ${n(w)} minutes each that is ${n(t.d)} × ${n(w)} = ${n(tot)} minutes${t.d ? '' : ', because the two designs are logically equivalent'}.`,
  guidance: [
   { prompt: `Build the column for A, ${txt(t.fa)}, over the 8 rows. On how many rows is it true?`, answer: [t.ta], explanation: `Row by row, A is ${ones(t.ba)}: ${n(t.ta)} ones.` },
   { prompt: `Build B, ${txt(t.fb)}, and compare it with A: ${ones(t.ba)}. On how many rows do they differ?`, answer: [t.d], explanation: `B is ${ones(t.bb)}. They differ on ${t.d ? rowList(t.diff) : 'no row'}: ${n(t.d)} in all.` },
   { prompt: `Each differing row needs a ${n(w)}-minute check. How many minutes is that in all?`, answer: [tot], explanation: `${n(t.d)} × ${n(w)} = ${n(tot)}.` }
  ] }; }
});

/* Four sensors: 16 rows. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q07', title: 'Four sensors, sixteen rows',
 brief: 'A new interlock reads four sensors instead of three, and two proposed rules for it must be compared on every one of the possible settings.',
 labels: ['true rows of A', 'true rows of B', 'rows that differ'], tolerance: 0.01,
 gl: [['true rows of A'], ['true rows of B'], ['rows that differ']]
}, {
 canonical: { a: 0, pa: 0, b: 2, pb: 5 },
 draw: R => { let p; do { p = drawPair(R, TPL4, 24); } while (p.a === 0 && p.b === 2 && p.pa === 0); return p; },
 build: p => { const t = pairTable(p, TPL4, tpl4, ['p', 'q', 'r', 's']); return {
  prompt: `An interlock reads four sensors p, q, r and s. Rule A opens it when ${txt(t.fa)} is true; rule B opens it when ${txt(t.fb)} is true. Each sensor doubles the number of cases, so the table has 2 × 2 × 2 × 2 = 16 rows, in the standard order with row 1 all true and row 16 all false. Enter the number of rows on which A is true, the number on which B is true, and the number of rows where A and B differ.`,
  answer: [t.ta, t.tb, t.d],
  hints: ['Four letters make 16 rows. Fill in the inner brackets as their own columns before the main connective, and keep the same row order for both rules.',
   'Equal counts of ones do not make two rules equivalent. Compare the two final columns row by row and count the rows that disagree.'],
  solution: `With 16 rows in the standard order, A gives ${ones(t.ba)} and B gives ${ones(t.bb)}. A is true on ${n(t.ta)} rows and B on ${n(t.tb)}. They differ on ${t.d ? rowList(t.diff) : 'no row'}, so ${n(t.d)} ${t.d === 1 ? 'row differs' : 'rows differ'}${t.d ? '' : ' and the two rules are logically equivalent'}.`,
  guidance: [
   { prompt: `Build the 16-row column for A, ${txt(t.fa)}. On how many rows is it true?`, answer: [t.ta], explanation: `Row by row, A is ${ones(t.ba)}: ${n(t.ta)} ones.` },
   { prompt: `Now the column for B, ${txt(t.fb)}. On how many rows is it true?`, answer: [t.tb], explanation: `Row by row, B is ${ones(t.bb)}: ${n(t.tb)} ones.` },
   { prompt: `Compare A: ${ones(t.ba)} with B: ${ones(t.bb)}. On how many rows do they differ?`, answer: [t.d], explanation: `They differ on ${t.d ? rowList(t.diff) : 'no row'}: ${n(t.d)} in all.` }
  ] }; }
});

/* ---- q12 De Morgan's laws [CM 2.6] ---- */

/* Simple numeric conditions on n, each with its opposite. */
const NC = {
 low: { t: c => `n is below ${n(c)}`, nt: c => `n is at least ${n(c)}`, f: (x, c) => x < c },
 high: { t: c => `n is above ${n(c)}`, nt: c => `n is at most ${n(c)}`, f: (x, c) => x > c },
 mult: { t: c => `n is a multiple of ${n(c)}`, nt: c => `n is not a multiple of ${n(c)}`, f: (x, c) => x % c === 0 },
 odd: { t: () => 'n is odd', nt: () => 'n is even', f: x => x % 2 === 1 },
 even: { t: () => 'n is even', nt: () => 'n is odd', f: x => x % 2 === 0 }
};
const ncDraw = (R, kind) => ({ k: kind, c: kind === 'low' ? R.int(8, 20) : kind === 'high' ? R.int(6, 18) : kind === 'mult' ? R.int(3, 7) : 0 });
const nct = o => NC[o.k].t(o.c), ncn = o => NC[o.k].nt(o.c), ncf = (o, x) => NC[o.k].f(x, o.c);

mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'Which trays are cleared',
 brief: 'The greenhouse clears trays for watering by a rule written with one long “not”, and the gardeners need it in a form they can check tray by tray.',
 labels: ['number of the rewrite', 'trays cleared'], tolerance: 0.01,
 gl: [['number of the rewrite'], ['trays failing the inner statement'], ['trays cleared']]
}, {
 canonical: { form: 'or', p: { k: 'high', c: 14 }, q: { k: 'odd', c: 0 }, N: 36, ord: 4 },
 draw: R => { let s; do {
  const kinds = ['low', 'high', 'mult', 'odd', 'even'], k1 = R.pick(kinds); let k2; do { k2 = R.pick(kinds); } while (k2 === k1 || (k1 === 'odd' && k2 === 'even') || (k1 === 'even' && k2 === 'odd'));
  const N = R.int(24, 45), form = R.pick(['and', 'or']);
  s = { form, p: ncDraw(R, k1), q: ncDraw(R, k2), N, ord: R.int(0, 5) };
  const inner = count(1, N, x => form === 'and' ? ncf(s.p, x) && ncf(s.q, x) : ncf(s.p, x) || ncf(s.q, x));
  if (inner < 3 || inner > N - 3) s = null;
 } while (!s || (s.form === 'or' && s.p.k === 'high' && s.p.c === 14 && s.q.k === 'odd')); return s; },
 build: ({ form, p, q, N, ord }) => {
  const and = form === 'and', P = nct(p), Q = nct(q), nP = ncn(p), nQ = ncn(q),
   opts = and ? [`${nP} or ${nQ}`, `${nP} and ${nQ}`, `${P} or ${nQ}`] : [`${nP} and ${nQ}`, `${nP} or ${nQ}`, `${nP} and ${Q}`],
   shown = ORD3[ord].map(i => opts[i]), pick = ORD3[ord].indexOf(0) + 1,
   inner = range(1, N, x => and ? ncf(p, x) && ncf(q, x) : ncf(p, x) || ncf(q, x)), cleared = N - inner.length;
  const lst = inner.length <= 10 ? `: ${numList(inner)}` : '';
  return {
   prompt: `Greenhouse trays are numbered n from 1 to ${n(N)}. A tray is cleared for watering when it is not true that (${P} ${form} ${Q}). Which rewrite says the same thing? ${listText(shown)}. Enter the number of the rewrite, then how many of the ${n(N)} trays are cleared.`,
   answer: [pick, cleared],
   hints: ['De Morgan’s laws: put a ¬ on each part and flip the connective, “and” to “or” and “or” to “and”. The opposite of “is below” is “is at least”, and so on.',
    `The trays that are not cleared are exactly those that make the statement inside the brackets true. Count them, and take that number away from ${n(N)}.`],
   solution: `By De Morgan’s laws, “not (${P} ${form} ${Q})” says the same as “${opts[0]}”, which is rewrite ${pick}. The trays that are not cleared are those for which “${P} ${form} ${Q}” is true${lst}: ${n(inner.length)} trays. So ${n(N)} − ${n(inner.length)} = ${n(cleared)} trays are cleared.`,
   guidance: [
    { prompt: `Put a ¬ on each part of “${P} ${form} ${Q}” and flip the connective. Which listed rewrite is that? ${listText(shown)}.`, answer: [pick], explanation: `The rewrite is “${opts[0]}”, which is number ${pick}.` },
    { prompt: `How many trays from 1 to ${n(N)} make “${P} ${form} ${Q}” true? Those are the ones not cleared.`, answer: [inner.length], explanation: inner.length <= 10 ? `They are ${numList(inner)}: ${n(inner.length)} trays.` : `Counting them gives ${n(inner.length)} trays.` },
    { prompt: `Take those ${n(inner.length)} away from all ${n(N)} trays. How many are cleared?`, answer: [cleared], explanation: `${n(N)} − ${n(inner.length)} = ${n(cleared)}.` }
   ] }; }
});

mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Containers held back',
 brief: 'Customs holds a container back on a two-part test, and the dock office needs to know how many are cleared and how long the logging will take.',
 labels: ['multiples up to the limit', 'containers cleared', 'minutes of logging'], tolerance: 0.01,
 gl: [['multiples up to the limit'], ['containers cleared'], ['minutes of logging']]
}, {
 canonical: { a: 40, k: 6, N: 55, t: 4 },
 draw: R => { let p; do { const k = R.int(3, 9), a = R.int(20, 60); p = { a, k, N: a + R.int(8, 25), t: R.int(2, 9) }; } while (p.a === 40 && p.k === 6); return p; },
 build: ({ a, k, N, t }) => { const m = range(1, a, x => x % k === 0), cleared = a - m.length, mins = cleared * t; return {
  prompt: `Containers on the dock are numbered 1 to ${n(N)}. Customs holds a container back when its number is above ${n(a)} or is a multiple of ${n(k)}; every other container is cleared. Logging one cleared container takes ${n(t)} minutes. Enter how many of the numbers 1 to ${n(a)} are multiples of ${n(k)}, then how many containers are cleared, then the total minutes of logging.`,
  answer: [m.length, cleared, mins],
  hints: [`“Not (above ${n(a)}, or a multiple of ${n(k)})” becomes “not above ${n(a)}, and not a multiple of ${n(k)}”, by De Morgan’s laws. So a cleared container is at most ${n(a)}, and not a multiple of ${n(k)}.`,
   `Start from the numbers 1 up to ${n(a)}, take away the multiples of ${n(k)}, then multiply what is left by the minutes for one container.`],
  solution: `A container is held back when “above ${n(a)} or a multiple of ${n(k)}” is true, so it is cleared when it is at most ${n(a)} and not a multiple of ${n(k)}. There are ${n(m.length)} multiples of ${n(k)} from 1 to ${n(a)}. That leaves ${n(a)} − ${n(m.length)} = ${n(cleared)} cleared containers, and ${n(cleared)} × ${n(t)} = ${n(mins)} minutes of logging.`,
  guidance: [
   { prompt: `Cleared containers are at most ${n(a)} and not multiples of ${n(k)}. How many of the numbers 1 to ${n(a)} are multiples of ${n(k)}?`, answer: [m.length], explanation: `${n(a)} ÷ ${n(k)} gives ${n(m.length)} whole multiples, the last being ${n(m.length * k)}.` },
   { prompt: `Of the ${n(a)} numbers from 1 to ${n(a)}, take away those multiples. How many containers are cleared?`, answer: [cleared], explanation: `${n(a)} − ${n(m.length)} = ${n(cleared)}.` },
   { prompt: `Each cleared container takes ${n(t)} minutes to log. How many minutes is that in all?`, answer: [mins], explanation: `${n(cleared)} × ${n(t)} = ${n(mins)}.` }
  ] }; }
});

mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q04', title: 'Two inspection cycles',
 brief: 'Two inspection cycles share one lane, and the office needs to know how many lane slots the booking rule leaves free.',
 labels: ['number of the rewrite', 'numbers making the inside true', 'numbers allowed'], tolerance: 0.01,
 gl: [['number of the rewrite'], ['numbers making the inside true'], ['numbers allowed']]
}, {
 canonical: { form: 'or', a: 4, b: 6, N: 90, ord: 3 },
 draw: R => { let p; do { const [a, b] = R.pick([[4, 6], [6, 10], [4, 10], [6, 9], [10, 15], [6, 8], [9, 12], [4, 14], [6, 15]]); p = { form: R.pick(['and', 'or']), a, b, N: R.int(60, 120), ord: R.int(0, 5) }; } while (p.form === 'or' && p.a === 4 && p.b === 6 && p.N === 90); return p; },
 build: ({ form, a, b, N, ord }) => { const and = form === 'and', L = a * b / gcd(a, b),
  opts = and ? ['¬p ∨ ¬q', '¬p ∧ ¬q', 'p ∨ ¬q'] : ['¬p ∧ ¬q', '¬p ∨ ¬q', '¬p ∧ q'], shown = ORD3[ord].map(i => opts[i]), pick = ORD3[ord].indexOf(0) + 1,
  ma = Math.floor(N / a), mb = Math.floor(N / b), mab = Math.floor(N / L), inner = and ? mab : ma + mb - mab, allowed = N - inner, neg = and ? '¬(p ∧ q)' : '¬(p ∨ q)';
  return {
   prompt: `Lane slots are numbered n from 1 to ${n(N)}. Let p be “n is a multiple of ${n(a)}” and q be “n is a multiple of ${n(b)}”. A slot is free exactly when ${neg} is true. Which rewrite says the same thing? ${listText(shown)}. Enter its number, then how many slots make ${and ? 'p ∧ q' : 'p ∨ q'} true, then how many slots are free.`,
   answer: [pick, inner, allowed],
   hints: ['By De Morgan’s laws, put a ¬ on each letter and flip the connective. Then count the slots that make the part inside the brackets true, and take them away from all of them.',
    `A number that is a multiple of both ${n(a)} and ${n(b)} is a multiple of ${n(L)}, the smallest number that both go into. ${and ? 'Those are the slots that make p ∧ q true.' : 'Count such numbers once only: add the two counts and take the overlap away.'}`],
   solution: `By De Morgan’s laws, ${neg} says the same as ${opts[0]}, which is rewrite ${pick}. Multiples of ${n(a)} up to ${n(N)}: ${n(ma)}. Multiples of ${n(b)}: ${n(mb)}. Multiples of both are the multiples of ${n(L)}: ${n(mab)}. ${and ? `So ${n(mab)} slots make p ∧ q true.` : `Counting the overlap once, ${n(ma)} + ${n(mb)} − ${n(mab)} = ${n(inner)} slots make p ∨ q true.`} The free slots are the rest: ${n(N)} − ${n(inner)} = ${n(allowed)}.`,
   guidance: [
    { prompt: `Move the ¬ inside ${neg}: each letter gets its own ¬ and the connective flips. Which listed rewrite is that? ${listText(shown)}.`, answer: [pick], explanation: `${neg} ≡ ${opts[0]}, which is rewrite ${pick}.` },
    { prompt: and ? `Multiples of both ${n(a)} and ${n(b)} are the multiples of ${n(L)}. How many are there from 1 to ${n(N)}?` : `There are ${n(ma)} multiples of ${n(a)} and ${n(mb)} multiples of ${n(b)} from 1 to ${n(N)}, and ${n(mab)} multiples of both. How many numbers are multiples of ${n(a)} or ${n(b)}, counting each once?`, answer: [inner], explanation: and ? `${n(N)} ÷ ${n(L)} gives ${n(mab)} whole multiples.` : `${n(ma)} + ${n(mb)} − ${n(mab)} = ${n(inner)}.` },
    { prompt: `Take those ${n(inner)} away from all ${n(N)} slots. How many are free?`, answer: [allowed], explanation: `${n(N)} − ${n(inner)} = ${n(allowed)}.` }
   ] }; }
});

/* ---- q13 Converse, inverse and contrapositive [CM 2.5] ---- */

mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The bay label rule',
 brief: 'A bay label rule has been copied onto the wall in three rewritten forms, and the dock supervisor wants to know which forms are as safe as the original.',
 labels: ['rule (1 or 0)', 'converse (1 or 0)', 'inverse (1 or 0)', 'contrapositive (1 or 0)'], tolerance: 0.01,
 gl: [['rule (1 or 0)'], ['converse (1 or 0)'], ['inverse (1 or 0)', 'contrapositive (1 or 0)']]
}, {
 canonical: { fam: 'low', a: 12, b: 7 },
 draw: R => { let p; do {
  const fam = R.pick(['low', 'most', 'mult', 'mult']);
  if (fam === 'mult') { const [a, b] = R.pick([[6, 3], [3, 6], [4, 6], [6, 4], [10, 4], [4, 10], [8, 4], [9, 6], [5, 15], [12, 8], [2, 6], [6, 9], [3, 12], [14, 7]]); p = { fam, a, b }; }
  else p = { fam, a: R.int(3, 14), b: R.int(3, 14) };
 } while (p.a === p.b || (p.fam === 'low' && p.a === 12 && p.b === 7)); return p; },
 build: ({ fam, a, b }) => { const mu = fam === 'mult', low = fam === 'low',
  P = mu ? `n is a multiple of ${n(a)}` : low ? `n < ${n(a)}` : `n ≤ ${n(a)}`, Q = mu ? `n is a multiple of ${n(b)}` : low ? `n < ${n(b)}` : `n ≤ ${n(b)}`,
  nP = mu ? `n is not a multiple of ${n(a)}` : low ? `n ≥ ${n(a)}` : `n > ${n(a)}`, nQ = mu ? `n is not a multiple of ${n(b)}` : low ? `n ≥ ${n(b)}` : `n > ${n(b)}`,
  rule = (mu ? a % b === 0 : a <= b) ? 1 : 0, conv = (mu ? b % a === 0 : b <= a) ? 1 : 0,
  /* a number that breaks the rule (when it is false): it makes P true and Q false; likewise for the converse */
  bw = mu ? a : low ? b : b + 1, cw = mu ? b : low ? a : a + 1;
  return {
   prompt: `A bay label rule says: “If ${P}, then ${Q}”, about every whole number n = 1, 2, 3 and so on. A rule like this is true (1) when no whole number breaks it, and false (0) when at least one does. Work out its converse, its inverse and its contrapositive. Enter 1 or 0 for the rule itself, then for its converse, then for its inverse, then for its contrapositive.`,
   answer: [rule, conv, conv, rule],
   hints: ['The converse swaps the two parts, the inverse puts ¬ on both parts, and the contrapositive does both. The opposite of “below” is “at least”, and the opposite of “at most” is “above”.',
    'A rule is true when no whole number breaks it. To break “if A, then B” you need a number that makes A true and B false. A rule and its contrapositive always share a truth value, and so do the converse and the inverse.'],
   solution: `The rule “If ${P}, then ${Q}” is ${rule ? 'true' : `false: n = ${n(bw)} breaks it`} (${rule}). Its contrapositive, “If ${nQ}, then ${nP}”, always has the same truth value, so it is ${rule ? 'true' : 'false'} (${rule}). The converse, “If ${Q}, then ${P}”, is ${conv ? 'true' : `false: n = ${n(cw)} breaks it`} (${conv}), and the inverse, “If ${nP}, then ${nQ}”, has the same truth value as the converse, so it is ${conv ? 'true' : 'false'} (${conv}) as well.`,
   guidance: [
    { prompt: `Is the rule “If ${P}, then ${Q}” true (1) or false (0)? Look for a whole number that makes the “if” part true and the “then” part false.`, answer: [rule], explanation: rule ? `Every n that satisfies “${P}” also satisfies “${Q}”, so no number breaks it.` : `n = ${n(bw)} satisfies “${P}” but not “${Q}”, so it breaks the rule.` },
    { prompt: `The converse swaps the parts: “If ${Q}, then ${P}”. Is it true (1) or false (0)?`, answer: [conv], explanation: conv ? `Every n that satisfies “${Q}” also satisfies “${P}”.` : `n = ${n(cw)} satisfies “${Q}” but not “${P}”, so it breaks the converse.` },
    { prompt: `The inverse is “If ${nP}, then ${nQ}” and the contrapositive is “If ${nQ}, then ${nP}”. Enter 1 or 0 for the inverse, then for the contrapositive.`, answer: [conv, rule], explanation: `The inverse is the contrapositive of the converse, so it matches the converse (${conv}). The contrapositive matches the rule (${rule}).` }
   ] }; }
});

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Misrouted by the converse',
 brief: 'A clerk has posted the swapped form of a routing rule on the wall, and Mira wants to know how many crates it would send to the wrong bay.',
 labels: ['smallest crate that breaks the converse', 'crates that break the converse', 'crates that break the inverse'], tolerance: 0.01,
 gl: [['smallest crate that breaks the converse'], ['crates that break the converse'], ['crates that break the inverse']]
}, {
 canonical: { b: 3, m: 4, N: 50 },
 draw: R => { let p; do { p = { b: R.int(2, 6), m: R.int(2, 4), N: R.int(40, 80) }; } while ((p.b === 3 && p.m === 4 && p.N === 50) || (p.b === 5 && p.m === 2)); return p; },
 build: ({ b, m, N }) => { const a = b * m, bad = range(1, N, x => x % b === 0 && x % a !== 0), smallest = bad[0]; return {
  prompt: `Crates are numbered 1 to ${n(N)}. The routing rule says: “If a crate number is a multiple of ${n(a)}, then it is a multiple of ${n(b)}.” A clerk posts its converse instead, and a second clerk posts its inverse. A crate breaks a statement when it makes the “if” part true and the “then” part false. Enter the smallest crate number that breaks the converse, then how many crates from 1 to ${n(N)} break the converse, then how many break the inverse.`,
  answer: [smallest, bad.length, bad.length],
  hints: ['Write the converse by swapping the two parts of the rule, and the inverse by putting “not” on both parts. Then look for crate numbers that make the “if” part true and the “then” part false.',
   'The inverse is the contrapositive of the converse, so the two statements are broken by exactly the same crates.'],
  solution: `The converse is “If a crate number is a multiple of ${n(b)}, then it is a multiple of ${n(a)}”. A crate breaks it when it is a multiple of ${n(b)} but not of ${n(a)}: the smallest is ${n(smallest)}. From 1 to ${n(N)} there are ${n(Math.floor(N / b))} multiples of ${n(b)}, and ${n(Math.floor(N / a))} of them are multiples of ${n(a)} too, so ${n(Math.floor(N / b))} − ${n(Math.floor(N / a))} = ${n(bad.length)} crates break the converse. The inverse, “If a crate number is not a multiple of ${n(a)}, then it is not a multiple of ${n(b)}”, is broken by the same crates, so it is also ${n(bad.length)}.`,
  guidance: [
   { prompt: `The converse is “If a crate number is a multiple of ${n(b)}, then it is a multiple of ${n(a)}”. What is the smallest crate number that makes the “if” part true and the “then” part false?`, answer: [smallest], explanation: `${n(smallest)} is a multiple of ${n(b)} but not of ${n(a)}.` },
   { prompt: `How many crates from 1 to ${n(N)} are multiples of ${n(b)} but not multiples of ${n(a)}?`, answer: [bad.length], explanation: `${n(Math.floor(N / b))} multiples of ${n(b)}, minus the ${n(Math.floor(N / a))} that are multiples of ${n(a)}: ${n(bad.length)}.` },
   { prompt: 'The inverse is the contrapositive of the converse. How many crates break the inverse?', answer: [bad.length], explanation: `A statement and its contrapositive are broken by exactly the same cases, so the answer is ${n(bad.length)} again.` }
  ] }; }
});

mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q12', title: 'The two-part door rule',
 brief: 'The new door rule has two conditions joined by “and”, and the supervisor needs its contrapositive and a check of the rule on the first sixty crates.',
 labels: ['number of the contrapositive', 'crates that break the rule', 'rule (1 or 0)'], tolerance: 0.01,
 gl: [['number of the contrapositive'], ['crates that break the rule'], ['rule (1 or 0)']]
}, {
 canonical: { a: 24, k: 5, b: 33, ord: 2 },
 draw: R => { let p; do {
  const k = R.int(3, 7), a = R.int(8, 40), t = R.bool();
  const b = t ? R.int(2, a) : R.int((Math.floor(a / k) + 1) * k, Math.min(a + 22, 58));
  p = { a, k, b, ord: R.int(0, 5) };
 } while (p.b < 2 || p.b > 58 || (p.a === 24 && p.k === 5 && p.b === 33)); return p; },
 build: ({ a, k, b, ord }) => { const bad = range(1, 60, x => x > a && x % k === 0 && x <= b), truth = bad.length ? 0 : 1,
  opts = [`If n ≤ ${n(b)}, then n ≤ ${n(a)} or n is not a multiple of ${n(k)}.`, `If n ≤ ${n(b)}, then n ≤ ${n(a)} and n is not a multiple of ${n(k)}.`, `If n > ${n(b)}, then n ≤ ${n(a)} or n is not a multiple of ${n(k)}.`],
  shown = ORD3[ord].map(i => opts[i]), pick = ORD3[ord].indexOf(0) + 1;
  return {
   prompt: `The door rule, about the whole numbers n from 1 to 60, says: “If n > ${n(a)} and n is a multiple of ${n(k)}, then n > ${n(b)}.” Which statement is its contrapositive? ${shown.map((s, i) => `Statement ${i + 1}: ${s}`).join(' ')} Enter the number of the contrapositive, then how many of the numbers from 1 to 60 break the rule, then 1 if the rule is true (nothing breaks it) or 0 if it is false.`,
   answer: [pick, bad.length, truth],
   hints: ['The contrapositive swaps the two parts and puts ¬ on each. For the part with “and”, use De Morgan’s laws: ¬(A ∧ B) is ¬A ∨ ¬B.',
    `A number breaks the rule when the whole “if” part is true and the “then” part is false: it must be above ${n(a)}, a multiple of ${n(k)}, and not above ${n(b)}.`],
   solution: `The “then” part is n > ${n(b)}, and its opposite is n ≤ ${n(b)}. The opposite of the “if” part, “n > ${n(a)} and n is a multiple of ${n(k)}”, is “n ≤ ${n(a)} or n is not a multiple of ${n(k)}” by De Morgan’s laws. So the contrapositive is “${opts[0].slice(0, -1)}”, statement ${pick}. A number breaks the rule when n > ${n(a)}, n is a multiple of ${n(k)} and n ≤ ${n(b)}: ${bad.length ? numList(bad) : 'there is none'}, so ${n(bad.length)} ${bad.length === 1 ? 'number breaks' : 'numbers break'} it and the rule is ${truth ? 'true (1)' : 'false (0)'}.`,
   guidance: [
    { prompt: `Swap the parts and negate both, using De Morgan’s laws on the “and”. Which statement is the contrapositive? ${shown.map((s, i) => `Statement ${i + 1}: ${s}`).join(' ')}`, answer: [pick], explanation: `The contrapositive is “${opts[0].slice(0, -1)}”, statement ${pick}.` },
    { prompt: `List the multiples of ${n(k)} above ${n(a)} that are at most ${n(b)} (and at most 60). How many numbers break the rule?`, answer: [bad.length], explanation: bad.length ? `${bad.length === 1 ? 'It is' : 'They are'} ${numList(bad)}: ${n(bad.length)} ${bad.length === 1 ? 'number' : 'numbers'}.` : `None: a number above ${n(a)} is never at most ${n(b)}, so 0 numbers.` },
    { prompt: 'Is the rule true (1) or false (0)? It is true when no number breaks it.', answer: [truth], explanation: truth ? 'Nothing breaks it, so it is true.' : `${n(bad.length)} ${bad.length === 1 ? 'number breaks' : 'numbers break'} it, so it is false.` }
   ] }; }
});

/* ---- q14 Negating a conditional: p ∧ ¬q [CM 2.6] ---- */

/* Greenhouse humidity log: rule "if humidity is above a, the vent is open". */
const dayEntry = ([v, o], i) => `day ${i + 1}, humidity ${n(v)}, vent ${o ? 'open' : 'closed'}`;
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The vent log',
 brief: 'The greenhouse vent is meant to open whenever the air is damp, and the gardeners want to know on how many logged days the rule was kept.',
 labels: ['days with humidity above the limit', 'days that broke the rule', 'days that obeyed the rule'], tolerance: 0.01,
 gl: [['days with humidity above the limit'], ['days that broke the rule'], ['days that obeyed the rule']]
}, {
 canonical: { a: 60, log: [[72, 1], [58, 0], [66, 0], [60, 1], [49, 1], [75, 0], [64, 1], [53, 0], [81, 1]] },
 draw: R => { let p; do {
  const a = R.int(55, 70), log = []; for (let i = 0; i < 9; i++) { let v; do { v = R.int(a - 14, a + 14); } while (v === a || log.some(e => e[0] === v)); log.push([v, R.int(0, 1)]); }
  log[R.int(0, 8)] = [a, R.int(0, 1)];
  p = { a, log };
 } while (!(() => { const hi = p.log.filter(e => e[0] > p.a), br = hi.filter(e => !e[1]).length, trap = p.log.filter(e => e[0] <= p.a && !e[1]).length; return hi.length >= 3 && hi.length <= 6 && br >= 1 && br <= 4 && trap >= 1; })() || p.a === 60); return p; },
 build: ({ a, log }) => { const hi = log.map((e, i) => e[0] > a ? i + 1 : 0).filter(Boolean), br = log.map((e, i) => e[0] > a && !e[1] ? i + 1 : 0).filter(Boolean), cyc = xs => xs.length === 1 ? `day ${xs[0]}` : `days ${andList(xs)}`; return {
  prompt: `Greenhouse rule: “If the humidity is above ${n(a)}, then the vent is open.” Log: ${log.map(dayEntry).join('; ')}. A day breaks the rule when its humidity is above ${n(a)} and the vent is closed. Enter how many days had humidity above ${n(a)}, then how many days broke the rule, then how many days obeyed it (every day that did not break it).`,
  answer: [hi.length, br.length, log.length - br.length],
  hints: ['The negation of “if p, then q” is “p and not q”: the humidity is above the limit and the vent is closed. Look at the days with high humidity first.',
   'A day with humidity at or below the limit cannot break the rule, whatever the vent did. A reading equal to the limit is not above it.'],
  solution: `The humidity was above ${n(a)} on ${cyc(hi)}: ${n(hi.length)} days. On ${cyc(br)} the vent was closed as well, so ${n(br.length)} ${br.length === 1 ? 'day broke' : 'days broke'} the rule. The log has ${n(log.length)} days, so ${n(log.length)} − ${n(br.length)} = ${n(log.length - br.length)} days obeyed it.`,
  guidance: [
   { prompt: `Which days have humidity above ${n(a)}, so that the “if” part is true? Enter how many.`, answer: [hi.length], explanation: `${cap(cyc(hi))}: ${n(hi.length)} days. A reading of exactly ${n(a)} is not above ${n(a)}.` },
   { prompt: 'Of those days, on how many was the vent closed? Each of those days broke the rule.', answer: [br.length], explanation: `${cap(cyc(br))}: ${n(br.length)}.` },
   { prompt: `The log has ${n(log.length)} days. A day obeys the rule unless it broke it. How many days obeyed it?`, answer: [log.length - br.length], explanation: `${n(log.length)} − ${n(br.length)} = ${n(log.length - br.length)}.` }
  ] }; }
});

/* Rovers and beacons: a fine per rule-breaker. */
const roverEntry = ([v, o], i) => `rover ${i + 1} at hour ${n(v)}, beacon ${o ? 'on' : 'off'}`;
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Fines for dark rovers',
 brief: 'Rovers that return late must keep their beacons on, and the garage office needs the fine for every rover that did not.',
 labels: ['rovers back after the hour', 'rovers that broke the rule', 'total fine in credits'], tolerance: 0.01,
 gl: [['rovers back after the hour'], ['rovers that broke the rule'], ['total fine in credits']]
}, {
 canonical: { h: 18, f: 15, log: [[19, 0], [16, 1], [21, 1], [18, 0], [22, 0], [15, 0], [20, 1], [23, 1], [17, 1], [19, 1]] },
 draw: R => { let p; do {
  const h = R.int(16, 20), log = []; for (let i = 0; i < 10; i++) log.push([R.int(h - 4, h + 5), R.int(0, 1)]);
  log[R.int(0, 9)] = [h, 0];
  p = { h, f: R.int(5, 20), log };
 } while (!(() => { const late = p.log.filter(e => e[0] > p.h), br = late.filter(e => !e[1]).length, trap = p.log.filter(e => e[0] <= p.h && !e[1]).length; return late.length >= 3 && br >= 1 && br <= 4 && br < late.length && trap >= 1; })() || (p.h === 18 && p.f === 15)); return p; },
 build: ({ h, f, log }) => { const late = log.filter(e => e[0] > h).length, br = log.filter(e => e[0] > h && !e[1]).length, fine = br * f; return {
  prompt: `Garage rule: “If a rover returns after hour ${n(h)}, then its beacon is on.” A rover that breaks the rule is fined ${n(f)} credits. Returns: ${log.map(roverEntry).join('; ')}. Enter how many rovers returned after hour ${n(h)}, then how many of them had the beacon off, then the total fine in credits.`,
  answer: [late, br, fine],
  hints: ['The rule is broken only when both things happen: the rover is back after the hour and its beacon is off. A rover back at or before the hour is never fined.',
   'Count the late rovers first, then pick out the ones with the beacon off. Multiply that count by the fine for one rover.'],
  solution: `${n(late)} rovers returned after hour ${n(h)}. The rule is broken by those with the beacon off, which makes “after hour ${n(h)} and beacon off” true: ${n(br)} ${br === 1 ? 'rover' : 'rovers'}. The total fine is ${n(br)} × ${n(f)} = ${n(fine)} credits.`,
  guidance: [
   { prompt: `How many rovers returned after hour ${n(h)}? A rover back at hour ${n(h)} exactly is not after it.`, answer: [late], explanation: `${n(late)} rovers are in the log with an hour above ${n(h)}.` },
   { prompt: 'Of those rovers, how many had the beacon off? They are the rule-breakers.', answer: [br], explanation: `${n(br)} ${br === 1 ? 'rover' : 'rovers'} came back late with the beacon off.` },
   { prompt: `Each rule-breaker is fined ${n(f)} credits. What is the total fine?`, answer: [fine], explanation: `${n(br)} × ${n(f)} = ${n(fine)}.` }
  ] }; }
});

/* The rule, its converse and the cases where both hold. */
const sampleEntry = ([v, o], i) => `sample ${i + 1}, ${n(v)} degrees, seal ${o ? 'intact' : 'broken'}`;
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13', title: 'Rule and converse in the cold store',
 brief: 'The cold store keeps a rule about seals, and someone has posted its converse beside it, so the auditor wants to know which samples break each of them.',
 labels: ['samples that break the rule', 'samples that break the converse', 'samples that keep both'], tolerance: 0.01,
 gl: [['samples that break the rule'], ['samples that break the converse'], ['samples that keep both']]
}, {
 canonical: { a: 8, log: [[5, 1], [9, 1], [7, 0], [12, 0], [8, 1], [3, 1], [10, 1], [6, 0], [11, 0], [4, 1], [13, 1], [2, 1]] },
 draw: R => { let p; do {
  const a = R.int(6, 11), log = []; for (let i = 0; i < 12; i++) log.push([R.int(a - 3, a + 5), R.int(0, 1)]);
  log[R.int(0, 11)] = [a, 1];
  p = { a, log };
 } while (!(() => { const rb = p.log.filter(e => e[0] < p.a && !e[1]).length, cb = p.log.filter(e => e[0] >= p.a && e[1]).length; return rb >= 1 && rb <= 4 && cb >= 1 && cb <= 5; })() || p.a === 8); return p; },
 build: ({ a, log }) => { const rb = log.filter(e => e[0] < a && !e[1]).length, cb = log.filter(e => e[0] >= a && e[1]).length, both = log.length - rb - cb; return {
  prompt: `Cold store rule: “If a sample’s temperature is below ${n(a)} degrees, then its seal is intact.” Beside it someone has posted its converse: “If a sample’s seal is intact, then its temperature is below ${n(a)} degrees.” A sample breaks a statement when it makes the “if” part true and the “then” part false. Log: ${log.map(sampleEntry).join('; ')}. Enter how many samples break the rule, how many break the converse, and how many samples keep both, breaking neither.`,
  answer: [rb, cb, both],
  hints: ['A statement “if p, then q” is broken exactly by the cases with p true and q false. Do it once for the rule and once for the converse, whose parts are swapped.',
   'No sample can break both: the rule needs a cold sample with a broken seal, the converse needs an intact seal at or above the limit. So the samples that keep both are the rest of the log.'],
  solution: `The rule is broken by samples below ${n(a)} degrees with a broken seal: ${n(rb)}. The converse is broken by samples with an intact seal that are not below ${n(a)} degrees: ${n(cb)}. No sample is in both groups, so ${n(rb)} + ${n(cb)} = ${n(rb + cb)} samples break at least one, and ${n(log.length)} − ${n(rb + cb)} = ${n(both)} keep both.`,
  guidance: [
   { prompt: `The rule is broken by a sample below ${n(a)} degrees whose seal is broken. How many samples are like that?`, answer: [rb], explanation: `${n(rb)} ${rb === 1 ? 'sample' : 'samples'}.` },
   { prompt: `The converse is broken by a sample whose seal is intact but whose temperature is not below ${n(a)} (a sample at exactly ${n(a)} is not below it). How many samples are like that?`, answer: [cb], explanation: `${n(cb)} ${cb === 1 ? 'sample' : 'samples'}.` },
   { prompt: `The log has ${n(log.length)} samples, and none is in both groups of breakers. How many samples break neither statement?`, answer: [both], explanation: `${n(log.length)} − ${n(rb)} − ${n(cb)} = ${n(both)}.` }
  ] }; }
});

/* ---- q15 Quantifiers ∀ and ∃ over a printed domain [CM 2.1, Levin 0.2] ---- */

const XC = {
 gt: { t: c => `x > ${n(c)}`, nt: c => `x ≤ ${n(c)}`, f: (x, c) => x > c },
 lt: { t: c => `x < ${n(c)}`, nt: c => `x ≥ ${n(c)}`, f: (x, c) => x < c },
 mult: { t: c => `x is a multiple of ${n(c)}`, nt: c => `x is not a multiple of ${n(c)}`, f: (x, c) => x % c === 0 },
 even: { t: () => 'x is even', nt: () => 'x is odd', f: x => x % 2 === 0 },
 odd: { t: () => 'x is odd', nt: () => 'x is even', f: x => x % 2 === 1 }
};
const xt = o => XC[o.k].t(o.c), xn = o => XC[o.k].nt(o.c), xf = (o, x) => XC[o.k].f(x, o.c);
const xDraw = (R, kinds) => { const k = R.pick(kinds); return { k, c: k === 'gt' ? R.int(5, 25) : k === 'lt' ? R.int(12, 35) : k === 'mult' ? R.int(3, 7) : 0 }; };
const distinct = (R, k, lo, hi) => { const s = new Set(); while (s.size < k) s.add(R.int(lo, hi)); return [...s].sort((x, y) => x - y); };

mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'Drill sizes on the rack',
 brief: 'The tool store holds drills of a fixed list of sizes, and the stores computer must check one claim about every size and another about at least one.',
 labels: ['claim A (1 or 0)', 'sizes that fail claim A', 'claim B (1 or 0)', 'sizes that make claim B true'], tolerance: 0.01,
 gl: [['sizes that fail claim A'], ['claim A (1 or 0)'], ['sizes that make claim B true', 'claim B (1 or 0)']]
}, {
 canonical: { dom: [3, 6, 8, 11, 14, 17, 20, 25], A: { k: 'lt', c: 21 }, Bc: { k: 'mult', c: 7 } },
 draw: R => { let p; do {
  const dom = distinct(R, 8, 2, 40); p = { dom, A: xDraw(R, ['gt', 'lt', 'mult', 'even', 'odd']), Bc: xDraw(R, ['gt', 'lt', 'mult', 'even', 'odd']) };
 } while (!(() => { const f = p.dom.filter(x => !xf(p.A, x)).length, w = p.dom.filter(x => xf(p.Bc, x)).length; return f <= 4 && w <= 5 && (f > 0 || p.A.k !== 'even') && !(p.A.k === p.Bc.k && p.A.c === p.Bc.c); })() || p.dom.join() === '3,6,8,11,14,17,20,25'); return p; },
 build: ({ dom, A: a, Bc: b }) => { const fails = dom.filter(x => !xf(a, x)), wit = dom.filter(x => xf(b, x)), At = fails.length ? 0 : 1, Bt = wit.length ? 1 : 0; return {
  prompt: `A rack in the tool store holds drills of the sizes in its domain, the list ${numList(dom)}. Claim A: ∀x (${xt(a)}). Claim B: ∃x (${xt(b)}). Enter 1 or 0 for claim A, then how many sizes in the list fail claim A, then 1 or 0 for claim B, then how many sizes in the list make claim B true.`,
  answer: [At, fails.length, Bt, wit.length],
  hints: ['Test every size in the list against each claim. A ∀ claim needs every size to pass, and one size that fails makes it false.',
   'An ∃ claim needs at least one size that passes. Each size that passes is a witness, so the count of sizes that make claim B true is its number of witnesses.'],
  solution: `For claim A, ${fails.length ? `the sizes that fail “${xt(a)}” are ${numList(fails)}: ${n(fails.length)} ${fails.length === 1 ? 'size' : 'sizes'}` : `no size fails “${xt(a)}”`}, so claim A is ${At ? 'true (1), because every size passes' : 'false (0), because at least one size fails'}. For claim B, ${wit.length ? `the sizes that pass “${xt(b)}” are ${numList(wit)}: ${n(wit.length)} ${wit.length === 1 ? 'witness' : 'witnesses'}` : `no size passes “${xt(b)}”: 0 witnesses`}, so claim B is ${Bt ? 'true (1)' : 'false (0)'}${Bt ? '' : ', because it has no witness'}.`,
  guidance: [
   { prompt: `Test each size in ${numList(dom)} against “${xt(a)}”. How many sizes fail it?`, answer: [fails.length], explanation: fails.length ? `The sizes that fail are ${numList(fails)}: ${n(fails.length)}.` : 'Every size passes, so 0 fail.' },
   { prompt: 'Claim A says that every size passes. Is claim A true (1) or false (0)?', answer: [At], explanation: At ? 'No size fails, so ∀x holds.' : 'At least one size fails, so ∀x does not hold.' },
   { prompt: `Now test each size against “${xt(b)}”. How many make it true, and so is claim B true (1) or false (0)? Enter the count, then 1 or 0.`, answer: [wit.length, Bt], explanation: wit.length ? `The witnesses are ${numList(wit)}: ${n(wit.length)}. One witness is enough, so claim B is true.` : 'There is no witness, so claim B is false.' }
  ] }; }
});

mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Pallets for the cargo lift',
 brief: 'The cargo lift may run only if every pallet on its list is light enough, and each pallet that fails has to be re-weighed at a fee.',
 labels: ['pallets that fail', 'claim (1 or 0)', 'total re-weigh fee in credits'], tolerance: 0.01,
 gl: [['pallets that fail'], ['claim (1 or 0)'], ['total re-weigh fee in credits']]
}, {
 canonical: { dom: [18, 24, 31, 37, 42, 48, 55, 63], L: 50, f: 6 },
 draw: R => { let p; do {
  const dom = distinct(R, 8, 12, 70), k = R.pick([0, 1, 1, 2, 2, 3, 4]), L = k === 0 ? dom[7] + R.int(1, 6) : R.int(dom[7 - k] + 1, dom[8 - k]);
  p = { dom, L, f: R.int(3, 12) };
 } while (p.L === 50 && p.f === 6); return p; },
 build: ({ dom, L, f }) => { const fails = dom.filter(x => x >= L), claim = fails.length ? 0 : 1, fee = fails.length * f; return {
  prompt: `The cargo lift may run only if every pallet on its list weighs less than ${n(L)} kg, the claim ∀x (x < ${n(L)}). The pallets in the domain weigh ${numList(dom)} kg. Each pallet that fails the test is re-weighed at a fee of ${n(f)} credits. Enter how many pallets fail the test, then 1 or 0 for whether the ∀ claim is true, then the total re-weigh fee in credits.`,
  answer: [fails.length, claim, fee],
  hints: ['A pallet fails when it does not weigh less than the limit, so a pallet weighing exactly the limit fails too. Test every pallet in the list.',
   'A ∀ claim is true only when no pallet fails. Then multiply the number of failing pallets by the fee for one.'],
  solution: `${fails.length ? `The pallets that do not weigh less than ${n(L)} kg are ${numList(fails)}: ${n(fails.length)}.` : `Every pallet weighs less than ${n(L)} kg, so 0 fail.`} ${claim ? 'None fails, so the claim ∀x (x < ' + n(L) + ') is true (1).' : `At least one fails, so the claim ∀x (x < ${n(L)}) is false (0).`} The fee is ${n(fails.length)} × ${n(f)} = ${n(fee)} credits.`,
  guidance: [
   { prompt: `Test each pallet in ${numList(dom)} against “x < ${n(L)}”. How many fail?`, answer: [fails.length], explanation: fails.length ? `The failing pallets are ${numList(fails)}: ${n(fails.length)}.` : 'Every pallet passes, so 0 fail.' },
   { prompt: 'The claim says every pallet passes. Is it true (1) or false (0)?', answer: [claim], explanation: claim ? 'No pallet fails, so the claim holds.' : 'At least one pallet fails, so the claim is false.' },
   { prompt: `Each failing pallet costs ${n(f)} credits to re-weigh. What is the total fee?`, answer: [fee], explanation: `${n(fails.length)} × ${n(f)} = ${n(fee)}.` }
  ] }; }
});

mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q12', title: 'Two-part shelf claims',
 brief: 'The stores computer now checks claims made of two parts, and the clerk must find which shelves fail the “for every” claim and which satisfy the “there is” claim.',
 labels: ['claim A (1 or 0)', 'shelves that fail claim A', 'claim B (1 or 0)', 'witnesses for claim B'], tolerance: 0.01,
 gl: [['shelves that fail claim A'], ['witnesses for claim B'], ['claim A (1 or 0)', 'claim B (1 or 0)']]
}, {
 canonical: { dom: [3, 5, 8, 10, 13, 16, 19, 22, 27, 31], A1: { k: 'gt', c: 4 }, A2: { k: 'even', c: 0 }, B1: { k: 'lt', c: 20 }, B2: { k: 'mult', c: 4 } },
 draw: R => { let p; do {
  p = { dom: distinct(R, 10, 2, 40), A1: xDraw(R, ['gt', 'lt']), A2: xDraw(R, ['even', 'odd', 'mult']), B1: xDraw(R, ['gt', 'lt']), B2: xDraw(R, ['even', 'odd', 'mult']) };
 } while (!(() => { const f = p.dom.filter(x => !(xf(p.A1, x) || xf(p.A2, x))).length, w = p.dom.filter(x => xf(p.B1, x) && xf(p.B2, x)).length; return f <= 4 && w <= 5; })() || p.dom.join() === '3,5,8,10,13,16,19,22,27,31'); return p; },
 build: ({ dom, A1, A2, B1, B2 }) => { const fails = dom.filter(x => !(xf(A1, x) || xf(A2, x))), wit = dom.filter(x => xf(B1, x) && xf(B2, x)), At = fails.length ? 0 : 1, Bt = wit.length ? 1 : 0; return {
  prompt: `The stores computer checks claims made of two parts. The shelf numbers in its domain are ${numList(dom)}. Claim A: ∀x (${xt(A1)} or ${xt(A2)}). Claim B: ∃x (${xt(B1)} and ${xt(B2)}). Enter 1 or 0 for claim A, then how many shelves fail claim A, then 1 or 0 for claim B, then how many witnesses claim B has.`,
  answer: [At, fails.length, Bt, wit.length],
  hints: [`A shelf fails claim A when “${xt(A1)} or ${xt(A2)}” is false. By De Morgan’s laws that happens exactly when both parts are false: “${xn(A1)} and ${xn(A2)}”.`,
   'A witness for claim B is a shelf that makes both parts true. A shelf that passes only one of the two parts is not a witness.'],
  solution: `A shelf fails claim A when “${xt(A1)} or ${xt(A2)}” is false, which by De Morgan’s laws means “${xn(A1)} and ${xn(A2)}”: ${fails.length ? numList(fails) : 'no shelf is like that'}, ${n(fails.length)} ${fails.length === 1 ? 'shelf' : 'shelves'}. So claim A is ${At ? 'true (1)' : 'false (0)'}. The witnesses for claim B pass “${xt(B1)}” and “${xt(B2)}” together: ${wit.length ? numList(wit) : 'no shelf passes both'}, ${n(wit.length)} ${wit.length === 1 ? 'witness' : 'witnesses'}, so claim B is ${Bt ? 'true (1)' : 'false (0)'}.`,
  guidance: [
   { prompt: `A shelf fails claim A exactly when “${xn(A1)}” and “${xn(A2)}” are both true. How many shelves in ${numList(dom)} are like that?`, answer: [fails.length], explanation: fails.length ? `They are ${numList(fails)}: ${n(fails.length)}.` : 'No shelf makes both true, so 0 fail.' },
   { prompt: `How many shelves in the list make both “${xt(B1)}” and “${xt(B2)}” true? Those are the witnesses for claim B.`, answer: [wit.length], explanation: wit.length ? `They are ${numList(wit)}: ${n(wit.length)}.` : 'No shelf makes both true, so there are none.' },
   { prompt: 'Claim A needs every shelf to pass, and claim B needs at least one witness. Enter 1 or 0 for claim A, then for claim B.', answer: [At, Bt], explanation: `Claim A is ${At ? 'true: no shelf fails' : 'false: at least one shelf fails'}. Claim B is ${Bt ? 'true: it has a witness' : 'false: it has no witness'}.` }
  ] }; }
});

})();
