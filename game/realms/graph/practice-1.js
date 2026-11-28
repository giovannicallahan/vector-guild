/* Graph theory: networks practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p1.js. */
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

/* ---- Text and graph helpers (a graph is V, the number of vertices 1 to V, and E, a list of edges [a, b]) ---- */
const edgeText = E => E.map(([a, b]) => `${n(a)}–${n(b)}`).join(', ');
const and = xs => { const s = xs.map(x => typeof x === 'number' ? n(x) : x); return s.length < 2 ? s.join('') : `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`; };
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = k => String(k).split('').map(d => SUB[+d]).join('');
const sortE = E => E.map(([a, b]) => a < b ? [a, b] : [b, a]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
const nbrs = (V, E) => { const A = Array.from({ length: V + 1 }, () => []); for (const [a, b] of E) { A[a].push(b); A[b].push(a); } A.forEach(l => l.sort((x, y) => x - y)); return A; };
const degs = (V, E) => nbrs(V, E).map(l => l.length);
const has = (E, a, b) => E.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const pairs = V => { const P = []; for (let a = 1; a <= V; a++) for (let b = a + 1; b <= V; b++) P.push([a, b]); return P; };
const shuffle = (R, xs) => { const s = xs.slice(); for (let i = s.length - 1; i > 0; i--) { const j = R.int(0, i), t = s[i]; s[i] = s[j]; s[j] = t; } return s; };
const randGraph = (R, V, m) => sortE(shuffle(R, pairs(V)).slice(0, m));
const connGraph = (R, V, extra) => {
 const order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), E = [];
 for (let i = 1; i < V; i++) E.push([order[i], order[R.int(0, i - 1)]]);
 const rest = shuffle(R, pairs(V).filter(([a, b]) => !has(E, a, b)));
 return sortE(E.concat(rest.slice(0, extra)));
};
const comp = (V, E) => pairs(V).filter(([a, b]) => !has(E, a, b));
const seqOf = (V, E) => degs(V, E).slice(1).sort((x, y) => y - x);
const sameShape = (V, A, B) => A.length === B.length && seqOf(V, A).join() === seqOf(V, B).join();
const sumOf = xs => xs.reduce((s, x) => s + x, 0);
const until = (make, ok) => { for (;;) { const p = make(); if (p && ok(p)) return p; } };
/* A second graph on the same V vertices from A. kind 0: a renaming of A (same shape); kind 1: one edge moved so the degree
   sequence changes (null when it does not); kind 2: one edge added. Returns null when the kind cannot be built. */
const variant = (R, V, A, kind) => {
 if (kind === 0) { const pi = [0].concat(shuffle(R, Array.from({ length: V }, (_, i) => i + 1))); return sortE(A.map(([a, b]) => [pi[a], pi[b]])); }
 const out = shuffle(R, pairs(V).filter(([a, b]) => !has(A, a, b)));
 if (!out.length) return null;
 if (kind === 2) return sortE(A.concat([out[0]]));
 const drop = R.int(0, A.length - 1), B = sortE(A.filter((_, i) => i !== drop).concat([out[0]]));
 return seqOf(V, A).join() === seqOf(V, B).join() ? null : B;
};
/* The value whose count differs most obviously between two degree sequences (the largest value whose counts differ), else the largest value. */
const askVal = (sA, sB) => { const cnt = (s, x) => s.filter(y => y === x).length, vals = Array.from(new Set(sA.concat(sB))).sort((x, y) => y - x), differ = vals.filter(x => cnt(sA, x) !== cnt(sB, x));
 const k = differ.length ? differ[0] : sA[0]; return { k, cA: cnt(sA, k), cB: cnt(sB, k) }; };

