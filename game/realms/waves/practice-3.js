/* Waves: sound and light practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p3.js. */
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
/* Rounding to k places; the rounded value as text; "= x" when the value is exactly x at k places and "≈ x" when it was rounded;
   a guard against rounding ties; a bounded retry (at most 1000 tries, then the canonical parameters). */
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => { const t = rd(x, k).toFixed(k); return (/^-0\.?0*$/.test(t) ? t.slice(1) : t).replace('-', '−'); };
const exact = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-7;
const eq = (x, k) => (exact(x, k) ? '= ' + n(x) : '≈ ' + fx(x, k));
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const same = (p, q) => Object.keys(q).every(key => p[key] === q[key]);
const ord = k => { const m = k % 100; return k + (m >= 11 && m <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[k % 10] || 'th'); };
const SUPD = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sup = e => String(e).split('').map(c => SUPD[c]).join('');
const sci = (a, e) => `${n(a)} × 10${sup(e)}`;
const lg = Math.log10, TAU = 2 * Math.PI, V = 343;

/* ---- q11 Chapter review: a pulse on the mast cable [V1 16.2, 16.3] ---- */

/* A cable hangs with a load: tension F_T = 9.8 W, μ = m ÷ L, v = √(F_T ÷ μ), travel time L ÷ v. */
const m11b = ({ L, m, W }) => { const T = G.tidy(9.8 * W), mu = G.tidy(m / L), v = G.tidy(Math.sqrt(T / mu)); return { T, mu, v, t: L / v }; };
const c11b = { L: 40, m: 16, W: 18 };
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The hanging load line',
 brief: 'A signal line hangs down the mast with a weight on its end, and Mira wants to know how quickly a tap at the top reaches the weight.',
 labels: ['tension (N)', 'linear mass density (kg/m)', 'wave speed (m/s)', 'travel time (s)'], tolerance: 0.0005,
 gl: [['tension (N)'], ['μ (kg/m)'], ['wave speed (m/s)'], ['travel time (s)']]
}, {
 /* L from 20 to 60 m, load W a whole number of kg built so the speed 7k is a whole number (9.8 W ÷ μ = 49k²). The travel time is off a tie at 3 places. */
 canonical: c11b,
 draw: R => tries(() => { const L = R.pick([20, 25, 30, 40, 50, 60]), mu = R.pick([0.2, 0.4, 0.6, 0.8, 1, 1.2]), k = R.int(2, 6); return { L, m: G.tidy(mu * L), W: G.tidy(5 * mu * k * k) }; },
  p => { const q = m11b(p); return Number.isInteger(p.W) && q.T < 1000 && Number.isInteger(q.v) && exact(q.mu, 3) && exact(p.m, 2) && !edge(q.t, 3) && !same(p, c11b); }, c11b),
 build: p => { const { L, m, W } = p, { T, mu, v, t } = m11b(p); return {
  prompt: `A signal line hangs straight down the comms mast, and a weight of ${n(W)} kg is hung on its lower end. The line is ${n(L)} m long and has a mass of ${n(m)} kg. Treat the tension as the same all the way along the line and equal to the weight of the load, F_T = mg, with g = 9.8 m/s². Mira taps the line at the top. Enter the tension in newtons, the linear mass density in kg/m, the speed of the pulse in m/s, and the time in seconds the pulse takes to run down to the weight, to 3 decimal places.`,
  answer: [T, mu, v, rd(t, 3)],
  hints: ['A weight hanging still pulls the line with its own weight, F_T = mg, using g = 9.8 m/s². The linear mass density is the line’s mass divided by its length.', 'The speed of a pulse is v = √(F_T ÷ μ). The pulse keeps that speed all the way, so the time is the length divided by the speed.'],
  solution: `F_T = mg = ${n(W)} × 9.8 = ${n(T)} N. μ = ${n(m)} ÷ ${n(L)} = ${n(mu)} kg/m. v = √(${n(T)} ÷ ${n(mu)}) = √${n(v * v)} = ${n(v)} m/s. The pulse covers ${n(L)} m at ${n(v)} m/s, so it takes ${n(L)} ÷ ${n(v)} ${eq(t, 3)} s.`,
  guidance: [
   { prompt: `The ${n(W)} kg weight hangs still on the line. What is the tension F_T = mg, in newtons, with g = 9.8 m/s²?`, answer: [T], explanation: `F_T = ${n(W)} × 9.8 = ${n(T)} N: the line holds up the whole weight of the load.` },
   { prompt: `The line has a mass of ${n(m)} kg over ${n(L)} m. What is its linear mass density μ, in kg/m?`, answer: [mu], explanation: `μ = ${n(m)} ÷ ${n(L)} = ${n(mu)} kg/m.` },
   { prompt: `The tension is ${n(T)} N and μ = ${n(mu)} kg/m. What is the speed of a pulse v = √(F_T ÷ μ), in m/s?`, answer: [v], explanation: `${n(T)} ÷ ${n(mu)} = ${n(v * v)}, and √${n(v * v)} = ${n(v)}, so a pulse runs at ${n(v)} m/s.` },
   { prompt: `A pulse runs at ${n(v)} m/s down a line ${n(L)} m long. How long does it take, in seconds to 3 decimal places?`, answer: [rd(t, 3)], explanation: `Time is distance ÷ speed: ${n(L)} ÷ ${n(v)} ${eq(t, 3)} s.` }
  ] }; }
});

/* An echo from the anchor: v = √(F ÷ μ) is a whole number, L = vt ÷ 2, mass = μL. */
const m11c = ({ mu, F, t }) => { const v = G.tidy(Math.sqrt(F / mu)), L = G.tidy(v * t / 2); return { v, L, M: G.tidy(mu * L) }; };
const c11c = { mu: 0.15, F: 240, t: 1.5 };
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The echo off the anchor',
 brief: 'A guy cable’s length was never written down, but a pulse sent up it and its echo will tell Mira how long it is and how heavy.',
 labels: ['wave speed (m/s)', 'cable length (m)', 'cable mass (kg)'], tolerance: 0.0005,
 gl: [['wave speed (m/s)'], ['cable length (m)'], ['cable mass (kg)']]
}, {
 /* μ from 0.05 to 0.5 kg/m, a whole-number speed from 20 to 90 m/s (so F_T = μv² has at most 2 decimals), an echo time in tenths of a second. L has at most 2 decimals and the mass at most 3. */
 canonical: c11c,
 draw: R => tries(() => { const mu = R.pick([0.05, 0.08, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]), v = R.int(20, 90); return { mu, F: G.tidy(mu * v * v), t: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 1.8, 2, 2.5, 3]) }; },
  p => { const q = m11c(p); return exact(p.F, 2) && Number.isInteger(q.v) && exact(q.L, 2) && exact(q.M, 3) && !(p.mu === 0.08 && p.F === 288) && !same(p, c11c); }, c11c),
 build: p => { const { mu, F, t } = p, { v, L, M } = m11c(p); return {
  prompt: `Nobody wrote down the length of an old guy cable on the comms mast. Its linear mass density is ${n(mu)} kg/m and it is pulled tight with a tension of ${n(F)} N. Mira taps the bottom end, and the pulse runs up the cable, reflects off the anchor at the top and runs back down: the echo reaches her ${n(t)} s after the tap. Assume the pulse keeps the same speed on the way up and on the way back. Enter the wave speed in m/s, the length of the cable in metres, and the mass of the whole cable in kg.`,
  answer: [v, L, M],
  hints: ['The speed depends only on the cable: v = √(F_T ÷ μ). The echo’s journey is up the cable and back down again.', 'In the time of the echo the pulse covers twice the cable’s length, so the length is the speed times the time, divided by 2. Mass = linear mass density × length.'],
  solution: `v = √(${n(F)} ÷ ${n(mu)}) = √${n(v * v)} = ${n(v)} m/s. The pulse covers ${n(v)} × ${n(t)} = ${n(G.tidy(v * t))} m up and back, so the cable is ${n(G.tidy(v * t))} ÷ 2 = ${n(L)} m long. Its mass is μ × length = ${n(mu)} × ${n(L)} = ${n(M)} kg.`,
  guidance: [
   { prompt: `The tension is ${n(F)} N and μ = ${n(mu)} kg/m. What is the wave speed v = √(F_T ÷ μ), in m/s?`, answer: [v], explanation: `${n(F)} ÷ ${n(mu)} = ${n(v * v)}, and √${n(v * v)} = ${n(v)}, so the pulse runs at ${n(v)} m/s.` },
   { prompt: `In ${n(t)} s the pulse runs up and back at ${n(v)} m/s. How long is the cable, in metres? (The pulse covers the cable’s length twice.)`, answer: [L], explanation: `Up and back is ${n(v)} × ${n(t)} = ${n(G.tidy(v * t))} m, which is twice the length, so the cable is ${n(L)} m long.` },
   { prompt: `Each metre of the ${n(L)} m cable has a mass of ${n(mu)} kg. What is the mass of the whole cable, in kg?`, answer: [M], explanation: `${n(mu)} × ${n(L)} = ${n(M)} kg.` }
  ] }; }
});

