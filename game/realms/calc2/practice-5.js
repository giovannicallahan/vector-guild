/* Calculus 2: accumulation practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p5.js. */
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
const r3 = x => Math.round(x * 1000) / 1000;
/* "+ 4" or "− 4" for a signed term; lin(c, d, 't') is "3t − 2" with no written-out 1 and no "+ 0". */
const sg = v => (v < 0 ? '−' : '+') + ' ' + n(Math.abs(v));
const lin = (c, d, x) => `${c === 1 ? '' : c === -1 ? '−' : n(c)}${x}${d === 0 ? '' : ' ' + sg(d)}`;
const pw = (v, p) => p === 1 ? v : v + (p === 2 ? '²' : '³');

/* ---- q21 Partial fractions [3.4] ---- */

/* Shared by q21b, q21c, q21d: (A(x + b) + B(x + a)) ÷ ((x + a)(x + b)) over [p, q]. Both numerators are whole numbers. */
const pfDraw = (R, lo, hi, amax) => {
 let A, B; do { A = R.int(-4, amax); B = R.int(-4, amax); } while (!A || !B || A + B === 0);
 const a = R.int(1, 4), b = a + R.int(1, 3), p = R.int(lo, hi), q = p + R.int(2, 4);
 return { A, B, a, b, p, q };
};
const pfCalc = ({ A, B, a, b, p, q }) => {
 const c1 = A + B, c0 = A * b + B * a, vA = -a * c1 + c0, vB = -b * c1 + c0;
 const t1 = A * Math.log((q + a) / (p + a)), t2 = B * Math.log((q + b) / (p + b));
 return { c1, c0, vA, vB, t1, t2, I: t1 + t2 };
};
/* The two "put x = −a" sentences, for the variable V. */
const pfSolve = (V, P, c) => {
 const { A, B, a, b } = P, { c1, c0, vA, vB } = c, e = (x, v) => `${par(c1)} × (−${n(x)})${c0 === 0 ? '' : ' ' + sg(c0)} = ${n(v)}`;
 return {
  sa: `With ${V} = −${n(a)}: ${e(a, vA)}, and the right side is A × ${n(b - a)}, so A = ${n(vA)} ÷ ${n(b - a)} = ${n(A)}.`,
  sb: `With ${V} = −${n(b)}: ${e(b, vB)}, and the right side is B × ${par(a - b)}, so B = ${n(vB)} ÷ ${par(a - b)} = ${n(B)}.`
 };
};
const cf = v => Math.abs(v) === 1 ? '' : n(Math.abs(v));
const pc = (v, hi, lo) => `${Math.abs(v) === 1 ? '' : n(Math.abs(v)) + ' × '}(ln ${n(hi)} − ln ${n(lo)})`;
const lnT = (v, V, a) => `${cf(v) ? cf(v) + ' ' : ''}ln|${V} + ${n(a)}|`;
const pfInt = (V, P, c) => { const { A, B, a, b, p, q } = P;
 return `The antiderivative is ${A < 0 ? '−' : ''}${lnT(A, V, a)} ${B < 0 ? '−' : '+'} ${lnT(B, V, b)}. From ${n(p)} to ${n(q)} that is ${A < 0 ? '−' : ''}${pc(A, q + a, p + a)} ${B < 0 ? '−' : '+'} ${pc(B, q + b, p + b)} ≈ ${n(c.t1)} ${sg(c.t2)}`;
};
const pfHints = (V, P) => [
 `Multiply both sides by (${V} + ${n(P.a)})(${V} + ${n(P.b)}): the top equals A(${V} + ${n(P.b)}) + B(${V} + ${n(P.a)}). Put ${V} = −${n(P.a)} to make the B part vanish, then ${V} = −${n(P.b)} to make the A part vanish.`,
 `Each partial fraction gives a logarithm: ∫ A ÷ (${V} + ${n(P.a)}) d${V} = A ln|${V} + ${n(P.a)}|. Work out both logarithms at ${V} = ${n(P.q)} and at ${V} = ${n(P.p)}, and subtract.`
];
const pfGuideAB = (V, P, c) => { const s = pfSolve(V, P, c); return [
 { prompt: `Put ${V} = −${n(P.a)} into ${lin(c.c1, c.c0, V)} = A(${V} + ${n(P.b)}) + B(${V} + ${n(P.a)}). The B part becomes 0. What is A?`, answer: [P.A], explanation: s.sa },
 { prompt: `Now put ${V} = −${n(P.b)}. The A part becomes 0. What is B?`, answer: [P.B], explanation: s.sb }
]; };

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'Dye in the cooling loop',
 brief: 'The computing core adds tracer dye to its cooling loop at a changing rate, and the log needs the total that went in.',
 labels: ['A', 'B', 'dye added (L, 3 d.p.)'], tolerance: 0.0005,
 gl: [['A'], ['B'], ['dye added (L, 3 d.p.)']]
}, {
 canonical: { A: 3, B: -2, a: 1, b: 3, p: 0, q: 3 },
 draw: R => pfDraw(R, 0, 1, 6),
 build: P => { const c = pfCalc(P), { A, B, a, b, p, q } = P, V = 't', s = pfSolve(V, P, c), g = pfGuideAB(V, P, c); return {
  prompt: `The computing core’s dye line adds tracer to its cooling loop at a rate of (${lin(c.c1, c.c0, V)}) ÷ ((t + ${n(a)})(t + ${n(b)})) litres per minute, with t in minutes. The total dye added from t = ${n(p)} to t = ${n(q)} is the integral of that rate. Split the rate into partial fractions, A ÷ (t + ${n(a)}) + B ÷ (t + ${n(b)}). Enter A, then B, then the litres of dye added from t = ${n(p)} to t = ${n(q)}, to 3 decimal places.`,
  answer: [A, B, r3(c.I)],
  hints: pfHints(V, P),
  solution: `Multiply both sides by (t + ${n(a)})(t + ${n(b)}): ${lin(c.c1, c.c0, V)} = A(t + ${n(b)}) + B(t + ${n(a)}). ${s.sa} ${s.sb} The rate is ${n(A)} ÷ (t + ${n(a)}) ${sg(B)} ÷ (t + ${n(b)}). ${pfInt(V, P, c)}, which is ${n(r3(c.I))} to 3 decimal places.`,
  guidance: [g[0], g[1],
   { prompt: `Integrate ${n(A)} ÷ (t + ${n(a)}) ${sg(B)} ÷ (t + ${n(b)}) from t = ${n(p)} to t = ${n(q)}. What is the value to 3 decimal places?`, answer: [r3(c.I)], explanation: `${pfInt(V, P, c)}, which is ${n(r3(c.I))} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Ballast tank top-up',
 brief: 'The computing core’s coolant reserve tank is being topped up by a pump with a split-fraction rate, and the crew need the volume at the end.',
 labels: ['A', 'B', 'final volume (L, 3 d.p.)'], tolerance: 0.0005,
 gl: [['A', 'B'], ['litres pumped (3 d.p.)'], ['final volume (L, 3 d.p.)']]
}, {
 canonical: { A: 4, B: 1, a: 2, b: 3, p: 0, q: 4, V0: 35 },
 draw: R => { let P; do { P = pfDraw(R, 0, 0, 7); } while (pfCalc(P).I < 0.5); return { ...P, V0: R.int(20, 60) }; },
 build: P => { const c = pfCalc(P), { A, B, a, b, p, q, V0 } = P, V = 't', s = pfSolve(V, P, c), fin = r3(V0 + c.I); return {
  prompt: `The computing core’s coolant reserve tank holds ${n(V0)} litres at t = 0. A pump then fills it at a rate of (${lin(c.c1, c.c0, V)}) ÷ ((t + ${n(a)})(t + ${n(b)})) litres per minute, with t in minutes. Split the rate into partial fractions, A ÷ (t + ${n(a)}) + B ÷ (t + ${n(b)}), and enter A, then B. Then enter the volume in the tank at t = ${n(q)}, in litres, to 3 decimal places.`,
  answer: [A, B, fin],
  hints: [...pfHints(V, P), 'The tank starts with some water in it, so the final volume is the starting volume plus the litres pumped in.'],
  solution: `Multiply both sides by (t + ${n(a)})(t + ${n(b)}): ${lin(c.c1, c.c0, V)} = A(t + ${n(b)}) + B(t + ${n(a)}). ${s.sa} ${s.sb} The rate is ${n(A)} ÷ (t + ${n(a)}) ${sg(B)} ÷ (t + ${n(b)}). ${pfInt(V, P, c)}, so ${n(r3(c.I))} litres are pumped in. The tank then holds ${n(V0)} + ${n(r3(c.I))} = ${n(fin)} litres, to 3 decimal places.`,
  guidance: [
   { prompt: `Put t = −${n(a)}, then t = −${n(b)}, into ${lin(c.c1, c.c0, V)} = A(t + ${n(b)}) + B(t + ${n(a)}). Enter A, then B.`, answer: [A, B], explanation: `${s.sa} ${s.sb}` },
   { prompt: `Integrate ${n(A)} ÷ (t + ${n(a)}) ${sg(B)} ÷ (t + ${n(b)}) from t = ${n(p)} to t = ${n(q)}. How many litres are pumped in, to 3 decimal places?`, answer: [r3(c.I)], explanation: `${pfInt(V, P, c)}, which is ${n(r3(c.I))} to 3 decimal places.` },
   { prompt: `The tank started with ${n(V0)} litres. What does it hold at t = ${n(q)}, to 3 decimal places?`, answer: [fin], explanation: `${n(V0)} + ${n(r3(c.I))} = ${n(fin)} litres.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q03', title: 'Average draw on the heat shield',
 brief: 'A backup heater in the computing core draws power at a split-fraction rate, and the engineers want its average draw over a working spell.',
 labels: ['A', 'B', 'average value (3 d.p.)'], tolerance: 0.0005,
 gl: [['A'], ['B'], ['integral (3 d.p.)'], ['average value (3 d.p.)']]
}, {
 canonical: { A: 5, B: -3, a: 2, b: 5, p: 1, q: 5 },
 draw: R => { const P = pfDraw(R, 1, 2, 8); P.q = P.p + R.int(3, 6); return P; },
 build: P => { const c = pfCalc(P), { A, B, a, b, p, q } = P, V = 'x', s = pfSolve(V, P, c), avg = c.I / (q - p); return {
  prompt: `A backup heater in the computing core draws power f(x) = (${lin(c.c1, c.c0, V)}) ÷ ((x + ${n(a)})(x + ${n(b)})) kilowatts, with x in hours since switch-on. Split f(x) into partial fractions, A ÷ (x + ${n(a)}) + B ÷ (x + ${n(b)}). Enter A, then B. Then enter the average value of f from x = ${n(p)} to x = ${n(q)}, in kilowatts, to 3 decimal places: the integral divided by the width of the interval, using the unrounded integral.`,
  answer: [A, B, r3(avg)],
  hints: [...pfHints(V, P), `The average value of f on an interval is the integral of f over it, divided by the interval’s width.`],
  solution: `Multiply both sides by (x + ${n(a)})(x + ${n(b)}): ${lin(c.c1, c.c0, V)} = A(x + ${n(b)}) + B(x + ${n(a)}). ${s.sa} ${s.sb} ${pfInt(V, P, c)}, so the integral is ${n(r3(c.I))} (3 d.p.). The interval is ${n(q)} − ${n(p)} = ${n(q - p)} hours wide, so the average value is ${n(c.I)} ÷ ${n(q - p)} ≈ ${n(avg)}, which is ${n(r3(avg))} to 3 decimal places.`,
  guidance: [...pfGuideAB(V, P, c),
   { prompt: `Integrate ${n(A)} ÷ (x + ${n(a)}) ${sg(B)} ÷ (x + ${n(b)}) from x = ${n(p)} to x = ${n(q)}. What is the integral to 3 decimal places?`, answer: [r3(c.I)], explanation: `${pfInt(V, P, c)}, which is ${n(r3(c.I))} to 3 decimal places.` },
   { prompt: `The interval is ${n(q - p)} hours wide. Divide the unrounded integral by ${n(q - p)}. What is the average value to 3 decimal places?`, answer: [r3(avg)], explanation: `The unrounded integral is about ${n(c.I)}, and ${n(c.I)} ÷ ${n(q - p)} ≈ ${n(avg)}, which is ${n(r3(avg))} to 3 decimal places.` }
  ] }; }
});

/* ---- q22 Trapezoidal and Simpson's rules [3.6] ---- */

/* Readings every h minutes: N strips (N even) so N + 1 readings, drifting up and down but never below 4. */
const rdDraw = (R, N, h) => { const r = [R.int(10, 30)]; for (let i = 1; i <= N; i++) r.push(Math.max(4, r[i - 1] + R.int(-5, 8))); return { h, r }; };
const rdCalc = ({ h, r }) => {
 const N = r.length - 1, mid = r.slice(1, N), ends = r[0] + r[N];
 const Wt = ends + 2 * mid.reduce((x, y) => x + y, 0), Ws = ends + mid.reduce((x, y, i) => x + (i % 2 === 0 ? 4 : 2) * y, 0);
 const sTxt = (w) => `${n(r[0])} + ${mid.map((v, i) => `${w(i)} × ${n(v)}`).join(' + ')} + ${n(r[N])}`;
 return { N, Wt, Ws, T: h / 2 * Wt, S: h / 3 * Ws, span: h * N, tTxt: sTxt(() => 2), sTxtS: sTxt(i => i % 2 === 0 ? 4 : 2) };
};
const rdHints = [
 'Count the strips: one fewer than the number of readings. Trapezoidal rule: (h ÷ 2) × (first reading + 2 × each middle reading + last reading).',
 'Simpson’s rule: (h ÷ 3) × (first reading + 4, 2, 4, 2, … times the middle readings in turn + last reading). It needs an even number of strips.'
];

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Greenhouse irrigation log',
 brief: 'The greenhouse irrigation line only logs its flow at set times, and the garden crew need the total water used from those readings.',
 labels: ['trapezoidal estimate (L)', 'Simpson estimate (L)'], tolerance: 0.0005,
 gl: [['trapezoidal weighted sum', 'trapezoidal estimate (L)'], ['Simpson weighted sum', 'Simpson estimate (L)']]
}, {
 canonical: { h: 3, r: [16, 21, 25, 22, 18, 20, 14] },
 draw: R => rdDraw(R, 6, R.int(2, 5)),
 build: P => { const c = rdCalc(P), { h, r } = P; return {
  prompt: `The greenhouse irrigation line logs how fast water is flowing, in litres per minute, every ${n(h)} minutes from t = 0 to t = ${n(c.span)}: ${r.map(n).join(', ')}. Estimate how many litres were used in those ${n(c.span)} minutes, first with the trapezoidal rule and then with Simpson’s rule. Enter both to 3 decimal places, without commas.`,
  answer: [r3(c.T), r3(c.S)],
  hints: rdHints,
  solution: `The readings are h = ${n(h)} minutes apart, which makes ${n(c.N)} strips. Trapezoidal rule: (${n(h)} ÷ 2) × (${c.tTxt}) = ${n(h / 2)} × ${n(c.Wt)} = ${n(r3(c.T))} litres. Simpson’s rule: (${n(h)} ÷ 3) × (${c.sTxtS}) = (${n(h)} ÷ 3) × ${n(c.Ws)} ≈ ${n(c.S)} litres, which is ${n(r3(c.S))} to 3 decimal places.`,
  guidance: [
   { prompt: `For the trapezoidal rule, weight the readings 1, 2, 2, …, 2, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 2) times it?`, answer: [c.Wt, r3(c.T)], explanation: `${c.tTxt} = ${n(c.Wt)}. Each strip is a trapezium of width ${n(h)}, so the estimate is (${n(h)} ÷ 2) × ${n(c.Wt)} = ${n(r3(c.T))}.` },
   { prompt: `For Simpson’s rule, weight them 1, 4, 2, 4, …, 2, 4, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 3) times it, to 3 decimal places?`, answer: [c.Ws, r3(c.S)], explanation: `${c.sTxtS} = ${n(c.Ws)}. Then (${n(h)} ÷ 3) × ${n(c.Ws)} ≈ ${n(c.S)}, which is ${n(r3(c.S))} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Reserve tank drawdown',
 brief: 'The reserve tank is being drained through a metered outlet, and the crew need to know how much is left when the log ends.',
 labels: ['Simpson estimate drawn out (L)', 'litres left (L)'], tolerance: 0.0005,
 gl: [['Simpson weighted sum', 'Simpson estimate (L)'], ['litres left (L)']]
}, {
 canonical: { h: 4, r: [18, 22, 27, 25, 21], V0: 520 },
 draw: R => { const P = rdDraw(R, R.pick([4, 6]), R.int(2, 5)); P.V0 = Math.ceil(rdCalc(P).S) + R.int(40, 150); return P; },
 build: P => { const c = rdCalc(P), { h, r, V0 } = P, left = r3(V0 - c.S); return {
  prompt: `The reserve tank holds ${n(V0)} litres when its outlet is opened. The outlet’s flow is logged in litres per minute every ${n(h)} minutes from t = 0 to t = ${n(c.span)}: ${r.map(n).join(', ')}. Use Simpson’s rule to estimate how many litres left the tank in those ${n(c.span)} minutes, then work out how many litres are left. Enter both to 3 decimal places, without commas, using the unrounded estimate for the second.`,
  answer: [r3(c.S), left],
  hints: [rdHints[1], 'The litres left are the litres the tank held at the start, minus the litres that flowed out.'],
  solution: `The readings are h = ${n(h)} minutes apart, which makes ${n(c.N)} strips, an even number. Simpson’s rule: (${n(h)} ÷ 3) × (${c.sTxtS}) = (${n(h)} ÷ 3) × ${n(c.Ws)} ≈ ${n(c.S)} litres, which is ${n(r3(c.S))} to 3 decimal places. The tank started with ${n(V0)} litres, so ${n(V0)} − ${n(c.S)} ≈ ${n(V0 - c.S)}, which is ${n(left)} litres left, to 3 decimal places.`,
  guidance: [
   { prompt: `Weight the readings 1, 4, 2, 4, …, 2, 4, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 3) times it, to 3 decimal places?`, answer: [c.Ws, r3(c.S)], explanation: `${c.sTxtS} = ${n(c.Ws)}. Then (${n(h)} ÷ 3) × ${n(c.Ws)} ≈ ${n(c.S)}, which is ${n(r3(c.S))} to 3 decimal places.` },
   { prompt: `The tank started with ${n(V0)} litres. Subtract the unrounded Simpson estimate. How many litres are left, to 3 decimal places?`, answer: [left], explanation: `${n(V0)} − ${n(c.S)} ≈ ${n(V0 - c.S)}, which is ${n(left)} litres, to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q03', title: 'Power log of the foundry furnace',
 brief: 'The computing core’s processor rack logs its power draw at steady intervals, and the engineers want two energy estimates and the average power.',
 labels: ['trapezoidal estimate (kWh)', 'Simpson estimate (kWh)', 'average power (kW)'], tolerance: 0.0005,
 gl: [['trapezoidal weighted sum', 'trapezoidal estimate (kWh)'], ['Simpson weighted sum', 'Simpson estimate (kWh)'], ['average power (kW)']]
}, {
 canonical: { h: 0.5, r: [42, 48, 55, 51, 47, 52, 60, 58, 50] },
 draw: R => { const P = rdDraw(R, 8, R.pick([0.5, 1.5, 2.5, 2, 3])); P.r = P.r.map(v => v + 30); return P; },
 build: P => { const c = rdCalc(P), { h, r } = P, avg = c.S / c.span; return {
  prompt: `The computing core’s processor rack logs its power draw in kilowatts every ${n(h)} hours, from t = 0 to t = ${n(c.span)}: ${r.map(n).join(', ')}. The energy used is the area under the power curve, in kilowatt-hours. Estimate it with the trapezoidal rule and then with Simpson’s rule, and enter both to 3 decimal places, without commas. Then use the Simpson estimate to find the average power over the whole log, in kilowatts: the energy divided by the ${n(c.span)} hours, to 3 decimal places, using the unrounded estimate.`,
  answer: [r3(c.T), r3(c.S), r3(avg)],
  hints: [...rdHints, 'The average value of a function on an interval is the integral over the interval divided by its width. Here the width is the number of hours the log covers.'],
  solution: `The readings are h = ${n(h)} hours apart, which makes ${n(c.N)} strips. Trapezoidal rule: (${n(h)} ÷ 2) × (${c.tTxt}) = ${n(h / 2)} × ${n(c.Wt)} = ${n(r3(c.T))} kWh. Simpson’s rule: (${n(h)} ÷ 3) × (${c.sTxtS}) = (${n(h)} ÷ 3) × ${n(c.Ws)} ≈ ${n(c.S)} kWh, which is ${n(r3(c.S))} to 3 decimal places. The log covers ${n(c.N)} × ${n(h)} = ${n(c.span)} hours, so the average power is ${n(c.S)} ÷ ${n(c.span)} ≈ ${n(avg)}, which is ${n(r3(avg))} kW to 3 decimal places.`,
  guidance: [
   { prompt: `For the trapezoidal rule, weight the readings 1, 2, 2, …, 2, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 2) times it?`, answer: [c.Wt, r3(c.T)], explanation: `${c.tTxt} = ${n(c.Wt)}. Then (${n(h)} ÷ 2) × ${n(c.Wt)} = ${n(r3(c.T))}.` },
   { prompt: `For Simpson’s rule, weight them 1, 4, 2, 4, …, 2, 4, 1 and add. What is the weighted sum, and what is (${n(h)} ÷ 3) times it, to 3 decimal places?`, answer: [c.Ws, r3(c.S)], explanation: `${c.sTxtS} = ${n(c.Ws)}. Then (${n(h)} ÷ 3) × ${n(c.Ws)} ≈ ${n(c.S)}, which is ${n(r3(c.S))} to 3 decimal places.` },
   { prompt: `The log covers ${n(c.span)} hours. Divide the unrounded Simpson estimate by ${n(c.span)}. What is the average power, to 3 decimal places?`, answer: [r3(avg)], explanation: `${n(c.S)} ÷ ${n(c.span)} ≈ ${n(avg)}, which is ${n(r3(avg))} kW to 3 decimal places.` }
  ] }; }
});

/* ---- q23 Chapter review: choosing a technique [3.5] ---- */

const TECH = 'The Computing Core’s solver knows four techniques: 1 substitution, 2 integration by parts, 3 partial fractions, 4 dividing the fraction out first and then using the basic rules.';

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Which tool for the filter curve',
 brief: 'The computing core’s filter curve has to be integrated, and the solver needs to be shown which technique fits it.',
 labels: ['technique number', 'integral (3 d.p.)'], tolerance: 0.0005,
 gl: [['technique number'], ['F at the top limit', 'F at the bottom limit'], ['integral (3 d.p.)']]
}, {
 canonical: { k: 6, m: 2, L: 3 },
 draw: R => ({ k: R.int(2, 9), m: R.int(1, 5), L: R.int(2, 4) }),
 build: ({ k, m, L }) => { const F1 = k / 2 * Math.log(L * L + m), F0 = k / 2 * Math.log(m), I = F1 - F0; return {
  prompt: `The computing core’s filter response needs ∫ from 0 to ${n(L)} of ${n(k)}x ÷ (x² + ${n(m)}) dx. ${TECH} Enter the number of the technique that fits, then the value of the integral to 3 decimal places.`,
  answer: [1, r3(I)],
  hints: ['Look at the bottom, x² + ' + n(m) + '. What is its derivative, and does something like it appear on top?', `With u = x² + ${n(m)}, du = 2x dx, so the top ${n(k)}x dx is ${n(k / 2)} du. The integral of ${n(k / 2)} ÷ u is ${n(k / 2)} ln|u|.`],
  solution: `The derivative of the bottom, x² + ${n(m)}, is 2x, and the top is ${n(k)}x, a number times 2x, so substitution fits: technique 1. With u = x² + ${n(m)}, du = 2x dx, so ${n(k)}x dx = ${n(k / 2)} du and the antiderivative is ${n(k / 2)} ln(x² + ${n(m)}). F(${n(L)}) = ${n(k / 2)} ln ${n(L * L + m)} ≈ ${n(F1)} and F(0) = ${n(k / 2)} ln ${n(m)} ≈ ${n(F0)}, so the integral is ${n(F1)} − ${n(F0)} ≈ ${n(I)}, which is ${n(r3(I))} to 3 decimal places.`,
  guidance: [
   { prompt: `Look at the shape of ${n(k)}x ÷ (x² + ${n(m)}). Which technique fits? Enter its number, 1 to 4.`, answer: [1], explanation: `The top is a number times 2x, the derivative of the bottom x² + ${n(m)}, so substitution fits: technique 1.` },
   { prompt: `The antiderivative is F(x) = ${n(k / 2)} ln(x² + ${n(m)}). What are F(${n(L)}) and F(0), to 3 decimal places?`, answer: [r3(F1), r3(F0)], explanation: `F(${n(L)}) = ${n(k / 2)} ln ${n(L * L + m)} ≈ ${n(F1)} and F(0) = ${n(k / 2)} ln ${n(m)} ≈ ${n(F0)}.` },
   { prompt: `Subtract, using the unrounded values: what is F(${n(L)}) − F(0), to 3 decimal places?`, answer: [r3(I)], explanation: `${n(F1)} − ${n(F0)} ≈ ${n(I)}, which is ${n(r3(I))} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Valve flow with a fraction on top',
 brief: 'A valve’s flow rate is a fraction with a tall top, and the crew need the litres it adds to a tank that already holds some.',
 labels: ['technique number', 'litres added (3 d.p.)', 'final volume (L, 3 d.p.)'], tolerance: 0.0005,
 gl: [['technique number'], ['litres added (3 d.p.)'], ['final volume (L, 3 d.p.)']]
}, {
 canonical: { c: 4, m: 6, L: 4, V0: 30 },
 draw: R => ({ c: R.int(3, 5), m: R.int(2, 9), L: R.int(3, 6), V0: R.int(20, 60) }),
 build: ({ c, m, L, V0 }) => { const I = c * (L * L - 1) / 2 + m * Math.log(L), fin = r3(V0 + I); return {
  prompt: `A valve feeds a storage tank at a rate of (${n(c)}t² + ${n(m)}) ÷ t litres per minute, with t in minutes, from t = 1 to t = ${n(L)}. The tank already holds ${n(V0)} litres at t = 1. ${TECH} Enter the number of the technique that fits the rate, then the litres added between t = 1 and t = ${n(L)}, then the volume in the tank at t = ${n(L)}, both to 3 decimal places.`,
  answer: [4, r3(I), fin],
  hints: ['The top has a higher power of t than the single t underneath, so try splitting the fraction into a sum of two simpler terms.', 'Divide each term on top by t. Each term then has a basic rule, one of them giving a logarithm. The final volume is the starting volume plus the litres added.'],
  solution: `The bottom is a single t and the top has a higher power, so divide it out first: technique 4. (${n(c)}t² + ${n(m)}) ÷ t = ${n(c)}t + ${n(m)} ÷ t, with antiderivative ${n(c / 2)}t² + ${n(m)} ln t. From 1 to ${n(L)}: ${n(c / 2)} × (${n(L * L)} − 1) + ${n(m)} × (ln ${n(L)} − ln 1) = ${n(c * (L * L - 1) / 2)} + ${n(m * Math.log(L))} ≈ ${n(I)} litres, which is ${n(r3(I))} to 3 decimal places. The tank then holds ${n(V0)} + ${n(r3(I))} = ${n(fin)} litres.`,
  guidance: [
   { prompt: `Look at the shape of (${n(c)}t² + ${n(m)}) ÷ t. Which technique fits? Enter its number, 1 to 4.`, answer: [4], explanation: 'The bottom is a single t and the top has a higher power of t, so divide it out first: technique 4.' },
   { prompt: `Split the rate into ${n(c)}t + ${n(m)} ÷ t, with antiderivative ${n(c / 2)}t² + ${n(m)} ln t. How many litres are added from t = 1 to t = ${n(L)}, to 3 decimal places?`, answer: [r3(I)], explanation: `${n(c / 2)} × (${n(L * L)} − 1) + ${n(m)} × (ln ${n(L)} − ln 1) = ${n(c * (L * L - 1) / 2)} + ${n(m * Math.log(L))} ≈ ${n(I)}, which is ${n(r3(I))} to 3 decimal places.` },
   { prompt: `The tank held ${n(V0)} litres at t = 1. What does it hold at t = ${n(L)}, to 3 decimal places?`, answer: [fin], explanation: `${n(V0)} + ${n(r3(I))} = ${n(fin)} litres.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q21', title: 'The unfactored fraction',
 brief: 'The solver has met a fraction whose bottom is not yet in factors, and it must decide how to integrate it.',
 labels: ['technique number', 'A', 'B', 'integral (3 d.p.)'], tolerance: 0.0005,
 gl: [['technique number'], ['A', 'B'], ['integral (3 d.p.)']]
}, {
 canonical: { A: 3, B: 2, a: 1, b: 4, p: 0, q: 3 },
 /* A = B is left out: the top would then be A times the derivative of the bottom, and substitution would fit as well. */
 draw: R => { let P; do { P = pfDraw(R, 0, 1, 6); } while (P.A < 0 || P.B < 0 || P.A === P.B || pfCalc(P).c1 === 0); return P; },
 build: P => { const c = pfCalc(P), { A, B, a, b, p, q } = P, V = 'x', s = pfSolve(V, P, c), bot = `x² + ${n(a + b)}x + ${n(a * b)}`; return {
  prompt: `A new integral has the Computing Core stuck: ∫ from ${n(p)} to ${n(q)} of (${lin(c.c1, c.c0, V)}) ÷ (${bot}) dx. ${TECH} Enter the number of the technique that fits, then A and B, where the fraction splits as A ÷ (x + ${n(a)}) + B ÷ (x + ${n(b)}), then the value of the integral to 3 decimal places.`,
  answer: [3, A, B, r3(c.I)],
  hints: [`The bottom, ${bot}, is not in factors yet. Look for two numbers that multiply to ${n(a * b)} and add to ${n(a + b)}: they give two different linear factors.`, `Once the bottom is (x + ${n(a)})(x + ${n(b)}), multiply both sides by it, put x = −${n(a)} and then x = −${n(b)} to find A and B, and integrate each piece as a logarithm.`],
  solution: `The bottom factors: ${bot} = (x + ${n(a)})(x + ${n(b)}), and the top has a lower power of x, so partial fractions fit: technique 3. Multiply both sides by (x + ${n(a)})(x + ${n(b)}): ${lin(c.c1, c.c0, V)} = A(x + ${n(b)}) + B(x + ${n(a)}). ${s.sa} ${s.sb} ${pfInt(V, P, c)}, which is ${n(r3(c.I))} to 3 decimal places.`,
  guidance: [
   { prompt: `Look at the shape of (${lin(c.c1, c.c0, V)}) ÷ (${bot}). Which technique fits once the bottom is factored? Enter its number, 1 to 4.`, answer: [3], explanation: `The bottom factors as (x + ${n(a)})(x + ${n(b)}), two different linear factors, and the top has a lower power: partial fractions, technique 3.` },
   { prompt: `Put x = −${n(a)}, then x = −${n(b)}, into ${lin(c.c1, c.c0, V)} = A(x + ${n(b)}) + B(x + ${n(a)}). Enter A, then B.`, answer: [A, B], explanation: `${s.sa} ${s.sb}` },
   { prompt: `Integrate ${n(A)} ÷ (x + ${n(a)}) ${sg(B)} ÷ (x + ${n(b)}) from x = ${n(p)} to x = ${n(q)}. What is the value to 3 decimal places?`, answer: [r3(c.I)], explanation: `${pfInt(V, P, c)}, which is ${n(r3(c.I))} to 3 decimal places.` }
  ] }; }
});

/* ---- q24 Improper integrals over an endless interval [3.7] ---- */

const GENERIC_IMP = 'For the improper integral, put a letter b in place of ∞, then let b grow without bound (b → ∞). If the result settles on a number, the integral converges to it; if it grows without bound, it diverges.';

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'A hum that fades slowly',
 brief: 'The dish picks up a steady hum that fades with time, and the engineers need to know whether its total energy is finite.',
 labels: ['integral to the later time (3 d.p.)', 'converges (1) or diverges (0)', 'value (0 if it diverges)'], tolerance: 0.0005,
 gl: [['integral to the later time (3 d.p.)'], ['settles (1) or not (0)'], ['value (0 if it diverges)']]
}, {
 canonical: { k: 5, p: 3, a: 2, T: 10 },
 draw: R => ({ k: R.int(2, 9), p: R.pick([1, 2, 2, 3, 3]), a: R.int(1, 2), T: 10 }),
 build: ({ k, p, a, T }) => {
  const conv = p > 1, part = conv ? k / (p - 1) * (Math.pow(a, 1 - p) - Math.pow(T, 1 - p)) : k * (Math.log(T) - Math.log(a)), val = conv ? k / (p - 1) * Math.pow(a, 1 - p) : 0;
  const f = pw('t', p), anti = p === 1 ? `${n(k)} ln t` : `−${n(k / (p - 1))} ÷ ${pw('t', p - 1)}`;
  const fa = k / ((p - 1) * Math.pow(a, p - 1)), fT = k / ((p - 1) * Math.pow(T, p - 1));
  const lim = conv ? `With top limit b the integral is ${n(fa)} − ${n(k / (p - 1))} ÷ ${pw('b', p - 1)}. As b → ∞, ${n(k / (p - 1))} ÷ ${pw('b', p - 1)} shrinks to 0, so the integral settles on ${n(val)}. It converges: enter 1, then ${n(val)}.`
   : `With top limit b the integral is ${n(k)} × (ln b − ln ${n(a)}). As b → ∞, ln b grows without bound, so the integral does not settle. It diverges: enter 0, then 0.`;
  return {
  prompt: `The dish’s receiver picks up a hum whose power fades as ${n(k)} ÷ ${f} units at time t seconds, for t ≥ ${n(a)}. Its total energy is the improper integral ∫ from ${n(a)} to ∞ of ${n(k)} ÷ ${f} dt. First enter ∫ from ${n(a)} to ${n(T)} of ${n(k)} ÷ ${f} dt, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).`,
  answer: [r3(part), conv ? 1 : 0, r3(val)],
  hints: [`An antiderivative of ${n(k)} ÷ ${f} is ${anti}. Work it out at the top limit and at the bottom limit, and subtract.`, GENERIC_IMP],
  solution: `An antiderivative is F(t) = ${anti}. From ${n(a)} to ${n(T)} the integral is ${conv ? `F(${n(T)}) − F(${n(a)}) = −${n(fT)} − (−${n(fa)})` : `${n(k)} × (ln ${n(T)} − ln ${n(a)})`} ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places. ${lim}`,
  guidance: [
   { prompt: `An antiderivative of ${n(k)} ÷ ${f} is ${anti}. What is the integral from ${n(a)} to ${n(T)}, to 3 decimal places?`, answer: [r3(part)], explanation: `Top limit minus bottom limit: ${conv ? `F(${n(T)}) − F(${n(a)}) = −${n(fT)} − (−${n(fa)})` : `${n(k)} × (ln ${n(T)} − ln ${n(a)})`} ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places.` },
   { prompt: conv ? `With top limit b, the integral is ${n(fa)} − ${n(k / (p - 1))} ÷ ${pw('b', p - 1)}. As b → ∞, does that settle on a number? Enter 1 for yes, 0 for no.` : `With top limit b, the integral is ${n(k)} × (ln b − ln ${n(a)}). As b → ∞, does that settle on a number? Enter 1 for yes, 0 for no.`, answer: [conv ? 1 : 0], explanation: conv ? `As b → ∞, ${n(k / (p - 1))} ÷ ${pw('b', p - 1)} shrinks to 0, so the integral settles on ${n(val)}.` : 'As b → ∞, ln b grows without bound, so the integral does not settle on a number.' },
   { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [r3(val)], explanation: conv ? `The integral converges to ${n(val)}: the energy is finite even though the hum never stops.` : 'The integral diverges, so there is no finite value: enter 0. The hum fades, but not fast enough for its energy to be finite.' }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'A static burst dying away',
 brief: 'A burst of static dies away exponentially after a flare, and Mira wants its total energy and how much of it is still to come.',
 labels: ['energy to the later time (3 d.p.)', 'total energy (3 d.p.)', 'energy still to come (3 d.p.)'], tolerance: 0.0005,
 gl: [['energy to the later time (3 d.p.)'], ['total energy (3 d.p.)'], ['energy still to come (3 d.p.)']]
}, {
 canonical: { k: 9, m: 3, T: 2 },
 /* A draw is kept only when the total minus the arrived energy, both rounded to 3 places, gives the rounded energy still to come. */
 draw: R => { let p; do { p = { k: R.int(4, 12), m: R.int(2, 3), T: R.int(1, 2) }; } while ((() => { const tot = p.k / p.m, tail = tot * Math.exp(-p.m * p.T), part = tot - tail; return Math.abs(r3(r3(tot) - r3(part)) - r3(tail)) > 1e-9; })()); return p; },
 build: ({ k, m, T }) => { const tot = k / m, tail = tot * Math.exp(-m * T), part = tot - tail; return {
  prompt: `After a solar flare, static reaches the array with power ${n(k)} × e^(−${n(m)}t) units at time t seconds, for t ≥ 0. Its total energy is the improper integral ∫ from 0 to ∞ of ${n(k)} × e^(−${n(m)}t) dt. Enter the energy that arrives from t = 0 to t = ${n(T)}, then the total energy, then the energy still to come after t = ${n(T)}, all to 3 decimal places.`,
  answer: [r3(part), r3(tot), r3(tail)],
  hints: [`An antiderivative of ${n(k)} × e^(−${n(m)}t) is −${n(k / m)} × e^(−${n(m)}t). Work it out at the top limit and at the bottom limit, and subtract.`, GENERIC_IMP + ' The energy still to come is the total minus the energy that has already arrived.'],
  solution: `An antiderivative is F(t) = −${n(k / m)} × e^(−${n(m)}t). From 0 to ${n(T)} the integral is F(${n(T)}) − F(0) = ${n(k / m)} × (1 − e^(−${n(m * T)})) ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places. With top limit b the integral is ${n(k / m)} × (1 − e^(−${n(m)}b)). As b → ∞, e^(−${n(m)}b) shrinks to 0, so the integral settles on ${n(k / m)}: the total energy is ${n(r3(tot))} to 3 decimal places. The energy still to come is ${n(k / m)} − ${n(part)} ≈ ${n(tail)}, which is ${n(r3(tail))} to 3 decimal places.`,
  guidance: [
   { prompt: `An antiderivative of ${n(k)} × e^(−${n(m)}t) is −${n(k / m)} × e^(−${n(m)}t). What is the integral from t = 0 to t = ${n(T)}, to 3 decimal places?`, answer: [r3(part)], explanation: `F(${n(T)}) − F(0) = ${n(k / m)} × (1 − e^(−${n(m * T)})) ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places.` },
   { prompt: `With top limit b, the integral is ${n(k / m)} × (1 − e^(−${n(m)}b)). As b → ∞, e^(−${n(m)}b) shrinks to 0. What does the integral settle on, to 3 decimal places?`, answer: [r3(tot)], explanation: `${n(k / m)} × (1 − 0) = ${n(k / m)}, which is ${n(r3(tot))} to 3 decimal places. The total energy is finite.` },
   { prompt: `What is the energy still to come after t = ${n(T)}: the total minus the energy already arrived, using unrounded values, to 3 decimal places?`, answer: [r3(tail)], explanation: `${n(k / m)} − ${n(part)} ≈ ${n(tail)}, which is ${n(r3(tail))} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', title: 'Two long-range pings',
 brief: 'Two long-range pings fade at different rates, and only one of them carries a finite total energy.',
 labels: ['integral to the later time (3 d.p.)', 'converges (1) or diverges (0)', 'value (0 if it diverges)'], tolerance: 0.0005,
 gl: [['integral to the later time (3 d.p.)'], ['settles (1) or not (0)'], ['value (0 if it diverges)']]
}, {
 canonical: { k: 6, sa: 2, sT: 5, conv: 1 },
 draw: R => ({ k: R.int(2, 9), sa: R.pick([2, 4]), sT: R.pick([5, 10]), conv: R.pick([0, 1]) }),
 build: ({ k, sa, sT, conv }) => {
  const a = sa * sa, T = sT * sT, part = conv ? 2 * k * (1 / sa - 1 / sT) : 2 * k * (sT - sa), val = conv ? 2 * k / sa : 0;
  const f = conv ? 't^1.5' : '√t', anti = conv ? `−${n(2 * k)} ÷ √t` : `${n(2 * k)}√t`;
  const lim = conv ? `With top limit b the integral is ${n(2 * k / sa)} − ${n(2 * k)} ÷ √b. As b → ∞, ${n(2 * k)} ÷ √b shrinks to 0, so the integral settles on ${n(val)}. It converges: enter 1, then ${n(val)}.`
   : `With top limit b the integral is ${n(2 * k)}√b − ${n(2 * k * sa)}. As b → ∞, √b grows without bound, so the integral does not settle. It diverges: enter 0, then 0.`;
  return {
  prompt: `A long-range ping reaches the array with power ${n(k)} ÷ ${f} units at time t seconds, for t ≥ ${n(a)}${conv ? ' (t^1.5 means t to the power 1.5, which is t × √t)' : ''}. Its total energy is the improper integral ∫ from ${n(a)} to ∞ of ${n(k)} ÷ ${f} dt. First enter ∫ from ${n(a)} to ${n(T)} of ${n(k)} ÷ ${f} dt, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).`,
  answer: [r3(part), conv, r3(val)],
  hints: [`An antiderivative of ${n(k)} ÷ ${f} is ${anti}. Work it out at the top limit and at the bottom limit, and subtract. The square roots of ${n(a)} and ${n(T)} are whole numbers.`, GENERIC_IMP + ' Compare this with 1 ÷ t: powers of t above 1 fade fast enough, powers of 1 or below do not.'],
  solution: `An antiderivative is F(t) = ${anti}. From ${n(a)} to ${n(T)} the integral is F(${n(T)}) − F(${n(a)}) = ${conv ? `−${n(2 * k / sT)} − (−${n(2 * k / sa)})` : `${n(2 * k * sT)} − ${n(2 * k * sa)}`} ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places. ${lim}`,
  guidance: [
   { prompt: `An antiderivative of ${n(k)} ÷ ${f} is ${anti}. What is the integral from ${n(a)} to ${n(T)}, to 3 decimal places?`, answer: [r3(part)], explanation: `Top limit minus bottom limit: ${conv ? `−${n(2 * k / sT)} − (−${n(2 * k / sa)})` : `${n(2 * k * sT)} − ${n(2 * k * sa)}`} ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places.` },
   { prompt: conv ? `With top limit b, the integral is ${n(2 * k / sa)} − ${n(2 * k)} ÷ √b. As b → ∞, does that settle on a number? Enter 1 for yes, 0 for no.` : `With top limit b, the integral is ${n(2 * k)}√b − ${n(2 * k * sa)}. As b → ∞, does that settle on a number? Enter 1 for yes, 0 for no.`, answer: [conv], explanation: conv ? `As b → ∞, ${n(2 * k)} ÷ √b shrinks to 0, so the integral settles on ${n(val)}.` : 'As b → ∞, √b grows without bound, so the integral does not settle on a number.' },
   { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [r3(val)], explanation: conv ? `The integral converges to ${n(val)}.` : 'The integral diverges, so there is no finite value: enter 0.' }
  ] }; }
});

/* ---- q25 Improper integrals where the integrand blows up [3.7] ---- */

const GENERIC_BLOW = (bad, dir) => `For the improper integral, put a letter c in place of ${bad}, then let c ${dir}. If the result settles on a number, the integral converges to it; if it grows without bound in size, it diverges.`;
/* power p of the distance s from the blow-up point: 1/2, 1 or 2 */
const dist = (p, s) => p === 0.5 ? `√(${s})` : p === 1 ? `(${s})` : `(${s})²`;

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The relay that starts late',
 brief: 'A relay switches on at a later time than the array, and its input spikes without limit at that instant.',
 labels: ['integral from just after the start (3 d.p.)', 'converges (1) or diverges (0)', 'value (0 if it diverges)'], tolerance: 0.0005,
 gl: [['integral from just after the start (3 d.p.)'], ['settles (1) or not (0)'], ['value (0 if it diverges)']]
}, {
 canonical: { k: 4, p: 0.5, a: 2, w: 9 },
 draw: R => ({ k: R.int(2, 9), p: R.pick([0.5, 0.5, 1, 2]), a: R.int(1, 3), w: R.pick([4, 9, 16, 25]) }),
 build: ({ k, p, a, w }) => {
  const L = a + w, conv = p < 1, s0 = 0.01, start = a + s0;
  const part = p === 0.5 ? 2 * k * (Math.sqrt(w) - 0.1) : p === 1 ? k * Math.log(w / s0) : k * (1 / s0 - 1 / w), val = conv ? 2 * k * Math.sqrt(w) : 0;
  const d = dist(p, `t − ${n(a)}`), anti = p === 0.5 ? `${n(2 * k)}√(t − ${n(a)})` : p === 1 ? `${n(k)} ln|t − ${n(a)}|` : `−${n(k)} ÷ (t − ${n(a)})`;
  const fL = p === 0.5 ? `${n(2 * k)}√${n(w)}` : p === 1 ? `${n(k)} ln ${n(w)}` : `−${n(k)} ÷ ${n(w)}`, f0 = p === 0.5 ? `${n(2 * k)}√0.01` : p === 1 ? `${n(k)} ln 0.01` : `−${n(k)} ÷ 0.01`;
  const lim = p === 0.5 ? `With bottom limit c the integral is ${n(2 * k * Math.sqrt(w))} − ${n(2 * k)}√(c − ${n(a)}). As c comes down to ${n(a)}, √(c − ${n(a)}) shrinks to 0, so the integral settles on ${n(val)}. It converges: enter 1, then ${n(val)}.`
   : p === 1 ? `With bottom limit c the integral is ${n(k)} ln ${n(w)} − ${n(k)} ln(c − ${n(a)}). As c comes down to ${n(a)}, ln(c − ${n(a)}) grows without bound in size, so the integral does not settle. It diverges: enter 0, then 0.`
   : `With bottom limit c the integral is ${n(k)} ÷ (c − ${n(a)}) − ${n(k)} ÷ ${n(w)}. As c comes down to ${n(a)}, ${n(k)} ÷ (c − ${n(a)}) grows without bound, so the integral does not settle. It diverges: enter 0, then 0.`;
  const step2 = p === 0.5 ? `${n(2 * k * Math.sqrt(w))} − ${n(2 * k)}√(c − ${n(a)})` : p === 1 ? `${n(k)} ln ${n(w)} − ${n(k)} ln(c − ${n(a)})` : `${n(k)} ÷ (c − ${n(a)}) − ${n(k)} ÷ ${n(w)}`;
  return {
  prompt: `The relay at the Deep Signal Array switches on at time t = ${n(a)}, in seconds, and its input power is P(t) = ${n(k)} ÷ ${d} units for ${n(a)} < t ≤ ${n(L)}: it grows without bound just after t = ${n(a)}. The energy received is ∫ from ${n(a)} to ${n(L)} of P(t) dt, an improper integral because P blows up at t = ${n(a)}. First enter the integral from t = ${n(start)} to t = ${n(L)}, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).`,
  answer: [r3(part), conv ? 1 : 0, r3(val)],
  hints: [`An antiderivative of ${n(k)} ÷ ${d} is ${anti}. Work it out at t = ${n(L)} and at t = ${n(start)}, and subtract.`, GENERIC_BLOW(`the bottom limit ${n(a)}`, `come down to ${n(a)} from above`)],
  solution: `An antiderivative is F(t) = ${anti}. From t = ${n(start)} to t = ${n(L)} the integral is F(${n(L)}) − F(${n(start)}) = ${fL} − (${f0}) ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places. ${lim}`,
  guidance: [
   { prompt: `An antiderivative of ${n(k)} ÷ ${d} is ${anti}. What is the integral from t = ${n(start)} to t = ${n(L)}, to 3 decimal places?`, answer: [r3(part)], explanation: `Top limit minus bottom limit: F(${n(L)}) − F(${n(start)}) = ${fL} − (${f0}) ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places.` },
   { prompt: `With bottom limit c, the integral is ${step2}. As c comes down to ${n(a)}, does that settle on a number? Enter 1 for yes, 0 for no.`, answer: [conv ? 1 : 0], explanation: conv ? `As c comes down to ${n(a)}, √(c − ${n(a)}) shrinks to 0, so the integral settles on ${n(val)}.` : `As c comes down to ${n(a)}, the part with c − ${n(a)} in it grows without bound in size, so the integral does not settle on a number.` },
   { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [r3(val)], explanation: conv ? `The integral converges to ${n(val)}: the power is endless at the start, but the energy is finite.` : 'The integral diverges, so there is no finite value: enter 0.' }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Valve opening surge',
 brief: 'A fill valve on the dish’s coolant tank opens with a surge of flow that is endless for an instant, and the crew need the volume that reaches the tank.',
 labels: ['litres from just after opening (3 d.p.)', 'litres through the valve in all (3 d.p.)', 'final volume (L, 3 d.p.)'], tolerance: 0.0005,
 gl: [['litres from just after opening (3 d.p.)'], ['litres through the valve in all (3 d.p.)'], ['final volume (L, 3 d.p.)']]
}, {
 canonical: { k: 5, L: 16, V0: 40 },
 draw: R => ({ k: R.int(2, 9), L: R.pick([4, 9, 16, 25]), V0: R.int(20, 80) }),
 build: ({ k, L, V0 }) => { const part = 2 * k * (Math.sqrt(L) - 0.1), tot = 2 * k * Math.sqrt(L), fin = r3(V0 + tot); return {
  prompt: `The coolant tank behind the Long-range Dish holds ${n(V0)} litres when its fill valve opens at t = 0, in minutes. All the water through the valve goes into the tank, at ${n(k)} ÷ √t litres per minute for 0 < t ≤ ${n(L)}: the flow grows without bound just after t = 0. The litres through the valve are ∫ from 0 to ${n(L)} of ${n(k)} ÷ √t dt, an improper integral. Enter the litres from t = 0.01 to t = ${n(L)}, then the litres through the valve in all, then the volume in the tank at t = ${n(L)}, all to 3 decimal places.`,
  answer: [r3(part), r3(tot), fin],
  hints: [`An antiderivative of ${n(k)} ÷ √t is ${n(2 * k)}√t. Work it out at t = ${n(L)} and at t = 0.01, and subtract.`, GENERIC_BLOW('the bottom limit 0', 'come down to 0 from above') + ' The final volume is the starting volume plus the litres through the valve.'],
  solution: `An antiderivative is F(t) = ${n(2 * k)}√t. From t = 0.01 to t = ${n(L)} the integral is F(${n(L)}) − F(0.01) = ${n(2 * k * Math.sqrt(L))} − ${n(0.2 * k)} = ${n(part)}, which is ${n(r3(part))} to 3 decimal places. With bottom limit c the integral is ${n(2 * k * Math.sqrt(L))} − ${n(2 * k)}√c. As c comes down to 0, √c shrinks to 0, so the integral settles on ${n(tot)}. The tank then holds ${n(V0)} + ${n(tot)} = ${n(fin)} litres.`,
  guidance: [
   { prompt: `An antiderivative of ${n(k)} ÷ √t is ${n(2 * k)}√t. What is the integral from t = 0.01 to t = ${n(L)}, to 3 decimal places?`, answer: [r3(part)], explanation: `Top limit minus bottom limit: ${n(2 * k * Math.sqrt(L))} − ${n(0.2 * k)} = ${n(part)}.` },
   { prompt: `With bottom limit c, the integral is ${n(2 * k * Math.sqrt(L))} − ${n(2 * k)}√c. As c comes down to 0, √c shrinks to 0. What does the integral settle on, to 3 decimal places?`, answer: [r3(tot)], explanation: `${n(2 * k * Math.sqrt(L))} − 0 = ${n(tot)}: the volume through the valve is finite.` },
   { prompt: `The tank held ${n(V0)} litres. What does it hold at t = ${n(L)}, to 3 decimal places?`, answer: [fin], explanation: `${n(V0)} + ${n(tot)} = ${n(fin)} litres.` }
  ] }; }
});

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', title: 'Shutdown spike at the end',
 brief: 'A shutdown pulse spikes without limit at the very end of its run, and the engineers need to know whether the energy is finite.',
 labels: ['integral up to just before the end (3 d.p.)', 'converges (1) or diverges (0)', 'value (0 if it diverges)'], tolerance: 0.0005,
 gl: [['integral up to just before the end (3 d.p.)'], ['settles (1) or not (0)'], ['value (0 if it diverges)']]
}, {
 canonical: { k: 3, p: 0.5, L: 25 },
 draw: R => ({ k: R.int(2, 9), p: R.pick([0.5, 0.5, 1, 2]), L: R.pick([4, 9, 16, 25]) }),
 build: ({ k, p, L }) => {
  const conv = p < 1, end = L - 0.01, rt = Math.sqrt(L);
  const part = p === 0.5 ? 2 * k * (rt - 0.1) : p === 1 ? k * Math.log(100 * L) : k * (100 - 1 / L), val = conv ? 2 * k * rt : 0;
  const d = dist(p, `${n(L)} − t`), anti = p === 0.5 ? `−${n(2 * k)}√(${n(L)} − t)` : p === 1 ? `−${n(k)} ln|${n(L)} − t|` : `${n(k)} ÷ (${n(L)} − t)`;
  const fE = p === 0.5 ? `−${n(2 * k)}√0.01` : p === 1 ? `−${n(k)} ln 0.01` : `${n(k)} ÷ 0.01`, f0 = p === 0.5 ? `−${n(2 * k)}√${n(L)}` : p === 1 ? `−${n(k)} ln ${n(L)}` : `${n(k)} ÷ ${n(L)}`;
  const step2 = p === 0.5 ? `${n(2 * k * rt)} − ${n(2 * k)}√(${n(L)} − c)` : p === 1 ? `${n(k)} ln ${n(L)} − ${n(k)} ln(${n(L)} − c)` : `${n(k)} ÷ (${n(L)} − c) − ${n(k)} ÷ ${n(L)}`;
  const lim = `With top limit c the integral is ${step2}. As c comes up to ${n(L)}, ${p === 0.5 ? `√(${n(L)} − c) shrinks to 0, so the integral settles on ${n(val)}. It converges: enter 1, then ${n(val)}.` : `the part with ${n(L)} − c in it grows without bound in size, so the integral does not settle. It diverges: enter 0, then 0.`}`;
  return {
  prompt: `A shutdown pulse runs from t = 0 to t = ${n(L)} seconds, and its power is P(t) = ${n(k)} ÷ ${d} units: it grows without bound as t comes up to ${n(L)}. The energy is ∫ from 0 to ${n(L)} of P(t) dt, an improper integral because P blows up at the top limit. First enter the integral from t = 0 to t = ${n(end)}, to 3 decimal places. Then enter 1 if the improper integral converges or 0 if it diverges, then its value (enter 0 if it diverges).`,
  answer: [r3(part), conv ? 1 : 0, r3(val)],
  hints: [`An antiderivative of ${n(k)} ÷ ${d} is ${anti}. Work it out at t = ${n(end)} and at t = 0, and subtract.`, `This time the trouble is at the top limit, ${n(L)}, where the bottom of the fraction is 0. ${GENERIC_BLOW(`the top limit ${n(L)}`, `come up to ${n(L)} from below`)}`],
  solution: `An antiderivative is F(t) = ${anti}. From t = 0 to t = ${n(end)} the integral is F(${n(end)}) − F(0) = ${fE} − (${f0}) ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places. ${lim}`,
  guidance: [
   { prompt: `An antiderivative of ${n(k)} ÷ ${d} is ${anti}. What is the integral from t = 0 to t = ${n(end)}, to 3 decimal places?`, answer: [r3(part)], explanation: `Top limit minus bottom limit: F(${n(end)}) − F(0) = ${fE} − (${f0}) ≈ ${n(part)}, which is ${n(r3(part))} to 3 decimal places.` },
   { prompt: `With top limit c, the integral is ${step2}. As c comes up to ${n(L)}, does that settle on a number? Enter 1 for yes, 0 for no.`, answer: [conv ? 1 : 0], explanation: conv ? `As c comes up to ${n(L)}, √(${n(L)} − c) shrinks to 0, so the integral settles on ${n(val)}.` : `As c comes up to ${n(L)}, the part with ${n(L)} − c in it grows without bound in size, so the integral does not settle on a number.` },
   { prompt: 'What is the value of the improper integral? Enter 0 if it diverges.', answer: [r3(val)], explanation: conv ? `The integral converges to ${n(val)}.` : 'The integral diverges, so there is no finite value: enter 0.' }
  ] }; }
});

})();
