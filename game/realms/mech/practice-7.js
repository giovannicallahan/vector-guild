/* Mechanics: motion and force practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p7.js. */
(function(){
'use strict';
/* "a" or "an" before a number as it is read aloud: an 8, an 80, an 11, an 18, an 18000; a 7, a 110. cap gives "A"/"An". */
const aN = (x, cap) => { const d = String(Math.round(Math.abs(x))), v = d[0] === '8' || ((d.startsWith('11') || d.startsWith('18')) && d.length % 3 === 2); return (cap ? 'A' : 'a') + (v ? 'n' : ''); };
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const c6 = x => Math.round(x * 1e6) / 1e6;
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer.map(c6), hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((s, i) => ({ prompt: s.prompt, answer: s.answer.map(c6), labels: gl[i], explanation: s.explanation })) }, gen);
};
const g = 9.8;
/* Rounding to 2 decimal places, and "=" or "≈" before a value that is (or is not) exactly its 2-place form. */
const rd = x => Math.round(x * 100) / 100;
const exact = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
const eq = x => exact(x) ? '=' : '≈';
/* Away from a rounding tie in the third decimal place (no 3.125 to round to 2 places). */
const offTie = x => { const s = Math.abs(x) * 100, f = s - Math.floor(s); return Math.abs(f - 0.5) > 0.02; };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (R, make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return { ...canonical }; };
const MUS = [0.1, 0.15, 0.2, 0.25, 0.3];

/* ---- q31 Conservation of mechanical energy, with and without friction [8.3] ---- */

/* q31b: the sample runs the other way. A squeezed spring launches a pod across a rough strip and up a frictionless ramp.
   m, k and d are whole numbers, x is in tenths and μ is one of five tidy values, so every energy has at most 2 decimals.
   Friction takes at most 75% of the spring's energy. */
mk({ id: 'q31b', parent: 'q31', kind: 'setting', title: 'Launching a pod from the spring',
 brief: 'The launcher spring at the Docking Ring is wound back, and the riggers want to know how fast the pod leaves the strip and how high up the ramp it will go.',
 labels: ['speed at the foot of the ramp (m/s)', 'height reached above the floor (m)'], tolerance: 0.005,
 gl: [['energy stored in the spring (J)'], ['kinetic energy at the foot of the ramp (J)'], ['speed at the foot of the ramp (m/s)'], ['height reached (m)']] }, {
 canonical: { m: 40, k: 2500, x: 0.8, d: 4, mu: 0.2 },
 draw: R => tryDraw(R, R => ({ m: R.int(20, 60), k: 500 * R.int(2, 8), x: R.int(4, 12) / 10, d: R.int(2, 6), mu: R.pick(MUS) }),
  p => { const Es = p.k * p.x * p.x / 2, K = Es - p.mu * p.m * g * p.d; return K >= 0.25 * Es && offTie(Math.sqrt(2 * K / p.m)) && offTie(K / (p.m * g)); }, { m: 40, k: 2500, x: 0.8, d: 4, mu: 0.2 }),
 build: ({ m, k, x, d, mu }) => { const Es = k * x * x / 2, Wf = mu * m * g * d, K = Es - Wf, v = Math.sqrt(2 * K / m), h = K / (m * g); return {
  prompt: `At the Docking Ring a spring launcher fires cargo pods along a level track. A pod of mass ${n(m)} kg is pushed against the launcher’s spring (spring constant k = ${n(k)} N/m), squeezing it by ${n(x)} m from its natural length, and is released from rest. The floor under the spring is frictionless, and the pod leaves the spring when it is back at its natural length. The pod then crosses a rough strip ${n(d)} m long, where the coefficient of kinetic friction is μ = ${n(mu)} and the friction force is μmg, and slides on to a frictionless ramp, which it climbs until it stops. Take g = 9.8 m/s². Enter the pod’s speed at the foot of the ramp in metres per second, then the height it reaches above the floor in metres, both to 2 decimal places (work the height from the unrounded energy).`,
  answer: [rd(v), rd(h)],
  hints: ['The squeezed spring stores ½kx² and hands all of it to the pod as it returns to its natural length. Friction on the strip takes away μmg × the length of the strip.', 'What is left at the foot of the ramp is kinetic energy ½mv². Climbing the frictionless ramp turns all of it into mgh, and the pod stops when none is left.'],
  solution: `The spring stores ½kx² = ½ × ${n(k)} × ${n(x)}² = ${n(Es)} J, and the pod takes all of it. Friction on the strip takes μmgd = ${n(mu)} × ${n(m)} × 9.8 × ${n(d)} = ${n(Wf)} J, leaving ${n(Es)} − ${n(Wf)} = ${n(K)} J of kinetic energy at the foot of the ramp. So ½ × ${n(m)} × v² = ${n(K)}, and v = √(2 × ${n(K)} ÷ ${n(m)}) ${eq(v)} ${n(rd(v))} m/s. On the frictionless ramp all of that energy becomes mgh: ${n(m)} × 9.8 × h = ${n(K)}, so h = ${n(K)} ÷ (${n(m)} × 9.8) ${eq(h)} ${n(rd(h))} m.`,
  guidance: [
   { prompt: `How much energy does the spring store when it is squeezed by ${n(x)} m (½kx²), in joules?`, answer: [Es], explanation: `½ × ${n(k)} × ${n(x)}² = ${n(Es)} J. The pod is released from rest, so this is all the energy it starts with.` },
   { prompt: `Friction takes μmg × ${n(d)} m from that energy on the rough strip. How much kinetic energy is left at the foot of the ramp, in joules?`, answer: [K], explanation: `Friction takes ${n(mu)} × ${n(m)} × 9.8 × ${n(d)} = ${n(Wf)} J, so ${n(Es)} − ${n(Wf)} = ${n(K)} J is left.` },
   { prompt: `What speed does ${n(K)} J of kinetic energy give ${aN(m)} ${n(m)} kg pod, in m/s to 2 decimal places?`, answer: [rd(v)], explanation: `½ × ${n(m)} × v² = ${n(K)}, so v = √(2 × ${n(K)} ÷ ${n(m)}) ${eq(v)} ${n(rd(v))} m/s.` },
   { prompt: `On the frictionless ramp all of that kinetic energy becomes mgh. What height does the pod reach, in metres to 2 decimal places?`, answer: [rd(h)], explanation: `${n(m)} × 9.8 × h = ${n(K)}, so h = ${n(K)} ÷ (${n(m)} × 9.8) ${eq(h)} ${n(rd(h))} m.` }
  ] }; }
});

/* q31c: a sled pushed over a ramp top, then a rough floor to a stop. The speed, the stopping distance and the heat.
   m is whole and h is in halves, so the total energy has at most 1 decimal. The stopping distance is 3 to 40 m. */