/* A driven cable: μ = M ÷ L, v, λ = v ÷ f and the average power P = ½μA²ω²v (q10). */
const m11d = ({ L, M, F, f, A }) => { const mu = G.tidy(M / L), v = G.tidy(Math.sqrt(F / mu)), w = TAU * f, a = A / 100; return { mu, v, lam: v / f, w, P: 0.5 * mu * a * a * w * w * v }; };
const c11d = { L: 30, M: 3.6, F: 300, f: 8, A: 3 };
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q10', title: 'Power down the test cable',
 brief: 'The workshop test cable is driven hard, and Mira needs its wave speed, wavelength and the power it carries before she trusts it.',
 labels: ['wave speed (m/s)', 'wavelength (m)', 'average power (W)'], tolerance: 0.005,
 gl: [['wave speed (m/s)'], ['wavelength (m)'], ['average power (W)']]
}, {
 /* A whole-number speed from 30 to 90 m/s, μ with at most 3 decimals, F_T with at most 2; the wavelength and the power are off a tie at 2 places and the power is between 0.5 and 900 W. */
 canonical: c11d,
 draw: R => tries(() => { const L = R.pick([20, 25, 30, 40, 50]), M = R.pick([1.5, 2, 2.4, 3, 3.6, 4, 5, 6]), v = R.int(30, 90); return { L, M, F: G.tidy(M / L * v * v), f: R.int(3, 15), A: R.int(1, 6) }; },
  p => { const q = m11d(p); return exact(p.F, 1) && exact(q.mu, 3) && Number.isInteger(q.v) && !edge(q.lam, 2) && !edge(q.P, 2) && q.P >= 0.5 && q.P < 900 && !same(p, c11d); }, c11d),
 build: p => { const { L, M, F, f, A } = p, { mu, v, lam, w, P } = m11d(p); return {
  prompt: `A test cable in the workshop is ${n(L)} m long, has a mass of ${n(M)} kg and is pulled tight with a tension of ${n(F)} N. Mira drives one end up and down at ${n(f)} Hz with an amplitude of ${n(A)} cm, so a sine wave runs along the cable. Enter the wave speed in m/s, the wavelength in metres to 2 decimal places, and the average power the wave carries in watts to 2 decimal places, from P = ½μA²ω²v with ω = 2πf in rad/s and A in metres. Work from unrounded values and round only at the end.`,
  answer: [v, rd(lam, 2), rd(P, 2)],
  hints: ['The speed is v = √(F_T ÷ μ) with μ = mass ÷ length, and the wavelength comes from v = fλ.', 'For the power, change the amplitude to metres (divide centimetres by 100), find ω = 2πf, and put μ, A, ω and v into P = ½μA²ω²v.'],
  solution: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m. v = √(${n(F)} ÷ ${n(mu)}) = √${n(v * v)} = ${n(v)} m/s. λ = v ÷ f = ${n(v)} ÷ ${n(f)} ${eq(lam, 2)} m. A = ${n(A)} cm = ${n(A / 100)} m and ω = 2π × ${n(f)} ≈ ${fx(w, 4)} rad/s, so P = ½ × ${n(mu)} × ${n(A / 100)}² × ${fx(w, 4)}² × ${n(v)} ${eq(P, 2)} W.`,
  guidance: [
   { prompt: `The cable’s ${n(M)} kg is spread over ${n(L)} m, and its tension is ${n(F)} N. What is the wave speed v = √(F_T ÷ μ), in m/s?`, answer: [v], explanation: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m, then ${n(F)} ÷ ${n(mu)} = ${n(v * v)} and √${n(v * v)} = ${n(v)} m/s.` },
   { prompt: `The wave speed is ${n(v)} m/s and the frequency is ${n(f)} Hz. What is the wavelength, in metres to 2 decimal places?`, answer: [rd(lam, 2)], explanation: `λ = v ÷ f = ${n(v)} ÷ ${n(f)} ${eq(lam, 2)} m.` },
   { prompt: `Now the power. With A = ${n(A / 100)} m, ω = 2π × ${n(f)} rad/s and μ and v as above, what is P = ½μA²ω²v, in watts to 2 decimal places?`, answer: [rd(P, 2)], explanation: `P = ½ × ${n(mu)} × ${n(A / 100)}² × ${fx(w, 4)}² × ${n(v)} ${eq(P, 2)} W.` }
  ] }; }
});

/* ---- q12 Superposition: two waves out of phase, amplitude 2A cos(φ/2) [V1 16.5] ---- */

/* Two equal waves A sin θ and A sin(θ + φ): the sum is 2A cos(φ/2) sin(θ + φ/2). */
const m12b = ({ A, phi, th }) => { const AR = 2 * A * Math.cos(phi / 2); return { AR, ang: th + phi / 2, y: AR * Math.sin(th + phi / 2) }; };
const c12b = { A: 2.5, phi: 1.8, th: 1.2 };
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'Ripples in the fountain tank',
 brief: 'Two ripple makers in the hall’s water tank send waves along the same channel, and Mira wants the height of the water where they meet.',
 labels: ['combined amplitude (mm)', 'water height (mm)'], tolerance: 0.005,
 gl: [['combined amplitude (mm)'], ['angle (rad)'], ['water height (mm)']]
}, {
 /* A from 1.0 to 6.0 mm in tenths, φ from 0.3 to 2.8 rad, θ from 0.1 to 3.0 rad. The amplitude and the height are off ties at 2 places and the height is not near 0. */
 canonical: c12b,
 draw: R => tries(() => ({ A: R.int(10, 60) / 10, phi: R.int(3, 28) / 10, th: R.int(1, 30) / 10 }),
  p => { const q = m12b(p); return !edge(q.AR, 2) && !edge(q.y, 2) && Math.abs(q.y) >= 0.1 && !same(p, c12b); }, c12b),
 build: p => { const { A, phi, th } = p, { AR, ang, y } = m12b(p); return {
  prompt: `Two ripple makers at one end of the water tank in the assembly hall send waves of the same height down the same channel. Written with θ for kx − ωt, the water is lifted by y₁ = ${n(A)} sin θ mm from the first and by y₂ = ${n(A)} sin(θ + ${n(phi)}) mm from the second, so the second wave is ahead by ${n(phi)} rad. Together they make one wave, y = 2A cos(φ ÷ 2) sin(θ + φ ÷ 2), with A = ${n(A)} mm and φ = ${n(phi)} rad. Angles are in radians. Enter the amplitude of the combined wave in mm, then its height in mm at the place and moment where θ = ${n(th)} rad. Give both to 2 decimal places; the height may be negative.`,
  answer: [rd(AR, 2), rd(y, 2)],
  hints: ['The amplitude of the combined wave is 2A cos(φ ÷ 2): the factor in front of the sine in the combined wave.', 'The height is the combined wave itself: put θ + φ ÷ 2 inside the sine, take it in radians, and multiply by the amplitude.'],
  solution: `The amplitude is 2A cos(φ ÷ 2) = 2 × ${n(A)} × cos(${n(phi / 2)}) ${eq(AR, 2)} mm. The angle in the sine is θ + φ ÷ 2 = ${n(th)} + ${n(phi / 2)} = ${n(ang)} rad, so y = ${fx(AR, 4)} × sin(${n(ang)}) ${eq(y, 2)} mm.`,
  guidance: [
   { prompt: `A = ${n(A)} mm and φ = ${n(phi)} rad. What is the combined amplitude 2A cos(φ ÷ 2), in mm to 2 decimal places?`, answer: [rd(AR, 2)], explanation: `φ ÷ 2 = ${n(phi / 2)} rad, and 2 × ${n(A)} × cos(${n(phi / 2)}) ${eq(AR, 2)} mm.` },
   { prompt: `The combined wave is y = 2A cos(φ ÷ 2) sin(θ + φ ÷ 2). With θ = ${n(th)} rad and φ = ${n(phi)} rad, what is the angle θ + φ ÷ 2, in radians?`, answer: [ang], explanation: `${n(th)} + ${n(phi)} ÷ 2 = ${n(th)} + ${n(phi / 2)} = ${n(ang)} rad.` },
   { prompt: `What is the height y = 2A cos(φ ÷ 2) × sin(${n(ang)}), in mm to 2 decimal places?`, answer: [rd(y, 2)], explanation: `sin(${n(ang)}) ≈ ${fx(Math.sin(ang), 4)}, and ${fx(AR, 4)} × ${fx(Math.sin(ang), 4)} ${eq(y, 2)} mm.` }
  ] }; }
});

