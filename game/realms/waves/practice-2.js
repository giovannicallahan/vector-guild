/* Waves: sound and light practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p2.js. */
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
const TAU = 2 * Math.PI, g = 9.8;
/* Rounding to d places, and a rounded value as text with all its places and a typographic minus. */
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const fx = (x, d) => { const r = rd(x, d); return (Object.is(r, -0) ? 0 : r).toFixed(d).replace('-', '−'); };
const exactAt = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;
/* An answer rounded to d places whose dropped part is at least 0.1 of a step from one half, so a calculator that keeps
   fewer digits gives the same answer (or the value is exact at d places). */
const clear = (x, d) => { if (exactAt(x, d)) return true; const s = Math.abs(x) * Math.pow(10, d), fr = s - Math.floor(s); return Math.abs(fr - 0.5) >= 0.1; };
/* '=' when the rounded value is exact, '≈' when it is not. */
/* A rounded value as text, without trailing zeros when the value is exact at d places: fy(30, 4) is '30'. */
const fy = (x, d) => exactAt(x, d) ? n(rd(x, d)) : fx(x, d);
const eq = (x, d) => exactAt(x, d) ? '=' : '≈';
const tid = x => Math.round(x * 1e6) / 1e6;
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };

/* ---- q06 Damped and driven oscillations: decay and resonance [V1 15.5, 15.6] ---- */

/* Light damping: the decay exponent bt/2m has at most two decimals, the damped frequency and f₀ agree at 2 places. */
const damp = (m, b, k) => { const w0 = Math.sqrt(k / m), h = b / (2 * m); return { w0, wd: Math.sqrt(w0 * w0 - h * h), light: h <= 0.15 * w0 }; };

/* f₀ = √(k/m) ÷ 2π and A = A₀e^(−bt/2m), asked in the other order and in millimetres. Not the worked example (m = 1, b = 0.2, k = 100). */
const OK06b = ({ m, b, k, A0, t }) => { const e = b * t / (2 * m), A = A0 * Math.exp(-e), { w0, wd, light } = damp(m, b, k);
 return exactAt(e, 2) && A >= 0.5 && clear(A, 2) && clear(w0 / TAU, 2) && rd(wd / TAU, 2) === rd(w0 / TAU, 2) && light && !(m === 1 && b === 0.2 && k === 100); };
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The tiltmeter plate',
 brief: 'The tiltmeter plate in the quake station rings after every tremor, and Mira needs its best-driven frequency and how fast the ringing dies.',
 labels: ['driving frequency (Hz)', 'amplitude (mm)'], tolerance: 0.005,
 gl: [['natural frequency (Hz)'], ['bt/2m'], ['amplitude (mm)']]
}, {
 canonical: { m: 5, b: 0.8, k: 80, A0: 12, t: 5 },
 draw: R => retry(() => ({ m: R.int(1, 20) / 2, b: R.int(1, 20) / 10, k: 10 * R.int(2, 60), A0: R.int(4, 25), t: R.int(2, 30) }), OK06b, { m: 5, b: 0.8, k: 80, A0: 12, t: 5 }),
 build: ({ m, b, k, A0, t }) => { const e = tid(b * t / (2 * m)), A = A0 * Math.exp(-e), w0 = Math.sqrt(k / m), f0 = w0 / TAU; return {
  prompt: `The tiltmeter plate at the quake station is a ${n(m)} kg plate resting on springs with a total stiffness of k = ${n(k)} N/m. A damper with damping constant b = ${n(b)} kg/s stops it ringing. A tremor shoves the plate ${n(A0)} mm from rest and lets go, and its amplitude then shrinks as A(t) = A₀e^(−bt/2m), where A₀ is the starting amplitude. Enter the driving frequency that would make the plate swing hardest, in hertz to 2 decimal places: the damping is light, so use the natural frequency f₀ = √(k/m) ÷ 2π. Then enter the amplitude ${n(t)} s after the release, in mm to 2 decimal places.`,
  answer: [rd(f0, 2), rd(A, 2)],
  hints: ['Resonance needs the driving frequency to equal the natural frequency: find ω₀ = √(k/m) in radians per second, then divide by 2π to get hertz.', 'Work out bt/2m with m in kilograms, b in kg/s and t in seconds, then multiply A₀ by e to the power of minus that number. The amplitude stays in millimetres.'],
  solution: `ω₀ = √(${n(k)} ÷ ${n(m)}) ${eq(w0, 4)} ${n(tid(w0))} rad/s, so f₀ = ω₀ ÷ 2π ≈ ${fx(f0, 2)} Hz: driving the plate at this frequency gives resonance. Then bt/2m = ${n(b)} × ${n(t)} ÷ (2 × ${n(m)}) = ${n(e)}, so A = ${n(A0)}e^(−${n(e)}) ≈ ${fx(A, 2)} mm.`,
  guidance: [
   { prompt: 'What is the natural frequency f₀ = √(k/m) ÷ 2π of the plate, in hertz to 2 decimal places?', answer: [rd(f0, 2)], explanation: `√(${n(k)} ÷ ${n(m)}) ${eq(w0, 4)} ${n(tid(w0))} rad/s, and dividing by 2π gives about ${fx(f0, 2)} Hz.` },
   { prompt: `What is the number bt/2m after ${n(t)} s?`, answer: [e], explanation: `${n(b)} × ${n(t)} ÷ (2 × ${n(m)}) = ${n(e)}. It has no unit: kg/s times s divided by kg.` },
   { prompt: `What is the amplitude A₀e^(−bt/2m) after ${n(t)} s, in mm to 2 decimal places?`, answer: [rd(A, 2)], explanation: `e^(−${n(e)}) ≈ ${fx(Math.exp(-e), 4)}, and ${n(A0)} × ${fx(Math.exp(-e), 4)} ≈ ${fx(A, 2)} mm.` }
  ] }; }
});

