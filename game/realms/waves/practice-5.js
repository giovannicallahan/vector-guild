/* Waves: sound and light practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p5.js. */
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
const V = 343;
/* Rounding to dp places (symmetric about 0), and a rounded value as text with all its places. */
const rd = (x, dp) => { const f = Math.pow(10, dp); return Math.sign(x) * Math.round(Math.abs(x) * f) / f; };
const fx = (x, dp) => { const r = rd(x, dp); return (Object.is(r, -0) ? 0 : r).toFixed(dp).replace('-', '−'); };
const exact = (x, dp) => Math.abs(x - rd(x, dp)) < 1e-9;
/* Safe to ask for to dp places: exact there, or well away from a rounding tie and different from its 4-place form. */
const ok = (x, dp) => { if (exact(x, dp)) return true; const s = Math.abs(x) * Math.pow(10, dp), fr = s - Math.floor(s);
 return Math.abs(fr - 0.5) > 0.05 && (dp >= 4 || rd(x, 4) !== rd(x, dp)); };
const places = dp => `${dp} decimal place${dp === 1 ? '' : 's'}`;
/* "= 30" for an exact value, otherwise "≈ 26.6667, which is 26.7 to 1 decimal place". */
const say = (x, dp, u = '') => exact(x, dp) ? `= ${n(rd(x, dp))}${u}` : dp >= 4 ? `≈ ${n(x)}${u}` : `≈ ${n(x)}${u}, which is ${fx(x, dp)}${u} to ${places(dp)}`;
/* "≈ 0.6660" for a value used unrounded, "= 0.24" when it is exact at four places. */
const eq4 = x => exact(x, 4) ? `= ${n(x)}` : `≈ ${n(x)}`;
const tid = x => Math.round(x * 1e9) / 1e9;
const guard = (make, fits, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (fits(p)) return p; } return { ...fallback }; };
const tq = T => T < 0 ? `1 − ${n(-T)} ÷ 273` : `1 + ${n(T)} ÷ 273`;
const speedT = T => 331 * Math.sqrt(1 + T / 273);
const NAME = { 1: 'air', 1.333: 'fresh water', 1.309: 'ice', 1.52: 'crown glass', 1.66: 'flint glass', 2.419: 'diamond', 1.458: 'fused quartz',
 1.49: 'polystyrene', 1.51: 'Plexiglas', 1.434: 'fluorite', 1.923: 'zircon', 1.544: 'crystalline quartz', 1.361: 'ethanol', 1.473: 'glycerine' };
const rads = x => n(x) + (x === 1 ? ' radian' : ' radians');
const idx = v => v === 1 ? '1.00' : n(v);
const SOLID = [1.333, 1.309, 1.52, 1.66, 2.419, 1.458, 1.51, 1.434, 1.923, 1.544, 1.361, 1.473];
/* Tones whose wavelength in air (343 ÷ f) is short and tidy. */
const TONES = [98, 196, 245, 343, 490, 686, 980, 1372];

/* ---- q21 Shock waves and the Mach angle [V1 17.8] ---- */

/* q21b: the speed of sound is drawn (cold air), so 343 is not always the divisor. Answers: M (2 d.p.), half-angle (3 d.p.). */
mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The rocket sled at dawn',
 brief: 'Before sunrise the air on the Rover Track is cold, and the crew want to know what the rocket sled’s shock cone looks like in it.',
 labels: ['Mach number (no unit)', 'cone half-angle (rad)'], tolerance: 0.0005,
 gl: [['Mach number'], ['half-angle θ (rad)']]
}, {
 canonical: { c: 336, vs: 470 },
 draw: R => guard(() => { const c = R.int(325, 345); return { c, vs: R.int(Math.ceil(1.08 * c), 1100) }; },
  ({ c, vs }) => c !== 343 && ok(vs / c, 2) && ok(Math.asin(c / vs), 3), { c: 336, vs: 470 }),
 build: ({ c, vs }) => { const M = vs / c, s = c / vs, th = Math.asin(s); return {
  prompt: `Before sunrise the air at the Rover Track is cold, so sound travels at only ${n(c)} m/s. A rocket sled on the long rail beside the track slides at a steady ${n(vs)} m/s, faster than sound. Enter the sled’s Mach number (a pure number, no unit) to 2 decimal places, then the half-angle of its shock cone in radians to 3 decimal places. Use the unrounded Mach number for the angle.`,
  answer: [rd(M, 2), rd(th, 3)],
  hints: ['The Mach number compares the sled’s speed with the speed of sound in the air it is moving through today: divide the first by the second.', 'For the cone, sin θ is the speed of sound divided by the speed of the source. Take arcsin with the calculator set to radians.'],
  solution: `Today sound travels at ${n(c)} m/s, so M = ${n(vs)} ÷ ${n(c)} ${say(M, 2)}. The cone’s half-angle θ has sin θ = ${n(c)} ÷ ${n(vs)} ${eq4(s)}, so θ = arcsin(${n(s)}) ${say(th, 3, ' radians')}.`,
  guidance: [
   { prompt: `The sled moves at ${n(vs)} m/s and sound at ${n(c)} m/s. What is the Mach number, to 2 decimal places?`, answer: [rd(M, 2)], explanation: `M = ${n(vs)} ÷ ${n(c)} ${say(M, 2)}. It is more than 1, so the sled is supersonic.` },
   { prompt: `Now sin θ = ${n(c)} ÷ ${n(vs)}. With the calculator set to radians, what is the half-angle θ, to 3 decimal places?`, answer: [rd(th, 3)], explanation: `sin θ ${eq4(s)}, so θ = arcsin(${n(s)}) ${say(th, 3, ' radians')}.` }
  ] }; }
});

