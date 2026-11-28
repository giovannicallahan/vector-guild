/* Topology: shape without size practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p2.js. */
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
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: [].concat(gl[i]), explanation: g.explanation })) }, gen);
};
/* Bounded retry: try make() up to 1000 times until ok(p); otherwise fall back to the canonical parameters. */
const tryDraw = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return JSON.parse(JSON.stringify(canonical)); };
const plural = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
const joinAnd = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
/* Finite sets of nodes 1..N are bit masks: node i is bit i − 1. */
const members = m => { const out = []; for (let i = 0; i < 6; i++) if (m & (1 << i)) out.push(i + 1); return out; };
const size = m => members(m).length;
const fmt = m => m ? `{${members(m).join(', ')}}` : '∅';
const order = list => list.slice().sort((x, y) => size(x) - size(y) || x - y);
const fmtList = list => order(list).map(fmt).join(', ');
const sameList = (a, b) => a.length === b.length && order(a).every((x, i) => x === order(b)[i]);
const uniq = list => [...new Set(list)];
/* Close a family of masks under unions and intersections and add ∅ and X: always a topology on X. */
const closeUp = (seed, full) => { const s = new Set([0, full, ...seed]); let grew = true;
 while (grew) { grew = false; const a = [...s]; for (const x of a) for (const y of a) for (const z of [x | y, x & y]) if (!s.has(z)) { s.add(z); grew = true; } }
 return order([...s]); };
/* A pair {A, B} of different listed sets is bad when A ∪ B or A ∩ B is not listed. */
const badPairs = list => { const s = new Set(list), a = order(list), out = [];
 for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (!s.has(a[i] | a[j]) || !s.has(a[i] & a[j])) out.push([a[i], a[j]]);
 return out; };
/* The first way a list fails to be a topology on X, or null if it is one (pairs suffice for a finite list). */
const failure = (list, full) => { const s = new Set(list);
 if (!s.has(0)) return { kind: 'empty' };
 if (!s.has(full)) return { kind: 'whole' };
 const a = order(list);
 for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
  if (!s.has(a[i] | a[j])) return { kind: 'union', A: a[i], B: a[j], C: a[i] | a[j] };
  if (!s.has(a[i] & a[j])) return { kind: 'meet', A: a[i], B: a[j], C: a[i] & a[j] }; }
 return null; };
/* A random topology on N points with at most `most` open sets, built from 1 to 3 random proper subsets. */
const randomTopology = (R, N, most) => { const full = (1 << N) - 1;
 for (let i = 0; i < 1000; i++) { const k = R.int(1, 3), seed = []; for (let j = 0; j < k; j++) seed.push(R.int(1, full - 1));
  const t = closeUp(seed, full); if (t.length <= most) return t; }
 return [0, 1, full]; };
const complements = (list, full) => list.map(U => full & ~U);
/* All unions of basis sets (∅ is the union of none). */
const unions = basis => { const s = new Set(); for (let c = 0; c < 1 << basis.length; c++) { let u = 0; basis.forEach((b, i) => { if (c & (1 << i)) u |= b; }); s.add(u); } return order([...s]); };
const covers = (basis, full) => basis.reduce((u, b) => u | b, 0) === full;
/* The overlap rule: every node of an overlap of two basis sets is in a basis set that fits inside the overlap. */
const overlapRule = basis => { for (const A of basis) for (const B of basis) { const I = A & B; if (!I) continue;
  for (const x of members(I)) if (!basis.some(C => (C & ~I) === 0 && (C & (1 << (x - 1))))) return false; }
 return true; };
const isBasis = (basis, full) => covers(basis, full) && overlapRule(basis);
/* Maps from X (NX nodes) to Y (NY dishes a, b, c): a map is the list of image indices 0 = a, 1 = b, 2 = c. */
const YN = ['a', 'b', 'c'];
const fmtY = m => { const out = []; for (let i = 0; i < 3; i++) if (m & (1 << i)) out.push(YN[i]); return out.length ? `{${out.join(', ')}}` : '∅'; };
const orderY = list => list.slice().sort((x, y) => size(x) - size(y) || x - y);
const pre = (f, V) => f.reduce((m, y, i) => (V & (1 << y)) ? m | (1 << i) : m, 0);
const contin = (f, TX, TY) => TY.every(V => TX.includes(pre(f, V)));
const allMaps = (NX, NY) => { const out = []; for (let c = 0; c < Math.pow(NY, NX); c++) { const f = []; let r = c; for (let i = 0; i < NX; i++) { f.push(r % NY); r = Math.floor(r / NY); } out.push(f); } return out; };
const fmtMap = f => f.map((y, i) => `f(${i + 1}) = ${YN[y]}`).join(', ');
const tuple = g => `(${g.map(y => YN[y]).join(', ')})`;
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(c => SUP[c]).join('');

/* ---- q06 Unions and intersections of open sets [L 8.2] ---- */

/* The infinite or long family of q06b; f picks one of six kinds (three open, three not), A and B are whole-number band
   limits with B − A at least 3, and K is the last k of the finite family. f is only an index into this list of texts. */
const q06bFam = (f, A, B, K) => [
 { text: `the set of frequencies that lie in every one of the bands (${n(A)} − 1 ÷ k, ${n(B)} + 1 ÷ k) for k = 1, 2, 3 and so on for ever`, open: 0,
   why: `A frequency x is in every one of those bands exactly when ${n(A)} − 1 ÷ k < x < ${n(B)} + 1 ÷ k for every k. As k grows, ${n(A)} − 1 ÷ k climbs towards ${n(A)} and ${n(B)} + 1 ÷ k falls towards ${n(B)}, so the frequencies that survive are those with ${n(A)} ≤ x ≤ ${n(B)}: the set is [${n(A)}, ${n(B)}]. Every ball round ${n(A)} contains numbers below ${n(A)}, which are not in the set, so it is not open.` },
 { text: `the union of all the closed bands [${n(A)} + 1 ÷ k, ${n(B)} − 1 ÷ k] for k = 2, 3, 4 and so on for ever`, open: 1,
   why: `Any x with ${n(A)} < x < ${n(B)} lies in one of those closed bands once k is large enough, while ${n(A)}, ${n(B)} and everything beyond them lie in none. So the union is the open interval (${n(A)}, ${n(B)}), which is open even though every piece is closed.` },
 { text: `the set of frequencies that lie in every one of the bands (${n(A)} − 1 ÷ k, ${n(B)} + 1 ÷ k) for k = 1 to ${n(K)}`, open: 1,
   why: `These bands shrink as k grows, so the band for k = ${n(K)} lies inside all the others and the intersection is (${n(A)} − 1 ÷ ${n(K)}, ${n(B)} + 1 ÷ ${n(K)}). That is an open interval: finitely many open sets always meet in an open set.` },
 { text: `the union of all the bands (${n(A)}, ${n(B)} − 1 ÷ k) for k = 1, 2, 3 and so on for ever`, open: 1,
   why: `Any x with ${n(A)} < x < ${n(B)} lies in one of those bands once 1 ÷ k is below ${n(B)} − x, so the union is (${n(A)}, ${n(B)}). Any union of open sets is open, and indeed (${n(A)}, ${n(B)}) is open.` },
 { text: `the set of frequencies that lie in every one of the bands (${n(A)}, ${n(B)} + 1 ÷ k) for k = 1, 2, 3 and so on for ever`, open: 0,
   why: `A frequency x is in every one of those bands exactly when ${n(A)} < x < ${n(B)} + 1 ÷ k for every k. As k grows, ${n(B)} + 1 ÷ k falls towards ${n(B)}, so the set is (${n(A)}, ${n(B)}]: it contains ${n(B)}. Every ball round ${n(B)} contains numbers above ${n(B)}, which are not in the set, so it is not open.` },
 { text: `the set of frequencies that lie in every one of the bands (${n(A)} − 1 ÷ k, ${n(B)}) for k = 1, 2, 3 and so on for ever`, open: 0,
   why: `A frequency x is in every one of those bands exactly when ${n(A)} − 1 ÷ k < x < ${n(B)} for every k. As k grows, ${n(A)} − 1 ÷ k climbs towards ${n(A)}, so the set is [${n(A)}, ${n(B)}): it contains ${n(A)}. Every ball round ${n(A)} contains numbers below ${n(A)}, which are not in the set, so it is not open.` }
][f];

