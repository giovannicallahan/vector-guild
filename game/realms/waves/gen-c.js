/* Waves: sound and light mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Rounding to dp decimal places, symmetric about 0. */
const rd = (x, dp) => { const f = Math.pow(10, dp); return Math.sign(x) * Math.round(Math.abs(x) * f) / f; };
const exact = (x, dp) => Math.abs(x - rd(x, dp)) < 1e-9;
/* A value is safe to ask for to dp places when it is exact there, or when it is well away from a rounding tie and its
   four-decimal form differs from its rounded form (so the solution never says "≈ 2.49, which is 2.49"). */
const ok = (x, dp) => { if (exact(x, dp)) return true; const s = Math.abs(x) * Math.pow(10, dp), fr = s - Math.floor(s);
 return Math.abs(fr - 0.5) > 0.05 && (dp >= 4 || rd(x, 4) !== rd(x, dp)); };
const places = dp => `${dp} decimal place${dp === 1 ? '' : 's'}`;
/* "= 30" for an exact value, otherwise "≈ 26.6667, which is 26.7 to 1 decimal place" (or "≈ 0.2424" at 4 places). */
const say = (x, dp, u = '') => exact(x, dp) ? `= ${n(rd(x, dp))}${u}` : dp >= 4 ? `≈ ${n(x)}${u}` : `≈ ${n(x)}${u}, which is ${n(rd(x, dp))}${u} to ${places(dp)}`;
/* "≈ 0.6660" for a value used on unrounded, "= 0.24" when it is exact at four places. */
const eq4 = x => exact(x, 4) ? `= ${n(x)}` : `≈ ${n(x)}`;
/* arcsin of a sine shown to 4 places: name the rounded sine only when its arcsin gives the same angle at 4 places, so a
   player who keys in the shown value gets the shown angle; otherwise point to the unrounded sine. */
const arc = s => exact(s, 4) || rd(Math.asin(rd(s, 4)), 4) === rd(Math.asin(s), 4) ? `arcsin(${n(s)})` : 'arcsin of the unrounded sine';
const ofIt = s => exact(s, 4) || rd(Math.asin(rd(s, 4)), 4) === rd(Math.asin(s), 4) ? 'arcsin of it' : 'arcsin of the unrounded sine';
const V = 343;
/* "1 wavelength", "2.5 wavelengths". */
const wl = w => `${n(w)} wavelength${w === 1 ? '' : 's'}`;
/* Indices of refraction from OpenStax University Physics Volume 3, Table 1.1 (589 nm light); air is taken as 1.00. */
const MAT = { 1: 'air', 1.333: 'fresh water', 1.309: 'ice', 1.52: 'crown glass', 1.66: 'flint glass', 2.419: 'diamond', 1.458: 'fused quartz',
 1.49: 'polystyrene', 1.51: 'Plexiglas', 1.434: 'fluorite', 1.923: 'zircon', 1.544: 'crystalline quartz', 1.361: 'ethanol', 1.473: 'glycerine' };