/* q21c: the cone angle is measured; the speed comes from v_s = 343 ÷ sin θ, then Mach number and a flying time. */
mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Reading the speed off a photo',
 brief: 'A camera on the Rover Track has caught a drone’s shock cone, and the crew want its speed without a radar.',
 labels: ['drone speed (m/s)', 'Mach number (no unit)', 'flight time (s)'], tolerance: 0.0005,
 gl: [['drone speed (m/s)'], ['Mach number'], ['flight time (s)']]
}, {
 canonical: { th: 0.45, D: 2400 },
 draw: R => guard(() => ({ th: R.int(40, 120) / 100, D: R.pick([1200, 1500, 1800, 2400, 3000, 3600]) }),
  ({ th, D }) => { const vs = V / Math.sin(th); return ok(vs, 1) && ok(vs / V, 2) && ok(D / vs, 1); }, { th: 0.45, D: 2400 }),
 build: ({ th, D }) => { const vs = V / Math.sin(th), M = vs / V, t = D / vs; return {
  prompt: `A camera beside the Rover Track photographs the shock cone of a drone flying in a straight line and measures its half-angle as ${rads(th)}. Sound travels at 343 m/s. For a shock cone, sin θ = v ÷ v_s, where θ is the half-angle, v the speed of sound and v_s the speed of the drone. Enter the drone’s speed in m/s to 1 decimal place, then its Mach number to 2 decimal places, then the time in seconds, to 1 decimal place, it needs to fly ${n(D)} m at that speed. Use unrounded values from one step to the next.`,
  answer: [rd(vs, 1), rd(M, 2), rd(t, 1)],
  hints: ['Rearrange sin θ = v ÷ v_s to get the drone’s speed v_s = v ÷ sin θ. Take the sine with the calculator set to radians.', 'The Mach number is the drone’s speed divided by the speed of sound, and a time is a distance divided by a speed.'],
  solution: `sin ${n(th)} ≈ ${n(Math.sin(th))} (radians), so v_s = 343 ÷ sin θ ${say(vs, 1, ' m/s')}. The Mach number is M = v_s ÷ 343 ${say(M, 2)}. The time to fly ${n(D)} m is ${n(D)} ÷ ${n(vs)} ${say(t, 1, ' s')}.`,
  guidance: [
   { prompt: `Use v_s = 343 ÷ sin θ with θ = ${rads(th)}. What is the drone’s speed in m/s, to 1 decimal place?`, answer: [rd(vs, 1)], explanation: `sin ${n(th)} ≈ ${n(Math.sin(th))}, so v_s = 343 ÷ ${n(Math.sin(th))} ${say(vs, 1, ' m/s')}.` },
   { prompt: 'Divide the unrounded speed by the speed of sound, 343 m/s. What is the Mach number, to 2 decimal places?', answer: [rd(M, 2)], explanation: `M = ${n(vs)} ÷ 343 ${say(M, 2)}, which is also 1 ÷ sin θ.` },
   { prompt: `How many seconds does the drone need to fly ${n(D)} m at the unrounded speed, to 1 decimal place?`, answer: [rd(t, 1)], explanation: `t = ${n(D)} ÷ ${n(vs)} ${say(t, 1, ' s')}.` }
  ] }; }
});

/* q21d (uses q19): Doppler speed of an approaching siren (m/s), then k times as fast, then Mach number and cone angle. */
mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q19', title: 'The scout drone’s booster',
 brief: 'A slow scout drone is about to fire its booster over the track, and the crew need its speed before and the cone it leaves after.',
 labels: ['speed before the boost (m/s)', 'Mach number after the boost (no unit)', 'cone half-angle after the boost (rad)'], tolerance: 0.0005,
 gl: [['speed before the boost (m/s)'], ['Mach number'], ['half-angle θ (rad)']]
}, {
 canonical: { fs: 450, fh: 600, k: 5 },
 draw: R => guard(() => { const fs = R.int(30, 90) * 10; return { fs, fh: fs + R.int(5, 40) * 10, k: R.pick([2, 2.5, 3, 4, 5, 6]) }; },
  ({ fs, fh, k }) => { const v1 = V * (1 - fs / fh), M = k * v1 / V; return v1 >= 50 && v1 <= 250 && M >= 1.15 && M <= 3.2 && ok(v1, 1) && ok(M, 2) && ok(Math.asin(1 / M), 3); }, { fs: 450, fh: 600, k: 5 }),
 build: ({ fs, fh, k }) => { const v1 = V * (1 - fs / fh), v2 = k * v1, M = v2 / V, s = V / v2, th = Math.asin(s); return {
  prompt: `A scout drone flies straight towards a listener standing at rest beside the Rover Track, sounding a steady siren whose own frequency is ${n(fs)} Hz. She hears ${n(fh)} Hz. Sound travels at 343 m/s, there is no wind, and the drone is slower than sound. Then its booster fires and, on the same straight line, it flies ${n(k)} times as fast as before. Enter its speed before the boost in m/s to 1 decimal place, then its Mach number after the boost to 2 decimal places, then the half-angle of its shock cone after the boost in radians to 3 decimal places. Use unrounded values from one step to the next.`,
  answer: [rd(v1, 1), rd(M, 2), rd(th, 3)],
  hints: ['For a source coming towards a listener at rest, f_heard = f_s × v ÷ (v − v_s). Rearrange it to find v_s.', 'After the boost the speed is the multiple times the old speed. Divide by 343 for the Mach number, and use sin θ = 1 ÷ M with arcsin in radians for the cone.'],
  solution: `Before the boost, ${n(fh)} = ${n(fs)} × 343 ÷ (343 − v_s), so v_s = 343 × (1 − ${n(fs)} ÷ ${n(fh)}) ${say(v1, 1, ' m/s')}. After the boost the speed is ${n(k)} × ${n(v1)} ${eq4(v2)} m/s, so M = ${n(v2)} ÷ 343 ${say(M, 2)}. The cone has sin θ = 1 ÷ M ${eq4(s)}, so θ = arcsin(${n(s)}) ${say(th, 3, ' radians')}.`,
  guidance: [
   { prompt: `She hears ${n(fh)} Hz from a ${n(fs)} Hz siren coming towards her. Use v_s = 343 × (1 − f_s ÷ f_heard). What is the drone’s speed before the boost in m/s, to 1 decimal place?`, answer: [rd(v1, 1)], explanation: `v_s = 343 × (1 − ${n(fs)} ÷ ${n(fh)}) ${say(v1, 1, ' m/s')}.` },
   { prompt: `After the boost the speed is ${n(k)} times the unrounded old speed. What is the Mach number, to 2 decimal places?`, answer: [rd(M, 2)], explanation: `The new speed is ${n(k)} × ${n(v1)} ${eq4(v2)} m/s, and M = ${n(v2)} ÷ 343 ${say(M, 2)}.` },
   { prompt: 'For the cone sin θ = 1 ÷ M. Take arcsin of the unrounded value with the calculator in radians. What is the half-angle θ in radians, to 3 decimal places?', answer: [rd(th, 3)], explanation: `sin θ ${eq4(s)}, so θ = arcsin(${n(s)}) ${say(th, 3, ' radians')}.` }
  ] }; }
});

/* ---- q22 Two speakers: path difference, loud and quiet spots [V1 16.5, 17.4] ---- */