mk({
 id: 'q06b', parent: 'q06', kind: 'setting',
 title: 'Overlapping radio bands',
 brief: 'Three radio links along the survey ridge must share frequencies, and the engineers also need to know whether a never-ending list of bands leaves an open set.',
 labels: ['lower limit p', 'upper limit q', 'open (1 or 0)'], tolerance: 0.01,
 gl: ['lower limit p', 'upper limit q', 'open (1 or 0)']
}, {
 /* Three open bands with a non-empty overlap (limits 2 to 36, whole MHz) and a family f built from the whole numbers
    A and B (B − A at least 3) and the last index K of the finite family. */
 canonical: { a1: 4, b1: 18, a2: 9, b2: 26, a3: 7, b3: 15, f: 4, A: 5, B: 11, K: 6 },
 draw: R => tryDraw(() => { const iv = () => { const a = R.int(2, 24); return [a, a + R.int(5, 14)]; }, [a1, b1] = iv(), [a2, b2] = iv(), [a3, b3] = iv(), A = R.int(2, 9);
  return { a1, b1, a2, b2, a3, b3, f: R.int(0, 5), A, B: A + R.int(3, 8), K: R.int(3, 9) }; },
  p => Math.max(p.a1, p.a2, p.a3) < Math.min(p.b1, p.b2, p.b3), { a1: 4, b1: 18, a2: 9, b2: 26, a3: 7, b3: 15, f: 4, A: 5, B: 11, K: 6 }),
 build: ({ a1, b1, a2, b2, a3, b3, f, A, B, K }) => { const L = Math.max(a1, a2, a3), Rt = Math.min(b1, b2, b3), F = q06bFam(f, A, B, K); return {
  prompt: `Three radio links on the survey ridge each use an open band of frequencies, in MHz: (${n(a1)}, ${n(b1)}), (${n(a2)}, ${n(b2)}) and (${n(a3)}, ${n(b3)}). A frequency that lies inside all three bands is shared by all three links, and the shared frequencies form an open interval (p, q). Enter p, then q. Then the engineers look at ${F.text}. Enter 1 if this set is open and 0 if it is not.`,
  answer: [L, Rt, F.open],
  hints: ['A frequency is shared when it lies in all three bands, so it must be above every lower limit and below every upper limit.', 'Finitely many open sets always meet in an open set, and any union of open sets is open. For a list that never ends, work out exactly which numbers are in the set, then check whether each of them has room round it inside the set.'],
  solution: `The shared frequencies start at the largest lower limit: the largest of ${n(a1)}, ${n(a2)} and ${n(a3)} is ${n(L)}. They stop at the smallest upper limit: the smallest of ${n(b1)}, ${n(b2)} and ${n(b3)} is ${n(Rt)}. So the links share (${n(L)}, ${n(Rt)}), an open interval, as an intersection of finitely many open sets must be. Now the second set. ${F.why} So the last answer is ${F.open}.`,
  guidance: [
   { prompt: `What is the largest of the three lower limits?`, answer: [L], explanation: `A shared frequency must be above ${n(a1)}, ${n(a2)} and ${n(a3)}, so above ${n(L)}, the largest of them.` },
   { prompt: `What is the smallest of the three upper limits?`, answer: [Rt], explanation: `It must also be below ${n(b1)}, ${n(b2)} and ${n(b3)}, so below ${n(Rt)}, the smallest of them.` },
   { prompt: `Now look at ${F.text}. Work out which numbers it holds. Is it open? Enter 1 for yes, 0 for no.`, answer: [F.open], explanation: F.why }
  ] }; }
});

mk({
 id: 'q06c', parent: 'q06', kind: 'applied',
 title: 'Where the rover keeps its link',
 brief: 'A rover is parked on the road and the crew needs to know how far it can drift before it loses the link to one of four beacons.',
 labels: ['left end p', 'right end q', 'largest radius r'], tolerance: 0.01,
 gl: ['left end p', 'right end q', 'largest radius r']
}, {
 /* Four open stretches with a common stretch (p, q) at least 3 km long, and a marker x that is a whole number of
    kilometres strictly inside it. */
 canonical: { a1: 1, b1: 13, a2: 4, b2: 15, a3: 2, b3: 11, a4: 5, b4: 16, x: 7 },
 draw: R => tryDraw(() => { const iv = () => { const a = R.int(0, 10); return [a, a + R.int(6, 16)]; }, [a1, b1] = iv(), [a2, b2] = iv(), [a3, b3] = iv(), [a4, b4] = iv();
  const p = Math.max(a1, a2, a3, a4), q = Math.min(b1, b2, b3, b4); return { a1, b1, a2, b2, a3, b3, a4, b4, x: q - p >= 3 ? R.int(p + 1, q - 1) : 0 }; },
  P => Math.min(P.b1, P.b2, P.b3, P.b4) - Math.max(P.a1, P.a2, P.a3, P.a4) >= 3 && P.x > 0, { a1: 1, b1: 13, a2: 4, b2: 15, a3: 2, b3: 11, a4: 5, b4: 16, x: 7 }),
 build: ({ a1, b1, a2, b2, a3, b3, a4, b4, x }) => { const p = Math.max(a1, a2, a3, a4), q = Math.min(b1, b2, b3, b4), dl = x - p, dr = q - x, r = Math.min(dl, dr); return {
  prompt: `Four beacons stand along the road across the Survey Grid. Each reaches an open stretch of the road, measured in kilometres from the depot: (${n(a1)}, ${n(b1)}), (${n(a2)}, ${n(b2)}), (${n(a3)}, ${n(b3)}) and (${n(a4)}, ${n(b4)}). A rover keeps its link only on the stretch that all four beacons reach, an open interval (p, q). The rover is parked at the ${n(x)} km mark. Enter p, then q. Then enter the largest radius r, in kilometres, for which the open ball (${n(x)} − r, ${n(x)} + r) round the rover lies inside (p, q).`,
  answer: [p, q, r],
  hints: ['The stretch all four beacons reach starts at the largest of the four left ends and stops at the smallest of the four right ends.', 'The ball round the rover is the interval from its mark minus r to its mark plus r. It fits inside (p, q) while its left end is not below p and its right end is not above q.'],
  solution: `The largest of the left ends ${n(a1)}, ${n(a2)}, ${n(a3)} and ${n(a4)} is ${n(p)}, and the smallest of the right ends ${n(b1)}, ${n(b2)}, ${n(b3)} and ${n(b4)} is ${n(q)}. So all four beacons reach (${n(p)}, ${n(q)}). The rover at ${n(x)} is ${n(dl)} km from the left end and ${n(dr)} km from the right end. The ball (${n(x)} − r, ${n(x)} + r) stays inside (${n(p)}, ${n(q)}) exactly while r is at most the smaller of those two distances, so the largest radius is ${n(r)} km.`,
  guidance: [
   { prompt: `What is the largest of the four left ends? It is where the shared stretch starts.`, answer: [p], explanation: `A point of the shared stretch must be to the right of ${n(a1)}, ${n(a2)}, ${n(a3)} and ${n(a4)}, so of ${n(p)}, the largest of them.` },
   { prompt: `What is the smallest of the four right ends? It is where the shared stretch stops.`, answer: [q], explanation: `It must also be to the left of ${n(b1)}, ${n(b2)}, ${n(b3)} and ${n(b4)}, so of ${n(q)}, the smallest of them.` },
   { prompt: `How far is the ${n(x)} km mark from each end of (${n(p)}, ${n(q)})? Enter the smaller of the two distances, which is the largest radius r that fits.`, answer: [r], explanation: `The distances are ${n(x)} − ${n(p)} = ${n(dl)} and ${n(q)} − ${n(x)} = ${n(dr)}. The smaller, ${n(r)}, is the largest radius that keeps the ball inside.` }
  ] }; }
});

