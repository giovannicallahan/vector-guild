/* Waves: sound and light mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const TAU = 2 * Math.PI, g = 9.8;
/* Rounding to d places, and a rounded value as text with all its places and a typographic minus: fx(−0.1, 3) is '−0.100'. */
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const fx = (x, d) => { const r = rd(x, d); return (Object.is(r, -0) ? 0 : r).toFixed(d).replace('-', '−'); };
/* An answer rounded to d places that is clear of a rounding edge: the dropped part is at least 0.1 of a step away
   from one half (or the value is exact at d places), so a player whose calculator keeps fewer digits gets the same answer. */
/* The same, in brackets when negative, for a product: fp(−0.8, 4) is '(−0.8000)'. */
const fp = (x, d) => rd(x, d) < 0 ? `(${fx(x, d)})` : fx(x, d);
const exactAt = (x, d) => Math.abs(x * Math.pow(10, d) - Math.round(x * Math.pow(10, d))) < 1e-7;
const clear = (x, d) => { if (exactAt(x, d)) return true; const s = Math.abs(x) * Math.pow(10, d), fr = s - Math.floor(s); return Math.abs(fr - 0.5) >= 0.1; };
/* '=' when the rounded value is exact, '≈' when it is not. */
const eq = (x, d) => exactAt(x, d) ? '=' : '≈';
const tid = x => Math.round(x * 1e6) / 1e6;
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
const same = (p, q) => Object.keys(q).every(key => Math.abs(p[key] - q[key]) < 1e-9);

