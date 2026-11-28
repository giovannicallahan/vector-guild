/* Differential equations practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p2.js. */
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
/* Rounding to dp places (halves away from 0), and a test for a value that lands on a rounding tie. */
const rd = (x, dp) => { const f = Math.pow(10, dp); return Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9) / f; };
const tie = (x, dp) => { const s = Math.abs(x) * Math.pow(10, dp), r = s - Math.floor(s); return Math.abs(r - 0.5) < 1e-6; };
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
const sgn = v => v < 0 ? '−' : '+';
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const cf = v => v === 1 ? '' : n(v);
const co = (v, x) => `${v === 1 ? '' : v === -1 ? '−' : n(v)}${x}`;
const ex = v => `e^(${n(v)})`;
const ext = v => v === 1 ? 'e^t' : `e^(${co(v, 't')})`;
const dec = (x, dp) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-7;
const pn = v => v > 0 ? 'positive' : 'negative';
/* A factor (y − r), or (r − y) when flipped; a zero root is a bare y. */
const fy = (r, flip) => r === 0 ? 'y' : flip ? `(${n(r)} − y)` : `(y ${cst(-r)})`;
const pl = (x, unit) => `${n(x)} ${unit}${x === 1 ? '' : 's'}`;
const pt = (v, x) => v < 0 ? `(${co(v, x)})` : co(v, x);
const kp = k => k === 1 ? '' : k === -1 ? '−' : n(k);

/* ---- q06 Separable equations [1.3] ---- */

/* y′ = k·t·y: dy ÷ y = k t dt, so y = y0·e^(k t² ÷ 2). Not the parent's worked example (y′ = 2y). */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The ramping lamp',
 brief: 'A grow-lamp on a seedling tray changes its output as it warms up, and the log needs the algae mat’s mass at the end of the run.',
 labels: ['y at the later time (g)'], tolerance: 0.0005,
 gl: [['exponent'], ['y at the later time (g)']]
}, {
 canonical: { k: 0.2, y0: 6, T: 3 },
 draw: R => retry(() => ({ k: R.pick([-0.4, -0.2, 0.1, 0.2, 0.3, 0.4, 0.5]), y0: R.int(2, 20), T: R.int(2, 4) }),
  p => { const v = p.y0 * Math.exp(p.k * p.T * p.T / 2); return !tie(v, 3) && v > 0.5 && v < 900; }, { k: 0.2, y0: 6, T: 3 }),
 build: ({ k, y0, T }) => { const e = rd(k * T * T / 2, 4), Y = rd(y0 * Math.exp(k * T * T / 2), 3), h = rd(k / 2, 4); return {
  prompt: `The algae mat on a seedling tray changes at a rate that depends on the time since the grow-lamp was switched on. The mass y of the mat, in grams, obeys the differential equation y′ = ${co(k, 'ty')}, where t is the time in hours, and y(0) = ${n(y0)}. Solve it by separating the variables (the integral of t dt is t² ÷ 2) and enter y at t = ${n(T)} to 3 decimal places.`,
  answer: [Y],
  hints: ['Write y′ as dy ÷ dt, divide by y and multiply by dt so that y is only on the left and t only on the right. Integrate both sides and add one constant.', 'The integral of t dt is t² ÷ 2, not t². Use y(0) to find the constant before you put in the later time. Round only the final value.'],
  solution: `Separate: dy ÷ y = ${n(k)}t dt. Integrating both sides gives ln y = ${n(h)}t² + c, so y = Ae^(${n(h)}t²) with A = e^c. At t = 0 this is A, so A = ${n(y0)}. At t = ${n(T)} the exponent is ${n(h)} × ${n(T)}² = ${n(e)}, so y(${n(T)}) = ${n(y0)}${ex(e)} = ${n(Y)} grams to 3 decimal places.`,
  guidance: [
   { prompt: `Separating gives dy ÷ y = ${n(k)}t dt, so ln y = ${n(h)}t² + c and y = ${n(y0)}e^(${n(h)}t²). What is the exponent ${n(h)} × ${n(T)}² at t = ${n(T)}?`, answer: [e], explanation: `${n(h)} × ${n(T * T)} = ${n(e)}, so y(${n(T)}) = ${n(y0)}${ex(e)}.` },
   { prompt: `What is y(${n(T)}) = ${n(y0)}${ex(e)} in grams, to 3 decimal places?`, answer: [Y], explanation: `${n(y0)}${ex(e)} = ${n(Y)} grams.` }
  ] }; }
});

/* y′ = k·y with y(0) = y0 (thousand cells): y = y0·e^(kt); reaches m times the start at t = ln m ÷ k. Not the parent's (k 0.3, y0 5, T 4). */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The culture trays',
 brief: 'A bacterial culture is spreading across a seedling tray, and the log needs its size at the end of the shift and the time it takes to multiply.',
 labels: ['cells after the time (thousand)', 'time to multiply (hours)'], tolerance: 0.005,
 gl: [['exponent'], ['cells after the time (thousand)'], ['time to multiply (hours)']]
}, {
 canonical: { k: 0.25, y0: 8, T: 6, m: 3 },
 draw: R => retry(() => ({ k: R.pick([0.15, 0.2, 0.25, 0.35, 0.4, 0.45]), y0: R.int(2, 30), T: R.int(2, 8), m: R.int(2, 6) }),
  p => { const Y = p.y0 * Math.exp(p.k * p.T); return !tie(Y, 2) && !tie(Math.log(p.m) / p.k, 2) && Y < 900 && !(p.k === 0.3); }, { k: 0.25, y0: 8, T: 6, m: 3 }),
 build: ({ k, y0, T, m }) => { const kT = rd(k * T, 4), Y = rd(y0 * Math.exp(k * T), 2), t = rd(Math.log(m) / k, 2); return {
  prompt: `A bacterial culture on a seedling tray holds ${n(y0)} thousand cells when the tray is seeded. From then on it adds new cells, every hour, at a rate equal to ${n(k)} times the number of thousands of cells present. Let y be the thousands of cells and t the hours since seeding. Write this as a differential equation and solve it by separating the variables. Enter the number of thousands of cells after ${n(T)} hours, to 2 decimal places. Then enter the time, in hours to 2 decimal places, when the culture first reaches ${n(m)} times its starting size.`,
  answer: [Y, t],
  hints: ['A rate equal to a number times y means y′ = ky. Separate the variables, integrate both sides and use y(0) for the constant.', 'To find when the culture is a given number of times its start, set y equal to that multiple of y(0), divide through and take the natural logarithm of both sides. Round only the final values.'],
  solution: `Growing at ${n(k)} times its size gives y′ = ${n(k)}y. Separating, dy ÷ y = ${n(k)} dt, so ln y = ${n(k)}t + c and y = Ae^(${n(k)}t) with A = ${n(y0)}. At t = ${n(T)}, y = ${n(y0)}${ex(kT)} = ${n(Y)} thousand cells to 2 decimal places. The culture reaches ${n(m)} times its start when e^(${n(k)}t) = ${n(m)}, so t = ln ${n(m)} ÷ ${n(k)} = ${n(t)} hours to 2 decimal places.`,
  guidance: [
   { prompt: `The growth is y′ = ${n(k)}y, which separates to dy ÷ y = ${n(k)} dt, so y = ${n(y0)}e^(${n(k)}t). What is the exponent ${n(k)} × ${n(T)} at t = ${n(T)}?`, answer: [kT], explanation: `${n(k)} × ${n(T)} = ${n(kT)}, so y(${n(T)}) = ${n(y0)}${ex(kT)}.` },
   { prompt: `What is y(${n(T)}) = ${n(y0)}${ex(kT)} in thousands of cells, to 2 decimal places?`, answer: [Y], explanation: `${n(y0)}${ex(kT)} = ${n(Y)} thousand cells.` },
   { prompt: `The culture reaches ${n(m)} times its start when ${n(y0)}e^(${n(k)}t) = ${n(m * y0)}, that is e^(${n(k)}t) = ${n(m)}. What is t in hours, to 2 decimal places?`, answer: [t], explanation: `t = ln ${n(m)} ÷ ${n(k)} = ${n(t)} hours.` }
  ] }; }
});