mk({ id: 'q31c', parent: 'q31', kind: 'applied', title: 'How far will the sled skid?',
 brief: 'A loaded sled has gone over the top of the loading ramp with a shove, and the crew must know where on the floor it will come to rest.',
 labels: ['speed at the bottom (m/s)', 'distance slid on the floor (m)', 'energy turned into heat (J)'], tolerance: 0.005,
 gl: [['total mechanical energy at the top (J)'], ['speed at the bottom (m/s)'], ['distance slid (m)']] }, {
 canonical: { m: 50, h: 2.5, v0: 2, mu: 0.25 },
 draw: R => tryDraw(R, R => ({ m: R.int(20, 80), h: R.int(2, 10) / 2, v0: R.int(1, 4), mu: R.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4]) }),
  p => { const E = p.m * g * p.h + p.m * p.v0 * p.v0 / 2, d = E / (p.mu * p.m * g); return d >= 3 && d <= 40 && offTie(Math.sqrt(p.v0 * p.v0 + 2 * g * p.h)) && offTie(d); }, { m: 50, h: 2.5, v0: 2, mu: 0.25 }),
 build: ({ m, h, v0, mu }) => { const U = m * g * h, K0 = m * v0 * v0 / 2, E = U + K0, v = Math.sqrt(v0 * v0 + 2 * g * h), F = mu * m * g, d = E / F; return {
  prompt: `A loaded sled of mass ${n(m)} kg passes the top of a frictionless ramp, ${n(h)} m above the Docking Ring floor, moving down the ramp at ${n(v0)} m/s. At the bottom it slides on to level floor where the coefficient of kinetic friction is μ = ${n(mu)} (the friction force is μmg, μ times the sled’s weight), and it slides until it stops. Take g = 9.8 m/s². Enter the sled’s speed at the bottom of the ramp in metres per second, then the distance it slides along the floor before it stops in metres, then the energy that friction turns into heat in joules, all to 2 decimal places (use unrounded values in the later answers). Type the numbers without commas.`,
  answer: [rd(v), rd(d), E],
  hints: ['At the top the sled has potential energy mgh and kinetic energy ½mv² for the speed it already has. Nothing is lost on the frictionless ramp, so all of it is still there at the bottom.', 'On the floor friction takes away μmg × the distance slid, and the sled stops when the energy it had at the bottom is used up. The sled ends at rest on the floor, so friction turns the whole of its starting mechanical energy into heat.'],
  solution: `At the top U = mgh = ${n(m)} × 9.8 × ${n(h)} = ${n(U)} J and K = ½ × ${n(m)} × ${n(v0)}² = ${n(K0)} J, so the sled has ${n(E)} J in all. The ramp is frictionless, so at the bottom it is all kinetic: v = √(${n(v0)}² + 2 × 9.8 × ${n(h)}) ${eq(v)} ${n(rd(v))} m/s. On the floor the friction force is μmg = ${n(mu)} × ${n(m)} × 9.8 = ${n(F)} N, and it takes away all ${n(E)} J before the sled stops: ${n(F)} × d = ${n(E)}, so d = ${n(E)} ÷ ${n(F)} ${eq(d)} ${n(rd(d))} m. All ${n(E)} J of mechanical energy ends up as heat.`,
  guidance: [
   { prompt: `What is the sled’s total mechanical energy at the top of the ramp, mgh plus ½mv², in joules?`, answer: [E], explanation: `U = ${n(m)} × 9.8 × ${n(h)} = ${n(U)} J and K = ½ × ${n(m)} × ${n(v0)}² = ${n(K0)} J, so ${n(E)} J. The ramp has no friction, so this is the energy at the bottom too.` },
   { prompt: `At the bottom all ${n(E)} J is kinetic energy ½mv². What is the speed, in m/s to 2 decimal places?`, answer: [rd(v)], explanation: `½ × ${n(m)} × v² = ${n(E)}, so v = √(${n(v0)}² + 2 × 9.8 × ${n(h)}) ${eq(v)} ${n(rd(v))} m/s.` },
   { prompt: `Friction on the floor takes ${n(mu)} × ${n(m)} × 9.8 = ${n(F)} N × the distance slid, until all ${n(E)} J is gone. What is the distance, in metres to 2 decimal places?`, answer: [rd(d)], explanation: `${n(F)} × d = ${n(E)}, so d = ${n(E)} ÷ ${n(F)} ${eq(d)} ${n(rd(d))} m.` }
  ] }; }
});

/* q31d: the sled bounces back off the spring (an ideal spring), crosses the strip a second time and climbs the ramp.
   Starts with a push (v0). Friction takes at most 85% of the starting energy over the two crossings. */
mk({ id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q27', title: 'The sled that comes back',
 brief: 'The buffer spring is ideal, so the sled will not stay put: the riggers want to know how far it squeezes the spring and how high it climbs back up the ramp.',
 labels: ['greatest spring compression (m)', 'height reached on the way back (m)'], tolerance: 0.005,
 gl: [['total energy at the top (J)'], ['greatest spring compression (m)'], ['energy at the foot of the ramp on the way back (J)'], ['height reached on the way back (m)']] }, {
 canonical: { m: 40, h: 3, v0: 2, d: 3, mu: 0.2, k: 4000 },
 draw: R => tryDraw(R, R => ({ m: R.int(20, 60), h: R.int(4, 10) / 2, v0: R.int(1, 3), d: R.int(2, 5), mu: R.pick(MUS), k: 500 * R.int(4, 12) }),
  p => { const E0 = p.m * g * p.h + p.m * p.v0 * p.v0 / 2, Wf = p.mu * p.m * g * p.d, E1 = E0 - Wf, E2 = E0 - 2 * Wf; return 2 * Wf <= 0.85 * E0 && offTie(Math.sqrt(2 * E1 / p.k)) && offTie(E2 / (p.m * g)); }, { m: 40, h: 3, v0: 2, d: 3, mu: 0.2, k: 4000 }),
 build: ({ m, h, v0, d, mu, k }) => { const U = m * g * h, K0 = m * v0 * v0 / 2, E0 = U + K0, Wf = mu * m * g * d, E1 = E0 - Wf, x = Math.sqrt(2 * E1 / k), E2 = E1 - Wf, h2 = E2 / (m * g); return {
  prompt: `A cargo sled of mass ${n(m)} kg passes the top of a frictionless loading ramp, ${n(h)} m above the floor, moving down the ramp at ${n(v0)} m/s. At the foot of the ramp it crosses a rough strip ${n(d)} m long (μ = ${n(mu)}, friction force μmg), then runs into a buffer spring with spring constant k = ${n(k)} N/m on frictionless floor. The spring is ideal: it gives back all the energy it stores, so it pushes the sled back across the same rough strip and up the ramp until the sled stops. Take g = 9.8 m/s². Enter the greatest compression of the spring in metres, then the height above the floor that the sled reaches on its way back up the ramp in metres, both to 2 decimal places (use unrounded values).`,
  answer: [rd(x), rd(h2)],
  hints: ['Count the energy at the top as mgh plus ½mv². Each crossing of the rough strip takes away μmg × the length of the strip, and the spring stores ½kx² with whatever is left when the sled stops.', 'The ideal spring gives back everything it stored, so the sled leaves it with the energy it had when it stopped. It then loses the same friction energy again on the strip, and what is left at the foot of the ramp becomes mgh.'],
  solution: `At the top the sled has mgh + ½mv² = ${n(m)} × 9.8 × ${n(h)} + ½ × ${n(m)} × ${n(v0)}² = ${n(U)} + ${n(K0)} = ${n(E0)} J. Each crossing of the strip takes μmgd = ${n(mu)} × ${n(m)} × 9.8 × ${n(d)} = ${n(Wf)} J. At the greatest squeeze the sled is still, so the spring holds ${n(E0)} − ${n(Wf)} = ${n(E1)} J: ½ × ${n(k)} × x² = ${n(E1)}, giving x = √(2 × ${n(E1)} ÷ ${n(k)}) ${eq(x)} ${n(rd(x))} m. The spring returns all ${n(E1)} J, and the second crossing takes another ${n(Wf)} J, so ${n(E1)} − ${n(Wf)} = ${n(E2)} J reaches the foot of the ramp. There it all becomes mgh: ${n(m)} × 9.8 × h = ${n(E2)}, so h = ${n(E2)} ÷ (${n(m)} × 9.8) ${eq(h2)} ${n(rd(h2))} m.`,
  guidance: [
   { prompt: `What is the sled’s total mechanical energy at the top of the ramp, mgh plus ½mv², in joules?`, answer: [E0], explanation: `${n(m)} × 9.8 × ${n(h)} + ½ × ${n(m)} × ${n(v0)}² = ${n(U)} + ${n(K0)} = ${n(E0)} J.` },
   { prompt: `One crossing of the strip takes ${n(mu)} × ${n(m)} × 9.8 × ${n(d)} = ${n(Wf)} J. What is the greatest compression of the spring, in metres to 2 decimal places?`, answer: [rd(x)], explanation: `The spring holds ${n(E0)} − ${n(Wf)} = ${n(E1)} J when the sled stops, so ½ × ${n(k)} × x² = ${n(E1)} and x ${eq(x)} ${n(rd(x))} m.` },
   { prompt: `The spring gives back all the energy it stored, and the strip takes ${n(Wf)} J again. How much energy does the sled have at the foot of the ramp on the way back, in joules?`, answer: [E2], explanation: `${n(E1)} − ${n(Wf)} = ${n(E2)} J.` },
   { prompt: `On the frictionless ramp that energy becomes mgh. What height does the sled reach, in metres to 2 decimal places?`, answer: [rd(h2)], explanation: `${n(m)} × 9.8 × h = ${n(E2)}, so h = ${n(E2)} ÷ (${n(m)} × 9.8) ${eq(h2)} ${n(rd(h2))} m.` }
  ] }; }
});

/* ---- q32 Momentum and impulse [9.1, 9.2] ---- */

/* q32b: a canister falls on a landing pad and bounces up; upward is positive. m is whole and the speeds are whole, so
   every momentum is whole and the force has at most 2 decimals. Not the worked example (80 kg, 2 m/s, 1 m/s, 0.5 s). */