/* Two speakers in step: λ = 343 ÷ f, φ = 2πd ÷ λ, amplitude 2p cos(φ/2). */
const m12c = ({ f, d, p }) => { const lam = G.tidy(V / f), phi = TAU * d / lam; return { lam, phi, AR: 2 * p * Math.cos(phi / 2) }; };
const c12c = { f: 490, d: 0.25, p: 3 };
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Two speakers on the stage',
 brief: 'Two speakers on the hall stage play the same note, and Mira wants to know how strong the sound is at her seat.',
 labels: ['wavelength (m)', 'phase difference (rad)', 'combined amplitude (Pa)'], tolerance: 0.0005,
 gl: [['wavelength (m)'], ['phase difference (rad)'], ['combined amplitude (Pa)']]
}, {
 /* f gives a wavelength with at most 3 decimals; the path difference is in hundredths of a metre and puts φ between 0.3 and 2.8 rad, so the combined amplitude is positive. φ is off a tie at 3 places, the amplitude at 2, and rounding φ first does not change the amplitude. */
 canonical: c12c,
 draw: R => tries(() => ({ f: R.pick([196, 245, 343, 392, 490, 686]), d: R.int(5, 90) / 100, p: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]) }),
  p => { const q = m12c(p); return q.phi >= 0.3 && q.phi <= 2.8 && !edge(q.phi, 3) && !edge(q.AR, 2) && rd(2 * p.p * Math.cos(rd(q.phi, 3) / 2), 2) === rd(q.AR, 2) && !same(p, c12c); }, c12c),
 build: p => { const { f, d, p: A } = p, { lam, phi, AR } = m12c(p); return {
  prompt: `Two loudspeakers on the stage of the assembly hall play the same note of ${n(f)} Hz, exactly in step with each other. At Mira’s seat the sound from one speaker has travelled ${n(d)} m further than the sound from the other, and each speaker on its own makes a sound wave of amplitude ${n(A)} Pa there. The speed of sound in the hall is 343 m/s. A wave that has travelled a path ${n(d)} m longer is behind by a phase difference φ = 2π × ${n(d)} ÷ λ radians, where λ is the wavelength. Enter the wavelength in metres, the phase difference in radians, both to 3 decimal places, then the amplitude of the combined sound in Pa to 2 decimal places, found from 2A cos(φ ÷ 2) with the unrounded φ.`,
  answer: [lam, rd(phi, 3), rd(AR, 2)],
  hints: ['The wavelength comes from v = fλ, so λ = v ÷ f, with v = 343 m/s.', 'Put the path difference and the wavelength into φ = 2π × (path difference) ÷ λ. Then the combined amplitude is 2A cos(φ ÷ 2), where A is the amplitude of one speaker alone.'],
  solution: `λ = v ÷ f = 343 ÷ ${n(f)} = ${n(lam)} m. φ = 2π × ${n(d)} ÷ ${n(lam)} ${eq(phi, 3)} rad. The combined amplitude is 2A cos(φ ÷ 2) = 2 × ${n(A)} × cos(${fx(phi / 2, 4)}) ${eq(AR, 2)} Pa.`,
  guidance: [
   { prompt: `The note is ${n(f)} Hz and sound travels at 343 m/s. What is the wavelength λ = v ÷ f, in metres to 3 decimal places?`, answer: [lam], explanation: `λ = 343 ÷ ${n(f)} = ${n(lam)} m.` },
   { prompt: `The path difference is ${n(d)} m and λ = ${n(lam)} m. What is the phase difference φ = 2π × ${n(d)} ÷ λ, in radians to 3 decimal places?`, answer: [rd(phi, 3)], explanation: `φ = 2π × ${n(d)} ÷ ${n(lam)} ${eq(phi, 3)} rad.` },
   { prompt: `Each speaker alone has amplitude ${n(A)} Pa. What is the combined amplitude 2A cos(φ ÷ 2), in Pa to 2 decimal places?`, answer: [rd(AR, 2)], explanation: `φ ÷ 2 ≈ ${fx(phi / 2, 4)} rad, so 2 × ${n(A)} × cos(${fx(phi / 2, 4)}) ${eq(AR, 2)} Pa. That is ${AR < 2 * A * 0.999 ? 'less than' : 'the same as'} ${n(2 * A)} Pa, the amplitude of two waves exactly in step.` }
  ] }; }
});