/* A stretch's ends are written with brackets: [ ] include the end point, ( ) leave it out. */
const brk = ([a, b, ca, cb]) => `${ca ? '[' : '('}${n(a)}, ${n(b)}${cb ? ']' : ')'}`;
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q05',
 title: 'Fence sections with mixed ends',
 brief: 'Four sections of the survey fence overlap, some with their end posts inside and some without, and the crew needs to know what kind of stretch they all share.',
 labels: ['left end p', 'right end q', 'open (1 or 0)', 'closed (1 or 0)'], tolerance: 0.01,
 gl: ['left end p', 'right end q', 'end points inside (0, 1 or 2)']
}, {
 /* iv lists four stretches [left, right, 1 if the left end is included, 1 if the right end is included] with whole-number
    ends in kilometres. They share a stretch of length at least 2. */
 canonical: { iv: [[2, 9, 1, 1], [4, 12, 0, 1], [1, 10, 1, 0], [4, 11, 1, 0]] },
 draw: R => tryDraw(() => ({ iv: [0, 1, 2, 3].map(() => { const a = R.int(0, 9); return [a, a + R.int(4, 12), R.int(0, 1), R.int(0, 1)]; }) }),
  ({ iv }) => Math.min(...iv.map(v => v[1])) - Math.max(...iv.map(v => v[0])) >= 2, { iv: [[2, 9, 1, 1], [4, 12, 0, 1], [1, 10, 1, 0], [4, 11, 1, 0]] }),
 build: ({ iv }) => { const p = Math.max(...iv.map(v => v[0])), q = Math.min(...iv.map(v => v[1])),
   atP = iv.filter(v => v[0] === p), atQ = iv.filter(v => v[1] === q), inP = atP.every(v => v[2]) ? 1 : 0, inQ = atQ.every(v => v[3]) ? 1 : 0, cnt = inP + inQ,
   open = cnt === 0 ? 1 : 0, closed = cnt === 2 ? 1 : 0, text = brk([p, q, inP, inQ]), all = joinAnd(iv.map(brk));
  const side = (at, e, inn, who) => at.length === 1 ? `${who} ${brk(at[0])} has ${e} end ${n(e === 'left' ? p : q)}; it has a ${inn ? 'square' : 'round'} bracket there, so ${n(e === 'left' ? p : q)} is ${inn ? 'in' : 'left out of'} the shared stretch.` : `The stretches with ${e} end ${n(e === 'left' ? p : q)} are ${joinAnd(at.map(brk))}; ${inn ? 'every one of them has a square bracket there, so' : 'at least one of them has a round bracket there, so'} ${n(e === 'left' ? p : q)} is ${inn ? 'in' : 'left out of'} the shared stretch.`,
   wP = side(atP, 'left', inP, 'Only'), wQ = side(atQ, 'right', inQ, 'Only'); return {
  prompt: `Four sections of the survey fence are described by stretches of the x-axis, in kilometres: ${all}. A square bracket means the end point is in the stretch and a round bracket means it is left out. The points that lie in all four sections form one stretch with left end p and right end q. Enter p, then q. Then enter 1 if that stretch is an open set and 0 if it is not, and then 1 if it is a closed set and 0 if it is not.`,
  answer: [p, q, open, closed],
  hints: ['The shared stretch starts at the largest left end and stops at the smallest right end. An end point is in the shared stretch only if it is in every one of the four stretches.', 'A stretch is open when it contains neither end point, and closed when it contains both. Look at the brackets of the stretches whose end is the shared end.'],
  solution: `The largest left end is ${n(p)} and the smallest right end is ${n(q)}. ${wP} ${wQ} So the shared stretch is ${text}. A stretch is an open set when neither end point is in it, and a closed set when both are. This one has ${n(cnt)} of its 2 end points, so the answers are ${n(open)} for open and ${n(closed)} for closed.`,
  guidance: [
   { prompt: `What is the largest of the four left ends? It is where the shared stretch starts.`, answer: [p], explanation: `A point of the shared stretch must be to the right of every left end (or equal to it), so it starts at ${n(p)}, the largest of them.` },
   { prompt: `What is the smallest of the four right ends? It is where the shared stretch stops.`, answer: [q], explanation: `It must also be to the left of every right end (or equal to it), so it stops at ${n(q)}, the smallest of them.` },
   { prompt: `The end point ${n(p)} is in the shared stretch only if every stretch that starts there includes it, and ${n(q)} is in it only if every stretch that stops there includes it. How many of the two end points ${n(p)} and ${n(q)} are in the shared stretch? Enter 0, 1 or 2.`, answer: [cnt], explanation: `${wP} ${wQ} That makes ${n(cnt)} of the 2 end points.` }
  ] }; }
});

/* ---- q07 Topologies on a finite set [W Topological Spaces] ---- */

mk({
 id: 'q07b', parent: 'q07', kind: 'setting',
 title: 'The harbour buoy zones',
 brief: 'The harbour office has listed groups of buoys as open zones, and the crew must check that the list is a real topology before the chart is printed.',
 labels: ['is a topology (1 or 0)', 'subsets not in the list'], tolerance: 0.01,
 gl: ['∅ and X listed (1 or 0)', 'pairs pass (1 or 0)', 'subsets of X']
}, {
 /* A list of subsets (masks) of 3 or 4 buoys, about half of them a topology. Never the q07 worked example (∅, {2}, {2, 3}, X on 3 buoys). */
 canonical: { N: 4, sets: [0, 1, 3, 6, 15] },
 draw: R => tryDraw(() => { const N = R.int(3, 4), full = (1 << N) - 1, t = randomTopology(R, N, 8);
  let sets = t.slice(); const u = R.next();
  if (u < 0.1) sets = sets.filter(x => x !== 0); else if (u < 0.2) sets = sets.filter(x => x !== full);
  else if (u < 0.5) { const inner = sets.filter(x => x !== 0 && x !== full && sets.some(A => sets.some(B => A !== x && B !== x && ((A | B) === x || (A & B) === x)))); if (inner.length) { const drop = R.pick(inner); sets = sets.filter(x => x !== drop); } }
  return { N, sets }; }, p => p.sets.length >= 3 && !(p.N === 3 && sameList(p.sets, [0, 2, 6, 7])), { N: 4, sets: [0, 1, 3, 6, 15] }),
 build: ({ N, sets }) => { const full = (1 << N) - 1, F = failure(sets, full), ok = F ? 0 : 1, both = sets.includes(0) && sets.includes(full) ? 1 : 0, FP = failure(uniq([0, full, ...sets]), full), pairs = FP ? 0 : 1, total = Math.pow(2, N), missing = total - sets.length;
  const proper = order(sets).filter(x => x !== 0 && x !== full);
  const eg = proper.length >= 2 ? `${fmt(proper[0])} ∪ ${fmt(proper[1])} = ${fmt(proper[0] | proper[1])} and ${fmt(proper[0])} ∩ ${fmt(proper[1])} = ${fmt(proper[0] & proper[1])}` : `${fmt(proper[0])} ∪ X = X and ${fmt(proper[0])} ∩ X = ${fmt(proper[0])}`;
  const why = !F ? `∅ and X are both listed, and every union and every intersection of two listed sets is listed again (for example ${eg}), so the list is a topology.`
   : F.kind === 'empty' ? 'The empty set ∅ is not in the list, so the list is not a topology.'
   : F.kind === 'whole' ? `The whole set X = ${fmt(full)} is not in the list, so the list is not a topology.`
   : F.kind === 'union' ? `${fmt(F.A)} ∪ ${fmt(F.B)} = ${fmt(F.C)} is not in the list, so the list is not a topology.`
   : `${fmt(F.A)} ∩ ${fmt(F.B)} = ${fmt(F.C)} is not in the list, so the list is not a topology.`;
  const pairWhy = pairs ? `Every union and every intersection of two listed sets is in the list${both ? '' : ' (putting in the missing ∅ or X changes nothing here)'}.` : `${FP.kind === 'union' ? `${fmt(FP.A)} ∪ ${fmt(FP.B)}` : `${fmt(FP.A)} ∩ ${fmt(FP.B)}`} = ${fmt(FP.C)} is not in the list.`; return {
  prompt: `The harbour office numbers its buoys 1 to ${n(N)}, so X = ${fmt(full)}. It lists these groups of buoys as open zones: ${fmtList(sets)}. Enter 1 if this list is a topology on X and 0 if it is not. Then enter how many of the subsets of X, counting ∅ and X themselves, are not in the list.`,
  answer: [ok, missing],
  hints: ['A list is a topology when ∅ and X are in it, the union of any two listed sets is listed, and the intersection of any two listed sets is listed. For a finite list, checking pairs is enough.', 'Count all the subsets of X first: each buoy is either in a subset or out of it. Then take away the ones the list holds.'],
  solution: `${why} So the first answer is ${ok}. A set of ${n(N)} buoys has 2${sup(N)} = ${n(total)} subsets, ∅ and X included. The list holds ${n(sets.length)} of them, so ${n(total)} − ${n(sets.length)} = ${n(missing)} subsets are not in the list.`,
  guidance: [
   { prompt: `Are ∅ and X both in the list? Enter 1 for yes, 0 for no.`, answer: [both], explanation: both ? `Both ∅ and ${fmt(full)} are listed.` : (sets.includes(0) ? `${fmt(full)} is missing.` : '∅ is missing.') },
   { prompt: `Is the union and the intersection of every pair of listed sets also in the list? Enter 1 for yes, 0 for no.`, answer: [pairs], explanation: pairWhy },
   { prompt: `How many subsets does a set of ${n(N)} buoys have, counting ∅ and the whole set?`, answer: [total], explanation: `Two choices, in or out, for each of ${n(N)} buoys: 2${sup(N)} = ${n(total)}. The list holds ${n(sets.length)}, which leaves ${n(missing)} out.` }
  ] }; }
});

/* The rounds of "add every union and intersection of two listed sets": the sets each round adds, from the starting list. */
const rounds = start => { const s = new Set(start), out = []; for (;;) { const a = [...s], fresh = new Set();
  for (const x of a) for (const y of a) if (x !== y) for (const z of [x | y, x & y]) if (!s.has(z)) fresh.add(z);
  if (!fresh.size) return out; out.push(order([...fresh])); fresh.forEach(z => s.add(z)); } };
