/* Graph theory: networks practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p6.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Helpers. practice(meta, stepLabels, generator) registers a mission through add(): its prompt, answers, hints,
   solution and guided steps are build(canonical) itself (cleaned as the engine cleans them), so the authored text
   and the generator cannot drift apart. `meta` holds id, parent, kind, title, brief, labels, tolerance (and uses);
   `stepLabels` holds the answer labels of each guided step, in order. The canonical parameters are the first draw of
   a fixed seed, so they always satisfy the generator's own filters. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm graph
   Networks are lists of edges [a, b], a < b, sorted; the prompt prints them as "1–2". */
const practice = (meta, stepLabels, generator) => {
 generator.canonical = generator.draw(G.rng(6, meta.id, 1));
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
const pair = (a, b) => a < b ? [a, b] : [b, a];
const sortEdges = edges => edges.map(e => pair(e[0], e[1])).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
const dash = e => `${n(e[0])}–${n(e[1])}`;
const join = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const arrows = xs => xs.join(' → ');
const plural = (c, one, many) => `${n(c)} ${c === 1 ? one : many}`;
const lc = t => t.charAt(0).toLowerCase() + t.slice(1), uc = t => t.charAt(0).toUpperCase() + t.slice(1);
const adjOf = (V, edges) => { const A = Array.from({ length: V + 1 }, () => []); for (const [a, b] of edges) { A[a].push(b); A[b].push(a); } A.forEach(l => l.sort((x, y) => x - y)); return A; };
const shuffle = (R, xs) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R.next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const allPairs = V => { const P = []; for (let a = 1; a <= V; a++) for (let b = a + 1; b <= V; b++) P.push([a, b]); return P; };
const sum = xs => xs.reduce((s, x) => s + x, 0);
const connected = (V, A) => { const seen = new Set([1]), Q = [1]; while (Q.length) for (const v of A[Q.shift()]) if (!seen.has(v)) { seen.add(v); Q.push(v); } return seen.size === V; };
/* Proper colouring with k colours by backtracking (colour numbers 1..k), or null. */
const colourWith = (V, A, k) => { const c = Array(V + 1).fill(0); const go = v => { if (v > V) return true; for (let x = 1; x <= k; x++) if (A[v].every(u => c[u] !== x)) { c[v] = x; if (go(v + 1)) return true; c[v] = 0; } return false; }; return go(1) ? c : null; };
const chromatic = (V, A) => { for (let k = 1; k <= V; k++) { const c = colourWith(V, A, k); if (c) return { k, c }; } return { k: V, c: [] }; };
/* The vertices of the largest clique (first found among equal sizes). */
const maxClique = (V, A) => { let best = []; for (let m = 1; m < 1 << V; m++) { const S = []; for (let i = 0; i < V; i++) if (m >> i & 1) S.push(i + 1);
 if (S.length > best.length && S.every((a, i) => S.slice(i + 1).every(b => A[a].includes(b)))) best = S; } return best; };
/* An odd cycle as a list of vertices (the last joins back to the first), or null when there is none. skip is a vertex to leave out. */
const oddCycle = (V, A, skip = 0) => { const depth = Array(V + 1).fill(-1), par = Array(V + 1).fill(0);
 for (let s = 1; s <= V; s++) { if (depth[s] >= 0 || s === skip) continue; depth[s] = 0; const Q = [s];
  while (Q.length) { const u = Q.shift(); for (const v of A[u]) if (v !== skip && depth[v] < 0) { depth[v] = depth[u] + 1; par[v] = u; Q.push(v); } } }
 for (let u = 1; u <= V; u++) for (const v of A[u]) if (u < v && u !== skip && v !== skip && depth[u] % 2 === depth[v] % 2) {
  let a = u, b = v; const pa = [a], pb = [b];
  while (a !== b) { if (depth[a] >= depth[b]) { a = par[a]; pa.push(a); } else { b = par[b]; pb.push(b); } }
  pb.pop(); return pa.concat(pb.reverse()); }
 return null; };
/* "colour 1 to parts 1 and 4, colour 2 to part 2 ..." (verb 'to') or "batches 1 and 7 in slot 1, ..." (verb 'in'). */
const classes = (V, c, k, noun, item, verb) => join(Array.from({ length: k }, (_, i) => { const S = []; for (let v = 1; v <= V; v++) if (c[v] === i + 1) S.push(v); const who = `${item}${S.length > 1 ? (/(ch|sh|s|x)$/.test(item) ? 'es' : 's') : ''} ${join(S.map(String))}`; return verb === 'to' ? `${noun} ${i + 1} to ${who}` : `${who} in ${noun} ${i + 1}`; }));
/* The two banks of a connected bipartite network, from vertex 1 (bank A) outwards. */
const banks = (V, A) => { const col = Array(V + 1).fill(-1); col[1] = 0; const Q = [1]; while (Q.length) { const u = Q.shift(); for (const v of A[u]) if (col[v] < 0) { col[v] = 1 - col[u]; Q.push(v); } }
 const a = [], b = []; for (let v = 1; v <= V; v++) (col[v] === 0 ? a : b).push(v); return { a, b }; };
/* A random connected bipartite graph on V vertices with sides of at least 2, plus `extra` more edges across. */
const randomBipartite = (R, V, extra) => { let side; do { side = [0]; for (let v = 1; v <= V; v++) side.push(R.bool() ? 1 : 0); } while (side.filter((s, i) => i && s === 0).length < 2 || side.filter((s, i) => i && s === 1).length < 2);
 const order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)); const i2 = order.findIndex(v => side[v] !== side[order[0]]); [order[1], order[i2]] = [order[i2], order[1]];
 const E = [pair(order[0], order[1])];
 for (let i = 2; i < V; i++) { const v = order[i], opts = order.slice(0, i).filter(u => side[u] !== side[v]); E.push(pair(v, R.pick(opts))); }
 const cross = allPairs(V).filter(([a, b]) => side[a] !== side[b] && !E.some(e => e[0] === a && e[1] === b));
 shuffle(R, cross).slice(0, extra).forEach(e => E.push(e)); return { side, edges: sortEdges(E) }; };
/* A ring of r exams (labelled 0..r−1 here), non-crossing chords inside it and sometimes a hub outside linked to the whole ring. */
const crosses = ([a, b], [c, d]) => (a < c && c < b && b < d) || (c < a && a < d && d < b);
const examEdges = ({ r, chords, hub, label }) => { const E = []; for (let i = 0; i < r; i++) E.push([i, (i + 1) % r]); chords.forEach(c => E.push(c)); if (hub) for (let i = 0; i < r; i++) E.push([i, r]);
 return sortEdges(E.map(([a, b]) => [label[a], label[b]])); };
const examDraw = (R, rLo, rHi, minChords) => { const r = R.int(rLo, rHi), want = R.int(minChords, Math.max(minChords, r - 3)), chords = [];
 for (const c of shuffle(R, allPairs(r).map(([a, b]) => [a - 1, b - 1]).filter(([a, b]) => b - a > 1 && !(a === 0 && b === r - 1)))) if (chords.length < want && !chords.some(d => crosses(c, d))) chords.push(c);
 const hub = r === 5 && !chords.length ? 1 : R.bool() ? 1 : 0;
 return { r, chords: chords.sort((x, y) => x[0] - y[0] || x[1] - y[1]), hub, label: shuffle(R, Array.from({ length: r + hub }, (_, i) => i + 1)) }; };
/* Everything the exam-network missions need: the links, the faces F = 2 − V + E, the fewest slots and the reason. */
const examInfo = (p, item = 'batch') => { const V = p.r + p.hub, edges = examEdges(p), E = edges.length, F = 2 - V + E, A = adjOf(V, edges), { k, c } = chromatic(V, A), cl = maxClique(V, A);
 const hubL = p.hub ? p.label[p.r] : 0, cyc = oddCycle(V, A, hubL);
 const why = k === 2 ? 'There is at least one conflict, so one slot is not enough.' : cl.length === k ? `${item === 'batch' ? 'Batches' : 'Exams'} ${join(cl.map(String))} all conflict with one another, so they need ${k} different slots.`
  : k === 3 ? `The odd cycle ${arrows([...cyc, cyc[0]])} cannot be done in 2 slots.` : `The odd cycle ${arrows([...cyc, cyc[0]])} needs 3 slots, and ${item} ${hubL} conflicts with all of them, so it needs a fourth.`;
 return { V, edges, E, F, k, c, why }; };