/* Two waves on a rope, the second source shifted by Δ along the rope: φ = kΔ with k = 2π ÷ λ; θ = kx − ωt; amplitude and the sum at (x, t). */
const m12d = ({ A, lam, f, dl, x, t }) => { const k = TAU / lam, w = TAU * f, phi = k * dl, th = k * x - w * t, AR = 2 * A * Math.cos(phi / 2); return { k, w, phi, th, AR, y: A * Math.sin(th) + A * Math.sin(th + phi) }; };
const c12d = { A: 6, lam: 2.4, f: 2.5, dl: 0.5, x: 1.4, t: 0.3 };
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q08', title: 'Two ropes, one shifted',
 brief: 'Two crew members shake a long rope from points a little apart, and Mira wants the combined wave at one chosen place and moment.',
 labels: ['phase difference (rad)', 'combined amplitude (cm)', 'combined displacement (cm)'], tolerance: 0.0005,
 gl: [['phase difference (rad)'], ['combined amplitude (cm)'], ['kx − ωt (rad)']]
}, {
 /* A from 2 to 8 cm, λ and f from short lists, the second source shifted by Δ in hundredths of a metre so that φ is between 0.3 and 2.8 rad. φ is off a tie at 3 places, the amplitude and the displacement at 2 and 3 places for θ; the displacement is not near 0. */
 canonical: c12d,
 draw: R => tries(() => ({ A: R.int(2, 8), lam: R.pick([1.2, 1.5, 1.6, 2, 2.4, 2.5, 3]), f: R.pick([1.5, 2, 2.5, 4, 5]), dl: R.int(10, 90) / 100, x: R.int(5, 30) / 10, t: R.int(2, 20) / 20 }),
  p => { const q = m12d(p); return q.phi >= 0.3 && q.phi <= 2.8 && !edge(q.phi, 3) && !edge(q.AR, 2) && !edge(q.th, 3) && !edge(q.y, 2) && Math.abs(q.y) >= 0.1 && !same(p, c12d); }, c12d),
 build: p => { const { A, lam, f, dl, x, t } = p, { k, w, phi, th, AR, y } = m12d(p); return {
  prompt: `Two crew members shake a long rope in the assembly hall, from points ${n(dl)} m apart along it. The waves are y₁ = ${n(A)} sin(kx − ωt) cm and y₂ = ${n(A)} sin(k(x + ${n(dl)}) − ωt) cm, with wavelength ${n(lam)} m and frequency ${n(f)} Hz, where k = 2π ÷ λ is the wave number, ω = 2πf, x is in metres and t in seconds. The second wave is therefore ahead by a phase difference φ = k × ${n(dl)} radians. Angles are in radians. Enter φ in radians to 3 decimal places, the amplitude of the combined wave in cm to 2 decimal places, and the combined displacement y₁ + y₂ in cm to 2 decimal places at x = ${n(x)} m and t = ${n(t)} s. Use unrounded values until the end; the displacement may be negative.`,
  answer: [rd(phi, 3), rd(AR, 2), rd(y, 2)],
  hints: ['The wave number is k = 2π ÷ λ, and the phase difference is φ = k times the shift. The combined amplitude is 2A cos(φ ÷ 2).', 'For the displacement, find kx − ωt with ω = 2πf, put it into the first wave, put kx − ωt + φ into the second, take both sines in radians and add them.'],
  solution: `k = 2π ÷ ${n(lam)} ≈ ${fx(k, 4)} rad/m, so φ = k × ${n(dl)} ${eq(phi, 3)} rad. The amplitude is 2A cos(φ ÷ 2) = 2 × ${n(A)} × cos(${fx(phi / 2, 4)}) ${eq(AR, 2)} cm. With ω = 2π × ${n(f)} ≈ ${fx(w, 4)} rad/s, kx − ωt ${eq(th, 3)} rad, so y₁ + y₂ = ${n(A)} sin(${fx(th, 4)}) + ${n(A)} sin(${fx(th + phi, 4)}) ${eq(y, 2)} cm.`,
  guidance: [
   { prompt: `The wavelength is ${n(lam)} m, so k = 2π ÷ ${n(lam)}. The second source is shifted by ${n(dl)} m. What is φ = k × ${n(dl)}, in radians to 3 decimal places?`, answer: [rd(phi, 3)], explanation: `k ≈ ${fx(k, 4)} rad/m, and φ = ${fx(k, 4)} × ${n(dl)} ${eq(phi, 3)} rad.` },
   { prompt: `What is the combined amplitude 2A cos(φ ÷ 2) with A = ${n(A)} cm, in cm to 2 decimal places?`, answer: [rd(AR, 2)], explanation: `2 × ${n(A)} × cos(${fx(phi / 2, 4)}) ${eq(AR, 2)} cm.` },
   { prompt: `At x = ${n(x)} m and t = ${n(t)} s, what is kx − ωt with ω = 2π × ${n(f)}, in radians to 3 decimal places?`, answer: [rd(th, 3)], explanation: `kx = ${fx(k * x, 4)} and ωt = ${fx(w * t, 4)}, so kx − ωt ${eq(th, 3)} rad.` }
  ] }; }
});

/* ---- q13 Standing waves on a string: nodes and harmonics [V1 16.6] ---- */

/* A rope of length L, wave speed v, driven at f = nv ÷ 2L: λ = v ÷ f, n = 2L ÷ λ, nodes n + 1. */
const m13b = ({ L, v, n: h }) => { const f = G.tidy(h * v / (2 * L)), lam = v / f; return { f, lam, h: Math.round(2 * L / lam), nodes: Math.round(2 * L / lam) + 1 }; };
const c13b = { L: 2.5, v: 60, n: 4 };
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'A rope between two posts',
 brief: 'A rope tied between two posts in the hall is shaken until it stands in neat loops, and Mira wants to know which pattern it found.',
 labels: ['wavelength (m)', 'harmonic number', 'number of nodes'], tolerance: 0.0005,
 gl: [['wavelength (m)'], ['harmonic number'], ['number of nodes']]
}, {
 /* L from a short list, speed in steps of 5 m/s, harmonic n from 2 to 9. The driving frequency has at most 2 decimals and stays below 1000 Hz; the wavelength has at most 3. */
 canonical: c13b,
 draw: R => tries(() => ({ L: R.pick([1.5, 2, 2.5, 3, 3.6, 4, 4.5, 5]), v: 5 * R.int(4, 24), n: R.int(2, 9) }),
  p => { const q = m13b({ L: p.L, v: p.v, n: p.n }); return exact(q.f, 2) && q.f < 1000 && exact(2 * p.L / p.n, 3) && !same(p, c13b); }, c13b),
 build: p => { const { L, v, n: h } = p, { f, lam, nodes } = m13b({ L, v, n: h }); return {
  prompt: `Mira ties a rope between two posts ${n(L)} m apart in the assembly hall. Waves run along the rope at ${n(v)} m/s. She shakes it at ${n(f)} Hz, and it settles into a standing wave with a node at each post and loops of equal size between them: one of its harmonics. Enter the wavelength of the wave in metres, the harmonic number (how many loops there are between the posts), and the total number of nodes, counting the two at the posts.`,
  answer: [lam, h, nodes],
  hints: ['The wavelength comes from v = fλ, so λ = v ÷ f.', 'Each loop is half a wavelength and the loops fill the distance between the posts, so the number of loops is the distance divided by half a wavelength, 2L ÷ λ. The loops are separated by nodes, with one more node than loops.'],
  solution: `λ = v ÷ f = ${n(v)} ÷ ${n(f)} = ${n(lam)} m. Each loop is λ ÷ 2 = ${n(lam / 2)} m, and ${n(L)} ÷ ${n(lam / 2)} = ${n(h)}, so this is the ${ord(h)} harmonic. ${n(h)} loops have ${n(h)} + 1 = ${n(nodes)} nodes, counting both posts.`,
  guidance: [
   { prompt: `Waves run at ${n(v)} m/s and the rope is shaken at ${n(f)} Hz. What is the wavelength λ = v ÷ f, in metres?`, answer: [lam], explanation: `λ = ${n(v)} ÷ ${n(f)} = ${n(lam)} m.` },
   { prompt: `One loop is half a wavelength, ${n(lam / 2)} m. How many loops fit between the posts ${n(L)} m apart?`, answer: [h], explanation: `${n(L)} ÷ ${n(lam / 2)} = ${n(h)} loops, so the harmonic number is ${n(h)}.` },
   { prompt: `The rope has ${n(h)} loops. How many nodes does it have in all, counting the one at each post?`, answer: [nodes], explanation: `Each loop sits between two nodes and neighbouring loops share one, so ${n(h)} loops have ${n(h)} + 1 = ${n(nodes)} nodes.` }
  ] }; }
});

