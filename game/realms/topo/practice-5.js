/* Topology: shape without size practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p5.js. */
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
/* "1 torus", "3 tori": counts never get a glued-on "s". */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
const SURF = [{ name: 'sphere', chi: 2 }, { name: 'torus', chi: 0 }, { name: 'projective plane', chi: 1 }, { name: 'Klein bottle', chi: 0 }];
const up1 = t => t[0].toUpperCase() + t.slice(1);
const listText = parts => parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];

/* A gluing word is a list of edges read counterclockwise from corner 1: { L: 'a', e: 1 } is a plain letter (arrow along the
   reading direction), e: −1 is the letter with ⁻¹ (arrow back), { free: true } is an edge sewn to nothing. Edge i (from 1)
   runs from corner i to corner i + 1, and edge N back to corner 1. */
const edgeText = x => x.free ? 'free' : x.L + (x.e < 0 ? '⁻¹' : '');
const wordText = w => w.map(edgeText).join(' ');
const ends = (x, i, N) => { const a = i + 1, b = (i + 1) % N + 1; return x.e > 0 ? { t: a, h: b } : { t: b, h: a }; };
/* Sew same letters tail on tail and tip on tip; return the vertex classes (lists of corners, ordered by their smallest
   corner), the class index of every corner, the sewing record for the solution text, and the counts. */
const sew = w => {
 const N = w.length, up = []; for (let i = 0; i <= N; i++) up.push(i);
 const f = x => up[x] === x ? x : (up[x] = f(up[x]));
 const u = (a, b) => { a = f(a); b = f(b); if (a !== b) up[Math.max(a, b)] = Math.min(a, b); };
 const first = {}, record = [];
 w.forEach((x, i) => { if (x.free) return; const e = ends(x, i, N);
  if (first[x.L]) { const o = first[x.L]; record.push({ L: x.L, t: [o.t, e.t], h: [o.h, e.h] }); u(o.t, e.t); u(o.h, e.h); } else first[x.L] = e; });
 const groups = {}; for (let c = 1; c <= N; c++) (groups[f(c)] = groups[f(c)] || []).push(c);
 const classes = Object.keys(groups).map(Number).sort((a, b) => a - b).map(r => groups[r]);
 const cls = []; classes.forEach((g, k) => g.forEach(c => { cls[c] = k; }));
 const pairs = w.filter(x => !x.free).length / 2, free = w.filter(x => x.free).length;
 return { N, classes, cls, record, pairs, free, V: classes.length };
};
/* Boundary circles: the free edges join vertex classes; each connected run of free edges closes up into one circle. */
const circles = (w, s) => {
 const up = s.classes.map((_, k) => k), f = x => up[x] === x ? x : (up[x] = f(up[x]));
 const touched = new Set();
 w.forEach((x, i) => { if (!x.free) return; const a = s.cls[i + 1], b = s.cls[(i + 1) % s.N + 1]; touched.add(a); touched.add(b);
  const ra = f(a), rb = f(b); if (ra !== rb) up[Math.max(ra, rb)] = Math.min(ra, rb); });
 return new Set([...touched].map(f)).size;
};
const NAMES = 'PQRSTUVW';
const freeEdge = (i, a, b) => a === b ? `edge ${n(i)} starts and ends at ${a}` : `edge ${n(i)} joins ${a} and ${b}`;
const corners = g => g.length === 1 ? `corner ${n(g[0])}` : `corners ${g.slice(0, -1).map(n).join(', ')} and ${n(g[g.length - 1])}`;
const joinText = (a, b) => a === b ? `corner ${n(a)} with itself` : `corner ${n(a)} with corner ${n(b)}`;
const sewText = s => s.record.map(r => `sewing the ${r.L} edges puts ${joinText(r.t[0], r.t[1])} (tails) and ${joinText(r.h[0], r.h[1])} (tips)`).join('; ');
const classText = s => s.classes.map((g, k) => `${NAMES[k]} = ${corners(g)}`).join('; ');
const freeText = (w, s) => w.map((x, i) => x.free ? freeEdge(i + 1, NAMES[s.cls[i + 1]], NAMES[s.cls[(i + 1) % s.N + 1]]) : '').filter(Boolean).join(', ');
/* A random word with k letters named a, b, c, d, e in order of first appearance; orient = true gives every letter once plain
   and once with ⁻¹. Free edges, when asked for, go into random places. */
const randomWord = (R, k, orient, free = 0) => {
 const slots = []; for (let i = 0; i < k; i++) slots.push(i, i); for (let i = 0; i < free; i++) slots.push(-1);
 for (let i = slots.length - 1; i > 0; i--) { const j = R.int(0, i); [slots[i], slots[j]] = [slots[j], slots[i]]; }
 const name = {}, firstE = {}; let next = 0;
 return slots.map(s => { if (s < 0) return { free: true };
  if (name[s] === undefined) { name[s] = 'abcde'[next++]; firstE[s] = R.bool() ? 1 : -1; return { L: name[s], e: firstE[s] }; }
  return { L: name[s], e: orient ? -firstE[s] : (R.bool() ? 1 : -1) }; });
};
const W = text => text.split(' ').map(t => t === 'free' ? { free: true } : { L: t[0], e: t.length > 1 ? -1 : 1 });
const same = (w, text) => wordText(w) === text;
const WORD_RULES = 'A plain letter means the edge’s arrow points the way you read; a letter with ⁻¹ means it points back.';

/* ---- q21 Graphs and surfaces with holes [H 7.5] ---- */

/* A wheel: a hub joined by a spoke to each of k rim posts, with the posts joined in a ring: V = k + 1, E = 2k, χ = 1 − k.
   A sphere (s = 0) or torus (s = 1) with b vents cut out has χ = S.chi − b, and the prompt prints that value. The worked
   example (a triangle of cables) and the parent (a grid) are not wheels, so no draw repeats them. */
mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The signal wheel',
 brief: 'A signal wheel is to be strung across the dome, and the Fabric Bay wants its cable count and the number of vents cut in a spare hull.',
 labels: ['edges E', 'χ of the wheel', 'vents cut'], tolerance: 0.01,
 gl: [['edges E'], ['χ of the wheel'], ['vents cut']]
}, {
 canonical: { k: 7, s: 0, b: 4 },
 draw: R => ({ k: R.int(4, 11), s: R.int(0, 1), b: R.int(2, 8) }),
 build: ({ k, s, b }) => { const S = SURF[s], V = k + 1, E = 2 * k, chiG = V - E, T = S.chi - b; return {
  prompt: `A signal wheel is strung across the outpost dome: one hub unit and ${n(k)} posts spaced round its rim. Each post is joined to the hub by one spoke cable and to the next post round the rim by one rim cable, so the rim cables close into a ring, and there are no other cables. Treat the wheel as a graph: the units are its vertices, the cables are its edges, and it has no faces. A spare hull shaped like a ${S.name} (χ = ${n(S.chi)}) had some round vents cut out of it, no two touching, and its Euler characteristic is now ${n(T)}. Enter the number of cables E in the wheel, then the Euler characteristic V − E of the wheel, then the number of vents that were cut.`,
  answer: [E, chiG, b],
  hints: ['Count the spokes (one for each post) and the rim cables (one between each pair of neighbouring posts round the ring), then add them. The hub is a vertex as well as the posts.', 'A graph has no faces, so its Euler characteristic is V − E. Each round vent cut out of a hull lowers its χ by 1, so the number of vents is the drop from the hull’s starting χ to its present χ.'],
  solution: `The wheel has V = ${n(k)} + 1 = ${n(V)} units (the posts and the hub). It has ${n(k)} spokes and ${n(k)} rim cables, so E = ${n(k)} + ${n(k)} = ${n(E)}. With no faces, χ = V − E = ${n(V)} − ${n(E)} = ${n(chiG)}. The ${S.name} started at χ = ${n(S.chi)} and each vent lowers χ by 1, so the number of vents is ${n(S.chi)} − ${G.par(T)} = ${n(b)}.`,
  guidance: [
   { prompt: `Each of the ${n(k)} posts has one spoke to the hub, and the ${n(k)} rim cables run between neighbouring posts round the ring. How many cables E are there?`, answer: [E], explanation: `${n(k)} spokes and ${n(k)} rim cables make E = ${n(E)}.` },
   { prompt: `The wheel has V = ${n(k + 1)} units (the hub and ${n(k)} posts), E = ${n(E)} cables and no faces. What is its Euler characteristic V − E?`, answer: [chiG], explanation: `${n(V)} − ${n(E)} = ${n(chiG)}. With no faces there is nothing to add.` },
   { prompt: `The ${S.name} began with χ = ${n(S.chi)} and now has χ = ${n(T)}. Each vent lowers χ by 1. How many vents were cut?`, answer: [b], explanation: `${n(S.chi)} − ${G.par(T)} = ${n(b)}, so ${pl(b, 'vent was', 'vents were')} cut.` }
  ] }; }
});

/* An m × c grid of junction boxes plus d braces (extra cables between two boxes not yet joined, no new boxes): V = m c,
   E = m(c − 1) + c(m − 1) + d. A sphere or torus is drilled until its χ equals the network's: b = S.chi − (V − E). */
mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Braced tunnel grid',
 brief: 'The tunnel crew has braced a junction grid, and a spare hull is to be drilled until its Euler characteristic matches the network’s.',
 labels: ['cables E', 'χ of the network', 'portholes to cut'], tolerance: 0.01,
 gl: [['cables E'], ['χ of the network'], ['portholes to cut']]
}, {
 canonical: { m: 4, c: 3, d: 2, s: 1 },
 draw: R => ({ m: R.int(3, 5), c: R.int(3, 6), d: R.int(1, 5), s: R.int(0, 1) }),
 build: ({ m, c, d, s }) => { const S = SURF[s], V = m * c, rowE = m * (c - 1), colE = c * (m - 1), grid = rowE + colE, E = grid + d, chiG = V - E, b = S.chi - chiG; return {
  prompt: `A tunnel crew lays a grid of junction boxes in ${n(m)} rows and ${n(c)} columns. Each box is joined by one cable to the box next to it along its row and to the box next to it down its column. The crew then adds ${pl(d, 'brace', 'braces')}: each brace is one more cable between two boxes that were not yet joined, and no new boxes are added. Treat the finished network as a graph (boxes are vertices, cables are edges, no faces). A closed spare hull shaped like a ${S.name} (χ = ${n(S.chi)}) is to have round portholes cut out, no two touching, until its Euler characteristic equals the network’s. Enter the total number of cables E (grid and braces), the Euler characteristic V − E of the network, then the number of portholes to cut.`,
  answer: [E, chiG, b],
  hints: ['Each row of boxes has one cable fewer than it has boxes, and so does each column. Add the cables along the rows, the cables down the columns and the braces.', 'A graph has no faces, so its Euler characteristic is V − E. Each porthole cut out of a hull lowers its χ by 1, so work out how far the hull’s χ must fall to reach the network’s.'],
  solution: `The grid has V = ${n(m)} × ${n(c)} = ${n(V)} boxes. Along the rows there are ${n(m)} × ${n(c - 1)} = ${n(rowE)} cables and down the columns ${n(c)} × ${n(m - 1)} = ${n(colE)}, which is ${n(grid)} in all. The ${pl(d, 'brace adds', 'braces add')} ${n(d)} more and no new boxes, so E = ${n(grid)} + ${n(d)} = ${n(E)}. With no faces, χ = V − E = ${n(V)} − ${n(E)} = ${n(chiG)}. The ${S.name} starts at χ = ${n(S.chi)} and each porthole lowers it by 1, so it needs ${n(S.chi)} − ${G.par(chiG)} = ${n(b)} portholes.`,
  guidance: [
   { prompt: `The grid has ${n(m)} rows of ${n(c - 1)} cables and ${n(c)} columns of ${n(m - 1)} cables, and then ${pl(d, 'brace', 'braces')} ${d === 1 ? 'is' : 'are'} added. How many cables E are there in all?`, answer: [E], explanation: `${n(rowE)} + ${n(colE)} = ${n(grid)} grid cables, and ${n(grid)} + ${n(d)} = ${n(E)}.` },
   { prompt: `The network has V = ${n(V)} boxes, E = ${n(E)} cables and no faces. What is its Euler characteristic V − E?`, answer: [chiG], explanation: `${n(V)} − ${n(E)} = ${n(chiG)}.` },
   { prompt: `The ${S.name} has χ = ${n(S.chi)}. Each porthole lowers χ by 1. How many portholes bring it down to ${n(chiG)}?`, answer: [b], explanation: `${n(S.chi)} − ${G.par(chiG)} = ${n(b)} portholes.` }
  ] }; }
});

/* Challenge, uses q19. A ladder: two rails of p posts each, a rung across every pair: V = 2p, E = 2(p − 1) + p = 3p − 2, χ = 2 − p.
   A Möbius strip (χ = 0, one boundary circle, as the prompt states) with t holes: χ = −t and 1 + t boundary circles. */
mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q19', title: 'The ladder and the strip',
 brief: 'A rung-and-rail cable ladder and a drilled Möbius strip are both on the Fabric Bay’s list, and the crew wants each one’s Euler characteristic and rims.',
 labels: ['edges E', 'χ of the ladder', 'χ of the strip with holes', 'boundary circles of the strip'], tolerance: 0.01,
 gl: [['edges E'], ['χ of the ladder'], ['χ of the strip with holes'], ['boundary circles of the strip']]
}, {
 canonical: { p: 6, t: 3 },
 draw: R => ({ p: R.int(4, 11), t: R.int(2, 7) }),
 build: ({ p, t }) => { const V = 2 * p, rails = 2 * (p - 1), E = rails + p, chiL = V - E, chiM = 0 - t, bc = 1 + t; return {
  prompt: `A cable ladder has two rails, each a straight run of ${n(p)} posts with a cable between each pair of neighbouring posts, and one rung cable across each pair of facing posts (post 1 of one rail to post 1 of the other, and so on). There are no other cables. Treat it as a graph (no faces). Separately, a Möbius strip (χ = 0, with one boundary circle, a closed loop of edge where the surface stops) has ${pl(t, 'round hole', 'round holes')} cut out of it, away from its edge and from each other. Enter the number of cables E in the ladder, the Euler characteristic V − E of the ladder, the Euler characteristic of the strip with its holes, then its number of boundary circles.`,
  answer: [E, chiL, chiM, bc],
  hints: ['Each rail of posts has one cable fewer than it has posts. Add the two rails to the rungs. The vertices are all the posts on both rails.', 'A graph has no faces, so its Euler characteristic is V − E. Each hole cut out of a surface lowers its χ by 1, and each one also adds a boundary circle to the one the strip already has.'],
  solution: `The ladder has V = 2 × ${n(p)} = ${n(V)} posts. Each rail has ${n(p - 1)} cables, so the two rails have ${n(rails)}, and there are ${n(p)} rungs: E = ${n(rails)} + ${n(p)} = ${n(E)}. With no faces, χ = V − E = ${n(V)} − ${n(E)} = ${n(chiL)}. The Möbius strip has χ = 0 and each hole lowers it by 1, so with ${pl(t, 'hole', 'holes')} χ = 0 − ${n(t)} = ${n(chiM)}. Each hole also adds one boundary circle to the strip’s one, so there are 1 + ${n(t)} = ${n(bc)}.`,
  guidance: [
   { prompt: `Each of the 2 rails has ${n(p - 1)} cables between its ${n(p)} posts, and there are ${n(p)} rungs. How many cables E does the ladder have?`, answer: [E], explanation: `2 × ${n(p - 1)} = ${n(rails)} along the rails, plus ${n(p)} rungs, makes E = ${n(E)}.` },
   { prompt: `The ladder has V = ${n(V)} posts, E = ${n(E)} cables and no faces. What is its Euler characteristic V − E?`, answer: [chiL], explanation: `${n(V)} − ${n(E)} = ${n(chiL)}.` },
   { prompt: `The Möbius strip has χ = 0, and each of its ${n(t)} holes lowers χ by 1. What is χ of the strip with its holes?`, answer: [chiM], explanation: `0 − ${n(t)} = ${n(chiM)}.` },
   { prompt: `The strip starts with 1 boundary circle and each hole adds one more. How many boundary circles does it have with its ${n(t)} holes?`, answer: [bc], explanation: `1 + ${n(t)} = ${n(bc)}.` }
  ] }; }
});

/* ---- q22 Surfaces from labelled polygons [H 7.5, 7.7] ---- */

/* A closed word of 2 to 4 letters. Not the worked example (a b a⁻¹ b⁻¹) and not the parent's canonical word. */
mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The solar sail pattern',
 brief: 'A solar sail is cut flat with letters along its rim, and the bay wants to know what closed surface it makes once the matching edges are sewn.',
 labels: ['edges E', 'vertex classes V', 'χ'], tolerance: 0.01,
 gl: [['edges E'], ['vertex classes V'], ['χ']]
}, {
 canonical: { w: W('a⁻¹ b⁻¹ c a b c⁻¹') },
 draw: R => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(2, 4), R.bool()), t = wordText(w); if (t !== 'a b a⁻¹ b⁻¹' && t !== 'a b c a⁻¹ c b⁻¹' && t !== 'a⁻¹ b⁻¹ c a b c⁻¹') return { w }; } return { w: W('a⁻¹ b⁻¹ c a b c⁻¹') }; },
 build: ({ w }) => { const s = sew(w), E = s.pairs, chi = s.V - E + 1; return {
  prompt: `A solar sail is cut as a flat polygon with ${n(s.N)} edges, and its sewing label, read counterclockwise from corner 1, is ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and so on round to edge ${n(s.N)}, which runs from corner ${n(s.N)} back to corner 1. ${WORD_RULES} Each letter appears twice, and the two edges with the same letter are sewn together with their arrows matched: tail on tail and tip on tip. The sail then becomes one closed surface whose single face is the polygon. Enter the number of edges E after sewing, then the number of vertex classes V (the points the corners become), then the Euler characteristic χ = V − E + 1.`,
  answer: [E, s.V, chi],
  hints: ['Two polygon edges with the same letter are sewn into one edge of the surface, so count letters, not polygon edges.', 'Write down the tail corner and the tip corner of every edge. Sewing two edges puts their tails together and their tips together. Keep merging corners until no sewing joins two different groups: each group left is one vertex class.'],
  solution: `Each letter names two polygon edges that become one, so the ${n(s.N)} edges give E = ${n(s.N)} ÷ 2 = ${n(E)}. Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. So V = ${n(s.V)} and χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.`,
  guidance: [
   { prompt: `Each letter names two edges of the polygon that are sewn into one. How many edges E does the surface have?`, answer: [E], explanation: `${n(s.N)} polygon edges sewn in pairs give ${n(s.N)} ÷ 2 = ${n(E)} edges.` },
   { prompt: `Join the corners that the sewing puts together, tails with tails and tips with tips. How many vertex classes V do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${up1(sewText(s))}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `V = ${n(s.V)}, E = ${n(E)} and the polygon is the one face. What is χ = V − E + 1?`, answer: [chi], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` }
  ] }; }
});

