/* Topology: shape without size practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p3.js. */
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
/* "1 pipe" / "3 pipes"; lists "A, B and C". */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const andList = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const same = (p, q) => JSON.stringify(p) === JSON.stringify(q);
/* Tries a draw function up to 1000 times, then returns the fallback. */
const tryDraw = (fn, fallback) => { for (let i = 0; i < 1000; i++) { const p = fn(); if (p) return p; } return fallback; };

/* ---- finite spaces on nodes named by a string, subsets as bit masks (bit i is node i) ---- */
const pc = m => { let c = 0; for (; m; m >>= 1) c += m & 1; return c; };
const setTxt = (m, nm) => { const xs = []; for (let i = 0; i < nm.length; i++) if (m >> i & 1) xs.push(nm[i]); return xs.length ? `{${xs.join(', ')}}` : '∅'; };
const nodeNames = (m, nm) => { const xs = []; for (let i = 0; i < nm.length; i++) if (m >> i & 1) xs.push(nm[i]); return andList(xs); };
const bySize = (x, y) => pc(x) - pc(y) || x - y;
/* Every union of basic sets, with ∅. */
const unions = basis => { const s = new Set([0]); for (const b of basis) for (const u of [...s]) s.add(u | b); return [...s].sort(bySize); };
/* A basis on N nodes closed under intersection and holding the whole set, with at most maxOpens open sets. Null if none is found. */
const drawBasis = (R, N, kLo, kHi, maxOpens) => {
 for (let i = 0; i < 1000; i++) {
  const full = (1 << N) - 1, B = new Set([full]), k = R.int(kLo, kHi);
  for (let j = 0; j < k; j++) B.add(R.int(1, full - 1));
  let grew = true; while (grew) { grew = false; for (const a of [...B]) for (const b of [...B]) { const c = a & b; if (c && !B.has(c)) { B.add(c); grew = true; } } }
  const basis = [...B].sort(bySize), opens = unions(basis);
  if (basis.length > 7 || opens.length < 5 || opens.length > maxOpens || opens.length === full + 1) continue;
  return basis;
 }
 return null;
};
/* The union of the open sets that miss every node of the set m, and the closure of m (the rest). */
const closureInfo = (opens, m, full) => { const miss = opens.filter(o => (o & m) === 0), U = miss.reduce((s, o) => s | o, 0); return { miss, U, cl: full & ~U }; };

/* ---- unions of intervals and single points on the line. A piece is [l, r, lc, rc]: end points and whether each end
   is included (a single point has l = r and both ends included). ---- */
const pieceTxt = ([l, r, lc, rc]) => l === r ? `{${n(l)}}` : `${lc ? '[' : '('}${n(l)}, ${n(r)}${rc ? ']' : ')'}`;
const joinsAt = (p, q) => p[1] === q[0] && (p[3] || q[2]);
const unionInfo = pieces => {
 const joins = [], apart = [];
 for (let i = 1; i < pieces.length; i++) {
  const p = pieces[i - 1], q = pieces[i];
  if (p[1] !== q[0]) continue;
  if (p[3] || q[2]) joins.push(`${pieceTxt(p)} and ${pieceTxt(q)} share the point ${n(q[0])}, which belongs to ${p[3] && q[2] ? 'both' : pieceTxt(p[3] ? p : q)}, so they join`);
  else apart.push(`${pieceTxt(p)} and ${pieceTxt(q)} meet at ${n(q[0])}, but ${n(q[0])} belongs to neither, so they stay apart`);
 }
 const comps = pieces.length - joins.length;
 const joinTxt = joins.length ? joins.join('; ') + '.' : 'No two neighbouring pieces share a point of S.';
 return { S: pieces.map(pieceTxt).join(' ∪ '), joins: joins.length, comps, joinTxt, apartTxt: apart.length ? ' ' + apart.join('; ') + '.' : '' };
};
/* cnt pieces left to right. After a single point, or by chance, there is a gap of 1 or 2; otherwise a piece starts where the last one ended.
   pSingle is the chance of a single point after a gap. Single points are always alone: a gap on both sides. */
const drawPieces = (R, cnt, pSingle) => {
 const pieces = []; let x = R.int(0, 3), lastSingle = true;
 for (let i = 0; i < cnt; i++) {
  const gap = (i === 0) ? 0 : (lastSingle || R.bool() ? R.int(1, 2) : 0);
  x += gap;
  if (gap > 0 && R.next() < pSingle) { pieces.push([x, x, 1, 1]); lastSingle = true; continue; }
  const len = R.int(1, 3); pieces.push([x, x + len, R.bool() ? 1 : 0, R.bool() ? 1 : 0]); x += len; lastSingle = false;
 }
 return pieces;
};
/* The components of the union: runs of pieces that join. */
const groupsOf = pieces => {
 const groups = [[pieces[0]]], touches = [];
 for (let i = 1; i < pieces.length; i++) {
  const p = pieces[i - 1], q = pieces[i];
  if (joinsAt(p, q)) groups[groups.length - 1].push(q);
  else { groups.push([q]); if (p[1] === q[0]) touches.push(n(q[0])); }
 }
 return { groups, touches };
};
const spanTxt = g => { const f = g[0], l = g[g.length - 1]; return pieceTxt([f[0], l[1], f[2], l[3]]); };

/* ---- q11 Chapter review: the relay map [W Topological Spaces, W Continuity] ---- */

/* Same three skills as q11 on a lamp board with 5 sockets P–T. Not the worked example (3 nodes P, Q, R) and not q11's own numbers. */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'Wiring the lamp board',
 brief: 'The control room lamp board is being rewired, and Mira wants to know which socket groupings are open sets before anything is switched on.',
 labels: ['open sets', 'sockets in the closure', 'g continuous (1 or 0)'], tolerance: 0.01,
 gl: [['open sets'], ['sockets in the closure'], ['g continuous (1 or 0)']]
}, {
 canonical: { N: 5, basis: [1, 4, 3, 12, 31], x: 2, on: 7 },
 draw: R => tryDraw(() => {
  const N = R.pick([4, 5]), basis = drawBasis(R, N, 2, 4, 24); if (!basis) return null;
  const full = (1 << N) - 1, opens = unions(basis), wantOpen = R.bool(), pool = [];
  for (let m = 1; m < full; m++) if (opens.includes(m) === wantOpen) pool.push(m);
  if (!pool.length) return null;
  const p = { N, basis, x: R.int(0, N - 1), on: R.pick(pool) };
  return same(p, { N: 5, basis: [1, 4, 3, 12, 31], x: 2, on: 7 }) ? null : p;
 }, { N: 4, basis: [1, 2, 3, 15], x: 3, on: 2 }),
 build: ({ N, basis, x, on }) => {
  const nm = 'PQRST'.slice(0, N), full = (1 << N) - 1, opens = unions(basis), cnt = opens.length, X = nm[x];
  const { miss, U, cl } = closureInfo(opens, 1 << x, full), cs = pc(cl), cont = opens.includes(on) ? 1 : 0;
  const basisTxt = andList(basis.map(m => setTxt(m, nm))), opensTxt = opens.map(m => setTxt(m, nm)).join(', ');
  const missTxt = miss.length === 1 ? `The only open set that misses ${X} is ∅` : `The open sets that miss ${X} are ${andList(miss.map(m => setTxt(m, nm)))}`;
  return {
   prompt: `The control room’s lamp board has ${n(N)} sockets, ${nodeNames(full, nm)}. Its topology has the basic sets ${basisTxt}, and its open sets are ∅ and every union of them. Enter the number of open sets. Then enter the number of sockets in the closure of {${X}}. Finally, the status lamp is the space {lit, dark} whose open sets are ∅, {lit} and {lit, dark}, and the wiring map g sends ${nodeNames(on, nm)} to lit and every other socket to dark: enter 1 if g is continuous or 0 if it is not.`,
   answer: [cnt, cs, cont],
   hints: [
    'List ∅ first, then every union of the basic sets. A set that can be made in two ways is still one open set.',
    'The closure of a point is what is left when you remove the union of all the open sets that do not contain it.',
    'A map into {lit, dark} is continuous when the preimage of {lit} is open. The preimages of ∅ and of the whole target are ∅ and the whole board, which are always open.'
   ],
   solution: `The open sets are ${opensTxt}: ${n(cnt)} in all. ${missTxt}, so the largest open set missing ${X} is ${setTxt(U, nm)}. Its complement ${setTxt(cl, nm)} is the closure of {${X}}, which has ${pl(cs, 'socket')}. The preimage g⁻¹({lit}) is ${setTxt(on, nm)}, which ${cont ? 'is' : 'is not'} one of the open sets, and the preimages of ∅ and {lit, dark} are ∅ and the whole board. So g ${cont ? 'is continuous: enter 1' : 'is not continuous: enter 0'}.`,
   guidance: [
    { prompt: `List ∅ and every union of the basic sets ${basisTxt}. How many different open sets are there?`, answer: [cnt], explanation: `The open sets are ${opensTxt}: ${n(cnt)} different sets.` },
    { prompt: `Take the union of all the open sets that do not contain ${X}. The closure of {${X}} is everything outside that union. How many sockets is that?`, answer: [cs], explanation: `${missTxt}. Their union is ${setTxt(U, nm)}, and the complement ${setTxt(cl, nm)} has ${pl(cs, 'socket')}.` },
    { prompt: `The preimage g⁻¹({lit}) is ${setTxt(on, nm)}. Enter 1 if it is one of the open sets, so that g is continuous, or 0 if it is not.`, answer: [cont], explanation: `${setTxt(on, nm)} ${cont ? 'is' : 'is not'} in the list of open sets, so g ${cont ? 'is' : 'is not'} continuous.` }
   ] };
 }
});

