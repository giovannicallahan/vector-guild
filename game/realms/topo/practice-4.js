/* Topology: shape without size practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p4.js. */
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

/* ---- shared helpers ---- */
/* "1 clamp" / "3 clamps"; lists "A, B and C"; deep equality of two parameter sets. */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const andList = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const same = (p, q) => JSON.stringify(p) === JSON.stringify(q);
const SUP = { 2: '²', 3: '³', 4: '⁴' };
/* A polynomial from its coefficients, highest power first: poly([3, 0, −2], 'x') is '3x² − 2'. A coefficient 1 is not
   written out and a zero term is left out. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
const evalP = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0) + 0;
const deriv = cs => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
/* Function families (coefficients highest power first, and the critical points in increasing order):
   K  s(x³ − 3k x²) + c, critical points 0 and 2k;   Q  s(x − h)² + c, critical point h;
   F  s(x⁴ − 2m² x²) + c, critical points −m, 0 and m. */
const FAM = {
 K: ({ s, k, c }) => ({ cs: [s, -3 * s * k, 0, c], crit: [0, 2 * k] }),
 Q: ({ s, h, c }) => ({ cs: [s, -2 * s * h, s * h * h + c], crit: [h] }),
 F: ({ s, m, c }) => ({ cs: [s, 0, -2 * s * m * m, 0, c], crit: [-m, 0, m] })
};
const drawFam = (R, kind) => kind === 'K' ? { kind, s: R.pick([1, -1]), k: R.int(1, 3), c: R.int(-9, 9) }
 : kind === 'Q' ? { kind, s: R.pick([1, -1, 2, -2, 3, -3]), h: R.int(-3, 3), c: R.int(-9, 9) }
 : { kind, s: R.pick([1, -1]), m: R.int(1, 3), c: R.int(-9, 9) };
/* Largest and smallest value of a family member f on [a, b]: the end points and the critical points strictly inside. nm is the function's name. */
const ext = (f, a, b, nm) => {
 const { cs, crit } = FAM[f.kind](f), inside = crit.filter(x => x > a && x < b), pts = [a, b, ...inside], vals = pts.map(x => evalP(cs, x));
 const k = crit.length, i = inside.length, between = `strictly between ${n(a)} and ${n(b)}`;
 const insideTxt = i === k ? (k === 1 ? `That point lies ${between}.` : k === 2 ? `Both lie ${between}.` : `All three lie ${between}.`)
  : i === 0 ? (k === 1 ? `That point is not ${between}, so only the end points count.` : `None of them lies ${between}, so only the end points count.`)
  : i === 1 ? `Only x = ${n(inside[0])} lies ${between}.` : `Only ${andList(inside.map(x => `x = ${n(x)}`))} lie ${between}.`;
 return { cs, crit, inside, pts, vals, max: Math.max(...vals), min: Math.min(...vals), insideTxt,
  text: poly(cs, 'x'), dtext: poly(deriv(cs), 'x'), critTxt: andList(crit.map(x => `x = ${n(x)}`)),
  valTxt: andList(pts.map((x, j) => `${nm}(${n(x)}) = ${n(vals[j])}`)), at: nm };
};

/* A union of pieces on the line. A piece is [l, r, lc, rc]: end points and whether each end is included (a single point has l = r). */
const pieceTxt = ([l, r, lc, rc]) => l === r ? `{${n(l)}}` : `${lc ? '[' : '('}${n(l)}, ${n(r)}${rc ? ']' : ')'}`;
const unionInfo = pieces => {
 const joins = [], apart = [];
 for (let i = 1; i < pieces.length; i++) {
  const p = pieces[i - 1], q = pieces[i];
  if (p[1] !== q[0]) continue;
  if (p[3] || q[2]) joins.push(`${pieceTxt(p)} and ${pieceTxt(q)} share the point ${n(q[0])}, which belongs to ${p[3] && q[2] ? 'both' : pieceTxt(p[3] ? p : q)}, so they join`);
  else apart.push(`${pieceTxt(p)} and ${pieceTxt(q)} meet at ${n(q[0])}, but ${n(q[0])} belongs to neither, so they stay apart`);
 }
 const comps = []; pieces.forEach((p, i) => { if (i && pieces[i - 1][1] === p[0] && (pieces[i - 1][3] || p[2])) comps[comps.length - 1][1] = p[1]; else comps.push([p[0], p[1]]); });
 const bound = [...new Set(comps.flatMap(c => [c[0], c[1]]))].sort((x, y) => x - y);
 const txt = (joins.length || apart.length) ? joins.concat(apart).map(s => s[0].toUpperCase() + s.slice(1) + '.').join(' ') : 'No two neighbouring pieces share an end point.';
 return { S: pieces.map(pieceTxt).join(' ∪ '), joins: joins.length, comps: comps.length, bound, txt, np: pieces.length };
};
const drawPieces = (R, k) => {
 const ps = []; let x = R.int(-4, 0), prevPoint = false;
 for (let i = 0; i < k; i++) {
  const pt = R.int(0, 4) === 0;
  if (i > 0) x += (!pt && !prevPoint && R.bool()) ? 0 : R.int(1, 2);
  if (pt) { ps.push([x, x, 1, 1]); prevPoint = true; }
  else { const len = R.int(1, 3); ps.push([x, x + len, R.bool() ? 1 : 0, R.bool() ? 1 : 0]); x += len; prevPoint = false; }
 }
 return ps;
};
/* Covering [a, b] with open intervals of length L (L10 = 10L, to keep the arithmetic whole). */
const coverInfo = (a, b, L10) => { const D = b - a, k = Math.floor(10 * D / L10) + 1, L = L10 / 10; return { D, k, L,
 txt: `${pl(k, 'piece')} of ${n(L)} metres give ${n(k * L)} metres in all, which is more than ${n(D)}, while ${pl(k - 1, 'piece')} give only ${n((k - 1) * L)} metres, which is not more than ${n(D)}` }; };

/* Gluing the edges of an n-sided panel. Edge i joins corner i to corner i + 1 (clockwise, mod n); a word element [letter, ±1]
   has its arrow running i → i + 1 for +1 and i + 1 → i for −1. A letter that appears twice is a seam (arrow on arrow: tails
   together, heads together); a letter that appears once is an unsewn edge. */
const SQ_CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'], SQ_SIDES = ['top', 'right', 'bottom', 'left'];
const lab = ([l, e], names = 'abcdefgh') => names[l] + (e < 0 ? '⁻¹' : '');
const glue = (w, square, names = 'abcdefgh') => {
 const cnt = w.length, parent = [...Array(cnt).keys()], find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
 const cn = x => square ? `the ${SQ_CORNERS[x]} corner` : `corner ${n(x + 1)}`, en = i => square ? SQ_SIDES[i] : `edge ${n(i + 1)}`;
 const ends = i => w[i][1] > 0 ? [i, (i + 1) % cnt] : [(i + 1) % cnt, i];
 const sewn = []; let seams = 0;
 for (let l = 0; l < cnt; l++) {
  const at = [...Array(cnt).keys()].filter(i => w[i][0] === l); if (at.length !== 2) continue;
  seams++;
  const [t1, h1] = ends(at[0]), [t2, h2] = ends(at[1]), j = (x, y) => x === y ? `${cn(x)} to itself` : `${cn(x)} to ${cn(y)}`;
  sewn.push(`Sewing the two ${names[l]} edges (${en(at[0])} and ${en(at[1])}) joins ${j(t1, t2)} and ${j(h1, h2)}.`);
  parent[find(t1)] = find(t2); parent[find(h1)] = find(h2);
 }
 const groups = {}; for (let i = 0; i < cnt; i++) (groups[find(i)] = groups[find(i)] || []).push(square ? SQ_CORNERS[i] : `corner ${n(i + 1)}`);
 const list = Object.values(groups), letters = new Set(w.map(x => x[0])).size, tl = groups[find(0)].length;
 return { sewn: sewn.join(' '), V: list.length, E: letters, seams, free: cnt - 2 * seams, tl, groupTxt: list.map(g => `{${g.join(', ')}}`).join(', ') };
};
/* The letters and arrows of a square's word: slot[position] = group; letters are named by order of first appearance. */
const wordFrom = (slot, R) => { const order = []; slot.forEach(g => { if (!order.includes(g)) order.push(g); }); return slot.map(g => [order.indexOf(g), R.bool() ? 1 : -1]); };
/* Parent q18's authored word a b a⁻¹ b⁻¹ and its worked example a a⁻¹ b b⁻¹, as letter positions and arrows. */
const Q18_WORDS = [[[0, 1], [1, 1], [0, -1], [1, -1]], [[0, 1], [0, -1], [1, 1], [1, -1]]];
const drawSquareWord = (R, canon) => {
 const PAIRS = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]], ONE = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
 for (let i = 0; i < 1000; i++) {
  const groups = R.bool() ? R.pick(PAIRS) : (() => { const pr = R.pick(ONE); return [pr, ...[0, 1, 2, 3].filter(x => !pr.includes(x)).map(x => [x])]; })();
  const slot = Array(4); groups.forEach((g, gi) => g.forEach(pos => { slot[pos] = gi; }));
  const w = wordFrom(slot, R);
  if (!Q18_WORDS.some(q => same(q, w)) && !same(w, canon)) return w;
 }
 return canon;
};

