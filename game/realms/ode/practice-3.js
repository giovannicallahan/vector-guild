/* Differential equations practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p3.js. */
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
/* Signed sums of letter terms: lin([[1, 'y″'], [3, 'y′'], [2, 'y']]) is 'y″ + 3y′ + 2y'. A coefficient 1 is not
   written (except on a bare number, symbol ''), a coefficient 0 drops the term. */
const sgn = v => v < 0 ? '−' : '+';
const body = (v, s) => { const a = Math.abs(v); if (!s) return n(a); if (a === 1) return s.trim(); return n(a) + s; };
const lin = terms => { const t = terms.filter(([v]) => v !== 0); if (!t.length) return '0';
 return t.map(([v, s], i) => i === 0 ? (v < 0 ? '−' : '') + body(v, s) : ` ${sgn(v)} ${body(v, s)}`).join(''); };
/* e to a multiple of t: ex(1) 'e^(t)', ex(−2) 'e^(−2t)'; ex(−0.6, '') 'e^(−0.6)' for a plain number. */
const ex = (a, v = 't') => v ? `e^(${a === 1 ? '' : a === -1 ? '−' : n(a)}${v})` : `e^(${n(a)})`;
const wt = w => w === 1 ? 't' : `${n(w)}t`;
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => rd(x, k).toFixed(k).replace('-', '−');
/* True when x sits within 0.05 of a step of a rounding tie at k places. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const co = (v, s) => v === 1 ? s : v === -1 ? '−' + s : n(v) + s;
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* 'E + D' written as a gap: gap(60, −50) is '60 − 50', gap(100, 26) is '100 + 26'. */
const gap = (E, D) => `${n(E)} ${sgn(D)} ${Math.abs(D) === 1 ? '' : n(Math.abs(D))}`.trimEnd();
/* A count with its unit, one or many: un(1, 'second', 'seconds') is '1 second'. */
const un = (x, one, many) => `${n(x)} ${x === 1 ? one : many}`;
/* One term of a solution: a coefficient and a function, 'C' = 1 not written. */
const mul = (c, f) => c === 1 ? f : c === -1 ? '−' + f : n(c) + f;

/* ---- q11 Chapter review: first-order models [1.3, 1.4, 1.6] ---- */

/* q11b values for the crate (warming towards the greenhouse) and the duckweed (logistic) families. */
const m11b = p => p.fam === 'warm'
 ? { E: p.Tg, D: p.T0 - p.Tg, v: p.Tg + (p.T0 - p.Tg) * Math.exp(-p.k * p.t) }
 : { E: p.K, D: rd(p.K / p.P0 - 1, 6), v: p.K / (1 + (p.K / p.P0 - 1) * Math.exp(-p.r * p.t)) };
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'Warming the seed crates',
 brief: 'Crates and a floating crop in the greenhouse each head for a steady state, and Mira wants a number for where they end up and where they are at a given time.',
 labels: ['value at the time (3 d.p.)', 'equilibrium'], tolerance: 0.0005,
 gl: [['equilibrium'], ['D'], ['value (3 d.p.)']]
}, {
 /* Two first-order models: a crate warming, T′ = k(Tg − T), and duckweed cover, A′ = rA(1 − A ÷ K) with K = A₀(D + 1) so D is
    whole. The value is asked to 3 decimal places; draws near a rounding tie are skipped. The q11 worked example is a 50 L
    brine tank, which neither family is. */
 canonical: { fam: 'warm', k: 0.2, Tg: 22, T0: 6, t: 10 },
 draw: R => tries(() => R.bool()
   ? { fam: 'warm', k: R.pick([0.05, 0.1, 0.2, 0.25]), Tg: R.int(16, 28), T0: R.int(2, 10), t: R.pick([4, 8, 10, 12, 20]) }
   : { fam: 'duck', r: R.pick([0.3, 0.5, 0.6, 0.8, 1]), P0: R.int(4, 40), D: R.int(2, 12), t: R.int(2, 9) },
  p => { if (p.fam === 'duck') { p.K = p.P0 * (p.D + 1); if (p.K > 600 || p.r * p.t > 8) return false; } return !edge(m11b(p).v, 3); }, { fam: 'warm', k: 0.2, Tg: 22, T0: 6, t: 10 }),
 build: p => { const M = m11b(p), val = rd(M.v, 3), F = fx(M.v, 4), V3 = fx(M.v, 3); if (p.fam === 'warm') { const kt = rd(p.k * p.t, 6), g = gap(p.Tg, M.D); return {
  prompt: `Crates of seed stock are carried from the cold store into the warm greenhouse. A crate’s core temperature T, in °C, obeys T′ = ${n(p.k)}(${n(p.Tg)} − T), where t is in minutes, and T = ${n(p.T0)} °C at t = 0. Enter the core temperature after ${n(p.t)} minutes in °C, to 3 decimal places, then the equilibrium temperature: the constant solution the crate settles towards.`,
  answer: [val, M.E],
  hints: ['An equilibrium is a constant solution, so it makes the right-hand side of the equation 0. Find the temperature that does that.', 'The solution is the equilibrium plus a gap that shrinks like e^(−kt): T(t) = equilibrium + De^(−kt). The constant D is the starting value minus the equilibrium.'],
  solution: `Setting T′ = 0 gives ${n(p.Tg)} − T = 0, so the equilibrium is T = ${n(p.Tg)} °C. The solution is T(t) = ${n(p.Tg)} + De^(−${n(p.k)}t), and T(0) = ${n(p.T0)} gives D = ${n(p.T0)} − ${n(p.Tg)} = ${n(M.D)}, so T(t) = ${g}e^(−${n(p.k)}t). At t = ${n(p.t)}: T = ${g}${ex(-kt, '')} = ${F}…, which is ${V3} °C to 3 decimal places.`,
  guidance: [
   { prompt: `Set T′ = 0 in T′ = ${n(p.k)}(${n(p.Tg)} − T). Which constant T makes the right-hand side 0?`, answer: [M.E], explanation: `${n(p.k)}(${n(p.Tg)} − T) = 0 when ${n(p.Tg)} − T = 0, so T = ${n(p.Tg)} °C. That is the temperature of the greenhouse, which the crate cannot pass.` },
   { prompt: `The solution has the form T(t) = ${n(p.Tg)} + De^(−${n(p.k)}t). Which D gives T(0) = ${n(p.T0)}?`, answer: [M.D], explanation: `At t = 0 the exponential is 1, so T(0) = ${n(p.Tg)} + D. Then D = ${n(p.T0)} − ${n(p.Tg)} = ${n(M.D)}.` },
   { prompt: `Put t = ${n(p.t)} into T(t) = ${g}e^(−${n(p.k)}t). What is the temperature, to 3 decimal places?`, answer: [val], explanation: `${n(p.k)} × ${n(p.t)} = ${n(kt)}, so T = ${g}${ex(-kt, '')} = ${F}…, which is ${V3} °C to 3 decimal places.` }
  ] }; }
  const rt = rd(p.r * p.t, 6), ratio = p.K / p.P0; return {
  prompt: `Duckweed floats on the surface of the greenhouse water tank. Its cover A, in square metres, follows the logistic equation A′ = ${p.r === 1 ? '' : n(p.r)}A(1 − A ÷ ${n(p.K)}), where t is in days, and A = ${n(p.P0)} at t = 0. Enter the cover after ${n(p.t)} days in square metres, to 3 decimal places, then the nonzero equilibrium of the equation (the carrying capacity), in square metres.`,
  answer: [val, M.E],
  hints: ['An equilibrium is a constant solution, so it makes the right-hand side 0. A logistic equation has two; the one the cover heads towards is the one that is not 0.', 'The logistic solution is A(t) = K ÷ (1 + De^(−rt)), where K is the carrying capacity. Put t = 0 in to find D.'],
  solution: `A′ = 0 when A = 0 or when 1 − A ÷ ${n(p.K)} = 0, so the nonzero equilibrium is A = ${n(p.K)} m²: the carrying capacity. The solution is A(t) = ${n(p.K)} ÷ (1 + D${ex(-p.r)}), and A(0) = ${n(p.K)} ÷ (1 + D) = ${n(p.P0)} gives 1 + D = ${n(ratio)}, so D = ${n(M.D)}. At t = ${n(p.t)}: A = ${n(p.K)} ÷ (1 + ${n(M.D)}${ex(-rt, '')}) = ${F}…, which is ${V3} m² to 3 decimal places.`,
  guidance: [
   { prompt: `Set A′ = 0 in A′ = ${p.r === 1 ? '' : n(p.r)}A(1 − A ÷ ${n(p.K)}). Apart from A = 0, which constant A makes it 0?`, answer: [M.E], explanation: `The bracket 1 − A ÷ ${n(p.K)} is 0 when A = ${n(p.K)}. That is the carrying capacity: the cover the tank surface can hold.` },
   { prompt: `The solution has the form A(t) = ${n(p.K)} ÷ (1 + D${ex(-p.r)}). Which D gives A(0) = ${n(p.P0)}?`, answer: [M.D], explanation: `At t = 0 the exponential is 1, so ${n(p.K)} ÷ (1 + D) = ${n(p.P0)}. Then 1 + D = ${n(p.K)} ÷ ${n(p.P0)} = ${n(ratio)}, so D = ${n(M.D)}.` },
   { prompt: `Put t = ${n(p.t)} into A(t) = ${n(p.K)} ÷ (1 + ${n(M.D)}${ex(-p.r)}). What is A, to 3 decimal places?`, answer: [val], explanation: `${n(p.r)} × ${n(p.t)} = ${n(rt)}, so A = ${n(p.K)} ÷ (1 + ${n(M.D)}${ex(-rt, '')}) = ${F}…, which is ${V3} m² to 3 decimal places.` }
  ] }; }
});

