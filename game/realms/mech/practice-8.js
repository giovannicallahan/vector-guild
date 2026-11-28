/* Mechanics: motion and force practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p8.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

const g = 9.8;
/* Rounding to dp places, and "=" or "≈" before a rounded value. fx removes float noise from exact sums and products. */
const rd = (x, dp = 2) => Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);
const fx = x => Math.round(x * 1e6) / 1e6;
const exact = (x, dp = 2) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-6;
const eq = (x, dp = 2) => exact(x, dp) ? '=' : '≈';
/* Away from a rounding tie in the place after the last kept one. */
const offTie = (x, dp = 2) => { const s = Math.abs(x) * Math.pow(10, dp), f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.02; };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (R, make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return { ...canonical }; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(c => c === '-' ? '⁻' : SUP[Number(c)]).join('');
/* An angle num·π/den in radians, written π/6, 2π/3, π/2. */
const piText = (a, b) => `${a === 1 ? '' : n(a)}π/${n(b)}`;
const ANGLES = [[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6]];
/* Registers a mission whose authored text is build(canonical), so the text and the generator cannot drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (the labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((s, i) => ({ prompt: s.prompt, answer: s.answer, labels: gl[i], explanation: s.explanation })) }, gen);
};
/* Sum of m·r² terms as worked: "3 × 0.4² + 5 × 0.6²". */
const mrText = (ms, rs) => ms.map((m, i) => `${n(m)} × ${n(rs[i])}²`).join(' + ');
const sumText = xs => xs.map(n).join(' + ');

/* ---- q36 Moment of inertia and rotational kinetic energy [10.4] ---- */

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The sample carousel',
 brief: 'The vault laboratory spins sample pots on a carousel, and the safety log needs how hard the carousel is to stop.',
 labels: ['moment of inertia (kg·m²)', 'rotational kinetic energy (J)'], tolerance: 0.005,
 gl: [['angular velocity (rad/s)'], ['moment of inertia (kg·m²)'], ['rotational kinetic energy (J)']]
}, {
 /* Four point masses (2–9 kg) at four different radii (0.2–1.2 m) and a whole number of 30 rpm steps, so ω = kπ. The radii are
    one decimal, so I has at most 2 decimals. K and ω are off rounding ties. Not the worked example (two masses, 4 rad/s). */
 canonical: { m1: 3, r1: 0.4, m2: 5, r2: 0.6, m3: 2, r3: 0.9, m4: 4, r4: 0.5, k: 4 },
 draw: R => tryDraw(R, R => ({ m1: R.int(2, 9), r1: R.int(2, 12) / 10, m2: R.int(2, 9), r2: R.int(2, 12) / 10, m3: R.int(2, 9), r3: R.int(2, 12) / 10, m4: R.int(2, 9), r4: R.int(2, 12) / 10, k: R.int(2, 8) }),
  p => { const rs = [p.r1, p.r2, p.r3, p.r4]; if (new Set(rs).size < 4) return false; const I = fx(p.m1 * p.r1 * p.r1 + p.m2 * p.r2 * p.r2 + p.m3 * p.r3 * p.r3 + p.m4 * p.r4 * p.r4), w = p.k * Math.PI; return offTie(w) && offTie(I * w * w / 2); },
  { m1: 3, r1: 0.4, m2: 5, r2: 0.6, m3: 2, r3: 0.9, m4: 4, r4: 0.5, k: 4 }),
 build: ({ m1, r1, m2, r2, m3, r3, m4, r4, k }) => { const ms = [m1, m2, m3, m4], rs = [r1, r2, r3, r4], ts = ms.map((m, i) => fx(m * rs[i] * rs[i])), I = fx(ts.reduce((a, b) => a + b, 0)), N = 30 * k, w = k * Math.PI, K = I * w * w / 2; return {
  prompt: `A sample carousel in the vault laboratory is a light frame that turns on a central axle. Four sample pots ride on it: ${n(m1)} kg at ${n(r1)} m from the axle, ${n(m2)} kg at ${n(r2)} m, ${n(m3)} kg at ${n(r3)} m and ${n(m4)} kg at ${n(r4)} m. Treat each pot as a point and ignore the frame’s own mass. The carousel turns steadily at ${n(N)} revolutions per minute (rpm), and one revolution is 2π radians. Enter the moment of inertia about the axle in kg·m², then the rotational kinetic energy in joules, both to 2 decimal places (use the unrounded angular velocity; type the numbers without commas).`,
  answer: [I, rd(K)],
  hints: ['The moment of inertia of point masses is I = Σmr²: square each distance from the axle before multiplying by its mass.', 'Change the rpm to radians per second by multiplying by 2π and dividing by 60, then use K = ½Iω² and keep ω unrounded until the end.'],
  solution: `I = ${mrText(ms, rs)} = ${sumText(ts)} = ${n(I)} kg·m². ω = ${n(N)} × 2π ÷ 60 = ${n(k)}π rad/s. K = ½ × ${n(I)} × (${n(k)}π)² ${eq(K)} ${n(rd(K))} J.`,
  guidance: [
   { prompt: `The carousel turns at ${n(N)} rpm. Multiply by 2π and divide by 60. What is ω, in rad/s to 2 decimal places?`, answer: [rd(w)], explanation: `${n(N)} × 2π ÷ 60 = ${n(k)}π ≈ ${n(rd(w))} rad/s.` },
   { prompt: `Add the four terms mr². What is the moment of inertia I, in kg·m²?`, answer: [I], explanation: `${sumText(ts)} = ${n(I)} kg·m².` },
   { prompt: `With ω = ${n(k)}π rad/s unrounded, what is K = ½Iω², in joules to 2 decimal places?`, answer: [rd(K)], explanation: `½ × ${n(I)} × (${n(k)}π)² ≈ ${n(rd(K))} J.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Charging the storage frame',
 brief: 'A motor is topping up the storage frame, and the vault log needs how fast the frame will be turning afterwards.',
 labels: ['moment of inertia (kg·m²)', 'new angular velocity (rad/s)'], tolerance: 0.005,
 gl: [['moment of inertia (kg·m²)'], ['rotational kinetic energy after (J)'], ['new angular velocity (rad/s)']]
}, {
 /* Two point masses, an even starting ω (so ½ω² is a whole number and K0 has at most 2 decimals) and work E in steps of 50 J.
    The final ω is rounded to 2 decimals, off ties. The radii differ. */
 canonical: { m1: 6, r1: 0.7, m2: 4, r2: 1.1, w0: 4, E: 700 },
 draw: R => tryDraw(R, R => ({ m1: R.int(2, 9), r1: R.int(2, 12) / 10, m2: R.int(2, 9), r2: R.int(2, 12) / 10, w0: 2 * R.int(1, 5), E: 50 * R.int(2, 24) }),
  p => { if (p.r1 === p.r2) return false; const I = fx(p.m1 * p.r1 * p.r1 + p.m2 * p.r2 * p.r2), K1 = fx(I * p.w0 * p.w0 / 2 + p.E); return offTie(Math.sqrt(2 * K1 / I)); },
  { m1: 6, r1: 0.7, m2: 4, r2: 1.1, w0: 4, E: 700 }),
 build: ({ m1, r1, m2, r2, w0, E }) => { const a = fx(m1 * r1 * r1), b = fx(m2 * r2 * r2), I = fx(a + b), K0 = fx(I * w0 * w0 / 2), K1 = fx(K0 + E), w1 = Math.sqrt(2 * K1 / I); return {
  prompt: `The storage flywheel in the vault is a light frame carrying two ballast drums, which you may treat as points: ${n(m1)} kg at ${n(r1)} m from the axle and ${n(m2)} kg at ${n(r2)} m. The frame is already turning at ${n(w0)} rad/s when a motor does ${n(E)} joules of work on it. All of that work becomes rotational kinetic energy of the frame, so its energy afterwards is its energy before plus ${n(E)} J. Enter the frame’s moment of inertia in kg·m², then the angular velocity it reaches in rad/s, both to 2 decimal places (use unrounded values; type the numbers without commas).`,
  answer: [I, rd(w1)],
  hints: ['Find I = Σmr² first, then the energy the frame already holds, ½Iω² at its starting angular velocity.', 'Add the motor’s work to that energy, then solve K = ½Iω² for ω by multiplying by 2, dividing by I and taking the square root.'],
  solution: `I = ${n(m1)} × ${n(r1)}² + ${n(m2)} × ${n(r2)}² = ${n(a)} + ${n(b)} = ${n(I)} kg·m². Energy before: ½ × ${n(I)} × ${n(w0)}² = ${n(K0)} J. Energy after: ${n(K0)} + ${n(E)} = ${n(K1)} J. Then ω = √(2 × ${n(K1)} ÷ ${n(I)}) ${eq(w1)} ${n(rd(w1))} rad/s.`,
  guidance: [
   { prompt: `Add m × r² for the two drums. What is the moment of inertia I, in kg·m²?`, answer: [I], explanation: `${n(a)} + ${n(b)} = ${n(I)} kg·m².` },
   { prompt: `The frame starts with ½ × ${n(I)} × ${n(w0)}² joules. After the motor’s ${n(E)} J is added, how much rotational kinetic energy does it hold, in joules?`, answer: [K1], explanation: `${n(K0)} + ${n(E)} = ${n(K1)} J.` },
   { prompt: `Solve K = ½Iω² for ω with K = ${n(K1)} J. What is ω, in rad/s to 2 decimal places?`, answer: [rd(w1)], explanation: `ω = √(2 × ${n(K1)} ÷ ${n(I)}) ${eq(w1)} ${n(rd(w1))} rad/s.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'The spare energy wheel',
 brief: 'A spare energy wheel is being spun up to its rpm rating, and the crew needs its energy and how fast its outermost weight travels.',
 labels: ['moment of inertia (kg·m²)', 'rotational kinetic energy (J)', 'speed of outer weight (m/s)'], tolerance: 0.005,
 gl: [['angular velocity (rad/s)'], ['moment of inertia (kg·m²)'], ['rotational kinetic energy (J)'], ['speed of outer weight (m/s)']]
}, {
 /* Three point masses (2–12 kg) at three different radii (0.2–1.5 m); ω = kπ from 30k rpm. Everything is off rounding ties. */
 canonical: { m1: 9, r1: 0.6, m2: 5, r2: 1.4, m3: 7, r3: 1, k: 6 },
 draw: R => tryDraw(R, R => ({ m1: R.int(2, 12), r1: R.int(2, 15) / 10, m2: R.int(2, 12), r2: R.int(2, 15) / 10, m3: R.int(2, 12), r3: R.int(2, 15) / 10, k: R.int(2, 9) }),
  p => { if (new Set([p.r1, p.r2, p.r3]).size < 3) return false; const I = fx(p.m1 * p.r1 * p.r1 + p.m2 * p.r2 * p.r2 + p.m3 * p.r3 * p.r3), w = p.k * Math.PI; return offTie(w) && offTie(I * w * w / 2) && offTie(w * Math.max(p.r1, p.r2, p.r3)); },
  { m1: 9, r1: 0.6, m2: 5, r2: 1.4, m3: 7, r3: 1, k: 6 }),
 build: ({ m1, r1, m2, r2, m3, r3, k }) => { const ms = [m1, m2, m3], rs = [r1, r2, r3], ts = ms.map((m, i) => fx(m * rs[i] * rs[i])), I = fx(ts[0] + ts[1] + ts[2]), N = 30 * k, w = k * Math.PI, K = I * w * w / 2, rmax = Math.max(r1, r2, r3), v = w * rmax; return {
  prompt: `A spare energy wheel in the vault is a light frame with three steel weights, which you may treat as points: ${n(m1)} kg at ${n(r1)} m from the axle, ${n(m2)} kg at ${n(r2)} m and ${n(m3)} kg at ${n(r3)} m. Ignore the frame’s own mass. The wheel is run up to ${n(N)} revolutions per minute (rpm), where one revolution is 2π radians, and then held there. Enter its moment of inertia about the axle in kg·m², its rotational kinetic energy in joules, and the speed in m/s of the weight farthest from the axle (a point at distance r moves at v = ωr), all to 2 decimal places (use the unrounded angular velocity; type the numbers without commas).`,
  answer: [I, rd(K), rd(v)],
  hints: ['Change the rpm to radians per second by multiplying by 2π and dividing by 60. The moment of inertia is I = Σmr².', 'The energy is K = ½Iω². The weight with the largest distance r from the axle is the fastest, with speed v = ωr.'],
  solution: `ω = ${n(N)} × 2π ÷ 60 = ${n(k)}π rad/s. I = ${mrText(ms, rs)} = ${sumText(ts)} = ${n(I)} kg·m². K = ½ × ${n(I)} × (${n(k)}π)² ${eq(K)} ${n(rd(K))} J. The farthest weight is at ${n(rmax)} m, so v = ${n(k)}π × ${n(rmax)} ${eq(v)} ${n(rd(v))} m/s.`,
  guidance: [
   { prompt: `The wheel turns at ${n(N)} rpm. Multiply by 2π and divide by 60. What is ω, in rad/s to 2 decimal places?`, answer: [rd(w)], explanation: `${n(N)} × 2π ÷ 60 = ${n(k)}π ≈ ${n(rd(w))} rad/s.` },
   { prompt: `Add the three terms mr². What is the moment of inertia I, in kg·m²?`, answer: [I], explanation: `${sumText(ts)} = ${n(I)} kg·m².` },
   { prompt: `With ω = ${n(k)}π rad/s unrounded, what is K = ½Iω², in joules to 2 decimal places?`, answer: [rd(K)], explanation: `½ × ${n(I)} × (${n(k)}π)² ≈ ${n(rd(K))} J.` },
   { prompt: `The farthest weight is at ${n(rmax)} m. What is its speed v = ωr, in m/s to 2 decimal places?`, answer: [rd(v)], explanation: `v = ${n(k)}π × ${n(rmax)} ${eq(v)} ${n(rd(v))} m/s.` }
  ] }; }
});

/* ---- q37 Torque and Newton's second law for rotation, τ = Iα [10.6, 10.7] ---- */

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Pushing the vault door',
 brief: 'The heavy vault door swings on one hinge, and the safety crew wants to know how quickly one technician’s push gets it moving.',
 labels: ['torque (N·m)', 'angular acceleration (rad/s²)'], tolerance: 0.005,
 gl: [['lever arm (m)'], ['torque (N·m)'], ['angular acceleration (rad/s²)']]
}, {
 /* A push F (30–150 N) at r (0.3–1.2 m) from the hinge at angle aπ/b, on a door of moment of inertia I (10–80). Lever arm, torque and α
    are off rounding ties. Not the worked example (50 N, 0.4 m, π/2, 5 kg·m²). */
 canonical: { F: 60, r: 0.9, a: 2, b: 3, I: 48 },
 draw: R => tryDraw(R, R => { const [a, b] = R.pick(ANGLES); return { F: 10 * R.int(3, 15), r: R.int(3, 12) / 10, a, b, I: R.int(10, 80) }; },
  p => { const s = Math.sin(p.a * Math.PI / p.b), tau = p.r * p.F * s; return offTie(p.r * s) && offTie(tau) && offTie(tau / p.I); },
  { F: 60, r: 0.9, a: 2, b: 3, I: 48 }),
 build: ({ F, r, a, b, I }) => { const ang = piText(a, b), s = Math.sin(a * Math.PI / b), arm = r * s, tau = r * F * s, al = tau / I; return {
  prompt: `A heavy vault door swings on a vertical hinge. A technician pushes on the handle, which is ${n(r)} m from the hinge line, with a force of ${n(F)} N. The angle between the line from the hinge to the handle and the direction of her push is ${ang} radians. The door’s moment of inertia about the hinge is ${n(I)} kg·m², and no other torque acts on it. Enter the torque about the hinge in newton metres (N·m), then the door’s angular acceleration in radians per second squared (rad/s²), both to 2 decimal places (use the unrounded torque for the second).`,
  answer: [rd(tau), rd(al)],
  hints: ['The torque is τ = rF sin θ, with θ the angle between the line from the hinge to the handle and the push. Only the part of the push at right angles to that line turns the door.', 'Newton’s second law for rotation is τ = Iα, so the angular acceleration is the torque divided by the moment of inertia.'],
  solution: `The lever arm is r sin θ = ${n(r)} × sin(${ang}) ${eq(arm)} ${n(rd(arm))} m. The torque is τ = rF sin θ = ${n(r)} × ${n(F)} × sin(${ang}) ${eq(tau)} ${n(rd(tau))} N·m. Then α = τ ÷ I = τ ÷ ${n(I)} ${eq(al)} ${n(rd(al))} rad/s².`,
  guidance: [
   { prompt: `The handle is ${n(r)} m from the hinge and θ = ${ang} radians. What is the lever arm r sin θ, in metres to 2 decimal places?`, answer: [rd(arm)], explanation: `${n(r)} × sin(${ang}) ${eq(arm)} ${n(rd(arm))} m.` },
   { prompt: `The push is ${n(F)} N. Multiply the lever arm by the force. What is the torque, in N·m to 2 decimal places?`, answer: [rd(tau)], explanation: `τ = ${n(r)} × ${n(F)} × sin(${ang}) ${eq(tau)} ${n(rd(tau))} N·m.` },
   { prompt: `The door’s moment of inertia is ${n(I)} kg·m². What is the angular acceleration τ ÷ I, in rad/s² to 2 decimal places?`, answer: [rd(al)], explanation: `α = τ ÷ ${n(I)} ${eq(al)} ${n(rd(al))} rad/s².` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'The starter belt',
 brief: 'A starter belt is spinning up a flywheel against bearing drag, and the vault log needs its speed after a few seconds.',
 labels: ['net torque (N·m)', 'angular velocity (rad/s)'], tolerance: 0.005,
 gl: [['net torque (N·m)'], ['angular acceleration (rad/s²)'], ['angular velocity (rad/s)']]
}, {
 /* Belt pull F (40–200 N, steps of 10) on a drum of radius r (0.2–0.8 m), a bearing friction torque f below the belt torque, the
    flywheel's I (6–40) and a time t (2–12 s). Net torque has at most 2 decimals. α and ω are off ties. */
 canonical: { F: 120, r: 0.5, f: 14, I: 11, t: 5 },
 draw: R => tryDraw(R, R => ({ F: 10 * R.int(4, 20), r: R.int(2, 8) / 10, f: R.int(4, 30), I: R.int(6, 40), t: R.int(2, 12) }),
  p => { const net = fx(p.F * p.r - p.f); return net >= 5 && offTie(net / p.I) && offTie(net / p.I * p.t); },
  { F: 120, r: 0.5, f: 14, I: 11, t: 5 }),
 build: ({ F, r, f, I, t }) => { const app = fx(F * r), net = fx(app - f), al = net / I, w = al * t; return {
  prompt: `A starter belt is wrapped round the rim of a flywheel drum of radius ${n(r)} m. The belt pulls along the rim, at right angles to the radius, with a steady force of ${n(F)} N. The bearings drag against the turning with a steady friction torque of ${n(f)} N·m. The flywheel’s moment of inertia about its axle is ${n(I)} kg·m², and it starts at rest. A body turning with a steady angular acceleration α gains α radians per second of angular velocity every second, so after ${n(t)} seconds ω = α × ${n(t)}. Enter the net torque on the flywheel in N·m, then its angular velocity after ${n(t)} seconds in rad/s, both to 2 decimal places (use the unrounded angular acceleration; type the numbers without commas).`,
  answer: [net, rd(w)],
  hints: ['The belt pulls at right angles to the radius, so its torque is just radius × force. The bearing’s torque works against it, so subtract it to get the net torque.', 'Newton’s second law for rotation, net torque = Iα, gives the angular acceleration. Multiply it, unrounded, by the time to get the angular velocity.'],
  solution: `The belt’s torque is ${n(r)} × ${n(F)} = ${n(app)} N·m, and the bearings take away ${n(f)} N·m, so the net torque is ${n(app)} − ${n(f)} = ${n(net)} N·m. Then α = ${n(net)} ÷ ${n(I)} ${eq(al, 4)} ${n(rd(al, 4))} rad/s², and after ${n(t)} s ω = α × ${n(t)} ${eq(w)} ${n(rd(w))} rad/s.`,
  guidance: [
   { prompt: `The belt’s torque is radius × force, and the bearings drag back with ${n(f)} N·m. What is the net torque, in N·m?`, answer: [net], explanation: `${n(r)} × ${n(F)} − ${n(f)} = ${n(app)} − ${n(f)} = ${n(net)} N·m.` },
   { prompt: `Divide the net torque by the moment of inertia, ${n(I)} kg·m². What is the angular acceleration, in rad/s² to 2 decimal places?`, answer: [rd(al)], explanation: `α = ${n(net)} ÷ ${n(I)} ${eq(al)} ${n(rd(al))} rad/s².` },
   { prompt: `The angular velocity grows by α each second. Using the unrounded α, what is ω after ${n(t)} seconds, in rad/s to 2 decimal places?`, answer: [rd(w)], explanation: `ω = α × ${n(t)} ${eq(w)} ${n(rd(w))} rad/s.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'Spinning up the weighted frame',
 brief: 'A weighted frame must be hand-started up to a set speed, and the crew needs how long a steady pull on the spanner will take.',
 labels: ['moment of inertia (kg·m²)', 'angular acceleration (rad/s²)', 'time (s)'], tolerance: 0.005,
 gl: [['moment of inertia (kg·m²)'], ['angular acceleration (rad/s²)'], ['time to reach the speed (s)']]
}, {
 /* Three point masses (2–9 kg) at different radii (0.2–1.2 m), a pull F (30–120 N) at r (0.4–1.4 m) at angle aπ/b, and a target ω (4–30 rad/s).
    The torque, α and the time are off rounding ties and the time is at least 0.2 s. */
 canonical: { m1: 6, r1: 0.5, m2: 3, r2: 1, m3: 4, r3: 0.8, F: 90, rp: 0.9, a: 1, b: 4, wt: 12 },
 draw: R => tryDraw(R, R => { const [a, b] = R.pick(ANGLES); return { m1: R.int(2, 9), r1: R.int(2, 12) / 10, m2: R.int(2, 9), r2: R.int(2, 12) / 10, m3: R.int(2, 9), r3: R.int(2, 12) / 10, F: 10 * R.int(3, 12), rp: R.int(4, 14) / 10, a, b, wt: R.int(4, 30) }; },
  p => { if (new Set([p.r1, p.r2, p.r3]).size < 3) return false; const I = fx(p.m1 * p.r1 * p.r1 + p.m2 * p.r2 * p.r2 + p.m3 * p.r3 * p.r3), tau = p.rp * p.F * Math.sin(p.a * Math.PI / p.b), al = tau / I; return offTie(tau) && offTie(al) && al < 100 && offTie(p.wt / al) && p.wt / al >= 0.2; },
  { m1: 6, r1: 0.5, m2: 3, r2: 1, m3: 4, r3: 0.8, F: 90, rp: 0.9, a: 1, b: 4, wt: 12 }),
 build: ({ m1, r1, m2, r2, m3, r3, F, rp, a, b, wt }) => { const ms = [m1, m2, m3], rs = [r1, r2, r3], ts = ms.map((m, i) => fx(m * rs[i] * rs[i])), I = fx(ts[0] + ts[1] + ts[2]), ang = piText(a, b), s = Math.sin(a * Math.PI / b), tau = rp * F * s, al = tau / I, t = wt / al; return {
  prompt: `A spare weighted frame in the vault has three steel weights bolted to a light hub, which you may treat as points: ${n(m1)} kg at ${n(r1)} m from the axle, ${n(m2)} kg at ${n(r2)} m and ${n(m3)} kg at ${n(r3)} m. Ignore the frame’s own mass. It starts at rest. A technician pulls with a steady force of ${n(F)} N on a spanner at ${n(rp)} m from the axle, and the angle between the spanner and her pull stays ${ang} radians. No other torque acts. A body turning with a steady angular acceleration α gains α radians per second of angular velocity every second. Enter the frame’s moment of inertia in kg·m², its angular acceleration in rad/s², and the time in seconds she needs to bring it up to ${n(wt)} rad/s, all to 2 decimal places (use the unrounded torque and angular acceleration; type the numbers without commas).`,
  answer: [I, rd(al), rd(t)],
  hints: ['The moment of inertia of point masses is I = Σmr². The pull’s torque is τ = rF sin θ, with r the distance from the axle to where she pulls.', 'Newton’s second law for rotation gives α = τ ÷ I. Starting from rest, the time to reach a given angular velocity is that angular velocity divided by α.'],
  solution: `I = ${mrText(ms, rs)} = ${sumText(ts)} = ${n(I)} kg·m². The torque is τ = ${n(rp)} × ${n(F)} × sin(${ang}) ${eq(tau)} ${n(rd(tau))} N·m, so α = τ ÷ I ${eq(al)} ${n(rd(al))} rad/s². The time to reach ${n(wt)} rad/s is ${n(wt)} ÷ α ${eq(t)} ${n(rd(t))} s.`,
  guidance: [
   { prompt: `Add the three terms mr². What is the moment of inertia I, in kg·m²?`, answer: [I], explanation: `${sumText(ts)} = ${n(I)} kg·m².` },
   { prompt: `The torque is rF sin θ = ${n(rp)} × ${n(F)} × sin(${ang}). Divide it by I. What is α, in rad/s² to 2 decimal places?`, answer: [rd(al)], explanation: `τ ${eq(tau)} ${n(rd(tau))} N·m, and α = τ ÷ ${n(I)} ${eq(al)} ${n(rd(al))} rad/s².` },
   { prompt: `From rest, ω grows by α each second. Using the unrounded α, how many seconds does it take to reach ${n(wt)} rad/s, to 2 decimal places?`, answer: [rd(t)], explanation: `t = ${n(wt)} ÷ α ${eq(t)} ${n(rd(t))} s.` }
  ] }; }
});

/* ---- q38 Conservation of angular momentum [11.3] ---- */

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The turntable and the weights',
 brief: 'A technician on a maintenance turntable pulls two weights in towards her, and the vault wants the new spin and what it cost her.',
 labels: ['angular momentum (kg·m²/s)', 'new angular velocity (rad/s)', 'energy gained (J)'], tolerance: 0.005,
 gl: [['angular momentum (kg·m²/s)'], ['new angular velocity (rad/s)'], ['rotational kinetic energy gained (J)']]
}, {
 /* I1 is 20–60 kg·m², I2 is 6 or more below it and at least 8; ω1 is 2–12 rad/s. The new ω and the energy gained are off ties. */
 canonical: { I1: 36, I2: 24, w1: 5 },
 draw: R => tryDraw(R, R => { const I1 = R.int(20, 60); return { I1, I2: I1 - R.int(6, I1 - 8), w1: R.int(2, 12) }; },
  p => { const L = p.I1 * p.w1, w2 = L / p.I2, dK = L * L / (2 * p.I2) - L * L / (2 * p.I1); return p.I2 >= 8 && offTie(w2) && offTie(dK); },
  { I1: 36, I2: 24, w1: 5 }),
 build: ({ I1, I2, w1 }) => { const L = I1 * w1, w2 = L / I2, K1 = I1 * w1 * w1 / 2, K2 = L * L / (2 * I2), dK = K2 - K1; return {
  prompt: `A maintenance turntable in the vault carries a technician who holds two weights out at arm’s length. Together they have a moment of inertia of ${n(I1)} kg·m² about the axis and spin freely at ${n(w1)} rad/s. She pulls the weights in close to the axis, which lowers the moment of inertia to ${n(I2)} kg·m². No outside torque acts about the axis. Enter the angular momentum before she pulls in kg·m²/s, then the new angular velocity in rad/s, then the rotational kinetic energy gained in joules (the extra energy comes from her muscles); give the last two to 2 decimal places (use the unrounded angular velocity for the energy; type the numbers without commas).`,
  answer: [L, rd(w2), rd(dK)],
  hints: ['Angular momentum is L = Iω, and with no outside torque the product Iω is the same before and after she pulls the weights in.', 'Work out the rotational kinetic energy ½Iω² before and after, and subtract.'],
  solution: `L = ${n(I1)} × ${n(w1)} = ${n(L)} kg·m²/s. Afterwards I = ${n(I2)} kg·m², so ω = ${n(L)} ÷ ${n(I2)} ${eq(w2)} ${n(rd(w2))} rad/s. Kinetic energy before: ½ × ${n(I1)} × ${n(w1)}² = ${n(K1)} J. After: ½ × ${n(I2)} × ω² = ${n(L)}² ÷ (2 × ${n(I2)}) ${eq(K2)} ${n(rd(K2))} J. Gained: ${n(rd(K2))} − ${n(K1)} = ${n(rd(dK))} J.`,
  guidance: [
   { prompt: `What is the angular momentum before she pulls the weights in, in kg·m²/s?`, answer: [L], explanation: `L = Iω = ${n(I1)} × ${n(w1)} = ${n(L)} kg·m²/s.` },
   { prompt: `Angular momentum is kept and the moment of inertia is now ${n(I2)} kg·m². What is the new angular velocity, in rad/s to 2 decimal places?`, answer: [rd(w2)], explanation: `ω = ${n(L)} ÷ ${n(I2)} ${eq(w2)} ${n(rd(w2))} rad/s.` },
   { prompt: `The energy before is ½ × ${n(I1)} × ${n(w1)}². How much rotational kinetic energy is gained, in joules to 2 decimal places?`, answer: [rd(dK)], explanation: `${n(K1)} J before and ${n(L)}² ÷ (2 × ${n(I2)}) ${eq(K2)} ${n(rd(K2))} J after, so ${eq(dK)} ${n(rd(dK))} J is gained.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'Closing the clutch on a moving wheel',
 brief: 'A clutch is about to join two drive wheels that are both already turning, and the crew needs the speed they settle at and the energy lost.',
 labels: ['common angular velocity (rad/s)', 'energy lost (J)'], tolerance: 0.005,
 gl: [['total angular momentum (kg·m²/s)'], ['common angular velocity (rad/s)'], ['energy lost (J)']]
}, {
 /* Both wheels turn the same way, B more slowly than A. The common ω and the energy lost are off rounding ties. */
 canonical: { IA: 24, wA: 30, IB: 16, wB: 12 },
 draw: R => tryDraw(R, R => { const wA = R.int(10, 60); return { IA: R.int(8, 40), wA, IB: R.int(4, 30), wB: R.int(2, wA - 3) }; },
  p => { const L = p.IA * p.wA + p.IB * p.wB, I = p.IA + p.IB, w = L / I, lost = p.IA * p.wA * p.wA / 2 + p.IB * p.wB * p.wB / 2 - L * L / (2 * I); return offTie(w) && offTie(lost) && offTie(L * L / (2 * I)); },
  { IA: 24, wA: 30, IB: 16, wB: 12 }),
 build: ({ IA, wA, IB, wB }) => { const LA = IA * wA, LB = IB * wB, L = LA + LB, I = IA + IB, w = L / I, K1 = fx(IA * wA * wA / 2 + IB * wB * wB / 2), K2 = L * L / (2 * I), lost = K1 - K2; return {
  prompt: `Two drive wheels sit on one shaft in the vault. Wheel A, with a moment of inertia of ${n(IA)} kg·m², turns at ${n(wA)} rad/s, and wheel B, with a moment of inertia of ${n(IB)} kg·m², turns the same way at ${n(wB)} rad/s. Their clutch is then closed, so the two lock together and turn as one, and no outside torque acts about the shaft. Enter the common angular velocity afterwards in rad/s, then the rotational kinetic energy lost to heat in joules, both to 2 decimal places (use the unrounded angular velocity for the energy; type the numbers without commas).`,
  answer: [rd(w), rd(lost)],
  hints: ['Each wheel has angular momentum Iω. Both turn the same way, so the two amounts add, and the total is kept when they lock.', 'Locked together, the moments of inertia add. The energy lost is the total ½Iω² before, from both wheels, minus the energy after.'],
  solution: `L = ${n(IA)} × ${n(wA)} + ${n(IB)} × ${n(wB)} = ${n(LA)} + ${n(LB)} = ${n(L)} kg·m²/s. Locked together, I = ${n(IA)} + ${n(IB)} = ${n(I)} kg·m², so ω = ${n(L)} ÷ ${n(I)} ${eq(w)} ${n(rd(w))} rad/s. Energy before: ½ × ${n(IA)} × ${n(wA)}² + ½ × ${n(IB)} × ${n(wB)}² = ${n(K1)} J. After: ${n(L)}² ÷ (2 × ${n(I)}) ${eq(K2)} ${n(rd(K2))} J. Lost: ${n(K1)} − ${n(rd(K2))} = ${n(rd(lost))} J.`,
  guidance: [
   { prompt: `Both wheels turn the same way, so their angular momenta add. What is the total angular momentum Iω of the two wheels, in kg·m²/s?`, answer: [L], explanation: `${n(IA)} × ${n(wA)} + ${n(IB)} × ${n(wB)} = ${n(LA)} + ${n(LB)} = ${n(L)} kg·m²/s.` },
   { prompt: `The locked pair has a moment of inertia of ${n(I)} kg·m². Angular momentum is kept. What is the common angular velocity, in rad/s to 2 decimal places?`, answer: [rd(w)], explanation: `ω = ${n(L)} ÷ ${n(I)} ${eq(w)} ${n(rd(w))} rad/s.` },
   { prompt: `The two wheels held ${n(K1)} J of rotational kinetic energy before they locked. How much is lost, in joules to 2 decimal places?`, answer: [rd(lost)], explanation: `After locking the energy is ${n(L)}² ÷ (2 × ${n(I)}) ${eq(K2)} ${n(rd(K2))} J, so ${n(K1)} − ${n(rd(K2))} = ${n(rd(lost))} J is lost.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q37', title: 'Counter-rotating wheels and a brake',
 brief: 'Two wheels spinning against each other are about to be locked and braked, and the crew needs which way the pair ends up turning and how long it takes to stop.',
 labels: ['total angular momentum (kg·m²/s)', 'common angular velocity (rad/s)', 'time to stop (s)'], tolerance: 0.005,
 gl: [['total angular momentum (kg·m²/s)'], ['common angular velocity (rad/s)'], ['time to stop (s)']]
}, {
 /* A turns the positive way, B the other way. L is not 0 and is at least 30 in size; the common ω is at least 0.5 in size, off ties; the
    time |L| ÷ T is off a tie. The sign of L varies from draw to draw. */
 canonical: { IA: 20, wA: 8, IB: 14, wB: 15, T: 25 },
 draw: R => tryDraw(R, R => ({ IA: R.int(6, 30), wA: R.int(4, 30), IB: R.int(6, 30), wB: R.int(4, 30), T: R.pick([5, 8, 10, 15, 20, 25, 40, 50]) }),
  p => { const L = p.IA * p.wA - p.IB * p.wB, w = L / (p.IA + p.IB); return Math.abs(L) >= 30 && Math.abs(w) >= 0.5 && offTie(w) && offTie(Math.abs(L) / p.T); },
  { IA: 20, wA: 8, IB: 14, wB: 15, T: 25 }),
 build: ({ IA, wA, IB, wB, T }) => { const LA = IA * wA, LB = -IB * wB, L = LA + LB, I = IA + IB, w = L / I, t = Math.abs(L) / T, way = w < 0 ? 'negative, so the pair turns the way B was turning' : 'positive, so the pair turns the way A was turning'; return {
  prompt: `Two wheels sit on one shaft in the vault and turn in opposite directions. Wheel A, with a moment of inertia of ${n(IA)} kg·m², turns at ${n(wA)} rad/s, and wheel B, with a moment of inertia of ${n(IB)} kg·m², turns the other way at ${n(wB)} rad/s. Take the way A turns as positive, so B’s angular velocity is ${par(-wB)} rad/s and its angular momentum is negative. The two are locked together, with no outside torque during the locking, and then a brake applies a steady torque of ${n(T)} N·m against the turning of the locked pair until it stops. Enter the total angular momentum before locking in kg·m²/s (negative if B’s is the larger), the common angular velocity after locking in rad/s (negative if the pair turns B’s way), and the time the brake takes to stop the pair in seconds; give the last two to 2 decimal places (use the unrounded angular velocity; type the numbers without commas).`,
  answer: [L, rd(w), rd(t)],
  hints: ['Angular momentum has a sign: A’s is Iω and B’s is I × (−ω). The total before locking is kept after it.', 'A steady brake torque gives the locked pair an angular acceleration of size T ÷ I. The time to stop is the size of the angular velocity divided by that, whichever way the pair turns.'],
  solution: `L = ${n(IA)} × ${n(wA)} + ${n(IB)} × ${par(-wB)} = ${n(LA)} − ${n(-LB)} = ${n(L)} kg·m²/s. Locked together, I = ${n(IA)} + ${n(IB)} = ${n(I)} kg·m², so ω = ${n(L)} ÷ ${n(I)} ${eq(w)} ${n(rd(w))} rad/s; that is ${way}. The brake gives an angular acceleration of size ${n(T)} ÷ ${n(I)}, so the time to stop is |ω| ÷ (${n(T)} ÷ ${n(I)}) = |L| ÷ ${n(T)} = ${n(Math.abs(L))} ÷ ${n(T)} ${eq(t)} ${n(rd(t))} s.`,
  guidance: [
   { prompt: `A’s angular momentum is ${n(IA)} × ${n(wA)}, and B’s is ${n(IB)} × ${par(-wB)}. What is the total angular momentum, in kg·m²/s?`, answer: [L], explanation: `${n(LA)} − ${n(-LB)} = ${n(L)} kg·m²/s.` },
   { prompt: `The locked pair has a moment of inertia of ${n(I)} kg·m². What is the common angular velocity, in rad/s to 2 decimal places? Keep its sign.`, answer: [rd(w)], explanation: `ω = ${n(L)} ÷ ${n(I)} ${eq(w)} ${n(rd(w))} rad/s.` },
   { prompt: `The brake torque is ${n(T)} N·m. How many seconds does it take to stop the pair, to 2 decimal places? (Use the unrounded angular velocity.)`, answer: [rd(t)], explanation: `α has size ${n(T)} ÷ ${n(I)}, and |ω| ÷ α = |L| ÷ ${n(T)} = ${n(Math.abs(L))} ÷ ${n(T)} ${eq(t)} ${n(rd(t))} s.` }
  ] }; }
});

/* ---- q39 Universal gravitation and circular orbits [13.1, 13.4] ---- */

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The relay probe at the moon',
 brief: 'A relay probe is going into orbit round a small moon, and the tracking crew needs the pull on it and the speed it must fly.',
 labels: ['force of gravity on the probe (N)', 'orbital speed (m/s)'], tolerance: 0.005,
 gl: [['GM (m³/s², in units given)'], ['force of gravity (N)'], ['orbital speed (m/s)']]
}, {
 /* A moon of mass mant × 10^ex kg (ex 22 or 23) and a probe of mass m (100–900 kg, steps of 50) in a circular orbit of radius r km from the
    moon's centre (1500–4000 km, steps of 100). The force is to 2 decimals and the speed to the nearest whole number, both off ties. */
 canonical: { mant: 7.3, ex: 22, m: 450, r: 2800 },
 draw: R => tryDraw(R, R => ({ mant: R.int(20, 99) / 10, ex: R.pick([22, 23]), m: 50 * R.int(2, 18), r: 100 * R.int(15, 40) }),
  p => { const GM = 6.67e-11 * p.mant * Math.pow(10, p.ex), rm = p.r * 1000; return offTie(GM * p.m / (rm * rm)) && offTie(Math.sqrt(GM / rm), 0) && offTie(fx(6.67 * p.mant)); },
  { mant: 7.3, ex: 22, m: 450, r: 2800 }),
 build: ({ mant, ex, m, r }) => { const gm = fx(6.67 * mant), GM = 6.67e-11 * mant * Math.pow(10, ex), rm = r * 1000, F = GM * m / (rm * rm), v = Math.sqrt(GM / rm); return {
  prompt: `A relay probe of mass ${n(m)} kg is to circle a small moon in a circular orbit. The moon has mass ${n(mant)} × 10${sup(ex)} kg, and the orbit’s radius, measured from the moon’s centre, is ${n(r)} km. Take G = 6.67 × 10⁻¹¹ N·m²/kg². Enter the force of gravity on the probe in newtons, to 2 decimal places, then the orbital speed in metres per second, to the nearest whole number (type the numbers without commas).`,
  answer: [rd(F), rd(v, 0)],
  hints: ['Newton’s law of universal gravitation gives the force on the probe as F = GMm ÷ r², with r in metres.', 'In a circular orbit gravity supplies the centripetal force, so v = √(GM ÷ r), with r in metres. The probe’s own mass cancels.'],
  solution: `GM = 6.67 × 10⁻¹¹ × ${n(mant)} × 10${sup(ex)} = ${n(gm)} × 10${sup(ex - 11)} m³/s², and r = ${n(r)} × 1000 m. The force is F = GMm ÷ r² = ${n(gm)} × 10${sup(ex - 11)} × ${n(m)} ÷ (${n(r)} × 1000)² ${eq(F)} ${n(rd(F))} N. The speed is v = √(GM ÷ r) ${eq(v, 0)} ${n(rd(v, 0))} m/s.`,
  guidance: [
   { prompt: `What is GM, the gravitational constant times the moon’s mass, in units of 10${sup(ex - 11)} m³/s², to 2 decimal places? (Multiply 6.67 by ${n(mant)}.)`, answer: [rd(gm)], explanation: `6.67 × 10⁻¹¹ × ${n(mant)} × 10${sup(ex)} ${eq(gm)} ${n(rd(gm))} × 10${sup(ex - 11)} m³/s².` },
   { prompt: `Gravity on the probe is GMm ÷ r², with r = ${n(r)} × 1000 m. What is the force, in newtons to 2 decimal places?`, answer: [rd(F)], explanation: `F = ${n(gm)} × 10${sup(ex - 11)} × ${n(m)} ÷ (${n(r)} × 1000)² ${eq(F)} ${n(rd(F))} N.` },
   { prompt: `Gravity supplies the centripetal force, so v = √(GM ÷ r). What is the orbital speed, in m/s to the nearest whole number?`, answer: [rd(v, 0)], explanation: `√(GM ÷ r) ${eq(v, 0)} ${n(rd(v, 0))} m/s.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Passes over the ground station',
 brief: 'A weather satellite is to pass over the ground station as often as it can, and the crew needs how many full laps it makes in a day.',
 labels: ['orbital speed (m/s)', 'orbital period (minutes)', 'full orbits in 24 hours'], tolerance: 0.005,
 gl: [['orbital speed (m/s)'], ['orbital period (minutes)'], ['full orbits in 24 hours']]
}, {
 /* Planet mass mant × 10^24 kg, radius R km and height h km. Speed to the nearest whole number and period to 2 decimals, off ties. The number of
    laps in 1440 minutes is a whole number of full laps, and 1440 ÷ T is at least 0.1 away from a whole number. */
 canonical: { mant: 5.4, R: 5800, h: 1200 },
 draw: R => tryDraw(R, R => ({ mant: R.int(30, 99) / 10, R: 100 * R.int(30, 70), h: 100 * R.int(2, 20) }),
  p => { const r = (p.R + p.h) * 1000, v = Math.sqrt(6.67e-11 * p.mant * 1e24 / r), T = 2 * Math.PI * r / v / 60, q = 1440 / T, fr = q - Math.floor(q); return offTie(v, 0) && offTie(T) && fr > 0.1 && fr < 0.9; },
  { mant: 5.4, R: 5800, h: 1200 }),
 build: ({ mant, R, h }) => { const rk = R + h, r = rk * 1000, gm = fx(6.67 * mant), v = Math.sqrt(6.67e-11 * mant * 1e24 / r), Ts = 2 * Math.PI * r / v, T = Ts / 60, q = 1440 / T, laps = Math.floor(q); return {
  prompt: `A weather satellite is to circle a planet of mass ${n(mant)} × 10²⁴ kg and radius ${n(R)} km in a circular orbit ${n(h)} km above the surface, so that it can pass over the outpost’s ground station as often as possible. Take G = 6.67 × 10⁻¹¹ N·m²/kg², and measure the orbit’s radius from the planet’s centre. Enter the orbital speed in metres per second, to the nearest whole number, then the orbital period in minutes, to 2 decimal places (use the unrounded speed for the period), then the number of full orbits it completes in 24 hours, which is 1440 minutes (a lap that is only partly finished does not count). Type the numbers without commas.`,
  answer: [rd(v, 0), rd(T), laps],
  hints: ['The orbit’s radius is the planet’s radius plus the height, in metres. Gravity supplies the centripetal force, so v = √(GM ÷ r).', 'The period is T = 2πr ÷ v, in seconds, divided by 60 for minutes. Divide 1440 by the unrounded period and keep only the whole number of laps.'],
  solution: `r = ${n(R)} km + ${n(h)} km = ${n(rk)} km = ${n(rk)} × 1000 m. GM = 6.67 × 10⁻¹¹ × ${n(mant)} × 10²⁴ = ${n(gm)} × 10¹³ m³/s². v = √(GM ÷ r) ≈ ${n(rd(v, 1))} m/s, which is ${n(rd(v, 0))} m/s to the nearest whole number. T = 2πr ÷ v ≈ ${n(rd(Ts, 1))} s, which is about ${n(rd(T))} minutes. In 1440 minutes it makes 1440 ÷ T ≈ ${n(rd(q))} laps, so ${n(laps)} full orbits.`,
  guidance: [
   { prompt: `The orbit’s radius is ${n(rk)} km from the planet’s centre. Gravity supplies the centripetal force, so v = √(GM ÷ r) with r in metres. What is the orbital speed, in m/s to the nearest whole number?`, answer: [rd(v, 0)], explanation: `GM = ${n(gm)} × 10¹³ m³/s², and √(GM ÷ r) ≈ ${n(rd(v, 1))}, so v ≈ ${n(rd(v, 0))} m/s.` },
   { prompt: `One lap is 2πr long. What is the period T = 2πr ÷ v, in minutes to 2 decimal places?`, answer: [rd(T)], explanation: `2πr ÷ v ≈ ${n(rd(Ts, 1))} s, and ÷ 60 gives about ${n(rd(T))} minutes.` },
   { prompt: `In 1440 minutes the satellite makes 1440 ÷ T laps. How many full orbits is that?`, answer: [laps], explanation: `1440 ÷ T ≈ ${n(rd(q))}, and only the ${n(laps)} finished laps count.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q19', title: 'An orbit round a planet with no known mass',
 brief: 'Survey probes measured a distant planet’s surface gravity but never its mass, and the crew still needs a satellite’s speed, period and weight in orbit.',
 labels: ['orbital speed (m/s)', 'orbital period (minutes)', 'weight at the orbit (N)'], tolerance: 0.005,
 gl: [['GM (units given)'], ['orbital speed (m/s)'], ['orbital period (minutes)'], ['weight at the orbit (N)']]
}, {
 /* Surface gravity gs (3.0–14.0 m/s², one decimal), radius R (2000–8000 km, steps of 100), height h (200–2000 km, steps of 100) and a satellite of
    mass m (200–800 kg, steps of 50). GM = gs R² in units of 10¹² m³/s². Speed to a whole number, period and force to 2 decimals, off ties. */
 canonical: { gs: 6.2, R: 5200, h: 800, m: 350 },
 draw: R => tryDraw(R, R => ({ gs: R.int(30, 140) / 10, R: 100 * R.int(20, 80), h: 100 * R.int(2, 20), m: 50 * R.int(4, 16) }),
  p => { const GM = p.gs * Math.pow(p.R * 1000, 2), r = (p.R + p.h) * 1000, v = Math.sqrt(GM / r), T = 2 * Math.PI * r / v / 60; return offTie(GM / 1e12) && offTie(v, 0) && offTie(T) && offTie(GM * p.m / (r * r)); },
  { gs: 6.2, R: 5200, h: 800, m: 350 }),
 build: ({ gs, R, h, m }) => { const rk = R + h, r = rk * 1000, GM = gs * Math.pow(R * 1000, 2), gm = fx(GM / 1e12), v = Math.sqrt(GM / r), Ts = 2 * Math.PI * r / v, T = Ts / 60, F = GM * m / (r * r); return {
  prompt: `Survey probes have measured the surface gravity of a distant planet, g_s = ${n(gs)} m/s², and its radius, ${n(R)} km, but nobody has measured its mass. At the planet’s surface a mass m has weight m × g_s, and gravity there is GMm ÷ R², so GM = g_s × R² with R in metres (this takes the place of G and the mass). A satellite of mass ${n(m)} kg is to fly a circular orbit ${n(h)} km above the surface; measure the orbit’s radius r from the planet’s centre. Enter the orbital speed in metres per second, to the nearest whole number, then the orbital period in minutes, to 2 decimal places (use the unrounded speed for the period), then the satellite’s weight at that orbit, which is the force of gravity on it there, in newtons to 2 decimal places. Type the numbers without commas.`,
  answer: [rd(v, 0), rd(T), rd(F)],
  hints: ['Find GM = g_s × R² with R in metres, and the orbit’s radius r = R + h in metres. Gravity supplies the centripetal force, so v = √(GM ÷ r).', 'The period is T = 2πr ÷ v in seconds, divided by 60 for minutes. The force of gravity on the satellite at the orbit is GMm ÷ r², which is smaller than m × g_s because r is larger than R.'],
  solution: `GM = ${n(gs)} × (${n(R)} × 1000)² = ${n(gm)} × 10¹² m³/s². The orbit’s radius is r = ${n(R)} + ${n(h)} = ${n(rk)} km = ${n(rk)} × 1000 m. The speed is v = √(GM ÷ r) ${eq(v, 0)} ${n(rd(v, 0))} m/s. The period is T = 2πr ÷ v ≈ ${n(rd(Ts, 1))} s, which is about ${n(rd(T))} minutes. The force on the satellite is GMm ÷ r² = ${n(gm)} × 10¹² × ${n(m)} ÷ (${n(rk)} × 1000)² ${eq(F)} ${n(rd(F))} N.`,
  guidance: [
   { prompt: `Work out GM = g_s × R², with R = ${n(R)} × 1000 m. What is GM, in units of 10¹² m³/s², to 2 decimal places?`, answer: [rd(gm)], explanation: `${n(gs)} × (${n(R)} × 1000)² = ${n(gm)} × 10¹² m³/s², which is ${n(rd(gm))} to 2 decimal places.` },
   { prompt: `The orbit’s radius is ${n(rk)} km from the centre. What is the orbital speed v = √(GM ÷ r), in m/s to the nearest whole number?`, answer: [rd(v, 0)], explanation: `√(GM ÷ r) ${eq(v, 0)} ${n(rd(v, 0))} m/s.` },
   { prompt: `What is the period T = 2πr ÷ v, in minutes to 2 decimal places?`, answer: [rd(T)], explanation: `2πr ÷ v ≈ ${n(rd(Ts, 1))} s, and ÷ 60 gives about ${n(rd(T))} minutes.` },
   { prompt: `What is the force of gravity GMm ÷ r² on the ${n(m)} kg satellite at the orbit, in newtons to 2 decimal places?`, answer: [rd(F)], explanation: `${n(gm)} × 10¹² × ${n(m)} ÷ (${n(rk)} × 1000)² ${eq(F)} ${n(rd(F))} N.` }
  ] }; }
});

/* ---- q40 Realm review: a two-dimensional collision then a climb; bridge to Waves [9.5, 8.3] ---- */

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Two pods on the launch cradle',
 brief: 'Two supply pods are about to couple on the launch cradle, and the crew needs how the pair moves and how far up the slope it will coast.',
 labels: ['vx (m/s)', 'speed after coupling (m/s)', 'height climbed (m)'], tolerance: 0.005,
 gl: [['vx (m/s)'], ['vy (m/s)'], ['speed after coupling (m/s)'], ['height climbed (m)']]
}, {
 /* Pod P (west, m1 × v1) and pod Q (north, m2 × v2), masses in steps of 100 kg and speeds in steps of 0.5 m/s. vx and vy have at most 2 decimals, the speed
    and the height are off ties. Not the worked example (200 kg and 200 kg, 3 and 4 m/s). */
 canonical: { m1: 600, v1: 3, m2: 300, v2: 6 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), v1: R.int(2, 12) / 2, m2: 100 * R.int(1, 8), v2: R.int(2, 12) / 2 }),
  p => { const M = p.m1 + p.m2, vx = p.m1 * p.v1 / M, vy = p.m2 * p.v2 / M, s2 = vx * vx + vy * vy; return exact(vx) && exact(vy) && offTie(Math.sqrt(s2)) && offTie(s2 / (2 * g)) && !(p.m1 === 200 && p.m2 === 200 && p.v1 === 3 && p.v2 === 4); },
  { m1: 600, v1: 3, m2: 300, v2: 6 }),
 build: ({ m1, v1, m2, v2 }) => { const M = m1 + m2, px = -m1 * v1, py = m2 * v2, vx = px / M, vy = py / M, s2 = vx * vx + vy * vy, s = Math.sqrt(s2), hh = s2 / (2 * g); return {
  prompt: `Two supply pods sit on a launch cradle, and the cradle’s floor is level. Pod P (${n(m1)} kg) slides west at ${n(v1)} m/s and pod Q (${n(m2)} kg) slides north at ${n(v2)} m/s. Take east as the positive x direction and north as the positive y direction. They meet and couple together, with no outside force along the floor. The coupled pair then slides on, up a frictionless slope, until it stops. Take g = 9.8 m/s². Enter the x component of the pair’s velocity just after coupling in metres per second (negative if it points west), then the speed of the pair in metres per second, then the height it climbs in metres, all to 2 decimal places (use the unrounded speed for the height).`,
  answer: [vx, rd(s), rd(hh)],
  hints: ['Momentum is kept in each direction separately. West is the negative x direction, so P’s x momentum is negative, and only Q has any y momentum.', 'The speed is √(vx² + vy²), whichever way the components point. On the frictionless slope the kinetic energy ½Mv² becomes potential energy Mgh.'],
  solution: `In x: ${n(m1)} × ${par(-v1)} = ${n(px)} kg·m/s, so vx = ${n(px)} ÷ ${n(M)} = ${n(vx)} m/s. In y: ${n(m2)} × ${n(v2)} = ${n(py)} kg·m/s, so vy = ${n(py)} ÷ ${n(M)} = ${n(vy)} m/s. The speed is √(${par(vx)}² + ${n(vy)}²) = √${n(s2)} ${eq(s)} ${n(rd(s))} m/s. On the slope ½Mv² = Mgh, so h = v² ÷ (2 × 9.8) = ${n(s2)} ÷ 19.6 ${eq(hh)} ${n(rd(hh))} m.`,
  guidance: [
   { prompt: `Only P moves in the x direction, and it moves west, so its velocity is ${par(-v1)} m/s. What is the pair’s x component of velocity just after coupling, in m/s?`, answer: [vx], explanation: `vx = ${n(m1)} × ${par(-v1)} ÷ ${n(M)} = ${n(px)} ÷ ${n(M)} = ${n(vx)} m/s.` },
   { prompt: `Only Q moves in the y direction. What is the pair’s y component of velocity, in m/s?`, answer: [vy], explanation: `vy = ${n(m2)} × ${n(v2)} ÷ ${n(M)} = ${n(py)} ÷ ${n(M)} = ${n(vy)} m/s.` },
   { prompt: `Combine the two components. What is the speed of the pair, in m/s to 2 decimal places?`, answer: [rd(s)], explanation: `√(${par(vx)}² + ${n(vy)}²) = √${n(s2)} ${eq(s)} ${n(rd(s))} m/s.` },
   { prompt: `All of the pair’s kinetic energy becomes potential energy on the frictionless slope. What height does it climb, in metres to 2 decimal places?`, answer: [rd(hh)], explanation: `½Mv² = Mgh, so h = v² ÷ 19.6 = ${n(s2)} ÷ 19.6 ${eq(hh)} ${n(rd(hh))} m.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Trolleys on the rough strip',
 brief: 'Two cargo trolleys will latch and run onto a rough braking strip, and the crew needs how far the pair slides before it stops.',
 labels: ['speed after latching (m/s)', 'sliding distance (m)'], tolerance: 0.005,
 gl: [['speed after latching (m/s)'], ['kinetic energy of the pair (J)'], ['sliding distance (m)']]
}, {
 /* Trolley A (east) and trolley B (north), masses in steps of 100 kg, speeds in steps of 0.5 m/s, and μ one of 0.1–0.5. The components have at most 2
    decimals so the pair's energy is exact to 2 decimals; the speed and the distance are off ties. Not the worked example. */
 canonical: { m1: 500, v1: 4, m2: 300, v2: 6, mu: 0.25 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), v1: R.int(2, 12) / 2, m2: 100 * R.int(1, 8), v2: R.int(2, 12) / 2, mu: R.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]) }),
  p => { const M = p.m1 + p.m2, vx = p.m1 * p.v1 / M, vy = p.m2 * p.v2 / M, s2 = vx * vx + vy * vy, d = s2 / (2 * p.mu * g); return exact(vx) && exact(vy) && exact(M * s2 / 2) && offTie(Math.sqrt(s2)) && offTie(d) && d < 60 && !(p.m1 === 200 && p.m2 === 200 && p.v1 === 3 && p.v2 === 4); },
  { m1: 500, v1: 4, m2: 300, v2: 6, mu: 0.25 }),
 build: ({ m1, v1, m2, v2, mu }) => { const M = m1 + m2, px = m1 * v1, py = m2 * v2, vx = px / M, vy = py / M, s2 = vx * vx + vy * vy, s = Math.sqrt(s2), K = fx(M * s2 / 2), d = K / (mu * M * g); return {
  prompt: `Two cargo trolleys cross the docking floor at right angles. Trolley A (${n(m1)} kg) rolls east at ${n(v1)} m/s and trolley B (${n(m2)} kg) rolls north at ${n(v2)} m/s. Take east as the x direction and north as the y direction. They meet and latch together, with no outside force along the floor, and the pair rolls on at its new velocity. It then runs onto a rough braking strip, where the friction force on it is μMg, with M the total mass, g = 9.8 m/s² and the coefficient of kinetic friction μ = ${n(mu)}. Friction does negative work equal to its force times the distance slid, and that work removes all of the pair’s kinetic energy before it stops. Enter the speed of the pair just after latching in m/s, then the distance it slides on the strip in metres, both to 2 decimal places (use the unrounded speed for the distance).`,
  answer: [rd(s), rd(d)],
  hints: ['Momentum is kept in x and in y separately: the x momentum of A alone and the y momentum of B alone are shared out over the joined mass. The speed is √(vx² + vy²).', 'The kinetic energy of the pair is ½Mv². Setting that equal to the friction force μMg times the distance gives the distance.'],
  solution: `In x: vx = ${n(m1)} × ${n(v1)} ÷ ${n(M)} = ${n(vx)} m/s. In y: vy = ${n(m2)} × ${n(v2)} ÷ ${n(M)} = ${n(vy)} m/s. The speed is √(${n(vx)}² + ${n(vy)}²) = √${n(s2)} ${eq(s)} ${n(rd(s))} m/s. The kinetic energy is ½ × ${n(M)} × ${n(s2)} = ${n(K)} J. The friction force is ${n(mu)} × ${n(M)} × 9.8 = ${n(fx(mu * M * g))} N, so the distance is ${n(K)} ÷ ${n(fx(mu * M * g))} ${eq(d)} ${n(rd(d))} m.`,
  guidance: [
   { prompt: `Momentum is kept in each direction. What is the speed of the latched pair, √(vx² + vy²), in m/s to 2 decimal places?`, answer: [rd(s)], explanation: `vx = ${n(vx)} m/s and vy = ${n(vy)} m/s, so the speed is √${n(s2)} ${eq(s)} ${n(rd(s))} m/s.` },
   { prompt: `What is the kinetic energy ½Mv² of the pair, with M = ${n(M)} kg and v² = ${n(s2)} m²/s², in joules?`, answer: [K], explanation: `½ × ${n(M)} × ${n(s2)} = ${n(K)} J.` },
   { prompt: `The friction force is μMg = ${n(mu)} × ${n(M)} × 9.8 N. How far does it slide before the friction work uses up all of the kinetic energy, in metres to 2 decimal places?`, answer: [rd(d)], explanation: `d = ${n(K)} ÷ ${n(fx(mu * M * g))} ${eq(d)} ${n(rd(d))} m.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q32', title: 'The jolt on module A',
 brief: 'Module A takes a hard jolt as module B latches on, and the crew needs the average force on it as well as how far the pair climbs.',
 labels: ['speed after latching (m/s)', 'height climbed (m)', 'average force on A (N)'], tolerance: 0.005,
 gl: [['speed after latching (m/s)'], ['height climbed (m)'], ['change in A’s velocity (m/s)'], ['average force on A (N)']]
}, {
 /* A (east, m1 × v1) and B (north, m2 × v2); the latch takes t seconds (0.2–0.9 s, whole tenths). vx and vy have at most 2 decimals.
    A's change of velocity is (vx − v1, vy). The speed, height, |Δv| and force are off ties and the force is under 90000 N. */
 canonical: { m1: 700, v1: 4.5, m2: 200, v2: 7, t: 0.4 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(2, 9), v1: R.int(4, 14) / 2, m2: 100 * R.int(1, 8), v2: R.int(4, 14) / 2, t: R.int(2, 9) / 10 }),
  p => { const M = p.m1 + p.m2, vx = p.m1 * p.v1 / M, vy = p.m2 * p.v2 / M, s2 = vx * vx + vy * vy, dv = Math.sqrt((vx - p.v1) * (vx - p.v1) + vy * vy), F = p.m1 * dv / p.t; return exact(vx) && exact(vy) && offTie(Math.sqrt(s2)) && offTie(s2 / (2 * g)) && offTie(dv) && offTie(F) && F < 90000 && !(p.m1 === 200 && p.m2 === 200 && p.v1 === 3 && p.v2 === 4); },
  { m1: 700, v1: 4.5, m2: 200, v2: 7, t: 0.4 }),
 build: ({ m1, v1, m2, v2, t }) => { const M = m1 + m2, px = m1 * v1, py = m2 * v2, vx = px / M, vy = py / M, s2 = vx * vx + vy * vy, s = Math.sqrt(s2), hh = s2 / (2 * g), dx = fx(vx - v1), dv = Math.sqrt(dx * dx + vy * vy), F = m1 * dv / t; return {
  prompt: `On the docking floor, module A (${n(m1)} kg) slides east at ${n(v1)} m/s and module B (${n(m2)} kg) slides north at ${n(v2)} m/s. Take east as the x direction and north as the y direction. They meet and latch together, with no outside force along the floor, and the latching takes ${n(t)} seconds. The joined pair then coasts up a frictionless ramp until it stops. Take g = 9.8 m/s². During the latching, A’s change in momentum equals the impulse on it, so the size of the average force on A is the size of A’s change in momentum divided by ${n(t)} s, where the change in momentum is A’s mass times the change in its velocity vector (final velocity minus starting velocity, taken component by component). Enter the speed of the pair just after latching in m/s, the height it climbs in metres, and the size of the average force on A in newtons, all to 2 decimal places (use the unrounded speed, and the unrounded size of the velocity change for the force; type the numbers without commas).`,
  answer: [rd(s), rd(hh), rd(F)],
  hints: ['Momentum is kept in x and in y separately, then the speed is √(vx² + vy²). On the frictionless ramp ½Mv² = Mgh.', 'A starts with velocity (its speed, 0) and ends with (vx, vy). The change is (vx − its starting speed, vy); its size is √ of the sum of squares, and the average force is the mass of A times that size, divided by the time.'],
  solution: `In x: vx = ${n(m1)} × ${n(v1)} ÷ ${n(M)} = ${n(vx)} m/s. In y: vy = ${n(m2)} × ${n(v2)} ÷ ${n(M)} = ${n(vy)} m/s. The speed is √(${n(vx)}² + ${n(vy)}²) = √${n(s2)} ${eq(s)} ${n(rd(s))} m/s, and the climb is h = v² ÷ 19.6 = ${n(s2)} ÷ 19.6 ${eq(hh)} ${n(rd(hh))} m. A’s velocity changes from (${n(v1)}, 0) to (${n(vx)}, ${n(vy)}), a change of (${n(dx)}, ${n(vy)}) whose size is √(${par(dx)}² + ${n(vy)}²) ${eq(dv)} ${n(rd(dv))} m/s. The average force on A is ${n(m1)} × √(${par(dx)}² + ${n(vy)}²) ÷ ${n(t)} ${eq(F)} ${n(rd(F))} N.`,
  guidance: [
   { prompt: `Momentum is kept in each direction. What is the speed of the latched pair, in m/s to 2 decimal places?`, answer: [rd(s)], explanation: `vx = ${n(vx)} m/s and vy = ${n(vy)} m/s, so the speed is √${n(s2)} ${eq(s)} ${n(rd(s))} m/s.` },
   { prompt: `All of the pair’s kinetic energy becomes potential energy on the frictionless ramp. What height does it climb, in metres to 2 decimal places?`, answer: [rd(hh)], explanation: `h = v² ÷ 19.6 = ${n(s2)} ÷ 19.6 ${eq(hh)} ${n(rd(hh))} m.` },
   { prompt: `A’s velocity changes from (${n(v1)}, 0) to (${n(vx)}, ${n(vy)}) m/s. What is the size of that change, in m/s to 2 decimal places?`, answer: [rd(dv)], explanation: `The change is (${n(dx)}, ${n(vy)}), with size √(${par(dx)}² + ${n(vy)}²) ${eq(dv)} ${n(rd(dv))} m/s.` },
   { prompt: `The average force on A is its mass times the size of its velocity change, divided by ${n(t)} s. What is it, in newtons to 2 decimal places (use the unrounded size)?`, answer: [rd(F)], explanation: `${n(m1)} × |Δv| ÷ ${n(t)} ${eq(F)} ${n(rd(F))} N.` }
  ] }; }
});

})();
