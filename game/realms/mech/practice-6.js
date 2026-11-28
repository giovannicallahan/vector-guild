/* Mechanics: motion and force practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p6.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };


/* Builds the authored mission from build(canonical), so the authored text and the generator cannot drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((s, i) => ({ prompt: s.prompt, answer: s.answer, labels: gl[i], explanation: s.explanation })) }, gen);
};
const g = 9.8, T = G.tidy, vec = G.vec;
/* r2 rounds to 2 decimal places; f2 prints that. */
const r2 = x => Math.round(x * 100) / 100, f2 = x => n(r2(x));
/* A value is safe to ask to 2 decimal places when it is not near a rounding tie (…5 in the third place). */
const safe = (...xs) => xs.every(x => { const f = Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100); return Math.abs(f - 0.5) > 0.02; });
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canonical }; };
const same = (p, q) => Object.keys(q).every(k => p[k] === q[k]);
/* A coefficient in front of a letter term, never a written-out 1. */
/* Plural of radian: "1 radian", "0.4 radians". */
const rad = th => th === 1 ? 'radian' : 'radians';
const co = (k, x) => k === 1 ? x : `${n(k)}${x}`;
/* Never the parent's worked example: q26 (100 N, 5 m, 0.3 rad), q27 (50 kg, 4 m/s), q28 (100 kg, 10 m, 25 s, 5 kW),
   q29 (50 kg, 10 m, 138 N, 0.2), q30 (100 kg, 5 m, 2 m, k = 1000, 0.2 m). */

/* ---- q26 Work by a constant force and by a varying force (an integral) [7.1] ---- */

/* q26b: W1 = Fd cos θ; F(x) = px² + q has antiderivative (p/3)x³ + qx. */
const q26bv = ({ F, d, th, p, q, x1, x2 }) => { const Fx = F * Math.cos(th), W1 = Fx * d, c3 = p / 3, A = x => c3 * x * x * x + q * x;
 return { Fx, W1, c3, A1: T(A(x1)), A2: T(A(x2)), W2: T(A(x2) - A(x1)) }; };
mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Tow line and press on the loading dock',
 brief: 'The loading dock tows pallets and presses plates all day, and the Engine Hall wants the energy each job takes.',
 labels: ['work by the tow line (J)', 'work by the press (J)'], tolerance: 0.005,
 gl: [['pull along the ground (N)'], ['work by the tow line (J)'], ['antiderivative at the end (J)'], ['antiderivative at the start (J)'], ['work by the press (J)']]
}, {
 canonical: { F: 180, d: 25, th: 0.4, p: 9, q: 4, x1: 2, x2: 5 },
 draw: R => tryDraw(() => { const x1 = R.int(0, 3); return { F: 10 * R.int(8, 40), d: R.int(5, 40), th: R.int(1, 12) / 10, p: 3 * R.int(1, 5), q: 2 * R.int(1, 8), x1, x2: x1 + R.int(1, 3) }; },
  p => { if (same(p, { F: 250, d: 12, th: 0.5 }) || same(p, { F: 100, d: 5, th: 0.3 })) return false; const v = q26bv(p); return safe(v.Fx, v.W1); }, { F: 180, d: 25, th: 0.4, p: 9, q: 4, x1: 2, x2: 5 }),
 build: p => { const { F, d, th, p: pp, q, x1, x2 } = p, v = q26bv({ F, d, th, p: pp, q, x1, x2 }), fx = `${co(pp, 'x²')} + ${n(q)}`, anti = `${co(v.c3, 'x³')} + ${co(q, 'x')}`; return {
  prompt: `A tractor on the loading dock tows a pallet ${n(d)} m across level ground. The tow line pulls with a constant ${n(F)} N and makes an angle of ${n(th)} ${rad(th)} with the ground. Then a hydraulic press pushes a plate along a straight rail from x = ${n(x1)} m to x = ${n(x2)} m, with a force along the rail, in the direction of increasing x, of F(x) = ${fx} newtons (x in metres). Enter the work done by the tow line on the pallet, in joules to 2 decimal places, then the work done by the press on the plate, in joules. Do not round until the last step. Type the numbers without commas.`,
  answer: [r2(v.W1), v.W2],
  hints: ['Only the part of a force along the motion does work. For a constant force at an angle θ to the motion, W = Fd cos θ, with θ in radians (put your calculator in radian mode).', 'When a force changes with position, the work is the definite integral of F(x) from the start to the end. Find an antiderivative of F(x), then subtract its value at the start from its value at the end.'],
  solution: `Tow line: the part of the pull along the ground is ${n(F)} × cos ${n(th)} ≈ ${f2(v.Fx)} N, so W = Fd cos θ = ${n(F)} × ${n(d)} × cos ${n(th)} ≈ ${f2(v.W1)} J. Press: W = ∫ (${fx}) dx from ${n(x1)} to ${n(x2)}. An antiderivative is ${anti}. At x = ${n(x2)} it is ${n(v.A2)} and at x = ${n(x1)} it is ${n(v.A1)}, so W = ${n(v.A2)} − ${n(v.A1)} = ${n(v.W2)} J.`,
  guidance: [
   { prompt: `What is the part of the tow line’s pull along the ground, F cos θ, in newtons to 2 decimal places?`, answer: [r2(v.Fx)], explanation: `F cos θ = ${n(F)} × cos ${n(th)} ≈ ${f2(v.Fx)} N. The rest of the pull lifts a little on the pallet and does no work along the ground.` },
   { prompt: `What work does the tow line do over the ${n(d)} m, Fd cos θ, in joules to 2 decimal places?`, answer: [r2(v.W1)], explanation: `W = ${n(F)} × ${n(d)} × cos ${n(th)} ≈ ${f2(v.W1)} J.` },
   { prompt: `An antiderivative of ${fx} is ${anti}. What is its value at the end, x = ${n(x2)}, in joules?`, answer: [v.A2], explanation: `${n(v.c3)} × ${n(x2 ** 3)} + ${n(q)} × ${n(x2)} = ${n(v.A2)}.` },
   { prompt: `What is its value at the start, x = ${n(x1)}, in joules?`, answer: [v.A1], explanation: `${n(v.c3)} × ${n(x1 ** 3)} + ${n(q)} × ${n(x1)} = ${n(v.A1)}.` },
   { prompt: `The press’s work is the end value minus the start value. What is it, in joules?`, answer: [v.W2], explanation: `W = ${n(v.A2)} − ${n(v.A1)} = ${n(v.W2)} J.` }
  ] }; }
});

/* q26c: haul work Fd cos θ plus ram work ∫ ax³ dx = (a/4)x⁴; mean force = work ÷ distance pushed. */
const q26cv = ({ F, d, th, a, x1, x2 }) => { const Fx = F * Math.cos(th), W1 = Fx * d, a4 = a / 4, A = x => a4 * x ** 4, W2 = T(A(x2) - A(x1)), len = x2 - x1;
 return { Fx, W1, a4, A1: T(A(x1)), A2: T(A(x2)), W2, len, mean: W2 / len, tot: W1 + W2 }; };
mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Hauler and ram: the wagon’s energy bill',
 brief: 'A wagon is hauled along a rail and then shoved onward by a ram, and the Engine Hall wants the whole energy bill for the trip.',
 labels: ['total work (J)', 'mean ram force (N)'], tolerance: 0.005,
 gl: [['work by the cable (J)'], ['work by the ram (J)'], ['mean ram force (N)']]
}, {
 canonical: { F: 300, d: 40, th: 0.35, a: 8, x1: 0, x2: 3 },
 draw: R => tryDraw(() => { const x1 = R.int(0, 2); return { F: 10 * R.int(15, 45), d: R.int(10, 60), th: R.int(1, 12) / 10, a: 4 * R.int(1, 6), x1, x2: x1 + R.int(1, 3) }; },
  p => { if (same(p, { F: 250, d: 12, th: 0.5 }) || same(p, { F: 100, d: 5, th: 0.3 })) return false; const v = q26cv(p); return safe(v.Fx, v.W1, v.tot, v.mean); }, { F: 300, d: 40, th: 0.35, a: 8, x1: 0, x2: 3 }),
 build: p => { const { F, d, th, a, x1, x2 } = p, v = q26cv(p), fx = `${co(a, 'x³')}`, anti = co(v.a4, 'x⁴'); return {
  prompt: `A rail hauler in the Engine Hall drags a wagon ${n(d)} m along a level rail with a steady ${n(F)} N pull, and the cable makes an angle of ${n(th)} ${rad(th)} with the rail. At the end of the rail a ram then shoves the same wagon along a straight track from x = ${n(x1)} m to x = ${n(x2)} m, with a force along the track, in the direction of increasing x, of F(x) = ${fx} newtons (x in metres). The ram’s mean force over its stretch is its work divided by the distance it pushes. Enter the total work done on the wagon by the cable and the ram together, in joules to 2 decimal places, then the ram’s mean force, in newtons to 2 decimal places. Do not round until the last step. Type the numbers without commas.`,
  answer: [r2(v.tot), r2(v.mean)],
  hints: ['Treat the two stages separately and add their works. The cable’s pull is steady but at an angle to the motion, so only F cos θ does work; the ram’s force changes with position, so integrate it.', 'The work of a force that changes with position is the definite integral of F(x) from the start to the end of the stretch. The mean force is that work divided by the length of the stretch, x at the end minus x at the start.'],
  solution: `Cable: W = Fd cos θ = ${n(F)} × ${n(d)} × cos ${n(th)} ≈ ${f2(v.W1)} J. Ram: W = ∫ ${fx} dx from ${n(x1)} to ${n(x2)}. An antiderivative is ${anti}, which is ${n(v.A2)} at x = ${n(x2)} and ${n(v.A1)} at x = ${n(x1)}, so the ram does ${n(v.W2)} J. The total is ≈ ${f2(v.W1)} + ${n(v.W2)} ≈ ${f2(v.tot)} J. The ram pushes through ${n(v.len)} m, so its mean force is ${n(v.W2)} ÷ ${n(v.len)} ≈ ${f2(v.mean)} N.`,
  guidance: [
   { prompt: `What work does the cable do over the ${n(d)} m, Fd cos θ, in joules to 2 decimal places?`, answer: [r2(v.W1)], explanation: `W = ${n(F)} × ${n(d)} × cos ${n(th)} ≈ ${f2(v.W1)} J.` },
   { prompt: `An antiderivative of ${fx} is ${anti}. What work does the ram do from x = ${n(x1)} to x = ${n(x2)}, in joules?`, answer: [v.W2], explanation: `${n(v.A2)} − ${n(v.A1)} = ${n(v.W2)} J.` },
   { prompt: `The ram pushes through ${n(v.len)} m. What is its mean force, the ram’s work divided by that distance, in newtons to 2 decimal places?`, answer: [r2(v.mean)], explanation: `${n(v.W2)} ÷ ${n(v.len)} ≈ ${f2(v.mean)} N.` }
  ] }; }
});

/* q26d: W = F · d for a constant force vector over two legs given as positions; displacement = end − start. */
const q26dv = ({ fx, fy, ax, ay, bx, by, cx, cy }) => { const d1 = [bx - ax, by - ay], d2 = [cx - bx, cy - by], dt = [cx - ax, cy - ay], dot = d => fx * d[0] + fy * d[1];
 return { d1, d2, dt, W1: dot(d1), W2: dot(d2), Wt: dot(dt) }; };
mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q05', title: 'Two legs across the Engine Hall floor',
 brief: 'A sled is dragged round a corner of the Engine Hall floor by a steady pull, and the crew wants the work on each leg.',
 labels: ['work on A to B (J)', 'work on B to C (J)', 'work straight A to C (J)'], tolerance: 0.01,
 gl: [['work on A to B (J)'], ['work on B to C (J)'], ['work straight A to C (J)']]
}, {
 canonical: { fx: 40, fy: -30, ax: 0, ay: 0, bx: 6, by: 2, cx: 1, cy: 6 },
 draw: R => tryDraw(() => ({ fx: 10 * R.nz(-9, 9), fy: 10 * R.nz(-9, 9), ax: R.int(-5, 5), ay: R.int(-5, 5), bx: R.int(-8, 8), by: R.int(-8, 8), cx: R.int(-8, 8), cy: R.int(-8, 8) }),
  p => { const v = q26dv(p); return v.d1.some(x => x !== 0) && v.d2.some(x => x !== 0) && v.W1 !== 0 && v.W2 !== 0 && v.W1 !== v.W2 && v.Wt !== v.W1 && v.Wt !== v.W2; }, { fx: 40, fy: -30, ax: 0, ay: 0, bx: 6, by: 2, cx: 1, cy: 6 }),
 build: p => { const { fx, fy, ax, ay, bx, by, cx, cy } = p, v = q26dv(p), F = vec([fx, fy]), A = vec([ax, ay]), B = vec([bx, by]), C = vec([cx, cy]); return {
  prompt: `A winch in the Engine Hall drags a sled over the floor with a pull that never changes: the force F = ${F} newtons, written as (x component, y component) along the floor’s x and y directions. Positions on the floor are written (x, y) in metres. The sled starts at A = ${A}, is dragged to B = ${B}, and then on to C = ${C}. The work of a constant force is the dot product F · d of the force with the displacement d, which is F_x × d_x + F_y × d_y, and a displacement is the end position minus the start position, component by component. Work can be negative. Enter the work done on the leg from A to B, then on the leg from B to C (with its sign), then the work the same pull would do if the sled went straight from A to C, all in joules. Type the numbers without commas.`,
  answer: [v.W1, v.W2, v.Wt],
  hints: ['Find each displacement first: end position minus start position, one component at a time. Then multiply matching components of the force and the displacement and add the two products.', 'A negative answer means the pull has a part against the motion on that leg. For the straight run, use the displacement from A to C in the same way.'],
  solution: `A to B: d = B − A = ${vec(v.d1)} m, so W = F · d = ${par(fx)} × ${par(v.d1[0])} + ${par(fy)} × ${par(v.d1[1])} = ${n(v.W1)} J. B to C: d = C − B = ${vec(v.d2)} m, so W = ${par(fx)} × ${par(v.d2[0])} + ${par(fy)} × ${par(v.d2[1])} = ${n(v.W2)} J. Straight from A to C: d = C − A = ${vec(v.dt)} m, so W = ${par(fx)} × ${par(v.dt[0])} + ${par(fy)} × ${par(v.dt[1])} = ${n(v.Wt)} J.`,
  guidance: [
   { prompt: `The displacement from A to B is B − A = ${vec(v.d1)} m. What is F · d for this leg, in joules?`, answer: [v.W1], explanation: `${par(fx)} × ${par(v.d1[0])} + ${par(fy)} × ${par(v.d1[1])} = ${n(v.W1)} J.` },
   { prompt: `The displacement from B to C is C − B = ${vec(v.d2)} m. What is F · d for this leg, in joules, with its sign?`, answer: [v.W2], explanation: `${par(fx)} × ${par(v.d2[0])} + ${par(fy)} × ${par(v.d2[1])} = ${n(v.W2)} J.` },
   { prompt: `The displacement from A straight to C is C − A = ${vec(v.dt)} m. What is F · d, in joules?`, answer: [v.Wt], explanation: `${par(fx)} × ${par(v.dt[0])} + ${par(fy)} × ${par(v.dt[1])} = ${n(v.Wt)} J. For a constant force this equals the two legs added: ${n(v.W1)} + ${par(v.W2)} = ${n(v.Wt)} J.` }
  ] }; }
});

/* ---- q27 Kinetic energy and the work-energy theorem [7.2, 7.3] ---- */

