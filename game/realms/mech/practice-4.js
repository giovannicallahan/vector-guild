/* Mechanics: motion and force practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p4.js. */
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
  guidance: b.guidance.map((q, i) => ({ prompt: q.prompt, answer: q.answer, labels: gl[i], explanation: q.explanation })) }, gen);
};
const g = 9.8, PI = Math.PI, SUP = { 2: '²', 3: '³' };
const r2 = x => Math.round(x * 100) / 100;
const f2 = x => r2(x).toFixed(2).replace('-', '−');
/* "=" when x is already exact at 2 decimal places, otherwise "≈", so a solution never writes ≈ before an exact value. */
const ap = x => Math.abs(Math.round(x * 100) / 100 - x) < 1e-9 ? '=' : '≈';
/* True when x sits within 0.05 of a hundredth of a rounding tie at 2 places (a player's own rounding could go either way). */
const nearTie = x => { const f = Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100); return Math.abs(f - 0.5) < 0.05; };
/* '=' when n(x) shows x exactly, '≈' when it is rounded. */
const eq = x => Math.abs(Number(n(x).replace('−', '-')) - x) < 1e-12 ? '=' : '≈';
const sgn = v => v < 0 ? '−' : '+';
/* Signed term with a space: pm(3) is "+ 3", pm(−2) is "− 2". */
const pm = x => `${sgn(x)} ${n(Math.abs(x))}`;
/* A polynomial in t from its coefficients, highest power first: poly([3, 0, −2]) is '3t² − 2'. A coefficient 1 is not written out. */
const poly = cs => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + 't' + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* q18: Pythagorean net forces. */
const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9], [8, 15], [15, 8], [12, 16], [16, 12], [15, 20], [20, 15], [7, 24], [24, 7]];
/* q19b: the four ways a lift cage can move, as [moving, change, sign of a with up positive]. */
const CAGE = [['rising', 'speeding up', 1], ['rising', 'slowing down', -1], ['descending', 'speeding up', -1], ['descending', 'slowing down', 1]];
const tidy2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;

/* ---- q16 Relative motion: velocity seen from a moving frame [4.5] ---- */

mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The drone in the crosswind',
 brief: 'A pod-delivery drone reports its velocity through the air, and the catapult crew needs to know how it is really moving over the field.',
 labels: ['drone x relative to ground (m/s)', 'drone y relative to ground (m/s)', 'drone speed over the ground (m/s)'], tolerance: 0.005,
 gl: [['drone x relative to ground (m/s)'], ['drone y relative to ground (m/s)'], ['drone speed over the ground (m/s)']]
}, {
 /* Drone relative to ground = drone relative to air + air relative to ground, by components. No ground component is 0; the speed is off a rounding tie. */
 canonical: { ax: 9, ay: -4, wx: -5, wy: 6 },
 draw: R => retry(() => ({ ax: R.nz(-12, 12), ay: R.nz(-12, 12), wx: R.nz(-8, 8), wy: R.nz(-8, 8) }),
  p => { const gx = p.ax + p.wx, gy = p.ay + p.wy; return gx !== 0 && gy !== 0 && !nearTie(Math.hypot(gx, gy)); }, { ax: 9, ay: -4, wx: -5, wy: 6 }),
 build: ({ ax, ay, wx, wy }) => { const gx = ax + wx, gy = ay + wy, s = Math.hypot(gx, gy); return {
  prompt: `A pod-delivery drone flies over the Catapult Field, where x points east and y points north. Its flight computer reports its velocity relative to the air as (${n(ax)}, ${n(ay)}) m/s. The air itself is moving: the wind blows at (${n(wx)}, ${n(wy)}) m/s relative to the ground. Enter the drone’s velocity relative to the ground, its x component and then its y component in metres per second, then its speed over the ground in metres per second to 2 decimal places.`,
  answer: [gx, gy, r2(s)],
  hints: ['The air is a frame of reference, just as the rover was. The rule is: (drone relative to ground) = (drone relative to air) + (air relative to ground).', 'Add the x components together and the y components together, then the speed is √(x² + y²).'],
  solution: `Drone relative to ground = (${n(ax)}, ${n(ay)}) + (${n(wx)}, ${n(wy)}) = (${n(ax)} ${pm(wx)}, ${n(ay)} ${pm(wy)}) = (${n(gx)}, ${n(gy)}) m/s. Its speed is √(${par(gx)}² + ${par(gy)}²) = √${n(gx * gx + gy * gy)} ${eq(s)} ${n(s)}, which is ${f2(s)} m/s.`,
  guidance: [
   { prompt: `Add the x components: the drone’s x relative to the air, ${n(ax)}, plus the air’s x relative to the ground, ${n(wx)}. What is the drone’s x component relative to the ground, in m/s?`, answer: [gx], explanation: `${n(ax)} ${pm(wx)} = ${n(gx)} m/s.` },
   { prompt: `Now the y components: ${n(ay)} plus ${n(wy)}. What is the drone’s y component relative to the ground, in m/s?`, answer: [gy], explanation: `${n(ay)} ${pm(wy)} = ${n(gy)} m/s.` },
   { prompt: `What is the drone’s speed over the ground, √(x² + y²) for (${n(gx)}, ${n(gy)}), in m/s to 2 decimal places?`, answer: [r2(s)], explanation: `√(${par(gx)}² + ${par(gy)}²) = √${n(gx * gx + gy * gy)} ${ap(s)} ${f2(s)} m/s.` }
  ] }; }
});

mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Racing the wind to the pad',
 brief: 'A drone must reach a landing pad due east of its start, and the crew wants to know when it arrives and how far the wind has pushed it sideways.',
 labels: ['time to cover the eastward distance (s)', 'distance north of the start (m)'], tolerance: 0.01,
 gl: [['drone x relative to ground (m/s)'], ['time (s)'], ['distance north of the start (m)']]
}, {
 /* Ground velocity = (ax + wx, ay + wy), eastward component positive and northward component not 0 or 1. D = (eastward ground speed) × T for a whole-number T,
    so the time is a whole number of seconds; D is the printed parameter. */
 canonical: { ax: 8, ay: 3, wx: -3, wy: -5, D: 150 },
 draw: R => retry(() => { const p = { ax: R.nz(-6, 14), ay: R.nz(-10, 10), wx: R.nz(-8, 8), wy: R.nz(-8, 8) }, gx = p.ax + p.wx; p.D = gx * R.int(5, 30); return p; },
  p => { const gx = p.ax + p.wx, gy = p.ay + p.wy; return gx > 0 && gy !== 0 && gy !== 1 && p.D < 1000; },
  { ax: 8, ay: 3, wx: -3, wy: -5, D: 150 }),
 build: ({ ax, ay, wx, wy, D }) => { const gx = ax + wx, gy = ay + wy, t = D / gx, north = gy * t; return {
  prompt: `A drone must reach a landing pad on the Catapult Field, where x points east and y points north. It holds its velocity relative to the air at (${n(ax)}, ${n(ay)}) m/s while the wind blows at (${n(wx)}, ${n(wy)}) m/s relative to the ground. The pad is ${n(D)} m due east of the drone’s start. Assume both velocities stay constant. Enter the time the drone takes to cover ${n(D)} m eastwards, in seconds, then how far north of its start it is at that moment, in metres (a negative number means south).`,
  answer: [t, north],
  hints: ['Add the drone’s velocity relative to the air and the air’s velocity relative to the ground, component by component, to get its velocity relative to the ground.', 'With a constant velocity, time = distance ÷ speed along that direction, so use the eastward component for the time. The northward distance is then the northward component times the time.'],
  solution: `Drone relative to ground = (${n(ax)}, ${n(ay)}) + (${n(wx)}, ${n(wy)}) = (${n(gx)}, ${n(gy)}) m/s. It covers ${n(D)} m east at ${n(gx)} m/s, so the time is ${n(D)} ÷ ${n(gx)} = ${n(t)} s. In that time it moves ${n(gy)} × ${n(t)} = ${n(north)} m northwards, so it is ${n(Math.abs(north))} m ${north < 0 ? 'south' : 'north'} of its start.`,
  guidance: [
   { prompt: `Add the x components: the drone’s x relative to the air, ${n(ax)}, plus the wind’s x, ${n(wx)}. What is the drone’s eastward speed over the ground, in m/s?`, answer: [gx], explanation: `${n(ax)} ${pm(wx)} = ${n(gx)} m/s.` },
   { prompt: `The pad is ${n(D)} m east and the drone moves east at ${n(gx)} m/s over the ground. How long does it take, in seconds?`, answer: [t], explanation: `${n(D)} ÷ ${n(gx)} = ${n(t)} s.` },
   { prompt: `Add the y components, ${n(ay)} and ${n(wy)}, to get the drone’s northward velocity over the ground, then multiply by the time. How far north of its start is it, in metres (negative for south)?`, answer: [north], explanation: `${n(ay)} ${pm(wy)} = ${n(gy)} m/s, and ${n(gy)} × ${n(t)} = ${n(north)} m.` }
  ] }; }
});

mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q03', title: 'The rover that drove into the wind',
 brief: 'The ground station knows how the wind blows over the field, but not how fast the survey rover is driving, so the crew must work it out from the mast vane.',
 labels: ['rover x relative to ground (m/s)', 'rover y relative to ground (m/s)', 'rover speed over the ground (m/s)'], tolerance: 0.005,
 gl: [['wind x relative to ground (m/s)'], ['wind y relative to ground (m/s)'], ['rover x relative to ground (m/s)'], ['rover y relative to ground (m/s)'], ['rover speed over the ground (m/s)']]
}, {
 /* v_wind,ground = W(cos θ, sin θ); v_wind,rover = (sx, sy); the rover's velocity is v_wind,ground − v_wind,rover. Every asked and guided value is off a
    rounding tie, and rounding the components first does not change the last digit of the speed. */
 canonical: { W: 12, th: 0.9, sx: -4, sy: 3 },
 draw: R => retry(() => ({ W: R.int(6, 20), th: R.int(3, 59) / 10, sx: R.nz(-9, 9), sy: R.nz(-9, 9) }),
  p => { const wx = p.W * Math.cos(p.th), wy = p.W * Math.sin(p.th), rx = wx - p.sx, ry = wy - p.sy, s = Math.hypot(rx, ry);
   return p.th !== 1 && Math.abs(rx) >= 0.5 && Math.abs(ry) >= 0.5 && ![wx, wy, rx, ry, s].some(nearTie) && r2(Math.hypot(r2(rx), r2(ry))) === r2(s); },
  { W: 12, th: 0.9, sx: -4, sy: 3 }),
 build: ({ W, th, sx, sy }) => { const wx = W * Math.cos(th), wy = W * Math.sin(th), rx = wx - sx, ry = wy - sy, s = Math.hypot(rx, ry); return {
  prompt: `Over the Catapult Field the wind blows at ${n(W)} m/s relative to the ground, in the direction ${n(th)} radians anticlockwise from east (x points east, y points north). The wind vane on a survey rover’s mast measures the wind relative to the rover as (${n(sx)}, ${n(sy)}) m/s. The frame rule v_PG = v_PR + v_RG can be rearranged: subtract the wind relative to the rover from the wind relative to the ground to get the rover relative to the ground. Enter the rover’s velocity relative to the ground, its x component and then its y component in metres per second, then its speed over the ground in metres per second, all to 2 decimal places. Work from unrounded values.`,
  answer: [r2(rx), r2(ry), r2(s)],
  hints: ['First turn the wind over the ground into components, as for any vector given by its size and angle: x is the size times cos of the angle and y is the size times sin of the angle, with the angle in radians.', 'The rule v_PG = v_PR + v_RG gives v_RG = v_PG − v_PR: subtract the measured wind from the wind over the ground, component by component. The rover’s speed is then √(x² + y²).'],
  solution: `Wind relative to the ground: (${n(W)} cos ${n(th)}, ${n(W)} sin ${n(th)}) ≈ (${n(wx)}, ${n(wy)}) m/s. Rover relative to the ground = (wind relative to ground) − (wind relative to rover) = (${n(wx)} − ${par(sx)}, ${n(wy)} − ${par(sy)}) ≈ (${n(rx)}, ${n(ry)}) m/s, which is (${f2(rx)}, ${f2(ry)}) m/s. Its speed is √(${par(rx)}² + ${par(ry)}²) ≈ ${n(s)}, which is ${f2(s)} m/s.`,
  guidance: [
   { prompt: `What is the x component of the wind relative to the ground, ${n(W)} × cos ${n(th)}, in m/s to 2 decimal places?`, answer: [r2(wx)], explanation: `${n(W)} × cos ${n(th)} ${ap(wx)} ${f2(wx)} m/s.` },
   { prompt: `What is the y component of the wind relative to the ground, ${n(W)} × sin ${n(th)}, in m/s to 2 decimal places?`, answer: [r2(wy)], explanation: `${n(W)} × sin ${n(th)} ${ap(wy)} ${f2(wy)} m/s.` },
   { prompt: `The rover’s x relative to the ground is the wind’s x relative to the ground minus the wind’s x relative to the rover, ${n(sx)}. What is it, in m/s to 2 decimal places?`, answer: [r2(rx)], explanation: `${n(wx)} − ${par(sx)} ${ap(rx)} ${f2(rx)} m/s.` },
   { prompt: `Now the y components: the wind’s y relative to the ground minus ${n(sy)}. What is the rover’s y relative to the ground, in m/s to 2 decimal places?`, answer: [r2(ry)], explanation: `${n(wy)} − ${par(sy)} ${ap(ry)} ${f2(ry)} m/s.` },
   { prompt: `What is the rover’s speed over the ground, √(x² + y²) for (${f2(rx)}, ${f2(ry)}), in m/s to 2 decimal places?`, answer: [r2(s)], explanation: `√(${par(r2(rx))}² + ${par(r2(ry))}²) ${ap(s)} ${f2(s)} m/s.` }
  ] }; }
});

