/* Logic and proof practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p4.js. */
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

/* ---- shared helpers ---- */
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const shuffle = (R, arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const sample = (R, arr, k) => shuffle(R, arr).slice(0, k);
/* Draws with make() until ok(p) holds (at most 80 tries), else returns the fallback parameters. */
const tryDraw = (R, make, ok, fb) => { for (let i = 0; i < 80; i++) { const p = make(); if (ok(p)) return p; } return fb; };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;
const isPrime = v => { if (v < 2) return false; for (let d = 2; d * d <= v; d++) if (v % d === 0) return false; return true; };
const spf = v => { for (let d = 2; d * d <= v; d++) if (v % d === 0) return d; return v; };
const list = a => a.map(n).join(', ');

/* Outpost sentences with their plain form and their opposite. */
const ATOMS = [
 ['the east pump is running', 'the east pump is not running'],
 ['the tank pressure rises', 'the tank pressure does not rise'],
 ['the hatch is sealed', 'the hatch is not sealed'],
 ['the fan is on', 'the fan is off'],
 ['the heater is on', 'the heater is off'],
 ['the solar array is deployed', 'the solar array is not deployed'],
 ['the battery is charging', 'the battery is not charging'],
 ['the relay is online', 'the relay is offline'],
 ['the greenhouse lamp is lit', 'the greenhouse lamp is dark'],
 ['the water line is open', 'the water line is closed'],
 ['the rover is docked', 'the rover is out'],
 ['the alarm is sounding', 'the alarm is silent']
];
const ATOM_IDS = ATOMS.map((_, i) => i);
const lt = (i, neg) => ATOMS[i][neg ? 1 : 0];

/* Statements as small trees: V variable (optionally negated), I if-then, O or, A and, E if-and-only-if, N not. */
const V = (i, neg = false) => ({ k: 'v', i, neg });
const I = (a, b) => ({ k: 'imp', a, b });
const O = (a, b) => ({ k: 'or', a, b });
const A = (a, b) => ({ k: 'and', a, b });
const E = (a, b) => ({ k: 'iff', a, b });
const N = a => ({ k: 'not', a });
const ev = (s, a) => {
 switch (s.k) {
  case 'v': return s.neg ? !a[s.i] : a[s.i];
  case 'imp': return !ev(s.a, a) || ev(s.b, a);
  case 'or': return ev(s.a, a) || ev(s.b, a);
  case 'and': return ev(s.a, a) && ev(s.b, a);
  case 'iff': return ev(s.a, a) === ev(s.b, a);
  default: return !ev(s.a, a);
 }
};
const LETTERS = 'pqrs', OPS = { imp: '→', or: '∨', and: '∧', iff: '↔' };
const rl = (s, nested) => {
 if (s.k === 'v') return (s.neg ? '¬' : '') + LETTERS[s.i];
 if (s.k === 'not') return '¬' + rl(s.a, true);
 const t = `${rl(s.a, true)} ${OPS[s.k]} ${rl(s.b, true)}`;
 return nested ? `(${t})` : t;
};
/* Words: at[i] is the sentence (ATOMS index) that letter i stands for. */
const wd = (s, at) => {
 if (s.k === 'v') return lt(at[s.i], s.neg);
 if (s.k === 'imp') return `if ${wd(s.a, at)}, then ${wd(s.b, at)}`;
 if (s.k === 'or') return `either ${wd(s.a, at)} or ${wd(s.b, at)}`;
 return `${wd(s.a, at)} and ${wd(s.b, at)}`;
};
/* Truth table over m letters in the standard order (row 1 is all true). */
const table = (m, prem, conc) => {
 const pass = [], bad = [];
 for (let idx = 0; idx < (1 << m); idx++) {
  const a = []; for (let j = 0; j < m; j++) a.push(((idx >> (m - 1 - j)) & 1) === 0);
  if (prem.every(s => ev(s, a))) { pass.push(idx); if (!ev(conc, a)) bad.push(idx); }
 }
 return { pass, bad, valid: bad.length === 0 };
};
const rowTxt = (idx, m) => { const t = []; for (let j = 0; j < m; j++) t.push(`${LETTERS[j]} ${((idx >> (m - 1 - j)) & 1) === 0 ? 1 : 0}`); return `row ${idx + 1} (${t.join(', ')})`; };
const rowsTxt = (rows, m, max) => rows.length > 0 && rows.length <= max ? `: ${rows.map(r => rowTxt(r, m)).join(', ')}` : '';
const isValid = (f, m) => table(m, f.prem, f.conc).valid;

/* The common truth-table answer, solution and guidance for an argument over m letters. */
const argWork = (m, prem, conc) => {
 const t = table(m, prem, conc), P = t.pass.length, B = t.bad.length, v = t.valid ? 1 : 0, rows = 2 ** m;
 return {
  answer: [P, B, v],
  solution: `Every premise is true on ${n(P)} of the ${n(rows)} rows${rowsTxt(t.pass, m, 8)}. The conclusion is false on ${n(B)} of those rows${rowsTxt(t.bad, m, 4)}. ${v ? 'No row has every premise true and the conclusion false, so the argument is valid (1).' : `A row with true premises and a false conclusion shows the premises can hold while the conclusion fails, so the argument is not valid (0).`}`,
  guidance: [
   { prompt: `On how many of the ${n(rows)} rows are all the premises true?`, answer: [P], explanation: `${n(P)} row${P === 1 ? '' : 's'}${rowsTxt(t.pass, m, 8)}. Rows where any premise is false are ignored.` },
   { prompt: 'On how many of those rows is the conclusion false?', answer: [B], explanation: B ? `${n(B)} of them${rowsTxt(t.bad, m, 4)}: the premises are true and the conclusion is false.` : 'None of them: on every row where the premises are true, the conclusion is true too.' },
   { prompt: 'Is the argument valid (1) or not (0)?', answer: [v], explanation: v ? 'No row has true premises and a false conclusion, so it is valid.' : 'At least one row has true premises and a false conclusion, so it is not valid.' }
  ]
 };
};
const ARG_HINTS = [
 'Work out every premise on every row and mark the rows on which all of them are true. Rows with a false premise do not count.',
 'Look at the conclusion on the marked rows only. A marked row with a false conclusion breaks the argument; if there is none, it is valid.'
];

/* ---- q16 Negating a quantifier; the smallest counterexample [CM 2.1, Levin 0.2] ---- */

const CAND16 = [];
for (let k = 1; k <= 41; k += 2) for (let N0 = 12; N0 <= 20; N0++) {
 const bad = []; for (let i = 1; i <= N0; i++) if (!isPrime(i * i + i + k)) bad.push(i);
 if (bad.length >= 1 && bad[0] >= 4 && bad.length <= N0 - 4) CAND16.push([k, N0]);
}

mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The stores ledger claim',
 brief: 'The stores ledger swears that its tag numbers always give a prime, and Mira wants to know where that promise first breaks.',
 labels: ['smallest counterexample', 'counterexamples in the domain'], tolerance: 0.01,
 gl: [['smallest counterexample'], ['counterexamples in the domain']]
}, {
 canonical: { k: 11, N: 12 },
 draw: R => { const [k, N0] = R.pick(CAND16); return { k, N: N0 }; },
 build: ({ k, N }) => {
  const bad = []; for (let i = 1; i <= N; i++) if (!isPrime(i * i + i + k)) bad.push(i);
  const f = bad[0], v = f * f + f + k, d = spf(v), seen = [];
  for (let i = 1; i < f; i++) seen.push(`n = ${n(i)} gives ${n(i * i + i + k)}, prime`);
  return {
  prompt: `The stores ledger carries a claim about its tag numbers: “for every whole number n from 1 to ${n(N)}, n² + n + ${n(k)} is a prime number.” (A prime number is a whole number above 1 that can be divided exactly only by 1 and by itself.) Write the negation, then test the claim. Enter the smallest n in the domain that is a counterexample, then how many numbers from 1 to ${n(N)} are counterexamples.`,
  answer: [f, bad.length],
  hints: [`The negation is “there is an n for which n² + n + ${n(k)} is not prime”. A counterexample is an n that gives a number that can be divided exactly by some whole number other than 1 and itself.`, `Work out n² + n + ${n(k)} for n = 1, 2, 3 and so on in order, and stop at the first one that is not prime. Then keep going to the end of the domain to count them.`],
  solution: `The negation is: there is an n from 1 to ${n(N)} for which n² + n + ${n(k)} is not prime. Testing in order: ${seen.join('; ')}${seen.length ? '; ' : ''}n = ${n(f)} gives ${n(v)} = ${n(d)} × ${n(v / d)}, which is not prime. So the smallest counterexample is n = ${n(f)}. Checking the rest of the domain, the counterexamples are ${list(bad)}: ${n(bad.length)} of them.`,
  guidance: [
   { prompt: `Work out n² + n + ${n(k)} for n = 1, 2, 3 and so on. What is the first n that gives a number that is not prime?`, answer: [f], explanation: `${seen.length ? seen.join('; ') + '; ' : ''}n = ${n(f)} gives ${n(v)} = ${n(d)} × ${n(v / d)}, which is not prime. So n = ${n(f)} is the smallest counterexample.` },
   { prompt: `Check every n from ${n(f)} up to ${n(N)}. How many n in the whole domain give a number that is not prime?`, answer: [bad.length], explanation: `The counterexamples are ${list(bad)}: ${n(bad.length)} in all.` }
  ] }; }
});

mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'The pressure gauge log',
 brief: 'A safety sheet says every gauge reads under the line, and the chamber needs to know where that stops being true.',
 labels: ['first gauge over the limit', 'gauges over the limit', 'second claim true (1) or false (0)'], tolerance: 0.01,
 gl: [['first gauge over the limit'], ['gauges over the limit'], ['second claim true (1) or false (0)']]
}, {
 canonical: { L: 45, r: [41, 38, 44, 47, 36, 52, 40, 45, 43], M: 50 },
 draw: R => {
  const L = R.int(40, 60), f = R.int(3, 6), r = [];
  for (let i = 1; i <= 9; i++) r.push(i === f || (i > f && R.next() < 0.3) ? L + R.int(1, 14) : R.int(L - 18, L));
  const mx = Math.max(...r);
  return { L, r, M: R.bool() ? mx - R.int(0, 2) : mx + R.int(0, 2) };
 },
 build: ({ L, r, M }) => {
  const bad = []; r.forEach((v, i) => { if (v > L) bad.push(i + 1); });
  const f = bad[0], mx = Math.max(...r), ex = mx > M ? 1 : 0;
  return {
  prompt: `A pressure log lists nine gauges (gauge number, then reading in kilopascals): ${r.map((v, i) => `gauge ${n(i + 1)}, ${n(v)}`).join('; ')}. The safety sheet makes a first claim: “for every gauge, the reading is at most ${n(L)}.” A second claim says: “there is a gauge whose reading is more than ${n(M)}.” Enter the number of the first gauge that breaks the first claim, then how many gauges break it, then 1 if the second claim is true or 0 if it is false.`,
  answer: [f, bad.length, ex],
  hints: [`The negation of “for every gauge, the reading is at most ${n(L)}” is “some gauge reads more than ${n(L)}”. Each gauge that reads more than ${n(L)} is a counterexample.`, 'Go down the list in order for the first counterexample, then carry on to the end to count them. The second claim is a “there is” claim, so one gauge above its line is enough: look at the highest reading.'],
  solution: `The first claim is broken by any gauge reading more than ${n(L)}. Going down the list, ${f === 3 ? 'gauges 1 and 2' : `gauges 1 to ${n(f - 1)}`} read ${n(L)} or less, and gauge ${n(f)} reads ${n(r[f - 1])}, so the first counterexample is gauge ${n(f)}. The gauges over ${n(L)} are ${list(bad)}: ${n(bad.length)} in all. The second claim is a “there is” claim, so it is true exactly when the highest reading is more than ${n(M)}. The highest reading is ${n(mx)}, which ${ex ? `is more than ${n(M)}, so the claim is true (1)` : `is not more than ${n(M)}, so the claim is false (0)`}.`,
  guidance: [
   { prompt: `Go down the readings in order. Which is the first gauge that reads more than ${n(L)}?`, answer: [f], explanation: `${f === 3 ? 'Gauges 1 and 2' : `Gauges 1 to ${n(f - 1)}`} read ${n(L)} or less; gauge ${n(f)} reads ${n(r[f - 1])}, so it is the first counterexample.` },
   { prompt: `How many gauges in all read more than ${n(L)}?`, answer: [bad.length], explanation: `Gauge${bad.length === 1 ? '' : 's'} ${bad.length === 1 ? list(bad) : `${list(bad.slice(0, -1))} and ${n(bad[bad.length - 1])}`} ${bad.length === 1 ? 'reads' : 'read'} more than ${n(L)}: ${n(bad.length)} in all.` },
   { prompt: `Is “there is a gauge whose reading is more than ${n(M)}” true (1) or false (0)? Find the highest reading.`, answer: [ex], explanation: `The highest reading is ${n(mx)}, which ${ex ? `is more than ${n(M)}, so one gauge is enough and the claim is true` : `is not more than ${n(M)}, so no gauge is above it and the claim is false`}.` }
  ] }; }
});

const PAIRS16 = [];
[4, 6, 8, 9, 10, 12, 14, 15, 21].forEach(a => [6, 8, 9, 10, 12, 14, 15, 21, 25].forEach(b => { if (a < b && b % a !== 0 && lcm(a, b) <= 90) PAIRS16.push([a, b]); }));

mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', title: 'The depot rule, negated',
 brief: 'A depot rule is written as a “not … or not …” sentence, and the office wants to know which numbers it fails for.',
 labels: ['smallest counterexample', 'counterexamples in the domain'], tolerance: 0.01, uses: 'q12',
 gl: [['smallest counterexample'], ['counterexamples in the domain']]
}, {
 canonical: { a: 6, b: 8, N: 100 },
 draw: R => { const [a, b] = R.pick(PAIRS16), l = lcm(a, b); return { a, b, N: l * R.int(2, 5) + R.int(0, l - 1) }; },
 build: ({ a, b, N }) => {
  const bad = []; for (let i = 1; i <= N; i++) if (i % a === 0 && i % b === 0) bad.push(i);
  const l = bad[0];
  return {
  prompt: `A depot rule says: “for every whole number n from 1 to ${n(N)}, n is not a multiple of ${n(a)} or n is not a multiple of ${n(b)}.” Use De Morgan’s laws to write the negation of the “not … or not …” part, then test the rule. Enter the smallest counterexample, then how many numbers from 1 to ${n(N)} are counterexamples.`,
  answer: [l, bad.length],
  hints: ['A counterexample is an n that makes the part after the comma false. De Morgan’s laws turn ¬(¬p ∨ ¬q) into p ∧ q, so the counterexamples are the numbers that are a multiple of both.', 'A number that is a multiple of both numbers is a multiple of their lowest common multiple. List the multiples of the larger number and test each one against the smaller, then keep listing up to the end of the domain.'],
  solution: `The negation of “not a multiple of ${n(a)} or not a multiple of ${n(b)}” is, by De Morgan’s laws, “a multiple of ${n(a)} and a multiple of ${n(b)}”. So a counterexample is a number from 1 to ${n(N)} that is a multiple of both. The smallest is ${n(l)}, the lowest common multiple of ${n(a)} and ${n(b)}. The counterexamples are ${list(bad)}: ${n(bad.length)} of them.`,
  guidance: [
   { prompt: `By De Morgan’s laws a counterexample is a multiple of ${n(a)} and of ${n(b)} at once. What is the smallest such number?`, answer: [l], explanation: `${n(l)} is the smallest number that both ${n(a)} and ${n(b)} divide into.` },
   { prompt: `How many numbers from 1 to ${n(N)} are multiples of both ${n(a)} and ${n(b)}?`, answer: [bad.length], explanation: `They are ${list(bad)}: ${n(bad.length)} numbers.` }
  ] }; }
});

/* ---- q17 Chapter review: rewriting regulations [CM 2.6, Levin 0.2] ---- */

const CANON17B = [[1, 0, 1], [0, 1, 0], [0, 0, 0], [1, 1, 0], [0, 0, 1], [1, 0, 0], [0, 1, 1], [0, 0, 0]];
const brk17 = rows => rows.filter(([p, q, r]) => (p || q) && !r).length;

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'Suits, hatches and the alarm',
 brief: 'The airlock office is closing its own audit, with one rule to check against the station log and one claim to test.',
 labels: ['stations that break the first regulation', 'smallest counterexample to the second'], tolerance: 0.01,
 gl: [['stations with the “if” part true'], ['stations that break it'], ['smallest counterexample']]
}, {
 canonical: { rows: CANON17B, a: 4, b: 10 },
 draw: R => {
  const rows = tryDraw(R, () => Array.from({ length: 8 }, () => [R.int(0, 1), R.int(0, 1), R.int(0, 1)]), rs => { const b = brk17(rs); return b >= 2 && b <= 4; }, CANON17B);
  return { rows, a: R.int(3, 8), b: R.int(1, 20) };
 },
 build: ({ rows, a, b }) => {
  const ifTrue = rows.map((x, i) => (x[0] || x[1]) ? i + 1 : 0).filter(Boolean);
  const bad = rows.map((x, i) => ((x[0] || x[1]) && !x[2]) ? i + 1 : 0).filter(Boolean);
  let f = 1; while (f * f * f <= a * f * f + b) f++;
  const seen = []; for (let i = 3; i < f; i++) seen.push(`n = ${n(i)} gives ${n(i ** 3)} ≤ ${n(a * i * i + b)}, true`);
  return {
  prompt: `Two regulations need checking. First: “If the hatch is open or the suit is unsealed, then the alarm is on.” Station log: ${rows.map((x, i) => `station ${n(i + 1)}, hatch ${x[0] ? 'open' : 'closed'}, suit ${x[1] ? 'unsealed' : 'sealed'}, alarm ${x[2] ? 'on' : 'off'}`).join('; ')}. Second: “For every whole number n from 1 to 12, n³ ≤ ${n(a)}n² + ${n(b)}.” Enter how many stations break the first regulation, then the smallest counterexample to the second.`,
  answer: [bad.length, f],
  hints: ['The first regulation has the form (p ∨ q) → r. Its negation is (p ∨ q) ∧ ¬r: the hatch open or the suit unsealed, and the alarm off.', 'For the second, work out both sides for n = 1, 2, 3 and so on in order, and stop at the first n that makes the claim false.'],
  solution: `The first regulation is broken exactly when (p ∨ q) ∧ ¬r is true: the hatch is open or the suit is unsealed, and the alarm is off. The stations where the “if” part holds are ${list(ifTrue)}; of those, the alarm is off at ${list(bad)}. So ${n(bad.length)} stations break it. For the second, the negation is “there is an n with n³ ≤ ${n(a)}n² + ${n(b)} false”. Testing in order: n = 1 and n = 2 are true${seen.length ? `; ${seen.join('; ')}` : ''}; n = ${n(f)} gives ${n(f ** 3)} ≤ ${n(a * f * f + b)}, false. The smallest counterexample is n = ${n(f)}.`,
  guidance: [
   { prompt: 'At how many stations is the hatch open or the suit unsealed, so that the “if” part is true?', answer: [ifTrue.length], explanation: `Stations ${list(ifTrue)}. Only these can break the regulation; the others are fine whatever the alarm does.` },
   { prompt: 'Of those stations, at how many is the alarm off, so that the regulation is broken?', answer: [bad.length], explanation: `Stations ${list(bad)}: the “if” part is true and the alarm is off.` },
   { prompt: `Test n = 1, 2, 3 and so on in n³ ≤ ${n(a)}n² + ${n(b)}. What is the first n for which it is false?`, answer: [f], explanation: `n = ${n(f)} gives ${n(f ** 3)} ≤ ${n(a * f * f + b)}, which is false, and every smaller n is true. So n = ${n(f)} is the smallest counterexample.` }
  ] }; }
});

mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'The hold inspection',
 brief: 'An inspector has only counts from the cargo hold, and the office needs the rule-breakers worked out from them before the strapping crew starts.',
 labels: ['crates both heavy and fragile', 'crates that break the regulation', 'every crate obeys now (1) or not (0)'], tolerance: 0.01,
 gl: [['crates both heavy and fragile'], ['crates that break it'], ['every crate obeys now (1) or not (0)']]
}, {
 canonical: { T: 70, F: 20, H: 24, X: 13, S: 7, k: 3 },
 draw: R => {
  const H = R.int(18, 40), X = R.int(6, H - 6), B = H - X, S = R.int(2, B - 3), br = B - S, F = B + R.int(2, 12);
  return { T: H + F + R.int(4, 20), F, H, X, S, k: R.bool() ? br : R.int(1, br - 1) };
 },
 build: ({ T, F, H, X, S, k }) => {
  const B = H - X, br = B - S, left = br - k, ok = left === 0 ? 1 : 0;
  return {
  prompt: `A cargo hold has ${n(T)} crates under the regulation “If a crate is over 30 kg and marked fragile, then it is strapped down.” The inspector reports: ${n(F)} crates are marked fragile; ${n(H)} crates are over 30 kg, and ${n(X)} of those are not marked fragile; of the crates that are both over 30 kg and marked fragile, ${n(S)} are strapped down. The crew then straps down ${n(k)} more of the crates that were breaking the regulation. Enter how many crates are both over 30 kg and marked fragile, then how many of them broke the regulation before the crew started, then 1 if every crate now obeys the regulation or 0 if not.`,
  answer: [B, br, ok],
  hints: ['The regulation only covers crates whose “if” part is true: over 30 kg and marked fragile. The other counts in the report do not matter for that group.', 'A crate breaks the regulation when the “if” part is true and the conclusion is false, so it is heavy, fragile and not strapped. After the crew works, count what is left.'],
  solution: `Of the ${n(H)} crates over 30 kg, ${n(X)} are not marked fragile, so ${n(H)} − ${n(X)} = ${n(B)} are both heavy and fragile. A crate breaks the regulation when it is heavy, fragile and not strapped: ${n(B)} − ${n(S)} = ${n(br)} crates. The crew straps down ${n(k)} of them, leaving ${n(br)} − ${n(k)} = ${n(left)} rule-breaker${left === 1 ? '' : 's'}. ${ok ? 'None are left, so every crate obeys the regulation (1).' : `${n(left)} crate${left === 1 ? ' is' : 's are'} still loose, so the regulation is still broken (0).`} The counts for all crates and for fragile crates were not needed.`,
  guidance: [
   { prompt: `${n(H)} crates are over 30 kg and ${n(X)} of those are not marked fragile. How many are both over 30 kg and marked fragile?`, answer: [B], explanation: `${n(H)} − ${n(X)} = ${n(B)}. These are the only crates whose “if” part is true.` },
   { prompt: `Of those ${n(B)} crates, ${n(S)} are strapped down. How many break the regulation?`, answer: [br], explanation: `${n(B)} − ${n(S)} = ${n(br)} crates are heavy, fragile and not strapped.` },
   { prompt: `The crew straps down ${n(k)} of the rule-breakers. Does every crate now obey the regulation (1) or not (0)?`, answer: [ok], explanation: `${n(br)} − ${n(k)} = ${n(left)} rule-breaker${left === 1 ? '' : 's'} remain${left === 1 ? 's' : ''}, so ${ok ? 'the regulation holds' : 'it is still broken'}.` }
  ] }; }
});

const PAIRS17 = [];
[6, 8, 9, 10, 12, 14, 15].forEach(a => [4, 5, 7, 8, 9, 12].forEach(b => { if (a % b !== 0) PAIRS17.push([a, b]); }));
const brk17d = (a, t, b, N0) => { const hyp = [], bad = []; for (let i = 1; i <= N0; i++) if (i % a === 0 && i > t) { hyp.push(i); if (i % b !== 0) bad.push(i); } return { hyp, bad }; };

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', title: 'The three-part rule',
 brief: 'A rule in the depot has a two-part “if” and covers a long run of numbers, so the office wants every rule-breaker found.',
 labels: ['numbers that break the rule', 'smallest rule-breaker', 'largest rule-breaker'], tolerance: 0.01, uses: 'q14',
 gl: [['numbers where the “if” part is true'], ['numbers that break the rule'], ['smallest rule-breaker', 'largest rule-breaker']]
}, {
 canonical: { a: 6, t: 20, b: 4, N: 100 },
 draw: R => { const make = () => { const [a, b] = R.pick(PAIRS17); return { a, t: R.int(10, 30), b, N: R.int(60, 120) }; }; return tryDraw(R, make, p => brk17d(p.a, p.t, p.b, p.N).bad.length >= 3, { a: 6, t: 20, b: 4, N: 100 }); },
 build: ({ a, t, b, N }) => {
  const { hyp, bad } = brk17d(a, t, b, N), lo = bad[0], hi = bad[bad.length - 1];
  return {
  prompt: `A depot rule reads: “for every whole number n from 1 to ${n(N)}, if n is a multiple of ${n(a)} and n is greater than ${n(t)}, then n is a multiple of ${n(b)}.” A number breaks the rule when the rule’s “if … then” is false for it. Enter how many numbers from 1 to ${n(N)} break the rule, then the smallest and the largest of them.`,
  answer: [bad.length, lo, hi],
  hints: ['The rule has the form (p ∧ q) → r, so its negation is p ∧ q ∧ ¬r: a multiple of the first number, greater than the limit, and not a multiple of the last number.', 'List the multiples of the first number that are greater than the limit, then cross out the ones that are also multiples of the last number. Those left are the rule-breakers.'],
  solution: `A number breaks the rule when it is a multiple of ${n(a)}, greater than ${n(t)}, and not a multiple of ${n(b)}. The multiples of ${n(a)} greater than ${n(t)} up to ${n(N)} are ${list(hyp)}. Taking out those that are multiples of ${n(b)} leaves ${list(bad)}. So ${n(bad.length)} numbers break the rule: the smallest is ${n(lo)} and the largest is ${n(hi)}.`,
  guidance: [
   { prompt: `How many numbers from 1 to ${n(N)} are multiples of ${n(a)} and greater than ${n(t)}, so that the “if” part is true?`, answer: [hyp.length], explanation: `They are ${list(hyp)}: ${n(hyp.length)} numbers.` },
   { prompt: `How many of those are not multiples of ${n(b)}, so that the rule is broken?`, answer: [bad.length], explanation: `${list(bad)}: ${n(bad.length)} numbers. The rest are multiples of ${n(b)}, so the rule holds for them.` },
   { prompt: 'What are the smallest and the largest of the rule-breakers?', answer: [lo, hi], explanation: `The list ${list(bad)} starts at ${n(lo)} and ends at ${n(hi)}.` }
  ] }; }
});

/* ---- q18 Arguments and validity by truth table [CM 2.7] ---- */