/* q27b: K = ½mv² at each end; the net work needed is the change in K, with its sign. */
const q27bv = ({ m, v0, v1 }) => { const K0 = m * v0 * v0 / 2, K1 = m * v1 * v1 / 2; return { K0, K1, W: K1 - K0 }; };
mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'A cart through the speed gate',
 brief: 'A loaded cart must enter a stretch of the test track at one speed and leave it at another, and the crew wants the energy bill.',
 labels: ['kinetic energy on entering (J)', 'kinetic energy on leaving (J)', 'net work needed (J)'], tolerance: 0.01,
 gl: [['kinetic energy on entering (J)'], ['kinetic energy on leaving (J)'], ['net work needed (J)']]
}, {
 canonical: { m: 160, v0: 9, v1: 5 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(5, 40), v0: R.int(2, 15), v1: R.int(1, 15) }), p => p.v0 !== p.v1 && !same(p, { m: 50, v0: 4 }), { m: 160, v0: 9, v1: 5 }),
 build: ({ m, v0, v1 }) => { const v = q27bv({ m, v0, v1 }), W = v.W, lose = W < 0; return {
  prompt: `A loaded cart of mass ${n(m)} kg enters a stretch of the test track at ${n(v0)} m/s and must leave it at ${n(v1)} m/s. Enter its kinetic energy on entering, then its kinetic energy on leaving, both in joules, then the net work that must be done on the cart along the stretch, in joules, with its sign (negative if the cart has to lose energy). Type the numbers without commas.`,
  answer: [v.K0, v.K1, W],
  hints: ['Kinetic energy is K = ½mv², in joules when the mass is in kilograms and the speed in metres per second.', 'The work-energy theorem says the net work equals the change in kinetic energy: the kinetic energy at the end minus the kinetic energy at the start. If the cart ends with less, that change, and so the work, is negative.'],
  solution: `On entering: K = ½mv² = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(v.K0)} J. On leaving: K = ½ × ${n(m)} × ${n(v1 * v1)} = ${n(v.K1)} J. By the work-energy theorem the net work is the change in kinetic energy, ${n(v.K1)} − ${n(v.K0)} = ${n(W)} J${lose ? ', negative because the cart loses energy' : ', positive because the cart gains energy'}.`,
  guidance: [
   { prompt: `What is the cart’s kinetic energy ½mv² on entering, at ${n(v0)} m/s, in joules?`, answer: [v.K0], explanation: `K = ½ × ${n(m)} × ${n(v0)}² = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(v.K0)} J.` },
   { prompt: `What is its kinetic energy on leaving, at ${n(v1)} m/s, in joules?`, answer: [v.K1], explanation: `K = ½ × ${n(m)} × ${n(v1)}² = ½ × ${n(m)} × ${n(v1 * v1)} = ${n(v.K1)} J.` },
   { prompt: `The net work equals the kinetic energy on leaving minus the kinetic energy on entering. What is it, in joules, with its sign?`, answer: [W], explanation: `${n(v.K1)} − ${n(v.K0)} = ${n(W)} J.` }
  ] }; }
});

/* q27c: work of F(x) = ax + b (a even) from x1 to x2 is (a/2)(x2² − x1²) + b(x2 − x1); then K after = ½mv0² + W. */
const q27cv = ({ m, v0, a, b, x1, x2 }) => { const A = x => a / 2 * x * x + b * x, W = T(A(x2) - A(x1)), K0 = m * v0 * v0 / 2, K1 = K0 + W; return { A1: T(A(x1)), A2: T(A(x2)), W, K0, K1, v1: Math.sqrt(2 * K1 / m) }; };
mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'A pod pushed along the rail',
 brief: 'A ram shoves supply pods along a rail, and the crew wants each pod’s speed at the far end without timing it.',
 labels: ['work by the ram (J)', 'speed at the end (m/s)'], tolerance: 0.005,
 gl: [['work by the ram (J)'], ['kinetic energy at the end (J)'], ['speed at the end (m/s)']]
}, {
 canonical: { m: 40, v0: 3, a: 6, b: 20, x1: 2, x2: 6 },
 draw: R => tryDraw(() => { const x1 = R.int(0, 3); return { m: 10 * R.int(4, 30), v0: R.int(1, 8), a: 2 * R.int(1, 8), b: 10 * R.int(1, 6), x1, x2: x1 + R.int(2, 5) }; },
  p => safe(q27cv(p).v1), { m: 40, v0: 3, a: 6, b: 20, x1: 2, x2: 6 }),
 build: p => { const { m, v0, a, b, x1, x2 } = p, v = q27cv(p), fx = `${co(a, 'x')} + ${n(b)}`, anti = `${co(a / 2, 'x²')} + ${co(b, 'x')}`; return {
  prompt: `A supply pod of mass ${n(m)} kg slides along a straight, frictionless rail at ${n(v0)} m/s when a hydraulic ram starts to push it in the direction it is moving. Between x = ${n(x1)} m and x = ${n(x2)} m along the rail the ram’s force is F(x) = ${fx} newtons (x in metres), and no other force does any work on the pod. Enter the work the ram does on the pod, in joules, then the pod’s speed at x = ${n(x2)} m, in metres per second to 2 decimal places. Type the numbers without commas.`,
  answer: [v.W, r2(v.v1)],
  hints: ['The ram’s force changes with position, so its work is the definite integral of F(x) from the start of the push to the end. With no other force doing work, that is the net work.', 'By the work-energy theorem the pod’s kinetic energy at the end is its starting kinetic energy ½mv² plus the net work. Then solve ½mv² = K for the speed.'],
  solution: `The ram’s work is ∫ (${fx}) dx from ${n(x1)} to ${n(x2)}. An antiderivative is ${anti}, which is ${n(v.A2)} at x = ${n(x2)} and ${n(v.A1)} at x = ${n(x1)}, so W = ${n(v.A2)} − ${n(v.A1)} = ${n(v.W)} J. The pod starts with K = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(v.K0)} J, so at the end K = ${n(v.K0)} + ${n(v.W)} = ${n(v.K1)} J. Then v = √(2K ÷ m) = √(${n(2 * v.K1)} ÷ ${n(m)}) ≈ ${f2(v.v1)} m/s.`,
  guidance: [
   { prompt: `An antiderivative of ${fx} is ${anti}. What is the ram’s work, its value at x = ${n(x2)} minus its value at x = ${n(x1)}, in joules?`, answer: [v.W], explanation: `${n(v.A2)} − ${n(v.A1)} = ${n(v.W)} J.` },
   { prompt: `The pod starts with kinetic energy ½ × ${n(m)} × ${n(v0)}² = ${n(v.K0)} J. What is its kinetic energy at the end, in joules?`, answer: [v.K1], explanation: `${n(v.K0)} + ${n(v.W)} = ${n(v.K1)} J.` },
   { prompt: `Solve ½mv² = ${n(v.K1)} for v. What is the speed at the end, in m/s to 2 decimal places?`, answer: [r2(v.v1)], explanation: `v = √(2 × ${n(v.K1)} ÷ ${n(m)}) = √${n(T(2 * v.K1 / m))} ≈ ${f2(v.v1)} m/s.` }
  ] }; }
});