/* y′ = (a + b t)·y: dy ÷ y = (a + b t) dt, exponent a·T + b·T² ÷ 2. Uses q03 (integrating a function of t). */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q03', title: 'The misting ramp',
 brief: 'A misting line in the seedling bay speeds up as it runs, and the controller needs the film of water it has built up by the end of the cycle.',
 labels: ['exponent', 'film at the later time (mL)'], tolerance: 0.0005,
 gl: [['exponent'], ['film at the later time (mL)']]
}, {
 canonical: { a: 0.2, b: 0.1, y0: 4, T: 5 },
 draw: R => retry(() => ({ a: R.pick([-0.5, -0.3, -0.2, 0.1, 0.2, 0.3, 0.4]), b: R.pick([-0.2, -0.1, 0.1, 0.2, 0.4]), y0: R.int(2, 20), T: R.int(2, 5) }),
  p => { const e = p.a * p.T + p.b * p.T * p.T / 2, v = p.y0 * Math.exp(e); return Math.abs(e) <= 4 && Math.abs(e) > 0.2 && !tie(v, 3) && v < 900 && v > 0.5 && dec(e, 4); }, { a: 0.2, b: 0.1, y0: 4, T: 5 }),
 build: ({ a, b, y0, T }) => { const e = rd(a * T + b * T * T / 2, 4), Y = rd(y0 * Math.exp(a * T + b * T * T / 2), 3), h = rd(b / 2, 4), g = `${n(a)} ${sgn(b)} ${cf(Math.abs(b))}t`, w = `${n(a)}t ${sgn(b)} ${n(Math.abs(h))}t²`; return {
  prompt: `In the seedling bay a misting line deposits a film of water on a tray, and the film changes at a rate that itself changes with time. The film y, in millilitres, obeys y′ = (${g})y, where t is the time in minutes, and y(0) = ${n(y0)}. Solve it by separating the variables. Enter the exponent of e in y(${n(T)}) = ${n(y0)}e^(exponent) first, then y(${n(T)}) to 3 decimal places.`,
  answer: [e, Y],
  hints: ['Separate the variables: dy ÷ y on the left, the bracket times dt on the right. Integrate the bracket term by term; the integral of t dt is t² ÷ 2.', 'The constant of integration becomes the factor in front of the exponential, and y(0) fixes it. Put in the later time and round only at the end.'],
  solution: `Separate: dy ÷ y = (${g}) dt. Integrating both sides gives ln y = ${w} + c, so y = Ae^(${w}) with A = e^c. At t = 0 this is A, so A = ${n(y0)}. At t = ${n(T)} the exponent is ${n(a)} × ${n(T)} ${sgn(h)} ${n(Math.abs(h))} × ${n(T)}² = ${n(e)}, so y(${n(T)}) = ${n(y0)}${ex(e)} = ${n(Y)} millilitres to 3 decimal places.`,
  guidance: [
   { prompt: `Separating gives dy ÷ y = (${g}) dt, so ln y = ${w} + c and y = ${n(y0)}e^(${w}). What is the exponent ${w} at t = ${n(T)}?`, answer: [e], explanation: `${n(a)} × ${n(T)} ${sgn(h)} ${n(Math.abs(h))} × ${n(T * T)} = ${n(e)}.` },
   { prompt: `What is y(${n(T)}) = ${n(y0)}${ex(e)} in millilitres, to 3 decimal places?`, answer: [Y], explanation: `${n(y0)}${ex(e)} = ${n(Y)} millilitres.` }
  ] }; }
});

/* ---- q07 Linear first-order equations and the integrating factor [1.4] ---- */

