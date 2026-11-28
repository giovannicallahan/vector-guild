/* Calculus 3: many variables mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A rounded value written with all its decimal places: dpl(0.8, 2) → '0.80'. */
const dpl = (x, k) => x.toFixed(k).replace('-', '−');
/* ⟨3, −1, 2⟩ */
const V = v => `⟨${v.map(n).join(', ')}⟩`;
/* (3, −1, 2) */
const P3 = v => `(${v.map(n).join(', ')})`;
/* A signed number inside a sum: '+ 3' or '− 3'. */
const pm = x => x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`;
/* A sum of numbers written out: '6 − 6 + 4'. */
const sumText = list => list.map((x, i) => i ? pm(x) : n(x)).join(' ');
/* A letter term with a coefficient, for the first place (lead) or later places: '3x', '−x', '+ 2y', '− z'. */
const lead = (c, x) => `${c < 0 ? '−' : ''}${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${x}`;
const term = (c, x) => `${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : n(Math.abs(c))}${x}`;
/* ax + by + cz with zero terms left out (at least one coefficient is non-zero). */
const linear = (cs, xs = ['x', 'y', 'z']) => cs.map((c, i) => [c, xs[i]]).filter(([c]) => c !== 0).map(([c, x], i) => i ? term(c, x) : lead(c, x)).join(' ');
/* The same sum at a point: '5 + 2 × 1 − 3 × (−2)'. */
const linearAt = (cs, p) => cs.map((c, i) => [c, p[i]]).filter(([c]) => c !== 0).map(([c, x], i) => {
 const body = Math.abs(c) === 1 ? par(x) : `${n(Math.abs(c))} × ${par(x)}`;
 return i ? `${c < 0 ? '−' : '+'} ${body}` : c < 0 && body !== '0' ? `−${body}` : body; }).join(' ');
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const sq = v => dot(v, v);
const squares = v => v.map(x => `${par(x)}²`).join(' + ');
const squaresVal = v => v.map(x => n(x * x)).join(' + ');
const rootText = s => { const r = Math.round(Math.sqrt(s)); return r * r === s ? `√${n(s)} = ${n(r)}` : `√${n(s)}`; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? n(p / g) : `${n(p / g)}/${n(q / g)}`; };
/* Whole-number lengths: [a, b, c, length] with a² + b² + c² = length². */
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 4, 4, 6], [2, 10, 11, 15], [2, 5, 14, 15], [1, 12, 12, 17], [8, 9, 12, 17]];
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
/* A random arrangement of one of the first `upto` quadruples, with random signs: { v, len }. */
const wholeVec = (R, upto) => { const q = QUADS[R.int(0, upto - 1)], p = R.pick(PERMS); return { v: p.map(i => (R.bool() ? -1 : 1) * q[i]), len: q[3] }; };
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
/* True when x × 10^k lies within 1e-6 of a rounding tie: such draws are filtered out. */
const nearTie = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 1e-6; };
const round = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
/* A combination a·u + b·v written as '2u − v', '3u + 2v'. */
const combo = (a, b) => `${a === 1 ? '' : n(a)}u ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : n(Math.abs(b))}v`;
const scaled = (k, x) => k === 1 ? x : k === -1 ? `−${x}` : `${n(k)}${x}`;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Beacon B = A + a change with a whole length (QUADS, any order and signs). Not the worked example, (1, 2, 0) to (3, 4, 1). */
 q01: {
  canonical: { a: [2, -1, 3], d: [6, 2, 3] },
  draw: R => { let p; do { const w = wholeVec(R, 12); p = { a: [R.int(-6, 6), R.int(-6, 6), R.int(-4, 6)], d: w.v }; } while (same(p.a, [1, 2, 0]) && same(p.d, [2, 2, 1])); return p; },
  build: ({ a, d }) => { const b = a.map((x, i) => x + d[i]), s = sq(d), D = Math.round(Math.sqrt(s)); return {
   prompt: `Two survey beacons stand in the crater. Measured in metres from the deck’s corner post, with x east, y north and z up, beacon A is at ${P3(a)} and beacon B is at ${P3(b)}. Enter the straight-line distance between the two beacons in metres.`,
   answer: [D],
   hints: ['Subtract coordinate by coordinate, B minus A, to get the change along each axis.', 'Square the three changes, add the squares, and take the square root of the total.'],
   solution: `The changes are x: ${n(b[0])} − ${par(a[0])} = ${n(d[0])}, y: ${n(b[1])} − ${par(a[1])} = ${n(d[1])} and z: ${n(b[2])} − ${par(a[2])} = ${n(d[2])}. Squared and added: ${squaresVal(d)} = ${n(s)}. The distance is ${rootText(s)} metres.`,
   guidance: [
    { prompt: `Take B minus A along each axis. What are the changes in x, in y and in z?`, answer: d, explanation: `x: ${n(b[0])} − ${par(a[0])} = ${n(d[0])}, y: ${n(b[1])} − ${par(a[1])} = ${n(d[1])}, z: ${n(b[2])} − ${par(a[2])} = ${n(d[2])}.` },
    { prompt: `Square the three changes ${n(d[0])}, ${n(d[1])} and ${n(d[2])} and add them. What is the total?`, answer: [s], explanation: `${squares(d)} = ${squaresVal(d)} = ${n(s)}. A square is never negative, so the signs of the changes do not matter here.` },
    { prompt: `The distance is the square root of that total. What is √${n(s)}?`, answer: [D], explanation: `√${n(s)} = ${n(D)}, so the beacons are ${n(D)} metres apart in a straight line.` }
   ] }; }
 },
 /* a·u + b·v with a in 2..4 and b in {−3, −2, −1, 2, 3}. Not the worked example (u + 3v with ⟨1, 0, 2⟩ and ⟨2, 1, −1⟩). */
 q02: {
  canonical: { u: [3, -1, 2], v: [1, 4, -2], a: 2, b: -1 },
  draw: R => { let p; do { p = { u: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], v: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], a: R.int(2, 4), b: R.pick([-3, -2, -1, 2, 3]) }; } while (sq(p.u) === 0 || sq(p.v) === 0 || same(p.u, p.v)); return p; },
  build: ({ u, v, a, b }) => { const A = u.map(x => a * x), B = v.map(x => b * x), C = A.map((x, i) => x + B[i]), cs = combo(a, b), au = scaled(a, 'u'), bv = scaled(b, 'v'); return {
   prompt: `Two survey arrows start at the deck’s corner post: u = ${V(u)} and v = ${V(v)}, in metres east, north and up. The team needs the arrow ${cs}. Enter its three components: x, then y, then z.`,
   answer: C,
   hints: ['Scale first: multiply every component of u by the number in front of u, and every component of v by the number in front of v, sign included.', 'Then combine the two scaled arrows component by component: x with x, y with y and z with z.'],
   solution: `${au} = ${V(A)} and ${bv} = ${V(B)}. Adding component by component: ${cs} = ⟨${n(A[0])} ${pm(B[0])}, ${n(A[1])} ${pm(B[1])}, ${n(A[2])} ${pm(B[2])}⟩ = ${V(C)}.`,
   guidance: [
    { prompt: `Multiply each component of u = ${V(u)} by ${n(a)}. What is ${au}?`, answer: A, explanation: `${n(a)} × ${par(u[0])} = ${n(A[0])}, ${n(a)} × ${par(u[1])} = ${n(A[1])} and ${n(a)} × ${par(u[2])} = ${n(A[2])}, so ${au} = ${V(A)}.` },
    { prompt: `Multiply each component of v = ${V(v)} by ${n(b)}. What is ${bv}?`, answer: B, explanation: `${n(b)} × ${par(v[0])} = ${n(B[0])}, ${n(b)} × ${par(v[1])} = ${n(B[1])} and ${n(b)} × ${par(v[2])} = ${n(B[2])}, so ${bv} = ${V(B)}.` },
    { prompt: `Add ${V(A)} and ${V(B)} component by component. What is ${cs}?`, answer: C, explanation: `x: ${n(A[0])} ${pm(B[0])} = ${n(C[0])}, y: ${n(A[1])} ${pm(B[1])} = ${n(C[1])}, z: ${n(A[2])} ${pm(B[2])} = ${n(C[2])}.` }
   ] }; }
 },
 /* A whole-length arrow (QUADS 2 to 12, any order and signs); the worked example uses ⟨1, 2, −2⟩, from the first quadruple. */
 q03: {
  canonical: { v: [2, -3, 6], len: 7 },
  draw: R => { let w; do { w = wholeVec(R, 12); } while (w.len === 3); return { v: w.v, len: w.len }; },
  build: ({ v, len }) => { const s = sq(v), U = v.map(x => x / len), F = v.map(x => frac(x, len)); return {
   prompt: `A survey arrow from beacon A to beacon B is v = ${V(v)}, in metres. Enter its magnitude ‖v‖ in metres, then the three components of the unit vector in the same direction, x, then y, then z, each typed as a fraction such as 5/9.`,
   answer: [len, ...U],
   hints: ['The magnitude is the square root of the sum of the squared components.', 'A unit vector has length 1: divide every component of v by the magnitude, keeping each sign.'],
   solution: `‖v‖ = √(${squares(v)}) = √(${squaresVal(v)}) = ${rootText(s)} metres. Dividing each component by ${n(len)} gives the unit vector ⟨${F.join(', ')}⟩, which points the same way as v and has length 1.`,
   guidance: [
    { prompt: `Square the components of ${V(v)} and add them. What is the total?`, answer: [s], explanation: `${squares(v)} = ${squaresVal(v)} = ${n(s)}.` },
    { prompt: `The magnitude is the square root of ${n(s)}. What is ‖v‖?`, answer: [len], explanation: `√${n(s)} = ${n(len)}, so the arrow is ${n(len)} metres long.` },
    { prompt: `Divide each component of ${V(v)} by ${n(len)}. What are the components of the unit vector? Type them as fractions.`, answer: U, explanation: `${v.map(x => `${n(x)} ÷ ${n(len)} = ${frac(x, len)}`).join(', ')}. Check: the squares of these add up to 1.` }
   ] }; }
 },
 /* u and v of whole length (QUADS 1 to 7), not parallel, angle not on a rounding tie. Not the worked example (⟨2, 1, 2⟩ and ⟨−1, 2, 2⟩). */
 q04: {
  canonical: { u: [1, 2, 2], lu: 3, v: [6, -3, 2], lv: 7 },
  draw: R => { let p; do { const a = wholeVec(R, 7), b = wholeVec(R, 7); p = { u: a.v, lu: a.len, v: b.v, lv: b.len }; }
   while (Math.abs(dot(p.u, p.v)) === p.lu * p.lv || nearTie(Math.acos(dot(p.u, p.v) / (p.lu * p.lv)), 3) || (same(p.u, [2, 1, 2]) && same(p.v, [-1, 2, 2]))); return p; },
  build: ({ u, lu, v, lv }) => { const d = dot(u, v), prods = u.map((x, i) => x * v[i]), th = Math.acos(d / (lu * lv)), A = round(th, 3), cosT = frac(d, lu * lv); return {
   prompt: `Two survey arrows leave beacon A: u = ${V(u)} towards the dish and v = ${V(v)} towards the mast. Enter the dot product u · v, then the angle between the two arrows in radians, rounded to 3 decimal places.`,
   answer: [d, A],
   hints: ['The dot product multiplies matching components and adds the three products.', 'The cosine of the angle is u · v divided by the product of the two magnitudes. Then arccos, in radians, gives an angle between 0 and π.'],
   solution: `u · v = ${u.map((x, i) => `${par(x)} × ${par(v[i])}`).join(' + ')} = ${sumText(prods)} = ${n(d)}. ‖u‖ = ${rootText(sq(u))} and ‖v‖ = ${rootText(sq(v))}. So cos θ = ${n(d)} ÷ (${n(lu)} × ${n(lv)}) = ${cosT}, and θ = arccos(${cosT}), which is ${dpl(A, 3)} radians to 3 decimal places.`,
   guidance: [
    { prompt: `Multiply matching components of ${V(u)} and ${V(v)} and add. What is u · v?`, answer: [d], explanation: `${u.map((x, i) => `${par(x)} × ${par(v[i])}`).join(' + ')} = ${sumText(prods)} = ${n(d)}.` },
    { prompt: `What are the magnitudes ‖u‖ and ‖v‖?`, answer: [lu, lv], explanation: `‖u‖ = √(${squaresVal(u)}) = ${n(lu)} and ‖v‖ = √(${squaresVal(v)}) = ${n(lv)}.` },
    { prompt: `cos θ = ${n(d)} ÷ (${n(lu)} × ${n(lv)}). What is θ = arccos of that, in radians, to 3 decimal places?`, answer: [A], explanation: `cos θ = ${cosT}, and arccos(${cosT}) is ${dpl(A, 3)} radians to 3 decimal places. ${d > 0 ? 'The dot product is positive, so the angle is less than π/2.' : d < 0 ? 'The dot product is negative, so the angle is more than π/2.' : 'The dot product is 0, so the arrows are orthogonal and the angle is π/2.'}` }
   ] }; }
 },
 /* d of whole length (QUADS 1 to 7); F · d positive and a multiple of ‖d‖, so the scalar projection is whole. Not the
    worked example (F = ⟨6, 1, 1⟩, d = ⟨2, 1, 2⟩). */
 q05: {
  canonical: { F: [10, 4, 3], d: [6, 2, 3], ld: 7 },
  draw: R => { let p, w; do { w = wholeVec(R, 7); p = { F: [R.int(-4, 12), R.int(-4, 12), R.int(-4, 12)], d: w.v, ld: w.len }; }
   while (dot(p.F, p.d) < 2 * p.ld || dot(p.F, p.d) % p.ld !== 0 || (same(p.F, [6, 1, 1]) && same(p.d, [2, 1, 2]))); return p; },
  build: ({ F, d, ld }) => { const W = dot(F, d), comp = W / ld, prods = F.map((x, i) => x * d[i]); return {
   prompt: `A winch drags a cargo sled across the survey deck with a constant force F = ${V(F)} newtons, while the sled moves along the displacement d = ${V(d)} metres. Enter the scalar projection of F onto d (the part of the force along the motion) in newtons, then the work the winch does in joules.`,
   answer: [comp, W],
   hints: ['The work done by a constant force is the dot product of the force and the displacement.', 'The scalar projection is that dot product divided by the magnitude of d.'],
   solution: `F · d = ${F.map((x, i) => `${par(x)} × ${par(d[i])}`).join(' + ')} = ${sumText(prods)} = ${n(W)}, so the work is ${n(W)} joules. ‖d‖ = ${rootText(sq(d))} metres, so the scalar projection is ${n(W)} ÷ ${n(ld)} = ${n(comp)} newtons: only that much of the force pulls along the motion.`,
   guidance: [
    { prompt: `Multiply matching components of F and d and add. What is F · d?`, answer: [W], explanation: `${F.map((x, i) => `${par(x)} × ${par(d[i])}`).join(' + ')} = ${sumText(prods)} = ${n(W)}. This is also the work in joules.` },
    { prompt: `What is the magnitude ‖d‖ of the displacement?`, answer: [ld], explanation: `‖d‖ = √(${squaresVal(d)}) = ${rootText(sq(d))} metres.` },
    { prompt: `Divide F · d by ‖d‖. What is the scalar projection of F onto d?`, answer: [comp], explanation: `${n(W)} ÷ ${n(ld)} = ${n(comp)} newtons.` }
   ] }; }
 },
 /* u, v with components in −4..4 whose cross product has a whole length from 2 to 60 and at most one zero component. Not the worked example (⟨2, 2, 1⟩ and ⟨1, −2, 2⟩). */
 q06: {
  canonical: { u: [2, 1, 2], v: [1, 2, -2] },
  draw: R => { let p, c, s, r; do { p = { u: [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], v: [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)] }; c = cross(p.u, p.v); s = sq(c); r = Math.round(Math.sqrt(s)); }
   while (s === 0 || r * r !== s || r < 2 || r > 60 || c.filter(x => x === 0).length > 1 || (same(p.u, [2, 2, 1]) && same(p.v, [1, -2, 2]))); return p; },
  build: ({ u, v }) => { const c = cross(u, v), s = sq(c), A = Math.round(Math.sqrt(s)); return {
   prompt: `A solar panel frame on the survey deck is a parallelogram whose two edges leave the same corner along u = ${V(u)} and v = ${V(v)}, in metres. Enter the three components of u × v, x then y then z, then the panel’s area in square metres.`,
   answer: [...c, A],
   hints: ['Each component of u × v is a criss-cross difference: x = u₂v₃ − u₃v₂, y = u₃v₁ − u₁v₃, z = u₁v₂ − u₂v₁.', 'The area of the parallelogram is the magnitude of the cross product.'],
   solution: `x: ${par(u[1])} × ${par(v[2])} − ${par(u[2])} × ${par(v[1])} = ${n(c[0])}. y: ${par(u[2])} × ${par(v[0])} − ${par(u[0])} × ${par(v[2])} = ${n(c[1])}. z: ${par(u[0])} × ${par(v[1])} − ${par(u[1])} × ${par(v[0])} = ${n(c[2])}. So u × v = ${V(c)}, and the area is ‖u × v‖ = √(${squaresVal(c)}) = ${rootText(s)} square metres.`,
   guidance: [
    { prompt: `The x component is u₂v₃ − u₃v₂. What is it here?`, answer: [c[0]], explanation: `${par(u[1])} × ${par(v[2])} − ${par(u[2])} × ${par(v[1])} = ${n(u[1] * v[2])} − ${par(u[2] * v[1])} = ${n(c[0])}.` },
    { prompt: `The y component is u₃v₁ − u₁v₃ and the z component is u₁v₂ − u₂v₁. What are they?`, answer: [c[1], c[2]], explanation: `y: ${par(u[2])} × ${par(v[0])} − ${par(u[0])} × ${par(v[2])} = ${n(c[1])}. z: ${par(u[0])} × ${par(v[1])} − ${par(u[1])} × ${par(v[0])} = ${n(c[2])}.` },
    { prompt: `The area is the magnitude of u × v = ${V(c)}. What is it?`, answer: [A], explanation: `√(${squaresVal(c)}) = ${rootText(s)}, so the panel covers ${n(A)} square metres.` }
   ] }; }
 },
 /* A descending path P + t·d meeting the height h at a whole time T from 2 to 6; x0, y0 and the direction's x and y are
    non-zero. Not the worked example (from (1, 0, 5) along ⟨2, −1, −1⟩ down to z = 3). */
 q07: {
  canonical: { p: [4, -2], dx: 3, dy: 1, dz: -2, h: 2, T: 4 },
  draw: R => ({ p: [R.nz(-8, 8), R.nz(-8, 8)], dx: R.nz(-4, 4), dy: R.nz(-4, 4), dz: R.pick([-1, -2, -3]), h: R.int(1, 5), T: R.int(2, 6) }),
  build: ({ p, dx, dy, dz, h, T }) => { const z0 = h - dz * T, x = p[0] + dx * T, y = p[1] + dy * T; return {
   prompt: `A shuttle’s approach path to the orbital dock is the line x = ${n(p[0])} ${term(dx, 't')}, y = ${n(p[1])} ${term(dy, 't')}, z = ${n(z0)} ${term(dz, 't')}, with lengths in metres and t in seconds: it starts at ${P3([p[0], p[1], z0])} and moves by ${V([dx, dy, dz])} every second. The docking ring is at height z = ${n(h)}. Enter the time t at which the shuttle reaches that height, then its x and y coordinates at that moment.`,
   answer: [T, x, y],
   hints: ['Set the z equation equal to the height of the ring and solve it for t.', 'Put that value of t into the x and y equations.'],
   solution: `${n(z0)} ${term(dz, 't')} = ${n(h)} gives ${lead(dz, 't')} = ${n(h - z0)}, so t = ${n(h - z0)} ÷ ${par(dz)} = ${n(T)} seconds. Then x = ${n(p[0])} ${pm(dx)} × ${n(T)} = ${n(x)} and y = ${n(p[1])} ${pm(dy)} × ${n(T)} = ${n(y)}, so the shuttle reaches the ring’s height at ${P3([x, y, h])}.`,
   guidance: [
    { prompt: `Solve ${n(z0)} ${term(dz, 't')} = ${n(h)} for t. What is t?`, answer: [T], explanation: `Subtract ${n(z0)} from both sides: ${lead(dz, 't')} = ${n(h - z0)}. Divide by ${par(dz)}: t = ${n(T)}.` },
    { prompt: `Put t = ${n(T)} into x = ${n(p[0])} ${term(dx, 't')} and y = ${n(p[1])} ${term(dy, 't')}. What are x and y?`, answer: [x, y], explanation: `x = ${n(p[0])} ${pm(dx)} × ${n(T)} = ${n(x)} and y = ${n(p[1])} ${pm(dy)} × ${n(T)} = ${n(y)}.` }
   ] }; }
 },
 /* P, and arrows PQ and PR with components in −3..3 that are not parallel. Not the worked example (P(0, 0, 1), Q(2, 0, 1), R(0, 1, 3)). */
 q08: {
  canonical: { P: [1, 0, 2], a: [2, 1, 0], b: [0, 2, 3] },
  draw: R => { let p; do { p = { P: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], a: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], b: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)] }; }
   while (sq(cross(p.a, p.b)) === 0 || (same(p.P, [0, 0, 1]) && same(p.a, [2, 0, 0]) && same(p.b, [0, 1, 2]))); return p; },
  build: ({ P, a, b }) => { const Q = P.map((x, i) => x + a[i]), Rr = P.map((x, i) => x + b[i]), c = cross(a, b), d = dot(c, P); return {
   prompt: `Three anchor bolts for a docking panel sit at P${P3(P)}, Q${P3(Q)} and R${P3(Rr)}, in metres. Use the normal vector n = PQ × PR, where PQ is the arrow from P to Q and PR the arrow from P to R. The panel’s plane is then ax + by + cz = d with ⟨a, b, c⟩ = n. Enter a, b and c, then d.`,
   answer: [...c, d],
   hints: ['Each arrow is its end point minus its start point: PQ = Q − P and PR = R − P.', 'The cross product of the two arrows is the normal vector. Then d is n · P, because P lies in the plane.'],
   solution: `PQ = ${V(a)} and PR = ${V(b)}. Their cross product is n = ⟨${par(a[1])} × ${par(b[2])} − ${par(a[2])} × ${par(b[1])}, ${par(a[2])} × ${par(b[0])} − ${par(a[0])} × ${par(b[2])}, ${par(a[0])} × ${par(b[1])} − ${par(a[1])} × ${par(b[0])}⟩ = ${V(c)}. Then d = n · P = ${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}. The plane is ${linear(c)} = ${n(d)}.`,
   guidance: [
    { prompt: `Subtract P from Q. What are the components of PQ?`, answer: a, explanation: `PQ = ${P3(Q)} − ${P3(P)} = ${V(a)}.` },
    { prompt: `Subtract P from R. What are the components of PR?`, answer: b, explanation: `PR = ${P3(Rr)} − ${P3(P)} = ${V(b)}.` },
    { prompt: `Work out n = PQ × PR = ${V(a)} × ${V(b)}. What are its components?`, answer: c, explanation: `x: ${par(a[1])} × ${par(b[2])} − ${par(a[2])} × ${par(b[1])} = ${n(c[0])}, y: ${par(a[2])} × ${par(b[0])} − ${par(a[0])} × ${par(b[2])} = ${n(c[1])}, z: ${par(a[0])} × ${par(b[1])} − ${par(a[1])} × ${par(b[0])} = ${n(c[2])}.` },
    { prompt: `P lies in the plane, so d = n · P. What is d?`, answer: [d], explanation: `${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}.` }
   ] }; }
 },
 /* Plane ax + by + cz = d (coefficients −3..3, at least two non-zero), a point not on it, and a distance that is not on a
    rounding tie at 2 decimals. Not the worked example (2x + y + 2z = 1 and (3, 1, 2)). */
 q09: {
  canonical: { c: [1, 2, -3], d: 4, X: [5, 1, -2] },
  draw: R => { let p; do { p = { c: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], d: R.nz(-6, 6), X: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)] }; }
   while (p.c.filter(x => x !== 0).length < 2 || dot(p.c, p.X) === p.d || nearTie(Math.abs(dot(p.c, p.X) - p.d) / Math.sqrt(sq(p.c)), 2) || (same(p.c, [2, 1, 2]) && p.d === 1)); return p; },
  build: ({ c, d, X }) => { const val = dot(c, X) - d, s = sq(c), D = Math.abs(val) / Math.sqrt(s), A = round(D, 2), exact = Math.abs(D * 100 - Math.round(D * 100)) < 1e-9, expr = `${linear(c)} ${pm(-d)}`; return {
   prompt: `A guide panel at the orbital dock lies in the plane ${linear(c)} = ${n(d)}, in metres. A maintenance drone hovers at ${P3(X)}. Enter the value of ${expr} at the drone, then the drone’s shortest distance to the plane in metres, rounded to 2 decimal places.`,
   answer: [val, A],
   hints: ['Put the drone’s coordinates into the left side of the plane’s equation and subtract the right side.', 'The distance is the size of that value, without its sign, divided by the magnitude of the normal vector ⟨a, b, c⟩.'],
   solution: `At ${P3(X)}: ${linearAt(c, X)} ${pm(-d)} = ${n(val)}. The normal vector is n = ${V(c)}, with ‖n‖ = √(${squaresVal(c)}) = ${rootText(s)}. The distance is |${n(val)}| ÷ ‖n‖ = ${n(Math.abs(val))} ÷ ${rootText(s).split(' = ').pop()}${exact ? ` = ${n(A)} ${A === 1 ? 'metre' : 'metres'}.` : `, which is ${dpl(A, 2)} metres to 2 decimal places.`}`,
   guidance: [
    { prompt: `Put x = ${n(X[0])}, y = ${n(X[1])} and z = ${n(X[2])} into ${expr}. What do you get?`, answer: [val], explanation: `${linearAt(c, X)} ${pm(-d)} = ${n(val)}. It is not 0, so the drone is not in the plane.` },
    { prompt: `What is ‖n‖², the sum of the squares of the coefficients ${n(c[0])}, ${n(c[1])} and ${n(c[2])}?`, answer: [s], explanation: `${squaresVal(c)} = ${n(s)}, so ‖n‖ = ${rootText(s)}.` },
    { prompt: `Divide |${n(val)}| by √${n(s)}. What is the distance, to 2 decimal places?`, answer: [A], explanation: `${n(Math.abs(val))} ÷ √${n(s)} ${exact ? `= ${n(A)}` : `is ${dpl(A, 2)} to 2 decimal places`}. The sign of ${n(val)} only says which side of the plane the drone is on.` }
   ] }; }
 },
 /* r(t) = ⟨at² + bt, (c ÷ π) sin(πt), e·t³⟩ at a whole time T from 1 to 3; the speed is not on a rounding tie. Not the
    worked example (⟨t², (4 ÷ π) sin(πt), 2t⟩ at t = 1). */
 q10: {
  canonical: { a: 3, b: -4, c: 6, e: 1, T: 2 },
  draw: R => { let p; do { p = { a: R.int(2, 4), b: R.nz(-6, 6), c: R.int(2, 9), e: R.pick([-2, -1, 1, 2]), T: R.int(1, 3) }; }
   while (nearTie(Math.hypot(2 * p.a * p.T + p.b, p.c * (p.T % 2 ? -1 : 1), 3 * p.e * p.T * p.T), 2) || (p.a === 3 && p.b === -4 && p.c === 6 && p.e === 1 && p.T === 2)); return p; },
  build: ({ a, b, c, e, T }) => { const vx = 2 * a * T + b, cs = T % 2 ? -1 : 1, vy = c * cs, vz = 3 * e * T * T, s = vx * vx + vy * vy + vz * vz, S = round(Math.sqrt(s), 2),
   exact = Math.abs(Math.sqrt(s) * 100 - Math.round(Math.sqrt(s) * 100)) < 1e-9, zt = lead(e, 't³'), dz = lead(3 * e, 't²'); return {
   prompt: `A cargo drone leaves the orbital dock along r(t) = ⟨${n(a)}t² ${term(b, 't')}, (${n(c)} ÷ π) sin(πt), ${zt}⟩ metres, t seconds after release (the sine works in radians). Enter its velocity at t = ${n(T)}, as x, y and z components in metres per second, then its speed at that moment in metres per second, rounded to 2 decimal places, then the z component of its acceleration at that moment in metres per second squared.`,
   answer: [vx, vy, vz, S, 6 * e * T],
   hints: ['Velocity is the derivative of the position, taken one component at a time. For the middle one, the chain rule gives the derivative of sin(πt) as π cos(πt).', 'Speed is the magnitude of the velocity: the square root of the sum of its squared components. Acceleration is the derivative of the velocity, again one component at a time.'],
   solution: `v(t) = r′(t) = ⟨${n(2 * a)}t ${pm(b)}, ${n(c)} cos(πt), ${dz}⟩. At t = ${n(T)}: ${n(2 * a)} × ${n(T)} ${pm(b)} = ${n(vx)}, ${n(c)} cos(${T === 1 ? '' : n(T)}π) = ${n(c)} × ${par(cs)} = ${n(vy)}, and ${n(3 * e)} × ${n(T * T)} = ${n(vz)}. So v(${n(T)}) = ${V([vx, vy, vz])} m/s. The speed is √(${squaresVal([vx, vy, vz])}) = √${n(s)}${exact ? ` = ${n(S)} m/s.` : `, which is ${dpl(S, 2)} m/s to 2 decimal places.`} Differentiating the z velocity ${dz} again gives the z acceleration ${lead(6 * e, 't')}, which at t = ${n(T)} is ${n(6 * e)} × ${n(T)} = ${n(6 * e * T)} m/s².`,
   guidance: [
    { prompt: `Differentiate the x component ${n(a)}t² ${term(b, 't')} and put in t = ${n(T)}. What is the x velocity?`, answer: [vx], explanation: `The derivative is ${n(2 * a)}t ${pm(b)}, and ${n(2 * a)} × ${n(T)} ${pm(b)} = ${n(vx)}.` },
    { prompt: `The derivative of (${n(c)} ÷ π) sin(πt) is ${n(c)} cos(πt), and the derivative of ${zt} is ${dz}. What are the y and z velocities at t = ${n(T)}?`, answer: [vy, vz], explanation: `cos(${T === 1 ? '' : n(T)}π) = ${n(cs)}, so y: ${n(c)} × ${par(cs)} = ${n(vy)}. z: ${n(3 * e)} × ${n(T * T)} = ${n(vz)}.` },
    { prompt: `The velocity is ${V([vx, vy, vz])}. What is the speed, its magnitude, to 2 decimal places?`, answer: [S], explanation: `√(${squaresVal([vx, vy, vz])}) = √${n(s)}${exact ? ` = ${n(S)}` : `, which is ${dpl(S, 2)} to 2 decimal places`}.` },
    { prompt: `The acceleration is the derivative of the velocity. Differentiate the z velocity ${dz} and put in t = ${n(T)}. What is the z acceleration?`, answer: [6 * e * T], explanation: `The derivative of ${dz} is ${lead(6 * e, 't')}, and ${n(6 * e)} × ${n(T)} = ${n(6 * e * T)} m/s².` }
   ] }; }
 }
});
})();