/* ---- q16 Continuous images of compact sets [L 8.5] ---- */

/* A heating rod: T(x) = s(x³ − 3k x²) + c on [a, b], with critical points 0 and 2k. Not the cubic family of q16 (critical points ±m). */
mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The heating rod survey',
 brief: 'A heating rod for the greenhouse has been fitted, and the log needs the hottest and the coolest reading anywhere along it.',
 labels: ['highest reading', 'lowest reading'], tolerance: 0.01,
 gl: [['values to compare'], ['highest reading'], ['lowest reading']]
}, {
 canonical: { f: { kind: 'K', s: -1, k: 2, c: 3 }, a: -1, b: 5 },
 draw: R => {
  const canon = { f: { kind: 'K', s: -1, k: 2, c: 3 }, a: -1, b: 5 };
  for (let i = 0; i < 1000; i++) { const p = { f: drawFam(R, 'K'), a: R.int(-3, 1), b: R.int(2, 7) }; if (p.b - p.a >= 3 && !same(p, canon)) return p; }
  return canon;
 },
 build: ({ f, a, b }) => {
  const X = ext(f, a, b, 'T');
  return {
   prompt: `A thermometer is dragged along a heating rod. At distance x metres from the pump end, for ${n(a)} ≤ x ≤ ${n(b)}, it reads T(x) = ${X.text}, in degrees. Enter the highest reading it can show on the rod, then the lowest.`,
   answer: [X.max, X.min],
   hints: [
    'T is continuous on a closed interval, so it reaches a highest and a lowest value there. Each is at an end of the rod or at a critical point strictly inside it, where T′(x) = 0.',
    'Find the points where the derivative is 0 and keep only those strictly between the two ends. Work out T at both ends and at each point kept, then pick the greatest and the least.'
   ],
   solution: `T′(x) = ${X.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} The values to compare are ${X.valTxt}. The highest reading is ${n(X.max)} and the lowest is ${n(X.min)}.`,
   guidance: [
    { prompt: `T′(x) = ${X.dtext}. How many values must be compared: the 2 end points, plus each point where T′(x) = 0 that lies strictly between ${n(a)} and ${n(b)}?`, answer: [X.pts.length], explanation: `T′(x) = 0 at ${X.critTxt}. ${X.insideTxt} So ${n(X.pts.length)} values are compared.` },
    { prompt: `The values to compare are ${X.valTxt}. What is the highest?`, answer: [X.max], explanation: `The highest of these is ${n(X.max)}.` },
    { prompt: `What is the lowest of the values ${X.valTxt}?`, answer: [X.min], explanation: `The lowest of these is ${n(X.min)}.` }
   ] };
 }
});

/* Fencing a seedbed against a wall: A(x) = x(P − 2x) on [lo, hi], P = 4m, so the one critical point is x = m. */
mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Fencing the seedbed',
 brief: 'The greenhouse crew has a fixed length of fence for a new seedbed, and the site limits how deep the bed can be.',
 labels: ['depth of the largest bed (metres)', 'largest area (square metres)', 'smallest area (square metres)'], tolerance: 0.01,
 gl: [['depth where A′ is 0'], ['largest area'], ['smallest area']]
}, {
 canonical: { m: 5, lo: 1, hi: 8 },
 draw: R => {
  for (let i = 0; i < 1000; i++) { const m = R.int(3, 8), lo = R.int(1, 2 * m - 3), hi = R.int(lo + 2, 2 * m - 1); if (!(m === 5 && lo === 1 && hi === 8)) return { m, lo, hi }; }
  return { m: 5, lo: 1, hi: 8 };
 },
 build: ({ m, lo, hi }) => {
  const P = 4 * m, X = ext({ kind: 'Q', s: -2, h: m, c: 2 * m * m }, lo, hi, 'A'), best = X.pts[X.vals.indexOf(X.max)];
  return {
   prompt: `The greenhouse crew is fencing a rectangular seedbed against a wall, using exactly ${n(P)} metres of fencing on the three free sides: two sides of depth x metres, running out from the wall, and one side parallel to the wall that takes the rest of the fence. The site only allows a depth with ${n(lo)} ≤ x ≤ ${n(hi)}. The bed's area is A(x) = x(${n(P)} − 2x) square metres. Enter the depth at which the area is largest, then the largest area, then the smallest area the crew could end up with.`,
   answer: [best, X.max, X.min],
   hints: [
    'Multiply out A(x) and differentiate. On a closed range of depths the area is largest or smallest at an end of the range or at a depth strictly inside where A′(x) = 0.',
    'Work out the area at both ends of the allowed range and at the depth where A′(x) = 0, if it lies strictly inside the range. The depth with the greatest area is the answer to the first box.'
   ],
   solution: `Multiplying out, A(x) = ${n(P)}x − 2x², so A′(x) = ${n(P)} − 4x, which is 0 at x = ${n(m)}. ${X.insideTxt} The values to compare are ${X.valTxt}. The largest area is ${n(X.max)}, at depth ${n(best)}, and the smallest is ${n(X.min)}.`,
   guidance: [
    { prompt: `A(x) = ${n(P)}x − 2x², so A′(x) = ${n(P)} − 4x. At which depth x is A′(x) = 0?`, answer: [m], explanation: `${n(P)} − 4x = 0 gives x = ${n(m)}. ${X.insideTxt}` },
    { prompt: `What is the largest area for depths from ${n(lo)} to ${n(hi)}? Compare the end points and any depth where A′(x) = 0 that lies strictly between them.`, answer: [X.max], explanation: `The values to compare are ${X.valTxt}. The largest is ${n(X.max)}.` },
    { prompt: `What is the smallest area for depths from ${n(lo)} to ${n(hi)}?`, answer: [X.min], explanation: `Among ${X.valTxt}, the smallest is ${n(X.min)}.` }
   ] };
 }
});