/* q22b: the wavelength is asked first, the nearer speaker may be either one. Answers: λ, path difference, loud (1) or quiet (0). */
const TONES_B = [98, 140, 196, 245, 490, 980];
mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The photographer at the finish gate',
 brief: 'Two loudspeakers flank the finish gate of the Rover Track, and the crew want to know where the announcer’s tone is lost.',
 labels: ['wavelength (m)', 'path difference (m)', 'loud (1) or quiet (0)'], tolerance: 0.0005,
 gl: [['wavelength (m)'], ['path difference (m)'], ['loud (1) or quiet (0)']]
}, {
 canonical: { f: 245, near: 2.8, k: 5, farIsP: true },
 draw: R => guard(() => ({ f: R.pick(TONES_B), near: R.int(150, 700) / 100, k: R.int(1, 9), farIsP: R.bool() }),
  ({ f, near, k }) => near + k * V / f / 2 <= 12, { f: 245, near: 2.8, k: 5, farIsP: true }),
 build: ({ f, near, k, farIsP }) => { const lam = tid(V / f), dr = tid(k * lam / 2), far = tid(near + dr), P = farIsP ? far : near, Q = farIsP ? near : far, w = k / 2, loud = k % 2 === 0 ? 1 : 0; return {
  prompt: `Two loudspeakers, P and Q, stand either side of the finish gate of the Rover Track. One signal generator drives both, so they play the same ${n(f)} Hz tone in phase. Sound travels at 343 m/s. A photographer stands ${n(P)} m from P and ${n(Q)} m from Q. Enter the wavelength of the tone in metres, then the path difference in metres (the longer distance minus the shorter), then 1 if her spot is loud (the two waves reinforce) or 0 if it is quiet (they cancel).`,
  answer: [lam, dr, loud],
  hints: ['The wavelength comes from v = fλ. The path difference is the longer distance minus the shorter one, whichever speaker that is.', 'Divide the path difference by the wavelength. A whole number of wavelengths means loud; a whole number and a half means quiet.'],
  solution: `λ = 343 ÷ ${n(f)} = ${n(lam)} m. The path difference is ${n(far)} − ${n(near)} = ${n(dr)} m, which is ${n(dr)} ÷ ${n(lam)} = ${n(w)} wavelengths. ${loud ? 'That is a whole number of wavelengths, so crest meets crest: a loud spot (1).' : 'That is a whole number and a half of wavelengths, so crest meets trough and the waves cancel: a quiet spot (0).'}`,
  guidance: [
   { prompt: `What is the wavelength of a ${n(f)} Hz tone when sound travels at 343 m/s, in metres?`, answer: [lam], explanation: `λ = v ÷ f = 343 ÷ ${n(f)} = ${n(lam)} m.` },
   { prompt: `The photographer is ${n(P)} m from P and ${n(Q)} m from Q. What is the path difference, in metres?`, answer: [dr], explanation: `${n(far)} − ${n(near)} = ${n(dr)} m.` },
   { prompt: `The path difference is ${n(w)} wavelengths. Enter 1 if the spot is loud, or 0 if it is quiet.`, answer: [loud], explanation: loud ? `${n(w)} is a whole number, so the waves arrive in step and add: loud, 1.` : `${n(w)} is a whole number and a half, so a crest from one speaker arrives with a trough from the other: quiet, 0.` }
  ] }; }
});

/* q22c: place a microphone at a spot with a half-odd number of wavelengths of path difference; find B's distance. */
mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'A microphone in the dead spot',
 brief: 'The sound crew need a microphone at a spot where two start-line speakers cancel, to test how well the cancelling works.',
 labels: ['wavelength (m)', 'path difference (m)', 'distance from B (m)'], tolerance: 0.0005,
 gl: [['wavelength (m)'], ['path difference (m)'], ['distance from B (m)']]
}, {
 canonical: { f: 490, r1: 3.2, m: 2 },
 draw: R => ({ f: R.pick(TONES), r1: R.int(200, 700) / 100, m: R.int(0, 5) }),
 build: ({ f, r1, m }) => { const w = m + 0.5, lam = tid(V / f), dr = tid(w * lam), r2 = tid(r1 + dr); return {
  prompt: `Two speakers, A and B, at the start line of the Rover Track play the same ${n(f)} Hz tone in phase from one signal generator. Sound travels at 343 m/s. A technician wants to put a microphone at a spot ${n(r1)} m from A where the two sounds cancel, with B the farther speaker and the path difference exactly ${n(w)} wavelengths. Enter the wavelength of the tone in metres, then the path difference in metres, then how far the spot is from B in metres.`,
  answer: [lam, dr, r2],
  hints: ['The wavelength comes from v = fλ, and the path difference is the number of wavelengths times one wavelength.', 'The path difference is the farther distance minus the nearer one, so B’s distance is A’s distance plus the path difference.'],
  solution: `λ = 343 ÷ ${n(f)} = ${n(lam)} m. The path difference is ${n(w)} × ${n(lam)} = ${n(dr)} m: a whole number and a half of wavelengths, so crest meets trough and the sound cancels. B is the farther speaker, so its distance is ${n(r1)} + ${n(dr)} = ${n(r2)} m.`,
  guidance: [
   { prompt: `What is the wavelength of a ${n(f)} Hz tone when sound travels at 343 m/s, in metres?`, answer: [lam], explanation: `λ = v ÷ f = 343 ÷ ${n(f)} = ${n(lam)} m.` },
   { prompt: `What is a path difference of ${n(w)} wavelengths, in metres?`, answer: [dr], explanation: `${n(w)} × ${n(lam)} = ${n(dr)} m.` },
   { prompt: `The spot is ${n(r1)} m from A, and B is ${n(dr)} m farther. How far is the spot from B, in metres?`, answer: [r2], explanation: `${n(r1)} + ${n(dr)} = ${n(r2)} m.` }
  ] }; }
});

/* q22d (uses q14): the speed of sound comes from the air temperature; wavelength; B's distance for a path difference of w wavelengths. */
mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q14', title: 'Speakers in the frosty air',
 brief: 'The speed of sound on the Rover Track changes with the temperature, and so does every loud and quiet spot between the speakers.',
 labels: ['speed of sound (m/s)', 'wavelength (m)', 'distance from B (m)'], tolerance: 0.0005,
 gl: [['speed of sound (m/s)'], ['wavelength (m)'], ['distance from B (m)']]
}, {
 canonical: { T: 12, f: 400, r1: 3.2, w: 2.5 },
 draw: R => guard(() => ({ T: R.int(-15, 35), f: R.int(20, 100) * 10, r1: R.int(200, 700) / 100, w: R.pick([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5]) }),
  ({ T, f, r1, w }) => { const v = speedT(T), lam = v / f; return ok(v, 2) && ok(lam, 3) && ok(r1 + w * lam, 3); }, { T: 12, f: 400, r1: 3.2, w: 2.5 }),
 build: ({ T, f, r1, w }) => { const q = 1 + T / 273, v = speedT(T), lam = v / f, dr = w * lam, r2 = r1 + dr; return {
  prompt: `The air at the Rover Track is at ${n(T)} °C, and in air at T_C degrees Celsius sound travels at v = 331 √(1 + T_C ÷ 273) m/s. Two speakers, A and B, play the same ${n(f)} Hz tone in phase. A marshal stands ${n(r1)} m from A, and B is farther away, so that the path difference at her spot is exactly ${n(w)} wavelengths. Enter the speed of sound in m/s to 2 decimal places, then the wavelength of the tone in metres to 3 decimal places (from the unrounded speed), then her distance from B in metres to 3 decimal places (from the unrounded wavelength).`,
  answer: [rd(v, 2), rd(lam, 3), rd(r2, 3)],
  hints: ['Put the temperature into v = 331 √(1 + T_C ÷ 273); a temperature below 0 °C makes the fraction negative. The wavelength is then λ = v ÷ f.', 'The path difference in metres is the number of wavelengths times λ, and B’s distance is A’s distance plus the path difference.'],
  solution: `${tq(T)} ${eq4(q)}, so v = 331 × √${n(q)} ${say(v, 2, ' m/s')}. The wavelength is λ = ${n(v)} ÷ ${n(f)} ${say(lam, 3, ' m')}. The path difference is ${n(w)} × ${n(lam)} ${eq4(dr)} m, so her distance from B is ${n(r1)} + ${n(dr)} ${say(r2, 3, ' m')}.`,
  guidance: [
   { prompt: `Put ${n(T)} °C into v = 331 √(1 + T_C ÷ 273). What is the speed of sound in m/s, to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${tq(T)} ${eq4(q)}, so v = 331 × √${n(q)} ${say(v, 2, ' m/s')}.` },
   { prompt: `Divide the unrounded speed by the frequency, ${n(f)} Hz. What is the wavelength in metres, to 3 decimal places?`, answer: [rd(lam, 3)], explanation: `λ = v ÷ f = ${n(v)} ÷ ${n(f)} ${say(lam, 3, ' m')}.` },
   { prompt: `The path difference is ${n(w)} wavelengths and A is ${n(r1)} m away. Using the unrounded wavelength, how far is she from B, in metres to 3 decimal places?`, answer: [rd(r2, 3)], explanation: `The path difference is ${n(w)} × ${n(lam)} ${eq4(dr)} m, so B’s distance is ${n(r1)} + ${n(dr)} ${say(r2, 3, ' m')}.` }
  ] }; }
});

