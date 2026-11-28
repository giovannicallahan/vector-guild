/* Electricity and magnetism: fields practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/em/oracle-p7.js. */
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
const r2 = x => Math.round(x * 100) / 100;
const same2 = (x, y) => Math.abs(x - y) < 1e-9;
/* '=' when x is shown exactly by n() (at most 4 decimals), '≈' otherwise. */
const ap = x => Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6 ? '=' : '≈';
/* 'which is 4.67 N to 2 decimal places', or just the value when it is already exact to 2 places. */
const is2 = (x, u) => same2(x, r2(x)) ? `${n(x)} ${u}` : `${n(r2(x))} ${u} to 2 decimal places`;
/* True when x is safely away from a rounding tie at 2 decimal places. */
const safe = x => { const s = Math.abs(x) * 100, f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.02; };
const allSafe = list => list.every(safe);
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (R, make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return { ...canonical }; };
const TWO_PI = 2 * Math.PI, MU0 = 4 * Math.PI * 1e-7;
/* '= 6000 μN/m' when exact to 2 places, else '≈ 1604.1667 μN/m, which is 1604.17 μN/m to 2 decimal places'. */
const eqr = (x, u) => same2(x, r2(x)) ? `= ${n(x)} ${u}` : `${ap(x)} ${n(x)} ${u}, which is ${n(r2(x))} ${u} to 2 decimal places`;
const qtext = z => z === 1 ? 'e = 1.60 × 10⁻¹⁹ C' : `${z}e = ${(1.6 * z).toFixed(2)} × 10⁻¹⁹ C`;
const qnum = z => (1.6 * z).toFixed(2);
/* Times, in seconds, over which a field or a current changes (a parameter is the time itself). */
const DTS = [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 2];

/* ---- q31 Circular orbits in a magnetic field: radius and period [11.3] ---- */

mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'Sampling the dust ions',
 brief: 'The dust sampler bends ions of one unknown make round a circular track, and Mira wants the width of the track and the time one lap takes.',
 labels: ['radius (cm)', 'time for one lap (μs)'], tolerance: 0.005,
 gl: [['radius (cm)'], ['time for one lap (μs)']]
}, {
 /* m = a × 10⁻²⁶ kg, charge z e, speed k × 10⁴ m/s, field b mT. The radius is r = mv/(qB) and the lap time T = 2πm/(qB). */
 canonical: { a: 7, z: 2, k: 6, b: 40 },
 draw: R => retry(R, R => ({ a: R.int(3, 12), z: R.pick([1, 2]), k: R.int(2, 9), b: 10 * R.int(2, 10) }), p => {
  const m = p.a * 1e-26, q = p.z * 1.6e-19, B = p.b / 1000, rcm = m * p.k * 1e4 / (q * B) * 100, T = TWO_PI * m / (q * B) * 1e6;
  return allSafe([rcm, T]) && rcm >= 2 && T >= 2; }, { a: 7, z: 2, k: 6, b: 40 }),
 build: ({ a, z, k, b }) => { const m = a * 1e-26, q = z * 1.6e-19, B = b / 1000, rm = m * k * 1e4 / (q * B), rcm = rm * 100, T = TWO_PI * m / (q * B) * 1e6; return {
  prompt: `The dust sampler in the Ore Sorter bends ionised dust round a circular track with a magnet. One ion has mass ${n(a)} × 10⁻²⁶ kg and charge ${qtext(z)}. It enters the magnet at ${n(k)} × 10⁴ m/s, at right angles to a uniform field of ${n(b)} mT (1 mT = 10⁻³ T). Enter the radius of its circle in centimetres (cm), then the time for one lap in microseconds (μs, 1 μs = 10⁻⁶ s). Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(rcm), r2(T)],
  hints: ['The magnetic force qvB supplies the centripetal force mv²/r, so r = mv/(qB). Work in kilograms, metres per second, coulombs and tesla, and change metres to centimetres at the end.', 'One lap is the circumference 2πr divided by the speed, which is T = 2πm/(qB). Change seconds to microseconds at the end.'],
  solution: `The velocity is at right angles to the field, so qvB = mv²/r and r = mv/(qB) = (${n(a)} × 10⁻²⁶ × ${n(k)} × 10⁴) ÷ (${qnum(z)} × 10⁻¹⁹ × ${n(B)}) m ${ap(rm)} ${n(rm)} m, which is ${is2(rcm, 'cm')}. One lap takes T = 2πm/(qB) = (2π × ${n(a)} × 10⁻²⁶) ÷ (${qnum(z)} × 10⁻¹⁹ × ${n(B)}) s, which is ${is2(T, 'μs')}.`,
  guidance: [
   { prompt: `Set qvB equal to mv²/r and solve for r. For the ion of mass ${n(a)} × 10⁻²⁶ kg at ${n(k)} × 10⁴ m/s in ${n(b)} mT, what is the radius in centimetres, to 2 decimal places?`, answer: [r2(rcm)], explanation: `r = mv/(qB) ${ap(rm)} ${n(rm)} m, which is ${is2(rcm, 'cm')}.` },
   { prompt: `One lap is the circumference 2πr, covered at the speed v. What is the time for one lap in microseconds, to 2 decimal places?`, answer: [r2(T)], explanation: `T = 2πr/v = 2πm/(qB), which is ${is2(T, 'μs')}. The speed cancels, so only the mass, the charge and the field matter.` }
  ] }; }
});

mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The slit and the plate',
 brief: 'An ion probe leaves a mark on a plate across the magnet gap, and Mira wants to know how fast the ions were going and how long they took to arrive.',
 labels: ['speed (km/s)', 'time from slit to plate (μs)'], tolerance: 0.005,
 gl: [['radius (cm)'], ['speed (km/s)'], ['time from slit to plate (μs)']]
}, {
 /* Mass a × 10⁻²⁶ kg, charge z e, field b mT, slit-to-mark distance d cm (a diameter). v = qBr/m with r = d/200 m; time = half the period, πm/(qB). */
 canonical: { a: 6, z: 1, b: 50, d: 36 },
 draw: R => retry(R, R => ({ a: R.int(3, 12), z: R.pick([1, 2]), b: 10 * R.int(2, 10), d: R.int(10, 60) }), p => {
  const m = p.a * 1e-26, q = p.z * 1.6e-19, B = p.b / 1000, v = q * B * (p.d / 200) / m / 1000, t = Math.PI * m / (q * B) * 1e6;
  return allSafe([v, t]) && v >= 1 && t >= 2; }, { a: 6, z: 1, b: 50, d: 36 }),
 build: ({ a, z, b, d }) => { const m = a * 1e-26, q = z * 1.6e-19, B = b / 1000, rc = d / 2, rm = d / 200, v = q * B * rm / m / 1000, t = Math.PI * m / (q * B) * 1e6; return {
  prompt: `An ion probe in the Ore Sorter lets ions through a slit into a magnet with a uniform field of ${n(b)} mT, at right angles to their path. Each ion has mass ${n(a)} × 10⁻²⁶ kg and charge ${qtext(z)}. It swings through exactly half a circle and strikes a plate ${n(d)} cm from the slit, so the distance from the slit to the mark is the diameter of the circle. Enter the speed of the ions in kilometres per second (km/s), then the time they take to go from the slit to the plate in microseconds (μs, 1 μs = 10⁻⁶ s). Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(v), r2(t)],
  hints: ['The mark is a diameter away from the slit, so the radius of the circle is half of that distance. Solve r = mv/(qB) for the speed v, in metres per second, then divide by 1000 for km/s.', 'The ion travels half a circle, so the time is half of the period T = 2πm/(qB).'],
  solution: `The distance from slit to mark is a diameter, so r = ${n(d)} ÷ 2 = ${n(rc)} cm = ${n(rm)} m. From r = mv/(qB), v = qBr/m = (${qnum(z)} × 10⁻¹⁹ × ${n(B)} × ${n(rm)}) ÷ (${n(a)} × 10⁻²⁶) m/s, which is ${is2(v, 'km/s')}. The ion goes through half a circle, so the time is half the period: T/2 = πm/(qB) = (π × ${n(a)} × 10⁻²⁶) ÷ (${qnum(z)} × 10⁻¹⁹ × ${n(B)}) s, which is ${is2(t, 'μs')}.`,
  guidance: [
   { prompt: `The ion lands ${n(d)} cm from the slit, and that distance is a diameter. What is the radius of the circle, in centimetres?`, answer: [rc], explanation: `The radius is half the diameter: ${n(d)} ÷ 2 = ${n(rc)} cm.` },
   { prompt: `Solve r = mv/(qB) for v, using that radius in metres. What is the speed in kilometres per second, to 2 decimal places?`, answer: [r2(v)], explanation: `v = qBr/m = (${qnum(z)} × 10⁻¹⁹ × ${n(B)} × ${n(rm)}) ÷ (${n(a)} × 10⁻²⁶) m/s, which is ${is2(v, 'km/s')}.` },
   { prompt: `The ion covers half a circle, which takes half the period T = 2πm/(qB). What is the time from slit to plate in microseconds, to 2 decimal places?`, answer: [r2(t)], explanation: `T/2 = πm/(qB), which is ${is2(t, 'μs')}.` }
  ] }; }
});

mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q13', title: 'From the accelerator to the magnet',
 brief: 'Ions from the sorter gun are pulled through a voltage and then swung round a magnet, and Mira wants their speed and the size of the circle.',
 labels: ['speed (km/s)', 'radius (cm)'], tolerance: 0.005,
 gl: [['kinetic energy (10⁻¹⁶ J)'], ['speed (km/s)'], ['radius (cm)']]
}, {
 /* Mass a × 10⁻²⁷ kg, charge z e, accelerating voltage V kV, field b mT. qV = ½mv², then r = mv/(qB). */
 canonical: { a: 24, z: 2, V: 3, b: 120 },
 draw: R => retry(R, R => ({ a: R.int(10, 60), z: R.pick([1, 2, 3]), V: R.int(1, 10), b: 10 * R.int(5, 30) }), p => {
  const m = p.a * 1e-27, q = p.z * 1.6e-19, B = p.b / 1000, v = Math.sqrt(2 * q * p.V * 1e3 / m), r = m * v / (q * B) * 100, vr = r2(v / 1000) * 1000, rr = m * vr / (q * B) * 100;
  return allSafe([v / 1000, r]) && same2(r2(rr), r2(r)) && r >= 2; }, { a: 24, z: 2, V: 3, b: 120 }),
 build: ({ a, z, V, b }) => { const m = a * 1e-27, q = z * 1.6e-19, B = b / 1000, KE = Math.round(z * 1.6 * V * 100) / 100, v = Math.sqrt(2 * q * V * 1e3 / m), vk = v / 1000, r = m * v / (q * B) * 100; return {
  prompt: `Ions leave the sorter's ion gun from rest and are pulled through a potential difference of ${n(V)} kV (1 kV = 1000 V). An ion that has charge q and is pulled through a potential difference V gains kinetic energy qV. Each ion has mass ${n(a)} × 10⁻²⁷ kg and charge ${qtext(z)}. It then enters a uniform magnetic field of ${n(b)} mT at right angles to its path and moves in a circle. Enter the speed of the ion when it enters the field in kilometres per second (km/s), then the radius of its circle in centimetres (cm). Give each to 2 decimal places, work from unrounded values and type numbers without commas.`,
  answer: [r2(vk), r2(r)],
  hints: ['The kinetic energy gained is qV, and kinetic energy is ½mv². Set them equal and solve for v in metres per second. Use V in volts, so 1 kV is 1000 V.', 'Then use the radius rule for an orbit in a magnetic field, r = mv/(qB), with B in tesla, and change metres to centimetres at the end.'],
  solution: `The ion gains kinetic energy qV = ${qnum(z)} × 10⁻¹⁹ × ${n(V * 1000)} J = ${n(KE)} × 10⁻¹⁶ J. Setting ½mv² = qV gives v = √(2qV/m) = √(2 × ${n(KE)} × 10⁻¹⁶ ÷ (${n(a)} × 10⁻²⁷)) m/s, so the speed is ${is2(vk, 'km/s')}. Then r = mv/(qB) = (${n(a)} × 10⁻²⁷ × v) ÷ (${qnum(z)} × 10⁻¹⁹ × ${n(B)}) m, which is ${is2(r, 'cm')}.`,
  guidance: [
   { prompt: `The ion starts from rest and is pulled through ${n(V)} kV. How much kinetic energy does it gain, in units of 10⁻¹⁶ J?`, answer: [KE], explanation: `qV = ${qnum(z)} × 10⁻¹⁹ C × ${n(V * 1000)} V = ${n(KE)} × 10⁻¹⁶ J.` },
   { prompt: `Set ½mv² equal to that energy and solve for v. What is the speed in kilometres per second, to 2 decimal places?`, answer: [r2(vk)], explanation: `v = √(2qV/m), which is ${is2(vk, 'km/s')}.` },
   { prompt: `Use r = mv/(qB) with that speed (unrounded) and B = ${n(B)} T. What is the radius in centimetres, to 2 decimal places?`, answer: [r2(r)], explanation: `r = mv/(qB), which is ${is2(r, 'cm')}.` }
  ] }; }
});

/* ---- q32 Force on a current-carrying wire, F = ILB sin θ [11.4] ---- */

const ANG32 = [['π/6', 0.5], ['5π/6', 0.5], ['π/2', 1]];

mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'Pushing the sorter door',
 brief: 'A steel arm swings the sorter door open when a current flows through it in the magnet field, and Mira wants the current and the supply that gives the measured push.',
 labels: ['current (A)', 'supply voltage (V)'], tolerance: 0.01,
 gl: [['sin θ'], ['current (A)'], ['supply voltage (V)']]
}, {
 /* f is the measured force in mN, L the arm length in cm, b the field in mT, a an index into ANG32 (angle and its sine), R the circuit's resistance in Ω.
    f is built from a whole current, so the current and the voltage are whole numbers. */
 canonical: { f: 120, L: 40, b: 200, a: 0, R: 5 },
 draw: R => { const i = R.int(2, 12), L = 5 * R.int(4, 16), b = 10 * R.int(5, 30), a = R.int(0, 2), f = Math.round(i * L * b * ANG32[a][1]) / 100; return { f, L, b, a, R: R.int(2, 12) }; },
 build: ({ f, L, b, a, R }) => { const [th, s] = ANG32[a], i = Math.round(f * 100 / (L * b * s) * 1e6) / 1e6, V = i * R; return {
  prompt: `A straight steel arm in the Ore Sorter's door magnet is ${n(L)} cm long and lies in a uniform magnetic field of ${n(b)} mT. The angle between the current and the field is ${th} radians. When a steady current flows through the arm, a spring balance shows that the magnetic force on it has size ${n(f)} mN (1 mN = 10⁻³ N). The arm's circuit has a total resistance of ${n(R)} Ω. Enter the current in amperes (A), then the supply voltage needed to drive it, in volts (V). Use sin(π/6) = sin(5π/6) = 0.5 and sin(π/2) = 1.`,
  answer: [i, V],
  hints: ['The size of the force is F = ILB sin θ. Turn it round to find the current: I = F/(LB sin θ). Use metres, tesla and newtons.', 'Once you have the current, Ohm\'s law gives the supply voltage: V = IR.'],
  solution: `Convert to SI units: F = ${n(f)} mN = ${n(f / 1000)} N, L = ${n(L / 100)} m and B = ${n(b / 1000)} T. From F = ILB sin θ, I = F/(LB sin θ) = ${n(f / 1000)} ÷ (${n(L / 100)} × ${n(b / 1000)} × ${n(s)}) = ${n(i)} A. Ohm's law gives V = IR = ${n(i)} × ${n(R)} = ${n(V)} V.`,
  guidance: [
   { prompt: `The angle between the current and the field is ${th} radians. What is sin θ?`, answer: [s], explanation: `sin(${th}) = ${n(s)}.` },
   { prompt: `Turn F = ILB sin θ round: I = F/(LB sin θ), with F = ${n(f / 1000)} N, L = ${n(L / 100)} m and B = ${n(b / 1000)} T. What is the current in amperes?`, answer: [i], explanation: `I = ${n(f / 1000)} ÷ (${n(L / 100)} × ${n(b / 1000)} × ${n(s)}) = ${n(i)} A.` },
   { prompt: `The circuit's resistance is ${n(R)} Ω. What supply voltage drives that current, in volts?`, answer: [V], explanation: `V = IR = ${n(i)} × ${n(R)} = ${n(V)} V.` }
  ] }; }
});

mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Floating the test bar',
 brief: 'Mira wants a copper test bar held up in mid-air by the magnet alone, so she needs the current that balances its weight and the supply that drives it.',
 labels: ['current (A)', 'supply voltage (V)'], tolerance: 0.005,
 gl: [['weight (mN)'], ['current (A)'], ['supply voltage (V)']]
}, {
 /* m grams, L cm, b mT, R ohms. The force ILB (the bar is at right angles to the field) equals the weight 10 m mN, with g = 10 m/s². I = 1000m/(Lb) must be exact to 2 places. */
 canonical: { m: 60, L: 40, b: 300, R: 3 },
 draw: R => retry(R, R => ({ m: 5 * R.int(2, 40), L: 5 * R.int(2, 12), b: 10 * R.int(5, 40), R: R.int(2, 10) }), p => {
  const i = 1000 * p.m / (p.L * p.b); return same2(i, r2(i)) && i >= 0.5 && i <= 40; }, { m: 60, L: 40, b: 300, R: 3 }),
 build: ({ m, L, b, R }) => { const W = 10 * m, i = 1000 * m / (L * b), V = i * R; return {
  prompt: `Mira wants to hold a copper test bar in mid-air with a magnet alone. The bar has mass ${n(m)} g and is ${n(L)} cm long. It lies horizontally at right angles to a horizontal magnetic field of ${n(b)} mT, and the current is sent through it the way that makes the magnetic force point straight up. The bar's circuit has a total resistance of ${n(R)} Ω. Take g = 10 m/s². Enter the current needed to hold the bar still, in amperes (A), then the supply voltage that drives it, in volts (V). Give each to 2 decimal places.`,
  answer: [i, V],
  hints: ['The bar floats when the upward magnetic force equals its weight, mg, in newtons. Use the mass in kilograms, so 1000 g is 1 kg.', 'The bar is at right angles to the field, so sin θ = 1 and the force is ILB. Solve ILB = mg for I, then use Ohm\'s law, V = IR, for the supply.'],
  solution: `The weight is mg = ${n(m / 1000)} × 10 = ${n(W / 1000)} N. The bar is at right angles to the field, so the magnetic force is ILB, and for the bar to float ILB = mg. Then I = mg/(LB) = ${n(W / 1000)} ÷ (${n(L / 100)} × ${n(b / 1000)}) = ${n(i)} A. Ohm's law gives V = IR = ${n(i)} × ${n(R)} = ${n(V)} V.`,
  guidance: [
   { prompt: `The bar's mass is ${n(m)} g. With g = 10 m/s², what is its weight in millinewtons (mN)?`, answer: [W], explanation: `${n(m)} g = ${n(m / 1000)} kg, and the weight is ${n(m / 1000)} × 10 = ${n(W / 1000)} N, which is ${n(W)} mN.` },
   { prompt: `For the bar to float, ILB must equal that weight (${n(W / 1000)} N). With L = ${n(L / 100)} m and B = ${n(b / 1000)} T, what current is needed, in amperes?`, answer: [i], explanation: `I = ${n(W / 1000)} ÷ (${n(L / 100)} × ${n(b / 1000)}) = ${n(i)} A.` },
   { prompt: `The circuit's resistance is ${n(R)} Ω. What supply voltage drives that current, in volts?`, answer: [V], explanation: `V = IR = ${n(i)} × ${n(R)} = ${n(V)} V.` }
  ] }; }
});

mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q25', title: 'Launching the cargo rod',
 brief: 'A cargo rod rests across two rails in the magnet gap, and Mira wants the current, the push on the rod and the speed it reaches.',
 labels: ['current (A)', 'force (N)', 'speed (m/s)'], tolerance: 0.005,
 gl: [['current (A)'], ['force (N)'], ['speed (m/s)']]
}, {
 /* Supply V = I R volts, rod length L cm at right angles to a field of b mT, rod mass m g, pushed for t seconds from rest. F = ILB, a = F/m, v = a t. */
 canonical: { I: 15, R: 4, L: 60, b: 250, m: 150, t: 2 },
 draw: R => retry(R, R => ({ I: R.int(5, 30), R: R.int(2, 8), L: 10 * R.int(3, 10), b: 10 * R.int(10, 40), m: 25 * R.int(2, 12), t: R.pick([1, 2, 3, 4]) }), p => {
  const F = p.I * p.L / 100 * p.b / 1000, v = F / (p.m / 1000) * p.t;
  return allSafe([F, v]) && same2(r2(r2(F) / (p.m / 1000) * p.t), r2(v)) && v < 90000; }, { I: 15, R: 4, L: 60, b: 250, m: 150, t: 2 }),
 build: ({ I, R, L, b, m, t }) => { const V = I * R, F = I * L / 100 * b / 1000, a = F / (m / 1000), v = a * t; return {
  prompt: `A cargo rod in the Ore Sorter's launcher rests across two smooth horizontal rails, in a magnetic field of ${n(b)} mT that points straight up, at right angles to the rod and the rails. The rod is ${n(L)} cm long and has mass ${n(m)} g. A ${n(V)} V supply drives a current through the rod, and the circuit has a total resistance of ${n(R)} Ω. The rod starts from rest, and there is no friction. Ignore any emf that the motion itself induces, so the current stays constant, and take the rod to be at right angles to the field the whole time. Enter the current in amperes (A), then the size of the force on the rod in newtons (N), then the speed of the rod after ${n(t)} s in metres per second (m/s). Give the force and the speed to 2 decimal places and type numbers without commas.`,
  answer: [I, r2(F), r2(v)],
  hints: ['Ohm\'s law gives the current: I = V/R. The rod is at right angles to the field, so the force is F = ILB, with L in metres and B in tesla.', 'Newton\'s second law gives the acceleration, a = F/m, with the mass in kilograms. The force is steady, so the speed after a time t from rest is v = at.'],
  solution: `Ohm's law: I = V/R = ${n(V)} ÷ ${n(R)} = ${n(I)} A. The rod is at right angles to the field, so F = ILB = ${n(I)} × ${n(L / 100)} × ${n(b / 1000)}, which is ${is2(F, 'N')}. Its mass is ${n(m / 1000)} kg, so a = F/m ${ap(a)} ${n(a)} m/s² (using the unrounded force). The force is steady, so after ${n(t)} s the speed is v = at, which is ${is2(v, 'm/s')}.`,
  guidance: [
   { prompt: `The supply is ${n(V)} V and the circuit's resistance ${n(R)} Ω. What current flows, in amperes?`, answer: [I], explanation: `I = V/R = ${n(V)} ÷ ${n(R)} = ${n(I)} A.` },
   { prompt: `The rod is at right angles to the field, so F = ILB. What is the force in newtons, to 2 decimal places?`, answer: [r2(F)], explanation: `F = ${n(I)} × ${n(L / 100)} × ${n(b / 1000)}, which is ${is2(F, 'N')}.` },
   { prompt: `Divide the force by the mass in kilograms to find the acceleration, then multiply by ${n(t)} s. What is the speed in metres per second, to 2 decimal places?`, answer: [r2(v)], explanation: `a = F/m = F ÷ ${n(m / 1000)} and v = at, which is ${is2(v, 'm/s')}.` }
  ] }; }
});

/* ---- q33 Field of a long straight wire, and force between parallel wires [12.2, 12.3] ---- */

mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'Reading the earth cable',
 brief: 'A probe beside the mast earth cable gives one field reading, and Mira wants the current behind it and the field at a second spot.',
 labels: ['current (A)', 'field at the second spot (μT)'], tolerance: 0.005,
 gl: [['current (A)'], ['field at the second spot (μT)']]
}, {
 /* B1 (μT) is read at r1 cm; B2 is the field at r2 cm. B1 is built from a whole current I (a multiple of 5), I = B1 r1 / 20, and B2 = 20 I / r2 is exact to 2 places. */
 canonical: { B1: 125, r1: 12, r2: 30 },
 draw: R => retry(R, R => { const I = 5 * R.int(2, 40), r1 = R.int(2, 25); return { B1: 20 * I / r1, r1, r2: R.int(r1 + 1, 40) }; }, p => same2(p.B1, r2(p.B1)) && same2(20 * p.B1 * p.r1 / 20 / p.r2, r2(p.B1 * p.r1 / p.r2)) && !(p.B1 === 125 && p.r1 === 12 && p.r2 === 30), { B1: 125, r1: 12, r2: 30 }),
 build: ({ B1, r1, r2: rr }) => { const I = B1 * r1 / 20, B2 = B1 * r1 / rr; return {
  prompt: `A long, straight earth cable runs from the comms mast down to the ground. A probe ${n(r1)} cm from the cable reads a magnetic field of size ${n(B1)} μT (1 μT = 10⁻⁶ T). Treat the cable as a long straight wire with no other fields present, and take μ₀ = 4π × 10⁻⁷ T·m/A. Enter the current in the cable in amperes (A), then the size of the field ${n(rr)} cm from the cable in microtesla (μT). Give each to 2 decimal places and type numbers without commas.`,
  answer: [I, r2(B2)],
  hints: ['A long straight wire makes a field of size B = μ₀I/(2πr) at a distance r from it, and μ₀/(2π) = 2 × 10⁻⁷ T·m/A. Turn the rule round to find I: I = 2πrB/μ₀. Use metres and tesla.', 'The field is proportional to the current and falls off as 1/r, so the same current gives the field at the second distance from the same rule.'],
  solution: `With B = ${n(B1)} μT = ${n(B1)} × 10⁻⁶ T and r = ${n(r1)} cm = ${n(r1 / 100)} m, B = μ₀I/(2πr) gives I = B × r ÷ (2 × 10⁻⁷) = ${n(B1)} × 10⁻⁶ × ${n(r1 / 100)} ÷ (2 × 10⁻⁷) = ${n(I)} A. At ${n(rr)} cm = ${n(rr / 100)} m the field is B = 2 × 10⁻⁷ × ${n(I)} ÷ ${n(rr / 100)} T, which is ${is2(B2, 'μT')}.`,
  guidance: [
   { prompt: `Turn B = μ₀I/(2πr) round: I = B r ÷ (2 × 10⁻⁷), with B = ${n(B1)} × 10⁻⁶ T and r = ${n(r1 / 100)} m. What is the current in amperes?`, answer: [I], explanation: `I = ${n(B1)} × 10⁻⁶ × ${n(r1 / 100)} ÷ (2 × 10⁻⁷) = ${n(I)} A.` },
   { prompt: `Now use that current at r = ${n(rr / 100)} m: B = 2 × 10⁻⁷ × I ÷ r. What is the field in microtesla, to 2 decimal places?`, answer: [r2(B2)], explanation: `B = 2 × 10⁻⁷ × ${n(I)} ÷ ${n(rr / 100)} T, which is ${is2(B2, 'μT')}.` }
  ] }; }
});

mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'The middle cable of three',
 brief: 'Three feed cables lie in a row in one trench, and Mira wants to know how hard the middle one is pulled and which way it is pushed.',
 labels: ['net force per metre (μN/m)', 'towards A 1, towards C −1'], tolerance: 0.005,
 gl: [['force from A (μN/m)'], ['force from C (μN/m)'], ['net force per metre (μN/m)']]
}, {
 /* Currents iA, iB, iC (A); A is dAB cm from B on one side and C is dBC cm from B on the other. A has the same direction as B. If C has the same
    direction as B (same = true) it pulls B towards C, otherwise it pushes B away from C, which is towards A. Each force per metre is 20 × I I' / d μN/m (d in cm). */
 canonical: { iA: 30, iB: 40, iC: 25, d1: 6, d2: 10, same: false },
 draw: R => retry(R, R => ({ iA: 5 * R.int(2, 12), iB: 5 * R.int(2, 12), iC: 5 * R.int(2, 12), d1: R.int(3, 15), d2: R.int(3, 15), same: R.bool() }), p => {
  const FA = 20 * p.iA * p.iB / p.d1, FC = 20 * p.iC * p.iB / p.d2, net = p.same ? FA - FC : FA + FC;
  return allSafe([FA, FC, net]) && Math.abs(net) >= 5 && same2(r2(p.same ? r2(FA) - r2(FC) : r2(FA) + r2(FC)), r2(net)) && !(p.iA === 30 && p.iB === 40 && p.iC === 25 && p.d1 === 6 && p.d2 === 10); }, { iA: 30, iB: 40, iC: 25, d1: 6, d2: 10, same: false }),
 build: ({ iA, iB, iC, d1, d2, same }) => { const FA = 20 * iA * iB / d1, FC = 20 * iC * iB / d2, net = same ? FA - FC : FA + FC, size = Math.abs(net), dir = net > 0 ? 1 : -1; return {
  prompt: `Three long, straight, parallel feed cables lie in a flat row in one trench, in the order A, B, C, with B in the middle. A is ${n(d1)} cm from B and C is ${n(d2)} cm from B, on the other side. Cable A carries ${n(iA)} A, B carries ${n(iB)} A and C carries ${n(iC)} A. The currents in A and B run the same way, and the current in C runs ${same ? 'the same way as well' : 'the opposite way'}. Take μ₀ = 4π × 10⁻⁷ T·m/A. Parallel currents in the same direction attract and opposite ones repel, and the force from each cable on B is found as if the other were not there; the net force is the sum of the two, taking care over which way each pushes. Enter the size of the net force on each metre of cable B, in micronewtons per metre (μN/m, 1 μN = 10⁻⁶ N), then 1 if that net force points towards A or −1 if it points towards C. Round the force to 2 decimal places and type numbers without commas.`,
  answer: [r2(size), dir],
  hints: ['The force per metre between two long parallel cables is μ₀I₁I₂/(2πd), which is 2 × 10⁻⁷ × I₁I₂/d newtons per metre with d in metres. Work out the force from A on B and the force from C on B separately.', 'Decide each direction first: same-way currents attract (a pull towards that cable), opposite-way currents repel (a push away from it). Forces along the same line in the same direction add; in opposite directions you subtract the smaller from the larger.'],
  solution: `A and B carry current the same way, so A pulls B towards A with F/L = 2 × 10⁻⁷ × ${n(iA)} × ${n(iB)} ÷ ${n(d1 / 100)} N/m, which is ${is2(FA, 'μN/m')}. C carries current ${same ? 'the same way as B, so it pulls B towards C' : 'the opposite way to B, so it pushes B away from C, which is towards A'}, with F/L = 2 × 10⁻⁷ × ${n(iC)} × ${n(iB)} ÷ ${n(d2 / 100)} N/m, which is ${is2(FC, 'μN/m')}. ${same ? `The two forces point opposite ways, so the net force has size |${n(FA)} − ${n(FC)}| ${eqr(size, 'μN/m')}. The larger force is the one towards ${net > 0 ? 'A' : 'C'}, so the net force points ${net > 0 ? 'towards A: 1' : 'towards C: −1'}.` : `The two forces point the same way, so the net force has size ${n(FA)} + ${n(FC)} ${eqr(size, 'μN/m')}, and it points towards A: 1.`}`,
  guidance: [
   { prompt: `Cable A is ${n(d1)} cm from B. Using F/L = 2 × 10⁻⁷ × I₁I₂/d, what force per metre does A put on B, in μN/m, to 2 decimal places?`, answer: [r2(FA)], explanation: `F/L = 2 × 10⁻⁷ × ${n(iA)} × ${n(iB)} ÷ ${n(d1 / 100)} N/m, which is ${is2(FA, 'μN/m')}. It pulls B towards A.` },
   { prompt: `Cable C is ${n(d2)} cm from B. What is the size of the force per metre that C puts on B, in μN/m, to 2 decimal places?`, answer: [r2(FC)], explanation: `F/L = 2 × 10⁻⁷ × ${n(iC)} × ${n(iB)} ÷ ${n(d2 / 100)} N/m, which is ${is2(FC, 'μN/m')}. It ${same ? 'pulls B towards C' : 'pushes B away from C, towards A'}.` },
   { prompt: `The force from A points towards A. The force from C points ${same ? 'towards C' : 'towards A'}. What is the size of the net force per metre, in μN/m, to 2 decimal places?`, answer: [r2(size)], explanation: same ? `The forces oppose, so the net size is |${n(FA)} − ${n(FC)}| ${eqr(size, 'μN/m')}, towards ${net > 0 ? 'A' : 'C'}.` : `The forces add: ${n(FA)} + ${n(FC)} ${eqr(size, 'μN/m')}, towards A.` }
  ] }; }
});

mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', title: 'The floating cable',
 brief: 'In a test rig, the top cable is held off the bottom one by magnetic repulsion alone, and Mira wants the field it needs and the gap that gives it.',
 labels: ['field needed (μT)', 'gap (mm)'], tolerance: 0.005,
 gl: [['field needed (μT)'], ['gap (mm)']]
}, {
 /* Lower cable i1 A, upper cable i2 A in the opposite direction, upper cable's mass per metre lam g/m, g = 10 m/s².
    The upper cable floats when i2 B = lam g, so B (μT) = 10000 lam / i2, and then d (mm) = 2 × 10⁻⁷ i1 / B × 1000 = 0.02 i1 i2 / lam. */
 canonical: { i1: 250, i2: 80, lam: 8 },
 draw: R => retry(R, R => ({ i1: 50 * R.int(1, 10), i2: 10 * R.int(2, 20), lam: R.int(1, 12) }), p => {
  const B = 10000 * p.lam / p.i2, d = 0.02 * p.i1 * p.i2 / p.lam, dr = 2e-7 * p.i1 / (r2(B) * 1e-6) * 1000;
  return allSafe([B, d]) && same2(r2(dr), r2(d)) && d >= 1 && d < 9000; }, { i1: 250, i2: 80, lam: 8 }),
 build: ({ i1, i2, lam }) => { const w = lam * 10 / 1000, B = 10000 * lam / i2, d = 0.02 * i1 * i2 / lam; return {
  prompt: `In a test rig two long, straight, parallel cables lie one above the other in a vertical plane. The lower cable carries ${n(i1)} A. The upper cable carries ${n(i2)} A in the opposite direction and has a mass of ${n(lam)} g for every metre of its length. The upper cable floats above the lower one, held up only by the magnetic repulsion between them, so the repulsion on each metre of it equals the weight of each metre. Take μ₀ = 4π × 10⁻⁷ T·m/A and g = 10 m/s². Enter the size of the field the lower cable must make at the upper one, in microtesla (μT), then the gap between the cables in millimetres (mm). Give each to 2 decimal places, work from unrounded values and type numbers without commas.`,
  answer: [r2(B), r2(d)],
  hints: ['A length L of the upper cable feels a force I₂LB from the lower cable\'s field, so each metre feels I₂B. Set that equal to the weight of one metre, which is its mass per metre times g (use kilograms), and solve for B.', 'The lower cable makes the field B = μ₀I₁/(2πd) = 2 × 10⁻⁷ × I₁/d at a distance d. Turn it round to find d, in metres, then change to millimetres.'],
  solution: `One metre of the upper cable has mass ${n(lam)} g = ${n(lam / 1000)} kg, so it weighs ${n(lam / 1000)} × 10 = ${n(w)} N. The repulsion on each metre is I₂B, so ${n(i2)} × B = ${n(w)} and B = ${n(w)} ÷ ${n(i2)} T, which is ${is2(B, 'μT')}. The lower cable makes B = 2 × 10⁻⁷ × ${n(i1)} ÷ d, so d = 2 × 10⁻⁷ × ${n(i1)} ÷ B m, which is ${is2(d, 'mm')}.`,
  guidance: [
   { prompt: `Each metre of the upper cable weighs ${n(w)} N, and the repulsion on each metre is I₂B with I₂ = ${n(i2)} A. What field must the lower cable make there, in microtesla, to 2 decimal places?`, answer: [r2(B)], explanation: `B = ${n(w)} ÷ ${n(i2)} T, which is ${is2(B, 'μT')}.` },
   { prompt: `The lower cable's field is B = 2 × 10⁻⁷ × ${n(i1)} ÷ d. Turn it round, using that field (unrounded), and find the gap d in millimetres, to 2 decimal places.`, answer: [r2(d)], explanation: `d = 2 × 10⁻⁷ × ${n(i1)} ÷ B m, which is ${is2(d, 'mm')}.` }
  ] }; }
});

/* ---- q34 Ampère's law (the line integral ∮B·dl) and the field inside a solenoid [12.5, 12.6] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The cable duct loop',
 brief: 'Three cables share one duct under the sorter floor, and Mira wants the net current in the duct and the field it makes round a circle of floor.',
 labels: ['net current (A)', 'line integral (μT·m)', 'field (μT)'], tolerance: 0.005,
 gl: [['net current (A)'], ['line integral (μT·m)'], ['field (μT)']]
}, {
 /* Currents i1, i2 one way and i3 the other; i1 + i2 > i3. The Ampère circle has radius r cm. ∮B·dl = μ₀ I in μT·m is 4π/10 × I. B = ∮B·dl ÷ (2π r) = 20 I / r μT. */
 canonical: { i1: 40, i2: 25, i3: 15, r: 20 },
 draw: R => retry(R, R => ({ i1: 5 * R.int(2, 20), i2: 5 * R.int(2, 20), i3: 5 * R.int(1, 15), r: R.int(5, 50) }), p => {
  const I = p.i1 + p.i2 - p.i3, ln = MU0 * I * 1e6, B = 20 * I / p.r;
  return I >= 10 && allSafe([ln, B]) && same2(r2(r2(ln) / (TWO_PI * p.r / 100)), r2(B)) && !(p.i1 === 40 && p.i2 === 25 && p.i3 === 15 && p.r === 20); }, { i1: 40, i2: 25, i3: 15, r: 20 }),
 build: ({ i1, i2, i3, r }) => { const I = i1 + i2 - i3, ln = MU0 * I * 1e6, B = 20 * I / r, rm = r / 100; return {
  prompt: `Three thin cables run side by side through one duct under the Ore Sorter's floor. Cables 1 and 2 carry ${n(i1)} A and ${n(i2)} A in one direction, and cable 3 carries ${n(i3)} A in the opposite direction. A circle of radius ${n(r)} cm is drawn on a plane at right angles to the duct, with the duct at its centre. The duct is so narrow that the field has the same size all the way round the circle and runs along it. Take μ₀ = 4π × 10⁻⁷ T·m/A and count a current in the opposite direction as negative. Enter the total current passing through the circle in amperes (A), then the line integral ∮B·dl round the circle in microtesla-metres (μT·m, 1 μT·m = 10⁻⁶ T·m), then the size of the field on the circle in microtesla (μT). Give the last two to 2 decimal places and type numbers without commas.`,
  answer: [I, r2(ln), r2(B)],
  hints: ['Ampère\'s law: the line integral round a closed path is μ₀ times the total current through it. Add the currents with their signs: one direction positive, the other negative.', 'On the circle the field is along the path and the same size everywhere, so the line integral is B times the length of the circle, 2πr. Solve for B, with r in metres.'],
  solution: `The total current is ${n(i1)} + ${n(i2)} − ${n(i3)} = ${n(I)} A. By Ampère's law ∮B·dl = μ₀I = 4π × 10⁻⁷ × ${n(I)} T·m, which is ${is2(ln, 'μT·m')}. The field is along the circle and constant on it, so ∮B·dl = B × 2πr with r = ${n(rm)} m. Then B = ∮B·dl ÷ (2πr), which is ${is2(B, 'μT')}.`,
  guidance: [
   { prompt: `Cables 1 and 2 carry current one way and cable 3 the other. What is the total current passing through the circle, in amperes, counting the opposite direction as negative?`, answer: [I], explanation: `${n(i1)} + ${n(i2)} − ${n(i3)} = ${n(I)} A.` },
   { prompt: `Ampère's law gives ∮B·dl = μ₀I. What is the line integral in microtesla-metres, to 2 decimal places?`, answer: [r2(ln)], explanation: `μ₀I = 4π × 10⁻⁷ × ${n(I)} T·m, which is ${is2(ln, 'μT·m')}.` },
   { prompt: `On the circle, ∮B·dl = B × 2πr with r = ${n(rm)} m. Using the unrounded line integral, what is B in microtesla, to 2 decimal places?`, answer: [r2(B)], explanation: `B = ∮B·dl ÷ (2π × ${n(rm)}), which is ${is2(B, 'μT')}.` }
  ] }; }
});

mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'A coil inside a coil',
 brief: 'The coil gate has a short coil wound inside a longer one on the same axis, and Mira wants the net field in the middle and which coil wins.',
 labels: ['net field (mT)', 'along inner coil 1, along outer coil −1'], tolerance: 0.005,
 gl: [['inner coil field (mT)'], ['outer coil field (mT)'], ['net field (mT)']]
}, {
 /* Inner coil: n1 turns per metre (a multiple of 100), length l1 cm, current h1/2 A. Outer coil: n2, l2, h2/2 A, longer than the inner one, so it surrounds it.
    B = μ₀ n I (in mT, 4π × 10⁻⁴ n I). If the currents circulate the same way the fields add; otherwise they subtract. dir is 1 when the net field is along the inner coil's own field. */
 canonical: { n1: 3000, l1: 20, h1: 6, n2: 1500, l2: 50, h2: 8, same: false },
 draw: R => retry(R, R => ({ n1: 100 * R.int(10, 50), l1: R.pick([10, 15, 20, 25]), h1: R.int(2, 16), n2: 100 * R.int(10, 50), l2: R.pick([40, 50, 60]), h2: R.int(2, 16), same: R.bool() }), p => {
  const B1 = 4 * Math.PI * 1e-4 * p.n1 * p.h1 / 2, B2 = 4 * Math.PI * 1e-4 * p.n2 * p.h2 / 2, net = p.same ? B1 + B2 : B1 - B2;
  return allSafe([B1, B2, net]) && Math.abs(net) >= 0.5 && same2(r2(p.same ? r2(B1) + r2(B2) : r2(B1) - r2(B2)), r2(net)) && !(p.n1 === 3000 && p.h1 === 6 && p.n2 === 1500 && p.h2 === 8 && !p.same); }, { n1: 3000, l1: 20, h1: 6, n2: 1500, l2: 50, h2: 8, same: false }),
 build: ({ n1, l1, h1, n2, l2, h2, same }) => { const N1 = n1 * l1 / 100, N2 = n2 * l2 / 100, I1 = h1 / 2, I2 = h2 / 2, B1 = 4 * Math.PI * 1e-4 * n1 * I1, B2 = 4 * Math.PI * 1e-4 * n2 * I2,
  net = same ? B1 + B2 : B1 - B2, size = Math.abs(net), dir = net > 0 ? 1 : -1; return {
  prompt: `The Ore Sorter's coil gate has two long solenoids wound on the same axis. The inner coil has ${n(N1)} turns spread evenly along ${n(l1)} cm and carries ${n(I1)} A. It sits inside the outer coil, which has ${n(N2)} turns spread evenly along ${n(l2)} cm and carries ${n(I2)} A. The currents circulate ${same ? 'the same way' : 'in opposite senses'} round the axis. Take μ₀ = 4π × 10⁻⁷ T·m/A. Inside a long solenoid the field is B = μ₀nI, along the axis, and magnetic fields from two coils add as vectors: where the two fields point the same way they add, and where they point opposite ways the smaller is taken from the larger. Treat both coils as long, so the outer coil's field is uniform through the inner coil. Enter the size of the net field inside the inner coil in millitesla (mT, 1 mT = 10⁻³ T), then 1 if the net field points the way the inner coil's own field points, or −1 if it points the opposite way. Round the field to 2 decimal places and type numbers without commas.`,
  answer: [r2(size), dir],
  hints: ['Turns per metre first: n is the number of turns divided by the length in metres, for each coil. Then each coil alone makes B = μ₀nI inside it.', 'Same circulation means the two fields point the same way, so add them. Opposite circulation means they point opposite ways, so subtract the smaller from the larger, and the net field points the way of the larger one.'],
  solution: `Inner coil: n₁ = ${n(N1)} ÷ ${n(l1 / 100)} = ${n(n1)} turns per metre, so B₁ = μ₀n₁I₁ = 4π × 10⁻⁷ × ${n(n1)} × ${n(I1)} T, which is ${is2(B1, 'mT')}. Outer coil: n₂ = ${n(N2)} ÷ ${n(l2 / 100)} = ${n(n2)} turns per metre, so B₂ = μ₀n₂I₂ = 4π × 10⁻⁷ × ${n(n2)} × ${n(I2)} T, which is ${is2(B2, 'mT')}. ${same ? `The currents circulate the same way, so the fields add: ${n(B1)} + ${n(B2)}, which is ${is2(size, 'mT')}, along the inner coil's field: 1.` : `The currents circulate in opposite senses, so the fields oppose: |${n(B1)} − ${n(B2)}|, which is ${is2(size, 'mT')}. The ${net > 0 ? 'inner' : 'outer'} coil's field is larger, so the net field points ${net > 0 ? 'the way of the inner coil\'s own field: 1' : 'the opposite way to the inner coil\'s own field: −1'}.`}`,
  guidance: [
   { prompt: `The inner coil has ${n(N1)} turns along ${n(l1)} cm and carries ${n(I1)} A. What field does it make inside itself, in mT, to 2 decimal places?`, answer: [r2(B1)], explanation: `n₁ = ${n(N1)} ÷ ${n(l1 / 100)} = ${n(n1)} turns per metre, and B₁ = μ₀n₁I₁, which is ${is2(B1, 'mT')}.` },
   { prompt: `The outer coil has ${n(N2)} turns along ${n(l2)} cm and carries ${n(I2)} A. What field does it make inside itself, in mT, to 2 decimal places?`, answer: [r2(B2)], explanation: `n₂ = ${n(N2)} ÷ ${n(l2 / 100)} = ${n(n2)} turns per metre, and B₂ = μ₀n₂I₂, which is ${is2(B2, 'mT')}.` },
   { prompt: `The currents circulate ${same ? 'the same way' : 'in opposite senses'}. What is the size of the net field inside the inner coil, in mT, to 2 decimal places?`, answer: [r2(size)], explanation: same ? `The fields point the same way, so they add: ${n(B1)} + ${n(B2)}, which is ${is2(size, 'mT')}.` : `The fields point opposite ways, so subtract the smaller from the larger: |${n(B1)} − ${n(B2)}|, which is ${is2(size, 'mT')}.` }
  ] }; }
});

mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q33', title: 'A cable beside the coil',
 brief: 'A power cable runs alongside the coil gate, and Mira wants the field on the coil\'s axis from the coil, from the cable and from both together.',
 labels: ['coil field (mT)', 'cable field (mT)', 'total field (mT)'], tolerance: 0.005,
 gl: [['coil field (mT)'], ['cable field (mT)'], ['total field (mT)']]
}, {
 /* Solenoid n turns per metre (a multiple of 100), current h/2 A; straight cable iw A at r cm from the axis, parallel to it.
    Bs = 4π × 10⁻⁴ n I mT; Bw = 2 × 10⁻⁷ iw / (r/100) T = 0.02 iw / r mT; the two fields are at right angles, so B = √(Bs² + Bw²). */
 canonical: { n: 2500, h: 5, iw: 120, r: 6 },
 draw: R => retry(R, R => ({ n: 100 * R.int(10, 50), h: R.int(2, 16), iw: 10 * R.int(3, 30), r: R.int(3, 15) }), p => {
  const Bs = 4 * Math.PI * 1e-4 * p.n * p.h / 2, Bw = 0.02 * p.iw / p.r, B = Math.hypot(Bs, Bw);
  return allSafe([Bs, Bw, B]) && same2(r2(Math.hypot(r2(Bs), r2(Bw))), r2(B)) && Bw >= 0.1; }, { n: 2500, h: 5, iw: 120, r: 6 }),
 build: ({ n: nn, h, iw, r }) => { const I = h / 2, Bs = 4 * Math.PI * 1e-4 * nn * I, Bw = 0.02 * iw / r, B = Math.hypot(Bs, Bw); return {
  prompt: `The Ore Sorter's coil gate is a long solenoid with ${n(nn)} turns per metre, carrying ${n(I)} A. A long straight power cable carrying ${n(iw)} A runs outside the coil, parallel to its axis, with ${n(r)} cm between the cable and the axis. Take μ₀ = 4π × 10⁻⁷ T·m/A. The coil does not change the cable's field. On the axis, the coil's field runs along the axis and the cable's field is at right angles to it, so the two fields combine like the sides of a right-angled triangle: the size of the total is the square root of the sum of the squares. Enter the size of the coil's field on the axis, the size of the cable's field on the axis, and the size of the total field there, each in millitesla (mT, 1 mT = 10⁻³ T) to 2 decimal places. Work from unrounded values and type numbers without commas.`,
  answer: [r2(Bs), r2(Bw), r2(B)],
  hints: ['Inside a long solenoid B = μ₀nI, with n in turns per metre. A long straight cable makes B = μ₀I/(2πr) = 2 × 10⁻⁷ × I/r tesla at distance r, with r in metres.', 'The two fields are at right angles, so the total size is √(B₁² + B₂²). Convert tesla to millitesla at the end.'],
  solution: `The coil's field is B = μ₀nI = 4π × 10⁻⁷ × ${n(nn)} × ${n(I)} T, which is ${is2(Bs, 'mT')}. The cable's field at ${n(r / 100)} m is B = 2 × 10⁻⁷ × ${n(iw)} ÷ ${n(r / 100)} T, which is ${is2(Bw, 'mT')}. The fields are at right angles, so the total is √(${n(Bs)}² + ${n(Bw)}²), which is ${is2(B, 'mT')}.`,
  guidance: [
   { prompt: `Use B = μ₀nI inside the coil, with n = ${n(nn)} turns per metre and I = ${n(I)} A. What is the coil's field, in mT, to 2 decimal places?`, answer: [r2(Bs)], explanation: `B = 4π × 10⁻⁷ × ${n(nn)} × ${n(I)} T, which is ${is2(Bs, 'mT')}.` },
   { prompt: `Use B = 2 × 10⁻⁷ × I/r for the cable, with I = ${n(iw)} A and r = ${n(r / 100)} m. What is the cable's field on the axis, in mT, to 2 decimal places?`, answer: [r2(Bw)], explanation: `B = 2 × 10⁻⁷ × ${n(iw)} ÷ ${n(r / 100)} T, which is ${is2(Bw, 'mT')}.` },
   { prompt: `The two fields are at right angles. Using the unrounded fields, what is the size of the total, in mT, to 2 decimal places?`, answer: [r2(B)], explanation: `B = √(${n(Bs)}² + ${n(Bw)}²), which is ${is2(B, 'mT')}.` }
  ] }; }
});