/* q27d: boost at an angle (Fd cos θ), then a rough patch with a constant friction force f (work −fd2). */
const q27dv = ({ m, v0, F, th, d1, f, d2 }) => { const W1 = F * Math.cos(th) * d1, Wf = -f * d2, Wn = W1 + Wf, K0 = m * v0 * v0 / 2, Kf = K0 + Wn; return { W1, Wf, Wn, K0, Kf, vf: Kf > 0 ? Math.sqrt(2 * Kf / m) : 0 }; };
mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q26', title: 'Boost, then a rough patch',
 brief: 'A sled gets a slanted boost and then crosses a rough patch of track, and the crew wants its speed on the far side.',
 labels: ['work by the boost (J)', 'net work (J)', 'speed after the patch (m/s)'], tolerance: 0.005,
 gl: [['work by the boost (J)'], ['work by friction (J)'], ['net work (J)'], ['speed after the patch (m/s)']]
}, {
 canonical: { m: 150, v0: 4, F: 280, th: 0.6, d1: 12, f: 150, d2: 6 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(5, 30), v0: R.int(2, 10), F: 10 * R.int(10, 40), th: R.int(1, 12) / 10, d1: R.int(5, 20), f: 10 * R.int(5, 30), d2: R.int(2, 15) }),
  p => { const v = q27dv(p); return v.Kf > 0.1 * v.K0 && v.Kf > 100 && safe(v.W1, v.Wn, v.vf) && r2(Math.sqrt(2 * (v.K0 + r2(v.W1) + v.Wf) / p.m)) === r2(v.vf); }, { m: 150, v0: 4, F: 280, th: 0.6, d1: 12, f: 150, d2: 6 }),
 build: p => { const { m, v0, F, th, d1, f, d2 } = p, v = q27dv(p); return {
  prompt: `A cargo sled of mass ${n(m)} kg glides along the level test track at ${n(v0)} m/s. A cable then drags it forward for ${n(d1)} m with a constant pull of ${n(F)} N at an angle of ${n(th)} ${rad(th)} to the track. After that the sled crosses a rough patch ${n(d2)} m long, where friction pulls back on it with a constant force of ${n(f)} N and the cable is no longer pulling. The weight and the track’s push are at right angles to the motion and do no work. Enter the work done by the cable’s pull, in joules to 2 decimal places, then the net work done on the sled over the whole ${n(d1 + d2)} m, in joules to 2 decimal places, then the sled’s speed at the end of the patch, in metres per second to 2 decimal places. Do not round until the last step. Type the numbers without commas.`,
  answer: [r2(v.W1), r2(v.Wn), r2(v.vf)],
  hints: ['The cable’s work is Fd cos θ, with θ in radians: only the part of the pull along the track counts. Friction points against the motion, so its work is negative: minus the force times the length of the patch.', 'The net work is the sum of the works of all the forces. By the work-energy theorem, the kinetic energy at the end is the starting kinetic energy plus the net work; then solve ½mv² = K for the speed.'],
  solution: `Cable: W = Fd cos θ = ${n(F)} × ${n(d1)} × cos ${n(th)} ≈ ${f2(v.W1)} J. Friction: W = −${n(f)} × ${n(d2)} = ${n(v.Wf)} J. Net work ≈ ${f2(v.W1)} − ${n(-v.Wf)} ≈ ${f2(v.Wn)} J. The sled starts with K = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(v.K0)} J, so at the end K ≈ ${f2(v.Kf)} J, and v = √(2K ÷ m) ≈ ${f2(v.vf)} m/s.`,
  guidance: [
   { prompt: `What work does the cable’s pull do over ${n(d1)} m, Fd cos θ, in joules to 2 decimal places?`, answer: [r2(v.W1)], explanation: `W = ${n(F)} × ${n(d1)} × cos ${n(th)} ≈ ${f2(v.W1)} J.` },
   { prompt: `Friction pulls back with ${n(f)} N over ${n(d2)} m. What work does it do, in joules, with its sign?`, answer: [v.Wf], explanation: `Friction points against the motion, so W = −${n(f)} × ${n(d2)} = ${n(v.Wf)} J.` },
   { prompt: `What is the net work, the cable’s work plus friction’s work, in joules to 2 decimal places?`, answer: [r2(v.Wn)], explanation: `${f2(v.W1)} + ${par(v.Wf)} ≈ ${f2(v.Wn)} J.` },
   { prompt: `The sled starts with ½mv² = ${n(v.K0)} J. Add the net work, then solve ½mv² = K for v. What is the speed at the end of the patch, in m/s to 2 decimal places?`, answer: [r2(v.vf)], explanation: `K ≈ ${n(v.K0)} ${v.Wn < 0 ? '−' : '+'} ${f2(Math.abs(v.Wn))} ≈ ${f2(v.Kf)} J, so v = √(2K ÷ m) ≈ ${f2(v.vf)} m/s.` }
  ] }; }
});

/* ---- q28 Power: the rate of doing work, P = Fv [7.4] ---- */

/* q28b: W = mgh at a steady speed; P = W ÷ t; a motor of P2 kW does 1000·P2·t joules in t seconds, which fixes the mass it can lift. */
const q28bv = ({ m, h, t, P2 }) => { const w = T(m * g), W = T(w * h); return { w, W, P: W / t, m2: 1000 * P2 * t / (g * h) }; };
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The water-tank lift',
 brief: 'The greenhouse lift raises water tanks to the roof, and the Engine Hall wants to know what a stronger motor could carry.',
 labels: ['work (J)', 'average power (W)', 'heaviest tank (kg)'], tolerance: 0.005,
 gl: [['weight (N)'], ['work (J)'], ['average power (W)'], ['heaviest tank (kg)']]
}, {
 canonical: { m: 220, h: 15, t: 30, P2: 2 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(5, 30), h: R.int(3, 25), t: R.int(4, 60), P2: R.int(1, 12) }),
  p => { if (same(p, { m: 100, h: 10, t: 25, P2: 5 })) return false; const v = q28bv(p); return v.m2 > 0.4 * p.m && v.m2 < 3 * p.m && safe(v.P, v.m2); }, { m: 220, h: 15, t: 30, P2: 2 }),
 build: p => { const { m, h, t, P2 } = p, v = q28bv(p); return {
  prompt: `The greenhouse lift raises a water tank of mass ${n(m)} kg straight up through ${n(h)} m at a steady speed, taking ${n(t)} s. Take g = 9.8 m/s². Enter the work the lift’s cable does on the tank, in joules; then the lift’s average power, in watts to 2 decimal places; then the mass of the heaviest tank that a ${n(P2)} kW motor could raise through the same ${n(h)} m in the same ${n(t)} s at a steady speed, with all of its power going into the lift, in kilograms to 2 decimal places. Type the numbers without commas.`,
  answer: [v.W, r2(v.P), r2(v.m2)],
  hints: ['At a steady speed the net force is zero, so the cable pulls up with a force equal to the weight mg. The work is that force times the height.', 'Average power is work divided by time. A motor of P kilowatts delivers 1000P joules each second, so in the lift time it can do 1000P times that many seconds of joules. Set that equal to mgh and solve for the mass.'],
  solution: `The cable pulls up with mg = ${n(m)} × 9.8 = ${n(v.w)} N, so W = mgh = ${n(v.w)} × ${n(h)} = ${n(v.W)} J. The average power is ${n(v.W)} ÷ ${n(t)} ≈ ${f2(v.P)} W. A ${n(P2)} kW motor delivers ${n(1000 * P2)} J each second, so in ${n(t)} s it can do ${n(1000 * P2 * t)} J. Setting mgh equal to that: m × 9.8 × ${n(h)} = ${n(1000 * P2 * t)}, so m = ${n(1000 * P2 * t)} ÷ ${n(T(g * h))} ≈ ${f2(v.m2)} kg.`,
  guidance: [
   { prompt: `At a steady speed the cable’s pull equals the weight. What is mg, in newtons?`, answer: [v.w], explanation: `mg = ${n(m)} × 9.8 = ${n(v.w)} N.` },
   { prompt: `The pull acts along the ${n(h)} m of motion. What work does it do, in joules?`, answer: [v.W], explanation: `W = ${n(v.w)} × ${n(h)} = ${n(v.W)} J.` },
   { prompt: `What is the average power W ÷ t, in watts to 2 decimal places?`, answer: [r2(v.P)], explanation: `P = ${n(v.W)} ÷ ${n(t)} ≈ ${f2(v.P)} W.` },
   { prompt: `A ${n(P2)} kW motor does ${n(1000 * P2 * t)} J in ${n(t)} s. Setting mgh equal to that, what mass m can it lift, in kg to 2 decimal places?`, answer: [r2(v.m2)], explanation: `m = ${n(1000 * P2 * t)} ÷ (9.8 × ${n(h)}) = ${n(1000 * P2 * t)} ÷ ${n(T(g * h))} ≈ ${f2(v.m2)} kg.` }
  ] }; }
});