mk({ id: 'q32b', parent: 'q32', kind: 'setting', title: 'Sample canister on the landing pad',
 brief: 'A sample canister has dropped on to the landing pad and bounced, and the pad’s makers want the push it took.',
 labels: ['momentum after the bounce (kg·m/s)', 'impulse (N·s)', 'average force (N)'], tolerance: 0.005,
 gl: [['momentum before (kg·m/s)'], ['momentum after (kg·m/s)'], ['impulse (N·s)'], ['average force (N)']] }, {
 canonical: { m: 6, v1: 5, v2: 3, dt: 0.05 },
 draw: R => tryDraw(R, R => ({ m: R.int(2, 20), v1: R.int(3, 9), v2: R.int(1, 7), dt: R.pick([0.02, 0.04, 0.05, 0.1, 0.2, 0.25]) }),
  p => p.v2 < p.v1, { m: 6, v1: 5, v2: 3, dt: 0.05 }),
 build: ({ m, v1, v2, dt }) => { const pb = -m * v1, pa = m * v2, J = pa - pb, F = J / dt; return {
  prompt: `A sample canister of mass ${n(m)} kg falls on to the Docking Ring’s landing pad at ${n(v1)} m/s, presses into the pad for ${n(dt)} s and bounces straight up at ${n(v2)} m/s. Take upward as positive, so the velocity before the bounce is ${n(-v1)} m/s. During the short contact the pad’s push is the only force that matters, so ignore the canister’s weight. Enter the canister’s momentum just after the bounce in kilogram metres per second (kg·m/s), then the impulse the pad gives it in newton seconds (N·s), then the average force of the pad on it in newtons (N). Signs matter; type the numbers without commas.`,
  answer: [pa, J, F],
  hints: ['Upward is positive, so the velocity before the bounce is negative and the velocity after is positive. Momentum is p = mv.', 'The impulse is the momentum after minus the momentum before. The average force is the impulse divided by the contact time.'],
  solution: `Before: p = ${n(m)} × ${par(-v1)} = ${n(pb)} kg·m/s. After: p = ${n(m)} × ${n(v2)} = ${n(pa)} kg·m/s. The impulse is the change in momentum: ${n(pa)} − ${par(pb)} = ${n(J)} N·s. The average force is impulse ÷ contact time = ${n(J)} ÷ ${n(dt)} = ${n(F)} N. It is positive because the pad pushes the canister upward.`,
  guidance: [
   { prompt: `What is the canister’s momentum just before it touches the pad, ${n(m)} × ${par(-v1)}, in kg·m/s?`, answer: [pb], explanation: `p = mv = ${n(m)} × ${par(-v1)} = ${n(pb)} kg·m/s. It is negative because the canister is moving downward.` },
   { prompt: `What is its momentum just after the bounce, with velocity ${n(v2)} m/s, in kg·m/s?`, answer: [pa], explanation: `p = ${n(m)} × ${n(v2)} = ${n(pa)} kg·m/s, positive because the canister now moves upward.` },
   { prompt: `The impulse is the change in momentum, final minus initial. What is it, in N·s?`, answer: [J], explanation: `${n(pa)} − ${par(pb)} = ${n(J)} N·s.` },
   { prompt: `Divide the impulse by the contact time of ${n(dt)} s. What is the average force, in N?`, answer: [F], explanation: `${n(J)} ÷ ${n(dt)} = ${n(F)} N, upward.` }
  ] }; }
});

/* q32c: a buffer rated for a greatest average force; the least contact time. The draw keeps the time at a whole
   number of hundredths, between 0.05 s and 1.5 s. */
mk({ id: 'q32c', parent: 'q32', kind: 'applied', title: 'Rating the landing buffer',
 brief: 'A landing buffer is rated for a greatest push, and the crew wants to know how softly a pod must be brought to rest on it.',
 labels: ['size of the impulse (N·s)', 'shortest contact time (s)'], tolerance: 0.005,
 gl: [['momentum before (kg·m/s)'], ['size of the impulse (N·s)'], ['shortest contact time (s)']] }, {
 canonical: { m: 150, v1: 2, v2: 1, F: 3000 },
 draw: R => tryDraw(R, R => ({ m: 10 * R.int(5, 25), v1: R.int(2, 10) / 2, v2: R.int(1, 8) / 2, F: R.pick([1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000]) }),
  p => { const t = p.m * (p.v1 + p.v2) / p.F; return p.v2 < p.v1 && exact(t) && t >= 0.05 && t <= 1.5 && !(p.m === 120 && p.v1 === 3); }, { m: 150, v1: 2, v2: 1, F: 3000 }),
 build: ({ m, v1, v2, F }) => { const p1 = m * v1, pf = -m * v2, J = p1 + m * v2, t = J / F; return {
  prompt: `A buffer on the Docking Ring’s landing pad is rated to push on a pod with an average force of no more than ${n(F)} N. ${aN(m, true)} ${n(m)} kg pod drifts towards the buffer at ${n(v1)} m/s and bounces straight back at ${n(v2)} m/s. Take the direction towards the buffer as positive, so the velocity after the bounce is ${n(-v2)} m/s. Enter the size of the impulse the buffer gives the pod in newton seconds (N·s), then the shortest contact time in seconds for which the average force stays within the rating, to 2 decimal places. Type the numbers without commas.`,
  answer: [J, rd(t)],
  hints: ['A bounce reverses the velocity, so the momentum goes from mv to −mv′ for the speeds before and after. The change has size m(v + v′).', 'The average force is the impulse divided by the contact time. A longer contact means a smaller force, so the shortest allowed time is the one that just reaches the rating.'],
  solution: `Before: p = ${n(m)} × ${n(v1)} = ${n(p1)} kg·m/s. After: p = ${n(m)} × ${par(-v2)} = ${n(pf)} kg·m/s. The change in momentum is ${n(pf)} − ${n(p1)} = ${n(-J)} N·s, so the impulse has size ${n(J)} N·s. The average force is the impulse ÷ the contact time, so the force reaches the rating of ${n(F)} N when the time is ${n(J)} ÷ ${n(F)} ${eq(t)} ${n(rd(t))} s. A shorter contact would push harder than the rating.`,
  guidance: [
   { prompt: `What is the pod’s momentum before it touches the buffer, ${n(m)} × ${n(v1)}, in kg·m/s?`, answer: [p1], explanation: `p = mv = ${n(m)} × ${n(v1)} = ${n(p1)} kg·m/s.` },
   { prompt: `After the bounce the velocity is ${n(-v2)} m/s. What is the size of the change in momentum, which is the size of the impulse, in N·s?`, answer: [J], explanation: `The momentum after is ${n(m)} × ${par(-v2)} = ${n(pf)} kg·m/s, and ${n(pf)} − ${n(p1)} = ${n(-J)} N·s. Its size is ${n(J)} N·s.` },
   { prompt: `The impulse divided by the contact time is the average force, so the time is the impulse divided by the rating of ${n(F)} N. What is the shortest time, in seconds to 2 decimal places?`, answer: [rd(t)], explanation: `${n(J)} ÷ ${n(F)} ${eq(t)} ${n(rd(t))} s.` }
  ] }; }
});

/* q32d: a capsule dropped from h1 bounces to h2. Speeds from energy (the rule is given in the prompt); impulse and force
   from the unrounded speeds. Mixes in q31 (mgh becomes ½mv²). */
