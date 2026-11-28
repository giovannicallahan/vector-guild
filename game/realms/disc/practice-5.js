/* Discrete mathematics practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p5.js. */
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
/* Counting helpers. C(a, b) is "a choose b"; fact(a) is a!; Dr(a) is the number of derangements of a objects. */
const fact = a => { let f = 1; for (let i = 2; i <= a; i++) f *= i; return f; };
const C = (a, b) => (b < 0 || b > a) ? 0 : Math.round(fact(a) / (fact(b) * fact(a - b)));
const Dr = a => { let s = 0; for (let j = 0; j <= a; j++) s += (j % 2 ? -1 : 1) * fact(a) / fact(j); return s; };
const sub = k => String(k).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const sgn = v => v < 0 ? '−' : '+';
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const lead = (v, x) => `${v === 1 ? '' : n(v)}${x}`;
/* times(3, 'x') is '3 × x'; times(1, 'x') is 'x'. */
const times = (v, x) => v === 1 ? x : `${n(v)} × ${x}`;
const ways = v => v === 1 ? 'way' : 'ways';
const alt = vals => vals.map((v, i) => i === 0 ? n(v) : `${i % 2 ? '−' : '+'} ${n(v)}`).join(' ');
const GEAR = [['pair of gloves', 'pairs of gloves'], ['helmet', 'helmets'], ['pair of boots', 'pairs of boots'], ['headlamp', 'headlamps']];
const KIT = [['canister', 'canisters'], ['tool chest', 'tool chests'], ['fuel drum', 'fuel drums'], ['spare reel', 'spare reels']];
const NUM = ['', '', 'two', 'three', 'four', 'five'];
const caps = s => s[0].toUpperCase() + s.slice(1);
/* "3 × 32 − 3 × 1": terms {c, v} with alternating signs, the first one positive. */
const signed = ts => ts.map((t, j) => `${j ? (j % 2 ? '− ' : '+ ') : ''}${n(t.c)} × ${n(t.v)}`).join(' ');
/* Onto functions from N jobs to k targets: levels i = 1 … k − 1 with C(k, i) sets, each (k − i)ⁿ. */
const ontoInfo = (N, k) => { const ts = []; for (let i = 1; i < k; i++) ts.push({ i, c: C(k, i), b: k - i, v: Math.pow(k - i, N) });
 const miss = ts.reduce((s, t, j) => s + (j % 2 ? -1 : 1) * t.c * t.v, 0), total = Math.pow(k, N); return { ts, miss, total, onto: total - miss }; };
/* One sentence per level: job is what is handed out, tg and tgs the target (singular, plural). */
const ontoLevels = (ts, N, k, job, tg, tgs) => ts.map(t => t.i === 1
 ? `If one named ${tg} gets nothing, each ${job} has ${n(t.b)} ${t.b === 1 ? tg : tgs} left, so |Aᵢ| = ${n(t.b)}${sup(N)} = ${n(t.v)}, and there are ${n(t.c)} such sets.`
 : `If ${NUM[t.i]} named ${tgs} get nothing, each ${job} has ${n(t.b)} ${t.b === 1 ? tg : tgs} left: ${n(t.b)}${sup(N)} = ${n(t.v)} ${ways(t.v)}, for each of the C(${n(k)}, ${n(t.i)}) = ${n(t.c)} choices.`).join(' ');
/* Stars and bars with a limit: level i names i targets that go over the limit L. */
const capTerms = (N, k, L) => { const out = []; for (let i = 1; i <= k; i++) { const r = N - i * (L + 1); if (r < 0) break; out.push({ i, c: C(k, i), r, w: C(r + k - 1, k - 1) }); } return out; };
const capSum = (N, k, L) => { const ts = capTerms(N, k, L), total = C(N + k - 1, k - 1), over = ts.reduce((s, t, j) => s + (j % 2 ? -1 : 1) * t.c * t.w, 0); return { ts, total, over, ok: total - over }; };
const capSigned = ts => ts.map((t, j) => `${j ? (j % 2 ? '− ' : '+ ') : ''}${n(t.c)} × ${n(t.w)}`).join(' ');