/* Open sets, the stations that can be shut down alone (singletons whose complement is open) and continuity. Not the worked example. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'Shutting down a station',
 brief: 'The sensor array can only be shut down one station at a time if the right sets are closed, and the crew needs the count before the storm.',
 labels: ['open sets', 'stations that can be shut down alone', 'h continuous (1 or 0)'], tolerance: 0.01,
 gl: [['open sets'], ['stations that can be shut down alone'], ['h continuous (1 or 0)']]
}, {
 canonical: { N: 5, basis: [1, 3, 12, 28, 15, 31], on: 9 },
 draw: R => tryDraw(() => {
  const N = R.pick([4, 5]), basis = drawBasis(R, N, 2, 4, 24); if (!basis) return null;
  const full = (1 << N) - 1, opens = unions(basis), wantOpen = R.bool(), pool = [];
  for (let m = 1; m < full; m++) if (opens.includes(m) === wantOpen) pool.push(m);
  if (!pool.length) return null;
  const p = { N, basis, on: R.pick(pool) };
  return same(p, { N: 5, basis: [1, 3, 12, 28, 15, 31], on: 9 }) ? null : p;
 }, { N: 4, basis: [1, 2, 3, 15], on: 5 }),
 build: ({ N, basis, on }) => {
  const nm = 'KLMNO'.slice(0, N), full = (1 << N) - 1, opens = unions(basis), cnt = opens.length;
  const closedOnes = []; for (let i = 0; i < N; i++) if (opens.includes(full & ~(1 << i))) closedOnes.push(nm[i]);
  const cc = closedOnes.length, cont = opens.includes(on) ? 1 : 0;
  const basisTxt = andList(basis.map(m => setTxt(m, nm))), opensTxt = opens.map(m => setTxt(m, nm)).join(', ');
  const ccTxt = cc === 0 ? 'No station’s complement is open' : `The complement${cc === 1 ? '' : 's'} of ${andList(closedOnes.map(c => `{${c}}`))} ${cc === 1 ? 'is an open set' : 'are open sets'}, so ${cc === 1 ? 'that set is' : 'those sets are'} closed`;
  return {
   prompt: `A sensor array has ${n(N)} stations, ${nodeNames(full, nm)}. Its open sets are ∅ and every union of the basic sets ${basisTxt}. A station can be shut down on its own when the set holding only that station is closed (a set is closed when its complement is open). Enter the number of open sets. Then enter how many stations can be shut down on their own. Finally, the status panel is the space {up, down} whose open sets are ∅, {up} and {up, down}, and the alert map h sends ${nodeNames(on, nm)} to up and every other station to down: enter 1 if h is continuous or 0 if it is not.`,
   answer: [cnt, cc, cont],
   hints: [
    'List ∅ first, then every union of the basic sets, counting each different set once.',
    'For each station, take away that station from the whole array and ask whether what is left is one of the open sets. If it is, the station alone is a closed set.',
    'A map into {up, down} is continuous when the preimage of {up} is open; the other two preimages are ∅ and the whole array.'
   ],
   solution: `The open sets are ${opensTxt}: ${n(cnt)} in all. ${ccTxt}. So ${n(cc)} of the ${n(N)} stations can be shut down on their own. The preimage h⁻¹({up}) is ${setTxt(on, nm)}, which ${cont ? 'is' : 'is not'} one of the open sets, and the other two preimages are ∅ and the whole array. So h ${cont ? 'is continuous: enter 1' : 'is not continuous: enter 0'}.`,
   guidance: [
    { prompt: `List ∅ and every union of the basic sets ${basisTxt}. How many different open sets are there?`, answer: [cnt], explanation: `The open sets are ${opensTxt}: ${n(cnt)} different sets.` },
    { prompt: `For each station, remove it from the whole array and check whether the rest is an open set. For how many stations is it?`, answer: [cc], explanation: `${ccTxt}. That is ${n(cc)} of the ${n(N)} stations.` },
    { prompt: `The preimage h⁻¹({up}) is ${setTxt(on, nm)}. Enter 1 if it is one of the open sets, so that h is continuous, or 0 if it is not.`, answer: [cont], explanation: `${setTxt(on, nm)} ${cont ? 'is' : 'is not'} in the list of open sets, so h ${cont ? 'is' : 'is not'} continuous.` }
   ] };
 }
});

/* 6 nodes, the closure of a two-node set (the rule is stated), and a map into a three-level space {low, mid, high}
   whose open sets are ∅, {low}, {low, mid} and the whole space. f sends the nodes of m1 to low, the nodes of m2 not in m1
   to mid and the rest to high (m1 inside m2, neither empty, m2 not the whole set). x and y index the two nodes of the set. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q08', title: 'The three-level relay check',
 brief: 'A bigger mesh feeds a three-level signal panel, and Mira wants its open sets, a closure of two nodes and the wiring checked in one go.',
 labels: ['open sets', 'nodes in the closure', 'f continuous (1 or 0)'], tolerance: 0.01,
 gl: [['open sets'], ['nodes in the largest open set missing both'], ['nodes in the closure'], ['f continuous (1 or 0)']]
}, {
 canonical: { basis: [1, 4, 16, 3, 12, 15, 63], x: 2, y: 4, m1: 3, m2: 35 },
 draw: R => tryDraw(() => {
  const basis = drawBasis(R, 6, 3, 5, 24); if (!basis) return null;
  const full = 63, opens = unions(basis), wantOpen = R.bool();
  let m1, m2;
  if (wantOpen) {
   const pairs = []; for (const a of opens) for (const b of opens) if (a && a !== b && (a & b) === a && b !== full) pairs.push([a, b]);
   if (!pairs.length) return null;
   [m1, m2] = R.pick(pairs);
  } else {
   m1 = R.int(1, 62); m2 = m1 | R.int(1, 62); if (m2 === m1 || m2 === full || (opens.includes(m1) && opens.includes(m2))) return null;
  }
  const x = R.int(0, 5), y = R.int(0, 5); if (x >= y) return null;
  const p = { basis, x, y, m1, m2 };
  return same(p, { basis: [1, 4, 16, 3, 12, 15, 63], x: 2, y: 4, m1: 3, m2: 35 }) ? null : p;
 }, { basis: [1, 2, 3, 63], x: 3, y: 5, m1: 1, m2: 3 }),
 build: ({ basis, x, y, m1, m2 }) => {
  const nm = 'ABCDEF', full = 63, opens = unions(basis), cnt = opens.length, m = (1 << x) | (1 << y), X = nm[x], Y = nm[y];
  const { miss, U, cl } = closureInfo(opens, m, full), cs = pc(cl), cont = opens.includes(m1) && opens.includes(m2) ? 1 : 0;
  const basisTxt = andList(basis.map(b => setTxt(b, nm))), opensTxt = opens.map(b => setTxt(b, nm)).join(', ');
  const missTxt = miss.length === 1 ? `The only open set that misses both ${X} and ${Y} is ∅` : `The open sets that miss both ${X} and ${Y} are ${andList(miss.map(b => setTxt(b, nm)))}`;
  const lowN = nodeNames(m1, nm), midN = nodeNames(m2 & ~m1, nm), highN = nodeNames(full & ~m2, nm);
  const o1 = opens.includes(m1), o2 = opens.includes(m2);
  const contWhy = cont ? `${setTxt(m1, nm)} and ${setTxt(m2, nm)} are both open sets` : !o1 && !o2 ? `neither ${setTxt(m1, nm)} nor ${setTxt(m2, nm)} is an open set` : `${setTxt(o1 ? m2 : m1, nm)} is not an open set`;
  return {
   prompt: `The relay network has 6 nodes, A, B, C, D, E and F. Its open sets are ∅ and every union of the basic sets ${basisTxt}. Enter the number of open sets. Then enter the number of nodes in the closure of the two-node set {${X}, ${Y}}: the closure of a set is the complement of the union of all the open sets that miss every node of it. Finally, the signal panel is the three-level space {low, mid, high} whose open sets are ∅, {low}, {low, mid} and {low, mid, high}, and the map f sends ${lowN} to low, ${midN} to mid and ${highN} to high: enter 1 if f is continuous or 0 if it is not.`,
   answer: [cnt, cs, cont],
   hints: [
    'List ∅ first, then every union of the basic sets, counting each different set once.',
    'Keep only the open sets that contain neither of the two nodes, take their union, and remove it from the whole network. What is left is the closure.',
    'The preimages of ∅ and of the whole panel are ∅ and the whole network. Only the preimages of {low} and of {low, mid} need checking, and both must be open.'
   ],
   solution: `The open sets are ${opensTxt}: ${n(cnt)} in all. ${missTxt}, so their union is ${setTxt(U, nm)}. Its complement ${setTxt(cl, nm)} is the closure of {${X}, ${Y}}, with ${pl(cs, 'node')}. The preimage f⁻¹({low}) is ${setTxt(m1, nm)} and f⁻¹({low, mid}) is ${setTxt(m2, nm)}; ${contWhy}, so f ${cont ? 'is continuous: enter 1' : 'is not continuous: enter 0'}.`,
   guidance: [
    { prompt: `List ∅ and every union of the basic sets ${basisTxt}. How many different open sets are there?`, answer: [cnt], explanation: `The open sets are ${opensTxt}: ${n(cnt)} different sets.` },
    { prompt: `Which open sets contain neither ${X} nor ${Y}? How many nodes are in their union?`, answer: [pc(U)], explanation: `${missTxt}. Their union is ${setTxt(U, nm)}, with ${pl(pc(U), 'node')}.` },
    { prompt: `The closure of {${X}, ${Y}} is the complement of ${setTxt(U, nm)}. How many nodes does it have?`, answer: [cs], explanation: `The complement of ${setTxt(U, nm)} is ${setTxt(cl, nm)}, with ${pl(cs, 'node')}.` },
    { prompt: `The preimages are f⁻¹({low}) = ${setTxt(m1, nm)} and f⁻¹({low, mid}) = ${setTxt(m2, nm)}. Enter 1 if both are open sets, so that f is continuous, or 0 if not.`, answer: [cont], explanation: `${contWhy.charAt(0).toUpperCase() + contWhy.slice(1)}, so f ${cont ? 'is' : 'is not'} continuous.` }
   ] };
 }
});

/* ---- q12 Connected sets and components [L 8.2, W Connectedness] ---- */

