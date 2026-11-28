/* Waves: sound and light practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/waves/oracle-p6.js. */
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
/* True when x is a whole number or sits at least 0.05 from the nearest whole number (so a floor is never a near tie). */
const clear = x => { const f = x - Math.floor(x); return f > 0.05 && f < 0.95; };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const guard = (make, fits, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (fits(p)) return p; } return fallback; };
/* Indices of refraction from OpenStax University Physics Volume 3, Table 1.1 (589 nm light); air is taken as 1.00. */
const MAT = { 1: 'air', 1.333: 'water', 1.309: 'ice', 1.52: 'crown glass', 1.66: 'flint glass', 2.419: 'diamond', 1.458: 'fused quartz',
 1.49: 'polystyrene', 1.51: 'Plexiglas', 1.434: 'fluorite', 1.923: 'zircon', 1.544: 'crystalline quartz', 1.361: 'ethanol', 1.473: 'glycerine' };
const idx = v => v === 1 ? '1.00' : n(v);
const GLASS = [1.458, 1.49, 1.51, 1.52, 1.544, 1.66, 1.923, 2.419];
const LIQUID = [1.333, 1.361, 1.473];
const HALF_PI = Math.PI / 2;

/* ---- q26 Critical angle and total internal reflection [V3 1.4] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Rays in the submerged block',
 brief: 'A glass test block is lowered into a tank for a leak check, and the crew must say which of its inner rays stay inside.',
 labels: ['critical angle (rad)', 'rays trapped (0, 1 or 2)'], tolerance: 0.0005,
 gl: [['sin θc'], ['critical angle (rad)'], ['rays trapped (0, 1 or 2)']]
}, {
 /* The block is glass (n1) and the tank holds a liquid (n2), so n2 < n1 and there is a critical angle. How many of the two
    rays are trapped (0, 1 or 2) is chosen first and the angles follow it, each at least 0.03 rad from θc. The liquids never
    include air, so no draw is the parent's example (water into air). */
 canonical: { n1: 1.66, n2: 1.361, a: 1.22, b: 0.89 },
 draw: R => guard(() => { const n1 = R.pick(GLASS), n2 = R.pick(LIQUID), c = Math.asin(n2 / n1), k = R.int(0, 2), flip = R.bool(),
   t1 = k === 2 || (k === 1 && flip), t2 = k === 2 || (k === 1 && !flip), lo = Math.ceil((c + 0.03) * 100), hi = Math.floor((c - 0.03) * 100),
   pick = t => t ? R.int(lo, 150) : R.int(20, hi); return { n1, n2, a: pick(t1) / 100, b: pick(t2) / 100 }; },
  ({ n1, n2, a, b }) => { const c = Math.asin(n2 / n1); return n1 - n2 >= 0.1 && a !== b && a !== 1 && b !== 1 && Math.abs(a - c) > 0.03 && Math.abs(b - c) > 0.03 && a >= 0.2 && b >= 0.2 && a <= 1.5 && b <= 1.5 && ok(n2 / n1, 3) && ok(c, 3); },
  { n1: 1.66, n2: 1.361, a: 1.22, b: 0.89 }),
 build: ({ n1, n2, a, b }) => { const A = MAT[n1], B = MAT[n2], sc = n2 / n1, c = Math.asin(sc), t1 = a > c, t2 = b > c, k = (t1 ? 1 : 0) + (t2 ? 1 : 0),
  verdict = (ang, t) => `${n(ang)} rad, which is ${t ? 'more' : 'less'} than θc, so ${t ? 'that ray is totally internally reflected and stays in the block' : 'part of that ray refracts out into the ' + B}`; return {
  prompt: `A block of ${A} (index of refraction ${n(n1)}) is lowered into a tank of ${B} (index ${n(n2)}) to check it for leaks. Two rays travelling inside the block reach one flat face, where the block meets the ${B}: the first strikes it at ${n(a)} radians from the normal and the second at ${n(b)} radians from the normal. Enter the critical angle for this face, in radians to 3 decimal places, then how many of the two rays are totally internally reflected (0, 1 or 2).`,
  answer: [rd(c, 3), k],
  hints: ['Total internal reflection needs a ray in the larger index heading for the smaller one. At the critical angle the refracted ray runs along the face, so sin θc = n₂ ÷ n₁.', 'A ray that strikes the face at more than the critical angle is totally internally reflected. At less than the critical angle, part of it escapes. Check each ray on its own, then count.'],
  solution: `sin θc = ${n(n2)} ÷ ${n(n1)} ${eq4(sc)}, so θc = arcsin(${n(sc)}) ${say(c, 3, ' rad')}. The first ray strikes at ${verdict(a, t1)}. The second ray strikes at ${verdict(b, t2)}. So ${n(k)} of the two rays ${k === 1 ? 'is' : 'are'} totally internally reflected.`,
  guidance: [
   { prompt: `What is sin θc = ${n(n2)} ÷ ${n(n1)}, to 3 decimal places?`, answer: [rd(sc, 3)], explanation: `${n(n2)} ÷ ${n(n1)} ${say(sc, 3)}. It is less than 1 because the rays are in the material with the larger index.` },
   { prompt: 'Take arcsin of the unrounded sin θc, with the calculator set to radians. What is the critical angle in radians, to 3 decimal places?', answer: [rd(c, 3)], explanation: `θc = arcsin(${n(sc)}) ${say(c, 3, ' rad')}.` },
   { prompt: `The critical angle is about ${n(rd(c, 3))} rad. The first ray strikes at ${n(a)} rad and the second at ${n(b)} rad. How many of the two rays are totally internally reflected (0, 1 or 2)?`, answer: [k], explanation: `The first ray is ${t1 ? 'above' : 'below'} the critical angle and the second ${t2 ? 'above' : 'below'} it. A ray above it is trapped, so the count is ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Will the beam stay in the light pipe?',
 brief: 'A thin light pipe is to carry a beam along the telescope frame, and the crew must know whether a beam let in at an angle will stay inside it.',
 labels: ['refracted angle (rad)', 'angle at the side wall (rad)', 'trapped (1) or escapes (0)'], tolerance: 0.0005,
 gl: [['refracted angle (rad)'], ['angle at the side wall (rad)'], ['trapped (1) or escapes (0)']]
}, {
 /* Air → core at the flat end (Snell's law, q25), then the side wall at π/2 − θr from its normal against air. Trapped when
    π/2 − θr > arcsin(1 ÷ n). With n above √2 every ray would be trapped, so the cores are ice, water and ethanol (n < √2).
    The wall angle is at least 0.03 rad from θc. */
 canonical: { nn: 1.333, a: 0.9 },
 draw: R => guard(() => ({ nn: R.pick([1.309, 1.333, 1.361]), a: R.int(20, 150) / 100 }),
  ({ nn, a }) => { const th = Math.asin(Math.sin(a) / nn), phi = HALF_PI - th, c = Math.asin(1 / nn); return a !== 1 && Math.abs(phi - c) > 0.03 && ok(th, 3) && ok(phi, 3) && ok(c, 3); }, { nn: 1.333, a: 0.9 }),
 build: ({ nn, a }) => { const A = MAT[nn], sa = Math.sin(a), s = sa / nn, th = Math.asin(s), phi = HALF_PI - th, sc = 1 / nn, c = Math.asin(sc), trap = phi > c ? 1 : 0; return {
  prompt: `A light pipe in the Lens Workshop has a long straight core of clear ${A} (index of refraction ${n(nn)}) with air all round it (index 1.00). A beam in the air strikes the flat end of the core at ${n(a)} radians from the normal to the end face and refracts into the core, staying in the flat plane that contains the pipe’s long axis. The side wall is at right angles to the end face, so the refracted ray meets the side wall at π/2 minus its refracted angle, measured from the normal to the wall. Enter the refracted angle at the end face, then the angle at which the ray meets the side wall, both in radians to 3 decimal places. Then enter 1 if the ray is totally internally reflected at the side wall (so it stays in the pipe), or 0 if some of it escapes into the air.`,
  answer: [rd(th, 3), rd(phi, 3), trap],
  hints: ['At the end face the light goes from air into the core: use Snell’s law, n₁ sin θ₁ = n₂ sin θ₂, with both angles measured from the normal to the end face, and take arcsin in radians.', 'The wall angle is π/2 minus the refracted angle. The core is the larger index and the air outside is the smaller, so there is a critical angle with sin θc = 1.00 ÷ n for the core; compare the wall angle with it.'],
  solution: `At the end face, sin θ₂ = 1.00 × sin ${n(a)} ÷ ${n(nn)} = ${n(sa)} ÷ ${n(nn)} ${eq4(s)}, so θ₂ = arcsin(${n(s)}) ${say(th, 3, ' rad')}. The ray meets the side wall at π/2 − ${n(th)} ${say(phi, 3, ' rad')} from the normal to the wall. The critical angle for the core against air is arcsin(1.00 ÷ ${n(nn)}) = arcsin(${n(sc)}) ${say(c, 3, ' rad')}. The wall angle is ${trap ? 'more' : 'less'} than the critical angle, so ${trap ? 'the ray is totally internally reflected and stays in the pipe: 1.' : 'part of it escapes into the air: 0.'}`,
  guidance: [
   { prompt: `By Snell’s law sin θ₂ = 1.00 × sin ${n(a)} ÷ ${n(nn)}. Take arcsin with the calculator in radians: what is the refracted angle θ₂ at the end face, to 3 decimal places?`, answer: [rd(th, 3)], explanation: `sin ${n(a)} ≈ ${n(sa)} (radians), so sin θ₂ ${eq4(s)} and θ₂ = arcsin(${n(s)}) ${say(th, 3, ' rad')}.` },
   { prompt: `The wall angle is π/2 minus the unrounded θ₂. What is it in radians, to 3 decimal places?`, answer: [rd(phi, 3)], explanation: `π/2 ≈ 1.5708, and 1.5708 − ${n(th)} ${say(phi, 3, ' rad')}.` },
   { prompt: `The critical angle for the core against air is arcsin(1.00 ÷ ${n(nn)}) ≈ ${n(rd(c, 3))} rad. The ray meets the wall at ${n(rd(phi, 3))} rad. Enter 1 if it is trapped, 0 if it escapes.`, answer: [trap], explanation: trap ? `${n(rd(phi, 3))} rad is more than the critical angle, so there is no refracted ray: total internal reflection, 1.` : `${n(rd(phi, 3))} rad is less than the critical angle, so part of the light refracts out: 0.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q24', title: 'Rods in the coolant bath',
 brief: 'The crew only know how fast light travels in a new glass rod and in its coolant bath, and must still say whether the rod will hold a ray.',
 labels: ['index of the rod', 'index of the coolant', 'critical angle (rad)', 'trapped (1) or escapes (0)'], tolerance: 0.0005,
 gl: [['index of the rod'], ['index of the coolant'], ['critical angle (rad)'], ['trapped (1) or escapes (0)']]
}, {
 /* Speeds in units of 10⁸ m/s with two decimals: v1 < v2 so the rod has the larger index. n = 3.00 ÷ v, θc = arcsin(v1 ÷ v2),
    the ray at least 0.03 rad from θc. v2 stays at or below 2.60 so the liquid has an index of at least 1.15. */
 canonical: { v1: 1.97, v2: 2.25, a: 1.25 },
 draw: R => guard(() => { const v1 = R.int(120, 220) / 100; return { v1, v2: R.int(Math.round(v1 * 100) + 15, 260) / 100, a: R.int(40, 150) / 100 }; },
  ({ v1, v2, a }) => { const c = Math.asin(v1 / v2); return v2 > v1 && a !== 1 && Math.abs(a - c) > 0.03 && ok(3 / v1, 3) && ok(3 / v2, 3) && ok(c, 3); }, { v1: 1.97, v2: 2.25, a: 1.25 }),
 build: ({ v1, v2, a }) => { const n1 = 3 / v1, n2 = 3 / v2, sc = n2 / n1, c = Math.asin(sc), trap = a > c ? 1 : 0; return {
  prompt: `A glass rod in the Lens Workshop stands in a bath of coolant. Light travels through the rod at ${n(v1)} × 10⁸ m/s and through the coolant at ${n(v2)} × 10⁸ m/s (take c = 3.00 × 10⁸ m/s). A material’s index of refraction is n = c ÷ v, where v is the speed of light in it. Enter the index of refraction of the rod, then that of the coolant, each to 3 decimal places. Then enter the critical angle for the rod’s side wall in radians to 3 decimal places, working from the unrounded indices. Last, a ray inside the rod meets the side wall at ${n(a)} radians from the normal: enter 1 if it is totally internally reflected, or 0 if some of it escapes into the coolant.`,
  answer: [rd(n1, 3), rd(n2, 3), rd(c, 3), trap],
  hints: ['The index of refraction is n = c ÷ v, so with c = 3.00 in units of 10⁸ m/s, divide 3.00 by each speed.', 'The ray goes from the rod to the coolant, so n₁ is the rod and n₂ the coolant, and sin θc = n₂ ÷ n₁ (the larger index must be the rod). Compare the ray’s angle with θc: more means it is trapped.'],
  solution: `The rod: n₁ = c ÷ v = 3.00 ÷ ${n(v1)} ${say(n1, 3)}. The coolant: n₂ = 3.00 ÷ ${n(v2)} ${say(n2, 3)}. Then sin θc = n₂ ÷ n₁ ${eq4(sc)}, so θc = arcsin(${n(sc)}) ${say(c, 3, ' rad')}. The ray strikes at ${n(a)} rad, which is ${trap ? 'more' : 'less'} than θc, so ${trap ? 'it is totally internally reflected: 1.' : 'part of it escapes into the coolant: 0.'}`,
  guidance: [
   { prompt: `What is the index of refraction of the rod, n₁ = 3.00 ÷ ${n(v1)}, to 3 decimal places?`, answer: [rd(n1, 3)], explanation: `n₁ = 3.00 ÷ ${n(v1)} ${say(n1, 3)}.` },
   { prompt: `What is the index of refraction of the coolant, n₂ = 3.00 ÷ ${n(v2)}, to 3 decimal places?`, answer: [rd(n2, 3)], explanation: `n₂ = 3.00 ÷ ${n(v2)} ${say(n2, 3)}. It is less than n₁, so the rod can trap light.` },
   { prompt: 'Work out sin θc = n₂ ÷ n₁ from the unrounded indices and take arcsin with the calculator in radians. What is the critical angle in radians, to 3 decimal places?', answer: [rd(c, 3)], explanation: `sin θc ${eq4(sc)}, so θc = arcsin(${n(sc)}) ${say(c, 3, ' rad')}.` },
   { prompt: `The ray meets the wall at ${n(a)} rad and the critical angle is about ${n(rd(c, 3))} rad. Enter 1 if it is trapped, 0 if it escapes.`, answer: [trap], explanation: trap ? `${n(a)} rad is more than the critical angle: total internal reflection, 1.` : `${n(a)} rad is less than the critical angle, so part of the light refracts out: 0.` }
  ] }; }
});

/* ---- q27 Polarisation and Malus's law, I = I₀ cos² θ [V3 1.7] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The laser on the signal tower',
 brief: 'The signal tower sends a laser beam that is already polarised, and the receiver puts two filters in its way to cut it down.',
 labels: ['after filter A (W/m²)', 'after filter B (W/m²)'], tolerance: 0.005,
 gl: [['after filter A (W/m²)'], ['after filter B (W/m²)']]
}, {
 /* Light that is already polarised: no halving. The first angle is measured from the beam's polarisation, the second from
    filter A. I2 at least 0.5 W/m². Not the parent's example (80 W/m², 0.4, 0.9). */
 canonical: { I0: 150, a: 0.6, b: 0.4 },
 draw: R => guard(() => ({ I0: R.int(20, 400), a: R.int(15, 125) / 100, b: R.int(15, 125) / 100 }),
  ({ I0, a, b }) => { const I1 = I0 * Math.cos(a) ** 2, I2 = I1 * Math.cos(b) ** 2; return I2 >= 0.5 && a !== 1 && b !== 1 && !(I0 === 80 && a === 0.4 && b === 0.9) && ok(I1, 2) && ok(I2, 2); }, { I0: 150, a: 0.6, b: 0.4 }),
 build: ({ I0, a, b }) => { const ca = Math.cos(a) ** 2, cb = Math.cos(b) ** 2, I1 = I0 * ca, I2 = I1 * cb; return {
  prompt: `The laser on the signal tower sends a beam that is already polarised, with intensity ${n(I0)} W/m² where it reaches the receiver. The receiver puts two polarising filters in the beam. The axis of filter A is turned ${n(a)} radians from the beam’s polarisation, and the axis of filter B is turned a further ${n(b)} radians on from the axis of A, the same way round, so the angle between the axes of A and B is ${n(b)} radians. Enter the intensity after filter A, then after filter B, each in W/m² to 2 decimal places. Use the unrounded value of the first for the second.`,
  answer: [rd(I1, 2), rd(I2, 2)],
  hints: ['This light is already polarised, so Malus’s law applies at once, with no halving: I = I₀ cos² θ, where θ is the angle between the filter’s axis and the polarisation of the light reaching it.', 'The light that leaves filter A is polarised along the axis of A, so the angle for filter B is measured from A’s axis, and I₀ for filter B is the intensity just after A.'],
  solution: `The beam is already polarised, so filter A passes the fraction cos²(${n(a)}) ≈ ${n(ca)}: I₁ = ${n(I0)} × ${n(ca)} ${say(I1, 2, ' W/m²')}. The light leaving A is polarised along A’s axis, and B is turned ${n(b)} rad from it, so I₂ = I₁ × cos²(${n(b)}) ≈ ${n(I1)} × ${n(cb)} ${say(I2, 2, ' W/m²')}.`,
  guidance: [
   { prompt: `The beam is already polarised, so filter A passes cos²(${n(a)}) of it. What is ${n(I0)} × cos²(${n(a)}), in W/m² to 2 decimal places?`, answer: [rd(I1, 2)], explanation: `cos(${n(a)}) ≈ ${n(Math.cos(a))}, squared ≈ ${n(ca)}, and ${n(I0)} × ${n(ca)} ${say(I1, 2, ' W/m²')}.` },
   { prompt: `Filter B is ${n(b)} rad from A’s axis. Multiply the unrounded intensity after A by cos²(${n(b)}). What is the intensity after B, in W/m² to 2 decimal places?`, answer: [rd(I2, 2)], explanation: `cos²(${n(b)}) ≈ ${n(cb)}, so I₂ = ${n(I1)} × ${n(cb)} ${say(I2, 2, ' W/m²')}.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'Setting the sensor filter',
 brief: 'A delicate sensor on the solar telescope burns out above a set intensity, so the second filter must be turned to just the right angle.',
 labels: ['after filter 1 (W/m²)', 'fraction cos² θ (no unit)', 'angle θ (rad)'], tolerance: 0.0005,
 gl: [['after filter 1 (W/m²)'], ['fraction cos² θ (no unit)'], ['angle θ (rad)']]
}, {
 /* I1 = I0 ÷ 2; the fraction T ÷ I1 lies between 0.15 and 0.85; θ = arccos(√fraction) between 0 and π/2. I0 is even so
    I1 is a whole number. */
 canonical: { I0: 360, T: 90 },
 draw: R => guard(() => { const I0 = 2 * R.int(50, 400), I1 = I0 / 2; return { I0, T: R.int(Math.ceil(0.15 * I1), Math.floor(0.85 * I1)) }; },
  ({ I0, T }) => { const f = T / (I0 / 2); return I0 !== 80 && f >= 0.15 && f <= 0.85 && ok(f, 3) && ok(Math.acos(Math.sqrt(f)), 3); }, { I0: 360, T: 90 }),
 build: ({ I0, T }) => { const I1 = I0 / 2, f = T / I1, rt = Math.sqrt(f), th = Math.acos(rt); return {
  prompt: `Unpolarised sunlight of intensity ${n(I0)} W/m² passes through a first polarising filter and then a second filter whose axis can be turned. The sensor behind them must receive exactly ${n(T)} W/m². Enter the intensity after the first filter in W/m², then the fraction cos² θ that the second filter must pass (to 3 decimal places), then the angle θ between the two axes in radians to 3 decimal places, taken between 0 and π/2. To find θ, take the square root of the fraction to get cos θ, then use arccos with the calculator set to radians. Use the unrounded fraction for the angle.`,
  answer: [I1, rd(f, 3), rd(th, 3)],
  hints: ['Unpolarised light loses exactly half its intensity in the first filter and leaves polarised along its axis.', 'Malus’s law for the second filter is I = I₀ cos² θ, where I₀ is the intensity after the first filter. So the fraction cos² θ is the intensity wanted divided by the intensity that reaches the second filter.'],
  solution: `The first filter passes half of the unpolarised light: ${n(I0)} ÷ 2 = ${n(I1)} W/m². The second filter must bring ${n(I1)} down to ${n(T)}, so cos² θ = ${n(T)} ÷ ${n(I1)} ${say(f, 3)}. Then cos θ = √${n(f)} ≈ ${n(rt)} and θ = arccos(${n(rt)}) ${say(th, 3, ' rad')}.`,
  guidance: [
   { prompt: `What intensity leaves the first filter, in W/m²?`, answer: [I1], explanation: `Half of ${n(I0)} is ${n(I1)} W/m².` },
   { prompt: `The second filter must take ${n(I1)} W/m² down to ${n(T)} W/m². By Malus’s law cos² θ = ${n(T)} ÷ ${n(I1)}. What is it, to 3 decimal places?`, answer: [rd(f, 3)], explanation: `${n(T)} ÷ ${n(I1)} ${say(f, 3)}.` },
   { prompt: 'Take the square root of the unrounded fraction to get cos θ, then arccos with the calculator in radians. What is θ in radians, to 3 decimal places?', answer: [rd(th, 3)], explanation: `cos θ = √${n(f)} ≈ ${n(rt)}, and θ = arccos(${n(rt)}) ${say(th, 3, ' rad')}.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q10', title: 'A lamp behind three filters',
 brief: 'A bench lamp lights a stack of three filters from some way off, and the crew must know what is left of its light at the far end.',
 labels: ['intensity at filter 1 (W/m²)', 'after filter 3 (W/m²)', 'fraction passed (no unit)'], tolerance: 0.0005,
 gl: [['intensity at filter 1 (W/m²)'], ['after filter 1 (W/m²)'], ['after filter 3 (W/m²)'], ['fraction passed (no unit)']]
}, {
 /* I0 = P ÷ (4πr²) for the unpolarised lamp, then I0 ÷ 2, × cos² a, × cos² b. The fraction is I3 ÷ I0. I3 at least 0.5. */
 canonical: { P: 800, r: 3, a: 0.45, b: 0.8 },
 draw: R => guard(() => ({ P: 10 * R.int(10, 150), r: R.int(2, 8), a: R.int(15, 125) / 100, b: R.int(15, 125) / 100 }),
  ({ P, r, a, b }) => { const I0 = P / (4 * Math.PI * r * r), I3 = I0 / 2 * Math.cos(a) ** 2 * Math.cos(b) ** 2; return I3 >= 0.5 && a !== 1 && b !== 1 && ok(I0, 2) && ok(I3, 2) && ok(I3 / I0, 3); }, { P: 800, r: 3, a: 0.45, b: 0.8 }),
 build: ({ P, r, a, b }) => { const I0 = P / (4 * Math.PI * r * r), I1 = I0 / 2, ca = Math.cos(a) ** 2, cb = Math.cos(b) ** 2, I2 = I1 * ca, I3 = I2 * cb, fr = I3 / I0; return {
  prompt: `A lamp on the Lens Workshop bench sends ${n(P)} W of unpolarised light evenly in all directions. At distance r from the lamp its intensity is I = P ÷ (4πr²), where 4πr² is the area of a sphere of radius r. At ${n(r)} m from the lamp the light meets a stack of three polarising filters. The axis of the second filter is turned ${n(a)} radians from the axis of the first, and the axis of the third is turned a further ${n(b)} radians on from the second, the same way round, so the angle between the axes of the second and third filters is ${n(b)} radians. The first filter passes half the intensity of unpolarised light, and each later filter passes cos² θ of the light reaching it, where θ is the angle between its axis and the axis of the filter before it. Enter the intensity reaching the first filter and the intensity leaving the third filter, each in W/m² to 2 decimal places, then the fraction of the intensity reaching the first filter that leaves the third, to 3 decimal places. Use unrounded values from one step to the next.`,
  answer: [rd(I0, 2), rd(I3, 2), rd(fr, 3)],
  hints: ['Spread over a sphere of radius r, the power P gives intensity I = P ÷ (4πr²) at distance r. Work in watts and metres.', 'The first filter passes half of unpolarised light. Each later filter passes cos² θ of the light reaching it, with θ measured from the axis of the filter just before it.'],
  solution: `At ${n(r)} m the intensity is I₀ = ${n(P)} ÷ (4π × ${n(r)}²) ${say(I0, 2, ' W/m²')}. The first filter passes half: ${n(I0)} ÷ 2 ${say(I1, 2, ' W/m²')}. The second passes cos²(${n(a)}) ≈ ${n(ca)}, so I₂ ≈ ${n(I2)} W/m². The third passes cos²(${n(b)}) ≈ ${n(cb)}, so I₃ = I₂ × ${n(cb)} ${say(I3, 2, ' W/m²')}. The fraction that gets through all three is I₃ ÷ I₀ ${say(fr, 3)}.`,
  guidance: [
   { prompt: `What is the intensity reaching the first filter, I₀ = ${n(P)} ÷ (4π × ${n(r)}²), in W/m² to 2 decimal places?`, answer: [rd(I0, 2)], explanation: `4π × ${n(r)}² ≈ ${n(4 * Math.PI * r * r)} m², and ${n(P)} ÷ ${n(4 * Math.PI * r * r)} ${say(I0, 2, ' W/m²')}.` },
   { prompt: 'The light is unpolarised, so the first filter passes half of it. What intensity leaves the first filter (unrounded I₀ ÷ 2), in W/m² to 2 decimal places?', answer: [rd(I1, 2)], explanation: `${n(I0)} ÷ 2 ${say(I1, 2, ' W/m²')}.` },
   { prompt: `The second filter is ${n(a)} rad from the first and the third a further ${n(b)} rad. Multiply the unrounded intensity after the first filter by cos²(${n(a)}) and then by cos²(${n(b)}). What is the intensity after the third filter, in W/m² to 2 decimal places?`, answer: [rd(I3, 2)], explanation: `${n(I1)} × ${n(ca)} × ${n(cb)} ${say(I3, 2, ' W/m²')}.` },
   { prompt: 'Divide the unrounded intensity after the third filter by the unrounded intensity reaching the first. What fraction gets through, to 3 decimal places?', answer: [rd(fr, 3)], explanation: `${n(I3)} ÷ ${n(I0)} ${say(fr, 3)}. This is ½ cos²(${n(a)}) cos²(${n(b)}), which does not depend on the lamp’s power or distance.` }
  ] }; }
});

/* ---- q28 Mirrors and thin lenses: 1/d₀ + 1/dᵢ = 1/f and magnification [V3 2.2, 2.4] ---- */

/* q28b: the kind of mirror only picks words and the sign of f; the signed focal length carries the maths. */
const MIRROR = [
 { full: 'concave shaving mirror in the crew quarters', kind: 'concave', sign: 'positive' },
 { full: 'convex security mirror at the track gate', kind: 'convex', sign: 'negative' }
];

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Mirrors in the crew quarters',
 brief: 'The outpost is fitting curved mirrors in the crew quarters and at the track gate, and each needs a check of what it shows.',
 labels: ['image distance (cm)', 'image height (cm)'], tolerance: 0.005,
 gl: [['image distance (cm)'], ['image height (cm)']]
}, {
 /* kind is only an index into MIRROR (words); the sign of f matches it. |d − f| ≥ 3. A mirror, never the parent's lens. */
 canonical: { kind: 0, f: 30, d: 12, h: 5 },
 draw: R => guard(() => { const kind = R.int(0, 1), F = R.int(8, 40); return { kind, f: MIRROR[kind].sign === 'positive' ? F : -F, d: R.int(5, 100), h: R.int(2, 9) }; },
  ({ f, d, h }) => { const di = f * d / (d - f); return Math.abs(d - f) >= 3 && ok(di, 1) && ok(h * -di / d, 2); }, { kind: 0, f: 30, d: 12, h: 5 }),
 build: ({ kind, f, d, h }) => { const o = MIRROR[kind], di = f * d / (d - f), m = -di / d, hi = h * m, real = di > 0,
  where = real ? 'in front of the mirror, where the light really meets' : 'behind the mirror, where the light only seems to come from'; return {
  prompt: `A test card ${n(h)} cm tall stands ${n(d)} cm in front of a ${o.full}. The mirror’s focal length is f = ${n(f)} cm (a ${o.kind} mirror has a ${o.sign} focal length). Enter the image distance dᵢ in centimetres to 1 decimal place, with a minus sign if the image is virtual, then the height of the image hᵢ in centimetres to 2 decimal places, negative if the image is upside down, worked out from the unrounded image distance.`,
  answer: [rd(di, 1), rd(hi, 2)],
  hints: ['A curved mirror obeys the same equation as a thin lens, 1/d₀ + 1/dᵢ = 1/f, with the signed f. Rearrange it to dᵢ = f × d₀ ÷ (d₀ − f).', 'The magnification is m = −dᵢ ÷ d₀, and the image height is the magnification times the height of the card, hᵢ = m × h₀. A negative height means upside down.'],
  solution: `dᵢ = f × d₀ ÷ (d₀ − f) = ${par(f)} × ${n(d)} ÷ (${n(d)} − ${par(f)}) = ${n(f * d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}. ${real ? 'It is positive, so the image is real' : 'It is negative, so the image is virtual'}: ${where}. The magnification is m = −dᵢ ÷ d₀ = −${par(di)} ÷ ${n(d)} ${eq4(m)}, so hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}: ${hi < 0 ? 'upside down' : 'upright'}.`,
  guidance: [
   { prompt: `Use dᵢ = f × d₀ ÷ (d₀ − f) with f = ${n(f)} cm and d₀ = ${n(d)} cm. What is dᵢ in centimetres, to 1 decimal place?`, answer: [rd(di, 1)], explanation: `dᵢ = ${n(f * d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}.` },
   { prompt: `With m = −dᵢ ÷ d₀ and the unrounded dᵢ, what is the image height hᵢ = m × ${n(h)} cm, to 2 decimal places?`, answer: [rd(hi, 2)], explanation: `m = −${par(di)} ÷ ${n(d)} ${eq4(m)}, and hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Reading the projector lens',
 brief: 'The slide projector in the test hall has lost its lens label, but the crew know where its slide and its picture sit.',
 labels: ['focal length (cm)', 'magnification (no unit)', 'picture height (cm)'], tolerance: 0.005,
 gl: [['focal length (cm)'], ['magnification (no unit)'], ['picture height (cm)']]
}, {
 /* A real picture on a wall W metres from the lens (dᵢ = 100 W cm), slide d cm from the lens. f = d dᵢ ÷ (d + dᵢ),
    m = −dᵢ ÷ d, picture height h m. */
 canonical: { d: 12, W: 2.4, h: 3 },
 draw: R => guard(() => ({ d: R.int(8, 30), W: R.int(15, 60) / 10, h: R.int(2, 6) }),
  ({ d, W, h }) => { const di = 100 * W, f = d * di / (d + di); return ok(f, 1) && ok(-di / d, 2) && ok(-h * di / d, 1); }, { d: 12, W: 2.4, h: 3 }),
 build: ({ d, W, h }) => { const di = 100 * W, f = d * di / (d + di), m = -di / d, hp = m * h; return {
  prompt: `A slide projector in the Lens Workshop test hall has a slide ${n(h)} cm tall, ${n(d)} cm in front of its lens. The sharp picture lands on a wall ${n(W)} m from the lens, and it is a real image. Use 1/f = 1/d₀ + 1/dᵢ, the lens equation rearranged for f, and remember that 1 m is 100 cm. Enter the focal length of the lens in centimetres to 1 decimal place, then the magnification m to 2 decimal places with its sign, then the height of the picture on the wall in centimetres to 1 decimal place, negative if it is upside down.`,
  answer: [rd(f, 1), rd(m, 2), rd(hp, 1)],
  hints: ['The wall is 100 cm for every metre, so dᵢ in centimetres is 100 times the distance in metres. The picture is real, so dᵢ is positive.', 'Add the reciprocals: 1/f = 1/d₀ + 1/dᵢ, so f = d₀ × dᵢ ÷ (d₀ + dᵢ). Then m = −dᵢ ÷ d₀ and the picture height is m times the slide height.'],
  solution: `The wall is ${n(W)} m = ${n(di)} cm from the lens, so dᵢ = ${n(di)} cm. Then f = d₀ × dᵢ ÷ (d₀ + dᵢ) = ${n(d)} × ${n(di)} ÷ (${n(d)} + ${n(di)}) = ${n(d * di)} ÷ ${n(d + di)} ${say(f, 1, ' cm')}. The magnification is m = −dᵢ ÷ d₀ = −${n(di)} ÷ ${n(d)} ${say(m, 2)}, so hᵢ = m × ${n(h)} ${say(hp, 1, ' cm')}: the picture is upside down.`,
  guidance: [
   { prompt: `The wall is ${n(W)} m away, so dᵢ = ${n(di)} cm. What is f = d₀ × dᵢ ÷ (d₀ + dᵢ) with d₀ = ${n(d)} cm, in centimetres to 1 decimal place?`, answer: [rd(f, 1)], explanation: `f = ${n(d * di)} ÷ ${n(d + di)} ${say(f, 1, ' cm')}.` },
   { prompt: `What is the magnification m = −dᵢ ÷ d₀ = −${n(di)} ÷ ${n(d)}, to 2 decimal places?`, answer: [rd(m, 2)], explanation: `m = −${n(di)} ÷ ${n(d)} ${say(m, 2)}.` },
   { prompt: `What is the height of the picture, m × ${n(h)} cm, in centimetres to 1 decimal place?`, answer: [rd(hp, 1)], explanation: `${n(m)} × ${n(h)} ${say(hp, 1, ' cm')}. It is negative: the picture is upside down, as a real image from a single lens always is.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', title: 'Two lenses in a row',
 brief: 'A telescope has a second lens behind the first, and the crew need to know where the final image forms and how much it magnifies.',
 labels: ['image distance, lens 1 (cm)', 'image distance, lens 2 (cm)', 'total magnification (no unit)'], tolerance: 0.005,
 gl: [['image distance, lens 1 (cm)'], ['object distance for lens 2 (cm)'], ['image distance, lens 2 (cm)'], ['total magnification (no unit)']]
}, {
 /* Two converging lenses L cm apart. Lens 1 makes a real image (d > f1 + 3); its image is the object of lens 2 at
    d2 = L − di1 ≥ 3 cm in front of it, and |d2 − f2| ≥ 3. Total magnification m1 × m2. */
 canonical: { f1: 15, f2: 20, d: 25, L: 70 },
 draw: R => guard(() => { const f1 = R.int(5, 25), f2 = R.int(5, 30); return { f1, f2, d: R.int(f1 + 3, 80), L: R.int(40, 150) }; },
  ({ f1, f2, d, L }) => { const d1 = f1 * d / (d - f1), d2 = L - d1, di2 = f2 * d2 / (d2 - f2); return d2 >= 3 && Math.abs(d2 - f2) >= 3 && ok(d1, 1) && ok(d2, 1) && ok(di2, 1) && ok((d1 / d) * (di2 / d2), 2); }, { f1: 15, f2: 20, d: 25, L: 70 }),
 build: ({ f1, f2, d, L }) => { const d1 = f1 * d / (d - f1), d2 = L - d1, di2 = f2 * d2 / (d2 - f2), m1 = -d1 / d, m2 = -di2 / d2, m = m1 * m2; return {
  prompt: `Two converging lenses stand ${n(L)} cm apart on the bench. Lens 1 has focal length f₁ = ${n(f1)} cm and lens 2 has f₂ = ${n(f2)} cm. A lamp stands ${n(d)} cm in front of lens 1. Lens 1 makes an image, and that image acts as the lamp for lens 2: its distance in front of lens 2 is ${n(L)} cm minus the image distance of lens 1 (here it comes out positive). The total magnification is m₁ × m₂, where each m = −dᵢ ÷ d₀ for its own lens. Enter the image distance of lens 1 and then the image distance of lens 2 (negative if virtual), each in centimetres to 1 decimal place, then the total magnification to 2 decimal places, with its sign. Use unrounded values from one step to the next.`,
  answer: [rd(d1, 1), rd(di2, 1), rd(m, 2)],
  hints: ['Treat each lens on its own with 1/d₀ + 1/dᵢ = 1/f, in the order the light meets them: lens 1 first with the lamp as its object, then lens 2 with the image from lens 1 as its object.', 'The object distance for lens 2 is the separation of the lenses minus the image distance of lens 1. The total magnification is the product of the two magnifications, each −dᵢ ÷ d₀, so the signs multiply too.'],
  solution: `Lens 1: dᵢ₁ = f₁ × d₀ ÷ (d₀ − f₁) = ${n(f1)} × ${n(d)} ÷ ${n(d - f1)} = ${n(f1 * d)} ÷ ${n(d - f1)} ${say(d1, 1, ' cm')}, and m₁ = −${n(d1)} ÷ ${n(d)} ≈ ${n(m1)}. That image is the object for lens 2, at d₀ = ${n(L)} − ${n(d1)} ${say(d2, 1, ' cm')}. Lens 2: dᵢ₂ = ${n(f2)} × ${n(d2)} ÷ (${n(d2)} − ${n(f2)}) ${say(di2, 1, ' cm')}, and m₂ = −${par(di2)} ÷ ${n(d2)} ≈ ${n(m2)}. The total magnification is m₁ × m₂ ≈ ${n(m1)} × ${par(m2)} ${say(m, 2)}.`,
  guidance: [
   { prompt: `Lens 1: use dᵢ = f × d₀ ÷ (d₀ − f) with f = ${n(f1)} cm and d₀ = ${n(d)} cm. What is its image distance in centimetres, to 1 decimal place?`, answer: [rd(d1, 1)], explanation: `dᵢ₁ = ${n(f1 * d)} ÷ ${n(d - f1)} ${say(d1, 1, ' cm')}.` },
   { prompt: `The image from lens 1 is the object for lens 2, at ${n(L)} cm minus the unrounded image distance of lens 1. What is that object distance, in centimetres to 1 decimal place?`, answer: [rd(d2, 1)], explanation: `d₀ for lens 2 = ${n(L)} − ${n(d1)} ${say(d2, 1, ' cm')}.` },
   { prompt: `Lens 2: with f = ${n(f2)} cm and that object distance, what is its image distance dᵢ = f × d₀ ÷ (d₀ − f), in centimetres to 1 decimal place?`, answer: [rd(di2, 1)], explanation: `dᵢ₂ = ${n(f2)} × ${n(d2)} ÷ (${n(d2)} − ${n(f2)}) ${say(di2, 1, ' cm')}.` },
   { prompt: 'The magnifications are m₁ = −dᵢ₁ ÷ d₀ for lens 1 and m₂ = −dᵢ₂ ÷ d₀ for lens 2, each from the unrounded distances. What is m₁ × m₂, to 2 decimal places?', answer: [rd(m, 2)], explanation: `m₁ ≈ ${n(m1)} and m₂ ≈ ${n(m2)}, so m₁ × m₂ ${say(m, 2)}.` }
  ] }; }
});

/* ---- q29 Chapter review: a telescope lens bench [V3 1.3, 2.4] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The finder scope eyepiece',
 brief: 'The finder scope on the dome has a diverging eyepiece, and its first test is where it puts the image and whether stray light stays in the glass.',
 labels: ['image distance (cm)', 'image height (cm)', 'trapped (1) or escapes (0)'], tolerance: 0.0005,
 gl: [['image distance (cm)'], ['image height (cm)'], ['critical angle (rad)'], ['trapped (1) or escapes (0)']]
}, {
 /* A diverging lens of focal length −fm cm: the image is always virtual and upright. The glass has its flat back face against
    air or water (index out); the stray ray is at least 0.03 rad from θc = arcsin(out ÷ nn). Not the parent's converging lens. */
 canonical: { fm: 18, d: 47, h: 6, nn: 1.66, out: 1.333, a: 1.01 },
 draw: R => guard(() => ({ fm: R.int(8, 40), d: R.int(5, 100), h: R.int(2, 9), nn: R.pick([1.52, 1.66, 1.458, 1.51, 1.49, 1.544]), out: R.pick([1, 1.333]), a: R.int(40, 140) / 100 }),
  ({ fm, d, h, nn, out, a }) => { const di = -fm * d / (d + fm), c = Math.asin(out / nn); return nn - out >= 0.1 && a !== 1 && Math.abs(a - c) > 0.03 && ok(di, 1) && ok(-h * di / d, 2) && ok(c, 3); }, { fm: 18, d: 47, h: 6, nn: 1.66, out: 1.333, a: 1.01 }),
 build: ({ fm, d, h, nn, out, a }) => { const f = -fm, name = MAT[nn], O = MAT[out], di = f * d / (d - f), m = -di / d, hi = h * m, sc = out / nn, c = Math.asin(sc), trap = a > c ? 1 : 0; return {
  prompt: `The finder scope on the telescope dome has a diverging eyepiece lens with focal length f = ${n(f)} cm (negative, because the lens is diverging). A target ${n(h)} cm tall stands ${n(d)} cm in front of it. The lens is made of ${name} (index of refraction ${n(nn)}) and its flat back face touches ${O} (index ${idx(out)}). Enter the image distance in cm to 1 decimal place (negative if the image is virtual), then the image height in cm to 2 decimal places (negative if the image is upside down), worked out from the unrounded image distance. Then a stray ray inside the lens strikes the flat back face at ${n(a)} radians from the normal: enter 1 if it is totally internally reflected, or 0 if it escapes into the ${O}.`,
  answer: [rd(di, 1), rd(hi, 2), trap],
  hints: ['Use the thin-lens equation 1/d₀ + 1/dᵢ = 1/f with the negative f of a diverging lens, then hᵢ = m × h₀ with m = −dᵢ ÷ d₀.', 'For the stray ray, the glass is n₁ and the material behind the back face is n₂, so sin θc = n₂ ÷ n₁. Compare the ray’s angle with θc: more means it is trapped.'],
  solution: `dᵢ = f × d₀ ÷ (d₀ − f) = ${par(f)} × ${n(d)} ÷ (${n(d)} − ${par(f)}) = ${par(f * d)} ÷ ${n(d - f)} ${say(di, 1, ' cm')}, so the image is virtual, on the same side as the target. m = −dᵢ ÷ d₀ ${eq4(m)}, so hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}: ${hi < 0 ? 'upside down' : 'upright'}. For the stray ray, sin θc = ${idx(out)} ÷ ${n(nn)} ${eq4(sc)}, so θc ${say(c, 3, ' rad')}. The ray strikes at ${n(a)} rad, ${trap ? 'more than θc, so it is totally internally reflected: 1.' : 'less than θc, so part of it escapes into the ' + O + ': 0.'}`,
  guidance: [
   { prompt: `What is the image distance dᵢ = f × d₀ ÷ (d₀ − f) with f = ${n(f)} cm and d₀ = ${n(d)} cm, in cm to 1 decimal place?`, answer: [rd(di, 1)], explanation: `dᵢ = ${par(f * d)} ÷ ${n(d - f)} ${say(di, 1, ' cm')}.` },
   { prompt: `With m = −dᵢ ÷ d₀ and the unrounded dᵢ, what is the image height hᵢ = m × ${n(h)} cm, to 2 decimal places?`, answer: [rd(hi, 2)], explanation: `m = −${par(di)} ÷ ${n(d)} ${eq4(m)}, and hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}.` },
   { prompt: `What is the critical angle for ${name} against ${O}, arcsin(${idx(out)} ÷ ${n(nn)}), in radians to 3 decimal places?`, answer: [rd(c, 3)], explanation: `${idx(out)} ÷ ${n(nn)} ${eq4(sc)}, and arcsin of that ${say(c, 3, ' rad')}.` },
   { prompt: `The stray ray strikes at ${n(a)} rad. Enter 1 if it is trapped, 0 if it escapes.`, answer: [trap], explanation: trap ? `${n(a)} rad is more than the critical angle: total internal reflection, 1.` : `${n(a)} rad is less than the critical angle, so part of it refracts out: 0.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Placing the target for the objective',
 brief: 'The objective lens has a card fixed behind it, and the bench crew must find where to stand the target so the image lands on that card.',
 labels: ['target distance (cm)', 'image height (cm)', 'critical angle (rad)'], tolerance: 0.0005,
 gl: [['target distance (cm)'], ['image height (cm)'], ['critical angle (rad)']]
}, {
 /* d₀ = f dᵢ ÷ (dᵢ − f) with dᵢ − f ≥ 3 so the image on the card is real; hᵢ = −h dᵢ ÷ d₀; θc = arcsin(1 ÷ nn). */
 canonical: { f: 28, di: 70, h: 4, nn: 1.49 },
 draw: R => guard(() => { const f = R.int(10, 40); return { f, di: R.int(f + 3, 150), h: R.int(2, 9), nn: R.pick([1.52, 1.66, 1.458, 1.51, 1.49, 1.544, 1.434, 1.923]) }; },
  ({ f, di, h, nn }) => { const d0 = f * di / (di - f); return !(f === 25 && h === 3 && nn === 1.51) && ok(d0, 1) && ok(-h * di / d0, 2) && ok(Math.asin(1 / nn), 3); }, { f: 28, di: 70, h: 4, nn: 1.49 }),
 build: ({ f, di, h, nn }) => { const name = MAT[nn], d0 = f * di / (di - f), m = -di / d0, hi = h * m, sc = 1 / nn, c = Math.asin(sc); return {
  prompt: `The objective lens of a telescope is a converging lens with focal length ${n(f)} cm, made of ${name} (index of refraction ${n(nn)}), with a flat back face in air (take n = 1.00 for air). A card ${n(di)} cm behind the lens must catch a sharp image of a target ${n(h)} cm tall. Use 1/d₀ = 1/f − 1/dᵢ, the lens equation rearranged for d₀. Enter how far in front of the lens the target must stand, in cm to 1 decimal place, then the height of the image on the card in cm to 2 decimal places (negative if it is upside down), worked out from the unrounded target distance. Then enter the critical angle for the flat back face, glass against air, in radians to 3 decimal places: a ray inside the glass that meets that face at less than this angle from the normal escapes into the air.`,
  answer: [rd(d0, 1), rd(hi, 2), rd(c, 3)],
  hints: ['Take the reciprocal after subtracting: 1/d₀ = 1/f − 1/dᵢ, so d₀ = f × dᵢ ÷ (dᵢ − f). The image is on a card, so it is real and dᵢ is positive.', 'The magnification is m = −dᵢ ÷ d₀ and the image height is m × the target height. The critical angle comes from sin θc = n₂ ÷ n₁, with the glass as n₁ and the air as n₂.'],
  solution: `d₀ = f × dᵢ ÷ (dᵢ − f) = ${n(f)} × ${n(di)} ÷ (${n(di)} − ${n(f)}) = ${n(f * di)} ÷ ${n(di - f)} ${say(d0, 1, ' cm')}. The magnification is m = −dᵢ ÷ d₀ = −${n(di)} ÷ ${n(d0)} ${eq4(m)}, so the image height is hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}: upside down. For the glass, sin θc = 1.00 ÷ ${n(nn)} ${eq4(sc)}, so θc = arcsin(${n(sc)}) ${say(c, 3, ' rad')}.`,
  guidance: [
   { prompt: `What is d₀ = f × dᵢ ÷ (dᵢ − f) with f = ${n(f)} cm and dᵢ = ${n(di)} cm, in cm to 1 decimal place?`, answer: [rd(d0, 1)], explanation: `d₀ = ${n(f * di)} ÷ ${n(di - f)} ${say(d0, 1, ' cm')}.` },
   { prompt: `With m = −dᵢ ÷ d₀ and the unrounded d₀, what is the image height hᵢ = m × ${n(h)} cm, to 2 decimal places?`, answer: [rd(hi, 2)], explanation: `m = −${n(di)} ÷ ${n(d0)} ${eq4(m)}, and hᵢ = m × ${n(h)} ${say(hi, 2, ' cm')}.` },
   { prompt: `What is the critical angle for ${name} against air, arcsin(1.00 ÷ ${n(nn)}), in radians to 3 decimal places?`, answer: [rd(c, 3)], explanation: `1.00 ÷ ${n(nn)} ${eq4(sc)}, and arcsin of that ${say(c, 3, ' rad')}.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q24', title: 'Colour and the lens blank',
 brief: 'A new lens blank must be checked for where it focuses, how fast and how short-wavelength the light is inside it, and whether stray light leaks out.',
 labels: ['image distance (cm)', 'speed in the glass (10⁸ m/s)', 'wavelength inside (nm)', 'trapped (1) or escapes (0)'], tolerance: 0.0005,
 gl: [['image distance (cm)'], ['speed in the glass (10⁸ m/s)'], ['wavelength inside (nm)'], ['trapped (1) or escapes (0)']]
}, {
 /* Converging lens f, target at d (|d − f| ≥ 3, either side of f); glass nn, vacuum wavelength lam; stray ray at a rad,
    at least 0.03 rad from θc = arcsin(1 ÷ nn). Speed 3.00 ÷ nn in units of 10⁸ m/s, wavelength lam ÷ nn. */
 canonical: { f: 16, d: 40, nn: 1.923, lam: 420, a: 0.8 },
 draw: R => guard(() => ({ f: R.int(10, 40), d: R.int(5, 120), nn: R.pick([1.52, 1.66, 1.458, 1.51, 1.49, 1.544, 1.923]), lam: R.int(40, 70) * 10, a: R.int(40, 130) / 100 }),
  ({ f, d, nn, lam, a }) => { const di = f * d / (d - f), c = Math.asin(1 / nn); return Math.abs(d - f) >= 3 && a !== 1 && Math.abs(a - c) > 0.03 && ok(di, 1) && ok(3 / nn, 3) && ok(lam / nn, 1) && ok(c, 3); }, { f: 16, d: 40, nn: 1.923, lam: 420, a: 0.8 }),
 build: ({ f, d, nn, lam, a }) => { const name = MAT[nn], di = f * d / (d - f), v = 3 / nn, li = lam / nn, sc = 1 / nn, c = Math.asin(sc), trap = a > c ? 1 : 0; return {
  prompt: `A lens blank for the telescope is cut from ${name} (index of refraction ${n(nn)}) as a converging lens with focal length ${n(f)} cm, and has a flat back face in air (take n = 1.00 for air). A lamp stands ${n(d)} cm in front of it, and its light has a wavelength of ${n(lam)} nm in a vacuum. Take c = 3.00 × 10⁸ m/s. In a material of index n, light travels at c ÷ n and its wavelength is the vacuum wavelength divided by n. Enter the image distance in cm to 1 decimal place (negative if the image is virtual); then the speed of the light inside the glass in units of 10⁸ m/s to 3 decimal places; then its wavelength inside the glass in nanometres to 1 decimal place. Last, a stray ray inside the lens strikes the flat back face at ${n(a)} radians from the normal: enter 1 if it is totally internally reflected, or 0 if it escapes into the air.`,
  answer: [rd(di, 1), rd(v, 3), rd(li, 1), trap],
  hints: ['The thin-lens equation 1/d₀ + 1/dᵢ = 1/f gives dᵢ = f × d₀ ÷ (d₀ − f); the sign of dᵢ says real or virtual.', 'In a material of index n the speed is v = c ÷ n and, with the frequency unchanged, the wavelength is the vacuum wavelength ÷ n. For the stray ray use sin θc = n₂ ÷ n₁ with the glass as n₁.'],
  solution: `dᵢ = f × d₀ ÷ (d₀ − f) = ${n(f)} × ${n(d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}, so the image is ${di > 0 ? 'real' : 'virtual'}. In the glass the light travels at v = c ÷ n = 3.00 ÷ ${n(nn)} ${say(v, 3)} in units of 10⁸ m/s, and its wavelength is ${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}. For the stray ray, sin θc = 1.00 ÷ ${n(nn)} ${eq4(sc)}, so θc ${say(c, 3, ' rad')}. The ray strikes at ${n(a)} rad, ${trap ? 'more than θc, so it is totally internally reflected: 1.' : 'less than θc, so part of it escapes into the air: 0.'}`,
  guidance: [
   { prompt: `What is the image distance dᵢ = ${n(f)} × ${n(d)} ÷ (${n(d)} − ${n(f)}), in cm to 1 decimal place?`, answer: [rd(di, 1)], explanation: `dᵢ = ${n(f * d)} ÷ ${par(d - f)} ${say(di, 1, ' cm')}.` },
   { prompt: `What is the speed of the light in the glass, 3.00 ÷ ${n(nn)}, in units of 10⁸ m/s to 3 decimal places?`, answer: [rd(v, 3)], explanation: `v = 3.00 ÷ ${n(nn)} ${say(v, 3)}.` },
   { prompt: `The frequency is unchanged, so the wavelength shrinks by the factor ${n(nn)}. What is ${n(lam)} ÷ ${n(nn)}, in nanometres to 1 decimal place?`, answer: [rd(li, 1)], explanation: `${n(lam)} ÷ ${n(nn)} ${say(li, 1, ' nm')}.` },
   { prompt: `The critical angle for ${name} against air is arcsin(1.00 ÷ ${n(nn)}) ≈ ${n(rd(c, 3))} rad. The stray ray strikes at ${n(a)} rad. Enter 1 if it is trapped, 0 if it escapes.`, answer: [trap], explanation: trap ? `${n(a)} rad is more than the critical angle: total internal reflection, 1.` : `${n(a)} rad is less than the critical angle, so part of it refracts out: 0.` }
  ] }; }
});

/* ---- q30 Young's double slit: bright and dark angles, d sin θ = mλ [V3 3.1, 3.2] ---- */

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Checking the laser diode',
 brief: 'The lab has etched a pair of slits into a test plate to check the colour of a new laser diode from the outpost stores.',
 labels: ['bright fringe angle, order m (rad)', 'bright fringe angle, order m + 1 (rad)', 'bright fringes in all (whole number)'], tolerance: 0.00005,
 gl: [['bright fringe angle, order m (rad)'], ['bright fringe angle, order m + 1 (rad)'], ['bright fringes in all (whole number)']]
}, {
 /* d in μm (one decimal), lam in nm, order m. Orders up to floor(d ÷ λ) appear on each side, so the count is 2 × that + 1.
    d ÷ λ is never within 0.05 of a whole number, the order m + 1 is a real fringe, and its sine is below 0.9.
    Not the parent's example (4.4 μm, 500 nm, m = 1) or its canonical (5 μm, 600 nm, m = 2). */
 canonical: { d: 3.6, lam: 650, m: 2 },
 draw: R => guard(() => ({ d: R.int(20, 120) / 10, lam: R.int(400, 700), m: R.int(1, 3) }),
  ({ d, lam, m }) => { const D = Math.round(d * 1000), top = Math.floor(D / lam), s1 = m * lam / D, s2 = (m + 1) * lam / D;
   return top >= m + 1 && s2 < 0.9 && clear(D / lam) && !(d === 4.4 && lam === 500 && m === 1) && !(d === 5 && lam === 600 && m === 2) && ok(Math.asin(s1), 4) && ok(Math.asin(s2), 4); }, { d: 3.6, lam: 650, m: 2 }),
 build: ({ d, lam, m }) => { const D = Math.round(d * 1000), s1 = m * lam / D, s2 = (m + 1) * lam / D, t1 = Math.asin(s1), t2 = Math.asin(s2), top = Math.floor(D / lam), total = 2 * top + 1; return {
  prompt: `The Fringe Lab has etched two narrow slits ${n(d)} μm apart (a micrometre, μm, is 1000 nm) into a test plate, to check the colour of a laser diode whose wavelength is ${n(lam)} nm. Enter the angle from the centre line of the bright fringe of order m = ${n(m)}, then of the bright fringe of order m = ${n(m + 1)}, both in radians to 4 decimal places. Then enter how many bright fringes appear on the screen in all, counting the bright centre and both sides, as a whole number.`,
  answer: [rd(t1, 4), rd(t2, 4), total],
  hints: ['Bright fringes need a path difference of a whole number of wavelengths, d sin θ = mλ. Put d and λ in the same unit first: 1 μm is 1000 nm.', 'sin θ cannot pass 1, so the highest order on one side is the whole-number part of d ÷ λ. The orders run from that number down to 0 on each side, and the centre (order 0) is shared.'],
  solution: `In nanometres the slits are d = ${n(D)} nm apart. Order ${n(m)}: sin θ = ${n(m)} × ${n(lam)} ÷ ${n(D)} ${eq4(s1)}, so θ = arcsin(${n(s1)}) ${say(t1, 4, ' rad')}. Order ${n(m + 1)}: sin θ = ${n(m + 1)} × ${n(lam)} ÷ ${n(D)} ${eq4(s2)}, so θ ${say(t2, 4, ' rad')}. The highest order is the whole-number part of d ÷ λ = ${n(D)} ÷ ${n(lam)} ≈ ${n(rd(D / lam, 2))}, which is ${n(top)}. That makes ${n(top)} bright fringes on each side of the centre and one in the middle: 2 × ${n(top)} + 1 = ${n(total)}.`,
  guidance: [
   { prompt: `Put both lengths in nanometres: d = ${n(d)} μm. For the bright fringe of order ${n(m)}, sin θ = ${n(m)} × ${n(lam)} ÷ ${n(D)}. What is θ in radians, to 4 decimal places?`, answer: [rd(t1, 4)], explanation: `d = ${n(D)} nm, sin θ ${eq4(s1)}, and arcsin of it ${say(t1, 4, ' rad')}.` },
   { prompt: `For the bright fringe of order ${n(m + 1)}, sin θ = ${n(m + 1)} × ${n(lam)} ÷ ${n(D)}. What is θ in radians, to 4 decimal places?`, answer: [rd(t2, 4)], explanation: `sin θ ${eq4(s2)}, and arcsin of it ${say(t2, 4, ' rad')}.` },
   { prompt: `sin θ cannot be more than 1, so the highest order on one side is the whole-number part of ${n(D)} ÷ ${n(lam)}. How many bright fringes are there in all, counting the centre and both sides?`, answer: [total], explanation: `${n(D)} ÷ ${n(lam)} ≈ ${n(rd(D / lam, 2))}, so the highest order is ${n(top)}. That is ${n(top)} on each side plus the centre: 2 × ${n(top)} + 1 = ${n(total)}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'The unlabelled laser',
 brief: 'A laser has come out of the stores with its colour label rubbed off, and the Fringe Lab will read its wavelength from its fringes.',
 labels: ['path difference (nm)', 'wavelength (nm)', 'highest order (whole number)'], tolerance: 0.005,
 gl: [['path difference (nm)'], ['wavelength (nm)'], ['highest order (whole number)']]
}, {
 /* λ = d sin a ÷ m, kept between 400 and 700 nm; the highest order floor(m ÷ sin a) (the same as floor(d ÷ λ)) is never near a
    whole number. d in μm (one decimal). The angle is a parameter (hundredths of a radian). */
 canonical: { d: 5.5, m: 3, a: 0.25 },
 draw: R => guard(() => ({ d: R.int(20, 150) / 10, m: R.int(1, 4), a: R.int(5, 60) / 100 }),
  ({ d, m, a }) => { const D = Math.round(d * 1000), pd = D * Math.sin(a), lam = pd / m; return lam >= 400 && lam <= 700 && clear(m / Math.sin(a)) && ok(pd, 1) && ok(lam, 1); }, { d: 5.5, m: 3, a: 0.25 }),
 build: ({ d, m, a }) => { const D = Math.round(d * 1000), sa = Math.sin(a), pd = D * sa, lam = pd / m, top = Math.floor(D / lam); return {
  prompt: `A laser with no label shines on two narrow slits ${n(d)} μm apart (a micrometre, μm, is 1000 nm). The bright fringe of order m = ${n(m)} appears at ${n(a)} radians from the centre line. Bright fringes sit where d sin θ = mλ. Enter the path difference d sin θ for that fringe in nanometres to 1 decimal place, then the wavelength of the laser in nanometres to 1 decimal place, then the highest order of bright fringe that can appear on one side, as a whole number. Use the unrounded wavelength for the highest order, and type any answer of 1000 or more without commas.`,
  answer: [rd(pd, 1), rd(lam, 1), top],
  hints: ['Convert d to nanometres first (1 μm is 1000 nm), then find the path difference d sin θ with the calculator set to radians.', 'A bright fringe of order m has path difference mλ, so λ is the path difference divided by m. The highest order is the whole-number part of d ÷ λ, because sin θ cannot pass 1.'],
  solution: `d = ${n(d)} μm = ${n(D)} nm. The path difference is d sin θ = ${n(D)} × sin ${n(a)} ≈ ${n(D)} × ${n(sa)} ${say(pd, 1, ' nm')}. For order ${n(m)} this equals ${n(m)}λ, so λ = ${n(pd)} ÷ ${n(m)} ${say(lam, 1, ' nm')}. The highest order is the whole-number part of d ÷ λ = ${n(D)} ÷ ${n(lam)} ≈ ${n(rd(D / lam, 2))}, which is ${n(top)}.`,
  guidance: [
   { prompt: `What is the path difference d sin θ = ${n(D)} × sin ${n(a)}, in nanometres to 1 decimal place (calculator in radians)?`, answer: [rd(pd, 1)], explanation: `sin ${n(a)} ≈ ${n(sa)}, and ${n(D)} × ${n(sa)} ${say(pd, 1, ' nm')}.` },
   { prompt: `This path difference is ${n(m)} wavelength${m === 1 ? '' : 's'}. What is the wavelength, using the unrounded path difference, in nanometres to 1 decimal place?`, answer: [rd(lam, 1)], explanation: `λ = ${n(pd)} ÷ ${n(m)} ${say(lam, 1, ' nm')}.` },
   { prompt: `sin θ cannot be more than 1, so the order is at most ${n(D)} ÷ λ. What is the highest order of bright fringe, as a whole number?`, answer: [top], explanation: `${n(D)} ÷ ${n(lam)} ≈ ${n(rd(D / lam, 2))}, and the order must be a whole number, so it is ${n(top)}.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q24', title: 'The double slit under the liquid',
 brief: 'The Fringe Lab dips its double slit and screen into a tank to see how a liquid squeezes the fringes together.',
 labels: ['wavelength in the liquid (nm)', 'angle in air (rad)', 'angle in the liquid (rad)', 'highest order in the liquid (whole number)'], tolerance: 0.00005,
 gl: [['wavelength in the liquid (nm)'], ['angle in air (rad)'], ['angle in the liquid (rad)'], ['highest order in the liquid (whole number)']]
}, {
 /* λ inside = lam0 ÷ n (q24). The angles use sin θ = mλ ÷ d with the vacuum wavelength (air) and the wavelength in the liquid;
    both sines are below 0.85; the highest order in the liquid, floor(d ÷ λliquid), is never near a whole number. */
 canonical: { d: 6.7, lam0: 675, nl: 1.361, m: 2 },
 draw: R => guard(() => ({ d: R.int(30, 120) / 10, lam0: R.int(400, 700), nl: R.pick(LIQUID), m: R.int(1, 4) }),
  ({ d, lam0, nl, m }) => { const D = Math.round(d * 1000), ll = lam0 / nl, sa = m * lam0 / D, sl = m * ll / D;
   return sa < 0.85 && clear(D / ll) && ok(ll, 1) && ok(Math.asin(sa), 4) && ok(Math.asin(sl), 4); }, { d: 6.7, lam0: 675, nl: 1.361, m: 2 }),
 build: ({ d, lam0, nl, m }) => { const L = MAT[nl], D = Math.round(d * 1000), ll = lam0 / nl, sa = m * lam0 / D, sl = m * ll / D, ta = Math.asin(sa), tl = Math.asin(sl), top = Math.floor(D / ll); return {
  prompt: `The Fringe Lab dips its double slit, and the screen, into a tank of ${L} (index of refraction ${n(nl)}). The slits are ${n(d)} μm apart (a micrometre, μm, is 1000 nm), and the laser’s wavelength in a vacuum is ${n(lam0)} nm. Light keeps its frequency in a material, so its wavelength there is the vacuum wavelength divided by the index. Enter the wavelength of the light in the ${L} in nanometres to 1 decimal place. Then enter the angle of the bright fringe of order m = ${n(m)} if the same slits were used in air (use the vacuum wavelength), and the angle of the same fringe in the ${L}, both in radians to 4 decimal places. Last, enter the highest order of bright fringe that can appear on one side in the ${L}, as a whole number. Use unrounded values from one step to the next.`,
  answer: [rd(ll, 1), rd(ta, 4), rd(tl, 4), top],
  hints: ['In a material of index n the frequency is the same and the speed is n times smaller, so the wavelength is the vacuum wavelength ÷ n.', 'Bright fringes sit at d sin θ = mλ with the wavelength the light has where the slits are. Put d in nanometres. The highest order is the whole-number part of d ÷ λ, since sin θ cannot pass 1.'],
  solution: `In the ${L} the wavelength is ${n(lam0)} ÷ ${n(nl)} ${say(ll, 1, ' nm')}. With d = ${n(D)} nm, in air sin θ = ${n(m)} × ${n(lam0)} ÷ ${n(D)} ${eq4(sa)}, so θ = arcsin(${n(sa)}) ${say(ta, 4, ' rad')}. In the ${L} sin θ = ${n(m)} × ${n(ll)} ÷ ${n(D)} ${eq4(sl)}, so θ = arcsin(${n(sl)}) ${say(tl, 4, ' rad')}: the fringe moves in towards the centre line. The highest order in the ${L} is the whole-number part of d ÷ λ = ${n(D)} ÷ ${n(ll)} ≈ ${n(rd(D / ll, 2))}, which is ${n(top)}.`,
  guidance: [
   { prompt: `What is the wavelength in the ${L}, ${n(lam0)} ÷ ${n(nl)}, in nanometres to 1 decimal place?`, answer: [rd(ll, 1)], explanation: `${n(lam0)} ÷ ${n(nl)} ${say(ll, 1, ' nm')}.` },
   { prompt: `In air sin θ = ${n(m)} × ${n(lam0)} ÷ ${n(D)}, with d = ${n(d)} μm = ${n(D)} nm. What is θ in radians, to 4 decimal places?`, answer: [rd(ta, 4)], explanation: `sin θ ${eq4(sa)}, and arcsin of it ${say(ta, 4, ' rad')}.` },
   { prompt: `In the ${L} use the unrounded wavelength: sin θ = ${n(m)} × λ ÷ ${n(D)}. What is θ in radians, to 4 decimal places?`, answer: [rd(tl, 4)], explanation: `sin θ = ${n(m)} × ${n(ll)} ÷ ${n(D)} ${eq4(sl)}, and arcsin of it ${say(tl, 4, ' rad')}.` },
   { prompt: `sin θ cannot be more than 1, so the order is at most ${n(D)} ÷ λ, with λ the wavelength in the ${L}. What is the highest order of bright fringe, as a whole number?`, answer: [top], explanation: `${n(D)} ÷ ${n(ll)} ≈ ${n(rd(D / ll, 2))}, and the order must be a whole number, so it is ${n(top)}.` }
  ] }; }
});

})();
