/* Calculus 3: many variables practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p3.js. */
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
/* A sum of terms written the usual way: ex([[3, 'x²'], [−1, 'y'], [4, '']]) is "3x² − y + 4". Zero terms are left out,
   a coefficient 1 is not written before a letter, and the first term carries only a minus sign. */
const ex = terms => { const out = []; for (const [c, m] of terms) { if (!c) continue; const a = Math.abs(c), body = (a === 1 && m) ? m : n(a) + m;
 out.push(out.length ? `${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`); } return out.length ? out.join(' ') : '0'; };
/* A sum of numbers as worked out: sm([24, −8, 4]) is "24 − 8 + 4". */
const sm = list => list.map((v, i) => i ? `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}` : n(v)).join(' ');
/* The coefficient in front of a letter: '' for 1, '−' for −1, else the number. */
const co = c => c === 1 ? '' : c === -1 ? '−' : n(c);
/* "y = 2x", "y = x", "y = −x" */
const mx = m => m === 1 ? 'x' : m === -1 ? '−x' : `${n(m)}x`;
const line = m => `y = ${mx(m)}`;
const pt = (a, b) => `(${n(a)}, ${n(b)})`;
const pt3 = (a, b, c) => `(${n(a)}, ${n(b)}, ${n(c)})`;
const isSq = v => v > 0 && Number.isInteger(Math.sqrt(v));
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => a / gcd(a, b) * b;

/* Velocities ⟨a, b, 2T⟩ with a whole speed: a, b, T in 1…6. Shared by q11b, q11c and q11d. */
const Q11 = [];
for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let T = 1; T <= 6; T++) if (isSq(a * a + b * b + 4 * T * T)) Q11.push([a, b, T]);
/* q11d: the tug's early point is a whole number of metres from the plane (the normal ⟨2, 2, 1⟩ has magnitude 3). */
const Q11D = [];
for (const [a, b, T] of Q11) { const K = 2 * (a + b); for (let t0 = 1; t0 < T; t0++) if (((T - t0) * (t0 + T + K)) % 3 === 0 && T * T + K * T <= 260) Q11D.push([a, b, T, t0]); }
/* q12b: the level curve k + px² + qy² = c meets the y-axis at a whole y. */
const Q12B = [];
for (let p = 1; p <= 4; p++) for (let q = 1; q <= 4; q++) for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (isSq((p * a * a + q * b * b) / q) && Number.isInteger((p * a * a + q * b * b) / q)) Q12B.push([p, q, a, b]);
/* q12d: two beacons on h = k − px² − qy² at different heights, a whole straight-line distance apart. */
const Q12D = [];
for (let p = 1; p <= 3; p++) for (let q = 1; q <= 3; q++) for (let x1 = 1; x1 <= 4; x1++) for (let y1 = 1; y1 <= 4; y1++) for (let x2 = -4; x2 <= 4; x2++) for (let y2 = -4; y2 <= 4; y2++) {
 const dh = (p * x2 * x2 + q * y2 * y2) - (p * x1 * x1 + q * y1 * y1);
 if (dh !== 0 && isSq((x2 - x1) ** 2 + (y2 - y1) ** 2 + dh * dh)) Q12D.push([p, q, x1, y1, x2, y2]); }
/* q13b: lines y = m1x and y = m2x that give whole, different values of Ax² ÷ (x² + By²). */
const SL = [1, 2, 3, -1, -2, -3];
const Q13B = [];
for (let B = 1; B <= 3; B++) for (const m1 of SL) for (const m2 of SL) { if (m1 === m2) continue; const L = lcm(1 + B * m1 * m1, 1 + B * m2 * m2);
 for (let A = L; A <= 60; A += L) if (A / (1 + B * m1 * m1) !== A / (1 + B * m2 * m2)) Q13B.push([A, B, m1, m2]); }
/* q13c: lines that give whole, different values of Axy ÷ (x² + By²), which is Am ÷ (1 + Bm²) on y = mx. */
const Q13C = [];
for (let B = 1; B <= 3; B++) for (const m1 of SL) for (const m2 of SL) { if (m1 === m2) continue;
 for (let A = 2; A <= 60; A++) { const v1 = A * m1 / (1 + B * m1 * m1), v2 = A * m2 / (1 + B * m2 * m2);
  if (Number.isInteger(v1) && Number.isInteger(v2) && v1 !== v2 && Math.abs(v1 - v2) >= 2) Q13C.push([A, B, m1, m2]); } }
/* q13d: three lines that all give whole values of Axy ÷ (x² + By²). */
const Q13D = [];
for (let B = 1; B <= 3; B++) for (let i = 0; i < SL.length; i++) for (let j = i + 1; j < SL.length; j++) for (let k = j + 1; k < SL.length; k++) {
 const ms = [SL[i], SL[j], SL[k]];
 for (let A = 2; A <= 90; A++) if (ms.every(m => Number.isInteger(A * m / (1 + B * m * m)))) Q13D.push([A, B, ms[0], ms[1], ms[2]]); }

/* ---- q11 Chapter review: docking a shuttle [2.5, 3.4] ---- */

/* r(t) = ⟨at, t², bt⟩ meets the plane px + y + qz = d at t = T, where d = T² + (pa + qb)T, so t² + Kt − d = (t − T)(t + K + T) with K = pa + qb;
   the velocity ⟨a, 2t, b⟩ has the whole speed √(a² + 4T² + b²). Not the worked example (⟨t, 2t, t²⟩ with x + y + z = 4). */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The loading hatch',
 brief: 'A cargo drone is gliding towards a loading hatch on a dome wall, and the crew needs the moment it reaches the hatch frame and its speed there.',
 labels: ['arrival time (s)', 'speed (m/s)'], tolerance: 0.01,
 gl: [['coefficient of t'], ['arrival time (s)'], ['second velocity component (m/s)'], ['speed (m/s)']]
}, {
 canonical: { a: 2, b: 4, T: 2, p: 2, q: 1 },
 draw: R => { let o; do { const [a, b, T] = R.pick(Q11); o = { a, b, T, p: R.int(1, 3), q: R.int(1, 3) }; }
   while ((o.a === 1 && o.b === 2 && o.T === 1 && o.p === 1 && o.q === 1) || o.T * o.T + (o.p * o.a + o.q * o.b) * o.T > 200); return o; },
 build: ({ a, b, T, p, q }) => { const K = p * a + q * b, d = T * T + K * T, vy = 2 * T, S = Math.sqrt(a * a + vy * vy + b * b), eq = `${co(p)}x + y + ${co(q)}z = ${n(d)}`; return {
  prompt: `A cargo drone glides towards a loading hatch on the wall of a dome. Its position t seconds after it leaves the dock is r(t) = ⟨${co(a)}t, t², ${co(b)}t⟩, in metres, and the hatch’s flat frame lies in the plane ${eq}. The drone is at the hatch at the moment its three coordinates satisfy the plane’s equation. Enter that time t, which is positive, in seconds, then the drone’s speed at that moment in metres per second.`,
  answer: [T, S],
  hints: ['Replace x, y and z in the plane’s equation by the matching components of r(t). Collect the terms into one quadratic equation in t, move everything to one side, solve it, and keep the positive root.', 'Differentiate each component of r(t) to get the velocity, put in the time you found, and take the magnitude: the square root of the sum of the squares of the three components.'],
  solution: `Substituting x = ${co(a)}t, y = t² and z = ${co(b)}t gives ${ex([[p * a, 't'], [1, 't²'], [q * b, 't']])} = ${n(d)}, so t² + ${n(K)}t − ${n(d)} = 0. This factors as (t − ${n(T)})(t + ${n(K + T)}) = 0, and the positive root is t = ${n(T)}. The velocity is r′(t) = ⟨${n(a)}, 2t, ${n(b)}⟩, which at t = ${n(T)} is ⟨${n(a)}, ${n(vy)}, ${n(b)}⟩. The speed is √(${n(a)}² + ${n(vy)}² + ${n(b)}²) = √${n(S * S)} = ${n(S)} metres per second.`,
  guidance: [
   { prompt: `Substitute r(t) into ${eq}. The equation becomes t² + Kt − ${n(d)} = 0. What is K, the number in front of t?`, answer: [K], explanation: `x = ${co(a)}t and z = ${co(b)}t, so ${co(p)}x + ${co(q)}z = ${ex([[p * a, 't'], [q * b, 't']])} = ${n(K)}t. With y = t² the equation is t² + ${n(K)}t − ${n(d)} = 0.` },
   { prompt: `Solve t² + ${n(K)}t − ${n(d)} = 0. What is its positive root?`, answer: [T], explanation: `t² + ${n(K)}t − ${n(d)} = (t − ${n(T)})(t + ${n(K + T)}), so the roots are ${n(T)} and −${n(K + T)}. Time after leaving the dock is positive, so t = ${n(T)}.` },
   { prompt: `The velocity is r′(t) = ⟨${n(a)}, 2t, ${n(b)}⟩. What is its second component at t = ${n(T)}?`, answer: [vy], explanation: `The derivative of t² is 2t, and 2 × ${n(T)} = ${n(vy)}. The other two components stay ${n(a)} and ${n(b)}.` },
   { prompt: `What is the speed, the magnitude of ⟨${n(a)}, ${n(vy)}, ${n(b)}⟩?`, answer: [S], explanation: `${n(a * a)} + ${n(vy * vy)} + ${n(b * b)} = ${n(S * S)}, and √${n(S * S)} = ${n(S)} metres per second.` }
  ] }; }
});

