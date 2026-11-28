/* Mechanics: motion and force practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p5.js. */
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
const g = 9.8, PI = Math.PI;
/* r2 rounds to 2 decimal places; f2 prints that; s4 prints a sine or cosine to 4 places for the working. */
const r2 = x => Math.round(x * 100) / 100, f2 = x => n(r2(x)), s4 = x => n(Math.round(x * 1e4) / 1e4);
/* "=" when x is already exact at 2 decimal places, otherwise "≈", so a solution never writes ≈ before an exact value. */
const ap = x => Math.abs(Math.round(x * 100) / 100 - x) < 1e-9 ? '=' : '≈';
/* A value is safe to ask to 2 decimal places when it is not near a rounding tie (…5 in the third place). */
const safe = (...xs) => xs.every(x => { const f = Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100); return Math.abs(f - 0.5) > 0.02; });
/* True when two numbers differ by less than the 0.005 tolerance with room to spare: used to check that a player who rounds
   an early step to 2 decimal places still lands inside the tolerance of the final answer. */
const near = (a, b) => Math.abs(a - b) < 0.004;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canonical }; };
/* "1 radian", "0.35 radians". */
const rad = th => th === 1 ? '1 radian' : `${n(th)} radians`;

/* ---- q21 The inclined plane: weight along and across a ramp [5.6] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'Trolley on the gantry rail',
 brief: 'A maintenance trolley is parked on a tilted gantry rail in the Crane Yard, and the riggers want to know what the brake block and the rail must carry.',
 labels: ['along the rail (N)', 'normal force (N)'], tolerance: 0.005,
 gl: [['along the rail (N)'], ['normal force (N)']]
}, {
 /* The weight W is given in newtons (a multiple of 50 from 300 to 3000), so no mass or g is needed. Angle 0.2 to 0.9 rad. */
 canonical: { W: 1200, th: 0.35 },
 draw: R => tryDraw(() => ({ W: 50 * R.int(6, 60), th: R.int(4, 18) / 20 }), p => safe(p.W * Math.sin(p.th), p.W * Math.cos(p.th)), { W: 1200, th: 0.35 }),
 build: ({ W, th }) => { const sn = Math.sin(th), cs = Math.cos(th), along = W * sn, normal = W * cs; return {
  prompt: `A maintenance trolley in the Crane Yard stands on a gantry rail that rises at ${rad(th)} above the horizontal. The trolley weighs ${n(W)} N, and a brake block holds it still. The only forces across the rail are the trolley’s weight and the normal force from the rail. Enter the part of the weight that pulls the trolley down along the rail, then the normal force, both in newtons to 2 decimal places. Type the numbers without commas.`,
  answer: [r2(along), r2(normal)],
  hints: ['The weight is already given in newtons, so you need no mass and no g. Turn your axes to match the rail: one along it, one straight out of its surface. The angle between the weight and the line straight into the rail is the rail’s own angle.', 'The part of the weight along the rail is w sin θ and the part pressing into the rail is w cos θ. Nothing moves across the rail, so the normal force is as large as the part pressing in. Set your calculator to radians.'],
  solution: `The weight is w = ${n(W)} N and the rail angle is θ = ${n(th)} radians, with sin θ ≈ ${s4(sn)} and cos θ ≈ ${s4(cs)}. Along the rail: w sin θ = ${n(W)} × sin ${n(th)} ${ap(along)} ${f2(along)} N. Into the rail: w cos θ = ${n(W)} × cos ${n(th)} ${ap(normal)} ${f2(normal)} N. Nothing moves across the rail, so the normal force balances that part: N ${ap(normal)} ${f2(normal)} N.`,
  guidance: [
   { prompt: `The part of the ${n(W)} N weight along the rail is w sin θ, with θ = ${n(th)} radians. What is it, in newtons to 2 decimal places?`, answer: [r2(along)], explanation: `sin ${n(th)} ≈ ${s4(sn)}, so w sin θ = ${n(W)} × sin ${n(th)} ${ap(along)} ${f2(along)} N.` },
   { prompt: `The part pressing into the rail is w cos θ, and the normal force balances it. What is the normal force, in newtons to 2 decimal places?`, answer: [r2(normal)], explanation: `cos ${n(th)} ≈ ${s4(cs)}, so N = w cos θ = ${n(W)} × cos ${n(th)} ${ap(normal)} ${f2(normal)} N.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Loaded trailer on the ramp',
 brief: 'A trailer of crates waits on the loading ramp, and the riggers need the cable load, the load on the ramp, and how fast it would run away if the cable let go.',
 labels: ['cable tension (N)', 'normal force (N)', 'acceleration (m/s²)'], tolerance: 0.005,
 gl: [['cable tension (N)'], ['normal force (N)'], ['acceleration (m/s²)']]
}, {
 /* k identical crates of mass m on a trailer of negligible mass, ramp angle th. Cable along the ramp: T = w sin θ. If it snaps, the
    smooth trailer has net force w sin θ along the ramp, so a = (w sin θ) ÷ (k m) = g sin θ. */
 canonical: { m: 25, k: 4, th: 0.45 },
 draw: R => tryDraw(() => ({ m: 5 * R.int(3, 16), k: R.int(2, 6), th: R.int(4, 16) / 20 }),
  p => { const M = p.m * p.k, w = G.tidy(M * g); return safe(w * Math.sin(p.th), w * Math.cos(p.th), g * Math.sin(p.th)); }, { m: 25, k: 4, th: 0.45 }),
 build: ({ m, k, th }) => { const M = m * k, w = G.tidy(M * g), sn = Math.sin(th), cs = Math.cos(th), T = w * sn, N = w * cs, a = T / M; return {
  prompt: `A trailer in the Crane Yard carries ${n(k)} identical crates, each of mass ${n(m)} kg, and stands on a loading ramp that rises at ${rad(th)} above the horizontal. A cable laid along the ramp holds the trailer still. The trailer’s own mass can be ignored, and friction can be ignored. Take g = 9.8 m/s². Enter the tension in the cable, then the normal force of the ramp on the trailer, both in newtons; then the acceleration down the ramp that the trailer would have if the cable suddenly snapped, in m/s². Give all three to 2 decimal places, and type them without commas.`,
  answer: [r2(T), r2(N), r2(a)],
  hints: ['The cable holds the trailer still, so the cable’s pull up the ramp balances the part of the total weight that points down along the ramp. The normal force balances the part pressing into the ramp.', 'If the cable snapped, the only force left along the ramp would be the part of the weight along it, and Newton’s second law gives a = that force ÷ the total mass. Use the mass of all the crates together.'],
  solution: `The total mass is ${n(k)} × ${n(m)} = ${n(M)} kg, so the weight is w = ${n(M)} × 9.8 = ${n(w)} N. With θ = ${n(th)} radians, sin θ ≈ ${s4(sn)} and cos θ ≈ ${s4(cs)}. The cable balances the part along the ramp: T = w sin θ ${ap(T)} ${f2(T)} N. The normal force balances the part pressing in: N = w cos θ ${ap(N)} ${f2(N)} N. If the cable snapped, w sin θ would be the whole net force along the ramp, so a = ${f2(T)} ÷ ${n(M)} ${ap(a)} ${f2(a)} m/s².`,
  guidance: [
   { prompt: `The cable balances the part of the total weight along the ramp. The ${n(k)} crates weigh ${n(w)} N together. What is the cable tension, w sin θ, in newtons to 2 decimal places?`, answer: [r2(T)], explanation: `sin ${n(th)} ≈ ${s4(sn)}, so T = ${n(w)} × sin ${n(th)} ${ap(T)} ${f2(T)} N.` },
   { prompt: `What is the normal force, w cos θ, in newtons to 2 decimal places?`, answer: [r2(N)], explanation: `cos ${n(th)} ≈ ${s4(cs)}, so N = ${n(w)} × cos ${n(th)} ${ap(N)} ${f2(N)} N.` },
   { prompt: `Without the cable the net force along the ramp is w sin θ and it moves all ${n(M)} kg. What is the acceleration, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `a = ${f2(T)} ÷ ${n(M)} ${ap(a)} ${f2(a)} m/s². The mass cancels, so the same ramp gives the same acceleration to any load.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q03', title: 'Ramp from the survey drawing',
 brief: 'The survey drawing of a new ramp gives its rise and run in metres but no angle, and the riggers still need the load on the cable and the deck.',
 labels: ['slope length (m)', 'along the ramp (N)', 'normal force (N)'], tolerance: 0.005,
 gl: [['slope length (m)'], ['along the ramp (N)'], ['normal force (N)']]
}, {
 /* Rise H and run Rn are the two shorter sides of a right triangle with a whole-number slope length L (3-4-5, 5-12-13, 8-15-17, 7-24-25
    scaled by 1 to 4), either way round. Mass is a multiple of 2.5 kg from 20 to 120. */
 canonical: { m: 62.5, H: 9, Rn: 12 },
 draw: R => tryDraw(() => { const t = R.pick([[3, 4], [5, 12], [8, 15], [7, 24]]), s = R.int(1, 4), a = t[0] * s, b = t[1] * s, sw = R.bool(); return { m: 2.5 * R.int(8, 48), H: sw ? b : a, Rn: sw ? a : b }; },
  p => { const L = Math.sqrt(p.H * p.H + p.Rn * p.Rn), w = G.tidy(p.m * g); return safe(w * p.H / L, w * p.Rn / L); }, { m: 62.5, H: 9, Rn: 12 }),
 build: ({ m, H, Rn }) => { const L = Math.round(Math.sqrt(H * H + Rn * Rn)), w = G.tidy(m * g), along = w * H / L, N = w * Rn / L; return {
  prompt: `The survey drawing of a new loading ramp beside the Crane Yard shows that it rises ${n(H)} m over a horizontal run of ${n(Rn)} m, and gives no angle. A cargo sled of mass ${n(m)} kg sits on it, held still by a cable laid along the ramp. The only forces across the ramp are the sled’s weight and the normal force from the ramp. Take g = 9.8 m/s². Enter the length of the sloping surface in metres, then the part of the sled’s weight that points down along the ramp, then the normal force, both in newtons to 2 decimal places. Type the numbers without commas.`,
  answer: [L, r2(along), r2(N)],
  hints: ['The rise, the run and the sloping surface form a right triangle, and the sloping surface is its longest side: find it with Pythagoras. In that triangle sin θ is the rise ÷ the sloping length and cos θ is the run ÷ the sloping length, so you do not need the angle itself.', 'The part of the weight along the ramp is w sin θ, so w × rise ÷ sloping length. The normal force balances the part pressing in, w cos θ, so w × run ÷ sloping length. The weight is the mass × 9.8.'],
  solution: `The sloping length is √(${n(H)}² + ${n(Rn)}²) = √${n(H * H + Rn * Rn)} = ${n(L)} m. In that triangle sin θ = ${n(H)} ÷ ${n(L)} and cos θ = ${n(Rn)} ÷ ${n(L)}. The weight is w = ${n(m)} × 9.8 = ${n(w)} N. Along the ramp: w sin θ = ${n(w)} × ${n(H)} ÷ ${n(L)} ${ap(along)} ${f2(along)} N. Into the ramp: w cos θ = ${n(w)} × ${n(Rn)} ÷ ${n(L)} ${ap(N)} ${f2(N)} N, and the normal force balances it: N ${ap(N)} ${f2(N)} N.`,
  guidance: [
   { prompt: `The rise ${n(H)} m and the run ${n(Rn)} m are the two shorter sides of a right triangle. What is the length of the sloping surface, in metres?`, answer: [L], explanation: `√(${n(H)}² + ${n(Rn)}²) = √${n(H * H + Rn * Rn)} = ${n(L)} m.` },
   { prompt: `The weight of the ${n(m)} kg sled is ${n(w)} N. The part of it along the ramp is w sin θ, where sin θ = rise ÷ sloping length. What is it, in newtons to 2 decimal places?`, answer: [r2(along)], explanation: `w sin θ = ${n(w)} × ${n(H)} ÷ ${n(L)} ${ap(along)} ${f2(along)} N.` },
   { prompt: `The normal force balances w cos θ, where cos θ = run ÷ sloping length. What is it, in newtons to 2 decimal places?`, answer: [r2(N)], explanation: `N = w cos θ = ${n(w)} × ${n(Rn)} ÷ ${n(L)} ${ap(N)} ${f2(N)} N.` }
  ] }; }
});

/* ---- q22 Static and kinetic friction [6.2] ---- */

/* A body of weight W (newtons) on a slope: normal force, pull along the slope, the greatest static friction, and what actually acts. */
const slope = ({ W, th, us, uk }) => { const N = W * Math.cos(th), along = W * Math.sin(th), fs = us * N, holds = along <= fs, fr = holds ? along : uk * N; return { N, along, fs, holds, fr, net: holds ? 0 : along - uk * N }; };

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Fuel drum on the gantry slope',
 brief: 'A fuel drum is set down on a steel slope beside the gantry, and the crew want to know whether it grips or creeps, and how hard it is pulled if it creeps.',
 labels: ['friction force (N)', 'net force along the slope (N)'], tolerance: 0.005,
 gl: [['normal force (N)'], ['greatest static friction (N)'], ['pull along the slope (N)'], ['friction force (N)'], ['net force along the slope (N)']]
}, {
 /* Weight 300 to 2500 N, angle 0.2 to 0.8 rad, μs 0.3 to 0.9, μk 0.1 to 0.3 below μs. tan θ is kept at least 0.03 from μs so the case is clear. */
 canonical: { W: 900, th: 0.55, us: 0.5, uk: 0.35 },
 draw: R => tryDraw(() => { const us = R.int(3, 9) / 10; return { W: 50 * R.int(6, 50), th: R.int(4, 16) / 20, us, uk: G.tidy(Math.max(0.1, us - R.int(1, 3) / 10)) }; },
  p => { if (p.uk >= p.us || Math.abs(Math.tan(p.th) - p.us) < 0.03) return false; const v = slope(p); return safe(v.N, v.fs, v.along, v.fr, v.net); }, { W: 900, th: 0.55, us: 0.5, uk: 0.35 }),
 build: p => { const { W, th, us, uk } = p, v = slope(p); return {
  prompt: `A fuel drum weighing ${n(W)} N is set down at rest on a steel slope beside the Crane Yard gantry. The slope rises at ${rad(th)}. Between the drum and the slope the coefficient of static friction is μs = ${n(us)} and the coefficient of kinetic friction is μk = ${n(uk)}. Only gravity, the normal force and friction act on the drum. Enter the size of the friction force on the drum in newtons, then the size of the net force on the drum along the slope in newtons (enter 0 if it stays at rest), both to 2 decimal places. Type the numbers without commas.`,
  answer: [r2(v.fr), r2(v.net)],
  hints: ['The weight is given in newtons, so N = w cos θ with no g needed. Static friction can grip with any force up to μs N, and no more.', 'Compare the pull of gravity along the slope, w sin θ, with μs N. If the pull is smaller, static friction matches it exactly, the drum stays put and the net force is 0. If it is larger, the drum slides, kinetic friction μk N acts up the slope, and the net force down the slope is w sin θ − μk N.'],
  solution: `N = w cos θ = ${n(W)} × cos ${n(th)} ${ap(v.N)} ${f2(v.N)} N. The greatest static friction is μs N ≈ ${n(us)} × ${f2(v.N)} ${ap(v.fs)} ${f2(v.fs)} N. The pull along the slope is w sin θ = ${n(W)} × sin ${n(th)} ${ap(v.along)} ${f2(v.along)} N. ` + (v.holds
   ? `That is less than ${f2(v.fs)} N, so static friction holds the drum. It matches the pull exactly: the friction force is ${ap(v.fr)} ${f2(v.fr)} N, and the net force along the slope is 0.`
   : `That is more than ${f2(v.fs)} N, so the drum slides. Kinetic friction acts up the slope: μk N ≈ ${n(uk)} × ${f2(v.N)} ${ap(v.fr)} ${f2(v.fr)} N. The net force down the slope is w sin θ − μk N ${ap(v.along)} ${f2(v.along)} − ${f2(v.fr)} ${ap(v.net)} ${f2(v.net)} N.`),
  guidance: [
   { prompt: `What is the normal force N = w cos θ on the drum, in newtons to 2 decimal places?`, answer: [r2(v.N)], explanation: `N = ${n(W)} × cos ${n(th)} ${ap(v.N)} ${f2(v.N)} N.` },
   { prompt: `What is the greatest force static friction can give, μs N, in newtons to 2 decimal places?`, answer: [r2(v.fs)], explanation: `μs N ≈ ${n(us)} × ${f2(v.N)} ${ap(v.fs)} ${f2(v.fs)} N. Static friction can be anything up to this, never more.` },
   { prompt: `What is the pull of gravity along the slope, w sin θ, in newtons to 2 decimal places?`, answer: [r2(v.along)], explanation: `w sin θ = ${n(W)} × sin ${n(th)} ${ap(v.along)} ${f2(v.along)} N. ` + (v.holds ? `That is less than ${f2(v.fs)} N, so static friction can hold the drum.` : `That is more than ${f2(v.fs)} N, so static friction cannot hold the drum and it slides.`) },
   { prompt: `So what is the size of the friction force on the drum, in newtons to 2 decimal places?`, answer: [r2(v.fr)], explanation: v.holds ? `The drum stays at rest, so static friction exactly balances the pull along the slope: ${ap(v.fr)} ${f2(v.fr)} N.` : `The drum slides, so kinetic friction acts: μk N ≈ ${n(uk)} × ${f2(v.N)} ${ap(v.fr)} ${f2(v.fr)} N.` },
   { prompt: `What is the size of the net force on the drum along the slope, in newtons to 2 decimal places (0 if it stays at rest)?`, answer: [r2(v.net)], explanation: v.holds ? `The forces along the slope balance, so the net force is 0.` : `The net force down the slope is ${f2(v.along)} − ${f2(v.fr)} ${ap(v.net)} ${f2(v.net)} N.` }
  ] }; }
});

/* Crate on a flat deck pulled sideways by a force F: the normal force is mg, static friction holds up to μs mg, otherwise μk mg acts. */
const flat = ({ m, F, us, uk, t }) => { const w = G.tidy(m * g), fs = G.tidy(us * w), holds = F <= fs, fr = holds ? F : G.tidy(uk * w), a = holds ? 0 : (F - fr) / m; return { w, fs, holds, fr, a, v: a * t }; };

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Winch on the flat deck',
 brief: 'A winch cable drags a crate along the level deck, and the crew want to know whether it starts to move, how hard it is held back, and how fast it gets going.',
 labels: ['friction force (N)', 'acceleration (m/s²)', 'speed (m/s)'], tolerance: 0.005,
 gl: [['greatest static friction (N)'], ['friction force (N)'], ['acceleration (m/s²)']]
}, {
 /* Crate 40 to 300 kg, pull a multiple of 10 N. About one draw in four is a pull below the static limit (the filter below thins out the sliding draws, so the share asked for is small), so the crate stays and the
    friction force equals the pull; in the others it slides. The speed uses the unrounded acceleration; draws are kept where the
    rounded acceleration gives the same speed to within the tolerance. */
 canonical: { m: 150, F: 870, us: 0.5, uk: 0.4, t: 5 },
 draw: R => tryDraw(() => { const us = R.int(3, 9) / 10, m = 10 * R.int(4, 30), fs = us * m * g, still = R.next() < 0.1, F = 10 * Math.max(1, Math.round((still ? fs * R.int(30, 90) / 100 : fs * R.int(115, 200) / 100) / 10));
   return { m, F, us, uk: G.tidy(Math.max(0.1, us - R.int(1, 3) / 10)), t: R.int(2, 6) }; },
  p => { if (p.uk >= p.us) return false; const v = flat(p), fs = v.fs; return Math.abs(p.F - fs) > 0.04 * fs && safe(v.fs, v.fr, v.a, v.v) && near(v.v, p.t * r2(v.a)); }, { m: 150, F: 870, us: 0.5, uk: 0.4, t: 5 }),
 build: p => { const { m, F, us, uk, t } = p, v = flat(p); return {
  prompt: `A crate of mass ${n(m)} kg is at rest on the flat steel deck of the Crane Yard. A winch cable laid flat along the deck then pulls it with a steady force of ${n(F)} N. The coefficient of static friction between the crate and the deck is μs = ${n(us)} and the coefficient of kinetic friction is μk = ${n(uk)}. The deck is level, so the normal force on the crate equals its weight. Take g = 9.8 m/s². Enter the friction force on the crate in newtons; then its acceleration in m/s²; then its speed ${n(t)} seconds after the pull begins in m/s, using v = at for a start from rest. If the crate does not move, enter 0 for the acceleration and for the speed. Give all three to 2 decimal places, and type them without commas.`,
  answer: [r2(v.fr), r2(v.a), r2(v.v)],
  hints: ['On a level deck the normal force is the weight, N = mg. Static friction can grip with any force up to μs N. If the pull is no larger than that, the crate stays put and friction equals the pull exactly.', 'If the pull is larger than μs N, the crate slides and kinetic friction μk N acts against the pull. The net force is then the pull minus μk N, the acceleration is that force ÷ m, and the speed after a time t from rest is a × t. Keep full precision until the end.'],
  solution: `The normal force is mg = ${n(m)} × 9.8 = ${n(v.w)} N, so the greatest static friction is μs N = ${n(us)} × ${n(v.w)} = ${n(v.fs)} N. ` + (v.holds
   ? `The pull of ${n(F)} N is no larger than that, so static friction holds the crate. It matches the pull exactly: the friction force is ${n(F)} N, and the acceleration and the speed are both 0.`
   : `The pull of ${n(F)} N is larger than that, so the crate slides. Kinetic friction acts against the pull: μk N = ${n(uk)} × ${n(v.w)} = ${n(v.fr)} N. The net force is ${n(F)} − ${n(v.fr)} = ${n(F - v.fr)} N, so a = ${n(F - v.fr)} ÷ ${n(m)} ${ap(v.a)} ${f2(v.a)} m/s². After ${n(t)} s from rest, v = at ${ap(v.a)} ${f2(v.a)} × ${n(t)} ${ap(v.v)} ${f2(v.v)} m/s.`),
  guidance: [
   { prompt: `What is the greatest force static friction can give on the flat deck, μs mg, in newtons?`, answer: [v.fs], explanation: `μs mg = ${n(us)} × ${n(m)} × 9.8 = ${n(v.fs)} N. ` + (v.holds ? `The pull of ${n(F)} N is no larger than this, so the crate stays.` : `The pull of ${n(F)} N is larger than this, so the crate slides.`) },
   { prompt: `So what is the size of the friction force on the crate, in newtons?`, answer: [v.fr], explanation: v.holds ? `The crate stays at rest, so static friction exactly balances the pull: ${n(v.fr)} N.` : `The crate slides, so kinetic friction acts: μk mg = ${n(uk)} × ${n(v.w)} = ${n(v.fr)} N.` },
   { prompt: `What is the crate’s acceleration, in m/s² to 2 decimal places (0 if it stays at rest)?`, answer: [r2(v.a)], explanation: v.holds ? `The pull and the friction balance, so the acceleration is 0 m/s².` : `a = (${n(F)} − ${n(v.fr)}) ÷ ${n(m)} = ${n(F - v.fr)} ÷ ${n(m)} ${ap(v.a)} ${f2(v.a)} m/s².` }
  ] }; }
});

/* A crate on a ramp with a push P up the ramp along the surface. d = pull down the ramp minus the push. Friction can point either way. */
const pushed = ({ m, th, us, uk, P }) => { const w = G.tidy(m * g), N = w * Math.cos(th), along = w * Math.sin(th), fs = us * N, d = along - P,
 mode = Math.abs(d) <= fs ? 'hold' : d > 0 ? 'down' : 'up', fr = mode === 'hold' ? Math.abs(d) : uk * N, a = mode === 'hold' ? 0 : mode === 'down' ? (d - uk * N) / m : (d + uk * N) / m; return { w, N, along, fs, d, mode, fr, a }; };

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q21', title: 'Pushing a crate up the ramp',
 brief: 'A rigger pushes a crate along a steel ramp, and the yard needs to know which way it will go and how hard the ramp grips it.',
 labels: ['friction force (N)', 'acceleration down the ramp (m/s²)'], tolerance: 0.005,
 gl: [['normal force (N)'], ['greatest static friction (N)'], ['pull minus push (N)'], ['friction force (N)'], ['acceleration down the ramp (m/s²)']]
}, {
 /* Mass 20 to 120 kg, angle 0.2 to 0.8 rad, μs 0.3 to 0.9, μk 0.1 to 0.3 below μs, push a multiple of 5 N, at least 5 N, chosen to make the crate stay, slide down or slide up (the last twice as often, since sliding down needs a steep ramp). Draws are kept at least 5% of the greatest static friction (and 3 N) away from the
    point where the crate would start to move, so all three outcomes (stays, slides down, slides up) are clear. */
 canonical: { m: 50, th: 0.65, us: 0.6, uk: 0.5, P: 590 },
 draw: R => tryDraw(() => { const us = R.int(3, 9) / 10, m = 5 * R.int(4, 24), th = R.int(4, 16) / 20, w = G.tidy(m * g), al = w * Math.sin(th), fs = us * w * Math.cos(th), mode = R.pick(['hold', 'down', 'up', 'up']),
   P = mode === 'hold' ? al + fs * R.int(-80, 80) / 100 : mode === 'up' ? al + fs * R.int(120, 220) / 100 : al - fs * R.int(120, 220) / 100;
   return { m, th, us, uk: G.tidy(Math.max(0.1, us - R.int(1, 3) / 10)), P: 5 * Math.max(1, Math.round(P / 5)) }; },
  p => { if (p.uk >= p.us) return false; const v = pushed(p); return Math.abs(Math.abs(v.d) - v.fs) > 0.05 * v.fs + 3 && safe(v.N, v.fs, v.d, v.fr, v.a); }, { m: 50, th: 0.65, us: 0.6, uk: 0.5, P: 590 }),
 build: p => { const { m, th, us, uk, P } = p, v = pushed(p), sg = v.d < 0 ? 'up' : 'down'; return {
  prompt: `A crate of mass ${n(m)} kg is set down at rest on a steel ramp in the Crane Yard that rises at ${rad(th)}. The coefficient of static friction between the crate and the ramp is μs = ${n(us)} and the coefficient of kinetic friction is μk = ${n(uk)}. A rigger then pushes the crate with a steady force of ${n(P)} N directed up the ramp, parallel to its surface. Only gravity, the normal force, the push and friction act on the crate. Take g = 9.8 m/s². Enter the size of the friction force on the crate in newtons, then the crate’s acceleration down the ramp in m/s², taking down the ramp as positive: enter 0 if the crate stays at rest, and a negative number if it moves up the ramp. Give both to 2 decimal places, and type them without commas.`,
  answer: [r2(v.fr), r2(v.a)],
  hints: ['Find the normal force first, N = mg cos θ, so the most static friction can give is μs N. Then find the pull along the ramp, mg sin θ, and take away the push: that is how hard the crate is being pulled down the ramp before friction, and it is negative when the push wins.', 'If that pull minus push is no bigger than μs N in size, the crate stays, friction matches it exactly and the acceleration is 0. If it is bigger than μs N and positive, the crate slides down, kinetic friction μk N acts up the ramp, and a = (pull − push − μk N) ÷ m. If it is bigger in size and negative, the crate slides up, kinetic friction acts down the ramp, and the acceleration down the ramp is (pull − push + μk N) ÷ m, a negative number.'],
  solution: `N = mg cos θ = ${n(v.w)} × cos ${n(th)} ${ap(v.N)} ${f2(v.N)} N, so the greatest static friction is μs N ≈ ${n(us)} × ${f2(v.N)} ${ap(v.fs)} ${f2(v.fs)} N. The pull along the ramp is mg sin θ = ${n(v.w)} × sin ${n(th)} ${ap(v.along)} ${f2(v.along)} N, and the push takes ${n(P)} N of it away: pull − push ${ap(v.along)} ${f2(v.along)} − ${n(P)} ${ap(v.d)} ${f2(v.d)} N. ` + (v.mode === 'hold'
   ? `Its size, ${f2(Math.abs(v.d))} N, is less than ${f2(v.fs)} N, so static friction holds the crate. It acts ${v.d >= 0 ? 'up' : 'down'} the ramp with the size ${f2(v.fr)} N, and the acceleration is 0.`
   : v.mode === 'down'
    ? `That is more than ${f2(v.fs)} N, so the crate slides down. Kinetic friction acts up the ramp: μk N ≈ ${n(uk)} × ${f2(v.N)} ${ap(v.fr)} ${f2(v.fr)} N. The net force down the ramp is ${ap(v.d)} ${f2(v.d)} − ${f2(v.fr)} ${ap(v.d - v.fr)} ${f2(v.d - v.fr)} N, so a ${ap(v.d - v.fr)} ${f2(v.d - v.fr)} ÷ ${n(m)} ${ap(v.a)} ${f2(v.a)} m/s².`
    : `Its size, ${f2(Math.abs(v.d))} N, is more than ${f2(v.fs)} N, and it is negative: the push wins and the crate slides up the ramp. Kinetic friction acts down the ramp: μk N ≈ ${n(uk)} × ${f2(v.N)} ${ap(v.fr)} ${f2(v.fr)} N. The net force down the ramp is ${ap(v.d)} ${f2(v.d)} + ${f2(v.fr)} ${ap(v.d + v.fr)} ${f2(v.d + v.fr)} N, so a ${ap(v.d + v.fr)} ${f2(v.d + v.fr)} ÷ ${n(m)} ${ap(v.a)} ${f2(v.a)} m/s², negative because it is up the ramp.`),
  guidance: [
   { prompt: `What is the normal force N = mg cos θ on the crate, in newtons to 2 decimal places?`, answer: [r2(v.N)], explanation: `N = ${n(m)} × 9.8 × cos ${n(th)} ${ap(v.N)} ${f2(v.N)} N.` },
   { prompt: `What is the greatest force static friction can give, μs N, in newtons to 2 decimal places?`, answer: [r2(v.fs)], explanation: `μs N ≈ ${n(us)} × ${f2(v.N)} ${ap(v.fs)} ${f2(v.fs)} N, in either direction along the ramp.` },
   { prompt: `What is the pull of gravity along the ramp, mg sin θ, minus the ${n(P)} N push, in newtons to 2 decimal places (negative if the push is bigger)?`, answer: [r2(v.d)], explanation: `mg sin θ = ${n(v.w)} × sin ${n(th)} ${ap(v.along)} ${f2(v.along)} N, and ${f2(v.along)} − ${n(P)} ${ap(v.d)} ${f2(v.d)} N. ` + (v.mode === 'hold' ? `Its size is less than ${f2(v.fs)} N, so static friction can hold the crate.` : `Its size is more than ${f2(v.fs)} N, so static friction cannot hold the crate.`) },
   { prompt: `So what is the size of the friction force on the crate, in newtons to 2 decimal places?`, answer: [r2(v.fr)], explanation: v.mode === 'hold' ? `The crate stays at rest, so static friction exactly balances the net pull: ${ap(v.fr)} ${f2(v.fr)} N.` : `The crate slides ${sg} the ramp, so kinetic friction acts: μk N ≈ ${n(uk)} × ${f2(v.N)} ${ap(v.fr)} ${f2(v.fr)} N.` },
   { prompt: `What is the crate’s acceleration down the ramp, in m/s² to 2 decimal places (0 if it stays, negative if it moves up)?`, answer: [r2(v.a)], explanation: v.mode === 'hold' ? `The forces along the ramp balance, so the acceleration is 0 m/s².` : v.mode === 'down' ? `a = (${f2(v.d)} − ${f2(v.fr)}) ÷ ${n(m)} ${ap(v.a)} ${f2(v.a)} m/s².` : `a = (${f2(v.d)} + ${f2(v.fr)}) ÷ ${n(m)} ${ap(v.a)} ${f2(v.a)} m/s², negative because the crate moves up the ramp.` }
  ] }; }
});

/* ---- q23 Chapter review: a free-body problem from start to finish [6.1, 6.2] ---- */

/* q23b: sled m1 on a level deck, cable over a pulley at the deck edge to a hanging bucket m2. Positive is along the motion. */
const deckv = ({ m1, m2, uk }) => { const fk = G.tidy(uk * m1 * g), w2 = G.tidy(m2 * g), a = (w2 - fk) / (m1 + m2); return { fk, w2, a, T: m2 * (g - a) }; };

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Bucket pulling a sled across the deck',
 brief: 'A bucket of rock hangs over the edge of a level deck and drags a sled behind it, and the crew need the speed-up and the cable load.',
 labels: ['acceleration (m/s²)', 'tension (N)'], tolerance: 0.005,
 gl: [['friction on the sled (N)'], ['acceleration (m/s²)'], ['tension (N)']]
}, {
 /* Sled 20 to 100 kg, bucket 10 to 60 kg, μk 0.1 to 0.5; acceleration 0.3 to 6 m/s². A player who rounds the acceleration to
    2 decimal places before finding the tension must still land within the tolerance. */
 canonical: { m1: 45, m2: 30, uk: 0.25 },
 draw: R => tryDraw(() => ({ m1: 5 * R.int(4, 20), m2: 5 * R.int(2, 12), uk: R.int(1, 5) / 10 }),
  p => { const v = deckv(p); return v.a >= 0.3 && v.a <= 6 && safe(v.fk, v.a, v.T) && near(p.m2 * (g - r2(v.a)), v.T); }, { m1: 45, m2: 30, uk: 0.25 }),
 build: p => { const { m1, m2, uk } = p, v = deckv(p), net = v.w2 - v.fk; return {
  prompt: `On a level steel deck beside the Crane Yard a sled of mass ${n(m1)} kg is tied to a cable that runs over a pulley at the edge of the deck and down to a hanging bucket of rock of mass ${n(m2)} kg. The sled is already sliding towards the edge, and the coefficient of kinetic friction between the sled and the deck is μk = ${n(uk)}. The cable has no mass and does not stretch, and the pulley turns without friction, so the tension is the same along the whole cable and both bodies share one acceleration. Take g = 9.8 m/s² and take the sled’s motion towards the edge (and the bucket’s motion down) as positive. Enter the acceleration in m/s², then the tension in the cable in newtons, both to 2 decimal places.`,
  answer: [r2(v.a), r2(v.T)],
  hints: ['Draw a free-body diagram for each body. Along the deck the sled feels the tension towards the edge and kinetic friction away from it, and friction is μk times the normal force, which here is the whole weight. The bucket feels its weight down and the tension up.', 'Add Newton’s second law for the two bodies: the tension cancels, leaving m2 g − μk m1 g = (m1 + m2) a. Then use the bucket alone, m2 g − T = m2 a, to find T.'],
  solution: `The deck is level, so the normal force on the sled is m1 g and kinetic friction is μk m1 g = ${n(uk)} × ${n(m1)} × 9.8 = ${n(v.fk)} N, against the motion. The bucket’s weight is m2 g = ${n(m2)} × 9.8 = ${n(v.w2)} N. Adding the two equations of Newton’s second law, the tension cancels: (m1 + m2) a = ${n(v.w2)} − ${n(v.fk)} = ${n(net)} N, so a = ${n(net)} ÷ ${n(m1 + m2)} ${ap(v.a)} ${f2(v.a)} m/s². For the bucket, m2 g − T = m2 a, so T = m2 (g − a) ≈ ${n(m2)} × (9.8 − ${f2(v.a)}) ${ap(v.T)} ${f2(v.T)} N.`,
  guidance: [
   { prompt: `The deck is level, so the normal force on the sled is its weight. What is kinetic friction on the sled, μk m1 g, in newtons?`, answer: [v.fk], explanation: `μk m1 g = ${n(uk)} × ${n(m1)} × 9.8 = ${n(v.fk)} N, pointing away from the edge.` },
   { prompt: `The net force on the pair is the bucket’s weight minus friction, and it moves the total mass m1 + m2. What is the acceleration, in m/s² to 2 decimal places?`, answer: [r2(v.a)], explanation: `a = (${n(v.w2)} − ${n(v.fk)}) ÷ ${n(m1 + m2)} = ${n(net)} ÷ ${n(m1 + m2)} ${ap(v.a)} ${f2(v.a)} m/s².` },
   { prompt: `For the bucket alone, m2 g − T = m2 a. What is the tension T, in newtons to 2 decimal places?`, answer: [r2(v.T)], explanation: `T = m2 (g − a) ≈ ${n(m2)} × (9.8 − ${f2(v.a)}) ${ap(v.T)} ${f2(v.T)} N. It is less than the bucket’s weight because the bucket is speeding up on its way down.` }
  ] }; }
});

/* q23c: crate m1 slides DOWN a ramp and lifts a counterweight m2 over a pulley at the top. Positive is down the ramp for the crate, up for the counterweight. */
const liftv = ({ m1, m2, th, uk }) => { const drive = m1 * g * Math.sin(th) - uk * m1 * g * Math.cos(th), w2 = G.tidy(m2 * g), a = (drive - w2) / (m1 + m2); return { drive, w2, a, T: m2 * (g + a) }; };

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Crate lowering a counterweight',
 brief: 'A heavy crate slides down the ramp and hauls a counterweight up the other side of the pulley, and the riggers need its acceleration and the load on the cable.',
 labels: ['acceleration (m/s²)', 'tension (N)'], tolerance: 0.005,
 gl: [['net force of the crate (N)'], ['acceleration (m/s²)'], ['tension (N)']]
}, {
 /* Crate 40 to 120 kg, counterweight 10 to 50 kg, angle 0.3 to 0.8 rad, μk 0.1 to 0.4; acceleration 0.3 to 5 m/s². Rounding the
    acceleration to 2 decimal places must not move the tension outside the tolerance. */
 canonical: { m1: 85, m2: 20, th: 0.75, uk: 0.2 },
 draw: R => tryDraw(() => ({ m1: 5 * R.int(8, 24), m2: 5 * R.int(2, 10), th: R.int(6, 16) / 20, uk: R.int(1, 4) / 10 }),
  p => { const v = liftv(p); return v.a >= 0.3 && v.a <= 5 && safe(v.drive, v.a, v.T) && near(p.m2 * (g + r2(v.a)), v.T); }, { m1: 85, m2: 20, th: 0.75, uk: 0.2 }),
 build: p => { const { m1, m2, th, uk } = p, v = liftv(p), net = v.drive - v.w2; return {
  prompt: `In the Crane Yard a crate of mass ${n(m1)} kg sits on a ramp that rises at ${rad(th)}. A cable runs from the crate up the ramp, over a pulley at the top, and straight down to a hanging counterweight of mass ${n(m2)} kg. The crate is heavy enough to slide down the ramp, lifting the counterweight, and it is already moving. The coefficient of kinetic friction between the crate and the ramp is μk = ${n(uk)}. The cable has no mass and does not stretch, and the pulley turns without friction, so the tension is the same all along the cable and both bodies share one acceleration. Take g = 9.8 m/s² and take the crate’s motion down the ramp (and the counterweight’s motion up) as positive. Enter the acceleration in m/s², then the tension in the cable in newtons, both to 2 decimal places.`,
  answer: [r2(v.a), r2(v.T)],
  hints: ['Draw a free-body diagram for each body. Along the ramp the crate feels the pull of gravity down the slope, kinetic friction up the slope because it is moving down, and the tension up the slope. The counterweight feels its weight down and the tension up.', 'Add Newton’s second law for the two bodies: the tension cancels, leaving (m1 g sin θ − μk m1 g cos θ − m2 g) = (m1 + m2) a. Then use the counterweight alone, with up as positive: T − m2 g = m2 a.'],
  solution: `Crate, along the ramp: gravity pulls down the slope with m1 g sin θ = ${n(m1)} × 9.8 × sin ${n(th)} ${ap(m1 * g * Math.sin(th))} ${f2(m1 * g * Math.sin(th))} N, and kinetic friction μk m1 g cos θ = ${n(uk)} × ${n(m1)} × 9.8 × cos ${n(th)} ${ap(uk * m1 * g * Math.cos(th))} ${f2(uk * m1 * g * Math.cos(th))} N acts up the slope, so the crate’s own net force down the slope is ${ap(v.drive)} ${f2(v.drive)} N. Counterweight: its weight is m2 g = ${n(m2)} × 9.8 = ${n(v.w2)} N. Adding the two equations of Newton’s second law, the tension cancels: (m1 + m2) a = ${f2(v.drive)} − ${n(v.w2)} ${ap(net)} ${f2(net)} N, so a ${ap(net)} ${f2(net)} ÷ ${n(m1 + m2)} ${ap(v.a)} ${f2(v.a)} m/s². For the counterweight, T − m2 g = m2 a, so T = m2 (g + a) ≈ ${n(m2)} × (9.8 + ${f2(v.a)}) ${ap(v.T)} ${f2(v.T)} N.`,
  guidance: [
   { prompt: `Down the slope the crate has gravity’s pull m1 g sin θ, and kinetic friction μk m1 g cos θ acts up the slope. What is the crate’s own net force down the slope, in newtons to 2 decimal places?`, answer: [r2(v.drive)], explanation: `m1 g sin θ − μk m1 g cos θ = ${n(m1)} × 9.8 × (sin ${n(th)} − ${n(uk)} × cos ${n(th)}) ${ap(v.drive)} ${f2(v.drive)} N.` },
   { prompt: `The tension cancels when the two bodies are added. The crate’s own net force minus the counterweight’s weight ${n(v.w2)} N moves the total mass m1 + m2. What is the acceleration, in m/s² to 2 decimal places?`, answer: [r2(v.a)], explanation: `a = (${f2(v.drive)} − ${n(v.w2)}) ÷ ${n(m1 + m2)} ${ap(net)} ${f2(net)} ÷ ${n(m1 + m2)} ${ap(v.a)} ${f2(v.a)} m/s².` },
   { prompt: `For the counterweight, with up as positive, T − m2 g = m2 a. What is the tension T, in newtons to 2 decimal places?`, answer: [r2(v.T)], explanation: `T = m2 (g + a) ≈ ${n(m2)} × (9.8 + ${f2(v.a)}) ${ap(v.T)} ${f2(v.T)} N. It is more than the counterweight’s weight because the counterweight is speeding up on its way up.` }
  ] }; }
});

/* q23d: two ramps back to back. Crate 1 slides down ramp 1 and drags crate 2 up ramp 2 over a pulley at the crest. Same μk on both. */
const roofv = ({ m1, m2, th1, th2, uk }) => { const drive = m1 * g * (Math.sin(th1) - uk * Math.cos(th1)), resist = m2 * g * (Math.sin(th2) + uk * Math.cos(th2)), a = (drive - resist) / (m1 + m2); return { drive, resist, a, T: m2 * a + resist }; };

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q21', title: 'Two ramps and one pulley',
 brief: 'Two sleds sit on opposite slopes of a ridge, joined by a cable over a pulley at the crest, and the yard needs their acceleration and the cable load.',
 labels: ['acceleration (m/s²)', 'tension (N)'], tolerance: 0.005,
 gl: [['pull of sled A (N)'], ['drag of sled B (N)'], ['acceleration (m/s²)'], ['tension (N)']]
}, {
 /* Sled A 30 to 120 kg on the steeper ramp (0.4 to 0.9 rad), sled B 20 to 100 kg on the shallower ramp (0.1 to 0.5 rad), μk 0.1 to 0.4,
    the same on both; acceleration 0.3 to 5 m/s². Rounding the acceleration to 2 decimal places must not move the tension outside the tolerance. */
 canonical: { m1: 80, m2: 45, th1: 0.8, th2: 0.25, uk: 0.3 },
 draw: R => tryDraw(() => ({ m1: 5 * R.int(6, 24), m2: 5 * R.int(4, 20), th1: R.int(8, 18) / 20, th2: R.int(2, 10) / 20, uk: R.int(1, 4) / 10 }),
  p => { const v = roofv(p); return v.a >= 0.3 && v.a <= 5 && safe(v.drive, v.resist, v.a, v.T) && near(p.m2 * r2(v.a) + v.resist, v.T); }, { m1: 80, m2: 45, th1: 0.8, th2: 0.25, uk: 0.3 }),
 build: p => { const { m1, m2, th1, th2, uk } = p, v = roofv(p), net = v.drive - v.resist; return {
  prompt: `A ridge beside the Crane Yard has a steeper slope on one side, rising at ${rad(th1)}, and a gentler slope on the other, rising at ${rad(th2)}. Sled A of mass ${n(m1)} kg stands on the steeper slope and sled B of mass ${n(m2)} kg on the gentler one. A cable joins them over a pulley at the crest: it lies along each slope and has no mass and does not stretch, and the pulley turns without friction, so the tension is the same all along it. Sled A is sliding down its slope and pulling sled B up the other, and the coefficient of kinetic friction on both slopes is μk = ${n(uk)}. Take g = 9.8 m/s² and take each sled’s motion along its own slope in the direction it is moving as positive. Enter the acceleration in m/s², then the tension in the cable in newtons, both to 2 decimal places.`,
  answer: [r2(v.a), r2(v.T)],
  hints: ['Draw a free-body diagram for each sled and work along its own slope. For each slope the pull of gravity along it is m g sin θ and the normal force is m g cos θ. Sled A moves down, so friction acts up its slope; sled B moves up, so gravity and friction both act down its slope.', 'Write Newton’s second law along each slope: sled A, m1 g sin θ1 − μk m1 g cos θ1 − T = m1 a; sled B, T − m2 g sin θ2 − μk m2 g cos θ2 = m2 a. Add them to cancel T and find a, then put a back into either equation to find T.'],
  solution: `Sled A, down its slope: m1 g sin θ1 − μk m1 g cos θ1 = ${n(m1)} × 9.8 × (sin ${n(th1)} − ${n(uk)} × cos ${n(th1)}) ${ap(v.drive)} ${f2(v.drive)} N. Sled B, forces against its motion up its slope: m2 g sin θ2 + μk m2 g cos θ2 = ${n(m2)} × 9.8 × (sin ${n(th2)} + ${n(uk)} × cos ${n(th2)}) ${ap(v.resist)} ${f2(v.resist)} N. Adding the two equations of Newton’s second law, the tension cancels: (m1 + m2) a = ${f2(v.drive)} − ${f2(v.resist)} ${ap(net)} ${f2(net)} N, so a ${ap(net)} ${f2(net)} ÷ ${n(m1 + m2)} ${ap(v.a)} ${f2(v.a)} m/s². For sled B, T − ${f2(v.resist)} = m2 a, so T ≈ ${n(m2)} × ${f2(v.a)} + ${f2(v.resist)} ${ap(v.T)} ${f2(v.T)} N.`,
  guidance: [
   { prompt: `Sled A is sliding down, so friction acts up its slope. What is its own net force down the slope, m1 g sin θ1 − μk m1 g cos θ1, in newtons to 2 decimal places?`, answer: [r2(v.drive)], explanation: `${n(m1)} × 9.8 × (sin ${n(th1)} − ${n(uk)} × cos ${n(th1)}) ${ap(v.drive)} ${f2(v.drive)} N.` },
   { prompt: `Sled B is being dragged up, so gravity and friction both act down its slope. What is their total, m2 g sin θ2 + μk m2 g cos θ2, in newtons to 2 decimal places?`, answer: [r2(v.resist)], explanation: `${n(m2)} × 9.8 × (sin ${n(th2)} + ${n(uk)} × cos ${n(th2)}) ${ap(v.resist)} ${f2(v.resist)} N.` },
   { prompt: `The tension cancels when the two equations are added. The difference of those two forces moves the total mass m1 + m2. What is the acceleration, in m/s² to 2 decimal places?`, answer: [r2(v.a)], explanation: `a = (${f2(v.drive)} − ${f2(v.resist)}) ÷ ${n(m1 + m2)} ${ap(net)} ${f2(net)} ÷ ${n(m1 + m2)} ${ap(v.a)} ${f2(v.a)} m/s².` },
   { prompt: `For sled B alone, T − (m2 g sin θ2 + μk m2 g cos θ2) = m2 a. What is the tension T, in newtons to 2 decimal places?`, answer: [r2(v.T)], explanation: `T = m2 a + ${f2(v.resist)} ≈ ${n(m2)} × ${f2(v.a)} + ${f2(v.resist)} ${ap(v.T)} ${f2(v.T)} N.` }
  ] }; }
});

/* ---- q24 Centripetal force: what holds a body on a circle [6.3] ---- */

/* q24b: bucket on a smooth platform whirled on a horizontal cable. Tension supplies the centripetal force; the cable snaps above Tmax. */
const whirl = ({ m, r, v, Tmax }) => { const ac = v * v / r; return { ac, T: m * ac, vmax: Math.sqrt(Tmax * r / m) }; };

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'Whirling bucket on a cable',
 brief: 'A bucket of ore is swung round a post on a cable, and the crew need the load the cable carries and the speed that would break it.',
 labels: ['tension (N)', 'greatest speed (m/s)'], tolerance: 0.005,
 gl: [['centripetal acceleration (m/s²)'], ['tension (N)'], ['greatest speed (m/s)']]
}, {
 /* Bucket 2 to 20 kg, radius 1.5 to 8 m in halves, speed a whole number from 3 to 12 m/s, breaking tension a multiple of 50 N,
    at least 1 m/s above the speed. */
 canonical: { m: 6, r: 2.5, v: 5, Tmax: 400 },
 draw: R => tryDraw(() => ({ m: R.int(2, 20), r: R.int(3, 16) / 2, v: R.int(3, 12), Tmax: 50 * R.int(2, 80) }),
  p => { const x = whirl(p); return p.v <= x.vmax - 1 && safe(x.ac, x.T, x.vmax); }, { m: 6, r: 2.5, v: 5, Tmax: 400 }),
 build: p => { const { m, r, v, Tmax } = p, x = whirl(p); return {
  prompt: `A bucket of ore of mass ${n(m)} kg lies on a smooth, level platform beside the Engine Hall. A horizontal cable of length ${n(r)} m ties it to a post, and the bucket is swung round the post at a steady ${n(v)} m/s. The platform is so smooth that the cable’s tension is the only horizontal force on the bucket; its weight is balanced by the platform. The cable snaps if its tension goes above ${n(Tmax)} N. Enter the tension in the cable at this speed in newtons, then the greatest steady speed at which the bucket can be swung on this cable without snapping it, in metres per second, both to 2 decimal places. Type the numbers without commas.`,
  answer: [r2(x.T), r2(x.vmax)],
  hints: ['A body going round a circle at a steady speed needs a net force towards the centre of size F = mv² ÷ r. Here the tension is the only horizontal force, so the tension is that force and it points along the cable towards the post.', 'The cable is on the point of snapping when the tension that mv² ÷ r demands reaches the breaking tension, so mv² ÷ r = Tmax. Solve it for v: v = √(Tmax × r ÷ m).'],
  solution: `The centripetal acceleration is v² ÷ r = ${n(v * v)} ÷ ${n(r)} ${ap(x.ac)} ${f2(x.ac)} m/s². The tension is the only horizontal force, so T = mv² ÷ r ≈ ${n(m)} × ${f2(x.ac)} ${ap(x.T)} ${f2(x.T)} N, which is less than ${n(Tmax)} N. At the greatest speed mv² ÷ r = ${n(Tmax)}, so v² = ${n(Tmax)} × ${n(r)} ÷ ${n(m)} ${ap(Tmax * r / m)} ${f2(Tmax * r / m)} and v ${ap(x.vmax)} ${f2(x.vmax)} m/s.`,
  guidance: [
   { prompt: `What is the bucket’s centripetal acceleration v² ÷ r, in m/s² to 2 decimal places?`, answer: [r2(x.ac)], explanation: `v² ÷ r = ${n(v * v)} ÷ ${n(r)} ${ap(x.ac)} ${f2(x.ac)} m/s², pointing towards the post.` },
   { prompt: `The tension supplies all of the centripetal force. What is T = m × (v² ÷ r), in newtons to 2 decimal places?`, answer: [r2(x.T)], explanation: `T = ${n(m)} × ${n(v * v)} ÷ ${n(r)} ${ap(x.T)} ${f2(x.T)} N.` },
   { prompt: `At the greatest speed mv² ÷ r equals the breaking tension, so v = √(Tmax × r ÷ m). What is it, in m/s to 2 decimal places?`, answer: [r2(x.vmax)], explanation: `v = √(${n(Tmax)} × ${n(r)} ÷ ${n(m)}) ≈ √${f2(Tmax * r / m)} ${ap(x.vmax)} ${f2(x.vmax)} m/s.` }
  ] }; }
});

/* q24c: haul truck on a flat bend. Force needed F = mv²/r; most friction on the wet road μs mg; smallest safe radius v² ÷ (μs g). */
const bend = ({ m, v, r, us }) => ({ F: m * v * v / r, fmax: G.tidy(us * m * g), rmin: v * v / (us * g) });

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Wet bend on the haul road',
 brief: 'The haul road has a flat bend that grows slippery in the rain, and the road crew need to know how much grip a truck wants and how wide the bend must be.',
 labels: ['centripetal force (N)', 'smallest radius (m)'], tolerance: 0.005,
 gl: [['centripetal force (N)'], ['greatest friction (N)'], ['smallest radius (m)']]
}, {
 /* Truck 1000 to 5000 kg in 250s, speed 8 to 20 m/s, bend radius 25 to 100 m in fives, wet-road μs 0.2 to 0.5. The truck must skid
    on this bend, so the smallest safe radius is at least 4 m more than the real radius. The force stays under 90000 N. */
 canonical: { m: 3000, v: 14, r: 40, us: 0.3 },
 draw: R => tryDraw(() => ({ m: 250 * R.int(4, 20), v: R.int(8, 20), r: 5 * R.int(5, 20), us: R.int(2, 5) / 10 }),
  p => { const x = bend(p); return x.rmin >= p.r + 4 && x.F < 90000 && safe(x.F, x.fmax, x.rmin); }, { m: 3000, v: 14, r: 40, us: 0.3 }),
 build: p => { const { m, v, r, us } = p, x = bend(p); return {
  prompt: `A haul truck of mass ${n(m)} kg drives at a steady ${n(v)} m/s round a flat bend of radius ${n(r)} m on the road to the Engine Hall. After rain the coefficient of static friction between the tyres and the road is only μs = ${n(us)}. Only static friction pulls the truck towards the centre of the bend. Take g = 9.8 m/s². Enter the centripetal force the truck needs on this bend, in newtons, then the smallest radius of a flat bend that the truck could take at ${n(v)} m/s on this wet road without skidding, in metres. Give both to 2 decimal places, and type them without commas.`,
  answer: [r2(x.F), r2(x.rmin)],
  hints: ['The centripetal force a steady circular path needs is F = mv² ÷ r. On a flat road the most static friction can give is μs mg, and the truck skids when F is more than that.', 'The smallest safe radius is the one where mv² ÷ r equals μs mg exactly. The mass cancels, so r = v² ÷ (μs g). A gentler bend, with a bigger radius, needs less force.'],
  solution: `The centripetal force is F = mv² ÷ r = ${n(m)} × ${n(v * v)} ÷ ${n(r)} ${ap(x.F)} ${f2(x.F)} N. The most static friction can give on the wet road is μs mg = ${n(us)} × ${n(m)} × 9.8 = ${n(x.fmax)} N, which is less, so the truck skids on this bend. On the smallest safe bend mv² ÷ r = μs mg, so r = v² ÷ (μs g) = ${n(v * v)} ÷ (${n(us)} × 9.8) ${ap(x.rmin)} ${f2(x.rmin)} m.`,
  guidance: [
   { prompt: `What centripetal force F = mv² ÷ r does the truck need on this bend, in newtons to 2 decimal places?`, answer: [r2(x.F)], explanation: `F = ${n(m)} × ${n(v * v)} ÷ ${n(r)} ${ap(x.F)} ${f2(x.F)} N.` },
   { prompt: `What is the most force static friction can give on the wet road, μs mg, in newtons?`, answer: [x.fmax], explanation: `μs mg = ${n(us)} × ${n(m)} × 9.8 = ${n(x.fmax)} N. That is less than the ${f2(x.F)} N needed, so the truck would skid.` },
   { prompt: `On the smallest safe bend mv² ÷ r = μs mg, so r = v² ÷ (μs g). What is it, in metres to 2 decimal places?`, answer: [r2(x.rmin)], explanation: `r = ${n(v * v)} ÷ (${n(us)} × 9.8) ${ap(x.rmin)} ${f2(x.rmin)} m.` }
  ] }; }
});

/* q24d: rover on a flat circular track timed by the lap. v = 2πr ÷ T, a = v² ÷ r, shortest safe lap time 2π√(r ÷ (μs g)). */
const lap = ({ r, T, us }) => { const v = 2 * PI * r / T; return { v, ac: v * v / r, Tmin: 2 * PI * Math.sqrt(r / (us * g)) }; };

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q14', title: 'Timing a lap of the test track',
 brief: 'The Engine Hall times a rover round its test track with a stopwatch, and the crew need its speed and acceleration from the lap time and the fastest lap the tyres allow.',
 labels: ['speed (m/s)', 'centripetal acceleration (m/s²)', 'shortest safe lap time (s)'], tolerance: 0.005,
 gl: [['speed (m/s)'], ['centripetal acceleration (m/s²)'], ['shortest safe lap time (s)']]
}, {
 /* Radius 20 to 100 m in fives, lap time a multiple of 0.5 s at least 0.5 s above the shortest safe lap time, μs 0.3 to 0.9. A player who rounds
    the speed to 2 decimal places before squaring it must still land within the tolerance of the acceleration. */
 canonical: { r: 40, T: 22, us: 0.5 },
 draw: R => tryDraw(() => ({ r: 5 * R.int(4, 20), T: R.int(20, 80) / 2, us: R.int(3, 9) / 10 }),
  p => { const x = lap(p); return p.T >= x.Tmin + 0.5 && safe(x.v, x.ac, x.Tmin) && near(r2(x.v) * r2(x.v) / p.r, x.ac); }, { r: 40, T: 22, us: 0.5 }),
 build: p => { const { r, T, us } = p, x = lap(p); return {
  prompt: `A test rover goes round a flat circular track of radius ${n(r)} m beside the Engine Hall, and a stopwatch shows that one lap takes ${n(T)} seconds at a steady speed. The coefficient of static friction between the tyres and the track is μs = ${n(us)}, and only static friction pulls the rover towards the centre of the track. Take g = 9.8 m/s² and use the π button on your calculator. Enter the rover’s speed in metres per second, then its centripetal acceleration in m/s², then the shortest lap time in seconds at which it could go round this track without skidding. Give all three to 2 decimal places, and keep full precision in your working until the end.`,
  answer: [r2(x.v), r2(x.ac), r2(x.Tmin)],
  hints: ['In one lap the rover travels the circumference of the circle, 2πr, in one period T, so its speed is v = 2πr ÷ T. Its centripetal acceleration is then v² ÷ r.', 'The greatest safe speed is vmax = √(μs g r), because the most static friction can give is μs mg. The shortest safe lap time is the time to travel one circumference at that speed: Tmin = 2πr ÷ vmax.'],
  solution: `The speed is v = 2πr ÷ T = 2π × ${n(r)} ÷ ${n(T)} ${ap(x.v)} ${f2(x.v)} m/s. The centripetal acceleration is v² ÷ r ${ap(x.v)} ${f2(x.v)}² ÷ ${n(r)} ${ap(x.ac)} ${f2(x.ac)} m/s². The greatest safe speed is vmax = √(μs g r) = √(${n(us)} × 9.8 × ${n(r)}) = √${n(G.tidy(us * g * r))} ${ap(Math.sqrt(us * g * r))} ${f2(Math.sqrt(us * g * r))} m/s, so the shortest safe lap time is 2πr ÷ vmax = 2π × ${n(r)} ÷ ${f2(Math.sqrt(us * g * r))} ${ap(x.Tmin)} ${f2(x.Tmin)} s, which is less than the ${n(T)} s lap, so the rover is safe.`,
  guidance: [
   { prompt: `In one lap of ${n(T)} s the rover travels the circumference 2πr. What is its speed, in m/s to 2 decimal places?`, answer: [r2(x.v)], explanation: `v = 2π × ${n(r)} ÷ ${n(T)} ${ap(x.v)} ${f2(x.v)} m/s.` },
   { prompt: `What is the centripetal acceleration v² ÷ r, in m/s² to 2 decimal places? (Use the unrounded speed.)`, answer: [r2(x.ac)], explanation: `v² ÷ r ${ap(x.v)} ${f2(x.v)}² ÷ ${n(r)} ${ap(x.ac)} ${f2(x.ac)} m/s².` },
   { prompt: `The greatest safe speed is vmax = √(μs g r), and the shortest lap time is 2πr ÷ vmax. What is it, in seconds to 2 decimal places?`, answer: [r2(x.Tmin)], explanation: `vmax = √(${n(us)} × 9.8 × ${n(r)}) ${ap(Math.sqrt(us * g * r))} ${f2(Math.sqrt(us * g * r))} m/s, so Tmin = 2π × ${n(r)} ÷ ${f2(Math.sqrt(us * g * r))} ${ap(x.Tmin)} ${f2(x.Tmin)} s.` }
  ] }; }
});

/* ---- q25 Drag and terminal speed [6.4] ---- */

/* q25b: drag D = bv²; terminal speed √(mg ÷ b); the speed at which the drag is f percent of the weight is √(f mg ÷ 100b). */
const canis = ({ m, b, f }) => { const w = G.tidy(m * g); return { w, vT: Math.sqrt(w / b), vf: Math.sqrt(f * w / (100 * b)) }; };

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'Sample canister from the drone',
 brief: 'A sample canister is dropped from a survey drone, and the crew need its terminal speed and the speed at which the drag has built up to a set share of its weight.',
 labels: ['terminal speed (m/s)', 'speed at that drag (m/s)'], tolerance: 0.005,
 gl: [['weight (N)'], ['terminal speed (m/s)'], ['speed at that drag (m/s)']]
}, {
 /* Canister 20 to 200 kg in fives, drag constant 0.05 to 0.6 kg/m, share f of the weight from 20 to 80 percent, terminal speed at most 120 m/s. */
 canonical: { m: 45, b: 0.15, f: 60 },
 draw: R => tryDraw(() => ({ m: 5 * R.int(4, 40), b: R.int(5, 60) / 100, f: R.pick([20, 25, 40, 50, 60, 75, 80]) }),
  p => { const x = canis(p); return x.vT <= 120 && safe(x.vT, x.vf); }, { m: 45, b: 0.15, f: 60 }),
 build: p => { const { m, b, f } = p, x = canis(p); return {
  prompt: `A sealed sample canister of mass ${n(m)} kg is dropped from a survey drone high above the crater. The air drags on it with a force of size D = bv², where v is its speed and the drag constant is b = ${n(b)} kg/m. Take g = 9.8 m/s². Enter the canister’s terminal speed in m/s, then the speed in m/s at which the drag has grown to ${n(f)} percent of the canister’s weight. Give both to 2 decimal places, and type them without commas.`,
  answer: [r2(x.vT), r2(x.vf)],
  hints: ['At terminal speed the drag has grown to equal the weight, so the net force is zero: bv² = mg, which gives v = √(mg ÷ b).', 'A share of the weight is that percentage ÷ 100 times mg. Set the drag equal to it: bv² = (percentage ÷ 100) × mg, and solve for v in the same way.'],
  solution: `The weight is mg = ${n(m)} × 9.8 = ${n(x.w)} N. At terminal speed bv² = mg, so v² = ${n(x.w)} ÷ ${n(b)} ${ap(x.w / b)} ${f2(x.w / b)} and v ${ap(x.vT)} ${f2(x.vT)} m/s. The drag reaches ${n(f)} percent of the weight when bv² = ${n(f)} ÷ 100 × ${n(x.w)} = ${n(G.tidy(f * x.w / 100))} N, so v² = ${n(G.tidy(f * x.w / 100))} ÷ ${n(b)} ${ap(f * x.w / (100 * b))} ${f2(f * x.w / (100 * b))} and v ${ap(x.vf)} ${f2(x.vf)} m/s.`,
  guidance: [
   { prompt: `What is the canister’s weight mg, in newtons?`, answer: [x.w], explanation: `mg = ${n(m)} × 9.8 = ${n(x.w)} N.` },
   { prompt: `At terminal speed bv² = mg. What is that speed, √(mg ÷ b), in m/s to 2 decimal places?`, answer: [r2(x.vT)], explanation: `v = √(${n(x.w)} ÷ ${n(b)}) ≈ √${f2(x.w / b)} ${ap(x.vT)} ${f2(x.vT)} m/s.` },
   { prompt: `The drag is ${n(f)} percent of the weight when bv² = ${n(f)} ÷ 100 × mg. What is that speed, in m/s to 2 decimal places?`, answer: [r2(x.vf)], explanation: `v = √(${n(f)} ÷ 100 × ${n(x.w)} ÷ ${n(b)}) ≈ √${f2(f * x.w / (100 * b))} ${ap(x.vf)} ${f2(x.vf)} m/s. It is slower than the terminal speed, as it should be.` }
  ] }; }
});

/* q25c: a wind-tunnel reading D at speed v1 gives b = D ÷ v1²; then the real pod's terminal speed and acceleration at v2. The reading is built
   from a drag constant with two decimal places, so b is exact. */
const tunnel = ({ D, v1, m, v2 }) => { const b = D / (v1 * v1), w = G.tidy(m * g); return { b, w, vT: Math.sqrt(w / b), a: g - b * v2 * v2 / m }; };

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Wind-tunnel reading for a new pod',
 brief: 'The engineers have one drag reading from the wind tunnel for a new pod shape, and they need the pod’s drag constant, its terminal speed and how it speeds up in the drop shaft.',
 labels: ['drag constant (kg/m)', 'terminal speed (m/s)', 'acceleration (m/s²)'], tolerance: 0.005,
 gl: [['drag constant (kg/m)'], ['terminal speed (m/s)'], ['acceleration (m/s²)']]
}, {
 /* Drag constant 0.05 to 0.6 kg/m (two decimal places), tunnel speed 5 to 20 m/s, so the reading is D = b × v1²; pod 20 to 200 kg;
    shaft speed a whole number from 2 m/s up to 2 m/s below terminal speed. Not the worked example of q25 (60 kg, 0.2 kg/m, 20 m/s). */
 canonical: { D: 72, v1: 12, m: 80, v2: 25 },
 draw: R => tryDraw(() => { const b = R.int(5, 60) / 100, v1 = R.int(5, 20), m = 10 * R.int(2, 20), top = Math.floor(Math.sqrt(m * g / b) - 2); return { D: G.tidy(b * v1 * v1), v1, m, v2: R.int(2, Math.max(2, top)) }; },
  p => { const x = tunnel(p); return !(p.m === 60 && Math.abs(x.b - 0.2) < 1e-9 && p.v2 === 20) && p.v2 <= x.vT - 2 && x.vT <= 120 && safe(x.b, x.vT, x.a); }, { D: 72, v1: 12, m: 80, v2: 25 }),
 build: p => { const { D, v1, m, v2 } = p, x = tunnel(p); return {
  prompt: `In the wind tunnel beside the Engine Hall, a supply pod of a new design is held in an air stream moving at ${n(v1)} m/s, and the balance reads a drag force of ${n(D)} N. The drag on this pod is D = bv², where v is its speed relative to the air and b is a drag constant in kg/m. The same pod, which has a mass of ${n(m)} kg, is then dropped down the test shaft. Take g = 9.8 m/s². Enter the drag constant b, in kg/m; then the terminal speed of the pod, in m/s; then its acceleration when it is falling at ${n(v2)} m/s, in m/s² with downward positive. Give all three to 2 decimal places, and type them without commas.`,
  answer: [r2(x.b), r2(x.vT), r2(x.a)],
  hints: ['The drag follows D = bv², so one reading of D at one speed gives b = D ÷ v². The same pod keeps the same b when it is dropped, because its size and shape do not change.', 'At terminal speed the drag equals the weight, bv² = mg, so v = √(mg ÷ b). At any other speed the net downward force is mg − bv², and Newton’s second law gives the acceleration as that force ÷ m.'],
  solution: `From the tunnel reading, b = D ÷ v² = ${n(D)} ÷ ${n(v1)}² = ${n(D)} ÷ ${n(v1 * v1)} = ${f2(x.b)} kg/m. The pod weighs mg = ${n(m)} × 9.8 = ${n(x.w)} N. At terminal speed bv² = mg, so v² = ${n(x.w)} ÷ ${f2(x.b)} ${ap(x.w / x.b)} ${f2(x.w / x.b)} and v ${ap(x.vT)} ${f2(x.vT)} m/s. At ${n(v2)} m/s the drag is ${f2(x.b)} × ${n(v2 * v2)} = ${f2(x.b * v2 * v2)} N, so the net downward force is ${n(x.w)} − ${f2(x.b * v2 * v2)} = ${f2(x.w - x.b * v2 * v2)} N and a = ${f2(x.w - x.b * v2 * v2)} ÷ ${n(m)} ${ap(x.a)} ${f2(x.a)} m/s².`,
  guidance: [
   { prompt: `The tunnel gave D = bv² = ${n(D)} N at ${n(v1)} m/s. What is the drag constant b = D ÷ v², in kg/m to 2 decimal places?`, answer: [r2(x.b)], explanation: `b = ${n(D)} ÷ ${n(v1 * v1)} = ${f2(x.b)} kg/m.` },
   { prompt: `The pod weighs ${n(x.w)} N. At terminal speed bv² = mg. What is that speed, √(mg ÷ b), in m/s to 2 decimal places?`, answer: [r2(x.vT)], explanation: `v = √(${n(x.w)} ÷ ${f2(x.b)}) ≈ √${f2(x.w / x.b)} ${ap(x.vT)} ${f2(x.vT)} m/s.` },
   { prompt: `At ${n(v2)} m/s the net downward force is mg − bv². What is the acceleration (mg − bv²) ÷ m, in m/s² to 2 decimal places?`, answer: [r2(x.a)], explanation: `a = (${n(x.w)} − ${f2(x.b)} × ${n(v2 * v2)}) ÷ ${n(m)} = ${f2(x.w - x.b * v2 * v2)} ÷ ${n(m)} ${ap(x.a)} ${f2(x.a)} m/s², less than g because drag holds the pod back.` }
  ] }; }
});

/* q25d: sled sliding down a ramp with kinetic friction and drag. F0 = mg (sin θ − μk cos θ) is the force along the ramp before drag. */
const skid = ({ m, th, uk, b, v }) => { const F0 = m * g * (Math.sin(th) - uk * Math.cos(th)); return { F0, vT: Math.sqrt(F0 / b), a: (F0 - b * v * v) / m }; };

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q22', title: 'Sled racing down the slope',
 brief: 'A sled slides down a long ramp where friction and the air both hold it back, and the crew need its top speed and how fast it is speeding up on the way.',
 labels: ['terminal speed (m/s)', 'acceleration (m/s²)'], tolerance: 0.005,
 gl: [['force before drag (N)'], ['terminal speed (m/s)'], ['acceleration (m/s²)']]
}, {
 /* Sled 30 to 200 kg in tens, angle 0.3 to 0.9 rad, μk 0.1 to 0.4 with sin θ − μk cos θ at least 0.15, drag constant 0.05 to 0.6 kg/m, speed a whole number from 2 m/s
    up to 1.5 m/s below terminal speed, terminal speed at most 100 m/s. Rounding the force before drag to 2 decimal places must not move either answer outside the tolerance. */
 canonical: { m: 70, th: 0.6, uk: 0.15, b: 0.35, v: 12 },
 draw: R => tryDraw(() => { const m = 10 * R.int(3, 20), th = R.int(6, 18) / 20, uk = R.int(1, 4) / 10, b = R.int(5, 60) / 100, F0 = m * g * (Math.sin(th) - uk * Math.cos(th)), top = Math.floor(Math.sqrt(Math.max(F0, 0) / b) - 1.5); return { m, th, uk, b, v: R.int(2, Math.max(2, top)) }; },
  p => { if (Math.sin(p.th) - p.uk * Math.cos(p.th) < 0.15) return false; const x = skid(p); return p.v <= x.vT - 1.5 && x.vT <= 100 && safe(x.vT, x.a, x.F0) && near(Math.sqrt(r2(x.F0) / p.b), x.vT) && near((r2(x.F0) - p.b * p.v * p.v) / p.m, x.a); }, { m: 70, th: 0.6, uk: 0.15, b: 0.35, v: 12 }),
 build: p => { const { m, th, uk, b, v } = p, x = skid(p), pull = m * g * Math.sin(th), fk = uk * m * g * Math.cos(th); return {
  prompt: `A cargo sled of mass ${n(m)} kg slides down a long ramp beside the Engine Hall that rises at ${rad(th)}. Kinetic friction acts up the ramp, with coefficient μk = ${n(uk)}, and the air drags on the sled with a force of size D = bv² up the ramp too, where v is its speed and b = ${n(b)} kg/m. The sled’s speed grows until the net force along the ramp is zero: that speed is its terminal speed. Take g = 9.8 m/s². Enter the sled’s terminal speed in m/s, then its acceleration down the ramp, in m/s², at the moment it is moving at ${n(v)} m/s. Give both to 2 decimal places, and type them without commas.`,
  answer: [r2(x.vT), r2(x.a)],
  hints: ['Along the ramp the pull of gravity is mg sin θ, and the normal force is mg cos θ, so kinetic friction is μk mg cos θ. Gravity’s pull minus friction is the force that drag alone has left to oppose.', 'At terminal speed the drag equals that left-over force, bv² = mg sin θ − μk mg cos θ, so v is the square root of the left-over force ÷ b. At any other speed the net force down the ramp is the left-over force minus bv², and a = that net force ÷ m.'],
  solution: `Gravity pulls down the ramp with mg sin θ = ${n(m)} × 9.8 × sin ${n(th)} ${ap(pull)} ${f2(pull)} N, and kinetic friction is μk mg cos θ = ${n(uk)} × ${n(m)} × 9.8 × cos ${n(th)} ${ap(fk)} ${f2(fk)} N, so the force before drag is ${ap(x.F0)} ${f2(x.F0)} N. At terminal speed bv² equals it, so v² = ${f2(x.F0)} ÷ ${n(b)} ${ap(x.F0 / b)} ${f2(x.F0 / b)} and v ${ap(x.vT)} ${f2(x.vT)} m/s. At ${n(v)} m/s the drag is ${n(b)} × ${n(v * v)} = ${f2(b * v * v)} N, so a ≈ (${f2(x.F0)} − ${f2(b * v * v)}) ÷ ${n(m)} ${ap(x.a)} ${f2(x.a)} m/s².`,
  guidance: [
   { prompt: `What is the force along the ramp before drag, mg sin θ − μk mg cos θ, in newtons to 2 decimal places?`, answer: [r2(x.F0)], explanation: `mg sin θ − μk mg cos θ = ${n(m)} × 9.8 × (sin ${n(th)} − ${n(uk)} × cos ${n(th)}) ${ap(x.F0)} ${f2(x.F0)} N.` },
   { prompt: `At terminal speed bv² equals that force. What is the speed, in m/s to 2 decimal places?`, answer: [r2(x.vT)], explanation: `v = √(${f2(x.F0)} ÷ ${n(b)}) ≈ √${f2(x.F0 / b)} ${ap(x.vT)} ${f2(x.vT)} m/s.` },
   { prompt: `At ${n(v)} m/s the net force down the ramp is that force minus bv². What is the acceleration, in m/s² to 2 decimal places?`, answer: [r2(x.a)], explanation: `a = (${f2(x.F0)} − ${n(b)} × ${n(v * v)}) ÷ ${n(m)} = ${f2(x.F0 - b * v * v)} ÷ ${n(m)} ${ap(x.a)} ${f2(x.a)} m/s².` }
  ] }; }
});

})();