/* Resonance with a driving frequency f gives k = m(2πf)²; then A = A₀e^(−bt/2m). k is asked to 1 place from the unrounded ω₀. */
const OK06c = ({ f, m, b, A0, t }) => { const w = TAU * f, k = m * w * w, e = b * t / (2 * m), A = A0 * Math.exp(-e);
 return clear(w, 2) && clear(k, 1) && k < 1000 && rd(m * rd(w, 2) * rd(w, 2), 1) === rd(k, 1) && exactAt(e, 2) && A >= 0.5 && clear(A, 2) && !(m === 1 && b === 0.2 && A0 === 10 && t === 10); };
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'Tuning to the quarry blasts',
 brief: 'Distant quarry blasts shake the ground at a steady rate, and Mira wants a sensor spring chosen so that it answers them as strongly as possible.',
 labels: ['spring constant (N/m)', 'amplitude (cm)'], tolerance: 0.005,
 gl: [['natural angular frequency (rad/s)'], ['spring constant (N/m)'], ['amplitude (cm)']]
}, {
 canonical: { f: 0.6, m: 5, b: 1.9, A0: 8, t: 5 },
 draw: R => retry(() => ({ f: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]), m: R.int(2, 20) / 2, b: R.int(1, 20) / 10, A0: R.int(4, 20), t: R.int(2, 30) }), OK06c, { f: 0.6, m: 5, b: 1.9, A0: 8, t: 5 }),
 build: ({ f, m, b, A0, t }) => { const w = TAU * f, k = m * w * w, e = tid(b * t / (2 * m)), A = A0 * Math.exp(-e); return {
  prompt: `Distant quarry blasts make the ground at the quake station shake at ${n(f)} Hz. Mira hangs a ${n(m)} kg sensor mass from a spring and wants the shaking to drive it at resonance, so its natural frequency must equal ${n(f)} Hz. The natural angular frequency is ω₀ = √(k/m), and it also equals 2π times the natural frequency in hertz. Squaring ω₀ = √(k/m) gives k = mω₀². Enter the spring constant k that does this, in N/m to 1 decimal place, working from the unrounded ω₀. Later the blasting stops and a damper with damping constant b = ${n(b)} kg/s is fitted. The mass is pulled ${n(A0)} cm from rest and let go, and its amplitude shrinks as A(t) = A₀e^(−bt/2m). Enter the amplitude ${n(t)} s after the release, in cm to 2 decimal places.`,
  answer: [rd(k, 1), rd(A, 2)],
  hints: ['Resonance needs the natural frequency to equal the driving frequency, so ω₀ is 2π times that frequency in radians per second. Then k = mω₀², with m in kilograms.', 'For the amplitude, work out bt/2m first (kg/s times s divided by kg has no unit), then multiply A₀ by e to the power of minus that number.'],
  solution: `ω₀ = 2π × ${n(f)} ${eq(w, 2)} ${fx(w, 2)} rad/s, so k = mω₀² = ${n(m)} × ${fy(w, 4)}² ≈ ${fx(k, 1)} N/m. Then bt/2m = ${n(b)} × ${n(t)} ÷ (2 × ${n(m)}) = ${n(e)}, so A = ${n(A0)}e^(−${n(e)}) ≈ ${fx(A, 2)} cm.`,
  guidance: [
   { prompt: `What natural angular frequency ω₀ = 2π × ${n(f)} Hz is needed, in rad/s to 2 decimal places?`, answer: [rd(w, 2)], explanation: `ω₀ = 2π × ${n(f)} ${eq(w, 2)} ${fx(w, 2)} rad/s.` },
   { prompt: `What spring constant k = mω₀² gives that ω₀ for the ${n(m)} kg mass, in N/m to 1 decimal place?`, answer: [rd(k, 1)], explanation: `k = ${n(m)} × ${fy(w, 4)}² ≈ ${fx(k, 1)} N/m, using the unrounded ω₀.` },
   { prompt: `What is the amplitude A₀e^(−bt/2m) after ${n(t)} s, in cm to 2 decimal places?`, answer: [rd(A, 2)], explanation: `bt/2m = ${n(e)}, e^(−${n(e)}) ≈ ${fx(Math.exp(-e), 4)}, and ${n(A0)} × ${fx(Math.exp(-e), 4)} ≈ ${fx(A, 2)} cm.` }
  ] }; }
});

/* Pendulum resonance (q05): the natural frequency 1 ÷ T equals the driving frequency f, so T = 1 ÷ f and L = g(T ÷ 2π)²; then the decay rule. */
const F06d = [0.1, 0.125, 0.2, 0.25, 0.4, 0.5, 0.8];
const OK06d = ({ f, m, b, A0, t }) => { const T = 1 / f, L = g * (T / TAU) * (T / TAU), e = b * t / (2 * m), A = A0 * Math.exp(-e);
 return clear(L, 3) && exactAt(e, 2) && A >= 0.5 && clear(A, 2) && b / (2 * m) <= 0.2 * TAU * f; };
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q05', title: 'The hanging sensor bob',
 brief: 'A heavy sensor bob hangs on a long cable and must sway in step with the slow swell of the ground, and then settle once the swell stops.',
 labels: ['cable length (m)', 'amplitude (cm)'], tolerance: 0.0005,
 gl: [['period (s)'], ['cable length (m)'], ['amplitude (cm)']]
}, {
 canonical: { f: 0.25, m: 3, b: 0.6, A0: 12, t: 13 },
 draw: R => retry(() => ({ f: R.pick(F06d), m: R.int(2, 20) / 2, b: R.int(1, 20) / 10, A0: R.int(4, 25), t: R.int(2, 30) }), OK06d, { f: 0.25, m: 3, b: 0.6, A0: 12, t: 13 }),
 build: ({ f, m, b, A0, t }) => { const T = tid(1 / f), L = g * (T / TAU) * (T / TAU), e = tid(b * t / (2 * m)), A = A0 * Math.exp(-e); return {
  prompt: `A ${n(m)} kg sensor bob hangs from a long cable at the quake station and swings like a simple pendulum, with period T = 2π√(L/g), where L is the cable length and g = 9.8 m/s². Ground swell at ${n(f)} Hz drives it, and Mira wants resonance: the bob's natural frequency, 1 ÷ T, must equal ${n(f)} Hz. Enter the cable length L that does this, in metres to 3 decimal places (turn the period rule round: L = g(T ÷ 2π)²). A damper with damping constant b = ${n(b)} kg/s is also fitted. When the swell stops, the bob is pulled ${n(A0)} cm aside and let go, and its amplitude shrinks as A(t) = A₀e^(−bt/2m), the same rule as for a mass on a spring when the damping is light. Enter the amplitude ${n(t)} s after the release, in cm to 2 decimal places.`,
  answer: [rd(L, 3), rd(A, 2)],
  hints: ['At resonance the natural frequency equals the driving frequency, so the period is T = 1 ÷ the frequency in hertz. Then L = g(T ÷ 2π)².', 'For the amplitude, work out bt/2m with m in kilograms, b in kg/s and t in seconds, then multiply A₀ by e to the power of minus that number.'],
  solution: `T = 1 ÷ ${n(f)} = ${n(T)} s, so L = g(T ÷ 2π)² = 9.8 × (${n(T)} ÷ 2π)² ${eq(L, 3)} ${fx(L, 3)} m. Then bt/2m = ${n(b)} × ${n(t)} ÷ (2 × ${n(m)}) = ${n(e)}, so A = ${n(A0)}e^(−${n(e)}) ≈ ${fx(A, 2)} cm.`,
  guidance: [
   { prompt: `What period T = 1 ÷ f matches a driving frequency of ${n(f)} Hz, in seconds?`, answer: [T], explanation: `T = 1 ÷ ${n(f)} = ${n(T)} s.` },
   { prompt: `What cable length L = g(T ÷ 2π)² gives that period, in metres to 3 decimal places?`, answer: [rd(L, 3)], explanation: `L = 9.8 × (${n(T)} ÷ 2π)² ${eq(L, 3)} ${fx(L, 3)} m.` },
   { prompt: `What is the amplitude A₀e^(−bt/2m) after ${n(t)} s, in cm to 2 decimal places?`, answer: [rd(A, 2)], explanation: `bt/2m = ${n(e)}, e^(−${n(e)}) ≈ ${fx(Math.exp(-e), 4)}, and ${n(A0)} × ${fx(Math.exp(-e), 4)} ≈ ${fx(A, 2)} cm.` }
  ] }; }
});

/* ---- q07 Waves: wavelength, frequency and v = fλ [V1 16.1] ---- */