/* A closed word of 2 to 4 letters, each letter's seam with its own length in metres (lens, one per letter in order). */
mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Seam tape and corner patches',
 brief: 'The hull panel’s seams need tape and its joined-up corners need patches, so the stores must know the counts before the order goes in.',
 labels: ['corner patches', 'seam tape (m)', 'χ'], tolerance: 0.01,
 gl: [['corner patches'], ['seam tape (m)'], ['χ']]
}, {
 canonical: { w: W('a b⁻¹ b c a⁻¹ c⁻¹'), lens: [4, 7, 3] },
 draw: R => { for (let i = 0; i < 1000; i++) { const k = R.int(2, 4), w = randomWord(R, k, R.bool()), t = wordText(w); if (t !== 'a b a⁻¹ b⁻¹' && t !== 'a b c a⁻¹ c b⁻¹') { const lens = []; for (let j = 0; j < k; j++) lens.push(R.int(2, 9)); return { w, lens }; } } return { w: W('a b⁻¹ b c a⁻¹ c⁻¹'), lens: [4, 7, 3] }; },
 build: ({ w, lens }) => { const s = sew(w), E = s.pairs, chi = s.V - E + 1, tape = lens.reduce((x, y) => x + y, 0), lt = lens.map((x, i) => `${'abcde'[i]} is ${n(x)} metres`), sum = lens.map(n).join(' + ');
  return {
  prompt: `A hull panel is a flat polygon with ${n(s.N)} edges, and its gluing word, read counterclockwise from corner 1, is ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and edge ${n(s.N)} from corner ${n(s.N)} back to corner 1. ${WORD_RULES} Each letter appears twice, and the two edges with the same letter are sewn together arrow to arrow, tail on tail and tip on tip. The seams have these lengths: ${listText(lt)} (both edges of a letter have that length). One strip of seam tape is laid once along each sewn seam, and one corner patch goes on each vertex class (each point the corners become). Enter the number of corner patches, then the metres of seam tape, then the Euler characteristic χ = V − E + 1 of the closed surface (the panel is its one face).`,
  answer: [s.V, tape, chi],
  hints: ['Write down the tail corner and the tip corner of every edge, join the corners the sewing puts together, and keep merging until nothing changes. Each group left is one vertex class, so one patch.', 'A seam is a sewn pair of edges, one for each letter. The tape runs once along each seam, so add one length for each letter, not for each polygon edge.'],
  solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. So V = ${n(s.V)} and the panel needs ${pl(s.V, 'corner patch', 'corner patches')}. There is one seam for each of the ${n(E)} letters, so the tape is ${sum} = ${n(tape)} metres. With E = ${n(E)} edges after sewing and F = 1, χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.`,
  guidance: [
   { prompt: `Join the corners the sewing puts together, tails with tails and tips with tips. How many vertex classes do the ${n(s.N)} corners fall into? (One corner patch goes on each.)`, answer: [s.V], explanation: `${up1(sewText(s))}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `There is one seam, and so one strip of tape, for each letter: ${listText(lt)}. How many metres of tape in all?`, answer: [tape], explanation: `${sum} = ${n(tape)} metres. Each seam is taped once, even though it is two polygon edges.` },
   { prompt: `V = ${n(s.V)}, E = ${n(E)} (one edge for each letter) and F = 1. What is χ = V − E + F?`, answer: [chi], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` }
  ] }; }
});

/* Challenge: a word of 5 letters (10 edges), with the size of the biggest vertex class asked as well. */
mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', title: 'The ten-edge canopy',
 brief: 'A large canopy has ten edges to sew in five pairs, and the bay wants its corner groups and its Euler characteristic before the first stitch.',
 labels: ['vertex classes V', 'corners in the biggest class', 'χ'], tolerance: 0.01,
 gl: [['vertex classes V'], ['corners in the biggest class'], ['χ']]
}, {
 canonical: { w: W('a b c d e a⁻¹ d⁻¹ c b⁻¹ e⁻¹') },
 draw: R => ({ w: randomWord(R, 5, R.bool()) }),
 build: ({ w }) => { const s = sew(w), E = s.pairs, chi = s.V - E + 1, big = Math.max(...s.classes.map(g => g.length)); return {
  prompt: `A large canopy is cut as a flat polygon with ${n(s.N)} edges, and its gluing word, read counterclockwise from corner 1, is ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and edge ${n(s.N)} from corner ${n(s.N)} back to corner 1. ${WORD_RULES} Each letter appears twice, and the two edges with the same letter are sewn together arrow to arrow, tail on tail and tip on tip. The corners fall into vertex classes, the points they become. Enter the number of vertex classes V, then the largest number of corners that fall into any one class, then the Euler characteristic χ = V − E + 1 of the closed surface (the canopy is its one face).`,
  answer: [s.V, big, chi],
  hints: ['Write down the tail corner and the tip corner of every edge. Sewing two edges with the same letter puts their tails together and their tips together. Keep merging groups that share a corner until nothing changes.', 'Count the corners in each group once the merging has stopped. E is the number of letters, and the canopy is the one face.'],
  solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. So V = ${n(s.V)}, and the largest class has ${n(big)} corners. The ${n(s.N)} edges are sewn in pairs into E = ${n(E)} edges and the canopy is F = 1 face, so χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.`,
  guidance: [
   { prompt: `Join the corners the sewing puts together, tails with tails and tips with tips. How many vertex classes do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${up1(sewText(s))}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `The classes are ${classText(s)}. How many corners are in the largest class?`, answer: [big], explanation: `Counting the corners in each class, the largest has ${n(big)}.` },
   { prompt: `V = ${n(s.V)}, E = ${n(E)} (one edge for each of the ${n(E)} letters) and F = 1. What is χ?`, answer: [chi], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` }
  ] }; }
});

/* ---- q23 Chapter review: closing a hull [H 7.5] ---- */

/* Words with 1 or 2 sewn pairs and 1 to 3 free edges, at least 3 edges. Not the worked example (a free a free) and not
   the parent's canonical word (a free b a⁻¹ free b). */
const freeWord = (R, maxFree) => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(1, 2), false, R.int(1, maxFree)), t = wordText(w);
 if (w.length >= 3 && t.replace(/⁻¹/g, '') !== 'a free a free' && t !== 'a free b a⁻¹ free b' && t !== 'a b free a free b⁻¹') return w; } return W('a b free a free b⁻¹'); };
const capSolution = (w, s, bc, chiP, chiC) => { const E = s.pairs + s.free, sewn = s.record.length ? `${up1(sewText(s))}. ` : '';
 return `${sewn}The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. ${s.free === 1 ? 'The free edge' : 'The free edges'}: ${freeText(w, s)}. Following ${s.free === 1 ? 'it' : 'them'} from point to point gives ${pl(bc, 'boundary circle', 'boundary circles')}. There are E = ${n(s.pairs)} + ${n(s.free)} = ${n(E)} edges after sewing (the sewn pairs and the free edges) and F = 1 face, so the sewn panel has χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chiP)}. Sewing a disc onto each boundary circle adds ${pl(bc, 'face', 'faces')}, so the closed hull has χ = ${n(chiP)} + ${n(bc)} = ${n(chiC)}.`; };
