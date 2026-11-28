/* Topology: shape without size mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, par } = G;
/* "1 node" / "3 nodes"; lists "A, B and C". */
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const andList = xs => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
const same = (p, q) => JSON.stringify(p) === JSON.stringify(q);

/* ---------- q11: finite spaces on nodes A–E, subsets as bit masks (bit i is node i). ---------- */
const NODES = 'ABCDE';
const pc = m => { let c = 0; for (; m; m >>= 1) c += m & 1; return c; };
const setTxt = m => { const xs = []; for (let i = 0; i < 5; i++) if (m >> i & 1) xs.push(NODES[i]); return xs.length ? `{${xs.join(', ')}}` : '∅'; };
const nodeNames = m => { const xs = []; for (let i = 0; i < 5; i++) if (m >> i & 1) xs.push(NODES[i]); return andList(xs); };
const bySize = (x, y) => pc(x) - pc(y) || x - y;
/* Every union of basic sets, with ∅. */
const unions = basis => { const s = new Set([0]); for (const b of basis) for (const u of [...s]) s.add(u | b); return [...s].sort(bySize); };

/* ---------- q12 and q17: a union of intervals and single points on the line. A piece is [l, r, lc, rc]: end points
   and whether each end is included (a single point has l = r and both ends included). ---------- */
const pieceTxt = ([l, r, lc, rc]) => l === r ? `{${n(l)}}` : `${lc ? '[' : '('}${n(l)}, ${n(r)}${rc ? ']' : ')'}`;
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
const drawPieces = (R, count) => {
 const pieces = []; let x = R.int(0, 3), gapBefore = 1;
 for (let i = 0; i < count; i++) {
  if (gapBefore > 0 && i > 0 && R.next() < 0.15) { pieces.push([x, x, 1, 1]); gapBefore = R.int(1, 2); x += gapBefore; continue; }
  const len = R.int(1, 3); pieces.push([x, x + len, R.bool() ? 1 : 0, R.bool() ? 1 : 0]); x += len;
  gapBefore = R.bool() ? 0 : R.int(1, 2); x += gapBefore;
 }
 return pieces;
};

/* ---------- q13 and q14: stencil letters as graphs (v vertices, edges between them). pts: the marked points of q13,
   as [description, vertex index] or [description, 'e', edge index] for the midpoint of an edge. ---------- */
const LETTERS = {
 A: { d: 'two straight strokes meeting at the apex, joined by a crossbar part of the way down, with both strokes going on below the bar as feet', v: 5, e: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4]],
  pts: [['the apex at the top', 0], ['the left end of the crossbar', 1], ['the middle of the crossbar', 'e', 2], ['the middle of the left foot, below the crossbar', 'e', 3]] },
 B: { d: 'a straight stem with two curved bowls on its right: the upper bowl runs from the top of the stem to its middle, the lower bowl from the middle to the bottom', v: 5, e: [[0, 1], [1, 2], [0, 3], [3, 1], [1, 4], [4, 2]],
  pts: [['the point where both bowls meet the middle of the stem', 1], ['the outermost point of the upper bowl', 3]] },
 C: { d: 'one curved stroke, open on the right', v: 3, e: [[0, 1], [1, 2]] },
 D: { d: 'a straight stem with a curved bowl that joins its top to its bottom', v: 3, e: [[0, 1], [0, 2], [2, 1]],
  pts: [['the top corner', 0], ['the middle of the stem', 'e', 0]] },
 E: { d: 'a straight stem with three straight arms going right, from its top, its middle and its bottom', v: 6, e: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5]],
  pts: [['the point where the middle arm meets the stem', 1], ['the top-left corner, where the top arm meets the stem', 0], ['the middle of the bottom arm', 'e', 4], ['the tip of the middle arm', 4]] },
 F: { d: 'a straight stem with two straight arms going right, from its top and its middle', v: 5, e: [[0, 1], [1, 2], [0, 3], [1, 4]],
  pts: [['the point where the middle arm meets the stem', 1], ['the top-left corner, where the top arm meets the stem', 0], ['the middle of the stem below the middle arm', 'e', 1]] },
 H: { d: 'two straight stems joined by a crossbar between their midpoints', v: 6, e: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]],
  pts: [['the point where the crossbar meets the left stem', 1], ['the middle of the crossbar', 'e', 4], ['the middle of the upper half of the left stem', 'e', 0]] },
 I: { d: 'one straight stroke', v: 2, e: [[0, 1]] },
 J: { d: 'a straight stroke with a hook at its bottom', v: 3, e: [[0, 1], [1, 2]] },
 K: { d: 'a straight stem with two straight arms going right from one point at its middle', v: 5, e: [[0, 1], [1, 2], [1, 3], [1, 4]],
  pts: [['the point where the two arms meet the stem', 1], ['the middle of the upper arm', 'e', 2]] },
 L: { d: 'a straight stem with a straight foot going right from its bottom', v: 3, e: [[0, 1], [1, 2]],
  pts: [['the corner', 1], ['the top tip of the stem', 0]] },
 M: { d: 'four straight strokes joined end to end in a zigzag', v: 5, e: [[0, 1], [1, 2], [2, 3], [3, 4]] },
 N: { d: 'three straight strokes joined end to end in a zigzag', v: 4, e: [[0, 1], [1, 2], [2, 3]] },
 O: { d: 'a single closed loop', v: 3, e: [[0, 1], [1, 2], [2, 0]],
  pts: [['the top of the loop', 0]] },
 P: { d: 'a straight stem with a curved bowl that leaves the top of the stem and comes back to meet the stem at its middle', v: 4, e: [[0, 1], [1, 2], [2, 3], [3, 1]],
  pts: [['the point where the bowl meets the middle of the stem', 1], ['the outermost point of the bowl', 3], ['the middle of the stem below the bowl', 'e', 0]] },
 R: { d: 'a straight stem with a curved bowl from the top of the stem back to its middle, and a straight leg going down to the right from the point where the bowl meets the middle of the stem', v: 5, e: [[0, 1], [1, 2], [2, 3], [3, 1], [1, 4]],
  pts: [['the point where the bowl and the leg meet the stem', 1], ['the outermost point of the bowl', 3], ['the middle of the leg', 'e', 4]] },
 S: { d: 'one curving stroke', v: 3, e: [[0, 1], [1, 2]] },
 T: { d: 'a straight crossbar with a straight stem hanging down from its midpoint', v: 4, e: [[0, 2], [2, 1], [2, 3]],
  pts: [['the point where the stem meets the crossbar', 2], ['the middle of the stem', 'e', 2], ['the middle of the left half of the crossbar', 'e', 0], ['the bottom tip of the stem', 3]] },
 U: { d: 'one curved stroke, open at the top', v: 3, e: [[0, 1], [1, 2]] },
 V: { d: 'two straight strokes meeting at the bottom point', v: 3, e: [[0, 1], [1, 2]],
  pts: [['the bottom point', 1], ['the middle of the left stroke', 'e', 0]] },
 W: { d: 'four straight strokes joined end to end in a zigzag', v: 5, e: [[0, 1], [1, 2], [2, 3], [3, 4]] },
 X: { d: 'two straight strokes crossing at their midpoints', v: 5, e: [[0, 4], [1, 4], [2, 4], [3, 4]],
  pts: [['the crossing point', 4], ['the middle of the upper-left arm', 'e', 0]] },
 Y: { d: 'two straight arms that meet at one point, with a straight stem going down from that point', v: 4, e: [[0, 2], [1, 2], [2, 3]],
  pts: [['the point where the two arms meet the stem', 2], ['the middle of the stem', 'e', 2], ['the tip of the left arm', 0]] },
 Z: { d: 'three straight strokes joined end to end in a zigzag', v: 4, e: [[0, 1], [1, 2], [2, 3]] }
};
const degrees = g => { const d = Array(g.v).fill(0); for (const [a, b] of g.e) { d[a]++; d[b]++; } return d; };
/* End points (degree 1), branch points (degree 3 or more, with their degrees) and holes (E − V + 1, every letter is in one piece). */
const shapeOf = L => { const g = LETTERS[L], d = degrees(g); return { ends: d.filter(x => x === 1).length, branch: d.filter(x => x >= 3).sort(), holes: g.e.length - g.v + 1 }; };
const sigOf = L => { const s = shapeOf(L); return `${s.ends}|${s.branch.join(',')}|${s.holes}`; };
/* Pieces left when a point is removed: put a midpoint on every edge, delete the chosen vertex or midpoint, count what is left. */
const piecesAfter = (L, pt) => {
 const g = LETTERS[L], V = g.v + g.e.length, adj = Array.from({ length: V }, () => []);
 g.e.forEach(([a, b], i) => { const m = g.v + i; adj[a].push(m); adj[m].push(a); adj[b].push(m); adj[m].push(b); });
 const gone = pt[1] === 'e' ? g.v + pt[2] : pt[1], seen = Array(V).fill(false); seen[gone] = true; let count = 0;
 for (let s = 0; s < V; s++) if (!seen[s]) { count++; const st = [s]; seen[s] = true; while (st.length) { const u = st.pop(); for (const w of adj[u]) if (!seen[w]) { seen[w] = true; st.push(w); } } }
 return count;
};
const branchTxt = s => s.branch.length === 0 ? 'no branch points' : s.branch.length === 1 ? `1 branch point (${n(s.branch[0])} strokes meet there)` : s.branch.every(x => x === s.branch[0]) ? `${n(s.branch.length)} branch points (${n(s.branch[0])} strokes meet at each)` : `${n(s.branch.length)} branch points (${andList(s.branch.map(n))} strokes meet there)`;
const shapeTxt = L => { const s = shapeOf(L); return `${pl(s.ends, 'end point')}, ${branchTxt(s)} and ${pl(s.holes, 'hole')}`; };
const WORDS = ['CABLE', 'RELAY', 'TORUS', 'SPHERE', 'HOOK', 'DOME', 'PANEL', 'LOOM', 'HULL', 'FABRIC', 'KEPLER', 'ROVER', 'BEACON', 'NODE', 'WAVE', 'DISC', 'FOLD', 'SHAPE', 'LOOP', 'FLUX', 'AXLE', 'RADAR', 'VALVE', 'ZONE', 'EXIT', 'TOWER', 'SPOKE', 'LADDER', 'HATCH', 'KAYAK', 'MIRA', 'ORBIT', 'VORTEX', 'ZEBRA', 'PYLON', 'DYNAMO', 'SKETCH', 'MATRIX', 'TEXT', 'BOX'];