const v0 = V(0), v1 = V(1), v2 = V(2), v3 = V(3), n0 = V(0, true), n1 = V(1, true), n2 = V(2, true), n3 = V(3, true);
const FORMS18B = [
 { prem: [I(v0, v1), I(v1, v2)], conc: I(v0, v2) },
 { prem: [I(v0, v1), I(v2, v1)], conc: O(v0, v2) },
 { prem: [I(A(v0, v1), v2), n2], conc: O(n0, n1) },
 { prem: [O(v0, v1), O(n0, v2)], conc: O(v1, v2) },
 { prem: [E(v0, v1), I(v1, v2)], conc: I(v0, v2) },
 { prem: [I(v0, v2), I(v1, v2)], conc: A(v0, v1) },
 { prem: [O(v0, v1), I(v0, v2)], conc: v1 },
 { prem: [I(v0, v1), O(v1, v2)], conc: O(v0, v2) },
 { prem: [I(v0, A(v1, v2)), v0], conc: v2 }
];
const FORMS18C = [
 { prem: [O(v0, v1), I(v0, v2), n2], conc: v1 },
 { prem: [I(v0, v1), I(v1, v2), v2], conc: v0 },
 { prem: [I(v0, v1), I(v1, v2), n0], conc: n2 },
 { prem: [v0, I(v0, v1), I(v1, v2)], conc: v2 },
 { prem: [I(v0, v1), I(v2, v1), v1], conc: v0 },
 { prem: [I(v0, v1), I(v0, v2), n1], conc: n2 },
 { prem: [O(v0, v1), I(v0, v2), I(v1, v2)], conc: v2 }
];
const FORMS18D = [
 { prem: [I(v0, v1), I(v1, v2), I(v2, v3)], conc: I(v0, v3) },
 { prem: [O(v0, v1), I(v0, v2), I(v1, v3)], conc: O(v2, v3) },
 { prem: [I(v0, v2), I(v1, v3), O(v2, v3)], conc: O(v0, v1) },
 { prem: [I(A(v0, v1), v2), I(v2, v3), n3], conc: O(n0, n1) },
 { prem: [I(v0, v1), I(v2, v3), O(n1, n3)], conc: O(n0, n2) },
 { prem: [O(v0, v1), O(n0, v2), O(n1, v3)], conc: O(v2, v3) },
 { prem: [I(v0, v1), I(v3, v2), O(v1, v2)], conc: O(v0, v3) },
 { prem: [E(v0, v1), E(v2, v3), O(v0, v2)], conc: A(v1, v3) },
 { prem: [I(O(v0, v1), v2), I(v2, v3), v0], conc: v3 },
 { prem: [I(v0, v1), I(v1, v2), I(v2, v3)], conc: I(v3, v0) },
 { prem: [O(v0, v1), I(v0, v2), I(v1, v3)], conc: A(v2, v3) },
 { prem: [I(v0, A(v1, v2)), I(v2, v3), n3], conc: n0 }
];
/* q18d renames the four letters by one of the 24 orders (ORD4[pm][i] is the letter that form letter i becomes; 0 keeps p, q, r, s). */
const ORD4 = (() => { const out = [], go = (pre, rest) => { if (!rest.length) out.push(pre); rest.forEach((x, i) => go([...pre, x], rest.filter((_, j) => j !== i))); }; go([], [0, 1, 2, 3]); return out; })();
const rename = (s, m) => s.k === 'v' ? V(m[s.i], s.neg) : s.k === 'not' ? N(rename(s.a, m)) : { k: s.k, a: rename(s.a, m), b: rename(s.b, m) };

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The quartermaster’s argument',
 brief: 'The quartermaster has argued for a change to the stores plan, and the review wants to know if the conclusion truly follows.',
 labels: ['rows with every premise true', 'of those, rows with a false conclusion', 'valid (1) or not (0)'], tolerance: 0.01,
 gl: [['rows with every premise true'], ['rows with a false conclusion'], ['valid (1) or not (0)']]
}, {
 canonical: { f: 3, at: [2, 3, 6] },
 draw: R => ({ f: R.int(0, FORMS18B.length - 1), at: sample(R, ATOM_IDS, 3) }),
 build: ({ f, at }) => { const F = FORMS18B[f], w = argWork(3, F.prem, F.conc); return {
  prompt: `At the stores review the quartermaster argues from facts about three parts of the outpost. Let p be “${lt(at[0])}”, q be “${lt(at[1])}” and r be “${lt(at[2])}”. Premise 1: ${rl(F.prem[0])}. Premise 2: ${rl(F.prem[1])}. Conclusion: ${rl(F.conc)}. Build the truth table over p, q and r (8 rows). Enter the number of rows on which both premises are true, then how many of those rows have a false conclusion, then 1 if the argument is valid or 0 if it is not.`,
  answer: w.answer, hints: ARG_HINTS, solution: w.solution, guidance: w.guidance }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'The visitor’s three premises',
 brief: 'A visitor to the chamber has argued in plain words from three facts, and the council wants it tested before it replies.',
 labels: ['rows with every premise true', 'of those, rows with a false conclusion', 'valid (1) or not (0)'], tolerance: 0.01,
 gl: [['rows with every premise true'], ['rows with a false conclusion'], ['valid (1) or not (0)']]
}, {
 canonical: { f: 0, at: [7, 1, 3] },
 draw: R => ({ f: R.int(0, FORMS18C.length - 1), at: sample(R, ATOM_IDS, 3) }),
 build: ({ f, at }) => { const F = FORMS18C[f], w = argWork(3, F.prem, F.conc); return {
  prompt: `A visitor tells the council: “${F.prem.map(s => cap(wd(s, at)) + '.').join(' ')} So ${wd(F.conc, at)}.” To test it, let p be “${lt(at[0])}”, q be “${lt(at[1])}” and r be “${lt(at[2])}”, and build the truth table over p, q and r (8 rows). Enter the number of rows on which all three premises are true, then how many of those rows have a false conclusion, then 1 if the argument is valid or 0 if it is not.`,
  answer: w.answer, hints: ARG_HINTS, solution: w.solution, guidance: w.guidance }; }
});

mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', title: 'Four lamps, three premises',
 brief: 'The council board has four lamps and a speaker who argues from three rules about them, so the table has to be built bigger than usual.',
 labels: ['rows with every premise true', 'of those, rows with a false conclusion', 'valid (1) or not (0)'], tolerance: 0.01, uses: 'q07',
 gl: [['rows with every premise true'], ['rows with a false conclusion'], ['valid (1) or not (0)']]
}, {
 canonical: { f: 2, pm: 0 },
 draw: R => { let p; do { p = { f: R.int(0, FORMS18D.length - 1), pm: R.int(0, 23) }; } while (p.f === 2 && p.pm === 0); return p; },
 build: ({ f, pm }) => { const m = ORD4[pm], F = { prem: FORMS18D[f].prem.map(s => rename(s, m)), conc: rename(FORMS18D[f].conc, m) }, w = argWork(4, F.prem, F.conc); return {
  prompt: `Four lamps on the council board are each lit (1) or dark (0): p, q, r and s. A speaker argues: premise 1, ${rl(F.prem[0])}; premise 2, ${rl(F.prem[1])}; premise 3, ${rl(F.prem[2])}; so, conclusion: ${rl(F.conc)}. Four letters give 16 rows. Build the truth table over p, q, r and s. Enter the number of rows on which all three premises are true, then how many of those rows have a false conclusion, then 1 if the argument is valid or 0 if it is not.`,
  answer: w.answer, hints: ARG_HINTS, solution: w.solution, guidance: w.guidance }; }
});

/* ---- q19 Modus ponens and modus tollens [CM 2.7, Levin 3.1] ---- */

/* One case "if X then Y": t 0 = fact states X (modus ponens), t 1 = fact denies Y (modus tollens). */
const case19 = ([x, sx, y, sy, t]) => {
 const rule = `If ${lt(x, sx)}, then ${lt(y, sy)}`;
 if (t === 0) { const v = sy ? 0 : 1; return { rule, fact: lt(x, sx), asked: lt(y), v, num: 1,
  why: `The fact states the “if” part of the rule, so modus ponens (rule 1) makes its “then” part true: ${sy ? `“${lt(y, sy)}” is true, so “${lt(y)}” is false (0)` : `“${lt(y)}” is true (1)`}.` }; }
 const v = sx ? 1 : 0;
 return { rule, fact: lt(y, !sy), asked: lt(x), v, num: 2,
  why: `The fact denies the “then” part of the rule, so modus tollens (rule 2) makes its “if” part false: ${sx ? `“${lt(x, sx)}” is false, so “${lt(x)}” is true (1)` : `“${lt(x)}” is false (0)`}.` };
};

mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'Three log entries',
 brief: 'Three entries in the maintenance log each give a standing rule and one fact, and the council needs what each one forces.',
 labels: ['entry 1 truth value', 'entry 1 rule number', 'entry 2 truth value', 'entry 2 rule number', 'entry 3 truth value', 'entry 3 rule number'], tolerance: 0.01,
 gl: [['entry 1 truth value', 'entry 1 rule number'], ['entry 2 truth value', 'entry 2 rule number'], ['entry 3 truth value', 'entry 3 rule number']]
}, {
 canonical: { c: [[4, 0, 8, 0, 0], [9, 1, 11, 0, 1], [6, 0, 0, 1, 1]] },
 /* Never the worked example of q19 (rover docked → battery charging, battery not charging). */
 draw: R => { let p; do { const at = sample(R, ATOM_IDS, 6), ty = shuffle(R, [0, 1, R.int(0, 1)]); p = { c: [0, 1, 2].map(j => [at[2 * j], R.int(0, 1), at[2 * j + 1], R.int(0, 1), ty[j]]) }; } while (p.c.some(c => c.join() === '10,0,6,0,1')); return p; },
 build: ({ c }) => { const k = c.map(case19); return {
  prompt: `Three entries in the maintenance log come before the council. ${k.map((e, i) => `Entry ${n(i + 1)}: the rule is “${e.rule}”, and the log shows that ${e.fact}. Which truth value is forced on “${e.asked}”?`).join(' ')} The rules of inference: 1: modus ponens; 2: modus tollens. For each entry in order, enter the truth value (1 or 0) the facts force on the sentence asked about, then the number of the rule of inference used.`,
  answer: k.flatMap(e => [e.v, e.num]),
  hints: ['Modus ponens: from “if X, then Y” and X, conclude Y. Modus tollens: from “if X, then Y” and “not Y”, conclude “not X”.', 'For each entry, check whether the fact matches the “if” part of the rule or contradicts the “then” part. The sentence you are asked about may be the opposite of the part you concluded.'],
  solution: k.map((e, i) => `Entry ${n(i + 1)}: ${e.why}`).join(' '),
  guidance: k.map((e, i) => ({ prompt: `Entry ${n(i + 1)}: the rule is “${e.rule}” and the log shows that ${e.fact}. What truth value does that force on “${e.asked}”, and which rule of inference gives it? (1: modus ponens; 2: modus tollens.)`, answer: [e.v, e.num], explanation: e.why })) }; }
});

mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'The two-link rule chain',
 brief: 'Two rules are posted in the pump room, one feeding the next, and the council needs what a single log fact forces all the way along.',
 labels: ['middle sentence truth value', 'end sentence truth value', 'rule of inference number'], tolerance: 0.01,
 gl: [['middle sentence truth value'], ['end sentence truth value'], ['rule of inference number']]
}, {
 canonical: { x: 0, y: 1, z: 6, sx: 0, sy: 1, sz: 0, mp: 0 },
 draw: R => { const [x, y, z] = sample(R, ATOM_IDS, 3); return { x, y, z, sx: R.int(0, 1), sy: R.int(0, 1), sz: R.int(0, 1), mp: R.int(0, 1) }; },
 build: ({ x, y, z, sx, sy, sz, mp }) => {
  const mid = lt(y), end = lt(mp ? z : x), fact = mp ? lt(x, sx) : lt(z, !sz);
  const vm = mp ? (sy ? 0 : 1) : (sy ? 1 : 0), ve = mp ? (sz ? 0 : 1) : (sx ? 1 : 0), num = mp ? 1 : 2;
  const why1 = mp ? `The log states the “if” part of rule 1, “${lt(x, sx)}”, so modus ponens makes “${lt(y, sy)}” true${sy ? `, so “${mid}” is false (0)` : ' (1)'}.` : `The log denies the “then” part of rule 2, “${lt(z, sz)}”, so modus tollens makes “${lt(y, sy)}” false${sy ? `, so “${mid}” is true (1)` : ' (0)'}.`;
  const why2 = mp ? `Now “${lt(y, sy)}” is true and is the “if” part of rule 2, so modus ponens makes “${lt(z, sz)}” true${sz ? `, so “${end}” is false (0)` : ' (1)'}.` : `Now “${lt(y, sy)}” is false and denies the “then” part of rule 1, so modus tollens makes “${lt(x, sx)}” false${sx ? `, so “${end}” is true (1)` : ' (0)'}.`;
  const why3 = mp ? 'Each step states an “if” part and concludes the “then” part: modus ponens, rule 1.' : 'Each step denies a “then” part and concludes that the “if” part is false: modus tollens, rule 2.';
  return {
  prompt: `Two rules are posted in the pump room. Rule 1: “If ${lt(x, sx)}, then ${lt(y, sy)}.” Rule 2: “If ${lt(y, sy)}, then ${lt(z, sz)}.” The log shows that ${fact}. The rules of inference: 1: modus ponens; 2: modus tollens. Use the rules one after the other. Enter the truth value (1 or 0) forced on “${mid}”, then the truth value forced on “${end}”, then the number of the rule of inference used at both steps.`,
  answer: [vm, ve, num],
  hints: ['Start from the rule that touches the fact in the log. Decide whether the fact states an “if” part (modus ponens) or denies a “then” part (modus tollens).', 'The sentence you conclude from the first rule is the fact that feeds the second rule. The sentence asked about may be the opposite of the one in the rule.'],
  solution: `${why1} ${why2} ${why3}`,
  guidance: [
   { prompt: `Use the rule that touches the log fact. What truth value is forced on “${mid}”?`, answer: [vm], explanation: why1 },
   { prompt: `Now use the new fact with the other rule. What truth value is forced on “${end}”?`, answer: [ve], explanation: why2 },
   { prompt: 'Which rule of inference was used at both steps? (1: modus ponens; 2: modus tollens.)', answer: [num], explanation: why3 }
  ] }; }
});

/* Case types for q19d: what the facts say and which sentence is asked about. */
const case19d = (ty, a, b, c) => {
 const rule = `If ${lt(a)} and ${lt(b)}, then ${lt(c)}`;
 switch (ty) {
  case 0: return { rule, fact: `${lt(a)} and ${lt(b)}`, asked: lt(c), v: 1, why: `Both parts of the “if” part are true, so modus ponens makes “${lt(c)}” true: 1.` };
  case 1: return { rule, fact: `${lt(a)} and ${lt(c, true)}`, asked: lt(b), v: 0, why: `The “then” part is false, so modus tollens says the “if” part “${lt(a)} and ${lt(b)}” is false. “${lt(a)}” is true, so “${lt(b)}” has to be false: 0.` };
  case 2: return { rule, fact: `${lt(b)} and ${lt(c, true)}`, asked: lt(a), v: 0, why: `The “then” part is false, so modus tollens says the “if” part “${lt(a)} and ${lt(b)}” is false. “${lt(b)}” is true, so “${lt(a)}” has to be false: 0.` };
  case 3: return { rule, fact: `${lt(a)} and ${lt(c)}`, asked: lt(b), v: 2, why: `The “then” part is true, which the rule allows whether or not the “if” part is true, so “${lt(b)}” could be either. The facts do not settle it: 2.` };
  default: return { rule, fact: lt(a, true), asked: lt(c), v: 2, why: `Only one part of the “if” part is known, and it is false, so the rule says nothing about “${lt(c)}”: denying the “if” part proves nothing. The facts do not settle it: 2.` };
 }
};

mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', title: 'Rules with two conditions',
 brief: 'Three posted rules each need two conditions to hold, and the council must say what a partial log really settles.',
 labels: ['case 1 (1, 0 or 2)', 'case 2 (1, 0 or 2)', 'case 3 (1, 0 or 2)'], tolerance: 0.01, uses: 'q03',
 gl: [['case 1 (1, 0 or 2)'], ['case 2 (1, 0 or 2)'], ['case 3 (1, 0 or 2)']]
}, {
 canonical: { ty: [1, 3, 0], at: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
 draw: R => ({ ty: sample(R, [0, 1, 2, 3, 4], 3), at: sample(R, ATOM_IDS, 9) }),
 build: ({ ty, at }) => { const k = ty.map((t, i) => case19d(t, at[3 * i], at[3 * i + 1], at[3 * i + 2])); return {
  prompt: `Three standing rules in the chamber each have two conditions in the “if” part. ${k.map((e, i) => `Case ${n(i + 1)}: the rule is “${e.rule}”, and the log shows that ${e.fact}. Is “${e.asked}” settled?`).join(' ')} For each case, in order, enter 1 if the facts force that sentence to be true, 0 if they force it to be false, or 2 if the facts do not settle it.`,
  answer: k.map(e => e.v),
  hints: ['The “if” part “X and Y” is true only when both X and Y are true. Use modus ponens when the log gives all of it, and modus tollens when the log denies the “then” part.', 'If the log leaves the sentence free to be true or false, nothing forces it. Affirming the “then” part, or denying a piece of the “if” part, proves nothing.'],
  solution: k.map((e, i) => `Case ${n(i + 1)}: ${e.why}`).join(' '),
  guidance: k.map((e, i) => ({ prompt: `Case ${n(i + 1)}: the rule is “${e.rule}”, and the log shows that ${e.fact}. Enter 1 if “${e.asked}” is forced true, 0 if forced false, 2 if the facts do not settle it.`, answer: [e.v], explanation: e.why })) }; }
});

/* ---- q20 Chains of reasoning and fallacies [CM 2.7] ---- */

const FORMS20 = [
 { name: 'modus ponens', prem: [I(v0, v1), v0], conc: v1 },
 { name: 'modus tollens', prem: [I(v0, v1), n1], conc: n0 },
 { name: 'the chain rule', prem: [I(v0, v1), I(v1, v2)], conc: I(v0, v2) },
 { name: 'affirming the conclusion', prem: [I(v0, v1), v1], conc: v0 },
 { name: 'denying the hypothesis', prem: [I(v0, v1), n0], conc: n1 },
 { name: 'a chain read backwards', prem: [I(v0, v1), I(v1, v2)], conc: I(v2, v0) }
];
const FORMS20D = [
 { prem: [I(v0, v1), I(n2, n1)], conc: I(v0, v2) },
 { prem: [I(v0, v1), I(v2, n1)], conc: I(v2, n0) },
 { prem: [I(n0, v1), n1], conc: v0 },
 { prem: [I(v0, n1), v1], conc: n0 },
 { prem: [I(v0, v1), I(n2, n1)], conc: I(v2, v0) },
 { prem: [I(n0, v1), v1], conc: n0 },
 { prem: [I(v0, n1), n1], conc: v0 },
 { prem: [I(v0, n1), I(v2, v1)], conc: I(v0, v2) }
];
const span = (a, b) => a === b ? `sentence ${n(a)}` : `sentences ${n(a)} to ${n(b)}`;
const argText = (F, at) => `${F.prem.map(s => cap(wd(s, at)) + '.').join(' ')} So ${wd(F.conc, at)}.`;

mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Four speeches at the review',
 brief: 'Four speakers at the station review each made a tidy case, and the chair needs to know which ones hold up and which only sound it.',
 labels: ['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)', 'argument 4 (1 or 0)'], tolerance: 0.01,
 gl: [['argument 1 (1 or 0)', 'argument 2 (1 or 0)'], ['argument 3 (1 or 0)', 'argument 4 (1 or 0)']]
}, {
 canonical: { fs: [3, 2, 5, 1], at: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
 /* Never the worked example of q20 (affirming the conclusion: rover docked → battery charging). */
 draw: R => { let p; do { p = { fs: sample(R, [0, 1, 2, 3, 4, 5], 4), at: shuffle(R, ATOM_IDS) }; } while (p.fs.some((f, i) => f === 3 && p.at[3 * i] === 10 && p.at[3 * i + 1] === 6)); return p; },
 build: ({ fs, at }) => {
  const Fs = fs.map(i => FORMS20[i]), val = Fs.map(F => isValid(F, 3) ? 1 : 0);
  const why = (F, v) => v ? `it is ${F.name}, which is valid` : `it is ${F.name}, a fallacy`;
  return {
  prompt: `Four speeches at the station review. ${Fs.map((F, i) => `Argument ${n(i + 1)}: ${argText(F, at.slice(3 * i, 3 * i + 3))}`).join(' ')} Enter 1 if the argument is valid or 0 if it is a fallacy, for arguments 1, 2, 3 and 4 in that order.`,
  answer: val,
  hints: ['Match each argument to a pattern. Valid: modus ponens, modus tollens, the chain rule. Fallacies: affirming the conclusion, denying the hypothesis, a chain read backwards.', 'Look at which sentences the facts state or deny, and in which order a chain runs. A pattern with the right pieces in the wrong places is a fallacy.'],
  solution: Fs.map((F, i) => `Argument ${n(i + 1)}: ${why(F, val[i])} (${val[i]}).`).join(' '),
  guidance: [
   { prompt: `${argText(Fs[0], at.slice(0, 3))} Valid (1) or a fallacy (0)? Then the same for: ${argText(Fs[1], at.slice(3, 6))}`, answer: [val[0], val[1]], explanation: `Argument 1: ${why(Fs[0], val[0])}. Argument 2: ${why(Fs[1], val[1])}.` },
   { prompt: `${argText(Fs[2], at.slice(6, 9))} Valid (1) or a fallacy (0)? Then the same for: ${argText(Fs[3], at.slice(9, 12))}`, answer: [val[2], val[3]], explanation: `Argument 3: ${why(Fs[2], val[2])}. Argument 4: ${why(Fs[3], val[3])}.` }
  ] }; }
});

mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'The chain on the pump-room wall',
 brief: 'A long chain of rules is posted on the pump-room wall, and a single log fact somewhere along it should settle part of the chain.',
 labels: ['other sentences forced', 'truth value forced', 'clerk’s shortcut valid (1) or fallacy (0)'], tolerance: 0.01,
 gl: [['other sentences forced'], ['truth value forced'], ['clerk’s shortcut valid (1) or fallacy (0)']]
}, {
 canonical: { L: 4, at: [0, 1, 2, 3, 4], mp: 1, k: 2, j: 4, s: 1, e: 4 },
 draw: R => {
  const L = R.int(3, 5), mp = R.int(0, 1), k = R.int(1, L - 1), s = R.int(0, L);
  let e = R.int(0, L - 1); if (e >= s) e++;
  return { L, at: sample(R, ATOM_IDS, L + 1), mp, k, j: mp ? R.int(k + 1, L) : R.int(0, k - 1), s, e };
 },
 build: ({ L, at, mp, k, j, s, e }) => {
  const rules = []; for (let i = 0; i < L; i++) rules.push(`Rule ${n(i + 1)}: “If ${lt(at[i])}, then ${lt(at[i + 1])}.”`);
  const forced = mp ? L - k : k, v = mp ? 1 : 0, ok = s < e ? 1 : 0, fact = lt(at[k], !mp);
  const why1 = mp ? `The fact states “${lt(at[k])}”, so modus ponens along the chain makes every later sentence true: ${span(k + 2, L + 1)} of the chain, which is ${n(L - k)} ${L - k === 1 ? 'other' : 'others'}. The earlier sentences are not forced.` : `The fact denies “${lt(at[k])}”, so modus tollens back along the chain makes every earlier sentence false: ${span(1, k)} of the chain, which is ${n(k)} ${k === 1 ? 'other' : 'others'}. The later sentences are not forced.`;
  const why2 = `The sentence “${lt(at[j])}” comes ${mp ? 'after' : 'before'} the one in the log, so it is forced ${v ? 'true (1)' : 'false (0)'}.`;
  const why3 = ok ? `The chain rule links the rules end to end, so from “${lt(at[s])}” you may go to “${lt(at[e])}”, which is later in the chain: valid (1).` : `That runs the chain backwards, from a later sentence to an earlier one, and the chain rule does not allow that: a fallacy (0).`;
  return {
  prompt: `A chain of rules is posted on the pump-room wall. ${rules.join(' ')} The log shows that ${fact}. Using the rules one after the other, how many other sentences in the chain does this fact force to a definite truth value, and what truth value (1 or 0) is forced on “${lt(at[j])}”? Then a clerk shortens the chain to one rule: “If ${lt(at[s])}, then ${lt(at[e])}.” Enter the number of other sentences, then the truth value, then 1 if the clerk’s rule follows from the chain or 0 if it is a fallacy.`,
  answer: [forced, v, ok],
  hints: ['The fact sits on one sentence of the chain. Follow it forward with modus ponens if it states a sentence, or backward with modus tollens if it denies one. Sentences on the other side are not forced.', 'The chain rule joins the rules end to end, so a single rule from an earlier sentence to a later one is valid. A rule from a later sentence back to an earlier one is not.'],
  solution: `${why1} ${why2} ${why3}`,
  guidance: [
   { prompt: 'How many other sentences in the chain does the log fact force to a definite truth value?', answer: [forced], explanation: why1 },
   { prompt: `What truth value (1 or 0) is forced on “${lt(at[j])}”?`, answer: [v], explanation: why2 },
   { prompt: `Is the clerk’s rule “If ${lt(at[s])}, then ${lt(at[e])}” valid (1) or a fallacy (0)?`, answer: [ok], explanation: why3 }
  ] }; }
});

mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', title: 'Six arguments, two disguises',
 brief: 'Six arguments reach the chamber with negatives tucked into the rules, and the chair wants the sound ones separated from the fallacies.',
 labels: ['valid arguments', 'number of the first fallacy'], tolerance: 0.01, uses: 'q13',
 gl: [['valid among arguments 1 to 3'], ['valid among arguments 4 to 6'], ['number of the first fallacy']]
}, {
 canonical: { fs: [0, 5, 1, 4, 3, 6], at: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 3, 5, 1, 6, 9] },
 draw: R => ({ fs: sample(R, [0, 1, 2, 3, 4, 5, 6, 7], 6), at: [0, 1, 2, 3, 4, 5].flatMap(() => sample(R, ATOM_IDS, 3)) }),
 build: ({ fs, at }) => {
  const Fs = fs.map(i => FORMS20D[i]), val = Fs.map(F => isValid(F, 3) ? 1 : 0), nv = val.reduce((a, b) => a + b, 0);
  const first = val.indexOf(0) + 1, a3 = val[0] + val[1] + val[2], b3 = val[3] + val[4] + val[5];
  const txt = i => argText(Fs[i], at.slice(3 * i, 3 * i + 3));
  return {
  prompt: `Six arguments come before the chamber. ${Fs.map((F, i) => `Argument ${n(i + 1)}: ${txt(i)}`).join(' ')} Some rules use “not” in their parts, so take care: a rule “if p, then q” and its contrapositive “if not q, then not p” say the same thing. Enter how many of the six arguments are valid, then the number of the first argument that is a fallacy.`,
  answer: [nv, first],
  hints: ['Write each rule in letters, with “not” as ¬, and look for the valid patterns: modus ponens, modus tollens, the chain rule. A rule with a ¬ in it may need turning into its contrapositive first.', 'A rule given in one direction and a conclusion in the opposite direction, or a fact that matches the wrong part of the rule, is a fallacy. If you are unsure, check every row of a three-letter truth table for true premises and a false conclusion.'],
  solution: `${Fs.map((F, i) => `${i ? 'argument' : 'Argument'} ${n(i + 1)} is ${val[i] ? 'valid (1)' : 'a fallacy (0)'}`).join('; ')}. That makes ${n(nv)} valid arguments, and the first fallacy is argument ${n(first)}. (Each was checked for a row with every premise true and the conclusion false.)`,
  guidance: [
   { prompt: `How many of arguments 1, 2 and 3 are valid? ${[0, 1, 2].map(i => `Argument ${n(i + 1)}: ${txt(i)}`).join(' ')}`, answer: [a3], explanation: `${[0, 1, 2].map(i => `${i ? 'argument' : 'Argument'} ${n(i + 1)}: ${val[i] ? 'valid' : 'a fallacy'}`).join('; ')}, so ${n(a3)} are valid.` },
   { prompt: `How many of arguments 4, 5 and 6 are valid? ${[3, 4, 5].map(i => `Argument ${n(i + 1)}: ${txt(i)}`).join(' ')}`, answer: [b3], explanation: `${[3, 4, 5].map(i => `${i > 3 ? 'argument' : 'Argument'} ${n(i + 1)}: ${val[i] ? 'valid' : 'a fallacy'}`).join('; ')}, so ${n(b3)} are valid.` },
   { prompt: 'What is the number of the first argument, counting from 1, that is a fallacy?', answer: [first], explanation: `Argument ${n(first)} is the first one with a valid pattern missing: a fallacy.` }
  ] }; }
});

})();
