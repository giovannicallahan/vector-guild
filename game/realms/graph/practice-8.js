/* Graph theory: networks practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p8.js. */
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
   a fixed seed. To read a mission as the player sees it: node qa/show-mission.js <id> --realm graph */
const practice = (meta, stepLabels, generator) => {
 generator.canonical = generator.draw(G.rng(8, meta.id, 1));
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const Cap = s => s[0].toUpperCase() + s.slice(1);
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const sub = k => String(k).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
const sup = k => String(k).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
const C = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
const times = c => c === 1 ? 'once' : c === 2 ? 'twice' : `${n(c)} times`;
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const edgeText = edges => edges.map(([a, b]) => `${a}–${b}`).join(', ');
/* A Prüfer code for N domes: N − 2 numbers from 1 to N. */
const codeFor = (R, N) => Array.from({ length: N - 2 }, () => R.int(1, N));
const countIn = (code, v) => code.filter(x => x === v).length;
const missingFrom = (code, N) => { const out = []; for (let i = 1; i <= N; i++) if (!code.includes(i)) out.push(i); return out; };
/* A random graph on vertices 1..v with e edges, as sorted [a, b] pairs with a < b. */
const randomGraph = (R, v, e) => { const all = []; for (let a = 1; a <= v; a++) for (let b = a + 1; b <= v; b++) all.push([a, b]);
 return shuffle(R, all).slice(0, e).sort((x, y) => x[0] - y[0] || x[1] - y[1]); };
const adjacency = (v, edges) => { const A = Array.from({ length: v + 1 }, () => Array(v + 1).fill(false)); edges.forEach(([a, b]) => { A[a][b] = A[b][a] = true; }); return A; };
/* The first largest set of vertices that are all joined (linked = true) or all not joined (linked = false). */
const largestSet = (v, edges, linked) => { const A = adjacency(v, edges); let best = [];
 for (let mask = 1; mask < (1 << v); mask++) { const T = []; for (let i = 0; i < v; i++) if (mask & (1 << i)) T.push(i + 1);
  if (T.length <= best.length) continue;
  let ok = true; for (let i = 0; i < T.length && ok; i++) for (let j = i + 1; j < T.length && ok; j++) if (A[T[i]][T[j]] !== linked) ok = false;
  if (ok) best = T; }
 return best; };
/* A colouring of vertices 1..v with at most k colours so that joined vertices differ (list of colours, index 0 is vertex 1), or null. */
const colouring = (v, edges, k) => { const A = adjacency(v, edges), col = Array(v + 1).fill(0);
 const go = x => { if (x > v) return true;
  for (let c = 1; c <= k && c <= Math.max(0, ...col.slice(1, x)) + 1; c++) { let ok = true; for (let y = 1; y < x; y++) if (A[x][y] && col[y] === c) { ok = false; break; }
   if (ok) { col[x] = c; if (go(x + 1)) return true; col[x] = 0; } }
  return false; };
 return go(1) ? col.slice(1) : null; };
const chromatic = (v, edges) => { for (let k = 1; ; k++) if (colouring(v, edges, k)) return k; };
const fall = (m, j) => Array.from({ length: j }, (_, i) => n(m - i)).join(' × ');
const fact = j => Array.from({ length: j }, (_, i) => n(j - i)).join(' × ');

/* ---- q36 Prüfer codes [KT5.6] ---- */

/* q36b: relay masts, 7–10 of them, a random code. Asked: the most links at any one mast, and the number of masts with
   exactly one link. The parent is a filing code for 7 domes with the degree of a named dome. */
practice({ id: 'q36b', parent: 'q36', kind: 'setting', title: 'The relay mast code',
 brief: 'The rover depot files its radio relay layout as a short code, and the technicians want to know where the busiest mast is and how many masts are dead ends.',
 labels: ['links at the busiest mast', 'masts with one link'], tolerance: 0.01 },
 [['times written'], ['links at the busiest mast'], ['masts with one link']], {
 draw: R => { const N = R.int(7, 10); return { code: codeFor(R, N) }; },
 build: ({ code }) => { const N = code.length + 2, cnt = Array.from({ length: N }, (_, i) => countIn(code, i + 1)), maxc = Math.max(...cnt),
   tops = cnt.map((c, i) => c === maxc ? i + 1 : 0).filter(Boolean), d = maxc + 1, missing = missingFrom(code, N);
  return {
  prompt: `The radio relay masts of the outpost are numbered 1 to ${n(N)}. The links between them form a tree: every mast can reach every other, and there is no loop of links. The layout is filed as the Prüfer code (${code.join(', ')}). Enter the number of links at the mast with the most links, then the number of masts with exactly one link.`,
  answer: [d, missing.length],
  hints: ['A mast is written in the code one time fewer than its number of links, so the busiest mast is the one written most often.',
   'A mast with exactly one link is a leaf, and a leaf is never written in the code: count the numbers from 1 up to the number of masts that do not appear.'],
  solution: `${tops.length > 1 ? `Masts ${and(tops)} each appear` : `Mast ${tops[0]} appears`} ${times(maxc)} in the code, the most of any mast, so the busiest mast has ${n(maxc)} + 1 = ${n(d)} links. The numbers from 1 to ${n(N)} that never appear are ${and(missing)}. Each of them is a leaf, so ${n(missing.length)} masts have exactly one link.`,
  guidance: [
   { prompt: `Count how often each number appears in the code (${code.join(', ')}). What is the largest number of times any one number appears in the code?`, answer: [maxc], explanation: `${tops.length > 1 ? `Masts ${and(tops)} each appear` : `Mast ${tops[0]} appears`} ${times(maxc)}, the most of any mast.` },
   { prompt: 'A mast appears one time fewer than its number of links. How many links does the mast written most often have?', answer: [d], explanation: `${n(maxc)} + 1 = ${n(d)} links.` },
   { prompt: `Which numbers from 1 to ${n(N)} never appear in the code? Enter how many there are.`, answer: [missing.length], explanation: `${Cap(and(missing.map(String)))} never appear. Each is a leaf, so ${n(missing.length)} masts have exactly one link.` }
  ] }; }
});

/* q36c: a cable plan for 6–12 domes with a random code; a beacon lamp on every leaf dome at c credits. Asked: the
   cables, the leaf domes and the lamp bill. */
practice({ id: 'q36c', parent: 'q36', kind: 'applied', title: 'Lamps on the leaf domes',
 brief: 'The repair crew fits a beacon lamp at every dead-end dome of a filed cable plan, and the stores need the bill before they release the lamps.',
 labels: ['cables', 'leaf domes', 'cost of the lamps (credits)'], tolerance: 0.01 },
 [['cables'], ['leaf domes'], ['cost of the lamps (credits)']], {
 draw: R => { const N = R.int(6, 12); return { code: codeFor(R, N), c: R.pick([15, 20, 25, 30, 40, 50]) }; },
 build: ({ code, c }) => { const L = code.length, N = L + 2, missing = missingFrom(code, N), leaves = missing.length, cost = leaves * c; return {
  prompt: `A cable plan for the outpost’s domes, numbered from 1 upwards (the code’s length tells you how many domes there are), is filed as the Prüfer code (${code.join(', ')}). The cables form a tree. A beacon lamp is fitted at every leaf dome, a dome with exactly one cable, and each lamp costs ${n(c)} credits. Enter the number of cables in the plan, then the number of leaf domes, then the cost of all the lamps in credits.`,
  answer: [N - 1, leaves, cost],
  hints: ['A code for a tree on n vertices has n − 2 numbers, and a tree on n vertices has n − 1 edges.',
   'A leaf is never written in the code, so the leaves are the numbers from 1 to n that are missing from it. The cost of the lamps is the number of leaves times the price of one lamp.'],
  solution: `The code has ${n(L)} numbers, so the plan has ${n(L)} + 2 = ${n(N)} domes and ${n(N)} − 1 = ${n(N - 1)} cables. The numbers from 1 to ${n(N)} that never appear are ${and(missing)}, so there ${leaves > 1 ? 'are' : 'is'} ${n(leaves)} leaf ${leaves > 1 ? 'domes' : 'dome'}. The lamps cost ${n(leaves)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `The code has ${n(L)} numbers, so the plan has ${n(L)} + 2 domes. A tree has one cable fewer than it has domes. How many cables are there?`, answer: [N - 1], explanation: `${n(L)} + 2 = ${n(N)} domes, and ${n(N)} − 1 = ${n(N - 1)} cables.` },
   { prompt: `The leaves are the numbers from 1 to ${n(N)} that never appear in the code. How many leaf domes are there?`, answer: [leaves], explanation: `${Cap(and(missing.map(String)))} never ${leaves > 1 ? 'appear' : 'appears'}, so there ${leaves > 1 ? 'are' : 'is'} ${n(leaves)}.` },
   { prompt: `Each lamp costs ${n(c)} credits. What do the lamps for ${n(leaves)} leaf ${leaves > 1 ? 'domes' : 'dome'} cost in all?`, answer: [cost], explanation: `${n(leaves)} × ${n(c)} = ${n(cost)} credits.` }
  ] }; }
});

/* q36d (uses q35): 6 or 7 domes, a random code. Asked: the degree of a dome in the code, the labelled trees on N
   vertices (N^(N−2): 1296 or 16807) and the trees in which that dome is a leaf ((N−1)^(N−2): 625 or 7776). */
practice({ id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'Plans with a leaf at one dome',
 brief: 'The archive wants to know how many of all the possible cable plans leave one particular dome at the end of a branch.',
 labels: ['degree of the dome', 'labelled trees', 'trees with the dome as a leaf'], tolerance: 0.01 },
 [['degree of the dome'], ['labelled trees'], ['trees with the dome as a leaf']], {
 draw: R => { const N = R.pick([6, 7]), code = codeFor(R, N); return { code, v: R.pick(code) }; },
 build: ({ code, v }) => { const N = code.length + 2, e = N - 2, t = countIn(code, v), d = t + 1, total = Math.pow(N, e), leafTrees = Math.pow(N - 1, e);
  const rep = x => Array(e).fill(n(x)).join(' × ');
  return {
  prompt: `The archive files the cable plans for ${n(N)} numbered domes as Prüfer codes, lists of ${n(e)} numbers from 1 to ${n(N)}. Take it that every such list is the code of exactly one tree, and that different lists give different trees. One plan is filed as (${code.join(', ')}). Enter the degree of dome ${v} in that plan, then the number of different labelled trees on the ${n(N)} domes, then how many of all those trees have dome ${v} as a leaf. Type numbers without commas.`,
  answer: [d, total, leafTrees],
  hints: ['A vertex appears in the code one time fewer than its degree. The number of labelled trees on n vertices is n multiplied by itself n − 2 times, and each tree is one list.',
   'A dome is a leaf exactly when it never appears in the code. Count the lists in which it never appears: each place in the list can hold any of the other numbers.'],
  solution: `Dome ${v} appears ${times(t)} in the code, so its degree is ${n(t)} + 1 = ${n(d)}. Every list of ${n(e)} numbers from 1 to ${n(N)} is one tree, so there are ${n(N)}${sup(e)} = ${rep(N)} = ${n(total)} labelled trees. Dome ${v} is a leaf exactly when it never appears, so each of the ${n(e)} places has ${n(N - 1)} choices: ${n(N - 1)}${sup(e)} = ${rep(N - 1)} = ${n(leafTrees)} trees.`,
  guidance: [
   { prompt: `How many times does ${v} appear in the code (${code.join(', ')}), and so what is its degree? Enter the degree.`, answer: [d], explanation: `Dome ${v} appears ${times(t)}, so its degree is ${n(t)} + 1 = ${n(d)}.` },
   { prompt: `Each of the ${n(e)} places in a code can hold any of the numbers 1 to ${n(N)}. How many different lists are there, that is, how many labelled trees?`, answer: [total], explanation: `${n(N)}${sup(e)} = ${rep(N)} = ${n(total)}.` },
   { prompt: `Dome ${v} is a leaf exactly when it never appears in the code. How many lists of ${n(e)} numbers from 1 to ${n(N)} do not contain ${v}?`, answer: [leafTrees], explanation: `Each place has ${n(N - 1)} choices, so there are ${n(N - 1)}${sup(e)} = ${rep(N - 1)} = ${n(leafTrees)}.` }
  ] }; }
});

/* ---- q37 Cliques and independent sets [KT5.1, KT5.4] ---- */

/* q37b: eight radio masts, 11–15 interfering pairs, ω and α both 3 or 4. */
practice({ id: 'q37b', parent: 'q37', kind: 'setting', title: 'Interfering radio masts',
 brief: 'Eight radio masts share the outpost’s air, and the technicians need the biggest group that all disturb each other and the biggest group that can broadcast together.',
 labels: ['masts that all interfere', 'masts that broadcast together'], tolerance: 0.01 },
 [['masts that all interfere'], ['masts that broadcast together']], {
 draw: R => { for (;;) { const edges = randomGraph(R, 8, R.int(11, 15)), w = largestSet(8, edges, true).length, al = largestSet(8, edges, false).length;
   if (w >= 3 && w <= 4 && al >= 3 && al <= 4) return { edges }; } },
 build: ({ edges }) => { const cl = largestSet(8, edges, true), ind = largestSet(8, edges, false); return {
  prompt: `Eight radio masts, numbered 1 to 8, disturb each other in these pairs: ${edgeText(edges)}. Two masts that are not listed together do not disturb each other. Enter the size of the largest set of masts in which every two disturb each other, then the size of the largest set of masts that can broadcast at the same time because no two of them disturb each other.`,
  answer: [cl.length, ind.length],
  hints: ['Look for three masts that all disturb each other in pairs, then test whether a fourth mast disturbs all three. Keep growing the set until nothing can be added, and try other starting masts.',
   'Pick a mast, cross out every mast that disturbs it, pick again from the masts left, and repeat. Try different first choices and keep the biggest set you find.'],
  solution: `Masts ${and(cl)} all disturb each other, and no ${n(cl.length + 1)} masts do, so the largest such set has ${n(cl.length)} masts. Masts ${and(ind)} have no disturbance between any two of them, and no ${n(ind.length + 1)} masts are like that, so ${n(ind.length)} masts can broadcast together.`,
  guidance: [
   { prompt: 'Find a largest set of masts in which every two disturb each other. How many masts are in it?', answer: [cl.length], explanation: `Masts ${and(cl)} all disturb each other, and no larger set does: ${n(cl.length)}.` },
   { prompt: 'Find a largest set of masts in which no two disturb each other. How many masts are in it?', answer: [ind.length], explanation: `Masts ${and(ind)} have no disturbance between them, and no larger set is free of it: ${n(ind.length)}.` }
  ] }; }
});

/* q37c: a ring of 7–16 servers (not 6, the parent's example), c credits to service one. Asked: the most serviceable in
   a night (⌊N ÷ 2⌋), the cost of that night and the servers still waiting. */
practice({ id: 'q37c', parent: 'q37', kind: 'applied', title: 'Night service on the ring',
 brief: 'The archive’s servers are serviced a few at a time overnight, and the stores office needs the cost of the biggest safe night and what is left over.',
 labels: ['servers serviced', 'cost of the night (credits)', 'servers still waiting'], tolerance: 0.01 },
 [['servers serviced'], ['cost of the night (credits)'], ['servers still waiting']], {
 draw: R => ({ N: R.int(7, 16), c: R.pick([40, 50, 60, 75, 80, 120]) }),
 build: ({ N, c }) => { const al = Math.floor(N / 2), cost = al * c, left = N - al, take = []; for (let i = 1; i <= N - 1 && take.length < al; i += 2) take.push(i); return {
  prompt: `${n(N)} archive servers, numbered 1 to ${n(N)}, are linked in a ring: each server is linked to the next, and server ${n(N)} is linked back to server 1. While a server is being serviced it is switched off, so two linked servers must never be serviced on the same night. Servicing one server costs ${n(c)} credits. Enter the most servers that can be serviced in one night, then the cost of such a night in credits, then how many servers are still waiting after it.`,
  answer: [al, cost, left],
  hints: ['The servers serviced in one night must have no link between any two of them. Taking every second server round the ring works, but the last one taken must not sit beside the first.',
   'The cost of the night is the number of servers serviced times the price of one. The servers still waiting are all the others.'],
  solution: `Every server is linked to the two beside it, so the servers serviced together cannot sit side by side. Taking every second server, ${and(take)}, gives ${n(al)} servers, and ${n(al + 1)} servers of the ring would have to include two neighbours, so ${n(al)} is the most. The night costs ${n(al)} × ${n(c)} = ${n(cost)} credits, and ${n(N)} − ${n(al)} = ${n(left)} servers still wait.`,
  guidance: [
   { prompt: 'Take every second server round the ring. How many servers with no link between any two of them can you get, at most?', answer: [al], explanation: `${Cap(and(take.map(String)))} have no link between them: ${n(al)} servers. Any ${n(al + 1)} servers of the ring include two that sit side by side.` },
   { prompt: `Servicing one server costs ${n(c)} credits. What does a night with ${n(al)} servers cost?`, answer: [cost], explanation: `${n(al)} × ${n(c)} = ${n(cost)} credits.` },
   { prompt: `${n(N)} servers need servicing and ${n(al)} are done. How many are still waiting?`, answer: [left], explanation: `${n(N)} − ${n(al)} = ${n(left)}.` }
  ] }; }
});

/* q37d (uses q28): 8 or 9 servers, ω = χ (3 or 4) and α 3 or 4. Asked: ω, α and the fewest colours χ. */
practice({ id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q28', title: 'Backup labels',
 brief: 'The backup plan gives every server a label so that linked servers never share one, and Mira wants to know how few labels will do.',
 labels: ['clique number ω', 'independence number α', 'fewest colours'], tolerance: 0.01 },
 [['clique number ω'], ['independence number α'], ['fewest colours']], {
 draw: R => { for (;;) { const v = R.pick([8, 9]), edges = randomGraph(R, v, v + R.int(4, 8)), w = largestSet(v, edges, true).length, al = largestSet(v, edges, false).length;
   if (w >= 3 && w <= 4 && al >= 3 && al <= 4 && chromatic(v, edges) === w) return { v, edges }; } },
 build: ({ v, edges }) => { const cl = largestSet(v, edges, true), ind = largestSet(v, edges, false), w = cl.length, k = chromatic(v, edges), col = colouring(v, edges, k);
  const classes = Array.from({ length: k }, (_, i) => `colour ${i + 1}: server${col.filter(c => c === i + 1).length === 1 ? '' : 's'} ${and(col.map((c, j) => c === i + 1 ? j + 1 : 0).filter(Boolean))}`).join('; ');
  return {
  prompt: `${Cap(WORD[v])} archive servers, numbered 1 to ${n(v)}, have direct links ${edgeText(edges)}. Enter the clique number ω, the size of the largest set of servers that are all linked to each other, then the independence number α, the size of the largest set of servers no two of which are linked. Then give every server a colour so that two linked servers never share a colour, and enter the fewest colours that can do it.`,
  answer: [w, ind.length, k],
  hints: ['Servers that are all linked to each other need different colours, so the number of colours needed is at least the clique number ω.',
   'To colour, give the servers of a largest clique their own colours, then colour the others one at a time with a colour none of their neighbours has. If you get stuck, change an earlier choice.'],
  solution: `Servers ${and(cl)} are all linked to each other, and no ${n(w + 1)} servers are, so ω = ${n(w)}. Servers ${and(ind)} have no link between any two of them, and no ${n(ind.length + 1)} servers are like that, so α = ${n(ind.length)}. Those ${n(w)} linked servers need ${n(w)} different colours, so at least ${n(w)} are needed. This colouring uses only ${n(k)} and never gives linked servers the same colour: ${classes}. So the fewest is ${n(k)}.`,
  guidance: [
   { prompt: 'Find a largest set of servers that are all linked to each other. How many servers are in it?', answer: [w], explanation: `Servers ${and(cl)} are all linked to each other, and no larger set is: ω = ${n(w)}.` },
   { prompt: 'Find a largest set of servers with no link between any two of them. How many servers are in it?', answer: [ind.length], explanation: `Servers ${and(ind)} have no link between them, and no larger set is free of links: α = ${n(ind.length)}.` },
   { prompt: `The servers of a clique all need different colours, so at least ${n(w)} colours are needed. Try to colour all ${n(v)} servers with that many. How many colours do you need?`, answer: [k], explanation: `This colouring works: ${classes}. No linked servers share a colour, and fewer than ${n(w)} cannot work, so ${n(k)}.` }
  ] }; }
});

/* ---- q38 Counting triangles and cliques [O12.2] ---- */

/* q38b: a full set of roads between 8–30 depots (not 5, the worked example). Asked: the triangles of roads and those that
   have one named depot as a corner. */
practice({ id: 'q38b', parent: 'q38', kind: 'setting', title: 'Roads between rover depots',
 brief: 'The rover depots will be joined by a road between every pair, and the road office wants every triangle of roads counted, and those through one busy depot.',
 labels: ['triangles of roads', 'triangles at the depot'], tolerance: 0.01 },
 [['triangles of roads'], ['triangles at the depot']], {
 draw: R => { const N = R.int(8, 30); return { N, v: R.int(1, N) }; },
 build: ({ N, v }) => { const T = C(N, 3), M = C(N - 1, 2); return {
  prompt: `There are ${n(N)} rover depots, numbered 1 to ${n(N)}, with a road between every pair of them. A triangle of roads is three depots with a road between every two of them. Enter the number of triangles of roads, then the number of those triangles that have depot ${v} as one of their three corners. Type numbers without commas.`,
  answer: [T, M],
  hints: ['Every set of 3 depots is a triangle, since every pair is joined, so the triangles are the ways to choose 3 of the depots, C(n, 3).',
   'A triangle with depot v as a corner is depot v together with 2 of the other depots. Choose 2 of the n − 1 others: C(n − 1, 2) = (n − 1) × (n − 2) ÷ (2 × 1).'],
  solution: `Every 3 of the ${n(N)} depots form a triangle, so there are C(${n(N)}, 3) = (${fall(N, 3)}) ÷ (3 × 2 × 1) = ${n(T)}. A triangle with depot ${v} as a corner is depot ${v} and 2 of the other ${n(N - 1)} depots, so there are C(${n(N - 1)}, 2) = (${fall(N - 1, 2)}) ÷ (2 × 1) = ${n(M)}.`,
  guidance: [
   { prompt: `How many ways are there to choose 3 of the ${n(N)} depots?`, answer: [T], explanation: `C(${n(N)}, 3) = (${fall(N, 3)}) ÷ (3 × 2 × 1) = ${n(T)}, and each choice is a triangle.` },
   { prompt: `A triangle with depot ${v} as a corner is depot ${v} and 2 of the other ${n(N - 1)} depots. How many ways are there to choose those 2?`, answer: [M], explanation: `C(${n(N - 1)}, 2) = (${fall(N - 1, 2)}) ÷ (2 × 1) = ${n(M)}.` }
  ] }; }
});

/* q38c: a full mesh of 8–14 relay domes; every triangle gets a signal test (a credits) and every 4-clique a power test
   (b credits). Asked: the tests of each kind and the bill. The largest bill is 57330. */
practice({ id: 'q38c', parent: 'q38', kind: 'applied', title: 'Testing the full mesh',
 brief: 'Before the relay domes go live, the crew must test every fully linked group in the mesh, and the stores office wants the bill in advance.',
 labels: ['signal tests', 'power tests', 'total cost (credits)'], tolerance: 0.01 },
 [['signal tests'], ['power tests'], ['total cost (credits)']], {
 draw: R => ({ N: R.int(8, 14), a: R.pick([5, 8, 10, 12, 15, 20]), b: R.pick([20, 25, 30, 40, 50]) }),
 build: ({ N, a, b }) => { const T = C(N, 3), Q = C(N, 4), ca = T * a, cb = Q * b, total = ca + cb; return {
  prompt: `${n(N)} relay domes have a tunnel between every pair: the complete graph K${sub(N)}. Before it goes live the crew tests every fully linked group once. Every triangle, three domes all joined to each other, gets a signal test costing ${n(a)} credits. Every 4-clique, four domes all joined to each other, gets a power test costing ${n(b)} credits. Enter the number of signal tests, then the number of power tests, then the total cost in credits. Type numbers without commas.`,
  answer: [T, Q, total],
  hints: ['In a complete graph every choice of k vertices is a k-clique, so the number of triangles is C(n, 3) and the number of 4-cliques is C(n, 4).',
   'Each kind of test costs its number of tests times its price. Add the two costs.'],
  solution: `Signal tests: C(${n(N)}, 3) = (${fall(N, 3)}) ÷ (3 × 2 × 1) = ${n(T)}. Power tests: C(${n(N)}, 4) = (${fall(N, 4)}) ÷ (${fact(4)}) = ${n(Q)}. The signal tests cost ${n(T)} × ${n(a)} = ${n(ca)} credits and the power tests ${n(Q)} × ${n(b)} = ${n(cb)} credits, so the total is ${n(ca)} + ${n(cb)} = ${n(total)} credits.`,
  guidance: [
   { prompt: `How many triangles are there, that is, how many ways to choose 3 of the ${n(N)} domes?`, answer: [T], explanation: `C(${n(N)}, 3) = (${fall(N, 3)}) ÷ (3 × 2 × 1) = ${n(T)}.` },
   { prompt: `How many 4-cliques are there, that is, how many ways to choose 4 of the ${n(N)} domes?`, answer: [Q], explanation: `C(${n(N)}, 4) = (${fall(N, 4)}) ÷ (${fact(4)}) = ${n(Q)}.` },
   { prompt: `${n(T)} signal tests cost ${n(a)} credits each and ${n(Q)} power tests cost ${n(b)} credits each. What is the total cost in credits?`, answer: [total], explanation: `${n(T)} × ${n(a)} = ${n(ca)} and ${n(Q)} × ${n(b)} = ${n(cb)}, and ${n(ca)} + ${n(cb)} = ${n(total)} credits.` }
  ] }; }
});

/* q38d (uses q04): K_N with N from 10 to 24, one dome shut down, k = 4 or 5. Asked: the triangles left, the triangles
   lost and the k-cliques left. The largest answer is C(23, 5) = 33649. */
practice({ id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q04', title: 'A dome goes offline',
 brief: 'One dome of a fully linked group is shut for repairs, and the archive must re-index the triangles and larger groups that survive.',
 labels: ['triangles left', 'triangles lost', 'cliques left'], tolerance: 0.01 },
 [['triangles left'], ['triangles lost'], ['cliques left']], {
 draw: R => { const N = R.int(10, 24); return { N, v: R.int(1, N), k: R.pick([4, 5]) }; },
 build: ({ N, v, k }) => { const M = N - 1, left = C(M, 3), all = C(N, 3), lost = all - left, q = C(M, k); return {
  prompt: `A full mesh joins ${n(N)} domes, numbered 1 to ${n(N)}, with a tunnel between every pair: the complete graph K${sub(N)}. Dome ${v} is shut for repairs, and every tunnel at it is closed with it. The domes and tunnels that are left form a subgraph of the mesh. Enter the number of triangles still in the mesh, then the number of triangles lost when dome ${v} closed, then the number of ${k}-cliques still in the mesh, the sets of ${k} domes all joined to each other. Type numbers without commas.`,
  answer: [left, lost, q],
  hints: ['The domes that are left still have a tunnel between every pair, so they form a complete graph with one vertex fewer. Count its triangles and its k-cliques with C(n, k).',
   'A triangle is lost exactly when the closed dome was one of its corners, so the triangles lost are the triangles before, C(n, 3), take away the triangles left.'],
  solution: `The ${n(M)} domes left still have a tunnel between every pair, so they form K${sub(M)}. It has C(${n(M)}, 3) = (${fall(M, 3)}) ÷ (3 × 2 × 1) = ${n(left)} triangles. Before the closure there were C(${n(N)}, 3) = ${n(all)}, so ${n(all)} − ${n(left)} = ${n(lost)} triangles were lost. It has C(${n(M)}, ${k}) = (${fall(M, k)}) ÷ (${fact(k)}) = ${n(q)} ${k}-cliques.`,
  guidance: [
   { prompt: `The ${n(M)} domes left still form a complete graph. How many triangles does it have?`, answer: [left], explanation: `C(${n(M)}, 3) = (${fall(M, 3)}) ÷ (3 × 2 × 1) = ${n(left)}.` },
   { prompt: `Before the closure the ${n(N)} domes had C(${n(N)}, 3) = ${n(all)} triangles. How many were lost?`, answer: [lost], explanation: `${n(all)} − ${n(left)} = ${n(lost)}.` },
   { prompt: `How many ${k}-cliques does the complete graph on the ${n(M)} domes left have?`, answer: [q], explanation: `C(${n(M)}, ${k}) = (${fall(M, k)}) ÷ (${fact(k)}) = ${n(q)}.` }
  ] }; }
});

/* ---- q39 Ramsey's guarantee [KT11.2] ---- */

/* q39b: 4–30 archivists (not 7, the worked example), about 30% at 4 or 5. Asked: the guaranteed larger group at one
   archivist, and 1 or 0 for a guaranteed triple (n ≥ 6). */
practice({ id: 'q39b', parent: 'q39', kind: 'setting', title: 'Old acquaintances',
 brief: 'The archivists are being seated for a conference, and the organiser wants to know what a group of this size is certain to contain.',
 labels: ['larger group guaranteed', 'trio guaranteed (1 yes, 0 no)'], tolerance: 0.01 },
 [['other archivists'], ['larger group guaranteed'], ['trio guaranteed (1 yes, 0 no)']], {
 draw: R => { const N = R.next() < 0.3 ? R.pick([4, 5]) : R.except(6, 30, [7]); return { N, v: R.int(1, N) }; },
 build: ({ N, v }) => { const deg = N - 1, big = Math.ceil(deg / 2), small = deg - big, yes = N >= 6 ? 1 : 0;
  const why = yes ? `${n(N)} is at least R(3, 3) = 6, so such a trio is guaranteed: pick any 6 of the archivists and the argument for six applies to them.`
   : `${n(N)} is less than R(3, 3) = 6, so it is not guaranteed: ${N === 5 ? 'let the pairs in the ring 1–2–3–4–5–1 have worked together and the other five pairs never' : 'let the pairs in the ring 1–2–3–4–1 have worked together and the other two pairs never'}, and no three archivists are all in one relation to each other.`;
  return {
  prompt: `The archive has ${n(N)} archivists, numbered 1 to ${n(N)}. Every pair of archivists has either worked together on a project or never worked together, one or the other. Enter the largest number k that is certain whatever the history: one of the two groups, the archivists who have worked with archivist ${v} or the archivists who have never worked with archivist ${v}, has at least k members. Then enter 1 if every such history must contain three archivists who have all worked together in pairs, or three who have never worked together in any pair, or 0 if some history avoids both.`,
  answer: [big, yes],
  hints: ['Pigeonhole principle: the other archivists are split into two groups, and the bigger group has at least half of them, rounded up.',
   'Three archivists who are all in the same relation to each other are guaranteed exactly when the group has at least R(3, 3) archivists.'],
  solution: `Archivist ${v} has ${n(deg)} others, each in one of the two groups. If each group had ${n(big - 1)} or fewer there would be at most ${n(2 * (big - 1))} others, fewer than ${n(deg)}, so one group has at least ${n(big)}; and a split of ${n(big)} and ${n(small)} shows no larger number is certain. ${why}`,
  guidance: [
   { prompt: `How many other archivists are there besides archivist ${v}?`, answer: [deg], explanation: `${n(N)} − 1 = ${n(deg)}.` },
   { prompt: `Split ${n(deg)} archivists into two groups as evenly as you can. How many does the bigger group get?`, answer: [big], explanation: `${n(deg)} = ${n(big)} + ${n(small)}, so the bigger share is ${n(big)}, and no split does better than that for both groups.` },
   { prompt: `Is a trio all in the same relation guaranteed for ${n(N)} archivists? Enter 1 for yes, 0 for no.`, answer: [yes], explanation: why }
  ] }; }
});

/* q39c: 6–14 domes, two kinds of link. Asked: all the links, the larger kind's guaranteed share overall, and the
   guaranteed share at one dome. */
practice({ id: 'q39c', parent: 'q39', kind: 'applied', title: 'Spare couplings',
 brief: 'The safety office is stocking spare couplings for a plan that mixes cables and beams, and wants to know the smallest stock that is certain to be enough.',
 labels: ['links in all', 'links of one kind, whole plan', 'links of one kind at the dome'], tolerance: 0.01 },
 [['links in all'], ['links of one kind, whole plan'], ['links of one kind at the dome']], {
 draw: R => { const N = R.int(6, 14); return { N, v: R.int(1, N) }; },
 build: ({ N, v }) => { const L = N * (N - 1) / 2, bigL = Math.ceil(L / 2), smallL = L - bigL, deg = N - 1, bigD = Math.ceil(deg / 2), smallD = deg - bigD; return {
  prompt: `A plan for ${n(N)} domes joins every pair of domes by exactly one link, and each link is either a cable or a radio beam. The safety office will stock one spare coupling for every link of the kind that turns out to have more links, so it needs to know how many links that kind is certain to have. Enter the total number of links in the plan. Then enter the largest number of links of one kind that is guaranteed in the whole plan, however the links are chosen. Then enter the largest number of links of one kind that is guaranteed at dome ${v} alone.`,
  answer: [L, bigL, bigD],
  hints: ['In a complete graph on n vertices every pair is joined once, so there are n × (n − 1) ÷ 2 links.',
   'Pigeonhole principle: when links are split into two kinds, one kind has at least half of them, rounded up. Use the same idea for the links at one dome, which has n − 1 of them.'],
  solution: `Every pair of the ${n(N)} domes has one link, so there are ${n(N)} × ${n(N - 1)} ÷ 2 = ${n(L)} links. If each kind had ${n(bigL - 1)} or fewer there would be at most ${n(2 * (bigL - 1))} links, fewer than ${n(L)}, so one kind has at least ${n(bigL)}; a split of ${n(bigL)} and ${n(smallL)} shows no larger number is certain. Dome ${v} has ${n(deg)} links, and in the same way one kind has at least ${n(bigD)} of them, with a split of ${n(bigD)} and ${n(smallD)} showing no larger number is certain.`,
  guidance: [
   { prompt: `Every pair of the ${n(N)} domes has one link. How many links are there in all?`, answer: [L], explanation: `${n(N)} × ${n(N - 1)} ÷ 2 = ${n(L)}.` },
   { prompt: `Split ${n(L)} links into two kinds as evenly as you can. How many does the bigger kind get?`, answer: [bigL], explanation: `${n(L)} = ${n(bigL)} + ${n(smallL)}, so the bigger share is ${n(bigL)}, and no split does better than that for both kinds.` },
   { prompt: `Dome ${v} has ${n(deg)} links. Split them into two kinds as evenly as you can. How many does the bigger kind get?`, answer: [bigD], explanation: `${n(deg)} = ${n(bigD)} + ${n(smallD)}, so the bigger share is ${n(bigD)}.` }
  ] }; }
});

/* q39d (uses q38): three blocks of 3–6 domes. Cables inside a block, beams between blocks. Asked: the cable triangles
   (a choice of 3 inside a block), the beam triangles (one dome from each block) and the mixed triangles. */
practice({ id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q38', title: 'Three blocks of domes',
 brief: 'A plan joins its domes in three blocks, with cables inside a block and beams between blocks, and the safety office wants every one-kind triangle counted.',
 labels: ['cable triangles', 'beam triangles', 'mixed triangles'], tolerance: 0.01 },
 [['cable triangles'], ['beam triangles'], ['mixed triangles']], {
 draw: R => ({ a: R.int(3, 6), b: R.int(3, 6), c: R.int(3, 6) }),
 build: ({ a, b, c }) => { const N = a + b + c, cab = C(a, 3) + C(b, 3) + C(c, 3), beam = a * b * c, all = C(N, 3), mix = all - cab - beam; return {
  prompt: `A plan for ${n(N)} domes joins every pair of domes by exactly one link. The domes fall into three blocks: block A has ${n(a)} domes, block B has ${n(b)} and block C has ${n(c)}. A link between two domes of the same block is a cable, and a link between two domes of different blocks is a radio beam. Enter the number of cable triangles, three domes joined to each other by cables only, then the number of beam triangles, three domes joined to each other by beams only, then the number of triangles that are neither, because they contain both kinds of link. Type numbers without commas.`,
  answer: [cab, beam, mix],
  hints: ['A triangle of cables needs all three of its domes in the same block: count the ways to choose 3 domes inside each block and add them up.',
   'A triangle of beams needs its three domes in three different blocks, one from each. Every other triangle contains both kinds of link, so take the one-kind triangles away from all the triangles.'],
  solution: `Cable triangles lie inside one block: C(${n(a)}, 3) + C(${n(b)}, 3) + C(${n(c)}, 3) = ${n(C(a, 3))} + ${n(C(b, 3))} + ${n(C(c, 3))} = ${n(cab)}. A beam triangle has one dome in each block: ${n(a)} × ${n(b)} × ${n(c)} = ${n(beam)}. All ${n(N)} domes make C(${n(N)}, 3) = ${n(all)} triangles, so ${n(all)} − ${n(cab)} − ${n(beam)} = ${n(mix)} triangles contain both kinds.`,
  guidance: [
   { prompt: `A cable triangle has all three domes in one block. Choose 3 domes from block A (${n(a)} domes), from block B (${n(b)}) and from block C (${n(c)}), and add. How many cable triangles are there?`, answer: [cab], explanation: `${n(C(a, 3))} + ${n(C(b, 3))} + ${n(C(c, 3))} = ${n(cab)}.` },
   { prompt: `A beam triangle has one dome from each block. How many ways are there to choose one dome from each of the blocks of ${n(a)}, ${n(b)} and ${n(c)} domes?`, answer: [beam], explanation: `${n(a)} × ${n(b)} × ${n(c)} = ${n(beam)}.` },
   { prompt: `All ${n(N)} domes make C(${n(N)}, 3) = ${n(all)} triangles. How many of them contain both kinds of link?`, answer: [mix], explanation: `${n(all)} − ${n(cab)} − ${n(beam)} = ${n(mix)}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Topology [KT5.5] ---- */

/* q40b: a solar farm of m rows by k columns of panels (3 to 14) on a torus, starting from the faces. Asked: V, E and V − E + F. */
practice({ id: 'q40b', parent: 'q40', kind: 'setting', title: 'The solar ring farm',
 brief: 'A ring-shaped solar farm is covered in panels with no edge, and the engineers want its corners and seams counted before the wiring is ordered.',
 labels: ['panel corners V', 'panel sides E', 'V − E + F'], tolerance: 0.01 },
 [['panel corners V'], ['panel sides E'], ['V − E + F']], {
 draw: R => ({ m: R.int(3, 14), k: R.int(3, 14) }),
 build: ({ m, k }) => { const F = m * k, V = F, E = 2 * F; return {
  prompt: `A solar farm is built on a torus, the surface of a ring doughnut. Its panels form a grid of ${n(m)} rows and ${n(k)} columns that wraps all the way round in both directions, round the tube and round the ring, so the farm has no edge. Every panel is a four-sided block, four panels meet at every corner, and two panels share every side. Take each corner as a vertex, each side between two corners as an edge, and each panel as a face. Enter the number of corners V, then the number of sides E, then V − E + F.`,
  answer: [V, E, V - E + F],
  hints: ['Count corners by panel: every panel has four corners, but every corner is shared by four panels, so each corner is counted four times.',
   'Every panel has four sides and every side is shared by two panels. Then work out V − E + F, where F is the number of panels.'],
  solution: `There are ${n(m)} × ${n(k)} = ${n(F)} panels, so F = ${n(F)}. Each has 4 corners and each corner is shared by 4 panels, so V = 4 × ${n(F)} ÷ 4 = ${n(V)}. Each has 4 sides and each side is shared by 2 panels, so E = 4 × ${n(F)} ÷ 2 = ${n(E)}. V − E + F = ${n(V)} − ${n(E)} + ${n(F)} = 0, not the 2 of a drawing in the plane.`,
  guidance: [
   { prompt: `There are ${n(m)} × ${n(k)} = ${n(F)} panels, each with 4 corners, and each corner is shared by 4 panels. How many corners are there?`, answer: [V], explanation: `4 × ${n(F)} ÷ 4 = ${n(V)}.` },
   { prompt: `Each of the ${n(F)} panels has 4 sides, and each side is shared by 2 panels. How many sides are there?`, answer: [E], explanation: `4 × ${n(F)} ÷ 2 = ${n(E)}.` },
   { prompt: `With V = ${n(V)}, E = ${n(E)} and F = ${n(F)}, what is V − E + F?`, answer: [0], explanation: `${n(V)} − ${n(E)} + ${n(F)} = 0.` }
  ] }; }
});

/* q40c: a torus grid of m channels round the tube and k round the ring (3 to 10) with pumps at the crossings (s), pipes
   along the stretches (c) and a planter in every bed (p). Asked: the stretches, the beds and the bill. The largest bill is
   100 × 50 + 200 × 25 + 100 × 100 = 20000. */
practice({ id: 'q40c', parent: 'q40', kind: 'applied', title: 'Irrigating the ring',
 brief: 'The ring habitat’s gardens are to be watered by a wrap-around grid of channels, and the stores need the bill for pumps, pipes and planters.',
 labels: ['stretches of channel E', 'beds F', 'total cost (credits)'], tolerance: 0.01 },
 [['crossings V'], ['stretches of channel E', 'beds F'], ['total cost (credits)']], {
 draw: R => ({ m: R.int(3, 10), k: R.int(3, 10), s: R.pick([20, 30, 40, 50]), c: R.pick([10, 15, 25]), p: R.pick([60, 80, 100]) }),
 build: ({ m, k, s, c, p }) => { const V = m * k, E = 2 * V, F = V, cs = V * s, cc = E * c, cp = F * p, total = cs + cc + cp; return {
  prompt: `The gardens of the ring habitat, a torus, are watered by a grid of channels that wraps all the way round: ${n(m)} channels circle the tube, ${n(k)} channels circle the ring, and each channel of one kind crosses each channel of the other kind exactly once. A pump is fitted at every crossing and costs ${n(s)} credits. Every stretch of channel between two neighbouring crossings gets a pipe costing ${n(c)} credits. Every bed enclosed by four stretches gets a planter costing ${n(p)} credits. Enter the number of stretches, then the number of beds, then the total cost in credits. Type numbers without commas.`,
  answer: [E, F, total],
  hints: ['The crossings are the product of the two numbers of channels. Four stretches meet at every crossing and each stretch has two ends.',
   'Every bed has four sides and every stretch borders two beds. The total cost is the cost of the pumps, the pipes and the planters added together.'],
  solution: `There are ${n(m)} × ${n(k)} = ${n(V)} crossings. Four stretches meet at each and each stretch has two ends, so there are 4 × ${n(V)} ÷ 2 = ${n(E)} stretches. Each bed has four sides and each stretch borders two beds, so there are 2 × ${n(E)} ÷ 4 = ${n(F)} beds. The pumps cost ${n(V)} × ${n(s)} = ${n(cs)}, the pipes ${n(E)} × ${n(c)} = ${n(cc)} and the planters ${n(F)} × ${n(p)} = ${n(cp)}, so the total is ${n(total)} credits.`,
  guidance: [
   { prompt: `${n(m)} channels round the tube each cross ${n(k)} channels round the ring once. How many crossings are there?`, answer: [V], explanation: `${n(m)} × ${n(k)} = ${n(V)} crossings.` },
   { prompt: `Four stretches meet at each of the ${n(V)} crossings and each stretch has two ends. Each bed has four sides and each stretch borders two beds. Enter the number of stretches, then the number of beds.`, answer: [E, F], explanation: `Stretches: 4 × ${n(V)} ÷ 2 = ${n(E)}. Beds: 2 × ${n(E)} ÷ 4 = ${n(F)}.` },
   { prompt: `${n(V)} pumps cost ${n(s)} credits each, ${n(E)} pipes ${n(c)} each and ${n(F)} planters ${n(p)} each. What is the total cost in credits?`, answer: [total], explanation: `${n(V)} × ${n(s)} = ${n(cs)}, ${n(E)} × ${n(c)} = ${n(cc)} and ${n(F)} × ${n(p)} = ${n(cp)}, which add up to ${n(total)}.` }
  ] }; }
});

/* q40d (uses q24): a flat map of a rows by b columns of crossings (3 to 12; not 3 by 5, the worked example), then wrapped.
   Asked: the flat map's faces including the outside (Euler's formula), the stretches wrapping adds (a + b) and the
   faces of the wrapped habitat (ab). */
practice({ id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q24', title: 'Wrapping the street map',
 brief: 'The planners have a flat street map of the district and want to see how many blocks it gains when it is wrapped into the ring habitat.',
 labels: ['faces of the flat map', 'stretches added', 'faces after wrapping'], tolerance: 0.01 },
 [['streets in the flat map'], ['faces of the flat map', 'stretches added'], ['faces after wrapping']], {
 draw: R => { let p; do { p = { a: R.int(3, 12), b: R.int(3, 12) }; } while ((p.a === 3 && p.b === 5) || (p.a === 5 && p.b === 3)); return p; },
 build: ({ a, b }) => { const V = a * b, Ef = a * (b - 1) + b * (a - 1), Ff = 2 - V + Ef, extra = a + b, Et = Ef + extra, Ft = 2 * Et / 4; return {
  prompt: `A flat street map of the district has ${n(a)} rows and ${n(b)} columns of crossings. A street joins each crossing to the crossing next to it in the same row or the same column, and nothing else. Count the region outside the map as a face. Then the planners wrap the map into the ring habitat, a torus: they add one more stretch joining the last crossing of every row to the first crossing of that row, and one more joining the last crossing of every column to the first crossing of that column. On the torus every face is a block with four sides, and there is no outside region. Enter the number of faces of the flat map, then the number of stretches the wrapping adds, then the number of faces after wrapping.`,
  answer: [Ff, extra, Ft],
  hints: ['In the flat map the crossings are the rows times the columns, and the streets are those along each row plus those along each column. Euler’s formula for a drawing in the plane gives the faces.',
   'Wrapping adds one stretch for every row and one for every column. After wrapping, every face has four sides and every stretch borders two faces.'],
  solution: `The flat map has V = ${n(a)} × ${n(b)} = ${n(V)} crossings. Along the rows there are ${n(a)} × ${n(b - 1)} = ${n(a * (b - 1))} streets and along the columns ${n(b)} × ${n(a - 1)} = ${n(b * (a - 1))}, so E = ${n(Ef)}. Euler’s formula V − E + F = 2 gives F = 2 − ${n(V)} + ${n(Ef)} = ${n(Ff)}, the outside included. Wrapping adds ${n(a)} stretches for the rows and ${n(b)} for the columns: ${n(extra)}. Now E = ${n(Et)}, and with 4 sides to a face and 2 faces to a stretch, F = 2 × ${n(Et)} ÷ 4 = ${n(Ft)}.`,
  guidance: [
   { prompt: `There are ${n(a)} × ${n(b)} crossings. How many streets are there along the ${n(a)} rows and along the ${n(b)} columns together?`, answer: [Ef], explanation: `${n(a)} × ${n(b - 1)} = ${n(a * (b - 1))} along the rows and ${n(b)} × ${n(a - 1)} = ${n(b * (a - 1))} along the columns: ${n(Ef)}.` },
   { prompt: `Use V − E + F = 2 for the flat map, with V = ${n(V)} and E = ${n(Ef)}, to find its faces. Then enter how many stretches the wrapping adds, one for each row and one for each column.`, answer: [Ff, extra], explanation: `F = 2 − ${n(V)} + ${n(Ef)} = ${n(Ff)}. The wrapping adds ${n(a)} + ${n(b)} = ${n(extra)} stretches.` },
   { prompt: `After wrapping there are ${n(Et)} stretches. Each face has four sides and each stretch borders two faces. How many faces are there?`, answer: [Ft], explanation: `2 × ${n(Et)} ÷ 4 = ${n(Ft)}.` }
  ] }; }
});

})();