mk({
 id: 'q07c', parent: 'q07', kind: 'applied',
 title: 'The smallest list that works',
 brief: 'Mira insists that a few relay groups must count as open, and the crew must build the smallest topology that holds them.',
 labels: ['new sets in round one', 'open sets in the finished list', 'every subset open (1 or 0)'], tolerance: 0.01,
 gl: ['new sets in round one', 'open sets in the finished list', 'every subset open (1 or 0)']
}, {
 /* N nodes (3 or 4) and 2 or 3 different required groups (masks of proper non-empty subsets); the first round adds at least one set. */
 canonical: { N: 4, seeds: [3, 6] },
 /* About one draw in three is made to finish with every subset open (the discrete topology), so the last box is not 0 in nearly every draw. */
 draw: R => { const disc = R.int(0, 2) === 0 ? 1 : 0;
  return tryDraw(() => { const N = R.int(3, 4), full = (1 << N) - 1, k = R.int(2, 3), seeds = []; for (let i = 0; i < k; i++) seeds.push(R.int(1, full - 1));
  return { N, seeds: uniq(seeds) }; }, ({ N, seeds }) => { const full = (1 << N) - 1, r = rounds(uniq([0, full, ...seeds])); return seeds.length >= 2 && r.length >= 1 && !(N === 3 && sameList(seeds, [2, 6])) && (closeUp(seeds, full).length === (1 << N) ? 1 : 0) === disc; }, { N: 4, seeds: [3, 6] }); },
 build: ({ N, seeds }) => { const full = (1 << N) - 1, start = uniq([0, full, ...seeds]), rs = rounds(start), first = rs[0].length, fin = closeUp(seeds, full), total = Math.pow(2, N), disc = fin.length === total ? 1 : 0;
  const later = rs.slice(1).reduce((a, r) => a.concat(r), []);
  const laterText = later.length ? `Later rounds add ${fmtList(later)}, and then a round adds nothing.` : 'A second round adds nothing.'; return {
  prompt: `Mira insists that these groups of relay nodes must be open sets on the network X = ${fmt(full)}: ${fmtList(seeds)}. A topology also needs ∅ and X, so put them in the list too. Then take every pair of different sets in the list and add their union and their intersection if they are not already there; count each new set once. Each round combines only the sets that were in the list when that round began; sets it adds are combined from the next round on. Enter how many new sets this first round adds. Keep going, round after round, until a round adds nothing: the finished list is the smallest topology that holds Mira's groups. Enter how many open sets it has. Then enter 1 if every subset of X is open in it and 0 if not.`,
  answer: [first, fin.length, disc],
  hints: ['Do one round at a time. In a round, combine every pair of different sets that are in the list at the start of that round, and write down only the results that are new.', 'Stop when a whole round gives nothing new. Every subset of X is open exactly when the finished list is as long as the number of subsets of X, which is 2 multiplied by itself once for each node.'],
  solution: `The starting list is ${fmtList(start)}. The first round adds ${fmtList(rs[0])}: ${plural(first, 'new set', 'new sets')}. ${laterText} The finished list is ${fmtList(fin)}, which has ${plural(fin.length, 'open set', 'open sets')}. X has 2${sup(N)} = ${n(total)} subsets, so ${disc ? 'every subset is open' : 'not every subset is open'}.`,
  guidance: [
   { prompt: `Start from ∅, X and the groups Mira named. Combine every pair of different sets in that list. How many new sets does this first round add?`, answer: [first], explanation: `The starting list is ${fmtList(start)}. The first round adds ${fmtList(rs[0])}: ${plural(first, 'new set', 'new sets')}.` },
   { prompt: `Keep combining pairs, round after round, until nothing new appears. How many open sets are in the finished list, counting ∅ and X?`, answer: [fin.length], explanation: `${laterText} The finished list is ${fmtList(fin)}: ${n(fin.length)} sets.` },
   { prompt: `X has ${n(total)} subsets in all. Is every one of them in the finished list? Enter 1 for yes, 0 for no.`, answer: [disc], explanation: `The finished list has ${n(fin.length)} sets and X has ${n(total)} subsets, so ${disc ? 'every subset is open' : 'some subsets are not open'}.` }
  ] }; }
});

mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q06',
 title: 'Repairing a broken zone list',
 brief: 'A long list of open zones has gaps in it, and the crew must count the faulty pairs and the fewest zones to add to mend it.',
 labels: ['faulty pairs', 'fewest sets to add'], tolerance: 0.01,
 gl: ['pairs of listed sets', 'faulty pairs', 'fewest sets to add']
}, {
 /* N nodes (4 or 5) and a list of 6 to 11 sets that holds ∅ and X but is not a topology (at least one faulty pair). */
 canonical: { N: 4, sets: [0, 1, 2, 4, 3, 12, 13, 15] },
 draw: R => tryDraw(() => { const N = R.int(4, 5), full = (1 << N) - 1; let sets = randomTopology(R, N, 14);
  const inner = sets.filter(x => x !== 0 && x !== full), drops = R.int(1, 2);
  for (let i = 0; i < drops && inner.length > 3; i++) { const d = R.pick(inner); sets = sets.filter(x => x !== d); inner.splice(inner.indexOf(d), 1); }
  if (R.bool()) sets.push(R.int(1, full - 1));
  return { N, sets: uniq(sets) }; }, ({ N, sets }) => sets.length >= 6 && sets.length <= 11 && sets.includes(0) && sets.includes((1 << N) - 1) && badPairs(sets).length >= 1 && !sameList(sets, [0, 1, 2, 4, 3, 12, 13, 15]), { N: 4, sets: [0, 1, 2, 4, 3, 12, 13, 15] }),
 build: ({ N, sets }) => { const full = (1 << N) - 1, m = sets.length, pairsAll = m * (m - 1) / 2, bad = badPairs(sets), fin = closeUp(sets, full), add = fin.length - m;
  const badText = bad.map(([A, B]) => `${fmt(A)} with ${fmt(B)}`);
  const [fa, fb] = bad[0], missingEx = sets.includes(fa | fb) ? `${fmt(fa)} ∩ ${fmt(fb)} = ${fmt(fa & fb)} is not listed` : `${fmt(fa)} ∪ ${fmt(fb)} = ${fmt(fa | fb)} is not listed`; return {
  prompt: `The relay network has nodes 1 to ${n(N)}, so X = ${fmt(full)}. The engineers' list of open sets, with ∅ and X in it, is: ${fmtList(sets)}. Call a pair of different listed sets faulty when their union or their intersection (or both) is not in the list; count each pair once. Enter how many pairs are faulty. Then enter the fewest sets that must be added to the list to make it a topology. Remember that any topology that holds all the listed sets must also hold every union and intersection of them, and so on, round after round.`,
  answer: [bad.length, add],
  hints: ['Take the listed sets two at a time. The pairs that include ∅ or X are never faulty. For every other pair, work out the union and the intersection and look for each in the list.', 'The sets that must be added are exactly the ones that appear when you keep adding unions and intersections of listed sets, round after round, until nothing new turns up. Count the sets in the finished list and take away the ones you started with.'],
  solution: `The list has ${n(m)} sets, so there are ${n(m)} × ${n(m - 1)} ÷ 2 = ${n(pairsAll)} pairs to check. The faulty pairs are ${joinAnd(badText)}: ${plural(bad.length, 'pair', 'pairs')}. For the first of them, ${missingEx}. Adding every missing union and intersection, round after round, gives the finished list ${fmtList(fin)}, which has ${n(fin.length)} sets. Any topology that holds the ${n(m)} listed sets holds all of these, so the fewest to add is ${n(fin.length)} − ${n(m)} = ${n(add)}.`,
  guidance: [
   { prompt: `The list has ${n(m)} sets. How many pairs of different sets can be chosen from it?`, answer: [pairsAll], explanation: `Choose a first set in ${n(m)} ways and a different second set in ${n(m - 1)} ways, then divide by 2 because the order does not matter: ${n(m)} × ${n(m - 1)} ÷ 2 = ${n(pairsAll)}.` },
   { prompt: `For each pair, look for its union and its intersection in the list. How many pairs are faulty?`, answer: [bad.length], explanation: `The faulty pairs are ${joinAnd(badText)}: ${plural(bad.length, 'pair', 'pairs')}.` },
   { prompt: `Add every missing union and intersection, round after round, until nothing new appears. How many sets does the finished list have more than the original list?`, answer: [add], explanation: `The finished list is ${fmtList(fin)}, with ${n(fin.length)} sets. Compared with the ${n(m)} listed sets, that is ${n(add)} more.` }
  ] }; }
});

/* ---- q08 Closed sets and closure [W Topological Spaces] ---- */

/* The closure of a set A of nodes: the intersection of all the closed sets that contain A. */
const closureOf = (T, full, A) => complements(T, full).filter(C => (C & A) === A).reduce((m, C) => m & C, full);
const interiorOf = (T, A) => T.filter(U => (U & ~A) === 0).reduce((m, U) => m | U, 0);

