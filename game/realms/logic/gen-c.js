/* Logic and proof mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A shuffled copy of a list, drawn from R (Fisher–Yates). */
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
/* "a", "a and b", "a, b and c". */
const and = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
/* A numbered list for a choice question: "(1) … (2) …". */
const choices = items => items.map((s, i) => `(${i + 1}) ${s}`).join(' ');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const tv = b => b ? 1 : 0;

/* q21: a key chart, rows = airlocks 1–4, columns = keys 1–4, 1 = the key opens the airlock. */
const chart = grid => grid.map((row, i) => `airlock ${i + 1}: ${row.join(' ')}`).join('; ');
const keysOf = row => row.map((v, j) => v ? j + 1 : 0).filter(Boolean);
const rowText = (row, i) => { const k = keysOf(row); return `airlock ${i + 1} ${k.length ? `is opened by key${k.length > 1 ? 's' : ''} ${and(k.map(String))}` : 'has no key'}`; };
const colText = (grid, j) => { const a = grid.map((row, i) => row[j] ? i + 1 : 0).filter(Boolean); return `key ${j + 1} opens ${a.length ? `airlock${a.length > 1 ? 's' : ''} ${and(a.map(String))}` : 'no airlock'}`; };
const keyFacts = grid => { const withKey = grid.filter(r => r.some(Boolean)).length, masters = [0, 1, 2, 3].filter(j => grid.every(r => r[j])).length;
 return { withKey, masters, A: tv(withKey === grid.length), B: tv(masters > 0) }; };

/* q22: three delegates; a statement is true or false for an assignment v (true = knight). */
const NAMES = ['Ada', 'Bo', 'Cal'];
const said = (st, s) => { const X = NAMES[st.x], Y = NAMES[st.y]; switch (st.k) {
 case 'K': return `${X} is a knight`; case 'N': return `${X} is a knave`;
 case 'BOTH': return `${X} and ${Y} are both knights`; case 'ONEKNAVE': return `At least one of ${X} and ${Y} is a knave`;
 case 'SAME': return `${X} and I are the same kind`; case 'DIFF': return `${X} and I are different kinds`;
 default: return st.c === 0 ? 'None of us three is a knight' : `Exactly ${st.c === 1 ? 'one' : 'two'} of us three ${st.c === 1 ? 'is a knight' : 'are knights'}`; } };
const truth = (st, s, v) => { switch (st.k) {
 case 'K': return v[st.x]; case 'N': return !v[st.x]; case 'BOTH': return v[st.x] && v[st.y]; case 'ONEKNAVE': return !v[st.x] || !v[st.y];
 case 'SAME': return v[st.x] === v[s]; case 'DIFF': return v[st.x] !== v[s]; default: return v.filter(Boolean).length === st.c; } };
/* The 8 rows in truth-table order: Ada, Bo, Cal; knight before knave. */
const ROWS = [0, 1, 2, 3, 4, 5, 6, 7].map(i => [!(i & 4), !(i & 2), !(i & 1)]);
const fitsAt = (sts, v, upTo) => sts.slice(0, upTo).every((st, s) => truth(st, s, v) === v[s]);
const kindList = v => v.map((b, i) => `${NAMES[i]} ${b ? 'knight' : 'knave'}`).join(', ');
const knights = c => c === 0 ? 'there are no knights' : c === 1 ? 'there is 1 knight' : `there are ${c} knights`;

/* q23: argument forms over three outpost sentences [p, not p], [q, not q], [r, not r]. */
const TOPICS = [
 [['the dome pressure falls', 'the dome pressure does not fall'], ['the alarm sounds', 'the alarm does not sound'], ['the crew seals the hatch', 'the crew does not seal the hatch']],
 [['the solar array is shaded', 'the solar array is not shaded'], ['the batteries drain', 'the batteries do not drain'], ['the heaters switch off', 'the heaters do not switch off']],
 [['the rover is late', 'the rover is not late'], ['the supply run is delayed', 'the supply run is not delayed'], ['the kitchen rations the flour', 'the kitchen does not ration the flour']],
 [['the filter clogs', 'the filter does not clog'], ['the water tastes of iron', 'the water does not taste of iron'], ['the council orders a new filter', 'the council does not order a new filter']]
];
const FORMS = {
 MP: { valid: 1, name: 'modus ponens', shape: 'p → q, p, so q', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(p[0])}. So ${q[0]}.` },
 MT: { valid: 1, name: 'modus tollens', shape: 'p → q, ¬q, so ¬p', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(q[1])}. So ${p[1]}.` },
 CH: { valid: 1, name: 'the chain rule', shape: 'p → q, q → r, so p → r', text: ([p, q, r]) => `If ${p[0]}, then ${q[0]}. If ${q[0]}, then ${r[0]}. So if ${p[0]}, then ${r[0]}.` },
 AC: { valid: 0, name: 'affirming the conclusion, a fallacy', shape: 'p → q, q, so p', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(q[0])}. So ${p[0]}.` },
 DH: { valid: 0, name: 'denying the hypothesis, a fallacy', shape: 'p → q, ¬p, so ¬q', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(p[1])}. So ${q[1]}.` }
};