/* Matchings: Kuhn's augmenting paths with rows in order; the set of rows with the largest shortfall (Hall). adj[i] lists the columns of row i. */
const LET = 'ABCDEFGH';
const bestMatching = (c, adj) => { const owner = {}; const tryC = (i, seen) => { for (const t of adj[i]) { if (seen.has(t)) continue; seen.add(t); if (owner[t] === undefined || tryC(owner[t], seen)) { owner[t] = i; return true; } } return false; };
 let M = 0; for (let i = 0; i < c; i++) if (tryC(i, new Set())) M++; const got = Array(c).fill(-1); Object.keys(owner).forEach(t => { got[owner[t]] = Number(t); }); return { M, got }; };
const shortfall = (c, adj) => { let best = { d: 0, S: [], N: [] }; for (let m = 1; m < 1 << c; m++) { const S = [], N = new Set(); for (let i = 0; i < c; i++) if (m >> i & 1) { S.push(i); adj[i].forEach(t => N.add(t)); }
  const d = S.length - N.size; if (d > best.d || (d === best.d && d > 0 && S.length < best.S.length)) best = { d, S, N: [...N].sort((x, y) => x - y) }; } return best; };
const taskList = ts => join(ts.map(t => LET[t]));
/* "unit A" or "units A and B": a noun with its list, singular or plural by the list's length. */
const grp = (xs, one, many) => `${xs.length === 1 ? one : many} ${join(xs)}`;
/* c rows (crew) and t columns (tasks), each row listing 1 to 3 columns; `ok` decides which draws are kept (with a guard so a draw always ends). */
const drawRota = (R, cLo, cHi, tLo, tHi, ok) => { for (let guard = 0; ; guard++) { const c = R.int(cLo, cHi), t = R.int(tLo, tHi);
 const adj = Array.from({ length: c }, () => shuffle(R, Array.from({ length: t }, (_, i) => i)).slice(0, R.int(1, 3)).sort((x, y) => x - y));
 const example = c === 4 && t === 4 && JSON.stringify(adj) === '[[0,1],[0],[1,2],[2]]';
 if (!example && (ok(c, t, adj, bestMatching(c, adj).M) || guard > 300)) return { c, t, adj }; } };
const transpose = (c, t, adj) => Array.from({ length: t }, (_, j) => adj.map((l, i) => l.includes(j) ? i : -1).filter(i => i >= 0));
const options = (ts, lead, only) => ts.length > 1 ? `${lead} ${ts.slice(0, -1).map(x => LET[x]).join(', ')} or ${LET[ts[ts.length - 1]]}` : `${only} ${LET[ts[0]]}`;

/* ---- q26 Polyhedra from Euler's formula [KT5.5] ---- */

/* q26b: a pyramid whose base has m sides (3 to 40), not the cube of the worked example. Asked: V, E, F. */
practice({ id: 'q26b', parent: 'q26', kind: 'setting', title: 'The antenna housing',
 brief: 'The antenna housings are pyramids on many-sided bases, and the stores need the joints, struts and panels of each.',
 labels: ['corners V', 'edges E', 'faces F'], tolerance: 0.01 },
 [['corners V'], ['faces F'], ['edges E']], {
 draw: R => ({ m: R.int(3, 40) }),
 build: ({ m }) => { const V = m + 1, F = m + 1, E = V + F - 2; return {
  prompt: `The Circuit Shop is building an antenna housing shaped like a pyramid, a polyhedron: a closed solid with flat faces, straight edges and no holes through it, so its corners and edges can be drawn flat as a connected plane drawing. The base is a flat face with ${m} sides. One extra corner, the tip, sits above the base and is joined by a straight edge to each of the ${m} corners of the base, so the sloping faces are ${m} triangles. Enter the number of corners V, then of edges E, then of faces F.`,
  answer: [V, E, F],
  hints: ['Count the corners and faces straight from the shape: the corners are those of the base and the tip, and the faces are the base and the triangles round the slope.', 'With V and F counted, Euler’s formula V − E + F = 2 gives E = V + F − 2. You can check E by counting the edges round the base and the edges running up to the tip.'],
  solution: `The base has ${m} corners and the tip is one more, so V = ${m} + 1 = ${n(V)}. The faces are the base and ${m} triangles, so F = ${m} + 1 = ${n(F)}. Euler’s formula V − E + F = 2 gives E = V + F − 2 = ${n(V)} + ${n(F)} − 2 = ${n(E)}. Check by counting: ${m} edges round the base and ${m} running up to the tip make ${n(E)}.`,
  guidance: [
   { prompt: `The base has ${m} corners and there is one more corner, the tip. How many corners does the housing have?`, answer: [V], explanation: `${m} + 1 = ${n(V)}.` },
   { prompt: `Count the faces: the base and the sloping triangles, one for each of the ${m} sides of the base.`, answer: [F], explanation: `${m} + 1 = ${n(F)}.` },
   { prompt: 'Euler’s formula gives E = V + F − 2. How many edges are there?', answer: [E], explanation: `${n(V)} + ${n(F)} − 2 = ${n(E)}.` }
  ] }; }
});