/* y′ = k(S − y), which is y′ + ky = kS: integrating factor e^(kt), y = S + (y0 − S)e^(−kt). Not the parent's form. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The pipe heater',
 brief: 'A heater is bringing a coolant pipe up towards its working temperature, and the controller needs the pipe’s temperature at a set time.',
 labels: ['r', 'temperature at the later time (degrees)'], tolerance: 0.0005,
 gl: [['r'], ['D'], ['temperature at the later time (degrees)']]
}, {
 canonical: { k: 0.4, S: 60, y0: 15, T: 3 },
 draw: R => retry(() => ({ k: R.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.8, 1.5, 2]), S: R.int(20, 80), y0: R.int(0, 70), T: R.int(1, 5) }),
  p => { const Y = p.S + (p.y0 - p.S) * Math.exp(-p.k * p.T), kT = p.k * p.T; return Math.abs(p.y0 - p.S) >= 5 && kT >= 0.4 && kT <= 4 && dec(p.k * p.S, 4) && !tie(Y, 3); }, { k: 0.4, S: 60, y0: 15, T: 3 }),
 build: ({ k, S, y0, T }) => { const g = rd(k * S, 4), D = y0 - S, Y = rd(S + D * Math.exp(-k * T), 3), kT = rd(k * T, 4), form = `${n(S)} ${sgn(D)} ${cf(Math.abs(D))}${ext(-k)}`; return {
  prompt: `A heater warms a coolant pipe. The temperature y of the pipe, in degrees above the room, obeys y′ = ${n(k)}(${n(S)} − y), where t is the time in minutes, and y(0) = ${n(y0)}. Multiply out the bracket and move the y term to the left, so that the equation reads y′ + py = g. Write the integrating factor as e^(rt) and enter r. Then solve the equation and enter y(${n(T)}) to 3 decimal places.`,
  answer: [k, Y],
  hints: ['Multiply out the bracket, then move the term in y to the left side so the equation reads y′ + py = g. The integrating factor is then e^(pt).', 'Multiplying by the integrating factor turns the left side into the derivative of e^(pt)y. Integrate both sides, divide by e^(pt), and use y(0) to find the constant.'],
  solution: `Multiplying out, y′ = ${n(g)} − ${co(k, 'y')}, so y′ + ${co(k, 'y')} = ${n(g)} and the integrating factor is ${ext(k)}: r = ${n(k)}. Then (${ext(k)}y)′ = ${n(g)}${ext(k)}, and integrating gives ${ext(k)}y = ${n(g)} ÷ ${n(k)} × ${ext(k)} + D, so y = ${n(S)} + D${ext(-k)}. At t = 0, y = ${n(S)} + D = ${n(y0)}, so D = ${n(D)} and y = ${form}. Then y(${n(T)}) = ${n(S)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-kT)} = ${pl(Y, 'degree')} to 3 decimal places.`,
  guidance: [
   { prompt: `Multiplying out gives y′ = ${n(g)} − ${co(k, 'y')}, so y′ + py = ${n(g)}. What is p, the r of the integrating factor e^(rt)?`, answer: [k], explanation: `y′ + ${co(k, 'y')} = ${n(g)}, so p = ${n(k)} and the integrating factor is ${ext(k)}.` },
   { prompt: `Multiplying by ${ext(k)} and integrating gives y = ${n(S)} + D${ext(-k)}. Use y(0) = ${n(y0)} to find D.`, answer: [D], explanation: `${n(S)} + D = ${n(y0)} gives D = ${n(D)}, so y = ${form}.` },
   { prompt: `What is y(${n(T)}) = ${n(S)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-kT)} in degrees, to 3 decimal places?`, answer: [Y], explanation: `${n(S)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-kT)} = ${n(Y)} degrees.` }
  ] }; }
});

/* y′ = B − p·y with B = p·K: settles at K, y = K + (y0 − K)e^(−pt), reaches L (y0 < L < K) at t = ln((K − y0) ÷ (K − L)) ÷ p. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The buffer tank',
 brief: 'A buffer tank is heated while it leaks heat to its surroundings, and the controller must know where it will settle and when it reaches the working temperature.',
 labels: ['long-run temperature (degrees)', 'temperature at the later time (degrees)', 'time to reach the target (minutes)'], tolerance: 0.005,
 gl: [['long-run temperature (degrees)'], ['temperature at the later time (degrees)'], ['time to reach the target (minutes)']]
}, {
 canonical: { p: 0.25, K: 40, y0: 10, L: 25, T: 6 },
 draw: R => retry(() => { const K = R.int(20, 80), y0 = R.int(0, K - 12); return { p: R.pick([0.2, 0.25, 0.4, 0.5]), K, y0, L: R.int(y0 + 3, K - 3), T: R.int(2, 10) }; },
  p => { const Y = p.K + (p.y0 - p.K) * Math.exp(-p.p * p.T), t = Math.log((p.K - p.y0) / (p.K - p.L)) / p.p; return p.L > p.y0 && p.L < p.K && dec(p.p * p.K, 4) && !tie(Y, 2) && !tie(t, 2); }, { p: 0.25, K: 40, y0: 10, L: 25, T: 6 }),
 build: ({ p, K, y0, L, T }) => { const B = rd(p * K, 4), D = y0 - K, pT = rd(p * T, 4), Y = rd(K + D * Math.exp(-p * T), 2), t = rd(Math.log((K - y0) / (K - L)) / p, 2), form = `${n(K)} ${sgn(D)} ${cf(Math.abs(D))}${ext(-p)}`; return {
  prompt: `A buffer tank in the coolant loop is warmed by a heater element that adds ${pl(B, 'degree')} per minute to the liquid. The tank also loses heat to its surroundings at a rate of ${n(p)} times its temperature y per minute, where y is in degrees above the room. The tank starts at ${pl(y0, 'degree')} above the room. Take the heating and the loss as continuous, with t in minutes, and the rate of change of y as the heating minus the loss. Enter the temperature the tank settles towards in the long run. Then enter its temperature at t = ${n(T)} minutes, and the time in minutes when it first reaches ${pl(L, 'degree')}, both to 2 decimal places.`,
  answer: [K, Y, t],
  hints: ['The rate of change of y is the heating minus the loss, which gives a linear equation y′ + py = g. In the long run y stops changing, so y′ is 0.', 'Solve with the integrating factor e^(pt) and the starting temperature. To find a time, set the solution equal to the target, isolate the exponential and take a natural logarithm. Round only the final values.'],
  solution: `The heating adds ${n(B)} and the loss takes away ${n(p)}y, so y′ = ${n(B)} − ${n(p)}y, that is y′ + ${n(p)}y = ${n(B)}. With the integrating factor ${ext(p)} the solution is y = ${n(B)} ÷ ${n(p)} + C${ext(-p)} = ${n(K)} + C${ext(-p)}, so the long-run temperature is ${pl(K, 'degree')}. At t = 0, y = ${n(y0)}, so C = ${n(D)} and y = ${form}. At t = ${n(T)}, y = ${n(K)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-pT)} = ${pl(Y, 'degree')} to 2 decimal places. Setting ${form} = ${n(L)} gives ${cf(Math.abs(D))}${ext(-p)} = ${n(K - L)}, so e^(${co(p, 't')}) = ${n(K - y0)} ÷ ${n(K - L)} and t = ln(${n(K - y0)} ÷ ${n(K - L)}) ÷ ${n(p)} = ${pl(t, 'minute')} to 2 decimal places.`,
  guidance: [
   { prompt: `The tank changes at the heating minus the loss, so y′ = ${n(B)} − ${n(p)}y. In the long run y stops changing, so y′ = 0. What value of y is that?`, answer: [K], explanation: `${n(B)} − ${n(p)}y = 0 gives y = ${n(B)} ÷ ${n(p)} = ${pl(K, 'degree')}.` },
   { prompt: `The solution is y = ${n(K)} + (${n(y0)} − ${n(K)})${ext(-p)} = ${form}. What is y at t = ${n(T)}, in degrees to 2 decimal places?`, answer: [Y], explanation: `${n(K)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-pT)} = ${pl(Y, 'degree')}.` },
   { prompt: `Set ${form} = ${n(L)}. Then ${cf(Math.abs(D))}${ext(-p)} = ${n(K - L)}, so e^(${co(p, 't')}) = ${n(K - y0)} ÷ ${n(K - L)}. What is t in minutes, to 2 decimal places?`, answer: [t], explanation: `t = ln(${n(K - y0)} ÷ ${n(K - L)}) ÷ ${n(p)} = ${pl(t, 'minute')}.` }
  ] }; }
});

/* y′ + p·y = B + C·t: y = m·t + c + D·e^(−pt) with m = C ÷ p, c = B ÷ p − C ÷ p², D = y0 − c. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', title: 'The ramped heater',
 brief: 'The controller on a coolant line ramps its heater up steadily, and the line’s temperature has to be predicted after the start-up has settled.',
 labels: ['m (degrees per minute)', 'temperature at the later time (degrees)'], tolerance: 0.0005,
 gl: [['m'], ['c'], ['temperature at the later time (degrees)']]
}, {
 canonical: { p: 2, B: 6, C: 4, y0: 3, T: 2 },
 draw: R => retry(() => ({ p: R.pick([0.5, 1, 2, 4]), B: R.int(2, 15), C: R.nz(-6, 6), y0: R.int(0, 12), T: R.int(1, 3) }),
  p => { const m = p.C / p.p, c = p.B / p.p - p.C / (p.p * p.p), Y = m * p.T + c + (p.y0 - c) * Math.exp(-p.p * p.T), pT = p.p * p.T; return pT >= 0.5 && pT <= 5 && Y > 0 && Y < 900 && Math.abs(p.y0 - c) >= 1 && !tie(Y, 3) && dec(c, 3) && dec(m, 3) && Math.abs(p.C) !== 1 && Math.abs(c) > 0; }, { p: 2, B: 6, C: 4, y0: 3, T: 2 }),
 build: ({ p, B, C, y0, T }) => { const m = rd(C / p, 4), c = rd(B / p - C / (p * p), 4), D = rd(y0 - c, 4), pT = rd(p * T, 4), Y = rd(m * T + c + D * Math.exp(-p * T), 3), g = `${n(B)} ${sgn(C)} ${cf(Math.abs(C))}t`, line = `${co(m, 't')} ${sgn(c)} ${n(Math.abs(c))}`; return {
  prompt: `The controller on a coolant line ramps its heater up steadily. The temperature y of the line, in degrees above the room, obeys y′ + ${co(p, 'y')} = ${g}, where t is the time in minutes, and y(0) = ${n(y0)}. After the start-up effect fades, y climbs along a straight line y = mt + c. Enter m, the long-run rise in degrees per minute. Then solve the equation and enter y(${n(T)}) to 3 decimal places.`,
  answer: [m, Y],
  hints: ['Multiply by the integrating factor e^(pt). The right side becomes (B + Ct)e^(pt), and the t term needs integration by parts: the integral of t·e^(pt) dt is (t ÷ p − 1 ÷ p²)e^(pt).', 'Divide by e^(pt) at the end. What is left is a straight line in t plus a constant times e^(−pt); put in y(0) to find that constant.'],
  solution: `The integrating factor is ${ext(p)}, so (${ext(p)}y)′ = (${g})${ext(p)}. By parts, the integral of (${g})${ext(p)} is ${ext(p)}(${co(m, 't')} ${sgn(c)} ${n(Math.abs(c))}) + D, because differentiating it gives ${ext(p)}(${n(p)} × ${pt(m, 't')} + ${n(p)} × ${par(c)} + ${par(m)}) = ${ext(p)}(${g}). Dividing by ${ext(p)} gives y = ${line} + D${ext(-p)}. So m = ${n(m)}. At t = 0, y = ${n(c)} + D = ${n(y0)}, so D = ${n(D)}. Then y(${n(T)}) = ${n(m)} × ${n(T)} ${sgn(c)} ${n(Math.abs(c))} ${sgn(D)} ${cf(Math.abs(D))}${ex(-pT)} = ${pl(Y, 'degree')} to 3 decimal places.`,
  guidance: [
   { prompt: `The integral of (${g})${ext(p)} has the form ${ext(p)}(mt + c) + D. Differentiating ${ext(p)}(mt + c) gives ${ext(p)}(${co(p, 'mt')} + ${co(p, 'c')} + m). Matching the t terms with ${ext(p)}(${g}) gives ${co(p, 'm')} = ${n(C)}. What is m?`, answer: [m], explanation: `m = ${n(C)} ÷ ${n(p)} = ${n(m)}.` },
   { prompt: `Matching the constant terms gives ${co(p, 'c')} + m = ${n(B)}. What is c?`, answer: [c], explanation: `${co(p, 'c')} = ${n(B)} − ${par(m)} = ${n(B - m)}, so c = ${n(c)}.` },
   { prompt: `So y = ${line} + D${ext(-p)}. Use y(0) = ${n(y0)} to find D, then work out y(${n(T)}). What is it to 3 decimal places?`, answer: [Y], explanation: `${n(c)} + D = ${n(y0)} gives D = ${n(D)}, so y(${n(T)}) = ${n(m)} × ${n(T)} ${sgn(c)} ${n(Math.abs(c))} ${sgn(D)} ${cf(Math.abs(D))}${ex(-pT)} = ${n(Y)}.` }
  ] }; }
});

/* ---- q08 Mixing tanks [1.4] ---- */

