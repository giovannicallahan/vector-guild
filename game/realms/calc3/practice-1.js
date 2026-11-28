/* Calculus 3: many variables practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p1.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A rounded value written with all its decimal places: dpl(0.8, 2) → '0.80'. */
const dpl = (x, k) => x.toFixed(k).replace('-', '−');
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
/* ⟨3, −1, 2⟩ and (3, −1, 2) */
const V = v => `⟨${v.map(n).join(', ')}⟩`;
const P3 = v => `(${v.map(n).join(', ')})`;
/* A signed number inside a sum: '+ 3' or '− 3'; a sum written out: '6 − 6 + 4'. */
const pm = x => x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`;
const sumText = list => list.map((x, i) => i ? pm(x) : n(x)).join(' ');
/* '3x', '−x' for the first place; '+ 2y', '− z' for later places. */
const lead = (c, x) => `${c < 0 ? '−' : ''}${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${x}`;
const term = (c, x) => `${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${x}`;
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const sq = v => dot(v, v);
const squares = v => v.map(x => `${par(x)}²`).join(' + ');
const squaresVal = v => v.map(x => n(x * x)).join(' + ');
const rootText = s => { const r = Math.round(Math.sqrt(s)); return r * r === s ? `√${n(s)} = ${n(r)}` : `√${n(s)}`; };
const isWhole = s => { const r = Math.round(Math.sqrt(s)); return r * r === s; };
const len = v => Math.round(Math.sqrt(sq(v)));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? n(p / g) : `${n(p / g)}/${n(q / g)}`; };
/* Whole-number lengths: [a, b, c, length] with a² + b² + c² = length². */
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 4, 4, 6], [2, 10, 11, 15], [2, 5, 14, 15], [1, 12, 12, 17], [8, 9, 12, 17]];
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
/* A random arrangement of one of the quadruples lo..hi (0-based), with random signs: { v, len }. */
const wv = (R, lo, hi) => { const q = QUADS[R.int(lo, hi)], p = R.pick(PERMS); return { v: p.map(i => (R.bool() ? -1 : 1) * q[i]), len: q[3] }; };
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
/* True when b is a positive multiple of a (the two moves point the same way). */
const sameWay = (a, b) => a[1] * b[2] - a[2] * b[1] === 0 && a[2] * b[0] - a[0] * b[2] === 0 && a[0] * b[1] - a[1] * b[0] === 0 && a[0] * b[0] + a[1] * b[1] + a[2] * b[2] > 0;
const rv = (R, lo, hi) => [R.int(lo, hi), R.int(lo, hi), R.int(lo, hi)];
/* True when x × 10^k lies within 1e-6 of a rounding tie: such draws are filtered out. */
const nearTie = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 1e-6; };
const round = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const cf = a => a === 1 ? '' : a === -1 ? '−' : n(a);
/* A combination a·u + b·v written as '2u − v', '−u + 3v'. */
const combo = (a, b) => `${cf(a)}u ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : n(Math.abs(b))}v`;
const scaled = (k, x) => k === 1 ? x : k === -1 ? `−${x}` : `${n(k)}${x}`;
/* Coordinate changes written out: 'x: 8 − 2 = 6, y: 1 − (−1) = 2, z: 6 − 3 = 3' for the move from p to q. */
const chg = (p, q) => ['x', 'y', 'z'].map((c, i) => `${c}: ${n(q[i])} − ${par(p[i])} = ${n(q[i] - p[i])}`).join(', ');
/* A length with its unit: '1 metre', '6 metres'. */
const mt = x => `${n(x)} ${Math.abs(x) === 1 ? 'metre' : 'metres'}`;
const times = (k, v) => v.map(x => k * x);
const add3 = (u, v) => u.map((x, i) => x + v[i]);
/* Draws a combination a·u + b·v whose length is whole (3 to 17); gives {u, v, a, b} and the total move. */
const comboParams = (R, lim, aList, bList) => { let p, t; do { p = { u: rv(R, -lim, lim), v: rv(R, -lim, lim), a: R.pick(aList), b: R.pick(bList) };
 t = add3(times(p.a, p.u), times(p.b, p.v)); } while (sq(p.u) === 0 || sq(p.v) === 0 || same(p.u, p.v) || !isWhole(sq(t)) || len(t) < 3 || len(t) > 17); return p; };

/* ---- q01 Points in space and the distance between them [2.2] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The drone survey run',
 brief: 'A survey drone must fly past three beacons in turn, and Mira needs the length of the first leg and of the whole run to plan its battery.',
 labels: ['first leg (m)', 'total distance (m)'], tolerance: 0.01,
 gl: [['first leg (m)'], ['second leg (m)'], ['total distance (m)']]
}, {
 /* Both legs have whole lengths (QUADS 1 to 8, any order and signs). The drone does not come straight back, the legs never point the same way (A to C would then equal the total), and a draw is never the
    worked example of q01, (1, 2, 0) to (3, 4, 1). */
 canonical: { a: [1, -2, 0], d1: [2, 3, 6], d2: [4, -4, 7] },
 draw: R => { let p; do { p = { a: rv(R, -6, 6), d1: wv(R, 0, 7).v, d2: wv(R, 0, 7).v }; } while (same(p.d2, p.d1.map(x => -x)) || sameWay(p.d1, p.d2) || (same(p.a, [1, 2, 0]) && same(p.d1, [2, 2, 1]))); return p; },
 build: ({ a, d1, d2 }) => { const b = add3(a, d1), c = add3(b, d2), s1 = sq(d1), s2 = sq(d2), L1 = len(d1), L2 = len(d2), T = L1 + L2; return {
  prompt: `A survey drone flies in a straight line from beacon A to beacon B, and then in a straight line on to beacon C. Measured in metres from the deck’s corner post, with x east, y north and z up, A is at ${P3(a)}, B is at ${P3(b)} and C is at ${P3(c)}. Enter the length of the first leg, A to B, then the total distance the drone flies, both in metres.`,
  answer: [L1, T],
  hints: ['For one leg, subtract coordinate by coordinate (end minus start), square the three changes, add the squares and take the square root.', 'The drone flies both legs one after the other, so the total is the length of the first leg plus the length of the second: it is not the straight distance from A to C.'],
  solution: `First leg: ${chg(a, b)}. Squared and added: ${squaresVal(d1)} = ${n(s1)}, so A to B is ${rootText(s1)} metres. Second leg: ${chg(b, c)}. Squared and added: ${squaresVal(d2)} = ${n(s2)}, so B to C is ${rootText(s2)} metres. The drone flies ${n(L1)} + ${n(L2)} = ${n(T)} metres in all.`,
  guidance: [
   { prompt: `Find the length of the first leg: take B minus A along each axis, square the changes, add them and take the square root. How long is A to B?`, answer: [L1], explanation: `${chg(a, b)}. Squared and added: ${squares(d1)} = ${squaresVal(d1)} = ${n(s1)}, and ${rootText(s1)} metres.` },
   { prompt: `Do the same for the second leg: C minus B along each axis, squares added, square root. How long is B to C?`, answer: [L2], explanation: `${chg(b, c)}. Squared and added: ${squares(d2)} = ${squaresVal(d2)} = ${n(s2)}, and ${rootText(s2)} metres.` },
   { prompt: `The drone flies both legs, ${n(L1)} metres and ${n(L2)} metres. What is the total distance flown?`, answer: [T], explanation: `${n(L1)} + ${n(L2)} = ${n(T)} metres. The straight line from A to C would be shorter, but the drone does not fly it.` }
  ] }; }
});

/* Ground triples (dx, dy, h) paired with a height triple (h, dz, D): the ground distance h and the cable length D are both whole. */
const HZ = [[3, 4, 5, 12, 13], [6, 8, 10, 24, 26], [9, 12, 15, 8, 17], [9, 12, 15, 20, 25], [12, 16, 20, 15, 25], [12, 16, 20, 21, 29]];
mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Cable car over the rim',
 brief: 'A cable-car line is planned from the crater rim down to the survey deck, and the crew need the ground distance it covers and the cable to order.',
 labels: ['ground distance (m)', 'cable length (m)'], tolerance: 0.01,
 gl: [['ground distance (m)'], ['height difference (m)'], ['cable length (m)']]
}, {
 /* The ground changes (dx, dy) and the height change dz come from HZ, any order and signs; both stations are at a height of 0 m or more. */
 canonical: { p: [-4, 3], dx: 4, dy: -3, z1: 30, dz: -12 },
 draw: R => { const t = R.pick(HZ), sw = R.bool(); let dz = (R.bool() ? -1 : 1) * t[3]; const z1 = R.int(0, 40); if (z1 + dz < 0) dz = -dz;
  return { p: [R.int(-10, 10), R.int(-10, 10)], dx: (R.bool() ? -1 : 1) * (sw ? t[1] : t[0]), dy: (R.bool() ? -1 : 1) * (sw ? t[0] : t[1]), z1, dz }; },
 build: ({ p, dx, dy, z1, dz }) => { const q = [p[0] + dx, p[1] + dy], z2 = z1 + dz, sg = dx * dx + dy * dy, h = Math.round(Math.sqrt(sg)), H = Math.abs(dz), sD = h * h + dz * dz, D = Math.round(Math.sqrt(sD)); return {
  prompt: `A cable-car line is planned between the crater rim and the survey deck. On the survey map, measured in metres from the deck’s corner post with x east and y north, the rim station is at (${n(p[0])}, ${n(p[1])}) and stands ${mt(z1)} above the lowest ground; the deck station is at (${n(q[0])}, ${n(q[1])}) and stands ${mt(z2)} above the lowest ground. Enter the distance between the two stations across the ground (use x and y only, ignore height), then the length of the straight cable between them, both in metres.`,
  answer: [h, D],
  hints: ['Across the ground only x and y count: take the change in each, square both, add them and take the square root.', 'The ground distance and the difference in height are the two shorter sides of a right-angled triangle, and the cable is its long side. Square the two short sides, add, and take the square root.'],
  solution: `Across the ground the changes are x: ${n(q[0])} − ${par(p[0])} = ${n(dx)} and y: ${n(q[1])} − ${par(p[1])} = ${n(dy)}, so the ground distance is √(${squaresVal([dx, dy, 0]).replace(' + 0', '')}) = ${rootText(sg)} metres. The stations differ in height by ${n(Math.max(z1, z2))} − ${n(Math.min(z1, z2))} = ${mt(H)}, so the cable is √(${n(h * h)} + ${n(H * H)}) = ${rootText(sD)} metres.`,
  guidance: [
   { prompt: `Across the ground only x and y count. Square the changes ${n(dx)} and ${n(dy)}, add them and take the square root. What is the ground distance?`, answer: [h], explanation: `${par(dx)}² + ${par(dy)}² = ${n(dx * dx)} + ${n(dy * dy)} = ${n(sg)}, and ${rootText(sg)} metres.` },
   { prompt: `The rim station is ${mt(z1)} up and the deck station is ${mt(z2)} up. By how many metres do their heights differ?`, answer: [H], explanation: `${n(Math.max(z1, z2))} − ${n(Math.min(z1, z2))} = ${n(H)} metres.` },
   { prompt: `The cable is the long side of a right-angled triangle whose other sides are the ground distance ${n(h)} and the height difference ${n(H)}. How long is the cable?`, answer: [D], explanation: `${n(h)}² + ${n(H)}² = ${n(h * h)} + ${n(H * H)} = ${n(sD)}, and ${rootText(sD)} metres. This is the same distance formula as in three dimensions, done in two steps.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The unsurveyed beacon height',
 brief: 'One beacon went up before its height was logged, and Mira can find it from the measured cable and the other two coordinates.',
 labels: ['height above A (m)', 'height of B (m)'], tolerance: 0.01,
 gl: [['sum of squares'], ['height above A (m)'], ['height of B (m)']]
}, {
 /* The changes (dx, dy, dz) are an arrangement of one of the QUADS (any order, signs on x and y), with dz positive: B is higher than A. */
 canonical: { a: [2, -3, 1], dx: -3, dy: 2, dz: 6 },
 draw: R => { const w = wv(R, 0, 11).v; return { a: [R.int(-6, 6), R.int(-6, 6), R.int(-3, 6)], dx: w[0], dy: w[1], dz: Math.abs(w[2]) }; },
 build: ({ a, dx, dy, dz }) => { const b0 = a[0] + dx, b1 = a[1] + dy, z2 = a[2] + dz, sxy = dx * dx + dy * dy, D = len([dx, dy, dz]), D2 = D * D, rest = D2 - sxy; return {
  prompt: `Beacon A stands at ${P3(a)} and beacon B at x = ${n(b0)}, y = ${n(b1)}, all in metres from the deck’s corner post (z up). B’s height z was not logged, but B stands higher than A, and a taut straight cable from A to B measures ${n(D)} metres. Enter how many metres higher B is than A, then the height z of B in metres.`,
  answer: [dz, z2],
  hints: ['The distance formula says the cable length squared equals the three squared changes added. The changes in x and y are known, so the square of the change in z is what is left.', 'Take the square root of that leftover, using the positive root because B is higher than A, and add it to A’s height.'],
  solution: `The changes in x and y are ${n(b0)} − ${par(a[0])} = ${n(dx)} and ${n(b1)} − ${par(a[1])} = ${n(dy)}. The distance formula gives ${n(D)}² = ${n(dx * dx)} + ${n(dy * dy)} + (change in z)², so (change in z)² = ${n(D2)} − ${n(sxy)} = ${n(rest)}. B is higher, so the change in z is the positive root, ${rootText(rest)} ${dz === 1 ? 'metre' : 'metres'}. Then z = ${n(a[2])} + ${n(dz)} = ${mt(z2)}.`,
  guidance: [
   { prompt: `Square the known changes in x and y, ${n(dx)} and ${n(dy)}, and add them. What is the total?`, answer: [sxy], explanation: `${par(dx)}² + ${par(dy)}² = ${n(dx * dx)} + ${n(dy * dy)} = ${n(sxy)}.` },
   { prompt: `The cable length squared is ${n(D)}² = ${n(D2)}. Take away ${n(sxy)} to leave the square of the change in height, then take the positive square root (B is higher). How many metres higher is B?`, answer: [dz], explanation: `${n(D2)} − ${n(sxy)} = ${n(rest)}, and ${rootText(rest)}. The positive root is the right one because B is higher than A.` },
   { prompt: `A is at height ${n(a[2])} and B is ${mt(dz)} higher. What is the height z of B?`, answer: [z2], explanation: `${n(a[2])} + ${n(dz)} = ${mt(z2)}.` }
  ] }; }
});