/* q26c: a regular solid other than the cube, priced by panels (faces), struts (edges) and joints (corners). */
const SOLIDS = [[3, 3], [3, 4], [5, 3], [3, 5]], FACE = { 3: 'triangle', 5: 'pentagon' };
practice({ id: 'q26c', parent: 'q26', kind: 'applied', title: 'Pricing the cage parts',
 brief: 'The stores need an order for one sensor cage, priced by the panel, the strut and the joint.',
 labels: ['struts E', 'panels F', 'total cost (credits)'], tolerance: 0.01 },
 [['struts E'], ['corners V', 'panels F'], ['total cost (credits)']], {
 draw: R => { const [p, q] = R.pick(SOLIDS); return { p, q, a: R.int(5, 40), b: R.int(3, 20), j: R.int(2, 15) }; },
 build: ({ p, q, a, b, j }) => { const den = 2 * p + 2 * q - p * q, E = 2 * p * q / den, V = 2 * E / q, F = 2 * E / p, cost = a * F + b * E + j * V; return {
  prompt: `The Circuit Shop is ordering the parts for a sensor cage shaped like a polyhedron: a closed solid with flat faces, straight edges and no holes through it. Every face is a ${FACE[p]} (${p} edges), and exactly ${q} faces meet at every corner. A flat panel (one for each face) costs ${n(a)} credits, a strut (one for each edge) costs ${n(b)} credits and a joint (one for each corner) costs ${n(j)} credits. Enter the number of struts, then the number of panels, then the total cost of the parts in credits (type it without commas).`,
  answer: [E, F, cost],
  hints: ['Count edge ends two ways. Each face has p edges and each edge borders 2 faces, so pF = 2E. Each corner has q edges and each edge has 2 ends, so qV = 2E. Put these into V − E + F = 2 to find E.', 'The cost is the number of panels times the panel price, plus the struts times the strut price, plus the joints times the joint price. You need the number of corners as well as the other two counts.'],
  solution: `Each face has ${p} edges and each edge borders 2 faces, so ${p}F = 2E. At each corner ${q} edges meet and each edge has 2 ends, so ${q}V = 2E. Euler’s formula V − E + F = 2 gives E = 2pq ÷ (2p + 2q − pq) = ${2 * p * q} ÷ (${2 * p} + ${2 * q} − ${p * q}) = ${2 * p * q} ÷ ${den} = ${n(E)}. So V = 2 × ${n(E)} ÷ ${q} = ${n(V)} and F = 2 × ${n(E)} ÷ ${p} = ${n(F)}. Cost: ${n(F)} × ${n(a)} + ${n(E)} × ${n(b)} + ${n(V)} × ${n(j)} = ${n(a * F)} + ${n(b * E)} + ${n(j * V)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `For p = ${p} and q = ${q}, work out 2p + 2q − pq and then E = 2pq ÷ (2p + 2q − pq). How many struts are there?`, answer: [E], explanation: `${2 * p} + ${2 * q} − ${p * q} = ${den}, and ${2 * p * q} ÷ ${den} = ${n(E)}.` },
   { prompt: 'Use qV = 2E and pF = 2E. How many corners and how many panels are there?', answer: [V, F], explanation: `V = ${2 * E} ÷ ${q} = ${n(V)} and F = ${2 * E} ÷ ${p} = ${n(F)}.` },
   { prompt: `There are ${n(F)} panels at ${n(a)} credits, ${n(E)} struts at ${n(b)} credits and ${n(V)} joints at ${n(j)} credits. What is the total cost in credits?`, answer: [cost], explanation: `${n(a * F)} + ${n(b * E)} + ${n(j * V)} = ${n(cost)}.` }
  ] }; }
});

/* q26d (uses q25): a polyhedron with V corners and all faces triangles (E = 3V − 6) or all faces four-sided (E = 2V − 4),
   with any number of faces at each corner. V is even from 10 for four-sided faces so such a solid exists and is not the cube. Asked: E, F. */
practice({ id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q25', title: 'The cage of one face shape',
 brief: 'The biggest cage has a known number of corners and a single face shape, and the stores want its struts and panels before the corners are even counted.',
 labels: ['edges E', 'faces F'], tolerance: 0.01 },
 [['edges E'], ['faces F']], {
 draw: R => { const p = R.bool() ? 3 : 4; return { p, V: p === 3 ? R.int(6, 40) : 2 * R.int(5, 20) }; },
 build: ({ p, V }) => { const d = p === 3 ? 3 : 2, E = d * (V - 2), F = 2 * E / p, face = p === 3 ? 'a triangle (3 edges)' : 'a quadrilateral (4 edges)'; return {
  prompt: `The Circuit Shop's largest sensor cage is a polyhedron: a closed solid with flat faces, straight edges and no holes through it, with ${V} corners. Every face is ${face}, but the number of faces that meet at a corner can differ from one corner to the next. Enter the number of edges E, then the number of faces F.`,
  answer: [E, F],
  hints: ['Counting edge ends still works when the corners differ: each face has p edges and each edge borders 2 faces, so pF = 2E. Only the corners need a different idea.', 'Write F = 2E ÷ p in Euler’s formula V − E + F = 2, collect the E terms and solve for E. This is the planar edge limit from the earlier mission, reached with nothing to spare.'],
  solution: `Every face has ${p} edges and each edge borders 2 faces, so ${p}F = 2E and F = 2E ÷ ${p}. Euler’s formula V − E + F = 2 becomes ${V} − E + 2E ÷ ${p} = 2, which is ${V} − E ÷ ${d} = 2. So E ÷ ${d} = ${V} − 2 = ${V - 2} and E = ${d} × ${V - 2} = ${n(E)}. Then F = 2 × ${n(E)} ÷ ${p} = ${n(F)}. Check: ${V} − ${n(E)} + ${n(F)} = 2.`,
  guidance: [
   { prompt: `With F = 2E ÷ ${p}, Euler’s formula V − E + F = 2 becomes ${V} − E ÷ ${d} = 2. What is E?`, answer: [E], explanation: `E ÷ ${d} = ${V} − 2 = ${V - 2}, so E = ${d} × ${V - 2} = ${n(E)}.` },
   { prompt: `Each face has ${p} edges and each edge borders 2 faces, so ${p}F = 2E. How many faces are there?`, answer: [F], explanation: `F = 2 × ${n(E)} ÷ ${p} = ${n(F)}.` }
  ] }; }
});

/* ---- q27 Bipartite graphs and odd cycles [KT5.4] ---- */

/* q27b: a connected network on 7 to 9 sensors, bipartite or one cable inside a group; then the most cables between groups of a and b sensors. */
practice({ id: 'q27b', parent: 'q27', kind: 'setting', title: 'Relay groups for the sensors',
 brief: 'The sensor array has to be split into two relay groups, and the shop wants to know whether the cabling allows it and how many cables a split array could ever carry.',
 labels: ['split exists (1 or 0)', 'most cables'], tolerance: 0.01 },
 [['sensors that go in group Y first'], ['split exists (1 or 0)'], ['most cables']], {
 draw: R => { for (;;) { const V = R.int(7, 9), { side, edges } = randomBipartite(R, V, R.int(1, 4));
  if (R.bool()) { const inside = allPairs(V).filter(([x, y]) => side[x] === side[y]); edges.push(R.pick(inside)); }
  let a, b; do { a = R.int(2, 9); b = R.int(2, 9); } while (a === 3 && b === 5); return { V, edges: sortEdges(edges), a, b }; } },
 build: ({ V, edges, a, b }) => { const A = adjOf(V, edges), cyc = oddCycle(V, A), bip = cyc ? 0 : 1, bk = bip ? banks(V, A) : null;
  return {
  prompt: `The Circuit Shop has a sensor array of ${V} sensors, numbered 1 to ${V}, joined by data cables: ${join(edges.map(dash))}. The array is to be split into two relay groups, X and Y, so that every cable runs between a sensor in X and a sensor in Y, and no cable stays inside a group. Enter 1 if such a split exists, or 0 if not. Then the shop plans a new array with ${a} sensors in group X and ${b} in group Y. No two sensors may be joined by more than one cable, and every cable must run between the groups. Enter the most cables the new array could have.`,
  answer: [bip, a * b],
  hints: ['Start with sensor 1 in group X, put all its neighbours in group Y, and carry on, each sensor opposite its neighbours. A cable inside one group means no split exists: it closes an odd cycle.', 'The most cables come when every sensor in X is joined to every sensor in Y, one cable each. Count the cables each sensor of X can have.'],
  solution: `${bip ? `Putting sensors ${join(bk.a.map(String))} in X and ${join(bk.b.map(String))} in Y makes every cable run between the groups, so a split exists: enter 1.` : `The array has the odd cycle ${arrows([...cyc, cyc[0]])}, with ${cyc.length} cables. Going round it the groups would have to alternate X, Y, X, … and an odd number of steps cannot end back where it started, so no split exists: enter 0.`} In the new array each of the ${a} sensors in X can have one cable to each of the ${b} sensors in Y, so the most is ${a} × ${b} = ${n(a * b)} cables.`,
  guidance: [
   { prompt: `Put sensor 1 in group X. Its neighbours must all go in group Y. How many sensors go in Y straight away?`, answer: [A[1].length], explanation: `Sensor 1 is joined to ${join(A[1].map(String))}, so ${A[1].length === 1 ? 'that sensor goes' : `those ${A[1].length} sensors go`} in group Y.` },
   { prompt: 'Keep sorting the sensors, each into the group opposite its neighbours. Does every cable end up between the groups? Enter 1 for yes, 0 for no.', answer: [bip], explanation: bip ? `Yes: X = ${join(bk.a.map(String))} and Y = ${join(bk.b.map(String))}.` : `No: the cycle ${arrows([...cyc, cyc[0]])} has an odd number of cables, so two sensors of one group end up joined.` },
   { prompt: `With ${a} sensors in X and ${b} in Y, what is the most cables the new array can have?`, answer: [a * b], explanation: `Each of the ${a} sensors in X is joined to all ${b} in Y: ${a} × ${b} = ${n(a * b)}.` }
  ] }; }
});

/* q27c: a rack K_{m,n} of controllers and sensors plus a spare chip wired to p controllers and q sensors (never both 0).
   The spare chip leaves the network bipartite only when p = 0 or q = 0: otherwise it, a controller and a sensor form a triangle. */
