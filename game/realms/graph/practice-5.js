/* Graph theory: networks practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/graph/oracle-p5.js. */
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
   node qa/show-mission.js <id> --realm graph */
const practice = (meta, stepLabels, generator) => {
 generator.canonical = generator.draw(G.rng(5, meta.id, 1));
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};
/* Small graph helpers. Vertices are numbered 1..V; an edge is [a, b] with a < b. */
const pair = (a, b) => a < b ? [a, b] : [b, a];
const sortEdges = edges => edges.map(e => pair(e[0], e[1])).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
const dash = e => `${e[0]}–${e[1]}`;
const join = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const arrows = xs => xs.join(' → ');
const plural = (c, one, many) => `${n(c)} ${c === 1 ? one : many}`;
const sum = xs => xs.reduce((s, x) => s + x, 0);
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const shuffle = (R, xs) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const allPairs = V => { const P = []; for (let a = 1; a <= V; a++) for (let b = a + 1; b <= V; b++) P.push([a, b]); return P; };
const degreesOf = (V, edges) => { const d = Array(V + 1).fill(0); for (const [a, b] of edges) { d[a]++; d[b]++; } return d.slice(1); };
/* Tours of a complete network of k stations. P lists the pairs in the order the weights w are given. */
const wOf = (P, w) => (a, b) => w[P.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a))];
const weightList = (P, w) => P.map((e, i) => `${dash(e)}: ${n(w[i])}`).join(', ');
const distinct = (R, count, top) => shuffle(R, Array.from({ length: top }, (_, i) => i + 1)).slice(0, count);
const nnTour = (k, W, s) => { const tour = [s], legs = [], seen = new Set([s]); let cur = s;
 while (tour.length < k) { let best = 0; for (let v = 1; v <= k; v++) if (!seen.has(v) && (!best || W(cur, v) < W(cur, best))) best = v; legs.push(W(cur, best)); tour.push(best); seen.add(best); cur = best; }
 legs.push(W(cur, s)); tour.push(s); return { tour, legs, total: sum(legs) }; };
const allTours = (k, W, s) => { const rest = []; for (let v = 1; v <= k; v++) if (v !== s) rest.push(v); const out = [];
 const perm = (pre, left) => { if (!left.length) { if (pre[0] < pre[pre.length - 1]) { const t = [s, ...pre, s]; let tot = 0; for (let i = 0; i < k; i++) tot += W(t[i], t[i + 1]); out.push({ tour: t, total: tot }); } return; }
  left.forEach((v, i) => perm([...pre, v], left.filter((_, j) => j !== i))); };
 perm([], rest); return out; };
const bestOf = tours => tours.reduce((b, t) => t.total < b.total ? t : b);
/* Dijkstra on two-way roads: distances from s, the road taken to each station, and the order stations are settled (ties by label). */
const dijkstra = (V, edges, w, s) => { const d = Array(V + 1).fill(Infinity), done = Array(V + 1).fill(false), prev = Array(V + 1).fill(0), order = []; d[s] = 0;
 for (;;) { let u = 0; for (let v = 1; v <= V; v++) if (!done[v] && d[v] < Infinity && (!u || d[v] < d[u])) u = v; if (!u) break; done[u] = true; order.push(u);
  edges.forEach(([a, b], i) => { const o = a === u ? b : b === u ? a : 0; if (o && !done[o] && d[u] + w[i] < d[o]) { d[o] = d[u] + w[i]; prev[o] = u; } }); }
 return { d, prev, order }; };
const routeTo = (prev, s, v) => { const r = [v]; while (r[0] !== s) r.unshift(prev[r[0]]); return r; };
/* A network on V vertices made by deleting edges of the complete network at random while both ends keep more than the
   target degree; after one pass the smallest degree is at least the target. */
const thin = (R, V, target, p = 1) => { const deg = Array(V + 1).fill(V - 1), keep = [];
 for (const [a, b] of shuffle(R, allPairs(V))) { if (deg[a] > target && deg[b] > target && R.next() < p) { deg[a]--; deg[b]--; } else keep.push([a, b]); }
 return sortEdges(keep); };
const thinTarget = (R, V) => { const need = Math.ceil(V / 2); return R.bool() ? need + R.int(0, 1) : Math.max(2, need - R.int(1, 2)); };

/* ---- q21 The nearest-neighbour method [O12.9] ---- */
const P5 = allPairs(5), P6 = allPairs(6), P7 = allPairs(7);

practice({ id: 'q21b', parent: 'q21', kind: 'setting', title: 'The tanker that tops up the nearest tank',
 brief: 'The water tanker has to top up five storage tanks in one round, and the driver wants a rule simple enough to follow without a map.',
 labels: ['length of the round (km)', 'last tank topped up'], tolerance: 0.01 },
 [['nearest tank', 'track length (km)'], ['last tank topped up'], ['length of the round (km)']], {
 /* Ten different track lengths, so the nearest tank is never a tie. The parent's worked example has four stations. */
 draw: R => ({ s: R.int(1, 5), w: distinct(R, 10, 25) }),
 build: ({ s, w }) => { const W = wOf(P5, w), nn = nnTour(5, W, s), last = nn.tour[4];
  const legs = nn.tour.slice(1, 5).map((v, i) => `from tank ${nn.tour[i]} the nearest tank still to fill is tank ${v} (${n(nn.legs[i])} km)`);
  return {
  prompt: `A water tanker starts at tank ${s} of five storage tanks, numbered 1 to 5. It has to top up every other tank once and then drive back to tank ${s}. Every pair of tanks is joined by a direct track; the track lengths in km are ${weightList(P5, w)}. The driver follows the nearest-neighbour method: from the tank where the tanker is, always go to the nearest tank that has not been topped up yet. Enter the length of the whole round in km, including the drive home. Then enter the number of the last tank topped up before the tanker heads home.`,
  answer: [nn.total, last],
  hints: ['At each tank, look only at the tracks to tanks not yet topped up and take the shortest. When every tank is done, add the track back to the start.', 'The last tank topped up is the last one in your list before the start appears again.'],
  solution: `${legs.join('; ').replace(/^f/, 'F')}; then home from tank ${last} to tank ${s} (${n(nn.legs[4])} km). The round ${arrows(nn.tour)} is ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km. The last tank topped up is tank ${last}.`,
  guidance: [
   { prompt: `Start at tank ${s}. Which tank is nearest to it, and how long is that track?`, answer: [nn.tour[1], nn.legs[0]], explanation: `The four tracks out of tank ${s} are ${nn.tour.slice(1, 5).slice().sort((a, b) => a - b).map(v => `${dash(pair(s, v))}: ${n(W(s, v))}`).join(', ')}. The shortest goes to tank ${nn.tour[1]}, ${n(nn.legs[0])} km.` },
   { prompt: 'Keep going to the nearest tank not yet topped up. Which tank is the last one topped up?', answer: [last], explanation: `The order is ${arrows(nn.tour.slice(0, 5))}, so the last tank topped up is tank ${last}.` },
   { prompt: 'Add up every track of the round, including the drive back to the start. How long is it?', answer: [nn.total], explanation: `${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km.` }
  ] }; }
});

