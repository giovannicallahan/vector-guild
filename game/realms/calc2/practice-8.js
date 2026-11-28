/* Calculus 2: accumulation practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p8.js. */
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
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => k === 1 ? '' : String(k).split('').map(d => SUP[d]).join('');
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
/* A fraction num/den in lowest terms, sign on the numerator: { num, den, v }. ft() writes it: '−1/64', '3'. */
const fr = (num, den) => { const g = gcd(num, den) || 1, s = den < 0 ? -1 : 1; return { num: s * num / g, den: s * den / g, v: num / den }; };
const ft = f => f.den === 1 ? n(f.num) : `${f.num < 0 ? '−' : ''}${Math.abs(f.num)}/${f.den}`;
const r4 = x => Math.round(x * 1e4) / 1e4;
/* A value shown cut after 4 decimals, with the 5th decimal named. Exact short values are shown as they are. */
const four = x => { const a = Math.abs(x), s = x < 0 ? '−' : ''; if (Math.abs(a * 1e4 - Math.round(a * 1e4)) < 1e-7) return s + String(Math.round(a * 1e4) / 1e4);
 return `${s}${(Math.floor(a * 1e4 + 1e-9) / 1e4).toFixed(4)}… (the next decimal is ${Math.floor(a * 1e5 + 1e-9) % 10})`; };
/* True when the 5th decimal makes a 4-decimal rounding a coin toss. */
const tie = x => Math.abs(Math.abs(x * 1e4) % 1 - 0.5) < 1e-6;
const ord = m => m === 2 ? '2nd' : m === 3 ? '3rd' : `${m}th`;
/* One term of a Taylor polynomial: a fraction c times body, written as ' + body ÷ 16' or ' − 3body ÷ 256'. */
const term = (c, body) => { const a = Math.abs(c.num), core = c.den === 1 ? (a === 1 ? body : `${a}${body}`) : (a === 1 ? `${body} ÷ ${c.den}` : `${a}${body} ÷ ${c.den}`); return ` ${c.num < 0 ? '−' : '+'} ${core}`; };
/* P(x) = f(a) + c1(x − a) + c2(x − a)² + …, written out; cs holds c1, c2, … as fractions. */
const poly = (f0, cs, a) => `${ft(f0)}${cs.map((c, i) => term(c, `(x − ${n(a)})${sup(i + 1)}`)).join('')}`;
/* Values for q36b (1 ÷ √x), q36c (∛x) and q36d (x√x): exact coefficients as fractions, and the polynomial's value. */
const q36bVal = ({ a, h }) => { const sa = Math.sqrt(a), f0 = fr(1, sa), c1 = fr(-1, 2 * a * sa), f2 = fr(3, 4 * a * a * sa), c2 = fr(3, 8 * a * a * sa);
 return { sa, f0, c1, f2, c2, P: f0.v + c1.v * h + c2.v * h * h }; };
const q36cVal = ({ a }, h) => { const r = Math.round(Math.cbrt(a)); return r + h / (3 * r * r) - h * h / (9 * Math.pow(r, 5)); };
const q36dVal = ({ a, h }) => { const sa = Math.sqrt(a), f0 = fr(a * sa, 1), c1 = fr(3 * sa, 2), c2 = fr(3, 8 * sa), f3 = fr(-3, 8 * a * sa), c3 = fr(-1, 16 * a * sa);
 return { sa, f0, c1, c2, f3, c3, P: f0.v + c1.v * h + c2.v * h * h + c3.v * h * h * h }; };

/* ---- q36 Taylor polynomials [6.3] ---- */

/* 1 ÷ √x about a = 1, 4, 9, 16 or 25, degree 2: the (x − a)² coefficient as a fraction, then P at a + h. */
mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The fading beacon',
 brief: 'A beacon’s reading falls with distance in a way the chip cannot compute, so the signal desk wants a polynomial copy of it near one distance.',
 labels: ['numerator of the top coefficient', 'denominator of the top coefficient', 'P at the point (4 d.p.)'], tolerance: 0.00005,
 gl: [['numerator', 'denominator'], ['numerator', 'denominator'], ['P at the point (4 d.p.)']]
}, {
 canonical: { a: 4, h: 0.8 },
 draw: R => { let p; do { const a = R.pick([1, 4, 9, 16, 25]); p = { a, h: Math.round(a * R.pick([0.1, 0.2, 0.25, 0.3, -0.1, -0.2, -0.25]) * 1e4) / 1e4 };
  } while (tie(q36bVal(p).P)); return p; },
 build: p => { const { a, h } = p, V = q36bVal(p), x0 = a + h, A = n(a);
  return {
  prompt: `A signal beacon’s reading at a distance of x kilometres is modelled by f(x) = 1 ÷ √x. The chip stores only its Taylor polynomial of degree 2 about x = ${A}. Enter the coefficient of (x − ${A})² in that polynomial as a fraction in lowest terms: numerator, then denominator. Then enter the polynomial’s value at x = ${n(x0)}, rounded to 4 decimal places. Type the numbers without commas.`,
  answer: [V.c2.num, V.c2.den, r4(V.P)],
  hints: ['Write f(x) = x^(−1/2). Then f′(x) = −1 ÷ (2x√x) and f″(x) = 3 ÷ (4x²√x). The coefficient of (x − a)² is f″(a) ÷ 2!.', `Put x − ${A} = ${n(h)} into the polynomial, and keep every decimal until the final rounding.`],
  solution: `For f(x) = 1 ÷ √x: f′(x) = −1 ÷ (2x√x) and f″(x) = 3 ÷ (4x²√x). At x = ${A}: f(${A}) = ${ft(V.f0)}, f′(${A}) = ${ft(V.c1)}, f″(${A}) = ${ft(V.f2)}. Dividing by k! gives the coefficients, so P(x) = ${poly(V.f0, [V.c1, V.c2], a)}, and the coefficient of (x − ${A})² is ${ft(V.f2)} ÷ 2! = ${ft(V.c2)}. At x = ${n(x0)}, x − ${A} = ${n(h)}, and P(${n(x0)}) = ${four(V.P)}, which rounds to ${n(r4(V.P))}.`,
  guidance: [
   { prompt: `With f″(x) = 3 ÷ (4x²√x), what is f″(${A})? Enter it as a fraction in lowest terms: numerator, then denominator.`, answer: [V.f2.num, V.f2.den], explanation: `√${A} = ${n(V.sa)}, so f″(${A}) = 3 ÷ (4 × ${n(a * a)} × ${n(V.sa)}) = ${ft(V.f2)}.` },
   { prompt: `The coefficient of (x − ${A})² is f″(${A}) ÷ 2!. What is it, in lowest terms? Numerator, then denominator.`, answer: [V.c2.num, V.c2.den], explanation: `${ft(V.f2)} ÷ 2 = ${ft(V.c2)}.` },
   { prompt: `The polynomial is P(x) = ${poly(V.f0, [V.c1, V.c2], a)}. Put in x = ${n(x0)}. What is P(${n(x0)}), rounded to 4 decimal places?`, answer: [r4(V.P)], explanation: `With x − ${A} = ${n(h)}, P(${n(x0)}) = ${four(V.P)}, which rounds to ${n(r4(V.P))}.` }
  ] }; }
});

