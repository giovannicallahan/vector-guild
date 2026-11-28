/* Differential equations practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p1.js. */
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
const sgn = v => v < 0 ? '−' : '+';
/* Signed terms: trm(−1, 'y') is '− y', trm(3, 'y') is '+ 3y'; cst(−4) is '− 4'; co(1, 'y') is 'y', co(−2, 'y') is '−2y'. */
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const co = (v, x) => `${v === 1 ? '' : v === -1 ? '−' : n(v)}${x}`;
const cf = v => v === 1 ? '' : n(v);
/* A polynomial from its coefficients, highest power first: poly([3, 0, −2], 'x') is '3x² − 2'. A coefficient 1 is not written out and a zero term is left out. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Products of a coefficient and a value, as worked: lin([[2, 16], [−3, 4]]) is '2 × 16 − 3 × 4'. */
const lin = list => list.filter(([c]) => c !== 0).map(([c, v], i) => { const a = Math.abs(c), body = a === 1 ? n(v) : `${n(a)} × ${n(v)}`;
 return i ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; }).join('');
const rd = (x, dp) => { const f = Math.pow(10, dp); return Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9) / f; };
const r6 = v => Math.round(v * 1e6) / 1e6;
/* True when x sits on a rounding tie at dp places. */
const tie = (x, dp) => { const s = Math.abs(x) * Math.pow(10, dp), r = s - Math.floor(s); return Math.abs(r - 0.5) < 1e-6; };
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
const sub = k => String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
const hr = x => x === 1 ? 'hour' : 'hours';
const mn = x => x === 1 ? 'minute' : 'minutes';

/* ---- q01 Checking a solution [0.2] ---- */

/* a·y′ + b·y = 0 with b = −a·k, solution y = Ce^(kt). Mould count: y(0) = C is given and the starting rate y′(0) = kC is asked.
   |k| >= 2 so no coefficient 1 is written out. Not the worked example (2y′ + 10y = 0, k = −5). */
mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'Mould in the humidity chamber',
 brief: 'Mould spores are growing in the humidity chamber, and the log needs the growth constant and the rate they start at.',
 labels: ['k', 'starting rate (thousand spores per hour)'], tolerance: 0.01,
 gl: [['k'], ['starting rate (thousand spores per hour)']]
}, {
 canonical: { a: 5, k: -3, C: 14 },
 draw: R => retry(() => ({ a: R.int(2, 6), k: R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), C: R.int(3, 40) }), p => !(p.a === 2 && p.k === -5), { a: 5, k: -3, C: 14 }),
 build: ({ a, k, C }) => { const b = -a * k, rate = k * C, eq = `${n(a)}y′ ${trm(b, 'y')} = 0`; return {
  prompt: `The mould count y in the humidity chamber, in thousands of spores, obeys the differential equation ${eq}, where t is the time in hours. Mira tests a solution of the form y = Ce^(kt). At t = 0 the count is y(0) = ${n(C)} thousand. Enter the value of k that makes it a solution, then enter the starting rate y′(0) in thousands of spores per hour.`,
  answer: [k, rate],
  hints: ['Differentiate y = Ce^(kt) to get y′ = kCe^(kt). Put y and y′ into the equation and divide every term by Ce^(kt), which is never 0. What is left is an equation for k alone.', 'At t = 0 the factor e^(kt) is e⁰, which is 1, so y(0) = C. The starting rate y′(0) is k times C.'],
  solution: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq}: ${n(a)}kCe^(kt) ${trm(b, 'Ce^(kt)')} = 0. Dividing by Ce^(kt) leaves ${n(a)}k ${cst(b)} = 0, so k = ${n(-b)} ÷ ${n(a)} = ${n(k)}. At t = 0, e⁰ = 1, so C = y(0) = ${n(C)}, and y′(0) = kC = ${par(k)} × ${n(C)} = ${n(rate)} thousand spores per hour.`,
  guidance: [
   { prompt: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq} and divide by Ce^(kt). That leaves ${n(a)}k ${cst(b)} = 0. What is k?`, answer: [k], explanation: `${n(a)}k = ${n(-b)}, so k = ${n(-b)} ÷ ${n(a)} = ${n(k)}. Any other k leaves a term that is not 0, so the equation fails.` },
   { prompt: `With k = ${n(k)} and C = y(0) = ${n(C)}, the starting rate is y′(0) = kC. What is y′(0)?`, answer: [rate], explanation: `y′(0) = ${par(k)} × ${n(C)} = ${n(rate)}, in thousands of spores per hour.` }
  ] }; }
});

/* a·y′ = c·y with c = a·k. y′(0) = kC = r is given; the rate at an amount V comes from the equation itself, y′ = kV. */
mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Fertiliser in the grow-tower reservoir',
 brief: 'The grow-tower reservoir is being topped up and drawn off at once, and Mira needs its growth constant and the rate at one level.',
 labels: ['k', 'C (grams)', 'rate at that amount (grams per hour)'], tolerance: 0.01,
 gl: [['k'], ['C (grams)'], ['rate at that amount (grams per hour)']]
}, {
 canonical: { a: 3, k: -2, C: 40, V: 25 },
 draw: R => retry(() => ({ a: R.int(2, 6), k: R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), C: 5 * R.int(2, 10), V: 5 * R.int(1, 12) }), p => p.V !== p.C, { a: 3, k: -2, C: 40, V: 25 }),
 build: ({ a, k, C, V }) => { const c = a * k, r = k * C, rate = k * V, eq = `${n(a)}y′ = ${n(c)}y`; return {
  prompt: `The fertiliser y in the grow-tower reservoir, in grams, obeys ${eq}, where t is the time in hours. Mira tries a solution of the form y = Ce^(kt). When the pumps were switched on, the reservoir was changing at y′(0) = ${n(r)} grams per hour. Enter k, then C. The equation also gives the rate whenever the amount is known: put the amount in for y and solve for y′. Then enter the rate y′ at the moment the reservoir holds ${n(V)} grams, in grams per hour.`,
  answer: [k, C, rate],
  hints: ['Put y = Ce^(kt) and y′ = kCe^(kt) into the equation and divide by Ce^(kt) to get an equation for k alone. At t = 0 the factor e^(kt) is 1, so the starting rate is k times C.', 'The equation says the number in front of y′, times y′, equals the number in front of y, times y. Put the amount in for y and divide by the number in front of y′. You do not need the solution for this.'],
  solution: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq}: ${n(a)}kCe^(kt) = ${n(c)}Ce^(kt). Dividing by Ce^(kt) leaves ${n(a)}k = ${n(c)}, so k = ${n(c)} ÷ ${n(a)} = ${n(k)}. Then y′(0) = kC = ${n(k)}C, and this equals ${n(r)}, so C = ${n(r)} ÷ ${par(k)} = ${n(C)}. The equation itself gives the rate at any amount: ${n(a)}y′ = ${par(c)} × ${n(V)} = ${n(c * V)}, so y′ = ${n(c * V)} ÷ ${n(a)} = ${n(rate)} grams per hour.`,
  guidance: [
   { prompt: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq} and divide by Ce^(kt). That leaves ${n(a)}k = ${n(c)}. What is k?`, answer: [k], explanation: `k = ${n(c)} ÷ ${n(a)} = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, the starting rate is y′(0) = ${n(k)}C, and it equals ${n(r)}. What is C?`, answer: [C], explanation: `C = ${n(r)} ÷ ${par(k)} = ${n(C)} grams.` },
   { prompt: `The equation says ${eq}. Put in y = ${n(V)} and solve for y′. What is the rate?`, answer: [rate], explanation: `${n(a)}y′ = ${par(c)} × ${n(V)} = ${n(c * V)}, so y′ = ${n(c * V)} ÷ ${n(a)} = ${n(rate)} grams per hour.` }
  ] }; }
});

/* p·y′ + q·y = r·y′ + s·y with p = r + d, so (p − r)k = s − q and k = (s − q) ÷ d: a decimal, because s − q is never a multiple of d.
   C is a multiple of 20, so y′(0) = kC is a whole number. d is 2, 4 or 5, so k has at most 2 decimals. */
mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'Pollen in the vent duct',
 brief: 'Pollen is collecting in the vent duct, and the fan controller needs the growth constant of an equation with the same terms on both sides.',
 labels: ['k (a decimal)', 'C (grams)'], tolerance: 0.005,
 gl: [['k (a decimal)'], ['C (grams)']]
}, {
 canonical: { r: 3, d: 4, q: 2, s: 7, C: 40 },
 draw: R => retry(() => ({ r: R.int(2, 5), d: R.pick([2, 4, 5]), q: R.int(2, 9), s: R.int(2, 9), C: 20 * R.int(1, 6) }), p => p.q !== p.s && (p.s - p.q) % p.d !== 0, { r: 3, d: 4, q: 2, s: 7, C: 40 }),
 build: ({ r, d, q, s, C }) => { const p = r + d, m = s - q, k = m / d, rate = k * C, eq = `${n(p)}y′ ${trm(q, 'y')} = ${n(r)}y′ ${trm(s, 'y')}`; return {
  prompt: `Pollen collects in the vent duct. The amount y, in grams, obeys ${eq}, where t is the time in hours: both sides have a y′ term and a y term. Mira tries a solution of the form y = Ce^(kt). Put it in, collect the terms and enter k as a decimal. At t = 0 the amount is changing at y′(0) = ${n(rate)} grams per hour; then enter C.`,
  answer: [k, C],
  hints: ['Put y = Ce^(kt) and y′ = kCe^(kt) into both sides and divide every term by Ce^(kt). Every term then has either a factor k or no k at all.', 'Move the terms with k to one side and the plain numbers to the other, then divide. The starting rate is y′(0) = kC, because e⁰ = 1.'],
  solution: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq} and divide by Ce^(kt): ${n(p)}k ${cst(q)} = ${n(r)}k ${cst(s)}. Moving the k terms to the left and the numbers to the right gives ${n(p)}k − ${n(r)}k = ${n(s)} − ${n(q)}, that is ${n(d)}k = ${n(m)}, so k = ${n(m)} ÷ ${n(d)} = ${n(k)}. Then y′(0) = kC = ${n(k)}C, which equals ${n(rate)}, so C = ${n(rate)} ÷ ${par(k)} = ${n(C)}.`,
  guidance: [
   { prompt: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq} and divide by Ce^(kt). That leaves ${n(p)}k ${cst(q)} = ${n(r)}k ${cst(s)}. What is k, as a decimal?`, answer: [k], explanation: `${n(p)}k − ${n(r)}k = ${n(s)} − ${n(q)}, so ${n(d)}k = ${n(m)} and k = ${n(m)} ÷ ${n(d)} = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, the starting rate is y′(0) = ${n(k)}C, and it equals ${n(rate)}. What is C?`, answer: [C], explanation: `C = ${n(rate)} ÷ ${par(k)} = ${n(C)} grams.` }
  ] }; }
});

/* ---- q02 Order and linearity [0.3] ---- */

/* The bank of terms. A term is {k, o, i, c, s}: k 0 for the linear bank and 1 for the nonlinear bank, o its order (0 for a term in y alone),
   i an index into the bank for that order (only an index into a list of texts), c the coefficient (1 is not written) and s its sign. */
const DD = ['y', 'y′', 'y″', 'y‴'];
const LIN = [
 [c => `${cf(c)}y`, c => `${cf(c)}ty`, c => `${cf(c)}(cos t)y`, c => `${cf(c)}t²y`],
 [c => `${cf(c)}y′`, c => `${cf(c)}ty′`, c => `${cf(c)}(sin t)y′`, c => `${cf(c)}t²y′`],
 [c => `${cf(c)}y″`, c => `${cf(c)}ty″`, c => `${cf(c)}(cos t)y″`, c => `${cf(c)}t²y″`],
 [c => `${cf(c)}y‴`, c => `${cf(c)}ty‴`, c => `${cf(c)}(sin t)y‴`]
];
const NLT = [
 [{ t: c => `${cf(c)}y²`, w: 'y is squared' }, { t: () => 'sin y', w: 'y sits inside the sine' }, { t: c => `${cf(c)}e^y`, w: 'y sits in an exponent' }],
 [{ t: c => `${cf(c)}yy′`, w: 'y multiplies its own derivative y′' }, { t: c => `${cf(c)}(y′)²`, w: 'y′ is squared' }],
 [{ t: c => `${cf(c)}yy″`, w: 'y multiplies its own derivative y″' }, { t: c => `${cf(c)}(y″)²`, w: 'y″ is squared' }, { t: c => `${cf(c)}y′y″`, w: 'y′ multiplies y″' }],
 [{ t: c => `${cf(c)}(y‴)²`, w: 'y‴ is squared' }, { t: c => `${cf(c)}yy‴`, w: 'y multiplies its own derivative y‴' }]
];
/* The right-hand sides, only an index into a list of texts. */
const RHS = ['0', 'sin t', '4t', 'e^(2t)', 't²', 'cos t', '7', 'e^(−t)', '3t + 1', 't³'];
const slotAt = (P, pre) => { const k = P[pre + 'k'], o = P[pre + 'o'], i = P[pre + 'i'], c = P[pre + 'c'], s = P[pre + 's'];
 return k ? { o, s, nl: true, body: NLT[o][i].t(c), w: NLT[o][i].w } : { o, s, nl: false, body: LIN[o][i](c) }; };
const joinTerms = (bodies, signs) => bodies.map((t, j) => j ? (signs[j] < 0 ? ' − ' : ' + ') + t : (signs[0] < 0 ? '−' : '') + t).join('');
/* An equation from slots (prefixes, the first is placed at position P[posKey] among the others) and the right-hand side P[fKey]. */
const eqOf = (P, pres, posKey, fKey) => {
 const sl = pres.map(p => slotAt(P, p)), order = sl.slice(1).map((_, j) => j + 1); order.splice(posKey ? P[posKey] : 0, 0, 0);
 const text = `${joinTerms(order.map(j => sl[j].body), order.map(j => sl[j].s))} = ${RHS[P[fKey]]}`, bad = sl.filter(s => s.nl);
 return { text, ord: Math.max(...sl.map(s => s.o)), lin: bad.length ? 0 : 1, bad, sl }; };
/* A drawn slot with prefix pre, order ord, from the nonlinear bank when nl. */
const drawSlot = (R, pre, ord, nl) => ({ [pre + 'k']: nl ? 1 : 0, [pre + 'o']: ord, [pre + 'i']: R.int(0, (nl ? NLT : LIN)[ord].length - 1), [pre + 'c']: R.int(1, 6), [pre + 's']: R.pick([1, -1]) });
const distinct = (P, pres) => { const b = pres.map(p => `${P[p + 'k']}${P[p + 'o']}${P[p + 'i']}`); return new Set(b).size === b.length; };
const LINRULE = 'every term is y or a derivative of y multiplied by a number or a function of t, or a function of t alone';

