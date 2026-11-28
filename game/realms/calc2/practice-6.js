/* Calculus 2: accumulation practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p6.js. */
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
const r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000, r4 = x => Math.round(x * 10000) / 10000;
const f2 = x => r2(x).toFixed(2), f3 = x => r3(x).toFixed(3), f4 = x => r4(x).toFixed(4);
/* True when x is not within 0.02 of a rounding tie at d decimal places, so a calculator and this file always round alike. */
const sf = (x, d) => { const v = x * Math.pow(10, d); return Math.abs(v - Math.floor(v) - 0.5) > 0.02; };
/* Subscript and superscript digits: sub(10) is '₁₀', sup(2) is '²'. */
const sub = k => String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
const sup = k => String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
/* A coefficient in front of a letter: co(1, 'x') is 'x', co(5, 'x') is '5x'. A number in front of e: 1 is left out. */
const co = (v, x) => v === 1 ? x : `${n(v)}${x}`;
const ce = v => v === 1 ? '' : n(v);
/* '= 2.5' when the value is exact to 4 places, otherwise '≈ 2.8261'; say3 adds the rounding to 3 places when it matters. */
const ap = x => `${Math.abs(x - r4(x)) < 1e-9 ? '=' : '≈'} ${n(x)}`;
const say3 = x => Math.abs(x - r3(x)) < 1e-9 ? `= ${n(x)}` : n(x) === n(r3(x)) ? `≈ ${n(x)}` : `≈ ${n(x)}, which is ${f3(x)} to 3 decimal places`;
/* The geometric series a, ar, ar², … with r = p/q and a = q²(q − p)j, so the terms and the sum q³j are whole. */
const geo = ({ p, q, j }) => { const a = q * q * (q - p) * j, a1 = a * p / q, a2 = a * p * p / (q * q), S = q * q * q * j, S3 = a + a1 + a2;
 return { a, a1, a2, r: p / q, S, S3, left: S - S3, frac: `${p}/${q}`, oneMinus: `${q - p}/${q}`, om: (q - p) / q, inv: q - p === 1 ? n(q) : `${q}/${q - p}` }; };
const PAIRS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]];
const PCTS = [[1, 5], [1, 4], [2, 5], [1, 2], [3, 5], [3, 4], [4, 5]];
const drawGeo = (R, list = PAIRS) => { const [p, q] = R.pick(list); return { p, q, j: R.int(1, Math.min(6, Math.floor(999 / (q * q * q)))) }; };

/* ---- q26 Exponential growth and decay; half-life [2.8] ---- */

/* Algae that double: k = ln 2 ÷ D to 4 places, then the time to grow by a factor f (never a power of 2) to 2 places. */
mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The algae vat',
 brief: 'The greenhouse grows algae in a vat to feed the crew, and the cooks need to know when it will be ready to harvest.',
 labels: ['k per hour (4 d.p.)', 'time (hours, 2 d.p.)'], tolerance: 0.00005,
 gl: [['k per hour (4 d.p.)'], ['ln of the ratio (4 d.p.)'], ['time (hours, 2 d.p.)']]
}, {
 canonical: { D: 9, y0: 40, f: 6 },
 draw: R => { let p; do { p = { D: R.int(3, 18), y0: 5 * R.int(2, 16), f: R.pick([3, 5, 6, 7, 10]) }; const k = Math.LN2 / p.D; p.ok = sf(k, 4) && sf(Math.log(p.f) / k, 2) && sf(Math.log(p.f), 4); } while (!p.ok); delete p.ok; return p; },
 build: ({ D, y0, f }) => { const k = Math.LN2 / D, lr = Math.log(f), t = lr / k, y1 = y0 * f; return {
  prompt: `The greenhouse grows algae in a vat. The algae double in mass every ${n(D)} hours, so the mass after t hours is y(t) = ${n(y0)}e^(kt) kg, with ${n(y0)} kg in the vat now. Enter the rate constant k, per hour, to 4 decimal places, then the number of hours until the vat holds ${n(y1)} kg, to 2 decimal places (work with the unrounded k).`,
  answer: [r4(k), r2(t)],
  hints: [`Doubling every ${n(D)} hours means ${n(y0)}e^(${n(D)}k) = ${n(2 * y0)}, so e^(${n(D)}k) = 2. Take ln of both sides.`,
   `Then solve ${n(y0)}e^(kt) = ${n(y1)}: divide by ${n(y0)}, take ln of both sides, and divide by k.`],
  solution: `e^(${n(D)}k) = 2 gives ${n(D)}k = ln 2, so k = ln 2 ÷ ${n(D)} ≈ ${f4(k)} to 4 decimal places. Then ${n(y0)}e^(kt) = ${n(y1)} gives e^(kt) = ${n(f)}, so kt = ln ${n(f)} = ${n(lr)} and t = ${n(lr)} ÷ k ≈ ${n(t)}, dividing by the unrounded k, which is ${f2(t)} hours to 2 decimal places.`,
  guidance: [
   { prompt: `Doubling gives e^(${n(D)}k) = 2, so k = ln 2 ÷ ${n(D)}. What is k to 4 decimal places?`, answer: [r4(k)], explanation: `ln 2 ≈ 0.6931, and ln 2 ÷ ${n(D)} ≈ ${f4(k)} to 4 decimal places. Keep the full value of k for the next steps.` },
   { prompt: `To reach ${n(y1)} kg, e^(kt) = ${n(y1)} ÷ ${n(y0)} = ${n(f)}, so kt = ln ${n(f)}. What is ln ${n(f)} to 4 decimal places?`, answer: [r4(lr)], explanation: `The natural logarithm of ${n(f)} is ${f4(lr)} to 4 decimal places.` },
   { prompt: `Divide by the unrounded k: t = ln ${n(f)} ÷ k. How many hours is that, to 2 decimal places?`, answer: [r2(t)], explanation: `${n(lr)} ÷ k ≈ ${n(t)} with the unrounded k, which is ${f2(t)} hours. That is about ${n(r2(t / D))} doubling times.` }
  ] }; }
});