/* q11c values: the tank derived from the story. */
const m11c = p => { const a = rd(p.r * p.c, 6), k = rd(p.r / p.V, 6), E = rd(p.c * p.V, 6), D = p.x0 - E; return { a, k, E, D, v: E + D * Math.exp(-k * p.t) }; };
const TANKS = [[100, [2, 5, 10]], [200, [4, 10, 20]], [250, [5, 10, 25]], [400, [4, 8, 20, 40]], [500, [10, 25, 50]]];
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'Dosing the feed tank',
 brief: 'The hydroponic feed tank has to be dosed, and Mira wants the equation built from the pump settings before anyone predicts it.',
 labels: ['nutrient entering (kg/min)', 'equilibrium (kg)', 'amount at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['kg entering per minute'], ['equilibrium (kg)'], ['amount (kg, 3 d.p.)']]
}, {
 /* A stirred tank built from the pump settings: x′ = rc − (r ÷ V)x. V, r and c are chosen so that the rate constant is a
    short decimal and the equilibrium cV is a whole number of kg. The q11 worked example is a 50 L tank, which no draw uses. */
 canonical: { V: 250, r: 10, c: 0.3, x0: 20, t: 30 },
 draw: R => tries(() => { const [V, rs] = R.pick(TANKS); const c = R.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), E = rd(c * V, 6); return { V, r: R.pick(rs), c, x0: R.int(0, 2 * Math.floor(E)), t: R.pick([10, 20, 30, 40]) }; },
  p => { const E = rd(p.c * p.V, 6); return Number.isInteger(E) && p.x0 !== E && p.r / p.V * p.t <= 4 && p.r / p.V * p.t >= 0.4 && !edge(m11c(p).v, 3); }, { V: 250, r: 10, c: 0.3, x0: 20, t: 30 }),
 build: p => { const M = m11c(p), val = rd(M.v, 3), F = fx(M.v, 4), V3 = fx(M.v, 3), kt = rd(M.k * p.t, 6), g = gap(M.E, M.D); return {
  prompt: `The greenhouse’s hydroponic feed tank holds ${n(p.V)} L of nutrient solution and is kept well stirred. Fresh solution with ${n(p.c)} kg of nutrient per litre pours in at ${n(p.r)} L/min, and the mixture is drained at ${n(p.r)} L/min, so the volume stays ${n(p.V)} L. Let x(t) be the kg of nutrient in the tank after t minutes. Nutrient enters at (flow in) × (kg per litre) kg per minute and leaves at (x ÷ ${n(p.V)}) × (flow out) kg per minute, and x′ is what enters minus what leaves, each minute. At t = 0 the tank holds ${n(p.x0)} kg. Enter the nutrient entering each minute in kg, then the equilibrium amount in kg, then the amount after ${n(p.t)} minutes in kg to 3 decimal places.`,
  answer: [M.a, M.E, val],
  hints: ['The nutrient entering each minute is the flow in, in litres per minute, times the kg per litre.', 'At the equilibrium x′ = 0: the nutrient leaving each minute equals the nutrient entering. Write the leaving term as a number times x and solve.', 'The solution is x(t) = equilibrium + De^(−kt), where k is the number multiplying x in the leaving term and D is the starting amount minus the equilibrium.'],
  solution: `Nutrient enters at ${n(p.r)} × ${n(p.c)} = ${n(M.a)} kg per minute and leaves at (x ÷ ${n(p.V)}) × ${n(p.r)} = ${n(M.k)}x kg per minute, so x′ = ${n(M.a)} − ${n(M.k)}x. At the equilibrium ${n(M.a)} − ${n(M.k)}x = 0, so x = ${n(M.a)} ÷ ${n(M.k)} = ${n(M.E)} kg. Then x(t) = ${n(M.E)} + De^(−${n(M.k)}t) with D = ${n(p.x0)} − ${n(M.E)} = ${n(M.D)}, so x(t) = ${g}e^(−${n(M.k)}t). At t = ${n(p.t)}: x = ${g}${ex(-kt, '')} = ${F}…, which is ${V3} kg to 3 decimal places.`,
  guidance: [
   { prompt: `Nutrient enters at the flow in times its concentration: ${n(p.r)} L/min × ${n(p.c)} kg per litre. How many kg enter each minute?`, answer: [M.a], explanation: `${n(p.r)} × ${n(p.c)} = ${n(M.a)} kg per minute.` },
   { prompt: `Nutrient leaves at (x ÷ ${n(p.V)}) × ${n(p.r)} = ${n(M.k)}x kg per minute, so x′ = ${n(M.a)} − ${n(M.k)}x. Which x makes x′ = 0?`, answer: [M.E], explanation: `${n(M.a)} − ${n(M.k)}x = 0 gives x = ${n(M.a)} ÷ ${n(M.k)} = ${n(M.E)} kg. There the tank loses nutrient as fast as it gains it.` },
   { prompt: `The solution is x(t) = ${n(M.E)} + De^(−${n(M.k)}t), and x(0) = ${n(p.x0)} gives D = ${n(p.x0)} − ${n(M.E)} = ${n(M.D)}. What is x(${n(p.t)}) in kg, to 3 decimal places?`, answer: [val], explanation: `${n(M.k)} × ${n(p.t)} = ${n(kt)}, so x = ${g}${ex(-kt, '')} = ${F}…, which is ${V3} kg to 3 decimal places.` }
  ] }; }
});

/* q11d values: the tank, started below its equilibrium by G, asked for the time to close all but 1/den of the gap. */
const m11d = p => { const a = rd(p.r * p.c, 6), k = rd(p.r / p.V, 6), E = rd(p.c * p.V, 6), x0 = E - p.G, g = p.G / p.den; return { a, k, E, x0, g, x1: E - g, t: Math.log(p.den) / k }; };
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q10', title: 'When the valve opens',
 brief: 'A relief valve on a brine tank opens once the salt reaches a set level, and Mira needs to know how long that takes.',
 labels: ['equilibrium (kg)', 'time until the valve opens (min, 2 d.p.)'], tolerance: 0.005,
 gl: [['equilibrium (kg)'], ['fraction of the gap left'], ['time (min, 2 d.p.)']]
}, {
 /* A tank that starts G kg below its equilibrium; the valve opens when the gap has shrunk to G ÷ den (den 2, 4, 5 or 10), so
    t = ln(den) ÷ k. G is a multiple of 20 so every amount is whole. The time is asked to 2 decimal places and ties are skipped. */
 canonical: { V: 400, r: 8, c: 0.5, G: 120, den: 4 },
 draw: R => tries(() => { const [V, rs] = R.pick(TANKS); return { V, r: R.pick(rs), c: R.pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), G: R.pick([40, 60, 80, 100, 120, 160, 200]), den: R.pick([2, 4, 5, 10]) }; },
  p => { const E = rd(p.c * p.V, 6); return Number.isInteger(E) && E >= p.G && !edge(m11d(p).t, 2) && m11d(p).t < 200 && m11d(p).t > 1; }, { V: 400, r: 8, c: 0.5, G: 120, den: 4 }),
 build: p => { const M = m11d(p), tt = rd(M.t, 2), T2 = fx(M.t, 2), T4 = fx(M.t, 4), ratio = 1 / p.den, lnTxt = `ln ${n(p.den)}`; return {
  prompt: `A brine tank in the coolant loop holds ${n(p.V)} L and is kept well stirred. Brine with ${n(p.c)} kg of salt per litre flows in at ${n(p.r)} L/min and the mixture flows out at ${n(p.r)} L/min. The salt x(t) in kg after t minutes obeys x′ = ${n(p.r)} × ${n(p.c)} − (${n(p.r)} ÷ ${n(p.V)})x, that is x′ = ${n(M.a)} − ${n(M.k)}x, and the tank starts with ${n(M.x0)} kg of salt. A relief valve opens the first moment the tank holds ${n(M.x1)} kg. Enter the equilibrium amount in kg, then the number of minutes until the valve opens, to 2 decimal places. (ln is the natural logarithm: if e^u = w then u = ln w.)`,
  answer: [M.E, tt],
  hints: ['The equilibrium is the constant x that makes the right-hand side of the equation 0.', 'Write x(t) = equilibrium + De^(−kt) and find D from the start. Then set x(t) equal to the valve’s amount, solve for e^(−kt), and take the natural logarithm of both sides.'],
  solution: `Setting x′ = 0 gives ${n(M.a)} ÷ ${n(M.k)} = ${n(M.E)} kg. So x(t) = ${n(M.E)} + De^(−${n(M.k)}t), and x(0) = ${n(M.x0)} gives D = ${n(M.x0)} − ${n(M.E)} = ${n(-p.G)}, so x(t) = ${n(M.E)} − ${n(p.G)}e^(−${n(M.k)}t). The valve opens when this is ${n(M.x1)}: ${n(p.G)}e^(−${n(M.k)}t) = ${n(M.E)} − ${n(M.x1)} = ${n(M.g)}, so e^(−${n(M.k)}t) = ${n(M.g)} ÷ ${n(p.G)} = ${n(ratio)}. Taking ln: −${n(M.k)}t = ln ${n(ratio)} = −${lnTxt}, so t = ${lnTxt} ÷ ${n(M.k)} = ${T4}…, which is ${T2} minutes to 2 decimal places.`,
  guidance: [
   { prompt: `Set x′ = 0 in x′ = ${n(M.a)} − ${n(M.k)}x. Which constant x makes the right-hand side 0?`, answer: [M.E], explanation: `${n(M.a)} − ${n(M.k)}x = 0 gives x = ${n(M.a)} ÷ ${n(M.k)} = ${n(M.E)} kg.` },
   { prompt: `The solution is x(t) = ${n(M.E)} − ${n(p.G)}e^(−${n(M.k)}t). The valve opens when x = ${n(M.x1)}, which means ${n(p.G)}e^(−${n(M.k)}t) = ${n(M.E)} − ${n(M.x1)}. What does e^(−${n(M.k)}t) equal at that moment?`, answer: [ratio], explanation: `${n(M.E)} − ${n(M.x1)} = ${n(M.g)}, so ${n(p.G)}e^(−${n(M.k)}t) = ${n(M.g)} and e^(−${n(M.k)}t) = ${n(M.g)} ÷ ${n(p.G)} = ${n(ratio)}.` },
   { prompt: `So e^(−${n(M.k)}t) = ${n(ratio)}. Taking the natural logarithm of both sides gives −${n(M.k)}t = ln ${n(ratio)}. What is t, in minutes to 2 decimal places?`, answer: [tt], explanation: `ln ${n(ratio)} = −${lnTxt}, so t = ${lnTxt} ÷ ${n(M.k)} = ${T4}…, which is ${T2} minutes to 2 decimal places.` }
  ] }; }
});