/* A reservoir of V litres starts at s0 litres of glycol per litre; coolant at c litres per litre flows in at r litres per minute,
   the same flow out. x′ = r·c − (r ÷ V)x, x = V·c + (x0 − V·c)e^(−rt ÷ V). */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'Glycol in the loop',
 brief: 'Fresh coolant is being pumped into the loop’s reservoir, and the controller needs to know how much glycol it will hold and where it is heading.',
 labels: ['glycol after the time (litres)', 'long-run glycol (litres)'], tolerance: 0.0005,
 gl: [['glycol at the start (litres)'], ['k (per minute)'], ['glycol after the time (litres)']]
}, {
 canonical: { V: 400, r: 8, c: 0.05, s0: 0.3, T: 30 },
 draw: R => retry(() => ({ V: R.pick([200, 400, 500, 800]), r: R.pick([4, 5, 8, 10, 20]), c: R.pick([0.05, 0.1, 0.15, 0.2, 0.25]), s0: R.pick([0.05, 0.1, 0.2, 0.3, 0.4]), T: R.pick([10, 20, 30, 40, 50]) }),
  p => { const k = p.r / p.V, L = p.V * p.c, x0 = p.V * p.s0; return dec(k, 3) && dec(L, 4) && dec(x0, 4) && x0 !== L && !tie(L + (x0 - L) * Math.exp(-k * p.T), 3) && !(p.V === 200 && p.r === 4 && p.c === 0.25 && p.s0 === 0.05 && p.T === 30); }, { V: 400, r: 8, c: 0.05, s0: 0.3, T: 30 }),
 build: ({ V, r, c, s0, T }) => { const k = rd(r / V, 4), L = rd(V * c, 4), x0 = rd(V * s0, 4), D = rd(x0 - L, 4), inr = rd(r * c, 4), kT = rd(k * T, 4), X = rd(L + D * Math.exp(-k * T), 3); return {
  prompt: `The reservoir of the coolant loop holds ${n(V)} litres of liquid. At the start the liquid is evenly mixed, with ${n(s0)} litres of glycol in every litre of liquid. Fresh coolant with ${n(c)} litres of glycol per litre is pumped in at ${n(r)} litres per minute, and the well-mixed liquid is pumped out at the same rate, so the volume stays ${n(V)} litres. Enter the amount of glycol in the reservoir after ${n(T)} minutes, in litres to 3 decimal places. Then enter the amount of glycol, in litres, that the reservoir settles towards in the long run.`,
  answer: [X, L],
  hints: ['The amount of glycol x changes at the rate in minus the rate out. Glycol comes in at the flow rate times the incoming concentration; it leaves at the flow rate times x ÷ V.', 'The equation x′ + (r ÷ V)x = rc is linear: solve it with the integrating factor and use the starting amount for the constant. The starting amount is the volume times the starting concentration. In the long run the exponential term dies away.'],
  solution: `At the start the reservoir holds ${n(V)} × ${n(s0)} = ${n(x0)} litres of glycol. Glycol flows in at ${n(r)} × ${n(c)} = ${pl(inr, 'litre')} per minute and out at ${n(r)} × x ÷ ${n(V)} = ${n(k)}x litres per minute, so x′ = ${n(inr)} − ${n(k)}x, that is x′ + ${n(k)}x = ${n(inr)}. With the integrating factor e^(${n(k)}t) the solution is x = ${n(inr)} ÷ ${n(k)} + Ce^(−${n(k)}t) = ${n(L)} + Ce^(−${n(k)}t). At t = 0, x = ${n(x0)}, so C = ${n(D)}. After ${n(T)} minutes, x = ${n(L)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-kT)} = ${n(X)} litres to 3 decimal places. As t grows, e^(−${n(k)}t) shrinks to 0, so the glycol settles towards ${n(L)} litres.`,
  guidance: [
   { prompt: `The reservoir holds ${n(V)} litres with ${n(s0)} litres of glycol per litre. How many litres of glycol does it hold at the start?`, answer: [x0], explanation: `${n(V)} × ${n(s0)} = ${n(x0)} litres.` },
   { prompt: `Glycol leaves at ${n(r)} litres per minute at a concentration of x ÷ ${n(V)} litres per litre, so x′ = ${n(inr)} − kx. What is k?`, answer: [k], explanation: `The outflow carries ${n(r)} × x ÷ ${n(V)} = ${n(k)}x litres per minute, so k = ${n(k)}.` },
   { prompt: `The solution of x′ = ${n(inr)} − ${n(k)}x with x(0) = ${n(x0)} is x = ${n(L)} ${sgn(D)} ${cf(Math.abs(D))}e^(−${n(k)}t). What is x after ${n(T)} minutes, to 3 decimal places?`, answer: [X], explanation: `${n(k)} × ${n(T)} = ${n(kT)}, so x = ${n(L)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-kT)} = ${n(X)} litres.` }
  ] }; }
});