mk({ id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q31', title: 'Dropped on the hard pad',
 brief: 'A sample capsule is let fall on to a hard pad and bounces back up, and the engineers want the push the pad gave it from nothing but the two heights.',
 labels: ['speed just before impact (m/s)', 'impulse (N·s)', 'average force (N)'], tolerance: 0.005,
 gl: [['speed just before impact (m/s)'], ['speed just after the bounce (m/s)'], ['impulse (N·s)'], ['average force (N)']] }, {
 canonical: { m: 4, h1: 2.5, h2: 0.9, dt: 0.05 },
 draw: R => tryDraw(R, R => ({ m: R.int(2, 12), h1: R.int(10, 50) / 10, h2: R.int(2, 8) / 10, dt: R.pick([0.05, 0.1, 0.2, 0.25, 0.4]) }),
  p => { const vi = Math.sqrt(2 * g * p.h1), vo = Math.sqrt(2 * g * p.h2), J = p.m * (vi + vo); return offTie(vi) && offTie(J) && offTie(J / p.dt); }, { m: 4, h1: 2.5, h2: 0.9, dt: 0.05 }),
 build: ({ m, h1, h2, dt }) => { const vi = Math.sqrt(2 * g * h1), vo = Math.sqrt(2 * g * h2), pb = -m * vi, pa = m * vo, J = pa - pb, F = J / dt; return {
  prompt: `A sample capsule of mass ${n(m)} kg is released from rest ${n(h1)} m above a hard landing pad on the Docking Ring. Energy is kept while it falls or rises freely, so a body that has dropped through a height h from rest has speed √(2gh), and a body that rises to a height h before it stops left the ground at speed √(2gh). The capsule hits the pad, stays in contact with it for ${n(dt)} s and bounces back up to ${n(h2)} m above the pad. Take g = 9.8 m/s² and upward as positive, and ignore the capsule’s weight during the short contact. Enter its speed just before it hits the pad in metres per second, then the impulse the pad gives it in newton seconds (N·s), then the average force of the pad on it in newtons (N), all to 2 decimal places (use the unrounded speeds and the unrounded impulse). Type the numbers without commas.`,
  answer: [rd(vi), rd(J), rd(F)],
  hints: ['Turn each height into a speed with √(2gh): the fall gives the speed on arrival, and the rise gives the speed on leaving. The speed on arrival goes into the momentum before as a negative velocity.', 'The impulse is the momentum after minus the momentum before, which is m × (speed after + speed before) here. The average force is the impulse divided by the contact time.'],
  solution: `Speed on arrival: v = √(2 × 9.8 × ${n(h1)}) ${eq(vi)} ${n(rd(vi))} m/s, so the velocity is −${n(rd(vi))} m/s downward. To rise ${n(h2)} m the capsule must leave the pad at √(2 × 9.8 × ${n(h2)}) ${eq(vo)} ${n(rd(vo))} m/s upward. The impulse is the change in momentum, m × (speed after + speed before) ${eq(J)} ${n(rd(J))} N·s, worked from the unrounded speeds. The average force is the unrounded impulse ÷ ${n(dt)} ${eq(F)} ${n(rd(F))} N, upward.`,
  guidance: [
   { prompt: `The capsule drops ${n(h1)} m from rest. What is its speed on arrival, √(2gh), in m/s to 2 decimal places?`, answer: [rd(vi)], explanation: `√(2 × 9.8 × ${n(h1)}) ${eq(vi)} ${n(rd(vi))} m/s, downward.` },
   { prompt: `To rise ${n(h2)} m it must leave the pad at √(2gh) for h = ${n(h2)} m. What is that speed, in m/s to 2 decimal places?`, answer: [rd(vo)], explanation: `√(2 × 9.8 × ${n(h2)}) ${eq(vo)} ${n(rd(vo))} m/s, upward.` },
   { prompt: `The velocity goes from −(arrival speed) to +(leaving speed), so the impulse is m × (the two speeds added). What is it, in N·s to 2 decimal places, from the unrounded speeds?`, answer: [rd(J)], explanation: `${n(m)} × (speed after + speed before) ${eq(J)} ${n(rd(J))} N·s, from the unrounded speeds.` },
   { prompt: `Divide the unrounded impulse (not the 2-decimal value) by the contact time of ${n(dt)} s. What is the average force, in N to 2 decimal places?`, answer: [rd(F)], explanation: `${n(m)} × (speed after + speed before) ÷ ${n(dt)} ${eq(F)} ${n(rd(F))} N, from the unrounded impulse.` }
  ] }; }
});

/* ---- q33 Conservation of momentum: sticking and elastic collisions [9.3, 9.4] ---- */

/* q33b: a tug catches a slower trailer going the same way and couples. Masses are hundreds of kg, speeds whole; the
   common velocity has at most 2 decimals. v1 − v2 is never 2, which would make the energy lost equal the impulse. */
mk({ id: 'q33b', parent: 'q33', kind: 'setting', title: 'Coupling the tug and trailer',
 brief: 'A tug is catching up with a loaded trailer on the Docking Ring rail, and the coupling must be rated for the knock it will take.',
 labels: ['common velocity (m/s)', 'impulse on the trailer (N·s)', 'kinetic energy lost (J)'], tolerance: 0.005,
 gl: [['total momentum (kg·m/s)'], ['common velocity (m/s)'], ['impulse on the trailer (N·s)'], ['kinetic energy lost (J)']] }, {
 canonical: { m1: 200, v1: 5, m2: 600, v2: 1 },
 draw: R => tryDraw(R, R => { const v1 = R.int(3, 8); return { m1: 100 * R.int(1, 8), v1, m2: 100 * R.int(1, 8), v2: R.int(1, v1 - 1) }; },
  p => exact((p.m1 * p.v1 + p.m2 * p.v2) / (p.m1 + p.m2)) && p.v1 - p.v2 !== 2, { m1: 200, v1: 5, m2: 600, v2: 1 }),
 build: ({ m1, v1, m2, v2 }) => { const P = m1 * v1 + m2 * v2, M = m1 + m2, vf = P / M, J = m2 * (vf - v2), Ki = m1 * v1 * v1 / 2 + m2 * v2 * v2 / 2, Kf = M * vf * vf / 2, loss = Ki - Kf; return {
  prompt: `A tug of mass ${n(m1)} kg is moving along the Docking Ring rail at ${n(v1)} m/s and catches up with a trailer of mass ${n(m2)} kg rolling the same way at ${n(v2)} m/s. The coupling snaps shut and the two move off as one. Take their direction of motion as positive; no outside force acts along the rail. Enter their common velocity in metres per second, then the impulse the coupling gives the trailer in newton seconds (its change in momentum), then the kinetic energy lost in the collision in joules, all to 2 decimal places. Type the numbers without commas.`,
  answer: [vf, J, loss],
  hints: ['Total momentum before, m₁v₁ + m₂v₂, equals total momentum after, (m₁ + m₂)v. Divide by the joined mass to get v.', 'The trailer’s impulse is its change in momentum, its mass times (v after − v before). The energy lost is the total ½mv² before minus ½(m₁ + m₂)v² after.'],
  solution: `Momentum before: ${n(m1)} × ${n(v1)} + ${n(m2)} × ${n(v2)} = ${n(P)} kg·m/s. The joined mass is ${n(M)} kg, so v = ${n(P)} ÷ ${n(M)} = ${n(vf)} m/s. The trailer’s momentum goes from ${n(m2)} × ${n(v2)} = ${n(m2 * v2)} to ${n(m2)} × ${n(vf)} = ${n(m2 * vf)} kg·m/s, so its impulse is ${n(m2 * vf)} − ${n(m2 * v2)} = ${n(J)} N·s. Kinetic energy before: ½ × ${n(m1)} × ${n(v1)}² + ½ × ${n(m2)} × ${n(v2)}² = ${n(Ki)} J. After: ½ × ${n(M)} × ${n(vf)}² = ${n(Kf)} J. Lost: ${n(Ki)} − ${n(Kf)} = ${n(loss)} J.`,
  guidance: [
   { prompt: `What is the total momentum of the tug and the trailer before the coupling, in kg·m/s?`, answer: [P], explanation: `${n(m1)} × ${n(v1)} + ${n(m2)} × ${n(v2)} = ${n(P)} kg·m/s.` },
   { prompt: `Divide by the joined mass of ${n(M)} kg. What is the common velocity, in m/s?`, answer: [vf], explanation: `v = ${n(P)} ÷ ${n(M)} = ${n(vf)} m/s.` },
   { prompt: `The trailer’s velocity changes from ${n(v2)} m/s to the common velocity. What is its change in momentum, the impulse on it, in N·s?`, answer: [J], explanation: `${n(m2)} × (${n(vf)} − ${n(v2)}) = ${n(J)} N·s.` },
   { prompt: `The total kinetic energy before is ${n(Ki)} J. The joined pair has ½ × ${n(M)} × ${n(vf)}². How much kinetic energy was lost, in joules?`, answer: [loss], explanation: `After: ½ × ${n(M)} × ${n(vf)}² = ${n(Kf)} J. Lost: ${n(Ki)} − ${n(Kf)} = ${n(loss)} J.` }
  ] }; }
});

/* q33c: a latch, then a slide to a stop on a rough floor (μ times the pair's weight). Pod B starts at rest.
   The common velocity is exact to 2 decimals; the distance is kept off rounding ties. Not the worked example (300 kg, 2 m/s, 100 kg). */
