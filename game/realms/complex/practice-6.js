/* Complex analysis: the plane of numbers practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p6.js. */
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
const SUP = { 1: '¹', 2: '²', 3: '³', 4: '⁴' };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
const gcd = (p, q) => q ? gcd(q, p % q) : Math.abs(p);
const sg = x => (x < 0 ? '− ' : '+ ') + n(Math.abs(x));
/* Bounded retry: at most 1000 tries of f(), then the canonical parameters. */
const tries = (f, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = f(); if (ok(p)) return p; } return canon; };
/* A complex number with whole or decimal parts as text: cx(3, −2) is '3 − 2i', cx(0, 1) is 'i', cx(−4, 0) is '−4'. */
const cx = (re, im) => { if (im === 0) return n(re); const body = (Math.abs(im) === 1 ? '' : n(Math.abs(im))) + 'i';
 if (re === 0) return (im < 0 ? '−' : '') + body; return `${n(re)} ${im < 0 ? '−' : '+'} ${body}`; };
/* z − a for a real a: 'z − 3', 'z + 2', or 'z' when a is 0; zp puts it in brackets for dividing by or raising to a power. */
const zm = a => a === 0 ? 'z' : a > 0 ? `z − ${n(a)}` : `z + ${n(-a)}`;
const zp = a => a === 0 ? 'z' : `(${zm(a)})`;
const circ = (c, r) => `|${zm(c)}| = ${n(r)}`;
/* A polynomial from its coefficients, highest power first: poly([2, −3, 5], 'z') is '2z² − 3z + 5'. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const p = deg - i; if (c === 0) return; const a = Math.abs(c), body = p === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (p > 1 ? SUP[p] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Terms [coefficient, letters] as a sum: terms([[1, 'x²'], [−1, 'y²'], [3, 'xy']]) is 'x² − y² + 3xy'. */
const terms = list => { let out = ''; for (const [c, v] of list) { if (c === 0) continue; const a = Math.abs(c), body = v ? (a === 1 ? '' : n(a)) + v : n(a);
 out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; } return out || '0'; };
/* Signed sum of numbers as worked, zeros left out: sum([8, −6, 5]) is '8 − 6 + 5'; eq adds '= value'. */
const sum = list => { const l = list.filter(v => v !== 0); return l.length ? l.map((v, i) => i ? (v < 0 ? ' − ' : ' + ') + n(Math.abs(v)) : n(v)).join('') : '0'; };
const eq = (list, v) => { const t = sum(list); return t === n(v) ? t : `${t} = ${n(v)}`; };
const kpi = k => k === 0 ? '0' : `${n(k)}πi`;
/* The derivative symbol: f′, f′′, f⁽³⁾. */
const der = (k, f = 'f') => k === 1 ? f + '′' : k === 2 ? f + '′′' : f + '⁽' + SUP[k] + '⁾';
/* A ceiling M (between lo and hi) whose Cauchy bound k! M ÷ Rᵏ is a whole number: M is a multiple of Rᵏ ÷ gcd(Rᵏ, k!). 0 if none. */
const boundM = (R, k, lo, hi, pick) => { const Rk = Math.pow(R, k), unit = Rk / gcd(Rk, fact(k)), tlo = Math.ceil(lo / unit), thi = Math.floor(hi / unit);
 return thi >= tlo ? unit * pick(tlo, thi) : 0; };
const bnd = (k, R, M) => fact(k) * M / Math.pow(R, k);
const r2 = x => Math.round(x * 100) / 100;
const noTie = x => Math.abs(x * 100 - Math.floor(x * 100) - 0.5) > 1e-6;
const two = x => Math.abs(Math.round(x * 100) - x * 100) < 1e-7;

/* ---- q26 Cauchy's inequality and Liouville's theorem [5.5] ---- */