practice({ id: 'q21c', parent: 'q21', kind: 'applied', title: 'Fuel for the survey buggy',
 brief: 'A survey buggy must call at five beacons on one tank of fuel, and Mira wants to know whether the quick nearest-neighbour round leaves any spare.',
 labels: ['length of the round (km)', 'litres burned', 'litres left'], tolerance: 0.01 },
 [['length of the round (km)'], ['litres burned'], ['litres left']], {
 /* The tank always holds 10 to 60 litres more than the round needs. */
 draw: R => { const s = R.int(1, 5), w = distinct(R, 10, 25), r = R.int(2, 6), tot = nnTour(5, wOf(P5, w), s).total; return { s, w, r, tank: tot * r + R.int(10, 60) }; },
 build: ({ s, w, r, tank }) => { const W = wOf(P5, w), nn = nnTour(5, W, s), burned = nn.total * r, left = tank - burned;
  return {
  prompt: `A survey buggy starts at beacon ${s} of five beacons, numbered 1 to 5. It has to visit every other beacon once and then drive back to beacon ${s}. Every pair of beacons is joined by a direct track; the track lengths in km are ${weightList(P5, w)}. The driver uses the nearest-neighbour method: from the beacon where the buggy is, always go to the nearest beacon not yet visited. The buggy burns ${plural(r, 'litre', 'litres')} of fuel per km and starts with a full tank of ${n(tank)} litres. Enter the length of the whole round in km, including the drive home. Then enter the litres of fuel burned on the round. Then enter the litres left in the tank at the end.`,
  answer: [nn.total, burned, left],
  hints: ['Go to the nearest beacon not yet visited each time, then drive back to the start, and add up every track used.', 'Fuel burned is the number of km times the litres burned per km. What is left is the full tank minus the fuel burned.'],
  solution: `The nearest-neighbour round is ${arrows(nn.tour)}, with tracks ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km. At ${n(r)} litres per km the buggy burns ${n(nn.total)} × ${n(r)} = ${n(burned)} litres, which leaves ${n(tank)} − ${n(burned)} = ${n(left)} litres.`,
  guidance: [
   { prompt: `Start at beacon ${s} and always go to the nearest beacon not yet visited, then return. How long is the round in km?`, answer: [nn.total], explanation: `The round is ${arrows(nn.tour)}, and its tracks add up to ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km.` },
   { prompt: `The round is ${n(nn.total)} km and the buggy burns ${n(r)} litres per km. How many litres does it burn?`, answer: [burned], explanation: `${n(nn.total)} × ${n(r)} = ${n(burned)} litres.` },
   { prompt: `The tank held ${n(tank)} litres and ${n(burned)} were burned. How many litres are left?`, answer: [left], explanation: `${n(tank)} − ${n(burned)} = ${n(left)} litres.` }
  ] }; }
});

practice({ id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q19', title: 'A long round of ridge stations',
 brief: 'The ridge round now has six or seven stations, far too many to check tour by tour, and Mira wants the quick answer and the size of the search it saves.',
 labels: ['nearest-neighbour round (km)', 'tours brute force would check'], tolerance: 0.01 },
 [['nearest-neighbour round (km)'], ['tours with direction counted'], ['tours with reverses merged']], {
 /* Different road lengths (no ties) on 6 or 7 stations: 60 or 360 tours to check. */
 draw: R => { const k = R.pick([6, 7]); return { k, s: R.int(1, k), w: distinct(R, k * (k - 1) / 2, 40) }; },
 build: ({ k, s, w }) => { const P = allPairs(k), W = wOf(P, w), nn = nnTour(k, W, s), all = fact(k - 1), merged = all / 2;
  return {
  prompt: `Dispatch plans a round of ${k} ridge stations, numbered 1 to ${k}. A rover starts at station ${s}, visits every other station once and drives back to station ${s}. Every pair of stations is joined by a direct road; the road lengths in km are ${weightList(P, w)}. Use the nearest-neighbour method from station ${s} and enter the length of the round in km. Brute force would list every different tour from station ${s}, counting a tour and its reverse as one. Enter how many tours that is.`,
  answer: [nn.total, merged],
  hints: ['Drive to the nearest station not yet visited each time, then back to the start, and add up the roads used.', 'From a fixed start there are (n − 1)! tours when direction counts, where n is the number of stations. A tour and its reverse have the same length, so merge them in pairs.'],
  solution: `The nearest-neighbour round is ${arrows(nn.tour)}: ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km. From a fixed start there are (${k} − 1)! = ${n(all)} tours with direction counted, and merging each tour with its reverse halves that: ${n(all)} ÷ 2 = ${n(merged)} tours for brute force.`,
  guidance: [
   { prompt: `Start at station ${s} and always go to the nearest station not yet visited, then return. How long is the round in km?`, answer: [nn.total], explanation: `The round is ${arrows(nn.tour)}, and its roads add up to ${nn.legs.map(n).join(' + ')} = ${n(nn.total)} km.` },
   { prompt: `How many tours are there from station ${s} when direction counts? That is (${k} − 1)!, the product of the whole numbers from 1 to ${k - 1}.`, answer: [all], explanation: `${Array.from({ length: k - 1 }, (_, i) => i + 1).join(' × ')} = ${n(all)}.` },
   { prompt: `Each tour and its reverse have the same length. How many different tours remain when they are merged?`, answer: [merged], explanation: `${n(all)} ÷ 2 = ${n(merged)}.` }
  ] }; }
});

/* ---- q22 Hamilton paths and Dirac's theorem [O12.8, KT5.3] ---- */

