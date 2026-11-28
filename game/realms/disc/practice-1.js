/* Discrete mathematics practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p1.js. */
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
/* Set and list text: S([2, 5]) is '{2, 5}'; and(['a', 'b', 'c']) is 'a, b and c'. */
const S = list => `{${list.map(n).join(', ')}}`;
const and = items => items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
const sorted = list => list.slice().sort((x, y) => x - y);
/* k different whole numbers from lo to hi, none of them in `avoid`. */
const distinct = (R, k, lo, hi, avoid = []) => { const out = []; while (out.length < k) { const v = R.int(lo, hi); if (!out.includes(v) && !avoid.includes(v)) out.push(v); } return out; };
/* The values written more than once in a list, smallest first. */
const repeated = list => sorted([...new Set(list.filter((v, i) => list.indexOf(v) !== i))]);
/* Multiples of k from a to b, both ends included when they fit. */
const mults = (k, a, b) => { const out = []; for (let v = Math.ceil(a / k) * k; v <= b; v += k) out.push(v); return out; };
/* The text with its first letter in capitals, for a colour name that starts a sentence. */
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
const COLOURS = ['red', 'blue', 'green', 'amber', 'white', 'grey', 'black', 'orange', 'violet', 'teal', 'pink', 'brown'];
/* A list with each value of `d` written once and the values at `dupIdx` written a second time at random places. */
const withRepeats = (R, d, dupIdx) => { const list = d.slice(); for (const i of dupIdx) list.splice(R.int(0, list.length), 0, d[i]); return list; };

