/* Electricity and magnetism: fields practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p4.js. */
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
/* Round to 2 decimal places (float noise nudged); tie2 is true when x sits on, or within float noise of, a rounding tie. */
const rd2 = x => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
const tie2 = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-4;
/* True when x has at most 2 decimal places. */
const is2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
/* '=' when x is exactly its 2-decimal value, otherwise '≈'; 'about ' likewise. */
const eq = x => is2(x) ? '=' : '≈';
const ab = x => is2(x) ? '' : 'about ';
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const NC = ' (type them without commas)';

/* ---- q16 Uniform field between plates: V = Ed [7.2] ---- */

mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The dust-trap plates',
 brief: 'The ion gun’s dust trap needs a pair of plates set to a chosen field, and the crew must know what supply to fit.',
 labels: ['potential difference (V)', 'potential of the point (V)'], tolerance: 0.005,
 gl: [['potential difference (V)'], ['potential of the point (V)']]
}, {
 /* Field E kV/m (= E volts per mm), gap d mm; the point is s mm from the NEGATIVE plate (0 V), so the potential is E × s, not a drop from the top.
    Not the worked example (120 V across 3 mm, a 40 kV/m field). */
 canonical: { E: 35, d: 6, s: 2 },
 draw: R => tries(() => { const d = R.pick([3, 4, 5, 6, 8, 10]); return { E: R.int(8, 90), d, s: R.int(1, d - 1) }; }, p => !(p.d === 3 && p.E === 40), { E: 35, d: 6, s: 2 }),
 build: ({ E, d, s }) => { const V = E * d, Vp = E * s; return {
  prompt: `A dust trap in the ion gun has two large parallel plates ${n(d)} mm apart. The crew wants a uniform field of ${n(E)} kV/m between them. Take the negative plate as 0 V. Enter the potential difference the supply must put across the plates in V, then the potential of a point ${n(s)} mm from the negative plate in V.`,
  answer: [V, Vp],
  hints: ['A field of 1 kV/m is 1 V for every millimetre, so with the gap in millimetres the potential difference across it is the field (in kV/m) times the gap.', 'The potential rises by the same amount for every millimetre you move away from the negative plate, which is at 0 V. Multiply the field by the distance from that plate.'],
  solution: `A field of ${n(E)} kV/m is ${n(E)} V for every millimetre. Across ${n(d)} mm the potential difference is ${n(E)} × ${n(d)} = ${n(V)} V. The negative plate is at 0 V and the potential rises ${n(E)} V for each millimetre away from it, so a point ${n(s)} mm from it is at ${n(E)} × ${n(s)} = ${n(Vp)} V.`,
  guidance: [
   { prompt: `The field is ${n(E)} kV/m, which is ${n(E)} V for every millimetre. What potential difference does the supply put across ${n(d)} mm, in V?`, answer: [V], explanation: `${n(E)} × ${n(d)} = ${n(V)} V.` },
   { prompt: `Starting at the negative plate (0 V), the potential rises ${n(E)} V per millimetre. What is the potential ${n(s)} mm from that plate, in V?`, answer: [Vp], explanation: `${n(E)} × ${n(s)} = ${n(Vp)} V.` }
  ] }; }
});

mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'The spark margin',
 brief: 'The gun’s plates must hold off the supply without sparking, and the crew wants to know how much margin they have.',
 labels: ['field (kV/m)', 'largest safe potential difference (V)', 'spare potential difference (V)'], tolerance: 0.005,
 gl: [['field (kV/m)'], ['largest safe potential difference (V)'], ['spare potential difference (V)']]
}, {
 /* d mm gap, supply V (a multiple of 50) with V ÷ d at most 2 decimals; the crew's limit L kV/m is above the field so the spare voltage is positive.
    Not the worked example (120 V across 3 mm). */
 canonical: { d: 5, V: 600, L: 150 },
 draw: R => tries(() => ({ d: R.pick([2, 4, 5, 8, 10]), V: 50 * R.int(2, 24), L: R.pick([100, 120, 150, 200, 250, 300]) }), p => p.V < p.L * p.d && is2(p.V / p.d) && !tie2(p.V / p.d), { d: 5, V: 600, L: 150 }),
 build: ({ d, V, L }) => { const E = rd2(V / d), Vmax = L * d, spare = Vmax - V; return {
  prompt: `The ion gun’s plates are ${n(d)} mm apart and the supply puts ${n(V)} V across them. The field between them is uniform. The crew sets a safe limit of ${n(L)} kV/m for the field in the gap; above that it may spark. Enter the field in the gap in kV/m, then the largest potential difference in V the gap can hold without going over the limit, then how many volts of spare potential difference the supply leaves below that largest value (type them without commas).`,
  answer: [E, Vmax, spare],
  hints: ['The field in the gap is the potential difference divided by the gap. A volt per millimetre is a kilovolt per metre.', 'Read V = Ed backwards: the largest safe potential difference is the field limit times the gap. The spare is that largest value minus the supply’s voltage.'],
  solution: `E = V ÷ d = ${n(V)} V ÷ ${n(d)} mm = ${n(E)} V/mm, which is ${n(E)} kV/m. At the limit of ${n(L)} kV/m the gap could hold V = Ed = ${n(L)} × ${n(d)} = ${n(Vmax)} V. The supply uses ${n(V)} V of that, which leaves ${n(Vmax)} − ${n(V)} = ${n(spare)} V spare.`,
  guidance: [
   { prompt: `${n(V)} V across ${n(d)} mm. What is the field, in kV/m?`, answer: [E], explanation: `${n(V)} ÷ ${n(d)} = ${n(E)} V per millimetre, which is ${n(E)} kV/m.` },
   { prompt: `The limit is ${n(L)} kV/m, which is ${n(L)} V per millimetre, over a gap of ${n(d)} mm. What is the largest potential difference the gap can hold, in V?`, answer: [Vmax], explanation: `${n(L)} × ${n(d)} = ${n(Vmax)} V.` },
   { prompt: `The largest safe value is ${n(Vmax)} V and the supply puts ${n(V)} V across the plates. How many volts of spare potential difference are left?`, answer: [spare], explanation: `${n(Vmax)} − ${n(V)} = ${n(spare)} V.` }
  ] }; }
});

mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', title: 'Three plates in a row',
 brief: 'The two-stage stack in the gun has a different field in each gap, and the crew needs the potential at each plate.',
 labels: ['potential of the middle plate (V)', 'potential of the last plate (V)', 'average field (kV/m)'], tolerance: 0.005,
 gl: [['potential of the middle plate (V)'], ['potential of the last plate (V)'], ['average field (kV/m)']]
}, {
 /* Two uniform gaps in a row, each with its own field (kV/m = V per mm); the potential rises by E × width across each. The average field is the last
    plate's potential over the total distance, to 2 decimals and off a rounding tie. Not the worked example (40 kV/m over 3 mm). */
 canonical: { E1: 35, d1: 4, E2: 20, d2: 5 },
 draw: R => tries(() => ({ E1: R.int(10, 80), d1: R.int(2, 9), E2: R.int(10, 80), d2: R.int(2, 9) }), p => p.E1 !== p.E2 && p.d1 !== p.d2 && !tie2((p.E1 * p.d1 + p.E2 * p.d2) / (p.d1 + p.d2)), { E1: 35, d1: 4, E2: 20, d2: 5 }),
 build: ({ E1, d1, E2, d2 }) => { const V1 = E1 * d1, V2 = V1 + E2 * d2, D = d1 + d2, avg = rd2(V2 / D); return {
  prompt: `A two-stage stack in the ion gun has three flat plates in a row. The first plate is at 0 V. The first gap is ${n(d1)} mm wide with a uniform field of ${n(E1)} kV/m, and the second gap is ${n(d2)} mm wide with a uniform field of ${n(E2)} kV/m. In both gaps the field points back towards the first plate, so the potential rises as you move away from it. Enter the potential of the middle plate in V, then the potential of the last plate in V, then the average field over the whole stack in kV/m to 2 decimal places, taken as the last plate’s potential divided by the total distance from the first plate (type them without commas).`,
  answer: [V1, V2, avg],
  hints: ['In each gap the field is uniform, so the potential rises by the field (in kV/m, which is volts per millimetre) times the width of that gap.', 'The last plate’s potential is the middle plate’s potential plus the rise across the second gap. For the average, divide by the whole distance from the first plate to the last, not by one gap.'],
  solution: `A field of ${n(E1)} kV/m is ${n(E1)} V per millimetre, so across the first gap the potential rises ${n(E1)} × ${n(d1)} = ${n(V1)} V and the middle plate is at ${n(V1)} V. Across the second gap it rises ${n(E2)} × ${n(d2)} = ${n(E2 * d2)} V, so the last plate is at ${n(V1)} + ${n(E2 * d2)} = ${n(V2)} V. The total distance is ${n(d1)} + ${n(d2)} = ${n(D)} mm, so the average field is ${n(V2)} ÷ ${n(D)} ${eq(V2 / D)} ${n(avg)} kV/m (to 2 decimal places).`,
  guidance: [
   { prompt: `The first gap is ${n(d1)} mm wide and the field is ${n(E1)} V per millimetre. What is the potential of the middle plate, in V?`, answer: [V1], explanation: `${n(E1)} × ${n(d1)} = ${n(V1)} V, starting from 0 V at the first plate.` },
   { prompt: `The second gap is ${n(d2)} mm wide and the field is ${n(E2)} V per millimetre. What is the potential of the last plate, in V?`, answer: [V2], explanation: `The potential rises ${n(E2)} × ${n(d2)} = ${n(E2 * d2)} V across the second gap: ${n(V1)} + ${n(E2 * d2)} = ${n(V2)} V.` },
   { prompt: `The last plate is at ${n(V2)} V and the total distance from the first plate is ${n(D)} mm. What is the average field, in kV/m to 2 decimal places?`, answer: [avg], explanation: `${n(V2)} ÷ ${n(D)} ${eq(V2 / D)} ${n(avg)} V per millimetre, which is ${n(avg)} kV/m (to 2 decimal places).` }
  ] }; }
});

/* ---- q17 Chapter review: field, potential and energy together [7.2, 7.3] ---- */

/* The kinetic energy in eV of a proton at v = 40k km/s (the prompt gives the mass and charge): 8.35k², exactly. */
const ke = k => rd2(8.35 * k * k);

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The reflector stage',
 brief: 'A reflector stage in the gun is meant to turn incoming protons back, and the crew wants to know how deep they get.',
 labels: ['potential difference (V)', 'kinetic energy (eV)', 'stopping distance (mm)'], tolerance: 0.005,
 gl: [['potential difference (V)'], ['kinetic energy (eV)'], ['stopping distance (mm)']]
}, {
 /* Proton at v = 40k km/s against a uniform field E (kV/m) across a gap g (mm): the potential difference is E × g, the kinetic energy is 8.35k² eV and the
    proton stops after s = KE ÷ E, inside the gap, off a rounding tie. Not the worked example (120 km/s, 20 kV/m) nor the parent (200 km/s, 75 kV/m). */
 canonical: { v: 160, E: 40, g: 6 },
 draw: R => tries(() => ({ v: 40 * R.int(2, 9), E: R.pick([10, 16, 20, 25, 32, 40, 50, 64, 80, 100]), g: R.pick([4, 5, 6, 8, 10]) }),
  p => { const k = p.v / 40; return ke(k) < p.E * p.g && !(k === 3 && p.E === 20) && !(k === 5 && p.E === 75) && !tie2(ke(k) / p.E); }, { v: 160, E: 40, g: 6 }),
 build: ({ v, E, g }) => { const k = v / 40, V = E * g, KE = ke(k), s = rd2(KE / E); return {
  prompt: `In the reflector stage of the ion gun a proton (mass 1.67 × 10⁻²⁷ kg, charge e = 1.60 × 10⁻¹⁹ C) passes through a hole in the low-potential plate at ${n(v)} km/s, heading straight for the high-potential plate. The plates are ${n(g)} mm apart and the uniform field between them is ${n(E)} kV/m. Enter the potential difference between the plates in V, then the proton’s kinetic energy at the hole in eV, then how far it gets past the hole before it stops, in mm to 2 decimal places (type them without commas).`,
  answer: [V, KE, s],
  hints: ['A field of 1 kV/m is 1 V for every millimetre, so the potential difference across the gap is the field times the gap in millimetres.', 'Work out ½mv² in joules (km/s × 1000 gives m/s), then divide by 1.60 × 10⁻¹⁹ J per eV. Moving towards higher potential, a proton loses 1 eV of kinetic energy for every volt it climbs.', 'It stops once it has climbed as many volts as it has electron-volts. The potential rises by the field for every millimetre, so divide those volts by the field.'],
  solution: `A field of ${n(E)} kV/m is ${n(E)} V per millimetre, so across ${n(g)} mm the potential difference is ${n(E)} × ${n(g)} = ${n(V)} V. The kinetic energy is ½mv² = ½ × 1.67 × 10⁻²⁷ × (${n(v)} × 10³)² J, and dividing by 1.60 × 10⁻¹⁹ J per eV gives ${n(KE)} eV. The proton stops when it has climbed ${n(KE)} V, which takes ${n(KE)} ÷ ${n(E)} ${eq(KE / E)} ${n(s)} mm (to 2 decimal places). That is less than the ${n(g)} mm gap, so it stops before the high-potential plate.`,
  guidance: [
   { prompt: `The field is ${n(E)} kV/m, which is ${n(E)} V per millimetre, over a gap of ${n(g)} mm. What is the potential difference between the plates, in V?`, answer: [V], explanation: `${n(E)} × ${n(g)} = ${n(V)} V.` },
   { prompt: `Find ½mv² for v = ${n(v)} km/s and turn it into eV. What is the kinetic energy, in eV?`, answer: [KE], explanation: `½ × 1.67 × 10⁻²⁷ × (${n(v)} × 10³)² J ÷ 1.60 × 10⁻¹⁹ J per eV = ${n(KE)} eV.` },
   { prompt: `The proton stops after climbing ${n(KE)} V, and the potential rises ${n(E)} V per mm. How far does it get, in mm to 2 decimal places?`, answer: [s], explanation: `${n(KE)} ÷ ${n(E)} ${eq(KE / E)} ${n(s)} mm (to 2 decimal places).` }
  ] }; }
});

mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'Boost, then brake',
 brief: 'A proton is boosted along one stage and then braked in the next, and the crew wants its energy and its total run.',
 labels: ['kinetic energy (eV)', 'distance into the brake stage (mm)', 'total distance (mm)'], tolerance: 0.005,
 gl: [['kinetic energy (eV)'], ['distance into the brake stage (mm)'], ['total distance (mm)']]
}, {
 /* From rest, a proton crosses s1 mm of a booster field E1 kV/m (V per mm), so it gains E1 × s1 eV, then stops after KE ÷ E2 mm in the brake field.
    The stopping distance is off a rounding tie. Not the worked example (20 kV/m). */
 canonical: { E1: 25, s1: 6, E2: 40 },
 draw: R => tries(() => ({ E1: R.pick([10, 20, 25, 40, 50]), s1: R.int(2, 9), E2: R.pick([8, 16, 20, 25, 32, 40, 50, 80]) }), p => !tie2(p.E1 * p.s1 / p.E2) && p.E1 * p.s1 / p.E2 >= 0.5 && !(p.E1 === 20 && p.E2 === 20), { E1: 25, s1: 6, E2: 40 }),
 build: ({ E1, s1, E2 }) => { const KE = E1 * s1, st = rd2(KE / E2), tot = rd2(s1 + KE / E2); return {
  prompt: `A proton is released from rest at the start of a booster stage of the ion gun. In the booster the field is uniform at ${n(E1)} kV/m and points the way the proton moves, and the proton travels ${n(s1)} mm through it. It then enters a brake stage, long enough to stop it, where the uniform field is ${n(E2)} kV/m and points the opposite way, so the potential rises along its path. Enter the kinetic energy the proton has when it leaves the booster in eV, then how far into the brake stage it gets before it stops in mm to 2 decimal places, then the total distance it has travelled from release to the stopping point in mm to 2 decimal places.`,
  answer: [KE, st, tot],
  hints: ['A field of 1 kV/m is 1 V for every millimetre. A proton gains 1 eV of kinetic energy for every volt of potential it falls through, so multiply the booster’s field by the distance.', 'In the brake stage the proton loses 1 eV for every volt of potential it climbs, so it stops after (its energy in eV) ÷ (the field in V per mm).', 'The total distance is the distance through the booster plus the distance into the brake stage.'],
  solution: `The booster gives ${n(E1)} V per millimetre, so over ${n(s1)} mm the proton falls through ${n(E1)} × ${n(s1)} = ${n(KE)} V and gains ${n(KE)} eV. In the brake stage the potential rises ${n(E2)} V per millimetre, so the proton stops after ${n(KE)} ÷ ${n(E2)} ${eq(KE / E2)} ${n(st)} mm (to 2 decimal places). The total distance is ${n(s1)} + ${n(KE / E2)} ${eq(s1 + KE / E2)} ${n(tot)} mm (to 2 decimal places).`,
  guidance: [
   { prompt: `The booster field is ${n(E1)} kV/m, which is ${n(E1)} V per millimetre, over ${n(s1)} mm. What kinetic energy does the proton gain, in eV?`, answer: [KE], explanation: `It falls through ${n(E1)} × ${n(s1)} = ${n(KE)} V, so it gains ${n(KE)} eV.` },
   { prompt: `In the brake stage the potential rises ${n(E2)} V per millimetre and the proton has ${n(KE)} eV. How far into the brake stage does it get, in mm to 2 decimal places?`, answer: [st], explanation: `${n(KE)} ÷ ${n(E2)} ${eq(KE / E2)} ${n(st)} mm (to 2 decimal places).` },
   { prompt: `It went ${n(s1)} mm through the booster and then ${n(st)} mm into the brake stage. What is the total distance, in mm to 2 decimal places?`, answer: [tot], explanation: `${n(s1)} + ${n(st)} = ${n(tot)} mm.` }
  ] }; }
});

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', title: 'Through the gap with energy to spare',
 brief: 'A fast proton is not stopped by the gap at all, and the crew wants the energy it carries out and where it has lost half.',
 labels: ['kinetic energy at the hole (eV)', 'kinetic energy at the far plate (eV)', 'distance to the half-energy point (mm)'], tolerance: 0.005,
 gl: [['kinetic energy at the hole (eV)'], ['kinetic energy at the far plate (eV)'], ['distance to the half-energy point (mm)']]
}, {
 /* v = 40k km/s, KE0 = 8.35k² eV. The gap's potential difference E × g is below KE0 (the proton reaches the plate) and above KE0 ÷ 2
    (the half-energy point is inside the gap). The distance KE0 ÷ (2E) is off a rounding tie. Not the parent (200 km/s, 75 kV/m). */
 canonical: { v: 320, E: 50, g: 8 },
 draw: R => tries(() => ({ v: 40 * R.int(6, 11), E: R.pick([20, 25, 40, 50, 64, 80, 100]), g: R.pick([4, 5, 6, 8, 10]) }),
  p => { const K = ke(p.v / 40), Vg = p.E * p.g; return Vg < K && 2 * Vg > K && !tie2(K / 2 / p.E); }, { v: 320, E: 50, g: 8 }),
 build: ({ v, E, g }) => { const k = v / 40, KE0 = ke(k), Vg = E * g, KE1 = rd2(KE0 - Vg), d = rd2(KE0 / 2 / E); return {
  prompt: `A fast proton (mass 1.67 × 10⁻²⁷ kg, charge e = 1.60 × 10⁻¹⁹ C) passes through a hole in the low-potential plate of an ion-gun gap at ${n(v)} km/s, heading straight for the high-potential plate. The plates are ${n(g)} mm apart and the uniform field between them is ${n(E)} kV/m. Enter the proton’s kinetic energy at the hole in eV, then its kinetic energy when it arrives at the high-potential plate in eV, then the distance from the hole to the point where its kinetic energy has fallen to half its value at the hole, in mm to 2 decimal places (type them without commas).`,
  answer: [KE0, KE1, d],
  hints: ['Work out ½mv² in joules (km/s × 1000 gives m/s), then divide by 1.60 × 10⁻¹⁹ J per eV.', 'A field of 1 kV/m is 1 V for every millimetre. Across the whole gap the proton climbs that many volts, and loses 1 eV for every volt it climbs.', 'Half of the starting energy is lost after climbing half that many volts. Divide those volts by the field to get the distance.'],
  solution: `The kinetic energy at the hole is ½mv² = ½ × 1.67 × 10⁻²⁷ × (${n(v)} × 10³)² J, and dividing by 1.60 × 10⁻¹⁹ J per eV gives ${n(KE0)} eV. Across the gap the potential rises ${n(E)} × ${n(g)} = ${n(Vg)} V, so the proton loses ${n(Vg)} eV and arrives with ${n(KE0)} − ${n(Vg)} = ${n(KE1)} eV. It has lost half its energy after climbing ${n(KE0)} ÷ 2 = ${n(KE0 / 2)} V, which takes ${n(KE0 / 2)} ÷ ${n(E)} ${eq(KE0 / 2 / E)} ${n(d)} mm (to 2 decimal places), less than the ${n(g)} mm gap.`,
  guidance: [
   { prompt: `Find ½mv² for v = ${n(v)} km/s and turn it into eV. What is the kinetic energy at the hole, in eV?`, answer: [KE0], explanation: `½ × 1.67 × 10⁻²⁷ × (${n(v)} × 10³)² J ÷ 1.60 × 10⁻¹⁹ J per eV = ${n(KE0)} eV.` },
   { prompt: `The field is ${n(E)} V per millimetre over ${n(g)} mm, and the proton loses 1 eV per volt climbed. What kinetic energy does it have on arriving at the far plate, in eV?`, answer: [KE1], explanation: `It climbs ${n(E)} × ${n(g)} = ${n(Vg)} V, so ${n(KE0)} − ${n(Vg)} = ${n(KE1)} eV is left.` },
   { prompt: `Half the starting energy is ${n(KE0 / 2)} eV, so the proton has climbed ${n(KE0 / 2)} V at that point, and the potential rises ${n(E)} V per mm. How far from the hole is it, in mm to 2 decimal places?`, answer: [d], explanation: `${n(KE0 / 2)} ÷ ${n(E)} ${eq(KE0 / 2 / E)} ${n(d)} mm (to 2 decimal places).` }
  ] }; }
});