/* ---- q12 Second-order linear equations: superposition and two starting values [2.1] ---- */

/* The starting values from the constants, for two exponentials e^(at), e^(bt) or for cos wt and sin wt. */
const s12 = p => p.fam === 'exp' ? { y0: p.C1 + p.C2, v0: p.a * p.C1 + p.b * p.C2 } : { y0: p.C1, v0: p.w * p.C2 };
const HINT12 = ['At t = 0 every exponential is 1, cos 0 = 1 and sin 0 = 0. Putting t = 0 into y and into y′ gives two plain equations for C₁ and C₂.', 'Differentiate each given solution before you put t = 0 into y′: the derivative of e^(rt) is re^(rt), of cos ωt is −ω sin ωt and of sin ωt is ω cos ωt.'];
/* The two exponentials of a pair a < b, both nonzero, and the matching equation. */
const expPair = R => { const a = R.nz(-5, 3); let b = R.nz(-5, 4); if (b === a) b = a === 4 ? -5 : a + 1; if (b === 0) b = 1; return a < b ? [a, b] : [b, a]; };
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The vent flap on its hinge',
 brief: 'A greenhouse vent flap swings on its hinge, and Mira wants the constants of its motion pinned down from the first reading.',
 labels: ['C₁', 'C₂'], tolerance: 0.01,
 gl: [['C₂'], ['C₁']]
}, {
 /* Given basis solutions: two exponentials of y″ − (a + b)y′ + aby = 0 with a < b, or cos wt and sin wt of y″ + w²y = 0. Whole
    constants. Not the q12 worked example (e^(−t), e^(2t), C₁ = −1, C₂ = 2). */
 canonical: { fam: 'exp', a: -4, b: 2, C1: 3, C2: -2 },
 draw: R => tries(() => R.next() < 0.6 ? { fam: 'exp', ...(([a, b]) => ({ a, b }))(expPair(R)), C1: R.nz(-6, 6), C2: R.nz(-6, 6) } : { fam: 'trig', w: R.int(2, 6), C1: R.nz(-6, 6), C2: R.nz(-6, 6) },
  p => p.fam === 'trig' || (p.a !== p.b && !(p.a === -1 && p.b === 2 && p.C1 === -1 && p.C2 === 2)), { fam: 'exp', a: -4, b: 2, C1: 3, C2: -2 }),
 build: p => { const { y0, v0 } = s12(p);
  if (p.fam === 'exp') { const P = -(p.a + p.b), Q = p.a * p.b, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), y1 = ex(p.a), y2 = ex(p.b), d = p.b - p.a, rhs = v0 - p.a * y0, dv = lin([[p.a, 'C₁'], [p.b, 'C₂']]); return {
   prompt: `A greenhouse vent flap swings on its hinge. Mira models its angle y(t), in degrees from level, with ${eq} = 0, where t is in seconds. Both y₁ = ${y1} and y₂ = ${y2} are solutions, so by superposition y = C₁${y1} + C₂${y2} is a solution for any constants C₁ and C₂. At t = 0 the flap has y(0) = ${n(y0)} and y′(0) = ${n(v0)}. Enter C₁, then C₂.`,
   answer: [p.C1, p.C2], hints: HINT12,
   solution: `At t = 0 both exponentials are 1, so y(0) = C₁ + C₂ = ${n(y0)}. Differentiating, y′ = ${lin([[p.a, 'C₁' + y1], [p.b, 'C₂' + y2]])}, so y′(0) = ${dv} = ${n(v0)}. Subtract ${par(p.a)} times the first equation from the second: ${co(d, 'C₂')} = ${n(v0)} − ${par(p.a)} × ${par(y0)} = ${n(rhs)}${d === 1 ? '' : `, so C₂ = ${n(rhs)} ÷ ${n(d)} = ${n(p.C2)}`}. Then C₁ = ${n(y0)} − ${par(p.C2)} = ${n(p.C1)}, and y = ${lin([[p.C1, y1], [p.C2, y2]])}.`,
   guidance: [
    { prompt: `The starting values give C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. Take ${par(p.a)} times the first equation away from the second to remove C₁. What is C₂?`, answer: [p.C2], explanation: `The difference is ${co(d, 'C₂')} = ${n(v0)} − ${par(p.a)} × ${par(y0)} = ${n(rhs)}${d === 1 ? '' : `, so C₂ = ${n(rhs)} ÷ ${n(d)} = ${n(p.C2)}`}.` },
    { prompt: `With C₂ = ${n(p.C2)}, what is C₁?`, answer: [p.C1], explanation: `C₁ + C₂ = ${n(y0)}, so C₁ = ${n(y0)} − ${par(p.C2)} = ${n(p.C1)}. Check: ${par(p.a)} × ${par(p.C1)} + ${par(p.b)} × ${par(p.C2)} = ${n(v0)}.` }
   ] }; }
  const w2 = p.w * p.w, c1 = `cos ${wt(p.w)}`, s1 = `sin ${wt(p.w)}`; return {
   prompt: `A greenhouse vent flap swings on its hinge. Mira models its angle y(t), in degrees from level, with y″ + ${n(w2)}y = 0, where t is in seconds and angles inside cos and sin are in radians. Both y₁ = ${c1} and y₂ = ${s1} are solutions, so by superposition y = C₁ ${c1} + C₂ ${s1} is a solution for any constants C₁ and C₂. At t = 0 the flap has y(0) = ${n(y0)} and y′(0) = ${n(v0)}. Enter C₁, then C₂.`,
   answer: [p.C1, p.C2], hints: HINT12,
   solution: `At t = 0, cos 0 = 1 and sin 0 = 0, so y(0) = C₁ = ${n(y0)}. Differentiating, y′ = −${n(p.w)}C₁ sin ${wt(p.w)} + ${n(p.w)}C₂ cos ${wt(p.w)}, so y′(0) = ${n(p.w)}C₂ = ${n(v0)} and C₂ = ${n(v0)} ÷ ${n(p.w)} = ${n(p.C2)}. So y = ${lin([[p.C1, ' ' + c1], [p.C2, ' ' + s1]])}.`,
   guidance: [
    { prompt: `At t = 0, y = C₁ cos 0 + C₂ sin 0. What is C₁?`, answer: [p.C1], explanation: `cos 0 = 1 and sin 0 = 0, so y(0) = C₁, and y(0) = ${n(y0)} gives C₁ = ${n(p.C1)}.` },
    { prompt: `Differentiate: y′ = −${n(p.w)}C₁ sin ${wt(p.w)} + ${n(p.w)}C₂ cos ${wt(p.w)}. At t = 0 this is ${n(p.w)}C₂, and it must equal ${n(v0)}. What is C₂?`, answer: [p.C2], explanation: `sin 0 = 0 and cos 0 = 1, so y′(0) = ${n(p.w)}C₂ = ${n(v0)} and C₂ = ${n(v0)} ÷ ${n(p.w)} = ${n(p.C2)}.` }
   ] }; }
});

