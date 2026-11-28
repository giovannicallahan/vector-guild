/* Topology: shape without size mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* "1 torus", "3 tori": counts never get a glued-on "s". */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
/* A gluing word is a list of edges read counterclockwise from corner 1: { L: 'a', e: 1 } is a plain letter (arrow along the
   reading direction), e: −1 is the letter with ⁻¹ (arrow back), { free: true } is an edge sewn to nothing. Edge i (from 1)
   runs from corner i to corner i + 1, and edge N back to corner 1. */
const edgeText = x => x.free ? 'free' : x.L + (x.e < 0 ? '⁻¹' : '');
const wordText = w => w.map(edgeText).join(' ');
const ends = (x, i, N) => { const a = i + 1, b = (i + 1) % N + 1; return x.e > 0 ? { t: a, h: b } : { t: b, h: a }; };
/* Sew same letters tail on tail and tip on tip; return the vertex classes (each a sorted list of corners, ordered by their
   smallest corner), the class index of every corner, the sewing record for the solution text, and the counts. */
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
const orientable = w => { const seen = {}; let ok = 1; w.forEach(x => { if (x.free) return; if (seen[x.L] !== undefined && seen[x.L] === x.e) ok = 0; seen[x.L] = x.e; }); return ok; };
const sameWay = w => { const seen = {}; for (const x of w) { if (x.free) continue; if (seen[x.L] === x.e) return x.L; seen[x.L] = x.e; } return ''; };
/* A random closed word with k letters, named a, b, c, d in order of first appearance; orient = true gives every letter once
   plain and once with ⁻¹. Free edges, when asked for, go into random places. */