/* Flushing: a tank of V litres holds s0 kg of scale per litre; coolant carrying c kg per litre is pumped in at r litres per minute (same flow out).
   x(T) = L + (x0 − L)e^(−kT); falls to X (L < X < x0) at t = ln((x0 − L) ÷ (X − L)) ÷ k. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'Flushing the scale',
 brief: 'A coolant tank is being flushed with cleaner coolant, and the crew must know how much scale is left at the end of a shift and how long the flush must run.',
 labels: ['scale after the time (kg)', 'time to reach the limit (minutes)'], tolerance: 0.005,
 gl: [['k (per minute)'], ['scale after the time (kg)'], ['time to reach the limit (minutes)']]
}, {
 canonical: { V: 500, r: 10, c: 0.01, s0: 0.08, X: 20, T: 30 },
 draw: R => retry(() => { const V = R.pick([200, 400, 500, 800, 1000]), c = R.pick([0.01, 0.02, 0.05]), s0 = R.pick([0.06, 0.08, 0.1, 0.15, 0.2]), L = V * c, x0 = V * s0; return { V, r: R.pick([4, 5, 8, 10, 20]), c, s0, X: R.int(Math.ceil(L) + 2, Math.max(Math.ceil(L) + 2, Math.floor(x0) - 2)), T: R.pick([10, 20, 30, 40, 60]) }; },
  p => { const k = p.r / p.V, L = p.V * p.c, x0 = p.V * p.s0; return dec(k, 2) && dec(L, 4) && dec(x0, 4) && p.X > L + 1 && p.X < x0 - 1 && !tie(L + (x0 - L) * Math.exp(-k * p.T), 2) && !tie(Math.log((x0 - L) / (p.X - L)) / k, 2); }, { V: 500, r: 10, c: 0.01, s0: 0.08, X: 20, T: 30 }),
 build: ({ V, r, c, s0, X, T }) => { const k = rd(r / V, 4), L = rd(V * c, 4), x0 = rd(V * s0, 4), D = rd(x0 - L, 4), inr = rd(r * c, 4), kT = rd(k * T, 4), Y = rd(L + D * Math.exp(-k * T), 2), t = rd(Math.log((x0 - L) / (X - L)) / k, 2); return {
  prompt: `A coolant tank holds ${n(V)} litres of liquid, and the pipe scale dissolved in it is evenly mixed at ${n(s0)} kg per litre. Cleaner coolant carrying ${n(c)} kg of scale per litre is pumped in at ${n(r)} litres per minute, and the well-mixed liquid leaves at the same rate, so the volume stays ${n(V)} litres. Enter the mass of dissolved scale in the tank after ${n(T)} minutes, in kg to 2 decimal places. Then enter the time, in minutes to 2 decimal places, at which the mass of scale first falls to ${n(X)} kg.`,
  answer: [Y, t],
  hints: ['Let x be the mass of scale. It changes at the rate in minus the rate out: the incoming concentration times the flow, less x ÷ V times the flow. The starting mass is the volume times the starting concentration.', 'Solve the linear equation with the integrating factor. To find a time, set the solution equal to the given mass, isolate the exponential and take a natural logarithm. Round only the final values.'],
  solution: `At the start the tank holds ${n(V)} × ${n(s0)} = ${n(x0)} kg of scale. Scale comes in at ${n(r)} × ${n(c)} = ${n(inr)} kg per minute and leaves at ${n(r)} × x ÷ ${n(V)} = ${n(k)}x kg per minute, so x′ + ${n(k)}x = ${n(inr)}. The solution is x = ${n(inr)} ÷ ${n(k)} + Ce^(−${n(k)}t) = ${n(L)} + Ce^(−${n(k)}t), and x(0) = ${n(x0)} gives C = ${n(D)}. After ${n(T)} minutes, x = ${n(L)} ${sgn(D)} ${cf(Math.abs(D))}${ex(-kT)} = ${n(Y)} kg to 2 decimal places. Setting ${n(L)} + ${cf(D)}e^(−${n(k)}t) = ${n(X)} gives e^(${n(k)}t) = ${n(D)} ÷ ${n(X - L)}, so t = ln(${n(D)} ÷ ${n(X - L)}) ÷ ${n(k)} = ${n(t)} minutes to 2 decimal places.`,
  guidance: [
   { prompt: `Scale leaves at ${n(r)} litres per minute at a concentration of x ÷ ${n(V)} kg per litre, so x′ = ${n(inr)} − kx. What is k?`, answer: [k], explanation: `The outflow carries ${n(r)} × x ÷ ${n(V)} = ${n(k)}x kg per minute, so k = ${n(k)}.` },
   { prompt: `The starting mass is ${n(x0)} kg, so the solution is x = ${n(L)} + ${cf(D)}e^(−${n(k)}t). What is x after ${n(T)} minutes, in kg to 2 decimal places?`, answer: [Y], explanation: `${n(k)} × ${n(T)} = ${n(kT)}, so x = ${n(L)} + ${cf(D)}${ex(-kT)} = ${n(Y)} kg.` },
   { prompt: `Set ${n(L)} + ${cf(D)}e^(−${n(k)}t) = ${n(X)}. Then e^(${n(k)}t) = ${n(D)} ÷ ${n(X - L)}. What is t in minutes, to 2 decimal places?`, answer: [t], explanation: `t = ln(${n(D)} ÷ ${n(X - L)}) ÷ ${n(k)} = ${n(t)} minutes.` }
  ] }; }
});

/* Two phases: inflow at c1 for T1 minutes, then at c2 for T2 more minutes (same flow out, V constant).
   x1 = L1 + (x0 − L1)e^(−kT1); x2 = L2 + (x1 − L2)e^(−kT2). Uses q07 (a new starting amount at the switch). */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q07', title: 'The brine swap',
 brief: 'The brine feed to a tank is swapped for a different one partway through a shift, and the log needs the salt in the tank at the end.',
 labels: ['salt at the switch (kg)', 'salt at the end (kg)'], tolerance: 0.0005,
 gl: [['salt at the switch (kg)'], ['salt at the end (kg)']]
}, {
 canonical: { V: 200, r: 4, c1: 0.25, c2: 0.05, x0: 10, T1: 30, T2: 20 },
 draw: R => retry(() => ({ V: R.pick([100, 200, 400, 500]), r: R.pick([4, 5, 10]), c1: R.pick([0.05, 0.1, 0.2, 0.25, 0.4]), c2: R.pick([0.05, 0.1, 0.2, 0.25, 0.4]), x0: R.int(0, 30), T1: R.pick([10, 20, 30, 40]), T2: R.pick([10, 15, 20, 30]) }),
  p => { const k = p.r / p.V, L1 = p.V * p.c1, L2 = p.V * p.c2, x1 = L1 + (p.x0 - L1) * Math.exp(-k * p.T1), x2 = L2 + (x1 - L2) * Math.exp(-k * p.T2), x1r = rd(x1, 3);
   return dec(k, 4) && dec(L1, 4) && dec(L2, 4) && p.c1 !== p.c2 && p.x0 !== L1 && Math.abs(x1 - L2) > 3 && !tie(x1, 3) && !tie(x2, 3) && rd(L2 + (x1r - L2) * Math.exp(-k * p.T2), 3) === rd(x2, 3) && !(p.V === 100 && p.r === 5 && p.c1 === 0.1 && p.x0 === 0 && p.T1 === 20); },
  { V: 200, r: 4, c1: 0.25, c2: 0.05, x0: 10, T1: 30, T2: 20 }),
 build: ({ V, r, c1, c2, x0, T1, T2 }) => { const k = rd(r / V, 4), L1 = rd(V * c1, 4), L2 = rd(V * c2, 4), k1 = rd(k * T1, 4), k2 = rd(k * T2, 4), x1 = L1 + (x0 - L1) * Math.exp(-k * T1), X1 = rd(x1, 3), x2 = L2 + (x1 - L2) * Math.exp(-k * T2), X2 = rd(x2, 3), D1 = rd(x0 - L1, 4); return {
  prompt: `A tank in the coolant loop holds ${n(V)} litres of water with ${n(x0)} kg of salt dissolved in it. Brine with ${n(c1)} kg of salt per litre is pumped in at ${n(r)} litres per minute, and the well-mixed liquid leaves at the same rate, so the volume stays ${n(V)} litres. After ${n(T1)} minutes the feed is swapped for a different brine with ${n(c2)} kg of salt per litre, at the same flow rate, and it runs for ${n(T2)} more minutes. Enter the salt in the tank at the moment of the swap, then the salt in the tank at the end of the ${n(T2)} further minutes, both in kg to 3 decimal places.`,
  answer: [X1, X2],
  hints: ['Solve the mixing equation for the first feed with the starting amount, and find the amount at the swap. Keep that value unrounded for the next part.', 'After the swap the equation has the same flow rate but a new incoming concentration, and its starting amount is the amount at the swap. Time for the second part counts from the swap. Round only the final values.'],
  solution: `For the first feed, salt comes in at ${n(r)} × ${n(c1)} = ${n(rd(r * c1, 4))} kg per minute and leaves at ${n(k)}x kg per minute, so x′ + ${n(k)}x = ${n(rd(r * c1, 4))} and x = ${n(L1)} + Ce^(−${n(k)}t). With x(0) = ${n(x0)}, C = ${n(D1)}. At the swap, x = ${n(L1)} ${sgn(D1)} ${cf(Math.abs(D1))}${ex(-k1)} = ${n(X1)} kg to 3 decimal places. After the swap the long-run amount is ${n(r)} × ${n(c2)} ÷ ${n(k)} = ${n(L2)}, so with the unrounded amount at the swap as the new start, x = ${n(L2)} + (x at the swap − ${n(L2)})e^(−${n(k)}s), where s is the time since the swap. At s = ${n(T2)}, the exponent is −${n(k2)}, and x = ${n(L2)} + (${n(X1)} − ${n(L2)})${ex(-k2)} = ${n(X2)} kg to 3 decimal places.`,
  guidance: [
   { prompt: `For the first feed, x′ = ${n(rd(r * c1, 4))} − ${n(k)}x, so x = ${n(L1)} ${sgn(D1)} ${cf(Math.abs(D1))}e^(−${n(k)}t). What is x at the swap, after ${n(T1)} minutes, to 3 decimal places?`, answer: [X1], explanation: `${n(k)} × ${n(T1)} = ${n(k1)}, so x = ${n(L1)} ${sgn(D1)} ${cf(Math.abs(D1))}${ex(-k1)} = ${n(X1)} kg.` },
   { prompt: `After the swap the equation is x′ = ${n(rd(r * c2, 4))} − ${n(k)}x, with long-run amount ${n(L2)} kg and the amount at the swap as its start, so x = ${n(L2)} + (x at the swap − ${n(L2)})e^(−${n(k)}s). What is x at the end, ${n(T2)} minutes after the swap, to 3 decimal places?`, answer: [X2], explanation: `${n(k)} × ${n(T2)} = ${n(k2)}, so x = ${n(L2)} + (${n(X1)} − ${n(L2)})${ex(-k2)} = ${n(X2)} kg.` }
  ] }; }
});

/* ---- q09 Autonomous equations: equilibria and stability [1.6] ---- */

/* y′ = k·(y − a)(y − b) written with some factors flipped and in either order, two equilibria a < b with b − a ≥ 1.
   Asked: both equilibria and the stability code of the smaller (j = 0) or larger (j = 1) one. */