const v12c = p => p.C1 * Math.cos(p.w * p.t) + p.C2 * Math.sin(p.w * p.t);
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'The swaying sensor mast',
 brief: 'A sensor mast on the rover sways in the wind, and Mira has only a verbal description of how it started, so the starting values must be read off first.',
 labels: ['y′(0) (cm/s)', 'C₂', 'y at the time (cm, 3 d.p.)'], tolerance: 0.0005,
 gl: [['y′(0) (cm/s)'], ['C₂'], ['y (cm, 3 d.p.)']]
}, {
 /* y″ + w²y = 0 with cos wt and sin wt given. The start is described in words (side and direction), so y(0) = C₁ and
    y′(0) = wC₂ carry the signs; y at t = 0.5 or 1 to 3 decimal places, ties and tiny values skipped. */
 canonical: { w: 3, C1: 4, C2: -2, t: 1 },
 draw: R => tries(() => ({ w: R.int(2, 6), C1: R.nz(-8, 8), C2: R.nz(-6, 6), t: R.pick([0.5, 1]) }), p => !edge(v12c(p), 3) && Math.abs(v12c(p)) >= 0.05, { w: 3, C1: 4, C2: -2, t: 1 }),
 build: p => { const { w, C1, C2, t } = p, v0 = w * C2, v = v12c(p), val = rd(v, 3), wtv = rd(w * t, 6), side = C1 > 0 ? 'right' : 'left', dir = v0 > 0 ? 'right' : 'left', c1 = `cos ${wt(w)}`, s1 = `sin ${wt(w)}`,
  at = lin([[C1, ` cos ${n(wtv)}`], [C2, ` sin ${n(wtv)}`]]); return {
  prompt: `A sensor mast on the rover sways in the wind. Its tip’s position y(t), in cm, is measured to the right of its resting position, so right is positive and left is negative. It obeys y″ + ${n(w * w)}y = 0, where t is in seconds. Both ${c1} and ${s1} are solutions, so y = C₁ ${c1} + C₂ ${s1}, with angles in radians. At t = 0 the tip is ${n(Math.abs(C1))} cm to the ${side} of its resting position and moving ${dir} at ${n(Math.abs(v0))} cm/s. Enter y′(0), with its sign, then C₂, then y(${n(t)}) in cm to 3 decimal places.`,
  answer: [v0, C2, val],
  hints: ['Right is positive, so a tip moving left has a negative y′(0), and a tip to the left has a negative y(0).', 'For y = C₁ cos ωt + C₂ sin ωt, y(0) = C₁ and y′(0) = ωC₂, because the derivative of C₂ sin ωt is ωC₂ cos ωt.', 'Put the time in with the angle in radians, and round only at the end.'],
  solution: `The tip moves ${dir}, which is the ${v0 > 0 ? 'positive' : 'negative'} direction, so y′(0) = ${n(v0)} cm/s. The tip starts ${side} of rest, so y(0) = C₁ = ${n(C1)}. Since y′ = −${n(w)}C₁ sin ${wt(w)} + ${n(w)}C₂ cos ${wt(w)}, y′(0) = ${n(w)}C₂ = ${n(v0)}, so C₂ = ${n(v0)} ÷ ${n(w)} = ${n(C2)}. Then y = ${lin([[C1, ' ' + c1], [C2, ' ' + s1]])}, and y(${n(t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `The tip is moving ${dir} at ${n(Math.abs(v0))} cm/s, and right is positive. What is y′(0)?`, answer: [v0], explanation: `Moving ${dir} means ${v0 > 0 ? 'increasing' : 'decreasing'} y, so y′(0) = ${n(v0)} cm/s.` },
   { prompt: `For y = C₁ ${c1} + C₂ ${s1}, y′(0) = ${n(w)}C₂. With y′(0) = ${n(v0)}, what is C₂?`, answer: [C2], explanation: `C₂ = ${n(v0)} ÷ ${n(w)} = ${n(C2)}.` },
   { prompt: `With C₁ = ${n(C1)} (the starting position y(0)) and C₂ = ${n(C2)}, what is y(${n(t)}) in cm, to 3 decimal places?`, answer: [val], explanation: `y(${n(t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
  ] }; }
});

const v12d = p => p.C1 * Math.exp(p.a * p.t) + p.C2 * Math.exp(p.b * p.t);
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', title: 'Two modes of the flywheel',
 brief: 'A flywheel mount has a fast mode and a slow mode, and both constants and a later reading are needed for the log.',
 labels: ['C₁', 'C₂', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['C₂'], ['C₁'], ['y (3 d.p.)']]
}, {
 /* Two exponentials with a < b, both nonzero, in −6…5 and further apart than in q12; larger constants. y at t = 0.5 or
    1 to 3 decimal places, ties and tiny values skipped. */
 canonical: { a: -5, b: 3, C1: 7, C2: -4, t: 0.5 },
 draw: R => tries(() => { const a = R.nz(-6, 4); let b = R.nz(-6, 5); if (b === 0) b = 1; return { a: Math.min(a, b), b: Math.max(a, b), C1: R.nz(-9, 9), C2: R.nz(-9, 9), t: R.pick([0.5, 1]) }; },
  p => p.b - p.a >= 3 && !edge(v12d(p), 3) && Math.abs(v12d(p)) >= 0.05 && Math.abs(v12d(p)) < 900, { a: -5, b: 3, C1: 7, C2: -4, t: 0.5 }),
 build: p => { const { a, b, C1, C2, t } = p, y0 = C1 + C2, v0 = a * C1 + b * C2, P = -(a + b), Q = a * b, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), y1 = ex(a), y2 = ex(b), d = b - a, rhs = v0 - a * y0,
  dv = lin([[a, 'C₁'], [b, 'C₂']]), v = v12d(p), val = rd(v, 3), at = lin([[C1, ex(rd(a * t, 6), '')], [C2, ex(rd(b * t, 6), '')]]); return {
  prompt: `The wobble angle y(t) of a flywheel mount, in milliradians, obeys ${eq} = 0, with t in seconds. Two of its solutions are y₁ = ${y1} and y₂ = ${y2}, so y = C₁${y1} + C₂${y2} is a solution for any constants C₁ and C₂. At t = 0 the mount has y(0) = ${n(y0)} and y′(0) = ${n(v0)}. Enter C₁, then C₂, then y(${n(t)}) in milliradians to 3 decimal places.`,
  answer: [C1, C2, val],
  hints: HINT12.concat(['Put t = 0 into y and y′ to find C₁ and C₂ first; only then put the time in, and keep every digit of the exponentials until the last step.']),
  solution: `At t = 0 both exponentials are 1, so y(0) = C₁ + C₂ = ${n(y0)}. Differentiating, y′(0) = ${dv} = ${n(v0)}. Subtract ${par(a)} times the first equation from the second: ${co(d, 'C₂')} = ${n(v0)} − ${par(a)} × ${par(y0)} = ${n(rhs)}, so C₂ = ${n(rhs)} ÷ ${n(d)} = ${n(C2)}. Then C₁ = ${n(y0)} − ${par(C2)} = ${n(C1)}. So y = ${lin([[C1, y1], [C2, y2]])}, and y(${n(t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} milliradians to 3 decimal places.`,
  guidance: [
   { prompt: `The starting values give C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. Take ${par(a)} times the first equation away from the second to remove C₁. What is C₂?`, answer: [C2], explanation: `The difference is ${co(d, 'C₂')} = ${n(v0)} − ${par(a)} × ${par(y0)} = ${n(rhs)}, so C₂ = ${n(rhs)} ÷ ${n(d)} = ${n(C2)}.` },
   { prompt: `With C₂ = ${n(C2)}, what is C₁?`, answer: [C1], explanation: `C₁ = ${n(y0)} − ${par(C2)} = ${n(C1)}. Check: ${par(a)} × ${par(C1)} + ${par(b)} × ${par(C2)} = ${n(v0)}.` },
   { prompt: `So y = ${lin([[C1, y1], [C2, y2]])}. What is y(${n(t)}), to 3 decimal places?`, answer: [val], explanation: `y(${n(t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} milliradians to 3 decimal places.` }
  ] }; }
});

/* ---- q13 Characteristic equation with two real roots [2.2] ---- */

