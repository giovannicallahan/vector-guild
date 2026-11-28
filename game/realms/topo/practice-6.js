/* Topology: shape without size practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p6.js. */
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
const tidy = G.tidy;

/* ---- gluing words ----
   A word is a list of edges read counterclockwise from corner 1: { L: 'a', e: 1 } is a plain letter (arrow along the reading
   direction), e: −1 is the letter with ⁻¹ (arrow back). Edge i (from 1) runs from corner i to corner i + 1, and edge N back to corner 1. */
const edgeText = x => x.L + (x.e < 0 ? '⁻¹' : '');
const wordText = w => w.map(edgeText).join(' ');
const ends = (x, i, N) => { const a = i + 1, b = (i + 1) % N + 1; return x.e > 0 ? { t: a, h: b } : { t: b, h: a }; };
/* Sew same letters tail on tail and tip on tip; return the vertex classes (sorted lists of corners, ordered by their smallest
   corner), the sewing record for the solution text, and the counts. */
const sew = w => {
 const N = w.length, up = []; for (let i = 0; i <= N; i++) up.push(i);
 const f = x => up[x] === x ? x : (up[x] = f(up[x]));
 const u = (a, b) => { a = f(a); b = f(b); if (a !== b) up[Math.max(a, b)] = Math.min(a, b); };
 const first = {}, record = [];
 w.forEach((x, i) => { const e = ends(x, i, N);
  if (first[x.L]) { const o = first[x.L]; record.push({ L: x.L, t: [o.t, e.t], h: [o.h, e.h] }); u(o.t, e.t); u(o.h, e.h); } else first[x.L] = e; });
 const groups = {}; for (let c = 1; c <= N; c++) (groups[f(c)] = groups[f(c)] || []).push(c);
 const classes = Object.keys(groups).map(Number).sort((a, b) => a - b).map(r => groups[r]);
 return { N, classes, record, pairs: N / 2, V: classes.length };
};
const NAMES = 'PQRSTUVW';
const corners = g => g.length === 1 ? `corner ${n(g[0])}` : `corners ${g.slice(0, -1).map(n).join(', ')} and ${n(g[g.length - 1])}`;
const joinText = (a, b) => a === b ? `corner ${n(a)} with itself` : `corner ${n(a)} with corner ${n(b)}`;
const sewText = s => s.record.map(r => `sewing the ${r.L} edges puts ${joinText(r.t[0], r.t[1])} (tails) and ${joinText(r.h[0], r.h[1])} (tips)`).join('; ');
const classText = s => s.classes.map((g, k) => `${NAMES[k]} = ${corners(g)}`).join('; ');
const orientable = w => { const seen = {}; let ok = 1; w.forEach(x => { if (seen[x.L] !== undefined && seen[x.L] === x.e) ok = 0; seen[x.L] = x.e; }); return ok; };
const sameWay = w => { const seen = {}; for (const x of w) { if (seen[x.L] === x.e) return x.L; seen[x.L] = x.e; } return ''; };
const twisted = w => { const seen = {}, bad = new Set(); w.forEach(x => { if (seen[x.L] === x.e) bad.add(x.L); seen[x.L] = x.e; }); return bad.size; };
/* A random closed word with k letters taken in order from `letters`; orient = true gives every letter once plain and once with ⁻¹. */
const randomWord = (R, k, orient, letters) => {
 const slots = []; for (let i = 0; i < k; i++) slots.push(i, i);
 for (let i = slots.length - 1; i > 0; i--) { const j = R.int(0, i); [slots[i], slots[j]] = [slots[j], slots[i]]; }
 const name = {}, firstE = {}; let next = 0;
 return slots.map(s => { if (name[s] === undefined) { name[s] = letters[next++]; firstE[s] = R.bool() ? 1 : -1; return { L: name[s], e: firstE[s] }; }
  return { L: name[s], e: orient ? -firstE[s] : (R.bool() ? 1 : -1) }; });
};
const W = text => text.split(' ').map(t => ({ L: t[0], e: t.length > 1 ? -1 : 1 }));
/* The word with its letters renamed a, b, c … in order of first appearance, so two words can be compared as patterns. */
const shape = w => { const m = {}; let k = 0; return w.map(x => { if (!m[x.L]) m[x.L] = 'abcdefgh'[k++]; return m[x.L] + (x.e < 0 ? '⁻¹' : ''); }).join(' '); };
/* The standard surface of a closed word: orientable or not, its Euler characteristic and its genus or cross-caps. */
const surf = w => { const s = sew(w), chi = s.V - s.pairs + 1, o = orientable(w); return { s, chi, o, gk: o ? (2 - chi) / 2 : 2 - chi }; };
const why = w => orientable(w) ? 'Every letter appears once plain and once with ⁻¹, so no pair of edges makes a Möbius strip: the surface is orientable, enter 1.'
 : `The letter ${sameWay(w)} appears twice the same way round, so those two edges make a Möbius strip: the surface is not orientable, enter 0.`;
const SEWING = N => `read counterclockwise from corner 1, edge 1 runs from corner 1 to corner 2 and so on round to edge ${n(N)}, which runs back to corner 1; a letter with ⁻¹ has its arrow pointing back against the reading direction, and the two edges with the same letter are sewn arrow to arrow, tail on tail and tip on tip`;