/* A set of transmission windows (hours), a timeline with k instants cut out, a deck with m circular trenches. Not the worked example. */
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'Reading the beacon log',
 brief: 'The mast beacon logs its transmission windows in odd brackets, and the relay crew needs to know how many unbroken transmissions that really was.',
 labels: ['components of S', 'components of the timeline', 'components of the deck'], tolerance: 0.01,
 gl: [['joins'], ['components of S'], ['components of the timeline'], ['regions of the deck']]
}, {
 canonical: { pieces: [[1, 3, 1, 0], [3, 6, 1, 1], [8, 8, 1, 1], [9, 11, 0, 0], [11, 14, 0, 1], [15, 16, 1, 1]], k: 5, m: 2 },
 draw: R => tryDraw(() => {
  const pieces = drawPieces(R, R.int(4, 6), 0.2), u = unionInfo(pieces);
  if (u.joins < 1 || u.comps < 2) return null;
  const p = { pieces, k: R.int(1, 9), m: R.int(1, 6) };
  return same(p.pieces, [[1, 3, 1, 0], [3, 6, 1, 1], [8, 8, 1, 1], [9, 11, 0, 0], [11, 14, 0, 1], [15, 16, 1, 1]]) ? null : p;
 }, { pieces: [[0, 2, 1, 1], [2, 4, 0, 0], [5, 5, 1, 1], [6, 8, 0, 1]], k: 3, m: 1 }),
 build: ({ pieces, k, m }) => {
  const u = unionInfo(pieces), P = pieces.length;
  return {
   prompt: `The mast beacon transmits during the windows of the set S = ${u.S}, measured in hours since midnight. A square bracket means the beacon is on at that exact instant, a round bracket means it is off at that exact instant, and {t} is a single instant. Enter the number of unbroken transmissions, that is the number of components of S. Then enter the number of components of the timeline (the full number line, running for ever both ways) with ${pl(k, 'instant')} cut out, and of a flat deck (the whole plane) along which ${pl(m, 'circular trench is', 'circular trenches are')} cut: a trench removes only the points on its circle, nothing inside it${m === 1 ? '' : ', and the trenches lie side by side, with none touching, crossing or lying inside another'}.`,
   answer: [u.comps, k + 1, m + 1],
   hints: [
    'On the line the connected sets are the intervals and single points. Two neighbouring windows join exactly when they share an end instant that is on in at least one of them.',
    'Each instant cut out of the timeline splits one piece into two. Each circle cut out of the plane cuts off its inside from the outside.'
   ],
   solution: `${u.joinTxt}${u.apartTxt} So the ${n(P)} windows of S make ${n(P)} − ${n(u.joins)} = ${pl(u.comps, 'component')}. The timeline with ${pl(k, 'instant')} cut out falls into ${n(k + 1)} pieces, because each instant removed splits one piece into two. The deck with ${pl(m, 'trench', 'trenches')} cut falls into ${n(m + 1)} regions: the inside of each circle, and the one region outside them all.`,
   guidance: [
    { prompt: `Which neighbouring windows of S share an end instant that is on in at least one of them? How many such joins are there?`, answer: [u.joins], explanation: `${u.joinTxt}${u.apartTxt}` },
    { prompt: `S is written as ${n(P)} windows. How many components are left after the joins?`, answer: [u.comps], explanation: `Each join turns two windows into one: ${n(P)} − ${n(u.joins)} = ${n(u.comps)}.` },
    { prompt: `How many pieces does the timeline fall into when ${pl(k, 'instant is', 'instants are')} cut out?`, answer: [k + 1], explanation: `Each instant cut out splits one piece into two, so ${pl(k, 'instant')} leave ${n(k)} + 1 = ${n(k + 1)} pieces.` },
    { prompt: `How many regions does the deck fall into when ${pl(m, 'circular trench is', 'circular trenches are')} cut${m === 1 ? '' : ', side by side'}?`, answer: [m + 1], explanation: `Each trench cuts off its own inside, and the outside is one more region: ${n(m)} + 1 = ${n(m + 1)}.` }
   ] };
 }
});

/* Two deliveries: a cable laid in pieces S, and a cable [0, W] with k interior points burnt out (positions listed). A drum per component. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Drums for two deliveries',
 brief: 'Two cable deliveries are due at the Cable Works, and every unbroken piece needs a drum of its own.',
 labels: ['drums for the first delivery', 'drums for the second delivery', 'drums in all'], tolerance: 0.01,
 gl: [['drums for the first delivery'], ['drums for the second delivery'], ['drums in all']]
}, {
 canonical: { pieces: [[2, 5, 1, 0], [5, 7, 1, 1], [9, 10, 0, 0], [10, 12, 0, 1], [14, 15, 1, 1]], W: 24, cuts: [4, 9, 15, 20] },
 draw: R => tryDraw(() => {
  const pieces = drawPieces(R, R.int(4, 6), 0.1), u = unionInfo(pieces);
  if (u.joins < 1 || u.comps < 2) return null;
  const W = R.int(12, 40), k = R.int(2, 5), set = new Set(); for (let i = 0; i < 200 && set.size < k; i++) set.add(R.int(1, W - 1));
  if (set.size < k) return null;
  const p = { pieces, W, cuts: [...set].sort((a, b) => a - b) };
  return same(p.pieces, [[2, 5, 1, 0], [5, 7, 1, 1], [9, 10, 0, 0], [10, 12, 0, 1], [14, 15, 1, 1]]) ? null : p;
 }, { pieces: [[0, 2, 1, 1], [2, 4, 0, 0], [6, 8, 0, 1]], W: 20, cuts: [5, 12] }),
 build: ({ pieces, W, cuts }) => {
  const u = unionInfo(pieces), P = pieces.length, k = cuts.length, second = k + 1, total = u.comps + second;
  return {
   prompt: `The Cable Works receives two deliveries, and every unbroken piece of cable needs a drum of its own. The first is laid along the set S = ${u.S} on the bench, measured in metres. The second is one straight cable, the closed interval [0, ${n(W)}], from whose inside ${pl(k, 'point')} ${k === 1 ? 'was' : 'were'} burnt out, at ${andList(cuts.map(n))} metres. Enter the drums needed for the first delivery, then for the second, then for both together.`,
   answer: [u.comps, second, total],
   hints: [
    'An unbroken piece is a component. Two neighbouring pieces of S join exactly when they share an end point that belongs to at least one of them.',
    'A point burnt out of the inside of a straight cable splits one piece into two, so each such point adds one piece.'
   ],
   solution: `${u.joinTxt}${u.apartTxt} So the ${n(P)} pieces of S make ${n(P)} − ${n(u.joins)} = ${n(u.comps)} components: ${pl(u.comps, 'drum')}. The second cable has ${pl(k, 'point')} burnt out of its inside, each splitting one piece into two, so it falls into ${n(k)} + 1 = ${n(second)} pieces: ${pl(second, 'drum')}. In all that is ${n(u.comps)} + ${n(second)} = ${n(total)} drums.`,
   guidance: [
    { prompt: `The first delivery is written as ${n(P)} pieces. Join every neighbouring pair that shares an end point belonging to at least one of them. How many drums does it need?`, answer: [u.comps], explanation: `${u.joinTxt}${u.apartTxt} That leaves ${n(P)} − ${n(u.joins)} = ${n(u.comps)} components.` },
    { prompt: `How many pieces is the second cable in, with ${pl(k, 'point')} burnt out of its inside?`, answer: [second], explanation: `Each point burnt out of the inside splits one piece into two, so ${pl(k, 'point')} leave ${n(k)} + 1 = ${n(second)} pieces.` },
    { prompt: `Add the drums for the two deliveries. How many drums in all?`, answer: [total], explanation: `${n(u.comps)} + ${n(second)} = ${n(total)} drums.` }
   ] };
 }
});

/* Components of S, of its interior and of its closure on the line (S has 6 to 8 pieces, with single points). */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q05', title: 'Inside and outside the run',
 brief: 'A long test run is laid out in bracketed pieces, and the Cable Works wants to know how its pieces change when only the inside is kept, or the edges are added.',
 labels: ['components of S', 'components of the interior', 'components of the closure'], tolerance: 0.01,
 gl: [['components of S'], ['components of the interior'], ['components of the closure']]
}, {
 canonical: { pieces: [[1, 3, 1, 1], [3, 4, 0, 0], [6, 6, 1, 1], [7, 9, 0, 0], [9, 11, 0, 1], [11, 12, 1, 0], [14, 14, 1, 1]] },
 draw: R => tryDraw(() => {
  const pieces = drawPieces(R, R.int(6, 8), 0.3), g = groupsOf(pieces), singles = g.groups.filter(x => x.length === 1 && x[0][0] === x[0][1]).length;
  if (g.groups.length < 3 || (singles === 0 && g.touches.length === 0)) return null;
  const p = { pieces };
  return same(p, { pieces: [[1, 3, 1, 1], [3, 4, 0, 0], [6, 6, 1, 1], [7, 9, 0, 0], [9, 11, 0, 1], [11, 12, 1, 0], [14, 14, 1, 1]] }) ? null : p;
 }, { pieces: [[0, 2, 1, 1], [2, 4, 0, 0], [6, 6, 1, 1], [8, 9, 1, 0], [9, 11, 0, 1]] }),
 build: ({ pieces }) => {
  const u = unionInfo(pieces), g = groupsOf(pieces), comps = g.groups.length;
  const singles = g.groups.filter(x => x.length === 1 && x[0][0] === x[0][1]), inner = comps - singles.length, outer = comps - g.touches.length;
  const spans = g.groups.map(spanTxt).join(', ');
  const singleTxt = singles.length === 0 ? 'No component is a single point, so each one has an open interval inside it.' : `${andList(singles.map(s => pieceTxt(s[0])))} ${singles.length === 1 ? 'is a single point and has' : 'are single points and have'} nothing round ${singles.length === 1 ? 'it' : 'them'} inside S, so ${singles.length === 1 ? 'it leaves' : 'they leave'} no component in the interior.`;
  const touchTxt = g.touches.length === 0 ? 'No two components meet at a missing point, so taking the closure joins nothing.' : g.touches.length === 1 ? `Two components meet at the missing point ${g.touches[0]}, so adding that point to the closure joins them.` : `Two components meet at each of the missing points ${andList(g.touches)}, so adding those points to the closure joins each pair.`;
  return {
   prompt: `A test run is laid along the set S = ${u.S} on the straight bench, measured in metres. The interior of S is the set of points of S that have a small open interval round them lying wholly inside S. The closure of S is S together with every point that has points of S inside every open interval round it. Enter the number of components of S, then of the interior of S, then of the closure of S. The empty set has no components.`,
   answer: [comps, inner, outer],
   hints: [
    'Two neighbouring pieces join exactly when they share an end point that belongs to at least one of them. Count the runs that join.',
    'A single point has no open interval round it inside S, so it disappears from the interior. Every other component has an open interval inside it, and one open interval is connected.',
    'The closure adds the end points that are missing. Two components that meet at a missing point share that point once it is added.'
   ],
   solution: `${u.joinTxt}${u.apartTxt} So S falls into ${n(comps)} components: ${spans}. ${singleTxt} The interior therefore has ${n(comps)} − ${n(singles.length)} = ${n(inner)} components. ${touchTxt} The closure therefore has ${n(comps)} − ${n(g.touches.length)} = ${n(outer)} components.`,
   guidance: [
    { prompt: `Join every neighbouring pair of pieces that shares an end point belonging to at least one of them. How many components does S have?`, answer: [comps], explanation: `${u.joinTxt}${u.apartTxt} So S has ${n(comps)} components: ${spans}.` },
    { prompt: `Which components are single points, with nothing round them inside S? Remove them: how many components does the interior of S have?`, answer: [inner], explanation: `${singleTxt} So the interior has ${n(comps)} − ${n(singles.length)} = ${n(inner)} components.` },
    { prompt: `Add back the missing end points to get the closure. Two components that meet at a missing point now share it. How many components does the closure of S have?`, answer: [outer], explanation: `${touchTxt} So the closure has ${n(comps)} − ${n(g.touches.length)} = ${n(outer)} components.` }
   ] };
 }
});

