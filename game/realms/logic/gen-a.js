/* Logic and proof mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Truth values: 1 for true, 0 for false; words for the solutions. */
const TV = b => b ? 1 : 0;
const word = b => b ? 'true' : 'false';
const TF = b => b ? 'T' : 'F';
/* "1 row", "3 rows": never "1 rows". */
/* "2, 5 and 7" */
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
/* A list of whole numbers; a run of five or more in a row is written "the numbers from 15 to 35". */
const runs = xs => xs.length >= 5 && xs.every((x, i) => i === 0 || x === xs[i - 1] + 1) ? `the numbers from ${n(xs[0])} to ${n(xs[xs.length - 1])}` : xs.map(n).join(', ');
/* Conditions on a whole number n: { t: 'gt' | 'lt' | 'mul', v }. */
const cond = c => c.t === 'gt' ? `n is greater than ${n(c.v)}` : c.t === 'lt' ? `n is less than ${n(c.v)}` : `n is a multiple of ${n(c.v)}`;
const holds = (c, x) => c.t === 'gt' ? x > c.v : c.t === 'lt' ? x < c.v : x % c.v === 0;
const upTo = N => Array.from({ length: N }, (_, i) => i + 1);
const countIf = (N, f) => upTo(N).filter(f).length;
const drawCond = (R, t, N) => t === 'gt' ? { t, v: R.int(4, Math.floor(N / 2)) } : t === 'lt' ? { t, v: R.int(Math.ceil(N / 2), N - 3) } : { t, v: R.int(3, 6) };
/* Compound statements as trees: a letter 'p', ['not', A], or [op, A, B] with op 'and', 'or', 'imp', 'iff'. */
const SYM = { and: '∧', or: '∨', imp: '→', iff: '↔' };
const show = (f, top = true) => typeof f === 'string' ? f : f[0] === 'not' ? '¬' + show(f[1], false)
 : (top ? '' : '(') + show(f[1], false) + ' ' + SYM[f[0]] + ' ' + show(f[2], false) + (top ? '' : ')');
const ev = (f, v) => typeof f === 'string' ? v[f] : f[0] === 'not' ? !ev(f[1], v) : f[0] === 'and' ? ev(f[1], v) && ev(f[2], v)
 : f[0] === 'or' ? ev(f[1], v) || ev(f[2], v) : f[0] === 'imp' ? !ev(f[1], v) || ev(f[2], v) : ev(f[1], v) === ev(f[2], v);
