/* Mechanics: motion and force practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/mech/oracle-p2.js. */
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
 const b = gen.build(gen.canonical), { gl, ...m } = meta, rd = x => Math.round(x * 1e6) / 1e6;
 add({ ...m, prompt: b.prompt, answer: b.answer.map(rd), hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer.map(rd), labels: gl[i], explanation: g.explanation })) }, gen);
};
/* A coefficient of 1 is not written out: coef(1) is '' and coef(−3) is '3'. */
const coef = v => Math.abs(v) === 1 ? '' : n(Math.abs(v));
const SUP = { 2: '²', 3: '³', 4: '⁴' };
/* A polynomial from its coefficients, lowest power first: polyAsc([10, 4, 3, −1], 't') is '10 + 4t + 3t² − t³'. Zero terms are left out. */
const polyAsc = (cs, v) => { let out = '';
 cs.forEach((c, i) => { if (c === 0) return; const a = Math.abs(c), body = i === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (i > 1 ? SUP[i] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* True when x has at most 2 decimal places, so no rounding is ever needed. */
const clean2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
/* Every retry loop is bounded: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
const sg = v => v < 0 ? '−' : '+';
const r1 = x => Math.round(x * 10) / 10;

/* ---- q06 Position, displacement, distance and average velocity [3.1] ---- */

/* Lift cage: start x0, turn at x1, stop at x2 after T seconds (T even, average velocity a multiple of 0.5 m/s).
   The turn lies beyond the end in the direction of travel, or behind the start. Not the learn worked numbers. */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The mine-shaft lift',
 brief: 'The old mine lift hauls ore crates up and down its shaft, and the log needs three numbers for one run of the cage.',
 labels: ['displacement (m)', 'distance (m)', 'average velocity (m/s)'], tolerance: 0.01,
 gl: [['displacement (m)'], ['distance (m)'], ['average velocity (m/s)']]
}, {
 canonical: { x0: -15, x1: 25, x2: -5, T: 20 },
 draw: R => { const T = 2 * R.int(3, 10), v = R.except(-8, 8, [0]) / 2, x0 = R.int(-30, 30), x2 = x0 + v * T, s = Math.sign(v);
  return { x0, x1: R.bool() ? x2 + s * R.int(5, 30) : x0 - s * R.int(5, 30), x2, T }; },
 build: ({ x0, x1, x2, T }) => { const D = x2 - x0, l1 = Math.abs(x1 - x0), l2 = Math.abs(x2 - x1), d = l1 + l2, v = D / T; return {
  prompt: `The old mine lift runs in a vertical shaft. Heights are measured in metres from the loading bay, with up as the positive direction, so a height below the bay is negative. The cage starts at h = ${n(x0)} m at t = 0 s. It travels to h = ${n(x1)} m, where it reverses, and then to h = ${n(x2)} m, where it stops at t = ${n(T)} s; on each of the two legs it keeps moving one way. Enter the cage's displacement over the whole run in metres, then the distance it travelled in metres, then its average velocity over the whole run in metres per second (a negative value means downwards).`,
  answer: [D, d, v],
  hints: ['The displacement is the final height minus the starting height. The reversal in the middle does not change it.', 'The turning height splits the run into two legs. The distance adds their lengths, each counted as positive. The average velocity is the displacement, not the distance, divided by the time.'],
  solution: `Displacement: ${n(x2)} − ${par(x0)} = ${n(D)} m. The first leg runs from ${n(x0)} m to ${n(x1)} m, a length of ${n(l1)} m, and the second from ${n(x1)} m to ${n(x2)} m, a length of ${n(l2)} m, so the distance is ${n(l1)} + ${n(l2)} = ${n(d)} m. The average velocity is ${n(D)} m ÷ ${n(T)} s = ${n(v)} m/s.`,
  guidance: [
   { prompt: `What is the displacement, the final height ${n(x2)} m minus the starting height ${n(x0)} m?`, answer: [D], explanation: `Δh = ${n(x2)} − ${par(x0)} = ${n(D)} m. Only the two ends count.` },
   { prompt: `The cage goes from ${n(x0)} m to ${n(x1)} m, then from ${n(x1)} m to ${n(x2)} m. Adding the length of each leg as a positive number, what is the total distance?`, answer: [d], explanation: `The legs are ${n(l1)} m and ${n(l2)} m long, so the distance is ${n(d)} m.` },
   { prompt: `What is the average velocity, the displacement divided by the ${n(T)} s of the run, in metres per second?`, answer: [v], explanation: `${n(D)} ÷ ${n(T)} = ${n(v)} m/s. The distance is not used: it would give the average speed.` }
  ] }; }
});

/* The log gives the average velocity v over T s; the final position is x0 + vT, the displacement vT. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The ridge road rover',
 brief: 'A survey rover drove out to the relay beacon and back, and the log kept only its average velocity, so the crew must rebuild where it stopped and how far it drove.',
 labels: ['displacement (m)', 'stopping position (m)', 'distance driven (m)'], tolerance: 0.01,
 gl: [['displacement (m)'], ['stopping position (m)'], ['distance driven (m)']]
}, {
 canonical: { x0: -6, x1: 34, T: 16, v: -1.5 },
 draw: R => retry(() => { const x0 = R.int(-30, 30); return { x0, x1: x0 + R.nz(-40, 40), T: 2 * R.int(3, 12), v: R.except(-12, 12, [0]) / 2 }; },
  ({ x0, x1, T, v }) => { const x2 = x0 + v * T; return Math.abs(x1 - x0) >= 8 && Math.abs(x2 - x1) >= 4 && (x1 - x0) * (x2 - x1) < 0; }, { x0: -6, x1: 34, T: 16, v: -1.5 }),
 build: ({ x0, x1, T, v }) => { const D = v * T, x2 = x0 + D, l1 = Math.abs(x1 - x0), l2 = Math.abs(x2 - x1), d = l1 + l2; return {
  prompt: `A survey rover drives along the ridge road. Positions are measured in metres east of the Proving Ground gate, so a position west of the gate is negative. The rover starts at x = ${n(x0)} m, drives to the relay beacon at x = ${n(x1)} m, turns round there and drives back, stopping ${n(T)} s after it set out; on each of the two legs it keeps moving one way. Its log shows an average velocity of ${n(v)} m/s over the whole trip (a negative value means westwards). Enter the rover's displacement over the trip in metres, then the position where it stopped in metres, then the distance it drove in metres.`,
  answer: [D, x2, d],
  hints: ['Average velocity is displacement ÷ time, so the displacement is the average velocity times the time. Keep the sign.', 'The stopping position is the starting position plus the displacement. For the distance, add the lengths of the two legs: start to beacon, then beacon to the stopping position.'],
  solution: `The displacement is the average velocity times the time: ${par(v)} × ${n(T)} = ${n(D)} m. The rover stopped at ${n(x0)} + ${par(D)} = ${n(x2)} m. The first leg runs from ${n(x0)} m to ${n(x1)} m, a length of ${n(l1)} m, and the second from ${n(x1)} m to ${n(x2)} m, a length of ${n(l2)} m, so the distance is ${n(l1)} + ${n(l2)} = ${n(d)} m.`,
  guidance: [
   { prompt: `The average velocity ${n(v)} m/s is the displacement divided by ${n(T)} s. What is the displacement, in metres?`, answer: [D], explanation: `Δx = ${par(v)} × ${n(T)} = ${n(D)} m.` },
   { prompt: `The rover started at ${n(x0)} m and its displacement was ${n(D)} m. Where did it stop, in metres?`, answer: [x2], explanation: `Final position = start + displacement = ${n(x0)} + ${par(D)} = ${n(x2)} m.` },
   { prompt: `The legs run from ${n(x0)} m to ${n(x1)} m and from ${n(x1)} m to ${n(x2)} m. What is the total distance driven, in metres?`, answer: [d], explanation: `The legs are ${n(l1)} m and ${n(l2)} m, each counted as positive, so the distance is ${n(d)} m.` }
  ] }; }
});

/* Rover on a plane: displacement parts (a·m, b·m) from a Pythagorean triple with random signs, time T chosen so that
   the speed has at most 2 decimal places. */
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10]];
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q04', title: 'The crater floor crossing',
 brief: 'A survey rover crosses the crater floor on a slanting course, and the navigator needs its displacement and its average speed along the line.',
 labels: ['east part of displacement (m)', 'north part of displacement (m)', 'size of average velocity (m/s)'], tolerance: 0.005,
 gl: [['east part of displacement (m)'], ['north part of displacement (m)'], ['size of average velocity (m/s)']]
}, {
 canonical: { x0: -4, y0: 7, x1: 8, y1: -2, T: 6 },
 draw: R => retry(() => { const t = R.pick(TRI), m = R.int(1, 3), sw = R.bool(), dx = (sw ? t[1] : t[0]) * m * R.pick([-1, 1]), dy = (sw ? t[0] : t[1]) * m * R.pick([-1, 1]), x0 = R.int(-20, 20), y0 = R.int(-20, 20);
   return { x0, y0, x1: x0 + dx, y1: y0 + dy, T: R.pick([2, 3, 4, 5, 6, 8, 10]) }; },
  ({ x0, y0, x1, y1, T }) => clean2(Math.hypot(x1 - x0, y1 - y0) / T), { x0: -4, y0: 7, x1: 8, y1: -2, T: 6 }),
 build: ({ x0, y0, x1, y1, T }) => { const dx = x1 - x0, dy = y1 - y0, size = Math.hypot(dx, dy), v = size / T; return {
  prompt: `A survey rover crosses the crater floor. Its position is given as (east, north) in metres from the Proving Ground gate. At t = 0 s it is at (${n(x0)}, ${n(y0)}), and at t = ${n(T)} s it is at (${n(x1)}, ${n(y1)}). The displacement is the final position minus the starting position, found separately for the east part and the north part. The average velocity is the displacement divided by the time taken, part by part, and the size of a vector with parts p and q is √(p² + q²). Enter the east part of the rover's displacement, then the north part, both in metres, then the size of its average velocity in metres per second.`,
  answer: [dx, dy, v],
  hints: ['Subtract part by part: the east part is the final east position minus the starting east position, and the north part is found the same way. Keep the signs.', 'The average velocity has parts (east part ÷ time) and (north part ÷ time). Its size is √(p² + q²) of those two parts, which equals the size of the displacement divided by the time.'],
  solution: `East part: ${n(x1)} − ${par(x0)} = ${n(dx)} m. North part: ${n(y1)} − ${par(y0)} = ${n(dy)} m. The average velocity has parts ${n(dx)} ÷ ${n(T)} and ${n(dy)} ÷ ${n(T)}, so its size is √(${par(dx)}² + ${par(dy)}²) ÷ ${n(T)} = √${n(dx * dx + dy * dy)} ÷ ${n(T)} = ${n(size)} ÷ ${n(T)} = ${n(v)} m/s.`,
  guidance: [
   { prompt: `What is the east part of the displacement, the final east position ${n(x1)} m minus the starting east position ${n(x0)} m?`, answer: [dx], explanation: `${n(x1)} − ${par(x0)} = ${n(dx)} m.` },
   { prompt: `What is the north part of the displacement, the final north position ${n(y1)} m minus the starting north position ${n(y0)} m?`, answer: [dy], explanation: `${n(y1)} − ${par(y0)} = ${n(dy)} m.` },
   { prompt: `The size of the average velocity is √(${par(dx)}² + ${par(dy)}²) ÷ ${n(T)}. What is it, in metres per second?`, answer: [v], explanation: `√${n(dx * dx + dy * dy)} = ${n(size)}, and ${n(size)} ÷ ${n(T)} = ${n(v)} m/s.` }
  ] }; }
});