/* f = N ÷ t (q01), v = fλ, then λ₂ = vT₂. Every answer is exact to 2 places. Not the worked example (50 Hz, λ = 0.4 m, 80 Hz). */
const OK07b = ({ N, tt, lam, T2 }) => { const f = N / tt, v = f * lam; return exactAt(f, 2) && exactAt(v, 2) && exactAt(v * T2, 2) && v * T2 !== lam && !(f === 50 && lam === 0.4); };
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'Ripples on the balloon tether',
 brief: 'The weather balloon tether ripples in the wind, and the log needs the speed of the ripples and their length if the wind were different.',
 labels: ['ripple speed (m/s)', 'new wavelength (m)'], tolerance: 0.005,
 gl: [['frequency (Hz)'], ['ripple speed (m/s)'], ['new wavelength (m)']]
}, {
 canonical: { N: 18, tt: 30, lam: 1.5, T2: 0.8 },
 draw: R => retry(() => ({ N: R.int(6, 60), tt: R.pick([10, 20, 25, 30, 40, 50]), lam: R.int(5, 40) / 10, T2: R.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.8, 1.2, 1.5, 2, 2.5]) }), OK07b, { N: 18, tt: 30, lam: 1.5, T2: 0.8 }),
 build: ({ N, tt, lam, T2 }) => { const f = tid(N / tt), v = tid(f * lam), l2 = tid(v * T2); return {
  prompt: `A sensor clipped to the weather balloon tether bobs up and down ${n(N)} times in ${n(tt)} s as ripples run past it, and neighbouring crests of the ripples are ${n(lam)} m apart. Enter the speed of the ripples along the tether, in m/s. Later the wind changes so that the ripples arrive one every ${n(T2)} s; the tether carries every ripple at the same speed. Enter the new wavelength in metres. Both answers are exact to 2 decimal places.`,
  answer: [v, l2],
  hints: ['The frequency is the number of bobs divided by the time they take, in hertz. Then the speed is v = fλ.', 'The frequency is 1 ÷ the period, and the speed stays fixed, so the new wavelength is the speed times the new period.'],
  solution: `The sensor bobs ${n(N)} ÷ ${n(tt)} = ${n(f)} times a second, so f = ${n(f)} Hz and v = fλ = ${n(f)} × ${n(lam)} = ${n(v)} m/s. One ripple every ${n(T2)} s means f = 1 ÷ ${n(T2)} Hz, and with the speed unchanged λ = v ÷ f = v × T = ${n(v)} × ${n(T2)} = ${n(l2)} m.`,
  guidance: [
   { prompt: `The sensor bobs ${n(N)} times in ${n(tt)} s. What is the frequency of the ripples, in hertz?`, answer: [f], explanation: `${n(N)} ÷ ${n(tt)} = ${n(f)} Hz.` },
   { prompt: `What is the ripple speed v = fλ for f = ${n(f)} Hz and λ = ${n(lam)} m, in m/s?`, answer: [v], explanation: `v = ${n(f)} × ${n(lam)} = ${n(v)} m/s.` },
   { prompt: `One ripple now arrives every ${n(T2)} s and the speed stays ${n(v)} m/s. What is the new wavelength, in metres?`, answer: [l2], explanation: `In one period the wave moves one wavelength, so λ = v × T = ${n(v)} × ${n(T2)} = ${n(l2)} m.` }
  ] }; }
});

/* v = L ÷ t, λ = v ÷ f, and the number of wavelengths along the cable, L ÷ λ = f × t. */
const OK07c = ({ L, t, f }) => { const v = L / t, lam = v / f, c = L / lam; return clear(v, 2) && clear(lam, 2) && rd(rd(v, 2) / f, 2) === rd(lam, 2) && exactAt(c, 1) && c >= 2 && c <= 60; };
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'A pulse timed up the mast',
 brief: 'A single pulse timed up the full length of the mast cable tells Mira the wave speed, and she wants to know how many waves a steady shaker packs in.',
 labels: ['wavelength (m)', 'wavelengths on the cable'], tolerance: 0.005,
 gl: [['wave speed (m/s)'], ['wavelength (m)'], ['wavelengths on the cable']]
}, {
 canonical: { L: 45, t: 1.5, f: 4 },
 draw: R => retry(() => ({ L: 5 * R.int(4, 30), t: R.int(5, 40) / 10, f: R.int(3, 24) / 2 }), OK07c, { L: 45, t: 1.5, f: 4 }),
 build: ({ L, t, f }) => { const v = L / t, lam = v / f, c = tid(f * t); return {
  prompt: `Mira flicks the foot of the main mast cable and a single pulse takes ${n(t)} s to run its whole ${n(L)} m length to the top. Every wave on this cable travels at the speed of that pulse. She then shakes the foot steadily at ${n(f)} Hz. Enter the wavelength of the steady wave, in metres to 2 decimal places. Then enter how many wavelengths fit along the ${n(L)} m of cable, to 1 decimal place, working from the unrounded wavelength.`,
  answer: [rd(lam, 2), c],
  hints: ['The pulse covers the whole length in the time given, so the wave speed is the distance divided by the time. Then λ = v ÷ f.', 'The number of wavelengths along the cable is the length divided by one wavelength.'],
  solution: `The speed is v = ${n(L)} ÷ ${n(t)} ${eq(v, 2)} ${fx(v, 2)} m/s. At ${n(f)} Hz the wavelength is λ = v ÷ f ${eq(lam, 2)} ${fx(lam, 2)} m. The cable holds ${n(L)} ÷ λ = ${n(c)} wavelengths.`,
  guidance: [
   { prompt: `The pulse covers ${n(L)} m in ${n(t)} s. What is the wave speed, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `v = ${n(L)} ÷ ${n(t)} ${eq(v, 2)} ${fx(v, 2)} m/s.` },
   { prompt: `What is the wavelength λ = v ÷ f at ${n(f)} Hz, in metres to 2 decimal places?`, answer: [rd(lam, 2)], explanation: `λ = ${n(tid(v))} ÷ ${n(f)} ${eq(lam, 2)} ${fx(lam, 2)} m.` },
   { prompt: `How many wavelengths fit along ${n(L)} m of cable, to 1 decimal place?`, answer: [c], explanation: `${n(L)} ÷ λ = ${n(c)}, working from the unrounded wavelength.` }
  ] }; }
});

/* Spring shaker (q02): ω = √(k/m), f = ω ÷ 2π, then λ = v ÷ f. λ from the rounded f rounds the same. */
const OK07d = ({ m, k, v }) => { const w = Math.sqrt(k / m), f = w / TAU, lam = v / f;
 return clear(w, 3) && clear(f, 3) && clear(lam, 3) && rd(v / rd(f, 3), 3) === rd(lam, 3) && f >= 0.3 && f <= 8 && !(m === 2 && k === 50); };
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q02', title: 'The spring-driven shaker',
 brief: 'A mass on a spring is bolted to the foot of a cable as a shaker, and its swing sets the waves that run up the cable.',
 labels: ['frequency (Hz)', 'wavelength (m)'], tolerance: 0.0005,
 gl: [['angular frequency (rad/s)'], ['frequency (Hz)'], ['wavelength (m)']]
}, {
 canonical: { m: 2.5, k: 340, v: 15 },
 draw: R => retry(() => ({ m: R.int(1, 20) / 2, k: 10 * R.int(2, 80), v: 5 * R.int(2, 24) }), OK07d, { m: 2.5, k: 340, v: 15 }),
 build: ({ m, k, v }) => { const w = Math.sqrt(k / m), f = w / TAU, lam = v / f; return {
  prompt: `A shaker at the foot of a mast cable is a ${n(m)} kg mass on a spring with k = ${n(k)} N/m, bolted to the cable so that the cable follows the mass as it swings. The mass swings at its natural angular frequency ω = √(k/m) in rad/s, which is a frequency f = ω ÷ 2π in hertz. Every wave on the cable travels at ${n(v)} m/s. Enter the frequency of the waves the shaker sends up, in hertz to 3 decimal places. Then enter their wavelength in metres to 3 decimal places, working from the unrounded frequency.`,
  answer: [rd(f, 3), rd(lam, 3)],
  hints: ['Find ω = √(k/m) in radians per second first, then divide by 2π to turn it into hertz.', 'The cable carries every wave at the same speed, so the wavelength is the speed divided by the frequency: λ = v ÷ f.'],
  solution: `ω = √(${n(k)} ÷ ${n(m)}) ${eq(w, 3)} ${fx(w, 3)} rad/s, so f = ω ÷ 2π ${eq(f, 3)} ${fx(f, 3)} Hz. Then λ = v ÷ f = ${n(v)} ÷ ${fy(f, 4)} ${eq(lam, 3)} ${fx(lam, 3)} m.`,
  guidance: [
   { prompt: `What is ω = √(k/m) for the shaker, in rad/s to 3 decimal places?`, answer: [rd(w, 3)], explanation: `ω = √(${n(k)} ÷ ${n(m)}) ${eq(w, 3)} ${fx(w, 3)} rad/s.` },
   { prompt: `What is the frequency f = ω ÷ 2π, in hertz to 3 decimal places?`, answer: [rd(f, 3)], explanation: `f = ${fy(w, 4)} ÷ 2π ${eq(f, 3)} ${fx(f, 3)} Hz.` },
   { prompt: `What is the wavelength λ = v ÷ f at ${n(v)} m/s, in metres to 3 decimal places?`, answer: [rd(lam, 3)], explanation: `λ = ${n(v)} ÷ ${fy(f, 4)} ${eq(lam, 3)} ${fx(lam, 3)} m.` }
  ] }; }
});

/* ---- q08 The wave function y = A sin(kx − ωt) [V1 16.2] ---- */

/* The wave function read backwards: λ = 2π ÷ k, f = ω ÷ 2π, v = ω ÷ k. Not the worked example (λ = 2 m, f = 1 Hz). */
const OK08b = ({ k, w }) => clear(TAU / k, 2) && clear(w / TAU, 2) && clear(w / k, 2) && !(k === Math.PI && w === TAU);
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'Reading the hoist-rope fit',
 brief: 'A fit to the strain record on the mast hoist rope gives only the numbers inside the sine, and Mira wants the length, rate and speed of the wave they describe.',
 labels: ['wavelength (m)', 'frequency (Hz)', 'wave speed (m/s)'], tolerance: 0.005,
 gl: [['wavelength (m)'], ['frequency (Hz)'], ['wave speed (m/s)']]
}, {
 canonical: { k: 4.5, w: 27 },
 draw: R => retry(() => ({ k: R.int(10, 80) / 10, w: R.int(20, 200) / 10 }), OK08b, { k: 4.5, w: 27 }),
 build: ({ k, w }) => { const lam = TAU / k, f = w / TAU, v = w / k; return {
  prompt: `The strain record along the mast hoist rope is fitted by y(x, t) = A sin(kx − ωt), a wave running in the +x direction, where A is the amplitude, x is in metres and t in seconds. The fit gives a wave number k = ${n(k)} rad/m and an angular frequency ω = ${n(w)} rad/s. Enter the wavelength λ in metres, the frequency f in hertz and the wave speed in m/s, each to 2 decimal places, using k = 2π/λ, ω = 2πf and v = ω/k.`,
  answer: [rd(lam, 2), rd(f, 2), rd(v, 2)],
  hints: ['Turn the rules for k and ω round: λ = 2π ÷ k and f = ω ÷ 2π.', 'The speed is v = ω ÷ k, which is the same as fλ. Work from k and ω directly to avoid carrying a rounding slip.'],
  solution: `λ = 2π ÷ ${n(k)} ${eq(lam, 2)} ${fx(lam, 2)} m and f = ${n(w)} ÷ 2π ${eq(f, 2)} ${fx(f, 2)} Hz. The speed is v = ω ÷ k = ${n(w)} ÷ ${n(k)} ${eq(v, 2)} ${fx(v, 2)} m/s.`,
  guidance: [
   { prompt: `What wavelength λ = 2π ÷ k goes with k = ${n(k)} rad/m, in metres to 2 decimal places?`, answer: [rd(lam, 2)], explanation: `λ = 2π ÷ ${n(k)} ${eq(lam, 2)} ${fx(lam, 2)} m.` },
   { prompt: `What frequency f = ω ÷ 2π goes with ω = ${n(w)} rad/s, in hertz to 2 decimal places?`, answer: [rd(f, 2)], explanation: `f = ${n(w)} ÷ 2π ${eq(f, 2)} ${fx(f, 2)} Hz.` },
   { prompt: `What is the wave speed v = ω ÷ k, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `v = ${n(w)} ÷ ${n(k)} ${eq(v, 2)} ${fx(v, 2)} m/s.` }
  ] }; }
});