const lettersOf = (...fs) => { const s = new Set(); const walk = f => { if (typeof f === 'string') s.add(f); else f.slice(1).forEach(walk); }; fs.forEach(walk); return ['p', 'q', 'r', 's', 't'].filter(x => s.has(x)); };
/* The rows of a truth table in the standard order: the first letter is T on the top half, the last letter alternates. */
const rowsOf = letters => Array.from({ length: 2 ** letters.length }, (_, i) => { const v = {}; letters.forEach((x, j) => { v[x] = ((i >> (letters.length - 1 - j)) & 1) === 0; }); return v; });
const caseText = (letters, v) => letters.map(x => TF(v[x])).join('');
/* Replace the placeholders A, B, C in a template tree by letters. */
const sub = (f, m) => typeof f === 'string' ? m[f] : [f[0], ...f.slice(1).map(g => sub(g, m))];
const OPS = ['and', 'or', 'imp', 'iff'];
const lit = (R, x) => R.next() < 0.3 ? ['not', x] : x;
const perm3 = R => { const a = ['p', 'q', 'r']; for (let i = 2; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const randomTree3 = R => { const [x, y, z] = perm3(R); const inner = [R.pick(OPS), lit(R, x), lit(R, y)], part = R.next() < 0.2 ? ['not', inner] : inner, op = R.pick(OPS);
 return R.bool() ? [op, part, lit(R, z)] : [op, lit(R, z), part]; };
const randomTree2 = R => { const x = R.pick(['p', 'q']), [y, z] = R.bool() ? ['p', 'q'] : ['q', 'p']; return [R.pick(OPS), lit(R, x), [R.pick(OPS), lit(R, y), lit(R, z)]]; };
/* q09: shapes that are true on every row, false on every row, or neither. */
const TAUT = [['or', 'A', ['not', 'A']], ['imp', ['and', 'A', 'B'], 'A'], ['imp', 'A', ['or', 'A', 'B']], ['not', ['and', 'A', ['not', 'A']]],
 ['or', ['imp', 'A', 'B'], ['imp', 'B', 'A']], ['imp', ['and', ['imp', 'A', 'B'], 'A'], 'B'], ['imp', ['and', 'A', 'B'], ['or', 'A', 'B']], ['or', ['iff', 'A', 'B'], ['iff', 'A', ['not', 'B']]]];
const CONTRA = [['and', 'A', ['not', 'A']], ['and', ['and', 'A', 'B'], ['not', 'B']], ['not', ['or', 'A', ['not', 'A']]], ['and', ['iff', 'A', 'B'], ['iff', 'A', ['not', 'B']]], ['and', ['imp', 'A', 'B'], ['and', 'A', ['not', 'B']]]];
/* q10: pairs that agree on every row, and pairs that look alike but do not. */
const PAIRS = [
 [['imp', 'A', 'B'], ['or', ['not', 'A'], 'B']], [['imp', 'A', 'B'], ['imp', ['not', 'B'], ['not', 'A']]], [['not', ['and', 'A', 'B']], ['or', ['not', 'A'], ['not', 'B']]],
 [['not', ['or', 'A', 'B']], ['and', ['not', 'A'], ['not', 'B']]], [['iff', 'A', 'B'], ['and', ['imp', 'A', 'B'], ['imp', 'B', 'A']]],
 [['and', 'A', ['or', 'B', 'C']], ['or', ['and', 'A', 'B'], ['and', 'A', 'C']]], [['or', 'A', ['and', 'B', 'C']], ['and', ['or', 'A', 'B'], ['or', 'A', 'C']]],
 [['imp', 'A', 'B'], ['imp', 'B', 'A']], [['imp', 'A', 'B'], ['imp', ['not', 'A'], ['not', 'B']]], [['not', ['and', 'A', 'B']], ['and', ['not', 'A'], ['not', 'B']]],
 [['not', ['or', 'A', 'B']], ['or', ['not', 'A'], ['not', 'B']]], [['and', 'A', ['or', 'B', 'C']], ['or', ['and', 'A', 'B'], 'C']], [['imp', 'A', ['imp', 'B', 'C']], ['imp', ['imp', 'A', 'B'], 'C']],
 [['iff', 'A', 'B'], ['iff', ['not', 'A'], ['not', 'B']]], [['or', 'A', 'B'], ['iff', 'A', ['not', 'B']]]
];
/* Count the rows of a table where f is true, with a short row-by-row record. */
const table = (letters, ...fs) => rowsOf(letters).map(v => fs.map(f => ev(f, v)));
const parts = f => typeof f === 'string' || f[0] === 'not' ? null : [f[1], f[2]];

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Three sentences about numbers: "a is greater than b × c", "d + e equals f", "g is less than h − i". Each is true or
    false at random; a false one is sometimes false only because the two sides are equal (or, for the sum, off by ten). */
 q01: {
  canonical: { a: 17, b: 3, c: 6, d: 28, e: 15, f: 43, g: 9, h: 31, i: 24 },
  draw: R => { let p; do {
   const b = R.int(3, 9), c = R.int(3, 9), bc = b * c, d = R.int(12, 49), e = R.int(12, 49), h = R.int(25, 70), i = R.int(6, h - 8), hi = h - i;
   const m = () => R.bool() ? 0 : R.int(1, 2), m1 = m(), m2 = m(), m3 = m();
   p = { a: m1 === 0 ? bc + R.int(1, 3) : m1 === 1 ? bc : bc - R.int(1, 3), b, c, d, e, f: m2 === 0 ? d + e : d + e + R.pick([-10, -1, 1, 10]), g: m3 === 0 ? hi - R.int(1, 4) : m3 === 1 ? hi : hi + R.int(1, 4), h, i };
  } while (p.b === 4 && p.c === 7); return p; },
  build: ({ a, b, c, d, e, f, g, h, i }) => { const bc = b * c, de = d + e, hi = h - i, t1 = a > bc, t2 = de === f, t3 = g < hi;
   const cmp = (x, y) => x > y ? 'greater than' : x === y ? 'equal to' : 'less than'; return {
   prompt: `The airlock computer shows three sentences. Sentence 1: “${n(a)} is greater than ${n(b)} × ${n(c)}.” Sentence 2: “${n(d)} + ${n(e)} equals ${n(f)}.” Sentence 3: “${n(g)} is less than ${n(h)} − ${n(i)}.” Each one is a statement. Enter the value of ${n(b)} × ${n(c)} first. Then enter the truth value of each sentence in order, typing 1 for true and 0 for false.`,
   answer: [bc, TV(t1), TV(t2), TV(t3)],
   hints: ['Work out the calculation in each sentence first, then compare the two sides.', '“Greater than” and “less than” are both false when the two sides are equal.'],
   solution: `${n(b)} × ${n(c)} = ${n(bc)}, and ${n(a)} is ${cmp(a, bc)} ${n(bc)}, so sentence 1 is ${word(t1)}: ${TV(t1)}. ${n(d)} + ${n(e)} = ${n(de)}, ${t2 ? 'the same as' : 'not'} ${n(f)}, so sentence 2 is ${word(t2)}: ${TV(t2)}. ${n(h)} − ${n(i)} = ${n(hi)}, and ${n(g)} is ${cmp(g, hi)} ${n(hi)}, so sentence 3 is ${word(t3)}: ${TV(t3)}.`,
   guidance: [
    { prompt: `Sentence 1 compares ${n(a)} with ${n(b)} × ${n(c)}. What is ${n(b)} × ${n(c)}, and is the sentence true (1) or false (0)?`, answer: [bc, TV(t1)], explanation: `${n(b)} × ${n(c)} = ${n(bc)}. ${n(a)} is ${cmp(a, bc)} ${n(bc)}, so the sentence is ${word(t1)}.` },
    { prompt: `Sentence 2 says ${n(d)} + ${n(e)} equals ${n(f)}. What is ${n(d)} + ${n(e)}, and is the sentence true (1) or false (0)?`, answer: [de, TV(t2)], explanation: `${n(d)} + ${n(e)} = ${n(de)}, ${t2 ? 'the same as' : 'not'} ${n(f)}, so the sentence is ${word(t2)}.` },
    { prompt: `Sentence 3 compares ${n(g)} with ${n(h)} − ${n(i)}. What is ${n(h)} − ${n(i)}, and is the sentence true (1) or false (0)?`, answer: [hi, TV(t3)], explanation: `${n(h)} − ${n(i)} = ${n(hi)}. ${n(g)} is ${cmp(g, hi)} ${n(hi)}, so the sentence is ${word(t3)}.` }
   ] }; }
 },
 /* p: "the tank holds more than k litres" (kind 'more') or "less than k litres" (kind 'less'); six distinct readings.
    For 'more' the second answer is the largest reading with ¬p true (reading ≤ k); for 'less' the smallest (reading ≥ k).
    The log always has readings on both sides, and often k itself. */
 q02: {
  canonical: { kind: 'more', k: 46, log: [52, 46, 39, 48, 44, 57] },
  draw: R => { const kind = R.pick(['more', 'less']), k = R.int(30, 80); let log;
   do { const set = new Set(R.next() < 0.6 ? [k] : []); while (set.size < 6) set.add(k + R.int(-12, 12)); log = [...set];
    for (let i = 5; i > 0; i--) { const j = R.int(0, i); [log[i], log[j]] = [log[j], log[i]]; }
    const want = R.bool(), at = log.findIndex(x => (kind === 'more' ? x <= k : x >= k) === want); if (at > 0) [log[0], log[at]] = [log[at], log[0]];
   } while (!log.some(x => x > k) || !log.some(x => x < k)); return { kind, k, log }; },
  build: ({ kind, k, log }) => { const more = kind === 'more', p = x => more ? x > k : x < k, np = x => !p(x), r0 = log[0],
   ok = log.filter(np), ans = more ? Math.max(...ok) : Math.min(...ok), rel = more ? 'more than' : 'less than', want = more ? 'largest' : 'smallest',
   means = more ? `${n(k)} litres or fewer` : `${n(k)} litres or more`; return {
   prompt: `The water tank rule p says: “The tank holds ${rel} ${n(k)} litres.” Its negation ¬p says: “The tank holds not ${rel} ${n(k)} litres.” Today’s log shows these readings, in litres: ${log.map(n).join(', ')}. Enter the truth value of ¬p for the first reading (1 for true, 0 for false). Then enter the ${want} reading in the log that makes ¬p true.`,
   answer: [TV(np(r0)), ans],
   hints: ['¬p is true exactly when p is false. Decide p for a reading first, then flip it.', `A reading of exactly ${n(k)} litres is not ${rel} ${n(k)}, so it makes ¬p true.`],
   solution: `For the first reading, ${n(r0)} litres, p is ${word(p(r0))}, so ¬p is ${word(np(r0))}: ${TV(np(r0))}. ¬p means the tank holds ${means}. The readings that make ¬p true are ${ok.map(n).join(', ')}, and the ${want} of them is ${n(ans)} litres.`,
   guidance: [
    { prompt: `The first reading is ${n(r0)} litres. Is p, “the tank holds ${rel} ${n(k)} litres”, true (1) or false (0) for it? Then what is ¬p?`, answer: [TV(p(r0)), TV(np(r0))], explanation: `${n(r0)} is ${p(r0) ? '' : 'not '}${rel} ${n(k)}, so p is ${word(p(r0))} and ¬p, its opposite, is ${word(np(r0))}.` },
    { prompt: `¬p means the tank holds ${means}. How many of the six readings make ¬p true?`, answer: [ok.length], explanation: `The readings ${ok.map(n).join(', ')} are ${means}: ${pl(ok.length, 'reading')}.` },
    { prompt: `Which is the ${want} of those readings?`, answer: [ans], explanation: `Of ${ok.map(n).join(', ')}, the ${want} is ${n(ans)}.` }
   ] }; }
 },
 /* p ∧ q for two conditions on a code n, tested on one code x, then counted over 1 to N. */
 q03: {
  canonical: { p: { t: 'gt', v: 7 }, q: { t: 'mul', v: 4 }, x: 12, N: 30 },
  draw: R => { let o; do { const N = R.int(20, 40), [s, t] = R.pick([['gt', 'lt'], ['gt', 'mul'], ['lt', 'mul'], ['mul', 'gt'], ['mul', 'lt']]);
   o = { p: drawCond(R, s, N), q: drawCond(R, t, N), N }; const yes = R.bool(), pool = upTo(N).filter(y => (holds(o.p, y) && holds(o.q, y)) === yes); o.x = pool.length ? R.pick(pool) : 1;
   } while (countIf(o.N, y => holds(o.p, y) && holds(o.q, y)) < 2 || (o.p.t === 'gt' && o.q.t === 'mul' && o.p.v === 5 && o.q.v === 3)); return o; },
  build: ({ p, q, x, N }) => { const px = holds(p, x), qx = holds(q, x), cp = countIf(N, y => holds(p, y)), both = upTo(N).filter(y => holds(p, y) && holds(q, y)); return {
   prompt: `The airlock accepts a code number n only when p ∧ q is true, where p is “${cond(p)}” and q is “${cond(q)}”. Enter the truth value of p ∧ q for the code ${n(x)} (1 for true, 0 for false). Then enter how many whole numbers from 1 to ${n(N)} make p ∧ q true.`,
   answer: [TV(px && qx), both.length],
   hints: ['p ∧ q is true only when p and q are both true. One false part makes the whole statement false.', `Go through the numbers from 1 to ${n(N)} that make p true, and keep only those that also make q true.`],
   solution: `For ${n(x)}: p is ${word(px)} and q is ${word(qx)}, so p ∧ q is ${word(px && qx)}: ${TV(px && qx)}. From 1 to ${n(N)}, p is true for ${pl(cp, 'number')}, and the ones that also make q true are ${runs(both)}. That is ${pl(both.length, 'number')}.`,
   guidance: [
    { prompt: `Take the code ${n(x)}. Is p true (1) or false (0)? Is q?`, answer: [TV(px), TV(qx)], explanation: `p, “${cond(p)}”, is ${word(px)} for ${n(x)}, and q, “${cond(q)}”, is ${word(qx)}. So p ∧ q is ${word(px && qx)}.` },
    { prompt: `How many whole numbers from 1 to ${n(N)} make p true?`, answer: [cp], explanation: `p, “${cond(p)}”, holds for ${pl(cp, 'number')} from 1 to ${n(N)}.` },
    { prompt: `Of those, how many also make q true?`, answer: [both.length], explanation: `Both parts hold for ${runs(both)}, which is ${pl(both.length, 'number')}.` }
   ] }; }
 },
 /* p ∨ q (inclusive) counted over 1 to N; the overlap is counted once. */
 q04: {
  canonical: { p: { t: 'lt', v: 9 }, q: { t: 'mul', v: 5 }, N: 40 },
  draw: R => { let o; do { const N = R.int(20, 45), [s, t] = R.pick([['lt', 'gt'], ['lt', 'mul'], ['gt', 'mul'], ['mul', 'lt'], ['mul', 'gt']]);
   o = { p: drawCond(R, s, N), q: drawCond(R, t, N), N };
   if (s === 'lt' && t === 'gt') o.p.v = R.int(4, Math.floor(N / 2) - 2);
   } while (countIf(o.N, y => holds(o.p, y) || holds(o.q, y)) >= o.N || (o.p.t === 'lt' && o.q.t === 'mul' && o.p.v === 6 && o.q.v === 4)); return o; },
  build: ({ p, q, N }) => { const cp = countIf(N, y => holds(p, y)), cq = countIf(N, y => holds(q, y)), cb = countIf(N, y => holds(p, y) && holds(q, y)), co = cp + cq - cb; return {
   prompt: `The pressure alarm sounds for a sensor number n when p ∨ q is true, where p is “${cond(p)}” and q is “${cond(q)}”. Here “or” is inclusive: p ∨ q is true when p is true, when q is true, or when both are. Enter how many whole numbers from 1 to ${n(N)} make p ∨ q true.`,
   answer: [co],
   hints: ['Count the numbers that make p true and the numbers that make q true.', 'A number that makes both true has been counted twice. Take it away once.'],
   solution: `From 1 to ${n(N)}, p is true for ${pl(cp, 'number')} and q for ${pl(cq, 'number')}. ${cb === 0 ? 'No number makes both true' : `${pl(cb, 'number makes', 'numbers make')} both true`}, so p ∨ q is true for ${cb === 0 ? `${n(cp)} + ${n(cq)}` : `${n(cp)} + ${n(cq)} − ${n(cb)}`} = ${pl(co, 'number')}.`,
   guidance: [
    { prompt: `How many whole numbers from 1 to ${n(N)} make p true, and how many make q true?`, answer: [cp, cq], explanation: `p, “${cond(p)}”, holds for ${pl(cp, 'number')}; q, “${cond(q)}”, for ${pl(cq, 'number')}.` },
    { prompt: 'How many of the numbers make both p and q true?', answer: [cb], explanation: cb === 0 ? 'None: no number from the range makes both true.' : `${pl(cb, 'number makes', 'numbers make')} both true, and ${cb === 1 ? 'it was' : 'each was'} counted in both lists.` },
    { prompt: `Add the two counts and take away the overlap once. How many numbers make p ∨ q true?`, answer: [co], explanation: `${cb === 0 ? `${n(cp)} + ${n(cq)}` : `${n(cp)} + ${n(cq)} − ${n(cb)}`} = ${n(co)}. Inclusive “or” counts a number that makes both true once, not twice.` }
   ] }; }
 },
 /* Rule: if the pressure is below k kPa (p), then the inner door is locked (q). Eight cycles [pressure, locked 1/0].
    A cycle breaks the rule only when p is true and q false. */
 q05: {
  canonical: { k: 90, log: [[84, 0], [97, 0], [88, 1], [90, 0], [75, 0], [93, 1], [86, 1], [101, 0]] },
  draw: R => { const k = R.int(60, 95); let log;
   do { log = Array.from({ length: 8 }, () => [R.next() < 0.1 ? k : k + R.int(-15, 15), TV(R.bool())]); const x = log[0][0]; if (R.bool()) log[0] = [k - R.int(1, 15), 0]; else if (x < k && !log[0][1]) log[0] = [x, 1]; } while (!(log.filter(([x, l]) => x < k && !l).length >= 1 && log.filter(([x, l]) => x < k && !l).length <= 4 && log.some(([x]) => x >= k)));
   return { k, log }; },
  build: ({ k, log }) => { const P = ([x]) => x < k, Q = ([, l]) => l === 1, rule = c => !P(c) || Q(c), c1 = log[0],
   hyp = log.filter(P), bad = log.map((c, i) => [c, i + 1]).filter(([c]) => P(c) && !Q(c)), door = l => l ? 'locked' : 'open'; return {
   prompt: `An airlock rule says: “If the pressure is below ${n(k)} kPa, then the inner door is locked.” The log of eight cycles gives the pressure in kPa (kilopascals, a unit of pressure) and the inner door: ${log.map(([x, l], i) => `cycle ${n(i + 1)}, ${n(x)}, ${door(l)}`).join('; ')}. Enter the truth value of the rule for cycle 1 (1 for true, 0 for false). Then enter how many of the eight cycles break the rule.`,
   answer: [TV(rule(c1)), bad.length],
   hints: ['The hypothesis is “the pressure is below the limit” and the conclusion is “the inner door is locked”.', 'An if-then rule is broken only when its hypothesis is true and its conclusion is false. When the hypothesis is false, the rule holds whatever the door does.'],
   solution: `Cycle 1 has ${n(c1[0])} kPa, so the hypothesis is ${word(P(c1))}${P(c1) ? `, and the door is ${door(c1[1])}, so the conclusion is ${word(Q(c1))}` : ''}. The rule is ${word(rule(c1))} for cycle 1: ${TV(rule(c1))}. The hypothesis is true in ${pl(hyp.length, 'cycle')}, and the door is open in ${bad.length === 1 ? 'one of them' : `${n(bad.length)} of them`} (cycle${bad.length === 1 ? '' : 's'} ${and(bad.map(([, i]) => n(i)))}). So ${pl(bad.length, 'cycle breaks', 'cycles break')} the rule.`,
   guidance: [
    { prompt: `In cycle 1 the pressure is ${n(c1[0])} kPa and the door is ${door(c1[1])}. Is the hypothesis true (1) or false (0)? Is the conclusion?`, answer: [TV(P(c1)), TV(Q(c1))], explanation: `${n(c1[0])} is ${P(c1) ? '' : 'not '}below ${n(k)}, so the hypothesis is ${word(P(c1))}; the door is ${door(c1[1])}, so the conclusion is ${word(Q(c1))}. The rule is ${word(rule(c1))} for this cycle.` },
    { prompt: `In how many of the eight cycles is the pressure below ${n(k)} kPa?`, answer: [hyp.length], explanation: `The hypothesis is true in ${pl(hyp.length, 'cycle')}. Only these can break the rule.` },
    { prompt: 'Of those cycles, in how many is the inner door open?', answer: [bad.length], explanation: `${bad.length === 1 ? 'One cycle has' : `${n(bad.length)} cycles have`} a true hypothesis and a false conclusion, and those are the only cycles that break the rule.` }
   ] }; }
 },
 /* p ↔ q for two conditions on n: three test values, then a count over 1 to N. */
 q06: {
  canonical: { p: { t: 'gt', v: 9 }, q: { t: 'mul', v: 3 }, xs: [6, 12, 10], N: 20 },
  draw: R => { let o; do { const N = R.int(15, 30), [s, t] = R.pick([['gt', 'mul'], ['lt', 'mul'], ['mul', 'gt'], ['mul', 'lt']]);
   o = { p: drawCond(R, s, N), q: drawCond(R, t, N), N }; const set = new Set(); while (set.size < 3) set.add(R.int(1, N)); o.xs = [...set];
   } while (new Set(o.xs.map(x => holds(o.p, x) === holds(o.q, x))).size < 2 || (o.p.t === 'lt' && o.p.v === 8 && o.q.v === 2)); return o; },
  build: ({ p, q, xs, N }) => { const iff = x => holds(p, x) === holds(q, x), cb = countIf(N, y => holds(p, y) && holds(q, y)), cn = countIf(N, y => !holds(p, y) && !holds(q, y)); return {
   prompt: `The pump runs on the rule p ↔ q, where p is “${cond(p)}” and q is “${cond(q)}”. Enter the truth value of p ↔ q for n = ${n(xs[0])}, then for n = ${n(xs[1])}, then for n = ${n(xs[2])} (1 for true, 0 for false). Then enter how many whole numbers from 1 to ${n(N)} make p ↔ q true.`,
   answer: [TV(iff(xs[0])), TV(iff(xs[1])), TV(iff(xs[2])), cb + cn],
   hints: ['p ↔ q is true when p and q have the same truth value: both true or both false.', 'Count the numbers that make both parts true, then the numbers that make both parts false, and add.'],
   solution: `${xs.map(x => `For ${n(x)}, p is ${word(holds(p, x))} and q is ${word(holds(q, x))}, so p ↔ q is ${word(iff(x))}: ${TV(iff(x))}.`).join(' ')} From 1 to ${n(N)}, ${pl(cb, 'number makes', 'numbers make')} both parts true and ${pl(cn, 'number makes', 'numbers make')} both false, so p ↔ q is true for ${n(cb)} + ${n(cn)} = ${pl(cb + cn, 'number')}.`,
   guidance: [
    { prompt: `Take n = ${n(xs[0])}. Is p true (1) or false (0)? Is q?`, answer: [TV(holds(p, xs[0])), TV(holds(q, xs[0]))], explanation: `p is ${word(holds(p, xs[0]))} and q is ${word(holds(q, xs[0]))}. ${iff(xs[0]) ? 'They match' : 'They differ'}, so p ↔ q is ${word(iff(xs[0]))}.` },
    { prompt: `From 1 to ${n(N)}, how many numbers make p and q both true?`, answer: [cb], explanation: `${pl(cb, 'number makes', 'numbers make')} both “${cond(p)}” and “${cond(q)}” true.` },
    { prompt: `How many make p and q both false?`, answer: [cn], explanation: `${pl(cn, 'number makes', 'numbers make')} both parts false. Adding the two counts gives ${n(cb + cn)}.` }
   ] }; }
 },
 /* n letters (2 to 5): 2^n rows; the row number of a case in the standard order is 1 + the sum of the place values
    of the false letters (the first letter is worth half the rows, the last 1). */
 q07: {
  canonical: { n: 3, c: [0, 1, 1] },
  draw: R => { let o; do { const k = R.int(2, 5); o = { n: k, c: Array.from({ length: k }, () => TV(R.bool())) }; } while (o.c.every(x => x === 1) || (o.n === 3 && o.c.join('') === '101')); return o; },
  build: ({ n: k, c }) => { const L = ['p', 'q', 'r', 's', 't'].slice(0, k), rows = 2 ** k, half = rows / 2,
   worth = L.map((_, j) => 2 ** (k - 1 - j)), skip = c.reduce((s, x, j) => s + (x ? 0 : worth[j]), 0), row = skip + 1,
   names = L.length === 2 ? 'p and q' : L.slice(0, -1).join(', ') + ' and ' + L[L.length - 1],
   caseW = L.map((x, j) => `${x} ${c[j] ? 'true' : 'false'}`).join(', '), falseL = L.filter((_, j) => !c[j]),
   blocks = L.map((x, j) => `${pl(worth[j], 'row')} for ${x}`).join(', '), fw = worth.filter((_, j) => !c[j]),
   sum = fw.length === 1 ? pl(skip, 'row') : `${fw.map(n).join(' + ')} = ${n(skip)} rows`; return {
   prompt: `A control panel has ${n(k)} switches, ${names}. Each switch is a statement that is true or false. Enter how many rows a truth table for these ${n(k)} letters needs. Then enter the row number of the case ${caseW}, in the standard order: the first letter is true on the top half of the rows, each next letter switches twice as often, and the last letter switches on every row.`,
   answer: [rows, row],
   hints: ['Each new letter doubles the number of rows: 2 for one letter, 4 for two, and so on.', `p is true on the top ${n(half)} rows. Each letter that is false in the case moves it down by the number of rows that letter’s block fills.`],
   solution: `With ${n(k)} letters the table has ${Array(k).fill('2').join(' × ')} = ${n(rows)} rows. In the standard order the blocks are ${blocks}. The case is false for ${and(falseL)}, so it sits ${sum} below row 1: row ${n(row)}.`,
   guidance: [
    { prompt: `How many rows does a truth table for ${n(k)} letters have?`, answer: [rows], explanation: `Each letter doubles the count: ${Array(k).fill('2').join(' × ')} = ${n(rows)}.` },
    { prompt: `p is true on the top half of the rows. How many rows is that? And how many rows long is the block of the last letter, ${L[k - 1]}?`, answer: [half, 1], explanation: `The top half is ${n(half)} rows; the last letter changes every row, so its block is 1 row long.` },
    { prompt: `Add the block lengths of the letters that are false in the case, ${and(falseL)}, and add 1. Which row is it?`, answer: [row], explanation: `The case sits ${sum} below row 1, so it is on row ${n(row)}.` }
   ] }; }
 },
 /* A compound statement in p, q and r with one binary part and one letter; the count of true rows (1 to 7) out of 8. */
 q08: {
  canonical: { f: ['imp', ['or', 'p', 'q'], ['not', 'r']] },
  draw: R => { let f, k; do { f = randomTree3(R); k = table(['p', 'q', 'r'], f).filter(([x]) => x).length; } while (k < 1 || k > 7 || show(f) === '(p ∧ ¬q) ∨ r'); return { f }; },
  build: ({ f }) => { const L = ['p', 'q', 'r'], rows = rowsOf(L), [A, B] = parts(f), vals = rows.map(v => [ev(A, v), ev(B, v), ev(f, v)]),
   cA = vals.filter(x => x[0]).length, cB = vals.filter(x => x[1]).length, cS = vals.filter(x => x[2]).length, S = show(f), SA = show(A), SB = show(B); return {
   prompt: `A lamp on the control panel lights when the statement ${S} is true. Build its truth table in the standard order, with a column for ${SA}, a column for ${SB} and a column for the whole statement. Enter how many rows make the whole statement true.`,
   answer: [cS],
   hints: ['Three letters need 8 rows. Fill in the column of each part first, row by row.', `The last column joins the two part columns with ${SYM[f[0]]}. Look up its rule for each pair of values.`],
   solution: `Row by row (values of p, q, r: ${SA}, ${SB}, whole statement): ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i][0])}, ${TF(vals[i][1])}, ${TF(vals[i][2])}`).join('; ')}. The whole statement is true on ${pl(cS, 'row')}.`,
   guidance: [
    { prompt: 'How many rows does the table for p, q and r need?', answer: [8], explanation: 'Three letters: 2 × 2 × 2 = 8 rows.' },
    { prompt: `On how many rows is ${SA} true? On how many is ${SB} true?`, answer: [cA, cB], explanation: `${SA} is true on ${pl(cA, 'row')} and ${SB} on ${pl(cB, 'row')}.` },
    { prompt: `Join the two columns with ${SYM[f[0]]}. On how many rows is ${S} true?`, answer: [cS], explanation: `Going down the rows gives ${vals.map(x => TF(x[2])).join('')}: ${pl(cS, 'row')} with T.` }
   ] }; }
 },
 /* A statement that is a tautology, a contradiction or neither; its table has a row for each case of its letters. */
 q09: {
  canonical: { f: ['imp', ['and', ['imp', 'p', 'q'], 'p'], 'q'] },
  draw: R => { let f; do { const u = R.next(), m = R.bool() ? { A: 'p', B: 'q' } : { A: 'q', B: 'p' };
   if (u < 0.45) f = sub(R.pick(TAUT), m); else if (u < 0.7) f = sub(R.pick(CONTRA), m);
   else { do { f = randomTree2(R); } while (table(lettersOf(f), f).every(([x]) => x) || table(lettersOf(f), f).every(([x]) => !x)); }
   } while (show(f) === '(p ∧ q) → p'); return { f }; },
  build: ({ f }) => { const L = lettersOf(f), rows = rowsOf(L), vals = rows.map(v => ev(f, v)), k = vals.filter(x => x).length, total = rows.length, S = show(f),
   kind = k === total ? 'a tautology' : k === 0 ? 'a contradiction' : 'neither a tautology nor a contradiction'; return {
   prompt: `Before a rule is wired into the panel, Mira checks the statement ${S}. Build its truth table, with a row for each case of the letters in it. Enter how many rows make the statement true. Then enter 1 if the statement is a tautology, 0 if it is not.`,
   answer: [k, TV(k === total)],
   hints: [`The statement uses ${L.length === 1 ? 'one letter' : `${L.length === 2 ? 'two' : 'three'} letters`}, so its table has ${pl(total, 'row')}.`, 'A tautology is true on every row. One false row is enough to stop it being one.'],
   solution: `The rows (${L.join(', ')}) give: ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i])}`).join('; ')}. The statement is true on ${n(k)} of the ${pl(total, 'row')}, so it is ${kind}: enter ${n(k)} and ${TV(k === total)}.`,
   guidance: [
    { prompt: `How many rows does the table for ${S} have?`, answer: [total], explanation: `It uses ${L.length === 1 ? 'one letter' : `the letters ${L.join(' and ')}`}, and each letter doubles the rows: ${n(total)}.` },
    { prompt: `Work out the statement on each row. On how many rows is it true?`, answer: [k], explanation: `Down the rows it reads ${vals.map(TF).join('')}: true on ${n(k)} of the ${pl(total, 'row')}.` },
    { prompt: 'Is it true on every row? Enter 1 for a tautology, 0 if not.', answer: [TV(k === total)], explanation: `It is ${kind}.` }
   ] }; }
 },
 /* Two statements on the same letters: the true rows of the first, then the rows where the two differ (0: equivalent). */
 q10: {
  canonical: { f: ['imp', 'p', 'q'], g: ['imp', 'q', 'p'] },
  draw: R => { let o; do { const u = R.next(), m = [{ A: 'p', B: 'q', C: 'r' }, { A: 'q', B: 'p', C: 'r' }, { A: 'p', B: 'r', C: 'q' }][R.int(0, 2)];
   if (u < 0.8) { const [a, b] = R.pick(PAIRS); o = R.bool() ? { f: sub(a, m), g: sub(b, m) } : { f: sub(b, m), g: sub(a, m) }; }
   else o = { f: randomTree2(R), g: randomTree2(R) };
   } while ((show(o.f) === '¬(p ∧ q)' && show(o.g) === '¬p ∨ ¬q') || (show(o.f) === show(o.g))); return o; },
  build: ({ f, g }) => { const L = lettersOf(f, g), names = L.slice(0, -1).join(', ') + ' and ' + L[L.length - 1], rows = rowsOf(L), vals = rows.map(v => [ev(f, v), ev(g, v)]), kf = vals.filter(x => x[0]).length,
   kg = vals.filter(x => x[1]).length, diff = vals.map((x, i) => [x, i + 1]).filter(([x]) => x[0] !== x[1]).map(([, i]) => i), F = show(f), H = show(g); return {
   prompt: `Two versions of a door rule are on the panel: ${F}, and ${H}. Build one truth table for both, with a row for each case of the letters ${names} in the standard order. Enter how many rows make ${F} true. Then enter on how many rows the two statements have different truth values (0 means they are logically equivalent).`,
   answer: [kf, diff.length],
   hints: [`The letters are ${names}, so the table has ${pl(rows.length, 'row')}. Work out both statements on every row.`, 'Compare the two columns row by row and count the rows where one is T and the other is F.'],
   solution: `Row by row (${L.join(', ')}: first statement, second statement): ${rows.map((v, i) => `${caseText(L, v)}: ${TF(vals[i][0])}, ${TF(vals[i][1])}`).join('; ')}. ${F} is true on ${pl(kf, 'row')}. ${diff.length === 0 ? 'The two columns agree on every row, so the statements are logically equivalent: 0 rows differ.' : `The columns differ on ${diff.length === 1 ? 'row' : 'rows'} ${and(diff.map(n))}, so ${pl(diff.length, 'row differs', 'rows differ')} and the statements are not equivalent.`}`,
   guidance: [
    { prompt: `On how many rows is ${F} true? On how many is ${H} true?`, answer: [kf, kg], explanation: `${F} is true on ${pl(kf, 'row')} and ${H} on ${pl(kg, 'row')}.${kf !== kg ? ' Different counts already show that some rows differ.' : ''}` },
    { prompt: 'Compare the two columns row by row. On how many rows do they differ?', answer: [diff.length], explanation: diff.length === 0 ? 'They agree on every row, so the two statements are logically equivalent.' : `They differ on ${diff.length === 1 ? 'row' : 'rows'} ${and(diff.map(n))}.` }
   ] }; }
 }
});
})();