const WORD_FREE = 'Each letter appears twice, and those two edges are sewn arrow to arrow, tail on tail and tip on tip (a letter with ⁻¹ has its arrow pointing back against the reading direction). Each “free” is an edge sewn to nothing, and the free edges make up the boundary circles of the sewn panel.';

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The airlock awning',
 brief: 'An awning for the airlock is only half sewn, and the bay wants its corner count, its open rims and the Euler characteristic of the hull it becomes when capped.',
 labels: ['vertex classes V', 'boundary circles', 'χ of the closed hull'], tolerance: 0.01,
 gl: [['vertex classes V'], ['boundary circles'], ['χ of the closed hull']]
}, {
 canonical: { w: W('a⁻¹ free b⁻¹ free a⁻¹ b⁻¹ free') },
 draw: R => ({ w: freeWord(R, 3) }),
 build: ({ w }) => { const s = sew(w), E = s.pairs + s.free, chiP = s.V - E + 1, bc = circles(w, s), chiC = chiP + bc; return {
  prompt: `An airlock awning is cut as a polygon with ${n(s.N)} edges, read counterclockwise from corner 1: ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and so on round to edge ${n(s.N)}, which runs from corner ${n(s.N)} back to corner 1. ${WORD_FREE} Enter the number of vertex classes V (the points the corners become after sewing), then the number of boundary circles, then the Euler characteristic of the closed hull made by sewing a disc onto every boundary circle.`,
  answer: [s.V, bc, chiC],
  hints: ['Join the corners that the sewn letters put together, tails with tails and tips with tips, and keep merging until nothing changes: each group left is one vertex class.', 'Each free edge runs from one class to another (or back to the same one). Follow free edges from point to point until you return to where you started: each loop is one boundary circle. Count every edge after sewing: the letters and the free edges. Each disc sewn on adds one face.'],
  solution: capSolution(w, s, bc, chiP, chiC),
  guidance: [
   { prompt: `Join the corners that the sewn letters put together, tails with tails and tips with tips. How many vertex classes V do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${s.record.length ? up1(sewText(s)) + '. ' : ''}That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `Follow the free edges from class to class until you are back where you began. How many boundary circles does the sewn panel have?`, answer: [bc], explanation: `The free edges: ${freeText(w, s)}. ${s.free === 1 ? 'That free edge closes' : 'Those free edges close'} up into ${pl(bc, 'loop', 'loops')}.` },
   { prompt: `The sewn panel has V = ${n(s.V)}, E = ${n(E)} (sewn pairs and free edges) and F = 1. Each of its ${pl(bc, 'boundary circle', 'boundary circles')} is capped by a disc that adds one face. What is χ of the closed hull?`, answer: [chiC], explanation: `The panel has χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chiP)}, and ${pl(bc, 'disc adds', 'discs add')} ${n(bc)}: ${n(chiP)} + ${n(bc)} = ${n(chiC)}.` }
  ] }; }
});

/* The same words; each free edge is len metres long, the binding tape weighs tape kg per metre and each cap disc cap kg. */
mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Capping the airlock rims',
 brief: 'The airlock panel’s loose rims will be taped and capped, and the store must know how much the finished fabric weighs.',
 labels: ['boundary circles', 'χ of the closed hull', 'mass (kg)'], tolerance: 0.01,
 gl: [['boundary circles'], ['χ of the closed hull'], ['mass (kg)']]
}, {
 canonical: { w: W('a free free b a⁻¹ b free'), len: 3, tape: 4, cap: 15 },
 draw: R => ({ w: freeWord(R, 3), len: R.int(2, 5), tape: R.int(2, 6), cap: R.int(8, 20) }),
 build: ({ w, len, tape, cap }) => { const s = sew(w), E = s.pairs + s.free, chiP = s.V - E + 1, bc = circles(w, s), chiC = chiP + bc, tapeKg = s.free * len * tape, mass = bc * cap + tapeKg; return {
  prompt: `A hull panel is a polygon with ${n(s.N)} edges, read counterclockwise from corner 1: ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and so on round to edge ${n(s.N)}, which runs from corner ${n(s.N)} back to corner 1. ${WORD_FREE} Every free edge is ${n(len)} metres long and is bound with tape weighing ${n(tape)} kg for each metre. Every boundary circle is then capped by one disc weighing ${n(cap)} kg, which closes the hull. Enter the number of boundary circles, then the Euler characteristic of the closed hull, then the total mass in kilograms of the binding tape and the cap discs together.`,
  answer: [bc, chiC, mass],
  hints: ['Find the vertex classes first. Each free edge runs from one class to another (or back to the same one). Follow free edges from point to point until you return to where you started: each loop is one boundary circle.', 'Count every edge after sewing for χ: the letters and the free edges, with the panel as the one face; each disc adds one face. For the mass, the tape goes along each free edge once and one disc goes on each circle.'],
  solution: `${capSolution(w, s, bc, chiP, chiC)} The ${pl(s.free, 'free edge is', 'free edges are')} ${n(len)} metres long with ${n(tape)} kg of tape for each metre, so the tape weighs ${n(s.free)} × ${n(len)} × ${n(tape)} = ${n(tapeKg)} kg, and the ${pl(bc, 'disc weighs', 'discs weigh')} ${n(bc)} × ${n(cap)} = ${n(bc * cap)} kg. The total is ${n(tapeKg)} + ${n(bc * cap)} = ${n(mass)} kg.`,
  guidance: [
   { prompt: `Find the vertex classes, then follow the free edges between them. How many boundary circles does the sewn panel have?`, answer: [bc], explanation: `${s.record.length ? up1(sewText(s)) + '. ' : ''}The classes are ${classText(s)}, and ${freeText(w, s)}. ${s.free === 1 ? 'That free edge closes' : 'Those free edges close'} up into ${pl(bc, 'loop', 'loops')}.` },
   { prompt: `The sewn panel has V = ${n(s.V)}, E = ${n(E)} (sewn pairs and free edges) and F = 1, and ${bc === 1 ? 'its one boundary circle is' : `each of its ${n(bc)} boundary circles is`} capped by a disc that adds one face. What is χ of the closed hull?`, answer: [chiC], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chiP)} for the panel, and ${n(chiP)} + ${n(bc)} = ${n(chiC)} once the circles are capped.` },
   { prompt: `There ${s.free === 1 ? 'is' : 'are'} ${pl(s.free, 'free edge', 'free edges')} of ${n(len)} metres at ${n(tape)} kg for each metre, and ${pl(bc, 'cap disc', 'cap discs')} at ${n(cap)} kg each. What is the total mass in kilograms?`, answer: [mass], explanation: `Tape: ${n(s.free)} × ${n(len)} × ${n(tape)} = ${n(tapeKg)} kg. Discs: ${n(bc)} × ${n(cap)} = ${n(bc * cap)} kg. Total ${n(mass)} kg.` }
  ] }; }
});

/* Challenge, uses q21: k of the rims are capped (1 to the number of circles) and then p round portholes are cut out of the
   result: the circles left are bc − k + p and χ = χ(panel) + k − p. */
mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q21', title: 'Capped, then drilled',
 brief: 'Some rims of a sewn panel are capped and then portholes are drilled in the fabric, and the bay needs the Euler characteristic and the rims at the end.',
 labels: ['boundary circles of the panel', 'χ of the panel', 'boundary circles at the end', 'χ at the end'], tolerance: 0.01,
 gl: [['boundary circles of the panel'], ['χ of the panel'], ['boundary circles at the end'], ['χ at the end']]
}, {
 canonical: { w: W('a free free b⁻¹ b a⁻¹ free'), k: 2, p: 3 },
 draw: R => { const w = freeWord(R, 3), bc = circles(w, sew(w)); return { w, k: R.int(1, bc), p: R.int(1, 4) }; },
 build: ({ w, k, p }) => { const s = sew(w), E = s.pairs + s.free, chiP = s.V - E + 1, bc = circles(w, s), left = bc - k + p, chiF = chiP + k - p; return {
  prompt: `A hull panel is a polygon with ${n(s.N)} edges, read counterclockwise from corner 1: ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and so on round to edge ${n(s.N)}, which runs from corner ${n(s.N)} back to corner 1. ${WORD_FREE} Once the panel is sewn, ${pl(k, 'boundary circle is', 'boundary circles are')} capped, each with its own disc (the panel has at least that many), and then ${pl(p, 'round porthole is', 'round portholes are')} cut out of the surface, away from every edge and from each other. Enter the number of boundary circles of the sewn panel, then its Euler characteristic V − E + F, then the number of boundary circles at the end, then the Euler characteristic at the end.`,
  answer: [bc, chiP, left, chiF],
  hints: ['Find the vertex classes, then follow the free edges from point to point: each loop is one boundary circle. Count every edge after sewing, the letters and the free edges, with the panel as the one face.', 'Each disc sewn onto a circle adds one face and takes away one boundary circle. Each porthole cut out removes one face and adds one boundary circle.'],
  solution: `${capSolution(w, s, bc, chiP, chiP + bc).replace(/ Sewing a disc onto each boundary circle adds.*$/, '')} Capping ${pl(k, 'circle', 'circles')} adds ${pl(k, 'face', 'faces')} and takes away ${n(k)} of the circles, and cutting ${pl(p, 'porthole', 'portholes')} removes ${pl(p, 'face', 'faces')} and adds ${pl(p, 'circle', 'circles')}. So the boundary circles at the end number ${n(bc)} − ${n(k)} + ${n(p)} = ${n(left)}, and χ = ${n(chiP)} + ${n(k)} − ${n(p)} = ${n(chiF)}.`,
  guidance: [
   { prompt: `Find the vertex classes, then follow the free edges between them. How many boundary circles does the sewn panel have?`, answer: [bc], explanation: `${s.record.length ? up1(sewText(s)) + '. ' : ''}The classes are ${classText(s)}, and ${freeText(w, s)}. ${s.free === 1 ? 'That free edge closes' : 'Those free edges close'} up into ${pl(bc, 'loop', 'loops')}.` },
   { prompt: `The sewn panel has V = ${n(s.V)}, E = ${n(E)} (sewn pairs and free edges) and F = 1. What is its Euler characteristic?`, answer: [chiP], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chiP)}.` },
   { prompt: `The panel has ${pl(bc, 'boundary circle', 'boundary circles')}. Capping ${n(k)} of them takes away ${n(k)}, and each of the ${n(p)} portholes adds one. How many boundary circles are there at the end?`, answer: [left], explanation: `${n(bc)} − ${n(k)} + ${n(p)} = ${n(left)}.` },
   { prompt: `Each disc raises χ by 1 and each porthole lowers it by 1. Starting from χ = ${n(chiP)}, with ${pl(k, 'disc', 'discs')} and ${pl(p, 'porthole', 'portholes')}, what is χ at the end?`, answer: [chiF], explanation: `${n(chiP)} + ${n(k)} − ${n(p)} = ${n(chiF)}.` }
  ] }; }
});

/* ---- q24 Connected sums [H 7.5] ---- */

/* Four surfaces a, b, c, d: indices 0–3 into SURF (sphere 2, torus 0, projective plane 1, Klein bottle 0, as the prompt states). */
mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The four-module chain',
 brief: 'The habitat ring is to be made from four hull modules joined one after another, and the engineers want its Euler characteristic early and at the end.',
 labels: ['χ of the first two joined', 'χ of all four joined'], tolerance: 0.01,
 gl: [['χ of the first two joined'], ['χ with the third joined'], ['χ of all four joined']]
}, {
 canonical: { a: 1, b: 2, c: 0, d: 3 },
 draw: R => ({ a: R.int(0, 3), b: R.int(0, 3), c: R.int(0, 3), d: R.int(0, 3) }),
 build: ({ a, b, c, d }) => { const A = SURF[a], B = SURF[b], C = SURF[c], D = SURF[d], x1 = A.chi + B.chi - 2, x2 = x1 + C.chi - 2, x3 = x2 + D.chi - 2; return {
  prompt: `A habitat ring is built from four hull modules joined one after another by connected sum: a small round hole is cut in each of the two surfaces being joined, and a short tube is sewn between the holes. The modules, in the order they are joined, are a ${A.name}, a ${B.name}, a ${C.name} and a ${D.name}. Their Euler characteristics are: sphere 2, torus 0, projective plane 1, Klein bottle 0. Each new module is joined on to the result so far. Enter χ of the first two modules joined, then χ of all four joined.`,
  answer: [x1, x3],
  hints: ['Cutting a hole takes one face away from each surface, and the tube adds nothing to V − E + F. So χ(A # B) = χ(A) + χ(B) − 2.', 'Join one module at a time: use the χ of the result so far as χ(A) for the next join, and take away 2 every time. Three joins take away 2 three times.'],
  solution: `χ(${A.name} # ${B.name}) = ${n(A.chi)} + ${n(B.chi)} − 2 = ${n(x1)}. Joining the ${C.name} (χ = ${n(C.chi)}): ${n(x1)} + ${n(C.chi)} − 2 = ${n(x2)}. Joining the ${D.name} (χ = ${n(D.chi)}): ${n(x2)} + ${n(D.chi)} − 2 = ${n(x3)}.`,
  guidance: [
   { prompt: `χ(${A.name}) = ${n(A.chi)} and χ(${B.name}) = ${n(B.chi)}. What is χ of the two joined?`, answer: [x1], explanation: `${n(A.chi)} + ${n(B.chi)} − 2 = ${n(x1)}.` },
   { prompt: `Now join the ${C.name} (χ = ${n(C.chi)}) to a surface with χ = ${n(x1)}. What is χ of the result?`, answer: [x2], explanation: `${n(x1)} + ${n(C.chi)} − 2 = ${n(x2)}.` },
   { prompt: `Finally join the ${D.name} (χ = ${n(D.chi)}) to a surface with χ = ${n(x2)}. What is χ of all four joined?`, answer: [x3], explanation: `${n(x2)} + ${n(D.chi)} − 2 = ${n(x3)}.` }
  ] }; }
});

/* n copies of the same surface (x = 1 torus, 2 projective plane, 3 Klein bottle) joined in a chain with n − 1 tubes of w kg:
   χ(n copies) = n χ − 2 (n − 1). */
mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'A string of identical pods',
 brief: 'The gallery will string identical pods together with tubes, and the store needs the finished model’s Euler characteristic and the tube mass.',
 labels: ['χ of two pods joined', 'χ of the whole string', 'tube mass (kg)'], tolerance: 0.01,
 gl: [['χ of two pods joined'], ['χ of the whole string'], ['tube mass (kg)']]
}, {
 canonical: { x: 2, m: 5, w: 6 },
 draw: R => ({ x: R.int(1, 3), m: R.int(3, 8), w: R.int(4, 9) }),
 build: ({ x, m, w }) => { const X = SURF[x], two = 2 * X.chi - 2, whole = m * X.chi - 2 * (m - 1), tubes = m - 1, mass = tubes * w; return {
  prompt: `The Hull Gallery strings ${n(m)} identical pods together, each pod a ${X.name} (χ = ${n(X.chi)}). They are joined one after another by connected sum: the second pod is joined to the first, the third to that result, and so on, with one short tube sewn between each join (a small hole is cut in each of the two surfaces and the tube is sewn between the holes). Each tube weighs ${n(w)} kg. Use χ(A # B) = χ(A) + χ(B) − 2. Enter χ of the first two pods joined, then χ of the whole string of ${n(m)}, then the total mass of the tubes in kilograms.`,
  answer: [two, whole, mass],
  hints: ['Each join uses the rule χ(A # B) = χ(A) + χ(B) − 2, with the result so far as A and the next pod as B. Each join takes away 2.', 'Joining pods one after another needs one tube less than there are pods. Count the joins, then multiply by the mass of one tube. For χ, add up all the pods’ χ and take away 2 for every join.'],
  solution: `Two pods: χ = ${n(X.chi)} + ${n(X.chi)} − 2 = ${n(two)}. Each further pod adds ${n(X.chi)} and takes away 2, and there are ${n(m)} − 1 = ${n(tubes)} joins in all, so χ = ${n(m)} × ${n(X.chi)} − 2 × ${n(tubes)} = ${n(whole)}. There is one tube for each join, so the tubes weigh ${n(tubes)} × ${n(w)} = ${n(mass)} kg.`,
  guidance: [
   { prompt: `Each pod has χ = ${n(X.chi)}. What is χ of two pods joined, χ(A) + χ(B) − 2?`, answer: [two], explanation: `${n(X.chi)} + ${n(X.chi)} − 2 = ${n(two)}.` },
   { prompt: `A string of ${n(m)} pods has ${n(m)} − 1 joins. Each pod adds χ = ${n(X.chi)} and each join takes away 2. What is χ of the whole string?`, answer: [whole], explanation: `${n(m)} × ${n(X.chi)} − 2 × ${n(tubes)} = ${n(whole)}.` },
   { prompt: `There is one tube for each of the ${n(tubes)} joins, and each tube weighs ${n(w)} kg. What is the total mass of the tubes in kilograms?`, answer: [mass], explanation: `${n(tubes)} × ${n(w)} = ${n(mass)} kg.` }
  ] }; }
});

/* Challenge, uses q21: A with pa portholes and B with pb portholes (a, b indices into SURF): χ(A with holes) = χ(A) − pa. */
mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q21', title: 'Joined hulls with portholes',
 brief: 'Two drilled hull models are to be joined by a tube, and the gallery wants each model’s Euler characteristic before and after.',
 labels: ['χ of the first model', 'χ of the second model', 'χ of the joined model'], tolerance: 0.01,
 gl: [['χ of the first model'], ['χ of the second model'], ['χ of the joined model']]
}, {
 canonical: { a: 3, b: 2, pa: 2, pb: 3 },
 draw: R => ({ a: R.int(0, 3), b: R.int(0, 3), pa: R.int(1, 4), pb: R.int(1, 4) }),
 build: ({ a, b, pa, pb }) => { const A = SURF[a], B = SURF[b], ca = A.chi - pa, cb = B.chi - pb, j = ca + cb - 2; return {
  prompt: `The Hull Gallery has two drilled models. The first is a ${A.name} (χ = ${n(A.chi)}) with ${pl(pa, 'round porthole', 'round portholes')} cut out of it, and the second is a ${B.name} (χ = ${n(B.chi)}) with ${pl(pb, 'round porthole', 'round portholes')} cut out, no two portholes touching. Each porthole cut out lowers χ by 1. The two models are then joined by connected sum, with the tube sewn between two new holes cut well away from every porthole, and the rule χ(A # B) = χ(A) + χ(B) − 2 still holds for surfaces with portholes. Enter the Euler characteristic of the first model with its portholes, then of the second, then of the joined model.`,
  answer: [ca, cb, j],
  hints: ['Each porthole removes one face of a cell division and keeps every vertex and edge, so each one lowers χ by 1. Do this for each model before joining.', 'For the joined model, use χ(A # B) = χ(A) + χ(B) − 2 with the two χ values you already found, the ones that count the portholes.'],
  solution: `The ${A.name} with ${pl(pa, 'porthole', 'portholes')} has χ = ${n(A.chi)} − ${n(pa)} = ${n(ca)}. The ${B.name} with ${pl(pb, 'porthole', 'portholes')} has χ = ${n(B.chi)} − ${n(pb)} = ${n(cb)}. Joined: χ = ${n(ca)} + ${G.par(cb)} − 2 = ${n(j)}.`,
  guidance: [
   { prompt: `The ${A.name} has χ = ${n(A.chi)} and ${pl(pa, 'porthole', 'portholes')} cut out, each lowering χ by 1. What is its χ now?`, answer: [ca], explanation: `${n(A.chi)} − ${n(pa)} = ${n(ca)}.` },
   { prompt: `The ${B.name} has χ = ${n(B.chi)} and ${pl(pb, 'porthole', 'portholes')} cut out. What is its χ now?`, answer: [cb], explanation: `${n(B.chi)} − ${n(pb)} = ${n(cb)}.` },
   { prompt: `Join a model with χ = ${n(ca)} to one with χ = ${n(cb)} by connected sum. What is χ of the result?`, answer: [j], explanation: `${n(ca)} + ${G.par(cb)} − 2 = ${n(j)}.` }
  ] }; }
});

/* ---- q25 Genus [H 7.5] ---- */

/* Genus h (1–12) from the printed χ = 2 − 2h, and χ for a second genus g (1–12, not h). Not the parent's example (2 and −4). */
mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'Docking arms on the habitat',
 brief: 'Habitat shells are rated by how many docking arms they carry, and the register wants the arm count of one shell and the Euler characteristic of another.',
 labels: ['genus', 'Euler characteristic'], tolerance: 0.01,
 gl: [['genus'], ['Euler characteristic']]
}, {
 canonical: { g: 4, h: 6 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { g: R.int(1, 12), h: R.int(1, 12) }; if (p.g !== p.h && !(p.g === 2 && p.h === 3)) return p; } return { g: 4, h: 6 }; },
 build: ({ g, h }) => { const c = 2 - 2 * h, x = 2 - 2 * g; return {
  prompt: `The outpost’s habitat shells are spheres with docking arms: each arm is a handle, a torus joined on by connected sum, and a shell with g arms has genus g. Each torus joined on lowers χ by 2 from the sphere’s χ = 2. One shell has Euler characteristic ${n(c)}. Another has ${pl(g, 'docking arm', 'docking arms')}. Enter the genus of the first shell, then the Euler characteristic of the second.`,
  answer: [h, x],
  hints: ['Starting from the sphere’s χ = 2, each arm lowers χ by 2, so a shell with g arms has χ = 2 − 2g.', 'To find the genus from χ, run the rule backwards: g = (2 − χ) ÷ 2. Take care with the sign when χ is negative.'],
  solution: `Each arm lowers χ by 2 from the sphere’s 2, so χ = 2 − 2g. For χ = ${n(c)}: g = (2 − ${G.par(c)}) ÷ 2 = ${n(2 - c)} ÷ 2 = ${n(h)}. For ${pl(g, 'arm', 'arms')}: χ = 2 − 2 × ${n(g)} = ${n(x)}.`,
  guidance: [
   { prompt: `Solve 2 − 2g = ${n(c)} for g. What is the genus of the first shell?`, answer: [h], explanation: `2g = 2 − ${G.par(c)} = ${n(2 - c)}, so g = ${n(h)}.` },
   { prompt: `Each arm lowers χ by 2, from the sphere’s 2. What is χ for ${pl(g, 'arm', 'arms')}?`, answer: [x], explanation: `2 − 2 × ${n(g)} = ${n(x)}.` }
  ] }; }
});