/* ---- q02 Vectors: components, adding and scaling [2.1] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Two moves of the deck crane',
 brief: 'The deck crane makes every job from a hoist move and a swing move, and the operator wants one command that does a whole combination at once.',
 labels: ['x component', 'y component', 'z component'], tolerance: 0.01,
 gl: [['x', 'y', 'z'], ['x', 'y', 'z'], ['x component', 'y component', 'z component']]
}, {
 /* a·u + b·v with a in {−3, −2, −1, 2, 3} and b in {−2, 2, 3}, so a scalar of 1 is never written. Not the worked example of q02 (u + 3v). */
 canonical: { u: [2, -3, 1], v: [-1, 2, 4], a: -1, b: 2 },
 draw: R => { let p; do { p = { u: rv(R, -5, 5), v: rv(R, -5, 5), a: R.pick([-3, -2, -1, 2, 3]), b: R.pick([-2, 2, 3]) }; } while (sq(p.u) === 0 || sq(p.v) === 0 || same(p.u, p.v)); return p; },
 build: ({ u, v, a, b }) => { const A = times(a, u), B = times(b, v), C = add3(A, B), cs = combo(a, b), au = scaled(a, 'u'), bv = scaled(b, 'v'); return {
  prompt: `The deck crane moves its load in two basic moves: the hoist move u = ${V(u)} and the swing move v = ${V(v)}, in metres east, north and up. The operator wants a single move equal to ${cs}. Enter its three components: x, then y, then z.`,
  answer: C,
  hints: ['Scale each basic move first: multiply every component of u by the number in front of u, and every component of v by the number in front of v, signs included.', 'Then add the two scaled moves component by component: x with x, y with y and z with z.'],
  solution: `${au} = ${V(A)} and ${bv} = ${V(B)}. Adding component by component: ${cs} = ⟨${n(A[0])} ${pm(B[0])}, ${n(A[1])} ${pm(B[1])}, ${n(A[2])} ${pm(B[2])}⟩ = ${V(C)}.`,
  guidance: [
   { prompt: `Multiply every component of u = ${V(u)} by ${n(a)}. What is ${au}?`, answer: A, explanation: `${n(a)} × ${par(u[0])} = ${n(A[0])}, ${n(a)} × ${par(u[1])} = ${n(A[1])} and ${n(a)} × ${par(u[2])} = ${n(A[2])}, so ${au} = ${V(A)}.` },
   { prompt: `Multiply every component of v = ${V(v)} by ${n(b)}. What is ${bv}?`, answer: B, explanation: `${n(b)} × ${par(v[0])} = ${n(B[0])}, ${n(b)} × ${par(v[1])} = ${n(B[1])} and ${n(b)} × ${par(v[2])} = ${n(B[2])}, so ${bv} = ${V(B)}.` },
   { prompt: `Add ${V(A)} and ${V(B)} component by component. What is ${cs}?`, answer: C, explanation: `x: ${n(A[0])} ${pm(B[0])} = ${n(C[0])}, y: ${n(A[1])} ${pm(B[1])} = ${n(C[1])}, z: ${n(A[2])} ${pm(B[2])} = ${n(C[2])}.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'The rover’s walk plan',
 brief: 'A survey rover will repeat two kinds of leg from its starting point, and the crew need to know where it will stop.',
 labels: ['final x', 'final y', 'final z'], tolerance: 0.01,
 gl: [['x of the u legs', 'y of the u legs', 'z of the u legs'], ['x of the v legs', 'y of the v legs', 'z of the v legs'], ['final x', 'final y', 'final z']]
}, {
 /* a legs of u then b legs of v, both counts 2 to 4; the plan is a·u + b·v, added to the start. */
 canonical: { S: [-2, 5, 0], u: [3, -1, 2], v: [-2, 1, 4], a: 3, b: 2 },
 draw: R => { let p; do { p = { S: rv(R, -8, 8), u: rv(R, -4, 4), v: rv(R, -4, 4), a: R.int(2, 4), b: R.int(2, 4) }; } while (sq(p.u) === 0 || sq(p.v) === 0 || same(p.u, p.v)); return p; },
 build: ({ S, u, v, a, b }) => { const A = times(a, u), B = times(b, v), M = add3(A, B), F = add3(S, M); return {
  prompt: `A survey rover starts at the point ${P3(S)}, in metres from the deck’s corner post (x east, y north, z up). Its plan is ${n(a)} legs that each make the move u = ${V(u)}, followed by ${n(b)} legs that each make the move v = ${V(v)}, in metres. A move is added to a position component by component. Enter the rover’s final position: x, then y, then z.`,
  answer: F,
  hints: ['Several legs of the same move make a scaled move: multiply every component of u by the number of u legs, and every component of v by the number of v legs.', 'Add the two totals to each other, and then add that whole move to the start position, x with x, y with y and z with z.'],
  solution: `The u legs together make ${n(a)}u = ${V(A)} and the v legs together make ${n(b)}v = ${V(B)}, so the whole plan is the move ${V(M)}. Added to the start ${P3(S)}: x: ${n(S[0])} ${pm(M[0])} = ${n(F[0])}, y: ${n(S[1])} ${pm(M[1])} = ${n(F[1])}, z: ${n(S[2])} ${pm(M[2])} = ${n(F[2])}. The rover stops at ${P3(F)}.`,
  guidance: [
   { prompt: `${n(a)} legs of u = ${V(u)} make ${n(a)}u. What are its components?`, answer: A, explanation: `${n(a)} × ${par(u[0])} = ${n(A[0])}, ${n(a)} × ${par(u[1])} = ${n(A[1])} and ${n(a)} × ${par(u[2])} = ${n(A[2])}, so ${n(a)}u = ${V(A)}.` },
   { prompt: `${n(b)} legs of v = ${V(v)} make ${n(b)}v. What are its components?`, answer: B, explanation: `${n(b)} × ${par(v[0])} = ${n(B[0])}, ${n(b)} × ${par(v[1])} = ${n(B[1])} and ${n(b)} × ${par(v[2])} = ${n(B[2])}, so ${n(b)}v = ${V(B)}.` },
   { prompt: `The whole plan moves the rover by ${V(A)} plus ${V(B)}. Add that move to the start ${P3(S)}, component by component. What is the final position?`, answer: F, explanation: `The plan is ${V(M)}. Then x: ${n(S[0])} ${pm(M[0])} = ${n(F[0])}, y: ${n(S[1])} ${pm(M[1])} = ${n(F[1])}, z: ${n(S[2])} ${pm(M[2])} = ${n(F[2])}.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'A plan and the way home',
 brief: 'The rover’s plan is one scaled combination of two moves, and the crew want its stopping point and how far it ends up from where it started.',
 labels: ['final x', 'final y', 'final z', 'distance from start (m)'], tolerance: 0.01, uses: 'q01',
 gl: [['plan x', 'plan y', 'plan z'], ['final x', 'final y', 'final z'], ['distance from start (m)']]
}, {
 /* a in 2..4 and b in {−3, −2, 2, 3}; the combined move a·u + b·v has a whole length from 3 to 17 and no zero component, so the distance is whole. */
 canonical: { S: [1, -2, 3], u: [2, 1, -2], v: [-1, -2, -1], a: 3, b: 2 },
 draw: R => { let c; do { c = comboParams(R, 5, [2, 3, 4], [-3, -2, 2, 3]); } while (add3(times(c.a, c.u), times(c.b, c.v)).some(x => x === 0)); return { S: rv(R, -8, 8), ...c }; },
 build: ({ S, u, v, a, b }) => { const A = times(a, u), B = times(b, v), M = add3(A, B), F = add3(S, M), s = sq(M), L = len(M), cs = combo(a, b), au = scaled(a, 'u'), bv = scaled(b, 'v'); return {
  prompt: `A survey rover starts at ${P3(S)}, in metres from the deck’s corner post (x east, y north, z up), and carries out the plan ${cs}, where u = ${V(u)} and v = ${V(v)} are two basic moves in metres. Enter the rover’s final position, x, then y, then z, and then the straight-line distance in metres from its start to its final position.`,
  answer: [...F, L],
  hints: ['First find the plan as a single move: scale u and v by the numbers in front of them, then add component by component. Adding that move to the start gives the final position.', 'The distance from the start to the final position comes from the distance formula: subtract coordinate by coordinate, square the changes, add them and take the square root.'],
  solution: `${au} = ${V(A)} and ${bv} = ${V(B)}, so the plan is the move ${cs} = ${V(M)}. Adding it to the start ${P3(S)} gives the final position ${P3(F)}. The changes from start to finish are the components of the move, so the distance is √(${squaresVal(M)}) = √${n(s)} = ${n(L)} metres.`,
  guidance: [
   { prompt: `Scale u by ${n(a)} and v by ${n(b)}, then add the results component by component. What single move is ${cs}?`, answer: M, explanation: `${au} = ${V(A)} and ${bv} = ${V(B)}. Adding: ${V(M)}.` },
   { prompt: `Add the move ${V(M)} to the start ${P3(S)}, component by component. What is the final position?`, answer: F, explanation: `x: ${n(S[0])} ${pm(M[0])} = ${n(F[0])}, y: ${n(S[1])} ${pm(M[1])} = ${n(F[1])}, z: ${n(S[2])} ${pm(M[2])} = ${n(F[2])}.` },
   { prompt: `Use the distance formula between the start ${P3(S)} and the final position ${P3(F)}. How far apart are they, in metres?`, answer: [L], explanation: `The changes are ${V(M)}, so the distance is √(${squaresVal(M)}) = √${n(s)} = ${n(L)} metres.` }
  ] }; }
});

/* ---- q03 Magnitude and unit vectors [2.2] ---- */

/* Not the worked example of q03, ⟨1, 2, −2⟩. */
const notEx3 = v => !same(v, [1, 2, -2]);
mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Pointing the relay dish',
 brief: 'The relay dish must be aimed at the uplink by a direction of length exactly one, and Mira needs the arrow’s length and that direction.',
 labels: ['length (m)', 'unit x', 'unit y', 'unit z'], tolerance: 0.00005,
 gl: [['sum of squares'], ['length (m)'], ['unit x', 'unit y', 'unit z']]
}, {
 /* A whole-length arrow (any quadruple, any order and signs), never the q03 worked example. */
 canonical: { v: [-4, 1, 8] },
 draw: R => { let w; do { w = wv(R, 0, 11); } while (!notEx3(w.v)); return { v: w.v }; },
 build: ({ v }) => { const s = sq(v), L = len(v), U = v.map(x => x / L), F = v.map(x => frac(x, L)); return {
  prompt: `A relay dish on the survey deck must point along the arrow w = ${V(v)} from the dish to the uplink, in metres. Enter the length of w in metres, then the three components of the unit vector the dish should point along, x, then y, then z, each typed as a fraction such as 5/9.`,
  answer: [L, ...U],
  hints: ['The length is the square root of the sum of the squares of the three components.', 'The dish needs an arrow of length 1 pointing the same way as w: divide each component of w by the length, keeping its sign.'],
  solution: `The length is √(${squares(v)}) = √(${squaresVal(v)}) = ${rootText(s)} metres. Dividing each component of w by ${n(L)} gives the unit vector ⟨${F.join(', ')}⟩, which points along w and has length 1.`,
  guidance: [
   { prompt: `Add the squares of the components of ${V(v)}. What is the total?`, answer: [s], explanation: `${squares(v)} = ${squaresVal(v)} = ${n(s)}.` },
   { prompt: `The length is the square root of ${n(s)}. What is it?`, answer: [L], explanation: `√${n(s)} = ${n(L)}, so w is ${n(L)} metres long.` },
   { prompt: `Divide each component of ${V(v)} by ${n(L)}. What are the components of the unit vector? Type them as fractions.`, answer: U, explanation: `${v.map(x => `${n(x)} ÷ ${n(L)} = ${frac(x, L)}`).join(', ')}. Check: the squares of these add up to 1.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The flag on the cable',
 brief: 'A marker flag must be tied to a cable a set distance from beacon A, and the crew need the cable’s length and where the flag hangs.',
 labels: ['cable length (m)', 'flag x (m)', 'flag y (m)', 'flag z (m)'], tolerance: 0.00005,
 gl: [['cable length (m)'], ['unit x', 'unit y', 'unit z'], ['flag x (m)', 'flag y (m)', 'flag z (m)']]
}, {
 /* A whole-length arrow of length 6 or more (quadruples 2 to 12) and a flag distance of 2 to 5 metres, always shorter than the cable. */
 canonical: { v: [3, -2, 6], s: 3 },
 draw: R => { let w; do { w = wv(R, 1, 11); } while (!notEx3(w.v)); return { v: w.v, s: R.int(2, 5) }; },
 build: ({ v, s }) => { const L = len(v), q = sq(v), U = v.map(x => x / L), FU = v.map(x => frac(x, L)), W = v.map(x => s * x / L), FW = v.map(x => frac(s * x, L)); return {
  prompt: `A cable is to run from beacon A to beacon B along the arrow v = ${V(v)}, in metres. The crew will tie a marker flag to the cable exactly ${n(s)} metres from A. Enter the length of the whole cable in metres, then the three components of the arrow from A to the flag, x, then y, then z, each typed as a fraction such as 5/9 (a whole number is fine too).`,
  answer: [L, ...W],
  hints: ['The cable’s length is the magnitude of v: the square root of the sum of the squared components.', 'The arrow from A to the flag points the same way as v and has the length the flag is placed at. A unit vector has length 1, so scale the unit vector in the direction of v by that length.'],
  solution: `The cable’s length is √(${squaresVal(v)}) = ${rootText(q)} metres. The unit vector along v is ⟨${FU.join(', ')}⟩. The flag is ${n(s)} metres along it, so the arrow from A to the flag is ${n(s)} × ⟨${FU.join(', ')}⟩ = ⟨${FW.join(', ')}⟩.`,
  guidance: [
   { prompt: `Square the components of ${V(v)}, add them and take the square root. How long is the cable?`, answer: [L], explanation: `${squaresVal(v)} = ${n(q)}, and ${rootText(q)} metres.` },
   { prompt: `Divide each component of ${V(v)} by ${n(L)}. What is the unit vector along the cable? Type the components as fractions.`, answer: U, explanation: `${v.map(x => `${n(x)} ÷ ${n(L)} = ${frac(x, L)}`).join(', ')}.` },
   { prompt: `The flag hangs ${n(s)} metres from A along the cable. Multiply the unit vector ⟨${FU.join(', ')}⟩ by ${n(s)}. What are the components of the arrow from A to the flag? Type them as fractions.`, answer: W, explanation: `${FU.map((f, i) => `${n(s)} × ${f} = ${FW[i]}`).join(', ')}. The unit vector has length 1, so scaling it by ${n(s)} gives an arrow ${n(s)} metres long.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', title: 'Aiming along a combined arrow',
 brief: 'The laser must be aimed along a combination of two survey arrows, and Mira needs that combined arrow’s length and its direction of length one.',
 labels: ['magnitude (m)', 'unit x', 'unit y', 'unit z'], tolerance: 0.00005, uses: 'q02',
 gl: [['w x', 'w y', 'w z'], ['magnitude (m)'], ['unit x', 'unit y', 'unit z']]
}, {
 /* a in {2, 3, 4, −1, −2}, b in {−3, −2, −1, 2, 3} and components in −5..5, drawn until w = a·u + b·v has a whole length from 3 to 17 and no zero component. */
 canonical: { u: [3, 1, -2], v: [-2, -2, -3], a: 2, b: -1 },
 draw: R => { let p; do { p = comboParams(R, 5, [-2, -1, 2, 3, 4], [-3, -2, -1, 2, 3]); } while (add3(times(p.a, p.u), times(p.b, p.v)).some(x => x === 0)); return p; },
 build: ({ u, v, a, b }) => { const A = times(a, u), B = times(b, v), w = add3(A, B), s = sq(w), L = len(w), U = w.map(x => x / L), F = w.map(x => frac(x, L)), cs = combo(a, b), au = scaled(a, 'u'), bv = scaled(b, 'v'); return {
  prompt: `Two survey arrows leave the deck’s corner post: u = ${V(u)} and v = ${V(v)}, in metres. A laser is to be aimed along the combined arrow w = ${cs}. Enter the magnitude of w in metres, then the three components of the unit vector in the direction of w, x, then y, then z, each typed as a fraction such as 5/9 (a whole number or 0 is fine too).`,
  answer: [L, ...U],
  hints: ['Build w first: scale u and v by the numbers in front of them and add component by component.', 'Then find the magnitude of w from its components, and divide every component of w by that magnitude, keeping the signs.'],
  solution: `${au} = ${V(A)} and ${bv} = ${V(B)}, so w = ${cs} = ${V(w)}. Its magnitude is √(${squaresVal(w)}) = ${rootText(s)} metres. Dividing each component of w by ${n(L)} gives the unit vector ⟨${F.join(', ')}⟩.`,
  guidance: [
   { prompt: `Scale u by ${n(a)} and v by ${n(b)} and add component by component. What are the components of w = ${cs}?`, answer: w, explanation: `${au} = ${V(A)} and ${bv} = ${V(B)}. Adding: ${V(w)}.` },
   { prompt: `Square the components of ${V(w)}, add them and take the square root. What is the magnitude of w?`, answer: [L], explanation: `${squares(w)} = ${squaresVal(w)} = ${n(s)}, and ${rootText(s)} metres.` },
   { prompt: `Divide each component of ${V(w)} by ${n(L)}. What are the components of the unit vector? Type them as fractions.`, answer: U, explanation: `${w.map(x => `${n(x)} ÷ ${n(L)} = ${frac(x, L)}`).join(', ')}. Check: the squares of these add up to 1.` }
  ] }; }
});

/* ---- q04 Dot product and the angle between vectors [2.3] ---- */

/* Not the worked example of q04, ⟨2, 1, 2⟩ and ⟨−1, 2, 2⟩. */
const notEx4 = (u, v) => !(same(u, [2, 1, 2]) && same(v, [-1, 2, 2]));
mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The tripod struts',
 brief: 'Two struts of the survey tripod meet at one joint, and Mira wants the angle between them without measuring it on the frame.',
 labels: ['u · v', 'angle (rad)'], tolerance: 0.0005,
 gl: [['u · v'], ['‖u‖', '‖v‖'], ['angle (rad)']]
}, {
 /* u and v of whole length (quadruples 1 to 8), not parallel or opposite; the dot product may be 0, so the answer may be π ÷ 2 = 1.571.
    The angle is never on a rounding tie. */
 canonical: { u: [2, 3, 6], lu: 7, v: [4, 4, -7], lv: 9 },
 draw: R => { let p; do { const a = wv(R, 0, 7), b = wv(R, 0, 7); p = { u: a.v, lu: a.len, v: b.v, lv: b.len }; }
  while (Math.abs(dot(p.u, p.v)) === p.lu * p.lv || nearTie(Math.acos(dot(p.u, p.v) / (p.lu * p.lv)), 3) || !notEx4(p.u, p.v)); return p; },
 build: ({ u, lu, v, lv }) => { const d = dot(u, v), prods = u.map((x, i) => x * v[i]), th = Math.acos(d / (lu * lv)), A = round(th, 3), cosT = frac(d, lu * lv); return {
  prompt: `Two struts of a survey tripod leave the same joint along u = ${V(u)} and v = ${V(v)}, in metres. Enter the dot product u · v, then the angle between the two struts in radians, rounded to 3 decimal places.`,
  answer: [d, A],
  hints: ['Multiply matching components of the two struts, then add the three products to get the dot product.', 'Divide the dot product by the product of the two magnitudes to get cos θ, then take arccos with the calculator in radians. A dot product of 0 means the struts are at right angles.'],
  solution: `u · v = ${u.map((x, i) => `${par(x)} × ${par(v[i])}`).join(' + ')} = ${sumText(prods)} = ${n(d)}. ‖u‖ = ${rootText(sq(u))} and ‖v‖ = ${rootText(sq(v))}. So cos θ = ${n(d)} ÷ (${n(lu)} × ${n(lv)}) = ${cosT}, and θ = arccos(${cosT}), which is ${dpl(A, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `Multiply matching components of ${V(u)} and ${V(v)} and add. What is u · v?`, answer: [d], explanation: `${u.map((x, i) => `${par(x)} × ${par(v[i])}`).join(' + ')} = ${sumText(prods)} = ${n(d)}.` },
   { prompt: `Find the two magnitudes. What are ‖u‖ and ‖v‖?`, answer: [lu, lv], explanation: `‖u‖ = √(${squaresVal(u)}) = ${n(lu)} and ‖v‖ = √(${squaresVal(v)}) = ${n(lv)}.` },
   { prompt: `cos θ = ${n(d)} ÷ (${n(lu)} × ${n(lv)}). What is θ = arccos of that, in radians, to 3 decimal places?`, answer: [A], explanation: `cos θ = ${cosT}, and arccos(${cosT}) is ${dpl(A, 3)} radians to 3 decimal places. ${d > 0 ? 'The dot product is positive, so the angle is less than π/2.' : d < 0 ? 'The dot product is negative, so the angle is more than π/2.' : 'The dot product is 0, so the struts are orthogonal and the angle is π/2.'}` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The cable bend at the junction',
 brief: 'A power cable turns at a junction box between the dish and the mast, and Mira needs the angle at the box to choose the right bracket.',
 labels: ['BA · BC', 'angle at B (rad)'], tolerance: 0.0005,
 gl: [['BA x', 'BA y', 'BA z', 'BC x', 'BC y', 'BC z'], ['BA · BC'], ['angle at B (rad)']]
}, {
 /* BA and BC have whole lengths (quadruples 1 to 7) and are not parallel or opposite; the angle is never on a rounding tie. */
 canonical: { B: [1, -2, 3], ba: [3, 6, 2], bc: [-4, 4, 7] },
 draw: R => { let p, l; do { const a = wv(R, 0, 6), b = wv(R, 0, 6); p = { B: rv(R, -6, 6), ba: a.v, bc: b.v }; l = a.len * b.len; }
  while (Math.abs(dot(p.ba, p.bc)) === l || nearTie(Math.acos(dot(p.ba, p.bc) / l), 3)); return p; },
 build: ({ B, ba, bc }) => { const A = add3(B, ba), C = add3(B, bc), la = len(ba), lc = len(bc), d = dot(ba, bc), prods = ba.map((x, i) => x * bc[i]), th = Math.acos(d / (la * lc)), T = round(th, 3), cosT = frac(d, la * lc); return {
  prompt: `A power cable runs from the dish at A to a junction box at B and on to the mast at C. In metres from the deck’s corner post, with x east, y north and z up, A is at ${P3(A)}, B is at ${P3(B)} and C is at ${P3(C)}. Enter the dot product of the arrows BA and BC, then the angle at B between those two arrows in radians, rounded to 3 decimal places.`,
  answer: [d, T],
  hints: ['Each arrow is its end point minus its start point: BA is A − B and BC is C − B. Subtract coordinate by coordinate.', 'Dot the two arrows. Then cos θ is that dot product divided by the product of the two magnitudes, and arccos in radians gives the angle at B.'],
  solution: `BA = ${P3(A)} − ${P3(B)} = ${V(ba)} and BC = ${P3(C)} − ${P3(B)} = ${V(bc)}. Then BA · BC = ${ba.map((x, i) => `${par(x)} × ${par(bc[i])}`).join(' + ')} = ${sumText(prods)} = ${n(d)}. ‖BA‖ = ${rootText(sq(ba))} and ‖BC‖ = ${rootText(sq(bc))}. So cos θ = ${n(d)} ÷ (${n(la)} × ${n(lc)}) = ${cosT}, and the angle at B is arccos(${cosT}), which is ${dpl(T, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `Subtract B from A, and B from C, along each axis. What are the components of BA and then of BC?`, answer: [...ba, ...bc], explanation: `BA = ${P3(A)} − ${P3(B)} = ${V(ba)} and BC = ${P3(C)} − ${P3(B)} = ${V(bc)}.` },
   { prompt: `Multiply matching components of ${V(ba)} and ${V(bc)} and add. What is BA · BC?`, answer: [d], explanation: `${ba.map((x, i) => `${par(x)} × ${par(bc[i])}`).join(' + ')} = ${sumText(prods)} = ${n(d)}.` },
   { prompt: `BA has magnitude ${n(la)} and BC has magnitude ${n(lc)}. Then cos θ = ${n(d)} ÷ (${n(la)} × ${n(lc)}). What is the angle at B, in radians, to 3 decimal places?`, answer: [T], explanation: `cos θ = ${cosT}, and arccos(${cosT}) is ${dpl(T, 3)} radians to 3 decimal places. ${d > 0 ? 'The dot product is positive, so the angle is less than π/2.' : d < 0 ? 'The dot product is negative, so the angle is more than π/2.' : 'The dot product is 0, so the arrows are orthogonal and the angle is π/2.'}` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', title: 'The strut at right angles',
 brief: 'A support strut must stand square to a rail, but one number of its direction is still open, and Mira needs that number and the strut’s length.',
 labels: ['k', 'strut length (m)'], tolerance: 0.01, uses: 'q03',
 gl: [['part of u · v without k'], ['k'], ['strut length (m)']]
}, {
 /* u = ⟨k, a, b⟩ has a whole length (quadruples 1 to 8, so k is never 0); v = ⟨c, d, e⟩ is built so that k × c + a × d + b × e = 0 has a
    whole k, with c non-zero and at most 9 in size. */
 canonical: { u: [-6, 3, 2], v: [1, 4, -3] },
 draw: R => { let u, v, c, rest; for (;;) { u = wv(R, 0, 7).v; const d = R.nz(-5, 5), e = R.nz(-5, 5); rest = u[1] * d + u[2] * e; c = -rest / u[0];
  if (Number.isInteger(c) && c !== 0 && Math.abs(c) <= 9) { v = [c, d, e]; break; } } return { u, v }; },
 build: ({ u, v }) => { const a = u[1], b = u[2], c = v[0], d = v[1], e = v[2], k = u[0], rest = a * d + b * e, L = len(u); return {
  prompt: `A support strut along u = ⟨k, ${n(a)}, ${n(b)}⟩ metres must stand at right angles to a rail along v = ${V(v)}, where k is a number still to be chosen. Enter k, then the strut’s length ‖u‖ in metres.`,
  answer: [k, L],
  hints: ['Arrows at right angles are orthogonal: their dot product is 0. Write u · v with k in it and set it equal to 0.', 'Solve that equation for k, then put k back into u and find its magnitude from its three components.'],
  solution: `At right angles, u · v = 0. u · v = k × ${par(c)} + ${par(a)} × ${par(d)} + ${par(b)} × ${par(e)} = ${lead(c, 'k')} ${pm(rest)}. Setting ${lead(c, 'k')} ${pm(rest)} = 0 gives ${lead(c, 'k')} = ${n(-rest)}${Math.abs(c) === 1 ? '' : `, so k = ${n(k)}`}. Then u = ${V(u)} and ‖u‖ = √(${squaresVal(u)}) = ${rootText(sq(u))} metres.`,
  guidance: [
   { prompt: `Write u · v = k × ${par(c)} + ${par(a)} × ${par(d)} + ${par(b)} × ${par(e)}. The last two terms do not contain k: what do they add up to?`, answer: [rest], explanation: `${par(a)} × ${par(d)} + ${par(b)} × ${par(e)} = ${sumText([a * d, b * e])} = ${n(rest)}, so u · v = ${lead(c, 'k')} ${pm(rest)}.` },
   { prompt: `For right angles u · v = 0, so ${lead(c, 'k')} ${pm(rest)} = 0. Solve for k.`, answer: [k], explanation: `${lead(c, 'k')} = ${n(-rest)}, so k = ${n(-rest)} ÷ ${par(c)} = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, u = ${V(u)}. What is its magnitude ‖u‖?`, answer: [L], explanation: `√(${squaresVal(u)}) = ${rootText(sq(u))} metres.` }
  ] }; }
});

/* ---- q05 Projection; work as a dot product [2.3] ---- */

/* Not the worked example of q05, F = ⟨6, 1, 1⟩ and d = ⟨2, 1, 2⟩. */
const notEx5 = (F, d) => !(same(F, [6, 1, 1]) && same(d, [2, 1, 2]));
mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Wind on the trolley',
 brief: 'A gust shoves a solar-panel trolley along its rail, and Mira wants the energy it gives the trolley and the part of the gust that does the pushing.',
 labels: ['work (J)', 'scalar projection (N)'], tolerance: 0.01,
 gl: [['F · d'], ['‖d‖ (m)'], ['scalar projection (N)']]
}, {
 /* d of whole length (quadruples 1 to 7); F · d positive, at least twice ‖d‖ and a multiple of it, so the projection is whole. */
 canonical: { F: [5, 7, 3], d: [4, 4, -7], ld: 9 },
 draw: R => { let p, w; do { w = wv(R, 0, 6); p = { F: rv(R, -4, 12), d: w.v, ld: w.len }; }
  while (dot(p.F, p.d) < 2 * p.ld || dot(p.F, p.d) % p.ld !== 0 || !notEx5(p.F, p.d)); return p; },
 build: ({ F, d, ld }) => { const W = dot(F, d), comp = W / ld, prods = F.map((x, i) => x * d[i]); return {
  prompt: `A gust of wind pushes a solar-panel trolley along a rail on the survey deck. The wind’s force is a constant F = ${V(F)} newtons and the trolley rolls through the displacement d = ${V(d)} metres. Enter the work the wind does on the trolley in joules, then the scalar projection of F onto d (the part of the force that pushes along the rail) in newtons.`,
  answer: [W, comp],
  hints: ['The work done by a constant force is the dot product of the force and the displacement.', 'For the part of the force along the rail, divide that dot product by the magnitude of the displacement.'],
  solution: `F · d = ${F.map((x, i) => `${par(x)} × ${par(d[i])}`).join(' + ')} = ${sumText(prods)} = ${n(W)}, so the wind does ${n(W)} joules of work. The rail displacement has magnitude ‖d‖ = ${rootText(sq(d))} metres, so the scalar projection is ${n(W)} ÷ ${n(ld)} = ${n(comp)} newtons.`,
  guidance: [
   { prompt: `Multiply matching components of F and d and add. What is F · d, the work in joules?`, answer: [W], explanation: `${F.map((x, i) => `${par(x)} × ${par(d[i])}`).join(' + ')} = ${sumText(prods)} = ${n(W)}.` },
   { prompt: `What is the magnitude ‖d‖ of the displacement?`, answer: [ld], explanation: `‖d‖ = √(${squaresVal(d)}) = ${rootText(sq(d))} metres.` },
   { prompt: `Divide the work ${n(W)} by ‖d‖ = ${n(ld)}. What is the scalar projection of F onto d?`, answer: [comp], explanation: `${n(W)} ÷ ${n(ld)} = ${n(comp)} newtons: that much of the gust pushes along the rail.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'The two-leg haul',
 brief: 'A winch hauls a sled across the deck in two legs at one steady pull, and Mira needs the energy for the whole haul and the useful part of the pull.',
 labels: ['total work (J)', 'scalar projection (N)'], tolerance: 0.01,
 gl: [['total x (m)', 'total y (m)', 'total z (m)'], ['total work (J)'], ['scalar projection (N)']]
}, {
 /* The overall displacement d = d₁ + d₂ has a whole length (quadruples 1 to 7); F · d is positive, at least twice ‖d‖ and a multiple of it.
    Neither leg is the zero vector. */
 canonical: { F: [7, 7, 1], d1: [1, 3, 2], d2: [3, 1, 5], ld: 9 },
 draw: R => { let p, w, d1; do { w = wv(R, 0, 6); d1 = rv(R, -4, 6); p = { F: rv(R, -4, 12), d1, d2: w.v.map((x, i) => x - d1[i]), ld: w.len }; }
  while (sq(p.d1) === 0 || sq(p.d2) === 0 || dot(p.F, w.v) < 2 * p.ld || dot(p.F, w.v) % p.ld !== 0); return p; },
 build: ({ F, d1, d2, ld }) => { const d = add3(d1, d2), W = dot(F, d), comp = W / ld, prods = F.map((x, i) => x * d[i]); return {
  prompt: `A winch hauls a cargo sled across the survey deck in two legs while its pull stays constant at F = ${V(F)} newtons. On the first leg the sled moves along d₁ = ${V(d1)} metres and on the second leg along d₂ = ${V(d2)} metres. Enter the total work done over both legs in joules, then the scalar projection of F onto the sled’s overall displacement (the move from the start to the finish, d₁ + d₂) in newtons.`,
  answer: [W, comp],
  hints: ['The overall displacement is the two leg displacements added component by component.', 'The work of a constant force over the whole haul is its dot product with the overall displacement. For the scalar projection, divide that dot product by the magnitude of the overall displacement.'],
  solution: `The overall displacement is d = d₁ + d₂ = ${V(d)}. The total work is F · d = ${F.map((x, i) => `${par(x)} × ${par(d[i])}`).join(' + ')} = ${sumText(prods)} = ${n(W)} joules. The magnitude of d is √(${squaresVal(d)}) = ${rootText(sq(d))} metres, so the scalar projection of F onto d is ${n(W)} ÷ ${n(ld)} = ${n(comp)} newtons.`,
  guidance: [
   { prompt: `Add d₁ = ${V(d1)} and d₂ = ${V(d2)} component by component. What is the overall displacement d?`, answer: d, explanation: `x: ${n(d1[0])} ${pm(d2[0])} = ${n(d[0])}, y: ${n(d1[1])} ${pm(d2[1])} = ${n(d[1])}, z: ${n(d1[2])} ${pm(d2[2])} = ${n(d[2])}.` },
   { prompt: `Multiply matching components of F = ${V(F)} and d = ${V(d)} and add. What is the total work F · d?`, answer: [W], explanation: `${F.map((x, i) => `${par(x)} × ${par(d[i])}`).join(' + ')} = ${sumText(prods)} = ${n(W)} joules.` },
   { prompt: `The overall displacement has magnitude ${n(ld)} metres. Divide the total work ${n(W)} by it. What is the scalar projection of F onto d?`, answer: [comp], explanation: `${n(W)} ÷ ${n(ld)} = ${n(comp)} newtons.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', title: 'The unmeasured pull',
 brief: 'The vertical part of a tow cable’s pull was never recorded, but the strain gauge logged the useful pull along the path, which is enough to recover it.',
 labels: ['f (N)', 'work (J)'], tolerance: 0.01,
 gl: [['‖d‖ (m)'], ['work (J)'], ['f (N)']]
}, {
 /* d of whole length (quadruples 1 to 8); the work F · d is positive, at least twice ‖d‖ and a multiple of it, so the scalar projection p is a whole number.
    The unknown vertical part f is a whole number from −8 to 12; d has no zero component, so f can be solved for. */
 canonical: { a: 5, b: 1, f: 6, d: [2, 3, 6], ld: 7 },
 draw: R => { let p, w, W; do { w = wv(R, 0, 7); p = { a: R.int(-4, 9), b: R.int(-4, 9), f: R.int(-8, 12), d: w.v, ld: w.len }; W = p.a * p.d[0] + p.b * p.d[1] + p.f * p.d[2]; }
  while (W < 2 * p.ld || W % p.ld !== 0); return p; },
 build: ({ a, b, f, d, ld }) => { const W = a * d[0] + b * d[1] + f * d[2], pr = W / ld, known = a * d[0] + b * d[1], ab = `${n(a)} × ${par(d[0])} ${b < 0 ? '−' : '+'} ${n(Math.abs(b))} × ${par(d[1])}`; return {
  prompt: `A tow cable pulls a rover with a constant force F = ⟨${n(a)}, ${n(b)}, f⟩ newtons, where the vertical part f was not recorded. The rover moves along d = ${V(d)} metres, and the strain gauge shows that the scalar projection of F onto d is ${n(pr)} newtons. Enter f in newtons, then the work the cable does in joules.`,
  answer: [f, W],
  hints: ['The scalar projection is F · d ÷ ‖d‖, so F · d is the projection times ‖d‖. Find ‖d‖ first.', 'Write F · d out with f in it, set it equal to the value you just found, and solve for f. The work is F · d itself.'],
  solution: `‖d‖ = √(${squaresVal(d)}) = ${rootText(sq(d))} metres. The scalar projection is F · d ÷ ‖d‖, so F · d = ${n(pr)} × ${n(ld)} = ${n(W)}, and that is the work in joules. Also F · d = ${ab} + f × ${par(d[2])} = ${n(known)} ${term(d[2], 'f')}. So ${n(known)} ${term(d[2], 'f')} = ${n(W)}, which gives ${lead(d[2], 'f')} = ${n(W - known)} and f = ${n(f)} newtons.`,
  guidance: [
   { prompt: `What is the magnitude ‖d‖ of the displacement?`, answer: [ld], explanation: `‖d‖ = √(${squaresVal(d)}) = ${rootText(sq(d))} metres.` },
   { prompt: `The scalar projection ${n(pr)} equals F · d ÷ ${n(ld)}. What is F · d, the work in joules?`, answer: [W], explanation: `F · d = ${n(pr)} × ${n(ld)} = ${n(W)}.` },
   { prompt: `F · d = ${ab} + f × ${par(d[2])}, which is ${n(known)} ${term(d[2], 'f')}. Set it equal to ${n(W)} and solve for f.`, answer: [f], explanation: `${lead(d[2], 'f')} = ${n(W)} − ${par(known)} = ${n(W - known)}, so f = ${n(W - known)} ÷ ${par(d[2])} = ${n(f)} newtons.` }
  ] }; }
});

/* Tidies generated text where a drawn number comes out as 1: '1 joules' → '1 joule', '1π' → 'π'. Wraps every build of this file. */
const ONE = s => s.replace(/(^|[^\d.,])(−?1) (joule|newton|tonne|cubic metre|square metre|metre|kilogram|litre|gram|second|watt)s\b/g, '$1$2 $3').replace(/(^|[^\d.,])1π/g, '$1π');
for (const id of 'q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d'.split(' ')) {
 const g = window.MISSION_GEN[id], b = g.build;
 g.build = p => { const o = b(p); return { ...o, prompt: ONE(o.prompt), hints: o.hints.map(ONE), solution: ONE(o.solution), guidance: o.guidance.map(x => ({ ...x, prompt: ONE(x.prompt), explanation: ONE(x.explanation) })) }; };
}
})();