/* Two gauges read the same wave at one instant: the phase kx − ωt at the first, then both displacements. y from the rounded phase rounds the same. */
const wave08 = ({ A, lam, f, x1, dx, t }) => { const k = TAU / lam, w = TAU * f, a1 = k * x1 - w * t, a2 = k * (x1 + dx) - w * t; return { k, w, a1, a2, y1: A * Math.sin(a1), y2: A * Math.sin(a2) }; };
const OK08c = p => { const { a1, a2, y1, y2 } = wave08(p), y1r = p.A * Math.sin(rd(a1, 3)), y2r = p.A * Math.sin(rd(a2, 3));
 return Math.abs(a1) <= 40 && Math.abs(a2) <= 40 && clear(a1, 3) && clear(y1, 2) && clear(y2, 2) && rd(y1r, 2) === rd(y1, 2) && rd(y2r, 2) === rd(y2, 2) && Math.abs(y1) >= 0.1 && Math.abs(y2) >= 0.1 && rd(y1, 2) !== rd(y2, 2) && !(p.A === 5 && p.lam === 2 && p.f === 1); };
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Two gauges on one cable',
 brief: 'Two strain gauges sit a short way apart on the same cable, and Mira wants to know whether they will read the same at one instant.',
 labels: ['gauge A reading (cm)', 'gauge B reading (cm)'], tolerance: 0.0005,
 gl: [['phase at gauge A (rad)'], ['gauge A reading (cm)'], ['gauge B reading (cm)']]
}, {
 canonical: { A: 3, lam: 2.4, f: 1.5, x1: 0.6, dx: 0.5, t: 0.4 },
 draw: R => retry(() => ({ A: R.int(2, 12), lam: R.int(4, 40) / 10, f: R.int(2, 20) / 2, x1: R.int(1, 30) / 10, dx: R.int(1, 20) / 10, t: R.int(1, 20) / 10 }), OK08c, { A: 3, lam: 2.4, f: 1.5, x1: 0.6, dx: 0.5, t: 0.4 }),
 build: p => { const { A, lam, f, x1, dx, t } = p, x2 = tid(x1 + dx), { k, w, a1, a2, y1, y2 } = wave08(p); return {
  prompt: `A wave runs up a cable in the +x direction with y(x, t) = A sin(kx − ωt), where k = 2π/λ and ω = 2πf, x is in metres and t in seconds; y is the sideways displacement, and a negative y means the cable is on the other side of its rest position. The amplitude is A = ${n(A)} cm, the wavelength ${n(lam)} m and the frequency ${n(f)} Hz. Gauge A sits at x = ${n(x1)} m and gauge B at x = ${n(x2)} m. Take the phase kx − ωt of each gauge at t = ${n(t)} s. Enter the reading y of gauge A and then the reading y of gauge B at that instant, each in cm to 2 decimal places.`,
  answer: [rd(y1, 2), rd(y2, 2)],
  hints: ['Find k = 2π/λ and ω = 2πf, then put x and t into kx − ωt. The phase is in radians and may be negative.', 'For each gauge take the sine of its own phase with the calculator in radian mode and multiply by A. Only x differs between the gauges.'],
  solution: `k = 2π ÷ ${n(lam)} ≈ ${fy(k, 4)} rad/m and ω = 2π × ${n(f)} ≈ ${fy(w, 4)} rad/s. At gauge A, kx − ωt ≈ ${fy(k, 4)} × ${n(x1)} − ${fy(w, 4)} × ${n(t)} ≈ ${fx(a1, 3)} rad, so y = ${n(A)} sin(${fx(a1, 3)}) ≈ ${fx(y1, 2)} cm. At gauge B the phase is ${fy(k, 4)} × ${n(x2)} − ${fy(w, 4)} × ${n(t)} ≈ ${fx(a2, 3)} rad, so y = ${n(A)} sin(${fx(a2, 3)}) ≈ ${fx(y2, 2)} cm.`,
  guidance: [
   { prompt: `What is the phase kx − ωt at gauge A (x = ${n(x1)} m) at t = ${n(t)} s, in radians to 3 decimal places?`, answer: [rd(a1, 3)], explanation: `k = 2π ÷ ${n(lam)} ≈ ${fy(k, 4)} and ω = 2π × ${n(f)} ≈ ${fy(w, 4)}, so the phase is about ${fx(a1, 3)} rad.` },
   { prompt: `What is gauge A's reading y = ${n(A)} sin(phase), in cm to 2 decimal places?`, answer: [rd(y1, 2)], explanation: `sin(${fx(a1, 3)}) ≈ ${fx(Math.sin(a1), 4)}, and ${n(A)} times that is about ${fx(y1, 2)} cm.` },
   { prompt: `What is gauge B's reading at x = ${n(x2)} m at the same instant, in cm to 2 decimal places?`, answer: [rd(y2, 2)], explanation: `The phase there is about ${fx(a2, 3)} rad, its sine is about ${fx(Math.sin(a2), 4)}, and ${n(A)} times that is about ${fx(y2, 2)} cm.` }
  ] }; }
});