/* ---- q07 Instantaneous velocity as the derivative of position [3.2] ---- */

/* x(t) = d + bt² − at³, v(t) = 2bt − 3at²: positive at t1 and negative at t2, at most 60 m/s in size. No linear term, unlike the learn mission. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The rim-rail trolley',
 brief: 'A trolley runs along the rail on the crater rim, and the rail crew wants its exact velocity at two moments of a run.',
 labels: ['velocity at the first time (m/s)', 'velocity at the second time (m/s)', 'speed at the second time (m/s)'], tolerance: 0.01,
 gl: [['velocity at the first time (m/s)'], ['velocity at the second time (m/s)'], ['speed at the second time (m/s)']]
}, {
 canonical: { a: 2, b: 7, d: 6, t1: 1, t2: 3 },
 draw: R => retry(() => { const t1 = R.int(1, 3); return { a: R.int(1, 3), b: R.int(2, 9), d: R.int(2, 25), t1, t2: t1 + R.int(1, 3) }; },
  ({ a, b, t1, t2 }) => { const v = t => 2 * b * t - 3 * a * t * t; return v(t1) > 0 && v(t2) < 0 && v(t2) >= -60; }, { a: 2, b: 7, d: 6, t1: 1, t2: 3 }),
 build: ({ a, b, d, t1, t2 }) => { const v = t => 2 * b * t - 3 * a * t * t, v1 = v(t1), v2 = v(t2), B = 2 * b, A = 3 * a, x = `${n(d)} + ${coef(b)}t² − ${coef(a)}t³`, vx = `${n(B)}t − ${n(A)}t²`; return {
  prompt: `A trolley runs along the rail on the crater rim. Its position, measured from the middle of the rail with the direction towards the sled run as positive, is x(t) = ${x} metres, t seconds after it starts. Enter its velocity at t = ${n(t1)} s, then its velocity at t = ${n(t2)} s, both in metres per second, then its speed at t = ${n(t2)} s in metres per second.`,
  answer: [v1, v2, -v2],
  hints: ['The velocity is the derivative of the position. Differentiate term by term with the power rule: a constant has derivative 0.', 'Put each time into the velocity formula, not into the position formula. Speed is the size of the velocity, with its sign dropped.'],
  solution: `v(t) = dx/dt = ${vx}. At t = ${n(t1)}: v = ${n(B)} × ${n(t1)} − ${n(A)} × ${n(t1 * t1)} = ${n(v1)} m/s, so the trolley is moving towards the sled run. At t = ${n(t2)}: v = ${n(B)} × ${n(t2)} − ${n(A)} × ${n(t2 * t2)} = ${n(v2)} m/s, so it is moving away from the sled run, and its speed is ${n(-v2)} m/s.`,
  guidance: [
   { prompt: `Differentiating gives v(t) = ${vx}. What is v(${n(t1)}), in metres per second?`, answer: [v1], explanation: `${n(B)} × ${n(t1)} − ${n(A)} × ${n(t1 * t1)} = ${n(v1)} m/s. It is positive, so the trolley is moving in the positive direction.` },
   { prompt: `What is v(${n(t2)}), in metres per second?`, answer: [v2], explanation: `${n(B)} × ${n(t2)} − ${n(A)} × ${n(t2 * t2)} = ${n(v2)} m/s. It is negative, so the trolley is moving the other way.` },
   { prompt: `What is the speed at t = ${n(t2)} s, in metres per second?`, answer: [-v2], explanation: `Speed is the size of the velocity ${n(v2)} m/s, so it is ${n(-v2)} m/s.` }
  ] }; }
});

/* x(t) = d + 2b·ts·t − bt²: v(t) = 2b·ts − 2bt is 0 at t = ts, the top of the parabola, where x = d + b·ts². Then T > ts. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The test ramp turn',
 brief: 'A sled is pushed up the test ramp and slides back, and the crew must know when it turns, how high it gets and how fast it slips back.',
 labels: ['time at rest (s)', 'position at rest (m)', 'velocity at the later time (m/s)'], tolerance: 0.01,
 gl: [['time at rest (s)'], ['position at rest (m)'], ['velocity at the later time (m/s)']]
}, {
 canonical: { d: 8, b: 2, c: 12, T: 5 },
 /* The printed linear coefficient c is 2 b ts for a whole rest time ts, and T is 1 to 4 s after ts. */
 draw: R => { const ts = R.int(2, 6), b = R.int(1, 4); return { d: R.int(5, 40), b, c: 2 * b * ts, T: ts + R.int(1, 4) }; },
 build: ({ d, b, c, T }) => { const ts = c / (2 * b), xs = d + b * ts * ts, vT = c - 2 * b * T, x = `${n(d)} + ${n(c)}t − ${coef(b)}t²`, vx = `${n(c)} − ${n(2 * b)}t`; return {
  prompt: `A sled is pushed up the test ramp and then slides back down. Its position along the ramp is x(t) = ${x} metres, t seconds after the push, with up the ramp as positive. The sled is momentarily at rest when its velocity is 0. Enter the time at which it is momentarily at rest, in seconds, then its position at that moment in metres, then its velocity at t = ${n(T)} s in metres per second (a negative value means sliding down the ramp).`,
  answer: [ts, xs, vT],
  hints: ['Differentiate x(t) to get v(t), set v(t) = 0 and solve for t. That time is when the sled is momentarily at rest.', 'Put that time into x(t) to get the position. Put the later time into v(t), not x(t), to get the velocity.'],
  solution: `v(t) = dx/dt = ${vx}. Setting v = 0 gives ${n(2 * b)}t = ${n(c)}, so t = ${n(ts)} s. The position then is x(${n(ts)}) = ${n(d)} + ${n(c * ts)} − ${n(b * ts * ts)} = ${n(xs)} m. At t = ${n(T)}: v = ${n(c)} − ${n(2 * b)} × ${n(T)} = ${n(vT)} m/s, so the sled is sliding down the ramp.`,
  guidance: [
   { prompt: `Differentiating gives v(t) = ${vx}. Solve v(t) = 0: at what time is the sled momentarily at rest, in seconds?`, answer: [ts], explanation: `${n(2 * b)}t = ${n(c)}, so t = ${n(c)} ÷ ${n(2 * b)} = ${n(ts)} s.` },
   { prompt: `What is the position x(${n(ts)}) of the sled at that moment, in metres?`, answer: [xs], explanation: `x(${n(ts)}) = ${n(d)} + ${n(c * ts)} − ${n(b * ts * ts)} = ${n(xs)} m.` },
   { prompt: `What is the velocity at t = ${n(T)} s, from v(t) = ${vx}, in metres per second?`, answer: [vT], explanation: `${n(c)} − ${n(2 * b)} × ${n(T)} = ${n(vT)} m/s. It is negative, so the sled is sliding back down.` }
  ] }; }
});

