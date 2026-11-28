/* Graph theory: networks mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n } = G;
/* Small graph helpers. Vertices are numbered 1..V; an edge is [a, b] with a < b. */
const pair = (a, b) => a < b ? [a, b] : [b, a];
const sortEdges = edges => edges.map(e => pair(e[0], e[1])).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
const dash = e => `${e[0]}–${e[1]}`;
const join = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const arrows = xs => xs.join(' → ');
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
/* "colour 1 to parts 1 and 4, colour 2 to part 2 ..." (verb 'to') or "exams 1 and 7 in slot 1, ..." (verb 'in'). */
const classes = (V, c, k, noun, item, verb) => join(Array.from({ length: k }, (_, i) => { const S = []; for (let v = 1; v <= V; v++) if (c[v] === i + 1) S.push(v); const who = `${item}${S.length > 1 ? 's' : ''} ${join(S.map(String))}`; return verb === 'to' ? `${noun} ${i + 1} to ${who}` : `${who} in ${noun} ${i + 1}`; }));
const lc = t => t.charAt(0).toLowerCase() + t.slice(1), uc = t => t.charAt(0).toUpperCase() + t.slice(1);

/* q21, q23: tours of a complete graph. P lists the pairs in the order the weights w are given. */
const P4 = allPairs(4), P5 = allPairs(5);
const wOf = (P, w) => (a, b) => w[P.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a))];
const nnTour = (k, W, s) => { const tour = [s], legs = [], seen = new Set([s]); let cur = s;
 while (tour.length < k) { let best = 0; for (let v = 1; v <= k; v++) if (!seen.has(v) && (!best || W(cur, v) < W(cur, best))) best = v; legs.push(W(cur, best)); tour.push(best); seen.add(best); cur = best; }
 legs.push(W(cur, s)); tour.push(s); return { tour, legs, total: sum(legs) }; };
/* Every tour from s, each with its reverse counted once (the second station is smaller than the last one). */
const allTours = (k, W, s) => { const rest = []; for (let v = 1; v <= k; v++) if (v !== s) rest.push(v); const out = [];
 const perm = (pre, left) => { if (!left.length) { if (pre[0] < pre[pre.length - 1]) { const t = [s, ...pre, s]; let tot = 0; for (let i = 0; i < k; i++) tot += W(t[i], t[i + 1]); out.push({ tour: t, total: tot }); } return; }
  left.forEach((v, i) => perm([...pre, v], left.filter((_, j) => j !== i))); };
 perm([], rest); return out; };
const bestOf = tours => tours.reduce((b, t) => t.total < b.total ? t : b);
const weightList = (P, w) => P.map((e, i) => `${dash(e)}: ${n(w[i])}`).join(', ');