/* Tuning a cable: v = 2L f₁, F_T = μv², node spacing L ÷ h. */
const m13c = ({ L, mu, f1, h }) => { const v = G.tidy(2 * L * f1); return { v, F: G.tidy(mu * v * v), sp: G.tidy(L / h) }; };
const c13c = { L: 1.5, mu: 0.04, f1: 40, h: 4 };
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Tuning the hall cable',
 brief: 'A cable in the hall must sing a chosen note as its lowest tone, and Mira needs to know how tight to pull it.',
 labels: ['wave speed (m/s)', 'tension (N)', 'node spacing (m)'], tolerance: 0.0005,
 gl: [['wave speed (m/s)'], ['tension (N)'], ['node spacing (m)']]
}, {
 /* L, μ and f₁ from short lists; the tension has at most 2 decimals and stays below 1000 N, the node spacing has at most 3 decimals. */
 canonical: c13c,
 draw: R => tries(() => ({ L: R.pick([0.5, 0.75, 0.8, 1, 1.2, 1.5, 2]), mu: R.pick([0.005, 0.01, 0.02, 0.025, 0.04, 0.05, 0.08]), f1: R.int(8, 60), h: R.int(2, 8) }),
  p => { const q = m13c(p); return exact(q.F, 2) && q.F >= 5 && q.F < 1000 && exact(q.sp, 3) && q.v < 1000 && !same(p, c13c); }, c13c),
 build: p => { const { L, mu, f1, h } = p, { v, F, sp } = m13c(p); return {
  prompt: `A tuning cable in the hall is ${n(L)} m long, fixed at both ends, with a linear mass density of ${n(mu)} kg/m. Mira wants its lowest note, the fundamental, to be ${n(f1)} Hz. Enter the wave speed on the cable that gives this note, in m/s, then the tension in newtons needed to give that wave speed, and finally the distance in metres between neighbouring nodes when the tuned cable vibrates in its ${ord(h)} harmonic.`,
  answer: [v, F, sp],
  hints: ['In the fundamental the cable holds one loop, half a wavelength long, so λ = 2L, and the wave speed is v = fλ.', 'The wave speed on a cable is v = √(F_T ÷ μ), so F_T = μv². In the nth harmonic there are n loops, so neighbouring nodes are L ÷ n apart.'],
  solution: `The fundamental has λ = 2L = ${n(2 * L)} m, so v = fλ = ${n(f1)} × ${n(2 * L)} = ${n(v)} m/s. The tension is F_T = μv² = ${n(mu)} × ${n(v)}² = ${n(F)} N. In the ${ord(h)} harmonic there are ${n(h)} loops, so neighbouring nodes are ${n(L)} ÷ ${n(h)} = ${n(sp)} m apart.`,
  guidance: [
   { prompt: `In the fundamental the cable’s ${n(L)} m is half a wavelength, so λ = ${n(2 * L)} m. With f = ${n(f1)} Hz, what is the wave speed v = fλ, in m/s?`, answer: [v], explanation: `v = ${n(f1)} × ${n(2 * L)} = ${n(v)} m/s.` },
   { prompt: `The wave speed must be ${n(v)} m/s and μ = ${n(mu)} kg/m. What tension F_T = μv² is needed, in newtons?`, answer: [F], explanation: `v² = ${n(v * v)}, and ${n(mu)} × ${n(v * v)} = ${n(F)} N.` },
   { prompt: `In the ${ord(h)} harmonic the ${n(L)} m cable holds ${n(h)} loops. How far apart are neighbouring nodes, in metres?`, answer: [sp], explanation: `One loop is ${n(L)} ÷ ${n(h)} = ${n(sp)} m, and neighbouring nodes are one loop apart.` }
  ] }; }
});

/* Two neighbouring resonances fa = n f₁ and fb = (n + 1) f₁: f₁ = fb − fa, v = 2L f₁, F_T = μv² with μ = M ÷ L. */
const m13d = ({ L, M, f1, h }) => { const v = G.tidy(2 * L * f1), mu = G.tidy(M / L); return { fa: h * f1, fb: (h + 1) * f1, v, mu, F: G.tidy(mu * v * v) }; };
const c13d = { L: 1.5, M: 0.06, f1: 25, h: 6 };
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q09', title: 'Two notes in a row',
 brief: 'Two neighbouring notes ring on a cable whose tension was never read, and Mira wants to find the tension from them.',
 labels: ['harmonic number of the lower note', 'wave speed (m/s)', 'tension (N)'], tolerance: 0.0005,
 gl: [['fundamental (Hz)'], ['wave speed (m/s)'], ['tension (N)']]
}, {
 /* L and M from short lists with μ at most 3 decimals; f₁ from 10 to 60 Hz and n from 2 to 8. The tension has at most 2 decimals and lies between 20 and 999 N. */
 canonical: c13d,
 draw: R => tries(() => ({ L: R.pick([1, 1.2, 1.5, 2, 2.5, 3]), M: R.pick([0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12]), f1: R.int(10, 60), h: R.int(2, 8) }),
  p => { const q = m13d(p); return exact(q.mu, 3) && exact(q.v, 2) && exact(q.F, 2) && q.F >= 20 && q.F < 1000 && !same(p, c13d); }, c13d),
 build: p => { const { L, M, f1, h } = p, { fa, fb, v, mu, F } = m13d(p); return {
  prompt: `A cable ${n(L)} m long with a mass of ${n(M)} kg is fixed at both ends in the assembly hall. Its tension was never read. Mira finds that it rings in standing waves at ${n(fa)} Hz and at ${n(fb)} Hz, and at no frequency between them. These are two neighbouring harmonics of the cable. Enter the harmonic number of the lower one, then the wave speed on the cable in m/s, then its tension in newtons.`,
  answer: [h, v, F],
  hints: ['The frequencies of the harmonics are f, 2f, 3f and so on, where f is the fundamental, so two neighbouring harmonics differ by the fundamental. The harmonic number of a note is its frequency divided by the fundamental.', 'The fundamental has one loop, so λ = 2L and v = fλ. Then find μ = mass ÷ length and use F_T = μv².'],
  solution: `Neighbouring harmonics differ by the fundamental: ${n(fb)} − ${n(fa)} = ${n(f1)} Hz. The lower note is ${n(fa)} ÷ ${n(f1)} = ${n(h)}, so it is the ${ord(h)} harmonic. The fundamental has λ = 2L = ${n(2 * L)} m, so v = ${n(f1)} × ${n(2 * L)} = ${n(v)} m/s. With μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m, F_T = μv² = ${n(mu)} × ${n(v)}² = ${n(F)} N.`,
  guidance: [
   { prompt: `The two neighbouring harmonics are ${n(fa)} Hz and ${n(fb)} Hz. What is the fundamental frequency, in Hz?`, answer: [f1], explanation: `Neighbouring harmonics differ by the fundamental: ${n(fb)} − ${n(fa)} = ${n(f1)} Hz. The lower note is ${n(fa)} ÷ ${n(f1)} = ${n(h)} times that.` },
   { prompt: `The fundamental is ${n(f1)} Hz and the cable is ${n(L)} m long, so λ = ${n(2 * L)} m. What is the wave speed v = fλ, in m/s?`, answer: [v], explanation: `v = ${n(f1)} × ${n(2 * L)} = ${n(v)} m/s.` },
   { prompt: `The cable’s μ is ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m. What tension F_T = μv² gives a wave speed of ${n(v)} m/s, in newtons?`, answer: [F], explanation: `${n(mu)} × ${n(v)}² = ${n(mu)} × ${n(v * v)} = ${n(F)} N.` }
  ] }; }
});

/* ---- q14 The speed of sound in air and its temperature [V1 17.2] ---- */