/* x(t) = d + ct + bt² with b not 0: average velocity over [t1, t2] is c + b(t1 + t2), v(t2) = c + 2b·t2, and
   v(t) equals the average at the midpoint (t1 + t2) ÷ 2. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q06', title: 'Where the speeds match',
 brief: 'A test sled does not move steadily, so the crew wants to know the moment when its true velocity equals its average over a stretch.',
 labels: ['average velocity (m/s)', 'velocity at the end time (m/s)', 'time of equal velocity (s)'], tolerance: 0.01,
 gl: [['average velocity (m/s)'], ['velocity at the end time (m/s)'], ['time of equal velocity (s)']]
}, {
 canonical: { d: 6, c: -3, b: 2, t1: 1, t2: 5 },
 draw: R => { const t1 = R.int(0, 3); return { d: R.int(-20, 30), c: R.nz(-10, 10), b: R.nz(-4, 4), t1, t2: t1 + R.int(2, 6) }; },
 build: ({ d, c, b, t1, t2 }) => { const x = t => d + c * t + b * t * t, x1 = x(t1), x2 = x(t2), avg = (x2 - x1) / (t2 - t1), v2 = c + 2 * b * t2, tm = (t1 + t2) / 2, vx = polyAsc([c, 2 * b], 't'); return {
  prompt: `A test sled does not move steadily. Its position on the run is x(t) = ${polyAsc([d, c, b], 't')} metres, t seconds after release, with uphill as positive. The average velocity over a stretch of time is the change in position divided by the time taken. Enter the sled's average velocity from t = ${n(t1)} s to t = ${n(t2)} s, then its instantaneous velocity at t = ${n(t2)} s, both in metres per second, then the time between ${n(t1)} s and ${n(t2)} s at which its instantaneous velocity equals that average velocity, in seconds.`,
  answer: [avg, v2, tm],
  hints: ['The average velocity from the first time to the second is x at the second time minus x at the first time, divided by the difference of the times. Work out both positions first.', 'The instantaneous velocity is the derivative v(t) = dx/dt. To find the time when it equals the average, set v(t) equal to the average velocity and solve for t.'],
  solution: `x(${n(t1)}) = ${n(x1)} m and x(${n(t2)}) = ${n(x2)} m, so the average velocity is (${n(x2)} − ${par(x1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(x2 - x1)} ÷ ${n(t2 - t1)} = ${n(avg)} m/s. The derivative is v(t) = ${vx}, so v(${n(t2)}) = ${n(c)} ${sg(2 * b)} ${n(Math.abs(2 * b))} × ${n(t2)} = ${n(v2)} m/s. Setting ${vx} = ${n(avg)} gives ${n(2 * b)}t = ${n(avg - c)}, so t = ${n(tm)} s.`,
  guidance: [
   { prompt: `What is the average velocity from t = ${n(t1)} s to t = ${n(t2)} s, the change in position divided by the change in time, in metres per second?`, answer: [avg], explanation: `x(${n(t1)}) = ${n(x1)} and x(${n(t2)}) = ${n(x2)}, so (${n(x2)} − ${par(x1)}) ÷ ${n(t2 - t1)} = ${n(avg)} m/s.` },
   { prompt: `Differentiating gives v(t) = ${vx}. What is v(${n(t2)}), in metres per second?`, answer: [v2], explanation: `${n(c)} ${sg(2 * b)} ${n(Math.abs(2 * b))} × ${n(t2)} = ${n(v2)} m/s.` },
   { prompt: `Solve ${vx} = ${n(avg)} for t. At what time does the instantaneous velocity equal the average, in seconds?`, answer: [tm], explanation: `${n(2 * b)}t = ${n(avg)} − ${par(c)} = ${n(avg - c)}, so t = ${n(tm)} s. It lies between ${n(t1)} s and ${n(t2)} s.` }
  ] }; }
});

/* ---- q08 Average and instantaneous acceleration [3.3] ---- */

