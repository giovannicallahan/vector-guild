/* Graph theory: networks mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Networks are lists of edges [u, v] or weighted edges [u, v, w], u < v, sorted; the prompt prints them as "1–2 (7)". */
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const sortEdges = list => list.map(e => e[0] < e[1] ? e.slice() : [e[1], e[0], ...e.slice(2)]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
/* A connected network on vertices 1..V with E edges: a random tree, then random extra edges. */
const connected = (R, V, E) => {
 const perm = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), have = new Set(), out = [];
 const add = (u, v) => { const k = Math.min(u, v) + ',' + Math.max(u, v); if (u === v || have.has(k)) return false; have.add(k); out.push([u, v]); return true; };
 for (let i = 1; i < V; i++) add(perm[i], perm[R.int(0, i - 1)]);
 while (out.length < E) add(R.int(1, V), R.int(1, V));
 return sortEdges(out);
};
const plain = list => list.map(([u, v]) => `${n(u)}–${n(v)}`).join(', ');
const listed = list => list.map(([u, v, w]) => `${n(u)}–${n(v)} (${n(w)})`).join(', ');
const sum = list => list.reduce((s, x) => s + x, 0);
/* Kruskal: edges by weight (ties by label); each is added or skipped. Stops once V − 1 edges are in. */
const kruskal = (V, edges) => {
 const root = Array.from({ length: V + 1 }, (_, i) => i), find = x => root[x] === x ? x : (root[x] = find(root[x]));
 const order = edges.slice().sort((x, y) => x[2] - y[2] || x[0] - y[0] || x[1] - y[1]), steps = [];
 let added = 0;
 for (const e of order) { if (added === V - 1) break; const a = find(e[0]), b = find(e[1]); if (a === b) steps.push({ e, add: false }); else { root[a] = b; added++; steps.push({ e, add: true }); } }
 const tree = steps.filter(s => s.add).map(s => s.e), skipped = steps.filter(s => !s.add).map(s => s.e);
 return { steps, tree, total: sum(tree.map(e => e[2])), last: tree[tree.length - 1][2], firstSkip: skipped.length ? skipped[0][2] : null };
};
const kruskalText = k => k.steps.map(({ e, add }) => `${n(e[0])}–${n(e[1])} (${n(e[2])}) ${add ? 'added' : `skipped, because ${n(e[0])} and ${n(e[1])} are already joined`}`).join('; ');
/* Dijkstra from vertex s: the order in which vertices become permanent, with their distances (ties by label). */
const dijkstra = (V, edges, s) => {
 const dist = Array(V + 1).fill(Infinity), done = Array(V + 1).fill(false), order = [];
 dist[s] = 0;
 for (;;) {
  let x = -1; for (let v = 1; v <= V; v++) if (!done[v] && dist[v] < Infinity && (x < 0 || dist[v] < dist[x])) x = v;
  if (x < 0) break; done[x] = true; order.push([x, dist[x]]);
  for (const [u, v, w] of edges) { const y = u === x ? v : v === x ? u : 0; if (y && !done[y] && dist[x] + w < dist[y]) dist[y] = dist[x] + w; }
 }
 return { dist, order };
};
const direct = (edges, a, b) => { const e = edges.find(([u, v]) => (u === a && v === b) || (u === b && v === a)); return e ? e[2] : null; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
/* q20: every tour from station 1 with its reverse merged (the second station is smaller than the last). */
const tours = k => { const out = [], rest = Array.from({ length: k - 1 }, (_, i) => i + 2);
 const go = (path, left) => { if (!left.length) { if (path[0] < path[path.length - 1]) out.push(path); return; } left.forEach((v, i) => go([...path, v], left.filter((_, j) => j !== i))); };
 go([], rest); return out.map(p => [1, ...p, 1]); };
const tourWeight = (edges, t) => { let s = 0; for (let i = 0; i + 1 < t.length; i++) s += direct(edges, t[i], t[i + 1]); return s; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* An m by n grid of blocks, both odd, so each side of the grid has an even number of odd corners and the
    repeats pair them up along the sides: m + n − 2 roads, (m − 1)a + (n − 1)b metres. Neither road length is more than twice
    the other, so these fewest repeats are also the shortest (checked by a matching search over every grid); with very unequal
    lengths, more repeats across the middle can be shorter. Never the worked example (3 by 5, 100 and 80). */
 q11: {
  canonical: { m: 5, k: 3, a: 200, b: 150 },
  draw: R => { let p; do { p = { m: R.pick([3, 5, 7]), k: R.pick([3, 5, 7]), a: 10 * R.int(8, 24), b: 10 * R.int(8, 24) }; } while (Math.max(p.a, p.b) > 2 * Math.min(p.a, p.b) || (p.m === 3 && p.k === 5 && p.a === 100 && p.b === 80)); return p; },
  build: ({ m, k, a, b }) => { const roadsN = (c, kind) => `${n(c)} ${kind} road${c === 1 ? '' : 's'}`, corners = (m + 1) * (k + 1), odd = 2 * (m - 1) + 2 * (k - 1), roads = odd / 2, extra = (m - 1) * a + (k - 1) * b; return {
   prompt: `The Rover Depot’s new district is a grid of streets ${n(m)} blocks wide (west to east) and ${n(k)} blocks deep (south to north), so it has ${n(corners)} street corners. A road is one block-long stretch of street between neighbouring corners. Every west–east road is ${n(a)} metres long and every south–north road is ${n(b)} metres long. A sweeper must drive along every road at least once and finish at the corner where it started. Enter the fewest roads it must drive twice, then the least extra distance that driving roads twice adds, in metres (type it without commas).`,
   answer: [roads, extra],
   hints: ['Corners inside the grid have degree 4 and the four outer corners have degree 2. The other corners along the edge of the grid are the odd ones.', 'Each repeated road fixes at most two odd corners, so you need at least half as many repeats as odd corners. Here the odd corners pair up with their neighbours along each side of the grid.'],
   solution: `The corners along the edge of the grid, apart from the four outer corners, have degree 3: ${n(m - 1)} on the south side, ${n(m - 1)} on the north side and ${n(k - 1)} on each of the west and east sides, ${n(odd)} odd corners in all. A repeated road changes the degree of its two ends by 1, so at least ${n(odd)} ÷ 2 = ${n(roads)} repeats are needed. ${n(roads)} is enough: on the south and north sides the ${n(m - 1)} odd corners pair up with their neighbours, using ${roadsN((m - 1) / 2, 'west–east')} on each side, and on the west and east sides they use ${roadsN((k - 1) / 2, 'south–north')} on each side. That is ${n(m - 1)} west–east roads and ${n(k - 1)} south–north roads, ${n(roads)} in all, and the extra distance is ${n(m - 1)} × ${n(a)} + ${n(k - 1)} × ${n(b)} = ${n(extra)} metres.`,
   guidance: [
    { prompt: `Corners inside the grid have degree 4 and the four outer corners have degree 2. The other corners along the edge have degree 3. How many corners have odd degree?`, answer: [odd], explanation: `There are ${n(m - 1)} on the south side, ${n(m - 1)} on the north side and ${n(k - 1)} on each of the west and east sides: ${n(m - 1)} + ${n(m - 1)} + ${n(k - 1)} + ${n(k - 1)} = ${n(odd)}.` },
    { prompt: `A repeated road changes the degree at both of its ends by 1. What is the fewest repeated roads that can make all ${n(odd)} odd corners even?`, answer: [roads], explanation: `Each repeat fixes at most two odd corners, so at least ${n(odd)} ÷ 2 = ${n(roads)} are needed. Pairing each odd corner with its neighbour along the same side reaches that number.` },
    { prompt: `The repeats are ${n(m - 1)} west–east roads of ${n(a)} metres and ${n(k - 1)} south–north roads of ${n(b)} metres. What extra distance do they add, in metres?`, answer: [extra], explanation: `${n(m - 1)} × ${n(a)} = ${n((m - 1) * a)} and ${n(k - 1)} × ${n(b)} = ${n((k - 1) * b)}, so the extra distance is ${n(extra)} metres.` }
   ] }; }
 },
 /* A tree of v domes has v − 1 cables; a tree of e cables has e + 1 domes. Not the worked example (9 domes, 13 cables). */
 q12: {
  canonical: { v: 14, e: 22 },
  draw: R => { let p; do { p = { v: R.int(6, 60), e: R.int(5, 80) }; } while ((p.v === 9 && p.e === 13) || p.v === p.e + 1); return p; },
  build: ({ v, e }) => ({
   prompt: `The Cable Yard joins ${n(v)} domes with cables so that every dome can reach every other one and the cables form no circuit: the network is a tree. Enter how many cables it uses. A second plan, also a tree, uses ${n(e)} cables. Enter how many domes it links.`,
   answer: [v - 1, e + 1],
   hints: ['Build a tree one dome at a time: start with a single dome, and each new dome arrives with exactly one new cable.', 'So a tree always has one cable fewer than it has domes, and one dome more than it has cables.'],
   solution: `Start with one dome and add the others one at a time, each with one cable to a dome already joined. ${n(v)} domes need ${n(v)} − 1 = ${n(v - 1)} cables. The other way round, a tree with ${n(e)} cables has ${n(e)} + 1 = ${n(e + 1)} domes.`,
   guidance: [
    { prompt: `Start with one dome; each of the others arrives with exactly one cable. How many cables does the tree of ${n(v)} domes use?`, answer: [v - 1], explanation: `After the first dome, ${n(v - 1)} more domes arrive, each with one cable, so the tree has ${n(v - 1)} cables.` },
    { prompt: `A tree has one dome more than it has cables. How many domes does the tree with ${n(e)} cables link?`, answer: [e + 1], explanation: `${n(e)} + 1 = ${n(e + 1)} domes.` }
   ] })
 },
 /* Forest: v domes in c trees, v − c edges. Tree with d2, d3, d4 domes of degree 2, 3, 4 and every other dome a leaf:
    leaves L = 2 + d3 + 2 × d4 (the handshake rule). Not the worked example (20 domes in 3 trees; 4 of degree 3, 1 of degree 4). */
 q13: {
  canonical: { v: 30, c: 4, d2: 3, d3: 5, d4: 2 },
  draw: R => { let p; do { p = { v: R.int(12, 40), c: R.int(2, 6), d2: R.int(0, 4), d3: R.int(1, 6), d4: R.int(1, 4) }; } while (p.v === 20 && p.c === 3); return p; },
  build: ({ v, c, d2, d3, d4 }) => { const L = 2 + d3 + 2 * d4, high = 2 * d2 + 3 * d3 + 4 * d4, all = L + d2 + d3 + d4; return {
   prompt: `The Cable Yard’s old network is a forest: ${n(v)} domes split into ${n(c)} separate trees. Enter how many cables it has. The new network is one tree. In it, the number of domes of degree 2 is ${n(d2)}, of degree 3 is ${n(d3)} and of degree 4 is ${n(d4)}, and every other dome is a leaf. Enter the number of leaves.`,
   answer: [v - c, L],
   hints: ['Each tree in the forest has one cable fewer than its domes, so the whole forest has one cable fewer than its domes for every tree in it.', 'Call the number of leaves L. Count the domes and the cables of the new tree in terms of L, then use the handshake rule: the degrees add up to twice the number of cables.'],
   solution: `Each of the ${n(c)} trees has one cable fewer than its domes, so the forest has ${n(v)} − ${n(c)} = ${n(v - c)} cables. In the new tree, call the number of leaves L. It has L + ${n(d2 + d3 + d4)} domes and so L + ${n(d2 + d3 + d4 - 1)} cables. The degrees add up to L + ${n(high)}, and by the handshake rule that is twice the cables, 2L + ${n(2 * (d2 + d3 + d4 - 1))}. So L = ${n(high)} − ${n(2 * (d2 + d3 + d4 - 1))} = ${n(L)} leaves, and the tree has ${n(all)} domes.`,
   guidance: [
    { prompt: `Each of the ${n(c)} trees has one cable fewer than its domes. How many cables does the forest of ${n(v)} domes have?`, answer: [v - c], explanation: `Adding up over the trees, the cables are the domes minus one for each tree: ${n(v)} − ${n(c)} = ${n(v - c)}.` },
    { prompt: `In the new tree, what do the degrees of the domes that are not leaves add up to?`, answer: [high], explanation: `2 × ${n(d2)} + 3 × ${n(d3)} + 4 × ${n(d4)} = ${n(high)}.` },
    { prompt: `With L leaves the tree has L + ${n(d2 + d3 + d4)} domes and L + ${n(d2 + d3 + d4 - 1)} cables, and the degrees add up to L + ${n(high)}. The handshake rule says L + ${n(high)} = 2 × (L + ${n(d2 + d3 + d4 - 1)}). What is L?`, answer: [L], explanation: `L + ${n(high)} = 2L + ${n(2 * (d2 + d3 + d4 - 1))}, so L = ${n(high)} − ${n(2 * (d2 + d3 + d4 - 1))} = ${n(L)}.` }
   ] }; }
 },
 /* A connected network listed edge by edge: a spanning tree keeps V − 1 edges and leaves out E − V + 1. */
 q14: {
  canonical: { V: 7, edges: [[1, 2], [1, 4], [2, 3], [2, 5], [3, 6], [4, 5], [4, 7], [5, 6], [5, 7], [6, 7]] },
  draw: R => { const V = R.int(6, 9); return { V, edges: connected(R, V, V + R.int(2, 6)) }; },
  build: ({ V, edges }) => { const E = edges.length; return {
   prompt: `The Cable Yard map shows domes 1 to ${n(V)} and these tunnels: ${plain(edges)}. Every dome can reach every other one through the tunnels. The crew will lay cable along a spanning tree of the tunnels. Enter how many tunnels the spanning tree uses, then how many tunnels it leaves without cable.`,
   answer: [V - 1, E - V + 1],
   hints: ['A spanning tree reaches every dome and is a tree, so it has one tunnel fewer than there are domes.', 'Count the tunnels in the list. The ones the spanning tree does not use are all the rest.'],
   solution: `The network has ${n(V)} domes and ${n(E)} tunnels. A spanning tree reaches all ${n(V)} domes and is a tree, so it uses ${n(V)} − 1 = ${n(V - 1)} tunnels. The other ${n(E)} − ${n(V - 1)} = ${n(E - V + 1)} tunnels are left without cable: each of them would close a circuit.`,
   guidance: [
    { prompt: `Count the domes and the tunnels in the list. How many of each are there?`, answer: [V, E], explanation: `The domes are numbered 1 to ${n(V)}, and the list has ${n(E)} pairs.` },
    { prompt: `A spanning tree is a tree that reaches all ${n(V)} domes. How many tunnels does it use?`, answer: [V - 1], explanation: `A tree has one edge fewer than its vertices: ${n(V)} − 1 = ${n(V - 1)}.` },
    { prompt: `How many of the ${n(E)} tunnels are left without cable?`, answer: [E - V + 1], explanation: `${n(E)} − ${n(V - 1)} = ${n(E - V + 1)}. Whichever spanning tree is chosen, this number is the same.` }
   ] }; }
 },
 /* A ring of r domes has r spanning trees. Two hubs joined by three routes of a, b, c cables (each at least 2) have
    ab + bc + ca: leave out two cables from two different routes. Not the worked example (ring of 6; routes 2, 3, 4). */
 q15: {
  canonical: { r: 8, a: 3, b: 2, c: 5 },
  draw: R => { let p; do { p = { r: R.int(4, 30), a: R.int(2, 6), b: R.int(2, 6), c: R.int(2, 6) }; } while (p.r === 6 && [p.a, p.b, p.c].sort().join() === '2,3,4'); return p; },
  build: ({ r, a, b, c }) => { const V = a + b + c - 1, E = a + b + c, T = a * b + b * c + c * a; return {
   prompt: `The east ring is ${n(r)} domes joined in a single loop by ${n(r)} cables. Enter how many different spanning trees it has. In the west, two hub domes are joined by three separate routes that meet only at the hubs: one of ${n(a)} cables, one of ${n(b)} cables and one of ${n(c)} cables, with a small dome between each pair of cables in a route. Enter how many different spanning trees this network has.`,
   answer: [r, T],
   hints: ['A spanning tree keeps one cable fewer than the domes, so count how many cables it must leave out, and which choices of those cables leave every dome joined.', 'In the west, the two cables left out must come from two different routes: two from the same route cut off the domes between them.'],
   solution: `The ring has ${n(r)} domes and ${n(r)} cables, so a spanning tree leaves out exactly one cable, and any one of the ${n(r)} will do: ${n(r)} spanning trees. The west network has ${n(V)} domes and ${n(E)} cables, so a spanning tree leaves out ${n(E)} − ${n(V - 1)} = 2 cables. They must come from two different routes, since two from the same route would cut off the domes between them, and one cable from each of two routes always leaves every dome joined. The choices are ${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(a * b)} + ${n(b * c)} + ${n(c * a)} = ${n(T)} spanning trees.`,
   guidance: [
    { prompt: `The ring has ${n(r)} domes and ${n(r)} cables. How many spanning trees does it have?`, answer: [r], explanation: `A spanning tree keeps ${n(r - 1)} cables, so it leaves out exactly one. Leaving out any one of the ${n(r)} cables gives a chain through every dome, so there are ${n(r)}.` },
    { prompt: `The west network has ${n(V)} domes and ${n(E)} cables. How many cables does a spanning tree leave out?`, answer: [2], explanation: `A spanning tree keeps ${n(V)} − 1 = ${n(V - 1)} cables, so it leaves out ${n(E)} − ${n(V - 1)} = 2.` },
    { prompt: `The two cables must come from different routes. How many ways are there to choose them?`, answer: [T], explanation: `Routes of ${n(a)} and ${n(b)}: ${n(a * b)} ways; ${n(b)} and ${n(c)}: ${n(b * c)}; ${n(c)} and ${n(a)}: ${n(c * a)}. In all ${n(T)}.` }
   ] }; }
 },
 /* Kruskal on 5–7 domes with distinct lengths 1–20; some cable is skipped before the last one is added. */
 q16: {
  canonical: { V: 6, edges: [[1, 2, 9], [1, 3, 4], [1, 4, 14], [2, 3, 7], [2, 5, 3], [3, 4, 11], [3, 5, 8], [4, 6, 6], [5, 6, 12]] },
  draw: R => { for (;;) { const V = R.int(5, 7), E = V + R.int(3, 4), ws = shuffle(R, Array.from({ length: 20 }, (_, i) => i + 1));
   const edges = connected(R, V, E).map((e, i) => [e[0], e[1], ws[i]]), k = kruskal(V, edges);
   if (k.firstSkip !== null && k.firstSkip < k.last) return { V, edges }; } },
  build: ({ V, edges }) => { const k = kruskal(V, edges); return {
   prompt: `The Cable Yard can lay cable along these tunnels between domes 1 to ${n(V)}; each tunnel’s cable length in hundreds of metres is in brackets: ${listed(edges)}. The crew wants every dome joined using as little cable as possible. Use Kruskal’s algorithm. Enter the total length of the minimum spanning tree, then the length of the last cable the algorithm adds (both in hundreds of metres).`,
   answer: [k.total, k.last],
   hints: ['Sort the tunnels from shortest to longest. Take each in turn, and skip it only if its two domes are already joined by cables you have taken.', `Stop as soon as you have taken one cable fewer than the number of domes.`],
   solution: `Kruskal’s algorithm, shortest first: ${kruskalText(k)}. That is ${n(V - 1)} cables, enough for ${n(V)} domes, so it stops. The total is ${k.tree.map(e => n(e[2])).join(' + ')} = ${n(k.total)} hundred metres, and the last cable added has length ${n(k.last)}.`,
   guidance: [
    { prompt: `How many cables does a spanning tree of ${n(V)} domes have?`, answer: [V - 1], explanation: `One fewer than the domes: ${n(V - 1)}.` },
    { prompt: `Go through the tunnels from shortest to longest. What is the length of the first one you must skip because it would close a circuit?`, answer: [k.firstSkip], explanation: `${kruskalText({ steps: k.steps.slice(0, k.steps.findIndex(s => !s.add) + 1) })}.` },
    { prompt: `Carry on until ${n(V - 1)} cables are in. What is their total length, and what is the length of the last cable added?`, answer: [k.total, k.last], explanation: `The cables taken are ${k.tree.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}, which add up to ${n(k.total)}. The last one added is ${n(k.tree[k.tree.length - 1][0])}–${n(k.tree[k.tree.length - 1][1])}, of length ${n(k.last)}.` }
   ] }; }
 },
 /* Two hubs (1 and 2) and three routes of a, b, c cables (2–4 each); route lengths are distinct numbers 1–20.
    Domes along the routes are numbered 3 onwards. The minimum spanning tree leaves out the longest cable of each of
    the two routes whose longest cables are longest. */
 q17: {
  canonical: { w: [[6, 13, 2], [9, 4], [11, 5, 7, 16]] },
  /* Never the worked example (routes 3–8, 5–1, 6–4). */
  draw: R => { for (;;) { const lens = [R.int(2, 4), R.int(2, 4), R.int(2, 4)], ws = shuffle(R, Array.from({ length: 20 }, (_, i) => i + 1)); let at = 0;
   const w = lens.map(L => ws.slice(at, at += L)); if (JSON.stringify(w) !== '[[3,8],[5,1],[6,4]]') return { w }; } },
  build: ({ w }) => {
   let next = 3; const routes = w.map(ws => { const stops = [1]; for (let i = 1; i < ws.length; i++) stops.push(next++); stops.push(2); return stops.map((s, i) => i ? [stops[i - 1], s, ws[i - 1]] : null).slice(1); });
   const edges = sortEdges(routes.flat()), V = next - 1, [a, b, c] = w.map(x => x.length), T = a * b + b * c + c * a, k = kruskal(V, edges);
   const tops = w.map(x => Math.max(...x)).sort((x, y) => y - x), all = sum(w.flat()), names = ['first', 'second', 'third'];
   const routeText = routes.map((r, i) => `the ${names[i]} route ${r.map(([u, v, len]) => `${n(u)}–${n(v)} (${n(len)})`).join(', ')}`).join('; ');
   return {
    prompt: `The cable plan joins hub domes 1 and 2 by three routes that meet only at the hubs, with cable lengths in hundreds of metres in brackets: ${routeText}. Enter how many cables any spanning tree of this network has, then how many different spanning trees it has, then the total length of the minimum spanning tree (in hundreds of metres).`,
    answer: [V - 1, T, k.total],
    hints: ['Count the domes first: the two hubs and the small domes along the routes. A spanning tree has one cable fewer.', 'A spanning tree leaves out two cables from two different routes. The cheapest one leaves out the longest cables it can, which Kruskal’s algorithm finds by itself.'],
    solution: `The network has ${n(V)} domes and ${n(edges.length)} cables, so a spanning tree has ${n(V - 1)} cables and leaves out 2. The routes have ${n(a)}, ${n(b)} and ${n(c)} cables, and the two left out must come from different routes: ${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(T)} spanning trees. Kruskal’s algorithm, shortest first: ${kruskalText(k)}. The two cables left out are the longest cables of two routes, ${n(tops[0])} and ${n(tops[1])}, so the minimum spanning tree has length ${n(all)} − ${n(tops[0])} − ${n(tops[1])} = ${n(k.total)}.`,
    guidance: [
     { prompt: `How many domes does the network have, and how many cables does a spanning tree of it have?`, answer: [V, V - 1], explanation: `The 2 hubs and ${n(V - 2)} small domes make ${n(V)} domes, so a spanning tree has ${n(V - 1)} cables.` },
     { prompt: `A spanning tree leaves out one cable from each of two different routes. How many spanning trees are there?`, answer: [T], explanation: `${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(T)}.` },
     { prompt: `All the cables add up to ${n(all)}. What is the total length of the minimum spanning tree?`, answer: [k.total], explanation: `The cheapest tree leaves out the most cable it can: the longest cable of each of two routes, ${n(tops[0])} and ${n(tops[1])}. ${n(all)} − ${n(tops[0])} − ${n(tops[1])} = ${n(k.total)}.` }
    ] }; }
 },
 /* Dijkstra from station 1 on 5–7 stations, times 1–15. Station V is reached by at least two roads and beats any
    direct road; station x is another station whose shortest route is not its direct road. */
 q18: {
  canonical: { V: 6, x: 4, edges: [[1, 2, 7], [1, 3, 3], [1, 4, 12], [2, 3, 2], [2, 5, 6], [3, 4, 8], [3, 5, 11], [4, 6, 5], [5, 6, 4]] },
  draw: R => { for (;;) { const V = R.int(5, 7), edges = connected(R, V, V + R.int(2, 4)).map(e => [e[0], e[1], R.int(1, 15)]), d = dijkstra(V, edges, 1).dist;
   const beats = v => { const w = direct(edges, 1, v); return w === null || d[v] < w; };
   const xs = []; for (let v = 2; v < V; v++) if (beats(v)) xs.push(v);
   if (beats(V) && direct(edges, 1, V) === null && xs.length) return { V, x: R.pick(xs), edges }; } },
  build: ({ V, x, edges }) => { const { dist, order } = dijkstra(V, edges, 1), first = order[1]; return {
   prompt: `Dispatch has the driving times, in minutes, along the rover roads between stations 1 to ${n(V)} (in brackets): ${listed(edges)}. A rover leaves station 1. Use Dijkstra’s algorithm. Enter the shortest driving time to station ${n(V)}, then the shortest driving time to station ${n(x)}.`,
   answer: [dist[V], dist[x]],
   hints: ['Give station 1 the time 0. Each round, make permanent the station with the smallest time so far, then check whether going through it gives any of its neighbours a shorter time.', 'A time is final only when its station is made permanent: a direct road is not always the fastest way.'],
   solution: `Dijkstra’s algorithm makes the stations permanent in this order, each with its shortest time: ${order.map(([v, t]) => `station ${n(v)} at ${n(t)}`).join(', ')}. So the shortest driving time to station ${n(V)} is ${n(dist[V])} minutes and to station ${n(x)} it is ${n(dist[x])} minutes.`,
   guidance: [
    { prompt: `After station 1, which time is made permanent first? It belongs to the nearest neighbour of station 1.`, answer: [first[1]], explanation: `The roads out of station 1 are ${listed(edges.filter(e => e[0] === 1))}. The smallest time, ${n(first[1])}, cannot be beaten by any other route, so station ${n(first[0])} is made permanent at ${n(first[1])}.` },
    { prompt: `Carry on until station ${n(x)} is permanent. What is its shortest time?`, answer: [dist[x]], explanation: `Station ${n(x)} is made permanent at ${n(dist[x])} minutes.` },
    { prompt: `Carry on until station ${n(V)} is permanent. What is its shortest time?`, answer: [dist[V]], explanation: `The permanent times are ${order.map(([v, t]) => `${n(v)}: ${n(t)}`).join(', ')}, so station ${n(V)} is ${n(dist[V])} minutes away.` }
   ] }; }
 },
 /* K_p counting direction: (p − 1)!; K_q with reverses merged: (q − 1)! ÷ 2. Not the worked example (5 and 5). */
 q19: {
  canonical: { p: 6, q: 7 },
  draw: R => { let s; do { s = { p: R.int(4, 9), q: R.int(4, 9) }; } while (s.p === 5 && s.q === 5); return s; },
  build: ({ p, q }) => { const A = fact(p - 1), B = fact(q - 1) / 2; return {
   prompt: `Every pair of the ${n(p)} north stations is linked by a road, and so is every pair of the ${n(q)} south stations. A north delivery rover starts at the north depot, one of those stations, visits every other north station once and returns to the depot; the order of its deliveries matters, so a route and its reverse count as different. A south inspection drone does the same from the south depot, one of the south stations, but a loop and its reverse are the same inspection. Enter how many different routes the rover could take, then how many different inspection loops the drone could fly (type them without commas).`,
   answer: [A, B],
   hints: ['Fix the depot as the start. The other stations can then be visited in any order, and every order gives a Hamilton cycle.', 'Each loop flown backwards is the same loop, so when reverses are merged every cycle has been counted twice.'],
   solution: `North: from the depot there are ${n(p - 1)} choices for the first stop, ${n(p - 2)} for the next, and so on, so (${n(p)} − 1)! = ${n(p - 1)}! = ${n(A)} routes. South: (${n(q)} − 1)! = ${n(q - 1)}! = ${n(fact(q - 1))} cycles counting direction, and each loop appears twice, once each way, so there are ${n(fact(q - 1))} ÷ 2 = ${n(B)} inspection loops.`,
   guidance: [
    { prompt: `The rover’s route is an order of the ${n(p - 1)} north stations other than the depot. How many orders are there?`, answer: [A], explanation: `${n(p - 1)}! = ${n(A)}.` },
    { prompt: `How many Hamilton cycles from the depot does the south network have if direction counts?`, answer: [fact(q - 1)], explanation: `(${n(q)} − 1)! = ${n(q - 1)}! = ${n(fact(q - 1))}.` },
    { prompt: `Each inspection loop was counted once in each direction. How many different loops are there?`, answer: [B], explanation: `${n(fact(q - 1))} ÷ 2 = ${n(B)}.` }
   ] }; }
 },
 /* Brute force on 4 or 5 stations, every pair linked, times 4–30. */
 q20: {
  canonical: { k: 5, edges: [[1, 2, 14], [1, 3, 9], [1, 4, 22], [1, 5, 11], [2, 3, 17], [2, 4, 8], [2, 5, 20], [3, 4, 13], [3, 5, 6], [4, 5, 16]] },
  /* Never the worked example (4 stations: 7, 12, 9, 8, 14, 6). */
  draw: R => { for (;;) { const k = R.pick([4, 5]), edges = []; for (let u = 1; u <= k; u++) for (let v = u + 1; v <= k; v++) edges.push([u, v, R.int(4, 30)]);
   if (edges.map(e => e[2]).join() !== '7,12,9,8,14,6') return { k, edges }; } },
  build: ({ k, edges }) => { const ts = tours(k).map(t => [t, tourWeight(edges, t)]), best = Math.min(...ts.map(x => x[1])), first = ts[0], N = ts.length; return {
   prompt: `Dispatch must send a drone from base station 1 to each of stations 2 to ${n(k)} once and back to base. Every pair of stations has a direct flight; the flight times in minutes are in brackets: ${listed(edges)}. A tour and its reverse take the same time. Enter how many different tours there are to compare (counting a tour and its reverse once), then the time of the cheapest tour.`,
   answer: [N, best],
   hints: ['With the start fixed there are (n − 1)! orders of the other stations, and each tour appears twice, once each way.', 'List the tours from station 1, add up the times on each, and keep the smallest total.'],
   solution: `There are (${n(k)} − 1)! ÷ 2 = ${n(N)} tours to compare: ${ts.map(([t, w]) => `${t.map(n).join('–')}: ${n(w)}`).join('; ')}. The cheapest takes ${n(best)} minutes.`,
   guidance: [
    { prompt: `How many different tours are there, counting a tour and its reverse once?`, answer: [N], explanation: `(${n(k)} − 1)! = ${n(fact(k - 1))} orders, halved because each tour appears both ways: ${n(N)}.` },
    { prompt: `What is the time of the tour ${first[0].map(n).join('–')}?`, answer: [first[1]], explanation: `${first[0].slice(1).map((v, i) => n(direct(edges, first[0][i], v))).join(' + ')} = ${n(first[1])}.` },
    { prompt: `Work out the time of every tour. What is the smallest?`, answer: [best], explanation: `The times are ${ts.map(x => n(x[1])).join(', ')}, and the smallest is ${n(best)}.` }
   ] }; }
 }
});
})();