/* r(t) = ⟨t², at, bt⟩ meets the plane x + py + qz = d at t = T (d = T² + (pa + qb)T); the speed is √(4T² + a² + b²) and E = ½ m v².
   m is even, so E is whole. Not the worked example. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The braking test',
 brief: 'A cargo pod drifts across the transfer bay towards a safety screen, and the engineers need its speed and its energy at the moment it meets the screen.',
 labels: ['meeting time (s)', 'speed (m/s)', 'kinetic energy (J)'], tolerance: 0.01,
 gl: [['meeting time (s)'], ['speed (m/s)'], ['kinetic energy (J)']]
}, {
 canonical: { a: 3, b: 6, T: 3, p: 1, q: 1, m: 8 },
 draw: R => { let o; do { const [a, b, T] = R.pick(Q11); o = { a, b, T, p: R.int(1, 3), q: R.int(1, 3), m: 2 * R.int(2, 20) }; }
   while (o.T * o.T + (o.p * o.a + o.q * o.b) * o.T > 220); return o; },
 build: ({ a, b, T, p, q, m }) => { const K = p * a + q * b, d = T * T + K * T, vx = 2 * T, S = Math.sqrt(vx * vx + a * a + b * b), E = m * S * S / 2, eq = `x + ${co(p)}y + ${co(q)}z = ${n(d)}`; return {
  prompt: `A cargo pod of mass ${n(m)} kg drifts across the transfer bay. Its position t seconds after release is r(t) = ⟨t², ${co(a)}t, ${co(b)}t⟩, in metres, and a flat safety screen across the bay lies in the plane ${eq}. The pod meets the screen at the moment its three coordinates satisfy the plane’s equation. Enter that time t, which is positive, in seconds. Then enter the pod’s speed at that moment in metres per second. Then enter its kinetic energy at that moment in joules (type it without commas), where kinetic energy = ½ × mass × speed².`,
  answer: [T, S, E],
  hints: ['Replace x, y and z in the plane’s equation by the matching components of r(t). That leaves one quadratic equation in t: solve it and keep the positive root.', 'The speed is the magnitude of the velocity r′(t), found one component at a time. Use the speed itself, squared, in the energy formula.'],
  solution: `Substituting x = t², y = ${co(a)}t and z = ${co(b)}t gives t² + ${ex([[p * a, 't'], [q * b, 't']])} = ${n(d)}, so t² + ${n(K)}t − ${n(d)} = 0. This factors as (t − ${n(T)})(t + ${n(K + T)}) = 0, and the positive root is t = ${n(T)}. The velocity is r′(t) = ⟨2t, ${n(a)}, ${n(b)}⟩, which at t = ${n(T)} is ⟨${n(vx)}, ${n(a)}, ${n(b)}⟩, so the speed is √(${n(vx * vx)} + ${n(a * a)} + ${n(b * b)}) = √${n(S * S)} = ${n(S)} metres per second. The kinetic energy is ½ × ${n(m)} × ${n(S)}² = ${n(E)} joules.`,
  guidance: [
   { prompt: `Put x = t², y = ${co(a)}t and z = ${co(b)}t into ${eq}. The equation becomes t² + ${n(K)}t = ${n(d)}. What is the positive solution t?`, answer: [T], explanation: `t² + ${n(K)}t − ${n(d)} = (t − ${n(T)})(t + ${n(K + T)}), so the roots are ${n(T)} and −${n(K + T)}. Time after release is positive, so t = ${n(T)}.` },
   { prompt: `The velocity is r′(t) = ⟨2t, ${n(a)}, ${n(b)}⟩. What is its magnitude, the speed, at t = ${n(T)}?`, answer: [S], explanation: `At t = ${n(T)} the velocity is ⟨${n(vx)}, ${n(a)}, ${n(b)}⟩, and ${n(vx * vx)} + ${n(a * a)} + ${n(b * b)} = ${n(S * S)}, so the speed is √${n(S * S)} = ${n(S)} metres per second.` },
   { prompt: `The speed is ${n(S)} metres per second and the mass is ${n(m)} kg. What is ½ × ${n(m)} × ${n(S)}², in joules?`, answer: [E], explanation: `${n(S)}² = ${n(S * S)}, and ½ × ${n(m)} × ${n(S * S)} = ${n(E)} joules.` }
  ] }; }
});

/* r(t) has t² in coordinate slot s (0 = x, 1 = y, 2 = z) and at, bt in the other two; the plane has coefficient 1 on that slot and 2 on the others
   (normal of magnitude 3), so it is met at T where t² + Kt − d = 0, d = T² + 2(a + b)T, K = 2(a + b). At t0 < T the value of the left side minus d is
   (t0 − T)(t0 + T + K); the draws keep the distance |value| ÷ 3 whole. Uses q09 (distance from a point to a plane). */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q09', title: 'The late approach',
 brief: 'A docking tug is closing on a dock plate, and the crew wants its arrival time, how far off the plate it was earlier, and its speed on arrival.',
 labels: ['arrival time (s)', 'distance at the earlier time (m)', 'arrival speed (m/s)'], tolerance: 0.01,
 gl: [['arrival time (s)'], ['value at the earlier point'], ['distance (m)'], ['arrival speed (m/s)']]
}, {
 canonical: { a: 2, b: 4, T: 2, t0: 1, s: 2 },
 draw: R => { const [a, b, T, t0] = R.pick(Q11D); return { a, b, T, t0, s: R.int(0, 2) }; },
 build: ({ a, b, T, t0, s }) => { const K = 2 * (a + b), d = T * T + K * T, vz = 2 * T, S = Math.sqrt(a * a + b * b + vz * vz);
  const fill = (sq, u, v) => { const o = []; let k = 0; for (let i = 0; i < 3; i++) o.push(i === s ? sq : [u, v][k++]); return o; };
  const pos = fill('t²', `${co(a)}t`, `${co(b)}t`), vel = fill('2t', n(a), n(b)), at0 = fill(t0 * t0, a * t0, b * t0), vT = fill(vz, a, b);
  const cf = [2, 2, 2]; cf[s] = 1; const xyz = ['x', 'y', 'z'], eq = `${[0, 1, 2].map(i => co(cf[i]) + xyz[i]).join(' + ')} = ${n(d)}`, lhs = [0, 1, 2].map(i => co(cf[i]) + xyz[i]).join(' + ');
  const V = cf[0] * at0[0] + cf[1] * at0[1] + cf[2] * at0[2] - d, D = Math.abs(V) / 3;
  const terms = ex([0, 1, 2].map(i => i === s ? [1, 't²'] : [2 * (i === (s === 0 ? 1 : 0) ? a : b), 't'])), sub = [0, 1, 2].map(i => `${xyz[i]} = ${pos[i]}`);
  return {
  prompt: `A docking tug is closing on a dock plate. Its position t seconds after its main burn is r(t) = ⟨${pos.join(', ')}⟩, in metres, and the flat dock plate lies in the plane ${eq}. Enter the time t, which is positive, at which the tug reaches the plate: the moment its three coordinates satisfy the plane’s equation. Then enter how far the tug is from the plane at t = ${n(t0)}, before it arrives: its shortest distance to the plane, in metres, which is a whole number. Finally enter the tug’s speed on arrival, in metres per second.`,
  answer: [T, D, S],
  hints: ['Put the three components of r(t) into the plane’s equation and solve the quadratic equation in t, keeping the positive root. For the speed, differentiate each component of r(t), put in the arrival time and take the magnitude.', 'For the distance, put the tug’s position at the earlier time into the left side of the plane’s equation and subtract the right side. The distance is the size of that value divided by the magnitude of the plane’s normal vector, which is made of the numbers in front of x, y and z.'],
  solution: `Substituting ${sub[0]}, ${sub[1]} and ${sub[2]} gives ${terms} = ${n(d)}, so t² + ${n(K)}t − ${n(d)} = 0. This factors as (t − ${n(T)})(t + ${n(K + T)}) = 0, and the positive root is t = ${n(T)}. At t = ${n(t0)} the tug is at ${pt3(...at0)}, where ${lhs} − ${n(d)} = ${sm([...at0.map((v, i) => cf[i] * v), -d])} = ${n(V)}. The normal vector is ⟨${cf.join(', ')}⟩, with magnitude √(4 + 4 + 1) = 3, so the distance is |${n(V)}| ÷ 3 = ${n(D)} metres. The velocity is r′(t) = ⟨${vel.join(', ')}⟩, which at t = ${n(T)} is ⟨${vT.map(n).join(', ')}⟩, so the speed is √(${n(a * a)} + ${n(b * b)} + ${n(vz * vz)}) = √${n(S * S)} = ${n(S)} metres per second.`,
  guidance: [
   { prompt: `Put ${sub[0]}, ${sub[1]} and ${sub[2]} into ${eq}. The equation becomes t² + ${n(K)}t − ${n(d)} = 0. What is its positive root?`, answer: [T], explanation: `t² + ${n(K)}t − ${n(d)} = (t − ${n(T)})(t + ${n(K + T)}), so the roots are ${n(T)} and −${n(K + T)}. Time after the burn is positive, so t = ${n(T)}.` },
   { prompt: `At t = ${n(t0)} the tug is at ${pt3(...at0)}. What is the value of ${lhs} − ${n(d)} there?`, answer: [V], explanation: `${sm([...at0.map((v, i) => cf[i] * v), -d])} = ${n(V)}. The negative sign only says the tug is on the side of the plate it has not yet crossed.` },
   { prompt: `The normal vector ⟨${cf.join(', ')}⟩ has magnitude 3. What is the distance, the size of ${n(V)} divided by 3?`, answer: [D], explanation: `|${n(V)}| ÷ 3 = ${n(D)} metres.` },
   { prompt: `The velocity is r′(t) = ⟨${vel.join(', ')}⟩. What is its magnitude at t = ${n(T)}?`, answer: [S], explanation: `At t = ${n(T)} the velocity is ⟨${vT.map(n).join(', ')}⟩, and ${n(a * a)} + ${n(b * b)} + ${n(vz * vz)} = ${n(S * S)}, so the speed is ${n(S)} metres per second.` }
  ] }; }
});