/* ∛x about a = 8, 27 or 64, degree 2: the polynomial's values at two tank volumes a + h1 and a + h2. */
mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Two cube tanks',
 brief: 'Two new water tanks are cubes, and the crew wants their side lengths from a chip that cannot take cube roots.',
 labels: ['side of the first tank (4 d.p.)', 'side of the second tank (4 d.p.)'], tolerance: 0.00005,
 gl: [['numerator', 'denominator'], ['numerator', 'denominator'], ['side of the first tank (4 d.p.)']]
}, {
 canonical: { a: 8, h1: 1, h2: -2 },
 draw: R => { let p; do { const a = R.pick([8, 27, 64, 125]), L = { 8: [[1, -1], [2, -2], [0.5, -1], [1, -2], [0.5, -0.5], [2, -1]], 27: [[1, -1], [2, -2], [3, -3], [1, -2], [4, -2], [2, -3]], 64: [[2, -2], [4, -4], [3, -5], [1, -1], [6, -3], [5, -2]], 125: [[5, -5], [2, -3], [10, -10], [4, -6], [1, -1]] }[a], [h1, h2] = R.pick(L);
   p = { a, h1, h2 }; } while (tie(q36cVal(p, p.h1)) || tie(q36cVal(p, p.h2))); return p; },
 build: p => { const { a, h1, h2 } = p, r = Math.round(Math.cbrt(a)), A = n(a), c1 = fr(1, 3 * r * r), c2 = fr(-1, 9 * Math.pow(r, 5)), f2 = fr(-2, 9 * Math.pow(r, 5)),
   P1 = q36cVal(p, h1), P2 = q36cVal(p, h2), v1 = a + h1, v2 = a + h2, pl = poly(fr(r, 1), [c1, c2], a);
  return {
  prompt: `A cube-shaped tank holding V cubic metres of water has sides ∛V metres long. The outpost chip cannot take cube roots, so it uses the Taylor polynomial of degree 2 of f(x) = ∛x about x = ${A}. Use that polynomial to estimate the side length of a tank holding ${n(v1)} m³, and then of one holding ${n(v2)} m³. Enter both side lengths in metres, each rounded to 4 decimal places.`,
  answer: [r4(P1), r4(P2)],
  hints: ['Write f(x) = x^(1/3). Then f′(x) = 1 ÷ (3x^(2/3)) and f″(x) = −2 ÷ (9x^(5/3)). The coefficient of (x − a)² is f″(a) ÷ 2!.', `Build the polynomial once, then put in x − ${A} = ${n(h1)} for the first tank and x − ${A} = ${n(h2)} for the second. Keep every decimal until the final rounding.`],
  solution: `For f(x) = ∛x: f′(x) = 1 ÷ (3x^(2/3)) and f″(x) = −2 ÷ (9x^(5/3)). At x = ${A}, ∛${A} = ${n(r)}, so f(${A}) = ${n(r)}, f′(${A}) = ${ft(c1)} and f″(${A}) = ${ft(f2)}. Dividing by k! gives P(x) = ${pl}. For ${n(v1)} m³, x − ${A} = ${n(h1)} and P(${n(v1)}) = ${four(P1)}, which rounds to ${n(r4(P1))} m. For ${n(v2)} m³, x − ${A} = ${n(h2)} and P(${n(v2)}) = ${four(P2)}, which rounds to ${n(r4(P2))} m.`,
  guidance: [
   { prompt: `The coefficient of (x − ${A}) is f′(${A}), and f′(x) = 1 ÷ (3x^(2/3)). Since ∛${A} = ${n(r)}, x^(2/3) = ${n(r * r)} at x = ${A}. Enter f′(${A}) as a fraction in lowest terms: numerator, then denominator.`, answer: [c1.num, c1.den], explanation: `f′(${A}) = 1 ÷ (3 × ${n(r * r)}) = ${ft(c1)}.` },
   { prompt: `The coefficient of (x − ${A})² is f″(${A}) ÷ 2!, where f″(x) = −2 ÷ (9x^(5/3)) and x^(5/3) = ${n(Math.pow(r, 5))} at x = ${A}. Enter it in lowest terms: numerator, then denominator.`, answer: [c2.num, c2.den], explanation: `f″(${A}) = −2 ÷ (9 × ${n(Math.pow(r, 5))}) = ${ft(f2)}, and dividing by 2 gives ${ft(c2)}.` },
   { prompt: `The polynomial is P(x) = ${pl}. For the first tank, put in x = ${n(v1)}. What is P(${n(v1)}), rounded to 4 decimal places?`, answer: [r4(P1)], explanation: `With x − ${A} = ${n(h1)}, P(${n(v1)}) = ${four(P1)}, which rounds to ${n(r4(P1))}.` }
  ] }; }
});

/* x√x about a = 4, 9 or 16, degree 3: the (x − a)³ coefficient as a fraction, then P at a + h. */
mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', title: 'Thruster demand to the third power',
 brief: 'A thruster’s power demand grows faster than a square root, so the compass needs a deeper polynomial copy of it.',
 labels: ['numerator of the top coefficient', 'denominator of the top coefficient', 'P at the point (4 d.p.)'], tolerance: 0.00005,
 gl: [['numerator', 'denominator'], ['numerator', 'denominator'], ['P at the point (4 d.p.)']]
}, {
 canonical: { a: 9, h: 0.9 },
 draw: R => { let p; do { const a = R.pick([4, 9, 16, 25, 36]); p = { a, h: Math.round(a * R.pick([0.1, 0.2, 0.25, 0.3, -0.1, -0.2, -0.25]) * 1e4) / 1e4 };
  } while (tie(q36dVal(p).P)); return p; },
 build: p => { const { a, h } = p, V = q36dVal(p), x0 = a + h, A = n(a), pl = poly(V.f0, [V.c1, V.c2, V.c3], a);
  return {
  prompt: `A thruster’s power demand at throttle setting x is modelled by f(x) = x√x = x^(3/2). The compass uses the Taylor polynomial of degree 3 of f about x = ${A}. Enter the coefficient of (x − ${A})³ in that polynomial as a fraction in lowest terms: numerator (with a minus sign if it is negative), then denominator. Then enter the polynomial’s value at x = ${n(x0)}, rounded to 4 decimal places. Type the numbers without commas.`,
  answer: [V.c3.num, V.c3.den, r4(V.P)],
  hints: ['Differentiate x^(3/2) three times: f′(x) = (3/2)√x, f″(x) = 3 ÷ (4√x) and f‴(x) = −3 ÷ (8x√x). The coefficient of (x − a)³ is f‴(a) ÷ 3!.', `Put x − ${A} = ${n(h)} into the polynomial, and keep every decimal until the final rounding.`],
  solution: `For f(x) = x^(3/2): f′(x) = (3/2)√x, f″(x) = 3 ÷ (4√x), f‴(x) = −3 ÷ (8x√x). At x = ${A}, √${A} = ${n(V.sa)}: f(${A}) = ${ft(V.f0)}, f′(${A}) = ${ft(V.c1)}, f″(${A}) = ${ft(fr(3, 4 * V.sa))}, f‴(${A}) = ${ft(V.f3)}. Dividing by k! gives P(x) = ${pl}, and the coefficient of (x − ${A})³ is ${ft(V.f3)} ÷ 3! = ${ft(V.c3)}. At x = ${n(x0)}, x − ${A} = ${n(h)}, and P(${n(x0)}) = ${four(V.P)}, which rounds to ${n(r4(V.P))}.`,
  guidance: [
   { prompt: `With f‴(x) = −3 ÷ (8x√x), what is f‴(${A})? Enter it as a fraction in lowest terms: numerator (with its minus sign), then denominator.`, answer: [V.f3.num, V.f3.den], explanation: `√${A} = ${n(V.sa)}, so f‴(${A}) = −3 ÷ (8 × ${n(a)} × ${n(V.sa)}) = ${ft(V.f3)}.` },
   { prompt: `The coefficient of (x − ${A})³ is f‴(${A}) ÷ 3!. What is it, in lowest terms? Numerator, then denominator.`, answer: [V.c3.num, V.c3.den], explanation: `${ft(V.f3)} ÷ 6 = ${ft(V.c3)}.` },
   { prompt: `The polynomial is P(x) = ${pl}. Put in x = ${n(x0)}. What is P(${n(x0)}), rounded to 4 decimal places?`, answer: [r4(V.P)], explanation: `With x − ${A} = ${n(h)}, P(${n(x0)}) = ${four(V.P)}, which rounds to ${n(r4(V.P))}.` }
  ] }; }
});

/* ---- q37 Maclaurin series of eˣ, sin x, cos x and 1/(1 − x) [6.3] ---- */

/* Known series of the learn mission, written with the variable u. */
const SER = { exp: 'eᵘ = 1 + u + u²/2! + u³/3! + u⁴/4! + …', sin: 'sin u = u − u³/3! + u⁵/5! − u⁷/7! + …', cos: 'cos u = 1 − u²/2! + u⁴/4! − u⁶/6! + …', geo: '1 ÷ (1 − u) = 1 + u + u² + u³ + …' };
/* Coefficient of u^m in the series of a family, as a sign (±1) and a divisor. */
const serSign = (f, m) => f === 'sin' ? (((m - 1) / 2) % 2 ? -1 : 1) : f === 'cos' ? ((m / 2) % 2 ? -1 : 1) : 1;
const serDiv = (f, m) => f === 'geo' ? 1 : fact(m);
/* Scale k as text: 'x', '−x', '3x', and the fractions x/2, −x/3, 3x/2. */
const sc = (kn, kd) => { const a = Math.abs(kn), top = a === 1 ? 'x' : `${a}x`; return `${kn < 0 ? '−' : ''}${top}${kd === 1 ? '' : `/${kd}`}`; };
const fnText = (f, kn, kd) => { const s = sc(kn, kd), ab = sc(Math.abs(kn), kd);
 return f === 'exp' ? `e^(${s})` : f === 'geo' ? `1 ÷ (1 ${kn < 0 ? '+' : '−'} ${ab})` : `${f}(${s})`; };