mk({ id: 'q33c', parent: 'q33', kind: 'applied', title: 'Sliding to a stop after the latch',
 brief: 'Two pods have latched on the Docking Ring floor, and the crew needs to know how much energy the latch took and how far the pair will slide before it stops.',
 labels: ['common velocity (m/s)', 'kinetic energy lost (J)', 'distance slid (m)'], tolerance: 0.005,
 gl: [['common velocity (m/s)'], ['kinetic energy lost (J)'], ['distance slid (m)']] }, {
 canonical: { m1: 500, v1: 4, m2: 300, mu: 0.2 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(2, 9), v1: R.int(2, 6), m2: 100 * R.int(2, 9), mu: R.pick(MUS) }),
  p => { const vf = p.m1 * p.v1 / (p.m1 + p.m2); return exact(vf) && offTie(vf * vf / (2 * p.mu * g)) && !(p.m1 === 300 && p.v1 === 2 && p.m2 === 100); }, { m1: 500, v1: 4, m2: 300, mu: 0.2 }),
 build: ({ m1, v1, m2, mu }) => { const P = m1 * v1, M = m1 + m2, vf = P / M, Ki = m1 * v1 * v1 / 2, Kf = M * vf * vf / 2, loss = Ki - Kf, F = mu * M * g, d = Kf / F; return {
  prompt: `A pod A of mass ${n(m1)} kg slides along the level Docking Ring floor at ${n(v1)} m/s into a pod B of mass ${n(m2)} kg that is at rest, and the two latch together. Friction can be ignored during the instant of latching, so momentum is kept. Afterwards the joined pair slides on, where the coefficient of kinetic friction is μ = ${n(mu)} (the friction force is μ times the pair’s total weight), until it stops. Take g = 9.8 m/s². Enter the pair’s common velocity just after latching in metres per second, then the kinetic energy lost in the latching in joules, then the distance the pair slides before it stops in metres, all to 2 decimal places. Type the numbers without commas.`,
  answer: [vf, loss, rd(d)],
  hints: ['Momentum is kept in the latching: m₁v₁ = (m₁ + m₂)v, because B starts at rest. The energy lost is the kinetic energy before minus the kinetic energy of the joined pair.', 'After the latch, friction takes away μ(m₁ + m₂)g × the distance, and the pair stops when all of its kinetic energy has gone. The total mass appears on both sides, so it cancels.'],
  solution: `Momentum: ${n(m1)} × ${n(v1)} = ${n(P)} kg·m/s, shared by ${n(M)} kg, so v = ${n(P)} ÷ ${n(M)} = ${n(vf)} m/s. Kinetic energy before: ½ × ${n(m1)} × ${n(v1)}² = ${n(Ki)} J. After: ½ × ${n(M)} × ${n(vf)}² = ${n(Kf)} J. Lost in the latching: ${n(Ki)} − ${n(Kf)} = ${n(loss)} J. The friction force on the pair is μ(m₁ + m₂)g = ${n(mu)} × ${n(M)} × 9.8 = ${n(F)} N, and it takes away all ${n(Kf)} J: ${n(F)} × d = ${n(Kf)}, so d = ${n(Kf)} ÷ ${n(F)} ${eq(d)} ${n(rd(d))} m.`,
  guidance: [
   { prompt: `Momentum is kept in the latching. Divide the momentum ${n(m1)} × ${n(v1)} by the joined mass of ${n(M)} kg. What is the common velocity, in m/s?`, answer: [vf], explanation: `v = ${n(P)} ÷ ${n(M)} = ${n(vf)} m/s.` },
   { prompt: `Before the latch only A moves, with ½ × ${n(m1)} × ${n(v1)}² = ${n(Ki)} J. How much kinetic energy was lost in the latching, in joules?`, answer: [loss], explanation: `After: ½ × ${n(M)} × ${n(vf)}² = ${n(Kf)} J. Lost: ${n(Ki)} − ${n(Kf)} = ${n(loss)} J.` },
   { prompt: `The friction force on the pair is ${n(mu)} × ${n(M)} × 9.8 = ${n(F)} N. It takes away all ${n(Kf)} J of the pair’s kinetic energy over the distance slid. What is that distance, in metres to 2 decimal places?`, answer: [rd(d)], explanation: `${n(F)} × d = ${n(Kf)}, so d = ${n(Kf)} ÷ ${n(F)} ${eq(d)} ${n(rd(d))} m.` }
  ] }; }
});

/* q33d: a head-on elastic collision, with the rule "speed of separation = speed of approach" given in the prompt.
   Both final velocities and the impulse on B have at most 2 decimals; the masses differ. Mixes in q32 (impulse). */
mk({ id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q32', title: 'Elastic bounce on the track',
 brief: 'Two pods on the Docking Ring track have rubber bumpers instead of latches, and the crew wants to know how they leave each other and what push each gave.',
 labels: ['A’s velocity after (m/s)', 'B’s velocity after (m/s)', 'impulse on B (N·s)'], tolerance: 0.005,
 gl: [['total momentum (kg·m/s)'], ['A’s velocity after (m/s)'], ['B’s velocity after (m/s)'], ['impulse on B (N·s)']] }, {
 canonical: { m1: 600, v1: 3, m2: 200, v2: 1 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), v1: R.int(2, 8) / 2, m2: 100 * R.int(1, 8), v2: R.int(-4, 3) / 2 }),
  p => { const M = p.m1 + p.m2, a = ((p.m1 - p.m2) * p.v1 + 2 * p.m2 * p.v2) / M, b = a + p.v1 - p.v2; return p.m1 !== p.m2 && p.v2 < p.v1 && exact(a) && exact(b) && exact(p.m2 * (b - p.v2)); }, { m1: 600, v1: 3, m2: 200, v2: 1 }),
 build: ({ m1, v1, m2, v2 }) => { const M = m1 + m2, P = m1 * v1 + m2 * v2, ap = v1 - v2, a = (P - m2 * ap) / M, b = a + ap, J = m2 * (b - v2); return {
  prompt: `Pod A (${n(m1)} kg) glides along the docking track at ${n(v1)} m/s. Take A’s direction of motion as positive. Pod B (${n(m2)} kg) is on the track ahead of A, ${v2 > 0 ? `moving the same way more slowly, with velocity ${n(v2)} m/s` : v2 === 0 ? 'at rest, with velocity 0 m/s' : `coming the other way at ${n(-v2)} m/s, a velocity of ${n(v2)} m/s`}. A runs into B and they bounce off each other elastically, so kinetic energy is kept, and no outside force acts along the track. For such a collision on a line the two pods separate at the same speed at which they approached: (B’s velocity after) − (A’s velocity after) = (A’s velocity before) − (B’s velocity before). Use this together with conservation of momentum. Enter A’s velocity after the collision, then B’s velocity after it, then the impulse A gives B (B’s change in momentum), in metres per second, metres per second and newton seconds (N·s), all to 2 decimal places. Type the numbers without commas.`,
  answer: [a, b, J],
  hints: ['Write B’s velocity after as A’s velocity after plus the speed of approach (A’s velocity before − B’s velocity before). Then put that into the momentum equation, which has only one unknown left.', 'Total momentum before equals m₁ × (A after) + m₂ × (B after). The impulse on B is its mass times (its velocity after − its velocity before).'],
  solution: `The speed of approach is ${n(v1)} − ${par(v2)} = ${n(ap)} m/s, so B leaves ${n(ap)} m/s faster than A: v_B = v_A + ${n(ap)}. Momentum before: ${n(m1)} × ${n(v1)} + ${n(m2)} × ${par(v2)} = ${n(P)} kg·m/s. After: ${n(m1)} v_A + ${n(m2)} (v_A + ${n(ap)}) = ${n(P)}, so ${n(M)} v_A = ${n(P)} − ${n(m2 * ap)} = ${n(P - m2 * ap)} and v_A = ${n(a)} m/s. Then v_B = ${n(a)} + ${n(ap)} = ${n(b)} m/s. The impulse on B is its change in momentum: ${n(m2)} × (${n(b)} − ${par(v2)}) = ${n(J)} N·s.`,
  guidance: [
   { prompt: `What is the total momentum before the collision, in kg·m/s?`, answer: [P], explanation: `${n(m1)} × ${n(v1)} + ${n(m2)} × ${par(v2)} = ${n(P)} kg·m/s. It is the same after the collision.` },
   { prompt: `B leaves ${n(ap)} m/s faster than A (the speed of approach), so v_B = v_A + ${n(ap)}. Put that into ${n(m1)} v_A + ${n(m2)} v_B = ${n(P)}. What is v_A, in m/s?`, answer: [a], explanation: `${n(m1)} v_A + ${n(m2)} (v_A + ${n(ap)}) = ${n(P)}, so ${n(M)} v_A = ${n(P - m2 * ap)} and v_A = ${n(a)} m/s.` },
   { prompt: `What is B’s velocity after the collision, v_A + ${n(ap)}, in m/s?`, answer: [b], explanation: `${n(a)} + ${n(ap)} = ${n(b)} m/s.` },
   { prompt: `B’s velocity changes from ${n(v2)} m/s to ${n(b)} m/s. What is its change in momentum, the impulse A gives it, in N·s?`, answer: [J], explanation: `${n(m2)} × (${n(b)} − ${par(v2)}) = ${n(J)} N·s.` }
  ] }; }
});

