/* Discrete mathematics practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p2.js. */
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
const upto = k => Array.from({ length: k }, (_, i) => i + 1);
/* k different whole numbers from lo to hi, none of them in `avoid`. */
const distinct = (R, k, lo, hi, avoid = []) => { const out = []; while (out.length < k) { const v = R.int(lo, hi); if (!out.includes(v) && !avoid.includes(v)) out.push(v); } return out; };
const arrows = f => f.map((v, i) => `${i + 1} → ${n(v)}`).join(', ');
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* The set `set` written as a shuffled list in which one element is written twice. */
const withRepeat = (R, set) => { const l = shuffle(R, set), d = R.pick(set); l.splice(R.int(0, l.length), 0, d); return l; };
/* P(m, r): ordered choices of r different items from m. */
const perm = (m, r) => { let v = 1; for (let i = 0; i < r; i++) v *= m - i; return v; };

/* ---- q06 Cartesian products [Levin 0.3] ---- */

mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'Pairing dishes and receivers',
 brief: 'The relay hut has to match each dish antenna with a receiver, and the engineer wants to know how many setups are possible.',
 labels: ['setups', 'setups with the gap'], tolerance: 0.01,
 gl: [['|A|', '|B|'], ['|A × B|'], ['setups with the gap']]
}, {
 canonical: { A: [1, 4, 6, 9], B: [3, 5, 8, 10, 12], D: 4 },
 draw: R => { for (;;) { const A = sorted(distinct(R, R.int(3, 5), 1, 12)), B = sorted(distinct(R, R.int(3, 5), 2, 16)), D = R.int(1, 6);
  if (A.filter(a => B.includes(a + D)).length >= 2) return { A, B, D }; } },
 build: ({ A, B, D }) => { const nA = A.length, nB = B.length, prod = nA * nB, hit = A.filter(a => B.includes(a + D)), c = hit.length; return {
  prompt: `The relay hut pairs one dish antenna with one receiver. The dish gains, in decibels, are A = ${S(A)}, and the receiver gains are B = ${S(B)}; no two dishes share a gain and no two receivers do. A setup is the ordered pair (a, b) of the two gains. Enter |A × B|, the number of possible setups, then the number of setups in which the receiver gain b is exactly ${n(D)} more than the dish gain a.`,
  answer: [prod, c],
  hints: ['Every dish can be paired with every receiver, so the setups fill a grid with a row for each element of A and a column for each element of B.', `For the second answer, take each a in A in turn and check whether a + ${n(D)} is in B.`],
  solution: `A has ${n(nA)} elements and B has ${n(nB)}, so |A × B| = ${n(nA)} × ${n(nB)} = ${n(prod)}. The setups with b = a + ${n(D)} are ${and(hit.map(a => `(${n(a)}, ${n(a + D)})`))}, so there ${c === 1 ? 'is' : 'are'} ${n(c)} of them.`,
  guidance: [
   { prompt: 'How many elements do A and B have?', answer: [nA, nB], explanation: `A = ${S(A)} has ${n(nA)} elements and B = ${S(B)} has ${n(nB)}.` },
   { prompt: 'How many ordered pairs (a, b) are there in all?', answer: [prod], explanation: `${n(nA)} rows times ${n(nB)} columns: ${n(nA)} × ${n(nB)} = ${n(prod)} pairs.` },
   { prompt: `For each a in A, work out a + ${n(D)} and look for it in B. How many setups have b = a + ${n(D)}?`, answer: [c], explanation: `${A.map(a => `${n(a)} + ${n(D)} = ${n(a + D)}${B.includes(a + D) ? ' is in B' : ' is not'}`).join('; ')}. That is ${n(c)} setups.` }
  ] }; }
});

mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'Costing the rover kits',
 brief: 'The rover shed builds a kit from one battery and one solar panel, and the quartermaster needs the kit count and the budget picture.',
 labels: ['kits', 'kits within budget', 'kits over budget'], tolerance: 0.01,
 gl: [['kits'], ['kits within budget'], ['kits over budget']]
}, {
 canonical: { A: [3, 5, 8, 9], B: [2, 4, 7], T: 12 },
 draw: R => { for (;;) { const A = sorted(distinct(R, R.int(3, 5), 2, 14)), B = sorted(distinct(R, R.int(3, 4), 2, 12)), T = R.int(A[0] + B[0] + 2, A[A.length - 1] + B[B.length - 1] - 2);
  let ok = 0; for (const a of A) for (const b of B) if (a + b <= T) ok++;
  const all = A.length * B.length; if (ok >= Math.ceil(0.3 * all) && ok <= Math.floor(0.7 * all)) return { A, B, T }; } },
 build: ({ A, B, T }) => { const prod = A.length * B.length; let ok = 0; for (const a of A) for (const b of B) if (a + b <= T) ok++; const over = prod - ok; return {
  prompt: `A rover kit is one battery from shelf A and one solar panel from shelf B. The batteries cost, in credits, A = ${S(A)}; the panels cost B = ${S(B)}. No two items on a shelf cost the same. A kit is the ordered pair (battery price, panel price), and its cost is the sum of the two. Enter the number of different kits, then the number of kits that cost at most ${n(T)} credits, then the number of kits that cost more than ${n(T)} credits.`,
  answer: [prod, ok, over],
  hints: ['Every battery goes with every panel, so the number of kits is the size of A times the size of B.', `For each battery price a, count the panel prices b with a + b at most ${n(T)}. Add those counts over all of A.`],
  solution: `|A × B| = ${n(A.length)} × ${n(B.length)} = ${n(prod)} kits. Row by row, the numbers of panels within ${n(T)} credits are ${A.map(a => `${n(B.filter(b => a + b <= T).length)} with battery ${n(a)}`).join(', ')}, which add up to ${n(ok)}. The rest are over budget: ${n(prod)} − ${n(ok)} = ${n(over)}.`,
  guidance: [
   { prompt: `A has ${n(A.length)} prices and B has ${n(B.length)}. How many kits are there?`, answer: [prod], explanation: `${n(A.length)} × ${n(B.length)} = ${n(prod)}, one for each ordered pair.` },
   { prompt: `For each battery price a in A, count the panel prices b with a + b at most ${n(T)}. How many kits are within budget?`, answer: [ok], explanation: `${A.map((a, i) => `${i ? 'battery' : 'Battery'} ${n(a)}: ${n(B.filter(b => a + b <= T).length)}`).join('; ')}. The total is ${n(ok)}.` },
   { prompt: `Every kit is either within budget or over it. How many are over?`, answer: [over], explanation: `${n(prod)} − ${n(ok)} = ${n(over)}.` }
  ] }; }
});

mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q03', title: 'Mismatched stock logs',
 brief: 'Two stock logs overlap and repeat themselves, and the clerk wants to know how many pairings use two different crate types.',
 labels: ['pairings', 'pairings with different masses'], tolerance: 0.01,
 gl: [['|A|', '|B|'], ['|A × B|'], ['|A ∩ B|'], ['pairings with different masses']]
}, {
 canonical: { LA: [4, 7, 2, 7, 9], LB: [7, 3, 9, 2, 3] },
 draw: R => { const nA = R.int(3, 5), nB = R.int(3, 5), c = R.int(1, Math.min(3, nA, nB)), A = distinct(R, nA, 1, 14), common = shuffle(R, A).slice(0, c),
   B = common.concat(distinct(R, nB - c, 1, 14, A)); return { LA: withRepeat(R, A), LB: withRepeat(R, B) }; },
 build: ({ LA, LB }) => { const A = sorted([...new Set(LA)]), B = sorted([...new Set(LB)]), common = A.filter(a => B.includes(a)), c = common.length, prod = A.length * B.length, diff = prod - c; return {
  prompt: `Two stock logs list the masses, in kilograms, of the crate types on shelves A and B. A mass written twice in a log is still one crate type, so each log is a set. Log A reads ${S(LA)} and log B reads ${S(LB)}. A pairing is an ordered pair (a, b): one crate type from each shelf. Enter |A × B|, the number of pairings, then the number of pairings in which the two masses are different.`,
  answer: [prod, diff],
  hints: ['Count each log as a set first: a mass written twice counts once. Then the pairings fill a grid with a row for each element of A and a column for each element of B.', 'A pairing (a, b) has equal masses only when a = b, so that mass must be in both sets, and each shared mass gives exactly one such pairing. Count the elements A and B share, and take those pairings away.'],
  solution: `Without repeats, A = ${S(A)} has ${n(A.length)} elements and B = ${S(B)} has ${n(B.length)}, so |A × B| = ${n(A.length)} × ${n(B.length)} = ${n(prod)}. The masses on both shelves are ${S(common)}, so ${n(c)} pairings have a = b. The others have different masses: ${n(prod)} − ${n(c)} = ${n(diff)}.`,
  guidance: [
   { prompt: 'Cross out the repeats. How many crate types are in A, and how many in B?', answer: [A.length, B.length], explanation: `A = ${S(A)} has ${n(A.length)} elements and B = ${S(B)} has ${n(B.length)}.` },
   { prompt: 'How many ordered pairs (a, b) are there in all?', answer: [prod], explanation: `${n(A.length)} × ${n(B.length)} = ${n(prod)}.` },
   { prompt: 'A pairing with a = b needs a mass that is on both shelves. How many masses are in both A and B?', answer: [c], explanation: `The masses in both are ${S(common)}: ${n(c)} of them, so ${n(c)} pairings have equal masses.` },
   { prompt: 'Take the pairings with equal masses away from all the pairings. How many are left?', answer: [diff], explanation: `${n(prod)} − ${n(c)} = ${n(diff)}.` }
  ] }; }
});

/* ---- q07 Functions between finite sets: domain, codomain, image [Levin 0.4] ---- */

mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'Routing the sluice gates',
 brief: 'The water plant sends each sluice gate to one pump, and the engineer wants to know which pumps are ever used.',
 labels: ['f of the chosen gate', 'size of the range', 'pumps with no gate'], tolerance: 0.01,
 gl: [['size of the domain', 'size of the codomain'], ['f of the chosen gate'], ['size of the range'], ['pumps with no gate']]
}, {
 canonical: { m: 7, k: 6, f: [2, 5, 2, 3, 5, 2, 3], a: 4 },
 draw: R => { for (;;) { const m = R.int(5, 8), k = R.int(4, 7), f = upto(m).map(() => R.int(1, k)), r = new Set(f).size;
  if (r >= 2 && r < k) return { m, k, f, a: R.int(1, m) }; } },
 build: ({ m, k, f, a }) => { const range = sorted([...new Set(f)]), r = range.length, fa = f[a - 1], miss = k - r; return {
  prompt: `The water plant has ${n(m)} sluice gates, numbered 1 to ${n(m)}, and ${n(k)} pumps, numbered 1 to ${n(k)}. Each gate feeds exactly one pump, and this routing is a function f from the gates to the pumps: ${arrows(f)}. Enter f(${n(a)}), the pump that gate ${n(a)} feeds. Then enter the size of the range of f, and then the number of pumps that no gate feeds.`,
  answer: [fa, r, miss],
  hints: [`f(${n(a)}) is the pump at the end of the arrow that starts at gate ${n(a)}.`, 'The range is the set of pumps that are at the end of some arrow. List the pump at the end of every arrow and cross out repeats; the pumps that are left over are the ones no gate feeds.'],
  solution: `The arrow from gate ${n(a)} ends at pump ${n(fa)}, so f(${n(a)}) = ${n(fa)}. The arrows end at ${f.map(n).join(', ')}, so the range is ${S(range)}, with ${n(r)} elements. The codomain has ${n(k)} pumps, so ${n(k)} − ${n(r)} = ${n(miss)} pump${miss === 1 ? '' : 's'} get${miss === 1 ? 's' : ''} no gate.`,
  guidance: [
   { prompt: 'How many elements does the domain (the gates) have, and how many does the codomain (the pumps) have?', answer: [m, k], explanation: `There are ${n(m)} gates and ${n(k)} pumps.` },
   { prompt: `Follow the arrow that starts at gate ${n(a)}. Which pump does it end at?`, answer: [fa], explanation: `${n(a)} → ${n(fa)}, so f(${n(a)}) = ${n(fa)}.` },
   { prompt: `List the pumps at the ends of all ${n(m)} arrows and cross out repeats. How many different pumps are left?`, answer: [r], explanation: `The ends are ${f.map(n).join(', ')}. Without repeats that is ${S(range)}: ${n(r)} pumps.` },
   { prompt: `The codomain has ${n(k)} pumps and ${n(r)} of them are in the range. How many pumps are not?`, answer: [miss], explanation: `${n(k)} − ${n(r)} = ${n(miss)}.` }
  ] }; }
});

mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The capped freight charge',
 brief: 'The freight lift charges by the crate but never more than a fixed fee, and the accounts clerk needs to know how many different charges can appear.',
 labels: ['charge for the chosen load', 'different charges'], tolerance: 0.01,
 gl: [['charge for the chosen load'], ['loads charged below the cap'], ['different charges']]
}, {
 canonical: { p: 4, q: 3, C: 22, m: 8, a: 6 },
 draw: R => { const p = R.int(2, 6), q = R.int(1, 9), m = R.int(7, 10), x0 = R.int(3, m - 2); return { p, q, m, a: R.int(1, m), C: p * x0 + q - R.int(0, p - 1) }; },
 build: ({ p, q, C, m, a }) => { const f = x => Math.min(p * x + q, C), vals = new Set(upto(m).map(f)), r = vals.size, below = upto(m).filter(x => p * x + q < C).length, fa = f(a); return {
  prompt: `The freight lift charges ${n(p)} credits for every crate it lifts, plus a fixed ${n(q)} credits, but never more than ${n(C)} credits in all. So for x crates, with x from 1 to ${n(m)}, the charge is f(x) = ${n(p)} × x + ${n(q)}, unless that is more than ${n(C)}, in which case it is ${n(C)}. Enter f(${n(a)}). Then enter the size of the range of f: the number of different charges for x = 1, 2, …, ${n(m)}.`,
  answer: [fa, r],
  hints: [`For f(${n(a)}), work out ${n(p)} × ${n(a)} + ${n(q)} first, then compare it with the cap of ${n(C)}.`, 'Loads below the cap each give their own charge, because the charge grows with every extra crate. All the loads at or above the cap give one single charge.'],
  solution: `For ${n(a)} crates, ${n(p)} × ${n(a)} + ${n(q)} = ${n(p * a + q)}${p * a + q > C ? `, which is more than ${n(C)}, so f(${n(a)}) = ${n(C)}` : `, which is not more than ${n(C)}, so f(${n(a)}) = ${n(fa)}`}. The loads x = 1 to ${n(below)} have ${n(p)} × x + ${n(q)} below ${n(C)} and give ${n(below)} different charges. Every load from ${n(below + 1)} to ${n(m)} gives ${n(C)}, one more charge. So the range has ${n(below)} + 1 = ${n(r)} elements.`,
  guidance: [
   { prompt: `Work out ${n(p)} × ${n(a)} + ${n(q)} and compare it with the cap of ${n(C)}. What is f(${n(a)})?`, answer: [fa], explanation: `${n(p)} × ${n(a)} + ${n(q)} = ${n(p * a + q)}. ${p * a + q > C ? `That is more than ${n(C)}, so the charge is capped at ${n(C)}.` : `That is within the cap, so the charge is ${n(fa)}.`}` },
   { prompt: `For how many loads x from 1 to ${n(m)} is ${n(p)} × x + ${n(q)} below ${n(C)}?`, answer: [below], explanation: `The charge reaches ${n(C)} or more at x = ${n(below + 1)}, so the loads x = 1 to ${n(below)} are below the cap: ${n(below)} loads, each with its own charge.` },
   { prompt: `Those loads give ${n(below)} different charges, and every other load gives the cap. How many different charges are there?`, answer: [r], explanation: `${n(below)} + 1 = ${n(r)}.` }
  ] }; }
});

mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q06', title: 'Weighing the pairs',
 brief: 'The weighing platform turns every pair of boxes into one total mass, and the clerk needs to know how many different totals it can report.',
 labels: ['inputs', 'different totals', 'most pairs sharing a total'], tolerance: 0.01,
 gl: [['inputs'], ['different totals'], ['most pairs sharing a total']]
}, {
 canonical: { A: [1, 3, 4], B: [2, 3, 5] },
 draw: R => { for (;;) { const A = sorted(distinct(R, R.int(3, 4), 1, 9)), B = sorted(distinct(R, R.int(3, 4), 1, 9)), c = {};
  for (const a of A) for (const b of B) c[a + b] = (c[a + b] || 0) + 1;
  const top = Math.max(...Object.values(c)); if (top >= 2 && top <= 4 && Object.keys(c).length >= 4) return { A, B }; } },
 build: ({ A, B }) => { const c = {}; for (const a of A) for (const b of B) c[a + b] = (c[a + b] || 0) + 1;
  const dom = A.length * B.length, totals = sorted(Object.keys(c).map(Number)), r = totals.length, top = Math.max(...Object.values(c)), topT = totals.filter(t => c[t] === top); return {
  prompt: `The weighing platform takes one box from set A and one from set B, with masses in kilograms A = ${S(A)} and B = ${S(B)}, and reports their total mass. So f sends each ordered pair (a, b) in A × B to the total f(a, b) = a + b. Enter the number of inputs of f. Then enter the size of the range of f (how many different totals can appear), and then the largest number of pairs that give one and the same total.`,
  answer: [dom, r, top],
  hints: ['The inputs of f are the elements of its domain, and the domain is the set of all pairs in A × B.', 'Write the sum for every pair, row by row, then list the different totals. The largest number of pairs sharing a total is the highest tally among them.'],
  solution: `The domain is A × B, with ${n(A.length)} × ${n(B.length)} = ${n(dom)} pairs. The totals, row by row, are ${A.map(a => B.map(b => n(a + b)).join(', ')).join('; ')}. The different totals are ${S(totals)}, so the range has ${n(r)} elements. The total${topT.length > 1 ? 's' : ''} ${and(topT.map(n))} ${topT.length > 1 ? 'each come' : 'comes'} from ${n(top)} pairs, the most.`,
  guidance: [
   { prompt: `How many pairs (a, b) are there in A × B?`, answer: [dom], explanation: `${n(A.length)} × ${n(B.length)} = ${n(dom)}.` },
   { prompt: 'Write the total a + b for every pair and cross out repeats. How many different totals are there?', answer: [r], explanation: `The different totals are ${S(totals)}: ${n(r)} of them.` },
   { prompt: 'Tally how often each total appears. What is the highest tally?', answer: [top], explanation: `${topT.map(t => `${n(t)} appears ${n(c[t])} times`).join('; ')}${topT.length ? '' : ''}. No total appears more often than ${n(top)} times.` }
  ] }; }
});

