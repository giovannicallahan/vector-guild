/* Logic and proof practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/logic/oracle-p5.js. */
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
/* A shuffled copy of a list, drawn from R (Fisher–Yates). */
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
/* "a", "a and b", "a, b and c". */
const and = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
/* A numbered list for a choice question: "(1) … (2) …". */
const choices = items => items.map((s, i) => `(${i + 1}) ${s}`).join(' ');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const tv = b => b ? 1 : 0;
const sum = list => list.reduce((a, b) => a + b, 0);

/* ---- q21 Nested quantifiers on a printed grid [Levin 0.2] ---- */

/* A printed chart: rows named by `who`, entries 0 or 1. */
const chartOf = (grid, who) => grid.map((row, i) => `${who} ${i + 1}: ${row.join(' ')}`).join('; ');
const onesOf = row => row.map((v, j) => v ? j + 1 : 0).filter(Boolean);
const colOnes = (grid, j) => grid.map((row, i) => row[j] ? i + 1 : 0).filter(Boolean);
const randGrid = (R, rows, cols, p) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => tv(R.next() < p)));

/* q21b: technicians (rows) and tasks (columns): A is ∀y ∃x, B is ∃x ∀y. */
const techRow = (row, i) => { const k = onesOf(row); return `technician ${i + 1} ${k.length ? `can do task${k.length > 1 ? 's' : ''} ${and(k.map(String))}` : 'can do no task'}`; };
const taskCol = (grid, j) => { const a = colOnes(grid, j); return `task ${j + 1} ${a.length ? `can be done by technician${a.length > 1 ? 's' : ''} ${and(a.map(String))}` : 'can be done by no technician'}`; };
const techFacts = grid => { const cols = grid[0].length, covered = [...Array(cols).keys()].filter(j => grid.some(r => r[j])).length,
 full = grid.map((r, i) => r.every(Boolean) ? i + 1 : 0).filter(Boolean); return { covered, full, A: tv(covered === cols), B: tv(full.length > 0), cols }; };

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The repair rota',
 brief: 'The maintenance chief wants to know whether one all-round technician could cover every repair, or whether the jobs only need someone each.',
 labels: ['A (1 or 0)', 'B (1 or 0)', 'tasks someone can do'], tolerance: 0.01,
 gl: [['tasks someone can do'], ['technicians who can do every task'], ['A (1 or 0)', 'B (1 or 0)']]
}, {
 canonical: { grid: [[1, 1, 0, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 0], [0, 1, 0, 1, 0]] },
 /* Three kinds of draw: one technician can do every task (A and B true); every task has someone but no technician
    does all (A true, B false); some task has nobody (A false, B false). */
 draw: R => { const kind = R.int(0, 2); let grid, f;
  do { grid = randGrid(R, 4, 5, 0.35);
   if (kind === 0) grid[R.int(0, 3)] = [1, 1, 1, 1, 1];
   f = techFacts(grid);
  } while ((kind === 0 && (f.full.length !== 1 || grid.flat().filter(Boolean).length > 12)) || (kind === 1 && !(f.A && !f.B)) || (kind === 2 && !(f.covered >= 2 && f.covered <= 4)));
  return { grid }; },
 build: ({ grid }) => { const f = techFacts(grid); return {
  prompt: `The maintenance office keeps a repair rota for four technicians and five repair tasks. Each row is a technician and lists tasks 1 to 5 in order; a 1 means that technician can do the task and a 0 means they cannot. The rota reads ${chartOf(grid, 'technician')}. Let x stand for a technician and y for a task. Statement A is ∀y ∃x (x can do y): every task can be done by some technician. Statement B is ∃x ∀y (x can do y): there is one technician who can do every task. Enter the truth value of A (1 for true, 0 for false), then the truth value of B, then the number of tasks that at least one technician can do.`,
  answer: [f.A, f.B, f.covered],
  hints: ['For A, read the rota column by column: every task needs at least one 1 in its column, and different tasks may use different technicians.', 'For B, read it row by row: one single technician must have a 1 for every task, so the whole row would be ones.'],
  solution: `Column by column: ${[0, 1, 2, 3, 4].map(j => taskCol(grid, j)).join('; ')}. So ${f.covered === 5 ? 'all 5 tasks can be done by someone' : `only ${n(f.covered)} of the 5 tasks can be done by someone`}, and A is ${f.A ? 'true (1): each task has a technician of its own, even if they differ' : 'false (0): a task that nobody can do is a counterexample'}. Row by row: ${grid.map(techRow).join('; ')}. ${f.B ? `Technician ${f.full[0]} can do all five tasks, so B is true (1).` : 'No row is all ones, so no technician can do every task and B is false (0).'} ${f.A && !f.B ? 'A is true while B is false: the order of the quantifiers changed the meaning.' : f.B ? 'When B is true, A is true as well: the one technician who can do everything covers every task.' : 'A fails at a task nobody can do, and then B fails too: a technician who could do every task could do that one.'}`,
  guidance: [
   { prompt: 'Read the rota column by column. How many tasks have at least one 1 in their column?', answer: [f.covered], explanation: `${cap([0, 1, 2, 3, 4].map(j => taskCol(grid, j)).join('; '))}. That makes ${n(f.covered)} tasks that someone can do.` },
   { prompt: 'Now read it row by row. How many technicians have a 1 for every task?', answer: [f.full.length], explanation: `${cap(grid.map(techRow).join('; '))}. ${f.full.length ? `So ${n(f.full.length)} technician can do every task.` : 'No technician can do all five, so the count is 0.'}` },
   { prompt: 'A needs every task to have someone who can do it; B needs one technician who can do them all. What are the truth values of A and B?', answer: [f.A, f.B], explanation: `${f.covered === 5 ? 'All 5 tasks have a technician, so A is true (1).' : `Only ${n(f.covered)} of the 5 tasks have a technician, so A is false (0).`} ${f.full.length ? 'One technician can do every task, so B is true (1).' : 'No technician can do every task, so B is false (0).'}` }
  ] }; }
});