/* Three terms in the greenhouse sprinkler controller: the top term (linear, order 1 to 3) and two lower ones, at most one of them nonlinear. */
mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The sprinkler controller',
 brief: 'The seed-hall sprinkler controller has been rewired, and Mira wants its new equation sorted before anyone tries to solve it.',
 labels: ['order', 'linear (1) or nonlinear (0)'], tolerance: 0.01,
 gl: [['order'], ['linear (1) or nonlinear (0)']]
}, {
 canonical: { o: 2, Tk: 0, To: 2, Ti: 0, Tc: 4, Ts: 1, Uk: 0, Uo: 1, Ui: 1, Uc: 1, Us: -1, Vk: 1, Vo: 0, Vi: 2, Vc: 2, Vs: 1, pos: 1, f: 2 },
 draw: R => retry(() => { const o = R.int(1, 3), nlSlot = R.pick([0, 0, 1, 2]);
  return Object.assign({ o }, drawSlot(R, 'T', o, false), drawSlot(R, 'U', R.int(0, o - 1), nlSlot === 1), drawSlot(R, 'V', R.int(0, o - 1), nlSlot === 2), { pos: R.int(0, 2), f: R.int(0, 9) }); },
  p => distinct(p, ['T', 'U', 'V']), { o: 2, Tk: 0, To: 2, Ti: 0, Tc: 4, Ts: 1, Uk: 0, Uo: 1, Ui: 1, Uc: 1, Us: -1, Vk: 1, Vo: 0, Vi: 2, Vc: 2, Vs: 1, pos: 1, f: 2 }),
 build: P => { const e = eqOf(P, ['T', 'U', 'V'], 'pos', 'f'), o = e.ord, lin = e.lin, bad = e.bad[0];
  const verdict = lin ? `${LINRULE[0].toUpperCase()}${LINRULE.slice(1)}, so the equation is linear: enter 1.` : `The term ${bad.body} is not of that form, because ${bad.w}, so the equation is nonlinear: enter 0.`; return {
  prompt: `The sprinkler controller in the seed hall obeys ${e.text}, where y is a function of the time t. Enter the order of the equation. Then enter 1 if the equation is linear, or 0 if it is not.`,
  answer: [o, lin],
  hints: ['The order is the order of the highest derivative of y anywhere in the equation. Look at every term, not only the first one written, and remember that a derivative that is squared keeps its own order.', 'The equation is linear when each term is y or a derivative of y multiplied only by a number or a function of t, or else a function of t alone. A square, a product of y with a derivative, or y inside a function such as sin or e^ breaks that.'],
  solution: `The highest derivative of y in ${e.text} is ${DD[o]}, so the order is ${o}. ${lin ? verdict : `For a linear equation each term must be y or a derivative of y multiplied only by a number or a function of t, or a function of t alone. ${verdict}`}`,
  guidance: [
   { prompt: `Find the highest derivative of y anywhere in ${e.text}. Enter its order: 1 for y′, 2 for y″, 3 for y‴.`, answer: [o], explanation: `The highest derivative is ${DD[o]}, so the equation has order ${o}.` },
   { prompt: `Go through the terms of ${e.text}. Enter 1 if ${LINRULE}; enter 0 if some term breaks that rule.`, answer: [lin], explanation: verdict }
  ] }; }
});

/* Three controllers, each a top term (order 1 to 3, linear) and one lower term (nonlinear about two draws in five). Prefixes a, b, e name the three equations. */
const C02 = ['a', 'b', 'e'];
const draw02c = R => { const P = {}; C02.forEach(x => { const o = R.int(1, 3);
 Object.assign(P, { [x + 'o']: o }, drawSlot(R, x + 'T', o, false), drawSlot(R, x + 'L', R.int(0, o - 1), R.next() < 0.4), { [x + 'pos']: R.int(0, 1), [x + 'f']: R.int(0, 9) }); });
 return P; };
const eq02c = (P, x) => eqOf(P, [x + 'T', x + 'L'], x + 'pos', x + 'f');
mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'What the quick solver accepts',
 brief: 'Three greenhouse controllers are waiting on the desk, and Mira wants to know how many of them her quick solver can take.',
 labels: ['highest order', 'number linear', 'number accepted'], tolerance: 0.01,
 gl: [['highest order'], ['number linear'], ['number accepted']]
}, {
 canonical: { ao: 2, aTk: 0, aTo: 2, aTi: 0, aTc: 3, aTs: 1, aLk: 1, aLo: 0, aLi: 0, aLc: 1, aLs: 1, apos: 0, af: 1,
  bo: 1, bTk: 0, bTo: 1, bTi: 0, bTc: 1, bTs: 1, bLk: 0, bLo: 0, bLi: 1, bLc: 2, bLs: -1, bpos: 1, bf: 6,
  eo: 3, eTk: 0, eTo: 3, eTi: 1, eTc: 1, eTs: 1, eLk: 0, eLo: 1, eLi: 2, eLc: 3, eLs: 1, epos: 1, ef: 4 },
 draw: R => retry(() => draw02c(R), P => C02.every(x => distinct(P, [x + 'T', x + 'L'])), { ao: 2, aTk: 0, aTo: 2, aTi: 0, aTc: 3, aTs: 1, aLk: 1, aLo: 0, aLi: 0, aLc: 1, aLs: 1, apos: 0, af: 1,
  bo: 1, bTk: 0, bTo: 1, bTi: 0, bTc: 1, bTs: 1, bLk: 0, bLo: 0, bLi: 1, bLc: 2, bLs: -1, bpos: 1, bf: 6,
  eo: 3, eTk: 0, eTo: 3, eTi: 1, eTc: 1, eTs: 1, eLk: 0, eLo: 1, eLi: 2, eLc: 3, eLs: 1, epos: 1, ef: 4 }),
 build: P => { const E = C02.map(x => eq02c(P, x)), NAME = ['humidity', 'temperature', 'feed pump'], hi = Math.max(...E.map(e => e.ord)), nLin = E.filter(e => e.lin).length, quick = E.filter(e => e.lin && e.ord === 1).length;
  const lines = E.map((e, i) => `the ${NAME[i]} equation is ${e.lin ? 'linear' : `nonlinear (the term ${e.bad[0].body} breaks the rule, because ${e.bad[0].w})`}`),
   acc = E.map((e, i) => `${NAME[i]}: ${e.lin ? 'linear' : 'nonlinear'}, order ${e.ord}, ${e.lin && e.ord === 1 ? 'accepted' : 'not accepted'}`); return {
  prompt: `Mira's quick solver on the control desk accepts an equation only if it is linear and of first order. Three greenhouse controllers are described by these equations, where y is a function of the time t. Humidity: ${E[0].text}. Temperature: ${E[1].text}. Feed pump: ${E[2].text}. Enter the highest order among the three equations. Then enter how many of the three are linear. Then enter how many of the three the quick solver accepts.`,
  answer: [hi, nLin, quick],
  hints: ['The order of an equation is the order of its highest derivative of y. Find it for each equation, then take the largest of the three.', 'An equation is linear when each term is y or a derivative of y multiplied only by a number or a function of t, or else a function of t alone. A square, a product of y with a derivative, or y inside a function breaks that. The quick solver needs both tests passed by the same equation.'],
  solution: `The orders are ${E[0].ord} for humidity, ${E[1].ord} for temperature and ${E[2].ord} for the feed pump, so the highest is ${hi}. Linearity: ${lines.join('; ')}. That makes ${n(nLin)} linear. The quick solver needs a linear equation of first order: ${acc.join('; ')}. So it accepts ${n(quick)}.`,
  guidance: [
   { prompt: `Find the order of each equation: the order of the highest derivative of y in it. What is the highest order among the three?`, answer: [hi], explanation: `The orders are ${E[0].ord}, ${E[1].ord} and ${E[2].ord}, so the highest is ${hi}.` },
   { prompt: `Test each equation: is every term y or a derivative of y multiplied by a number or a function of t, or a function of t alone? How many of the three equations are linear?`, answer: [nLin], explanation: `${lines.join('; ')}. That makes ${n(nLin)} linear.`.replace(/^./, c => c.toUpperCase()) },
   { prompt: `The quick solver accepts an equation only if it is linear and also of first order. How many of the three equations pass both tests?`, answer: [quick], explanation: `${acc.join('; ')}. So the quick solver accepts ${n(quick)}.` }
  ] }; }
});