practice({ id: 'q27c', parent: 'q27', kind: 'applied', title: 'The spare chip on the rack',
 brief: 'A rack of controllers and sensors is already wired, a spare chip is about to be added, and the shop wants to know whether the rack stays two-banked and what the cabling costs.',
 labels: ['cables before the spare', 'bipartite (1 or 0)', 'total cost (credits)'], tolerance: 0.01 },
 [['cables before the spare'], ['bipartite (1 or 0)'], ['total cost (credits)']], {
 draw: R => { for (;;) { const m = R.int(3, 8), nn = R.int(3, 8), mode = R.int(0, 3); if (m === 3 && nn === 5) continue;
  const p = mode === 0 ? 0 : R.int(1, m), q = mode === 1 ? 0 : R.int(1, nn); return { m, nn, p: mode === 0 ? 0 : p, q: mode === 1 ? 0 : q, c: R.int(5, 40) }; } },
 build: ({ m, nn, p, q, c }) => { const rack = m * nn, bip = p === 0 || q === 0 ? 1 : 0, total = rack + p + q, cost = total * c;
  const where = p && q ? `${plural(p, 'controller', 'controllers')} and ${plural(q, 'sensor', 'sensors')}` : p ? `${plural(p, 'controller', 'controllers')} (and to no sensor)` : `${plural(q, 'sensor', 'sensors')} (and to no controller)`;
  return {
  prompt: `The Circuit Shop's rack has ${m} controllers and ${nn} sensors. Every controller is wired to every sensor by one cable, and there are no other cables. A cable costs ${n(c)} credits. The shop then wires in a spare chip with one cable to each of ${where}. Enter the number of cables the rack had before the spare chip. Then enter 1 if the chips of the whole network, spare included, can be split into two banks with every cable running between the banks, or 0 if they cannot. Then enter the total cost of all the cables in credits (type it without commas).`,
  answer: [rack, bip, cost],
  hints: ['Each of the controllers is wired to every one of the sensors, so count the cables controller by controller.', 'Look for an odd cycle. If the spare chip is wired to a controller and to a sensor, those two are wired to each other too, and the three chips make a cycle of 3. If it is wired to one kind of chip only, it can simply join the other bank.'],
  solution: `Each of the ${m} controllers has ${nn} cables, so the rack had ${m} × ${nn} = ${n(rack)} cables. ${bip ? `The spare chip is wired only to ${p ? 'controllers' : 'sensors'}, so it can join the ${p ? 'sensors' : 'controllers'}’ bank and every cable still runs between the banks: enter 1.` : 'The spare chip is wired to a controller and to a sensor, and those two are wired to each other, so the three chips make a cycle with 3 cables, an odd cycle: no split into two banks exists, so enter 0.'} The spare chip adds ${n(p)} + ${n(q)} = ${n(p + q)} cable${p + q === 1 ? '' : 's'}, so there are ${n(rack)} + ${n(p + q)} = ${n(total)} cables in all, costing ${n(total)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Each of the ${m} controllers is wired to all ${nn} sensors. How many cables did the rack have before the spare chip?`, answer: [rack], explanation: `${m} × ${nn} = ${n(rack)}.` },
   { prompt: 'The spare chip is wired to the chips described above. Can the whole network be split into two banks with every cable between the banks? Enter 1 for yes, 0 for no.', answer: [bip], explanation: bip ? `Yes: the spare chip is wired to ${p ? 'controllers' : 'sensors'} only, so it goes in the same bank as the ${p ? 'sensors' : 'controllers'}.` : 'No: the spare chip, a controller it is wired to and a sensor it is wired to are all wired to one another, an odd cycle of 3 cables.' },
   { prompt: `The rack had ${n(rack)} cables and the spare chip adds ${n(p + q)} more. At ${n(c)} credits a cable, what is the total cost in credits?`, answer: [cost], explanation: `${n(total)} × ${n(c)} = ${n(cost)}.` }
  ] }; }
});

/* q27d (uses q02): a bipartite network with banks of a and b chips (3 to 6, never 3 and 5); the wire counts of bank A are all given and
   those of bank B are given except for one. Asked: the wires E, the lost count, and how many wires could still be added between the banks. */
practice({ id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q02', title: 'Counting wires from both banks',
 brief: 'A log lists how many wires each chip has, one entry has been smudged, and the shop wants the wire total and the room left on the rack.',
 labels: ['wires', 'wires on the smudged chip', 'wires that could still be added'], tolerance: 0.01 },
 [['wires'], ['wires on the smudged chip'], ['wires that could still be added']], {
 draw: R => { for (;;) { const a = R.int(3, 6), b = R.int(3, 6); if (a === 3 && b === 5) continue; const E = allPairs(a + b).filter(([x, y]) => x <= a && y > a && R.next() < 0.55);
  const dA = Array.from({ length: a }, (_, i) => E.filter(e => e[0] === i + 1).length), dB = Array.from({ length: b }, (_, i) => E.filter(e => e[1] === a + 1 + i).length);
  if (dA.every(x => x >= 1) && dB.every(x => x >= 1) && E.length < a * b) return { a, b, dA, dB }; } },
 build: ({ a, b, dA, dB }) => { const E = sum(dA), lost = dB[b - 1], known = dB.slice(0, b - 1), most = a * b; return {
  prompt: `At the Circuit Shop, two banks of chips are wired so that every wire runs from a chip in one bank to a chip in the other, no wire stays inside a bank and no two chips share more than one wire. Bank A has ${a} chips, and their wire counts are ${join(dA.map(String))}. Bank B has ${b} chips: the wire counts of ${b - 1} of them are ${join(known.map(String))}, and the count for the last chip has been smudged out. Enter the total number of wires, then the number of wires on the smudged chip, then how many more wires could still be added between the banks without any chip pair sharing two.`,
  answer: [E, lost, most - E],
  hints: ['Every wire has exactly one end in bank A and one end in bank B. So the wire counts of the chips in bank A add up to the number of wires, and so do the wire counts of the chips in bank B.', 'A chip in A can be joined to every chip in B. The most wires the banks can have between them is the number of A chips times the number of B chips.'],
  solution: `Every wire has one end in bank A, so the total is ${dA.map(n).join(' + ')} = ${n(E)} wires. The wire counts in bank B must add up to the same ${n(E)}, and the known ones add up to ${known.map(n).join(' + ')} = ${n(sum(known))}, so the smudged chip has ${n(E)} − ${n(sum(known))} = ${n(lost)} wire${lost === 1 ? '' : 's'}. With every chip of A joined to every chip of B there would be ${a} × ${b} = ${n(most)} wires, so ${n(most)} − ${n(E)} = ${n(most - E)} more could be added.`,
  guidance: [
   { prompt: `Every wire has one end in bank A. The wire counts of bank A are ${join(dA.map(String))}. How many wires are there in all?`, answer: [E], explanation: `${dA.map(n).join(' + ')} = ${n(E)}.` },
   { prompt: `The wire counts of bank B must add up to the same total. The known counts are ${join(known.map(String))}. How many wires does the smudged chip have?`, answer: [lost], explanation: `${n(E)} − ${n(sum(known))} = ${n(lost)}.` },
   { prompt: `With every chip of A joined to every chip of B there would be ${a} × ${b} wires. How many more wires than the present ${n(E)} could be added?`, answer: [most - E], explanation: `${n(most)} − ${n(E)} = ${n(most - E)}.` }
  ] }; }
});

/* ---- q28 Colouring and the chromatic number [O12.4, KT5.4] ---- */

/* q28b: first group: a ring of s (4 to 20, not 7), a wheel with a ring of s (3 to 15), a complete group of s (3 to 12) or a
   complete bipartite K_{a,b} (2 to 7); second group: a connected network on 7 testers with chromatic number 2, 3 or 4
   (4 only with four testers all hearing one another). */