mk({
 id: 'q08b', parent: 'q08', kind: 'setting',
 title: 'Pump stations and their closures',
 brief: 'A pipeline control room names its service zones as open sets, and the crew needs the closure of a pair of stations to know what a shutdown reaches.',
 labels: ['closed sets containing the station', 'stations in the closure'], tolerance: 0.01,
 gl: ['closed sets in all', 'closed sets containing the station', 'stations in the closure']
}, {
 /* A topology on 3 to 5 stations with at most 8 open sets, a station p and a different station q. Never the q08 worked
    example (X = {1, 2, 3} with ∅, {1}, {1, 2}, X). */
 canonical: { N: 4, sets: [0, 2, 3, 12, 14, 15], p: 3, q: 4 },
 draw: R => tryDraw(() => { const N = R.int(3, 5), full = (1 << N) - 1; let sets = randomTopology(R, N, 8);
  if (R.next() < 0.4) { const A = R.int(1, full - 1), B = R.int(1, full - 1); sets = closeUp([A, full & ~A, B], full); }
  const p = R.int(1, N); return { N, sets, p, q: R.except(1, N, [p]) }; }, P => P.sets.length <= 8 && P.sets.length >= 4 && !(P.N === 3 && sameList(P.sets, [0, 1, 3, 7])), { N: 4, sets: [0, 2, 3, 12, 14, 15], p: 3, q: 4 }),
 build: ({ N, sets, p, q }) => { const full = (1 << N) - 1, bp = 1 << (p - 1), A = bp | (1 << (q - 1)), closed = order(complements(sets, full)), withP = closed.filter(C => C & bp), withA = closed.filter(C => (C & A) === A), cl = withA.reduce((m, C) => m & C, full), k = size(cl);
  const clText = withA.length === 1 ? `The only closed set that contains both stations is ${fmt(withA[0])}` : `The closed sets that contain both ${n(p)} and ${n(q)} are ${joinAnd(withA.map(fmt))}. Their intersection is ${fmt(cl)}`; return {
  prompt: `A pipeline has pump stations 1 to ${n(N)}, so X = ${fmt(full)}. The control room's service zones, the open sets, are ${fmtList(sets)}. A closed set is the complement of an open set: the stations of X that are not in it. Enter how many closed sets contain station ${n(p)}. Then enter how many stations are in the closure of ${fmt(A)}, the smallest closed set that contains both station ${n(p)} and station ${n(q)}.`,
  answer: [withP.length, k],
  hints: ['Write down the complement of each open set: those are the closed sets. Then keep only the ones that hold the station you are asked about.', 'The closure of a set A is the intersection of all the closed sets that contain every station of A.'],
  solution: `The closed sets, the complements of the open sets, are ${fmtList(closed)}. The ones that contain station ${n(p)} are ${joinAnd(withP.map(fmt))}: ${plural(withP.length, 'closed set', 'closed sets')}. ${clText}, so the closure of ${fmt(A)} has ${plural(k, 'station', 'stations')}.`,
  guidance: [
   { prompt: `Take the complement of each open set. How many closed sets are there in all, counting ∅ and X?`, answer: [closed.length], explanation: `The complements are ${fmtList(closed)}: ${n(closed.length)} closed sets, one for each open set.` },
   { prompt: `How many of the closed sets contain station ${n(p)}?`, answer: [withP.length], explanation: `The closed sets that contain station ${n(p)} are ${joinAnd(withP.map(fmt))}: ${n(withP.length)} of them.` },
   { prompt: `Which closed sets contain both station ${n(p)} and station ${n(q)}? How many stations are in their intersection?`, answer: [k], explanation: `${clText}: ${plural(k, 'station', 'stations')}.` }
  ] }; }
});

mk({
 id: 'q08c', parent: 'q08', kind: 'applied',
 title: 'Resetting after a node failure',
 brief: 'When a relay node fails, every node in its closure must be reset, and the crew needs the time that will take.',
 labels: ['closed groups containing the node', 'nodes in the closure', 'reset time (minutes)'], tolerance: 0.01,
 gl: ['closed groups containing the node', 'nodes in the closure', 'reset time (minutes)']
}, {
 /* A topology on 4 or 5 nodes with 4 to 9 open sets, a failed node p, and a reset time of m minutes per node. */
 canonical: { N: 5, sets: [0, 4, 3, 24, 7, 28, 27, 31], p: 1, m: 6 },
 draw: R => tryDraw(() => { const N = R.int(4, 5), full = (1 << N) - 1, sets = randomTopology(R, N, 9); return { N, sets, p: R.int(1, N), m: R.int(3, 15) }; },
  P => P.sets.length >= 4 && !sameList(P.sets, [0, 4, 3, 24, 7, 28, 27, 31]) || false, { N: 5, sets: [0, 4, 3, 24, 7, 28, 27, 31], p: 1, m: 6 }),
 build: ({ N, sets, p, m }) => { const full = (1 << N) - 1, bp = 1 << (p - 1), closed = order(complements(sets, full)), withP = closed.filter(C => C & bp), cl = withP.reduce((a, C) => a & C, full), k = size(cl), mins = k * m;
  const clText = withP.length === 1 ? `The only closed group that contains node ${n(p)} is X itself` : `The intersection of those closed groups is ${fmt(cl)}`; return {
  prompt: `The relay mesh has nodes 1 to ${n(N)}, so X = ${fmt(full)}, and its open groups are ${fmtList(sets)}. A closed group is the complement of an open group. When node ${n(p)} fails, every node in the closure of {${n(p)}}, the smallest closed group that contains node ${n(p)}, must be reset, and a reset takes ${n(m)} minutes per node. Enter how many closed groups contain node ${n(p)}. Then enter how many nodes are in the closure of {${n(p)}}. Then enter the total reset time in minutes.`,
  answer: [withP.length, k, mins],
  hints: ['The closed groups are the complements of the open groups. List them, then keep only the ones that contain the failed node.', 'The closure of {p} is the intersection of the closed groups that contain p. The total time is the number of nodes in it multiplied by the time per node.'],
  solution: `The closed groups, the complements of the open groups, are ${fmtList(closed)}. The ones that contain node ${n(p)} are ${joinAnd(withP.map(fmt))}: ${plural(withP.length, 'closed group', 'closed groups')}. ${clText}, so the closure of {${n(p)}} has ${plural(k, 'node', 'nodes')}. The reset takes ${n(k)} × ${n(m)} = ${n(mins)} minutes.`,
  guidance: [
   { prompt: `Take the complement of each open group. How many of the closed groups contain node ${n(p)}?`, answer: [withP.length], explanation: `The closed groups are ${fmtList(closed)}. The ones that contain node ${n(p)} are ${joinAnd(withP.map(fmt))}: ${n(withP.length)} of them.` },
   { prompt: `How many nodes are in the intersection of those closed groups, the closure of {${n(p)}}?`, answer: [k], explanation: `${clText}: ${plural(k, 'node', 'nodes')}.` },
   { prompt: `Each node in the closure takes ${n(m)} minutes to reset. How many minutes does the whole reset take?`, answer: [mins], explanation: `${n(k)} nodes at ${n(m)} minutes each is ${n(k)} × ${n(m)} = ${n(mins)} minutes.` }
  ] }; }
});

mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q05',
 title: 'Inside, outside and edge of a group',
 brief: 'For a group of relay nodes the crew wants the closure, the interior and the edge, the same three ideas the Survey Grid used for stretches of road.',
 labels: ['nodes in the closure', 'nodes in the interior', 'nodes in the boundary'], tolerance: 0.01,
 gl: ['nodes in the closure', 'nodes in the interior', 'nodes in the boundary']
}, {
 /* A topology on 4 or 5 nodes with 5 to 10 open sets and a group A of 2 or 3 nodes (a mask). */
 canonical: { N: 5, sets: [0, 1, 6, 7, 24, 25, 30, 31], A: 13 },
 draw: R => tryDraw(() => { const N = R.int(4, 5), full = (1 << N) - 1, sets = randomTopology(R, N, 10), k = R.int(2, 3), nodes = []; while (nodes.length < k) { const v = R.int(1, N); if (!nodes.includes(v)) nodes.push(v); }
  return { N, sets, A: nodes.reduce((m, v) => m | (1 << (v - 1)), 0) }; }, P => P.sets.length >= 5 && !sameList(P.sets, [0, 1, 6, 7, 24, 25, 30, 31]), { N: 5, sets: [0, 1, 6, 7, 24, 25, 30, 31], A: 13 }),
 build: ({ N, sets, A }) => { const full = (1 << N) - 1, closed = order(complements(sets, full)), withA = closed.filter(C => (C & A) === A), cl = closureOf(sets, full, A), inn = interiorOf(sets, A), bd = cl & ~inn, inside = order(sets.filter(U => (U & ~A) === 0));
  const clText = withA.length === 1 ? `Only X contains A, so the closure is ${fmt(cl)}` : `The closed sets that contain A are ${joinAnd(withA.map(fmt))}, and their intersection is ${fmt(cl)}`, inText = inside.length === 1 ? `The only open set that fits inside A is ∅, so the union is ∅` : `The open sets that fit inside A are ${joinAnd(inside.map(fmt))}, and their union is ${fmt(inn)}`; return {
  prompt: `The relay network has nodes 1 to ${n(N)}, so X = ${fmt(full)}, and its open sets are ${fmtList(sets)}. Take the group A = ${fmt(A)}. The closure of A is the smallest closed set that contains A, and a closed set is the complement of an open set. The interior of A is the union of all the open sets that lie inside A. The boundary of A is every node of the closure that is not in the interior. Enter how many nodes are in the closure of A, then how many are in the interior of A, then how many are in the boundary of A.`,
  answer: [size(cl), size(inn), size(bd)],
  hints: ['Closure: list the closed sets (the complements of the open sets), keep those that contain every node of A, and intersect them. Interior: take the union of the open sets that fit entirely inside A.', 'The boundary is made of the nodes that are in the closure but not in the interior, so you only need to compare the two sets you already have.'],
  solution: `The closed sets are ${fmtList(closed)}. ${clText}, which has ${plural(size(cl), 'node', 'nodes')}. ${inText}, which has ${plural(size(inn), 'node', 'nodes')}. The boundary holds the nodes of the closure that are not in the interior: ${bd ? fmt(bd) : '∅'}, which is ${plural(size(bd), 'node', 'nodes')}.`,
  guidance: [
   { prompt: `Which closed sets contain every node of A = ${fmt(A)}? How many nodes are in their intersection, the closure of A?`, answer: [size(cl)], explanation: `${clText}: ${plural(size(cl), 'node', 'nodes')}.` },
   { prompt: `Which open sets lie entirely inside A = ${fmt(A)}? How many nodes are in their union, the interior of A?`, answer: [size(inn)], explanation: `${inText}: ${plural(size(inn), 'node', 'nodes')}.` },
   { prompt: `How many nodes are in the closure but not in the interior?`, answer: [size(bd)], explanation: `The closure is ${fmt(cl)} and the interior is ${fmt(inn)}, so the boundary is ${bd ? fmt(bd) : '∅'}: ${plural(size(bd), 'node', 'nodes')}.` }
  ] }; }
});

