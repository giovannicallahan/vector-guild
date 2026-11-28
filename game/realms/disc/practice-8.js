/* Discrete mathematics practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p8.js. */
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
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const L = i => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mod = (a, m) => ((a % m) + m) % m;
const degreesOf = (v, edges) => { const d = Array(v).fill(0); for (const [i, j] of edges) { d[i]++; d[j]++; } return d; };
const connected = (v, edges) => { const seen = new Set([0]), stack = [0];
 while (stack.length) { const x = stack.pop(); for (const [i, j] of edges) { const y = i === x ? j : j === x ? i : -1; if (y >= 0 && !seen.has(y)) { seen.add(y); stack.push(y); } } }
 return seen.size === v; };
const randomGraph = (R, v, p) => { const e = []; for (let i = 0; i < v; i++) for (let j = i + 1; j < v; j++) if (R.next() < p) e.push([i, j]); return e; };
const oddCount = d => d.filter(x => x % 2).length;
const eulerCode = odd => odd === 0 ? 2 : odd === 2 ? 1 : 0;
/* A connected random graph on vlo..vhi junctions with elo..ehi roads; `ok` may add a test on the degree list. */
const plan = (R, vlo, vhi, elo, ehi, p, ok) => { for (let i = 0; i < 6000; i++) { const v = R.int(vlo, vhi), e = randomGraph(R, v, p);
 if (e.length < elo || e.length > ehi || !connected(v, e)) continue; const d = degreesOf(v, e); if (!ok || ok(d, e)) return { v, edges: e, deg: d }; } return null; };
/* Erdős–Gallai test: can this degree list be drawn as a simple graph? */
const graphical = seq => { const d = seq.slice().sort((a, b) => b - a); if (d.reduce((s, x) => s + x, 0) % 2) return false;
 for (let k = 1; k <= d.length; k++) { let l = 0, r = k * (k - 1); for (let i = 0; i < k; i++) l += d[i]; for (let i = k; i < d.length; i++) r += Math.min(d[i], k); if (l > r) return false; } return true; };
const CODES = '2 for an Euler circuit, 1 for an Euler path but no Euler circuit, or 0 for neither';

