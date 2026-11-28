/* Graph theory: networks practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p2.js. */
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

/* ---- Text and graph helpers (a network is V vertices 1..V and E, a sorted list of edges [a, b] with a < b) ---- */
const edgeText = E => E.map(([a, b]) => `${n(a)}–${n(b)}`).join(', ');
const and = xs => { const s = xs.map(x => typeof x === 'number' ? n(x) : x); return s.length < 2 ? s.join('') : `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`; };
const semi = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join('; ')}; and ${xs[xs.length - 1]}`;
const count = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
const named = (xs, noun) => `${noun}${xs.length === 1 ? '' : 's'} ${and(xs)}`;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const sortE = E => E.map(([a, b]) => a < b ? [a, b] : [b, a]).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
const nbrs = (V, E) => { const A = Array.from({ length: V + 1 }, () => []); for (const [a, b] of E) { A[a].push(b); A[b].push(a); } A.forEach(l => l.sort((x, y) => x - y)); return A; };
const degs = (V, E) => nbrs(V, E).map(l => l.length);
const has = (E, a, b) => E.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const pairs = V => { const P = []; for (let a = 1; a <= V; a++) for (let b = a + 1; b <= V; b++) P.push([a, b]); return P; };
const shuffle = (R, xs) => { const s = xs.slice(); for (let i = s.length - 1; i > 0; i--) { const j = R.int(0, i), t = s[i]; s[i] = s[j]; s[j] = t; } return s; };
const randGraph = (R, V, m) => sortE(shuffle(R, pairs(V)).slice(0, m));
/* A random connected graph: a random spanning tree, then `extra` more random edges. */
const connGraph = (R, V, extra) => {
 const order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), E = [];
 for (let i = 1; i < V; i++) E.push([order[i], order[R.int(0, i - 1)]]);
 const rest = shuffle(R, pairs(V).filter(([a, b]) => !has(E, a, b)));
 return sortE(E.concat(rest.slice(0, extra)));
};
/* Distances from s by rings; unreachable vertices get −1. */
const rings = (V, E, s) => { const A = nbrs(V, E), d = Array(V + 1).fill(-1); d[s] = 0; let front = [s];
 while (front.length) { const next = []; for (const x of front) for (const y of A[x]) if (d[y] < 0) { d[y] = d[x] + 1; next.push(y); } front = next; }
 return d; };
const components = (V, E) => { const seen = Array(V + 1).fill(false), out = [];
 for (let s = 1; s <= V; s++) if (!seen[s]) { const d = rings(V, E, s), c = []; for (let v = 1; v <= V; v++) if (d[v] >= 0) { seen[v] = true; c.push(v); } out.push(c); }
 return out; };
const connected = (V, E) => components(V, E).length === 1;
const odds = (V, E) => { const d = degs(V, E), o = []; for (let v = 1; v <= V; v++) if (d[v] % 2) o.push(v); return o; };
const degList = (V, E) => { const d = degs(V, E); return Array.from({ length: V }, (_, i) => `deg(${n(i + 1)}) = ${n(d[i + 1])}`); };
/* A connected graph on V vertices with exactly k odd-degree vertices (k even), or null. */
const withOdd = (R, V, extra, k) => { let E = connGraph(R, V, extra);
 for (let guard = 0; guard < 40; guard++) { const o = shuffle(R, odds(V, E)); if (o.length === k) return E; if (o.length < k) return null;
  const [a, b] = o; const F = has(E, a, b) ? E.filter(([x, y]) => !((x === a && y === b) || (x === b && y === a))) : sortE(E.concat([[a, b]]));
  if (connected(V, F)) E = F; }
 return null; };
const until = (make, ok) => { for (;;) { const p = make(); if (p && ok(p)) return p; } };
/* V vertices split at random into c groups, each joined inside by a random tree (and sometimes one more edge); labels shuffled. */
const groupsGraph = (R, V, c) => { const order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)),
 cuts = shuffle(R, Array.from({ length: V - 1 }, (_, i) => i + 1)).slice(0, c - 1).sort((x, y) => x - y), bounds = [0].concat(cuts, [V]), E = [];
 for (let g = 0; g < c; g++) { const part = order.slice(bounds[g], bounds[g + 1]);
  for (let i = 1; i < part.length; i++) E.push([part[i], part[R.int(0, i - 1)]]);
  if (part.length >= 4 && R.bool()) { const a = part[0], b = part[part.length - 1]; if (!has(E, a, b)) E.push([a, b]); } }
 return sortE(E); };
const common = (A, u, v) => A[u].filter(x => A[v].includes(x));

/* ---- q06 Walks, trails and paths [O12.4] ---- */

/* Walks of length 2 from u to v (common neighbours), and paths of length 2 that END at v (each neighbour w of v, then the
   neighbours of w other than v). Not the worked example (5 vertices) and not the learn mission (7 domes, u = 1, v = 6). */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'Pulses on the junction grid',
 brief: 'Test pulses run along the survey table’s power cables, and Mira wants the two-step journeys counted before she fits the relays.',
 labels: ['walks of length 2', 'paths of length 2 ending at the second junction'], tolerance: 0.01,
 gl: [['walks of length 2'], ['paths of length 2 ending at the second junction']]
}, {
 canonical: { V: 7, E: [[1, 2], [1, 4], [1, 6], [2, 3], [2, 5], [3, 4], [3, 6], [4, 7], [5, 6], [5, 7], [6, 7]], u: 3, v: 5 },
 draw: R => until(() => { const V = R.int(6, 8), u = R.int(1, V); return { V, E: randGraph(R, V, R.int(V + 2, 2 * V)), u, v: R.except(1, V, [u]) }; },
  p => { const A = nbrs(p.V, p.E), Nv = A[p.v]; return Nv.length >= 3 && common(A, p.u, p.v).length >= 2 && sum(Nv.map(w => A[w].length - 1)) >= 3; }),
 build: ({ V, E, u, v }) => { const A = nbrs(V, E), Nu = A[u], Nv = A[v], C = common(A, u, v), each = Nv.map(w => A[w].length - 1), P = sum(each); return {
  prompt: `Mira’s survey table shows ${n(V)} power junctions, numbered 1 to ${n(V)}, joined by these cables: ${edgeText(E)}. A test pulse moves along one cable at each step and may use the same cable more than once. Enter the number of walks of length 2 from junction ${n(u)} to junction ${n(v)}, then the number of paths of length 2 that end at junction ${n(v)}.`,
  answer: [C.length, P],
  hints: ['A walk of length two has exactly one junction in the middle, and that junction must be next to both ends.', 'A path of length two that ends at v comes from a neighbour w of v, and its first junction is a neighbour of w other than v, so that no junction is used twice.'],
  solution: `Junction ${n(u)} has neighbours ${and(Nu)}, and junction ${n(v)} has neighbours ${and(Nv)}. The common neighbours are ${and(C)}, so there are ${count(C.length, 'walk', 'walks')} of length 2 from ${n(u)} to ${n(v)}. For the paths that end at ${n(v)}, each neighbour w of junction ${n(v)} gives one path for each neighbour of w other than ${n(v)}: ${and(Nv.map((w, i) => `junction ${n(w)} gives ${n(each[i])}`))}. That makes ${each.map(n).join(' + ')} = ${n(P)} paths.`,
  guidance: [
   { prompt: `List the neighbours of junction ${n(u)} and of junction ${n(v)}. How many junctions are on both lists?`, answer: [C.length], explanation: `Junction ${n(u)}: ${and(Nu)}. Junction ${n(v)}: ${and(Nv)}. Both lists contain ${and(C)}, and each of these gives one walk ${n(u)}, w, ${n(v)}.` },
   { prompt: `For each neighbour of junction ${n(v)} (${and(Nv)}), count its neighbours other than junction ${n(v)}, and add the counts. How many paths of length 2 end at junction ${n(v)}?`, answer: [P], explanation: `${each.map(n).join(' + ')} = ${n(P)}. Leaving out junction ${n(v)} itself keeps out walks such as ${n(v)}, ${n(Nv[0])}, ${n(v)}, which would visit a junction twice.` }
  ] }; }
});

/* Routes u, w, v for each common neighbour w; parcels per shift = routes × per-route load; shifts = order ÷ that. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The two-hop parcel order',
 brief: 'A large parcel order has to cross the domes by two-hop courier routes, and Mira needs to know how many shifts it will take.',
 labels: ['two-hop routes', 'shifts needed'], tolerance: 0.01,
 gl: [['two-hop routes'], ['parcels per shift'], ['shifts needed']]
}, {
 canonical: { V: 8, E: [[1, 2], [1, 3], [1, 5], [2, 4], [2, 6], [3, 4], [3, 7], [4, 8], [5, 6], [5, 8], [6, 7], [7, 8]], u: 1, v: 4, m: 6, s: 3 },
 /* connGraph keeps every dome on at least one tunnel (a random edge list could leave a dome with none). */
 draw: R => until(() => { const V = R.int(7, 8), u = R.int(1, V); return { V, E: connGraph(R, V, R.int(3, V + 1)), u, v: R.except(1, V, [u]), m: R.int(3, 9), s: R.int(2, 6) }; },
  p => common(nbrs(p.V, p.E), p.u, p.v).length >= 2),
 build: ({ V, E, u, v, m, s }) => { const A = nbrs(V, E), C = common(A, u, v), k = C.length, per = k * m, P = per * s; return {
  prompt: `The Map Room has ${n(V)} domes, numbered 1 to ${n(V)}, joined by these tunnels: ${edgeText(E)}. Couriers carry parcels from dome ${n(u)} to dome ${n(v)} in exactly two hops, calling at one dome in between, and each different middle dome makes a different route. One route carries ${n(m)} parcels in each shift. An order of ${n(P)} parcels is sent using every route in every shift. Enter the number of two-hop routes from dome ${n(u)} to dome ${n(v)}, then the number of shifts the order takes.`,
  answer: [k, s],
  hints: ['A two-hop route from one dome to another is a walk of length two, so its middle dome is a neighbour of both ends.', 'All the routes run together in a shift, so the parcels carried in one shift are the number of routes times the load of one route; the order is then shared out in whole shifts of that size.'],
  solution: `Dome ${n(u)} has neighbours ${and(A[u])} and dome ${n(v)} has neighbours ${and(A[v])}. The common neighbours are ${and(C)}, so there are ${count(k, 'route', 'routes')}. Together they carry ${n(k)} × ${n(m)} = ${n(per)} parcels in a shift, so ${n(P)} ÷ ${n(per)} = ${n(s)} shifts.`,
  guidance: [
   { prompt: `List the neighbours of dome ${n(u)} and of dome ${n(v)}. How many domes are on both lists, and so how many two-hop routes are there?`, answer: [k], explanation: `Dome ${n(u)}: ${and(A[u])}. Dome ${n(v)}: ${and(A[v])}. The domes on both lists are ${and(C)}, and each is the middle of one route.` },
   { prompt: `Each route carries ${n(m)} parcels in a shift, and every route is used. How many parcels does the whole network carry in one shift?`, answer: [per], explanation: `${n(k)} routes × ${n(m)} parcels = ${n(per)} parcels in one shift.` },
   { prompt: `The order is ${n(P)} parcels. How many shifts does it take at that rate?`, answer: [s], explanation: `${n(P)} ÷ ${n(per)} = ${n(s)} shifts.` }
  ] }; }
});

/* Walks of length 2 from u to v; all walks of length 2 starting at u (sum of the degrees of u's neighbours, a walk may
   return along its own tunnel); paths of length 2 starting at u (that total minus deg u). Harder: 9–10 domes. */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q02', title: 'Everything two tunnels away',
 brief: 'Mira is sizing the relay load on a bigger tunnel map and wants every two-step journey from one dome counted.',
 labels: ['walks of length 2 between the two domes', 'walks of length 2 from the first dome', 'paths of length 2 from the first dome'], tolerance: 0.01,
 gl: [['walks of length 2 between the two domes'], ['walks of length 2 from the first dome'], ['paths of length 2 from the first dome']]
}, {
 canonical: { V: 9, E: [[1, 2], [1, 4], [1, 6], [2, 3], [2, 5], [3, 6], [3, 8], [4, 5], [4, 7], [5, 8], [5, 9], [6, 9], [7, 8], [8, 9]], u: 2, v: 4 },
 draw: R => until(() => { const V = R.int(9, 10), u = R.int(1, V); return { V, E: randGraph(R, V, R.int(V + 3, 2 * V)), u, v: R.except(1, V, [u]) }; },
  p => { const A = nbrs(p.V, p.E); return A[p.u].length >= 3 && common(A, p.u, p.v).length >= 2; }),
 build: ({ V, E, u, v }) => { const A = nbrs(V, E), Nu = A[u], C = common(A, u, v), each = Nu.map(w => A[w].length), T = sum(each), P = T - Nu.length; return {
  prompt: `Mira’s tunnel map has grown to ${n(V)} domes, numbered 1 to ${n(V)}, joined by these tunnels: ${edgeText(E)}. A walk of length 2 may go straight back along the tunnel it came by. Enter, in this order: the number of walks of length 2 from dome ${n(u)} to dome ${n(v)}; the number of walks of length 2 that start at dome ${n(u)}, whichever dome they end at; and the number of paths of length 2 that start at dome ${n(u)}.`,
  answer: [C.length, T, P],
  hints: ['A walk of length two from the start goes to a neighbour w and then along any tunnel at w, including the one it came by, so each neighbour w contributes its degree.', 'A path may not return to the start, so from the total number of walks remove those that go back to the start.'],
  solution: `Dome ${n(u)} has neighbours ${and(Nu)}, and dome ${n(v)} has neighbours ${and(A[v])}. The common neighbours are ${and(C)}, so there are ${count(C.length, 'walk', 'walks')} from ${n(u)} to ${n(v)}. Each neighbour w of dome ${n(u)} starts one walk for each tunnel at w, which is its degree: ${and(Nu.map((w, i) => `dome ${n(w)} gives ${n(each[i])}`))}. That is ${each.map(n).join(' + ')} = ${n(T)} walks. A path cannot return to dome ${n(u)}, and each of the ${n(Nu.length)} neighbours has exactly one tunnel back, so there are ${n(T)} − ${n(Nu.length)} = ${n(P)} paths.`,
  guidance: [
   { prompt: `List the neighbours of dome ${n(u)} and of dome ${n(v)}. How many domes are on both lists?`, answer: [C.length], explanation: `Dome ${n(u)}: ${and(Nu)}. Dome ${n(v)}: ${and(A[v])}. Both lists contain ${and(C)}.` },
   { prompt: `For each neighbour of dome ${n(u)} (${and(Nu)}), count all the tunnels at that dome, and add the counts. How many walks of length 2 start at dome ${n(u)}?`, answer: [T], explanation: `${each.map(n).join(' + ')} = ${n(T)}: every tunnel at a neighbour is a possible second step, including the one back to dome ${n(u)}.` },
   { prompt: `Each of the ${n(Nu.length)} neighbours of dome ${n(u)} has one tunnel back to it, and a path may not use it. How many paths of length 2 start at dome ${n(u)}?`, answer: [P], explanation: `${n(T)} − ${n(Nu.length)} = ${n(P)} paths.` }
  ] }; }
});

/* ---- q07 Distance [O12.4, KT5.1, KT12.3] ---- */

/* Distance u to v and the number of posts at distance exactly 2 from u. Not the worked example (6 vertices). */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The tanker’s post-to-post run',
 brief: 'A water tanker serves the depot’s supply posts, and the driver wants to know how many tracks one far post is from the tank farm.',
 labels: ['distance to the far post', 'posts at distance 2'], tolerance: 0.01,
 gl: [['posts at distance 2'], ['distance to the far post']]
}, {
 canonical: { V: 8, E: [[1, 2], [1, 5], [2, 3], [3, 4], [4, 6], [5, 6], [5, 7], [6, 8], [7, 8]], u: 1, v: 4 },
 draw: R => until(() => { const V = R.int(7, 9), E = connGraph(R, V, R.int(1, 3)), u = R.int(1, V), d = rings(V, E, u), far = []; for (let x = 1; x <= V; x++) if (d[x] >= 3) far.push(x);
  return far.length ? { V, E, u, v: R.pick(far) } : null; }, p => rings(p.V, p.E, p.u).filter(x => x === 2).length >= 2),
 build: ({ V, E, u, v }) => { const d = rings(V, E, u), top = d[v], lines = [], at = r => { const a = []; for (let x = 1; x <= V; x++) if (d[x] === r) a.push(x); return a; };
  for (let r = 1; r <= top; r++) lines.push(`ring ${n(r)} is ${named(at(r), 'post')}`); const two = at(2); return {
  prompt: `A water tanker serves ${n(V)} supply posts, numbered 1 to ${n(V)}, linked by these tracks: ${edgeText(E)}. Enter the distance from post ${n(u)}, the tank farm, to post ${n(v)}, then the number of posts that are at distance exactly 2 from post ${n(u)}.`,
  answer: [d[v], two.length],
  hints: ['Work outwards from the tank farm in rings: its neighbours are the first ring, and each next ring is the posts not yet reached that are next to the ring before.', 'The posts at distance exactly two are those in the second ring, and the distance to a post is the number of the ring it first appears in.'],
  solution: `Start at post ${n(u)}, ring 0. Then ${lines.join('; ')}. Post ${n(v)} first appears in ring ${n(d[v])}, so its distance is ${n(d[v])}. Ring 2 holds ${named(two, 'post')}, which is ${count(two.length, 'post', 'posts')}.`,
  guidance: [
   { prompt: `Ring 1 is every neighbour of post ${n(u)}. Add the next ring, the posts not yet reached that are next to ring 1. How many posts are in ring 2?`, answer: [two.length], explanation: `Ring 1 is ${named(at(1), 'post')}, and ring 2 is ${named(two, 'post')}: ${count(two.length, 'post', 'posts')}.` },
   { prompt: `Keep adding rings of posts not yet reached. In which ring does post ${n(v)} first appear?`, answer: [d[v]], explanation: `From post ${n(u)}: ${lines.join('; ')}. So the distance to post ${n(v)} is ${n(d[v])}.` }
  ] }; }
});

/* d = distance; fuel for there and back = 2 d f; left = tank − that (the tank always holds more than the trip needs). */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'Fuel for the round trip',
 brief: 'A rover must reach a far depot and come home again, and the fuel clerk needs to know whether one tank is enough.',
 labels: ['roads one way', 'litres for the round trip', 'litres left'], tolerance: 0.01,
 gl: [['roads one way'], ['litres for the round trip'], ['litres left']]
}, {
 canonical: { V: 9, E: [[1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6], [5, 9], [6, 7], [7, 8], [8, 9]], u: 1, v: 8, f: 3, x: 7 },
 draw: R => until(() => { const V = R.int(8, 9), E = connGraph(R, V, R.int(1, 3)), u = R.int(1, V), d = rings(V, E, u), far = []; for (let w = 1; w <= V; w++) if (d[w] >= 3) far.push(w);
  return far.length ? { V, E, u, v: R.pick(far), f: R.int(2, 6), x: R.int(2, 15) } : null; }, () => true),
 build: ({ V, E, u, v, f, x }) => { const d = rings(V, E, u)[v], one = d * f, trip = 2 * one, tank = trip + x; return {
  prompt: `A rover leaves depot ${n(u)}, drives to depot ${n(v)} along the route with the fewest roads, and drives back the same way. The depot map has ${n(V)} depots, numbered 1 to ${n(V)}, joined by these roads: ${edgeText(E)}. The rover burns ${n(f)} litres on every road and sets out with a full tank of ${n(tank)} litres. Enter the number of roads in the one-way trip, then the litres the round trip needs, then the litres left in the tank when it is home.`,
  answer: [d, trip, x],
  hints: ['The fewest roads between two depots is the distance: work outwards in rings from the start and note the ring where the far depot first appears.', 'The round trip uses the one-way roads twice, and each road costs the same fuel; what is left is the tank minus what the trip burns.'],
  solution: `Working outwards from depot ${n(u)} in rings, depot ${n(v)} first appears in ring ${n(d)}, so the one-way trip is ${n(d)} roads. The round trip is ${n(d)} + ${n(d)} = ${n(2 * d)} roads, and at ${n(f)} litres a road that is ${n(2 * d)} × ${n(f)} = ${n(trip)} litres. The tank holds ${n(tank)} litres, so ${n(tank)} − ${n(trip)} = ${n(x)} litres are left.`,
  guidance: [
   { prompt: `Work outwards from depot ${n(u)} in rings. In which ring does depot ${n(v)} first appear, so how many roads is the one-way trip?`, answer: [d], explanation: `Depot ${n(v)} first appears in ring ${n(d)}, so the fewest roads is ${n(d)}.` },
   { prompt: `The rover burns ${n(f)} litres on every road and drives there and back along the same number of roads. How many litres does the round trip need?`, answer: [trip], explanation: `The round trip is ${n(2 * d)} roads, and ${n(2 * d)} × ${n(f)} = ${n(trip)} litres.` },
   { prompt: `The tank holds ${n(tank)} litres. How many litres are left after the round trip?`, answer: [x], explanation: `${n(tank)} − ${n(trip)} = ${n(x)} litres.` }
  ] }; }
});

/* Distance to v, the greatest distance from u, and how many depots are that far. Harder: 10–11 depots, greatest distance at least 4. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', title: 'The farthest depot in the ring',
 brief: 'Mira is siting a relief depot on a big road map and wants to know how far the outermost depots are from the main garage.',
 labels: ['distance to the named depot', 'greatest distance from the garage', 'depots that far away'], tolerance: 0.01,
 gl: [['distance to the named depot'], ['greatest distance from the garage'], ['depots that far away']]
}, {
 canonical: { V: 11, E: [[1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [5, 6], [6, 7], [6, 8], [7, 9], [8, 10], [9, 11], [10, 11]], u: 1, v: 7 },
 draw: R => until(() => { const V = R.int(10, 11), E = connGraph(R, V, R.int(2, 4)), u = R.int(1, V), d = rings(V, E, u), far = []; for (let x = 1; x <= V; x++) if (d[x] >= 3) far.push(x);
  return far.length ? { V, E, u, v: R.pick(far) } : null; }, p => Math.max(...rings(p.V, p.E, p.u)) >= 4),
 build: ({ V, E, u, v }) => { const d = rings(V, E, u), top = Math.max(...d), at = r => { const a = []; for (let x = 1; x <= V; x++) if (d[x] === r) a.push(x); return a; }, lines = [];
  for (let r = 1; r <= top; r++) lines.push(`ring ${n(r)} is ${named(at(r), 'depot')}`); const last = at(top); return {
  prompt: `The garage is at depot ${n(u)} on a road map of ${n(V)} depots, numbered 1 to ${n(V)}, joined by these roads: ${edgeText(E)}. Every depot can be reached from every other. Enter the distance from the garage to depot ${n(v)}, then the greatest distance from the garage to any depot, then the number of depots that are that far from the garage.`,
  answer: [d[v], top, last.length],
  hints: ['Build the rings outwards from the garage until every depot has a ring; the distance to a depot is its ring number.', 'The greatest distance is the number of the last ring, and the depots that far away are exactly the depots in that last ring.'],
  solution: `Start at depot ${n(u)}, ring 0. Then ${lines.join('; ')}. Depot ${n(v)} first appears in ring ${n(d[v])}. The last ring is ring ${n(top)}, so the greatest distance is ${n(top)}, and it holds ${named(last, 'depot')}: ${count(last.length, 'depot', 'depots')}.`,
  guidance: [
   { prompt: `Build the rings outwards from depot ${n(u)}. In which ring does depot ${n(v)} first appear?`, answer: [d[v]], explanation: `From depot ${n(u)}: ${lines.slice(0, d[v]).join('; ')}. So the distance to depot ${n(v)} is ${n(d[v])}.` },
   { prompt: `Carry on adding rings until every depot has been reached. What is the number of the last ring?`, answer: [top], explanation: `From depot ${n(u)}: ${lines.join('; ')}. The last ring is ring ${n(top)}, so no depot is more than ${n(top)} roads from the garage.` },
   { prompt: `How many depots are in that last ring?`, answer: [last.length], explanation: `Ring ${n(top)} is ${named(last, 'depot')}: ${count(last.length, 'depot', 'depots')}.` }
  ] }; }
});

/* ---- q08 Connected components [KT5.1] ---- */

/* Components, and the size of the largest one (ties do not matter: it is a number). Not the worked example (7 vertices). */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'Masts after the solar flare',
 brief: 'A solar flare has knocked out some radio links between the relay masts, and Mira wants to know how the working masts group up.',
 labels: ['groups of masts', 'masts in the biggest group'], tolerance: 0.01,
 gl: [["masts in mast 1’s component"], ['groups of masts'], ['masts in the biggest group']]
}, {
 canonical: { V: 10, E: [[1, 5], [2, 3], [2, 7], [4, 8], [5, 9], [6, 8], [7, 10]] },
 draw: R => until(() => { const V = R.int(8, 11), c = R.int(2, 5); return { V, E: groupsGraph(R, V, c) }; },
  p => { const C = components(p.V, p.E); return p.E.length >= 4 && C.length >= 2 && Math.max(...C.map(g => g.length)) >= 3; }),
 build: ({ V, E }) => { const C = components(V, E), c = C.length, big = Math.max(...C.map(g => g.length)), first = C[0]; return {
  prompt: `A solar flare has dropped some of the radio links between the ${n(V)} relay masts, numbered 1 to ${n(V)}. Only these links still work: ${edgeText(E)}. A mast with no working link is a component on its own. Enter the number of components of the working network, then the number of masts in the biggest component.`,
  answer: [c, big],
  hints: ['Start at a mast and collect every mast it can reach by working links; that whole piece is one component. Then start again from a mast not yet used.', 'Count the masts in each component and compare; a mast on its own counts as a component of one.'],
  solution: `The components are: ${semi(C.map(g => named(g, 'mast')))}. That is ${n(c)} components. Their sizes are ${and(C.map(g => g.length))}, so the biggest has ${n(big)} masts.`,
  guidance: [
   { prompt: `Start at mast 1 and collect every mast it can reach by working links. How many masts are in that component?`, answer: [first.length], explanation: first.length === 1 ? 'Mast 1 has no working link, so it is a component by itself, with 1 mast in it.' : `The component of mast 1 is ${named(first, 'mast')}: ${n(first.length)} masts.` },
   { prompt: `Start again from a mast not reached yet, and repeat until every mast is used. How many components are there?`, answer: [c], explanation: `The components are: ${semi(C.map(g => named(g, 'mast')))}. That is ${n(c)} pieces.` },
   { prompt: `Count the masts in each component. How many masts are in the biggest one?`, answer: [big], explanation: `The sizes are ${and(C.map(g => g.length))}, so the biggest component has ${n(big)} masts.` }
  ] }; }
});

/* c components need c − 1 new roads; every new road costs the same load of gravel whichever two depots it joins. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Gravel for the missing roads',
 brief: 'The grader crew has to put roads back until every depot can be reached again, and the stores clerk needs the gravel ordered.',
 labels: ['components', 'tonnes of gravel'], tolerance: 0.01,
 gl: [['components'], ['fewest new roads'], ['tonnes of gravel']]
}, {
 canonical: { V: 9, E: [[1, 3], [2, 4], [2, 8], [4, 5], [5, 8], [3, 6], [7, 9]], m: 14 },
 draw: R => until(() => { const V = R.int(8, 11), c = R.int(2, 5); return { V, E: groupsGraph(R, V, c), m: R.int(5, 25) }; }, p => p.E.length >= 4 && components(p.V, p.E).length >= 2),
 build: ({ V, E, m }) => { const C = components(V, E), c = C.length, roads = c - 1, tot = roads * m; return {
  prompt: `The grader crew faces ${n(V)} depots, numbered 1 to ${n(V)}, and only these roads still open: ${edgeText(E)}. They will build the fewest new roads that let every depot reach every other. Each new road, whichever two depots it joins, needs ${n(m)} tonnes of gravel. Enter the number of components of the open-road map, then the total tonnes of gravel the new roads need.`,
  answer: [c, tot],
  hints: ['Collect the depots piece by piece: each piece is a component, and a depot with no open road is a component by itself.', 'Each new road can join at most two pieces into one, so the fewest new roads is one fewer than the number of pieces; then multiply by the gravel for one road.'],
  solution: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(c)} components. Each new road joins at most two pieces into one, so ${n(c)} − 1 = ${count(roads, 'new road', 'new roads')} are needed. At ${n(m)} tonnes each, that is ${n(roads)} × ${n(m)} = ${n(tot)} tonnes.`,
  guidance: [
   { prompt: `Start at a depot and collect everything it can reach by open roads, then start again from a depot not yet used. How many components are there?`, answer: [c], explanation: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(c)} pieces.` },
   { prompt: `Each new road can join two pieces into one. How many new roads does it take to join ${n(c)} pieces into one?`, answer: [roads], explanation: `Every new road lowers the number of pieces by at most 1, so going from ${n(c)} to 1 takes ${count(roads, 'road', 'roads')}.` },
   { prompt: `Each new road needs ${n(m)} tonnes of gravel. How many tonnes do the new roads need in all?`, answer: [tot], explanation: `${n(roads)} × ${n(m)} = ${n(tot)} tonnes.` }
  ] }; }
});

/* Components, fewest new roads, and depots of degree 0 (components of one). Harder: 12–13 depots, 4–6 components, at least one lone depot. */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q02', title: 'Stranded depots after the second storm',
 brief: 'A second storm has cut a large depot map into many pieces, some of them single depots, and Mira wants the repair plan sized.',
 labels: ['depots of degree 0', 'components', 'fewest new roads'], tolerance: 0.01,
 gl: [['depots of degree 0'], ['components'], ['fewest new roads']]
}, {
 canonical: { V: 12, E: [[1, 5], [2, 3], [2, 7], [3, 7], [5, 8], [6, 9], [8, 12], [9, 10], [10, 11]] },
 draw: R => until(() => { const V = R.int(12, 13), c = R.int(4, 6); return { V, E: groupsGraph(R, V, c) }; },
  p => { const d = degs(p.V, p.E); return components(p.V, p.E).length >= 4 && d.slice(1).some(x => x === 0) && p.E.length >= 6; }),
 build: ({ V, E }) => { const C = components(V, E), c = C.length, d = degs(V, E), lone = []; for (let v = 1; v <= V; v++) if (d[v] === 0) lone.push(v); return {
  prompt: `A second storm has left only these roads open on a depot map of ${n(V)} depots, numbered 1 to ${n(V)}: ${edgeText(E)}. Enter the number of depots of degree 0, then the number of components of the open-road map, then the fewest new roads that would make every depot reachable from every other.`,
  answer: [lone.length, c, c - 1],
  hints: ['A depot of degree 0 has no open road at all, so it is a component of one; look for depots that appear in no pair.', 'Collect the other depots piece by piece to count the components, and remember that each new road can join at most two pieces into one.'],
  solution: `No open road meets ${named(lone, 'depot')}, so ${lone.length === 1 ? 'that is 1 depot' : `those are ${n(lone.length)} depots`} of degree 0. The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(c)} components, and joining ${n(c)} pieces into one takes ${n(c)} − 1 = ${count(c - 1, 'new road', 'new roads')}.`,
  guidance: [
   { prompt: `Which depots appear in none of the open roads? How many depots have degree 0?`, answer: [lone.length], explanation: `${named(lone, 'depot').replace(/^./, c => c.toUpperCase())} ${lone.length === 1 ? 'is' : 'are'} in no open road, so ${lone.length === 1 ? 'there is 1 depot' : `there are ${n(lone.length)} depots`} of degree 0.` },
   { prompt: `Collect the depots piece by piece, counting each lone depot as a piece. How many components are there?`, answer: [c], explanation: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(c)} pieces.` },
   { prompt: `Each new road can join two pieces into one. How many new roads does it take to join ${n(c)} pieces into one?`, answer: [c - 1], explanation: `Every new road lowers the number of pieces by at most 1, so going from ${n(c)} to 1 takes ${count(c - 1, 'road', 'roads')}.` }
  ] }; }
});