/* ---- q08 One-to-one and onto [Levin 0.4] ---- */

/* Draws a table f: {1..m} → {1..k} of kind 0 (one-to-one, not onto), 1 (a bijection), 2 (onto, not one-to-one) or 3 (neither). */
const tableOfKind = (R, kind) => {
 if (kind === 0) { const m = R.int(4, 6), k = R.int(m + 1, 8); return { m, k, f: distinct(R, m, 1, k) }; }
 if (kind === 1) { const m = R.int(4, 6); return { m, k: m, f: distinct(R, m, 1, m) }; }
 if (kind === 2) { const k = R.int(3, 5), m = k + R.int(1, 3), f = shuffle(R, upto(k)); while (f.length < m) f.push(R.int(1, k)); return { m, k, f: shuffle(R, f) }; }
 for (;;) { const m = R.int(4, 6), k = R.int(4, 7), f = upto(m).map(() => R.int(1, k)); if (new Set(f).size < m && new Set(f).size < k) return { m, k, f }; }
};

mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'Allotting the bunks',
 brief: 'The dormitory warden gives every crew member a bunk, and needs to know whether the allotment shares bunks or leaves any empty.',
 labels: ['onto (1 yes, 0 no)', 'one-to-one (1 yes, 0 no)', 'bunks with nobody'], tolerance: 0.01,
 gl: [['bunks used'], ['onto (1 yes, 0 no)'], ['one-to-one (1 yes, 0 no)']]
}, {
 canonical: { m: 6, k: 4, f: [3, 1, 4, 1, 2, 3] },
 draw: R => tableOfKind(R, R.int(0, 3)),
 build: ({ m, k, f }) => { const used = sorted([...new Set(f)]), r = used.length, miss = k - r, onto = miss === 0 ? 1 : 0, inj = r === m ? 1 : 0; return {
  prompt: `The dormitory has ${n(k)} bunks, numbered 1 to ${n(k)}, and the warden gives each of ${n(m)} crew members, numbered 1 to ${n(m)}, one bunk. The allotment f sends each crew member to a bunk: ${arrows(f)}. Enter 1 if f is onto, that is, every bunk is given to someone, or 0 if not. Then enter 1 if f is one-to-one, that is, no bunk is given twice, or 0 if not. Then enter the number of bunks that nobody gets.`,
  answer: [onto, inj, miss],
  hints: ['List the bunk at the end of every arrow. Compare the list with the numbers 1 to the last bunk: a bunk missing from the list is a bunk nobody gets.', 'A bunk that appears twice in the list is shared, and then f is not one-to-one.'],
  solution: `The bunks given out are ${f.map(n).join(', ')}, so the bunks used are ${S(used)}: ${n(r)} of the ${n(k)}. ${miss ? `Bunk${miss > 1 ? 's' : ''} ${and(upto(k).filter(v => !used.includes(v)).map(n))} ${miss > 1 ? 'are' : 'is'} never given, so f is not onto: enter 0, and ${n(miss)} bunk${miss > 1 ? 's are' : ' is'} left empty.` : 'Every bunk is used, so f is onto: enter 1, and no bunk is left empty: 0.'} ${inj ? 'No bunk appears twice, so f is one-to-one: enter 1.' : `Bunk ${n(f.find((v, i) => f.indexOf(v) !== i))} appears more than once, so f is not one-to-one: enter 0.`}`,
  guidance: [
   { prompt: 'List the bunk at the end of each arrow and cross out repeats. How many different bunks are used?', answer: [r], explanation: `The ends are ${f.map(n).join(', ')}. Without repeats that is ${S(used)}: ${n(r)} bunks.` },
   { prompt: `There are ${n(k)} bunks. Enter 1 if all of them are used, or 0 if some are not.`, answer: [onto], explanation: `${n(r)} of ${n(k)} are used, so ${onto ? 'f is onto' : `${n(miss)} are left empty and f is not onto`}.` },
   { prompt: `There are ${n(m)} crew members. Enter 1 if they all get different bunks, or 0 if two share one.`, answer: [inj], explanation: inj ? `The ${n(m)} bunks ${f.map(n).join(', ')} are all different, so f is one-to-one.` : `Only ${n(r)} different bunks are used by ${n(m)} crew members, so some bunk is shared and f is not one-to-one.` }
  ] }; }
});

mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The sorting belt tally',
 brief: 'The sorting belt dropped every crate down a chute, and the foreman only has the tally for each chute.',
 labels: ['chutes with no crate', 'onto (1 yes, 0 no)', 'crates sharing a chute'], tolerance: 0.01,
 gl: [['chutes with no crate'], ['onto (1 yes, 0 no)'], ['crates sharing a chute']]
}, {
 canonical: { cnt: [2, 0, 1, 3, 0] },
 draw: R => { for (;;) { const k = R.int(4, 7), cnt = upto(k).map(() => R.int(0, 3)), m = cnt.reduce((s, v) => s + v, 0); if (m >= 6 && cnt.some(v => v >= 2)) return { cnt }; } },
 build: ({ cnt }) => { const k = cnt.length, m = cnt.reduce((s, v) => s + v, 0), used = cnt.filter(v => v > 0).length, unused = k - used, onto = unused === 0 ? 1 : 0, extra = m - used; return {
  prompt: `The sorting belt sends each of ${n(m)} crates down exactly one of ${n(k)} chutes, so the belt is a function from the crates to the chutes. The shift tally, from chute 1 to chute ${n(k)}, reads: ${cnt.map((v, i) => `chute ${i + 1}, ${n(v)}`).join('; ')}. Enter the number of chutes that got no crate. Then enter 1 if the belt is onto (every chute got a crate) or 0 if not. Then enter the number of crates that went down a chute that already had an earlier crate.`,
  answer: [unused, onto, extra],
  hints: ['A chute with a tally of 0 is an element of the codomain that no input reaches. Count the zeros.', 'In each chute that got any crates, the first crate does not share. Every crate after the first does, so count the crates and take away one for each chute that was used.'],
  solution: `The chutes with a tally of 0 number ${n(unused)}, so ${n(unused)} chute${unused === 1 ? '' : 's'} got no crate. ${onto ? 'Every chute got a crate, so the belt is onto: enter 1.' : 'Some chute got none, so the belt is not onto: enter 0.'} ${n(used)} chute${used === 1 ? ' was' : 's were'} used, and each used chute has one crate that does not share, so ${n(m)} − ${n(used)} = ${n(extra)} crates went down a chute that already had one.`,
  guidance: [
   { prompt: 'How many chutes have a tally of 0?', answer: [unused], explanation: `${n(unused)} of the ${n(k)} tallies are 0.` },
   { prompt: `Enter 1 if no chute has a tally of 0, or 0 if some chute does.`, answer: [onto], explanation: onto ? 'Every chute got a crate, so the belt is onto.' : `${n(unused)} chute${unused === 1 ? ' has' : 's have'} no crate, so the belt is not onto.` },
   { prompt: `${n(used)} chutes were used and ${n(m)} crates were sent. Each used chute has one crate that shares with nobody before it. How many crates share a chute with an earlier one?`, answer: [extra], explanation: `${n(m)} − ${n(used)} = ${n(extra)}.` }
  ] }; }
});

mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q07', title: 'The squaring checksum',
 brief: 'The checksum bay files a number into a slot by its square, and the clerk wants to know whether two inputs can ever land in one slot.',
 labels: ['one-to-one (1 yes, 0 no)', 'size of the range', 'slots no input reaches'], tolerance: 0.01,
 gl: [['size of the domain'], ['size of the range'], ['one-to-one (1 yes, 0 no)'], ['slots no input reaches']]
}, {
 canonical: { p: 2, q: 4 },
 draw: R => { if (R.int(0, 3) === 0) { const o = R.int(3, 6); return R.bool() ? { p: 0, q: o } : { p: o, q: 0 }; } return { p: R.int(1, 5), q: R.int(1, 5) }; },
 build: ({ p, q }) => { const M = Math.max(p, q), M2 = M * M, dom = p + q + 1, vals = new Set(); for (let x = -p; x <= q; x++) vals.add(x * x);
  const r = vals.size, inj = r === dom ? 1 : 0, miss = M2 + 1 - r, lo = p ? `−${n(p)}` : '0', hi = q ? n(q) : '0'; return {
  prompt: `The checksum bay files each number x in the set ${S(upto(dom).map(i => i - 1 - p))} into a slot numbered by its square: f(x) = x × x.${p ? ` The negative numbers in it count as inputs too.` : ""} The slots are numbered 0 to ${n(M2)}, so f goes from that set to the slots 0 to ${n(M2)}. Enter 1 if f is one-to-one, or 0 if not. Then enter the size of the range of f, and then the number of slots that no input reaches.`,
  answer: [inj, r, miss],
  hints: ['Write f(x) for every x from the first to the last. Two inputs with the same square fill one slot twice.', `The slots are the codomain: there are ${n(M2)} + 1 of them, because the numbering starts at 0. The slots that are not the square of any input are the ones no input reaches.`],
  solution: `There are ${n(dom)} inputs, and the squares are ${upto(dom).map(i => n((i - 1 - p) ** 2)).join(', ')}. The different squares are ${S(sorted([...vals]))}, so the range has ${n(r)} elements. ${inj ? 'All the squares are different, so f is one-to-one: enter 1.' : 'Some square appears twice (x and −x give the same square), so f is not one-to-one: enter 0.'} The codomain has ${n(M2)} + 1 = ${n(M2 + 1)} slots, so ${n(M2 + 1)} − ${n(r)} = ${n(miss)} slots are never reached.`,
  guidance: [
   { prompt: `How many numbers are there in the set, from ${lo} to ${hi} in steps of 1?`, answer: [dom], explanation: `${and([...(p ? [`${n(p)} negative number${p === 1 ? '' : 's'}`] : []), '0', ...(q ? [`${n(q)} positive number${q === 1 ? '' : 's'}`] : [])])}: ${n(dom)} inputs.` },
   { prompt: 'Square every input and cross out repeats. How many different squares are there?', answer: [r], explanation: `The different squares are ${S(sorted([...vals]))}: ${n(r)} of them.` },
   { prompt: `There are ${n(dom)} inputs and ${n(r)} different outputs. Enter 1 if f is one-to-one, or 0 if not.`, answer: [inj], explanation: inj ? 'Every input has its own output, so f is one-to-one.' : 'Fewer outputs than inputs means some output is shared, so f is not one-to-one.' },
   { prompt: `The slots are numbered 0 to ${n(M2)}, so there are ${n(M2 + 1)} slots. How many are not in the range?`, answer: [miss], explanation: `${n(M2 + 1)} − ${n(r)} = ${n(miss)}.` }
  ] }; }
});