/* ---- q23 Chapter review: a siren on the track [V1 17.6, 17.7] ---- */

/* q23b: a drone flies past a microphone mast; the beat is taken against the receding tone. Answers: speed, own frequency, beat. */
const vsOf = (fa, fr) => V * (fa - fr) / (fa + fr), fsOf = (fa, fr) => 2 * fa * fr / (fa + fr);
mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The patrol drone and the mast',
 brief: 'A patrol drone with no speed readout has flown past the microphone mast, and all the crew have is the two pitches the mast heard.',
 labels: ['drone speed (m/s)', 'drone’s own frequency (Hz)', 'beat frequency (Hz)'], tolerance: 0.05,
 gl: [['drone speed (m/s)'], ['drone’s own frequency (Hz)'], ['beat frequency (Hz)']]
}, {
 canonical: { fa: 720, fr: 640 },
 draw: R => guard(() => { const fr = R.int(300, 900); return { fr, fa: fr + R.int(10, 250) }; },
  ({ fa, fr }) => { const vs = vsOf(fa, fr), fs = fsOf(fa, fr); return vs >= 8 && vs <= 60 && !(fa === 560 && fr === 480) && !(fa === 440 && fr === 360) && ok(vs, 1) && ok(fs, 1) && ok(fs - fr, 1); }, { fa: 720, fr: 640 }),
 build: ({ fa, fr }) => { const S = fa + fr, D = fa - fr, vs = V * D / S, fs = fa * (V - vs) / V, beat = fs - fr; return {
  prompt: `A patrol drone flies straight and level past the microphone mast at a steady speed, sounding a tone of fixed pitch. The mast is at rest and hears ${n(fa)} Hz while the drone comes towards it and ${n(fr)} Hz after the drone has passed. Sound travels at 343 m/s and there is no wind. Enter the drone’s speed in m/s, then the frequency of its own tone in Hz, then the beat frequency in Hz between the receding drone’s tone and a reference tone at the mast set to the drone’s own frequency. Give all three to 1 decimal place, using unrounded values from one step to the next.`,
  answer: [rd(vs, 1), rd(fs, 1), rd(beat, 1)],
  hints: ['Use f_heard = f_s × v ÷ (v − v_s) while the drone approaches and f_s × v ÷ (v + v_s) while it recedes. Divide one equation by the other so that f_s cancels, then solve for v_s.', 'Put v_s back into one of the equations to get f_s. The beat frequency is the difference between the two tones that sound together: the reference tone and the receding tone.'],
  solution: `Dividing the two equations cancels f_s: ${n(fa)} ÷ ${n(fr)} = (343 + v_s) ÷ (343 − v_s), so v_s = 343 × (${n(fa)} − ${n(fr)}) ÷ (${n(fa)} + ${n(fr)}) = 343 × ${n(D)} ÷ ${n(S)} ${say(vs, 1, ' m/s')}. Then f_s = ${n(fa)} × (343 − ${n(vs)}) ÷ 343 ${say(fs, 1, ' Hz')}. The reference tone and the receding tone beat at ${n(fs)} − ${n(fr)} ${say(beat, 1, ' Hz')}.`,
  guidance: [
   { prompt: `Use v_s = 343 × (f_towards − f_away) ÷ (f_towards + f_away) with ${n(fa)} Hz and ${n(fr)} Hz. What is the drone’s speed in m/s, to 1 decimal place?`, answer: [rd(vs, 1)], explanation: `v_s = 343 × ${n(D)} ÷ ${n(S)} ${say(vs, 1, ' m/s')}.` },
   { prompt: `Put the unrounded v_s into f_s = f_towards × (343 − v_s) ÷ 343. What is the drone’s own frequency in Hz, to 1 decimal place?`, answer: [rd(fs, 1)], explanation: `f_s = ${n(fa)} × (343 − ${n(vs)}) ÷ 343 ${say(fs, 1, ' Hz')}. It lies between the two heard frequencies, as it must.` },
   { prompt: `What is the beat frequency between the receding tone, ${n(fr)} Hz, and the drone’s own frequency, in Hz to 1 decimal place?`, answer: [rd(beat, 1)], explanation: `f_beat = ${n(fs)} − ${n(fr)} ${say(beat, 1, ' Hz')}.` }
  ] }; }
});