/* q26b: s is only an index into these claims; each is [text, 1 if true, why]. */
const CLAIMS_B = [
 ['If f is an entire function and |f(z)| ≤ 2 at every point of the plane, then f takes the same value at z = 1 and at z = 100.', 1, 'By Liouville’s theorem a bounded entire function is constant, so f takes the same value everywhere. The claim is true (1).'],
 ['The entire function 2z + 5 is bounded: one number M has |2z + 5| ≤ M at every point z of the plane.', 0, '2z + 5 is entire but not constant, so by Liouville’s theorem it cannot be bounded: at z = 1000 it is already 2005. The claim is false (0).'],
 ['An entire function f with |f(z)| ≤ 10 at every point of the plane has f′(4) = 0.', 1, 'By Liouville’s theorem f is constant, so its derivative is 0 at every point, including 4. The claim is true (1).'],
 ['Some entire function that is not constant has |f(z)| ≤ 1 at every point of the plane.', 0, 'A bounded entire function is constant by Liouville’s theorem, so none that is not constant can be bounded. The claim is false (0).'],
 ['If f is entire and |f(z)| ≤ 5 at every point of the plane, then f(z) = f(0) at every point z.', 1, 'By Liouville’s theorem f is constant, so it equals its value at 0 everywhere. The claim is true (1).']
];

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The hull vibration probe',
 brief: 'A probe on the hull model gives only a ceiling on its signal, and the crew wants to know how fast that signal can change.',
 labels: ['bound', 'true (1) or false (0)'], tolerance: 0.01, gl: [['Rⁿ'], ['bound'], ['true (1) or false (0)']]
}, {
 /* s is only an index into CLAIMS_B. M gives a whole-number bound. Never the worked example (n = 1, R = 4, M = 20). */
 canonical: { k: 3, R: 2, M: 44, c: -1, s: 1 },
 draw: R => tries(() => { const k = R.int(1, 3), r = R.int(2, 5); return { k, R: r, M: boundM(r, k, 10, 400, (a, b) => R.int(a, b)), c: R.int(-4, 4), s: R.int(0, 4) }; },
  p => p.M > 0 && !(p.k === 1 && p.R === 4 && p.M === 20), { k: 3, R: 2, M: 44, c: -1, s: 1 }),
 build: ({ k, R, M, c, s }) => { const Rk = Math.pow(R, k), bound = bnd(k, R, M), [claim, truth, why] = CLAIMS_B[s]; return {
  prompt: `A vibration probe on the hull model reads a signal f that is analytic on and inside the circle ${circ(c, R)}, and on that circle |f(z)| is never more than ${n(M)}. Enter the largest value Cauchy’s inequality allows for |${der(k)}(${n(c)})|. Then judge a technician’s claim: “${claim}” Enter 1 if it is true, 0 if it is false.`,
  answer: [bound, truth],
  hints: ['Read n from the number of primes on f (f′ is the first derivative, f′′ the second, f⁽³⁾ the third), M from the ceiling and R from the radius of the circle, not its diameter. The bound is n! M ÷ Rⁿ.',
   'Liouville’s theorem: an entire function (analytic at every point of the plane) that is bounded is constant. A function that is not constant, such as a polynomial of degree 1 or more, is not bounded.'],
  solution: `Here n = ${n(k)}, M = ${n(M)} and R = ${n(R)}, so the bound is ${n(k)}! × ${n(M)} ÷ ${n(R)}${SUP[k]} = ${n(fact(k))} × ${n(M)} ÷ ${n(Rk)} = ${n(bound)}. ${why}`,
  guidance: [
   { prompt: `The derivative asked for is ${der(k)}, so n = ${n(k)}. The radius is ${n(R)}. What is Rⁿ?`, answer: [Rk], explanation: `${n(R)}${SUP[k]} = ${n(Rk)}.` },
   { prompt: `What is the bound n! M ÷ Rⁿ = ${n(fact(k))} × ${n(M)} ÷ ${n(Rk)}?`, answer: [bound], explanation: `${n(fact(k))} × ${n(M)} = ${n(fact(k) * M)}, and ${n(fact(k) * M)} ÷ ${n(Rk)} = ${n(bound)}.` },
   { prompt: `“${claim}” Enter 1 if it is true, 0 if it is false.`, answer: [truth], explanation: why }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Two test circles',
 brief: 'Two probe runs on the same signal give two ceilings, and the lab wants the tightest limit on its slope that both runs prove.',
 labels: ['bound from the first circle', 'bound from the second circle', 'best bound'], tolerance: 0.01, gl: [['bound from the first circle'], ['bound from the second circle'], ['best bound']]
}, {
 /* A bigger circle round the same centre; each ceiling gives a whole-number bound; the two bounds differ. Never the worked example (n = 1, R = 4, M = 20). */
 canonical: { e: 1, c: 1, R1: 2, M1: 30, R2: 5, M2: 60 },
 draw: R => tries(() => { const e = R.int(1, 2), R1 = R.int(2, 3), R2 = R1 + R.int(1, 2); return { e, c: R.int(-3, 3), R1, M1: boundM(R1, e, 10, 300, (a, b) => R.int(a, b)), R2, M2: boundM(R2, e, 10, 300, (a, b) => R.int(a, b)) }; },
  p => p.M1 > 0 && p.M2 > 0 && bnd(p.e, p.R1, p.M1) !== bnd(p.e, p.R2, p.M2) && !(p.e === 1 && ((p.R1 === 4 && p.M1 === 20) || (p.R2 === 4 && p.M2 === 20))), { e: 1, c: 1, R1: 2, M1: 30, R2: 5, M2: 60 }),
 build: ({ e, c, R1, M1, R2, M2 }) => { const b1 = bnd(e, R1, M1), b2 = bnd(e, R2, M2), best = Math.min(b1, b2), f = `${der(e)}(${n(c)})`, W = e === 1 ? 'first' : 'second'; return {
  prompt: `The field lab has a signal f that is analytic on and inside the circle ${circ(c, R2)}. Two probe runs gave two true readings: on the circle ${circ(c, R1)}, |f(z)| is never more than ${n(M1)}; on the circle ${circ(c, R2)}, |f(z)| is never more than ${n(M2)}. Cauchy’s inequality can be used with either circle. Enter the largest value it allows for |${f}| using the first circle, then using the second circle. Then enter the best bound the two readings give together.`,
  answer: [b1, b2, best],
  hints: ['For each circle use its own radius and its own ceiling in n! M ÷ Rⁿ, where n is the order of the derivative (the first derivative has n = 1, the second n = 2). A bigger ceiling raises the bound and a bigger radius lowers it.',
   'Both readings are true, so the derivative’s size must be below both bounds at the same time. The best statement is the smaller of the two bounds.'],
  solution: `The ${W} derivative has n = ${n(e)}. First circle: ${n(e)}! × ${n(M1)} ÷ ${n(R1)}${SUP[e]} = ${n(fact(e) * M1)} ÷ ${n(Math.pow(R1, e))} = ${n(b1)}. Second circle: ${n(e)}! × ${n(M2)} ÷ ${n(R2)}${SUP[e]} = ${n(fact(e) * M2)} ÷ ${n(Math.pow(R2, e))} = ${n(b2)}. Both bounds hold, so the best one is the smaller: ${n(best)}.`,
  guidance: [
   { prompt: `With the first circle, n = ${n(e)}, M = ${n(M1)} and R = ${n(R1)}. What is n! M ÷ Rⁿ?`, answer: [b1], explanation: `${n(fact(e) * M1)} ÷ ${n(Math.pow(R1, e))} = ${n(b1)}.` },
   { prompt: `With the second circle, n = ${n(e)}, M = ${n(M2)} and R = ${n(R2)}. What is n! M ÷ Rⁿ?`, answer: [b2], explanation: `${n(fact(e) * M2)} ÷ ${n(Math.pow(R2, e))} = ${n(b2)}.` },
   { prompt: `The two bounds are ${n(b1)} and ${n(b2)}, and both are true. What is the best (tightest) bound?`, answer: [best], explanation: `The derivative’s size is at most both numbers, so it is at most the smaller one: ${n(best)}.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q25', title: 'The sealed drum',
 brief: 'A sealed drum can only be read by a gauge round its rim, and the lab needs the slope inside and the smallest ceiling that fits the reading.',
 labels: ['size of the derivative', 'smallest ceiling M'], tolerance: 0.01, gl: [['size of the derivative'], ['smallest ceiling M']]
}, {
 /* The gauge reads kπi = 2πi f⁽ʲ⁾(a) ÷ j!, so |f⁽ʲ⁾(a)| = |k| j! ÷ 2, and the least M with |f⁽ʲ⁾(a)| ≤ j! M ÷ Rʲ is |k| Rʲ ÷ 2 (k even, so whole). */
 canonical: { j: 2, a: -1, R: 3, k: -6 },
 draw: R => ({ j: R.int(2, 3), a: R.int(-3, 3), R: R.int(2, 4), k: 2 * R.nz(-6, 6) }),
 build: ({ j, a, R, k }) => { const val = k * fact(j) / 2, av = Math.abs(val), Rj = Math.pow(R, j), M = Math.abs(k) / 2 * Rj, fj = `${der(j)}(${n(a)})`; return {
  prompt: `A sealed drum hides a signal f that is analytic on and inside the circle ${circ(a, R)}. A gauge that goes once anticlockwise round that circle reads ∮ f(z) ÷ ${zp(a)}${SUP[j + 1]} dz = ${kpi(k)}. The formula for derivatives says that this integral equals 2πi ${fj} ÷ ${n(j)}!. Enter |${fj}|, then the smallest ceiling M for |f(z)| on the circle that Cauchy’s inequality |${fj}| ≤ ${n(j)}! M ÷ ${n(R)}${SUP[j]} allows.`,
  answer: [av, M],
  hints: ['The gauge reading kπi is 2πi f⁽ⁿ⁾(a) ÷ n!, with n the order of the derivative, so k = 2 f⁽ⁿ⁾(a) ÷ n!. Solve for f⁽ⁿ⁾(a), then take its size, which is never negative.',
   'Turn Cauchy’s inequality round: if |f⁽ⁿ⁾(a)| ≤ n! M ÷ Rⁿ then M ≥ |f⁽ⁿ⁾(a)| × Rⁿ ÷ n!. The smallest possible M makes the two sides equal.'],
  solution: `The gauge gives 2πi ${fj} ÷ ${n(j)}! = ${kpi(k)}, so ${fj} = ${n(k)} × ${n(fact(j))} ÷ 2 = ${n(val)} and |${fj}| = ${n(av)}. Cauchy’s inequality needs ${n(av)} ≤ ${n(j)}! M ÷ ${n(Rj)}, so M ≥ ${n(av)} × ${n(Rj)} ÷ ${n(fact(j))} = ${n(M)}. The smallest ceiling is ${n(M)}.`,
  guidance: [
   { prompt: `The gauge reads ${kpi(k)}, which is 2πi ${fj} ÷ ${n(j)}!. What is |${fj}|?`, answer: [av], explanation: `${fj} = ${n(k)} × ${n(fact(j))} ÷ 2 = ${n(val)}, and its size is ${n(av)}.` },
   { prompt: `Cauchy’s inequality needs ${n(av)} ≤ ${n(j)}! M ÷ ${n(Rj)}. What is the smallest M that works?`, answer: [M], explanation: `M ≥ ${n(av)} × ${n(Rj)} ÷ ${n(fact(j))} = ${n(M)}.` }
  ] }; }
});

/* ---- q27 Mean value property [6.5, 5.5] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The heat plate ring',
 brief: 'A heat plate in the hull workshop is read by a thermal ring, and the crew wants the temperature at its top point and the one number for the whole ring.',
 labels: ['u at the top of the ring', 'average round the ring'], tolerance: 0.01, gl: [['u at the top of the ring'], ['sum of second derivatives'], ['average round the ring']]
}, {
 /* A cubic harmonic u = A(x³ − 3xy²) + B(3x²y − y³) + Cx + Dy + E, not both A and B zero. The top of the ring is (p, q + r); the average is u(p, q). */
 canonical: { A: 1, B: -1, C: 2, D: -3, E: 4, p: 1, q: -1, r: 2 },
 draw: R => tries(() => ({ A: R.int(-2, 2), B: R.int(-2, 2), C: R.int(-4, 4), D: R.int(-4, 4), E: R.int(-9, 9), p: R.int(-2, 2), q: R.int(-2, 2), r: R.int(1, 3) }),
  p => (p.A !== 0 || p.B !== 0) && (p.A * (Math.pow(p.p, 3) - 3 * p.p * Math.pow(p.q + p.r, 2)) + p.B * (3 * p.p * p.p * (p.q + p.r) - Math.pow(p.q + p.r, 3)) + p.C * p.p + p.D * (p.q + p.r))
   !== (p.A * (Math.pow(p.p, 3) - 3 * p.p * p.q * p.q) + p.B * (3 * p.p * p.p * p.q - Math.pow(p.q, 3)) + p.C * p.p + p.D * p.q), { A: 1, B: -1, C: 2, D: -3, E: 4, p: 1, q: -1, r: 2 }),
 build: ({ A, B, C, D, E, p, q, r }) => { const u = terms([[A, 'x³'], [-3 * A, 'xy²'], [3 * B, 'x²y'], [-B, 'y³'], [C, 'x'], [D, 'y'], [E, '']]),
  parts = (x, y) => [A * x * x * x, -3 * A * x * y * y, 3 * B * x * x * y, -B * y * y * y, C * x, D * y, E], U = (x, y) => parts(x, y).reduce((s, v) => s + v, 0),
  yt = q + r, top = U(p, yt), mid = U(p, q), uxx = terms([[6 * A, 'x'], [6 * B, 'y']]), uyy = terms([[-6 * A, 'x'], [-6 * B, 'y']]); return {
  prompt: `A heat plate in the hull workshop has the temperature model u(x, y) = ${u} across its flat surface. A thermal ring is the circle of radius ${n(r)} centred at (${n(p)}, ${n(q)}). Enter u at the top of the ring, the point (${n(p)}, ${n(yt)}), then the average of u over the whole ring.`,
  answer: [top, mid],
  hints: ['Check that u is harmonic: ∂²u/∂x² + ∂²u/∂y² = 0. A term in x³ has second x-derivative 6x; a term in xy² has second y-derivative 2x. Terms in x, y or a constant give 0. The mean value property then says that the average of u round a circle equals u at its centre.',
   'The top of the ring is straight above the centre: the same x, with y larger by the radius. The average round the ring is u at the centre of the ring, not at the top.'],
  solution: `u(${n(p)}, ${n(yt)}) = ${eq(parts(p, yt), top)}. ∂²u/∂x² = ${uxx} and ∂²u/∂y² = ${uyy} (the x, y and constant terms give 0), which add to 0, so u is harmonic everywhere. By the mean value property its average round the ring is its value at the centre: u(${n(p)}, ${n(q)}) = ${eq(parts(p, q), mid)}.`,
  guidance: [
   { prompt: `Put x = ${n(p)} and y = ${n(yt)} into u. What is u(${n(p)}, ${n(yt)})?`, answer: [top], explanation: `u(${n(p)}, ${n(yt)}) = ${eq(parts(p, yt), top)}.` },
   { prompt: 'Is u harmonic? Work out ∂²u/∂x² + ∂²u/∂y².', answer: [0], explanation: `∂²u/∂x² = ${uxx} and ∂²u/∂y² = ${uyy}: they add to 0, so u is harmonic and the mean value property applies.` },
   { prompt: `The average round the ring is u at its centre. What is u(${n(p)}, ${n(q)})?`, answer: [mid], explanation: `u(${n(p)}, ${n(q)}) = ${eq(parts(p, q), mid)}.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The lost constant',
 brief: 'A heat plate’s model has lost one constant, but a gauge on a thermal ring still knows the plate’s average.',
 labels: ['E', 'u at the point on the ring'], tolerance: 0.01, gl: [['known part at the centre'], ['E'], ['u at the point on the ring']]
}, {
 /* u = A(x² − y²) + Bxy + Cx + Dy + E with E unknown (not 0); the gauge average V = u(p, q) = known(p, q) + E; the point (p + r, q) is on the ring. */
 canonical: { A: 2, B: -1, C: 3, D: 1, E: -4, p: -1, q: 2, r: 2 },
 draw: R => ({ A: R.pick([-2, -1, 1, 2]), B: R.int(-3, 3), C: R.int(-4, 4), D: R.int(-4, 4), E: R.nz(-9, 9), p: R.int(-3, 3), q: R.int(-3, 3), r: R.int(1, 4) }),
 build: ({ A, B, C, D, E, p, q, r }) => { const known = (x, y) => [A * x * x, -A * y * y, B * x * y, C * x, D * y], K = (x, y) => known(x, y).reduce((s, v) => s + v, 0),
  S = K(p, q), V = S + E, xe = p + r, ue = K(xe, q) + E; return {
  prompt: `A heat plate in the hull workshop has the temperature model u(x, y) = ${terms([[A, 'x²'], [-A, 'y²'], [B, 'xy'], [C, 'x'], [D, 'y'], [1, 'E']])}, which is harmonic over the whole plate. E is a constant that the workshop has lost. A thermal ring is the circle of radius ${n(r)} centred at (${n(p)}, ${n(q)}), and its gauge reports that the average of u round the ring is ${n(V)}. Enter E, then the value of u at the point (${n(xe)}, ${n(q)}) on the ring.`,
  answer: [E, ue],
  hints: ['The plate is harmonic, so by the mean value property the average round the ring equals u at the centre of the ring. Put the centre into u and set the result equal to the gauge reading: one equation with E in it.',
   'Solve that equation for E, then put the ring point into the whole of u, E included.'],
  solution: `The average round the ring is u at its centre (${n(p)}, ${n(q)}). Without E, u there is ${eq(known(p, q), S)}. So ${n(S)} + E = ${n(V)} and E = ${n(V)} − ${par(S)} = ${n(E)}. At (${n(xe)}, ${n(q)}) the part without E is ${eq(known(xe, q), K(xe, q))}, so u = ${n(K(xe, q))} + ${par(E)} = ${n(ue)}.`,
  guidance: [
   { prompt: `The average round the ring is u at the centre (${n(p)}, ${n(q)}). Put x = ${n(p)} and y = ${n(q)} into the part of u without E. What do you get?`, answer: [S], explanation: `${eq(known(p, q), S)}.` },
   { prompt: `The centre value is ${n(S)} + E, and the gauge says the average is ${n(V)}. What is E?`, answer: [E], explanation: `${n(S)} + E = ${n(V)} gives E = ${n(E)}.` },
   { prompt: `Now put x = ${n(xe)} and y = ${n(q)} into u, with E = ${n(E)}. What is u there?`, answer: [ue], explanation: `The part without E is ${eq(known(xe, q), K(xe, q))}, and adding E = ${n(E)} gives ${n(ue)}.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q24', title: 'Averages of a whole signal',
 brief: 'A ring in the field lab measures both parts of a complex signal, and the lab wants the average of each from Cauchy’s formula.',
 labels: ['u at the point on the ring', 'average of u', 'average of v'], tolerance: 0.01, gl: [['u at the point on the ring'], ['average of u'], ['average of v']]
}, {
 /* f = αz² + βz + γ, a = p + qi (q ≠ 0). u = Re f, v = Im f. Re f(a) = α(p² − q²) + βp + γ, Im f(a) = 2αpq + βq; u at a + r is α((p + r)² − q²) + β(p + r) + γ. */
 canonical: { al: 2, be: -3, ga: 1, p: 1, q: 2, r: 2 },
 draw: R => tries(() => ({ al: R.pick([-2, -1, 1, 2]), be: R.int(-4, 4), ga: R.int(-5, 5), p: R.int(-2, 2), q: R.nz(-3, 3), r: R.int(1, 3) }),
  p => { const xe = p.p + p.r; return p.al * (xe * xe - p.q * p.q) + p.be * xe + p.ga !== p.al * (p.p * p.p - p.q * p.q) + p.be * p.p + p.ga; }, { al: 2, be: -3, ga: 1, p: 1, q: 2, r: 2 }),
 build: ({ al, be, ga, p, q, r }) => { const xe = p + r, ue = al * (xe * xe - q * q) + be * xe + ga, ru = al * (p * p - q * q) + be * p + ga, rv = 2 * al * p * q + be * q; return {
  prompt: `A signal f(z) = ${poly([al, be, ga], 'z')} is analytic at every point of the plane, and u(x, y) and v(x, y) are its real and imaginary parts: f(x + iy) = u + iv. A ring in the field lab is the circle of radius ${n(r)} centred at the point a = ${cx(p, q)}. Cauchy’s integral formula, with z = a + r(cos θ + i sin θ) going once round the circle, says that the average of f(z) round the ring is f(a). So the average of u is the real part of f(a) and the average of v is its imaginary part. Enter u at the point ${cx(xe, q)} on the ring, then the average of u round the ring, then the average of v round the ring.`,
  answer: [ue, ru, rv],
  hints: ['For a complex number x + iy, (x + iy)² = x² − y² + 2xy i. Put the point into f, work out the square, and read off the real part: that is u there.',
   'Cauchy’s formula turns each average into a single value: put the centre a itself into f, and read its real part for the average of u and its imaginary part for the average of v.'],
  solution: `At ${cx(xe, q)}: z² = ${cx(xe * xe - q * q, 2 * xe * q)}, so the real part of f is u = ${eq([al * (xe * xe - q * q), be * xe, ga], ue)}. At the centre a = ${cx(p, q)}: a² = ${cx(p * p - q * q, 2 * p * q)}, so f(a) has real part ${eq([al * (p * p - q * q), be * p, ga], ru)} and imaginary part ${eq([2 * al * p * q, be * q], rv)}. The average of u is ${n(ru)} and the average of v is ${n(rv)}.`,
  guidance: [
   { prompt: `The point is ${cx(xe, q)}, and its square is ${cx(xe * xe - q * q, 2 * xe * q)}. Put it into f. What is the real part of f there, which is u at the point?`, answer: [ue], explanation: `${eq([al * (xe * xe - q * q), be * xe, ga], ue)}.` },
   { prompt: `The centre is a = ${cx(p, q)}, and a² = ${cx(p * p - q * q, 2 * p * q)}. What is the real part of f(a), the average of u?`, answer: [ru], explanation: `${eq([al * (p * p - q * q), be * p, ga], ru)}.` },
   { prompt: 'What is the imaginary part of f(a), the average of v?', answer: [rv], explanation: `${eq([2 * al * p * q, be * q], rv)}.` }
  ] }; }
});

/* ---- q28 Maximum modulus [5.5, 6.5] ---- */

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The dish antenna rim',
 brief: 'A dish antenna’s feed is strongest somewhere on its face, and the crew needs the peak and the weakest point of the rim.',
 labels: ['largest on the disc', 'smallest on the edge'], tolerance: 0.01, gl: [['|k zⁿ| on the edge'], ['largest on the disc'], ['smallest on the edge']]
}, {
 /* f(z) = k zᵉ + c with k from 2 to 4, c real, 0 < |c| < k Rᵉ. Never the worked example (z² + 3 on |z| ≤ 2: k would be 1). */
 canonical: { k: 3, e: 2, R: 2, c: 7 },
 draw: R => { const e = R.int(2, 3), r = R.int(2, 3), k = R.int(2, 4); return { k, e, R: r, c: R.pick([-1, 1]) * R.int(1, Math.min(k * Math.pow(r, e) - 1, 30)) }; },
 build: ({ k, e, R, c }) => { const Re = Math.pow(R, e), edge = k * Re, ac = Math.abs(c), top = edge + ac, low = edge - ac, zk = 'z' + SUP[e], kz = `${n(k)}${zk}`, f = `${kz} ${c < 0 ? '−' : '+'} ${n(ac)}`,
  hi = c > 0 ? edge : -edge; return {
  prompt: `A dish antenna’s feed signal has strength |f(z)| at the point z of its disc |z| ≤ ${n(R)}, with f(z) = ${f}. Enter the largest value of |f(z)| on the whole disc, then the smallest value of |f(z)| on its edge, the circle |z| = ${n(R)}.`,
  answer: [top, low],
  hints: ['Maximum modulus principle: for a function that is analytic on a disc and not constant, the largest |f| over the disc is on its edge, and nowhere inside.',
   'On the edge |zⁿ| = Rⁿ, so |k zⁿ| = k Rⁿ, because the modulus of a product is the product of the moduli. As z goes once round the edge, k zⁿ goes all the way round a circle of that radius. The triangle inequality puts |w + c| between |w| − |c| and |w| + |c|, and both ends are reached.'],
  solution: `On the edge |${zk}| = ${n(R)}${SUP[e]} = ${n(Re)}, so |${kz}| = ${n(k)} × ${n(Re)} = ${n(edge)}. As z goes round the edge, ${kz} passes through ${n(edge)} and ${n(-edge)}. |${f}| is largest where ${kz} = ${n(hi)}, which points the same way as ${n(c)}: ${n(edge)} + ${n(ac)} = ${n(top)}. It is smallest where ${kz} = ${n(-hi)}: ${n(edge)} − ${n(ac)} = ${n(low)}. By the maximum modulus principle no point inside the disc beats the edge, so the largest value on the whole disc is ${n(top)}.`,
  guidance: [
   { prompt: `On the edge |z| = ${n(R)}. What is |${kz}| there?`, answer: [edge], explanation: `|${zk}| = ${n(R)}${SUP[e]} = ${n(Re)}, and the factor ${n(k)} multiplies the size: ${n(k)} × ${n(Re)} = ${n(edge)}.` },
   { prompt: 'What is the largest value of |f(z)| on the disc?', answer: [top], explanation: `It is on the edge, where ${kz} = ${n(hi)} lines up with ${n(c)}: ${n(edge)} + ${n(ac)} = ${n(top)}.` },
   { prompt: 'What is the smallest value of |f(z)| on the edge?', answer: [low], explanation: `Where ${kz} = ${n(-hi)} points against ${n(c)}: ${n(edge)} − ${n(ac)} = ${n(low)}.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Sizing the coil housing',
 brief: 'A coil housing is rated for one top strength, and the crew wants to know how large a coil disc it can safely hold.',
 labels: ['largest on the present disc', 'largest whole radius'], tolerance: 0.01, gl: [['largest on the present disc'], ['room for |zⁿ|'], ['largest whole radius']]
}, {
 /* f = zᵉ + c; the largest |f| on |z| ≤ R is Rᵉ + |c|. The rating L = Sᵉ + |c| + extra with 1 ≤ extra < (S + 1)ᵉ − Sᵉ, so the largest whole radius is S and L never sits on a boundary. S ≠ R0. Never the worked example (z² + 3, R = 2). */
 canonical: { e: 2, c: -5, R0: 3, L: 44 },
 draw: R => tries(() => { const e = R.int(2, 3), S = R.int(3, 6), ac = R.int(1, 20), hi = Math.pow(S + 1, e) - Math.pow(S, e) - 1; return { e, c: R.pick([-1, 1]) * ac, R0: R.int(2, 5), L: Math.pow(S, e) + ac + R.int(1, hi) }; },
  p => !(p.e === 2 && p.c === 3 && p.R0 === 2), { e: 2, c: -5, R0: 3, L: 44 }),
 build: ({ e, c, R0, L }) => { const ac = Math.abs(c), B = L - ac, now = Math.pow(R0, e) + ac; let S = 1; while (Math.pow(S + 1, e) <= B) S++;
  const f = `z${SUP[e]} ${c < 0 ? '−' : '+'} ${n(ac)}`; return {
  prompt: `A coil housing is rated for field strengths up to ${n(L)}. The strength of the coil’s field at the point z of the plane is |f(z)|, with f(z) = ${f}, and the coil fills a disc |z| ≤ R. First enter the largest value of |f(z)| on the present disc |z| ≤ ${n(R0)}. The crew then want the largest disc the housing can hold: enter the largest whole-number radius R for which the largest value of |f(z)| on the disc |z| ≤ R is still at most ${n(L)}.`,
  answer: [now, S],
  hints: ['On a disc |z| ≤ R the largest |zⁿ + c| is Rⁿ + |c|, where c is the constant in f: by the maximum modulus principle it is on the edge, where zⁿ can point the same way as c.',
   'For the radius, the largest value Rⁿ + |c| must not pass the rating. Find how large Rⁿ may be, then try whole-number radii and take the biggest one that fits.'],
  solution: `On |z| ≤ ${n(R0)} the largest value is ${n(R0)}${SUP[e]} + ${n(ac)} = ${n(Math.pow(R0, e))} + ${n(ac)} = ${n(now)}. On |z| ≤ R it is R${SUP[e]} + ${n(ac)}, which must be at most ${n(L)}, so R${SUP[e]} ≤ ${n(L)} − ${n(ac)} = ${n(B)}. Now ${n(S)}${SUP[e]} = ${n(Math.pow(S, e))} fits, but ${n(S + 1)}${SUP[e]} = ${n(Math.pow(S + 1, e))} is too big, so the largest whole radius is ${n(S)}.`,
  guidance: [
   { prompt: `On the disc |z| ≤ ${n(R0)} the edge has |z${SUP[e]}| = ${n(Math.pow(R0, e))}. What is the largest value of |f(z)| on that disc?`, answer: [now], explanation: `${n(Math.pow(R0, e))} + ${n(ac)} = ${n(now)}.` },
   { prompt: `The rating is ${n(L)} and the constant in f has size ${n(ac)}. How large may Rⁿ be, so that Rⁿ + ${n(ac)} stays at most ${n(L)}?`, answer: [B], explanation: `${n(L)} − ${n(ac)} = ${n(B)}.` },
   { prompt: `What is the largest whole number R with R${SUP[e]} at most ${n(B)}?`, answer: [S], explanation: `${n(S)}${SUP[e]} = ${n(Math.pow(S, e))} is at most ${n(B)}, and ${n(S + 1)}${SUP[e]} = ${n(Math.pow(S + 1, e))} is not.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q26', title: 'How steep the rim can be',
 brief: 'The crew wants the strongest field on the coil disc, and then how steeply the field can change at the centre, compared with how steeply it does.',
 labels: ['largest on the disc', 'Cauchy bound', 'true value'], tolerance: 0.01, gl: [['largest on the disc'], ['Cauchy bound'], ['true value']]
}, {
 /* f = zᵉ + c, e from 2 to 4: M = Rᵉ + |c|, bound e! M ÷ Rᵉ (whole: Rᵉ divides e! |c|), true |f⁽ᵉ⁾(0)| = e!. Never the worked example (z² + 3, R = 2). */
 canonical: { e: 3, R: 2, c: -4 },
 draw: R => tries(() => { const e = R.int(2, 4), r = R.int(2, 3); return { e, R: r, c: R.pick([-1, 1]) * R.int(1, 40) }; },
  p => (fact(p.e) * Math.abs(p.c)) % Math.pow(p.R, p.e) === 0 && !(p.e === 2 && p.R === 2 && p.c === 3), { e: 3, R: 2, c: -4 }),
 build: ({ e, R, c }) => { const Re = Math.pow(R, e), ac = Math.abs(c), M = Re + ac, bound = fact(e) * M / Re, tru = fact(e), f = `z${SUP[e]} ${c < 0 ? '−' : '+'} ${n(ac)}`, fe = `${der(e)}(0)`; return {
  prompt: `The strength of a field coil’s signal over the disc |z| ≤ ${n(R)} is |f(z)|, with f(z) = ${f}. Enter the largest value M of |f(z)| on the whole disc. Cauchy’s inequality says that if |f(z)| ≤ M on the circle |z| = ${n(R)}, then |${fe}| ≤ ${n(e)}! M ÷ ${n(R)}${SUP[e]}. Enter that bound, using the M you found, then the true value of |${fe}|.`,
  answer: [M, bound, tru],
  hints: ['By the maximum modulus principle the largest value of |f| on the disc is on its edge. On the edge |zⁿ| = Rⁿ, and zⁿ goes all the way round the circle of radius Rⁿ, so it can point the same way as c.',
   'For the true value, differentiate zⁿ as many times as the order of the derivative: each step brings down the next power, and the constant c disappears at the first derivative.'],
  solution: `On the edge |${'z' + SUP[e]}| = ${n(R)}${SUP[e]} = ${n(Re)}, and z${SUP[e]} can point the same way as ${n(c)}, so the largest value on the edge, and so on the whole disc, is M = ${n(Re)} + ${n(ac)} = ${n(M)}. The bound is ${n(e)}! × ${n(M)} ÷ ${n(Re)} = ${n(fact(e) * M)} ÷ ${n(Re)} = ${n(bound)}. For the true value, differentiating z${SUP[e]} ${n(e)} times gives ${n(e)}! = ${n(tru)}, and the constant disappears, so ${fe} = ${n(tru)}. The true value is below the bound, as it must be.`,
  guidance: [
   { prompt: `On the edge |z${SUP[e]}| = ${n(Re)}, and it can point the same way as ${n(c)}. What is the largest value M of |f(z)|?`, answer: [M], explanation: `${n(Re)} + ${n(ac)} = ${n(M)}.` },
   { prompt: `What is the Cauchy bound ${n(e)}! M ÷ ${n(Re)} = ${n(fact(e))} × ${n(M)} ÷ ${n(Re)}?`, answer: [bound], explanation: `${n(fact(e) * M)} ÷ ${n(Re)} = ${n(bound)}.` },
   { prompt: `Differentiating z${SUP[e]} ${n(e)} times in a row gives a constant. What is |${fe}|?`, answer: [tru], explanation: `The constant is ${n(e)}! = ${n(tru)}, and ${n(c)} has no effect on a derivative.` }
  ] }; }
});

/* ---- q29 Chapter review: reading the field coil [5.1, 5.2] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The magnet housing',
 brief: 'A magnet housing is read by its winding and a sensor signal, and the shift report needs three numbers from them.',
 labels: ['k for (z − a)', 'k for (z − a)³', 'bound'], tolerance: 0.01, gl: [['k for (z − a)'], ['k for (z − a)³'], ['bound']]
}, {
 /* f a cubic, a inside |z − c| = R. k1 = 2f(a), k2 = 2f′′(a) ÷ 2! = f′′(a) = 6αa + 2β. Sensor signal g on |z − c2| = ρ with bound m! M ÷ ρᵐ, m = 2 or 3. */
 canonical: { al: 1, be: -2, ga: 3, de: -1, a: 1, c: 0, R: 3, m: 2, c2: -1, rho: 3, M: 54 },
 draw: R => tries(() => { const m = R.int(2, 3), rho = R.int(2, 4), a = R.int(-2, 2), c = R.int(-2, 2); return { al: R.nz(-2, 2), be: R.int(-3, 3), ga: R.int(-4, 4), de: R.int(-5, 5), a, c, R: Math.abs(a - c) + R.int(1, 3), m, c2: R.int(-2, 2), rho, M: boundM(rho, m, 6, 300, (x, y) => R.int(x, y)) }; },
  p => p.M > 0 && 2 * (p.al * p.a * p.a * p.a + p.be * p.a * p.a + p.ga * p.a + p.de) !== 0 && 6 * p.al * p.a + 2 * p.be !== 0, { al: 1, be: -2, ga: 3, de: -1, a: 1, c: 0, R: 3, m: 2, c2: -1, rho: 3, M: 54 }),
 build: ({ al, be, ga, de, a, c, R, m, c2, rho, M }) => { const f = poly([al, be, ga, de], 'z'), pa = [al * a * a * a, be * a * a, ga * a, de], fa = pa.reduce((s, v) => s + v, 0), k1 = 2 * fa,
  d2 = 6 * al * a + 2 * be, rm = Math.pow(rho, m), bound = fact(m) * M / rm; return {
  prompt: `A magnet housing is wound along the circle ${circ(c, R)}, driven once anticlockwise, and its field model is f(z) = ${f}. Enter k in ∮ f(z) ÷ ${zp(a)} dz = kπi, then k in ∮ f(z) ÷ ${zp(a)}³ dz = kπi. A sensor signal g is analytic on and inside the circle ${circ(c2, rho)}, with |g(z)| ≤ ${n(M)} on that circle: enter the largest value Cauchy’s inequality allows for |${der(m, 'g')}(${n(c2)})|.`,
  answer: [k1, d2, bound],
  hints: ['When a is inside the loop, ∮ f(z) ÷ (z − a)ⁿ⁺¹ dz = 2πi f⁽ⁿ⁾(a) ÷ n!. A first power on the bottom is n = 0, which is Cauchy’s integral formula, and a cube on the bottom is n = 2.',
   'Cauchy’s inequality: |g⁽ⁿ⁾(c)| ≤ n! M ÷ Rⁿ for a circle of radius R centred on c, with |g| ≤ M on it.'],
  solution: `a = ${n(a)} is inside the circle, and f is a polynomial. f(${n(a)}) = ${eq(pa, fa)}, so the first integral is 2πi × ${par(fa)} = ${kpi(k1)}: k = ${n(k1)}. A cube on the bottom means n = 2: the integral is 2πi f′′(${n(a)}) ÷ 2! = πi f′′(${n(a)}). f′′(z) = ${poly([6 * al, 2 * be], 'z')}, so f′′(${n(a)}) = ${n(d2)} and k = ${n(d2)}. For g, n = ${n(m)}: the bound is ${n(m)}! × ${n(M)} ÷ ${n(rho)}${SUP[m]} = ${n(fact(m) * M)} ÷ ${n(rm)} = ${n(bound)}.`,
  guidance: [
   { prompt: `f(${n(a)}) = ${n(fa)}. What is k for ∮ f(z) ÷ ${zp(a)} dz?`, answer: [k1], explanation: `Cauchy’s integral formula: 2πi × ${par(fa)} = ${kpi(k1)}, so k = ${n(k1)}.` },
   { prompt: `f′′(z) = ${poly([6 * al, 2 * be], 'z')}. With a cube on the bottom the integral is 2πi f′′(${n(a)}) ÷ 2!. What is k for ∮ f(z) ÷ ${zp(a)}³ dz?`, answer: [d2], explanation: `2πi f′′(${n(a)}) ÷ 2 = πi f′′(${n(a)}), and f′′(${n(a)}) = ${n(d2)}, so k = ${n(d2)}.` },
   { prompt: `What is the bound ${n(m)}! × ${n(M)} ÷ ${n(rm)} on |${der(m, 'g')}(${n(c2)})|?`, answer: [bound], explanation: `${n(fact(m) * M)} ÷ ${n(rm)} = ${n(bound)}.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'Calibrating the coil',
 brief: 'One constant of the coil’s model was lost, but a gauge reading from its winding still fixes it, and then the other readings follow.',
 labels: ['p', 'k for (z − a)²', 'bound'], tolerance: 0.01, gl: [['p'], ['k for (z − a)²'], ['bound']]
}, {
 /* f = z² + pz + e with p unknown; gauge K = 2f(a), a ≠ 0 inside |z| = R. f(a) = K ÷ 2 gives p = (K ÷ 2 − a² − e) ÷ a. Second reading 2f′(a) = 2(2a + p). Then Cauchy's bound m! M ÷ ρᵐ for g on |z − 1| = ρ. */
 canonical: { p: 3, e: -2, a: 2, R: 4, m: 2, rho: 2, M: 20 },
 draw: R => tries(() => { const m = R.int(1, 2), rho = R.int(2, 4), a = R.nz(-3, 3); return { p: R.nz(-6, 6), e: R.nz(-5, 5), a, R: Math.abs(a) + R.int(1, 3), m, rho, M: boundM(rho, m, 6, 300, (x, y) => R.int(x, y)) }; },
  p => p.M > 0 && 2 * (p.a * p.a + p.p * p.a + p.e) !== 0 && 2 * p.a + p.p !== 0, { p: 3, e: -2, a: 2, R: 4, m: 2, rho: 2, M: 20 }),
 build: ({ p, e, a, R, m, rho, M }) => { const fa = a * a + p * a + e, K = 2 * fa, d1 = 2 * a + p, k2 = 2 * d1, rm = Math.pow(rho, m), bound = fact(m) * M / rm; return {
  prompt: `The field coil is the circle |z| = ${n(R)}, driven once anticlockwise, and its model is f(z) = z² + pz ${e < 0 ? '−' : '+'} ${n(Math.abs(e))}, where p is a constant the crew have lost. A gauge reading on the winding shows ∮ f(z) ÷ ${zp(a)} dz = ${kpi(K)}. Enter p, then k in ∮ f(z) ÷ ${zp(a)}² dz = kπi for the same f. A second signal g is analytic on and inside the circle |z − 1| = ${n(rho)}, with |g(z)| ≤ ${n(M)} on that circle: enter the largest value Cauchy’s inequality allows for |${der(m, 'g')}(1)|.`,
  answer: [p, k2, bound],
  hints: ['The point a is inside the circle, so Cauchy’s integral formula gives ∮ f(z) ÷ (z − a) dz = 2πi f(a). Set that equal to the gauge reading to find f(a), then put a into f and solve for p.',
   'With p known, a square on the bottom reads the first derivative: ∮ f(z) ÷ (z − a)² dz = 2πi f′(a). For the bound use |g⁽ⁿ⁾(c)| ≤ n! M ÷ Rⁿ.'],
  solution: `a = ${n(a)} is inside |z| = ${n(R)}, so the gauge gives 2πi f(${n(a)}) = ${kpi(K)}, and f(${n(a)}) = ${n(fa)}. Also f(${n(a)}) = ${terms([[a * a, ''], [a, 'p'], [e, '']])} = ${n(fa)}, so ${terms([[a, 'p']])} = ${n(fa - a * a - e)}${a === 1 ? '' : ` and p = ${n(p)}`}. Then f′(z) = ${poly([2, p], 'z')}, so f′(${n(a)}) = ${n(d1)} and the second integral is 2πi × ${par(d1)} = ${kpi(k2)}: k = ${n(k2)}. For g, n = ${n(m)}: the bound is ${n(m)}! × ${n(M)} ÷ ${n(rho)}${SUP[m]} = ${n(fact(m) * M)} ÷ ${n(rm)} = ${n(bound)}.`,
  guidance: [
   { prompt: `The gauge gives f(${n(a)}) = ${n(fa)}, and f(${n(a)}) = ${terms([[a * a, ''], [a, 'p'], [e, '']])}. What is p?`, answer: [p], explanation: `${terms([[a, 'p']])} = ${n(fa)} − ${n(a * a)} ${sg(-e)} = ${n(fa - a * a - e)}${a === 1 ? '' : `, so p = ${n(p)}`}.` },
   { prompt: `With p = ${n(p)}, f′(z) = ${poly([2, p], 'z')}. What is k for ∮ f(z) ÷ ${zp(a)}² dz?`, answer: [k2], explanation: `f′(${n(a)}) = ${n(d1)}, and the formula for derivatives with n = 1 gives 2πi × ${par(d1)} = ${kpi(k2)}, so k = ${n(k2)}.` },
   { prompt: `What is the bound ${n(m)}! × ${n(M)} ÷ ${n(rm)} on |${der(m, 'g')}(1)|?`, answer: [bound], explanation: `${n(fact(m) * M)} ÷ ${n(rm)} = ${n(bound)}.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q22', title: 'A cable wound several times',
 brief: 'The coil cable is wound several times round the housing, and the report needs each reading for the whole cable.',
 labels: ['k for (z − a)', 'k for (z − a)²', 'bound'], tolerance: 0.01, gl: [['k for (z − a)'], ['k for (z − a)²'], ['bound']]
}, {
 /* A loop that winds w times round a gives w times the integral of one turn: k1 = 2w f(a), k2 = 2w f′(a), f a cubic; a is inside |z − c| = R; bound j! M ÷ ρʲ. */
 canonical: { al: 1, be: -1, ga: 2, de: 3, a: 1, c: 0, R: 2, w: 3, j: 3, c2: 1, rho: 2, M: 16 },
 draw: R => tries(() => { const j = R.int(2, 3), rho = R.int(2, 3), a = R.int(-2, 2), c = R.int(-2, 2); return { al: R.nz(-2, 2), be: R.int(-4, 4), ga: R.int(-4, 4), de: R.int(-6, 6), a, c, R: Math.abs(a - c) + R.int(1, 2), w: R.int(2, 4), j, c2: R.int(-2, 2), rho, M: boundM(rho, j, 6, 200, (x, y) => R.int(x, y)) }; },
  p => p.M > 0 && p.al * p.a * p.a * p.a + p.be * p.a * p.a + p.ga * p.a + p.de !== 0 && 3 * p.al * p.a * p.a + 2 * p.be * p.a + p.ga !== 0, { al: 1, be: -1, ga: 2, de: 3, a: 1, c: 0, R: 2, w: 3, j: 3, c2: 1, rho: 2, M: 16 }),
 build: ({ al, be, ga, de, a, c, R, w, j, c2, rho, M }) => { const f = poly([al, be, ga, de], 'z'), pa = [al * a * a * a, be * a * a, ga * a, de], fa = pa.reduce((s, v) => s + v, 0),
  pd = [3 * al * a * a, 2 * be * a, ga], d1 = pd.reduce((s, v) => s + v, 0), k1 = 2 * w * fa, k2 = 2 * w * d1, rj = Math.pow(rho, j), bound = fact(j) * M / rj; return {
  prompt: `The coil cable is wound ${n(w)} times anticlockwise round the circle ${circ(c, R)}, so it winds ${n(w)} times round every point inside, and an integral along the whole cable is ${n(w)} times the integral round one turn. The field model is f(z) = ${f}. Enter k in ∮ f(z) ÷ ${zp(a)} dz = kπi along the whole cable, then k in ∮ f(z) ÷ ${zp(a)}² dz = kπi along the whole cable. A signal g is analytic on and inside the circle ${circ(c2, rho)}, with |g(z)| ≤ ${n(M)} on that circle: enter the largest value Cauchy’s inequality allows for |${der(j, 'g')}(${n(c2)})|.`,
  answer: [k1, k2, bound],
  hints: ['For one turn round a point a inside, ∮ f(z) ÷ (z − a) dz = 2πi f(a) and ∮ f(z) ÷ (z − a)² dz = 2πi f′(a). A cable that winds w times round a multiplies each of these by w.',
   'Cauchy’s inequality: |g⁽ⁿ⁾(c)| ≤ n! M ÷ Rⁿ for a circle of radius R centred on c, with |g| ≤ M on it.'],
  solution: `a = ${n(a)} is inside the circle. f(${n(a)}) = ${eq(pa, fa)}, so one turn gives 2πi × ${par(fa)}, and ${n(w)} turns give ${n(w)} × 2πi × ${par(fa)} = ${kpi(k1)}: k = ${n(k1)}. f′(z) = ${poly([3 * al, 2 * be, ga], 'z')}, so f′(${n(a)}) = ${eq(pd, d1)}, and ${n(w)} turns give ${n(w)} × 2πi × ${par(d1)} = ${kpi(k2)}: k = ${n(k2)}. For g, n = ${n(j)}: the bound is ${n(j)}! × ${n(M)} ÷ ${n(rho)}${SUP[j]} = ${n(fact(j) * M)} ÷ ${n(rj)} = ${n(bound)}.`,
  guidance: [
   { prompt: `f(${n(a)}) = ${n(fa)}. For ${n(w)} turns, what is k for ∮ f(z) ÷ ${zp(a)} dz?`, answer: [k1], explanation: `One turn gives 2πi × ${par(fa)}, so ${n(w)} turns give ${n(w)} × 2 × ${par(fa)} = ${n(k1)} in front of πi: k = ${n(k1)}.` },
   { prompt: `f′(z) = ${poly([3 * al, 2 * be, ga], 'z')}. For ${n(w)} turns, what is k for ∮ f(z) ÷ ${zp(a)}² dz?`, answer: [k2], explanation: `f′(${n(a)}) = ${n(d1)}. One turn gives 2πi × ${par(d1)}, so ${n(w)} turns give k = ${n(w)} × 2 × ${par(d1)} = ${n(k2)}.` },
   { prompt: `What is the bound ${n(j)}! × ${n(M)} ÷ ${n(rj)} on |${der(j, 'g')}(${n(c2)})|?`, answer: [bound], explanation: `${n(fact(j) * M)} ÷ ${n(rj)} = ${n(bound)}.` }
  ] }; }
});

/* ---- q30 Geometric series in the plane [8.1] ---- */

/* Every z = (a + bi) ÷ d with |z| < 1, b ≠ 0, a, b, d with no common factor, whose sum 1 ÷ (1 − z) has real and imaginary parts with
   at most two decimals. Neither i ÷ 2 (the parent’s mission) nor (1 + i) ÷ 2 (its worked example). */
const GEO = []; for (let d = 2; d <= 10; d++) for (let a = 1 - d; a < d; a++) for (let b = 1 - d; b < d; b++) {
 if (b === 0 || a * a + b * b >= d * d || gcd(gcd(a, b), d) !== 1) continue;
 const den = (d - a) * (d - a) + b * b; if (!two(d * (d - a) / den) || !two(d * b / den)) continue;
 if ((a === 0 && b === 1 && d === 2) || (a === 1 && b === 1 && d === 2)) continue; GEO.push({ a, b, d }); }
/* Those whose z itself, and |S|² for the sum S, are also at most two decimals (q30c reads z back from S). */
const INV = GEO.filter(({ a, b, d }) => { const den = (d - a) * (d - a) + b * b, re = d * (d - a) / den, im = d * b / den; return two(a / d) && two(b / d) && two(re * re + im * im); });
/* q30d: z = (a + bi) ÷ d, d from 3 to 9, a and b not 0, |z| < 1; the sum 1 + z² + z⁴ + … rounded to 2 decimals, never on a tie or a zero. */
const EVEN = []; for (let d = 3; d <= 9; d++) for (let a = 1 - d; a < d; a++) for (let b = 1 - d; b < d; b++) {
 if (a === 0 || b === 0 || a * a + b * b >= d * d || gcd(gcd(a, b), d) !== 1) continue;
 const D = d * d, P = a * a - b * b, Q = 2 * a * b, N = (D - P) * (D - P) + Q * Q, re = D * (D - P) / N, im = D * Q / N;
 if (noTie(re) && noTie(im) && Math.abs(r2(re)) >= 0.01 && Math.abs(r2(im)) >= 0.01) EVEN.push({ a, b, d }); }
const zt = (a, b, d) => a === 0 ? `${cx(0, b)} ÷ ${n(d)}` : `(${cx(a, b)}) ÷ ${n(d)}`;

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Echoes of a pulse',
 brief: 'A pulse returns as a train of weaker, turned echoes, and the archive wants the total of the whole train.',
 labels: ['real part', 'imaginary part'], tolerance: 0.005, gl: [['bottom after the conjugate'], ['real part'], ['imaginary part']]
}, {
 /* A + Az + Az² + … = A ÷ (1 − z), A from 2 to 6, z from GEO. */
 canonical: { A: 3, a: -3, b: 1, d: 4 },
 draw: R => { const g = R.pick(GEO); return { A: R.int(2, 6), a: g.a, b: g.b, d: g.d }; },
 build: ({ A, a, b, d }) => { const den = (d - a) * (d - a) + b * b, re = A * d * (d - a) / den, im = A * d * b / den, top = cx(A * d * (d - a), A * d * b); return {
  prompt: `An antenna in the archive receives a pulse of strength ${n(A)}. Each echo after it is z times the one before, where z = ${zt(a, b, d)}, so the pulses are ${n(A)}, ${n(A)}z, ${n(A)}z², ${n(A)}z³, and so on for ever. Enter the real part, then the imaginary part, of the total of all the pulses, as exact decimals.`,
  answer: [re, im],
  hints: ['The total is A(1 + z + z² + …), and 1 + z + z² + … adds up to 1 ÷ (1 − z) when |z| < 1, for a complex z just as for a real number. So the total is A ÷ (1 − z).',
   'To divide by a complex number, multiply the top and the bottom by the conjugate of the bottom; the bottom becomes (Re)² + (Im)², a real number.'],
  solution: `|z|² = ${n(a * a + b * b)} ÷ ${n(d * d)}, less than 1, so the total is ${n(A)} ÷ (1 − z). 1 − z = (${cx(d - a, -b)}) ÷ ${n(d)}, so ${n(A)} ÷ (1 − z) = ${n(A * d)} ÷ (${cx(d - a, -b)}). Multiply the top and the bottom by the conjugate ${cx(d - a, b)}: the bottom becomes ${par(d - a)}² + ${par(b)}² = ${n(den)} and the top ${top}. The total is (${top}) ÷ ${n(den)}: real part ${n(re)}, imaginary part ${n(im)}.`,
  guidance: [
   { prompt: `${n(A)} ÷ (1 − z) = ${n(A * d)} ÷ (${cx(d - a, -b)}). Multiply the top and the bottom by the conjugate ${cx(d - a, b)}. What real number is the new bottom?`, answer: [den], explanation: `(${cx(d - a, -b)})(${cx(d - a, b)}) = ${par(d - a)}² + ${par(b)}² = ${n(den)}.` },
   { prompt: `The new top is ${n(A * d)}(${cx(d - a, b)}) = ${top}. What is the real part of the total?`, answer: [re], explanation: `${n(A * d * (d - a))} ÷ ${n(den)} = ${n(re)}.` },
   { prompt: 'And the imaginary part?', answer: [im], explanation: `${n(A * d * b)} ÷ ${n(den)} = ${n(im)}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'The lost repeat factor',
 brief: 'The archive kept the total of an echo train but lost the number that turns each echo, and the crew needs it back.',
 labels: ['real part of z', 'imaginary part of z'], tolerance: 0.005, gl: [['|S|²'], ['real part of z'], ['imaginary part of z']]
}, {
 /* S = 1 ÷ (1 − z) for z = (a + bi) ÷ d from INV; z = 1 − 1 ÷ S = 1 − (Re S − Im S i) ÷ |S|². Never the parent’s mission or example. */
 canonical: { a: -3, b: 1, d: 4 },
 draw: R => R.pick(INV),
 build: ({ a, b, d }) => { const den = (d - a) * (d - a) + b * b, re = d * (d - a) / den, im = d * b / den, m2 = Math.round((re * re + im * im) * 1e4) / 1e4, zr = Math.round(a / d * 1e4) / 1e4, zi = Math.round(b / d * 1e4) / 1e4,
  S = cx(re, im); return {
  prompt: `The signal archive stored an echo train 1 + z + z² + z³ + … (each echo is z times the one before, and |z| < 1). The log kept only the total, S = ${S}, and the number z was lost. Enter the real part, then the imaginary part, of z, as exact decimals.`,
  answer: [zr, zi],
  hints: ['The total is S = 1 ÷ (1 − z), so 1 − z = 1 ÷ S and z = 1 − 1 ÷ S.',
   'To find 1 ÷ S, multiply the top and the bottom by the conjugate of S; the bottom becomes (Re S)² + (Im S)², a real number.'],
  solution: `The total is 1 ÷ (1 − z) = S, so z = 1 − 1 ÷ S. The conjugate of S is ${cx(re, -im)} and |S|² = ${par(re)}² + ${par(im)}² = ${n(m2)}, so 1 ÷ S = (${cx(re, -im)}) ÷ ${n(m2)} = ${cx(Math.round(re / m2 * 1e4) / 1e4, Math.round(-im / m2 * 1e4) / 1e4)}. Then z = 1 − (${cx(Math.round(re / m2 * 1e4) / 1e4, Math.round(-im / m2 * 1e4) / 1e4)}) = ${cx(zr, zi)}: real part ${n(zr)}, imaginary part ${n(zi)}.`,
  guidance: [
   { prompt: `z = 1 − 1 ÷ S. First find 1 ÷ S by multiplying the top and the bottom by the conjugate of S. What real number is the new bottom, |S|² = (Re S)² + (Im S)²?`, answer: [m2], explanation: `${par(re)}² + ${par(im)}² = ${n(m2)}.` },
   { prompt: `1 ÷ S = (${cx(re, -im)}) ÷ ${n(m2)}. What is the real part of z = 1 − 1 ÷ S?`, answer: [zr], explanation: `The real part of 1 ÷ S is ${n(re)} ÷ ${n(m2)} = ${n(Math.round(re / m2 * 1e4) / 1e4)}, so the real part of z is 1 − ${par(Math.round(re / m2 * 1e4) / 1e4)} = ${n(zr)}.` },
   { prompt: 'And the imaginary part of z?', answer: [zi], explanation: `Subtracting 1 ÷ S takes away its imaginary part ${n(Math.round(-im / m2 * 1e4) / 1e4)}, so the imaginary part of z is ${n(zi)}.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q01', title: 'Only the even powers',
 brief: 'A filter keeps only the even powers of a signal, and the archive wants the total of what is left.',
 labels: ['real part', 'imaginary part'], tolerance: 0.005, gl: [['bottom after the conjugate'], ['real part'], ['imaginary part']]
}, {
 /* 1 + z² + z⁴ + … = 1 ÷ (1 − z²) for z = (a + bi) ÷ d from EVEN; z² = (P + Qi) ÷ D with D = d², P = a² − b², Q = 2ab; the sum is D((D − P) + Qi) ÷ N, N = (D − P)² + Q². */
 canonical: { a: 2, b: 1, d: 4 },
 draw: R => R.pick(EVEN),
 build: ({ a, b, d }) => { const D = d * d, P = a * a - b * b, Q = 2 * a * b, N = (D - P) * (D - P) + Q * Q, re = r2(D * (D - P) / N), im = r2(D * Q / N), top = cx(D * (D - P), D * Q); return {
  prompt: `A filter in the signal archive keeps only the even powers of a signal z = ${zt(a, b, d)}, so the archive stores the sum 1 + z² + z⁴ + z⁶ + … of them. Enter the real part, then the imaginary part, of that sum, rounded to 2 decimal places.`,
  answer: [re, im],
  hints: ['Each term of 1 + z² + z⁴ + … is z² times the one before, so this is a geometric series with ratio z². It adds up to 1 ÷ (1 − z²) when |z²| < 1, which holds here because |z| < 1.',
   'Square z first: (p + qi)² = p² − q² + 2pq i. Then divide by 1 − z² as before, multiplying the top and the bottom by the conjugate of the bottom. Round only the final answers.'],
  solution: `(${cx(a, b)})² = ${cx(P, Q)}, so z² = (${cx(P, Q)}) ÷ ${n(D)} and |z²| < 1. The sum is 1 ÷ (1 − z²), with 1 − z² = (${cx(D - P, -Q)}) ÷ ${n(D)}, so it is ${n(D)} ÷ (${cx(D - P, -Q)}). Multiply the top and the bottom by the conjugate ${cx(D - P, Q)}: the bottom becomes ${par(D - P)}² + ${par(Q)}² = ${n(N)} and the top ${top}. The sum is (${top}) ÷ ${n(N)}: real part ${n(re)} and imaginary part ${n(im)}, to 2 decimal places.`,
  guidance: [
   { prompt: `z² = (${cx(P, Q)}) ÷ ${n(D)}, so 1 ÷ (1 − z²) = ${n(D)} ÷ (${cx(D - P, -Q)}). Multiply the top and the bottom by the conjugate ${cx(D - P, Q)}. What real number is the new bottom?`, answer: [N], explanation: `(${cx(D - P, -Q)})(${cx(D - P, Q)}) = ${par(D - P)}² + ${par(Q)}² = ${n(N)}.` },
   { prompt: `The new top is ${n(D)}(${cx(D - P, Q)}) = ${top}. What is the real part of the sum, to 2 decimal places?`, answer: [re], explanation: `${n(D * (D - P))} ÷ ${n(N)} is ${n(re)} to 2 decimal places.` },
   { prompt: 'And the imaginary part, to 2 decimal places?', answer: [im], explanation: `${n(D * Q)} ÷ ${n(N)} is ${n(im)} to 2 decimal places.` }
  ] }; }
});

})();
