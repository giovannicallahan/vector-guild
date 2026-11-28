/* Graph theory: networks practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p3.js. */
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
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const sortEdges = list => list.map(e => e[0] < e[1] ? e.slice() : [e[1], e[0]]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
/* A connected network on vertices 1..V with E edges: a random tree, then random extra edges. */
const connected = (R, V, E) => {
 const perm = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), have = new Set(), out = [];
 const put = (u, v) => { const k = Math.min(u, v) + ',' + Math.max(u, v); if (u === v || have.has(k)) return false; have.add(k); out.push([u, v]); return true; };
 for (let i = 1; i < V; i++) put(perm[i], perm[R.int(0, i - 1)]);
 while (out.length < E) put(R.int(1, V), R.int(1, V));
 return sortEdges(out);
};
const plain = list => list.map(([u, v]) => `${n(u)}–${n(v)}`).join(', ');
const andList = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const WORD = { 3: 'three', 4: 'four', 5: 'five' };
const sum = list => list.reduce((s, x) => s + x, 0);
/* Grid streets (q11): both sides odd, and neither road length more than twice the other, so pairing the odd corners
   with their neighbours along each side is the cheapest way to fix them (checked by a matching search in q11's notes). */
const gridOk = p => Math.max(p.a, p.b) <= 2 * Math.min(p.a, p.b);

/* ---- q11 Chapter review: eulerising a road map [O12.5] ---- */

mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'Cleaning the solar tracks',
 brief: 'The depot’s solar field has service tracks that need cleaning before the dust season, and the crew wants to know the cost of one rover doing it all.',
 labels: ['odd junctions', 'extra distance (m)'], tolerance: 0.01,
 gl: [['odd junctions'], ['repeated tracks'], ['extra distance (m)']]
}, {
 /* Not the worked example of q11 (3 wide, 5 deep, 100 and 80 metres). Lengths within a factor of 2 of each other. */
 canonical: { m: 7, k: 3, a: 120, b: 90 },
 draw: R => { let p; do { p = { m: R.pick([3, 5, 7]), k: R.pick([3, 5, 7]), a: 10 * R.int(6, 30), b: 10 * R.int(6, 30) }; } while (!gridOk(p) || (p.m === 3 && p.k === 5 && p.a === 100 && p.b === 80)); return p; },
 build: ({ m, k, a, b }) => { const J = (m + 1) * (k + 1), odd = 2 * (m - 1) + 2 * (k - 1), reps = odd / 2, extra = (m - 1) * a + (k - 1) * b; return {
  prompt: `The Rover Depot’s solar field is crossed by service tracks in a grid ${n(m)} blocks wide (west to east) and ${n(k)} blocks deep (south to north), so it has ${n(J)} junctions. A track is one block-long stretch between neighbouring junctions. Every west–east track is ${n(a)} metres long and every south–north track is ${n(b)} metres long. A cleaning rover must drive along every track at least once and finish at the junction where it started, and it can only use tracks that exist. Enter how many junctions have an odd number of tracks, then the least extra distance the rover must cover by repeating tracks, in metres (type it without commas).`,
  answer: [odd, extra],
  hints: ['A junction inside the grid has 4 tracks and each of the four corners of the field has 2. All the other junctions along the edge of the field have 3.', 'Each repeated track adds 1 to the count at both of its ends, so it can fix at most two odd junctions. Pair the odd junctions along each side of the field with their neighbours.'],
  solution: `The junctions along the edge of the field, apart from its four corners, have 3 tracks: ${n(m - 1)} on the south side, ${n(m - 1)} on the north side and ${n(k - 1)} on each of the west and east sides, ${n(odd)} odd junctions in all. Each repeated track fixes at most two of them, so at least ${n(odd)} ÷ 2 = ${n(reps)} repeats are needed, and pairing neighbours along each side uses exactly that many: ${n(m - 1)} west–east tracks and ${n(k - 1)} south–north tracks. The extra distance is ${n(m - 1)} × ${n(a)} + ${n(k - 1)} × ${n(b)} = ${n(extra)} metres.`,
  guidance: [
   { prompt: `Junctions inside the grid have 4 tracks, the four corners of the field have 2, and the other junctions along the edge have 3. How many junctions have an odd number of tracks?`, answer: [odd], explanation: `${n(m - 1)} on the south side, ${n(m - 1)} on the north side and ${n(k - 1)} on each of the west and east sides: ${n(m - 1)} + ${n(m - 1)} + ${n(k - 1)} + ${n(k - 1)} = ${n(odd)}.` },
   { prompt: `Each repeated track fixes at most two odd junctions, and pairing neighbours along the sides reaches that. How many tracks must be repeated?`, answer: [reps], explanation: `${n(odd)} ÷ 2 = ${n(reps)} tracks: ${n(m - 1)} west–east and ${n(k - 1)} south–north.` },
   { prompt: `The repeats are ${n(m - 1)} west–east tracks of ${n(a)} metres and ${n(k - 1)} south–north tracks of ${n(b)} metres. What extra distance do they add, in metres?`, answer: [extra], explanation: `${n(m - 1)} × ${n(a)} = ${n((m - 1) * a)} and ${n(k - 1)} × ${n(b)} = ${n((k - 1) * b)}, so the extra distance is ${n(extra)} metres.` }
  ] }; }
});

mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The dust-clearing shift',
 brief: 'A dust storm has buried the roads of a grid district, and the depot has to book the sweeper for the whole shift.',
 labels: ['roads driven twice', 'total distance (m)', 'time (minutes)'], tolerance: 0.01,
 gl: [['roads driven twice'], ['total distance (m)'], ['time (minutes)']]
}, {
 /* Lengths are multiples of 50 and the speed 25 or 50, so the time is a whole number of minutes. Not the worked example of q11. */
 canonical: { m: 5, k: 7, a: 150, b: 100, s: 50 },
 draw: R => { let p; do { p = { m: R.pick([3, 5, 7]), k: R.pick([3, 5, 7]), a: 50 * R.int(2, 6), b: 50 * R.int(2, 6), s: R.pick([25, 50]) }; } while (!gridOk(p) || (p.m === 3 && p.k === 5 && p.a === 100 && p.b === 80)); return p; },
 build: ({ m, k, a, b, s }) => { const we = m * (k + 1), sn = k * (m + 1), odd = 2 * (m - 1) + 2 * (k - 1), reps = odd / 2, extra = (m - 1) * a + (k - 1) * b, once = we * a + sn * b, total = once + extra, mins = total / s; return {
  prompt: `After a dust storm, the Rover Depot’s sweeper must clear every road of a grid district ${n(m)} blocks wide (west to east) and ${n(k)} blocks deep (south to north). The district has ${n(we)} west–east roads of ${n(a)} metres each and ${n(sn)} south–north roads of ${n(b)} metres each. The sweeper drives every road at least once, repeats as few roads as possible, and finishes at the corner where it started. It travels at ${n(s)} metres per minute. Enter how many roads it drives twice, the total distance it drives in metres (type it without commas), and how long the shift takes in minutes.`,
  answer: [reps, total, mins],
  hints: ['The odd corners are the corners along the edge of the grid, apart from the four outer ones. Pair each with a neighbour along the same side; each repeated road fixes two.', 'The total distance is every road driven once plus the repeated roads. Time is distance divided by speed.'],
  solution: `There are ${n(odd)} odd corners along the edges, so at least ${n(odd)} ÷ 2 = ${n(reps)} repeats are needed, and pairing neighbours along the sides uses ${n(m - 1)} west–east roads and ${n(k - 1)} south–north roads, ${n(reps)} in all. Driving every road once covers ${n(we)} × ${n(a)} + ${n(sn)} × ${n(b)} = ${n(once)} metres, and the repeats add ${n(m - 1)} × ${n(a)} + ${n(k - 1)} × ${n(b)} = ${n(extra)} metres, so the sweeper drives ${n(total)} metres. At ${n(s)} metres per minute that takes ${n(total)} ÷ ${n(s)} = ${n(mins)} minutes.`,
  guidance: [
   { prompt: `Corners inside have degree 4, the four outer corners have degree 2 and the other edge corners have degree 3. Pairing the odd corners along each side, how many roads are driven twice?`, answer: [reps], explanation: `${n(odd)} odd corners, two fixed by each repeat: ${n(odd)} ÷ 2 = ${n(reps)} roads, ${n(m - 1)} west–east and ${n(k - 1)} south–north.` },
   { prompt: `The sweeper drives all ${n(we)} west–east roads and all ${n(sn)} south–north roads once, and also the ${n(m - 1)} west–east and ${n(k - 1)} south–north roads that are repeated. What total distance does it drive, in metres?`, answer: [total], explanation: `${n(we)} × ${n(a)} + ${n(sn)} × ${n(b)} = ${n(once)}, and ${n(m - 1)} × ${n(a)} + ${n(k - 1)} × ${n(b)} = ${n(extra)} more, so ${n(total)} metres.` },
   { prompt: `At ${n(s)} metres per minute, how many minutes does it take to drive ${n(total)} metres?`, answer: [mins], explanation: `${n(total)} ÷ ${n(s)} = ${n(mins)} minutes.` }
  ] }; }
});

mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q02', title: 'Resurfacing by the handshake',
 brief: 'The depot is resurfacing a large grid district, and the surveyor wants the road count worked out from the corners before the sweeper’s plan is made.',
 labels: ['roads in the district', 'roads driven twice', 'extra distance (m)'], tolerance: 0.01,
 gl: [['sum of degrees'], ['roads in the district'], ['roads driven twice', 'extra distance (m)']]
}, {
 /* Larger grids (5 or 7 blocks each way) and longer roads. Never the worked example of q11. */
 canonical: { m: 7, k: 5, a: 240, b: 180 },
 draw: R => { let p; do { p = { m: R.pick([5, 7]), k: R.pick([5, 7]), a: 10 * R.int(10, 40), b: 10 * R.int(10, 40) }; } while (!gridOk(p)); return p; },
 build: ({ m, k, a, b }) => { const J = (m + 1) * (k + 1), inside = (m - 1) * (k - 1), odd = 2 * (m - 1) + 2 * (k - 1), reps = odd / 2, extra = (m - 1) * a + (k - 1) * b, deg = 4 * inside + 3 * odd + 8, roads = deg / 2; return {
  prompt: `The Rover Depot is resurfacing a grid district of streets ${n(m)} blocks wide (west to east) and ${n(k)} blocks deep (south to north), so it has ${n(J)} street corners. Every west–east road is ${n(a)} metres long and every south–north road is ${n(b)} metres long. First use the handshake rule: add up the number of roads that meet at every corner, then halve the total. Enter how many roads the district has. Then a sweeper must drive every road at least once and finish where it started: enter the fewest roads it must drive twice, and the extra distance those repeats add, in metres (type it without commas).`,
  answer: [roads, reps, extra],
  hints: ['Corners inside the grid have degree 4, the four outer corners have degree 2 and the other edge corners have degree 3. Count how many corners there are of each kind, then add up their degrees.', 'The handshake rule says the degrees add up to twice the number of roads. For the sweeper, the odd corners pair up with their neighbours along the sides of the grid, and each repeated road fixes two of them.'],
  solution: `There are ${n(m - 1)} × ${n(k - 1)} = ${n(inside)} corners inside, each of degree 4; ${n(odd)} edge corners of degree 3 (${n(m - 1)} on each of the south and north sides, ${n(k - 1)} on each of the west and east sides); and 4 outer corners of degree 2. The degrees add up to 4 × ${n(inside)} + 3 × ${n(odd)} + 2 × 4 = ${n(deg)}, so by the handshake rule there are ${n(deg)} ÷ 2 = ${n(roads)} roads. The ${n(odd)} odd corners need at least ${n(odd)} ÷ 2 = ${n(reps)} repeats, and pairing neighbours along each side uses ${n(m - 1)} west–east and ${n(k - 1)} south–north roads. The extra distance is ${n(m - 1)} × ${n(a)} + ${n(k - 1)} × ${n(b)} = ${n(extra)} metres.`,
  guidance: [
   { prompt: `There are ${n(inside)} corners inside the grid with degree 4, ${n(odd)} edge corners with degree 3 and 4 outer corners with degree 2. What do all the degrees add up to?`, answer: [deg], explanation: `4 × ${n(inside)} = ${n(4 * inside)}, 3 × ${n(odd)} = ${n(3 * odd)} and 2 × 4 = 8, and ${n(4 * inside)} + ${n(3 * odd)} + 8 = ${n(deg)}.` },
   { prompt: `By the handshake rule the degrees add up to twice the number of roads. How many roads does the district have?`, answer: [roads], explanation: `${n(deg)} ÷ 2 = ${n(roads)} roads.` },
   { prompt: `The ${n(odd)} odd corners pair up along the sides, which repeats ${n(m - 1)} west–east roads and ${n(k - 1)} south–north roads. How many roads is that, and what extra distance do they add, in metres?`, answer: [reps, extra], explanation: `${n(m - 1)} + ${n(k - 1)} = ${n(reps)} roads, and ${n(m - 1)} × ${n(a)} + ${n(k - 1)} × ${n(b)} = ${n(extra)} metres.` }
  ] }; }
});