/* q23c: the siren's own frequency is known; one heard reading gives the speed, then the receding pitch and the time to the tower. */
mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'How long until the rover arrives',
 brief: 'The tower listener has one reading from an approaching rover, and the crew need its speed, its pitch afterwards and its arrival time.',
 labels: ['rover speed (m/s)', 'frequency after passing (Hz)', 'time to the tower (s)'], tolerance: 0.05,
 gl: [['rover speed (m/s)'], ['frequency after passing (Hz)'], ['time to the tower (s)']]
}, {
 canonical: { fs: 500, fa: 540, D: 400 },
 draw: R => guard(() => { const fs = R.int(30, 90) * 10; return { fs, fa: fs + R.int(2, 25) * 5, D: R.pick([150, 200, 250, 300, 400, 500, 600, 800]) }; },
  ({ fs, fa, D }) => { const v1 = V * (1 - fs / fa); return v1 >= 8 && v1 <= 50 && ok(v1, 1) && ok(fs * V / (V + v1), 1) && ok(D / v1, 1); }, { fs: 500, fa: 540, D: 400 }),
 build: ({ fs, fa, D }) => { const v1 = V * (1 - fs / fa), fr = fs * V / (V + v1), t = D / v1; return {
  prompt: `The spec plate on a rover says its siren’s own frequency is ${n(fs)} Hz. The rover drives straight towards the siren tower at a steady speed. At one moment it is ${n(D)} m from the tower, and a listener standing still at the tower hears ${n(fa)} Hz. Sound travels at 343 m/s and there is no wind. Enter the rover’s speed in m/s, then the frequency in Hz that the listener hears once the rover has passed and is driving away, then the time in seconds from that moment until the rover reaches the tower. Give all three to 1 decimal place, using unrounded values from one step to the next.`,
  answer: [rd(v1, 1), rd(fr, 1), rd(t, 1)],
  hints: ['While the rover comes towards the listener, f_heard = f_s × v ÷ (v − v_s). Rearrange it to find v_s.', 'Once it has passed, f_heard = f_s × v ÷ (v + v_s). The time to cover a distance is the distance divided by the speed.'],
  solution: `Approaching, ${n(fa)} = ${n(fs)} × 343 ÷ (343 − v_s), so v_s = 343 × (1 − ${n(fs)} ÷ ${n(fa)}) ${say(v1, 1, ' m/s')}. Driving away, f = ${n(fs)} × 343 ÷ (343 + ${n(v1)}) ${say(fr, 1, ' Hz')}. The rover covers ${n(D)} m in ${n(D)} ÷ ${n(v1)} ${say(t, 1, ' s')}.`,
  guidance: [
   { prompt: `Use v_s = 343 × (1 − f_s ÷ f_heard) with f_s = ${n(fs)} Hz and f_heard = ${n(fa)} Hz. What is the rover’s speed in m/s, to 1 decimal place?`, answer: [rd(v1, 1)], explanation: `v_s = 343 × (1 − ${n(fs)} ÷ ${n(fa)}) ${say(v1, 1, ' m/s')}.` },
   { prompt: `Put the unrounded speed into f = ${n(fs)} × 343 ÷ (343 + v_s). What frequency does the listener hear once the rover is driving away, in Hz to 1 decimal place?`, answer: [rd(fr, 1)], explanation: `f = ${n(fs)} × 343 ÷ (343 + ${n(v1)}) ${say(fr, 1, ' Hz')}, lower than the siren’s own ${n(fs)} Hz, as it must be.` },
   { prompt: `How many seconds does the rover need to cover ${n(D)} m at the unrounded speed, to 1 decimal place?`, answer: [rd(t, 1)], explanation: `t = ${n(D)} ÷ ${n(v1)} ${say(t, 1, ' s')}.` }
  ] }; }
});

/* q23d (uses q14): the speed of sound comes from the air temperature; then rover speed and the siren's own frequency. */
mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q14', title: 'A siren in cold air',
 brief: 'The track air is far from the textbook temperature, so the speed of sound has to be found before the rover can be clocked.',
 labels: ['speed of sound (m/s)', 'rover speed (m/s)', 'siren’s own frequency (Hz)'], tolerance: 0.005,
 gl: [['speed of sound (m/s)'], ['rover speed (m/s)'], ['siren’s own frequency (Hz)']]
}, {
 canonical: { T: -10, fa: 610, fr: 530 },
 draw: R => guard(() => { const fr = R.int(300, 900); return { T: R.int(-20, 30), fr, fa: fr + R.int(10, 250) }; },
  ({ T, fa, fr }) => { const vs = speedT(T) * (fa - fr) / (fa + fr); return vs >= 5 && vs <= 60 && ok(speedT(T), 2) && ok(vs, 1) && ok(fsOf(fa, fr), 1); }, { T: -10, fa: 610, fr: 530 }),
 build: ({ T, fa, fr }) => { const q = 1 + T / 273, v = speedT(T), S = fa + fr, D = fa - fr, vs = v * D / S, fs = fa * (v - vs) / v; return {
  prompt: `The air at the Rover Track is at ${n(T)} °C, and in air at T_C degrees Celsius sound travels at v = 331 √(1 + T_C ÷ 273) m/s. A rover drives straight past the siren tower at a steady speed. A listener standing still at the tower hears ${n(fa)} Hz while it approaches and ${n(fr)} Hz after it has passed, and there is no wind. Enter the speed of sound in m/s to 2 decimal places, then the rover’s speed in m/s to 1 decimal place, then the siren’s own frequency in Hz to 1 decimal place. Use unrounded values from one step to the next.`,
  answer: [rd(v, 2), rd(vs, 1), rd(fs, 1)],
  hints: ['Put the temperature into v = 331 √(1 + T_C ÷ 273); a temperature below 0 °C makes the fraction negative.', 'Dividing the approaching Doppler equation by the receding one cancels f_s and gives v_s = v × (f_towards − f_away) ÷ (f_towards + f_away), with the speed of sound you found, not 343. Then f_s = f_towards × (v − v_s) ÷ v.'],
  solution: `${tq(T)} ${eq4(q)}, so v = 331 × √${n(q)} ${say(v, 2, ' m/s')}. The rover’s speed is v_s = ${n(v)} × (${n(fa)} − ${n(fr)}) ÷ (${n(fa)} + ${n(fr)}) = ${n(v)} × ${n(D)} ÷ ${n(S)} ${say(vs, 1, ' m/s')}. Then f_s = ${n(fa)} × (${n(v)} − ${n(vs)}) ÷ ${n(v)} ${say(fs, 1, ' Hz')}.`,
  guidance: [
   { prompt: `Put ${n(T)} °C into v = 331 √(1 + T_C ÷ 273). What is the speed of sound in m/s, to 2 decimal places?`, answer: [rd(v, 2)], explanation: `${tq(T)} ${eq4(q)}, so v = 331 × √${n(q)} ${say(v, 2, ' m/s')}.` },
   { prompt: `Use v_s = v × (f_towards − f_away) ÷ (f_towards + f_away) with the unrounded speed of sound and ${n(fa)} Hz and ${n(fr)} Hz. What is the rover’s speed in m/s, to 1 decimal place?`, answer: [rd(vs, 1)], explanation: `v_s = ${n(v)} × ${n(D)} ÷ ${n(S)} ${say(vs, 1, ' m/s')}.` },
   { prompt: `Put the unrounded speeds into f_s = f_towards × (v − v_s) ÷ v. What is the siren’s own frequency in Hz, to 1 decimal place?`, answer: [rd(fs, 1)], explanation: `f_s = ${n(fa)} × (${n(v)} − ${n(vs)}) ÷ ${n(v)} ${say(fs, 1, ' Hz')}, between the two heard frequencies.` }
  ] }; }
});

/* ---- q24 The speed of light and the index of refraction, n = c/v [V3 1.1] ---- */