const f9b = ({ r, k, flips, swap }) => {
 const fl = [0, 1].map(i => !!(flips & (1 << i)) && r[i] > 0), lead = k * fl.reduce((s, f) => f ? -s : s, 1), ord = swap ? [1, 0] : [0, 1];
 return { lead, txt: `${kp(k)}${ord.map(i => fy(r[i], fl[i])).join('')}`, f: y => lead * (y - r[0]) * (y - r[1]) };
};
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The pump pressure',
 brief: 'The pressure in a coolant pump can sit still at two values, and the crew needs to know which of them it will hold.',
 labels: ['smaller equilibrium', 'larger equilibrium', 'stable (1) or unstable (0)'], tolerance: 0.01,
 gl: [['smaller equilibrium'], ['sign between (1 or −1)'], ['stable (1) or unstable (0)']]
}, {
 canonical: { r: [-2, 4], k: 3, flips: 2, swap: 0, j: 1 },
 draw: R => retry(() => { const a = R.int(-5, 4); return { r: [a, a + R.int(1, 6)], k: R.pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]), flips: R.int(0, 3), swap: R.int(0, 1), j: R.int(0, 1) }; },
  p => p.r[1] <= 6, { r: [-2, 4], k: 3, flips: 2, swap: 0, j: 1 }),
 build: p => { const { r, j } = p, { txt, f } = f9b(p), a = r[0], b = r[1], m = (a + b) / 2, s = v => f(v) > 0 ? 1 : -1, sb = s(a - 1), sm = s(m), sa = s(b + 1), e = r[j], word = ['smaller', 'larger'][j],
  code = j === 0 ? (sb > 0 && sm < 0 ? 1 : 0) : (sm > 0 && sa < 0 ? 1 : 0), dir = v => v > 0 ? 'positive, so y rises' : 'negative, so y falls'; return {
  prompt: `The pressure y in a coolant pump, in kilopascals above the supply line, obeys the autonomous equation y′ = ${txt}, where t is the time in seconds. Enter its two equilibrium values, smaller first. Then, for the ${word} one, enter 1 if it is stable or 0 if it is unstable.`,
  answer: [a, b, code],
  hints: ['The equilibria are the constant values of y that make the right-hand side 0: set each factor to 0.', 'Work out the sign of y′ on each side of the equilibrium you are asked about. It is stable when y rises towards it from below and falls towards it from above; otherwise it is unstable.'],
  solution: `The right-hand side is 0 when one factor is 0, so the equilibria are y = ${n(a)} and y = ${n(b)}. Below ${n(a)}, at y = ${n(a - 1)}, y′ is ${dir(sb)}. Between them, at y = ${n(m)}, y′ is ${dir(sm)}. Above ${n(b)}, at y = ${n(b + 1)}, y′ is ${dir(sa)}. ${code ? `Both sides move towards y = ${n(e)}, so it is stable: enter 1.` : `Solutions starting near y = ${n(e)} move away from it on at least one side, so it is unstable: enter 0.`}`,
  guidance: [
   { prompt: `Set each factor of ${txt} to 0. What is the smaller equilibrium?`, answer: [a], explanation: `The factors are 0 at y = ${n(a)} and y = ${n(b)}; the smaller is ${n(a)}.` },
   { prompt: `Put y = ${n(m)}, halfway between the two equilibria, into the right-hand side. Enter 1 if y′ is positive there or −1 if it is negative.`, answer: [sm], explanation: `y′ is ${dir(sm)} between ${n(a)} and ${n(b)}.` },
   { prompt: `Between ${n(a)} and ${n(b)}, y′ is ${pn(sm)}. For two different equilibria like these, y′ has the opposite sign below the smaller one and above the larger one. Enter 1 if the ${word} equilibrium y = ${n(e)} is stable or 0 if it is unstable.`, answer: [code], explanation: code ? `y moves towards ${n(e)} from both sides, so it is stable.` : `On at least one side y moves away from ${n(e)}, so it is unstable.` }
  ] }; }
});

/* Fish stock y (hundreds): y′ = k·y − b·y² − h = −b(y − r1)(y − r2), k = b(r1 + r2), h = b·r1·r2. Starting at S: settles at r2 if S > r1, dies out (0) if S < r1. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The reservoir fish',
 brief: 'Fish are farmed in the cooling reservoir with a steady harvest, and the crew must know the stock levels it can rest at and where this season’s stock will end up.',
 labels: ['smaller equilibrium (hundreds)', 'larger equilibrium (hundreds)', 'long-run stock (hundreds)'], tolerance: 0.01,
 gl: [['smaller equilibrium (hundreds)'], ['larger equilibrium (hundreds)'], ['long-run stock (hundreds)']]
}, {
 canonical: { b: 0.1, r1: 3, r2: 8, S: 5 },
 draw: R => retry(() => { const r1 = R.int(2, 6); return { b: R.pick([0.05, 0.1, 0.2, 0.25, 0.5]), r1, r2: r1 + R.int(2, 6), S: R.int(1, 12) }; },
  p => p.S !== p.r1 && p.S !== p.r2 && p.S <= p.r2 + 4 && dec(p.b * (p.r1 + p.r2), 4) && dec(p.b * p.r1 * p.r2, 4) && !(p.b === 0.2 && p.r1 === 2 && p.r2 === 10), { b: 0.1, r1: 3, r2: 8, S: 5 }),
 build: ({ b, r1, r2, S }) => { const k = rd(b * (r1 + r2), 4), h = rd(b * r1 * r2, 4), sum = r1 + r2, prod = r1 * r2, long = S > r1 ? r2 : 0, fa = fy(r1, false), fb = fy(r2, false); return {
  prompt: `The fish stock y in the cooling reservoir, in hundreds of fish, changes each day through three effects. Births add ${n(k)} times y. Crowding removes ${n(b)} times y². Harvesting removes a steady ${n(h)}. The stock starts at ${n(S)} hundred, and t is in days. Write y′ as births minus crowding minus harvesting. Enter the two equilibrium stocks, smaller first. Then enter the stock the reservoir settles towards in the long run (the stock cannot go below 0, so enter 0 if the fish die out).`,
  answer: [r1, r2, long],
  hints: ['Setting y′ = 0 gives a quadratic in y. Move everything to one side, divide by the coefficient of y², and find the two roots, by factorising or with the quadratic formula.', 'Between the two equilibria y′ has one sign, and outside them it has the opposite sign. Check the sign at the starting stock to see which way the stock moves and which equilibrium it reaches. If it keeps falling, the fish die out.'],
  solution: `Births minus crowding minus harvesting gives y′ = ${co(k, 'y')} − ${n(b)}y² − ${n(h)}. Setting y′ = 0 and dividing by −${n(b)} gives y² − ${n(sum)}y + ${n(prod)} = 0, which factorises as ${fa}${fb} = 0. So the equilibria are y = ${n(r1)} and y = ${n(r2)}. The coefficient of y² is negative, so y′ is positive between them and negative outside them. ${S > r1 ? `The stock starts at ${n(S)}, above ${n(r1)}, so it ${S < r2 ? 'rises' : 'falls'} towards ${n(r2)} and settles there.` : `The stock starts at ${n(S)}, below ${n(r1)}, where y′ is negative, so it keeps falling and the fish die out: enter 0.`}`,
  guidance: [
   { prompt: `Setting y′ = 0 and dividing by −${n(b)} gives y² − ${n(sum)}y + ${n(prod)} = 0. What is the smaller root, which is the smaller equilibrium?`, answer: [r1], explanation: `The quadratic factorises as ${fa}${fb} = 0, so the roots are ${n(r1)} and ${n(r2)}.` },
   { prompt: `The two roots of y² − ${n(sum)}y + ${n(prod)} = 0 add up to ${n(sum)}. What is the larger equilibrium?`, answer: [r2], explanation: `${n(sum)} − ${n(r1)} = ${n(r2)}.` },
   { prompt: `The coefficient of y² in y′ is negative, so y′ is positive between ${n(r1)} and ${n(r2)} and negative outside. The stock starts at ${n(S)}. Enter the stock it settles towards, or 0 if the fish die out.`, answer: [long], explanation: S > r1 ? `${n(S)} is above ${n(r1)}, so the stock moves towards ${n(r2)} and settles there.` : `${n(S)} is below ${n(r1)}, where y′ is negative, so the stock keeps falling and the fish die out.` }
  ] }; }
});

/* Four equilibria r (sorted, one of them a half-integer, written with a factor (2y − q)); start S between r[i] and r[i + 1].
   y′ has one sign on that interval, so y moves to the upper end if y′ > 0 there and to the lower end if y′ < 0. */