/* A girder sensor: F(x) = s(x⁴ − 2m²x²) + c on [a, b], three critical points; the readings fill the whole range between the extremes. */
mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', title: 'The girder load sweep',
 brief: 'A load sensor will be run the whole length of a girder, and the engineers want to know every whole-number reading it passes through.',
 labels: ['highest reading', 'lowest reading', 'whole-number readings'], tolerance: 0.01,
 gl: [['values to compare'], ['highest reading'], ['lowest reading']]
}, {
 canonical: { f: { kind: 'F', s: 1, m: 2, c: 3 }, a: -3, b: 4 },
 draw: R => {
  const canon = { f: { kind: 'F', s: 1, m: 2, c: 3 }, a: -3, b: 4 };
  for (let i = 0; i < 1000; i++) { const p = { f: drawFam(R, 'F'), a: R.int(-4, 1), b: R.int(2, 4) }; if (p.b - p.a >= 3 && !same(p, canon)) return p; }
  return canon;
 },
 build: ({ f, a, b }) => {
  const X = ext(f, a, b, 'F'), count = X.max - X.min + 1;
  return {
   prompt: `A load sensor is run along a girder. At position x metres, for ${n(a)} ≤ x ≤ ${n(b)}, it reads F(x) = ${X.text}, in load units. The reading changes continuously as the sensor moves, so it passes through every value between its lowest and its highest reading (the intermediate value theorem). Enter the highest reading, then the lowest, then how many whole numbers the sensor reads at some position on the girder, counting the highest and the lowest readings, which are whole numbers themselves.`,
   answer: [X.max, X.min, count],
   hints: [
    'F is continuous on a closed interval, so its highest and lowest values are each at an end of the girder or at a critical point strictly inside, where F′(x) = 0. Here F′(x) has three zeros, so check each against the two ends.',
    'Once you have the highest and lowest readings, every value from the lowest up to the highest is read somewhere. Count the whole numbers in that range, including both ends of it.'
   ],
   solution: `F′(x) = ${X.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} The values to compare are ${X.valTxt}. The highest reading is ${n(X.max)} and the lowest is ${n(X.min)}. Every value between them is read, so the whole numbers from ${n(X.min)} to ${n(X.max)} are all read: ${n(X.max)} − ${par(X.min)} + 1 = ${n(count)}.`,
   guidance: [
    { prompt: `F′(x) = ${X.dtext}. How many values must be compared: the 2 end points, plus each point where F′(x) = 0 that lies strictly between ${n(a)} and ${n(b)}?`, answer: [X.pts.length], explanation: `F′(x) = 0 at ${X.critTxt}. ${X.insideTxt} So ${n(X.pts.length)} values are compared.` },
    { prompt: `The values to compare are ${X.valTxt}. What is the highest?`, answer: [X.max], explanation: `The highest of these is ${n(X.max)}.` },
    { prompt: `What is the lowest of the values ${X.valTxt}?`, answer: [X.min], explanation: `The lowest of these is ${n(X.min)}. The whole numbers from ${n(X.min)} to ${n(X.max)}, counting both, number ${n(X.max)} − ${par(X.min)} + 1 = ${n(count)}.` }
   ] };
 }
});

/* ---- q17 Chapter review: one-piece cables [L 8.4, L 8.5] ---- */

/* A relay mast wire: components of a union, a cover by open beams, the largest value of a K cubic. */
mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'Mast wire sign-off',
 brief: 'The relay mast is wired up, and Mira wants the signal stretches, the lamp cover and the gauge peak checked in one pass before it goes live.',
 labels: ['components of S', 'fewest beams', 'largest reading'], tolerance: 0.01,
 gl: [['components of S'], ['fewest beams'], ['largest reading']]
}, {
 canonical: { pieces: [[-2, 0, 1, 0], [0, 2, 1, 0], [3, 3, 1, 1], [4, 6, 0, 1], [6, 7, 0, 1]], a: -1, b: 4, L10: 15, f: { kind: 'K', s: 1, k: 1, c: -2 } },
 draw: R => {
  const canon = { pieces: [[-2, 0, 1, 0], [0, 2, 1, 0], [3, 3, 1, 1], [4, 6, 0, 1], [6, 7, 0, 1]], a: -1, b: 4, L10: 15, f: { kind: 'K', s: 1, k: 1, c: -2 } };
  for (let i = 0; i < 1000; i++) {
   const pieces = drawPieces(R, R.int(4, 5)), u = unionInfo(pieces); if (u.comps < 2) continue;
   const a = R.int(-4, 0), b = R.int(1, 4), L10 = R.pick([15, 20, 25]); if (b - a < 2) continue;
   const p = { pieces, a, b, L10, f: drawFam(R, 'K') };
   if (!same(p, canon)) return p;
  }
  return canon;
 },
 build: ({ pieces, a, b, L10, f }) => {
  const u = unionInfo(pieces), C = coverInfo(a, b, L10), X = ext(f, a, b, 'g');
  return {
   prompt: `The relay mast's wire carries a signal along these stretches, in metres from the mast: S = ${u.S}. Enter the number of components of S, its separate pieces. Next, the crew lights the span from x = ${n(a)} to x = ${n(b)} with open beams, each lighting an open interval ${n(C.L)} metres long: enter the fewest beams that cover the closed interval [${n(a)}, ${n(b)}]. Finally, a gauge on that span reads g(x) = ${X.text}, in volts, for ${n(a)} ≤ x ≤ ${n(b)}: enter its largest reading.`,
   answer: [u.comps, C.k, X.max],
   hints: [
    'Neighbouring pieces of S form one component when they share an end point that belongs to at least one of them. If the shared point belongs to neither, a gap of one point separates them.',
    'Open beams must overlap, so together their lengths have to add up to more than the length of the span, not just to the length itself.',
    'The largest reading of a continuous g on a closed interval is at an end point or at a critical point strictly inside, where g′(x) = 0.'
   ],
   solution: `${u.txt} So S has ${n(u.np)} − ${n(u.joins)} = ${pl(u.comps, 'component')}. The span is ${n(C.D)} metres long; ${C.txt.replace(/piece/g, 'beam')}, so ${n(C.k)} beams are needed. Finally g′(x) = ${X.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} Comparing ${X.valTxt}, the largest reading is ${n(X.max)}.`,
   guidance: [
    { prompt: `How many components does S = ${u.S} have?`, answer: [u.comps], explanation: `${u.txt} That leaves ${n(u.comps)}.` },
    { prompt: `How many open beams, each ${n(C.L)} metres long, are needed to cover [${n(a)}, ${n(b)}]?`, answer: [C.k], explanation: `The span is ${n(C.D)} metres long; ${C.txt.replace(/piece/g, 'beam')}.` },
    { prompt: `g′(x) = ${X.dtext}. Compare g at the two end points and at each point where g′(x) = 0 that lies strictly between ${n(a)} and ${n(b)}. What is the largest reading?`, answer: [X.max], explanation: `g′(x) = 0 at ${X.critTxt}. ${X.insideTxt} The values are ${X.valTxt}, so the largest is ${n(X.max)}.` }
   ] };
 }
});

/* A cable run: clamps to cover [a, b], their cost, and the margin below a strain rating, with Q quadratics. */
mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'Clamping the cable run',
 brief: 'A cable run between two posts must be fully clamped and checked against its strain rating before the Cable Works orders the parts.',
 labels: ['fewest clamps', 'total clamp cost (credits)', 'margin below the rating'], tolerance: 0.01,
 gl: [['fewest clamps'], ['largest strain'], ['margin below the rating']]
}, {
 canonical: { a: -1, b: 6, L10: 20, cost: 12, T: 14, f: { kind: 'Q', s: -3, h: 2, c: 10 } },
 draw: R => {
  const canon = { a: -1, b: 6, L10: 20, cost: 12, T: 14, f: { kind: 'Q', s: -3, h: 2, c: 10 } };
  for (let i = 0; i < 1000; i++) {
   const a = R.int(-4, 0), b = R.int(2, 7); if (b - a < 3) continue;
   const p = { a, b, L10: R.pick([15, 20, 25, 30]), cost: R.int(5, 20), T: R.int(10, 60), f: drawFam(R, 'Q') };
   if (!same(p, canon)) return p;
  }
  return canon;
 },
 build: ({ a, b, L10, cost, T, f }) => {
  const C = coverInfo(a, b, L10), X = ext(f, a, b, 'f'), margin = T - X.max;
  return {
   prompt: `A cable run goes from post x = ${n(a)} to post x = ${n(b)}, in metres. Each clamp grips an open interval ${n(C.L)} metres long and costs ${n(cost)} credits. The strain along the run is f(x) = ${X.text} for ${n(a)} ≤ x ≤ ${n(b)}, and the cable is rated for a strain of at most ${n(T)}. Enter the fewest clamps that cover [${n(a)}, ${n(b)}], then the total cost of those clamps in credits, then the margin: ${n(T)} minus the largest strain on the run (a negative number if the largest strain is over the rating).`,
   answer: [C.k, C.k * cost, margin],
   hints: [
    'Open clamps must overlap, so together their lengths have to add up to more than the length of the run, not just to the length itself. The total cost is the number of clamps times the cost of one.',
    'The largest strain of a continuous f on a closed interval is at an end point or at a critical point strictly inside, where f′(x) = 0. Subtract it from the rating.'
   ],
   solution: `The run is ${n(C.D)} metres long; ${C.txt.replace(/piece/g, 'clamp')}, so ${n(C.k)} clamps are needed and they cost ${n(C.k)} × ${n(cost)} = ${n(C.k * cost)} credits. Next f′(x) = ${X.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} Comparing ${X.valTxt}, the largest strain is ${n(X.max)}. The margin is ${n(T)} − ${par(X.max)} = ${n(margin)}.`,
   guidance: [
    { prompt: `How many open clamps of ${n(C.L)} metres are needed to cover [${n(a)}, ${n(b)}]?`, answer: [C.k], explanation: `The run is ${n(C.D)} metres long; ${C.txt.replace(/piece/g, 'clamp')}.` },
    { prompt: `f′(x) = ${X.dtext}. Compare f at the two end points and at each point where f′(x) = 0 that lies strictly between ${n(a)} and ${n(b)}. What is the largest strain?`, answer: [X.max], explanation: `f′(x) = 0 at ${X.critTxt}. ${X.insideTxt} The values are ${X.valTxt}, so the largest strain is ${n(X.max)}.` },
    { prompt: `The rating is ${n(T)} and the largest strain is ${n(X.max)}. What is the margin, the rating minus the largest strain?`, answer: [margin], explanation: `${n(T)} − ${par(X.max)} = ${n(margin)}.` }
   ] };
 }
});