/* An echo measured at two moments: k = ln(y0 ÷ y1) ÷ t1 to 4 places, then the half-life ln 2 ÷ k to 2 places. y0 ÷ y1 is not 2. */
mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'How fast the echo fades',
 brief: 'An echo off the far mirror is fading, and the engineers have two readings but no half-life.',
 labels: ['k per minute (4 d.p.)', 'half-life (minutes, 2 d.p.)'], tolerance: 0.00005,
 gl: [['ln of the ratio (4 d.p.)'], ['k per minute (4 d.p.)'], ['half-life (minutes, 2 d.p.)']]
}, {
 canonical: { y0: 90, y1: 60, t1: 5 },
 draw: R => { let p; do { const y0 = 10 * R.int(4, 15); p = { y0, y1: R.int(Math.ceil(0.35 * y0), Math.floor(0.85 * y0)), t1: R.int(2, 12) }; const lr = Math.log(p.y0 / p.y1), k = lr / p.t1;
   p.ok = 2 * p.y1 !== p.y0 && sf(lr, 4) && sf(k, 4) && sf(Math.LN2 / k, 2); } while (!p.ok); delete p.ok; return p; },
 build: ({ y0, y1, t1 }) => { const lr = Math.log(y0 / y1), k = lr / t1, T = Math.LN2 / k; return {
  prompt: `The Deep Signal Array records an echo off the far mirror. The echo’s strength is y(t) = ${n(y0)}e^(−kt) units at t minutes after it leaves the dish, and a reading at ${n(t1)} minutes shows ${n(y1)} units. Enter the rate constant k, per minute, to 4 decimal places, then the half-life of the echo, in minutes, to 2 decimal places (work with the unrounded k).`,
  answer: [r4(k), r2(T)],
  hints: [`At t = ${n(t1)} the strength is ${n(y1)}, so ${n(y0)}e^(−${n(t1)}k) = ${n(y1)}. Divide by ${n(y0)} and take ln of both sides to find ${n(t1)}k.`,
   'The half-life T is the time at which e^(−kT) has fallen to 1/2, which gives T = ln 2 ÷ k. Use the unrounded k.'],
  solution: `${n(y0)}e^(−${n(t1)}k) = ${n(y1)} gives e^(−${n(t1)}k) = ${n(y1)} ÷ ${n(y0)}, so ${n(t1)}k = ln(${n(y0)} ÷ ${n(y1)}) = ${n(lr)} and k = ${n(lr)} ÷ ${n(t1)} ≈ ${f4(k)} to 4 decimal places. The half-life satisfies e^(−kT) = 1/2, so T = ln 2 ÷ k ≈ ${n(T)} with the unrounded k, which is ${f2(T)} minutes to 2 decimal places.`,
  guidance: [
   { prompt: `The reading gives e^(−${n(t1)}k) = ${n(y1)} ÷ ${n(y0)}, so ${n(t1)}k = ln(${n(y0)} ÷ ${n(y1)}). What is ln(${n(y0)} ÷ ${n(y1)}) to 4 decimal places?`, answer: [r4(lr)], explanation: `${n(y0)} ÷ ${n(y1)} ${ap(y0 / y1)}, and its natural logarithm is ${f4(lr)} to 4 decimal places.` },
   { prompt: `Divide by ${n(t1)}: k = ln(${n(y0)} ÷ ${n(y1)}) ÷ ${n(t1)}. What is k to 4 decimal places?`, answer: [r4(k)], explanation: `${n(lr)} ÷ ${n(t1)} ≈ ${f4(k)} to 4 decimal places. Keep the full value of k for the next step.` },
   { prompt: 'The half-life is T = ln 2 ÷ k. Using the unrounded k, how many minutes is that, to 2 decimal places?', answer: [r2(T)], explanation: `ln 2 ÷ k ≈ ${n(T)} with the unrounded k, which is ${f2(T)} minutes to 2 decimal places.` }
  ] }; }
});

/* Fuel decaying at half-life T; the cells release c MJ per kg per day, so heat flows at c·y0·e^(−kt). Total heat in the first D days is
   (c·y0 ÷ k)(1 − e^(−kD)) MJ. Uses q05 (the integral of e^(−kt)). */
mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q05', title: 'Heat from the dying fuel',
 brief: 'The power cells heat the array from a fuel that is slowly decaying, and the engineers want the total heat it gives before it is spent.',
 labels: ['k per day (4 d.p.)', 'heat released (MJ, 2 d.p.)'], tolerance: 0.00005,
 gl: [['k per day (4 d.p.)'], ['e^(−kD) (4 d.p.)'], ['heat released (MJ, 2 d.p.)']]
}, {
 canonical: { T: 14, y0: 50, c: 3, D: 20 },
 draw: R => { let p; do { p = { T: R.int(6, 24), y0: 10 * R.int(2, 10), c: R.int(2, 5), D: R.int(5, 40) }; const k = Math.LN2 / p.T, E = Math.exp(-k * p.D);
   p.ok = sf(k, 4) && sf(E, 4) && sf(p.c * p.y0 / k * (1 - E), 2); } while (!p.ok); delete p.ok; return p; },
 build: ({ T, y0, c, D }) => { const k = Math.LN2 / T, cy = c * y0, E = Math.exp(-k * D), full = cy / k, tot = full * (1 - E); return {
  prompt: `The power cells of the Deep Signal Array burn a decaying fuel with a half-life of ${n(T)} days, and the store holds ${n(y0)} kg now, so it holds y(t) = ${n(y0)}e^(−kt) kg after t days. The cells release ${n(c)} megajoules (MJ) of heat per kg of fuel per day, so the heat flows out at ${n(cy)}e^(−kt) MJ per day. Enter the rate constant k, per day, to 4 decimal places, then the total heat released in the first ${n(D)} days, in MJ, to 2 decimal places (type it without commas, and work with the unrounded k).`,
  answer: [r4(k), r2(tot)],
  hints: [`The half-life gives e^(−${n(T)}k) = 1/2, so k = ln 2 ÷ ${n(T)}.`,
   `The total heat is the integral from 0 to ${n(D)} of ${n(cy)}e^(−kt) dt. An antiderivative is −(${n(cy)} ÷ k)e^(−kt), so the total is (${n(cy)} ÷ k)(1 − e^(−${n(D)}k)).`],
  solution: `e^(−${n(T)}k) = 1/2 gives k = ln 2 ÷ ${n(T)} ≈ ${f4(k)} to 4 decimal places. The heat released is the integral from 0 to ${n(D)} of ${n(cy)}e^(−kt) dt = [−(${n(cy)} ÷ k)e^(−kt)] from 0 to ${n(D)} = (${n(cy)} ÷ k)(1 − e^(−${n(D)}k)). With the unrounded k, e^(−${n(D)}k) ≈ ${f4(E)} and ${n(cy)} ÷ k ≈ ${n(full)}, so the total is ≈ ${n(tot)}, which is ${f2(tot)} MJ to 2 decimal places.`,
  guidance: [
   { prompt: `The half-life gives e^(−${n(T)}k) = 1/2, so k = ln 2 ÷ ${n(T)}. What is k to 4 decimal places?`, answer: [r4(k)], explanation: `ln 2 ≈ 0.6931, and ln 2 ÷ ${n(T)} ≈ ${f4(k)} to 4 decimal places. Keep the full value of k for the next steps.` },
   { prompt: `The total heat is (${n(cy)} ÷ k)(1 − e^(−${n(D)}k)). Using the unrounded k, what is e^(−${n(D)}k) to 4 decimal places?`, answer: [r4(E)], explanation: `${n(D)}k ≈ ${n(k * D)}, and e to the power −${n(k * D)} is ${f4(E)} to 4 decimal places. About ${n(r2(E * 100))}% of the fuel is still there after ${n(D)} days.` },
   { prompt: `Now the total: (${n(cy)} ÷ k) × (1 − e^(−${n(D)}k)), with the unrounded k. How many MJ is that, to 2 decimal places?`, answer: [r2(tot)], explanation: `${n(cy)} ÷ k ≈ ${n(full)} and 1 − ${f4(E)} ≈ ${n(1 - E)}, so the total is ≈ ${n(tot)}, which is ${f2(tot)} MJ to 2 decimal places.` }
  ] }; }
});

/* ---- q27 Sequences and their limits [5.1] ---- */