/* Challenge with q03: a point of the cable moves as a sine in t, so its greatest speed is Aω (q03). ω = 2πv ÷ λ, k = 2π ÷ λ. */
const wave08d = ({ A, lam, v, x, t }) => { const k = TAU / lam, w = TAU * v / lam, ang = k * x - w * t; return { k, w, ang, vm: A * w, y: A * Math.sin(ang) }; };
const OK08d = p => { const { k, w, ang, vm, y } = wave08d(p), y2 = p.A * Math.sin(rd(k, 3) * p.x - rd(w, 3) * p.t);
 return Math.abs(ang) <= 40 && clear(w, 3) && clear(k, 3) && clear(vm, 2) && vm < 990 && clear(y, 2) && rd(y2, 2) === rd(y, 2) && Math.abs(y) >= 0.1 && w <= 80; };
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q03', title: 'How fast a cable point moves',
 brief: 'A cable that carries a wave also shakes each of its own points, and Mira must know how fast a point moves at its quickest.',
 labels: ['angular frequency (rad/s)', 'greatest sideways speed (mm/s)', 'displacement (mm)'], tolerance: 0.0005,
 gl: [['angular frequency (rad/s)'], ['greatest sideways speed (mm/s)'], ['displacement (mm)']]
}, {
 canonical: { A: 6, lam: 2.4, v: 10, x: 0.7, t: 0.2 },
 draw: R => retry(() => ({ A: R.int(2, 15), lam: R.int(5, 40) / 10, v: R.int(4, 30), x: R.int(1, 30) / 10, t: R.int(1, 20) / 10 }), OK08d, { A: 6, lam: 2.4, v: 10, x: 0.7, t: 0.2 }),
 build: p => { const { A, lam, v, x, t } = p, { k, w, ang, vm, y } = wave08d(p); return {
  prompt: `A wave runs up a cable in the +x direction with y(x, t) = A sin(kx − ωt), where k = 2π/λ and ω = 2πf, x is in metres, t in seconds and y in millimetres. The amplitude is A = ${n(A)} mm, the wavelength is ${n(lam)} m and the wave travels at ${n(v)} m/s. First find the frequency from the speed, using v = fλ, and enter the angular frequency ω in rad/s to 3 decimal places. Each point of the cable moves up and down as a sine in time with amplitude A, so, as for any simple harmonic motion with amplitude A and angular frequency ω, its greatest speed is Aω: enter that greatest sideways speed in mm/s to 2 decimal places. Then enter the displacement y of the point x = ${n(x)} m at t = ${n(t)} s, in mm to 2 decimal places.`,
  answer: [rd(w, 3), rd(vm, 2), rd(y, 2)],
  hints: ['The frequency is f = v ÷ λ, and ω = 2πf. Use ω unrounded in the next steps.', 'The greatest sideways speed of a point is Aω, with A in millimetres so the speed is in mm/s. For y use k = 2π/λ, then take the sine of kx − ωt in radian mode.'],
  solution: `f = v ÷ λ = ${n(v)} ÷ ${n(lam)} Hz, so ω = 2πf = 2π × ${n(v)} ÷ ${n(lam)} ${eq(w, 3)} ${fx(w, 3)} rad/s. The greatest sideways speed is Aω = ${n(A)} × ${fy(w, 4)} ≈ ${fx(vm, 2)} mm/s. With k = 2π ÷ ${n(lam)} ≈ ${fy(k, 4)} rad/m, kx − ωt ≈ ${fy(k, 4)} × ${n(x)} − ${fy(w, 4)} × ${n(t)} ≈ ${fy(ang, 4)} rad, and y = ${n(A)} sin(${fy(ang, 4)}) ≈ ${fx(y, 2)} mm.`,
  guidance: [
   { prompt: `What is the angular frequency ω = 2πf for f = v ÷ λ = ${n(v)} ÷ ${n(lam)} Hz, in rad/s to 3 decimal places?`, answer: [rd(w, 3)], explanation: `ω = 2π × ${n(v)} ÷ ${n(lam)} ${eq(w, 3)} ${fx(w, 3)} rad/s.` },
   { prompt: `What is the greatest sideways speed Aω of a point of the cable, in mm/s to 2 decimal places?`, answer: [rd(vm, 2)], explanation: `${n(A)} × ${fy(w, 4)} ≈ ${fx(vm, 2)} mm/s.` },
   { prompt: `What is y = ${n(A)} sin(kx − ωt) at x = ${n(x)} m and t = ${n(t)} s, in mm to 2 decimal places?`, answer: [rd(y, 2)], explanation: `kx − ωt ≈ ${fy(ang, 4)} rad, its sine is about ${fx(Math.sin(ang), 4)}, and ${n(A)} times that is about ${fx(y, 2)} mm.` }
  ] }; }
});

/* ---- q09 Wave speed on a stretched cable, v = √(T/μ) [V1 16.3] ---- */