practice({ id: 'q22b', parent: 'q22', kind: 'setting', title: 'Drone pads and the courier loop',
 brief: 'A courier drone should be able to loop through every landing pad once, and Mira wants a quick test of whether the corridor network guarantees it.',
 labels: ['smallest degree', 'degree Dirac needs', 'Dirac guarantees (1 or 0)'], tolerance: 0.01 },
 [['smallest degree'], ['degree Dirac needs'], ['Dirac guarantees (1 or 0)']], {
 /* 6 to 8 pads, so never the five stations of the parent's worked example. */
 draw: R => { const V = R.pick([6, 7, 8]); return { n: V, edges: thin(R, V, thinTarget(R, V)) }; },
 build: ({ n: V, edges }) => { const deg = degreesOf(V, edges), d = Math.min(...deg), need = Math.ceil(V / 2), ok = d >= V / 2 ? 1 : 0, low = deg.map((x, i) => x === d ? i + 1 : 0).filter(Boolean);
  return {
  prompt: `${V} drone landing pads, numbered 1 to ${V}, are joined by flight corridors. There is at most one corridor between two pads and no corridor from a pad to itself. The corridors are ${join(sortEdges(edges).map(dash))}. A courier loop is a route that visits every pad exactly once and returns to where it began. Enter the smallest degree in the network: the fewest corridors at any one pad. Then enter the smallest degree every pad must have for Dirac’s theorem to guarantee a courier loop (a whole number). Then enter 1 if this network meets that, or 0 if the theorem gives no guarantee.`,
  answer: [d, need, ok],
  hints: ['The degree of a pad is the number of corridors that end at it. Count them at every pad and keep the smallest count.', 'Dirac’s theorem needs every degree to be at least half the number of pads. A degree is a whole number, so when half is not a whole number, round up.'],
  solution: `The degrees of pads 1 to ${V} are ${join(deg.map(String))}, so the smallest degree is ${n(d)} (at pad${low.length > 1 ? 's' : ''} ${join(low.map(String))}). Half of ${V} is ${n(V / 2)}, and a degree is a whole number, so Dirac’s theorem needs a degree of at least ${n(need)} at every pad. ${ok ? `${n(d)} is at least ${n(need)}, so a courier loop is guaranteed: enter 1.` : `${n(d)} is less than ${n(need)}, so the theorem gives no guarantee: enter 0. A loop may or may not exist; the theorem simply does not decide.`}`,
  guidance: [
   { prompt: 'Count the corridors at each pad. What is the smallest degree?', answer: [d], explanation: `Pad by pad the degrees are ${join(deg.map(String))}. The smallest is ${n(d)}.` },
   { prompt: `Dirac’s theorem needs every degree to be at least ${V} ÷ 2. What is the smallest whole number that is at least ${V} ÷ 2?`, answer: [need], explanation: `${V} ÷ 2 = ${n(V / 2)}${V % 2 ? `, and a degree is a whole number, so the next whole number up, ${n(need)}, is needed` : ''}.` },
   { prompt: `Is the smallest degree, ${n(d)}, at least ${n(need)}? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? `Yes. Every pad has at least ${n(need)} corridors, so a courier loop is guaranteed.` : `No. At least one pad has fewer than ${n(need)} corridors, so the theorem gives no guarantee.` }
  ] }; }
});

practice({ id: 'q22c', parent: 'q22', kind: 'applied', title: 'Reading the relay logs',
 brief: 'The relay log only records how many links end at each station, and Mira wants the link count and the Hamilton cycle check from those numbers alone.',
 labels: ['links in the network', 'smallest degree', 'Dirac guarantees (1 or 0)'], tolerance: 0.01 },
 [['sum of the degrees'], ['links in the network', 'smallest degree'], ['Dirac guarantees (1 or 0)']], {
 /* The readings are the degrees of a real network on 7 to 10 stations. */
 draw: R => { const V = R.pick([7, 8, 9, 10]); return { n: V, deg: degreesOf(V, thin(R, V, thinTarget(R, V), 0.75)) }; },
 build: ({ n: V, deg }) => { const tot = sum(deg), E = tot / 2, d = Math.min(...deg), half = V / 2, ok = d >= half ? 1 : 0;
  return {
  prompt: `A relay network links ${V} stations, numbered 1 to ${V}. There is at most one link between two stations and no link from a station to itself. The log lists how many links end at each station: ${deg.map((x, i) => `station ${i + 1}: ${n(x)}`).join(', ')}. Enter the number of links in the whole network. Then enter the smallest degree. Then enter 1 if Dirac’s theorem guarantees a Hamilton cycle through all ${V} stations, or 0 if the theorem gives no guarantee.`,
  answer: [E, d, ok],
  hints: ['Every link has two ends, so adding up all the degrees counts each link twice. The number of links is half of that total.', 'Dirac’s theorem needs every degree to be at least half the number of stations. When half is not a whole number, a degree must reach the next whole number up.'],
  solution: `The degrees add up to ${deg.map(n).join(' + ')} = ${n(tot)}, and each link is counted at both ends, so there are ${n(tot)} ÷ 2 = ${n(E)} links. The smallest degree is ${n(d)}. Half of ${V} is ${n(half)}. ${ok ? `${n(d)} is at least ${n(half)}, so Dirac’s theorem guarantees a Hamilton cycle: enter 1.` : `${n(d)} is less than ${n(half)}, so the theorem gives no guarantee: enter 0.`}`,
  guidance: [
   { prompt: 'Add up all the degrees in the log. What is the total?', answer: [tot], explanation: `${deg.map(n).join(' + ')} = ${n(tot)}.` },
   { prompt: `Each link has two ends, so the total ${n(tot)} counts every link twice. How many links are there? Then give the smallest degree in the log.`, answer: [E, d], explanation: `${n(tot)} ÷ 2 = ${n(E)} links. The smallest number in the log is ${n(d)}.` },
   { prompt: `Is the smallest degree, ${n(d)}, at least ${V} ÷ 2 = ${n(half)}? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? `Yes. Every station has at least ${n(Math.ceil(half))} links, so Dirac’s theorem guarantees a Hamilton cycle.` : `No. At least one station has fewer than ${n(half)} links, so the theorem gives no guarantee.` }
  ] }; }
});

