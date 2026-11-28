/* Graph theory: networks mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly.
   Every network is in the parameters as `V` (vertices 1 to V) and `E`, a list of edges [a, b] with a < b, sorted;
   the prompts print each edge as "a–b" (an en dash), so an oracle can read the graph straight from the parameters. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* ---- Text ---- */
const edgeText = E => E.map(([a, b]) => `${n(a)}–${n(b)}`).join(', ');
/* "2", "2 and 4", "2, 4 and 6" */
const and = xs => { const s = xs.map(x => typeof x === 'number' ? n(x) : x); return s.length < 2 ? s.join('') : `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`; };
/* "1 new road", "3 new roads" */
/* "depots 1 and 5; depots 2, 3 and 4; and depot 8" */
const semi = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join('; ')}; and ${xs[xs.length - 1]}`;
const count = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
/* "depot 5" or "depots 4 and 6" */
const named = (xs, noun) => `${noun}${xs.length === 1 ? '' : 's'} ${and(xs)}`;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = k => String(k).split('').map(d => SUB[+d]).join('');
/* ---- Graphs ---- */
const sortE = E => E.map(([a, b]) => a < b ? [a, b] : [b, a]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
const nbrs = (V, E) => { const A = Array.from({ length: V + 1 }, () => []); for (const [a, b] of E) { A[a].push(b); A[b].push(a); } A.forEach(l => l.sort((x, y) => x - y)); return A; };
const degs = (V, E) => nbrs(V, E).map(l => l.length);
const has = (E, a, b) => E.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const pairs = V => { const P = []; for (let a = 1; a <= V; a++) for (let b = a + 1; b <= V; b++) P.push([a, b]); return P; };
const shuffle = (R, xs) => { const s = xs.slice(); for (let i = s.length - 1; i > 0; i--) { const j = R.int(0, i), t = s[i]; s[i] = s[j]; s[j] = t; } return s; };
/* m distinct random pairs of 1..V */
const randGraph = (R, V, m) => sortE(shuffle(R, pairs(V)).slice(0, m));
/* A random connected graph: a random spanning tree, then `extra` more random edges. */
const connGraph = (R, V, extra) => {
 const order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), E = [];
 for (let i = 1; i < V; i++) E.push([order[i], order[R.int(0, i - 1)]]);
 const rest = shuffle(R, pairs(V).filter(([a, b]) => !has(E, a, b)));
 return sortE(E.concat(rest.slice(0, extra)));
};
/* Distances from s by rings (breadth first); unreachable vertices get −1. */
const rings = (V, E, s) => { const A = nbrs(V, E), d = Array(V + 1).fill(-1); d[s] = 0; let front = [s];
 while (front.length) { const next = []; for (const x of front) for (const y of A[x]) if (d[y] < 0) { d[y] = d[x] + 1; next.push(y); } front = next; }
 return d; };
const components = (V, E) => { const seen = Array(V + 1).fill(false), out = [];
 for (let s = 1; s <= V; s++) if (!seen[s]) { const d = rings(V, E, s), c = []; for (let v = 1; v <= V; v++) if (d[v] >= 0) { seen[v] = true; c.push(v); } out.push(c); }
 return out; };
const connected = (V, E) => components(V, E).length === 1;
const odds = (V, E) => { const d = degs(V, E), o = []; for (let v = 1; v <= V; v++) if (d[v] % 2) o.push(v); return o; };
const degList = (V, E) => { const d = degs(V, E); return Array.from({ length: V }, (_, i) => `deg(${n(i + 1)}) = ${n(d[i + 1])}`); };
const seqOf = (V, E) => degs(V, E).slice(1).sort((x, y) => y - x);
/* A connected graph on V vertices with exactly k odd-degree vertices (k even), or null: odd vertices are paired up and
   the edge between each pair is added or removed, which changes both their degrees by 1. */
const withOdd = (R, V, extra, k) => { let E = connGraph(R, V, extra);
 for (let guard = 0; guard < 40; guard++) { const o = shuffle(R, odds(V, E)); if (o.length === k) return E; if (o.length < k) return null;
  const [a, b] = o; const F = has(E, a, b) ? E.filter(([x, y]) => !((x === a && y === b) || (x === b && y === a))) : sortE(E.concat([[a, b]]));
  if (connected(V, F)) E = F; }
 return null; };
/* Draw until ok(p) holds (every family below succeeds within a few tries). */
const until = (make, ok) => { for (;;) { const p = make(); if (p && ok(p)) return p; } };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A simple graph on V = 5–8 vertices (the worked example has 4) with V to 2V − 1 edges; the dome k asked about has at
    least two neighbours. */
 q01: {
  canonical: { V: 6, E: [[1, 2], [1, 4], [2, 3], [2, 5], [3, 4], [3, 6], [4, 5], [5, 6]], k: 3 },
  draw: R => until(() => { const V = R.int(5, 8), m = R.int(V, Math.min(2 * V - 1, V * (V - 1) / 2 - 2)); return { V, E: randGraph(R, V, m), k: R.int(1, V) }; },
   p => degs(p.V, p.E)[p.k] >= 2),
  build: ({ V, E, k }) => { const m = E.length, N = nbrs(V, E)[k], at = E.filter(e => e.includes(k)); return {
   prompt: `The survey table lists every tunnel between ${n(V)} domes, numbered 1 to ${n(V)}. Each tunnel joins two different domes, and no two tunnels join the same pair. The tunnels are ${edgeText(E)}. In this graph each dome is a vertex and each tunnel is an edge. Enter the number of edges, then the number of neighbours of dome ${n(k)}.`,
   answer: [m, N.length],
   hints: ['Each pair in the list is one edge, and each edge is listed once, so count the pairs.', 'A neighbour of a dome is the other end of any pair that contains it, whichever side of the dash the dome is written on.'],
   solution: `The list has ${n(m)} pairs, so the graph has ${n(m)} edges. The pairs that contain ${n(k)} are ${and(at.map(([a, b]) => `${n(a)}–${n(b)}`))}, so the neighbours of dome ${n(k)} are domes ${and(N)}: ${n(N.length)} neighbours.`,
   guidance: [
    { prompt: `Count the pairs in the list ${edgeText(E)}. How many edges does the graph have?`, answer: [m], explanation: `There are ${n(m)} pairs, and each pair is one tunnel, so the graph has ${n(m)} edges.` },
    { prompt: `Pick out every pair that contains ${n(k)}, on either side of the dash. How many neighbours does dome ${n(k)} have?`, answer: [N.length], explanation: `The pairs ${and(at.map(([a, b]) => `${n(a)}–${n(b)}`))} contain ${n(k)}. Their other ends are domes ${and(N)}, so dome ${n(k)} has ${n(N.length)} neighbours.` }
   ] }; }
 },
 /* The degrees of a random simple graph on V = 6–8 vertices (the example has 5), every degree at least 1, the last
    vertex's degree (the one asked for) at least 2. d lists the degrees of vertices 1 to V − 1, in order; m is the
    number of edges. */
 q02: {
  canonical: { V: 6, m: 8, d: [4, 3, 2, 3, 1] },
  draw: R => until(() => { const V = R.int(6, 8), E = randGraph(R, V, R.int(V, 2 * V)), D = degs(V, E);
   return D[V] >= 2 && D.slice(1).every(x => x >= 1) ? { V, m: E.length, d: D.slice(1, V) } : null; }, () => true),
  build: ({ V, m, d }) => { const S = d.reduce((s, x) => s + x, 0), T = 2 * m, miss = T - S; return {
   prompt: `The Map Room log covers ${n(V)} domes joined by ${n(m)} tunnels. Each tunnel joins two different domes, and no pair has two tunnels. Domes 1 to ${n(V - 1)} have degrees ${and(d)}, in that order. The reading for dome ${n(V)} is smudged. Enter the sum of the degrees of all ${n(V)} domes, then the degree of dome ${n(V)}.`,
   answer: [T, miss],
   hints: ['Every tunnel has two ends, and each end adds 1 to the degree of the dome it is in.', 'The missing degree is the full sum of the degrees minus the degrees you already know.'],
   solution: `By the handshake rule the degrees add up to 2 × ${n(m)} = ${n(T)}. The known degrees add up to ${d.map(n).join(' + ')} = ${n(S)}. So deg(${n(V)}) = ${n(T)} − ${n(S)} = ${n(miss)}.`,
   guidance: [
    { prompt: `The network has ${n(m)} tunnels, and every tunnel adds 1 to the degree at each of its two ends. What is the sum of all the degrees?`, answer: [T], explanation: `Each tunnel is counted once at each end, so the degrees add up to 2 × ${n(m)} = ${n(T)}.` },
    { prompt: `What do the known degrees ${and(d)} add up to?`, answer: [S], explanation: `${d.map(n).join(' + ')} = ${n(S)}.` },
    { prompt: `The missing degree makes up the difference. What is ${n(T)} − ${n(S)}?`, answer: [miss], explanation: `${n(T)} − ${n(S)} = ${n(miss)}, so dome ${n(V)} has degree ${n(miss)}: ${n(miss)} tunnels meet it.` }
   ] }; }
 },
 /* K_n and C_n for n = 5–40, never the worked example's 7. K_n has at most 780 edges, so no thousands. */
 q03: {
  canonical: { k: 12 },
  draw: R => ({ k: R.except(5, 40, [7]) }),
  build: ({ k }) => { const s = sub(k), D = k - 1, P = k * D, KE = P / 2; return {
   prompt: `Mira has two plans for a new cluster of ${n(k)} domes. Plan A is the complete graph K${s}: a tunnel between every pair of domes. Plan B is the cycle C${s}: the domes stand in a ring, each joined to the next, and the last joined back to the first. Enter the number of edges in plan A, then the degree of each dome in plan A, then the number of edges in plan B.`,
   answer: [KE, D, k],
   hints: ['In a complete graph each dome is joined to every other dome, but never to itself.', 'Adding up all the degrees counts every edge twice, once at each end, so halve that total. In a ring every dome has exactly two neighbours.'],
   solution: `In K${s} each dome is joined to the other ${n(D)}, so each degree is ${n(D)}. The degrees add up to ${n(k)} × ${n(D)} = ${n(P)}, which counts every edge twice, so K${s} has ${n(P)} ÷ 2 = ${n(KE)} edges. In C${s} every dome has degree 2, so the degrees add up to 2 × ${n(k)} = ${n(2 * k)} and the ring has ${n(2 * k)} ÷ 2 = ${n(k)} edges.`,
   guidance: [
    { prompt: `In plan A, how many other domes is each dome joined to? That is its degree.`, answer: [D], explanation: `Each dome is joined to all ${n(k)} domes except itself, so its degree is ${n(k)} − 1 = ${n(D)}.` },
    { prompt: `Add the degrees of all ${n(k)} domes and halve the total, since every edge has two ends. What is ${n(k)} × ${n(D)} ÷ 2?`, answer: [KE], explanation: `${n(k)} × ${n(D)} = ${n(P)}, and half of that is ${n(KE)}: plan A needs ${n(KE)} tunnels.` },
    { prompt: `In plan B every dome has degree 2. How many edges does the ring have?`, answer: [k], explanation: `The degrees add up to 2 × ${n(k)} = ${n(2 * k)}, and half of that is ${n(k)}: one tunnel from each dome to the next one round the ring.` }
   ] }; }
 },
 /* A simple graph on V = 6–8 vertices (the example has 5): the subgraph on vertices 1–4, the complement, and the
    degree of k in the complement. The subgraph has at least 2 edges and k has degree 1 to V − 3 (so its complement degree is at least 2). */
 q04: {
  canonical: { V: 7, E: [[1, 2], [1, 5], [2, 3], [2, 4], [3, 6], [4, 5], [4, 7], [5, 6], [6, 7]], k: 4 },
  draw: R => until(() => { const V = R.int(6, 8), m = R.int(V, V * (V - 1) / 2 - V); return { V, E: randGraph(R, V, m), k: R.int(1, V) }; },
   p => { const d = degs(p.V, p.E)[p.k]; return d >= 1 && p.V - 1 - d >= 2 && p.E.filter(([a, b]) => b <= 4).length >= 2; }),
  build: ({ V, E, k }) => { const m = E.length, inside = E.filter(([a, b]) => b <= 4), KE = V * (V - 1) / 2, cE = KE - m, d = degs(V, E)[k], cd = V - 1 - d; return {
   prompt: `The Map Room graph has ${n(V)} domes, numbered 1 to ${n(V)}, and these ${n(m)} tunnels: ${edgeText(E)}. No tunnel joins a dome to itself, and no pair has two. Enter the number of edges in the subgraph on domes 1, 2, 3 and 4 (it keeps every tunnel between two of those domes), then the number of edges in the complement of the graph, then the degree of dome ${n(k)} in the complement.`,
   answer: [inside.length, cE, cd],
   hints: ['A tunnel belongs to the subgraph only when both of its domes are among 1, 2, 3 and 4.', 'The graph and its complement together make the complete graph on the same domes, with every pair joined exactly once.'],
   solution: `Between domes 1, 2, 3 and 4 the tunnels are ${and(inside.map(([a, b]) => `${n(a)}–${n(b)}`))}, so the subgraph has ${n(inside.length)} edges. K${sub(V)} has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges, so the complement has ${n(KE)} − ${n(m)} = ${n(cE)}. Dome ${n(k)} has degree ${n(d)}, so in the complement its degree is ${n(V - 1)} − ${n(d)} = ${n(cd)}.`,
   guidance: [
    { prompt: `Keep only the tunnels whose two ends are both among domes 1, 2, 3 and 4. How many edges does that subgraph have?`, answer: [inside.length], explanation: `They are ${and(inside.map(([a, b]) => `${n(a)}–${n(b)}`))}: ${n(inside.length)} edges. Every other tunnel has an end outside domes 1 to 4.` },
    { prompt: `The complete graph on ${n(V)} domes has ${n(V)} × ${n(V - 1)} ÷ 2 = ${n(KE)} edges. How many of those pairs are not tunnels yet?`, answer: [cE], explanation: `${n(KE)} − ${n(m)} = ${n(cE)}: those pairs are exactly the edges of the complement.` },
    { prompt: `Dome ${n(k)} can be joined to ${n(V - 1)} other domes, and ${n(d)} of those joins are tunnels already. What is its degree in the complement?`, answer: [cd], explanation: `${n(V - 1)} − ${n(d)} = ${n(cd)}: the complement joins dome ${n(k)} to every dome it is not joined to now.` }
   ] }; }
 },
 /* Two simple graphs A and B on V = 5–7 vertices (the example has 4). Half the draws make B a renaming of A (so
    "isomorphic" is true, as the prompt says the crews checked); a third move one edge so the degree sequence changes;
    the rest add one edge. iso is not a parameter: it is read from the edge counts and degree sequences. */
 q05: {
  canonical: { V: 6, A: [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [4, 6], [5, 6]], B: [[1, 2], [1, 4], [1, 5], [1, 6], [2, 3], [3, 4], [5, 6]] },
  draw: R => until(() => { const V = R.int(5, 7), A = connGraph(R, V, R.int(1, V - 2)), kind = R.int(0, 5);
   if (kind <= 2) { const pi = [0].concat(shuffle(R, Array.from({ length: V }, (_, i) => i + 1))); return { V, A, B: sortE(A.map(([a, b]) => [pi[a], pi[b]])) }; }
   const out = shuffle(R, pairs(V).filter(([a, b]) => !has(A, a, b)));
   if (!out.length) return null;
   if (kind === 5) return { V, A, B: sortE(A.concat([out[0]])) };
   /* Moving one edge must change the degree sequence, so the prompt's promise ("same counts and sequence means a
      renaming exists") is only ever relied on for a true renaming. */
   const drop = R.int(0, A.length - 1), B = sortE(A.filter((_, i) => i !== drop).concat([out[0]]));
   return seqOf(V, A).join() === seqOf(V, B).join() ? null : { V, A, B }; },
   p => edgeText(p.A) !== edgeText(p.B)),
  build: ({ V, A, B }) => { const mA = A.length, mB = B.length, sA = seqOf(V, A), sB = seqOf(V, B), same = mA === mB && sA.join() === sB.join(), iso = same ? 1 : 0;
   const cnt = (s, x) => s.filter(y => y === x).length, vals = Array.from(new Set(sA.concat(sB))).sort((x, y) => y - x);
   const differ = vals.filter(x => cnt(sA, x) !== cnt(sB, x)), k = differ.length ? differ[0] : sA[0], cA = cnt(sA, k), cB = cnt(sB, k); return {
   prompt: `Two crews mapped a cluster of ${n(V)} domes, each numbering the domes 1 to ${n(V)} in its own way. Map A has the tunnels ${edgeText(A)}. Map B has the tunnels ${edgeText(B)}. Matching counts alone do not prove that two networks are the same shape in general, but for these two small maps the crews have checked that if they have the same number of edges and the same degree sequence, a renaming of the domes turns one map into the other. Enter the number of edges in map A, then the number in map B, then 1 if the maps are isomorphic or 0 if they are not.`,
   answer: [mA, mB, iso],
   hints: ['Renaming the domes cannot change how many tunnels there are, or how many tunnels meet each dome.', 'Write each map’s degree sequence from largest to smallest and compare the two lists, not just the edge counts.'],
   solution: `Map A has ${n(mA)} edges and map B has ${n(mB)}. Map A has degree sequence ${sA.map(n).join(', ')}, and map B has ${sB.map(n).join(', ')}. ${same ? 'Every invariant agrees, and the crews have found a renaming, so the maps are isomorphic: 1.' : mA !== mB ? 'The edge counts already differ, so no renaming can turn one map into the other: 0.' : 'The edge counts agree but the degree sequences differ, so no renaming can turn one map into the other: 0.'}`,
   guidance: [
    { prompt: `Count the tunnels on each map. How many edges do map A and map B have?`, answer: [mA, mB], explanation: `Map A lists ${n(mA)} pairs and map B lists ${n(mB)}.` },
    { prompt: `Work out the degree of every dome on each map. How many domes of degree ${n(k)} does each map have?`, answer: [cA, cB], explanation: `Map A has degree sequence ${sA.map(n).join(', ')}, with ${n(cA)} of degree ${n(k)}; map B has ${sB.map(n).join(', ')}, with ${n(cB)} of degree ${n(k)}.` },
    { prompt: `Do the maps agree on the edge count and on the whole degree sequence? Enter 1 if they are isomorphic, 0 if they are not.`, answer: [iso], explanation: same ? 'Both invariants agree, and the crews have confirmed a renaming, so the maps are isomorphic.' : 'An invariant differs, and isomorphic graphs share every invariant, so the maps are not isomorphic.' }
   ] }; }
 },
 /* A simple graph on V = 6–8 vertices (the example has 4); u has at least 2 neighbours and at least 2 in common with v. */
 q06: {
  canonical: { V: 7, E: [[1, 2], [1, 3], [1, 5], [2, 4], [2, 6], [3, 4], [3, 7], [4, 5], [5, 6], [6, 7]], u: 1, v: 6 },
  draw: R => until(() => { const V = R.int(6, 8), u = R.int(1, V); return { V, E: randGraph(R, V, R.int(V + 1, 2 * V)), u, v: R.except(1, V, [u]) }; },
   p => { const A = nbrs(p.V, p.E); return A[p.u].length >= 2 && A[p.u].filter(x => A[p.v].includes(x)).length >= 2; }),
  build: ({ V, E, u, v }) => { const A = nbrs(V, E), Nu = A[u], Nv = A[v], C = Nu.filter(x => Nv.includes(x)), each = Nu.map(w => A[w].length - 1), P = each.reduce((s, x) => s + x, 0); return {
   prompt: `Couriers move between ${n(V)} domes, numbered 1 to ${n(V)}, through these tunnels: ${edgeText(E)}. Enter the number of walks of length 2 from dome ${n(u)} to dome ${n(v)}, then the number of paths of length 2 that start at dome ${n(u)}.`,
   answer: [C.length, P],
   hints: ['A walk of length 2 from one dome to another passes through exactly one dome in between, and that dome must be a neighbour of both.', 'A path of length 2 goes from the start to a neighbour and then on to one of that neighbour’s neighbours, but never back to the start.'],
   solution: `Dome ${n(u)} has neighbours ${and(Nu)}, and dome ${n(v)} has neighbours ${and(Nv)}. The common neighbours are ${and(C)}, so there are ${n(C.length)} walks of length 2 from ${n(u)} to ${n(v)}. For the paths, each neighbour w of dome ${n(u)} gives one path for each neighbour of w other than ${n(u)}: ${and(Nu.map((w, i) => `dome ${n(w)} gives ${n(each[i])}`))}. That makes ${each.map(n).join(' + ')} = ${n(P)} paths.`,
   guidance: [
    { prompt: `List the neighbours of dome ${n(u)} and of dome ${n(v)}. How many domes are on both lists?`, answer: [C.length], explanation: `Dome ${n(u)}: ${and(Nu)}. Dome ${n(v)}: ${and(Nv)}. Both lists contain ${and(C)}, and each of these gives one walk ${n(u)}, w, ${n(v)}.` },
    { prompt: `For each neighbour of dome ${n(u)} (${and(Nu)}), count its neighbours other than dome ${n(u)}, and add the counts. How many paths of length 2 start at dome ${n(u)}?`, answer: [P], explanation: `${each.map(n).join(' + ')} = ${n(P)}. Leaving out dome ${n(u)} itself keeps out walks such as ${n(u)}, ${n(Nu[0])}, ${n(u)}, which visit a dome twice.` }
   ] }; }
 },
 /* A connected graph on V = 7–9 vertices (the example has 6) with V − 1 + 1 to 3 edges; v and w are at distance at
    least 2 from u and at least one is at distance 3 or more. */
 q07: {
  canonical: { V: 8, E: [[1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 8]], u: 1, v: 6, w: 8 },
  draw: R => until(() => { const V = R.int(7, 9), E = connGraph(R, V, R.int(1, 3)), u = R.int(1, V), d = rings(V, E, u), far = [];
   for (let x = 1; x <= V; x++) if (d[x] >= 2) far.push(x);
   if (far.length < 2) return null; const [v, w] = shuffle(R, far); return { V, E, u, v, w }; },
   p => { const d = rings(p.V, p.E, p.u); return Math.max(d[p.v], d[p.w]) >= 3; }),
  build: ({ V, E, u, v, w }) => { const d = rings(V, E, u), top = Math.max(d[v], d[w]), lines = [];
   for (let r = 1; r <= top; r++) { const ring = []; for (let x = 1; x <= V; x++) if (d[x] === r) ring.push(x); lines.push(`ring ${n(r)} is ${named(ring, 'depot')}`); } return {
   prompt: `The Rover Depot map has ${n(V)} depots, numbered 1 to ${n(V)}, joined by these roads: ${edgeText(E)}. Enter the distance from depot ${n(u)} to depot ${n(v)}, then the distance from depot ${n(u)} to depot ${n(w)}.`,
   answer: [d[v], d[w]],
   hints: ['Work outwards from the start: its neighbours are at distance 1, their neighbours not yet reached are at distance 2, and so on.', 'A depot belongs to the first ring it appears in, and the number of that ring is the fewest roads that reach it.'],
   solution: `Start at depot ${n(u)}, ring 0. Then ${lines.join('; ')}. Depot ${n(v)} first appears in ring ${n(d[v])} and depot ${n(w)} in ring ${n(d[w])}, so the distances are ${n(d[v])} and ${n(d[w])}.`,
   guidance: [
    { prompt: `Ring 1 is every neighbour of depot ${n(u)}. Keep adding rings of depots not yet reached. In which ring does depot ${n(v)} first appear?`, answer: [d[v]], explanation: `From depot ${n(u)}: ${lines.slice(0, d[v]).join('; ')}. So the distance to depot ${n(v)} is ${n(d[v])}.` },
    { prompt: `Carry on with the same rings. In which ring does depot ${n(w)} first appear?`, answer: [d[w]], explanation: `From depot ${n(u)}: ${lines.slice(0, d[w]).join('; ')}. So the distance to depot ${n(w)} is ${n(d[w])}: no route reaches it with fewer roads.` }
   ] }; }
 },
 /* V = 8–11 vertices (the example has 7) split at random into c = 2–5 groups, each joined inside by a random tree
    (plus sometimes one extra edge); labels are shuffled so a component is not a run of numbers. */
 q08: {
  canonical: { V: 9, E: [[1, 4], [2, 3], [2, 5], [3, 9], [4, 7], [5, 9], [6, 8]] },
  draw: R => until(() => { const V = R.int(8, 11), c = R.int(2, 5), order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), cuts = shuffle(R, Array.from({ length: V - 1 }, (_, i) => i + 1)).slice(0, c - 1).sort((x, y) => x - y), E = [];
   const bounds = [0].concat(cuts, [V]);
   for (let g = 0; g < c; g++) { const part = order.slice(bounds[g], bounds[g + 1]);
    for (let i = 1; i < part.length; i++) E.push([part[i], part[R.int(0, i - 1)]]);
    if (part.length >= 4 && R.bool()) { const a = part[0], b = part[part.length - 1]; if (!has(E, a, b)) E.push([a, b]); } }
   return { V, E: sortE(E) }; }, p => p.E.length >= 4 && components(p.V, p.E).length >= 2),
  build: ({ V, E }) => { const C = components(V, E), c = C.length, first = C[0].length; return {
   prompt: `After the storm the depot map shows ${n(V)} depots, numbered 1 to ${n(V)}, and only these roads still open: ${edgeText(E)}. Enter the number of components of the road graph, then the fewest new roads that would make it connected.`,
   answer: [c, c - 1],
   hints: ['Start at a depot and collect everything it can reach by open roads; that whole piece is one component. A depot with no open road is a component by itself.', 'Each new road can join at most two pieces into one.'],
   solution: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(c)} in all. Each new road joins at most two pieces into one, so turning ${n(c)} pieces into one takes ${n(c)} − 1 = ${count(c - 1, 'new road', 'new roads')}.`,
   guidance: [
    { prompt: `Start at depot 1 and collect every depot it can reach by open roads. How many depots are in that component?`, answer: [first], explanation: first === 1 ? 'Depot 1 has no open road, so it is a component by itself, with 1 depot in it.' : `The component of depot 1 is ${named(C[0], 'depot')}: ${n(first)} depots.` },
    { prompt: `Start again from a depot not reached yet, and repeat until every depot is used. How many components are there?`, answer: [c], explanation: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(c)} pieces.` },
    { prompt: `Each new road can join two pieces into one. How many new roads does it take to join ${n(c)} pieces into one?`, answer: [c - 1], explanation: `Every new road lowers the number of pieces by at most 1, so going from ${n(c)} to 1 takes ${count(c - 1, 'road', 'roads')}, for example one from each component to the next.` }
   ] }; }
 },
 /* A connected graph on V = 6–9 vertices with 0 (half the draws), 2 or 4 odd-degree vertices. */
 q09: {
  canonical: { V: 7, E: [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5], [4, 6], [5, 7], [6, 7]] },
  draw: R => until(() => { const V = R.int(6, 9), k = R.pick([0, 0, 0, 2, 4, 4]), E = withOdd(R, V, R.int(2, V), k); return E && { V, E }; }, p => p.E.length >= p.V + 1),
  build: ({ V, E }) => { const o = odds(V, E), ec = o.length ? 0 : 1, d1 = degs(V, E)[1]; return {
   prompt: `The road sweeper starts at the garage in depot 1. The depot map has ${n(V)} depots joined by these roads: ${edgeText(E)}. Every depot can be reached from every other. Enter the degree of depot 1, then the number of depots of odd degree, then 1 if there is an Euler circuit or 0 if there is not.`,
   answer: [d1, o.length, ec],
   hints: ['Each time the sweeper passes through a depot it uses one road in and one road out, so the roads at every depot are used up in pairs.', 'An Euler circuit needs every depot to have even degree; one odd depot rules it out.'],
   solution: `The degrees are ${degList(V, E).join(', ')}. ${ec ? 'Every degree is even, so no depot is odd. The graph is connected and every degree is even, so an Euler circuit exists: 1.' : `The odd ones are ${named(o, 'depot')}: ${n(o.length)} depots of odd degree. A circuit uses the roads at each depot in pairs, so an odd depot rules out an Euler circuit: 0.`}`,
   guidance: [
    { prompt: `Count the roads that meet depot 1, the garage. What is its degree?`, answer: [d1], explanation: `The roads ${and(E.filter(e => e.includes(1)).map(([a, b]) => `${n(a)}–${n(b)}`))} meet depot 1, so deg(1) = ${n(d1)}.` },
    { prompt: `Work out the degree of every depot. How many depots have odd degree?`, answer: [o.length], explanation: `The degrees are ${degList(V, E).join(', ')}. ${o.length ? `The odd ones are ${named(o, 'depot')}.` : 'None of them is odd.'}` },
    { prompt: `Enter 1 if every depot has even degree, so that an Euler circuit exists, or 0 if not.`, answer: [ec], explanation: ec ? 'The graph is connected and every degree is even, so the sweeper can use every road once and finish back at the garage.' : 'An odd depot cannot have its roads used in pairs, so no circuit can use every road exactly once.' }
   ] }; }
 },
 /* A connected graph on V = 6–9 vertices with 2 (half the draws), 4 or 0 odd-degree vertices. With 0 there is an Euler
    circuit but no Euler trail between different depots, as the prompt defines it. */
 q10: {
  canonical: { V: 7, E: [[1, 2], [1, 4], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 6], [5, 7], [6, 7]] },
  draw: R => until(() => { const V = R.int(6, 9), k = R.pick([2, 2, 2, 4, 4, 0]), E = withOdd(R, V, R.int(2, V), k); return E && { V, E }; }, p => p.E.length >= p.V + 1),
  build: ({ V, E }) => { const o = odds(V, E), et = o.length === 2 ? 1 : 0, start = et ? o[0] : 0; return {
   prompt: `The road inspector must drive every depot road exactly once, starting and finishing at different depots, so the route must be an Euler trail. The map has ${n(V)} depots joined by these roads: ${edgeText(E)}. Every depot can be reached from every other. Enter 1 if an Euler trail exists or 0 if not. Then enter the smaller label of the two depots where it could start, or 0 if there is no Euler trail.`,
   answer: [et, start],
   hints: ['Only the first and last depots of a trail can have odd degree; every depot in between uses its roads in pairs, one in and one out.', 'An Euler trail needs exactly two odd depots, and it starts at one of them and finishes at the other.'],
   solution: `The degrees are ${degList(V, E).join(', ')}. ${et ? `Exactly two depots, ${n(o[0])} and ${n(o[1])}, have odd degree, so an Euler trail exists: 1. It must start at one of them and finish at the other, and the smaller label is ${n(o[0])}.` : o.length ? `${n(o.length)} depots have odd degree (${and(o)}), but only the two ends of a trail can be odd, so there is no Euler trail: 0, and 0 for the start.` : 'Every degree is even, so the roads have an Euler circuit but no Euler trail between different depots: 0, and 0 for the start.'}`,
   guidance: [
    { prompt: `Work out the degree of every depot. How many depots have odd degree?`, answer: [o.length], explanation: `The degrees are ${degList(V, E).join(', ')}. ${o.length ? `The odd ones are ${named(o, 'depot')}.` : 'None of them is odd.'}` },
    { prompt: `Enter 1 if exactly two depots have odd degree, so that an Euler trail exists, or 0 if not.`, answer: [et], explanation: et ? 'Exactly two depots are odd, and the graph is connected, so an Euler trail exists.' : o.length ? 'More than two depots are odd, and only the two ends of a trail can be odd.' : 'With every degree even, a route using every road once always comes back to its start, so it is a circuit, not a trail between different depots.' },
    { prompt: `Enter the smaller label of the two odd depots if there are exactly two, or 0 if there is no Euler trail.`, answer: [start], explanation: et ? `The trail runs from depot ${n(o[0])} to depot ${n(o[1])} or back the other way, so the smaller start label is ${n(o[0])}.` : 'There is no Euler trail, so the answer is 0.' }
   ] }; }
 },
});
})();