/* ---- q18 Capacitance of parallel plates [8.1] ---- */

/* C in pF for plates of A cm² a gap of d mm apart in air (ε₀ = 8.85 × 10⁻¹² F/m): 0.885 A ÷ d. */
const cap = (A, d) => 0.885 * A / d;

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The memory board plates',
 brief: 'The vault’s backup memory board uses two plates cut from sheet metal, and the crew needs their capacitance and charge.',
 labels: ['area (m²)', 'capacitance (pF)', 'charge (nC)'], tolerance: 0.005,
 gl: [['area (m²)'], ['capacitance (pF)'], ['charge (nC)']]
}, {
 /* Rectangular plates L by W cm with L × W a multiple of 100, so the area in m² has 2 decimals. C and Q are off rounding ties and Q from the rounded C
    rounds the same way. Not the parent (400 cm², 2 mm, 300 V) nor the worked example (0.5 m², 1 mm, 100 V). */
 canonical: { L: 30, W: 20, d: 4, V: 200 },
 draw: R => tries(() => ({ L: R.pick([10, 12, 15, 20, 25, 30, 35, 40]), W: R.pick([10, 15, 20, 25, 30, 40]), d: R.pick([0.5, 1, 2, 2.5, 4, 5]), V: 50 * R.int(2, 40) }),
  p => { const A = p.L * p.W, C = cap(A, p.d), Q = C * p.V / 1000; return A % 100 === 0 && A !== 400 && !tie2(C) && !tie2(Q) && rd2(rd2(C) * p.V / 1000) === rd2(Q); }, { L: 30, W: 20, d: 4, V: 200 }),
 build: ({ L, W, d, V }) => { const A = L * W, Am = A / 10000, Cx = cap(A, d), C = rd2(Cx), Qx = Cx * V / 1000, Q = rd2(Qx); return {
  prompt: `A memory board in the Battery Vault holds two flat metal plates, each cut ${n(L)} cm long and ${n(W)} cm wide, ${n(d)} mm apart with air between them. Use ε₀ = 8.85 × 10⁻¹² F/m. Enter the area of one plate in m², then the capacitance in pF to 2 decimal places, then the charge on the positive plate when it is connected to ${n(V)} V, in nC to 2 decimal places (type them without commas).`,
  answer: [Am, C, Q],
  hints: ['The area of a rectangle is its length times its width. There are 10000 cm² in 1 m², and 1000 mm in 1 m.', 'A parallel-plate capacitor has C = ε₀A ÷ d, with A in m² and d in m. A smaller gap gives a larger capacitance.', 'The charge stored is Q = CV. A picofarad times a volt is a picocoulomb, and 1000 pC = 1 nC.'],
  solution: `A = ${n(L)} × ${n(W)} = ${n(A)} cm² = ${n(Am)} m² and d = ${n(d)} mm = ${n(d / 1000)} m. C = ε₀A ÷ d = 8.85 × 10⁻¹² × ${n(Am)} ÷ ${n(d / 1000)} F ${eq(Cx)} ${n(C)} pF (to 2 decimal places). Q = CV = ${n(C)} pF × ${n(V)} V ${eq(Qx * 1000)} ${n(rd2(Qx * 1000))} pC, which is ${n(Q)} nC (to 2 decimal places).`,
  guidance: [
   { prompt: `The plate is ${n(L)} cm by ${n(W)} cm, and 10000 cm² make 1 m². What is the area of one plate, in m²?`, answer: [Am], explanation: `${n(L)} × ${n(W)} = ${n(A)} cm², and ${n(A)} ÷ 10000 = ${n(Am)} m².` },
   { prompt: `Use C = ε₀A ÷ d with d = ${n(d / 1000)} m. What is C, in pF to 2 decimal places?`, answer: [C], explanation: `8.85 × 10⁻¹² × ${n(Am)} ÷ ${n(d / 1000)} F ${eq(Cx)} ${n(C)} pF (to 2 decimal places).` },
   { prompt: `Use Q = CV with V = ${n(V)} V. What is Q, in nC to 2 decimal places?`, answer: [Q], explanation: `${n(C)} pF × ${n(V)} V ${eq(Qx * 1000)} ${n(rd2(Qx * 1000))} pC, which is ${n(Q)} nC (to 2 decimal places).` }
  ] }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Cutting the gap to size',
 brief: 'The vault needs a capacitor of a set value, and the plates are already cut, so the crew must find the gap to leave.',
 labels: ['area (m²)', 'gap (mm)', 'charge (nC)'], tolerance: 0.005,
 gl: [['area (m²)'], ['gap (mm)'], ['charge (nC)']]
}, {
 /* Plates L by W cm (L × W a multiple of 100), target C0 pF. The gap d = 0.885 A ÷ C0 mm has at most 2 decimals and lies between 0.2 and 10 mm,
    and the charge C0 × V ÷ 1000 nC has at most 2 decimals. Not the parent (400 cm², 177 pF) nor the worked example (0.5 m²). */
 canonical: { L: 30, W: 20, C0: 106.2, V: 250 },
 draw: R => tries(() => ({ L: R.pick([10, 15, 20, 25, 30, 40]), W: R.pick([10, 20, 25, 30, 40]), C0: R.pick([20, 25, 40, 50, 60, 75, 80, 100, 120, 150, 177.5, 200, 250, 300]), V: 50 * R.int(2, 30) }),
  p => { const A = p.L * p.W, d = 0.885 * A / p.C0; return A % 100 === 0 && A !== 400 && d >= 0.2 && d <= 10 && is2(d) && is2(p.C0 * p.V / 1000) && !(p.L === 30 && p.W === 20 && p.C0 === 106.2); }, { L: 30, W: 20, C0: 106.2, V: 250 }),
 build: ({ L, W, C0, V }) => { const A = L * W, Am = A / 10000, dx = 0.885 * A / C0, dd = rd2(dx), Q = rd2(C0 * V / 1000); return {
  prompt: `The Battery Vault needs a capacitor of ${n(C0)} pF. Two flat metal plates, each ${n(L)} cm long and ${n(W)} cm wide, are already cut, and the gap between them will be air. Use ε₀ = 8.85 × 10⁻¹² F/m. Turning C = ε₀A ÷ d round gives d = ε₀A ÷ C. Enter the area of one plate in m², then the gap that gives this capacitance in mm to 2 decimal places, then the charge on the positive plate when the finished capacitor is connected to ${n(V)} V, in nC to 2 decimal places (type them without commas).`,
  answer: [Am, dd, Q],
  hints: ['The area of a rectangle is its length times its width. There are 10000 cm² in 1 m², and 1000 mm in 1 m.', 'Divide ε₀ times the area (in m²) by the capacitance (in farads, 1 pF = 10⁻¹² F) to get the gap in metres, then turn it into millimetres.', 'The charge is Q = CV with the capacitance you were asked to build. A picofarad times a volt is a picocoulomb, and 1000 pC = 1 nC.'],
  solution: `A = ${n(L)} × ${n(W)} = ${n(A)} cm² = ${n(Am)} m². The gap is d = ε₀A ÷ C = 8.85 × 10⁻¹² × ${n(Am)} ÷ (${n(C0)} × 10⁻¹²) m ${eq(dx)} ${n(dd)} mm (to 2 decimal places). The charge is Q = CV = ${n(C0)} pF × ${n(V)} V = ${n(C0 * V)} pC, which is ${n(Q)} nC.`,
  guidance: [
   { prompt: `The plate is ${n(L)} cm by ${n(W)} cm, and 10000 cm² make 1 m². What is the area of one plate, in m²?`, answer: [Am], explanation: `${n(L)} × ${n(W)} = ${n(A)} cm², and ${n(A)} ÷ 10000 = ${n(Am)} m².` },
   { prompt: `Use d = ε₀A ÷ C with C = ${n(C0)} × 10⁻¹² F. What is the gap, in mm to 2 decimal places?`, answer: [dd], explanation: `8.85 × 10⁻¹² × ${n(Am)} ÷ (${n(C0)} × 10⁻¹²) m ${eq(dx)} ${n(dd)} mm (to 2 decimal places).` },
   { prompt: `Use Q = CV with C = ${n(C0)} pF and V = ${n(V)} V. What is Q, in nC to 2 decimal places?`, answer: [Q], explanation: `${n(C0)} × ${n(V)} = ${n(C0 * V)} pC, which is ${n(Q)} nC.` }
  ] }; }
});

mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q16', title: 'Charge, field and a wider gap',
 brief: 'A test capacitor is charged, its field is checked against the spark limit, and then the plates are pulled apart.',
 labels: ['capacitance (pF)', 'charge (nC)', 'field (kV/m)', 'charge after the gap is doubled (nC)'], tolerance: 0.005,
 gl: [['capacitance (pF)'], ['charge (nC)'], ['field (kV/m)'], ['charge after the gap is doubled (nC)']]
}, {
 /* Area A cm² (a multiple of 100), gap d mm, battery V. C = 0.885A ÷ d pF, Q = CV ÷ 1000 nC, E = V ÷ d kV/m; with the battery left connected, doubling d halves C and so halves Q.
    C, Q, E and Q ÷ 2 are all off rounding ties and have at most 2 decimals after rounding. Not the parent (400 cm², 2 mm, 300 V). */
 canonical: { A: 800, d: 2, V: 150 },
 draw: R => tries(() => ({ A: 100 * R.int(2, 25), d: R.pick([0.5, 1, 2, 2.5, 4, 5]), V: 50 * R.int(2, 40) }),
  p => { const C = cap(p.A, p.d), Q = C * p.V / 1000; return !tie2(C) && !tie2(Q) && !tie2(Q / 2) && !tie2(p.V / p.d) && rd2(rd2(C) * p.V / 1000) === rd2(Q) && rd2(rd2(C) * p.V / 2000) === rd2(Q / 2) && !(p.A === 400 && p.d === 2 && p.V === 300); }, { A: 800, d: 2, V: 150 }),
 build: ({ A, d, V }) => { const Cx = cap(A, d), C = rd2(Cx), Qx = Cx * V / 1000, Q = rd2(Qx), E = rd2(V / d), Q2 = rd2(Qx / 2); return {
  prompt: `A test capacitor in the Battery Vault has two plates of area ${n(A)} cm², ${n(d)} mm apart with air between them, connected to ${aan(n(V))} ${n(V)} V battery. Use ε₀ = 8.85 × 10⁻¹² F/m. Enter the capacitance in pF, the charge on the positive plate in nC, and the uniform field between the plates in kV/m (the potential difference divided by the gap), then the charge on the positive plate in nC after the plates are pulled apart to double the gap with the battery still connected. Give each to 2 decimal places (type them without commas).`,
  answer: [C, Q, E, Q2],
  hints: ['Turn the area into m² (10000 cm² = 1 m²) and the gap into metres, then C = ε₀A ÷ d. A picofarad times a volt is a picocoulomb, and 1000 pC = 1 nC.', 'A field of 1 kV/m is 1 V for every millimetre, so the field is the battery’s voltage divided by the gap in millimetres.', 'Doubling the gap changes the capacitance by the same factor, in the opposite sense, and the battery still holds the same voltage. Use Q = CV with the new capacitance.'],
  solution: `A = ${n(A)} cm² = ${n(A / 10000)} m² and d = ${n(d)} mm = ${n(d / 1000)} m. C = ε₀A ÷ d = 8.85 × 10⁻¹² × ${n(A / 10000)} ÷ ${n(d / 1000)} F ${eq(Cx)} ${n(C)} pF (to 2 decimal places). Q = CV = ${n(Cx)} pF × ${n(V)} V = ${n(Cx * V)} pC, which is ${n(Q)} nC (to 2 decimal places). The field is ${n(V)} V ÷ ${n(d)} mm ${eq(V / d)} ${n(E)} kV/m. With the gap doubled the capacitance is halved and the voltage is still ${n(V)} V, so the charge is half of ${n(Qx)} nC, which is ${n(Q2)} nC (to 2 decimal places).`,
  guidance: [
   { prompt: `Turn the area into m² and use C = ε₀A ÷ d with d = ${n(d / 1000)} m. What is C, in pF to 2 decimal places?`, answer: [C], explanation: `8.85 × 10⁻¹² × ${n(A / 10000)} ÷ ${n(d / 1000)} F ${eq(Cx)} ${n(C)} pF (to 2 decimal places).` },
   { prompt: `Use Q = CV with V = ${n(V)} V. What is Q, in nC to 2 decimal places?`, answer: [Q], explanation: `${n(Cx)} pF × ${n(V)} V = ${n(Cx * V)} pC, which is ${n(Q)} nC (to 2 decimal places).` },
   { prompt: `${n(V)} V across ${n(d)} mm. What is the uniform field, in kV/m to 2 decimal places?`, answer: [E], explanation: `${n(V)} ÷ ${n(d)} ${eq(V / d)} ${n(E)} V per millimetre, which is ${n(E)} kV/m (to 2 decimal places).` },
   { prompt: `With the gap doubled the capacitance is halved and the voltage is still ${n(V)} V. What is the new charge on the positive plate, in nC to 2 decimal places?`, answer: [Q2], explanation: `Half of ${n(Qx)} nC is ${n(Q2)} nC (to 2 decimal places).` }
  ] }; }
});

/* ---- q19 Capacitors in series and in parallel [8.2] ---- */

/* Two capacitors in series: c1c2 ÷ (c1 + c2). */
const ser = (a, b) => a * b / (a + b);

mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The lighting loop chain',
 brief: 'The dome lighting loop strings three capacitors in one chain, and the crew wants the single capacitor it acts like.',
 labels: ['equivalent capacitance (μF)', 'total charge (μC)', 'voltage across C₁ (V)'], tolerance: 0.005,
 gl: [['equivalent capacitance (μF)'], ['total charge (μC)'], ['voltage across C₁ (V)']]
}, {
 /* Three capacitors in one series chain: C = c1c2c3 ÷ (c1c2 + c1c3 + c2c3). The equivalent, the charge and the voltage across C₁ (Q ÷ c1) all have at most 2 decimals,
    and C₁ is less than the supply voltage's whole chain (V1 < V). Not the parent (6, 1, 2 μF) nor the worked example (2 and 6 μF). */
 canonical: { c1: 4, c2: 12, c3: 6, V: 14 },
 draw: R => tries(() => ({ c1: R.int(1, 12), c2: R.int(1, 12), c3: R.int(1, 12), V: R.int(4, 48) }),
  p => { const C = p.c1 * p.c2 * p.c3 / (p.c1 * p.c2 + p.c1 * p.c3 + p.c2 * p.c3), Q = C * p.V; return is2(C) && is2(Q) && is2(Q / p.c1) && new Set([p.c1, p.c2, p.c3]).size === 3 && !(p.c1 === 6 && p.c2 === 1 && p.c3 === 2); }, { c1: 4, c2: 12, c3: 6, V: 14 }),
 build: ({ c1, c2, c3, V }) => { const num = c1 * c2 + c1 * c3 + c2 * c3, den = c1 * c2 * c3, C = rd2(den / num), Q = rd2(C * V), V1 = rd2(Q / c1); return {
  prompt: `The lighting loop in the Battery Vault joins three capacitors in series, one after another in a single chain: C₁ = ${n(c1)} μF, C₂ = ${n(c2)} μF and C₃ = ${n(c3)} μF. A ${n(V)} V supply is connected across the whole chain. Enter the equivalent capacitance of the chain in μF, then the total charge the supply moves onto it in μC, then the voltage across C₁ alone in V. Give each to 2 decimal places (type them without commas).`,
  answer: [C, Q, V1],
  hints: ['In series the reciprocals add: 1 ÷ C = 1 ÷ C₁ + 1 ÷ C₂ + 1 ÷ C₃. Do not forget to turn the sum back over at the end.', 'The whole chain behaves like one capacitor of the equivalent capacitance, so the charge it takes is Q = C × V.', 'Every capacitor in a series chain carries that same charge. Turn Q = CV round: the voltage across one capacitor is its charge divided by its own capacitance.'],
  solution: `In series the reciprocals add: 1 ÷ C = 1 ÷ ${n(c1)} + 1 ÷ ${n(c2)} + 1 ÷ ${n(c3)} = ${n(num)} ÷ ${n(den)}, so C = ${n(den)} ÷ ${n(num)} ${eq(den / num)} ${n(C)} μF (to 2 decimal places). The supply moves Q = CV = ${n(C)} μF × ${n(V)} V = ${n(Q)} μC onto the chain. C₁ carries that same charge, so the voltage across it is Q ÷ C₁ = ${n(Q)} ÷ ${n(c1)} ${eq(Q / c1)} ${n(V1)} V (to 2 decimal places).`,
  guidance: [
   { prompt: `Add the reciprocals: 1 ÷ C = 1 ÷ ${n(c1)} + 1 ÷ ${n(c2)} + 1 ÷ ${n(c3)}. What is the equivalent capacitance C, in μF to 2 decimal places?`, answer: [C], explanation: `The reciprocals add to ${n(num)} ÷ ${n(den)}, so C = ${n(den)} ÷ ${n(num)} ${eq(den / num)} ${n(C)} μF (to 2 decimal places).` },
   { prompt: `What charge does the ${n(V)} V supply move onto the chain, in μC to 2 decimal places?`, answer: [Q], explanation: `Q = ${n(C)} × ${n(V)} = ${n(Q)} μC.` },
   { prompt: `C₁ carries the same charge, ${n(Q)} μC, and has ${n(c1)} μF. What is the voltage across it, in V to 2 decimal places?`, answer: [V1], explanation: `${n(Q)} ÷ ${n(c1)} ${eq(Q / c1)} ${n(V1)} V (to 2 decimal places).` }
  ] }; }
});

mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'Topping up the spare bank',
 brief: 'The spare bank is a little short of the capacitance the night shift needs, and the crew must pick the extra capacitor to add.',
 labels: ['series pair (μF)', 'extra capacitor (μF)', 'charge on the finished bank (μC)'], tolerance: 0.005,
 gl: [['series pair (μF)'], ['extra capacitor (μF)'], ['charge on the finished bank (μC)']]
}, {
 /* A series pair c1, c2 (equivalent with at most 2 decimals) in parallel with one extra capacitor, to reach the target Ct (a whole number of μF).
    The extra capacitor Ct − pair is at least 1 μF. Not the parent (6, 1, 2 μF) nor the worked example (2 and 6 μF). */
 canonical: { c1: 12, c2: 4, Ct: 8, V: 18 },
 draw: R => tries(() => ({ c1: R.int(2, 15), c2: R.int(2, 15), Ct: R.int(6, 24), V: 2 * R.int(3, 24) }), p => is2(ser(p.c1, p.c2)) && p.Ct - ser(p.c1, p.c2) >= 1 && is2(p.Ct - ser(p.c1, p.c2)) && !(p.c1 === 2 && p.c2 === 6) && !(p.c1 === 6 && p.c2 === 2), { c1: 12, c2: 4, Ct: 8, V: 18 }),
 build: ({ c1, c2, Ct, V }) => { const pair = rd2(ser(c1, c2)), ex = rd2(Ct - pair), Q = Ct * V; return {
  prompt: `A spare bank in the Battery Vault has ${aan(n(c1))} ${n(c1)} μF capacitor and ${aan(n(c2))} ${n(c2)} μF capacitor joined in series. The crew will join that pair in parallel with one more capacitor, so that the finished bank has an equivalent capacitance of ${n(Ct)} μF. Enter the equivalent capacitance of the series pair in μF, then the capacitance the extra capacitor must have in μF, then the charge ${aan(n(V))} ${n(V)} V supply moves onto the finished bank in μC. Give each to 2 decimal places (type them without commas).`,
  answer: [pair, ex, Q],
  hints: ['For two capacitors in series, the equivalent is their product divided by their sum.', 'The extra capacitor is in parallel with the pair, and in parallel capacitances add. So the extra one must make up the difference between the target and the pair.', 'The finished bank behaves like one capacitor of the target capacitance, so the charge is Q = C × V.'],
  solution: `In series, C = ${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(pair)} μF (to 2 decimal places). In parallel capacitances add, so the extra capacitor must be ${n(Ct)} − ${n(pair)} = ${n(ex)} μF. The finished bank holds Q = CV = ${n(Ct)} μF × ${n(V)} V = ${n(Q)} μC.`,
  guidance: [
   { prompt: `What single capacitance replaces the ${n(c1)} μF and ${n(c2)} μF capacitors in series, in μF to 2 decimal places?`, answer: [pair], explanation: `${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(pair)} μF (to 2 decimal places).` },
   { prompt: `In parallel the capacitances add. The pair is ${n(pair)} μF and the finished bank must be ${n(Ct)} μF. What must the extra capacitor be, in μF to 2 decimal places?`, answer: [ex], explanation: `${n(Ct)} − ${n(pair)} = ${n(ex)} μF.` },
   { prompt: `The finished bank is ${n(Ct)} μF. What charge does the ${n(V)} V supply move onto it, in μC?`, answer: [Q], explanation: `Q = ${n(Ct)} × ${n(V)} = ${n(Q)} μC.` }
  ] }; }
});

mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', title: 'Two branches across the supply',
 brief: 'The main bank has two chains of capacitors side by side across the supply, and the crew wants the charge on one of them.',
 labels: ['branch A equivalent (μF)', 'branch B equivalent (μF)', 'whole bank equivalent (μF)', 'charge on branch B (μC)'], tolerance: 0.005,
 gl: [['branch A equivalent (μF)'], ['branch B equivalent (μF)'], ['whole bank equivalent (μF)'], ['charge on branch B (μC)']]
}, {
 /* Two series pairs in parallel across V. Both branch equivalents, their sum and the charge on branch B have at most 2 decimals; the two branches differ.
    Not the worked example (2 and 6 μF in series). */
 canonical: { c1: 6, c2: 3, c3: 10, c4: 15, V: 24 },
 draw: R => tries(() => ({ c1: R.int(1, 15), c2: R.int(1, 15), c3: R.int(1, 15), c4: R.int(1, 15), V: 2 * R.int(2, 24) }),
  p => { const a = ser(p.c1, p.c2), b = ser(p.c3, p.c4); return is2(a) && is2(b) && is2(a + b) && is2(b * p.V) && Math.abs(a - b) > 0.4 && ![[p.c1, p.c2], [p.c3, p.c4]].some(([x, y]) => (x === 2 && y === 6) || (x === 6 && y === 2)); }, { c1: 6, c2: 3, c3: 10, c4: 15, V: 24 }),
 build: ({ c1, c2, c3, c4, V }) => { const A = rd2(ser(c1, c2)), B = rd2(ser(c3, c4)), T = rd2(A + B), QB = rd2(B * V); return {
  prompt: `The main bank of the Battery Vault has two branches wired side by side across the same supply. Branch A is C₁ = ${n(c1)} μF and C₂ = ${n(c2)} μF in series. Branch B is C₃ = ${n(c3)} μF and C₄ = ${n(c4)} μF in series. A ${n(V)} V supply is connected across both branches. Enter the equivalent capacitance of branch A in μF, then of branch B in μF, then of the whole bank in μF, then the charge on branch B in μC, which is the charge each capacitor in that branch carries. Give each to 2 decimal places (type them without commas).`,
  answer: [A, B, T, QB],
  hints: ['Reduce each branch on its own first: for two capacitors in series the equivalent is their product divided by their sum.', 'The two branches sit side by side across the same supply, so they are in parallel and their capacitances add.', 'Branch B behaves like one capacitor of its own equivalent capacitance, connected to the full supply voltage: Q = C × V.'],
  solution: `Branch A: ${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(A)} μF (to 2 decimal places). Branch B: ${n(c3)} × ${n(c4)} ÷ (${n(c3)} + ${n(c4)}) = ${n(c3 * c4)} ÷ ${n(c3 + c4)} ${eq(ser(c3, c4))} ${n(B)} μF (to 2 decimal places). The branches are in parallel, so the whole bank is ${n(A)} + ${n(B)} = ${n(T)} μF. Branch B holds Q = CV = ${n(B)} μF × ${n(V)} V = ${n(QB)} μC.`,
  guidance: [
   { prompt: `What single capacitance replaces the ${n(c1)} μF and ${n(c2)} μF capacitors of branch A, in μF to 2 decimal places?`, answer: [A], explanation: `${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(A)} μF (to 2 decimal places).` },
   { prompt: `What single capacitance replaces the ${n(c3)} μF and ${n(c4)} μF capacitors of branch B, in μF to 2 decimal places?`, answer: [B], explanation: `${n(c3)} × ${n(c4)} ÷ (${n(c3)} + ${n(c4)}) = ${n(c3 * c4)} ÷ ${n(c3 + c4)} ${eq(ser(c3, c4))} ${n(B)} μF (to 2 decimal places).` },
   { prompt: `Branch A is ${n(A)} μF and branch B is ${n(B)} μF, side by side. What is the equivalent capacitance of the whole bank, in μF to 2 decimal places?`, answer: [T], explanation: `In parallel they add: ${n(A)} + ${n(B)} = ${n(T)} μF.` },
   { prompt: `Branch B is ${n(B)} μF across the ${n(V)} V supply. What charge does it hold, in μC to 2 decimal places?`, answer: [QB], explanation: `Q = ${n(B)} × ${n(V)} = ${n(QB)} μC.` }
  ] }; }
});

/* ---- q20 Energy stored in a capacitor [8.3] ---- */

mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'The two-capacitor flash',
 brief: 'A flash unit in the vault stores its energy in two capacitors in a chain, and the crew wants its energy and power.',
 labels: ['equivalent capacitance (μF)', 'energy (mJ)', 'average power (W)'], tolerance: 0.005,
 gl: [['equivalent capacitance (μF)'], ['energy (mJ)'], ['average power (W)']]
}, {
 /* c1, c2 (multiples of 10 μF) in series across V (a multiple of 10 volts) emptied in t ms. C = c1c2 ÷ (c1 + c2); U = CV² ÷ 2000 mJ; P = U ÷ t, each with at most 2 decimals.
    Not the parent (220 and 330 μF in parallel, 40 V) nor the worked example (500 μF at 20 V). */
 canonical: { c1: 300, c2: 600, V: 30, t: 10 },
 draw: R => tries(() => ({ c1: 10 * R.int(1, 50), c2: 10 * R.int(1, 50), V: 10 * R.int(1, 10), t: R.pick([2, 4, 5, 10, 20, 25, 50]) }),
  p => { const C = ser(p.c1, p.c2), U = C * p.V * p.V / 2000; return is2(C) && is2(U) && is2(U / p.t) && U / p.t >= 0.1 && p.c1 !== p.c2 && !(p.c1 === 220 && p.c2 === 330); }, { c1: 300, c2: 600, V: 30, t: 10 }),
 build: ({ c1, c2, V, t }) => { const C = rd2(ser(c1, c2)), U = rd2(C * V * V / 2000), P = rd2(U / t); return {
  prompt: `A flash unit in the Battery Vault joins ${aan(n(c1))} ${n(c1)} μF capacitor and ${aan(n(c2))} ${n(c2)} μF capacitor in series, and ${aan(n(V))} ${n(V)} V supply is connected across the whole chain. Enter the equivalent capacitance of the chain in μF, then the energy stored in the chain in mJ, then the average power in W if all that energy is released in ${n(t)} ms. Give each to 2 decimal places (type them without commas).`,
  answer: [C, U, P],
  hints: ['For two capacitors in series, the equivalent is their product divided by their sum. The chain stores energy like one capacitor of that capacitance across the full supply voltage.', 'The energy stored is U = ½CV², and 1 μF × (1 V)² = 1 μJ. Then 1000 μJ = 1 mJ.', 'Average power is energy divided by time, and 1 mJ ÷ 1 ms = 1 W.'],
  solution: `In series, C = ${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(C)} μF (to 2 decimal places). U = ½CV² = ½ × ${n(C)} μF × ${n(V * V)} V² = ${n(C * V * V / 2)} μJ, which is ${n(U)} mJ. Released in ${n(t)} ms, the average power is ${n(U)} mJ ÷ ${n(t)} ms = ${n(P)} W.`,
  guidance: [
   { prompt: `What single capacitance replaces the ${n(c1)} μF and ${n(c2)} μF capacitors in series, in μF to 2 decimal places?`, answer: [C], explanation: `${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(C)} μF (to 2 decimal places).` },
   { prompt: `With C = ${n(C)} μF at ${n(V)} V, what energy is stored, U = ½CV², in mJ to 2 decimal places?`, answer: [U], explanation: `½ × ${n(C)} × ${n(V * V)} = ${n(C * V * V / 2)} μJ, which is ${n(U)} mJ.` },
   { prompt: `The energy comes out in ${n(t)} ms. What is the average power, in W to 2 decimal places?`, answer: [P], explanation: `${n(U)} mJ ÷ ${n(t)} ms = ${n(P)} W.` }
  ] }; }
});

mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Sizing the dome-light flash',
 brief: 'The dome lights need a set burst of energy from one capacitor, and the crew must size it and time the discharge.',
 labels: ['capacitance (μF)', 'charge (mC)', 'release time (ms)'], tolerance: 0.005,
 gl: [['capacitance (μF)'], ['charge (mC)'], ['release time (ms)']]
}, {
 /* A burst of U mJ from a capacitor charged to V: C = 2000U ÷ V² μF, Q = CV ÷ 1000 mC, and the time to release it at an average power P is U ÷ P ms.
    All three have at most 2 decimals. Not the worked example (500 μF at 20 V) nor the parent (550 μF at 40 V). */
 canonical: { U: 450, V: 30, P: 150 },
 draw: R => tries(() => ({ U: 10 * R.int(5, 60), V: 5 * R.int(2, 14), P: R.pick([20, 25, 40, 50, 60, 75, 80, 100, 120, 150, 200]) }),
  p => { const C = 2000 * p.U / (p.V * p.V), Q = C * p.V / 1000, t = p.U / p.P; return is2(C) && is2(Q) && is2(t) && C < 100000 && !(p.V === 40 && C === 550) && !(p.V === 20 && C === 500) && Q !== t; }, { U: 450, V: 30, P: 150 }),
 build: ({ U, V, P }) => { const C = rd2(2000 * U / (V * V)), Q = rd2(C * V / 1000), t = rd2(U / P); return {
  prompt: `The dome lights need a burst of ${n(U)} mJ from a single capacitor charged to ${n(V)} V. Turning U = ½CV² round gives C = 2U ÷ V². Enter the capacitance needed in μF, then the charge the capacitor holds when charged in mC, then the time in ms the capacitor takes to release all that energy at an average power of ${n(P)} W. Give each to 2 decimal places (type them without commas).`,
  answer: [C, Q, t],
  hints: ['With C in μF and V in volts, ½CV² is in μJ, and 1000 μJ = 1 mJ. So turn the energy into μJ first, then C in μF is twice that energy divided by V².', 'The charge is Q = CV. With C in μF and V in volts, Q is in μC, and 1000 μC = 1 mC.', 'Average power is energy divided by time, and 1 mJ ÷ 1 ms = 1 W, so the time is the energy in mJ divided by the power in W, in ms.'],
  solution: `U = ${n(U)} mJ = ${n(U * 1000)} μJ, so C = 2U ÷ V² = 2 × ${n(U * 1000)} ÷ ${n(V * V)} = ${n(C)} μF. The charge is Q = CV = ${n(C)} μF × ${n(V)} V = ${n(C * V)} μC, which is ${n(Q)} mC. At an average power of ${n(P)} W the time is ${n(U)} mJ ÷ ${n(P)} W = ${n(t)} ms.`,
  guidance: [
   { prompt: `With U = ${n(U * 1000)} μJ and V = ${n(V)} V, use C = 2U ÷ V². What capacitance is needed, in μF to 2 decimal places?`, answer: [C], explanation: `2 × ${n(U * 1000)} ÷ ${n(V * V)} = ${n(C)} μF.` },
   { prompt: `With C = ${n(C)} μF at ${n(V)} V, what charge does it hold, in mC to 2 decimal places?`, answer: [Q], explanation: `${n(C)} × ${n(V)} = ${n(C * V)} μC, and 1000 μC = 1 mC, so Q = ${n(Q)} mC.` },
   { prompt: `The ${n(U)} mJ is released at an average power of ${n(P)} W. How long does that take, in ms to 2 decimal places?`, answer: [t], explanation: `${n(U)} mJ ÷ ${n(P)} W = ${n(t)} ms.` }
  ] }; }
});

mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q19', title: 'Raising the bank voltage',
 brief: 'The night bank is a mixed network, and the crew wants to know how much extra energy a higher charging voltage buys.',
 labels: ['equivalent capacitance (μF)', 'energy at the first voltage (mJ)', 'extra energy at the second voltage (mJ)'], tolerance: 0.005,
 gl: [['equivalent capacitance (μF)'], ['energy at the first voltage (mJ)'], ['extra energy at the second voltage (mJ)']]
}, {
 /* (c1 series c2) in parallel with c3. The equivalent has at most 2 decimals; U1 = C·V1² ÷ 2000 and the extra energy C(V2² − V1²) ÷ 2000 have at most 2 decimals and
    V2 > V1. Not the parent (220 and 330 μF, 40 V) nor the worked example (500 μF at 20 V). */
 canonical: { c1: 300, c2: 600, c3: 100, V1: 30, V2: 50 },
 draw: R => tries(() => ({ c1: 10 * R.int(1, 40), c2: 10 * R.int(1, 40), c3: 10 * R.int(1, 40), V1: 10 * R.int(1, 6), V2: 10 * R.int(2, 10) }),
  p => { const C = ser(p.c1, p.c2) + p.c3; return p.V2 > p.V1 && is2(C) && is2(C * p.V1 * p.V1 / 2000) && is2(C * (p.V2 * p.V2 - p.V1 * p.V1) / 2000) && p.c1 !== p.c2 && !(p.c1 === 220 && p.c2 === 330); }, { c1: 300, c2: 600, c3: 100, V1: 30, V2: 50 }),
 build: ({ c1, c2, c3, V1, V2 }) => { const pair = rd2(ser(c1, c2)), C = rd2(pair + c3), U1 = rd2(C * V1 * V1 / 2000), U2 = rd2(C * V2 * V2 / 2000), dU = rd2(U2 - U1); return {
  prompt: `A bank in the Battery Vault has C₁ = ${n(c1)} μF and C₂ = ${n(c2)} μF joined in series, and that pair is joined in parallel with C₃ = ${n(c3)} μF. The bank is charged to ${n(V1)} V across the whole network. Enter the equivalent capacitance of the bank in μF, then the energy stored at ${n(V1)} V in mJ, then how many more mJ of energy it stores when the supply is raised to ${n(V2)} V. Give each to 2 decimal places (type them without commas).`,
  answer: [C, U1, dU],
  hints: ['Reduce the series pair first (product divided by sum), then add that to the capacitor in parallel with it.', 'The energy stored is U = ½CV², and 1 μF × (1 V)² = 1 μJ. Then 1000 μJ = 1 mJ.', 'Work out the energy at the higher voltage in the same way and subtract the energy at the first voltage.'],
  solution: `The series pair is ${n(c1)} × ${n(c2)} ÷ (${n(c1)} + ${n(c2)}) = ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(pair)} μF (to 2 decimal places). In parallel with C₃ the capacitances add: ${n(pair)} + ${n(c3)} = ${n(C)} μF. At ${n(V1)} V, U = ½CV² = ½ × ${n(C)} × ${n(V1 * V1)} = ${n(C * V1 * V1 / 2)} μJ, which is ${n(U1)} mJ. At ${n(V2)} V, U = ½ × ${n(C)} × ${n(V2 * V2)} = ${n(C * V2 * V2 / 2)} μJ, which is ${n(U2)} mJ. The extra energy is ${n(U2)} − ${n(U1)} = ${n(dU)} mJ.`,
  guidance: [
   { prompt: `What single capacitance replaces the whole network (the ${n(c1)} μF and ${n(c2)} μF pair in series, in parallel with ${n(c3)} μF), in μF to 2 decimal places?`, answer: [C], explanation: `The pair is ${n(c1 * c2)} ÷ ${n(c1 + c2)} ${eq(ser(c1, c2))} ${n(pair)} μF, and in parallel with ${n(c3)} μF it gives ${n(pair)} + ${n(c3)} = ${n(C)} μF.` },
   { prompt: `With C = ${n(C)} μF at ${n(V1)} V, what energy is stored, in mJ to 2 decimal places?`, answer: [U1], explanation: `½ × ${n(C)} × ${n(V1 * V1)} = ${n(C * V1 * V1 / 2)} μJ, which is ${n(U1)} mJ.` },
   { prompt: `At ${n(V2)} V the bank stores ${n(U2)} mJ. How many more mJ is that than at ${n(V1)} V, to 2 decimal places?`, answer: [dU], explanation: `${n(U2)} − ${n(U1)} = ${n(dU)} mJ.` }
  ] }; }
});

})();