/* ---- q26 Cross-caps [H 7.5] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Cases in the model hall',
 brief: 'The gallery’s glass cases hold hull models with twisted patches sewn in, and two of the labels have to be completed.',
 labels: ['cross-caps on model A', 'χ of model B'], tolerance: 0.01,
 gl: [['cross-caps'], ['χ']]
}, {
 /* Two different cross-cap counts, 1 to 14: j for model A (its χ = 2 − j is printed) and k for model B. Never the parent's worked example
    (4 cross-caps and χ = −3) nor its canonical pair (3 and 7). */
 canonical: { j: 8, k: 6 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { j: R.int(1, 14), k: R.int(1, 14) };
   if (p.j !== p.k && !(p.k === 4 || p.j === 5) && !(p.k === 3 && p.j === 7)) return p; } return { j: 8, k: 6 }; },
 build: ({ j, k }) => { const c = 2 - j, x = 2 - k; return {
  prompt: `The glass cases in the Hull Gallery hold models made from a sphere by sewing cross-caps into round holes. A cross-cap is a projective plane (χ = 1) with a small round hole cut in it, so sewing one in is a connected sum with a projective plane. Use χ(A # B) = χ(A) + χ(B) − 2 and χ = 2 for the sphere. The label of model A shows its Euler characteristic, ${n(c)}, but not how many cross-caps it has. Model B has ${pl(k, 'cross-cap', 'cross-caps')} and no label yet. Enter the number of cross-caps on model A, then the Euler characteristic of model B.`,
  answer: [j, x],
  hints: ['Each cross-cap is a connected sum with a projective plane, which changes χ by 1 − 2 = −1. So a sphere with k cross-caps has χ = 2 − k.', 'To find the count from a label, run the rule backwards: k = 2 − χ.'],
  solution: `Each cross-cap lowers χ by 1, starting from the sphere’s 2, so χ = 2 − k. Model A: k = 2 − ${par(c)} = ${n(j)} cross-caps. Model B: χ = 2 − ${n(k)} = ${n(x)}.`,
  guidance: [
   { prompt: `Model A has χ = ${n(c)}. A sphere with k cross-caps has χ = 2 − k, so solve 2 − k = ${n(c)}. How many cross-caps does model A have?`, answer: [j], explanation: `k = 2 − ${par(c)} = ${n(j)}.` },
   { prompt: `Each cross-cap lowers χ by 1, from the sphere’s 2. What is χ of model B, with ${pl(k, 'cross-cap', 'cross-caps')}?`, answer: [x], explanation: `2 − ${n(k)} = ${n(x)}.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Patches for the pressure hull',
 brief: 'The pressure hull has to be refitted with extra twisted patches until its label reads the right number, and the thread store needs to know the cost.',
 labels: ['cross-caps now', 'cross-caps to add', 'thread (m)'], tolerance: 0.01,
 gl: [['cross-caps now'], ['cross-caps to add'], ['thread (m)']]
}, {
 /* Start with k0 ≥ 1 cross-caps (χ0 = 2 − k0 printed), add a more (target χ1 = χ0 − a printed), r metres of thread each. Not the parent's examples. */
 canonical: { k0: 6, a: 3, r: 8 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { k0: R.int(1, 9), a: R.int(2, 9), r: R.int(3, 9) };
   if (!(p.k0 === 3 && p.a === 4) && p.k0 !== 4) return p; } return { k0: 6, a: 3, r: 8 }; },
 build: ({ k0, a, r }) => { const x0 = 2 - k0, x1 = x0 - a, thread = a * r; return {
  prompt: `The pressure hull is a sphere with cross-caps sewn in. A cross-cap is a projective plane (χ = 1) with a small round hole cut in it, sewing one in is a connected sum with a projective plane, and χ(A # B) = χ(A) + χ(B) − 2, with χ = 2 for the sphere. The hull’s label reads χ = ${n(x0)}. The refit must end with a label of χ = ${n(x1)}, and every extra cross-cap sewn in takes ${n(r)} metres of seam thread. Enter the number of cross-caps the hull has now, then the number of cross-caps that must be sewn in, then the total metres of thread.`,
  answer: [k0, a, thread],
  hints: ['Each cross-cap is a connected sum with a projective plane, which changes χ by 1 − 2 = −1. So a sphere with k cross-caps has χ = 2 − k, and k = 2 − χ.', 'The number to sew in is the difference between the two cross-cap counts, or the drop in χ, since each cross-cap lowers χ by 1. The thread is that number times the thread for one.'],
  solution: `Each cross-cap lowers χ by 1, starting from the sphere’s 2, so k = 2 − χ. Now: k = 2 − ${par(x0)} = ${n(k0)} cross-caps. At the end: k = 2 − ${par(x1)} = ${n(k0 + a)} cross-caps, so ${n(k0 + a)} − ${n(k0)} = ${n(a)} must be sewn in. The thread is ${n(a)} × ${n(r)} = ${n(thread)} metres.`,
  guidance: [
   { prompt: `The label reads χ = ${n(x0)}, and a sphere with k cross-caps has χ = 2 − k. How many cross-caps does the hull have now?`, answer: [k0], explanation: `k = 2 − ${par(x0)} = ${n(k0)}.` },
   { prompt: `The finished hull must have χ = ${n(x1)}, which is ${n(k0 + a)} cross-caps. The hull has ${n(k0)} now. How many cross-caps must be sewn in?`, answer: [a], explanation: `${n(k0 + a)} − ${n(k0)} = ${n(a)}. Each one lowers χ by 1, and χ must fall from ${n(x0)} to ${n(x1)}.` },
   { prompt: `Each cross-cap takes ${n(r)} metres of thread and ${n(a)} are sewn in. How many metres of thread?`, answer: [thread], explanation: `${n(a)} × ${n(r)} = ${n(thread)} metres.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q24', title: 'Three hulls in one',
 brief: 'Three finished hulls are to be joined into a single hull, and the catalogue needs its Euler characteristic and its name.',
 labels: ['χ of A # B', 'χ of A # B # C', 'cross-caps of the result'], tolerance: 0.01,
 gl: [['χ of A # B'], ['χ of A # B # C'], ['cross-caps']]
}, {
 /* a and b cross-caps (1 to 9), and hull C with χ = c (−8 to 1, a closed surface). A and B contain Möbius strips, so the result is not orientable.
    Not the parent's examples. */
 canonical: { a: 5, b: 3, c: -4 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { a: R.int(1, 9), b: R.int(1, 9), c: R.int(-8, 1) };
   if (p.a !== 4) return p; } return { a: 5, b: 3, c: -4 }; },
 build: ({ a, b, c }) => { const xa = 2 - a, xb = 2 - b, x1 = xa + xb - 2, x2 = x1 + c - 2, k = 2 - x2; return {
  prompt: `Three hulls are to be joined by connected sum, with χ(A # B) = χ(A) + χ(B) − 2. Hull A is a sphere with ${pl(a, 'cross-cap', 'cross-caps')} and hull B is a sphere with ${pl(b, 'cross-cap', 'cross-caps')}; a sphere has χ = 2, and each cross-cap lowers χ by 1. Hull C is a closed surface whose Euler characteristic is ${n(c)}. First A and B are joined, then C is joined on to the result. A cross-cap contains a Möbius strip, so the finished hull is not orientable, and the classification of surfaces says it is the sphere with 2 − χ cross-caps. Enter χ(A # B), then χ of the finished hull, then its number of cross-caps.`,
  answer: [x1, x2, k],
  hints: ['Find χ of A and of B first: a sphere with k cross-caps has χ = 2 − k. Then use χ(A # B) = χ(A) + χ(B) − 2.', 'Join C on to the first result by the same rule, with the first result as the new A. Then the number of cross-caps is 2 − χ.'],
  solution: `A has χ = 2 − ${n(a)} = ${n(xa)} and B has χ = 2 − ${n(b)} = ${n(xb)}, so χ(A # B) = ${n(xa)} + ${par(xb)} − 2 = ${n(x1)}. Joining C (χ = ${n(c)}) gives ${n(x1)} + ${par(c)} − 2 = ${n(x2)}. The finished hull is not orientable, so it has 2 − ${par(x2)} = ${n(k)} cross-caps.`,
  guidance: [
   { prompt: `Hull A has χ = 2 − ${n(a)} = ${n(xa)} and hull B has χ = 2 − ${n(b)} = ${n(xb)}. What is χ(A # B)?`, answer: [x1], explanation: `${n(xa)} + ${par(xb)} − 2 = ${n(x1)}.` },
   { prompt: `Now join hull C, with χ = ${n(c)}, to a hull with χ = ${n(x1)}. What is χ of the finished hull?`, answer: [x2], explanation: `${n(x1)} + ${par(c)} − 2 = ${n(x2)}.` },
   { prompt: `The finished hull is not orientable with χ = ${n(x2)}. How many cross-caps does it have?`, answer: [k], explanation: `2 − ${par(x2)} = ${n(k)}.` }
  ] }; }
});

/* ---- q27 Classification of surfaces [H 7.5] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The repair crew’s hull',
 brief: 'A repair crew has added handles and cross-caps to a sphere hull, and the catalogue wants the finished hull filed under its standard name.',
 labels: ['χ', 'cross-caps of the standard surface'], tolerance: 0.01,
 gl: [['χ'], ['cross-caps k']]
}, {
 /* h handles (1 to 7) and c cross-caps (1 to 8). Never the parent's worked example (1 torus, 1 projective plane) or its canonical (2 and 1). */
 canonical: { h: 4, c: 3 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { h: R.int(1, 7), c: R.int(1, 8) };
   if (!(p.h === 1 && p.c === 1) && !(p.h === 2 && p.c === 1)) return p; } return { h: 4, c: 3 }; },
 build: ({ h, c }) => { const x = 2 - 2 * h - c, k = 2 - x; return {
  prompt: `A repair crew starts from a sphere hull and adds ${pl(h, 'handle', 'handles')} and ${pl(c, 'cross-cap', 'cross-caps')}. A handle is a torus joined on by connected sum (χ = 0), a cross-cap is a projective plane joined on (χ = 1), and χ(A # B) = χ(A) + χ(B) − 2, with χ = 2 for the sphere. A cross-cap contains a Möbius strip, so the finished hull is not orientable. Enter the Euler characteristic of the finished hull, then the number of cross-caps of the standard surface, the sphere with k cross-caps, that the classification of surfaces says it is.`,
  answer: [x, k],
  hints: ['Each handle lowers χ by 2 and each cross-cap lowers it by 1, starting from the sphere’s 2.', 'A surface that is not orientable is the sphere with 2 − χ cross-caps, whatever pieces it was built from.'],
  solution: `Starting from 2, the ${pl(h, 'handle', 'handles')} take away 2 × ${n(h)} = ${n(2 * h)} and the ${pl(c, 'cross-cap', 'cross-caps')} take away ${n(c)}, so χ = 2 − ${n(2 * h)} − ${n(c)} = ${n(x)}. The hull is not orientable, so it is the sphere with 2 − ${par(x)} = ${n(k)} cross-caps.`,
  guidance: [
   { prompt: `Each handle lowers χ by 2 and each cross-cap by 1, from 2. What is χ of the finished hull?`, answer: [x], explanation: `2 − 2 × ${n(h)} − ${n(c)} = ${n(x)}.` },
   { prompt: `The hull is not orientable and χ = ${n(x)}. A sphere with k cross-caps has χ = 2 − k. What is k?`, answer: [k], explanation: `2 − k = ${n(x)} gives k = ${n(k)}. Each handle counts as two cross-caps once a cross-cap is present.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The smudged catalogue card',
 brief: 'One catalogue card has a smudge over the number of projective planes in its hull, and the crew has to work it back from the Euler characteristic.',
 labels: ['cross-caps of the standard surface', 'projective planes in the sum', 'χ after joining more'], tolerance: 0.01,
 gl: [['cross-caps k'], ['projective planes'], ['χ']]
}, {
 /* t tori (1 to 6), p ≥ 1 projective planes (1 to 7) whose count is hidden (χ = 2 − 2t − p is printed), and m more joined on (1 to 4). Not the worked example (1 torus, 1 plane). */
 canonical: { t: 3, p: 2, m: 2 },
 draw: R => { for (let i = 0; i < 1000; i++) { const q = { t: R.int(1, 6), p: R.int(1, 7), m: R.int(1, 4) };
   if (!(q.t === 1 && q.p === 1)) return q; } return { t: 3, p: 2, m: 2 }; },
 build: ({ t, p, m }) => { const x = 2 - 2 * t - p, k = 2 - x, y = x - m; return {
  prompt: `A catalogue card says a hull is the connected sum of ${pl(t, 'torus', 'tori')} and some projective planes, but a smudge hides how many. It also says the hull is not orientable and its Euler characteristic is ${n(x)}. Use χ(A # B) = χ(A) + χ(B) − 2, with χ = 2 for the sphere, 0 for the torus and 1 for the projective plane. A surface that is not orientable is the sphere with 2 − χ cross-caps. Enter the number of cross-caps of the standard surface the hull is, then the number of projective planes in the sum, then the Euler characteristic of the hull after ${pl(m, 'more projective plane is', 'more projective planes are')} joined on.`,
  answer: [k, p, y],
  hints: ['A surface that is not orientable is the sphere with 2 − χ cross-caps. Each torus in the sum is worth two cross-caps and each projective plane one.', 'Take the tori’s cross-caps away from the total to find the projective planes. Each projective plane joined on lowers χ by 1.'],
  solution: `The hull is not orientable, so it is the sphere with 2 − ${par(x)} = ${n(k)} cross-caps. The ${pl(t, 'torus', 'tori')} count${t === 1 ? 's' : ''} for 2 × ${n(t)} = ${n(2 * t)} of them, so there are ${n(k)} − ${n(2 * t)} = ${n(p)} projective planes. Joining on ${pl(m, 'more projective plane', 'more projective planes')} lowers χ by ${n(m)}: ${n(x)} − ${n(m)} = ${n(y)}.`,
  guidance: [
   { prompt: `The hull is not orientable with χ = ${n(x)}. A sphere with k cross-caps has χ = 2 − k. What is k?`, answer: [k], explanation: `2 − k = ${n(x)} gives k = ${n(k)}.` },
   { prompt: `The ${pl(t, 'torus', 'tori')} account${t === 1 ? 's' : ''} for 2 × ${n(t)} = ${n(2 * t)} of the ${n(k)} cross-caps, and each projective plane gives one. How many projective planes are in the sum?`, answer: [p], explanation: `${n(k)} − ${n(2 * t)} = ${n(p)}.` },
   { prompt: `Each projective plane joined on lowers χ by 1. What is χ after ${pl(m, 'more is', 'more are')} joined to a hull with χ = ${n(x)}?`, answer: [y], explanation: `${n(x)} − ${n(m)} = ${n(y)}.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q25', title: 'A handled hull meets a twisted one',
 brief: 'The gallery joins an orientable hull with handles to a twisted hull, and the catalogue needs the result’s Euler characteristic and name.',
 labels: ['χ of hull A', 'χ of the joined hull', 'cross-caps of the joined hull'], tolerance: 0.01,
 gl: [['χ of hull A'], ['χ of the joined hull'], ['cross-caps k']]
}, {
 /* Hull A of genus g (2 to 8) and a non-orientable hull B with χ = x (−6 to 1). Never the parent's examples. */
 canonical: { g: 5, x: -3 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { g: R.int(2, 8), x: R.int(-6, 1) };
   if (!(p.g === 2 && p.x === 0)) return p; } return { g: 5, x: -3 }; },
 build: ({ g, x }) => { const xa = 2 - 2 * g, xs = xa + x - 2, k = 2 - xs; return {
  prompt: `The gallery joins two hulls by connected sum, with χ(A # B) = χ(A) + χ(B) − 2. Hull A is orientable of genus ${n(g)}: a sphere (χ = 2) with ${n(g)} handles, that is, the connected sum of ${pl(g, 'torus', 'tori')} (χ = 0 each). Hull B is not orientable and its Euler characteristic is ${n(x)}. Because B contains a Möbius strip, so does A # B, which is therefore not orientable, and the classification of surfaces says it is the sphere with 2 − χ cross-caps. Enter χ of hull A, then χ of A # B, then the number of cross-caps of A # B.`,
  answer: [xa, xs, k],
  hints: ['Each handle (torus) joined on lowers χ by 2 from the sphere’s 2, so a hull of genus g has χ = 2 − 2g.', 'Use χ(A # B) = χ(A) + χ(B) − 2 with the two Euler characteristics, then the number of cross-caps of a surface that is not orientable is 2 − χ.'],
  solution: `Hull A has χ = 2 − 2 × ${n(g)} = ${n(xa)}. Then χ(A # B) = ${n(xa)} + ${par(x)} − 2 = ${n(xs)}. The joined hull is not orientable, so it has 2 − ${par(xs)} = ${n(k)} cross-caps.`,
  guidance: [
   { prompt: `Each of the ${n(g)} handles lowers χ by 2, from the sphere’s 2. What is χ of hull A?`, answer: [xa], explanation: `2 − 2 × ${n(g)} = ${n(xa)}.` },
   { prompt: `Hull A has χ = ${n(xa)} and hull B has χ = ${n(x)}. What is χ(A # B)?`, answer: [xs], explanation: `${n(xa)} + ${par(x)} − 2 = ${n(xs)}.` },
   { prompt: `A # B is not orientable with χ = ${n(xs)}. How many cross-caps does it have?`, answer: [k], explanation: `2 − ${par(xs)} = ${n(k)}.` }
  ] }; }
});

/* ---- q28 Orientability from a gluing word [H 7.5] ---- */

/* The patterns of the parent's canonical word and worked example: no draw may be either. */
const Q28_BANNED = ['a b c b a⁻¹ c⁻¹', 'a b a⁻¹ b'];

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Seams of an airlock seal',
 brief: 'The airlock’s rubber seal is cut as one flat panel with labelled seams, and the crew wants to know what shape it makes once sewn.',
 labels: ['vertex classes V', 'orientable (1 or 0)', 'genus or cross-caps'], tolerance: 0.01,
 gl: [['vertex classes V'], ['orientable (1 or 0)'], ['genus or cross-caps']]
}, {
 /* A closed word of 2 to 4 letters x, y, z, w, orientable or not in about equal shares. Not the parent's canonical word or worked example, as patterns. */
 canonical: { w: W('x y x⁻¹ z y z') },
 draw: R => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(2, 4), R.bool(), 'xyzw'); if (!Q28_BANNED.includes(shape(w))) return { w }; } return { w: W('x y x⁻¹ z y z') }; },
 build: ({ w }) => { const { s, chi, o, gk } = surf(w), E = s.pairs, last = o ? `It is orientable, so its genus is g = (2 − ${par(chi)}) ÷ 2 = ${n(gk)}.` : `It is not orientable, so it has k = 2 − ${par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`; return {
  prompt: `The rubber seal of an airlock is cut from a flat polygon with ${n(s.N)} edges, and its seam word is ${wordText(w)}, ${SEWING(s.N)}. After sewing, each letter is one edge and the polygon is the one face. If some letter appears twice the same way round (both plain, or both with ⁻¹), the strip between those two edges is a Möbius strip and the sewn seal is not orientable; if every letter appears once plain and once with ⁻¹, it is orientable. Use χ = V − E + 1, with V the number of vertex classes (the points the corners become) and E the number of letters. An orientable surface has genus (2 − χ) ÷ 2 and a non-orientable one has 2 − χ cross-caps. Enter V, then 1 if the sewn seal is orientable and 0 if not, then its genus if it is orientable or its number of cross-caps if it is not.`,
  answer: [s.V, o, gk],
  hints: ['Write down the tail corner and the tip corner of every edge. Sewing two edges with the same letter puts their tails together and their tips together; keep joining corners until nothing more joins. Each group left is one vertex class.', 'Check each letter’s two appearances for the Möbius strip test. Then χ = V − E + 1, and the genus is (2 − χ) ÷ 2 if the seal is orientable, or 2 − χ cross-caps if it is not.'],
  solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}, so V = ${n(s.V)}. ${why(w)} With E = ${n(E)}, χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}. ${last}`,
  guidance: [
   { prompt: `Sew tails to tails and tips to tips. How many vertex classes do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${sewText(s)[0].toUpperCase()}${sewText(s).slice(1)}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `Compare the two appearances of each letter. Is the sewn seal orientable? Enter 1 for yes, 0 for no.`, answer: [o], explanation: why(w) },
   { prompt: o ? `With V = ${n(s.V)} and E = ${n(E)}, χ = ${n(chi)}, and the seal is orientable. What is its genus?` : `With V = ${n(s.V)} and E = ${n(E)}, χ = ${n(chi)}, and the seal is not orientable. How many cross-caps does it have?`, answer: [gk], explanation: last }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Paint and rings for a hull',
 brief: 'A hull can only be painted a different colour inside and out if it has no twist, and every handle or cross-cap needs a reinforcing ring of cable.',
 labels: ['orientable (1 or 0)', 'χ', 'cable (m)'], tolerance: 0.01,
 gl: [['orientable (1 or 0)'], ['χ'], ['cable (m)']]
}, {
 /* A closed word of 2 to 4 letters a to d (never the parent's canonical word or worked example, as patterns), at least one handle or cross-cap (χ ≤ 0), and r metres per ring (3 to 9). */
 canonical: { w: W('a b a⁻¹ c b⁻¹ c⁻¹ d d'), r: 6 },
 draw: R => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(2, 4), R.bool(), 'abcd'), r = R.int(3, 9);
   if (!Q28_BANNED.includes(shape(w)) && surf(w).gk >= 1) return { w, r }; } return { w: W('a b a⁻¹ c b⁻¹ c⁻¹ d d'), r: 6 }; },
 build: ({ w, r }) => { const { s, chi, o, gk } = surf(w), E = s.pairs, cable = gk * r;
  const kind = o ? `an orientable hull has g = (2 − ${par(chi)}) ÷ 2 = ${pl(gk, 'handle', 'handles')}` : `a hull that is not orientable has k = 2 − ${par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}`; return {
  prompt: `A hull is sewn from a flat polygon with ${n(s.N)} edges and gluing word ${wordText(w)}, ${SEWING(s.N)}. The paint crew can give a hull a different colour inside and out only if it is orientable. It is orientable if every letter appears once plain and once with ⁻¹; if some letter appears twice the same way round, those two edges make a Möbius strip and it is not. The cable crew fits one ring of ${n(r)} metres of cable for every handle if the hull is orientable (genus (2 − χ) ÷ 2) or for every cross-cap if it is not (2 − χ of them), where χ = V − E + 1 with V the number of vertex classes and E the number of letters. Enter 1 if the hull can be painted two colours and 0 if not, then its Euler characteristic, then the total metres of cable for the rings.`,
  answer: [o, chi, cable],
  hints: ['Check each letter’s two appearances: one plain and one with ⁻¹ is fine, two the same way round is a Möbius strip. Then sew tails to tails and tips to tips to count the vertex classes V.', 'With χ = V − E + 1 you know how many handles or cross-caps there are, by the rule that fits the answer to the first question. The cable is that number of rings times the cable for one.'],
  solution: `${why(w)} Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}. With E = ${n(E)}, χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}. So ${kind}, which means ${pl(gk, 'ring', 'rings')} of ${n(r)} metres: ${n(gk)} × ${n(r)} = ${n(cable)} metres of cable.`,
  guidance: [
   { prompt: `Compare the two appearances of each letter. Can the hull be painted two colours (orientable)? Enter 1 for yes, 0 for no.`, answer: [o], explanation: why(w) },
   { prompt: `Sew tails to tails and tips to tips to find the vertex classes. With E = ${n(E)} letters, what is χ = V − E + 1?`, answer: [chi], explanation: `The classes are ${classText(s)}, so V = ${n(s.V)} and χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` },
   { prompt: `The hull ${o ? 'is orientable' : 'is not orientable'} and has χ = ${n(chi)}, so it needs one ring for each ${o ? 'handle' : 'cross-cap'}. At ${n(r)} metres a ring, how many metres of cable?`, answer: [cable], explanation: `${kind[0].toUpperCase()}${kind.slice(1)}, so ${n(gk)} × ${n(r)} = ${n(cable)} metres.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q22', title: 'The long cutting pattern',
 brief: 'The archive holds a long cutting pattern with five seam letters, and its sewn shape has to be worked out without a model.',
 labels: ['vertex classes V', 'orientable (1 or 0)', 'χ', 'genus or cross-caps'], tolerance: 0.01,
 gl: [['vertex classes V'], ['orientable (1 or 0)'], ['χ'], ['genus or cross-caps']]
}, {
 /* A closed word of exactly 5 letters a to e (10 edges), orientable or not in about equal shares. */
 canonical: { w: W('a b c a⁻¹ d e b⁻¹ c d⁻¹ e') },
 draw: R => ({ w: randomWord(R, 5, R.bool(), 'abcde') }),
 build: ({ w }) => { const { s, chi, o, gk } = surf(w), E = s.pairs, last = o ? `It is orientable, so its genus is g = (2 − ${par(chi)}) ÷ 2 = ${n(gk)}.` : `It is not orientable, so it has k = 2 − ${par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`; return {
  prompt: `The archive’s longest cutting pattern is a polygon with ${n(s.N)} edges and the gluing word ${wordText(w)}. The corners are numbered 1 to ${n(s.N)} counterclockwise, edge 1 runs from corner 1 to corner 2, and edge ${n(s.N)} runs back to corner 1. A letter with ⁻¹ has its arrow pointing back, and the two edges with the same letter are sewn arrow to arrow, tail on tail and tip on tip. Sewn shut, the pattern is one face with ${n(E)} edges. Some letter appearing twice the same way round makes a Möbius strip, so the surface is not orientable; every letter once plain and once with ⁻¹ makes it orientable. An orientable surface has genus (2 − χ) ÷ 2 and one that is not has 2 − χ cross-caps. Enter the number of vertex classes V, then 1 if the surface is orientable and 0 if not, then its Euler characteristic V − E + 1, then its genus if it is orientable or its number of cross-caps if it is not.`,
  answer: [s.V, o, chi, gk],
  hints: ['List the tail and tip corner of each of the ten edges, join the corners that a sewing puts together, and keep going until nothing more joins. Each group is a vertex class.', 'Look at both appearances of each letter for a Möbius strip. Then χ = V − E + 1; an orientable surface has genus (2 − χ) ÷ 2 and a non-orientable one has 2 − χ cross-caps.'],
  solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}, so V = ${n(s.V)}. ${why(w)} With E = ${n(E)} and F = 1, χ = ${n(s.V)} − ${n(E)} + 1 = ${n(chi)}. ${last}`,
  guidance: [
   { prompt: `Sew tails to tails and tips to tips. How many vertex classes do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${sewText(s)[0].toUpperCase()}${sewText(s).slice(1)}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `Compare the two appearances of each letter. Is the surface orientable? Enter 1 for yes, 0 for no.`, answer: [o], explanation: why(w) },
   { prompt: `With V = ${n(s.V)}, E = ${n(E)} and F = 1, what is χ = V − E + 1?`, answer: [chi], explanation: `${n(s.V)} − ${n(E)} + 1 = ${n(chi)}.` },
   { prompt: o ? `The surface is orientable with χ = ${n(chi)}. What is its genus?` : `The surface is not orientable with χ = ${n(chi)}. How many cross-caps does it have?`, answer: [gk], explanation: last }
  ] }; }
});

/* ---- q29 Chapter review: naming every hull [H 7.5] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The garden dome shell',
 brief: 'The garden dome’s shell is a sewn panel with extra pieces joined on, and its record needs a twist check, an Euler characteristic and a name.',
 labels: ['orientable (1 or 0)', 'χ', 'genus or cross-caps'], tolerance: 0.01,
 gl: [['χ'], ['orientable (1 or 0)'], ['genus or cross-caps']]
}, {
 /* A closed word of 2 or 3 letters x, y, z, then t tori (0 to 3) and q Klein bottles (0 to 3), not both 0. Not the parent's canonical (a b a b with 2 tori). */
 canonical: { w: W('x y z x⁻¹ y⁻¹ z⁻¹'), t: 1, q: 2 },
 draw: R => { for (let i = 0; i < 1000; i++) { const w = randomWord(R, R.int(2, 3), R.bool(), 'xyz'), q = R.bool() ? 0 : R.int(1, 3), t = R.int(q ? 0 : 1, 3);
   if (!(shape(w) === 'a b a b' && t === 2 && q === 0)) return { w, t, q }; } return { w: W('x y z x⁻¹ y⁻¹ z⁻¹'), t: 1, q: 2 }; },
 build: ({ w, t, q }) => { const { s, chi: cw, o: ow } = surf(w), chi = cw - 2 * t - 2 * q, o = ow && q === 0 ? 1 : 0, gk = o ? (2 - chi) / 2 : 2 - chi;
  const parts = [t ? pl(t, 'torus', 'tori') : '', q ? pl(q, 'Klein bottle', 'Klein bottles') : ''].filter(Boolean).join(' and ');
  const verb = t + q === 1 ? 'is' : 'are', drop = `${t ? ` − ${n(2 * t)}` : ''}${q ? ` − ${n(2 * q)}` : ''}`;
  const whyO = o ? 'The panel’s word has every letter once plain and once with ⁻¹, and only tori are joined on, so there is no Möbius strip anywhere: orientable, enter 1.'
   : (!ow ? `In the panel’s word the letter ${sameWay(w)} appears twice the same way round, which makes a Möbius strip, and joining more surfaces on keeps it: not orientable, enter 0.` : 'The panel itself is orientable, but a Klein bottle contains a Möbius strip, and joining it on brings the strip into the dome: not orientable, enter 0.');
  const last = o ? `Orientable with χ = ${n(chi)}: genus (2 − ${par(chi)}) ÷ 2 = ${n(gk)}.` : `Not orientable with χ = ${n(chi)}: 2 − ${par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`; return {
  prompt: `The shell of the garden dome is made in two stages. Stage one: a panel with ${n(s.N)} edges and seam word ${wordText(w)} is sewn shut, ${SEWING(s.N)}; the sewn panel has χ = V − E + 1, with V the number of vertex classes and E the number of letters. Stage two: ${parts} ${verb} joined on by connected sum, with χ(A # B) = χ(A) + χ(B) − 2 (χ = 0 for the torus and also for the Klein bottle, which contains a Möbius strip). The shell is orientable only if the panel passes the letter test (every letter once plain and once with ⁻¹) and no Klein bottle is joined on. Enter 1 if the finished shell is orientable and 0 if not, then its Euler characteristic, then its genus if it is orientable or its number of cross-caps (2 − χ) if it is not.`,
  answer: [o, chi, gk],
  hints: ['Sew the panel: join corners tail to tail and tip to tip, count the vertex classes V, and take χ = V − E + 1. Each torus or Klein bottle joined on lowers χ by 2.', 'A Möbius strip anywhere makes the whole shell non-orientable. Then use genus (2 − χ) ÷ 2 if it is orientable, or 2 − χ cross-caps.'],
  solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}, so the sewn panel has χ = ${n(s.V)} − ${n(s.pairs)} + 1 = ${n(cw)}. Joining on ${parts} gives χ = ${n(cw)}${drop} = ${n(chi)}. ${whyO} ${last}`,
  guidance: [
   { prompt: `Find the panel’s χ = V − E + 1, then lower it by 2 for each torus and each Klein bottle joined on. What is χ of the finished shell?`, answer: [chi], explanation: `The panel has ${pl(s.V, 'vertex class', 'vertex classes')} (${classText(s)}) and ${pl(s.pairs, 'edge', 'edges')}, so χ = ${n(cw)}; then ${n(cw)}${drop} = ${n(chi)}.` },
   { prompt: `Is the finished shell orientable? Enter 1 for yes, 0 for no.`, answer: [o], explanation: whyO },
   { prompt: o ? `The shell is orientable with χ = ${n(chi)}. What is its genus?` : `The shell is not orientable with χ = ${n(chi)}. How many cross-caps does it have?`, answer: [gk], explanation: last }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Two panels, one hull',
 brief: 'Two big panels are sewn shut separately and then joined into a single hull, which has to be named in the catalogue.',
 labels: ['χ of hull M', 'χ of hull N', 'genus or cross-caps'], tolerance: 0.01,
 gl: [['χ of hull M'], ['χ of hull N'], ['genus or cross-caps']]
}, {
 /* P: a closed word of 2 or 3 letters a to c. Q: a closed word of 2 letters x, y. Both orientable in about half of the draws. */
 canonical: { w1: W('a b c a⁻¹ c b⁻¹'), w2: W('x y x y') },
 draw: R => ({ w1: randomWord(R, R.int(2, 3), R.bool(), 'abc'), w2: randomWord(R, 2, R.bool(), 'xy') }),
 build: ({ w1, w2 }) => { const A = surf(w1), B = surf(w2), xs = A.chi + B.chi - 2, o = A.o && B.o ? 1 : 0, gk = o ? (2 - xs) / 2 : 2 - xs;
  const whyO = o ? 'Both hulls pass the letter test, so each is orientable and so is the joined hull.' : `${A.o ? 'Hull N' : 'Hull M'} is not orientable (it has a letter that appears twice the same way round), and a Möbius strip in either piece stays in the joined hull: the joined hull is not orientable.`;
  const last = o ? `Orientable with χ = ${n(xs)}: genus (2 − ${par(xs)}) ÷ 2 = ${n(gk)}.` : `Not orientable with χ = ${n(xs)}: 2 − ${par(xs)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`; return {
  prompt: `Two panels are sewn shut separately and then the two closed hulls are joined by connected sum, with χ(A # B) = χ(A) + χ(B) − 2. Panel M has ${n(A.s.N)} edges and seam word ${wordText(w1)}; panel N has ${n(B.s.N)} edges and seam word ${wordText(w2)}. For each panel the corners are numbered counterclockwise from corner 1, edge 1 runs from corner 1 to corner 2 and so on, and the last edge runs back to corner 1; a letter with ⁻¹ has its arrow pointing back against the reading direction, and the two edges with the same letter are sewn arrow to arrow, tail on tail and tip on tip. After sewing, a panel is one face and each letter is one edge, so its hull has χ = V − E + 1, with V the number of vertex classes. A hull is orientable if every letter appears once plain and once with ⁻¹ and not if some letter appears twice the same way round; the joined hull is orientable only if both hulls are. Enter χ of hull M, then χ of hull N, then the genus of the joined hull if it is orientable or its number of cross-caps (2 − χ) if it is not.`,
  answer: [A.chi, B.chi, gk],
  hints: ['Treat each panel on its own: join corners tail to tail and tip to tip, count the vertex classes V, and take χ = V − E + 1 with E the number of letters.', 'Join the two hulls with χ(A # B) = χ(A) + χ(B) − 2. Check both words for a letter that appears twice the same way round; then use genus (2 − χ) ÷ 2 if the joined hull is orientable, or 2 − χ cross-caps.'],
  solution: `Hull M: ${sewText(A.s)}. The corners fall into ${pl(A.s.V, 'vertex class', 'vertex classes')}: ${classText(A.s)}, so χ = ${n(A.s.V)} − ${n(A.s.pairs)} + 1 = ${n(A.chi)}. Hull N: ${sewText(B.s)}. The corners fall into ${pl(B.s.V, 'vertex class', 'vertex classes')}: ${classText(B.s)}, so χ = ${n(B.s.V)} − ${n(B.s.pairs)} + 1 = ${n(B.chi)}. Joined: χ = ${n(A.chi)} + ${par(B.chi)} − 2 = ${n(xs)}. ${whyO} ${last}`,
  guidance: [
   { prompt: `Sew panel M (seam word ${wordText(w1)}) and count its vertex classes. With E = ${n(A.s.pairs)} letters, what is χ = V − E + 1 for hull M?`, answer: [A.chi], explanation: `${sewText(A.s)[0].toUpperCase()}${sewText(A.s).slice(1)}. The classes are ${classText(A.s)}, so V = ${n(A.s.V)} and χ = ${n(A.s.V)} − ${n(A.s.pairs)} + 1 = ${n(A.chi)}.` },
   { prompt: `Sew panel N (seam word ${wordText(w2)}) and count its vertex classes. With E = ${n(B.s.pairs)} letters, what is χ = V − E + 1 for hull N?`, answer: [B.chi], explanation: `${sewText(B.s)[0].toUpperCase()}${sewText(B.s).slice(1)}. The classes are ${classText(B.s)}, so V = ${n(B.s.V)} and χ = ${n(B.s.V)} − ${n(B.s.pairs)} + 1 = ${n(B.chi)}.` },
   { prompt: `The joined hull has χ = ${n(A.chi)} + ${par(B.chi)} − 2 = ${n(xs)}. Hull M is ${A.o ? 'orientable' : 'not orientable'} and hull N is ${B.o ? 'orientable' : 'not orientable'}, so the joined hull is ${o ? 'orientable' : 'not orientable'}. ${o ? 'What is its genus?' : 'How many cross-caps does it have?'}`, answer: [gk], explanation: `${whyO} ${last}` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q22', title: 'The grand hull',
 brief: 'The gallery’s grandest hull starts from an eight-edge panel and has many pieces joined on, and its card needs all four of its numbers.',
 labels: ['vertex classes V', 'χ', 'orientable (1 or 0)', 'genus or cross-caps'], tolerance: 0.01,
 gl: [['vertex classes V'], ['χ'], ['orientable (1 or 0)'], ['genus or cross-caps']]
}, {
 /* A closed word of exactly 4 letters a to d (8 edges), then t tori (0 to 6) and p projective planes (0 to 6), not both 0 (p = 0 in about half of the draws). */
 canonical: { w: W('a b c a⁻¹ d b⁻¹ d c⁻¹'), t: 4, p: 3 },
 draw: R => { const p = R.bool() ? 0 : R.int(1, 6), t = R.int(p ? 0 : 1, 6); return { w: randomWord(R, 4, R.bool(), 'abcd'), t, p }; },
 build: ({ w, t, p }) => { const { s, chi: cw, o: ow } = surf(w), chi = cw - 2 * t - p, o = ow && p === 0 ? 1 : 0, gk = o ? (2 - chi) / 2 : 2 - chi;
  const parts = [t ? pl(t, 'torus', 'tori') : '', p ? pl(p, 'projective plane', 'projective planes') : ''].filter(Boolean).join(' and ');
  const verb = t + p === 1 ? 'is' : 'are', drop = `${t ? ` − ${n(2 * t)}` : ''}${p ? ` − ${n(p)}` : ''}`;
  const whyO = o ? 'The panel’s word has every letter once plain and once with ⁻¹, and only tori are joined on, so there is no Möbius strip anywhere: orientable, enter 1.'
   : (!ow ? `In the panel’s word the letter ${sameWay(w)} appears twice the same way round, which makes a Möbius strip, and joining more surfaces on keeps it: not orientable, enter 0.` : 'The panel itself is orientable, but a projective plane contains a Möbius strip, and joining it on brings the strip into the hull: not orientable, enter 0.');
  const last = o ? `Orientable with χ = ${n(chi)}: genus (2 − ${par(chi)}) ÷ 2 = ${n(gk)}.` : `Not orientable with χ = ${n(chi)}: 2 − ${par(chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}.`; return {
  prompt: `Work order for the grandest hull in the gallery. Start with a flat panel with ${n(s.N)} edges and gluing word ${wordText(w)}: the corners are numbered 1 to ${n(s.N)} counterclockwise, edge 1 runs from corner 1 to corner 2 and edge ${n(s.N)} back to corner 1, a letter with ⁻¹ has its arrow pointing back, and the two edges with the same letter are sewn arrow to arrow, tail on tail and tip on tip. Sewn shut, it has ${n(s.pairs)} edges and one face, so χ = V − E + 1. Then ${parts} ${verb} joined on by connected sum, with χ(A # B) = χ(A) + χ(B) − 2 (χ = 0 for the torus, 1 for the projective plane). The finished hull is orientable only if every letter of the word appears once plain and once with ⁻¹ (twice the same way round makes a Möbius strip) and no projective plane is joined on, since a projective plane contains a Möbius strip. An orientable hull has genus (2 − χ) ÷ 2 and one that is not has 2 − χ cross-caps. Enter the number of vertex classes V of the sewn panel, then the Euler characteristic of the finished hull, then 1 if it is orientable and 0 if not, then its genus if it is orientable or its number of cross-caps if it is not.`,
  answer: [s.V, chi, o, gk],
  hints: ['Join the corners that the sewings put together until nothing more joins; each group is a vertex class. The sewn panel has χ = V − E + 1, and each torus joined on lowers χ by 2 and each projective plane by 1.', 'The hull is orientable only if the panel’s word has every letter once plain and once with ⁻¹ and no projective plane is joined on. Then use genus (2 − χ) ÷ 2, or 2 − χ cross-caps.'],
  solution: `Reading the arrows: ${sewText(s)}. The corners fall into ${pl(s.V, 'vertex class', 'vertex classes')}: ${classText(s)}, so V = ${n(s.V)} and the sewn panel has χ = ${n(s.V)} − ${n(s.pairs)} + 1 = ${n(cw)}. Joining on ${parts} gives χ = ${n(cw)}${drop} = ${n(chi)}. ${whyO} ${last}`,
  guidance: [
   { prompt: `Sew tails to tails and tips to tips. How many vertex classes do the ${n(s.N)} corners fall into?`, answer: [s.V], explanation: `${sewText(s)[0].toUpperCase()}${sewText(s).slice(1)}. That leaves ${pl(s.V, 'class', 'classes')}: ${classText(s)}.` },
   { prompt: `The sewn panel has χ = ${n(s.V)} − ${n(s.pairs)} + 1 = ${n(cw)}. Lower it by 2 for each torus and 1 for each projective plane joined on. What is χ of the finished hull?`, answer: [chi], explanation: `${n(cw)}${drop} = ${n(chi)}.` },
   { prompt: `Is the finished hull orientable? Enter 1 for yes, 0 for no.`, answer: [o], explanation: whyO },
   { prompt: o ? `The hull is orientable with χ = ${n(chi)}. What is its genus?` : `The hull is not orientable with χ = ${n(chi)}. How many cross-caps does it have?`, answer: [gk], explanation: last }
  ] }; }
});

/* ---- q30 Curvature of a sphere [H 7.1] ---- */

/* Radii whose 1 ÷ s² has at most four decimals, and curvatures whose 1 ÷ √k is a short decimal. */
const RADII = [2, 5, 10, 20, 25, 50, 0.5, 1.25, 2.5, 12.5, 0.8];
const CURVES = [0.0004, 0.0016, 0.0025, 0.0064, 0.01, 0.16, 0.25, 0.64, 4, 0.0256];
/* The same list with larger curvatures too (1 ÷ √k is 0.25 to 0.4 there), for the scaling mission. */
const CURVES_C = CURVES.concat([0.0625, 1, 6.25, 16, 25]);
const sqrtK = k => tidy(1 / Math.sqrt(k));
const met = x => `${n(x)} ${x === 1 ? 'metre' : 'metres'}`;
/* A value with at most four decimals, at least 0.0001. */
const short = x => x >= 0.0001 && Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-7;

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The inflating weather balloon',
 brief: 'A weather balloon is inflated on the Observatory pad, and the log needs its curvature before and after.',
 labels: ['radius at first (m)', 'curvature later (per m²)'], tolerance: 0.00005,
 gl: [['radius (m)'], ['k (per m²)']]
}, {
 /* A first curvature K (not the parent's 0.04) and a later, larger radius s (not 4 or 8) from the lists. */
 canonical: { K: 0.16, s: 12.5 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { K: R.pick(CURVES), s: R.pick(RADII) }; if (p.s > sqrtK(p.K)) return p; } return { K: 0.16, s: 12.5 }; },
 build: ({ K, s }) => { const r = sqrtK(K), k = tidy(1 / (s * s)); return {
  prompt: `A weather balloon is inflated on the Observatory pad, and its wall stays a sphere the whole time. A gauge on the wall first reads a curvature of ${n(K)} per square metre. Enter the radius of the balloon at that moment, in metres. Later the balloon has grown to a radius of ${n(s)} metres; enter its curvature then, in units of 1 per square metre. The curvature is an exact decimal, so type it in full.`,
  answer: [r, k],
  hints: ['A sphere of radius s has the same curvature at every point, k = 1 ÷ s². Turned round, s² = 1 ÷ k, so s = 1 ÷ √k.', 'A larger sphere bends more gently, so the later curvature should be smaller than the first reading.'],
  solution: `At first s² = 1 ÷ ${n(K)} = ${n(r * r)}, so s = √${n(r * r)} = ${met(r)}. Later k = 1 ÷ s² = 1 ÷ ${n(s)}² = 1 ÷ ${n(s * s)} = ${n(k)} per square metre.`,
  guidance: [
   { prompt: `The gauge reads k = ${n(K)}, so s² = 1 ÷ ${n(K)} = ${n(r * r)}. What is the radius s?`, answer: [r], explanation: `√${n(r * r)} = ${met(r)}.` },
   { prompt: `The radius is now ${n(s)} m, so s² = ${n(s * s)}. What is k = 1 ÷ s²?`, answer: [k], explanation: `1 ÷ ${n(s * s)} = ${n(k)} per square metre.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Scaling up the test sphere',
 brief: 'The Observatory is building a larger copy of its calibration sphere, and the log needs the radius of each and the curvature of the new one.',
 labels: ['calibration radius (m)', 'new radius (m)', 'new curvature (per m²)'], tolerance: 0.00005,
 gl: [['radius (m)'], ['new radius (m)'], ['k (per m²)']]
}, {
 /* Calibration curvature K from the list (not 0.04) and a scale factor f (2 to 10) such that K ÷ f² has at most four decimals. */
 canonical: { K: 0.0064, f: 2 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { K: R.pick(CURVES_C), f: R.pick([2, 3, 4, 5, 8, 10]) }; if (short(tidy(p.K / (p.f * p.f)))) return p; } return { K: 0.0064, f: 2 }; },
 build: ({ K, f }) => { const s1 = sqrtK(K), s2 = tidy(s1 * f), k2 = tidy(1 / (s2 * s2)); return {
  prompt: `The Observatory’s calibration sphere has a curvature of ${n(K)} per square metre at every point of its surface. The crew builds a larger sphere with a radius ${n(f)} times as big. Enter the radius of the calibration sphere in metres, then the radius of the larger sphere in metres, then the curvature of the larger sphere in units of 1 per square metre (an exact decimal, so type it in full).`,
  answer: [s1, s2, k2],
  hints: ['A sphere of radius s has the same curvature at every point, k = 1 ÷ s². Turned round, s² = 1 ÷ k, so s = 1 ÷ √k.', 'Multiply the first radius by the scale factor to get the new radius, then use k = 1 ÷ s² again on the new radius.'],
  solution: `For the calibration sphere s² = 1 ÷ ${n(K)} = ${n(s1 * s1)}, so s = ${met(s1)}. The larger sphere has radius ${n(f)} × ${n(s1)} = ${met(s2)}, so its curvature is k = 1 ÷ ${n(s2)}² = 1 ÷ ${n(s2 * s2)} = ${n(k2)} per square metre.`,
  guidance: [
   { prompt: `The calibration sphere has k = ${n(K)}, so s² = 1 ÷ ${n(K)} = ${n(s1 * s1)}. What is its radius s?`, answer: [s1], explanation: `√${n(s1 * s1)} = ${met(s1)}.` },
   { prompt: `The larger sphere has ${n(f)} times that radius, ${n(s1)} m. What is its radius?`, answer: [s2], explanation: `${n(f)} × ${n(s1)} = ${met(s2)}.` },
   { prompt: `The larger sphere has radius ${n(s2)} m, so s² = ${n(s2 * s2)}. What is its curvature k = 1 ÷ s²?`, answer: [k2], explanation: `1 ÷ ${n(s2 * s2)} = ${n(k2)} per square metre.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', title: 'Curvature in centimetres and metres',
 brief: 'Two gauges on the Observatory’s test rig use different units, and the readings have to be converted before they can be compared.',
 labels: ['k (per cm²)', 'k (per m²)', 'radius (cm)'], tolerance: 0.00005,
 gl: [['k (per cm²)'], ['k (per m²)'], ['radius (cm)']]
}, {
 /* A ball of radius s centimetres (1 ÷ s² has at most four decimals; not the parent's examples) and a tank of curvature K per square metre
    whose radius 100 ÷ √K centimetres is a whole or short number below 10000. */
 canonical: { s: 20, K: 0.0064 },
 draw: R => ({ s: R.pick([2, 4, 5, 10, 20, 25, 50, 1.25, 2.5, 0.8]), K: R.pick([0.0016, 0.0025, 0.0064, 0.01, 0.04, 0.16, 0.25, 0.64, 4, 0.0256]) }),
 build: ({ s, K }) => { const kc = tidy(1 / (s * s)), km = tidy(kc * 10000), rm = sqrtK(K), rc = tidy(rm * 100); return {
  prompt: `A test ball on the Observatory’s rig is a sphere of radius ${n(s)} centimetres. Curvature is measured in 1 per square unit of length, and a square metre is 10000 square centimetres, so the same curvature is 10000 times as big per square metre as it is per square centimetre. Enter the curvature of the ball in units of 1 per square centimetre, then in units of 1 per square metre; both are exact decimals or whole numbers, so type them in full and without commas. A spherical tank on the rig has a curvature of ${n(K)} per square metre at every point of its wall; enter the radius of the tank in centimetres.`,
  answer: [kc, km, rc],
  hints: ['A sphere of radius s has curvature k = 1 ÷ s² at every point, in 1 per square of whatever unit s is in. The same curvature per square metre is 10000 times the value per square centimetre.', 'For the tank, find the radius in metres first from s = 1 ÷ √k, then multiply by 100 to change metres to centimetres.'],
  solution: `Per square centimetre: k = 1 ÷ ${n(s)}² = 1 ÷ ${n(s * s)} = ${n(kc)}. Per square metre it is 10000 times as big: ${n(kc)} × 10000 = ${n(km)}. For the tank, s² = 1 ÷ ${n(K)} = ${n(rm * rm)}, so s = ${met(rm)}, which is ${n(rm)} × 100 = ${n(rc)} centimetres.`,
  guidance: [
   { prompt: `The ball’s radius is ${n(s)} cm, so s² = ${n(s * s)}. What is k = 1 ÷ s², in 1 per square centimetre?`, answer: [kc], explanation: `1 ÷ ${n(s * s)} = ${n(kc)} per square centimetre.` },
   { prompt: `A square metre is 10000 square centimetres, so the curvature per square metre is 10000 times the value per square centimetre, ${n(kc)}. What is it per square metre?`, answer: [km], explanation: `${n(kc)} × 10000 = ${n(km)} per square metre.` },
   { prompt: `The tank has k = ${n(K)} per square metre, so s² = 1 ÷ ${n(K)} = ${n(rm * rm)} square metres and s = ${n(rm)} m. What is its radius in centimetres?`, answer: [rc], explanation: `${n(rm)} × 100 = ${n(rc)} centimetres.` }
  ] }; }
});

})();