/* q24b: the speed in the sample is measured; find n and the wavelength inside. Answers: n (3 d.p.), wavelength inside (nm, 1 d.p.). */
mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'The unlabelled sample',
 brief: 'A sample in the Lens Workshop has lost its label, and the only thing the crew can measure is how fast a pulse of light crosses it.',
 labels: ['index of refraction (no unit)', 'wavelength inside (nm)'], tolerance: 0.0005,
 gl: [['index of refraction'], ['wavelength inside (nm)']]
}, {
 canonical: { v: 2.1, lam: 550 },
 draw: R => guard(() => ({ v: R.int(120, 250) / 100, lam: R.int(400, 700) }),
  ({ v, lam }) => !(v === 2.25 && lam === 500) && ok(3 / v, 3) && ok(lam * v / 3, 1), { v: 2.1, lam: 550 }),
 build: ({ v, lam }) => { const nn = 3 / v, li = lam / nn; return {
  prompt: `A technician in the Lens Workshop times light crossing a sample of an unlabelled clear material and finds that it travels at ${fx(v, 2)} in units of 10⁸ m/s. Take c = 3.00 × 10⁸ m/s. Enter the material’s index of refraction (no unit) to 3 decimal places. Then enter the wavelength, in nanometres to 1 decimal place, that a beam of ${n(lam)} nm in a vacuum has inside the sample. Use the unrounded index of refraction for the wavelength.`,
  answer: [rd(nn, 3), rd(li, 1)],
  hints: ['The index of refraction compares the speed of light in a vacuum with its speed in the material: n = c ÷ v. In units of 10⁸ m/s, c is 3.00.', 'The frequency stays the same when light enters the sample, so the wavelength shrinks by the same factor as the speed: λ inside = λ in a vacuum ÷ n.'],
  solution: `n = c ÷ v = 3.00 ÷ ${fx(v, 2)} ${say(nn, 3)}. Inside the sample the wavelength is ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.`,
  guidance: [
   { prompt: `Divide the speed of light in a vacuum, 3.00 in units of 10⁸ m/s, by the speed in the sample, ${fx(v, 2)}. What is the index of refraction, to 3 decimal places?`, answer: [rd(nn, 3)], explanation: `n = 3.00 ÷ ${fx(v, 2)} ${say(nn, 3)}. It is more than 1, as it must be for a material.` },
   { prompt: `Divide the vacuum wavelength, ${n(lam)} nm, by the unrounded index of refraction. What is the wavelength inside the sample, in nanometres to 1 decimal place?`, answer: [rd(li, 1)], explanation: `λ inside = ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}, shorter than in a vacuum.` }
  ] }; }
});

/* q24c: a pulse crosses a bar of length d; its speed, its crossing time (ns) and its delay against a vacuum crossing. */
mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'The pulse in the glass bar',
 brief: 'A timing pulse has to cross a long bar of glass in the Lens Workshop, and the crew want to know how much the glass delays it.',
 labels: ['speed in the bar (10⁸ m/s)', 'crossing time (ns)', 'delay (ns)'], tolerance: 0.0005,
 gl: [['speed in the bar (10⁸ m/s)'], ['crossing time (ns)'], ['delay (ns)']]
}, {
 canonical: { nn: 1.52, d: 0.6 },
 draw: R => guard(() => ({ nn: R.pick(SOLID), d: R.int(6, 30) / 20 }),
  ({ nn, d }) => ok(3 / nn, 3) && ok(10 * d * nn / 3, 3) && ok(10 * d * (nn - 1) / 3, 3), { nn: 1.52, d: 0.6 }),
 build: ({ nn, d }) => { const v = 3 / nn, t = 10 * d / v, t0 = 10 * d / 3, delay = t - t0, name = NAME[nn]; return {
  prompt: `A pulse of light crosses a straight bar of ${name} (index of refraction ${n(nn)}) that is ${n(d)} m long, from one end to the other along its length. Treat the pulse as travelling at the speed of light in the ${name}, and take c = 3.00 × 10⁸ m/s. A speed of 1 in units of 10⁸ m/s covers 0.1 m in each nanosecond (1 ns = 10⁻⁹ s). Enter the speed in the bar in units of 10⁸ m/s, then the time the pulse takes to cross the bar in ns, then how many ns later it arrives than a pulse that crosses ${n(d)} m of vacuum. Give all three to 3 decimal places, using unrounded values from one step to the next.`,
  answer: [rd(v, 3), rd(t, 3), rd(delay, 3)],
  hints: ['The speed in the material is v = c ÷ n, which in units of 10⁸ m/s is 3.00 ÷ n.', 'A time is the length divided by the speed, and the speed 1 (in units of 10⁸ m/s) covers 0.1 m each nanosecond. Work out the crossing time for the vacuum, where the speed is 3.00, and subtract.'],
  solution: `v = 3.00 ÷ ${n(nn)} ${say(v, 3)}, in units of 10⁸ m/s. That covers ${n(0.1 * v)} m each nanosecond, so the crossing takes ${n(d)} ÷ (0.1 × ${n(v)}) ${say(t, 3, ' ns')}. In a vacuum the speed 3.00 covers 0.3 m each nanosecond, so the crossing takes ${n(d)} ÷ 0.3 ${say(t0, 3, ' ns')}. The delay is ${n(t)} − ${n(t0)} ${say(delay, 3, ' ns')}.`,
  guidance: [
   { prompt: `What is 3.00 ÷ ${n(nn)}: the speed of light in the ${name} in units of 10⁸ m/s, to 3 decimal places?`, answer: [rd(v, 3)], explanation: `v = 3.00 ÷ ${n(nn)} ${say(v, 3)}.` },
   { prompt: `Each nanosecond the light covers 0.1 × (the unrounded speed) metres. How many nanoseconds does it need to cover ${n(d)} m, to 3 decimal places?`, answer: [rd(t, 3)], explanation: `t = ${n(d)} ÷ (0.1 × ${n(v)}) ${say(t, 3, ' ns')}.` },
   { prompt: `In a vacuum the light covers 0.3 m each nanosecond. How many ns later than a pulse crossing ${n(d)} m of vacuum does the pulse arrive, to 3 decimal places?`, answer: [rd(delay, 3)], explanation: `The vacuum crossing takes ${n(d)} ÷ 0.3 ${say(t0, 3, ' ns')}, so the delay is ${n(t)} − ${n(t0)} ${say(delay, 3, ' ns')}.` }
  ] }; }
});