/* ---- q17 Chapter review: motion in a plane [4.3, 4.4] ---- */

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'Let go from the rotor',
 brief: 'A rotor arm on the Catapult Field flings test pods sideways off its tip, and the crew must know the strain on the arm and where each pod lands.',
 labels: ['centripetal acceleration (m/s²)', 'time to reach the floor (s)', 'horizontal distance (m)'], tolerance: 0.005,
 gl: [['pod speed (m/s)'], ['centripetal acceleration (m/s²)'], ['time to reach the floor (s)'], ['horizontal distance (m)']]
}, {
 /* A steady circle (v = 2πr ÷ T, a = v² ÷ r), then a horizontal launch from height h (time √(2h ÷ g), distance v × time). Every asked and guided value is off a rounding tie. */
 canonical: { r: 6, T: 5, h: 18 },
 draw: R => retry(() => ({ r: R.int(2, 6), T: R.int(2, 6), h: R.int(5, 40) }),
  p => { const v = 2 * PI * p.r / p.T, ac = v * v / p.r, t = Math.sqrt(2 * p.h / g), d = v * t; return ![v, ac, t, d].some(nearTie); }, { r: 6, T: 5, h: 18 }),
 build: ({ r, T, h }) => { const v = 2 * PI * r / T, ac = v * v / r, t = Math.sqrt(2 * h / g), d = v * t; return {
  prompt: `A rotor arm on the Catapult Field carries a test pod round a horizontal circle of radius ${n(r)} m at a steady speed, one full turn every ${n(T)} s. The pod travels ${n(h)} m above the flat floor. At one moment the pod is let go: it then moves horizontally in a straight line at the speed it had on the arm. Ignore the air and take g = 9.8 m/s². Enter the size of the pod’s centripetal acceleration just before it is let go in m/s², then the time it takes to reach the floor in seconds, then the horizontal distance it travels in that time in metres, all to 2 decimal places. Work from unrounded values.`,
  answer: [r2(ac), r2(t), r2(d)],
  hints: ['On the arm the pod goes once round a circle of length 2πr in one period, so its speed is 2πr ÷ T, and its centripetal acceleration is v² ÷ r.', 'After release the pod starts with no downward speed, so it falls the height h in a time t with h = ½gt². Meanwhile it keeps its horizontal speed, so the horizontal distance is v × t.'],
  solution: `On the arm: v = 2π × ${n(r)} ÷ ${n(T)} ${eq(v)} ${n(v)} m/s. The centripetal acceleration is v² ÷ r, with v² ≈ ${n(v * v)}, so v² ÷ r ${eq(ac)} ${n(ac)}, which is ${f2(ac)} m/s². After release: ${n(h)} = ½ × 9.8 × t², so t = √(2 × ${n(h)} ÷ 9.8) ${eq(t)} ${n(t)}, which is ${f2(t)} s. The horizontal distance is v × t ≈ ${n(v)} × ${n(t)} ${eq(d)} ${n(d)}, which is ${f2(d)} m.`,
  guidance: [
   { prompt: `What is the pod’s speed on the arm, 2πr ÷ T, in m/s to 2 decimal places?`, answer: [r2(v)], explanation: `2π × ${n(r)} ÷ ${n(T)} ${ap(v)} ${f2(v)} m/s.` },
   { prompt: `What is the centripetal acceleration v² ÷ r, in m/s² to 2 decimal places? Use the unrounded speed.`, answer: [r2(ac)], explanation: `v² ÷ r ≈ ${n(v * v)} ÷ ${n(r)} ${ap(ac)} ${f2(ac)} m/s².` },
   { prompt: `After release the pod falls ${n(h)} m from rest vertically: ${n(h)} = ½ × 9.8 × t². What is t, in seconds to 2 decimal places?`, answer: [r2(t)], explanation: `t = √(2 × ${n(h)} ÷ 9.8) ${ap(t)} ${f2(t)} s.` },
   { prompt: `The pod keeps its horizontal speed v while it falls. What horizontal distance does it travel in that time, in metres to 2 decimal places? Use the unrounded speed and time.`, answer: [r2(d)], explanation: `v × t ≈ ${n(v)} × ${n(t)} ${ap(d)} ${f2(d)} m.` }
  ] }; }
});

mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'How near to the marker crate',
 brief: 'The crew puts a marker crate on the floor in line with the throw, and wants to know how close the pod will land to it.',
 labels: ['range (m)', 'distance from the landing point to the crate (m)'], tolerance: 0.005,
 gl: [['release speed (m/s)'], ['range (m)'], ['distance from the landing point to the crate (m)']]
}, {
 /* v = 2πr ÷ T (steady circle), range = v² sin 2θ ÷ g on level ground, gap = |D − range|. The gap is at least 1 m, and each value is off a rounding tie. */
 canonical: { r: 4, T: 3, th: 0.6, D: 12 },
 draw: R => retry(() => { const p = { r: R.int(3, 6), T: R.int(2, 4), th: R.int(3, 12) / 10 }, v = 2 * PI * p.r / p.T; p.D = Math.max(3, Math.round(v * v * Math.sin(2 * p.th) / g) + R.int(-8, 8)); return p; },
  p => { const v = 2 * PI * p.r / p.T, Rg = v * v * Math.sin(2 * p.th) / g, gap = Math.abs(p.D - Rg); return p.th !== 1 && gap >= 1 && ![v, Rg, gap].some(nearTie); },
  { r: 4, T: 3, th: 0.6, D: 12 }),
 build: ({ r, T, th, D }) => { const v = 2 * PI * r / T, s2 = Math.sin(2 * th), Rg = v * v * s2 / g, gap = Math.abs(D - Rg); return {
  prompt: `The catapult’s sling arm whirls a pod round a circle of radius ${n(r)} m at a steady speed, one full turn every ${n(T)} s. The pod is released from floor level, ${n(th)} radians above the horizontal, and lands on the same flat floor. A marker crate stands on the floor ${n(D)} m from the launch point, in line with the throw. Ignore the air and take g = 9.8 m/s². Enter the pod’s range in metres, then the distance from where it lands to the crate in metres (a positive number whether it lands short of the crate or beyond it), both to 2 decimal places. Work from unrounded values.`,
  answer: [r2(Rg), r2(gap)],
  hints: ['The pod leaves the arm with the speed it had on the circle: once round a circle of length 2πr in one period, so v = 2πr ÷ T.', 'On level ground the range is v² sin(2θ) ÷ g, with θ in radians. The distance to the crate is the difference between the range and the crate’s distance, taken as a positive number.'],
  solution: `Release speed: v = 2π × ${n(r)} ÷ ${n(T)} ${eq(v)} ${n(v)} m/s. Range: v² sin(2θ) ÷ g, with v² ≈ ${n(v * v)}, so it is ${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ${eq(Rg)} ${n(Rg)}, which is ${f2(Rg)} m. The crate is ${n(D)} m away, so the distance between them is ${n(gap)} m (the pod lands ${Rg < D ? 'short of' : 'beyond'} the crate), which is ${f2(gap)} m.`,
  guidance: [
   { prompt: `What is the release speed 2πr ÷ T, in m/s to 2 decimal places?`, answer: [r2(v)], explanation: `2π × ${n(r)} ÷ ${n(T)} ${ap(v)} ${f2(v)} m/s.` },
   { prompt: `What is the range v² sin(2θ) ÷ g, in metres to 2 decimal places? Use the unrounded speed.`, answer: [r2(Rg)], explanation: `${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ${ap(Rg)} ${f2(Rg)} m.` },
   { prompt: `The crate is ${n(D)} m from the launch point. How far is the landing point from the crate, in metres to 2 decimal places?`, answer: [r2(gap)], explanation: `The difference between ${n(D)} and ${n(Rg)} is ${n(gap)}, so about ${f2(gap)} m.` }
  ] }; }
});

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q09', title: 'Winding up from rest',
 brief: 'The test arm starts from a standstill and winds up for a few seconds before it lets the pod go, and the crew wants the whole story of that run.',
 labels: ['speed at release (m/s)', 'total acceleration at release (m/s²)', 'range (m)'], tolerance: 0.005,
 gl: [['speed at release (m/s)'], ['centripetal acceleration (m/s²)'], ['total acceleration at release (m/s²)'], ['range (m)']]
}, {
 /* v = a_t × t from rest; a_c = v² ÷ r; total = √(a_c² + a_t²); range = v² sin 2θ ÷ g. Every asked and guided value is off a rounding tie. */
 canonical: { r: 5, at: 4, t: 3, th: 0.8 },
 draw: R => retry(() => ({ r: R.int(4, 10), at: R.int(2, 6), t: R.int(2, 4), th: R.int(3, 12) / 10 }),
  p => { const v = p.at * p.t, ac = v * v / p.r, tot = Math.hypot(ac, p.at), Rg = v * v * Math.sin(2 * p.th) / g; return p.th !== 1 && ![ac, tot, Rg].some(nearTie); },
  { r: 5, at: 4, t: 3, th: 0.8 }),
 build: ({ r, at, t, th }) => { const v = at * t, ac = v * v / r, tot = Math.hypot(ac, at), Rg = v * v * Math.sin(2 * th) / g; return {
  prompt: `The sling arm starts with the pod at rest. It then speeds the pod up along its circle of radius ${n(r)} m at a steady ${n(at)} m/s every second for ${n(t)} s (a body that starts from rest and gains speed steadily at a reaches the speed a × t after t seconds). At the end of those ${n(t)} s the pod is released from floor level, ${n(th)} radians above the horizontal, and lands on the same flat floor. Ignore the air and take g = 9.8 m/s². Enter the pod’s speed at release in m/s, then the size of its total acceleration just before release in m/s², then its range in metres, all to 2 decimal places.`,
  answer: [r2(v), r2(tot), r2(Rg)],
  hints: ['Starting from rest and gaining speed at a steady rate, the speed after t seconds is the rate times t.', 'Just before release the acceleration has a centripetal part v² ÷ r and a tangential part equal to the rate of speeding up; combine them with Pythagoras. After release, on level ground, the range is v² sin(2θ) ÷ g with θ in radians.'],
  solution: `Speed at release: ${n(at)} × ${n(t)} = ${n(v)} m/s. Centripetal acceleration: ${n(v * v)} ÷ ${n(r)} ${eq(ac)} ${n(ac)} m/s², and the tangential acceleration is ${n(at)} m/s², so the total is √(${n(ac)}² + ${n(at)}²) ${eq(tot)} ${n(tot)}, which is ${f2(tot)} m/s². Range: ${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ${eq(Rg)} ${n(Rg)}, which is ${f2(Rg)} m.`,
  guidance: [
   { prompt: `What speed has the pod reached after ${n(t)} s of gaining ${n(at)} m/s every second, in m/s?`, answer: [r2(v)], explanation: `${n(at)} × ${n(t)} = ${n(v)} m/s.` },
   { prompt: `What is the centripetal acceleration v² ÷ r at release, in m/s² to 2 decimal places?`, answer: [r2(ac)], explanation: `${n(v * v)} ÷ ${n(r)} ${eq(ac)} ${f2(ac)} m/s².` },
   { prompt: `Combine it with the tangential ${n(at)} m/s², which is at a right angle to it. What is the size of the total acceleration, in m/s² to 2 decimal places?`, answer: [r2(tot)], explanation: `√(${n(ac)}² + ${n(at)}²) ${ap(tot)} ${f2(tot)} m/s².` },
   { prompt: `What is the range v² sin(2θ) ÷ g after release, in metres to 2 decimal places?`, answer: [r2(Rg)], explanation: `${n(v * v)} × ${n(Math.sin(2 * th))} ÷ 9.8 ${ap(Rg)} ${f2(Rg)} m.` }
  ] }; }
});