const half = r => Math.abs(r - Math.round(r)) > 0.25;
const fy4 = (r, flip) => half(r) ? (flip ? `(${n(2 * r)} − 2y)` : `(2y ${cst(-2 * r)})`) : fy(r, flip);
const f9d = ({ r, k, flips, ord }) => {
 const fl = r.map((v, i) => !!(flips & (1 << i)) && v > 0), lead = k * r.reduce((s, v, i) => s * (fl[i] ? -1 : 1) * (half(v) ? 2 : 1), 1);
 return { lead, txt: `${kp(k)}${ord.map(i => fy4(r[i], fl[i])).join('')}`, fl, f: y => lead * r.reduce((s, v) => s * (y - v), 1) };
};
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q04', title: 'The four-position valve',
 brief: 'A coolant valve can rest at four different openings, and the crew needs to know where it will end up from a given starting opening.',
 labels: ['equilibrium 1 (smallest)', 'equilibrium 2', 'equilibrium 3', 'equilibrium 4 (largest)', 'opening it settles towards'], tolerance: 0.01,
 gl: [['the equilibrium from the factor with the 2'], ['sign at the start (1 or −1)'], ['opening it settles towards']]
}, {
 canonical: { r: [-2, 1, 3.5, 5], k: 1, flips: 5, ord: [2, 0, 3, 1], i: 1 },
 draw: R => retry(() => { const pool = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], r = []; while (r.length < 4) { const v = R.pick(pool); if (!r.includes(v)) r.push(v); } r.sort((x, y) => x - y);
   const h = R.int(0, 3); r[h] += 0.5; const ord = [0, 1, 2, 3]; for (let t = 3; t > 0; t--) { const u = R.int(0, t); [ord[t], ord[u]] = [ord[u], ord[t]]; }
   return { r, k: R.pick([-2, -1, 1, 2]), flips: R.int(0, 15), ord, i: R.int(0, 2) }; },
  p => p.r.every((v, i) => i === 0 || v - p.r[i - 1] >= 1) && p.r[3] <= 6.5 && p.r.filter(half).length === 1 && !(p.r.join() === '-2,1,3.5,5'), { r: [-2, 1, 3.5, 5], k: 1, flips: 5, ord: [2, 0, 3, 1], i: 1 }),
 build: p => { const { r, i } = p, { txt, fl, f } = f9d(p), S = r[i] + 0.5, sg = f(S) > 0 ? 1 : -1, lim = sg > 0 ? r[i + 1] : r[i], hi = r.findIndex(half), hf = fy4(r[hi], fl[hi]); return {
  prompt: `The opening y of a coolant valve, in millimetres, obeys the autonomous equation y′ = ${txt}, where t is the time in seconds. The valve can rest at four different openings. Enter the four equilibrium values in increasing order. Then enter the opening that y settles towards when y(0) = ${n(S)}.`,
  answer: [r[0], r[1], r[2], r[3], lim],
  hints: ['The equilibria are the constant values of y that make the right-hand side 0: set each factor to 0. A factor like 2y − 5 is 0 at y = 2.5.', 'Between two neighbouring equilibria y′ keeps one sign, so y keeps rising or keeps falling there. Work out the sign at the starting value, and see which equilibrium that carries y towards.'],
  solution: `The right-hand side is 0 when one factor is 0, so the equilibria are y = ${n(r[0])}, ${n(r[1])}, ${n(r[2])} and ${n(r[3])} (the factor ${hf} gives ${n(r[hi])}). The start y = ${n(S)} lies between ${n(r[i])} and ${n(r[i + 1])}, and y′ keeps one sign there. At y = ${n(S)}, y′ is ${sg > 0 ? 'positive, so y rises' : 'negative, so y falls'}, towards ${n(lim)}. It settles at ${n(lim)}.`,
  guidance: [
   { prompt: `Set the factor ${hf} to 0. What is the equilibrium it gives?`, answer: [r[hi]], explanation: `${hf} = 0 gives y = ${n(r[hi])}. The other three factors give ${r.filter((_, j) => j !== hi).map(n).join(', ')}.` },
   { prompt: `The start y = ${n(S)} lies between the equilibria ${n(r[i])} and ${n(r[i + 1])}. Put it into the right-hand side. Enter 1 if y′ is positive there or −1 if it is negative.`, answer: [sg], explanation: `y′ is ${sg > 0 ? 'positive, so y rises' : 'negative, so y falls'} at y = ${n(S)}.` },
   { prompt: `At the start y′ is ${pn(sg)}, and it keeps that sign between ${n(r[i])} and ${n(r[i + 1])}. Enter the equilibrium that y settles towards.`, answer: [lim], explanation: `y ${sg > 0 ? 'rises' : 'falls'} and cannot pass an equilibrium, so it settles at ${n(lim)}.` }
  ] }; }
});

/* ---- q10 Logistic growth [1.6] ---- */