/* ---- q13 Cut points [W Connectedness] ---- */

/* Pipe layouts. f indexes this list; k and r are the numbers in the description (unused ones are 0); p indexes the marked points.
   deg is the number of pipes that run into the marked point and pcs the number of pieces left when it is cut out. */
const LAY = [
 { d: p => `${n(p.k)} straight pipes that all meet at one junction, the other end of each pipe being loose`, ends: p => p.k,
  pts: [{ t: 'the junction', deg: p => p.k, pcs: p => p.k }, { t: 'the middle of one of the pipes', deg: () => 2, pcs: () => 2 }, { t: 'the loose end of one of the pipes', deg: () => 1, pcs: () => 1 }] },
 { d: p => `a closed ring of pipe with ${pl(p.k, 'straight tail')}, each joined to the ring at a different point and ending loose`, ends: p => p.k,
  pts: [{ t: 'the point where one tail joins the ring', deg: () => 3, pcs: () => 2 }, { t: 'a point of the ring that is not where any tail joins', deg: () => 2, pcs: () => 1 },
   { t: 'the middle of one of the tails', deg: () => 2, pcs: () => 2 }, { t: 'the loose end of one of the tails', deg: () => 1, pcs: () => 1 }] },
 { d: () => 'two closed rings of pipe that share exactly one point', ends: () => 0,
  pts: [{ t: 'the shared point', deg: () => 4, pcs: () => 2 }, { t: 'a point of one ring that is not the shared point', deg: () => 2, pcs: () => 1 }] },
 { d: () => 'two closed rings of pipe joined by one straight bar, the bar running from a point of the first ring to a point of the second', ends: () => 0,
  pts: [{ t: 'the point where the bar meets the first ring', deg: () => 3, pcs: () => 2 }, { t: 'the middle of the bar', deg: () => 2, pcs: () => 2 }, { t: 'a point of the first ring that is not where the bar meets it', deg: () => 2, pcs: () => 1 }] },
 { d: p => `a junction with ${n(p.k)} straight pipes leaving it: ${n(p.r)} of them ${p.r === 1 ? 'ends' : 'end'} in a closed ring, joined to the ring at one point, and the remaining ${pl(p.k - p.r, 'pipe ends', 'pipes end')} loose`, ends: p => p.k - p.r,
  pts: [{ t: 'the junction', deg: p => p.k, pcs: p => p.k }, { t: 'the point where a pipe meets its ring', deg: () => 3, pcs: () => 2 },
   { t: 'a point of one of the rings that is not where its pipe meets it', deg: () => 2, pcs: () => 1 }, { t: 'the middle of one of the pipes that end loose', deg: () => 2, pcs: () => 2 }] }
];
/* Setting: a fitter cuts one point out of a pipe layout; pieces left and end points. Not q13's own letters. */
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'Snipping the pipe run',
 brief: 'The water plant’s pipe runs come in loops and branches, and a fitter needs to know what one cut does to each layout.',
 labels: ['pieces after the cut', 'end points'], tolerance: 0.01,
 gl: [['pipes at the cut'], ['pieces after the cut'], ['end points']]
}, {
 canonical: { f: 1, k: 4, r: 0, p: 0 },
 draw: R => tryDraw(() => {
  const f = R.int(0, LAY.length - 1), k = f === 0 ? R.int(3, 6) : f === 1 ? R.int(2, 4) : f === 4 ? R.int(3, 6) : 0, r = f === 4 ? R.int(1, k - 1) : 0;
  const p = { f, k, r, p: R.int(0, LAY[f].pts.length - 1) };
  return same(p, { f: 1, k: 4, r: 0, p: 0 }) ? null : p;
 }, { f: 0, k: 4, r: 0, p: 0 }),
 build: pr => {
  const L = LAY[pr.f], pt = L.pts[pr.p], deg = pt.deg(pr), pcs = pt.pcs(pr), ends = L.ends(pr);
  const cut = pcs === 1 ? 'the run stays in one piece, so it is not a cut point' : `the run falls into ${n(pcs)} pieces, so it is a cut point`;
  return {
   prompt: `The water plant’s pipe run is laid out as ${L.d(pr)}. A fitter cuts out one single point of it, ${pt.t}. Enter the number of pieces the run falls into. Then enter the number of end points the whole run had before the cut. An end point is a tip where a pipe stops and nothing carries on.`,
   answer: [pcs, ends],
   hints: [
    'Look at the pipes that run into the cut point. Each is cut off there, but pipes that are still joined some other way, round a ring, stay in the same piece.',
    'An end point is a tip where a pipe stops and nothing carries on. Junctions and the points on a ring are not end points.'
   ],
   solution: `${pl(deg, 'pipe runs', 'pipes run')} into ${pt.t}. With that point removed, ${cut}. The whole run has ${pl(ends, 'end point')}, the loose tips where a pipe stops and nothing carries on.`,
   guidance: [
    { prompt: `How many pipes run into ${pt.t}? (A point in the middle of a pipe has 2: one on each side.)`, answer: [deg], explanation: `${pl(deg, 'pipe runs', 'pipes run')} into that point. Each is cut off there, but some may still be joined further away.` },
    { prompt: `After the cut, how many pieces is the run in?`, answer: [pcs], explanation: `With ${pt.t} removed, ${cut}.` },
    { prompt: `How many end points does the whole run have?`, answer: [ends], explanation: `The run has ${pl(ends, 'end point')}, the loose tips where a pipe stops and nothing carries on.` }
   ] };
 }
});

/* A hub with k pipes, r of them ending in a ring; cut the hub, then also one pipe-to-ring junction. */
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Dismantling the manifold',
 brief: 'A pipe manifold is being taken down, and every separate piece that comes free needs a trolley.',
 labels: ['trolleys after the first cut', 'end points', 'trolleys after both cuts'], tolerance: 0.01,
 gl: [['trolleys after the first cut'], ['end points'], ['trolleys after both cuts']]
}, {
 canonical: { k: 4, r: 1 },
 draw: R => tryDraw(() => { const k = R.int(3, 9), p = { k, r: R.int(1, k - 1) }; return same(p, { k: 4, r: 1 }) ? null : p; }, { k: 5, r: 2 }),
 build: ({ k, r }) => {
  const e = k - r, after = k + 1;
  return {
   prompt: `A pipe manifold is a junction with ${n(k)} straight pipes leaving it: ${n(r)} of them ${r === 1 ? 'ends' : 'end'} in a closed ring, joined to the ring at one point, and the remaining ${pl(e, 'pipe ends', 'pipes end')} loose. Every separate piece of pipe that comes free needs one trolley. Fitters first cut out the junction alone. They then also cut out the point where one of the ring-ended pipes meets its ring. Enter the trolleys needed after the first cut alone, then the number of end points the whole manifold has (an end point is a tip where a pipe stops and nothing carries on), then the trolleys needed after both cuts.`,
   answer: [k, e, after],
   hints: [
    'Cutting out a point where several pipes meet cuts each of those pipes off there. A pipe that still joins itself round a ring stays in one piece.',
    'An end point is a loose tip. A pipe that finishes in a ring has no loose tip, and neither does the ring.',
    'The second cut falls inside one of the pieces left by the first. Work out how many pieces that one piece becomes, and add the change to the total.'
   ],
   solution: `${pl(k, 'pipe runs', 'pipes run')} into the junction. Cutting it out cuts each off, and none are joined again elsewhere, so there are ${n(k)} pieces: ${pl(k, 'trolley')}. The ${pl(e, 'pipe')} ending loose give ${pl(e, 'end point')}; the ring-ended pipes give none. Now the point where a pipe meets its ring: 3 pipes run into it, the stem and the 2 ways round the ring, but the 2 ways round are joined, so cutting it separates the stem from the ring. That piece becomes 2, so ${n(k)} + 1 = ${n(after)} trolleys.`,
   guidance: [
    { prompt: `How many pieces does the manifold fall into when only the junction is cut out?`, answer: [k], explanation: `${pl(k, 'pipe runs', 'pipes run')} into the junction. Each is cut off there and none rejoins, so there are ${n(k)} pieces.` },
    { prompt: `How many end points does the whole manifold have?`, answer: [e], explanation: `Only the loose tips count: ${pl(e, 'pipe')} end${e === 1 ? 's' : ''} loose, so there ${e === 1 ? 'is' : 'are'} ${pl(e, 'end point')}.` },
    { prompt: `After the junction is gone, a ring-ended pipe is one piece. Cutting the point where it meets its ring splits that piece into the stem and the ring. How many pieces are there in all after both cuts?`, answer: [after], explanation: `That one piece splits into the stem and the ring, which is 2 pieces instead of 1, so the total goes from ${n(k)} to ${n(after)}.` }
   ] };
 }
});