/* ---- q18 Force and Newton's second law, net force ΣF = ma [5.3] ---- */

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'Three tow lines on the pond',
 brief: 'An ice-sampling sledge is being towed across the frozen pond by three lines at once, and the crew wants to know how fast it will speed up.',
 labels: ['net force x (N)', 'net force y (N)', 'acceleration (m/s²)'], tolerance: 0.005,
 gl: [['net force x (N)'], ['net force y (N)'], ['net force size (N)'], ['acceleration (m/s²)']]
}, {
 /* Three forces whose sum is a Pythagorean pair, so its size is whole and the acceleration is a short decimal (at most 2 places, at least 0.2). No force component is 0. */
 canonical: { f1x: 8, f1y: -5, f2x: -12, f2y: 9, f3x: -5, f3y: 8, m: 6 },
 draw: R => retry(() => { const [a, b] = R.pick(TRIPLES), Nx = R.bool() ? a : -a, Ny = R.bool() ? b : -b, f1x = R.nz(-20, 20), f1y = R.nz(-20, 20), f2x = R.nz(-20, 20), f2y = R.nz(-20, 20);
   return { f1x, f1y, f2x, f2y, f3x: Nx - f1x - f2x, f3y: Ny - f1y - f2y, m: R.pick([2, 4, 5, 6, 8, 10, 20, 25]) }; },
  p => { const N = Math.hypot(p.f1x + p.f2x + p.f3x, p.f1y + p.f2y + p.f3y), a = N / p.m; return p.f3x !== 0 && p.f3y !== 0 && tidy2(a) && a >= 0.2 && !(p.f1x === 8 && p.f1y === -5 && p.f2x === -12); },
  { f1x: 8, f1y: -5, f2x: -12, f2y: 9, f3x: -5, f3y: 8, m: 6 }),
 build: ({ f1x, f1y, f2x, f2y, f3x, f3y, m }) => { const Nx = f1x + f2x + f3x, Ny = f1y + f2y + f3y, N = Math.hypot(Nx, Ny), a = N / m; return {
  prompt: `An ice-sampling sledge of mass ${n(m)} kg is towed across the smooth frozen pond by three lines at once, seen from above with x east and y north. Line 1 pulls with force (${n(f1x)}, ${n(f1y)}) N, line 2 with (${n(f2x)}, ${n(f2y)}) N and line 3 with (${n(f3x)}, ${n(f3y)}) N. The ice pushes up on the sledge exactly as hard as gravity pulls it down, and nothing else pushes along the ice. Enter the x component of the net force in newtons, then its y component in newtons, then the size of the sledge’s acceleration in metres per second squared.`,
  answer: [Nx, Ny, a],
  hints: ['The net force ΣF is the vector sum of all the forces on the sledge, however many there are: add all the x components together and all the y components together.', 'Newton’s second law says ΣF = ma, so the size of the acceleration is the size of the net force divided by the mass.'],
  solution: `ΣF = (${n(f1x)} ${pm(f2x)} ${pm(f3x)}, ${n(f1y)} ${pm(f2y)} ${pm(f3y)}) = (${n(Nx)}, ${n(Ny)}) N. Its size is √(${par(Nx)}² + ${par(Ny)}²) = √${n(Nx * Nx + Ny * Ny)} = ${n(N)} N. By Newton’s second law the acceleration has size ${n(N)} ÷ ${n(m)} = ${n(a)} m/s², in the direction of the net force.`,
  guidance: [
   { prompt: `Add the x components of the three lines, ${n(f1x)}, ${n(f2x)} and ${n(f3x)}. What is the net force’s x component, in newtons?`, answer: [Nx], explanation: `${n(f1x)} ${pm(f2x)} ${pm(f3x)} = ${n(Nx)} N.` },
   { prompt: `Add the y components, ${n(f1y)}, ${n(f2y)} and ${n(f3y)}. What is the net force’s y component, in newtons?`, answer: [Ny], explanation: `${n(f1y)} ${pm(f2y)} ${pm(f3y)} = ${n(Ny)} N.` },
   { prompt: `What is the size of the net force (${n(Nx)}, ${n(Ny)}) N, √(x² + y²), in newtons?`, answer: [N], explanation: `√(${par(Nx)}² + ${par(Ny)}²) = √${n(Nx * Nx + Ny * Ny)} = ${n(N)} N.` },
   { prompt: `ΣF = ma. What is the size of the acceleration of the ${n(m)} kg sledge, in m/s²?`, answer: [a], explanation: `${n(N)} ÷ ${n(m)} = ${n(a)} m/s².` }
  ] }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Hauling the pallet sled to the dock',
 brief: 'Two winches haul a pallet sled towards the loading dock from a standstill, and the dock crew wants to know how far it has come after a few seconds.',
 labels: ['acceleration (m/s²)', 'distance moved (m)'], tolerance: 0.005,
 gl: [['net force size (N)'], ['acceleration (m/s²)'], ['distance moved (m)']]
}, {
 /* Net force a Pythagorean pair (so its size is whole); a is a short decimal, and the distance ½at² has at most 2 decimal places (never a tie). */
 canonical: { f1x: 14, f1y: -6, f2x: -2, f2y: 22, m: 8, t: 4 },
 draw: R => retry(() => { const [a, b] = R.pick(TRIPLES), Nx = R.bool() ? a : -a, Ny = R.bool() ? b : -b, f1x = R.nz(-20, 20), f1y = R.nz(-20, 20);
   return { f1x, f1y, f2x: Nx - f1x, f2y: Ny - f1y, m: R.pick([2, 4, 5, 8, 10, 20, 25]), t: R.int(2, 8) }; },
  p => { const N = Math.hypot(p.f1x + p.f2x, p.f1y + p.f2y), a = N / p.m; return p.f2x !== 0 && p.f2y !== 0 && tidy2(a) && a >= 0.2 && tidy2(0.5 * a * p.t * p.t) && !(p.m === 8 && p.f1x === 14); },
  { f1x: 14, f1y: -6, f2x: -2, f2y: 22, m: 8, t: 4 }),
 build: ({ f1x, f1y, f2x, f2y, m, t }) => { const Nx = f1x + f2x, Ny = f1y + f2y, N = Math.hypot(Nx, Ny), a = N / m, d = 0.5 * a * t * t; return {
  prompt: `Two winch ropes haul a pallet sled of mass ${n(m)} kg over smooth ice towards the loading dock, seen from above with x east and y north. The sled starts at rest. Rope 1 pulls with force (${n(f1x)}, ${n(f1y)}) N and rope 2 with (${n(f2x)}, ${n(f2y)}) N, and both forces stay the same. The ice pushes up exactly as hard as gravity pulls down, and nothing else pushes along the ice. A body that starts from rest and keeps a steady acceleration a moves a distance ½ × a × t² in t seconds. Enter the size of the sled’s acceleration in metres per second squared, then the distance the sled has moved after ${n(t)} s, in metres.`,
  answer: [a, d],
  hints: ['Find the net force first: add the x components and the y components of the two rope forces, then take the size of the result. Newton’s second law, ΣF = ma, gives the acceleration.', 'The acceleration is steady because the net force is steady, so the distance from rest is ½ × a × t².'],
  solution: `ΣF = (${n(f1x)} ${pm(f2x)}, ${n(f1y)} ${pm(f2y)}) = (${n(Nx)}, ${n(Ny)}) N, of size √(${par(Nx)}² + ${par(Ny)}²) = √${n(Nx * Nx + Ny * Ny)} = ${n(N)} N. So a = ${n(N)} ÷ ${n(m)} = ${n(a)} m/s². After ${n(t)} s the sled has moved ½ × ${n(a)} × ${n(t)}² = ${n(d)} m.`,
  guidance: [
   { prompt: `Add the rope forces component by component: (${n(f1x)}, ${n(f1y)}) and (${n(f2x)}, ${n(f2y)}). What is the size of the net force, in newtons?`, answer: [N], explanation: `ΣF = (${n(Nx)}, ${n(Ny)}) N, and √(${par(Nx)}² + ${par(Ny)}²) = √${n(Nx * Nx + Ny * Ny)} = ${n(N)} N.` },
   { prompt: `ΣF = ma. What is the size of the acceleration of the ${n(m)} kg pallet sled, in m/s²?`, answer: [a], explanation: `${n(N)} ÷ ${n(m)} = ${n(a)} m/s².` },
   { prompt: `From rest with acceleration ${n(a)} m/s², how far does the sled move in ${n(t)} s, using ½ × a × t², in metres?`, answer: [d], explanation: `½ × ${n(a)} × ${n(t)}² = ${n(d)} m.` }
  ] }; }
});

mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q08', title: 'The missing winch rope',
 brief: 'One winch rope has lost its gauge, but the sled’s recorded velocity shows what the net force must have been, so the crew can find the missing rope’s pull.',
 labels: ['rope 2 force x (N)', 'rope 2 force y (N)', 'rope 2 force size (N)'], tolerance: 0.005,
 gl: [['acceleration x (m/s²)'], ['acceleration y (m/s²)'], ['net force x (N)'], ['net force y (N)'], ['rope 2 force x (N)'], ['rope 2 force y (N)'], ['rope 2 force size (N)']]
}, {
 /* ΣF = m a with a_x = d(vx)/dt and a_y = d(vy)/dt at t0, so rope 2 = m a − rope 1. Neither component of rope 2 is 0, and its size is off a rounding tie. */
 canonical: { m: 6, a1: 2, b1: -3, c1: 5, a2: -1, b2: 4, c2: 2, t0: 3, f1x: 20, f1y: -7 },
 draw: R => retry(() => ({ m: R.int(2, 12), a1: R.nz(-3, 3), b1: R.nz(-8, 8), c1: R.int(-9, 9), a2: R.nz(-3, 3), b2: R.nz(-8, 8), c2: R.int(-9, 9), t0: R.int(1, 5), f1x: R.nz(-30, 30), f1y: R.nz(-30, 30) }),
  p => { const Fx = p.m * (2 * p.a1 * p.t0 + p.b1) - p.f1x, Fy = p.m * (2 * p.a2 * p.t0 + p.b2) - p.f1y; return Fx !== 0 && Fy !== 0 && !nearTie(Math.hypot(Fx, Fy)) && !(p.m === 6 && p.t0 === 3 && p.a1 === 2 && p.b1 === -3) && Math.abs(Fx) < 400 && Math.abs(Fy) < 400; },
  { m: 6, a1: 2, b1: -3, c1: 5, a2: -1, b2: 4, c2: 2, t0: 3, f1x: 20, f1y: -7 }),
 build: ({ m, a1, b1, c1, a2, b2, c2, t0, f1x, f1y }) => { const ax = 2 * a1 * t0 + b1, ay = 2 * a2 * t0 + b2, Sx = m * ax, Sy = m * ay, Fx = Sx - f1x, Fy = Sy - f1y, F = Math.hypot(Fx, Fy); return {
  prompt: `Two winch ropes haul a sled of mass ${n(m)} kg over smooth ice, seen from above with x east and y north. The sled’s recorded velocity components are v_x(t) = ${poly([a1, b1, c1])} m/s and v_y(t) = ${poly([a2, b2, c2])} m/s, where t is the number of seconds since the winches started. At t = ${n(t0)} s rope 1 pulls with force (${n(f1x)}, ${n(f1y)}) N. The ice pushes up exactly as hard as gravity pulls down, and nothing else pushes along the ice. Enter the x component and then the y component of rope 2’s force at that moment in newtons, then its size in newtons to 2 decimal places.`,
  answer: [Fx, Fy, r2(F)],
  hints: ['Each component of the acceleration is the rate of change of that component of the velocity: differentiate v_x and v_y with respect to t, then put in the time.', 'Newton’s second law in components: the net force has x component m × a_x and y component m × a_y, and the net force is rope 1 plus rope 2. So rope 2 is the net force minus rope 1, component by component.'],
  solution: `The acceleration components are the derivatives: a_x(t) = ${poly([2 * a1, b1])} and a_y(t) = ${poly([2 * a2, b2])}, so at t = ${n(t0)} s the acceleration is (${n(ax)}, ${n(ay)}) m/s². The net force is m × a = (${n(m)} × ${par(ax)}, ${n(m)} × ${par(ay)}) = (${n(Sx)}, ${n(Sy)}) N. Rope 2 = net force − rope 1 = (${n(Sx)} − ${par(f1x)}, ${n(Sy)} − ${par(f1y)}) = (${n(Fx)}, ${n(Fy)}) N. Its size is √(${par(Fx)}² + ${par(Fy)}²) ${eq(F)} ${n(F)}, which is ${f2(F)} N.`,
  guidance: [
   { prompt: `Differentiate v_x(t) = ${poly([a1, b1, c1])} and put in t = ${n(t0)}. What is the x component of the acceleration, in m/s²?`, answer: [ax], explanation: `a_x(t) = ${poly([2 * a1, b1])}, so a_x(${n(t0)}) = ${n(ax)} m/s².` },
   { prompt: `Differentiate v_y(t) = ${poly([a2, b2, c2])} and put in t = ${n(t0)}. What is the y component of the acceleration, in m/s²?`, answer: [ay], explanation: `a_y(t) = ${poly([2 * a2, b2])}, so a_y(${n(t0)}) = ${n(ay)} m/s².` },
   { prompt: `What is the x component of the net force, m × a_x, in newtons?`, answer: [Sx], explanation: `${n(m)} × ${par(ax)} = ${n(Sx)} N.` },
   { prompt: `What is the y component of the net force, m × a_y, in newtons?`, answer: [Sy], explanation: `${n(m)} × ${par(ay)} = ${n(Sy)} N.` },
   { prompt: `The net force is rope 1 plus rope 2. What is the x component of rope 2’s force, in newtons?`, answer: [Fx], explanation: `${n(Sx)} − ${par(f1x)} = ${n(Fx)} N.` },
   { prompt: `What is the y component of rope 2’s force, in newtons?`, answer: [Fy], explanation: `${n(Sy)} − ${par(f1y)} = ${n(Fy)} N.` },
   { prompt: `What is the size of rope 2’s force (${n(Fx)}, ${n(Fy)}) N, √(x² + y²), in newtons to 2 decimal places?`, answer: [r2(F)], explanation: `√(${par(Fx)}² + ${par(Fy)}²) ${ap(F)} ${f2(F)} N.` }
  ] }; }
});