/* ---- q12 Functions of two variables and level curves [4.1] ---- */

/* T(x, y) = k + px² + qy²: the level at (a, b) is c = k + pa² + qb², and the curve meets the y-axis (x = 0) at y with qy² = pa² + qb². */
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The warm trench',
 brief: 'The lab is mapping the soil temperature across a greenhouse trench and wants to know which line a buried probe sits on.',
 labels: ['level c (°C)', 'y crossing (m)'], tolerance: 0.01,
 gl: [['temperature at probe (°C)'], ['y²'], ['y crossing (m)']]
}, {
 canonical: { k: 12, p: 2, q: 1, a: 2, b: 1 },
 draw: R => { const [p, q, a, b] = R.pick(Q12B); return { k: R.int(5, 40), p, q, a, b }; },
 build: ({ k, p, q, a, b }) => { const c = k + p * a * a + q * b * b, s2 = (c - k) / q, s = Math.sqrt(s2), f = `${n(k)} + ${co(p)}x² + ${co(q)}y²`;
  const pa = p === 1 ? n(a * a) : `${n(p)} × ${n(a * a)}`, qb = q === 1 ? n(b * b) : `${n(q)} × ${n(b * b)}`;
  const onAxis = q === 1 ? `y² = ${n(c - k)}` : `${n(q)}y² = ${n(c - k)}, so y² = ${n(s2)}`; return {
  prompt: `The soil temperature in a greenhouse trench is modelled as T(x, y) = ${f} °C, where (x, y) is a point on the trench floor, in metres from its centre. A probe is buried at ${pt(a, b)}. Enter the temperature at the probe, which is the level c of the level curve through it. Then enter the positive y where that same level curve crosses the y-axis, where x = 0.`,
  answer: [c, s],
  hints: ['Put the probe’s x and y into T(x, y). The temperature you get is the level c of the level curve T(x, y) = c through the probe.', 'Every point on the y-axis has x = 0. Solve T(0, y) = c for the positive y.'],
  solution: `T${pt(a, b)} = ${n(k)} + ${pa} + ${qb} = ${n(c)}, so the probe lies on the level curve T(x, y) = ${n(c)}. On the y-axis x = 0, so the curve meets it where ${n(k)} + ${co(q)}y² = ${n(c)}. Then ${onAxis} and y = ${n(s)}. The level curve through the probe crosses the y-axis at (0, ${n(s)}).`,
  guidance: [
   { prompt: `What is T${pt(a, b)}, the temperature at the probe?`, answer: [c], explanation: `T${pt(a, b)} = ${n(k)} + ${pa} + ${qb} = ${n(c)} °C. The probe’s level curve is T(x, y) = ${n(c)}.` },
   { prompt: `On the y-axis x = 0, so the level curve meets it where ${n(k)} + ${co(q)}y² = ${n(c)}. What is y² there?`, answer: [s2], explanation: `${q === 1 ? `y² = ${n(c)} − ${n(k)}` : `${n(q)}y² = ${n(c)} − ${n(k)} = ${n(c - k)}, so y²`} = ${n(s2)}.` },
   { prompt: `y² = ${n(s2)}. What is the positive y?`, answer: [s], explanation: `√${n(s2)} = ${n(s)}, so the level curve crosses the y-axis at (0, ${n(s)}). Check: T(0, ${n(s)}) = ${n(k)} + ${q === 1 ? '' : n(q) + ' × '}${n(s2)} = ${n(c)}, the same level as the probe.` }
  ] }; }
});