/* A hub with k arms, each forking into two loose branches; the hub is cut out and then the forks of j arms. */
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', title: 'Cutting the forked rig',
 brief: 'A forked mast rig has to be cut into carrying lengths, and the crew wants the piece count after each stage of the cutting.',
 labels: ['end points', 'pieces after the hub cut', 'pieces after all cuts'], tolerance: 0.01,
 gl: [['end points'], ['pieces after the hub cut'], ['pieces after all cuts']]
}, {
 canonical: { k: 4, j: 3 },
 draw: R => tryDraw(() => { const k = R.int(3, 9), p = { k, j: R.int(1, k) }; return same(p, { k: 4, j: 3 }) ? null : p; }, { k: 5, j: 2 }),
 build: ({ k, j }) => {
  const e = 2 * k, mid = k, last = k + 2 * j;
  return {
   prompt: `A mast rig is a hub with ${n(k)} straight arms. Each arm runs out to a fork, where it splits into two straight branches, and every branch ends loose. Riggers cut out the hub, and then also cut out ${j === 1 ? 'the fork of one arm' : `the forks of ${n(j)} different arms`}. Enter the number of end points the whole rig has (an end point is a tip where a pipe stops and nothing carries on). Then enter the number of pieces after the hub alone is cut out, and the number of pieces after the hub and the ${j === 1 ? 'fork' : 'forks'} named above are all cut out.`,
   answer: [e, mid, last],
   hints: [
    'An end point is a loose tip. Count the tips on one arm, then all the arms.',
    'Once the hub is gone, nothing joins one arm to another, so each arm is its own piece.',
    'Cutting out a fork where three pipes meet cuts those three apart. Work out how many pieces one arm becomes, and how much that adds.'
   ],
   solution: `Each arm forks into 2 loose branches, so each arm gives 2 end points, and ${n(k)} arms give ${n(e)}. With the hub cut out, no pipe joins one arm to another, so there are ${n(k)} pieces, one for each arm. Cutting out the fork of an arm separates its stem and its 2 branches, so that arm becomes 3 pieces instead of 1, which adds 2. For ${pl(j, 'arm')} that adds ${n(2 * j)}, so ${n(k)} + ${n(2 * j)} = ${n(last)} pieces.`,
   guidance: [
    { prompt: `Each arm ends in two loose branches. How many end points does the whole rig have?`, answer: [e], explanation: `Each arm ends in 2 loose branches, so it has 2 end points, and ${n(k)} arms have ${n(e)}.` },
    { prompt: `How many pieces does the rig fall into when only the hub is cut out?`, answer: [mid], explanation: `Nothing joins one arm to another once the hub is gone, so each of the ${n(k)} arms is a piece: ${n(mid)}.` },
    { prompt: `Cutting out an arm’s fork turns that arm from 1 piece into 3 (the stem and two branches). How many pieces are there after the hub and the forks of ${pl(j, 'arm')} are cut out?`, answer: [last], explanation: `Each such arm adds 2 pieces: ${n(k)} + 2 × ${n(j)} = ${n(last)}.` }
   ] };
 }
});

/* ---- q14 Homeomorphisms: telling shapes apart [W Continuity and Homeomorphisms] ---- */

const LETTERS = {
 A: { d: 'two straight strokes meeting at the apex, joined by a crossbar part of the way down, with both strokes going on below the bar as feet', v: 5, e: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4]] },
 B: { d: 'a straight stem with two curved bowls on its right: the upper bowl runs from the top of the stem to its middle, the lower bowl from the middle to the bottom', v: 5, e: [[0, 1], [1, 2], [0, 3], [3, 1], [1, 4], [4, 2]] },
 C: { d: 'one curved stroke, open on the right', v: 3, e: [[0, 1], [1, 2]] },
 D: { d: 'a straight stem with a curved bowl that joins its top to its bottom', v: 3, e: [[0, 1], [0, 2], [2, 1]] },
 E: { d: 'a straight stem with three straight arms going right, from its top, its middle and its bottom', v: 6, e: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5]] },
 F: { d: 'a straight stem with two straight arms going right, from its top and its middle', v: 5, e: [[0, 1], [1, 2], [0, 3], [1, 4]] },
 H: { d: 'two straight stems joined by a crossbar between their midpoints', v: 6, e: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]] },
 I: { d: 'one straight stroke', v: 2, e: [[0, 1]] },
 J: { d: 'a straight stroke with a hook at its bottom', v: 3, e: [[0, 1], [1, 2]] },
 K: { d: 'a straight stem with two straight arms going right from one point at its middle', v: 5, e: [[0, 1], [1, 2], [1, 3], [1, 4]] },
 L: { d: 'a straight stem with a straight foot going right from its bottom', v: 3, e: [[0, 1], [1, 2]] },
 M: { d: 'four straight strokes joined end to end in a zigzag', v: 5, e: [[0, 1], [1, 2], [2, 3], [3, 4]] },
 N: { d: 'three straight strokes joined end to end in a zigzag', v: 4, e: [[0, 1], [1, 2], [2, 3]] },
 O: { d: 'a single closed loop', v: 3, e: [[0, 1], [1, 2], [2, 0]] },
 P: { d: 'a straight stem with a curved bowl that leaves the top of the stem and comes back to meet the stem at its middle', v: 4, e: [[0, 1], [1, 2], [2, 3], [3, 1]] },
 R: { d: 'a straight stem with a curved bowl from the top of the stem back to its middle, and a straight leg going down to the right from the point where the bowl meets the middle of the stem', v: 5, e: [[0, 1], [1, 2], [2, 3], [3, 1], [1, 4]] },
 S: { d: 'one curving stroke', v: 3, e: [[0, 1], [1, 2]] },
 T: { d: 'a straight crossbar with a straight stem hanging down from its midpoint', v: 4, e: [[0, 2], [2, 1], [2, 3]] },
 U: { d: 'one curved stroke, open at the top', v: 3, e: [[0, 1], [1, 2]] },
 V: { d: 'two straight strokes meeting at the bottom point', v: 3, e: [[0, 1], [1, 2]] },
 W: { d: 'four straight strokes joined end to end in a zigzag', v: 5, e: [[0, 1], [1, 2], [2, 3], [3, 4]] },
 X: { d: 'two straight strokes crossing at their midpoints', v: 5, e: [[0, 4], [1, 4], [2, 4], [3, 4]] },
 Y: { d: 'two straight arms that meet at one point, with a straight stem going down from that point', v: 4, e: [[0, 2], [1, 2], [2, 3]] },
 Z: { d: 'three straight strokes joined end to end in a zigzag', v: 4, e: [[0, 1], [1, 2], [2, 3]] }
};
const degrees = g => { const d = Array(g.v).fill(0); for (const [a, b] of g.e) { d[a]++; d[b]++; } return d; };
/* End points (degree 1), branch points (degree 3 or more, with their degrees) and holes (E − V + 1, every letter is in one piece). */
const shapeOf = L => { const g = LETTERS[L], d = degrees(g); return { ends: d.filter(x => x === 1).length, branch: d.filter(x => x >= 3).sort(), holes: g.e.length - g.v + 1 }; };
const sigOf = L => { const s = shapeOf(L); return `${s.ends}|${s.branch.join(',')}|${s.holes}`; };
const branchTxt = s => s.branch.length === 0 ? 'no branch points' : s.branch.length === 1 ? `1 branch point (${n(s.branch[0])} strokes meet there)` : s.branch.every(x => x === s.branch[0]) ? `${n(s.branch.length)} branch points (${n(s.branch[0])} strokes meet at each)` : `${n(s.branch.length)} branch points (${andList(s.branch.map(n))} strokes meet there)`;
const shapeTxt = L => { const s = shapeOf(L); return `${pl(s.ends, 'end point')}, ${branchTxt(s)} and ${pl(s.holes, 'hole')}`; };
const FONT = Object.keys(LETTERS);
const WORDS = ['CABLE', 'RELAY', 'TORUS', 'SPHERE', 'HOOK', 'DOME', 'PANEL', 'LOOM', 'HULL', 'FABRIC', 'KEPLER', 'ROVER', 'BEACON', 'NODE', 'WAVE', 'DISC', 'FOLD', 'SHAPE', 'LOOP', 'FLUX', 'AXLE', 'RADAR', 'VALVE', 'ZONE', 'EXIT', 'TOWER', 'SPOKE', 'LADDER', 'HATCH', 'KAYAK', 'MIRA', 'ORBIT', 'VORTEX', 'ZEBRA', 'PYLON', 'DYNAMO', 'SKETCH', 'MATRIX', 'TEXT', 'BOX'];
const FONT_RULE = 'For the letters of this font, two letters with the same end points, branch points (with the same number of strokes at each) and holes are homeomorphic, and two that differ in any of them are not.';
const describe = (letters, extra) => [...new Set([...letters, ...(extra && !letters.includes(extra) ? [extra] : [])])].map(L => `${L} is ${LETTERS[L].d}`).join('; ');