practice({ id: 'q28b', parent: 'q28', kind: 'setting', title: 'Channels for the wireless testers',
 brief: 'The wireless testers share radio channels, and testers that can hear each other must not share one, so the shop wants the fewest channels each group needs.',
 labels: ['channels for the first group', 'channels for the second group'], tolerance: 0.01 },
 [['channels for the first group'], ['largest group hearing one another'], ['channels for the second group']], {
 draw: R => { const fam = R.int(0, 3); let s = 0, a = 0, b = 0;
  if (fam === 0) do { s = R.int(4, 20); } while (s === 7); else if (fam === 1) s = R.int(3, 15); else if (fam === 2) s = R.int(3, 12); else { a = R.int(2, 7); b = R.int(2, 7); }
  const want = R.pick([2, 3, 3, 4]);
  for (let guard = 0; guard < 400; guard++) {
   const edges = want === 2 ? randomBipartite(R, 7, R.int(1, 3)).edges : sortEdges(allPairs(7).filter(() => R.next() < (want === 3 ? 0.4 : 0.55)));
   const A = adjOf(7, edges); if (!connected(7, A)) continue;
   const k = chromatic(7, A).k, w = maxClique(7, A).length; if (k === want && (k < 4 || w === 4)) return { fam, s, a, b, edges }; }
  return { fam, s, a, b, edges: [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]] }; },
 build: ({ fam, s, a, b, edges }) => { const ka = fam === 0 ? (s % 2 ? 3 : 2) : fam === 1 ? (s % 2 ? 4 : 3) : fam === 2 ? s : 2;
  const A = adjOf(7, edges), { k, c } = chromatic(7, A), cl = maxClique(7, A), cyc = oddCycle(7, A);
  const what = fam === 0 ? `a ring of ${s} testers, each hearing the next and the last hearing the first (the cycle C_${s})`
   : fam === 1 ? `a ring of ${s} testers, each hearing the next and the last hearing the first, plus a mast tester that hears all ${s} of them (a wheel)`
   : fam === 2 ? `${s} testers in which every pair can hear each other (the complete graph K_${s})`
   : `${a} testers on the roof and ${b} on the floor, where every roof tester hears every floor tester and no other pair hears each other (the complete bipartite graph K_{${a},${b}})`;
  const whyA = fam === 0 ? (s % 2 ? `Going round a ring the channels must alternate, and ${s} is odd, so two channels clash where the ring closes; a third channel on one tester fixes it: 3 channels.` : `Going round the ring the channels can alternate, and ${s} is even, so the ring closes without a clash: 2 channels.`)
   : fam === 1 ? (s % 2 ? `The mast tester hears every ring tester, so it needs a channel of its own. The ring of ${s} is odd, so it needs 3 more: 4 channels.` : `The mast tester hears every ring tester, so it needs a channel of its own. The ring of ${s} is even, so 2 more alternate round it: 3 channels.`)
   : fam === 2 ? `Every tester hears every other, so no two can share a channel: ${s} channels.`
   : `Every pair that hear each other is one roof tester and one floor tester, so one channel for the roof testers and one for the floor testers works, and some pair hear each other, so 1 channel is not enough: 2 channels.`;
  const whyB = k === 2 ? 'There is a pair that hears each other, so 1 channel is not enough, and 2 channels work.' : cl.length === k ? `Testers ${join(cl.map(String))} all hear one another, so they need ${k} different channels.` : `The odd cycle ${arrows([...cyc, cyc[0]])} cannot be done in 2 channels.`;
  return {
  prompt: `The Circuit Shop's wireless testers share radio channels, and two testers that can hear each other must use different channels. The first group is ${what}. Enter the fewest channels this group needs. The second group has seven testers, numbered 1 to 7, and these pairs can hear each other: ${join(edges.map(dash))}. Enter the fewest channels this group needs.`,
  answer: [ka, k],
  hints: ['A ring with an even number of testers needs 2 channels and an odd ring needs 3. A tester that hears every tester of a ring needs one more. When every pair hears each other, every tester needs its own channel.', 'For the second group, find a way to give out channels, then show that fewer cannot work: testers who all hear one another need different channels, and an odd cycle needs 3.'],
  solution: `${whyA} For the second group, giving ${classes(7, c, k, 'channel', 'tester', 'to')} keeps every pair that hear each other apart, so ${k} channels are enough. ${whyB} So the second group needs ${k} channels.`,
  guidance: [
   { prompt: 'How many channels does the first group need?', answer: [ka], explanation: whyA },
   { prompt: 'In the second group, what is the largest number of testers who can all hear one another?', answer: [cl.length], explanation: cl.length === 2 ? `Testers ${cl[0]} and ${cl[1]} hear each other, but no three testers all hear one another.` : `Testers ${join(cl.map(String))} all hear one another, and no larger group does.` },
   { prompt: 'Give out channels in the second group using as few as you can. How many channels does it need?', answer: [k], explanation: `Giving ${classes(7, c, k, 'channel', 'tester', 'to')} works with ${k} channels. ${whyB}` }
  ] }; }
});

/* q28c: 7 or 8 solvents, a conflict network whose chromatic number is 3 or 4 and equals its largest clique (so the reason is simple).
   Asked: the largest group that all react with one another, the fewest cabinets, and the total cost. */