/* Four terms in no special order, each of any order up to the equation's order (one has exactly that order), nought, one or two of them nonlinear. */
const S02 = ['A', 'B', 'C', 'D'];
mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The vent motor equation',
 brief: 'The vent motor in the greenhouse roof has a long equation with its terms in no order, and Mira wants it sorted and the troublesome terms counted.',
 labels: ['order', 'linear (1) or nonlinear (0)', 'nonlinear terms'], tolerance: 0.01,
 gl: [['order'], ['linear (1) or nonlinear (0)'], ['nonlinear terms']]
}, {
 canonical: { o: 2, Ak: 0, Ao: 1, Ai: 2, Ac: 3, As: 1, Bk: 1, Bo: 2, Bi: 1, Bc: 1, Bs: -1, Ck: 0, Co: 0, Ci: 3, Cc: 2, Cs: 1, Dk: 1, Do: 1, Di: 0, Dc: 4, Ds: 1, f: 5 },
 draw: R => retry(() => { const o = R.int(1, 3), nNl = R.pick([0, 1, 1, 2]), topAt = R.int(0, 3), P = { o, f: R.int(0, 9) };
  const pool = [0, 1, 2, 3]; for (let j = pool.length - 1; j > 0; j--) { const t = R.int(0, j); [pool[j], pool[t]] = [pool[t], pool[j]]; }
  const marked = pool.slice(0, nNl);
  S02.forEach((x, j) => Object.assign(P, drawSlot(R, x, j === topAt ? o : R.int(0, o), marked.indexOf(j) >= 0))); return P; },
  P => distinct(P, S02), { o: 2, Ak: 0, Ao: 1, Ai: 2, Ac: 3, As: 1, Bk: 1, Bo: 2, Bi: 1, Bc: 1, Bs: -1, Ck: 0, Co: 0, Ci: 3, Cc: 2, Cs: 1, Dk: 1, Do: 1, Di: 0, Dc: 4, Ds: 1, f: 5 }),
 build: P => { const e = eqOf(P, S02, null, 'f'), bad = e.bad, nb = bad.length, o = e.ord, lin = e.lin;
  const why = bad.map(b => `${b.body} (${b.w})`).join(' and '); return {
  prompt: `The motor that opens a greenhouse roof vent obeys ${e.text}, where y is a function of the time t. The terms are in no special order. Enter the order of the equation. Then enter 1 if it is linear or 0 if it is not. Then enter how many of its terms break the rule for a linear equation (0 if it is linear).`,
  answer: [o, lin, nb],
  hints: ['The order comes from the highest derivative of y in any term, even one that is squared or multiplied by something. Check all four terms.', 'A term breaks the rule for a linear equation when it squares y or a derivative, multiplies y or a derivative by y or another derivative, or puts y or a derivative inside a function such as sin or e^. A term with only a number or a function of t multiplying y or a derivative is fine. Count the terms that break it.'],
  solution: `The highest derivative of y in ${e.text} is ${DD[o]}, so the order is ${o}. ${lin ? `Every term is y or a derivative of y multiplied by a number or a function of t, or a function of t alone, so the equation is linear: enter 1, and 0 terms break the rule.` : `The ${nb === 1 ? 'term that breaks' : 'terms that break'} the rule for a linear equation: ${why}. So the equation is nonlinear: enter 0, and ${n(nb)} ${nb === 1 ? 'term breaks' : 'terms break'} the rule.`}`,
  guidance: [
   { prompt: `Find the highest derivative of y in any term of ${e.text}. Enter its order: 1 for y′, 2 for y″, 3 for y‴.`, answer: [o], explanation: `The highest derivative is ${DD[o]}, so the equation has order ${o}.` },
   { prompt: `Go through the four terms of ${e.text}. Enter 1 if ${LINRULE}; enter 0 if some term breaks that rule.`, answer: [lin], explanation: lin ? 'No term breaks the rule, so the equation is linear: enter 1.' : `The ${nb === 1 ? 'term' : 'terms'} ${why} break${nb === 1 ? 's' : ''} the rule, so the equation is nonlinear: enter 0.` },
   { prompt: `Count the terms of ${e.text} that break the rule for a linear equation. How many are there?`, answer: [nb], explanation: lin ? 'There are none.' : `The terms are ${why}, so there ${nb === 1 ? 'is' : 'are'} ${n(nb)}.` }
  ] }; }
});

/* ---- q03 Integrals as solutions: y′ = f(x) with a starting value [1.1] ---- */

/* y′ = ax³ + bx + c, a a multiple of 4 and b even, so the antiderivative (a ÷ 4)x⁴ + (b ÷ 2)x² + cx has whole coefficients. Asked: C, then y(x1). */
mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Sap pressure in the feed pipe',
 brief: 'A grow-tower feed pipe is losing and gaining pressure as its pump settles, and the crew want the pressure a few minutes in.',
 labels: ['C', 'y at the later time (kPa)'], tolerance: 0.01,
 gl: [['C'], ['y at the later time (kPa)']]
}, {
 canonical: { a: 8, b: -4, c: 3, x0: 1, y0: 30, x1: 3 },
 draw: R => retry(() => { const x0 = R.int(1, 2); return { a: R.pick([4, 8, 12]), b: R.pick([-6, -4, -2, 2, 4, 6]), c: R.int(2, 9), x0, y0: R.int(10, 60), x1: x0 + R.int(1, 2) }; },
  p => { const F = x => p.a / 4 * x ** 4 + p.b / 2 * x * x + p.c * x, C = p.y0 - F(p.x0), Y = F(p.x1) + C; return C !== 0 && Y > 0 && Y < 900; }, { a: 8, b: -4, c: 3, x0: 1, y0: 30, x1: 3 }),
 build: ({ a, b, c, x0, y0, x1 }) => { const A = a / 4, B = b / 2, F = x => A * x ** 4 + B * x * x + c * x, C = y0 - F(x0), Y = F(x1) + C,
  rate = poly([a, 0, b, c], 'x'), anti = poly([A, 0, B, c, 0], 'x'), at = x => lin([[A, x ** 4], [B, x * x], [c, x]]); return {
  prompt: `The sap pressure y in a grow-tower feed pipe, in kilopascals, changes at the rate y′ = ${rate} kilopascals per minute, where x is the number of minutes since the pump started. A gauge read y(${n(x0)}) = ${n(y0)} kilopascals. Solve this initial value problem. Write the general solution as the antiderivative found term by term, with no number added on its own, plus a constant C. Enter that C (it is also the value y(0)), then enter y(${n(x1)}), the pressure ${n(x1)} ${mn(x1)} after the pump started.`,
  answer: [C, Y],
  hints: ['Integrate the rate term by term: the general solution is an antiderivative of the right-hand side plus a constant C.', 'Put the reading into the general solution to find C: C is the reading minus the antiderivative at the reading\'s x. Then put in the later x.'],
  solution: `Integrating gives the general solution y = ${anti} + C. The initial condition y(${n(x0)}) = ${n(y0)} gives ${at(x0)} + C = ${n(y0)}, that is ${n(F(x0))} + C = ${n(y0)}, so C = ${n(C)}. The particular solution is y = ${anti} ${cst(C)}, and y(${n(x1)}) = ${at(x1)} ${cst(C)} = ${n(F(x1))} ${cst(C)} = ${n(Y)} kilopascals.`,
  guidance: [
   { prompt: `The general solution is y = ${anti} + C. The initial condition says y = ${n(y0)} when x = ${n(x0)}. What is C?`, answer: [C], explanation: `At x = ${n(x0)} the antiderivative is ${n(F(x0))}, so ${n(F(x0))} + C = ${n(y0)} and C = ${n(C)}.` },
   { prompt: `The particular solution is y = ${anti} ${cst(C)}. What is y(${n(x1)})?`, answer: [Y], explanation: `At x = ${n(x1)} the antiderivative is ${n(F(x1))}; adding C gives ${n(F(x1))} ${cst(C)} = ${n(Y)} kilopascals.` }
  ] }; }
});

/* Inflow ax² + bx litres per hour, a steady leak k that nobody measured; y(0) = y0 and y(x1) = y1 are read. y = y0 + F(x) − kx with F = (a ÷ 3)x³ + (b ÷ 2)x²,
   so k = (y0 + F(x1) − y1) ÷ x1. k is a whole number (the draw builds y1 from k). */
mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The unmeasured leak',
 brief: 'The cistern is filling through one pipe and leaking through a crack nobody has measured, and the crew want the leak rate and the water later on.',
 labels: ['k (litres per hour)', 'y at the later time (litres)'], tolerance: 0.01,
 gl: [['inflow added (litres)'], ['k (litres per hour)'], ['y at the later time (litres)']]
}, {
 canonical: { a: 6, b: 4, k: 5, y0: 20, x1: 3, x2: 5 },
 draw: R => retry(() => { const x1 = R.int(2, 4); return { a: R.pick([3, 6, 9]), b: R.pick([2, 4, 6]), k: R.int(2, 9), y0: 10 * R.int(1, 6), x1, x2: x1 + R.int(1, 3) }; },
  p => { const F = x => p.a / 3 * x ** 3 + p.b / 2 * x * x, y1 = p.y0 + F(p.x1) - p.k * p.x1, y2 = p.y0 + F(p.x2) - p.k * p.x2; return y1 > 0 && y2 > 0 && y2 < 900; }, { a: 6, b: 4, k: 5, y0: 20, x1: 3, x2: 5 }),
 build: ({ a, b, k, y0, x1, x2 }) => { const A = a / 3, B = b / 2, F = x => A * x ** 3 + B * x * x, y1 = y0 + F(x1) - k * x1, y2 = y0 + F(x2) - k * x2, inflow = poly([a, b, 0], 'x'), anti = poly([A, B, 0, 0], 'x'),
  at = x => lin([[A, x ** 3], [B, x * x]]); return {
  prompt: `The greenhouse cistern fills through a pipe that delivers ${inflow} litres per hour, where x is the number of hours since the pumps started, but a crack drains it at a steady k litres per hour that nobody has measured. The gauge read y(0) = ${n(y0)} litres at the start and y(${n(x1)}) = ${n(y1)} litres after ${n(x1)} ${hr(x1)}. Enter k. Then enter y(${n(x2)}), the water in the cistern ${n(x2)} ${hr(x2)} after the pumps started.`,
  answer: [k, y2],
  hints: ['The water changes at the rate inflow minus leak, y′ = inflow − k. Integrate it: the general solution is an antiderivative of the inflow, minus kx, plus a constant C, and y(0) fixes C.', 'Put the second reading into the particular solution to get an equation for k alone, solve it, and then put in the later x.'],
  solution: `The water changes at the rate y′ = ${inflow} − k, so y = ${anti} − kx + C. At x = 0 this is C, so C = ${n(y0)}. At x = ${n(x1)} the inflow part adds ${at(x1)} = ${n(F(x1))}, so y(${n(x1)}) = ${n(F(x1))} − ${n(x1)}k + ${n(y0)} = ${n(y1)}, which gives ${n(x1)}k = ${n(F(x1) + y0 - y1)} and k = ${n(k)}. Then y(${n(x2)}) = ${at(x2)} − ${n(k)} × ${n(x2)} + ${n(y0)} = ${n(F(x2))} − ${n(k * x2)} + ${n(y0)} = ${n(y2)} litres.`,
  guidance: [
   { prompt: `The inflow part of the solution is ${anti}, with no constant added yet. How many litres has the inflow pipe added between x = 0 and x = ${n(x1)}?`, answer: [F(x1)], explanation: `At x = ${n(x1)} the antiderivative is ${at(x1)} = ${n(F(x1))} litres.` },
   { prompt: `The gauge change is y(${n(x1)}) − y(0) = ${n(y1 - y0)}. It equals the inflow added minus the leak, k × ${n(x1)}. What is k?`, answer: [k], explanation: `${n(y1 - y0)} = ${n(F(x1))} − ${n(x1)}k, so ${n(x1)}k = ${n(F(x1) - (y1 - y0))} and k = ${n(k)} litres per hour.` },
   { prompt: `Now y = ${anti} − ${n(k)}x + ${n(y0)}. What is y(${n(x2)})?`, answer: [y2], explanation: `At x = ${n(x2)} the inflow part is ${n(F(x2))}; then ${n(F(x2))} − ${n(k * x2)} + ${n(y0)} = ${n(y2)} litres.` }
  ] }; }
});

/* y′ = ax³ + bx² + cx + d, with a a multiple of 4, b of 3 and c even, so the antiderivative has whole coefficients. Harder numbers: four terms, a later x up to 6. */
mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', title: 'The slow start of the mist pump',
 brief: 'The mist pump above the seedlings speeds up over a long start-up, and the crew need the constant of its solution and the water it has delivered later on.',
 labels: ['C', 'y at the later time (litres)'], tolerance: 0.01,
 gl: [['C'], ['y at the later time (litres)']]
}, {
 canonical: { a: 4, b: 6, c: -4, d: 5, x0: 2, y0: 50, x1: 5 },
 draw: R => retry(() => { const x0 = R.int(1, 3); return { a: R.pick([4, 8, 12]), b: R.pick([3, 6, 9]), c: R.pick([-8, -6, -4, -2, 2, 4, 6, 8]), d: R.int(2, 9), x0, y0: R.int(5, 80), x1: x0 + R.int(2, 3) }; },
  p => { const F = x => p.a / 4 * x ** 4 + p.b / 3 * x ** 3 + p.c / 2 * x * x + p.d * x, C = p.y0 - F(p.x0), Y = F(p.x1) + C; return C !== 0 && Y > 0 && Y < 5000; }, { a: 4, b: 6, c: -4, d: 5, x0: 2, y0: 50, x1: 5 }),
 build: ({ a, b, c, d, x0, y0, x1 }) => { const A = a / 4, B = b / 3, Cc = c / 2, F = x => A * x ** 4 + B * x ** 3 + Cc * x * x + d * x, C = y0 - F(x0), Y = F(x1) + C,
  rate = poly([a, b, c, d], 'x'), anti = poly([A, B, Cc, d, 0], 'x'), at = x => lin([[A, x ** 4], [B, x ** 3], [Cc, x * x], [d, x]]); return {
  prompt: `The mist pump above the seedlings speeds up over a long start-up cycle: it has delivered y litres, and y changes at the rate y′ = ${rate} litres per minute, where x is the number of minutes since the cycle began. The meter read y(${n(x0)}) = ${n(y0)} litres. Solve this initial value problem. Write the general solution as the antiderivative found term by term, with no number added on its own, plus a constant C. Enter that C (it is also the value y(0)), then enter y(${n(x1)}), the litres delivered ${n(x1)} minutes after the cycle began (type it without commas).`,
  answer: [C, Y],
  hints: ['Integrate each of the four terms: the exponent goes up by 1 and you divide by the new exponent. The general solution is the antiderivative plus a constant C.', 'The reading gives C: C is the reading minus the antiderivative at the reading\'s x. Then put the later x into the particular solution.'],
  solution: `Integrating gives the general solution y = ${anti} + C. The initial condition y(${n(x0)}) = ${n(y0)} gives ${at(x0)} + C = ${n(y0)}, that is ${n(F(x0))} + C = ${n(y0)}, so C = ${n(C)}. The particular solution is y = ${anti} ${cst(C)}, and y(${n(x1)}) = ${at(x1)} ${cst(C)} = ${n(F(x1))} ${cst(C)} = ${n(Y)} litres.`,
  guidance: [
   { prompt: `The general solution is y = ${anti} + C. The initial condition says y = ${n(y0)} when x = ${n(x0)}. What is C?`, answer: [C], explanation: `At x = ${n(x0)} the antiderivative is ${n(F(x0))}, so ${n(F(x0))} + C = ${n(y0)} and C = ${n(C)}.` },
   { prompt: `The particular solution is y = ${anti} ${cst(C)}. What is y(${n(x1)})?`, answer: [Y], explanation: `At x = ${n(x1)} the antiderivative is ${n(F(x1))}; adding C gives ${n(F(x1))} ${cst(C)} = ${n(Y)} litres.` }
  ] }; }
});

/* ---- q04 Slope fields and equilibrium solutions [1.2] ---- */