/* ---- q01 Vertices, edges and neighbours [O12.1] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The relay mast links',
 brief: 'The comms log lists every direct radio link between the relay masts, and the Map Room needs the links counted and one mast checked.',
 labels: ['links', 'masts linked to the mast'], tolerance: 0.01,
 gl: [['links'], ['masts linked to the mast']]
}, {
 /* A simple graph on V = 5–8 vertices (the parent's worked example has 4); mast k has at least two neighbours. */
 canonical: { V: 7, E: [[1, 3], [1, 6], [2, 4], [2, 5], [3, 4], [3, 7], [4, 6], [5, 7], [6, 7]], k: 4 },
 draw: R => until(() => { const V = R.int(5, 8), m = R.int(V, Math.min(2 * V - 1, V * (V - 1) / 2 - 2)); return { V, E: randGraph(R, V, m), k: R.int(1, V) }; },
  p => degs(p.V, p.E)[p.k] >= 2),
 build: ({ V, E, k }) => { const m = E.length, N = nbrs(V, E)[k], at = E.filter(e => e.includes(k)), atText = and(at.map(([a, b]) => `${n(a)}–${n(b)}`)); return {
  prompt: `The comms log lists every direct radio link between ${n(V)} relay masts, numbered 1 to ${n(V)}. Each link joins two different masts, and no pair of masts has two links. The links are ${edgeText(E)}. Treat each mast as a vertex and each link as an edge. Enter the number of links, then the number of masts that mast ${n(k)} is linked to directly.`,
  answer: [m, N.length],
  hints: ['Each pair is one link and each link is listed once, so count the pairs.', 'The masts linked to a given mast are the other numbers in every pair that contains it, whichever side of the dash it is written on.'],
  solution: `The log has ${n(m)} pairs, so there are ${n(m)} links. The pairs that contain ${n(k)} are ${atText}, so mast ${n(k)} is linked directly to masts ${and(N)}: ${n(N.length)} masts.`,
  guidance: [
   { prompt: `Count the pairs in the list ${edgeText(E)}. How many links are there?`, answer: [m], explanation: `There are ${n(m)} pairs, and each pair is one link.` },
   { prompt: `Pick out every pair that contains ${n(k)}, on either side of the dash. How many masts is mast ${n(k)} linked to directly?`, answer: [N.length], explanation: `The pairs ${atText} contain ${n(k)}. Their other ends are masts ${and(N)}, so mast ${n(k)} has ${n(N.length)} neighbours.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Cables and lamps for the mast network',
 brief: 'The Cable Yard must fit one cable to every link on the comms log and a lamp to every neighbour of the relay station, and it wants the bill before it starts.',
 labels: ['cables', 'cable cost (credits)', 'lamp cost (credits)'], tolerance: 0.01,
 gl: [['cables'], ['cable cost (credits)'], ['masts linked to the relay station', 'lamp cost (credits)']]
}, {
 /* A simple graph on V = 5–8 vertices; the relay mast k has at least two neighbours. Prices are small, so every answer is under 1000. */
 canonical: { V: 6, E: [[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [4, 5], [4, 6], [5, 6]], k: 3, c: 6, j: 4 },
 draw: R => until(() => { const V = R.int(5, 8), m = R.int(V, Math.min(2 * V - 1, V * (V - 1) / 2 - 2)); return { V, E: randGraph(R, V, m), k: R.int(1, V), c: R.int(2, 9), j: R.int(2, 9) }; },
  p => degs(p.V, p.E)[p.k] >= 2),
 build: ({ V, E, k, c, j }) => { const m = E.length, N = nbrs(V, E)[k], at = E.filter(e => e.includes(k)), atText = and(at.map(([a, b]) => `${n(a)}–${n(b)}`)), cableCost = m * c, lampCost = N.length * j; return {
  prompt: `The comms log lists the direct radio links between ${n(V)} relay masts, numbered 1 to ${n(V)}: ${edgeText(E)}. Each link joins two different masts, and no pair has two links. Every link needs one cable, which costs ${n(c)} credits. Mast ${n(k)} is the relay station, and every mast linked directly to it gets one signal lamp, which costs ${n(j)} credits. Enter the number of cables needed, the total cost of the cables, then the total cost of the lamps, both costs in credits.`,
  answer: [m, cableCost, lampCost],
  hints: ['Every link needs exactly one cable, so the number of cables is the number of pairs in the list. Multiply by the price of one cable for the cost.', 'The lamps go on the masts that share a pair with the relay station. Count them, then multiply by the price of one lamp.'],
  solution: `The list has ${n(m)} pairs, so ${n(m)} cables are needed, costing ${n(m)} × ${n(c)} = ${n(cableCost)} credits. The pairs that contain ${n(k)} are ${atText}, so the masts linked to the relay station are ${and(N)}: ${n(N.length)} masts. The lamps cost ${n(N.length)} × ${n(j)} = ${n(lampCost)} credits.`,
  guidance: [
   { prompt: `Count the pairs in the list ${edgeText(E)}. How many cables are needed?`, answer: [m], explanation: `Each pair is one link, and each link needs one cable: ${n(m)} cables.` },
   { prompt: `Each cable costs ${n(c)} credits. What do all the cables cost?`, answer: [cableCost], explanation: `${n(m)} × ${n(c)} = ${n(cableCost)} credits.` },
   { prompt: `Pick out every pair that contains ${n(k)}. How many masts are linked to the relay station, and what do their lamps cost at ${n(j)} credits each?`, answer: [N.length, lampCost], explanation: `The pairs ${atText} contain ${n(k)}, so the masts linked to it are ${and(N)}: ${n(N.length)} masts. ${n(N.length)} × ${n(j)} = ${n(lampCost)} credits.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The long ledger',
 brief: 'The outpost ledger lists its tunnels in no order at all, with each pair written either way round, and Mira wants one dome checked against it.',
 labels: ['edges', 'neighbours of the dome', 'domes not neighbours of it'], tolerance: 0.01,
 gl: [['edges'], ['neighbours of the dome'], ['domes not neighbours of it']]
}, {
 /* A simple graph on V = 9–11 vertices with V + 3 to 2V edges, listed in a shuffled order with each pair written either way round
    (E holds the pairs exactly as printed, so a < b is not guaranteed). Dome k has between 3 and V − 3 neighbours. */
 canonical: { V: 9, E: [[2, 1], [1, 5], [3, 2], [2, 7], [4, 3], [3, 8], [5, 4], [9, 4], [6, 5], [5, 8], [7, 6], [6, 9], [8, 7], [9, 8], [4, 7]], k: 3 },
 draw: R => until(() => { const V = R.int(9, 11), m = R.int(V + 3, 2 * V), E = shuffle(R, randGraph(R, V, m)).map(([a, b]) => R.bool() ? [a, b] : [b, a]); return { V, E, k: R.int(1, V) }; },
  p => { const d = degs(p.V, p.E)[p.k]; return d >= 3 && d <= p.V - 3; }),
 build: ({ V, E, k }) => { const m = E.length, N = nbrs(V, E)[k], at = E.filter(e => e.includes(k)), atText = and(at.map(([a, b]) => `${n(a)}–${n(b)}`)), rest = V - 1 - N.length; return {
  prompt: `The outpost ledger lists the tunnels between ${n(V)} domes, numbered 1 to ${n(V)}. Each tunnel is written once, with its two domes in either order, and no pair of domes has two tunnels. The tunnels are ${edgeText(E)}. Enter the number of edges, the number of neighbours of dome ${n(k)}, then the number of domes that are neither dome ${n(k)} nor a neighbour of it.`,
  answer: [m, N.length, rest],
  hints: ['A pair written the other way round is still one tunnel, so count each pair once, however its numbers are ordered.', 'To find the neighbours of a dome, look at both positions in every pair. Then count the domes other than that dome and its neighbours: start from all the domes and take away those two groups.'],
  solution: `The ledger has ${n(m)} pairs, so the graph has ${n(m)} edges. The pairs that contain ${n(k)} are ${atText}, so the neighbours of dome ${n(k)} are domes ${and(N.slice())}: ${n(N.length)} neighbours. Of the ${n(V)} domes, one is dome ${n(k)} itself and ${n(N.length)} are its neighbours, so ${n(V)} − 1 − ${n(N.length)} = ${n(rest)} domes are neither.`,
  guidance: [
   { prompt: `Count the pairs in the ledger: ${edgeText(E)}. How many edges does the graph have?`, answer: [m], explanation: `There are ${n(m)} pairs. A pair such as ${n(E[0][0])}–${n(E[0][1])} is one tunnel whichever way round it is written.` },
   { prompt: `Pick out every pair that contains ${n(k)}, whether ${n(k)} comes first or second. How many neighbours does dome ${n(k)} have?`, answer: [N.length], explanation: `The pairs ${atText} contain ${n(k)}. Their other ends are domes ${and(N)}, so dome ${n(k)} has ${n(N.length)} neighbours.` },
   { prompt: `There are ${n(V)} domes. Take away dome ${n(k)} itself and its ${n(N.length)} neighbours. How many domes are left?`, answer: [rest], explanation: `${n(V)} − 1 − ${n(N.length)} = ${n(rest)} domes are neither dome ${n(k)} nor a neighbour of it.` }
  ] }; }
});

/* ---- q02 Degree and the handshake rule [O12.1, O12.2] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The pipe junction tally',
 brief: 'The water plant tallied the pipes at every junction but never counted the pipes themselves, and the maintenance budget needs that number.',
 labels: ['sum of degrees', 'pipes'], tolerance: 0.01,
 gl: [['sum of degrees'], ['pipes']]
}, {
 /* The degrees of every vertex of a random simple graph on V = 6–9 vertices (the parent's worked example has 5), every degree at least 1. */
 canonical: { V: 7, d: [3, 4, 2, 3, 2, 3, 1] },
 draw: R => until(() => { const V = R.int(6, 9), E = randGraph(R, V, R.int(V, 2 * V)), D = degs(V, E); return D.slice(1).every(x => x >= 1) ? { V, d: D.slice(1) } : null; }, () => true),
 build: ({ V, d }) => { const S = sumOf(d), m = S / 2; return {
  prompt: `The water plant has ${n(V)} junctions, numbered 1 to ${n(V)}, joined by pipes. Each pipe joins two different junctions, and no pair of junctions has two pipes. The tally sheet gives the degree of each junction, the number of pipes that meet it, in order: ${and(d)}. Nobody has counted the pipes themselves. Enter the sum of the degrees, then the number of pipes.`,
  answer: [S, m],
  hints: ['Adding up the degrees counts every pipe end, and every pipe has two ends.', 'Each pipe is counted twice in the sum of the degrees, so the number of pipes is half of that sum.'],
  solution: `The degrees add up to ${d.map(n).join(' + ')} = ${n(S)}. By the handshake rule this sum is twice the number of pipes, so there are ${n(S)} ÷ 2 = ${n(m)} pipes.`,
  guidance: [
   { prompt: `Add up the degrees ${and(d)}. What is the sum?`, answer: [S], explanation: `${d.map(n).join(' + ')} = ${n(S)}.` },
   { prompt: `Every pipe has two ends, so it is counted twice in that sum. How many pipes are there?`, answer: [m], explanation: `${n(S)} ÷ 2 = ${n(m)} pipes.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Doors for every dome',
 brief: 'Every tunnel needs a sealed door at both of its ends, and the stores want the total order and the cost of the doors still to fit in the last dome.',
 labels: ['doors in all', 'doors at the last dome', 'cost of the last doors (credits)'], tolerance: 0.01,
 gl: [['doors in all'], ['doors at the last dome'], ['cost of the last doors (credits)']]
}, {
 /* A random simple graph on V = 6–8 vertices; the door counts are the degrees of vertices 1 to V − 1 and the last dome has at least 2. */
 canonical: { V: 6, m: 9, d: [3, 4, 2, 3, 2], c: 8 },
 draw: R => until(() => { const V = R.int(6, 8), E = randGraph(R, V, R.int(V, 2 * V)), D = degs(V, E);
  return D[V] >= 2 && D.slice(1).every(x => x >= 1) ? { V, m: E.length, d: D.slice(1, V), c: R.int(3, 12) } : null; }, () => true),
 build: ({ V, m, d, c }) => { const S = sumOf(d), T = 2 * m, miss = T - S, cost = miss * c; return {
  prompt: `Every tunnel needs a sealed door at each of its two ends, one in each dome it joins, and each door costs ${n(c)} credits. The network has ${n(V)} domes and ${n(m)} tunnels. No tunnel joins a dome to itself, and no pair of domes has two tunnels. Domes 1 to ${n(V - 1)} have all their doors fitted already; the numbers of doors there are ${and(d)}, in that order. Dome ${n(V)} has none yet. Enter the total number of doors the whole network needs, the number of doors still to fit at dome ${n(V)}, then the cost of those last doors in credits.`,
  answer: [T, miss, cost],
  hints: ['A dome gets one door for every tunnel that meets it, so its door count is its degree. Every tunnel has two ends, so it needs two doors in all.', 'The doors still to fit at the last dome are the total number of doors minus the doors already fitted. Multiply by the price of one door for the cost.'],
  solution: `Each tunnel needs 2 doors, so the network needs 2 × ${n(m)} = ${n(T)} doors in all. The fitted doors add up to ${d.map(n).join(' + ')} = ${n(S)}, so ${n(T)} − ${n(S)} = ${n(miss)} doors are still to fit at dome ${n(V)}. They cost ${n(miss)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Each of the ${n(m)} tunnels needs a door at both ends. How many doors does the whole network need?`, answer: [T], explanation: `2 × ${n(m)} = ${n(T)} doors. This is the handshake rule: the degrees add up to twice the number of edges.` },
   { prompt: `The fitted doors ${and(d)} add up to ${n(S)}. How many doors are still to fit at dome ${n(V)}?`, answer: [miss], explanation: `${n(T)} − ${n(S)} = ${n(miss)} doors.` },
   { prompt: `Each door costs ${n(c)} credits. What do the last ${n(miss)} doors cost?`, answer: [cost], explanation: `${n(miss)} × ${n(c)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The twin domes at the end of the log',
 brief: 'The last two domes in the log were built as a matched pair, and their readings were lost together, so Mira must recover them from the rest.',
 labels: ['sum of degrees', 'known degrees add to', 'degree of each twin'], tolerance: 0.01,
 gl: [['sum of degrees'], ['known degrees add to'], ['degree of each twin']]
}, {
 /* A random simple graph on V = 9–11 vertices in which the last two domes have the same degree, at least 2 (so the answer is never "1 tunnels"). d lists the degrees of domes 1 to V − 2. */
 canonical: { V: 9, m: 14, d: [3, 4, 2, 3, 5, 2, 3] },
 draw: R => until(() => { const V = R.int(9, 11), E = randGraph(R, V, R.int(V + 2, 2 * V)), D = degs(V, E);
  return D[V] === D[V - 1] && D[V] >= 2 && D.slice(1).every(x => x >= 1) ? { V, m: E.length, d: D.slice(1, V - 1) } : null; }, () => true),
 build: ({ V, m, d }) => { const S = sumOf(d), T = 2 * m, left = T - S, x = left / 2; return {
  prompt: `The log covers ${n(V)} domes joined by ${n(m)} tunnels. Each tunnel joins two different domes, and no pair has two tunnels. Domes 1 to ${n(V - 2)} have degrees ${and(d)}, in that order. Domes ${n(V - 1)} and ${n(V)} were built as a matched pair and have the same degree as each other, but that reading was lost. Enter the sum of the degrees of all ${n(V)} domes, the sum of the known degrees, then the degree of each of the last two domes.`,
  answer: [T, S, x],
  hints: ['The sum of the degrees is twice the number of edges, whatever the individual degrees are.', 'What is left after the known degrees is shared between two domes with the same degree, so each of them has half of it.'],
  solution: `By the handshake rule the degrees add up to 2 × ${n(m)} = ${n(T)}. The known degrees add up to ${d.map(n).join(' + ')} = ${n(S)}. That leaves ${n(T)} − ${n(S)} = ${n(left)} for the last two domes, which have equal degrees, so each has ${n(left)} ÷ 2 = ${n(x)}.`,
  guidance: [
   { prompt: `The network has ${n(m)} tunnels. What is the sum of the degrees of all ${n(V)} domes?`, answer: [T], explanation: `Every tunnel is counted at both ends, so the degrees add up to 2 × ${n(m)} = ${n(T)}.` },
   { prompt: `What do the known degrees ${and(d)} add up to?`, answer: [S], explanation: `${d.map(n).join(' + ')} = ${n(S)}.` },
   { prompt: `What is left over is shared equally by the last two domes. What is the degree of each?`, answer: [x], explanation: `${n(T)} − ${n(S)} = ${n(left)}, and ${n(left)} ÷ 2 = ${n(x)}, so each of domes ${n(V - 1)} and ${n(V)} has degree ${n(x)}.` }
  ] }; }
});

/* ---- q03 Complete graphs and cycles [O12.2] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'The mesh and the loop',
 brief: 'A new sensor field needs its posts cabled, and the Map Room wants a full mesh weighed against a single loop.',
 labels: ['cables in plan A', 'cables at each post in plan A', 'extra cables of plan A'], tolerance: 0.01,
 gl: [['cables at each post in plan A'], ['cables in plan A'], ['extra cables of plan A']]
}, {
 /* K_k and C_k for k = 5–40, never the parent's worked example of 7. K_k has at most 780 edges, so no thousands. */
 canonical: { k: 15 },
 draw: R => ({ k: R.except(5, 40, [7]) }),
 build: ({ k }) => { const s = sub(k), D = k - 1, P = k * D, KE = P / 2, extra = KE - k; return {
  prompt: `A new sensor field has ${n(k)} posts. Plan A is a full mesh, the complete graph K${s}: a cable between every pair of posts. Plan B is a loop, the cycle C${s}: the posts stand in a ring, each cabled to the next, and the last cabled back to the first. Enter the number of cables in plan A, the number of cables plugged into each post in plan A, then how many more cables plan A needs than plan B.`,
  answer: [KE, D, extra],
  hints: ['In a full mesh each post is cabled to every other post, but never to itself. Adding up the cables at every post counts each cable twice.', 'A ring of posts has exactly as many cables as posts, since each post has one cable going on to the next. Subtract that from the mesh.'],
  solution: `In K${s} each post is cabled to the other ${n(D)}, so ${n(D)} cables are plugged into each post. Those add up to ${n(k)} × ${n(D)} = ${n(P)}, which counts every cable twice, so K${s} has ${n(P)} ÷ 2 = ${n(KE)} cables. The loop C${s} has ${n(k)} cables, so plan A needs ${n(KE)} − ${n(k)} = ${n(extra)} more.`,
  guidance: [
   { prompt: `In plan A, how many other posts is each post cabled to? That is the number of cables at each post.`, answer: [D], explanation: `Each post is cabled to all ${n(k)} posts except itself: ${n(k)} − 1 = ${n(D)}.` },
   { prompt: `Add the cables at all ${n(k)} posts and halve the total, since every cable has two ends. What is ${n(k)} × ${n(D)} ÷ 2?`, answer: [KE], explanation: `${n(k)} × ${n(D)} = ${n(P)}, and half of that is ${n(KE)} cables in plan A.` },
   { prompt: `Plan B, the loop, has one cable for each post: ${n(k)} cables. How many more cables does plan A need?`, answer: [extra], explanation: `${n(KE)} − ${n(k)} = ${n(extra)} more cables.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Pricing the two station layouts',
 brief: 'The planners can link a new group of stations by a road between every pair or by a single ring road, and they want to know what the full network adds to the bill.',
 labels: ['roads in the full network', 'roads in the ring', 'extra cost (credits)'], tolerance: 0.01,
 gl: [['roads in the full network', 'roads in the ring'], ['extra roads'], ['extra cost (credits)']]
}, {
 /* K_k and C_k for k = 6–20, never the parent's worked example of 7; with a price of 2–9 credits the extra cost is at most 1710. */
 canonical: { k: 9, c: 5 },
 draw: R => ({ k: R.except(6, 20, [7]), c: R.int(2, 9) }),
 build: ({ k, c }) => { const s = sub(k), D = k - 1, KE = k * D / 2, extra = KE - k, cost = extra * c; return {
  prompt: `The planners must link ${n(k)} stations. The full network is the complete graph K${s}: a road between every pair of stations. The ring is the cycle C${s}: the stations stand in a ring, each joined to the next, and the last joined back to the first. Every road, in either plan, costs ${n(c)} credits to build. Enter the number of roads in the full network, the number of roads in the ring, then how much more the full network costs than the ring, in credits (type it without commas).`,
  answer: [KE, k, cost],
  hints: ['In the full network each station is joined to every other station, so add up those joins over all stations and halve the total, since each road has two ends. In the ring each station has two neighbours.', 'The extra cost is the number of extra roads times the price of one road.'],
  solution: `In K${s} each station is joined to the other ${n(D)}, so the degrees add up to ${n(k)} × ${n(D)} = ${n(k * D)} and the full network has ${n(k * D)} ÷ 2 = ${n(KE)} roads. The ring has ${n(k)} roads. That is ${n(KE)} − ${n(k)} = ${n(extra)} extra roads, costing ${n(extra)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Each station is joined to ${n(D)} others in the full network, and to 2 in the ring. How many roads does each plan have? Enter the full network first.`, answer: [KE, k], explanation: `The full network has ${n(k)} × ${n(D)} ÷ 2 = ${n(KE)} roads. The ring has 2 × ${n(k)} ÷ 2 = ${n(k)} roads.` },
   { prompt: `How many more roads does the full network have than the ring?`, answer: [extra], explanation: `${n(KE)} − ${n(k)} = ${n(extra)} extra roads.` },
   { prompt: `Each road costs ${n(c)} credits. What do the extra roads cost?`, answer: [cost], explanation: `${n(extra)} × ${n(c)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', title: 'Every dome the same number of tunnels', uses: 'q02',
 brief: 'The planners want a new cluster in which every dome has the same number of tunnels, and Mira wants to see how far short of a full network that falls.',
 labels: ['sum of degrees', 'tunnels', 'tunnels short of the complete graph'], tolerance: 0.01,
 gl: [['sum of degrees'], ['tunnels'], ['tunnels short of the complete graph']]
}, {
 /* n domes of degree r with n × r even and r < n; n = 10–40 so K_n has at most 780 edges. */
 canonical: { k: 14, r: 5 },
 draw: R => until(() => ({ k: R.int(10, 40), r: R.int(3, 8) }), p => (p.k * p.r) % 2 === 0),
 build: ({ k, r }) => { const s = sub(k), S = k * r, E = S / 2, KE = k * (k - 1) / 2, gap = KE - E; return {
  prompt: `A new cluster of ${n(k)} domes is to be built so that every dome has degree ${n(r)}: exactly ${n(r)} tunnels meet each dome. No tunnel joins a dome to itself, and no pair has two. Enter the sum of the degrees, the number of tunnels the cluster has, then how many fewer tunnels it has than the complete graph K${s} on the same domes.`,
  answer: [S, E, gap],
  hints: ['Every dome has the same degree, so the sum of the degrees is the number of domes times that degree. The handshake rule turns the sum into a number of tunnels.', 'In the complete graph every dome is joined to all the others, so find its tunnels the way you find any complete graph\'s, then take the cluster\'s tunnels away.'],
  solution: `All ${n(k)} domes have degree ${n(r)}, so the degrees add up to ${n(k)} × ${n(r)} = ${n(S)}. By the handshake rule that is twice the number of tunnels, so the cluster has ${n(S)} ÷ 2 = ${n(E)} tunnels. K${s} has ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(KE)} edges, so the cluster has ${n(KE)} − ${n(E)} = ${n(gap)} fewer.`,
  guidance: [
   { prompt: `Every one of the ${n(k)} domes has degree ${n(r)}. What do the degrees add up to?`, answer: [S], explanation: `${n(k)} × ${n(r)} = ${n(S)}.` },
   { prompt: `By the handshake rule the sum is twice the number of tunnels. How many tunnels does the cluster have?`, answer: [E], explanation: `${n(S)} ÷ 2 = ${n(E)} tunnels.` },
   { prompt: `The complete graph K${s} has ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(KE)} edges. How many fewer tunnels does the cluster have?`, answer: [gap], explanation: `${n(KE)} − ${n(E)} = ${n(gap)}.` }
  ] }; }
});

/* ---- q04 Subgraphs and complements [O12.2, O12.3] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The corridors of the living quarters',
 brief: 'The living quarters are a set of rooms joined by corridors, and the Map Room wants to know what a block of rooms keeps and which corridors do not exist.',
 labels: ['edges in the subgraph', 'edges in the complement', 'degree in the complement'], tolerance: 0.01,
 gl: [['edges in the subgraph'], ['edges in the complement'], ['degree in the complement']]
}, {
 /* A simple graph on V = 6–8 vertices (the parent's has 7 and a subgraph on 1–4); the subgraph is on rooms 1 to j with j = 3 or 5, and has at least 2 edges. Room k has degree 1 to V − 3, so its complement degree is at least 2. */
 canonical: { V: 7, j: 3, E: [[1, 2], [1, 3], [2, 3], [2, 6], [3, 4], [3, 5], [4, 5], [4, 7], [5, 6], [6, 7]], k: 3 },
 draw: R => until(() => { const V = R.int(6, 8), m = R.int(V, V * (V - 1) / 2 - V); return { V, j: R.pick([3, 5]), E: randGraph(R, V, m), k: R.int(1, V) }; },
  p => { const d = degs(p.V, p.E)[p.k]; return d >= 1 && p.V - 1 - d >= 2 && p.E.filter(([a, b]) => b <= p.j).length >= 2; }),
 build: ({ V, j, E, k }) => { const m = E.length, inside = E.filter(([a, b]) => b <= j), KE = V * (V - 1) / 2, cE = KE - m, d = degs(V, E)[k], cd = V - 1 - d, ins = and(inside.map(([a, b]) => `${n(a)}–${n(b)}`)); return {
  prompt: `The living quarters have ${n(V)} rooms, numbered 1 to ${n(V)}, and these ${n(m)} corridors: ${edgeText(E)}. No corridor joins a room to itself, and no pair has two. The complement of the graph joins exactly the pairs of rooms that have no corridor. Enter the number of edges in the subgraph on rooms 1 to ${n(j)} (it keeps every corridor between two of those rooms), then the number of edges in the complement, then the degree of room ${n(k)} in the complement.`,
  answer: [inside.length, cE, cd],
  hints: [`A corridor belongs to the subgraph only when both of its rooms are among 1 to ${n(j)}.`, 'The graph and its complement together make the complete graph on the same rooms, with every pair joined exactly once. A room can be joined to every room except itself.'],
  solution: `Between rooms 1 to ${n(j)} the corridors are ${ins}, so the subgraph has ${n(inside.length)} edges. K${sub(V)} has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges, so the complement has ${n(KE)} − ${n(m)} = ${n(cE)}. Room ${n(k)} has degree ${n(d)}, so in the complement its degree is ${n(V - 1)} − ${n(d)} = ${n(cd)}.`,
  guidance: [
   { prompt: `Keep only the corridors whose two ends are both among rooms 1 to ${n(j)}. How many edges does that subgraph have?`, answer: [inside.length], explanation: `They are ${ins}: ${n(inside.length)} edges. Every other corridor has an end outside rooms 1 to ${n(j)}.` },
   { prompt: `The complete graph on ${n(V)} rooms has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges. How many of those pairs have no corridor?`, answer: [cE], explanation: `${n(KE)} − ${n(m)} = ${n(cE)}: those pairs are exactly the edges of the complement.` },
   { prompt: `Room ${n(k)} could be joined to ${n(V - 1)} other rooms, and ${n(d)} of those joins are corridors already. What is its degree in the complement?`, answer: [cd], explanation: `${n(V - 1)} − ${n(d)} = ${n(cd)}: the complement joins room ${n(k)} to every room it has no corridor to.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Digging the missing tunnels',
 brief: 'Mira wants every pair of domes in the cluster joined by a tunnel, and the diggers want the number of tunnels left to dig, the bill, and what one dome faces.',
 labels: ['new tunnels', 'digging cost (credits)', 'new tunnels at the dome'], tolerance: 0.01,
 gl: [['new tunnels'], ['digging cost (credits)'], ['new tunnels at the dome']]
}, {
 /* A simple graph on V = 5–8 vertices; the dome k has degree 1 to V − 3, so it has at least 2 new tunnels to dig. The cost is at most 28 × 9, so no thousands. */
 canonical: { V: 6, E: [[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [4, 5], [4, 6], [5, 6]], k: 3, c: 6 },
 draw: R => until(() => { const V = R.int(5, 8), m = R.int(V, V * (V - 1) / 2 - V + 1); return { V, E: randGraph(R, V, m), k: R.int(1, V), c: R.int(3, 9) }; },
  p => { const d = degs(p.V, p.E)[p.k]; return d >= 1 && p.V - 1 - d >= 2 && p.E.length <= p.V * (p.V - 1) / 2 - 3; }),
 build: ({ V, E, k, c }) => { const m = E.length, KE = V * (V - 1) / 2, cE = KE - m, cost = cE * c, d = degs(V, E)[k], cd = V - 1 - d; return {
  prompt: `Mira wants every pair of the ${n(V)} domes, numbered 1 to ${n(V)}, to be joined by a tunnel. The tunnels already dug are ${edgeText(E)}. Each tunnel joins two different domes, and no pair has two. Every new tunnel costs ${n(c)} credits to dig. Enter the number of new tunnels needed, the cost of digging them all in credits, then the number of new tunnels that will end at dome ${n(k)}.`,
  answer: [cE, cost, cd],
  hints: ['When every pair is joined, the network is the complete graph on the same domes. The new tunnels are the pairs that are not tunnels yet.', 'For one dome, count the domes it could be joined to and take away those it is joined to already.'],
  solution: `The complete graph on ${n(V)} domes has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges, and ${n(m)} are dug already, so ${n(KE)} − ${n(m)} = ${n(cE)} new tunnels are needed. They cost ${n(cE)} × ${n(c)} = ${n(cost)} credits. Dome ${n(k)} has degree ${n(d)} and could be joined to ${n(V - 1)} domes, so ${n(V - 1)} − ${n(d)} = ${n(cd)} new tunnels will end there.`,
  guidance: [
   { prompt: `The complete graph on ${n(V)} domes has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges, and the list has ${n(m)} tunnels. How many new tunnels are needed?`, answer: [cE], explanation: `${n(KE)} − ${n(m)} = ${n(cE)}. These are the edges of the complement.` },
   { prompt: `Each new tunnel costs ${n(c)} credits. What does digging them all cost?`, answer: [cost], explanation: `${n(cE)} × ${n(c)} = ${n(cost)} credits.` },
   { prompt: `Dome ${n(k)} is joined to ${n(d)} dome${d === 1 ? '' : 's'} already, out of ${n(V - 1)} it could be joined to. How many new tunnels will end at dome ${n(k)}?`, answer: [cd], explanation: `${n(V - 1)} − ${n(d)} = ${n(cd)}.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', title: 'The hub inside the ring', uses: 'q03',
 brief: 'A cluster has a ring of domes with a hub in the middle joined to all of them, and Mira wants the pairs it leaves unjoined.',
 labels: ['edges in the complement', 'degree of the hub in the complement', 'degree of a ring dome in the complement'], tolerance: 0.01,
 gl: [['edges in the graph'], ['edges in the complement'], ['degree of the hub in the complement', 'degree of a ring dome in the complement']]
}, {
 /* A ring C_r of r = 6–20 domes plus a hub joined to all of them (r + 1 domes, 2r edges). The hub's complement degree is always 0, so it is asked beside the ring dome's r − 3, which is at least 3. */
 canonical: { r: 8 },
 draw: R => ({ r: R.int(6, 40) }),
 build: ({ r }) => { const V = r + 1, E = 2 * r, KE = V * r / 2, cE = KE - E, hub = r - r, ringd = r - 3; return {
  prompt: `Domes 1 to ${n(r)} stand in a ring: each is joined to the next, and dome ${n(r)} is joined back to dome 1, as in the cycle C${sub(r)}. A hub dome, numbered ${n(V)}, is joined to every ring dome. There are no other tunnels. Enter the number of edges in the complement of this graph, the degree of the hub in the complement, then the degree of a ring dome in the complement.`,
  answer: [cE, hub, ringd],
  hints: ['Count the edges of the graph first: the ring has one edge for each of its domes, and the hub adds one more edge for each ring dome.', 'In the complement a dome\'s degree is the number of other domes minus its degree in the graph. A ring dome has two ring neighbours and the hub.'],
  solution: `The ring has ${n(r)} edges and the hub adds ${n(r)} more, so the graph has ${n(E)} edges. K${sub(V)} has ${n(V)} × ${n(r)} ÷ 2 = ${n(KE)} edges, so the complement has ${n(KE)} − ${n(E)} = ${n(cE)}. The hub is joined to all ${n(r)} other domes, so its degree in the complement is ${n(r)} − ${n(r)} = 0. A ring dome is joined to 2 ring domes and the hub, so it has degree 3 in the graph and ${n(r)} − 3 = ${n(ringd)} in the complement.`,
  guidance: [
   { prompt: `The ring has ${n(r)} edges and the hub is joined to each of the ${n(r)} ring domes. How many edges does the graph have?`, answer: [E], explanation: `${n(r)} + ${n(r)} = ${n(E)} edges.` },
   { prompt: `The complete graph on ${n(V)} domes has ${n(V)} × ${n(r)} ÷ 2 = ${n(KE)} edges. How many edges does the complement have?`, answer: [cE], explanation: `${n(KE)} − ${n(E)} = ${n(cE)}.` },
   { prompt: `The hub has degree ${n(r)} in the graph, and a ring dome has degree 3. With ${n(r)} other domes each could be joined to, what are their degrees in the complement? Enter the hub first.`, answer: [hub, ringd], explanation: `The hub: ${n(r)} − ${n(r)} = 0, since it is joined to every other dome already. A ring dome: ${n(r)} − 3 = ${n(ringd)}.` }
  ] }; }
});

/* ---- q05 Isomorphism and invariants [O12.3] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Two wiring diagrams',
 brief: 'Two electricians drew the wiring of the same control panel and numbered the junctions differently, and the Map Room wants to know whether the diagrams can show one layout.',
 labels: ['largest degree in diagram P', 'largest degree in diagram Q', 'same layout (1 or 0)'], tolerance: 0.01,
 gl: [['largest degree in diagram P', 'largest degree in diagram Q'], ['junctions of that degree in P', 'junctions of that degree in Q'], ['same layout (1 or 0)']]
}, {
 /* Two connected graphs on V = 5–7 vertices with the same number of edges: Q is a renaming of P (kind 0, half the draws) or P with one edge moved so the degree sequence changes. The answer is read from the degree sequences. */
 canonical: { V: 6, P: [[1, 2], [1, 3], [1, 4], [2, 3], [4, 5], [5, 6]], Q: [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [5, 6]] },
 draw: R => until(() => { const V = R.int(5, 7), P = connGraph(R, V, R.int(1, V - 2)), Q = variant(R, V, P, R.pick([0, 0, 1])); return Q ? { V, P, Q } : null; }, p => edgeText(p.P) !== edgeText(p.Q)),
 build: ({ V, P, Q }) => { const m = P.length, sP = seqOf(V, P), sQ = seqOf(V, Q), same = sameShape(V, P, Q), iso = same ? 1 : 0, { k, cA, cB } = askVal(sP, sQ); return {
  prompt: `Two electricians drew the wiring of a control panel with ${n(V)} junctions, each numbering the junctions 1 to ${n(V)} in their own way. Diagram P has the wires ${edgeText(P)}. Diagram Q has the wires ${edgeText(Q)}. Both diagrams have ${n(m)} wires. Matching counts alone do not prove that two networks are the same shape in general, but for these two small diagrams the electricians have checked that if they have the same degree sequence, a renaming of the junctions turns one into the other. Enter the largest degree in diagram P, the largest degree in diagram Q, then 1 if the diagrams show the same layout or 0 if they do not.`,
  answer: [sP[0], sQ[0], iso],
  hints: ['A junction\'s degree is the number of wires that meet it. Renaming the junctions cannot change how many wires meet each one.', 'Write each diagram\'s degree sequence from largest to smallest and compare the two lists, not just the largest degree.'],
  solution: `Diagram P has degree sequence ${sP.map(n).join(', ')}, so its largest degree is ${n(sP[0])}. Diagram Q has ${sQ.map(n).join(', ')}, so its largest degree is ${n(sQ[0])}. Both have ${n(m)} wires. ${same ? 'The degree sequences agree, so by the electricians\' check a renaming turns one diagram into the other: 1.' : 'The degree sequences differ, so no renaming can turn one diagram into the other: 0.'}`,
  guidance: [
   { prompt: `Work out the degree of every junction in each diagram. What is the largest degree in P, and in Q?`, answer: [sP[0], sQ[0]], explanation: `P has degree sequence ${sP.map(n).join(', ')} and Q has ${sQ.map(n).join(', ')}.` },
   { prompt: `How many junctions of degree ${n(k)} does each diagram have?`, answer: [cA, cB], explanation: `Diagram P has ${n(cA)} of degree ${n(k)} and diagram Q has ${n(cB)}.` },
   { prompt: `Do the diagrams agree on the whole degree sequence? Enter 1 if they show the same layout, 0 if they do not.`, answer: [iso], explanation: same ? 'Both sequences agree, and the electricians have confirmed that a renaming then exists, so the diagrams show the same layout.' : 'The degree sequences differ, and the same layout would give the same sequence, so the diagrams are not the same layout.' }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Which catalogue layout fits the template',
 brief: 'The Map Room holds a template for a new corridor layout and two catalogued layouts numbered differently, and the clerk needs to know how many of them are the same shape.',
 labels: ['X matches (1 or 0)', 'Y matches (1 or 0)', 'layouts that match'], tolerance: 0.01,
 gl: [['corridors in T', 'corridors in X', 'corridors in Y'], ['X matches (1 or 0)', 'Y matches (1 or 0)'], ['layouts that match']]
}, {
 /* Three graphs T, X, Y on the same V = 5–6 vertices. X and Y are each a renaming of T, one edge moved with the degree sequence changed, or T with an edge added; the prompt's promise is only ever relied on for a true renaming. */
 canonical: { V: 5, T: [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5]], X: [[1, 2], [1, 5], [2, 3], [2, 4], [3, 4]], Y: [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3]] },
 draw: R => until(() => { const V = R.int(5, 6), T = connGraph(R, V, R.int(1, V - 3)), X = variant(R, V, T, R.pick([0, 1, 2])), Y = variant(R, V, T, R.pick([0, 1, 2]));
  return X && Y ? { V, T, X, Y } : null; }, p => edgeText(p.T) !== edgeText(p.X) && edgeText(p.T) !== edgeText(p.Y)),
 build: ({ V, T, X, Y }) => { const mT = T.length, mX = X.length, mY = Y.length, fX = sameShape(V, T, X) ? 1 : 0, fY = sameShape(V, T, Y) ? 1 : 0, cnt = fX + fY, sT = seqOf(V, T), sX = seqOf(V, X), sY = seqOf(V, Y);
  const why = (f, m, s) => f ? 'the same number of corridors and the same degree sequence as T' : m !== mT ? 'a different number of corridors from T' : 'a different degree sequence from T'; return {
  prompt: `The Map Room has a template layout T for ${n(V)} rooms and two catalogued layouts X and Y for ${n(V)} rooms, each numbering the rooms 1 to ${n(V)} in its own way. T has the corridors ${edgeText(T)}. X has the corridors ${edgeText(X)}. Y has the corridors ${edgeText(Y)}. Two layouts are the same shape when a renaming of the rooms turns one into the other. Matching counts alone do not prove that two layouts are the same shape in general, but for these three small layouts the clerks have checked that if two of them have the same number of corridors and the same degree sequence, such a renaming exists. Enter 1 if X is the same shape as T and 0 if not, the same for Y, then the number of catalogued layouts that are the same shape as T.`,
  answer: [fX, fY, cnt],
  hints: ['Compare each catalogued layout with the template on the number of corridors first, then on the degree sequence written from largest to smallest.', 'One difference in any of these numbers is enough to rule a layout out, and a layout that agrees on both counts as the same shape, by the clerks\' check.'],
  solution: `T has ${n(mT)} corridors and degree sequence ${sT.map(n).join(', ')}. X has ${n(mX)} corridors and ${sX.map(n).join(', ')}, so it has ${why(fX, mX)}: ${n(fX)}. Y has ${n(mY)} corridors and ${sY.map(n).join(', ')}, so it has ${why(fY, mY)}: ${n(fY)}. The number of matching layouts is ${n(fX)} + ${n(fY)} = ${n(cnt)}.`,
  guidance: [
   { prompt: `Count the corridors in each layout. How many are in T, in X and in Y?`, answer: [mT, mX, mY], explanation: `T has ${n(mT)}, X has ${n(mX)} and Y has ${n(mY)}.` },
   { prompt: `Write the degree sequence of each layout and compare it with T's. Enter 1 for X if it is the same shape as T and 0 if not, then the same for Y.`, answer: [fX, fY], explanation: `T: ${sT.map(n).join(', ')}. X: ${sX.map(n).join(', ')}, so ${n(fX)}. Y: ${sY.map(n).join(', ')}, so ${n(fY)}. A layout matches only if both its corridor count and its degree sequence agree with T's.` },
   { prompt: `How many of the two catalogued layouts are the same shape as T?`, answer: [cnt], explanation: `${n(fX)} + ${n(fY)} = ${n(cnt)}.` }
  ] }; }
});

{
 /* Two crowded maps on V = 6 or 7 domes. Each is the complement of a sparse graph (the gaps): Q's gaps are a renaming of P's, one gap moved so the degree sequence changes, or one gap added. */
 const gapsP = [[1, 2], [2, 3], [3, 4], [4, 5]], gapsQ = [[1, 3], [2, 3], [3, 5], [4, 6], [2, 6]];
 mk({
  id: 'q05d', parent: 'q05', kind: 'challenge', title: 'Crowded maps read through the gaps', uses: 'q04',
  brief: 'Two crews mapped a crowded cluster where nearly every pair of domes has a tunnel, and Mira wants them compared through the pairs they leave out.',
  labels: ['edges in the complement of P', 'edges in the complement of Q', 'isomorphic (1 or 0)'], tolerance: 0.01,
  gl: [['edges in the complement of P', 'edges in the complement of Q'], ['domes of that degree, complement of P', 'domes of that degree, complement of Q'], ['isomorphic (1 or 0)']]
 }, {
  canonical: { V: 6, P: comp(6, gapsP), Q: comp(6, gapsQ) },
  draw: R => until(() => { const V = R.int(6, 7), gp = randGraph(R, V, R.int(V - 2, V)), gq = variant(R, V, gp, R.pick([0, 0, 1, 2])); return gq ? { V, P: comp(V, gp), Q: comp(V, gq) } : null; },
   p => edgeText(p.P) !== edgeText(p.Q)),
  build: ({ V, P, Q }) => { const KE = V * (V - 1) / 2, cP = comp(V, P), cQ = comp(V, Q), mP = P.length, mQ = Q.length, sP = seqOf(V, cP), sQ = seqOf(V, cQ), same = sameShape(V, P, Q), iso = same ? 1 : 0, { k, cA, cB } = askVal(sP, sQ); return {
   prompt: `Two crews mapped a crowded cluster of ${n(V)} domes, each numbering the domes 1 to ${n(V)} in its own way. Map P has the tunnels ${edgeText(P)}. Map Q has the tunnels ${edgeText(Q)}. Matching counts alone do not prove that two networks are the same shape in general, but for these two maps the crews have checked that if they have the same number of edges and the same degree sequence, a renaming of the domes turns one map into the other. Enter the number of edges in the complement of map P, then in the complement of map Q, then 1 if the maps are isomorphic or 0 if they are not.`,
   answer: [cP.length, cQ.length, iso],
   hints: ['The complement is much smaller than the map, so it is easier to work with. Take the edges of the map away from the edges of the complete graph.', 'A dome\'s degree in the complement is the number of other domes minus its degree in the map. So two maps on the same number of domes have the same degree sequence exactly when their complements do.'],
   solution: `K${sub(V)} has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges. Map P has ${n(mP)}, so its complement has ${n(KE)} − ${n(mP)} = ${n(cP.length)}. Map Q has ${n(mQ)}, so its complement has ${n(KE)} − ${n(mQ)} = ${n(cQ.length)}. The complement of P has degree sequence ${sP.map(n).join(', ')} and the complement of Q has ${sQ.map(n).join(', ')}. ${same ? 'The edge counts and degree sequences agree, so the maps have the same sequences and the crews\' check gives a renaming: 1.' : mP !== mQ ? 'The edge counts differ, so no renaming can turn one map into the other: 0.' : 'The degree sequences differ, so no renaming can turn one map into the other: 0.'}`,
   guidance: [
    { prompt: `K${sub(V)} has ${n(KE)} edges. How many edges does the complement of map P have, and the complement of map Q?`, answer: [cP.length, cQ.length], explanation: `P has ${n(mP)} tunnels, so ${n(KE)} − ${n(mP)} = ${n(cP.length)}. Q has ${n(mQ)} tunnels, so ${n(KE)} − ${n(mQ)} = ${n(cQ.length)}.` },
    { prompt: `Work out each dome's degree in the two complements. How many domes have degree ${n(k)} in the complement of P, and in the complement of Q?`, answer: [cA, cB], explanation: `The complement of P has degree sequence ${sP.map(n).join(', ')}, with ${n(cA)} of degree ${n(k)}. The complement of Q has ${sQ.map(n).join(', ')}, with ${n(cB)} of degree ${n(k)}.` },
    { prompt: `Do the maps agree on the number of edges and on the degree sequence (which the complements show)? Enter 1 if they are isomorphic, 0 if not.`, answer: [iso], explanation: same ? 'Both agree, and the crews have confirmed a renaming, so the maps are isomorphic.' : 'Something differs, and isomorphic graphs share every invariant, so the maps are not isomorphic.' }
   ] }; }
 });
}

})();