/* ---- q34 The centre of mass [9.6] ---- */

/* Two or more masses at distinct places: x or y list helpers for the centre-of-mass missions. */
const cmKey = (x, y) => x + ',' + y;

/* q34b: four fuel drums (hundreds of kg) at whole-number places from −8 to 8 m. The centre of mass is off rounding ties,
   the x and y answers differ, the places are all different. Not the worked example (two masses on a line). */
mk({ id: 'q34b', parent: 'q34', kind: 'setting', title: 'Stacking the fuel drums',
 brief: 'Four fuel drums are stored in the fuel bay of the Docking Ring, and the crew wants the one point that stands for all their weight.',
 labels: ['centre of mass x (m)', 'centre of mass y (m)'], tolerance: 0.005,
 gl: [['total mass (kg)'], ['Σmx (kg·m)'], ['centre of mass x (m)'], ['centre of mass y (m)']] }, {
 canonical: { m1: 200, x1: -3, y1: 4, m2: 400, x2: 5, y2: 2, m3: 300, x3: 1, y3: -6, m4: 500, x4: -7, y4: -1 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), x1: R.int(-8, 8), y1: R.int(-8, 8), m2: 100 * R.int(1, 8), x2: R.int(-8, 8), y2: R.int(-8, 8), m3: 100 * R.int(1, 8), x3: R.int(-8, 8), y3: R.int(-8, 8), m4: 100 * R.int(1, 8), x4: R.int(-8, 8), y4: R.int(-8, 8) }),
  p => { const M = p.m1 + p.m2 + p.m3 + p.m4, X = (p.m1 * p.x1 + p.m2 * p.x2 + p.m3 * p.x3 + p.m4 * p.x4) / M, Y = (p.m1 * p.y1 + p.m2 * p.y2 + p.m3 * p.y3 + p.m4 * p.y4) / M;
   return new Set([cmKey(p.x1, p.y1), cmKey(p.x2, p.y2), cmKey(p.x3, p.y3), cmKey(p.x4, p.y4)]).size === 4 && offTie(X) && offTie(Y) && rd(X) !== rd(Y); },
  { m1: 200, x1: -3, y1: 4, m2: 400, x2: 5, y2: 2, m3: 300, x3: 1, y3: -6, m4: 500, x4: -7, y4: -1 }),
 build: ({ m1, x1, y1, m2, x2, y2, m3, x3, y3, m4, x4, y4 }) => { const M = m1 + m2 + m3 + m4, Sx = m1 * x1 + m2 * x2 + m3 * x3 + m4 * x4, Sy = m1 * y1 + m2 * y2 + m3 * y3 + m4 * y4, X = Sx / M, Y = Sy / M; return {
  prompt: `Four fuel drums stand in the Docking Ring’s fuel bay, whose floor is marked with an x axis and a y axis in metres. Drum A has mass ${n(m1)} kg and stands at (${n(x1)}, ${n(y1)}), drum B has ${n(m2)} kg at (${n(x2)}, ${n(y2)}), drum C has ${n(m3)} kg at (${n(x3)}, ${n(y3)}) and drum D has ${n(m4)} kg at (${n(x4)}, ${n(y4)}). Treat each drum as a point at its position. Enter the x coordinate of the centre of mass of the four drums, then its y coordinate, both in metres to 2 decimal places.`,
  answer: [rd(X), rd(Y)],
  hints: ['Multiply each coordinate by the mass at that place, add the products, and divide by the total mass of all four drums.', 'Work out x and y separately, and keep the signs of negative coordinates.'],
  solution: `Total mass M = ${n(m1)} + ${n(m2)} + ${n(m3)} + ${n(m4)} = ${n(M)} kg. Σmx = ${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)} + ${n(m3)} × ${par(x3)} + ${n(m4)} × ${par(x4)} = ${n(Sx)} kg·m, so x = ${n(Sx)} ÷ ${n(M)} ${eq(X)} ${n(rd(X))} m. Σmy = ${n(m1)} × ${par(y1)} + ${n(m2)} × ${par(y2)} + ${n(m3)} × ${par(y3)} + ${n(m4)} × ${par(y4)} = ${n(Sy)} kg·m, so y = ${n(Sy)} ÷ ${n(M)} ${eq(Y)} ${n(rd(Y))} m. The centre of mass is at ${exact(X) && exact(Y) ? '' : 'about '}(${n(rd(X))}, ${n(rd(Y))}).`,
  guidance: [
   { prompt: `What is the total mass of the four drums, in kg?`, answer: [M], explanation: `${n(m1)} + ${n(m2)} + ${n(m3)} + ${n(m4)} = ${n(M)} kg.` },
   { prompt: `Multiply each drum’s x coordinate by its mass and add. What is Σmx, in kg·m?`, answer: [Sx], explanation: `${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)} + ${n(m3)} × ${par(x3)} + ${n(m4)} × ${par(x4)} = ${n(Sx)} kg·m.` },
   { prompt: `Divide Σmx by the total mass. What is the x coordinate of the centre of mass, in metres to 2 decimal places?`, answer: [rd(X)], explanation: `${n(Sx)} ÷ ${n(M)} ${eq(X)} ${n(rd(X))} m.` },
   { prompt: `Do the same with the y coordinates. What is the y coordinate of the centre of mass, in metres to 2 decimal places?`, answer: [rd(Y)], explanation: `Σmy = ${n(Sy)} kg·m, and ${n(Sy)} ÷ ${n(M)} ${eq(Y)} ${n(rd(Y))} m.` }
  ] }; }
});

/* q34c: three pods placed; where must a fourth go so that the centre of mass of all four is at a target point?
   The answer places are exact to 2 decimals, within 15 m, and x ≠ y. Not the parent's canonical pods. */