/* P′ = kP(1 − P ÷ K), P(0) = P0: A = (K − P0) ÷ P0, P = K ÷ (1 + Ae^(−kt)), level L reached at t = ln(A·L ÷ (K − L)) ÷ k. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The algae pond',
 brief: 'Algae in the coolant loop’s settling pond is spreading towards the most the pond can hold, and the crew needs its size on a given day and the day it passes a set level.',
 labels: ['population after the time (thousand cells)', 'time to reach the level (days)'], tolerance: 0.005,
 gl: [['A'], ['population after the time (thousand cells)'], ['time to reach the level (days)']]
}, {
 canonical: { k: 0.3, K: 400, P0: 20, f: 0.75, T: 6 },
 draw: R => retry(() => ({ k: R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), K: R.pick([120, 150, 200, 250, 300, 400, 500, 600]), P0: R.pick([5, 8, 10, 12, 15, 20, 25, 30, 40, 50]), f: R.pick([0.5, 0.6, 0.75, 0.8, 0.9]), T: R.int(2, 8) }),
  p => { const A = (p.K - p.P0) / p.P0, L = p.f * p.K, t = Math.log(A * L / (p.K - L)) / p.k, P = p.K / (1 + A * Math.exp(-p.k * p.T)); return p.P0 < p.K / 3 && dec(A, 3) && dec(L, 2) && L > p.P0 && t > 1 && !tie(t, 2) && !tie(P, 2) && !(p.k === 0.4 && p.K === 800); }, { k: 0.3, K: 400, P0: 20, f: 0.75, T: 6 }),
 build: ({ k, K, P0, f, T }) => { const A = rd((K - P0) / P0, 4), L = rd(f * K, 4), P = rd(K / (1 + (K - P0) / P0 * Math.exp(-k * T)), 2), t = rd(Math.log((K - P0) / P0 * L / (K - L)) / k, 2), kT = rd(k * T, 4); return {
  prompt: `The algae in a settling pond of the coolant loop, P thousand cells, grows by the logistic equation P′ = ${co(k, 'P')}(1 − P ÷ ${n(K)}), where t is in days, and P(0) = ${n(P0)}. Enter the population after ${n(T)} days, in thousand cells to 2 decimal places. Then enter the time, in days to 2 decimal places, when it first reaches ${n(L)} thousand cells.`,
  answer: [P, t],
  hints: ['The equation is already in the form kP(1 − P ÷ K), so K is the number inside the bracket. The solution is P = K ÷ (1 + Ae^(−kt)) with A = (K − P(0)) ÷ P(0).', 'For the population at a time, put the time into the solution. For the time to reach a level, set P equal to the level and solve for t with a natural logarithm. Round only the final values.'],
  solution: `Here k = ${n(k)} and K = ${n(K)}, so the solution is P = ${n(K)} ÷ (1 + Ae^(−${n(k)}t)) with A = (${n(K)} − ${n(P0)}) ÷ ${n(P0)} = ${n(A)}. At t = ${n(T)}, the exponent is −${n(k)} × ${n(T)} = −${n(kT)}, so P = ${n(K)} ÷ (1 + ${n(A)}${ex(-kT)}) = ${n(P)} thousand cells to 2 decimal places. Setting P = ${n(L)} gives 1 + ${n(A)}e^(−${n(k)}t) = ${n(K)} ÷ ${n(L)}, so e^(${n(k)}t) = ${n(A)} × ${n(L)} ÷ ${n(K - L)} and t = ln(${n(A)} × ${n(L)} ÷ ${n(K - L)}) ÷ ${n(k)} = ${n(t)} days to 2 decimal places.`,
  guidance: [
   { prompt: `The solution is P = ${n(K)} ÷ (1 + Ae^(−${n(k)}t)), and at t = 0 it is ${n(K)} ÷ (1 + A) = ${n(P0)}. What is A?`, answer: [A], explanation: `1 + A = ${n(K)} ÷ ${n(P0)}, so A = ${n(K)} ÷ ${n(P0)} − 1 = ${n(A)}.` },
   { prompt: `What is P = ${n(K)} ÷ (1 + ${n(A)}e^(−${n(k)} × ${n(T)})) at t = ${n(T)}, in thousand cells to 2 decimal places?`, answer: [P], explanation: `${n(k)} × ${n(T)} = ${n(kT)}, so P = ${n(K)} ÷ (1 + ${n(A)}${ex(-kT)}) = ${n(P)}.` },
   { prompt: `Set ${n(K)} ÷ (1 + ${n(A)}e^(−${n(k)}t)) = ${n(L)}. Then e^(${n(k)}t) = ${n(A)} × ${n(L)} ÷ ${n(K - L)}. What is t in days, to 2 decimal places?`, answer: [t], explanation: `t = ln(${n(A)} × ${n(L)} ÷ ${n(K - L)}) ÷ ${n(k)} = ${n(t)} days.` }
  ] }; }
});

/* P′ = aP − bP², b = a ÷ K, P(0) = P0 < K ÷ 2. Fastest growth at P = K ÷ 2: reached at t = ln A ÷ a, with rate a·K ÷ 4. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'Film on the plates',
 brief: 'A bacterial film is spreading over a heat-exchanger plate, and the crew wants to know when it will be growing fastest and how fast that is.',
 labels: ['carrying capacity (thousand cells)', 'time of fastest growth (days)', 'growth rate then (thousand cells per day)'], tolerance: 0.005,
 gl: [['carrying capacity (thousand cells)'], ['time of fastest growth (days)'], ['growth rate then (thousand cells per day)']]
}, {
 canonical: { a: 0.4, K: 500, P0: 20 },
 draw: R => retry(() => ({ a: R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), K: R.pick([200, 250, 400, 500, 800]), P0: R.pick([5, 8, 10, 12, 16, 20, 25, 40, 50]) }),
  p => { const A = (p.K - p.P0) / p.P0, b = p.a / p.K; return p.P0 < p.K / 4 && dec(b, 4) && dec(A, 3) && dec(p.a * p.K / 4, 2) && !tie(Math.log(A) / p.a, 2) && !(p.a === 0.4 && p.K === 800 && p.P0 === 100); }, { a: 0.4, K: 500, P0: 20 }),
 build: ({ a, K, P0 }) => { const b = rd(a / K, 4), A = rd((K - P0) / P0, 4), t = rd(Math.log((K - P0) / P0) / a, 2), rate = rd(a * K / 4, 4), H = rd(K / 2, 4); return {
  prompt: `A bacterial film on a heat-exchanger plate, P thousand cells, grows by the equation P′ = ${n(a)}P − ${n(b)}P², where t is in days, and P(0) = ${n(P0)}. The growth of a logistic population is fastest at the moment P reaches half of its carrying capacity. Enter the carrying capacity in thousands of cells. Then enter the time, in days to 2 decimal places, when the film reaches that moment. Then enter the growth rate P′ at that moment, in thousand cells per day.`,
  answer: [K, t, rate],
  hints: ['Factor the right-hand side as kP(1 − P ÷ K): the carrying capacity K is the nonzero equilibrium, where kP = (k ÷ K)P².', 'The solution is P = K ÷ (1 + Ae^(−kt)) with A = (K − P(0)) ÷ P(0). Set P equal to half of K and solve for t with a natural logarithm. For the growth rate, put that value of P into the right-hand side of the equation.'],
  solution: `P′ = ${n(a)}P − ${n(b)}P² = ${n(a)}P(1 − P ÷ ${n(K)}), because ${n(a)} ÷ ${n(b)} = ${n(K)}. So the carrying capacity is ${n(K)} thousand cells. The solution is P = ${n(K)} ÷ (1 + Ae^(−${n(a)}t)) with A = (${n(K)} − ${n(P0)}) ÷ ${n(P0)} = ${n(A)}. Setting P = ${n(H)} gives 1 + ${n(A)}e^(−${n(a)}t) = 2, so e^(${n(a)}t) = ${n(A)} and t = ln ${n(A)} ÷ ${n(a)} = ${n(t)} days to 2 decimal places. At that moment P′ = ${n(a)} × ${n(H)} − ${n(b)} × ${n(H)}² = ${n(rd(a * H, 4))} − ${n(rd(b * H * H, 4))} = ${n(rate)} thousand cells per day.`,
  guidance: [
   { prompt: `Write ${n(a)}P − ${n(b)}P² as ${n(a)}P(1 − P ÷ K). What is K?`, answer: [K], explanation: `${n(a)}P × P ÷ K must equal ${n(b)}P², so K = ${n(a)} ÷ ${n(b)} = ${n(K)}.` },
   { prompt: `The solution is P = ${n(K)} ÷ (1 + ${n(A)}e^(−${n(a)}t)). Set P = ${n(H)}, half of the carrying capacity. Then e^(${n(a)}t) = ${n(A)}. What is t in days, to 2 decimal places?`, answer: [t], explanation: `t = ln ${n(A)} ÷ ${n(a)} = ${n(t)} days.` },
   { prompt: `Put P = ${n(H)} into P′ = ${n(a)}P − ${n(b)}P². What is P′, in thousand cells per day?`, answer: [rate], explanation: `${n(a)} × ${n(H)} − ${n(b)} × ${n(H)}² = ${n(rd(a * H, 4))} − ${n(rd(b * H * H, 4))} = ${n(rate)}.` }
  ] }; }
});

/* A colony seeded above K: P(0) = g·K, A = (K − P0) ÷ P0 < 0, P = K ÷ (1 + Ae^(−kt)); it falls to a level L (K < L < P0) at
   t = ln(A·L ÷ (K − L)) ÷ k, where A and K − L are both negative. Uses q09 (above the stable equilibrium K the solution falls). */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q09', title: 'The crowded culture',
 brief: 'A bacterial culture was seeded far too heavily for its tank, and the crew needs to know how fast it thins out.',
 labels: ['A', 'time to fall to the level (days)', 'population after the time (thousand cells)'], tolerance: 0.005,
 gl: [['A'], ['time to fall to the level (days)'], ['population after the time (thousand cells)']]
}, {
 canonical: { k: 0.4, K: 200, g: 2, f: 0.5, T: 4 },
 draw: R => retry(() => ({ k: R.pick([0.2, 0.3, 0.4, 0.5, 0.6]), K: R.pick([100, 200, 250, 300, 400]), g: R.pick([1.25, 2, 2.5, 4]), f: R.pick([0.25, 0.5, 0.75]), T: R.int(1, 6) }),
  p => { const P0 = p.g * p.K, L = p.K + p.f * (P0 - p.K), A = (p.K - P0) / P0, t = Math.log(A * L / (p.K - L)) / p.k, P = p.K / (1 + A * Math.exp(-p.k * p.T)); return P0 <= 900 && dec(P0, 2) && dec(L, 2) && t > 0.3 && !tie(t, 2) && !tie(P, 2); }, { k: 0.4, K: 200, g: 2, f: 0.5, T: 4 }),
 build: ({ k, K, g, f, T }) => { const P0 = rd(g * K, 4), L = rd(K + f * (P0 - K), 4), A = rd((K - P0) / P0, 4), kT = rd(k * T, 4), t = rd(Math.log((K - P0) / P0 * L / (K - L)) / k, 2), P = rd(K / (1 + (K - P0) / P0 * Math.exp(-k * T)), 2); return {
  prompt: `A colony of cleaner bacteria in the coolant loop was seeded too heavily. P thousand cells obeys the logistic equation P′ = ${co(k, 'P')}(1 − P ÷ ${n(K)}), where t is in days, and P(0) = ${n(P0)}, which is above the carrying capacity. The solution is still P = ${n(K)} ÷ (1 + Ae^(−${n(k)}t)) with A = (${n(K)} − P(0)) ÷ P(0), but A is now negative. Enter A. Then enter the time, in days to 2 decimal places, when the colony first falls to ${n(L)} thousand cells. Then enter the population after ${pl(T, 'day')}, in thousand cells to 2 decimal places.`,
  answer: [A, t, P],
  hints: ['Put P(0) into A = (K − P(0)) ÷ P(0): the top is negative because P(0) is above K, so A is negative and lies between −1 and 0.', 'To find a time, set P equal to the level and rearrange as for any logistic problem: e^(kt) = A × level ÷ (K − level). Both A and K − level are negative here, so the ratio is positive and the logarithm exists. Round only the final values.'],
  solution: `A = (${n(K)} − ${n(P0)}) ÷ ${n(P0)} = ${n(A)}. Setting P = ${n(L)} gives 1 + ${par(A)}e^(−${n(k)}t) = ${n(K)} ÷ ${n(L)}, so e^(${n(k)}t) = ${par(A)} × ${n(L)} ÷ (${n(K - L)}), and t = ln(${par(A)} × ${n(L)} ÷ (${n(K - L)})) ÷ ${n(k)} = ${n(t)} days to 2 decimal places. At t = ${n(T)}, the exponent is −${n(k)} × ${n(T)} = −${n(kT)}, so P = ${n(K)} ÷ (1 + ${par(A)}${ex(-kT)}) = ${n(P)} thousand cells to 2 decimal places.`,
  guidance: [
   { prompt: `What is A = (${n(K)} − ${n(P0)}) ÷ ${n(P0)}?`, answer: [A], explanation: `${n(K - P0)} ÷ ${n(P0)} = ${n(A)}. It is negative because the colony starts above ${n(K)}.` },
   { prompt: `Set ${n(K)} ÷ (1 + ${par(A)}e^(−${n(k)}t)) = ${n(L)}. Then e^(${n(k)}t) = ${par(A)} × ${n(L)} ÷ (${n(K - L)}). What is t in days, to 2 decimal places?`, answer: [t], explanation: `t = ln(${par(A)} × ${n(L)} ÷ (${n(K - L)})) ÷ ${n(k)} = ${n(t)} days.` },
   { prompt: `What is P = ${n(K)} ÷ (1 + ${par(A)}e^(−${n(k)} × ${n(T)})) at t = ${n(T)}, in thousand cells to 2 decimal places?`, answer: [P], explanation: `${n(k)} × ${n(T)} = ${n(kT)}, so P = ${n(K)} ÷ (1 + ${par(A)}${ex(-kT)}) = ${n(P)}.` }
  ] }; }
});

})();