const randomWord = (R, k, orient, free = 0) => {
 const slots = []; for (let i = 0; i < k; i++) slots.push(i, i); for (let i = 0; i < free; i++) slots.push(-1);
 for (let i = slots.length - 1; i > 0; i--) { const j = R.int(0, i); [slots[i], slots[j]] = [slots[j], slots[i]]; }
 const name = {}, firstE = {}; let next = 0;
 return slots.map(s => { if (s < 0) return { free: true };
  if (name[s] === undefined) { name[s] = 'abcd'[next++]; firstE[s] = R.bool() ? 1 : -1; return { L: name[s], e: firstE[s] }; }
  return { L: name[s], e: orient ? -firstE[s] : (R.bool() ? 1 : -1) }; });
};
const W = text => text.split(' ').map(t => t === 'free' ? { free: true } : { L: t[0], e: t.length > 1 ? -1 : 1 });
const same = (w, text) => wordText(w) === text;
const SURF = [{ name: 'sphere', chi: 2 }, { name: 'torus', chi: 0 }, { name: 'projective plane', chi: 1 }, { name: 'Klein bottle', chi: 0 }];
/* The radii and curvatures of q30: 1 ÷ s² has at most four decimals, and 1 ÷ √k is a short decimal. */
const RADII = [2, 4, 5, 10, 20, 25, 50, 0.5, 1.25, 2.5, 12.5];
const CURVES = [0.0004, 0.0016, 0.0025, 0.0064, 0.01, 0.04, 0.16, 0.25, 0.64, 4];
const sqrtK = k => G.tidy(1 / Math.sqrt(k));
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* An m × c grid graph (m rows, c columns, both at least 3 so no "1 cables") and a sphere (s = 0) or torus (s = 1) with
    b >= 2 portholes. The worked example (a triangle of cables, a sphere with one hole) is not a grid, so no draw repeats it. */
 q21: {
  canonical: { m: 3, c: 5, s: 1, b: 3 },
  draw: R => ({ m: R.int(3, 6), c: R.int(3, 7), s: R.int(0, 1), b: R.int(2, 6) }),
  build: ({ m, c, s, b }) => { const S = SURF[s], V = m * c, rowE = m * (c - 1), colE = c * (m - 1), E = rowE + colE, chiG = V - E, chiH = S.chi - b; return {
   prompt: `In the Fabric Bay a cable loom is laid out as a grid of junctions in ${n(m)} rows and ${n(c)} columns. Each junction is joined by one straight cable to the junction next to it along its row and to the junction next to it down its column, and there are no other cables. Treat the loom as a graph: the junctions are its vertices, the cables are its edges, and it has no faces. Separately, a closed hull shaped like a ${S.name} (χ = ${n(S.chi)}) has ${n(b)} round portholes cut out of it, no two touching. Enter the number of edges E of the loom, then the Euler characteristic V − E of the loom, then the Euler characteristic of the hull with its portholes cut out.`,
   answer: [E, chiG, chiH],
   hints: ['In a grid, each row of junctions has one cable fewer than it has junctions, and so does each column. Add the cables along the rows to the cables down the columns.', 'A graph has no faces, so its Euler characteristic is V − E. Cutting out a porthole removes one face and keeps every vertex and edge, so each porthole lowers χ by 1.'],
   solution: `The loom has V = ${n(m)} × ${n(c)} = ${n(V)} junctions. Along the rows there are ${n(m)} × ${n(c - 1)} = ${n(rowE)} cables and down the columns ${n(c)} × ${n(m - 1)} = ${n(colE)}, so E = ${n(rowE)} + ${n(colE)} = ${n(E)}. A graph has no faces, so χ = V − E = ${n(V)} − ${n(E)} = ${n(chiG)}. The ${S.name} has χ = ${n(S.chi)}. Each porthole removes one face of a cell division and leaves the vertices and edges, so with ${n(b)} portholes cut out χ = ${n(S.chi)} − ${n(b)} = ${n(chiH)}.`,
   guidance: [
    { prompt: `Count the cables. Each of the ${n(m)} rows has ${n(c - 1)} cables along it, and each of the ${n(c)} columns has ${n(m - 1)} cables down it. What is E?`, answer: [E], explanation: `${n(m)} × ${n(c - 1)} = ${n(rowE)} cables along the rows and ${n(c)} × ${n(m - 1)} = ${n(colE)} down the columns, so E = ${n(E)}.` },
    { prompt: `The loom has V = ${n(V)} junctions, E = ${n(E)} cables and no faces. What is its Euler characteristic V − E?`, answer: [chiG], explanation: `${n(V)} − ${n(E)} = ${n(chiG)}. With no faces there is nothing to add.` },
    { prompt: `The ${S.name} has χ = ${n(S.chi)}, and each porthole removes one face of a cell division. What is χ once all ${n(b)} portholes are cut out?`, answer: [chiH], explanation: `Each porthole lowers χ by 1, so χ = ${n(S.chi)} − ${n(b)} = ${n(chiH)}.` }
   ] }; }
 },
 /* A closed gluing word with 2 to 4 letters. Never the worked example's torus word a b a⁻¹ b⁻¹. */
 q22: {
  canonical: { w: W('a b c a⁻¹ c b⁻¹') },
  draw: R => { let w = null; for (let i = 0; i < 1000; i++) { w = randomWord(R, R.int(2, 4), R.bool()); if (!same(w, 'a b a⁻¹ b⁻¹')) return { w }; } return { w: W('a b c a⁻¹ c b⁻¹') }; },
  build: ({ w }) => { const s = sew(w), E = s.pairs, chi = s.V - E + 1; return {
   prompt: `A hull panel is a flat polygon with ${n(s.N)} edges. Its gluing word, read counterclockwise from corner 1, is ${wordText(w)}. The corners are numbered 1 to ${n(s.N)} so that edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and edge ${n(s.N)} from corner ${n(s.N)} back to corner 1. A letter on its own means the edge’s arrow points the way you read; a letter with ⁻¹ means it points back. Each letter appears twice, and those two edges are sewn together arrow to arrow: tail on tail and tip on tip. Enter the number of vertex classes V (the points the corners become after sewing), then the number of edges E after sewing, then the Euler characteristic χ = V − E + 1 of the closed surface (the panel is its one face).`,
   answer: [s.V, E, chi],
   hints: ['Write down the tail corner and the tip corner of every edge. Sewing two edges with the same letter puts their tails together and their tips together. Keep joining corners until no sewing joins two different groups: each group left is one vertex class.', 'After sewing, the two edges with the same letter are one edge, and the polygon itself is the one face.'],
   solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. So V = ${n(s.V)}. The ${n(s.N)} edges are sewn in pairs into E = ${n(E)} edges, and the panel is F = 1 face, so χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.`,
   guidance: [
    { prompt: `Join the corners the sewing puts together. How many vertex classes do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${sewText(s)[0].toUpperCase()}${sewText(s).slice(1)}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
    { prompt: `Each letter names two edges of the polygon that become one edge of the surface. How many edges E are there after sewing?`, answer: [E], explanation: `${n(s.N)} edges sewn in pairs give ${n(s.N)} ÷ 2 = ${n(E)} edges.` },
    { prompt: `V = ${n(s.V)}, E = ${n(E)} and F = 1. What is χ = V − E + F?`, answer: [chi], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` }
   ] }; }
 },
 /* A word with 1 or 2 sewn pairs and 1 to 3 free edges. Never the worked example's Möbius strip, a free a free. */
 q23: {
  canonical: { w: W('a free b a⁻¹ free b') },
  draw: R => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(1, 2), false, R.int(1, 3)); if (w.length >= 3 && !same(w, 'a free a free')) return { w }; } return { w: W('a free b a⁻¹ free b') }; },
  build: ({ w }) => { const s = sew(w), E = s.pairs + s.free, chiP = s.V - E + 1, bc = circles(w, s), chiC = chiP + bc;
   const freeText = w.map((x, i) => x.free ? freeEdge(i + 1, NAMES[s.cls[i + 1]], NAMES[s.cls[(i + 1) % s.N + 1]]) : '').filter(Boolean).join(', ');
   const sewn = s.record.length ? `${sewText(s)[0].toUpperCase()}${sewText(s).slice(1)}. ` : '';
   return {
   prompt: `A hull panel is a polygon with ${n(s.N)} edges, read counterclockwise from corner 1: ${wordText(w)}. Edge 1 runs from corner 1 to corner 2, edge 2 from corner 2 to corner 3, and so on round to edge ${n(s.N)}, which runs from corner ${n(s.N)} back to corner 1. Each letter appears twice, and those two edges are sewn arrow to arrow, tail on tail and tip on tip (a letter with ⁻¹ has its arrow pointing back against the reading direction). Each “free” is an edge sewn to nothing: the free edges make up the boundary circles of the panel. Enter the number of boundary circles after sewing, then the Euler characteristic V − E + F of the sewn panel (vertex classes, edges after sewing, and the panel as its one face), then the Euler characteristic of the closed hull made by sewing a disc onto every boundary circle.`,
   answer: [bc, chiP, chiC],
   hints: ['Find the vertex classes first. Each free edge then runs from one class to another (or back to the same one). Follow free edges from point to point until you return to where you started: each such loop is one boundary circle.', 'Sewing a disc onto a boundary circle adds one face and no new vertices or edges, so each disc raises χ by 1.'],
   solution: `${sewn}The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. ${s.free === 1 ? 'The free edge' : 'The free edges'}: ${freeText}. Following ${s.free === 1 ? 'it' : 'them'} from point to point gives ${pl(bc, 'boundary circle', 'boundary circles')}. There are E = ${n(s.pairs)} + ${n(s.free)} = ${n(E)} edges after sewing (the sewn pairs and the free edges) and F = 1 face, so χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chiP)}. Sewing a disc onto each boundary circle adds ${pl(bc, 'face', 'faces')}, so the closed hull has χ = ${n(chiP)} + ${n(bc)} = ${n(chiC)}.`,
   guidance: [
    { prompt: `Find the vertex classes, then follow the free edges between them. How many boundary circles does the sewn panel have?`, answer: [bc], explanation: `${sewn}The classes are ${classText(s)}, and ${freeText}. ${s.free === 1 ? 'That free edge closes' : 'Those free edges close'} up into ${pl(bc, 'loop', 'loops')}.` },
    { prompt: `The sewn panel has V = ${n(s.V)}, E = ${n(E)} (sewn pairs and free edges) and F = 1. What is its Euler characteristic?`, answer: [chiP], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chiP)}.` },
    { prompt: `Each disc sewn onto a boundary circle adds one face. What is χ of the closed hull?`, answer: [chiC], explanation: `${n(chiP)} + ${n(bc)} = ${n(chiC)}.` }
   ] }; }
 },
 /* Three surfaces: a, b, c are indices 0–3 into SURF (sphere χ 2, torus 0, projective plane 1, Klein bottle 0, as the prompt states). The worked example is the torus # torus with the
    projective plane, so that triple is never drawn. */
 q24: {
  canonical: { a: 2, b: 1, c: 3 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = { a: R.int(0, 3), b: R.int(0, 3), c: R.int(0, 3) }; if (!(p.a === 1 && p.b === 1 && p.c === 2)) return p; } return { a: 2, b: 1, c: 3 }; },
  build: ({ a, b, c }) => { const A = SURF[a], B = SURF[b], C = SURF[c], x1 = A.chi + B.chi - 2, x2 = x1 + C.chi - 2; return {
   prompt: `The Hull Gallery joins hull models by connected sum: cut a small round hole in each of two surfaces and sew the edges of the two holes to the two ends of a short tube. The models have these Euler characteristics: sphere 2, torus 0, projective plane 1, Klein bottle 0. Enter χ(${A.name} # ${B.name}), then χ(${A.name} # ${B.name} # ${C.name}), where the ${C.name} is joined on to the first result.`,
   answer: [x1, x2],
   hints: ['Cutting a hole takes one face away from each surface, and the tube with its two sewn circles adds nothing to V − E + F. So χ(A # B) = χ(A) + χ(B) − 2.', 'Join one surface at a time: work out the first connected sum, then use its χ as χ(A) for the next.'],
   solution: `χ(${A.name} # ${B.name}) = ${n(A.chi)} + ${n(B.chi)} − 2 = ${n(x1)}. Joining the ${C.name} (χ = ${n(C.chi)}) to that: ${n(x1)} + ${n(C.chi)} − 2 = ${n(x2)}.`,
   guidance: [
    { prompt: `χ(${A.name}) = ${n(A.chi)} and χ(${B.name}) = ${n(B.chi)}. What is χ(${A.name} # ${B.name})?`, answer: [x1], explanation: `${n(A.chi)} + ${n(B.chi)} − 2 = ${n(x1)}: each hole takes one face away.` },
    { prompt: `Now join the ${C.name} (χ = ${n(C.chi)}) to a surface with χ = ${n(x1)}. What is χ of the result?`, answer: [x2], explanation: `${n(x1)} + ${n(C.chi)} − 2 = ${n(x2)}.` }
   ] }; }
 },
 /* Genus g from 1 to 12, and a second genus h from 0 to 12 (not g) whose χ = 2 − 2h is printed. Not the worked example (2 and χ = −4). */
 q25: {
  canonical: { g: 3, h: 5 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = { g: R.int(1, 12), h: R.int(0, 12) }; if (p.g !== p.h && !(p.g === 2 && p.h === 3)) return p; } return { g: 3, h: 5 }; },
  build: ({ g, h }) => { const x = 2 - 2 * g, c = 2 - 2 * h; return {
   prompt: `The Hull Gallery’s orientable models are spheres with handles. The hull of genus g is the connected sum of g tori, and the hull of genus 0 is the sphere. Use χ(A # B) = χ(A) + χ(B) − 2, with χ = 2 for the sphere and 0 for the torus. Enter the Euler characteristic of the hull of genus ${n(g)}, then the genus of the hull of this kind whose Euler characteristic is ${n(c)}.`,
   answer: [x, h],
   hints: ['Start from the sphere’s χ = 2. Joining on one torus changes χ by 0 − 2 = −2, so the hull of genus g has χ = 2 − 2g.', 'Run the rule backwards: g = (2 − χ) ÷ 2.'],
   solution: `Each torus joined on lowers χ by 2, starting from the sphere’s 2, so χ = 2 − 2g. For genus ${n(g)}: χ = 2 − 2 × ${n(g)} = ${n(x)}. For χ = ${n(c)}: g = (2 − ${G.par(c)}) ÷ 2 = ${n(2 - c)} ÷ 2 = ${n(h)}.`,
   guidance: [
    { prompt: `Each torus joined on lowers χ by 2, from the sphere’s 2. What is χ for genus ${n(g)}?`, answer: [x], explanation: `2 − 2 × ${n(g)} = ${n(x)}.` },
    { prompt: `Solve 2 − 2g = ${n(c)} for g. What is the genus?`, answer: [h], explanation: `2g = 2 − ${G.par(c)} = ${n(2 - c)}, so g = ${n(h)}.` }
   ] }; }
 },
 /* k cross-caps from 1 to 12, and a second count j from 1 to 12 (not k) whose χ = 2 − j is printed. Not the worked example (4 and χ = −3). */
 q26: {
  canonical: { k: 3, j: 7 },
  draw: R => { for (let i = 0; i < 1000; i++) { const p = { k: R.int(1, 12), j: R.int(1, 12) }; if (p.k !== p.j && !(p.k === 4 && p.j === 5)) return p; } return { k: 3, j: 7 }; },
  build: ({ k, j }) => { const x = 2 - k, c = 2 - j; return {
   prompt: `A cross-cap is a projective plane (χ = 1) with a small round hole cut in it. Sewing a cross-cap into a round hole in a sphere is the same as a connected sum with a projective plane, and the hull “sphere with k cross-caps” has k of them sewn in. Use χ(A # B) = χ(A) + χ(B) − 2 and χ = 2 for the sphere. Enter the Euler characteristic of the sphere with ${pl(k, 'cross-cap', 'cross-caps')}, then the number of cross-caps a sphere needs for its Euler characteristic to be ${n(c)}.`,
   answer: [x, j],
   hints: ['Each connected sum with a projective plane changes χ by 1 − 2 = −1. Starting from the sphere’s 2, a sphere with k cross-caps has χ = 2 − k.', 'Run the rule backwards: k = 2 − χ.'],
   solution: `Each cross-cap lowers χ by 1, starting from the sphere’s 2, so χ = 2 − k. With ${pl(k, 'cross-cap', 'cross-caps')}: χ = 2 − ${n(k)} = ${n(x)}. For χ = ${n(c)}: k = 2 − ${G.par(c)} = ${n(j)}.`,
   guidance: [
    { prompt: `Each cross-cap lowers χ by 1, from the sphere’s 2. What is χ with ${pl(k, 'cross-cap', 'cross-caps')}?`, answer: [x], explanation: `2 − ${n(k)} = ${n(x)}.` },
    { prompt: `Solve 2 − k = ${n(c)} for k. How many cross-caps?`, answer: [j], explanation: `k = 2 − ${G.par(c)} = ${n(j)}.` }
   ] }; }
 },
 /* t tori (1–6) and p projective planes (1–7). Not the worked example, one of each. */
 q27: {
  canonical: { t: 2, p: 1 },
  draw: R => { for (let i = 0; i < 1000; i++) { const q = { t: R.int(1, 6), p: R.int(1, 7) }; if (!(q.t === 1 && q.p === 1)) return q; } return { t: 2, p: 1 }; },
  build: ({ t, p }) => { const x = 2 - 2 * t - p, k = 2 - x; return {
   prompt: `A hull is the connected sum of ${pl(t, 'torus', 'tori')} and ${pl(p, 'projective plane', 'projective planes')}. Use χ(A # B) = χ(A) + χ(B) − 2, with χ = 2 for the sphere, 0 for the torus and 1 for the projective plane. A projective plane contains a Möbius strip, so the hull is not orientable. Enter the Euler characteristic of the hull, then the number of cross-caps k of the standard surface, the sphere with k cross-caps, that the classification of surfaces says it is.`,
   answer: [x, k],
   hints: ['Each torus joined on lowers χ by 2 and each projective plane lowers it by 1, starting from the sphere’s 2.', 'The classification of surfaces: orientability and χ together pick out one standard surface. A surface that is not orientable is the sphere with 2 − χ cross-caps.'],
   solution: `Starting from 2, the ${pl(t, 'torus', 'tori')} ${t === 1 ? 'takes' : 'take'} away 2 × ${n(t)} = ${n(2 * t)} and the ${pl(p, 'projective plane', 'projective planes')} ${p === 1 ? 'takes' : 'take'} away ${n(p)}, so χ = 2 − ${n(2 * t)} − ${n(p)} = ${n(x)}. The hull is not orientable, and the non-orientable standard surface with χ = ${n(x)} is the sphere with k = 2 − ${G.par(x)} = ${n(k)} cross-caps.`,
   guidance: [
    { prompt: `Each torus lowers χ by 2 and each projective plane by 1, from 2. What is χ of the hull?`, answer: [x], explanation: `2 − 2 × ${n(t)} − ${n(p)} = ${n(x)}.` },
    { prompt: `The hull is not orientable and χ = ${n(x)}. A sphere with k cross-caps has χ = 2 − k. What is k?`, answer: [k], explanation: `2 − k = ${n(x)} gives k = ${n(k)}. Each torus counts as two cross-caps once a cross-cap is present.` }
   ] }; }
 },
 /* A closed word with 2 to 4 letters, orientable or not in about equal shares. Never the worked example's Klein bottle, a b a⁻¹ b. */
 q28: {
  canonical: { w: W('a b c b a⁻¹ c⁻¹') },
  draw: R => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(2, 4), R.bool()); if (!same(w, 'a b a⁻¹ b')) return { w }; } return { w: W('a b c b a⁻¹ c⁻¹') }; },
  build: ({ w }) => { const s = sew(w), E = s.pairs, chi = s.V - E + 1, o = orientable(w), gk = o ? (2 - chi) / 2 : 2 - chi, L = sameWay(w);
   const why = o ? 'Every letter appears once plain and once with ⁻¹, so no pair of edges makes a Möbius strip: the surface is orientable, enter 1.' : `The letter ${L} appears twice the same way round, so those two edges make a Möbius strip: the surface is not orientable, enter 0.`;
   const last = o ? `It is orientable, so its genus is g = (2 − ${G.par(chi)}) ÷ 2 = ${n(gk)}.` : `It is not orientable, so it has k = 2 − ${G.par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`;
   return {
   prompt: `A hull panel is a polygon with ${n(s.N)} edges and gluing word ${wordText(w)}, read counterclockwise from corner 1: edge 1 runs from corner 1 to corner 2, and so on round to edge ${n(s.N)}, which runs back to corner 1. A letter with ⁻¹ has its arrow pointing back against the reading direction, and the two edges with the same letter are sewn arrow to arrow. If some letter appears twice the same way round (both plain, or both with ⁻¹), the strip between those two edges is a Möbius strip and the surface is not orientable; if every letter appears once plain and once with ⁻¹, it is orientable. Enter 1 if the surface is orientable and 0 if not, then its Euler characteristic V − E + 1, then its genus if it is orientable or its number of cross-caps if it is not.`,
   answer: [o, chi, gk],
   hints: ['Look at each letter’s two appearances: one plain and one with ⁻¹ keeps orientability; two the same way round gives a Möbius strip.', 'Find the vertex classes by sewing tails to tails and tips to tips; then χ = V − E + 1 with E the number of different letters. An orientable surface has genus (2 − χ) ÷ 2; a non-orientable one has 2 − χ cross-caps.'],
   solution: `${why} Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. With E = ${n(E)} and F = 1, χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}. ${last}`,
   guidance: [
    { prompt: `Compare the two appearances of each letter. Is the surface orientable? Enter 1 for yes, 0 for no.`, answer: [o], explanation: why },
    { prompt: `Sew tails to tails and tips to tips to find the vertex classes. With E = ${n(E)} and F = 1, what is χ?`, answer: [chi], explanation: `The classes are ${classText(s)}, so V = ${n(s.V)} and χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` },
    { prompt: o ? `The surface is orientable with χ = ${n(chi)}. What is its genus?` : `The surface is not orientable with χ = ${n(chi)}. How many cross-caps does it have?`, answer: [gk], explanation: last }
   ] }; }
 },
 /* A closed word with 2 or 3 letters, then t tori and p projective planes (0–3 each, not both 0; p = 0 in about half the draws). */
 q29: {
  canonical: { w: W('a b a b'), t: 2, p: 0 },
  draw: R => { const w = randomWord(R, R.int(2, 3), R.bool()), p = R.bool() ? 0 : R.int(1, 3), t = R.int(p ? 0 : 1, 3); return { w, t, p }; },
  build: ({ w, t, p }) => { const s = sew(w), chiW = s.V - s.pairs + 1, oW = orientable(w), chi = chiW - 2 * t - p, o = oW && p === 0 ? 1 : 0, gk = o ? (2 - chi) / 2 : 2 - chi;
   const parts = [t ? pl(t, 'torus', 'tori') : '', p ? pl(p, 'projective plane', 'projective planes') : ''].filter(Boolean).join(' and ');
   const verb = t + p === 1 ? 'is' : 'are', drop = `${t ? ` − ${n(2 * t)}` : ''}${p ? ` − ${n(p)}` : ''}`;
   const whyO = o ? 'The panel’s word has every letter once plain and once with ⁻¹, and only tori are joined on, so there is no Möbius strip anywhere: orientable, enter 1.'
    : (!oW ? `In the panel’s word the letter ${sameWay(w)} appears twice the same way round, which makes a Möbius strip, and joining more surfaces on keeps it: not orientable, enter 0.` : 'The panel itself is orientable, but a projective plane contains a Möbius strip, and joining it on brings the strip into the hull: not orientable, enter 0.');
   const last = o ? `Orientable with χ = ${n(chi)}: genus (2 − ${G.par(chi)}) ÷ 2 = ${n(gk)}.` : `Not orientable with χ = ${n(chi)}: 2 − ${G.par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`;
   return {
   prompt: `The gallery’s last hull is built in two stages. First a panel with ${n(s.N)} edges and gluing word ${wordText(w)} is sewn shut: read counterclockwise from corner 1, edge 1 runs from corner 1 to corner 2 and so on round the polygon, a letter with ⁻¹ has its arrow pointing back, and the two edges with the same letter are sewn arrow to arrow. Then ${parts} ${verb} joined on by connected sum, with χ(A # B) = χ(A) + χ(B) − 2 (χ = 0 for the torus, 1 for the projective plane). Enter the Euler characteristic of the finished hull, then 1 if it is orientable and 0 if not, then its genus if it is orientable or its number of cross-caps if it is not.`,
   answer: [chi, o, gk],
   hints: ['The sewn panel has χ = V − E + 1. Each torus joined on lowers χ by 2 and each projective plane by 1.', 'The hull is orientable only if the panel’s word has every letter once plain and once with ⁻¹ and no projective plane is joined on. Then use genus (2 − χ) ÷ 2, or 2 − χ cross-caps.'],
   solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}, so the sewn panel has χ = ${n(s.V)} − ${n(s.pairs)} + 1 = ${n(chiW)}. Joining on ${parts} gives χ = ${n(chiW)}${drop} = ${n(chi)}. ${whyO} ${last}`,
   guidance: [
    { prompt: `Find the panel’s χ = V − E + 1, then lower it by 2 for each torus and 1 for each projective plane joined on. What is χ of the finished hull?`, answer: [chi], explanation: `The panel has ${pl(s.V, 'vertex class', 'vertex classes')} (${classText(s)}) and ${pl(s.pairs, 'edge', 'edges')}, so χ = ${n(chiW)}; then ${n(chiW)}${drop} = ${n(chi)}.` },
    { prompt: `Is the finished hull orientable? Enter 1 for yes, 0 for no.`, answer: [o], explanation: whyO },
    { prompt: o ? `The hull is orientable with χ = ${n(chi)}. What is its genus?` : `The hull is not orientable with χ = ${n(chi)}. How many cross-caps does it have?`, answer: [gk], explanation: last }
   ] }; }
 },
 /* A balloon of radius s (k = 1 ÷ s² has at most four decimals) and a tank of curvature K (radius 1 ÷ √K is a short decimal).
    The worked example is a radius of 8 metres and a curvature of 0.0001, which no draw uses. */
 q30: {
  canonical: { s: 4, K: 0.04 },
  draw: R => ({ s: R.pick(RADII), K: R.pick(CURVES) }),
  build: ({ s, K }) => { const k = G.tidy(1 / (s * s)), r = sqrtK(K); return {
   prompt: `In the Observatory a test balloon is a sphere of radius ${n(s)} metres. Enter its curvature k, in units of 1 per square metre: it is an exact decimal, so type it in full. Then a spherical water tank has curvature ${n(K)} per square metre at every point of its wall; enter the radius of the tank in metres.`,
   answer: [k, r],
   hints: ['A sphere of radius s has the same curvature at every point, k = 1 ÷ s².', 'Run the rule backwards: s² = 1 ÷ k, so s = 1 ÷ √k.'],
   solution: `k = 1 ÷ s² = 1 ÷ ${n(s)}² = 1 ÷ ${n(s * s)} = ${n(k)} per square metre. For the tank, s² = 1 ÷ ${n(K)} = ${n(r * r)}, so s = √${n(r * r)} = ${n(r)} metres.`,
   guidance: [
    { prompt: `The balloon’s radius is ${n(s)} m, so s² = ${n(s * s)}. What is k = 1 ÷ s²?`, answer: [k], explanation: `1 ÷ ${n(s * s)} = ${n(k)} per square metre.` },
    { prompt: `The tank has k = ${n(K)}, so s² = 1 ÷ ${n(K)} = ${n(r * r)}. What is s?`, answer: [r], explanation: `√${n(r * r)} = ${n(r)} metres.` }
   ] }; }
 }
});
})();