mk({ id: 'q34c', parent: 'q34', kind: 'applied', title: 'Where does the last pod go?',
 brief: 'The Docking Ring floor tips if its load sits off centre, so the crew must choose where the last pod is parked to bring the balance point to the marked spot.',
 labels: ['x coordinate of pod D (m)', 'y coordinate of pod D (m)'], tolerance: 0.005,
 gl: [['moment pod D must supply, x (kg·m)'], ['x coordinate of pod D (m)'], ['y coordinate of pod D (m)']] }, {
 canonical: { m1: 200, x1: 4, y1: 3, m2: 300, x2: -2, y2: 5, m3: 400, x3: 6, y3: -4, m4: 500, tx: 1, ty: 0 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), x1: R.int(-8, 8), y1: R.int(-8, 8), m2: 100 * R.int(1, 8), x2: R.int(-8, 8), y2: R.int(-8, 8), m3: 100 * R.int(1, 8), x3: R.int(-8, 8), y3: R.int(-8, 8), m4: 100 * R.int(1, 8), tx: R.int(-3, 3), ty: R.int(-3, 3) }),
  p => { const M = p.m1 + p.m2 + p.m3 + p.m4, X = (M * p.tx - (p.m1 * p.x1 + p.m2 * p.x2 + p.m3 * p.x3)) / p.m4, Y = (M * p.ty - (p.m1 * p.y1 + p.m2 * p.y2 + p.m3 * p.y3)) / p.m4;
   return new Set([cmKey(p.x1, p.y1), cmKey(p.x2, p.y2), cmKey(p.x3, p.y3)]).size === 3 && exact(X) && exact(Y) && Math.abs(X) <= 15 && Math.abs(Y) <= 15 && X !== Y && !(p.m1 === 300 && p.x1 === 2 && p.y1 === 5); },
  { m1: 200, x1: 4, y1: 3, m2: 300, x2: -2, y2: 5, m3: 400, x3: 6, y3: -4, m4: 500, tx: 1, ty: 0 }),
 build: ({ m1, x1, y1, m2, x2, y2, m3, x3, y3, m4, tx, ty }) => { const M = m1 + m2 + m3 + m4, Sx = m1 * x1 + m2 * x2 + m3 * x3, Sy = m1 * y1 + m2 * y2 + m3 * y3, needX = M * tx - Sx, needY = M * ty - Sy, X = needX / m4, Y = needY / m4; return {
  prompt: `Three cargo pods are parked on the Docking Ring floor, which is marked with an x axis and a y axis in metres. Pod A has mass ${n(m1)} kg and sits at (${n(x1)}, ${n(y1)}), pod B has mass ${n(m2)} kg at (${n(x2)}, ${n(y2)}) and pod C has mass ${n(m3)} kg at (${n(x3)}, ${n(y3)}). A fourth pod D of mass ${n(m4)} kg is still to be parked. The crew wants the centre of mass of all four pods to sit exactly at the marked point (${n(tx)}, ${n(ty)}). Treat each pod as a point. Enter the x coordinate where pod D must be parked, then its y coordinate, both in metres to 2 decimal places.`,
  answer: [X, Y],
  hints: ['For all four pods, the total of mass × x must equal the total mass times the x of the marked point. Pods A, B and C already supply some of that total, and pod D must supply the rest.', 'Pod D’s share is its mass times its x coordinate, so divide what it must supply by its mass. Do the y coordinate the same way, and keep the signs.'],
  solution: `Total mass of all four: M = ${n(m1)} + ${n(m2)} + ${n(m3)} + ${n(m4)} = ${n(M)} kg. For the x coordinate, A, B and C give Σmx = ${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)} + ${n(m3)} × ${par(x3)} = ${n(Sx)} kg·m, and the four together must give M × ${n(tx)} = ${n(M * tx)} kg·m. Pod D must supply ${n(M * tx)} − ${par(Sx)} = ${n(needX)} kg·m, so x = ${n(needX)} ÷ ${n(m4)} = ${n(X)} m. For y: A, B and C give ${n(Sy)} kg·m, the four must give ${n(M)} × ${par(ty)} = ${n(M * ty)} kg·m, so pod D supplies ${n(needY)} kg·m and y = ${n(needY)} ÷ ${n(m4)} = ${n(Y)} m.`,
  guidance: [
   { prompt: `A, B and C give Σmx = ${n(Sx)} kg·m. All four pods must give ${n(M)} × ${par(tx)} (total mass times the marked x). How much does pod D have to supply, in kg·m?`, answer: [needX], explanation: `${n(M * tx)} − ${par(Sx)} = ${n(needX)} kg·m.` },
   { prompt: `Pod D’s share is ${n(m4)} × its x coordinate. What is its x coordinate, in metres to 2 decimal places?`, answer: [X], explanation: `${n(needX)} ÷ ${n(m4)} = ${n(X)} m.` },
   { prompt: `Do the same with the y coordinates (A, B and C give ${n(Sy)} kg·m, and the four must give ${n(M)} × ${par(ty)}). What is the y coordinate of pod D, in metres to 2 decimal places?`, answer: [Y], explanation: `Pod D supplies ${n(M * ty)} − ${par(Sy)} = ${n(needY)} kg·m, so y = ${n(needY)} ÷ ${n(m4)} = ${n(Y)} m.` }
  ] }; }
});

/* q34d: two pods on a rail approach and latch; the centre of mass keeps a steady velocity V = P ÷ M. The position now,
   the velocity and the position t seconds later all have at most 2 decimals. x1 < x2 and v1 > v2. Mixes in q33. */
mk({ id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q33', title: 'The centre that keeps moving',
 brief: 'Two pods are about to meet and latch on a rail, and the crew wants to track the one point that stands for the pair through the collision.',
 labels: ['centre of mass position now (m)', 'centre of mass velocity (m/s)', 'centre of mass position later (m)'], tolerance: 0.005,
 gl: [['centre of mass position now (m)'], ['centre of mass velocity (m/s)'], ['centre of mass position later (m)']] }, {
 canonical: { m1: 400, x1: -5, v1: 3, m2: 600, x2: 5, v2: -1, t: 5 },
 draw: R => tryDraw(R, R => ({ m1: 100 * R.int(1, 8), x1: R.int(-10, 0), v1: R.int(2, 8) / 2, m2: 100 * R.int(1, 8), x2: R.int(2, 12), v2: R.int(-6, 1) / 2, t: R.int(2, 12) }),
  p => { const M = p.m1 + p.m2, x0 = (p.m1 * p.x1 + p.m2 * p.x2) / M, V = (p.m1 * p.v1 + p.m2 * p.v2) / M; return p.v2 < p.v1 && exact(x0) && exact(V) && V !== 0 && !(p.m1 === 400 && p.m2 === 600); }, { m1: 400, x1: -5, v1: 3, m2: 600, x2: 5, v2: -1, t: 5 }),
 build: ({ m1, x1, v1, m2, x2, v2, t }) => { const M = m1 + m2, Sx = m1 * x1 + m2 * x2, x0 = Sx / M, P = m1 * v1 + m2 * v2, V = P / M, xt = x0 + V * t; return {
  prompt: `Two cargo pods ride a frictionless rail marked in metres, with positive x and positive velocity pointing the same way along the rail. Pod A (${n(m1)} kg) is at x = ${n(x1)} m moving at ${n(v1)} m/s, and pod B (${n(m2)} kg) is at x = ${n(x2)} m moving at ${n(v2)} m/s, so they are closing and will meet and latch together. No outside force acts along the rail. The centre of mass of the pair moves at the velocity V = (total momentum) ÷ (total mass), and no collision between the two pods can change it. Treat each pod as a point. Enter the x position of the centre of mass now, then its velocity, then its x position ${n(t)} s from now (whether or not the pods have latched by then, since the latching does not change its motion), in metres, metres per second and metres, all to 2 decimal places.`,
  answer: [x0, V, xt],
  hints: ['The position now is the mass-weighted average of the two positions. The velocity is the total momentum m₁v₁ + m₂v₂ divided by the total mass, with the sign of each velocity kept.', 'The centre of mass keeps its velocity through the latching, so its new position is its position now plus its velocity times the time.'],
  solution: `Total mass M = ${n(m1)} + ${n(m2)} = ${n(M)} kg. Position now: x = (${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)}) ÷ ${n(M)} = ${n(Sx)} ÷ ${n(M)} = ${n(x0)} m. Total momentum: ${n(m1)} × ${n(v1)} + ${n(m2)} × ${par(v2)} = ${n(P)} kg·m/s, so V = ${n(P)} ÷ ${n(M)} = ${n(V)} m/s. The centre of mass keeps that velocity through the latching, so after ${n(t)} s it is at ${n(x0)} ${V < 0 ? '−' : '+'} ${n(Math.abs(V))} × ${n(t)} = ${n(xt)} m.`,
  guidance: [
   { prompt: `What is the x position of the centre of mass now, the mass-weighted average of the two positions, in metres?`, answer: [x0], explanation: `(${n(m1)} × ${par(x1)} + ${n(m2)} × ${par(x2)}) ÷ ${n(M)} = ${n(Sx)} ÷ ${n(M)} = ${n(x0)} m.` },
   { prompt: `What is the velocity of the centre of mass, the total momentum divided by the total mass of ${n(M)} kg, in m/s?`, answer: [V], explanation: `${n(m1)} × ${n(v1)} + ${n(m2)} × ${par(v2)} = ${n(P)} kg·m/s, and ${n(P)} ÷ ${n(M)} = ${n(V)} m/s.` },
   { prompt: `The centre of mass keeps that velocity for ${n(t)} s. What is its x position then, in metres?`, answer: [xt], explanation: `${n(x0)} ${V < 0 ? '−' : '+'} ${n(Math.abs(V))} × ${n(t)} = ${n(xt)} m.` }
  ] }; }
});

/* ---- q35 Angular position, angular velocity and v = ωr [10.1, 10.3] ---- */

/* q35b: a rover wheel at N rpm (a multiple of 10), radius r (hundredths), for t seconds. The rover moves as fast as the
   rim goes round. Not the parent's canonical (150 rpm, 0.4 m, 12 s) nor its worked example (120 rpm, 0.5 m, 10 s). */