/* ---- q19 Mass, weight and the normal force (lift cage speeding up) [5.4, 5.6] ---- */

mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The scale in the hoist',
 brief: 'A technician rides the personnel hoist up and down the crane tower with a spring scale underfoot, and the safety officer wants the reading in each part of the ride.',
 labels: ['scale reading at a steady speed (N)', 'scale reading during the acceleration (N)'], tolerance: 0.01,
 gl: [['scale reading at a steady speed (N)'], ['acceleration (m/s²)'], ['net force (N)'], ['scale reading during the acceleration (N)']]
}, {
 /* Reading = normal force = m(g + a), up positive; the four ways of moving (CAGE, an index into a list of texts) set the sign of a. m from 45 to 80 kg and the size of a from 0.2 to 2.5 m/s², so N stays below 1000. */
 canonical: { m: 72, A: 0.8, k: 3 },
 draw: R => retry(() => ({ m: R.int(45, 80), A: R.int(2, 25) / 10, k: R.int(0, 3) }), p => !(p.m === 60 && p.A === 1.5), { m: 72, A: 0.8, k: 3 }),
 build: ({ m, A, k }) => { const [moving, change, s] = CAGE[k], a = s * A, W = m * g, F = m * a, N = W + F; return {
  prompt: `A technician of mass ${n(m)} kg rides the personnel hoist on the crane tower, standing on a spring scale that reads the normal force the floor pushes up on them with, in newtons. First the hoist moves at a steady speed. Then it is ${moving} and ${change}: its acceleration has size ${n(A)} m/s². Take up as positive and g = 9.8 m/s². Enter the scale reading at the steady speed, then the scale reading during the acceleration, both in newtons.`,
  answer: [W, N],
  hints: ['At a steady speed the technician does not accelerate, so the net force is zero and the floor pushes up exactly as hard as gravity pulls down.', 'Speeding up means the acceleration points the way the hoist moves; slowing down means it points the other way. With up positive, the free-body diagram has the normal force F_N up and the weight mg down, and F_N − mg must equal ma.'],
  solution: `At a steady speed a = 0, so F_N = mg = ${n(m)} × 9.8 = ${n(W)} N. The hoist is ${moving} and ${change}, so its acceleration points ${s > 0 ? 'up' : 'down'}: a = ${n(a)} m/s². Newton’s second law: F_N − ${n(W)} = ${n(m)} × ${par(a)} = ${n(F)}, so F_N = ${n(W)} ${pm(F)} = ${n(N)} N.`,
  guidance: [
   { prompt: `At a steady speed the floor pushes up exactly as hard as gravity pulls down. What does the scale read, in newtons?`, answer: [W], explanation: `F_N = mg = ${n(m)} × 9.8 = ${n(W)} N.` },
   { prompt: `The hoist is ${moving} and ${change}. With up positive, what is the technician’s acceleration a, in m/s² (negative if it points down)?`, answer: [a], explanation: `${change === 'speeding up' ? 'Speeding up' : 'Slowing down'} while ${moving} means the acceleration points ${s > 0 ? 'up' : 'down'}, so a = ${n(a)} m/s².` },
   { prompt: `The net force on the technician is ma. What is it, in newtons (negative if it points down)?`, answer: [F], explanation: `${n(m)} × ${par(a)} = ${n(F)} N.` },
   { prompt: `The forces are the normal force F_N up and the weight ${n(W)} N down, so F_N − ${n(W)} = ${n(F)}. What does the scale read now, in newtons?`, answer: [N], explanation: `F_N = ${n(W)} ${pm(F)} = ${n(N)} N.` }
  ] }; }
});

mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'The cage floor that gives way',
 brief: 'The cage floor plate is only rated for so much push, and the crane crew must set the fastest start that will not overload it.',
 labels: ['largest acceleration (m/s²)', 'time to reach the speed (s)'], tolerance: 0.005,
 gl: [['largest net force (N)'], ['largest acceleration (m/s²)'], ['time (s)']]
}, {
 /* a = Fmax ÷ m − g is a whole number of tenths (Fmax = m(9.8 + A), A in tenths from 0.5 to 3), and t = V ÷ a is off a rounding tie. */
 canonical: { m: 55, Fm: 605, V: 5 },
 draw: R => retry(() => { const m = R.int(30, 70); return { m, Fm: R.int(Math.ceil(m * (g + 0.5)), Math.floor(m * (g + 3))), V: R.int(2, 6) }; },
  p => { const a = p.Fm / p.m - g; return !nearTie(a) && !nearTie(p.V / a) && !(p.m === 50 && p.Fm === 550); }, { m: 55, Fm: 605, V: 5 }),
 build: ({ m, Fm, V }) => { const W = m * g, net = Fm - W, a = Fm / m - g, t = V / a; return {
  prompt: `The floor plate of a Crane Yard lift cage can push up on whatever stands on it with a force of at most ${n(Fm)} N before it gives way. A crate of mass ${n(m)} kg stands on the plate. The cage starts from rest and rises, speeding up steadily. Take g = 9.8 m/s². Enter the largest upward acceleration the cage can have without the plate pushing harder than ${n(Fm)} N, in m/s², then how long the cage takes to reach ${n(V)} m/s from rest at that acceleration, in seconds (a body that starts from rest and speeds up steadily at a reaches speed v after v ÷ a seconds). Give both to 2 decimal places, and use the unrounded acceleration for the time.`,
  answer: [r2(a), r2(t)],
  hints: ['Weight is mg, pointing down. With up positive, Newton’s second law for the crate is F_N − mg = ma, and the largest acceleration is the one that makes F_N as big as the plate allows.', 'Solve for a: a = (F_N − mg) ÷ m. Then the time to reach a speed v from rest is v ÷ a.'],
  solution: `Weight: ${n(m)} × 9.8 = ${n(W)} N. With F_N at its largest, the net force is ${n(Fm)} − ${n(W)} = ${n(net)} N, so a = ${n(net)} ÷ ${n(m)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s². The time to reach ${n(V)} m/s is ${n(V)} ÷ ${n(a)} ${eq(t)} ${n(t)}, which is ${f2(t)} s.`,
  guidance: [
   { prompt: `The crate’s weight is ${n(W)} N and the plate may push up with at most ${n(Fm)} N. What is the largest net force on the crate, in newtons?`, answer: [net], explanation: `${n(Fm)} − ${n(W)} = ${n(net)} N.` },
   { prompt: `ΣF = ma. What is the largest acceleration of the ${n(m)} kg crate, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(net)} ÷ ${n(m)} ${eq(a)} ${f2(a)} m/s².` },
   { prompt: `How long does it take to reach ${n(V)} m/s from rest at ${n(a)} m/s², speed ÷ a, in seconds to 2 decimal places?`, answer: [r2(t)], explanation: `${n(V)} ÷ ${n(a)} ${eq(t)} ${n(t)}, which is ${f2(t)} s.` }
  ] }; }
});

mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q08', title: 'The cage on its test run',
 brief: 'The cage’s test run was recorded as a velocity curve, and the crew wants the floor push on a crate at one moment of the run.',
 labels: ['cage acceleration (m/s²)', 'normal force on the crate (N)'], tolerance: 0.01,
 gl: [['cage acceleration (m/s²)'], ['weight (N)'], ['net force (N)'], ['normal force on the crate (N)']]
}, {
 /* a(t0) = 2 p t0 + q with v(t) = p t² + q t + c; N = m(g + a). a is not 0, and N lies between 100 and 1000 N, so it is positive and has no comma. */
 canonical: { m: 55, p: 1.5, q: -4, c: 3, t0: 2 },
 draw: R => retry(() => ({ m: R.int(40, 90), p: R.pick([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]), q: R.nz(-6, 6), c: R.int(0, 8), t0: R.int(1, 5) }),
  p => { const a = 2 * p.p * p.t0 + p.q, N = p.m * (g + a); return a !== 0 && N >= 100 && N < 1000 && !(p.m === 50 && p.t0 === 3); },
  { m: 55, p: 1.5, q: -4, c: 3, t0: 2 }),
 build: ({ m, p, q, c, t0 }) => { const a = 2 * p * t0 + q, W = m * g, F = m * a, N = W + F; return {
  prompt: `A crate of mass ${n(m)} kg stands on the floor of a Crane Yard lift cage on a test run. The cage’s upward velocity is v(t) = ${poly([p, q, c])} metres per second, where t is the number of seconds since the run began, so a negative v means the cage is moving down. Take up as positive and g = 9.8 m/s². Enter the cage’s acceleration at t = ${n(t0)} s in m/s² (negative if it points down), then the normal force the floor pushes up on the crate with at that moment, in newtons.`,
  answer: [a, N],
  hints: ['The acceleration is the rate of change of the velocity: differentiate v(t) with respect to t, then put in the time.', 'With up positive, the free-body diagram has the normal force F_N up and the weight mg down, and Newton’s second law gives F_N − mg = ma. A negative a simply means the acceleration points down.'],
  solution: `The acceleration is the derivative of v(t): a(t) = ${poly([2 * p, q])}, so at t = ${n(t0)} s, a = ${n(a)} m/s². The crate’s weight is ${n(m)} × 9.8 = ${n(W)} N. Newton’s second law: F_N − ${n(W)} = ${n(m)} × ${par(a)} = ${n(F)}, so F_N = ${n(W)} ${pm(F)} = ${n(N)} N.`,
  guidance: [
   { prompt: `Differentiate v(t) = ${poly([p, q, c])} and put in t = ${n(t0)}. What is the cage’s acceleration, in m/s²?`, answer: [a], explanation: `a(t) = ${poly([2 * p, q])}, so a(${n(t0)}) = ${n(a)} m/s².` },
   { prompt: `What is the crate’s weight mg, in newtons?`, answer: [W], explanation: `${n(m)} × 9.8 = ${n(W)} N.` },
   { prompt: `The net force on the crate is ma. What is it, in newtons (negative if it points down)?`, answer: [F], explanation: `${n(m)} × ${par(a)} = ${n(F)} N.` },
   { prompt: `F_N − ${n(W)} = ${n(F)}. What is the normal force F_N, in newtons?`, answer: [N], explanation: `F_N = ${n(W)} ${pm(F)} = ${n(N)} N.` }
  ] }; }
});

/* ---- q20 Newton's third law and tension: two crates on one cable [5.5, 6.1] ---- */

mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Two sleds on a tow-bar',
 brief: 'Two cargo sleds are coupled by a tow-bar and dragged across the ice by one winch cable, and the coupling must not be asked to hold more than it is rated for.',
 labels: ['acceleration (m/s²)', 'tension in the tow-bar (N)'], tolerance: 0.005,
 gl: [['total mass (kg)'], ['acceleration (m/s²)'], ['tow-bar tension (N)']]
}, {
 /* Level ice, so no weights: a = F ÷ (m1 + m2) and the tow-bar tension T = m2a = m2F ÷ (m1 + m2), both off rounding ties. The two masses differ. */
 canonical: { m1: 30, m2: 18, F: 130 },
 draw: R => retry(() => { const m1 = R.int(10, 45), m2 = R.int(10, 30); return { m1, m2, F: R.int(Math.ceil((m1 + m2) * 0.3), 400) }; },
  p => { const M = p.m1 + p.m2, a = p.F / M, T = p.m2 * p.F / M; return a >= 0.2 && a <= 8 && p.m1 !== p.m2 && !nearTie(a) && !nearTie(T) && !(p.m1 === 20 && p.m2 === 10); },
  { m1: 30, m2: 18, F: 130 }),
 build: ({ m1, m2, F }) => { const M = m1 + m2, a = F / M, T = m2 * a; return {
  prompt: `Two cargo sleds sit one behind the other on smooth, level ice. A winch cable pulls the front sled, of mass ${n(m1)} kg, forwards with a force of ${n(F)} N. A tow-bar couples the rear sled, of mass ${n(m2)} kg, to the front one. Ignore the mass of the tow-bar and any friction. Enter the sleds’ acceleration in metres per second squared, then the tension in the tow-bar in newtons, both to 2 decimal places. Work out the tension from the unrounded acceleration.`,
  answer: [r2(a), r2(T)],
  hints: ['Treat both sleds as one system. The tow-bar pulls the rear sled forwards and the front sled backwards with forces of equal size (Newton’s third law), so they cancel inside the system: only the cable’s pull acts along the ice.', 'Then look at the rear sled alone: the tow-bar’s tension is the only horizontal force on it, so T = m₂a.'],
  solution: `Whole system: mass ${n(m1)} + ${n(m2)} = ${n(M)} kg and the only horizontal force is ${n(F)} N, so a = ${n(F)} ÷ ${n(M)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s². Rear sled alone: T = m₂a = ${n(m2)} × ${n(a)} ${eq(T)} ${n(T)}, which is ${f2(T)} N. By Newton’s third law the tow-bar pulls back on the front sled with the same ${f2(T)} N.`,
  guidance: [
   { prompt: `Take both sleds as one system. What is its total mass, in kilograms?`, answer: [M], explanation: `${n(m1)} + ${n(m2)} = ${n(M)} kg.` },
   { prompt: `The only horizontal force on the system is the cable’s ${n(F)} N, since the tow-bar’s pulls cancel inside it. What is the acceleration, force ÷ total mass, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(F)} ÷ ${n(M)} ${eq(a)} ${f2(a)} m/s².` },
   { prompt: `Now the ${n(m2)} kg rear sled alone: the tow-bar’s tension T is the only horizontal force on it, so T = ${n(m2)} × a. What is T, in newtons to 2 decimal places? Use the unrounded acceleration.`, answer: [r2(T)], explanation: `T = ${n(m2)} × ${n(a)} ${eq(T)} ${n(T)}, which is ${f2(T)} N.` }
  ] }; }
});

mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'The lower cable’s rating',
 brief: 'The lower cable on a twin lift has a rating plate, and the crane operator needs to know the hardest the crane may pull without overloading it.',
 labels: ['greatest acceleration (m/s²)', 'greatest crane pull (N)'], tolerance: 0.005,
 gl: [['greatest acceleration (m/s²)'], ['net force on both crates (N)'], ['greatest crane pull (N)']]
}, {
 /* The lower cable's rating is Tmax = m2(9.8 + A) with A in tenths from 0.3 to 2.5, so a = Tmax ÷ m2 − g = A and the crane pull F = (m1 + m2)(g + A) are short decimals below 1000 N. The masses differ. */
 canonical: { m1: 35, m2: 20, Tm: 224 },
 draw: R => retry(() => { const m2 = R.int(10, 30); return { m1: R.int(10, 45), m2, Tm: R.int(Math.ceil(m2 * (g + 0.3)), Math.floor(m2 * (g + 2.5))) }; },
  p => { const a = p.Tm / p.m2 - g; return p.m1 !== p.m2 && !(p.m1 === 40 && p.m2 === 25) && !nearTie(a) && !nearTie((p.m1 + p.m2) * a) && !nearTie((p.m1 + p.m2) * (g + a)); }, { m1: 35, m2: 20, Tm: 224 }),
 build: ({ m1, m2, Tm }) => { const M = m1 + m2, a = Tm / m2 - g, S = M * a, F = M * g + S; return {
  prompt: `The gantry crane lifts two crates. Its cable pulls straight up on the top crate, of mass ${n(m1)} kg. A lower cable hangs from the top crate and holds the bottom crate, of mass ${n(m2)} kg. The lower cable’s rating plate says it must never carry a tension above ${n(Tm)} N. Ignore the mass of the cables and take g = 9.8 m/s². Enter the greatest upward acceleration the crates can have without the lower cable’s tension passing ${n(Tm)} N, in m/s², then the greatest pull the crane’s cable can then exert on the top crate, in newtons, both to 2 decimal places. Use the unrounded acceleration for the pull.`,
  answer: [r2(a), r2(F)],
  hints: ['Look at the bottom crate alone: the lower cable pulls it up with the tension T and gravity pulls it down, so T − m₂g = m₂a. The largest allowed T gives the largest a.', 'Then treat both crates as one system, whose total mass is m₁ + m₂: the lower cable’s pulls cancel inside it (Newton’s third law), so the crane’s pull F minus the total weight must equal the total mass times a.'],
  solution: `Bottom crate alone, with T at its largest: ${n(Tm)} − ${n(m2 * g)} = ${n(m2)}a, so a = ${n(Tm - m2 * g)} ÷ ${n(m2)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s². Whole system: mass ${n(M)} kg, so the net force is ${n(M)} × ${n(a)} ${eq(S)} ${n(S)} N and the total weight is ${n(M)} × 9.8 = ${n(M * g)} N. The crane’s pull is F = ${n(M * g)} + ${n(S)} ${eq(F)} ${n(F)}, which is ${f2(F)} N.`,
  guidance: [
   { prompt: `Bottom crate alone: T − ${n(m2 * g)} = ${n(m2)} × a, with T = ${n(Tm)} N. What is the greatest acceleration a, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `a = (${n(Tm)} − ${n(m2 * g)}) ÷ ${n(m2)} ${eq(a)} ${f2(a)} m/s².` },
   { prompt: `Take both crates as one system of mass ${n(M)} kg. What net force does it need to have the acceleration ${n(a)} m/s², in newtons to 2 decimal places?`, answer: [r2(S)], explanation: `${n(M)} × ${n(a)} ${eq(S)} ${n(S)}, which is ${f2(S)} N.` },
   { prompt: `The crane’s pull must supply that net force and also hold up the total weight ${n(M)} × 9.8 N. What is the greatest crane pull, in newtons to 2 decimal places?`, answer: [r2(F)], explanation: `F = ${n(M * g)} + ${n(S)} ${eq(F)} ${n(F)}, which is ${f2(F)} N.` }
  ] }; }
});

mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', title: 'A chain of three crates',
 brief: 'The crane is lifting three crates hung one under another, and both of the cables between them must be checked against their ratings.',
 labels: ['acceleration (m/s²)', 'tension in the upper cable between crates (N)', 'tension in the lower cable between crates (N)'], tolerance: 0.005,
 gl: [['total weight (N)'], ['acceleration (m/s²)'], ['tension in the lower cable (N)'], ['tension in the upper cable (N)']]
}, {
 /* a = F ÷ M − g, the lower link T3 = m3(g + a) = m3F ÷ M and the upper link T2 = (m2 + m3)(g + a) = (m2 + m3)F ÷ M, to 2 decimal places, off rounding ties, with a from 0.2 and F below 1000 N. */
 canonical: { m1: 20, m2: 15, m3: 12, F: 520 },
 draw: R => retry(() => { const m1 = R.int(8, 30), m2 = R.int(8, 25), m3 = R.int(8, 20), M = m1 + m2 + m3; return { m1, m2, m3, F: R.int(Math.ceil(M * 10), Math.min(999, Math.floor(M * 12.8))) }; },
  p => { const M = p.m1 + p.m2 + p.m3, a = p.F / M - g, T3 = p.m3 * p.F / M, T2 = (p.m2 + p.m3) * p.F / M; return a >= 0.2 && ![a, T3, T2].some(nearTie) && !(p.m1 === 20 && p.m2 === 10); },
  { m1: 20, m2: 15, m3: 12, F: 520 }),
 build: ({ m1, m2, m3, F }) => { const M = m1 + m2 + m3, W = M * g, a = F / M - g, T3 = m3 * (g + a), T2 = (m2 + m3) * (g + a); return {
  prompt: `The gantry crane lifts three crates hung one under another. Its cable pulls straight up with ${n(F)} N on the top crate, of mass ${n(m1)} kg. An upper cable hangs from the top crate and holds the middle crate, of mass ${n(m2)} kg. A lower cable hangs from the middle crate and holds the bottom crate, of mass ${n(m3)} kg. Ignore the mass of the cables and take g = 9.8 m/s². Enter the crates’ upward acceleration in metres per second squared, then the tension in the upper cable in newtons, then the tension in the lower cable in newtons, all to 2 decimal places. Work out the tensions from the unrounded acceleration.`,
  answer: [r2(a), r2(T2), r2(T3)],
  hints: ['Treat all three crates as one system: the cables between them pull in equal and opposite pairs (Newton’s third law) which cancel, so only the crane’s pull and the total weight act on it.', 'For a tension, look at everything hanging below that cable as one body: the lower cable holds only the bottom crate, so T − m₃g = m₃a. The upper cable holds the middle and bottom crates together, so its tension T satisfies T − (m₂ + m₃)g = (m₂ + m₃)a.'],
  solution: `Whole system: mass ${n(m1)} + ${n(m2)} + ${n(m3)} = ${n(M)} kg and weight ${n(M)} × 9.8 = ${n(W)} N. Net force ${n(F)} − ${n(W)} = ${n(F - W)} N, so a = ${n(F - W)} ÷ ${n(M)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s². Bottom crate alone: T − ${n(m3 * g)} = ${n(m3)}a, so the lower tension is ${n(m3)} × (9.8 + a) ${eq(T3)} ${n(T3)}, which is ${f2(T3)} N. Middle and bottom crates together (mass ${n(m2 + m3)} kg): the upper tension is ${n(m2 + m3)} × (9.8 + a) ${eq(T2)} ${n(T2)}, which is ${f2(T2)} N.`,
  guidance: [
   { prompt: `Take the three crates as one system of mass ${n(M)} kg. What is its total weight, in newtons?`, answer: [W], explanation: `${n(M)} × 9.8 = ${n(W)} N.` },
   { prompt: `The net force on the system is ${n(F)} − ${n(W)} N. What is the acceleration, net force ÷ total mass, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(F - W)} ÷ ${n(M)} ${eq(a)} ${f2(a)} m/s², upwards.` },
   { prompt: `The ${n(m3)} kg bottom crate alone: T − ${n(m3 * g)} = ${n(m3)} × a. What is the tension in the lower cable, in newtons to 2 decimal places? Use the unrounded acceleration.`, answer: [r2(T3)], explanation: `T = ${n(m3)} × (9.8 + a) ${eq(T3)} ${f2(T3)} N, with a ${eq(a)} ${n(a)} m/s².` },
   { prompt: `The middle and bottom crates together have mass ${n(m2 + m3)} kg and are held by the upper cable: T − ${n((m2 + m3) * g)} = ${n(m2 + m3)} × a. What is the tension in the upper cable, in newtons to 2 decimal places? Use the unrounded acceleration.`, answer: [r2(T2)], explanation: `T = ${n(m2 + m3)} × (9.8 + a) ${eq(T2)} ${f2(T2)} N.` }
  ] }; }
});

})();