/* q23: Dijkstra on a fixed road map of six stations; ties go to the smaller label. */
const ROAD = [[1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [4, 5], [4, 6], [5, 6]];
const dijkstra = (V, edges, w, s) => { const d = Array(V + 1).fill(Infinity), done = Array(V + 1).fill(false), prev = Array(V + 1).fill(0), order = []; d[s] = 0;
 for (;;) { let u = 0; for (let v = 1; v <= V; v++) if (!done[v] && d[v] < Infinity && (!u || d[v] < d[u])) u = v; if (!u) break; done[u] = true; order.push(u);
  edges.forEach(([a, b], i) => { const o = a === u ? b : b === u ? a : 0; if (o && !done[o] && d[u] + w[i] < d[o]) { d[o] = d[u] + w[i]; prev[o] = u; } }); }
 return { d, prev, order }; };

/* q26: the four regular solids other than the cube (the worked example), and face names. */
const FACE = { 3: 'triangle', 4: 'square', 5: 'pentagon' };
const SOLID = { '3,3': 'tetrahedron', '4,3': 'cube', '3,4': 'octahedron', '5,3': 'dodecahedron', '3,5': 'icosahedron' };

/* q27, q28: a random connected bipartite graph on V vertices with sides of at least 2; side[v] is 0 or 1. */
const randomBipartite = (R, V, extra) => { let side; do { side = [0]; for (let v = 1; v <= V; v++) side.push(R.bool() ? 1 : 0); } while (side.filter((s, i) => i && s === 0).length < 2 || side.filter((s, i) => i && s === 1).length < 2);
 const order = shuffle(R, Array.from({ length: V }, (_, i) => i + 1)); const i2 = order.findIndex(v => side[v] !== side[order[0]]); [order[1], order[i2]] = [order[i2], order[1]];
 const E = [pair(order[0], order[1])];
 for (let i = 2; i < V; i++) { const v = order[i], opts = order.slice(0, i).filter(u => side[u] !== side[v]); E.push(pair(v, R.pick(opts))); }
 const cross = allPairs(V).filter(([a, b]) => side[a] !== side[b] && !E.some(e => e[0] === a && e[1] === b));
 shuffle(R, cross).slice(0, extra).forEach(e => E.push(e)); return { side, edges: sortEdges(E) }; };

/* q29: a ring of r exams plus chords that do not cross; with a hub, one more exam linked to every ring exam.
   Drawn with the ring as a circle, the chords inside it and the hub outside, there are no crossings. */
const crosses = ([a, b], [c, d]) => (a < c && c < b && b < d) || (c < a && a < d && d < b);
const examEdges = ({ r, chords, hub, label }) => { const E = []; for (let i = 0; i < r; i++) E.push([i, (i + 1) % r]); chords.forEach(c => E.push(c)); if (hub) for (let i = 0; i < r; i++) E.push([i, r]);
 return sortEdges(E.map(([a, b]) => [label[a], label[b]])); };

/* q30: the largest matching (Kuhn's augmenting paths, crew in order) and the set of crew with the largest shortfall. */
const LET = 'ABCDEFGH';
const bestMatching = (c, adj) => { const owner = {}; const tryC = (i, seen) => { for (const t of adj[i]) { if (seen.has(t)) continue; seen.add(t); if (owner[t] === undefined || tryC(owner[t], seen)) { owner[t] = i; return true; } } return false; };
 let M = 0; for (let i = 0; i < c; i++) if (tryC(i, new Set())) M++; const got = Array(c).fill(-1); Object.keys(owner).forEach(t => { got[owner[t]] = Number(t); }); return { M, got }; };
const shortfall = (c, adj) => { let best = { d: 0, S: [], N: [] }; for (let m = 1; m < 1 << c; m++) { const S = [], N = new Set(); for (let i = 0; i < c; i++) if (m >> i & 1) { S.push(i); adj[i].forEach(t => N.add(t)); }
  const d = S.length - N.size; if (d > best.d || (d === best.d && d > 0 && S.length < best.S.length)) best = { d, S, N: [...N].sort((x, y) => x - y) }; } return best; };
const taskList = ts => join(ts.map(t => LET[t]));

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Five stations, every pair joined; the ten road lengths are different whole numbers from 1 to 20, so the nearest
    station is never a tie. A draw is kept only when the nearest-neighbour tour is longer than the best tour. */
 q21: {
  canonical: { s: 1, w: [7, 3, 15, 9, 6, 11, 4, 13, 12, 5] },
  draw: R => { for (;;) { const w = shuffle(R, Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 10), s = R.int(1, 5), W = wOf(P5, w);
   if (nnTour(5, W, s).total > bestOf(allTours(5, W, s)).total) return { s, w }; } },
  build: ({ s, w }) => { const W = wOf(P5, w), nn = nnTour(5, W, s), tours = allTours(5, W, s), best = bestOf(tours), gap = nn.total - best.total;
   const legs = nn.tour.slice(1, 5).map((v, i) => `${i === 0 ? `From station ${s}` : `from ${nn.tour[i]}`} the nearest unvisited station is ${v} (${n(nn.legs[i])} km)`);
   return {
   prompt: `Dispatch has to send one rover on a tour of the five outlying stations, numbered 1 to 5: it starts at station ${s}, visits every other station once and returns to station ${s}. Every pair of stations is joined by a direct road; the road lengths in km are ${weightList(P5, w)}. All ten road lengths are different, so there is never a tie for the nearest unvisited station. Use the nearest-neighbour method starting at station ${s}, and enter the length of the tour it gives, in km. Then enter how many km longer that tour is than the shortest possible tour.`,
   answer: [nn.total, gap],
   hints: ['From the station you are at, drive to the nearest station you have not visited yet. When every station has been visited, drive back to the start.', 'For the shortest tour, use brute force: list the 12 tours from the start (a tour and its reverse have the same length), add up the roads of each, and take the smallest. Then subtract.'],
   solution: `${legs.join('; ')}; then back from ${nn.tour[4]} to ${s} (${n(nn.legs[4])} km). The nearest-neighbour tour ${arrows(nn.tour)} is ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km. Brute force lists the 12 tours from station ${s}, each with its reverse counted once: ${tours.map(t => `${arrows(t.tour)} is ${n(t.total)}`).join(', ')}. The shortest is ${arrows(best.tour)} at ${n(best.total)} km, so the nearest-neighbour tour is ${n(nn.total)} − ${n(best.total)} = ${n(gap)} km longer.`,
   guidance: [
    { prompt: `Start at station ${s}. Which station is nearest to it, and how long is that road?`, answer: [nn.tour[1], nn.legs[0]], explanation: `The four roads out of station ${s} are ${nn.tour.slice(1, 5).slice().sort((a, b) => a - b).map(v => `${dash(pair(s, v))}: ${n(W(s, v))}`).join(', ')}. The shortest goes to station ${nn.tour[1]}, ${n(nn.legs[0])} km.` },
    { prompt: 'Keep going to the nearest unvisited station each time, then return to the start. How long is the whole nearest-neighbour tour?', answer: [nn.total], explanation: `The tour is ${arrows(nn.tour)}, and its roads add up to ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km.` },
    { prompt: `Now list the 12 tours from station ${s} and add up each one. How long is the shortest tour?`, answer: [best.total], explanation: `The shortest of the 12 is ${arrows(best.tour)}: ${n(best.total)} km. The nearest-neighbour tour is ${n(gap)} km longer: each step looks only at the next road, so the method can be forced onto long roads later.` }
   ] }; }
 },
 /* A simple network on 6 to 8 vertices whose smallest degree is just above or just below what Dirac's theorem
    needs (about half the draws each way). Made by deleting edges of the complete graph at random while both ends
    keep more than the target degree; after one pass some vertex has exactly the target degree. */
 q22: {
  canonical: { n: 7, edges: [[1, 2], [1, 4], [1, 6], [2, 3], [2, 5], [2, 7], [3, 4], [3, 6], [4, 5], [4, 7], [5, 6], [6, 7], [1, 7], [3, 5]] },
  draw: R => { const V = R.pick([6, 7, 8]), need = Math.ceil(V / 2), target = R.bool() ? need + R.int(0, 1) : Math.max(2, need - R.int(1, 2));
   const deg = Array(V + 1).fill(V - 1), keep = [];
   for (const [a, b] of shuffle(R, allPairs(V))) { if (deg[a] > target && deg[b] > target) { deg[a]--; deg[b]--; } else keep.push([a, b]); }
   return { n: V, edges: sortEdges(keep) }; },
  build: ({ n: V, edges }) => { const A = adjOf(V, edges), deg = A.slice(1).map(l => l.length), d = Math.min(...deg), half = V / 2, ok = d >= half ? 1 : 0,
   low = deg.map((x, i) => x === d ? i + 1 : 0).filter(Boolean);
   return {
   prompt: `Dispatch’s radio network links ${V} relay stations, numbered 1 to ${V}. There is at most one link between two stations and no link from a station to itself. The links are ${join(sortEdges(edges).map(dash))}. Enter the smallest degree in the network: the fewest links at any one station. Then enter 1 if Dirac’s theorem guarantees a Hamilton cycle through all ${V} stations, or 0 if the theorem gives no guarantee.`,
   answer: [d, ok],
   hints: ['The degree of a station is the number of links that end at it. Count the links at every station and keep the smallest count.', 'Dirac’s theorem needs every degree to be at least half the number of stations. When half is not a whole number, a degree must reach the next whole number up.'],
   solution: `The degrees of stations 1 to ${V} are ${join(deg.map(String))}, so the smallest degree is ${n(d)} (at station${low.length > 1 ? 's' : ''} ${join(low.map(String))}). Half the number of stations is ${V} ÷ 2 = ${n(half)}. ${ok ? `${n(d)} is at least ${n(half)}, so Dirac’s theorem guarantees a Hamilton cycle, and so a Hamilton path as well: enter 1.` : `${n(d)} is less than ${n(half)}, so Dirac’s theorem gives no guarantee: enter 0. A Hamilton cycle may or may not exist; the theorem simply does not decide.`}`,
   guidance: [
    { prompt: 'Count the links at each station. What is the smallest degree?', answer: [d], explanation: `Station by station the degrees are ${join(deg.map(String))}. The smallest is ${n(d)}.` },
    { prompt: `Dirac’s theorem compares the smallest degree with half the number of stations. What is ${V} ÷ 2?`, answer: [half], explanation: `${V} ÷ 2 = ${n(half)}.${V % 2 ? ` A degree is a whole number, so it must be at least ${n(Math.ceil(half))}.` : ''}` },
    { prompt: `Is the smallest degree, ${n(d)}, at least ${n(half)}? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? `Yes. Every station has at least ${n(Math.ceil(half))} links, so Dirac’s theorem guarantees a Hamilton cycle.` : `No. At least one station has fewer than ${n(half)} links, so the theorem gives no guarantee.` }
   ] }; }
 },
 /* The fixed road map ROAD with lengths 1 to 15, and a separate tour of four masts with flight lengths 2 to 20. */
 q23: {
  canonical: { w: [8, 3, 4, 9, 6, 7, 2, 10, 8], t: [6, 9, 7, 5, 11, 8] },
  draw: R => ({ w: ROAD.map(() => R.int(1, 15)), t: P4.map(() => R.int(2, 20)) }),
  build: ({ w, t }) => { const { d, prev, order } = dijkstra(6, ROAD, w, 1), routeTo = v => { const r = [v]; while (r[0] !== 1) r.unshift(prev[r[0]]); return r; }, route = routeTo(6);
   const T = wOf(P4, t), tours = allTours(4, T, 1), best = bestOf(tours);
   return {
   prompt: `Dispatch’s road map links six stations, numbered 1 to 6. The two-way roads and their lengths in km are ${weightList(ROAD, w)}. A rover leaves the depot at station 1: enter the shortest driving distance from station 1 to station 6, in km. On a separate run, a drone visits four masts, numbered 1 to 4, flying straight between any two of them. The flight lengths in km are ${weightList(P4, t)}. Enter the length of the shortest tour that starts at mast 1, visits every mast once and returns to mast 1.`,
   answer: [d[6], best.total],
   hints: ['Dijkstra’s algorithm: settle the station with the smallest distance so far, then check whether going through it shortens the distance to each of its neighbours. Repeat until station 6 is settled.', 'Four masts give (4 − 1)! ÷ 2 = 3 different tours from mast 1 once reverses are merged. Add up the flights of each and take the smallest.'],
   solution: `Dijkstra’s algorithm settles the stations in order of distance from station 1: ${order.map(v => `station ${v} at ${n(d[v])}`).join(', ')}. The shortest distance to station 6 is ${n(d[6])} km, along ${arrows(route)}. For the drone, the three tours from mast 1 are ${tours.map(x => `${arrows(x.tour)} = ${n(x.total)}`).join(', ')}. The shortest is ${n(best.total)} km.`,
   guidance: [
    { prompt: 'Start Dijkstra’s algorithm at station 1. What are the shortest distances from station 1 to stations 2 and 3?', answer: [d[2], d[3]], explanation: `Station 2: ${n(d[2])} km, along ${arrows(routeTo(2))}. Station 3: ${n(d[3])} km, along ${arrows(routeTo(3))}.` },
    { prompt: 'Carry on settling stations, nearest first. What is the shortest distance from station 1 to station 6?', answer: [d[6]], explanation: `The stations settle as ${order.map(v => `${v} (${n(d[v])})`).join(', ')}. Station 6 is reached along ${arrows(route)}, ${n(d[6])} km.` },
    { prompt: 'For the drone, add up each of the three tours from mast 1. How long is the shortest?', answer: [best.total], explanation: `${tours.map(x => `${arrows(x.tour)} = ${n(x.total)}`).join('; ')}. The smallest is ${n(best.total)} km.` }
   ] }; }
 },
 /* A connected plane drawing with V junctions and E wires, E from V (so at least one closed loop) to 3V − 6 − k,
    so that k more wires still fit without crossings. Not the worked example (V = 6, E = 8). */
 q24: {
  canonical: { V: 9, E: 14, k: 2 },
  draw: R => { let p; do { const V = R.int(5, 20), k = R.int(2, 4); p = { V, k, E: R.int(V, 3 * V - 6 - k) }; } while (p.V === 6 && p.E === 8); return p; },
  build: ({ V, E, k }) => { const F = 2 - V + E, F2 = F + k; return {
   prompt: `A circuit board’s wiring is a connected network of ${V} junctions and ${E} wires, drawn flat on the board so that no two wires cross. The wires divide the board into regions called faces, and the region outside all the wires counts as one face. Enter the number of faces. The designer then adds ${k} more wires, each joining two junctions that are already there, still with no crossings. Enter the number of faces after that.`,
   answer: [F, F2],
   hints: ['Euler’s formula for a connected plane drawing: vertices − edges + faces = 2, or V − E + F = 2. Solve it for F.', 'Each new wire that joins two existing junctions without crossing cuts one face into two.'],
   solution: `Euler’s formula says V − E + F = 2, so F = 2 − V + E = 2 − ${V} + ${E} = ${n(F)}. With ${k} more wires there are ${E + k} edges and still ${V} vertices, so F = 2 − ${V} + ${E + k} = ${n(F2)}: each new wire split one face in two, adding ${k} faces.`,
   guidance: [
    { prompt: `Euler’s formula is V − E + F = 2. What is E − V for ${V} junctions and ${E} wires?`, answer: [E - V], explanation: `${E} − ${V} = ${n(E - V)}.` },
    { prompt: 'Rearranged, F = 2 + E − V. How many faces does the drawing have?', answer: [F], explanation: `F = 2 + ${n(E - V)} = ${n(F)}, counting the outside region.` },
    { prompt: `After ${k} more wires, the drawing has ${E + k} edges. How many faces does it have now?`, answer: [F2], explanation: `F = 2 − ${V} + ${E + k} = ${n(F2)}.` }
   ] }; }
 },
 /* tf = 1 for a layout with no triangles (limit 2V − 4), 0 otherwise (limit 3V − 6). E is within 5 of the limit and
    is a possible simple connected network: at least V, at most V(V − 1) ÷ 2, and with no triangles at most V² ÷ 4. */
 q25: {
  canonical: { V: 12, E: 31, tf: 0 },
  /* Never the worked example: 8 vertices, no triangles, 13 edges. */
  draw: R => { for (;;) { const V = R.int(6, 30), tf = R.bool() ? 1 : 0, lim = tf ? 2 * V - 4 : 3 * V - 6, top = tf ? Math.floor(V * V / 4) : V * (V - 1) / 2;
   const E = Math.max(V, Math.min(top, lim + R.int(-5, 5))); if (!(V === 8 && tf && E === 13)) return { V, tf, E }; } },
  build: ({ V, E, tf }) => { const face = tf ? 4 : 3, lim = tf ? 2 * V - 4 : 3 * V - 6, ok = E <= lim ? 1 : 0; return {
   prompt: `A circuit layout has ${V} components and ${E} wires. Each wire joins two different components, no two wires join the same pair, and the layout is connected.${tf ? ' No three components are all wired to one another, so there are no triangles.' : ''} Enter the largest number of wires a planar layout with ${V} components${tf ? ' and no triangles' : ''} can have. Then enter 1 if ${E} wires is within that limit, so the count does not rule out a flat layout, or 0 if it is over the limit, so the layout can never be drawn without crossings.`,
   answer: [lim, ok],
   hints: [`In a flat drawing every face has at least ${tf ? 'four edges round it when there are no triangles' : 'three edges round it'}, and each edge borders at most two faces. Put that together with Euler’s formula.`, tf ? 'With no triangles the limit is 2V − 4. A count at or below the limit passes; above it, the layout is not planar.' : 'The limit is 3V − 6. A count at or below the limit passes; above it, the layout is not planar.'],
   solution: `Every face has at least ${face} edges round it and each edge borders at most two faces, so ${face}F ≤ 2E. With Euler’s formula F = 2 − V + E this gives E ≤ ${tf ? '2V − 4' : '3V − 6'}. For ${V} components the limit is ${tf ? `2 × ${V} − 4` : `3 × ${V} − 6`} = ${n(lim)}. ${ok ? `${E} is at most ${n(lim)}, so the count does not rule out a flat layout: enter 1.` : `${E} is more than ${n(lim)}, so the layout cannot be planar: enter 0.`}`,
   guidance: [
    { prompt: `What is the fewest edges that can run round one face of this layout?`, answer: [face], explanation: tf ? 'A face needs a closed loop round it, and with no triangles the shortest loop has four edges.' : 'A face needs a closed loop round it, and the shortest loop between different components is a triangle: three edges.' },
    { prompt: `The limit is ${tf ? '2V − 4' : '3V − 6'}. What is it for ${V} components?`, answer: [lim], explanation: `${tf ? `2 × ${V} − 4` : `3 × ${V} − 6`} = ${n(lim)}.` },
    { prompt: `Is ${E} at most ${n(lim)}? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? `Yes, so the edge limit allows a flat layout.` : `No: ${E} wires is too many for any flat layout of ${V} components.` }
   ] }; }
 },
 /* type 0: a regular solid with p-sided faces and q faces at each corner (not the cube, the worked example);
    type 1: a prism whose two ends have m sides (m from 3 to 40, not 4, which is the cube). */
 q26: {
  canonical: { type: 0, p: 5, q: 3, m: 0 },
  draw: R => { if (R.next() < 0.25) { const [p, q] = R.pick([[3, 3], [3, 4], [5, 3], [3, 5]]); return { type: 0, p, q, m: 0 }; } return { type: 1, p: 0, q: 0, m: R.except(3, 40, [4]) }; },
  build: ({ type, p, q, m }) => {
   if (type === 0) { const den = 2 * p + 2 * q - p * q, E = 2 * p * q / den, V = 2 * E / q, F = 2 * E / p; return {
    prompt: `The Circuit Shop is building a sensor cage shaped like a polyhedron: a closed solid with flat faces, straight edges and no holes through it, so its corners and edges can be drawn flat as a connected plane drawing. Every face is a ${FACE[p]} (${p} edges), and exactly ${q} faces meet at every corner. Enter the number of corners V, then of edges E, then of faces F.`,
    answer: [V, E, F],
    hints: ['Count edge ends two ways. Each face has p edges and each edge borders 2 faces, so pF = 2E. Each corner has q edges and each edge has 2 ends, so qV = 2E.', 'Put F = 2E ÷ p and V = 2E ÷ q into V − E + F = 2. Multiplying through by pq gives E = 2pq ÷ (2p + 2q − pq).'],
    solution: `Each face has ${p} edges and each edge borders 2 faces, so ${p}F = 2E. At each corner ${q} faces meet, so ${q} edges meet, and each edge has 2 ends, so ${q}V = 2E. Euler’s formula V − E + F = 2 then gives E = 2pq ÷ (2p + 2q − pq) = ${2 * p * q} ÷ (${2 * p} + ${2 * q} − ${p * q}) = ${2 * p * q} ÷ ${den} = ${n(E)}. So V = 2 × ${n(E)} ÷ ${q} = ${n(V)} and F = 2 × ${n(E)} ÷ ${p} = ${n(F)}. Check: ${n(V)} − ${n(E)} + ${n(F)} = 2. The solid is the ${SOLID[p + ',' + q]}.`,
    guidance: [
     { prompt: `Work out the bottom of the fraction, 2p + 2q − pq, for p = ${p} and q = ${q}.`, answer: [den], labels: ['2p + 2q − pq'], explanation: `${2 * p} + ${2 * q} − ${p * q} = ${den}.` },
     { prompt: `E = 2pq ÷ (2p + 2q − pq). How many edges does the cage have?`, answer: [E], labels: ['edges E'], explanation: `2 × ${p} × ${q} = ${2 * p * q}, and ${2 * p * q} ÷ ${den} = ${n(E)}.` },
     { prompt: `Use qV = 2E and pF = 2E. How many corners and faces are there?`, answer: [V, F], labels: ['corners V', 'faces F'], explanation: `V = ${2 * E} ÷ ${q} = ${n(V)} and F = ${2 * E} ÷ ${p} = ${n(F)}.` }
    ] }; }
   const V = 2 * m, F = m + 2, E = V + F - 2; return {
    prompt: `The Circuit Shop is building a sensor cage shaped like a prism, a kind of polyhedron: a closed solid with flat faces, straight edges and no holes through it, so its corners and edges can be drawn flat as a connected plane drawing. Its two end faces each have ${m} sides, and they are joined by ${m} rectangles. Enter the number of corners V, then of edges E, then of faces F.`,
    answer: [V, E, F],
    hints: ['The corners all lie on the two end faces. The faces are the two ends and the rectangles round the side.', 'With V and F counted, Euler’s formula V − E + F = 2 gives E = V + F − 2.'],
    solution: `Each end face has ${m} corners, so V = 2 × ${m} = ${n(V)}. The faces are the 2 ends and the ${m} rectangles, so F = ${m} + 2 = ${n(F)}. Euler’s formula V − E + F = 2 gives E = V + F − 2 = ${n(V)} + ${n(F)} − 2 = ${n(E)}. Check by counting: ${m} edges round each end and ${m} running between the ends make ${n(E)}.`,
    guidance: [
     { prompt: `Each end face has ${m} corners and the cage has no others. How many corners are there?`, answer: [V], labels: ['corners V'], explanation: `2 × ${m} = ${n(V)}.` },
     { prompt: 'Count the faces: two ends and the rectangles round the side.', answer: [F], labels: ['faces F'], explanation: `${m} + 2 = ${n(F)}.` },
     { prompt: 'Euler’s formula gives E = V + F − 2. How many edges are there?', answer: [E], labels: ['edges E'], explanation: `${n(V)} + ${n(F)} − 2 = ${n(E)}.` }
    ] }; }
 },
 /* A connected network on 6 to 8 chips: bipartite, or bipartite plus one wire inside a bank (which closes an odd
    cycle). Then K_{a,b} with a and b from 2 to 9. */
 q27: {
  canonical: { V: 7, edges: [[1, 3], [1, 5], [2, 3], [2, 6], [3, 4], [4, 5], [4, 7], [5, 6], [6, 7]], a: 4, b: 6 },
  draw: R => { const V = R.int(6, 8), { side, edges } = randomBipartite(R, V, R.int(1, 3));
   if (R.bool()) { const inside = allPairs(V).filter(([x, y]) => side[x] === side[y]); edges.push(R.pick(inside)); }
   let a, b; do { a = R.int(2, 9); b = R.int(2, 9); } while (a === 3 && b === 5); return { V, edges: sortEdges(edges), a, b }; },
  build: ({ V, edges, a, b }) => { const A = adjOf(V, edges), cyc = oddCycle(V, A), bip = cyc ? 0 : 1;
   const col = Array(V + 1).fill(-1); col[1] = 0; const Q = [1]; while (Q.length) { const u = Q.shift(); for (const v of A[u]) if (col[v] < 0) { col[v] = 1 - col[u]; Q.push(v); } }
   const bankA = [], bankB = []; for (let v = 1; v <= V; v++) (col[v] === 0 ? bankA : bankB).push(v);
   return {
   prompt: `The Circuit Shop wants to split ${V} chips, numbered 1 to ${V}, into two banks so that every wire runs from one bank to the other and none stays inside a bank. The wires are ${join(edges.map(dash))}. Enter 1 if the network is bipartite (such a split exists), or 0 if it is not. Then a test rig joins each of ${a} probes to each of ${b} sockets by one wire, making the complete bipartite graph K_{${a},${b}}. Enter its number of wires.`,
   answer: [bip, a * b],
   hints: ['Put chip 1 in bank A, every neighbour of it in bank B, their other neighbours in bank A, and so on. If a wire ever joins two chips of the same bank, the network is not bipartite: that wire closes an odd cycle.', 'In K_{m,n} each of the m vertices on one side is joined to each of the n vertices on the other side, and there are no other edges.'],
   solution: `${bip ? `Banks A = ${join(bankA.map(String))} and B = ${join(bankB.map(String))} work: every wire joins a chip of A to a chip of B, so the network is bipartite: enter 1.` : `The network has the odd cycle ${arrows([...cyc, cyc[0]])}, with ${cyc.length} wires. Going round it the banks would have to alternate A, B, A, … and an odd number of steps cannot end back where it started, so no split exists: enter 0.`} In K_{${a},${b}} each of the ${a} probes has ${b} wires, so there are ${a} × ${b} = ${a * b} wires.`,
   guidance: [
    { prompt: 'Put chip 1 in bank A. Its neighbours must all go in bank B. How many neighbours does chip 1 have?', answer: [A[1].length], explanation: `Chip 1 is wired to ${join(A[1].map(String))}, so ${A[1].length === 1 ? 'that chip goes' : `those ${A[1].length} chips go`} in bank B.` },
    { prompt: 'Keep sorting chips into the opposite bank of their neighbours. Does every wire end up between the banks? Enter 1 for yes, 0 for no.', answer: [bip], explanation: bip ? `Yes: A = ${join(bankA.map(String))} and B = ${join(bankB.map(String))}.` : `No: the cycle ${arrows([...cyc, cyc[0]])} has an odd number of wires, so two chips of one bank end up wired together.` },
    { prompt: `How many wires does K_{${a},${b}} have?`, answer: [a * b], explanation: `Each of the ${a} probes is wired to all ${b} sockets: ${a} × ${b} = ${a * b}.` }
   ] }; }
 },
 /* fam 0: a ring of s (4 to 20); 1: a wheel, a hub and a ring of s (3 to 15); 2: complete on s (3 to 12). Not the
    worked example's ring of 7. Then a connected board of 6 parts whose chromatic number is 2, 3 or 4, kept only when
    it can be proved small: 2 with no odd cycle, 3 with an odd cycle, 4 with four parts all linked to one another. */
 q28: {
  canonical: { fam: 1, s: 6, edges: [[1, 2], [1, 3], [1, 5], [2, 3], [2, 4], [3, 6], [4, 5], [4, 6], [5, 6]] },
  draw: R => { let fam, s; do { fam = R.int(0, 2); s = fam === 0 ? R.int(4, 20) : fam === 1 ? R.int(3, 15) : R.int(3, 12); } while (fam === 0 && s === 7);
   const want = R.pick([2, 3, 3, 4]);
   for (let guard = 0; guard < 300; guard++) {
    const edges = want === 2 ? randomBipartite(R, 6, R.int(1, 3)).edges : sortEdges(allPairs(6).filter(() => R.next() < (want === 3 ? 0.45 : 0.6)));
    const A = adjOf(6, edges); if (!connected(6, A)) continue;
    const k = chromatic(6, A).k, w = maxClique(6, A).length; if (k === want && (k < 4 || w === 4)) return { fam, s, edges }; }
   return { fam, s: fam === 1 ? 6 : s, edges: [[1, 2], [1, 3], [1, 5], [2, 3], [2, 4], [3, 6], [4, 5], [4, 6], [5, 6]] }; },
  build: ({ fam, s, edges }) => { const ka = fam === 0 ? (s % 2 ? 3 : 2) : fam === 1 ? (s % 2 ? 4 : 3) : s;
   const A = adjOf(6, edges), { k, c } = chromatic(6, A), cl = maxClique(6, A), cyc = oddCycle(6, A);
   const what = fam === 0 ? `a ring of ${s} parts, each linked to the next and the last back to the first (the cycle C_${s})` : fam === 1 ? `a wheel: a ring of ${s} parts, each linked to the next and the last back to the first, plus a hub part linked to all ${s}` : `${s} parts with every pair linked (the complete graph K_${s})`;
   const whyA = fam === 0 ? (s % 2 ? `Going round a ring the colours must alternate, and ${s} is odd, so two colours clash where the ring closes; a third colour on one part fixes it: χ = 3.` : `Going round the ring the colours can alternate, and ${s} is even, so the ring closes without a clash: χ = 2.`)
    : fam === 1 ? (s % 2 ? `The hub clashes with every rim part, so it needs a colour of its own. The rim is a ring of ${s}, which is odd, so it needs 3 more: χ = 4.` : `The hub clashes with every rim part, so it needs a colour of its own. The rim is a ring of ${s}, which is even, so 2 more alternate round it: χ = 3.`)
    : `Every part is linked to every other, so no two can share a colour: χ = ${s}.`;
   const whyB = k === 2 ? 'There is a link, so 1 colour is not enough, and 2 colours work.' : k === 3 ? (cl.length === 3 ? `Parts ${join(cl.map(String))} are all linked to one another, so they need 3 different colours.` : `The odd cycle ${arrows([...cyc, cyc[0]])} cannot be done in 2 colours.`) : `Parts ${join(cl.map(String))} are all linked to one another, so they need 4 different colours.`;
   return {
   prompt: `The Circuit Shop tests boards on a rig where any two linked parts must glow different colours. The first board is ${what}. Enter its chromatic number χ, the fewest colours that can do it. The second board has six parts, numbered 1 to 6, with links ${join(edges.map(dash))}. Enter its chromatic number.`,
   answer: [ka, k],
   hints: ['A ring with an even number of parts needs 2 colours and an odd ring needs 3. A hub linked to every part of a ring needs one more colour. In a complete graph every part needs its own colour.', 'For the six parts, find a colouring, then show that fewer colours cannot work: parts that are all linked to one another need different colours, and an odd cycle needs 3.'],
   solution: `For the first board, ${lc(whyA)} On the second board, giving ${classes(6, c, k, 'colour', 'part', 'to')} keeps every pair of linked parts apart, so ${k} colours are enough. ${whyB} So χ = ${k}.`,
   guidance: [
    { prompt: 'What is the chromatic number of the first board?', answer: [ka], explanation: whyA },
    { prompt: 'On the second board, what is the largest number of parts that are all linked to one another?', answer: [cl.length], explanation: cl.length === 2 ? `Parts ${cl[0]} and ${cl[1]} are linked, but no three parts are all linked to one another.` : `Parts ${join(cl.map(String))} are all linked to one another, and no larger group is.` },
    { prompt: 'Colour the second board with as few colours as you can. What is its chromatic number?', answer: [k], explanation: `Giving ${classes(6, c, k, 'colour', 'part', 'to')} works with ${k} colours. ${whyB}` }
   ] }; }
 },
 /* A ring of r exams (5 to 8), non-crossing chords inside it and sometimes a hub exam outside it linked to the whole
    ring, with the labels shuffled. The drawing has no crossings and is connected, so F = 2 − V + E. */
 q29: {
  canonical: { r: 6, chords: [[0, 2], [2, 4]], hub: 1, label: [3, 6, 1, 5, 2, 7, 4] },
  /* A plain ring of 5 with no hub is the worked example, so a ring of 5 always gets a hub or a chord. */
  draw: R => { const r = R.int(5, 8), hub = r === 5 || R.bool() ? 1 : 0, chords = [];
   for (const c of shuffle(R, allPairs(r).map(([a, b]) => [a - 1, b - 1]).filter(([a, b]) => b - a > 1 && !(a === 0 && b === r - 1)))) if (chords.length < R.int(0, r - 3) && !chords.some(d => crosses(c, d))) chords.push(c);
   return { r, chords: chords.sort((x, y) => x[0] - y[0] || x[1] - y[1]), hub, label: shuffle(R, Array.from({ length: r + hub }, (_, i) => i + 1)) }; },
  build: p => { const V = p.r + p.hub, edges = examEdges(p), E = edges.length, F = 2 - V + E, A = adjOf(V, edges), { k, c } = chromatic(V, A), cl = maxClique(V, A);
   const hubL = p.hub ? p.label[p.r] : 0, cyc = oddCycle(V, A, hubL);
   const why = k === 2 ? 'There is at least one conflict, so one slot is not enough.' : cl.length === k ? `Exams ${join(cl.map(String))} all conflict with one another, so they need ${k} different slots.`
    : k === 3 ? `The odd cycle ${arrows([...cyc, cyc[0]])} cannot be done in 2 slots.` : `The odd cycle ${arrows([...cyc, cyc[0]])} needs 3 slots, and exam ${hubL} conflicts with all of them, so it needs a fourth.`;
   return {
   prompt: `The Circuit Shop runs certification exams, and two exams that share a candidate cannot be in the same slot. The conflict network has ${V} exams, numbered 1 to ${V}, with a link for each pair that share a candidate: ${join(edges.map(dash))}. It is connected and is drawn on the planning board with no crossing links. Enter the fewest exam slots needed. Then enter the number of faces of that drawing, counting the region outside it.`,
   answer: [k, F],
   hints: ['Exam slots are colours: linked exams need different slots, so the fewest slots is the chromatic number. Find a colouring, then a reason fewer colours fail (exams all linked to one another, or an odd cycle).', 'The drawing is connected and planar, so Euler’s formula V − E + F = 2 gives F = 2 − V + E. Count the links first.'],
   solution: `Putting ${classes(V, c, k, 'slot', 'exam', 'in')} never puts two linked exams together, so ${k} slots are enough. ${why} So the fewest slots is ${k}. The network has V = ${V} exams and E = ${E} links, so Euler’s formula gives F = 2 − ${V} + ${E} = ${n(F)} faces.`,
   guidance: [
    { prompt: 'Treat slots as colours. What is the fewest number of slots?', answer: [k], explanation: `Putting ${classes(V, c, k, 'slot', 'exam', 'in')} works. ${why}` },
    { prompt: 'How many exams and how many links does the network have?', answer: [V, E], explanation: `${V} exams and ${E} links.` },
    { prompt: 'Use Euler’s formula, F = 2 − V + E. How many faces does the drawing have?', answer: [F], explanation: `F = 2 − ${V} + ${E} = ${n(F)}.` }
   ] }; }
 },
 /* c crew (4 to 6) and t tasks (4 to 6); each crew member can do 1 to 3 tasks. About half the draws leave someone
    without a task. adj[i] lists task numbers (0 = A). */
 q30: {
  canonical: { c: 5, t: 5, adj: [[0, 1], [0], [1, 2, 3], [0, 1], [3, 4]] },
  draw: R => { const c = R.int(4, 6), t = R.int(4, 6), short = R.bool();
   for (let guard = 0; ; guard++) { const adj = Array.from({ length: c }, () => shuffle(R, Array.from({ length: t }, (_, i) => i)).slice(0, R.int(1, 3)).sort((x, y) => x - y));
    const M = bestMatching(c, adj).M, example = c === 4 && t === 4 && JSON.stringify(adj) === '[[0,1],[0],[1,2],[2]]';
    if (!example && ((M < c) === short || guard > 200)) return { c, t, adj }; } },
  build: ({ c, t, adj }) => { const { M, got } = bestMatching(c, adj), idle = c - M, sf = shortfall(c, adj);
   const S = idle ? sf.S : Array.from({ length: c }, (_, i) => i), NS = idle ? sf.N : [...new Set(adj.flat())].sort((x, y) => x - y);
   const pairs = got.map((x, i) => x >= 0 ? `crew ${i + 1} → ${LET[x]}` : '').filter(Boolean);
   return {
   prompt: `The Pumping Station has ${c} crew members, numbered 1 to ${c}, and ${t} pump tasks, labelled ${taskList(Array.from({ length: t }, (_, i) => i))}. Each crew member takes at most one task and each task needs at most one person. ${adj.map((ts, i) => `Crew ${i + 1} can do ${ts.length > 1 ? `${taskList(ts.slice(0, -1)).replace(/ and /g, ', ')} or ${LET[ts[ts.length - 1]]}` : `only ${LET[ts[0]]}`}`).join('. ')}. Enter the largest number of crew who can be given tasks at the same time (the size of a largest matching). Then enter how many crew are left without a task.`,
   answer: [M, idle],
   hints: ['Pair crew to tasks one at a time. If someone is stuck, look for a swap chain: move the crew member who holds a task the stuck person needs to another task that crew member can do, freeing the first task.', 'To show no larger matching exists, find a group of crew who between them can do fewer tasks than there are people in the group: some of them must stay without a task.'],
   solution: `The matching ${join(pairs)} gives ${M} crew a task each, and no two share a task. ${idle ? `Crew members ${join(S.map(i => String(i + 1)))} can only do ${taskList(NS)} between them: ${S.length} people for ${NS.length} task${NS.length > 1 ? 's' : ''}, so at least ${idle} of them must go without. So the largest matching has ${M} pairs and ${idle === 1 ? '1 crew member is' : `${idle} crew members are`} left without a task.` : `Every crew member has a task, so no matching can be larger and no one is left without a task: enter 0.`}`,
   guidance: [
    { prompt: `${idle ? `Look at crew members ${join(S.map(i => String(i + 1)))}.` : 'Look at the whole crew.'} How many different tasks can they do between them?`, answer: [NS.length], explanation: `Between them they can do ${taskList(NS)}: ${NS.length} task${NS.length > 1 ? 's' : ''} for ${S.length} people.` },
    { prompt: 'Build the biggest matching you can, using swap chains when someone is stuck. How many pairs does it have?', answer: [M], explanation: `${uc(join(pairs))}: ${M} pairs.${idle ? ` The group above has more people than tasks, so no matching can have more.` : ''}` },
    { prompt: 'How many crew are left without a task?', answer: [idle], explanation: `${c} − ${M} = ${idle}.` }
   ] }; }
 }
});
})();