practice({ id: 'q28c', parent: 'q28', kind: 'applied', title: 'Cabinets for the solvents',
 brief: 'The cleaning solvents must be locked away, solvents that react cannot share a cabinet, and the stores want the fewest cabinets and their price.',
 labels: ['largest reacting group', 'fewest cabinets', 'total cost (credits)'], tolerance: 0.01 },
 [['largest reacting group'], ['fewest cabinets'], ['total cost (credits)']], {
 draw: R => { const V = R.int(7, 8), want = R.pick([3, 4]), cabinet = R.int(10, 60), lock = R.int(2, 15);
  for (let guard = 0; guard < 400; guard++) { const edges = sortEdges(allPairs(V).filter(() => R.next() < (want === 3 ? 0.35 : 0.5)));
   const A = adjOf(V, edges), k = chromatic(V, A).k, w = maxClique(V, A).length; if (k === want && w === want) return { V, edges, cabinet, lock }; }
  return { V, edges: [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8].slice(0, V === 8 ? 2 : 0)].filter(e => e.length === 2), cabinet, lock }; },
 build: ({ V, edges, cabinet, lock }) => { const A = adjOf(V, edges), { k, c } = chromatic(V, A), cl = maxClique(V, A), cost = k * (cabinet + lock); return {
  prompt: `The Circuit Shop stores ${V} cleaning solvents, numbered 1 to ${V}, in locked cabinets. Two solvents that react with each other must never share a cabinet; solvents that do not react can share freely. The pairs that react are ${join(edges.map(dash))}. A cabinet costs ${n(cabinet)} credits and its lock costs ${n(lock)} credits. Enter the largest number of solvents that all react with one another. Then enter the fewest cabinets that can hold every solvent. Then enter the total cost in credits of those cabinets and locks (type it without commas).`,
  answer: [cl.length, k, cost],
  hints: ['Treat each cabinet as a colour: solvents that react need different cabinets, so the fewest cabinets is the chromatic number. Solvents that all react with one another each need a cabinet of their own.', 'Find a way to share the cabinets, then use the largest group of solvents that all react with one another to show that fewer cabinets cannot work. Each cabinet needs its own lock.'],
  solution: `Solvents ${join(cl.map(String))} all react with one another, so they need ${cl.length} different cabinets, and no larger group does. Putting ${classes(V, c, k, 'cabinet', 'solvent', 'in')} never puts two reacting solvents together, so ${k} cabinets are enough. The fewest is ${k}. The cost is ${k} × (${n(cabinet)} + ${n(lock)}) = ${k} × ${n(cabinet + lock)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: 'Look for solvents that all react with one another. What is the largest such group?', answer: [cl.length], explanation: `Solvents ${join(cl.map(String))} all react with one another, and no larger group does.` },
   { prompt: 'Share the cabinets out so that no two reacting solvents are together. What is the fewest cabinets?', answer: [k], explanation: `Putting ${classes(V, c, k, 'cabinet', 'solvent', 'in')} works, and the group above needs ${cl.length} different cabinets, so ${k} is the fewest.` },
   { prompt: `Each cabinet costs ${n(cabinet)} credits and its lock ${n(lock)} credits. What is the total cost of ${k} cabinets with locks?`, answer: [cost], explanation: `${k} × (${n(cabinet)} + ${n(lock)}) = ${k} × ${n(cabinet + lock)} = ${n(cost)}.` }
  ] }; }
});

/* q28d (uses q04): a board whose parts fall into g groups (3 to 5) of 1 to 4 parts, with a link between two parts exactly when they
   are in different groups (at least one group has 2 or more parts). Links = all pairs − pairs inside groups; χ = g. */
practice({ id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q04', title: 'Boards tested in groups',
 brief: 'A test board links every part to every part of the other groups, and the shop wants its link count and the fewest colours it needs.',
 labels: ['links', 'chromatic number χ'], tolerance: 0.01 },
 [['pairs not linked'], ['links'], ['chromatic number χ']], {
 draw: R => { for (;;) { const g = R.int(3, 5), sizes = Array.from({ length: g }, () => R.int(1, 4)); if (sizes.some(x => x > 1)) return { sizes }; } },
 build: ({ sizes }) => { const g = sizes.length, V = sum(sizes), all = V * (V - 1) / 2, inside = sum(sizes.map(x => x * (x - 1) / 2)), links = all - inside;
  const words = ['first', 'second', 'third', 'fourth', 'fifth']; return {
  prompt: `The Circuit Shop's test board has ${V} parts in ${g} groups, with ${join(sizes.map((x, i) => `${n(x)} part${x === 1 ? '' : 's'} in the ${words[i]} group`))}. Two parts in the same group are never linked, and every part is linked to every part of each other group. Each link is one wire between two parts. Enter the number of links on the board. Then enter the board's chromatic number χ, the fewest colours that can light every part so that linked parts glow different colours.`,
  answer: [links, g],
  hints: ['Count every pair of the parts first: n parts have n(n − 1) ÷ 2 pairs. The links are all the pairs except the ones inside a group, which are never linked.', 'Parts taken one from each group are all linked to one another, so you need at least as many colours as there are groups. Then see whether giving each group a colour of its own works.'],
  solution: `${V} parts make ${V} × ${V - 1} ÷ 2 = ${n(all)} pairs. The pairs inside a group are not linked: ${sizes.map(x => `${x} × ${x - 1} ÷ 2 = ${n(x * (x - 1) / 2)}`).join(', ')}, which is ${n(inside)} in all. So the board has ${n(all)} − ${n(inside)} = ${n(links)} links. Taking one part from each of the ${g} groups gives ${g} parts that are all linked to one another, so ${g} colours are needed. One colour for each group works, since parts in a group are never linked. So χ = ${g}.`,
  guidance: [
   { prompt: `In a group of s parts no pair is linked, and s parts have s(s − 1) ÷ 2 pairs. The group sizes are ${join(sizes.map(String))}. How many pairs of parts are not linked, adding over the groups?`, answer: [inside], explanation: `${sizes.map(x => `${x} × ${x - 1} ÷ 2 = ${n(x * (x - 1) / 2)}`).join(', ')}, which is ${n(inside)} in all.` },
   { prompt: `All ${V} parts have ${n(all)} pairs between them, and ${n(inside)} of them are not linked. How many links are there?`, answer: [links], explanation: `${n(all)} − ${n(inside)} = ${n(links)}.` },
   { prompt: 'Take one part from each group: they are all linked to one another. Giving each group a colour of its own works. What is χ?', answer: [g], explanation: `Taking one part from each of the ${g} groups gives ${g} parts all linked to one another, so ${g} colours are needed, and one colour for each group is enough: χ = ${g}.` }
  ] }; }
});

/* ---- q29 Chapter review: scheduling by colouring [KT5.4] ---- */

/* q29b: a ring of 5 to 9 batches with non-crossing chords and sometimes a hub batch, labels shuffled; faces first, then slots. */
practice({ id: 'q29b', parent: 'q29', kind: 'setting', title: 'The oven schedule',
 brief: 'Batches of boards that need the same technician cannot bake in the same slot, and the shop wants the fewest slots and the shape of the plan.',
 labels: ['faces', 'fewest slots'], tolerance: 0.01 },
 [['batches V', 'clashes E'], ['faces'], ['fewest slots']], {
 draw: R => examDraw(R, 5, 9, 0),
 build: p => { const { V, edges, E, F, k, c, why } = examInfo(p); return {
  prompt: `The Circuit Shop bakes ${V} batches of boards, numbered 1 to ${V}, in oven slots. Two batches that need the same technician cannot bake in the same slot. The clash network has a link for each such pair: ${join(edges.map(dash))}. It is connected and is drawn on the shop-floor plan with no crossing links. Enter the number of faces of that drawing, counting the region outside it. Then enter the fewest oven slots the ${V} batches need.`,
  answer: [F, k],
  hints: ['The drawing is connected and has no crossings, so Euler’s formula V − E + F = 2 gives F = 2 − V + E. Count the batches and the links first.', 'Oven slots are colours: linked batches need different slots, so the fewest slots is the chromatic number. Find a way to fill the slots, then a reason fewer fail (batches that all clash with one another, or an odd cycle).'],
  solution: `The network has V = ${V} batches and E = ${E} links, so Euler’s formula gives F = 2 − ${V} + ${E} = ${n(F)} faces. Putting ${classes(V, c, k, 'slot', 'batch', 'in')} never puts two linked batches together, so ${k} slots are enough. ${why} So the fewest slots is ${k}.`,
  guidance: [
   { prompt: 'Count the batches and the links of the network.', answer: [V, E], explanation: `${V} batches and ${E} links.` },
   { prompt: 'Use Euler’s formula, F = 2 − V + E. How many faces does the drawing have?', answer: [F], explanation: `F = 2 − ${V} + ${E} = ${n(F)}.` },
   { prompt: 'Treat slots as colours. What is the fewest number of slots?', answer: [k], explanation: `Putting ${classes(V, c, k, 'slot', 'batch', 'in')} works. ${why}` }
  ] }; }
});

/* q29c: 6 to 8 batches (ring of 5 to 7 with chords and sometimes a hub); each slot lasts h hours and needs i staff paid c credits an hour. */
practice({ id: 'q29c', parent: 'q29', kind: 'applied', title: 'Paying the invigilators',
 brief: 'Every exam slot needs staff for its whole length, so the shop wants the fewest slots and what the staff will cost.',
 labels: ['fewest slots', 'total hours', 'total cost (credits)'], tolerance: 0.01 },
 [['fewest slots'], ['total hours'], ['total cost (credits)']], {
 draw: R => ({ ...examDraw(R, 5, 7, 1), h: R.int(2, 4), i: R.int(2, 5), pay: R.int(8, 30) }),
 build: p => { const { V, edges, k, c, why } = examInfo(p, 'exam'), { h, i, pay } = p, hours = k * h, cost = hours * i * pay; return {
  prompt: `The Circuit Shop runs ${V} certification exams, numbered 1 to ${V}, and two exams that share a candidate cannot be in the same slot. The pairs that share a candidate are ${join(edges.map(dash))}. Every slot lasts ${n(h)} hours, and during a slot ${n(i)} invigilators must be present, each paid ${n(pay)} credits for every hour. Enter the fewest slots the exams need. Then enter the total hours the slots last. Then enter the total pay in credits for all the invigilators (type it without commas).`,
  answer: [k, hours, cost],
  hints: ['Slots are colours: exams that share a candidate need different slots, so the fewest slots is the chromatic number. Find a way to fill the slots, then a reason fewer fail (exams that all share candidates with one another, or an odd cycle).', 'The total hours is the number of slots times the length of a slot. Each hour needs every invigilator on the payroll, so the pay is the total hours times the number of invigilators times the hourly pay.'],
  solution: `Putting ${classes(V, c, k, 'slot', 'exam', 'in')} never puts two linked exams together, so ${k} slots are enough. ${why} So the fewest slots is ${k}. They last ${k} × ${n(h)} = ${n(hours)} hours. Each hour costs ${n(i)} × ${n(pay)} = ${n(i * pay)} credits, so the pay is ${n(hours)} × ${n(i * pay)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: 'Treat slots as colours. What is the fewest number of slots?', answer: [k], explanation: `Putting ${classes(V, c, k, 'slot', 'exam', 'in')} works. ${why}` },
   { prompt: `There are ${k} slots and each lasts ${n(h)} hours. How many hours do the slots last in all?`, answer: [hours], explanation: `${k} × ${n(h)} = ${n(hours)}.` },
   { prompt: `For each of ${n(hours)} hours, ${n(i)} invigilators are paid ${n(pay)} credits an hour. What is the total pay in credits?`, answer: [cost], explanation: `${n(i)} × ${n(pay)} = ${n(i * pay)} credits an hour, and ${n(hours)} × ${n(i * pay)} = ${n(cost)}.` }
  ] }; }
});