/* q01: periods whose frequency 1/T has at most two decimals. */
const PERIODS = [0.2, 0.25, 0.4, 0.5, 0.8, 1.25, 2, 2.5, 4, 5];
/* q08: the numbers of the mission, kept apart so the filter and build agree. */
const waveFn = ({ A, lam, f, x, t }) => { const k = TAU / lam, w = TAU * f, ang = k * x - w * t; return { k, w, ang, y: A * Math.sin(ang) }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* N swings in N·T seconds. Not the worked example (20 swings in 8 s). */
 q01: {
  canonical: { N: 12, T: 2.5 },
  draw: R => retry(() => ({ N: R.int(5, 40), T: R.pick(PERIODS) }), p => !(p.N === 20 && p.T === 0.4), { N: 12, T: 2.5 }),
  build: ({ N, T }) => { const t = tid(N * T), f = tid(1 / T); return {
   prompt: `The seismometer arm at the Quake Station swings back and forth. Mira counts ${n(N)} full swings, each one out and back again, in ${n(t)} ${t === 1 ? 'second' : 'seconds'}. Enter the period of one swing in seconds, then the frequency in hertz (Hz), the number of swings per second.`,
   answer: [T, f],
   hints: ['The period is the time for one full swing: share the total time equally between the swings.', 'The frequency is the number of swings in each second. It is 1 divided by the period, f = 1/T.'],
   solution: `The period is the total time divided by the number of swings: T = ${n(t)} ÷ ${n(N)} = ${n(T)} s. The frequency is the number of swings per second: f = ${n(N)} ÷ ${n(t)} = ${n(f)} Hz. As a check, 1 ÷ T = 1 ÷ ${n(T)} = ${n(f)}.`,
   guidance: [
    { prompt: `${n(N)} full swings take ${n(t)} ${t === 1 ? 'second' : 'seconds'}, all the same length. How long does one swing take, in seconds?`, answer: [T], explanation: `Each swing takes the same time, so T = ${n(t)} ÷ ${n(N)} = ${n(T)} s.` },
    { prompt: `One swing takes ${n(T)} s. How many swings happen in each second, in hertz?`, answer: [f], explanation: `f = 1 ÷ T = 1 ÷ ${n(T)} = ${n(f)} Hz, the same as ${n(N)} swings ÷ ${n(t)} ${t === 1 ? 'second' : 'seconds'}.` }
   ] }; }
 },
 /* ω = √(k/m) and T = 2π/ω to 2 places, both clear of a rounding edge, and the period from the rounded ω rounds the
    same way. Not the worked example (k = 50, m = 2). */
 q02: {
  canonical: { k: 180, m: 0.8 },
  draw: R => retry(() => ({ k: 10 * R.int(2, 40), m: R.int(2, 50) / 10 }), ({ k, m }) => { const w = Math.sqrt(k / m), T = TAU / w;
   return !(k === 50 && m === 2) && clear(w, 2) && clear(T, 2) && rd(TAU / rd(w, 2), 2) === rd(T, 2); }, { k: 180, m: 0.8 }),
  build: ({ k, m }) => { const w = Math.sqrt(k / m), T = TAU / w; return {
   prompt: `A seismometer mass of ${n(m)} kg hangs on a spring with spring constant k = ${n(k)} N/m. Pulled down and let go, it bobs up and down in simple harmonic motion. Enter the angular frequency ω = √(k/m) in radians per second, then the period T = 2π/ω in seconds, both to 2 decimal places.`,
   answer: [rd(w, 2), rd(T, 2)],
   hints: ['Divide the spring constant by the mass, then take the square root: that is ω in radians per second.', 'One full cycle is an angle of 2π radians, turned at ω radians per second, so the period is 2π divided by ω.'],
   solution: `ω = √(k/m) = √(${n(k)} ÷ ${n(m)}) ${eq(w, 2)} ${fx(w, 2)} rad/s. One cycle is 2π radians, so T = 2π/ω = 2π ÷ ${n(rd(w, 4))} ≈ ${fx(T, 2)} s. The amplitude does not appear anywhere: a bigger pull gives the same period.`,
   guidance: [
    { prompt: `What is ω = √(k/m) for k = ${n(k)} N/m and m = ${n(m)} kg, in radians per second to 2 decimal places?`, answer: [rd(w, 2)], explanation: `${n(k)} ÷ ${n(m)} = ${n(k / m)}, and its square root is ${eq(w, 2)} ${fx(w, 2)} rad/s.` },
    { prompt: 'One cycle is 2π radians. What is the period T = 2π/ω, in seconds to 2 decimal places?', answer: [rd(T, 2)], explanation: `T = 2π ÷ ${n(rd(w, 4))} ≈ ${fx(T, 2)} s.` }
   ] }; }
 },
 /* A in metres (2 places), ω whole, φ and t to 1 place: the angle ωt + φ is exact and x rounds cleanly at 3 places.
    Not the worked example (A = 0.1, ω = 5, φ = 0.4, t = 0.2). */
 q03: {
  canonical: { A: 0.15, w: 4, ph: 0.6, t: 0.5 },
  draw: R => retry(() => ({ A: R.int(5, 40) / 100, w: R.int(2, 12), ph: R.int(1, 15) / 10, t: R.int(1, 20) / 10 }),
   p => { const x = p.A * Math.cos(p.w * p.t + p.ph); return clear(x, 3) && Math.abs(x) >= 0.005 && !same(p, { A: 0.1, w: 5, ph: 0.4, t: 0.2 }); }, { A: 0.15, w: 4, ph: 0.6, t: 0.5 }),
  build: ({ A, w, ph, t }) => { const ang = tid(w * t + ph), c = Math.cos(ang), x = A * c, vm = tid(A * w), am = tid(A * w * w); return {
   prompt: `The seismometer mass moves as x(t) = ${n(A)} cos(${n(w)}t + ${n(ph)}) metres, with t in seconds and the angle in radians. Enter its position x at t = ${n(t)} s, in metres to 3 decimal places, then its greatest speed in m/s, then its greatest acceleration in m/s².`,
   answer: [rd(x, 3), vm, am],
   hints: ['Put t into ωt + φ first to get the phase in radians, take its cosine with the calculator in radian mode, and multiply by A.', 'Differentiate x(t): the velocity is −Aω sin(ωt + φ) and the acceleration is −Aω² cos(ωt + φ). Sine and cosine are never bigger than 1 in size, so the greatest speed is Aω and the greatest acceleration is Aω².'],
   solution: `The phase is ωt + φ = ${n(w)} × ${n(t)} + ${n(ph)} = ${n(ang)} rad, and cos ${n(ang)} ≈ ${fx(c, 4)}, so x ≈ ${n(A)} × ${fp(c, 4)} ≈ ${fx(x, 3)} m. The greatest speed is Aω = ${n(A)} × ${n(w)} = ${n(vm)} m/s, and the greatest acceleration is Aω² = ${n(A)} × ${n(w * w)} = ${n(am)} m/s².`,
   guidance: [
    { prompt: `What is the phase ωt + φ at t = ${n(t)} s, in radians?`, answer: [ang], explanation: `ωt + φ = ${n(w)} × ${n(t)} + ${n(ph)} = ${n(ang)} rad.` },
    { prompt: `What is x = ${n(A)} cos(${n(ang)}), in metres to 3 decimal places?`, answer: [rd(x, 3)], explanation: `In radian mode cos ${n(ang)} ≈ ${fx(c, 4)}, and ${n(A)} × ${fp(c, 4)} ≈ ${fx(x, 3)} m.` },
    { prompt: 'The speed is Aω times the size of sin(ωt + φ), which is at most 1. What is the greatest speed, in m/s?', answer: [vm], explanation: `Aω = ${n(A)} × ${n(w)} = ${n(vm)} m/s, reached each time the mass passes through equilibrium.` },
    { prompt: 'The acceleration is Aω² times the size of cos(ωt + φ). What is the greatest acceleration, in m/s²?', answer: [am], explanation: `Aω² = ${n(A)} × ${n(w * w)} = ${n(am)} m/s², reached at the two ends of the swing.` }
   ] }; }
 },
 /* k a multiple of 40 and A, x multiples of 0.05 m, so the energies have at most two decimals; v rounds cleanly at
    2 places. Not the worked example (k = 200, A = 0.1, m = 0.5, x = 0.06). */
 q04: {
  canonical: { k: 120, A: 0.25, m: 1.5, x: 0.15 },
  draw: R => retry(() => { const a = R.int(2, 10); return { k: 40 * R.int(1, 10), A: tid(0.05 * a), m: R.int(1, 8) / 2, x: tid(0.05 * R.int(1, a - 1)) }; },
   p => { const K = 0.5 * p.k * (p.A * p.A - p.x * p.x); return clear(Math.sqrt(2 * K / p.m), 2); }, { k: 120, A: 0.25, m: 1.5, x: 0.15 }),
  build: ({ k, A, m, x }) => { const E = tid(0.5 * k * A * A), Us = tid(0.5 * k * x * x), K = tid(E - Us), v = Math.sqrt(2 * K / m); return {
   prompt: `A seismometer mass of ${n(m)} kg on a spring with k = ${n(k)} N/m oscillates with amplitude ${n(A)} m, with no friction. Enter the total energy of the motion in joules, then the speed of the mass, in m/s to 2 decimal places, as it passes the point x = ${n(x)} m from equilibrium.`,
   answer: [E, rd(v, 2)],
   hints: ['At the end of a swing the mass stops for an instant, so all the energy is stored in the spring: the total is ½kA².', 'Energy is conserved: ½kx² + ½mv² = ½kA². Take the spring energy at x away from the total, and the rest is the kinetic energy ½mv²; solve that for v.'],
   solution: `E = ½kA² = ½ × ${n(k)} × ${n(tid(A * A))} = ${n(E)} J. At x = ${n(x)} m the spring holds ½kx² = ½ × ${n(k)} × ${n(tid(x * x))} = ${n(Us)} J, so the kinetic energy is ${n(E)} − ${n(Us)} = ${n(K)} J. Then ½mv² = ${n(K)} gives v = √(2 × ${n(K)} ÷ ${n(m)}) ${eq(v, 2)} ${fx(v, 2)} m/s.`,
   guidance: [
    { prompt: 'What is the total energy ½kA², in joules?', answer: [E], explanation: `½ × ${n(k)} × ${n(A)}² = ½ × ${n(k)} × ${n(tid(A * A))} = ${n(E)} J.` },
    { prompt: `What energy is stored in the spring at x = ${n(x)} m, ½kx², in joules?`, answer: [Us], explanation: `½ × ${n(k)} × ${n(tid(x * x))} = ${n(Us)} J.` },
    { prompt: 'What kinetic energy is left for the mass at that point, in joules?', answer: [K], explanation: `The total stays the same, so the kinetic energy is ${n(E)} − ${n(Us)} = ${n(K)} J.` },
    { prompt: 'Solve ½mv² = that kinetic energy for the speed v, in m/s to 2 decimal places.', answer: [rd(v, 2)], explanation: `v = √(2 × ${n(K)} ÷ ${n(m)}) ${eq(v, 2)} ${fx(v, 2)} m/s.` }
   ] }; }
 },
 /* T = 2π√(L/g) to 2 places and L = g(T/2π)² to 3 places, both clear of a rounding edge. Not the worked example
    (L = 2.45 m; a period of 1 s). */
 q05: {
  canonical: { L: 1.2, T2: 2.5 },
  draw: R => retry(() => ({ L: R.int(2, 40) / 10, T2: R.int(8, 40) / 10 }), ({ L, T2 }) => { const T = TAU * Math.sqrt(L / g), L2 = g * (T2 / TAU) * (T2 / TAU);
   return clear(T, 2) && clear(L2, 3) && T2 !== 1 && Math.abs(rd(T, 2) - T2) > 0.05; }, { L: 1.2, T2: 2.5 }),
  build: ({ L, T2 }) => { const T = TAU * Math.sqrt(L / g), L2 = g * (T2 / TAU) * (T2 / TAU); return {
   prompt: `Mira hangs a small heavy bob on a light cord ${n(L)} m long as a simple pendulum, and lets it swing through a small angle. Take g = 9.8 m/s². Enter its period in seconds to 2 decimal places. Then enter the length in metres, to 3 decimal places, that a second pendulum needs for a period of ${n(T2)} s.`,
   answer: [rd(T, 2), rd(L2, 3)],
   hints: ['For small swings the period of a simple pendulum is T = 2π√(L/g); the mass of the bob does not matter.', 'For the length, turn the rule round: divide the period by 2π, square the result and multiply by g, so L = g(T/2π)².'],
   solution: `T = 2π√(L/g) = 2π√(${n(L)} ÷ 9.8) ≈ ${fx(T, 2)} s. For a period of ${n(T2)} s, L = g(T/2π)² = 9.8 × (${n(T2)} ÷ 2π)² ≈ ${fx(L2, 3)} m.`,
   guidance: [
    { prompt: `What is the period 2π√(L/g) of the ${n(L)} m pendulum, in seconds to 2 decimal places?`, answer: [rd(T, 2)], explanation: `${n(L)} ÷ 9.8 ≈ ${fx(L / g, 4)}, its square root is about ${fx(Math.sqrt(L / g), 4)}, and 2π times that is about ${fx(T, 2)} s.` },
    { prompt: `What length L = g(T/2π)² gives a period of ${n(T2)} s, in metres to 3 decimal places?`, answer: [rd(L2, 3)], explanation: `Divide ${n(T2)} by 2π, square the result and multiply by 9.8: L = 9.8 × (${n(T2)} ÷ 2π)² ≈ ${fx(L2, 3)} m.` }
   ] }; }
 },
 /* bt/2m has at most two decimals, the amplitude stays above 0.5 cm, A and f₀ round cleanly at 2 places, and the
    damping is light enough that the damped frequency and f₀ agree at 2 places. Not the worked example. */
 q06: {
  canonical: { m: 2, b: 0.6, k: 50, A0: 8, t: 5 },
  draw: R => retry(() => ({ m: R.int(1, 10) / 2, b: R.int(1, 20) / 10, k: 10 * R.int(2, 40), A0: R.int(4, 20), t: R.int(2, 30) }), ({ m, b, k, A0, t }) => {
   const e = b * t / (2 * m), A = A0 * Math.exp(-e), w0 = Math.sqrt(k / m), wd = Math.sqrt(w0 * w0 - (b / (2 * m)) * (b / (2 * m)));
   return exactAt(e, 2) && A >= 0.5 && clear(A, 2) && clear(w0 / TAU, 2) && rd(wd / TAU, 2) === rd(w0 / TAU, 2) && !(m === 1 && b === 0.2 && k === 100); }, { m: 2, b: 0.6, k: 50, A0: 8, t: 5 }),
  build: ({ m, b, k, A0, t }) => { const e = tid(b * t / (2 * m)), A = A0 * Math.exp(-e), w0 = Math.sqrt(k / m), f0 = w0 / TAU; return {
   prompt: `A ${n(m)} kg seismometer mass on a spring with k = ${n(k)} N/m is slowed by an oil damper with damping constant b = ${n(b)} kg/s. It is pulled ${n(A0)} cm from equilibrium and let go, and its amplitude shrinks as A(t) = A₀e^(−bt/2m), where A₀ is the starting amplitude. Enter the amplitude after ${n(t)} s, in cm to 2 decimal places. Then the ground shakes it at different frequencies. Enter, in hertz to 2 decimal places, the driving frequency that makes it swing hardest; the damping is light, so take that to be the natural frequency f₀ = √(k/m) ÷ 2π.`,
   answer: [rd(A, 2), rd(f0, 2)],
   hints: ['Work out the number bt/2m first, with b in kg/s, t in seconds and m in kilograms; then multiply A₀ by e to the power of minus that number.', 'Resonance happens when the drive matches the natural frequency. Find ω₀ = √(k/m) in radians per second and divide by 2π to turn it into hertz.'],
   solution: `bt/2m = ${n(b)} × ${n(t)} ÷ (2 × ${n(m)}) = ${n(e)}, so A = ${n(A0)}e^(−${n(e)}) ≈ ${fx(A, 2)} cm. The natural angular frequency is ω₀ = √(${n(k)} ÷ ${n(m)}) ${eq(w0, 4)} ${n(w0)} rad/s, so f₀ = ω₀ ÷ 2π ≈ ${fx(f0, 2)} Hz. Driving it at this frequency gives resonance, the largest swing.`,
   guidance: [
    { prompt: `What is the number bt/2m after ${n(t)} s?`, answer: [e], explanation: `${n(b)} × ${n(t)} ÷ (2 × ${n(m)}) = ${n(e)}. It has no unit: kg/s times s divided by kg.` },
    { prompt: `What is the amplitude A₀e^(−bt/2m) after ${n(t)} s, in cm to 2 decimal places?`, answer: [rd(A, 2)], explanation: `e^(−${n(e)}) ≈ ${fx(Math.exp(-e), 4)}, and ${n(A0)} × ${fx(Math.exp(-e), 4)} ≈ ${fx(A, 2)} cm.` },
    { prompt: 'What is the natural frequency f₀ = √(k/m) ÷ 2π, in hertz to 2 decimal places?', answer: [rd(f0, 2)], explanation: `√(${n(k)} ÷ ${n(m)}) ${eq(w0, 4)} ${n(w0)} rad/s, and dividing by 2π gives about ${fx(f0, 2)} Hz.` }
   ] }; }
 },
 /* v = fλ exact; the new wavelength v ÷ f₂ to 2 places, clear of a rounding edge. Not the worked example (50 Hz, 0.4 m). */
 q07: {
  canonical: { f: 4, lam: 2.5, f2: 6 },
  draw: R => retry(() => { const f = R.int(2, 20); return { f, lam: R.int(2, 40) / 10, f2: R.except(2, 30, [f]) }; },
   p => clear(p.f * p.lam / p.f2, 2) && !(p.f === 50 && p.lam === 0.4), { f: 4, lam: 2.5, f2: 6 }),
  build: ({ f, lam, f2 }) => { const v = tid(f * lam), l2 = v / f2; return {
   prompt: `Mira shakes the bottom of a mast guy cable up and down ${n(f)} times a second, and a transverse wave runs up it. Its crests are ${n(lam)} m apart. Enter the wave speed in m/s. Then she shakes it at ${n(f2)} Hz instead; the cable carries every wave at the same speed. Enter the new wavelength in metres, to 2 decimal places.`,
   answer: [v, rd(l2, 2)],
   hints: ['In one period the wave moves forward one wavelength, so its speed is the wavelength times the frequency: v = fλ.', 'With the speed fixed by the cable, the wavelength is the speed divided by the new frequency: λ = v ÷ f.'],
   solution: `v = fλ = ${n(f)} × ${n(lam)} = ${n(v)} m/s. At ${n(f2)} Hz the speed is still ${n(v)} m/s, so λ = v ÷ f = ${n(v)} ÷ ${n(f2)} ${eq(l2, 2)} ${fx(l2, 2)} m.`,
   guidance: [
    { prompt: `A wave of frequency ${n(f)} Hz has wavelength ${n(lam)} m. What is its speed, in m/s?`, answer: [v], explanation: `Each second ${n(f)} wavelengths of ${n(lam)} m pass, so v = ${n(f)} × ${n(lam)} = ${n(v)} m/s.` },
    { prompt: `The speed stays ${n(v)} m/s. What is the wavelength at ${n(f2)} Hz, in metres to 2 decimal places?`, answer: [rd(l2, 2)], explanation: `λ = ${n(v)} ÷ ${n(f2)} ${eq(l2, 2)} ${fx(l2, 2)} m.` }
   ] }; }
 },
 /* k and ω to 3 places and y to 2, all clear of a rounding edge, and y from the rounded k and ω rounds the same way.
    Not the worked example (A = 5, λ = 2, f = 1). */
 q08: {
  canonical: { A: 4, lam: 1.6, f: 2.5, x: 0.5, t: 0.3 },
  draw: R => retry(() => ({ A: R.int(2, 12), lam: R.int(4, 40) / 10, f: R.int(2, 20) / 2, x: R.int(1, 30) / 10, t: R.int(1, 20) / 10 }), p => {
   const { k, w, y } = waveFn(p), y2 = p.A * Math.sin(rd(k, 3) * p.x - rd(w, 3) * p.t);
   return clear(k, 3) && clear(w, 3) && clear(y, 2) && rd(y2, 2) === rd(y, 2) && Math.abs(y) >= 0.1 && !(p.A === 5 && p.lam === 2 && p.f === 1); }, { A: 4, lam: 1.6, f: 2.5, x: 0.5, t: 0.3 }),
  build: p => { const { A, lam, f, x, t } = p, { k, w, ang, y } = waveFn(p); return {
   prompt: `A wave runs up a mast cable in the +x direction. Its wave function is y(x, t) = A sin(kx − ωt), with amplitude A = ${n(A)} cm, wavelength ${n(lam)} m and frequency ${n(f)} Hz; x is in metres and t in seconds. Enter the wave number k in rad/m and the angular frequency ω in rad/s, both to 3 decimal places, then the displacement y in cm, to 2 decimal places, of the point x = ${n(x)} m at t = ${n(t)} s.`,
   answer: [rd(k, 3), rd(w, 3), rd(y, 2)],
   hints: ['The wave number is k = 2π/λ and the angular frequency is ω = 2πf: each turns a length or a time into an angle in radians.', 'Work out kx − ωt in radians (it may be negative), take its sine with the calculator in radian mode, and multiply by A.'],
   solution: `k = 2π ÷ ${n(lam)} ≈ ${fx(k, 3)} rad/m and ω = 2π × ${n(f)} ≈ ${fx(w, 3)} rad/s. Then kx − ωt ≈ ${fx(k, 4)} × ${n(x)} − ${fx(w, 4)} × ${n(t)} ≈ ${fx(ang, 4)} rad, and y = ${n(A)} sin(${fx(ang, 4)}) ≈ ${fx(y, 2)} cm.`,
   guidance: [
    { prompt: `What is the wave number k = 2π/λ for λ = ${n(lam)} m, in rad/m to 3 decimal places?`, answer: [rd(k, 3)], explanation: `k = 2π ÷ ${n(lam)} ≈ ${fx(k, 3)} rad/m: the phase changes by that much for every metre along the cable.` },
    { prompt: `What is the angular frequency ω = 2πf for f = ${n(f)} Hz, in rad/s to 3 decimal places?`, answer: [rd(w, 3)], explanation: `ω = 2π × ${n(f)} ≈ ${fx(w, 3)} rad/s.` },
    { prompt: `What is y = ${n(A)} sin(kx − ωt) at x = ${n(x)} m and t = ${n(t)} s, in cm to 2 decimal places?`, answer: [rd(y, 2)], explanation: `kx − ωt ≈ ${fx(ang, 4)} rad, its sine is about ${fx(Math.sin(ang), 4)}, and ${n(A)} times that is about ${fx(y, 2)} cm.` }
   ] }; }
 },
 /* μ = M ÷ L with three decimals at most, v to 2 places clear of a rounding edge, and the new tension μv₂² below 1000 N.
    Not the worked example (μ = 0.01, 64 N). */
 q09: {
  canonical: { M: 0.6, L: 20, F: 150, v2: 80 },
  /* μ is drawn with three decimals, then the printed mass M = μL is the parameter (μ = M ÷ L is worked out in build). */
  draw: R => { const p = retry(() => ({ mu: R.int(4, 60) / 1000, L: R.int(5, 40), F: 10 * R.int(5, 60), v2: 10 * R.int(3, 12) }),
   p => clear(Math.sqrt(p.F / p.mu), 2) && p.mu * p.v2 * p.v2 < 1000 && Math.abs(Math.sqrt(p.F / p.mu) - p.v2) > 5 && !(p.mu === 0.01 && p.F === 64), { mu: 0.03, L: 20, F: 150, v2: 80 });
   return { M: tid(p.mu * p.L), L: p.L, F: p.F, v2: p.v2 }; },
  build: ({ M, L, F, v2 }) => { const mu = tid(M / L), v = Math.sqrt(F / mu), F2 = tid(mu * v2 * v2); return {
   prompt: `A guy cable on the comms mast is ${n(L)} m long and has a mass of ${n(M)} kg. It is pulled tight with a tension of ${n(F)} N. Enter its linear mass density in kg/m, then the speed of a wave pulse along it in m/s to 2 decimal places. Then enter the tension, in newtons, that would make pulses travel at ${n(v2)} m/s.`,
   answer: [mu, rd(v, 2), F2],
   hints: ['The linear mass density is μ = mass ÷ length, in kg/m. The wave speed is v = √(F_T/μ), with the tension F_T in newtons.', 'To reach a chosen speed, square both sides of v = √(F_T/μ) and solve for the tension: F_T = μv².'],
   solution: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m. The speed is v = √(F_T/μ) = √(${n(F)} ÷ ${n(mu)}) ${eq(v, 2)} ${fx(v, 2)} m/s. For pulses at ${n(v2)} m/s the tension must be F_T = μv² = ${n(mu)} × ${n(v2 * v2)} = ${n(F2)} N.`,
   guidance: [
    { prompt: `What is the linear mass density of ${n(M)} kg spread along ${n(L)} m, in kg/m?`, answer: [mu], explanation: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m.` },
    { prompt: `What is the wave speed √(F_T/μ) with F_T = ${n(F)} N, in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${n(F)} ÷ ${n(mu)} = ${n(F / mu)}, and its square root is ${eq(v, 2)} ${fx(v, 2)} m/s.` },
    { prompt: `What tension μv² gives a speed of ${n(v2)} m/s, in newtons?`, answer: [F2], explanation: `F_T = ${n(mu)} × ${n(v2)}² = ${n(mu)} × ${n(v2 * v2)} = ${n(F2)} N.` }
   ] }; }
 },
 /* P to 2 places, clear of a rounding edge and below 1000 W; the horn's far distance is a whole number of times the
    near one, and I₂ to 3 places, clear of a rounding edge and at least 0.005. Not the worked example. */
 q10: {
  canonical: { mu: 0.05, A: 2, f: 5, v: 40, I1: 0.8, r1: 5, r2: 20 },
  /* The far distance r2 is a parameter, drawn as a whole number s = 2…6 times r1. */
  draw: R => retry(() => { const r1 = R.int(2, 10); return { mu: R.int(2, 20) / 100, A: R.int(2, 8), f: R.int(2, 20), v: 5 * R.int(4, 20), I1: R.int(2, 50) / 10, r1, r2: r1 * R.int(2, 6) }; }, p => {
   const w = TAU * p.f, P = 0.5 * p.mu * (p.A / 100) * (p.A / 100) * w * w * p.v, I2 = p.I1 * (p.r1 / p.r2) * (p.r1 / p.r2);
   return clear(P, 2) && P >= 0.1 && P < 1000 && clear(I2, 3) && I2 >= 0.005 && !(p.mu === 0.1 && p.f === 10); }, { mu: 0.05, A: 2, f: 5, v: 40, I1: 0.8, r1: 5, r2: 20 }),
  build: ({ mu, A, f, v, I1, r1, r2 }) => { const w = TAU * f, Am = tid(A / 100), P = 0.5 * mu * Am * Am * w * w * v, s = Math.round(r2 / r1), I2 = I1 / (s * s); return {
   prompt: `A wave on a mast cable with linear mass density ${n(mu)} kg/m travels at ${n(v)} m/s. Mira drives it at ${n(f)} Hz with amplitude ${n(A)} cm. Enter the average power the wave carries, in watts to 2 decimal places, from P = ½μA²ω²v with the angular frequency ω = 2πf in rad/s and A in metres. Then a horn on the mast top sends sound out evenly in all directions, and its intensity is ${n(I1)} W/m² at ${n(r1)} m. Enter the intensity at ${n(r2)} m from the horn, in W/m² to 3 decimal places.`,
   answer: [rd(P, 2), rd(I2, 3)],
   hints: ['Change the amplitude to metres (divide by 100) and find ω = 2πf before you put the numbers into P = ½μA²ω²v.', 'The same power spreads over a sphere of area 4πr², so the intensity falls as 1/r²: going twice as far divides it by 4.'],
   solution: `A = ${n(A)} cm = ${n(Am)} m and ω = 2π × ${n(f)} ≈ ${fx(w, 4)} rad/s, so P = ½ × ${n(mu)} × ${n(Am)}² × ${fx(w, 4)}² × ${n(v)} ≈ ${fx(P, 2)} W. The horn is ${n(r2)} ÷ ${n(r1)} = ${n(s)} times as far away, so the intensity is divided by ${n(s)}² = ${n(s * s)}: I = ${n(I1)} ÷ ${n(s * s)} ${eq(I2, 3)} ${fx(I2, 3)} W/m².`,
   guidance: [
    { prompt: `What is the average power ½μA²ω²v of the cable wave, in watts to 2 decimal places?`, answer: [rd(P, 2)], explanation: `With A = ${n(Am)} m and ω ≈ ${fx(w, 4)} rad/s, ½ × ${n(mu)} × ${n(tid(Am * Am))} × ${fx(w * w, 2)} × ${n(v)} ≈ ${fx(P, 2)} W.` },
    { prompt: `How many times as far from the horn is ${n(r2)} m as ${n(r1)} m?`, answer: [s], explanation: `${n(r2)} ÷ ${n(r1)} = ${n(s)}.` },
    { prompt: 'What is the intensity there, in W/m² to 3 decimal places?', answer: [rd(I2, 3)], explanation: `The area the sound covers grows as r², so the intensity is ${n(I1)} ÷ ${n(s)}² = ${n(I1)} ÷ ${n(s * s)} ${eq(I2, 3)} ${fx(I2, 3)} W/m².` }
   ] }; }
 },
});
})();