const v13 = p => p.C1 * Math.exp(p.r1 * p.t) + p.C2 * Math.exp(p.r2 * p.t);
/* q13c: released from rest at y(0) = (r2 − r1)j, so C1 = r2 j and C2 = −r1 j. */
const c13 = p => { const C1 = p.r2 * p.j, C2 = -p.r1 * p.j; return { C1, C2, y0: C1 + C2, v: C1 * Math.exp(p.r1 * p.t) + C2 * Math.exp(p.r2 * p.t) }; };
/* '(r + 3)(r − 4)' for the roots r1 and r2. */
const fac13 = (r1, r2) => `(r ${sgn(-r1)} ${n(Math.abs(r1))})(r ${sgn(-r2)} ${n(Math.abs(r2))})`;
const HINT13 = ['Try y = e^(rt). It turns the differential equation into the characteristic equation r² + pr + q = 0, with the same coefficients as y″ + py′ + qy = 0. Factor it to find the roots.', 'With roots r₁ and r₂, y = C₁e^(r₁t) + C₂e^(r₂t). Use y(0) and y′(0) to find the constants, then put the time in and round only at the end.'];
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The sun tracker’s tilt error',
 brief: 'The roof sun tracker tilts on a motor arm, and Mira wants to see where its tilt error goes after a gust knocks it.',
 labels: ['smaller root', 'larger root', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['smaller root'], ['larger root'], ['C₂'], ['y (3 d.p.)']]
}, {
 /* y″ + py′ + qy = 0 with one negative and one positive whole root (so, unlike q13, one exponential grows), whole constants, y at
    t = 0.5 or 1 to 3 decimal places, ties and tiny or huge values skipped. Not the q13 worked example (roots −2 and −1). */
 canonical: { r1: -4, r2: 1, C1: 3, C2: -2, t: 1 },
 draw: R => tries(() => ({ r1: R.int(-5, -1), r2: R.int(1, 3), C1: R.nz(-5, 5), C2: R.nz(-5, 5), t: R.pick([0.5, 1]) }),
  p => !edge(v13(p), 3) && Math.abs(v13(p)) >= 0.05 && Math.abs(v13(p)) < 900, { r1: -4, r2: 1, C1: 3, C2: -2, t: 1 }),
 build: p => { const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), y0 = p.C1 + p.C2, v0 = p.r1 * p.C1 + p.r2 * p.C2, d = p.r2 - p.r1, rhs = v0 - p.r1 * y0,
  v = v13(p), val = rd(v, 3), e1 = ex(p.r1), e2 = ex(p.r2), sol = lin([[p.C1, e1], [p.C2, e2]]), at = lin([[p.C1, ex(rd(p.r1 * p.t, 6), '')], [p.C2, ex(rd(p.r2 * p.t, 6), '')]]), dv = lin([[p.r1, 'C₁'], [p.r2, 'C₂']]); return {
  prompt: `A sun tracker on the greenhouse roof tilts on a motor arm. After a gust, its tilt error y(t), in degrees away from the sun, obeys ${eq} = 0, where t is in seconds. At t = 0 it has y(0) = ${n(y0)} and y′(0) = ${n(v0)}. Enter the two roots of the characteristic equation, smaller first, then y(${n(p.t)}) in degrees to 3 decimal places.`,
  answer: [p.r1, p.r2, val], hints: HINT13,
  solution: `The characteristic equation is ${ch} = 0, which factors as ${fac13(p.r1, p.r2)} = 0, so the roots are ${n(p.r1)} and ${n(p.r2)}. So y = C₁${e1} + C₂${e2}. Then y(0) = C₁ + C₂ = ${n(y0)} and y′(0) = ${dv} = ${n(v0)}. Taking ${par(p.r1)} times the first from the second gives ${co(d, 'C₂')} = ${n(rhs)}${d === 1 ? '' : `, so C₂ = ${n(p.C2)}`}, and then C₁ = ${n(p.C1)}: y = ${sol}. At t = ${n(p.t)}: y = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} degrees to 3 decimal places.`,
  guidance: [
   { prompt: `Putting y = e^(rt) into the equation gives the characteristic equation ${ch} = 0. What is its smaller root?`, answer: [p.r1], explanation: `${ch} = ${fac13(p.r1, p.r2)}, so the roots are ${n(p.r1)} and ${n(p.r2)}. The smaller is ${n(p.r1)}.` },
   { prompt: 'And what is its larger root?', answer: [p.r2], explanation: `The other factor gives r = ${n(p.r2)}. Each root r gives a solution e^(rt). A positive root gives an exponential that grows.` },
   { prompt: `With y = C₁${e1} + C₂${e2}, the starting values give C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. What is C₂?`, answer: [p.C2], explanation: `Take ${par(p.r1)} times the first equation from the second: ${co(d, 'C₂')} = ${n(rhs)}${d === 1 ? '' : `, so C₂ = ${n(p.C2)}`}. Then C₁ = ${n(y0)} − ${par(p.C2)} = ${n(p.C1)}.` },
   { prompt: `So y = ${sol}. What is y(${n(p.t)}), to 3 decimal places?`, answer: [val], explanation: `y(${n(p.t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} degrees to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Releasing the airlock arm',
 brief: 'The airlock door arm is let go from rest against its damper, and Mira wants its opening angle a moment later.',
 labels: ['smaller root', 'larger root', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['smaller root'], ['larger root'], ['y (3 d.p.)']]
}, {
 /* y″ = −py′ − qy with whole negative roots r₁ < r₂, released from rest at y(0) = (r₂ − r₁)j, so C₁ = r₂j and C₂ = −r₁j are whole.
    y at t = 0.5, 1 or 1.5 to 3 decimal places, ties and tiny values skipped. */
 canonical: { r1: -5, r2: -2, j: 2, t: 1 },
 draw: R => tries(() => { const r1 = R.int(-6, -2); return { r1, r2: R.int(r1 + 1, -1), j: R.int(1, 3), t: R.pick([0.5, 1, 1.5]) }; },
  p => !edge(c13(p).v, 3) && Math.abs(c13(p).v) >= 0.05, { r1: -5, r2: -2, j: 2, t: 1 }),
 build: p => { const M = c13(p), P = -(p.r1 + p.r2), Q = p.r1 * p.r2, rhsEq = lin([[-P, 'y′'], [-Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), e1 = ex(p.r1), e2 = ex(p.r2), d = p.r2 - p.r1,
  val = rd(M.v, 3), at = lin([[M.C1, ex(rd(p.r1 * p.t, 6), '')], [M.C2, ex(rd(p.r2 * p.t, 6), '')]]); return {
  prompt: `The damped door arm of the airlock is let go from rest. Its opening angle y(t), in degrees, obeys y″ = ${rhsEq}, where t is in seconds. “From rest” means y′(0) = 0, and the arm is released at y(0) = ${un(M.y0, 'degree', 'degrees')}. Enter the two roots of the characteristic equation, smaller first, then y(${n(p.t)}) in degrees to 3 decimal places.`,
  answer: [p.r1, p.r2, val],
  hints: ['Move every term to the left side to get y″ + py′ + qy = 0. The characteristic equation r² + pr + q = 0 then has the same coefficients.', 'With y = C₁e^(r₁t) + C₂e^(r₂t), y(0) = C₁ + C₂ and y′(0) = r₁C₁ + r₂C₂. “From rest” sets y′(0) = 0.'],
  solution: `Moving the terms to the left gives y″ + ${n(P)}y′ + ${n(Q)}y = 0, with characteristic equation ${ch} = 0, which factors as ${fac13(p.r1, p.r2)} = 0, so the roots are ${n(p.r1)} and ${n(p.r2)}. So y = C₁${e1} + C₂${e2}. Then C₁ + C₂ = ${n(M.y0)} and ${lin([[p.r1, 'C₁'], [p.r2, 'C₂']])} = 0. Taking ${par(p.r1)} times the first from the second gives ${co(d, 'C₂')} = ${n(-p.r1 * M.y0)}${d === 1 ? '' : `, so C₂ = ${n(M.C2)}`}, and then C₁ = ${n(M.y0)} − ${par(M.C2)} = ${n(M.C1)}. At t = ${n(p.t)}: y = ${at} = ${fx(M.v, 4)}…, which is ${fx(M.v, 3)} degrees to 3 decimal places.`,
  guidance: [
   { prompt: `Moving all the terms to the left gives y″ + ${n(P)}y′ + ${n(Q)}y = 0, with characteristic equation ${ch} = 0. What is its smaller root?`, answer: [p.r1], explanation: `${ch} = ${fac13(p.r1, p.r2)}, so the roots are ${n(p.r1)} and ${n(p.r2)}. The smaller is ${n(p.r1)}.` },
   { prompt: 'And what is its larger root?', answer: [p.r2], explanation: `The other factor gives r = ${n(p.r2)}. Both roots are negative, so both exponentials die away: the damper settles the arm.` },
   { prompt: `With y = C₁${e1} + C₂${e2}, “from rest at ${n(M.y0)}” gives C₁ + C₂ = ${n(M.y0)} and ${lin([[p.r1, 'C₁'], [p.r2, 'C₂']])} = 0. Solve for C₁ and C₂, then find y(${n(p.t)}) in degrees, to 3 decimal places.`, answer: [val], explanation: `Taking ${par(p.r1)} times the first equation from the second gives ${co(d, 'C₂')} = ${n(-p.r1 * M.y0)}${d === 1 ? '' : `, so C₂ = ${n(M.C2)}`}, and C₁ = ${n(M.C1)}. Then y(${n(p.t)}) = ${at} = ${fx(M.v, 4)}…, which is ${fx(M.v, 3)} degrees to 3 decimal places.` }
  ] }; }
});

/* q13d: the time the solution crosses zero, from e^((r₂ − r₁)t) = −C₁ ÷ C₂. */
const t13 = p => Math.log(-p.C1 / p.C2) / (p.r2 - p.r1);
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q10', title: 'The gimbal crosses zero',
 brief: 'A gimbal arm on the engine-room test stand swings through its zero position once, and Mira wants the moment it does.',
 labels: ['smaller root', 'larger root', 'time at y = 0 (s, 3 d.p.)'], tolerance: 0.0005,
 gl: [['smaller root'], ['larger root'], ['C₂'], ['time (s, 3 d.p.)']]
}, {
 /* Whole roots r₁ < r₂ (both nonzero, in −6…4) and whole constants of opposite sign with |C₂| < |C₁|, so y = C₁e^(r₁t) + C₂e^(r₂t) crosses
    0 exactly once, at t = ln(−C₁ ÷ C₂) ÷ (r₂ − r₁) > 0. The time is asked to 3 decimal places; ties and times over 6 s are skipped. */
 canonical: { r1: -3, r2: 2, C1: 5, C2: -2 },
 draw: R => tries(() => { const a = R.nz(-6, 4); let b = R.nz(-6, 4); if (b === a) b = a === 4 ? -6 : a + 1; if (b === 0) b = 1; const s = R.bool() ? 1 : -1, A = R.int(3, 8); return { r1: Math.min(a, b), r2: Math.max(a, b), C1: s * A, C2: -s * R.int(1, A - 1) }; },
  p => Math.abs(p.C1 / p.C2 * 100 - Math.round(p.C1 / p.C2 * 100)) < 1e-9 && p.r1 < p.r2 && p.r1 !== 0 && p.r2 !== 0 && !edge(t13(p), 3) && t13(p) > 0.05 && t13(p) < 6, { r1: -3, r2: 2, C1: 5, C2: -2 }),
 build: p => { const { r1, r2, C1, C2 } = p, P = -(r1 + r2), Q = r1 * r2, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), y0 = C1 + C2, v0 = r1 * C1 + r2 * C2, d = r2 - r1, rhs = v0 - r1 * y0,
  e1 = ex(r1), e2 = ex(r2), dv = lin([[r1, 'C₁'], [r2, 'C₂']]), T = t13(p), val = rd(T, 3), ratio = -C1 / C2, rt = n(ratio), ed = ex(d), dt = co(d, 't'), div = d === 1 ? '' : ` ÷ ${n(d)}`, sol = lin([[C1, e1], [C2, e2]]); return {
  prompt: `The tilt y(t) of a gimbal arm on the engine-room test stand, in degrees, obeys ${eq} = 0, with t in seconds. It starts at y(0) = ${n(y0)} with y′(0) = ${n(v0)}. The arm passes through y = 0 exactly once after t = 0. Enter the two roots of the characteristic equation, smaller first, then the time in seconds at which y = 0, to 3 decimal places. (ln is the natural logarithm: if e^u = w then u = ln w.)`,
  answer: [r1, r2, val],
  hints: HINT13.concat(['Set C₁e^(r₁t) + C₂e^(r₂t) = 0 and divide by C₂e^(r₁t) to get one exponential e^((r₂ − r₁)t) equal to a number. Then take the natural logarithm of both sides.']),
  solution: `The characteristic equation is ${ch} = 0, which factors as ${fac13(r1, r2)} = 0, so the roots are ${n(r1)} and ${n(r2)}. So y = C₁${e1} + C₂${e2}, with C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. Taking ${par(r1)} times the first from the second gives ${co(d, 'C₂')} = ${n(rhs)}${d === 1 ? '' : `, so C₂ = ${n(C2)}`}, and C₁ = ${n(C1)}. Then y = ${sol}, which is 0 when ${mul(C1, e1)} = ${mul(-C2, e2)}. Dividing both sides by ${mul(-C2, e1)} gives ${ed} = ${n(C1)} ÷ ${par(-C2)} = ${rt}, so t = ln ${rt}${div} = ${fx(T, 4)}…, which is ${fx(T, 3)} seconds to 3 decimal places.`,
  guidance: [
   { prompt: `Putting y = e^(rt) into the equation gives the characteristic equation ${ch} = 0. What is its smaller root?`, answer: [r1], explanation: `${ch} = ${fac13(r1, r2)}, so the roots are ${n(r1)} and ${n(r2)}. The smaller is ${n(r1)}.` },
   { prompt: 'And what is its larger root?', answer: [r2], explanation: `The other factor gives r = ${n(r2)}.` },
   { prompt: `With y = C₁${e1} + C₂${e2}, the starting values give C₁ + C₂ = ${n(y0)} and ${dv} = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `Take ${par(r1)} times the first equation from the second: ${co(d, 'C₂')} = ${n(rhs)}${d === 1 ? '' : `, so C₂ = ${n(C2)}`}. Then C₁ = ${n(y0)} − ${par(C2)} = ${n(C1)}.` },
   { prompt: `So y = ${sol}. Setting y = 0 gives C₁e^(r₁t) = −C₂e^(r₂t), and dividing both sides by ${mul(-C2, e1)} gives ${ed} = ${rt}. Taking the natural logarithm, ${dt} = ln ${rt}. What is t, in seconds to 3 decimal places?`, answer: [val], explanation: `t = ln ${rt}${div} = ${fx(T, 4)}…, which is ${fx(T, 3)} seconds to 3 decimal places. It is the only crossing, because e^((r₂ − r₁)t) takes each value only once.` }
  ] }; }
});

