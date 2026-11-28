/* Calculus 2: accumulation practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p1.js. */
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
const SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
/* A polynomial from its coefficients, highest power first: poly([3, 0, −2], 't') is '3t² − 2'. A coefficient 1 is not
   written out and a zero term is left out. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Signed sum of numbers as worked: sum([8, −8, 10]) is '8 − 8 + 10'. */
const sum = list => list.map((v, i) => i ? (v < 0 ? ' − ' : ' + ') + n(Math.abs(v)) : n(v)).join('');
const r3 = x => Math.round(x * 1000) / 1000, r2 = x => Math.round(x * 100) / 100;
const f3 = x => x.toFixed(3).replace('-', '−'), f2 = x => x.toFixed(2).replace('-', '−');
const cub = x => x * x * x, pw = Math.pow;
/* True when x sits within 0.05 of a step of a rounding tie at k places, so a slightly different calculator path could round it the other way. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
/* A coefficient written in front of a letter: '' for 1. */
const co = x => x === 1 ? '' : n(x);

/* ---- q01 Net change from a rate [1.4] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The cooling tank drain',
 brief: 'The pump house cooling tank is being emptied through a drain that opens wider every minute, and the log needs to know what is left.',
 labels: ['net change (L)', 'amount at the end (L)'], tolerance: 0.01,
 gl: [['A', 'B'], ['F at the start', 'F at the end'], ['net change (L)', 'amount at the end (L)']]
}, {
 /* The tank loses water at d(t) = at² + bt, so its rate of change is −d(t) and the net change is negative. a is 3 or 6 and b is even,
    so F(t) = (a ÷ 3)t³ + (b ÷ 2)t² has whole coefficients. The tank starts with at least 20 litres more than it loses. */
 canonical: { a: 6, b: 4, t1: 1, t2: 3, S: 120 },
 draw: R => { const p = { a: R.pick([3, 6]), b: R.pick([2, 4, 6, 8, 10]), t1: R.int(0, 3) }; p.t2 = p.t1 + R.int(2, 3);
  const F = t => (p.a / 3) * cub(t) + (p.b / 2) * t * t; p.S = F(p.t2) - F(p.t1) + 10 * R.int(2, 15); return p; },
 build: ({ a, b, t1, t2, S }) => { const A = a / 3, B = b / 2, F = t => A * cub(t) + B * t * t, F1 = F(t1), F2 = F(t2), loss = F2 - F1, net = -loss, fin = S + net,
  r = poly([a, b, 0], 't'), Ft = poly([A, B, 0, 0], 't'), ev = t => `${n(A)} × ${n(cub(t))} + ${n(B)} × ${n(t * t)} = ${n(F(t))}`; return {
  prompt: `The cooling tank in the pump house is emptied through a drain that opens wider as time goes on: the tank loses water at d(t) = ${r} litres per minute, where t is the number of minutes since the drain began to open. At t = ${n(t1)} the tank holds ${n(S)} litres. Enter the net change in the amount of water in the tank from t = ${n(t1)} to t = ${n(t2)}, then the amount in the tank at t = ${n(t2)}, both in litres.`,
  answer: [net, fin],
  hints: ['The tank is losing water, so the rate at which its amount changes is −d(t). Find an antiderivative of d(t) by reversing the power rule on each term, and put the minus sign on the whole integral.', `The integral of d(t) from t = ${n(t1)} to t = ${n(t2)} is F(${n(t2)}) − F(${n(t1)}) for your antiderivative F, and the net change is minus that. The amount at the end is the amount at the start plus the net change, which is a negative number.`],
  solution: `The amount changes at the rate −d(t), so the net change is minus the integral of d(t). An antiderivative of d(t) = ${r} is F(t) = ${Ft}. F(${n(t2)}) = ${ev(t2)} and F(${n(t1)}) = ${ev(t1)}, so ∫ from ${n(t1)} to ${n(t2)} of d(t) dt = ${n(F2)} − ${n(F1)} = ${n(loss)} litres, and the net change is −${n(loss)} litres. By the Net Change Theorem the tank then holds ${n(S)} − ${n(loss)} = ${n(fin)} litres.`,
  guidance: [
   { prompt: `Reverse the power rule: an antiderivative of ${r} has the form F(t) = At³ + Bt². What are A and B?`, answer: [A, B], explanation: `The derivative of At³ + Bt² is 3At² + 2Bt, so 3A = ${n(a)} and 2B = ${n(b)}: A = ${n(A)} and B = ${n(B)}.` },
   { prompt: `With F(t) = ${Ft}, what are F(${n(t1)}) and F(${n(t2)})?`, answer: [F1, F2], explanation: `F(${n(t1)}) = ${ev(t1)} and F(${n(t2)}) = ${ev(t2)}.` },
   { prompt: `The tank loses water, so its net change is −(F(${n(t2)}) − F(${n(t1)})). What is the net change, and how much water is in the tank at t = ${n(t2)}?`, answer: [net, fin], explanation: `F(${n(t2)}) − F(${n(t1)}) = ${n(F2)} − ${n(F1)} = ${n(loss)}, so the net change is −${n(loss)} litres. Added to the ${n(S)} litres at the start, it leaves ${n(fin)} litres in the tank.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Two pipes on the header tank',
 brief: 'The header tank has an inflow pipe that speeds up and an outflow pipe that stays steady, and Mira needs the level once both have run.',
 labels: ['net change (L)', 'amount at the end (L)'], tolerance: 0.01,
 gl: [['A', 'B', 'C'], ['F at the start', 'F at the end'], ['net change (L)', 'amount at the end (L)']]
}, {
 /* Net rate = inflow pt² + qt minus a steady k, so F(t) = (p ÷ 3)t³ + (q ÷ 2)t² − kt. The net change is positive and under 900. */
 canonical: { p: 3, q: 8, k: 12, t1: 1, t2: 4, S: 200 },
 draw: R => { let x; do { x = { p: R.pick([3, 6]), q: R.pick([2, 4, 6, 8, 10]), k: R.int(3, 15), t1: R.int(0, 2), S: 10 * R.int(5, 30) }; x.t2 = x.t1 + R.int(2, 4);
   const F = t => (x.p / 3) * cub(t) + (x.q / 2) * t * t - x.k * t, net = F(x.t2) - F(x.t1); x.ok = net >= 20 && net < 900; } while (!x.ok); delete x.ok; return x; },
 build: ({ p, q, k, t1, t2, S }) => { const A = p / 3, B = q / 2, F = t => A * cub(t) + B * t * t - k * t, F1 = F(t1), F2 = F(t2), net = F2 - F1, fin = S + net,
  rate = poly([p, q, -k], 't'), Ft = poly([A, B, -k, 0], 't'), ev = t => `${sum([A * cub(t), B * t * t, -k * t])} = ${n(F(t))}`; return {
  prompt: `Two pipes work on the header tank at once. The inflow pipe supplies ${poly([p, q, 0], 't')} litres per minute, where t is the number of minutes since the pumps started, while the outflow pipe takes away a steady ${n(k)} litres per minute. At t = ${n(t1)} the tank holds ${n(S)} litres. Enter the net change in the amount of water from t = ${n(t1)} to t = ${n(t2)}, then the amount in the tank at t = ${n(t2)}, both in litres.`,
  answer: [net, fin],
  hints: ['The two pipes work against each other: the rate at which the amount changes is the inflow minus the outflow. Subtract the rates before you integrate.', `Find an antiderivative of that net rate with constant 0, work out F(${n(t2)}) − F(${n(t1)}) for the net change, and add the net change to the amount at the start.`],
  solution: `The amount changes at the rate inflow − outflow = ${poly([p, q, 0], 't')} − ${n(k)} = ${rate} litres per minute. An antiderivative of that is F(t) = ${Ft}. F(${n(t2)}) = ${ev(t2)} and F(${n(t1)}) = ${ev(t1)}, so the net change is ${n(F2)} − (${n(F1)}) = ${n(net)} litres. By the Net Change Theorem the tank then holds ${n(S)} + ${n(net)} = ${n(fin)} litres.`,
  guidance: [
   { prompt: `The net rate is ${rate} litres per minute. An antiderivative has the form F(t) = At³ + Bt² + Ct. What are A, B and C?`, answer: [A, B, -k], explanation: `The derivative of At³ + Bt² + Ct is 3At² + 2Bt + C, so 3A = ${n(p)}, 2B = ${n(q)} and C = ${n(-k)}: A = ${n(A)}, B = ${n(B)} and C = ${n(-k)}.` },
   { prompt: `With F(t) = ${Ft}, what are F(${n(t1)}) and F(${n(t2)})?`, answer: [F1, F2], explanation: `F(${n(t1)}) = ${ev(t1)} and F(${n(t2)}) = ${ev(t2)}.` },
   { prompt: `What is the net change F(${n(t2)}) − F(${n(t1)}), and how much water is in the tank at t = ${n(t2)}?`, answer: [net, fin], explanation: `The net change is ${n(F2)} − (${n(F1)}) = ${n(net)} litres. Added to the ${n(S)} litres at the start, it leaves ${n(fin)} litres in the tank.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The slow start-up of the main inlet',
 brief: 'The main inlet comes up to speed over a long start-up cycle, and the log needs the litres it adds and the level in the storage tank afterwards.',
 labels: ['net change (L)', 'amount at the end (L)'], tolerance: 0.01,
 gl: [['A', 'B', 'C', 'D'], ['F at the start', 'F at the end'], ['net change (L)', 'amount at the end (L)']]
}, {
 /* r(t) = 4at³ + 3bt² + 2ct + d, so F(t) = at⁴ + bt³ + ct² + dt has whole coefficients. Harder numbers than q01: four terms and a cubic rate. */
 canonical: { a: 1, b: 2, c: 3, d: 5, t1: 1, t2: 4, S: 300 },
 draw: R => { const p = { a: R.int(1, 2), b: R.int(1, 3), c: R.int(1, 4), d: R.int(2, 12), t1: R.int(0, 2), S: 10 * R.int(10, 60) }; p.t2 = p.t1 + R.int(2, 3); return p; },
 build: ({ a, b, c, d, t1, t2, S }) => { const F = t => a * pw(t, 4) + b * cub(t) + c * t * t + d * t, F1 = F(t1), F2 = F(t2), net = F2 - F1, fin = S + net,
  r = poly([4 * a, 3 * b, 2 * c, d], 't'), Ft = poly([a, b, c, d, 0], 't'), ev = t => `${n(a)} × ${n(pw(t, 4))} + ${n(b)} × ${n(cub(t))} + ${n(c)} × ${n(t * t)} + ${n(d)} × ${n(t)} = ${n(F(t))}`; return {
  prompt: `The main inlet of the storage tank comes up to speed over a long start-up cycle: it delivers r(t) = ${r} litres per minute, where t is the number of minutes since the cycle began. At t = ${n(t1)} the tank holds ${n(S)} litres. Enter the net change in the amount of water from t = ${n(t1)} to t = ${n(t2)}, then the amount in the tank at t = ${n(t2)}, both in litres (type them without commas).`,
  answer: [net, fin],
  hints: ['Reverse the power rule on each of the four terms: the exponent goes up by 1 and you divide by the new exponent. Use constant 0.', `The net change is F(${n(t2)}) − F(${n(t1)}) for your antiderivative F. The amount at the end is the amount at the start plus the net change.`],
  solution: `An antiderivative of r(t) = ${r} is F(t) = ${Ft}. F(${n(t2)}) = ${ev(t2)} and F(${n(t1)}) = ${ev(t1)}, so the net change is ∫ from ${n(t1)} to ${n(t2)} of r(t) dt = ${n(F2)} − ${n(F1)} = ${n(net)} litres. By the Net Change Theorem the tank then holds ${n(S)} + ${n(net)} = ${n(fin)} litres.`,
  guidance: [
   { prompt: `Reverse the power rule: an antiderivative of ${r} has the form F(t) = At⁴ + Bt³ + Ct² + Dt. What are A, B, C and D?`, answer: [a, b, c, d], explanation: `The derivative of At⁴ + Bt³ + Ct² + Dt is 4At³ + 3Bt² + 2Ct + D, so 4A = ${n(4 * a)}, 3B = ${n(3 * b)}, 2C = ${n(2 * c)} and D = ${n(d)}: A = ${n(a)}, B = ${n(b)}, C = ${n(c)} and D = ${n(d)}.` },
   { prompt: `With F(t) = ${Ft}, what are F(${n(t1)}) and F(${n(t2)})?`, answer: [F1, F2], explanation: `F(${n(t1)}) = ${ev(t1)} and F(${n(t2)}) = ${ev(t2)}.` },
   { prompt: `What is the net change F(${n(t2)}) − F(${n(t1)}), and how much water is in the tank at t = ${n(t2)}?`, answer: [net, fin], explanation: `The net change is ${n(F2)} − ${n(F1)} = ${n(net)} litres. Added to the ${n(S)} litres at the start, it leaves ${n(fin)} litres in the tank.` }
  ] }; }
});

/* ---- q02 Accumulation functions: the derivative of ∫ₐˣ f(t) dt [1.3] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Silt on the filter bed',
 brief: 'A gauge on the filter bed keeps a running total of the silt that has settled, and Mira wants the total and how fast it is growing at one hour.',
 labels: ['running total (kg)', 'rate of growth (kg/h)'], tolerance: 0.01,
 gl: [['A', 'C'], ['G at the bottom end', 'G at the top end', 'running total (kg)'], ['rate of growth (kg/h)']]
}, {
 /* f(t) = pt² + q with p in {3, 6, 9}, so G(t) = (p ÷ 3)t³ + qt. F(b) = G(b) − G(a); F′(b) = f(b). Not the example (6t + 1 from 0). */
 canonical: { p: 6, q: 5, a: 1, b: 3 },
 draw: R => { let x; do { x = { p: R.pick([3, 6, 9]), q: R.int(2, 15), a: R.int(0, 3) }; x.b = x.a + R.int(2, 4);
   const G = t => (x.p / 3) * cub(t) + x.q * t; x.ok = G(x.b) - G(x.a) !== x.p * x.b * x.b + x.q && G(x.b) - G(x.a) < 1000; } while (!x.ok); delete x.ok; return x; },
 build: ({ p, q, a, b }) => { const A = p / 3, G = t => A * cub(t) + q * t, Ga = G(a), Gb = G(b), Fb = Gb - Ga, fb = p * b * b + q,
  f = poly([p, 0, q], 't'), Gs = poly([A, 0, q, 0], 't'), gev = t => `${n(A)} × ${n(cub(t))} + ${n(q)} × ${n(t)} = ${n(G(t))}`; return {
  prompt: `The silt gauge on the filter bed keeps a running total F(x) = ∫ from ${n(a)} to x of f(t) dt: the kilograms of silt that settled between hour ${n(a)} and hour x, where f(t) = ${f} kilograms per hour is the settling rate. Enter F(${n(b)}), then F′(${n(b)}), the rate at which the running total is growing at x = ${n(b)}, in kilograms per hour.`,
  answer: [Fb, fb],
  hints: ['F at a number is an ordinary definite integral: find an antiderivative of the integrand, with constant 0, and subtract its value at the bottom end from its value at the top end.', 'F′ needs no integral at all: the derivative of an accumulation function is its integrand, read at the top end.'],
  solution: `An antiderivative of the integrand is G(t) = ${Gs}. G(${n(b)}) = ${gev(b)} and G(${n(a)}) = ${gev(a)}, so F(${n(b)}) = ${n(Gb)} − ${n(Ga)} = ${n(Fb)} kilograms. The Fundamental Theorem of Calculus says F′(x) = f(x), so F′(${n(b)}) = f(${n(b)}) = ${n(p)} × ${n(b * b)} + ${n(q)} = ${n(fb)} kilograms per hour.`,
  guidance: [
   { prompt: `An antiderivative of the integrand ${f} has the form G(t) = At³ + Ct. What are A and C?`, answer: [A, q], explanation: `The derivative of At³ + Ct is 3At² + C, so 3A = ${n(p)} and C = ${n(q)}: A = ${n(A)} and C = ${n(q)}.` },
   { prompt: `With G(t) = ${Gs}, what are G(${n(a)}) and G(${n(b)}), and F(${n(b)}) = G(${n(b)}) − G(${n(a)})?`, answer: [Ga, Gb, Fb], explanation: `G(${n(a)}) = ${gev(a)} and G(${n(b)}) = ${gev(b)}, so F(${n(b)}) = ${n(Gb)} − ${n(Ga)} = ${n(Fb)} kilograms.` },
   { prompt: `The derivative of an accumulation function is its integrand at the top end: F′(x) = f(x). What is F′(${n(b)})?`, answer: [fb], explanation: `F′(${n(b)}) = f(${n(b)}) = ${n(p)} × ${n(b * b)} + ${n(q)} = ${n(fb)} kilograms per hour: at hour ${n(b)} the total grows exactly as fast as the silt settles.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Throttling the dosing pump',
 brief: 'The dosing pump must drop to its low setting the moment the running total of chlorine is growing at a set rate, and the log needs that hour and the total by then.',
 labels: ['hour x', 'total added (g)'], tolerance: 0.01,
 gl: [['hour x'], ['G at the bottom end', 'G at the top end'], ['total added (g)']]
}, {
 /* f(t) = pt² + q; R = f(x0) with x0 a whole hour at least 2 after the start a, so x² = (R − q) ÷ p is a perfect square. */
 canonical: { p: 6, q: 3, a: 2, x0: 5 },
 draw: R => { const x0 = R.int(3, 6); return { p: R.pick([3, 6, 9]), q: R.int(2, 15), a: R.int(0, x0 - 2), x0 }; },
 build: ({ p, q, a, x0 }) => { const A = p / 3, G = t => A * cub(t) + q * t, Ga = G(a), Gx = G(x0), F = Gx - Ga, rate = p * x0 * x0 + q,
  f = poly([p, 0, q], 't'), fx = poly([p, 0, q], 'x'), Gs = poly([A, 0, q, 0], 't'), gev = t => `${n(A)} × ${n(cub(t))} + ${n(q)} × ${n(t)} = ${n(G(t))}`; return {
  prompt: `The chlorine dosing pump logs the grams added since hour ${n(a)} as F(x) = ∫ from ${n(a)} to x of f(t) dt, where f(t) = ${f} grams per hour. The pump is switched to its low setting at the moment the running total is growing at ${n(rate)} grams per hour. Enter the hour x at which that happens, then the total F(x) added by that hour, in grams.`,
  answer: [x0, F],
  hints: ['The rate at which a running total grows is its derivative F′(x), and F′(x) is the integrand at x. Set that equal to the given rate and solve for x, keeping the positive solution.', 'Once you know the hour, F is an ordinary definite integral from the start hour to that hour: an antiderivative at the top end minus the same antiderivative at the bottom end.'],
  solution: `The total grows at the rate F′(x) = f(x), so ${fx} = ${n(rate)}. Then ${n(p)}x² = ${n(rate - q)}, x² = ${n((rate - q) / p)} and x = ${n(x0)}. An antiderivative of the integrand is G(t) = ${Gs}. G(${n(x0)}) = ${gev(x0)} and G(${n(a)}) = ${gev(a)}, so F(${n(x0)}) = ${n(Gx)} − ${n(Ga)} = ${n(F)} grams.`,
  guidance: [
   { prompt: `F′(x) = f(x), so solve ${fx} = ${n(rate)} for the positive x. What is x?`, answer: [x0], explanation: `${n(p)}x² = ${n(rate)} − ${n(q)} = ${n(rate - q)}, so x² = ${n((rate - q) / p)} and x = ${n(x0)}.` },
   { prompt: `An antiderivative of ${f} is G(t) = ${Gs}. What are G(${n(a)}) and G(${n(x0)})?`, answer: [Ga, Gx], explanation: `G(${n(a)}) = ${gev(a)} and G(${n(x0)}) = ${gev(x0)}.` },
   { prompt: `What is F(${n(x0)}) = G(${n(x0)}) − G(${n(a)}), in grams?`, answer: [F], explanation: `${n(Gx)} − ${n(Ga)} = ${n(F)} grams of chlorine added between hour ${n(a)} and hour ${n(x0)}.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'The storage reservoir ledger',
 brief: 'The storage reservoir log runs a cubic inflow, and Mira wants the running total, how fast it is growing, and the level in the reservoir at the hour that counts.',
 labels: ['running total (kL)', 'rate of growth (kL/h)', 'amount in the reservoir (kL)'], tolerance: 0.01,
 gl: [['A', 'B', 'C', 'D'], ['G at the bottom end', 'G at the top end', 'running total (kL)'], ['rate of growth (kL/h)', 'amount in the reservoir (kL)']]
}, {
 /* f(t) = 4At³ + 3Bt² + 2Ct + D with C nonzero, positive on [lo, hi]; G(t) = At⁴ + Bt³ + Ct² + Dt. The Net Change Theorem (q01) turns F into the amount. */
 canonical: { A: 1, B: 2, C: -3, D: 4, lo: 1, hi: 4, S: 200 },
 draw: R => { let x; do { x = { A: R.int(1, 2), B: R.int(1, 3), C: R.nz(-4, 4), D: R.int(2, 12), lo: R.int(0, 2), S: 10 * R.int(10, 50) }; x.hi = x.lo + R.int(2, 3);
   x.ok = true; for (let t = x.lo; t <= x.hi + 1e-9; t += 0.25) if (4 * x.A * t * t * t + 3 * x.B * t * t + 2 * x.C * t + x.D <= 0) x.ok = false; } while (!x.ok); delete x.ok; return x; },
 build: ({ A, B, C, D, lo, hi, S }) => { const G = t => A * pw(t, 4) + B * cub(t) + C * t * t + D * t, Glo = G(lo), Ghi = G(hi), Fb = Ghi - Glo, fb = 4 * A * cub(hi) + 3 * B * hi * hi + 2 * C * hi + D, V = S + Fb,
  f = poly([4 * A, 3 * B, 2 * C, D], 't'), Gs = poly([A, B, C, D, 0], 't'), gev = t => `${sum([A * pw(t, 4), B * cub(t), C * t * t, D * t])} = ${n(G(t))}`; return {
  prompt: `The storage reservoir log keeps a running total F(x) = ∫ from ${n(lo)} to x of f(t) dt: the kilolitres gained since hour ${n(lo)}, where f(t) = ${f} kilolitres per hour is the inflow rate. The reservoir held ${n(S)} kilolitres at hour ${n(lo)}. Enter F(${n(hi)}), then F′(${n(hi)}), then the amount in the reservoir at hour ${n(hi)}, in kilolitres (type them without commas).`,
  answer: [Fb, fb, V],
  hints: ['F at a number is an ordinary definite integral: reverse the power rule on each of the four terms, with constant 0, and subtract the value at the bottom end from the value at the top end.', `F′ needs no integral: it is the integrand at the top end. For the amount in the reservoir, add the starting amount to F(${n(hi)}), as the Net Change Theorem says.`],
  solution: `An antiderivative of the integrand is G(t) = ${Gs}. G(${n(hi)}) = ${gev(hi)} and G(${n(lo)}) = ${gev(lo)}, so F(${n(hi)}) = ${n(Ghi)} − (${n(Glo)}) = ${n(Fb)} kilolitres. The Fundamental Theorem of Calculus says F′(x) = f(x), so F′(${n(hi)}) = f(${n(hi)}) = ${sum([4 * A * cub(hi), 3 * B * hi * hi, 2 * C * hi, D])} = ${n(fb)} kilolitres per hour. By the Net Change Theorem the reservoir holds ${n(S)} + ${n(Fb)} = ${n(V)} kilolitres at hour ${n(hi)}.`,
  guidance: [
   { prompt: `An antiderivative of the integrand ${f} has the form G(t) = At⁴ + Bt³ + Ct² + Dt. What are A, B, C and D?`, answer: [A, B, C, D], explanation: `The derivative of At⁴ + Bt³ + Ct² + Dt is 4At³ + 3Bt² + 2Ct + D, so 4A = ${n(4 * A)}, 3B = ${n(3 * B)}, 2C = ${n(2 * C)} and D = ${n(D)}: A = ${n(A)}, B = ${n(B)}, C = ${n(C)} and D = ${n(D)}.` },
   { prompt: `With G(t) = ${Gs}, what are G(${n(lo)}) and G(${n(hi)}), and F(${n(hi)}) = G(${n(hi)}) − G(${n(lo)})?`, answer: [Glo, Ghi, Fb], explanation: `G(${n(lo)}) = ${gev(lo)} and G(${n(hi)}) = ${gev(hi)}, so F(${n(hi)}) = ${n(Ghi)} − (${n(Glo)}) = ${n(Fb)} kilolitres.` },
   { prompt: `F′(x) = f(x), so what is F′(${n(hi)})? Then add the ${n(S)} kilolitres at the start to F(${n(hi)}) for the amount in the reservoir.`, answer: [fb, V], explanation: `F′(${n(hi)}) = f(${n(hi)}) = ${sum([4 * A * cub(hi), 3 * B * hi * hi, 2 * C * hi, D])} = ${n(fb)} kilolitres per hour. The reservoir holds ${n(S)} + ${n(Fb)} = ${n(V)} kilolitres.` }
  ] }; }
});

/* ---- q03 Average value of a function on an interval [1.3] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Silt along the channel bed',
 brief: 'Silt has built up unevenly along the settling channel, and the dredging crew wants the one even depth that holds the same amount of silt.',
 labels: ['average thickness (mm)', 'distance c (m)'], tolerance: 0.005,
 gl: [['integral (mm·m)'], ['average thickness (mm)'], ['distance c (m)']]
}, {
 /* h(x) = 4mx³ + d, so H(x) = mx⁴ + dx. The integral is m(b⁴ − a⁴) + d(b − a), and dividing by b − a leaves the whole number m(a + b)(a² + b²) + d.
    h(c) = average gives c³ = (a + b)(a² + b²) ÷ 4, which lies between a³ and b³. Not the example (3x² on 0 to 2). */
 canonical: { m: 2, d: 3, a: 1, b: 3 },
 draw: R => { let p; do { p = { m: R.int(1, 3), d: R.int(1, 12), a: R.int(0, 2) }; p.b = p.a + R.int(2, 3); } while (edge(Math.cbrt((p.a + p.b) * (p.a * p.a + p.b * p.b) / 4), 2)); return p; },
 build: ({ m, d, a, b }) => { const H = x => m * pw(x, 4) + d * x, I = H(b) - H(a), len = b - a, avg = I / len, c3 = (a + b) * (a * a + b * b) / 4, c = r2(Math.cbrt(c3)),
  h = poly([4 * m, 0, 0, d], 'x'), Hs = poly([m, 0, 0, d, 0], 'x'), hev = x => `${n(m)} × ${n(pw(x, 4))} + ${n(d)} × ${n(x)} = ${n(H(x))}`; return {
  prompt: `Silt on the bed of the settling channel gets thicker with distance downstream: x metres from the weir the layer is h(x) = ${h} millimetres thick. Enter the average thickness of the silt from x = ${n(a)} to x = ${n(b)}, in millimetres, then the distance c in that stretch at which the thickness equals that average, in metres to 2 decimal places.`,
  answer: [avg, c],
  hints: ['The average value of a function on an interval is its definite integral over the interval divided by the length of the interval. Reverse the power rule on each term of h(x) to find the integral.', `For the distance, set ${poly([4 * m, 0, 0, d], 'c')} equal to the average, subtract the constant, divide, and then take the cube root of both sides (the 1/3 power on a calculator).`],
  solution: `An antiderivative of h(x) is H(x) = ${Hs}. H(${n(b)}) = ${hev(b)} and H(${n(a)}) = ${hev(a)}, so ∫ from ${n(a)} to ${n(b)} of h(x) dx = ${n(H(b))} − ${n(H(a))} = ${n(I)}. The stretch is ${n(b)} − ${n(a)} = ${n(len)} metres long, so the average thickness is ${n(I)} ÷ ${n(len)} = ${n(avg)} millimetres. Then ${poly([4 * m, 0, 0, d], 'c')} = ${n(avg)} gives ${n(4 * m)}c³ = ${n(avg - d)}, so c³ = ${n(avg - d)} ÷ ${n(4 * m)} = ${n(c3)} and c ≈ ${f2(c)} metres, which lies between ${n(a)} and ${n(b)}.`,
  guidance: [
   { prompt: `An antiderivative of ${h} is H(x) = ${Hs}. What is ∫ from ${n(a)} to ${n(b)} of h(x) dx?`, answer: [I], explanation: `H(${n(b)}) = ${hev(b)} and H(${n(a)}) = ${hev(a)}, so the integral is ${n(H(b))} − ${n(H(a))} = ${n(I)}.` },
   { prompt: `Divide the integral by the length of the stretch, ${n(b)} − ${n(a)} = ${n(len)} metres. What is the average thickness?`, answer: [avg], explanation: `${n(I)} ÷ ${n(len)} = ${n(avg)} millimetres. A layer of this even thickness would hold the same silt over the same stretch.` },
   { prompt: `Solve ${poly([4 * m, 0, 0, d], 'c')} = ${n(avg)} for the c between ${n(a)} and ${n(b)}, to 2 decimal places.`, answer: [c], explanation: `${n(4 * m)}c³ = ${n(avg)} − ${n(d)} = ${n(avg - d)}, so c³ = ${n(avg - d)} ÷ ${n(4 * m)} = ${n(c3)} and the cube root is c ≈ ${f2(c)} metres.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Swapping the back-flush valve',
 brief: 'The crew will replace a back-flush valve with a steady pump set to its average flow, and want the water each would pass.',
 labels: ['water through the valve (L)', 'steady rate (L/s)', 'water from the pump (L)'], tolerance: 0.01,
 gl: [['water through the valve (L)'], ['steady rate (L/s)'], ['water from the pump (L)']]
}, {
 /* r(t) = kt² + qt with k in {3, 6, 9} and q even, so H(t) = (k ÷ 3)t³ + (q ÷ 2)t². The draw keeps the average a whole number. */
 canonical: { k: 3, q: 4, a: 1, b: 3, T: 30 },
 draw: R => { let x; do { x = { k: R.pick([3, 6, 9]), q: R.pick([2, 4, 6, 8]), a: R.int(0, 3), T: 10 * R.int(2, 9) }; x.b = x.a + R.int(2, 4);
   const H = t => (x.k / 3) * cub(t) + (x.q / 2) * t * t; x.ok = (H(x.b) - H(x.a)) % (x.b - x.a) === 0; } while (!x.ok); delete x.ok; return x; },
 build: ({ k, q, a, b, T }) => { const A = k / 3, B = q / 2, H = t => A * cub(t) + B * t * t, I = H(b) - H(a), len = b - a, avg = I / len, tot = avg * T,
  r = poly([k, q, 0], 't'), Hs = poly([A, B, 0, 0], 't'), hev = t => `${n(A)} × ${n(cub(t))} + ${n(B)} × ${n(t * t)} = ${n(H(t))}`; return {
  prompt: `A back-flush valve passes water at r(t) = ${r} litres per second, t seconds after it opens. The crew plan to swap it for a steady pump set to the average rate of the valve from t = ${n(a)} to t = ${n(b)}. Enter the litres the valve passes from t = ${n(a)} to t = ${n(b)}, then the steady rate of the pump in litres per second, then the litres the steady pump would pass in ${n(T)} seconds (type it without commas).`,
  answer: [I, avg, tot],
  hints: ['The water the valve passes is the definite integral of its rate over the interval. The steady rate that passes the same water in the same time is the average value of r(t): that integral divided by the length of the interval.', 'A steady pump passes its rate times the time it runs. Use the average rate you found, not r at either end.'],
  solution: `An antiderivative of r(t) is H(t) = ${Hs}. H(${n(b)}) = ${hev(b)} and H(${n(a)}) = ${hev(a)}, so the valve passes ${n(H(b))} − ${n(H(a))} = ${n(I)} litres. The interval lasts ${n(b)} − ${n(a)} = ${n(len)} seconds, so the average rate is ${n(I)} ÷ ${n(len)} = ${n(avg)} litres per second. A steady pump at that rate passes ${n(avg)} × ${n(T)} = ${n(tot)} litres in ${n(T)} seconds.`,
  guidance: [
   { prompt: `An antiderivative of ${r} is H(t) = ${Hs}. What is ∫ from ${n(a)} to ${n(b)} of r(t) dt, in litres?`, answer: [I], explanation: `H(${n(b)}) = ${hev(b)} and H(${n(a)}) = ${hev(a)}, so the integral is ${n(H(b))} − ${n(H(a))} = ${n(I)} litres.` },
   { prompt: `Divide the integral by the length of the interval, ${n(b)} − ${n(a)} = ${n(len)} seconds. What is the steady rate?`, answer: [avg], explanation: `${n(I)} ÷ ${n(len)} = ${n(avg)} litres per second, the average value of r(t).` },
   { prompt: `A steady pump at ${n(avg)} litres per second runs for ${n(T)} seconds. How many litres does it pass?`, answer: [tot], explanation: `${n(avg)} × ${n(T)} = ${n(tot)} litres.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'Average inflow and the running total',
 brief: 'The reservoir log has a running total and a quoted average inflow for the same spell, and Mira wants to see how the two compare with the inflow at its end.',
 labels: ['running total (kL)', 'average inflow (kL/h)', 'rate of growth (kL/h)'], tolerance: 0.005,
 gl: [['running total (kL)'], ['average inflow (kL/h)'], ['rate of growth (kL/h)']]
}, {
 /* f(t) = 3pt² + 2qt + d, G(t) = pt³ + qt² + dt. The length of the spell is 2, 4 or 5 hours, so the average has at most 2 decimals. */
 canonical: { p: 2, q: 3, d: 4, a: 1, len: 4 },
 draw: R => { let x; do { x = { p: R.int(1, 3), q: R.int(1, 4), d: R.int(2, 9), a: R.int(0, 3), len: R.pick([2, 4, 5]) }; x.ok = x.p * cub(x.a + x.len) + x.q * (x.a + x.len) * (x.a + x.len) + x.d * (x.a + x.len) < 1000; } while (!x.ok); delete x.ok; return x; },
 build: ({ p, q, d, a, len }) => { const b = a + len, G = t => p * cub(t) + q * t * t + d * t, Fb = G(b) - G(a), avg = Fb / len, fb = 3 * p * b * b + 2 * q * b + d,
  f = poly([3 * p, 2 * q, d], 't'), Gs = poly([p, q, d, 0], 't'), gev = t => `${n(p)} × ${n(cub(t))} + ${n(q)} × ${n(t * t)} + ${n(d)} × ${n(t)} = ${n(G(t))}`; return {
  prompt: `The reservoir log keeps a running total F(x) = ∫ from ${n(a)} to x of f(t) dt, where f(t) = ${f} kilolitres per hour is the inflow rate, and the control room quotes the average value of f over the spell from hour ${n(a)} to hour ${n(b)}. Enter F(${n(b)}), then that average value, then F′(${n(b)}), in kilolitres and kilolitres per hour.`,
  answer: [Fb, avg, fb],
  hints: ['F(b) is an ordinary definite integral of the integrand from the start hour to hour b. The average value of f over the spell is that same integral divided by the length of the spell.', 'The rate at which the running total is growing at the end of the spell is F′, which is the integrand at the top end: no integral and no division.'],
  solution: `An antiderivative of the integrand is G(t) = ${Gs}. G(${n(b)}) = ${gev(b)} and G(${n(a)}) = ${gev(a)}, so F(${n(b)}) = ${n(G(b))} − ${n(G(a))} = ${n(Fb)} kilolitres. The spell lasts ${n(b)} − ${n(a)} = ${n(len)} hours, so the average value of f is ${n(Fb)} ÷ ${n(len)} = ${n(avg)} kilolitres per hour. Since F′(x) = f(x), F′(${n(b)}) = f(${n(b)}) = ${sum([3 * p * b * b, 2 * q * b, d])} = ${n(fb)} kilolitres per hour, which is more than the average because the inflow keeps rising.`,
  guidance: [
   { prompt: `An antiderivative of ${f} is G(t) = ${Gs}. What is F(${n(b)}) = G(${n(b)}) − G(${n(a)})?`, answer: [Fb], explanation: `G(${n(b)}) = ${gev(b)} and G(${n(a)}) = ${gev(a)}, so F(${n(b)}) = ${n(G(b))} − ${n(G(a))} = ${n(Fb)} kilolitres.` },
   { prompt: `Divide F(${n(b)}) by the length of the spell, ${n(b)} − ${n(a)} = ${n(len)} hours. What is the average value of f?`, answer: [avg], explanation: `${n(Fb)} ÷ ${n(len)} = ${n(avg)} kilolitres per hour.` },
   { prompt: `F′(x) = f(x), the integrand at the top end. What is F′(${n(b)})?`, answer: [fb], explanation: `F′(${n(b)}) = f(${n(b)}) = ${sum([3 * p * b * b, 2 * q * b, d])} = ${n(fb)} kilolitres per hour.` }
  ] }; }
});

/* ---- q04 Substitution, including changing the limits [1.5] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The dosing pump curve',
 brief: 'The clarifier dosing pump follows a formula with one function inside another, and the log needs the chemical it adds without multiplying out the brackets.',
 labels: ['lower limit in u', 'upper limit in u', 'integral (g)'], tolerance: 0.01,
 gl: [['lower limit in u', 'upper limit in u'], ['k'], ['integral (g)']]
}, {
 /* r(t) = 3(m + 1)s · t²(t³ + c)ᵐ with u = t³ + c, du = 3t² dt: the integral is ∫ (m + 1)s uᵐ du = s·u^(m+1) between the new limits. */
 canonical: { c: 2, m: 2, s: 1, a: 0, b: 2 },
 draw: R => { let x; do { x = { c: R.int(1, 5), m: R.pick([2, 3]), s: R.pick([1, 2]), a: R.int(0, 1) }; x.b = x.a ? 2 : R.int(1, 2); } while (x.s * pw(x.b * x.b * x.b + x.c, x.m + 1) >= 100000); return x; },
 build: ({ c, m, s, a, b }) => { const P = m + 1, K = 3 * P * s, g = P * s, ua = cub(a) + c, ub = cub(b) + c, Pa = pw(ua, P), Pb = pw(ub, P), val = s * (Pb - Pa),
  inner = `t³ + ${n(c)}`, r = `${n(K)}t²(${inner})${SUP[m]}`, uu = `${n(g)}u${SUP[m]}`, anti = `${co(s)}u${SUP[P]}`,
  work = s === 1 ? `${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]} = ${n(Pb)} − ${n(Pa)} = ${n(val)}` : `${n(s)}(${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]}) = ${n(s)} × (${n(Pb)} − ${n(Pa)}) = ${n(val)}`; return {
  prompt: `The dosing pump at the clarifier feeds chemical at r(t) = ${r} grams per minute, t minutes after it starts. Find the chemical added from t = ${n(a)} to t = ${n(b)}, ∫ from ${n(a)} to ${n(b)} of r(t) dt, with the substitution u = ${inner}. Enter the new lower limit and the new upper limit in u, then the value of the integral in grams (type it without commas).`,
  answer: [ua, ub, val],
  hints: [`With u = ${inner}, du = 3t² dt, so the factor ${n(K)}t² dt in the integral is ${n(g)} du.`, 'Change the limits with the substitution too: put each end value of t into u. Then the integral is in u alone, you never go back to t, and you evaluate the antiderivative at the two new limits.'],
  solution: `Let u = ${inner}. Then du = 3t² dt, so ${n(K)}t² dt = ${n(g)} du. At t = ${n(a)}, u = ${n(cub(a))} + ${n(c)} = ${n(ua)}; at t = ${n(b)}, u = ${n(cub(b))} + ${n(c)} = ${n(ub)}. The integral becomes ∫ from ${n(ua)} to ${n(ub)} of ${uu} du. An antiderivative of ${uu} is ${anti}, so the value is ${work} grams.`,
  guidance: [
   { prompt: `With u = ${inner}, what is u at t = ${n(a)}, and what is u at t = ${n(b)}?`, answer: [ua, ub], explanation: `At t = ${n(a)}, u = ${n(cub(a))} + ${n(c)} = ${n(ua)}. At t = ${n(b)}, u = ${n(cub(b))} + ${n(c)} = ${n(ub)}. These are the new limits.` },
   { prompt: `du = 3t² dt. The integral has ${n(K)}t² dt in it, which is k du for which number k?`, answer: [g], explanation: `${n(K)}t² dt = ${n(g)} × 3t² dt = ${n(g)} du, so the integral becomes ∫ from ${n(ua)} to ${n(ub)} of ${uu} du.` },
   { prompt: `An antiderivative of ${uu} is ${anti}. What is ∫ from ${n(ua)} to ${n(ub)} of ${uu} du?`, answer: [val], explanation: `${work} grams.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The header tank top-up',
 brief: 'A valve on the header tank opens steadily and its flow follows a bracketed formula, and Mira needs the water it adds and the level afterwards.',
 labels: ['lower limit in u', 'upper limit in u', 'water added (L)', 'amount at the end (L)'], tolerance: 0.01,
 gl: [['lower limit in u', 'upper limit in u'], ['k'], ['water added (L)', 'amount at the end (L)']]
}, {
 /* r(t) = w(m + 1)s · (wt + c)ᵐ with u = wt + c, du = w dt: the integral is ∫ (m + 1)s uᵐ du = s·u^(m+1) between the new limits. */
 canonical: { w: 2, c: 3, m: 2, s: 1, t1: 1, t2: 3, S: 150 },
 draw: R => { const p = { w: R.pick([2, 3]), c: R.int(1, 5), m: R.pick([2, 3]), s: R.pick([1, 2]), t1: R.int(0, 1), S: 10 * R.int(5, 30) }; p.t2 = p.t1 + R.int(1, 2); return p; },
 build: ({ w, c, m, s, t1, t2, S }) => { const P = m + 1, K = w * P * s, g = P * s, ua = w * t1 + c, ub = w * t2 + c, Pa = pw(ua, P), Pb = pw(ub, P), val = s * (Pb - Pa), fin = S + val,
  inner = `${n(w)}t + ${n(c)}`, r = `${n(K)}(${inner})${SUP[m]}`, uu = `${n(g)}u${SUP[m]}`, anti = `${co(s)}u${SUP[P]}`,
  work = s === 1 ? `${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]} = ${n(Pb)} − ${n(Pa)} = ${n(val)}` : `${n(s)}(${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]}) = ${n(s)} × (${n(Pb)} − ${n(Pa)}) = ${n(val)}`; return {
  prompt: `A valve that opens steadily tops up the header tank: its flow is r(t) = ${r} litres per minute, t minutes after it begins to open, and at t = ${n(t1)} the tank holds ${n(S)} litres. Use the substitution u = ${inner} to find the water added from t = ${n(t1)} to t = ${n(t2)}. Enter the new lower limit and the new upper limit in u, then the water added, then the amount in the tank at t = ${n(t2)}, both in litres (type them without commas).`,
  answer: [ua, ub, val, fin],
  hints: [`With u = ${inner}, du = ${n(w)} dt, so the factor ${n(K)} dt in the integral is ${n(g)} du.`, 'Put each end value of t into u for the new limits, then evaluate an antiderivative in u at them. The amount at the end is the amount at the start plus the water added.'],
  solution: `Let u = ${inner}. Then du = ${n(w)} dt, so ${n(K)} dt = ${n(g)} du. At t = ${n(t1)}, u = ${n(w * t1)} + ${n(c)} = ${n(ua)}; at t = ${n(t2)}, u = ${n(w * t2)} + ${n(c)} = ${n(ub)}. The water added is ∫ from ${n(ua)} to ${n(ub)} of ${uu} du. An antiderivative of ${uu} is ${anti}, so the value is ${work} litres. By the Net Change Theorem the tank holds ${n(S)} + ${n(val)} = ${n(fin)} litres at t = ${n(t2)}.`,
  guidance: [
   { prompt: `With u = ${inner}, what is u at t = ${n(t1)}, and what is u at t = ${n(t2)}?`, answer: [ua, ub], explanation: `At t = ${n(t1)}, u = ${n(w * t1)} + ${n(c)} = ${n(ua)}. At t = ${n(t2)}, u = ${n(w * t2)} + ${n(c)} = ${n(ub)}. These are the new limits.` },
   { prompt: `du = ${n(w)} dt. The integral has ${n(K)} dt in it, which is k du for which number k?`, answer: [g], explanation: `${n(K)} dt = ${n(g)} × ${n(w)} dt = ${n(g)} du, so the integral becomes ∫ from ${n(ua)} to ${n(ub)} of ${uu} du.` },
   { prompt: `An antiderivative of ${uu} is ${anti}. What is ∫ from ${n(ua)} to ${n(ub)} of ${uu} du, and how much water is in the tank at t = ${n(t2)}?`, answer: [val, fin], explanation: `${work} litres. Added to the ${n(S)} litres at the start, that leaves ${n(fin)} litres.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q03', title: 'The average outlet flow',
 brief: 'The reservoir outlet pump follows a high-powered bracket formula, and the log needs the water it moves and the steady flow that would match it.',
 labels: ['lower limit in u', 'upper limit in u', 'integral (L)', 'average value (L/min)'], tolerance: 0.01,
 gl: [['lower limit in u', 'upper limit in u'], ['integral (L)'], ['average value (L/min)']]
}, {
 /* r(t) = 2(m + 1)s · t(t² + c)ᵐ with u = t² + c: the integral is s·u^(m+1) between the new limits. The spell lasts 1 or 2 minutes, so the average has at most one decimal. */
 canonical: { c: 2, m: 3, s: 2, a: 1, len: 2 },
 draw: R => { let x; do { x = { c: R.int(1, 6), m: R.pick([3, 4]), s: R.int(1, 3), a: R.int(0, 2), len: R.pick([1, 2]) }; } while (x.s * pw((x.a + x.len) * (x.a + x.len) + x.c, x.m + 1) >= 100000); return x; },
 build: ({ c, m, s, a, len }) => { const b = a + len, P = m + 1, K = 2 * P * s, g = P * s, ua = a * a + c, ub = b * b + c, Pa = pw(ua, P), Pb = pw(ub, P), val = s * (Pb - Pa), avg = val / len,
  inner = `t² + ${n(c)}`, r = `${n(K)}t(${inner})${SUP[m]}`, uu = `${n(g)}u${SUP[m]}`, anti = `${co(s)}u${SUP[P]}`,
  work = s === 1 ? `${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]} = ${n(Pb)} − ${n(Pa)} = ${n(val)}` : `${n(s)}(${n(ub)}${SUP[P]} − ${n(ua)}${SUP[P]}) = ${n(s)} × (${n(Pb)} − ${n(Pa)}) = ${n(val)}`; return {
  prompt: `The reservoir outlet pump moves water at r(t) = ${r} litres per minute, t minutes after it starts. Use the substitution u = ${inner} on ∫ from ${n(a)} to ${n(b)} of r(t) dt. Enter the new lower limit and the new upper limit in u, then the water moved in litres (type it without commas), then the average value of r(t) from t = ${n(a)} to t = ${n(b)}, in litres per minute.`,
  answer: [ua, ub, val, avg],
  hints: [`With u = ${inner}, du = 2t dt, so the factor ${n(K)}t dt in the integral is ${n(g)} du. Change the limits too: put each end value of t into u.`, 'The average value of r(t) on the interval is its definite integral over the interval divided by the length of the interval.'],
  solution: `Let u = ${inner}. Then du = 2t dt, so ${n(K)}t dt = ${n(g)} du. At t = ${n(a)}, u = ${n(a * a)} + ${n(c)} = ${n(ua)}; at t = ${n(b)}, u = ${n(b * b)} + ${n(c)} = ${n(ub)}. The integral becomes ∫ from ${n(ua)} to ${n(ub)} of ${uu} du. An antiderivative of ${uu} is ${anti}, so the value is ${work} litres. The interval lasts ${n(b)} − ${n(a)} = ${n(len)} ${len === 1 ? 'minute' : 'minutes'}, so the average value is ${n(val)} ÷ ${n(len)} = ${n(avg)} litres per minute.`,
  guidance: [
   { prompt: `With u = ${inner}, what is u at t = ${n(a)}, and what is u at t = ${n(b)}?`, answer: [ua, ub], explanation: `At t = ${n(a)}, u = ${n(a * a)} + ${n(c)} = ${n(ua)}. At t = ${n(b)}, u = ${n(b * b)} + ${n(c)} = ${n(ub)}. These are the new limits.` },
   { prompt: `du = 2t dt, so ${n(K)}t dt = ${n(g)} du and the integral is ∫ from ${n(ua)} to ${n(ub)} of ${uu} du. An antiderivative of ${uu} is ${anti}. What is the value of the integral?`, answer: [val], explanation: `${work} litres.` },
   { prompt: `Divide the integral by the length of the interval, ${n(b)} − ${n(a)} = ${n(len)} ${len === 1 ? 'minute' : 'minutes'}. What is the average value of r(t)?`, answer: [avg], explanation: `${n(val)} ÷ ${n(len)} = ${n(avg)} litres per minute.` }
  ] }; }
});

/* ---- q05 Integrals that give ln|x| and eˣ [1.6] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Dosing the filter bed',
 brief: 'Two chemicals are laid along the filter bed, one thinning out with distance and one thickening, and the log needs the grams of each.',
 labels: ['first chemical (g)', 'second chemical (g)'], tolerance: 0.0005,
 gl: [['first chemical (g)'], ['e⁰', 'value at the top end'], ['second chemical (g)']]
}, {
 /* First chemical k ÷ x from x = p to x = q (ln), second m·eˣ from 0 to T (its own antiderivative). Both rounded to 3 places. */
 canonical: { k: 6, p: 2, q: 7, m: 5, T: 2 },
 /* k = 3 from x = 2 to x = 6 would be the first integral of the worked example. */
 draw: R => { let p; do { p = { k: R.int(2, 12), p: R.int(1, 4), m: R.int(2, 12), T: R.int(1, 3) }; p.q = p.p + R.int(1, 6); } while (p.k === 3 && p.p === 2 && p.q === 6); return p; },
 build: ({ k, p, q, m, T }) => { const A = r3(k * Math.log(q / p)), top = m * Math.exp(T), B = r3(m * (Math.exp(T) - 1)); return {
  prompt: `Two chemicals are laid along the filter bed. The first is laid at ${n(k)} ÷ x grams per metre and the second at ${n(m)}eˣ grams per metre, where x is the distance along the bed in metres. Enter the grams of the first chemical laid from x = ${n(p)} to x = ${n(q)}, then the grams of the second chemical laid from x = 0 to x = ${n(T)}, both to 3 decimal places.`,
  answer: [A, B],
  hints: [`An antiderivative of ${n(k)} ÷ x is ${n(k)} ln|x|: the power rule cannot do 1 ÷ x, and ln|x| fills the gap.`, 'The function eˣ is its own antiderivative, so an antiderivative of the second rate is the second rate itself. Keep every digit on the calculator and round only at the end.'],
  solution: `First chemical: an antiderivative of ${n(k)} ÷ x is ${n(k)} ln|x|, so the grams laid are ${n(k)} ln ${n(q)} − ${n(k)} ln ${n(p)} = ${n(k)} ln(${n(q)} ÷ ${n(p)}) ≈ ${f3(A)}. Second chemical: an antiderivative of ${n(m)}eˣ is ${n(m)}eˣ, so the grams laid are ${n(m)}e^${n(T)} − ${n(m)}e⁰ = ${n(m)}e^${n(T)} − ${n(m)} ≈ ${f3(B)}.`,
  guidance: [
   { prompt: `First chemical: ∫ from ${n(p)} to ${n(q)} of ${n(k)} ÷ x dx = ${n(k)} ln ${n(q)} − ${n(k)} ln ${n(p)}. What is that to 3 decimal places?`, answer: [A], explanation: `${n(k)} ln ${n(q)} − ${n(k)} ln ${n(p)} = ${n(k)} ln(${n(q)} ÷ ${n(p)}) ≈ ${f3(A)} grams.` },
   { prompt: `Second chemical: an antiderivative of ${n(m)}eˣ is ${n(m)}eˣ. What is e⁰, and what is ${n(m)}e^${n(T)} to 3 decimal places?`, answer: [1, r3(top)], explanation: `e⁰ = 1, and ${n(m)}e^${n(T)} ≈ ${f3(top)}.` },
   { prompt: `Subtract: ${n(m)}e^${n(T)} − ${n(m)} × 1. What is that to 3 decimal places?`, answer: [B], explanation: `${n(m)}e^${n(T)} − ${n(m)} = ${n(m)}(e^${n(T)} − 1) ≈ ${f3(B)} grams.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Filling against a drain',
 brief: 'A slowing pump fills a holding tank while a fading drain takes some of the water back out, and Mira needs both amounts and the level at the end.',
 labels: ['pumped in (L)', 'drained out (L)', 'amount at the end (L)'], tolerance: 0.0005,
 gl: [['pumped in (L)'], ['drained out (L)'], ['amount at the end (L)']]
}, {
 /* Pump k ÷ (t + c) in, drain m·e^(−t) out, both from t = 0 to T. The amount at the end is S + in − out, rounded once from the exact values. */
 canonical: { k: 9, c: 5, m: 3, T: 3, S: 70 },
 /* A draw is kept only when adding the two parts rounded to 3 places gives the same final amount as the exact sum, so a
    player who rounds the parts first is not marked wrong, and no answer sits on a rounding edge. */
 draw: R => { let p; do { p = { k: R.int(2, 12), c: R.int(1, 5), m: R.int(2, 12), T: R.int(2, 6), S: 10 * R.int(3, 20) }; }
  while ((() => { const inn = p.k * Math.log((p.T + p.c) / p.c), out = p.m * (1 - Math.exp(-p.T)), fin = p.S + inn - out;
   return edge(inn, 3) || edge(out, 3) || edge(fin, 3) || r3(p.S + r3(inn) - r3(out)) !== r3(fin); })()); return p; },
 build: ({ k, c, m, T, S }) => { const inn = k * Math.log((T + c) / c), out = m * (1 - Math.exp(-T)), A = r3(inn), B = r3(out), fin = r3(S + inn - out); return {
  prompt: `A holding tank is filled by a pump that slows down as the line pressure falls, delivering ${n(k)} ÷ (t + ${n(c)}) litres per minute, while a drain that is fading shut takes water out at ${n(m)}e^(−t) litres per minute, both t minutes after they start. At t = 0 the tank holds ${n(S)} litres. Enter the litres pumped in from t = 0 to t = ${n(T)}, the litres drained out over the same time, then the amount in the tank at t = ${n(T)}, all to 3 decimal places.`,
  answer: [A, B, fin],
  hints: [`An antiderivative of ${n(k)} ÷ (t + ${n(c)}) is ${n(k)} ln|t + ${n(c)}|, and an antiderivative of ${n(m)}e^(−t) is −${n(m)}e^(−t): the chain rule explains both.`, 'The amount at the end is the amount at the start, plus the water pumped in, minus the water drained out. Keep every digit on the calculator and round only at the end.'],
  solution: `Pumped in: an antiderivative of ${n(k)} ÷ (t + ${n(c)}) is ${n(k)} ln|t + ${n(c)}|, so the litres are ${n(k)} ln ${n(T + c)} − ${n(k)} ln ${n(c)} = ${n(k)} ln(${n(T + c)} ÷ ${n(c)}) ≈ ${f3(A)}. Drained out: an antiderivative of ${n(m)}e^(−t) is −${n(m)}e^(−t), so the litres are −${n(m)}e^(−${n(T)}) − (−${n(m)}e⁰) = ${n(m)} − ${n(m)}e^(−${n(T)}) ≈ ${f3(B)}. By the Net Change Theorem the tank holds ${n(S)} + ${n(k)} ln(${n(T + c)} ÷ ${n(c)}) − ${n(m)}(1 − e^(−${n(T)})) ≈ ${f3(fin)} litres.`,
  guidance: [
   { prompt: `Pumped in: ∫ from 0 to ${n(T)} of ${n(k)} ÷ (t + ${n(c)}) dt = ${n(k)} ln ${n(T + c)} − ${n(k)} ln ${n(c)}. What is that to 3 decimal places?`, answer: [A], explanation: `${n(k)} ln ${n(T + c)} − ${n(k)} ln ${n(c)} = ${n(k)} ln(${n(T + c)} ÷ ${n(c)}) ≈ ${f3(A)} litres.` },
   { prompt: `Drained out: ∫ from 0 to ${n(T)} of ${n(m)}e^(−t) dt = −${n(m)}e^(−${n(T)}) − (−${n(m)}). What is that to 3 decimal places?`, answer: [B], explanation: `−${n(m)}e^(−${n(T)}) + ${n(m)} = ${n(m)}(1 − e^(−${n(T)})) ≈ ${f3(B)} litres.` },
   { prompt: `The tank gains the pumped water and loses the drained water: ${n(S)} + ${n(k)} ln(${n(T + c)} ÷ ${n(c)}) − ${n(m)}(1 − e^(−${n(T)})). What is the amount in the tank, to 3 decimal places?`, answer: [fin], explanation: `${n(S)} + ${f3(A)} − ${f3(B)} ≈ ${f3(fin)} litres. Use every digit of each part on the calculator and round only at the end.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'Two relief valves',
 brief: 'Two relief valves ease the pressure in the reservoir main, one with a bracket in its denominator and one with a fading exponent, and the log needs the litres through each.',
 labels: ['lower limit in u', 'upper limit in u', 'valve A (L)', 'valve B (L)'], tolerance: 0.0005,
 gl: [['lower limit in u', 'upper limit in u'], ['valve A (L)'], ['valve B (L)']]
}, {
 /* Valve A: 2wt ÷ (t² + c), u = t² + c, du = 2t dt, so the integral is w ln(ub ÷ ua). Valve B: 2wt·e^(−t²), u = −t², du = −2t dt, so it is w(1 − e^(−T²)). */
 canonical: { w: 3, c: 2, a: 1, b: 3, T: 2 },
 draw: R => { const p = { w: R.int(2, 9), c: R.int(1, 5), a: R.int(0, 2), T: R.pick([1, 2]) }; p.b = p.a + R.int(1, 3); return p; },
 build: ({ w, c, a, b, T }) => { const K = 2 * w, ua = a * a + c, ub = b * b + c, A = r3(w * Math.log(ub / ua)), B = r3(w * (1 - Math.exp(-T * T))), inner = `t² + ${n(c)}`; return {
  prompt: `Two relief valves ease the pressure in the reservoir main, t seconds after they open. Valve A passes ${n(K)}t ÷ (${inner}) litres per second and valve B passes ${n(K)}te^(−t²) litres per second. For valve A use the substitution u = ${inner}. Enter the new lower limit and the new upper limit in u for the litres through valve A from t = ${n(a)} to t = ${n(b)}, then those litres to 3 decimal places, then the litres through valve B from t = 0 to t = ${n(T)} to 3 decimal places.`,
  answer: [ua, ub, A, B],
  hints: [`For valve A, du = 2t dt, so ${n(K)}t dt = ${n(w)} × 2t dt = ${n(w)} du and the integral becomes ${n(w)} times the integral of 1 ÷ u, whose antiderivative is ln|u|. Put each end value of t into u for the limits.`, `For valve B, try u = −t²: then du = −2t dt, so ${n(K)}t dt = −${n(w)} du, and an antiderivative of eᵘ is eᵘ. The limits are the values of −t² at t = 0 and t = ${n(T)}. Keep every digit on the calculator and round only at the end.`],
  solution: `Valve A: let u = ${inner}, so du = 2t dt and ${n(K)}t dt = ${n(w)} du. At t = ${n(a)}, u = ${n(a * a)} + ${n(c)} = ${n(ua)}; at t = ${n(b)}, u = ${n(b * b)} + ${n(c)} = ${n(ub)}. The integral is ${n(w)} ∫ from ${n(ua)} to ${n(ub)} of 1 ÷ u du = ${n(w)} ln ${n(ub)} − ${n(w)} ln ${n(ua)} = ${n(w)} ln(${n(ub)} ÷ ${n(ua)}) ≈ ${f3(A)} litres. Valve B: let u = −t², so du = −2t dt and ${n(K)}t dt = −${n(w)} du. At t = 0, u = 0; at t = ${n(T)}, u = −${n(T * T)}. The integral is −${n(w)} ∫ from 0 to −${n(T * T)} of eᵘ du = −${n(w)}(e^(−${n(T * T)}) − e⁰) = ${n(w)}(1 − e^(−${n(T * T)})) ≈ ${f3(B)} litres.`,
  guidance: [
   { prompt: `For valve A, u = ${inner}. What is u at t = ${n(a)}, and what is u at t = ${n(b)}?`, answer: [ua, ub], explanation: `At t = ${n(a)}, u = ${n(a * a)} + ${n(c)} = ${n(ua)}. At t = ${n(b)}, u = ${n(b * b)} + ${n(c)} = ${n(ub)}. These are the new limits.` },
   { prompt: `du = 2t dt, so ${n(K)}t dt = ${n(w)} du and valve A is ${n(w)} ∫ from ${n(ua)} to ${n(ub)} of 1 ÷ u du = ${n(w)} ln ${n(ub)} − ${n(w)} ln ${n(ua)}. What is that to 3 decimal places?`, answer: [A], explanation: `${n(w)} ln ${n(ub)} − ${n(w)} ln ${n(ua)} = ${n(w)} ln(${n(ub)} ÷ ${n(ua)}) ≈ ${f3(A)} litres.` },
   { prompt: `For valve B, u = −t² gives ${n(K)}t dt = −${n(w)} du and the limits 0 and −${n(T * T)}, so valve B is −${n(w)} ∫ from 0 to −${n(T * T)} of eᵘ du = ${n(w)} − ${n(w)}e^(−${n(T * T)}). What is that to 3 decimal places?`, answer: [B], explanation: `${n(w)}(1 − e^(−${n(T * T)})) ≈ ${f3(B)} litres.` }
  ] }; }
});

})();
