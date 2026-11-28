/* Graph theory: networks practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p4.js. */
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
   Networks are lists of edges [u, v] or weighted edges [u, v, w], u < v, sorted; the prompt prints them as "1–2 (7)". */
const practice = (meta, stepLabels, generator) => {
 generator.canonical = generator.draw(G.rng(4, meta.id, 1));
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const sortEdges = list => list.map(e => e[0] < e[1] ? e.slice() : [e[1], e[0], ...e.slice(2)]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
/* A connected network on vertices 1..V with E edges: a random tree, then random extra edges. */
const connected = (R, V, E) => {
 const perm = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), have = new Set(), out = [];
 const put = (u, v) => { const k = Math.min(u, v) + ',' + Math.max(u, v); if (u === v || have.has(k)) return false; have.add(k); out.push([u, v]); return true; };
 for (let i = 1; i < V; i++) put(perm[i], perm[R.int(0, i - 1)]);
 while (out.length < E) put(R.int(1, V), R.int(1, V));
 return sortEdges(out);
};
const weighted = (R, V, E, top) => { const ws = shuffle(R, Array.from({ length: top }, (_, i) => i + 1)); return connected(R, V, E).map((e, i) => [e[0], e[1], ws[i]]); };
const listed = list => list.map(([u, v, w]) => `${n(u)}–${n(v)} (${n(w)})`).join(', ');
const sum = list => list.reduce((s, x) => s + x, 0);
/* Kruskal: edges by weight (ties by label), each added or skipped, stopping once V − 1 edges are in. `first` is an
   edge laid before the algorithm starts (or null). */
const kruskal = (V, edges, first = null) => {
 const root = Array.from({ length: V + 1 }, (_, i) => i), find = x => root[x] === x ? x : (root[x] = find(root[x]));
 const order = edges.filter(e => e !== first).sort((x, y) => x[2] - y[2] || x[0] - y[0] || x[1] - y[1]), steps = [], tree = [];
 if (first) { root[find(first[0])] = find(first[1]); tree.push(first); }
 for (const e of order) { if (tree.length === V - 1) break; const a = find(e[0]), b = find(e[1]); if (a === b) steps.push({ e, add: false }); else { root[a] = b; tree.push(e); steps.push({ e, add: true }); } }
 return { steps, tree, total: sum(tree.map(e => e[2])), last: tree[tree.length - 1][2], skipped: steps.filter(s => !s.add).map(s => s.e) };
};
const kText = (k, thing, verb = 'added') => k.steps.map(({ e, add }) => `${n(e[0])}–${n(e[1])} (${n(e[2])}) ${add ? verb : `skipped, because ${n(e[0])} and ${n(e[1])} are already joined`}`).join('; ');
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
/* Every tour from station 1 with its reverse merged (the second station is smaller than the last). */
const tours = k => { const out = [], rest = Array.from({ length: k - 1 }, (_, i) => i + 2);
 const go = (path, left) => { if (!left.length) { if (path[0] < path[path.length - 1]) out.push(path); return; } left.forEach((v, i) => go([...path, v], left.filter((_, j) => j !== i))); };
 go([], rest); return out.map(p => [1, ...p, 1]); };
const tourWeight = (edges, t) => { let s = 0; for (let i = 0; i + 1 < t.length; i++) s += direct(edges, t[i], t[i + 1]); return s; };
const complete = (R, k, lo, hi) => { const edges = []; for (let u = 1; u <= k; u++) for (let v = u + 1; v <= k; v++) edges.push([u, v, R.int(lo, hi)]); return edges; };
const plural = (c, one, many) => `${n(c)} ${c === 1 ? one : many}`;

/* ---- q16 Minimum spanning trees: Kruskal's algorithm [O12.10, KT12.1] ---- */

/* q16b: water pipes between greenhouses, 6–7 of them, costs 1–25 all different. Asked: the total cost and how many
   pipes Kruskal's algorithm skips before it stops (at least 1). The parent's network is cable between 6 domes. */
practice({ id: 'q16b', parent: 'q16', kind: 'setting', title: 'Water for the greenhouses',
 brief: 'The hydroponic farm wants one water supply reaching every greenhouse, and the plumbers want to pay for as little pipe as they can.',
 labels: ['total cost (thousand credits)', 'pipes skipped'], tolerance: 0.01 },
 [['pipes in the finished set'], ['total cost (thousand credits)'], ['pipes skipped']], {
 draw: R => { for (;;) { const V = R.int(6, 7), edges = weighted(R, V, V + R.int(2, 3), 25); if (kruskal(V, edges).skipped.length >= 1) return { V, edges }; } },
 build: ({ V, edges }) => { const k = kruskal(V, edges), sk = k.skipped.length; return {
  prompt: `The hydroponic farm has greenhouses 1 to ${n(V)}. Water pipes could be laid between these pairs, and no two pipes cost the same; each pipe’s cost in thousands of credits is in brackets: ${listed(edges)}. The plumbers want every greenhouse on the water supply for the least total cost. Use Kruskal’s algorithm: take the pipes cheapest first, skip a pipe when its two greenhouses are already joined by pipes taken, and stop as soon as the supply reaches every greenhouse. Enter the total cost of the cheapest set of pipes (in thousands of credits), then how many pipes the algorithm skipped before it stopped.`,
  answer: [k.total, sk],
  hints: ['Sort the pipes from cheapest to dearest and take each in turn, skipping a pipe only if its two greenhouses are already joined by pipes you have taken.', 'Stop the moment you have taken one pipe fewer than there are greenhouses. Pipes further down the list are never looked at, so they are not counted as skipped.'],
  solution: `Cheapest first: ${kText(k, 'pipe', 'taken')}. That is ${n(V - 1)} pipes, enough for ${n(V)} greenhouses, so the algorithm stops. The total cost is ${k.tree.map(e => n(e[2])).join(' + ')} = ${n(k.total)} thousand credits, and ${n(sk)} ${sk === 1 ? 'pipe was' : 'pipes were'} skipped before it stopped.`,
  guidance: [
   { prompt: `How many pipes does a supply that reaches all ${n(V)} greenhouses, with no loops, need?`, answer: [V - 1], explanation: `A tree has one edge fewer than its vertices: ${n(V - 1)} pipes.` },
   { prompt: `Go through the pipes cheapest first, taking or skipping each, until ${n(V - 1)} are taken. What is the total cost of the pipes taken?`, answer: [k.total], explanation: `The pipes taken are ${k.tree.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}, which add up to ${n(k.total)}.` },
   { prompt: `How many of the pipes you looked at were skipped because their two greenhouses were already joined?`, answer: [sk], explanation: `The skipped ${sk === 1 ? 'pipe is' : 'pipes are'} ${k.skipped.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}: ${n(sk)} in all.` }
  ] }; }
});

/* q16c: data cable between 6–7 domes, lengths 1–20 (hundreds of metres) all different, price p credits per hundred
   metres. Asked: the length of the minimum spanning tree, its cost, and the saving against cabling every tunnel. */
practice({ id: 'q16c', parent: 'q16', kind: 'applied', title: 'Pricing the data link',
 brief: 'Mira has a budget for the new data link between the domes, and the yard must tell her what the cheapest layout costs and what it saves.',
 labels: ['cheapest length (hundreds of m)', 'cost of cheapest layout (credits)', 'saving (credits)'], tolerance: 0.01 },
 [['cheapest length (hundreds of m)'], ['cost of cheapest layout (credits)'], ['saving (credits)']], {
 draw: R => { for (;;) { const V = R.int(6, 7), edges = weighted(R, V, V + 3, 20), p = R.pick([20, 25, 30, 40, 50]); if (kruskal(V, edges).skipped.length >= 2) return { V, p, edges }; } },
 build: ({ V, p, edges }) => { const k = kruskal(V, edges), all = sum(edges.map(e => e[2])), cost = k.total * p, full = all * p, save = full - cost; return {
  prompt: `Mira’s crew will lay a data link between domes 1 to ${n(V)}. The possible tunnels, with their lengths in hundreds of metres in brackets, are ${listed(edges)}, and no two tunnels have the same length. Cable costs ${n(p)} credits for each hundred metres. Every dome must be joined, and the crew will use the cheapest layout, found with Kruskal’s algorithm. Enter the total length of that layout (in hundreds of metres), then its cost in credits, then how many credits it saves compared with laying cable along every tunnel. Type the amounts without commas.`,
  answer: [k.total, cost, save],
  hints: ['Cost is length times price, so the cheapest layout is the one with the least total length: run Kruskal’s algorithm on the lengths, shortest first, skipping any tunnel that would close a circuit.', 'Laying cable along every tunnel costs the length of all the tunnels together times the price. The saving is the difference between that cost and the cost of the cheapest layout.'],
  solution: `Kruskal’s algorithm, shortest first: ${kText(k, 'tunnel')}. The layout has ${n(V - 1)} cables and length ${k.tree.map(e => n(e[2])).join(' + ')} = ${n(k.total)} hundred metres, which costs ${n(k.total)} × ${n(p)} = ${n(cost)} credits. All the tunnels together are ${n(all)} hundred metres, which would cost ${n(all)} × ${n(p)} = ${n(full)} credits. The saving is ${n(full)} − ${n(cost)} = ${n(save)} credits.`,
  guidance: [
   { prompt: `Run Kruskal’s algorithm, shortest tunnel first, until ${n(V - 1)} cables are in. What is their total length?`, answer: [k.total], explanation: `The cables taken are ${k.tree.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}, which add up to ${n(k.total)}.` },
   { prompt: `Each hundred metres costs ${n(p)} credits. What does the cheapest layout cost?`, answer: [cost], explanation: `${n(k.total)} × ${n(p)} = ${n(cost)} credits.` },
   { prompt: `All the tunnels together are ${n(all)} hundred metres long. How many credits does the cheapest layout save compared with cabling every tunnel?`, answer: [save], explanation: `Cabling everything costs ${n(all)} × ${n(p)} = ${n(full)}, and ${n(full)} − ${n(cost)} = ${n(save)} credits.` }
  ] }; }
});

/* q16d (uses q14): 8–9 domes, 12–14 tunnels, lengths 1–30 all different. One tunnel outside the cheapest tree is
   forced into the plan; Kruskal's algorithm carries on from it. Asked: tunnels left without cable (E − V + 1), the
   total with the forced tunnel, and how much longer that is than the unforced minimum. */
practice({ id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q14', title: 'The cable that must stay',
 brief: 'A water main already runs through one tunnel, so the yard has to lay its cable there and then plan the rest as cheaply as it can.',
 labels: ['tunnels without cable', 'total length (hundreds of m)', 'extra length (hundreds of m)'], tolerance: 0.01 },
 [['tunnels without cable'], ['unforced minimum (hundreds of m)'], ['total length (hundreds of m)', 'extra length (hundreds of m)']], {
 draw: R => { const V = R.int(8, 9), edges = weighted(R, V, V + R.int(4, 5), 30), base = kruskal(V, edges), out = edges.filter(e => !base.tree.includes(e));
  const f = R.pick(out); return { V, edges, f: edges.indexOf(f) }; },
 build: ({ V, edges, f }) => { const E = edges.length, e0 = edges[f], free = kruskal(V, edges), k = kruskal(V, edges, e0), extra = k.total - free.total;
  const rest = k.tree.filter(e => e !== e0); return {
  prompt: `The Cable Yard can lay cable along these tunnels between domes 1 to ${n(V)}, with lengths in hundreds of metres in brackets and no two lengths the same: ${listed(edges)}. A water main already runs through tunnel ${n(e0[0])}–${n(e0[1])}, so cable must be laid there. Lay that cable first, then carry on with Kruskal’s algorithm on the other tunnels, shortest first, skipping any tunnel whose two domes are already joined. This gives the cheapest network that includes tunnel ${n(e0[0])}–${n(e0[1])}. Enter how many tunnels the finished network leaves without cable, then its total length, then how much longer it is than the cheapest network of all, which has no such requirement (all lengths in hundreds of metres).`,
  answer: [E - V + 1, k.total, extra],
  hints: ['A network that joins every dome with no circuit has one cable fewer than the domes. Count the tunnels in the list; the ones without cable are all the rest.', 'Start with the forced tunnel already in the tree. Then take the other tunnels in order of length, skipping any whose two domes are already joined, and stop when the tree is complete. For the comparison, run the plain algorithm once with nothing forced.'],
  solution: `The network has ${n(V)} domes and ${n(E)} tunnels, so a tree uses ${n(V - 1)} cables and ${n(E)} − ${n(V - 1)} = ${n(E - V + 1)} tunnels are left without cable. With tunnel ${n(e0[0])}–${n(e0[1])} (${n(e0[2])}) laid first, the algorithm goes: ${kText(k, 'tunnel')}. The network is ${n(e0[0])}–${n(e0[1])} (${n(e0[2])}) and ${rest.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}, total ${k.tree.map(e => n(e[2])).join(' + ')} = ${n(k.total)}. With nothing forced, Kruskal’s algorithm gives total ${n(free.total)}, so the requirement adds ${n(k.total)} − ${n(free.total)} = ${n(extra)}.`,
  guidance: [
   { prompt: `The network has ${n(V)} domes and ${n(E)} tunnels. How many tunnels does a spanning tree leave without cable?`, answer: [E - V + 1], explanation: `A spanning tree uses ${n(V)} − 1 = ${n(V - 1)} tunnels, so ${n(E)} − ${n(V - 1)} = ${n(E - V + 1)} are left out.` },
   { prompt: `Run Kruskal’s algorithm on all the tunnels with nothing forced. What is the total length of the cheapest network?`, answer: [free.total], explanation: `The cheapest network has total length ${n(free.total)}.` },
   { prompt: `Now lay tunnel ${n(e0[0])}–${n(e0[1])} first and carry on with the algorithm. What is the total length of the network, and how much longer is it than the cheapest network with nothing forced?`, answer: [k.total, extra], explanation: `The network is ${n(e0[0])}–${n(e0[1])} (${n(e0[2])}) and ${rest.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}, total ${n(k.total)}, which is ${n(k.total)} − ${n(free.total)} = ${n(extra)} longer.` }
  ] }; }
});

/* ---- q17 Chapter review: the cable plan [O12.10, KT12.1] ---- */

/* A theta network: hubs 1 and 2 joined by routes of w[i].length cables each (weights w[i]); the small domes along the
   routes are numbered 3 onwards. A spanning tree leaves out one cable from each of all but one of the routes. */
const theta = w => { let next = 3; const routes = w.map(ws => { const stops = [1]; for (let i = 1; i < ws.length; i++) stops.push(next++); stops.push(2); return stops.map((s, i) => i ? [stops[i - 1], s, ws[i - 1]] : null).slice(1); });
 return { routes, edges: sortEdges(routes.flat()), V: next - 1 }; };
/* Spanning trees of a theta network: choose the route that keeps all its cables, multiply the lengths of the others. */
const thetaTrees = w => sum(w.map((_, i) => w.reduce((p, x, j) => j === i ? p : p * x.length, 1)));
const distinctRoutes = (R, lens) => { const ws = shuffle(R, Array.from({ length: 20 }, (_, i) => i + 1)); let at = 0; return lens.map(L => ws.slice(at, at += L)); };

/* q17b: two heating hubs and three pipelines of 2–4 pipes, lengths 1–20 all different, given as lists without labels.
   Asked: pipes in a spanning tree, spanning trees, minimum total length. Never the parent's worked example. */
practice({ id: 'q17b', parent: 'q17', kind: 'setting', title: 'Heat between two tanks',
 brief: 'The boiler house and the tank house are joined by three pipelines, and the plumbers need the pipe count, the number of layouts and the cheapest one.',
 labels: ['pipes in a spanning tree', 'spanning trees', 'minimum total length (hundreds of m)'], tolerance: 0.01 },
 [['places to join', 'pipes in a spanning tree'], ['spanning trees'], ['minimum total length (hundreds of m)']], {
 draw: R => { for (;;) { const w = distinctRoutes(R, [R.int(2, 4), R.int(2, 4), R.int(2, 4)]); if (JSON.stringify(w) !== '[[3,8],[5,1],[6,4]]') return { w }; } },
 build: ({ w }) => { const { edges, V } = theta(w), [a, b, c] = w.map(x => x.length), T = thetaTrees(w), k = kruskal(V, edges), all = sum(w.flat()), tops = w.map(x => Math.max(...x)).sort((x, y) => y - x), names = ['first', 'second', 'third'];
  const pipesText = w.map((x, i) => `the ${names[i]} pipeline ${x.map(n).join(', ')}`).join('; ');
  return {
  prompt: `Heat reaches the tank house from the boiler house along three separate pipelines that meet only at those two houses. Each pipeline is a chain of pipes with a junction box between each neighbouring pair. The pipe lengths in hundreds of metres, in order along each pipeline, are: ${pipesText}. No two pipes have the same length. A spanning tree here is a set of pipes that joins both houses and every junction box with no loop. Enter how many pipes any spanning tree uses, then how many different spanning trees there are, then the total length of the shortest spanning tree (in hundreds of metres).`,
  answer: [V - 1, T, k.total],
  hints: ['Count the places that must be joined: the two houses and one junction box between each neighbouring pair of pipes. A spanning tree has one pipe fewer than that.', 'A spanning tree leaves out one pipe from each of two different pipelines. The shortest one leaves out the longest pipes it can, and Kruskal’s algorithm finds that by itself.'],
  solution: `Each pipeline of ${n(a)}, ${n(b)} and ${n(c)} pipes has ${n(a - 1)}, ${n(b - 1)} and ${n(c - 1)} junction boxes, so there are ${n(V)} places to join and ${n(a + b + c)} pipes, and a spanning tree uses ${n(V - 1)} pipes and leaves out 2. The two left out must come from different pipelines: ${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(T)} spanning trees. Kruskal’s algorithm, shortest first, by length: ${k.steps.map(({ e, add }) => `the ${n(e[2])} ${add ? 'added' : 'skipped, as it would close a loop'}`).join('; ')}. The two pipes left out are the longest of two pipelines, ${n(tops[0])} and ${n(tops[1])}, so the shortest spanning tree has length ${n(all)} − ${n(tops[0])} − ${n(tops[1])} = ${n(k.total)}.`,
  guidance: [
   { prompt: `How many places must be joined (two houses and the junction boxes), and so how many pipes does a spanning tree use?`, answer: [V, V - 1], explanation: `The 2 houses and ${n(V - 2)} junction boxes make ${n(V)} places, so a spanning tree uses ${n(V - 1)} pipes.` },
   { prompt: `A spanning tree leaves out one pipe from each of two different pipelines. How many spanning trees are there?`, answer: [T], explanation: `${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(T)}.` },
   { prompt: `All the pipes add up to ${n(all)}. What is the total length of the shortest spanning tree?`, answer: [k.total], explanation: `It leaves out the longest pipe of each of two pipelines, ${n(tops[0])} and ${n(tops[1])}: ${n(all)} − ${n(tops[0])} − ${n(tops[1])} = ${n(k.total)}.` }
  ] }; }
});

/* q17c: three cable routes of 2–5 cables, lengths 1–20 all different, given with their domes. Each cable laid also needs
   a fitting costing f credits, so the cheapest layout by length is the cheapest by cost. Asked: cables in a spanning
   tree, its least total length, and the least total cost p × length + f × cables. */
practice({ id: 'q17c', parent: 'q17', kind: 'applied', title: 'Pricing the cable plan',
 brief: 'The yard has two hub domes and three routes between them, and Mira wants the cheapest layout priced, fittings included.',
 labels: ['cables in a spanning tree', 'minimum total length (hundreds of m)', 'cheapest cost (credits)'], tolerance: 0.01 },
 [['cables in a spanning tree'], ['minimum total length (hundreds of m)'], ['cheapest cost (credits)']], {
 draw: R => { for (;;) { const w = distinctRoutes(R, [R.int(2, 5), R.int(2, 5), R.int(2, 5)]); if (JSON.stringify(w) !== '[[3,8],[5,1],[6,4]]') return { w, p: R.pick([20, 25, 30, 40, 50]), f: R.pick([10, 15, 20, 25, 30]) }; } },
 build: ({ w, p, f }) => { const { routes, edges, V } = theta(w), k = kruskal(V, edges), all = sum(w.flat()), tops = w.map(x => Math.max(...x)).sort((x, y) => y - x), names = ['first', 'second', 'third'], cost = p * k.total + f * (V - 1);
  const routeText = routes.map((r, i) => `the ${names[i]} route ${r.map(([u, v, len]) => `${n(u)}–${n(v)} (${n(len)})`).join(', ')}`).join('; '); return {
  prompt: `Hub domes 1 and 2 are joined by three routes that meet only at the hubs, with cable lengths in hundreds of metres in brackets, no two the same: ${routeText}. The crew will lay cable along a spanning tree of this network. Cable costs ${n(p)} credits per hundred metres, and every cable laid also needs a fitting that costs ${n(f)} credits. Enter how many cables the layout has, then the total length of the shortest layout (in hundreds of metres), then the cost in credits of that layout, fittings included. Type the cost without commas.`,
  answer: [V - 1, k.total, cost],
  hints: ['Count all the domes: the two hubs and the small domes along the routes. Every spanning tree has the same number of cables, so the fittings cost the same whichever tree is chosen and the cheapest layout is the shortest one.', 'The shortest spanning tree leaves out the longest cables it can, one from each of two different routes. Then the cost is the length times the price per hundred metres, plus the fittings.'],
  solution: `The network has ${n(V)} domes, so a spanning tree has ${n(V - 1)} cables. Every spanning tree has ${n(V - 1)} fittings, so the cheapest layout is the shortest one. The two cables left out come from different routes, and the longest cables of two routes are ${n(tops[0])} and ${n(tops[1])}, so the shortest layout has length ${n(all)} − ${n(tops[0])} − ${n(tops[1])} = ${n(k.total)} (Kruskal’s algorithm gives the same). Its cost is ${n(k.total)} × ${n(p)} + ${n(V - 1)} × ${n(f)} = ${n(p * k.total)} + ${n(f * (V - 1))} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `The network has ${n(V - 2)} small domes as well as the 2 hubs. How many cables does a spanning tree have?`, answer: [V - 1], explanation: `${n(V)} domes, so ${n(V)} − 1 = ${n(V - 1)} cables.` },
   { prompt: `All the cables add up to ${n(all)}. The shortest layout leaves out the longest cable of each of two routes, the two longest route maximums. What is its total length?`, answer: [k.total], explanation: `The route maximums are ${w.map(x => n(Math.max(...x))).join(', ')}; the two largest are ${n(tops[0])} and ${n(tops[1])}. ${n(all)} − ${n(tops[0])} − ${n(tops[1])} = ${n(k.total)}.` },
   { prompt: `Length ${n(k.total)} at ${n(p)} credits per hundred metres, plus ${n(V - 1)} fittings at ${n(f)} credits each. What is the cost in credits?`, answer: [cost], explanation: `${n(k.total)} × ${n(p)} = ${n(p * k.total)} and ${n(V - 1)} × ${n(f)} = ${n(f * (V - 1))}, so the cost is ${n(cost)} credits.` }
  ] }; }
});

/* q17d (uses q15): four routes of 2–3 cables, lengths 1–20 all different. A spanning tree leaves out one cable from
   each of three of the four routes: the number of trees is the sum, over the route kept whole, of the product of the
   other three route sizes. Asked: cables in a tree, spanning trees, minimum total length. */
practice({ id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q15', title: 'Four routes between the hubs',
 brief: 'The yard adds a fourth route between the hub domes, and the crew has to recount the layouts and find the cheapest one.',
 labels: ['cables in a spanning tree', 'spanning trees', 'minimum total length (hundreds of m)'], tolerance: 0.01 },
 [['domes', 'cables in a spanning tree'], ['spanning trees'], ['minimum total length (hundreds of m)']], {
 draw: R => ({ w: distinctRoutes(R, [R.int(2, 3), R.int(2, 3), R.int(2, 3), R.int(2, 3)]) }),
 build: ({ w }) => { const { routes, edges, V } = theta(w), T = thetaTrees(w), k = kruskal(V, edges), all = sum(w.flat()), tops = w.map(x => Math.max(...x)).sort((x, y) => y - x), names = ['first', 'second', 'third', 'fourth'], L = w.map(x => x.length);
  const routeText = routes.map((r, i) => `the ${names[i]} route ${r.map(([u, v, len]) => `${n(u)}–${n(v)} (${n(len)})`).join(', ')}`).join('; ');
  const terms = L.map((_, i) => L.filter((__, j) => j !== i).map(n).join(' × ')), prods = L.map((_, i) => n(L.reduce((p, x, j) => j === i ? p : p * x, 1))); return {
  prompt: `Hub domes 1 and 2 are now joined by four routes that meet only at the hubs, with cable lengths in hundreds of metres in brackets, no two the same: ${routeText}. A spanning tree of this network leaves out exactly one cable from each of three of the four routes. Enter how many cables any spanning tree has, then how many different spanning trees there are, then the total length of the minimum spanning tree (in hundreds of metres).`,
  answer: [V - 1, T, k.total],
  hints: ['Count the domes: the two hubs and the small domes along the four routes. A spanning tree has one cable fewer than the domes.', 'To count spanning trees, choose the one route that keeps all its cables, then choose one cable to leave out from each of the other three routes. Add up over the four choices of that route. The cheapest tree leaves out the three longest of the four route maximums.'],
  solution: `The network has ${n(V)} domes and ${n(sum(L))} cables, so a spanning tree has ${n(V - 1)} cables and leaves out 3, one from each of three routes. Choose which route keeps all its cables and multiply the cable counts of the other three: ${terms.join(' + ')} = ${prods.join(' + ')} = ${n(T)} spanning trees. Kruskal’s algorithm, shortest first: ${kText(k, 'cable')}. The cables left out are the longest of three routes, ${n(tops[0])}, ${n(tops[1])} and ${n(tops[2])}, so the minimum spanning tree has length ${n(all)} − ${n(tops[0])} − ${n(tops[1])} − ${n(tops[2])} = ${n(k.total)}.`,
  guidance: [
   { prompt: `The routes have ${L.map(n).join(', ')} cables. How many domes does the network have, and how many cables does a spanning tree have?`, answer: [V, V - 1], explanation: `The 2 hubs and ${n(V - 2)} small domes make ${n(V)} domes, so a spanning tree has ${n(V - 1)} cables.` },
   { prompt: `One route keeps all its cables and each of the other three loses one. How many spanning trees are there, adding over the four choices of which route stays whole?`, answer: [T], explanation: `${terms.join(' + ')} = ${prods.join(' + ')} = ${n(T)}.` },
   { prompt: `All the cables add up to ${n(all)}. What is the total length of the minimum spanning tree, which leaves out the longest cable of each of three routes?`, answer: [k.total], explanation: `The longest cables of the routes are ${w.map(x => n(Math.max(...x))).join(', ')}, and the three largest are ${n(tops[0])}, ${n(tops[1])} and ${n(tops[2])}. ${n(all)} − ${n(tops[0])} − ${n(tops[1])} − ${n(tops[2])} = ${n(k.total)}.` }
  ] }; }
});

/* ---- q18 Shortest weighted paths: Dijkstra's algorithm [KT12.3] ---- */

/* Number of shortest routes from s to every vertex, with every road at least 1. */
const routeCounts = (V, edges, dist) => { const cnt = Array(V + 1).fill(0), ord = Array.from({ length: V }, (_, i) => i + 1).sort((a, b) => dist[a] - dist[b]); cnt[ord[0]] = 1;
 for (const v of ord) for (const [a, b, w] of edges) { const u = a === v ? b : b === v ? a : 0; if (u && dist[u] + w === dist[v]) cnt[v] += cnt[u]; } return cnt; };
/* The one shortest route to t (s … t), when it is the only one. */
const routeTo = (V, edges, dist, s, t) => { const path = [t]; let v = t; while (v !== s) { const e = edges.find(([a, b, w]) => (a === v && dist[b] + w === dist[v]) || (b === v && dist[a] + w === dist[v])); v = e[0] === v ? e[1] : e[0]; path.unshift(v); } return path; };
const permText = (order, upTo) => { const i = order.findIndex(([v]) => v === upTo); return order.slice(0, i + 1).map(([v, t]) => `station ${n(v)} at ${n(t)}`).join(', '); };

/* q18b: a courier drone leaves station s (not always 1) of 6–7 relay stations; flights cost 1–15 percent of the battery.
   Asked: the least battery to reach t and the number of flights on the cheapest route, which is the only one.
   Station t has no direct flight from s or one that is not the cheapest, and the cheapest route has at least 2 flights. */
practice({ id: 'q18b', parent: 'q18', kind: 'setting', title: 'Battery for the courier drone',
 brief: 'A courier drone must reach a distant relay station on one charge, and Dispatch needs to know the least battery the trip can use.',
 labels: ['least battery (percent)', 'flights on the cheapest route'], tolerance: 0.01 },
 [['first value made permanent (percent)'], ['least battery (percent)'], ['flights on the cheapest route']], {
 draw: R => { for (;;) { const V = R.int(6, 7), edges = connected(R, V, V + R.int(2, 4)).map(e => [e[0], e[1], R.int(1, 15)]), s = R.int(1, V), t = R.int(1, V); if (s === t) continue;
   const { dist } = dijkstra(V, edges, s), d = direct(edges, s, t), cnt = routeCounts(V, edges, dist);
   if (cnt[t] === 1 && (d === null || dist[t] < d) && routeTo(V, edges, dist, s, t).length >= 3) return { V, s, t, edges }; } },
 build: ({ V, s, t, edges }) => { const { dist, order } = dijkstra(V, edges, s), path = routeTo(V, edges, dist, s, t), legs = path.length - 1, near = order[1]; return {
  prompt: `A courier drone’s battery drains by the percentages in brackets on the flights between relay stations 1 to ${n(V)}: ${listed(edges)}. The drone starts at station ${n(s)} and must reach station ${n(t)} using as little battery as possible. Use Dijkstra’s algorithm. Enter the least battery the trip needs (in percent), then how many flights the cheapest route has. There is exactly one cheapest route.`,
  answer: [dist[t], legs],
  hints: ['Give the starting station the value 0. Each round, make permanent the station with the smallest value so far, then check whether flying on from it gives any neighbour a smaller value.', 'Once station values are permanent, find the route back from the target: each step goes back from a station to a neighbour whose permanent value plus the battery use of the flight between them equals the station’s value.'],
  solution: `Dijkstra’s algorithm makes the stations permanent in this order, each with its least battery use: ${permText(order, t)}. So station ${n(t)} needs ${n(dist[t])} percent. The route is ${path.map(n).join('–')}, which has ${n(legs)} flights.`,
  guidance: [
   { prompt: `From station ${n(s)}, the flights out are ${listed(edges.filter(e => e[0] === s || e[1] === s))}. Which value is made permanent first after the start?`, answer: [near[1]], explanation: `The smallest value out of station ${n(s)} is ${n(near[1])}, to station ${n(near[0])}; nothing can beat it, so it is made permanent.` },
   { prompt: `Carry on until station ${n(t)} is permanent. What is its least battery use?`, answer: [dist[t]], explanation: `Station ${n(t)} is made permanent at ${n(dist[t])} percent.` },
   { prompt: `Trace the route back from station ${n(t)}: which flights add up to ${n(dist[t])}? How many flights is that?`, answer: [legs], explanation: `The route is ${path.map(n).join('–')}, so ${n(legs)} flights.` }
  ] }; }
});

/* q18c: a rover from station 1 serves the clinic at x and the greenhouse at y on separate round trips, unloading u
   minutes at each. Both x and y are reached faster than by a direct road (or have none). Asked: the quickest times
   to x and to y and the total time of both round trips (roads can be driven both ways at the same speed). */
practice({ id: 'q18c', parent: 'q18', kind: 'applied', title: 'Two deliveries and back',
 brief: 'One rover must carry supplies to the clinic and the greenhouse from the depot, and Dispatch needs the whole shift time.',
 labels: ['time to the clinic (min)', 'time to the greenhouse (min)', 'total shift time (min)'], tolerance: 0.01 },
 [['time to the clinic (min)'], ['time to the greenhouse (min)'], ['total shift time (min)']], {
 draw: R => { for (;;) { const V = R.int(6, 7), edges = connected(R, V, V + R.int(2, 4)).map(e => [e[0], e[1], R.int(1, 15)]), x = R.int(2, V), y = R.int(2, V), u = R.pick([3, 4, 5, 6, 8, 10]); if (x === y) continue;
   const d = dijkstra(V, edges, 1).dist, ok = v => { const w = direct(edges, 1, v); return w === null || d[v] < w; }; if (ok(x) && ok(y)) return { V, x, y, u, edges }; } },
 build: ({ V, x, y, u, edges }) => { const { dist, order } = dijkstra(V, edges, 1), total = 2 * dist[x] + 2 * dist[y] + 2 * u; return {
  prompt: `Dispatch has the driving times, in minutes, along the rover roads between stations 1 to ${n(V)} (in brackets): ${listed(edges)}. Every road takes the same time in both directions. A rover leaves the depot at station 1 and drives the quickest route to the clinic at station ${n(x)}, unloads for ${n(u)} minutes and drives back to the depot by the quickest route. Then it does the same for the greenhouse at station ${n(y)}, unloading for ${n(u)} minutes. Use Dijkstra’s algorithm from station 1. Enter the quickest driving time from the depot to the clinic, then to the greenhouse, then the total time of both round trips, driving and unloading together (all in minutes).`,
  answer: [dist[x], dist[y], total],
  hints: ['One run of Dijkstra’s algorithm from station 1 gives the shortest driving time to every station. A direct road is not always the quickest way.', 'Each round trip is the way out, the unloading, and the way back. Add the two round trips together.'],
  solution: `Dijkstra’s algorithm from station 1 makes the stations permanent in this order: ${order.map(([v, t]) => `station ${n(v)} at ${n(t)}`).join(', ')}. So the clinic is ${n(dist[x])} minutes away and the greenhouse ${n(dist[y])}. The first round trip takes ${n(dist[x])} + ${n(u)} + ${n(dist[x])} = ${n(2 * dist[x] + u)} minutes and the second ${n(dist[y])} + ${n(u)} + ${n(dist[y])} = ${n(2 * dist[y] + u)} minutes, ${n(total)} minutes in all.`,
  guidance: [
   { prompt: `Run Dijkstra’s algorithm from station 1. What is the quickest driving time to the clinic at station ${n(x)}?`, answer: [dist[x]], explanation: `Station ${n(x)} is made permanent at ${n(dist[x])} minutes.` },
   { prompt: `What is the quickest driving time to the greenhouse at station ${n(y)}?`, answer: [dist[y]], explanation: `Station ${n(y)} is made permanent at ${n(dist[y])} minutes.` },
   { prompt: `Each round trip is the way out, ${n(u)} minutes unloading and the way back. What is the total time of the two round trips?`, answer: [total], explanation: `${n(2 * dist[x] + u)} + ${n(2 * dist[y] + u)} = ${n(total)} minutes.` }
  ] }; }
});

/* Hop layers from station 1 up to station t (t's layer is the last), the fewest roads h to t, the quickest time `best` among
   routes of exactly h roads, and `fast`, the shortest time to t. */
const hops = (V, edges, t) => {
 const lay = Array(V + 1).fill(-1); lay[1] = 0; const layers = [[1]];
 for (let i = 0; layers[i].length && lay[t] < 0; i++) { const next = []; for (const v of layers[i]) for (const [a, b] of edges) { const u = a === v ? b : b === v ? a : 0; if (u && lay[u] < 0) { lay[u] = i + 1; next.push(u); } } layers.push(next.sort((x, y) => x - y)); }
 const h = lay[t], bestAt = Array(V + 1).fill(Infinity); bestAt[1] = 0;
 for (let i = 1; i <= h; i++) for (const v of layers[i]) for (const [a, b, w] of edges) { const u = a === v ? b : b === v ? a : 0; if (u && lay[u] === i - 1) bestAt[v] = Math.min(bestAt[v], bestAt[u] + w); }
 return { h, best: bestAt[t], fast: dijkstra(V, edges, 1).dist[t], layers: layers.slice(0, h + 1) };
};

/* q18d (uses q07): 8–9 stations, 11–14 roads, times 1–15. The target t is at least 3 roads from station 1, and the
   quickest route to it uses more roads than the fewest. Asked: the shortest time to t, the fewest roads to t, and the
   time of the quickest route among those with the fewest roads. */
practice({ id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q07', title: 'Fastest or fewest roads',
 brief: 'Dispatch is deciding between the quickest route to a far station and the one with the fewest roads, and wants to know what the shorter route costs.',
 labels: ['quickest time (min)', 'fewest roads', 'quickest time with the fewest roads (min)'], tolerance: 0.01 },
 [['fewest roads'], ['quickest time (min)'], ['quickest time with the fewest roads (min)']], {
 draw: R => { for (;;) { const V = R.int(8, 9), edges = connected(R, V, V + R.int(3, 5)).map(e => [e[0], e[1], R.int(1, 15)]), t = R.int(4, V), info = hops(V, edges, t);
   if (info.h >= 3 && info.fast < info.best) return { V, t, edges }; } },
 build: ({ V, t, edges }) => { const { dist, order } = dijkstra(V, edges, 1), { h, best, layers } = hops(V, edges, t); return {
  prompt: `Dispatch’s full road map has stations 1 to ${n(V)}, with driving times in minutes in brackets: ${listed(edges)}. A rover leaves station 1 for station ${n(t)}. Enter the shortest driving time to station ${n(t)}, then the fewest roads any route from station 1 to station ${n(t)} uses, then the driving time of the quickest route among the routes that use that fewest number of roads (all times in minutes).`,
  answer: [dist[t], h, best],
  hints: ['Use Dijkstra’s algorithm for the quickest time. For the fewest roads, ignore the times and count the roads: the stations one road from station 1, then two roads, and so on, until you reach the target.', 'Among the routes with the fewest roads, add up the times along each and keep the smallest. This can be more than the quickest time, because a route with more roads can be quicker.'],
  solution: `Dijkstra’s algorithm makes the stations permanent in this order: ${permText(order, t)}, so the shortest time to station ${n(t)} is ${n(dist[t])} minutes. Counting roads only: ${layers.map((l, i) => `${n(i)} ${i === 1 ? 'road' : 'roads'}: station${l.length === 1 ? '' : 's'} ${l.map(n).join(', ')}`).join('; ')}. So the fewest roads is ${n(h)}. Among the routes with ${n(h)} roads the quickest takes ${n(best)} minutes, which is ${n(best - dist[t])} more than the quickest route overall.`,
  guidance: [
   { prompt: `Ignoring the times, count roads outward from station 1. What is the fewest roads to station ${n(t)}?`, answer: [h], explanation: `${layers.map((l, i) => `${n(i)} ${i === 1 ? 'road' : 'roads'}: station${l.length === 1 ? '' : 's'} ${l.map(n).join(', ')}`).join('; ')}. Station ${n(t)} first appears at ${n(h)} roads.` },
   { prompt: `Now use the times. What is the shortest driving time to station ${n(t)}?`, answer: [dist[t]], explanation: `Station ${n(t)} is made permanent at ${n(dist[t])} minutes.` },
   { prompt: `Of the routes with only ${n(h)} roads, which is the quickest? What is its driving time?`, answer: [best], explanation: `The quickest route using ${n(h)} roads takes ${n(best)} minutes.` }
  ] }; }
});

/* ---- q19 Hamilton cycles in complete graphs [O12.7] ---- */

/* q19b: one network of n beacon towers (4–9, not 5, which is the parent's worked example), a ridge name and a control tower number that only change the text, every pair joined.
   Asked: the loops with reverses merged, then the routes counting direction. */
practice({ id: 'q19b', parent: 'q19', kind: 'setting', title: 'The beacon patrol',
 brief: 'A patrol drone must fly a circuit of the beacon towers, and Dispatch wants to know how many different circuits exist.',
 labels: ['circuits, reverse the same', 'routes, direction counted'], tolerance: 0.01 },
 [['routes, direction counted'], ['circuits, reverse the same']], {
 draw: R => ({ n: R.pick([4, 6, 7, 8, 9]), c: R.int(1, 9), ridge: R.int(0, 5) }),
 build: ({ n: m, c, ridge }) => { const cc = 1 + (c - 1) % m, name = ['east', 'north', 'high', 'old', 'far', 'west'][ridge]; const A = fact(m - 1), B = A / 2; return {
  prompt: `The ${n(m)} beacon towers on the ${name} ridge, numbered 1 to ${n(m)}, are linked in pairs by an air corridor, so every tower is joined to every other. A patrol drone starts at the control tower, tower ${n(cc)}, flies to every other tower once and returns to the control tower. Enter how many different circuits there are when a circuit and the same circuit flown backwards count as the same, then how many different routes there are when the direction counts, so a route and its reverse are different. Type the numbers without commas.`,
  answer: [B, A],
  hints: ['Fix the control tower as the start. The other towers can be visited in any order, and every order is a route.', 'A circuit flown backwards is the same circuit, so when direction does not matter each circuit has been counted twice.'],
  solution: `From the control tower there are ${n(m - 1)} choices for the first stop, ${n(m - 2)} for the next, and so on, so counting direction there are (${n(m)} − 1)! = ${n(m - 1)}! = ${n(A)} routes. Each circuit appears twice, once in each direction, so there are ${n(A)} ÷ 2 = ${n(B)} circuits.`,
  guidance: [
   { prompt: `The patrol is an order of the ${n(m - 1)} towers other than the control tower. How many orders are there, counting direction?`, answer: [A], explanation: `${n(m - 1)}! = ${n(A)}.` },
   { prompt: `Each circuit was counted once in each direction. How many different circuits are there?`, answer: [B], explanation: `${n(A)} ÷ 2 = ${n(B)}.` }
  ] }; }
});

/* q19c: n stations (6–9), loops with reverses merged, each priced in s seconds; the loop counts 60, 360, 2520 and 20160 are
   all multiples of 12, so every s below gives whole minutes. Asked: the loops and the minutes to check all of them. */
practice({ id: 'q19c', parent: 'q19', kind: 'applied', title: 'Pricing every loop',
 brief: 'The planner must price every possible loop before Dispatch picks one, and wants to know how long that takes.',
 labels: ['loops to price', 'minutes to price them all'], tolerance: 0.01 },
 [['orders from the depot'], ['loops to price'], ['minutes to price them all']], {
 draw: R => ({ m: R.int(6, 9), s: R.pick([5, 10, 15, 20, 30]) }),
 build: ({ m, s }) => { const A = fact(m - 1), B = A / 2, mins = B * s / 60; return {
  prompt: `Dispatch’s planner must choose a delivery loop that calls at each of ${n(m)} stations, counting the depot as one of them, once and returns to the depot. Every pair of stations is joined by a road, and a loop driven backwards is the same loop. The planner prices every possible loop, one after another, and each takes ${n(s)} seconds. Enter how many different loops there are, then how many minutes pricing all of them takes. Type the numbers without commas.`,
  answer: [B, mins],
  hints: ['Fix the depot as the start, count the orders of the other stations, and halve the count because each loop can be read in two directions.', 'Multiply the number of loops by the seconds each takes, then divide by 60 to turn seconds into minutes.'],
  solution: `From the depot the other ${n(m - 1)} stations can be visited in ${n(m - 1)}! = ${n(A)} orders. Each loop is counted twice, once each way, so there are ${n(A)} ÷ 2 = ${n(B)} loops. Pricing them takes ${n(B)} × ${n(s)} = ${n(B * s)} seconds, which is ${n(B * s)} ÷ 60 = ${n(mins)} minutes.`,
  guidance: [
   { prompt: `How many orders of the ${n(m - 1)} stations other than the depot are there?`, answer: [A], explanation: `${n(m - 1)}! = ${n(A)}.` },
   { prompt: `Each loop was counted once in each direction. How many different loops are there?`, answer: [B], explanation: `${n(A)} ÷ 2 = ${n(B)}.` },
   { prompt: `Each loop takes ${n(s)} seconds to price. How many minutes do all ${n(B)} loops take?`, answer: [mins], explanation: `${n(B)} × ${n(s)} = ${n(B * s)} seconds, and ${n(B * s)} ÷ 60 = ${n(mins)} minutes.` }
  ] }; }
});

/* q19d (uses q03): n depots (6–9), two of them named by number, every pair joined. Asked: the corridors (n(n − 1) ÷ 2), the inspection loops with
   reverses merged ((n − 1)! ÷ 2), and the loops that use the corridor between two named depots ((n − 2)!). */
practice({ id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q03', title: 'Loops through one corridor',
 brief: 'Inspectors must fly every loop of the depots, and one corridor between two depots is the only one with a working beacon.',
 labels: ['corridors', 'loops', 'loops using the corridor'], tolerance: 0.01 },
 [['corridors'], ['loops'], ['loops using the corridor']], {
 draw: R => { const m = R.int(6, 9), a = R.int(1, m), b = R.except(1, m, [a]); return { m, a, b }; },
 build: ({ m, a, b }) => { const E = m * (m - 1) / 2, A = fact(m - 1), B = A / 2, C = fact(m - 2); return {
  prompt: `The ${n(m)} depots on the plateau are linked in pairs by an air corridor, so every depot is joined to every other, and each corridor joins just one pair. An inspection loop starts at a depot, calls at every other depot once and returns. A loop is the same loop whichever depot it is started from, and flown backwards it is still the same loop. Enter how many corridors there are, then how many different inspection loops there are, then how many of those loops use the corridor between depot ${n(Math.min(a, b))} and depot ${n(Math.max(a, b))}. The depots are numbered 1 to ${n(m)}. Type the numbers without commas.`,
  answer: [E, B, C],
  hints: ['Each depot has a corridor to every other depot, and each corridor is shared by its two ends, so it is counted from both sides.', 'To count the loops that use the corridor between the two named depots, fly each such loop starting at one of the two named depots and going to the other first. Then only the order of the remaining depots is free, and no loop is counted twice.'],
  solution: `Each of the ${n(m)} depots has ${n(m - 1)} corridors, and each corridor is counted from both of its ends, so there are ${n(m)} × ${n(m - 1)} ÷ 2 = ${n(E)} corridors. Counting direction there are (${n(m)} − 1)! = ${n(A)} loops from a fixed depot, and each loop appears twice, so there are ${n(A)} ÷ 2 = ${n(B)} loops. A loop that uses the corridor between depots ${n(Math.min(a, b))} and ${n(Math.max(a, b))} can be flown from depot ${n(Math.min(a, b))} with depot ${n(Math.max(a, b))} as the first stop, which fixes its direction; the other ${n(m - 2)} depots follow in any order, so there are ${n(m - 2)}! = ${n(C)} such loops.`,
  guidance: [
   { prompt: `Each of the ${n(m)} depots has a corridor to each of the other ${n(m - 1)}, and each corridor is shared by two depots. How many corridors are there?`, answer: [E], explanation: `${n(m)} × ${n(m - 1)} ÷ 2 = ${n(E)}.` },
   { prompt: `How many different inspection loops are there, with a loop and its reverse counted as the same?`, answer: [B], explanation: `(${n(m)} − 1)! ÷ 2 = ${n(A)} ÷ 2 = ${n(B)}.` },
   { prompt: `Start at depot ${n(Math.min(a, b))} and go to depot ${n(Math.max(a, b))} first. In how many orders can the other ${n(m - 2)} depots follow?`, answer: [C], explanation: `${n(m - 2)}! = ${n(C)}, and each of these gives a different loop through that corridor.` }
  ] }; }
});

/* ---- q20 Travelling salesperson: brute force [O12.9] ---- */

/* q20b: a rover round of 4 or 5 sites, every pair joined, times 3–25. Asked: the cheapest and the longest tour (each
   tour and its reverse counted once). Never the parent's worked example (4 stations: 7, 12, 9, 8, 14, 6). */
practice({ id: 'q20b', parent: 'q20', kind: 'setting', title: 'The sample round',
 brief: 'A geologist’s rover must visit every sample site and come back to base, and the crew wants to know the best and the worst round it could drive.',
 labels: ['quickest round (min)', 'slowest round (min)'], tolerance: 0.01 },
 [['time of the first round (min)'], ['quickest round (min)'], ['slowest round (min)']], {
 draw: R => { for (;;) { const k = R.pick([4, 5]), edges = complete(R, k, 3, 25); if (edges.map(e => e[2]).join() !== '7,12,9,8,14,6') return { k, edges }; } },
 build: ({ k, edges }) => { const ts = tours(k).map(t => [t, tourWeight(edges, t)]), ws = ts.map(x => x[1]), best = Math.min(...ws), worst = Math.max(...ws), first = ts[0]; return {
  prompt: `A rover starts at base site 1 and must visit each of the sample sites 2 to ${n(k)} once and return to base. Every pair of sites has a direct track; the driving times in minutes are in brackets: ${listed(edges)}. A round and the same round driven backwards take the same time. List every different round, counting a round and its reverse once. Enter the time of the quickest round, then the time of the slowest round.`,
  answer: [best, worst],
  hints: ['With the base fixed there are (n − 1)! orders of the other sites, and each round appears twice, once each way. Write out each round once.', 'Add up the track times along each round, including the track back to base. Keep the smallest total and the largest total.'],
  solution: `There are (${n(k)} − 1)! ÷ 2 = ${n(ts.length)} rounds to compare: ${ts.map(([t, w]) => `${t.map(n).join('–')}: ${n(w)}`).join('; ')}. The quickest takes ${n(best)} minutes and the slowest ${n(worst)} minutes.`,
  guidance: [
   { prompt: `What is the time of the round ${first[0].map(n).join('–')}?`, answer: [first[1]], explanation: `${first[0].slice(1).map((v, i) => n(direct(edges, first[0][i], v))).join(' + ')} = ${n(first[1])}.` },
   { prompt: `Work out the time of every round. What is the smallest?`, answer: [best], explanation: `The times are ${ws.map(n).join(', ')}, and the smallest is ${n(best)}.` },
   { prompt: `What is the largest of those times?`, answer: [worst], explanation: `The largest of ${ws.map(n).join(', ')} is ${n(worst)}.` }
  ] }; }
});

/* q20c: 5 stations, 12 tours, times 4–30. The drone stops s minutes at each of the 4 other stations, and its battery
   allows L minutes of flying, L = best + 4–10. Asked: the shortest flying time, the whole trip with stops, and how many
   of the 12 tours fly for L minutes or less (between 2 and 6). */
practice({ id: 'q20c', parent: 'q20', kind: 'applied', title: 'Flying within the battery',
 brief: 'A parcel drone has a limited battery and a stop to make at every station, and Dispatch needs its best tour and how many tours it can fly at all.',
 labels: ['shortest flying time (min)', 'whole trip with stops (min)', 'tours within the battery'], tolerance: 0.01 },
 [['shortest flying time (min)'], ['whole trip with stops (min)'], ['tours within the battery']], {
 draw: R => { for (;;) { const edges = complete(R, 5, 4, 30), ts = tours(5).map(t => tourWeight(edges, t)), best = Math.min(...ts), s = R.pick([5, 8, 10, 12, 15]), L = best + R.int(4, 10), c = ts.filter(w => w <= L).length;
   if (c >= 2 && c <= 6) return { edges, s, L }; } },
 build: ({ edges, s, L }) => { const ts = tours(5).map(t => [t, tourWeight(edges, t)]), ws = ts.map(x => x[1]), best = Math.min(...ws), whole = best + 4 * s, within = ws.filter(w => w <= L).length; return {
  prompt: `A parcel drone leaves base station 1, calls at each of stations 2 to 5 once and returns to base. Every pair of stations has a direct flight; the flight times in minutes are in brackets: ${listed(edges)}. A tour and the same tour flown backwards take the same time, so there are 12 different tours to compare. At each of the 4 stations other than the base the drone stops for ${n(s)} minutes. Its battery lasts for ${n(L)} minutes of flying, not counting stops. Enter the shortest flying time of any tour, then the time of that tour including the 4 stops, then how many of the 12 tours can be flown on the battery, that is, have a flying time of ${n(L)} minutes or less.`,
  answer: [best, whole, within],
  hints: ['Write out the 12 tours once each, and add up the flight times along each, including the flight back to base. The stops do not depend on the order, so they do not change which tour is shortest.', 'The stops add the same time to every tour. For the battery, compare only the flying time of each tour with the limit.'],
  solution: `The flying times of the 12 tours are ${ts.map(([t, w]) => `${t.map(n).join('–')}: ${n(w)}`).join('; ')}. The shortest is ${n(best)} minutes. With 4 stops of ${n(s)} minutes the whole trip takes ${n(best)} + 4 × ${n(s)} = ${n(whole)} minutes. The tours with flying time ${n(L)} or less number ${n(within)}.`,
  guidance: [
   { prompt: `Work out the flying time of each of the 12 tours. What is the smallest?`, answer: [best], explanation: `The times are ${ws.map(n).join(', ')}, and the smallest is ${n(best)}.` },
   { prompt: `The 4 stops each take ${n(s)} minutes. What is the whole trip time of the shortest tour, stops included?`, answer: [whole], explanation: `${n(best)} + 4 × ${n(s)} = ${n(whole)} minutes.` },
   { prompt: `How many of the 12 flying times are ${n(L)} minutes or less?`, answer: [within], explanation: `The times of ${n(L)} or less are ${ws.filter(w => w <= L).map(n).join(', ')}: ${n(within)} tours.` }
  ] }; }
});

/* q20d (uses q16): 5 stations, times 4–35. There is exactly one cheapest tour. Asked: its time, the total time of the
   minimum spanning tree of the five stations (Kruskal's algorithm), and the time of the cheapest tour without its
   longest flight (a spanning path, so at least the minimum spanning tree). */
practice({ id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q16', title: 'Tour against spanning tree',
 brief: 'Dispatch wants to know how much a closed tour of the stations costs compared with the cheapest cable-style network that just joins them.',
 labels: ['cheapest tour (min)', 'minimum spanning tree (min)', 'tour without its longest flight (min)'], tolerance: 0.01 },
 [['cheapest tour (min)'], ['minimum spanning tree (min)'], ['tour without its longest flight (min)']], {
 draw: R => { for (;;) { const edges = complete(R, 5, 4, 35), ts = tours(5).map(t => tourWeight(edges, t)).sort((a, b) => a - b); if (ts[0] < ts[1]) return { edges }; } },
 build: ({ edges }) => { const ts = tours(5).map(t => [t, tourWeight(edges, t)]).sort((a, b) => a[1] - b[1]), [bt, best] = ts[0], k = kruskal(5, edges), legs = bt.slice(1).map((v, i) => direct(edges, bt[i], v)), top = Math.max(...legs), open = best - top; return {
  prompt: `Dispatch’s five stations 1 to 5 are all linked in pairs by flights; the flight times in minutes are in brackets: ${listed(edges)}. A tour leaves station 1, calls at each other station once and returns, and a tour and its reverse count as one tour. Exactly one tour is the cheapest. Enter the time of that cheapest tour. Then enter the total time of the minimum spanning tree of the five stations: the four flights with the least total time that still join all five. Find it with Kruskal’s algorithm: take the flights from shortest to longest, skip any whose two stations are already joined by flights you have taken, and stop when four are in. Then take the flights of that cheapest tour, remove its longest flight (if two of its flights tie for longest, remove either one), and enter the total time of the four flights that are left.`,
  answer: [best, k.total, open],
  hints: ['A tour of 5 stations has 5 flights, and there are 12 different tours. Add up the flights of each and keep the smallest. Then look at the flights of that tour to find its longest one.', 'For the spanning tree, take the flights from shortest to longest, skipping any whose two stations are already joined, until 4 flights are in. Taking one flight out of a tour leaves a path through every station, which is a spanning tree, so it can never be lighter than the minimum spanning tree.'],
  solution: `The 12 tours: ${ts.map(([t, w]) => `${t.map(n).join('–')}: ${n(w)}`).join('; ')}. The cheapest is ${bt.map(n).join('–')}, taking ${n(best)} minutes. Kruskal’s algorithm, shortest first: ${kText(k, 'flight')}. The minimum spanning tree has total ${n(k.total)}. The cheapest tour’s flights are ${legs.map(n).join(', ')}, and the longest is ${n(top)}, so without it the tour takes ${n(best)} − ${n(top)} = ${n(open)} minutes, which is at least ${n(k.total)}.`,
  guidance: [
   { prompt: `Work out the time of every tour. What is the smallest?`, answer: [best], explanation: `The smallest is ${n(best)}, for the tour ${bt.map(n).join('–')}.` },
   { prompt: `Run Kruskal’s algorithm on the flights, shortest first, until 4 are taken. What is their total time?`, answer: [k.total], explanation: `The flights taken are ${k.tree.map(e => `${n(e[0])}–${n(e[1])} (${n(e[2])})`).join(', ')}, which add up to ${n(k.total)}.` },
   { prompt: `The cheapest tour’s flights are ${legs.map(n).join(', ')}. What is the total after the longest is removed?`, answer: [open], explanation: `${n(best)} − ${n(top)} = ${n(open)}.` }
  ] }; }
});

})();