/* ---- q14 Repeated roots [2.2] ---- */

/* The perfect square '(r + 3)²' for the repeated root r. */
const sq14 = r => `(r ${sgn(-r)} ${n(Math.abs(r))})²`;
const v14 = p => (p.y0 + (p.v0 - p.r * p.y0) * p.t) * Math.exp(p.r * p.t);
/* The text of the product-rule step y′ = C₂e^(rt) + r(C₁ + C₂t)e^(rt), with the signs written out. */
const prod14 = r => `C₂${ex(r)} ${sgn(r)} ${Math.abs(r) === 1 ? '' : n(Math.abs(r))}(C₁ + C₂t)${ex(r)}`;
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The seed-store hatch',
 brief: 'The seed-store hatch has a damper fitted exactly on the edge between bouncing and creeping, and Mira wants its angle a moment after release.',
 labels: ['repeated root r', 'C₂', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['repeated root r'], ['C₂'], ['y (3 d.p.)']]
}, {
 /* y″ − 2ry′ + r²y = 0 with one repeated root r (−6…−1), y(0) nonzero, C₂ = y′(0) − ry(0) nonzero. y at t = 0.5, 1 or 2 to 3 decimal places,
    ties and tiny values skipped. Not the q14 worked example (r = −2, y(0) = 3, y′(0) = −1). */
 canonical: { r: -4, y0: 5, v0: -3, t: 1 },
 draw: R => tries(() => ({ r: R.int(-6, -1), y0: R.nz(-8, 8), v0: R.int(-12, 12), t: R.pick([0.5, 1, 2]) }),
  p => p.v0 - p.r * p.y0 !== 0 && !edge(v14(p), 3) && Math.abs(v14(p)) >= 0.05 && !(p.r === -2 && p.y0 === 3 && p.v0 === -1), { r: -4, y0: 5, v0: -3, t: 1 }),
 build: p => { const { r, y0, v0, t } = p, P = -2 * r, Q = r * r, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), C2 = v0 - r * y0, v = v14(p), val = rd(v, 3), at = `(${n(y0)} ${sgn(C2)} ${n(Math.abs(C2))} × ${n(t)})${ex(rd(r * t, 6), '')}`; return {
  prompt: `The seed-store hatch has a spring damper, and its opening angle y(t), in degrees, obeys ${eq} = 0, where t is in seconds. The hatch is released at y(0) = ${n(y0)} with y′(0) = ${n(v0)}. The characteristic equation has one repeated root r, so y = (C₁ + C₂t)e^(rt). Enter r, then C₂, then y(${n(t)}) in degrees to 3 decimal places.`,
  answer: [r, C2, val],
  hints: ['The characteristic equation is a perfect square, (r − r₀)² = 0, so its only root is r₀.', 'At t = 0, y = C₁. The product rule gives y′(0) = rC₁ + C₂, so C₂ = y′(0) − rC₁.', 'Put the time into y = (C₁ + C₂t)e^(rt) and round only at the end.'],
  solution: `The characteristic equation is ${ch} = 0, which is ${sq14(r)} = 0, so the repeated root is r = ${n(r)}. So y = (C₁ + C₂t)${ex(r)}, and y(0) = C₁ = ${n(y0)}. The product rule gives y′ = ${prod14(r)}, so y′(0) = C₂ ${sgn(r)} ${co(Math.abs(r), 'C₁')} = ${n(v0)}. Then C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}. At t = ${n(t)}: y = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} degrees to 3 decimal places.`,
  guidance: [
   { prompt: `The characteristic equation is ${ch} = 0. What is its repeated root?`, answer: [r], explanation: `${ch} = ${sq14(r)}, which is 0 only at r = ${n(r)}. One root gives one exponential, ${ex(r)}, so the second solution is t${ex(r)}.` },
   { prompt: `With y = (C₁ + C₂t)${ex(r)}, y(0) = C₁ = ${n(y0)}. The product rule gives y′(0) = ${co(r, 'C₁')} + C₂, and y′(0) = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}.` },
   { prompt: `So y = (${n(y0)} ${sgn(C2)} ${co(Math.abs(C2), 't')})${ex(r)}. What is y(${n(t)}), to 3 decimal places?`, answer: [val], explanation: `y(${n(t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} degrees to 3 decimal places.` }
  ] }; }
});