/* q29d (uses q25): a ring of 6 to 9 exams with at least one chord and sometimes a hub; asked the fewest slots, the faces and the
   most links a network of that many exams could have if it can be drawn flat (3V − 6). */
practice({ id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q25', title: 'The big certification week',
 brief: 'Certification week has grown, and the shop wants its slots, the shape of the plan and how many more conflicts a flat plan could ever hold.',
 labels: ['fewest slots', 'faces', 'most links'], tolerance: 0.01 },
 [['fewest slots'], ['exams V', 'links E'], ['faces'], ['most links']], {
 draw: R => examDraw(R, 6, 9, 1),
 build: p => { const { V, edges, E, F, k, c, why } = examInfo(p, 'exam'), most = 3 * V - 6; return {
  prompt: `The Circuit Shop's big certification week has ${V} exams, numbered 1 to ${V}, and two exams that share a candidate cannot be in the same slot. The pairs that share a candidate are ${join(edges.map(dash))}. This conflict network is connected and is drawn on the planning board with no crossing links. Enter the fewest slots the exams need. Then enter the number of faces of the drawing, counting the region outside it. Then enter the most links that any network of ${V} exams could have if it can be drawn with no crossings and no pair of exams is linked twice.`,
  answer: [k, F, most],
  hints: ['Slots are colours, so the fewest slots is the chromatic number. Find a way to fill the slots, then a reason fewer fail (exams that all clash with one another, or an odd cycle). For the faces, use Euler’s formula F = 2 − V + E.', 'The most links a network of V exams can have and still be drawn with no crossings is the planar edge limit from the earlier mission, for V of 3 or more. It depends only on V, not on the links listed here.'],
  solution: `Putting ${classes(V, c, k, 'slot', 'exam', 'in')} never puts two linked exams together, so ${k} slots are enough. ${why} So the fewest slots is ${k}. The network has V = ${V} exams and E = ${E} links, so Euler’s formula gives F = 2 − ${V} + ${E} = ${n(F)} faces. A network of ${V} exams that can be drawn with no crossings has at most 3V − 6 = 3 × ${V} − 6 = ${n(most)} links.`,
  guidance: [
   { prompt: 'Treat slots as colours. What is the fewest number of slots?', answer: [k], explanation: `Putting ${classes(V, c, k, 'slot', 'exam', 'in')} works. ${why}` },
   { prompt: 'How many exams and how many links does the network have?', answer: [V, E], explanation: `${V} exams and ${E} links.` },
   { prompt: 'Use Euler’s formula, F = 2 − V + E. How many faces does the drawing have?', answer: [F], explanation: `F = 2 − ${V} + ${E} = ${n(F)}.` },
   { prompt: `A network of V exams that can be drawn with no crossings has at most 3V − 6 links. What is that for V = ${V}?`, answer: [most], explanation: `3 × ${V} − 6 = ${n(most)}.` }
  ] }; }
});

/* ---- q30 Matchings in bipartite graphs [KT14.2] ---- */

/* q30b: c inspectors and t pump units (4 to 6 each); half the draws leave some pump with no inspector. Asked: the largest matching and the pumps left over. */
practice({ id: 'q30b', parent: 'q30', kind: 'setting', title: 'Inspectors for the pumps',
 brief: 'Each pump unit needs an inspector before it can run, each inspector is qualified for only some units, and the station wants to know how many units can be signed off in one shift.',
 labels: ['most units signed off', 'units left unsigned'], tolerance: 0.01 },
 [['inspectors qualified'], ['most units signed off'], ['units left unsigned']], {
 draw: R => { const short = R.bool(); return drawRota(R, 4, 6, 4, 6, (c, t, adj, M) => (t - M > 0) === short); },
 build: ({ c, t, adj }) => { const { M, got } = bestMatching(c, adj), idle = t - M, tr = transpose(c, t, adj), sf = shortfall(t, tr);
  const S = idle ? sf.S : Array.from({ length: t }, (_, i) => i), NS = idle ? sf.N : [...new Set(tr.flat())].sort((x, y) => x - y);
  const pairs = got.map((x, i) => x >= 0 ? `inspector ${i + 1} → ${LET[x]}` : '').filter(Boolean);
  const pumps = join(S.map(j => LET[j])), who = join(NS.map(i => String(i + 1)));
  return {
  prompt: `The Pumping Station has ${c} inspectors, numbered 1 to ${c}, and ${t} pump units, labelled ${taskList(Array.from({ length: t }, (_, i) => i))}. In one shift an inspector signs off at most one unit, and a unit is signed off by at most one inspector. ${adj.map((ts, i) => `Inspector ${i + 1} is qualified for ${options(ts, '', 'only')}`.replace('for  ', 'for ')).join('. ')}. Enter the largest number of units that can be signed off in the same shift. Then enter how many units are left unsigned.`,
  answer: [M, idle],
  hints: ['Pair inspectors to units one at a time. If someone is stuck, look for a swap chain: move the inspector who holds the unit the stuck one needs to another unit that inspector is qualified for, freeing the first unit.', 'To show no larger set exists, find a group of units that between them have fewer qualified inspectors than there are units in the group: some of those units must stay unsigned.'],
  solution: `The pairing ${join(pairs)} signs off ${M} units, and no two inspectors share a unit. ${idle ? `${grp(S.map(j => LET[j]), 'Unit', 'Units')} ${NS.length ? `can be signed off only by ${grp(NS.map(i => String(i + 1)), 'inspector', 'inspectors')}` : 'cannot be signed off by any inspector'}: ${plural(S.length, 'unit', 'units')} but ${plural(NS.length, 'inspector', 'inspectors')}, so at least ${idle} of those units must stay unsigned. So the most that can be signed off is ${M}, and ${idle === 1 ? '1 unit is' : `${idle} units are`} left unsigned.` : `Every unit is signed off, so no pairing can sign off more than ${M}, and no unit is left unsigned.`}`,
  guidance: [
   { prompt: `${idle ? `Look at ${grp(S.map(j => LET[j]), 'unit', 'units')}.` : `Look at all ${t} units.`} How many different inspectors are qualified for at least one of them?`, answer: [NS.length], explanation: idle ? `${NS.length ? `Only ${grp(NS.map(i => String(i + 1)), 'inspector', 'inspectors')} ${NS.length === 1 ? 'is' : 'are'} qualified for ${S.length === 1 ? 'it' : 'any of them'}` : `No inspector is qualified for ${S.length === 1 ? 'it' : 'any of them'}`}: ${plural(NS.length, 'inspector', 'inspectors')} for ${plural(S.length, 'unit', 'units')}.` : `${plural(NS.length, 'inspector', 'inspectors')} ${NS.length === 1 ? 'is' : 'are'} qualified for at least one unit. The next step finds a pairing that signs off every unit, so no group of units is short of inspectors.` },
   { prompt: 'Build the biggest set of pairs you can, using swap chains when someone is stuck. How many units are signed off?', answer: [M], explanation: `${uc(join(pairs))}: ${M} pairs.${idle ? ' The group above has more units than inspectors, so no pairing can sign off more.' : ''}` },
   { prompt: 'How many units are left unsigned?', answer: [idle], explanation: `${t} − ${M} = ${idle}.` }
  ] }; }
});