/* aₙ = (p n² + q n) ÷ (r n² + s): the term a_m to 3 places, then the limit p ÷ r (r is 1, 2, 4 or 5, so it is a short decimal). */
mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'Pump pressure settling',
 brief: 'The coolant pump makes stroke after stroke, and Mira wants the pressure level its readings are heading for.',
 labels: ['term (3 d.p.)', 'limit'], tolerance: 0.0005,
 gl: [['term (3 d.p.)'], ['top approaches', 'bottom approaches'], ['limit']]
}, {
 canonical: { p: 5, q: 3, r: 2, s: 7, m: 20 },
 draw: R => { let P; do { P = { p: R.int(1, 9), q: R.int(1, 9), r: R.pick([1, 2, 4, 5]), s: R.int(1, 9), m: R.pick([10, 20, 50]) }; P.ok = sf((P.p * P.m * P.m + P.q * P.m) / (P.r * P.m * P.m + P.s), 3); } while (!P.ok); delete P.ok; return P; },
 build: ({ p, q, r, s, m }) => { const m2 = m * m, top = p * m2 + q * m, bot = r * m2 + s, am = r3(top / bot), L = p / r, f = `(${co(p, 'n²')} + ${co(q, 'n')}) ÷ (${co(r, 'n²')} + ${n(s)})`; return {
  prompt: `The coolant pump in the Deep Signal Array makes stroke after stroke, and its pressure reading after stroke n is aₙ = ${f}. Enter a${sub(m)}, the reading after stroke ${n(m)}, to 3 decimal places, then the limit of the sequence as n → ∞.`,
  answer: [am, L],
  hints: [`Put n = ${n(m)} into the formula, so n² = ${n(m2)}. Work out the top and the bottom, then divide.`,
   `For the limit, divide the top and the bottom by n², the fastest-growing piece. The parts ${n(q)} ÷ n and ${n(s)} ÷ n² shrink to 0 as n grows.`],
  solution: `With n = ${n(m)}, n² = ${n(m2)}, so the top is ${n(p)} × ${n(m2)} + ${n(q)} × ${n(m)} = ${n(top)} and the bottom is ${n(r)} × ${n(m2)} + ${n(s)} = ${n(bot)}, so a${sub(m)} = ${n(top)} ÷ ${n(bot)} ${say3(top / bot)}. Dividing the top and the bottom by n² gives aₙ = (${n(p)} + ${n(q)} ÷ n) ÷ (${n(r)} + ${n(s)} ÷ n²). As n → ∞ the parts ${n(q)} ÷ n and ${n(s)} ÷ n² approach 0, so aₙ approaches ${n(p)} ÷ ${n(r)} = ${n(L)}. The limit is ${n(L)}.`,
  guidance: [
   { prompt: `Put n = ${n(m)} into aₙ = ${f}. What is a${sub(m)} to 3 decimal places?`, answer: [am], explanation: `The top is ${n(p)} × ${n(m2)} + ${n(q)} × ${n(m)} = ${n(top)} and the bottom is ${n(r)} × ${n(m2)} + ${n(s)} = ${n(bot)}. ${n(top)} ÷ ${n(bot)} ${say3(top / bot)}.` },
   { prompt: `Divide the top and the bottom by n²: aₙ = (${n(p)} + ${n(q)} ÷ n) ÷ (${n(r)} + ${n(s)} ÷ n²). As n → ∞, what do the top and the bottom approach?`, answer: [p, r], explanation: `${n(q)} ÷ n and ${n(s)} ÷ n² shrink to 0, so the top approaches ${n(p)} and the bottom approaches ${n(r)}.` },
   { prompt: 'So what is the limit of the sequence?', answer: [L], explanation: `${n(p)} ÷ ${n(r)} = ${n(L)}. The readings settle on ${n(L)}, the ratio of the two n² coefficients.` }
  ] }; }
});

/* aₙ = (p·2ⁿ + q) ÷ (r·2ⁿ + s): a_m to 3 places, the limit p ÷ r, and the gap |p ÷ r − a_m| to 3 places (at least 0.01, so it never rounds to 0). */
mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The sensor warm-up gap',
 brief: 'A sensor settles as it warms up, and the crew wants to know how close it is to its final level after a few minutes.',
 labels: ['term (3 d.p.)', 'limit', 'gap (3 d.p.)'], tolerance: 0.0005,
 gl: [['term (3 d.p.)'], ['limit'], ['gap (3 d.p.)']]
}, {
 canonical: { p: 7, q: 3, r: 2, s: 5, m: 6 },
 draw: R => { let P; do { P = { p: R.int(1, 9), q: R.int(1, 9), r: R.pick([1, 2, 4, 5]), s: R.int(1, 9), m: R.int(4, 9) }; const G2 = Math.pow(2, P.m), a = (P.p * G2 + P.q) / (P.r * G2 + P.s), gap = Math.abs(P.p / P.r - a);
   P.ok = P.p * P.s !== P.q * P.r && gap >= 0.01 && sf(a, 3) && sf(gap, 3); } while (!P.ok); delete P.ok; return P; },
 build: ({ p, q, r, s, m }) => { const G2 = Math.pow(2, m), lead = v => v === 1 ? '2ⁿ' : `${n(v)} × 2ⁿ`, f = `(${lead(p)} + ${n(q)}) ÷ (${lead(r)} + ${n(s)})`,
  top = p * G2 + q, bot = r * G2 + s, a = top / bot, L = p / r, gap = Math.abs(L - a), hi = Math.max(L, a), lo = Math.min(L, a); return {
  prompt: `A sensor in the Deep Signal Array settles as it warms up. After n minutes of warming, its reading is aₙ = ${f}. Enter a${sub(m)}, the reading after ${n(m)} minutes, to 3 decimal places, then the level the readings settle on (the limit), then how far a${sub(m)} still is from that level, to 3 decimal places (a positive number).`,
  answer: [r3(a), L, r3(gap)],
  hints: [`Put n = ${n(m)} into the formula, where 2${sup(m)} = ${n(G2)}. Work out the top and the bottom, then divide.`,
   `For the limit, divide the top and the bottom by 2ⁿ: the parts ${n(q)} ÷ 2ⁿ and ${n(s)} ÷ 2ⁿ shrink to 0. The gap is the difference between the limit and a${sub(m)}.`],
  solution: `With n = ${n(m)}, 2${sup(m)} = ${n(G2)}, so the top is ${n(p)} × ${n(G2)} + ${n(q)} = ${n(top)} and the bottom is ${n(r)} × ${n(G2)} + ${n(s)} = ${n(bot)}, so a${sub(m)} = ${n(top)} ÷ ${n(bot)} ${say3(a)}. Dividing the top and the bottom by 2ⁿ gives aₙ = (${n(p)} + ${n(q)} ÷ 2ⁿ) ÷ (${n(r)} + ${n(s)} ÷ 2ⁿ). As n → ∞ the parts with 2ⁿ underneath approach 0, so aₙ approaches ${n(p)} ÷ ${n(r)} = ${n(L)}. The gap is ${n(hi)} − ${n(lo)} ${say3(gap)}.`,
  guidance: [
   { prompt: `Put n = ${n(m)} into aₙ = ${f}. What is a${sub(m)} to 3 decimal places?`, answer: [r3(a)], explanation: `The top is ${n(p)} × ${n(G2)} + ${n(q)} = ${n(top)} and the bottom is ${n(r)} × ${n(G2)} + ${n(s)} = ${n(bot)}. ${n(top)} ÷ ${n(bot)} ${say3(a)}.` },
   { prompt: `Divide the top and the bottom by 2ⁿ: aₙ = (${n(p)} + ${n(q)} ÷ 2ⁿ) ÷ (${n(r)} + ${n(s)} ÷ 2ⁿ). The parts with 2ⁿ underneath shrink to 0 as n → ∞. What is the limit?`, answer: [L], explanation: `The top approaches ${n(p)} and the bottom approaches ${n(r)}, so the limit is ${n(p)} ÷ ${n(r)} = ${n(L)}.` },
   { prompt: `How far is a${sub(m)} from the limit? Subtract the smaller from the larger, to 3 decimal places.`, answer: [r3(gap)], explanation: `${n(hi)} − ${n(lo)} ${say3(gap)}. The readings are still ${f3(gap)} away from ${n(L)}, and the gap keeps shrinking.` }
  ] }; }
});