/* q24d (uses q07): the frequency is given; vacuum wavelength, wavelength inside, and the speed inside from v = fλ. */
mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q07', title: 'A laser diode by its frequency',
 brief: 'The workshop’s laser diode is rated by its frequency, and the crew need its colour in a vacuum and in a plastic lens blank.',
 labels: ['wavelength in a vacuum (nm)', 'wavelength inside (nm)', 'speed inside (10⁸ m/s)'], tolerance: 0.0005,
 gl: [['wavelength in a vacuum (nm)'], ['wavelength inside (nm)'], ['speed inside (10⁸ m/s)']]
}, {
 canonical: { f: 5.2, nn: 1.49 },
 draw: R => guard(() => ({ f: R.int(430, 750) / 100, nn: R.pick(SOLID.concat([1.49])) }),
  ({ f, nn }) => ok(3000 / f, 1) && ok(3000 / f / nn, 1) && ok(3 / nn, 3), { f: 5.2, nn: 1.49 }),
 build: ({ f, nn }) => { const name = NAME[nn], l0 = 3000 / f, li = l0 / nn, v = f * li / 1000; return {
  prompt: `A tunable laser diode in the Lens Workshop emits light of frequency ${fx(f, 2)} in units of 10¹⁴ Hz, and the light then enters a blank of ${name} (index of refraction ${n(nn)}). Take c = 3.00 × 10⁸ m/s. Multiplying a frequency in units of 10¹⁴ Hz by a wavelength in nm and dividing by 1000 gives a speed in units of 10⁸ m/s. Enter the wavelength of the light in a vacuum in nm, then its wavelength inside the ${name} in nm, both to 1 decimal place, then its speed inside the ${name} in units of 10⁸ m/s to 3 decimal places, found from the unrounded wavelength inside by v = fλ.`,
  answer: [rd(l0, 1), rd(li, 1), rd(v, 3)],
  hints: ['In a vacuum v = fλ becomes λ = c ÷ f, which in these units is λ = 3000 ÷ f nanometres. The frequency does not change inside the material.', 'Inside, the wavelength is the vacuum wavelength divided by the index of refraction. Then multiply the frequency by that wavelength and divide by 1000.'],
  solution: `In a vacuum λ = 3000 ÷ ${fx(f, 2)} ${say(l0, 1, ' nm')}. Inside the ${name} the wavelength is ${n(l0)} ÷ ${n(nn)} ${say(li, 1, ' nm')}. The frequency is unchanged, so the speed is v = fλ = ${fx(f, 2)} × ${n(li)} ÷ 1000 ${say(v, 3)}, in units of 10⁸ m/s: the same as 3.00 ÷ ${n(nn)}.`,
  guidance: [
   { prompt: `In a vacuum λ = 3000 ÷ f nanometres, with f in units of 10¹⁴ Hz. What is the wavelength of light of frequency ${fx(f, 2)} in a vacuum, in nm to 1 decimal place?`, answer: [rd(l0, 1)], explanation: `λ = 3000 ÷ ${fx(f, 2)} ${say(l0, 1, ' nm')}.` },
   { prompt: `Divide the unrounded vacuum wavelength by the index of refraction, ${n(nn)}. What is the wavelength inside, in nm to 1 decimal place?`, answer: [rd(li, 1)], explanation: `λ inside = ${n(l0)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.` },
   { prompt: `Multiply the frequency ${fx(f, 2)} by the unrounded wavelength inside and divide by 1000. What is the speed inside, in units of 10⁸ m/s to 3 decimal places?`, answer: [rd(v, 3)], explanation: `v = ${fx(f, 2)} × ${n(li)} ÷ 1000 ${say(v, 3)}, which agrees with 3.00 ÷ ${n(nn)}.` }
  ] }; }
});

/* ---- q25 Reflection and Snell's law, n₁ sin θ₁ = n₂ sin θ₂ [V3 1.2, 1.3] ---- */

/* q25b: the beam's angle is given from the surface, not the normal. Answers: angle from the normal, refracted angle. */
const PAIRS = [1, 1.333, 1.309, 1.52, 1.66, 2.419, 1.458, 1.51];
mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The laser on the alignment bench',
 brief: 'The alignment bench aims its laser by the angle to the lens blank’s surface, but the optics sums need the angle to the normal.',
 labels: ['angle of incidence from the normal (rad)', 'refracted angle from the normal (rad)'], tolerance: 0.0005,
 gl: [['angle from the normal (rad)'], ['refracted angle θ₂ (rad)']]
}, {
 canonical: { n1: 1, n2: 2.419, a: 0.6 },
 draw: R => guard(() => ({ n1: R.pick(PAIRS), n2: R.pick(PAIRS), a: R.int(15, 130) / 100 }),
  ({ n1, n2, a }) => { const t1 = Math.PI / 2 - a, s = n1 * Math.sin(t1) / n2; return n1 !== n2 && s < 0.95 && ok(t1, 3) && ok(s, 3) && ok(Math.asin(s), 3); }, { n1: 1, n2: 2.419, a: 0.6 }),
 build: ({ n1, n2, a }) => { const A = NAME[n1], B = NAME[n2], t1 = Math.PI / 2 - a, st = Math.sin(t1), s = n1 * st / n2, t2 = Math.asin(s); return {
  prompt: `A laser on the alignment bench in the Lens Workshop is aimed from ${A} (index of refraction ${idx(n1)}) at a flat slab of ${B} (index ${idx(n2)}). The beam makes an angle of ${rads(a)} with the surface of the slab itself, not with the normal. Enter the angle of incidence, measured from the normal, in radians to 3 decimal places. Then enter the angle of the refracted beam from the normal, in radians to 3 decimal places, using the unrounded angle of incidence.`,
  answer: [rd(t1, 3), rd(t2, 3)],
  hints: ['The normal is at right angles to the surface, π/2 radians away from it, so an angle measured from the surface is π/2 minus an angle measured from the normal.', 'Snell’s law: n₁ sin θ₁ = n₂ sin θ₂, with both angles measured from the normal. Find sin θ₂, then take arcsin with the calculator set to radians.'],
  solution: `The angle from the normal is π/2 − ${n(a)} ${say(t1, 3, ' rad')}. By Snell’s law, sin θ₂ = ${idx(n1)} × sin ${n(t1)} ÷ ${idx(n2)} = ${idx(n1)} × ${n(st)} ÷ ${idx(n2)} ${eq4(s)}, so θ₂ = arcsin(${n(s)}) ${say(t2, 3, ' rad')}. ${n2 > n1 ? 'The ray bends towards the normal, as it enters a larger index of refraction.' : 'The ray bends away from the normal, as it enters a smaller index of refraction.'}`,
  guidance: [
   { prompt: `The beam is ${n(a)} rad from the surface, and the normal is π/2 ≈ 1.5708 rad from the surface. What is the angle of incidence from the normal, in radians to 3 decimal places?`, answer: [rd(t1, 3)], explanation: `θ₁ = π/2 − ${n(a)} ${say(t1, 3, ' rad')}.` },
   { prompt: `By Snell’s law sin θ₂ = ${idx(n1)} × sin θ₁ ÷ ${idx(n2)}, with the unrounded θ₁. What is the refracted angle θ₂ in radians, to 3 decimal places?`, answer: [rd(t2, 3)], explanation: `sin θ₁ ≈ ${n(st)} (radians), so sin θ₂ = ${idx(n1)} × ${n(st)} ÷ ${idx(n2)} ${eq4(s)} and θ₂ = arcsin(${n(s)}) ${say(t2, 3, ' rad')}.` }
  ] }; }
});