/* y′ = (p − qy)(x² + c): the equilibrium is y = m with p = qm, and the factor x² + c is never 0. */
mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The carbon dioxide gauge',
 brief: 'The greenhouse carbon dioxide gauge steers itself by a rule, and Mira wants one slope and the level it settles at.',
 labels: ['slope at the point', 'equilibrium y'], tolerance: 0.01,
 gl: [['slope at the point'], ['equilibrium y']]
}, {
 canonical: { q: 3, m: 4, c: 2, x1: 2, y1: 7 },
 draw: R => retry(() => ({ q: R.int(1, 4), m: R.int(1, 8), c: R.int(1, 6), x1: R.int(0, 4), y1: R.int(0, 9) }), p => p.y1 !== p.m, { q: 3, m: 4, c: 2, x1: 2, y1: 7 }),
 build: ({ q, m, c, x1, y1 }) => { const p = q * m, u = p - q * y1, v = x1 * x1 + c, s = u * v, rhs = `(${n(p)} − ${co(q, 'y')})(x² + ${n(c)})`; return {
  prompt: `The carbon dioxide gauge in the greenhouse steers itself by the rule y′ = ${rhs}, where y is the reading and x is the time in hours since sunrise. Enter the slope of the slope field at the point (${n(x1)}, ${n(y1)}). Then enter the value of the equilibrium solution: the constant y that solves the equation.`,
  answer: [s, m],
  hints: ['The slope of the field at a point (x, y) is the right-hand side worked out at that x and that y. The first number of the point is x.', 'A constant solution has slope 0 at every x. The factor with x in it is never 0, so the factor with y in it must be 0.'],
  solution: `At (${n(x1)}, ${n(y1)}) the slope is (${n(p)} − ${n(q)} × ${n(y1)})(${n(x1)}² + ${n(c)}) = ${par(u)} × ${n(v)} = ${n(s)}. The factor x² + ${n(c)} is at least ${n(c)}, so it is never 0. For a constant solution y′ must be 0 for every x, so ${n(p)} − ${co(q, 'y')} = 0 and y = ${n(p)} ÷ ${n(q)} = ${n(m)}. The horizontal line y = ${n(m)} is the equilibrium solution.`,
  guidance: [
   { prompt: `Put x = ${n(x1)} and y = ${n(y1)} into ${rhs}. What is the slope there?`, answer: [s], explanation: `${n(p)} − ${n(q)} × ${n(y1)} = ${n(u)} and ${n(x1)}² + ${n(c)} = ${n(v)}, so the slope is ${par(u)} × ${n(v)} = ${n(s)}.` },
   { prompt: `An equilibrium solution is a constant y with slope 0 at every x. For which y is ${n(p)} − ${co(q, 'y')} = 0?`, answer: [m], explanation: `${co(q, 'y')} = ${n(p)}, so y = ${n(m)}. Along the line y = ${n(m)} every slope in the field is 0, so the line itself is a solution.` }
  ] }; }
});

/* y′ = (x − c)(b − ay) with b = a·m. The reading is dd above or below the equilibrium m, so y1 = m ± dd; m > dd keeps the reading positive. x1 is not c. */
mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The heat lamp thermostat',
 brief: 'The heat lamp thermostat follows a rule Mira has charted, and she needs its resting level and the slope at a moment she noticed.',
 labels: ['equilibrium y', 'slope at that moment'], tolerance: 0.01,
 gl: [['equilibrium y'], ['reading y at that moment'], ['slope at that moment']]
}, {
 canonical: { c: 2, a: 3, m: 6, dd: 2, up: 0, x1: 4 },
 draw: R => retry(() => ({ c: R.int(1, 4), a: R.int(2, 4), m: R.int(4, 9), dd: R.int(1, 3), up: R.int(0, 1), x1: R.int(0, 6) }), p => p.x1 !== p.c, { c: 2, a: 3, m: 6, dd: 2, up: 0, x1: 4 }),
 build: ({ c, a, m, dd, up, x1 }) => { const b = a * m, y1 = up ? m + dd : m - dd, u = x1 - c, v = b - a * y1, s = u * v, rhs = `(x ${cst(-c)})(${n(b)} − ${co(a, 'y')})`, side = up ? 'above' : 'below'; return {
  prompt: `The thermostat of a greenhouse heat lamp follows the rule y′ = ${rhs}, where y is the temperature reading in degrees and x is the time in hours. At x = ${n(x1)} Mira notices that the reading is ${n(dd)} ${dd === 1 ? 'degree' : 'degrees'} ${side} the value of the equilibrium solution. Enter the value of the equilibrium solution first. Then enter the slope of the slope field at the moment she noticed.`,
  answer: [m, s],
  hints: ['An equilibrium solution is a constant y with slope 0 at every x. The factor with x in it is not 0 for every x, so the factor with y in it must be 0.', 'Work out the reading y first: add the gap to the equilibrium value if the reading is above it, and subtract the gap if it is below. Then put x and that y into the right-hand side.'],
  solution: `For a constant solution y′ must be 0 for every x, so ${n(b)} − ${co(a, 'y')} = 0 and y = ${n(b)} ÷ ${n(a)} = ${n(m)}. The reading is ${n(dd)} ${side} that, so y = ${n(m)} ${up ? '+' : '−'} ${n(dd)} = ${n(y1)}. At (${n(x1)}, ${n(y1)}) the slope is (${n(x1)} ${cst(-c)})(${n(b)} − ${n(a)} × ${n(y1)}) = ${par(u)} × ${par(v)} = ${n(s)}.`,
  guidance: [
   { prompt: `An equilibrium solution is a constant y with slope 0 at every x. For which y is ${n(b)} − ${co(a, 'y')} = 0?`, answer: [m], explanation: `${co(a, 'y')} = ${n(b)}, so y = ${n(m)}.` },
   { prompt: `The reading is ${n(dd)} ${dd === 1 ? 'degree' : 'degrees'} ${side} the equilibrium value ${n(m)}. What is the reading y at that moment?`, answer: [y1], explanation: `y = ${n(m)} ${up ? '+' : '−'} ${n(dd)} = ${n(y1)}.` },
   { prompt: `Put x = ${n(x1)} and y = ${n(y1)} into ${rhs}. What is the slope there?`, answer: [s], explanation: `x ${cst(-c)} = ${n(u)} and ${n(b)} − ${n(a)} × ${n(y1)} = ${n(v)}, so the slope is ${par(u)} × ${par(v)} = ${n(s)}.` }
  ] }; }
});

/* y′ = (cx − d)(ay − b) with d = c·xs and b = a·m where a is 2, 4 or 5 and a does not divide b, so m is a decimal with 1 or 2 places.
   The x factor is 0 along the vertical line x = xs, which is not a solution. x1 is not xs and y1 is never m (m is not whole). */
mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', title: 'The vent airflow field',
 brief: 'The roof vent airflow follows a rule with two factors, and Mira wants the slope at one point, the level it holds, and the line that only looks like a solution.',
 labels: ['slope at the point', 'equilibrium y (decimal)', 'x of the vertical line'], tolerance: 0.005,
 gl: [['slope at the point'], ['equilibrium y (decimal)'], ['x of the vertical line']]
}, {
 canonical: { c: 3, xs: 2, a: 4, b: 9, x1: -1, y1: 5 },
 draw: R => retry(() => ({ c: R.int(2, 4), xs: R.int(1, 5), a: R.pick([2, 4, 5]), b: R.int(1, 30), x1: R.int(-3, 4), y1: R.int(-2, 8) }), p => p.b % p.a !== 0 && p.x1 !== p.xs, { c: 3, xs: 2, a: 4, b: 9, x1: -1, y1: 5 }),
 build: ({ c, xs, a, b, x1, y1 }) => { const d = c * xs, m = b / a, u = c * x1 - d, v = a * y1 - b, s = u * v, rhs = `(${co(c, 'x')} − ${n(d)})(${co(a, 'y')} − ${n(b)})`; return {
  prompt: `The airflow reading y of a roof vent follows the rule y′ = ${rhs}, where x is the time in hours. Enter the slope of the slope field at the point (${n(x1)}, ${n(y1)}). Then enter the value of the equilibrium solution as a decimal. The slope is also 0 at every point of one vertical line x = x*, but a vertical line cannot be the graph of a function y(x), so it is not a solution. Enter the value of x* last.`,
  answer: [s, m, xs],
  hints: ['The slope of the field at a point (x, y) is the right-hand side worked out at that x and that y. Put in x first and y second, and mind the signs.', 'An equilibrium solution is a constant y with slope 0 at every x, so it comes from the factor with y in it. The vertical line of zero slopes comes from the other factor being 0.'],
  solution: `At (${n(x1)}, ${n(y1)}) the slope is (${n(c)} × ${par(x1)} − ${n(d)})(${n(a)} × ${par(y1)} − ${n(b)}) = ${par(u)} × ${par(v)} = ${n(s)}. For a constant solution the factor with y must be 0, so ${co(a, 'y')} − ${n(b)} = 0 and y = ${n(b)} ÷ ${n(a)} = ${n(m)}. The factor with x is 0 when ${co(c, 'x')} = ${n(d)}, that is x = ${n(d)} ÷ ${n(c)} = ${n(xs)}: all slopes along that vertical line are 0, but it is not a solution.`,
  guidance: [
   { prompt: `Put x = ${n(x1)} and y = ${n(y1)} into ${rhs}. What is the slope there?`, answer: [s], explanation: `${n(c)} × ${par(x1)} − ${n(d)} = ${n(u)} and ${n(a)} × ${par(y1)} − ${n(b)} = ${n(v)}, so the slope is ${par(u)} × ${par(v)} = ${n(s)}.` },
   { prompt: `An equilibrium solution is a constant y with slope 0 at every x. For which y is ${co(a, 'y')} − ${n(b)} = 0? Enter it as a decimal.`, answer: [m], explanation: `${co(a, 'y')} = ${n(b)}, so y = ${n(b)} ÷ ${n(a)} = ${n(m)}.` },
   { prompt: `The factor with x is 0 for one x only. For which x is ${co(c, 'x')} − ${n(d)} = 0?`, answer: [xs], explanation: `${co(c, 'x')} = ${n(d)}, so x = ${n(d)} ÷ ${n(c)} = ${n(xs)}. Along the vertical line x = ${n(xs)} every slope is 0, but a function y(x) cannot be a vertical line, so it is not a solution.` }
  ] }; }
});

/* ---- q05 Euler's method [1.7] ---- */

const euler = (f, y0, h, N) => { const xs = [0], ys = [y0], ss = []; for (let k = 0; k < N; k++) { const s = r6(f(xs[k], ys[k])); ss.push(s); xs.push(r6((k + 1) * h)); ys.push(r6(ys[k] + h * s)); } return { xs, ys, ss }; };
/* True when every y of a run has at most 4 decimals, so the worked text shows it exactly. */
const short4 = ys => ys.every(v => Math.abs(v - Math.round(v * 1e4) / 1e4) < 1e-9);
const eulerSteps = (E, h, N) => E.ss.map((s, k) => `y${sub(k + 1)} = ${n(E.ys[k])} + ${n(h)} × ${par(s)} = ${n(E.ys[k + 1])}`);
const qy = (q, v) => q === 1 ? n(v) : `${n(q)} × ${n(v)}`;

/* y′ = p − qy (no x in the rule), y(0) = y0, h in {0.1, 0.2, 0.5}, 2 to 4 steps; qh < 1 so the estimates do not swing across the equilibrium. */
mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Warming the seed bed',
 brief: 'A heating mat is warming the seed bed, and the crew want to know how hot it will be a short while from now.',
 labels: ['estimate of y'], tolerance: 0.0005,
 gl: [['slope at the start'], ['y after one step'], ['estimate of y']]
}, {
 canonical: { p: 8, q: 2, y0: 3, h: 0.2, N: 3 },
 draw: R => retry(() => ({ p: R.int(2, 12), q: R.int(1, 4), y0: R.int(0, 10), h: R.pick([0.1, 0.2, 0.5]), N: R.int(2, 4) }), P => {
  if (P.q * P.h >= 1) return false; const E = euler((x, y) => P.p - P.q * y, P.y0, P.h, P.N), v = E.ys[P.N]; return !tie(v, 3) && Math.abs(v) < 500 && short4(E.ys); }, { p: 8, q: 2, y0: 3, h: 0.2, N: 3 }),
 build: ({ p, q, y0, h, N }) => { const f = `${n(p)} − ${co(q, 'y')}`, E = euler((x, y) => p - q * y, y0, h, N), yn = rd(E.ys[N], 3), steps = eulerSteps(E, h, N), xN = E.xs[N];
  const slopes = E.ss.map((s, k) => `f(${n(E.xs[k])}, ${n(E.ys[k])}) = ${n(p)} − ${qy(q, E.ys[k])} = ${n(s)}`); return {
  prompt: `The temperature rise y of a seed bed on a heating mat, in degrees, obeys y′ = ${f}, where x is the time in hours, and y(0) = ${n(y0)}. Use Euler's method with step size h = ${n(h)} for ${N} steps to estimate y at x = ${n(xN)}. Enter the estimate to 3 decimal places.`,
  answer: [yn],
  hints: ['Each step of Euler\'s method works out the slope f(x, y) at the current point, then moves along it: the new y is the old y plus h times the slope, and the new x is the old x plus h. The rule here has no x in it, but the slope still changes because y does.', 'Keep every decimal of each y until the last step, and round only the final estimate.'],
  solution: `Write f(x, y) = ${f}. The slopes are ${slopes.join(', ')}. The steps are ${steps.join(', ')}. So after ${N} steps the estimate of y(${n(xN)}) is ${n(E.ys[N])}${n(E.ys[N]) === n(yn) ? '' : `, which is ${n(yn)} to 3 decimal places`}.`,
  guidance: [
   { prompt: `Start at the point (0, ${n(y0)}). What is the slope f(0, ${n(y0)}) there?`, answer: [E.ss[0]], explanation: `The rule is ${f}, so the slope is ${n(p)} − ${qy(q, y0)} = ${n(E.ss[0])}.` },
   { prompt: `Take the first step: y${sub(1)} = ${n(y0)} + ${n(h)} × ${par(E.ss[0])}. What is y${sub(1)}?`, answer: [E.ys[1]], explanation: `${n(h)} × ${par(E.ss[0])} = ${n(h * E.ss[0])}, so y${sub(1)} = ${n(E.ys[1])}, the estimate at x = ${n(E.xs[1])}.` },
   { prompt: `Repeat the step until x = ${n(xN)}, working out the slope at each new point. What is the estimate after ${N} steps, to 3 decimal places?`, answer: [yn], explanation: `${steps.slice(1).join(', ')}. The estimate is ${n(yn)} to 3 decimal places.` }
  ] }; }
});