/* Setting: a neon sign; letters homeomorphic to a target, and how many groups the different letters form. Not the worked example (RELAY, T). */
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'Sorting the neon letters',
 brief: 'The dock sign is bent from neon tube, and the sign shop wants to know which of its letters are the same shape as a spare.',
 labels: ['letters homeomorphic to the target', 'groups of letters'], tolerance: 0.01,
 gl: [['different letters'], ['letters homeomorphic to the target'], ['groups of letters']]
}, {
 canonical: { w: 'DOME', T: 'O' },
 draw: R => tryDraw(() => {
  const w = R.pick(WORDS), T = R.next() < 0.75 ? R.pick(w.split('')) : R.pick(FONT), p = { w, T };
  return same(p, { w: 'DOME', T: 'O' }) || (w === 'RELAY' && T === 'T') ? null : p;
 }, { w: 'KAYAK', T: 'Y' }),
 build: ({ w, T }) => {
  const letters = w.split(''), distinct = [...new Set(letters)], sig = sigOf(T);
  const match = letters.filter(L => sigOf(L) === sig), count = match.length;
  const classes = []; for (const L of distinct) { const c = classes.find(x => sigOf(x[0]) === sigOf(L)); if (c) c.push(L); else classes.push([L]); }
  const per = distinct.map(L => `${L} has ${shapeTxt(L)}`).join('; ');
  const matchTxt = count === 0 ? `none of the letters of ${w} matches ${T}` : count === 1 ? `the only letter that matches is ${match[0]}` : `the letters that match are ${andList(match)}`;
  const groupTxt = classes.map(c => andList(c)).join('; ');
  return {
   prompt: `A neon sign over the dock spells ${w} in the lab’s stencil font, which is drawn in thin strokes: ${describe(letters, T)}. Enter how many of the letters of ${w} are homeomorphic to the letter ${T}, counting a letter each time it appears. Then enter into how many groups the different letters of ${w} fall, when two letters share a group exactly when they are homeomorphic. ${FONT_RULE}`,
   answer: [count, classes.length],
   hints: [
    'Work out the end points, the branch points (with how many strokes meet at each) and the holes for each letter. Corners and curves do not count.',
    'Letters with the same three numbers are homeomorphic and go in one group. Count a repeated letter once when counting groups, but each time it appears when counting matches.'
   ],
   solution: `${T} has ${shapeTxt(T)}. In ${w}: ${per}. So ${matchTxt}, and the count is ${n(count)}. The different letters sort into the groups ${groupTxt}: ${n(classes.length)} groups.`,
   guidance: [
    { prompt: `How many different letters does ${w} use? (A letter that appears twice counts once.)`, answer: [distinct.length], explanation: `The different letters are ${andList(distinct)}: ${n(distinct.length)}.` },
    { prompt: `Compare each letter of ${w} with ${T}. How many letters, counting repeats, have the same end points, branch points and holes as ${T}?`, answer: [count], explanation: `${T} has ${shapeTxt(T)}. In ${w}: ${per}. So ${matchTxt}.` },
    { prompt: `Put the different letters of ${w} into groups of mutually homeomorphic letters. How many groups are there?`, answer: [classes.length], explanation: `${per}. The groups are ${groupTxt}: ${n(classes.length)}.` }
   ] };
 }
});

/* Applied: spares bent as T are re-bent into homeomorphic letters (cost R each); other letters need fresh cable (cost U each). */
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Reusing the spare tubing',
 brief: 'The sign shop has a rack of spare cable already bent into one letter, and it wants to know how many letters of the next order can be made from it.',
 labels: ['letters made from spares', 'letters needing fresh cable', 'total cost (credits)'], tolerance: 0.01,
 gl: [['letters made from spares'], ['letters needing fresh cable'], ['total cost (credits)']]
}, {
 canonical: { w: 'TOWER', T: 'Y', cr: 3, cu: 8 },
 draw: R => tryDraw(() => {
  const w = R.pick(WORDS), T = R.next() < 0.75 ? R.pick(w.split('')) : R.pick(FONT), cr = R.int(2, 5), cu = cr + R.int(2, 5), p = { w, T, cr, cu };
  return same(p, { w: 'TOWER', T: 'Y', cr: 3, cu: 8 }) ? null : p;
 }, { w: 'KAYAK', T: 'Y', cr: 2, cu: 6 }),
 build: ({ w, T, cr, cu }) => {
  const letters = w.split(''), len = letters.length, sig = sigOf(T), match = letters.filter(L => sigOf(L) === sig), m = match.length, fresh = len - m, cost = cr * m + cu * fresh;
  const per = [...new Set(letters)].map(L => `${L} has ${shapeTxt(L)}`).join('; ');
  const matchTxt = m === 0 ? `none of the letters of ${w} matches ${T}` : m === 1 ? `the only letter that matches is ${match[0]}` : `the letters that match are ${andList(match)}`;
  return {
   prompt: `The sign shop keeps a rack of spare cables, each already bent into the letter ${T} of the lab’s stencil font, which is drawn in thin strokes: ${describe(letters, T)}. A spare can be re-bent, with no cutting or gluing, into any letter homeomorphic to ${T}, and finishing such a letter costs ${n(cr)} credits. Every other letter needs a fresh cable and costs ${n(cu)} credits. An order is for the letters of ${w}, one cable for each letter, a repeated letter needing a cable each time. Enter how many letters can be made from spares, then how many need fresh cable, then the total cost in credits. ${FONT_RULE}`,
   answer: [m, fresh, cost],
   hints: [
    'Work out the end points, the branch points (with how many strokes meet at each) and the holes for each letter. A spare can only become a letter with the same three numbers.',
    'Count a letter each time it appears. The letters that cannot be made from spares are all the others.',
    'Total cost is the number of spare-made letters times their price, plus the number of fresh-cable letters times theirs.'
   ],
   solution: `${T} has ${shapeTxt(T)}. In ${w}: ${per}. So ${matchTxt}: ${pl(m, 'letter')} from spares and ${n(len)} − ${n(m)} = ${n(fresh)} from fresh cable. The cost is ${n(m)} × ${n(cr)} + ${n(fresh)} × ${n(cu)} = ${n(cost)} credits.`,
   guidance: [
    { prompt: `Compare each letter of ${w} with ${T}. How many letters, counting repeats, have the same end points, branch points and holes as ${T}?`, answer: [m], explanation: `${T} has ${shapeTxt(T)}. In ${w}: ${per}. So ${matchTxt}.` },
    { prompt: `The order has ${n(len)} letters in all. How many of them need fresh cable?`, answer: [fresh], explanation: `${n(len)} − ${n(m)} = ${n(fresh)} letters.` },
    { prompt: `Spare-made letters cost ${n(cr)} credits and fresh-cable letters ${n(cu)} credits. What is the total cost of the order?`, answer: [cost], explanation: `${n(m)} × ${n(cr)} + ${n(fresh)} × ${n(cu)} = ${n(cost)} credits.` }
   ] };
 }
});

/* Challenge: a tag of 8 random letters and a target given only by its numbers (e end points, br the strokes at each branch point, h holes).
   Reads the numbers, as in q13, instead of a letter. */
const brTxtOf = br => br.length === 0 ? 'no branch points' : br.length === 1 ? `1 branch point (${n(br[0])} strokes meet there)` : br.every(x => x === br[0]) ? `${n(br.length)} branch points (${n(br[0])} strokes meet at each)` : `${n(br.length)} branch points (${andList(br.map(n))} strokes meet there)`;
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13', title: 'Matching a described tag',
 brief: 'A buyer describes the shape she wants only by its end points, branch points and holes, and the stores must find the matching letters on a cable tag.',
 labels: ['letters with the right end points', 'letters homeomorphic to the shape', 'different matching letters'], tolerance: 0.01,
 gl: [['letters with the right end points'], ['letters homeomorphic to the shape'], ['different matching letters']]
}, {
 canonical: { tag: 'SNARLMEN', e: 2, br: [], h: 0 },
 draw: R => tryDraw(() => {
  const L = R.pick(FONT), s = shapeOf(L), sig = sigOf(L); let tag = '';
  for (let i = 0; i < 8; i++) tag += R.pick(FONT);
  const hits = tag.split('').filter(c => sigOf(c) === sig).length;
  if (hits < 1 || hits > 5) return null;
  const withEnds = tag.split('').filter(c => shapeOf(c).ends === s.ends).length;
  if (withEnds === hits && R.next() < 0.7) return null;
  if (new Set(tag.split('').filter(c => sigOf(c) === sig)).size === hits && R.next() < 0.6) return null;
  const p = { tag, e: s.ends, br: s.branch, h: s.holes };
  return tag === 'SNARLMEN' ? null : p;
 }, { tag: 'MATHREBK', e: 3, br: [3], h: 0 }),
 build: ({ tag, e, br, h }) => {
  const letters = tag.split(''), sig = `${e}|${br.join(',')}|${h}`;
  const withEnds = letters.filter(c => shapeOf(c).ends === e), match = letters.filter(c => sigOf(c) === sig), diff = [...new Set(match)];
  const per = [...new Set(letters)].map(L => `${L} has ${shapeTxt(L)}`).join('; ');
  const target = `${pl(e, 'end point')}, ${brTxtOf(br)} and ${pl(h, 'hole')}`;
  const endTxt = withEnds.length === 0 ? `none of the letters has ${pl(e, 'end point')}` : `the letters with ${pl(e, 'end point')} are ${andList(withEnds)}`;
  const matchTxt = match.length === 0 ? 'none of them also has the right branch points and holes' : `of these, ${andList(match)} also ${match.length === 1 ? 'has' : 'have'} the right branch points and holes`;
  return {
   prompt: `The stores label cable tags with a letter code, and the tag ${tag} is spelled in the lab’s stencil font, which is drawn in thin strokes: ${describe(letters)}. A buyer wants every letter of the tag that is homeomorphic to a shape with ${target}. Enter, in this order: how many letters of the tag have exactly ${n(e)} end ${e === 1 ? 'point' : 'points'}; how many letters of the tag are homeomorphic to the shape, counting a letter each time it appears; and how many different letters those are. ${FONT_RULE}`,
   answer: [withEnds.length, match.length, diff.length],
   hints: [
    'Work out the end points, the branch points (with how many strokes meet at each) and the holes for each different letter of the tag. Corners and curves do not count.',
    'A letter matches only if all three numbers agree with the shape described. Having the right end points is the first test, not the last.',
    'Count a letter each time it appears for the first two answers, and once for the third.'
   ],
   solution: `${per}. The shape has ${target}. In the tag ${tag}, ${endTxt}: ${pl(withEnds.length, 'letter')}. ${matchTxt.charAt(0).toUpperCase() + matchTxt.slice(1)}: ${pl(match.length, 'letter')}, of which ${n(diff.length)} ${diff.length === 1 ? 'is' : 'are'} different.`,
   guidance: [
    { prompt: `Count the end points of each letter of ${tag}. How many letters, counting repeats, have exactly ${n(e)} end ${e === 1 ? 'point' : 'points'}?`, answer: [withEnds.length], explanation: `${per}. So ${endTxt}: ${pl(withEnds.length, 'letter')}.` },
    { prompt: `Of those, how many also have the branch points and holes of the shape (${target})?`, answer: [match.length], explanation: `${matchTxt.charAt(0).toUpperCase() + matchTxt.slice(1)}: ${pl(match.length, 'letter')}.` },
    { prompt: `How many different letters are among the matching letters?`, answer: [diff.length], explanation: match.length === 0 ? 'There are no matching letters.' : match.length === 1 ? `The only matching letter is ${match[0]}: 1 different letter.` : `The matching letters are ${andList(match)}: ${pl(diff.length, 'different letter')}.` }
   ] };
 }
});