/* A hanging weight H gives the tension 9.8H; v = √(F/μ); then the weight for another speed, H₂ = μv₂² ÷ 9.8. Not the worked example (μ = 0.01, 64 N). */
const OK09b = ({ mu, L, H, v2 }) => { const F = g * H, v = Math.sqrt(F / mu), H2 = mu * v2 * v2 / g;
 return exactAt(F, 2) && clear(v, 2) && clear(H2, 2) && H2 >= 0.5 && H2 <= 200 && Math.abs(v - v2) > 4 && !(mu === 0.01 && F === 64); };
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The weighted antenna wire',
 brief: 'An antenna wire at the rover pad is held taut by a weight hanging over a pulley, and Mira wants to pick the weight that gives a chosen wave speed.',
 labels: ['wave speed (m/s)', 'hanging mass (kg)'], tolerance: 0.005,
 gl: [['tension (N)'], ['wave speed (m/s)'], ['hanging mass (kg)']]
}, {
 canonical: { mu: 0.025, L: 16, H: 5, v2: 60 },
 draw: R => retry(() => ({ mu: R.int(4, 60) / 1000, L: R.int(5, 40), H: R.int(2, 40) / 2, v2: 5 * R.int(3, 24) }), OK09b, { mu: 0.025, L: 16, H: 5, v2: 60 }),
 build: ({ mu, L, H, v2 }) => { const M = tid(mu * L), F = tid(g * H), v = Math.sqrt(F / mu), H2 = mu * v2 * v2 / g; return {
  prompt: `An antenna wire at the rover pad is ${n(L)} m long with a mass of ${n(M)} kg. One end is fixed and the other runs over a pulley and carries a hanging mass of ${n(H)} kg, so the tension in the wire is the weight of that mass, mg with g = 9.8 m/s². Enter the speed of a pulse along the wire, in m/s to 2 decimal places. Then enter the hanging mass, in kg to 2 decimal places, that would make pulses travel at ${n(v2)} m/s.`,
  answer: [rd(v, 2), rd(H2, 2)],
  hints: ['Find the linear mass density μ = mass ÷ length, and the tension as the weight of the hanging mass, F = mg in newtons. Then v = √(F/μ).', 'For a chosen speed, F = μv². The tension is the weight of the hanging mass, so divide that tension by g to get the mass.'],
  solution: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m and the tension is F = ${n(H)} × 9.8 = ${n(F)} N, so v = √(F/μ) = √(${n(F)} ÷ ${n(mu)}) ${eq(v, 2)} ${fx(v, 2)} m/s. For ${n(v2)} m/s the tension must be μv² = ${n(mu)} × ${n(v2 * v2)} = ${n(tid(mu * v2 * v2))} N, which is the weight of a mass of ${n(tid(mu * v2 * v2))} ÷ 9.8 ${eq(H2, 2)} ${fx(H2, 2)} kg.`,
  guidance: [
   { prompt: `What is the tension in the wire, the weight F = mg of the ${n(H)} kg mass, in newtons?`, answer: [F], explanation: `F = ${n(H)} × 9.8 = ${n(F)} N.` },
   { prompt: `What is the pulse speed v = √(F/μ) with μ = ${n(mu)} kg/m, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${n(F)} ÷ ${n(mu)} = ${n(tid(F / mu))}, and its square root is ${eq(v, 2)} ${fx(v, 2)} m/s.` },
   { prompt: `What hanging mass has a weight equal to the tension μv² for v = ${n(v2)} m/s, in kg to 2 decimal places?`, answer: [rd(H2, 2)], explanation: `μv² = ${n(mu)} × ${n(v2)}² = ${n(tid(mu * v2 * v2))} N, and ${n(tid(mu * v2 * v2))} ÷ 9.8 ${eq(H2, 2)} ${fx(H2, 2)} kg.` }
  ] }; }
});

/* An echo: the pulse goes up and back (2L) in t, so v = 2L ÷ t; μ = M ÷ L; the tension is μv². Tension to 1 place, also from the rounded speed. */
const OK09c = ({ mu, L, t }) => { const v = 2 * L / t, F = mu * v * v;
 return clear(v, 2) && clear(F, 1) && rd(mu * rd(v, 2) * rd(v, 2), 1) === rd(F, 1) && F >= 5 && F < 1000 && !(mu === 0.01 && L === 50); };
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'An echo from the mast top',
 brief: 'Mira has no tension gauge on the long cable, but she can time an echo, and that is enough to find how hard the cable is pulled.',
 labels: ['wave speed (m/s)', 'tension (N)'], tolerance: 0.0005,
 gl: [['wave speed (m/s)'], ['linear mass density (kg/m)'], ['tension (N)']]
}, {
 canonical: { mu: 0.04, L: 30, t: 0.8 },
 draw: R => retry(() => ({ mu: R.int(4, 80) / 1000, L: 5 * R.int(3, 30), t: R.int(3, 40) / 10 }), OK09c, { mu: 0.04, L: 30, t: 0.8 }),
 build: ({ mu, L, t }) => { const M = tid(mu * L), v = 2 * L / t, F = mu * v * v; return {
  prompt: `A guy cable on the mast is ${n(L)} m long and has a mass of ${n(M)} kg. Mira flicks its foot, and the pulse runs up to the top, reflects there and returns to her hand after ${n(t)} s in all, travelling at one steady speed. Enter the wave speed in m/s to 2 decimal places. Then enter the tension in the cable, in newtons to 1 decimal place, working from the unrounded speed.`,
  answer: [rd(v, 2), rd(F, 1)],
  hints: ['The pulse runs the length of the cable twice, up and back, in the time given. The speed is that total distance divided by the time.', 'Find the linear mass density μ = mass ÷ length. Then square both sides of v = √(F_T/μ) to get the tension F_T = μv².'],
  solution: `The pulse travels 2 × ${n(L)} = ${n(2 * L)} m in ${n(t)} s, so v = ${n(2 * L)} ÷ ${n(t)} ${eq(v, 2)} ${fx(v, 2)} m/s. The linear mass density is μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m, so F_T = μv² = ${n(mu)} × ${fy(v, 4)}² ≈ ${fx(F, 1)} N.`,
  guidance: [
   { prompt: `The pulse travels up and back, ${n(2 * L)} m in all, in ${n(t)} s. What is the wave speed, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `v = ${n(2 * L)} ÷ ${n(t)} ${eq(v, 2)} ${fx(v, 2)} m/s.` },
   { prompt: `What is the linear mass density of ${n(M)} kg spread along ${n(L)} m, in kg/m?`, answer: [mu], explanation: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m.` },
   { prompt: `What tension F_T = μv² goes with this speed, in newtons to 1 decimal place?`, answer: [rd(F, 1)], explanation: `F_T = ${n(mu)} × ${fy(v, 4)}² ≈ ${fx(F, 1)} N.` }
  ] }; }
});

/* Challenge with q07: v = √(F/μ), λ = v ÷ f, then the tension for a different wavelength at the same f: F₂ = μ(fλ₂)². */
const OK09d = ({ mu, L, F, f, lam2 }) => { const v = Math.sqrt(F / mu), lam = v / f, F2 = mu * f * lam2 * (f * lam2);
 return clear(v, 2) && clear(lam, 3) && rd(rd(v, 2) / f, 3) === rd(lam, 3) && clear(F2, 2) && F2 < 900 && Math.abs(lam - lam2) > 0.2 && !(mu === 0.01 && F === 64); };
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q07', title: 'Tuning the wavelength by tension',
 brief: 'A shaker runs at one fixed rate while Mira turns the tension, and she wants a particular wavelength on the cable.',
 labels: ['wavelength (m)', 'new tension (N)'], tolerance: 0.0005,
 gl: [['wave speed (m/s)'], ['wavelength (m)'], ['new tension (N)']]
}, {
 canonical: { mu: 0.02, L: 25, F: 120, f: 6, lam2: 1.5 },
 draw: R => retry(() => ({ mu: R.int(4, 60) / 1000, L: R.int(5, 40), F: 10 * R.int(5, 60), f: R.int(3, 30) / 2, lam2: R.int(3, 60) / 10 }), OK09d, { mu: 0.02, L: 25, F: 120, f: 6, lam2: 1.5 }),
 build: ({ mu, L, F, f, lam2 }) => { const M = tid(mu * L), v = Math.sqrt(F / mu), lam = v / f, F2u = mu * f * lam2 * (f * lam2), F2 = rd(F2u, 2); return {
  prompt: `A cable ${n(L)} m long with a mass of ${n(M)} kg is pulled with a tension of ${n(F)} N, and a shaker at its foot runs at ${n(f)} Hz. Enter the wavelength of the waves on the cable, in metres to 3 decimal places, working from the unrounded speed. Then Mira changes the tension but leaves the shaker at ${n(f)} Hz, and wants the wavelength to be ${n(lam2)} m. Enter the tension that gives this, in newtons to 2 decimal places.`,
  answer: [rd(lam, 3), F2],
  hints: ['Find μ = mass ÷ length and the speed v = √(F_T/μ); then the wavelength is λ = v ÷ f, since v = fλ.', 'With the frequency fixed, the wanted wavelength fixes the speed through v = fλ. Then the tension is F_T = μv².'],
  solution: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m, so v = √(${n(F)} ÷ ${n(mu)}) ${eq(v, 2)} ${fx(v, 2)} m/s and λ = v ÷ f = ${fy(v, 4)} ÷ ${n(f)} ${eq(lam, 3)} ${fx(lam, 3)} m. For λ = ${n(lam2)} m at ${n(f)} Hz the speed must be fλ = ${n(f)} × ${n(lam2)} = ${n(tid(f * lam2))} m/s, so F_T = μv² = ${n(mu)} × ${n(tid(f * lam2))}² ${eq(F2u, 2)} ${fx(F2, 2)} N.`,
  guidance: [
   { prompt: `What is the wave speed v = √(F_T/μ) for μ = ${n(mu)} kg/m and F_T = ${n(F)} N, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${n(F)} ÷ ${n(mu)} = ${n(tid(F / mu))}, and its square root is ${eq(v, 2)} ${fx(v, 2)} m/s.` },
   { prompt: `What is the wavelength λ = v ÷ f at ${n(f)} Hz, in metres to 3 decimal places?`, answer: [rd(lam, 3)], explanation: `λ = ${fy(v, 4)} ÷ ${n(f)} ${eq(lam, 3)} ${fx(lam, 3)} m.` },
   { prompt: `What tension F_T = μ(fλ)² gives a wavelength of ${n(lam2)} m at ${n(f)} Hz, in newtons to 2 decimal places?`, answer: [F2], explanation: `fλ = ${n(tid(f * lam2))} m/s, and F_T = ${n(mu)} × ${n(tid(f * lam2))}² ${eq(F2u, 2)} ${fx(F2, 2)} N.` }
  ] }; }
});