/* v(t) = c + bt − at³: average acceleration over [t1, t2] is b − a(t1² + t1t2 + t2²), a(t) = b − 3at². */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The loading conveyor',
 brief: 'The conveyor that carries pods up to the catapult deck speeds up and eases off, and the crew wants its acceleration over a stretch and at two moments.',
 labels: ['average acceleration (m/s²)', 'acceleration at the first time (m/s²)', 'acceleration at the second time (m/s²)'], tolerance: 0.01,
 gl: [['average acceleration (m/s²)'], ['acceleration at the first time (m/s²)'], ['acceleration at the second time (m/s²)']]
}, {
 canonical: { a: 1, b: 9, c: 3, t1: 1, t2: 3 },
 draw: R => { const t1 = R.int(0, 3); return { a: R.int(1, 3), b: R.int(3, 15), c: R.int(2, 20), t1, t2: t1 + R.int(2, 3) }; },
 build: ({ a, b, c, t1, t2 }) => { const v = t => c + b * t - a * t * t * t, v1 = v(t1), v2 = v(t2), avg = (v2 - v1) / (t2 - t1), ac = t => b - 3 * a * t * t, a1 = ac(t1), a2 = ac(t2), vx = `${n(c)} + ${coef(b)}t − ${coef(a)}t³`, ax = `${n(b)} − ${n(3 * a)}t²`; return {
  prompt: `The conveyor that carries pods up to the catapult deck has a belt velocity of v(t) = ${vx} metres per second, t seconds after it is switched on, with up the belt as positive. Enter its average acceleration from t = ${n(t1)} s to t = ${n(t2)} s, then its instantaneous acceleration at t = ${n(t1)} s, then its instantaneous acceleration at t = ${n(t2)} s, all in metres per second squared (m/s²).`,
  answer: [avg, a1, a2],
  hints: ['The average acceleration is the change in velocity divided by the change in time. Find the velocity at each of the two times first.', 'The instantaneous acceleration is the derivative of the velocity, a(t) = dv/dt. Differentiate term by term, then put each time into a(t).'],
  solution: `v(${n(t1)}) = ${n(v1)} m/s and v(${n(t2)}) = ${n(v2)} m/s, so the average acceleration is (${n(v2)} − ${par(v1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(v2 - v1)} ÷ ${n(t2 - t1)} = ${n(avg)} m/s². The derivative is a(t) = ${ax}. At t = ${n(t1)}: ${n(b)} − ${n(3 * a)} × ${n(t1 * t1)} = ${n(a1)} m/s². At t = ${n(t2)}: ${n(b)} − ${n(3 * a)} × ${n(t2 * t2)} = ${n(a2)} m/s².`,
  guidance: [
   { prompt: `What is the average acceleration, (v(${n(t2)}) − v(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}), in m/s²?`, answer: [avg], explanation: `v(${n(t1)}) = ${n(v1)} and v(${n(t2)}) = ${n(v2)}, so ${n(v2 - v1)} m/s of change in ${n(t2 - t1)} s gives ${n(avg)} m/s².` },
   { prompt: `Differentiating gives a(t) = ${ax}. What is a(${n(t1)}), in m/s²?`, answer: [a1], explanation: `${n(b)} − ${n(3 * a)} × ${n(t1 * t1)} = ${n(a1)} m/s².` },
   { prompt: `What is a(${n(t2)}), in m/s²?`, answer: [a2], explanation: `${n(b)} − ${n(3 * a)} × ${n(t2 * t2)} = ${n(a2)} m/s². It differs from the average because the acceleration changes during the interval.` }
  ] }; }
});