/* q21c: key chart of five airlocks and four keys; key j is lost. */
const lostFacts = (grid, j) => { const sole = grid.filter(r => r[j - 1] && r.filter(Boolean).length === 1).length, still = grid.length - sole; return { sole, still, A: tv(sole === 0) }; };
const airlockRow = (row, i) => { const k = onesOf(row); return `airlock ${i + 1} is opened by key${k.length > 1 ? 's' : ''} ${and(k.map(String))}`; };

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'A key goes missing',
 brief: 'A key has gone missing from the rack, and the council wants to know whether every airlock can still be opened.',
 labels: ['airlocks opened only by the lost key', 'airlocks still with a key', 'A (1 or 0)'], tolerance: 0.01,
 gl: [['airlocks opened only by the lost key'], ['airlocks still with a key'], ['A (1 or 0)']]
}, {
 canonical: { grid: [[0, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 1], [1, 0, 1, 0]], j: 3 },
 draw: R => { let grid, j;
  do { grid = randGrid(R, 5, 4, 0.4); j = R.int(1, 4);
  } while (!grid.every(r => r.some(Boolean)) || grid.flat().filter(Boolean).length > 11 || !grid.some(r => r[j - 1]));
  return { grid, j }; },
 build: ({ grid, j }) => { const f = lostFacts(grid, j), soles = grid.map((r, i) => r[j - 1] && r.filter(Boolean).length === 1 ? i + 1 : 0).filter(Boolean); return {
  prompt: `The council keeps a key chart for five airlocks and four keys. Each row is an airlock and lists keys 1 to 4 in order; a 1 means that key opens the airlock and a 0 means it does not. The chart reads ${chartOf(grid, 'airlock')}. Let x stand for an airlock and y for a key, and let A be the statement ∀x ∃y (y opens x). Today key ${n(j)} was lost, so it must be struck off the chart. Enter the number of airlocks that only key ${n(j)} opens, then the number of airlocks that still have a key, then the truth value of A for the chart without key ${n(j)} (1 for true, 0 for false).`,
  answer: [f.sole, f.still, f.A],
  hints: [`Look at the column of key ${n(j)}. An airlock is in danger only if its 1 in that column is the only 1 in its row.`, 'Every airlock with a 1 left in its row still has a key. A is true only if every airlock still has one.'],
  solution: `Rows: ${grid.map(airlockRow).join('; ')}. ${soles.length ? `Key ${n(j)} is the only key of airlock${soles.length > 1 ? 's' : ''} ${and(soles.map(String))}, so ${n(f.sole)} airlock${f.sole > 1 ? 's lose their' : ' loses its'} only key.` : `Every airlock that key ${n(j)} opens has another key as well, so no airlock loses its only key (0).`} The other ${n(f.still)} airlocks still have a key. ${f.A ? 'Every airlock still has a key, so A is true (1).' : `Airlock${soles.length > 1 ? 's' : ''} ${and(soles.map(String))} ${soles.length > 1 ? 'have' : 'has'} no key left, a counterexample, so A is false (0).`}`,
  guidance: [
   { prompt: `Which airlocks are opened by key ${n(j)} and by no other key? How many are there?`, answer: [f.sole], explanation: `${soles.length ? `Airlock${soles.length > 1 ? 's' : ''} ${and(soles.map(String))} ${soles.length > 1 ? 'have' : 'has'} key ${n(j)} as the only 1 in the row, so ${n(f.sole)}.` : `Every airlock that key ${n(j)} opens has a second key, so there are 0.`}` },
   { prompt: 'Those airlocks lose their only key and every other airlock keeps one. How many airlocks of the 5 still have a key?', answer: [f.still], explanation: `5 − ${n(f.sole)} = ${n(f.still)}.` },
   { prompt: 'A is true only when every airlock has a key. What is the truth value of A now (1 or 0)?', answer: [f.A], explanation: f.A ? 'All 5 airlocks still have a key, so A is true (1).' : `Only ${n(f.still)} of the 5 airlocks have a key, so A is false (0): an airlock with no key is a counterexample.` }
  ] }; }
});

/* q21d: six airlocks and five keys; the smallest airlock without a key is the counterexample to A. */
const bigFacts = grid => { const withKey = grid.filter(r => r.some(Boolean)).length, masters = [0, 1, 2, 3, 4].filter(j => grid.every(r => r[j])).length,
 small = grid.findIndex(r => !r.some(Boolean)) + 1; return { withKey, masters, small, A: tv(withKey === grid.length), B: tv(masters > 0) }; };

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q16', title: 'The first airlock with no key',
 brief: 'A bigger key chart has come in, and the council wants the first airlock that cannot be opened, if there is one.',
 labels: ['A (1 or 0)', 'B (1 or 0)', 'smallest airlock with no key (0 if none)', 'airlocks with a key'], tolerance: 0.01,
 gl: [['airlocks with a key'], ['smallest airlock with no key (0 if none)'], ['A (1 or 0)', 'B (1 or 0)']]
}, {
 canonical: { grid: [[0, 1, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 0, 1, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 1]] },
 draw: R => { const kind = R.pick([0, 1, 2, 2]); let grid, f;
  do { grid = randGrid(R, 6, 5, 0.3);
   if (kind === 0) { const j = R.int(0, 4); grid.forEach(r => { r[j] = 1; }); }
   f = bigFacts(grid);
  } while ((kind === 0 && (f.masters !== 1 || grid.flat().filter(Boolean).length > 12)) || (kind === 1 && !(f.A && !f.B)) || (kind === 2 && !(f.withKey >= 3 && f.withKey <= 5)));
  return { grid }; },
 build: ({ grid }) => { const f = bigFacts(grid), empty = grid.map((r, i) => r.some(Boolean) ? 0 : i + 1).filter(Boolean); return {
  prompt: `The council has a larger key chart, for six airlocks and five keys. Each row is an airlock and lists keys 1 to 5 in order; a 1 means that key opens the airlock and a 0 means it does not. The chart reads ${chartOf(grid, 'airlock')}. Let x stand for an airlock and y for a key. Statement A is ∀x ∃y (y opens x) and statement B is ∃y ∀x (y opens x). When A is false, an airlock with no key is a counterexample. Enter the truth value of A (1 for true, 0 for false), then the truth value of B, then the smallest airlock number that is a counterexample to A (enter 0 if A is true and there is none), then the number of airlocks that have at least one key.`,
  answer: [f.A, f.B, f.small, f.withKey],
  hints: ['A fails as soon as one row is all 0s. Read the rows from airlock 1 downwards and stop at the first row with no 1: that airlock is the smallest counterexample.', 'B needs one column of all ones. A key that opened every airlock would open the airlock with no key too, so a counterexample to A rules B out.'],
  solution: `Rows: ${grid.map((row, i) => onesOf(row).length ? airlockRow(row, i) : `airlock ${i + 1} has no key`).join('; ')}. So ${f.withKey === 6 ? 'all 6 airlocks have a key' : `${n(f.withKey)} of the 6 airlocks have a key`}, and A is ${f.A ? 'true (1)' : 'false (0)'}. ${f.A ? 'There is no counterexample, so the answer is 0.' : (empty.length > 1 ? `The airlocks with no key are ${and(empty.map(String))}, and the smallest of them is ${n(f.small)}.` : `Airlock ${n(f.small)} is the only airlock with no key, so it is the smallest counterexample.`)} ${f.B ? `One key has a 1 in every row, so B is true (1).` : 'No column has a 1 in every row, so B is false (0).'}`,
  guidance: [
   { prompt: 'Read the chart row by row. How many airlocks have at least one 1 in their row?', answer: [f.withKey], explanation: `${n(f.withKey)} of the 6 airlocks have a key.` },
   { prompt: 'A counterexample to A is an airlock with a row of 0s. Which is the smallest airlock number with no key? Enter 0 if every airlock has a key.', answer: [f.small], explanation: f.small ? (empty.length > 1 ? `The airlocks with no key are ${and(empty.map(String))}; the smallest is ${n(f.small)}.` : `Airlock ${n(f.small)} is the only airlock with no key, so the answer is ${n(f.small)}.`) : 'Every airlock has a key, so there is no counterexample and the answer is 0.' },
   { prompt: 'What are the truth values of A and B?', answer: [f.A, f.B], explanation: `${f.A ? 'Every airlock has a key, so A is true (1).' : 'An airlock has no key, so A is false (0).'} ${f.B ? 'A key opens every airlock, so B is true (1).' : 'No key opens every airlock, so B is false (0).'}` }
  ] }; }
});

/* ---- q22 Knights and knaves [Levin 0.2, 3.1] ---- */

/* N islanders; a statement st is true or false for an assignment v (true = knight). */
const NUMW = ['no', 'one', 'two', 'three', 'four'];
const said = (st, nm, N) => { const X = nm[st.x], Y = nm[st.y]; switch (st.k) {
 case 'K': return `${X} is a knight`; case 'N': return `${X} is a knave`;
 case 'BOTH': return `${X} and ${Y} are both knights`; case 'ONEKNAVE': return `At least one of ${X} and ${Y} is a knave`;
 case 'EITHER': return `At least one of ${X} and ${Y} is a knight`;
 case 'SAME': return `${X} and I are the same kind`; case 'DIFF': return `${X} and I are different kinds`;
 default: return st.c === 0 ? `None of us ${NUMW[N]} is a knight` : `Exactly ${NUMW[st.c]} of us ${NUMW[N]} ${st.c === 1 ? 'is a knight' : 'are knights'}`; } };