/* q28c: P = Fv at a steady speed; work in tm minutes = P × 60tm (shown in kJ); a P2 kW motor with the same pull has v2 = 1000·P2 ÷ F. */
const q28cv = ({ F, v, tm, P2 }) => { const P = T(F * v), ts = 60 * tm, W = T(P * ts / 1000); return { P, ts, W, v2: 1000 * P2 / F }; };
mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'The crawler on the test track',
 brief: 'A tracked crawler hauls trolleys down the Engine Hall test track, and the crew wants its power, its energy use and what a bigger motor would do.',
 labels: ['work in the run (kJ)', 'speed with the bigger motor (m/s)'], tolerance: 0.005,
 gl: [['power (W)'], ['work in the run (kJ)'], ['speed with the bigger motor (m/s)']]
}, {
 canonical: { F: 350, v: 1.6, tm: 8, P2: 3 },
 draw: R => tryDraw(() => ({ F: 50 * R.int(2, 12), v: R.int(5, 40) / 10, tm: R.int(2, 15), P2: R.int(1, 6) }),
  p => { const x = q28cv(p); return x.v2 >= 1.5 && x.v2 <= 15 && safe(x.v2); }, { F: 350, v: 1.6, tm: 8, P2: 3 }),
 build: p => { const { F, v, tm, P2 } = p, x = q28cv(p); return {
  prompt: `A tracked crawler in the Engine Hall test bay hauls a loaded trolley along a level track at a steady ${n(v)} m/s, pulling with a steady ${n(F)} N. Enter the work the crawler does in a run of ${n(tm)} minutes, in kilojoules (1 kJ = 1000 J). Then enter the steady speed, in metres per second to 2 decimal places, at which a ${n(P2)} kW motor could haul the same trolley with the same ${n(F)} N pull, with all of its power going into the pull. Type the numbers without commas.`,
  answer: [x.W, r2(x.v2)],
  hints: ['For a steady force on a body moving at a steady speed along the force, the power is P = Fv. Work is power times time, so convert the minutes to seconds first.', 'A motor of P kilowatts delivers 1000P watts. With the pull fixed, P = Fv can be turned round to give the speed: v = P ÷ F.'],
  solution: `The crawler’s power is P = Fv = ${n(F)} × ${n(v)} = ${n(x.P)} W. ${n(tm)} minutes is ${n(tm)} × 60 = ${n(x.ts)} s, so the work is ${n(x.P)} × ${n(x.ts)} = ${n(T(x.P * x.ts))} J = ${n(x.W)} kJ. A ${n(P2)} kW motor delivers ${n(1000 * P2)} W, so v = P ÷ F = ${n(1000 * P2)} ÷ ${n(F)} ≈ ${f2(x.v2)} m/s.`,
  guidance: [
   { prompt: `What is the crawler’s power P = Fv, in watts?`, answer: [x.P], explanation: `P = ${n(F)} × ${n(v)} = ${n(x.P)} W.` },
   { prompt: `${n(tm)} minutes is ${n(x.ts)} seconds. Work is power times time. What work does the crawler do in the run, in kilojoules?`, answer: [x.W], explanation: `${n(x.P)} × ${n(x.ts)} = ${n(T(x.P * x.ts))} J, which is ${n(x.W)} kJ.` },
   { prompt: `A ${n(P2)} kW motor delivers ${n(1000 * P2)} W. With the pull still ${n(F)} N, P = Fv gives v = P ÷ F. What is the speed, in m/s to 2 decimal places?`, answer: [r2(x.v2)], explanation: `v = ${n(1000 * P2)} ÷ ${n(F)} ≈ ${f2(x.v2)} m/s.` }
  ] }; }
});

/* q28d: constant power P (kW): work in time t is Pt, all going into K = ½mv²; t = K ÷ (1000P); the pull at speed v is F = 1000P ÷ v. */
const q28dv = ({ m, v, P }) => { const K = m * v * v / 2; return { K, t: K / (1000 * P), F: 1000 * P / v }; };
mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q27', title: 'Spinning up the test sled',
 brief: 'A test sled is driven from rest by a motor of fixed power, and the crew wants the time to speed and the pull at the top speed.',
 labels: ['kinetic energy (J)', 'time to reach the speed (s)', 'pull at that speed (N)'], tolerance: 0.005,
 gl: [['kinetic energy (J)'], ['time to reach the speed (s)'], ['pull at that speed (N)']]
}, {
 canonical: { m: 240, v: 15, P: 7 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(5, 40), v: R.int(4, 20), P: R.int(1, 9) }),
  p => { const x = q28dv(p); return x.t >= 0.5 && x.t <= 60 && safe(x.t, x.F); }, { m: 240, v: 15, P: 7 }),
 build: p => { const { m, v, P } = p, x = q28dv(p); return {
  prompt: `A test sled of mass ${n(m)} kg starts from rest on the level track, driven by a motor that keeps a constant power of ${n(P)} kW. Ignore friction and drag, so that all the work the motor does goes into the sled’s kinetic energy. At a constant power P, the work done in a time t is Pt. Enter the sled’s kinetic energy when it reaches ${n(v)} m/s, in joules; then the time the motor takes to bring it to that speed, in seconds to 2 decimal places; then the pull the motor exerts on the sled at that moment, from P = Fv, in newtons to 2 decimal places. Type the numbers without commas.`,
  answer: [x.K, r2(x.t), r2(x.F)],
  hints: ['Kinetic energy is ½mv². Because all the motor’s work becomes kinetic energy, the work done in the time t equals that kinetic energy: Pt = K, with P in watts.', 'At that moment the power is the pull times the speed, P = Fv, so the pull is the power divided by the speed. A kilowatt is 1000 watts.'],
  solution: `K = ½mv² = ½ × ${n(m)} × ${n(v * v)} = ${n(x.K)} J. The power is ${n(P)} kW = ${n(1000 * P)} W, and the work done in time t is ${n(1000 * P)}t, which must equal K: t = ${n(x.K)} ÷ ${n(1000 * P)} ≈ ${f2(x.t)} s. At that moment P = Fv, so F = ${n(1000 * P)} ÷ ${n(v)} ≈ ${f2(x.F)} N.`,
  guidance: [
   { prompt: `What is the sled’s kinetic energy ½mv² at ${n(v)} m/s, in joules?`, answer: [x.K], explanation: `K = ½ × ${n(m)} × ${n(v)}² = ½ × ${n(m)} × ${n(v * v)} = ${n(x.K)} J.` },
   { prompt: `The motor’s work in a time t is ${n(1000 * P)}t joules, and it must equal ${n(x.K)} J. What is t, in seconds to 2 decimal places?`, answer: [r2(x.t)], explanation: `t = ${n(x.K)} ÷ ${n(1000 * P)} ≈ ${f2(x.t)} s.` },
   { prompt: `At ${n(v)} m/s the power ${n(1000 * P)} W equals Fv. What is the pull F, in newtons to 2 decimal places?`, answer: [r2(x.F)], explanation: `F = ${n(1000 * P)} ÷ ${n(v)} ≈ ${f2(x.F)} N.` }
  ] }; }
});

/* ---- q29 Chapter review: work, energy and power on one machine [7.1, 7.3] ---- */