/* ---- q09 Bases [W Bases] ---- */

const basisDraw = (R, kLo, kHi, Nlo, Nhi) => { const N = R.int(Nlo, Nhi), full = (1 << N) - 1, k = R.int(kLo, kHi), basis = []; for (let i = 0; i < k; i++) basis.push(R.int(1, full)); return { N, basis }; };

mk({
 id: 'q09b', parent: 'q09', kind: 'setting',
 title: 'Dish clusters from a short list',
 brief: 'The dish farm describes its clusters by a short basis, and the crew must unpack it into every open cluster and see how many reach one dish.',
 labels: ['open sets', 'open sets containing the node'], tolerance: 0.01,
 gl: ['open sets', 'open sets containing the node']
}, {
 /* A basis of 3 or 4 sets on 4 or 5 nodes that covers X and passes the overlap rule, and a node x. Never the q09 basis ({1}, {3}, {1, 2}, {3, 4}). */
 canonical: { N: 5, basis: [7, 12, 4, 16], x: 3 },
 draw: R => tryDraw(() => ({ ...basisDraw(R, 3, 4, 4, 5), x: R.int(1, 5) }), ({ N, basis, x }) => { const full = (1 << N) - 1; return x <= N && uniq(basis).length === basis.length && !basis.includes(full) && isBasis(basis, full) && !sameList(basis, [1, 4, 3, 12]); }, { N: 5, basis: [7, 12, 4, 16], x: 3 }),
 build: ({ N, basis, x }) => { const full = (1 << N) - 1, U = unions(basis), bx = 1 << (x - 1), withX = U.filter(S => S & bx); return {
  prompt: `The dish farm has clusters 1 to ${n(N)}, so X = ${fmt(full)}. The engineers describe the open sets by a basis: ${basis.map(fmt).join(', ')}. The open sets are all the unions of basis sets, with ∅ counted as the union of none. Enter how many open sets this gives. Then enter how many of those open sets contain cluster ${n(x)}.`,
  answer: [U.length, withX.length],
  hints: ['List the basis sets, then their unions two at a time, three at a time and so on, crossing out repeats. Do not forget ∅.', 'Once you have the full list of different open sets, go down it and count the ones that include the cluster you are asked about.'],
  solution: `The unions of basis sets are ${fmtList(U)}: ${n(U.length)} open sets, ∅ included. The ones that contain cluster ${n(x)} are ${joinAnd(order(withX).map(fmt))}: ${n(withX.length)} of them.`,
  guidance: [
   { prompt: `Form every union of basis sets and cross out repeats. How many different sets are there, counting ∅?`, answer: [U.length], explanation: `They are ${fmtList(U)}: ${n(U.length)} sets.` },
   { prompt: `How many of those open sets contain cluster ${n(x)}?`, answer: [withX.length], explanation: `The open sets that contain cluster ${n(x)} are ${joinAnd(order(withX).map(fmt))}: ${n(withX.length)} of the ${n(U.length)}.` }
  ] }; }
});

mk({
 id: 'q09c', parent: 'q09', kind: 'applied',
 title: 'Adding one zone to the basis',
 brief: 'The planner adds one more coverage zone to the basis, and the crew must count how many open zones the network gains.',
 labels: ['open sets before', 'open sets after'], tolerance: 0.01,
 gl: ['open sets before', 'new open sets', 'open sets after']
}, {
 /* A basis of 3 or 4 sets on 4 or 5 nodes, and a new set T that is not yet open and keeps the family a basis. Never the q09 basis. */
 canonical: { N: 4, basis: [1, 4, 6, 12], T: 2 },
 draw: R => tryDraw(() => ({ ...basisDraw(R, 3, 4, 4, 5), T: 0 }), P => false, { N: 4, basis: [1, 4, 6, 12], T: 2 }) && (() => {
  for (let i = 0; i < 1000; i++) { const { N, basis } = basisDraw(R, 3, 4, 4, 5), full = (1 << N) - 1;
   if (uniq(basis).length !== basis.length || basis.includes(full) || !isBasis(basis, full) || sameList(basis, [1, 4, 3, 12])) continue;
   const U = unions(basis); for (let j = 0; j < 30; j++) { const T = R.int(1, full - 1); if (!U.includes(T) && !basis.includes(T) && isBasis([...basis, T], full)) return { N, basis, T }; } }
  return { N: 4, basis: [1, 4, 6, 12], T: 2 }; })(),
 build: ({ N, basis, T }) => { const full = (1 << N) - 1, U = unions(basis), V = unions([...basis, T]), fresh = V.filter(S => !U.includes(S)); return {
  prompt: `The relay planner describes the open coverage zones on the nodes 1 to ${n(N)}, X = ${fmt(full)}, by a basis: ${basis.map(fmt).join(', ')}. The open sets are all the unions of basis sets, with ∅ counted as the union of none. The planner then adds one more zone, ${fmt(T)}, to the basis; the larger family is still a basis. Enter how many open sets there were before the new zone was added. Then enter how many there are after.`,
  answer: [U.length, V.length],
  hints: ['Count the different unions of the original basis sets first, ∅ included. Then count the different unions again with the new set among the basis sets.', 'A union that used to be possible is still possible, so every old open set stays open. Look only for the unions that use the new zone and were not on the old list.'],
  solution: `The unions of the original basis sets are ${fmtList(U)}: ${n(U.length)} open sets. With ${fmt(T)} added, the new unions that were not on that list are ${fmtList(fresh)}: ${plural(fresh.length, 'new open set', 'new open sets')}. So there are ${n(U.length)} + ${n(fresh.length)} = ${n(V.length)} open sets after.`,
  guidance: [
   { prompt: `Form every union of the original basis sets and cross out repeats. How many different sets are there, counting ∅?`, answer: [U.length], explanation: `They are ${fmtList(U)}: ${n(U.length)} sets.` },
   { prompt: `Now allow ${fmt(T)} as well. Which unions that use it are not on the old list? How many new open sets appear?`, answer: [fresh.length], explanation: `The new open sets are ${fmtList(fresh)}: ${n(fresh.length)} of them.` },
   { prompt: `How many open sets are there after the new zone is added?`, answer: [V.length], explanation: `The old ${n(U.length)} all stay open and ${n(fresh.length)} are new, so ${n(U.length)} + ${n(fresh.length)} = ${n(V.length)}.` }
  ] }; }
});

mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q07',
 title: 'Is this family a basis?',
 brief: 'The engineers have sent a family of node groups, and the crew must test whether it can be a basis before unpacking its unions.',
 labels: ['covers X (1 or 0)', 'overlap rule holds (1 or 0)', 'different unions'], tolerance: 0.01,
 gl: ['covers X (1 or 0)', 'overlap rule holds (1 or 0)', 'different unions']
}, {
 /* A family of 4 or 5 sets (masks) on 5 nodes. The draw aims at a mix of families that do and do not cover X and that do and do not pass the overlap rule. */
 canonical: { N: 5, fam: [3, 6, 2, 28] },
 draw: R => { const wantCover = R.next() < 0.7, wantRule = R.next() < 0.55;
  return tryDraw(() => { const N = 5, full = 31, k = R.int(4, 5), fam = []; for (let i = 0; i < k; i++) fam.push(R.int(1, 30));
   return { N, fam: uniq(fam) }; }, ({ N, fam }) => fam.length >= 4 && (covers(fam, 31) ? 1 : 0) === (wantCover ? 1 : 0) && (overlapRule(fam) ? 1 : 0) === (wantRule ? 1 : 0) && !sameList(fam, [3, 6, 2, 28]), { N: 5, fam: [3, 6, 2, 28] }); },
 build: ({ N, fam }) => { const full = (1 << N) - 1, cov = covers(fam, full) ? 1 : 0, rule = overlapRule(fam) ? 1 : 0, U = unions(fam), s = new Set(U), topo = !failure(U, full) ? 1 : 0;
  const left = members(full & ~fam.reduce((u, b) => u | b, 0));
  let ruleWhy = 'No two sets of the family overlap in a way that breaks the rule, so the overlap rule holds.';
  if (!rule) { outer: for (const A of fam) for (const B of fam) { const I = A & B; if (!I) continue; for (const x of members(I)) if (!fam.some(C => (C & ~I) === 0 && (C & (1 << (x - 1))))) { ruleWhy = `${fmt(A)} and ${fmt(B)} overlap in ${fmt(I)}, but no set of the family that contains node ${n(x)} fits inside ${fmt(I)}, so the overlap rule fails.`; break outer; } } }
  else if (fam.some((A, i) => fam.some((B, j) => i < j && (A & B)))) ruleWhy = 'Wherever two sets of the family overlap, every node of the overlap is in a set of the family that fits inside the overlap, so the overlap rule holds.';
  const covWhy = cov ? `Every node from 1 to ${n(N)} is in at least one set of the family, so it covers X.` : `${left.length === 1 ? 'Node' : 'Nodes'} ${joinAnd(left.map(String))} ${left.length === 1 ? 'is' : 'are'} in no set of the family, so it does not cover X.`; return {
  prompt: `The engineers send a family of node groups on X = ${fmt(full)}: ${fam.map(fmt).join(', ')}. A family is a basis when it covers X (every node is in at least one of its sets) and satisfies the overlap rule: wherever two of its sets overlap, every node of the overlap is in some set of the family that fits entirely inside the overlap. Enter 1 if the family covers X and 0 if not, then 1 if the overlap rule holds and 0 if not. Then enter how many different sets you can make as unions of sets from the family, with ∅ counted as the union of none.`,
  answer: [cov, rule, U.length],
  hints: ['Cover: tick off the nodes 1 to 5 one at a time and see whether each is in some set of the family. Overlap rule: for every pair of sets that share nodes, look at each shared node and ask whether a set of the family that contains it fits inside the shared part.', 'For the count, list the unions of two sets, three sets and so on, crossing out repeats, and remember ∅. The unions form a topology exactly when the family covers X and the overlap rule holds.'],
  solution: `${covWhy} ${ruleWhy} The different unions of sets from the family are ${fmtList(U)}: ${n(U.length)} sets, ∅ included.${cov && rule ? ' Both conditions hold, so the family is a basis and these are its open sets.' : ' At least one condition fails, so the family is not a basis and these unions do not form a topology.'}`,
  guidance: [
   { prompt: `Is every node from 1 to ${n(N)} in at least one set of the family? Enter 1 for yes, 0 for no.`, answer: [cov], explanation: covWhy },
   { prompt: `Check every pair of overlapping sets. Does the overlap rule hold? Enter 1 for yes, 0 for no.`, answer: [rule], explanation: ruleWhy },
   { prompt: `Form every union of sets from the family and cross out repeats. How many different sets are there, counting ∅?`, answer: [U.length], explanation: `They are ${fmtList(U)}: ${n(U.length)} sets.` }
  ] }; }
});

/* ---- q10 Continuous maps [W Continuity and Homeomorphisms, L 8.5] ---- */

const spaceDraw = (R, NX, NY, mostX, mostY) => ({ NX, TX: randomTopology(R, NX, mostX), NY, TY: randomTopology(R, NY, mostY) });
const randMap = (R, NX, NY) => { const f = []; for (let i = 0; i < NX; i++) f.push(R.int(0, NY - 1)); return f; };
const openY = TY => orderY(TY).map(fmtY).join(', ');
const sameMap = (f, g) => f.length === g.length && f.every((v, i) => v === g[i]);