/* Coefficient of x^m in the series of f(kx), k = kn/kd, as a fraction. */
const coef = (f, kn, kd, m) => fr(serSign(f, m) * Math.pow(kn, m), Math.pow(kd, m) * serDiv(f, m));
const kPow = (kn, kd, m) => fr(Math.pow(kn, m), Math.pow(kd, m));
const q37cTot = ({ f, k, j, m, op }) => { const A = coef(f, k, 1, m); return fr(A.num + op * Math.pow(j, m) * A.den, A.den); };
const mOf = (R, f) => f === 'sin' ? R.pick([3, 5]) : f === 'cos' ? R.pick([2, 4]) : R.int(2, 5);

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Dimmer on the beacon lamp',
 brief: 'The beacon lamp’s dimmer follows a curve with a gentle input, and the lamp tech wants one term of its series.',
 labels: ['numerator', 'denominator'], tolerance: 0.01,
 gl: [['numerator', 'denominator'], ['numerator', 'denominator']]
}, {
 canonical: { f: 'cos', kn: 1, kd: 2, m: 4 },
 draw: R => { const f = R.pick(['exp', 'sin', 'cos', 'geo']), [kn, kd] = R.pick([[1, 2], [-1, 2], [1, 3], [-1, 3], [3, 2], [2, 3]]); return { f, kn, kd, m: mOf(R, f) }; },
 build: ({ f, kn, kd, m }) => { const C = coef(f, kn, kd, m), K = kPow(kn, kd, m), fn = fnText(f, kn, kd), s = serSign(f, m) < 0, M = sup(m), kx = sc(kn, kd), fa = f !== 'geo';
  return {
  prompt: `The beacon lamp’s brightness is set by a dimmer curve g(x) = ${fn}, where x is the knob setting. Enter the coefficient of x${M} in the Maclaurin series of g as a fraction in lowest terms: its numerator (with a minus sign if the coefficient is negative), then its denominator (1 for a whole number). Type the numbers without commas.`,
  answer: [C.num, C.den],
  hints: [`Start from the known series ${SER[f]}.`, `Put u = ${kx}. The term with u${M} becomes ${fa ? `${s ? '−' : ''}(${kx})${M} ÷ ${n(m)}!` : `(${kx})${M}`}, and (${kx})${M} = ${K.den === 1 ? par(kn) + M : `(${kn < 0 ? '−' : ''}${Math.abs(kn)}/${kd})${M}`}x${M}.`],
  solution: `The Maclaurin series ${SER[f]} holds for every u${f === 'geo' ? ' with |u| < 1' : ''}. Put u = ${kx}: the term with x${M} comes from ${fa ? `${s ? '−' : '+'}u${M} ÷ ${n(m)}!` : `u${M}`}. Here u${M} = (${kx})${M} = ${ft(K)}x${M}, so the term is ${fa ? `${s ? '−' : ''}(${ft(K)})x${M} ÷ ${n(fact(m))}` : `(${ft(K)})x${M}`}. The coefficient is ${ft(C)}${C.den === 1 ? '' : ' in lowest terms'}: numerator ${n(C.num)}, denominator ${n(C.den)}.`,
  guidance: [
   { prompt: `In g(x) = ${fn} the series variable is u = ${kx}, so u${M} = (${kx})${M}. What is (${kn < 0 ? '−' : ''}${Math.abs(kn)}${kd === 1 ? '' : `/${kd}`})${M}, as a fraction in lowest terms? Numerator, then denominator.`, answer: [K.num, K.den], explanation: `(${kn < 0 ? '−' : ''}${Math.abs(kn)}${kd === 1 ? '' : `/${kd}`})${M} = ${ft(K)}, so u${M} = ${ft(K)}x${M}.` },
   { prompt: fa ? `The u${M} term of the series is ${s ? '−' : '+'}u${M} ÷ ${n(m)}!, and ${n(m)}! = ${n(fact(m))}. So the coefficient of x${M} is ${s ? '−' : ''}(${ft(K)}) ÷ ${n(fact(m))}. Write it in lowest terms: numerator, then denominator.` : `In 1 ÷ (1 − u) every power of u has coefficient 1, so the coefficient of x${M} is just ${ft(K)}. Write it as a fraction: numerator, then denominator.`,
    answer: [C.num, C.den], explanation: fa ? `${s ? '−' : ''}(${ft(K)}) ÷ ${n(fact(m))} = ${ft(C)} in lowest terms.` : `The coefficient is ${ft(K)}.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Two sensors, one correction',
 brief: 'Two sensors disagree slightly, and the correction signal is built from their series, so the engineers want one coefficient of it.',
 labels: ['numerator', 'denominator'], tolerance: 0.01,
 gl: [['numerator', 'denominator'], ['coefficient of the second sensor'], ['numerator', 'denominator']]
}, {
 canonical: { f: 'exp', k: 2, j: 3, m: 4, op: -1 },
 draw: R => { let p; do { const f = R.pick(['exp', 'sin', 'cos']); p = { f, k: R.pick([1, 2, 3, -1, -2]), j: R.pick([1, 2, 3, -1, -2]), m: mOf(R, f), op: R.pick([1, -1]) };
  } while (q37cTot(p).num === 0 || (p.f === 'exp' && Math.abs(p.k) === 3 && p.m > 4)); return p; },
 build: p => { const { f, k, j, m, op } = p, T = q37cTot(p), A = coef(f, k, 1, m), B = Math.pow(j, m), M = sup(m), ex = f === 'geo', s1 = fnText(f, k, 1), s2 = fnText('geo', j, 1), kx = sc(k, 1), jx = sc(j, 1), sg = serSign(f, m) < 0;
  return {
  prompt: `Sensor A reads ${s1} and sensor B reads ${s2}, where x is the distance from the mast. The correction signal is the reading of A ${op > 0 ? 'plus' : 'minus'} the reading of B. Enter the coefficient of x${M} in the Maclaurin series of the correction signal as a fraction in lowest terms: numerator (with a minus sign if it is negative), then denominator. Type the numbers without commas.`,
  answer: [T.num, T.den],
  hints: [`Find the x${M} coefficient of each sensor separately, from ${SER[f]} with u = ${kx}, and from ${SER.geo} with u = ${jx}.`, `The correction is A ${op > 0 ? '+' : '−'} B, so ${op > 0 ? 'add' : 'subtract'} the two coefficients, writing both over the same denominator, and reduce.`],
  solution: `Sensor A: ${SER[f]} with u = ${kx}. The term with x${M} is ${sg ? '−' : '+'}u${M} ÷ ${n(m)}! = ${sg ? '−' : ''}${par(k)}${M}x${M} ÷ ${n(fact(m))}, so its coefficient is ${ft(A)}. Sensor B: 1 ÷ (1 − u) with u = ${jx} has coefficient ${par(j)}${M} = ${n(B)} for x${M}. The correction A ${op > 0 ? '+' : '−'} B has coefficient ${ft(A)} ${op > 0 ? '+' : '−'} ${par(B)} = ${ft(T)}.`,
  guidance: [
   { prompt: `Sensor A reads ${s1}, so u = ${kx} and its x${M} term is ${sg ? '−' : '+'}u${M} ÷ ${n(m)}!. What is its coefficient of x${M}, in lowest terms? Numerator, then denominator.`, answer: [A.num, A.den], explanation: `${sg ? '−' : ''}${par(k)}${M} ÷ ${n(fact(m))} = ${ft(A)}.` },
   { prompt: `Sensor B reads ${s2}, so u = ${jx}, and every power of u has coefficient 1 in 1 ÷ (1 − u). What is its coefficient of x${M}?`, answer: [B], explanation: `u${M} = (${jx})${M} = ${par(j)}${M}x${M}, so the coefficient is ${n(B)}.` },
   { prompt: `The correction is A ${op > 0 ? '+' : '−'} B. Combine ${ft(A)} and ${par(B)} as a fraction in lowest terms: numerator, then denominator.`, answer: [T.num, T.den], explanation: `${ft(A)} ${op > 0 ? '+' : '−'} ${par(B)} = ${ft(T)}.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'Reading the derivative off the series',
 brief: 'A calibration function’s tenth-order behaviour matters, and the quickest route is through its series rather than ten derivatives.',
 labels: ['numerator', 'denominator', 'derivative at 0'], tolerance: 0.01,
 gl: [['signed numerator before dividing'], ['numerator', 'denominator'], ['derivative at 0']]
}, {
 canonical: { f: 'cos', k: 2, m: 6 },
 draw: R => { let p; do { const f = R.pick(['exp', 'sin', 'cos']); p = { f, k: R.pick([2, 3, 4, -2, -3]), m: f === 'sin' ? R.pick([3, 5, 7]) : f === 'cos' ? R.pick([4, 6]) : R.int(3, 6) }; } while ((Math.abs(p.k) === 3 && p.m > 5) || (p.k === 4 && p.m > 5)); return p; },
 build: ({ f, k, m }) => { const D = serSign(f, m) * Math.pow(k, m), C = fr(D, fact(m)), M = sup(m), fn = fnText(f, k, 1), kx = sc(k, 1), sg = serSign(f, m) < 0;
  return {
  prompt: `A calibration curve is c(x) = ${fn}. Enter the coefficient of x${M} in its Maclaurin series as a fraction in lowest terms: numerator (with a minus sign if it is negative), then denominator. Then enter the value of the ${ord(m)} derivative of c at x = 0, which is a whole number. Type the numbers without commas.`,
  answer: [C.num, C.den, D],
  hints: [`Start from ${SER[f]} with u = ${kx}. The term with x${M} is ${sg ? '−' : '+'}u${M} ÷ ${n(m)}!.`, `A Taylor polynomial’s coefficient of x${M} is the ${ord(m)} derivative at 0 divided by ${n(m)}!, so the derivative is ${n(m)}! times that coefficient.`],
  solution: `The series ${SER[f]} with u = ${kx} gives the x${M} term ${sg ? '−' : '+'}u${M} ÷ ${n(m)}! = ${n(D)}x${M} ÷ ${n(fact(m))}, so the coefficient is ${ft(C)}${C.den === 1 ? '' : ' in lowest terms'}. A Taylor coefficient is the derivative at 0 divided by ${n(m)}!, so the ${ord(m)} derivative at 0 is ${n(fact(m))} × ${ft(C)} = ${n(D)}.`,
  guidance: [
   { prompt: `With u = ${kx}, the x${M} term is ${sg ? '−' : '+'}u${M} ÷ ${n(m)}!, and u${M} = ${par(k)}${M}x${M}. What is the numerator ${sg ? '−' : ''}${par(k)}${M}, with its sign?`, answer: [D], explanation: `${sg ? '−' : ''}${par(k)}${M} = ${n(D)}.` },
   { prompt: `The coefficient is ${n(D)} ÷ ${n(m)}! = ${n(D)} ÷ ${n(fact(m))}. Write it in lowest terms: numerator, then denominator.`, answer: [C.num, C.den], explanation: `${n(D)} ÷ ${n(fact(m))} = ${ft(C)}.` },
   { prompt: `The ${ord(m)} derivative at 0 is ${n(m)}! times the coefficient of x${M}. What is it?`, answer: [D], explanation: `${n(fact(m))} × ${ft(C)} = ${n(D)}.` }
  ] }; }
});

/* ---- q38 Taylor's remainder: how good is the estimate [6.3] ---- */

const bnd = (M, d, k) => M * Math.pow(d, k + 1) / fact(k + 1);
/* The smallest degree whose bound is below eps, or 0 when it is under 2 or the deciding bounds are within 2% of eps. */
const degOf = (M, d, eps) => { let k = 0; while (bnd(M, d, k) >= eps) k++; return k >= 2 && k <= 14 && bnd(M, d, k) < eps * 0.98 && bnd(M, d, k - 1) > eps * 1.02 ? k : 0; };
const bshow = b => b >= 1 ? `about ${n(Math.round(b * 100) / 100)}` : b >= 0.01 ? `about ${n(Math.round(b * 1e4) / 1e4)}` : `about 1 ÷ ${Math.round(1 / b)}`;
/* 'M × d^(k+1) ÷ (k+1)! = …' for the degree-k polynomial. */
const bline = (M, d, k) => `${M === 1 ? '' : `${n(M)} × `}${n(d)}${sup(k + 1)} ÷ ${n(k + 1)}! = ${M === 1 ? '' : `${n(M)} × `}${n(Math.round(Math.pow(d, k + 1) * 1e4) / 1e4)} ÷ ${n(fact(k + 1))}, ${bshow(bnd(M, d, k))}`;

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The probe’s error budget',
 brief: 'A thermal probe is read through a polynomial, and the navigators need the smallest degree that keeps its error inside the budget.',
 labels: ['smallest degree n'], tolerance: 0.01,
 gl: [['yes or no'], ['yes or no'], ['smallest degree n']]
}, {
 canonical: { M: 4, d: 1.5, eps: 0.001 },
 draw: R => { let p; do { p = { M: R.pick([2, 3, 4, 5, 6, 8, 10]), d: R.pick([0.5, 1, 1.5, 2, 2.5, 3]), eps: R.pick([0.01, 0.005, 0.001, 0.0005, 0.0001]) }; } while (!degOf(p.M, p.d, p.eps) || degOf(p.M, p.d, p.eps) < 3); return p; },
 build: ({ M, d, eps }) => { const k = degOf(M, d, eps);
  return {
  prompt: `A thermal probe’s response f(x) is read through its Taylor polynomial of degree n about a point a. Over the working range, the (n + 1)th derivative of f never exceeds M = ${n(M)} in size, and each reading is taken at a distance of ${n(d)} from a. Taylor’s theorem bounds the error by M × ${n(d)}ⁿ⁺¹ ÷ (n + 1)!. Enter the smallest degree n for which this bound is below ${n(eps)}.`,
  answer: [k],
  hints: ['Work out the bound for n = 1, 2, 3, … in turn. Each step multiplies the previous bound by the distance ÷ (n + 1), so it soon shrinks fast.', `Stop at the first degree whose bound is below ${n(eps)}; the degree before it must still give a bound of ${n(eps)} or more.`],
  solution: `The error is at most M × ${n(d)}ⁿ⁺¹ ÷ (n + 1)! with M = ${n(M)}. For n = ${n(k - 1)} the bound is ${bline(M, d, k - 1)}, which is not below ${n(eps)}. For n = ${n(k)} it is ${bline(M, d, k)}, which is. So the smallest degree is ${n(k)}.`,
  guidance: [
   { prompt: `Try n = ${n(k - 1)}: the bound is ${n(M)} × ${n(d)}${sup(k)} ÷ ${n(k)}!. Is it below ${n(eps)}? Enter 1 for yes, 0 for no.`, answer: [0], explanation: `${bline(M, d, k - 1)}, which is not below ${n(eps)}.` },
   { prompt: `Try n = ${n(k)}: the bound is ${n(M)} × ${n(d)}${sup(k + 1)} ÷ ${n(k + 1)}!. Is it below ${n(eps)}? Enter 1 for yes, 0 for no.`, answer: [1], explanation: `${bline(M, d, k)}, which is below ${n(eps)}.` },
   { prompt: 'Lower degrees give bigger bounds. What is the smallest degree n whose bound is under the budget?', answer: [k], explanation: `Degree ${n(k - 1)} is not enough and degree ${n(k)} is, so the answer is ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'One polynomial for two readings',
 brief: 'An amplifier chip will use one polynomial for a near reading and a far one, so the crew needs the degree that is safe for both.',
 labels: ['degree for the near reading', 'degree for the far reading', 'degree for both'], tolerance: 0.01,
 gl: [['degree for the near reading'], ['degree for the far reading'], ['degree for both']]
}, {
 canonical: { A: 3, x1: 1, x2: 2.5, eps: 0.001 },
 draw: R => { let p; do { p = { A: R.pick([2, 3, 5]), x1: R.pick([0.5, 1, 1.5, 2]), x2: R.pick([2, 2.5, 3]), eps: R.pick([0.01, 0.005, 0.001, 0.0001]) }; } while (!degOf(p.A, p.x1, p.eps) || !degOf(p.A, p.x2, p.eps) || degOf(p.A, p.x1, p.eps) === degOf(p.A, p.x2, p.eps) || p.x1 >= p.x2); return p; },
 build: ({ A, x1, x2, eps }) => { const k1 = degOf(A, x1, eps), k2 = degOf(A, x2, eps), K = Math.max(k1, k2);
  return {
  prompt: `The amplifier’s output is ${n(A)} sin x, with x in radians, and its chip uses the Maclaurin polynomial of sin x (its Taylor polynomial about 0) of degree n, multiplied by ${n(A)}. Here n counts the powers of x up to xⁿ, even when the xⁿ term is 0. Every derivative of ${n(A)} sin x is at most ${n(A)} in size, so Taylor’s theorem bounds the error at a reading x by ${n(A)} × |x|ⁿ⁺¹ ÷ (n + 1)!. The chip must keep this bound below ${n(eps)} at the near reading x = ${n(x1)} and at the far reading x = ${n(x2)}. Enter the smallest n for which the bound is below ${n(eps)} at the near reading, then the same for the far reading, then the smallest n that keeps the bound below ${n(eps)} at both.`,
  answer: [k1, k2, K],
  hints: ['For each reading, work out the bound for n = 1, 2, 3, … in turn, and stop at the first degree whose bound is below the limit.', 'The chip uses one polynomial for both readings, so it needs the larger of the two degrees.'],
  solution: `Near reading, x = ${n(x1)}: for n = ${n(k1 - 1)} the bound is ${bline(A, x1, k1 - 1)}, not below ${n(eps)}; for n = ${n(k1)} it is ${bline(A, x1, k1)}, which is. So n = ${n(k1)}. Far reading, x = ${n(x2)}: for n = ${n(k2 - 1)} the bound is ${bline(A, x2, k2 - 1)}, not below ${n(eps)}; for n = ${n(k2)} it is ${bline(A, x2, k2)}, which is. So n = ${n(k2)}. One polynomial must serve both readings, so the chip needs the larger degree, ${n(K)}. The true error can be smaller than the bound, but the bound is what the chip can prove.`,
  guidance: [
   { prompt: `At the near reading x = ${n(x1)} the bound is ${n(A)} × ${n(x1)}ⁿ⁺¹ ÷ (n + 1)!. What is the smallest n that makes it below ${n(eps)}?`, answer: [k1], explanation: `For n = ${n(k1 - 1)}: ${bline(A, x1, k1 - 1)}, not below. For n = ${n(k1)}: ${bline(A, x1, k1)}, below. So n = ${n(k1)}.` },
   { prompt: `At the far reading x = ${n(x2)} the bound is ${n(A)} × ${n(x2)}ⁿ⁺¹ ÷ (n + 1)!. What is the smallest n that makes it below ${n(eps)}?`, answer: [k2], explanation: `For n = ${n(k2 - 1)}: ${bline(A, x2, k2 - 1)}, not below. For n = ${n(k2)}: ${bline(A, x2, k2)}, below. So n = ${n(k2)}.` },
   { prompt: `One polynomial has to keep the bound below ${n(eps)} at both readings. What is the smallest n that does?`, answer: [K], explanation: `A degree that is safe at the far reading, ${n(k2)}, is also safe at the near one, ${n(k1)}, so the chip needs ${n(K)}.` }
  ] }; }
});

/* sin x at x: the Taylor-bound degree n, and the number of terms of the alternating series sin x = x − x³/3! + … after which the next term is below eps. */
const altOf = (x, eps) => { let k = 1; const g = j => Math.pow(x, 2 * j + 1) / fact(2 * j + 1); while (g(k) >= eps) k++; return k >= 2 && k <= 8 && g(k) < eps * 0.98 && g(k - 1) > eps * 1.02 ? k : 0; };
const gline = (x, k) => `${n(x)}${sup(2 * k + 1)} ÷ ${n(2 * k + 1)}! = ${n(Math.round(Math.pow(x, 2 * k + 1) * 1e4) / 1e4)} ÷ ${n(fact(2 * k + 1))}, ${bshow(Math.pow(x, 2 * k + 1) / fact(2 * k + 1))}`;

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q33', title: 'Two ways to bound the sine',
 brief: 'The navigator can bound the error of a sine polynomial in two ways, and wants to see whether the two agree.',
 labels: ['smallest degree n (Taylor bound)', 'number of terms (alternating bound)'], tolerance: 0.01,
 gl: [['smallest degree n'], ['yes or no'], ['number of terms']]
}, {
 canonical: { x: 1.5, eps: 0.001 },
 draw: R => { let p; do { p = { x: R.pick([0.5, 1, 1.5, 2, 2.5, 3]), eps: R.pick([0.01, 0.005, 0.001, 0.0005, 0.0001]) }; } while (!degOf(1, p.x, p.eps) || degOf(1, p.x, p.eps) < 3 || !altOf(p.x, p.eps) || (p.x === 1.5 && p.eps === 0.01)); return p; },
 build: ({ x, eps }) => { const k = degOf(1, x, eps), t = altOf(x, eps);
  return {
  prompt: `The navigator estimates sin ${n(x)} (in radians) from the series sin x = x − x³/3! + x⁵/5! − …, and wants the error below ${n(eps)}. Method 1 is Taylor’s bound ${n(x)}ⁿ⁺¹ ÷ (n + 1)! for the polynomial of degree n, the series cut after the xⁿ term (here M = 1); n counts the powers up to xⁿ, even when the xⁿ term is 0. Method 2 uses that the series alternates in sign and its terms shrink towards 0 (from the second term on, each is at most ${n(x)}² ÷ 20 = ${n(x * x / 20)} times the one before), so the error is less than the first term left out. Enter the smallest n for which method 1’s bound is below ${n(eps)}, then the smallest number of nonzero terms for which method 2’s bound is below ${n(eps)}.`,
  answer: [k, t],
  hints: [`For method 1, try n = 1, 2, 3, … and stop at the first n with ${n(x)}ⁿ⁺¹ ÷ (n + 1)! below ${n(eps)}.`, `For method 2, the terms are x, x³/3!, x⁵/5!, …. After t terms the first term left out is x to the power 2t + 1, divided by (2t + 1)!. Find the smallest t that puts it below ${n(eps)}.`],
  solution: `Method 1: for n = ${n(k - 1)} the bound is ${bline(1, x, k - 1)}, not below ${n(eps)}; for n = ${n(k)} it is ${bline(1, x, k)}, which is. So n = ${n(k)}. Method 2: with t terms, the first term left out is ${n(x)} to the power 2t + 1, divided by (2t + 1)!. For t = ${n(t - 1)} it is ${gline(x, t - 1)}, not below ${n(eps)}. For t = ${n(t)} it is ${gline(x, t)}, which is. So ${n(t)} terms are enough: the series up to x${sup(2 * t - 1)}. ${k === 2 * t ? `Sine has no x${sup(k)} term, so method 1’s polynomial up to x${sup(k)} is this same polynomial` : `That is exactly method 1’s polynomial up to x${sup(k)}`}: the two methods pick the same polynomial.`,
  guidance: [
   { prompt: `Method 1: what is the smallest n with ${n(x)}ⁿ⁺¹ ÷ (n + 1)! below ${n(eps)}?`, answer: [k], explanation: `For n = ${n(k - 1)}: ${bline(1, x, k - 1)}, not below. For n = ${n(k)}: ${bline(1, x, k)}, below. So n = ${n(k)}.` },
   { prompt: `Method 2: if the series is cut after term number ${n(t - 1)}, the first term left out is ${n(x)}${sup(2 * t - 1)} ÷ ${n(2 * t - 1)}!. Is it below ${n(eps)}? Enter 1 for yes, 0 for no.`, answer: [0], explanation: `${gline(x, t - 1)}, which is not below ${n(eps)}.` },
   { prompt: `With one more term, the first term left out is ${n(x)}${sup(2 * t + 1)} ÷ ${n(2 * t + 1)}!. What is the smallest number of terms that makes the error less than ${n(eps)}?`, answer: [t], explanation: `${gline(x, t)}, which is below ${n(eps)}, so ${n(t)} terms are enough.` }
  ] }; }
});

/* ---- q39 Integrating a series to estimate an integral [6.4] ---- */

/* Terms of the integrated series of four functions: term j is ± b^(e) ÷ D, with exponent e and divisor D. */
const iExp = (f, j) => f === 'gauss' || f === 'sinc' ? 2 * j + 1 : f === 'sinsq' ? 4 * j + 3 : 4 * j + 1;
const iDen = (f, j) => f === 'gauss' ? (2 * j + 1) * fact(j) : f === 'sinc' ? (2 * j + 1) * fact(2 * j + 1) : f === 'sinsq' ? (4 * j + 3) * fact(2 * j + 1) : (4 * j + 1) * fact(2 * j);
const iTerms = (f, b, k) => Array.from({ length: k + 1 }, (_, j) => (j % 2 ? -1 : 1) * Math.pow(b, iExp(f, j)) / iDen(f, j));
const iSum = (f, b, k) => iTerms(f, b, k).slice(0, k).reduce((s, t) => s + t, 0);
const iText = (f, b, k) => Array.from({ length: k }, (_, j) => { const e = iExp(f, j), body = e === 1 ? n(b) : `${n(b)}${sup(e)}/${n(iDen(f, j))}`; return j === 0 ? body : `${j % 2 ? '−' : '+'} ${body}`; }).join(' ');
const iFn = f => ({ gauss: 'e^(−x²)', sinc: 'sin(x) ÷ x', sinsq: 'sin(x²)', cossq: 'cos(x²)' })[f];
const iSer = { gauss: 'e^(−x²) = 1 − x² + x⁴/2! − x⁶/3! + …', sinc: 'sin(x) ÷ x = 1 − x²/3! + x⁴/5! − x⁶/7! + …', sinsq: 'sin(x²) = x² − x⁶/3! + x¹⁰/5! − …', cossq: 'cos(x²) = 1 − x⁴/2! + x⁸/4! − …' };
/* Third term of each series, the one the first guided step integrates: its power of x, its factorial text and the factorial's value. */
const iThird = { gauss: ['x⁴', '2!', 2], sinc: ['x⁴', '5!', 120], sinsq: ['x¹⁰', '5!', 120], cossq: ['x⁸', '4!', 24] };
const iStep = f => { const [xp, ft_, fv] = iThird[f], e = iExp(f, 2);
 return { prompt: `The third term of the series is ${xp}/${ft_}. Integrated from 0 to b it becomes b${sup(e)} ÷ D. What is D?`, answer: iDen(f, 2),
  explanation: `The integral of ${xp} from 0 to b is b${sup(e)} ÷ ${n(e)}, and it is still divided by ${ft_} = ${n(fv)}, so D = ${n(e)} × ${n(fv)} = ${n(iDen(f, 2))}.` }; };
const iRoot = f => f === 'sinsq' ? 'putting u = x² in sin u = u − u³/3! + u⁵/5! − …' : 'putting u = x² in cos u = 1 − u²/2! + u⁴/4! − …';
const usable = (f, b, k) => Math.abs(iTerms(f, b, k)[k - 1]) >= 5e-6;
/* True when x is within m of a step of a rounding tie at d places: adding terms rounded to 5 places could then round the other way. */
const near = (x, d, m) => Math.abs(Math.abs(x * Math.pow(10, d)) % 1 - 0.5) < m;
const r3 = x => Math.round(x * 1e3) / 1e3, f3 = x => x.toFixed(3).replace('-', '−');

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'Drift of the swaying mast',
 brief: 'A mast sensor’s drift is an integral with no tidy antiderivative, so the navigators want it from a series instead.',
 labels: ['estimate (4 d.p.)'], tolerance: 0.00005,
 gl: [['divisor D'], ['estimate (4 d.p.)']]
}, {
 canonical: { f: 'sinsq', b: 1, k: 3 },
 draw: R => { let p; do { const f = R.pick(['sinsq', 'cossq']), b = R.pick([0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2]); p = { f, b, k: R.int(3, 4) };
  } while (!usable(p.f, p.b, p.k) || near(iSum(p.f, p.b, p.k), 4, 0.15)); return p; },
 build: ({ f, b, k }) => { const T = iTerms(f, b, k), est = iSum(f, b, k), Er = r4(est), next = Math.abs(T[k]);
  return {
  prompt: `The drift of a mast sensor from time x = 0 to time x = ${n(b)} is the integral of ${iFn(f)} over that stretch, but ${iFn(f)} has no antiderivative made of the usual functions. Write ${iFn(f)} as a series by ${iRoot(f)}, integrate term by term, and add the first ${n(k)} terms of the result. Enter the estimate rounded to 4 decimal places.`,
  answer: [Er],
  hints: [`The series is ${iSer[f]}. Integrating xᵐ from 0 to b gives bᵐ⁺¹ ÷ (m + 1).`, 'Keep every decimal while you add the terms, and round only the final sum.'],
  solution: `The series is ${iSer[f]}. Integrating each term from 0 to ${n(b)} gives ${iText(f, b, k)} ${k % 2 ? '−' : '+'} …. Adding the first ${n(k)} terms with every decimal kept gives ${four(est)}, which rounds to ${n(Er)}. The integrated series alternates, so the estimate is within the first term left out, which is less than ${n(Math.max(0.0001, Math.ceil(next * 1e4) / 1e4))}, of the true value.`,
  guidance: [
   { prompt: iStep(f).prompt, answer: [iStep(f).answer], explanation: iStep(f).explanation },
   { prompt: `The integrated series is ${iText(f, b, k)} ${k % 2 ? '−' : '+'} …. Add these ${n(k)} terms. What is the estimate, rounded to 4 decimal places?`, answer: [Er], explanation: `Work out each term, keep every decimal and add them with their signs: the sum is ${four(est)}, which rounds to ${n(Er)}.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Energy through the shield panel',
 brief: 'A shield panel soaks up energy at a rate that falls off along its depth, and the crew wants the total absorbed over its first stretch.',
 labels: ['integral estimate (4 d.p.)', 'energy absorbed (3 d.p.)'], tolerance: 0.00005,
 gl: [['divisor D'], ['integral estimate (4 d.p.)'], ['energy absorbed (3 d.p.)']]
}, {
 canonical: { f: 'gauss', b: 0.8, k: 3, I: 4 },
 draw: R => { let p; do { const b = R.pick([0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]); p = { f: R.pick(['gauss', 'sinc']), b, k: b >= 0.7 ? R.int(3, 4) : 3, I: R.pick([2, 3, 4, 5]) };
  } while ((() => { const est = iSum(p.f, p.b, p.k); return !usable(p.f, p.b, p.k) || near(est, 4, 0.15) || near(p.I * est, 3, 0.1) || r3(p.I * r4(est)) !== r3(p.I * est); })()); return p; },
 build: ({ f, b, k, I }) => { const est = iSum(f, b, k), Er = r4(est), E = I * est, Ee = r3(E), fn = iFn(f);
  return {
  prompt: `A shield panel absorbs energy at the rate ${n(I)} × ${fn} kilojoules per metre of depth x. The energy absorbed over the first ${n(b)} m is ${n(I)} times the integral of ${fn} from x = 0 to x = ${n(b)}, and ${fn} has no antiderivative made of the usual functions. Replace ${fn} by its Maclaurin series, integrate term by term, and add the first ${n(k)} terms of the result. Enter that estimate of the integral, rounded to 4 decimal places, then the energy absorbed in kilojoules, rounded to 3 decimal places.`,
  answer: [Er, Ee],
  hints: [`The series is ${iSer[f]}. Integrating xᵐ from 0 to b gives bᵐ⁺¹ ÷ (m + 1).`, `Multiply the sum of the terms by ${n(I)}, and round only at the end.`],
  solution: `The series is ${iSer[f]}. Integrating each term from 0 to ${n(b)} gives ${iText(f, b, k)} ${k % 2 ? '−' : '+'} …. Adding the first ${n(k)} terms with every decimal kept gives ${four(est)}, which rounds to ${n(Er)}. The energy is ${n(I)} times the integral: ${n(I)} × ${four(est)} is about ${n(E)}, which rounds to ${f3(Ee)} kJ.`,
  guidance: [
   { prompt: iStep(f).prompt, answer: [iStep(f).answer], explanation: iStep(f).explanation },
   { prompt: `The integrated series is ${iText(f, b, k)} ${k % 2 ? '−' : '+'} …. Add these ${n(k)} terms. What is the estimate of the integral, rounded to 4 decimal places?`, answer: [Er], explanation: `Work out each term, keep every decimal and add them with their signs: the sum is ${four(est)}, which rounds to ${n(Er)}.` },
   { prompt: `The energy is ${n(I)} times the integral. What is the energy in kilojoules, rounded to 3 decimal places?`, answer: [Ee], explanation: `${n(I)} × ${four(est)} is about ${n(E)}, which rounds to ${f3(Ee)}.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q03', title: 'The mean of an unsolvable curve',
 brief: 'The navigator wants the average level of a signal curve whose integral has no tidy formula, so the series has to do the averaging too.',
 labels: ['integral estimate (4 d.p.)', 'average value (3 d.p.)'], tolerance: 0.00005,
 gl: [['divisor D'], ['integral estimate (4 d.p.)'], ['average value (3 d.p.)']]
}, {
 canonical: { f: 'cossq', b: 0.8, k: 3 },
 draw: R => { let p; do { const b = R.pick([0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]); p = { f: R.pick(['gauss', 'sinc', 'sinsq', 'cossq']), b, k: b >= 0.7 ? R.int(3, 4) : 3 };
  } while ((() => { const est = iSum(p.f, p.b, p.k); return !usable(p.f, p.b, p.k) || near(est, 4, 0.15) || near(est / p.b, 3, 0.1) || r3(r4(est) / p.b) !== r3(est / p.b); })()); return p; },
 build: ({ f, b, k }) => { const est = iSum(f, b, k), Er = r4(est), av = est / b, Ar = r3(av), fn = iFn(f);
  return {
  prompt: `A navigation signal follows the curve ${fn} for x from 0 to ${n(b)}, and ${fn} has no antiderivative made of the usual functions. The average value of a function on an interval is its integral divided by the length of the interval. Replace ${fn} by its Maclaurin series, integrate term by term, and add the first ${n(k)} terms to estimate the integral from x = 0 to x = ${n(b)}. Then use that estimate to find the average value of ${fn} on that interval. Enter the integral estimate, rounded to 4 decimal places, then the average value, rounded to 3 decimal places.`,
  answer: [Er, Ar],
  hints: [`The series is ${iSer[f]}. Integrating xᵐ from 0 to b gives bᵐ⁺¹ ÷ (m + 1).`, `The interval has length ${n(b)}, so the average is the sum of the terms divided by ${n(b)}. Round only at the end.`],
  solution: `The series is ${iSer[f]}. Integrating each term from 0 to ${n(b)} gives ${iText(f, b, k)} ${k % 2 ? '−' : '+'} …. Adding the first ${n(k)} terms with every decimal kept gives ${four(est)}, which rounds to ${n(Er)}. The average value is the integral divided by the length ${n(b)}: ${four(est)} ÷ ${n(b)} is about ${n(av)}, which rounds to ${f3(Ar)}.`,
  guidance: [
   { prompt: iStep(f).prompt, answer: [iStep(f).answer], explanation: iStep(f).explanation },
   { prompt: `The integrated series is ${iText(f, b, k)} ${k % 2 ? '−' : '+'} …. Add these ${n(k)} terms. What is the estimate of the integral, rounded to 4 decimal places?`, answer: [Er], explanation: `Work out each term, keep every decimal and add them with their signs: the sum is ${four(est)}, which rounds to ${n(Er)}.` },
   { prompt: `The average value is the integral divided by the interval length ${n(b)}. What is it, rounded to 3 decimal places?`, answer: [Ar], explanation: `${four(est)} ÷ ${n(b)} is about ${n(av)}, which rounds to ${f3(Ar)}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Calculus 3: a path given by x(t) and y(t) [7.1, 7.2] ---- */

/* The family x = 3ms·2... : x = 3ms·t²·… written out. With s the crossing time and m a scale, dx/dt = 6ms·t, dy/dt = 3m(t² − s²), speed = 3m(t² + s²). */
const fX = (s, m, p) => `${n(3 * m * s)}t²${p ? ` ${p < 0 ? '−' : '+'} ${n(Math.abs(p))}` : ''}`;
const fY = (s, m, q) => `${m === 1 ? '' : n(m)}t³ − ${n(3 * m * s * s)}t${q ? ` ${q < 0 ? '−' : '+'} ${n(Math.abs(q))}` : ''}`;
const sl = (s, t0) => (t0 * t0 - s * s) / (2 * s * t0);
const fLen = (s, m, t1, t2) => m * (Math.pow(t2, 3) - Math.pow(t1, 3)) + 3 * m * s * s * (t2 - t1);

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The ridge cable car',
 brief: 'A cable car swings out over the ridge on a curved line, and the rescue crew needs its steepness at one moment and the cable it will pay out.',
 labels: ['slope dy/dx', 'length (m)'], tolerance: 0.0005,
 gl: [['dx/dt', 'dy/dt'], ['slope dy/dx'], ['speed (m/s)'], ['length (m)']]
}, {
 canonical: { m: 1, p: -3, q: 2, t0: 4, t1: 0, t2: 3 },
 draw: R => { const t1 = R.int(0, 1); return { m: R.pick([1, 2]), p: R.int(-5, 5), q: R.int(-5, 5), t0: R.pick([1, 4, 5]), t1, t2: R.int(t1 + 2, 4) }; },
 build: P => { const { m, p, q, t0, t1, t2 } = P, s = 2, dx = 6 * m * s * t0, dy = 3 * m * (t0 * t0 - s * s), slope = dy / dx, speed = 3 * m * (t0 * t0 + s * s), k = 3 * m, L = fLen(s, m, t1, t2),
   anti = m === 1 ? 't³ + 12t' : `${n(m)}t³ + ${n(12 * m)}t`, F = t => m * Math.pow(t, 3) + 12 * m * t, sq = 9 * m * m;
  return {
  prompt: `A rescue cable car leaves the ridge station on a curved line given by two functions of time: x(t) = ${fX(s, m, p)} and y(t) = ${fY(s, m, q)}, in metres, t seconds after it sets off. Enter the slope dy/dx of its path at t = ${n(t0)}, then the length of the path in metres from t = ${n(t1)} to t = ${n(t2)}.`,
  answer: [slope, L],
  hints: ['The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt): how fast y changes divided by how fast x changes.', `The length is the integral of √((dx/dt)² + (dy/dt)²) dt. Here (dx/dt)² + (dy/dt)² works out to ${n(sq)}(t² + 4)², a perfect square.`],
  solution: `dx/dt = ${n(12 * m)}t and dy/dt = ${n(3 * m)}t² − ${n(12 * m)}. At t = ${n(t0)}: dx/dt = ${n(dx)} and dy/dt = ${n(dy)}, so dy/dx = ${n(dy)} ÷ ${n(dx)} = ${n(slope)}. For the length, (${n(12 * m)}t)² + (${n(3 * m)}t² − ${n(12 * m)})² = ${n(sq)}(t⁴ + 8t² + 16) = ${n(sq)}(t² + 4)², so the speed is √(…) = ${n(k)}(t² + 4) = ${n(k)}t² + ${n(12 * m)}. Its integral from ${n(t1)} to ${n(t2)} is [${anti}] from ${n(t1)} to ${n(t2)} = ${n(F(t2))} − ${n(F(t1))} = ${n(L)} metres.`,
  guidance: [
   { prompt: `dx/dt = ${n(12 * m)}t and dy/dt = ${n(3 * m)}t² − ${n(12 * m)}. What are they at t = ${n(t0)}?`, answer: [dx, dy], explanation: `dx/dt = ${n(12 * m)} × ${n(t0)} = ${n(dx)} and dy/dt = ${n(3 * m)} × ${n(t0 * t0)} − ${n(12 * m)} = ${n(dy)}.` },
   { prompt: `The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt). What is it at t = ${n(t0)}?`, answer: [slope], explanation: `${n(dy)} ÷ ${n(dx)} = ${n(slope)}.` },
   { prompt: `The speed along the path is √((dx/dt)² + (dy/dt)²). What is it at t = ${n(t0)}?`, answer: [speed], explanation: `√(${n(dx)}² + ${par(dy)}²) = √${n(dx * dx + dy * dy)} = ${n(speed)}, which matches ${n(k)}(t² + 4) at t = ${n(t0)}.` },
   { prompt: `The speed is ${n(k)}(t² + 4) = ${n(k)}t² + ${n(12 * m)} at every time. Integrate it from t = ${n(t1)} to t = ${n(t2)}. What is the length of the path?`, answer: [L], explanation: `An antiderivative is ${anti}, so the length is ${n(F(t2))} − ${n(F(t1))} = ${n(L)} metres.` }
  ] }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Rover on the switchback',
 brief: 'A rover climbs a switchback road, and the drive team wants its speed at one moment, the distance it covers, and its average speed.',
 labels: ['speed at that time (m/min)', 'distance (m)', 'average speed (m/min)'], tolerance: 0.01,
 gl: [['speed (m/min)'], ['distance (m)'], ['average speed (m/min)']]
}, {
 canonical: { s: 1, m: 2, p: 4, q: -1, t0: 3, t1: 1, t2: 4 },
 draw: R => { const t1 = R.int(0, 2); return { s: R.pick([1, 2]), m: R.pick([1, 2]), p: R.int(-5, 5), q: R.int(-5, 5), t0: R.int(1, 4), t1, t2: R.int(t1 + 2, 5) }; },
 build: P => { const { s, m, p, q, t0, t1, t2 } = P, speed = 3 * m * (t0 * t0 + s * s), L = fLen(s, m, t1, t2), avg = L / (t2 - t1), k = 3 * m, ss = s * s, dxc = 6 * m * s, dyc = 3 * m,
   anti = `${m === 1 ? '' : n(m)}t³ + ${n(3 * m * ss)}t`, F = t => m * Math.pow(t, 3) + 3 * m * ss * t, sq = 9 * m * m;
  return {
  prompt: `A rover drives a switchback road. Its position t minutes after setting off is x(t) = ${fX(s, m, p)} and y(t) = ${fY(s, m, q)}, in metres. Enter its speed in metres per minute at t = ${n(t0)}, then the distance it travels from t = ${n(t1)} to t = ${n(t2)}, then its average speed over that stretch, which is the distance divided by the time taken.`,
  answer: [speed, L, avg],
  hints: [`The speed at a moment is √((dx/dt)² + (dy/dt)²). Here (dx/dt)² + (dy/dt)² works out to ${n(sq)}(t² + ${n(ss)})², a perfect square.`, 'The distance is the integral of the speed over the time stretch. The average speed is that distance divided by the length of the stretch.'],
  solution: `dx/dt = ${n(dxc)}t and dy/dt = ${n(dyc)}t² − ${n(dyc * ss)}. Then (dx/dt)² + (dy/dt)² = ${n(sq)}(t⁴ + ${n(2 * ss)}t² + ${n(ss * ss)}) = ${n(sq)}(t² + ${n(ss)})², so the speed is ${n(k)}(t² + ${n(ss)}). At t = ${n(t0)} it is ${n(k)} × ${n(t0 * t0 + ss)} = ${n(speed)} m/min. The distance is the integral of ${n(k)}t² + ${n(k * ss)} from ${n(t1)} to ${n(t2)}: [${anti}] gives ${n(F(t2))} − ${n(F(t1))} = ${n(L)} m. The stretch lasts ${n(t2)} − ${n(t1)} = ${n(t2 - t1)} minutes, so the average speed is ${n(L)} ÷ ${n(t2 - t1)} = ${n(avg)} m/min.`,
  guidance: [
   { prompt: `dx/dt = ${n(dxc)}t and dy/dt = ${n(dyc)}t² − ${n(dyc * ss)}. Their squares add to ${n(sq)}(t² + ${n(ss)})², so the speed is ${n(k)}(t² + ${n(ss)}). What is it at t = ${n(t0)}?`, answer: [speed], explanation: `${n(k)} × (${n(t0 * t0)} + ${n(ss)}) = ${n(speed)} metres per minute.` },
   { prompt: `The distance is the integral of the speed ${n(k)}t² + ${n(k * ss)} from t = ${n(t1)} to t = ${n(t2)}. What is it?`, answer: [L], explanation: `An antiderivative is ${anti}, so the distance is ${n(F(t2))} − ${n(F(t1))} = ${n(L)} metres.` },
   { prompt: `The stretch from t = ${n(t1)} to t = ${n(t2)} takes ${n(t2 - t1)} minutes. What is the average speed, the distance divided by the time?`, answer: [avg], explanation: `${n(L)} ÷ ${n(t2 - t1)} = ${n(avg)} metres per minute.` }
  ] }; }
});

/* x = A t² + p, y = B t³ + q with A = 3P ÷ 2: speed = 3t√(P² + B²t²), length from 0 to T = (K³ − P³) ÷ B², K² = P² + B²T². */
const Q40 = [
 { A: 6, B: 1, T: 3, t0: [1, 2, 3] }, { A: 9, B: 1, T: 8, t0: [3, 6] }, { A: 12, B: 1, T: 6, t0: [2, 4, 6] },
 { A: 18, B: 1, T: 5, t0: [3] }, { A: 9, B: 2, T: 4, t0: [3] }, { A: 12, B: 2, T: 3, t0: [1, 2, 3] }
];
const q40dVal = ({ A, B, T, t0 }) => { const P = 2 * A / 3, K = Math.round(Math.sqrt(P * P + B * B * T * T)), L = (Math.pow(K, 3) - Math.pow(P, 3)) / (B * B);
 return { A, B, T, P, K, L, dx: 2 * A * t0, dy: 3 * B * t0 * t0, slope: 3 * B * t0 / (2 * A) }; };

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q04', title: 'The balloon with no tidy speed',
 brief: 'A survey balloon’s path has a speed that is not a clean polynomial, so its length needs a substitution before it can be integrated.',
 labels: ['slope dy/dx', 'length (m)'], tolerance: 0.0005,
 gl: [['dx/dt', 'dy/dt'], ['slope dy/dx'], ['u at t = 0', 'u at the end time'], ['length (m)']]
}, {
 canonical: { A: 6, B: 1, T: 3, t0: 2, p: 1, q: -2 },
 /* The parameters carry the coefficients A and B and the end time T themselves, so the oracle reads them from the draw. */
 draw: R => { const { A, B, T, t0 } = R.pick(Q40); return { A, B, T, t0: R.pick(t0), p: R.int(-5, 5), q: R.int(-5, 5) }; },
 build: P => { const { p, q, t0 } = P, V = q40dVal(P), { A, B, T, P: PP, K, L, dx, dy, slope } = V, Bs = B === 1 ? '' : n(B * B),
   X = `${n(A)}t²${p ? ` ${p < 0 ? '−' : '+'} ${n(Math.abs(p))}` : ''}`, Y = `${B === 1 ? '' : n(B)}t³${q ? ` ${q < 0 ? '−' : '+'} ${n(Math.abs(q))}` : ''}`, u = `${n(PP * PP)} + ${Bs}t²`;
  return {
  prompt: `A survey balloon drifts along a path given by two functions of time: x(t) = ${X} and y(t) = ${Y}, in metres, t minutes after release. Enter the slope dy/dx of its path at t = ${n(t0)}, then the length of the path in metres from t = 0 to t = ${n(T)}.`,
  answer: [slope, L],
  hints: ['The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt). For the length, integrate the speed √((dx/dt)² + (dy/dt)²) from the start time to the end time.', `Here (dx/dt)² + (dy/dt)² = ${n(4 * A * A)}t² + ${n(9 * B * B)}t⁴ = 9t²(${u}), so the speed is 3t√(${u}). Substitute u = ${u}, and remember to change the limits.`],
  solution: `dx/dt = ${n(2 * A)}t and dy/dt = ${n(3 * B)}t². At t = ${n(t0)}: dx/dt = ${n(dx)} and dy/dt = ${n(dy)}, so dy/dx = ${n(dy)} ÷ ${n(dx)} = ${n(slope)}. For the length, (dx/dt)² + (dy/dt)² = ${n(4 * A * A)}t² + ${n(9 * B * B)}t⁴ = 9t²(${u}), so the speed is 3t√(${u}). Put u = ${u}, so du = ${n(2 * B * B)}t dt and 3t dt = ${B === 1 ? '3 ÷ 2' : `3 ÷ ${n(2 * B * B)}`} du. At t = 0, u = ${n(PP * PP)}; at t = ${n(T)}, u = ${n(K * K)}. The length is ${B === 1 ? '(3 ÷ 2)' : `(3 ÷ ${n(2 * B * B)})`} times the integral of √u du from ${n(PP * PP)} to ${n(K * K)}, which works out to [u^(3/2)${B === 1 ? '' : ` ÷ ${n(B * B)}`}] between those limits: (${n(K)}³ − ${n(PP)}³)${B === 1 ? '' : ` ÷ ${n(B * B)}`} = (${n(Math.pow(K, 3))} − ${n(Math.pow(PP, 3))})${B === 1 ? '' : ` ÷ ${n(B * B)}`} = ${n(L)} metres.`,
  guidance: [
   { prompt: `dx/dt = ${n(2 * A)}t and dy/dt = ${n(3 * B)}t². What are they at t = ${n(t0)}?`, answer: [dx, dy], explanation: `dx/dt = ${n(2 * A)} × ${n(t0)} = ${n(dx)} and dy/dt = ${n(3 * B)} × ${n(t0 * t0)} = ${n(dy)}.` },
   { prompt: `The slope of the path is dy/dx = (dy/dt) ÷ (dx/dt). What is it at t = ${n(t0)}?`, answer: [slope], explanation: `${n(dy)} ÷ ${n(dx)} = ${n(slope)}.` },
   { prompt: `The speed is 3t√(${u}). With u = ${u}, what is u at t = 0 and at t = ${n(T)}?`, answer: [PP * PP, K * K], explanation: `At t = 0, u = ${n(PP * PP)}. At t = ${n(T)}, u = ${n(PP * PP)} + ${n(B * B * T * T)} = ${n(K * K)}.` },
   { prompt: `With u = ${u}, the length is [u^(3/2)${B === 1 ? '' : ` ÷ ${n(B * B)}`}] from u = ${n(PP * PP)} to u = ${n(K * K)}. Since √${n(PP * PP)} = ${n(PP)} and √${n(K * K)} = ${n(K)}, what is the length in metres?`, answer: [L], explanation: `(${n(K)}³ − ${n(PP)}³)${B === 1 ? '' : ` ÷ ${n(B * B)}`} = (${n(Math.pow(K, 3))} − ${n(Math.pow(PP, 3))})${B === 1 ? '' : ` ÷ ${n(B * B)}`} = ${n(L)} metres.` }
  ] }; }
});

})();
