/* Mechanics: motion and force practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p3.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator cannot drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
const g = 9.8, PI = Math.PI;
/* Rounding to 2 decimal places; nearTie(x) is true when x sits within 0.05 of a hundredth's rounding tie. */
const r2 = x => Math.round(x * 100) / 100;
const nearTie = x => { const f = Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100); return Math.abs(f - 0.5) < 0.05; };
const f2 = x => n(r2(x));
/* True when x has at most 2 decimal places. */
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
/* '=' when n(x) shows x exactly, '≈' when it is rounded. */
const eq = x => Math.abs(Number(n(x).replace('−', '-')) - x) < 1e-12 ? '=' : '≈';
/* Coefficient without a written-out 1: co(1, 't²') is 't²', co(1.5, 't²') is '1.5t²' (the sign is written separately). */
const co = (v, x) => `${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };

/* ---- q11 Chapter review: velocity and position from acceleration by integrating [3.6, 3.4] ---- */

/* Gantry cart: a(t) = b − ct, so v = v0 + bt − (c ÷ 2)t² and the distance (the cart never stops) v0T + (b ÷ 2)T² − (c ÷ 6)T³. */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The gantry cart',
 brief: 'A cargo cart on the gantry rail is hauled by a winch whose pull weakens as the cable winds in, and Mira wants its speed and its progress after a few seconds.',
 labels: ['velocity (m/s)', 'distance (m)'], tolerance: 0.01,
 gl: [['k (m/s³)'], ['velocity (m/s)'], ['distance (m)']]
}, {
 canonical: { b: 9, c: 6, v0: 4, T: 3 },
 draw: R => retry(() => ({ b: R.int(6, 16), c: R.pick([3, 6]), v0: R.int(2, 9), T: R.int(2, 5) }),
  p => { for (let k = 0; k <= 100 * p.T; k++) { const t = k / 100; if (p.v0 + p.b * t - p.c * t * t / 2 <= 0) return false; } return true; },
  { b: 9, c: 6, v0: 4, T: 3 }),
 build: ({ b, c, v0, T }) => { const k2 = c / 2, h = b / 2, k3 = c / 6, T2 = T * T, T3 = T2 * T, v = v0 + b * T - k2 * T2, s = v0 * T + h * T2 - k3 * T3; return {
  prompt: `A cargo cart on the gantry rail beside the Sled Run is hauled by a winch whose pull weakens as the cable winds in, so the cart’s acceleration is a(t) = ${n(b)} − ${co(c, 't')} m/s², t seconds after the start. Positive means down the rail. At t = 0 the cart is moving down the rail at ${n(v0)} m/s, and it does not stop or turn back during the first ${n(T)} s. Enter its velocity at t = ${n(T)} s in metres per second, then the distance it travels along the rail between t = 0 and t = ${n(T)} s in metres.`,
  answer: [v, s],
  hints: ['Velocity is an antiderivative of acceleration, and the constant is the velocity at t = 0. The weakening pull gives a negative t² term in v(t).', 'The cart never turns back, so the distance travelled is the change in position. An antiderivative of v(t) that is 0 at t = 0 gives that change directly when you put in the end time.'],
  solution: `An antiderivative of a(t) = ${n(b)} − ${co(c, 't')} is ${co(b, 't')} − ${co(k2, 't²')}, which is 0 at t = 0, so the constant is v(0) = ${n(v0)} and v(t) = ${n(v0)} + ${co(b, 't')} − ${co(k2, 't²')}. At t = ${n(T)}: v = ${n(v0)} + ${n(b * T)} − ${n(k2 * T2)} = ${n(v)} m/s. An antiderivative of v(t) is ${n(v0)}t + ${co(h, 't²')} − ${co(k3, 't³')}, which is 0 at t = 0. At t = ${n(T)} it is ${n(v0 * T)} + ${n(h * T2)} − ${n(k3 * T3)} = ${n(s)}, so the cart travels ${n(s)} m.`,
  guidance: [
   { prompt: `Integrate a(t) = ${n(b)} − ${co(c, 't')} and add v(0): v(t) = ${n(v0)} + ${co(b, 't')} − kt². What is the number k, in m/s³?`, answer: [k2], explanation: `The antiderivative of ${co(c, 't')} is ${co(c, 't²')} ÷ 2, so k = ${n(c)} ÷ 2 = ${n(k2)}.` },
   { prompt: `Put t = ${n(T)} into v(t) = ${n(v0)} + ${co(b, 't')} − ${co(k2, 't²')}. What is the velocity, in m/s?`, answer: [v], explanation: `${n(v0)} + ${n(b)} × ${n(T)} − ${n(k2)} × ${n(T2)} = ${n(v)} m/s.` },
   { prompt: `An antiderivative of v(t) is ${n(v0)}t + ${co(h, 't²')} − ${co(k3, 't³')}, which is 0 at t = 0. What is its value at t = ${n(T)}, the distance travelled in metres?`, answer: [s], explanation: `${n(v0)} × ${n(T)} + ${n(h)} × ${n(T2)} − ${n(k3)} × ${n(T3)} = ${n(s)} m.` }
  ] }; }
});

/* Magnetic brake: a(t) = −ct, v = v0 − (c ÷ 2)t². Rest at T with v0 = cT² ÷ 2; distance v0T − (c ÷ 6)T³ = cT³ ÷ 3. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The magnetic brake',
 brief: 'A sled arriving at the end of the Sled Run is slowed by a brake that bites harder the longer it is on, and Mira wants to know when and where it stops.',
 labels: ['stopping time (s)', 'stopping distance (m)'], tolerance: 0.01,
 gl: [['k (m/s³)'], ['stopping time (s)'], ['distance (m)']]
}, {
 canonical: { c: 6, T: 3 },
 draw: R => retry(() => ({ c: R.pick([3, 6, 9, 12, 15, 18]), T: R.int(2, 8) }), p => (p.c * p.T * p.T) % 2 === 0 && p.c * p.T * p.T / 2 <= 300 && p.c * p.T * p.T * p.T / 3 < 1000, { c: 6, T: 3 }),
 build: ({ c, T }) => { const v0 = c * T * T / 2, k2 = c / 2, k3 = c / 6, T3 = T * T * T, d = c * T3 / 3; return {
  prompt: `A sled coming to the end of the Sled Run is slowed by a magnetic brake that bites harder the longer it is on. Measured from the moment the brake first touches, the sled’s acceleration is a(t) = −${co(c, 't')} m/s², t seconds after that moment, where positive means down the run. At t = 0 the sled is moving down the run at ${n(v0)} m/s. Take the brake as the only thing changing its speed. Enter the time, in seconds, at which the sled first comes to rest, then the distance it travels along the run from t = 0 until it comes to rest, in metres.`,
  answer: [T, d],
  hints: ['Integrate the acceleration and use the starting speed as the constant: v(t) = v(0) + ∫a dt. The sled is at rest when v(t) = 0, so solve that equation for t and take the positive root.', 'The sled only moves forwards until it stops, so the distance is the change in position. An antiderivative of v(t) that is 0 at t = 0, put in the stopping time, gives it directly.'],
  solution: `An antiderivative of a(t) = −${co(c, 't')} is −${co(k2, 't²')}, which is 0 at t = 0, so v(t) = ${n(v0)} − ${co(k2, 't²')}. The sled is at rest when ${co(k2, 't²')} = ${n(v0)}, so t² = ${n(T * T)} and t = ${n(T)} s. An antiderivative of v(t) is ${n(v0)}t − ${co(k3, 't³')}, which is 0 at t = 0. At t = ${n(T)} it is ${n(v0 * T)} − ${n(k3 * T3)} = ${n(d)}, so the sled travels ${n(d)} m.`,
  guidance: [
   { prompt: `Integrate a(t) = −${co(c, 't')} and add v(0): v(t) = ${n(v0)} − kt². What is the number k, in m/s³?`, answer: [k2], explanation: `The antiderivative of ${co(c, 't')} is ${co(c, 't²')} ÷ 2, so k = ${n(c)} ÷ 2 = ${n(k2)}.` },
   { prompt: `The sled is at rest when ${n(v0)} − ${co(k2, 't²')} = 0. What is the positive solution t, in seconds?`, answer: [T], explanation: `${co(k2, 't²')} = ${n(v0)} gives t² = ${n(T * T)}, so t = ${n(T)} s.` },
   { prompt: `An antiderivative of v(t) is ${n(v0)}t − ${co(k3, 't³')}, which is 0 at t = 0. What is its value at t = ${n(T)}, the distance travelled in metres?`, answer: [d], explanation: `${n(v0)} × ${n(T)} − ${n(k3)} × ${n(T3)} = ${n(d)} m.` }
  ] }; }
});

/* Boost then brake: a = b + ct for T s from the top marker, v = v0 + bt + (c ÷ 2)t², x = v0t + (b ÷ 2)t² + (c ÷ 6)t³,
   then a steady deceleration d: braking distance v² ÷ (2d). Draws keep every answer to 2 decimal places or fewer. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q09', title: 'Boost, then brake',
 brief: 'A test sled is boosted down the run and then braked to a halt, and the crew wants its speed at cut-out and the whole distance it covers.',
 labels: ['speed at cut-out (m/s)', 'total distance (m)'], tolerance: 0.005,
 gl: [['speed at cut-out (m/s)'], ['boost distance (m)'], ['braking distance (m)'], ['total distance (m)']]
}, {
 canonical: { b: 2, c: 6, v0: 4, T: 3, d: 5 },
 draw: R => retry(() => ({ b: R.int(1, 6), c: R.pick([6, 12]), v0: R.int(2, 9), T: R.int(2, 4), d: R.pick([2, 4, 5, 8, 10]) }),
  p => { const v = p.v0 + p.b * p.T + p.c / 2 * p.T * p.T; return exact2(v * v / (2 * p.d)) && v < 100 && p.v0 * p.T + p.b / 2 * p.T * p.T + p.c / 6 * p.T ** 3 + v * v / (2 * p.d) < 1000; }, { b: 2, c: 6, v0: 4, T: 3, d: 5 }),
 build: ({ b, c, v0, T, d }) => { const k2 = c / 2, h = b / 2, k3 = c / 6, T2 = T * T, T3 = T2 * T, v = v0 + b * T + k2 * T2,
  s1 = v0 * T + h * T2 + k3 * T3, s2 = v * v / (2 * d), tot = s1 + s2; return {
  prompt: `A test sled on the Sled Run starts at the top marker (position 0) moving at ${n(v0)} m/s. For the first ${n(T)} s a booster pushes it, so its acceleration is a(t) = ${n(b)} + ${n(c)}t m/s², t seconds after the start, with positive meaning down the run. At t = ${n(T)} the booster cuts out and the brakes bring the sled to rest with a steady deceleration of ${n(d)} m/s². Enter the sled’s speed at the moment the booster cuts out, in metres per second, then the total distance from the top marker to the point where it comes to rest, in metres. Both answers are exact, with at most 2 decimal places.`,
  answer: [v, tot],
  hints: ['While the booster burns the acceleration changes, so v = v₀ + at does not apply. Integrate to get v(t), then integrate again to get the position, using the starting speed and the starting position for the constants.', 'After cut-out the deceleration is steady, so the constant-acceleration equation v² = v₀² + 2a(x − x₀) applies with a final speed of 0: the braking distance is (speed at cut-out)² ÷ (2 × deceleration). The total is the boost distance plus the braking distance.'],
  solution: `An antiderivative of a(t) = ${n(b)} + ${n(c)}t is ${co(b, 't')} + ${co(k2, 't²')}, which is 0 at t = 0, so v(t) = ${n(v0)} + ${co(b, 't')} + ${co(k2, 't²')}. At t = ${n(T)}: v = ${n(v0)} + ${n(b * T)} + ${n(k2 * T2)} = ${n(v)} m/s. An antiderivative of v(t) is ${n(v0)}t + ${co(h, 't²')} + ${co(k3, 't³')}, which is 0 at t = 0 (the sled starts at position 0). At t = ${n(T)} it is ${n(v0 * T)} + ${n(h * T2)} + ${n(k3 * T3)} = ${n(s1)} m. Braking from ${n(v)} m/s with a = −${n(d)} m/s²: 0 = ${n(v)}² − 2 × ${n(d)} × s, so s = ${n(v * v)} ÷ ${n(2 * d)} = ${n(s2)} m. The total is ${n(s1)} + ${n(s2)} = ${n(tot)} m.`,
  guidance: [
   { prompt: `Integrate a(t) = ${n(b)} + ${n(c)}t and add v(0) = ${n(v0)}: v(t) = ${n(v0)} + ${co(b, 't')} + ${co(k2, 't²')}. What is the speed at t = ${n(T)}, in m/s?`, answer: [v], explanation: `${n(v0)} + ${n(b)} × ${n(T)} + ${n(k2)} × ${n(T2)} = ${n(v)} m/s.` },
   { prompt: `An antiderivative of v(t) is ${n(v0)}t + ${co(h, 't²')} + ${co(k3, 't³')}, which is 0 at t = 0. What is its value at t = ${n(T)}, the distance covered during the boost, in metres?`, answer: [s1], explanation: `${n(v0)} × ${n(T)} + ${n(h)} × ${n(T2)} + ${n(k3)} × ${n(T3)} = ${n(s1)} m.` },
   { prompt: `After cut-out the sled slows from ${n(v)} m/s to rest at a steady ${n(d)} m/s². Using v² = v₀² + 2a(x − x₀) with a final speed of 0, how far does it travel while braking, in metres?`, answer: [s2], explanation: `The braking distance is ${n(v)}² ÷ (2 × ${n(d)}) = ${n(v * v)} ÷ ${n(2 * d)} = ${n(s2)} m.` },
   { prompt: `What is the total distance from the top marker to the point where the sled comes to rest, in metres?`, answer: [tot], explanation: `${n(s1)} + ${n(s2)} = ${n(tot)} m.` }
  ] }; }
});

/* ---- q12 Projectile launched horizontally: two motions at once [4.3] ---- */

/* Drone drop: fall time √(2h ÷ g), distance ut, both to 2 decimal places off rounding ties; not the parent's draws (20, 12) or (10, 5). */
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The drone drop',
 brief: 'A cargo drone is to let go of a crate while flying level over the landing field, and the ground crew needs to know where to stand.',
 labels: ['time to the ground (s)', 'distance ahead (m)'], tolerance: 0.005,
 gl: [['time to the ground (s)'], ['distance ahead (m)']]
}, {
 canonical: { h: 45, u: 16 },
 draw: R => retry(() => ({ h: R.int(8, 90), u: R.int(4, 25) }), p => { const t = Math.sqrt(2 * p.h / g), x = p.u * t;
  return !(p.h === 10 && p.u === 5) && !(p.h === 20 && p.u === 12) && !nearTie(t) && !nearTie(x) && r2(p.u * r2(t)) === r2(x); }, { h: 45, u: 16 }),
 build: ({ h, u }) => { const q = 2 * h / g, t = Math.sqrt(q), x = u * t; return {
  prompt: `A cargo drone flies level at ${n(u)} m/s, ${n(h)} m above the flat ground of the landing field, and lets go of a crate. The crate leaves the drone with the drone’s speed straight ahead and no up or down speed. Ignore the air and take g = 9.8 m/s². Enter the time the crate takes to reach the ground in seconds, then how far ahead of the release point it lands, measured along the ground, in metres. Give both to 2 decimal places, and work out the distance from the unrounded time.`,
  answer: [r2(t), r2(x)],
  hints: ['Look at up and down on its own. The crate starts with no vertical speed, so the drop after t seconds is ½gt². Set that equal to the height and solve for t.', 'Along the ground nothing pushes the crate, so it keeps the drone’s speed for the whole fall: distance ahead = that speed × the fall time.'],
  solution: `Down: ${n(h)} = ½ × 9.8 × t², so t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)} and t = √${n(q)} ${eq(t)} ${n(t)}, which is ${f2(t)} s to 2 decimal places. Ahead: the speed stays ${n(u)} m/s, so the crate lands ${n(u)} × ${n(t)} ≈ ${n(x)} m ahead, which is ${f2(x)} m to 2 decimal places.`,
  guidance: [
   { prompt: `Up and down only: the crate drops ${n(h)} m from no vertical speed, so ${n(h)} = ½ × 9.8 × t². What is t, in seconds, to 2 decimal places?`, answer: [r2(t)], explanation: `t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)}, so t = √${n(q)} ≈ ${f2(t)} s. The drone’s forward speed does not change how long the fall takes.` },
   { prompt: `Along the ground the crate keeps the drone’s ${n(u)} m/s for that whole time. How far ahead of the release point does it land, in metres, to 2 decimal places?`, answer: [r2(x)], explanation: `${n(u)} × ${n(t)} ≈ ${f2(x)} m, using the unrounded time.` }
  ] }; }
});

/* Landing pad: fall time, landing distance ut and the signed margin ut − D past the pad's near edge. D is a whole number of metres. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'Aiming at the landing pad',
 brief: 'A pod must come down on a marked landing pad on the crater floor, and the crew needs to know whether the launcher is aimed to reach it.',
 labels: ['landing distance (m)', 'margin past the edge (m)'], tolerance: 0.005,
 gl: [['time in the air (s)'], ['landing distance (m)'], ['margin past the edge (m)']]
}, {
 canonical: { h: 30, u: 9, D: 21 },
 draw: R => retry(() => { const h = R.int(8, 80), u = R.int(4, 22), x = u * Math.sqrt(2 * h / g); return { h, u, D: Math.max(2, Math.round(x) + R.nz(-6, 6)) }; },
  p => { const t = Math.sqrt(2 * p.h / g), x = p.u * t; return !nearTie(t) && !nearTie(x) && r2(x) !== p.D; }, { h: 30, u: 9, D: 21 }),
 build: ({ h, u, D }) => { const q = 2 * h / g, t = Math.sqrt(q), x = u * t, m = x - D; return {
  prompt: `A pod launcher on the crater rim stands ${n(h)} m above the flat crater floor and fires a pod horizontally at ${n(u)} m/s. A landing pad on the floor has its near edge ${n(D)} m from the foot of the platform, measured along the floor. Ignore the air and take g = 9.8 m/s². Enter how far from the foot of the platform the pod lands, in metres, then how far beyond the near edge of the pad it lands, in metres: a positive number if it lands past the edge, a negative number if it falls short. Give both to 2 decimal places, working from the unrounded time.`,
  answer: [r2(x), r2(m)],
  hints: ['The fall sets the time: the drop is ½gt² from no vertical speed, so set it equal to the height and solve for t. The sideways speed stays the same, so the landing distance is that speed × t.', 'Compare the landing distance with the distance to the pad’s near edge, with the landing distance first: landing distance − distance to the edge. A positive result means past the edge.'],
  solution: `Down: ${n(h)} = ½ × 9.8 × t², so t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)} and t = √${n(q)} ${eq(t)} ${n(t)} s. Sideways: ${n(u)} × ${n(t)} ≈ ${n(x)} m, which is ${f2(x)} m from the foot of the platform. The near edge is ${n(D)} m out, so the pod lands ${n(x)} − ${n(D)} ≈ ${n(m)} m past it, which is ${f2(m)} m to 2 decimal places${m < 0 ? ' (negative: it falls short of the edge)' : ''}.`,
  guidance: [
   { prompt: `The pod drops ${n(h)} m from no vertical speed, so ${n(h)} = ½ × 9.8 × t². What is the time in the air, in seconds, to 2 decimal places?`, answer: [r2(t)], explanation: `t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)}, so t = √${n(q)} ≈ ${f2(t)} s.` },
   { prompt: `Sideways the pod keeps ${n(u)} m/s for that whole time. How far from the foot of the platform does it land, in metres, to 2 decimal places?`, answer: [r2(x)], explanation: `${n(u)} × ${n(t)} ≈ ${f2(x)} m, using the unrounded time.` },
   { prompt: `The near edge of the pad is ${n(D)} m out. What is the landing distance minus ${n(D)}, in metres, to 2 decimal places? (Positive means past the edge, negative means short.)`, answer: [r2(m)], explanation: `${n(x)} − ${n(D)} ≈ ${f2(m)} m${m < 0 ? ', which is negative: the pod falls short of the pad’s edge' : ', which is positive: the pod lands past the near edge'}.` }
  ] }; }
});

/* Fired along a bearing: t = √(2h ÷ g), distance D = ut, east D cos θ, north D sin θ (θ in radians from east). All off rounding ties. */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q03', title: 'The turning launcher',
 brief: 'The launcher on the crater rim can now be turned to any bearing, and the crew wants the exact spot on the floor where each pod lands.',
 labels: ['time in the air (s)', 'east distance (m)', 'north distance (m)'], tolerance: 0.005,
 gl: [['time in the air (s)'], ['distance along the line (m)'], ['east distance (m)'], ['north distance (m)']]
}, {
 canonical: { h: 35, u: 18, th: 0.7 },
 draw: R => retry(() => ({ h: R.int(8, 80), u: R.int(4, 22), th: R.int(3, 12) / 10 }), p => { const t = Math.sqrt(2 * p.h / g), D = p.u * t;
  return p.th !== 1 && ![t, D, D * Math.cos(p.th), D * Math.sin(p.th)].some(nearTie); }, { h: 35, u: 18, th: 0.7 }),
 build: ({ h, u, th }) => { const q = 2 * h / g, t = Math.sqrt(q), D = u * t, c = Math.cos(th), s = Math.sin(th), e = D * c, nn = D * s; return {
  prompt: `The pod launcher on the crater rim can now be turned. It stands ${n(h)} m above the flat crater floor and fires a pod horizontally at ${n(u)} m/s along a line ${n(th)} radians north of east, where x points east and y points north. Ignore the air and take g = 9.8 m/s². Measure distances along the floor from the foot of the platform. Enter the time in the air in seconds, then the east distance and the north distance of the landing point from the foot of the platform, in metres. Give all three to 2 decimal places, working each from unrounded values.`,
  answer: [r2(t), r2(e), r2(nn)],
  hints: ['The turn changes nothing about the fall: it is still a drop from no vertical speed, so ½gt² equals the height. The pod travels at its launch speed for that time along the line it was aimed.', 'Split the distance travelled along the line into components, with the angle in radians: east = distance × cos θ and north = distance × sin θ.'],
  solution: `Down: ${n(h)} = ½ × 9.8 × t², so t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)} and t = √${n(q)} ${eq(t)} ${n(t)}, which is ${f2(t)} s. Along the line the pod travels ${n(u)} × ${n(t)} ≈ ${n(D)} m. East: ${n(D)} × cos ${n(th)} ≈ ${n(D)} × ${n(c)} ≈ ${n(e)}, which is ${f2(e)} m. North: ${n(D)} × sin ${n(th)} ≈ ${n(D)} × ${n(s)} ≈ ${n(nn)}, which is ${f2(nn)} m.`,
  guidance: [
   { prompt: `The pod drops ${n(h)} m from no vertical speed, so ${n(h)} = ½ × 9.8 × t². What is the time in the air, in seconds, to 2 decimal places?`, answer: [r2(t)], explanation: `t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)}, so t = √${n(q)} ≈ ${f2(t)} s.` },
   { prompt: `Along its line the pod keeps ${n(u)} m/s for that whole time. How far along the line does it travel, in metres, to 2 decimal places?`, answer: [r2(D)], explanation: `${n(u)} × ${n(t)} ≈ ${f2(D)} m, using the unrounded time.` },
   { prompt: `The line is ${n(th)} radians north of east. What is the east part of the distance, distance × cos ${n(th)}, in metres to 2 decimal places? (Use the unrounded distance.)`, answer: [r2(e)], explanation: `${n(D)} × cos ${n(th)} ≈ ${n(D)} × ${n(c)} ≈ ${f2(e)} m.` },
   { prompt: `What is the north part of the distance, distance × sin ${n(th)}, in metres to 2 decimal places? (Use the unrounded distance.)`, answer: [r2(nn)], explanation: `${n(D)} × sin ${n(th)} ≈ ${n(D)} × ${n(s)} ≈ ${f2(nn)} m.` }
  ] }; }
});

/* ---- q13 Projectile launched at an angle: range and highest point [4.3] ---- */

/* Beacon launcher, level ground: vy = v sin θ, flight time 2vy ÷ g, range v² sin 2θ ÷ g. Not the parent's draws (20, 0.6) or (15, 1). */
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The beacon launcher',
 brief: 'A launcher on the ridge flings marker beacons across the flat ground, and the crew needs to know how long each one is in the air and where it comes down.',
 labels: ['time in the air (s)', 'range (m)'], tolerance: 0.005,
 gl: [['upward speed (m/s)'], ['time in the air (s)'], ['range (m)']]
}, {
 canonical: { v: 26, th: 0.9 },
 draw: R => retry(() => ({ v: R.int(10, 40), th: R.int(3, 12) / 10 }), p => { const vy = p.v * Math.sin(p.th);
  return p.th !== 1 && !(p.th === 0.6 && p.v === 20) && ![vy, 2 * vy / g, p.v * p.v * Math.sin(2 * p.th) / g].some(nearTie); }, { v: 26, th: 0.9 }),
 build: ({ v, th }) => { const s = Math.sin(th), vy = v * s, T = 2 * vy / g, s2 = Math.sin(2 * th), Rg = v * v * s2 / g; return {
  prompt: `A beacon launcher on the ridge flings a marker beacon from flat ground at ${n(v)} m/s, aimed ${n(th)} radians above the horizontal. The beacon comes down on the same flat ground. Ignore the air and take g = 9.8 m/s². Angles are in radians, so set your calculator that way. Enter the time the beacon is in the air in seconds, then how far from the launcher it lands, measured along the ground, in metres. Give both to 2 decimal places.`,
  answer: [r2(T), r2(Rg)],
  hints: ['Split the launch speed: the upward part is v sin θ and the sideways part is v cos θ. The upward part falls by 9.8 m/s every second, reaches 0 at the top, and the beacon then falls for just as long.', 'On level ground the distance along the ground is v² sin(2θ) ÷ g, which is the sideways speed times the time in the air.'],
  solution: `Upward part of the launch speed: ${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s. Time in the air: 2 × ${n(vy)} ÷ 9.8 ${eq(T)} ${n(T)}, which is ${f2(T)} s. Distance along the ground: ${n(v)}² × sin(2 × ${n(th)}) ÷ 9.8 ≈ ${n(v * v)} × ${n(s2)} ÷ 9.8 ${eq(Rg)} ${n(Rg)}, which is ${f2(Rg)} m.`,
  guidance: [
   { prompt: `What is the upward part of the launch speed, ${n(v)} × sin ${n(th)} (θ in radians), in m/s to 2 decimal places?`, answer: [r2(vy)], explanation: `${n(v)} × sin ${n(th)} ≈ ${n(v)} × ${n(s)} ≈ ${f2(vy)} m/s.` },
   { prompt: `The beacon rises until its upward speed is 0, then falls for just as long. What is the time in the air, 2 × (upward speed) ÷ g, in seconds to 2 decimal places?`, answer: [r2(T)], explanation: `2 × ${n(vy)} ÷ 9.8 ≈ ${f2(T)} s.` },
   { prompt: `The distance along the ground is v² sin(2θ) ÷ g. What is it, in metres to 2 decimal places?`, answer: [r2(Rg)], explanation: `${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ≈ ${n(v * v)} × ${n(s2)} ÷ 9.8 ≈ ${f2(Rg)} m.` }
  ] }; }
});

/* Recovery rover: it drives the range R in the flight time T, so its speed is R ÷ T = v cos θ. */
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The recovery rover',
 brief: 'A recovery rover must be at the landing point the moment a pod comes down, so the crew needs the pod’s range and the speed the rover must drive at.',
 labels: ['range (m)', 'rover speed (m/s)'], tolerance: 0.005,
 gl: [['time in the air (s)'], ['range (m)'], ['rover speed (m/s)']]
}, {
 canonical: { v: 24, th: 0.8 },
 draw: R => retry(() => ({ v: R.int(10, 40), th: R.int(3, 12) / 10 }), p => { const vy = p.v * Math.sin(p.th), T = 2 * vy / g, Rg = p.v * p.v * Math.sin(2 * p.th) / g;
  return p.th !== 1 && !(p.th === 0.6 && p.v === 20) && ![T, Rg, Rg / T].some(nearTie); }, { v: 24, th: 0.8 }),
 build: ({ v, th }) => { const s = Math.sin(th), vy = v * s, T = 2 * vy / g, s2 = Math.sin(2 * th), Rg = v * v * s2 / g, w = Rg / T; return {
  prompt: `A supply pod leaves the catapult on the flat crater floor at ${n(v)} m/s, aimed ${n(th)} radians above the horizontal, and lands on the same floor. At the instant of launch a recovery rover sets off from the catapult in a straight line along the floor at a steady speed, so that it reaches the landing point at the very moment the pod lands. Ignore the air and take g = 9.8 m/s². Angles are in radians. Enter the pod’s range in metres, then the steady speed the rover needs in metres per second. Give both to 2 decimal places, working from unrounded values.`,
  answer: [r2(Rg), r2(w)],
  hints: ['The pod’s time in the air is 2 × (upward speed) ÷ g, where the upward speed is v sin θ. The rover drives for exactly that long.', 'The range on level ground is v² sin(2θ) ÷ g. A steady speed is distance ÷ time, so divide the range by the time in the air.'],
  solution: `Upward part of the launch speed: ${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s, so the pod is in the air for 2 × ${n(vy)} ÷ 9.8 ${eq(T)} ${n(T)} s. Range: ${n(v)}² × sin(2 × ${n(th)}) ÷ 9.8 ≈ ${n(v * v)} × ${n(s2)} ÷ 9.8 ${eq(Rg)} ${n(Rg)}, which is ${f2(Rg)} m. The rover covers that in ${n(T)} s, so its speed is ${n(Rg)} ÷ ${n(T)} ${eq(w)} ${n(w)}, which is ${f2(w)} m/s.`,
  guidance: [
   { prompt: `The pod’s upward speed is ${n(v)} × sin ${n(th)} (θ in radians). What is the time in the air, 2 × (upward speed) ÷ g, in seconds to 2 decimal places?`, answer: [r2(T)], explanation: `${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s, and 2 × ${n(vy)} ÷ 9.8 ≈ ${f2(T)} s.` },
   { prompt: `What is the range v² sin(2θ) ÷ g, in metres to 2 decimal places?`, answer: [r2(Rg)], explanation: `${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ≈ ${n(v * v)} × ${n(s2)} ÷ 9.8 ≈ ${f2(Rg)} m.` },
   { prompt: `The rover covers the range in the same time the pod is in the air. What is its steady speed, range ÷ time, in m/s to 2 decimal places? (Use the unrounded range and time.)`, answer: [r2(w)], explanation: `${n(Rg)} ÷ ${n(T)} ≈ ${f2(w)} m/s.` }
  ] }; }
});

/* Two halves: greatest height H = (v sin θ)² ÷ 2g; from the top the pod is a horizontal launch at v cos θ from height H
   (the q12 method): fall time √(2H ÷ g), horizontal distance v cos θ × that, and the range is twice that distance. */
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q12', title: 'The pod in two halves',
 brief: 'The crew wants to check a launch two ways: the climb to the top, then the drop from the top treated as a sideways launch off a very tall platform.',
 labels: ['greatest height (m)', 'range (m)'], tolerance: 0.005,
 gl: [['greatest height (m)'], ['fall time from the top (s)'], ['distance from the top (m)'], ['range (m)']]
}, {
 canonical: { v: 31, th: 1.1 },
 draw: R => retry(() => ({ v: R.int(10, 40), th: R.int(3, 12) / 10 }), p => { const vy = p.v * Math.sin(p.th), H = vy * vy / (2 * g), tf = Math.sqrt(2 * H / g), xh = p.v * Math.cos(p.th) * tf;
  return p.th !== 1 && !(p.th === 0.6 && p.v === 20) && ![H, tf, xh, 2 * xh].some(nearTie); }, { v: 31, th: 1.1 }),
 build: ({ v, th }) => { const s = Math.sin(th), c = Math.cos(th), vy = v * s, vx = v * c, H = vy * vy / (2 * g), q = 2 * H / g, tf = Math.sqrt(q), xh = vx * tf, Rg = 2 * xh; return {
  prompt: `A pod is thrown from flat crater floor at ${n(v)} m/s, aimed ${n(th)} radians above the horizontal, and lands on the same floor. At the very top of its path the pod has no upward speed and is moving only sideways, at v cos θ, so from the top onwards it moves exactly like a pod fired horizontally from a platform whose height is the greatest height reached. Ignore the air and take g = 9.8 m/s². Angles are in radians. Enter the greatest height in metres, then the range of the whole throw in metres, both to 2 decimal places. Find the range by treating the climb as a mirror image of the drop from the top, so the whole range is twice the sideways distance from the top to the landing point. Work from unrounded values.`,
  answer: [r2(H), r2(Rg)],
  hints: ['The greatest height is (upward speed)² ÷ (2g), with the upward speed v sin θ. From the top, the drop is a fall from no vertical speed: ½gt² equals that height.', 'From the top the sideways speed v cos θ never changes, so the sideways distance to the landing point is v cos θ × the fall time. The climb mirrors the drop, so double it for the whole range.'],
  solution: `Upward part of the launch speed: ${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s. Greatest height: ${n(vy)}² ÷ (2 × 9.8) ${eq(H)} ${n(H)}, which is ${f2(H)} m. Drop from the top: ${n(H)} = ½ × 9.8 × t², so t² = 2 × ${n(H)} ÷ 9.8 ${eq(q)} ${n(q)} and t = √${n(q)} ${eq(tf)} ${n(tf)} s. Sideways speed: ${n(v)} × cos ${n(th)} ≈ ${n(vx)} m/s, so the distance from the top to the landing point is ${n(vx)} × ${n(tf)} ≈ ${n(xh)} m. The whole range is twice that: ${n(Rg)} m, which is ${f2(Rg)} m to 2 decimal places.`,
  guidance: [
   { prompt: `The upward part of the launch speed is ${n(v)} × sin ${n(th)} (θ in radians). What is the greatest height, (upward speed)² ÷ (2g), in metres to 2 decimal places?`, answer: [r2(H)], explanation: `${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s, and ${n(vy)}² ÷ 19.6 ≈ ${f2(H)} m.` },
   { prompt: `From the top, the pod drops that height from no vertical speed. What is the fall time, from H = ½ × 9.8 × t², in seconds to 2 decimal places? (Use the unrounded height.)`, answer: [r2(tf)], explanation: `t² = 2 × ${n(H)} ÷ 9.8 ${eq(q)} ${n(q)}, so t = √${n(q)} ≈ ${f2(tf)} s.` },
   { prompt: `Sideways the pod keeps ${n(v)} × cos ${n(th)} for that time. What is the sideways distance from the top to the landing point, in metres to 2 decimal places? (Use unrounded values.)`, answer: [r2(xh)], explanation: `${n(vx)} × ${n(tf)} ≈ ${f2(xh)} m.` },
   { prompt: `The climb mirrors the drop, so the range is twice the distance from the top to the landing point. What is the range, in metres to 2 decimal places? (Double the unrounded distance.)`, answer: [r2(Rg)], explanation: `2 × ${n(xh)} ≈ ${f2(Rg)} m.` }
  ] }; }
});

/* ---- q14 Uniform circular motion: period and centripetal acceleration [4.4] ---- */

/* Rotor with N turns a minute: T = 60 ÷ N, v = 2πr ÷ T, a = v² ÷ r. All off rounding ties. */
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The test rotor',
 brief: 'A test rotor spins sensor pods on an arm to prove them for the catapult, and the crew needs each pod’s speed and the pull it must resist.',
 labels: ['speed (m/s)', 'centripetal acceleration (m/s²)'], tolerance: 0.005,
 gl: [['period (s)'], ['speed (m/s)'], ['centripetal acceleration (m/s²)']]
}, {
 canonical: { r: 6, N: 20 },
 draw: R => retry(() => ({ r: R.int(2, 12), N: R.int(10, 90) }), p => { const T = 60 / p.N, v = 2 * PI * p.r / T, a = v * v / p.r;
  return ![T, v, a, 2 * PI * p.r].some(nearTie) && a < 900; }, { r: 6, N: 20 }),
 build: ({ r, N }) => { const T = 60 / N, C = 2 * PI * r, v = C / T, a = v * v / r; return {
  prompt: `A test rotor in the catapult workshop carries a sensor pod on an arm that is ${n(r)} m long, so the pod goes round a circle of radius ${n(r)} m. The rotor turns steadily at ${n(N)} full turns every minute, so one full turn takes 60 ÷ ${n(N)} seconds. Enter the pod’s speed in metres per second, then the size of its centripetal acceleration in metres per second squared, both to 2 decimal places. Work out the acceleration from the unrounded speed.`,
  answer: [r2(v), r2(a)],
  hints: ['One full turn is a distance of 2πr and takes the period, so the speed is 2πr divided by the period. The period is the time for one turn, 60 seconds divided by the number of turns in a minute.', 'The centripetal acceleration points at the centre of the circle and has size v² ÷ r.'],
  solution: `One turn takes 60 ÷ ${n(N)} ${eq(T)} ${n(T)} s, and covers 2π × ${n(r)} ≈ ${n(C)} m, so v = ${n(C)} ÷ ${n(T)} ${eq(v)} ${n(v)}, which is ${f2(v)} m/s. The centripetal acceleration is v² ÷ r = ${n(v)}² ÷ ${n(r)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s², pointing at the centre.`,
  guidance: [
   { prompt: `One full turn takes 60 ÷ ${n(N)} seconds. What is the period, in seconds, to 2 decimal places?`, answer: [r2(T)], explanation: `60 ÷ ${n(N)} ≈ ${f2(T)} s.` },
   { prompt: `In one period the pod goes once round the circle, a distance of 2π × ${n(r)} m. What is its speed, in m/s to 2 decimal places? (Use the unrounded period.)`, answer: [r2(v)], explanation: `${n(C)} ÷ ${n(T)} ≈ ${f2(v)} m/s.` },
   { prompt: `What is the centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(v)}² ÷ ${n(r)} ≈ ${f2(a)} m/s², pointing at the centre.` }
  ] }; }
});

/* Clamp limit a: v = √(a·r), period 2πr ÷ v, turns a minute 60 ÷ period. All off rounding ties. */
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'The clamp limit',
 brief: 'A pod clamp on the sling arm can only hold so much pull, and the crew needs the fastest safe spin for the arm.',
 labels: ['greatest speed (m/s)', 'shortest period (s)', 'turns per minute'], tolerance: 0.005,
 gl: [['greatest speed (m/s)'], ['shortest period (s)'], ['turns per minute']]
}, {
 canonical: { a: 50, r: 4 },
 draw: R => retry(() => ({ a: R.int(20, 120), r: R.int(2, 12) }), p => { const v = Math.sqrt(p.a * p.r), T = 2 * PI * p.r / v;
  return ![v, T, 60 / T].some(nearTie) && Math.abs(v * v - Math.round(v) ** 2) > 1e-6; }, { a: 50, r: 4 }),
 build: ({ a, r }) => { const ar = a * r, v = Math.sqrt(ar), C = 2 * PI * r, T = C / v, N = 60 / T; return {
  prompt: `The clamp that holds a pod on the catapult’s sling arm fails if the pod’s centripetal acceleration goes above ${n(a)} m/s². The arm carries the pod round a circle of radius ${n(r)} m at a steady speed, and the centripetal acceleration is a = v² ÷ r. Enter the greatest speed the pod can have, in metres per second, then the shortest time for one full turn (the period), in seconds, then the greatest number of full turns per minute. Give all three to 2 decimal places, working each from the unrounded value before it.`,
  answer: [r2(v), r2(T), r2(N)],
  hints: ['Rearrange a = v² ÷ r into v² = a × r, then take the square root for the speed at the limit.', 'The speed is 2πr ÷ T, so the period is 2πr divided by the speed. The turns in a minute are 60 seconds divided by the period.'],
  solution: `v² = a × r = ${n(a)} × ${n(r)} = ${n(ar)}, so v = √${n(ar)} ${eq(v)} ${n(v)}, which is ${f2(v)} m/s. One turn is 2π × ${n(r)} ≈ ${n(C)} m, so the period is ${n(C)} ÷ ${n(v)} ${eq(T)} ${n(T)}, which is ${f2(T)} s. Turns per minute: 60 ÷ ${n(T)} ${eq(N)} ${n(N)}, which is ${f2(N)}.`,
  guidance: [
   { prompt: `At the limit v² ÷ ${n(r)} = ${n(a)}, so v² = ${n(a)} × ${n(r)}. What is v, in m/s to 2 decimal places?`, answer: [r2(v)], explanation: `v² = ${n(ar)}, so v = √${n(ar)} ≈ ${f2(v)} m/s.` },
   { prompt: `One turn is a distance of 2π × ${n(r)} m. At the speed you just found, how long does one turn take, in seconds to 2 decimal places? (Use the unrounded speed.)`, answer: [r2(T)], explanation: `${n(C)} ÷ ${n(v)} ≈ ${f2(T)} s.` },
   { prompt: `How many full turns is that per minute, 60 ÷ period, to 2 decimal places? (Use the unrounded period.)`, answer: [r2(N)], explanation: `60 ÷ ${n(T)} ≈ ${f2(N)} turns per minute.` }
  ] }; }
});

/* Speed given in km/h (a multiple of 3.6, so v is a whole number of m/s): v = kmh ÷ 3.6, T = 2πr ÷ v, a = v² ÷ r. */
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q01', title: 'The clocked pod',
 brief: 'A pod on the test arm is clocked in kilometres per hour, and the crew needs its speed, its period and its centripetal acceleration in the units the arm is built in.',
 labels: ['speed (m/s)', 'period (s)', 'centripetal acceleration (m/s²)'], tolerance: 0.005,
 gl: [['speed (m/s)'], ['period (s)'], ['centripetal acceleration (m/s²)']]
}, {
 canonical: { kmh: 54, r: 25 },
 draw: R => retry(() => ({ kmh: R.pick([18, 36, 54, 72, 90, 108]), r: R.int(4, 60) }), p => { const v = p.kmh / 3.6, T = 2 * PI * p.r / v, a = v * v / p.r;
  return !nearTie(T) && !nearTie(a); }, { kmh: 54, r: 25 }),
 build: ({ kmh, r }) => { const v = kmh / 3.6, C = 2 * PI * r, T = C / v, a = v * v / r; return {
  prompt: `A pod on the catapult’s test arm is clocked at ${n(kmh)} km/h while it travels at a steady speed round a circle of radius ${n(r)} m. The arm’s design sheet uses metres and seconds. Enter the pod’s speed in metres per second, then the time for one full turn (the period) in seconds, then the size of its centripetal acceleration in metres per second squared. Give the speed exactly, and the other two to 2 decimal places, working from unrounded values.`,
  answer: [v, r2(T), r2(a)],
  hints: ['Convert first: 1 km/h is 1000 m in 3600 s, so divide the speed in km/h by 3.6 to get m/s.', 'One turn is a distance of 2πr, and the period is that distance divided by the speed. The centripetal acceleration has size v² ÷ r.'],
  solution: `${n(kmh)} km/h = ${n(kmh)} ÷ 3.6 = ${n(v)} m/s. One turn is 2π × ${n(r)} ≈ ${n(C)} m, so the period is ${n(C)} ÷ ${n(v)} ${eq(T)} ${n(T)}, which is ${f2(T)} s. The centripetal acceleration is v² ÷ r = ${n(v)}² ÷ ${n(r)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s².`,
  guidance: [
   { prompt: `Convert ${n(kmh)} km/h to metres per second by dividing by 3.6. What is the speed, in m/s?`, answer: [v], explanation: `${n(kmh)} ÷ 3.6 = ${n(v)} m/s.` },
   { prompt: `One turn is a distance of 2π × ${n(r)} m. At ${n(v)} m/s, how long does one turn take, in seconds to 2 decimal places?`, answer: [r2(T)], explanation: `${n(C)} ÷ ${n(v)} ≈ ${f2(T)} s.` },
   { prompt: `What is the centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(v)}² ÷ ${n(r)} ≈ ${f2(a)} m/s², pointing at the centre.` }
  ] }; }
});

/* ---- q15 Speeding up on a circle: tangential and total acceleration [4.4] ---- */

/* Tram on a ring track: a_c = v² ÷ r, total √(a_c² + a_t²), both off rounding ties and not close to the larger part. */
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The ring-track tram',
 brief: 'A cargo tram is speeding up round the ring track at the edge of the field, and the crew wants to know how hard the track and the motor each have to push it.',
 labels: ['centripetal acceleration (m/s²)', 'total acceleration (m/s²)'], tolerance: 0.005,
 gl: [['centripetal acceleration (m/s²)'], ['total acceleration (m/s²)']]
}, {
 canonical: { r: 60, v: 15, at: 1.2 },
 draw: R => retry(() => ({ r: R.int(20, 120), v: R.int(6, 30), at: R.int(2, 18) / 10 }), p => { const ac = p.v * p.v / p.r, tot = Math.hypot(ac, p.at);
  return !nearTie(ac) && !nearTie(tot) && Math.abs(tot - Math.max(ac, p.at)) > 0.05; }, { r: 60, v: 15, at: 1.2 }),
 build: ({ r, v, at }) => { const ac = v * v / r, tot = Math.hypot(ac, at); return {
  prompt: `A cargo tram runs round a circular ring track of radius ${n(r)} m at the edge of the landing field. At one moment it is moving at ${n(v)} m/s and its speed is rising by ${n(at)} m/s every second along the track (its tangential acceleration). Enter the size of its centripetal acceleration at that moment, then the size of its total acceleration, both in metres per second squared and to 2 decimal places.`,
  answer: [r2(ac), r2(tot)],
  hints: ['The centripetal part points at the centre of the circle and has size v² ÷ r, whether or not the speed is changing.', 'The tangential part points along the track, at a right angle to the centripetal part, so the total is the square root of (centripetal² + tangential²).'],
  solution: `Centripetal: ${n(v)}² ÷ ${n(r)} = ${n(v * v)} ÷ ${n(r)} ${eq(ac)} ${n(ac)}, which is ${f2(ac)} m/s². The tangential part, ${n(at)} m/s², is at a right angle to it, so the total is √(${n(ac)}² + ${n(at)}²) ${eq(tot)} ${n(tot)}, which is ${f2(tot)} m/s².`,
  guidance: [
   { prompt: `What is the centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?`, answer: [r2(ac)], explanation: `${n(v * v)} ÷ ${n(r)} ≈ ${f2(ac)} m/s², pointing at the centre.` },
   { prompt: `The tangential acceleration is ${n(at)} m/s² along the track, at a right angle to the centripetal one. What is the size of the total, √(a_c² + a_t²), in m/s² to 2 decimal places? (Use the unrounded centripetal value.)`, answer: [r2(tot)], explanation: `√(${n(ac)}² + ${n(at)}²) ≈ ${f2(tot)} m/s².` }
  ] }; }
});

/* Wind-up from rest: v = a_t·t (steady gain from rest), a_c = v² ÷ r, total √(a_c² + a_t²). */
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The arm’s first seconds',
 brief: 'The sling arm starts from rest and speeds up steadily, and the crew wants to know how much the pod is pulled and pushed a few seconds into the wind-up.',
 labels: ['centripetal acceleration (m/s²)', 'total acceleration (m/s²)'], tolerance: 0.005,
 gl: [['speed (m/s)'], ['centripetal acceleration (m/s²)'], ['total acceleration (m/s²)']]
}, {
 canonical: { r: 12, at: 1.5, t: 6 },
 draw: R => retry(() => ({ r: R.int(3, 20), at: R.int(5, 40) / 10, t: R.int(2, 9) }), p => { const v = Math.round(p.at * p.t * 10) / 10, ac = v * v / p.r, tot = Math.hypot(ac, p.at);
  return !nearTie(ac) && !nearTie(tot) && Math.abs(tot - Math.max(ac, p.at)) > 0.05; }, { r: 12, at: 1.5, t: 6 }),
 build: ({ r, at, t }) => { const v = Math.round(at * t * 10) / 10, ac = v * v / r, tot = Math.hypot(ac, at); return {
  prompt: `The catapult’s sling arm carries a pod round a circle of radius ${n(r)} m. The arm starts from rest and its speed rises steadily, by ${n(at)} m/s every second along the path (its tangential acceleration, which stays the same). Because it gains the same speed every second from rest, its speed after t seconds is the tangential acceleration × t. For the moment ${n(t)} s after the start, enter the size of the pod’s centripetal acceleration, then the size of its total acceleration, both in metres per second squared and to 2 decimal places.`,
  answer: [r2(ac), r2(tot)],
  hints: ['First find the speed at the asked time: gaining the same amount every second from rest, speed = tangential acceleration × time. Then the centripetal acceleration is that speed squared ÷ r.', 'The tangential part points along the path, at a right angle to the centripetal part, so the total is the square root of (centripetal² + tangential²).'],
  solution: `The speed after ${n(t)} s is ${n(at)} × ${n(t)} = ${n(v)} m/s. Centripetal: ${n(v)}² ÷ ${n(r)} = ${n(v * v)} ÷ ${n(r)} ${eq(ac)} ${n(ac)}, which is ${f2(ac)} m/s². The tangential part is ${n(at)} m/s², at a right angle to it, so the total is √(${n(ac)}² + ${n(at)}²) ${eq(tot)} ${n(tot)}, which is ${f2(tot)} m/s².`,
  guidance: [
   { prompt: `The speed after ${n(t)} s is the tangential acceleration × the time, ${n(at)} × ${n(t)}. What is it, in m/s?`, answer: [v], explanation: `${n(at)} × ${n(t)} = ${n(v)} m/s.` },
   { prompt: `What is the centripetal acceleration v² ÷ r at that moment, in m/s² to 2 decimal places?`, answer: [r2(ac)], explanation: `${n(v)}² ÷ ${n(r)} = ${n(v * v)} ÷ ${n(r)} ≈ ${f2(ac)} m/s².` },
   { prompt: `The tangential acceleration is ${n(at)} m/s², at a right angle to the centripetal one. What is the size of the total, in m/s² to 2 decimal places? (Use the unrounded centripetal value.)`, answer: [r2(tot)], explanation: `√(${n(ac)}² + ${n(at)}²) ≈ ${f2(tot)} m/s².` }
  ] }; }
});

/* Rover on a test track: a_t = (v2 − v1) ÷ Δt (an average acceleration, q08), a_c = v2² ÷ r, total √(a_c² + a_t²). a_t has at most 2 decimal places. */
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q08', title: 'The test-track rover',
 brief: 'A rover on the circular proving track is clocked speeding up between two readings, and the crew wants every part of its acceleration at the second one.',
 labels: ['tangential acceleration (m/s²)', 'centripetal acceleration (m/s²)', 'total acceleration (m/s²)'], tolerance: 0.005,
 gl: [['tangential acceleration (m/s²)'], ['centripetal acceleration (m/s²)'], ['total acceleration (m/s²)']]
}, {
 canonical: { r: 20, v1: 4, v2: 10, dt: 3 },
 draw: R => retry(() => { const v1 = R.int(2, 12); return { r: R.int(4, 40), v1, v2: v1 + R.int(2, 14), dt: R.pick([2, 4, 5, 8, 10]) }; }, p => { const at = (p.v2 - p.v1) / p.dt, ac = p.v2 * p.v2 / p.r, tot = Math.hypot(ac, at);
  return exact2(at) && !nearTie(ac) && !nearTie(tot) && Math.abs(tot - Math.max(ac, at)) > 0.05; }, { r: 20, v1: 4, v2: 10, dt: 3 }),
 build: ({ r, v1, v2, dt }) => { const at = (v2 - v1) / dt, ac = v2 * v2 / r, tot = Math.hypot(ac, at); return {
  prompt: `A rover is driven round the circular proving track, whose radius is ${n(r)} m. A first reading clocks its speed at ${n(v1)} m/s, and ${n(dt)} s later a second reading clocks it at ${n(v2)} m/s. Take its speed as rising steadily between the readings, so its tangential acceleration is the same throughout. Enter its tangential acceleration in metres per second squared, then, at the moment of the second reading, the size of its centripetal acceleration and the size of its total acceleration, both in metres per second squared and to 2 decimal places. The tangential acceleration is exact, with at most 2 decimal places.`,
  answer: [at, r2(ac), r2(tot)],
  hints: ['The tangential acceleration is the steady rate at which the speed changes: (change in speed) ÷ (time taken).', 'At the second reading the centripetal acceleration is that speed squared ÷ r. The tangential part points along the track at a right angle to it, so the total is the square root of (centripetal² + tangential²).'],
  solution: `The speed rises from ${n(v1)} to ${n(v2)} m/s in ${n(dt)} s, so the tangential acceleration is (${n(v2)} − ${n(v1)}) ÷ ${n(dt)} = ${n(at)} m/s². At the second reading the centripetal acceleration is ${n(v2)}² ÷ ${n(r)} = ${n(v2 * v2)} ÷ ${n(r)} ${eq(ac)} ${n(ac)}, which is ${f2(ac)} m/s². The total is √(${n(ac)}² + ${n(at)}²) ${eq(tot)} ${n(tot)}, which is ${f2(tot)} m/s².`,
  guidance: [
   { prompt: `The speed rises steadily from ${n(v1)} m/s to ${n(v2)} m/s in ${n(dt)} s. What is the tangential acceleration, (change in speed) ÷ time, in m/s²?`, answer: [at], explanation: `(${n(v2)} − ${n(v1)}) ÷ ${n(dt)} = ${n(at)} m/s².` },
   { prompt: `At the second reading the speed is ${n(v2)} m/s. What is the centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?`, answer: [r2(ac)], explanation: `${n(v2 * v2)} ÷ ${n(r)} ≈ ${f2(ac)} m/s².` },
   { prompt: `What is the size of the total acceleration, √(a_c² + a_t²), in m/s² to 2 decimal places? (Use the unrounded centripetal value.)`, answer: [r2(tot)], explanation: `√(${n(ac)}² + ${n(at)}²) ≈ ${f2(tot)} m/s².` }
  ] }; }
});

})();
