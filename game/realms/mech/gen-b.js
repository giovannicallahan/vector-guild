/* Mechanics: motion and force mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const g = 9.8, PI = Math.PI;
/* Rounding to 2 decimal places, and a guard: true when x sits within 0.05 of a hundredth's rounding tie (so a
   player's own rounding of x could land on either side). */
const r2 = x => Math.round(x * 100) / 100;
const nearTie = x => { const f = Math.abs(x) * 100 - Math.floor(Math.abs(x) * 100); return Math.abs(f - 0.5) < 0.05; };
const f2 = x => n(r2(x));
/* '=' when n(x) shows x exactly, '≈' when it is rounded. */
const eq = x => Math.abs(Number(n(x).replace('−', '-')) - x) < 1e-12 ? '=' : '≈';
/* "b + ct" with signs written out: lin(2, 3) is "2 + 3t", lin(−4, 6) is "−4 + 6t". */
const sgn = v => v < 0 ? '−' : '+';
/* Coefficient without a written-out 1: co(1, 't²') is 't²', co(1.5, 't²') is '1.5t²' (the sign is written separately). */
const co = (v, x) => `${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const lin = (b, c) => `${n(b)} ${sgn(c)} ${n(Math.abs(c))}t`;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...canon }; };
/* Pythagorean net forces for q18. */
const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9], [8, 15], [15, 8], [12, 16], [16, 12], [15, 20], [20, 15], [7, 24], [24, 7]];
/* q19: the four ways a lift cage can move, as [moving, change, sign of a with up positive]. */
const CAGE = [['rising', 'speeding up', 1], ['rising', 'slowing down', -1], ['descending', 'speeding up', -1], ['descending', 'slowing down', 1]];
/* Signed term with a space: pm(3) is "+ 3", pm(−2) is "− 2". */
const pm = x => `${sgn(x)} ${n(Math.abs(x))}`;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* a(t) = b + ct, so v(t) = v0 + bt + (c ÷ 2)t² and x(t) = x0 + v0t + (b ÷ 2)t² + (c ÷ 6)t³. c is a multiple of 3, so every
    answer is a whole number or ends in .5. The sled keeps moving down the run (v > 0) for the whole time. Not the
    worked example (a(t) = 4 + 6t, v(0) = 1, x(0) = 5, t = 2): b = 4 with c = 6 is never drawn. */
 q11: {
  canonical: { b: 2, c: 3, v0: 4, x0: 10, T: 4 },
  draw: R => retry(() => ({ b: R.nz(-4, 6), c: R.pick([-6, -3, 3, 6]), v0: R.int(2, 9), x0: R.int(2, 20), T: R.int(2, 5) }),
   p => { if (p.b === 4 && p.c === 6) return false; for (let k = 0; k <= 100 * p.T; k++) { const t = k / 100; if (p.v0 + p.b * t + p.c * t * t / 2 <= 0) return false; } return true; },
   { b: 2, c: 3, v0: 4, x0: 10, T: 4 }),
  build: ({ b, c, v0, x0, T }) => { const k2 = c / 2, k3 = c / 6, h = b / 2, T2 = T * T, T3 = T2 * T,
   v = v0 + b * T + k2 * T2, x = x0 + v0 * T + h * T2 + k3 * T3; return {
   prompt: `A rocket sled on the Sled Run has a booster whose push changes as it burns, so the sled’s acceleration is not constant: it is a(t) = ${lin(b, c)} m/s², t seconds after the start. Distances are measured down the run from the top marker, with positive meaning down the run. At t = 0 the sled is at x(0) = ${n(x0)} m with velocity v(0) = ${n(v0)} m/s. Enter its velocity at t = ${n(T)} s in metres per second, then its position at t = ${n(T)} s in metres.`,
   answer: [v, x],
   hints: ['Velocity is an antiderivative of acceleration: v(t) = ∫a(t) dt + C, and the constant C is the velocity at t = 0.', 'Position is an antiderivative of velocity: x(t) = ∫v(t) dt + C, and this constant is the position at t = 0.'],
   solution: `An antiderivative of a(t) = ${lin(b, c)} is ${b < 0 ? '−' : ''}${co(b, 't')} ${sgn(c)} ${co(k2, 't²')}. At t = 0 it is 0, so the constant is v(0) = ${n(v0)} and v(t) = ${n(v0)} ${sgn(b)} ${co(b, 't')} ${sgn(c)} ${co(k2, 't²')}. At t = ${n(T)}: v = ${n(v0)} ${sgn(b)} ${n(Math.abs(b * T))} ${sgn(c)} ${n(Math.abs(k2 * T2))} = ${n(v)} m/s. An antiderivative of v(t) is ${n(v0)}t ${sgn(b)} ${co(h, 't²')} ${sgn(c)} ${co(k3, 't³')}, and the constant is x(0) = ${n(x0)}, so x(t) = ${n(x0)} + ${n(v0)}t ${sgn(b)} ${co(h, 't²')} ${sgn(c)} ${co(k3, 't³')}. At t = ${n(T)}: x = ${n(x0)} + ${n(v0 * T)} ${sgn(b)} ${n(Math.abs(h * T2))} ${sgn(c)} ${n(Math.abs(k3 * T3))} = ${n(x)} m.`,
   guidance: [
    { prompt: `Integrate a(t) = ${lin(b, c)} and add v(0): v(t) = ${n(v0)} ${sgn(b)} ${co(b, 't')} + kt². What is the number k, in m/s³?`, answer: [k2], explanation: `The antiderivative of ${n(c)}t is ${n(c)}t² ÷ 2, so k = ${n(c)} ÷ 2 = ${n(k2)}.` },
    { prompt: `Put t = ${n(T)} into v(t) = ${n(v0)} ${sgn(b)} ${co(b, 't')} ${sgn(c)} ${co(k2, 't²')}. What is the velocity, in m/s?`, answer: [v], explanation: `${n(v0)} ${sgn(b)} ${n(Math.abs(b))} × ${n(T)} ${sgn(c)} ${n(Math.abs(k2))} × ${n(T2)} = ${n(v)} m/s.` },
    { prompt: `Integrate v(t) and add x(0) = ${n(x0)}: x(t) = ${n(x0)} + ${n(v0)}t ${sgn(b)} ${co(h, 't²')} ${sgn(c)} ${co(k3, 't³')}. What is the position at t = ${n(T)}, in metres?`, answer: [x], explanation: `${n(x0)} + ${n(v0)} × ${n(T)} ${sgn(b)} ${n(Math.abs(h))} × ${n(T2)} ${sgn(c)} ${n(Math.abs(k3))} × ${n(T3)} = ${n(x)} m.` }
   ] }; }
 },
 /* Fall time t = √(2h ÷ g) and distance ut, both to 2 decimal places. Draws avoid rounding ties and draws where
    multiplying the rounded time by u would change the rounded distance. Not the worked example (h = 10, u = 5). */
 q12: {
  canonical: { h: 20, u: 12 },
  draw: R => retry(() => ({ h: R.int(5, 80), u: R.int(3, 20) }), p => { const t = Math.sqrt(2 * p.h / g), x = p.u * t;
   return !(p.h === 10 && p.u === 5) && !nearTie(t) && !nearTie(x) && r2(p.u * r2(t)) === r2(x); }, { h: 20, u: 12 }),
  build: ({ h, u }) => { const t = Math.sqrt(2 * h / g), x = u * t, q = 2 * h / g; return {
   prompt: `The catapult crew tests a pod launcher on the rim of the crater. It fires a supply pod straight out sideways (horizontally) at ${n(u)} m/s from a platform ${n(h)} m above the flat crater floor. Ignore the air and take g = 9.8 m/s². Enter the time the pod is in the air in seconds, then how far it lands from the foot of the platform, measured along the floor, in metres. Give both to 2 decimal places, and work out the distance from the unrounded time.`,
   answer: [r2(t), r2(x)],
   hints: ['The fall is free fall that starts with no up or down speed: the drop is ½gt², so set ½ × 9.8 × t² equal to the height and solve for t.', 'Sideways nothing pushes the pod, so its sideways speed stays the same the whole time: distance = sideways speed × time in the air.'],
   solution: `Down: ${n(h)} = ½ × 9.8 × t², so t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)} and t = √${n(q)} ${eq(t)} ${n(t)}, which is ${f2(t)} s to 2 decimal places. Sideways: the speed stays ${n(u)} m/s, so the pod travels ${n(u)} × ${n(t)} ≈ ${n(x)} m, which is ${f2(x)} m to 2 decimal places.`,
   guidance: [
    { prompt: `Look at the up-and-down motion only. It starts with no vertical speed and drops ${n(h)} m, so ${n(h)} = ½ × 9.8 × t². What is t, in seconds, to 2 decimal places?`, answer: [r2(t)], explanation: `t² = 2 × ${n(h)} ÷ 9.8 ${eq(q)} ${n(q)}, so t = √${n(q)} ≈ ${f2(t)} s. The sideways speed plays no part in how long the fall takes.` },
    { prompt: `Sideways, the pod keeps its ${n(u)} m/s for the whole of that time. How far does it travel along the floor, in metres, to 2 decimal places?`, answer: [r2(x)], explanation: `Distance = ${n(u)} × ${n(t)} ≈ ${f2(x)} m, using the unrounded time.` }
   ] }; }
 },
 /* Level ground: v0y = v sin θ, flight time 2v0y ÷ g, range v² sin 2θ ÷ g, highest point v0y² ÷ (2g). θ in radians
    from 0.3 to 1.2 (never exactly the 45° angle π ÷ 4). Every guided and asked value is off a rounding tie. Not the worked
    example (v = 15, θ = 1). */
 q13: {
  canonical: { v: 20, th: 0.6 },
  draw: R => retry(() => ({ v: R.int(10, 40), th: R.int(3, 12) / 10 }), p => { const vy = p.v * Math.sin(p.th);
   return p.th !== 1 && ![vy, 2 * vy / g, p.v * p.v * Math.sin(2 * p.th) / g, vy * vy / (2 * g)].some(nearTie); }, { v: 20, th: 0.6 }),
  build: ({ v, th }) => { const s = Math.sin(th), vy = v * s, T = 2 * vy / g, s2 = Math.sin(2 * th), R = v * v * s2 / g, H = vy * vy / (2 * g); return {
   prompt: `The pod catapult throws a supply pod from the flat crater floor at ${n(v)} m/s, aimed ${n(th)} radians above the horizontal. It lands back on the same flat floor. Ignore the air and take g = 9.8 m/s². Enter the range (the distance along the floor from launch to landing) in metres, then the greatest height the pod reaches above the floor in metres, both to 2 decimal places.`,
   answer: [r2(R), r2(H)],
   hints: ['Split the launch speed into parts: sideways v cos θ and upwards v sin θ, with θ in radians. Only the upward part decides how long the flight lasts and how high it goes.', 'On level ground the range is v² sin(2θ) ÷ g, and the greatest height is (v sin θ)² ÷ (2g).'],
   solution: `Upward part of the launch speed: ${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s. Range: ${n(v)}² × sin(2 × ${n(th)}) ÷ 9.8 ≈ ${n(v * v)} × ${n(s2)} ÷ 9.8 ${eq(R)} ${n(R)}, which is ${f2(R)} m. Greatest height: ${n(vy)}² ÷ (2 × 9.8) ${eq(H)} ${n(H)}, which is ${f2(H)} m. (The flight lasts 2 × ${n(vy)} ÷ 9.8 ≈ ${f2(T)} s.)`,
   guidance: [
    { prompt: `What is the upward part of the launch speed, ${n(v)} × sin ${n(th)} (θ in radians), in m/s to 2 decimal places?`, answer: [r2(vy)], explanation: `${n(v)} × sin ${n(th)} ≈ ${n(v)} × ${n(s)} ≈ ${f2(vy)} m/s.` },
    { prompt: `The pod rises until its upward speed is 0, then falls for just as long. The flight time is 2 × (upward speed) ÷ g. What is it, in seconds, to 2 decimal places?`, answer: [r2(T)], explanation: `2 × ${n(vy)} ÷ 9.8 ≈ ${f2(T)} s.` },
    { prompt: `The range is the sideways speed ${n(v)} × cos ${n(th)} times the flight time. Since 2 sin θ cos θ = sin(2θ), that comes to v² sin(2θ) ÷ g. What is the range, in metres, to 2 decimal places?`, answer: [r2(R)], explanation: `${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ≈ ${n(v * v)} × ${n(s2)} ÷ 9.8 ≈ ${f2(R)} m.` },
    { prompt: `At the top the upward speed is 0, so the height is (upward speed)² ÷ (2g). What is the greatest height, in metres, to 2 decimal places?`, answer: [r2(H)], explanation: `${n(vy)}² ÷ 19.6 ≈ ${f2(H)} m.` }
   ] }; }
 },
 /* Speed 2πr ÷ T and centripetal acceleration v² ÷ r = 4π²r ÷ T², both to 2 decimal places, both off rounding ties.
    Not the worked example (r = 3, T = 2). */
 q14: {
  canonical: { r: 5, T: 4 },
  draw: R => retry(() => ({ r: R.int(2, 12), T: R.int(2, 12) }), p => { const v = 2 * PI * p.r / p.T, a = v * v / p.r;
   return !(p.r === 3 && p.T === 2) && !nearTie(v) && !nearTie(a) && !nearTie(2 * PI * p.r) && a < 2000; }, { r: 5, T: 4 }),
  build: ({ r, T }) => { const C = 2 * PI * r, v = C / T, a = v * v / r; return {
   prompt: `Before a throw, the catapult’s sling arm whirls a supply pod round a circle of radius ${n(r)} m at a steady speed, taking ${n(T)} s for each full turn (its period). Enter the pod’s speed in metres per second, then the size of its centripetal acceleration in metres per second squared, both to 2 decimal places. Work out the acceleration from the unrounded speed.`,
   answer: [r2(v), r2(a)],
   hints: ['In one period the pod goes once round the circle, a distance of 2πr. Speed is that distance divided by the period.', 'The centripetal acceleration points at the centre and has size v² ÷ r.'],
   solution: `One turn is 2π × ${n(r)} ≈ ${n(C)} m, covered in ${n(T)} s, so v = ${n(C)} ÷ ${n(T)} ${eq(v)} ${n(v)}, which is ${f2(v)} m/s. The centripetal acceleration is v² ÷ r = ${n(v)}² ÷ ${n(r)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s², directed at the centre of the circle.`,
   guidance: [
    { prompt: `How far does the pod travel in one full turn of a circle of radius ${n(r)} m? Give the circumference 2πr in metres, to 2 decimal places.`, answer: [r2(C)], explanation: `2π × ${n(r)} ≈ ${f2(C)} m.` },
    { prompt: `It covers that distance in one period, ${n(T)} s. What is its speed, in m/s, to 2 decimal places?`, answer: [r2(v)], explanation: `${n(C)} ÷ ${n(T)} ≈ ${f2(v)} m/s.` },
    { prompt: `What is the centripetal acceleration v² ÷ r, in m/s², to 2 decimal places?`, answer: [r2(a)], explanation: `${n(v)}² ÷ ${n(r)} ≈ ${f2(a)} m/s², pointing at the centre.` }
   ] }; }
 },
 /* Centripetal v² ÷ r and total √(a_c² + a_t²), to 2 decimal places, off rounding ties. a_t in tenths from 0.5 to 6.
    Not the worked example (r = 10, v = 6, a_t = 2.7). */
 q15: {
  canonical: { r: 8, v: 6, at: 3.5 },
  draw: R => retry(() => ({ r: R.int(2, 15), v: R.int(3, 20), at: R.int(5, 60) / 10 }), p => { const ac = p.v * p.v / p.r, tot = Math.hypot(ac, p.at);
   return !(p.r === 10 && p.v === 6) && !nearTie(ac) && !nearTie(tot) && ac < 200 && Math.abs(tot - Math.max(ac, p.at)) > 0.05; }, { r: 8, v: 6, at: 3.5 }),
  build: ({ r, v, at }) => { const ac = v * v / r, tot = Math.hypot(ac, at); return {
   prompt: `As the catapult winds up, its sling arm swings a pod round a circle of radius ${n(r)} m and keeps speeding it up. At one moment the pod moves at ${n(v)} m/s and its speed is growing by ${n(at)} m/s every second (its tangential acceleration). Enter the size of the centripetal acceleration at that moment, then the size of the total acceleration, both in metres per second squared and to 2 decimal places.`,
   answer: [r2(ac), r2(tot)],
   hints: ['The centripetal part points at the centre and has size v² ÷ r, whether or not the speed is changing.', 'The tangential part points along the path, at a right angle to the centripetal part, so the total is √(centripetal² + tangential²).'],
   solution: `Centripetal: ${n(v)}² ÷ ${n(r)} = ${n(v * v)} ÷ ${n(r)} ${eq(ac)} ${n(ac)}, which is ${f2(ac)} m/s². The tangential part, ${n(at)} m/s², is at a right angle to it, so the total is √(${n(ac)}² + ${n(at)}²) ${eq(tot)} ${n(tot)}, which is ${f2(tot)} m/s².`,
   guidance: [
    { prompt: `What is the centripetal acceleration v² ÷ r, in m/s², to 2 decimal places?`, answer: [r2(ac)], explanation: `${n(v * v)} ÷ ${n(r)} ≈ ${f2(ac)} m/s², pointing at the centre.` },
    { prompt: `The tangential acceleration is ${n(at)} m/s² along the path, at a right angle to the centripetal one. What is the size of the total, √(a_c² + a_t²), in m/s² to 2 decimal places?`, answer: [r2(tot)], explanation: `√(${n(ac)}² + ${n(at)}²) ≈ ${f2(tot)} m/s².` }
   ] }; }
 },
 /* Wind over the ground = wind seen from the rover + rover over the ground, by components; its size to 2 decimal
    places (off a rounding tie). No ground component is 0, and the ground wind differs from the measured one in size.
    Not the worked example (rover (4, 0), measured (−1, 3)). */
 q16: {
  canonical: { rx: 6, ry: 2, sx: -2, sy: 5 },
  draw: R => retry(() => ({ rx: R.nz(-9, 9), ry: R.nz(-9, 9), sx: R.nz(-8, 8), sy: R.nz(-8, 8) }), p => { const wx = p.sx + p.rx, wy = p.sy + p.ry;
   return wx !== 0 && wy !== 0 && !nearTie(Math.hypot(wx, wy)) && !(p.sx === -1 && p.sy === 3); }, { rx: 6, ry: 2, sx: -2, sy: 5 }),
  build: ({ rx, ry, sx, sy }) => { const wx = sx + rx, wy = sy + ry, w = Math.hypot(wx, wy); return {
   prompt: `A survey rover crosses the Catapult Field with velocity (${n(rx)}, ${n(ry)}) m/s relative to the ground, where x points east and y points north. The wind vane on its mast measures the wind relative to the rover as (${n(sx)}, ${n(sy)}) m/s. The catapult crew needs the wind relative to the ground. Enter its x component and its y component in metres per second, then its speed over the ground in metres per second to 2 decimal places.`,
   answer: [wx, wy, r2(w)],
   hints: ['Velocities between frames add: (wind relative to ground) = (wind relative to rover) + (rover relative to ground).', 'Add the x components together and the y components together, then the speed is √(x² + y²).'],
   solution: `Wind relative to ground = (${n(sx)}, ${n(sy)}) + (${n(rx)}, ${n(ry)}) = (${n(sx)} ${pm(rx)}, ${n(sy)} ${pm(ry)}) = (${n(wx)}, ${n(wy)}) m/s. Its speed is √(${par(wx)}² + ${par(wy)}²) = √${n(wx * wx + wy * wy)} ${eq(w)} ${n(w)}, which is ${f2(w)} m/s.`,
   guidance: [
    { prompt: `Add the x components: the wind’s x relative to the rover, ${n(sx)}, plus the rover’s x relative to the ground, ${n(rx)}. What is the wind’s x component relative to the ground, in m/s?`, answer: [wx], explanation: `${n(sx)} ${pm(rx)} = ${n(wx)} m/s.` },
    { prompt: `Now the y components: ${n(sy)} plus ${n(ry)}. What is the wind’s y component relative to the ground, in m/s?`, answer: [wy], explanation: `${n(sy)} ${pm(ry)} = ${n(wy)} m/s.` },
    { prompt: `What is the wind’s speed over the ground, √(x² + y²) for (${n(wx)}, ${n(wy)}), in m/s to 2 decimal places?`, answer: [r2(w)], explanation: `√(${par(wx)}² + ${par(wy)}²) = √${n(wx * wx + wy * wy)} ≈ ${f2(w)} m/s.` }
   ] }; }
 },
 /* A sling speeding up on a circle (q15), then a launch on level ground (q13). Every asked and guided value is off a
    rounding tie. θ in radians from 0.3 to 1.2. Not the worked example (r = 4, v = 12, a_t = 5, θ = 0.5). */
 q17: {
  canonical: { r: 3, v: 15, at: 8, th: 0.7 },
  draw: R => retry(() => ({ r: R.int(2, 6), v: R.int(8, 25), at: R.int(2, 15), th: R.int(3, 12) / 10 }), p => { const ac = p.v * p.v / p.r, tot = Math.hypot(ac, p.at), T = 2 * p.v * Math.sin(p.th) / g, Rg = p.v * p.v * Math.sin(2 * p.th) / g;
   return p.th !== 1 && !(p.r === 4 && p.v === 12) && ![ac, tot, T, Rg].some(nearTie) && ac < 320; }, { r: 3, v: 15, at: 8, th: 0.7 }),
  build: ({ r, v, at, th }) => { const ac = v * v / r, tot = Math.hypot(ac, at), vy = v * Math.sin(th), T = 2 * vy / g, s2 = Math.sin(2 * th), Rg = v * v * s2 / g; return {
   prompt: `The full catapult test. The sling arm swings the pod round a circle of radius ${n(r)} m, speeding up. Just before release the pod moves at ${n(v)} m/s and its speed is growing by ${n(at)} m/s every second. It is then released at that speed from floor level, ${n(th)} radians above the horizontal, and lands on the same flat floor. Ignore the air and the release height, and take g = 9.8 m/s². Enter the size of the pod’s total acceleration just before release in m/s², then its flight time in seconds, then its range in metres, all to 2 decimal places.`,
   answer: [r2(tot), r2(T), r2(Rg)],
   hints: ['On the circle the acceleration has a centripetal part v² ÷ r and a tangential part at a right angle to it; combine them with Pythagoras.', 'After release it is a projectile: the flight time is 2v sin θ ÷ g and the range is v² sin(2θ) ÷ g, with θ in radians.'],
   solution: `On the circle: centripetal ${n(v * v)} ÷ ${n(r)} ${eq(ac)} ${n(ac)} m/s² and tangential ${n(at)} m/s², so the total is √(${n(ac)}² + ${n(at)}²) ${eq(tot)} ${n(tot)}, which is ${f2(tot)} m/s². In flight: the upward part of the speed is ${n(v)} × sin ${n(th)} ≈ ${n(vy)} m/s, so the flight time is 2 × ${n(vy)} ÷ 9.8 ${eq(T)} ${n(T)}, which is ${f2(T)} s, and the range is ${n(v * v)} × sin ${n(2 * th)} ÷ 9.8 ${eq(Rg)} ${n(Rg)}, which is ${f2(Rg)} m.`,
   guidance: [
    { prompt: `What is the centripetal acceleration v² ÷ r just before release, in m/s² to 2 decimal places?`, answer: [r2(ac)], explanation: `${n(v * v)} ÷ ${n(r)} ${eq(r2(ac)) === '=' && eq(ac) === '=' ? '=' : '≈'} ${f2(ac)} m/s².` },
    { prompt: `Combine it with the tangential ${n(at)} m/s², which is at a right angle to it. What is the size of the total acceleration, in m/s² to 2 decimal places?`, answer: [r2(tot)], explanation: `√(${n(ac)}² + ${n(at)}²) ≈ ${f2(tot)} m/s².` },
    { prompt: `After release, what is the flight time 2v sin θ ÷ g, in seconds to 2 decimal places?`, answer: [r2(T)], explanation: `2 × ${n(v)} × sin ${n(th)} ÷ 9.8 = 2 × ${n(vy)} ÷ 9.8 ≈ ${f2(T)} s.` },
    { prompt: `What is the range v² sin(2θ) ÷ g, in metres to 2 decimal places?`, answer: [r2(Rg)], explanation: `${n(v * v)} × ${n(s2)} ÷ 9.8 ≈ ${f2(Rg)} m.` }
   ] }; }
 },
 /* Two rope forces on a sled on smooth ice, seen from above; their sum is a Pythagorean pair (so its size is whole), and
    the mass makes the acceleration a short decimal. Not the worked example (forces (5, 1) and (−2, 3), 2 kg). */
 q18: {
  canonical: { f1x: 10, f1y: -3, f2x: -4, f2y: 11, m: 4 },
  draw: R => retry(() => { const [a, b] = R.pick(TRIPLES), Nx = R.bool() ? a : -a, Ny = R.bool() ? b : -b, f1x = R.nz(-20, 20), f1y = R.nz(-20, 20);
   return { f1x, f1y, f2x: Nx - f1x, f2y: Ny - f1y, m: R.pick([2, 4, 5, 8, 10, 20, 25]) }; },
   p => { const N = Math.hypot(p.f1x + p.f2x, p.f1y + p.f2y), a = N / p.m; return p.f2x !== 0 && p.f2y !== 0 && Math.abs(a * 100 - Math.round(a * 100)) < 1e-9 && a >= 0.2 && p.f1x !== p.f2x && !(p.m === 2 && p.f1x === 5); },
   { f1x: 10, f1y: -3, f2x: -4, f2y: 11, m: 4 }),
  build: ({ f1x, f1y, f2x, f2y, m }) => { const Nx = f1x + f2x, Ny = f1y + f2y, N = Math.hypot(Nx, Ny), a = N / m; return {
   prompt: `In the Crane Yard two winch ropes pull a ${n(m)} kg cargo sled across smooth ice, seen from above with x east and y north. Rope 1 pulls with force (${n(f1x)}, ${n(f1y)}) N and rope 2 with (${n(f2x)}, ${n(f2y)}) N. The ice pushes up on the sled exactly as hard as gravity pulls it down, and nothing else pushes along the ice. Enter the x component of the net force in newtons, then its y component in newtons, then the size of the sled’s acceleration in metres per second squared.`,
   answer: [Nx, Ny, a],
   hints: ['The net force ΣF is the vector sum of all the forces: add the x components together and the y components together.', 'Newton’s second law says ΣF = ma, so the size of the acceleration is the size of the net force divided by the mass.'],
   solution: `ΣF = (${n(f1x)} ${pm(f2x)}, ${n(f1y)} ${pm(f2y)}) = (${n(Nx)}, ${n(Ny)}) N. Its size is √(${par(Nx)}² + ${par(Ny)}²) = √${n(Nx * Nx + Ny * Ny)} = ${n(N)} N. By Newton’s second law the acceleration has size ${n(N)} ÷ ${n(m)} = ${n(a)} m/s², in the direction of the net force.`,
   guidance: [
    { prompt: `Add the x components of the two rope forces, ${n(f1x)} and ${n(f2x)}. What is the net force’s x component, in newtons?`, answer: [Nx], explanation: `${n(f1x)} ${pm(f2x)} = ${n(Nx)} N.` },
    { prompt: `Add the y components, ${n(f1y)} and ${n(f2y)}. What is the net force’s y component, in newtons?`, answer: [Ny], explanation: `${n(f1y)} ${pm(f2y)} = ${n(Ny)} N.` },
    { prompt: `What is the size of the net force (${n(Nx)}, ${n(Ny)}) N, √(x² + y²), in newtons?`, answer: [N], explanation: `√(${par(Nx)}² + ${par(Ny)}²) = √${n(Nx * Nx + Ny * Ny)} = ${n(N)} N.` },
    { prompt: `ΣF = ma. What is the size of the acceleration of the ${n(m)} kg sled, in m/s²?`, answer: [a], explanation: `${n(N)} ÷ ${n(m)} = ${n(a)} m/s².` }
   ] }; }
 },
 /* N = m(g + a), up positive. The four ways of moving (CAGE, an index into a list of texts) set the sign of a.
    m from 40 to 80 kg and a from 0.2 to 2.5 m/s², so N stays below 1000. Not the worked example (50 kg, rising and
    speeding up at 1.2 m/s²). */
 q19: {
  canonical: { m: 60, A: 1.5, k: 0 },
  draw: R => retry(() => ({ m: R.int(40, 80), A: R.int(2, 25) / 10, k: R.int(0, 3) }), p => !(p.m === 50 && p.A === 1.2 && p.k === 0), { m: 60, A: 1.5, k: 0 }),
  build: ({ m, A, k }) => { const [moving, change, s] = CAGE[k], a = s * A, W = m * g, F = m * a, N = W + F; return {
   prompt: `A ${n(m)} kg crate stands on the floor of a lift cage in the Crane Yard. The cage is ${moving} and ${change}: its acceleration has size ${n(A)} m/s². Take up as positive and g = 9.8 m/s². Enter the crate’s weight in newtons, then the normal force the floor pushes up on it with, in newtons.`,
   answer: [W, N],
   hints: ['Weight is the pull of gravity, w = mg, and it acts downwards whatever the cage does.', 'Speeding up means the acceleration points the way the cage moves; slowing down means it points the other way. With up positive, the free-body diagram has the normal force F_N up and the weight mg down, and F_N − mg must equal ma.'],
   solution: `Weight: w = ${n(m)} × 9.8 = ${n(W)} N, downwards. The cage is ${moving} and ${change}, so its acceleration points ${s > 0 ? 'up' : 'down'}: a = ${n(a)} m/s². Newton’s second law for the crate: F_N − ${n(W)} = ${n(m)} × ${par(a)} = ${n(F)}, so the normal force is F_N = ${n(W)} ${pm(F)} = ${n(N)} N.`,
   guidance: [
    { prompt: `What is the crate’s weight mg, in newtons?`, answer: [W], explanation: `${n(m)} × 9.8 = ${n(W)} N. It is the same whether the cage moves or not.` },
    { prompt: `The cage is ${moving} and ${change}. With up positive, what is the crate’s acceleration a, in m/s² (negative if it points down)?`, answer: [a], explanation: `${change === 'speeding up' ? 'Speeding up' : 'Slowing down'} while ${moving} means the acceleration points ${s > 0 ? 'up' : 'down'}, so a = ${n(a)} m/s².` },
    { prompt: `The net force on the crate is ma. What is it, in newtons (negative if it points down)?`, answer: [F], explanation: `${n(m)} × ${par(a)} = ${n(F)} N.` },
    { prompt: `The forces on the crate are the normal force F_N up and its weight down, so F_N − ${n(W)} = ${n(F)}. What is F_N, in newtons?`, answer: [N], explanation: `F_N = ${n(W)} ${pm(F)} = ${n(N)} N.` }
   ] }; }
 },
 /* Two crates hang one below the other; the crane cable pulls up on the top one. a = F ÷ (m1 + m2) − g and the lower
    cable's tension T = m2(g + a) = m2F ÷ (m1 + m2), both to 2 decimal places, off rounding ties, with a from 0.2 to
    3 m/s² and F below 1000 N. Not the worked example (20 kg and 10 kg, 330 N). */
 q20: {
  canonical: { m1: 40, m2: 25, F: 700 },
  draw: R => retry(() => { const m1 = R.int(10, 45), m2 = R.int(10, 30), M = m1 + m2; return { m1, m2, F: R.int(Math.ceil(M * 10), Math.floor(M * 12.8)) }; },
   p => { const M = p.m1 + p.m2, a = p.F / M - g, T = p.m2 * p.F / M; return p.F < 1000 && a >= 0.2 && p.m1 !== p.m2 && !nearTie(a) && !nearTie(T) && !(p.m1 === 20 && p.m2 === 10); },
   { m1: 40, m2: 25, F: 700 }),
  build: ({ m1, m2, F }) => { const M = m1 + m2, W = M * g, a = F / M - g, T = m2 * (g + a), w2 = m2 * g; return {
   prompt: `The gantry crane lifts two crates at once. Its cable pulls straight up with ${n(F)} N on the top crate, of mass ${n(m1)} kg. A second, lower cable hangs from the top crate and holds the bottom crate, of mass ${n(m2)} kg. Ignore the mass of the cables and take g = 9.8 m/s². Enter the crates’ upward acceleration in metres per second squared, then the tension in the lower cable in newtons, both to 2 decimal places.`,
   answer: [r2(a), r2(T)],
   hints: ['Treat both crates and the lower cable as one system. The lower cable’s pulls on the two crates are equal and opposite (Newton’s third law), so they cancel inside the system: only the crane’s pull and the total weight act on it.', 'Then look at the bottom crate alone: the lower cable pulls it up with the tension T and gravity pulls it down, and T − m₂g = m₂a.'],
   solution: `Whole system: mass ${n(m1)} + ${n(m2)} = ${n(M)} kg and weight ${n(M)} × 9.8 = ${n(W)} N. Net force ${n(F)} − ${n(W)} = ${n(F - W)} N, so a = ${n(F - W)} ÷ ${n(M)} ${eq(a)} ${n(a)}, which is ${f2(a)} m/s². Bottom crate alone: T − ${n(w2)} = ${n(m2)}a, so T = ${n(m2)} × (9.8 + a) ${eq(T)} ${n(T)}, which is ${f2(T)} N. By Newton’s third law the lower cable pulls down on the top crate with the same ${f2(T)} N.`,
   guidance: [
    { prompt: `Take both crates as one system of mass ${n(M)} kg. What is its total weight, in newtons?`, answer: [W], explanation: `${n(M)} × 9.8 = ${n(W)} N.` },
    { prompt: `The net force on the system is ${n(F)} − ${n(W)} N. What is the acceleration, net force ÷ total mass, in m/s² to 2 decimal places?`, answer: [r2(a)], explanation: `${n(F - W)} ÷ ${n(M)} ≈ ${f2(a)} m/s², upwards.` },
    { prompt: `Now the ${n(m2)} kg bottom crate alone: T − ${n(w2)} = ${n(m2)} × a. What is the tension T, in newtons to 2 decimal places? Use the unrounded acceleration.`, answer: [r2(T)], explanation: `T = ${n(m2)} × (9.8 + a) ${eq(T)} ${f2(T)} N, with a ${eq(a)} ${n(a)} m/s². (The same as ${n(m2)} × ${n(F)} ÷ ${n(M)}: the bottom crate gets its share of the crane’s pull.)` }
   ] }; }
 }
});
})();