/* An echo off the back wall: v = 331 √(1 + T ÷ 273) and the delay 2d ÷ v. */
const m14b = ({ Tc, d }) => { const r = 1 + Tc / 273, v = 331 * Math.sqrt(r); return { r, v, t: 2 * d / v }; };
const c14b = { Tc: 12, d: 85 };
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The clap and its echo',
 brief: 'Mira claps on the stage and listens for the echo from the back wall, to learn how the hall’s air carries sound today.',
 labels: ['speed of sound (m/s)', 'echo delay (s)'], tolerance: 0.0005,
 gl: [['speed of sound (m/s)'], ['echo delay (s)']]
}, {
 /* Air from −20 to 35 °C (not 0), a wall from 8 to 60 m away. The speed is off a tie at 2 places and the delay at 3; the delay from the rounded speed rounds the same way. */
 canonical: c14b,
 draw: R => tries(() => ({ Tc: R.except(-20, 35, [0]), d: R.int(8, 60) }),
  p => { const q = m14b(p); return !edge(q.v, 2) && !edge(q.t, 3) && rd(2 * p.d / rd(q.v, 2), 3) === rd(q.t, 3) && !(p.Tc === 20 || p.Tc === 30) && !same(p, c14b); }, c14b),
 build: p => { const { Tc, d } = p, { r, v, t } = m14b(p); return {
  prompt: `On the stage of the assembly hall Mira claps once and hears the echo from the back wall, ${n(d)} m away. The echo is the sound of the clap travelling to the wall and back again, and the air in the hall is at ${n(Tc)} °C. Enter the speed of sound in the hall in m/s, to 2 decimal places, then the time in seconds between the clap and its echo, to 3 decimal places, worked out from the unrounded speed.`,
  answer: [rd(v, 2), rd(t, 3)],
  hints: ['In air at a temperature of T_C degrees Celsius, sound travels at v = 331 √(1 + T_C ÷ 273) m/s. A temperature below 0 °C makes the fraction negative.', 'The sound goes to the wall and comes back, so it covers twice the distance to the wall. Time = distance ÷ speed.'],
  solution: `1 + ${par(Tc)} ÷ 273 ≈ ${fx(r, 4)}, so v = 331 × √(1 + ${par(Tc)} ÷ 273) ≈ ${fx(v, 2)} m/s. The sound covers 2 × ${n(d)} = ${n(2 * d)} m there and back, so the delay is ${n(2 * d)} ÷ ${fx(v, 4)} ≈ ${fx(t, 3)} s.`,
  guidance: [
   { prompt: `The hall is at ${n(Tc)} °C. What is the speed of sound v = 331 √(1 + T_C ÷ 273), in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${par(Tc)} ÷ 273 ≈ ${fx(Tc / 273, 4)}, so v ≈ 331 × √${fx(r, 4)} ≈ ${fx(v, 2)} m/s.` },
   { prompt: `The clap goes ${n(d)} m to the wall and ${n(d)} m back. How long is the delay, in seconds to 3 decimal places?`, answer: [rd(t, 3)], explanation: `The distance is ${n(2 * d)} m, so the time is ${n(2 * d)} ÷ ${fx(v, 4)} ≈ ${fx(t, 3)} s.` }
  ] }; }
});