/* ---- q35 Magnetic flux and Faraday's law, with Lenz's law for direction [13.1] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The leak sensor loop',
 brief: 'A rectangular sensor loop sits in a field that points down through it, and Mira wants its signal and which way the current runs when the field changes.',
 labels: ['emf (mV)', 'current (mA)', 'clockwise 1, anticlockwise −1'], tolerance: 0.005,
 gl: [['change in flux (μWb)'], ['emf (mV)'], ['current (mA)'], ['clockwise 1, anticlockwise −1']]
}, {
 /* N turns, each a w × h cm rectangle; a field pointing down through it changes from b1 to b2 mT over dt s; resistance R. ΔΦ (μWb) = w h |Δb| ÷ 10;
    emf (mV) = N ΔΦ ÷ (1000 dt). Downward flux growing: induced field up, anticlockwise (−1) seen from above; shrinking: clockwise (1). */
 canonical: { N: 80, w: 8, h: 5, b1: 30, b2: 90, dt: 0.5, R: 4 },
 draw: R => retry(R, R => ({ N: 10 * R.int(2, 20), w: R.int(3, 12), h: R.int(3, 12), b1: 10 * R.int(0, 20), b2: 10 * R.int(0, 20), dt: R.pick(DTS), R: R.int(2, 20) }), p => {
  if (p.b1 === p.b2) return false; const dP = p.w * p.h * Math.abs(p.b2 - p.b1) / 10, emf = p.N * dP / (1000 * p.dt), I = emf / p.R;
  return emf >= 1 && emf < 90000 && allSafe([emf, I]) && same2(r2(r2(emf) / p.R), r2(I)) && !(p.b1 === 30 && p.b2 === 90 && p.N === 80); }, { N: 80, w: 8, h: 5, b1: 30, b2: 90, dt: 0.5, R: 4 }),
 build: ({ N, w, h, b1, b2, dt, R }) => { const A = w * h / 1e4, dB = Math.abs(b2 - b1), dP = w * h * dB / 10, emf = N * dP / (1000 * dt), I = emf / R, up = b2 > b1, dir = up ? -1 : 1; return {
  prompt: `A leak sensor in the Generator Station is a coil of ${n(N)} turns, each turn a rectangle ${n(w)} cm by ${n(h)} cm. It lies flat, and a magnetic field points straight down through it, at right angles to the coil. Over ${n(dt)} s the strength of the field changes steadily from ${n(b1)} mT to ${n(b2)} mT. The coil's ends are joined, and its total resistance is ${n(R)} Ω. Enter the size of the induced emf in millivolts (mV), then the size of the current in milliamperes (mA), each to 2 decimal places. Then enter the direction of the current seen from above: 1 for clockwise, −1 for anticlockwise. Type numbers without commas.`,
  answer: [r2(emf), r2(I), dir],
  hints: ['The area of one turn is the length times the width, in square metres (1 m² = 10 000 cm²). The flux through one turn is Φ = BA, and Faraday\'s law gives an emf of size N times the change in flux through one turn, divided by the time.', 'Lenz\'s law: the current makes a field that opposes the change in flux. Work out whether the downward flux is growing or shrinking, decide which way the current\'s field inside the loop must point, and use your right hand: thumb along that field, fingers curl along the current.'],
  solution: `One turn has area ${n(w)} cm × ${n(h)} cm = ${n(w * h)} cm² = ${n(A)} m². The flux through it changes by ΔΦ = A × ΔB = ${n(A)} × ${n(dB)} mT = ${n(dP / 1000)} mWb, which is ${n(dP)} μWb. Faraday's law gives an emf of size N × ΔΦ/Δt = ${n(N)} × ${n(dP / 1000)} ÷ ${n(dt)}, which is ${is2(emf, 'mV')}. The current is I = emf/R, which is ${is2(I, 'mA')}. The downward flux is ${up ? 'growing, so by Lenz\'s law the current makes an upward field inside the coil. With your right thumb pointing up, your fingers curl anticlockwise seen from above: −1' : 'shrinking, so by Lenz\'s law the current makes a downward field inside the coil to make up the loss. With your right thumb pointing down, your fingers curl clockwise seen from above: 1'}.`,
  guidance: [
   { prompt: `Each turn is ${n(w)} cm by ${n(h)} cm, which is ${n(A)} m², and the field changes by ${n(dB)} mT. By how much does the flux through one turn change, in microwebers (μWb, 1 μWb = 10⁻⁶ Wb)? Enter the size.`, answer: [dP], explanation: `ΔΦ = A × ΔB = ${n(A)} m² × ${n(dB)} × 10⁻³ T = ${n(dP)} × 10⁻⁶ Wb, which is ${n(dP)} μWb.` },
   { prompt: `Faraday's law: emf = N × ΔΦ/Δt for ${n(N)} turns over ${n(dt)} s. What is the size of the emf, in mV, to 2 decimal places?`, answer: [r2(emf)], explanation: `${n(N)} × ${n(dP)} × 10⁻⁶ ÷ ${n(dt)} V, which is ${is2(emf, 'mV')}.` },
   { prompt: `The coil's resistance is ${n(R)} Ω. What current flows, in mA, to 2 decimal places?`, answer: [r2(I)], explanation: `I = emf/R, which is ${is2(I, 'mA')}.` },
   { prompt: `The downward flux is ${up ? 'growing' : 'shrinking'}. Which way does the current run, seen from above? Enter 1 for clockwise, −1 for anticlockwise.`, answer: [dir], explanation: up ? 'The current must make an upward field to oppose the growth. An upward thumb means fingers curling anticlockwise seen from above.' : 'The current must make a downward field to make up the loss. A downward thumb means fingers curling clockwise seen from above.' }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'Switching off the field magnet',
 brief: 'When the test magnet is switched off, a coil above it picks up a pulse, and Mira wants the size of the emf and the charge that flows round the coil circuit.',
 labels: ['emf (mV)', 'charge (mC)'], tolerance: 0.005,
 gl: [['emf (mV)'], ['current (mA)'], ['charge (mC)']]
}, {
 /* N turns of w × h cm; the upward field falls from b mT to zero over dt s; coil resistance Rc and a series resistor Rs. emf = N w h b ÷ (10 000 dt) mV
    (A in m² times mT gives mWb); I = emf ÷ (Rc + Rs) in mA; charge Q = I dt in mC. */
 canonical: { N: 120, w: 10, h: 6, b: 150, dt: 0.4, Rc: 3, Rs: 7 },
 draw: R => retry(R, R => ({ N: 10 * R.int(3, 25), w: R.int(4, 15), h: R.int(4, 15), b: 10 * R.int(3, 30), dt: R.pick(DTS), Rc: R.int(1, 8), Rs: R.int(2, 15) }), p => {
  const emf = p.N * p.w * p.h * p.b / (10000 * p.dt), I = emf / (p.Rc + p.Rs), Q = I * p.dt;
  return emf >= 1 && emf < 90000 && allSafe([emf, I, Q]) && same2(r2(r2(emf) / (p.Rc + p.Rs)), r2(I)) && same2(r2(r2(I) * p.dt), r2(Q)) && !(p.N === 10 && p.b === 50); }, { N: 120, w: 10, h: 6, b: 150, dt: 0.4, Rc: 3, Rs: 7 }),
 build: ({ N, w, h, b, dt, Rc, Rs }) => { const A = w * h / 1e4, dP = A * b, Rt = Rc + Rs, emf = N * dP / dt, I = emf / Rt, Q = I * dt; return {
  prompt: `A coil sits on top of the test magnet in the Generator Station. It has ${n(N)} turns, each a rectangle ${n(w)} cm by ${n(h)} cm, and the magnet's field points up through it at right angles to the coil. When the magnet is switched off, the field falls steadily from ${n(b)} mT to zero in ${n(dt)} s. The coil has a resistance of ${n(Rc)} Ω and is joined in series with a ${n(Rs)} Ω resistor to make a closed circuit, and it is the only source of emf in that circuit. Enter the size of the induced emf in millivolts (mV), then the total charge that flows round the circuit during the ${n(dt)} s, in millicoulombs (mC, 1 mC = 10⁻³ C). Give each to 2 decimal places and type numbers without commas.`,
  answer: [r2(emf), r2(Q)],
  hints: ['The area of one turn is the length times the width, in square metres (1 m² = 10 000 cm²). The flux through one turn changes by A × ΔB, and Faraday\'s law gives an emf of size N × ΔΦ/Δt.', 'The circuit\'s total resistance is the coil plus the resistor in series, so the current is the emf divided by that total. Current is charge per second, so the charge that flows in a time Δt is the current times Δt (milliamperes times seconds gives millicoulombs).'],
  solution: `One turn has area ${n(w)} cm × ${n(h)} cm = ${n(A)} m². The flux through it falls by ΔΦ = ${n(A)} × ${n(b)} mT = ${n(dP)} mWb. Faraday's law gives an emf of size N × ΔΦ/Δt = ${n(N)} × ${n(dP)} ÷ ${n(dt)}, which is ${is2(emf, 'mV')}. The circuit's resistance is ${n(Rc)} + ${n(Rs)} = ${n(Rt)} Ω, so the current is I = emf/R, which is ${is2(I, 'mA')}. The charge that flows in ${n(dt)} s is Q = I × Δt, which is ${is2(Q, 'mC')}.`,
  guidance: [
   { prompt: `One turn has area ${n(A)} m² and the field falls by ${n(b)} mT. Using Faraday's law with ${n(N)} turns over ${n(dt)} s, what is the size of the emf, in mV, to 2 decimal places?`, answer: [r2(emf)], explanation: `ΔΦ = ${n(A)} × ${n(b)} = ${n(dP)} mWb, and N × ΔΦ/Δt = ${n(N)} × ${n(dP)} ÷ ${n(dt)}, which is ${is2(emf, 'mV')}.` },
   { prompt: `The coil (${n(Rc)} Ω) and the resistor (${n(Rs)} Ω) are in series. What current flows, in mA, to 2 decimal places?`, answer: [r2(I)], explanation: `The total resistance is ${n(Rt)} Ω, and I = emf/R, which is ${is2(I, 'mA')}.` },
   { prompt: `The current flows steadily for ${n(dt)} s. How much charge flows round the circuit, in mC, to 2 decimal places?`, answer: [r2(Q)], explanation: `Q = I × Δt, which is ${is2(Q, 'mC')}.` }
  ] }; }
});

mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q34', title: 'A sensing coil inside the gate',
 brief: 'A small sensing coil sits inside the coil gate to report changes in its current, and Mira wants the change in field, the signal and which way the sensing current runs.',
 labels: ['change in field (mT)', 'emf (mV)', 'clockwise 1, anticlockwise −1'], tolerance: 0.005,
 gl: [['change in field (mT)'], ['emf (mV)'], ['clockwise 1, anticlockwise −1']]
}, {
 /* Solenoid n turns per metre (a multiple of 100); its current changes steadily from i1 to i2 A over dt s, in the sense cc (true: anticlockwise seen from above, so
    its field points up). Sensing coil: N2 turns, a cm². ΔB = 4π × 10⁻⁴ n |Δi| mT; emf = N2 (a/10⁴) ΔB ÷ dt mV. The induced current opposes the change in the
    upward (or downward) flux: direction = (cc ? 1 : −1) × (growing ? 1 : −1), with 1 clockwise. */
 canonical: { n: 2000, i1: 1, i2: 5, dt: 0.5, N2: 60, a: 25, cc: true },
 draw: R => retry(R, R => ({ n: 100 * R.int(10, 50), i1: R.int(0, 8), i2: R.int(0, 8), dt: R.pick(DTS), N2: 10 * R.int(2, 15), a: R.int(5, 40), cc: R.bool() }), p => {
  if (p.i1 === p.i2) return false; const dB = 4 * Math.PI * 1e-4 * p.n * Math.abs(p.i2 - p.i1), emf = p.N2 * p.a / 1e4 * dB / p.dt;
  return emf >= 0.5 && emf < 90000 && allSafe([dB, emf]) && same2(r2(p.N2 * p.a / 1e4 * r2(dB) / p.dt), r2(emf)) && !(p.n === 1000 && p.i1 === 0 && p.i2 === 1); }, { n: 2000, i1: 1, i2: 5, dt: 0.5, N2: 60, a: 25, cc: true }),
 build: ({ n: nn, i1, i2, dt, N2, a, cc }) => { const dI = Math.abs(i2 - i1), grow = i2 > i1, dB = 4 * Math.PI * 1e-4 * nn * dI, A = a / 1e4, emf = N2 * A * dB / dt, dir = (cc ? 1 : -1) * (grow ? 1 : -1);
  const fieldDir = cc ? 'up' : 'down', flipped = cc ? 'down' : 'up'; return {
  prompt: `The Ore Sorter's coil gate is a long solenoid with ${n(nn)} turns per metre, standing with its axis vertical. Its current runs ${cc ? 'anticlockwise' : 'clockwise'} seen from above, which makes a field pointing ${fieldDir} along the axis. Over ${n(dt)} s the current changes steadily from ${n(i1)} A to ${n(i2)} A. A small sensing coil of ${n(N2)} turns, each enclosing ${n(a)} cm², lies flat inside the solenoid with its axis along the solenoid's axis. Take μ₀ = 4π × 10⁻⁷ T·m/A and treat the solenoid as long. Enter the size of the change in the field inside the solenoid in millitesla (mT, 1 mT = 10⁻³ T), then the size of the emf induced in the sensing coil in millivolts (mV), each to 2 decimal places. Then enter the direction of the current induced in the sensing coil, seen from above: 1 for clockwise, −1 for anticlockwise. Work from unrounded values and type numbers without commas.`,
  answer: [r2(dB), r2(emf), dir],
  hints: ['Inside a long solenoid B = μ₀nI, so the field changes by μ₀n times the change in current. The sensing coil lies across the field, so the flux through each turn changes by the area times the change in B (1 cm² = 10⁻⁴ m²).', 'Faraday\'s law gives the size of the emf: N × ΔΦ/Δt. For the direction, Lenz\'s law says the induced current opposes the change in flux: if the flux through the coil is growing the induced field points against it, and if it is shrinking the induced field points along it. Then use the right hand for a loop.'],
  solution: `The field changes by ΔB = μ₀n × ΔI = 4π × 10⁻⁷ × ${n(nn)} × ${n(dI)} T, which is ${is2(dB, 'mT')}. Each turn of the sensing coil encloses ${n(a)} cm² = ${n(A)} m², so the flux through it changes by ΔΦ = ${n(A)} × ${n(dB)} mT ${ap(A * dB)} ${n(A * dB)} mWb. Faraday's law: emf = N × ΔΦ/Δt = ${n(N2)} × ${n(A * dB)} ÷ ${n(dt)}, using the unrounded ΔΦ, which is ${is2(emf, 'mV')}. The solenoid's current ${grow ? 'grows' : 'shrinks'}, so the ${fieldDir === 'up' ? 'upward' : 'downward'} flux is ${grow ? 'growing' : 'shrinking'}. By Lenz's law the induced current makes a field pointing ${grow ? flipped : fieldDir}. With your right thumb pointing ${grow ? flipped : fieldDir}, your fingers curl ${dir === 1 ? 'clockwise' : 'anticlockwise'} seen from above: ${n(dir)}.`,
  guidance: [
   { prompt: `Inside the solenoid B = μ₀nI. By how much does the field change when the current changes by ${n(dI)} A, in mT, to 2 decimal places? Enter the size.`, answer: [r2(dB)], explanation: `ΔB = 4π × 10⁻⁷ × ${n(nn)} × ${n(dI)} T, which is ${is2(dB, 'mT')}.` },
   { prompt: `The sensing coil has ${n(N2)} turns, each of area ${n(A)} m². Using the unrounded change in field and Faraday's law over ${n(dt)} s, what is the size of the emf, in mV, to 2 decimal places?`, answer: [r2(emf)], explanation: `emf = N × A × ΔB/Δt = ${n(N2)} × ${n(A)} × ${n(dB)} ÷ ${n(dt)}, which is ${is2(emf, 'mV')}.` },
   { prompt: `The solenoid's field points ${fieldDir} and its current is ${grow ? 'growing' : 'shrinking'}. Which way does the induced current run in the sensing coil, seen from above? Enter 1 for clockwise, −1 for anticlockwise.`, answer: [dir], explanation: `The flux is ${grow ? 'growing' : 'shrinking'}, so the induced field points ${grow ? flipped : fieldDir}. With your right thumb pointing ${grow ? flipped : fieldDir}, your fingers curl ${dir === 1 ? 'clockwise' : 'anticlockwise'} seen from above.` }
  ] }; }
});

})();