/* q29b: level floor, pull F along the motion, kinetic friction μk·mg against it; the sled starts at v0, so K_end = ½mv0² + net work. */
const q29bv = ({ m, d, F, uk, v0 }) => { const f = T(uk * m * g), Wp = T(F * d), Wf = -T(f * d), Wn = T(Wp + Wf), K0 = m * v0 * v0 / 2, Kf = K0 + Wn, v = Math.sqrt(2 * Kf / m); return { f, Wp, Wf, Wn, K0, Kf, v, P: F * v }; };
mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The tug and the moving pallet',
 brief: 'A tug takes hold of a pallet that is already rolling across the Engine Hall floor, and the crew wants the energy account for the pull.',
 labels: ['work by the pull (J)', 'work by friction (J)', 'end speed (m/s)', 'power at the end (W)'], tolerance: 0.005,
 gl: [['work by the pull (J)'], ['work by friction (J)'], ['end speed (m/s)'], ['power at the end (W)']]
}, {
 canonical: { m: 90, d: 25, F: 275.4, uk: 0.2, v0: 3 },
 /* The end speed vf (a whole number above v0) is drawn and the pull F built from it, so the end speed is exact and the
    power P = Fv does not depend on a rounded speed; F is kept to one decimal place. Not the parent's example (50 kg, 10 m, 138 N, 0.2). */
 draw: R => tryDraw(() => { const m = 10 * R.int(5, 30), d = R.int(5, 30), uk = R.int(1, 5) / 10, v0 = R.int(1, 8), vf = R.int(v0 + 1, 14), F = T(m * (vf * vf - v0 * v0) / (2 * d) + uk * m * g); return { m, d, F, uk, v0 }; },
  p => !same(p, { m: 50, d: 10, F: 138, uk: 0.2 }) && Math.abs(p.F * 10 - Math.round(p.F * 10)) < 1e-6 && p.F <= 1000, { m: 90, d: 25, F: 275.4, uk: 0.2, v0: 3 }),
 build: p => { const { m, d, F, uk, v0 } = p, x = q29bv(p); return {
  prompt: `A loaded pallet of mass ${n(m)} kg is already rolling at ${n(v0)} m/s across the level Engine Hall floor when a tug takes hold of it and pulls with a constant horizontal force of ${n(F)} N, in the direction the pallet moves, for ${n(d)} m. The coefficient of kinetic friction between the pallet and the floor is μk = ${n(uk)}, so friction pulls back with a force of μk mg. Take g = 9.8 m/s². The weight and the floor’s push are at right angles to the motion and do no work. Enter the work done by the tug’s pull in joules; then the work done by friction in joules, with its sign; then the pallet’s speed at the end of the ${n(d)} m in m/s to 2 decimal places; then the tug’s power at that moment, P = Fv, in watts to 2 decimal places. Type the numbers without commas.`,
  answer: [x.Wp, x.Wf, r2(x.v), r2(x.P)],
  hints: ['The pull points along the motion, so its work is Fd. Friction points against the motion, so its work is −μk mg d.', 'The net work is the sum of the works. Because the pallet is already moving, the work-energy theorem says the kinetic energy at the end is the starting kinetic energy ½mv² plus the net work. Solve for the speed, then multiply by the pull for the power.'],
  solution: `Pull: W = Fd = ${n(F)} × ${n(d)} = ${n(x.Wp)} J. Friction: μk mg = ${n(uk)} × ${n(m)} × 9.8 = ${n(x.f)} N against the motion, so W = −${n(x.f)} × ${n(d)} = ${n(x.Wf)} J. Net work = ${n(x.Wp)} − ${n(-x.Wf)} = ${n(x.Wn)} J. The pallet starts with K = ½ × ${n(m)} × ${n(v0 * v0)} = ${n(x.K0)} J, so at the end K = ${n(x.K0)} + ${n(x.Wn)} = ${n(x.Kf)} J, and v = √(2K ÷ m) = √(${n(2 * x.Kf)} ÷ ${n(m)}) ≈ ${f2(x.v)} m/s. Power at the end: P = Fv ≈ ${n(F)} × ${f2(x.v)} ≈ ${f2(x.P)} W.`,
  guidance: [
   { prompt: `What work does the tug’s pull do over the ${n(d)} m, in joules?`, answer: [x.Wp], explanation: `W = Fd = ${n(F)} × ${n(d)} = ${n(x.Wp)} J.` },
   { prompt: `Friction is μk mg against the motion. What work does it do, in joules, with its sign?`, answer: [x.Wf], explanation: `μk mg = ${n(x.f)} N, so W = −${n(x.f)} × ${n(d)} = ${n(x.Wf)} J.` },
   { prompt: `The pallet starts with ½mv² = ${n(x.K0)} J. Add the net work to get its kinetic energy at the end, then solve for the speed. What is the speed at the end, in m/s to 2 decimal places?`, answer: [r2(x.v)], explanation: `K = ${n(x.K0)} + ${n(x.Wn)} = ${n(x.Kf)} J, so v = √(2 × ${n(x.Kf)} ÷ ${n(m)}) ≈ ${f2(x.v)} m/s.` },
   { prompt: `What is the tug’s power at that moment, P = Fv, in watts to 2 decimal places?`, answer: [r2(x.P)], explanation: `P = ${n(F)} × v ≈ ${f2(x.P)} W, using the end speed from the work-energy theorem.` }
  ] }; }
});

/* q29c: a pull F(x) = ax + b over the first d metres (a even), from rest; friction μk·mg; power at the end uses the pull at x = d. */
const q29cv = ({ m, d, a, b, uk }) => { const Wp = T(a / 2 * d * d + b * d), f = T(uk * m * g), Wf = -T(f * d), Wn = T(Wp + Wf), v = Math.sqrt(2 * Wn / m), Fe = a * d + b; return { Wp, f, Wf, Wn, v, Fe, P: Fe * v }; };
mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'A winch that pulls harder as it goes',
 brief: 'A winch eases a sled into motion with a pull that grows along the way, and the crew wants the net work, the end speed and the power.',
 labels: ['net work (J)', 'end speed (m/s)', 'power at the end (W)'], tolerance: 0.005,
 gl: [['work by the pull (J)'], ['net work (J)'], ['end speed (m/s)']]
}, {
 canonical: { m: 150, d: 15, a: 4, b: 444, uk: 0.2 },
 /* The end speed (a whole number) is drawn and the constant part b of the pull built from it, so the end speed is exact and
    the power does not depend on a rounded speed; b must be a whole number larger than the friction force. */
 draw: R => tryDraw(() => { const m = 10 * R.int(5, 25), d = R.int(6, 24), a = 2 * R.int(1, 6), uk = R.int(1, 4) / 10, vf = R.int(2, 12), b = (m * vf * vf / 2 + T(uk * m * g) * d - a * d * d / 2) / d; return { m, d, a, b: T(b), uk }; },
  p => Number.isInteger(p.b) && p.b > 1.1 * T(p.uk * p.m * g) && p.b <= 900, { m: 150, d: 15, a: 4, b: 444, uk: 0.2 }),
 build: p => { const { m, d, a, b, uk } = p, x = q29cv(p), fx = `${co(a, 'x')} + ${n(b)}`, anti = `${co(a / 2, 'x²')} + ${co(b, 'x')}`; return {
  prompt: `A winch hauls a sled of mass ${n(m)} kg from rest across the level Engine Hall floor, pulling along the direction the sled moves. The pull grows as the sled goes: when the sled has moved x metres from its start, the pull is F(x) = ${fx} newtons, for the first ${n(d)} m. The coefficient of kinetic friction between the sled and the floor is μk = ${n(uk)}, so friction pulls back with a constant force of μk mg. Take g = 9.8 m/s². The weight and the floor’s push do no work. Enter the net work done on the sled over the ${n(d)} m, in joules; then the sled’s speed at ${n(d)} m, in m/s to 2 decimal places; then the winch’s power at that moment, P = Fv, with F the pull at x = ${n(d)} m, in watts to 2 decimal places. Type the numbers without commas.`,
  answer: [x.Wn, r2(x.v), r2(x.P)],
  hints: ['The pull changes with position, so its work is the integral of F(x) from the start to the end of the stretch. Friction is constant and points against the motion, so its work is −μk mg d.', 'The net work is the sum of the two works, and since the sled starts from rest it equals ½mv² at the end. For the power use the pull at the end of the stretch, F(x) at x equal to the distance, times the end speed.'],
  solution: `Pull: W = ∫ (${fx}) dx from 0 to ${n(d)}. An antiderivative is ${anti}, which is ${n(x.Wp)} at x = ${n(d)} and 0 at x = 0, so W = ${n(x.Wp)} J. Friction: μk mg = ${n(uk)} × ${n(m)} × 9.8 = ${n(x.f)} N, so W = −${n(x.f)} × ${n(d)} = ${n(x.Wf)} J. Net work = ${n(x.Wp)} − ${n(-x.Wf)} = ${n(x.Wn)} J, which equals ½mv² at the end, so v = √(2 × ${n(x.Wn)} ÷ ${n(m)}) ≈ ${f2(x.v)} m/s. The pull at the end is F(${n(d)}) = ${n(a)} × ${n(d)} + ${n(b)} = ${n(x.Fe)} N, so P = Fv ≈ ${n(x.Fe)} × ${f2(x.v)} ≈ ${f2(x.P)} W.`,
  guidance: [
   { prompt: `An antiderivative of ${fx} is ${anti}. What is the work done by the pull from x = 0 to x = ${n(d)}, in joules?`, answer: [x.Wp], explanation: `The antiderivative is ${n(x.Wp)} at x = ${n(d)} and 0 at x = 0, so W = ${n(x.Wp)} J.` },
   { prompt: `Friction does −μk mg d = −${n(x.f)} × ${n(d)} = ${n(x.Wf)} J. What is the net work, the pull’s work plus friction’s, in joules?`, answer: [x.Wn], explanation: `${n(x.Wp)} − ${n(-x.Wf)} = ${n(x.Wn)} J.` },
   { prompt: `The sled starts from rest, so the net work equals ½mv² at the end. What is the speed, in m/s to 2 decimal places?`, answer: [r2(x.v)], explanation: `v = √(2 × ${n(x.Wn)} ÷ ${n(m)}) ≈ ${f2(x.v)} m/s.` }
  ] }; }
});