/* v(t) = r + 2b·ts·t − bt²: a(t) = 2b·ts − 2bt is 0 at t = ts, where v = r + b·ts² is greatest. Average acceleration over [0, T]
   is b(2ts − T), never 0 (T is not 2ts). */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The booster cut-off',
 brief: 'A booster sled is cut out when its push fades to nothing, and the crew wants its average push, the cut-out time and its top velocity.',
 labels: ['average acceleration (m/s²)', 'time acceleration is zero (s)', 'velocity then (m/s)'], tolerance: 0.01,
 gl: [['average acceleration (m/s²)'], ['time acceleration is zero (s)'], ['velocity then (m/s)']]
}, {
 canonical: { b: 1, c: 8, r: 4, T: 6 },
 /* The printed linear coefficient c is 2 b ts for a whole time ts at which the acceleration is zero; T is never 2 ts. */
 draw: R => retry(() => { const b = R.int(1, 3); return { b, c: 2 * b * R.int(2, 6), r: R.int(2, 15), T: R.int(2, 9) }; }, ({ b, c, T }) => T !== c / b, { b: 1, c: 8, r: 4, T: 6 }),
 build: ({ b, c, r, T }) => { const ts = c / (2 * b), vT = r + c * T - b * T * T, avg = (vT - r) / T, vmax = r + b * ts * ts, vx = `${n(r)} + ${n(c)}t − ${coef(b)}t²`, ax = `${n(c)} − ${n(2 * b)}t`; return {
  prompt: `A booster pushes a test sled along the flat run. The sled's velocity is v(t) = ${vx} metres per second, t seconds after ignition, with its direction of travel as positive. The booster is cut out when the sled's acceleration falls to 0. Enter its average acceleration from t = 0 s to t = ${n(T)} s, then the time at which its acceleration is 0, in seconds, then its velocity at that time in metres per second.`,
  answer: [avg, ts, vmax],
  hints: ['The average acceleration is the change in velocity divided by the change in time: find v at both ends of the interval.', 'The acceleration is the derivative of the velocity. Differentiate, set a(t) = 0 and solve for t, then put that time into v(t), not into a(t).'],
  solution: `v(0) = ${n(r)} m/s and v(${n(T)}) = ${n(vT)} m/s, so the average acceleration is (${n(vT)} − ${n(r)}) ÷ ${n(T)} = ${n(avg)} m/s². The derivative is a(t) = ${ax}. Setting it to 0 gives ${n(2 * b)}t = ${n(c)}, so t = ${n(ts)} s. The velocity then is v(${n(ts)}) = ${n(r)} + ${n(c * ts)} − ${n(b * ts * ts)} = ${n(vmax)} m/s.`,
  guidance: [
   { prompt: `What is the average acceleration, (v(${n(T)}) − v(0)) ÷ ${n(T)}, in m/s²?`, answer: [avg], explanation: `v(0) = ${n(r)} and v(${n(T)}) = ${n(vT)}, so ${n(vT - r)} ÷ ${n(T)} = ${n(avg)} m/s².` },
   { prompt: `Differentiating gives a(t) = ${ax}. Solve a(t) = 0: at what time does the acceleration fall to 0, in seconds?`, answer: [ts], explanation: `${n(2 * b)}t = ${n(c)}, so t = ${n(c)} ÷ ${n(2 * b)} = ${n(ts)} s.` },
   { prompt: `What is the velocity v(${n(ts)}) at that time, in metres per second?`, answer: [vmax], explanation: `${n(r)} + ${n(c * ts)} − ${n(b * ts * ts)} = ${n(vmax)} m/s.` }
  ] }; }
});

/* x(t) = d + ct + bt² + at³ (a, b, c not 0): v = c + 2bt + 3at², a(t) = 2b + 6at; average acceleration over [t1, t2] is 2b + 3a(t1 + t2). */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q07', title: 'Acceleration from position',
 brief: 'The sled run has a position log but no velocity log, so the crew must work its velocity and acceleration out from the position formula.',
 labels: ['velocity at the first time (m/s)', 'average acceleration (m/s²)', 'acceleration at the second time (m/s²)'], tolerance: 0.01,
 gl: [['velocity at the first time (m/s)'], ['average acceleration (m/s²)'], ['acceleration at the second time (m/s²)']]
}, {
 canonical: { d: 4, c: -5, b: 3, a: -1, t1: 1, t2: 3 },
 draw: R => { const t1 = R.int(0, 3); return { d: R.int(-10, 20), c: R.nz(-8, 8), b: R.nz(-5, 5), a: R.nz(-3, 3), t1, t2: t1 + R.int(2, 4) }; },
 build: ({ d, c, b, a, t1, t2 }) => { const v = t => c + 2 * b * t + 3 * a * t * t, v1 = v(t1), v2 = v(t2), avg = (v2 - v1) / (t2 - t1), a2 = 2 * b + 6 * a * t2, vx = polyAsc([c, 2 * b, 3 * a], 't'), ax = polyAsc([2 * b, 6 * a], 't'); return {
  prompt: `A sled's position along the run is x(t) = ${polyAsc([d, c, b, a], 't')} metres, t seconds after release, with uphill as positive. Its velocity is the derivative of its position, v = dx/dt, and its acceleration is the derivative of its velocity, a = dv/dt. Enter its velocity at t = ${n(t1)} s in metres per second, then its average acceleration from t = ${n(t1)} s to t = ${n(t2)} s, then its instantaneous acceleration at t = ${n(t2)} s, both accelerations in metres per second squared (m/s²).`,
  answer: [v1, avg, a2],
  hints: ['Differentiate the position once to get the velocity, then differentiate the velocity to get the acceleration. Use the power rule term by term.', 'The average acceleration is the change in velocity divided by the change in time, so it needs v at both times. The instantaneous acceleration needs only a(t).'],
  solution: `v(t) = dx/dt = ${vx}, so v(${n(t1)}) = ${n(v1)} m/s and v(${n(t2)}) = ${n(v2)} m/s. The average acceleration is (${n(v2)} − ${par(v1)}) ÷ (${n(t2)} − ${n(t1)}) = ${n(v2 - v1)} ÷ ${n(t2 - t1)} = ${n(avg)} m/s². Differentiating again, a(t) = ${ax}, so a(${n(t2)}) = ${n(a2)} m/s².`,
  guidance: [
   { prompt: `Differentiating the position gives v(t) = ${vx}. What is v(${n(t1)}), in metres per second?`, answer: [v1], explanation: `Put t = ${n(t1)} into v(t): ${n(v1)} m/s.` },
   { prompt: `What is the average acceleration, (v(${n(t2)}) − v(${n(t1)})) ÷ (${n(t2)} − ${n(t1)}), in m/s²?`, answer: [avg], explanation: `v(${n(t2)}) = ${n(v2)} m/s, so the change is ${n(v2 - v1)} m/s in ${n(t2 - t1)} s, which is ${n(avg)} m/s².` },
   { prompt: `Differentiating the velocity gives a(t) = ${ax}. What is a(${n(t2)}), in m/s²?`, answer: [a2], explanation: `Put t = ${n(t2)} into a(t): ${n(a2)} m/s². It is not the average, because the acceleration changes during the interval.` }
  ] }; }
});

/* ---- q09 Motion with constant acceleration: the kinematic equations [3.4] ---- */