/* A long audit: components, boundary points, a cover and the largest value of an F quartic. Uses q05 (boundary points). */
mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q05', title: 'The long cable audit',
 brief: 'The longest cable on the Kepler outpost has a patchwork of signal stretches, and Mira wants every property of it counted before sign-off.',
 labels: ['components of S', 'boundary points of S', 'fewest clamps', 'largest value'], tolerance: 0.01,
 gl: [['components of S'], ['boundary points of S'], ['fewest clamps'], ['largest value']]
}, {
 canonical: { pieces: [[-3, -1, 1, 0], [-1, 1, 1, 1], [2, 4, 0, 0], [4, 6, 0, 1], [8, 8, 1, 1], [9, 11, 0, 0]], a: -3, b: 4, L10: 15, f: { kind: 'F', s: -1, m: 2, c: 2 } },
 draw: R => {
  const canon = { pieces: [[-3, -1, 1, 0], [-1, 1, 1, 1], [2, 4, 0, 0], [4, 6, 0, 1], [8, 8, 1, 1], [9, 11, 0, 0]], a: -3, b: 4, L10: 15, f: { kind: 'F', s: -1, m: 2, c: 2 } };
  for (let i = 0; i < 1000; i++) {
   const pieces = drawPieces(R, R.int(5, 6)), u = unionInfo(pieces); if (u.comps < 3 || u.joins < 1) continue;
   const a = R.int(-4, 0), b = R.int(2, 5); if (b - a < 3) continue;
   const p = { pieces, a, b, L10: R.pick([15, 20, 25, 35]), f: drawFam(R, 'F') };
   if (!same(p, canon)) return p;
  }
  return canon;
 },
 build: ({ pieces, a, b, L10, f }) => {
  const u = unionInfo(pieces), C = coverInfo(a, b, L10), X = ext(f, a, b, 'f');
  return {
   prompt: `A signal line lies along S = ${u.S} on the bench, in metres. Enter the number of components of S. Then enter the number of boundary points of S, where a boundary point of S is a point such that every open interval round it holds a point of S and a point that is not in S. Next, a cable is laid from x = ${n(a)} to x = ${n(b)}: enter the fewest clamps, each gripping an open interval ${n(C.L)} metres long, that cover the closed interval [${n(a)}, ${n(b)}]. Finally, the strain along that cable is f(x) = ${X.text} for ${n(a)} ≤ x ≤ ${n(b)}: enter the largest value of f.`,
   answer: [u.comps, u.bound.length, C.k, X.max],
   hints: [
    'Neighbouring pieces of S form one component when they share an end point that belongs to at least one of them.',
    'Each component has its end points as boundary points, and a single isolated point is a boundary point of its own. Count each point once, even if two components meet there.',
    'Open clamps must overlap, so their lengths have to add up to more than the length of the cable. For the largest value, compare f at the two ends and at each critical point strictly inside.'
   ],
   solution: `${u.txt} So S has ${n(u.np)} − ${n(u.joins)} = ${pl(u.comps, 'component')}. The end points of the components are ${andList(u.bound.map(n))}, and a joined point is no end point, so S has ${pl(u.bound.length, 'boundary point')}. The cable is ${n(C.D)} metres long; ${C.txt.replace(/piece/g, 'clamp')}, so ${n(C.k)} clamps are needed. Finally f′(x) = ${X.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} Comparing ${X.valTxt}, the largest value is ${n(X.max)}.`,
   guidance: [
    { prompt: `How many components does S = ${u.S} have?`, answer: [u.comps], explanation: `${u.txt} That leaves ${n(u.comps)}.` },
    { prompt: `How many boundary points does S have? Count the end points of its components, each point once.`, answer: [u.bound.length], explanation: `The end points of the components are ${andList(u.bound.map(n))}: ${pl(u.bound.length, 'boundary point')}.` },
    { prompt: `How many open clamps of ${n(C.L)} metres are needed to cover [${n(a)}, ${n(b)}]?`, answer: [C.k], explanation: `The cable is ${n(C.D)} metres long; ${C.txt.replace(/piece/g, 'clamp')}.` },
    { prompt: `f′(x) = ${X.dtext}. Compare f at the two end points and at each point where f′(x) = 0 that lies strictly between ${n(a)} and ${n(b)}. What is the largest value?`, answer: [X.max], explanation: `f′(x) = 0 at ${X.critTxt}. ${X.insideTxt} The values are ${X.valTxt}, so the largest is ${n(X.max)}.` }
   ] };
 }
});

/* ---- q18 Gluing: quotient spaces [H 7.7] ---- */

/* A square whose edges are described by letters and explicit arrows (letters p, q, r). */
mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'Reading the seal arrows',
 brief: 'An airlock seal is cut as one square of fabric with its edges marked in arrows, and the cutters want to know how the corners come together.',
 labels: ['corner points', 'edges left'], tolerance: 0.01,
 gl: [['corners with the top-left'], ['corner points'], ['edges left']]
}, {
 canonical: { w: [[0, 1], [1, -1], [1, 1], [0, -1]] },
 draw: R => ({ w: drawSquareWord(R, [[0, 1], [1, -1], [1, 1], [0, -1]]) }),
 build: ({ w }) => {
  const g = glue(w, true, 'pqrs'), L = e => 'pqrs'[e[0]];
  const ends = i => w[i][1] > 0 ? [i, (i + 1) % 4] : [(i + 1) % 4, i];
  const desc = w.map((e, i) => { const [t, h] = ends(i); return `the ${SQ_SIDES[i]} edge has letter ${L(e)} and an arrow from the ${SQ_CORNERS[t]} corner to the ${SQ_CORNERS[h]} corner`; }).join('; ');
  return {
   prompt: `An airlock seal is cut from one square of fabric. Its corners are the top-left, top-right, bottom-right and bottom-left corners, and each edge is marked with a letter and an arrow: ${desc}. The crew sews together each pair of edges that carry the same letter, arrow on arrow: tail to tail and head to head. An edge whose letter appears only once stays unsewn. Two edges sewn together count as one edge. Enter how many distinct points the 4 corners become, then how many distinct edges are left.`,
   answer: [g.V, g.E],
   hints: [
    'For each letter that appears twice, write down which corner is the tail of each of its two arrows and which is the head. Sewing joins the two tails and joins the two heads.',
    'Corners joined through any chain of sewings are one point. Each different letter gives one edge of the finished seal, whether it was sewn or not.'
   ],
   solution: `${g.sewn} The corners fall into ${pl(g.V, 'group')}: ${g.groupTxt}, so they become ${pl(g.V, 'point')}. The edges carry ${pl(g.E, 'different letter')}, so ${pl(g.E, 'edge is', 'edges are')} left${g.seams === 2 ? ' (both pairs were sewn)' : ' (one pair was sewn and the other two edges stay free)'}.`,
   guidance: [
    { prompt: `Follow the sewings. How many of the 4 corners end up as the same point as the top-left corner, counting the top-left corner itself?`, answer: [g.tl], explanation: `${g.sewn} The top-left corner's group has ${pl(g.tl, 'corner')}.` },
    { prompt: `How many distinct points do the 4 corners become?`, answer: [g.V], explanation: `The groups are ${g.groupTxt}: ${pl(g.V, 'point')}.` },
    { prompt: `How many different letters do the 4 edges carry?`, answer: [g.E], explanation: `Each different letter is one edge after sewing, so ${pl(g.E, 'edge is', 'edges are')} left.` }
   ] };
 }
});