/* ---- q36 Clock arithmetic: mod and congruence [Levin 5.2] ---- */

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The grow-lamp clock',
 brief: 'The greenhouse lamps run on a 24-hour clock, and Mira needs to know when a long grow cycle will switch them off.',
 labels: ['hour the lamps switch off', 'midnights passed'], tolerance: 0.01,
 gl: [['hours after midnight'], ['midnights passed', 'hour shown']]
}, {
 canonical: { h: 19, N: 130 },
 draw: R => { let x; do { x = { h: R.int(2, 23), N: R.int(40, 400) }; } while ((x.h + x.N) % 24 === 0 || (x.h === 19 && x.N === 130)); return x; },
 build: ({ h, N }) => { const tot = h + N, hour = tot % 24, mids = Math.floor(tot / 24); return {
  prompt: `The greenhouse lamps run on a 24-hour clock that shows the hours 0 to 23, with 0 at midnight. A grow cycle switches the lamps on at hour ${n(h)} and keeps them on for ${n(N)} hours. Enter the hour the clock shows when the lamps switch off, then the number of midnights that pass while the lamps are on.`,
  answer: [hour, mids],
  hints: ['Count forward from the start by adding the hours the cycle runs. The clock forgets every whole day of 24 hours, so the hour it shows is that total mod 24.', 'Each whole 24 hours passes one midnight. Measure from the midnight just before the lamps go on, and see how many whole days fit into the hours up to switch-off.'],
  solution: `Measure from the midnight just before the lamps go on: they switch on ${n(h)} hours after it and off ${n(h)} + ${n(N)} = ${n(tot)} hours after it. ${n(tot)} = 24 × ${n(mids)} + ${n(hour)}, with ${n(hour)} from 0 to 23. The clock forgets whole days, so it shows ${n(hour)}, and ${n(mids)} ${mids === 1 ? 'midnight passes' : 'midnights pass'} on the way.`,
  guidance: [
   { prompt: `Count from the midnight just before the lamps go on. The switch-on is ${n(h)} hours after it, and the cycle then runs ${n(N)} hours. How many hours after that midnight do the lamps switch off?`, answer: [tot], explanation: `${n(h)} + ${n(N)} = ${n(tot)}.` },
   { prompt: `Write ${n(tot)} as 24 × quotient + remainder, with the remainder from 0 to 23. What are the quotient and the remainder?`, answer: [mids, hour], explanation: `24 × ${n(mids)} = ${n(24 * mids)}, and ${n(tot)} − ${n(24 * mids)} = ${n(hour)}. The quotient ${n(mids)} counts the midnights passed, and the remainder ${n(hour)} is the hour the clock shows.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Pallet tags and convoy days',
 brief: 'Seed pallets get a check tag at the Road Office, and the convoy that collects them runs on a fixed cycle.',
 labels: ['total packs', 'pallet tag', 'day code'], tolerance: 0.01,
 gl: [['total packs'], ['pallet tag'], ['day code']]
}, {
 canonical: { a: 16, b: 27, c: 14, m: 11, s: 4, d: 12, k: 9 },
 draw: R => { let x; do { x = { a: R.int(12, 40), b: R.int(12, 40), c: R.int(3, 30), m: R.int(7, 13), s: R.int(0, 6), d: R.int(9, 20), k: R.int(8, 25) };
  } while (x.d % 7 === 0 || x.k % 7 === 0 || (x.a * x.b + x.c) % x.m === 0 || (x.a === 16 && x.b === 27)); return x; },
 build: ({ a, b, c, m, s, d, k }) => { const total = a * b + c, tag = total % m, D = d * k, Dq = Math.floor(D / 7), Dr = D % 7, day = (s + Dr) % 7; return {
  prompt: `A pallet of seed packs at the Road Office holds ${n(a)} trays of ${n(b)} packs, plus ${n(c)} loose packs. The pallet tag is the total number of packs mod ${n(m)}. Enter the total number of packs (type it without commas), then the tag. Convoys collect stock every ${n(d)} days, and the convoy of today has day code ${n(s)} (0 for Monday up to 6 for Sunday). Enter the day code of the day convoy number ${n(k)} leaves, counting today’s convoy as number 0.`,
  answer: [total, tag, day],
  hints: [`Multiply the trays by the packs in each tray, then add the loose packs. The tag is the remainder when that total is divided by ${n(m)}.`, 'The convoy leaves a whole number of days from today. Only that number of days mod 7 matters for the weekday: add it to today’s code, and take mod 7 again if the sum reaches 7.'],
  solution: `${n(a)} × ${n(b)} + ${n(c)} = ${n(total)} packs. ${n(total)} = ${n(m)} × ${n(Math.floor(total / m))} + ${n(tag)}, so the tag is ${n(tag)}. Convoy number ${n(k)} leaves ${n(k)} × ${n(d)} = ${n(D)} days from today. ${n(D)} = 7 × ${n(Dq)} + ${n(Dr)}, so the weekday moves on by ${n(Dr)}: ${n(s)} + ${n(Dr)} = ${n(s + Dr)}${s + Dr >= 7 ? `, and ${n(s + Dr)} mod 7 = ${n(day)}` : ''}, which is ${DAYS[day]}, code ${n(day)}.`,
  guidance: [
   { prompt: `The pallet holds ${n(a)} trays of ${n(b)} packs and ${n(c)} loose packs. How many packs is that in all?`, answer: [total], explanation: `${n(a)} × ${n(b)} + ${n(c)} = ${n(total)}.` },
   { prompt: `The tag is the total mod ${n(m)}. What is ${n(total)} mod ${n(m)}?`, answer: [tag], explanation: `${n(total)} = ${n(m)} × ${n(Math.floor(total / m))} + ${n(tag)}, so the tag is ${n(tag)}.` },
   { prompt: `Convoy number ${n(k)} leaves ${n(k)} × ${n(d)} = ${n(D)} days from today, and ${n(D)} mod 7 is ${n(Dr)}. Today’s code is ${n(s)}. What is the day code of that convoy?`, answer: [day], explanation: `${n(s)} + ${n(Dr)} = ${n(s + Dr)}${s + Dr >= 7 ? `, and ${n(s + Dr)} mod 7 = ${n(day)}` : ''}: ${DAYS[day]}, code ${n(day)}.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'The ledger that owes permits',
 brief: 'The permit ledger has run into the red, and Mira still needs a check number for the balance and the weekday of the last convoy.',
 labels: ['check number', 'day code'], tolerance: 0.01,
 gl: [['balance'], ['check number'], ['day code']]
}, {
 canonical: { a: 23, b: 17, c: 500, m: 8, s: 2, N: 151 },
 draw: R => { let x; do { const a = R.int(15, 60), b = R.int(15, 60); x = { a, b, c: a * b + R.int(20, 400), m: R.int(5, 12), s: R.int(0, 6), N: R.int(20, 400) };
  } while (x.N % 7 === 0 || mod(x.a * x.b - x.c, x.m) === 0 || (x.a === 23 && x.b === 17)); return x; },
 build: ({ a, b, c, m, s, N }) => { const ab = a * b, v = ab - c, q = Math.floor(v / m), tag = v - m * q, Nq = Math.floor(N / 7), Nr = N % 7, day = mod(s - Nr, 7); return {
  prompt: `The Road Office ledger works out its permit balance as ${n(a)} × ${n(b)} − ${n(c)}, and the balance is negative when more permits are owed than were issued. The check number of the balance is its remainder on division by ${n(m)}, always from 0 to ${n(m - 1)}, even when the balance is negative. Enter the check number. Then: today is ${DAYS[s]}, and the last convoy left ${n(N)} days ago. With the days coded 0 for Monday up to 6 for Sunday, enter the code of the day it left.`,
  answer: [tag, day],
  hints: [`A remainder is never negative. Find the first multiple of ${n(m)} at or below the balance: what is left above it is the check number.`, 'Going back in time subtracts days. Only the number of days mod 7 matters: subtract it from today’s code, and add 7 if the result is below 0.'],
  solution: `${n(a)} × ${n(b)} = ${n(ab)}, so the balance is ${n(ab)} − ${n(c)} = ${n(v)}. The first multiple of ${n(m)} at or below ${n(v)} is ${n(m)} × ${par(q)} = ${n(m * q)}, and ${n(v)} − ${par(m * q)} = ${n(tag)}. So ${n(v)} = ${n(m)} × ${par(q)} + ${n(tag)}, and the check number is ${n(tag)}. For the convoy, ${n(N)} = 7 × ${n(Nq)} + ${n(Nr)}, so the weekday moves back by ${n(Nr)}: ${n(s)} − ${n(Nr)} = ${n(s - Nr)}${s - Nr < 0 ? `, which is below 0, so add 7 to get ${n(day)}` : ''}. That is ${DAYS[day]}, code ${n(day)}.`,
  guidance: [
   { prompt: `Work out the balance ${n(a)} × ${n(b)} − ${n(c)}.`, answer: [v], explanation: `${n(ab)} − ${n(c)} = ${n(v)}. More permits are owed than were issued, so the balance is below zero.` },
   { prompt: `Write ${n(v)} = ${n(m)} × quotient + remainder, with the remainder from 0 to ${n(m - 1)}. What is the remainder, the check number?`, answer: [tag], explanation: `The first multiple of ${n(m)} at or below ${n(v)} is ${n(m)} × ${par(q)} = ${n(m * q)}, and ${n(v)} − ${par(m * q)} = ${n(tag)}.` },
   { prompt: `The last convoy left ${n(N)} days ago, and ${n(N)} mod 7 is ${n(Nr)}. Today’s code is ${n(s)}. Subtract ${n(Nr)}, adding 7 if the result is below 0. What is the code of the day it left?`, answer: [day], explanation: `${n(s)} − ${n(Nr)} = ${n(s - Nr)}${s - Nr < 0 ? `, and ${n(s - Nr)} + 7 = ${n(day)}` : ''}: ${DAYS[day]}, code ${n(day)}.` }
  ] }; }
});

/* ---- q37 Graphs, degrees and the handshake lemma [Levin 4.1] ---- */

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Cable posts on the ridge',
 brief: 'The comms team has plugged cables into relay posts along the ridge and wants to know how many cables there are.',
 labels: ['cables on the ridge', 'cables at the second site'], tolerance: 0.01,
 gl: [['degree total'], ['cables on the ridge'], ['cables at the second site']]
}, {
 canonical: { d1: [4, 3, 1, 3, 2, 3, 2], v2: 8, k2: 3 },
 draw: R => { const g = plan(R, 5, 8, 6, 14, 0.45, d => d.every(x => x >= 1)); let x; do { x = { v2: R.int(6, 12), k2: R.int(3, 5) }; } while ((x.v2 * x.k2) % 2);
  return { d1: g ? g.deg : [2, 2, 2, 2, 2], ...x }; },
 build: ({ d1, v2, k2 }) => { const S1 = d1.reduce((s, x) => s + x, 0), E1 = S1 / 2, S2 = v2 * k2, E2 = S2 / 2; return {
  prompt: `The comms team links relay posts on the ridge with cables. Each post is a vertex, each cable is an edge, and the degree of a post is the number of cables plugged into it. The posts A to ${L(d1.length - 1)} have degrees ${and(d1.map(n))}. Enter the number of cables on the ridge. A second site has ${n(v2)} posts, and every one of them has ${n(k2)} cables plugged in. Enter the number of cables at the second site.`,
  answer: [E1, E2],
  hints: ['Every cable has two plugs, one at each end, so each cable adds 1 to the degrees of two posts. Add the degrees up and use that to get the number of cables.', 'At the second site every post has the same degree, so the degrees add up to the number of posts times that degree. Then use the same rule.'],
  solution: `Ridge: the degrees add up to ${d1.map(n).join(' + ')} = ${n(S1)}. Every cable is counted twice, once at each end, so there are ${n(S1)} ÷ 2 = ${n(E1)} cables. Second site: ${n(v2)} posts of degree ${n(k2)} give a degree total of ${n(v2)} × ${n(k2)} = ${n(S2)}, so there are ${n(S2)} ÷ 2 = ${n(E2)} cables.`,
  guidance: [
   { prompt: 'What do the degrees of the ridge posts add up to?', answer: [S1], explanation: `${d1.map(n).join(' + ')} = ${n(S1)}.` },
   { prompt: `Each cable adds 2 to that total, one for each end. How many cables are on the ridge?`, answer: [E1], explanation: `${n(S1)} ÷ 2 = ${n(E1)}. This is the handshake lemma: the degrees add up to twice the number of edges.` },
   { prompt: `At the second site all ${n(v2)} posts have degree ${n(k2)}, so the degrees add up to ${n(v2)} × ${n(k2)}. How many cables does the second site have?`, answer: [E2], explanation: `${n(v2)} × ${n(k2)} = ${n(S2)}, and ${n(S2)} ÷ 2 = ${n(E2)} cables.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Resurfacing the south yard',
 brief: 'The south yard is to be resurfaced, but one junction’s survey sheet is missing and the Road Office needs the bill.',
 labels: ['degree of the last junction', 'total cost in credits'], tolerance: 0.01,
 gl: [['degree total', 'known degrees'], ['missing degree'], ['total cost']]
}, {
 canonical: { known: [3, 4, 2, 3, 1], e: 9, c: 25 },
 draw: R => { const g = plan(R, 5, 7, 6, 13, 0.5, d => d[d.length - 1] >= 2); return g ? { known: g.deg.slice(0, -1), e: g.edges.length, c: R.int(12, 45) } : { known: [3, 4, 2, 3, 1], e: 9, c: 30 }; },
 build: ({ known, e, c }) => { const v = known.length + 1, K = known.reduce((s, x) => s + x, 0), x = 2 * e - K, last = L(v - 1), names = and(known.map((_, i) => L(i))); return {
  prompt: `The Road Office is resurfacing the south yard, a network of ${n(v)} junctions, A to ${last}, with ${n(e)} roads. The degrees of ${names} are ${and(known.map(n))}. Enter the degree of ${last}. Resurfacing costs ${n(c)} credits per road. Enter the total cost of resurfacing every road, in credits.`,
  answer: [x, e * c],
  hints: ['The degrees of all the junctions add up to twice the number of roads. The missing degree is whatever the known degrees leave short of that total.', 'Every road is resurfaced once, so the cost is the number of roads times the cost of one road.'],
  solution: `${n(e)} roads give a degree total of 2 × ${n(e)} = ${n(2 * e)}. The known degrees add up to ${known.map(n).join(' + ')} = ${n(K)}, so ${last} has degree ${n(2 * e)} − ${n(K)} = ${n(x)}. Resurfacing all ${n(e)} roads costs ${n(e)} × ${n(c)} = ${n(e * c)} credits.`,
  guidance: [
   { prompt: `What must all ${n(v)} degrees add up to, and what do the known degrees of ${names} add up to?`, answer: [2 * e, K], explanation: `${n(e)} roads give 2 × ${n(e)} = ${n(2 * e)}. The known degrees give ${known.map(n).join(' + ')} = ${n(K)}.` },
   { prompt: `What is the degree of ${last}?`, answer: [x], explanation: `${n(2 * e)} − ${n(K)} = ${n(x)}.` },
   { prompt: `What does it cost to resurface all ${n(e)} roads at ${n(c)} credits each?`, answer: [e * c], explanation: `${n(e)} × ${n(c)} = ${n(e * c)} credits.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', title: 'The big junction census',
 brief: 'The district is too big to list junction by junction, so the Road Office has only counts of junctions of each degree.',
 labels: ['roads in the north works', 'junctions of degree 3'], tolerance: 0.01,
 gl: [['degree total'], ['roads in the north works'], ['degrees still to place', 'junctions of degree 3']]
}, {
 canonical: { a: 6, b: 4, c: 3, x: 3, y: 5, t: 7 },
 draw: R => { let z; do { z = { a: R.int(3, 8), b: R.pick([2, 4, 6]), c: R.int(2, 6), x: R.int(2, 6), y: R.int(3, 9), t: R.int(2, 8) };
  } while ((z.y + z.t) % 2 || !graphical([...Array(z.a).fill(4), ...Array(z.b).fill(3), ...Array(z.c).fill(2)]) || !graphical([...Array(z.x).fill(4), ...Array(z.y).fill(1), ...Array(z.t).fill(3)]) || (z.a === 6 && z.b === 4 && z.c === 3)); return z; },
 build: ({ a, b, c, x, y, t }) => { const S1 = 4 * a + 3 * b + 2 * c, E1 = S1 / 2, e2 = (4 * x + y + 3 * t) / 2, rest = 2 * e2 - 4 * x - y; return {
  prompt: `The Road Office surveys the whole depot district, which is too big to list junction by junction. The north works has exactly ${n(a + b + c)} junctions: ${n(a)} of degree 4, ${n(b)} of degree 3 and ${n(c)} of degree 2. Enter the number of roads in the north works. The south works has ${n(e2)} roads, ${n(x)} junctions of degree 4, ${n(y)} junctions of degree 1, and every other junction has degree 3. Enter the number of junctions of degree 3 in the south works.`,
  answer: [E1, t],
  hints: ['Add the degrees up by groups: a group of junctions that all have the same degree adds that degree once for each junction. Then use the fact that the degrees add up to twice the number of roads.', 'In the south works the degrees add up to twice the roads. Take away what the degree 4 and degree 1 junctions contribute: what is left comes from junctions that each contribute 3.'],
  solution: `North works: the degrees add up to ${n(a)} × 4 + ${n(b)} × 3 + ${n(c)} × 2 = ${n(4 * a)} + ${n(3 * b)} + ${n(2 * c)} = ${n(S1)}, so there are ${n(S1)} ÷ 2 = ${n(E1)} roads. South works: ${n(e2)} roads give a degree total of ${n(2 * e2)}. The junctions of degree 4 and 1 contribute ${n(x)} × 4 + ${n(y)} × 1 = ${n(4 * x + y)}, which leaves ${n(2 * e2)} − ${n(4 * x + y)} = ${n(rest)} for the junctions of degree 3. Each contributes 3, so there are ${n(rest)} ÷ 3 = ${n(t)} of them.`,
  guidance: [
   { prompt: `What do the degrees of the north works add up to? Work out ${n(a)} × 4 + ${n(b)} × 3 + ${n(c)} × 2.`, answer: [S1], explanation: `${n(4 * a)} + ${n(3 * b)} + ${n(2 * c)} = ${n(S1)}.` },
   { prompt: `Each road adds 2 to that total. How many roads does the north works have?`, answer: [E1], explanation: `${n(S1)} ÷ 2 = ${n(E1)}, by the handshake lemma.` },
   { prompt: `In the south works the degrees add up to 2 × ${n(e2)}. The junctions of degree 4 and 1 contribute ${n(x)} × 4 + ${n(y)} × 1 of that. How much is left for the junctions of degree 3, and how many such junctions is that?`, answer: [rest, t], explanation: `2 × ${n(e2)} = ${n(2 * e2)}, and ${n(2 * e2)} − ${n(4 * x + y)} = ${n(rest)}. Each junction of degree 3 contributes 3, so ${n(rest)} ÷ 3 = ${n(t)} junctions.` }
  ] }; }
});

/* ---- q38 Trees: v − 1 edges [Levin 4.2] ---- */

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The lab cable tree',
 brief: 'The research domes are tied together by data cables, and the Road Office wants the cable count read both ways round.',
 labels: ['labs linked', 'cables to take out'], tolerance: 0.01,
 gl: [['labs linked'], ['cables to keep'], ['cables to take out']]
}, {
 canonical: { E: 26, V: 10, F: 15 },
 draw: R => { let x; do { const V = R.int(7, 16); x = { E: R.int(15, 60), V, F: V + R.int(1, 8) }; } while (x.F > x.V * (x.V - 1) / 2 || (x.E === 26 && x.V === 10)); return x; },
 build: ({ E, V, F }) => { const labs = E + 1, keep = V - 1, cut = F - keep; return {
  prompt: `The research domes are linked by data cables. One cluster is a tree of cables: it is connected, it has no cycle, and it has ${n(E)} cables. Enter the number of labs it links. Another cluster of ${n(V)} labs is connected by ${n(F)} cables. Enter the fewest cables to take out so that what is left is a tree.`,
  answer: [labs, cut],
  hints: ['A tree always has one fewer edge than it has vertices. Read that the other way round: how many vertices go with this many edges?', 'A tree on a given number of labs keeps one cable fewer than that number. Every cable beyond that closes a cycle and has to go.'],
  solution: `A tree with v vertices has v − 1 edges, so a tree with ${n(E)} edges has ${n(E)} + 1 = ${n(labs)} vertices: it links ${n(labs)} labs. A tree on ${n(V)} labs keeps ${n(V)} − 1 = ${n(keep)} cables, so ${n(F)} − ${n(keep)} = ${n(cut)} must come out.`,
  guidance: [
   { prompt: `A tree has one more vertex than it has edges. How many labs does a tree of ${n(E)} cables link?`, answer: [labs], explanation: `${n(E)} + 1 = ${n(labs)}, because v − 1 = ${n(E)} gives v = ${n(labs)}.` },
   { prompt: `A tree on ${n(V)} labs keeps how many cables?`, answer: [keep], explanation: `${n(V)} − 1 = ${n(keep)}.` },
   { prompt: `How many of the ${n(F)} cables must come out?`, answer: [cut], explanation: `${n(F)} − ${n(keep)} = ${n(cut)}. Each cable taken out breaks one cycle without cutting any lab off.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'Trimming the old loops',
 brief: 'The old quarry network is full of loops that cost money to keep, and the Road Office wants to know what trimming it saves and what is left to maintain.',
 labels: ['roads to close', 'salvage in credits', 'yearly maintenance in credits'], tolerance: 0.01,
 gl: [['roads kept', 'roads to close'], ['salvage in credits'], ['yearly maintenance in credits']]
}, {
 canonical: { V: 14, E: 19, s: 30, u: 12 },
 draw: R => { let x; do { const V = R.int(8, 20); x = { V, E: V + R.int(2, 9), s: R.int(15, 60), u: R.int(8, 25) }; } while (x.V === 14 && x.E === 19); return x; },
 build: ({ V, E, s, u }) => { const keep = V - 1, cut = E - keep; return {
  prompt: `An old network at the quarry joins ${n(V)} junctions with ${n(E)} roads, and every junction can reach every other. Mira wants it cut down to a tree by closing as few roads as possible. Each road closed is dug up and sold for ${n(s)} credits of salvage, and each road kept costs ${n(u)} credits a year to maintain. Enter the number of roads to close, then the total salvage in credits, then the yearly maintenance bill in credits for the roads kept.`,
  answer: [cut, cut * s, keep * u],
  hints: ['A tree on a given number of junctions has one road fewer than that number. The roads beyond that are the ones to close.', 'Salvage is paid on the roads closed, and maintenance on the roads kept. Multiply each number of roads by its credits per road.'],
  solution: `A tree on ${n(V)} junctions keeps ${n(V)} − 1 = ${n(keep)} roads, so ${n(E)} − ${n(keep)} = ${n(cut)} roads close. Salvage: ${n(cut)} × ${n(s)} = ${n(cut * s)} credits. Maintenance: ${n(keep)} × ${n(u)} = ${n(keep * u)} credits a year.`,
  guidance: [
   { prompt: `A tree on ${n(V)} junctions keeps how many roads, and so how many of the ${n(E)} roads are closed?`, answer: [keep, cut], explanation: `${n(V)} − 1 = ${n(keep)} roads are kept, and ${n(E)} − ${n(keep)} = ${n(cut)} are closed.` },
   { prompt: `What is the salvage from closing ${n(cut)} roads at ${n(s)} credits each?`, answer: [cut * s], explanation: `${n(cut)} × ${n(s)} = ${n(cut * s)} credits.` },
   { prompt: `What is the yearly maintenance for ${n(keep)} roads at ${n(u)} credits each?`, answer: [keep * u], explanation: `${n(keep)} × ${n(u)} = ${n(keep * u)} credits a year.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q37', title: 'The branching plan',
 brief: 'Mira’s last tree plan for the far domes has two kinds of branching junction, and she needs its leaves and its roads counted before she orders tarmac.',
 labels: ['junctions of degree 1', 'roads in the plan'], tolerance: 0.01,
 gl: [['degree total'], ['junctions of degree 1'], ['roads in the plan']]
}, {
 canonical: { a: 3, b: 4 },
 draw: R => { let x; do { x = { a: R.int(2, 7), b: R.int(2, 8) }; } while (x.a === 3 && x.b === 4); return x; },
 build: ({ a, b }) => { const Lf = 2 * a + b + 2, v = a + b + Lf, sum = 4 * a + 3 * b, half = 2 * (a + b - 1); return {
  prompt: `Mira’s last tree plan for the far domes has ${n(a)} junctions of degree 4 and ${n(b)} junctions of degree 3, and every other junction has degree 1. Enter the number of junctions of degree 1. Then enter the number of roads in the whole plan.`,
  answer: [Lf, v - 1],
  hints: ['Write L for the number of junctions of degree 1. The tree has the degree 4 and degree 3 junctions plus L more, and a tree always has one road fewer than it has junctions.', 'By the handshake lemma the degrees add up to twice the number of roads. Write that as an equation in L and solve it.'],
  solution: `Let L be the number of junctions of degree 1. The tree has ${n(a)} + ${n(b)} + L junctions, so ${n(a)} + ${n(b)} + L − 1 roads. The degrees add up to ${n(4 * a)} + ${n(3 * b)} + L = ${n(sum)} + L, and by the handshake lemma that is 2 × (${n(a + b - 1)} + L) = ${n(half)} + 2L. So L = ${n(sum)} − ${n(half)} = ${n(Lf)}. The plan has ${n(a)} + ${n(b)} + ${n(Lf)} = ${n(v)} junctions, so ${n(v)} − 1 = ${n(v - 1)} roads.`,
  guidance: [
   { prompt: `What do the degrees of the ${n(a)} junctions of degree 4 and the ${n(b)} junctions of degree 3 add up to?`, answer: [sum], explanation: `${n(a)} × 4 + ${n(b)} × 3 = ${n(4 * a)} + ${n(3 * b)} = ${n(sum)}. The leaves add L more.` },
   { prompt: `The degrees add up to ${n(sum)} + L, and there are ${n(a + b - 1)} + L roads. Solve ${n(sum)} + L = 2 × (${n(a + b - 1)} + L). What is L?`, answer: [Lf], explanation: `${n(sum)} + L = ${n(half)} + 2L, so L = ${n(sum)} − ${n(half)} = ${n(Lf)}.` },
   { prompt: `With ${n(Lf)} junctions of degree 1, how many junctions does the plan have, and so how many roads?`, answer: [v - 1], explanation: `${n(a)} + ${n(b)} + ${n(Lf)} = ${n(v)} junctions, and a tree on ${n(v)} junctions has ${n(v)} − 1 = ${n(v - 1)} roads.` }
  ] }; }
});

/* ---- q39 Euler paths and circuits [Levin 4.5] ---- */

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The corridor survey',
 brief: 'A cleaning robot has to sweep every corridor of the dome complex exactly once, and the survey lists the corridors room by room.',
 labels: ['rooms with an odd number of corridors', 'Euler code'], tolerance: 0.01,
 gl: [['degree of A', 'degree of B', 'degree of C'], ['rooms of odd degree'], ['Euler code']]
}, {
 canonical: { edges: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]] },
 draw: R => { const want = R.pick([0, 1, 2]), canon = JSON.stringify([[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]]);
  const g = plan(R, 5, 7, 6, 12, 0.5, (d, e) => eulerCode(oddCount(d)) === want && JSON.stringify(e) !== canon);
  return { edges: g ? g.edges : [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]] }; },
 build: ({ edges }) => { const v = Math.max(...edges.flat()) + 1, d = degreesOf(v, edges), odd = oddCount(d), code = eulerCode(odd), oddNames = d.map((x, i) => x % 2 ? L(i) : null).filter(Boolean);
  const adj = d.map((_, i) => `${L(i)}: ${edges.map(([p, q]) => p === i ? L(q) : q === i ? L(p) : null).filter(Boolean).sort().join(', ')}`).join('; ');
  const degs = d.map((x, i) => `${L(i)} ${n(x)}`).join(', ');
  const verdict = odd === 0 ? 'Every degree is even, so the complex has an Euler circuit: code 2.' : odd === 2 ? `Exactly two are odd, so there is an Euler path from ${oddNames[0]} to ${oddNames[1]} but no Euler circuit: code 1.` : `${n(odd)} odd degrees is more than two, so there is neither an Euler path nor an Euler circuit: code 0.`;
  return {
  prompt: `A cleaning robot must sweep every corridor of the dome complex exactly once. The complex is connected, and the survey lists each room, A to ${L(v - 1)}, with the rooms it joins by a corridor: ${adj}. Enter the number of rooms with an odd number of corridors. Then enter ${CODES}.`,
  answer: [odd, code],
  hints: ['The degree of a room is the number of rooms listed after its letter. Count those for every room, then count how many of the degrees are odd.', 'A connected graph has an Euler circuit when every degree is even, an Euler path but no circuit when exactly two degrees are odd, and neither when more than two are odd.'],
  solution: `Counting the rooms listed after each letter, the degrees are ${degs}. ${odd === 0 ? 'None of them is odd' : `The odd ones are ${and(oddNames)}, ${n(odd)} in all`}. ${verdict}`,
  guidance: [
   { prompt: 'Count the rooms listed after each of A, B and C. What are their degrees?', answer: [d[0], d[1], d[2]], explanation: `A ${n(d[0])}, B ${n(d[1])}, C ${n(d[2])}: one for each corridor listed with that letter.` },
   { prompt: `Count the rest the same way. How many of the ${n(v)} degrees are odd?`, answer: [odd], explanation: `The degrees are ${degs}. ${odd === 0 ? 'No degree is odd' : `The odd ones are ${and(oddNames)}`}: ${n(odd)} in all.` },
   { prompt: 'Which code fits: 2 for an Euler circuit, 1 for an Euler path but no circuit, 0 for neither?', answer: [code], explanation: verdict }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Mending the patrol route',
 brief: 'The night patrol has to finish where it started, and Mira wants to know the fewest new roads that make that possible.',
 labels: ['roads on the ridge', 'junctions of odd degree', 'fewest new roads'], tolerance: 0.01,
 gl: [['roads on the ridge'], ['junctions of odd degree'], ['fewest new roads']]
}, {
 canonical: { deg: [3, 3, 2, 3, 3, 2] },
 draw: R => { const g = plan(R, 5, 8, 6, 14, 0.5, d => [2, 4, 6].includes(oddCount(d)) && JSON.stringify(d) !== '[3,3,2,3,3,2]'); return { deg: g ? g.deg : [3, 3, 3, 3, 2, 2, 2] }; },
 build: ({ deg }) => { const S = deg.reduce((s, x) => s + x, 0), E = S / 2, odd = oddCount(deg), fix = odd / 2, oddNames = deg.map((x, i) => x % 2 ? L(i) : null).filter(Boolean); return {
  prompt: `The night patrol wants to drive every road of the east ridge exactly once and finish where it started. The ridge is connected, with junctions A to ${L(deg.length - 1)} of degrees ${and(deg.map(n))}, and it has no Euler circuit as it stands. Each new road Mira builds joins two different junctions of odd degree, and may run alongside an existing road. Enter the number of roads on the ridge now, then the number of junctions of odd degree, then the fewest new roads that would give the ridge an Euler circuit.`,
  answer: [E, odd, fix],
  hints: ['The handshake lemma turns the degrees into the number of roads. Then count the odd degrees.', 'A new road adds 1 to the degree of each junction it joins, so it turns two odd degrees even. An Euler circuit needs every degree even, so work out how many roads it takes to fix all the odd ones.'],
  solution: `The degrees add up to ${n(S)}, so there are ${n(S)} ÷ 2 = ${n(E)} roads. The odd degrees are at ${and(oddNames)}, ${n(odd)} in all. Each new road joining two odd junctions makes both even, and no road can fix more than two, so it takes ${n(odd)} ÷ 2 = ${n(fix)} new roads. Then every degree is even and the ridge is still connected, so it has an Euler circuit.`,
  guidance: [
   { prompt: `The degrees add up to ${n(S)}. How many roads does the ridge have?`, answer: [E], explanation: `By the handshake lemma, ${n(S)} ÷ 2 = ${n(E)}.` },
   { prompt: 'How many of the degrees are odd?', answer: [odd], explanation: `The odd degrees are at ${and(oddNames)}: ${n(odd)} in all.` },
   { prompt: `Each new road joins two odd junctions and makes both of them even. How many new roads does it take to fix all ${n(odd)}?`, answer: [fix], explanation: `${n(odd)} ÷ 2 = ${n(fix)}. No fewer will do, because each road changes at most two junctions from odd to even.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q38', title: 'The patrol along the ridge tree',
 brief: 'The ridge road branches like a tree, and Mira wants to know how far it is from a patrol that can end where it began.',
 labels: ['roads in the tree', 'junctions of odd degree', 'fewest new roads'], tolerance: 0.01,
 gl: [['junctions of degree 1'], ['roads in the tree'], ['junctions of odd degree', 'fewest new roads']]
}, {
 canonical: { t: 5, s: 4 },
 draw: R => { let x; do { x = { t: R.int(3, 12), s: R.int(1, 9) }; } while (x.t === 5 && x.s === 4); return x; },
 build: ({ t, s }) => { const Lf = t + 2, v = t + s + Lf, roads = v - 1, odd = t + Lf, fix = odd / 2; return {
  prompt: `The ridge road is laid out as a tree: it is connected and has no cycle. It has ${n(t)} junctions of degree 3, ${n(s)} ${s === 1 ? 'bend' : 'bends'} of degree 2, and every other junction has degree 1. Every tree with n junctions has exactly n − 1 roads. The patrol wants to drive along every road once and end where it began. Enter the number of roads in the tree. Then enter the number of junctions of odd degree. Then enter the fewest new roads that would give the ridge an Euler circuit, if each new road joins two junctions of odd degree and may run alongside an existing road.`,
  answer: [roads, odd, fix],
  hints: ['Write L for the number of junctions of degree 1. A tree has one road fewer than it has junctions, and by the handshake lemma its degrees add up to twice the number of roads. Solve for L.', 'Junctions of degree 3 and degree 1 are odd, and bends of degree 2 are even. Each new road joining two odd junctions makes both even.'],
  solution: `Let L be the number of junctions of degree 1. The tree has ${n(t)} + ${n(s)} + L junctions and so ${n(t + s - 1)} + L roads. The degrees add up to ${n(3 * t)} + ${n(2 * s)} + L = ${n(3 * t + 2 * s)} + L, and that is 2 × (${n(t + s - 1)} + L) = ${n(2 * (t + s - 1))} + 2L, so L = ${n(3 * t + 2 * s)} − ${n(2 * (t + s - 1))} = ${n(Lf)}. The tree has ${n(v)} junctions, so ${n(roads)} roads. The odd junctions are the ${n(t)} of degree 3 and the ${n(Lf)} of degree 1: ${n(odd)} in all. Each new road fixes two of them, so it takes ${n(odd)} ÷ 2 = ${n(fix)} new roads.`,
  guidance: [
   { prompt: `Write L for the junctions of degree 1. Solve ${n(3 * t + 2 * s)} + L = 2 × (${n(t + s - 1)} + L), where the left side is the degree total and ${n(t + s - 1)} + L is the number of roads. What is L?`, answer: [Lf], explanation: `${n(3 * t + 2 * s)} + L = ${n(2 * (t + s - 1))} + 2L, so L = ${n(3 * t + 2 * s)} − ${n(2 * (t + s - 1))} = ${n(Lf)}.` },
   { prompt: `With ${n(Lf)} junctions of degree 1, how many roads does the tree have?`, answer: [roads], explanation: `${n(t)} + ${n(s)} + ${n(Lf)} = ${n(v)} junctions, and a tree on ${n(v)} junctions has ${n(v)} − 1 = ${n(roads)} roads.` },
   { prompt: `How many junctions have odd degree, and how many new roads does it take to make them all even?`, answer: [odd, fix], explanation: `The ${n(t)} junctions of degree 3 and the ${n(Lf)} of degree 1 are odd: ${n(odd)} in all. ${n(odd)} ÷ 2 = ${n(fix)} new roads.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Number theory and Graph theory [Levin 5.2, 4.5] ---- */

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The inspection calendar',
 brief: 'The corridor plan for the new greenhouse is ready, and an inspector will check one corridor a day until every one is done.',
 labels: ['corridors', 'Euler code', 'day code of the last check'], tolerance: 0.01,
 gl: [['corridors'], ['odd degrees'], ['Euler code'], ['day code']]
}, {
 canonical: { deg: [3, 3, 2, 4, 2, 2, 2], s: 3 },
 draw: R => { const want = R.pick([0, 1, 2]); const g = plan(R, 6, 8, 7, 13, 0.4, (d, e) => eulerCode(oddCount(d)) === want && (e.length - 1) % 7 !== 0 && JSON.stringify(d) !== '[3,3,2,4,2,2,2]');
  return { deg: g ? g.deg : [2, 2, 2, 2, 2, 2, 2, 2], s: R.int(0, 6) }; },
 build: ({ deg, s }) => { const S = deg.reduce((t, x) => t + x, 0), E = S / 2, odd = oddCount(deg), code = eulerCode(odd), day = (s + E - 1) % 7, oddNames = deg.map((x, i) => x % 2 ? L(i) : null).filter(Boolean);
  const verdict = odd === 0 ? 'Every degree is even, so the network has an Euler circuit: code 2' : odd === 2 ? `Exactly two are odd, so it has an Euler path from ${oddNames[0]} to ${oddNames[1]} but no circuit: code 1` : 'More than two are odd, so it has neither an Euler path nor an Euler circuit: code 0';
  const which = odd === 0 ? 'No degree is odd' : `The odd degrees are at ${and(oddNames)}, ${n(odd)} in all`;
  return {
  prompt: `The corridor plan for the new greenhouse is one connected network of junctions A to ${L(deg.length - 1)}, with degrees ${and(deg.map(n))}. An inspector checks exactly one corridor a day, starting today, which has day code ${n(s)} (0 for Monday up to 6 for Sunday), and carries on until every corridor has been checked once. Enter the number of corridors, then the Euler code (${CODES}), then the day code of the day the last corridor is checked.`,
  answer: [E, code, day],
  hints: ['The handshake lemma turns the list of degrees into the number of corridors.', 'Count the odd degrees to choose the Euler code. The first corridor is checked today, so the last one is checked after a number of days one fewer than the number of corridors. Only that number of days mod 7 matters for the weekday.'],
  solution: `The degrees add up to ${n(S)}, so there are ${n(S)} ÷ 2 = ${n(E)} corridors. ${which}. ${verdict}. The first corridor is checked today and the last ${n(E)} − 1 = ${n(E - 1)} days later. ${n(E - 1)} = 7 × ${n(Math.floor((E - 1) / 7))} + ${n((E - 1) % 7)}, so the weekday moves on by ${n((E - 1) % 7)}: ${n(s)} + ${n((E - 1) % 7)} = ${n(s + (E - 1) % 7)}${s + (E - 1) % 7 >= 7 ? `, and ${n(s + (E - 1) % 7)} mod 7 = ${n(day)}` : ''}, which is ${DAYS[day]}, code ${n(day)}.`,
  guidance: [
   { prompt: `The degrees add up to ${n(S)}. How many corridors are there?`, answer: [E], explanation: `By the handshake lemma, ${n(S)} ÷ 2 = ${n(E)}.` },
   { prompt: 'How many of the degrees are odd?', answer: [odd], explanation: `${which}.` },
   { prompt: 'Which Euler code fits: 2, 1 or 0?', answer: [code], explanation: `The network is connected. ${verdict}.` },
   { prompt: `The last corridor is checked ${n(E)} − 1 = ${n(E - 1)} days after today, and ${n(E - 1)} mod 7 is ${n((E - 1) % 7)}. Today’s code is ${n(s)}. What is the day code of the last check?`, answer: [day], explanation: `${n(s)} + ${n((E - 1) % 7)} = ${n(s + (E - 1) % 7)}${s + (E - 1) % 7 >= 7 ? `, and ${n(s + (E - 1) % 7)} mod 7 = ${n(day)}` : ''}: ${DAYS[day]}, code ${n(day)}.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Trimming the depot plan',
 brief: 'The new depot network has more roads than it needs, and Mira wants it cut to a tree with the spare posts shared out.',
 labels: ['roads in the network', 'roads to close', 'posts left over'], tolerance: 0.01,
 gl: [['roads in the network'], ['roads kept', 'roads to close'], ['posts each', 'posts left over']]
}, {
 canonical: { deg: [3, 4, 2, 3, 3, 2, 3, 2], N: 365 },
 draw: R => { const g = plan(R, 7, 9, 9, 15, 0.4, (d, e) => e.length >= d.length + 1); let N; do { N = R.int(100, 500); } while (g && N % (g.v - 1) === 0);
  return g ? { deg: g.deg, N } : { deg: [3, 4, 2, 3, 3, 2, 3, 2], N: 365 }; },
 build: ({ deg, N }) => { const S = deg.reduce((t, x) => t + x, 0), E = S / 2, V = deg.length, cut = E - (V - 1), keep = V - 1, q = Math.floor(N / keep), r = N - keep * q; return {
  prompt: `The Road Office plans to cut the new depot network down to a tree to save tarmac. The network is connected, with junctions A to ${L(V - 1)} of degrees ${and(deg.map(n))}. Enter the number of roads in the network. Then enter the fewest roads to close so that a tree is left. The ${n(N)} reflector posts in stock are then shared equally among the roads that stay open, as many to each as possible: enter the number of posts left over.`,
  answer: [E, cut, r],
  hints: ['The handshake lemma turns the list of degrees into the number of roads.', 'A tree on a given number of junctions has one road fewer than that number, and the roads beyond that are closed. The posts left over are the remainder when the posts are divided by the number of roads that stay open.'],
  solution: `The degrees add up to ${n(S)}, so there are ${n(S)} ÷ 2 = ${n(E)} roads. A tree on ${n(V)} junctions keeps ${n(V)} − 1 = ${n(keep)} roads, so ${n(E)} − ${n(keep)} = ${n(cut)} roads close. ${n(N)} = ${n(keep)} × ${n(q)} + ${n(r)}, with ${n(r)} from 0 to ${n(keep - 1)}, so each open road gets ${n(q)} posts and ${n(r)} ${r === 1 ? 'is' : 'are'} left over.`,
  guidance: [
   { prompt: `The degrees add up to ${n(S)}. How many roads does the network have?`, answer: [E], explanation: `By the handshake lemma, ${n(S)} ÷ 2 = ${n(E)}.` },
   { prompt: `A tree on ${n(V)} junctions keeps how many roads, and so how many of the ${n(E)} roads close?`, answer: [keep, cut], explanation: `${n(V)} − 1 = ${n(keep)} roads stay, and ${n(E)} − ${n(keep)} = ${n(cut)} close.` },
   { prompt: `Share ${n(N)} posts among the ${n(keep)} roads that stay open. What are the quotient and the remainder of ${n(N)} on division by ${n(keep)}?`, answer: [q, r], explanation: `${n(keep)} × ${n(q)} = ${n(keep * q)}, and ${n(N)} − ${n(keep * q)} = ${n(r)}.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q38', title: 'The unfinished depot plan',
 brief: 'One degree on Mira’s depot plan has been smudged out, and she needs it recovered before she can say what route and what trimming the plan allows.',
 labels: ['missing degree', 'Euler code', 'roads to close'], tolerance: 0.01,
 gl: [['known degrees', 'missing degree'], ['odd degrees', 'Euler code'], ['roads to close']]
}, {
 canonical: { known: [3, 2, 4, 3, 2, 3, 2], E: 11 },
 draw: R => { const want = R.pick([0, 1, 2]); const g = plan(R, 7, 9, 9, 15, 0.4, (d, e) => eulerCode(oddCount(d)) === want && e.length >= d.length + 1 && d[d.length - 1] >= 2);
  return g ? { known: g.deg.slice(0, -1), E: g.edges.length } : { known: [3, 2, 4, 3, 2, 3, 2], E: 11 }; },
 build: ({ known, E }) => { const V = known.length + 1, K = known.reduce((t, x) => t + x, 0), x = 2 * E - K, deg = [...known, x], odd = oddCount(deg), code = eulerCode(odd), cut = E - (V - 1), last = L(V - 1), names = and(known.map((_, i) => L(i)));
  const oddNames = deg.map((d, i) => d % 2 ? L(i) : null).filter(Boolean);
  const verdict = odd === 0 ? 'Every degree is even, so the plan has an Euler circuit: code 2' : odd === 2 ? `Exactly two are odd, so it has an Euler path from ${oddNames[0]} to ${oddNames[1]} but no circuit: code 1` : 'More than two are odd, so it has neither an Euler path nor an Euler circuit: code 0';
  const which = odd === 0 ? 'No degree is odd' : `The odd degrees are at ${and(oddNames)}, ${n(odd)} in all`;
  return {
  prompt: `Mira’s unfinished depot plan is one connected network of ${n(V)} junctions, A to ${last}, with ${n(E)} roads. The degrees of ${names} are ${and(known.map(n))}, but the degree of ${last} has been smudged out. Enter the degree of ${last}. Then enter the Euler code of the finished plan (${CODES}). Last, enter the fewest roads to close so that what is left is a tree.`,
  answer: [x, code, cut],
  hints: ['The degrees of all the junctions add up to twice the number of roads. The missing degree is whatever the known degrees leave short of that total.', 'Once the missing degree is found, count the odd degrees to choose the Euler code. A tree on a given number of junctions has one road fewer than that number, and the roads beyond that are closed.'],
  solution: `${n(E)} roads give a degree total of 2 × ${n(E)} = ${n(2 * E)}. The known degrees add up to ${known.map(n).join(' + ')} = ${n(K)}, so ${last} has degree ${n(2 * E)} − ${n(K)} = ${n(x)}. ${which}. ${verdict}. A tree on ${n(V)} junctions keeps ${n(V)} − 1 = ${n(V - 1)} roads, so ${n(E)} − ${n(V - 1)} = ${n(cut)} roads close.`,
  guidance: [
   { prompt: `All ${n(V)} degrees add up to 2 × ${n(E)}. What do the known degrees add up to, and what is the degree of ${last}?`, answer: [K, x], explanation: `The known degrees give ${known.map(n).join(' + ')} = ${n(K)}, and 2 × ${n(E)} = ${n(2 * E)}, so ${last} has degree ${n(2 * E)} − ${n(K)} = ${n(x)}.` },
   { prompt: `Now all the degrees are known. How many are odd, and which Euler code fits: 2, 1 or 0?`, answer: [odd, code], explanation: `${which}. The plan is connected. ${verdict}.` },
   { prompt: `A tree on ${n(V)} junctions keeps ${n(V - 1)} roads. How many of the ${n(E)} roads must close?`, answer: [cut], explanation: `${n(E)} − ${n(V - 1)} = ${n(cut)}.` }
  ] }; }
});

})();