/* The pod starts at rest. a = a2 ÷ 2 and t are drawn, then the printed speed v = at and rail length L = at² ÷ 2 are the parameters;
   the answers are a = v² ÷ (2L) and t = 2L ÷ v. Not the learn numbers. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The launch rail',
 brief: 'A catapult rail on the ridge flings supply pods, and the crew needs the push it gives and how long the pod stays on the rail.',
 labels: ['acceleration (m/s²)', 'time on the rail (s)'], tolerance: 0.005,
 gl: [['v² (m²/s²)'], ['acceleration (m/s²)'], ['time on the rail (s)']]
}, {
 canonical: { v: 14, L: 28 },
 draw: R => retry(() => { const a2 = R.int(3, 12), t = R.int(3, 8); return { v: a2 * t / 2, L: a2 * t * t / 4 }; }, ({ v }) => v <= 60, { v: 14, L: 28 }),
 build: ({ v, L }) => { const a = v * v / (2 * L), t = v / a; return {
  prompt: `A supply pod sits at rest at one end of a straight launch rail on the ridge. A piston pushes it with a constant acceleration all along the rail, and the pod leaves the far end after ${n(L)} m of rail, moving at ${n(v)} m/s. Taking the direction of travel as positive, enter the pod's acceleration in metres per second squared, then the time it spends on the rail in seconds.`,
  answer: [a, t],
  hints: ['The pod starts at rest, so v₀ = 0. Use v² = v₀² + 2a(x − x₀) and solve for a.', 'Then use v = v₀ + at, with v₀ = 0, and solve for t.'],
  solution: `The pod starts at rest, so v² = 2a(x − x₀): ${n(v * v)} = 2 × a × ${n(L)}, so a = ${n(v * v)} ÷ ${n(2 * L)} = ${n(a)} m/s². Then v = at gives t = ${n(v)} ÷ ${n(a)} = ${n(t)} s.`,
  guidance: [
   { prompt: `The pod leaves at ${n(v)} m/s. What is v², in square metres per second squared?`, answer: [v * v], explanation: `${n(v)} × ${n(v)} = ${n(v * v)}.` },
   { prompt: `Solve ${n(v * v)} = 2 × a × ${n(L)}. What is the acceleration a, in m/s²?`, answer: [a], explanation: `2 × ${n(L)} = ${n(2 * L)}, and ${n(v * v)} ÷ ${n(2 * L)} = ${n(a)} m/s².` },
   { prompt: `Solve ${n(v)} = ${n(a)}t, using v = at for a start from rest. What is t, in seconds?`, answer: [t], explanation: `t = ${n(v)} ÷ ${n(a)} = ${n(t)} s.` }
  ] }; }
});

/* Reaction distance v0·tr, braking distance v0² ÷ (2a), and their sum; each has at most 2 decimal places. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The washout warning',
 brief: 'A cargo crawler must stop short of a washed-out stretch of road, and the crew needs to know how far it goes before it is still.',
 labels: ['reaction distance (m)', 'braking distance (m)', 'total stopping distance (m)'], tolerance: 0.005,
 gl: [['reaction distance (m)'], ['braking distance (m)'], ['total stopping distance (m)']]
}, {
 canonical: { v0: 18, a: 2.5, tr: 1.5 },
 draw: R => retry(() => ({ v0: R.int(8, 30), a: R.pick([2, 2.5, 4, 5]), tr: R.pick([1, 1.5, 2, 2.5]) }),
  ({ v0, a, tr }) => clean2(v0 * tr) && clean2(v0 * v0 / (2 * a)), { v0: 18, a: 2.5, tr: 1.5 }),
 build: ({ v0, a, tr }) => { const dr = v0 * tr, db = v0 * v0 / (2 * a), tot = dr + db; return {
  prompt: `The cargo crawler is rolling along the flat road at ${n(v0)} m/s when its pilot sees a washed-out stretch ahead. The pilot needs ${n(tr)} s to react, and during that time the crawler keeps its speed. Then the brakes come on with a constant deceleration of ${n(a)} m/s², so, taking the direction of travel as positive, its acceleration is −${n(a)} m/s². Enter the distance the crawler covers during the reaction time, then the distance it covers while braking, then its total stopping distance from the moment the pilot sees the washout, all in metres.`,
  answer: [dr, db, tot],
  hints: ['During the reaction time nothing slows the crawler, so the distance is its speed times the reaction time.', 'While braking, use v² = v₀² + 2a(x − x₀) with a final speed of 0. The total is the sum of the two distances.'],
  solution: `Reaction: ${n(v0)} × ${n(tr)} = ${n(dr)} m. Braking: 0 = ${n(v0 * v0)} − 2 × ${n(a)} × (x − x₀), so x − x₀ = ${n(v0 * v0)} ÷ ${n(2 * a)} = ${n(db)} m. Total: ${n(dr)} + ${n(db)} = ${n(tot)} m.`,
  guidance: [
   { prompt: `At a steady ${n(v0)} m/s for ${n(tr)} s, how far does the crawler go during the reaction time, in metres?`, answer: [dr], explanation: `Distance = speed × time = ${n(v0)} × ${n(tr)} = ${n(dr)} m.` },
   { prompt: `Solve 0 = ${n(v0 * v0)} − 2 × ${n(a)} × (x − x₀). What is the braking distance x − x₀, in metres?`, answer: [db], explanation: `2 × ${n(a)} = ${n(2 * a)}, and ${n(v0 * v0)} ÷ ${n(2 * a)} = ${n(db)} m.` },
   { prompt: `What is the total stopping distance from the moment the pilot sees the washout, in metres?`, answer: [tot], explanation: `${n(dr)} + ${n(db)} = ${n(tot)} m.` }
  ] }; }
});

/* A constant deceleration a (from the speeds at two posts d apart): v0 = v1 + a·T1 and d = (v0 + v1)·T1 ÷ 2 are built from a, v1, T1.
   Answers: a = (v0² − v1²) ÷ (2d), further distance v1² ÷ (2a), and the average velocity over the whole slide = total distance ÷ (v0 ÷ a). */
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q06', title: 'The rough patch',
 brief: 'A sled brakes across the flat while its speed is read at two posts, and the crew must find its deceleration, how much further it slides and its average velocity.',
 labels: ['deceleration (m/s²)', 'further distance (m)', 'average velocity (m/s)'], tolerance: 0.005,
 gl: [['deceleration (m/s²)'], ['further distance (m)'], ['total time (s)'], ['average velocity (m/s)']]
}, {
 canonical: { v0: 16, v1: 6, d: 55 },
 draw: R => retry(() => { const a = R.pick([2, 2.5, 4, 5]), v1 = R.int(4, 12), T1 = R.int(2, 5), v0 = v1 + a * T1; return { v0, v1, d: (v0 + v1) * T1 / 2 }; },
  ({ v0, v1, d }) => { const a = (v0 * v0 - v1 * v1) / (2 * d); return v0 <= 40 && clean2(d) && clean2(v1 * v1 / (2 * a)) && clean2(v0 / 2); }, { v0: 16, v1: 6, d: 55 }),
 build: ({ v0, v1, d }) => { const a = (v0 * v0 - v1 * v1) / (2 * d), s2 = v1 * v1 / (2 * a), tt = v0 / a, tot = d + s2, avg = tot / tt; return {
  prompt: `A sled slides along the flat run with its brakes on, slowing at a constant rate all the way until it stops. It passes a start post at ${n(v0)} m/s, and a second post ${n(d)} m further on at ${n(v1)} m/s. Take its direction of travel as positive. Enter the sled's deceleration (the size of its acceleration) in metres per second squared, then the further distance it slides after the second post before it stops, in metres, then its average velocity over the whole slide from the start post to where it stops, in metres per second. The average velocity is the displacement divided by the time taken.`,
  answer: [a, s2, avg],
  hints: ['Between the two posts you know both speeds and the distance, so use v² = v₀² + 2a(x − x₀) there and solve for a. The deceleration is the size of that a.', 'After the second post the sled starts at the second speed and ends at 0: use the same equation again. For the average velocity you need the whole distance and the whole time, and v = v₀ + at gives the time.'],
  solution: `Between the posts: ${n(v1 * v1)} = ${n(v0 * v0)} + 2a × ${n(d)}, so a = −${n(v0 * v0 - v1 * v1)} ÷ ${n(2 * d)} = −${n(a)} m/s², a deceleration of ${n(a)} m/s². After the second post: 0 = ${n(v1 * v1)} − 2 × ${n(a)} × (x − x₀), so the further distance is ${n(v1 * v1)} ÷ ${n(2 * a)} = ${n(s2)} m. The whole slide takes 0 = ${n(v0)} − ${n(a)}t, so t = ${n(tt)} s, and covers ${n(d)} + ${n(s2)} = ${n(tot)} m, so the average velocity is ${n(tot)} ÷ ${n(tt)} = ${n(avg)} m/s.`,
  guidance: [
   { prompt: `Between the posts, ${n(v1 * v1)} = ${n(v0 * v0)} + 2a × ${n(d)}. What is the size of a, the deceleration, in m/s²?`, answer: [a], explanation: `2a × ${n(d)} = ${n(v1 * v1 - v0 * v0)}, so a = ${n(v1 * v1 - v0 * v0)} ÷ ${n(2 * d)} = −${n(a)} m/s²: a deceleration of ${n(a)} m/s².` },
   { prompt: `After the second post the sled goes from ${n(v1)} m/s to 0. What is the further distance, in metres?`, answer: [s2], explanation: `0 = ${n(v1 * v1)} − 2 × ${n(a)} × (x − x₀), so x − x₀ = ${n(v1 * v1)} ÷ ${n(2 * a)} = ${n(s2)} m.` },
   { prompt: `From the start post, 0 = ${n(v0)} − ${n(a)}t. How long does the whole slide take, in seconds?`, answer: [tt], explanation: `t = ${n(v0)} ÷ ${n(a)} = ${n(tt)} s.` },
   { prompt: `The whole slide covers ${n(d)} + ${n(s2)} = ${n(tot)} m in ${n(tt)} s. What is the average velocity, in metres per second?`, answer: [avg], explanation: `${n(tot)} ÷ ${n(tt)} = ${n(avg)} m/s, half the starting speed, as expected for a constant deceleration to a stop.` }
  ] }; }
});