mk({
 id: 'q10b', parent: 'q10', kind: 'setting',
 title: 'Sensor-to-display routing',
 brief: 'Each sensor must be routed to a display without splitting a group of sensors the network treats as near, so the crew tests the routing one open set at a time.',
 labels: ['f is continuous (1 or 0)', 'open sets with an open preimage'], tolerance: 0.01,
 gl: ['open sets of Y that fail', 'f is continuous (1 or 0)', 'open sets with an open preimage']
}, {
 /* Spaces X (3 nodes) and Y (3 displays a, b, c) with random topologies, and a routing f (0 = a, 1 = b, 2 = c). Never the q10 map. */
 canonical: { NX: 3, TX: [0, 2, 6, 7], NY: 3, TY: [0, 1, 3, 7], f: [1, 0, 2] },
 draw: R => { const wantOk = R.next() < 0.4; return tryDraw(() => ({ ...spaceDraw(R, 3, R.int(2, 3), 6, 6), f: [] }), () => true, { NX: 3, TX: [0, 2, 6, 7], NY: 3, TY: [0, 1, 3, 7], f: [1, 0, 2] }, 0) && (() => {
  for (let i = 0; i < 1000; i++) { const P = spaceDraw(R, 3, R.int(2, 3), 6, 6); P.f = randMap(R, 3, P.NY); if ((contin(P.f, P.TX, P.TY) ? 1 : 0) === (wantOk ? 1 : 0) && P.TY.length >= 3 && !(P.NY === 2 && sameList(P.TX, [0, 1, 3, 7]) && sameList(P.TY, [0, 1, 3]) && sameMap(P.f, [0, 1, 1]))) return P; }
  return { NX: 3, TX: [0, 2, 6, 7], NY: 3, TY: [0, 1, 3, 7], f: [1, 0, 2] }; })(); },
 build: ({ NX, TX, NY, TY, f }) => { const fullX = (1 << NX) - 1, fullY = (1 << NY) - 1, proper = orderY(TY).filter(V => V !== 0 && V !== fullY), bad = proper.filter(V => !TX.includes(pre(f, V))), ok = bad.length ? 0 : 1, good = TY.length - bad.length;
  const lines = proper.map(V => `f⁻¹(${fmtY(V)}) = ${fmt(pre(f, V))}, which is ${TX.includes(pre(f, V)) ? 'open' : 'not open'}`).join('; ');
  const badText = bad.length ? `${plural(bad.length, 'open set of Y has', 'open sets of Y have')} a preimage that is not open` : 'No open set of Y has a preimage that is not open'; return {
  prompt: `A routing sends the sensors of X = ${fmt(fullX)} to the displays of Y = ${fmtY(fullY)}. The open sets of X are ${fmtList(TX)}, and the open sets of Y are ${openY(TY)}. The routing is ${fmtMap(f)}. Enter 1 if f is continuous and 0 if it is not. Then enter how many of the open sets of Y, counting ∅ and Y itself, have a preimage that is open in X.`,
  answer: [ok, good],
  hints: ['The preimage f⁻¹(V) of an open set V of Y is the set of sensors that f sends into V. f is continuous when the preimage of every open set of Y is open in X.', 'The preimages of ∅ and of Y itself are ∅ and X, which are always open. Test every other open set of Y one at a time and count the passes.'],
  solution: `f⁻¹(∅) = ∅ and f⁻¹(Y) = X are always open. ${lines ? lines + '. ' : ''}${badText}. ${ok ? 'Every open set of Y pulls back to an open set of X, so f is continuous.' : 'Because at least one preimage is not open, f is not continuous.'} So ${n(good)} of the ${n(TY.length)} open sets of Y, ∅ and Y included, have an open preimage.`,
  guidance: [
   { prompt: `Leave out ∅ and Y. For each other open set of Y, find its preimage under f. How many of those preimages are not open in X?`, answer: [bad.length], explanation: `${lines ? lines + '.' : 'There is no open set of Y other than ∅ and Y.'} ${n(bad.length)} of them ${bad.length === 1 ? 'is' : 'are'} not open.` },
   { prompt: `Is f continuous? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: ok ? 'Every preimage is open, so f is continuous.' : 'One preimage that is not open is enough to show f is not continuous.' },
   { prompt: `Y has ${n(TY.length)} open sets in all, counting ∅ and Y. How many of them have an open preimage?`, answer: [good], explanation: `∅ and Y always do, and ${n(proper.length - bad.length)} of the other ${n(proper.length)} do, so ${n(good)} in all.` }
  ] }; }
});

mk({
 id: 'q10c', parent: 'q10', kind: 'applied',
 title: 'One re-route to repair the map',
 brief: 'A routing map breaks a group of nodes the network treats as near, and the technician may change the dish of exactly one node to mend it.',
 labels: ['open sets of Y that fail', 'single re-routings that repair f'], tolerance: 0.01,
 gl: ['open sets of Y that fail', 'single re-routings possible', 'single re-routings that repair f']
}, {
 /* Spaces X (3 or 4 nodes) and Y (2 or 3 dishes) and a map f that is NOT continuous (0 = a, 1 = b, 2 = c). */
 canonical: { NX: 3, TX: [0, 4, 6, 7], NY: 2, TY: [0, 1, 3], f: [0, 1, 1] },
 draw: R => tryDraw(() => { const NX = R.int(3, 4), NY = R.int(2, 3), P = spaceDraw(R, NX, NY, 8, 6); P.f = randMap(R, NX, NY); return P; },
  P => !contin(P.f, P.TX, P.TY) && P.TY.length >= 3, { NX: 3, TX: [0, 4, 6, 7], NY: 2, TY: [0, 1, 3], f: [0, 1, 1] }),
 build: ({ NX, TX, NY, TY, f }) => { const fullX = (1 << NX) - 1, fullY = (1 << NY) - 1, proper = orderY(TY).filter(V => V !== 0 && V !== fullY), bad = proper.filter(V => !TX.includes(pre(f, V)));
  const changes = []; for (let i = 0; i < NX; i++) for (let y = 0; y < NY; y++) if (y !== f[i]) { const g = f.slice(); g[i] = y; changes.push({ i, y, g, ok: contin(g, TX, TY) }); }
  const fixes = changes.filter(c => c.ok), lines = bad.map(V => `f⁻¹(${fmtY(V)}) = ${fmt(pre(f, V))}`).join('; ');
  const fixText = fixes.length ? `The re-routings that give a continuous map are ${joinAnd(fixes.map(c => `sending sensor ${n(c.i + 1)} to ${YN[c.y]}`))}` : 'None of them gives a continuous map'; return {
  prompt: `A cable-routing map f sends the sensors of X = ${fmt(fullX)} to the dishes of Y = ${fmtY(fullY)}. The open sets of X are ${fmtList(TX)}, and the open sets of Y are ${openY(TY)}. The map is ${fmtMap(f)}, and it is not continuous. A technician may change where exactly one sensor goes, to a different dish, leaving the others as they are; moving one sensor to one other dish counts as one change. Enter how many open sets of Y have a preimage under f that is not open. Then enter how many of the possible single changes give a continuous map.`,
  answer: [bad.length, fixes.length],
  hints: ['A map is continuous when the preimage of every open set of Y is open in X. The preimages of ∅ and Y never cause trouble, so test the other open sets of Y.', 'A single change moves one sensor to a different dish. Count how many such changes there are, build each new map, and run the same preimage test on it.'],
  solution: `${lines}: ${plural(bad.length, 'open set of Y has', 'open sets of Y have')} a preimage that is not open. A single change picks one of the ${n(NX)} sensors and sends it to ${NY - 1 === 1 ? 'the other dish' : `one of the ${n(NY - 1)} other dishes`}, so there are ${n(NX)} × ${n(NY - 1)} = ${n(changes.length)} changes. Testing each new map, ${fixText.charAt(0).toLowerCase() + fixText.slice(1)}. That is ${n(fixes.length)} of the ${n(changes.length)}.`,
  guidance: [
   { prompt: `Leave out ∅ and Y. For each other open set of Y, find its preimage under f. How many preimages are not open in X?`, answer: [bad.length], explanation: `${lines}. ${n(bad.length)} of the ${n(proper.length)} ${proper.length === 1 ? 'preimage is' : 'preimages are'} not open.` },
   { prompt: `A single change moves one of the ${n(NX)} sensors to a different dish. How many different single changes are there?`, answer: [changes.length], explanation: `Each of the ${n(NX)} sensors can go to ${plural(NY - 1, 'other dish', 'other dishes')}: ${n(NX)} × ${n(NY - 1)} = ${n(changes.length)}.` },
   { prompt: `Build the map for each single change and test it. How many of them are continuous?`, answer: [fixes.length], explanation: `${fixText}: ${n(fixes.length)} of the ${n(changes.length)}.` }
  ] }; }
});

mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q08',
 title: 'Continuity seen from closed sets',
 brief: 'The crew tests a routing map through closed sets instead of open ones, then counts every routing that keeps the network whole.',
 labels: ['closed sets with a closed preimage', 'f is continuous (1 or 0)', 'continuous maps'], tolerance: 0.01,
 gl: ['closed sets of Y', 'closed sets with a closed preimage', 'continuous maps']
}, {
 /* X with 3 or 4 nodes and Y with 2 or 3 dishes (at most 27 maps in all), random topologies, and a map f (0 = a, 1 = b, 2 = c). */
 canonical: { NX: 4, TX: [0, 2, 6, 8, 10, 14, 15], NY: 2, TY: [0, 1, 3], f: [1, 0, 1, 0] },
 draw: R => { const wantOk = R.next() < 0.4; return tryDraw(() => { const big = R.bool(), NX = big ? 4 : 3, NY = big ? 2 : 3, P = spaceDraw(R, NX, NY, 9, 6); P.f = randMap(R, NX, NY); return P; },
  P => (contin(P.f, P.TX, P.TY) ? 1 : 0) === (wantOk ? 1 : 0) && P.TY.length >= 3 && allMaps(P.NX, P.NY).filter(g => contin(g, P.TX, P.TY)).length < Math.pow(P.NY, P.NX) && !(P.NX === 2), { NX: 4, TX: [0, 2, 6, 8, 10, 14, 15], NY: 2, TY: [0, 1, 3], f: [1, 0, 1, 0] }); },
 build: ({ NX, TX, NY, TY, f }) => { const fullX = (1 << NX) - 1, fullY = (1 << NY) - 1, CY = orderY(complements(TY, fullY)), CX = complements(TX, fullX), goodC = CY.filter(C => CX.includes(pre(f, C))), ok = contin(f, TX, TY) ? 1 : 0, maps = allMaps(NX, NY), good = maps.filter(g => contin(g, TX, TY)).sort((g, h) => g.join('') < h.join('') ? -1 : 1), tot = maps.length;
  const lines = CY.map(C => `f⁻¹(${fmtY(C)}) = ${fmt(pre(f, C))}, which is ${CX.includes(pre(f, C)) ? 'closed' : 'not closed'}`).join('; ');
  const listGood = good.length <= 8 ? ` The continuous ones are ${joinAnd(good.map(tuple))}.` : ''; return {
  prompt: `A routing map f sends the nodes of X = ${fmt(fullX)} to the dishes of Y = ${fmtY(fullY)}. The open sets of X are ${fmtList(TX)}, and the open sets of Y are ${openY(TY)}. The map is ${fmtMap(f)}. A closed set is the complement of an open set. The preimage of a complement is the complement of the preimage, so f is continuous exactly when the preimage of every closed set of Y is a closed set of X. Enter how many closed sets of Y, counting ∅ and Y, have a preimage that is closed in X. Then enter 1 if f is continuous and 0 if it is not. Then enter how many of all the ${n(tot)} maps from X to Y are continuous.`,
  answer: [goodC.length, ok, good.length],
  hints: ['First list the closed sets of X and of Y: the complements of their open sets. For each closed set of Y, find its preimage, the set of nodes that f sends into it, and look for that set among the closed sets of X.', 'To count the continuous maps, run the same test on every map, written as the list of its images. A map is continuous when it passes for every closed set of Y, or equally for every open set of Y.'],
  solution: `The closed sets of Y are ${orderY(CY).map(fmtY).join(', ')}, and the closed sets of X are ${fmtList(CX)}. ${lines}. So ${n(goodC.length)} of the ${n(CY.length)} closed sets of Y have a closed preimage. ${ok ? 'All of them do, so f is continuous.' : 'Not all of them do, so f is not continuous.'} Running the same test on all ${n(tot)} maps, ${n(good.length)} are continuous.${listGood}`,
  guidance: [
   { prompt: `Take the complement of each open set of Y. How many closed sets does Y have, counting ∅ and Y?`, answer: [CY.length], explanation: `The closed sets of Y are ${orderY(CY).map(fmtY).join(', ')}: ${n(CY.length)} of them, one for each open set.` },
   { prompt: `Find the preimage under f of each closed set of Y. How many of these preimages are closed in X?`, answer: [goodC.length], explanation: `${lines}. ${n(goodC.length)} of the ${n(CY.length)} are closed.` },
   { prompt: `Run the same test on every one of the ${n(tot)} maps from X to Y. How many are continuous?`, answer: [good.length], explanation: `${n(good.length)} of the ${n(tot)} maps are continuous.${listGood}` }
  ] }; }
});

})();