/* ---- q09 Euler circuits [O12.5] ---- */

/* Highest degree, depots of odd degree, and 1 or 0 for an Euler circuit on a connected graph. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'Brushing every depot rail',
 brief: 'A cleaning rover has to brush every service rail in the depot yards and park where it began, and Mira wants to know if that is possible.',
 labels: ['highest degree', 'yards of odd degree', 'Euler circuit (1 or 0)'], tolerance: 0.01,
 gl: [['highest degree'], ['yards of odd degree'], ['Euler circuit (1 or 0)']]
}, {
 canonical: { V: 8, E: [[1, 2], [1, 8], [2, 3], [2, 4], [2, 6], [3, 4], [4, 5], [4, 6], [5, 6], [6, 7], [7, 8]] },
 draw: R => until(() => { const V = R.int(7, 9), k = R.pick([0, 0, 2, 4, 4]), E = withOdd(R, V, R.int(2, V), k); return E && { V, E }; }, p => p.E.length >= p.V + 1),
 build: ({ V, E }) => { const o = odds(V, E), ec = o.length ? 0 : 1, d = degs(V, E), top = Math.max(...d.slice(1)), busy = []; for (let v = 1; v <= V; v++) if (d[v] === top) busy.push(v); return {
  prompt: `The depot has ${n(V)} yards, numbered 1 to ${n(V)}, joined by these service rails: ${edgeText(E)}. Every yard can be reached from every other. A cleaning rover must brush every rail exactly once and finish back at the yard it started from. Enter the highest degree of any yard, then the number of yards of odd degree, then 1 if such a route exists or 0 if not.`,
  answer: [top, o.length, ec],
  hints: ['Count the rails that meet each yard to get its degree, and keep the largest.', 'A route that uses every rail once and returns to its start needs an even degree at every yard, because each visit uses one rail in and one out.'],
  solution: `The degrees are ${degList(V, E).join(', ')}. The highest is ${n(top)}, at ${named(busy, 'yard')}. ${ec ? 'No yard has odd degree, and the graph is connected, so the rover can brush every rail once and finish where it began: 1.' : `The odd ones are ${named(o, 'yard')}: ${n(o.length)} yards of odd degree. An odd yard cannot have its rails used in pairs, so there is no such route: 0.`}`,
  guidance: [
   { prompt: `Count the rails that meet each yard. What is the highest degree?`, answer: [top], explanation: `The degrees are ${degList(V, E).join(', ')}. The highest is ${n(top)}.` },
   { prompt: `How many yards have an odd number of rails?`, answer: [o.length], explanation: o.length ? `The odd ones are ${named(o, 'yard')}.` : 'None of the degrees is odd.' },
   { prompt: `Enter 1 if every yard has even degree, so that the route exists, or 0 if not.`, answer: [ec], explanation: ec ? 'The graph is connected and every degree is even, so an Euler circuit exists.' : 'An odd yard cannot have its rails used in pairs, so no circuit uses every rail exactly once.' }
  ] }; }
});

/* The board gives only the degrees. Roads = sum ÷ 2; km = roads × length when every degree is even, else 0. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The control board tally',
 brief: 'The road sweeper’s control board only shows how many roads meet each depot, and Mira wants the sweep distance worked out from that.',
 labels: ['roads', 'depots of odd degree', 'km of the circuit'], tolerance: 0.01,
 gl: [['roads'], ['depots of odd degree'], ['km of the circuit']]
}, {
 canonical: { V: 7, E: [[1, 2], [1, 3], [1, 5], [1, 7], [2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [6, 7]], m: 3 },
 draw: R => until(() => { const V = R.int(7, 9), k = R.pick([0, 0, 2, 4]), E = withOdd(R, V, R.int(2, V), k); return E && { V, E, m: R.int(2, 9) }; }, p => p.E.length >= p.V + 1),
 build: ({ V, E, m }) => { const d = degs(V, E).slice(1), tot = sum(d), roads = tot / 2, o = d.filter(x => x % 2).length, km = o ? 0 : roads * m; return {
  prompt: `The road sweeper’s control board shows how many open roads meet each of the ${n(V)} depots, from depot 1 to depot ${n(V)} in order: ${d.map(n).join(', ')}. Every depot can be reached from every other, and every road is ${n(m)} km long. Enter the number of roads on the map, then the number of depots with an odd number of roads, then the length in km of a circuit that sweeps every road exactly once and returns to its start, or 0 if no such circuit exists.`,
  answer: [roads, o, km],
  hints: ['Each road is counted at both of its ends, so the numbers on the board add up to twice the number of roads.', 'A circuit over every road once exists exactly when the map is connected and no depot has an odd number of roads; its length is then the number of roads times the length of one road.'],
  solution: `The numbers add up to ${d.map(n).join(' + ')} = ${n(tot)}, and every road is counted twice, so there are ${n(tot)} ÷ 2 = ${n(roads)} roads. ${o ? `${count(o, 'depot has', 'depots have')} an odd number of roads, so there is no circuit over every road: 0 km.` : `No depot has an odd number of roads, so an Euler circuit exists. It sweeps every road once: ${n(roads)} × ${n(m)} = ${n(km)} km.`}`,
  guidance: [
   { prompt: `Add up the numbers on the board. Each road is counted once at each end, so how many roads are there?`, answer: [roads], explanation: `${d.map(n).join(' + ')} = ${n(tot)}, and ${n(tot)} ÷ 2 = ${n(roads)} roads.` },
   { prompt: `How many of the numbers on the board are odd?`, answer: [o], explanation: o ? `${count(o, 'depot has', 'depots have')} an odd number of roads.` : 'None of the numbers is odd.' },
   { prompt: `If no number is odd, a circuit over every road once exists, and each road is ${n(m)} km. How many km is the circuit, or 0 if it does not exist?`, answer: [km], explanation: o ? `An odd depot rules the circuit out, so the answer is 0.` : `${n(roads)} roads × ${n(m)} km = ${n(km)} km.` }
  ] }; }
});

/* Several pieces: the number of components, how many of them have an Euler circuit of their own (every depot in the piece
   even), and the total number of odd depots. Pieces have 3–5 depots and at least one road. Harder: 8–13 depots in 2–3 pieces. */
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q08', title: 'Circuits in every piece',
 brief: 'The storm has split the depot map into pieces, and Mira wants to know in how many of them the sweeper can loop over every road.',
 labels: ['components', 'components with an Euler circuit', 'depots of odd degree'], tolerance: 0.01,
 gl: [['components'], ['depots of odd degree'], ['components with an Euler circuit']]
}, {
 canonical: { V: 10, E: [[1, 3], [1, 8], [2, 4], [3, 5], [4, 7], [5, 8], [6, 9], [6, 10], [9, 10]] },
 draw: R => until(() => { const c = R.int(2, 3), sizes = Array.from({ length: c }, () => R.int(3, c === 3 ? 4 : 5)), V = sum(sizes), perm = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)), E = []; let off = 0;
  for (const sz of sizes) { const part = withOdd(R, sz, R.int(0, 2), R.pick([0, 0, 2])); if (!part) return null; for (const [a, b] of part) E.push([perm[off + a - 1], perm[off + b - 1]]); off += sz; }
  return { V, E: sortE(E) }; },
  p => { const C = components(p.V, p.E), d = degs(p.V, p.E), good = C.filter(g => g.every(v => d[v] % 2 === 0)).length; return good >= 1 && good < C.length; }),
 build: ({ V, E }) => { const C = components(V, E), d = degs(V, E), good = C.filter(g => g.every(v => d[v] % 2 === 0)), o = odds(V, E), bad = C.filter(g => !good.includes(g)); return {
  prompt: `After a storm the depot map has ${n(V)} depots, numbered 1 to ${n(V)}, and only these roads open: ${edgeText(E)}. A component has an Euler circuit when a circuit can use every road in that component exactly once; inside a component every depot can be reached from every other, and every component here has at least one road. Enter the number of components, then the number of components that have an Euler circuit, then the total number of depots of odd degree on the whole map.`,
  answer: [C.length, good.length, o.length],
  hints: ['Find the components first, by collecting what each depot can reach; the degrees inside one component do not depend on the others.', 'A component has an Euler circuit exactly when every depot in it has even degree, so one odd depot spoils its whole component.'],
  solution: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(C.length)} components. The degrees are ${degList(V, E).join(', ')}, so the odd depots are ${o.length ? and(o) : 'none'}. ${bad.length === 1 ? 'The component made of' : 'The components made of'} ${semi(bad.map(g => named(g, 'depot')))} ${bad.length === 1 ? 'has an odd depot, so it has' : 'have odd depots, so they have'} no Euler circuit; ${good.length === 1 ? 'the other component has' : `the other ${n(good.length)} components have`} all degrees even, so ${good.length === 1 ? 'it has one' : 'each has one'}. That is ${n(good.length)} component${good.length === 1 ? '' : 's'} with an Euler circuit, and ${n(o.length)} odd depots in all.`,
  guidance: [
   { prompt: `Collect the depots piece by piece, each piece being everything one depot can reach. How many components are there?`, answer: [C.length], explanation: `The components are: ${semi(C.map(g => named(g, 'depot')))}. That is ${n(C.length)} pieces.` },
   { prompt: `Work out every depot’s degree and list the odd ones. How many depots on the whole map have odd degree?`, answer: [o.length], explanation: `The degrees are ${degList(V, E).join(', ')}. ${o.length ? `The odd ones are ${and(o)}.` : 'None is odd.'}` },
   { prompt: `For each component, check whether all of its depots have even degree. How many components have an Euler circuit?`, answer: [good.length], explanation: `${good.length ? `${good.length === 1 ? 'The component made of' : 'The components made of'} ${semi(good.map(g => named(g, 'depot')))} ${good.length === 1 ? 'has' : 'have'} only even degrees.` : 'None has only even degrees.'} ${bad.length === 1 ? 'The other component contains' : 'Each of the others contains'} an odd depot, so ${good.length === 1 ? '1 component has' : `${n(good.length)} components have`} an Euler circuit.` }
  ] }; }
});

/* ---- q10 Euler trails [O12.6] ---- */

/* Odd depots, 1 or 0 for an Euler trail, and the LARGER label of the two odd posts (0 if no trail). */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'One flight along every cable',
 brief: 'A survey drone has to fly along every power cable between the charging posts once, landing at a different post from the one it left.',
 labels: ['posts of odd degree', 'Euler trail (1 or 0)', 'larger start post'], tolerance: 0.01,
 gl: [['posts of odd degree'], ['Euler trail (1 or 0)'], ['larger start post']]
}, {
 canonical: { V: 8, E: [[1, 2], [1, 5], [1, 8], [2, 3], [2, 4], [2, 6], [3, 4], [4, 5], [4, 6], [5, 6], [6, 7], [7, 8]] },
 draw: R => until(() => { const V = R.int(7, 9), k = R.pick([2, 2, 2, 4, 0]), E = withOdd(R, V, R.int(2, V), k); return E && { V, E }; }, p => p.E.length >= p.V + 1),
 build: ({ V, E }) => { const o = odds(V, E), et = o.length === 2 ? 1 : 0, big = et ? o[1] : 0; return {
  prompt: `Mira’s survey drone must fly along every one of the power cables joining ${n(V)} charging posts, numbered 1 to ${n(V)}, using each cable exactly once, and it must land at a different post from the one it took off from, so the flight must be an Euler trail. The cables are: ${edgeText(E)}. Every post can be reached from every other. Enter the number of posts of odd degree, then 1 if an Euler trail exists or 0 if not, then the larger label of the two posts where it could start, or 0 if there is no Euler trail.`,
  answer: [o.length, et, big],
  hints: ['Only the first and last posts of a trail can have odd degree; every post in between uses its cables in pairs, one in and one out.', 'An Euler trail needs exactly two odd posts, and it starts at one of them and finishes at the other.'],
  solution: `The degrees are ${degList(V, E).join(', ')}. ${et ? `Exactly two posts, ${n(o[0])} and ${n(o[1])}, have odd degree, so an Euler trail exists: 1. It starts at one of them and finishes at the other, and the larger label is ${n(o[1])}.` : o.length ? `The odd posts are ${and(o)}: ${n(o.length)} of them, but only the two ends of a trail can be odd, so there is no Euler trail: 0, and 0 for the start.` : 'Every degree is even, so a flight over every cable always returns to its start. There is no trail between different posts: 0, and 0 for the start.'}`,
  guidance: [
   { prompt: `Work out the degree of every post. How many posts have odd degree?`, answer: [o.length], explanation: `The degrees are ${degList(V, E).join(', ')}. ${o.length ? `The odd ones are ${named(o, 'post')}.` : 'None is odd.'}` },
   { prompt: `Enter 1 if exactly two posts have odd degree, so that an Euler trail exists, or 0 if not.`, answer: [et], explanation: et ? 'Exactly two posts are odd, and the graph is connected, so an Euler trail exists.' : o.length ? 'More than two posts are odd, and only the two ends of a trail can be odd.' : 'With every degree even, a flight over every cable always returns to its start, so there is no trail between different posts.' },
   { prompt: `Enter the larger label of the two odd posts if there are exactly two, or 0 if there is no Euler trail.`, answer: [big], explanation: et ? `The flight runs between posts ${n(o[0])} and ${n(o[1])}, so the larger start label is ${n(o[1])}.` : 'There is no Euler trail, so the answer is 0.' }
  ] }; }
});

/* Fuel: the tank holds the trip's fuel plus a margin x ≥ 2, so the litres left are x when a trail exists and the answer is 0 when it does not. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Fuel left after the inspection',
 brief: 'The inspector’s rover has one tank for the whole inspection, and the fuel clerk wants to know how much will be left at the end.',
 labels: ['depots of odd degree', 'Euler trail (1 or 0)', 'litres left'], tolerance: 0.01,
 gl: [['depots of odd degree'], ['Euler trail (1 or 0)'], ['litres left']]
}, {
 canonical: { V: 7, E: [[1, 2], [1, 3], [1, 6], [2, 3], [2, 5], [3, 4], [3, 6], [4, 5], [5, 6], [5, 7], [6, 7]], f: 4, x: 9 },
 draw: R => until(() => { const V = R.int(7, 9), k = R.pick([2, 2, 2, 4, 0]), E = withOdd(R, V, R.int(2, V), k); return E && { V, E, f: R.int(2, 6), x: R.int(2, 20) }; }, p => p.E.length >= p.V + 1),
 build: ({ V, E, f, x }) => { const o = odds(V, E), et = o.length === 2 ? 1 : 0, tank = E.length * f + x, left = et ? x : 0; return {
  prompt: `A rover must inspect every road of a depot map exactly once, starting and finishing at different depots. The map has ${n(V)} depots, numbered 1 to ${n(V)}, joined by these roads: ${edgeText(E)}. Every depot can be reached from every other. The rover burns ${n(f)} litres on every road and sets out with a full tank of ${n(tank)} litres. Enter the number of depots of odd degree, then 1 if such a route (an Euler trail) exists or 0 if not, then the litres left in the tank at the end of that route, or 0 if there is no such route.`,
  answer: [o.length, et, left],
  hints: ['Count the degrees first: a route over every road once, between different depots, needs exactly two odd depots.', 'If the route exists it drives every road exactly once, so it burns the number of roads times the fuel for one road; what is left is the tank minus that.'],
  solution: `The degrees are ${degList(V, E).join(', ')}. ${et ? `Exactly two depots, ${n(o[0])} and ${n(o[1])}, have odd degree, so an Euler trail exists: 1. The map has ${n(E.length)} roads, so the route burns ${n(E.length)} × ${n(f)} = ${n(E.length * f)} litres, and ${n(tank)} − ${n(E.length * f)} = ${n(x)} litres are left.` : o.length ? `The odd depots are ${and(o)}: ${n(o.length)} of them, but only the two ends of a trail can be odd, so there is no such route: 0, and 0 litres.` : 'Every degree is even, so a route over every road always returns to its start. There is no trail between different depots: 0, and 0 litres.'}`,
  guidance: [
   { prompt: `Work out the degree of every depot. How many depots have odd degree?`, answer: [o.length], explanation: `The degrees are ${degList(V, E).join(', ')}. ${o.length ? `The odd ones are ${named(o, 'depot')}.` : 'None is odd.'}` },
   { prompt: `Enter 1 if exactly two depots have odd degree, so that an Euler trail exists, or 0 if not.`, answer: [et], explanation: et ? 'Exactly two depots are odd, and the graph is connected, so an Euler trail exists.' : o.length ? 'More than two depots are odd, and only the two ends of a trail can be odd.' : 'With every degree even, a route over every road always returns to its start, so there is no trail between different depots.' },
   { prompt: `If the route exists it drives each of the ${n(E.length)} roads once at ${n(f)} litres a road, from a tank of ${n(tank)} litres. How many litres are left at the end, or 0 if there is no such route?`, answer: [left], explanation: et ? `${n(E.length)} × ${n(f)} = ${n(E.length * f)} litres burned, and ${n(tank)} − ${n(E.length * f)} = ${n(x)} litres are left.` : 'There is no such route, so the answer is 0.' }
  ] }; }
});

/* A new road adds 1 to the degree at each of its two ends. One new road between depots not yet joined gives an Euler circuit
   exactly when the map has two odd depots that are not already joined by a road. Draws have 2 or 4 odd depots. */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'One new road for the sweeper',
 brief: 'The council will build one new road, and Mira wants to know whether it could turn an inspection route into a full sweeping loop.',
 labels: ['depots of odd degree', 'Euler trail (1 or 0)', 'circuit possible (1 or 0)'], tolerance: 0.01,
 gl: [['depots of odd degree'], ['Euler trail (1 or 0)'], ['circuit possible (1 or 0)']]
}, {
 canonical: { V: 8, E: [[1, 2], [1, 8], [2, 3], [2, 5], [3, 4], [4, 5], [4, 6], [4, 8], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8]] },
 draw: R => until(() => { const V = R.int(8, 9), k = R.pick([2, 2, 4]), E = withOdd(R, V, R.int(3, V), k); return E && { V, E }; }, p => p.E.length >= p.V + 2),
 build: ({ V, E }) => { const o = odds(V, E), et = o.length === 2 ? 1 : 0, can = et && !has(E, o[0], o[1]) ? 1 : 0; return {
  prompt: `A depot map has ${n(V)} depots, numbered 1 to ${n(V)}, joined by these roads: ${edgeText(E)}. Every depot can be reached from every other. An Euler trail drives every road exactly once and ends at a different depot from where it started. The council will build exactly one new road between two depots that are not yet joined by a road; a new road adds 1 to the degree of each of its two depots. Enter the number of depots of odd degree, then 1 if an Euler trail exists on the map as it is now or 0 if not, then 1 if some choice of new road would give the map an Euler circuit or 0 if no choice would.`,
  answer: [o.length, et, can],
  hints: ['An Euler trail between different depots needs exactly two odd depots; an Euler circuit needs none.', 'A new road changes the degree of just its two depots, so it can remove at most two odd depots, and only if both of them are its ends and are not yet joined by a road.'],
  solution: `The degrees are ${degList(V, E).join(', ')}. ${o.length ? `The odd depots are ${and(o)}: ${n(o.length)} of them.` : 'No depot is odd.'} ${et ? 'Exactly two are odd, so an Euler trail exists: 1.' : 'There are more than two, so there is no Euler trail: 0.'} ${et ? (can ? `A new road between depots ${n(o[0])} and ${n(o[1])}, which are not yet joined, makes every degree even, so an Euler circuit becomes possible: 1.` : `Only a new road between depots ${n(o[0])} and ${n(o[1])} could make every degree even, but they are already joined, so no choice works: 0.`) : `One new road changes only two degrees, so at least ${n(o.length - 2)} odd depots would remain: 0.`}`,
  guidance: [
   { prompt: `Work out the degree of every depot. How many depots have odd degree?`, answer: [o.length], explanation: `The degrees are ${degList(V, E).join(', ')}. The odd ones are ${and(o)}.` },
   { prompt: `Enter 1 if exactly two depots have odd degree, so that an Euler trail exists now, or 0 if not.`, answer: [et], explanation: et ? 'Exactly two depots are odd, and the graph is connected, so an Euler trail exists.' : 'More than two depots are odd, and only the two ends of a trail can be odd.' },
   { prompt: `A new road changes the degree of its two depots only. Could one new road between two depots not yet joined leave every degree even? Enter 1 for yes, 0 for no.`, answer: [can], explanation: can ? `Yes: a road between the two odd depots ${n(o[0])} and ${n(o[1])}, which are not joined yet, makes both even.` : et ? `No: only a road between the two odd depots ${n(o[0])} and ${n(o[1])} could do it, and they are already joined.` : `No: one road can fix at most two odd depots, and ${n(o.length)} are odd.` }
  ] }; }
});

})();