practice({ id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q03', title: 'The relays that lost links',
 brief: 'A storm has cut several links in a network that once joined every pair of stations, and Mira wants to know if a Hamilton cycle is still guaranteed.',
 labels: ['links still working', 'smallest degree', 'Dirac guarantees (1 or 0)'], tolerance: 0.01 },
 [['links still working'], ['smallest degree'], ['Dirac guarantees (1 or 0)']], {
 /* 8 to 12 stations. One station loses k links, k being the most a station can lose and still pass Dirac, or one more;
    a few more links are cut between other stations, none of which loses more than k. */
 draw: R => { const V = R.int(8, 12), k = V - 1 - Math.ceil(V / 2) + R.int(0, 1), f = R.int(1, V), lost = Array(V + 1).fill(0), cuts = [];
  for (const o of shuffle(R, Array.from({ length: V }, (_, i) => i + 1).filter(v => v !== f)).slice(0, k)) { cuts.push(pair(f, o)); lost[f]++; lost[o]++; }
  for (let t = 0, extra = R.int(1, 4); t < 30 && extra > 0; t++) { const a = R.int(1, V), b = R.int(1, V);
   if (a !== b && a !== f && b !== f && lost[a] < k && lost[b] < k && !cuts.some(c => c[0] === Math.min(a, b) && c[1] === Math.max(a, b))) { cuts.push(pair(a, b)); lost[a]++; lost[b]++; extra--; } }
  return { n: V, cuts: sortEdges(cuts) }; },
 build: ({ n: V, cuts }) => { const lost = degreesOf(V, cuts), E = V * (V - 1) / 2 - cuts.length, worst = Math.max(...lost), d = V - 1 - worst, half = V / 2, ok = d >= half ? 1 : 0, hit = lost.map((x, i) => x === worst ? i + 1 : 0).filter(Boolean);
  return {
  prompt: `A relay network of ${V} stations, numbered 1 to ${V}, once had a link between every pair of stations. A storm has cut ${n(cuts.length)} links: ${join(cuts.map(dash))}. No other link is damaged, and no new link has been added. Enter the number of links still working (a network with every pair linked has n × (n − 1) ÷ 2 links, where n is the number of stations). Then enter the smallest degree among the stations now. Then enter 1 if Dirac’s theorem guarantees a Hamilton cycle through all ${V} stations, or 0 if the theorem gives no guarantee.`,
  answer: [E, d, ok],
  hints: ['Take the number of links in the complete network and subtract the number of cut links.', 'In the complete network every station has degree n − 1. Each cut link takes one from each of its two ends, so the station named in the most cut links now has the smallest degree. Then compare with n ÷ 2.'],
  solution: `The complete network on ${V} stations has ${V} × ${V - 1} ÷ 2 = ${n(V * (V - 1) / 2)} links, so ${n(V * (V - 1) / 2)} − ${n(cuts.length)} = ${n(E)} links still work. Station${hit.length > 1 ? 's' : ''} ${join(hit.map(String))} appear${hit.length > 1 ? '' : 's'} in the most cut links, ${n(worst)}, so the smallest degree is ${V - 1} − ${n(worst)} = ${n(d)}. Half of ${V} is ${n(half)}. ${ok ? `${n(d)} is at least ${n(half)}, so Dirac’s theorem guarantees a Hamilton cycle: enter 1.` : `${n(d)} is less than ${n(half)}, so the theorem gives no guarantee: enter 0.`}`,
  guidance: [
   { prompt: `A network with every pair of ${V} stations linked has ${n(V * (V - 1) / 2)} links. How many links still work after ${n(cuts.length)} were cut?`, answer: [E], explanation: `${n(V * (V - 1) / 2)} − ${n(cuts.length)} = ${n(E)}.` },
   { prompt: `Every station started with degree ${V - 1}. Count the cut links at each station: the station in the most of them has lost the most. What is the smallest degree now?`, answer: [d], explanation: `The most cut links at one station is ${n(worst)}, so the smallest degree is ${V - 1} − ${n(worst)} = ${n(d)}.` },
   { prompt: `Is the smallest degree, ${n(d)}, at least ${V} ÷ 2 = ${n(half)}? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? `Yes. Every station has at least ${n(Math.ceil(half))} working links, so Dirac’s theorem guarantees a Hamilton cycle.` : `No. At least one station has fewer than ${n(half)} working links, so the theorem gives no guarantee.` }
  ] }; }
});

/* ---- q23 Chapter review: the dispatch plan [O12.7, O12.9] ---- */
const P4 = allPairs(4);
/* Two-way road maps. The parent uses a different map of six stations. */
const PIPES = [[1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6]];
const HAUL = [[1, 2], [1, 3], [1, 6], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 6]];
const RIDGE = [[1, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 6], [5, 7], [6, 7]];

practice({ id: 'q23b', parent: 'q23', kind: 'setting', title: 'The pipe map and the valve round',
 brief: 'A repair crew needs the shortest way along the water pipes to the far pumping station, and an inspection robot needs the shortest round of four valves.',
 labels: ['shortest distance to 6 (km)', 'shortest round of valves (m)'], tolerance: 0.01 },
 [['distance to 2 (km)', 'distance to 3 (km)'], ['shortest distance to 6 (km)'], ['shortest round of valves (m)']], {
 draw: R => ({ w: PIPES.map(() => R.int(1, 15)), t: P4.map(() => R.int(2, 20)) }),
 build: ({ w, t }) => { const { d, prev, order } = dijkstra(6, PIPES, w, 1), route = routeTo(prev, 1, 6), T = wOf(P4, t), tours = allTours(4, T, 1), best = bestOf(tours);
  return {
  prompt: `A water-pipe map links six pumping stations, numbered 1 to 6. The pipes carry water both ways, and the pipe lengths in km are ${weightList(PIPES, w)}. A repair crew leaves the store at station 1 and must drive along the pipes: enter the shortest distance from station 1 to station 6, in km. On a separate job, an inspection robot visits four valves, numbered 1 to 4, moving in a straight line between any two of them. The straight-line distances in m are ${weightList(P4, t)}. Enter the length in m of the shortest round that starts at valve 1, visits every valve once and returns to valve 1.`,
  answer: [d[6], best.total],
  hints: ['Dijkstra’s algorithm: settle the station with the smallest distance so far, then check whether going through it shortens the distance to each of its neighbours. Repeat until station 6 is settled.', 'Four valves give (4 − 1)! ÷ 2 different rounds from valve 1 once reverses are merged. Add up the distances of each and take the smallest.'],
  solution: `Dijkstra’s algorithm settles the stations in order of distance from station 1: ${order.map(v => `station ${v} at ${n(d[v])}`).join(', ')}. The shortest distance to station 6 is ${n(d[6])} km, along ${arrows(route)}. For the robot, the three rounds from valve 1 are ${tours.map(x => `${arrows(x.tour)} = ${n(x.total)}`).join(', ')}. The shortest is ${n(best.total)} m.`,
  guidance: [
   { prompt: 'Start Dijkstra’s algorithm at station 1. What are the shortest distances from station 1 to stations 2 and 3?', answer: [d[2], d[3]], explanation: `Station 2: ${n(d[2])} km, along ${arrows(routeTo(prev, 1, 2))}. Station 3: ${n(d[3])} km, along ${arrows(routeTo(prev, 1, 3))}.` },
   { prompt: 'Carry on settling stations, nearest first. What is the shortest distance from station 1 to station 6?', answer: [d[6]], explanation: `The stations settle as ${order.map(v => `${v} (${n(d[v])})`).join(', ')}. Station 6 is reached along ${arrows(route)}, ${n(d[6])} km.` },
   { prompt: 'For the robot, add up each of the three rounds from valve 1. How long is the shortest?', answer: [best.total], explanation: `${tours.map(x => `${arrows(x.tour)} = ${n(x.total)}`).join('; ')}. The smallest is ${n(best.total)} m.` }
  ] }; }
});

practice({ id: 'q23c', parent: 'q23', kind: 'applied', title: 'The detour that costs fuel',
 brief: 'A hauler can take a long direct road to the far station or a roundabout route of shorter roads, and Mira wants the fuel the better choice saves.',
 labels: ['shortest distance (km)', 'km saved', 'litres saved'], tolerance: 0.01 },
 [['shortest distance (km)'], ['km saved'], ['litres saved']], {
 /* The direct road 1–6 is always 3 to 12 km longer than the shortest route that avoids it. */
 draw: R => { const base = HAUL.filter(e => !(e[0] === 1 && e[1] === 6)), wb = base.map(() => R.int(1, 12)), best = dijkstra(6, base, wb, 1).d[6], extra = R.int(3, 12);
  let k = 0; return { w: HAUL.map(e => e[0] === 1 && e[1] === 6 ? best + extra : wb[k++]), r: R.int(2, 8) }; },
 build: ({ w, r }) => { const { d, prev } = dijkstra(6, HAUL, w, 1), direct = w[2], route = routeTo(prev, 1, 6), saved = direct - d[6], litres = saved * r;
  return {
  prompt: `A hauler drives from station 1 to station 6 on Dispatch’s road map of six stations. The two-way roads and their lengths in km are ${weightList(HAUL, w)}. Enter the shortest driving distance from station 1 to station 6, in km. The hauler could instead take the direct road 1–6. Enter how many km the shortest route saves compared with the direct road. The hauler burns ${plural(r, 'litre', 'litres')} of fuel per km: enter the litres saved by taking the shortest route.`,
  answer: [d[6], saved, litres],
  hints: ['Dijkstra’s algorithm: settle the station with the smallest distance so far, then check whether going through it shortens the distance to each of its neighbours. Repeat until station 6 is settled.', 'Km saved is the length of the direct road minus the shortest distance. Litres saved is the km saved times the litres burned per km.'],
  solution: `Dijkstra’s algorithm gives a shortest distance of ${n(d[6])} km to station 6, along ${arrows(route)}. The direct road 1–6 is ${n(direct)} km, so the shortest route saves ${n(direct)} − ${n(d[6])} = ${n(saved)} km. At ${n(r)} litres per km that is ${n(saved)} × ${n(r)} = ${n(litres)} litres.`,
  guidance: [
   { prompt: 'Run Dijkstra’s algorithm from station 1, settling the nearest station each time. What is the shortest distance from station 1 to station 6?', answer: [d[6]], explanation: `The shortest route is ${arrows(route)}, ${n(d[6])} km.` },
   { prompt: `The direct road 1–6 is ${n(direct)} km. How many km does the shortest route save?`, answer: [saved], explanation: `${n(direct)} − ${n(d[6])} = ${n(saved)} km.` },
   { prompt: `The hauler burns ${n(r)} litres per km and saves ${n(saved)} km. How many litres does that save?`, answer: [litres], explanation: `${n(saved)} × ${n(r)} = ${n(litres)} litres.` }
  ] }; }
});

practice({ id: 'q23d', parent: 'q23', kind: 'challenge', title: 'Calling at the depot on the way',
 brief: 'The rover must call at a depot on its way to the far ridge station, and Mira wants to know how much longer that makes the drive.',
 labels: ['shortest distance to 7 (km)', 'shortest drive via the depot (km)', 'extra distance (km)'], tolerance: 0.01 },
 [['shortest distance to 7 (km)'], ['distance to the depot (km)', 'depot to station 7 (km)'], ['extra distance (km)']], {
 /* Seven stations; the depot is a station from 2 to 6 that is not on a shortest route, so the extra is above 0. */
 draw: R => { for (;;) { const w = RIDGE.map(() => R.int(1, 15)), m = R.int(2, 6), a = dijkstra(7, RIDGE, w, 1), b = dijkstra(7, RIDGE, w, 7);
  if (a.d[m] + b.d[m] > a.d[7]) return { w, m }; } },
 build: ({ w, m }) => { const a = dijkstra(7, RIDGE, w, 1), b = dijkstra(7, RIDGE, w, 7), direct = a.d[7], via = a.d[m] + b.d[m], extra = via - direct, route = routeTo(a.prev, 1, 7);
  return {
  prompt: `Dispatch’s road map links seven ridge stations, numbered 1 to 7. The two-way roads and their lengths in km are ${weightList(RIDGE, w)}. A rover drives from station 1 to station 7. Enter the shortest driving distance, in km. The rover must call at the depot at station ${m} on the way, using any roads it likes: enter the shortest drive from station 1 to station 7 that passes through station ${m}, in km. Then enter how many km longer that is than the shortest drive.`,
  answer: [direct, via, extra],
  hints: ['Dijkstra’s algorithm: settle the station with the smallest distance so far, then check whether going through it shortens the distance to each of its neighbours. Repeat until the target is settled.', 'A drive that passes through the depot is a shortest drive from the start to the depot, followed by a shortest drive from the depot to the end. Roads run both ways, so a shortest distance from the end to the depot is the same as from the depot to the end.'],
  solution: `Dijkstra’s algorithm from station 1 gives a shortest distance of ${n(direct)} km to station 7, along ${arrows(route)}. It also gives ${n(a.d[m])} km from station 1 to station ${m}. Dijkstra’s algorithm from station 7 gives ${n(b.d[m])} km from station 7 to station ${m}, and roads run both ways, so station ${m} to station 7 is ${n(b.d[m])} km. The shortest drive through station ${m} is ${n(a.d[m])} + ${n(b.d[m])} = ${n(via)} km, which is ${n(via)} − ${n(direct)} = ${n(extra)} km longer.`,
  guidance: [
   { prompt: 'Run Dijkstra’s algorithm from station 1. What is the shortest distance from station 1 to station 7?', answer: [direct], explanation: `The shortest route is ${arrows(route)}, ${n(direct)} km.` },
   { prompt: `What is the shortest distance from station 1 to the depot at station ${m}, and from station ${m} to station 7?`, answer: [a.d[m], b.d[m]], explanation: `Station 1 to station ${m}: ${n(a.d[m])} km, along ${arrows(routeTo(a.prev, 1, m))}. Station 7 to station ${m}: ${n(b.d[m])} km, along ${arrows(routeTo(b.prev, 7, m))}; the roads run both ways, so station ${m} to station 7 is the same.` },
   { prompt: `Add the two distances to get the shortest drive through station ${m}. How many km longer is it than the shortest drive?`, answer: [extra], explanation: `${n(a.d[m])} + ${n(b.d[m])} = ${n(via)} km, and ${n(via)} − ${n(direct)} = ${n(extra)} km.` }
  ] }; }
});

/* ---- q24 Planar graphs and Euler's formula [KT5.5] ---- */

practice({ id: 'q24b', parent: 'q24', kind: 'setting', title: 'Windows in a solar plate',
 brief: 'The Circuit Shop has found a solar plate that lists its copper bars and its windows but not its cells, and Mira wants the cells counted from that.',
 labels: ['cells', 'closed windows'], tolerance: 0.01 },
 [['E − F'], ['cells'], ['closed windows']], {
 /* The bars E run from V (at least one loop) to 3V − 6; never the worked example (6 vertices, 8 edges). */
 draw: R => { let p; do { const V = R.int(6, 30); p = { V, E: R.int(V, 3 * V - 6) }; } while (p.V === 6 && p.E === 8); return p; },
 build: ({ V, E }) => { const F = 2 - V + E;
  return {
  prompt: `A solar plate carries cells joined by thin copper bars. Drawn flat, the bars never cross, and they link all the cells into one connected pattern. The bars cut the plate into windows, and the open area outside all the bars counts as one window too. The pattern has ${n(E)} bars and ${n(F)} windows in all. Enter the number of cells. Then enter the number of windows that are closed in by bars on every side, not counting the outside one.`,
  answer: [V, F - 1],
  hints: ['Euler’s formula for a connected plane drawing is V − E + F = 2, with the cells as the vertices V, the bars as the edges E and the windows as the faces F. Solve it for V.', 'The outside area is one of the windows, so take it away to count only the closed ones.'],
  solution: `Euler’s formula says V − E + F = 2, so V = 2 + E − F = 2 + ${n(E)} − ${n(F)} = ${n(V)} cells. One of the ${n(F)} windows is the outside area, so ${n(F)} − 1 = ${n(F - 1)} window${F - 1 === 1 ? ' is' : 's are'} closed in by bars.`,
  guidance: [
   { prompt: `Euler’s formula is V − E + F = 2, so V = 2 + E − F. What is E − F for ${n(E)} bars and ${n(F)} windows?`, answer: [E - F], explanation: `${n(E)} − ${n(F)} = ${n(E - F)}.` },
   { prompt: 'Now V = 2 + (E − F). How many cells are there?', answer: [V], explanation: `V = 2 + ${n(E - F)} = ${n(V)}.` },
   { prompt: `There are ${n(F)} windows in all, and one of them is the outside area. How many windows are closed in by bars?`, answer: [F - 1], explanation: `${n(F)} − 1 = ${n(F - 1)}.` }
  ] }; }
});

practice({ id: 'q24c', parent: 'q24', kind: 'applied', title: 'The grid of test pads',
 brief: 'The shop is etching a rectangular grid of test pads, and Mira wants the number of squares it will cut the board into before anything is etched.',
 labels: ['wires', 'faces', 'small squares'], tolerance: 0.01 },
 [['wires'], ['faces'], ['small squares']], {
 draw: R => ({ a: R.int(3, 10), b: R.int(3, 10) }),
 build: ({ a, b }) => { const V = a * b, E = a * (b - 1) + b * (a - 1), F = 2 - V + E;
  return {
  prompt: `A test board has ${n(a)} rows of ${n(b)} pads each, laid out in a grid. Each pad is joined by one wire to the pad next to it on its left, right, above and below, wherever there is one, and no other wires are used, so no wires cross. Enter the number of wires on the board. Then use Euler’s formula to find the number of faces, and enter it, counting the outside of the grid as one. Then enter the number of small squares the wires divide the inside of the grid into: the faces other than the outside, each with a pad at every corner and no wire across it. A larger square made of several small ones does not count.`,
  answer: [E, F, F - 1],
  hints: ['Count the wires along the rows first, then the wires up and down the columns, and add the two counts. Between neighbouring pads in a line there is one wire for every pair of neighbours.', 'Euler’s formula for a connected plane drawing: V − E + F = 2, so F = 2 − V + E. The outside is one of the faces, so take it away to count the small squares.'],
  solution: `Each row of ${n(b)} pads has ${n(b - 1)} wires along it, and there are ${n(a)} rows: ${n(a)} × ${n(b - 1)} = ${n(a * (b - 1))}. Each column of ${n(a)} pads has ${n(a - 1)} wires down it, and there are ${n(b)} columns: ${n(b)} × ${n(a - 1)} = ${n(b * (a - 1))}. In all there are ${n(a * (b - 1))} + ${n(b * (a - 1))} = ${n(E)} wires. There are ${n(a)} × ${n(b)} = ${n(V)} pads, so Euler’s formula gives F = 2 − ${n(V)} + ${n(E)} = ${n(F)} faces. One of them is the outside, so there are ${n(F)} − 1 = ${n(F - 1)} small squares.`,
  guidance: [
   { prompt: `Each row of ${n(b)} pads has ${n(b - 1)} wires along it, and each column of ${n(a)} pads has ${n(a - 1)} wires down it. With ${n(a)} rows and ${n(b)} columns, how many wires are there in all?`, answer: [E], explanation: `${n(a)} × ${n(b - 1)} + ${n(b)} × ${n(a - 1)} = ${n(a * (b - 1))} + ${n(b * (a - 1))} = ${n(E)}.` },
   { prompt: `There are ${n(a)} × ${n(b)} = ${n(V)} pads. By Euler’s formula, F = 2 − V + E. How many faces are there?`, answer: [F], explanation: `F = 2 − ${n(V)} + ${n(E)} = ${n(F)}, counting the outside.` },
   { prompt: 'One of the faces is the outside of the grid. How many small squares are there?', answer: [F - 1], explanation: `${n(F)} − 1 = ${n(F - 1)}.` }
  ] }; }
});

practice({ id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q14', title: 'Trimming the board down to a tree',
 brief: 'The shop wants to save copper on a busy board by cutting wires until a spanning tree is left, and Mira wants to track the faces as it goes.',
 labels: ['faces', 'wires to remove', 'faces after the first cuts'], tolerance: 0.01 },
 [['faces'], ['wires to remove'], ['faces after the first cuts']], {
 /* At least 3 wires lie on loops to remove (E ≥ V + 2), and the first cuts leave at least one more to make. */
 draw: R => { const V = R.int(10, 30), E = R.int(V + 2, 3 * V - 6); return { V, E, m: R.int(1, E - V) }; },
 build: ({ V, E, m }) => { const F = 2 - V + E, r = E - V + 1, F2 = F - m;
  return {
  prompt: `A circuit board has ${n(V)} junctions joined by ${n(E)} wires. The wires form one connected piece and are drawn flat with no crossings. Enter the number of faces, counting the outside. To save copper, the designer will remove wires until only a spanning tree is left: a tree that still reaches every junction. Enter how many wires must be removed. The designer starts by removing just ${plural(m, 'wire', 'wires')}, each taken from a closed loop so that the board stays in one piece. Enter the number of faces after those ${m === 1 ? 'one wire is' : `${n(m)} wires are`} gone.`,
  answer: [F, r, F2],
  hints: ['Euler’s formula for a connected plane drawing: V − E + F = 2, so F = 2 − V + E. A spanning tree has one edge fewer than it has vertices, so the wires to remove are E minus that.', 'A wire on a closed loop has a different face on each side. Removing it merges those two faces into one, so each removal takes one face away.'],
  solution: `Euler’s formula gives F = 2 − ${n(V)} + ${n(E)} = ${n(F)} faces. A spanning tree on ${n(V)} junctions has ${n(V)} − 1 = ${n(V - 1)} wires, so ${n(E)} − ${n(V - 1)} = ${n(r)} wires must be removed. Each wire taken from a loop merges two faces, so removing ${n(m)} leaves ${n(F)} − ${n(m)} = ${n(F2)} faces. (The finished tree has 1 face, the outside.)`,
  guidance: [
   { prompt: `Euler’s formula is V − E + F = 2. How many faces does the board have with ${n(V)} junctions and ${n(E)} wires?`, answer: [F], explanation: `F = 2 − ${n(V)} + ${n(E)} = ${n(F)}.` },
   { prompt: `A spanning tree on ${n(V)} junctions has ${n(V)} − 1 wires. How many of the ${n(E)} wires must be removed?`, answer: [r], explanation: `${n(E)} − ${n(V - 1)} = ${n(r)}.` },
   { prompt: `Each wire removed from a closed loop merges two faces into one. Starting from ${n(F)} faces, how many faces are there after ${plural(m, 'wire', 'wires')} ${m === 1 ? 'is' : 'are'} removed?`, answer: [F2], explanation: `${n(F)} − ${n(m)} = ${n(F2)}.` }
  ] }; }
});

/* ---- q25 The edge limit for planar graphs [KT5.5] ---- */
const planarLimit = (V, tf) => tf ? 2 * V - 4 : 3 * V - 6;
const noTri = tf => tf ? ' No three components are all wired to one another, so there are no triangles.' : '';

practice({ id: 'q25b', parent: 'q25', kind: 'setting', title: 'Copper tape on a light panel',
 brief: 'A light panel is to be wired with strips of copper tape stuck to one face, and the shop wants to know how many strips would have to go from the design before the count is possible.',
 labels: ['most strips (planar)', 'strips to remove'], tolerance: 0.01 },
 [['edges round a face'], ['most strips (planar)'], ['strips to remove']], {
 /* E is within 5 of the limit and is possible for a simple connected network (at least V; at most V(V − 1) ÷ 2, or V² ÷ 4 with no triangles).
    Never the worked example: 8 vertices, no triangles, 13 edges. */
 draw: R => { for (;;) { const V = R.int(6, 30), tf = R.bool() ? 1 : 0, lim = planarLimit(V, tf), top = tf ? Math.floor(V * V / 4) : V * (V - 1) / 2;
  const E = Math.max(V, Math.min(top, lim + R.int(-5, 5))); if (!(V === 8 && tf && E === 13)) return { V, tf, E }; } },
 build: ({ V, E, tf }) => { const face = tf ? 4 : 3, lim = planarLimit(V, tf), over = Math.max(0, E - lim);
  return {
  prompt: `A design for a light panel has ${n(V)} lamps joined by ${n(E)} proposed strips of copper tape, all to be stuck to one flat side of the panel. Each strip would join two different lamps, no two strips join the same pair, and every lamp is connected to the rest. Tape cannot cross tape, so the finished panel must be a planar layout.${noTri(tf).replace('components', 'lamps')} Enter the largest number of strips a planar layout with ${n(V)} lamps${tf ? ' and no triangles' : ''} can have. Then enter the fewest strips that would have to be dropped from the design to bring its count down to that limit, or 0 if it is already at or under the limit.`,
  answer: [lim, over],
  hints: [`In a flat drawing every face has at least ${tf ? 'four edges round it when there are no triangles' : 'three edges round it'}, and each edge borders at most two faces. Put that together with Euler’s formula.`, `The limit is ${tf ? '2V − 4' : '3V − 6'}. Compare the number of strips with it: the difference is how many are over, and a count at or under the limit has none over.`],
  solution: `Every face has at least ${face} edges round it and each edge borders at most two faces, so ${face}F ≤ 2E. With Euler’s formula F = 2 − V + E this gives E ≤ ${tf ? '2V − 4' : '3V − 6'}. For ${n(V)} lamps the limit is ${tf ? `2 × ${n(V)} − 4` : `3 × ${n(V)} − 6`} = ${n(lim)}. ${over ? `${n(E)} is ${n(over)} more than ${n(lim)}, so at least ${plural(over, 'strip', 'strips')} would have to be dropped from the design to reach the limit.` : `${n(E)} is at most ${n(lim)}, so the count needs no strips dropped: enter 0.`}`,
  guidance: [
   { prompt: 'What is the fewest edges that can run round one face of this layout?', answer: [face], explanation: tf ? 'A face needs a closed loop round it, and with no triangles the shortest loop has four edges.' : 'A face needs a closed loop round it, and the shortest loop between different lamps is a triangle: three edges.' },
   { prompt: `The limit is ${tf ? '2V − 4' : '3V − 6'}. What is it for ${n(V)} lamps?`, answer: [lim], explanation: `${tf ? `2 × ${n(V)} − 4` : `3 × ${n(V)} − 6`} = ${n(lim)}.` },
   { prompt: `The panel has ${n(E)} strips. How many are over the limit of ${n(lim)}? Enter 0 if there are none over.`, answer: [over], explanation: over ? `${n(E)} − ${n(lim)} = ${n(over)}.` : `${n(E)} is not more than ${n(lim)}, so none are over.` }
  ] }; }
});

practice({ id: 'q25c', parent: 'q25', kind: 'applied', title: 'Room for more wires',
 brief: 'A half-wired controller board still has space on paper, and the shop wants to know how many extra wires the planar limit leaves room for and what budget to set for them.',
 labels: ['most wires (planar)', 'room under the limit', 'budget (credits)'], tolerance: 0.01 },
 [['most wires (planar)'], ['room under the limit'], ['budget (credits)']], {
 /* The wires so far are 2 to 12 below the limit, so there is room to add some. */
 draw: R => { const V = R.int(16, 35), tf = R.bool() ? 1 : 0; return { V, tf, E: planarLimit(V, tf) - R.int(2, 12), c: R.int(2, 12) }; },
 build: ({ V, E, tf, c }) => { const face = tf ? 4 : 3, lim = planarLimit(V, tf), spare = lim - E, cost = spare * c;
  return {
  prompt: `A controller board holds ${n(V)} components with ${n(E)} wires fitted so far, all in one flat layer. Each wire joins two different components, no two wires join the same pair, and the layout is connected.${noTri(tf)} Before planning extra wires, the shop wants to know how much room the planar edge limit leaves. Enter the largest number of wires a planar layout with ${n(V)} components${tf ? ' and no triangles' : ''} can have. Then enter how far the wires fitted so far are below that limit: no more wires than that can ever be added (on a given board fewer may fit). Fitting each wire costs ${plural(c, 'credit', 'credits')}, and the shop sets its budget for that many extra wires: enter the budget in credits.`,
  answer: [lim, spare, cost],
  hints: [`In a flat drawing every face has at least ${tf ? 'four edges round it when there are no triangles' : 'three edges round it'}, and each edge borders at most two faces. Put that together with Euler’s formula to get the limit.`, 'The room left is the limit minus the wires already fitted. The budget is that number times the cost of one wire.'],
  solution: `Every face has at least ${face} edges round it and each edge borders at most two faces, so ${face}F ≤ 2E. With Euler’s formula F = 2 − V + E this gives E ≤ ${tf ? '2V − 4' : '3V − 6'}. For ${n(V)} components the limit is ${tf ? `2 × ${n(V)} − 4` : `3 × ${n(V)} − 6`} = ${n(lim)}. With ${n(E)} wires fitted, the board is ${n(lim)} − ${n(E)} = ${n(spare)} below the limit, so no more than ${n(spare)} wires can ever be added (the limit is a ceiling, and a particular board may not reach it). A budget for ${n(spare)} wires at ${n(c)} credits each is ${n(spare)} × ${n(c)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `The limit is ${tf ? '2V − 4' : '3V − 6'}. What is it for ${n(V)} components?`, answer: [lim], explanation: `${tf ? `2 × ${n(V)} − 4` : `3 × ${n(V)} − 6`} = ${n(lim)}.` },
   { prompt: `The limit is ${n(lim)} and ${n(E)} wires are fitted. How far below the limit is the board?`, answer: [spare], explanation: `${n(lim)} − ${n(E)} = ${n(spare)}.` },
   { prompt: `Each wire costs ${plural(c, 'credit', 'credits')} to fit. What budget covers ${n(spare)} wires?`, answer: [cost], explanation: `${n(spare)} × ${n(c)} = ${n(cost)} credits.` }
  ] }; }
});

practice({ id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24', title: 'Checking a reported layout',
 brief: 'A designer has reported only how many components and how many regions a flat layout has, and the shop wants to know if such a layout could exist.',
 labels: ['wires', 'most wires (planar)', 'report possible (1 or 0)'], tolerance: 0.01 },
 [['wires'], ['most wires (planar)'], ['report possible (1 or 0)']], {
 /* The wires E are within 5 of the limit and possible for a simple connected network; F follows from Euler's formula.
    Never the parent's worked example: 8 vertices, no triangles, 13 edges. */
 draw: R => { for (;;) { const V = R.int(8, 30), tf = R.bool() ? 1 : 0, lim = planarLimit(V, tf), top = tf ? Math.floor(V * V / 4) : V * (V - 1) / 2;
  const E = Math.max(V, Math.min(top, lim + R.int(-5, 5))); if (!(V === 8 && tf && E === 13)) return { V, F: 2 - V + E, tf }; } },
 build: ({ V, F, tf }) => { const E = V + F - 2, face = tf ? 4 : 3, lim = planarLimit(V, tf), ok = E <= lim ? 1 : 0;
  return {
  prompt: `A designer reports a flat layout of ${n(V)} components in which the wires cut the board into ${n(F)} regions, counting the outside region as one. The layout is connected, each wire joins two different components, and no two wires join the same pair.${noTri(tf)} Use Euler’s formula to find how many wires the layout has, and enter it. Then enter the largest number of wires a planar layout with ${n(V)} components${tf ? ' and no triangles' : ''} can have. Then enter 1 if the number of wires is within that limit, so the report is not ruled out, or 0 if no such layout can exist.`,
  answer: [E, lim, ok],
  hints: ['Euler’s formula for a connected plane drawing is V − E + F = 2. Solve it for E, with the components as the vertices and the regions as the faces.', `In a flat drawing every face has at least ${tf ? 'four edges round it when there are no triangles' : 'three edges round it'}, and each edge borders at most two faces. That gives the limit ${tf ? '2V − 4' : '3V − 6'}. A count at or below the limit passes; above it, no such layout exists.`],
  solution: `Euler’s formula V − E + F = 2 gives E = V + F − 2 = ${n(V)} + ${n(F)} − 2 = ${n(E)} wires. Every face has at least ${face} edges round it and each edge borders at most two faces, so ${face}F ≤ 2E, which gives E ≤ ${tf ? '2V − 4' : '3V − 6'}. For ${n(V)} components the limit is ${tf ? `2 × ${n(V)} − 4` : `3 × ${n(V)} − 6`} = ${n(lim)}. ${ok ? `${n(E)} is at most ${n(lim)}, so the report is not ruled out: enter 1.` : `${n(E)} is more than ${n(lim)}, so no such layout can exist: enter 0.`}`,
  guidance: [
   { prompt: `Euler’s formula is V − E + F = 2, so E = V + F − 2. How many wires does a layout with ${n(V)} components and ${n(F)} regions have?`, answer: [E], explanation: `E = ${n(V)} + ${n(F)} − 2 = ${n(E)}.` },
   { prompt: `The limit is ${tf ? '2V − 4' : '3V − 6'}. What is it for ${n(V)} components?`, answer: [lim], explanation: `${tf ? `2 × ${n(V)} − 4` : `3 × ${n(V)} − 6`} = ${n(lim)}.` },
   { prompt: `Is ${n(E)} at most ${n(lim)}? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? 'Yes, so the edge limit does not rule the report out.' : `No: ${n(E)} wires is too many for any flat layout of ${n(V)} components.` }
  ] }; }
});

})();