/* ---- q12 Trees [O12.10] ---- */

mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'Counting irrigation pipes',
 brief: 'The greenhouse is replumbing its watering system, and the yard has to order the right number of pipe runs for each design.',
 labels: ['pipes in the first tree', 'tanks in the second tree'], tolerance: 0.01,
 gl: [['pipes in the first tree'], ['tanks in the second tree']]
}, {
 /* Not the worked example of q12 (9 domes, 13 cables); the two answers never coincide. */
 canonical: { t: 18, p: 31 },
 draw: R => { let q; do { q = { t: R.int(8, 60), p: R.int(8, 80) }; } while ((q.t === 9 && q.p === 13) || q.t === q.p + 2); return q; },
 build: ({ t, p }) => ({
  prompt: `The greenhouse irrigation system joins ${n(t)} water tanks by pipes. Water can reach every tank from every other one, and no set of pipes forms a loop: the network is a tree. Enter how many pipes it has. After a rebuild the system is still a tree, but it now has ${n(p)} pipes. Enter how many tanks it joins.`,
  answer: [t - 1, p + 1],
  hints: ['Add the tanks one at a time: the first needs no pipe, and every tank after it arrives with exactly one new pipe.', 'So a tree has one pipe fewer than it has tanks, and one tank more than it has pipes.'],
  solution: `Add the tanks one at a time, each joined by one pipe to a tank already in the network. ${n(t)} tanks need ${n(t)} − 1 = ${n(t - 1)} pipes. The other way round, a tree with ${n(p)} pipes has ${n(p)} + 1 = ${n(p + 1)} tanks.`,
  guidance: [
   { prompt: `The first tank needs no pipe, and each of the others comes with one. How many pipes does the tree of ${n(t)} tanks have?`, answer: [t - 1], explanation: `${n(t - 1)} more tanks arrive after the first, each with one pipe, so the tree has ${n(t - 1)} pipes.` },
   { prompt: `A tree has one tank more than it has pipes. How many tanks does the tree with ${n(p)} pipes join?`, answer: [p + 1], explanation: `${n(p)} + 1 = ${n(p + 1)} tanks.` }
  ] })
});

mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Spools in stock',
 brief: 'The yard has a fixed stock of cable spools, and the crew wants to know how far it will stretch.',
 labels: ['spools used', 'spools left', 'domes in the finished tree'], tolerance: 0.01,
 gl: [['spools used'], ['spools left'], ['domes in the finished tree']]
}, {
 canonical: { V: 14, S: 21 },
 draw: R => { const V = R.int(6, 30); return { V, S: V + R.int(3, 15) }; },
 build: ({ V, S }) => { const used = V - 1, left = S - used; return {
  prompt: `The Cable Yard has ${n(S)} spools of cable in stock, and one spool is exactly one cable between two domes. The crew lays a tree network that links ${n(V)} domes, using one spool for each cable. Enter how many spools it uses. Enter how many spools are left. The crew then spends every spare spool on new domes, each joined to the network by exactly one cable, so the network is still a tree. Enter how many domes the finished network links.`,
  answer: [used, left, S + 1],
  hints: ['A tree has one cable fewer than it has domes, so the first network uses that many spools. Subtract that from the stock to see what is spare.', 'A new dome joined by exactly one cable keeps the network a tree. The finished tree has one dome more than it has cables.'],
  solution: `A tree of ${n(V)} domes has ${n(V)} − 1 = ${n(used)} cables, so it uses ${n(used)} spools. That leaves ${n(S)} − ${n(used)} = ${n(left)} spools. Each spare spool brings one new dome, so the finished tree has ${n(V)} + ${n(left)} = ${n(S + 1)} domes. This agrees with the rule that a tree with ${n(S)} cables links ${n(S)} + 1 domes.`,
  guidance: [
   { prompt: `A tree has one cable fewer than it has domes. How many spools does the tree of ${n(V)} domes use?`, answer: [used], explanation: `${n(V)} − 1 = ${n(used)} spools.` },
   { prompt: `The stock is ${n(S)} spools and the first network uses ${n(used)}. How many spools are left?`, answer: [left], explanation: `${n(S)} − ${n(used)} = ${n(left)} spools.` },
   { prompt: `Each of the ${n(left)} spare spools adds one new dome to the tree by one cable. How many domes does the finished tree link?`, answer: [S + 1], explanation: `${n(V)} + ${n(left)} = ${n(S + 1)} domes.` }
  ] }; }
});

mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q08', title: 'Joining separate networks',
 brief: 'Several small cable networks were built apart, and the yard has to tie them into one with as little new cable as it can.',
 labels: ['cables in all', 'new cables', 'cables in the joined network'], tolerance: 0.01,
 gl: [['cables in all'], ['new cables'], ['cables in the joined network']]
}, {
 /* Three to five separate trees of 4 to 30 domes. */
 canonical: { sizes: [12, 9, 21, 15] },
 draw: R => { const c = R.int(3, 5); return { sizes: Array.from({ length: c }, () => R.int(4, 30)) }; },
 build: ({ sizes }) => { const c = sizes.length, total = sum(sizes), have = total - c; return {
  prompt: `The Cable Yard has ${WORD[c]} separate cable networks, and each of them is a tree. They link ${andList(sizes.map(n))} domes. Enter how many cables the networks have between them. The yard then wants every dome to be able to reach every other one, using as few new cables as possible, each new cable joining two domes from different networks. Enter how many new cables it lays. Then enter how many cables the joined network has, which again has no circuit.`,
  answer: [have, c - 1, total - 1],
  hints: ['Each network is a tree, so each has one cable fewer than its domes. Add up the cables of all the networks.', 'Each new cable should join two networks that are not yet joined, so work out how many cables it takes to join all the separate pieces into one. The joined network is a tree on all the domes together.'],
  solution: `Each network is a tree with one cable fewer than its domes: ${sizes.map(s => n(s - 1)).join(' + ')} = ${n(have)} cables. A new cable can join two separate pieces into one, so ${n(c)} pieces need ${n(c)} − 1 = ${n(c - 1)} new cables. The joined network is a tree on all ${n(total)} domes, so it has ${n(total)} − 1 = ${n(total - 1)} cables. As a check, ${n(have)} + ${n(c - 1)} = ${n(total - 1)}.`,
  guidance: [
   { prompt: `Each of the ${n(c)} networks is a tree, with one cable fewer than its domes. How many cables do they have in all?`, answer: [have], explanation: `${sizes.map(s => n(s - 1)).join(' + ')} = ${n(have)} cables.` },
   { prompt: `Each new cable joins two separate pieces into one. How many new cables does it take to join ${n(c)} separate networks into one?`, answer: [c - 1], explanation: `Each cable reduces the number of pieces by one, so ${n(c)} − 1 = ${n(c - 1)} cables.` },
   { prompt: `The joined network is a tree on all ${n(total)} domes. How many cables does it have?`, answer: [total - 1], explanation: `${n(total)} − 1 = ${n(total - 1)} cables, which is ${n(have)} + ${n(c - 1)}.` }
  ] }; }
});

/* ---- q13 Forests and leaves [KT5.1, O12.10] ---- */

mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'Watering lines and dead ends',
 brief: 'The greenhouse is merging its old watering lines into one new supply, and the crew needs a pipe count and a count of taps at the ends.',
 labels: ['pipes in the old lines', 'leaves'], tolerance: 0.01,
 gl: [['pipes in the old lines'], ['pipe-ends at tanks that are not leaves'], ['leaves']]
}, {
 /* Not the worked example of q13 (20 domes in 3 trees; 4 of degree 3, 1 of degree 4). Every count is at least 2. */
 canonical: { v: 36, c: 5, d2: 2, d3: 4, d4: 3 },
 draw: R => { let p; do { const c = R.int(2, 6); p = { v: R.int(3 * c, 3 * c + 30), c, d2: R.int(2, 5), d3: R.int(2, 6), d4: R.int(2, 4) }; } while (p.v === 20 && p.c === 3 && p.d3 === 4 && p.d4 === 1); return p; },
 build: ({ v, c, d2, d3, d4 }) => { const L = 2 + d3 + 2 * d4, S = d2 + d3 + d4, high = 2 * d2 + 3 * d3 + 4 * d4; return {
  prompt: `The greenhouse’s old watering lines form no loops: ${n(v)} water tanks in ${n(c)} separate trees of pipes. Enter how many pipes the old lines have altogether. The new supply is one tree of pipes. In it, ${n(d2)} tanks have 2 pipes, ${n(d3)} tanks have 3 pipes and ${n(d4)} tanks have 4 pipes, and every other tank is a leaf, a dead end with a single pipe. Enter the number of leaves.`,
  answer: [v - c, L],
  hints: ['A tree has one pipe fewer than it has tanks. Over a whole set of separate trees, take away one pipe for each tree.', 'Call the number of leaves L. Write the tanks and the pipes of the new tree in terms of L, then use the handshake rule: the numbers of pipes at the tanks add up to twice the number of pipes.'],
  solution: `Each of the ${n(c)} trees has one pipe fewer than its tanks, so the old lines have ${n(v)} − ${n(c)} = ${n(v - c)} pipes. In the new tree, call the number of leaves L. It has L + ${n(S)} tanks and so L + ${n(S - 1)} pipes. The pipe-ends at the tanks add up to L + ${n(high)}, and by the handshake rule that is twice the pipes, 2L + ${n(2 * (S - 1))}. So L = ${n(high)} − ${n(2 * (S - 1))} = ${n(L)} leaves.`,
  guidance: [
   { prompt: `Each of the ${n(c)} trees has one pipe fewer than its tanks. How many pipes do the old lines have?`, answer: [v - c], explanation: `${n(v)} − ${n(c)} = ${n(v - c)} pipes.` },
   { prompt: `In the new tree, what do the pipe counts of the tanks that are not leaves add up to?`, answer: [high], explanation: `2 × ${n(d2)} + 3 × ${n(d3)} + 4 × ${n(d4)} = ${n(high)}.` },
   { prompt: `With L leaves the tree has L + ${n(S)} tanks and L + ${n(S - 1)} pipes, and the pipe-ends add up to L + ${n(high)}. The handshake rule says L + ${n(high)} = 2 × (L + ${n(S - 1)}). What is L?`, answer: [L], explanation: `L + ${n(high)} = 2L + ${n(2 * (S - 1))}, so L = ${n(high)} − ${n(2 * (S - 1))} = ${n(L)}.` }
  ] }; }
});

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The splitter tree',
 brief: 'A signal line is to be shared by splitting it down a tree of domes, and the crew must order the right number of splitters.',
 labels: ['cables', 'splitters', 'leaves'], tolerance: 0.01,
 gl: [['cables'], ['splitters'], ['leaves']]
}, {
 /* T is even, so that (T − 2) ÷ 2 splitters is a whole number. */
 canonical: { T: 26 },
 draw: R => ({ T: 2 * R.int(5, 40)}),
 build: ({ T }) => { const cab = T - 1, ends = 2 * cab, s = (T - 2) / 2, L = T - s; return {
  prompt: `The Cable Yard is wiring a tree of ${n(T)} domes to share one signal. Every dome is either a leaf, with one cable, or a splitter, with three cables. Enter how many cables the tree uses. Then enter how many of the domes are splitters, and how many are leaves.`,
  answer: [cab, s, L],
  hints: ['A tree has one cable fewer than it has domes. By the handshake rule, the cables counted at every dome add up to twice the number of cables.', 'Call the number of splitters s. The other domes are leaves. Count the cable-ends: 1 for each leaf and 3 for each splitter, and set the total equal to twice the cables.'],
  solution: `A tree of ${n(T)} domes has ${n(T)} − 1 = ${n(cab)} cables, so by the handshake rule the cable-ends add up to 2 × ${n(cab)} = ${n(ends)}. If s of the domes are splitters, the other ${n(T)} − s are leaves, and the cable-ends are (${n(T)} − s) × 1 + s × 3 = ${n(T)} + 2s. So ${n(T)} + 2s = ${n(ends)}, which gives 2s = ${n(T - 2)} and s = ${n(s)} splitters. The leaves are ${n(T)} − ${n(s)} = ${n(L)}.`,
  guidance: [
   { prompt: `A tree has one cable fewer than it has domes. How many cables does the tree of ${n(T)} domes use?`, answer: [cab], explanation: `${n(T)} − 1 = ${n(cab)} cables.` },
   { prompt: `With s splitters, the cable-ends add up to (${n(T)} − s) × 1 + 3 × s = ${n(T)} + 2s, and that equals twice the cables, ${n(ends)}. How many splitters is that?`, answer: [s], explanation: `${n(T)} + 2s = ${n(ends)}, so 2s = ${n(T - 2)} and s = ${n(s)}.` },
   { prompt: `Every dome that is not a splitter is a leaf. How many leaves does the tree have?`, answer: [L], explanation: `${n(T)} − ${n(s)} = ${n(L)} leaves.` }
  ] }; }
});

mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', title: 'Leaves in a larger forest',
 brief: 'The yard’s oldest records show only how many domes have each cable count, and it wants the leaves, domes and cables of the whole old forest.',
 labels: ['leaves', 'domes', 'cables'], tolerance: 0.01,
 gl: [['degree total of the non-leaves'], ['leaves'], ['domes', 'cables']]
}, {
 /* A forest instead of one tree, with degrees up to 5. Each tree has at least two domes, so no dome has degree 0.
    Leaves L = 2c + d3 + 2·d4 + 3·d5. Not the worked example of q13. */
 canonical: { c: 3, d2: 3, d3: 4, d4: 2, d5: 2 },
 draw: R => ({ c: R.int(2, 5), d2: R.int(2, 5), d3: R.int(2, 5), d4: R.int(2, 4), d5: R.int(2, 3) }),
 build: ({ c, d2, d3, d4, d5 }) => { const S = d2 + d3 + d4 + d5, high = 2 * d2 + 3 * d3 + 4 * d4 + 5 * d5, L = high - 2 * (S - c), dom = L + S, cab = dom - c; return {
  prompt: `The Cable Yard’s oldest network is a forest of ${n(c)} trees, and every tree has at least two domes. Across the whole forest, ${n(d2)} domes have degree 2, ${n(d3)} have degree 3, ${n(d4)} have degree 4 and ${n(d5)} have degree 5, and every other dome is a leaf. Enter the number of leaves, then the number of domes, then the number of cables in the forest.`,
  answer: [L, dom, cab],
  hints: ['A forest has one cable fewer than its domes for each tree in it. Call the leaves L and write the domes and the cables in terms of L.', 'The degrees add up to twice the cables (the handshake rule). Each leaf counts 1; the other domes count 2, 3, 4 or 5 each.'],
  solution: `Call the leaves L. The other domes number ${n(S)}, so the forest has L + ${n(S)} domes and L + ${n(S)} − ${n(c)} = L + ${n(S - c)} cables. The degrees add up to L + 2 × ${n(d2)} + 3 × ${n(d3)} + 4 × ${n(d4)} + 5 × ${n(d5)} = L + ${n(high)}, and by the handshake rule that is 2 × (L + ${n(S - c)}) = 2L + ${n(2 * (S - c))}. So L = ${n(high)} − ${n(2 * (S - c))} = ${n(L)} leaves. The forest has ${n(L)} + ${n(S)} = ${n(dom)} domes and ${n(dom)} − ${n(c)} = ${n(cab)} cables.`,
  guidance: [
   { prompt: `What do the degrees of the domes that are not leaves add up to?`, answer: [high], explanation: `2 × ${n(d2)} + 3 × ${n(d3)} + 4 × ${n(d4)} + 5 × ${n(d5)} = ${n(2 * d2)} + ${n(3 * d3)} + ${n(4 * d4)} + ${n(5 * d5)} = ${n(high)}.` },
   { prompt: `With L leaves, the forest has L + ${n(S)} domes and L + ${n(S - c)} cables, and the degrees add up to L + ${n(high)}. The handshake rule says L + ${n(high)} = 2 × (L + ${n(S - c)}). What is L?`, answer: [L], explanation: `L + ${n(high)} = 2L + ${n(2 * (S - c))}, so L = ${n(high)} − ${n(2 * (S - c))} = ${n(L)}.` },
   { prompt: `With ${n(L)} leaves, how many domes does the forest have, and how many cables?`, answer: [dom, cab], explanation: `Domes: ${n(L)} + ${n(S)} = ${n(dom)}. Cables: ${n(dom)} − ${n(c)} = ${n(cab)}, one fewer than the domes for each of the ${n(c)} trees.` }
  ] }; }
});