/* T(x, y) = k − px² − qy² with k = L + ps²: the sensor reads c = k − pa² − qb², which is c − L above the alarm level L,
   and the level curve T = L meets the x-axis at x = s. The draw keeps c − L at 3 or more. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'The frost line on the pad',
 brief: 'Heat lamps warm a landing pad, and the crew needs to know how far above the frost alarm a sensor reads and where the alarm line meets the pad’s centre line.',
 labels: ['sensor reading (°C)', 'degrees above alarm level', 'x crossing (m)'], tolerance: 0.01,
 gl: [['sensor reading (°C)'], ['degrees above alarm level'], ['x crossing (m)']]
}, {
 canonical: { p: 2, q: 1, a: 2, b: 3, s: 5, L: 6 },
 draw: R => { let o; do { o = { p: R.int(1, 3), q: R.int(1, 3), a: R.int(1, 5), b: R.int(1, 5), s: R.int(4, 9), L: R.int(2, 15) }; }
   while (o.p * (o.s * o.s - o.a * o.a) - o.q * o.b * o.b < 3); return o; },
 build: ({ p, q, a, b, s, L }) => { const k = L + p * s * s, c = k - p * a * a - q * b * b, up = c - L, f = `${n(k)} − ${co(p)}x² − ${co(q)}y²`;
  const pa = p === 1 ? n(a * a) : `${n(p)} × ${n(a * a)}`, qb = q === 1 ? n(b * b) : `${n(q)} × ${n(b * b)}`; return {
  prompt: `Heat lamps warm a landing pad, so its surface temperature is T(x, y) = ${f} °C at the point (x, y), measured in metres from the pad’s centre. A sensor sits at ${pt(a, b)}. The ice alarm line is the level curve T(x, y) = ${n(L)}. Enter the sensor’s reading in °C, then how many degrees warmer the sensor’s reading is than the alarm level ${n(L)} °C, then the positive x where the alarm line crosses the x-axis, where y = 0.`,
  answer: [c, up, s],
  hints: ['Put the sensor’s x and y into T(x, y) to get its reading. Subtract the alarm level from that reading to find how much warmer the sensor is.', 'Every point on the x-axis has y = 0. Set T(x, 0) equal to the alarm level and solve for the positive x.'],
  solution: `T${pt(a, b)} = ${n(k)} − ${pa} − ${qb} = ${n(c)} °C. The sensor is ${n(c)} − ${n(L)} = ${n(up)} degrees warmer than the alarm level. On the x-axis y = 0, so the alarm line meets it where ${n(k)} − ${co(p)}x² = ${n(L)}. Then ${p === 1 ? `x² = ${n(k - L)}` : `${n(p)}x² = ${n(k - L)}, so x² = ${n(s * s)}`} and x = ${n(s)}. The alarm line crosses the x-axis at (${n(s)}, 0).`,
  guidance: [
   { prompt: `What is T${pt(a, b)}, the sensor’s reading?`, answer: [c], explanation: `T${pt(a, b)} = ${n(k)} − ${pa} − ${qb} = ${n(c)} °C.` },
   { prompt: `The sensor reads ${n(c)} °C and the alarm level is ${n(L)} °C. How many degrees warmer is the sensor?`, answer: [up], explanation: `${n(c)} − ${n(L)} = ${n(up)} degrees.` },
   { prompt: `On the x-axis y = 0, so the alarm line meets it where ${n(k)} − ${co(p)}x² = ${n(L)}. What is the positive x?`, answer: [s], explanation: `${p === 1 ? `x² = ${n(k)} − ${n(L)} = ${n(k - L)}` : `${n(p)}x² = ${n(k)} − ${n(L)} = ${n(k - L)}, so x² = ${n(s * s)}`}, and x = ${n(s)}. Check: T(${n(s)}, 0) = ${n(k)} − ${p === 1 ? '' : n(p) + ' × '}${n(s * s)} = ${n(L)}.` }
  ] }; }
});

/* h(x, y) = k − px² − qy² and two beacons A = (x1, y1), B = (x2, y2) on the ground: heights hA, hB and the straight-line distance
   √(Δx² + Δy² + Δh²), whole for every draw (table Q12D); the heights differ, and k keeps both heights positive. Uses q01 (distance in space). */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q01', title: 'Two beacons on the slope',
 brief: 'Two survey beacons stand on a hillside at different heights, and the crew wants both heights and the cable length that would join them in a straight line.',
 labels: ['height of A (m)', 'height of B (m)', 'distance AB (m)'], tolerance: 0.01,
 gl: [['height of A (m)'], ['height of B (m)'], ['sum of the squares'], ['distance AB (m)']]
}, {
 canonical: { k: 20, p: 1, q: 1, x1: 1, y1: 2, x2: -3, y2: 0 },
 draw: R => { const [p, q, x1, y1, x2, y2] = R.pick(Q12D), drop = Math.max(p * x1 * x1 + q * y1 * y1, p * x2 * x2 + q * y2 * y2); return { k: drop + R.int(5, 30), p, q, x1, y1, x2, y2 }; },
 build: ({ k, p, q, x1, y1, x2, y2 }) => { const hA = k - p * x1 * x1 - q * y1 * y1, hB = k - p * x2 * x2 - q * y2 * y2, dx = x2 - x1, dy = y2 - y1, dh = hB - hA, s2 = dx * dx + dy * dy + dh * dh, D = Math.sqrt(s2), f = `${n(k)} − ${co(p)}x² − ${co(q)}y²`;
  const sq = (px, py) => `${n(k)} − ${p === 1 ? '' : n(p) + ' × '}${n(px * px)} − ${q === 1 ? '' : n(q) + ' × '}${n(py * py)}`; return {
  prompt: `A hillside on the crater rim is modelled by h(x, y) = ${f} metres, where (x, y) is a point on the map, in metres from the map’s origin. Survey beacon A stands on the ground at ${pt(x1, y1)} and beacon B stands on the ground at ${pt(x2, y2)}. Each beacon is the point (x, y, h) in space, where h is the height of the ground beneath it. Enter the height of A, then the height of B, then the straight-line distance from A to B in metres.`,
  answer: [hA, hB, D],
  hints: ['Put each beacon’s x and y into h(x, y) to get its height. Each beacon is then a point (x, y, h) in space.', 'The distance between two points in space is the square root of the sum of the squares of the differences of their x, y and h values.'],
  solution: `h${pt(x1, y1)} = ${sq(x1, y1)} = ${n(hA)} and h${pt(x2, y2)} = ${sq(x2, y2)} = ${n(hB)}. So A is the point (${n(x1)}, ${n(y1)}, ${n(hA)}) and B is the point (${n(x2)}, ${n(y2)}, ${n(hB)}). The differences are ${n(dx)}, ${n(dy)} and ${n(dh)}, so the distance is √(${par(dx)}² + ${par(dy)}² + ${par(dh)}²) = √(${n(dx * dx)} + ${n(dy * dy)} + ${n(dh * dh)}) = √${n(s2)} = ${n(D)} metres.`,
  guidance: [
   { prompt: `What is h${pt(x1, y1)}, the height of the ground at beacon A?`, answer: [hA], explanation: `h${pt(x1, y1)} = ${sq(x1, y1)} = ${n(hA)} metres.` },
   { prompt: `What is h${pt(x2, y2)}, the height of the ground at beacon B?`, answer: [hB], explanation: `h${pt(x2, y2)} = ${sq(x2, y2)} = ${n(hB)} metres.` },
   { prompt: `A is the point (${n(x1)}, ${n(y1)}, ${n(hA)}) and B is the point (${n(x2)}, ${n(y2)}, ${n(hB)}). What is the sum of the squares of the three differences, ${par(dx)}² + ${par(dy)}² + ${par(dh)}²?`, answer: [s2], explanation: `The differences in x, y and h are ${n(dx)}, ${n(dy)} and ${n(dh)}, and ${n(dx * dx)} + ${n(dy * dy)} + ${n(dh * dh)} = ${n(s2)}.` },
   { prompt: `The sum of the squares is ${n(s2)}. What is the distance from A to B?`, answer: [D], explanation: `√${n(s2)} = ${n(D)} metres.` }
  ] }; }
});

/* ---- q13 Limits along paths [4.2] ---- */

/* kind 0: Ax² ÷ (x² + By²), which is the constant A ÷ (1 + Bm²) on y = mx: two different values, no limit.
   kind 1: (x³ + A³y³) ÷ (x + Ay), which is x² − Axy + A²y² wherever it has a value: the limit along every line is 0 and the limit exists (A ≥ 2, so no integer slope makes x + Ay vanish).
   For kind 1, B is unused. Not the worked example (6xy ÷ (x² + 2y²) on y = x and y = −x). */
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The strain gauge on the airlock door',
 brief: 'A strain gauge on the airlock door gives no reading at its own centre mark, and the crew wants to know whether the readings near it settle on one value.',
 labels: ['limit along first line', 'limit along second line', 'limit exists (1 or 0)'], tolerance: 0.01,
 gl: [['limit along first line'], ['limit along second line'], ['limit exists (1 or 0)']]
}, {
 canonical: { kind: 0, A: 20, B: 1, m1: 1, m2: 3 },
 draw: R => { if (R.int(1, 3) === 1) { const m = R.pick([[1, 2], [1, -1], [2, -1], [1, 3], [-2, 1], [3, -1], [2, 3], [-1, -3]]); return { kind: 1, A: R.int(2, 4), B: 0, m1: m[0], m2: m[1] }; }
  const [A, B, m1, m2] = R.pick(Q13B); return { kind: 0, A, B, m1, m2 }; },
 build: ({ kind, A, B, m1, m2 }) => {
  const f = kind ? `(x³ + ${n(A ** 3)}y³) ÷ (x + ${co(A)}y)` : `${co(A)}x² ÷ (x² + ${co(B)}y²)`;
  const val = m => kind ? 0 : A / (1 + B * m * m), v1 = val(m1), v2 = val(m2), code = kind ? 1 : 0;
  const along = m => kind
   ? `Along ${line(m)}, f = (x³ + ${n(A ** 3)}(${mx(m)})³) ÷ (x + ${co(A)}(${mx(m)})) = ${n(1 + A ** 3 * m ** 3)}x³ ÷ (${mx(1 + A * m)}) = ${n(1 - A * m + A * A * m * m)}x², which approaches 0 as x approaches 0.`
   : `Along ${line(m)}, f = ${co(A)}x² ÷ (x² + ${co(B)}(${mx(m)})²) = ${co(A)}x² ÷ (${n(1 + B * m * m)}x²) = ${n(val(m))} for every x other than 0, so the limit along that line is ${n(val(m))}.`;
  const verdict = kind
   ? `Both lines give 0, but that alone proves nothing. What settles it: x³ + ${n(A ** 3)}y³ = (x + ${co(A)}y)(x² − ${co(A)}xy + ${n(A * A)}y²), so wherever f has a value it equals x² − ${co(A)}xy + ${n(A * A)}y², a formula with no division. Putting (0, 0) into it gives 0 however (x, y) approaches (0, 0), so the limit exists and is 0: enter 1.`
   : `The two lines give different limits, ${n(v1)} and ${n(v2)}, so f has no single limit at (0, 0): enter 0.`;
  return {
  prompt: `A strain gauge on the airlock door is fixed at the door’s centre mark (0, 0). At nearby points (x, y) of the door it reports f(x, y) = ${f}, and it reports nothing where the formula divides by 0, as at the centre mark itself. Find the limit of f as (x, y) approaches (0, 0) along the line ${line(m1)}, then along the line ${line(m2)}. Enter those two limits, then 1 if the limit of f as (x, y) approaches (0, 0) exists, or 0 if it does not.`,
  answer: [v1, v2, code],
  hints: ['On the line y = mx, replace every y by mx and cancel what you can. The limit along that line is the number left over, or 0 if a factor of x is left over.', 'Different limits along two paths prove there is no limit. If the two limits agree, that proves nothing by itself: look at whether f can be rewritten as a plain formula with no division, which you could put (0, 0) into.'],
  solution: `${along(m1)} ${along(m2)} ${verdict}`,
  guidance: [
   { prompt: `Put y = ${mx(m1)} into f(x, y) = ${f}. What is the limit along the line ${line(m1)}?`, answer: [v1], explanation: along(m1) },
   { prompt: `Now put y = ${mx(m2)} into f. What is the limit along the line ${line(m2)}?`, answer: [v2], explanation: along(m2) },
   { prompt: `Along the two lines the limits are ${n(v1)} and ${n(v2)}. Enter 1 if the limit of f at (0, 0) exists, 0 if not.`, answer: [code], explanation: verdict }
  ] }; }
});