const v14c = p => (p.y0 + (p.v0 + p.s * p.y0) * p.t) * Math.exp(-p.s * p.t);
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Setting the brake lever damper',
 brief: 'The return spring of a rover brake lever has an adjustable damper, and Mira wants it set so the lever returns as fast as it can without bouncing.',
 labels: ['damper setting c', 'repeated root r', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['damper setting c'], ['repeated root r'], ['y (3 d.p.)']]
}, {
 /* y″ + cy′ + ky = 0 with k = s² (s from 2 to 7) and c set to 2s, the value that makes c² = 4k and the root repeated at −s. y(0) nonzero,
    C₂ = y′(0) + sy(0) nonzero. y at t = 0.5 or 1 to 3 decimal places, ties and tiny values skipped. */
 canonical: { s: 3, y0: -4, v0: 5, t: 1 },
 draw: R => tries(() => ({ s: R.int(2, 7), y0: R.nz(-8, 8), v0: R.int(-10, 10), t: R.pick([0.5, 1]) }),
  p => p.v0 + p.s * p.y0 !== 0 && !edge(v14c(p), 3) && Math.abs(v14c(p)) >= 0.05, { s: 3, y0: -4, v0: 5, t: 1 }),
 build: p => { const { s, y0, v0, t } = p, k = s * s, c = 2 * s, C2 = v0 + s * y0, v = v14c(p), val = rd(v, 3), r = -s, at = `(${n(y0)} ${sgn(C2)} ${n(Math.abs(C2))} × ${n(t)})${ex(rd(r * t, 6), '')}`; return {
  prompt: `The return spring of a rover brake lever has an adjustable damper. The lever’s position y(t), in degrees from its rest position, obeys y″ + cy′ + ${n(k)}y = 0, where t is in seconds and c > 0 is the damper setting. The characteristic equation r² + cr + ${n(k)} = 0 has exactly one repeated root when c² = 4 × ${n(k)}, and the technician sets the damper to that value of c. The lever is released at y(0) = ${n(y0)} with y′(0) = ${n(v0)}. The solution then has the form y = (C₁ + C₂t)e^(rt). Enter c, then the repeated root r, then y(${n(t)}) in degrees to 3 decimal places.`,
  answer: [c, r, val],
  hints: ['A positive number whose square is c² is the square root of c². Take c² = 4 × k and find c.', 'With c set, the characteristic equation is a perfect square (r − r₀)² = 0, so its only root is r₀.', 'With y = (C₁ + C₂t)e^(rt), y(0) = C₁ and y′(0) = rC₁ + C₂. Find C₂ from these, then put the time in.'],
  solution: `c² = 4 × ${n(k)} = ${n(4 * k)}, so c = ${n(c)}. The characteristic equation is r² + ${n(c)}r + ${n(k)} = 0, which is ${sq14(r)} = 0, so the repeated root is r = ${n(r)}. Then y = (C₁ + C₂t)${ex(r)} with C₁ = y(0) = ${n(y0)}, and y′(0) = ${co(r, 'C₁')} + C₂ = ${n(v0)} gives C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}. At t = ${n(t)}: y = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} degrees to 3 decimal places.`,
  guidance: [
   { prompt: `The condition is c² = 4 × ${n(k)}. What is c, the positive number whose square is ${n(4 * k)}?`, answer: [c], explanation: `c² = ${n(4 * k)}, and ${n(c)} × ${n(c)} = ${n(4 * k)}, so c = ${n(c)}.` },
   { prompt: `With c = ${n(c)}, the characteristic equation is r² + ${n(c)}r + ${n(k)} = 0. What is its repeated root?`, answer: [r], explanation: `r² + ${n(c)}r + ${n(k)} = ${sq14(r)}, which is 0 only at r = ${n(r)}.` },
   { prompt: `With y = (C₁ + C₂t)${ex(r)}, y(0) = C₁ = ${n(y0)} and y′(0) = ${co(r, 'C₁')} + C₂ = ${n(v0)}. Find C₂, then y(${n(t)}) in degrees, to 3 decimal places.`, answer: [val], explanation: `C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}. Then y(${n(t)}) = ${at} = ${fx(v, 4)}…, which is ${fx(v, 3)} degrees to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', title: 'The wheel crosses its rest line',
 brief: 'A rover wheel with a critically tuned spring is pushed through its rest position, and Mira wants the moment it crosses.',
 labels: ['repeated root r', 'C₂', 'crossing time (s)'], tolerance: 0.01,
 gl: [['repeated root r'], ['C₂'], ['time (s)']]
}, {
 /* y″ − 2ry′ + r²y = 0, repeated root r (−5…−1). y(0) = −C₂t₀, so y = (C₁ + C₂t)e^(rt) is 0 exactly once, at t₀ (0.5 to 4 in halves); C₂ is
    chosen so that C₁ = y(0) is whole. y′(0) = C₂ + ry(0). */
 canonical: { r: -3, C2: 4, t0: 1.5 },
 draw: R => tries(() => ({ r: R.int(-5, -1), C2: R.nz(-6, 6), t0: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]) }),
  p => Number.isInteger(p.C2 * p.t0) && Math.abs(p.C2 * p.t0) <= 12, { r: -3, C2: 4, t0: 1.5 }),
 build: ({ r, C2, t0 }) => { const y0 = -C2 * t0, v0 = C2 + r * y0, P = -2 * r, Q = r * r, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]); return {
  prompt: `A rover wheel’s height y(t), in cm above its rest position, obeys ${eq} = 0, where t is in seconds. The wheel is pushed so that y(0) = ${n(y0)} and y′(0) = ${n(v0)}. The characteristic equation has one repeated root r, so y = (C₁ + C₂t)e^(rt). The wheel passes through its rest position, y = 0, exactly once after t = 0. Enter r, then C₂, then the time of that crossing in seconds, to 1 decimal place.`,
  answer: [r, C2, t0],
  hints: ['The characteristic equation is a perfect square, (r − r₀)² = 0, so its only root is r₀. Then y(0) = C₁ and y′(0) = rC₁ + C₂.', 'An exponential is never 0, so y = 0 exactly when the bracket C₁ + C₂t is 0. Solve that for t.'],
  solution: `The characteristic equation is ${ch} = 0, which is ${sq14(r)} = 0, so the repeated root is r = ${n(r)}. Then C₁ = y(0) = ${n(y0)}, and y′(0) = ${co(r, 'C₁')} + C₂ = ${n(v0)} gives C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}. Since ${ex(r)} is never 0, y = 0 when ${n(y0)} ${sgn(C2)} ${co(Math.abs(C2), 't')} = 0, so t = ${n(-y0)} ÷ ${par(C2)} = ${un(t0, 'second', 'seconds')}. This is the only crossing, because the bracket is 0 only once.`,
  guidance: [
   { prompt: `The characteristic equation is ${ch} = 0. What is its repeated root?`, answer: [r], explanation: `${ch} = ${sq14(r)}, which is 0 only at r = ${n(r)}.` },
   { prompt: `With y = (C₁ + C₂t)${ex(r)}, y(0) = C₁ = ${n(y0)} and y′(0) = ${co(r, 'C₁')} + C₂ = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `C₂ = ${n(v0)} − ${par(r)} × ${par(y0)} = ${n(C2)}.` },
   { prompt: `So y = (${n(y0)} ${sgn(C2)} ${co(Math.abs(C2), 't')})${ex(r)}. The exponential is never 0, so y = 0 when the bracket is 0. At what time t is that?`, answer: [t0], explanation: `${n(y0)} ${sgn(C2)} ${co(Math.abs(C2), 't')} = 0 gives t = ${n(-y0)} ÷ ${par(C2)} = ${un(t0, 'second', 'seconds')}.` }
  ] }; }
});

/* ---- q15 Complex roots and Euler's formula [2.2] ---- */