const idx = v => v === 1 ? '1.00' : n(v);
/* q28: the optic is chosen by its kind; the kind only picks words, the signed focal length f carries the maths. */
const OPTIC = [
 { name: 'converging lens', sign: 'positive', mirror: false },
 { name: 'diverging lens', sign: 'negative', mirror: false },
 { name: 'concave mirror', sign: 'positive', mirror: true },
 { name: 'convex mirror', sign: 'negative', mirror: true }
];
const guard = (make, fits, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (fits(p)) return p; } return fallback; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Mach number vs ÷ 343 and the cone half-angle arcsin(343 ÷ vs). Not the worked example (686 m/s, Mach 2), never
    a whole-number Mach number (1029 m/s), and every rounded value away from a tie. */
 q21: {
  canonical: { vs: 540 },
  draw: R => guard(() => ({ vs: R.int(380, 1300) }), ({ vs }) => vs !== 686 && vs % 343 !== 0 && ok(vs / V, 2) && ok(V / vs, 3) && ok(Math.asin(V / vs), 3), { vs: 540 }),
  build: ({ vs }) => { const M = vs / V, s = V / vs, th = Math.asin(s); return {
   prompt: `A test drone flies level over the Rover Track at ${n(vs)} m/s, faster than sound, which travels at 343 m/s here. Enter its Mach number (a pure number, no unit) to 2 decimal places, then the half-angle of its shock cone in radians to 3 decimal places. Use the unrounded Mach number for the angle.`,
   answer: [rd(M, 2), rd(th, 3)],
   hints: ['The Mach number is the speed of the source divided by the speed of sound: M = v_s ÷ v.', 'The half-angle θ of the cone obeys sin θ = v ÷ v_s, which is 1 ÷ M. Take arcsin with the calculator set to radians.'],
   solution: `The Mach number is M = ${n(vs)} ÷ 343 ${say(M, 2)}. The cone’s half-angle θ has sin θ = 343 ÷ ${n(vs)} ${eq4(s)}, so θ = ${arc(s)} ${say(th, 3, ' radians')}. The drone outruns its own sound, so the crests pile up along a cone that trails behind it: that cone is the shock wave, heard on the ground as a sonic boom.`,
   guidance: [
    { prompt: `The drone flies at ${n(vs)} m/s and sound travels at 343 m/s. What is the Mach number, to 2 decimal places?`, answer: [rd(M, 2)], explanation: `M = ${n(vs)} ÷ 343 ${say(M, 2)}. It is more than 1, so the drone is supersonic and makes a shock wave.` },
    { prompt: `For the cone, sin θ = 343 ÷ ${n(vs)}. What is sin θ, to 3 decimal places?`, answer: [rd(s, 3)], explanation: `343 ÷ ${n(vs)} ${say(s, 3)}. It is the same as 1 ÷ M.` },
    { prompt: 'Take arcsin of the unrounded sin θ, with the calculator set to radians. What is the half-angle θ in radians, to 3 decimal places?', answer: [rd(th, 3)], explanation: `θ = ${arc(s)} ${say(th, 3, ' radians')}. A faster drone gives a smaller sine and so a narrower cone.` }
   ] }; }
 },
 /* Two speakers in phase at f Hz; the wavelength 343 ÷ f is short (f from the list), and the path difference is k half
    wavelengths (k drawn, then forgotten: the params are f, r1 and r2 = r1 + kλ/2, all printed), so k even is loud and k odd
    is quiet. Not the worked example (343 Hz, 3 m and 4.5 m). */
 q22: {
  canonical: { f: 686, r1: 2.4, r2: 3.9 },
  draw: R => guard(() => { const f = R.pick([196, 245, 343, 490, 686, 980, 1372]), r1 = R.int(150, 600) / 100, k = R.int(1, 9); return { f, r1, r2: G.tidy(r1 + k * G.tidy(V / f) / 2) }; },
   p => !(p.f === 343 && p.r1 === 3 && p.r2 === 4.5), { f: 686, r1: 2.4, r2: 3.9 }),
  build: ({ f, r1, r2 }) => { const lam = G.tidy(V / f), dr = G.tidy(r2 - r1), w = G.tidy(dr / lam), loud = Number.isInteger(w) ? 1 : 0; return {
   prompt: `Two speakers at the edge of the Rover Track are wired to the same signal generator, so they send out the same ${n(f)} Hz tone in phase. Sound travels at 343 m/s. A marshal stands ${n(r1)} m from speaker A and ${n(r2)} m from speaker B. Enter the path difference in metres, then the path difference in wavelengths, then 1 if the marshal’s spot is loud (constructive interference) or 0 if it is quiet (destructive interference).`,
   answer: [dr, w, loud],
   hints: ['The path difference is the longer distance minus the shorter one. One wavelength is the speed of sound divided by the frequency.', 'A path difference of a whole number of wavelengths means crest meets crest and the sound is loud; a whole number and a half means crest meets trough and the sound largely cancels.'],
   solution: `The path difference is ${n(r2)} − ${n(r1)} = ${n(dr)} m. One wavelength is 343 ÷ ${n(f)} = ${n(lam)} m, so the path difference is ${n(dr)} ÷ ${n(lam)} = ${wl(w)}. ${loud ? 'That is a whole number of wavelengths, so crests from the two speakers arrive together: constructive interference, a loud spot (1).' : 'That is a whole number and a half, so a crest from one speaker arrives with a trough from the other: destructive interference, a quiet spot (0). The sound from the farther speaker is a little weaker there, so the cancelling is not complete, but the spot is quiet.'}`,
   guidance: [
    { prompt: `The marshal is ${n(r1)} m from A and ${n(r2)} m from B. What is the path difference, in metres?`, answer: [dr], explanation: `${n(r2)} − ${n(r1)} = ${n(dr)} m: the sound from B travels that much farther.` },
    { prompt: `What is the wavelength of a ${n(f)} Hz tone when sound travels at 343 m/s, in metres?`, answer: [lam], explanation: `λ = v ÷ f = 343 ÷ ${n(f)} = ${n(lam)} m.` },
    { prompt: `How many wavelengths is a path difference of ${n(dr)} m?`, answer: [w], explanation: `${n(dr)} ÷ ${n(lam)} = ${wl(w)}.` },
    { prompt: `The path difference is ${wl(w)}. Enter 1 if the spot is loud, or 0 if it is quiet.`, answer: [loud], explanation: loud ? `${n(w)} is a whole number, so the two waves arrive in step and add: loud, 1.` : `${n(w)} is a whole number and a half, so the two waves arrive opposite and largely cancel: quiet, 0.` }
   ] }; }
 },
 /* Heard frequencies fa (approaching) and fr (receding) from a rover passing a listener at rest. vs = 343(fa − fr) ÷ (fa + fr),
    fs = 2·fa·fr ÷ (fa + fr), beats fa − fs. Speeds 5 to 45 m/s; no rounding ties; not the worked example (440 Hz, 360 Hz). */
 q23: {
  canonical: { fa: 560, fr: 480 },
  draw: R => guard(() => { const fr = R.int(300, 700); return { fr, fa: fr + R.int(10, 200) }; }, ({ fa, fr }) => {
   const vs = V * (fa - fr) / (fa + fr), fs = 2 * fa * fr / (fa + fr);
   return vs >= 5 && vs <= 45 && !(fa === 440 && fr === 360) && ok(vs, 1) && ok(fs, 1) && ok(fa - fs, 1); }, { fa: 560, fr: 480 }),
  build: ({ fa, fr }) => { const S = fa + fr, D = fa - fr, vs = V * D / S, fs = fa * (V - vs) / V, beat = fa - fs; return {
   prompt: `A rover drives past the siren tower at a steady speed, sounding its siren. The tower stands right at the edge of the track, so close to it that the rover’s motion counts as straight towards the tower and then straight away from it. A listener standing still at the tower hears ${n(fa)} Hz while the rover comes towards her and ${n(fr)} Hz after it has passed. Sound travels at 343 m/s and there is no wind. Enter the rover’s speed in m/s, then the siren’s own frequency in Hz, then the beat frequency in Hz that she would hear between the approaching siren and a horn at the tower that plays the siren’s own frequency. Give all three to 1 decimal place, using unrounded values from one step to the next.`,
   answer: [rd(vs, 1), rd(fs, 1), rd(beat, 1)],
   hints: ['For a source moving towards a listener at rest, f_heard = f_s × v ÷ (v − v_s); moving away, f_heard = f_s × v ÷ (v + v_s). Divide one equation by the other so that f_s cancels, then solve for v_s.', 'The beat frequency is the difference between two frequencies sounding together: f_beat = |f₂ − f₁|.'],
   solution: `Dividing the approaching equation by the leaving one cancels f_s: ${n(fa)} ÷ ${n(fr)} = (343 + v_s) ÷ (343 − v_s). Cross-multiplying, ${n(fa)} × (343 − v_s) = ${n(fr)} × (343 + v_s), so v_s = 343 × (${n(fa)} − ${n(fr)}) ÷ (${n(fa)} + ${n(fr)}) = 343 × ${n(D)} ÷ ${n(S)} ${say(vs, 1, ' m/s')}. Then f_s = ${n(fa)} × (343 − v_s) ÷ 343 ${say(fs, 1, ' Hz')}. The horn and the approaching siren beat at ${n(fa)} − ${n(fs)} ${say(beat, 1, ' Hz')}.`,
   guidance: [
    { prompt: `Use v_s = 343 × (f_towards − f_away) ÷ (f_towards + f_away) with ${n(fa)} Hz and ${n(fr)} Hz. What is the rover’s speed in m/s, to 1 decimal place?`, answer: [rd(vs, 1)], explanation: `v_s = 343 × ${n(D)} ÷ ${n(S)} ${say(vs, 1, ' m/s')}.` },
    { prompt: 'Put the unrounded v_s into f_s = f_towards × (343 − v_s) ÷ 343. What is the siren’s own frequency in Hz, to 1 decimal place?', answer: [rd(fs, 1)], explanation: `f_s = ${n(fa)} × (343 − ${n(vs)}) ÷ 343 ${say(fs, 1, ' Hz')}. It lies between the two heard frequencies, as it must.` },
    { prompt: `What is the beat frequency between ${n(fa)} Hz and the siren’s own frequency, in Hz to 1 decimal place?`, answer: [rd(beat, 1)], explanation: `f_beat = ${n(fa)} − ${n(fs)} ${say(beat, 1, ' Hz')}.` }
   ] }; }
 },
 /* Vacuum wavelength lam (nm) into a material of index nn from Table 1.1. Speed 3 ÷ nn (units of 10⁸ m/s), frequency
    3000 ÷ lam (units of 10¹⁴ Hz), wavelength inside lam ÷ nn. Not the worked example (water, 500 nm). */
 q24: {
  canonical: { nn: 1.52, lam: 600 },
  draw: R => guard(() => ({ nn: R.pick([1.333, 1.309, 1.52, 1.66, 2.419, 1.458, 1.49, 1.51, 1.434, 1.923, 1.361, 1.473]), lam: R.int(400, 700) }),
   ({ nn, lam }) => !(nn === 1.333 && lam === 500) && ok(3 / nn, 3) && ok(3000 / lam, 3) && ok(lam / nn, 1), { nn: 1.52, lam: 600 }),
  build: ({ nn, lam }) => { const name = MAT[nn], v = 3 / nn, f = 3000 / lam, li = lam / nn; return {
   prompt: `A laser beam whose wavelength in a vacuum is ${n(lam)} nm passes into a block of ${name}, whose index of refraction is ${n(nn)}. Take c = 3.00 × 10⁸ m/s. Enter the speed of light in the ${name} in units of 10⁸ m/s, to 3 decimal places, then the wavelength of the light inside the ${name} in nanometres, to 1 decimal place.`,
   answer: [rd(v, 3), rd(li, 1)],
   hints: ['The index of refraction is n = c ÷ v, so the speed in the material is v = c ÷ n.', 'The frequency does not change when light enters a material. With v = fλ and v smaller by the factor n, the wavelength is smaller by the same factor: λ inside = λ in a vacuum ÷ n.'],
   solution: `v = c ÷ n = 3.00 ÷ ${n(nn)} ${say(v, 3)}, in units of 10⁸ m/s. The frequency, the same in the vacuum and in the ${name}, is f = c ÷ λ = 3000 ÷ ${n(lam)} ${say(f, 3)}, in units of 10¹⁴ Hz. Inside, the light is ${n(nn)} times slower at the same frequency, so its wavelength is ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.`,
   guidance: [
    { prompt: `What is 3.00 ÷ ${n(nn)}: the speed of light in the ${name} in units of 10⁸ m/s, to 3 decimal places?`, answer: [rd(v, 3)], explanation: `v = c ÷ n = 3.00 ÷ ${n(nn)} ${say(v, 3)}, so light is ${n(nn)} times slower in the ${name} than in a vacuum.` },
    { prompt: `The frequency is f = c ÷ λ. With c = 3 × 10⁸ m/s and λ = ${n(lam)} × 10⁻⁹ m, f = (3000 ÷ ${n(lam)}) × 10¹⁴ Hz. What is f in units of 10¹⁴ Hz, to 3 decimal places?`, answer: [rd(f, 3)], explanation: `3000 ÷ ${n(lam)} ${say(f, 3)}, so f is about ${n(rd(f, 3))} × 10¹⁴ Hz, in the vacuum and in the ${name} alike.` },
    { prompt: `Same frequency, speed ${n(nn)} times smaller: what is the wavelength inside the ${name} in nanometres, to 1 decimal place?`, answer: [rd(li, 1)], explanation: `λ inside = ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.` }
   ] }; }
 },
 /* A ray from n1 into n2 at a (radians, 2 decimals) from the normal. Reflected ray: π/2 − a from the surface. Refracted:
    arcsin(n1 sin a ÷ n2), kept below sin 0.95 (no total internal reflection, which q26 teaches). Not the worked example
    (air into crown glass at 0.5). */
 q25: {
  canonical: { n1: 1, n2: 1.333, a: 0.8 },
  draw: R => guard(() => { const list = [1, 1.333, 1.309, 1.52, 1.66, 2.419, 1.458, 1.51]; return { n1: R.pick(list), n2: R.pick(list), a: R.int(20, 130) / 100 }; },
   ({ n1, n2, a }) => { const s = n1 * Math.sin(a) / n2; return n1 !== n2 && a !== 1 && s < 0.95 && !(n1 === 1 && n2 === 1.52 && a === 0.5) && ok(Math.PI / 2 - a, 3) && ok(s, 3) && ok(Math.asin(s), 3); }, { n1: 1, n2: 1.333, a: 0.8 }),
  build: ({ n1, n2, a }) => { const A = MAT[n1], B = MAT[n2], refl = Math.PI / 2 - a, sa = Math.sin(a), s = n1 * sa / n2, b = Math.asin(s), toward = n2 > n1; return {
   prompt: `In the Lens Workshop a narrow ray of light passes from ${A} (index of refraction ${idx(n1)}) into ${B} (index ${idx(n2)}) across a flat boundary. It meets the boundary at ${n(a)} radians from the normal, the line at right angles to the boundary. Part of the light reflects back into the ${A} and part refracts into the ${B}. Enter the angle between the reflected ray and the boundary surface, then the angle of the refracted ray from the normal, both in radians to 3 decimal places.`,
   answer: [rd(refl, 3), rd(b, 3)],
   hints: ['By the law of reflection, the reflected ray makes the same angle with the normal as the incoming ray. The normal and the surface are at right angles: π/2 radians apart.', 'Snell’s law: n₁ sin θ₁ = n₂ sin θ₂, with both angles measured from the normal. Find sin θ₂, then take arcsin with the calculator set to radians.'],
   solution: `By the law of reflection the reflected ray is also ${n(a)} rad from the normal, so the angle it makes with the surface is π/2 − ${n(a)} ${say(refl, 3, ' rad')}. By Snell’s law, sin θ₂ = ${idx(n1)} × sin ${n(a)} ÷ ${idx(n2)} = ${idx(n1)} × ${n(sa)} ÷ ${idx(n2)} ${eq4(s)}, so θ₂ = ${arc(s)} ${say(b, 3, ' rad')}. ${toward ? 'The ray bends towards the normal, because it enters a material with a larger index of refraction.' : 'The ray bends away from the normal, because it enters a material with a smaller index of refraction.'}`,
   guidance: [
    { prompt: `The reflected ray is ${n(a)} rad from the normal. What angle does it make with the surface, in radians to 3 decimal places?`, answer: [rd(refl, 3)], explanation: `The normal is at π/2 ≈ 1.5708 rad to the surface, so the angle is π/2 − ${n(a)} ${say(refl, 3, ' rad')}.` },
    { prompt: `By Snell’s law sin θ₂ = ${idx(n1)} × sin ${n(a)} ÷ ${idx(n2)}. What is sin θ₂, to 3 decimal places?`, answer: [rd(s, 3)], explanation: `sin ${n(a)} ≈ ${n(sa)} (radians), and ${idx(n1)} × ${n(sa)} ÷ ${idx(n2)} ${say(s, 3)}.` },
    { prompt: 'Take arcsin of the unrounded sin θ₂, with the calculator set to radians. What is the refracted angle θ₂ in radians, to 3 decimal places?', answer: [rd(b, 3)], explanation: `θ₂ = ${arc(s)} ${say(b, 3, ' rad')}, ${toward ? 'smaller' : 'larger'} than the ${n(a)} rad it came in at.` }
   ] }; }
 },
 /* Inside n1, at a face with n2 < n1, at a (radians) from the normal. θc = arcsin(n2 ÷ n1); trapped when a > θc, with
    a at least 0.03 rad from θc. Not the worked example (water to air at 0.8). */
 q26: {
  canonical: { n1: 1.49, n2: 1, a: 0.8 },
  draw: R => guard(() => ({ n1: R.pick([1.52, 1.66, 2.419, 1.458, 1.51, 1.923, 1.544, 1.333]), n2: R.pick([1, 1, 1.333]), a: R.int(30, 140) / 100 }),
   ({ n1, n2, a }) => { const c = Math.asin(n2 / n1); return n1 > n2 && a !== 1 && n1 - n2 > 0.1 && Math.abs(a - c) > 0.03 && !(n1 === 1.333 && n2 === 1 && a === 0.8) && ok(n2 / n1, 3) && ok(c, 3); }, { n1: 1.49, n2: 1, a: 0.8 }),
  build: ({ n1, n2, a }) => { const A = MAT[n1], B = MAT[n2], sc = n2 / n1, c = Math.asin(sc), trap = a > c ? 1 : 0; return {
   prompt: `A ray travelling inside a block of ${A} (index of refraction ${n(n1)}) reaches a flat face where the block meets ${B} (index ${idx(n2)}). It strikes the face at ${n(a)} radians from the normal. Enter the critical angle for this face, in radians to 3 decimal places, then 1 if the ray is totally internally reflected (trapped inside the ${A}) or 0 if some of it escapes into the ${B}.`,
   answer: [rd(c, 3), trap],
   hints: ['At the critical angle the refracted ray would run along the face, at π/2 from the normal, and sin(π/2) = 1, so Snell’s law gives sin θc = n₂ ÷ n₁.', 'A ray that strikes the face at more than the critical angle cannot refract out: all of it reflects back inside. At less than the critical angle, part of it escapes.'],
   solution: `sin θc = ${idx(n2)} ÷ ${n(n1)} ${eq4(sc)}, so θc = ${arc(sc)} ${say(c, 3, ' rad')}. The ray strikes at ${n(a)} rad, which is ${trap ? 'more' : 'less'} than the critical angle, so ${trap ? 'it is totally internally reflected and stays in the ' + A + ': 1.' : 'part of it refracts out into the ' + B + ': 0.'}`,
   guidance: [
    { prompt: `What is sin θc = ${idx(n2)} ÷ ${n(n1)}, to 3 decimal places?`, answer: [rd(sc, 3)], explanation: `${idx(n2)} ÷ ${n(n1)} ${say(sc, 3)}. It is less than 1 because the ray is in the material with the larger index.` },
    { prompt: 'Take arcsin of the unrounded sin θc, with the calculator set to radians. What is the critical angle in radians, to 3 decimal places?', answer: [rd(c, 3)], explanation: `θc = ${arc(sc)} ${say(c, 3, ' rad')}.` },
    { prompt: `The ray strikes at ${n(a)} rad and the critical angle is about ${n(rd(c, 3))} rad. Enter 1 if it is trapped, 0 if it escapes.`, answer: [trap], explanation: trap ? `${n(a)} rad is more than the critical angle, so there is no refracted ray: total internal reflection, 1.` : `${n(a)} rad is less than the critical angle, so part of the light refracts out: 0.` }
   ] }; }
 },
 /* Unpolarised I0 through three filters: I0 ÷ 2, then × cos² a, then × cos² b (a, b in radians). Not the worked example
    (80 W/m², 0.4, 0.9). */
 q27: {
  canonical: { I0: 240, a: 0.5, b: 0.7 },
  draw: R => guard(() => ({ I0: R.int(20, 400), a: R.int(15, 125) / 100, b: R.int(15, 125) / 100 }), ({ I0, a, b }) => {
   const I2 = I0 / 2 * Math.cos(a) ** 2, I3 = I2 * Math.cos(b) ** 2; return I3 >= 0.5 && a !== 1 && b !== 1 && !(I0 === 80 && a === 0.4 && b === 0.9) && ok(I2, 2) && ok(I3, 2); }, { I0: 240, a: 0.5, b: 0.7 }),
  build: ({ I0, a, b }) => { const I1 = I0 / 2, ca = Math.cos(a) ** 2, cb = Math.cos(b) ** 2, I2 = I1 * ca, I3 = I2 * cb; return {
   prompt: `Unpolarised light of intensity ${n(I0)} W/m² shines on a stack of three polarising filters. The axis of the second filter is turned ${n(a)} radians from the axis of the first, and the axis of the third is turned a further ${n(b)} radians on from the second, the same way round, so the angle between the axes of the second and third filters is ${n(b)} radians. Enter the intensity after the first filter, after the second and after the third, each in W/m² to 2 decimal places. Use unrounded values from one filter to the next.`,
   answer: [rd(I1, 2), rd(I2, 2), rd(I3, 2)],
   hints: ['A polarising filter passes half the intensity of unpolarised light, and the light that leaves it is polarised along the filter’s axis.', 'Malus’s law: polarised light through a filter whose axis is at θ to its polarisation leaves with I = I₀ cos² θ, where I₀ is the intensity just before that filter.'],
   solution: `After the first filter the light is polarised and has half the intensity: ${n(I0)} ÷ 2 = ${n(I1)} W/m². The second filter is at ${n(a)} rad to that polarisation, and cos²(${n(a)}) ≈ ${n(ca)}, so I₂ = ${n(I1)} × cos²(${n(a)}) ${say(I2, 2, ' W/m²')}. The third filter is at ${n(b)} rad to the second, and cos²(${n(b)}) ≈ ${n(cb)}, so I₃ = I₂ × cos²(${n(b)}) ${say(I3, 2, ' W/m²')}.`,
   guidance: [
    { prompt: `Unpolarised light of ${n(I0)} W/m² meets the first filter. What intensity leaves it, in W/m²?`, answer: [rd(I1, 2)], explanation: `A polarising filter passes half of unpolarised light: ${n(I0)} ÷ 2 = ${n(I1)} W/m².` },
    { prompt: `That light is polarised along the first axis and meets a filter at ${n(a)} rad to it. What is ${n(I1)} × cos²(${n(a)}), in W/m² to 2 decimal places?`, answer: [rd(I2, 2)], explanation: `cos(${n(a)}) ≈ ${n(Math.cos(a))}, squared ≈ ${n(ca)}, and ${n(I1)} × cos²(${n(a)}) ${say(I2, 2, ' W/m²')}.` },
    { prompt: `Now the third filter, ${n(b)} rad from the second. Multiply the unrounded I₂ by cos²(${n(b)}). What is I₃ in W/m², to 2 decimal places?`, answer: [rd(I3, 2)], explanation: `cos²(${n(b)}) ≈ ${n(cb)}, so I₃ = I₂ × cos²(${n(b)}) ${say(I3, 2, ' W/m²')}.` }
   ] }; }
 },
 /* 1/d0 + 1/di = 1/f with signed f; kind is only an index into OPTIC (words), f's sign matches it. |d0 − f| >= 3 keeps
    images within a few metres. Not the worked example (converging lens, f = 10 cm, d0 = 15 cm). */
 q28: {
  canonical: { kind: 0, f: 12, d: 20 },
  draw: R => guard(() => { const kind = R.int(0, 3), F = R.int(5, 40); return { kind, f: OPTIC[kind].sign === 'positive' ? F : -F, d: R.int(5, 100) }; },
   ({ kind, f, d }) => { const di = f * d / (d - f); return Math.abs(d - f) >= 3 && !(kind === 0 && f === 10 && d === 15) && ok(di, 1) && ok(-di / d, 2); }, { kind: 0, f: 12, d: 20 }),
  build: ({ kind, f, d }) => { const o = OPTIC[kind], di = f * d / (d - f), m = -di / d, real = di > 0 ? 1 : 0,
   where = o.mirror ? (real ? 'in front of the mirror, where the light really meets' : 'behind the mirror, where the light only seems to come from') : (real ? 'on the far side of the lens, where the light really meets' : 'on the same side as the lamp, where the light only seems to come from');
   return {
   prompt: `A small lamp stands ${n(d)} cm in front of a ${o.name}. Its focal length is f = ${n(f)} cm (a ${o.name} has a ${o.sign} focal length). Enter the image distance dᵢ in centimetres to 1 decimal place, with a minus sign if the image is virtual, then the magnification m to 2 decimal places, with its sign, worked out from the unrounded image distance.`,
   answer: [rd(di, 1), rd(m, 2)],
   hints: ['Rearrange 1/d₀ + 1/dᵢ = 1/f to 1/dᵢ = 1/f − 1/d₀, then take the reciprocal. Keep the sign of f.', 'The magnification is m = −dᵢ ÷ d₀. A negative m means the image is upside down; a size above 1 means it is larger than the lamp.'],
   solution: `1/dᵢ = 1/${par(f)} − 1/${n(d)}, so dᵢ = ${par(f)} × ${n(d)} ÷ (${n(d)} − ${par(f)}) = ${n(f * d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}. ${real ? 'It is positive, so the image is real' : 'It is negative, so the image is virtual'}: ${where}. The magnification is m = −dᵢ ÷ d₀ = −${par(di)} ÷ ${n(d)} ${say(m, 2)}: the image is ${m < 0 ? 'upside down' : 'upright'} and ${Math.abs(m) > 1 ? 'larger' : 'smaller'} than the lamp.`,
   guidance: [
    { prompt: `Use dᵢ = f × d₀ ÷ (d₀ − f) with f = ${n(f)} cm and d₀ = ${n(d)} cm. What is dᵢ in centimetres, to 1 decimal place?`, answer: [rd(di, 1)], explanation: `dᵢ = ${n(f * d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}.` },
    { prompt: 'What is the magnification m = −dᵢ ÷ d₀, using the unrounded dᵢ, to 2 decimal places?', answer: [rd(m, 2)], explanation: `m = −${par(di)} ÷ ${n(d)} ${say(m, 2)}.` },
    { prompt: 'Enter 1 if the image is real, or 0 if it is virtual.', answer: [real], explanation: real ? 'dᵢ is positive, so the image is real: light really meets there, and it could be caught on a card.' : 'dᵢ is negative, so the image is virtual: no light meets there, and no card could catch it.' }
   ] }; }
 },
 /* Converging lens f, target h cm tall at d cm; glass nn from Table 1.1 with a flat back face in air; a stray ray at a rad.
    |d − f| >= 3; a at least 0.03 rad from θc. Not the worked example (f 20, d 30, h 2, crown glass, 0.6). */
 q29: {
  canonical: { f: 25, d: 40, h: 3, nn: 1.51, a: 0.8 },
  draw: R => guard(() => ({ f: R.int(10, 40), d: R.int(5, 120), h: R.int(2, 9), nn: R.pick([1.52, 1.66, 1.458, 1.51, 1.49, 1.544]), a: R.int(40, 120) / 100 }),
   ({ f, d, h, nn, a }) => { const di = f * d / (d - f), c = Math.asin(1 / nn); return Math.abs(d - f) >= 3 && a !== 1 && Math.abs(a - c) > 0.03 && !(f === 20 && d === 30) && ok(di, 1) && ok(-h * di / d, 2) && ok(c, 3); },
   { f: 25, d: 40, h: 3, nn: 1.51, a: 0.8 }),
  build: ({ f, d, h, nn, a }) => { const name = MAT[nn], di = f * d / (d - f), m = -di / d, hi = h * m, sc = 1 / nn, c = Math.asin(sc), trap = a > c ? 1 : 0; return {
   prompt: `On the telescope lens bench, a target ${n(h)} cm tall stands ${n(d)} cm in front of a converging lens with focal length ${n(f)} cm. The lens is made of ${name} (index of refraction ${n(nn)}) and has a flat back face in air (take n = 1.00 for air). Enter the image distance in cm to 1 decimal place (negative if the image is virtual), then the image height in cm to 2 decimal places (negative if the image is upside down), worked out from the unrounded image distance. Then a stray ray inside the lens strikes the flat back face at ${n(a)} radians from the normal: enter 1 if it is totally internally reflected, or 0 if it escapes into the air.`,
   answer: [rd(di, 1), rd(hi, 2), trap],
   hints: ['Use the thin-lens equation 1/d₀ + 1/dᵢ = 1/f for the image distance, then hᵢ = m × h₀ with m = −dᵢ ÷ d₀.', 'For the stray ray, find the critical angle from sin θc = n₂ ÷ n₁ with the glass as n₁, and compare the ray’s angle with it.'],
   solution: `dᵢ = f × d₀ ÷ (d₀ − f) = ${n(f)} × ${n(d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}, so the image is ${di > 0 ? 'real, on the far side of the lens' : 'virtual, on the same side as the target'}. m = −dᵢ ÷ d₀ ${eq4(m)}, so hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}: ${hi < 0 ? 'upside down' : 'upright'}. For the stray ray, sin θc = 1.00 ÷ ${n(nn)} ${eq4(sc)}, so θc ${say(c, 3, ' rad')}. The ray strikes at ${n(a)} rad, ${trap ? 'more than θc, so it is totally internally reflected: 1.' : 'less than θc, so part of it escapes into the air: 0.'}`,
   guidance: [
    { prompt: `What is the image distance dᵢ = ${n(f)} × ${n(d)} ÷ (${n(d)} − ${n(f)}), in cm to 1 decimal place?`, answer: [rd(di, 1)], explanation: `dᵢ = ${n(f * d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}.` },
    { prompt: `With m = −dᵢ ÷ d₀ and the unrounded dᵢ, what is the image height hᵢ = m × ${n(h)} cm, to 2 decimal places?`, answer: [rd(hi, 2)], explanation: `m = −${par(di)} ÷ ${n(d)} ${eq4(m)}, and hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}.` },
    { prompt: `What is the critical angle for ${name} against air, arcsin(1.00 ÷ ${n(nn)}), in radians to 3 decimal places?`, answer: [rd(c, 3)], explanation: `1.00 ÷ ${n(nn)} ${eq4(sc)}, and arcsin of that ${say(c, 3, ' rad')}.` },
    { prompt: `The stray ray strikes at ${n(a)} rad. Enter 1 if it is trapped, 0 if it escapes.`, answer: [trap], explanation: trap ? `${n(a)} rad is more than the critical angle: total internal reflection, 1.` : `${n(a)} rad is less than the critical angle, so part of it refracts out: 0.` }
   ] }; }
 },
 /* Slits d μm apart (one decimal), wavelength lam nm, order m. Bright arcsin(mλ/d), dark arcsin((m + ½)λ/d) with the
    dark sine below 0.8; highest order floor(d/λ), with d/λ never a whole number. Not the worked example (4.4 μm, 500 nm, m = 1). */
 q30: {
  canonical: { d: 5, lam: 600, m: 2 },
  draw: R => guard(() => ({ d: R.int(20, 200) / 10, lam: R.int(400, 700), m: R.int(1, 3) }), ({ d, lam, m }) => { const D = Math.round(d * 1000), sb = m * lam / D, sd = (m + 0.5) * lam / D;
   return sd < 0.8 && D % lam !== 0 && !(d === 4.4 && lam === 500 && m === 1) && ok(Math.asin(sb), 4) && ok(Math.asin(sd), 4); }, { d: 5, lam: 600, m: 2 }),
  build: ({ d, lam, m }) => { const D = Math.round(d * 1000), sb = m * lam / D, sd = (m + 0.5) * lam / D, tb = Math.asin(sb), td = Math.asin(sd), top = Math.floor(D / lam); return {
   prompt: `In the Fringe Lab, light of wavelength ${n(lam)} nm falls on two narrow slits ${n(d)} μm apart (a micrometre, μm, is 1000 nm). Enter the angle from the centre line of the bright fringe of order m = ${n(m)}, then the angle of the dark fringe given by d sin θ = (m + ½)λ with m = ${n(m)}, both in radians to 4 decimal places. Then enter the highest order m of a bright fringe that can appear on one side, as a whole number.`,
   answer: [rd(tb, 4), rd(td, 4), top],
   hints: ['The path difference from the two slits to a point at angle θ is d sin θ. Bright fringes need d sin θ = mλ; dark fringes need d sin θ = (m + ½)λ. Put d and λ in the same unit first.', 'No angle can pass π/2, where sin θ = 1, so a bright fringe’s order can be at most d ÷ λ: take the whole-number part.'],
   solution: `In nanometres the slits are d = ${n(D)} nm apart. Bright fringe: sin θ = ${n(m)} × ${n(lam)} ÷ ${n(D)} ${eq4(sb)}, so θ = ${arc(sb)} ${say(tb, 4, ' rad')}. Dark fringe: sin θ = ${n(m + 0.5)} × ${n(lam)} ÷ ${n(D)} ${eq4(sd)}, so θ ${say(td, 4, ' rad')}. Highest order: m ≤ d ÷ λ = ${n(D)} ÷ ${n(lam)} ${exact(D / lam, 2) ? '=' : '≈'} ${n(rd(D / lam, 2))}, so the highest bright fringe is order ${n(top)}.`,
   guidance: [
    { prompt: `Put both lengths in nanometres. What is d = ${n(d)} μm in nm?`, answer: [D], explanation: `1 μm is 1000 nm, so ${n(d)} μm = ${n(D)} nm.` },
    { prompt: `For the bright fringe, sin θ = ${n(m)} × ${n(lam)} ÷ ${n(D)}. What is θ in radians, to 4 decimal places?`, answer: [rd(tb, 4)], explanation: `sin θ ${eq4(sb)}, and ${ofIt(sb)} ${say(tb, 4, ' rad')}.` },
    { prompt: `For the dark fringe, sin θ = ${n(m + 0.5)} × ${n(lam)} ÷ ${n(D)}. What is θ in radians, to 4 decimal places?`, answer: [rd(td, 4)], explanation: `sin θ ${eq4(sd)}, and ${ofIt(sd)} ${say(td, 4, ' rad')}. It lies between the bright fringes of orders ${n(m)} and ${n(m + 1)}.` },
    { prompt: `sin θ cannot be more than 1, so m ≤ ${n(D)} ÷ ${n(lam)}. What is the highest order of bright fringe?`, answer: [top], explanation: `${n(D)} ÷ ${n(lam)} ${exact(D / lam, 2) ? '=' : '≈'} ${n(rd(D / lam, 2))}, and the order must be a whole number, so it is ${n(top)}.` }
   ] }; }
 }
});
})();
