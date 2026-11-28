/* Waves: sound and light mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Rounding to k places; the rounded value as text with its trailing zeros; "= x" when the value is exactly x at k
   places and "≈ x" when it was rounded; a guard against rounding ties; a test for "exactly k decimal places or fewer". */
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => { const t = rd(x, k).toFixed(k); return (/^-0\.?0*$/.test(t) ? t.slice(1) : t).replace('-', '−'); };
const exact = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-7;
const eq = (x, k) => (exact(x, k) ? '= ' + n(x) : '≈ ' + fx(x, k));
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
/* A rounded value in a sum: "+ 1.23" or "− 1.23". */
const pfx = (x, k) => (rd(x, k) < 0 ? '− ' : '+ ') + fx(Math.abs(x), k);
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const same = (p, q) => Object.keys(q).every(key => p[key] === q[key]);
/* Ordinals: 1st, 2nd, 3rd, 4th, 11th. */
const ord = k => { const m = k % 100; return k + (m >= 11 && m <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' })[k % 10] || 'th'); };
/* Powers of ten: sci(2.5, −6) is "2.5 × 10⁻⁶". */
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sup = e => String(e).split('').map(c => SUP[c]).join('');
const sci = (a, e) => `${n(a)} × 10${sup(e)}`;
const V = 343;   // speed of sound in the hall and on the track, m/s, as the plan fixes it

/* q11: the numbers of the cable. */
const m11 = ({ L, M, F, f }) => { const mu = G.tidy(M / L), v = G.tidy(Math.sqrt(F * L / M)); return { mu, v, lam: G.tidy(v / f), t: L / v }; };
/* q12: the two displacements and their sum where kx − ωt = th. */
const m12 = ({ A, phi, th }) => { const y1 = A * Math.sin(th), y2 = A * Math.sin(th + phi); return { AR: 2 * A * Math.cos(phi / 2), y1, y2, y: y1 + y2 }; };
/* q14: the speed of sound at T_C degrees Celsius and the wavelength. */
const m14 = ({ Tc, f }) => { const r = 1 + Tc / 273, v = 331 * Math.sqrt(r); return { r, v, lam: v / f }; };
/* q15: the second intensity as a × 10^e with 1 <= a < 10, and both levels. */
const m15 = ({ a, e, r }) => { let m2 = a * r, e2 = e; while (m2 >= 10) { m2 /= 10; e2++; } m2 = G.tidy(m2);
 const L1 = Math.log10(a) + e + 12, L2 = Math.log10(m2) + e2 + 12; return { m2, e2, L1, L2, b1: 10 * L1, b2: 10 * L2 }; };
/* q16: fundamental, next harmonic and the other kind of pipe with the same fundamental. */
const m16 = ({ L, shut }) => { const f1 = shut ? V / (4 * L) : V / (2 * L); return { f1, next: (shut ? 3 : 2) * f1, other: G.tidy(shut ? 2 * L : L / 2) }; };
/* q17: string speed, the note, and the pipe length. */
const m17 = ({ mu, F, Ls, h, shut }) => { const v = G.tidy(Math.sqrt(F / mu)), f = G.tidy(h * v / (2 * Ls)); return { v, f, Lp: shut ? V / (4 * f) : V / (2 * f) }; };
/* q19, q20: the Doppler shifts. */
const m19 = ({ fs, vs }) => ({ fa: fs * V / (V - vs), fl: fs * V / (V + vs) });
const m20 = ({ fs, vo, vs, away, apart }) => { const top1 = away ? V - vo : V + vo, top2 = apart ? V - vo : V + vo, bot2 = apart ? V + vs : V - vs;
 return { top1, top2, bot2, f1: fs * top1 / V, f2: fs * top2 / bot2 }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* A cable of length L and mass M at tension F, shaken at f Hz. μ = M ÷ L has at most 3 decimals, the tension makes the
    speed a whole number, the wavelength has at most 2 decimals and the travel time is off a rounding tie at 3 places.
    Not the worked example (40 m, 2 kg, 125 N, 10 Hz). */
 q11: {
  canonical: { L: 50, M: 4, F: 288, f: 12 },
  draw: R => tries(() => { const L = R.pick([20, 25, 30, 40, 50, 60, 75, 80, 100]), M = R.pick([1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5]), v = R.int(30, 120);
   return { L, M, F: G.tidy(M / L * v * v), f: R.int(4, 30) }; },
   p => { const m = m11(p); return exact(m.mu, 3) && Number.isInteger(p.F) && Number.isInteger(m.v) && exact(m.lam, 2) && !edge(m.t, 3) && !(p.L === 40 && p.M === 2) && !same(p, { L: 50, M: 4, F: 288, f: 12 }); },
   { L: 50, M: 4, F: 288, f: 12 }),
  build: p => { const { L, M, F, f } = p, { mu, v, lam, t } = m11(p); return {
   prompt: `A guy cable on the comms mast is ${n(L)} m long and has a mass of ${n(M)} kg. It is pulled tight with a tension of ${n(F)} N. Mira shakes its bottom end up and down ${n(f)} times a second, so a wave of frequency ${n(f)} Hz runs up the cable. Enter the cable’s linear mass density in kg/m, the wave speed on the cable in m/s, the wavelength in metres, and the time in seconds a pulse takes to travel the whole length of the cable, to 3 decimal places.`,
   answer: [mu, v, lam, rd(t, 3)],
   hints: ['Linear mass density is mass divided by length, μ = m ÷ L. The wave speed on a stretched cable is v = √(F_T ÷ μ), where F_T is the tension.', 'The wavelength comes from v = fλ, so λ = v ÷ f. A pulse keeps the wave speed all the way, so the time is the distance divided by the speed.'],
   solution: `μ = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m. v = √(${n(F)} ÷ ${n(mu)}) = √${n(v * v)} = ${n(v)} m/s. λ = v ÷ f = ${n(v)} ÷ ${n(f)} = ${n(lam)} m. The pulse covers ${n(L)} m at ${n(v)} m/s, so it takes ${n(L)} ÷ ${n(v)} ${eq(t, 3)} s.`,
   guidance: [
    { prompt: `The cable’s ${n(M)} kg is spread evenly over ${n(L)} m. What is its linear mass density μ, in kg/m?`, answer: [mu], explanation: `μ = m ÷ L = ${n(M)} ÷ ${n(L)} = ${n(mu)} kg/m: each metre of cable has a mass of ${n(mu)} kg.` },
    { prompt: `The tension is ${n(F)} N and μ = ${n(mu)} kg/m. What is the wave speed v = √(F_T ÷ μ), in m/s?`, answer: [v], explanation: `${n(F)} ÷ ${n(mu)} = ${n(v * v)}, and √${n(v * v)} = ${n(v)}, so waves run along the cable at ${n(v)} m/s.` },
    { prompt: `The wave speed is ${n(v)} m/s and the frequency is ${n(f)} Hz. What is the wavelength λ = v ÷ f, in metres?`, answer: [lam], explanation: `λ = ${n(v)} ÷ ${n(f)} = ${n(lam)} m. Each second ${n(f)} waves leave the bottom end, and together they stretch ${n(v)} m.` },
    { prompt: `A pulse runs at ${n(v)} m/s along the ${n(L)} m cable. How long does it take, in seconds to 3 decimal places?`, answer: [rd(t, 3)], explanation: `Time is distance ÷ speed: ${n(L)} ÷ ${n(v)} ${eq(t, 3)} s.` }
   ] }; }
 },
 /* Two equal waves on one rope, the second ahead by φ rad. A from 2 to 9 cm, φ from 0.2 to 2.8 rad, kx − ωt = θ from
    0.1 to 1.5 rad. The amplitude and the three displacements are off rounding ties, no displacement is near 0, and the
    two rounded displacements add up to the rounded sum. Not the worked example (A = 3 cm, φ = 2 rad). */
 q12: {
  canonical: { A: 5, phi: 1.2, th: 0.6 },
  draw: R => tries(() => ({ A: R.int(2, 9), phi: R.int(2, 28) / 10, th: R.int(1, 15) / 10 }),
   p => { const m = m12(p); return ![m.AR, m.y1, m.y2, m.y].some(x => edge(x, 2)) && Math.abs(m.y2) >= 0.1 && Math.abs(m.y) >= 0.1 && rd(rd(m.y1, 2) + rd(m.y2, 2), 2) === rd(m.y, 2) && !(p.A === 3 && p.phi === 2) && !same(p, { A: 5, phi: 1.2, th: 0.6 }); },
   { A: 5, phi: 1.2, th: 0.6 }),
  build: p => { const { A, phi, th } = p, { AR, y1, y2, y } = m12(p); return {
   prompt: `Two crew members shake the same long rope across the assembly hall from the same end, so two waves travel along it together: y₁ = ${n(A)} sin(kx − ωt) cm and y₂ = ${n(A)} sin(kx − ωt + ${n(phi)}) cm. They have the same amplitude, wave number and angular frequency, but the second is ahead by a phase difference of ${n(phi)} rad. Angles are in radians. Enter the amplitude of the combined wave in cm, then the combined displacement of the rope in cm at a place and moment where kx − ωt = ${n(th)} rad. Give both to 2 decimal places; the displacement may be negative.`,
   answer: [rd(AR, 2), rd(y, 2)],
   hints: ['Superposition: where two waves overlap, their displacements add. Two equal waves with a phase difference φ add up to one wave of amplitude 2A cos(φ ÷ 2).', 'For the displacement, put the value of kx − ωt into each wave on its own, take both sines in radians, and add the two displacements.'],
   solution: `The combined wave has amplitude 2A cos(φ ÷ 2) = 2 × ${n(A)} × cos(${n(phi / 2)}) ${eq(AR, 2)} cm. Where kx − ωt = ${n(th)}, y₁ = ${n(A)} sin(${n(th)}) ≈ ${fx(y1, 2)} cm and y₂ = ${n(A)} sin(${n(th + phi)}) ≈ ${fx(y2, 2)} cm, so the rope is displaced by y₁ + y₂ ≈ ${fx(y1, 2)} ${pfx(y2, 2)} = ${fx(y, 2)} cm.`,
   guidance: [
    { prompt: `The amplitude of each wave is A = ${n(A)} cm and the phase difference is φ = ${n(phi)} rad. What is the combined amplitude 2A cos(φ ÷ 2), in cm to 2 decimal places?`, answer: [rd(AR, 2)], explanation: `φ ÷ 2 = ${n(phi / 2)} rad, and 2 × ${n(A)} × cos(${n(phi / 2)}) ${eq(AR, 2)} cm. It is less than ${n(2 * A)} cm, the 2A of waves exactly in step, because the waves are partly out of step.` },
    { prompt: `Where kx − ωt = ${n(th)} rad, what is the first wave’s displacement y₁ = ${n(A)} sin(${n(th)}), in cm to 2 decimal places?`, answer: [rd(y1, 2)], explanation: `sin(${n(th)}) ≈ ${fx(Math.sin(th), 4)}, so y₁ ≈ ${fx(y1, 2)} cm.` },
    { prompt: `The second wave is ahead by ${n(phi)} rad, so there its angle is ${n(th)} + ${n(phi)} = ${n(th + phi)} rad. What is y₂ = ${n(A)} sin(${n(th + phi)}), in cm to 2 decimal places?`, answer: [rd(y2, 2)], explanation: `sin(${n(th + phi)}) ≈ ${fx(Math.sin(th + phi), 4)}, so y₂ ≈ ${fx(y2, 2)} cm. Adding the two displacements gives ${fx(y, 2)} cm.` }
   ] }; }
 },
 /* A cable of length L fixed at both ends, wave speed v, in its h-th harmonic. λ and the node spacing have at most 3
    decimals, the fundamental at most 2, and every answer stays below 1000. Not the worked example (0.9 m, 144 m/s, 2nd harmonic). */
 q13: {
  canonical: { L: 1.2, v: 180, h: 3 },
  draw: R => tries(() => ({ L: R.pick([0.6, 0.8, 0.9, 1.2, 1.5, 1.6, 1.8, 2, 2.4, 3]), v: 10 * R.int(6, 40), h: R.int(2, 6) }),
   p => exact(2 * p.L / p.h, 3) && exact(p.L / p.h, 3) && exact(p.v / (2 * p.L), 2) && p.h * p.v / (2 * p.L) < 1000 && !(p.L === 0.9 && p.v === 144) && !same(p, { L: 1.2, v: 180, h: 3 }),
   { L: 1.2, v: 180, h: 3 }),
  build: ({ L, v, h }) => { const lam = G.tidy(2 * L / h), f = G.tidy(h * v / (2 * L)), sp = G.tidy(L / h); return {
   prompt: `A tuning cable ${n(L)} m long is fixed at both ends in the assembly hall, and waves travel along it at ${n(v)} m/s. Mira plucks it so that it vibrates in its ${ord(h)} harmonic: a standing wave with ${n(h)} loops between the ends. Enter the wavelength of that standing wave in metres, its frequency in Hz, and the distance in metres between neighbouring nodes.`,
   answer: [lam, f, sp],
   hints: ['A cable fixed at both ends has a node at each end. In its nth harmonic it holds n loops, and each loop is half a wavelength, so λ = 2L ÷ n.', 'The frequency comes from v = fλ, so f = v ÷ λ = nv ÷ (2L). Neighbouring nodes are half a wavelength apart.'],
   solution: `λ = 2L ÷ n = 2 × ${n(L)} ÷ ${n(h)} = ${n(lam)} m. f = v ÷ λ = ${n(v)} ÷ ${n(lam)} = ${n(f)} Hz. Neighbouring nodes are λ ÷ 2 = ${n(sp)} m apart, and ${n(h)} loops of ${n(sp)} m fill the ${n(L)} m cable.`,
   guidance: [
    { prompt: `The cable is ${n(L)} m long and holds ${n(h)} loops, each half a wavelength long. What is the wavelength λ = 2L ÷ n, in metres?`, answer: [lam], explanation: `${n(h)} half-wavelengths make ${n(L)} m, so λ = 2 × ${n(L)} ÷ ${n(h)} = ${n(lam)} m.` },
    { prompt: `Waves travel at ${n(v)} m/s and the wavelength is ${n(lam)} m. What is the frequency f = v ÷ λ, in Hz?`, answer: [f], explanation: `f = ${n(v)} ÷ ${n(lam)} = ${n(f)} Hz, which is ${n(h)} times the fundamental frequency of ${n(G.tidy(v / (2 * L)))} Hz.` },
    { prompt: `Neighbouring nodes are half a wavelength apart. What is that distance, in metres?`, answer: [sp], explanation: `λ ÷ 2 = ${n(lam)} ÷ 2 = ${n(sp)} m, the length of one loop.` }
   ] }; }
 },
 /* Air at T_C from −30 to 40 °C (not 0), a note of f Hz. The speed is off a tie at 2 places, the wavelength off a tie at 3,
    and the wavelength from the rounded speed rounds the same way. Not the worked example (30 °C, 1000 Hz). */
 q14: {
  canonical: { Tc: 20, f: 500 },
  draw: R => tries(() => ({ Tc: R.except(-30, 40, [0]), f: 10 * R.int(15, 100) }),
   p => { const m = m14(p); return !edge(m.v, 2) && !edge(m.lam, 3) && rd(rd(m.v, 2) / p.f, 3) === rd(m.lam, 3) && !(p.Tc === 30 && p.f === 1000) && !same(p, { Tc: 20, f: 500 }); },
   { Tc: 20, f: 500 }),
  build: p => { const { Tc, f } = p, { r, v, lam } = m14(p); return {
   prompt: `The air in the assembly hall is at ${n(Tc)} °C, and a speaker plays a note of ${n(f)} Hz. Enter the speed of sound in the hall in m/s, to 2 decimal places, then the wavelength of the note in metres, to 3 decimal places, worked out from the unrounded speed.`,
   answer: [rd(v, 2), rd(lam, 3)],
   hints: ['In air at a temperature of T_C degrees Celsius, sound travels at v = 331 √(1 + T_C ÷ 273) m/s. A temperature below 0 °C makes the fraction negative.', 'Sound is a wave like any other, so v = fλ and λ = v ÷ f.'],
   solution: `1 + ${par(Tc)} ÷ 273 ≈ ${fx(r, 4)}, so v = 331 × √(1 + ${par(Tc)} ÷ 273) ≈ ${fx(v, 2)} m/s. λ = v ÷ f ≈ ${fx(v, 4)} ÷ ${n(f)} ≈ ${fx(lam, 3)} m.`,
   guidance: [
    { prompt: `The hall is at ${n(Tc)} °C. What is the speed of sound v = 331 √(1 + T_C ÷ 273), in m/s to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${par(Tc)} ÷ 273 ≈ ${fx(Tc / 273, 4)}, so v ≈ 331 × √${fx(r, 4)} ≈ ${fx(v, 2)} m/s. That is ${Tc > 0 ? 'faster' : 'slower'} than the 331 m/s of air at 0 °C, because the air is ${Tc > 0 ? 'warmer' : 'colder'}.` },
    { prompt: `The note is ${n(f)} Hz. What is its wavelength λ = v ÷ f, in metres to 3 decimal places?`, answer: [rd(lam, 3)], explanation: `λ ≈ ${fx(v, 4)} ÷ ${n(f)} ≈ ${fx(lam, 3)} m.` }
   ] }; }
 },
 /* I₁ = a × 10^e W/m² with a from 1.0 to 9.9 and e from −10 to −4, and I₂ = r × I₁ for a whole r from 2 to 9. Both
    levels are off a tie at 1 place. Not the worked example (3 × 10⁻⁵ W/m²). */
 q15: {
  canonical: { a: 4, e: -7, r: 6 },
  draw: R => tries(() => ({ a: R.int(10, 99) / 10, e: R.int(-10, -4), r: R.int(2, 9) }),
   p => { const m = m15(p); return !edge(m.b1, 1) && !edge(m.b2, 1) && !(p.a === 3 && p.e === -5) && !same(p, { a: 4, e: -7, r: 6 }); },
   { a: 4, e: -7, r: 6 }),
  build: p => { const { a, e, r } = p, { m2, e2, L1, L2, b1, b2 } = m15(p); return {
   prompt: `At Mira’s seat in the assembly hall, the sound from one speaker has an intensity of ${sci(a, e)} W/m². A louder speaker gives ${sci(m2, e2)} W/m² at the same seat. The reference intensity is I₀ = 10⁻¹² W/m². Enter the sound intensity level of the first speaker in dB, then that of the second in dB, both to 1 decimal place. Then enter how many times as intense the second sound is as the first.`,
   answer: [rd(b1, 1), rd(b2, 1), r],
   hints: ['The sound intensity level is β = 10 log₁₀(I ÷ I₀) decibels. Dividing by I₀ = 10⁻¹² adds 12 to the power of ten.', 'log₁₀(a × 10ᵖ) = log₁₀ a + p. For the last answer divide the second intensity by the first; each factor of 10 in intensity adds 10 dB.'],
   solution: `I₁ ÷ I₀ = ${sci(a, e + 12)}, so log₁₀(I₁ ÷ I₀) = log₁₀ ${n(a)} + ${n(e + 12)} ≈ ${fx(L1, 4)} and β₁ ≈ ${fx(b1, 1)} dB. I₂ ÷ I₀ = ${sci(m2, e2 + 12)}, so log₁₀(I₂ ÷ I₀) ≈ ${fx(L2, 4)} and β₂ ≈ ${fx(b2, 1)} dB. I₂ ÷ I₁ = (${sci(m2, e2)}) ÷ (${sci(a, e)}) = ${n(r)}: the second sound is ${n(r)} times as intense, and its level is 10 log₁₀ ${n(r)} ≈ ${fx(10 * Math.log10(r), 1)} dB higher.`,
   guidance: [
    { prompt: `I₁ ÷ I₀ = (${sci(a, e)}) ÷ 10⁻¹² = ${sci(a, e + 12)}. What is log₁₀ of that, to 2 decimal places?`, answer: [rd(L1, 2)], explanation: `log₁₀(${sci(a, e + 12)}) = log₁₀ ${n(a)} + ${n(e + 12)} ≈ ${fx(L1, 4)}, which is ${fx(L1, 2)} to 2 decimal places. Ten times it is the level β₁ ≈ ${fx(b1, 1)} dB.` },
    { prompt: `Now the louder speaker: I₂ = ${sci(m2, e2)} W/m². What is its level β₂ = 10 log₁₀(I₂ ÷ I₀), in dB to 1 decimal place?`, answer: [rd(b2, 1)], explanation: `I₂ ÷ I₀ = ${sci(m2, e2 + 12)}, whose log₁₀ is about ${fx(L2, 4)}, so β₂ ≈ ${fx(b2, 1)} dB.` },
    { prompt: `How many times as intense is ${sci(m2, e2)} W/m² as ${sci(a, e)} W/m²?`, answer: [r], explanation: `Dividing the two intensities gives ${n(r)}. The two levels differ by 10 log₁₀ ${n(r)} ≈ ${fx(10 * Math.log10(r), 1)} dB, the same ratio told in decibels.` }
   ] }; }
 },
 /* A pipe of length L (0.3 to 3 m, in steps of 0.05 m), closed at one end or open at both. The fundamental and the next
    harmonic are off ties at 2 places and below 1000 Hz. Not the worked example (an open pipe 0.5 m long). */
 q16: {
  canonical: { L: 0.7, shut: true },
  draw: R => tries(() => ({ L: rd(0.05 * R.int(6, 60), 2), shut: R.bool() }),
   p => { const m = m16(p); return !edge(m.f1, 2) && !edge(m.next, 2) && m.next < 1000 && !(p.L === 0.5 && !p.shut) && !same(p, { L: 0.7, shut: true }); },
   { L: 0.7, shut: true }),
  build: p => { const { L, shut } = p, { f1, next, other } = m16(p), k = shut ? 3 : 2; return {
   prompt: `An organ pipe in the assembly hall is ${n(L)} m long and ${shut ? 'closed at one end, open at the other' : 'open at both ends'}. Sound travels at 343 m/s in the hall. Enter the frequency of the pipe’s fundamental in Hz, then the frequency of the next harmonic the pipe can sound above it in Hz, both to 2 decimal places. Then enter the length in metres of a pipe ${shut ? 'open at both ends' : 'closed at one end'} that has the same fundamental.`,
   answer: [rd(f1, 2), rd(next, 2), other],
   hints: ['A pipe open at both ends has λ = 2L ÷ n and fₙ = nv ÷ (2L) for n = 1, 2, 3, … A pipe closed at one end has λ = 4L ÷ n and fₙ = nv ÷ (4L) for odd n only: 1, 3, 5, …', 'The fundamental is n = 1. Find the next harmonic from the unrounded fundamental. For the other kind of pipe, set its fundamental equal to this one and solve for its length.'],
   solution: shut
    ? `A pipe closed at one end has a node at the closed end and an antinode at the open end, so its fundamental is f₁ = v ÷ (4L) = 343 ÷ (4 × ${n(L)}) ${eq(f1, 2)} Hz. Only odd harmonics are possible, so the next one is the 3rd: 3 × f₁ ${eq(next, 2)} Hz. A pipe open at both ends with the same fundamental needs v ÷ (2L′) = v ÷ (4 × ${n(L)}), so L′ = 2 × ${n(L)} = ${n(other)} m.`
    : `A pipe open at both ends has an antinode at each end, so its fundamental is f₁ = v ÷ (2L) = 343 ÷ (2 × ${n(L)}) ${eq(f1, 2)} Hz. Every whole-number harmonic is possible, so the next one is the 2nd: 2 × f₁ ${eq(next, 2)} Hz. A pipe closed at one end with the same fundamental needs v ÷ (4L′) = v ÷ (2 × ${n(L)}), so L′ = ${n(L)} ÷ 2 = ${n(other)} m.`,
   guidance: [
    { prompt: `The pipe is ${shut ? 'closed at one end' : 'open at both ends'}, so its fundamental is f₁ = v ÷ (${shut ? '4' : '2'}L). What is f₁, in Hz to 2 decimal places?`, answer: [rd(f1, 2)], explanation: `f₁ = 343 ÷ (${shut ? '4' : '2'} × ${n(L)}) = 343 ÷ ${n(G.tidy((shut ? 4 : 2) * L))} ${eq(f1, 2)} Hz.` },
    { prompt: `${shut ? 'A pipe closed at one end sounds only odd harmonics.' : 'A pipe open at both ends sounds every whole-number harmonic.'} What is the frequency of the next harmonic above the fundamental, in Hz to 2 decimal places?`, answer: [rd(next, 2)], explanation: `The next harmonic is the ${ord(k)}, at ${n(k)} × f₁ ${eq(next, 2)} Hz.` },
    { prompt: `A pipe ${shut ? 'open at both ends' : 'closed at one end'} of length L′ has fundamental v ÷ (${shut ? '2' : '4'}L′). How long must it be, in metres, to have the same fundamental?`, answer: [other], explanation: shut ? `v ÷ (2L′) = v ÷ (4 × ${n(L)}) gives 2L′ = 4 × ${n(L)}, so L′ = ${n(other)} m: an open pipe must be twice as long for the same note.` : `v ÷ (4L′) = v ÷ (2 × ${n(L)}) gives 4L′ = 2 × ${n(L)}, so L′ = ${n(other)} m: a closed pipe needs only half the length for the same note.` }
   ] }; }
 },
 /* A string (μ kg/m, tension F N, length Ls m) in its h-th harmonic, matched by the fundamental of a pipe. The string
    speed is a whole number, the note has at most 2 decimals and lies from 80 to 999 Hz, and the pipe length is off a
    tie at 3 places. Not the worked example (0.01 kg/m, 256 N, 0.5 m, 1st harmonic, open pipe). */
 q17: {
  canonical: { mu: 0.005, F: 200, Ls: 0.8, h: 2, shut: true },
  draw: R => tries(() => { const mu = R.pick([0.002, 0.0025, 0.004, 0.005, 0.008, 0.01, 0.0125, 0.02]), v = R.int(80, 400);
   return { mu, F: G.tidy(mu * v * v), Ls: R.pick([0.4, 0.5, 0.6, 0.64, 0.75, 0.8, 1, 1.25]), h: R.int(1, 4), shut: R.bool() }; },
   p => { const m = m17(p); return Number.isInteger(p.F) && Number.isInteger(m.v) && exact(m.f, 2) && m.f >= 80 && m.f < 1000 && !edge(m.Lp, 3) && !(p.mu === 0.01 && p.F === 256 && p.Ls === 0.5) && !same(p, { mu: 0.005, F: 200, Ls: 0.8, h: 2, shut: true }); },
   { mu: 0.005, F: 200, Ls: 0.8, h: 2, shut: true }),
  build: p => { const { mu, F, Ls, h, shut } = p, { v, f, Lp } = m17(p); return {
   prompt: `A tuning string in the assembly hall is ${n(Ls)} m long and fixed at both ends. Its linear mass density is ${n(mu)} kg/m and its tension is ${n(F)} N. It is played in its ${ord(h)} harmonic. Mira wants an organ pipe ${shut ? 'closed at one end' : 'open at both ends'} whose fundamental is the same note, and sound travels at 343 m/s in the hall. Enter the wave speed on the string in m/s, the frequency of the note in Hz, and the length of the pipe in metres, to 3 decimal places.`,
   answer: [v, f, rd(Lp, 3)],
   hints: ['On the string, v = √(F_T ÷ μ), and the nth harmonic of a string fixed at both ends has frequency fₙ = nv ÷ (2L).', `The pipe’s fundamental is 343 ÷ (${shut ? '4' : '2'}L) for a pipe ${shut ? 'closed at one end' : 'open at both ends'}. Set it equal to the string’s note and solve for L; the string’s wave speed has nothing to do with the speed of sound in the pipe.`],
   solution: `On the string v = √(${n(F)} ÷ ${n(mu)}) = √${n(v * v)} = ${n(v)} m/s. Its ${ord(h)} harmonic is f = ${n(h)} × ${n(v)} ÷ (2 × ${n(Ls)}) = ${n(f)} Hz. The pipe needs 343 ÷ (${shut ? '4' : '2'}L) = ${n(f)}, so L = 343 ÷ (${shut ? '4' : '2'} × ${n(f)}) ${eq(Lp, 3)} m.`,
   guidance: [
    { prompt: `The tension is ${n(F)} N and μ = ${n(mu)} kg/m. What is the wave speed on the string, in m/s?`, answer: [v], explanation: `v = √(${n(F)} ÷ ${n(mu)}) = √${n(v * v)} = ${n(v)} m/s.` },
    { prompt: `The string is ${n(Ls)} m long and plays its ${ord(h)} harmonic. What is the frequency nv ÷ (2L), in Hz?`, answer: [f], explanation: `f = ${n(h)} × ${n(v)} ÷ ${n(G.tidy(2 * Ls))} = ${n(f)} Hz.` },
    { prompt: `A pipe ${shut ? 'closed at one end' : 'open at both ends'} has fundamental 343 ÷ (${shut ? '4' : '2'}L). What length gives ${n(f)} Hz, in metres to 3 decimal places?`, answer: [rd(Lp, 3)], explanation: `L = 343 ÷ (${shut ? '4' : '2'} × ${n(f)}) = 343 ÷ ${n(G.tidy((shut ? 4 : 2) * f))} ${eq(Lp, 3)} m.` }
   ] }; }
 },
 /* A fork of f1 Hz and a pipe d Hz away (d from 0.5 to 6 in halves, above or below), heard for t s so the count of beats
    is whole; a second pipe b beats per second away, higher or lower. Not the worked example (256 and 259 Hz). */
 q18: {
  canonical: { f1: 440, d: 3.5, t: 4, b: 2, up: false },
  draw: R => tries(() => ({ f1: R.pick([220, 256, 262, 294, 330, 349, 392, 440, 494, 523]), d: (R.bool() ? 1 : -1) * R.int(1, 12) / 2, t: R.pick([2, 4, 6, 8, 10]), b: R.int(2, 7), up: R.bool() }),
   p => !(p.f1 === 256 && p.d === 3) && !same(p, { f1: 440, d: 3.5, t: 4, b: 2, up: false }),
   { f1: 440, d: 3.5, t: 4, b: 2, up: false }),
  build: ({ f1, d, t, b, up }) => { const f2 = G.tidy(f1 + d), fb = Math.abs(d), count = G.tidy(fb * t), fu = up ? f1 + b : f1 - b; return {
   prompt: `Mira tunes the hall’s organ against a reference fork of ${n(f1)} Hz. One pipe sounds at ${n(f2)} Hz. Enter the beat frequency in Hz you hear when the fork and that pipe sound together, then the number of beats you hear in ${n(t)} s. A second pipe, sounded with the same fork, gives ${n(b)} beats per second, and its pitch is known to be ${up ? 'higher' : 'lower'} than the fork’s. Enter that second pipe’s frequency in Hz.`,
   answer: [fb, count, fu],
   hints: ['Two notes close in frequency drift in and out of step, so the sound swells and fades. The number of swells each second is the beat frequency, f_beat = |f₁ − f₂|: the difference, taken as positive.', 'The number of beats in a stretch of time is the beat frequency times the time. A beat frequency says only how far apart two notes are; you need to know which one is higher to find the unknown note.'],
   solution: `f_beat = |${n(f1)} − ${n(f2)}| = ${n(fb)} Hz. In ${n(t)} s that is ${n(fb)} × ${n(t)} = ${n(count)} beats. The second pipe is ${n(b)} Hz away from ${n(f1)} Hz and ${up ? 'higher' : 'lower'}, so it sounds at ${n(f1)} ${up ? '+' : '−'} ${n(b)} = ${n(fu)} Hz.`,
   guidance: [
    { prompt: `The fork is ${n(f1)} Hz and the pipe ${n(f2)} Hz. What is the beat frequency |f₁ − f₂|, in Hz?`, answer: [fb], explanation: `${n(f1)} − ${n(f2)} = ${n(G.tidy(f1 - f2))}, and as a positive number that is ${n(fb)} Hz: the sound swells ${n(fb)} times a second.` },
    { prompt: `How many beats are heard in ${n(t)} s at ${n(fb)} beats per second?`, answer: [count], explanation: `${n(fb)} × ${n(t)} = ${n(count)} beats.` },
    { prompt: `The second pipe beats ${n(b)} times a second with the ${n(f1)} Hz fork and is ${up ? 'higher' : 'lower'}. What is its frequency, in Hz?`, answer: [fu], explanation: `Its note is ${n(b)} Hz from the fork’s. It could be ${n(f1 - b)} Hz or ${n(f1 + b)} Hz; being ${up ? 'higher' : 'lower'}, it is ${n(fu)} Hz.` }
   ] }; }
 },
 /* A siren of fs Hz (300 to 900 in tens) on a rover at vs m/s (10 to 40). Both heard frequencies are off ties at
    1 place and below 1000 Hz. Not the worked example (500 Hz at 30 m/s). */
 q19: {
  canonical: { fs: 600, vs: 20 },
  draw: R => tries(() => ({ fs: 10 * R.int(30, 90), vs: R.int(10, 40) }),
   p => { const m = m19(p); return m.fa < 1000 && !edge(m.fa, 1) && !edge(m.fl, 1) && !(p.fs === 500 && p.vs === 30) && !same(p, { fs: 600, vs: 20 }); },
   { fs: 600, vs: 20 }),
  build: p => { const { fs, vs } = p, { fa, fl } = m19(p); return {
   prompt: `A rover drives along the track at ${n(vs)} m/s with its siren sounding at ${n(fs)} Hz. Mira stands still right at the edge of the track, so close to it that the rover’s motion counts as straight towards her and then straight away from her, and sound travels at 343 m/s. Enter the frequency she hears while the rover comes towards her, then the frequency she hears after it has passed and is moving away, both in Hz to 1 decimal place.`,
   answer: [rd(fa, 1), rd(fl, 1)],
   hints: ['For a moving source and a listener standing still, the heard frequency is f_o = f_s × v ÷ (v ∓ v_s): use v − v_s while the source comes towards the listener, and v + v_s while it moves away.', 'Coming towards her, the waves are squeezed together, so the note is higher than the siren’s own; moving away, it is lower. Check your two answers against that.'],
   solution: `Coming towards her: f_o = ${n(fs)} × 343 ÷ (343 − ${n(vs)}) = ${n(fs)} × 343 ÷ ${n(V - vs)} ≈ ${fx(fa, 1)} Hz. Moving away: f_o = ${n(fs)} × 343 ÷ (343 + ${n(vs)}) = ${n(fs)} × 343 ÷ ${n(V + vs)} ≈ ${fx(fl, 1)} Hz.`,
   guidance: [
    { prompt: `While the rover comes towards Mira, the bottom of the formula is v − v_s. What is 343 − ${n(vs)}, in m/s?`, answer: [V - vs], explanation: `343 − ${n(vs)} = ${n(V - vs)} m/s. The siren chases its own waves at ${n(vs)} m/s, so the waves in front of it bunch up.` },
    { prompt: `What does Mira hear while the rover approaches, f_s × 343 ÷ ${n(V - vs)}, in Hz to 1 decimal place?`, answer: [rd(fa, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V - vs)} ≈ ${fx(fa, 1)} Hz, higher than the siren’s ${n(fs)} Hz.` },
    { prompt: `After it passes, the bottom is v + v_s = ${n(V + vs)} m/s. What does she hear then, in Hz to 1 decimal place?`, answer: [rd(fl, 1)], explanation: `${n(fs)} × 343 ÷ ${n(V + vs)} ≈ ${fx(fl, 1)} Hz, lower than the siren’s own note.` }
   ] }; }
 },
 /* The tower's siren fs Hz heard by Mira riding at vo m/s towards or away from it; then a second siren of fs Hz on a rover
    at vs m/s, the two rovers moving towards each other or apart. Both heard frequencies are off ties at 1 place.
    Not the worked example (500 Hz, 10 m/s towards, then 20 m/s, towards each other). */
 q20: {
  canonical: { fs: 750, vo: 14, vs: 22, away: false, apart: false },
  draw: R => tries(() => ({ fs: 50 * R.int(8, 18), vo: R.int(5, 25), vs: R.int(10, 35), away: R.bool(), apart: R.bool() }),
   p => { const m = m20(p); return m.f1 < 1000 && m.f2 < 1000 && !edge(m.f1, 1) && !edge(m.f2, 1) && p.vo !== p.vs && !(p.fs === 500 && p.vo === 10) && !same(p, { fs: 750, vo: 14, vs: 22, away: false, apart: false }); },
   { fs: 750, vo: 14, vs: 22, away: false, apart: false }),
  build: p => { const { fs, vo, vs, away, apart } = p, { top1, top2, bot2, f1, f2 } = m20(p); return {
   prompt: `The siren tower beside the track sounds at ${n(fs)} Hz. Mira rides a rover at ${n(vo)} m/s straight ${away ? 'away from' : 'towards'} the tower, and sound travels at 343 m/s in the still air. Enter the frequency she hears, in Hz to 1 decimal place. Later a second rover carries a siren that also sounds at ${n(fs)} Hz and drives at ${n(vs)} m/s, while Mira still rides at ${n(vo)} m/s. The two rovers are on the same straight track, moving ${apart ? 'apart, away from each other' : 'towards each other'}. Enter the frequency Mira hears from the second siren, in Hz to 1 decimal place.`,
   answer: [rd(f1, 1), rd(f2, 1)],
   hints: ['A moving listener meets the waves more often or less often: f_o = f_s × (v ± v_o) ÷ v, with + when moving towards the source and − when moving away.', 'With both moving, f_o = f_s × (v ± v_o) ÷ (v ∓ v_s). Use the top signs (+ on top, − below) for towards each other and the bottom signs (− on top, + below) for apart.'],
   solution: `Mira ${away ? 'moves away from' : 'moves towards'} a source that stands still, so f_o = ${n(fs)} × (343 ${away ? '−' : '+'} ${n(vo)}) ÷ 343 = ${n(fs)} × ${n(top1)} ÷ 343 ≈ ${fx(f1, 1)} Hz. With both rovers moving ${apart ? 'apart' : 'towards each other'}, f_o = ${n(fs)} × (343 ${apart ? '−' : '+'} ${n(vo)}) ÷ (343 ${apart ? '+' : '−'} ${n(vs)}) = ${n(fs)} × ${n(top2)} ÷ ${n(bot2)} ≈ ${fx(f2, 1)} Hz.`,
   guidance: [
    { prompt: `Mira moves ${away ? 'away from' : 'towards'} the tower at ${n(vo)} m/s. What is the top of the formula, 343 ${away ? '−' : '+'} ${n(vo)}, in m/s?`, answer: [top1], explanation: `343 ${away ? '−' : '+'} ${n(vo)} = ${n(top1)} m/s: the speed at which the waves pass her.` },
    { prompt: `What frequency does she hear from the tower, ${n(fs)} × ${n(top1)} ÷ 343, in Hz to 1 decimal place?`, answer: [rd(f1, 1)], explanation: `${n(fs)} × ${n(top1)} ÷ 343 ≈ ${fx(f1, 1)} Hz, ${away ? 'lower' : 'higher'} than the tower’s ${n(fs)} Hz.` },
    { prompt: `Now both rovers move ${apart ? 'apart' : 'towards each other'}: f_o = ${n(fs)} × (343 ${apart ? '−' : '+'} ${n(vo)}) ÷ (343 ${apart ? '+' : '−'} ${n(vs)}). What is it, in Hz to 1 decimal place?`, answer: [rd(f2, 1)], explanation: `${n(fs)} × ${n(top2)} ÷ ${n(bot2)} ≈ ${fx(f2, 1)} Hz.` }
   ] }; }
 }
});
})();