const v15 = p => Math.exp(p.a * p.t) * (p.C1 * Math.cos(p.b * p.t) + p.C2 * Math.sin(p.b * p.t));
/* e^(at)(C₁ cos bt + C₂ sin bt) as text, with a = 0 written without the exponential. */
const form15 = (a, b, C1, C2) => { const inner = lin([[C1, ` cos ${wt(b)}`], [C2, ` sin ${wt(b)}`]]); return a === 0 ? inner : `${ex(a)}(${inner})`; };
const at15 = (a, b, C1, C2, t) => { const inner = lin([[C1, ` cos ${n(rd(b * t, 6))}`], [C2, ` sin ${n(rd(b * t, 6))}`]]); return a === 0 ? inner : `${ex(rd(a * t, 6), '')}(${inner})`; };
const HINT15 = ['Use the quadratic formula on the characteristic equation. The number under the square root is negative; write √(−d) as i√d, so the roots are a ± bi.', 'By Euler’s formula the real solutions are e^(at) cos bt and e^(at) sin bt, so y = e^(at)(C₁ cos bt + C₂ sin bt), with y(0) = C₁ and y′(0) = aC₁ + bC₂. Use radians.'];
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The swinging work lamp',
 brief: 'A work lamp on a flexible arm in the garage swings after every knock, and Mira wants to know how fast it swings and where it is a moment later.',
 labels: ['real part a', 'imaginary part b', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['real part a'], ['imaginary part b'], ['C₂'], ['y (3 d.p.)']]
}, {
 /* y″ + py′ + qy = 0 with roots a ± bi (p = −2a, q = a² + b²), a from −4 to −1, b from 1 to 5; whole constants with y(0) = C₁ and y′(0) = aC₁ + bC₂. y at
    t = 0.5 or 1 to 3 decimal places, ties and tiny values skipped. Not the q15 worked example (−1 ± 2i with C₁ = C₂ = 1). */
 canonical: { a: -3, b: 2, C1: 4, C2: -3, t: 1 },
 draw: R => tries(() => ({ a: R.int(-4, -1), b: R.int(1, 5), C1: R.nz(-5, 5), C2: R.nz(-5, 5), t: R.pick([0.5, 1]) }),
  p => !edge(v15(p), 3) && Math.abs(v15(p)) >= 0.05 && !(p.a === -1 && p.b === 2 && p.C1 === 1 && p.C2 === 1), { a: -3, b: 2, C1: 4, C2: -3, t: 1 }),
 build: p => { const { a, b, C1, C2, t } = p, P = -2 * a, Q = a * a + b * b, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), y0 = C1, v0 = a * C1 + b * C2, disc = P * P - 4 * Q, v = v15(p), val = rd(v, 3),
  root = `${n(a)} ± ${co(b, 'i')}`, dvt = lin([[a, 'C₁'], [b, 'C₂']]), sol = form15(a, b, C1, C2); return {
  prompt: `A work lamp on a flexible arm in the rover garage swings after a knock. Its height y(t), in cm above its rest position, obeys ${eq} = 0, where t is in seconds and angles are in radians. At t = 0 it has y(0) = ${n(y0)} and y′(0) = ${n(v0)}. The characteristic equation has complex roots a ± bi with b > 0. Enter the real part a, then b, then y(${n(t)}) in cm to 3 decimal places.`,
  answer: [a, b, val], hints: HINT15,
  solution: `The characteristic equation is ${ch} = 0. The quadratic formula gives r = (${n(-P)} ± √(${n(disc)})) ÷ 2 = ${root}, since √(${n(disc)}) = ${co(2 * b, 'i')}. So a = ${n(a)} and b = ${n(b)}, and y = ${ex(a)}(C₁ cos ${wt(b)} + C₂ sin ${wt(b)}). Then y(0) = C₁ = ${n(y0)}, and y′(0) = ${dvt} = ${n(v0)} gives C₂ = ${n(C2)}. So y = ${sol}, and y(${n(t)}) = ${at15(a, b, C1, C2, t)} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `The characteristic equation is ${ch} = 0. Its roots are (${n(-P)} ± √(${n(disc)})) ÷ 2. What is their real part a?`, answer: [a], explanation: `The real part is ${n(-P)} ÷ 2 = ${n(a)}. It sets how fast the swings shrink: ${ex(a)} gets smaller as t grows.` },
   { prompt: `√(${n(disc)}) = i√${n(-disc)}. What is b, the positive imaginary part of the roots?`, answer: [b], explanation: `√${n(-disc)} = ${n(2 * b)}, so the roots are ${root} and b = ${n(2 * b)} ÷ 2 = ${n(b)}. It is the angular frequency of the swing.` },
   { prompt: `With y = ${ex(a)}(C₁ cos ${wt(b)} + C₂ sin ${wt(b)}), y(0) = C₁ = ${n(y0)} and y′(0) = ${dvt} = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `${co(b, 'C₂')} = ${n(v0)} − ${par(a)} × ${par(y0)} = ${n(v0 - a * y0)}, so C₂ = ${n(C2)}.` },
   { prompt: `So y = ${sol}. What is y(${n(t)}), to 3 decimal places?`, answer: [val], explanation: `With angles in radians, y(${n(t)}) = ${at15(a, b, C1, C2, t)} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
  ] }; }
});

const v15c = p => v15({ a: p.a, b: p.b, C1: p.C1, C2: p.C2, t: p.t });
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The camera boom on the roof',
 brief: 'A camera boom on the rover roof is built from a mass, a spring and a damper, and Mira wants its swing worked out from those three numbers.',
 labels: ['real part a', 'imaginary part b', 'y at the time (3 d.p.)'], tolerance: 0.0005,
 gl: [['real part a'], ['imaginary part b'], ['y (3 d.p.)']]
}, {
 /* m y″ + cy′ + ky = 0 with m from 2 to 5, roots a ± bi where a is −1 to −3 and b is 1 to 4: c = −2ma, k = m(a² + b²), so the discriminant is −4m²b²
    and both parts of the roots are whole. Whole constants, y at t = 0.5 or 1 to 3 decimal places, ties and tiny values skipped. */
 canonical: { m: 3, a: -2, b: 2, C1: 3, C2: -2, t: 1 },
 draw: R => tries(() => ({ m: R.int(2, 5), a: R.int(-3, -1), b: R.int(1, 4), C1: R.nz(-5, 5), C2: R.nz(-5, 5), t: R.pick([0.5, 1]) }), p => !edge(v15c(p), 3) && Math.abs(v15c(p)) >= 0.05, { m: 3, a: -2, b: 2, C1: 3, C2: -2, t: 1 }),
 build: p => { const { m, a, b, C1, C2, t } = p, c = -2 * m * a, k = m * (a * a + b * b), eq = lin([[m, 'y″'], [c, 'y′'], [k, 'y']]), ch = lin([[m, 'r²'], [c, 'r'], [k, '']]), disc = c * c - 4 * m * k, y0 = C1, v0 = a * C1 + b * C2, v = v15c(p), val = rd(v, 3),
  root = `${n(a)} ± ${co(b, 'i')}`, dvt = lin([[a, 'C₁'], [b, 'C₂']]), sol = form15(a, b, C1, C2); return {
  prompt: `A camera boom on the rover roof is a mass of ${n(m)} kg on a spring and a damper, and its height y(t), in cm above its rest position, obeys ${eq} = 0, where t is in seconds and angles are in radians. Putting y = e^(rt) into m y″ + c y′ + k y = 0 gives the characteristic equation m r² + c r + k = 0, and the quadratic formula gives r = (−c ± √(c² − 4mk)) ÷ (2m). At t = 0 the boom has y(0) = ${n(y0)} and y′(0) = ${n(v0)}. The roots are complex, a ± bi with b > 0. Enter the real part a, then b, then y(${n(t)}) in cm to 3 decimal places.`,
  answer: [a, b, val], hints: HINT15,
  solution: `The characteristic equation is ${ch} = 0. The quadratic formula gives r = (${n(-c)} ± √(${n(disc)})) ÷ ${n(2 * m)} = (${n(-c)} ± ${co(2 * m * b, 'i')}) ÷ ${n(2 * m)} = ${root}, since √(${n(disc)}) = ${co(2 * m * b, 'i')}. So a = ${n(a)} and b = ${n(b)}, and y = ${ex(a)}(C₁ cos ${wt(b)} + C₂ sin ${wt(b)}). Then y(0) = C₁ = ${n(y0)}, and y′(0) = ${dvt} = ${n(v0)} gives C₂ = ${n(C2)}. So y = ${sol}, and y(${n(t)}) = ${at15(a, b, C1, C2, t)} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `Here m = ${n(m)}, c = ${n(c)} and k = ${n(k)}, so c² − 4mk = ${n(disc)}. The roots are (${n(-c)} ± √(${n(disc)})) ÷ ${n(2 * m)}. What is their real part a?`, answer: [a], explanation: `The real part is ${n(-c)} ÷ ${n(2 * m)} = ${n(a)}. It sets how fast the swings shrink: ${ex(a)} gets smaller as t grows.` },
   { prompt: `√(${n(disc)}) = i√${n(-disc)}, and the roots are (${n(-c)} ± i√${n(-disc)}) ÷ ${n(2 * m)}. What is b, the positive imaginary part?`, answer: [b], explanation: `√${n(-disc)} = ${n(2 * m * b)}, so b = ${n(2 * m * b)} ÷ ${n(2 * m)} = ${n(b)}. The roots are ${root}.` },
   { prompt: `With y = ${ex(a)}(C₁ cos ${wt(b)} + C₂ sin ${wt(b)}), y(0) = C₁ = ${n(y0)} and y′(0) = ${dvt} = ${n(v0)}. Find C₂, then y(${n(t)}) in cm, to 3 decimal places.`, answer: [val], explanation: `${co(b, 'C₂')} = ${n(v0)} − ${par(a)} × ${par(y0)} = ${n(v0 - a * y0)}, so C₂ = ${n(C2)}. With angles in radians, y(${n(t)}) = ${at15(a, b, C1, C2, t)} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
  ] }; }
});

const v15d = p => p.C2 * Math.exp(p.a * Math.PI / (2 * p.b));
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', title: 'The mast struck from rest',
 brief: 'An antenna mast on the rover is struck while it sits at its centre line, and Mira wants its height at the first peak of its swing.',
 labels: ['real part a', 'imaginary part b', 'y at t = π ÷ (2b) (cm, 3 d.p.)'], tolerance: 0.0005,
 gl: [['real part a'], ['imaginary part b'], ['C₂'], ['y (cm, 3 d.p.)']]
}, {
 /* y″ + py′ + qy = 0 with roots a ± bi (a from −4 to −1, b from 2 to 7), started at y(0) = 0 with y′(0) = bC₂, so y = C₂e^(at) sin bt and, at t = π ÷ (2b), sin bt = 1
    and y = C₂e^(aπ ÷ 2b). Whole C₂; value to 3 decimal places, ties and tiny values skipped. */
 canonical: { a: -2, b: 5, C2: 4 },
 draw: R => tries(() => ({ a: R.int(-4, -1), b: R.int(2, 7), C2: R.nz(-6, 6) }), p => !edge(v15d(p), 3) && Math.abs(v15d(p)) >= 0.05, { a: -2, b: 5, C2: 4 }),
 build: p => { const { a, b, C2 } = p, P = -2 * a, Q = a * a + b * b, eq = lin([[1, 'y″'], [P, 'y′'], [Q, 'y']]), ch = lin([[1, 'r²'], [P, 'r'], [Q, '']]), disc = P * P - 4 * Q, v0 = b * C2, v = v15d(p), val = rd(v, 3),
  root = `${n(a)} ± ${co(b, 'i')}`, ang = rd(a * Math.PI / (2 * b), 6), dvt = lin([[a, 'C₁'], [b, 'C₂']]); return {
  prompt: `An antenna mast on the rover is struck while it rests at its centre line, so its height y(t), in cm, obeys ${eq} = 0 with y(0) = 0 and y′(0) = ${n(v0)}, where t is in seconds and angles are in radians. The characteristic equation has complex roots a ± bi with b > 0. Enter a, then b, then the height y at t = π ÷ (2b) seconds, in cm to 3 decimal places, using the b you found.`,
  answer: [a, b, val],
  hints: HINT15.concat(['With y(0) = 0 the cosine term is missing, so y is a constant times e^(at) sin bt. Find that constant from y′(0), then work out what sin bt is at t = π ÷ (2b).']),
  solution: `The characteristic equation is ${ch} = 0. The quadratic formula gives r = (${n(-P)} ± √(${n(disc)})) ÷ 2 = ${root}, since √(${n(disc)}) = ${co(2 * b, 'i')}. So a = ${n(a)} and b = ${n(b)}, and y = ${ex(a)}(C₁ cos ${wt(b)} + C₂ sin ${wt(b)}). Then y(0) = C₁ = 0, and y′(0) = ${dvt} = ${n(v0)} gives ${co(b, 'C₂')} = ${n(v0)}, so C₂ = ${n(C2)}. So y = ${mul(C2, ex(a))} sin ${wt(b)}. At t = π ÷ (2b), bt = π ÷ 2, where sin bt = 1, so y = ${mul(C2, `e^(${n(a)}π ÷ ${n(2 * b)})`)} = ${mul(C2, `e^(${n(ang)})`)} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.`,
  guidance: [
   { prompt: `The characteristic equation is ${ch} = 0. Its roots are (${n(-P)} ± √(${n(disc)})) ÷ 2. What is their real part a?`, answer: [a], explanation: `The real part is ${n(-P)} ÷ 2 = ${n(a)}.` },
   { prompt: `√(${n(disc)}) = i√${n(-disc)}. What is b, the positive imaginary part of the roots?`, answer: [b], explanation: `√${n(-disc)} = ${n(2 * b)}, so the roots are ${root} and b = ${n(2 * b)} ÷ 2 = ${n(b)}.` },
   { prompt: `With y = ${ex(a)}(C₁ cos ${wt(b)} + C₂ sin ${wt(b)}), y(0) = C₁ = 0 and y′(0) = ${dvt} = ${n(v0)}. What is C₂?`, answer: [C2], explanation: `With C₁ = 0, y′(0) = ${co(b, 'C₂')} = ${n(v0)}, so C₂ = ${n(v0)} ÷ ${n(b)} = ${n(C2)}.` },
   { prompt: `So y = ${mul(C2, ex(a))} sin ${wt(b)}. At t = π ÷ (2b) the angle bt is π ÷ 2, and sin(π ÷ 2) = 1. What is y there, in cm to 3 decimal places?`, answer: [val], explanation: `y = ${mul(C2, `e^(${n(a)}π ÷ ${n(2 * b)})`)} = ${mul(C2, `e^(${n(ang)})`)} = ${fx(v, 4)}…, which is ${fx(v, 3)} cm to 3 decimal places.` }
  ] }; }
});

})();