/* ---------- q15 and q17: covering [a, b] with open intervals of length L (L10 = 10L, to keep the arithmetic whole). ---------- */
const coverInfo = (a, b, L10) => { const D = b - a, k = Math.floor(10 * D / L10) + 1, L = L10 / 10; return { D, k, L,
 txt: `${pl(k, 'clamp')} of ${n(L)} metres give ${n(k * L)} metres in all, which is more than ${n(D)}, while ${pl(k - 1, 'clamp')} give only ${n((k - 1) * L)} metres, which is not more than ${n(D)}` }; };
/* q15: the sets whose compactness is asked. Index into this list of descriptions; c and d are the numbers in it. */
const SETS = [
 { t: (c, d) => `[${n(c)}, ${n(d)}]`, closed: 1, bounded: 1, why: (c, d) => `[${n(c)}, ${n(d)}] contains its boundary points ${n(c)} and ${n(d)}, so it is closed, and it lies between ${n(c)} and ${n(d)}, so it is bounded.` },
 { t: (c, d) => `(${n(c)}, ${n(d)})`, closed: 0, bounded: 1, why: (c, d) => `(${n(c)}, ${n(d)}) is bounded, but its boundary points ${n(c)} and ${n(d)} are not in it, so it is not closed.` },
 { t: (c, d) => `[${n(c)}, ${n(d)})`, closed: 0, bounded: 1, why: (c, d) => `[${n(c)}, ${n(d)}) is bounded, but its boundary point ${n(d)} is not in it, so it is not closed.` },
 { t: c => `[${n(c)}, ∞) (every x with x ≥ ${n(c)})`, closed: 1, bounded: 0, why: c => `[${n(c)}, ∞) contains its only boundary point ${n(c)}, so it is closed, but it runs on for ever, so no interval [−r, r] holds it: it is not bounded.` },
 { t: (c, d) => `{${n(c)}, ${n(d)}, ${n(d + 2)}} (three single points)`, closed: 1, bounded: 1, why: (c, d) => `A set of three points is its own boundary and contains it, so it is closed, and it lies between ${n(c)} and ${n(d + 2)}, so it is bounded.` },
 { t: (c, d) => `[${n(c)}, ${n(d)}] ∪ [${n(d + 1)}, ${n(d + 3)}]`, closed: 1, bounded: 1, why: (c, d) => `Its boundary points ${n(c)}, ${n(d)}, ${n(d + 1)} and ${n(d + 3)} all belong to it, so it is closed, and it lies between ${n(c)} and ${n(d + 3)}, so it is bounded.` },
 { t: () => `the set of all whole numbers …, −2, −1, 0, 1, 2, …`, closed: 1, bounded: 0, why: () => `Each whole number is a boundary point and belongs to the set, and there are no others, so it is closed; but it runs on for ever in both directions, so it is not bounded.` },
 { t: () => `{1, 1/2, 1/3, 1/4, …} (the numbers 1 ÷ k for k = 1, 2, 3, …)`, closed: 0, bounded: 1, why: () => `It lies between 0 and 1, so it is bounded. But the points 1 ÷ k crowd in on 0, so every ball round 0 meets the set: 0 is a boundary point that is not in the set, and the set is not closed.` },
 { t: () => `{0} ∪ {1, 1/2, 1/3, 1/4, …} (the number 0 together with the numbers 1 ÷ k for k = 1, 2, 3, …)`, closed: 1, bounded: 1, why: () => `The points 1 ÷ k crowd in on 0, and 0 belongs to this set, so it contains all its boundary points and is closed; it lies between 0 and 1, so it is bounded.` },
 { t: c => `(${n(c)}, ∞) (every x with x > ${n(c)})`, closed: 0, bounded: 0, why: c => `(${n(c)}, ∞) does not contain its boundary point ${n(c)}, so it is not closed, and it runs on for ever, so it is not bounded.` }
];