/* A batch of cushion panels: studs for the corner points, thread for the seams and binding for the unsewn edges. */
mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Cushion panels for the lounge',
 brief: 'The crew lounge needs a batch of identical cushion panels, and the Fabric Bay must order studs, thread and binding for the whole batch.',
 labels: ['total studs', 'total thread and binding cost (credits)'], tolerance: 0.01,
 gl: [['corner points per panel'], ['seams per panel'], ['cost of one panel (credits)']]
}, {
 canonical: { w: [[0, 1], [1, 1], [0, -1], [2, 1]], m: 6, c1: 6, c2: 4 },
 draw: R => ({ w: drawSquareWord(R, [[0, 1], [1, 1], [0, -1], [2, 1]]), m: R.int(3, 12), c1: R.int(3, 9), c2: R.int(2, 8) }),
 build: ({ w, m, c1, c2 }) => {
  const g = glue(w, true), word = w.map(e => lab(e)).join(' '), one = g.seams * c1 + g.free * c2;
  return {
   prompt: `The Fabric Bay is sewing ${n(m)} identical square cushion panels for the crew lounge. On each panel the 4 edges carry labels, read clockwise from the top-left corner (the top edge, then the right, the bottom and the left): ${word}. A letter alone means that edge’s arrow points clockwise round the square; a letter with ⁻¹ means it points anticlockwise. Each pair of edges that share a letter is sewn into one seam, arrow on arrow, and an edge whose letter appears only once stays unsewn. A seam costs ${n(c1)} credits of thread and an unsewn edge costs ${n(c2)} credits of binding. Every distinct corner point of a finished panel gets one stud, and corners that the sewing joins together count as one point. Enter the total number of studs on all ${n(m)} panels, then the total cost of thread and binding for all of them, in credits.`,
   answer: [m * g.V, m * one],
   hints: [
    'Sewing arrow on arrow joins the two tails and the two heads. Find which corners each seam joins, then group the corners that are joined through any chain of seams.',
    'Work out the cost of one panel first: thread for each seam and binding for each unsewn edge. Then multiply both the studs and the cost by the number of panels.'
   ],
   solution: `${g.sewn} The corners fall into ${pl(g.V, 'group')}: ${g.groupTxt}, so one panel has ${pl(g.V, 'corner point')} and needs ${pl(g.V, 'stud')}. It has ${pl(g.seams, 'seam')} and ${pl(g.free, 'unsewn edge')}, so its thread and binding cost ${n(g.seams)} × ${n(c1)} + ${n(g.free)} × ${n(c2)} = ${n(one)} credits. For ${n(m)} panels that is ${n(m)} × ${n(g.V)} = ${n(m * g.V)} studs and ${n(m)} × ${n(one)} = ${n(m * one)} credits.`,
   guidance: [
    { prompt: `How many distinct corner points does one finished panel have, once the seams of ${word} have joined their corners?`, answer: [g.V], explanation: `${g.sewn} The groups are ${g.groupTxt}: ${pl(g.V, 'point')}.` },
    { prompt: `How many seams does one panel have? A seam is a pair of edges that share a letter.`, answer: [g.seams], explanation: `The word ${word} has ${pl(g.seams, 'pair')} of edges sharing a letter, so ${pl(g.seams, 'seam')}, and the other ${pl(g.free, 'edge')} stay${g.free === 1 ? 's' : ''} unsewn.` },
    { prompt: `One seam costs ${n(c1)} credits and one unsewn edge costs ${n(c2)} credits. What do the thread and binding for one panel cost, in credits?`, answer: [one], explanation: `${pl(g.seams, 'seam')} and ${pl(g.free, 'unsewn edge')}: ${n(g.seams)} × ${n(c1)} + ${n(g.free)} × ${n(c2)} = ${n(one)} credits.` }
   ] };
 }
});

/* A six- or eight-sided panel with edges numbered clockwise. */
const drawPolyWord = (R, N, canon) => {
 for (let t = 0; t < 1000; t++) {
  const pos = [...Array(N).keys()]; for (let i = N - 1; i > 0; i--) { const j = Math.floor(R.next() * (i + 1)); [pos[i], pos[j]] = [pos[j], pos[i]]; }
  const p = R.pick([N / 2, N / 2 - 1]), slot = Array(N); let g = 0;
  for (let j = 0; j < p; j++) { slot[pos[2 * j]] = g; slot[pos[2 * j + 1]] = g; g++; }
  for (let j = 2 * p; j < N; j++) slot[pos[j]] = g++;
  const w = wordFrom(slot, R); if (!same(w, canon)) return w;
 }
 return canon;
};
mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', title: 'Sewing a many-sided panel',
 brief: 'A bigger hull section is cut as a flat panel with six or eight sides, and the cutters need the same corner and edge count as for a square.',
 labels: ['corner points', 'edges left'], tolerance: 0.01,
 gl: [['corners with corner 1'], ['corner points'], ['edges left']]
}, {
 canonical: { w: [[0, 1], [1, 1], [2, -1], [0, -1], [2, 1], [1, -1]] },
 draw: R => { const N = R.pick([6, 8]); return { w: drawPolyWord(R, N, [[0, 1], [1, 1], [2, -1], [0, -1], [2, 1], [1, -1]]) }; },
 build: ({ w }) => {
  const N = w.length, g = glue(w, false), word = w.map(e => lab(e)).join(' ');
  return {
   prompt: `A hull section is cut as a flat ${n(N)}-sided panel. Its corners are numbered 1 to ${n(N)} clockwise, and edge i runs between corner i and corner i + 1 (edge ${n(N)} runs between corner ${n(N)} and corner 1). Reading the edges in order, edge 1 first, the labels are ${word}. A letter alone means that edge’s arrow points clockwise, from corner i to corner i + 1 (from corner ${n(N)} to corner 1 for the last edge); a letter with ⁻¹ means it points the other way. The Fabric Bay sews together each pair of edges that share a letter, arrow on arrow, and leaves an edge whose letter appears only once unsewn. Two edges sewn together count as one edge. Enter how many distinct points the ${n(N)} corners become, then how many distinct edges are left.`,
   answer: [g.V, g.E],
   hints: [
    'Sewing two edges arrow on arrow joins the tail of one to the tail of the other and the head to the head. Write down which two corners each letter joins at its tails and at its heads.',
    'Corners joined through any chain of sewings are one point. Each different letter gives one edge of the finished panel, whether it was sewn or not.'
   ],
   solution: `${g.sewn} The corners fall into ${pl(g.V, 'group')}: ${g.groupTxt}, so they become ${pl(g.V, 'point')}. The word uses ${pl(g.E, 'letter')}, so ${pl(g.E, 'edge is', 'edges are')} left${g.free ? ` (${pl(g.seams, 'pair')} sewn and ${pl(g.free, 'edge')} left free)` : ' (every pair was sewn)'}.`,
   guidance: [
    { prompt: `Follow the sewings. How many of the ${n(N)} corners end up as the same point as corner 1, counting corner 1 itself?`, answer: [g.tl], explanation: `${g.sewn} Corner 1's group has ${pl(g.tl, 'corner')}.` },
    { prompt: `How many distinct points do the ${n(N)} corners become?`, answer: [g.V], explanation: `The groups are ${g.groupTxt}: ${pl(g.V, 'point')}.` },
    { prompt: `How many different letters does the word ${word} use?`, answer: [g.E], explanation: `Each letter is one edge after sewing, so ${pl(g.E, 'edge is', 'edges are')} left.` }
   ] };
 }
});