/* ---- q10 Power of a wave and the inverse-square law [V1 16.4] ---- */

/* A point source: P = 4πr₁²I₁, then I₂ = P ÷ (4πr₂²). The meter's area and power are asked to 1 place; P stays below 1000 W. Not the worked example (2 W/m² at 3 m). */
const OK10b = ({ I1, r1, r2 }) => { const a = 4 * Math.PI * r1 * r1, P = a * I1, I2 = P / (4 * Math.PI * r2 * r2);
 return clear(a, 1) && clear(P, 1) && rd(rd(a, 1) * I1, 1) === rd(P, 1) && P >= 5 && P < 1000 && clear(I2, 3) && I2 >= 0.005 && r1 !== r2 && !(I1 === 2 && r1 === 3); };
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The ridge radio beacon',
 brief: 'The ridge beacon sends its signal out in every direction, and Mira wants its total power and what a receiver would pick up elsewhere.',
 labels: ['beacon power (W)', 'intensity (W/m²)'], tolerance: 0.0005,
 gl: [['sphere area (m²)'], ['beacon power (W)'], ['intensity (W/m²)']]
}, {
 canonical: { I1: 0.18, r1: 15, r2: 52 },
 draw: R => retry(() => ({ I1: R.int(2, 60) / 100, r1: R.int(3, 30), r2: R.int(3, 60) }), OK10b, { I1: 0.18, r1: 15, r2: 52 }),
 build: ({ I1, r1, r2 }) => { const a = 4 * Math.PI * r1 * r1, P = a * I1, a2 = 4 * Math.PI * r2 * r2, I2 = P / a2; return {
  prompt: `The beacon on the ridge sends its signal out evenly in all directions, and nothing absorbs or blocks it, so at a distance r its power P is spread over a sphere of area 4πr². A receiver ${n(r1)} m from the beacon measures an intensity of ${n(I1)} W/m². Enter the total power of the beacon, in watts to 1 decimal place, using the unrounded sphere area. Then enter the intensity a receiver would measure ${n(r2)} m from the beacon, in W/m² to 3 decimal places.`,
  answer: [rd(P, 1), rd(I2, 3)],
  hints: ['The intensity is the power per square metre, I = P ÷ 4πr², so the power is the intensity times the area of the sphere at that distance.', 'The same power now covers a sphere of area 4πr² with the new r, so divide the power by that area. Or scale the first intensity by (r₁ ÷ r₂)².'],
  solution: `At ${n(r1)} m the sphere has area 4π × ${n(r1)}² ${eq(a, 1)} ${fx(a, 1)} m², so P = I × area = ${n(I1)} × ${fx(a, 3)} ≈ ${fx(P, 1)} W. At ${n(r2)} m the area is 4π × ${n(r2)}² ≈ ${fx(a2, 1)} m², so I = P ÷ area = ${fx(P, 3)} ÷ ${fx(a2, 3)} ${eq(I2, 3)} ${fx(I2, 3)} W/m².`,
  guidance: [
   { prompt: `What is the area 4πr² of the sphere through the receiver at ${n(r1)} m, in m² to 1 decimal place?`, answer: [rd(a, 1)], explanation: `4π × ${n(r1)}² ${eq(a, 1)} ${fx(a, 1)} m².` },
   { prompt: `What is the beacon's power P = I × area, in watts to 1 decimal place?`, answer: [rd(P, 1)], explanation: `P = ${n(I1)} × ${fx(a, 3)} ≈ ${fx(P, 1)} W.` },
   { prompt: `What is the intensity ${n(r2)} m from the beacon, in W/m² to 3 decimal places?`, answer: [rd(I2, 3)], explanation: `The area there is 4π × ${n(r2)}² ≈ ${fx(a2, 1)} m², so I = ${fx(P, 3)} ÷ ${fx(a2, 3)} ${eq(I2, 3)} ${fx(I2, 3)} W/m².` }
  ] }; }
});