/* ---------- q16 and q17: f(x) = s(x³ − 3m²x) + c (kind 'c', critical points ±m) or s(x − h)² + c (kind 'q', critical point h). ---------- */
const power = p => p === 0 ? '' : p === 1 ? 'x' : p === 2 ? 'x²' : 'x³';
const poly = cs => { let out = ''; for (const [c, p] of cs) { if (!c) continue; const a = Math.abs(c), v = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + power(p);
 out += out ? ` ${c < 0 ? '−' : '+'} ${v}` : `${c < 0 ? '−' : ''}${v}`; } return out || '0'; };
const fInfo = f => {
 const { kind, s, c } = f;
 const cs = kind === 'c' ? [[s, 3], [-3 * s * f.m * f.m, 1], [c, 0]] : [[s, 2], [-2 * s * f.h, 1], [s * f.h * f.h + c, 0]];
 const ds = kind === 'c' ? [[3 * s, 2], [-3 * s * f.m * f.m, 0]] : [[2 * s, 1], [-2 * s * f.h, 0]];
 const crit = kind === 'c' ? [-f.m, f.m] : [f.h];
 const val = x => kind === 'c' ? s * (x * x * x - 3 * f.m * f.m * x) + c : s * (x - f.h) * (x - f.h) + c;
 return { text: poly(cs), dtext: poly(ds), crit, val };
};
const extremes = (f, a, b) => {
 const F = fInfo(f), inside = F.crit.filter(x => x > a && x < b), pts = [a, b, ...inside], vals = pts.map(F.val);
 const max = Math.max(...vals), min = Math.min(...vals);
 const critTxt = F.crit.length === 1 ? `x = ${n(F.crit[0])}` : `x = ${n(F.crit[0])} and x = ${n(F.crit[1])}`;
 const insideTxt = inside.length === 0 ? (F.crit.length === 1 ? `That point is not strictly between ${n(a)} and ${n(b)}, so only the end points count.` : `Neither is strictly between ${n(a)} and ${n(b)}, so only the end points count.`)
  : inside.length === F.crit.length ? (F.crit.length === 1 ? `That point lies strictly between ${n(a)} and ${n(b)}.` : `Both lie strictly between ${n(a)} and ${n(b)}.`)
  : `Only x = ${n(inside[0])} lies strictly between ${n(a)} and ${n(b)}.`;
 const valTxt = andList(pts.map((x, i) => `f(${n(x)}) = ${n(vals[i])}`));
 return { F, inside, max, min, fa: vals[0], fb: vals[1], critTxt, insideTxt, valTxt };
};
const drawF = R => R.bool() ? { kind: 'c', s: R.pick([1, -1]), m: R.int(1, 3), c: R.int(-9, 9) } : { kind: 'q', s: R.pick([1, -1, 2, -2, 3, -3]), h: R.int(-3, 3), c: R.int(-9, 9) };

/* ---------- q18: a square's edges, clockwise from the top-left corner. Corner i is the start of edge i going clockwise. ---------- */
const CORNERS = ['top-left', 'top-right', 'bottom-right', 'bottom-left'], SIDES = ['top', 'right', 'bottom', 'left'];
const lab = ([l, e]) => 'abc'[l] + (e < 0 ? '⁻¹' : '');
const glue = w => {
 const parent = [0, 1, 2, 3], find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
 const ends = i => w[i][1] > 0 ? [i, (i + 1) % 4] : [(i + 1) % 4, i];      // [tail, head]
 const sewn = [];
 for (let l = 0; l < 3; l++) {
  const at = [0, 1, 2, 3].filter(i => w[i][0] === l); if (at.length !== 2) continue;
  const [t1, h1] = ends(at[0]), [t2, h2] = ends(at[1]);
  const j = (x, y) => x === y ? `the ${CORNERS[x]} corner to itself` : `the ${CORNERS[x]} corner to the ${CORNERS[y]} corner`;
  sewn.push(`Sewing the two ${'abc'[l]} edges (${SIDES[at[0]]} and ${SIDES[at[1]]}) joins ${j(t1, t2)} and ${j(h1, h2)}.`);
  parent[find(t1)] = find(t2); parent[find(h1)] = find(h2);
 }
 const groups = {}; for (let i = 0; i < 4; i++) (groups[find(i)] = groups[find(i)] || []).push(CORNERS[i]);
 const list = Object.values(groups), letters = new Set(w.map(x => x[0])).size, tl = groups[find(0)].length;
 return { sewn: sewn.join(' '), V: list.length, E: letters, tl, groupTxt: list.map(g => `{${g.join(', ')}}`).join(', ') };
};

/* ---------- q19: the surfaces. Index into this list; holes (k) only for the ones with an edge. ---------- */
const SURF = [
 { nm: 'disc', d: 'a disc, a flat round panel', b: 1, bw: 'its rim', o: 1, ow: 'A disc lies flat, so it contains no Möbius strip and is orientable' },
 { nm: 'annulus', d: 'an annulus, a flat ring between two circles', b: 2, bw: 'its inner rim and its outer rim', o: 1, ow: 'An annulus lies flat, so it contains no Möbius strip and is orientable' },
 { nm: 'cylinder', d: 'a cylinder, a long strip whose two ends are sewn together without a twist', b: 2, bw: 'one rim at each end', o: 1, ow: 'A cylinder can be squashed flat into an annulus, so it contains no Möbius strip and is orientable' },
 { nm: 'Möbius strip', d: 'a Möbius strip, a long strip whose two ends are sewn together after a half-twist', b: 1, bw: 'its edge, which runs round the strip twice before it closes up into a single circle', o: 0, ow: 'It contains a Möbius strip (a narrow band round its middle, clear of any holes), so it is not orientable' },
 { nm: 'pair of trousers', d: 'a pair of trousers, a disc with two smaller discs cut out of it', b: 3, bw: 'the outer rim and the rims of the two cut-out discs', o: 1, ow: 'It lies flat, so it contains no Möbius strip and is orientable' },
 { nm: 'torus with a disc cut out', d: 'a torus, the surface of a ring doughnut, with one disc cut out of it', b: 1, bw: 'the rim of the cut-out disc', o: 1, ow: 'A torus contains no Möbius strip, and cutting a hole cannot create one, so it is orientable' },
 { nm: 'Klein bottle with a disc cut out', d: 'a Klein bottle, the square sewn by the word a b a⁻¹ b, with one disc cut out of it', b: 1, bw: 'the rim of the cut-out disc', o: 0, ow: 'A Klein bottle contains a Möbius strip, and a small hole can always be placed off that strip, so it is not orientable' },
 { nm: 'sphere', d: 'a sphere, the skin of a ball', b: 0, bw: 'it has no edge at all', o: 1, ow: 'A sphere contains no Möbius strip, so it is orientable' },
 { nm: 'torus', d: 'a torus, the closed surface of a ring doughnut', b: 0, bw: 'it has no edge at all', o: 1, ow: 'A torus contains no Möbius strip, so it is orientable' },
 { nm: 'Klein bottle', d: 'a Klein bottle, the square sewn by the word a b a⁻¹ b', b: 0, bw: 'it has no edge at all', o: 0, ow: 'A Klein bottle contains a Möbius strip, so it is not orientable' },
 { nm: 'projective plane', d: 'a projective plane, a disc whose rim is sewn to itself by joining every pair of opposite points', b: 0, bw: 'it has no edge at all', o: 0, ow: 'A projective plane contains a Möbius strip, so it is not orientable' }
];