/* ---- q19 The standard surfaces [H 7.5] ---- */

/* Starting surfaces for q19b: the twisted band (t half-twists) and four others. b = boundary circles, o = orientable. */
const BASES = [
 { nm: 'sphere', d: 'a sphere, the skin of a ball', b: 0, bw: 'it has no edge at all', o: 1, ow: 'A sphere contains no Möbius strip' },
 { nm: 'torus', d: 'a torus, the closed surface of a ring doughnut', b: 0, bw: 'it has no edge at all', o: 1, ow: 'A torus contains no Möbius strip' },
 { nm: 'Klein bottle', d: 'a Klein bottle, the square sewn by the word a b a⁻¹ b', b: 0, bw: 'it has no edge at all', o: 0, ow: 'A Klein bottle contains a Möbius strip' },
 { nm: 'disc', d: 'a disc, a flat round panel', b: 1, bw: 'its rim', o: 1, ow: 'A disc lies flat and contains no Möbius strip' }
];
mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'Portholes in the pod hull',
 brief: 'The greenhouse pods are sewn in different shapes, and each hull must be fitted with portholes whose rims and sides the log has to record.',
 labels: ['boundary circles', 'orientable (1 or 0)'], tolerance: 0.01,
 gl: [['boundary circles before the portholes'], ['boundary circles'], ['orientable (1 or 0)']]
}, {
 /* base is an index into BASES, or −1 for a twisted band with t half-twists (t only matters for a band). */
 canonical: { base: -1, t: 4, k: 3 },
 draw: R => {
  for (let i = 0; i < 1000; i++) { const base = R.int(-1, BASES.length - 1), p = { base, t: base < 0 ? R.int(0, 7) : 0, k: R.int(1, 5) }; if (!(p.base === -1 && p.t === 4 && p.k === 3)) return p; }
  return { base: -1, t: 4, k: 3 };
 },
 build: ({ base, t, k }) => {
  const band = base < 0, S = band ? null : BASES[base], odd = t % 2 === 1;
  const b0 = band ? (odd ? 1 : 2) : S.b, o = band ? (odd ? 0 : 1) : S.o, b = b0 + k;
  const d = band ? `a long strip of cloth whose two ends are sewn together after ${pl(t, 'half-twist')} (a half-twist turns the strip over once, and two half-twists in a row can be undone, so only whether the number of half-twists is odd or even matters)` : S.d;
  const bTxt = band ? (odd ? `With ${pl(t, 'half-twist')}, an odd number, the strip is a Möbius strip, whose edge runs round twice before it closes up into a single circle, so it has 1 boundary circle.`
   : `With ${pl(t, 'half-twist')}, an even number, the twists can be undone and the strip is a cylinder, which has 2 boundary circles, one at each end.`)
   : (S.b ? `The ${S.nm} has ${pl(S.b, 'boundary circle')}: ${S.bw}.` : `The ${S.nm} has no boundary circles: ${S.bw}.`);
  const oTxt = band ? (odd ? 'It contains a Möbius strip (a narrow band round its middle, clear of any portholes), so it is not orientable' : 'A cylinder contains no Möbius strip, so it is orientable')
   : `${S.ow}${o ? '' : ', and a small porthole can always be placed off that strip'}, so it is ${o ? '' : 'not '}orientable`;
  return {
   prompt: `A greenhouse pod hull starts as ${d}. The crew then cuts ${pl(k, 'round porthole')} in it, away from its edges${k === 1 ? '' : ' and from each other'}. Enter the number of boundary circles of the finished hull, then 1 if it is orientable or 0 if it is not.`,
   answer: [b, o],
   hints: [
    'Count the boundary circles of the starting surface, then add one for each porthole. A strip sewn after an odd number of half-twists is a Möbius strip; after an even number it can be untwisted into a cylinder.',
    'A surface is orientable when it contains no Möbius strip. Cutting a small porthole never removes a Möbius strip and never creates one.'
   ],
   solution: `${bTxt} ${k === 1 ? 'The porthole adds' : `Each of the ${n(k)} portholes adds`} one more, so there are ${n(b0)} + ${n(k)} = ${n(b)}. ${oTxt}: enter ${n(o)}.`,
   guidance: [
    { prompt: `Before any portholes are cut, how many boundary circles does the starting surface have?`, answer: [b0], explanation: bTxt },
    { prompt: `How many boundary circles does the finished hull have?`, answer: [b], explanation: `${k === 1 ? 'The porthole adds' : 'Each porthole adds'} one: ${n(b0)} + ${n(k)} = ${n(b)}.` },
    { prompt: `Does the hull contain a Möbius strip? Enter 0 if it does (not orientable) or 1 if it does not (orientable).`, answer: [o], explanation: `${oTxt}.` }
   ] };
 }
});

/* A rack of flat panels: discs 1, cylinders 2, Möbius strips 1 and pairs of trousers 3 boundary circles. */
mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'Edging the panel rack',
 brief: 'The Fabric Bay rack holds panels of several shapes, and every edge circle of every panel has to be bound before it is used.',
 labels: ['boundary circles on the rack', 'panels that are not orientable', 'total cost of edging strips (credits)'], tolerance: 0.01,
 gl: [['boundary circles on the rack'], ['panels that are not orientable']]
}, {
 canonical: { d: 2, y: 3, m: 2, t: 4, c: 7 },
 draw: R => {
  for (let i = 0; i < 1000; i++) { const p = { d: R.int(1, 5), y: R.int(1, 5), m: R.int(1, 5), t: R.int(1, 5), c: R.int(3, 12) }; if (!same(p, { d: 2, y: 3, m: 2, t: 4, c: 7 })) return p; }
  return { d: 2, y: 3, m: 2, t: 4, c: 7 };
 },
 build: ({ d, y, m, t, c }) => {
  const total = d + 2 * y + m + 3 * t, cost = total * c;
  return {
   prompt: `The Fabric Bay rack holds flat panels that still have to be edged: ${pl(d, 'disc')}, ${pl(y, 'cylinder')}, ${pl(m, 'Möbius strip')} and ${pl(t, 'pair of trousers', 'pairs of trousers')} (a pair of trousers is a disc with two smaller discs cut out of it). A boundary circle is a loop of edge where a panel stops. Every boundary circle of every panel needs one edging strip, and each strip costs ${n(c)} credits. Enter the total number of boundary circles on the rack, then how many of the panels are not orientable, then the total cost of the edging strips in credits.`,
   answer: [total, m, cost],
   hints: [
    'Each kind of panel has its own number of boundary circles. Multiply it by how many panels of that kind there are, and add the four results.',
    'A panel is not orientable when it contains a Möbius strip. Only one of these four kinds does. The cost is the number of strips times the cost of one.'
   ],
   solution: `A disc has 1 boundary circle, a cylinder 2, a Möbius strip 1 and a pair of trousers 3. So the rack has ${n(d)} × 1 + ${n(y)} × 2 + ${n(m)} × 1 + ${n(t)} × 3 = ${n(total)} boundary circles. Only the Möbius strips contain a Möbius strip, so ${pl(m, 'panel is', 'panels are')} not orientable. The strips cost ${n(total)} × ${n(c)} = ${n(cost)} credits.`,
   guidance: [
    { prompt: `A disc has 1 boundary circle, a cylinder 2, a Möbius strip 1 and a pair of trousers 3. How many boundary circles are there on the whole rack?`, answer: [total], explanation: `${n(d)} × 1 + ${n(y)} × 2 + ${n(m)} × 1 + ${n(t)} × 3 = ${n(total)}.` },
    { prompt: `How many of the panels on the rack are not orientable, that is, contain a Möbius strip?`, answer: [m], explanation: `Only the Möbius strips do, so ${n(m)} of the panels.` }
   ] };
 }
});