/* aₙ = the integral from 1 to n of C ÷ tᵖ (p = 2 or 3), or from 0 to n of C·e^(−kt) (k = 0.5 or 1). The term a_m to 3 places, then the limit,
   which is the improper integral of q24. Uses q24. */
mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q24', title: 'Energy logged by sweep n',
 brief: 'The array keeps a running total of the energy it has received, and Mira asks what the total is heading for.',
 labels: ['term (3 d.p.)', 'limit'], tolerance: 0.0005,
 gl: [['term (3 d.p.)'], ['limit']]
}, {
 canonical: { fam: 'p', C: 6, pw: 2, k: 1, m: 7 },
 draw: R => { let P; do { P = R.bool() ? { fam: 'p', C: R.int(2, 9), pw: R.pick([2, 3]), k: 1, m: R.int(3, 9) } : { fam: 'e', C: R.int(2, 9), pw: 2, k: R.pick([0.5, 1]), m: R.int(2, 4) };
   const h = P.fam === 'p' ? P.C / (P.pw - 1) : P.C / P.k, am = P.fam === 'p' ? h - h / Math.pow(P.m, P.pw - 1) : h * (1 - Math.exp(-P.k * P.m)); P.ok = sf(am, 3); } while (!P.ok); delete P.ok; return P; },
 build: ({ fam, C, pw, k, m }) => { let f, lo, h, F, an, am, name, step;
  if (fam === 'p') { f = `${n(C)} ÷ t${sup(pw)}`; lo = 1; h = C / (pw - 1); F = pw === 2 ? `−${n(C)} ÷ t` : `−${n(h)} ÷ t²`; an = pw === 2 ? `${n(C)} − ${n(C)} ÷ n` : `${n(h)} − ${n(h)} ÷ n²`; am = h - h / Math.pow(m, pw - 1); step = pw === 2 ? `${n(C)} ÷ n` : `${n(h)} ÷ n²`; }
  else { const e = (v) => `e^(−${k === 1 ? '' : n(k)}${v})`; f = `${ce(C)}${e('t')}`; lo = 0; h = C / k; F = `−${ce(h)}${e('t')}`; an = `${n(h)} − ${ce(h)}${e('n')}`; am = h * (1 - Math.exp(-k * m)); step = `${ce(h)}${e('n')}`; }
  const L = h; return {
  prompt: `The Deep Signal Array keeps a running total of the energy it has received. The total logged up to sweep time n is aₙ = ∫ from ${n(lo)} to n of ${f} dt, for n = 1, 2, 3, … Enter a${sub(m)}, the total logged up to sweep time ${n(m)}, to 3 decimal places, then the limit of the sequence as n → ∞.`,
  answer: [r3(am), L],
  hints: [`An antiderivative of ${f} is ${F}. Evaluate it at n and at ${n(lo)}, subtract, and then put n = ${n(m)}.`,
   `The limit of aₙ is the improper integral from ${n(lo)} to ∞ of ${f} dt: the part of aₙ that has n in it shrinks to 0.`],
  solution: `An antiderivative of ${f} is ${F}, so aₙ = ${an}. With n = ${n(m)}, a${sub(m)} ${say3(am)}. As n → ∞ the part ${step} shrinks to 0, so aₙ approaches ${n(L)}. This is the value of the improper integral from ${n(lo)} to ∞ of ${f} dt, so the limit is ${n(L)}.`,
  guidance: [
   { prompt: `An antiderivative of ${f} is ${F}, so aₙ = ${an}. Put n = ${n(m)}. What is a${sub(m)} to 3 decimal places?`, answer: [r3(am)], explanation: `Putting n = ${n(m)} into ${an} gives ${n(am)}, which is ${f3(am)} to 3 decimal places.` },
   { prompt: `As n → ∞, the part ${step} shrinks to 0. What does aₙ approach?`, answer: [L], explanation: `What is left is ${n(h)}, so the limit is ${n(L)}, the value of the improper integral from ${n(lo)} to ∞.` }
  ] }; }
});

/* ---- q28 Geometric series [5.2] ---- */

/* First hop a and ratio p/q are given; asked: the third term a·r², then the sum. Terms and sum are whole (geo). */
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The survey drone’s hops',
 brief: 'A survey drone crosses the dust flats in shorter and shorter hops, and the planners want to know how far it can ever get.',
 labels: ['third hop (m)', 'total distance (m)'], tolerance: 0.00005,
 gl: [['third hop (m)'], ['1 − r'], ['total distance (m)']]
}, {
 canonical: { p: 3, q: 4, j: 2 },
 draw: R => drawGeo(R),
 build: P => { const { a, a1, a2, S, frac, oneMinus, om, inv } = geo(P); return {
  prompt: `A survey drone crosses the dust flats in a chain of shorter and shorter hops. Its first hop is ${n(a)} m, and every later hop is ${frac} as long as the hop before it, for ever. Enter the length of the third hop, in metres, then the total distance of all the hops, in metres.`,
  answer: [a2, S],
  hints: [`Each hop is the one before it times ${frac}, so the third hop is the first hop times ${frac}, and times ${frac} again.`,
   'The ratio is between −1 and 1, so the hops form a geometric series that converges, and the total is a ÷ (1 − r), where a is the first hop.'],
  solution: `The second hop is ${n(a)} × ${frac} = ${n(a1)} m and the third is ${n(a1)} × ${frac} = ${n(a2)} m. The ratio ${frac} is between −1 and 1, so the series converges, to a ÷ (1 − r) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)} m.`,
  guidance: [
   { prompt: `Multiply the first hop, ${n(a)} m, by ${frac} to get the second hop, and by ${frac} again to get the third. How long is the third hop?`, answer: [a2], explanation: `${n(a)} × ${frac} = ${n(a1)}, and ${n(a1)} × ${frac} = ${n(a2)}, so the third hop is ${n(a2)} m.` },
   { prompt: `For the sum a ÷ (1 − r) you need 1 − r, with r = ${frac}. What is 1 − r? (A fraction is fine.)`, answer: [om], explanation: `1 − ${frac} = ${oneMinus}.` },
   { prompt: `What is the total distance, a ÷ (1 − r), with a = ${n(a)}?`, answer: [S], explanation: `${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}. The hops never carry the drone further than ${n(S)} m.` }
  ] }; }
});