/* Axy ÷ (x² + By²) on y = mx is Am ÷ (1 + Bm²): two whole values that differ by 2 or more, so there is never a single limit; the gap is |v1 − v2|. */
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The mast calibration',
 brief: 'A rover is driving up to the signal mast, and the crew needs to know whether its receiver can be calibrated there.',
 labels: ['limit along first line', 'limit along second line', 'gap between the limits'], tolerance: 0.01,
 gl: [['limit along first line'], ['limit along second line'], ['gap between the limits']]
}, {
 canonical: { A: 18, B: 2, m1: 1, m2: 2 },
 draw: R => { const [A, B, m1, m2] = R.pick(Q13C); return { A, B, m1, m2 }; },
 build: ({ A, B, m1, m2 }) => {
  const f = `${co(A)}xy ÷ (x² + ${co(B)}y²)`, val = m => A * m / (1 + B * m * m), v1 = val(m1), v2 = val(m2), gap = Math.abs(v1 - v2);
  const along = m => `Along ${line(m)}, f = ${co(A)}x(${mx(m)}) ÷ (x² + ${co(B)}(${mx(m)})²) = ${n(A * m)}x² ÷ (${n(1 + B * m * m)}x²) = ${n(val(m))} for every x other than 0, so the limit along that line is ${n(val(m))}.`;
  return {
  prompt: `A rover is driving towards the signal mast at the origin (0, 0) of the plain’s grid. Its radio receiver reports a signal strength f(x, y) = ${f} at the point (x, y), and reports nothing where the formula divides by 0. The receiver can be calibrated at the mast only if the reading settles on one value however the rover arrives. Test two arrivals: first along the line ${line(m1)}, then along the line ${line(m2)}. Enter the limit of f along each line, then the gap between the two limits as a positive number, the larger limit minus the smaller.`,
  answer: [v1, v2, gap],
  hints: ['On the line y = mx, replace every y by mx and cancel what you can. The limit along that line is the number left over.', 'The gap is the larger of the two limits minus the smaller one. A gap above 0 means the readings do not settle on one value.'],
  solution: `${along(m1)} ${along(m2)} The larger limit is ${n(Math.max(v1, v2))} and the smaller is ${n(Math.min(v1, v2))}, so the gap is ${n(Math.max(v1, v2))} − ${par(Math.min(v1, v2))} = ${n(gap)}. The two arrivals disagree, so f has no single limit at the mast and the receiver cannot be calibrated there.`,
  guidance: [
   { prompt: `Put y = ${mx(m1)} into f(x, y) = ${f}. What is the limit along the line ${line(m1)}?`, answer: [v1], explanation: along(m1) },
   { prompt: `Now put y = ${mx(m2)} into f. What is the limit along the line ${line(m2)}?`, answer: [v2], explanation: along(m2) },
   { prompt: `The limits are ${n(v1)} and ${n(v2)}. What is the gap, the larger minus the smaller?`, answer: [gap], explanation: `${n(Math.max(v1, v2))} − ${par(Math.min(v1, v2))} = ${n(gap)}.` }
  ] }; }
});

/* kind 0: Axy ÷ (x² + By²) on three lines y = mx gives Am ÷ (1 + Bm²), whole for all three, never all equal: no limit, code 0.
   kind 1: (x² − A²y²) ÷ (x + Ay) + C, which is x − Ay + C wherever it has a value: the limit along every line is C and the limit exists, code 1
   (A ≥ 2, so no integer slope makes x + Ay vanish). For kind 1, B is unused. */
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', title: 'The vent ring test',
 brief: 'A pressure ring around a dome vent has to be tested on three approach lines before the crew can trust its centre reading.',
 labels: ['limit along first line', 'limit along second line', 'limit along third line', 'limit exists (1 or 0)'], tolerance: 0.01,
 gl: [['limit along first line'], ['limit along second line'], ['limit along third line'], ['limit exists (1 or 0)']]
}, {
 canonical: { kind: 0, A: 30, B: 1, m1: 1, m2: 2, m3: -3 },
 draw: R => { if (R.int(1, 3) === 1) { const ms = [R.pick([1, 2, 3]), R.pick([-1, -2, -3])]; do ms[2] = R.pick([1, 2, 3, -1, -2, -3]); while (ms[2] === ms[0] || ms[2] === ms[1]); return { kind: 1, A: R.int(2, 5), B: R.nz(-9, 9), m1: ms[0], m2: ms[1], m3: ms[2] }; }
  const [A, B, m1, m2, m3] = R.pick(Q13D), ms = R.bool() ? [m1, m2, m3] : [m3, m1, m2]; return { kind: 0, A, B, m1: ms[0], m2: ms[1], m3: ms[2] }; },
 build: ({ kind, A, B, m1, m2, m3 }) => {
  const C = B, f = kind ? `(x² − ${n(A * A)}y²) ÷ (x + ${co(A)}y) ${C < 0 ? '−' : '+'} ${n(Math.abs(C))}` : `${co(A)}xy ÷ (x² + ${co(B)}y²)`;
  const val = m => kind ? C : A * m / (1 + B * m * m), vs = [m1, m2, m3].map(val), code = kind ? 1 : 0;
  const along = m => kind
   ? `Along ${line(m)}, f = (x² − ${n(A * A)}(${mx(m)})²) ÷ (x + ${co(A)}(${mx(m)})) ${C < 0 ? '−' : '+'} ${n(Math.abs(C))} = ${n(1 - A * A * m * m)}x² ÷ (${mx(1 + A * m)}) ${C < 0 ? '−' : '+'} ${n(Math.abs(C))} = ${ex([[1 - A * m, 'x'], [C, '']])}, which approaches ${n(C)} as x approaches 0.`
   : `Along ${line(m)}, f = ${co(A)}x(${mx(m)}) ÷ (x² + ${co(B)}(${mx(m)})²) = ${n(A * m)}x² ÷ (${n(1 + B * m * m)}x²) = ${n(val(m))} for every x other than 0, so the limit along that line is ${n(val(m))}.`;
  const verdict = kind
   ? `All three lines give ${n(C)}, but that alone proves nothing. What settles it: x² − ${n(A * A)}y² = (x − ${co(A)}y)(x + ${co(A)}y), so wherever f has a value it equals ${ex([[1, 'x'], [-A, 'y'], [C, '']])}, a formula with no division. Putting (0, 0) into it gives ${n(C)} however (x, y) approaches (0, 0), so the limit exists: enter 1.`
   : `The three lines do not all give the same limit (${n(vs[0])}, ${n(vs[1])} and ${n(vs[2])}), so f has no single limit at (0, 0): enter 0.`;
  return {
  prompt: `A pressure ring around a dome vent reports f(x, y) = ${f} at the point (x, y) of the ring’s grid, whose centre is the origin (0, 0), and it reports nothing where the formula divides by 0. Find the limit of f as (x, y) approaches (0, 0) along each of the three lines ${line(m1)}, ${line(m2)} and ${line(m3)}, in that order. Enter the three limits, then 1 if the limit of f as (x, y) approaches (0, 0) exists, or 0 if it does not.`,
  answer: [...vs, code],
  hints: ['On the line y = mx, replace every y by mx and cancel what you can. The limit along that line is the number left over, or the constant you started with if a factor of x is left over.', 'Different limits along two paths prove there is no limit. If every line gives the same limit, that proves nothing by itself: see whether f can be rewritten as a plain formula with no division, which you could put (0, 0) into.'],
  solution: `${along(m1)} ${along(m2)} ${along(m3)} ${verdict}`,
  guidance: [
   { prompt: `Put y = ${mx(m1)} into f(x, y) = ${f}. What is the limit along the line ${line(m1)}?`, answer: [vs[0]], explanation: along(m1) },
   { prompt: `Now put y = ${mx(m2)} into f. What is the limit along the line ${line(m2)}?`, answer: [vs[1]], explanation: along(m2) },
   { prompt: `Now put y = ${mx(m3)} into f. What is the limit along the line ${line(m3)}?`, answer: [vs[2]], explanation: along(m3) },
   { prompt: `Along the three lines the limits are ${n(vs[0])}, ${n(vs[1])} and ${n(vs[2])}. Enter 1 if the limit of f at (0, 0) exists, 0 if not.`, answer: [code], explanation: verdict }
  ] }; }
});