/* ---- q01 Sets, elements and cardinality [CM 1.1, Levin 0.3] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'Cable drum tags',
 brief: 'The cable store logs every drum by its tag number, and the clerk wrote some tags down twice.',
 labels: ['|S|', '|D|'], tolerance: 0.01,
 gl: [['smaller repeated tag', 'larger repeated tag'], ['different tags'], ['|S|']]
}, {
 /* Not the worked example of q01. Two tags are written twice; S runs between two multiples. */
 canonical: { list: [9, 14, 22, 9, 31, 14, 5], k: 6, a: 18, b: 66 },
 draw: R => { const m = R.int(4, 7), d = distinct(R, m, 2, 60), list = withRepeats(R, d, distinct(R, 2, 0, m - 1)), k = R.int(3, 9), a = k * R.int(1, 6);
  return { list, k, a, b: a + (R.int(4, 12) - 1) * k }; },
 build: ({ list, k, a, b }) => { const set = sorted([...new Set(list)]), dups = repeated(list), m = set.length, cnt = (b - a) / k + 1; return {
  prompt: `The cable store logs its drums by tag number, and the clerk’s log reads D = ${S(list)}. Set S is every multiple of ${n(k)} from ${n(a)} to ${n(b)}; ${n(a)} and ${n(b)} are both multiples of ${n(k)}, and both belong to S. Enter |S|, then |D|, the number of different drum tags in the log.`,
  answer: [cnt, m],
  hints: ['A set counts each element once, so a tag written twice in the log is still one tag.', `From ${n(a)} to ${n(b)} in steps of ${n(k)}, there is one more number than there are steps.`],
  solution: `S runs from ${n(a)} to ${n(b)} in steps of ${n(k)}, so |S| = (${n(b)} − ${n(a)}) ÷ ${n(k)} + 1 = ${n(cnt)}. The log has ${n(list.length)} entries, but ${and(dups.map(n))} are each written twice, so D = ${S(set)} and |D| = ${n(m)}.`,
  guidance: [
   { prompt: `Which two tags in the log D = ${S(list)} are written twice? Enter the smaller, then the larger.`, answer: dups, explanation: `${n(dups[0])} and ${n(dups[1])} each appear twice, and each is one element.` },
   { prompt: `The log has ${n(list.length)} entries. Cross out the repeats. How many different tags are left?`, answer: [m], explanation: `Two entries are repeats, so D = ${S(set)}, with ${n(m)} different tags.` },
   { prompt: `How many numbers are there from ${n(a)} to ${n(b)} in steps of ${n(k)}? Work out (${n(b)} − ${n(a)}) ÷ ${n(k)} + 1.`, answer: [cnt], explanation: `(${n(b)} − ${n(a)}) ÷ ${n(k)} = ${n(cnt - 1)} steps, and the + 1 counts the first number: |S| = ${n(cnt)}.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Shelves by the label',
 brief: 'Mira is fitting out a new aisle, and the shelf labels follow a rule instead of a list.',
 labels: ['labelled shelves', 'crates in all'], tolerance: 0.01,
 gl: [['first label', 'last label'], ['labelled shelves'], ['crates in all']]
}, {
 canonical: { k: 7, a: 20, b: 90, s: 6 },
 draw: R => { const k = R.int(4, 9), a = R.int(5, 40); return { k, a, b: a + R.int(4, 12) * k + R.int(0, k - 1), s: R.int(3, 9) }; },
 build: ({ k, a, b, s }) => { const m = mults(k, a, b), first = m[0], last = m[m.length - 1], cnt = m.length; return {
  prompt: `The new aisle labels its shelves with the set L of all multiples of ${n(k)} from ${n(a)} to ${n(b)}, one shelf for each element. Every shelf holds ${n(s)} crates. Enter |L|, the number of labelled shelves, then the number of crates the aisle holds in all.`,
  answer: [cnt, cnt * s],
  hints: [`Find the first multiple of ${n(k)} that is ${n(a)} or more and the last one that is ${n(b)} or less, then count in steps of ${n(k)}.`, 'Each shelf is one element of L, so the crates in all are the number of shelves times the crates on one shelf.'],
  solution: `The first multiple of ${n(k)} that is ${n(a)} or more is ${n(first)}, and the last that is ${n(b)} or less is ${n(last)}. So |L| = (${n(last)} − ${n(first)}) ÷ ${n(k)} + 1 = ${n(cnt)} shelves. With ${n(s)} crates on each shelf, the aisle holds ${n(cnt)} × ${n(s)} = ${n(cnt * s)} crates.`,
  guidance: [
   { prompt: `What are the smallest and the largest multiples of ${n(k)} from ${n(a)} to ${n(b)}?`, answer: [first, last], explanation: `${n(first)} = ${n(k)} × ${n(first / k)} is the first that is ${n(a)} or more, and ${n(last)} = ${n(k)} × ${n(last / k)} is the last that is ${n(b)} or less.` },
   { prompt: `How many numbers are there from ${n(first)} to ${n(last)} in steps of ${n(k)}?`, answer: [cnt], explanation: `(${n(last)} − ${n(first)}) ÷ ${n(k)} + 1 = ${n(cnt)}, so |L| = ${n(cnt)}.` },
   { prompt: `There are ${n(cnt)} shelves with ${n(s)} crates each. How many crates is that in all?`, answer: [cnt * s], explanation: `${n(cnt)} × ${n(s)} = ${n(cnt * s)} crates.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The master code audit',
 brief: 'The depot’s master code list was copied by hand and has several repeats, and Mira wants a clean count of both it and the code range it should match.',
 labels: ['|P|', '|M|'], tolerance: 0.01,
 gl: [['first number inside', 'last number inside'], ['|P|'], ['different codes in M']]
}, {
 canonical: { list: [41, 17, 58, 17, 83, 29, 41, 66, 29, 90], k: 13, s: 2, c: 14 },
 draw: R => { const m = R.int(6, 8), d = distinct(R, m, 10, 99); return { list: withRepeats(R, d, distinct(R, 3, 0, m - 1)), k: R.int(11, 19), s: R.int(2, 5), c: R.int(8, 20) }; },
 build: ({ list, k, s, c }) => { const a = k * s, b = k * (s + c + 1), set = sorted([...new Set(list)]), dups = repeated(list), m = set.length; return {
  prompt: `The depot’s master code list was copied by hand: M = ${S(list)}. Set P is every multiple of ${n(k)} strictly between ${n(a)} and ${n(b)}, so ${n(a)} and ${n(b)} themselves are not in P. Enter |P|, then |M|, the number of different codes in the master list.`,
  answer: [c, m],
  hints: [`“Strictly between” leaves out both ends. Since ${n(a)} and ${n(b)} are multiples of ${n(k)}, the first number in P is the next multiple after ${n(a)}.`, 'Cross out each code that is written more than once in M, keeping one copy, and count what is left.'],
  solution: `The multiples of ${n(k)} strictly between ${n(a)} and ${n(b)} run from ${n(a + k)} to ${n(b - k)}, so |P| = (${n(b - k)} − ${n(a + k)}) ÷ ${n(k)} + 1 = ${n(c)}. The list M has ${n(list.length)} entries, but ${and(dups.map(n))} are each written twice, so M = ${S(set)} and |M| = ${n(m)}.`,
  guidance: [
   { prompt: `What are the smallest and the largest multiples of ${n(k)} strictly between ${n(a)} and ${n(b)}?`, answer: [a + k, b - k], explanation: `${n(a)} and ${n(b)} are left out, so P starts at ${n(a)} + ${n(k)} = ${n(a + k)} and ends at ${n(b)} − ${n(k)} = ${n(b - k)}.` },
   { prompt: `How many numbers are there from ${n(a + k)} to ${n(b - k)} in steps of ${n(k)}?`, answer: [c], explanation: `(${n(b - k)} − ${n(a + k)}) ÷ ${n(k)} + 1 = ${n(c)}, so |P| = ${n(c)}.` },
   { prompt: `The list M has ${n(list.length)} entries and ${n(dups.length)} of its codes are written twice. How many different codes does it hold?`, answer: [m], explanation: `${and(dups.map(n))} are each written twice and count once, so ${n(list.length)} − ${n(dups.length)} = ${n(m)} different codes.` }
  ] }; }
});

/* ---- q02 Subsets and the empty set [Levin 0.3] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The spares drawer',
 brief: 'A repair order has come in for the pump house, and the stores need to know whether the spares drawer can fill it whole.',
 labels: ['R ⊆ D (1 yes, 0 no)', 'parts not in the drawer'], tolerance: 0.01,
 gl: [['parts of R found in D'], ['R ⊆ D (1 yes, 0 no)'], ['parts not in the drawer']]
}, {
 canonical: { R: [6, 17, 25, 38], D: [4, 6, 11, 17, 23, 25, 38, 42] },
 draw: R => { const D = sorted(distinct(R, R.int(6, 9), 2, 45)), k = R.int(3, 4), A = distinct(R, k, 0, D.length - 1).map(i => D[i]), swaps = R.int(0, 2);
  distinct(R, swaps, 0, k - 1).forEach((i, j) => { A[i] = distinct(R, 1, 2, 45, [...D, ...A])[0]; });
  return { R: sorted(A), D }; },
 build: ({ R, D }) => { const found = R.filter(v => D.includes(v)), out = R.filter(v => !D.includes(v)), sub = out.length ? 0 : 1; return {
  prompt: `A repair order asks for the parts R = ${S(R)}. The spares drawer holds the parts D = ${S(D)}. Enter 1 if R ⊆ D, that is, the drawer has every part on the order, or 0 if not. Then enter how many parts on the order are not in the drawer.`,
  answer: [sub, out.length],
  hints: ['Look for each part of R in D, one at a time. One part that cannot be found is enough to make the first answer 0.', 'For the second answer, count the parts of R that you could not find in D. It can be 0.'],
  solution: `${and(found.map(n))} ${found.length === 1 ? 'is' : 'are'} in D${out.length ? `, but ${and(out.map(n))} ${out.length === 1 ? 'is' : 'are'} not` : ''}. ${sub ? 'Every part of R is in D, so R ⊆ D: enter 1, and no part of the order is missing from the drawer: 0.' : `R is not a subset of D: enter 0. The parts missing from the drawer are ${and(out.map(n))}, so ${n(out.length)} ${out.length === 1 ? 'part is' : 'parts are'} not there.`}`,
  guidance: [
   { prompt: `How many of the parts ${S(R)} on the order can be found in the drawer?`, answer: [found.length], explanation: `${and(found.map(n))} ${found.length === 1 ? 'is' : 'are'} in D.` },
   { prompt: `The order has ${n(R.length)} parts. Enter 1 if all of them are in the drawer, or 0 if at least one is missing.`, answer: [sub], explanation: sub ? 'All of them are in D, so R ⊆ D.' : 'One missing part is enough: R is not a subset of D.' },
   { prompt: `How many of the ${n(R.length)} parts on the order are not in the drawer?`, answer: [out.length], explanation: `${n(R.length)} − ${n(found.length)} = ${n(out.length)}.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'All or nothing from the shelf',
 brief: 'The shelf only releases crates for a whole order, and the weight left on it decides whether the floor needs propping.',
 labels: ['A ⊆ S (1 yes, 0 no)', 'crates left on the shelf', 'mass left (kg)'], tolerance: 0.01,
 gl: [['A ⊆ S (1 yes, 0 no)'], ['crates left on the shelf'], ['mass left (kg)']]
}, {
 canonical: { A: [5, 12, 19], S: [2, 5, 9, 12, 16, 19, 23], w: 8 },
 draw: R => { const S = sorted(distinct(R, R.int(6, 9), 2, 45)), k = R.int(2, 4), A = distinct(R, k, 0, S.length - 1).map(i => S[i]);
  if (R.bool()) A[R.int(0, k - 1)] = distinct(R, 1, 2, 45, S)[0];
  return { A: sorted(A), S, w: R.int(3, 9) }; },
 build: ({ A, S: shelf, w }) => { const out = A.filter(v => !shelf.includes(v)), sub = out.length ? 0 : 1, left = sub ? shelf.length - A.length : shelf.length, mass = left * w; return {
  prompt: `Shelf S holds the crates numbered ${S(shelf)}, and each crate has a mass of ${n(w)} kg. An order asks for the crates A = ${S(A)}. The shelf releases crates only if it can fill the whole order; otherwise it releases none. Enter 1 if A ⊆ S or 0 if not, then the number of crates left on the shelf once the order is dealt with, then the mass of those crates in kg.`,
  answer: [sub, left, mass],
  hints: ['Check each crate of A against S. If one is missing, the shelf releases nothing and every crate stays.', 'If the order is filled, the crates that leave are exactly the elements of A, so |S| − |A| stay. Then multiply by the mass of one crate.'],
  solution: `${sub ? `Every crate of A is in S, so A ⊆ S: enter 1. The order is filled and ${n(A.length)} crates leave, so ${n(shelf.length)} − ${n(A.length)} = ${n(left)} crates are left.` : `${and(out.map(n))} ${out.length === 1 ? 'is' : 'are'} not in S, so A is not a subset of S: enter 0. The shelf releases nothing, so all ${n(left)} crates are left.`} Their mass is ${n(left)} × ${n(w)} = ${n(mass)} kg.`,
  guidance: [
   { prompt: `Are all of the crates ${S(A)} on shelf S? Enter 1 if they are, or 0 if at least one is missing.`, answer: [sub], explanation: sub ? 'All of them are on the shelf, so A ⊆ S.' : `${and(out.map(n))} ${out.length === 1 ? 'is' : 'are'} not on the shelf, so A is not a subset of S.` },
   { prompt: `The shelf holds ${n(shelf.length)} crates and the order has ${n(A.length)}. How many crates are left on the shelf?`, answer: [left], explanation: sub ? `The order is filled, so ${n(shelf.length)} − ${n(A.length)} = ${n(left)} crates stay.` : `The order cannot be filled, so nothing leaves and all ${n(left)} crates stay.` },
   { prompt: `${n(left)} crates are left, each of mass ${n(w)} kg. What is their mass in kg?`, answer: [mass], explanation: `${n(left)} × ${n(w)} = ${n(mass)} kg.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'The coded rack check',
 brief: 'A dock list repeats some crates, and the rack it must be filled from is described by a rule, not a list.',
 labels: ['A ⊆ B (1 yes, 0 no)', 'crates of B not on A'], tolerance: 0.01,
 gl: [['|B|'], ['crates of A in B'], ['A ⊆ B (1 yes, 0 no)', 'crates of B not on A']]
}, {
 canonical: { k: 5, a: 12, b: 63, A: [20, 35, 20, 50, 60] },
 draw: R => { const k = R.int(3, 8), a = R.int(5, 20), b = a + R.int(6, 12) * k + R.int(0, k - 1), M = mults(k, a, b), j = R.int(3, 5), idx = distinct(R, j, 0, M.length - 1), d = idx.map(i => M[i]);
  if (R.bool()) { let x; do { x = R.int(5, b + 5); } while (x % k === 0 || x < 1); d[R.int(0, j - 1)] = x; }
  return { k, a, b, A: withRepeats(R, d, [R.int(0, j - 1)]) }; },
 build: ({ k, a, b, A }) => { const M = mults(k, a, b), cnt = M.length, set = sorted([...new Set(A)]), common = set.filter(v => M.includes(v)), out = set.filter(v => !M.includes(v)), sub = out.length ? 0 : 1, rest = cnt - common.length; return {
  prompt: `Rack B holds every crate whose number is a multiple of ${n(k)} from ${n(a)} to ${n(b)}. The dock list has been written A = ${S(A)}, with one crate written twice. Enter 1 if A ⊆ B, that is, every different crate on the list is in the rack, or 0 if not. Then enter how many crates of rack B are not on the list.`,
  answer: [sub, rest],
  hints: [`Work out which numbers are in B first: the multiples of ${n(k)} from ${n(a)} to ${n(b)}. The crate written twice on the list counts once.`, 'For the second answer, take the crates of A that really are in B away from the number of crates in B.'],
  solution: `B starts at ${n(M[0])} and ends at ${n(M[cnt - 1])}, in steps of ${n(k)}, so |B| = (${n(M[cnt - 1])} − ${n(M[0])}) ÷ ${n(k)} + 1 = ${n(cnt)}. The different crates on the list are ${S(set)}. ${sub ? 'All of them are in B, so A ⊆ B: enter 1.' : `${and(out.map(n))} ${out.length === 1 ? 'is' : 'are'} not a multiple of ${n(k)} in that range, so A is not a subset of B: enter 0.`} ${n(common.length)} of them are in B, so ${n(cnt)} − ${n(common.length)} = ${n(rest)} crates of B are not on the list.`,
  guidance: [
   { prompt: `How many crates are in rack B: the multiples of ${n(k)} from ${n(a)} to ${n(b)}?`, answer: [cnt], explanation: `From ${n(M[0])} to ${n(M[cnt - 1])} in steps of ${n(k)}: (${n(M[cnt - 1])} − ${n(M[0])}) ÷ ${n(k)} + 1 = ${n(cnt)}.` },
   { prompt: `The list is ${S(A)}. Counting the repeated crate once, how many different crates of the list are in B?`, answer: [common.length], explanation: `The different crates are ${S(set)}, and ${n(common.length)} of them ${common.length === 1 ? 'is a multiple' : 'are multiples'} of ${n(k)} in the range of B.` },
   { prompt: `Enter 1 if every different crate on the list is in B, or 0 if not. Then enter how many crates of B are not on the list.`, answer: [sub, rest], explanation: `${sub ? 'All of them are in B, so A ⊆ B.' : 'At least one is outside B, so A is not a subset of B.'} The rest of B is ${n(cnt)} − ${n(common.length)} = ${n(rest)}.` }
  ] }; }
});

/* ---- q03 Union and intersection [CM 1.4, Levin 0.3] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Two paint cupboards',
 brief: 'The paint store keeps tins in two cupboards, and Mira wants to know which colours are doubled up and how many colours there are.',
 labels: ['|A ∩ B|', '|A ∪ B|'], tolerance: 0.01,
 gl: [['|A ∩ B|'], ['colours only in B'], ['|A ∪ B|']]
}, {
 canonical: { s: 2, a: 3, b: 2, pick: [4, 1, 7, 10, 2, 5, 9] },
 /* pick is a shuffled choice of s + a + b colours from the twelve; the first s are in both cupboards. */
 draw: R => { const s = R.int(1, 4), a = R.int(2, 4), b = R.int(2, 4); return { s, a, b, pick: distinct(R, s + a + b, 0, COLOURS.length - 1) }; },
 build: ({ s, a, b, pick }) => { const name = i => COLOURS[i], inter = pick.slice(0, s), onlyA = pick.slice(s, s + a), onlyB = pick.slice(s + a),
  ord = list => sorted(list), A = ord([...inter, ...onlyA]), B = ord([...inter, ...onlyB]), words = list => `{${list.map(name).join(', ')}}`, nu = s + a + b; return {
  prompt: `The paint store keeps tins in two cupboards. Cupboard A holds the colours ${words(A)}, and cupboard B holds ${words(B)}. Enter |A ∩ B|, the number of colours kept in both cupboards, then |A ∪ B|, the number of different colours the store holds.`,
  answer: [s, nu],
  hints: ['For the intersection, go through the colours of A and keep each one that is also in B.', 'For the union, start with all of A and add each colour of B that A does not have. A shared colour is written once.'],
  solution: `The colours in both cupboards are ${and(ord(inter).map(name))}, so A ∩ B = ${words(ord(inter))} and |A ∩ B| = ${n(s)}. The union is A with the colours of B that A lacks (${and(ord(onlyB).map(name))}) added, so |A ∪ B| = ${n(a + s)} + ${n(b)} = ${n(nu)}.`,
  guidance: [
   { prompt: 'Which colours are in both cupboards? Enter how many there are.', answer: [s], explanation: `${cap(and(ord(inter).map(name)))} ${s === 1 ? 'is' : 'are'} in both, so |A ∩ B| = ${n(s)}.` },
   { prompt: 'How many colours of cupboard B are not in cupboard A?', answer: [b], explanation: `${cap(and(ord(onlyB).map(name)))} ${b === 1 ? 'is' : 'are'} in B only.` },
   { prompt: `Cupboard A has ${n(A.length)} colours. Add the ${n(b)} colours that only B has. What is |A ∪ B|?`, answer: [nu], explanation: `${n(A.length)} + ${n(b)} = ${n(nu)}. The shared colours are already in A.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Paying the bay inspectors',
 brief: 'Two inspection teams checked the bays and some bays got a double check, and the pay desk wants one total.',
 labels: ['|A ∩ B|', '|A ∪ B|', 'credits'], tolerance: 0.01,
 gl: [['|A ∩ B|'], ['|A ∪ B|'], ['credits']]
}, {
 canonical: { A: [3, 8, 11, 15, 22, 30], B: [8, 15, 19, 22, 35], p: 5, q: 3 },
 draw: R => { const s = R.int(1, 4), a = R.int(2, 5), b = R.int(2, 5), all = distinct(R, s + a + b, 1, 40);
  return { A: sorted(all.slice(0, s + a)), B: sorted([...all.slice(0, s), ...all.slice(s + a)]), p: R.int(3, 6), q: R.int(2, 4) }; },
 build: ({ A, B, p, q }) => { const inter = A.filter(v => B.includes(v)), newB = B.filter(v => !A.includes(v)), nu = A.length + newB.length, ni = inter.length, pay = p * nu + q * ni; return {
  prompt: `Team A inspected the bays ${S(A)} and team B inspected ${S(B)}. Each bay that was inspected at all earns ${n(p)} credits, and a bay that both teams inspected earns a further ${n(q)} credits for the double check. Enter |A ∩ B|, then |A ∪ B|, then the total credits earned.`,
  answer: [ni, nu, pay],
  hints: ['The double-checked bays are the intersection, and the bays inspected at all are the union. Find both sets first.', 'The union counts a shared bay once, which is what the first rate pays. The double check is paid on the intersection on top of that.'],
  solution: `${ni === 1 ? `The only bay on both lists is ${n(inter[0])}` : `The bays on both lists are ${and(inter.map(n))}`}, so |A ∩ B| = ${n(ni)}. Team A has ${n(A.length)} bays and team B adds ${n(newB.length)} that A lacks, so |A ∪ B| = ${n(A.length)} + ${n(newB.length)} = ${n(nu)}. Credits: ${n(nu)} × ${n(p)} + ${n(ni)} × ${n(q)} = ${n(p * nu)} + ${n(q * ni)} = ${n(pay)}.`,
  guidance: [
   { prompt: 'Which bays did both teams inspect? Enter how many there are.', answer: [ni], explanation: `${and(inter.map(n))} ${ni === 1 ? 'was' : 'were'} on both lists, so |A ∩ B| = ${n(ni)}.` },
   { prompt: `Team A inspected ${n(A.length)} bays. How many bays did team B inspect that A did not, and so what is |A ∪ B|? Enter |A ∪ B|.`, answer: [nu], explanation: `Team B added ${n(newB.length)} new bays, so |A ∪ B| = ${n(A.length)} + ${n(newB.length)} = ${n(nu)}.` },
   { prompt: `${n(nu)} bays earn ${n(p)} credits each, and ${n(ni)} of them earn ${n(q)} credits more. What is the total?`, answer: [pay], explanation: `${n(nu)} × ${n(p)} = ${n(p * nu)}, and ${n(ni)} × ${n(q)} = ${n(q * ni)}, so the total is ${n(pay)} credits.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q01', title: 'Matching the range to the log',
 brief: 'The depot’s code range is set by a rule, and the clerk’s log has to be matched against it with repeats ignored.',
 labels: ['|P ∩ Q|', '|P ∪ Q|'], tolerance: 0.01,
 gl: [['|P|'], ['|P ∩ Q|'], ['|P ∪ Q|']]
}, {
 canonical: { k: 6, a: 10, b: 60, Q: [18, 25, 30, 18, 42, 47, 60] },
 draw: R => { const k = R.int(4, 9), a = R.int(5, 30), b = a + R.int(6, 12) * k + R.int(0, k - 1), M = mults(k, a, b), s = R.int(2, 4), o = R.int(1, 3),
   shared = distinct(R, s, 0, M.length - 1).map(i => M[i]), others = []; while (others.length < o) { const x = R.int(3, b + 8); if (x % k !== 0 && !others.includes(x)) others.push(x); }
  const d = [...shared, ...others]; return { k, a, b, Q: withRepeats(R, d, [R.int(0, d.length - 1)]) }; },
 build: ({ k, a, b, Q }) => { const M = mults(k, a, b), cnt = M.length, set = sorted([...new Set(Q)]), inter = set.filter(v => M.includes(v)), only = set.filter(v => !M.includes(v)), nu = cnt + only.length; return {
  prompt: `Set P is the depot’s code range: every multiple of ${n(k)} from ${n(a)} to ${n(b)}. The clerk’s log is Q = ${S(Q)}, with one code written twice. Enter |P ∩ Q|, the number of codes in both, then |P ∪ Q|, the number of different codes in either.`,
  answer: [inter.length, nu],
  hints: [`List P first: the multiples of ${n(k)} that are ${n(a)} or more and ${n(b)} or less. Write the repeated code in Q once.`, 'Intersection: the codes of Q that are in P. Union: all of P plus the codes of Q that are not in P.'],
  solution: `P runs from ${n(M[0])} to ${n(M[cnt - 1])} in steps of ${n(k)}, so |P| = ${n(cnt)}. The different codes of Q are ${S(set)}. Those in P are ${and(inter.map(n))}, so |P ∩ Q| = ${n(inter.length)}. ${only.length === 1 ? `The other, ${n(only[0])}, is` : `The others, ${and(only.map(n))}, are`} not in P, so |P ∪ Q| = ${n(cnt)} + ${n(only.length)} = ${n(nu)}.`,
  guidance: [
   { prompt: `How many numbers are there in P, the multiples of ${n(k)} from ${n(a)} to ${n(b)}?`, answer: [cnt], explanation: `From ${n(M[0])} to ${n(M[cnt - 1])} in steps of ${n(k)}: (${n(M[cnt - 1])} − ${n(M[0])}) ÷ ${n(k)} + 1 = ${n(cnt)}.` },
   { prompt: `Write the log Q = ${S(Q)} with the repeat counted once. How many of its different codes are in P?`, answer: [inter.length], explanation: `${and(inter.map(n))} ${inter.length === 1 ? 'is' : 'are'} in P, so |P ∩ Q| = ${n(inter.length)}.` },
   { prompt: `How many different codes of Q are not in P? Add them to |P| to get |P ∪ Q|.`, answer: [nu], explanation: `${and(only.map(n))} ${only.length === 1 ? 'is' : 'are'} not in P, so |P ∪ Q| = ${n(cnt)} + ${n(only.length)} = ${n(nu)}.` }
  ] }; }
});

/* ---- q04 Complement, difference and |A ∪ B| = |A| + |B| − |A ∩ B| [CM 1.4, Levin 0.3] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'Seals and barcodes',
 brief: 'The dispatch hall needs to know how many crates carry a barcode but no seal, and how many carry neither.',
 labels: ['|B \\ S|', 'neither'], tolerance: 0.01,
 gl: [['|S ∪ B|'], ['|B \\ S|'], ['neither']]
}, {
 canonical: { U: 80, A: 34, B: 41, AB: 15 },
 draw: R => { const AB = R.int(2, 15), A = AB + R.int(3, 20), B = AB + R.int(3, 20); return { U: A + B - AB + R.int(2, 25), A, B, AB }; },
 build: ({ U, A, B, AB }) => { const un = A + B - AB, ne = U - un, bm = B - AB; return {
  prompt: `The dispatch hall has ${n(U)} crates, and they are the universal set U for this count. ${n(A)} crates carry a red seal (set S), ${n(B)} carry a barcode (set B), and ${n(AB)} carry both. Enter |B \\ S|, the number of crates with a barcode but no seal, then the number of crates that carry neither, |(S ∪ B)ᶜ|.`,
  answer: [bm, ne],
  hints: [`The ${n(AB)} crates with both are inside S and inside B, so they are counted twice when the two totals are added.`, 'For B \\ S, take the crates that also have a seal away from B. For the crates with neither, take the crates that have a seal or a barcode away from all the crates.'],
  solution: `|S ∪ B| = ${n(A)} + ${n(B)} − ${n(AB)} = ${n(un)}. The crates with a barcode but no seal are B \\ S: ${n(B)} − ${n(AB)} = ${n(bm)}. The crates with neither are the complement of S ∪ B: ${n(U)} − ${n(un)} = ${n(ne)}.`,
  guidance: [
   { prompt: 'How many crates carry a seal or a barcode or both? Use |S ∪ B| = |S| + |B| − |S ∩ B|.', answer: [un], explanation: `${n(A)} + ${n(B)} counts the ${n(AB)} crates with both twice, so |S ∪ B| = ${n(A + B)} − ${n(AB)} = ${n(un)}.` },
   { prompt: `How many of the ${n(B)} barcoded crates have no seal?`, answer: [bm], explanation: `${n(B)} − ${n(AB)} = ${n(bm)}, so |B \\ S| = ${n(bm)}.` },
   { prompt: `How many of the ${n(U)} crates carry neither?`, answer: [ne], explanation: `${n(U)} − ${n(un)} = ${n(ne)}.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The inspection queue',
 brief: 'A delivery has come in with dented and wet crates, and Mira needs the inspection time and the number that go straight to the shelves.',
 labels: ['crates to inspect', 'straight to shelves', 'inspection minutes'], tolerance: 0.01,
 gl: [['crates to inspect'], ['straight to shelves'], ['inspection minutes']]
}, {
 canonical: { U: 150, A: 38, B: 46, AB: 17, w: 4 },
 draw: R => { const AB = R.int(3, 20), A = AB + R.int(5, 30), B = AB + R.int(5, 30); return { U: A + B - AB + R.int(5, 40), A, B, AB, w: R.int(2, 6) }; },
 build: ({ U, A, B, AB, w }) => { const un = A + B - AB, ne = U - un, min = un * w; return {
  prompt: `A delivery of ${n(U)} crates arrives, and they are the universal set U. ${n(A)} are dented (set D) and ${n(B)} are wet (set W); ${n(AB)} are both dented and wet. Every crate that is dented or wet, or both, goes to inspection and takes ${n(w)} minutes. The rest go straight to the shelves. Enter the number of crates sent to inspection, the number sent straight to the shelves, and the total inspection time in minutes.`,
  answer: [un, ne, min],
  hints: [`The ${n(AB)} crates that are both dented and wet are in D and in W, so adding the two totals counts them twice.`, 'The crates that go straight to the shelves are the ones outside both circles. The time is the number inspected times the minutes for one.'],
  solution: `|D ∪ W| = ${n(A)} + ${n(B)} − ${n(AB)} = ${n(un)} crates go to inspection. The rest are the complement of D ∪ W: ${n(U)} − ${n(un)} = ${n(ne)} go straight to the shelves. Inspection takes ${n(un)} × ${n(w)} = ${n(min)} minutes.`,
  guidance: [
   { prompt: 'How many crates are dented or wet or both?', answer: [un], explanation: `${n(A)} + ${n(B)} − ${n(AB)} = ${n(un)}, because the ${n(AB)} crates that are both were counted twice.` },
   { prompt: `How many of the ${n(U)} crates are outside D ∪ W?`, answer: [ne], explanation: `${n(U)} − ${n(un)} = ${n(ne)} crates go straight to the shelves.` },
   { prompt: `${n(un)} crates are inspected for ${n(w)} minutes each. How many minutes is that?`, answer: [min], explanation: `${n(un)} × ${n(w)} = ${n(min)} minutes.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'Working back from the untagged',
 brief: 'Mira knows how many crates carry no tag at all, and she wants the overlap between the two tag colours worked out backwards.',
 labels: ['|A ∩ B|', '|B \\ A|'], tolerance: 0.01,
 gl: [['|A ∪ B|'], ['|A ∩ B|'], ['|B \\ A|']]
}, {
 canonical: { A: 37, B: 29, AB: 11, N: 14 },
 draw: R => { const AB = R.int(3, 20), A = AB + R.int(4, 30), B = AB + R.int(4, 30); return { A, B, AB, N: R.int(3, 30) }; },
 build: ({ A, B, AB, N }) => { const un = A + B - AB, U = un + N, bm = B - AB; return {
  prompt: `The store rooms hold ${n(U)} crates, and they are the universal set U. ${n(A)} crates have a red tag (set A) and ${n(B)} have a blue tag (set B). ${n(N)} crates have no tag of either colour. Nobody counted how many have both tags. Enter |A ∩ B|, the number of crates with both tags, then |B \\ A|, the number with a blue tag but no red tag.`,
  answer: [AB, bm],
  hints: ['Start from the outside: the crates with no tag are the complement of A ∪ B, so |A ∪ B| = |U| − the untagged crates.', 'Then use |A ∪ B| = |A| + |B| − |A ∩ B| the other way round: the overlap is what the two totals add up to beyond the union.'],
  solution: `The crates with at least one tag are ${n(U)} − ${n(N)} = ${n(un)}, so |A ∪ B| = ${n(un)}. From |A ∪ B| = |A| + |B| − |A ∩ B|: |A ∩ B| = ${n(A)} + ${n(B)} − ${n(un)} = ${n(AB)}. The blue-only crates are ${n(B)} − ${n(AB)} = ${n(bm)}.`,
  guidance: [
   { prompt: `How many of the ${n(U)} crates have at least one tag, red or blue or both?`, answer: [un], explanation: `The ${n(N)} untagged crates are outside A ∪ B, so |A ∪ B| = ${n(U)} − ${n(N)} = ${n(un)}.` },
   { prompt: `Adding the totals gives ${n(A)} + ${n(B)} = ${n(A + B)}, but only ${n(un)} crates have a tag. How many crates were counted twice, that is, have both tags?`, answer: [AB], explanation: `${n(A + B)} − ${n(un)} = ${n(AB)}: the crates with both tags are counted once in A and once in B.` },
   { prompt: `How many of the ${n(B)} blue-tagged crates do not have a red tag?`, answer: [bm], explanation: `${n(B)} − ${n(AB)} = ${n(bm)}.` }
  ] }; }
});

/* ---- q05 Three-set Venn diagrams [CM 1.5] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Skills on the loading crew',
 brief: 'Mira has a skills survey of the loading crew and wants to know who can cover more than one job.',
 labels: ['exactly two skills', 'no skill'], tolerance: 0.01,
 gl: [['D and L only', 'D and K only', 'L and K only'], ['only D', 'only L', 'only K'], ['exactly two skills', 'no skill']]
}, {
 canonical: { oF: 12, oC: 8, oH: 10, FC: 4, FH: 6, CH: 3, FCH: 2, none: 5 },
 draw: R => ({ oF: R.int(3, 20), oC: R.int(3, 20), oH: R.int(3, 20), FC: R.int(1, 9), FH: R.int(1, 9), CH: R.int(1, 9), FCH: R.int(2, 6), none: R.int(2, 15) }),
 build: ({ oF, oC, oH, FC, FH, CH, FCH, none }) => {
  const tF = oF + FC + FH + FCH, tC = oC + FC + CH + FCH, tH = oH + FH + CH + FCH, pFC = FC + FCH, pFH = FH + FCH, pCH = CH + FCH,
   seven = oF + oC + oH + FC + FH + CH + FCH, N = seven + none, two = FC + FH + CH; return {
  prompt: `A skills survey of the ${n(N)} people on the loading crew finds ${n(tF)} can drive a loader (set D), ${n(tC)} can operate the lift (set L) and ${n(tH)} can keep the count (set K). Of these, ${n(pFC)} can drive and lift, ${n(pFH)} can drive and count, ${n(pCH)} can lift and count, and ${n(FCH)} can do all three. Enter the number of people with exactly two of the three skills, then the number with none of them.`,
  answer: [two, none],
  hints: ['Start at the centre, the people with all three skills. Each “exactly two” region is a pair total minus the centre.', 'To find the people with none, you also need the three “only” regions: each is a set total minus the regions inside that circle that you already know.'],
  solution: `Centre: ${n(FCH)}. Exactly two: D and L only ${n(pFC)} − ${n(FCH)} = ${n(FC)}, D and K only ${n(pFH)} − ${n(FCH)} = ${n(FH)}, L and K only ${n(pCH)} − ${n(FCH)} = ${n(CH)}, which makes ${n(FC)} + ${n(FH)} + ${n(CH)} = ${n(two)} people with exactly two skills. Only D: ${n(tF)} − ${n(FC)} − ${n(FH)} − ${n(FCH)} = ${n(oF)}; only L: ${n(tC)} − ${n(FC)} − ${n(CH)} − ${n(FCH)} = ${n(oC)}; only K: ${n(tH)} − ${n(FH)} − ${n(CH)} − ${n(FCH)} = ${n(oH)}. The seven regions hold ${n(seven)} people, so ${n(N)} − ${n(seven)} = ${n(none)} have no skill.`,
  guidance: [
   { prompt: `The centre holds the ${n(FCH)} people with all three skills. How many have D and L but not K, D and K but not L, and L and K but not D?`, answer: [FC, FH, CH], explanation: `Each pair total includes the centre: ${n(pFC)} − ${n(FCH)} = ${n(FC)}, ${n(pFH)} − ${n(FCH)} = ${n(FH)} and ${n(pCH)} − ${n(FCH)} = ${n(CH)}.` },
   { prompt: 'How many people have only D, only L and only K?', answer: [oF, oC, oH], explanation: `${n(tF)} − (${n(FC)} + ${n(FH)} + ${n(FCH)}) = ${n(oF)}, ${n(tC)} − (${n(FC)} + ${n(CH)} + ${n(FCH)}) = ${n(oC)} and ${n(tH)} − (${n(FH)} + ${n(CH)} + ${n(FCH)}) = ${n(oH)}.` },
   { prompt: `Add the three “exactly two” regions. Then take all seven regions away from the ${n(N)} people. How many have exactly two skills, and how many have none?`, answer: [two, none], explanation: `${n(FC)} + ${n(FH)} + ${n(CH)} = ${n(two)}. The seven regions add up to ${n(seven)}, and ${n(N)} − ${n(seven)} = ${n(none)}.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'The mixed-handling manifest',
 brief: 'A manifest lists how crates are handled in the three bays, and Mira wants the loads that need a single bay and those that need two or more.',
 labels: ['exactly one bay', 'no bay', 'two or more bays'], tolerance: 0.01,
 gl: [['only F', 'only C', 'only H'], ['exactly one bay', 'two or more bays'], ['no bay']]
}, {
 canonical: { oF: 15, oC: 11, oH: 13, FC: 6, FH: 4, CH: 5, FCH: 3, none: 9 },
 draw: R => ({ oF: R.int(4, 25), oC: R.int(4, 25), oH: R.int(4, 25), FC: R.int(2, 12), FH: R.int(2, 12), CH: R.int(2, 12), FCH: R.int(2, 8), none: R.int(3, 25) }),
 build: ({ oF, oC, oH, FC, FH, CH, FCH, none }) => {
  const tF = oF + FC + FH + FCH, tC = oC + FC + CH + FCH, tH = oH + FH + CH + FCH, one = oF + oC + oH, multi = FC + FH + CH + FCH, seven = one + multi, N = seven + none; return {
  prompt: `A manifest of ${n(N)} crates records which bays handled them: ${n(tF)} went through the fragile bay (set F), ${n(tC)} through the cold bay (set C) and ${n(tH)} through the heavy bay (set H). It also records that ${n(FC)} went through F and C only, ${n(FH)} through F and H only, ${n(CH)} through C and H only, and ${n(FCH)} through all three. Enter the number of crates that went through exactly one bay, then the number that went through none, then the number that went through two or more.`,
  answer: [one, none, multi],
  hints: ['Each “only” region is a bay total minus the other regions inside that circle: the two “exactly two” regions that touch it and the centre.', 'Crates in two or more sets are the three “exactly two” regions plus the centre. Crates in none are what is left of the whole manifest after all seven regions.'],
  solution: `Only F: ${n(tF)} − ${n(FC)} − ${n(FH)} − ${n(FCH)} = ${n(oF)}; only C: ${n(tC)} − ${n(FC)} − ${n(CH)} − ${n(FCH)} = ${n(oC)}; only H: ${n(tH)} − ${n(FH)} − ${n(CH)} − ${n(FCH)} = ${n(oH)}. Exactly one bay: ${n(oF)} + ${n(oC)} + ${n(oH)} = ${n(one)}. Two or more: ${n(FC)} + ${n(FH)} + ${n(CH)} + ${n(FCH)} = ${n(multi)}. The seven regions hold ${n(seven)} crates, so ${n(N)} − ${n(seven)} = ${n(none)} went through none.`,
  guidance: [
   { prompt: 'How many crates went through only F, only C and only H?', answer: [oF, oC, oH], explanation: `${n(tF)} − (${n(FC)} + ${n(FH)} + ${n(FCH)}) = ${n(oF)}, ${n(tC)} − (${n(FC)} + ${n(CH)} + ${n(FCH)}) = ${n(oC)} and ${n(tH)} − (${n(FH)} + ${n(CH)} + ${n(FCH)}) = ${n(oH)}.` },
   { prompt: 'Add the three “only” regions for exactly one bay. Add the three “exactly two” regions and the centre for two or more. Enter both.', answer: [one, multi], explanation: `${n(oF)} + ${n(oC)} + ${n(oH)} = ${n(one)}, and ${n(FC)} + ${n(FH)} + ${n(CH)} + ${n(FCH)} = ${n(multi)}.` },
   { prompt: `The seven regions hold ${n(seven)} crates. How many of the ${n(N)} crates went through none of the bays?`, answer: [none], explanation: `${n(N)} − ${n(seven)} = ${n(none)}.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'The warehouse tally',
 brief: 'A big warehouse tally comes with the totals only, and Mira wants the single-label crates, the unlabelled ones and the fragile crates that are not heavy.',
 labels: ['exactly one set', 'none', '|F \\ H|'], tolerance: 0.01,
 gl: [['F and C only', 'F and H only', 'C and H only'], ['exactly one set', 'none'], ['|F \\ H|']]
}, {
 canonical: { oF: 46, oC: 38, oH: 52, FC: 17, FH: 23, CH: 14, FCH: 9, none: 31 },
 draw: R => ({ oF: R.int(20, 70), oC: R.int(20, 70), oH: R.int(20, 70), FC: R.int(6, 30), FH: R.int(6, 30), CH: R.int(6, 30), FCH: R.int(4, 16), none: R.int(10, 60) }),
 build: ({ oF, oC, oH, FC, FH, CH, FCH, none }) => {
  const tF = oF + FC + FH + FCH, tC = oC + FC + CH + FCH, tH = oH + FH + CH + FCH, pFC = FC + FCH, pFH = FH + FCH, pCH = CH + FCH,
   one = oF + oC + oH, seven = one + FC + FH + CH + FCH, N = seven + none, fm = oF + FC; return {
  prompt: `A warehouse tally of ${n(N)} crates records ${n(tF)} fragile (set F), ${n(tC)} cold-stored (set C) and ${n(tH)} heavy (set H). Of these, ${n(pFC)} are fragile and cold, ${n(pFH)} are fragile and heavy, ${n(pCH)} are cold and heavy, and ${n(FCH)} are all three. Enter the number of crates in exactly one of the three sets, then the number in none of them, then |F \\ H|, the number of fragile crates that are not heavy.`,
  answer: [one, none, fm],
  hints: ['Fill the Venn diagram from the centre outwards: each “exactly two” region is a pair total minus the centre, and each “only” region is a set total minus the regions inside its circle.', '|F \\ H| is what is left of circle F once the crates that are also heavy are taken out, and you can get it without the “only” regions.'],
  solution: `Exactly two: F and C only ${n(pFC)} − ${n(FCH)} = ${n(FC)}, F and H only ${n(pFH)} − ${n(FCH)} = ${n(FH)}, C and H only ${n(pCH)} − ${n(FCH)} = ${n(CH)}. Only F: ${n(tF)} − ${n(FC)} − ${n(FH)} − ${n(FCH)} = ${n(oF)}; only C: ${n(tC)} − ${n(FC)} − ${n(CH)} − ${n(FCH)} = ${n(oC)}; only H: ${n(tH)} − ${n(FH)} − ${n(CH)} − ${n(FCH)} = ${n(oH)}. Exactly one set: ${n(oF)} + ${n(oC)} + ${n(oH)} = ${n(one)}. The seven regions hold ${n(seven)}, so ${n(N)} − ${n(seven)} = ${n(none)} are in none. Finally |F \\ H| = |F| − |F ∩ H| = ${n(tF)} − ${n(pFH)} = ${n(fm)}.`,
  guidance: [
   { prompt: `The centre holds the ${n(FCH)} crates in all three sets. How many crates are in F and C only, in F and H only, and in C and H only?`, answer: [FC, FH, CH], explanation: `${n(pFC)} − ${n(FCH)} = ${n(FC)}, ${n(pFH)} − ${n(FCH)} = ${n(FH)} and ${n(pCH)} − ${n(FCH)} = ${n(CH)}.` },
   { prompt: 'Work out the “only F”, “only C” and “only H” regions and add them. Then take all seven regions away from the whole tally. Enter the count in exactly one set, then the count in none.', answer: [one, none], explanation: `Only F ${n(oF)}, only C ${n(oC)}, only H ${n(oH)}: they add to ${n(one)}. The seven regions hold ${n(seven)}, and ${n(N)} − ${n(seven)} = ${n(none)}.` },
   { prompt: `Of the ${n(tF)} fragile crates, ${n(pFH)} are also heavy. How many fragile crates are not heavy?`, answer: [fm], explanation: `|F \\ H| = ${n(tF)} − ${n(pFH)} = ${n(fm)}.` }
  ] }; }
});

})();