/* The ratio is given as a percentage; asked: the whole sum, the first three, and what is still to come (all whole numbers). */
mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Echoes at a fixed percentage',
 brief: 'Each bounce off the far mirror keeps only a fixed share of the energy, and Mira wants to know how much is still to arrive.',
 labels: ['sum of all echoes', 'sum of the first three', 'energy still to come'], tolerance: 0.00005,
 gl: [['sum of all echoes'], ['sum of the first three'], ['energy still to come']]
}, {
 canonical: { p: 3, q: 5, j: 2 },
 draw: R => drawGeo(R, PCTS),
 build: P => { const { a, a1, a2, S, S3, left, frac, oneMinus, inv } = geo(P), pc = 100 * P.p / P.q; return {
  prompt: `The first echo from the far mirror carries ${n(a)} units of energy. Each later echo carries ${n(pc)}% of the energy of the echo before it, for ever. Enter the total energy of all the echoes, then the total energy of the first three echoes, then the energy that is still to come after those three.`,
  answer: [S, S3, left],
  hints: [`${n(pc)}% as a fraction is ${frac}, and that is the common ratio r. The whole series adds up to a ÷ (1 − r), where a is the first echo.`,
   'The first three echoes are a, then a × r, then a × r × r: add them. The energy still to come is the whole sum minus the first three.'],
  solution: `${n(pc)}% = ${frac}, so r = ${frac}, which is between −1 and 1. All the echoes: ${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}. The first three: ${n(a)} + ${n(a1)} + ${n(a2)} = ${n(S3)}. Still to come: ${n(S)} − ${n(S3)} = ${n(left)}.`,
  guidance: [
   { prompt: `${n(pc)}% is the fraction ${frac}, so r = ${frac}. What is the sum of all the echoes, a ÷ (1 − r), with a = ${n(a)}?`, answer: [S], explanation: `${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}.` },
   { prompt: `The echoes go ${n(a)}, then ${n(a)} × ${frac}, then that times ${frac} again. What do the first three add up to?`, answer: [S3], explanation: `${n(a)} + ${n(a1)} + ${n(a2)} = ${n(S3)}.` },
   { prompt: 'How much energy is still to come after the third echo? Take the first three away from the whole sum.', answer: [left], explanation: `${n(S)} − ${n(S3)} = ${n(left)}. This is the tail of the series, and it is itself a geometric series.` }
  ] }; }
});

/* Fuel with half-life T topped up with d kg every s = jT days: a dose keeps r = (1/2)^j, and just after a top-up the store holds
   d ÷ (1 − r) = 2^j·u kg in the long run, with d = (2^j − 1)u. Uses q26. */
mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q26', title: 'Topping up the fuel store',
 brief: 'The crew tops up the decaying fuel store on a fixed round, and Mira wants to know how full it settles in the long run.',
 labels: ['fraction left after one gap', 'fuel after a top-up (kg)'], tolerance: 0.00005,
 gl: [['fraction left after one gap'], ['fuel after a top-up (kg)']]
}, {
 canonical: { T: 12, j: 2, u: 5 },
 draw: R => ({ T: R.int(4, 30), j: R.pick([1, 2, 3]), u: R.int(2, 14) }),
 build: ({ T, j, u }) => { const g = Math.pow(2, j), d = (g - 1) * u, s = j * T, r = 1 / g, S = d / (1 - r), frac = `1/${g}`, oneMinus = `${g - 1}/${g}`,
  hl = j === 1 ? 'one half-life' : `${j} half-lives`, times = j === 1 ? 'once' : `${j} times`; return {
  prompt: `The power cells of the Deep Signal Array burn an isotope fuel with a half-life of ${n(T)} days. Every ${n(s)} days the crew tops up the store with ${n(d)} kg of fresh fuel. Just after a top-up, the store holds that new ${n(d)} kg plus whatever is left of every earlier top-up. Treat the top-ups as going on for ever. Enter the fraction of a top-up that is still left when the next top-up arrives (a fraction such as 1/4 is fine), then the amount of fuel in the store just after a top-up, in kg.`,
  answer: [r, S],
  hints: ['Each half-life halves what is left. Count how many half-lives fit into the gap between top-ups, and halve that many times.',
   `Just after a top-up the store holds ${n(d)} kg, plus ${n(d)} × r from the top-up before, plus ${n(d)} × r × r from the one before that, and so on. That is a geometric series with first term ${n(d)} and ratio r, and its sum is a ÷ (1 − r).`],
  solution: `${n(s)} days is ${hl} of ${n(T)} days, so a top-up is halved ${times}: r = ${frac}. Just after a top-up the store holds ${n(d)} + ${n(d)} × ${frac} + ${n(d)} × (${frac})² + …, a geometric series with first term ${n(d)} and ratio ${frac}, between −1 and 1. Its sum is ${n(d)} ÷ (1 − ${frac}) = ${n(d)} ÷ (${oneMinus}) = ${n(S)} kg.`,
  guidance: [
   { prompt: `The gap of ${n(s)} days is ${hl} of ${n(T)} days. By what fraction is a top-up multiplied by the time the next one arrives? (A fraction is fine.)`, answer: [r], explanation: `Each half-life halves what is left, so after ${hl} a top-up is halved ${times}, which leaves ${frac}, or ${n(r)}.` },
   { prompt: `The amounts in the store just after a top-up are ${n(d)}, ${n(d)}r, ${n(d)}r², … with r = ${frac}. What is the sum of this geometric series, a ÷ (1 − r)?`, answer: [S], explanation: `${n(d)} ÷ (1 − ${frac}) = ${n(d)} ÷ (${oneMinus}) = ${n(S)}. In the long run the store holds ${n(S)} kg just after each top-up.` }
  ] }; }
});

/* ---- q29 Chapter review: the infinite so far [3.7, 5.1, 5.2] ---- */