/* ---- q09 The additive principle [Levin 1.1] ---- */

mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'Racks in the tool crib',
 brief: 'The tool crib is stocked on four racks, and the stores clerk wants to know how many choices a fitter has and how many tools carry neither standard.',
 labels: ['ways to take a tool', 'metric or imperial', 'neither'], tolerance: 0.01,
 gl: [['ways to take a tool'], ['metric or imperial'], ['neither']]
}, {
 canonical: { a: 8, b: 11, c: 6, d: 9, N: 40, p: 17, q: 15, r: 6 },
 draw: R => { const r = R.int(2, 8), p = r + R.int(4, 14), q = r + R.int(4, 14); return { a: R.int(4, 14), b: R.int(4, 14), c: R.int(4, 14), d: R.int(4, 14), N: p + q - r + R.int(3, 12), p, q, r }; },
 build: ({ a, b, c, d, N, p, q, r }) => { const s = a + b + c + d, u = p + q - r, none = N - u; return {
  prompt: `The tool crib has four racks: ${n(a)} different spanners, ${n(b)} different drivers, ${n(c)} different clamps and ${n(d)} different gauges, and no tool is on two racks. Enter the number of ways to take one tool from the racks. Then, in the crib's whole catalogue of ${n(N)} tools, ${n(p)} are marked metric, ${n(q)} are marked imperial, and ${n(r)} are marked both. Enter the number of tools marked metric or imperial (or both), then the number marked neither.`,
  answer: [s, u, none],
  hints: ['No tool is on two racks, so the four racks have nothing in common: the numbers of choices add.', 'Metric plus imperial counts the tools marked both twice, so take that number away once. The tools marked neither are everything in the catalogue that is left over.'],
  solution: `The racks share nothing, so ${n(a)} + ${n(b)} + ${n(c)} + ${n(d)} = ${n(s)} ways. The marked tools number ${n(p)} + ${n(q)} − ${n(r)} = ${n(u)}, because the ${n(r)} marked both were counted twice. The rest have neither mark: ${n(N)} − ${n(u)} = ${n(none)}.`,
  guidance: [
   { prompt: `What is ${n(a)} + ${n(b)} + ${n(c)} + ${n(d)}, the number of ways to take one tool?`, answer: [s], explanation: `${n(a)} + ${n(b)} + ${n(c)} + ${n(d)} = ${n(s)}.` },
   { prompt: `Add the ${n(p)} metric and the ${n(q)} imperial tools, then take away the ${n(r)} counted twice. How many are metric or imperial?`, answer: [u], explanation: `${n(p)} + ${n(q)} = ${n(p + q)}, and ${n(p + q)} − ${n(r)} = ${n(u)}.` },
   { prompt: `The catalogue has ${n(N)} tools and ${n(u)} carry a mark. How many carry neither?`, answer: [none], explanation: `${n(N)} − ${n(u)} = ${n(none)}.` }
  ] }; }
});

mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'Who can cook, who can clean',
 brief: 'The mess duty rota needs the numbers: how many crew can do one job only, how many can do at least one, and how many crew there are.',
 labels: ['crew with exactly one skill', 'crew with at least one skill', 'whole crew'], tolerance: 0.01,
 gl: [['crew with exactly one skill'], ['crew with at least one skill'], ['whole crew']]
}, {
 canonical: { c: 18, l: 15, b: 6, z: 3 },
 draw: R => { const b = R.int(2, 8); return { c: b + R.int(4, 14), l: b + R.int(4, 14), b, z: R.int(1, 7) }; },
 build: ({ c, l, b, z }) => { const one = (c - b) + (l - b), u = one + b, tot = u + z; return {
  prompt: `Of the crew, ${n(c)} can cook, ${n(l)} can clean, ${n(b)} can do both jobs, and ${n(z)} can do neither. Enter the number of crew who can do exactly one of the two jobs, then the number who can do at least one, then the number of crew in all.`,
  answer: [one, u, tot],
  hints: ['The crew who can cook include those who can also clean. Take those away to get the crew who can only cook, and do the same for cleaning.', 'The people who can only cook, only clean, or do both are three groups with nobody in two of them, so their sizes add.'],
  solution: `Only cooking: ${n(c)} − ${n(b)} = ${n(c - b)}. Only cleaning: ${n(l)} − ${n(b)} = ${n(l - b)}. Exactly one job: ${n(c - b)} + ${n(l - b)} = ${n(one)}. At least one job adds the ${n(b)} who do both: ${n(one)} + ${n(b)} = ${n(u)}. The whole crew adds the ${n(z)} who do neither: ${n(u)} + ${n(z)} = ${n(tot)}.`,
  guidance: [
   { prompt: `Crew who only cook is ${n(c)} − ${n(b)}, and crew who only clean is ${n(l)} − ${n(b)}. How many can do exactly one job?`, answer: [one], explanation: `${n(c - b)} only cook and ${n(l - b)} only clean, which is ${n(one)}. No one is in both groups, so the counts add.` },
   { prompt: `Add the ${n(b)} who do both jobs. How many can do at least one job?`, answer: [u], explanation: `${n(one)} + ${n(b)} = ${n(u)}.` },
   { prompt: `Add the ${n(z)} who do neither. How many crew are there in all?`, answer: [tot], explanation: `${n(u)} + ${n(z)} = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q04', title: 'Two stores, one catalogue',
 brief: 'Two parts stores hold rated parts with overlapping ratings, and the catalogue clerk needs the choices and the unrated leftovers.',
 labels: ['ways to choose a rated part', 'parts with no rating'], tolerance: 0.01,
 gl: [['rated parts in store A', 'rated parts in store B'], ['ways to choose a rated part'], ['parts with no rating']]
}, {
 canonical: { c1: 11, h1: 9, b1: 4, c2: 8, h2: 14, b2: 5, N: 40 },
 draw: R => { const b1 = R.int(2, 7), b2 = R.int(2, 7), c1 = b1 + R.int(3, 12), h1 = b1 + R.int(3, 12), c2 = b2 + R.int(3, 12), h2 = b2 + R.int(3, 12);
  return { c1, h1, b1, c2, h2, b2, N: c1 + h1 - b1 + c2 + h2 - b2 + R.int(3, 15) }; },
 build: ({ c1, h1, b1, c2, h2, b2, N }) => { const u1 = c1 + h1 - b1, u2 = c2 + h2 - b2, t = u1 + u2, none = N - t; return {
  prompt: `Two parts stores hold different parts, and no part is in both stores. Store A has ${n(c1)} parts rated for cold and ${n(h1)} rated for heat, and ${n(b1)} of them are rated for both. Store B has ${n(c2)} rated for cold and ${n(h2)} rated for heat, and ${n(b2)} of them are rated for both. A part is rated if it is rated for cold or for heat. Enter the number of ways to choose one rated part from either store. The catalogue lists ${n(N)} parts in all, and every rated part is in these two stores; enter the number of catalogue parts with no rating.`,
  answer: [t, none],
  hints: ['In each store the cold-rated and heat-rated parts overlap, so count the rated parts of one store as cold plus heat minus both.', 'The two stores share no part, so their counts of rated parts add. The unrated parts are the catalogue parts that are not in that total.'],
  solution: `Store A has ${n(c1)} + ${n(h1)} − ${n(b1)} = ${n(u1)} rated parts and store B has ${n(c2)} + ${n(h2)} − ${n(b2)} = ${n(u2)}. The stores share no part, so there are ${n(u1)} + ${n(u2)} = ${n(t)} ways to choose a rated part. The catalogue's other parts have no rating: ${n(N)} − ${n(t)} = ${n(none)}.`,
  guidance: [
   { prompt: `How many rated parts are in store A (${n(c1)} + ${n(h1)} − ${n(b1)}), and how many in store B (${n(c2)} + ${n(h2)} − ${n(b2)})?`, answer: [u1, u2], explanation: `Store A: ${n(c1)} + ${n(h1)} − ${n(b1)} = ${n(u1)}. Store B: ${n(c2)} + ${n(h2)} − ${n(b2)} = ${n(u2)}.` },
   { prompt: 'The stores share no part. How many ways are there to choose one rated part from either?', answer: [t], explanation: `${n(u1)} + ${n(u2)} = ${n(t)}.` },
   { prompt: `The catalogue has ${n(N)} parts and ${n(t)} are rated. How many have no rating?`, answer: [none], explanation: `${n(N)} − ${n(t)} = ${n(none)}.` }
  ] }; }
});

/* ---- q10 The multiplicative principle [Levin 1.1] ---- */

/* q10b: the rule for the digit of a tag. */
const DIGIT_RULES = [
 { text: 'even', x: 5, why: 'The digit is 0, 2, 4, 6 or 8: 5 choices' },
 { text: 'odd', x: 5, why: 'The digit is 1, 3, 5, 7 or 9: 5 choices' },
 { text: 'not 0', x: 9, why: 'The digit is 1 to 9: 9 choices' },
 { text: 'more than 6', x: 3, why: 'The digit is 7, 8 or 9: 3 choices' },
 { text: 'at most 3', x: 4, why: 'The digit is 0, 1, 2 or 3: 4 choices' }
];

mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'Locker tags',
 brief: 'The store rooms are issuing locker tags, and the clerk wants to know how many tags exist before and after a new rule.',
 labels: ['tags with no rule', 'tags under the new rule'], tolerance: 0.01,
 gl: [['letter choices', 'digit choices'], ['choices for the second letter', 'choices for the digit'], ['tags under the new rule']]
}, {
 canonical: { L: 6, rule: 1 },
 draw: R => ({ L: R.int(4, 12), rule: R.int(0, 4) }),
 build: ({ L, rule }) => { const P = DIGIT_RULES[rule], free = L * L * 10, res = L * (L - 1) * P.x; return {
  prompt: `Locker tags in the store rooms are two letters and then one digit, such as KT7. The depot uses only ${n(L)} letters. Enter how many tags there are with no other rule (type it without commas). Then the rule changes: the two letters are different, and the digit is ${P.text}. Enter how many tags follow the new rule.`,
  answer: [free, res],
  hints: ['A tag is filled in three stages: first letter, second letter, digit. Multiply the number of choices at each stage.', 'Under the new rule, the second letter cannot be the first letter. List the digits that fit the rule and count them.'],
  solution: `With no rule there are ${n(L)} × ${n(L)} × 10 = ${n(free)} tags. Under the new rule the first letter has ${n(L)} choices and the second letter can be any letter except the first: ${n(L)} − 1 = ${n(L - 1)} choices. ${P.why}. By the multiplicative principle there are ${n(L)} × ${n(L - 1)} × ${n(P.x)} = ${n(res)} tags.`,
  guidance: [
   { prompt: 'With no rule, how many choices are there for each letter, and how many for the digit?', answer: [L, 10], explanation: `${n(L)} letters for each letter place and 10 digits (0 to 9), so ${n(L)} × ${n(L)} × 10 = ${n(free)} tags.` },
   { prompt: `Under the new rule, how many choices are left for the second letter once the first is chosen, and how many digits fit the rule?`, answer: [L - 1, P.x], explanation: `The second letter can be any letter except the first: ${n(L)} − 1 = ${n(L - 1)} choices. ${P.why}.` },
   { prompt: `Multiply the three stages. What is ${n(L)} × ${n(L - 1)} × ${n(P.x)}?`, answer: [res], explanation: `${n(L)} × ${n(L - 1)} = ${n(L * (L - 1))}, and ${n(L * (L - 1))} × ${n(P.x)} = ${n(res)} tags.` }
  ] }; }
});

mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Two kinds of crate code',
 brief: 'The depot issues crate codes of two different shapes, and the ledger needs the count for each kind and for both together.',
 labels: ['type X codes', 'type Y codes', 'codes in all'], tolerance: 0.01,
 gl: [['type X codes'], ['type Y codes'], ['codes in all']]
}, {
 canonical: { L: 7 },
 draw: R => ({ L: R.int(4, 12) }),
 build: ({ L }) => { const x = L * 10 * 9, y = L * (L - 1) * 10, tot = x + y; return {
  prompt: `The depot issues two kinds of crate code. A type X code is one letter followed by two different digits, such as B47. A type Y code is two different letters followed by one digit, such as KT7. The depot uses only ${n(L)} letters. Enter the number of type X codes, then the number of type Y codes, then the number of codes of both kinds together (type each without commas).`,
  answer: [x, y, tot],
  hints: ['Build each kind in stages and multiply the choices at each stage. A digit that has already been used is not available again.', 'A type X code and a type Y code can never be the same code, because they have a different number of letters. So the two counts add.'],
  solution: `Type X: ${n(L)} letters, then 10 digits, then 10 − 1 = 9 digits, so ${n(L)} × 10 × 9 = ${n(x)}. Type Y: ${n(L)} letters, then ${n(L)} − 1 = ${n(L - 1)} letters, then 10 digits, so ${n(L)} × ${n(L - 1)} × 10 = ${n(y)}. No code is of both types, so there are ${n(x)} + ${n(y)} = ${n(tot)} codes.`,
  guidance: [
   { prompt: `Type X: ${n(L)} choices for the letter, 10 for the first digit, and one fewer for the second digit. How many type X codes are there?`, answer: [x], explanation: `${n(L)} × 10 × 9 = ${n(x)}.` },
   { prompt: `Type Y: ${n(L)} choices for the first letter, one fewer for the second letter, and 10 for the digit. How many type Y codes are there?`, answer: [y], explanation: `${n(L)} × ${n(L - 1)} × 10 = ${n(y)}.` },
   { prompt: 'A code cannot be of both types. How many codes are there in all?', answer: [tot], explanation: `${n(x)} + ${n(y)} = ${n(tot)}, by the additive principle.` }
  ] }; }
});

mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'The vault keypad',
 brief: 'The vault keypad takes a code of different keys, and the guard wants to know how many codes touch a given key at either end.',
 labels: ['codes starting with the first key', 'codes with both', 'codes with either'], tolerance: 0.01,
 gl: [['codes starting with the first key'], ['codes with both'], ['codes with either']]
}, {
 canonical: { D: 10, L: 4, s: 7, e: 2 },
 draw: R => { const D = R.int(7, 12), s = R.int(1, D); return { D, L: R.int(3, 4), s, e: R.except(1, D, [s]) }; },
 build: ({ D, L, s, e }) => { const st = perm(D - 1, L - 1), both = perm(D - 2, L - 2), u = 2 * st - both, mid = L - 2; return {
  prompt: `The vault keypad has ${n(D)} keys, numbered 1 to ${n(D)}. A code is ${n(L)} key presses, and no key may be pressed twice in one code. Enter the number of codes that start with key ${n(s)} (type it without commas). Then enter the number of codes that start with key ${n(s)} and end with key ${n(e)}. Then enter the number of codes that start with key ${n(s)} or end with key ${n(e)} (or both).`,
  answer: [st, both, u],
  hints: ['After the first key is fixed, fill the remaining places one at a time. Each place has one fewer key available than the place before.', `Codes that end with key ${n(e)} are as many as the codes that start with key ${n(s)}, by the same argument. For “or”, add the two counts and take away the codes counted twice, the ones that do both.`],
  solution: `Fix the first key as ${n(s)}. The next place has ${n(D - 1)} choices, then ${n(D - 2)}${L === 4 ? `, then ${n(D - 3)}` : ''}, so ${upto(L - 1).map(i => n(D - i)).join(' × ')} = ${n(st)} codes start with key ${n(s)}. Fixing both ends leaves ${mid > 1 ? `${n(mid)} middle places: ${upto(mid).map(i => n(D - 1 - i)).join(' × ')} = ${n(both)}` : `1 middle place, with ${n(D - 2)} choices: ${n(both)} codes`}. By the same argument ${n(st)} codes end with key ${n(e)}, so the number that start with key ${n(s)} or end with key ${n(e)} is ${n(st)} + ${n(st)} − ${n(both)} = ${n(u)}.`,
  guidance: [
   { prompt: `With the first key fixed as ${n(s)}, there are ${n(L - 1)} places left, with ${n(D - 1)} keys for the first of them and one fewer for each next place. How many codes start with key ${n(s)}?`, answer: [st], explanation: `${upto(L - 1).map(i => n(D - i)).join(' × ')} = ${n(st)}.` },
   { prompt: `Now fix both ends, key ${n(s)} first and key ${n(e)} last. That leaves ${mid > 1 ? `${n(mid)} middle places, with ${n(D - 2)} keys for the first of them` : `1 middle place, with ${n(D - 2)} keys for it`}. How many codes start with key ${n(s)} and end with key ${n(e)}?`, answer: [both], explanation: mid > 1 ? `${upto(mid).map(i => n(D - 1 - i)).join(' × ')} = ${n(both)}.` : `Each of the ${n(D - 2)} keys left can fill the middle place: ${n(both)} codes.` },
   { prompt: `The same count, ${n(st)}, holds for codes ending with key ${n(e)}. Add the two counts and take away the codes counted twice. How many codes start with key ${n(s)} or end with key ${n(e)}?`, answer: [u], explanation: `${n(st)} + ${n(st)} − ${n(both)} = ${n(u)}.` }
  ] }; }
});

})();