/* P = ½μA²ω²v in watts (ω = 2πf, A in metres), and the time to carry E joules, t = E ÷ P (power is energy per second). */
const power = ({ mu, A, f, v }) => { const w = TAU * f; return { w, P: 0.5 * mu * (A / 100) * (A / 100) * w * w * v }; };
const OK10c = p => { const { w, P } = power(p), t = p.E / P;
 return clear(w, 3) && clear(P, 2) && P >= 0.1 && P < 500 && clear(t, 2) && rd(p.E / rd(P, 2), 2) === rd(t, 2) && t >= 0.5 && t < 900 && !(p.mu === 0.1 && p.f === 10); };
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Energy for the relay',
 brief: 'A relay at the top of the mast runs on the energy the cable wave delivers, and Mira needs to know how long a charge will take.',
 labels: ['power (W)', 'time (s)'], tolerance: 0.0005,
 gl: [['angular frequency (rad/s)'], ['power (W)'], ['time (s)']]
}, {
 canonical: { mu: 0.12, A: 4, f: 6, v: 25, E: 7 },
 draw: R => retry(() => ({ mu: R.int(2, 20) / 100, A: R.int(2, 8), f: R.int(2, 20), v: 5 * R.int(4, 20), E: R.int(1, 40) }), OK10c, { mu: 0.12, A: 4, f: 6, v: 25, E: 7 }),
 build: p => { const { mu, A, f, v, E } = p, { w, P } = power(p), Am = tid(A / 100), t = E / P; return {
  prompt: `A relay at the top of the mast cable is charged by the waves that arrive there. The cable has linear mass density ${n(mu)} kg/m and carries waves at ${n(v)} m/s, and Mira drives it at ${n(f)} Hz with amplitude ${n(A)} cm. Enter the average power the wave carries, in watts to 2 decimal places, from P = ½μA²ω²v with ω = 2πf in rad/s and A in metres. A full charge needs ${n(E)} J of energy, and power is energy per second, so the time is the energy divided by the power. Assuming the relay takes all the wave's energy, enter the time for a full charge in seconds to 2 decimal places, working from the unrounded power.`,
  answer: [rd(P, 2), rd(t, 2)],
  hints: ['Change the amplitude to metres (divide by 100) and find ω = 2πf before you put the numbers into P = ½μA²ω²v.', 'A power of P watts delivers P joules every second, so the time for E joules is E ÷ P, in seconds.'],
  solution: `A = ${n(A)} cm = ${n(Am)} m and ω = 2π × ${n(f)} ≈ ${fy(w, 4)} rad/s, so P = ½ × ${n(mu)} × ${n(Am)}² × ${fy(w, 4)}² × ${n(v)} ≈ ${fx(P, 2)} W. The time for ${n(E)} J is ${n(E)} ÷ ${fy(P, 4)} ${eq(t, 2)} ${fx(t, 2)} s.`,
  guidance: [
   { prompt: `What is the angular frequency ω = 2πf for f = ${n(f)} Hz, in rad/s to 3 decimal places?`, answer: [rd(w, 3)], explanation: `ω = 2π × ${n(f)} ${eq(w, 3)} ${fx(w, 3)} rad/s.` },
   { prompt: `What is the average power ½μA²ω²v of the wave, in watts to 2 decimal places?`, answer: [rd(P, 2)], explanation: `With A = ${n(Am)} m and ω ≈ ${fy(w, 4)} rad/s, ½ × ${n(mu)} × ${n(tid(Am * Am))} × ${fx(w * w, 2)} × ${n(v)} ≈ ${fx(P, 2)} W.` },
   { prompt: `How many seconds does a power of ${fx(P, 2)} W take to deliver ${n(E)} J, to 2 decimal places?`, answer: [rd(t, 2)], explanation: `${n(E)} ÷ ${fy(P, 4)} ${eq(t, 2)} ${fx(t, 2)} s, working from the unrounded power.` }
  ] }; }
});

/* Challenge with q09: v = √(F_T/μ), P = ½μA²ω²v, and the amplitude that carries a different power, A₂ = √(2P₂ ÷ (μω²v)) (power goes as A²). */
const OK10d = ({ mu, F, A, f, P2 }) => { const v = Math.sqrt(F / mu), w = TAU * f, P = 0.5 * mu * (A / 100) * (A / 100) * w * w * v, A2 = 100 * Math.sqrt(2 * P2 / (mu * w * w * v));
 return clear(v, 2) && clear(P, 3) && P >= 0.05 && P < 500 && rd(0.5 * mu * (A / 100) * (A / 100) * w * w * rd(v, 2), 3) === rd(P, 3) && clear(A2, 2) && A2 >= 0.5 && A2 <= 40 && Math.abs(A2 - A) > 0.5 && !(mu === 0.1 && A === 1); };
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'Matching a power budget',
 brief: 'A cable is under a known tension, not a known wave speed, and Mira must find the power it carries and how big a swing a bigger budget needs.',
 labels: ['power (W)', 'new amplitude (cm)'], tolerance: 0.0005,
 gl: [['wave speed (m/s)'], ['power (W)'], ['new amplitude (cm)']]
}, {
 canonical: { mu: 0.03, F: 160, A: 1.3, f: 17, P2: 6.6 },
 draw: R => retry(() => ({ mu: R.int(2, 40) / 100, F: 10 * R.int(5, 60), A: R.int(4, 40) / 10, f: R.int(2, 20), P2: R.int(2, 100) / 10 }), OK10d, { mu: 0.03, F: 160, A: 1.3, f: 17, P2: 6.6 }),
 build: ({ mu, F, A, f, P2 }) => { const v = Math.sqrt(F / mu), w = TAU * f, Am = tid(A / 100), P = 0.5 * mu * Am * Am * w * w * v, A2 = 100 * Math.sqrt(2 * P2 / (mu * w * w * v)); return {
  prompt: `A cable with linear mass density ${n(mu)} kg/m is pulled with a tension of ${n(F)} N and driven at ${n(f)} Hz with amplitude ${n(A)} cm. Find the wave speed from v = √(F_T/μ). Then enter the average power the wave carries, in watts to 3 decimal places, from P = ½μA²ω²v with ω = 2πf in rad/s and A in metres; work from the unrounded speed. The tension and frequency stay the same, but the relay now needs the wave to carry ${n(P2)} W. The power is proportional to A² when μ, ω and v do not change. Enter the amplitude that carries ${n(P2)} W, in cm to 2 decimal places.`,
  answer: [rd(P, 3), rd(A2, 2)],
  hints: ['First find the wave speed v = √(F_T/μ) in m/s, and ω = 2πf. Then change the amplitude to metres before using P = ½μA²ω²v.', 'Since P is proportional to A², the new amplitude is the old one times √(P₂ ÷ P). Then change back to cm if you worked in metres.'],
  solution: `v = √(${n(F)} ÷ ${n(mu)}) ${eq(v, 2)} ${fx(v, 2)} m/s and ω = 2π × ${n(f)} ≈ ${fy(w, 4)} rad/s. With A = ${n(Am)} m, P = ½ × ${n(mu)} × ${n(Am)}² × ${fy(w, 4)}² × ${fy(v, 4)} ≈ ${fx(P, 3)} W. For ${n(P2)} W the amplitude scales by √(${n(P2)} ÷ ${fy(P, 4)}), so A₂ = ${n(A)} × √(${n(P2)} ÷ ${fy(P, 4)}) ${eq(A2, 2)} ${fx(A2, 2)} cm.`,
  guidance: [
   { prompt: `What is the wave speed v = √(F_T/μ) with F_T = ${n(F)} N, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${n(F)} ÷ ${n(mu)} = ${n(tid(F / mu))}, and its square root is ${eq(v, 2)} ${fx(v, 2)} m/s.` },
   { prompt: `What is the average power ½μA²ω²v, in watts to 3 decimal places?`, answer: [rd(P, 3)], explanation: `With A = ${n(Am)} m, ω ≈ ${fy(w, 4)} rad/s and v ≈ ${fy(v, 4)} m/s, the power is about ${fx(P, 3)} W.` },
   { prompt: `What amplitude carries ${n(P2)} W, in cm to 2 decimal places?`, answer: [rd(A2, 2)], explanation: `A₂ = ${n(A)} × √(${n(P2)} ÷ ${fy(P, 4)}) ${eq(A2, 2)} ${fx(A2, 2)} cm, since the power grows as A².` }
  ] }; }
});

})();