/* A surge C ÷ √t from 0 to U (U a perfect square: the integral is 2C√U) plus a relay chain given by its first term and ratio p/q. */
mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Surge and relay chain',
 brief: 'A power surge hit the Long-range Dish and a chain of relays forwarded it, and Mira wants both energies added up.',
 labels: ['surge energy', 'relay chain energy'], tolerance: 0.00005,
 gl: [['surge energy'], ['1 − r'], ['relay chain energy']]
}, {
 canonical: { C: 5, U: 9, p: 3, q: 4, j: 2 },
 draw: R => ({ C: R.int(2, 9), U: R.pick([1, 4, 9, 16]), ...drawGeo(R) }),
 build: P => { const { C, U } = P, { a, S, frac, oneMinus, om, inv } = geo(P), sq = Math.sqrt(U), I = 2 * C * sq; return {
  prompt: `A power surge hits the Long-range Dish, and its power is ${n(C)} ÷ √t units at time t seconds. The power is endless at t = 0, but the energy of the surge from t = 0 to t = ${n(U)}, the improper integral ∫ from 0 to ${n(U)} of ${n(C)} ÷ √t dt, is finite. A chain of relays also forwards the surge: the first relay sends ${n(a)} units and each later relay sends ${frac} of what the one before sent, for ever. Enter the energy of the surge, then the total energy sent by the whole chain.`,
  answer: [I, S],
  hints: [`An antiderivative of ${n(C)} ÷ √t is ${n(2 * C)}√t. Integrate from a bottom limit c up to ${n(U)}, then let c shrink to 0.`,
   'For the chain, the ratio is between −1 and 1, so the series converges, and its sum is a ÷ (1 − r), where a is the first relay’s energy.'],
  solution: `Surge: from c to ${n(U)} the integral is ${n(2 * C)}√${n(U)} − ${n(2 * C)}√c = ${n(I)} − ${n(2 * C)}√c. As c → 0 the part with c shrinks to 0, so the improper integral converges to ${n(I)}. Chain: r = ${frac}, between −1 and 1, so the series converges to ${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}.`,
  guidance: [
   { prompt: `From c to ${n(U)} the integral is ${n(I)} − ${n(2 * C)}√c. What does it approach as c → 0?`, answer: [I], explanation: `√c shrinks to 0 as c does, so the improper integral converges to ${n(I)}.` },
   { prompt: `For the chain you need 1 − r, with r = ${frac}. What is 1 − r? (A fraction is fine.)`, answer: [om], explanation: `1 − ${frac} = ${oneMinus}.` },
   { prompt: `What is the total energy of the chain, a ÷ (1 − r), with a = ${n(a)}?`, answer: [S], explanation: `${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}.` }
  ] }; }
});

/* Interference C ÷ tᵖ from 1 to ∞ (p = 2 or 3) plus pulses whose ratio is a percentage; asked: both energies and their total. */
mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'The passing probe',
 brief: 'A probe passing the Long-range Dish causes interference and sends pulses, and Mira needs the energy of each and the grand total.',
 labels: ['interference energy', 'pulse energy', 'grand total'], tolerance: 0.00005,
 gl: [['interference energy'], ['pulse energy'], ['grand total']]
}, {
 canonical: { C: 6, pw: 3, p: 3, q: 4, j: 1 },
 draw: R => ({ C: R.int(2, 9), pw: R.pick([2, 3]), ...drawGeo(R, PCTS) }),
 build: P => { const { C, pw } = P, { a, S, frac, oneMinus, inv } = geo(P), pc = 100 * P.p / P.q, I = C / (pw - 1), f = `${n(C)} ÷ t${sup(pw)}`, F = pw === 2 ? `−${n(C)} ÷ t` : `−${n(I)} ÷ t²`, inB = pw === 2 ? `${n(C)} − ${n(C)} ÷ b` : `${n(I)} − ${n(I)} ÷ b²`, rest = pw === 2 ? `${n(C)} ÷ b` : `${n(I)} ÷ b²`; return {
  prompt: `A probe passing the Long-range Dish causes interference. The interference power is ${f} units at time t seconds, from t = 1 on, so its total energy is the improper integral ∫ from 1 to ∞ of ${f} dt. The probe also sends pulses: the first carries ${n(a)} units, and each later pulse carries ${n(pc)}% of the energy of the pulse before it, for ever. Enter the energy of the interference, then the total energy of the pulses, then the grand total of both.`,
  answer: [I, S, I + S],
  hints: [`An antiderivative of ${f} is ${F}. Integrate from 1 up to a top limit b, then let b → ∞.`,
   `${n(pc)}% as a fraction is ${frac}, and that is the common ratio r. The pulses add up to a ÷ (1 − r), where a is the first pulse. The grand total adds the two energies.`],
  solution: `Interference: from 1 to b the integral is ${inB}. As b → ∞ the part ${rest} shrinks to 0, so the improper integral converges to ${n(I)}. Pulses: ${n(pc)}% = ${frac} = r, between −1 and 1, so the series converges to ${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}. Grand total: ${n(I)} + ${n(S)} = ${n(I + S)}.`,
  guidance: [
   { prompt: `With top limit b, the interference integral is ${inB}. What does it approach as b → ∞?`, answer: [I], explanation: `The part ${rest} shrinks to 0 as b grows, so the improper integral converges to ${n(I)}.` },
   { prompt: `${n(pc)}% is the fraction ${frac}, so r = ${frac}. What is the sum of the pulses, a ÷ (1 − r), with a = ${n(a)}?`, answer: [S], explanation: `${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}.` },
   { prompt: 'What is the grand total of the interference and the pulses?', answer: [I + S], explanation: `${n(I)} + ${n(S)} = ${n(I + S)}.` }
  ] }; }
});

/* A tone that halves every T seconds from P0 units: k = ln 2 ÷ T and its energy is P0 ÷ k to 2 places; plus a listed geometric pulse train.
   Uses q26. */
mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q26', title: 'A tone that halves',
 brief: 'The beacon’s tone dies away with a known half-life while its pulses keep coming, and Mira wants both totals.',
 labels: ['tone energy (2 d.p.)', 'pulse energy'], tolerance: 0.00005,
 gl: [['k per second (4 d.p.)'], ['tone energy (2 d.p.)'], ['pulse energy']]
}, {
 canonical: { T: 6, P0: 5, p: 1, q: 3, j: 2 },
 draw: R => { let P; do { P = { T: R.int(2, 20), P0: R.int(2, 9), ...drawGeo(R) }; const k = Math.LN2 / P.T; P.ok = sf(k, 4) && sf(P.P0 / k, 2); } while (!P.ok); delete P.ok; return P; },
 build: P => { const { T, P0 } = P, { a, a1, a2, S, frac, oneMinus, inv } = geo(P), k = Math.LN2 / T, I = P0 / k; return {
  prompt: `The beacon’s tone fades so that its power halves every ${n(T)} seconds, starting at ${n(P0)} units, so its power is ${n(P0)}e^(−kt) units at time t seconds. The tone’s total energy is the improper integral ∫ from 0 to ∞ of ${n(P0)}e^(−kt) dt. The beacon also sends pulses carrying ${n(a)}, ${n(a1)}, ${n(a2)}, … units, each the same fraction of the one before, for ever. Enter the energy of the tone, to 2 decimal places (work with the unrounded k), then the total energy of all the pulses.`,
  answer: [r2(I), S],
  hints: [`The half-life gives e^(−${n(T)}k) = 1/2, so k = ln 2 ÷ ${n(T)}. From 0 to b the integral of ${n(P0)}e^(−kt) is (${n(P0)} ÷ k)(1 − e^(−kb)).`,
   `For the pulses, the common ratio is ${n(a1)} ÷ ${n(a)}, and a geometric series with ratio between −1 and 1 adds up to a ÷ (1 − r).`],
  solution: `The half-life gives e^(−${n(T)}k) = 1/2, so k = ln 2 ÷ ${n(T)} ≈ ${f4(k)}. From 0 to b the integral is (${n(P0)} ÷ k)(1 − e^(−kb)). As b → ∞ the part with b shrinks to 0, so the tone’s energy is ${n(P0)} ÷ k ≈ ${n(I)} with the unrounded k, which is ${f2(I)} to 2 decimal places. Pulses: r = ${n(a1)} ÷ ${n(a)} = ${frac}, so the series converges to ${n(a)} ÷ (1 − ${frac}) = ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}.`,
  guidance: [
   { prompt: `The half-life gives e^(−${n(T)}k) = 1/2, so k = ln 2 ÷ ${n(T)}. What is k to 4 decimal places?`, answer: [r4(k)], explanation: `ln 2 ≈ 0.6931, and ln 2 ÷ ${n(T)} ≈ ${f4(k)} to 4 decimal places. Keep the full value of k for the next step.` },
   { prompt: `As b → ∞ the integral from 0 to b settles on ${n(P0)} ÷ k. Using the unrounded k, what is that to 2 decimal places?`, answer: [r2(I)], explanation: `${n(P0)} ÷ k ≈ ${n(I)} with the unrounded k, which is ${f2(I)} to 2 decimal places.` },
   { prompt: `What is the sum of the pulses, a ÷ (1 − r), with a = ${n(a)} and r = ${n(a1)} ÷ ${n(a)}?`, answer: [S], explanation: `r = ${frac}, so the sum is ${n(a)} ÷ (${oneMinus}) = ${n(a)} × ${inv} = ${n(S)}.` }
  ] }; }
});

