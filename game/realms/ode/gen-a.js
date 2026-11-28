/* Differential equations mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signed terms: trm(−1, 'y') is '− y', trm(3, 'y') is '+ 3y'; cst(−4) is '− 4'; co(1, 'y') is 'y', co(−2, 'y') is '−2y'. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
const co = (v, x) => `${v === 1 ? '' : v === -1 ? '−' : n(v)}${x}`;
/* Rounding to dp places (halves away from 0), and a test for a value that lands on a rounding tie. */
const rd = (x, dp) => { const f = Math.pow(10, dp); return Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9) / f; };
const tie = (x, dp) => { const s = Math.abs(x) * Math.pow(10, dp), r = s - Math.floor(s); return Math.abs(r - 0.5) < 1e-6; };
/* A bounded retry: at most 1000 tries, then the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return Object.assign({}, fallback); };
const sub = k => String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
const cf = v => v === 1 ? '' : n(v);
const ex = v => `e^(${n(v)})`;
const ext = v => v === 1 ? 'e^t' : `e^(${co(v, 't')})`;

/* q02: the bank of terms. o is the order of the term, lin whether it keeps the equation linear, why the reason it does not. */
const D = ['y', 'y′', 'y″', 'y‴'];
const TOP = [
 { txt: (o, c) => co(c, D[o]), lin: true },
 { txt: o => `t²${D[o]}`, lin: true },
 { txt: o => `(${D[o]})²`, lin: false, why: o => `${D[o]} is squared` },
 { txt: o => `y${D[o]}`, lin: false, why: o => `y multiplies ${D[o]}` }
];
const LOW = [
 { txt: c => `${n(c)}y′`, o: 1, lin: true },
 { txt: c => `${n(c)}y`, o: 0, lin: true },
 { txt: () => 'ty', o: 0, lin: true },
 { txt: () => '(sin t)y', o: 0, lin: true },
 { txt: () => 't³y′', o: 1, lin: true },
 { txt: () => 'y²', o: 0, lin: false, why: 'y is squared' },
 { txt: () => 'yy′', o: 1, lin: false, why: 'y multiplies its own derivative y′' },
 { txt: () => 'sin y', o: 0, lin: false, why: 'y sits inside the sine' },
 { txt: () => '(y′)²', o: 1, lin: false, why: 'y′ is squared' },
 { txt: () => 'e^y', o: 0, lin: false, why: 'y sits in an exponent' }
];
const RHS = ['0', 'sin t', '4t', 'e^(2t)', 't²'];
const eq02 = ({ o, top, c0, l1, c1, l2, c2, pos, rhs }) => {
 const terms = [TOP[top].txt(o, c0), LOW[l1].txt(c1), LOW[l2].txt(c2)];
 const order = [1, 2]; order.splice(pos, 0, 0);
 return `${order.map(i => terms[i]).join(' + ')} = ${RHS[rhs]}`;
};

/* q06: the three separable forms. */
const F06 = [
 { eq: ({ k }) => `y′ = ${co(k, 'y')}`, ex: ({ k, T }) => k * T, val: ({ y0, k, T }) => y0 * Math.exp(k * T) },
 { eq: ({ k }) => `y′ = ${co(k, 'ty')}`, ex: ({ k, T }) => k * T * T / 2, val: ({ y0, k, T }) => y0 * Math.exp(k * T * T / 2) },
 { eq: () => 'y′ = t ÷ y', ex: ({ y0, T }) => y0 * y0 + T * T, val: ({ y0, T }) => Math.sqrt(y0 * y0 + T * T) }
];

/* q09: roots in increasing order, a coefficient k, which factors are written the other way round, the order the factors are
   written in, and which equilibrium is asked about. */