/* ---- q21 Counting onto functions [Levin 1.6] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'Parts on the conveyors',
 brief: 'New parts are being fed onto the packing lines, and Mira will not run a plan that leaves a conveyor line empty.',
 labels: ['all ways', 'one named line empty', 'some line empty', 'onto ways'], tolerance: 0.01,
 gl: [['all ways'], ['one named line empty'], ['some line empty'], ['onto ways']]
}, {
 canonical: { N: 6, k: 3 },
 draw: R => { const [N, k] = R.pick([[3, 2], [4, 2], [5, 2], [6, 2], [6, 3], [3, 3], [4, 4], [5, 4], [6, 4], [7, 3]]); return { N, k }; },
 build: ({ N, k }) => { const { ts, miss, total, onto } = ontoInfo(N, k), one = ts[0];
  return {
  prompt: `Packing Floor conveyors: ${n(N)} different parts are each sent down one of ${n(k)} conveyor lines, and a line may carry several parts. Mira wants every line to carry at least one part, so the plan must be an onto function from the parts to the lines. Enter the number of ways with no condition, then the number of ways in which one named line carries nothing, then the number of ways in which at least one line carries nothing, then the number of onto plans. Type each count without commas.`,
  answer: [total, one.v, miss, onto],
  hints: [`Each part picks its line on its own, so multiply: ${n(k)} choices for the first part, ${n(k)} for the second, and so on.`, `With one named line out of use, every part has one line fewer to choose from. For the “at least one line empty” count, let Aᵢ be the plans that leave line i empty and add the one-line sets, take away the two-line overlaps, and so on.`],
  solution: `With no condition each of the ${n(N)} parts can go down any of the ${n(k)} lines, so there are ${n(k)}${sup(N)} = ${n(total)} plans. Let Aᵢ be the plans in which line i carries nothing. ${ontoLevels(ts, N, k, 'part', 'line', 'lines')} ${k === 2 ? 'Both lines' : `All ${n(k)} lines`} cannot be empty at once. By inclusion–exclusion, ${signed(ts)} = ${n(miss)} plans leave at least one line empty. The rest are onto: ${n(total)} − ${n(miss)} = ${n(onto)}.`,
  guidance: [
   { prompt: `How many ways can the ${n(N)} parts be sent down the ${n(k)} lines with no condition?`, answer: [total], explanation: `Each part has ${n(k)} choices and there are ${n(N)} parts, so ${n(k)}${sup(N)} = ${n(total)}.` },
   { prompt: `Take one named line out of use. How many plans send every part down the other ${n(k - 1)} ${k === 2 ? 'line' : 'lines'}?`, answer: [one.v], explanation: `Every part now has ${n(one.b)} ${one.b === 1 ? 'line' : 'lines'} to choose from, so ${n(one.b)}${sup(N)} = ${n(one.v)}.` },
   { prompt: `Use inclusion–exclusion over the ${n(k)} lines. How many plans leave at least one line empty?`, answer: [miss], explanation: `Add the one-line sets, take away the two-line overlaps, and so on: ${signed(ts)} = ${n(miss)}.` },
   { prompt: 'How many plans are onto, with every line carrying at least one part?', answer: [onto], explanation: `Take the bad plans away from all of them: ${n(total)} − ${n(miss)} = ${n(onto)}.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Night shift and a lead crew',
 brief: 'The night shift has a pile of repair tickets, every crew must get some, and one crew will be named to lead the shift.',
 labels: ['onto hand-outs', 'complete plans'], tolerance: 0.01,
 gl: [['some crew gets no ticket'], ['onto hand-outs'], ['complete plans']]
}, {
 canonical: { N: 5, k: 4 },
 draw: R => { const [N, k] = R.pick([[4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [4, 4], [5, 4], [6, 4], [7, 4]]); return { N, k }; },
 build: ({ N, k }) => { const { ts, miss, total, onto } = ontoInfo(N, k), plans = onto * k;
  return {
  prompt: `The night shift has ${n(N)} different repair tickets for ${n(k)} crews. Each ticket goes to one crew, and every crew must get at least one ticket. Once the tickets are handed out, Mira also names one of the ${n(k)} crews as the lead crew for the night. Enter the number of ways to hand out the tickets so that every crew gets one, then the number of complete plans, where a plan is a hand-out together with the lead crew. Type each count without commas.`,
  answer: [onto, plans],
  hints: [`The hand-out is a function from the tickets to the crews, and every crew getting a ticket makes it onto. Count the hand-outs that leave some crew idle, and take them away from all ${n(k)}${sup(N)} of them.`, 'The lead crew is chosen after the hand-out is settled, whatever it is, so the two choices are made one after the other.'],
  solution: `All hand-outs: ${n(k)}${sup(N)} = ${n(total)}. Let Aᵢ be the hand-outs in which crew i gets no ticket. ${ontoLevels(ts, N, k, 'ticket', 'crew', 'crews')} By inclusion–exclusion, ${signed(ts)} = ${n(miss)} hand-outs leave a crew idle, so ${n(total)} − ${n(miss)} = ${n(onto)} are onto. Each of them can be paired with any of the ${n(k)} crews as lead, and by the multiplicative principle there are ${n(onto)} × ${n(k)} = ${n(plans)} complete plans.`,
  guidance: [
   { prompt: `By inclusion–exclusion over the ${n(k)} crews, how many hand-outs leave at least one crew with no ticket?`, answer: [miss], explanation: `Level by level: ${signed(ts)} = ${n(miss)}.` },
   { prompt: `All hand-outs number ${n(k)}${sup(N)} = ${n(total)}. How many of them give every crew at least one ticket?`, answer: [onto], explanation: `${n(total)} − ${n(miss)} = ${n(onto)}.` },
   { prompt: `Each onto hand-out can be paired with any of the ${n(k)} crews as lead. How many complete plans are there?`, answer: [plans], explanation: `Multiplicative principle: ${n(onto)} × ${n(k)} = ${n(plans)}.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q08', title: 'Every dock in use',
 brief: 'A big delivery of different shipments is due, and the dock manager insists that every unloading dock handles at least one.',
 labels: ['two named docks empty', 'some dock empty', 'onto assignments'], tolerance: 0.01,
 gl: [['two named docks empty'], ['some dock empty'], ['all assignments', 'onto assignments']]
}, {
 canonical: { N: 7, k: 4 },
 draw: R => { const [N, k] = R.pick([[7, 4], [6, 5], [7, 5], [8, 4], [8, 3], [7, 3], [6, 4], [5, 5], [9, 3]]); return { N, k }; },
 build: ({ N, k }) => { const { ts, miss, total, onto } = ontoInfo(N, k), pair = Math.pow(k - 2, N);
  return {
  prompt: `Tonight ${n(N)} different shipments arrive, and each is unloaded at exactly one of ${n(k)} docks. Think of the assignment as a function from the shipments to the docks. The dock manager wants every dock to handle at least one shipment, which makes the function onto, as in the one-to-one and onto missions. Enter the number of assignments in which two named docks both handle nothing, then the number in which at least one dock handles nothing, then the number of onto assignments. Type each count without commas.`,
  answer: [pair, miss, onto],
  hints: [`With two named docks out of use, every shipment can go to only ${n(k - 2)} ${k === 3 ? 'dock' : 'docks'}. Raise that number to the number of shipments.`, `Let Aᵢ be the assignments that leave dock i unused. Count the one-dock sets, the two-dock overlaps and every level up to ${n(k - 1)} docks, with plus and minus signs taking turns. Then take the total away from all ${n(k)}${sup(N)} assignments.`],
  solution: `Let Aᵢ be the assignments in which dock i handles nothing. With two named docks unused, each shipment has ${n(k - 2)} ${k === 3 ? 'dock' : 'docks'} left, so there ${pair === 1 ? 'is' : 'are'} ${n(k - 2)}${sup(N)} = ${n(pair)} such ${pair === 1 ? 'assignment' : 'assignments'}. ${ontoLevels(ts, N, k, 'shipment', 'dock', 'docks')} All ${n(k)} docks cannot be unused at once. By inclusion–exclusion, ${signed(ts)} = ${n(miss)} assignments leave some dock unused. All the assignments number ${n(k)}${sup(N)} = ${n(total)}, so ${n(total)} − ${n(miss)} = ${n(onto)} are onto.`,
  guidance: [
   { prompt: `Leave two named docks unused. Every shipment then has ${n(k - 2)} ${k === 3 ? 'dock' : 'docks'} to go to. How many assignments are there?`, answer: [pair], explanation: `${n(k - 2)}${sup(N)} = ${n(pair)}.` },
   { prompt: `Use inclusion–exclusion over the ${n(k)} docks, up to the level of ${n(k - 1)} docks left out. How many assignments leave at least one dock unused?`, answer: [miss], explanation: `${signed(ts)} = ${n(miss)}.` },
   { prompt: `How many assignments are there with no condition, and how many of them are onto?`, answer: [total, onto], explanation: `With no condition ${n(k)}${sup(N)} = ${n(total)}. The onto ones are what is left after the bad ones: ${n(total)} − ${n(miss)} = ${n(onto)}.` }
  ] }; }
});

/* ---- q22 Derangements [Levin 1.6] ---- */

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Gloves back to the wrong hands',
 brief: 'Every packer left a pair of gloves in the bin by the door, and they were handed back blind, so Mira wants to know how often nobody gets their own.',
 labels: ['someone gets their own', 'nobody gets their own'], tolerance: 0.01,
 gl: [['both named packers get their own'], ['someone gets their own'], ['nobody gets their own']]
}, {
 canonical: { N: 6, w: 0 },
 draw: R => ({ N: R.pick([3, 4, 5, 6, 7]), w: R.int(0, GEAR.length - 1) }),
 build: ({ N, w }) => { const [one, many] = GEAR[w], f = fact(N), parts = []; for (let j = 1; j <= N; j++) parts.push(f / fact(j));
  const home = parts.reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v, 0), D = f - home, two = C(N, 2) * fact(N - 2);
  const listed = parts.map((v, j) => `${n(N)}! ÷ ${n(j + 1)}! = ${n(v)}`).join(', ');
  return {
  prompt: `${n(N)} packers each left a ${one} in the bin by the Packing Floor door, and every ${one} carries its owner’s name. The ${many} are handed back blind, one to each packer. Enter the number of ways of handing them back in which at least one packer gets their own ${one}, then the number in which nobody does. Type each count without commas.`,
  answer: [home, D],
  hints: [`Let Aᵢ be the hand-backs in which packer i gets their own ${one}. With j named packers sure to be right, the other ${many} can go back in any order.`, `Add the levels with signs taking turns: plus for one packer sure to be right, minus for two, and so on. The ways with nobody right are what is left of all ${n(N)}! hand-backs.`],
  solution: `All hand-backs number ${n(N)}! = ${n(f)}. Let Aᵢ be those in which packer i gets their own ${one}. Fixing j named packers leaves (${n(N)} − j)! orders of the rest, and there are C(${n(N)}, j) ways to name them, so level j is ${n(N)}! ÷ j!: ${listed}. At least one packer gets their own ${one} in ${alt(parts)} = ${n(home)} ways. Nobody does in ${n(f)} − ${n(home)} = ${n(D)} ways.`,
  guidance: [
   { prompt: `Two named packers both get their own ${many}. ${N - 2 === 1 ? `The last ${one} goes back to the last packer` : `The other ${n(N - 2)} ${many} go back in any order`}, and the two packers can be named in C(${n(N)}, 2) = ${n(C(N, 2))} ways. How many hand-backs does level 2 count?`, answer: [two], explanation: `${n(C(N, 2))} × ${n(N - 2)}! = ${n(C(N, 2))} × ${n(fact(N - 2))} = ${n(two)}, which is also ${n(N)}! ÷ 2!.` },
   { prompt: `By inclusion–exclusion, how many hand-backs give at least one packer their own ${one}?`, answer: [home], explanation: `Level j gives ${n(N)}! ÷ j!, with signs taking turns: ${alt(parts)} = ${n(home)}.` },
   { prompt: `How many hand-backs give nobody their own ${one}?`, answer: [D], explanation: `All hand-backs minus those with someone right: ${n(f)} − ${n(home)} = ${n(D)}.` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Two bays, no drum at home',
 brief: 'Two bays have been emptied for a check, and the check is passed only if no drum goes back to its own place in either bay.',
 labels: ['bay A all wrong', 'bay B all wrong', 'both bays all wrong'], tolerance: 0.01,
 gl: [['bay A all wrong'], ['bay B all wrong'], ['both bays all wrong']]
}, {
 canonical: { a: 4, b: 5 },
 draw: R => ({ a: R.int(3, 6), b: R.int(3, 6) }),
 build: ({ a, b }) => { const wk = m => { const parts = []; for (let j = 1; j <= m; j++) parts.push(fact(m) / fact(j)); const home = parts.reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v, 0); return { f: fact(m), parts, home, D: fact(m) - home }; };
  const A = wk(a), B = wk(b), both = A.D * B.D;
  return {
  prompt: `Packing Floor bay A has ${n(a)} labelled drums and bay B has ${n(b)} labelled drums. In each bay the drums were taken off their places for a check, and each drum has its own place with the same label. The drums are put back blind, one to a place within its own bay. The check passes only if no drum is back in its own place, in either bay. Enter the number of ways to put back bay A’s drums with no drum in its own place, then the same for bay B, then the number of ways to pass the check across both bays. Type each count without commas.`,
  answer: [A.D, B.D, both],
  hints: [`For one bay, let Aᵢ be the put-backs with drum i in its own place. Fixing j named drums leaves the rest in any order, so level j counts (number of drums in the bay)! ÷ j!. Take the ways with some drum home away from all the orders.`, 'The two bays are put back independently, whatever happens in the other one, so the ways for the two bays are combined with the multiplicative principle.'],
  solution: `Bay A: ${n(a)}! = ${n(A.f)} orders in all. Level j of inclusion–exclusion is ${n(a)}! ÷ j!, so some drum is home in ${alt(A.parts)} = ${n(A.home)} ways, and no drum is home in ${n(A.f)} − ${n(A.home)} = ${n(A.D)} ways. Bay B: ${n(b)}! = ${n(B.f)} orders in all; some drum is home in ${alt(B.parts)} = ${n(B.home)} ways, and no drum is home in ${n(B.f)} − ${n(B.home)} = ${n(B.D)} ways. The bays are independent, so ${n(A.D)} × ${n(B.D)} = ${n(both)} ways pass the check.`,
  guidance: [
   { prompt: `For bay A, count the ways with some drum home by inclusion–exclusion and take them from ${n(a)}! = ${n(A.f)}. How many ways leave no drum in its own place?`, answer: [A.D], explanation: `Some drum is home in ${alt(A.parts)} = ${n(A.home)} ways, so ${n(A.f)} − ${n(A.home)} = ${n(A.D)}.` },
   { prompt: `Do the same for bay B, with ${n(b)}! = ${n(B.f)} orders in all. How many ways leave no drum in its own place?`, answer: [B.D], explanation: `Some drum is home in ${alt(B.parts)} = ${n(B.home)} ways, so ${n(B.f)} − ${n(B.home)} = ${n(B.D)}.` },
   { prompt: 'The bays are put back independently. In how many ways do both bays pass?', answer: [both], explanation: `Multiplicative principle: ${n(A.D)} × ${n(B.D)} = ${n(both)}.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q14', title: 'Exactly two at home',
 brief: 'After a mix-up in the racks the supervisor wants to know how many ways leave exactly two items in their own places.',
 labels: ['ways to pick the two at home', 'ways the rest are all wrong', 'ways with exactly two at home'], tolerance: 0.01,
 gl: [['ways to pick the two'], ['ways the rest are all wrong'], ['ways with exactly two at home']]
}, {
 canonical: { N: 7, w: 0 },
 draw: R => ({ N: R.int(5, 8), w: R.int(0, KIT.length - 1) }),
 build: ({ N, w }) => { const [one, many] = KIT[w], pick = C(N, 2), rest = Dr(N - 2), total = pick * rest, parts = []; for (let j = 1; j <= N - 2; j++) parts.push(fact(N - 2) / fact(j));
  return {
  prompt: `${n(N)} labelled ${many} stand in ${n(N)} racks with matching labels, and each ${one} has its own rack. After a mix-up the ${many} are put back blind, one to a rack. Count the ways in which exactly two ${many} end up in their own racks, and every other ${one} is in a wrong rack. Enter the number of ways to pick which two ${many} are at home, then the number of ways the other ${n(N - 2)} ${many} can all go to wrong racks, then the number of ways with exactly two at home. Type each count without commas.`,
  answer: [pick, rest, total],
  hints: [`Choosing which two ${many} are at home is a selection with no order, the same as choosing a crew of two.`, `Once the two are at home, the other ${n(N - 2)} ${many} and their racks form a smaller problem of the same kind: no ${one} in its own rack. Use inclusion–exclusion on those ${n(N - 2)}.`],
  solution: `Choose the two ${many} that stay home: C(${n(N)}, 2) = ${n(pick)} ways. The other ${n(N - 2)} ${many} must all be in wrong racks. There are ${n(N - 2)}! = ${n(fact(N - 2))} orders in all, and some ${one} is home in ${alt(parts)} = ${n(fact(N - 2) - rest)} of them, so ${n(fact(N - 2))} − ${n(fact(N - 2) - rest)} = ${n(rest)} orders have no ${one} home. The two choices are made one after the other: ${n(pick)} × ${n(rest)} = ${n(total)}.`,
  guidance: [
   { prompt: `In how many ways can the two ${many} that stay home be chosen from the ${n(N)}?`, answer: [pick], explanation: `Order does not matter, so C(${n(N)}, 2) = ${n(pick)}.` },
   { prompt: `The other ${n(N - 2)} ${many} must all go to wrong racks. By inclusion–exclusion, in how many ways can that be done?`, answer: [rest], explanation: `${n(N - 2)}! = ${n(fact(N - 2))} orders in all; some ${one} is home in ${alt(parts)} = ${n(fact(N - 2) - rest)} of them; ${n(fact(N - 2))} − ${n(fact(N - 2) - rest)} = ${n(rest)}.` },
   { prompt: `Combine the two choices. In how many ways are exactly two ${many} in their own racks?`, answer: [total], explanation: `${n(pick)} × ${n(rest)} = ${n(total)}.` }
  ] }; }
});

/* ---- q23 Chapter review: packing under rules [Levin 1.5, 1.6] ---- */

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Battery packs on the rovers',
 brief: 'Spare battery packs are going out to the survey rovers, and each rover’s rack holds only so many.',
 labels: ['one named rover over', 'some rover over', 'every rover within the limit'], tolerance: 0.01,
 gl: [['one named rover over'], ['some rover over'], ['every rover within the limit']]
}, {
 canonical: { N: 11, k: 3, L: 5 },
 draw: R => { let p; do { const k = R.pick([3, 4]), L = R.int(3, 6); p = { N: R.int(L + 2, k * L - 1), k, L }; }
  while (C(p.N + p.k - 1, p.k - 1) >= 1000 || (p.N === 12 && p.k === 4 && p.L === 5) || (p.N === 10 && p.k === 3 && p.L === 4)); return p; },
 build: ({ N, k, L }) => { const { ts, total, over, ok } = capSum(N, k, L), one = ts[0];
  const levels = ts.map(t => t.i === 1
   ? `One named rover over the limit: give it ${n(L + 1)} first and share the other ${n(t.r)} freely, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ways, for each of the ${n(k)} rovers.`
   : `${caps(NUM[t.i])} named rovers over the limit: give each ${n(L + 1)} first and share the other ${n(t.r)}, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ${ways(t.w)}, for each of the C(${n(k)}, ${n(t.i)}) = ${n(t.c)} choices.`).join(' ');
  const next = ts.length + 1, stop = next <= k ? ` ${caps(NUM[next])} rovers cannot ${next === 2 ? 'both' : 'all'} be over the limit, because that needs ${n(next * (L + 1))} packs.` : '';
  return {
  prompt: `${n(N)} identical battery packs are to be shared among ${n(k)} survey rovers, and a rover may get none. Each rover’s rack holds at most ${n(L)} packs. Enter the number of ways to share the packs in which one named rover gets more than ${n(L)}, then the number of ways in which at least one rover gets more than ${n(L)}, then the number of ways in which every rover gets at most ${n(L)}. Type each count without commas.`,
  answer: [one.w, over, ok],
  hints: [`A rover that gets more than ${n(L)} gets at least ${n(L + 1)}. Hand ${n(L + 1)} packs to the named rover first, then share what is left among all ${n(k)} rovers with no limit: stars and bars.`, `For the second count do the same for two named rovers, three, and so on, and combine the levels with signs taking turns. The last count needs all the ways with no limit, which is stars and bars with ${n(N)} stars and ${n(k - 1)} bars.`],
  solution: `${levels}${stop} By inclusion–exclusion, ${capSigned(ts)} = ${n(over)} ways give some rover more than ${n(L)}. With no limit there are C(${n(N + k - 1)}, ${n(k - 1)}) = ${n(total)} ways, so ${n(total)} − ${n(over)} = ${n(ok)} ways keep every rover at most ${n(L)}.`,
  guidance: [
   { prompt: `Give one named rover ${n(L + 1)} packs first and share the remaining ${n(one.r)} among the ${n(k)} rovers with no limit. In how many ways can that be done?`, answer: [one.w], explanation: `${n(one.r)} stars and ${n(k - 1)} bars: C(${n(one.r + k - 1)}, ${n(k - 1)}) = ${n(one.w)}.` },
   { prompt: `By inclusion–exclusion over the ${n(k)} rovers, in how many ways does at least one rover get more than ${n(L)}?`, answer: [over], explanation: `${capSigned(ts)} = ${n(over)}.` },
   { prompt: `With no limit there are C(${n(N + k - 1)}, ${n(k - 1)}) = ${n(total)} ways. In how many ways does every rover get at most ${n(L)}?`, answer: [ok], explanation: `${n(total)} − ${n(over)} = ${n(ok)}.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'At least one, at most a few',
 brief: 'Every dome must get some crates but none can take more than its store holds, so the plan has a floor and a ceiling.',
 labels: ['crates left over', 'plans pushing a dome over', 'plans within both rules'], tolerance: 0.01,
 gl: [['crates left over'], ['no upper limit'], ['some dome over', 'within both rules']]
}, {
 canonical: { N: 13, k: 4, L: 4 },
 draw: R => { let p; do { const k = R.pick([3, 4]), L = R.int(3, 5); p = { N: R.int(k + L, k * L - 1), k, L }; }
  while (C(p.N - p.k + p.k - 1, p.k - 1) >= 1000 || (p.N === 13 && p.k === 4 && p.L === 4 && false)); return p; },
 build: ({ N, k, L }) => { const M = N - k, { ts, total, over, ok } = capSum(M, k, L - 1), one = ts[0];
  const levels = ts.map(t => t.i === 1
   ? `One named dome over: it needs ${n(L)} of the ${n(M)} spare crates first, and the other ${n(t.r)} ${t.r === 1 ? 'is' : 'are'} shared freely, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ${ways(t.w)}, for each of the ${n(k)} domes.`
   : `${caps(NUM[t.i])} named domes over: each takes ${n(L)} spare crates first, and the other ${n(t.r)} ${t.r === 1 ? 'is' : 'are'} shared freely, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ${ways(t.w)}, for each of the C(${n(k)}, ${n(t.i)}) = ${n(t.c)} choices.`).join(' ');
  return {
  prompt: `Mira has ${n(N)} identical crates to share among ${n(k)} domes. Every dome must get at least 1 crate, and each dome’s store holds at most ${n(L)}. Enter the number of crates left once every dome has been given its first crate. Then, sharing out those left-over crates freely, enter the number of ways in which some dome ends up with more than ${n(L)} crates in all, and the number of ways in which every dome ends up with between 1 and ${n(L)} crates. Type each count without commas.`,
  answer: [M, over, ok],
  hints: [`Give every dome its first crate at once, so the “at least 1” rule is already met. Only the left-over crates are then shared, and any dome may get none of them.`, `A dome ends with more than ${n(L)} crates in all when it gets at least ${n(L)} of the left-over ones. Hand those to one named dome first, share the rest with stars and bars, and combine the levels by inclusion–exclusion. Take the result from all the free shares of the left-over crates.`],
  solution: `Give every dome 1 crate first: ${n(N)} − ${n(k)} = ${n(M)} crates are left to share freely among the ${n(k)} domes. With no limit that is stars and bars: C(${n(M + k - 1)}, ${n(k - 1)}) = ${n(total)} ways. A dome holds more than ${n(L)} in all if it gets at least ${n(L)} of the left-over crates. ${levels} By inclusion–exclusion, ${capSigned(ts)} = ${n(over)} ways push some dome over. The plans within both rules number ${n(total)} − ${n(over)} = ${n(ok)}.`,
  guidance: [
   { prompt: `Give each of the ${n(k)} domes its first crate. How many of the ${n(N)} crates are left to share?`, answer: [M], explanation: `${n(N)} − ${n(k)} = ${n(M)}.` },
   { prompt: `Share the ${n(M)} left-over crates among the ${n(k)} domes with no limit; a dome may get none. In how many ways can that be done?`, answer: [total], explanation: `Stars and bars: ${n(M)} stars and ${n(k - 1)} bars, C(${n(M + k - 1)}, ${n(k - 1)}) = ${n(total)}.` },
   { prompt: `By inclusion–exclusion, in how many of these shares does some dome end with more than ${n(L)} crates in all, and in how many does every dome end with between 1 and ${n(L)}?`, answer: [over, ok], explanation: `${capSigned(ts)} = ${n(over)} shares push a dome over, and ${n(total)} − ${n(over)} = ${n(ok)} keep every dome within both rules.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q14', title: 'Five stores, tight limits',
 brief: 'A larger convoy is going out to five domes with very small stores, and Mira needs to know how many ways the load can be split without an overflow.',
 labels: ['pairs of domes over', 'some dome over', 'every dome within the limit'], tolerance: 0.01,
 gl: [['one named dome over'], ['pairs of domes', 'two named domes over'], ['some dome over'], ['every dome within the limit']]
}, {
 canonical: { N: 13, k: 5, L: 3 },
 draw: R => { let p; do { const k = R.pick([4, 5]), L = R.int(2, 4); p = { N: R.int(2 * (L + 1), k * L - 1), k, L }; }
  while (C(p.N + p.k - 1, p.k - 1) >= 20000); return p; },
 build: ({ N, k, L }) => { const { ts, total, over, ok } = capSum(N, k, L), one = ts[0], two = ts[1], lvl2 = two.c * two.w;
  const levels = ts.map(t => t.i === 1
   ? `One named dome over the limit: give it ${n(L + 1)} first and share the other ${n(t.r)} freely, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ways, for each of the ${n(k)} domes.`
   : `${caps(NUM[t.i])} named domes over the limit: give each ${n(L + 1)} first and share the other ${n(t.r)}, C(${n(t.r + k - 1)}, ${n(k - 1)}) = ${n(t.w)} ${ways(t.w)}, for each of the C(${n(k)}, ${n(t.i)}) = ${n(t.c)} choices.`).join(' ');
  const next = ts.length + 1, stop = next <= k ? ` ${caps(NUM[next])} domes cannot ${next === 2 ? 'both' : 'all'} be over the limit, because that needs ${n(next * (L + 1))} crates.` : '';
  return {
  prompt: `Mira has ${n(N)} identical crates to share among ${n(k)} domes, and a dome may get none. Each dome’s store holds at most ${n(L)} crates, so a dome is over the limit when it gets more than ${n(L)}. First, for each pair of domes, count the ways in which both domes of that pair are over the limit (the other domes may be over too), and enter the total of these counts over all the pairs. Then enter the number of ways in which at least one dome gets more than ${n(L)}, then the number of ways in which every dome gets at most ${n(L)}. Type each count without commas.`,
  answer: [lvl2, over, ok],
  hints: [`Choosing which two domes are over is a selection with no order, the same as choosing a crew of two. For one chosen pair, hand each of the two ${n(L + 1)} crates first and share the rest with no limit.`, `The first count is the level-2 term of inclusion–exclusion. For the second, work out every level that fits in ${n(N)} crates, with plus and minus taking turns. For the third, all the free shares are stars and bars with ${n(N)} stars and ${n(k - 1)} bars.`],
  solution: `${levels}${stop} The level with two domes over has ${n(two.c)} pairs, each with ${n(two.w)} ${ways(two.w)}: ${n(two.c)} × ${n(two.w)} = ${n(lvl2)}. By inclusion–exclusion, ${capSigned(ts)} = ${n(over)} ways give some dome more than ${n(L)}. With no limit there are C(${n(N + k - 1)}, ${n(k - 1)}) = ${n(total)} ways, so ${n(total)} − ${n(over)} = ${n(ok)} ways keep every dome at most ${n(L)}.`,
  guidance: [
   { prompt: `Give one named dome ${n(L + 1)} crates first and share the remaining ${n(one.r)} among the ${n(k)} domes with no limit. In how many ways can that be done?`, answer: [one.w], explanation: `${n(one.r)} stars and ${n(k - 1)} bars: C(${n(one.r + k - 1)}, ${n(k - 1)}) = ${n(one.w)}.` },
   { prompt: `How many pairs of domes can be chosen from the ${n(k)}, and in how many ways can the crates be shared when one named pair are both over the limit?`, answer: [two.c, two.w], explanation: `C(${n(k)}, 2) = ${n(two.c)} pairs. For one pair give each ${n(L + 1)} first and share the other ${n(two.r)}: C(${n(two.r + k - 1)}, ${n(k - 1)}) = ${n(two.w)}. Over all pairs that is ${n(two.c)} × ${n(two.w)} = ${n(lvl2)}.` },
   { prompt: `By inclusion–exclusion over every level that fits, in how many ways does at least one dome get more than ${n(L)}?`, answer: [over], explanation: `${capSigned(ts)} = ${n(over)}.` },
   { prompt: `With no limit there are C(${n(N + k - 1)}, ${n(k - 1)}) = ${n(total)} ways. In how many ways does every dome get at most ${n(L)}?`, answer: [ok], explanation: `${n(total)} − ${n(over)} = ${n(ok)}.` }
  ] }; }
});

/* ---- q24 Sequences: closed and recursive formulas [Levin 2.1] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The battery log and the doubling count',
 brief: 'The yard keeps a log of charged cells by a recursive rule, and a second log that grows by powers of two.',
 labels: ['a₄', 'b₆'], tolerance: 0.01,
 gl: [['a₁', 'a₂'], ['a₃', 'a₄'], ['b₆']]
}, {
 canonical: { s: 3, c: 2, d: 5, p: 3, q: -4 },
 draw: R => { let p, ok; do { p = { s: R.int(1, 6), c: R.int(2, 3), d: R.except(-3, 5, [0]), p: R.int(1, 4), q: R.except(-6, 8, [0]) };
   const a = [p.s]; for (let k = 1; k <= 4; k++) a.push(p.c * a[k - 1] + p.d); ok = a.every(v => v > 0); } while (!ok); return p; },
 build: ({ s, c, d, p, q }) => { const a = [s]; for (let k = 1; k <= 4; k++) a.push(c * a[k - 1] + d); const b6 = 64 * p + q;
  const step = k => `a${sub(k)} = ${n(c)} × ${n(a[k - 1])} ${cst(d)} = ${n(a[k])}`;
  return {
  prompt: `The Stock Yard keeps two logs of charged cells. Log A has a recursive definition: a₀ = ${n(s)} and aₙ = ${n(c)}aₙ₋₁ ${cst(d)} for n ≥ 1, counting from week 0. Log B has a closed formula: bₙ = ${times(p, '2ⁿ')} ${cst(q)}. Enter a₄, then b₆.`,
  answer: [a[4], b6],
  hints: [`The list starts at a₀ = ${n(s)}, so the first use of the rule gives a₁, not a₂. Use the rule once for each step up to a₄.`, 'For b₆ put n = 6 into the formula for bₙ, remembering that 2⁶ means 2 multiplied by itself 6 times. No earlier terms are needed.'],
  solution: `${step(1)}, ${step(2)}, ${step(3)} and ${step(4)}. For log B, 2⁶ = 64, so b₆ = ${times(p, '64')} ${cst(q)} = ${n(64 * p)} ${cst(q)} = ${n(b6)}.`,
  guidance: [
   { prompt: `Start from a₀ = ${n(s)} and use the rule aₙ = ${n(c)}aₙ₋₁ ${cst(d)} twice. What are a₁ and a₂?`, answer: [a[1], a[2]], explanation: `${step(1)} and ${step(2)}.` },
   { prompt: 'Keep going. What are a₃ and a₄?', answer: [a[3], a[4]], explanation: `${step(3)} and ${step(4)}.` },
   { prompt: `Put n = 6 into bₙ = ${times(p, '2ⁿ')} ${cst(q)}. What is b₆?`, answer: [b6], explanation: `2⁶ = 64, so b₆ = ${times(p, '64')} ${cst(q)} = ${n(b6)}. The closed formula needs no earlier terms.` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Which stack is ahead',
 brief: 'Two stacks of fittings are growing under different rules, and Mira wants to know how far ahead the first one is in a given week.',
 labels: ['stack A', 'stack B', 'how many more in A'], tolerance: 0.01,
 gl: [['a₂', 'a₃'], ['stack A'], ['stack B', 'how many more in A']]
}, {
 canonical: { s: 3, c: 2, d: 1, p: 1, r: 4, N: 4 },
 draw: R => { let p, ok; do { p = { s: R.int(2, 6), c: R.int(2, 3), d: R.int(1, 4), p: R.int(1, 3), r: R.int(2, 8), N: R.int(4, 6) };
   const a = [0, p.s]; for (let k = 2; k <= p.N; k++) a.push(p.c * a[k - 1] + p.d); ok = a[p.N] > p.p * p.N * p.N + p.r; } while (!ok); return p; },
 build: ({ s, c, d, p, r, N }) => { const a = [0, s]; for (let k = 2; k <= N; k++) a.push(c * a[k - 1] + d); const b = p * N * N + r, gap = a[N] - b;
  const step = k => `a${sub(k)} = ${n(c)} × ${n(a[k - 1])} + ${n(d)} = ${n(a[k])}`;
  const run = []; for (let k = 2; k <= N; k++) run.push(step(k));
  return {
  prompt: `In the Stock Yard, stack A holds ${n(s)} fittings in week 1. After that each week’s stack is ${n(c)} times the week before, plus ${n(d)} new ${d === 1 ? 'fitting' : 'fittings'}. Stack B follows the closed formula bₙ = ${lead(p, 'n²')} ${cst(r)}, where n is the week number. Enter the number of fittings in stack A in week ${n(N)}, then in stack B in week ${n(N)}, then how many more fittings stack A holds than stack B in week ${n(N)}. Type each without commas.`,
  answer: [a[N], b, gap],
  hints: [`Write the rule for stack A as aₙ = ${n(c)}aₙ₋₁ + ${n(d)}, with a₁ = ${n(s)}. It needs every earlier week, so climb from week 1 one week at a time.`, `For stack B put n = ${n(N)} straight into the formula. The last answer is a subtraction, A minus B.`],
  solution: `Stack A: ${run.join(', ')}. Stack B: b${sub(N)} = ${times(p, `${n(N)}²`)} ${cst(r)} = ${n(p * N * N)} ${cst(r)} = ${n(b)}. Stack A has ${n(a[N])} − ${n(b)} = ${n(gap)} more fittings in week ${n(N)}.`,
  guidance: [
   { prompt: `Use aₙ = ${n(c)}aₙ₋₁ + ${n(d)} from a₁ = ${n(s)}. What are a₂ and a₃?`, answer: [a[2], a[3]], explanation: `${step(2)} and ${step(3)}.` },
   { prompt: `Keep going until week ${n(N)}. What is a${sub(N)}, the stack A count in week ${n(N)}?`, answer: [a[N]], explanation: `${run.join(', ')}.` },
   { prompt: `Put n = ${n(N)} into bₙ = ${lead(p, 'n²')} ${cst(r)} for stack B. Then take it from stack A. What are b${sub(N)} and the difference?`, answer: [b, gap], explanation: `b${sub(N)} = ${times(p, `${n(N)}²`)} ${cst(r)} = ${n(b)}, and ${n(a[N])} − ${n(b)} = ${n(gap)}.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', title: 'Seven weeks and a cubic',
 brief: 'The yard needs far-ahead figures from two stock rules, one that has to be climbed week by week and one that can be jumped straight to.',
 labels: ['a₇', 'b₁₂'], tolerance: 0.01,
 gl: [['a₂', 'a₃', 'a₄'], ['a₅', 'a₆', 'a₇'], ['b₁₂']]
}, {
 canonical: { s: 4, c: 3, d: -2, p: 2, q: -5 },
 draw: R => { let p, ok; do { p = { s: R.int(2, 6), c: R.int(2, 3), d: R.except(-4, 5, [0]), p: R.int(1, 4), q: R.except(-9, 9, [0]) };
   const a = [0, p.s]; for (let k = 2; k <= 7; k++) a.push(p.c * a[k - 1] + p.d); ok = a.slice(1).every(v => v > 0); } while (!ok); return p; },
 build: ({ s, c, d, p, q }) => { const a = [0, s]; for (let k = 2; k <= 7; k++) a.push(c * a[k - 1] + d); const b12 = 1728 * p + 12 * q;
  const step = k => `a${sub(k)} = ${n(c)} × ${n(a[k - 1])} ${cst(d)} = ${n(a[k])}`;
  return {
  prompt: `Two stock rules are pinned up in the Stock Yard, and Mira needs figures far down the list. Rule A is recursive: a₁ = ${n(s)} and aₙ = ${n(c)}aₙ₋₁ ${cst(d)} for n ≥ 2. Rule B is closed: bₙ = ${lead(p, 'n³')} ${trm(q, 'n')}. Enter a₇, then b₁₂. Type each without commas.`,
  answer: [a[7], b12],
  hints: [`Rule A needs every earlier term, so climb from a₁ = ${n(s)}: a₂ first, then a₃, and so on, six uses of the rule in all.`, `For b₁₂ put n = 12 into the formula for bₙ. Work out 12³ as 12 × 12 × 12 first${p === 1 ? '' : `, then multiply by ${n(p)}`}.`],
  solution: `${step(2)}, ${step(3)}, ${step(4)}, ${step(5)}, ${step(6)} and ${step(7)}. For rule B, 12³ = 1728, so b₁₂ = ${times(p, '1728')} ${sgn(q)} ${times(Math.abs(q), '12')} = ${n(1728 * p)} ${cst(12 * q)} = ${n(b12)}.`,
  guidance: [
   { prompt: `Use the rule aₙ = ${n(c)}aₙ₋₁ ${cst(d)} from a₁ = ${n(s)}. What are a₂, a₃ and a₄?`, answer: [a[2], a[3], a[4]], explanation: `${step(2)}, ${step(3)} and ${step(4)}.` },
   { prompt: 'Keep going. What are a₅, a₆ and a₇?', answer: [a[5], a[6], a[7]], explanation: `${step(5)}, ${step(6)} and ${step(7)}.` },
   { prompt: `Put n = 12 into bₙ = ${lead(p, 'n³')} ${trm(q, 'n')}. What is b₁₂?`, answer: [b12], explanation: `12³ = 1728, so b₁₂ = ${times(p, '1728')} ${sgn(q)} ${times(Math.abs(q), '12')} = ${n(b12)}. The closed formula needs no earlier terms.` }
  ] }; }
});

/* ---- q25 Arithmetic sequences and their sums [Levin 2.2] ---- */

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'Sealant running down',
 brief: 'Sealant is being used up a little more slowly each day, and the yard needs the last day’s use and the total over the whole run.',
 labels: ['use on the last day', 'total used'], tolerance: 0.01,
 gl: [['steps', 'use on the last day'], ['first plus last'], ['total used']]
}, {
 canonical: { a: 60, d: 4, N: 9 },
 draw: R => { let p; do { const d = R.int(2, 7), N = R.int(7, 14); p = { a: (N - 1) * d + R.int(3, 20), d, N }; } while (p.a === 60 && p.d === 4 && p.N === 9); return p; },
 build: ({ a, d, N }) => { const last = a - (N - 1) * d, pair = a + last, S = N * pair / 2;
  return {
  prompt: `A drum of pipe sealant is shared out at the Stock Yard for ${n(N)} days. On day 1 the crew uses ${n(a)} litres, and each day after that they use ${n(d)} litres less than the day before. Enter the number of litres used on day ${n(N)}, then the total number of litres used over the ${n(N)} days. Type each without commas.`,
  answer: [last, S],
  hints: [`The use goes down by the same amount each day, so it is an arithmetic sequence with a common difference of −${n(d)}. Day ${n(N)} is ${n(N - 1)} steps after day 1.`, 'For the total, add the first and the last day’s use, multiply by the number of days and halve.'],
  solution: `The daily use is an arithmetic sequence with a₁ = ${n(a)} and common difference −${n(d)}, so a${sub(N)} = ${n(a)} − ${n(N - 1)} × ${n(d)} = ${n(a)} − ${n((N - 1) * d)} = ${n(last)} litres. The total over ${n(N)} days is ${n(N)} × (${n(a)} + ${n(last)}) ÷ 2 = ${n(N)} × ${n(pair)} ÷ 2 = ${n(S)} litres.`,
  guidance: [
   { prompt: `How many steps lie between day 1 and day ${n(N)}, and how many litres are used on day ${n(N)}? Each step takes ${n(d)} litres off.`, answer: [N - 1, last], explanation: `${n(N - 1)} steps, so ${n(a)} − ${n(N - 1)} × ${n(d)} = ${n(last)}.` },
   { prompt: `What is the first day’s use plus the last, ${n(a)} + ${n(last)}?`, answer: [pair], explanation: `${n(a)} + ${n(last)} = ${n(pair)}. Every first-and-last, second-and-second-to-last pair adds to the same total.` },
   { prompt: `Multiply by the number of days and halve: ${n(N)} × ${n(pair)} ÷ 2. What is the total?`, answer: [S], explanation: `${n(N)} × ${n(pair)} = ${n(N * pair)}, and half of that is ${n(S)} litres.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Until the order is big enough',
 brief: 'Deliveries keep growing by the same step, and the yard wants to know when one first reaches the size of a full load.',
 labels: ['the week', 'total delivered'], tolerance: 0.01,
 gl: [['steps', 'the week'], ['first plus last'], ['total delivered']]
}, {
 canonical: { a: 9, d: 7, n: 11 },
 draw: R => ({ a: R.int(4, 20), d: R.int(3, 9), n: R.int(8, 16) }),
 build: ({ a, d, n: wk }) => { const T = a + (wk - 1) * d, pair = a + T, S = wk * pair / 2;
  return {
  prompt: `Pipe deliveries to the Stock Yard start at ${n(a)} pipes in week 1, and each week’s delivery is ${n(d)} pipes more than the week before. The yard counts a delivery as a full load once it reaches ${n(T)} pipes. Enter the number of the week in which the delivery first reaches a full load, then the total number of pipes delivered from week 1 up to and including that week. Type each without commas.`,
  answer: [wk, S],
  hints: ['Each step adds the same number of pipes, so the gap from the first delivery to a full load is a whole number of steps. Divide the gap by the size of a step. The week is one more than the number of steps.', 'For the total, add the first and the last delivery, multiply by the number of weeks and halve.'],
  solution: `The gap from ${n(a)} to ${n(T)} is ${n(T - a)} pipes, and each step adds ${n(d)}, so there are ${n(T - a)} ÷ ${n(d)} = ${n(wk - 1)} steps. Week 1 is the start, so the full load comes in week ${n(wk)}. The total is ${n(wk)} × (${n(a)} + ${n(T)}) ÷ 2 = ${n(wk)} × ${n(pair)} ÷ 2 = ${n(S)} pipes.`,
  guidance: [
   { prompt: `How many steps of ${n(d)} take the delivery from ${n(a)} up to ${n(T)}, and so which week is that?`, answer: [wk - 1, wk], explanation: `${n(T)} − ${n(a)} = ${n(T - a)}, and ${n(T - a)} ÷ ${n(d)} = ${n(wk - 1)} steps. Week ${n(wk)} is ${n(wk - 1)} steps after week 1.` },
   { prompt: `What is the first delivery plus the last, ${n(a)} + ${n(T)}?`, answer: [pair], explanation: `${n(a)} + ${n(T)} = ${n(pair)}.` },
   { prompt: `Multiply by the number of weeks and halve: ${n(wk)} × ${n(pair)} ÷ 2. What is the total?`, answer: [S], explanation: `${n(wk)} × ${n(pair)} = ${n(wk * pair)}, and half of that is ${n(S)} pipes.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', title: 'The audit window',
 brief: 'An auditor will check only a stretch of weeks in the middle of a long delivery run, and needs the figures for that stretch alone.',
 labels: ['first week of the audit', 'last week of the audit', 'total over the audit'], tolerance: 0.01,
 gl: [['first week of the audit', 'last week of the audit'], ['weeks in the audit', 'first plus last'], ['total over the audit']]
}, {
 canonical: { a: 12, d: 7, P: 15, N: 38 },
 draw: R => { const N = R.int(25, 40); return { a: R.int(5, 30), d: R.int(2, 12), P: R.int(10, N - 8), N }; },
 build: ({ a, d, P, N }) => { const first = a + (P - 1) * d, last = a + (N - 1) * d, cnt = N - P + 1, pair = first + last, S = cnt * pair / 2;
  return {
  prompt: `The Stock Yard’s delivery run starts at ${n(a)} pipes in week 1, and each week’s delivery is ${n(d)} pipes more than the week before. An auditor checks only weeks ${n(P)} to ${n(N)}, both included. Enter the delivery in week ${n(P)}, then the delivery in week ${n(N)}, then the total number of pipes delivered over weeks ${n(P)} to ${n(N)}. Type each without commas.`,
  answer: [first, last, S],
  hints: [`Week ${n(P)} is ${n(P - 1)} steps after week 1, and week ${n(N)} is ${n(N - 1)} steps after week 1.`, 'The weeks of the audit are themselves an arithmetic sequence: it starts at the audit’s first delivery and ends at its last. Count how many weeks that is, then use the pairing shortcut on those weeks only.'],
  solution: `Week ${n(P)}: ${n(a)} + ${n(P - 1)} × ${n(d)} = ${n(first)} pipes. Week ${n(N)}: ${n(a)} + ${n(N - 1)} × ${n(d)} = ${n(last)} pipes. The audit covers weeks ${n(P)} to ${n(N)}, which is ${n(N)} − ${n(P)} + 1 = ${n(cnt)} weeks. Their total is ${n(cnt)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(cnt)} × ${n(pair)} ÷ 2 = ${n(S)} pipes.`,
  guidance: [
   { prompt: `What are the deliveries in week ${n(P)} and in week ${n(N)}?`, answer: [first, last], explanation: `Week ${n(P)}: ${n(a)} + ${n(P - 1)} × ${n(d)} = ${n(first)}. Week ${n(N)}: ${n(a)} + ${n(N - 1)} × ${n(d)} = ${n(last)}.` },
   { prompt: `How many weeks does the audit cover, counting both ends? And what is the first audit delivery plus the last, ${n(first)} + ${n(last)}?`, answer: [cnt, pair], explanation: `${n(N)} − ${n(P)} + 1 = ${n(cnt)} weeks, and ${n(first)} + ${n(last)} = ${n(pair)}.` },
   { prompt: `Multiply by the number of weeks and halve: ${n(cnt)} × ${n(pair)} ÷ 2. What is the audit total?`, answer: [S], explanation: `${n(cnt)} × ${n(pair)} = ${n(cnt * pair)}, and half of that is ${n(S)} pipes.` }
  ] }; }
});

})();