/* q25: the direct proof that odd × odd is odd, step by step, and the wrong steps offered beside the right one. */
const ODD_STEPS = [
 'Assume m and n are odd whole numbers.',
 'By the definition of odd, m = 2a + 1 and n = 2b + 1 for some whole numbers a and b.',
 'Multiply out: m × n = (2a + 1)(2b + 1) = 4ab + 2a + 2b + 1.',
 'Take 2 out of the first three terms: m × n = 2(2ab + a + b) + 1.',
 'The bracket 2ab + a + b is a whole number, so m × n is odd by the definition of odd. ∎'
];
const ODD_JOB = ['', 'turns “odd” into equations, using the definition', 'multiplies the two forms out', 'takes 2 out to reach the form 2k + 1', 'reads the conclusion off the definition of odd'];
const ODD_NEED = ['', 'turn “odd” into equations, using the definition', 'multiply the two forms out', 'take 2 out to reach the form 2k + 1', 'read the conclusion off the definition of odd'];
const ODD_WRONG = [
 ['Check one case: 3 × 5 = 15, which is odd, so it holds every time.', 'checks one example, and an example is not a proof for every m and n'],
 ['By the definition of odd, m = 2a + 1 and n = 2a + 1 for one whole number a.', 'uses the same a for both numbers, which would force m = n'],
 ['So m × n is even.', 'states the opposite of the conclusion'],
 ['Assume m × n is odd.', 'assumes the conclusion instead of proving it']
];

/* q27: claims proved by contrapositive. even: the conclusion of the contrapositive is "even" (value = 2k), else 2k + 1. */
const CONTRA = [
 { P: 'n² is even', Q: 'n is even', nP: 'n² is odd', nQ: 'n is odd', expr: 'n²', f: x => x * x, even: false, odd: true,
   proof: 'Assume n is odd, so n = 2j + 1 for a whole number j. Then n² = 4j² + 4j + 1 = 2(2j² + 2j) + 1, which is odd. ∎' },
 { P: '3n + 1 is even', Q: 'n is odd', nP: '3n + 1 is odd', nQ: 'n is even', expr: '3n + 1', f: x => 3 * x + 1, even: false, odd: false,
   proof: 'Assume n is even, so n = 2j for a whole number j. Then 3n + 1 = 6j + 1 = 2(3j) + 1, which is odd. ∎' },
 { P: 'n² is odd', Q: 'n is odd', nP: 'n² is even', nQ: 'n is even', expr: 'n²', f: x => x * x, even: true, odd: false,
   proof: 'Assume n is even, so n = 2j for a whole number j. Then n² = 4j² = 2(2j²), which is even. ∎' },
 { P: '5n + 3 is even', Q: 'n is odd', nP: '5n + 3 is odd', nQ: 'n is even', expr: '5n + 3', f: x => 5 * x + 3, even: false, odd: false,
   proof: 'Assume n is even, so n = 2j for a whole number j. Then 5n + 3 = 10j + 3 = 2(5j + 1) + 1, which is odd. ∎' }
];
/* The four statements offered: 0 converse, 1 inverse, 2 contrapositive (the one proved), 3 a wrong mix. */
const contraList = F => [`If ${F.Q}, then ${F.P}.`, `If ${F.nP}, then ${F.nQ}.`, `If ${F.nQ}, then ${F.nP}.`, `If ${F.nQ}, then ${F.P}.`];
const CONTRA_WHY = ['is the converse, with the two parts swapped', 'is the inverse, with both parts negated', 'is the contrapositive', 'swaps the two parts but negates only one of them'];

/* q28 and q29: n² + cn, written with c = −1 as n² − n and c = 1 as n² + n. */
const sq = c => c === 1 ? 'n² + n' : c === -1 ? 'n² − n' : `n² ${c < 0 ? '−' : '+'} ${n(Math.abs(c))}n`;

/* q29: the methods, in the order of the canonical list. */
const METHODS = ['direct proof', 'proof by contrapositive', 'proof by cases'];
/* q29: the rule of thumb stated in the prompt, so that each claim has exactly one right method. */
const RULE29 = 'Use the workshop’s rule of thumb, which picks exactly one method for each claim. If the claim has no hypothesis (no “if” part) and starts “for every whole number n”, use proof by cases, n even and n odd. If the hypothesis is about an expression built from n, such as n² or 3n + 5, and the conclusion is about n alone, use proof by contrapositive. If the hypothesis is about the plain numbers themselves, such as m and n, or a and b, use direct proof.';