/* Three strips: a square sewn left to right with an arrow on each side, then holes; same arrows = cylinder, opposite = Möbius strip. Uses q18. */
mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'Strips with arrows and holes',
 brief: 'Three fabric strips have been sewn from marked squares, and the Fabric Bay wants to know how many edge circles and how many one-sided strips they now hold.',
 labels: ['boundary circles in all', 'strips that are not orientable'], tolerance: 0.01,
 gl: [['boundary circles of strip 1'], ['boundary circles in all'], ['strips that are not orientable']]
}, {
 /* Each strip is [left arrow, right arrow, holes]: arrows 1 = up, 0 = down. */
 canonical: { s: [[1, 1, 1], [1, 0, 2], [0, 0, 0]] },
 draw: R => {
  for (let i = 0; i < 1000; i++) { const s = [0, 1, 2].map(() => [R.int(0, 1), R.int(0, 1), R.int(0, 3)]); if (!same(s, [[1, 1, 1], [1, 0, 2], [0, 0, 0]])) return { s }; }
  return { s: [[1, 1, 1], [1, 0, 2], [0, 0, 0]] };
 },
 build: ({ s }) => {
  const dir = x => x ? 'up' : 'down', circ = q => (q[0] === q[1] ? 2 : 1) + q[2], non = s.filter(q => q[0] !== q[1]).length, total = s.reduce((a, q) => a + circ(q), 0);
  const list = s.map((q, i) => `strip ${n(i + 1)} has its left arrow ${dir(q[0])}, its right arrow ${dir(q[1])} and ${pl(q[2], 'hole')}`).join('; ');
  const kind = q => q[0] === q[1] ? `its arrows point the same way, so it is a cylinder with 2 boundary circles` : `its arrows point opposite ways, so it is a Möbius strip with 1 boundary circle`;
  const stripTxt = (q, i) => `Strip ${n(i + 1)}: ${kind(q)}${q[2] ? `, plus ${pl(q[2], 'hole')}` : ''}, so ${pl(circ(q), 'boundary circle')}.`;
  return {
   prompt: `The Fabric Bay sews three strips, each from a square of cloth. On each square the left and right edges are sewn together, arrow on arrow, and the top and bottom edges are left unsewn. A square whose two arrows point the same way (both up or both down) becomes a cylinder, and one whose arrows point opposite ways becomes a Möbius strip. After sewing, each strip gets some round holes, away from its edges and from each other: ${list}. Enter the total number of boundary circles of the three strips, then how many of the strips are not orientable.`,
   answer: [total, non],
   hints: [
    'Decide for each strip whether it is a cylinder or a Möbius strip, count its boundary circles, and add one for each hole.',
    'A strip is orientable when it contains no Möbius strip. Holes never change that.'
   ],
   solution: `${s.map(stripTxt).join(' ')} The total is ${s.map(circ).map(n).join(' + ')} = ${n(total)}. Of the three strips, ${n(non)} ${non === 1 ? 'is a Möbius strip' : 'are Möbius strips'}, and a Möbius strip is not orientable; holes do not change that. So ${n(non)} of the strips are not orientable.`,
   guidance: [
    { prompt: `How many boundary circles does strip 1 have after its holes are cut?`, answer: [circ(s[0])], explanation: stripTxt(s[0], 0) },
    { prompt: `How many boundary circles do the three strips have in all?`, answer: [total], explanation: `${s.map(circ).map(n).join(' + ')} = ${n(total)}.` },
    { prompt: `How many of the three strips are Möbius strips, which are not orientable?`, answer: [non], explanation: `The strips whose two arrows point opposite ways: ${n(non)} of them. Holes do not change orientability.` }
   ] };
 }
});

/* ---- q20 Euler characteristic of a cell division [H 7.5] ---- */

/* Frames and grids for q20b: a bipyramid or an antiprism (a-sided, 3–9) or an a × b tile grid sewn into a torus. */
const cells = ({ kind, a, b }) => {
 const sphere = 'Blown up, the frame becomes a sphere, and its corners, struts and panels become a cell division of the sphere';
 if (kind === 'bipyramid') return { V: a + 2, E: 3 * a, F: 2 * a, what: `A radar mast frame is a bipyramid: a flat ring of ${n(a)} corners joined by ${n(a)} struts, with one pointed tip above the ring and one below it, each tip joined to every corner of the ring by a strut, so the panels are triangles. ${sphere}`,
  hv: `V = ${n(a)} + 2 = ${n(a + 2)} corners: the ring corners and the two tips.`, he: `E = ${n(a)} + ${n(a)} + ${n(a)} = ${n(3 * a)} struts: ${n(a)} round the ring, ${n(a)} up to the top tip and ${n(a)} down to the bottom tip.`, hf: `F = ${n(a)} + ${n(a)} = ${n(2 * a)} panels: ${n(a)} triangles above the ring and ${n(a)} below it.` };
 if (kind === 'antiprism') return { V: 2 * a, E: 4 * a, F: 2 * a + 2, what: `A fuel ring frame is an antiprism: two flat rings of ${n(a)} corners each, one above the other and turned half a step, each ring a panel of its own, joined by a band of triangular panels in which every corner of one ring is joined to the two nearest corners of the other ring. ${sphere}`,
  hv: `V = ${n(a)} + ${n(a)} = ${n(2 * a)} corners, ${n(a)} on each ring.`, he: `E = ${n(a)} + ${n(a)} + ${n(2 * a)} = ${n(4 * a)} struts: ${n(a)} round each ring and ${n(2 * a)} in the zigzag between them.`, hf: `F = 2 + ${n(2 * a)} = ${n(2 * a + 2)} panels: the 2 rings and the ${n(2 * a)} triangles of the band.` };
 return { V: a * b, E: 2 * a * b, F: a * b, what: `The ring habitat is clad with a flat sheet of tiles, ${n(a)} tiles across and ${n(b)} tiles down. The crew sews the left edge to the right edge and the top edge to the bottom edge, so the sheet becomes a torus and the tile edges become a cell division of the torus`,
  hv: `The flat sheet has ${n(a + 1)} × ${n(b + 1)} grid points. Sewing left to right merges the last column of points with the first, and sewing top to bottom merges the last row with the first, so V = ${n(a)} × ${n(b)} = ${n(a * b)}.`,
  he: `Each of the ${n(b)} rows of points left has ${n(a)} horizontal edges, and each of the ${n(a)} columns has ${n(b)} vertical edges, so E = ${n(a * b)} + ${n(a * b)} = ${n(2 * a * b)}.`, hf: `The tiles are the faces: F = ${n(a)} × ${n(b)} = ${n(a * b)}.` };
};
mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Counting the mast frames',
 brief: 'The Fabric Bay is cladding the radar mast, the fuel ring and the habitat ring, and each frame needs its corners, struts and panels counted.',
 labels: ['vertices V', 'edges E', 'faces F', 'Euler characteristic'], tolerance: 0.01,
 gl: [['vertices V'], ['edges E'], ['faces F']]
}, {
 canonical: { kind: 'antiprism', a: 5, b: 0 },
 draw: R => {
  for (let i = 0; i < 1000; i++) {
   const kind = R.pick(['bipyramid', 'antiprism', 'torus']), p = kind === 'torus' ? { kind, a: R.int(3, 8), b: R.int(3, 8) } : { kind, a: R.int(3, 9), b: 0 };
   if (!same(p, { kind: 'antiprism', a: 5, b: 0 }) && !same(p, { kind: 'torus', a: 3, b: 4 })) return p;
  }
  return { kind: 'antiprism', a: 5, b: 0 };
 },
 build: p => {
  const c = cells(p), chi = c.V - c.E + c.F, torus = p.kind === 'torus';
  return {
   prompt: `${c.what}. Count this cell division: enter the number of vertices V, the number of edges E and the number of faces F, then the Euler characteristic V − E + F.`,
   answer: [c.V, c.E, c.F, chi],
   hints: [
    'Count each kind of piece once. Points or lines that are sewn together count as one.',
    torus ? 'Start from the flat sheet: a sheet of a tiles across and b tiles down has (a + 1) × (b + 1) grid points. Each sewing merges a whole column or a whole row of points, and of edges, with another.' : 'Count the corners, struts and panels round the ring or rings first, then the ones that join the rings or the tips to them.'
   ],
   solution: `${c.hv} ${c.he} ${c.hf} So V − E + F = ${n(c.V)} − ${n(c.E)} + ${n(c.F)} = ${n(chi)}.`,
   guidance: [
    { prompt: `How many vertices V does the cell division have?`, answer: [c.V], explanation: c.hv },
    { prompt: `How many edges E does it have?`, answer: [c.E], explanation: c.he },
    { prompt: `How many faces F does it have?`, answer: [c.F], explanation: `${c.hf} So V − E + F = ${n(c.V)} − ${n(c.E)} + ${n(c.F)} = ${n(chi)}.` }
   ] };
 }
});