/* q29d: up a ramp of angle θ (radians), winch parallel to the ramp, from rest. Gravity: −mg sin θ · d; friction: −μk mg cos θ · d. */
const q29dv = ({ m, d, F, th, uk }) => { const w = T(m * g), along = w * Math.sin(th), N = w * Math.cos(th), fr = uk * N, Ww = F * d, Wg = -along * d, Wf = -fr * d, net = Ww + Wg + Wf;
 return { w, along, N, fr, Ww, Wg, Wf, net, v: net > 0 ? Math.sqrt(2 * net / m) : 0 }; };
mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q21', title: 'Hauling a sled up the ramp',
 brief: 'A winch hauls a sled up the loading ramp, and the crew wants every force’s work and the speed at the top.',
 labels: ['work by the winch (J)', 'work by gravity (J)', 'work by friction (J)', 'speed at the top (m/s)'], tolerance: 0.005,
 gl: [['work by the winch (J)'], ['work by gravity (J)'], ['work by friction (J)'], ['speed at the top (m/s)']]
}, {
 canonical: { m: 100, d: 15, F: 800, th: 0.3, uk: 0.2 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(5, 20), d: R.int(5, 20), F: 10 * R.int(30, 90), th: R.int(1, 5) / 10, uk: R.int(1, 4) / 10 }),
  p => { const x = q29dv(p); return x.net > 0.05 * p.F * p.d && x.v < 15 && safe(x.Wg, x.Wf, x.v) && r2(Math.sqrt(2 * (x.Ww + r2(x.Wg) + r2(x.Wf)) / p.m)) === r2(x.v); }, { m: 100, d: 15, F: 800, th: 0.3, uk: 0.2 }),
 build: p => { const { m, d, F, th, uk } = p, x = q29dv(p); return {
  prompt: `A winch hauls a sled of mass ${n(m)} kg from rest straight up the loading ramp, pulling parallel to the ramp with a constant ${n(F)} N, for ${n(d)} m along the ramp. The ramp makes an angle of ${n(th)} radians with the level, and the coefficient of kinetic friction between the sled and the ramp is μk = ${n(uk)}. Take g = 9.8 m/s². The weight has a part mg sin θ along the ramp, pulling the sled back down it, and the ramp pushes on the sled with a normal force mg cos θ, so friction, which points down the ramp against the motion, has size μk mg cos θ. Enter the work done by the winch in joules; then the work done by gravity, with its sign; then the work done by friction, with its sign, both in joules to 2 decimal places; then the sled’s speed at the top in m/s to 2 decimal places. Do not round until the last step. Type the numbers without commas.`,
  answer: [x.Ww, r2(x.Wg), r2(x.Wf), r2(x.v)],
  hints: ['Along the ramp, the winch does +Fd. Gravity’s part along the ramp, mg sin θ, points down the ramp against the motion, and friction also points down the ramp, so both do negative work: minus the force times the distance. The normal force does no work.', 'The net work is the sum of the three works. The sled starts from rest, so the net work equals ½mv² at the top. Use radians for sin θ and cos θ.'],
  solution: `Winch: W = Fd = ${n(F)} × ${n(d)} = ${n(x.Ww)} J. Gravity: mg sin θ = ${n(x.w)} × sin ${n(th)} ≈ ${f2(x.along)} N down the ramp, so W ≈ −${f2(x.along)} × ${n(d)} ≈ ${f2(x.Wg)} J. Friction: μk mg cos θ = ${n(uk)} × ${n(x.w)} × cos ${n(th)} ≈ ${f2(x.fr)} N down the ramp, so W ≈ −${f2(x.fr)} × ${n(d)} ≈ ${f2(x.Wf)} J. Net work ≈ ${f2(x.net)} J, which equals ½mv² at the top, so v = √(2 × ${f2(x.net)} ÷ ${n(m)}) ≈ ${f2(x.v)} m/s.`,
  guidance: [
   { prompt: `What work does the winch do over the ${n(d)} m along the ramp, Fd, in joules?`, answer: [x.Ww], explanation: `W = ${n(F)} × ${n(d)} = ${n(x.Ww)} J.` },
   { prompt: `What work does gravity do, −mg sin θ × d, in joules to 2 decimal places?`, answer: [r2(x.Wg)], explanation: `mg sin θ = ${n(x.w)} × sin ${n(th)} ≈ ${f2(x.along)} N, so W ≈ −${f2(x.along)} × ${n(d)} ≈ ${f2(x.Wg)} J.` },
   { prompt: `What work does friction do, −μk mg cos θ × d, in joules to 2 decimal places?`, answer: [r2(x.Wf)], explanation: `μk mg cos θ = ${n(uk)} × ${n(x.w)} × cos ${n(th)} ≈ ${f2(x.fr)} N, so W ≈ −${f2(x.fr)} × ${n(d)} ≈ ${f2(x.Wf)} J.` },
   { prompt: `Add the three works to get the net work, which equals ½mv² at the top. What is the speed, in m/s to 2 decimal places?`, answer: [r2(x.v)], explanation: `The net work is about ${f2(x.net)} J, so v = √(2 × ${f2(x.net)} ÷ ${n(m)}) ≈ ${f2(x.v)} m/s.` }
  ] }; }
});

/* ---- q30 Potential energy: height and a stretched spring [8.1] ---- */

/* q30b: zero of height at the loading deck, a pit below it (negative y); work by gravity = U start − U end; spring stretched by x. */
const q30bv = ({ m, h1, d, k, x }) => { const w = T(m * g); return { w, Ubeam: T(w * h1), Upit: -T(w * d), Wg: T(w * (h1 + d)), Us: T(k * x * x / 2) }; };
mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Beam, deck and pit',
 brief: 'The Docking Ring’s cargo deck has a gantry above it and a maintenance pit below it, and the safety officer wants the stored energies.',
 labels: ['potential energy in the pit (J)', 'work by gravity (J)', 'spring energy (J)'], tolerance: 0.005,
 gl: [['potential energy on the beam (J)'], ['potential energy in the pit (J)'], ['work by gravity (J)'], ['spring energy (J)']]
}, {
 canonical: { m: 180, h1: 7, d: 4, k: 2400, x: 0.15 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(5, 30), h1: R.int(3, 15), d: R.int(2, 10), k: 200 * R.int(2, 20), x: R.int(2, 10) / 20 }), p => !same(p, { m: 100, h1: 5, k: 1000, x: 0.2 }), { m: 180, h1: 7, d: 4, k: 2400, x: 0.15 }),
 build: p => { const { m, h1, d, k, x } = p, v = q30bv(p); return {
  prompt: `The Docking Ring’s cargo deck has a gantry beam ${n(h1)} m above the deck and a maintenance pit ${n(d)} m below it. A cargo canister of mass ${n(m)} kg is lowered from the beam to the bottom of the pit. Take the deck as the zero of gravitational potential energy, so heights above the deck are positive and heights below it are negative: the bottom of the pit is at y = −${n(d)} m. Take g = 9.8 m/s². Beside the deck, a spring buffer with spring constant k = ${n(k)} N/m is stretched ${n(x)} m longer than its natural length. Enter the canister’s gravitational potential energy at the bottom of the pit, with its sign; then the work gravity does on the canister as it is lowered from the beam to the bottom of the pit; then the potential energy stored in the stretched spring, all in joules. Type the numbers without commas.`,
  answer: [v.Upit, v.Wg, v.Us],
  hints: ['Gravitational potential energy is U = mgy, where y is the height above the level chosen as zero. A height below that level is negative, so U is negative there.', 'The work gravity does is minus the change in potential energy: the start value minus the end value. A spring stretched or squeezed by x stores U = ½kx².'],
  solution: `At the beam y = ${n(h1)} m, so U = mgy = ${n(m)} × 9.8 × ${n(h1)} = ${n(v.Ubeam)} J. At the bottom of the pit y = −${n(d)} m, so U = ${n(m)} × 9.8 × (−${n(d)}) = ${n(v.Upit)} J. Gravity’s work is the start value minus the end value: ${n(v.Ubeam)} − (${n(v.Upit)}) = ${n(v.Wg)} J, positive because the canister moves the way gravity pulls. Spring: U = ½kx² = ½ × ${n(k)} × ${n(x)}² = ${n(v.Us)} J.`,
  guidance: [
   { prompt: `What is the canister’s gravitational potential energy mgy on the beam, in joules?`, answer: [v.Ubeam], explanation: `U = ${n(m)} × 9.8 × ${n(h1)} = ${n(v.Ubeam)} J.` },
   { prompt: `What is its potential energy at the bottom of the pit, where y = −${n(d)} m, in joules, with its sign?`, answer: [v.Upit], explanation: `U = ${n(m)} × 9.8 × (−${n(d)}) = ${n(v.Upit)} J. It is negative because the pit is below the zero level.` },
   { prompt: `The work gravity does is the potential energy on the beam minus the potential energy in the pit. What is it, in joules?`, answer: [v.Wg], explanation: `${n(v.Ubeam)} − (${n(v.Upit)}) = ${n(v.Wg)} J.` },
   { prompt: `What energy ½kx² is stored in the stretched spring, in joules?`, answer: [v.Us], explanation: `½ × ${n(k)} × ${n(x)}² = ${n(v.Us)} J.` }
  ] }; }
});