/* ---- q14 Spanning trees [O12.10] ---- */

mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The main radio chain',
 brief: 'The yard’s relay masts talk to each other over many direct links, and the crew wants a single main chain that reaches every mast.',
 labels: ['links kept', 'spare links'], tolerance: 0.01,
 gl: [['masts', 'links'], ['links kept'], ['spare links']]
}, {
 /* Not the network of the q14 worked example (that one has 5 domes and 8 tunnels, with no list). */
 canonical: { V: 8, edges: sortEdges([[1, 2], [1, 5], [2, 3], [2, 6], [3, 4], [3, 7], [4, 8], [5, 6], [6, 7], [6, 8], [7, 8], [4, 7]]) },
 draw: R => { const V = R.int(6, 9); return { V, edges: connected(R, V, V + R.int(2, 6)) }; },
 build: ({ V, edges }) => { const E = edges.length; return {
  prompt: `The Cable Yard’s radio network has relay masts 1 to ${n(V)} and these direct links: ${plain(edges)}. Every mast can reach every other one along the links. The crew will keep a spanning tree of the links as the main chain, and every other link is a spare. Enter how many links the main chain keeps, then how many spare links there are.`,
  answer: [V - 1, E - V + 1],
  hints: ['The main chain is a spanning tree: it reaches every mast and has no circuit, so it keeps one link fewer than there are masts.', 'Count all the links in the list. The spares are all the links that the main chain does not keep.'],
  solution: `The network has ${n(V)} masts and ${n(E)} links. A spanning tree reaches all ${n(V)} masts and is a tree, so it keeps ${n(V)} − 1 = ${n(V - 1)} links. The other ${n(E)} − ${n(V - 1)} = ${n(E - V + 1)} links are spares: each one would close a circuit.`,
  guidance: [
   { prompt: `Count the masts and the links in the list. How many of each are there?`, answer: [V, E], explanation: `The masts are numbered 1 to ${n(V)}, and the list has ${n(E)} pairs.` },
   { prompt: `The main chain is a tree that reaches all ${n(V)} masts. How many links does it keep?`, answer: [V - 1], explanation: `A tree has one link fewer than its masts: ${n(V)} − 1 = ${n(V - 1)}.` },
   { prompt: `How many of the ${n(E)} links are spares?`, answer: [E - V + 1], explanation: `${n(E)} − ${n(V - 1)} = ${n(E - V + 1)}. Whichever spanning tree is chosen, this number is the same.` }
  ] }; }
});

mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Costing the main cable',
 brief: 'The survey team has counted a district’s domes and tunnels but not drawn the map, and the yard must still order cable for it.',
 labels: ['tunnels with cable', 'tunnels with a hatch', 'metres of cable'], tolerance: 0.01,
 gl: [['tunnels with cable'], ['tunnels with a hatch'], ['metres of cable']]
}, {
 canonical: { V: 20, E: 29, L: 250 },
 draw: R => { const V = R.int(8, 40); return { V, E: V + R.int(3, 15), L: R.pick([120, 150, 180, 200, 250, 300]) }; },
 build: ({ V, E, L }) => { const keep = V - 1, out = E - V + 1, m = keep * L; return {
  prompt: `A survey of a Cable Yard district found ${n(V)} domes and ${n(E)} tunnels, and every dome can reach every other one through the tunnels. Every tunnel is ${n(L)} metres long. The crew will lay cable along a spanning tree of the tunnels, and every other tunnel will be sealed with a hatch. Enter how many tunnels get cable, how many get a hatch, and how many metres of cable are laid (type it without commas).`,
  answer: [keep, out, m],
  hints: ['A spanning tree is a tree on all the domes, so it uses one tunnel fewer than there are domes. The tunnels it leaves out are all the others.', 'Cable runs only along the tunnels of the tree, and every tunnel has the same length.'],
  solution: `A spanning tree on ${n(V)} domes uses ${n(V)} − 1 = ${n(keep)} tunnels, so ${n(E)} − ${n(keep)} = ${n(out)} tunnels get a hatch. Cable runs along the ${n(keep)} tunnels of the tree, ${n(keep)} × ${n(L)} = ${n(m)} metres.`,
  guidance: [
   { prompt: `A spanning tree is a tree on all ${n(V)} domes. How many tunnels does it use?`, answer: [keep], explanation: `One fewer than the domes: ${n(V)} − 1 = ${n(keep)}.` },
   { prompt: `There are ${n(E)} tunnels in all. How many are left without cable and get a hatch?`, answer: [out], explanation: `${n(E)} − ${n(keep)} = ${n(out)}.` },
   { prompt: `Each of the ${n(keep)} tunnels with cable is ${n(L)} metres long. How many metres of cable are laid?`, answer: [m], explanation: `${n(keep)} × ${n(L)} = ${n(m)} metres.` }
  ] }; }
});

mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q02', title: 'Every dome has the same tunnels',
 brief: 'The newest district was built so that every dome has the same number of tunnels, and the yard wants its cable plan without a map.',
 labels: ['tunnels in the district', 'tunnels used', 'tunnels left out'], tolerance: 0.01,
 gl: [['sum of degrees'], ['tunnels in the district'], ['tunnels used', 'tunnels left out']]
}, {
 /* r tunnels at every dome, V × r even, V larger than r; such a connected network exists. */
 canonical: { V: 12, r: 5 },
 draw: R => { let p; do { p = { V: R.int(8, 30), r: R.int(3, 6) }; } while ((p.V * p.r) % 2 !== 0); return p; },
 build: ({ V, r }) => { const deg = V * r, E = deg / 2; return {
  prompt: `In the Cable Yard’s newest district there are ${n(V)} domes, every dome has exactly ${n(r)} tunnels, and every dome can reach every other one. Use the handshake rule to find how many tunnels the district has, and enter that number. The crew then lays cable along a spanning tree of the tunnels: enter how many tunnels it uses, then how many it leaves without cable.`,
  answer: [E, V - 1, E - V + 1],
  hints: ['Every dome has the same degree, so the degrees add up to the number of domes times that degree. The handshake rule says that total is twice the number of tunnels.', 'A spanning tree keeps one tunnel fewer than there are domes, and leaves out all the rest.'],
  solution: `The degrees add up to ${n(V)} × ${n(r)} = ${n(deg)}, so by the handshake rule the district has ${n(deg)} ÷ 2 = ${n(E)} tunnels. A spanning tree keeps ${n(V)} − 1 = ${n(V - 1)} of them and leaves out ${n(E)} − ${n(V - 1)} = ${n(E - V + 1)}.`,
  guidance: [
   { prompt: `All ${n(V)} domes have degree ${n(r)}. What do the degrees add up to?`, answer: [deg], explanation: `${n(V)} × ${n(r)} = ${n(deg)}.` },
   { prompt: `By the handshake rule the degrees add up to twice the number of tunnels. How many tunnels does the district have?`, answer: [E], explanation: `${n(deg)} ÷ 2 = ${n(E)} tunnels.` },
   { prompt: `A spanning tree keeps one tunnel fewer than there are domes. How many tunnels does it use, and how many does it leave out?`, answer: [V - 1, E - V + 1], explanation: `${n(V)} − 1 = ${n(V - 1)} used, and ${n(E)} − ${n(V - 1)} = ${n(E - V + 1)} left out.` }
  ] }; }
});

/* ---- q15 Counting spanning trees [O12.10] ---- */

mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'Pipelines between the pumps',
 brief: 'The greenhouse has a pump link and a water ring, and the crew wants to know how many ways each could be cut back to a minimum of pipe.',
 labels: ['spanning trees of the pump network', 'spanning trees of the ring'], tolerance: 0.01,
 gl: [['pipes left out'], ['spanning trees of the pump network'], ['spanning trees of the ring']]
}, {
 /* Not the worked example of q15 (ring of 6; routes of 2, 3 and 4 cables); the answers never coincide. */
 canonical: { r: 9, a: 2, b: 4, c: 3 },
 draw: R => { let p; do { p = { r: R.int(4, 30), a: R.int(2, 6), b: R.int(2, 6), c: R.int(2, 6) }; } while ((p.r === 6 && [p.a, p.b, p.c].sort().join() === '2,3,4') || p.r === p.a * p.b + p.b * p.c + p.c * p.a); return p; },
 build: ({ r, a, b, c }) => { const V = a + b + c - 1, E = a + b + c, T = a * b + b * c + c * a; return {
  prompt: `Two pump stations in the greenhouse are joined by three separate pipelines that meet only at the stations: one of ${n(a)} pipes, one of ${n(b)} pipes and one of ${n(c)} pipes, with a junction between each pair of pipes in a pipeline. Enter how many different spanning trees this network has. The water loop around the nursery is ${n(r)} tanks joined in a single ring by ${n(r)} pipes. Enter how many different spanning trees the loop has.`,
  answer: [T, r],
  hints: ['Work out how many pipes a spanning tree leaves out (the pipes, minus the places they join, plus one, where the places are the junctions and the two stations), then which choices of those pipes keep every junction joined.', 'In a ring any one pipe may be left out. In the pump network, the pipes left out must come from different pipelines: two from the same pipeline cut off the junctions between them.'],
  solution: `The pump network has ${n(V)} junctions in all, counting the two stations, and ${n(E)} pipes, so a spanning tree keeps ${n(V - 1)} pipes and leaves out ${n(E)} − ${n(V - 1)} = 2. They must come from two different pipelines. The choices are ${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(a * b)} + ${n(b * c)} + ${n(c * a)} = ${n(T)} spanning trees. The ring has ${n(r)} tanks and ${n(r)} pipes, so a spanning tree leaves out exactly one pipe, and any of the ${n(r)} will do: ${n(r)} spanning trees.`,
  guidance: [
   { prompt: `The pump network has ${n(V)} places where pipes meet (the junctions and the two stations) and ${n(E)} pipes. How many pipes does a spanning tree leave out?`, answer: [2], explanation: `A spanning tree keeps ${n(V)} − 1 = ${n(V - 1)} pipes, so it leaves out ${n(E)} − ${n(V - 1)} = 2.` },
   { prompt: `The two pipes left out must come from different pipelines. How many ways are there to choose them?`, answer: [T], explanation: `Pipelines of ${n(a)} and ${n(b)}: ${n(a * b)} ways; ${n(b)} and ${n(c)}: ${n(b * c)}; ${n(c)} and ${n(a)}: ${n(c * a)}. In all ${n(T)}.` },
   { prompt: `The ring has ${n(r)} tanks and ${n(r)} pipes. How many spanning trees does it have?`, answer: [r], explanation: `A spanning tree leaves out exactly one pipe, and any one of the ${n(r)} pipes will do, so there are ${n(r)}.` }
  ] }; }
});

mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Checking every plan',
 brief: 'The yard insists on checking every possible cabling plan for two districts before any cable is laid, and the planners want to know how long that takes.',
 labels: ['plans for the ring', 'plans for the west network', 'total minutes'], tolerance: 0.01,
 gl: [['plans for the ring'], ['plans for the west network'], ['total minutes']]
}, {
 /* Not the worked example of q15 (ring of 6; routes of 2, 3 and 4 cables). */
 canonical: { r: 10, a: 3, b: 4, c: 2, m: 4 },
 draw: R => { let p; do { p = { r: R.int(4, 30), a: R.int(2, 6), b: R.int(2, 6), c: R.int(2, 6), m: R.int(2, 5) }; } while (p.r === 6 && [p.a, p.b, p.c].sort().join() === '2,3,4'); return p; },
 build: ({ r, a, b, c, m }) => { const T = a * b + b * c + c * a, mins = (r + T) * m; return {
  prompt: `Before any cable is laid, the Cable Yard checks every possible spanning tree of each of two networks, and each check takes ${n(m)} minutes. The east network is a ring of ${n(r)} domes joined in a loop by ${n(r)} cables. The west network is two hub domes joined by three separate routes that meet only at the hubs, of ${n(a)}, ${n(b)} and ${n(c)} cables, with a dome between each pair of cables in a route. Enter how many spanning trees the ring has, how many the west network has, and the total number of minutes needed to check all of them.`,
  answer: [r, T, mins],
  hints: ['A spanning tree leaves out as many cables as it takes to break every circuit. In a ring that is one cable, and any one will do.', 'In the west network, a spanning tree leaves out two cables, one from each of two different routes. Add the plans of both networks, then multiply by the minutes per check.'],
  solution: `The ring has ${n(r)} cables, and a spanning tree leaves out exactly one of them, so it has ${n(r)} spanning trees. The west network has two cables left out, from two different routes: ${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(a * b)} + ${n(b * c)} + ${n(c * a)} = ${n(T)} spanning trees. In all there are ${n(r)} + ${n(T)} = ${n(r + T)} plans, and ${n(r + T)} × ${n(m)} = ${n(mins)} minutes.`,
  guidance: [
   { prompt: `The ring has ${n(r)} domes and ${n(r)} cables. How many spanning trees does it have?`, answer: [r], explanation: `A spanning tree leaves out exactly one cable, and any of the ${n(r)} will do.` },
   { prompt: `In the west network a spanning tree leaves out two cables, from two different routes. How many spanning trees does it have?`, answer: [T], explanation: `${n(a)} × ${n(b)} + ${n(b)} × ${n(c)} + ${n(c)} × ${n(a)} = ${n(a * b)} + ${n(b * c)} + ${n(c * a)} = ${n(T)}.` },
   { prompt: `Each plan takes ${n(m)} minutes to check. How many minutes do all ${n(r)} + ${n(T)} plans take?`, answer: [mins], explanation: `${n(r + T)} × ${n(m)} = ${n(mins)} minutes.` }
  ] }; }
});

mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q14', title: 'Three loops, one junction',
 brief: 'Three cable loops meet at one junction dome, and the yard wants every way of cutting them back to a single tree.',
 labels: ['domes', 'cables left out', 'spanning trees'], tolerance: 0.01,
 gl: [['domes'], ['cables left out'], ['spanning trees']]
}, {
 /* Three loops of r1, r2, r3 domes (each counting the junction dome, at least 3) that share only that dome:
    r1 + r2 + r3 − 2 domes, r1 + r2 + r3 cables, so 3 cables are left out, one from each loop: r1 × r2 × r3 spanning trees. */
 canonical: { p: 5, q: 7, s: 4 },
 draw: R => ({ p: R.int(3, 12), q: R.int(3, 12), s: R.int(3, 12) }),
 build: ({ p, q, s }) => { const V = p + q + s - 2, E = p + q + s, T = p * q * s; return {
  prompt: `Three loops of cable meet at one junction dome. The first loop has ${n(p)} domes, the second ${n(q)} and the third ${n(s)}, counting the junction dome in each, and the loops share no other dome. Each loop has as many cables as domes. Enter how many domes the whole network has. Enter how many cables a spanning tree leaves out. Then enter how many different spanning trees the network has (type it without commas).`,
  answer: [V, 3, T],
  hints: ['The junction dome is counted once in each loop, so it is counted too many times when you add the three loops’ domes. Count the cables the same way: each loop has its own.', 'The number of cables to leave out is cables minus domes plus one. Each loop is a circuit, so each loop must lose at least one cable; see what that leaves for the choices.'],
  solution: `Adding the three loops counts the junction dome three times, so the network has ${n(p)} + ${n(q)} + ${n(s)} − 2 = ${n(V)} domes. It has ${n(p)} + ${n(q)} + ${n(s)} = ${n(E)} cables, so a spanning tree keeps ${n(V - 1)} and leaves out ${n(E)} − ${n(V - 1)} = 3. Each of the three loops is a circuit, so each must lose at least one cable, and with only 3 to leave out, each loses exactly one. Any one cable of a loop will do, so the choices are ${n(p)} × ${n(q)} × ${n(s)} = ${n(T)} spanning trees.`,
  guidance: [
   { prompt: `The junction dome is counted in all three loops, so adding ${n(p)} + ${n(q)} + ${n(s)} counts it three times. How many domes does the network have?`, answer: [V], explanation: `${n(p)} + ${n(q)} + ${n(s)} = ${n(E)}, and the junction dome is counted two times too many: ${n(E)} − 2 = ${n(V)} domes.` },
   { prompt: `The network has ${n(V)} domes and ${n(E)} cables. How many cables does a spanning tree leave out?`, answer: [3], explanation: `A spanning tree keeps ${n(V)} − 1 = ${n(V - 1)} cables, so it leaves out ${n(E)} − ${n(V - 1)} = 3.` },
   { prompt: `Each of the three loops must lose exactly one cable, and any one will do. How many different spanning trees are there?`, answer: [T], explanation: `${n(p)} choices for the first loop, ${n(q)} for the second and ${n(s)} for the third: ${n(p)} × ${n(q)} × ${n(s)} = ${n(T)}.` }
  ] }; }
});

})();