/* ---- q14 Partial derivatives [4.3] ---- */

/* P = axy² + bx² + ce^(2x − y) at (p, 2p), where 2x − y = 0 and e^(2x − y) = 1: P_x = 4ap² + 2bp + 2c, P_y = 4ap² − c.
   Not the worked example (x²y + 5e^(x − y) at (1, 1)). */
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'Pressure along the duct',
 brief: 'An air duct feeds the greenhouse dome, and the plant crew needs to know how fast the pressure changes along the duct and across it.',
 labels: ['∂P/∂x at the point', '∂P/∂y at the point'], tolerance: 0.01,
 gl: [['2x − y at the point'], ['∂P/∂x'], ['∂P/∂y']]
}, {
 canonical: { a: 2, b: -3, c: 5, p: 2 },
 draw: R => ({ a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-5, 5), p: R.int(1, 4) }),
 build: ({ a, b, c, p }) => { const E = 'e^(2x − y)', hx = 4 * a * p * p + 2 * b * p + 2 * c, hy = 4 * a * p * p - c;
  const f = ex([[a, 'xy²'], [b, 'x²'], [c, E]]), fx = ex([[a, 'y²'], [2 * b, 'x'], [2 * c, E]]), fy = ex([[2 * a, 'xy'], [-c, E]]), P = pt(p, 2 * p); return {
  prompt: `The pressure map of an air duct gives the pressure as P(x, y) = ${f} kilopascals, where x is metres along the duct from its fan and y is metres across it from its left wall. Enter the rate at which the pressure changes along the duct, the partial derivative ∂P/∂x, at the point ${P}. Then enter the rate across the duct, ∂P/∂y, at the same point.`,
  answer: [hx, hy],
  hints: ['For ∂P/∂x, treat y as a fixed number and differentiate with respect to x as in Calculus 1. For ∂P/∂y, hold x fixed instead.', 'By the chain rule, e^(2x − y) differentiates to 2e^(2x − y) with respect to x, and to −e^(2x − y) with respect to y. At the point you are given, 2x − y works out to 0, so e^(2x − y) = e⁰ = 1.'],
  solution: `Holding y fixed, ∂P/∂x = ${fx}. At ${P}, where e^(2x − y) = 1, this is ${sm([a * 4 * p * p, 2 * b * p, 2 * c])} = ${n(hx)}. Holding x fixed, ∂P/∂y = ${fy}. At ${P} this is ${sm([4 * a * p * p, -c])} = ${n(hy)}.`,
  guidance: [
   { prompt: `What is 2x − y at the point ${P}? It is the exponent of e in P.`, answer: [0], explanation: `2 × ${par(p)} − ${par(2 * p)} = 0, and e⁰ = 1.` },
   { prompt: `Hold y fixed and differentiate with respect to x. What is ∂P/∂x at ${P}?`, answer: [hx], explanation: `∂P/∂x = ${fx}: the x in the exponent brings a factor 2. At ${P}: ${sm([a * 4 * p * p, 2 * b * p, 2 * c])} = ${n(hx)}.` },
   { prompt: `Hold x fixed and differentiate with respect to y. What is ∂P/∂y at ${P}?`, answer: [hy], explanation: `∂P/∂y = ${fy}: the y in the exponent brings a factor −1. At ${P}: ${sm([4 * a * p * p, -c])} = ${n(hy)}.` }
  ] }; }
});

/* h = ax²y + by³ + ce^(x + y) at (p, −p), where x + y = 0 and e^(x + y) = 1: h_x = −2ap² + c, h_y = ap² + 3bp² + c; the rate of rise driving due east at v is h_x × v.
   The draw keeps both slopes non-zero. */
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'The rover on the dune',
 brief: 'A rover sets off from a point on a dune, and the crew wants the slope each way and how fast its height changes when it drives east.',
 labels: ['slope going east', 'slope going north', 'rate of height change (m/s)'], tolerance: 0.01,
 gl: [['slope going east'], ['slope going north'], ['rate of height change (m/s)']]
}, {
 canonical: { a: 2, b: 1, c: 3, p: 2, v: 3 },
 draw: R => { let o; do { o = { a: R.nz(-3, 3), b: R.nz(-2, 2), c: R.nz(-5, 5), p: R.int(1, 3), v: R.int(2, 5) }; }
   while (-2 * o.a * o.p * o.p + o.c === 0 || o.a * o.p * o.p + 3 * o.b * o.p * o.p + o.c === 0); return o; },
 build: ({ a, b, c, p, v }) => { const E = 'e^(x + y)', hx = -2 * a * p * p + c, hy = a * p * p + 3 * b * p * p + c, r = hx * v;
  const f = ex([[a, 'x²y'], [b, 'y³'], [c, E]]), fx = ex([[2 * a, 'xy'], [c, E]]), fy = ex([[a, 'x²'], [3 * b, 'y²'], [c, E]]), P = pt(p, -p); return {
  prompt: `The height of a dune is h(x, y) = ${f} metres, where x is metres east and y is metres north of the survey post. A rover sets off from ${P}. Enter the slope going east, the partial derivative ∂h/∂x, at that point, then the slope going north, ∂h/∂y. While the rover drives due east, y stays fixed, so its height changes at the rate (slope going east) × (speed). If it drives due east at ${n(v)} metres per second, enter how fast its height is changing, in metres per second, with a minus sign if it is going downhill.`,
  answer: [hx, hy, r],
  hints: ['For ∂h/∂x, treat y as a fixed number and differentiate with respect to x. For ∂h/∂y, hold x fixed instead. Use the chain rule on the exponential, and note that its exponent works out to 0 at the point you are given, so e⁰ = 1.', 'The rate of change of height going east is the slope going east multiplied by the speed in metres per second.'],
  solution: `Holding y fixed, ∂h/∂x = ${fx}. At ${P}, where e^(x + y) = e⁰ = 1, this is ${sm([-2 * a * p * p, c])} = ${n(hx)}. Holding x fixed, ∂h/∂y = ${fy}, which at ${P} is ${sm([a * p * p, 3 * b * p * p, c])} = ${n(hy)}. Driving due east at ${n(v)} metres per second, the height changes at ${n(hx)} × ${n(v)} = ${n(r)} metres per second.`,
  guidance: [
   { prompt: `Hold y fixed and differentiate with respect to x. What is ∂h/∂x at ${P}?`, answer: [hx], explanation: `∂h/∂x = ${fx}. At ${P}, where x + y = 0 and e^(x + y) = 1: ${sm([-2 * a * p * p, c])} = ${n(hx)}.` },
   { prompt: `Hold x fixed and differentiate with respect to y. What is ∂h/∂y at ${P}?`, answer: [hy], explanation: `∂h/∂y = ${fy}. At ${P}: ${sm([a * p * p, 3 * b * p * p, c])} = ${n(hy)}.` },
   { prompt: `The slope going east is ${n(hx)} and the speed is ${n(v)} metres per second. What is the rate of change of height, slope × speed?`, answer: [r], explanation: `${par(hx)} × ${n(v)} = ${n(r)} metres per second.` }
  ] }; }
});