/* ---- q15 Open covers and compactness [L 8.4, W Compactness] ---- */

/* The fewest open stretches of length L (L10 = 10L, to keep the arithmetic whole) covering [a, b]. */
const coverInfo = (a, b, L10) => { const D = b - a, k = Math.floor(10 * D / L10) + 1, L = L10 / 10; return { D, k, L, tie: (10 * D) % L10 === 0,
 txt: `${pl(k, 'clamp')} of ${n(L)} metres give ${n(Math.round(k * L10) / 10)} metres in all, which is more than ${n(D)}, while ${pl(k - 1, 'clamp')} give only ${n(Math.round((k - 1) * L10) / 10)} metres, which is not more than ${n(D)}` }; };
/* Sets whose compactness is asked. kind indexes this list of descriptions; c and d are the numbers in it. */
const SETS = [
 { t: (c, d) => `[${n(c)}, ${n(d)}]`, closed: 1, bounded: 1, why: (c, d) => `[${n(c)}, ${n(d)}] contains its boundary points ${n(c)} and ${n(d)}, so it is closed, and it lies between ${n(c)} and ${n(d)}, so it is bounded.` },
 { t: (c, d) => `(${n(c)}, ${n(d)})`, closed: 0, bounded: 1, why: (c, d) => `(${n(c)}, ${n(d)}) is bounded, but its boundary points ${n(c)} and ${n(d)} are not in it, so it is not closed.` },
 { t: (c, d) => `(${n(c)}, ${n(d)}]`, closed: 0, bounded: 1, why: (c, d) => `(${n(c)}, ${n(d)}] is bounded, but its boundary point ${n(c)} is not in it, so it is not closed.` },
 { t: c => `(−∞, ${n(c)}] (every x with x ≤ ${n(c)})`, closed: 1, bounded: 0, why: c => `It contains its only boundary point ${n(c)}, so it is closed, but it runs on for ever, so no interval [−r, r] holds it: it is not bounded.` },
 { t: (c, d) => `the numbers x with |x| ≤ ${n(d)}`, closed: 1, bounded: 1, why: (c, d) => `These are the numbers from −${n(d)} to ${n(d)} including both ends, the interval [−${n(d)}, ${n(d)}], which is closed and bounded.` },
 { t: (c, d) => `the numbers x with |x| < ${n(d)}`, closed: 0, bounded: 1, why: (c, d) => `These are the numbers strictly between −${n(d)} and ${n(d)}. The boundary points −${n(d)} and ${n(d)} are not in the set, so it is bounded but not closed.` },
 { t: (c, d) => `the numbers x with |x${c === 0 ? '' : c < 0 ? ' + ' + n(-c) : ' − ' + n(c)}| ≥ ${n(d)}`, closed: 1, bounded: 0, why: (c, d) => `These are every x with x ≤ ${n(c - d)} or x ≥ ${n(c + d)}. The boundary points ${n(c - d)} and ${n(c + d)} belong to it, so it is closed, but it runs on for ever in both directions, so it is not bounded.` },
 { t: c => `the whole numbers ${n(c)}, ${n(c + 1)}, ${n(c + 2)}, … running on for ever`, closed: 1, bounded: 0, why: c => `Every point of it is a boundary point that belongs to it, and there are no others, so it is closed; but it runs on for ever, so it is not bounded.` },
 { t: (c, d) => `the whole numbers from ${n(c)} to ${n(d)}: ${d - c <= 2 ? Array.from({ length: d - c + 1 }, (_, i) => n(c + i)).join(', ') : n(c) + ', ' + n(c + 1) + ', …, ' + n(d)}`, closed: 1, bounded: 1, why: (c, d) => `A finite set of points is its own boundary and contains it, so it is closed, and it lies between ${n(c)} and ${n(d)}, so it is bounded.` },
 { t: () => `{0, 1/2, 2/3, 3/4, …} (the numbers (k − 1) ÷ k for k = 1, 2, 3, …)`, closed: 0, bounded: 1, why: () => `It lies between 0 and 1, so it is bounded. But the points (k − 1) ÷ k crowd in on 1, so every ball round 1 meets the set: 1 is a boundary point that is not in the set, and the set is not closed.` },
 { t: () => `{0, 1/2, 2/3, 3/4, …} ∪ {1} (the numbers (k − 1) ÷ k for k = 1, 2, 3, …, together with the number 1)`, closed: 1, bounded: 1, why: () => `The points (k − 1) ÷ k crowd in on 1, and 1 belongs to this set, so it contains all its boundary points and is closed; it lies between 0 and 1, so it is bounded.` },
 { t: (c, d) => `[${n(c)}, ${n(d)}] ∪ (${n(d + 1)}, ${n(d + 2)})`, closed: 0, bounded: 1, why: (c, d) => `It is bounded, but its boundary points ${n(d + 1)} and ${n(d + 2)} are not in it, so it is not closed.` },
 { t: (c, d) => `[${n(c)}, ${n(d)}] ∪ [${n(d + 2)}, ∞) (every x in the first interval, together with every x with x ≥ ${n(d + 2)})`, closed: 1, bounded: 0, why: (c, d) => `All its boundary points ${n(c)}, ${n(d)} and ${n(d + 2)} belong to it, so it is closed, but it runs on for ever, so it is not bounded.` },
 { t: (c, d) => `[${n(c)}, ${n(d)}) ∪ {${n(d)}}`, closed: 1, bounded: 1, why: (c, d) => `Adding the point ${n(d)} gives the interval [${n(c)}, ${n(d)}], which contains its boundary points and lies between ${n(c)} and ${n(d)}, so it is closed and bounded.` },
 { t: (c, d) => `the numbers x with 0 < |x| ≤ ${n(d)}`, closed: 0, bounded: 1, why: (c, d) => `These are the numbers from −${n(d)} to ${n(d)} except 0. The point 0 has points of the set on both sides but is not in it, so the set is bounded but not closed.` }
];
const ABS_KINDS = [4, 5, 6, 14];
/* A set parameter draw: kind, and the numbers c and d it needs (d at least c + 1, or a positive number for the |x| kinds). */
const drawSet = R => { const kind = R.int(0, SETS.length - 1), c = R.int(-6, 4); return { kind, c, d: ABS_KINDS.includes(kind) ? R.int(2, 9) : c + R.int(1, 5) }; };
const compactOf = S => S.closed && S.bounded ? 1 : 0;