/* ---------- q20: cell divisions. ---------- */
const cells = ({ kind, a, b }) => {
 const sphere = 'Blown up, the frame becomes a sphere, and its corners, struts and panels become a cell division of the sphere';
 if (kind === 'prism') return { V: 2 * a, E: 3 * a, F: a + 2, what: `a prism: two flat ${n(a)}-sided ends joined by ${n(a)} rectangular side panels. ${sphere}`,
  hv: `V = ${n(a)} + ${n(a)} = ${n(2 * a)} corners, ${n(a)} on each end.`, he: `E = ${n(a)} + ${n(a)} + ${n(a)} = ${n(3 * a)} struts: ${n(a)} round each end and ${n(a)} running between the ends.`, hf: `F = ${n(a)} + 2 = ${n(a + 2)} panels: the side panels and the 2 ends.` };
 if (kind === 'pyramid') return { V: a + 1, E: 2 * a, F: a + 1, what: `a pyramid: a flat ${n(a)}-sided base and ${n(a)} triangular panels meeting at one apex. ${sphere}`,
  hv: `V = ${n(a)} + 1 = ${n(a + 1)} corners: the base corners and the apex.`, he: `E = ${n(a)} + ${n(a)} = ${n(2 * a)} struts: ${n(a)} round the base and ${n(a)} up to the apex.`, hf: `F = ${n(a)} + 1 = ${n(a + 1)} panels: the triangles and the base.` };
 const grid = `a flat hull panel ruled into a grid of ${n(a)} columns and ${n(b)} rows of squares`, hf = `The squares are the faces: F = ${n(a)} × ${n(b)} = ${n(a * b)}.`;
 if (kind === 'torus') return { V: a * b, E: 2 * a * b, F: a * b, what: `${grid}. It sews the left edge to the right edge and the top edge to the bottom edge (the word a b a⁻¹ b⁻¹), so the panel becomes a torus and the grid lines become a cell division of the torus`,
  hv: `The flat grid has ${n(a + 1)} × ${n(b + 1)} grid points. Sewing left to right merges the last column of points with the first, and sewing top to bottom merges the last row with the first, so V = ${n(a)} × ${n(b)} = ${n(a * b)}.`,
  he: `Each of the ${n(b)} rows of points left has ${n(a)} horizontal edges, and each of the ${n(a)} columns has ${n(b)} vertical edges, so E = ${n(a * b)} + ${n(a * b)} = ${n(2 * a * b)}.`, hf };
 if (kind === 'flat') return { V: (a + 1) * (b + 1), E: a * (b + 1) + b * (a + 1), F: a * b, what: `${grid} and leaves it unsewn, so the grid lines are a cell division of a disc`,
  hv: `V = ${n(a + 1)} × ${n(b + 1)} = ${n((a + 1) * (b + 1))} grid points.`,
  he: `There are ${n(b + 1)} horizontal lines of ${n(a)} edges and ${n(a + 1)} vertical lines of ${n(b)} edges, so E = ${n(a * (b + 1))} + ${n(b * (a + 1))} = ${n(a * (b + 1) + b * (a + 1))}.`, hf };
 return { V: a * (b + 1), E: a * (b + 1) + a * b, F: a * b, what: `${grid}. It sews only the left edge to the right edge, so the panel becomes a cylinder and the grid lines become a cell division of the cylinder`,
  hv: `The flat grid has ${n(a + 1)} × ${n(b + 1)} grid points, and sewing left to right merges the last column of points with the first, so V = ${n(a)} × ${n(b + 1)} = ${n(a * (b + 1))}.`,
  he: `Each of the ${n(b + 1)} rows of points has ${n(a)} horizontal edges, and each of the ${n(a)} columns has ${n(b)} vertical edges, so E = ${n(a * (b + 1))} + ${n(a * b)} = ${n(a * (b + 1) + a * b)}.`, hf };
};

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A basis on 4 or 5 nodes (closed under intersection, contains the whole set), a node x, and the set of nodes the alarm
    map sends to "on" (open in half the draws). Not the worked example (3 nodes P, Q, R). */
 q11: {
  canonical: { N: 4, basis: [1, 4, 3, 15], x: 1, on: 6 },
  draw: R => {
   for (let i = 0; i < 1000; i++) {
    const N = R.pick([4, 5]), full = (1 << N) - 1, B = new Set([full]), k = R.int(2, 3);
    for (let j = 0; j < k; j++) B.add(R.int(1, full - 1));
    let grew = true; while (grew) { grew = false; for (const a of [...B]) for (const b of [...B]) { const c = a & b; if (c && !B.has(c)) { B.add(c); grew = true; } } }
    const basis = [...B].sort(bySize); if (basis.length > 6) continue;
    const opens = unions(basis); if (opens.length < 4 || opens.length === full + 1) continue;
    const wantOpen = R.bool(), pool = []; for (let m = 1; m < full; m++) if (opens.includes(m) === wantOpen) pool.push(m);
    if (!pool.length) continue;
    const p = { N, basis, x: R.int(0, N - 1), on: R.pick(pool) };
    if (!same(p, { N: 4, basis: [1, 4, 3, 15], x: 1, on: 6 })) return p;
   }
   return { N: 4, basis: [1, 4, 3, 15], x: 1, on: 6 };
  },
  build: ({ N, basis, x, on }) => {
   const full = (1 << N) - 1, opens = unions(basis), cnt = opens.length, X = NODES[x];
   const miss = opens.filter(o => !(o >> x & 1)), U = miss.reduce((s, o) => s | o, 0), cl = full & ~U, cs = pc(cl), cont = opens.includes(on) ? 1 : 0;
   const basisTxt = andList(basis.map(setTxt)), opensTxt = opens.map(setTxt).join(', ');
   const missTxt = miss.length === 1 ? `The only open set that misses ${X} is ∅` : `The open sets that miss ${X} are ${andList(miss.map(setTxt))}`;
   return {
    prompt: `The relay network has ${n(N)} nodes, ${nodeNames(full)}. Mira makes it a topological space: its open sets are ∅ and every union of the basic sets ${basisTxt}, which form a basis. Enter the number of open sets. Then enter the number of nodes in the closure of {${X}}. Finally, the alarm panel is the space {on, off} whose open sets are ∅, {on} and {on, off}, and the alarm map f sends ${nodeNames(on)} to on and every other node to off: enter 1 if f is continuous or 0 if it is not.`,
    answer: [cnt, cs, cont],
    hints: [
     'Every union of some of the basic sets is open, and so is ∅. Count each different set once, however many ways it can be made.',
     'The closure of a set is the smallest closed set containing it, and a set is closed when its complement is open. Take the union of all the open sets that miss the node; the closure is everything else.',
     'f is continuous when the preimage of every open set of {on, off} is open. The preimages of ∅ and {on, off} are ∅ and the whole network, which are always open, so only f⁻¹({on}) needs checking.'
    ],
    solution: `The open sets are ${opensTxt}: ${n(cnt)} in all. ${missTxt}, so the largest open set missing ${X} is ${setTxt(U)}. Its complement ${setTxt(cl)} is the smallest closed set containing ${X}, so the closure of {${X}} has ${pl(cs, 'node')}. The preimage f⁻¹({on}) is ${setTxt(on)}, which ${cont ? 'is' : 'is not'} one of the open sets, and the preimages of ∅ and {on, off} are ∅ and the whole network. So f ${cont ? 'is continuous: enter 1' : 'is not continuous: enter 0'}.`,
    guidance: [
     { prompt: `List ∅ and every union of the basic sets ${basisTxt}. How many different open sets are there?`, answer: [cnt], explanation: `The open sets are ${opensTxt}: ${n(cnt)} different sets.` },
     { prompt: `Which open sets do not contain ${X}? How many nodes are in their union, the largest open set that misses ${X}?`, answer: [pc(U)], explanation: `${missTxt}. Their union is ${setTxt(U)}, with ${pl(pc(U), 'node')}.` },
     { prompt: `The closure of {${X}} is the complement of ${setTxt(U)}. How many nodes does it have?`, answer: [cs], explanation: `The complement of ${setTxt(U)} is ${setTxt(cl)}. It is closed, because its complement is open, and no smaller closed set contains ${X}.` },
     { prompt: `The preimage f⁻¹({on}) is ${setTxt(on)}. Enter 1 if it is one of the open sets, so that f is continuous, or 0 if it is not.`, answer: [cont], explanation: `${setTxt(on)} ${cont ? 'is' : 'is not'} in the list of open sets, so f ${cont ? 'is' : 'is not'} continuous.` }
    ] };
  }
 },
 /* A union of 4–6 intervals and single points with at least one join; a line with k points removed; a plane with m
    circles removed. Not the worked example. */
 q12: {
  canonical: { pieces: [[1, 3, 1, 1], [3, 5, 0, 0], [6, 7, 1, 0], [7, 9, 1, 1], [10, 12, 0, 0], [12, 13, 0, 1]], k: 4, m: 2 },
  draw: R => {
   for (let i = 0; i < 1000; i++) {
    const pieces = drawPieces(R, R.int(4, 6)), u = unionInfo(pieces);
    if (u.joins < 1 || u.comps < 2) continue;
    const p = { pieces, k: R.int(1, 9), m: R.int(1, 6) };
    if (!same(p.pieces, [[1, 3, 1, 1], [3, 5, 0, 0], [6, 7, 1, 0], [7, 9, 1, 1], [10, 12, 0, 0], [12, 13, 0, 1]])) return p;
   }
   return { pieces: [[1, 3, 1, 1], [3, 5, 0, 0], [6, 7, 1, 0], [7, 9, 1, 1], [10, 12, 0, 0], [12, 13, 0, 1]], k: 4, m: 2 };
  },
  build: ({ pieces, k, m }) => {
   const u = unionInfo(pieces), P = pieces.length;
   return {
    prompt: `The Cable Works lays a test cable along the set S = ${u.S} on a straight bench, measured in metres. Enter the number of components of S. Then enter the number of components of the real line (the full number line, running for ever both ways) with ${pl(k, 'point')} removed, and of the flat plane with ${pl(m, 'circle')} removed${m === 1 ? '' : ', where the circles lie side by side: none touches, crosses or lies inside another'}.`,
    answer: [u.comps, k + 1, m + 1],
    hints: [
     'A component is a largest connected piece. On the line the connected sets are the intervals and single points, so two neighbouring pieces of S join into one exactly when they share an end point that belongs to at least one of them.',
     'Each point removed from the line cuts one piece into two. Each circle removed from the plane cuts off one more region, its inside, from the region outside.'
    ],
    solution: `${u.joinTxt}${u.apartTxt} So the ${n(P)} pieces of S make ${n(P)} − ${n(u.joins)} = ${pl(u.comps, 'component')}. The number line with ${pl(k, 'point')} removed falls into ${n(k + 1)} open pieces, because each removed point splits one piece into two. The plane with ${pl(m, 'circle')} removed falls into ${n(m + 1)} regions: the inside of each circle, and the one region outside them all.`,
    guidance: [
     { prompt: `Which neighbouring pieces of S share an end point that belongs to at least one of them? How many such joins are there?`, answer: [u.joins], explanation: `${u.joinTxt}${u.apartTxt}` },
     { prompt: `S is written as ${n(P)} pieces. How many components are left after the joins?`, answer: [u.comps], explanation: `Each join turns two pieces into one: ${n(P)} − ${n(u.joins)} = ${n(u.comps)}.` },
     { prompt: `How many pieces does the number line fall into when ${pl(k, 'point is', 'points are')} removed?`, answer: [k + 1], explanation: `Each removed point splits one piece into two, so ${pl(k, 'point')} leave ${n(k)} + 1 = ${n(k + 1)} pieces.` },
     { prompt: `How many regions does the plane fall into when ${pl(m, 'circle is', 'circles are')} removed${m === 1 ? '' : ', side by side'}?`, answer: [m + 1], explanation: `Each circle cuts off its own inside, and the outside is one more region: ${n(m)} + 1 = ${n(m + 1)}.` }
    ] };
  }
 },
 /* A stencil letter and one marked point on it (L a letter with marked points, p an index into its list of point
    descriptions). Not the worked example (T at its junction). */
 q13: {
  canonical: { L: 'R', p: 0 },
  draw: R => {
   const keys = Object.keys(LETTERS).filter(L => LETTERS[L].pts);
   for (let i = 0; i < 1000; i++) { const L = R.pick(keys), p = R.int(0, LETTERS[L].pts.length - 1); if (!(L === 'R' && p === 0) && !(L === 'T' && p === 0)) return { L, p }; }
   return { L: 'R', p: 0 };
  },
  build: ({ L, p }) => {
   const g = LETTERS[L], pt = g.pts[p], pieces = piecesAfter(L, pt), s = shapeOf(L), deg = pt[1] === 'e' ? 2 : degrees(g)[pt[1]];
   const cut = pieces === 1 ? `the cable stays in one piece, so it is not a cut point` : `the cable falls into ${n(pieces)} pieces, so it is a cut point`;
   return {
    prompt: `Mira bends a cable into the letter ${L} of the lab’s stencil font, which is drawn in thin strokes: ${g.d}. She snips out one single point, ${pt[0]}. Enter the number of pieces the cable falls into. Then enter the number of end points the whole letter had before the snip.`,
    answer: [pieces, s.ends],
    hints: [
     'Look at the strokes that run into the snipped point. Each one is cut off there, but strokes that are still joined some other way, round a loop, stay in the same piece.',
     'An end point is a tip where a stroke stops and nothing carries on. Corners and the points where strokes meet are not end points.'
    ],
    solution: `${pl(deg, 'stroke runs', 'strokes run')} into ${pt[0]}. With that point removed, ${cut}. Counting the tips where a stroke stops, the whole letter ${L} had ${pl(s.ends, 'end point')} before the snip.`,
    guidance: [
     { prompt: `How many strokes run into ${pt[0]}? (A point in the middle of a stroke has 2: one on each side.)`, answer: [deg], explanation: `${pl(deg, 'stroke runs', 'strokes run')} into that point. Each is cut off there, but some may still be joined further away.` },
     { prompt: `After the snip, how many pieces is the cable in?`, answer: [pieces], explanation: `With ${pt[0]} removed, ${cut}.` },
     { prompt: `How many end points does the whole letter ${L} have?`, answer: [s.ends], explanation: `Counting the tips where a stroke stops, the letter ${L} has ${pl(s.ends, 'end point')}.` }
    ] };
  }
 },
 /* A word of stencil letters and a target letter (an index into the word list and a letter of the font). */
 q14: {
  canonical: { w: 'RELAY', T: 'T' },
  draw: R => {
   const all = Object.keys(LETTERS);
   for (let i = 0; i < 1000; i++) { const w = R.pick(WORDS), T = R.next() < 0.75 ? R.pick(w.split('')) : R.pick(all); if (!(w === 'RELAY' && T === 'T') && !(w === 'HOOK' && T === 'O')) return { w, T }; }
   return { w: 'RELAY', T: 'T' };
  },
  build: ({ w, T }) => {
   const letters = w.split(''), distinct = [...new Set(letters)], s = shapeOf(T), sig = sigOf(T);
   const match = letters.filter(L => sigOf(L) === sig), count = match.length;
   const descs = [...distinct, ...(distinct.includes(T) ? [] : [T])].map(L => `${L} is ${LETTERS[L].d}`).join('; ');
   const per = distinct.map(L => `${L} has ${shapeTxt(L)}`).join('; ');
   const matchTxt = count === 0 ? `none of the letters of ${w} matches` : count === 1 ? `the only letter that matches is ${match[0]}` : `the letters that match are ${andList(match)}`;
   return {
    prompt: `A cable label spells ${w} in the lab’s stencil font, which is drawn in thin strokes: ${descs}. Enter how many of the letters of ${w} are homeomorphic to the letter ${T}. Count a letter each time it appears.`,
    answer: [count],
    hints: [
     'Stretching and bending never change the number of end points, the number of branch points (where three or more strokes meet) with how many strokes meet at each, or the number of holes (gaps closed off all round by a loop of strokes, like the inside of O). A corner is not a branch point.',
     'Work out those numbers for the target letter first, then for each letter of the word. For the letters of this font, two letters with the same end points, branch points and holes are homeomorphic, and two that differ in any of them are not.'
    ],
    solution: `${T} has ${shapeTxt(T)}. In ${w}: ${per}. So ${matchTxt}, and the count is ${n(count)}.`,
    guidance: [
     { prompt: `How many end points does the letter ${T} have?`, answer: [s.ends], explanation: `${T} is ${LETTERS[T].d}. It has ${pl(s.ends, 'end point')}.` },
     { prompt: `How many branch points, where three or more strokes meet, does ${T} have?`, answer: [s.branch.length], explanation: `${T} has ${branchTxt(s)}.` },
     { prompt: `How many holes does ${T} enclose?`, answer: [s.holes], explanation: `${T} has ${pl(s.holes, 'hole')}.` },
     { prompt: `Compare each letter of ${w} with ${T}. How many letters, counting repeats, have the same end points, branch points and holes?`, answer: [count], explanation: `${per}. So ${matchTxt}.` }
    ] };
  }
 },
 /* A cable [a, b] covered by open clamps of length L (L10 = 10L), at least 3 clamps; a set S from SETS (kind is an
    index into that list of descriptions, c and d its numbers). Not the worked example ([0, 5] with 2 m clamps). */
 q15: {
  canonical: { a: 2, b: 11, L10: 15, kind: 7, c: 0, d: 1 },
  draw: R => {
   for (let i = 0; i < 1000; i++) {
    const a = R.int(-5, 5), L10 = R.pick([15, 20, 25, 30, 40]), D = R.int(4, 24), kind = R.int(0, SETS.length - 1), c = R.int(-6, 4), d = c + R.int(1, 5);
    if (Math.floor(10 * D / L10) + 1 < 3 || (a === 0 && D === 5 && L10 === 20)) continue;
    const p = { a, b: a + D, L10, kind, c, d };
    if (!same(p, { a: 2, b: 11, L10: 15, kind: 7, c: 0, d: 1 })) return p;
   }
   return { a: 2, b: 11, L10: 15, kind: 7, c: 0, d: 1 };
  },
  build: ({ a, b, L10, kind, c, d }) => {
   const C = coverInfo(a, b, L10), S = SETS[kind], comp = S.closed && S.bounded ? 1 : 0;
   return {
    prompt: `A straight cable on the bench runs from x = ${n(a)} to x = ${n(b)}, measured in metres: it is the closed interval [${n(a)}, ${n(b)}]. Each clamp grips an open interval ${n(C.L)} metres long, wherever its centre is put, and it may reach past either end of the cable. Enter the fewest clamps whose open intervals together cover the whole cable. Then enter 1 if the set S = ${S.t(c, d)} is compact, or 0 if it is not.`,
    answer: [C.k, comp],
    hints: [
     'Open intervals leave out their end points, so neighbouring clamps must overlap: the clamps cover the cable only if their total length is more than its length, not just equal to it.',
     'On the line a set is compact exactly when it is closed (it contains all its boundary points) and bounded (it fits inside some interval [−r, r]).'
    ],
    solution: `The cable is ${n(b)} − ${par(a)} = ${n(C.D)} metres long. ${C.txt}. So ${n(C.k)} overlapping clamps are the fewest that cover it. ${S.why(c, d)} So S ${comp ? 'is' : 'is not'} compact: enter ${comp}.`,
    guidance: [
     { prompt: `How long is the cable [${n(a)}, ${n(b)}], in metres?`, answer: [C.D], explanation: `${n(b)} − ${par(a)} = ${n(C.D)} metres.` },
     { prompt: `What is the fewest clamps of ${n(C.L)} metres whose total length is more than ${n(C.D)} metres?`, answer: [C.k], explanation: `${C.txt}.` },
     { prompt: `Is S = ${S.t(c, d)} closed? Enter 1 for yes or 0 for no.`, answer: [S.closed], explanation: S.why(c, d) },
     { prompt: `Is S bounded? Enter 1 for yes or 0 for no.`, answer: [S.bounded], explanation: `${S.bounded ? 'S fits inside an interval [−r, r] once r is large enough, so it is bounded' : 'S runs on for ever, so no interval [−r, r] holds it: it is not bounded'}. Compact means closed and bounded, so S ${comp ? 'is' : 'is not'} compact.` }
    ] };
  }
 },
 /* f is a cubic s(x³ − 3m²x) + c or a quadratic s(x − h)² + c on [a, b], a from −4 to 0 and b from 1 to 4. */
 q16: {
  canonical: { f: { kind: 'c', s: 1, m: 2, c: 5 }, a: -3, b: 3 },
  draw: R => {
   for (let i = 0; i < 1000; i++) { const p = { f: drawF(R), a: R.int(-4, 0), b: R.int(1, 4) }; if (p.b - p.a >= 2 && !same(p, { f: { kind: 'c', s: 1, m: 2, c: 5 }, a: -3, b: 3 })) return p; }
   return { f: { kind: 'c', s: 1, m: 2, c: 5 }, a: -3, b: 3 };
  },
  build: ({ f, a, b }) => {
   const X = extremes(f, a, b);
   return {
    prompt: `A strain gauge slides along a cable and reads f(x) = ${X.F.text} at position x, for ${n(a)} ≤ x ≤ ${n(b)}. Enter the largest value of f on [${n(a)}, ${n(b)}], then the smallest.`,
    answer: [X.max, X.min],
    hints: [
     'f is continuous and [a, b] is compact, so by the extreme value theorem f reaches a largest and a smallest value there. f is a polynomial, so it has a derivative everywhere, and each extreme is at an end point or at a critical point strictly inside, where f′(x) = 0.',
     'Work out f at both end points and at every critical point strictly between them, then compare the values.'
    ],
    solution: `f′(x) = ${X.F.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} The values to compare are ${X.valTxt}. The largest is ${n(X.max)} and the smallest is ${n(X.min)}.`,
    guidance: [
     { prompt: `What is f(${n(a)}), the value at the left end?`, answer: [X.fa], explanation: `f(${n(a)}) = ${n(X.fa)}.` },
     { prompt: `What is f(${n(b)}), the value at the right end?`, answer: [X.fb], explanation: `f(${n(b)}) = ${n(X.fb)}.` },
     { prompt: `f′(x) = ${X.F.dtext}. How many critical points, where f′(x) = 0, lie strictly between ${n(a)} and ${n(b)}?`, answer: [X.inside.length], explanation: `f′(x) = 0 at ${X.critTxt}. ${X.insideTxt}` },
     { prompt: `Compare ${X.valTxt}. What is the largest value?`, answer: [X.max], explanation: `The largest of these is ${n(X.max)}; the smallest is ${n(X.min)}.` }
    ] };
  }
 },
 /* The chapter review: a union as in q12, a cover as in q15 and a largest value as in q16, on the same cable [a, b]. */
 q17: {
  canonical: { pieces: [[0, 2, 1, 0], [2, 3, 1, 1], [4, 6, 0, 0], [6, 8, 0, 1], [9, 9, 1, 1]], a: -2, b: 3, L10: 15, f: { kind: 'q', s: -2, h: 1, c: 7 } },
  draw: R => {
   for (let i = 0; i < 1000; i++) {
    const pieces = drawPieces(R, R.int(4, 5)), u = unionInfo(pieces); if (u.joins < 1 || u.comps < 2) continue;
    const a = R.int(-4, 0), b = R.int(1, 4), L10 = R.pick([15, 20, 25]); if (b - a < 2) continue;
    const p = { pieces, a, b, L10, f: drawF(R) };
    if (!same(p.pieces, [[0, 2, 1, 0], [2, 3, 1, 1], [4, 6, 0, 0], [6, 8, 0, 1], [9, 9, 1, 1]])) return p;
   }
   return { pieces: [[0, 2, 1, 0], [2, 3, 1, 1], [4, 6, 0, 0], [6, 8, 0, 1], [9, 9, 1, 1]], a: -2, b: 3, L10: 15, f: { kind: 'q', s: -2, h: 1, c: 7 } };
  },
  build: ({ pieces, a, b, L10, f }) => {
   const u = unionInfo(pieces), C = coverInfo(a, b, L10), X = extremes(f, a, b);
   return {
    prompt: `Final check at the cable loom. A test cable lies along S = ${u.S} on the bench, in metres: enter the number of components of S. Next, a straight cable runs from x = ${n(a)} to x = ${n(b)}: enter the fewest clamps, each gripping an open interval ${n(C.L)} metres long (a clamp may reach past either end of the cable), that cover the closed interval [${n(a)}, ${n(b)}]. Finally, a strain gauge sliding along it reads f(x) = ${X.F.text} for ${n(a)} ≤ x ≤ ${n(b)}: enter the largest value of f there.`,
    answer: [u.comps, C.k, X.max],
    hints: [
     'Two neighbouring pieces of S join into one component exactly when they share an end point that belongs to at least one of them.',
     'Open clamps must overlap, so their total length has to be more than the length of the cable, not just equal to it.',
     'By the extreme value theorem the largest value of f is reached somewhere. f is a polynomial, with a derivative everywhere, so that is at an end point or at a critical point strictly inside, where f′(x) = 0.'
    ],
    solution: `${u.joinTxt}${u.apartTxt} So S has ${n(pieces.length)} − ${n(u.joins)} = ${pl(u.comps, 'component')}. The cable is ${n(C.D)} metres long; ${C.txt}, so ${n(C.k)} clamps are needed. Finally f′(x) = ${X.F.dtext}, which is 0 at ${X.critTxt}. ${X.insideTxt} Comparing ${X.valTxt}, the largest value is ${n(X.max)}.`,
    guidance: [
     { prompt: `How many components does S = ${u.S} have?`, answer: [u.comps], explanation: `${u.joinTxt}${u.apartTxt} That leaves ${n(u.comps)}.` },
     { prompt: `How many open clamps of ${n(C.L)} metres are needed to cover [${n(a)}, ${n(b)}]?`, answer: [C.k], explanation: `The cable is ${n(C.D)} metres long; ${C.txt}.` },
     { prompt: `f′(x) = ${X.F.dtext}. How many critical points lie strictly between ${n(a)} and ${n(b)}?`, answer: [X.inside.length], explanation: `f′(x) = 0 at ${X.critTxt}. ${X.insideTxt}` },
     { prompt: `Compare ${X.valTxt}. What is the largest value of f on the cable?`, answer: [X.max], explanation: `The largest of these values is ${n(X.max)}.` }
    ] };
  }
 },
 /* A square's 4 edges, each [letter index, +1 clockwise / −1 anticlockwise]: two pairs, or one pair and two single
    letters; letters are named a, b, c in order of first appearance. Not the worked example (a a⁻¹ b b⁻¹). */
 q18: {
  canonical: { w: [[0, 1], [1, 1], [0, -1], [1, -1]] },
  draw: R => {
   const PAIRS = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]], ONE = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
   for (let i = 0; i < 1000; i++) {
    const groups = R.bool() ? R.pick(PAIRS) : (() => { const pr = R.pick(ONE); return [pr, ...[0, 1, 2, 3].filter(x => !pr.includes(x)).map(x => [x])]; })();
    const slot = Array(4); groups.forEach((g, gi) => g.forEach(pos => { slot[pos] = gi; }));
    const order = []; slot.forEach(g => { if (!order.includes(g)) order.push(g); });
    const w = slot.map(g => [order.indexOf(g), R.bool() ? 1 : -1]);
    if (!same(w, [[0, 1], [1, 1], [0, -1], [1, -1]]) && !same(w, [[0, 1], [0, -1], [1, 1], [1, -1]])) return { w };
   }
   return { w: [[0, 1], [1, 1], [0, -1], [1, -1]] };
  },
  build: ({ w }) => {
   const word = w.map(lab).join(' '), g = glue(w), pairs = w.length - g.E;
   return {
    prompt: `A square hull panel has its 4 edges labelled with arrows. Read clockwise from the top-left corner (the top edge, then the right, the bottom and the left), the labels are ${word}. A letter alone means that edge’s arrow points clockwise round the square; a letter with ⁻¹ means it points anticlockwise. The Fabric Bay sews together each pair of edges that share a letter, arrow on arrow, and leaves an edge whose letter appears only once unsewn. Two edges sewn together count as one edge. Enter how many distinct points the 4 corners become, then how many distinct edges are left.`,
    answer: [g.V, g.E],
    hints: [
     'Sewing two edges arrow on arrow joins the tail of one arrow to the tail of the other, and the head to the head. Write down which corners each sewing joins.',
     'Corners joined through any chain of sewings become one point. Each letter gives one edge of the finished panel, whether it was sewn or not.'
    ],
    solution: `${g.sewn} The corners fall into ${pl(g.V, 'group')}: ${g.groupTxt}, so they become ${pl(g.V, 'point')}. The word uses ${pl(g.E, 'letter')}, so ${pl(g.E, 'edge is', 'edges are')} left${pairs === 2 ? ' (both pairs were sewn)' : ' (one pair was sewn and the other two edges stay free)'}.`,
    guidance: [
     { prompt: `Follow the sewings. How many of the 4 corners end up as the same point as the top-left corner, counting the top-left corner itself?`, answer: [g.tl], explanation: `${g.sewn} The top-left corner's group has ${pl(g.tl, 'corner')}.` },
     { prompt: `How many distinct points do the 4 corners become?`, answer: [g.V], explanation: `The groups are ${g.groupTxt}: ${pl(g.V, 'point')}.` },
     { prompt: `How many different letters does the word ${word} use?`, answer: [g.E], explanation: `Each letter is one edge after sewing, so ${pl(g.E, 'edge is', 'edges are')} left.` }
    ] };
  }
 },
 /* A surface from SURF (base is an index into that list of descriptions) with k extra holes, 0–5, only when the
    surface already has an edge. Not the worked example (an annulus with 1 hole). */
 q19: {
  canonical: { base: 3, k: 2 },
  draw: R => {
   for (let i = 0; i < 1000; i++) { const base = R.int(0, SURF.length - 1), k = SURF[base].b ? R.int(0, 5) : 0; if (!(base === 3 && k === 2) && !(base === 1 && k === 1)) return { base, k }; }
   return { base: 3, k: 2 };
  },
  build: ({ base, k }) => {
   const S = SURF[base], b = S.b + k;
   const holes = k ? `, and then cuts ${pl(k, 'small round hole')} in it, away from its edges and from each other` : '';
   const bTxt = S.b ? `The ${S.nm} has ${pl(S.b, 'boundary circle')}: ${S.bw}.` : `The ${S.nm} has no boundary circles: ${S.bw}.`;
   return {
    prompt: `The Fabric Bay makes ${S.d}${holes}. Enter the number of boundary circles of the finished surface, then 1 if it is orientable or 0 if it is not.`,
    answer: [b, S.o],
    hints: [
     'A boundary circle is a loop of edge where the surface stops. Count those of the starting surface, then add one for each hole cut out of it.',
     'A surface is orientable when it contains no Möbius strip. Cutting a small hole never removes a Möbius strip and never creates one.'
    ],
    solution: `${bTxt}${k ? ` Each of the ${pl(k, 'hole')} adds one more, so there are ${n(S.b)} + ${n(k)} = ${n(b)}.` : ''} ${S.ow}: enter ${S.o}.`,
    guidance: [
     { prompt: `Before any holes are cut, how many boundary circles does the starting surface have?`, answer: [S.b], explanation: bTxt },
     { prompt: `How many boundary circles does the finished surface have?`, answer: [b], explanation: k ? `Each hole adds one: ${n(S.b)} + ${n(k)} = ${n(b)}.` : `No holes are cut, so it keeps ${pl(b, 'boundary circle')}.` },
     { prompt: `Does the surface contain a Möbius strip? Enter 0 if it does (not orientable) or 1 if it does not (orientable).`, answer: [S.o], explanation: `${S.ow}.` }
    ] };
  }
 },
 /* A prism or pyramid frame (a-sided, 3–9, never the cube of the worked example) or an a × b grid panel left flat, sewn
    into a cylinder or sewn into a torus (a, b from 2 to 8, but at least 3 in each direction that is sewn, so no two edges join the same two corners). */
 q20: {
  canonical: { kind: 'torus', a: 3, b: 4 },
  draw: R => {
   for (let i = 0; i < 1000; i++) {
    const kind = R.pick(['prism', 'pyramid', 'torus', 'flat', 'cyl']), grid = !['prism', 'pyramid'].includes(kind);
    const p = grid ? { kind, a: R.int(kind === 'flat' ? 2 : 3, 8), b: R.int(kind === 'torus' ? 3 : 2, 8) } : { kind, a: R.int(3, 9), b: 0 };
    if (!(kind === 'prism' && p.a === 4) && !same(p, { kind: 'torus', a: 3, b: 4 })) return p;
   }
   return { kind: 'torus', a: 3, b: 4 };
  },
  build: p => {
   const c = cells(p), chi = c.V - c.E + c.F, grid = !['prism', 'pyramid'].includes(p.kind);
   return {
    prompt: `${grid ? 'The Fabric Bay takes' : 'A dome frame is'} ${c.what}. Count this cell division: enter the number of vertices V, the number of edges E and the number of faces F, then the Euler characteristic V − E + F.`,
    answer: [c.V, c.E, c.F, chi],
    hints: [
     'Count each kind of piece once. Points or lines that are sewn together count as one.',
     grid ? 'Start from the flat grid: a grid of a columns and b rows of squares has (a + 1) × (b + 1) grid points. Each sewing merges a whole column or a whole row of points, and of edges, with another.' : 'Count the corners, struts and panels on each end or the base first, then the ones that run between them.'
    ],
    solution: `${c.hv} ${c.he} ${c.hf} So V − E + F = ${n(c.V)} − ${n(c.E)} + ${n(c.F)} = ${n(chi)}.`,
    guidance: [
     { prompt: `How many vertices V does the cell division have?`, answer: [c.V], explanation: c.hv },
     { prompt: `How many edges E does it have?`, answer: [c.E], explanation: c.he },
     { prompt: `How many faces F does it have?`, answer: [c.F], explanation: `${c.hf} So V − E + F = ${n(c.V)} − ${n(c.E)} + ${n(c.F)} = ${n(chi)}.` }
    ] };
  }
 }
});
})();