const truth = (st, s, v) => { switch (st.k) {
 case 'K': return v[st.x]; case 'N': return !v[st.x]; case 'BOTH': return v[st.x] && v[st.y]; case 'ONEKNAVE': return !v[st.x] || !v[st.y];
 case 'EITHER': return v[st.x] || v[st.y];
 case 'SAME': return v[st.x] === v[s]; case 'DIFF': return v[st.x] !== v[s]; default: return v.filter(Boolean).length === st.c; } };
/* The 2^N rows in truth-table order: first islander first, knight before knave. */
const rowsOf = N => Array.from({ length: 2 ** N }, (_, i) => Array.from({ length: N }, (_, j) => !((i >> (N - 1 - j)) & 1)));
const fitsAt = (sts, v, upTo) => sts.slice(0, upTo).every((st, s) => truth(st, s, v) === v[s]);
const kindList = (v, nm) => v.map((b, i) => `${nm[i]} ${b ? 'knight' : 'knave'}`).join(', ');
const peopleOf = (c, word) => c === 0 ? `there are no ${word}s` : c === 1 ? `there is 1 ${word}` : `there are ${c} ${word}s`;
const KINDS = ['K', 'N', 'N', 'BOTH', 'ONEKNAVE', 'EITHER', 'SAME', 'DIFF', 'EXACT'];
/* Draws one statement each until exactly one of the 2^N rows fits all of them. */
const drawSts = (R, N) => { let st; const all = [...Array(N).keys()], rows = rowsOf(N);
 do { st = all.map(s => { const o = all.filter(i => i !== s), k = R.pick(KINDS);
   if (k === 'BOTH' || k === 'ONEKNAVE' || k === 'EITHER') { const [x, y] = shuffle(R, o).slice(0, 2).sort((a, b) => a - b); return { k, x, y }; }
   return k === 'EXACT' ? { k, c: R.int(0, N - 1) } : { k, x: R.pick(o) }; });
 } while (rows.filter(v => fitsAt(st, v, N)).length !== 1);
 return st; };
/* Everything the three variants print about one set of statements. */
const kkFacts = (st, nm) => { const N = nm.length, rows = rowsOf(N), v = rows.find(r => fitsAt(st, r, N)), c = v.filter(Boolean).length;
 const count = up => rows.filter(r => fitsAt(st, r, up)).length;
 const check = st.map((x, s) => `${nm[s]} is a ${v[s] ? 'knight' : 'knave'} and says “${said(x, nm, N)}”, which is ${truth(x, s, v) ? 'true' : 'false'}`).join('; ');
 const others = N === 3 ? `Every other row breaks a statement: ${rows.filter(r => r !== v).map(r => { const s = [0, 1, 2].find(i => truth(st[i], i, r) !== r[i]); return `${kindList(r, nm)} breaks ${nm[s]}’s statement`; }).join('; ')}.` : `Each of the other ${n(rows.length - 1)} rows breaks at least one statement.`;
 const talk = st.map((x, s) => `${nm[s]} says: “${said(x, nm, N)}.”`).join(' ');
 return { N, rows, v, c, c1: count(1), c2: count(2), check, others, talk }; };

const NM_B = ['Dara', 'Eno', 'Fay'];
mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Pilots on the far ferry',
 brief: 'Three ferry pilots from the far island have radioed the landing pad, and the controller must know which of them can be trusted.',
 labels: ['Dara (1 = knight)', 'Eno (1 = knight)', 'Fay (1 = knight)', 'knaves among the three'], tolerance: 0.01,
 gl: [['rows that fit Dara'], ['rows that fit Dara and Eno'], ['Dara (1 = knight)', 'Eno (1 = knight)', 'Fay (1 = knight)', 'knaves among the three']]
}, {
 canonical: { st: [{ k: 'N', x: 1 }, { k: 'EITHER', x: 0, y: 2 }, { k: 'DIFF', x: 0 }] },
 draw: R => ({ st: drawSts(R, 3) }),
 build: ({ st }) => { const f = kkFacts(st, NM_B), knaves = 3 - f.c; return {
  prompt: `Three ferry pilots from the far island are calling the landing pad. On that island every knight always tells the truth and every knave always lies, and each pilot is one or the other. ${f.talk} Exactly one way of making each pilot a knight or a knave fits all three statements. Enter 1 if Dara is a knight and 0 if Dara is a knave, then the same for Eno, then for Fay, then the number of knaves among the three.`,
  answer: [...f.v.map(tv), knaves],
  hints: ['Give each pilot a letter, true for a knight and false for a knave. Three letters give the eight rows of a truth table.', 'A row fits when every knight’s statement is true on it and every knave’s statement is false on it. Cross out each row where one statement breaks that rule.'],
  solution: `The row that fits is ${kindList(f.v, NM_B)}. Check: ${f.check}. Every knight told the truth and every knave lied, so ${peopleOf(knaves, 'knave')}. ${f.others}`,
  guidance: [
   { prompt: 'Look at Dara’s statement alone. On how many of the 8 rows does it fit Dara: true where Dara is a knight, false where Dara is a knave?', answer: [f.c1], explanation: `Dara’s statement, “${said(st[0], NM_B, 3)}”, fits Dara on ${n(f.c1)} of the 8 rows.` },
   { prompt: 'Keep only the rows where Dara’s statement and Eno’s statement both fit. How many rows are left?', answer: [f.c2], explanation: `Eno’s statement, “${said(st[1], NM_B, 3)}”, ${f.c2 === f.c1 ? 'crosses out none of them' : 'crosses out more rows'}, and ${n(f.c2)} ${f.c2 === 1 ? 'row is' : 'rows are'} left.` },
   { prompt: 'Test Fay’s statement on the rows that are left: one row survives. Enter 1 or 0 for Dara, Eno and Fay on that row, then the number of knaves.', answer: [...f.v.map(tv), knaves], explanation: `Only ${kindList(f.v, NM_B)} survives Fay’s statement, “${said(st[2], NM_B, 3)}”, so ${peopleOf(knaves, 'knave')}.` }
  ] }; }
});