/* The thermometer is broken: v = fλ, then 1 + T ÷ 273 = (v ÷ 331)² gives T = 273((v ÷ 331)² − 1). */
const m14c = ({ f, lam }) => { const v = f * lam; return { v, T: 273 * ((v / 331) * (v / 331) - 1) }; };
const c14c = { f: 440, lam: 0.78 };
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'The broken thermometer',
 brief: 'The hall thermometer has failed, so Mira will read the temperature of the air from the sound of a note instead.',
 labels: ['speed of sound (m/s)', 'air temperature (°C)'], tolerance: 0.005,
 gl: [['speed of sound (m/s)'], ['air temperature (°C)']]
}, {
 /* Built from a temperature between −25 and 38 °C: the wavelength is rounded to 3 decimals, and the temperature found from f and λ lies between −30 and 40 °C. The speed is off a tie at 2 places and the temperature at 1. */
 canonical: c14c,
 draw: R => tries(() => { const f = R.pick([220, 262, 330, 392, 440, 523, 587, 660]), Tc = R.except(-25, 38, [0]); return { f, lam: rd(331 * Math.sqrt(1 + Tc / 273) / f, 3) }; },
  p => { const q = m14c(p); return q.T > -30 && q.T < 40 && Math.abs(q.T) > 1 && !edge(q.v, 2) && !edge(q.T, 1) && !same(p, c14c); }, c14c),
 build: p => { const { f, lam } = p, { v, T } = m14c(p), q = (v / 331) * (v / 331); return {
  prompt: `The thermometer in the assembly hall has broken. Mira plays a pure note of ${n(f)} Hz and finds that its wavelength in the hall is ${n(lam)} m. Enter the speed of sound in the hall in m/s, to 2 decimal places. Then, since the speed of sound in air is v = 331 √(1 + T_C ÷ 273), squaring both sides gives 1 + T_C ÷ 273 = (v ÷ 331)². Use this to find the temperature of the air in °C, to 1 decimal place, working from the unrounded speed.`,
  answer: [rd(v, 2), rd(T, 1)],
  hints: ['Sound is a wave like any other, so v = fλ.', 'Square v ÷ 331, subtract 1 to get T_C ÷ 273, then multiply by 273. A speed below 331 m/s means air colder than 0 °C.'],
  solution: `v = fλ = ${n(f)} × ${n(lam)} ${eq(v, 2)} m/s. Then (v ÷ 331)² ≈ ${fx(q, 4)}, so T_C ÷ 273 = (v ÷ 331)² − 1 ≈ ${fx(q - 1, 4)} and T_C = 273 × ${fx(q - 1, 4)} ≈ ${fx(T, 1)} °C.`,
  guidance: [
   { prompt: `The note is ${n(f)} Hz and its wavelength is ${n(lam)} m. What is the speed of sound v = fλ, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `v = ${n(f)} × ${n(lam)} ${eq(v, 2)} m/s.` },
   { prompt: `Using 1 + T_C ÷ 273 = (v ÷ 331)² with the unrounded speed, what is the air temperature T_C, in °C to 1 decimal place?`, answer: [rd(T, 1)], explanation: `(v ÷ 331)² ≈ ${fx(q, 4)}, so T_C = 273 × (${fx(q, 4)} − 1) ≈ ${fx(T, 1)} °C. The speed is ${v > 331 ? 'above' : 'below'} 331 m/s, so the air is ${T > 0 ? 'warmer' : 'colder'} than 0 °C.` }
  ] }; }
});

/* A cable's n-th harmonic sounds in the air: f = nv_s ÷ 2L (q13), v = 331 √(1 + T ÷ 273), λ = v ÷ f. */
const m14d = ({ L, vs, h, Tc }) => { const f = G.tidy(h * vs / (2 * L)), r = 1 + Tc / 273, v = 331 * Math.sqrt(r); return { f, r, v, lam: v / f }; };
const c14d = { L: 0.75, vs: 150, h: 3, Tc: -5 };
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q13', title: 'A cable note in cold air',
 brief: 'A cable’s standing wave pushes on the cold air of the hall, and Mira wants the note it plays and how long its sound waves are.',
 labels: ['frequency (Hz)', 'speed of sound (m/s)', 'wavelength of the sound (m)'], tolerance: 0.0005,
 gl: [['frequency (Hz)'], ['speed of sound (m/s)'], ['wavelength of the sound (m)']]
}, {
 /* L from a short list, cable wave speed in steps of 5, harmonic 2 to 6; the frequency has at most 2 decimals and stays below 1000 Hz. Air from −25 to 35 °C (not 0). The speed is off a tie at 2 places, the wavelength at 3, and the wavelength from the rounded speed rounds the same way. */
 canonical: c14d,
 draw: R => tries(() => ({ L: R.pick([0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5, 2]), vs: 5 * R.int(12, 40), h: R.int(2, 6), Tc: R.except(-25, 35, [0]) }),
  p => { const q = m14d(p); return exact(q.f, 2) && q.f < 1000 && !edge(q.v, 2) && !edge(q.lam, 3) && rd(rd(q.v, 2) / q.f, 3) === rd(q.lam, 3) && !same(p, c14d); }, c14d),
 build: p => { const { L, vs, h, Tc } = p, { f, r, v, lam } = m14d(p); return {
  prompt: `A tuning cable ${n(L)} m long is fixed at both ends in the assembly hall. Waves travel along the cable at ${n(vs)} m/s, and it vibrates in its ${ord(h)} harmonic. The vibrating cable makes sound with the same frequency as the cable. The air in the hall is at ${n(Tc)} °C. Enter the frequency of the cable’s vibration in Hz, the speed of sound in the hall in m/s to 2 decimal places, and the wavelength of the sound in the air in metres to 3 decimal places, worked out from the unrounded speed.`,
  answer: [f, rd(v, 2), rd(lam, 3)],
  hints: ['On the cable the harmonic has n loops, each half a wavelength, so λ = 2L ÷ n and f = v ÷ λ with the cable’s own wave speed.', 'The air carries the same frequency but its own speed, v = 331 √(1 + T_C ÷ 273). The wavelength of the sound is that speed divided by the frequency.'],
  solution: `On the cable λ = 2L ÷ n = 2 × ${n(L)} ÷ ${n(h)} ${eq(2 * L / h, 4)} m, so f = ${n(vs)} ÷ ${fx(2 * L / h, 4)} = ${n(f)} Hz. In the air, 1 + ${par(Tc)} ÷ 273 ≈ ${fx(r, 4)}, so v = 331 × √${fx(r, 4)} ≈ ${fx(v, 2)} m/s. The sound has the same frequency, so its wavelength is ${fx(v, 4)} ÷ ${n(f)} ≈ ${fx(lam, 3)} m.`,
  guidance: [
   { prompt: `The cable is ${n(L)} m long and vibrates in its ${ord(h)} harmonic with waves at ${n(vs)} m/s. What is the frequency f = nv ÷ (2L), in Hz?`, answer: [f], explanation: `f = ${n(h)} × ${n(vs)} ÷ (2 × ${n(L)}) = ${n(f)} Hz.` },
   { prompt: `The hall air is at ${n(Tc)} °C. What is the speed of sound v = 331 √(1 + T_C ÷ 273), in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${par(Tc)} ÷ 273 ≈ ${fx(Tc / 273, 4)}, so v ≈ 331 × √${fx(r, 4)} ≈ ${fx(v, 2)} m/s.` },
   { prompt: `The sound has the frequency ${n(f)} Hz and travels at the speed just found. What is its wavelength λ = v ÷ f, in metres to 3 decimal places?`, answer: [rd(lam, 3)], explanation: `λ ≈ ${fx(v, 4)} ÷ ${n(f)} ≈ ${fx(lam, 3)} m. This is not the cable’s wavelength: the air’s speed differs from the cable’s.` }
  ] }; }
});

/* ---- q15 Sound intensity and decibels, β = 10 log₁₀(I/I₀) [V1 17.3] ---- */

/* k identical fans, each of intensity a × 10^e W/m²; their intensities add. */
const m15b = ({ a, e, k }) => ({ b1: 10 * (lg(a) + e + 12), bk: 10 * (lg(a * k) + e + 12), inc: 10 * lg(k) });
const c15b = { a: 4.3, e: -8, k: 5 };
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The fans in the plant room',
 brief: 'The hall’s fans hum, and the safety rules limit the level at the door, so Mira needs the level for one fan and for several.',
 labels: ['level of one fan (dB)', 'level of all the fans (dB)', 'increase (dB)'], tolerance: 0.005,
 gl: [['log₁₀ (I ÷ I₀)'], ['level of all the fans (dB)'], ['increase (dB)']]
}, {
 /* a from 1.0 to 9.9, e from −9 to −5, k from 2 to 9 fans. All three levels are off a tie at 1 place, and the two rounded levels differ by the rounded increase. */
 canonical: c15b,
 draw: R => tries(() => ({ a: R.int(10, 99) / 10, e: R.int(-9, -5), k: R.int(2, 9) }),
  p => { const q = m15b(p); return !edge(q.b1, 1) && !edge(q.bk, 1) && !edge(q.inc, 1) && Math.abs(rd(q.b1, 1) + rd(q.inc, 1) - rd(q.bk, 1)) < 1e-9 && !(p.a === 3 && p.e === -5) && !same(p, c15b); }, c15b),
 build: p => { const { a, e, k } = p, { b1, bk, inc } = m15b(p), tot = G.tidy(a * k); return {
  prompt: `In the plant room behind the assembly hall, one fan unit alone makes a sound of intensity ${sci(a, e)} W/m² at the door. The fan units are identical, and when ${n(k)} of them run together their intensities add. The reference intensity is I₀ = 10⁻¹² W/m². Enter the sound intensity level at the door of one fan unit running alone, then of all ${n(k)} running together, both in dB to 1 decimal place. Then enter how many decibels louder the ${n(k)} fans are than one, to 1 decimal place.`,
  answer: [rd(b1, 1), rd(bk, 1), rd(inc, 1)],
  hints: ['The level is β = 10 log₁₀(I ÷ I₀). Dividing by I₀ = 10⁻¹² adds 12 to the power of ten, and log₁₀(a × 10ᵖ) = log₁₀ a + p.', 'When identical sounds run together their intensities add, so the intensity of k units is k times the intensity of one. The extra decibels are 10 log₁₀ of that factor.'],
  solution: `One fan: I ÷ I₀ = ${sci(a, e + 12)}, so log₁₀(I ÷ I₀) = log₁₀ ${n(a)} + ${n(e + 12)} ≈ ${fx(lg(a) + e + 12, 4)} and β ≈ ${fx(b1, 1)} dB. ${n(k)} fans: ${n(k)} × ${n(a)} × 10${sup(e)} = ${n(tot)} × 10${sup(e)} W/m², so I ÷ I₀ = ${n(tot)} × 10${sup(e + 12)} and β ≈ ${fx(bk, 1)} dB. The increase is 10 log₁₀ ${n(k)} ≈ ${fx(inc, 1)} dB.`,
  guidance: [
   { prompt: `For one fan, I ÷ I₀ = ${sci(a, e + 12)}. What is log₁₀ of that, to 2 decimal places?`, answer: [rd(lg(a) + e + 12, 2)], explanation: `log₁₀(${sci(a, e + 12)}) = log₁₀ ${n(a)} + ${n(e + 12)} ≈ ${fx(lg(a) + e + 12, 4)}, which is ${fx(lg(a) + e + 12, 2)} to 2 decimal places. Ten times it is the level, ${fx(b1, 1)} dB.` },
   { prompt: `With ${n(k)} fans the intensity is ${n(k)} × ${sci(a, e)} W/m². What is the level of all ${n(k)} together, in dB to 1 decimal place?`, answer: [rd(bk, 1)], explanation: `The intensity is ${n(tot)} × 10${sup(e)} W/m², so I ÷ I₀ = ${n(tot)} × 10${sup(e + 12)} and β = 10 × ${fx(lg(a * k) + e + 12, 4)} ≈ ${fx(bk, 1)} dB.` },
   { prompt: `How many decibels louder are ${n(k)} fans than one, 10 log₁₀ ${n(k)}, to 1 decimal place?`, answer: [rd(inc, 1)], explanation: `10 log₁₀ ${n(k)} ≈ ${fx(inc, 1)} dB, the same as the difference of the two levels.` }
  ] }; }
});

/* A small speaker sends out sound evenly: level β₁ at r₁, I = I₀ × 10^(β ÷ 10), I ∝ 1/r², level at r₂ = m r₁. Intensities in µW/m². */
const m15c = ({ b1, r1, m }) => { const I1 = G.tidy(Math.pow(10, b1 / 10 - 6)), I2 = I1 / (m * m); return { I1, I2, b2: b1 - 20 * lg(m), r2: r1 * m }; };
const c15c = { b1: 70, r1: 6, m: 4 };
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Down the length of the hall',
 brief: 'A speaker at the front of the hall is loud enough at the first row, and Mira wants to know how loud it is at the back.',
 labels: ['intensity at the near seat (µW/m²)', 'intensity at the far seat (µW/m²)', 'level at the far seat (dB)'], tolerance: 0.0005,
 gl: [['intensity at the near seat (µW/m²)'], ['intensity at the far seat (µW/m²)'], ['level at the far seat (dB)']]
}, {
 /* Level 60, 70 or 80 dB (the intensity is then 1, 10 or 100 µW/m²), distance ratio 2, 4, 5 or 10, near seat from 2 to 12 m. The far intensity has at most 3 decimals and the far level is off a tie at 1 place. */
 canonical: c15c,
 draw: R => tries(() => ({ b1: R.pick([60, 70, 80]), r1: R.int(2, 12), m: R.pick([2, 4, 5, 10]) }),
  p => { const q = m15c(p); return exact(q.I2, 3) && !edge(q.b2, 1) && !same(p, c15c); }, c15c),
 build: p => { const { b1, r1, m } = p, { I1, I2, b2, r2 } = m15c(p); return {
  prompt: `A small speaker at the front of the assembly hall sends its sound out evenly in all directions. At a seat ${n(r1)} m from it the sound intensity level is ${n(b1)} dB. The reference intensity is I₀ = 10⁻¹² W/m², and 1 µW/m² means 10⁻⁶ W/m². A level of β dB means an intensity I = I₀ × 10^(β ÷ 10), and, as the sound spreads, the intensity falls as 1 ÷ r². Enter the intensity at the near seat in µW/m², then the intensity in µW/m² at a far seat ${n(r2)} m from the speaker, and then the level at the far seat in dB to 1 decimal place.`,
  answer: [I1, I2, rd(b2, 1)],
  hints: ['A level of β dB means I = I₀ × 10^(β ÷ 10). With I₀ = 10⁻¹² W/m² and 1 µW/m² = 10⁻⁶ W/m², the intensity in µW/m² is 10 raised to (β ÷ 10 − 6).', 'The far seat is a whole number of times as far, so the intensity is divided by the square of that number. Then take the level of that intensity: β = 10 log₁₀(I ÷ I₀), with I ÷ I₀ = the intensity in µW/m² times 10⁶.'],
  solution: `I = 10^(${n(b1)} ÷ 10 − 6) = 10^${n(b1 / 10 - 6)} = ${n(I1)} µW/m². The far seat is ${n(r2)} ÷ ${n(r1)} = ${n(m)} times as far, so the intensity is divided by ${n(m)}² = ${n(m * m)}: ${n(I1)} ÷ ${n(m * m)} = ${n(I2)} µW/m². Its level is 10 log₁₀(${n(I2)} × 10⁶) ≈ ${fx(b2, 1)} dB.`,
  guidance: [
   { prompt: `The level at the near seat is ${n(b1)} dB, so I = I₀ × 10^(${n(b1)} ÷ 10) = 10⁻¹² × 10^${n(b1 / 10)} W/m². What is that in µW/m²?`, answer: [I1], explanation: `10⁻¹² × 10^${n(b1 / 10)} = 10^${n(b1 / 10 - 12)} W/m², and 1 µW/m² = 10⁻⁶ W/m², so it is ${n(I1)} µW/m².` },
   { prompt: `The far seat is ${n(m)} times as far as the near seat. What is the intensity there, in µW/m²?`, answer: [I2], explanation: `The intensity falls as 1 ÷ r², so it is divided by ${n(m)}² = ${n(m * m)}: ${n(I1)} ÷ ${n(m * m)} = ${n(I2)} µW/m².` },
   { prompt: `What is the level β = 10 log₁₀(I ÷ I₀) at the far seat, in dB to 1 decimal place? (I ÷ I₀ is the intensity in µW/m² times 10⁶.)`, answer: [rd(b2, 1)], explanation: `I ÷ I₀ = ${n(I2)} × 10⁶, so β = 10 × log₁₀(${n(G.tidy(I2 * 1e6))}) ≈ ${fx(b2, 1)} dB, which is ${fx(b1 - b2, 1)} dB below the near seat.` }
  ] }; }
});

/* A horn of power P W: I = P ÷ (4πr²) (q10), then levels at r₁ and r₂. Intensity at r₁ in µW/m² to 3 places. */
const m15d = ({ P, r1, r2 }) => { const I1 = P / (4 * Math.PI * r1 * r1) * 1e6, I2 = P / (4 * Math.PI * r2 * r2) * 1e6; return { I1, I2, b1: 10 * lg(I1 * 1e6), b2: 10 * lg(I2 * 1e6), d: 20 * lg(r2 / r1) }; };
const c15d = { P: 0.8, r1: 20, r2: 60 };
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q10', title: 'The warning horn',
 brief: 'A warning horn on the hall roof must be clearly heard at the near huts yet not painful, and Mira needs its levels at two distances.',
 labels: ['level at the near hut (dB)', 'level at the far hut (dB)', 'drop in level (dB)'], tolerance: 0.0005,
 gl: [['intensity at the near hut (µW/m²)'], ['level at the near hut (dB)'], ['level at the far hut (dB)']]
}, {
 /* The near intensity is between 1 and 999 µW/m². Every level is off a tie at 1 place, the rounded levels differ by the rounded drop, and using the intensity rounded to 3 places does not change the levels. */
 canonical: c15d,
 draw: R => tries(() => { const r1 = R.pick([8, 10, 12, 15, 20, 25, 30, 40, 50]); return { P: R.pick([0.2, 0.4, 0.5, 0.8, 1, 1.5, 2, 3, 5]), r1, r2: r1 * R.pick([2, 3, 4, 5, 6]) }; },
  p => { const q = m15d(p); return q.I1 >= 1 && q.I1 < 999 && !edge(q.I1, 3) && !edge(q.b1, 1) && !edge(q.b2, 1) && !edge(q.d, 1) && Math.abs(rd(q.b1, 1) - rd(q.b2, 1) - rd(q.d, 1)) < 1e-9 && rd(10 * lg(rd(q.I1, 3) * 1e6), 1) === rd(q.b1, 1) && rd(10 * lg(rd(q.I2, 3) * 1e6), 1) === rd(q.b2, 1) && !same(p, c15d); }, c15d),
 build: p => { const { P, r1, r2 } = p, { I1, I2, b1, b2, d } = m15d(p); return {
  prompt: `A warning horn on the roof of the assembly hall sends sound out evenly in all directions with a power of ${n(P)} W. The intensity at a distance r is I = P ÷ (4πr²). The reference intensity is I₀ = 10⁻¹² W/m², and 1 µW/m² means 10⁻⁶ W/m². Enter the sound intensity level in dB at a hut ${n(r1)} m from the horn, then at a hut ${n(r2)} m from it, both to 1 decimal place. Then enter how many decibels quieter the far hut is than the near one, to 1 decimal place.`,
  answer: [rd(b1, 1), rd(b2, 1), rd(d, 1)],
  hints: ['At each hut find the intensity I = P ÷ (4πr²) in W/m², then divide by I₀ = 10⁻¹² W/m² and use β = 10 log₁₀(I ÷ I₀).', 'The drop in level is the difference of the two levels. It depends only on how many times as far away the far hut is.'],
  solution: `At ${n(r1)} m, I = ${n(P)} ÷ (4π × ${n(r1)}²) ≈ ${fx(I1, 3)} µW/m², so I ÷ I₀ ≈ ${fx(I1, 3)} × 10⁶ and β ≈ ${fx(b1, 1)} dB. At ${n(r2)} m, I ≈ ${fx(I2, 3)} µW/m² and β ≈ ${fx(b2, 1)} dB. The far hut is ${fx(b1, 1)} − ${fx(b2, 1)} = ${fx(d, 1)} dB quieter.`,
  guidance: [
   { prompt: `At ${n(r1)} m from the ${n(P)} W horn, what is the intensity I = P ÷ (4πr²), in µW/m² to 3 decimal places?`, answer: [rd(I1, 3)], explanation: `${n(P)} ÷ (4π × ${n(r1 * r1)}) W/m² is about ${fx(I1, 3)} µW/m².` },
   { prompt: `Now the level at ${n(r1)} m, β = 10 log₁₀(I ÷ I₀), in dB to 1 decimal place. (I ÷ I₀ is the intensity in µW/m² times 10⁶.)`, answer: [rd(b1, 1)], explanation: `I ÷ I₀ ≈ ${fx(I1, 3)} × 10⁶, so β = 10 × log₁₀ of that ≈ ${fx(b1, 1)} dB.` },
   { prompt: `The hut ${n(r2)} m away has intensity ${fx(I2, 3)} µW/m². What is its level, in dB to 1 decimal place?`, answer: [rd(b2, 1)], explanation: `I ÷ I₀ ≈ ${fx(I2, 3)} × 10⁶, so β ≈ ${fx(b2, 1)} dB: the far hut is ${fx(d, 1)} dB quieter.` }
  ] }; }
});

})();