/* ---- q30 Partial sums, telescoping series, the divergence test [5.2, 5.3] ---- */

/* aₙ = d + c ÷ ((n + s)(n + s + 1)) with c = (s + 1)u: S₁₀ = 10d + c(1 ÷ (s + 1) − 1 ÷ (s + 11)). With d = 0 the sum is u;
   in about a third of the draws d is a whole number from 1 to 4, the terms approach d and the series diverges (sum 0). */
mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The shifted filter bank',
 brief: 'The Signal Lab’s filter bank releases its energy in pulses that begin a few steps down the line, and Mira wants the total.',
 labels: ['partial sum S₁₀ (3 d.p.)', 'sum (0 if it diverges)'], tolerance: 0.0005,
 gl: [['limit of the terms'], ['partial sum S₁₀ (3 d.p.)'], ['sum (0 if it diverges)']]
}, {
 canonical: { s: 2, u: 4, d: 0 },
 draw: R => { let P; do { P = { s: R.int(1, 5), u: R.int(2, 9), d: R.pick([0, 0, 1, 2, 3, 4]) }; const c = (P.s + 1) * P.u; P.ok = sf(10 * P.d + c * (1 / (1 + P.s) - 1 / (11 + P.s)), 3); } while (!P.ok); delete P.ok; return P; },
 build: ({ s, u, d }) => { const c = (s + 1) * u, A = `n + ${n(s)}`, B = `n + ${n(s + 1)}`, fade = `${n(c)} ÷ ((${A})(${B}))`, fa = d ? `${n(d)} + ${fade}` : fade, split = `${fade} = ${n(c)} × (1 ÷ (${A}) − 1 ÷ (${B}))`,
  tele = c * (1 / (1 + s) - 1 / (11 + s)), S10 = 10 * d + tele, sum = d ? 0 : u, front = `1 ÷ ${n(s + 1)}`, back = `1 ÷ ${n(s + 11)}`,
  cancel = `In S₁₀ each −1 ÷ (${B}) cancels the 1 ÷ (${A}) of the next term, leaving ${n(c)} × (${front} − ${back})`; return {
  prompt: `The Signal Lab’s filter bank releases its energy in pulses, and pulse n carries aₙ = ${fa} joules, for n = 1, 2, 3, … The total of them all is the series a₁ + a₂ + a₃ + …, written Σ aₙ. Enter the partial sum S₁₀ = a₁ + a₂ + … + a₁₀ to 3 decimal places, then the sum of the whole series, or 0 if the series diverges.`,
  answer: [r3(S10), sum],
  hints: [`Split the fading part: ${split}. Write out the first few terms and watch them cancel.`,
   'Before adding for ever, look at the terms: if aₙ does not approach 0 as n → ∞, the divergence test says the series diverges.'],
  solution: d
   ? `The terms approach ${n(d)} + 0 = ${n(d)}, not 0, so by the divergence test the series diverges: enter 0 for the sum. The partial sum is still a finite number. ${split}. ${cancel} ${ap(tele)}, and the ten copies of ${n(d)} add ${n(10 * d)}, so S₁₀ ${say3(S10)}.`
   : `${split}. ${cancel} ${say3(S10)}. For the partial sum of N terms the same cancelling leaves ${n(c)} × (${front}) minus a piece that shrinks to 0 as N → ∞, so the series converges to ${n(c)} × (${front}) = ${n(u)}.`,
  guidance: [
   { prompt: `As n → ∞, what does aₙ = ${fa} approach?`, answer: [d], explanation: d ? `The fraction shrinks to 0, so aₙ approaches ${n(d)}. That is not 0, so the divergence test already says the series diverges.` : 'The bottom grows without bound, so aₙ approaches 0. The divergence test then says nothing, and we have to look at the partial sums.' },
   { prompt: `Use ${split}. What is S₁₀ to 3 decimal places?`, answer: [r3(S10)], explanation: d ? `${cancel} ${ap(tele)}. Adding 10 × ${n(d)} = ${n(10 * d)} gives S₁₀ ${say3(S10)}.` : `${cancel} ${say3(S10)}.` },
   { prompt: 'What is the sum of the whole series? Enter 0 if it diverges.', answer: [sum], explanation: d ? `The partial sums grow by about ${n(d)} with every term, without bound, so the series diverges: enter 0.` : `As N → ∞ the leftover piece at the end of the partial sums shrinks to 0, so the partial sums approach ${n(c)} × (${front}) = ${n(u)}.` }
  ] }; }
});