/* ---- q10 Free fall with g = 9.8 m/s² [3.5] ---- */

/* Thrown down at u from height h = uT + 4.9T²: the landing time is T and the impact speed u + 9.8T, so both answers have at most
   1 decimal place and no rounding is needed. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The pod thrown down the shaft',
 brief: 'A crew member throws a marker pod down from the rim platform, and the crew wants to know when it lands and how fast it is going when it does.',
 labels: ['time to land (s)', 'speed at impact (m/s)'], tolerance: 0.005,
 gl: [['u² + 19.6h (m²/s²)'], ['time to land (s)'], ['speed at impact (m/s)']]
}, {
 canonical: { u: 6, h: 62.1 },
 draw: R => { const u = R.int(2, 15), T = R.int(2, 7); return { u, h: r1(u * T + 4.9 * T * T) }; },
 build: ({ u, h }) => { const disc = u * u + 19.6 * h, root = Math.sqrt(disc), t = (root - u) / 9.8; return {
  prompt: `A crew member on the rim platform throws a marker pod straight down at ${n(u)} m/s. The pod leaves her hand ${n(h)} m above the crater floor and is then in free fall: take g = 9.8 m/s², and ignore air resistance. Enter the time from the throw until the pod hits the floor in seconds, then its speed at the moment it hits in metres per second. Each answer has at most 2 decimal places.`,
  answer: [t, root],
  hints: ['Take up as positive: the pod starts at height h with velocity −u, so its height is y = h − ut − ½gt². It lands when y = 0: write that as a quadratic in t and keep the positive root.', 'The speed at impact is the size of v = −u − gt at the landing time. Or use v² = u² + 2gh, which needs no time.'],
  solution: `Upwards is positive, so the height is y = ${n(h)} − ${n(u)}t − 4.9t². It lands when y = 0, that is 4.9t² + ${n(u)}t − ${n(h)} = 0, so t = (−${n(u)} + √(${n(u * u)} + 19.6 × ${n(h)})) ÷ 9.8 = (−${n(u)} + √${n(disc)}) ÷ 9.8 = (−${n(u)} + ${n(root)}) ÷ 9.8 = ${n(t)} s. The speed on impact comes from v² = u² + 2gh = ${n(disc)}, so it is √${n(disc)} = ${n(root)} m/s.`,
  guidance: [
   { prompt: `For the landing quadratic, work out u² + 19.6h, with u = ${n(u)} and h = ${n(h)}. What is it?`, answer: [disc], explanation: `${n(u * u)} + 19.6 × ${n(h)} = ${n(disc)}. Its square root, ${n(root)}, is also the speed on impact.` },
   { prompt: `The landing time is t = (−${n(u)} + √${n(disc)}) ÷ 9.8. What is t, in seconds?`, answer: [t], explanation: `(−${n(u)} + ${n(root)}) ÷ 9.8 = ${n(t)} s. The other root is negative, before the throw.` },
   { prompt: `The speed on impact is √(u² + 2gh) = √${n(disc)}. What is it, in metres per second?`, answer: [root], explanation: `√${n(disc)} = ${n(root)} m/s. Check: ${n(u)} + 9.8 × ${n(t)} = ${n(root)} m/s.` }
  ] }; }
});

/* A stone dropped from rest and heard to land after T seconds: depth 4.9T², impact speed 9.8T, and the fall in the final tau seconds
   4.9(T² − (T − tau)²). All exact to 1 decimal place. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The crevasse plumb',
 brief: 'Mira’s crew time a stone falling into a crevasse on the ridge, and want its depth, its speed at the bottom and its last stretch of fall.',
 labels: ['depth (m)', 'speed on impact (m/s)', 'distance in the final stretch (m)'], tolerance: 0.01,
 gl: [['depth (m)'], ['speed on impact (m/s)'], ['distance in the final stretch (m)']]
}, {
 canonical: { T: 6, tau: 2 },
 draw: R => retry(() => ({ T: R.int(4, 12), tau: R.int(1, 4) }), ({ T, tau }) => tau < T, { T: 6, tau: 2 }),
 build: ({ T, tau }) => { const H = 4.9 * T * T, v = 9.8 * T, E = 4.9 * (T - tau) * (T - tau), last = H - E, tw = tau === 1 ? '1 second' : `${n(tau)} seconds`; return {
  prompt: `Mira's crew drop a stone into a deep crevasse north of the ridge and time its fall: it hits the bottom ${n(T)} s after release. The stone is released from rest and is in free fall with g = 9.8 m/s²; ignore air resistance and the time the sound takes to travel. Enter the depth of the crevasse in metres, then the stone's speed on impact in metres per second, then how far the stone falls during the final ${tw} of its fall, in metres. Each answer has at most 1 decimal place.`,
  answer: [H, v, last],
  hints: ['Released from rest, v₀ = 0, so the distance fallen after a time t is ½gt² and the speed is gt.', 'The distance fallen in the final stretch is the whole depth minus the distance fallen before that stretch began, which is the fall in the shorter time.'],
  solution: `Depth: ½ × 9.8 × ${n(T)}² = 4.9 × ${n(T * T)} = ${n(H)} m. Speed: 9.8 × ${n(T)} = ${n(v)} m/s. The final ${tw} start after ${n(T - tau)} s, when the stone has fallen 4.9 × ${n(T - tau)}² = ${n(E)} m, so it falls ${n(H)} − ${n(E)} = ${n(last)} m in that stretch.`,
  guidance: [
   { prompt: `The stone falls from rest for ${n(T)} s. Using the distance ½gt², what is the depth, in metres?`, answer: [H], explanation: `4.9 × ${n(T)}² = 4.9 × ${n(T * T)} = ${n(H)} m.` },
   { prompt: `Using v = gt, what is the speed on impact, in metres per second?`, answer: [v], explanation: `9.8 × ${n(T)} = ${n(v)} m/s.` },
   { prompt: `The final ${tw} begin after ${n(T - tau)} s of falling. How far does the stone fall in that final stretch, in metres?`, answer: [last], explanation: `After ${n(T - tau)} s it has fallen 4.9 × ${n(T - tau)}² = ${n(E)} m, so the final stretch is ${n(H)} − ${n(E)} = ${n(last)} m.` }
  ] }; }
});

/* Thrown up at v0 from a ledge h = 4.9T² − v0·T above the floor, so the landing time is T and every answer has at most 1 decimal place:
   landing time T, landing velocity v0 − 9.8T (negative), average velocity −h ÷ T. */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q07', title: 'The pod from the ledge',
 brief: 'A pod thrown up from a ledge falls past it and lands on the crater floor, and the crew wants its landing time, its landing velocity and its average velocity.',
 labels: ['time to land (s)', 'velocity at landing (m/s)', 'average velocity (m/s)'], tolerance: 0.01,
 gl: [['time to land (s)'], ['velocity at landing (m/s)'], ['average velocity (m/s)']]
}, {
 canonical: { v0: 12, h: 30.4 },
 draw: R => retry(() => { const T = R.int(2, 8), v0 = R.int(3, 30); return { v0, h: r1(4.9 * T * T - v0 * T) }; }, ({ h }) => h >= 5, { v0: 12, h: 30.4 }),
 build: ({ v0, h }) => { const disc = v0 * v0 + 19.6 * h, root = Math.sqrt(disc), t = (v0 + root) / 9.8, vl = v0 - 9.8 * t, avg = -h / t; return {
  prompt: `A supply pod is thrown straight up at ${n(v0)} m/s from a ledge ${n(h)} m above the crater floor. Take g = 9.8 m/s² and ignore air resistance. Its height above the floor is y(t) = ${n(h)} + ${n(v0)}t − 4.9t² metres, t seconds after the throw. Its velocity is the derivative of its height, v = dy/dt, and its average velocity is the displacement divided by the time taken (a negative value means downwards). Enter the time the pod takes to hit the floor in seconds, then its velocity at the moment it hits in metres per second, then its average velocity from the throw to the landing in metres per second. Each answer has at most 2 decimal places.`,
  answer: [t, vl, avg],
  hints: ['The pod lands when y(t) = 0. Write that as a quadratic in t and keep the positive root.', 'Differentiate y(t) to get v(t) and put the landing time in. The average velocity is the change in height, landing height minus starting height, divided by the time.'],
  solution: `The pod lands when ${n(h)} + ${n(v0)}t − 4.9t² = 0, that is 4.9t² − ${n(v0)}t − ${n(h)} = 0, so t = (${n(v0)} + √(${n(v0 * v0)} + 19.6 × ${n(h)})) ÷ 9.8 = (${n(v0)} + √${n(disc)}) ÷ 9.8 = (${n(v0)} + ${n(root)}) ÷ 9.8 = ${n(t)} s. The derivative is v(t) = ${n(v0)} − 9.8t, so v(${n(t)}) = ${n(v0)} − 9.8 × ${n(t)} = ${n(vl)} m/s, downwards. The height changes from ${n(h)} m to 0, a displacement of ${n(-h)} m, so the average velocity is ${n(-h)} ÷ ${n(t)} = ${n(avg)} m/s.`,
  guidance: [
   { prompt: `Solve 4.9t² − ${n(v0)}t − ${n(h)} = 0 for its positive root. What is the landing time, in seconds?`, answer: [t], explanation: `t = (${n(v0)} + √${n(disc)}) ÷ 9.8 = (${n(v0)} + ${n(root)}) ÷ 9.8 = ${n(t)} s. The other root is negative, before the throw.` },
   { prompt: `Differentiating gives v(t) = ${n(v0)} − 9.8t. What is v at the landing time, in metres per second?`, answer: [vl], explanation: `${n(v0)} − 9.8 × ${n(t)} = ${n(vl)} m/s. The minus sign says the pod is moving downwards.` },
   { prompt: `The pod ends ${n(h)} m below where it started, a displacement of ${n(-h)} m. What is the average velocity over the ${n(t)} s, in metres per second?`, answer: [avg], explanation: `${n(-h)} ÷ ${n(t)} = ${n(avg)} m/s.` }
  ] }; }
});

})();