mk({ id: 'q35b', parent: 'q35', kind: 'setting', title: 'Driving the survey rover',
 brief: 'The survey rover’s wheel gauge reads in revolutions per minute, and the crew wants to know how fast the rover is going and how far it gets.',
 labels: ['angular velocity (rad/s)', 'rover speed (m/s)', 'distance covered (m)'], tolerance: 0.005,
 gl: [['angular velocity (rad/s)'], ['rover speed (m/s)'], ['distance covered (m)']] }, {
 canonical: { N: 90, r: 0.35, t: 20 },
 draw: R => tryDraw(R, R => ({ N: 10 * R.int(5, 40), r: R.int(15, 60) / 100, t: R.int(2, 40) }),
  p => { const w = p.N * Math.PI / 30, v = w * p.r; return offTie(w) && offTie(v) && offTie(v * p.t) && !(p.N === 150 && p.r === 0.4 && p.t === 12) && !(p.N === 120 && p.r === 0.5 && p.t === 10); }, { N: 90, r: 0.35, t: 20 }),
 build: ({ N, r, t }) => { const w = N * Math.PI / 30, v = w * r, s = v * t; return {
  prompt: `A survey rover has wheels of radius ${n(r)} m. Its wheel gauge reads a steady ${n(N)} revolutions per minute (rpm). The wheels roll without slipping, so the rover moves forward as fast as a point on the rim of a wheel moves round the axle. Enter the angular velocity ω of a wheel in radians per second, then the rover’s speed in metres per second, then the distance the rover covers in ${n(t)} seconds in metres, all to 2 decimal places (use unrounded values at every step).`,
  answer: [rd(w), rd(v), rd(s)],
  hints: ['Multiply the rpm by 2π radians per turn and divide by 60 seconds per minute to get ω in radians per second.', 'The speed of a point on the rim is v = ωr, and that is the speed of the rover. Distance is speed times time.'],
  solution: `ω = ${n(N)} × 2π ÷ 60 ≈ ${n(rd(w))} rad/s. The rover’s speed equals the rim speed, v = ωr ≈ ${n(rd(v))} m/s (worked from the unrounded ω). In ${n(t)} s it covers v × t ≈ ${n(rd(s))} m.`,
  guidance: [
   { prompt: `Turn ${n(N)} rpm into radians per second: multiply by 2π and divide by 60. What is ω, to 2 decimal places?`, answer: [rd(w)], explanation: `${n(N)} × 2π ÷ 60 ≈ ${n(rd(w))} rad/s.` },
   { prompt: `The wheel’s radius is ${n(r)} m. What is the rim speed v = ωr, which is the rover’s speed, in m/s to 2 decimal places?`, answer: [rd(v)], explanation: `v = ωr ≈ ${n(rd(v))} m/s, worked from the unrounded ω.` },
   { prompt: `The rover goes at that speed for ${n(t)} s. How far does it travel, in metres to 2 decimal places (use the unrounded speed)?`, answer: [rd(s)], explanation: `v × t ≈ ${n(rd(s))} m.` }
  ] }; }
});

/* q35c: the tip of a test arm must not go faster than a limit. ω = v ÷ r, then rpm and the shortest time for one turn.
   All three answers are kept off rounding ties; the period is at least 0.2 s. */
mk({ id: 'q35c', parent: 'q35', kind: 'applied', title: 'Speed limit on the test arm',
 brief: 'A sensor on the tip of a test arm in the Flywheel Vault has a speed limit, and the crew must set the arm’s greatest spin.',
 labels: ['greatest angular velocity (rad/s)', 'greatest spin (rpm)', 'shortest time for one turn (s)'], tolerance: 0.005,
 gl: [['greatest angular velocity (rad/s)'], ['greatest spin (rpm)'], ['shortest time for one turn (s)']] }, {
 canonical: { r: 0.8, vmax: 12 },
 draw: R => tryDraw(R, R => ({ r: R.int(3, 20) / 10, vmax: R.int(4, 40) }),
  p => { const w = p.vmax / p.r; return offTie(w) && offTie(w * 30 / Math.PI) && offTie(2 * Math.PI / w) && 2 * Math.PI / w >= 0.2; }, { r: 0.8, vmax: 12 }),
 build: ({ r, vmax }) => { const w = vmax / r, rpm = w * 30 / Math.PI, T = 2 * Math.PI / w; return {
  prompt: `A test arm in the Flywheel Vault spins on its axle, with a sensor on its tip ${n(r)} m from the axle. The sensor must never move faster than ${n(vmax)} m/s. Enter the greatest angular velocity ω the arm may have in radians per second, then the same limit in revolutions per minute (rpm), then the shortest time the arm may take for one full turn in seconds, all to 2 decimal places (use unrounded values in the later answers).`,
  answer: [rd(w), rd(rpm), rd(T)],
  hints: ['A point at distance r from the axle moves at v = ωr, so the greatest ω is the speed limit divided by r.', 'To change radians per second into rpm, multiply by 60 and divide by 2π. One full turn is 2π radians, so the time for one turn is 2π divided by ω.'],
  solution: `The tip moves at v = ωr, so the greatest ω is ${n(vmax)} ÷ ${n(r)} ${eq(w)} ${n(rd(w))} rad/s. In rpm that is ω × 60 ÷ 2π ${eq(rpm)} ${n(rd(rpm))} rpm. One turn is 2π radians, so the shortest time for a turn is 2π ÷ ω ${eq(T)} ${n(rd(T))} s.`,
  guidance: [
   { prompt: `The tip speed is v = ωr, so ω = v ÷ r. What is the greatest ω, in rad/s to 2 decimal places?`, answer: [rd(w)], explanation: `${n(vmax)} ÷ ${n(r)} ${eq(w)} ${n(rd(w))} rad/s.` },
   { prompt: `Multiply ω by 60 and divide by 2π to change it to rpm. What is the greatest spin, in rpm to 2 decimal places?`, answer: [rd(rpm)], explanation: `ω × 60 ÷ 2π ${eq(rpm)} ${n(rd(rpm))} rpm, from the unrounded ω.` },
   { prompt: `One full turn is 2π radians. How long does it take at the greatest ω, in seconds to 2 decimal places?`, answer: [rd(T)], explanation: `2π ÷ ω ${eq(T)} ${n(rd(T))} s, from the unrounded ω.` }
  ] }; }
});

/* q35d: a disc whose rim can take at most a centripetal acceleration a (m/s²). Because v = ωr, v²/r = ω²r, so
   ω = √(a ÷ r). The drawn parameters are the printed a and r, chosen so that a ÷ r is a perfect square (ω a whole number
   from 4 to 30). Mixes in q14. */
mk({ id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q14', title: 'Stress test on the spinning disc',
 brief: 'A test disc in the Flywheel Vault is built to take only so much pull at its rim, and the crew wants the fastest spin it can be given.',
 labels: ['greatest angular velocity (rad/s)', 'rim speed at that spin (m/s)', 'greatest spin (rpm)'], tolerance: 0.005,
 gl: [['greatest angular velocity (rad/s)'], ['rim speed at that spin (m/s)'], ['greatest spin (rpm)']] }, {
 canonical: { a: 72, r: 0.5 },
 draw: R => { const w = R.int(4, 30), ri = R.pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), r = ri / 10, a = Math.round(w * w * ri) / 10; return { a, r }; },
 build: ({ a, r }) => { const w = Math.round(Math.sqrt(a / r)), v = w * r, rpm = w * 30 / Math.PI; return {
  prompt: `A test disc in the Flywheel Vault has radius ${n(r)} m. Its rim can take a centripetal acceleration of at most ${n(a)} m/s² before it fails, where the centripetal acceleration of a rim point is v² ÷ r for its speed v. The disc turns on its axle at a steady angular velocity ω. Enter the greatest ω the disc can have in radians per second, then the speed of a rim point at that spin in metres per second, then the same spin in revolutions per minute (rpm), all to 2 decimal places.`,
  answer: [w, rd(v), rd(rpm)],
  hints: ['A rim point moves at v = ωr, so its centripetal acceleration v² ÷ r equals (ωr)² ÷ r = ω²r. Set that equal to the limit and solve for ω.', 'Once you have ω, the rim speed is ωr, and rpm is ω × 60 ÷ 2π.'],
  solution: `The rim point moves at v = ωr, so its centripetal acceleration is v² ÷ r = ω²r. Setting ω² × ${n(r)} = ${n(a)} gives ω² = ${n(a)} ÷ ${n(r)} = ${n(w * w)}, so ω = ${n(w)} rad/s. The rim speed is v = ωr = ${n(w)} × ${n(r)} = ${n(v)} m/s. In rpm, ω × 60 ÷ 2π ${eq(rpm)} ${n(rd(rpm))} rpm.`,
  guidance: [
   { prompt: `Since v = ωr, the acceleration v² ÷ r is ω²r. Set ω² × ${n(r)} = ${n(a)}. What is ω², in rad²/s²?`, answer: [w * w], explanation: `ω² = ${n(a)} ÷ ${n(r)} = ${n(w * w)}.` },
   { prompt: `Take the square root. What is the greatest ω, in rad/s?`, answer: [w], explanation: `ω = √${n(w * w)} = ${n(w)} rad/s.` },
   { prompt: `The rim point is ${n(r)} m from the axle. What is its speed at that spin, v = ωr, in m/s?`, answer: [rd(v)], explanation: `${n(w)} × ${n(r)} = ${n(v)} m/s.` }
  ] }; }
});

})();