/* aₙ = c ÷ (n(n + k)), c = k·h, k = 1 or 2, after N pulses: S_N = h(head − tail), sum h·head, still to come h·tail. */
mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'How much is still to come',
 brief: 'The relay chain has sent a known number of pulses, and the lab wants to know what has arrived and what is still on its way.',
 labels: ['energy received so far (3 d.p.)', 'total energy of the chain', 'energy still to come (3 d.p.)'], tolerance: 0.0005,
 gl: [['energy received so far (3 d.p.)'], ['total energy of the chain'], ['energy still to come (3 d.p.)']]
}, {
 canonical: { k: 2, h: 5, N: 12 },
 draw: R => { let P; do { P = { k: R.pick([1, 2]), h: R.int(2, 12), N: R.pick([8, 10, 12, 15, 20, 25]) }; const tail = P.k === 1 ? 1 / (P.N + 1) : 1 / (P.N + 1) + 1 / (P.N + 2), head = P.k === 1 ? 1 : 1.5;
   P.ok = sf(P.h * (head - tail), 3) && sf(P.h * tail, 3); } while (!P.ok); delete P.ok; return P; },
 build: ({ k, h, N }) => { const c = k * h, head = k === 1 ? 1 : 1.5, headT = k === 1 ? '1' : '1 + 1/2', tailV = k === 1 ? 1 / (N + 1) : 1 / (N + 1) + 1 / (N + 2),
  tailT = k === 1 ? `1/${n(N + 1)}` : `1/${n(N + 1)} + 1/${n(N + 2)}`, SN = h * (head - tailV), sum = h * head, rem = h * tailV,
  fa = `${n(c)} ÷ (n(n + ${n(k)}))`, split = `${fa} = ${n(h)} × (1 ÷ n − 1 ÷ (n + ${n(k)}))`, S = `S${sub(N)}`; return {
  prompt: `The Signal Lab’s relay chain sends pulses one after another, and pulse n carries aₙ = ${fa} joules. The log has just recorded pulse ${n(N)}. Enter the energy received so far, ${S} = a₁ + a₂ + … + a${sub(N)}, to 3 decimal places, then the total energy the chain would send if it never stopped, then the energy still to come after pulse ${n(N)}, to 3 decimal places.`,
  answer: [r3(SN), sum, r3(rem)],
  hints: [`Split each pulse: ${split}. Write out the first few terms and watch them cancel.`,
   `In ${S} the front pieces ${k === 1 ? 'of the first term' : 'of the first two terms'} survive, and so do the last ${k === 1 ? 'back piece' : 'two back pieces'}. The energy still to come is the whole sum minus ${S}.`],
  solution: `${split}. In ${S} each −1 ÷ (n + ${n(k)}) cancels the 1 ÷ n of a later term, leaving ${n(h)} × (${headT} − ${k === 1 ? tailT : `(${tailT})`}) ${say3(SN)}. The pieces at the end shrink to 0 as the number of terms grows, so the whole series converges to ${n(h)} × (${headT}) = ${n(sum)}. Still to come: ${n(sum)} − ${n(SN)}, which is the leftover ${n(h)} × (${tailT}) ${say3(rem)}.`,
  guidance: [
   { prompt: `Use ${split}. What is ${S} to 3 decimal places?`, answer: [r3(SN)], explanation: `In ${S} each −1 ÷ (n + ${n(k)}) cancels the 1 ÷ n of a later term, leaving ${n(h)} × (${headT} − ${k === 1 ? tailT : `(${tailT})`}) ${say3(SN)}.` },
   { prompt: 'What is the sum of the whole series, if the chain never stops?', answer: [sum], explanation: `As the number of terms grows, the pieces at the end shrink to 0, so the partial sums approach ${n(h)} × (${headT}) = ${n(sum)}.` },
   { prompt: `How much energy is still to come after pulse ${n(N)}? Take ${S} away from the whole sum, to 3 decimal places.`, answer: [r3(rem)], explanation: `${n(sum)} − ${n(SN)} ${say3(rem)}. This is exactly the leftover ${n(h)} × (${tailT}).` }
  ] }; }
});

/* Sums 1 + 1/2 + … + 1/k (the front pieces that survive) and 1/11 + … + 1/(10 + k) (the back pieces in S₁₀). */
const HEAD = [0, 1, 1.5, 11 / 6], TAIL = [0, 1 / 11, 1 / 11 + 1 / 12, 1 / 11 + 1 / 12 + 1 / 13];
/* c ÷ (n(n + k)) with c = k·h, k = 1, 2 or 3 (h a multiple of 6 when k = 3, so the sum 11h ÷ 6 is whole): find A = h and B = −h by partial fractions,
   then S₁₀ and the sum. Uses q21. */
mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q21', title: 'Splitting the relay pulses',
 brief: 'The relay pulses will only telescope once they are split into two simpler fractions, and Mira leaves the splitting to you.',
 labels: ['A', 'B', 'partial sum S₁₀ (3 d.p.)', 'sum of the series'], tolerance: 0.0005,
 gl: [['A', 'B'], ['partial sum S₁₀ (3 d.p.)'], ['sum of the series']]
}, {
 canonical: { k: 3, h: 6 },
 draw: R => { let P; do { const k = R.pick([1, 2, 3]); P = { k, h: k === 3 ? R.pick([6, 12, 18, 24]) : R.int(2, 12) }; const head = HEAD[k], tail = TAIL[k];
   P.ok = sf(P.h * (head - tail), 3) && !(P.k === 2 && P.h === 6) && !(P.k === 1 && P.h === 6); } while (!P.ok); delete P.ok; return P; },
 build: ({ k, h }) => { const c = k * h, head = HEAD[k], headT = ['', '1', '1 + 1/2', '1 + 1/2 + 1/3'][k], tailT = ['', '1/11', '1/11 + 1/12', '1/11 + 1/12 + 1/13'][k],
  tail = TAIL[k], S10 = h * (head - tail), sum = h * head, fa = `${n(c)} ÷ (n(n + ${n(k)}))`; return {
  prompt: `Pulse n of a relay chain carries aₙ = ${fa} joules, for n = 1, 2, 3, … First split it into two fractions: find the numbers A and B with ${fa} = A ÷ n + B ÷ (n + ${n(k)}). Then enter A, then B, then the partial sum S₁₀ = a₁ + a₂ + … + a₁₀ to 3 decimal places, then the sum of the whole series.`,
  answer: [h, -h, r3(S10), sum],
  hints: [`Multiply both sides by n(n + ${n(k)}): ${n(c)} = A(n + ${n(k)}) + Bn. Putting n = 0 gives A, and putting n = −${n(k)} gives B.`,
   `In S₁₀ the back piece of each term cancels the front piece of a later one, so ${k === 1 ? 'one front piece and one back piece survive' : `${n(k)} front pieces and ${n(k)} back pieces survive`}. If the terms did not approach 0, the series would diverge.`],
  solution: `${n(c)} = A(n + ${n(k)}) + Bn. With n = 0 this gives ${n(c)} = ${n(k)}A, so A = ${n(h)}. With n = −${n(k)} it gives ${n(c)} = −${n(k)}B, so B = −${n(h)}. Then ${fa} = ${n(h)} × (1 ÷ n − 1 ÷ (n + ${n(k)})), and in S₁₀ each −1 ÷ (n + ${n(k)}) cancels the 1 ÷ n of a later term, leaving ${n(h)} × (${headT} − ${k === 1 ? tailT : `(${tailT})`}) ${say3(S10)}. The terms approach 0 and the leftover pieces shrink to 0 as the number of terms grows, so the series converges to ${n(h)} × (${headT}) = ${n(sum)}.`,
  guidance: [
   { prompt: `Multiply both sides by n(n + ${n(k)}): ${n(c)} = A(n + ${n(k)}) + Bn. Put in n = 0, then n = −${n(k)}. What are A and B?`, answer: [h, -h], explanation: `With n = 0, ${n(c)} = ${n(k)}A, so A = ${n(h)}. With n = −${n(k)}, ${n(c)} = −${n(k)}B, so B = −${n(h)}.` },
   { prompt: `So ${fa} = ${n(h)} × (1 ÷ n − 1 ÷ (n + ${n(k)})). What is S₁₀ to 3 decimal places?`, answer: [r3(S10)], explanation: `In S₁₀ each −1 ÷ (n + ${n(k)}) cancels the 1 ÷ n of a later term, leaving ${n(h)} × (${headT} − ${k === 1 ? tailT : `(${tailT})`}) ${say3(S10)}.` },
   { prompt: 'What is the sum of the whole series?', answer: [sum], explanation: `The terms approach 0 and the leftover pieces at the end shrink to 0, so the partial sums approach ${n(h)} × (${headT}) = ${n(sum)}.` }
  ] }; }
});

})();