/* h = ax²y × e^(x − y) at (p, p), where e^(x − y) = 1: level c = ap³, h_x = a(2p² + p³), h_y = a(p² − p³), by the product rule.
   p is not 1 or −2, so neither slope is 0. Uses q12 (the level of the contour line through a point). */
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q12', title: 'The dune ridge marker',
 brief: 'A survey marker stands on a dune ridge, and the lab wants the contour line it sits on and the slope of the ground east and north of it.',
 labels: ['contour level c (m)', '∂h/∂x at the marker', '∂h/∂y at the marker'], tolerance: 0.01,
 gl: [['contour level c (m)'], ['∂h/∂x'], ['∂h/∂y']]
}, {
 canonical: { a: 2, p: 2 },
 draw: R => ({ a: R.nz(-5, 5), p: R.pick([-3, -1, 2, 3, 4]) }),
 build: ({ a, p }) => { const cf = k => k === 1 ? '' : k === -1 ? '−' : n(k), c = a * p ** 3, hx = a * (2 * p * p + p ** 3), hy = a * (p * p - p ** 3), P = pt(p, p), f = `${co(a)}x²y × e^(x − y)`; return {
  prompt: `The Terrain Lab models a dune ridge as h(x, y) = ${f} metres above or below the survey line, where x is metres east and y is metres north of the lab. A marker stands at ${P}. Enter the height of the ground at the marker, which is the level c of the contour line through it. Then enter the slope going east, ∂h/∂x, and the slope going north, ∂h/∂y, at the marker.`,
  answer: [c, hx, hy],
  hints: ['Put the marker’s x and y into h(x, y) for the level c. At the marker the exponent x − y works out to 0, so e^(x − y) = e⁰ = 1.', 'Each partial derivative needs the product rule: hold the other letter fixed, and differentiate x²y × e^(x − y) as the product of the factor x²y and the factor e^(x − y). Then put the marker’s coordinates in.'],
  solution: `At ${P}, x − y = 0 and e^(x − y) = 1, so h${P} = ${n(a)} × ${par(p)}² × ${par(p)} = ${n(c)}: the marker is on the contour line h(x, y) = ${n(c)}. By the product rule, ∂h/∂x = ${cf(a)}(2xy + x²y)e^(x − y), which at ${P} is ${cf(a)}(${n(2 * p * p)} + ${par(p ** 3)}) = ${n(hx)}. Also ∂h/∂y = ${cf(a)}(x² − x²y)e^(x − y), which at ${P} is ${cf(a)}(${n(p * p)} − ${par(p ** 3)}) = ${n(hy)}.`,
  guidance: [
   { prompt: `What is h${P}, the height at the marker? Here e^(x − y) = e⁰ = 1.`, answer: [c], explanation: `h${P} = ${n(a)} × ${par(p)}² × ${par(p)} × 1 = ${n(c)} m. The marker’s contour line is h(x, y) = ${n(c)}.` },
   { prompt: `Hold y fixed and use the product rule on x²y and e^(x − y). Then ∂h/∂x = ${cf(a)}(2xy + x²y)e^(x − y). What is it at ${P}?`, answer: [hx], explanation: `At ${P}: 2xy = ${n(2 * p * p)}, x²y = ${n(p ** 3)} and e⁰ = 1, so ∂h/∂x = ${n(a)} × (${n(2 * p * p)} + ${par(p ** 3)}) = ${n(hx)}.` },
   { prompt: `Hold x fixed and use the product rule: the y in the exponent gives a factor −1. Then ∂h/∂y = ${cf(a)}(x² − x²y)e^(x − y). What is it at ${P}?`, answer: [hy], explanation: `At ${P}: x² = ${n(p * p)}, x²y = ${n(p ** 3)} and e⁰ = 1, so ∂h/∂y = ${n(a)} × (${n(p * p)} − ${par(p ** 3)}) = ${n(hy)}.` }
  ] }; }
});

/* ---- q15 Second and mixed partial derivatives [4.3] ---- */

/* P = ax³y + bxy³ + cx²y²: P_xx = 6axy + 2cy², P_yy = 6bxy + 2cx², P_xy = 3ax² + 3by² + 4cxy.
   Not the worked example (x³y + y² at (2, 1)). */
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'Pressure on the roof panel',
 brief: 'The dome crew wants to know how sharply the pressure on a roof panel bends from point to point before they choose its bracing.',
 labels: ['P_xx', 'P_yy', 'P_xy'], tolerance: 0.01,
 gl: [['P_xx'], ['P_yy'], ['P_xy']]
}, {
 canonical: { a: 2, b: -1, c: 3, x: 1, y: 2 },
 draw: R => { let o; do { o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3) }; }
   while ([6 * o.a * o.x * o.y + 2 * o.c * o.y * o.y, 6 * o.b * o.x * o.y + 2 * o.c * o.x * o.x, 3 * o.a * o.x * o.x + 3 * o.b * o.y * o.y + 4 * o.c * o.x * o.y].includes(0)); return o; },
 build: ({ a, b, c, x, y }) => { const xx = 6 * a * x * y + 2 * c * y * y, yy = 6 * b * x * y + 2 * c * x * x, xy = 3 * a * x * x + 3 * b * y * y + 4 * c * x * y, pnt = pt(x, y);
  const f = ex([[a, 'x³y'], [b, 'xy³'], [c, 'x²y²']]), Px = ex([[3 * a, 'x²y'], [b, 'y³'], [2 * c, 'xy²']]), Py = ex([[a, 'x³'], [3 * b, 'xy²'], [2 * c, 'x²y']]);
  const Pxx = ex([[6 * a, 'xy'], [2 * c, 'y²']]), Pyy = ex([[6 * b, 'xy'], [2 * c, 'x²']]), Pxy = ex([[3 * a, 'x²'], [3 * b, 'y²'], [4 * c, 'xy']]); return {
  prompt: `The pressure on a dome roof panel is P(x, y) = ${f} kilopascals at the panel point (x, y), in metres. How sharply the pressure bends from point to point tells the crew how much bracing the panel needs. Enter the second partial derivatives P_xx and P_yy at the point ${pnt}, then the mixed partial derivative P_xy there.`,
  answer: [xx, yy, xy],
  hints: ['Find the first partial derivatives P_x and P_y first. Differentiate P_x with respect to x for P_xx, and P_y with respect to y for P_yy.', 'For the mixed partial P_xy, differentiate P_x with respect to y. Put the point in only after differentiating twice.'],
  solution: `The first partial derivatives are P_x = ${Px} and P_y = ${Py}. Then P_xx = ${Pxx}, which at ${pnt} is ${sm([6 * a * x * y, 2 * c * y * y])} = ${n(xx)}; P_yy = ${Pyy}, which is ${sm([6 * b * x * y, 2 * c * x * x])} = ${n(yy)}; and P_xy = ${Pxy}, which is ${sm([3 * a * x * x, 3 * b * y * y, 4 * c * x * y])} = ${n(xy)}. Differentiating P_y with respect to x gives the same ${Pxy}.`,
  guidance: [
   { prompt: `P_x = ${Px}. Differentiate it with respect to x. What is P_xx at ${pnt}?`, answer: [xx], explanation: `P_xx = ${Pxx}. At ${pnt}: ${sm([6 * a * x * y, 2 * c * y * y])} = ${n(xx)}.` },
   { prompt: `P_y = ${Py}. Differentiate it with respect to y. What is P_yy at ${pnt}?`, answer: [yy], explanation: `P_yy = ${Pyy}. At ${pnt}: ${sm([6 * b * x * y, 2 * c * x * x])} = ${n(yy)}.` },
   { prompt: `Differentiate P_x = ${Px} with respect to y. What is P_xy at ${pnt}?`, answer: [xy], explanation: `P_xy = ${Pxy}. At ${pnt}: ${sm([3 * a * x * x, 3 * b * y * y, 4 * c * x * y])} = ${n(xy)}. Starting from P_y and differentiating with respect to x gives the same.` }
  ] }; }
});