/* q25c: air, then a thin parallel sheet n2, then a block n3. Answers: angle in the sheet, angle in the block, turn from the air direction. */
mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Through the sheet and into the block',
 brief: 'A test beam has to pass through a thin protective sheet before it reaches the lens block, and the jig needs the angle in each layer.',
 labels: ['angle inside the sheet (rad)', 'angle inside the block (rad)', 'turn from the air direction (rad)'], tolerance: 0.0005,
 gl: [['angle in the sheet (rad)'], ['angle in the block (rad)'], ['turn (rad)']]
}, {
 canonical: { n2: 1.52, n3: 1.333, a: 0.9 },
 draw: R => guard(() => ({ n2: R.pick(SOLID), n3: R.pick(SOLID), a: R.int(25, 140) / 100 }),
  ({ n2, n3, a }) => { const s2 = Math.sin(a) / n2, t2 = Math.asin(s2), s3 = n2 * s2 / n3, t3 = Math.asin(s3);
   return n2 !== n3 && s3 < 0.95 && ok(s2, 3) && ok(t2, 3) && ok(s3, 3) && ok(t3, 3) && ok(Math.abs(t3 - a), 3); }, { n2: 1.52, n3: 1.333, a: 0.9 }),
 build: ({ n2, n3, a }) => { const A = NAME[n2], B = NAME[n3], sa = Math.sin(a), s2 = sa / n2, t2 = Math.asin(s2), s3 = n2 * s2 / n3, t3 = Math.asin(s3), turn = Math.abs(t3 - a); return {
  prompt: `A test beam in the Lens Workshop travels through air (index of refraction 1.00) and meets a thin flat sheet of ${A} (index ${n(n2)}) that lies on a flat block of ${B} (index ${n(n3)}). The surfaces are parallel, so the angle the ray makes with the normal inside the sheet is the same when it reaches the lower surface. The beam meets the top of the sheet at ${rads(a)} from the normal. Enter the angle from the normal inside the sheet, then the angle from the normal inside the block, both in radians to 3 decimal places. Then enter, in radians to 3 decimal places, how far the ray’s angle from the normal in the block differs from its angle in the air (a positive number). Use unrounded values from one step to the next.`,
  answer: [rd(t2, 3), rd(t3, 3), rd(turn, 3)],
  hints: ['Apply Snell’s law twice: first from the air into the sheet, then from the sheet into the block, using the angle you found for the sheet as the angle of incidence at the block.', 'Each time, n₁ sin θ₁ = n₂ sin θ₂ with angles from the normal, and arcsin with the calculator set to radians gives the angle back. The last answer is the difference of two angles, taken as positive.'],
  solution: `Air into the ${A}: sin θ₂ = 1.00 × sin ${n(a)} ÷ ${n(n2)} = ${n(sa)} ÷ ${n(n2)} ${eq4(s2)}, so θ₂ = arcsin(${n(s2)}) ${say(t2, 3, ' rad')}. The ${A} into the ${B}: sin θ₃ = ${n(n2)} × ${n(s2)} ÷ ${n(n3)} ${eq4(s3)}, so θ₃ = arcsin(${n(s3)}) ${say(t3, 3, ' rad')}. The ray’s angle from the normal changed from ${n(a)} rad to ${n(t3)} rad, a difference of ${say(turn, 3, ' rad')}.`,
  guidance: [
   { prompt: `By Snell’s law sin θ₂ = 1.00 × sin ${n(a)} ÷ ${n(n2)}. What is the angle inside the sheet, θ₂, in radians to 3 decimal places?`, answer: [rd(t2, 3)], explanation: `sin ${n(a)} ≈ ${n(sa)}, so sin θ₂ ${eq4(s2)} and θ₂ = arcsin(${n(s2)}) ${say(t2, 3, ' rad')}.` },
   { prompt: `At the lower surface sin θ₃ = ${n(n2)} × sin θ₂ ÷ ${n(n3)}, using the unrounded θ₂. What is the angle inside the block, θ₃, in radians to 3 decimal places?`, answer: [rd(t3, 3)], explanation: `sin θ₃ = ${n(n2)} × ${n(s2)} ÷ ${n(n3)} ${eq4(s3)}, so θ₃ = arcsin(${n(s3)}) ${say(t3, 3, ' rad')}.` },
   { prompt: `The ray was ${n(a)} rad from the normal in the air. How far is that from its unrounded angle θ₃ in the block, as a positive number of radians to 3 decimal places?`, answer: [rd(turn, 3)], explanation: `|${n(t3)} − ${n(a)}| ${say(turn, 3, ' rad')}.` }
  ] }; }
});

/* q25d (uses q24): the fuel's index comes from a measured speed; then the refracted angle and the wavelength inside. */
mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q24', title: 'The fuel quality sensor',
 brief: 'A fuel sensor in the workshop works out the fuel’s index from how fast light crosses it, then aims its beam by Snell’s law.',
 labels: ['index of refraction (no unit)', 'refracted angle (rad)', 'wavelength inside (nm)'], tolerance: 0.0005,
 gl: [['index of refraction'], ['refracted angle θ₂ (rad)'], ['wavelength inside (nm)']]
}, {
 canonical: { v: 1.75, a: 0.9, lam: 500 },
 draw: R => guard(() => ({ v: R.int(130, 230) / 100, a: R.int(20, 140) / 100, lam: R.int(400, 700) }),
  ({ v, a, lam }) => { const nn = 3 / v, s = Math.sin(a) / nn; return ok(nn, 3) && ok(s, 3) && ok(Math.asin(s), 3) && ok(lam * v / 3, 1); }, { v: 1.75, a: 0.9, lam: 500 }),
 build: ({ v, a, lam }) => { const nn = 3 / v, sa = Math.sin(a), s = sa / nn, t2 = Math.asin(s), li = lam / nn; return {
  prompt: `A fuel-quality sensor in the Lens Workshop shines a beam of vacuum wavelength ${n(lam)} nm from air (index of refraction 1.00) into a clear fuel, meeting its flat surface at ${rads(a)} from the normal. A timing test shows that light crosses the fuel at ${fx(v, 2)} in units of 10⁸ m/s. Take c = 3.00 × 10⁸ m/s. Enter the fuel’s index of refraction to 3 decimal places, then the angle of the refracted beam from the normal in radians to 3 decimal places, then the wavelength of the light inside the fuel in nanometres to 1 decimal place. Use the unrounded index of refraction in the later steps.`,
  answer: [rd(nn, 3), rd(t2, 3), rd(li, 1)],
  hints: ['The index of refraction is n = c ÷ v, which in units of 10⁸ m/s is 3.00 ÷ v.', 'Snell’s law with air as the first material gives sin θ₂ = sin θ₁ ÷ n; use arcsin in radians. The wavelength inside is the vacuum wavelength divided by n.'],
  solution: `n = 3.00 ÷ ${fx(v, 2)} ${say(nn, 3)}. By Snell’s law, sin θ₂ = 1.00 × sin ${n(a)} ÷ ${n(nn)} = ${n(sa)} ÷ ${n(nn)} ${eq4(s)}, so θ₂ = arcsin(${n(s)}) ${say(t2, 3, ' rad')}. Inside the fuel the wavelength is ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.`,
  guidance: [
   { prompt: `Divide 3.00 by the speed in the fuel, ${fx(v, 2)} in units of 10⁸ m/s. What is the index of refraction, to 3 decimal places?`, answer: [rd(nn, 3)], explanation: `n = 3.00 ÷ ${fx(v, 2)} ${say(nn, 3)}.` },
   { prompt: `Now sin θ₂ = 1.00 × sin ${n(a)} ÷ n, with the unrounded n. What is the refracted angle θ₂ in radians, to 3 decimal places?`, answer: [rd(t2, 3)], explanation: `sin ${n(a)} ≈ ${n(sa)} (radians), so sin θ₂ ${eq4(s)} and θ₂ = arcsin(${n(s)}) ${say(t2, 3, ' rad')}.` },
   { prompt: `Divide the vacuum wavelength, ${n(lam)} nm, by the unrounded index of refraction. What is the wavelength inside the fuel, in nm to 1 decimal place?`, answer: [rd(li, 1)], explanation: `λ inside = ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.` }
  ] }; }
});

})();