/* q30c: spring energy ½kx² all turned into gravitational potential energy mgy, so y = ½kx² ÷ (mg). */
const q30cv = ({ m, k, x }) => { const E = T(k * x * x / 2), w = T(m * g); return { E, w, y: E / w }; };
mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'The spring launcher',
 brief: 'A spring launcher lifts canisters up a guide rail, and the Docking Ring wants to know how high a given squeeze will send one.',
 labels: ['spring energy (J)', 'height reached (m)'], tolerance: 0.005,
 gl: [['spring energy (J)'], ['weight (N)'], ['height reached (m)']]
}, {
 canonical: { m: 40, k: 4800, x: 0.25 },
 draw: R => tryDraw(() => ({ m: 10 * R.int(2, 20), k: 200 * R.int(3, 30), x: R.int(2, 12) / 20 }), p => { const v = q30cv(p); return v.y >= 0.2 && v.y <= 30 && safe(v.y); }, { m: 40, k: 4800, x: 0.25 }),
 build: p => { const { m, k, x } = p, v = q30cv(p); return {
  prompt: `A spring launcher in the Docking Ring holds a cargo canister of mass ${n(m)} kg at the foot of a vertical guide rail. Its spring has spring constant k = ${n(k)} N/m and is squeezed ${n(x)} m shorter than its natural length. When the catch is released, assume that all the energy stored in the spring ends up as gravitational potential energy of the canister, with no energy lost, and that the canister is at rest at the top of its rise. Take g = 9.8 m/s² and measure the height y that the canister rises from the point where it leaves the spring. Enter the energy stored in the spring, in joules, then the height y the canister reaches, in metres to 2 decimal places. Type the numbers without commas.`,
  answer: [v.E, r2(v.y)],
  hints: ['A spring squeezed or stretched by x stores U = ½kx². That is the energy available to lift the canister.', 'Gravitational potential energy is U = mgy, and the spring’s energy turns entirely into it, so set ½kx² equal to mgy and solve for the height y.'],
  solution: `The spring stores U = ½kx² = ½ × ${n(k)} × ${n(x)}² = ${n(v.E)} J. The canister’s weight is mg = ${n(m)} × 9.8 = ${n(v.w)} N. All of the spring’s energy becomes mgy, so ${n(v.w)} × y = ${n(v.E)} and y = ${n(v.E)} ÷ ${n(v.w)} ≈ ${f2(v.y)} m.`,
  guidance: [
   { prompt: `What energy ½kx² is stored in the squeezed spring, in joules?`, answer: [v.E], explanation: `½ × ${n(k)} × ${n(x)}² = ${n(v.E)} J.` },
   { prompt: `What is the canister’s weight mg, in newtons?`, answer: [v.w], explanation: `mg = ${n(m)} × 9.8 = ${n(v.w)} N.` },
   { prompt: `Setting the spring’s energy equal to mgy, what is the height y, in metres to 2 decimal places?`, answer: [r2(v.y)], explanation: `y = ${n(v.E)} ÷ ${n(v.w)} ≈ ${f2(v.y)} m.` }
  ] }; }
});

/* q30d: a hardening spring F(x) = kx + cx³; stored energy = ∫ F dx from 0 to X = ½kX² + ¼cX⁴; an ordinary spring k0 stretched by s stores ½k0s². */
const q30dv = ({ k, c, X, k0 }) => { const U1 = T(k * X * X / 2), U2 = T(c * X ** 4 / 4), U = T(U1 + U2); return { U1, U2, U, s: Math.sqrt(2 * U / k0) }; };
mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q26', title: 'The hardening spring',
 brief: 'A buffer spring gets stiffer the further it is stretched, and the safety officer wants its stored energy compared with an ordinary spring’s.',
 labels: ['stored energy (J)', 'stretch of the ordinary spring (m)'], tolerance: 0.005,
 gl: [['energy of the first term (J)'], ['energy of the second term (J)'], ['stretch of the ordinary spring (m)']]
}, {
 canonical: { k: 800, c: 400, X: 0.4, k0: 500 },
 draw: R => tryDraw(() => ({ k: 100 * R.int(4, 30), c: 400 * R.int(1, 5), X: R.int(2, 8) / 10, k0: 100 * R.int(3, 30) }), p => { const v = q30dv(p); return v.s <= 3 && safe(v.s); }, { k: 800, c: 400, X: 0.4, k0: 500 }),
 build: p => { const { k, c, X, k0 } = p, v = q30dv(p); return {
  prompt: `A buffer spring in the Docking Ring gets stiffer the further it is stretched: when it is stretched x metres beyond its natural length it pulls back with a force F(x) = ${n(k)}x + ${n(c)}x³ newtons. The energy it stores at a stretch X is the work needed to stretch it from x = 0 to x = X, which is the integral of F(x) dx from 0 to X. An ordinary spring with a constant spring constant k₀ = ${n(k0)} N/m stretched by s stores ½k₀s². Enter the energy stored in the buffer spring when it is stretched ${n(X)} m, in joules to 2 decimal places; then the stretch s, in metres to 2 decimal places, at which the ordinary spring would store that same energy. Type the numbers without commas.`,
  answer: [r2(v.U), r2(v.s)],
  hints: ['Integrate the force term by term from 0 to X: the integral of kx dx is ½kx² and the integral of cx³ dx is ¼cx⁴. Both are zero at x = 0, so only the value at X is needed.', 'For the ordinary spring set ½k₀s² equal to the buffer spring’s energy and solve for s: s = √(2U ÷ k₀).'],
  solution: `U = ∫ (${n(k)}x + ${n(c)}x³) dx from 0 to ${n(X)} = [½ × ${n(k)} x² + ¼ × ${n(c)} x⁴] from 0 to ${n(X)}. The first term is ½ × ${n(k)} × ${n(X)}² = ${n(v.U1)} J and the second is ¼ × ${n(c)} × ${n(X)}⁴ = ${n(v.U2)} J, so U = ${n(v.U1)} + ${n(v.U2)} ≈ ${f2(v.U)} J. For the ordinary spring ½ × ${n(k0)} × s² = U, so s = √(2U ÷ ${n(k0)}) ≈ ${f2(v.s)} m.`,
  guidance: [
   { prompt: `The integral of ${n(k)}x dx is ½ × ${n(k)} x². What is its value at x = ${n(X)}, in joules?`, answer: [v.U1], explanation: `½ × ${n(k)} × ${n(X)}² = ${n(v.U1)} J.` },
   { prompt: `The integral of ${n(c)}x³ dx is ¼ × ${n(c)} x⁴. What is its value at x = ${n(X)}, in joules to 2 decimal places?`, answer: [r2(v.U2)], explanation: `¼ × ${n(c)} × ${n(X)}⁴ = ${n(v.U2)} J, which is ${f2(v.U2)} J to 2 decimal places.` },
   { prompt: `The two terms add to the stored energy, ${n(v.U1)} + ${n(v.U2)} = ${n(v.U)} J. Solve ½ × ${n(k0)} × s² = ${n(v.U)} for s. What is the stretch, in m to 2 decimal places?`, answer: [r2(v.s)], explanation: `s = √(2 × ${n(v.U)} ÷ ${n(k0)}) ≈ ${f2(v.s)} m.` }
  ] }; }
});

})();