/* q30c: c technicians (4 to 6) and t units (5 to 6) each running r thousand litres an hour when staffed. */
practice({ id: 'q30c', parent: 'q30', kind: 'applied', title: 'Running the pump units',
 brief: 'A pump unit runs only when a technician who knows it is on duty, and the station wants the output of the best rota.',
 labels: ['units running', 'output (thousand litres an hour)', 'output lost (thousand litres an hour)'], tolerance: 0.01 },
 [['units running'], ['output (thousand litres an hour)'], ['output lost (thousand litres an hour)']], {
 draw: R => { const short = R.bool(), r = R.int(2, 9); return { ...drawRota(R, 4, 6, 5, 6, (c, t, adj, M) => (t - M > 0) === short), r }; },
 build: ({ c, t, adj, r }) => { const { M, got } = bestMatching(c, adj), idle = t - M, out = M * r, lost = idle * r, tr = transpose(c, t, adj), sf = shortfall(t, tr);
  const pairs = got.map((x, i) => x >= 0 ? `technician ${i + 1} → ${LET[x]}` : '').filter(Boolean);
  return {
  prompt: `The Pumping Station has ${c} technicians, numbered 1 to ${c}, and ${t} pump units, labelled ${taskList(Array.from({ length: t }, (_, i) => i))}. A technician can run at most one unit at a time, and a unit needs exactly one technician to run. ${adj.map((ts, i) => `Technician ${i + 1} is trained on ${options(ts, '', 'only')}`.replace('on  ', 'on ')).join('. ')}. A unit that is running pumps ${n(r)} thousand litres an hour, and a unit with no technician pumps nothing. Enter the largest number of units that can run at once. Then enter the most the station can pump in an hour, in thousand litres. Then enter how many thousand litres an hour less that is than if all ${t} units ran.`,
  answer: [M, out, lost],
  hints: ['Pair technicians to units one at a time. If someone is stuck, look for a swap chain: move the technician who holds the unit the stuck one needs to another unit that technician is trained on, freeing the first unit.', 'The output is the number of running units times the output of one unit. The shortfall is the number of units that cannot run times the same output.'],
  solution: `The pairing ${join(pairs)} runs ${M} units, and no two technicians share a unit.${idle ? ` ${grp(sf.S.map(j => LET[j]), 'Unit', 'Units')} can be run ${sf.N.length ? `only by ${grp(sf.N.map(i => String(i + 1)), 'technician', 'technicians')}` : 'by no technician'}: ${plural(sf.S.length, 'unit', 'units')} for ${plural(sf.N.length, 'technician', 'technicians')}, so at least ${idle} of those units cannot run, and ${M} is the most.` : ` Every unit is running, so ${M} is the most.`} The output is ${M} × ${n(r)} = ${n(out)} thousand litres an hour. With all ${t} units running it would be ${t} × ${n(r)} = ${n(t * r)}, so ${n(t * r)} − ${n(out)} = ${n(lost)} thousand litres an hour is lost.`,
  guidance: [
   { prompt: 'Build the biggest set of pairs you can, using swap chains when someone is stuck. How many units can run at once?', answer: [M], explanation: `${uc(join(pairs))}: ${M} pairs.${idle ? ` ${grp(sf.S.map(j => LET[j]), 'Unit', 'Units')} ${sf.S.length === 1 ? 'has' : 'have'} ${sf.N.length ? `only ${plural(sf.N.length, 'technician', 'technicians')}` : 'no technician'} ${sf.S.length === 1 ? 'for it' : 'between them'}, so no pairing can run more.` : ''}` },
   { prompt: `${M} units run, each pumping ${n(r)} thousand litres an hour. What is the output in thousand litres an hour?`, answer: [out], explanation: `${M} × ${n(r)} = ${n(out)}.` },
   { prompt: `All ${t} units would pump ${n(t * r)} thousand litres an hour. How many thousand litres an hour less is the real output?`, answer: [lost], explanation: `${n(t * r)} − ${n(out)} = ${n(lost)}.` }
  ] }; }
});

/* q30d (uses q27): 6 to 8 workers and 6 to 8 machines, each worker trained on 1 to 3. Asked: the largest matching, the possible
   worker-and-machine pairs (the wires of the network), and how many wires the complete network K_{c,t} has beyond them. */
practice({ id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q27', title: 'The full rota',
 brief: 'The station has grown to a full rota, and the planners want the biggest shift they can staff and how sparse the training table is.',
 labels: ['largest matching', 'wires', 'extra wires in the complete network'], tolerance: 0.01 },
 [['wires'], ['largest matching'], ['extra wires in the complete network']], {
 draw: R => { const short = R.next() < 0.7; return drawRota(R, 6, 8, 6, 8, (c, t, adj, M) => (M < c) === short); },
 build: ({ c, t, adj }) => { const { M, got } = bestMatching(c, adj), idle = c - M, E = sum(adj.map(l => l.length)), sf = shortfall(c, adj), rest = c * t - E;
  const pairs = got.map((x, i) => x >= 0 ? `worker ${i + 1} → ${LET[x]}` : '').filter(Boolean);
  const S = idle ? sf.S : [], NS = idle ? sf.N : [];
  return {
  prompt: `The Pumping Station's full rota has ${c} workers, numbered 1 to ${c}, and ${t} machines, labelled ${taskList(Array.from({ length: t }, (_, i) => i))}. A worker runs at most one machine and a machine needs at most one worker. ${adj.map((ts, i) => `Worker ${i + 1} is trained on ${options(ts, '', 'only')}`.replace('on  ', 'on ')).join('. ')}. Draw a wire from each worker to each machine they are trained on. Enter the largest number of workers who can be given a machine at the same time. Then enter the number of wires. Then enter how many more wires the complete bipartite network between the ${c} workers and the ${t} machines has than this network.`,
  answer: [M, E, rest],
  hints: ['Pair workers to machines one at a time. If someone is stuck, look for a swap chain: move the worker who holds the machine the stuck one needs to another machine that worker is trained on, freeing the first machine. To show no larger set exists, find a group of workers with fewer machines between them than there are workers in the group.', 'Each worker has one wire for each machine they are trained on, so the wires are the sum of those counts. The complete bipartite network K_{m,n} has m × n wires.'],
  solution: `The pairing ${join(pairs)} gives ${M} workers a machine.${idle ? ` ${grp(S.map(i => String(i + 1)), 'Worker', 'Workers')} ${S.length === 1 ? 'is' : 'are'} trained only on ${grp(NS.map(j => LET[j]), 'machine', 'machines')} between them: ${plural(S.length, 'worker', 'workers')} for ${plural(NS.length, 'machine', 'machines')}, so at least ${idle} of them must go without, and ${M} is the most.` : ` Every worker has a machine, so ${M} is the most.`} The workers have ${adj.map(l => l.length).join(' + ')} = ${n(E)} wires between them. The complete network has ${c} × ${t} = ${n(c * t)} wires, so it has ${n(c * t)} − ${n(E)} = ${n(rest)} more.`,
  guidance: [
   { prompt: `Each worker has one wire for each machine they are trained on: ${adj.map(l => l.length).join(', ')}. How many wires are there in all?`, answer: [E], explanation: `${adj.map(l => l.length).join(' + ')} = ${n(E)}.` },
   { prompt: 'Build the biggest set of pairs you can, using swap chains when someone is stuck. How many workers get a machine?', answer: [M], explanation: `${uc(join(pairs))}: ${M} pairs.${idle ? ` The group of ${grp(S.map(i => String(i + 1)), 'worker', 'workers')} has more people than machines, so no pairing can have more.` : ''}` },
   { prompt: `The complete bipartite network has ${c} × ${t} wires. How many more is that than the ${n(E)} wires here?`, answer: [rest], explanation: `${n(c * t)} − ${n(E)} = ${n(rest)}.` }
  ] }; }
});

})();