/* q30: the smallest prime factor by trying 2, 3, 5, 7, … in turn; the trials that fail, as text. */
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
const spf = N => { for (const q of PRIMES) { if (q * q > N) return N; if (N % q === 0) return q; } return N; };
const trials = (N, p, ps) => PRIMES.filter(q => q < p && q * q <= N && !ps.includes(q)).map(q => { const m = Math.floor(N / q); return `${q} × ${m} = ${q * m} and ${q} × ${m + 1} = ${q * (m + 1)}`; });

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A 4 × 4 key chart. Three kinds of draw: one key opens every airlock (A and B true); every airlock has a key but no
    key opens all (A true, B false); some airlock has no key (A false, B false). B true with A false cannot happen. */
 q21: {
  canonical: { grid: [[0, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 1]] },
  draw: R => { const kind = R.int(0, 2); let grid, f;
   do { grid = [0, 1, 2, 3].map(() => [0, 1, 2, 3].map(() => tv(R.next() < 0.35)));
    if (kind === 0) { const j = R.int(0, 3); grid.forEach(r => { r[j] = 1; }); }
    f = keyFacts(grid);
   } while ((kind === 0 && (f.masters !== 1 || grid.flat().filter(Boolean).length > 9)) || (kind === 1 && !(f.A && !f.B)) || (kind === 2 && !(f.withKey >= 2 && f.withKey <= 3)));
   return { grid }; },
  build: ({ grid }) => { const f = keyFacts(grid); return {
   prompt: `The council keeps a key chart for four airlocks and four keys. Each row is an airlock and lists keys 1 to 4 in order; a 1 means that key opens the airlock and a 0 means it does not. The chart reads ${chart(grid)}. Let x stand for an airlock and y for a key. Statement A is ∀x ∃y (y opens x): for every airlock there is a key that opens it. Statement B is ∃y ∀x (y opens x): there is one key that opens every airlock. Enter the truth value of A (1 for true, 0 for false), then the truth value of B, then the number of airlocks that have at least one key.`,
   answer: [f.A, f.B, f.withKey],
   hints: ['For A, read the chart row by row: every airlock needs at least one 1 in its row, and different airlocks may use different keys.', 'For B, read it column by column: one single key must have a 1 in every row, so every entry in its column would be 1.'],
   solution: `Row by row: ${grid.map(rowText).join('; ')}. So ${f.withKey === 4 ? 'all 4 airlocks have a key' : `only ${n(f.withKey)} of the 4 airlocks have a key`}, and A is ${f.A ? 'true (1): each airlock has its own key, even if the keys differ' : 'false (0): an airlock with no key is a counterexample'}. Column by column: ${[0, 1, 2, 3].map(j => colText(grid, j)).join('; ')}. ${f.B ? `Key ${[0, 1, 2, 3].filter(j => grid.every(r => r[j])).map(j => j + 1).join(' and ')} opens all four, so B is true (1).` : 'No column has a 1 in every row, so no single key opens every airlock and B is false (0).'} ${f.A && !f.B ? 'A is true while B is false: swapping the order of the quantifiers changed the meaning.' : f.B ? 'When B is true, A is true as well: the one key that opens everything is a key for each airlock.' : 'A fails at an airlock with no key, and then B fails too: a key that opened every airlock would open that one.'}`,
   guidance: [
    { prompt: 'Read the chart row by row. How many airlocks have at least one 1 in their row?', answer: [f.withKey], explanation: `${cap(grid.map(rowText).join('; '))}. That makes ${n(f.withKey)} airlocks with a key.` },
    { prompt: 'Now read it column by column. How many keys have a 1 in every row, so that they open all four airlocks?', answer: [f.masters], explanation: `${cap([0, 1, 2, 3].map(j => colText(grid, j)).join('; '))}. ${f.masters ? `So ${n(f.masters)} key${f.masters > 1 ? 's open' : ' opens'} every airlock.` : 'No key opens all four, so the count is 0.'}` },
    { prompt: 'A needs every airlock to have some key; B needs one key that opens them all. What are the truth values of A and B?', answer: [f.A, f.B], explanation: `${f.withKey === 4 ? 'All 4 airlocks have a key, so A is true (1).' : `Only ${n(f.withKey)} of the 4 airlocks have a key, so A is false (0).`} ${f.masters ? 'A key opens every airlock, so B is true (1).' : 'No key opens every airlock, so B is false (0).'}` }
   ] }; }
 },
 /* Each delegate says one statement from the pool; the draw is repeated until exactly one of the 8 rows fits. */
 q22: {
  canonical: { st: [{ k: 'N', x: 1 }, { k: 'N', x: 2 }, { k: 'BOTH', x: 0, y: 1 }] },
  draw: R => { let st;
   do { st = [0, 1, 2].map(s => { const o = [0, 1, 2].filter(i => i !== s), x = R.pick(o), k = R.pick(['K', 'N', 'N', 'BOTH', 'ONEKNAVE', 'SAME', 'DIFF', 'EXACT']);
     return k === 'BOTH' || k === 'ONEKNAVE' ? { k, x: o[0], y: o[1] } : k === 'EXACT' ? { k, c: R.int(0, 2) } : { k, x }; });
   } while (ROWS.filter(v => fitsAt(st, v, 3)).length !== 1 || (st[0].k === 'N' && st[1].k === 'N' && st[2].k === 'BOTH' && st[0].x === 1 && st[1].x === 2));
   return { st }; },
  build: ({ st }) => { const v = ROWS.find(r => fitsAt(st, r, 3)), c = v.filter(Boolean).length, c1 = ROWS.filter(r => fitsAt(st, r, 1)).length, c2 = ROWS.filter(r => fitsAt(st, r, 2)).length;
   const check = st.map((x, s) => `${NAMES[s]} is a ${v[s] ? 'knight' : 'knave'} and says “${said(x, s)}”, which is ${truth(x, s, v) ? 'true' : 'false'}`).join('; ');
   const others = ROWS.filter(r => r !== v).map(r => { const s = [0, 1, 2].find(i => truth(st[i], i, r) !== r[i]); return `${kindList(r)} breaks ${NAMES[s]}’s statement`; }).join('; ');
   return {
   prompt: `Three delegates have come to the council from an island where every knight always tells the truth and every knave always lies. Each of them is one or the other. Ada says: “${said(st[0], 0)}.” Bo says: “${said(st[1], 1)}.” Cal says: “${said(st[2], 2)}.” Exactly one way of making each of them a knight or a knave fits all three statements. Enter 1 if Ada is a knight and 0 if Ada is a knave, then the same for Bo, then for Cal, then the number of knights among the three.`,
   answer: [tv(v[0]), tv(v[1]), tv(v[2]), c],
   hints: ['Treat each delegate like a statement letter, with knight as 1 and knave as 0. Three letters give the 8 rows of a truth table.', 'A row fits when every knight’s statement is true on it and every knave’s statement is false on it. Test the rows one at a time and cross out each row where some statement breaks this rule.'],
   solution: `The row that fits is ${kindList(v)}. Check: ${check}. Every knight told the truth and every knave lied, so ${knights(c)}. Every other row breaks a statement: ${others}.`,
   guidance: [
    { prompt: 'Look at Ada’s statement alone. On how many of the 8 rows does it fit Ada: true where Ada is a knight, false where Ada is a knave?', answer: [c1], explanation: `Ada’s statement, “${said(st[0], 0)}”, fits Ada on ${n(c1)} of the 8 rows. The others are crossed out.` },
    { prompt: 'Keep only the rows where Ada’s statement and Bo’s statement both fit. How many rows are left?', answer: [c2], explanation: `Bo’s statement, “${said(st[1], 1)}”, ${c2 === c1 ? 'crosses out none of them' : 'crosses out more rows'}, and ${n(c2)} ${c2 === 1 ? 'row is' : 'rows are'} left.` },
    { prompt: 'Test Cal’s statement on the rows that are left: one row survives. Enter 1 or 0 for Ada, Bo and Cal on that row, then the number of knights.', answer: [tv(v[0]), tv(v[1]), tv(v[2]), c], explanation: `Only ${kindList(v)} survives Cal’s statement, “${said(st[2], 2)}”, so ${knights(c)}.` }
   ] }; }
 },
 /* Three different forms, at least one valid and one fallacy, each on its own topic; six vote counts and a threshold k. */
 q23: {
  canonical: { forms: ['AC', 'MT', 'CH'], topics: [0, 2, 3], votes: [12, 7, 15, 9, 18, 11], k: 10 },
  draw: R => { let forms;
   do { forms = shuffle(R, Object.keys(FORMS)).slice(0, 3); } while (forms.every(f => FORMS[f].valid) || forms.every(f => !FORMS[f].valid));
   const votes = [0, 1, 2, 3, 4, 5].map(() => R.int(4, 24)), k = R.int(8, 18);
   return { forms, topics: shuffle(R, [0, 1, 2, 3]).slice(0, 3), votes, k }; },
  build: ({ forms, topics, votes, k }) => { const F = forms.map(f => FORMS[f]), codes = F.map(f => f.valid), over = votes.filter(v => v > k);
   const list = forms.map((f, i) => `Argument ${i + 1}: “${FORMS[f].text(TOPICS[topics[i]])}”`).join(' ');
   return {
   prompt: `The council weighs three arguments before it votes. ${list} Enter 1 for each argument that is valid and 0 for each that is a fallacy, in order. Then the chair claims: “There is a session in which more than ${n(k)} members voted yes.” The yes votes in the last six sessions were ${and(votes.map(n))}. Enter the number of sessions that are witnesses to the chair’s claim.`,
   answer: [...codes, over.length],
   hints: ['Write each argument with letters, p for its first sentence, q for the next and r for a third, then match it to a form you know. Modus ponens, modus tollens and the chain rule are valid; affirming the conclusion and denying the hypothesis are fallacies.', `A witness is one session that makes the “there is” claim true. Count every session with more than ${n(k)} yes votes; a session with exactly ${n(k)} does not count.`],
   solution: `${F.map((f, i) => `Argument ${i + 1} has the form ${f.shape}: ${f.name}, so it scores ${f.valid}`).join('. ')}. ${over.length > 1 ? `The yes votes above ${n(k)} are ${and(over.map(n))}, one witness session each` : over.length ? `Only one session, with ${n(over[0])} yes votes, had more than ${n(k)}` : `No session had more than ${n(k)} yes votes`}, so the claim has ${n(over.length)} witness${over.length === 1 ? '' : 'es'}${over.length ? ' and it is true' : ' and it is false'}.`,
   guidance: [
    { prompt: 'Write each argument with letters p, q and r. Is argument 1 valid (1) or a fallacy (0)? Then argument 2, then argument 3.', answer: codes, explanation: F.map((f, i) => `Argument ${i + 1} is ${f.shape}, ${f.name}.`).join(' ') },
    { prompt: `The yes votes were ${and(votes.map(n))}. How many of them are more than ${n(k)}?`, answer: [over.length], explanation: `${over.length ? `${cap(and(over.map(n)))} ${over.length === 1 ? 'is' : 'are'} more than ${n(k)}` : `None of them is more than ${n(k)}`}, so there ${over.length === 1 ? 'is 1 witness' : `are ${n(over.length)} witnesses`}.` }
   ] }; }
 },
 /* n odd from 21 to 199. Each claim a | b is drawn true (b = a × m) or false (b between two multiples of a, or the
    reverse of a true claim, a > b); at least one of each. */
 q24: {
  canonical: { n: 37, pairs: [[4, 28], [6, 32], [9, 3]] },
  draw: R => { let pairs;
   do { pairs = [0, 1, 2].map(() => { const a = R.int(3, 9), m = R.int(2, 11), kind = R.int(0, 2);
     return kind === 0 ? [a, a * m] : kind === 1 ? [a, a * m + R.int(1, a - 1)] : [a * m, a]; });
   } while (pairs.every(([a, b]) => b % a === 0) || pairs.every(([a, b]) => b % a !== 0));
   return { n: 2 * R.int(10, 99) + 1, pairs }; },
  build: ({ n: N, pairs }) => { const k = (N - 1) / 2, codes = pairs.map(([a, b]) => tv(b % a === 0));
   const why = pairs.map(([a, b]) => { const m = Math.floor(b / a);
    return b % a === 0 ? `${n(b)} = ${n(a)} × ${n(m)}, so ${n(a)} | ${n(b)} is true: 1` : `${n(a)} × ${n(m)} = ${n(a * m)} is too small and ${n(a)} × ${n(m + 1)} = ${n(a * (m + 1))} is too big, so no whole number m gives ${n(b)} = ${n(a)} × m and ${n(a)} | ${n(b)} is false: 0${a > b && a % b === 0 ? ` (${n(b)} | ${n(a)} is true, but that is a different claim)` : ''}`; });
   return {
   prompt: `The proof workshop starts with definitions. A whole number n is odd when n = 2k + 1 for some whole number k. For n = ${n(N)}, enter that k. Next, a | b (read “a divides b”) means b = a × m for some whole number m. Enter 1 if the claim is true and 0 if it is false for each of these three claims, in order: ${n(pairs[0][0])} | ${n(pairs[0][1])}; ${n(pairs[1][0])} | ${n(pairs[1][1])}; ${n(pairs[2][0])} | ${n(pairs[2][1])}.`,
   answer: [k, ...codes],
   hints: ['Take 1 away from n: what is left is 2k, so halve it.', 'For a | b, ask whether b is a times some whole number. a | b is a claim, true or false; it is not the number b ÷ a, and the order matters.'],
   solution: `${n(N)} − 1 = ${n(N - 1)} and ${n(N - 1)} ÷ 2 = ${n(k)}, so ${n(N)} = 2 × ${n(k)} + 1 and k = ${n(k)}. Claim 1: ${why[0]}. Claim 2: ${why[1]}. Claim 3: ${why[2]}.`,
   guidance: [
    { prompt: `${n(N)} − 1 = ${n(N - 1)}. Which whole number k gives 2k = ${n(N - 1)}?`, answer: [k], explanation: `${n(N - 1)} ÷ 2 = ${n(k)}, so ${n(N)} = 2 × ${n(k)} + 1: ${n(N)} is odd with k = ${n(k)}.` },
    { prompt: 'For each claim a | b, look for a whole number m with b = a × m. Enter 1 or 0 for claim 1, then claim 2, then claim 3.', answer: codes, explanation: `Claim 1: ${why[0]}. Claim 2: ${why[1]}. Claim 3: ${why[2]}.` }
   ] }; }
 },
 /* m = 2a + 1 and n = 2b + 1 with a, b from 2 to 9; gap g is step 2–5; four choices, the right step (id 0) and three
    of the four wrong ones, shuffled. */
 q25: {
  canonical: { a: 5, b: 3, g: 4, cands: [2, 0, 4, 1] },
  draw: R => ({ a: R.int(2, 9), b: R.int(2, 9), g: R.int(2, 5), cands: shuffle(R, [0, ...shuffle(R, [1, 2, 3, 4]).slice(0, 3)]) }),
  build: ({ a, b, g, cands }) => { const m = 2 * a + 1, nn = 2 * b + 1, br = 2 * a * b + a + b, idx = cands.indexOf(0) + 1;
   const text = c => c === 0 ? ODD_STEPS[g - 1] : ODD_WRONG[c - 1][0];
   const steps = ODD_STEPS.map((s, i) => `Step ${i + 1}: ${i + 1 === g ? '(missing)' : s}`).join(' ');
   const wrongs = cands.map((c, i) => c === 0 ? '' : `Choice ${i + 1} ${ODD_WRONG[c - 1][1]}.`).filter(Boolean).join(' ');
   return {
   prompt: `Mira proves the theorem “if m and n are odd, then m × n is odd” with a direct proof, but one step has fallen off the board. ${steps} The choices for the gap are: ${choices(cands.map(text))} For m = ${n(m)} and n = ${n(nn)}, so that a = ${n(a)} and b = ${n(b)}, enter the value of the bracket 2ab + a + b. Then enter the number of the choice that fills the gap.`,
   answer: [br, idx],
   hints: ['Put the numbers into the bracket: 2 × a × b, then add a and add b.', `Read the steps on either side of the gap. Step ${g} has to lead from the one before it to the one after it, using only definitions and algebra.`],
   solution: `With a = ${n(a)} and b = ${n(b)}, 2ab + a + b = 2 × ${n(a)} × ${n(b)} + ${n(a)} + ${n(b)} = ${n(br)}, and indeed ${n(m)} × ${n(nn)} = ${n(m * nn)} = 2 × ${n(br)} + 1. The gap is step ${g}, which ${ODD_JOB[g - 1]}: choice ${idx} says exactly that. ${wrongs}`,
   guidance: [
    { prompt: `Work out the bracket 2ab + a + b with a = ${n(a)} and b = ${n(b)}.`, answer: [br], explanation: `2 × ${n(a)} × ${n(b)} = ${n(2 * a * b)}, and ${n(2 * a * b)} + ${n(a)} + ${n(b)} = ${n(br)}.` },
    { prompt: `Check the theorem on these numbers. What is m × n = ${n(m)} × ${n(nn)}, and what is 2 × ${n(br)} + 1?`, answer: [m * nn, 2 * br + 1], explanation: `${n(m)} × ${n(nn)} = ${n(m * nn)} and 2 × ${n(br)} + 1 = ${n(2 * br + 1)}: the same number, odd as the proof says. One check is not a proof, but it catches a slip in the algebra.` },
    { prompt: `Step ${g} has to ${ODD_NEED[g - 1]}. Which choice does that?`, answer: [idx], explanation: `Choice ${idx}: “${ODD_STEPS[g - 1]}” ${wrongs}` }
   ] }; }
 },
 /* d from 3 to 9, a = d × s and b = d × t with s, t from 2 to 15, s ≠ t; op '−' needs s > t. */
 q26: {
  canonical: { d: 3, s: 9, t: 4, op: '+' },
  draw: R => { let s, t; const op = R.pick(['+', '−']);
   do { s = R.int(2, 15); t = R.int(2, 15); } while (s === t || (op === '−' && s < t) || (s === 9 && t === 4));
   return { d: R.int(3, 9), s, t, op }; },
  build: ({ d, s, t, op }) => { const a = d * s, b = d * t, m = op === '+' ? s + t : s - t, r = op === '+' ? a + b : a - b; return {
   prompt: `The workshop proves the theorem: if d | a and d | b${op === '−' ? ', with a ≥ b (a is at least as big as b)' : ''}, then d | (a ${op} b). The proof: since d | a and d | b, a = d × s and b = d × t for some whole numbers s and t. Then a ${op} b = d × s ${op} d × t = d × (s ${op} t), and s ${op} t is a whole number${op === '−' ? ' (it is not below zero, because a ≥ b means s ≥ t)' : ''}, so d | (a ${op} b). ∎ Follow the proof with d = ${n(d)}, a = ${n(a)} and b = ${n(b)}: enter s, then t, then the whole number m with a ${op} b = ${n(d)}m.`,
   answer: [s, t, m],
   hints: [`Since ${n(d)} | ${n(a)}, ${n(a)} is ${n(d)} times a whole number s, so s = ${n(a)} ÷ ${n(d)}. Find t the same way from b.`, `Take ${n(d)} out of both terms: ${n(d)} × s ${op} ${n(d)} × t = ${n(d)} × (s ${op} t).`],
   solution: `${n(a)} = ${n(d)} × ${n(s)}, so s = ${n(s)}; ${n(b)} = ${n(d)} × ${n(t)}, so t = ${n(t)}. Then ${n(a)} ${op} ${n(b)} = ${n(d)} × ${n(s)} ${op} ${n(d)} × ${n(t)} = ${n(d)} × (${n(s)} ${op} ${n(t)}) = ${n(d)} × ${n(m)}, so m = ${n(m)}. Check: ${n(r)} = ${n(d)} × ${n(m)}, so ${n(d)} | ${n(r)}, as the theorem says.`,
   guidance: [
    { prompt: `${n(d)} | ${n(a)} means ${n(a)} = ${n(d)} × s for a whole number s. What is s?`, answer: [s], explanation: `${n(a)} ÷ ${n(d)} = ${n(s)}, so ${n(a)} = ${n(d)} × ${n(s)}.` },
    { prompt: `${n(d)} | ${n(b)} means ${n(b)} = ${n(d)} × t. What is t?`, answer: [t], explanation: `${n(b)} ÷ ${n(d)} = ${n(t)}, so ${n(b)} = ${n(d)} × ${n(t)}.` },
    { prompt: `The proof says a ${op} b = ${n(d)} × (s ${op} t). What is the whole number m = s ${op} t?`, answer: [m], explanation: `${n(s)} ${op} ${n(t)} = ${n(m)}, and ${n(d)} × ${n(m)} = ${n(r)} = ${n(a)} ${op} ${n(b)}.` }
   ] }; }
 },
 /* Family f of CONTRA; four statements shuffled; x is the number to check, of the kind the contrapositive assumes
    (odd for family 0, even for the others), from 4 to 40 and with a value below 1000. */
 q27: {
  canonical: { f: 0, order: [1, 3, 2, 0], x: 9 },
  draw: R => { const f = R.int(0, 3), F = CONTRA[f]; let x;
   do { x = F.odd ? 2 * R.int(2, 15) + 1 : 2 * R.int(2, 20); } while (F.f(x) >= 1000);
   return { f, order: shuffle(R, [0, 1, 2, 3]), x }; },
  build: ({ f, order, x }) => { const F = CONTRA[f], list = contraList(F), idx = order.indexOf(2) + 1, v = F.f(x), k = F.even ? v / 2 : (v - 1) / 2;
   const form = F.even ? '2k' : '2k + 1', kind = F.even ? 'even' : 'odd';
   return {
   prompt: `A regulation says: “If ${F.P}, then ${F.Q}.” A direct attack is awkward, so Mira writes: “${F.proof}” Which statement have those lines proved? ${choices(order.map(i => list[i]))} Enter the number of that statement. Then check it for n = ${n(x)}: enter the value of ${F.expr}, then the whole number k with ${F.expr} = ${form}.`,
   answer: [idx, v, k],
   hints: ['Read the first and last sentences of Mira’s lines: what is assumed becomes the hypothesis, and what is reached becomes the conclusion.', `Put n = ${n(x)} into ${F.expr}. For the k, ${F.even ? 'halve the value' : 'take away 1 and halve what is left'}.`],
   solution: `Mira assumes “${F.nQ}” and reaches “${F.nP}”, so she has proved statement ${idx}, “If ${F.nQ}, then ${F.nP}”: the contrapositive of the regulation. A statement and its contrapositive are logically equivalent, so the regulation is proved as well. ${order.map((i, j) => i === 2 ? '' : `Statement ${j + 1} ${CONTRA_WHY[i]}.`).filter(Boolean).join(' ')} For n = ${n(x)}, ${F.expr} = ${n(v)} = ${F.even ? `2 × ${n(k)}` : `2 × ${n(k)} + 1`}, which is ${kind}, so k = ${n(k)}.`,
   guidance: [
    { prompt: `Mira’s lines assume “${F.nQ}” and end with “${F.nP}”. Which of the four statements is “If ${F.nQ}, then ${F.nP}”?`, answer: [idx], explanation: `Statement ${idx}. It is the contrapositive of “If ${F.P}, then ${F.Q}”: both parts negated and swapped.` },
    { prompt: `Check the statement for n = ${n(x)}. What is ${F.expr}?`, answer: [v], explanation: `With n = ${n(x)}, ${F.expr} = ${n(v)}.` },
    { prompt: `${n(v)} should be ${kind}. Which whole number k gives ${n(v)} = ${F.even ? '2k' : '2k + 1'}?`, answer: [k], explanation: `${F.even ? `${n(v)} ÷ 2 = ${n(k)}` : `${n(v)} − 1 = ${n(v - 1)} and ${n(v - 1)} ÷ 2 = ${n(k)}`}, so ${n(v)} = ${F.even ? `2 × ${n(k)}` : `2 × ${n(k)} + 1`}.` }
   ] }; }
 },
 /* n² + cn with c odd (−1, 1, 3, 5, 7); e even from 4 to 30, o odd from 3 to 29; not the worked example's n² + n with 6 and 5. */
 q28: {
  canonical: { c: 3, e: 12, o: 9 },
  draw: R => { let p; do { p = { c: R.pick([-1, 1, 3, 5, 7]), e: 2 * R.int(2, 15), o: 2 * R.int(1, 14) + 1 }; } while (p.c === 1 && (p.e === 6 || p.o === 5)); return p; },
  build: ({ c, e, o }) => { const ex = sq(c), ve = e * e + c * e, vo = o * o + c * o; return {
   prompt: `The workshop wants a proof of the claim: for every whole number n, ${ex} is even. Mira’s proof by cases first writes ${ex} = n(n ${c < 0 ? '−' : '+'} ${n(Math.abs(c))}), then splits the whole numbers into kinds that cover them all and shows the claim for each kind. Enter the number of cases the proof needs. Then, as checks, enter the whole number (${ex}) ÷ 2 for n = ${n(e)}, which falls in the even case, and for n = ${n(o)}, which falls in the odd case.`,
   answer: [2, ve / 2, vo / 2],
   hints: ['Every whole number is even or odd, and none is both. Those kinds are the cases.', `Work out ${ex} for the number first, then halve it. The result must be a whole number, because the claim says ${ex} is even.`],
   solution: `Two cases cover every whole number. Case 1, n even: n = 2j, so n(n ${c < 0 ? '−' : '+'} ${n(Math.abs(c))}) = 2j(n ${c < 0 ? '−' : '+'} ${n(Math.abs(c))}) is even. Case 2, n odd: ${n(Math.abs(c))} is odd, and odd ${c < 0 ? '−' : '+'} odd is even, so n ${c < 0 ? '−' : '+'} ${n(Math.abs(c))} is even and so is the product. ∎ For n = ${n(e)}: ${n(e * e)} ${c < 0 ? '−' : '+'} ${n(Math.abs(c * e))} = ${n(ve)}, and ${n(ve)} ÷ 2 = ${n(ve / 2)}. For n = ${n(o)}: ${n(o * o)} ${c < 0 ? '−' : '+'} ${n(Math.abs(c * o))} = ${n(vo)}, and ${n(vo)} ÷ 2 = ${n(vo / 2)}.`,
   guidance: [
    { prompt: 'Whole numbers come in two kinds by evenness. How many cases does the proof need?', answer: [2], explanation: 'Two: n even and n odd. Together they cover every whole number, which a proof by cases must do.' },
    { prompt: `In the even case, take n = ${n(e)}. What is (${ex}) ÷ 2?`, answer: [ve / 2], explanation: `${ex} = ${n(e * e)} ${c < 0 ? '−' : '+'} ${n(Math.abs(c * e))} = ${n(ve)}, and ${n(ve)} ÷ 2 = ${n(ve / 2)}.` },
    { prompt: `In the odd case, take n = ${n(o)}. What is (${ex}) ÷ 2?`, answer: [vo / 2], explanation: `${ex} = ${n(o * o)} ${c < 0 ? '−' : '+'} ${n(Math.abs(c * o))} = ${n(vo)}, and ${n(vo)} ÷ 2 = ${n(vo / 2)}.` }
   ] }; }
 },
 /* Claim kind w: 0 direct (odd + odd is even), 1 direct (5 | a and 5 | b), 2 contrapositive (n² even → n even),
    3 contrapositive (3n + 5 even → n odd), 4 cases (n² + n), 5 cases (n² + 5n). The methods list is shuffled. */
 q29: {
  canonical: { w: 2, order: [2, 0, 1], x: 7, y: 0 },
  draw: R => { const w = R.int(0, 5); let x, y = 0;
   if (w === 0) { x = 2 * R.int(2, 20) + 1; y = 2 * R.int(2, 20) + 1; }
   else if (w === 1) { x = 5 * R.int(2, 30); do { y = 5 * R.int(2, 30); } while (y === x); }
   else if (w === 2) { do { x = 2 * R.int(2, 15) + 1; } while (x === 7); }
   else if (w === 3) x = 2 * R.int(2, 40);
   else x = R.int(3, 30);
   return { w, order: shuffle(R, [0, 1, 2]), x, y }; },
  build: ({ w, order, x, y }) => { const method = [0, 0, 1, 1, 2, 2][w], idx = order.indexOf(method) + 1; let claim, ask, val, work, why;
   if (w === 0) { val = (x + y) / 2; claim = 'If m and n are odd, then m + n is even.'; ask = `the whole number k with m + n = 2k, for m = ${n(x)} and n = ${n(y)}`;
    why = 'The hypothesis hands over usable forms, m = 2a + 1 and n = 2b + 1, and adding them gives 2(a + b + 1) at once, so a direct proof works.';
    work = `${n(x)} + ${n(y)} = ${n(x + y)} = 2 × ${n(val)}, so k = ${n(val)}`; }
   else if (w === 1) { val = (x + y) / 5; claim = 'If 5 | a and 5 | b, then 5 | (a + b).'; ask = `the whole number m with a + b = 5m, for a = ${n(x)} and b = ${n(y)}`;
    why = 'The hypothesis hands over usable forms, a = 5s and b = 5t, and a + b = 5(s + t) follows at once, so a direct proof works.';
    work = `${n(x)} + ${n(y)} = ${n(x + y)} = 5 × ${n(val)}, so m = ${n(val)}`; }
   else if (w === 2) { val = (x * x - 1) / 2; claim = 'If n² is even, then n is even.'; ask = `the whole number k with n² = 2k + 1 that the proof gives for n = ${n(x)}`;
    why = 'Knowing n² = 2k says little about n itself, but the contrapositive “if n is odd, then n² is odd” starts from n = 2j + 1, which is easy to square.';
    work = `the proof assumes n is odd; ${n(x)}² = ${n(x * x)} = 2 × ${n(val)} + 1, so k = ${n(val)}`; }
   else if (w === 3) { val = (3 * x + 4) / 2; claim = 'If 3n + 5 is even, then n is odd.'; ask = `the whole number k with 3n + 5 = 2k + 1 that the proof gives for n = ${n(x)}`;
    why = 'The hypothesis is about 3n + 5, not about n, but the contrapositive “if n is even, then 3n + 5 is odd” starts from n = 2j and is one line of algebra.';
    work = `the proof assumes n is even; 3 × ${n(x)} + 5 = ${n(3 * x + 5)} = 2 × ${n(val)} + 1, so k = ${n(val)}`; }
   else { const c = w === 4 ? 1 : 5, v = x * x + c * x; val = v / 2; claim = `For every whole number n, ${sq(c)} is even.`; ask = `the whole number (${sq(c)}) ÷ 2 for n = ${n(x)}`;
    why = `There is no hypothesis to work from, and ${sq(c)} = n(n + ${n(c)}) behaves differently for even and odd n, so a proof by cases, n even and n odd, works.`;
    work = `${n(x * x)} + ${n(c * x)} = ${n(v)} and ${n(v)} ÷ 2 = ${n(val)}`; }
   return {
   prompt: `The workshop has a claim to prove: “${claim}” ${RULE29} Which method does the rule pick? ${choices(order.map(i => `${cap(METHODS[i])}.`))} Enter the number of the method. Then enter ${ask}.`,
   answer: [idx, val],
   hints: ['Test the claim against the rule in the prompt. Does it have an “if” part? If it does, is that part about an expression built from n, such as n² or 3n + 5, or about the plain numbers themselves?', 'For the value, put the numbers into the expression the prompt names and solve for the whole number it asks for.'],
   solution: `${why} So the rule picks ${METHODS[method]}, choice ${idx}. For the value: ${work}.`,
   guidance: [
    { prompt: `Which method does the rule pick for “${claim.replace(/\.$/, '')}”? Enter its number in the list.`, answer: [idx], explanation: `${why} So the rule picks ${METHODS[method]}, choice ${idx}.` },
    { prompt: `Now enter ${ask}.`, answer: [val], explanation: `${cap(work)}.` }
   ] }; }
 },
 /* A list of 2 to 4 primes from 2 to 13 with product at most 400; not the worked example's list 3, 5. */
 q30: {
  canonical: { ps: [2, 11, 13] },
  draw: R => { let ps;
   do { ps = shuffle(R, [2, 3, 5, 7, 11, 13, 17, 19]).slice(0, R.int(2, 4)).sort((a, b) => a - b); } while (ps.reduce((a, b) => a * b, 1) > 600 || ps.join() === '3,5' || ps.join() === '2,11,13');
   return { ps }; },
  build: ({ ps }) => { const P = ps.reduce((a, b) => a * b, 1), N = P + 1, p = spf(N), cof = N / p, tr = trials(N, p, ps), fresh = q => !ps.includes(q);
   const none = qs => qs.length === 1 ? `${qs[0]} does not divide ${n(N)}` : qs.length === 2 ? `neither ${qs[0]} nor ${qs[1]} divides ${n(N)}` : `none of ${and(qs.map(String))} divides ${n(N)}`;
   const between = `${n(N)} lies between ${tr.length > 1 ? `${tr.slice(0, -1).join(', between ')}, and between ${tr[tr.length - 1]}` : tr[0]}`;
   const found = p === N ? `${tr.length ? `${between}, so ${none(PRIMES.filter(q => q * q <= N && fresh(q)))}. That rules out every prime whose square is at most ${n(N)}: the next prime, ${n(PRIMES.find(q => q * q > N))}, has ${n(PRIMES.find(q => q * q > N))} × ${n(PRIMES.find(q => q * q > N))} = ${n(PRIMES.find(q => q * q > N) ** 2)}, which is more than ${n(N)}` : `every prime whose square is at most ${n(N)} is on the list`}. So ${n(N)} is itself prime: its smallest prime factor is ${n(N)}, and ${n(N)} ÷ ${n(N)} = 1`
    : `${tr.length ? `${between}, so ${none(PRIMES.filter(q => q < p && fresh(q)))}; but ` : ''}${n(N)} = ${n(p)} × ${n(cof)}. So its smallest prime factor is ${n(p)}, and ${n(N)} ÷ ${n(p)} = ${n(cof)}`;
   return {
   prompt: `A council member insists that ${and(ps.map(String))} are the only primes there are. Mira answers with Euclid’s proof by contradiction. Assume the list is complete, and let N be the product of the listed primes plus 1. Enter N. Then enter the smallest prime factor of N, then N divided by that factor.`,
   answer: [N, p, cof],
   hints: ['Multiply the listed primes together, then add 1.', 'Try 2, 3, 5, 7, 11, … in turn. The first prime that divides N exactly is its smallest prime factor. If no prime whose square is at most N divides it, N is itself prime.'],
   solution: `N = ${ps.map(String).join(' × ')} + 1 = ${n(P)} + 1 = ${n(N)}. N is 1 more than a multiple of each listed prime, so ${ps.length === 2 ? `neither ${ps[0]} nor ${ps[1]}` : `none of ${and(ps.map(String))}`} divides it. ${tr.length || p !== N ? 'Trying the other primes in order' : 'No other prime needs trying'}: ${found}. ${n(p)} is not on the list, which contradicts the assumption that the list holds every prime. So the assumption is false: no finite list holds every prime. ∎`,
   guidance: [
    { prompt: `What is the product ${ps.map(String).join(' × ')}?`, answer: [P], explanation: `${ps.map(String).join(' × ')} = ${n(P)}.` },
    { prompt: `N is that product plus 1. What is N?`, answer: [N], explanation: `${n(P)} + 1 = ${n(N)}. It is 1 more than a multiple of every listed prime.` },
    { prompt: `Find the smallest prime factor of ${n(N)} by trying 2, 3, 5, 7, … in turn. Enter it, then ${n(N)} divided by it.`, answer: [p, cof], explanation: `${cap(found)}. That prime is not on the list: the contradiction.` }
   ] }; }
 }
});
})();
