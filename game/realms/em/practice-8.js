/* Electricity and magnetism: fields practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p8.js. */
(function(){
'use strict';
/* 'a' or 'an' before a number as it is read aloud (an 8, an 11, an 18, an 80, an 11000). */
const aan = s => (/^8/.test(s) || /^1[18](\d{3})?$/.test(String(s).split('.')[0])) ? 'an' : 'a';
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
/* Round to 2 decimal places (answers that the prompt says to round). */
const r2 = x => Math.round(x * 100) / 100;
/* '=' when x is shown exactly by n() (at most 4 decimals), '≈' otherwise. */
const ap = x => Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6 ? '=' : '≈';
/* The result of a rounded answer: '= 2.7 N' when exact to 2 decimals, else '≈ 4.6669 N, which is 4.67 N to 2 decimal places'. */
const res = (x, u) => Math.abs(x - r2(x)) < 1e-9 ? `= ${n(r2(x))} ${u}` : `≈ ${n(x)} ${u}, which is ${n(r2(x))} ${u} to 2 decimal places`;
/* True when x is safely away from a rounding tie at 2 decimal places. */
const safe = x => { const s = Math.abs(x) * 100, f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.02; };
const allSafe = list => list.every(safe);
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (R, make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return { ...canonical }; };
const TWO_PI = 2 * Math.PI;


/* ---- q36 Motional emf and the generator, peak emf NBAω [13.3, 13.6] ---- */
mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The glider wing-spar',
 brief: 'A survey glider is crossing the field of the ground, and its crew wants the voltage across the wing-spar and the peak voltage of the hand-crank lamp in the cabin.',
 labels: ['spar emf (mV)', 'lamp peak emf (V)'], tolerance: 0.005,
 gl: [['area swept per second (m²)'], ['spar emf (mV)'], ['angular speed (rad/s)'], ['lamp peak emf (V)']]
}, {
 /* Spar of length lh/2 m at v m/s in a field of b μT at right angles (emf Blv, in mV); lamp coil of N turns, each a/1000 m², turned at fr turns a second
    in bc/100 T (peak NBA·2πfr). The worked example (0.5 m, 10 m/s, 0.2 T; 100 turns of 0.02 m², 0.5 T, 50 rad/s) is not drawn. */
 canonical: { lh: 15, v: 80, b: 45, N: 120, bc: 25, a: 40, fr: 3 },
 draw: R => retry(R, R => ({ lh: R.int(4, 40), v: R.int(20, 150), b: R.int(25, 65), N: 10 * R.int(5, 50), bc: 5 * R.int(1, 10), a: 5 * R.int(1, 20), fr: R.int(2, 12) }), p => {
  const e1 = p.b * (p.lh / 2) * p.v / 1000, e2 = p.N * p.bc / 100 * p.a / 1000 * TWO_PI * p.fr; return allSafe([e1, e2]) && e1 >= 0.1 && e2 < 90000; },
  { lh: 15, v: 80, b: 45, N: 120, bc: 25, a: 40, fr: 3 }),
 build: ({ lh, v, b, N, bc, a, fr }) => { const L = lh / 2, A = a / 1000, Bc = bc / 100, sweep = L * v, mv = b * sweep / 1000, w = TWO_PI * fr, peak = N * Bc * A * w; return {
  prompt: `A survey glider flies level over the outpost at ${n(v)} m/s. Its metal wing-spar is ${n(L)} m long, and the part of the ground's magnetic field that is at right angles to both the spar and its motion is ${n(b)} μT (1 μT = 10⁻⁶ T). In the cabin a hand-crank lamp has a coil of ${n(N)} turns, each of area ${n(A)} m², turned at ${n(fr)} complete turns every second in a uniform field of ${n(Bc)} T, about an axis at right angles to the field. Enter the emf across the wing-spar in millivolts (mV, 1 mV = 10⁻³ V), then the peak emf of the lamp in volts, each to 2 decimal places. Type numbers without commas.`,
  answer: [r2(mv), r2(peak)],
  hints: ['A conductor of length l moving at speed v at right angles to a field B has the motional emf Blv. With B in microtesla and l × v in square metres per second, the result comes out in microvolts.', 'A coil that turns f times a second has angular speed ω = 2πf radians per second. Its peak emf is NBAω.'],
  solution: `The spar sweeps out ${n(L)} × ${n(v)} = ${n(sweep)} m² each second, so its emf is Blv = ${n(b)} μT × ${n(sweep)} = ${n(b * sweep)} μV ${res(mv, 'mV')}. The coil turns ${n(fr)} times a second, so ω = 2π × ${n(fr)} ${ap(w)} ${n(w)} rad/s, and the peak emf is NBAω = ${n(N)} × ${n(Bc)} × ${n(A)} × ${n(w)} ${res(peak, 'V')}.`,
  guidance: [
   { prompt: `The spar is ${n(L)} m long and flies at ${n(v)} m/s. What area does it sweep out each second, in square metres?`, answer: [sweep], explanation: `${n(L)} × ${n(v)} = ${n(sweep)} m² each second.` },
   { prompt: `The field is ${n(b)} μT. Multiply it by that area to get the emf in microvolts, then give it in millivolts, to 2 decimal places.`, answer: [r2(mv)], explanation: `${n(b)} × ${n(sweep)} = ${n(b * sweep)} μV, and 1 mV = 1000 μV, so the emf ${ap(mv)} ${n(mv)} mV.` },
   { prompt: `The lamp's coil turns ${n(fr)} times a second. What is its angular speed ω = 2πf, in radians per second, to 2 decimal places?`, answer: [r2(w)], explanation: `2π × ${n(fr)} ${ap(w)} ${n(w)} rad/s.` },
   { prompt: `Using the unrounded angular speed, what is the peak emf NBAω of the lamp's coil, in volts, to 2 decimal places?`, answer: [r2(peak)], explanation: `${n(N)} × ${n(Bc)} T × ${n(A)} m² × ${n(w)} rad/s ${ap(peak)} ${n(peak)} V.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'One moment in the turbine cycle',
 brief: 'The wind turbine turns at a measured rate, and Mira wants its generator coil\'s peak voltage and the voltage at one instant of the swing.',
 labels: ['angular speed (rad/s)', 'peak emf (V)', 'emf at that moment (V)'], tolerance: 0.005,
 gl: [['angular speed (rad/s)'], ['peak emf (V)'], ['emf at that moment (V)']]
}, {
 /* The coil turns at 30j revolutions a minute (rpm), N turns of area a/100 m² in a field of bg/100 T. ω = 2π × rpm ÷ 60, peak NBAω, and the emf a fraction
    1/k of a revolution after the emf was zero is the peak × sin(2π/k). k is never 4 (sin = 1 would make the last two boxes equal). */
 canonical: { rpm: 270, N: 150, a: 8, bg: 35, k: 12 },
 draw: R => retry(R, R => ({ rpm: 30 * R.int(2, 40), N: 10 * R.int(3, 50), a: R.int(2, 20), bg: 5 * R.int(2, 12), k: R.pick([5, 6, 8, 10, 12, 16, 20]) }), p => {
  const w = TWO_PI * p.rpm / 60, pk = p.N * p.bg / 100 * p.a / 100 * w, em = pk * Math.sin(TWO_PI / p.k); return allSafe([w, pk, em]) && pk < 90000 && !(p.N === 100 && p.a === 2 && p.bg === 50); },
  { rpm: 270, N: 150, a: 8, bg: 35, k: 12 }),
 build: ({ rpm, N, a, bg, k }) => { const A = a / 100, B = bg / 100, w = TWO_PI * rpm / 60, pk = N * B * A * w, ang = TWO_PI / k, s = Math.sin(ang), em = pk * s; return {
  prompt: `Mira's wind turbine turns the generator coil at ${n(rpm)} revolutions per minute. The coil has ${n(N)} turns, each of area ${n(A)} m², in a uniform field of ${n(B)} T, and its axis of rotation is at right angles to the field. Take t = 0 as a moment when the emf is zero, so that the emf is NBAω sin ωt. One revolution is 2π radians. Enter the angular speed ω in radians per second, then the peak emf in volts, then the emf in volts at the moment when the coil has turned 1/${n(k)} of a revolution from t = 0 (set your calculator to radians). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(w), r2(pk), r2(em)],
  hints: ['There are 60 seconds in a minute and each revolution is 2π radians, so ω = 2π × (revolutions per minute) ÷ 60. The peak emf is NBAω.', 'After a fraction of a revolution the angle ωt is that fraction of 2π radians. The emf at that moment is the peak emf times the sine of that angle.'],
  solution: `ω = 2π × ${n(rpm)} ÷ 60 ${res(w, 'rad/s')}. The peak emf is NBAω = ${n(N)} × ${n(B)} × ${n(A)} × ${n(w)} ${res(pk, 'V')}. After 1/${n(k)} of a revolution the angle is ωt = 2π/${n(k)} ${ap(ang)} ${n(ang)} rad, and sin ${n(ang)} ${ap(s)} ${n(s)}, so the emf is ${n(pk)} × ${n(s)} ${res(em, 'V')}.`,
  guidance: [
   { prompt: `The coil turns ${n(rpm)} times a minute. What is its angular speed ω in radians per second, to 2 decimal places?`, answer: [r2(w)], explanation: `ω = 2π × ${n(rpm)} ÷ 60 ${ap(w)} ${n(w)} rad/s.` },
   { prompt: `Using the unrounded angular speed, what is the peak emf NBAω, in volts, to 2 decimal places?`, answer: [r2(pk)], explanation: `${n(N)} × ${n(B)} × ${n(A)} × ${n(w)} ${ap(pk)} ${n(pk)} V.` },
   { prompt: `The coil has turned 1/${n(k)} of a revolution from t = 0, so ωt = 2π/${n(k)} radians. What is the emf at that moment, in volts, to 2 decimal places?`, answer: [r2(em)], explanation: `sin(2π/${n(k)}) ${ap(s)} ${n(s)}, and ${n(pk)} × ${n(s)} ${ap(em)} ${n(em)} V.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q32', title: 'The braking rod',
 brief: 'A rod in the test hall slides along closed rails, and Mira wants to know how hard the field pulls back on it and what power keeps it going.',
 labels: ['emf (V)', 'current (A)', 'braking force (N)', 'power (W)'], tolerance: 0.005,
 gl: [['emf (V)'], ['current (A)'], ['braking force (N)'], ['power (W)']]
}, {
 /* Rod of length lh/10 m at v m/s in a field of br/100 T, closed circuit of resistance Rc ohms. ε = Blv, I = ε/Rc, F = ILB (rod at right angles to the field),
    P = Fv. The worked example (0.5 m, 10 m/s, 0.2 T) is not drawn. */
 canonical: { lh: 16, v: 6, br: 75, Rc: 4 },
 draw: R => retry(R, R => ({ lh: R.int(5, 30), v: R.int(2, 20), br: 5 * R.int(2, 24), Rc: R.int(1, 20) }), p => {
  const L = p.lh / 10, B = p.br / 100, e = B * L * p.v, I = e / p.Rc, F = I * L * B; return allSafe([e, I, F, F * p.v]) && I >= 0.05 && !(p.lh === 5 && p.v === 10 && p.br === 20); },
  { lh: 16, v: 6, br: 75, Rc: 4 }),
 build: ({ lh, v, br, Rc }) => { const L = lh / 10, B = br / 100, e = B * L * v, I = e / Rc, F = I * L * B, P = F * v; return {
  prompt: `In the test hall a metal rod ${n(L)} m long slides along two rails at a steady ${n(v)} m/s. A uniform field of ${n(B)} T is at right angles to the rod, the rails and its motion. The rod and rails form a closed circuit whose total resistance is ${n(Rc)} Ω, so by Ohm's law the current in it is the rod's emf divided by the resistance. A rod of length l carrying current I at right angles to a field B feels a magnetic force ILB (the force on a wire), and here that force pulls back against the motion. Enter the emf in volts, the current in amperes, the force in newtons that must be overcome to keep the rod moving, then the power in watts needed to keep it moving at that speed (power = force × speed). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(e), r2(I), r2(F), r2(P)],
  hints: ['The rod sweeps out l × v of area each second, so its motional emf is Blv. Divide it by the circuit\'s resistance for the current.', 'The current is in a rod of length l at right angles to the field, so the force is ILB, and to keep the speed steady you must push with that much force. The power you supply is that force times the speed.'],
  solution: `The emf is Blv = ${n(B)} × ${n(L)} × ${n(v)} ${res(e, 'V')}. The current is ε/R = ${n(e)} ÷ ${n(Rc)} ${res(I, 'A')}. The force is ILB = ${n(I)} × ${n(L)} × ${n(B)} ${res(F, 'N')}. To keep the speed steady you supply that force, so the power is Fv = ${n(F)} × ${n(v)} ${res(P, 'W')}.`,
  guidance: [
   { prompt: `What is the motional emf Blv across the rod, in volts, to 2 decimal places?`, answer: [r2(e)], explanation: `${n(B)} × ${n(L)} × ${n(v)} ${ap(e)} ${n(e)} V.` },
   { prompt: `The circuit's resistance is ${n(Rc)} Ω. Using the unrounded emf, what current flows, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `I = ε/R = ${n(e)} ÷ ${n(Rc)} ${ap(I)} ${n(I)} A.` },
   { prompt: `Using the unrounded current, what is the magnetic force ILB on the rod, in newtons, to 2 decimal places?`, answer: [r2(F)], explanation: `${n(I)} × ${n(L)} × ${n(B)} ${ap(F)} ${n(F)} N.` },
   { prompt: `To keep the rod at ${n(v)} m/s you must supply a force equal to that one. Using the unrounded force, what power is that, in watts, to 2 decimal places?`, answer: [r2(P)], explanation: `P = Fv = ${n(F)} × ${n(v)} ${ap(P)} ${n(P)} W.` }
  ] }; }
});


/* ---- q37 Inductance, energy in an inductor and the RL time constant [14.2, 14.3, 14.4] ---- */
mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'The ore sorter magnet',
 brief: 'The ore sorter\'s lifting magnet is a big coil, and the shift crew need its fill time, the current partway through and the energy it holds when it is fully on.',
 labels: ['time constant (ms)', 'current (A)', 'energy (mJ)'], tolerance: 0.005,
 gl: [['time constant (ms)'], ['settled current (A)'], ['current (A)'], ['energy (mJ)']]
}, {
 /* L = lh/20 henries, R ohms, supply ε volts, time t ms. τ = 1000L/R ms, settled current ε/R, I(t) = (ε/R)(1 − e^(−t/τ)), energy ½LI² in mJ (× 1000).
    t never equals τ. The worked example (0.1 H, 10 Ω, 12 V) is not drawn. */
 canonical: { lh: 6, R: 10, eps: 15, t: 45 },
 draw: R => retry(R, R => { const p = { lh: R.int(1, 40), R: R.int(3, 60), eps: R.int(6, 60) }; p.t = R.int(1, Math.ceil(2.5 * 50 * p.lh / p.R)); return p; }, p => {
  const L = p.lh / 20, tau = 1000 * L / p.R, I = p.eps / p.R, It = I * (1 - Math.exp(-p.t / tau)), U = 500 * L * I * I; return p.t !== tau && tau >= 2 && tau < 5000 && allSafe([tau, I, It, U]) && It > 0.02 && U < 90000 && !(p.lh === 2 && p.R === 10 && p.eps === 12); },
  { lh: 6, R: 10, eps: 15, t: 45 }),
 build: ({ lh, R, eps, t }) => { const L = lh / 20, tau = 1000 * L / R, I = eps / R, x = t / tau, It = I * (1 - Math.exp(-x)), U = 500 * L * I * I; return {
  prompt: `The ore sorter's lifting magnet is a coil with inductance ${n(L)} H and resistance ${n(R)} Ω. At t = 0 a switch connects it across a steady ${n(eps)} V supply. Enter its time constant τ = L/R in milliseconds (ms), then the current ${n(t)} ms after the switch closes, in amperes (A), then the energy the coil stores once its current has settled, in millijoules (mJ). Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(tau), r2(It), r2(U)],
  hints: ['With L in henries and R in ohms, τ = L/R is in seconds. There are 1000 milliseconds in a second.', 'The settled current is ε/R, and while it grows I(t) = (ε/R)(1 − e^(−t/τ)). A coil carrying current I stores ½LI² joules when L is in henries; 1 J = 1000 mJ.'],
  solution: `τ = L/R = ${n(L)} H ÷ ${n(R)} Ω ${ap(tau / 1000)} ${n(tau / 1000)} s ${res(tau, 'ms')}. The settled current is ε/R = ${n(eps)} ÷ ${n(R)} ${ap(I)} ${n(I)} A. At t = ${n(t)} ms, t/τ ${ap(x)} ${n(x)}, so I = ${n(I)} × (1 − e^(−${n(x)})) ${res(It, 'A')}. The stored energy is ½LI² = ½ × ${n(L)} × ${n(I)}² ${ap(U / 1000)} ${n(U / 1000)} J ${res(U, 'mJ')}.`,
  guidance: [
   { prompt: `What is the time constant τ = L/R, in milliseconds, to 2 decimal places?`, answer: [r2(tau)], explanation: `${n(L)} H ÷ ${n(R)} Ω = ${n(tau / 1000)} s ${ap(tau)} ${n(tau)} ms.` },
   { prompt: `What is the current once it has settled, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `The coil's emf is then zero, so ε/R = ${n(eps)} ÷ ${n(R)} ${ap(I)} ${n(I)} A.` },
   { prompt: `Use I(t) = (ε/R)(1 − e^(−t/τ)) at t = ${n(t)} ms. What is the current, in amperes, to 2 decimal places?`, answer: [r2(It)], explanation: `t/τ ${ap(x)} ${n(x)}, and ${n(I)} × (1 − e^(−${n(x)})) ${ap(It)} ${n(It)} A.` },
   { prompt: `What energy does the coil store at the settled current, in millijoules, to 2 decimal places?`, answer: [r2(U)], explanation: `½ × ${n(L)} H × (${n(I)} A)² ${ap(U / 1000)} ${n(U / 1000)} J, that is ${n(U)} mJ.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'The latch coil',
 brief: 'A latch in the ore sorter lets go only when its coil holds enough energy, so Mira must choose the current, the supply and check how quickly the coil fills.',
 labels: ['current (A)', 'supply voltage (V)', 'time constant (ms)'], tolerance: 0.005,
 gl: [['current (A)'], ['supply voltage (V)'], ['time constant (ms)']]
}, {
 /* L mH, R Ω, target energy W mJ. The current that stores W is I = √(2W/L) (mH and mJ cancel), the settled current is ε/R so ε = IR, τ = L/R ms.
    The draw picks I = i/2 A first and prints W = L × I² ÷ 2, so W is the parameter the prompt prints. */
 canonical: { L: 160, R: 5, W: 180 },
 draw: R => retry(R, R => { const L = 10 * R.int(2, 50), Rr = R.int(2, 20), i = R.int(2, 14); return { L, R: Rr, W: L * i * i / 8 }; }, p => {
  const I = Math.sqrt(2 * p.W / p.L), tau = p.L / p.R; return allSafe([I * p.R, tau]) && !(p.L === 200 && p.R === 8); },
  { L: 160, R: 5, W: 180 }),
 build: ({ L, R, W }) => { const I = Math.sqrt(2 * W / L), eps = I * R, tau = L / R; return {
  prompt: `A latch in the ore sorter releases only when its coil stores ${n(W)} mJ of energy. The coil has inductance ${n(L)} mH (1 mH = 10⁻³ H) and resistance ${n(R)} Ω, and it is switched onto a steady supply. Enter the current, in amperes, at which the coil stores that energy; then the supply voltage in volts that makes the current settle at exactly that value; then the coil's time constant τ = L/R in milliseconds. Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(I), r2(eps), r2(tau)],
  hints: ['A coil carrying current I stores ½LI². Turn that round to find I from the energy: I = √(2 × energy ÷ L), and note that mJ and mH cancel in the ratio.', 'The settled current is the supply voltage divided by the resistance, so the supply voltage is that current times R. With L in millihenries, τ = L/R comes out in milliseconds.'],
  solution: `Setting ½LI² = ${n(W)} mJ with L = ${n(L)} mH gives I² = 2 × ${n(W)} ÷ ${n(L)} ${ap(I * I)} ${n(I * I)}, so I ${res(I, 'A')}. The settled current is ε/R, so ε = IR = ${n(I)} × ${n(R)} ${res(eps, 'V')}. The time constant is τ = L/R = ${n(L)} ÷ ${n(R)} ${res(tau, 'ms')}.`,
  guidance: [
   { prompt: `The coil must store ${n(W)} mJ, and ½LI² = ${n(W)} mJ with L = ${n(L)} mH. What current I is that, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `I² = 2W/L = 2 × ${n(W)} ÷ ${n(L)} ${ap(I * I)} ${n(I * I)}, so I ${ap(I)} ${n(I)} A.` },
   { prompt: `Using the unrounded current, what supply voltage makes the current settle at that value through ${n(R)} Ω, in volts, to 2 decimal places?`, answer: [r2(eps)], explanation: `ε = IR = ${n(I)} × ${n(R)} ${ap(eps)} ${n(eps)} V.` },
   { prompt: `What is the time constant τ = L/R, in milliseconds, to 2 decimal places?`, answer: [r2(tau)], explanation: `${n(L)} mH ÷ ${n(R)} Ω ${ap(tau)} ${n(tau)} ms.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q28', title: 'Matching the two timers',
 brief: 'Mira wants the field coil to fill at exactly the pace of the station\'s resistor-and-capacitor timer, and she needs to know what that costs in resistance and stored energy.',
 labels: ['timer time constant (ms)', 'coil circuit resistance (Ω)', 'energy (mJ)'], tolerance: 0.005,
 gl: [['timer time constant (ms)'], ['coil circuit resistance (Ω)'], ['settled current (A)'], ['energy (mJ)']]
}, {
 /* Timer: Rt kΩ and Ct μF, τ = RC = Rt × Ct ms (kΩ × μF = ms). Coil: L mH. Equal time constants need R = L/τ ohms, then settled current ε/R and energy ½LI² mJ.
    The draw picks the coil resistance rc first (a whole number) and prints L = τ × rc, so L is the parameter. The worked example (100 mH, 10 Ω, 12 V) is not drawn. */
 canonical: { Rt: 4, Ct: 5, L: 120, eps: 18 },
 draw: R => retry(R, R => { const Rt = R.int(2, 10), Ct = R.int(2, 10); return { Rt, Ct, L: Rt * Ct * R.int(2, 20), eps: R.int(6, 60) }; }, p => {
  const tau = p.Rt * p.Ct, Rc = p.L / tau, I = p.eps / Rc, U = p.L * I * I / 2; return allSafe([I, U]) && U < 90000 && !(p.L === 100 && p.eps === 12 && Rc === 10); },
  { Rt: 4, Ct: 5, L: 120, eps: 18 }),
 build: ({ Rt, Ct, L, eps }) => { const tau = Rt * Ct, Rc = L / tau, I = eps / Rc, U = L * I * I / 2; return {
  prompt: `The station has a timer made of a resistor of ${n(Rt)} kΩ (1 kΩ = 1000 Ω) charging a capacitor of ${n(Ct)} μF (1 μF = 10⁻⁶ F), with time constant τ = RC. A kilohm times a microfarad is a millisecond. Mira wants the field coil, which has inductance ${n(L)} mH, to have exactly the same time constant, using τ = L/R for the coil circuit. Enter the timer's time constant in milliseconds, then the total resistance the coil circuit must have, in ohms, then the energy the coil stores, in millijoules, once its current has settled on a steady ${n(eps)} V supply. Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(tau), r2(Rc), r2(U)],
  hints: ['The timer\'s time constant is the resistance times the capacitance. With the resistance in kilohms and the capacitance in microfarads, the product is in milliseconds.', 'Put the coil\'s τ = L/R equal to the timer\'s time constant and solve for R. The settled current is ε/R, and the stored energy is ½LI², which is in millijoules when L is in millihenries and the current in amperes.'],
  solution: `The timer's time constant is RC = ${n(Rt)} kΩ × ${n(Ct)} μF = ${n(tau)} ms. For the coil, L/R = ${n(tau)} ms gives R = ${n(L)} mH ÷ ${n(tau)} ms ${res(Rc, 'Ω')}. The settled current is ε/R = ${n(eps)} ÷ ${n(Rc)} ${ap(I)} ${n(I)} A, so the stored energy is ½LI² = ½ × ${n(L)} × ${n(I)}² ${res(U, 'mJ')}.`,
  guidance: [
   { prompt: `What is the timer's time constant RC, in milliseconds?`, answer: [tau], explanation: `${n(Rt)} × ${n(Ct)} = ${n(tau)} ms.` },
   { prompt: `The coil's L/R must equal ${n(tau)} ms, and L = ${n(L)} mH. What resistance does the coil circuit need, in ohms, to 2 decimal places?`, answer: [r2(Rc)], explanation: `R = L/τ = ${n(L)} ÷ ${n(tau)} ${ap(Rc)} ${n(Rc)} Ω.` },
   { prompt: `On ${aan(n(eps))} ${n(eps)} V supply, what current does the coil settle at, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `ε/R = ${n(eps)} ÷ ${n(Rc)} ${ap(I)} ${n(I)} A.` },
   { prompt: `Using the unrounded current, what energy does the coil store, in millijoules, to 2 decimal places?`, answer: [r2(U)], explanation: `½LI² = ½ × ${n(L)} × ${n(I)}² ${ap(U)} ${n(U)} mJ.` }
  ] }; }
});


/* ---- q38 Alternating current: peak, rms and reactance [15.1, 15.2, 15.4] ---- */
mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The dome supply check',
 brief: 'The hydroponics dome has a rated alternating supply, and Mira wants the current each added component would draw, both as a steady-equivalent and at its peak.',
 labels: ['reactance (Ω)', 'rms current (A)', 'peak current (A)'], tolerance: 0.005,
 gl: [['angular frequency (rad/s)'], ['reactance (Ω)'], ['rms current (A)'], ['peak current (A)']]
}, {
 /* An rms voltage Vr at f Hz across an inductor (val mH) or a capacitor (val μF) alone. X = ωL or 1/(ωC), I_rms = Vr/X, peak current √2 × I_rms.
    The worked example (peak 20 V, 50 Hz, 100 μF) is not drawn. */
 canonical: { Vr: 48, f: 400, ind: false, val: 22 },
 draw: R => retry(R, R => { const ind = R.bool(); return { Vr: 6 * R.int(2, 40), f: R.pick([50, 60, 120, 250, 400, 800, 1200]), ind, val: ind ? 10 * R.int(1, 50) : R.int(1, 100) }; }, p => {
  const w = TWO_PI * p.f, X = p.ind ? w * p.val / 1000 : 1 / (w * p.val * 1e-6), I = p.Vr / X; return X < 90000 && I >= 0.05 && I < 1000 && allSafe([w, X, I, I * Math.SQRT2]) && !(!p.ind && p.val === 100 && p.f === 50); },
  { Vr: 48, f: 400, ind: false, val: 22 }),
 build: ({ Vr, f, ind, val }) => { const w = TWO_PI * f, X = ind ? w * val / 1000 : 1 / (w * val * 1e-6), I = Vr / X, Ip = I * Math.SQRT2, part = ind ? 'coil' : 'capacitor'; return {
  prompt: `The hydroponics dome runs on an alternating supply of ${n(Vr)} V rms at ${n(f)} Hz. A ${ind ? `coil (an inductor) of ${n(val)} mH (1 mH = 10⁻³ H)` : `capacitor of ${n(val)} μF (1 μF = 10⁻⁶ F)`} is connected across it and nothing else; take the resistance of the wires as zero. Enter the reactance of the ${part} in ohms (Ω), then the rms current in amperes (A), then the peak current in amperes (the peak is √2 times the rms value). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(X), r2(I), r2(Ip)],
  hints: ['With ω = 2πf, a coil\'s reactance is ωL (L in henries) and a capacitor\'s is 1/(ωC) (C in farads).', 'The rms current is the rms voltage divided by the reactance, as in Ohm\'s law. The peak current is √2 times the rms current, because the rms value of a sine wave is its peak divided by √2.'],
  solution: `ω = 2π × ${n(f)} ${ap(w)} ${n(w)} rad/s, so the ${part}'s reactance is ${ind ? `X_L = ωL = ${n(w)} × ${n(val / 1000)}` : `X_C = 1/(ωC) = 1 ÷ (${n(w)} × ${n(val)} × 10⁻⁶)`} ${res(X, 'Ω')}. The rms current is V_rms/X = ${n(Vr)} ÷ ${n(X)} ${res(I, 'A')}. The peak current is √2 × ${n(I)} ${res(Ip, 'A')}.`,
  guidance: [
   { prompt: `What is the angular frequency ω = 2πf of ${aan(n(f))} ${n(f)} Hz supply, in radians per second, to 2 decimal places?`, answer: [r2(w)], explanation: `2π × ${n(f)} ${ap(w)} ${n(w)} rad/s.` },
   { prompt: `Using the unrounded angular frequency, what is the ${part}'s reactance, in ohms, to 2 decimal places?`, answer: [r2(X)], explanation: ind ? `X_L = ωL = ${n(w)} × ${n(val / 1000)} H ${ap(X)} ${n(X)} Ω.` : `X_C = 1/(ωC) = 1 ÷ (${n(w)} × ${n(val)} × 10⁻⁶ F) ${ap(X)} ${n(X)} Ω.` },
   { prompt: `The rms voltage is ${n(Vr)} V. What is the rms current, in amperes, to 2 decimal places?`, answer: [r2(I)], explanation: `I_rms = V_rms/X = ${n(Vr)} ÷ ${n(X)} ${ap(I)} ${n(I)} A.` },
   { prompt: `What is the peak current, which is √2 times the rms current, in amperes, to 2 decimal places?`, answer: [r2(Ip)], explanation: `√2 × ${n(I)} ${ap(Ip)} ${n(Ip)} A.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The soft-start capacitor',
 brief: 'The pump motor needs a capacitor that holds its start-up current to a set value on the dome supply, and Mira wants to know what a faster supply would do.',
 labels: ['reactance (Ω)', 'capacitance (μF)', 'new rms current (A)'], tolerance: 0.005,
 gl: [['reactance (Ω)'], ['capacitance (μF)'], ['new rms current (A)']]
}, {
 /* A capacitor alone across Vr volts rms at f Hz must pass I amperes rms (I = i/10): X = Vr/I, C = 1/(ωX) in μF; then the frequency is multiplied by m
    and X_C = 1/(ωC) falls by the same factor, so the current is m times as large. */
 canonical: { Vr: 72, f: 60, i: 15, m: 3 },
 draw: R => retry(R, R => ({ Vr: 6 * R.int(4, 40), f: R.pick([50, 60, 100, 200, 400]), i: R.int(4, 40), m: R.int(2, 5) }), p => {
  const X = p.Vr / (p.i / 10), C = 1e6 / (TWO_PI * p.f * X), In = p.m * p.i / 10; return allSafe([X, C, In]) && C >= 1 && C < 90000 && !(p.Vr === 20 && p.f === 50); },
  { Vr: 72, f: 60, i: 15, m: 3 }),
 build: ({ Vr, f, i, m }) => { const I = i / 10, w = TWO_PI * f, X = Vr / I, C = 1e6 / (w * X), In = m * I; return {
  prompt: `The pump motor's start-up circuit is a capacitor connected across the dome's ${n(Vr)} V rms, ${n(f)} Hz supply and nothing else (take the wires' resistance as zero). Mira wants the rms current in the capacitor to be ${n(I)} A. Enter the reactance the capacitor must have, in ohms (Ω); then its capacitance in microfarads (μF, 1 μF = 10⁻⁶ F); then, for the same capacitor, the rms current in amperes if the supply frequency is raised to ${n(m)} times ${n(f)} Hz (the rms voltage stays the same). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(X), r2(C), r2(In)],
  hints: ['A capacitor alone on an ac supply obeys I_rms = V_rms/X. Rearrange it to find the reactance that gives the wanted current.', 'The capacitor\'s reactance is X_C = 1/(ωC) with ω = 2πf, so C = 1/(ωX_C) in farads. Raising the frequency makes the reactance smaller, so find the new reactance and divide the voltage by it.'],
  solution: `The reactance must be X = V_rms/I_rms = ${n(Vr)} ÷ ${n(I)} ${res(X, 'Ω')}. With ω = 2π × ${n(f)} ${ap(w)} ${n(w)} rad/s, C = 1/(ωX) = 1 ÷ (${n(w)} × ${n(X)}) F ${res(C, 'μF')}. At ${n(m)} times the frequency, ω is ${n(m)} times as large, so X_C = 1/(ωC) is ${n(m)} times smaller, ${n(X / m)} Ω, and the rms current is ${n(Vr)} ÷ ${n(X / m)} ${res(In, 'A')}.`,
  guidance: [
   { prompt: `The rms voltage is ${n(Vr)} V and the rms current must be ${n(I)} A. What reactance gives that, in ohms, to 2 decimal places?`, answer: [r2(X)], explanation: `X = V_rms/I_rms = ${n(Vr)} ÷ ${n(I)} ${ap(X)} ${n(X)} Ω.` },
   { prompt: `Using the unrounded reactance and ω = 2π × ${n(f)} rad/s, what capacitance C = 1/(ωX) is that, in microfarads, to 2 decimal places?`, answer: [r2(C)], explanation: `C = 1 ÷ (${n(w)} × ${n(X)}) F ${ap(C)} ${n(C)} μF.` },
   { prompt: `At ${n(m)} times the frequency, ω is ${n(m)} times larger, so the capacitor's reactance is ${n(m)} times smaller. What is the rms current now, in amperes, to 2 decimal places?`, answer: [r2(In)], explanation: `The reactance is ${n(X / m)} Ω. Then I_rms = ${n(Vr)} ÷ ${n(X / m)} ${ap(In)} ${n(In)} A.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q37', title: 'The largest energy in the coil',
 brief: 'An alternating current through the sorter\'s coil rises and falls, and Mira wants the most energy the coil ever holds.',
 labels: ['reactance (Ω)', 'peak current (A)', 'greatest energy (mJ)'], tolerance: 0.005,
 gl: [['reactance (Ω)'], ['peak current (A)'], ['greatest energy (mJ)']]
}, {
 /* A coil of L mH alone across an ac supply of peak V0 and frequency f. X = ωL, peak current I0 = V0/X, and the energy ½LI² is greatest when the current
    is at its peak I0: U = ½ L I0² (mJ for L in mH). The worked example (20 V, 50 Hz, 100 μF capacitor) is not drawn. */
 canonical: { V0: 90, f: 120, L: 70 },
 draw: R => retry(R, R => ({ V0: 5 * R.int(4, 60), f: R.pick([50, 60, 100, 120, 200, 400, 500, 1000]), L: 5 * R.int(2, 100) }), p => {
  const w = TWO_PI * p.f, X = w * p.L / 1000, I0 = p.V0 / X, U = p.L * I0 * I0 / 2; return X < 90000 && I0 >= 0.05 && I0 < 1000 && U < 90000 && allSafe([w, X, I0, U]); },
  { V0: 90, f: 120, L: 70 }),
 build: ({ V0, f, L }) => { const w = TWO_PI * f, X = w * L / 1000, I0 = V0 / X, U = L * I0 * I0 / 2; return {
  prompt: `A coil (an inductor) of ${n(L)} mH (1 mH = 10⁻³ H) is connected across ${aan(n(f))} ${n(f)} Hz alternating supply whose peak voltage is ${n(V0)} V, and nothing else; take the resistance of the wires as zero. Enter the reactance of the coil in ohms (Ω), then the peak current in amperes (A), found from the peak voltage divided by the reactance. The current swings up and down, and the energy stored in the coil, ½LI², is greatest at the moment the current is at its peak. Enter that greatest energy in millijoules (mJ). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(X), r2(I0), r2(U)],
  hints: ['With ω = 2πf, a coil\'s reactance is X_L = ωL, with L in henries. The peak current is the peak voltage divided by the reactance.', 'A coil carrying current I stores ½LI². With L in millihenries and I in amperes the energy comes out in millijoules, and it is largest when I has its largest size.'],
  solution: `ω = 2π × ${n(f)} ${ap(w)} ${n(w)} rad/s, so X_L = ωL = ${n(w)} × ${n(L / 1000)} ${res(X, 'Ω')}. The peak current is V₀/X = ${n(V0)} ÷ ${n(X)} ${res(I0, 'A')}. The greatest energy is stored at that peak current: ½LI₀² = ½ × ${n(L)} × ${n(I0)}² ${res(U, 'mJ')}.`,
  guidance: [
   { prompt: `What is the coil's reactance X_L = ωL at ${n(f)} Hz, in ohms, to 2 decimal places?`, answer: [r2(X)], explanation: `ω = 2π × ${n(f)} ${ap(w)} ${n(w)} rad/s, and ${n(w)} × ${n(L / 1000)} H ${ap(X)} ${n(X)} Ω.` },
   { prompt: `Using the unrounded reactance, what is the peak current V₀/X, in amperes, to 2 decimal places?`, answer: [r2(I0)], explanation: `${n(V0)} ÷ ${n(X)} ${ap(I0)} ${n(I0)} A.` },
   { prompt: `Using the unrounded peak current, what is the energy ½LI₀² at that moment, in millijoules, to 2 decimal places?`, answer: [r2(U)], explanation: `½ × ${n(L)} mH × (${n(I0)} A)² ${ap(U)} ${n(U)} mJ.` }
  ] }; }
});


/* ---- q39 RLC series circuit: impedance and resonance [15.3, 15.5] ---- */
mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The relay receiver',
 brief: 'The relay receiver\'s input circuit sits in a kilohertz signal, and the crew need to know how much current it passes and where it would ring loudest.',
 labels: ['impedance (Ω)', 'peak current (mA)', 'resonant frequency (kHz)'], tolerance: 0.005,
 gl: [['inductor reactance (Ω)'], ['capacitor reactance (Ω)'], ['impedance (Ω)'], ['peak current (mA)'], ['resonant frequency (kHz)']]
}, {
 /* Series R Ω, L mH, C nF on a supply of f kHz and peak V0 volts. X_L = ωL, X_C = 1/(ωC), Z = √(R² + (X_L − X_C)²), I0 = V0/Z (mA), f0 = 1/(2π√(LC)) in kHz.
    The supply stays more than 15% away from f0. The worked example (30 Ω, 50 mH, 50 μF) is not drawn. */
 canonical: { R: 80, L: 15, C: 60, f: 3, V0: 12 },
 draw: R => retry(R, R => ({ R: 10 * R.int(2, 30), L: R.int(5, 60), C: 5 * R.int(2, 40), f: R.int(1, 20), V0: R.int(2, 40) }), p => {
  const w = TWO_PI * p.f * 1e3, XL = w * p.L * 1e-3, XC = 1 / (w * p.C * 1e-9), Z = Math.hypot(p.R, XL - XC), f0 = 1 / (TWO_PI * Math.sqrt(p.L * 1e-3 * p.C * 1e-9)) / 1e3;
  return Math.abs(p.f - f0) / f0 > 0.15 && Z < 90000 && 1000 * p.V0 / Z >= 0.5 && allSafe([XL, XC, Z, 1000 * p.V0 / Z, f0]) && !(p.R === 30 && p.L === 50 && p.C === 50); },
  { R: 80, L: 15, C: 60, f: 3, V0: 12 }),
 build: ({ R, L, C, f, V0 }) => { const w = TWO_PI * f * 1e3, XL = w * L * 1e-3, XC = 1 / (w * C * 1e-9), d = XL - XC, Z = Math.hypot(R, d), I0 = 1000 * V0 / Z, f0 = 1 / (TWO_PI * Math.sqrt(L * 1e-3 * C * 1e-9)) / 1e3; return {
  prompt: `The relay receiver's input circuit has a resistor of ${n(R)} Ω, a coil of ${n(L)} mH (1 mH = 10⁻³ H) and a capacitor of ${n(C)} nF (1 nF = 10⁻⁹ F) all in series. A signal of frequency ${n(f)} kHz (1 kHz = 10³ Hz) and peak voltage ${n(V0)} V drives it. Enter the impedance of the circuit in ohms (Ω), then the peak current in milliamperes (mA, 1 mA = 10⁻³ A), then the circuit's resonant frequency in kilohertz (kHz). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(Z), r2(I0), r2(f0)],
  hints: ['Use ω = 2π × (frequency in hertz), so a frequency in kilohertz must be multiplied by 1000 first. Then X_L = ωL and X_C = 1/(ωC) with L in henries and C in farads.', 'The impedance is Z = √(R² + (X_L − X_C)²) and the peak current is V₀/Z, which is in amperes (multiply by 1000 for milliamperes). The resonant frequency is f₀ = 1/(2π√(LC)) in hertz.'],
  solution: `ω = 2π × ${n(f)} × 10³ ${ap(w)} ${n(w)} rad/s. X_L = ωL ${ap(XL)} ${n(XL)} Ω and X_C = 1/(ωC) ${ap(XC)} ${n(XC)} Ω. Z = √(${n(R)}² + (${n(XL)} − ${n(XC)})²) ${res(Z, 'Ω')}. The peak current is V₀/Z = ${n(V0)} ÷ ${n(Z)} A ${res(I0, 'mA')}. The resonant frequency is f₀ = 1/(2π√(LC)) = 1 ÷ (2π√(${n(L / 1000)} × ${n(C)} × 10⁻⁹)) Hz ${res(f0, 'kHz')}.`,
  guidance: [
   { prompt: `With ω = 2π × ${n(f)} × 10³ rad/s, what is the coil's reactance X_L = ωL, in ohms, to 2 decimal places?`, answer: [r2(XL)], explanation: `ω ${ap(w)} ${n(w)} rad/s, so X_L = ${n(w)} × ${n(L / 1000)} H ${ap(XL)} ${n(XL)} Ω.` },
   { prompt: `What is the capacitor's reactance X_C = 1/(ωC), in ohms, to 2 decimal places?`, answer: [r2(XC)], explanation: `X_C = 1 ÷ (${n(w)} × ${n(C)} × 10⁻⁹ F) ${ap(XC)} ${n(XC)} Ω.` },
   { prompt: `Using the unrounded reactances, what is the impedance Z = √(R² + (X_L − X_C)²), in ohms, to 2 decimal places?`, answer: [r2(Z)], explanation: `X_L − X_C ${ap(d)} ${n(d)} Ω, so Z = √(${n(R * R)} + ${n(d * d)}) ${ap(Z)} ${n(Z)} Ω.` },
   { prompt: `Using the unrounded impedance, what is the peak current V₀/Z, in milliamperes, to 2 decimal places?`, answer: [r2(I0)], explanation: `${n(V0)} ÷ ${n(Z)} ${ap(I0 / 1000)} ${n(I0 / 1000)} A, that is ${n(I0)} mA.` },
   { prompt: `What is the resonant frequency f₀ = 1/(2π√(LC)), in kilohertz, to 2 decimal places?`, answer: [r2(f0)], explanation: `√(LC) = √(${n(L / 1000)} × ${n(C)} × 10⁻⁹) s, and 1 ÷ (2π√(LC)) ${ap(f0 * 1000)} ${n(f0 * 1000)} Hz, that is ${n(f0)} kHz.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Tuning to the weather beacon',
 brief: 'The mast tuner has a fixed coil and an adjustable capacitor, and Mira must set the capacitor so the circuit answers the weather beacon\'s frequency.',
 labels: ['capacitance (μF)', 'peak current (A)', 'peak coil voltage (V)'], tolerance: 0.005,
 gl: [['capacitance (μF)'], ['peak current (A)'], ['peak coil voltage (V)']]
}, {
 /* Tuner: R Ω, L mH, adjustable C, supply of peak V0 at f0 Hz. Resonance at f0 needs C = 1/(ω0²L); there Z = R so I0 = V0/R, and the peak voltage across the coil
    is I0 × ω0L. */
 canonical: { R: 25, L: 80, f0: 350, V0: 30 },
 draw: R => retry(R, R => ({ R: 5 * R.int(2, 40), L: 10 * R.int(2, 25), f0: 50 * R.int(2, 24), V0: 5 * R.int(2, 30) }), p => {
  const w = TWO_PI * p.f0, C = 1e6 / (w * w * p.L * 1e-3), I0 = p.V0 / p.R, VL = I0 * w * p.L * 1e-3; return allSafe([C, I0, VL]) && C >= 0.5 && VL < 90000 && !(p.R === 30 && p.L === 50); },
  { R: 25, L: 80, f0: 350, V0: 30 }),
 build: ({ R, L, f0, V0 }) => { const w = TWO_PI * f0, XL = w * L * 1e-3, C = 1e6 / (w * w * L * 1e-3), I0 = V0 / R, VL = I0 * XL; return {
  prompt: `The mast's tuner is a resistor of ${n(R)} Ω, a coil of ${n(L)} mH (1 mH = 10⁻³ H) and an adjustable capacitor in series, driven by a supply of peak voltage ${n(V0)} V. The weather beacon's signal has frequency ${n(f0)} Hz, and Mira adjusts the capacitor until the circuit is at resonance at that frequency. Enter the capacitance she must set, in microfarads (μF, 1 μF = 10⁻⁶ F); then the peak current in amperes at resonance, where the impedance is just R; then the peak voltage across the coil in volts at resonance (peak current times the coil's reactance ωL, with ω = 2π × ${n(f0)} rad/s). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(C), r2(I0), r2(VL)],
  hints: ['At resonance X_L = X_C, so ω²LC = 1 and C = 1/(ω²L), with ω = 2πf and L in henries. The result is in farads.', 'At resonance the coil and capacitor cancel, so Z = R and the peak current is V₀/R. The voltage across the coil is the current times its reactance X_L = ωL.'],
  solution: `At resonance ω²LC = 1, so C = 1/(ω²L). With ω = 2π × ${n(f0)} ${ap(w)} ${n(w)} rad/s, C = 1 ÷ (${n(w)}² × ${n(L / 1000)}) F ${res(C, 'μF')}. At resonance Z = R, so the peak current is V₀/R = ${n(V0)} ÷ ${n(R)} ${res(I0, 'A')}. The coil's reactance is ωL = ${n(w)} × ${n(L / 1000)} ${ap(XL)} ${n(XL)} Ω, so the peak voltage across it is ${n(I0)} × ${n(XL)} ${res(VL, 'V')}.`,
  guidance: [
   { prompt: `At resonance C = 1/(ω²L). With ω = 2π × ${n(f0)} rad/s and L = ${n(L / 1000)} H, what capacitance is that, in microfarads, to 2 decimal places?`, answer: [r2(C)], explanation: `ω ${ap(w)} ${n(w)} rad/s, so C = 1 ÷ (${n(w)}² × ${n(L / 1000)}) F ${ap(C)} ${n(C)} μF.` },
   { prompt: `At resonance the impedance is just R = ${n(R)} Ω. What is the peak current, in amperes, to 2 decimal places?`, answer: [r2(I0)], explanation: `V₀/R = ${n(V0)} ÷ ${n(R)} ${ap(I0)} ${n(I0)} A.` },
   { prompt: `Using the unrounded current, what is the peak voltage across the coil, current times ωL, in volts, to 2 decimal places?`, answer: [r2(VL)], explanation: `ωL ${ap(XL)} ${n(XL)} Ω, and ${n(I0)} × ${n(XL)} ${ap(VL)} ${n(VL)} V.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q37', title: 'Ringing at resonance',
 brief: 'The tuning circuit is driven right on its resonant frequency, and Mira wants to know the current and the most energy its coil then holds.',
 labels: ['resonant frequency (Hz)', 'peak current (A)', 'greatest coil energy (mJ)'], tolerance: 0.005,
 gl: [['resonant frequency (Hz)'], ['peak current (A)'], ['greatest coil energy (mJ)']]
}, {
 /* Series R Ω, L mH, C μF driven at its own resonant frequency f0 = 1/(2π√(LC)); there Z = R, I0 = V0/R, and the coil's greatest energy is ½LI0² (mJ for L in mH).
    The worked example (30 Ω, 50 mH, 50 μF) is not drawn, and the first mission's circuit (40 Ω, 100 mH, 20 μF) is not drawn either. */
 canonical: { R: 12, L: 60, C: 15, V0: 18 },
 draw: R => retry(R, R => ({ R: 2 * R.int(2, 40), L: 10 * R.int(1, 30), C: R.int(1, 60), V0: R.int(2, 40) }), p => {
  const f0 = 1 / (TWO_PI * Math.sqrt(p.L * 1e-3 * p.C * 1e-6)), I0 = p.V0 / p.R, U = p.L * I0 * I0 / 2; return allSafe([f0, I0, U]) && I0 >= 0.1 && U < 90000 && !(p.R === 30 && p.L === 50 && p.C === 50) && !(p.R === 40 && p.L === 100 && p.C === 20); },
  { R: 12, L: 60, C: 15, V0: 18 }),
 build: ({ R, L, C, V0 }) => { const f0 = 1 / (TWO_PI * Math.sqrt(L * 1e-3 * C * 1e-6)), I0 = V0 / R, U = L * I0 * I0 / 2; return {
  prompt: `A series circuit of the mast has a resistor of ${n(R)} Ω, a coil of ${n(L)} mH (1 mH = 10⁻³ H) and a capacitor of ${n(C)} μF (1 μF = 10⁻⁶ F). It is driven by a supply of peak voltage ${n(V0)} V whose frequency is set exactly to the circuit's own resonant frequency. Enter that resonant frequency in hertz (Hz); then the peak current in amperes at that frequency; then the greatest energy the coil stores in millijoules (mJ), which it holds at the moment the current is at its peak (the energy stored in a coil is ½LI²). Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(f0), r2(I0), r2(U)],
  hints: ['The resonant frequency is f₀ = 1/(2π√(LC)), with L in henries and C in farads.', 'At resonance the coil and the capacitor cancel, so the impedance is just R and the peak current is V₀/R. A coil stores ½LI², which is in millijoules when L is in millihenries and I in amperes.'],
  solution: `The resonant frequency is f₀ = 1/(2π√(LC)) = 1 ÷ (2π√(${n(L / 1000)} × ${n(C)} × 10⁻⁶)) ${res(f0, 'Hz')}. At resonance Z = R, so the peak current is V₀/R = ${n(V0)} ÷ ${n(R)} ${res(I0, 'A')}. At the moment of peak current the coil holds ½LI₀² = ½ × ${n(L)} × ${n(I0)}² ${res(U, 'mJ')}.`,
  guidance: [
   { prompt: `What is the resonant frequency f₀ = 1/(2π√(LC)), in hertz, to 2 decimal places?`, answer: [r2(f0)], explanation: `√(LC) = √(${n(L / 1000)} × ${n(C)} × 10⁻⁶) s, and 1 ÷ (2π√(LC)) ${ap(f0)} ${n(f0)} Hz.` },
   { prompt: `At resonance the impedance is just R = ${n(R)} Ω. What is the peak current, in amperes, to 2 decimal places?`, answer: [r2(I0)], explanation: `V₀/R = ${n(V0)} ÷ ${n(R)} ${ap(I0)} ${n(I0)} A.` },
   { prompt: `Using the unrounded peak current, what is the greatest energy ½LI₀² stored in the coil, in millijoules, to 2 decimal places?`, answer: [r2(U)], explanation: `½ × ${n(L)} mH × (${n(I0)} A)² ${ap(U)} ${n(U)} mJ.` }
  ] }; }
});


/* ---- q40 Electromagnetic waves: c = fλ and E = cB; realm review and bridge to Waves [16.2, 16.5] ---- */
mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The relay satellite',
 brief: 'The outpost\'s relay satellite broadcasts on a stated wavelength, and the crew want its frequency, the strength of its magnetic field and how long its signal takes to arrive.',
 labels: ['frequency (MHz)', 'magnetic field (nT)', 'travel time (ms)'], tolerance: 0.005,
 gl: [['frequency (MHz)'], ['magnetic field (nT)'], ['travel time (ms)']]
}, {
 /* Wavelength λ metres, electric field amplitude e/10 V/m, distance d km. f = c/λ in MHz, B = E/c in nT, time = distance ÷ c in ms (c = 3.00 × 10⁸ m/s).
    The worked example (100 MHz, 6 V/m, i.e. λ = 3 m) is not drawn. */
 canonical: { lam: 7.5, e: 18, d: 5400 },
 draw: R => retry(R, R => ({ lam: R.pick([1.5, 2, 2.5, 4, 5, 6, 7.5, 8, 9, 12, 15, 20, 24, 30, 40, 50, 60, 75, 100]), e: R.int(5, 300), d: 100 * R.int(2, 600) }), p => {
  const f = 300 / p.lam, B = p.e / 10 / 3e8 * 1e9, t = p.d * 1000 / 3e8 * 1000; return allSafe([f, B, t]) && !(p.lam === 3 && p.e === 60); },
  { lam: 7.5, e: 18, d: 5400 }),
 build: ({ lam, e, d }) => { const E = e / 10, f = 300 / lam, B = E / 3e8 * 1e9, t = d * 1000 / 3e8 * 1000; return {
  prompt: `The outpost's relay satellite broadcasts a radio signal of wavelength ${n(lam)} m, and it orbits ${n(d)} km from the mast (1 km = 1000 m). Where the signal reaches the mast, the wave's electric field has an amplitude of ${n(E)} V/m. Take c = 3.00 × 10⁸ m/s. Enter the frequency of the signal in megahertz (MHz, 1 MHz = 10⁶ Hz); then the amplitude of the wave's magnetic field in nanotesla (nT, 1 nT = 10⁻⁹ T); then the time the signal takes to travel from the satellite to the mast, in milliseconds (ms). Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(f), r2(B), r2(t)],
  hints: ['Every electromagnetic wave travels at c, and c = fλ, so f = c/λ in hertz.', 'The field amplitudes in a wave are tied together by E = cB, so B = E/c. The signal travels at the constant speed c, so its travel time is the distance divided by c, in seconds.'],
  solution: `The frequency is f = c/λ = 3.00 × 10⁸ ÷ ${n(lam)} ${ap(f * 1e6)} ${n(f * 1e6)} Hz ${res(f, 'MHz')}. The magnetic field amplitude is B = E/c = ${n(E)} ÷ (3.00 × 10⁸) T ${res(B, 'nT')}. The distance is ${n(d)} × 1000 = ${n(d * 1000)} m, so the travel time is ${n(d * 1000)} ÷ (3.00 × 10⁸) s ${ap(t / 1000)} ${n(t / 1000)} s ${res(t, 'ms')}.`,
  guidance: [
   { prompt: `Use c = fλ with λ = ${n(lam)} m. What is the frequency, in megahertz, to 2 decimal places?`, answer: [r2(f)], explanation: `f = 3.00 × 10⁸ ÷ ${n(lam)} ${ap(f * 1e6)} ${n(f * 1e6)} Hz, that is ${n(f)} MHz.` },
   { prompt: `The electric field amplitude is ${n(E)} V/m. What is the magnetic field amplitude B = E/c, in nanotesla, to 2 decimal places?`, answer: [r2(B)], explanation: `${n(E)} ÷ (3.00 × 10⁸) T ${ap(B)} ${n(B)} × 10⁻⁹ T, that is ${n(B)} nT.` },
   { prompt: `The satellite is ${n(d)} km, which is ${n(d * 1000)} m, away. What is the travel time at speed c, in milliseconds, to 2 decimal places?`, answer: [r2(t)], explanation: `${n(d * 1000)} ÷ (3.00 × 10⁸) s ${ap(t / 1000)} ${n(t / 1000)} s, that is ${n(t)} ms.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'The signal lamp',
 brief: 'The mast carries a signal lamp that flashes visible light, and Mira wants the light\'s frequency and field strength and how many wavelengths fit across the lens gap.',
 labels: ['frequency (THz)', 'magnetic field (nT)', 'wavelengths in the gap'], tolerance: 0.005,
 gl: [['frequency (THz)'], ['magnetic field (nT)'], ['wavelengths in the gap']]
}, {
 /* Visible light of wavelength lam nm, electric field amplitude E V/m, across a gap of d μm. f = c/λ in THz (300000/lam), B = E/c in nT (E/0.3),
    number of wavelengths = d × 1000 ÷ lam. */
 canonical: { lam: 540, E: 135, d: 8 },
 draw: R => retry(R, R => ({ lam: R.int(400, 750), E: R.int(20, 600), d: R.int(2, 60) }), p => allSafe([300000 / p.lam, p.E / 0.3, p.d * 1000 / p.lam]) && !(p.lam === 600), { lam: 540, E: 135, d: 8 }),
 build: ({ lam, E, d }) => { const f = 3e8 / (lam * 1e-9) / 1e12, B = E / 3e8 * 1e9, cnt = d * 1000 / lam; return {
  prompt: `The mast carries a signal lamp that flashes visible light of wavelength ${n(lam)} nm (1 nm = 10⁻⁹ m). The electric field amplitude in the beam is ${n(E)} V/m. Take c = 3.00 × 10⁸ m/s. Enter the frequency of the light in terahertz (THz, 1 THz = 10¹² Hz); then the amplitude of the beam's magnetic field in nanotesla (nT, 1 nT = 10⁻⁹ T); then the width of the ${n(d)} μm gap in the lens divided by the wavelength, which is how many wavelengths span the gap and need not be a whole number (1 μm = 10⁻⁶ m, so the gap is ${n(d)} thousand nanometres). Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(f), r2(B), r2(cnt)],
  hints: ['The wavelength must be in metres before dividing: c = fλ gives f = c/λ in hertz, and 1 THz = 10¹² Hz.', 'The field amplitudes satisfy E = cB, so B = E/c. The number of wavelengths in a gap is the gap divided by one wavelength, with both in the same unit.'],
  solution: `The frequency is f = c/λ = 3.00 × 10⁸ ÷ (${n(lam)} × 10⁻⁹) ${ap(f * 1e12)} ${n(f * 1e12)} Hz ${res(f, 'THz')}. The magnetic field amplitude is B = E/c = ${n(E)} ÷ (3.00 × 10⁸) T ${res(B, 'nT')}. The gap is ${n(d)} μm = ${n(d * 1000)} nm, so ${n(d * 1000)} ÷ ${n(lam)} ${res(cnt, 'wavelengths')} fit across it.`,
  guidance: [
   { prompt: `Use f = c/λ with λ = ${n(lam)} × 10⁻⁹ m. What is the frequency, in terahertz, to 2 decimal places?`, answer: [r2(f)], explanation: `3.00 × 10⁸ ÷ (${n(lam)} × 10⁻⁹) ${ap(f * 1e12)} ${n(f * 1e12)} Hz, that is ${n(f)} THz.` },
   { prompt: `The electric field amplitude is ${n(E)} V/m. What is the magnetic field amplitude B = E/c, in nanotesla, to 2 decimal places?`, answer: [r2(B)], explanation: `${n(E)} ÷ (3.00 × 10⁸) T ${ap(B)} ${n(B)} × 10⁻⁹ T, that is ${n(B)} nT.` },
   { prompt: `The gap is ${n(d)} μm, which is ${n(d * 1000)} nm. How many wavelengths of ${n(lam)} nm fit across it, to 2 decimal places?`, answer: [r2(cnt)], explanation: `${n(d * 1000)} ÷ ${n(lam)} ${ap(cnt)} ${n(cnt)}.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q39', title: 'Tuning to a wavelength',
 brief: 'Mira must tune the mast\'s transmitter circuit so that its wave has a chosen wavelength, and needs the frequency, the capacitor to fit and the coil\'s reactance there.',
 labels: ['frequency (MHz)', 'capacitance (pF)', 'coil reactance (Ω)'], tolerance: 0.005,
 gl: [['frequency (MHz)'], ['capacitance (pF)'], ['coil reactance (Ω)']]
}, {
 /* Wavelength lam metres, coil L μH. f = c/λ in MHz; resonance in series with a capacitor needs ω²LC = 1, so C = 1/(ω²L) (pF); the coil's reactance is ωL
    (equal to the capacitor's at resonance). The worked example (λ = 3 m, the 2 μH and 50 pF circuit) is not drawn. */
 canonical: { lam: 60, L: 3 },
 draw: R => retry(R, R => ({ lam: R.int(10, 150), L: R.pick([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) }), p => {
  const f = 300 / p.lam, w = TWO_PI * f * 1e6, C = 1e12 / (w * w * p.L * 1e-6), X = w * p.L * 1e-6; return allSafe([f, C, X]) && C >= 5 && C < 90000 && p.lam !== 3 && !(p.lam === 30 && p.L === 2); },
  { lam: 60, L: 3 }),
 build: ({ lam, L }) => { const f = 300 / lam, w = TWO_PI * f * 1e6, C = 1e12 / (w * w * L * 1e-6), X = w * L * 1e-6; return {
  prompt: `Mira wants the mast's transmitter to send a radio wave of wavelength ${n(lam)} m. Take c = 3.00 × 10⁸ m/s. The transmitter circuit is a coil of ${n(L)} μH (1 μH = 10⁻⁶ H) in series with an adjustable capacitor, and it sends at its resonant frequency. Enter the frequency the wave needs, in megahertz (MHz, 1 MHz = 10⁶ Hz); then the capacitance that gives that resonant frequency, in picofarads (pF, 1 pF = 10⁻¹² F); then the reactance of the coil at that frequency, in ohms. Give each to 2 decimal places, use unrounded values in later steps, and type numbers without commas.`,
  answer: [r2(f), r2(C), r2(X)],
  hints: ['Every electromagnetic wave travels at c, so the frequency is f = c/λ, which is in hertz when λ is in metres.', 'Resonance needs X_L = X_C, which gives ω²LC = 1, so C = 1/(ω²L) in farads, with ω = 2πf and L in henries. The coil\'s reactance is X_L = ωL.'],
  solution: `The frequency is f = c/λ = 3.00 × 10⁸ ÷ ${n(lam)} ${ap(f * 1e6)} ${n(f * 1e6)} Hz ${res(f, 'MHz')}. Then ω = 2π × ${n(f * 1e6)} ${ap(w)} ${n(w)} rad/s. At resonance ω²LC = 1, so C = 1/(ω²L) = 1 ÷ (${n(w)}² × ${n(L)} × 10⁻⁶) F ${res(C, 'pF')}. The coil's reactance is X_L = ωL = ${n(w)} × ${n(L)} × 10⁻⁶ ${res(X, 'Ω')}.`,
  guidance: [
   { prompt: `Use f = c/λ with λ = ${n(lam)} m. What frequency does the wave need, in megahertz, to 2 decimal places?`, answer: [r2(f)], explanation: `3.00 × 10⁸ ÷ ${n(lam)} ${ap(f * 1e6)} ${n(f * 1e6)} Hz, that is ${n(f)} MHz.` },
   { prompt: `Using the unrounded frequency, ω = 2πf, and C = 1/(ω²L), what capacitance gives resonance at that frequency, in picofarads, to 2 decimal places?`, answer: [r2(C)], explanation: `ω ${ap(w)} ${n(w)} rad/s, so C = 1 ÷ (${n(w)}² × ${n(L)} × 10⁻⁶) F ${ap(C)} ${n(C)} pF.` },
   { prompt: `What is the coil's reactance X_L = ωL at that frequency, in ohms, to 2 decimal places?`, answer: [r2(X)], explanation: `${n(w)} × ${n(L)} × 10⁻⁶ H ${ap(X)} ${n(X)} Ω.` }
  ] }; }
});


})();