/* h = ax²y² + bx³ + cy³: h_x = 2axy² + 3bx², h_xx = 2ay² + 6bx; the east slope changes by h_xx × d over d metres east (a steady rate, stated in the prompt). */
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The changing slope',
 brief: 'A rover on a ridge wants to know how steep the ground is going east, and how much that slope will have changed after a short drive east.',
 labels: ['h_x', 'h_xx', 'change in slope'], tolerance: 0.01,
 gl: [['h_x'], ['h_xx'], ['change in slope']]
}, {
 canonical: { a: 1, b: -2, c: 3, x: 2, y: 1, d: 3 },
 draw: R => { let o; do { o = { a: R.nz(-2, 2), b: R.nz(-2, 2), c: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3), d: R.int(2, 5) }; }
   while (2 * o.a * o.x * o.y * o.y + 3 * o.b * o.x * o.x === 0 || 2 * o.a * o.y * o.y + 6 * o.b * o.x === 0); return o; },
 build: ({ a, b, c, x, y, d }) => { const hx = 2 * a * x * y * y + 3 * b * x * x, hxx = 2 * a * y * y + 6 * b * x, ch = hxx * d, pnt = pt(x, y);
  const f = ex([[a, 'x²y²'], [b, 'x³'], [c, 'y³']]), Hx = ex([[2 * a, 'xy²'], [3 * b, 'x²']]), Hxx = ex([[2 * a, 'y²'], [6 * b, 'x']]); return {
  prompt: `A ridge has height h(x, y) = ${f} metres, where x is metres east and y is metres north of the base camp. A rover stands at ${pnt}. Enter the slope going east, h_x, at that point. Then enter h_xx there, which is how fast the east slope changes per metre going east. Then enter by how much the east slope will have changed after the rover drives ${n(d)} metres due east, assuming the slope keeps changing at that same steady rate over the drive.`,
  answer: [hx, hxx, ch],
  hints: ['Differentiate with respect to x to get h_x, treating y as a fixed number, then differentiate h_x with respect to x again to get h_xx. Put the point in at the end.', 'If the slope changes by h_xx every metre east, the change over a drive is h_xx multiplied by the number of metres driven.'],
  solution: `The first partial derivative is h_x = ${Hx}, which at ${pnt} is ${sm([2 * a * x * y * y, 3 * b * x * x])} = ${n(hx)}. Then h_xx = ${Hxx}, which at ${pnt} is ${sm([2 * a * y * y, 6 * b * x])} = ${n(hxx)} per metre east. Over ${n(d)} metres due east at that steady rate the slope changes by ${par(hxx)} × ${n(d)} = ${n(ch)}.`,
  guidance: [
   { prompt: `Hold y fixed and differentiate h with respect to x. What is h_x at ${pnt}?`, answer: [hx], explanation: `h_x = ${Hx}. At ${pnt}: ${sm([2 * a * x * y * y, 3 * b * x * x])} = ${n(hx)}.` },
   { prompt: `h_x = ${Hx}. Differentiate it with respect to x again. What is h_xx at ${pnt}?`, answer: [hxx], explanation: `h_xx = ${Hxx}. At ${pnt}: ${sm([2 * a * y * y, 6 * b * x])} = ${n(hxx)}.` },
   { prompt: `The east slope changes by ${n(hxx)} per metre east. By how much does it change over ${n(d)} metres due east?`, answer: [ch], explanation: `${par(hxx)} × ${n(d)} = ${n(ch)}.` }
  ] }; }
});

/* G = ax³y² + be^(2x − y) at (p, 2p), where 2x − y = 0 and e^(2x − y) = 1:
   G_x = 12ap⁴ + 2b, G_xx = 24ap³ + 4b, G_yy = 2ap³ + b, G_xy = 12ap³ − 2b. The draw keeps all four non-zero. Uses q14 (first partial derivatives). */
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q14', title: 'The gust model',
 brief: 'The weather mast models gusts with an exponential term, and the crew wants the slope and every second-order bend of the model at one point.',
 labels: ['G_x', 'G_xx', 'G_yy', 'G_xy'], tolerance: 0.01,
 gl: [['G_x'], ['G_xx'], ['G_yy'], ['G_xy']]
}, {
 canonical: { a: 2, b: -3, p: 1 },
 draw: R => { let o; do { o = { a: R.nz(-3, 3), b: R.nz(-4, 4), p: R.int(1, 2) }; }
   while ([12 * o.a * o.p ** 4 + 2 * o.b, 24 * o.a * o.p ** 3 + 4 * o.b, 2 * o.a * o.p ** 3 + o.b, 12 * o.a * o.p ** 3 - 2 * o.b].includes(0)); return o; },
 build: ({ a, b, p }) => { const E = 'e^(2x − y)', Gx = 12 * a * p ** 4 + 2 * b, Gxx = 24 * a * p ** 3 + 4 * b, Gyy = 2 * a * p ** 3 + b, Gxy = 12 * a * p ** 3 - 2 * b, P = pt(p, 2 * p);
  const f = ex([[a, 'x³y²'], [b, E]]), sx = ex([[3 * a, 'x²y²'], [2 * b, E]]), sy = ex([[2 * a, 'x³y'], [-b, E]]);
  const sxx = ex([[6 * a, 'xy²'], [4 * b, E]]), syy = ex([[2 * a, 'x³'], [b, E]]), sxy = ex([[6 * a, 'x²y'], [-2 * b, E]]); return {
  prompt: `The weather mast models the strength of the gusts over the plain as G(x, y) = ${f}, where x is metres east and y is metres north of the mast. Enter the first partial derivative G_x at the point ${P}. Then enter the second partial derivatives G_xx and G_yy there, then the mixed partial derivative G_xy.`,
  answer: [Gx, Gxx, Gyy, Gxy],
  hints: ['Find G_x and G_y first. By the chain rule the exponential gives a factor 2 for each x in its exponent and a factor −1 for each y, every time you differentiate. At the point you are given, the exponent 2x − y works out to 0, so e^(2x − y) = 1.', 'Differentiate G_x with respect to x for G_xx, and G_y with respect to y for G_yy. For the mixed partial G_xy, differentiate G_x with respect to y. Put the point in only at the end.'],
  solution: `The first partial derivatives are G_x = ${sx} and G_y = ${sy}. At ${P}, where e^(2x − y) = 1, G_x = ${sm([3 * a * p * p * 4 * p * p, 2 * b])} = ${n(Gx)}. Then G_xx = ${sxx}, which is ${sm([6 * a * p * 4 * p * p, 4 * b])} = ${n(Gxx)}; G_yy = ${syy}, which is ${sm([2 * a * p ** 3, b])} = ${n(Gyy)}; and G_xy = ${sxy}, which is ${sm([6 * a * p * p * 2 * p, -2 * b])} = ${n(Gxy)}.`,
  guidance: [
   { prompt: `Hold y fixed and differentiate with respect to x. What is G_x = ${sx} at ${P}?`, answer: [Gx], explanation: `At ${P}, e^(2x − y) = e⁰ = 1, so G_x = ${sm([3 * a * p * p * 4 * p * p, 2 * b])} = ${n(Gx)}.` },
   { prompt: `Differentiate G_x = ${sx} with respect to x. What is G_xx at ${P}?`, answer: [Gxx], explanation: `G_xx = ${sxx}. At ${P}: ${sm([6 * a * p * 4 * p * p, 4 * b])} = ${n(Gxx)}.` },
   { prompt: `G_y = ${sy}. Differentiate it with respect to y. What is G_yy at ${P}?`, answer: [Gyy], explanation: `G_yy = ${syy}. At ${P}: ${sm([2 * a * p ** 3, b])} = ${n(Gyy)}.` },
   { prompt: `Differentiate G_x = ${sx} with respect to y. What is G_xy at ${P}?`, answer: [Gxy], explanation: `G_xy = ${sxy}. At ${P}: ${sm([6 * a * p * p * 2 * p, -2 * b])} = ${n(Gxy)}. Starting from G_y and differentiating with respect to x gives the same.` }
  ] }; }
});

})();