const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const WHICH = ['smallest', 'middle', 'largest'];
const fac09 = (r, flip) => r === 0 ? 'y' : flip ? `(${n(r)} − y)` : `(y ${cst(-r)})`;
const f09 = ({ r, k, flips, perm }) => {
 const fl = [0, 1, 2].map(i => !!(flips & (1 << i)) && r[i] > 0);
 const lead = k * fl.reduce((s, f) => f ? -s : s, 1);
 const txt = `${k === 1 ? '' : k === -1 ? '−' : n(k)}${PERMS[perm].map(i => fac09(r[i], fl[i])).join('')}`;
 const f = y => lead * (y - r[0]) * (y - r[1]) * (y - r[2]);
 return { lead, txt, f };
};

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* a·y′ + b·y = 0 with b = −a·k, tried with y = Ce^(kt); the starting rate y′(0) = kC fixes C. |k| >= 2 so no
    coefficient 1 is written out. Not the worked example (2y′ + 10y = 0, k = −5). */
 q01: {
  canonical: { a: 3, k: 2, C: 40 },
  draw: R => ({ a: R.int(2, 6), k: R.pick([-4, -3, -2, 2, 3, 4]), C: 5 * R.int(2, 12) }),
  build: ({ a, k, C }) => { const b = -a * k, rate = k * C, eq = `${n(a)}y′ ${trm(b, 'y')} = 0`; return {
   prompt: `Mira models the nutrient gel in a seed tray with the differential equation ${eq}, where y is the gel in grams and t is the time in days. She tries a solution of the form y = Ce^(kt). Enter the value of k that makes it a solution. At the start the gel is changing at y′(0) = ${n(rate)} grams per day; then enter C.`,
   answer: [k, C],
   hints: ['Differentiate y = Ce^(kt) to get y′ = kCe^(kt). Put y and y′ into the equation and divide every term by Ce^(kt), which is never 0: what is left is an equation for k alone.', 'At t = 0 the factor e^(kt) is e⁰, which is 1, so y′(0) = kC. Divide the starting rate by k to get C.'],
   solution: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq}: ${n(a)}kCe^(kt) ${trm(b, 'Ce^(kt)')} = 0. Dividing by Ce^(kt) leaves ${n(a)}k ${cst(b)} = 0, so k = ${n(-b)} ÷ ${n(a)} = ${n(k)}. Then y′(0) = kC = ${n(k)}C, and this equals ${n(rate)}, so C = ${n(rate)} ÷ ${par(k)} = ${n(C)}. The solution is y = ${n(C)}${ext(k)}, which starts at ${n(C)} grams.`,
   guidance: [
    { prompt: `Put y = Ce^(kt) and y′ = kCe^(kt) into ${eq} and divide by Ce^(kt). That leaves ${n(a)}k ${cst(b)} = 0. What is k?`, answer: [k], explanation: `${n(a)}k = ${n(-b)}, so k = ${n(-b)} ÷ ${n(a)} = ${n(k)}. Any other k leaves a term that is not 0, so the equation fails.` },
    { prompt: `With k = ${n(k)}, the starting rate is y′(0) = ${n(k)}C, and it equals ${n(rate)}. What is C?`, answer: [C], explanation: `C = ${n(rate)} ÷ ${par(k)} = ${n(C)}. Since e⁰ = 1, C is also the amount of gel at t = 0: ${n(C)} grams.` }
   ] }; }
 },
 /* An equation of three terms: the highest-order term (order 1 to 3) and two lower ones from a bank, in a drawn order.
    Half the draws are linear (every term from the linear bank); the other half have exactly one nonlinear term. */
 q02: {
  canonical: { o: 2, top: 0, c0: 1, l1: 0, c1: 3, l2: 5, c2: 2, pos: 0, rhs: 1 },
  draw: R => retry(() => {
   const lin = R.bool(), o = R.int(1, 3), nlTop = !lin && R.bool();
   const top = lin || !nlTop ? R.pick([0, 1]) : R.pick([2, 3]);
   const pool = i => LOW[i].o < o && (lin || nlTop ? LOW[i].lin : true);
   const l1 = R.int(0, 9), l2 = R.int(0, 9);
   return { o, top, c0: R.int(1, 5), l1, c1: R.int(2, 9), l2, c2: R.int(2, 9), pos: R.int(0, 2), rhs: R.int(0, 4), ok: pool(l1) && pool(l2) && l1 !== l2 && (lin || nlTop || (LOW[l1].lin !== LOW[l2].lin)) };
  }, p => p.ok, { o: 3, top: 1, c0: 1, l1: 0, c1: 4, l2: 1, c2: 5, pos: 1, rhs: 2 }),
  build: p => { const { o, top, l1, l2 } = p, eq = eq02(p), bad = [TOP[top].lin ? null : { t: TOP[top].txt(o, p.c0), w: TOP[top].why(o) }, LOW[l1].lin ? null : { t: LOW[l1].txt(p.c1), w: LOW[l1].why }, LOW[l2].lin ? null : { t: LOW[l2].txt(p.c2), w: LOW[l2].why }].filter(Boolean);
   const lin = bad.length ? 0 : 1;
   const verdict = lin ? 'Every term is y or a derivative of y multiplied by a number or a function of t only, or a function of t alone, so the equation is linear: enter 1.' : `The term ${bad[0].t} is not of that form, because ${bad[0].w}, so the equation is nonlinear: enter 0.`;
   return {
   prompt: `A greenhouse controller is described by the equation ${eq}, where y is a function of the time t. Enter the order of this differential equation, then enter 1 if it is linear or 0 if it is nonlinear.`,
   answer: [o, lin],
   hints: ['The order is the order of the highest derivative of y that appears: y′ is first order, y″ second order, y‴ third order.', 'An equation is linear when each term is y, or one of its derivatives, multiplied only by a number or a function of t, or else is a function of t alone. A power of y or of a derivative, a product of two of them, or y inside a function such as sin makes it nonlinear.'],
   solution: `The highest derivative of y in ${eq} is ${D[o]}, so the order is ${o}. ${lin ? verdict : 'For a linear equation each term must be y or a derivative of y multiplied only by a number or a function of t, or a function of t alone. ' + verdict}`,
   guidance: [
    { prompt: `Which derivative of y is the highest one in ${eq}? Enter its order: 1 for y′, 2 for y″, 3 for y‴.`, answer: [o], explanation: `The highest derivative is ${D[o]}, so the equation has order ${o}. The other terms have lower order and do not change that.` },
    { prompt: `Look at each term of ${eq}. Enter 1 if every term is y or a derivative of y multiplied by a number or a function of t, or a function of t alone; enter 0 if some term breaks that rule.`, answer: [lin], explanation: verdict }
   ] }; }
 },
 /* y′ = ax² + bx + c with y(x0) = y0, asked at x1. a is a multiple of 3 and b is even, so the antiderivative has whole
    coefficients; b² < 4ac keeps the rate positive. Not the worked example (y′ = 3x² + 2, y(0) = 4). */
 q03: {
  canonical: { a: 6, b: -2, c: 4, x0: 1, y0: 20, x1: 3 },
  draw: R => retry(() => { const x0 = R.int(0, 2); return { a: R.pick([3, 6, 9]), b: R.pick([-6, -4, -2, 2, 4, 6]), c: R.int(2, 9), x0, y0: R.int(5, 40), x1: x0 + R.int(1, 3) }; },
   p => p.b * p.b < 4 * p.a * p.c && p.y0 !== p.a / 3 * p.x0 ** 3 + p.b / 2 * p.x0 ** 2 + p.c * p.x0 && p.a / 3 * p.x1 ** 3 + p.b / 2 * p.x1 ** 2 + p.c * p.x1 + p.y0 < 900, { a: 6, b: -2, c: 4, x0: 1, y0: 20, x1: 3 }),
  build: ({ a, b, c, x0, y0, x1 }) => { const A = a / 3, B = b / 2, F = x => A * x ** 3 + B * x * x + c * x, C = y0 - F(x0), Y = F(x1) + C;
   const rate = `${n(a)}x² ${trm(b, 'x')} ${cst(c)}`, anti = `${co(A, 'x³')} ${trm(B, 'x²')} ${trm(c, 'x')}`;
   const at = x => `${A === 1 ? '' : n(A) + ' × '}${n(x ** 3)} ${sgn(B)} ${Math.abs(B) === 1 ? '' : n(Math.abs(B)) + ' × '}${n(x * x)} ${sgn(c)} ${n(c)} × ${n(x)}`;
   return {
   prompt: `The water y in a greenhouse cistern, in litres, changes at the rate y′ = ${rate} litres per hour, where x is the number of hours since the pumps started. The gauge read y(${n(x0)}) = ${n(y0)} litres. Solve this initial value problem and enter y(${n(x1)}), the water in the cistern ${n(x1)} ${x1 === 1 ? 'hour' : 'hours'} after the pumps started.`,
   answer: [Y],
   hints: ['Integrate the rate term by term: the general solution is an antiderivative of the right-hand side plus a constant C.', 'Put the initial condition into the general solution to find C, then put in the later x.'],
   solution: `Integrating gives the general solution y = ${anti} + C. The initial condition y(${n(x0)}) = ${n(y0)} gives ${at(x0)} + C = ${n(y0)}, that is ${n(F(x0))} + C = ${n(y0)}, so C = ${n(C)}. The particular solution is y = ${anti} ${cst(C)}, and y(${n(x1)}) = ${at(x1)} ${cst(C)} = ${n(F(x1))} ${cst(C)} = ${n(Y)} litres.`,
   guidance: [
    { prompt: `The general solution is y = ${anti} + C. The initial condition says y = ${n(y0)} when x = ${n(x0)}. What is C?`, answer: [C], explanation: `At x = ${n(x0)} the antiderivative is ${n(F(x0))}, so ${n(F(x0))} + C = ${n(y0)} and C = ${n(C)}.` },
    { prompt: `The particular solution is y = ${anti} ${cst(C)}. What is y(${n(x1)})?`, answer: [Y], explanation: `At x = ${n(x1)} the antiderivative is ${n(F(x1))}; adding C gives ${n(F(x1))} ${cst(C)} = ${n(Y)} litres.` }
   ] }; }
 },
 /* y′ = (x + c)(ay − am): the equilibrium is y = m; the slope at (x1, y1) is (x1 + c)(a·y1 − a·m), never 0.
    c stays in −3..3, so the worked example (x − 5)(3y − 6) is never drawn. */
 q04: {
  canonical: { c: 1, a: 2, m: 4, x1: 2, y1: 1 },
  draw: R => retry(() => ({ c: R.nz(-3, 3), a: R.int(2, 4), m: R.int(1, 6), x1: R.int(0, 3), y1: R.int(0, 8) }), p => p.y1 !== p.m && p.x1 + p.c !== 0, { c: 1, a: 2, m: 4, x1: 2, y1: 1 }),
  build: ({ c, a, m, x1, y1 }) => { const b = a * m, u = x1 + c, v = a * y1 - b, s = u * v, rhs = `(x ${cst(c)})(${n(a)}y − ${n(b)})`; return {
   prompt: `Mira draws the slope field of y′ = ${rhs} for a greenhouse humidity gauge, where y is the reading and x is the time in hours. Enter the slope of the field at the point (${n(x1)}, ${n(y1)}). Then enter the value of the equilibrium solution: the constant y that solves the equation.`,
   answer: [s, m],
   hints: ['The slope of the field at a point (x, y) is the right-hand side of the equation worked out at that x and that y.', 'A constant solution has y′ = 0 at every x. The factor with x in it is not 0 for every x, so the factor with y in it must be 0.'],
   solution: `At (${n(x1)}, ${n(y1)}) the slope is (${n(x1)} ${cst(c)})(${n(a)} × ${n(y1)} − ${n(b)}) = ${par(u)} × ${par(v)} = ${n(s)}. For a constant solution y′ must be 0 for every x, so ${n(a)}y − ${n(b)} = 0 and y = ${n(b)} ÷ ${n(a)} = ${n(m)}. The horizontal line y = ${n(m)} is the equilibrium solution.`,
   guidance: [
    { prompt: `Put x = ${n(x1)} and y = ${n(y1)} into ${rhs}. What is the slope there?`, answer: [s], explanation: `x ${cst(c)} = ${n(u)} and ${n(a)}y − ${n(b)} = ${n(v)}, so the slope is ${par(u)} × ${par(v)} = ${n(s)}.` },
    { prompt: `An equilibrium solution is a constant y with slope 0 at every x. For which y is ${n(a)}y − ${n(b)} = 0?`, answer: [m], explanation: `${n(a)}y = ${n(b)}, so y = ${n(m)}. Along the line y = ${n(m)} every slope in the field is 0, so the line itself is a solution.` }
   ] }; }
 },
 /* Euler's method for y′ = px + qy, y(0) = y0, step h in {0.1, 0.2, 0.5}, n = 2 to 4 steps. Each step adds at most one
    decimal place, so the estimate is exact with at most 4 places; draws whose fourth place is a 5 (a rounding tie)
    are skipped. Not the worked example (y′ = y − x, y(0) = 2, h = 0.5, 2 steps). */
 q05: {
  canonical: { p: 1, q: 2, y0: 1, h: 0.1, N: 3 },
  draw: R => retry(() => ({ p: R.nz(-3, 3), q: R.nz(-3, 3), y0: R.int(1, 5), h: R.pick([0.1, 0.2, 0.5]), N: R.int(2, 4) }), p => {
   if (p.q * p.h < -0.5 || (p.p === -1 && p.q === 1 && p.y0 === 2 && p.h === 0.5 && p.N === 2)) return false;
   let y = p.y0; for (let k = 0; k < p.N; k++) y = Math.round((y + p.h * (p.p * k * p.h + p.q * y)) * 1e6) / 1e6;
   return !tie(y, 3) && Math.abs(y) < 500;
  }, { p: 1, q: 2, y0: 1, h: 0.1, N: 3 }),
  build: ({ p, q, y0, h, N }) => { const f = `${co(p, 'x')} ${trm(q, 'y')}`, ys = [y0], xs = [0], ss = [];
   for (let k = 0; k < N; k++) { const x = Math.round(k * h * 10) / 10, s = Math.round((p * x + q * ys[k]) * 1e6) / 1e6; ss.push(s); xs.push(Math.round((k + 1) * h * 10) / 10); ys.push(Math.round((ys[k] + h * s) * 1e6) / 1e6); }
   const yn = rd(ys[N], 3), steps = ss.map((s, k) => `y${sub(k + 1)} = ${n(ys[k])} + ${n(h)} × ${par(s)} = ${n(ys[k + 1])}`);
   const slopes = ss.map((s, k) => `f(${n(xs[k])}, ${n(ys[k])}) = ${n(s)}`);
   return {
   prompt: `The moisture level y of a test bed obeys y′ = ${f}, where x is the time in hours, and y(0) = ${n(y0)}. Use Euler's method with step size h = ${n(h)} for ${N} steps, to estimate y at x = ${n(xs[N])}. Enter the estimate to 3 decimal places.`,
   answer: [yn],
   hints: ['Each step of Euler\'s method works out the slope f(x, y) at the current point, then moves along it: the new y is the old y plus h times the slope, and the new x is the old x plus h.', 'Keep every decimal of each y until the last step, and round only the final estimate.'],
   solution: `Write f(x, y) = ${f}. The slopes are ${slopes.join(', ')}. The steps are ${steps.join(', ')}. So after ${N} steps the estimate of y(${n(xs[N])}) is ${n(ys[N])}${n(ys[N]) === n(yn) ? '' : `, which is ${n(yn)} to 3 decimal places`}.`,
   guidance: [
    { prompt: `Start at the point (0, ${n(y0)}). What is the slope f(0, ${n(y0)}) there?`, answer: [ss[0]], explanation: `At x = 0 the x term is 0, and the y term is ${n(q)} × ${n(y0)} = ${n(ss[0])}.` },
    { prompt: `Take the first step: y${sub(1)} = ${n(y0)} + ${n(h)} × ${par(ss[0])}. What is y${sub(1)}?`, answer: [ys[1]], explanation: `${n(h)} × ${par(ss[0])} = ${n(h * ss[0])}, so y${sub(1)} = ${n(ys[1])}, the estimate at x = ${n(xs[1])}.` },
    { prompt: `Repeat the step until x = ${n(xs[N])}, working out the slope at each new point. What is the estimate after ${N} steps, to 3 decimal places?`, answer: [yn], explanation: `${steps.slice(1).join(', ')}. The estimate is ${n(yn)} to 3 decimal places.` }
   ] }; }
 },
 /* Three separable forms: y′ = ky, y′ = kty and y′ = t ÷ y, each with y(0) = y0 > 0, asked at t = T to 3 decimal places.
    The exponent (or y² for the third form) has at most 2 decimals, and ties are skipped. Not the worked example (y′ = 2y). */
 q06: {
  canonical: { form: 0, k: 0.3, y0: 5, T: 4 },
  draw: R => retry(() => { const form = R.int(0, 2);
   return form === 0 ? { form, k: R.pick([-0.5, -0.4, -0.3, -0.2, 0.2, 0.3, 0.4, 0.5]), y0: R.int(2, 20), T: R.int(2, 5) }
    : form === 1 ? { form, k: R.pick([-0.4, -0.2, 0.1, 0.2, 0.3, 0.4]), y0: R.int(2, 20), T: R.int(1, 3) }
    : { form, k: 1, y0: R.int(2, 9), T: R.int(1, 6) }; }, p => !tie(F06[p.form].val(p), 3), { form: 0, k: 0.3, y0: 5, T: 4 }),
  build: p => { const { form, k, y0, T } = p, F = F06[form], eq = F.eq(p), e = rd(F.ex(p), 4), v = rd(F.val(p), 3);
   const steps = [
    `Separate: dy ÷ y = ${n(k)} dt. Integrating both sides gives ln y = ${co(k, 't')} + c, so y = A${ext(k)} with A = e^c. At t = 0 this is A, so A = ${n(y0)}`,
    `Separate: dy ÷ y = ${n(k)}t dt. Integrating both sides gives ln y = ${n(k / 2)}t² + c, so y = Ae^(${n(k / 2)}t²) with A = e^c. At t = 0 this is A, so A = ${n(y0)}`,
    `Separate: y dy = t dt. Integrating both sides gives y² ÷ 2 = t² ÷ 2 + c, so y² = t² + 2c. At t = 0, y² = ${n(y0 * y0)}, so y² = t² + ${n(y0 * y0)}`][form];
   const ask = [`What is the exponent ${n(k)} × ${n(T)} in y(${n(T)}) = ${n(y0)}e^(${n(k)} × ${n(T)})?`, `What is the exponent ${n(k / 2)} × ${n(T * T)} in y(${n(T)}) = ${n(y0)}e^(${n(k / 2)} × ${n(T)}²)?`, `What is y² at t = ${n(T)}, from y² = t² + ${n(y0 * y0)}?`][form];
   const fin = form === 2 ? `y(${n(T)}) = √${n(e)} = ${n(v)} to 3 decimal places, taking the positive root because y(0) is positive` : `y(${n(T)}) = ${n(y0)}${ex(e)} = ${n(v)} to 3 decimal places`;
   return {
   prompt: `In a greenhouse trial a quantity y obeys the differential equation ${eq}, where t is the time in hours, and y(0) = ${n(y0)}. Solve it by separating the variables, and enter y at t = ${n(T)} to 3 decimal places.`,
   answer: [v],
   hints: ['Write y′ as dy ÷ dt and move everything with y to the left and everything with t to the right, then integrate both sides and add one constant.', 'Use y(0) to find the constant before you put in the later time. Round only the final value.'],
   solution: `${steps}. ${fin}.`,
   guidance: [
    { prompt: `${steps}. ${ask}`, answer: [e], explanation: form === 2 ? `${n(T)}² + ${n(y0 * y0)} = ${n(e)}.` : `The exponent is ${n(e)}, so y(${n(T)}) = ${n(y0)}${ex(e)}.` },
    { prompt: form === 2 ? `y is positive, so y(${n(T)}) = √${n(e)}. What is y(${n(T)}) to 3 decimal places?` : `What is y(${n(T)}) = ${n(y0)}${ex(e)} to 3 decimal places?`, answer: [v], explanation: `${fin}.` }
   ] }; }
 },
 /* a·y′ + a·p·y = a·g(t) with g = B or B·e^(st); divided by a it is y′ + py = g, with integrating factor e^(pt).
    The steady part K = B ÷ p (or B ÷ (p + s)) has at most 3 decimals. Not the worked example (y′ + 2y = 4, a = 1). */
 q07: {
  canonical: { a: 2, p: 3, kind: 0, B: 15, s: 0, y0: 2, T: 1 },
  draw: R => retry(() => { const kind = R.int(0, 1); return { a: R.pick([2, 4]), p: R.pick([0.5, 1, 1.5, 2, 3]), kind, B: R.int(2, 20), s: kind ? R.pick([-1, 1, 2]) : 0, y0: R.int(0, 9), T: R.int(1, 2) }; }, p => {
   const d = p.p + p.s, K = p.B / d, c = p.a * p.p; if (d === 0 || Math.abs(K * 1000 - Math.round(K * 1000)) > 1e-6 || c !== Math.round(c) || Math.abs(K - p.y0) < 0.5 || (p.kind && Math.abs(K) === 1)) return false;
   const Y = K * Math.exp(p.s * p.T) + (p.y0 - K) * Math.exp(-p.p * p.T); return !tie(Y, 3) && Y > 0 && Y < 150; }, { a: 2, p: 3, kind: 0, B: 15, s: 0, y0: 2, T: 1 }),
  build: ({ a, p, kind, B, s, y0, T }) => { const c = a * p, d = p + s, K = B / d, D = y0 - K, Y = rd(K * Math.exp(s * T) + D * Math.exp(-p * T), 3);
   const g = kind ? `${n(B)}${ext(s)}` : n(B), gA = kind ? `${n(a * B)}${ext(s)}` : n(a * B), y1 = `${co(p, 'y')}`;
   const kpart = kind ? `${n(K)}${ext(s)}` : n(K), sol = `y = ${kpart} ${D < 0 ? '−' : '+'} ${cf(Math.abs(D))}${ext(-p)}`;
   const integ = kind ? `(${ext(p)}y)′ = ${n(B)}${ext(d)}, and integrating gives ${ext(p)}y = ${n(B)} ÷ ${n(d)} × ${ext(d)} + D, so y = ${kpart} + D${ext(-p)}` : `(${ext(p)}y)′ = ${n(B)}${ext(p)}, and integrating gives ${ext(p)}y = ${n(B)} ÷ ${n(p)} × ${ext(p)} + D, so y = ${kpart} + D${ext(-p)}`;
   const atT = kind ? `${n(K)}${ex(s * T)} ${D < 0 ? '−' : '+'} ${cf(Math.abs(D))}${ex(-p * T)}` : `${n(K)} ${D < 0 ? '−' : '+'} ${cf(Math.abs(D))}${ex(-p * T)}`;
   return {
   prompt: `The temperature y of a coolant line, in degrees above the room, obeys ${n(a)}y′ + ${co(c, 'y')} = ${gA}, where t is the time in minutes, and y(0) = ${n(y0)}. Write the integrating factor as e^(rt) and enter r. Then solve the equation and enter y(${n(T)}) to 3 decimal places.`,
   answer: [p, Y],
   hints: ['First divide the whole equation by the number in front of y′, so that it reads y′ + py = g(t). The integrating factor is then e^(pt).', 'Multiplying by the integrating factor turns the left side into the derivative of e^(pt)y. Integrate both sides, divide by e^(pt), and use y(0) to find the constant.'],
   solution: `Dividing by ${n(a)} gives y′ + ${y1} = ${g}, so the integrating factor is ${ext(p)} and r = ${n(p)}. Multiplying through, ${integ}. At t = 0, y = ${n(K)} + D = ${n(y0)}, so D = ${n(D)} and ${sol}. Then y(${n(T)}) = ${atT} = ${n(Y)} to 3 decimal places.`,
   guidance: [
    { prompt: `Divide ${n(a)}y′ + ${co(c, 'y')} = ${gA} by ${n(a)}. The equation becomes y′ + py = g(t). What is p, the r of the integrating factor e^(rt)?`, answer: [p], explanation: `Dividing gives y′ + ${y1} = ${g}, so p = ${n(p)} and the integrating factor is ${ext(p)}.` },
    { prompt: `Multiply by ${ext(p)} and integrate: the solution has the form y = ${kind ? `K${ext(s)}` : 'K'} + D${ext(-p)}. What is K?`, answer: [K], explanation: `${integ}. So K = ${n(K)}.` },
    { prompt: `Use y(0) = ${n(y0)} to find D, then work out y(${n(T)}). What is it to 3 decimal places?`, answer: [Y], explanation: `${n(K)} + D = ${n(y0)} gives D = ${n(D)}, so ${sol} and y(${n(T)}) = ${n(Y)}.` }
   ] }; }
 },
 /* A tank of V litres, brine in at r litres per minute with c kg of salt per litre, the same flow out. x′ = rc − (r ÷ V)x,
    x = Vc + (x0 − Vc)e^(−rt ÷ V). r ÷ V has at most 3 decimals. Not the worked example (100 L, 5 L/min, 0.1 kg/L, 0 kg, 20 min). */
 q08: {
  canonical: { V: 200, r: 4, c: 0.25, x0: 10, T: 30 },
  draw: R => retry(() => ({ V: R.pick([100, 200, 400, 500, 1000]), r: R.pick([2, 4, 5, 10, 20]), c: R.pick([0.05, 0.1, 0.2, 0.25, 0.5]), x0: R.int(0, 40), T: R.pick([5, 10, 15, 20, 30, 60]) }), p => {
   const k = p.r / p.V, L = p.V * p.c; if (Math.abs(k * 1000 - Math.round(k * 1000)) > 1e-9 || p.x0 === L || L > 500 || p.r * p.c * 1000 % 1 > 1e-9) return false;
   if (p.V === 100 && p.r === 5 && p.c === 0.1 && p.x0 === 0 && p.T === 20) return false;
   return !tie(L + (p.x0 - L) * Math.exp(-k * p.T), 3); }, { V: 200, r: 4, c: 0.25, x0: 10, T: 30 }),
  build: ({ V, r, c, x0, T }) => { const k = r / V, L = V * c, inr = r * c, D = x0 - L, X = rd(L + D * Math.exp(-k * T), 3), kT = k * T;
   return {
   prompt: `A brine tank in the coolant loop holds ${n(V)} litres of water with ${n(x0)} kg of salt dissolved in it. Brine with ${n(c)} kg of salt per litre flows in at ${n(r)} litres per minute, and the well-mixed liquid flows out at the same rate, so the volume stays ${n(V)} litres. Enter the salt in the tank after ${n(T)} minutes, in kg to 3 decimal places. Then enter the amount of salt, in kg, that the tank settles towards in the long run.`,
   answer: [X, L],
   hints: ['The salt x changes at the rate in minus the rate out. Salt comes in at the flow rate times the incoming concentration; it leaves at the flow rate times x ÷ V, the concentration in the tank.', 'The equation x′ + (r ÷ V)x = rc is linear: solve it with the integrating factor e^(rt ÷ V) and use the starting amount for the constant. In the long run the exponential term dies away.'],
   solution: `Salt flows in at ${n(r)} × ${n(c)} = ${n(inr)} kg per minute and out at ${n(r)} × x ÷ ${n(V)} = ${n(k)}x kg per minute, so x′ = ${n(inr)} − ${n(k)}x, that is x′ + ${n(k)}x = ${n(inr)}. With the integrating factor e^(${n(k)}t) the solution is x = ${n(inr)} ÷ ${n(k)} + Ce^(−${n(k)}t) = ${n(L)} + Ce^(−${n(k)}t). At t = 0, x = ${n(x0)}, so C = ${n(D)}. After ${n(T)} minutes, x = ${n(L)} ${D < 0 ? '−' : '+'} ${cf(Math.abs(D))}${ex(-kT)} = ${n(X)} kg to 3 decimal places. As t grows, e^(−${n(k)}t) shrinks to 0, so the salt settles towards ${n(L)} kg.`,
   guidance: [
    { prompt: `Brine brings in ${n(r)} litres per minute at ${n(c)} kg per litre. How many kg of salt come in per minute?`, answer: [inr], explanation: `${n(r)} × ${n(c)} = ${n(inr)} kg of salt per minute.` },
    { prompt: `Salt leaves at ${n(r)} litres per minute at a concentration of x ÷ ${n(V)} kg per litre, so x′ = ${n(inr)} − kx. What is k?`, answer: [k], explanation: `The outflow carries ${n(r)} × x ÷ ${n(V)} = ${n(k)}x kg per minute, so k = ${n(k)}.` },
    { prompt: `The solution of x′ = ${n(inr)} − ${n(k)}x with x(0) = ${n(x0)} is x = ${n(L)} ${D < 0 ? '−' : '+'} ${cf(Math.abs(D))}e^(−${n(k)}t). What is x after ${n(T)} minutes, to 3 decimal places?`, answer: [X], explanation: `${n(k)} × ${n(T)} = ${n(kT)}, so x = ${n(L)} ${D < 0 ? '−' : '+'} ${cf(Math.abs(D))}${ex(-kT)} = ${n(X)} kg.` }
   ] }; }
 },
 /* y′ = k·(three linear factors), roots r1 < r2 < r3 in −4..6, some factors written as (r − y), in a drawn order.
    lead is the coefficient of y³ once multiplied out; lead > 0 makes the middle root stable and the outer two unstable. */
 q09: {
  canonical: { r: [-1, 3, 5], k: 2, flips: 4, perm: 0, j: 1 },
  draw: R => retry(() => { const a = R.int(-4, 2), b = a + R.int(1, 4), c = b + R.int(1, 4); return { r: [a, b, c], k: R.pick([-3, -2, -1, 1, 2, 3]), flips: R.int(0, 7), perm: R.int(0, 5), j: R.int(0, 2) }; }, p => p.r[2] <= 6, { r: [-1, 3, 5], k: 2, flips: 4, perm: 0, j: 1 }),
  build: p => { const { r, j } = p, { txt, f } = f09(p), e = r[j], below = f(e - 0.5) > 0 ? 1 : -1, above = f(e + 0.5) > 0 ? 1 : -1, code = below > 0 && above < 0 ? 1 : 0;
   const word = WHICH[j], dir = v => v > 0 ? 'positive, so y rises' : 'negative, so y falls';
   return {
   prompt: `The temperature y of the coolant loop, in degrees above its set point, obeys the autonomous equation y′ = ${txt}. Enter its three equilibrium values in increasing order. Then, for the ${word} one, enter 1 if it is stable or 0 if it is unstable.`,
   answer: [r[0], r[1], r[2], code],
   hints: ['The equilibria are the constant values of y that make the right-hand side 0: set each factor to 0.', 'Work out the sign of y′ just below and just above the equilibrium. It is stable when y rises towards it from below and falls towards it from above; otherwise it is unstable.'],
   solution: `The right-hand side is 0 when one factor is 0, so the equilibria are y = ${n(r[0])}, ${n(r[1])} and ${n(r[2])}. Just below the ${word} one, at y = ${n(e - 0.5)}, y′ is ${dir(below)}; just above, at y = ${n(e + 0.5)}, y′ is ${dir(above)}. ${code ? `Both sides move towards y = ${n(e)}, so it is stable: enter 1.` : `Solutions starting near y = ${n(e)} move away from it on at least one side, so it is unstable: enter 0.`}`,
   guidance: [
    { prompt: `Set each factor of ${txt} to 0. What is the smallest equilibrium?`, answer: [r[0]], explanation: `The factors are 0 at y = ${n(r[0])}, ${n(r[1])} and ${n(r[2])}; the smallest is ${n(r[0])}.` },
    { prompt: `Put y = ${n(e - 0.5)}, just below the ${word} equilibrium ${n(e)}, into the right-hand side. Enter 1 if y′ is positive there or −1 if it is negative.`, answer: [below], explanation: `y′ is ${dir(below)} just below ${n(e)}.` },
    { prompt: `Now put y = ${n(e + 0.5)}, just above ${n(e)}. Enter 1 if y′ is positive there or −1 if it is negative.`, answer: [above], explanation: `y′ is ${dir(above)} just above ${n(e)}.` },
    { prompt: `Just below ${n(e)} y′ is ${below > 0 ? 'positive' : 'negative'}, and just above it y′ is ${above > 0 ? 'positive' : 'negative'}. Enter 1 if y = ${n(e)} is stable or 0 if it is unstable.`, answer: [code], explanation: code ? `y rises towards ${n(e)} from below and falls towards it from above, so it is stable.` : `On at least one side y moves away from ${n(e)}, so it is unstable.` }
   ] }; }
 },
 /* P′ = aP − bP² with b = a ÷ K (at most 4 decimals), P(0) = K ÷ (A + 1) and a target level fK. The solution is
    P = K ÷ (1 + Ae^(−at)), so the time is ln(A·f ÷ (1 − f)) ÷ a. Not the worked example (a = 0.5, K = 500, A = 4, f = 0.5). */
 q10: {
  canonical: { a: 0.4, K: 800, A: 7, f: 0.75 },
  draw: R => retry(() => ({ a: R.pick([0.2, 0.3, 0.4, 0.5]), K: R.pick([200, 300, 400, 500, 600, 800]), A: R.pick([1, 3, 4, 7, 9, 19]), f: R.pick([0.5, 0.75, 0.8, 0.9]) }), p => {
   const b = p.a / p.K, P0 = p.K / (p.A + 1), L = p.f * p.K;
   if (Math.abs(b * 1e4 - Math.round(b * 1e4)) > 1e-9 || P0 !== Math.round(P0) || L <= P0 || (p.a === 0.5 && p.K === 500 && p.A === 4 && p.f === 0.5)) return false;
   const t = Math.log(p.A * p.f / (1 - p.f)) / p.a; return !tie(t, 2) && Math.abs(t - 1) > 0.005; }, { a: 0.4, K: 800, A: 7, f: 0.75 }),
  build: ({ a, K, A, f }) => { const b = a / K, P0 = K / (A + 1), L = f * K, m = A * L / (K - L), t = rd(Math.log(m) / a, 2);
   return {
   prompt: `A colony of filter-cleaning bacteria in the coolant loop, P thousand cells, grows by the logistic equation P′ = ${n(a)}P − ${n(b)}P², where t is in days, and P(0) = ${n(P0)}. Enter the carrying capacity in thousands of cells. Then enter the time, in days to 2 decimal places, when the colony first reaches ${n(L)} thousand cells.`,
   answer: [K, t],
   hints: ['Factor the right-hand side as kP(1 − P ÷ K): the carrying capacity K is the nonzero equilibrium, where kP = (k ÷ K)P².', 'The solution is P = K ÷ (1 + Ae^(−kt)) with A = (K − P(0)) ÷ P(0). Set P equal to the level and solve for t with a natural logarithm.'],
   solution: `P′ = ${n(a)}P − ${n(b)}P² = ${n(a)}P(1 − P ÷ ${n(K)}), because ${n(a)} ÷ ${n(b)} = ${n(K)}. So k = ${n(a)} and the carrying capacity is ${n(K)} thousand cells. The solution is P = ${n(K)} ÷ (1 + Ae^(−${n(a)}t)) with A = (${n(K)} − ${n(P0)}) ÷ ${n(P0)} = ${n(A)}. Setting P = ${n(L)} gives 1 + ${cf(A)}e^(−${n(a)}t) = ${n(K)} ÷ ${n(L)}, so e^(${n(a)}t) = ${n(A)} × ${n(L)} ÷ ${n(K - L)} = ${n(m)} and t = ln ${n(m)} ÷ ${n(a)} = ${n(t)} days to 2 decimal places.`,
   guidance: [
    { prompt: `Write ${n(a)}P − ${n(b)}P² as ${n(a)}P(1 − P ÷ K). What is K?`, answer: [K], explanation: `${n(a)}P × P ÷ K must equal ${n(b)}P², so K = ${n(a)} ÷ ${n(b)} = ${n(K)}.` },
    { prompt: `The solution is P = ${n(K)} ÷ (1 + Ae^(−${n(a)}t)), and at t = 0 it is ${n(K)} ÷ (1 + A) = ${n(P0)}. What is A?`, answer: [A], explanation: `1 + A = ${n(K)} ÷ ${n(P0)} = ${n(A + 1)}, so A = ${n(A)}.` },
    { prompt: `Set ${n(K)} ÷ (1 + ${cf(A)}e^(−${n(a)}t)) = ${n(L)} and solve for t. What is t, in days to 2 decimal places?`, answer: [t], explanation: `${cf(A)}e^(−${n(a)}t) = ${n(K)} ÷ ${n(L)} − 1, so e^(${n(a)}t) = ${n(m)} and t = ln ${n(m)} ÷ ${n(a)} = ${n(t)}.` }
   ] }; }
 }
});
})();