/* Setting: floodlights on an airstrip. Fewest lights covering [a, b] with open stretches of length L; compactness of a set. */
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'Lighting the airstrip',
 brief: 'The landing strip needs floodlights along its whole length, and the Cable Works wants to know the fewest that will do.',
 labels: ['fewest floodlights', 'S compact (1 or 0)'], tolerance: 0.01,
 gl: [['strip length (m)'], ['fewest floodlights'], ['S closed (1 or 0)'], ['S bounded (1 or 0)']]
}, {
 canonical: { a: -3, b: 10, L10: 25, kind: 4, c: 2, d: 3 },
 draw: R => tryDraw(() => {
  const a = R.int(-6, 6), L10 = R.pick([12, 15, 18, 20, 25, 30, 35, 40]), D = R.int(5, 30), s = drawSet(R), p = { a, b: a + D, L10, ...s };
  const C = coverInfo(a, a + D, L10); if (C.k < 3 || (C.tie && R.next() < 0.7)) return null;
  return same(p, { a: -3, b: 10, L10: 25, kind: 4, c: 2, d: 3 }) ? null : p;
 }, { a: 1, b: 12, L10: 20, kind: 0, c: 1, d: 3 }),
 build: ({ a, b, L10, kind, c, d }) => {
  const C = coverInfo(a, b, L10), S = SETS[kind], comp = compactOf(S);
  return {
   prompt: `A landing strip runs from x = ${n(a)} to x = ${n(b)}, measured in metres: it is the closed interval [${n(a)}, ${n(b)}]. Each floodlight lights an open stretch of the strip ${n(C.L)} metres long, wherever it is mounted, and lights nothing outside that stretch. Enter the fewest floodlights whose stretches together light every point of the strip. Then enter 1 if the set S = ${S.t(c, d)} is compact, or 0 if it is not.`,
   answer: [C.k, comp],
   hints: [
    'An open stretch leaves out its two end points, so neighbouring floodlights must overlap: together they light the strip only if their total length is more than the strip’s length, not just equal to it.',
    'On the line a set is compact exactly when it is closed (it contains all its boundary points) and bounded (it fits inside some interval [−r, r]).'
   ],
   solution: `The strip is ${n(b)} − ${par(a)} = ${n(C.D)} metres long. ${C.txt.replace(/clamp/g, 'floodlight')}. So ${n(C.k)} overlapping floodlights are the fewest that light it. ${S.why(c, d)} So S ${comp ? 'is' : 'is not'} compact: enter ${comp}.`,
   guidance: [
    { prompt: `How long is the strip [${n(a)}, ${n(b)}], in metres?`, answer: [C.D], explanation: `${n(b)} − ${par(a)} = ${n(C.D)} metres.` },
    { prompt: `What is the fewest floodlights of ${n(C.L)} metres whose total length is more than ${n(C.D)} metres?`, answer: [C.k], explanation: `${C.txt.replace(/clamp/g, 'floodlight')}.` },
    { prompt: `Is S = ${S.t(c, d)} closed? Enter 1 for yes or 0 for no.`, answer: [S.closed], explanation: S.why(c, d) },
    { prompt: `Is S bounded? Enter 1 for yes or 0 for no.`, answer: [S.bounded], explanation: `${S.bounded ? 'S fits inside an interval [−r, r] once r is large enough, so it is bounded' : 'S runs on for ever, so no interval [−r, r] holds it: it is not bounded'}. Compact means closed and bounded, so S ${comp ? 'is' : 'is not'} compact.` }
   ] };
 }
});

/* Applied: light clamps (length L1, price p1) against heavy ones (L2, p2) on [a, b]; cost of each, and which is cheaper (1 light, 2 heavy). */
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Light or heavy clamps',
 brief: 'The stores stock two kinds of clamp for the test cable, and the Cable Works wants the cheaper way to hold it along its whole length.',
 labels: ['cost with light clamps', 'cost with heavy clamps', 'cheaper kind (1 light, 2 heavy)'], tolerance: 0.01,
 gl: [['cost with light clamps'], ['cost with heavy clamps'], ['cheaper kind (1 light, 2 heavy)']]
}, {
 canonical: { a: 4, b: 19, L1: 20, p1: 3, L2: 45, p2: 5 },
 draw: R => tryDraw(() => {
  const a = R.int(-6, 6), D = R.int(8, 40), L1 = R.pick([10, 12, 15, 20, 25]), L2 = L1 + R.pick([10, 15, 20, 25]), p1 = R.int(2, 5), p2 = p1 + R.int(1, 6);
  const c1 = coverInfo(a, a + D, L1), c2 = coverInfo(a, a + D, L2); if (c1.tie || c2.tie || c1.k < 3 || c1.k * p1 === c2.k * p2) return null;
  const p = { a, b: a + D, L1, p1, L2, p2 };
  return same(p, { a: 4, b: 19, L1: 20, p1: 3, L2: 45, p2: 5 }) ? null : p;
 }, { a: 0, b: 17, L1: 20, p1: 3, L2: 50, p2: 8 }),
 build: ({ a, b, L1, p1, L2, p2 }) => {
  const c1 = coverInfo(a, b, L1), c2 = coverInfo(a, b, L2), t1 = c1.k * p1, t2 = c2.k * p2, win = t1 < t2 ? 1 : 2;
  return {
   prompt: `The test cable on the bench is the closed interval [${n(a)}, ${n(b)}], measured in metres. Light clamps each grip an open stretch ${n(c1.L)} metres long and cost ${n(p1)} credits each. Heavy clamps each grip an open stretch ${n(c2.L)} metres long and cost ${n(p2)} credits each. A clamp may be placed wherever you like, and an open stretch leaves out its two end points. Enter the cost in credits of holding the whole cable with the fewest light clamps, then with the fewest heavy clamps, then enter 1 if the light clamps are the cheaper way or 2 if the heavy clamps are.`,
   answer: [t1, t2, win],
   hints: [
    'Open stretches leave out their end points, so neighbouring clamps must overlap: n clamps of length L hold a cable of length D only if n × L is more than D.',
    'Work out the fewest clamps of each kind first, then multiply by the price of that kind.',
    'Compare the two totals. The cheaper way is the one with the smaller total cost.'
   ],
   solution: `The cable is ${n(b)} − ${par(a)} = ${n(c1.D)} metres long. Light: ${c1.txt}, so ${n(c1.k)} light clamps are the fewest, costing ${n(c1.k)} × ${n(p1)} = ${n(t1)} credits. Heavy: ${c2.txt}, so ${n(c2.k)} heavy clamps are the fewest, costing ${n(c2.k)} × ${n(p2)} = ${n(t2)} credits. ${t1 < t2 ? 'The light clamps' : 'The heavy clamps'} cost less, so enter ${win}.`,
   guidance: [
    { prompt: `Find the fewest light clamps whose total length is more than the ${n(c1.D)} metres of cable, then multiply by ${n(p1)} credits. What is the cost?`, answer: [t1], explanation: `${c1.txt}, so ${n(c1.k)} clamps, costing ${n(c1.k)} × ${n(p1)} = ${n(t1)} credits.` },
    { prompt: `Find the fewest heavy clamps whose total length is more than ${n(c2.D)} metres, then multiply by ${n(p2)} credits. What is the cost?`, answer: [t2], explanation: `${c2.txt}, so ${n(c2.k)} clamps, costing ${n(c2.k)} × ${n(p2)} = ${n(t2)} credits.` },
    { prompt: `The light way costs ${n(t1)} credits and the heavy way ${n(t2)}. Enter 1 if the light clamps are cheaper or 2 if the heavy clamps are.`, answer: [win], explanation: `${n(Math.min(t1, t2))} is less than ${n(Math.max(t1, t2))}, so the ${win === 1 ? 'light' : 'heavy'} clamps are cheaper: ${n(win)}.` }
   ] };
 }
});

/* Challenge: bigger cable and awkward clamp lengths; S, and the closure of S (S together with its boundary points). */
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q05', title: 'The stay cable and its closure',
 brief: 'A long mast stay is clamped with odd-sized clamps, and the inspectors also want to know whether the gaps in a signal set matter once its edges are added.',
 labels: ['fewest clamps', 'S compact (1 or 0)', 'closure of S compact (1 or 0)'], tolerance: 0.01,
 gl: [['stay length (m)'], ['fewest clamps'], ['S compact (1 or 0)'], ['closure of S compact (1 or 0)']]
}, {
 canonical: { a: -7, b: 52, L10: 23, kind: 1, c: 1, d: 6 },
 draw: R => tryDraw(() => {
  const a = R.int(-30, 30), D = R.int(20, 90), L10 = R.pick([7, 9, 11, 13, 14, 16, 17, 19, 23, 27, 31, 37, 43]), s = drawSet(R), p = { a, b: a + D, L10, ...s };
  const C = coverInfo(a, a + D, L10); if (C.tie && R.next() < 0.85) return null;
  return same(p, { a: -7, b: 52, L10: 23, kind: 1, c: 1, d: 6 }) ? null : p;
 }, { a: -10, b: 40, L10: 17, kind: 2, c: 0, d: 4 }),
 build: ({ a, b, L10, kind, c, d }) => {
  const C = coverInfo(a, b, L10), S = SETS[kind], comp = compactOf(S), compCl = S.bounded;
  return {
   prompt: `A mast stay runs from x = ${n(a)} to x = ${n(b)}, measured in metres: it is the closed interval [${n(a)}, ${n(b)}]. Each clamp grips an open stretch ${n(C.L)} metres long, wherever its centre is put. Enter the fewest clamps whose open stretches together cover the whole stay. A signal set is S = ${S.t(c, d)}. The closure of S is S together with all its boundary points. Enter 1 if S is compact or 0 if it is not, and then 1 if the closure of S is compact or 0 if it is not.`,
   answer: [C.k, comp, compCl],
   hints: [
    'Open stretches leave out their end points, so neighbouring clamps must overlap: n clamps of length L cover a stay of length D only if n × L is more than D.',
    'On the line a set is compact exactly when it is closed and bounded.',
    'The closure is always closed, so it is compact exactly when it is bounded. Adding boundary points does not change whether a set is bounded.'
   ],
   solution: `The stay is ${n(b)} − ${par(a)} = ${n(C.D)} metres long. ${C.txt}. So ${n(C.k)} overlapping clamps are the fewest that cover it. ${S.why(c, d)} So S ${comp ? 'is' : 'is not'} compact. Its closure contains all its boundary points, so it is closed, and it ${S.bounded ? 'is bounded because S is' : 'is not bounded because S is not'}: the closure ${compCl ? 'is' : 'is not'} compact.`,
   guidance: [
    { prompt: `How long is the stay [${n(a)}, ${n(b)}], in metres?`, answer: [C.D], explanation: `${n(b)} − ${par(a)} = ${n(C.D)} metres.` },
    { prompt: `What is the fewest clamps of ${n(C.L)} metres whose total length is more than ${n(C.D)} metres?`, answer: [C.k], explanation: `${C.txt}.` },
    { prompt: `Is S = ${S.t(c, d)} compact? Enter 1 for yes or 0 for no.`, answer: [comp], explanation: `${S.why(c, d)} So S ${comp ? 'is' : 'is not'} compact.` },
    { prompt: `Is the closure of S compact? Enter 1 for yes or 0 for no.`, answer: [compCl], explanation: `The closure is closed, and it ${S.bounded ? 'is bounded because S is' : 'is not bounded because S is not'}, so it ${compCl ? 'is' : 'is not'} compact.` }
   ] };
 }
});

})();