const NM_C = ['Ivo', 'Jun', 'Kit'];
mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Paying the honest delegates',
 brief: 'The clerk has a purse for the visiting delegates and must work out who is honest before paying anyone.',
 labels: ['knights among the three', 'credits to pay'], tolerance: 0.01,
 gl: [['rows that fit Ivo and Jun'], ['knights among the three'], ['credits to pay']]
}, {
 canonical: { st: [{ k: 'N', x: 2 }, { k: 'DIFF', x: 2 }, { k: 'DIFF', x: 1 }], pay: 7 },
 draw: R => { let st; do { st = drawSts(R, 3); } while (!rowsOf(3).find(v => fitsAt(st, v, 3)).some(Boolean)); return { st, pay: R.int(3, 9) }; },
 build: ({ st, pay }) => { const f = kkFacts(st, NM_C), total = f.c * pay; return {
  prompt: `Three delegates have come to the council from the island where every knight always tells the truth and every knave always lies. ${f.talk} Exactly one way of making each of them a knight or a knave fits all three statements. The clerk pays each knight ${n(pay)} credits for the visit and each knave nothing. Enter the number of knights among the three, then the total number of credits the clerk pays.`,
  answer: [f.c, total],
  hints: ['Treat each delegate as a statement letter, true for a knight and false for a knave, and test the eight rows of the truth table one at a time.', 'Once you know who the knights are, the pay is the number of knights times the pay for one knight.'],
  solution: `The row that fits is ${kindList(f.v, NM_C)}. Check: ${f.check}. Every knight told the truth and every knave lied, so ${peopleOf(f.c, 'knight')}. ${f.others} The clerk pays ${n(f.c)} × ${n(pay)} = ${n(total)} credits.`,
  guidance: [
   { prompt: 'Keep only the rows where Ivo’s statement and Jun’s statement both fit: a knight’s statement is true on the row and a knave’s is false. How many of the 8 rows are left?', answer: [f.c2], explanation: `Ivo’s statement, “${said(st[0], NM_C, 3)}”, fits on ${n(f.c1)} rows, and Jun’s statement, “${said(st[1], NM_C, 3)}”, leaves ${n(f.c2)} of them.` },
   { prompt: 'Test Kit’s statement on the rows that are left. One row survives. How many knights are on it?', answer: [f.c], explanation: `Only ${kindList(f.v, NM_C)} survives Kit’s statement, “${said(st[2], NM_C, 3)}”, so ${peopleOf(f.c, 'knight')}.` },
   { prompt: `Each knight is paid ${n(pay)} credits. What is the total?`, answer: [total], explanation: `${n(f.c)} × ${n(pay)} = ${n(total)} credits.` }
  ] }; }
});

const NM_D = ['Ada', 'Bo', 'Cal', 'Dev'];
mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q08', title: 'Four delegates, sixteen rows',
 brief: 'A fourth delegate has joined the council from the far island, and the clerk must again sort the honest from the dishonest.',
 labels: ['Ada (1 = knight)', 'Bo (1 = knight)', 'Cal (1 = knight)', 'Dev (1 = knight)', 'knights among the four'], tolerance: 0.01,
 gl: [['rows that fit Ada'], ['rows that fit Ada and Bo'], ['Ada (1 = knight)', 'Bo (1 = knight)', 'Cal (1 = knight)', 'Dev (1 = knight)', 'knights among the four']]
}, {
 canonical: { st: [{ k: 'BOTH', x: 1, y: 2 }, { k: 'EXACT', c: 1 }, { k: 'K', x: 3 }, { k: 'ONEKNAVE', x: 0, y: 1 }] },
 draw: R => ({ st: drawSts(R, 4) }),
 build: ({ st }) => { const f = kkFacts(st, NM_D); return {
  prompt: `Four delegates have come to the council from the island where every knight always tells the truth and every knave always lies. ${f.talk} Four delegates give 16 rows in a truth table. Exactly one of the 16 ways of making each of them a knight or a knave fits all four statements. Enter 1 if Ada is a knight and 0 if Ada is a knave, then the same for Bo, Cal and Dev, then the number of knights among the four.`,
  answer: [...f.v.map(tv), f.c],
  hints: ['Treat each delegate as a statement letter, true for a knight and false for a knave. Four letters give sixteen rows, so cross rows out statement by statement instead of testing all four statements on every row.', 'A row fits when every knight’s statement is true on it and every knave’s statement is false on it. A statement that mentions “us four” needs the count of knights on the row.'],
  solution: `The row that fits is ${kindList(f.v, NM_D)}. Check: ${f.check}. Every knight told the truth and every knave lied, so ${peopleOf(f.c, 'knight')}. ${f.others}`,
  guidance: [
   { prompt: 'Look at Ada’s statement alone. On how many of the 16 rows does it fit Ada: true where Ada is a knight, false where Ada is a knave?', answer: [f.c1], explanation: `Ada’s statement, “${said(st[0], NM_D, 4)}”, fits Ada on ${n(f.c1)} of the 16 rows.` },
   { prompt: 'Keep only the rows where Ada’s statement and Bo’s statement both fit. How many rows are left?', answer: [f.c2], explanation: `Bo’s statement, “${said(st[1], NM_D, 4)}”, ${f.c2 === f.c1 ? 'crosses out none of them' : 'crosses out more rows'}, and ${n(f.c2)} ${f.c2 === 1 ? 'row is' : 'rows are'} left.` },
   { prompt: 'Test Cal’s and Dev’s statements on the rows that are left: one row survives. Enter 1 or 0 for Ada, Bo, Cal and Dev on that row, then the number of knights.', answer: [...f.v.map(tv), f.c], explanation: `Only ${kindList(f.v, NM_D)} survives Cal’s statement, “${said(st[2], NM_D, 4)}”, and Dev’s, “${said(st[3], NM_D, 4)}”, so ${peopleOf(f.c, 'knight')}.` }
  ] }; }
});

/* ---- q23 Chapter review: weighing an argument in council [CM 2.7, Levin 0.2] ---- */