/* Two habitats of genus g1 and g2 joined by connected sum: χ = (2 − 2 g1) + (2 − 2 g2) − 2, genus g1 + g2. */
mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Two habitats become one',
 brief: 'Two habitat shells are to be merged into one, and the register needs its Euler characteristic and how many arms-worth of handles it ends with.',
 labels: ['χ of the first shell', 'χ of the merged shell', 'genus of the merged shell'], tolerance: 0.01,
 gl: [['χ of the first shell'], ['χ of the merged shell'], ['genus of the merged shell']]
}, {
 canonical: { g1: 3, g2: 5 },
 draw: R => ({ g1: R.int(1, 9), g2: R.int(1, 9) }),
 build: ({ g1, g2 }) => { const x1 = 2 - 2 * g1, x2 = 2 - 2 * g2, xj = x1 + x2 - 2, gj = (2 - xj) / 2; return {
  prompt: `The outpost’s habitat shells are spheres with handles, and a shell of genus g has g handles and χ = 2 − 2g. A shell of genus ${n(g1)} and a shell of genus ${n(g2)} are merged into one surface by connected sum, using χ(A # B) = χ(A) + χ(B) − 2. The merged shell is again a sphere with handles. Enter the Euler characteristic of the genus ${n(g1)} shell, then the Euler characteristic of the merged shell, then the genus of the merged shell.`,
  answer: [x1, xj, gj],
  hints: ['A shell of genus g has χ = 2 − 2g. Work out the χ of each of the two shells first.', 'Join them with χ(A # B) = χ(A) + χ(B) − 2. Then find the genus from χ by running the rule backwards: g = (2 − χ) ÷ 2.'],
  solution: `The genus ${n(g1)} shell has χ = 2 − 2 × ${n(g1)} = ${n(x1)}, and the genus ${n(g2)} shell has χ = 2 − 2 × ${n(g2)} = ${n(x2)}. Merged: χ = ${n(x1)} + ${G.par(x2)} − 2 = ${n(xj)}. The genus is g = (2 − ${G.par(xj)}) ÷ 2 = ${n(2 - xj)} ÷ 2 = ${n(gj)}.`,
  guidance: [
   { prompt: `What is χ for the shell of genus ${n(g1)}, using χ = 2 − 2g?`, answer: [x1], explanation: `2 − 2 × ${n(g1)} = ${n(x1)}.` },
   { prompt: `The genus ${n(g2)} shell has χ = ${n(x2)}. Join it to a shell with χ = ${n(x1)} by connected sum. What is χ of the merged shell?`, answer: [xj], explanation: `${n(x1)} + ${G.par(x2)} − 2 = ${n(xj)}.` },
   { prompt: `Solve 2 − 2g = ${n(xj)} for g. What is the genus of the merged shell?`, answer: [gj], explanation: `2g = 2 − ${G.par(xj)} = ${n(2 - xj)}, so g = ${n(gj)}.` }
  ] }; }
});

/* Challenge, uses q21: a hull of genus g with b round portholes has the printed χ = 2 − 2g − b; d more portholes are cut later. */
mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q21', title: 'The drilled hull',
 brief: 'A drilled hull has lost its record card, and the register must recover its handles from the Euler characteristic it still shows.',
 labels: ['χ before drilling', 'genus', 'χ after more portholes'], tolerance: 0.01,
 gl: [['χ before drilling'], ['genus'], ['χ after more portholes']]
}, {
 canonical: { g: 4, b: 3, d: 2 },
 draw: R => ({ g: R.int(1, 12), b: R.int(1, 6), d: R.int(1, 5) }),
 build: ({ g, b, d }) => { const x0 = 2 - 2 * g, c = x0 - b, e = c - d; return {
  prompt: `A closed hull was a sphere with some handles, so that its genus g counts its handles and χ = 2 − 2g. Then ${pl(b, 'round porthole was', 'round portholes were')} cut out of it, no two touching, and each porthole lowers χ by 1. Its Euler characteristic is now ${n(c)}. Enter the Euler characteristic of the hull before any portholes were cut, then its genus, then the Euler characteristic it will have if ${pl(d, 'more porthole is', 'more portholes are')} cut out as well.`,
  answer: [x0, g, e],
  hints: ['Each porthole lowered χ by 1, so put the lost amount back to find the χ of the closed hull. Then use χ = 2 − 2g on that closed hull, not on the drilled one.', 'To find the genus from the closed hull’s χ, run the rule backwards: g = (2 − χ) ÷ 2. For the last answer, take away 1 for each further porthole.'],
  solution: `The ${pl(b, 'porthole', 'portholes')} lowered χ by ${n(b)}, so the closed hull had χ = ${n(c)} + ${n(b)} = ${n(x0)}. Then g = (2 − ${G.par(x0)}) ÷ 2 = ${n(2 - x0)} ÷ 2 = ${n(g)}. With ${pl(d, 'more porthole', 'more portholes')} cut out, χ = ${n(c)} − ${n(d)} = ${n(e)}.`,
  guidance: [
   { prompt: `The hull now has χ = ${n(c)} after ${pl(b, 'porthole', 'portholes')}, each of which lowered χ by 1. What was χ before any portholes were cut?`, answer: [x0], explanation: `${n(c)} + ${n(b)} = ${n(x0)}.` },
   { prompt: `The closed hull had χ = ${n(x0)}. Solve 2 − 2g = ${n(x0)} for g. What is its genus?`, answer: [g], explanation: `2g = 2 − ${G.par(x0)} = ${n(2 - x0)}, so g = ${n(g)}.` },
   { prompt: `The hull now has χ = ${n(c)}. What is χ after ${pl(d, 'more porthole', 'more portholes')} ${d === 1 ? 'is' : 'are'} cut out?`, answer: [e], explanation: `${n(c)} − ${n(d)} = ${n(e)}.` }
  ] }; }
});

})();