/* y′ = px − qy, y(0) = y0, 3 or 4 steps. The answers are the estimate to 3 places and T minus that rounded estimate. T is a whole number above the estimate. */
mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Ramping up the dosing pump',
 brief: 'The dosing pump on the fertiliser tank ramps up while the tank drains, and Mira needs to know how much extra to add by a set time.',
 labels: ['estimate of y', 'extra needed'], tolerance: 0.0005,
 gl: [['y after one step'], ['estimate of y'], ['extra needed']]
}, {
 canonical: { p: 6, q: 2, y0: 5, h: 0.5, N: 4, T: 14 },
 draw: R => retry(() => ({ p: R.int(2, 9), q: R.int(1, 3), y0: R.int(1, 8), h: R.pick([0.1, 0.2, 0.5]), N: R.int(3, 4), T: 0 }), P => {
  if (P.q * P.h >= 1) return false; const E = euler((x, y) => P.p * x - P.q * y, P.y0, P.h, P.N), v = E.ys[P.N]; if (tie(v, 3) || Math.abs(v) > 200 || v < 0 || !short4(E.ys)) return false;
  P.T = Math.ceil(v) + R.int(2, 12); return true; }, { p: 6, q: 2, y0: 5, h: 0.5, N: 4, T: 14 }),
 build: ({ p, q, y0, h, N, T }) => { const f = `${co(p, 'x')} − ${co(q, 'y')}`, E = euler((x, y) => p * x - q * y, y0, h, N), yn = rd(E.ys[N], 3), extra = rd(T - yn, 3), steps = eulerSteps(E, h, N), xN = E.xs[N]; return {
  prompt: `The dosing pump on the fertiliser tank ramps up: it adds ${n(p)} grams per hour for every hour since it started, so at time x it adds ${co(p, 'x')} grams per hour. The drain removes ${q === 1 ? '1 gram per hour for every gram' : `${n(q)} grams per hour for every gram`} in the tank. So the amount y in the tank, in grams, obeys y′ = ${f}, and y(0) = ${n(y0)}. Use Euler's method with step size h = ${n(h)} for ${N} steps to estimate y at x = ${n(xN)}, to 3 decimal places. Mira wants ${n(T)} grams in the tank by then. Enter your estimate, then enter ${n(T)} minus your estimate, the extra grams still needed.`,
  answer: [yn, extra],
  hints: ['Each step of Euler\'s method works out the slope at the current point, then moves along it: the new y is the old y plus h times the slope, and the new x is the old x plus h. The slope is the pump rate minus the drain rate at that point.', 'Keep every decimal of each y until the last step, and round only the final estimate. The extra amount is the target minus that rounded estimate.'],
  solution: `Write f(x, y) = ${f}. The slopes are ${E.ss.map((s, k) => `f(${n(E.xs[k])}, ${n(E.ys[k])}) = ${n(s)}`).join(', ')}. The steps are ${steps.join(', ')}. So after ${N} steps the estimate of y(${n(xN)}) is ${n(E.ys[N])}${n(E.ys[N]) === n(yn) ? '' : `, which is ${n(yn)} to 3 decimal places`}. The extra needed is ${n(T)} − ${n(yn)} = ${n(extra)} grams.`,
  guidance: [
   { prompt: `At x = 0 the pump adds nothing, so the slope is f(0, ${n(y0)}) = ${n(E.ss[0])}. Take the first step: y${sub(1)} = ${n(y0)} + ${n(h)} × ${par(E.ss[0])}. What is y${sub(1)}?`, answer: [E.ys[1]], explanation: `${n(h)} × ${par(E.ss[0])} = ${n(h * E.ss[0])}, so y${sub(1)} = ${n(E.ys[1])}, the estimate at x = ${n(E.xs[1])}.` },
   { prompt: `Repeat the step until x = ${n(xN)}, working out the slope at each new point. What is the estimate after ${N} steps, to 3 decimal places?`, answer: [yn], explanation: `${steps.slice(1).join(', ')}. The estimate is ${n(yn)} to 3 decimal places.` },
   { prompt: `Mira wants ${n(T)} grams in the tank at x = ${n(xN)}. What is ${n(T)} minus your estimate?`, answer: [extra], explanation: `${n(T)} − ${n(yn)} = ${n(extra)} grams still needed.` }
  ] }; }
});

/* y′ = (x + c)(b − ay) with b = a·m (the q04 rule), y(0) = y0 ≠ m. (h, N) is one of four pairs whose estimates have at most 4 decimals; draws that break that are skipped.
   Draws where a step is as long as 1.9 slope-widths are skipped (h·(x + c)·a ≥ 1.9), so the estimates move steadily towards the equilibrium. */
const HN05 = [[0.5, 2], [0.5, 3], [0.2, 2], [0.1, 2]];
mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'The soil moisture field',
 brief: 'The soil moisture follows a rule with two factors, and Mira wants the level it would hold at rest and an Euler estimate of where the reading goes first.',
 labels: ['equilibrium y', 'estimate of y'], tolerance: 0.0005,
 gl: [['equilibrium y'], ['y after one step'], ['estimate of y']]
}, {
 canonical: { c: 2, a: 2, m: 4, dev: 2, hn: 2 },
 draw: R => retry(() => ({ c: R.int(1, 3), a: R.int(2, 3), m: R.int(2, 7), dev: R.pick([-3, -2, -1, 1, 2, 3]), hn: R.int(0, 3) }), P => {
  const y0 = P.m + P.dev, h = HN05[P.hn][0], N = HN05[P.hn][1]; if (y0 < 0) return false;
  const E = euler((x, y) => (x + P.c) * (P.a * P.m - P.a * y), y0, h, N), v = E.ys[N]; return !tie(v, 3) && Math.abs(v) < 500 && short4(E.ys) && E.xs.slice(0, N).every(x => h * (x + P.c) * P.a < 1.9) && E.ys.slice(1).every(y => y !== P.m); }, { c: 2, a: 2, m: 4, dev: 2, hn: 2 }),
 build: ({ c, a, m, dev, hn }) => { const b = a * m, y0 = m + dev, h = HN05[hn][0], N = HN05[hn][1], rhs = `(x + ${n(c)})(${n(b)} − ${co(a, 'y')})`, E = euler((x, y) => (x + c) * (b - a * y), y0, h, N), yn = rd(E.ys[N], 3), xN = E.xs[N], steps = eulerSteps(E, h, N);
  const slopes = E.ss.map((s, k) => `f(${n(E.xs[k])}, ${n(E.ys[k])}) = (${n(E.xs[k])} + ${n(c)})(${n(b)} − ${n(a)} × ${par(E.ys[k])}) = ${n(s)}`); return {
  prompt: `The moisture y of a soil bed follows the rule y′ = ${rhs}, where x is the time in hours, and y(0) = ${n(y0)}. First enter the value of the equilibrium solution, the constant y that solves the rule. Then use Euler's method with step size h = ${n(h)} for ${N} steps to estimate y at x = ${n(xN)}, and enter the estimate to 3 decimal places. The slope at each point is the whole right-hand side, both factors, worked out at that x and y.`,
  answer: [m, yn],
  hints: ['An equilibrium solution is a constant y with slope 0 at every x. The factor with x in it is not 0 for every x, so the factor with y in it must be 0.', 'Each Euler step works out the slope at the current point, then the new y is the old y plus h times the slope, and the new x is the old x plus h. Keep every decimal of each y and round only the final estimate.'],
  solution: `For a constant solution the factor with y must be 0, so ${n(b)} − ${co(a, 'y')} = 0 and y = ${n(b)} ÷ ${n(a)} = ${n(m)}. For Euler's method write f(x, y) = ${rhs}. The slopes are ${slopes.join(', ')}. The steps are ${steps.join(', ')}. So after ${N} steps the estimate of y(${n(xN)}) is ${n(E.ys[N])}${n(E.ys[N]) === n(yn) ? '' : `, which is ${n(yn)} to 3 decimal places`}.`,
  guidance: [
   { prompt: `An equilibrium solution is a constant y with slope 0 at every x. For which y is ${n(b)} − ${co(a, 'y')} = 0?`, answer: [m], explanation: `${co(a, 'y')} = ${n(b)}, so y = ${n(m)}. The factor with x is not 0 for every x, so only this factor gives an equilibrium.` },
   { prompt: `Start at (0, ${n(y0)}). The slope there is f(0, ${n(y0)}) = ${n(E.ss[0])}. Take the first step: y${sub(1)} = ${n(y0)} + ${n(h)} × ${par(E.ss[0])}. What is y${sub(1)}?`, answer: [E.ys[1]], explanation: `${n(h)} × ${par(E.ss[0])} = ${n(h * E.ss[0])}, so y${sub(1)} = ${n(E.ys[1])}, the estimate at x = ${n(E.xs[1])}.` },
   { prompt: `Repeat the step until x = ${n(xN)}, working out the slope at each new point. What is the estimate after ${N} steps, to 3 decimal places?`, answer: [yn], explanation: `${steps.slice(1).join(', ')}. The estimate is ${n(yn)} to 3 decimal places.` }
  ] }; }
});

})();