const TOP = [
 [['the tank level drops', 'the tank level does not drop'], ['the pump starts', 'the pump does not start'], ['the valve opens', 'the valve does not open']],
 [['the lamp flickers', 'the lamp does not flicker'], ['the fuse blows', 'the fuse does not blow'], ['the corridor goes dark', 'the corridor does not go dark']],
 [['the wind picks up', 'the wind does not pick up'], ['the dust storm arrives', 'the dust storm does not arrive'], ['the rover stays in', 'the rover does not stay in']],
 [['the antenna ices over', 'the antenna does not ice over'], ['the signal fades', 'the signal does not fade'], ['the night shift calls the relay', 'the night shift does not call the relay']],
 [['the compost heats up', 'the compost does not heat up'], ['the sensor reads high', 'the sensor does not read high'], ['the gardeners open the vents', 'the gardeners do not open the vents']]
];
const FORMS = {
 MP: { valid: 1, name: 'modus ponens', shape: 'p → q, p, so q', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(p[0])}. So ${q[0]}.` },
 MT: { valid: 1, name: 'modus tollens', shape: 'p → q, ¬q, so ¬p', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(q[1])}. So ${p[1]}.` },
 CH: { valid: 1, name: 'the chain rule', shape: 'p → q, q → r, so p → r', text: ([p, q, r]) => `If ${p[0]}, then ${q[0]}. If ${q[0]}, then ${r[0]}. So if ${p[0]}, then ${r[0]}.` },
 AC: { valid: 0, name: 'affirming the conclusion, a fallacy', shape: 'p → q, q, so p', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(q[0])}. So ${p[0]}.` },
 DH: { valid: 0, name: 'denying the hypothesis, a fallacy', shape: 'p → q, ¬p, so ¬q', text: ([p, q]) => `If ${p[0]}, then ${q[0]}. ${cap(p[1])}. So ${q[1]}.` }
};
/* `count` forms with at least one valid and one fallacy, each on its own topic. */
const drawArgs = (R, count, distinct) => { let forms;
 do { forms = distinct ? shuffle(R, Object.keys(FORMS)).slice(0, count) : Array.from({ length: count }, () => R.pick(Object.keys(FORMS))); }
 while (forms.every(f => FORMS[f].valid) || forms.every(f => !FORMS[f].valid));
 return { forms, topics: shuffle(R, [0, 1, 2, 3, 4]).slice(0, count) }; };
const argList = (forms, topics) => forms.map((f, i) => `Argument ${i + 1}: “${FORMS[f].text(TOP[topics[i]])}”`).join(' ');
const argWhy = forms => forms.map((f, i) => `Argument ${i + 1} has the form ${FORMS[f].shape}: ${FORMS[f].name}, so it scores ${FORMS[f].valid}`).join('. ');
const argHint = 'Write each argument with letters, p for its first sentence, q for the next and r for a third, then match it to a form you know. Modus ponens, modus tollens and the chain rule are valid; affirming the conclusion and denying the hypothesis are fallacies.';

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The tank inspectors’ audit',
 brief: 'The tank inspectors will sign off the water plant only if their reasoning holds, and they want it checked before the log goes to the council.',
 labels: ['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)', 'witness checks'], tolerance: 0.01,
 gl: [['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)'], ['witness checks']]
}, {
 canonical: { forms: ['DH', 'CH', 'MP'], topics: [1, 4, 0], levels: [44, 31, 52, 27, 38, 49], L: 35 },
 draw: R => ({ ...drawArgs(R, 3, true), levels: Array.from({ length: 6 }, () => R.int(20, 60)), L: R.int(28, 50) }),
 build: ({ forms, topics, levels, L }) => { const codes = forms.map(f => FORMS[f].valid), under = levels.filter(v => v < L); return {
  prompt: `The tank inspectors weigh three arguments before they sign off the water plant. ${argList(forms, topics)} Enter 1 for each argument that is valid and 0 for each that is a fallacy, in order. Then the chief inspector claims: “There is a check at which the tank held less than ${n(L)} litres.” The tank levels at the last six checks were ${and(levels.map(n))} litres. Enter the number of checks that are witnesses to the claim.`,
  answer: [...codes, under.length],
  hints: [argHint, `A witness is one check that makes the “there is” claim true. Count every level below ${n(L)}; a level of exactly ${n(L)} does not count.`],
  solution: `${argWhy(forms)}. ${under.length > 1 ? `The levels below ${n(L)} are ${and(under.map(n))}, one witness check each` : under.length ? `Only one check, at ${n(under[0])} litres, was below ${n(L)}` : `No check was below ${n(L)}`}, so the claim has ${n(under.length)} witness${under.length === 1 ? '' : 'es'}${under.length ? ' and it is true' : ' and it is false'}.`,
  guidance: [
   { prompt: 'Write each argument with letters p, q and r. Is argument 1 valid (1) or a fallacy (0)? Then argument 2, then argument 3.', answer: codes, explanation: forms.map((f, i) => `Argument ${i + 1} is ${FORMS[f].shape}, ${FORMS[f].name}.`).join(' ') },
   { prompt: `The levels were ${and(levels.map(n))} litres. How many of them are below ${n(L)}?`, answer: [under.length], explanation: `${under.length ? `${cap(and(under.map(n)))} ${under.length === 1 ? 'is' : 'are'} below ${n(L)}` : `None of them is below ${n(L)}`}, so there ${under.length === 1 ? 'is 1 witness' : `are ${n(under.length)} witnesses`}.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Motions fit to send forward',
 brief: 'The council clerk will send only sound arguments to the full vote, and wants to know how strong the support was in the last sessions.',
 labels: ['valid arguments', 'witness sessions', 'yes votes in the witness sessions'], tolerance: 0.01,
 gl: [['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)', 'argument 4 (1 or 0)'], ['witness sessions'], ['yes votes in the witness sessions']]
}, {
 canonical: { forms: ['MT', 'AC', 'AC', 'CH'], topics: [2, 0, 3, 1], votes: [8, 17, 12, 6, 19, 14], k: 13 },
 draw: R => { let votes, k;
  do { votes = Array.from({ length: 6 }, () => R.int(4, 24)); k = R.int(9, 17); } while (!votes.some(v => v > k));
  return { ...drawArgs(R, 4, false), votes, k }; },
 build: ({ forms, topics, votes, k }) => { const codes = forms.map(f => FORMS[f].valid), valid = sum(codes), over = votes.filter(v => v > k), total = sum(over); return {
  prompt: `Before the full vote, the council clerk reads four arguments, and only a valid argument is sent forward. ${argList(forms, topics)} Count the arguments that are valid. Then a delegate claims: “There is a session in which more than ${n(k)} members voted yes.” The yes votes in the last six sessions were ${and(votes.map(n))}. Enter the number of valid arguments, then the number of witness sessions for the claim, then the total number of yes votes in those witness sessions.`,
  answer: [valid, over.length, total],
  hints: [argHint, `A witness is one session that makes the “there is” claim true: more than ${n(k)} yes votes, and exactly ${n(k)} does not count. Add up the votes of those sessions only.`],
  solution: `${argWhy(forms)}. That makes ${n(valid)} valid argument${valid === 1 ? '' : 's'}. The sessions with more than ${n(k)} yes votes are ${and(over.map(n))}, so there ${over.length === 1 ? 'is 1 witness session' : `are ${n(over.length)} witness sessions`}. Their yes votes add up to ${over.map(n).join(' + ')} = ${n(total)}.`,
  guidance: [
   { prompt: 'Write each argument with letters p, q and r. Enter 1 for each valid argument and 0 for each fallacy, in order.', answer: codes, explanation: forms.map((f, i) => `Argument ${i + 1} is ${FORMS[f].shape}, ${FORMS[f].name}.`).join(' ') },
   { prompt: `The yes votes were ${and(votes.map(n))}. How many sessions had more than ${n(k)}?`, answer: [over.length], explanation: `${cap(and(over.map(n)))} ${over.length === 1 ? 'is' : 'are'} more than ${n(k)}, so there ${over.length === 1 ? 'is 1 witness session' : `are ${n(over.length)} witness sessions`}.` },
   { prompt: 'Add up the yes votes of those witness sessions only.', answer: [total], explanation: `${over.map(n).join(' + ')} = ${n(total)}.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q16', title: 'The first poor session',
 brief: 'A delegate says every recent session was well attended, and the council wants the first one that proves otherwise.',
 labels: ['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)', 'counterexample sessions', 'first counterexample session'], tolerance: 0.01,
 gl: [['argument 1 (1 or 0)', 'argument 2 (1 or 0)', 'argument 3 (1 or 0)'], ['counterexample sessions', 'first counterexample session']]
}, {
 canonical: { forms: ['DH', 'MP', 'MT'], topics: [3, 1, 2], votes: [15, 18, 9, 14, 11, 20, 16], k: 12 },
 /* Every draw has 1 to 4 counterexamples, so the prompt needs no "enter 0 if there is none" case. */
 draw: R => { let votes, k, bad;
  do { votes = Array.from({ length: 7 }, () => R.int(6, 24)); k = R.int(9, 16); bad = votes.filter(v => v < k).length; } while (bad < 1 || bad > 4);
  return { ...drawArgs(R, 3, true), votes, k }; },
 build: ({ forms, topics, votes, k }) => { const codes = forms.map(f => FORMS[f].valid), bad = votes.map((v, i) => v < k ? i + 1 : 0).filter(Boolean); return {
  prompt: `The council weighs three arguments, and then a claim about the sessions. ${argList(forms, topics)} Enter 1 for each argument that is valid and 0 for each that is a fallacy, in order. A delegate then says: “In every one of the last seven sessions, at least ${n(k)} members voted yes.” The sessions are numbered 1 to 7 in order, and their yes votes were ${and(votes.map(n))}. A counterexample to the claim is a session with fewer than ${n(k)} yes votes. Enter the number of counterexamples, then the number of the first counterexample session.`,
  answer: [...codes, bad.length, bad[0]],
  hints: [argHint, `A “for every” claim fails at one session below ${n(k)}. Go through the sessions in order and mark each one below ${n(k)}, then count them and pick the first.`],
  solution: `${argWhy(forms)}. The sessions with fewer than ${n(k)} yes votes are ${and(bad.map(s => `session ${n(s)} (${n(votes[s - 1])})`))}, so the “for every” claim is false and has ${n(bad.length)} counterexample${bad.length === 1 ? '' : 's'}. The first is session ${n(bad[0])}.`,
  guidance: [
   { prompt: 'Write each argument with letters p, q and r. Is argument 1 valid (1) or a fallacy (0)? Then argument 2, then argument 3.', answer: codes, explanation: forms.map((f, i) => `Argument ${i + 1} is ${FORMS[f].shape}, ${FORMS[f].name}.`).join(' ') },
   { prompt: `The yes votes were ${and(votes.map(n))}. How many sessions had fewer than ${n(k)}, and what is the number of the first one?`, answer: [bad.length, bad[0]], explanation: `${cap(and(bad.map(s => `session ${n(s)} (${n(votes[s - 1])} votes)`)))} ${bad.length === 1 ? 'is' : 'are'} below ${n(k)}: ${n(bad.length)} counterexample${bad.length === 1 ? '' : 's'}, the first being session ${n(bad[0])}.` }
  ] }; }
});

/* ---- q24 Definitions: even, odd and “divides” [Levin 3.2, 0.2] ---- */

/* A claim a | b: true, false just above a multiple, or false because the divisor is the bigger number. */
const drawPair = (R, kind) => { const a = R.int(3, 9), m = R.int(3, 14); return kind === 0 ? [a, a * m] : kind === 1 ? [a, a * m + R.int(1, a - 1)] : [a * m, a]; };
const divWhy = (a, b) => { const m = Math.floor(b / a);
 return b % a === 0 ? `${n(b)} = ${n(a)} × ${n(m)}, so ${n(a)} | ${n(b)} is true` : `${n(a)} × ${n(m)} = ${n(a * m)} is too small and ${n(a)} × ${n(m + 1)} = ${n(a * (m + 1))} is too big, so no whole number m gives ${n(b)} = ${n(a)} × m and ${n(a)} | ${n(b)} is false`; };

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'Stamps on the cargo crates',
 brief: 'Two crates have been stamped with whole numbers, and the hold keeper needs the stamps read exactly by the definitions.',
 labels: ['k for the even stamp', 'k for the odd stamp', 'claim (1 or 0)'], tolerance: 0.01,
 gl: [['k for the even stamp'], ['k for the odd stamp'], ['claim (1 or 0)']]
}, {
 canonical: { E: 158, O: 93, a: 7, b: 45 },
 draw: R => { const [a, b] = drawPair(R, R.int(0, 2)); return { E: 2 * R.int(20, 150), O: 2 * R.int(20, 150) + 1, a, b }; },
 build: ({ E, O, a, b }) => { const kE = E / 2, kO = (O - 1) / 2, code = tv(b % a === 0); return {
  prompt: `In the cargo hold every crate carries a whole number as its stamp. A whole number e is even when e = 2k for some whole number k, and a whole number o is odd when o = 2k + 1 for some whole number k. One crate is stamped ${n(E)} and another is stamped ${n(O)}. Enter the k for the even stamp ${n(E)}, then the k for the odd stamp ${n(O)}. The hold also uses a | b (read “a divides b”), which means b = a × m for some whole number m. Enter 1 if the claim ${n(a)} | ${n(b)} is true and 0 if it is false.`,
  answer: [kE, kO, code],
  hints: ['For the even stamp, 2k is the whole number, so halve it. For the odd stamp, take 1 away first and then halve what is left.', 'For a | b, ask whether b is a times some whole number. a | b is a claim, true or false; it is not the number b ÷ a, and the order matters.'],
  solution: `${n(E)} ÷ 2 = ${n(kE)}, so ${n(E)} = 2 × ${n(kE)} and k = ${n(kE)}. ${n(O)} − 1 = ${n(O - 1)} and ${n(O - 1)} ÷ 2 = ${n(kO)}, so ${n(O)} = 2 × ${n(kO)} + 1 and k = ${n(kO)}. For the claim: ${divWhy(a, b)}: ${code}.`,
  guidance: [
   { prompt: `${n(E)} is even, so ${n(E)} = 2k. Which whole number k is that?`, answer: [kE], explanation: `${n(E)} ÷ 2 = ${n(kE)}, so ${n(E)} = 2 × ${n(kE)}.` },
   { prompt: `${n(O)} − 1 = ${n(O - 1)}. Which whole number k gives 2k = ${n(O - 1)}, so that ${n(O)} = 2k + 1?`, answer: [kO], explanation: `${n(O - 1)} ÷ 2 = ${n(kO)}, so ${n(O)} = 2 × ${n(kO)} + 1.` },
   { prompt: `Look for a whole number m with ${n(b)} = ${n(a)} × m. Enter 1 if there is one and 0 if there is not.`, answer: [code], explanation: `${cap(divWhy(a, b))}: ${code}.` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Filters by the whole pack',
 brief: 'The stores will shelve air filters only in whole packs, and the keeper needs to know which of two deliveries can be shelved.',
 labels: ['delivery 1 (1 or 0)', 'delivery 2 (1 or 0)', 'whole packs in total'], tolerance: 0.01,
 gl: [['delivery 1 (1 or 0)'], ['delivery 2 (1 or 0)'], ['whole packs in total']]
}, {
 canonical: { a: 8, b1: 92, b2: 112 },
 draw: R => { let a, b1, b2, ok;
  do { a = R.int(4, 12); const one = () => { const m = R.int(3, 14); return R.next() < 0.5 ? a * m : a * m + R.int(1, a - 1); };
   b1 = one(); b2 = one(); ok = b1 % a === 0 || b2 % a === 0; } while (!ok);
  return { a, b1, b2 }; },
 build: ({ a, b1, b2 }) => { const c1 = tv(b1 % a === 0), c2 = tv(b2 % a === 0), packs = (c1 ? b1 / a : 0) + (c2 ? b2 / a : 0); const part = (b, c) => c ? `${n(b)} = ${n(a)} × ${n(b / a)}, so ${n(b)} filters make ${n(b / a)} whole packs` : divWhy(a, b).replace(/, so no whole number.*$/, `, so ${n(b)} is not a whole number of packs`); return {
  prompt: `The stores hold air filters in packs of ${n(a)}. A delivery can be shelved as whole packs when ${n(a)} | b, that is when its number of filters b equals ${n(a)} × m for some whole number m; then m is the number of packs. Delivery 1 has ${n(b1)} filters and delivery 2 has ${n(b2)} filters. Enter 1 if delivery 1 can be shelved as whole packs and 0 if not, then the same for delivery 2, then the total number of whole packs in the deliveries that can be shelved.`,
  answer: [c1, c2, packs],
  hints: [`A delivery fits when its number of filters is ${n(a)} times a whole number. List the multiples of ${n(a)} near it and see whether it is one of them.`, 'Only a delivery that fits adds packs to the total: a delivery that does not fit adds nothing.'],
  solution: `Delivery 1: ${part(b1, c1)}: ${c1}. Delivery 2: ${part(b2, c2)}: ${c2}. ${c1 && c2 ? `Together ${n(b1 / a)} + ${n(b2 / a)} = ${n(packs)} whole packs.` : `Only one delivery fits, so the total is ${n(packs)} whole packs.`}`,
  guidance: [
   { prompt: `Is there a whole number m with ${n(b1)} = ${n(a)} × m? Enter 1 if there is and 0 if not.`, answer: [c1], explanation: `${cap(part(b1, c1))}: ${c1}.` },
   { prompt: `Is there a whole number m with ${n(b2)} = ${n(a)} × m? Enter 1 if there is and 0 if not.`, answer: [c2], explanation: `${cap(part(b2, c2))}: ${c2}.` },
   { prompt: 'Add up the whole packs of the deliveries that fit. What is the total?', answer: [packs], explanation: c1 && c2 ? `${n(b1 / a)} + ${n(b2 / a)} = ${n(packs)}.` : `Only the delivery that fits counts, and it makes ${n(packs)} whole packs.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q15', title: 'Every crate on the list',
 brief: 'The shipping list holds six crate numbers, and the keeper must test a rule about every one of them.',
 labels: ['numbers the divisor goes into', 'claim C (1 or 0)', 'k of the first odd number'], tolerance: 0.01,
 gl: [['numbers the divisor goes into'], ['claim C (1 or 0)'], ['k of the first odd number']]
}, {
 canonical: { d: 6, list: [24, 51, 18, 60, 33, 42] },
 /* The loop keeps only lists with at least one odd number, so the prompt needs no "if there is none" case. */
 draw: R => { let d, list, kind;
  do { kind = R.pick([0, 1, 1]);
   if (kind === 0) { d = R.pick([3, 5, 7]); list = Array.from({ length: 6 }, () => d * R.int(Math.ceil(12 / d), Math.floor(99 / d))); }
   else { d = R.int(3, 8); list = Array.from({ length: 6 }, () => R.int(12, 99)); const hit = R.int(1, 4); for (let i = 0; i < hit; i++) { const m = R.int(Math.ceil(12 / d), Math.floor(99 / d)); list[R.int(0, 5)] = d * m; } }
  } while (!list.some(x => x % 2) || (kind === 1 && list.filter(x => x % d === 0).length === 6) || (kind === 1 && list.filter(x => x % d === 0).length === 0) || (d === 6 && list.join() === '24,51,18,60,33,42'));
  return { d, list }; },
 build: ({ d, list }) => { const hits = list.filter(x => x % d === 0), cnt = hits.length, C = tv(cnt === 6), first = list.find(x => x % 2), k = (first - 1) / 2, miss = list.find(x => x % d !== 0); return {
  prompt: `A shipping list holds six crate numbers: ${and(list.map(n))}. Let C be the claim “for every number x on the list, ${n(d)} | x”. Here ${n(d)} | x means x = ${n(d)} × m for some whole number m. Enter how many numbers on the list ${n(d)} divides, then 1 if C is true and 0 if C is false. Finally take the first odd number on the list, written as 2k + 1 for a whole number k, and enter its k.`,
  answer: [cnt, C, k],
  hints: [`Go down the list and ask of each number whether it is ${n(d)} times a whole number. C needs the answer yes for all six.`, 'One number that fails is a counterexample, and then C is false. For the k, take 1 away from the first odd number and halve what is left.'],
  solution: `${n(d)} divides ${hits.length ? and(hits.map(n)) : 'none of them'}${cnt ? ` (${hits.map(x => `${n(x)} = ${n(d)} × ${n(x / d)}`).join('; ')})` : ''}, so the count is ${n(cnt)}. ${C ? 'All six pass, so C is true (1).' : `${n(miss)} is not ${n(d)} times a whole number, a counterexample, so C is false (0).`} The first odd number is ${n(first)}: ${n(first)} − 1 = ${n(first - 1)} and ${n(first - 1)} ÷ 2 = ${n(k)}, so ${n(first)} = 2 × ${n(k)} + 1 and k = ${n(k)}.`,
  guidance: [
   { prompt: `For each number on the list, ask whether it equals ${n(d)} × m for a whole number m. How many of the six numbers do?`, answer: [cnt], explanation: `${n(d)} divides ${hits.length ? and(hits.map(n)) : 'none of them'}, so the count is ${n(cnt)}.` },
   { prompt: 'C is a “for every” claim. Enter 1 if it is true and 0 if it is false.', answer: [C], explanation: C ? 'All six numbers pass, so C is true (1).' : `${n(miss)} fails, so C is false (0); one counterexample is enough.` },
   { prompt: 'Find the first odd number on the list. Which whole number k gives that number = 2k + 1?', answer: [k], explanation: `The first odd number is ${n(first)}; ${n(first)} − 1 = ${n(first - 1)} and ${n(first - 1)} ÷ 2 = ${n(k)}.` }
  ] }; }
});

/* ---- q25 Direct proof, step by step [Levin 3.2] ---- */

/* q25b: the direct proof that odd + odd is even, step by step, and the wrong steps offered beside the right one. */
const SUM_STEPS = [
 'Assume m and n are odd whole numbers.',
 'By the definition of odd, m = 2a + 1 and n = 2b + 1 for some whole numbers a and b.',
 'Add them: m + n = (2a + 1) + (2b + 1) = 2a + 2b + 2.',
 'Take 2 out of every term: m + n = 2(a + b + 1).',
 'The bracket a + b + 1 is a whole number, so m + n is even by the definition of even. ∎'
];
const SUM_JOB = ['', 'turns “odd” into equations, using the definition', 'adds the two forms', 'takes 2 out to reach the form 2k', 'reads the conclusion off the definition of even'];
const SUM_NEED = ['', 'turn “odd” into equations, using the definition', 'add the two forms', 'take 2 out to reach the form 2k', 'read the conclusion off the definition of even'];
const SUM_WRONG = [
 ['Check one case: 3 + 5 = 8, which is even, so it holds every time.', 'checks one example, and an example is not a proof for every m and n'],
 ['By the definition of odd, m = 2a + 1 and n = 2a + 1 for one whole number a.', 'uses the same a for both numbers, which would force m = n'],
 ['So m + n is odd.', 'states the opposite of the conclusion'],
 ['Assume m + n is even.', 'assumes the conclusion instead of proving it']
];

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The sum of two odd bunk numbers',
 brief: 'The dormitory warden claims that two odd bunk numbers always add up to an even number, and the workshop has a proof with a gap in it.',
 labels: ['bracket a + b + 1', 'choice that fills the gap'], tolerance: 0.01,
 gl: [['bracket a + b + 1'], ['m + n', '2 × bracket'], ['choice that fills the gap']]
}, {
 canonical: { a: 6, b: 2, g: 3, cands: [1, 0, 3, 4] },
 draw: R => ({ a: R.int(2, 9), b: R.int(2, 9), g: R.int(2, 5), cands: shuffle(R, [0, ...shuffle(R, [1, 2, 3, 4]).slice(0, 3)]) }),
 build: ({ a, b, g, cands }) => { const m = 2 * a + 1, nn = 2 * b + 1, br = a + b + 1, idx = cands.indexOf(0) + 1;
  const text = c => c === 0 ? SUM_STEPS[g - 1] : SUM_WRONG[c - 1][0];
  const steps = SUM_STEPS.map((s, i) => `Step ${i + 1}: ${i + 1 === g ? '(missing)' : s}`).join(' ');
  const wrongs = cands.map((c, i) => c === 0 ? '' : `Choice ${i + 1} ${SUM_WRONG[c - 1][1]}.`).filter(Boolean).join(' ');
  return {
  prompt: `Dara proves the theorem “if m and n are odd, then m + n is even” with a direct proof, but one step has fallen off the board. ${steps} The choices for the gap are: ${choices(cands.map(text))} For m = ${n(m)} and n = ${n(nn)}, so that a = ${n(a)} and b = ${n(b)}, enter the value of the bracket a + b + 1. Then enter the number of the choice that fills the gap.`,
  answer: [br, idx],
  hints: ['Put the numbers into the bracket: add a and b, then add 1.', `Read the steps on either side of the gap. Step ${g} has to lead from the one before it to the one after it, using only definitions and algebra.`],
  solution: `With a = ${n(a)} and b = ${n(b)}, a + b + 1 = ${n(a)} + ${n(b)} + 1 = ${n(br)}, and indeed ${n(m)} + ${n(nn)} = ${n(m + nn)} = 2 × ${n(br)}. The gap is step ${g}, which ${SUM_JOB[g - 1]}: choice ${idx} says exactly that. ${wrongs}`,
  guidance: [
   { prompt: `Work out the bracket a + b + 1 with a = ${n(a)} and b = ${n(b)}.`, answer: [br], explanation: `${n(a)} + ${n(b)} + 1 = ${n(br)}.` },
   { prompt: `Check the theorem on these numbers. What is m + n = ${n(m)} + ${n(nn)}, and what is 2 × ${n(br)}?`, answer: [m + nn, 2 * br], explanation: `${n(m)} + ${n(nn)} = ${n(m + nn)} and 2 × ${n(br)} = ${n(2 * br)}: the same number, even as the proof says. One check is not a proof, but it catches a slip in the algebra.` },
   { prompt: `Step ${g} has to ${SUM_NEED[g - 1]}. Which choice does that?`, answer: [idx], explanation: `Choice ${idx}: “${SUM_STEPS[g - 1]}” ${wrongs}` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Two odd serial numbers',
 brief: 'Two parts carry odd serial numbers, and the stores clerk wants their product written in the form the proof gives.',
 labels: ['a', 'b', 'bracket 2ab + a + b'], tolerance: 0.01,
 gl: [['a', 'b'], ['bracket 2ab + a + b'], ['m × n']]
}, {
 canonical: { a: 4, b: 7 },
 draw: R => { let a, b; do { a = R.int(2, 12); b = R.int(2, 12); } while (a === 5 && b === 3); return { a, b }; },
 build: ({ a, b }) => { const m = 2 * a + 1, nn = 2 * b + 1, br = 2 * a * b + a + b; return {
  prompt: `Two spare parts in the stores carry the odd serial numbers ${n(m)} and ${n(nn)}. The direct proof that “if m and n are odd, then m × n is odd” writes m = 2a + 1 and n = 2b + 1, and reaches m × n = 2(2ab + a + b) + 1. Take m = ${n(m)} and n = ${n(nn)}. Enter a, then b, then the value of the bracket 2ab + a + b.`,
  answer: [a, b, br],
  hints: ['m = 2a + 1 means that 2a is one less than m. Take 1 away from each serial number and halve what is left.', 'Put a and b into the bracket: 2 × a × b, then add a and add b.'],
  solution: `${n(m)} − 1 = ${n(m - 1)} and ${n(m - 1)} ÷ 2 = ${n(a)}, so a = ${n(a)}. ${n(nn)} − 1 = ${n(nn - 1)} and ${n(nn - 1)} ÷ 2 = ${n(b)}, so b = ${n(b)}. Then 2ab + a + b = 2 × ${n(a)} × ${n(b)} + ${n(a)} + ${n(b)} = ${n(br)}, and indeed ${n(m)} × ${n(nn)} = ${n(m * nn)} = 2 × ${n(br)} + 1.`,
  guidance: [
   { prompt: `Write ${n(m)} = 2a + 1 and ${n(nn)} = 2b + 1. Enter a, then b.`, answer: [a, b], explanation: `${n(m)} − 1 = ${n(m - 1)} and halving gives a = ${n(a)}. ${n(nn)} − 1 = ${n(nn - 1)} and halving gives b = ${n(b)}.` },
   { prompt: `Work out the bracket 2ab + a + b with a = ${n(a)} and b = ${n(b)}.`, answer: [br], explanation: `2 × ${n(a)} × ${n(b)} = ${n(2 * a * b)}, and ${n(2 * a * b)} + ${n(a)} + ${n(b)} = ${n(br)}.` },
   { prompt: `Check the proof: what is m × n = ${n(m)} × ${n(nn)}? It should equal 2 × ${n(br)} + 1.`, answer: [m * nn], explanation: `${n(m)} × ${n(nn)} = ${n(m * nn)} and 2 × ${n(br)} + 1 = ${n(2 * br + 1)}: the same odd number.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q19', title: 'Three odd numbers in a row',
 brief: 'The workshop wants the theorem used twice, to show that a product of three odd numbers is odd.',
 labels: ['k', 'K', 'm × n × p'], tolerance: 0.01,
 gl: [['k'], ['K'], ['m × n × p']]
}, {
 canonical: { a: 2, b: 5, c: 3 },
 draw: R => { let a, b, c; do { a = R.int(1, 6); b = R.int(1, 6); c = R.int(1, 6); } while (a === 2 && b === 5 && c === 3); return { a, b, c }; },
 build: ({ a, b, c }) => { const m = 2 * a + 1, nn = 2 * b + 1, p = 2 * c + 1, k = 2 * a * b + a + b, K = 2 * k * c + k + c, prod = m * nn * p; return {
  prompt: `The theorem “if m and n are odd, then m × n is odd” has the proof m = 2a + 1, n = 2b + 1, so m × n = 2(2ab + a + b) + 1. Using a theorem on facts you already have is modus ponens. Take three odd numbers m = ${n(m)}, n = ${n(nn)} and p = ${n(p)}, so that a = ${n(a)}, b = ${n(b)} and c = ${n(c)}. First use the theorem on m and n: m × n = 2k + 1 with k = 2ab + a + b. Then use it again on the odd numbers m × n and p: (m × n) × p = 2K + 1 with K = 2kc + k + c. Enter k, then K, then the product m × n × p (type it without commas).`,
  answer: [k, K, prod],
  hints: ['Work out k first with the bracket of the proof, then use that k in place of a, and c in place of b, in the same bracket: 2 × k × c + k + c.', 'The product m × n × p is m × n, which is 2k + 1, times p. It must equal 2K + 1, which is a check on your K.'],
  solution: `k = 2ab + a + b = 2 × ${n(a)} × ${n(b)} + ${n(a)} + ${n(b)} = ${n(k)}, and indeed ${n(m)} × ${n(nn)} = ${n(m * nn)} = 2 × ${n(k)} + 1. The odd number m × n = 2k + 1 plays the part of m, and p = 2c + 1 the part of n, so K = 2kc + k + c = 2 × ${n(k)} × ${n(c)} + ${n(k)} + ${n(c)} = ${n(K)}. The product is ${n(m * nn)} × ${n(p)} = ${n(prod)} = 2 × ${n(K)} + 1, which is odd.`,
  guidance: [
   { prompt: `Use the theorem on m = ${n(m)} and n = ${n(nn)}, with a = ${n(a)} and b = ${n(b)}. What is k = 2ab + a + b?`, answer: [k], explanation: `2 × ${n(a)} × ${n(b)} + ${n(a)} + ${n(b)} = ${n(k)}, and ${n(m)} × ${n(nn)} = ${n(m * nn)} = 2 × ${n(k)} + 1.` },
   { prompt: `Now m × n = 2k + 1 is odd, and so is p = 2c + 1 with c = ${n(c)}. Use the theorem again: what is K = 2kc + k + c with k = ${n(k)}?`, answer: [K], explanation: `2 × ${n(k)} × ${n(c)} = ${n(2 * k * c)}, and ${n(2 * k * c)} + ${n(k)} + ${n(c)} = ${n(K)}.` },
   { prompt: `Check the result: what is m × n × p = ${n(m * nn)} × ${n(p)}? It should equal 2 × ${n(K)} + 1.`, answer: [prod], explanation: `${n(m * nn)} × ${n(p)} = ${n(prod)} and 2 × ${n(K)} + 1 = ${n(2 * K + 1)}: the same odd number.` }
  ] }; }
});

})();
