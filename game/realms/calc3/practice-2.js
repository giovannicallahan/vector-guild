/* Calculus 3: many variables practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p2.js. */
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
/* A signed number inside a sum: '+ 3' or '− 3'. */
const pm = x => x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`;
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
/* √30, or 3 when the number is a perfect square. */
const isSq = s => { const r = Math.round(Math.sqrt(s)); return r * r === s; };
const rt = s => isSq(s) ? n(Math.sqrt(s)) : `√${n(s)}`;
/* Whole-number lengths: [a, b, c, length] with a² + b² + c² = length². */
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13]];
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
/* A random arrangement of one of the first `upto` quadruples, with random signs: { v, len }. */
const wholeVec = (R, upto) => { const q = QUADS[R.int(0, upto - 1)], p = R.pick(PERMS); return { v: p.map(i => (R.bool() ? -1 : 1) * q[i]), len: q[3] }; };
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
/* True when x × 10^k lies within 1e-6 of a rounding tie: such draws are filtered out. */
const nearTie = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 1e-6; };
const round = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
/* ' − 5' or ' + 3' after a left side, and nothing when the number is 0 (no "+ 0"): minusD(d) is for "… − d". */
const minusD = d => d === 0 ? '' : ` ${pm(-d)}`;
/* x as text with a unit, singular for 1: '1 second', '4 seconds'. */
const pl = (x, unit) => `${n(x)} ${x === 1 ? unit : unit + 's'}`;
/* The criss-cross working of u × v for the three components, written as the solution text . */
const crossWork = (u, v, c) => `x: ${par(u[1])} × ${par(v[2])} − ${par(u[2])} × ${par(v[1])} = ${n(c[0])}. y: ${par(u[2])} × ${par(v[0])} − ${par(u[0])} × ${par(v[2])} = ${n(c[1])}. z: ${par(u[0])} × ${par(v[1])} − ${par(u[1])} × ${par(v[0])} = ${n(c[2])}.`;
const crossStep = (u, v, c) => `x: ${par(u[1])} × ${par(v[2])} − ${par(u[2])} × ${par(v[1])} = ${n(c[0])}, y: ${par(u[2])} × ${par(v[0])} − ${par(u[0])} × ${par(v[2])} = ${n(c[1])}, z: ${par(u[0])} × ${par(v[1])} − ${par(u[1])} × ${par(v[0])} = ${n(c[2])}.`;

/* ---- q06 Cross product; area of a parallelogram; torque [2.4] ---- */

/* Torque τ = r × F with r in −3..3 and F in −5..5; ‖τ‖ whole from 2 to 60, at most one zero component. Not the worked
   example (⟨2, 2, 1⟩ and ⟨1, −2, 2⟩) or the learn mission (⟨2, 1, 2⟩ and ⟨1, 2, −2⟩). */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The stiff hatch wheel',
 brief: 'A hatch wheel on the survey deck has seized, and the fitter needs to know how hard a push on the bar twists it.',
 labels: ['x component (N·m)', 'y component (N·m)', 'z component (N·m)', 'twist (N·m)'], tolerance: 0.01,
 gl: [['x component (N·m)'], ['y component (N·m)', 'z component (N·m)'], ['twist (N·m)']]
}, {
 canonical: { r: [2, -3, -2], F: [2, -1, 2] },
 draw: R => { let p, c, s; do { p = { r: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], F: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)] }; c = cross(p.r, p.F); s = sq(c); }
  while (s === 0 || !isSq(s) || s < 4 || s > 3600 || c.filter(x => x === 0).length > 1 || (same(p.r, [2, 1, 2]) && same(p.F, [1, 2, -2])) || (same(p.r, [2, 2, 1]) && same(p.F, [1, -2, 2]))); return p; },
 build: ({ r, F }) => { const c = cross(r, F), s = sq(c), T = Math.round(Math.sqrt(s)); return {
  prompt: `A stiff hatch wheel on the survey deck turns about its centre. A fitter pushes on a bar: the push acts at the point r = ${V(r)} metres from the centre, with force F = ${V(F)} newtons. The torque of the push is the vector r × F. Enter the three components of r × F, x then y then z, in newton-metres, then how hard the push twists the wheel: the magnitude of the torque, in newton-metres.`,
  answer: [...c, T],
  hints: ['The torque is the cross product r × F, with r first: x = r₂F₃ − r₃F₂, y = r₃F₁ − r₁F₃, z = r₁F₂ − r₂F₁.', 'How hard the push twists is the length of the torque vector: the square root of the sum of its squared components.'],
  solution: `${crossWork(r, F, c)} So r × F = ${V(c)} newton-metres, and the twist is ‖r × F‖ = √(${squaresVal(c)}) = ${rootText(s)} newton-metres.`,
  guidance: [
   { prompt: `The x component of r × F is r₂F₃ − r₃F₂. What is it here?`, answer: [c[0]], explanation: `${par(r[1])} × ${par(F[2])} − ${par(r[2])} × ${par(F[1])} = ${n(r[1] * F[2])} − ${par(r[2] * F[1])} = ${n(c[0])}.` },
   { prompt: `The y component is r₃F₁ − r₁F₃ and the z component is r₁F₂ − r₂F₁. What are they?`, answer: [c[1], c[2]], explanation: `y: ${par(r[2])} × ${par(F[0])} − ${par(r[0])} × ${par(F[2])} = ${n(c[1])}. z: ${par(r[0])} × ${par(F[1])} − ${par(r[1])} × ${par(F[0])} = ${n(c[2])}.` },
   { prompt: `The twist is the magnitude of the torque ${V(c)}. What is it?`, answer: [T], explanation: `√(${squaresVal(c)}) = ${rootText(s)}, so the push twists with ${n(T)} newton-metres.` }
  ] }; }
});

/* A triangle is half the parallelogram on the same two edges: area ‖u × v‖ ÷ 2 (a multiple of 0.5), mass = ρ × area. u, v in −4..4. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The triangular shade sail',
 brief: 'A three-cornered shade sail will cover the survey deck, and the rigger needs the cloth to order and the load it puts on the masts.',
 labels: ['sail area (m²)', 'mass (kg)'], tolerance: 0.01,
 gl: [['x component', 'y component', 'z component'], ['sail area (m²)'], ['mass (kg)']]
}, {
 canonical: { u: [-2, 1, 2], v: [4, -5, 2], rho: 3 },
 draw: R => { let p, c, s; do { p = { u: [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], v: [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], rho: R.int(2, 6) }; c = cross(p.u, p.v); s = sq(c); }
  while (s === 0 || !isSq(s) || s < 4 || s > 1600 || c.filter(x => x === 0).length > 1 || (same(p.u, [2, 1, 2]) && same(p.v, [1, 2, -2])) || (same(p.u, [2, 2, 1]) && same(p.v, [1, -2, 2]))); return p; },
 build: ({ u, v, rho }) => { const c = cross(u, v), s = sq(c), A = Math.round(Math.sqrt(s)), area = A / 2, mass = rho * area; return {
  prompt: `A triangular shade sail is to be cut for the survey deck. Its two edges leave corner A along u = ${V(u)} and v = ${V(v)}, in metres. The triangle is exactly half of the parallelogram that u and v span. The cloth weighs ${n(rho)} kg per square metre. Enter the sail’s area in square metres, then its mass in kilograms (it may be a decimal, such as 4.5).`,
  answer: [area, mass],
  hints: ['The parallelogram on u and v has area ‖u × v‖, so first work out the cross product, component by component.', 'The sail is half of the parallelogram. Its mass is the cloth’s weight per square metre times the sail’s area.'],
  solution: `${crossWork(u, v, c)} So u × v = ${V(c)}, and the parallelogram has area ‖u × v‖ = √(${squaresVal(c)}) = ${n(A)} square metres. The sail is half of it, ${n(A)} ÷ 2 = ${n(area)} square metres. Its mass is ${n(rho)} × ${n(area)} = ${n(mass)} kg.`,
  guidance: [
   { prompt: `Work out u × v for u = ${V(u)} and v = ${V(v)}. What are its three components?`, answer: c, explanation: `${crossStep(u, v, c)}` },
   { prompt: `The parallelogram’s area is the magnitude of ${V(c)}, and the sail is half of it. What is the sail’s area in square metres?`, answer: [area], explanation: `√(${squaresVal(c)}) = ${n(A)}, and half of ${n(A)} is ${n(area)} square metres.` },
   { prompt: `The cloth weighs ${n(rho)} kg per square metre. What is the sail’s mass in kilograms?`, answer: [mass], explanation: `${n(rho)} × ${n(area)} = ${n(mass)} kg.` }
  ] }; }
});

/* Volume of the slanted crate with edges u, v, w: |w · (u × v)|, stated in the prompt. Entries in −5..5, u × v with at most one zero
   component, volume at least 5. Not the worked example or the learn mission's vectors. */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q04', title: 'The slanted storage crate',
 brief: 'A slanted storage crate is being built on the survey deck, and the store clerk needs the space inside it.',
 labels: ['x component', 'y component', 'z component', 'volume (m³)'], tolerance: 0.01,
 gl: [['x component', 'y component', 'z component'], ['w · (u × v)'], ['volume (m³)']]
}, {
 canonical: { u: [2, -1, 3], v: [1, 4, -2], w: [3, 1, 2] },
 draw: R => { let p, c, vol; do { p = { u: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], v: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], w: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)] }; c = cross(p.u, p.v); vol = Math.abs(dot(p.w, c)); }
  while (c.filter(x => x === 0).length > 1 || vol < 5 || vol > 400 || (same(p.u, [2, 1, 2]) && same(p.v, [1, 2, -2])) || (same(p.u, [2, 2, 1]) && same(p.v, [1, -2, 2]))); return p; },
 build: ({ u, v, w }) => { const c = cross(u, v), t = dot(w, c), vol = Math.abs(t), prods = c.map((x, i) => x * w[i]); return {
  prompt: `A slanted storage crate on the survey deck has three edges leaving one corner along u = ${V(u)}, v = ${V(v)} and w = ${V(w)}, in metres. Its volume is the size, without its sign, of the number w · (u × v). Enter the three components of u × v, x then y then z, then the crate’s volume in cubic metres.`,
  answer: [...c, vol],
  hints: ['u × v is the criss-cross recipe: x = u₂v₃ − u₃v₂, y = u₃v₁ − u₁v₃, z = u₁v₂ − u₂v₁. Keep the order u first.', 'Take the dot product of w with u × v: multiply matching components and add. The volume is that number without its sign.'],
  solution: `${crossWork(u, v, c)} So u × v = ${V(c)}. Then w · (u × v) = ${c.map((x, i) => `${par(w[i])} × ${par(x)}`).join(' + ')} = ${prods.map((x, i) => i ? (x < 0 ? `− ${n(-x)}` : `+ ${n(x)}`) : n(x)).join(' ')} = ${n(t)}. Without its sign that is ${n(vol)}, so the crate holds ${n(vol)} cubic metres.`,
  guidance: [
   { prompt: `Work out u × v for u = ${V(u)} and v = ${V(v)}. What are its three components?`, answer: c, explanation: `${crossStep(u, v, c)}` },
   { prompt: `Take the dot product of w = ${V(w)} with u × v = ${V(c)}. What is w · (u × v)?`, answer: [t], explanation: `${w.map((x, i) => `${par(x)} × ${par(c[i])}`).join(' + ')} = ${n(t)}. It may come out negative: that only means w points to the other side of the u, v face.` },
   { prompt: `The volume is the size of ${n(t)}, without its sign. How many cubic metres is the crate?`, answer: [vol], explanation: `The size of ${n(t)} is ${n(vol)}, so the crate holds ${n(vol)} cubic metres.` }
  ] }; }
});

/* ---- q07 Lines in space [2.5] ---- */

/* A climbing path given as a start point and a steady velocity: start + t·v reaches height h at a whole time T from 2 to 6.
   The climb is upward (v₃ in 1..3), so it is never the learn mission's descending path. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The climbing survey drone',
 brief: 'A survey drone is climbing past the dock tower, and the crew need to know when it reaches the tower’s antenna ring and where it will be.',
 labels: ['time t (s)', 'x (m)', 'y (m)'], tolerance: 0.01,
 gl: [['time t (s)'], ['x (m)', 'y (m)']]
}, {
 canonical: { s: [-3, 2, 1], v: [2, -1, 3], T: 4 },
 draw: R => { const s = [R.nz(-8, 8), R.nz(-8, 8), R.int(0, 6)]; return { s, v: [R.nz(-4, 4), R.nz(-4, 4), R.pick([1, 2, 3])], T: R.int(2, 6) }; },
 build: ({ s, v, T }) => { const h = s[2] + v[2] * T, x = s[0] + v[0] * T, y = s[1] + v[1] * T; return {
  prompt: `A survey drone is at ${P3(s)} the moment it is released (t = 0), with lengths in metres. It then flies in a straight line at a steady velocity of ${V(v)} metres per second: every second it moves by that vector. The antenna ring on the dock tower is at height z = ${n(h)}. Enter the time t, in seconds, at which the drone reaches that height, then its x and y coordinates at that moment.`,
  answer: [T, x, y],
  hints: ['After t seconds the drone is at its start point plus t times its velocity. Write the z coordinate that way and set it equal to the ring’s height.', 'Put that value of t into the x and y coordinates, written the same way.'],
  solution: `After t seconds, z = ${n(s[2])} ${term(v[2], 't')}. Setting ${n(s[2])} ${term(v[2], 't')} = ${n(h)} gives ${lead(v[2], 't')} = ${n(h - s[2])}, so t = ${n(T)} seconds. Then x = ${n(s[0])} ${pm(v[0])} × ${n(T)} = ${n(x)} and y = ${n(s[1])} ${pm(v[1])} × ${n(T)} = ${n(y)}.`,
  guidance: [
   { prompt: `The height after t seconds is ${n(s[2])} ${term(v[2], 't')}. Solve ${n(s[2])} ${term(v[2], 't')} = ${n(h)} for t. What is t?`, answer: [T], explanation: `Subtract ${n(s[2])} from both sides: ${lead(v[2], 't')} = ${n(h - s[2])}. Divide by ${n(v[2])}: t = ${n(T)}.` },
   { prompt: `After t seconds, x = ${n(s[0])} ${term(v[0], 't')} and y = ${n(s[1])} ${term(v[1], 't')}. Put in t = ${n(T)}. What are x and y?`, answer: [x, y], explanation: `x = ${n(s[0])} ${pm(v[0])} × ${n(T)} = ${n(x)} and y = ${n(s[1])} ${pm(v[1])} × ${n(T)} = ${n(y)}.` }
  ] }; }
});

/* A shuttle logged at A (t = 0) and at B = A + 2v (t = 2 seconds), steady straight flight, descending (v₃ in −1..−3) to the ring at height h
   at the whole time T from 3 to 8. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The radar-logged shuttle',
 brief: 'Radar has caught a shuttle at two moments on its approach, and the ring crew need to know when and where it will reach their height.',
 labels: ['time t (s)', 'x (m)', 'y (m)'], tolerance: 0.01,
 gl: [['x change per second', 'y change per second', 'z change per second'], ['time t (s)'], ['x (m)', 'y (m)']]
}, {
 canonical: { p: [6, -4], v: [3, 2, -2], h: 4, T: 5 },
 draw: R => { const h = R.int(1, 5), vz = R.pick([-1, -2, -3]), T = R.int(3, 8); return { p: [R.nz(-8, 8), R.nz(-8, 8)], v: [R.nz(-4, 4), R.nz(-4, 4), vz], h, T }; },
 build: ({ p, v, h, T }) => { const z0 = h - v[2] * T, A = [p[0], p[1], z0], B = A.map((x, i) => x + 2 * v[i]), x = p[0] + v[0] * T, y = p[1] + v[1] * T; return {
  prompt: `A shuttle flies a straight approach path at a steady rate. Radar logs it at A${P3(A)} when t = 0, and at B${P3(B)} when t = 2 seconds, with lengths in metres. The docking ring is at height z = ${n(h)}, and the shuttle keeps its course until it gets there. Enter the time t, in seconds, at which the shuttle reaches that height, then its x and y coordinates at that moment.`,
  answer: [T, x, y],
  hints: ['In 2 seconds the shuttle moves from A to B, so its change each second is half of B − A. That is the direction vector of the line.', 'Write z = (start z) + t × (z change per second), set it equal to the ring’s height and solve for t. Then put t into the x and y equations.'],
  solution: `In 2 seconds the shuttle moves by B − A = ${V(B.map((x, i) => x - A[i]))}, so each second it moves by ${V(v)}. Its height after t seconds is z = ${n(z0)} ${term(v[2], 't')}. Setting ${n(z0)} ${term(v[2], 't')} = ${n(h)} gives ${lead(v[2], 't')} = ${n(h - z0)}, so t = ${n(T)} seconds. Then x = ${n(p[0])} ${pm(v[0])} × ${n(T)} = ${n(x)} and y = ${n(p[1])} ${pm(v[1])} × ${n(T)} = ${n(y)}.`,
  guidance: [
   { prompt: `The shuttle moves from A${P3(A)} to B${P3(B)} in 2 seconds. How much does each coordinate change in one second?`, answer: v, explanation: `B − A = ${V(B.map((q, i) => q - A[i]))} in 2 seconds, so in one second it is half of that: ${V(v)}.` },
   { prompt: `The height after t seconds is ${n(z0)} ${term(v[2], 't')}. Solve ${n(z0)} ${term(v[2], 't')} = ${n(h)} for t. What is t?`, answer: [T], explanation: `Subtract ${n(z0)} from both sides: ${lead(v[2], 't')} = ${n(h - z0)}. Divide by ${par(v[2])}: t = ${n(T)}.` },
   { prompt: `After t seconds, x = ${n(p[0])} ${term(v[0], 't')} and y = ${n(p[1])} ${term(v[1], 't')}. Put in t = ${n(T)}. What are x and y?`, answer: [x, y], explanation: `x = ${n(p[0])} ${pm(v[0])} × ${n(T)} = ${n(x)} and y = ${n(p[1])} ${pm(v[1])} × ${n(T)} = ${n(y)}.` }
  ] }; }
});

/* Two shuttles A0 + t·dA and B0 + t·dB that meet at M at the whole time T from 2 to 5: A0 = M − T·dA and B0 = M − T·dB. dA is a
   whole-length arrangement of the first three quadruples, so the distance flown by A is T × its length; dB has x change different from dA's. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q01', title: 'Two shuttles, one gap',
 brief: 'Two shuttles left the dock on straight paths that cross, and traffic control must find the moment and the place of the near miss.',
 labels: ['time t (s)', 'x (m)', 'y (m)', 'z (m)', 'distance flown by A (m)'], tolerance: 0.01,
 gl: [['time t (s)'], ['x (m)', 'y (m)', 'z (m)'], ['distance flown by A (m)']]
}, {
 canonical: { A0: [-3, 7, -14], dA: [2, -3, 6], B0: [6, -8, -5], dB: [-1, 2, 3], T: 3, len: 7 },
 draw: R => { let p; do { const w = wholeVec(R, 3), M = [R.int(-6, 6), R.int(-6, 6), R.int(-6, 6)], T = R.int(2, 5), dB = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)];
   p = { A0: M.map((x, i) => x - T * w.v[i]), dA: w.v, B0: M.map((x, i) => x - T * dB[i]), dB, T, len: w.len }; }
  while (p.dB[0] === p.dA[0] || same(p.dA, p.dB)); return p; },
 build: ({ A0, dA, B0, dB, T, len }) => { const M = A0.map((x, i) => x + T * dA[i]), D = T * len, s = sq(dA.map(x => T * x)),
  xa = `${n(A0[0])} ${term(dA[0], 't')}`, xb = dB[0] === 0 ? n(B0[0]) : `${n(B0[0])} ${term(dB[0], 't')}`, ct = dA[0] - dB[0], rhs = B0[0] - A0[0]; return {
  prompt: `Two shuttles leave the orbital dock at the same moment, t = 0, on straight paths, with lengths in metres. Shuttle A starts at ${P3(A0)} and moves by ${V(dA)} every second. Shuttle B starts at ${P3(B0)} and moves by ${V(dB)} every second. They collide: at one moment t both are at the same point. Enter the time t of the collision in seconds, then the x, y and z coordinates of the collision point, then how far shuttle A has flown by then, in metres.`,
  answer: [T, ...M, D],
  hints: ['At the collision both shuttles have the same x coordinate at the same t. Write each x coordinate as start plus t times its change, set the two equal, and solve for t.', 'Put that t into the equations of either shuttle to get the point. The distance flown is the distance between the start point and the collision point, found with the distance formula for two points.'],
  solution: `Both shuttles have the same x when ${xa} = ${xb}. Moving the t terms to the left gives ${lead(ct, 't')} = ${n(rhs)}, so t = ${n(T)} seconds. Shuttle A is then at ${P3(M)}, and shuttle B gives the same point, so they do collide there. Shuttle A has gone from ${P3(A0)} to ${P3(M)}: the changes are ${V(dA.map(x => T * x))}, and √(${squaresVal(dA.map(x => T * x))}) = ${rootText(s)}, so it has flown ${n(D)} metres.`,
  guidance: [
   { prompt: `Set the two x coordinates equal: ${xa} = ${xb}. Solve for t. What is t?`, answer: [T], explanation: `Moving the t terms to the left gives ${lead(ct, 't')} = ${n(rhs)}, so t = ${n(T)}.` },
   { prompt: `Put t = ${n(T)} into shuttle A’s path, start ${P3(A0)} and change ${V(dA)} per second. What are the x, y and z coordinates of the collision point?`, answer: M, explanation: `${M.map((x, i) => `${n(A0[i])} ${pm(dA[i])} × ${n(T)} = ${n(x)}`).join(', ')}. Shuttle B’s path gives the same point.` },
   { prompt: `Find the distance from A’s start ${P3(A0)} to the collision point ${P3(M)}. What is it in metres?`, answer: [D], explanation: `The changes are ${V(dA.map(x => T * x))}, and √(${squaresVal(dA.map(x => T * x))}) = ${rootText(s)}, so shuttle A has flown ${n(D)} metres.` }
  ] }; }
});

/* ---- q08 Planes and their normal vectors [2.5] ---- */

/* Three points P, Q = P + a, R = P + b, as in the learn mission but P in −4..4. Not the worked example or the learn mission's bolts. */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The landing ramp',
 brief: 'Three survey pegs mark a landing ramp at the dock, and the surfacing crew want the ramp’s plane so every other peg can be checked against it.',
 labels: ['a', 'b', 'c', 'd'], tolerance: 0.01,
 gl: [['x', 'y', 'z'], ['x', 'y', 'z'], ['a', 'b', 'c'], ['d']]
}, {
 canonical: { P: [-1, 2, 0], a: [1, 3, -1], b: [2, 0, 1] },
 draw: R => { let p; do { p = { P: [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], a: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], b: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)] }; }
  while (sq(cross(p.a, p.b)) === 0 || (same(p.P, [0, 0, 1]) && same(p.a, [2, 0, 0]) && same(p.b, [0, 1, 2])) || (same(p.P, [1, 0, 2]) && same(p.a, [2, 1, 0]) && same(p.b, [0, 2, 3]))); return p; },
 build: ({ P, a, b }) => { const Q = P.map((x, i) => x + a[i]), Rr = P.map((x, i) => x + b[i]), c = cross(a, b), d = dot(c, P); return {
  prompt: `Three survey pegs mark the corners of a landing ramp at the dock: P${P3(P)}, Q${P3(Q)} and R${P3(Rr)}, in metres. Take the normal vector n = PQ × PR, where PQ runs from P to Q and PR from P to R. The ramp lies in the plane ax + by + cz = d with ⟨a, b, c⟩ = n. Enter a, b and c, then d.`,
  answer: [...c, d],
  hints: ['An arrow between two points is the end point minus the start point: PQ = Q − P and PR = R − P.', 'Take their cross product to get n, and then find d by putting the coordinates of P into ax + by + cz, because P lies in the plane.'],
  solution: `PQ = ${V(a)} and PR = ${V(b)}. Their cross product is n = ${V(c)}: ${crossWork(a, b, c)} Then d = n · P = ${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}. The ramp’s plane is ${linear(c)} = ${n(d)}.`,
  guidance: [
   { prompt: `Subtract P from Q. What are the components of PQ?`, answer: a, explanation: `PQ = ${P3(Q)} − ${P3(P)} = ${V(a)}.` },
   { prompt: `Subtract P from R. What are the components of PR?`, answer: b, explanation: `PR = ${P3(Rr)} − ${P3(P)} = ${V(b)}.` },
   { prompt: `Work out n = PQ × PR = ${V(a)} × ${V(b)}. What are a, b and c?`, answer: c, explanation: `${crossStep(a, b, c)}` },
   { prompt: `P lies in the plane, so d = n · P. What is d?`, answer: [d], explanation: `${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}.` }
  ] }; }
});

/* Plate through P, Q = P + a, R = P + b and a fourth bolt S, in the plane (half the draws) or not; the value ax + by + cz − d at S is 0 or not. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The fourth bolt',
 brief: 'A mounting plate is held by three bolts, and the inspector must find out whether a fourth bolt hole is cut true to the plate’s plane.',
 labels: ['d', 'value at S'], tolerance: 0.01,
 gl: [['a', 'b', 'c'], ['d'], ['value at S']]
}, {
 canonical: { P: [2, -1, 1], a: [1, 2, 0], b: [-1, 0, 3], S: [3, 0, 2] },
 draw: R => { let p, c, d; do { const P = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], a = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], b = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
   c = cross(a, b); d = dot(c, P);
   const al = R.int(-2, 2), be = R.int(-2, 2), S = R.bool() ? P.map((x, i) => x + al * a[i] + be * b[i]) : [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)];
   p = { P, a, b, S }; }
  while (sq(c) === 0 || same(p.S, p.P)); return p; },
 build: ({ P, a, b, S }) => { const Q = P.map((x, i) => x + a[i]), Rr = P.map((x, i) => x + b[i]), c = cross(a, b), d = dot(c, P), val = dot(c, S) - d, expr = `${linear(c)}${minusD(d)}`; return {
  prompt: `A mounting plate is held by bolts at P${P3(P)}, Q${P3(Q)} and R${P3(Rr)}, in metres. Take the normal vector n = PQ × PR, so the plate lies in the plane ax + by + cz = d with ⟨a, b, c⟩ = n. A fourth bolt hole is cut at S${P3(S)}, meant to lie in the same plane. Enter d, then the value of ${expr} at S: it is 0 exactly when S lies in the plane.`,
  answer: [d, val],
  hints: ['Take PQ = Q − P and PR = R − P, then n = PQ × PR gives a, b and c. Find d by putting the coordinates of P into ax + by + cz.', 'Put S into the left side of the plane’s equation and subtract d. A value of 0 means S is in the plane; any other value means it is off the plane.'],
  solution: `PQ = ${V(a)} and PR = ${V(b)}, so n = PQ × PR = ${V(c)}. Then d = n · P = ${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}. At S: ${linearAt(c, S)}${minusD(d)} = ${n(val)}. ${val === 0 ? 'It is 0, so S lies in the plane.' : 'It is not 0, so S is off the plane.'}`,
  guidance: [
   { prompt: `Work out n = PQ × PR, where PQ = ${V(a)} and PR = ${V(b)}. What are a, b and c?`, answer: c, explanation: `${crossStep(a, b, c)}` },
   { prompt: `P lies in the plane, so d = n · P with n = ${V(c)} and P = ${P3(P)}. What is d?`, answer: [d], explanation: `${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}.` },
   { prompt: `Put S = ${P3(S)} into ${expr}. What is the value?`, answer: [val], explanation: `${linearAt(c, S)}${minusD(d)} = ${n(val)}. ${val === 0 ? 'It is 0, so S lies in the plane.' : 'It is not 0, so S is off the plane.'}` }
  ] }; }
});

/* Panel 1 from three bolts (n₁ = PQ × PR), panel 2 in a given plane with normal n₂ in −4..4; the angle between the normals, 3 decimals,
   with the normals not parallel and the angle off a rounding tie. */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q04', title: 'Two panels, one tilt',
 brief: 'Two docking panels meet along an edge, and the fitters need the tilt between them before the seal is cut.',
 labels: ['a', 'b', 'c', 'angle (rad)'], tolerance: 0.0005,
 gl: [['a', 'b', 'c'], ['n₁ · n₂'], ['angle (rad)']]
}, {
 canonical: { P: [1, -2, 0], a: [2, 1, -1], b: [1, 0, 2], m: [1, 2, 2], e: 5 },
 draw: R => { let p, c, th; do { p = { P: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], a: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], b: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], m: [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], e: R.int(-8, 8) };
   c = cross(p.a, p.b); th = sq(c) && sq(p.m) ? Math.acos(dot(c, p.m) / Math.sqrt(sq(c) * sq(p.m))) : 0; }
  while (sq(c) === 0 || sq(p.m) === 0 || sq(cross(c, p.m)) === 0 || nearTie(th, 3)); return p; },
 build: ({ P, a, b, m, e }) => { const Q = P.map((x, i) => x + a[i]), Rr = P.map((x, i) => x + b[i]), c = cross(a, b), dt = dot(c, m), s1 = sq(c), s2 = sq(m), th = Math.acos(dt / Math.sqrt(s1 * s2)), A = round(th, 3); return {
  prompt: `Panel 1 on the orbital dock is held by three bolts at P${P3(P)}, Q${P3(Q)} and R${P3(Rr)}, in metres, with normal vector n₁ = PQ × PR. Panel 2 lies in the plane ${linear(m)} = ${n(e)}, so its normal vector is n₂ = ${V(m)}. The tilt between the panels is the angle between n₁ and n₂, taken as arccos gives it, from 0 to π, so it may be more than a right angle. Enter the three components of n₁, then that angle in radians, rounded to 3 decimal places.`,
  answer: [...c, A],
  hints: ['n₁ is the cross product of PQ = Q − P and PR = R − P. A plane’s normal vector is read straight from its equation: the numbers in front of x, y and z.', 'The cosine of the angle between two vectors is their dot product divided by the product of their magnitudes. Take arccos in radians, and round only at the end.'],
  solution: `PQ = ${V(a)} and PR = ${V(b)}, so n₁ = PQ × PR = ${V(c)}. Then n₁ · n₂ = ${c.map((x, i) => `${par(x)} × ${par(m[i])}`).join(' + ')} = ${n(dt)}, ‖n₁‖ = ${rt(s1)} and ‖n₂‖ = ${rt(s2)}. So cos θ = ${n(dt)} ÷ (${rt(s1)} × ${rt(s2)}), and θ = arccos of that, which is ${dpl(A, 3)} radians to 3 decimal places.`,
  guidance: [
   { prompt: `Work out n₁ = PQ × PR with PQ = ${V(a)} and PR = ${V(b)}. What are its components?`, answer: c, explanation: `${crossStep(a, b, c)}` },
   { prompt: `Take the dot product of n₁ = ${V(c)} and n₂ = ${V(m)}. What is n₁ · n₂?`, answer: [dt], explanation: `${c.map((x, i) => `${par(x)} × ${par(m[i])}`).join(' + ')} = ${n(dt)}.` },
   { prompt: `Here ‖n₁‖ = ${rt(s1)} and ‖n₂‖ = ${rt(s2)}. Work out arccos of ${n(dt)} ÷ (‖n₁‖ × ‖n₂‖). What is the angle in radians, to 3 decimal places?`, answer: [A], explanation: `cos θ = ${n(dt)} ÷ (${rt(s1)} × ${rt(s2)}), and θ = ${dpl(A, 3)} radians to 3 decimal places.${dt < 0 ? ' The dot product is negative, so the angle is more than a right angle (1.571 radians).' : ''}` }
  ] }; }
});

/* ---- q09 Distance from a point to a plane [2.5] ---- */

/* Plane written ax + by + cz + e = 0 (coefficients −3..3, at least two non-zero, e non-zero), a point off it, the distance not on a
   rounding tie at 2 decimals. The constant e is d with its sign turned: d = −e. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The crane hook and the hangar wall',
 brief: 'A crane hook is swinging near a sloping hangar wall, and the crane operator needs its clearance from the wall.',
 labels: ['value at the hook', 'distance (m)'], tolerance: 0.005,
 gl: [['value at the hook'], ['‖n‖²'], ['distance (m)']]
}, {
 canonical: { c: [3, -2, 1], e: 4, X: [2, -1, 3] },
 draw: R => { let p, val; do { p = { c: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], e: R.nz(-8, 8), X: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)] }; val = dot(p.c, p.X) + p.e; }
  while (p.c.filter(x => x !== 0).length < 2 || val === 0 || nearTie(Math.abs(val) / Math.sqrt(sq(p.c)), 2)); return p; },
 build: ({ c, e, X }) => { const val = dot(c, X) + e, s = sq(c), D = Math.abs(val) / Math.sqrt(s), A = round(D, 2), exact = Math.abs(D * 100 - Math.round(D * 100)) < 1e-9, expr = `${linear(c)} ${pm(e)}`; return {
  prompt: `The sloping wall of the dock hangar lies in the plane ${expr} = 0, in metres. A crane hook hangs at ${P3(X)}. Enter the value of ${expr} at the hook, then the hook’s shortest distance to the wall in metres, rounded to 2 decimal places.`,
  answer: [val, A],
  hints: ['Put the hook’s coordinates into the left side of the equation. The right side is already 0, so nothing more needs subtracting.', 'The distance is the size of that value, without its sign, divided by the magnitude of the normal vector ⟨a, b, c⟩. Round only at the end.'],
  solution: `At ${P3(X)}: ${linearAt(c, X)} ${pm(e)} = ${n(val)}. The normal vector is n = ${V(c)}, with ‖n‖ = √(${squaresVal(c)}) = ${rootText(s)}. The distance is |${n(val)}| ÷ ‖n‖ = ${n(Math.abs(val))} ÷ ${rootText(s).split(' = ').pop()}${exact ? ` = ${n(A)} ${A === 1 ? 'metre' : 'metres'}.` : `, which is ${dpl(A, 2)} metres to 2 decimal places.`}`,
  guidance: [
   { prompt: `Put x = ${n(X[0])}, y = ${n(X[1])} and z = ${n(X[2])} into ${expr}. What do you get?`, answer: [val], explanation: `${linearAt(c, X)} ${pm(e)} = ${n(val)}. It is not 0, so the hook is not on the wall.` },
   { prompt: `What is ‖n‖², the sum of the squares of the coefficients ${n(c[0])}, ${n(c[1])} and ${n(c[2])}?`, answer: [s], explanation: `${squaresVal(c)} = ${n(s)}, so ‖n‖ = ${rootText(s)}.` },
   { prompt: `Divide |${n(val)}| by √${n(s)}. What is the distance, to 2 decimal places?`, answer: [A], explanation: `${n(Math.abs(val))} ÷ √${n(s)} ${exact ? `= ${n(A)}` : `is ${dpl(A, 2)} to 2 decimal places`}. The sign of ${n(val)} only says which side of the wall the hook is on.` }
  ] }; }
});

/* A plate plane whose normal has whole length L (the first five quadruples, any order and signs), a drone X at the whole distance m on
   one side (d = n·X − side·m·L), descending along the normal at v metres per second: time = m ÷ v, all exact to 2 decimals. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The descent to the loading plate',
 brief: 'A cargo drone must come straight down onto a tilted loading plate, and the controller needs the gap and the time the descent will take.',
 labels: ['value at the drone', 'distance (m)', 'time (s)'], tolerance: 0.005,
 gl: [['value at the drone'], ['distance (m)'], ['time (s)']]
}, {
 /* The value at the drone has sign side; the foot of the shortest path is X − (value ÷ L²)c, so side × c_z > 0 keeps it a real descent. */
 canonical: { c: [2, 3, 6], L: 7, X: [1, -2, 3], m: 4, side: 1, v: 2 },
 draw: R => { let p; do { const w = wholeVec(R, 5); p = { c: w.v, L: w.len, X: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], m: R.int(2, 7), side: R.pick([-1, 1]), v: R.pick([0.5, 2, 4, 5]) }; } while (p.side * p.c[2] <= 0); return p; },
 build: ({ c, L, X, m, side, v }) => { const val = side * m * L, d = dot(c, X) - val, t = m / v, s = L * L; return {
  prompt: `A tilted loading plate at the orbital dock lies in the plane ${linear(c)} = ${n(d)}, in metres, and the controller treats it as extending as far as it needs to. A cargo drone hovers at ${P3(X)}. It will descend straight along the shortest path to the plate at a steady ${n(v)} metres per second. Enter the value of ${linear(c)}${minusD(d)} at the drone, then the drone’s shortest distance to the plate in metres, then the time the descent takes in seconds.`,
  answer: [val, m, t],
  hints: ['Put the drone’s coordinates into the left side of the plane’s equation and subtract the right side. The distance is the size of that value, without its sign, divided by the magnitude of the normal vector ⟨a, b, c⟩.', 'The time is the distance divided by the speed.'],
  solution: `At ${P3(X)}: ${linearAt(c, X)}${minusD(d)} = ${n(val)}. The normal vector is n = ${V(c)}, with ‖n‖ = √(${squaresVal(c)}) = ${rootText(s)}. The distance is |${n(val)}| ÷ ${n(L)} = ${n(m)} metres. At ${n(v)} metres per second the descent takes ${n(m)} ÷ ${n(v)} = ${pl(t, 'second')}.`,
  guidance: [
   { prompt: `Put x = ${n(X[0])}, y = ${n(X[1])} and z = ${n(X[2])} into ${linear(c)}${minusD(d)}. What do you get?`, answer: [val], explanation: `${linearAt(c, X)}${minusD(d)} = ${n(val)}. It is not 0, so the drone is not in the plane.` },
   { prompt: `The normal vector is ${V(c)}, with magnitude ${n(L)}. Divide |${n(val)}| by ${n(L)}. What is the distance in metres?`, answer: [m], explanation: `${n(Math.abs(val))} ÷ ${n(L)} = ${n(m)} metres. The sign of ${n(val)} only says which side of the plate the drone is on.` },
   { prompt: `The drone covers ${n(m)} metres at ${n(v)} metres per second. How many seconds does the descent take?`, answer: [t], explanation: `${n(m)} ÷ ${n(v)} = ${pl(t, 'second')}.` }
  ] }; }
});

/* Three bolts P, Q = P + a, R = P + b give the plane (n = PQ × PR, d = n · P); a drone off the plane, the distance not on a tie at 2 decimals. */
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q08', title: 'The drone and the three bolts',
 brief: 'A guide panel is fixed by three bolts and nobody has written down its plane, but a drone is hovering close and needs its clearance now.',
 labels: ['d', 'value at the drone', 'distance (m)'], tolerance: 0.005,
 gl: [['a', 'b', 'c'], ['d'], ['value at the drone'], ['distance (m)']]
}, {
 canonical: { P: [1, 0, -1], a: [2, 1, 0], b: [1, -1, 2], X: [3, 2, 1] },
 draw: R => { let p, c, val; do { p = { P: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], a: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], b: [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)], X: [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)] };
   c = cross(p.a, p.b); val = dot(c, p.X) - dot(c, p.P); }
  while (sq(c) === 0 || val === 0 || nearTie(Math.abs(val) / Math.sqrt(sq(c)), 2)); return p; },
 build: ({ P, a, b, X }) => { const Q = P.map((x, i) => x + a[i]), Rr = P.map((x, i) => x + b[i]), c = cross(a, b), d = dot(c, P), val = dot(c, X) - d, s = sq(c), D = Math.abs(val) / Math.sqrt(s), A = round(D, 2),
  exact = Math.abs(D * 100 - Math.round(D * 100)) < 1e-9, expr = `${linear(c)}${minusD(d)}`; return {
  prompt: `A guide panel at the orbital dock is held by three bolts at P${P3(P)}, Q${P3(Q)} and R${P3(Rr)}, in metres. Take the normal vector n = PQ × PR, so the panel lies in the plane ax + by + cz = d with ⟨a, b, c⟩ = n. A maintenance drone hovers at ${P3(X)}. Enter d, then the value of ax + by + cz − d at the drone, then the drone’s shortest distance to the plane in metres, rounded to 2 decimal places.`,
  answer: [d, val, A],
  hints: ['Take PQ = Q − P and PR = R − P, then n = PQ × PR gives a, b and c. Find d by putting the coordinates of P into ax + by + cz.', 'Put the drone’s coordinates into ax + by + cz − d. The distance is the size of that value, without its sign, divided by the magnitude of n. Round only at the end.'],
  solution: `PQ = ${V(a)} and PR = ${V(b)}, so n = PQ × PR = ${V(c)} and d = n · P = ${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}. At ${P3(X)}: ${linearAt(c, X)}${minusD(d)} = ${n(val)}. With ‖n‖ = √(${squaresVal(c)}) = ${rootText(s)}, the distance is ${n(Math.abs(val))} ÷ ${rootText(s).split(' = ').pop()}${exact ? ` = ${n(A)} ${A === 1 ? 'metre' : 'metres'}.` : `, which is ${dpl(A, 2)} metres to 2 decimal places.`}`,
  guidance: [
   { prompt: `Work out n = PQ × PR with PQ = ${V(a)} and PR = ${V(b)}. What are a, b and c?`, answer: c, explanation: `${crossStep(a, b, c)}` },
   { prompt: `P lies in the plane, so d = n · P with n = ${V(c)} and P = ${P3(P)}. What is d?`, answer: [d], explanation: `${c.map((x, i) => `${par(x)} × ${par(P[i])}`).join(' + ')} = ${n(d)}.` },
   { prompt: `Put x = ${n(X[0])}, y = ${n(X[1])} and z = ${n(X[2])} into ${expr}. What do you get?`, answer: [val], explanation: `${linearAt(c, X)}${minusD(d)} = ${n(val)}. It is not 0, so the drone is not in the plane.` },
   { prompt: `Divide |${n(val)}| by ‖n‖ = √${n(s)}. What is the distance, to 2 decimal places?`, answer: [A], explanation: `${n(Math.abs(val))} ÷ √${n(s)} ${exact ? `= ${n(A)}` : `is ${dpl(A, 2)} to 2 decimal places`}. The sign of ${n(val)} only says which side of the plane the drone is on.` }
  ] }; }
});

/* ---- q10 Vector-valued functions: velocity, speed, acceleration [3.2, 3.4] ---- */

/* r(t) = ⟨a t² + b t, (c ÷ π) cos(πt), e t²⟩ at a half-whole time T (0.5, 1.5, 2.5, 3.5), where sin(πT) is 1 or −1 and the velocity is whole;
   the speed is not on a rounding tie. The parent uses sin and whole times, so this is never its draw. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The swinging crane hook',
 brief: 'A crane hook swings out over the dock deck on a programmed path, and the safety officer wants its velocity and speed at one instant.',
 labels: ['x velocity (m/s)', 'y velocity (m/s)', 'z velocity (m/s)', 'speed (m/s)'], tolerance: 0.005,
 gl: [['x velocity (m/s)'], ['y velocity (m/s)', 'z velocity (m/s)'], ['speed (m/s)']]
}, {
 canonical: { a: 3, b: -2, c: 5, e: -2, T: 1.5 },
 draw: R => { let p; do { p = { a: R.int(2, 4), b: R.nz(-6, 6), c: R.int(2, 9), e: R.pick([-3, -2, -1, 1, 2, 3]), T: R.pick([0.5, 1.5, 2.5, 3.5]) }; }
  while (nearTie(Math.hypot(2 * p.a * p.T + p.b, p.c, 2 * p.e * p.T), 2)); return p; },
 build: ({ a, b, c, e, T }) => { const sn = Math.round(Math.sin(Math.PI * T)), vx = 2 * a * T + b, vy = -c * sn, vz = 2 * e * T, s = vx * vx + vy * vy + vz * vz, S = round(Math.sqrt(s), 2),
  exact = Math.abs(Math.sqrt(s) * 100 - Math.round(Math.sqrt(s) * 100)) < 1e-9, zt = lead(e, 't²'), dz = lead(2 * e, 't'); return {
  prompt: `A crane hook swings out over the dock deck along r(t) = ⟨${n(a)}t² ${term(b, 't')}, (${n(c)} ÷ π) cos(πt), ${zt}⟩ metres, t seconds after it starts (the cosine works in radians). Enter its velocity at t = ${n(T)}, as x, y and z components in metres per second, then its speed at that moment in metres per second, rounded to 2 decimal places.`,
  answer: [vx, vy, vz, S],
  hints: ['Velocity is the derivative of the position, taken one component at a time. For the middle one, the chain rule gives the derivative of cos(πt) as −π sin(πt).', 'Speed is the magnitude of the velocity: the square root of the sum of its squared components. Round only at the end.'],
  solution: `v(t) = r′(t) = ⟨${n(2 * a)}t ${pm(b)}, −${n(c)} sin(πt), ${dz}⟩. At t = ${n(T)}: ${n(2 * a)} × ${n(T)} ${pm(b)} = ${n(vx)}, −${n(c)} sin(${n(T)}π) = −${n(c)} × ${par(sn)} = ${n(vy)}, and ${n(2 * e)} × ${n(T)} = ${n(vz)}. So v(${n(T)}) = ${V([vx, vy, vz])} m/s. The speed is √(${squaresVal([vx, vy, vz])}) = √${n(s)}${exact ? ` = ${n(S)} m/s.` : `, which is ${dpl(S, 2)} m/s to 2 decimal places.`}`,
  guidance: [
   { prompt: `Differentiate the x component ${n(a)}t² ${term(b, 't')} and put in t = ${n(T)}. What is the x velocity?`, answer: [vx], explanation: `The derivative is ${n(2 * a)}t ${pm(b)}, and ${n(2 * a)} × ${n(T)} ${pm(b)} = ${n(vx)}.` },
   { prompt: `The derivative of (${n(c)} ÷ π) cos(πt) is −${n(c)} sin(πt), and the derivative of ${zt} is ${dz}. What are the y and z velocities at t = ${n(T)}?`, answer: [vy, vz], explanation: `sin(${n(T)}π) = ${n(sn)}, so y: −${n(c)} × ${par(sn)} = ${n(vy)}. z: ${n(2 * e)} × ${n(T)} = ${n(vz)}.` },
   { prompt: `The velocity is ${V([vx, vy, vz])}. What is the speed, its magnitude, to 2 decimal places?`, answer: [S], explanation: `√(${squaresVal([vx, vy, vz])}) = √${n(s)}${exact ? ` = ${n(S)}` : `, which is ${dpl(S, 2)} to 2 decimal places`}.` }
  ] }; }
});

/* r(t) = ⟨p t³ + u t, q t² + w t, s t³⟩: the acceleration r″(T) = ⟨6pT, 2q, 6sT⟩, and thrust = m × ‖a‖ to 2 decimals (not on a tie). */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The thrust for the lifter',
 brief: 'A cargo lifter is hauling a crate along a programmed path, and the engineer needs the thrust its motors must give at one moment.',
 labels: ['x acceleration (m/s²)', 'y acceleration (m/s²)', 'z acceleration (m/s²)', 'thrust (N)'], tolerance: 0.005,
 gl: [['x acceleration (m/s²)', 'y acceleration (m/s²)', 'z acceleration (m/s²)'], ['sum of squares'], ['thrust (N)']]
}, {
 canonical: { p: 1, u: -3, q: 2, w: 4, s: 1, T: 2, m: 5 },
 draw: R => { let p; do { p = { p: R.int(1, 3), u: R.nz(-5, 5), q: R.nz(-4, 4), w: R.nz(-5, 5), s: R.nz(-3, 3), T: R.int(1, 3), m: R.pick([2, 3, 4, 5, 8, 10]) }; }
  while (nearTie(p.m * Math.hypot(6 * p.p * p.T, 2 * p.q, 6 * p.s * p.T), 2)); return p; },
 build: ({ p, u, q, w, s, T, m }) => { const ax = 6 * p * T, ay = 2 * q, az = 6 * s * T, S = ax * ax + ay * ay + az * az, F = round(m * Math.sqrt(S), 2), exact = Math.abs(m * Math.sqrt(S) * 100 - Math.round(m * Math.sqrt(S) * 100)) < 1e-9,
  X = `${lead(p, 't³')} ${term(u, 't')}`, Y = `${lead(q, 't²')} ${term(w, 't')}`, Z = lead(s, 't³'); return {
  prompt: `A cargo lifter at the orbital dock carries ${m === 8 ? 'an' : 'a'} ${n(m)} kg crate along r(t) = ⟨${X}, ${Y}, ${Z}⟩ metres, t seconds after the start. Ignore gravity: the thrust the motors give is the crate’s mass times the magnitude of its acceleration, in newtons. Enter the acceleration at t = ${n(T)}, as x, y and z components in metres per second squared, then the thrust at that moment in newtons, rounded to 2 decimal places.`,
  answer: [ax, ay, az, F],
  hints: ['Acceleration is the derivative of the velocity, which is the derivative of the position: differentiate each component twice, then put in the time.', 'The magnitude of the acceleration is the square root of the sum of its squared components. Multiply it by the mass, and round only at the end.'],
  solution: `Differentiating once gives v(t) = ⟨${lead(3 * p, 't²')} ${pm(u)}, ${lead(2 * q, 't')} ${pm(w)}, ${lead(3 * s, 't²')}⟩, and again gives a(t) = ⟨${lead(6 * p, 't')}, ${n(2 * q)}, ${lead(6 * s, 't')}⟩. At t = ${n(T)}: a = ${V([ax, ay, az])} m/s². Then ‖a‖ = √(${squaresVal([ax, ay, az])}) = ${rootText(S)}, and the thrust is ${n(m)} × ‖a‖${exact ? ` = ${n(F)} newtons.` : `, which is ${dpl(F, 2)} newtons to 2 decimal places.`}`,
  guidance: [
   { prompt: `Differentiate each component of r(t) twice and put in t = ${n(T)}. What are the x, y and z accelerations?`, answer: [ax, ay, az], explanation: `The second derivatives are ${lead(6 * p, 't')}, ${n(2 * q)} and ${lead(6 * s, 't')}. At t = ${n(T)} they are ${n(ax)}, ${n(ay)} and ${n(az)}.` },
   { prompt: `Square the components of ${V([ax, ay, az])} and add them. What is the total?`, answer: [S], explanation: `${squaresVal([ax, ay, az])} = ${n(S)}, so ‖a‖ = ${rootText(S)}.` },
   { prompt: `The thrust is ${n(m)} × √${n(S)}. What is it in newtons, to 2 decimal places?`, answer: [F], explanation: `${n(m)} × √${n(S)} ${exact ? `= ${n(F)} newtons.` : `is ${dpl(F, 2)} newtons to 2 decimal places.`}` }
  ] }; }
});

/* r(t) = ⟨p t² + u t, (c ÷ (2π)) sin(2πt), s t³⟩ at a whole time T: the position estimate r(T) + 0.5·v(T), where v = ⟨2pT + u, c cos(2πT), 3sT²⟩ = ⟨…, c, …⟩. */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q02', title: 'The half-second forecast',
 brief: 'Traffic control wants a quick forecast of where a cargo drone will be half a second from now, built from its position and velocity.',
 labels: ['estimated x (m)', 'estimated y (m)', 'estimated z (m)'], tolerance: 0.01,
 gl: [['x velocity (m/s)', 'y velocity (m/s)', 'z velocity (m/s)'], ['x (m)', 'y (m)', 'z (m)'], ['estimated x (m)', 'estimated y (m)', 'estimated z (m)']]
}, {
 canonical: { p: 2, u: -3, c: 4, s: 1, T: 2 },
 draw: R => ({ p: R.int(2, 4), u: R.nz(-5, 5), c: R.int(2, 9), s: R.pick([-2, -1, 1, 2]), T: R.int(1, 3) }),
 build: ({ p, u, c, s, T }) => { const v = [2 * p * T + u, c, 3 * s * T * T], r = [p * T * T + u * T, 0, s * T * T * T], est = r.map((x, i) => x + 0.5 * v[i]),
  X = `${n(p)}t² ${term(u, 't')}`, Z = lead(s, 't³'); return {
  prompt: `A cargo drone flies along r(t) = ⟨${X}, (${n(c)} ÷ (2π)) sin(2πt), ${Z}⟩ metres, t seconds after release (the sine works in radians). To forecast where it will be half a second after t = ${n(T)}, the controller adds half of the velocity to the current position: forecast = r(${n(T)}) + 0.5 × v(${n(T)}). Enter the x, y and z coordinates of the forecast, in metres.`,
  answer: est,
  hints: ['Differentiate each component for the velocity. For the middle one, the chain rule gives the derivative of sin(2πt) as 2π cos(2πt), and the 2π cancels the one in front.', 'Put the time into r(t) and into v(t). Then scale v by 0.5 and add it to r, component by component.'],
  solution: `v(t) = r′(t) = ⟨${n(2 * p)}t ${pm(u)}, ${n(c)} cos(2πt), ${lead(3 * s, 't²')}⟩. At t = ${n(T)}: v = ⟨${n(2 * p)} × ${n(T)} ${pm(u)}, ${n(c)} × 1, ${n(3 * s)} × ${n(T * T)}⟩ = ${V(v)}. The position is r(${n(T)}) = ⟨${n(p)} × ${n(T * T)} ${pm(u)} × ${n(T)}, 0, ${n(s)} × ${n(T * T * T)}⟩ = ${V(r)}, because sin(${n(2 * T)}π) = 0. The forecast is ${V(r)} + 0.5 × ${V(v)} = ${V(est)}.`,
  guidance: [
   { prompt: `Differentiate each component of r(t) and put in t = ${n(T)}. What are the x, y and z velocities?`, answer: v, explanation: `v(t) = ⟨${n(2 * p)}t ${pm(u)}, ${n(c)} cos(2πt), ${lead(3 * s, 't²')}⟩. At t = ${n(T)}, cos(${n(2 * T)}π) = 1, so v = ${V(v)}.` },
   { prompt: `Put t = ${n(T)} into r(t). What are the x, y and z coordinates of the position?`, answer: r, explanation: `x = ${n(p)} × ${n(T * T)} ${pm(u)} × ${n(T)} = ${n(r[0])}, y = 0 because sin(${n(2 * T)}π) = 0, and z = ${n(s)} × ${n(T * T * T)} = ${n(r[2])}. So r = ${V(r)}.` },
   { prompt: `Work out ${V(r)} + 0.5 × ${V(v)}. What are the three components of the forecast?`, answer: est, explanation: `Half of ${V(v)} is ${V(v.map(x => x / 2))}. Adding component by component gives ${V(est)}.` }
  ] }; }
});

})();