/* One of V, E, F is missing; the Euler characteristic of the surface (sphere 2, torus 0, disc 1) gives it. */
const SURFS = [
 { chi: 2, intro: 'A dome frame is a cell division of a sphere' },
 { chi: 0, intro: 'A ring habitat frame is a cell division of a torus' },
 { chi: 1, intro: 'A flat hull panel is ruled into a cell division of a disc' }
];
const PARTS = [
 { nm: 'corner joints', verb: 'fitting a joint', one: 'corner joint' },
 { nm: 'struts', verb: 'cutting a strut', one: 'strut' },
 { nm: 'panels', verb: 'cladding a panel', one: 'panel' }
];
mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Joints, struts or panels',
 brief: 'A frame has been surveyed with one of its counts lost, and the Fabric Bay must recover it from the shape and price the parts.',
 labels: ['missing count', 'cost of those parts (credits)'], tolerance: 0.01,
 gl: [['V − E + F'], ['missing count'], ['cost (credits)']]
}, {
 /* surf indexes SURFS, miss indexes PARTS (0 = V, 1 = E, 2 = F). V, E, F always satisfy V − E + F = the surface's number. */
 canonical: { surf: 0, miss: 2, V: 12, E: 30, F: 20, price: 9 },
 draw: R => {
  for (let i = 0; i < 1000; i++) {
   const surf = R.int(0, 2), chi = SURFS[surf].chi, V = R.int(6, 30), F = R.int(5, 30), E = V + F - chi;
   if (surf < 2 ? (2 * E < 3 * V || 2 * E < 3 * F) : 2 * E < 3 * F + 3) continue;
   const p = { surf, miss: R.int(0, 2), V, E, F, price: R.int(2, 15) };
   if (!same(p, { surf: 0, miss: 2, V: 12, E: 30, F: 20, price: 9 })) return p;
  }
  return { surf: 0, miss: 2, V: 12, E: 30, F: 20, price: 9 };
 },
 build: ({ surf, miss, V, E, F, price }) => {
  const S = SURFS[surf], P = PARTS[miss], vals = [V, E, F], x = vals[miss], cost = x * price;
  const known = [0, 1, 2].filter(i => i !== miss).map(i => pl(vals[i], PARTS[i].one, PARTS[i].one === 'corner joint' ? 'corner joints' : undefined));
  const rel = [`V = ${n(S.chi)} + ${n(E)} − ${n(F)}`, `E = V + F − ${n(S.chi)} = ${n(V)} + ${n(F)} − ${n(S.chi)}`, `F = ${n(S.chi)} − V + E = ${n(S.chi)} − ${n(V)} + ${n(E)}`][miss];
  return {
   prompt: `${S.intro}. The survey recorded ${known[0]} and ${known[1]}, but the count of ${P.nm} was lost. Enter how many ${P.nm} the frame has, then the cost in credits of ${P.nm === 'panels' ? 'cladding' : P.nm === 'struts' ? 'cutting' : 'fitting'} them all, at ${n(price)} credits for each.`,
   answer: [x, cost],
   hints: [
    'Every cell division of the same surface has the same value of V − E + F, the Euler characteristic: 2 for a sphere, 0 for a torus and 1 for a disc.',
    'Rearrange V − E + F = χ to get the missing count from the other two, then multiply by the price of one.'
   ],
   solution: `For ${['a sphere', 'a torus', 'a disc'][surf]}, V − E + F = ${n(S.chi)}. So ${rel} = ${n(x)}. The cost is ${n(x)} × ${n(price)} = ${n(cost)} credits.`,
   guidance: [
    { prompt: `What is V − E + F for every cell division of this surface?`, answer: [S.chi], explanation: `For ${['a sphere', 'a torus', 'a disc'][surf]} it is ${n(S.chi)}.` },
    { prompt: `Using V − E + F = ${n(S.chi)} and the two counts the survey recorded, how many ${P.nm} does the frame have?`, answer: [x], explanation: `${rel} = ${n(x)}.` },
    { prompt: `At ${n(price)} credits each, what do all the ${P.nm} cost, in credits?`, answer: [cost], explanation: `${n(x)} × ${n(price)} = ${n(cost)}.` }
   ] };
 }
});

/* A torus grid with k whole tiles removed as hatches. Uses q19 (boundary circles). */
mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q19', title: 'Hatches in the ring hull',
 brief: 'Hatches are being cut through the tiled ring hull, and the log needs the new face count, the new Euler characteristic and the new edge circles.',
 labels: ['faces F left', 'Euler characteristic', 'boundary circles'], tolerance: 0.01,
 gl: [['vertices V'], ['edges E'], ['faces F left']]
}, {
 canonical: { a: 5, b: 4, k: 3 },
 draw: R => {
  for (let i = 0; i < 1000; i++) { const p = { a: R.int(4, 8), b: R.int(4, 8), k: R.int(1, 4) }; if (!same(p, { a: 5, b: 4, k: 3 })) return p; }
  return { a: 5, b: 4, k: 3 };
 },
 build: ({ a, b, k }) => {
  const V = a * b, E = 2 * a * b, F = a * b - k, chi = V - E + F;
  return {
   prompt: `The habitat ring is clad with a flat sheet of tiles, ${n(a)} tiles across and ${n(b)} tiles down. The sheet is sewn left edge to right edge and top edge to bottom edge, so it becomes a torus and the tile edges are a cell division of the torus. The crew then cuts ${pl(k, 'hatch', 'hatches')}, each by removing one whole tile${k === 1 ? '' : '; the tiles removed are far enough apart that no two share an edge or a corner'}. Removing a tile leaves its edges and corners in place. Count V − E + F using only the tiles that are left as faces. Enter the number of faces F left, then the Euler characteristic V − E + F, then the number of boundary circles of the hull (a boundary circle is a closed loop of edge where the surface stops).`,
   answer: [F, chi, k],
   hints: [
    'Start with the whole torus: sewing merges the last column and the last row of points and edges with the first, so count V and E once each. Removing a tile changes only F.',
    'Each removed tile leaves a round hole bounded by one circle, and holes that share no edge or corner have separate circles.'
   ],
   solution: `Before any tile is removed the torus has V = ${n(a)} × ${n(b)} = ${n(V)} vertices, E = ${n(V)} + ${n(V)} = ${n(E)} edges and ${n(V)} faces. Removing ${pl(k, 'tile')} leaves ${k === 1 ? 'its' : 'their'} edges and corners, so V and E stay and F = ${n(V)} − ${n(k)} = ${n(F)}. Then V − E + F = ${n(V)} − ${n(E)} + ${n(F)} = ${n(chi)}. Each removed tile leaves one hole with one boundary circle${k === 1 ? '' : ', and no two holes touch'}, so there ${k === 1 ? 'is 1 boundary circle' : `are ${n(k)} boundary circles`}.`,
   guidance: [
    { prompt: `How many vertices V does the sewn tile grid have, before any tile is removed?`, answer: [V], explanation: `The flat sheet has ${n(a + 1)} × ${n(b + 1)} grid points. Sewing merges the last column and the last row of points with the first, so V = ${n(a)} × ${n(b)} = ${n(V)}.` },
    { prompt: `How many edges E does it have? Removing a tile does not change E.`, answer: [E], explanation: `Each of the ${n(b)} rows of points left has ${n(a)} horizontal edges, and each of the ${n(a)} columns has ${n(b)} vertical edges, so E = ${n(V)} + ${n(V)} = ${n(E)}.` },
    { prompt: `The grid has ${n(V)} tiles and ${pl(k, 'tile')} ${k === 1 ? 'is' : 'are'} removed. How many faces F are left?`, answer: [F], explanation: `${n(V)} − ${n(k)} = ${n(F)}. So V − E + F = ${n(V)} − ${n(E)} + ${n(F)} = ${n(chi)}.` }
   ] };
 }
});

})();
