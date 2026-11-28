/* Differential equations practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p6.js. */
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
/* ---- text helpers ---- */
const sgn = v => v < 0 ? '−' : '+';
/* '+ 3x', '− x': a signed term after another. cf: a term at the start of an expression ('−x', '2x'). */
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cf = (v, x) => `${v === 1 ? '' : v === -1 ? '−' : n(v)}${x}`;
/* e^(rt) as text: e^t, e^(−t), e^(3t). */
const ex = (r, v = 't') => r === 1 ? `e^${v}` : r === -1 ? `e^(−${v})` : `e^(${n(r)}${v})`;
/* The right side of x′ = a x₁ + b x₂ with a zero coefficient left out. */
const lin = (a, b, u = 'x₁', v = 'x₂') => { const t = [[a, u], [b, v]].filter(([c]) => c !== 0);
 return t.length ? t.map(([c, x], i) => i === 0 ? cf(c, x) : ` ${trm(c, x)}`).join('') : '0'; };
const rows = M => `rows ${G.vec(M[0])} and ${G.vec(M[1])}`;
const fac = r => `(λ ${sgn(-r)} ${n(Math.abs(r))})`;
const quad = (tr, dt) => `λ²${tr === 0 ? '' : ' ' + trm(-tr, 'λ')} ${sgn(dt)} ${n(Math.abs(dt))} = 0`;
const pair = (c1, l1, c2, l2) => `${cf(c1, ex(l1))} ${sgn(c2)} ${cf(Math.abs(c2), ex(l2))}`;
const bt = b => b === 1 ? 't' : `${n(b)}t`;
/* c₁ × e₁ ± c₂ × e₂ as worked arithmetic. */
const sum2 = (c1, e1, c2, e2) => `${n(c1)} × ${n(e1)} ${sgn(c2)} ${n(Math.abs(c2))} × ${n(e2)}`;
/* c × 2^λ as text: '2.5 ÷ 64' for λ = −6, '3 × 4' for λ = 2, so no long decimal is printed. */
const by2 = (c, l) => l < 0 ? `${par(c)} ÷ ${n(Math.pow(2, -l))}` : `${par(c)} × ${n(Math.pow(2, l))}`;
const r3 = x => Math.round(x * 1000) / 1000;
const exact3 = x => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7;
/* True when x sits within 0.05 of a step of a rounding tie at k places. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
/* Bounded retry: at most 1000 tries, then the canonical parameters. */
const tryDraw = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const det2 = M => M[0][0] * M[1][1] - M[0][1] * M[1][0];
const tidy = G.tidy;
/* A = P D P⁻¹ with P = (1, 1; m, m + 1): eigenvectors (1, m) for l1 and (1, m + 1) for l2. */
const fromReal = (l1, l2, m) => [[l1 * (m + 1) - l2 * m, l2 - l1], [m * (m + 1) * (l1 - l2), (m + 1) * l2 - m * l1]];
/* A matrix with eigenvalues a ± bi, from (a, −b; b, a) by a shear with m; flip uses the other shear. */
const fromComplex = (a, b, m, flip) => flip ? [[a - m * b, -b * (1 + m * m)], [b, a + m * b]] : [[a + m * b, -b], [b * (1 + m * m), a - m * b]];
const big = M => M.some(r => r.some(v => Math.abs(v) > 12));
/* The two equations of x′ = Ax as text. */
const eqs = A => `x₁′ = ${lin(A[0][0], A[0][1])} and x₂′ = ${lin(A[1][0], A[1][1])}`;
/* y″ + P y′ + Q y = 0 as text, leaving out a zero P. */
const ode2 = (P, Q) => `y″${P === 0 ? '' : ' ' + trm(P, 'y′')} ${trm(Q, 'y')} = 0`;
/* The kind of phase portrait, 1 node, 2 saddle, 3 spiral, 4 centre, and the stable code, from the trace and determinant. */
const kindOf = (tr, dt) => { const disc = tr * tr - 4 * dt; return dt < 0 ? 2 : disc > 0 ? 1 : tr === 0 ? 4 : 3; };
const stableOf = (kind, tr) => kind === 2 ? 0 : kind === 4 ? 1 : tr < 0 ? 1 : 0;
const KIND_NAME = ['', 'node', 'saddle', 'spiral', 'centre'];
/* Why that kind, and why that stability: the sentences the learn mission q28 uses. */
const whyKind = kind => kind === 2 ? 'The determinant is negative, so the eigenvalues are real with opposite signs: a saddle.' : kind === 1 ? 'The determinant is positive and the discriminant is positive, so the eigenvalues are real with the same sign: a node.' : kind === 3 ? 'The discriminant is negative and the trace is not zero, so the eigenvalues are complex with real part trace ÷ 2: a spiral.' : 'The discriminant is negative and the trace is zero, so the eigenvalues are ±bi: a centre.';
const whyStable = (kind, tr) => kind === 2 ? 'A saddle is unstable: most trajectories leave along the eigenvector of the positive eigenvalue.' : kind === 4 ? 'A centre is stable in the sense used here: trajectories circle the origin and stay near it.' : tr < 0 ? 'The trace is negative, so the real parts are negative and trajectories close in on the origin: stable.' : 'The trace is positive, so the real parts are positive and trajectories run away from the origin: unstable.';
const STABLE_DEF = 'Here stable means every trajectory that starts near the origin stays near it for all later time, so a centre counts as stable.';
/* Two linked tanks, fresh water in at f, V1 and V2 litres, flow g back: the sets of the learn mission q29 (found by a
   search over V in {10, 20, 25, 40, 50} and flows up to 40 so both eigenvalues are whole numbers). */
const TANKS29 = [[10, 10, 15, 5], [10, 10, 16, 9], [10, 10, 24, 1], [10, 10, 30, 10], [10, 10, 40, 5], [10, 20, 25, 15], [10, 25, 30, 20], [20, 10, 25, 15], [20, 20, 30, 10], [20, 20, 32, 18], [25, 10, 30, 20]];
/* Tank-set maths: inlet tank volume VI, outlet tank volume VO, fresh flow f, return flow g. The salt matrix of (inlet, outlet) is
   (−a, b; a, −c) with a = (f + g) ÷ VI, b = g ÷ VO, c = (f + g) ÷ VO. */
const tankMath = (VI, VO, f, g) => { const a = tidy((f + g) / VI), b = tidy(g / VO), c = tidy((f + g) / VO), tr = tidy(a + c), dt = tidy(a * (c - b)),
 root = Math.sqrt(tr * tr - 4 * dt), l1 = Math.round((-tr - root) / 2), l2 = Math.round((-tr + root) / 2); return { a, b, c, tr, dt, l1, l2 }; };
/* Tanks with two fresh inlets and two drains, found by a search over V in {10, 20, 25, 40, 50} and flows up to 40:
   [V1, V2, f1, f2, u (1 to 2), w (2 to 1), d1, d2], f1 + w = u + d1 and f2 + u = w + d2, both eigenvalues whole and negative. */
const TANKS29C = [[10, 20, 10, 20, 2, 19, 27, 3], [10, 25, 8, 26, 4, 10, 14, 20], [10, 25, 10, 25, 5, 18, 23, 12], [10, 40, 10, 40, 4, 19, 25, 25], [20, 25, 16, 26, 4, 20, 32, 10], [20, 10, 3, 27, 2, 19, 20, 10],
 [25, 10, 12, 23, 5, 18, 25, 10], [25, 20, 10, 32, 4, 20, 26, 16], [25, 25, 10, 40, 5, 20, 25, 25], [40, 20, 21, 39, 14, 33, 40, 20], [20, 25, 13, 28, 12, 35, 36, 5], [25, 20, 5, 36, 12, 35, 28, 13], [10, 10, 3, 24, 4, 9, 8, 19], [20, 10, 8, 31, 7, 16, 17, 22], [40, 25, 28, 37, 8, 20, 40, 25]];
/* q29b: the tank set i of TANKS29 with the roles turned round. VI (volume of the tank clean water enters) is the set's V1 and VO (the tank
   that drains, shown first) is its V2. x₁ is the drained tank: x₁′ = −c·x₁ + a·x₂. */
const tank29b = ({ i, s1, s2 }) => { const [VI, VO, f, g] = TANKS29[i], m = tankMath(VI, VO, f, g), d0 = tidy(-m.c * s1 + m.a * s2),
 p = tidy((d0 - m.l2 * s1) / (m.l1 - m.l2)), q = tidy(s1 - p); return { ...m, VI, VO, f, g, d0, p, q, x1: p * Math.pow(2, m.l1) + q * Math.pow(2, m.l2) }; };
/* q29c: the salt matrix of a TANKS29C row is (−al, be; de, −ga). */
const tank29c = ({ i, s1, s2 }) => { const [V1, V2, f1, f2, u, w, d1, d2] = TANKS29C[i], al = tidy((u + d1) / V1), be = tidy(w / V2), de = tidy(u / V1), ga = tidy((w + d2) / V2),
 tr = tidy(al + ga), dt = tidy(al * ga - be * de), root = Math.sqrt(tr * tr - 4 * dt), l1 = Math.round((-tr - root) / 2), l2 = Math.round((-tr + root) / 2),
 d0 = tidy(-al * s1 + be * s2), p = tidy((d0 - l2 * s1) / (l1 - l2)), q = tidy(s1 - p); return { V1, V2, f1, f2, u, w, d1, d2, al, be, de, ga, tr, dt, l1, l2, d0, p, q, x1: p * Math.pow(2, l1) + q * Math.pow(2, l2) }; };
/* q29d: the tank set i of TANKS29 fed with brine of concentration k; y = x − k·V. */
const tank29d = ({ i, s1, s2, k }) => { const [V1, V2, f, g] = TANKS29[i], m = tankMath(V1, V2, f, g), eq1 = tidy(k * V1), eq2 = tidy(k * V2), Y1 = tidy(s1 - eq1), Y2 = tidy(s2 - eq2),
 D = tidy(-m.a * Y1 + m.b * Y2), p = tidy((D - m.l2 * Y1) / (m.l1 - m.l2)), q = tidy(Y1 - p); return { ...m, V1, V2, f, g, eq1, eq2, Y1, Y2, D, p, q, x1: eq1 + p * Math.pow(2, m.l1) + q * Math.pow(2, m.l2) }; };
/* ℒ pieces. */
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const SUPK = { 1: 't', 2: 't²', 3: 't³', 4: 't⁴' };
const lapTrig = (trig, c, b, s) => c * (trig === 'sin' ? b : s) / (s * s + b * b);

/* q30d: ℒ of each of the four pieces at s. */
const d28 = ({ al, k, be, a, ga, b1, de, b2, s }) => { const P = al * fact(k) / Math.pow(s, k + 1), X = be / (s - a), Q = lapTrig('sin', ga, b1, s), C = lapTrig('cos', de, b2, s); return { P, X, Q, C, F: P + X + Q + C }; };
/* q30d: ℒ of each of the four pieces at s. */
const d30 = ({ al, k, be, a, ga, b1, de, b2, s }) => { const P = al * fact(k) / Math.pow(s, k + 1), X = be / (s - a), Q = lapTrig('sin', ga, b1, s), C = lapTrig('cos', de, b2, s); return { P, X, Q, C, F: P + X + Q + C }; };
/* ---- q26 The eigenvalue method: real eigenvalues [3.4] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The cabinet fans',
 brief: 'Two fans in the control cabinet drag each other away from their set speeds, and the crew needs the second fan’s drift a moment after a disturbance.',
 labels: ['smaller eigenvalue', 'larger eigenvalue', 'x₂ at t = ln 2'], tolerance: 0.0005,
 gl: [['smaller eigenvalue'], ['larger eigenvalue'], ['second component'], ['c₁'], ['x₂ at t = ln 2']]
}, {
 /* A from fromReal (distinct non-zero whole eigenvalues, −3 to 3, entries at most 12), start x(0) = c₁(1, m) + c₂(1, m + 1) with
    whole c₁ and c₂, so x₂ = c₁m·2^λ₁ + c₂(m + 1)·2^λ₂ at t = ln 2 is an exact decimal of at most three places. The learn mission asks
    for x₁ from the rows of A; here the system is written as two equations and the answer is x₂. */
 canonical: { l1: -3, l2: -1, m: -2, c1: 2, c2: 1 },
 draw: R => tryDraw(() => { const a = R.nz(-3, 3), b = R.nz(-3, 3); return { l1: Math.min(a, b), l2: Math.max(a, b), m: R.pick([-3, -2, 1, 2]), c1: R.nz(-3, 3), c2: R.nz(-3, 3) }; },
  p => p.l1 !== p.l2 && !big(fromReal(p.l1, p.l2, p.m)), { l1: -3, l2: -1, m: -2, c1: 2, c2: 1 }),
 build: ({ l1, l2, m, c1, c2 }) => { const A = fromReal(l1, l2, m), x0 = [c1 + c2, c1 * m + c2 * (m + 1)], e1 = Math.pow(2, l1), e2 = Math.pow(2, l2),
  k1 = c1 * m, k2 = c2 * (m + 1), x2 = tidy(k1 * e1 + k2 * e2), tr = A[0][0] + A[1][1], dt = det2(A); return {
  prompt: `Two linked fans in the control cabinet drift from their set speeds. Their deviations x₁ and x₂, in revolutions per minute, obey ${eqs(A)}, with t in minutes. A disturbance at t = 0 leaves x₁ = ${n(x0[0])} and x₂ = ${n(x0[1])}. Enter the eigenvalues of the matrix of coefficients in increasing order, then the second fan’s deviation x₂ at t = ln 2 (about 0.693 minutes). At that time e^(λt) = 2^λ, so x₂ is an exact short decimal.`,
  answer: [l1, l2, x2],
  hints: ['The coefficients of x₁ and x₂ in each equation are a row of A. The eigenvalues are the roots of λ² − (trace)λ + (determinant) = 0.', 'Find an eigenvector for each eigenvalue and fit x(0) = c₁v₁ + c₂v₂. Then x(t) = c₁e^(λ₁t)v₁ + c₂e^(λ₂t)v₂, and the answer is its second component at t = ln 2.'],
  solution: `The matrix has rows ${G.vec(A[0])} and ${G.vec(A[1])}, so its trace is ${n(tr)} and its determinant is ${n(dt)}. Then ${quad(tr, dt)}, with roots ${n(l1)} and ${n(l2)}. Solving (A − λI)v = 0 gives v₁ = ${G.vec([1, m])} for ${n(l1)} and v₂ = ${G.vec([1, m + 1])} for ${n(l2)}. From ${G.vec(x0)} = c₁${G.vec([1, m])} + c₂${G.vec([1, m + 1])}, c₁ = ${n(c1)} and c₂ = ${n(c2)}. So x₂(t) = ${pair(k1, l1, k2, l2)}, and at t = ln 2 it is ${sum2(k1, e1, k2, e2)} = ${n(x2)}.`,
  guidance: [
   { prompt: `The matrix has trace ${n(tr)} and determinant ${n(dt)}. What is the smaller eigenvalue?`, answer: [l1], explanation: `${quad(tr, dt).replace(' = 0', '')} = ${fac(l1)}${fac(l2)}, so the roots are ${n(l1)} and ${n(l2)}.` },
   { prompt: `What is the larger eigenvalue?`, answer: [l2], explanation: `The other root of the same equation is ${n(l2)}.` },
   { prompt: `An eigenvector for ${n(l1)} has first component 1. What is its second component?`, answer: [m], explanation: `The first row of (A − λI)v = 0 is ${n(A[0][0] - l1)} × 1 ${trm(A[0][1], 'v₂')} = 0, so v₂ = ${n(m)}.` },
   { prompt: `An eigenvector for ${n(l2)} is ${G.vec([1, m + 1])}. Write x(0) = ${G.vec(x0)} as c₁${G.vec([1, m])} + c₂${G.vec([1, m + 1])}. What is c₁?`, answer: [c1], explanation: `The first components give c₁ + c₂ = ${n(x0[0])} and the second give ${cf(m, 'c₁')} ${trm(m + 1, 'c₂')} = ${n(x0[1])}. Subtracting ${n(m)} times the first from the second leaves c₂ = ${n(c2)}, so c₁ = ${n(c1)}.` },
   { prompt: `x₂(t) = ${pair(k1, l1, k2, l2)}. What is x₂ at t = ln 2?`, answer: [x2], explanation: `e^(λ ln 2) = 2^λ, so x₂ = ${sum2(k1, e1, k2, e2)} = ${n(x2)}.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'What the oven dials settle to',
 brief: 'After a power flicker two ovens drift for a long while, and the crew wants to know what fixed ratio the two dials will show.',
 labels: ['smaller eigenvalue', 'larger eigenvalue', 'settled ratio x₂ ÷ x₁'], tolerance: 0.01,
 gl: [['smaller eigenvalue'], ['larger eigenvalue'], ['settled ratio x₂ ÷ x₁']]
}, {
 /* Same family as q26b. The settled ratio is the second component of the eigenvector (1, m + 1) of the larger eigenvalue; c₂ is never
    0, so that term really is present. Never the worked example (A with rows (1, 2) and (2, 1)). */
 canonical: { l1: -2, l2: 2, m: -3, c1: 1, c2: 2 },
 draw: R => tryDraw(() => { const a = R.nz(-3, 3), b = R.nz(-3, 3); return { l1: Math.min(a, b), l2: Math.max(a, b), m: R.pick([-3, -2, 1, 2]), c1: R.nz(-3, 3), c2: R.nz(-3, 3) }; },
  p => p.l1 !== p.l2 && !big(fromReal(p.l1, p.l2, p.m)), { l1: -2, l2: 2, m: -3, c1: 1, c2: 2 }),
 build: ({ l1, l2, m, c1, c2 }) => { const A = fromReal(l1, l2, m), x0 = [c1 + c2, c1 * m + c2 * (m + 1)], tr = A[0][0] + A[1][1], dt = det2(A), ratio = m + 1; return {
  prompt: `After a power flicker, two ovens in the Control Room drift away from their set temperatures. Their deviations x₁ and x₂, in °C, obey ${eqs(A)}, with t in minutes, and the flicker leaves x₁ = ${n(x0[0])} and x₂ = ${n(x0[1])} at t = 0. As t grows, the term of the solution with the larger eigenvalue becomes far bigger than the other, and then the pair (x₁, x₂) points along that term’s eigenvector. This start does include some of that term. Enter the eigenvalues of the matrix of coefficients in increasing order, then the ratio x₂ ÷ x₁ that the two dials settle to.`,
  answer: [l1, l2, ratio],
  hints: ['The coefficients of x₁ and x₂ in each equation are a row of A. The eigenvalues are the roots of λ² − (trace)λ + (determinant) = 0.', 'In x(t) = c₁e^(λ₁t)v₁ + c₂e^(λ₂t)v₂ the exponential with the larger λ wins as t grows. The ratio of the components of its eigenvector v is the ratio x₂ ÷ x₁ in the long run.'],
  solution: `The matrix has rows ${G.vec(A[0])} and ${G.vec(A[1])}, so its trace is ${n(tr)} and its determinant is ${n(dt)}. Then ${quad(tr, dt)}, with roots ${n(l1)} and ${n(l2)}. For the larger eigenvalue ${n(l2)}, the first row of (A − λI)v = 0 is ${n(A[0][0] - l2)} × 1 ${trm(A[0][1], 'v₂')} = 0, so v = ${G.vec([1, ratio])}. The start ${G.vec(x0)} = c₁${G.vec([1, m])} + c₂${G.vec([1, ratio])} has c₂ = ${n(c2)}, which is not 0, so the term with ${ex(l2)} is present and wins. The dials settle to x₂ ÷ x₁ = ${n(ratio)}.`,
  guidance: [
   { prompt: `The matrix has trace ${n(tr)} and determinant ${n(dt)}. What is the smaller eigenvalue?`, answer: [l1], explanation: `${quad(tr, dt).replace(' = 0', '')} = ${fac(l1)}${fac(l2)}, so the roots are ${n(l1)} and ${n(l2)}.` },
   { prompt: `What is the larger eigenvalue?`, answer: [l2], explanation: `The other root of the same equation is ${n(l2)}.` },
   { prompt: `An eigenvector for the larger eigenvalue ${n(l2)} has first component 1. Its second component is the settled ratio x₂ ÷ x₁. What is it?`, answer: [ratio], explanation: `The first row of (A − λI)v = 0 is ${n(A[0][0] - l2)} × 1 ${trm(A[0][1], 'v₂')} = 0, so v₂ = ${n(ratio)}.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q24', title: 'The mast as a system',
 brief: 'The control tower’s mast sways like a spring, and the crew wants its sway a short time after a push, found by writing the spring as a system.',
 labels: ['smaller eigenvalue', 'larger eigenvalue', 'y at t = ln 2'], tolerance: 0.0005,
 gl: [['bottom-left entry of A'], ['smaller eigenvalue'], ['larger eigenvalue'], ['c₁'], ['y at t = ln 2']]
}, {
 /* y″ + Py′ + Qy = 0 with roots l1 < l2 (whole, non-zero, −3 to 4), so P = −(l1 + l2) and Q = l1·l2. y(0) = c₁ + c₂ and
    y′(0) = c₁l1 + c₂l2 with whole c₁, c₂, so y = c₁2^l1 + c₂2^l2 at t = ln 2 is an exact decimal of at most three places. */
 canonical: { l1: -3, l2: 2, c1: 3, c2: -2 },
 draw: R => tryDraw(() => { const a = R.nz(-3, 4), b = R.nz(-3, 4); return { l1: Math.min(a, b), l2: Math.max(a, b), c1: R.nz(-4, 4), c2: R.nz(-4, 4) }; },
  p => p.l1 !== p.l2, { l1: -3, l2: 2, c1: 3, c2: -2 }),
 build: ({ l1, l2, c1, c2 }) => { const P = -(l1 + l2), Q = l1 * l2, Y0 = c1 + c2, V0 = c1 * l1 + c2 * l2, e1 = Math.pow(2, l1), e2 = Math.pow(2, l2), y = tidy(c1 * e1 + c2 * e2); return {
  prompt: `The sway y of the control tower’s mast, in centimetres, obeys ${ode2(P, Q)}, with t in seconds. A push at t = 0 gives y = ${n(Y0)} and y′ = ${n(V0)}. Writing x₁ = y and x₂ = y′ turns the equation into a first-order system x′ = Ax. Enter the eigenvalues of A in increasing order, then the sway y at t = ln 2 (about 0.693 seconds). At that time e^(λt) = 2^λ, so y is an exact short decimal.`,
  answer: [l1, l2, y],
  hints: ['Since x₁′ = x₂ and x₂′ = y″, write y″ in terms of y′ and y to get the second row of A; the first row is (0, 1). The eigenvalues are the roots of λ² − (trace)λ + (determinant) = 0.', 'For an eigenvalue λ the first row of (A − λI)v = 0 gives v₂ = λv₁, so (1, λ) is an eigenvector. Fit x(0) = c₁v₁ + c₂v₂; then y is the first component x₁ of x(t).'],
  solution: `Here x₂′ = y″ = ${lin(-P, -Q, 'y′', 'y')} = ${lin(-Q, -P)}, so A has rows (0, 1) and ${G.vec([-Q, -P])}. Its trace is ${n(-P)} and its determinant is ${n(Q)}, so ${quad(-P, Q)}, with roots ${n(l1)} and ${n(l2)}. The vectors ${G.vec([1, l1])} and ${G.vec([1, l2])} are eigenvectors. From x(0) = ${G.vec([Y0, V0])} = c₁${G.vec([1, l1])} + c₂${G.vec([1, l2])}, c₁ = ${n(c1)} and c₂ = ${n(c2)}. So y(t) = ${pair(c1, l1, c2, l2)}, and at t = ln 2 it is ${sum2(c1, e1, c2, e2)} = ${n(y)}.`,
  guidance: [
   { prompt: `The equation gives y″ = ${lin(-P, -Q, 'y′', 'y')}. With x₁ = y and x₂ = y′, the second equation of the system is x₂′ = y″, a mix of x₁ and x₂. What is the coefficient of x₁ in it, the bottom-left entry A₂₁ of A?`, answer: [-Q], explanation: `x₂′ = y″ = ${lin(-P, -Q, 'y′', 'y')} = ${lin(-Q, -P)}, so the rows of A are (0, 1) and ${G.vec([-Q, -P])}, and A₂₁ = ${n(-Q)}.` },
   { prompt: `A has trace ${n(-P)} and determinant ${n(Q)}. What is the smaller eigenvalue?`, answer: [l1], explanation: `${quad(-P, Q).replace(' = 0', '')} = ${fac(l1)}${fac(l2)}, so the roots are ${n(l1)} and ${n(l2)}.` },
   { prompt: `What is the larger eigenvalue?`, answer: [l2], explanation: `The other root of the same equation is ${n(l2)}.` },
   { prompt: `Eigenvectors are ${G.vec([1, l1])} and ${G.vec([1, l2])}. Write x(0) = ${G.vec([Y0, V0])} as c₁${G.vec([1, l1])} + c₂${G.vec([1, l2])}. What is c₁?`, answer: [c1], explanation: `The first components give c₁ + c₂ = ${n(Y0)} and the second give ${cf(l1, 'c₁')} ${trm(l2, 'c₂')} = ${n(V0)}. Subtracting ${n(l1)} times the first from the second leaves (${n(l2)} − ${par(l1)})c₂ = ${n(V0 - l1 * Y0)}, so c₂ = ${n(c2)} and c₁ = ${n(c1)}.` },
   { prompt: `y(t) = ${pair(c1, l1, c2, l2)}. What is y at t = ln 2?`, answer: [y], explanation: `e^(λ ln 2) = 2^λ, so y = ${sum2(c1, e1, c2, e2)} = ${n(y)}.` }
  ] }; }
});

/* ---- q27 Complex eigenvalues [3.4] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The wobbling camera gimbal',
 brief: 'The camera gimbal on the control tower wobbles about its aim, and the crew needs to know how fast the wobble turns and how quickly it grows or fades.',
 labels: ['growth rate a', 'angular frequency b (rad/s)', 'turns per second'], tolerance: 0.0005,
 gl: [['trace'], ['determinant'], ['growth rate a'], ['angular frequency b (rad/s)'], ['turns per second']]
}, {
 /* A with eigenvalues a ± bi from fromComplex (a −3 to 3, b 1 to 4, shear −2 to 2, either way, entries at most 12). The frequency b ÷ 2π is
    0.159, 0.318, 0.477 or 0.637 to 3 places, never near a tie. Never the worked example (rows (0, −1) and (1, 0)). */
 canonical: { a: 2, b: 3, m: -1, flip: true },
 draw: R => tryDraw(() => ({ a: R.int(-3, 3), b: R.int(1, 4), m: R.int(-2, 2), flip: R.bool() }),
  p => !big(fromComplex(p.a, p.b, p.m, p.flip)) && !(p.a === 0 && p.b === 1 && p.m === 0), { a: 2, b: 3, m: -1, flip: true }),
 build: ({ a, b, m, flip }) => { const A = fromComplex(a, b, m, flip), tr = 2 * a, dt = a * a + b * b, disc = tr * tr - 4 * dt, fr = r3(b / (2 * Math.PI)); return {
  prompt: `The camera gimbal on the control tower wobbles about its aim. Its two wobble angles x₁ and x₂, in milliradians, obey ${eqs(A)}, with t in seconds. The eigenvalues of the matrix of coefficients are complex, a ± bi with b > 0. Enter the growth rate a, then the angular frequency b in rad/s, then the number of full turns the wobble makes each second, b ÷ 2π, to 3 decimal places.`,
  answer: [a, b, fr],
  hints: ['The coefficients of x₁ and x₂ in each equation are a row of A. The eigenvalues solve λ² − (trace)λ + (determinant) = 0, and when (trace)² − 4 × (determinant) is negative they are a ± bi.', 'a is half the trace, and b is half of √(4 × determinant − trace²). One full turn takes 2π ÷ b seconds, so there are b ÷ 2π turns in each second.'],
  solution: `The matrix has rows ${G.vec(A[0])} and ${G.vec(A[1])}, so its trace is ${n(tr)} and its determinant is ${n(dt)}, and ${quad(tr, dt)}. Then (trace)² − 4 × (determinant) = ${n(disc)}, which is negative, and λ = ${n(tr)} ÷ 2 ± i√${n(-disc)} ÷ 2 = ${n(a)} ± ${b === 1 ? '' : n(b)}i. So a = ${n(a)} and b = ${n(b)} rad/s. The wobble makes b ÷ 2π = ${n(b)} ÷ 6.2832 ≈ ${n(fr)} turns each second.`,
  guidance: [
   { prompt: `What is the trace of the matrix of coefficients, the sum of its diagonal entries?`, answer: [tr], explanation: `${n(A[0][0])} + ${par(A[1][1])} = ${n(tr)}.` },
   { prompt: `What is the determinant of the matrix?`, answer: [dt], explanation: `${n(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${n(dt)}.` },
   { prompt: `What is the growth rate a, the real part of the eigenvalues?`, answer: [a], explanation: `a = trace ÷ 2 = ${n(tr)} ÷ 2 = ${n(a)}.` },
   { prompt: `What is b, the imaginary part with b > 0?`, answer: [b], explanation: `4 × ${n(dt)} − ${n(tr * tr)} = ${n(-disc)}, and b = √${n(-disc)} ÷ 2 = ${n(b)}.` },
   { prompt: `What is b ÷ 2π, the turns per second, to 3 decimal places?`, answer: [fr], explanation: `${n(b)} ÷ (2π) ≈ ${n(fr)} turns per second to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The mast damper',
 brief: 'A damper on the sensor mast makes it sway in ever smaller swings, and the crew wants to know how much of each swing is left one turn later.',
 labels: ['growth rate a', 'angular frequency b (rad/s)', 'size factor per turn'], tolerance: 0.0005,
 gl: [['growth rate a'], ['angular frequency b (rad/s)'], ['size factor per turn']]
}, {
 /* m y″ + c y′ + k y = 0 with k ÷ m = a² + b² and c ÷ m = −2a, so A has rows (0, 1) and (−(a² + b²), 2a) and eigenvalues a ± bi. a is −1 to −3
    and b is 1 to 5 with −a ÷ b at most 0.7, so the factor e^(2πa ÷ b) is at least 0.01 and is never near a rounding tie. */
 canonical: { a: -1, b: 3, m: 2 },
 draw: R => tryDraw(() => ({ a: R.int(-3, -1), b: R.int(1, 5), m: R.pick([1, 2, 4, 5]) }),
  p => -p.a / p.b <= 0.7 && !edge(Math.exp(2 * Math.PI * p.a / p.b), 3), { a: -1, b: 3, m: 2 }),
 build: ({ a, b, m }) => { const C = -2 * a, K = a * a + b * b, c = m * C, k = m * K, tr = -C, dt = K, disc = tr * tr - 4 * dt, fac1 = r3(Math.exp(2 * Math.PI * a / b)); return {
  prompt: `A damper on the sensor mast makes it sway in ever smaller swings. Its sway y, in centimetres, obeys ${m === 1 ? '' : n(m)}y″ + ${n(c)}y′ + ${n(k)}y = 0, with t in seconds. Writing x₁ = y and x₂ = y′ turns this into x′ = Ax, where A has rows (0, 1) and (−k ÷ m, −c ÷ m). Its eigenvalues are complex, a ± bi with b > 0. One full turn of the sway takes 2π ÷ b seconds, and over that time the size of the sway is multiplied by e^(a × 2π ÷ b). Enter the growth rate a, then the angular frequency b in rad/s, then that factor to 3 decimal places.`,
  answer: [a, b, fac1],
  hints: ['The eigenvalues solve λ² − (trace)λ + (determinant) = 0, where the trace is the sum of the diagonal entries of A. When (trace)² − 4 × (determinant) is negative they are a ± bi.', 'a is half the trace, and b is half of √(4 × determinant − trace²). For the factor, put the turn time 2π ÷ b into e^(a × 2π ÷ b) on a calculator.'],
  solution: `A has rows (0, 1) and (−${n(K)}, −${n(C)}), so its trace is ${n(tr)} and its determinant is ${n(dt)}, and ${quad(tr, dt)}. Then (trace)² − 4 × (determinant) = ${n(disc)}, which is negative, and λ = ${n(tr)} ÷ 2 ± i√${n(-disc)} ÷ 2 = ${n(a)} ± ${b === 1 ? '' : n(b)}i. So a = ${n(a)} and b = ${n(b)} rad/s. One turn takes 2π ÷ ${n(b)} seconds, so the sway is multiplied by e^(${n(a)} × 2π ÷ ${n(b)}) ≈ ${n(fac1)}.`,
  guidance: [
   { prompt: `Here k ÷ m = ${n(K)} and c ÷ m = ${n(C)}, so A has rows (0, 1) and (−${n(K)}, −${n(C)}). What is the growth rate a, half the trace?`, answer: [a], explanation: `The trace is 0 + (−${n(C)}) = ${n(tr)}, so a = ${n(tr)} ÷ 2 = ${n(a)}.` },
   { prompt: `The determinant of A is ${n(dt)} and its trace is ${n(tr)}. What is b, half of √(4 × determinant − trace²)?`, answer: [b], explanation: `4 × ${n(dt)} − ${n(tr * tr)} = ${n(-disc)}, and b = √${n(-disc)} ÷ 2 = ${n(b)}.` },
   { prompt: `One turn takes 2π ÷ ${n(b)} seconds. What is e^(${n(a)} × 2π ÷ ${n(b)}), to 3 decimal places?`, answer: [fac1], explanation: `${n(a)} × 2π ÷ ${n(b)} ≈ ${n(Math.round(1e4 * 2 * Math.PI * a / b) / 1e4)}, and e raised to that is ${n(fac1)} to 3 decimal places.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', title: 'Coupled gyroscopes',
 brief: 'Two coupled gyroscopes in the control tower have a matrix with awkward entries, and the crew needs their exact turning rate and turn time.',
 labels: ['growth rate a', 'angular frequency b (rad/s)', 'time for one turn (s)'], tolerance: 0.0005,
 gl: [['trace'], ['determinant'], ['growth rate a'], ['angular frequency b (rad/s)'], ['time for one turn (s)']]
}, {
 /* A with entries from −9 to 9, complex eigenvalues, and 4·det − trace² not a perfect square, so b = √(4·det − trace²) ÷ 2 is not whole and
    a may be a half. b and the turn time are not near a rounding tie, and the turn time is the same whether b is rounded first or not. */
 canonical: { a11: 2, a12: -4, a21: 3, a22: 1 },
 draw: R => tryDraw(() => ({ a11: R.int(-9, 9), a12: R.int(-9, 9), a21: R.int(-9, 9), a22: R.int(-9, 9) }),
  p => { const tr = p.a11 + p.a22, dt = p.a11 * p.a22 - p.a12 * p.a21, D = 4 * dt - tr * tr; if (D <= 0 || Number.isInteger(Math.sqrt(D))) return false;
   const b = Math.sqrt(D) / 2, T = 2 * Math.PI / b; return !edge(b, 3) && !edge(T, 3) && r3(2 * Math.PI / r3(b)) === r3(T); }, { a11: 2, a12: -4, a21: 3, a22: 1 }),
 build: ({ a11, a12, a21, a22 }) => { const tr = a11 + a22, dt = a11 * a22 - a12 * a21, D = 4 * dt - tr * tr, a = tr / 2, b = Math.sqrt(D) / 2, T = 2 * Math.PI / b; return {
  prompt: `Two coupled gyroscopes in the control tower have deviations that obey x′ = Ax, where A has rows ${G.vec([a11, a12])} and ${G.vec([a21, a22])} and t is in seconds. The eigenvalues are complex, a ± bi with b > 0, and this time b is not a whole number. Enter the growth rate a, then the angular frequency b in rad/s to 3 decimal places, then the time for one full turn, 2π ÷ b, in seconds to 3 decimal places (work it out from the exact b, not the rounded one).`,
  answer: [a, r3(b), r3(T)],
  hints: ['The eigenvalues solve λ² − (trace)λ + (determinant) = 0. Check that (trace)² − 4 × (determinant) is negative; then a is half the trace.', 'b is half of √(4 × determinant − trace²). Keep the square root unrounded on the calculator and round only when you write each answer.'],
  solution: `The trace is ${n(tr)} and the determinant is ${n(dt)}, so ${quad(tr, dt)}. Then (trace)² − 4 × (determinant) = ${n(tr * tr - 4 * dt)}, which is negative, and λ = ${n(tr)} ÷ 2 ± i√${n(D)} ÷ 2. So a = ${n(a)}, and b = √${n(D)} ÷ 2 ≈ ${n(r3(b))} rad/s. One full turn takes 2π ÷ b ≈ ${n(r3(T))} seconds, using the exact b.`,
  guidance: [
   { prompt: `What is the trace of A, the sum of its diagonal entries?`, answer: [tr], explanation: `${n(a11)} + ${par(a22)} = ${n(tr)}.` },
   { prompt: `What is the determinant of A?`, answer: [dt], explanation: `${n(a11)} × ${par(a22)} − ${par(a12)} × ${par(a21)} = ${n(dt)}.` },
   { prompt: `What is the growth rate a, the real part of the eigenvalues?`, answer: [a], explanation: `a = trace ÷ 2 = ${n(tr)} ÷ 2 = ${n(a)}.` },
   { prompt: `What is b, half of √(4 × determinant − trace²), to 3 decimal places?`, answer: [r3(b)], explanation: `4 × ${n(dt)} − ${n(tr * tr)} = ${n(D)}, and b = √${n(D)} ÷ 2 ≈ ${n(r3(b))} to 3 decimal places.` },
   { prompt: `What is 2π ÷ b, to 3 decimal places?`, answer: [r3(T)], explanation: `2π ÷ ${n(r3(b))} ≈ ${n(r3(T))} seconds to 3 decimal places.` }
  ] }; }
});

/* ---- q28 Phase portraits [3.5] ---- */

/* A matrix of the chosen kind (1 node, 2 saddle, 3 spiral, 4 centre) from the parameters, as in the learn mission q28. */
const matrix28 = ({ kind, a, b, m, flip }) => kind <= 2 ? fromReal(Math.min(a, b), Math.max(a, b), m === 0 ? 1 : m) : fromComplex(a, b, m, flip);
const draw28 = R => { const kind = R.int(1, 4), m = R.int(-2, 2), flip = R.bool();
 if (kind <= 2) { const x = R.int(1, 4), y = R.int(1, 4), sg = R.pick([-1, 1]); return { kind, a: sg * x, b: kind === 1 ? sg * y : -sg * y, m, flip }; }
 return { kind, a: kind === 4 ? 0 : R.nz(-3, 3), b: R.int(1, 3), m, flip }; };
const ok28 = p => { if (p.kind <= 2 && p.a === p.b) return false; const A = matrix28(p); return !big(A) && !(A[0][0] === -3 && A[0][1] === 0 && A[1][0] === 0 && A[1][1] === -1); };

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The linked flywheels',
 brief: 'Two flywheels in the control tower are geared together, and the crew wants to know the shape of their motion and whether they calm down.',
 labels: ['discriminant', 'portrait code', 'stable (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['trace'], ['determinant'], ['discriminant'], ['portrait code'], ['stable (1 yes, 0 no)']]
}, {
 /* One of the four kinds, chosen first, as in q28; never a zero or repeated eigenvalue. The system is written as two equations and the
    discriminant is asked for instead of the trace and determinant. */
 canonical: { kind: 2, a: 2, b: -3, m: 1, flip: false },
 draw: R => tryDraw(() => draw28(R), ok28, { kind: 2, a: 2, b: -3, m: 1, flip: false }),
 build: p => { const A = matrix28(p), kind = p.kind, tr = A[0][0] + A[1][1], dt = det2(A), disc = tr * tr - 4 * dt, st = stableOf(kind, tr); return {
  prompt: `Two flywheels in the control tower are geared together. Their speed deviations x₁ and x₂, in rad/s, obey ${eqs(A)}, with t in seconds, so x′ = Ax for the matrix A of coefficients. Enter the discriminant (trace)² − 4 × (determinant) of A, then the kind of phase portrait at the origin as a code (1 node, 2 saddle, 3 spiral, 4 centre), then 1 if the origin is stable, 0 if not. ${STABLE_DEF}`,
  answer: [disc, kind, st],
  hints: ['The coefficients of x₁ and x₂ in each equation are a row of A. The eigenvalues solve λ² − (trace)λ + (determinant) = 0. A negative determinant means real eigenvalues of opposite signs; otherwise look at the sign of the discriminant.', 'Real eigenvalues of one sign give a node; complex ones give a spiral, or a centre when the trace is zero. Negative real parts pull trajectories in (stable), positive ones push them out, and a saddle is always unstable.'],
  solution: `The matrix has rows ${G.vec(A[0])} and ${G.vec(A[1])}. The trace is ${n(A[0][0])} + ${par(A[1][1])} = ${n(tr)} and the determinant is ${n(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${n(dt)}. The discriminant is ${n(tr * tr)} − 4 × ${par(dt)} = ${n(disc)}. ${whyKind(kind)} ${whyStable(kind, tr)} The codes are ${n(kind)} (${KIND_NAME[kind]}) and ${n(st)}.`,
  guidance: [
   { prompt: `What is the trace of A, the sum of its diagonal entries?`, answer: [tr], explanation: `${n(A[0][0])} + ${par(A[1][1])} = ${n(tr)}.` },
   { prompt: `What is the determinant of A?`, answer: [dt], explanation: `${n(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${n(dt)}.` },
   { prompt: `What is the discriminant, (trace)² − 4 × (determinant)?`, answer: [disc], explanation: `${n(tr * tr)} − 4 × ${par(dt)} = ${n(disc)}.` },
   { prompt: `Which kind of phase portrait is it? Enter 1 node, 2 saddle, 3 spiral, 4 centre.`, answer: [kind], explanation: whyKind(kind) },
   { prompt: `Enter 1 if the origin is stable, 0 if not.`, answer: [st], explanation: whyStable(kind, tr) }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Heaters that feed each other',
 brief: 'Two heaters in the control room push and pull on each other through their feedback, and the crew wants to know whether they will hold steady.',
 labels: ['determinant', 'portrait code', 'stable (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['determinant'], ['portrait code'], ['stable (1 yes, 0 no)']]
}, {
 /* A = (s1, −q; r, s2) with q and r from 1 to 6 and feedback rates s1, s2 from −3 to 3 (s2 = −s1 in about a quarter of the draws, so centres
    appear). Never a zero determinant or discriminant. */
 canonical: { s1: 1, s2: -2, q: 4, r: 2 },
 draw: R => tryDraw(() => { const s1 = R.int(-3, 3); return { s1, s2: R.next() < 0.3 ? -s1 : R.int(-3, 3), q: R.int(1, 6), r: R.int(1, 6) }; },
  p => { const tr = p.s1 + p.s2, dt = p.s1 * p.s2 + p.q * p.r; return dt !== 0 && tr * tr - 4 * dt !== 0; }, { s1: 1, s2: -2, q: 4, r: 2 }),
 build: ({ s1, s2, q, r }) => { const A = [[s1, -q], [r, s2]], tr = s1 + s2, dt = det2(A), disc = tr * tr - 4 * dt, kind = kindOf(tr, dt), st = stableOf(kind, tr); return {
  prompt: `Two heaters in the Control Room are linked. Heater 1’s temperature excess x₁ (in °C above its set point) is driven by its own feedback at a rate of ${n(s1)} per minute, so x₁′ gains ${n(s1)} times x₁ (a negative rate means the heater cools itself), and is pulled down by heater 2 at ${n(q)} per minute for each degree of x₂. Heater 2’s excess x₂ is pushed up by heater 1 at ${n(r)} per minute for each degree of x₁, and has its own feedback at a rate of ${n(s2)} per minute. Writing the rates as x′ = Ax, enter the determinant of A, then the kind of phase portrait at the origin as a code (1 node, 2 saddle, 3 spiral, 4 centre), then 1 if the origin is stable, 0 if not. ${STABLE_DEF}`,
  answer: [dt, kind, st],
  hints: ['Each heater’s rule gives one row of A: the coefficient of x₁ first, then the coefficient of x₂. Pulled down by x₂ means a negative coefficient.', 'The eigenvalues solve λ² − (trace)λ + (determinant) = 0. A negative determinant is a saddle; otherwise a positive discriminant (trace)² − 4 × (determinant) is a node and a negative one a spiral, or a centre when the trace is 0. For nodes and spirals a negative trace means stable.'],
  solution: `Heater 1 gives x₁′ = ${lin(s1, -q)} and heater 2 gives x₂′ = ${lin(r, s2)}, so A has rows ${G.vec(A[0])} and ${G.vec(A[1])}. The determinant is ${n(s1)} × ${par(s2)} − ${par(-q)} × ${par(r)} = ${n(dt)}, the trace is ${n(tr)} and the discriminant is ${n(tr * tr)} − 4 × ${par(dt)} = ${n(disc)}. ${whyKind(kind)} ${whyStable(kind, tr)} The codes are ${n(kind)} (${KIND_NAME[kind]}) and ${n(st)}.`,
  guidance: [
   { prompt: `Heater 1 gives x₁′ = ${lin(s1, -q)} and heater 2 gives x₂′ = ${lin(r, s2)}. What is the determinant of the matrix A of coefficients?`, answer: [dt], explanation: `A has rows ${G.vec(A[0])} and ${G.vec(A[1])}, so the determinant is ${n(s1)} × ${par(s2)} − ${par(-q)} × ${par(r)} = ${n(dt)}.` },
   { prompt: `The trace of A is ${n(tr)}, its determinant is ${n(dt)} and its discriminant is ${n(disc)}. Which kind of phase portrait is it? Enter 1 node, 2 saddle, 3 spiral, 4 centre.`, answer: [kind], explanation: whyKind(kind) },
   { prompt: `Enter 1 if the origin is stable, 0 if not.`, answer: [st], explanation: whyStable(kind, tr) }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q24', title: 'Classifying a damper',
 brief: 'A damper on the control tower is described by one second-order equation, and the crew wants its phase portrait without solving the equation.',
 labels: ['trace', 'determinant', 'portrait code', 'stable (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['bottom-left entry of A'], ['trace'], ['determinant'], ['portrait code'], ['stable (1 yes, 0 no)']]
}, {
 /* y″ + Py′ + Qy = 0 of one of the four kinds, chosen first: node (P² > 4Q > 0), saddle (Q < 0), spiral (4Q > P² and P ≠ 0), centre (P = 0, Q > 0).
    A has rows (0, 1) and (−Q, −P), trace −P, determinant Q. */
 canonical: { kind: 3, P: -2, Q: 5 },
 draw: R => tryDraw(() => { const kind = R.int(1, 4);
  if (kind === 1) return { kind, P: R.nz(-7, 7), Q: R.int(1, 9) };
  if (kind === 2) return { kind, P: R.int(-6, 6), Q: -R.int(1, 9) };
  if (kind === 3) return { kind, P: R.nz(-5, 5), Q: R.int(1, 9) };
  return { kind, P: 0, Q: R.int(1, 9) }; },
  p => p.kind === 1 ? p.P * p.P > 4 * p.Q : p.kind === 3 ? p.P * p.P < 4 * p.Q : true, { kind: 3, P: -2, Q: 5 }),
 build: ({ P, Q }) => { const tr = -P, dt = Q, disc = tr * tr - 4 * dt, kind = kindOf(tr, dt), st = stableOf(kind, tr); return {
  prompt: `A damper on the control tower obeys ${ode2(P, Q)}, where y is its displacement in centimetres and t is in seconds. Writing x₁ = y and x₂ = y′ turns it into a first-order system x′ = Ax. Enter the trace of A, then its determinant, then the kind of phase portrait of the system at the origin as a code (1 node, 2 saddle, 3 spiral, 4 centre), then 1 if the origin is stable, 0 if not. ${STABLE_DEF}`,
  answer: [tr, dt, kind, st],
  hints: ['Since x₁′ = x₂ and x₂′ = y″, write y″ in terms of y′ and y to get the second row of A; the first row is (0, 1).', 'The eigenvalues solve λ² − (trace)λ + (determinant) = 0. A negative determinant is a saddle; otherwise a positive discriminant (trace)² − 4 × (determinant) is a node and a negative one a spiral, or a centre when the trace is 0. For nodes and spirals a negative trace means stable.'],
  solution: `Here x₂′ = y″ = ${lin(-P, -Q, 'y′', 'y')} = ${lin(-Q, -P)}, so A has rows (0, 1) and ${G.vec([-Q, -P])}. The trace is ${n(tr)} and the determinant is 0 × ${par(-P)} − 1 × ${par(-Q)} = ${n(dt)}. The discriminant is ${n(tr * tr)} − 4 × ${par(dt)} = ${n(disc)}. ${whyKind(kind)} ${whyStable(kind, tr)} The codes are ${n(kind)} (${KIND_NAME[kind]}) and ${n(st)}.`,
  guidance: [
   { prompt: `The equation gives y″ = ${lin(-P, -Q, 'y′', 'y')}. With x₁ = y and x₂ = y′, the second equation of the system is x₂′ = y″, a mix of x₁ and x₂. What is the coefficient of x₁ in it, the bottom-left entry A₂₁ of A?`, answer: [-Q], explanation: `x₂′ = y″ = ${lin(-P, -Q, 'y′', 'y')} = ${lin(-Q, -P)}, so the rows of A are (0, 1) and ${G.vec([-Q, -P])}, and A₂₁ = ${n(-Q)}.` },
   { prompt: `A has rows (0, 1) and ${G.vec([-Q, -P])}. What is its trace?`, answer: [tr], explanation: `0 + ${par(-P)} = ${n(tr)}.` },
   { prompt: `What is the determinant of A?`, answer: [dt], explanation: `0 × ${par(-P)} − 1 × ${par(-Q)} = ${n(dt)}.` },
   { prompt: `The trace is ${n(tr)}, the determinant is ${n(dt)} and the discriminant is ${n(disc)}. Which kind of phase portrait is it? Enter 1 node, 2 saddle, 3 spiral, 4 centre.`, answer: [kind], explanation: whyKind(kind) },
   { prompt: `Enter 1 if the origin is stable, 0 if not.`, answer: [st], explanation: whyStable(kind, tr) }
  ] }; }
});

/* ---- q29 Chapter review: two linked tanks [3.4, 3.5] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Flushing the troughs',
 brief: 'Two linked hydroponic troughs are being flushed with clean water, and the crew wants to know how much nutrient is still in the drained trough a little later.',
 labels: ['smaller eigenvalue', 'larger eigenvalue', 'nutrient in trough 1 (kg)'], tolerance: 0.0005,
 gl: [['smaller eigenvalue'], ['larger eigenvalue'], ['x₁′ at the start (kg/min)'], ['p'], ['nutrient in trough 1 (kg)']]
}, {
 /* A set of TANKS29 with the roles turned round: the clean water enters trough 2 (volume V1 of the set) and trough 1 (volume V2 of the set)
    drains, so the answer is the salt in the drained tank. x₁ = p·e^(λ₁t) + q·e^(λ₂t), with p at most three decimals and the answer not near
    a rounding tie. The trace and determinant are those of the learn mission's tanks. */
 canonical: { i: 7, s1: 6, s2: 3 },
 draw: R => tryDraw(() => ({ i: R.int(0, TANKS29.length - 1), s1: R.int(2, 20), s2: R.int(0, 20) }),
  p => { const t = tank29b(p); return exact3(t.p) && !edge(t.x1, 3); }, { i: 7, s1: 6, s2: 3 }),
 build: ({ i, s1, s2 }) => { const t = tank29b({ i, s1, s2 }), x1 = r3(t.x1), e1 = Math.pow(2, t.l1), e2 = Math.pow(2, t.l2); return {
  prompt: `Two hydroponic troughs in the Control Room are linked, and both are well stirred. Trough 1 holds ${n(t.VO)} litres and trough 2 holds ${n(t.VI)} litres. Clean water flows into trough 2 at ${n(t.f)} L/min; ${n(t.f + t.g)} L/min is pumped from trough 2 into trough 1; ${n(t.g)} L/min is pumped back from trough 1 into trough 2; and trough 1 drains ${n(t.f)} L/min, so both volumes stay fixed. At t = 0 trough 1 holds ${n(s1)} kg of dissolved nutrient and trough 2 holds ${n(s2)} kg. Enter the two eigenvalues of the system’s matrix in increasing order, then the nutrient in trough 1, in kg, at t = ln 2 minutes, to 3 decimal places.`,
  answer: [t.l1, t.l2, x1],
  hints: ['Nutrient leaves a trough at (flow out) × (nutrient ÷ volume). So x₁′ = −(flow out of trough 1 ÷ V₁)x₁ + (flow in from trough 2 ÷ V₂)x₂, and x₂′ is built the same way.', 'Write x₁(t) = pe^(λ₁t) + qe^(λ₂t). Then p + q = x₁(0) and λ₁p + λ₂q = x₁′(0), which the first equation gives at t = 0. At t = ln 2, e^(λt) = 2^λ.'],
  solution: `x₁′ = −(${n(t.f + t.g)} ÷ ${n(t.VO)})x₁ + (${n(t.f + t.g)} ÷ ${n(t.VI)})x₂ = −${n(t.c)}x₁ + ${cf(t.a, 'x₂')} and x₂′ = (${n(t.g)} ÷ ${n(t.VO)})x₁ − (${n(t.f + t.g)} ÷ ${n(t.VI)})x₂ = ${cf(t.b, 'x₁')} − ${n(t.a)}x₂. The matrix has trace −${n(t.tr)} and determinant ${n(t.dt)}, so λ² + ${n(t.tr)}λ + ${n(t.dt)} = 0, with roots ${n(t.l1)} and ${n(t.l2)}. At t = 0, x₁′ = −${n(t.c)} × ${n(s1)} + ${n(t.a)} × ${n(s2)} = ${n(t.d0)}. With x₁(t) = p${ex(t.l1)} + q${ex(t.l2)}: p + q = ${n(s1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.d0)}, so p = ${n(t.p)} and q = ${n(t.q)}. At t = ln 2, x₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)} ≈ ${n(x1)} kg.`,
  guidance: [
   { prompt: `The matrix has trace −${n(t.tr)} and determinant ${n(t.dt)}. What is the smaller eigenvalue?`, answer: [t.l1], explanation: `λ² + ${n(t.tr)}λ + ${n(t.dt)} = ${fac(t.l1)}${fac(t.l2)}, so the smaller root is ${n(t.l1)}.` },
   { prompt: `What is the larger eigenvalue?`, answer: [t.l2], explanation: `The other root is ${n(t.l2)}.` },
   { prompt: `Trough 1 gets ${n(t.f + t.g)} L/min from trough 2 and loses ${n(t.f + t.g)} L/min, so x₁′ = −(${n(t.f + t.g)} ÷ ${n(t.VO)})x₁ + (${n(t.f + t.g)} ÷ ${n(t.VI)})x₂. What is x₁′ at the start, in kg/min?`, answer: [t.d0], explanation: `−${n(t.c)} × ${n(s1)} + ${n(t.a)} × ${n(s2)} = ${n(t.d0)} kg/min.` },
   { prompt: `With x₁(t) = p${ex(t.l1)} + q${ex(t.l2)}, p + q = ${n(s1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.d0)}. What is p?`, answer: [t.p], explanation: `Subtracting ${n(t.l2)} times the first equation from the second gives (${n(t.l1)} − ${par(t.l2)})p = ${n(t.d0)} − ${par(t.l2)} × ${n(s1)}, so p = ${n(t.p)} and q = ${n(t.q)}.` },
   { prompt: `What is x₁ at t = ln 2, in kg to 3 decimal places?`, answer: [x1], explanation: `x₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)} ≈ ${n(x1)} kg.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'The two-inlet nutrient loop',
 brief: 'A nutrient loop has two tanks that each take clean water and each have a drain, and the crew wants to know how fast it flushes and what is left in the first tank.',
 labels: ['smaller eigenvalue', 'larger eigenvalue', 'nutrient in tank 1 (kg)'], tolerance: 0.0005,
 gl: [['smaller eigenvalue'], ['larger eigenvalue'], ['nutrient in tank 1 (kg)']]
}, {
 /* A row of TANKS29C: both tanks take clean water and both drain, volumes fixed, both eigenvalues whole and negative. Whole kilograms to
    start; p has at most three decimals and the answer is not near a rounding tie. */
 canonical: { i: 2, s1: 8, s2: 4 },
 draw: R => tryDraw(() => ({ i: R.int(0, TANKS29C.length - 1), s1: R.int(2, 20), s2: R.int(0, 20) }),
  p => { const t = tank29c(p); return exact3(t.p) && !edge(t.x1, 3); }, { i: 2, s1: 8, s2: 4 }),
 build: ({ i, s1, s2 }) => { const t = tank29c({ i, s1, s2 }), x1 = r3(t.x1); return {
  prompt: `A hydroponic loop in the Control Room has two well-stirred tanks. Tank 1 holds ${n(t.V1)} litres and tank 2 holds ${n(t.V2)} litres. Clean water enters tank 1 at ${n(t.f1)} L/min and tank 2 at ${n(t.f2)} L/min. Pumps move ${n(t.u)} L/min from tank 1 to tank 2 and ${n(t.w)} L/min from tank 2 to tank 1, and the tanks drain ${n(t.d1)} L/min and ${n(t.d2)} L/min, so both volumes stay fixed. At t = 0 tank 1 holds ${n(s1)} kg of nutrient and tank 2 holds ${n(s2)} kg. Enter the two eigenvalues of the system’s matrix in increasing order, then the nutrient in tank 1, in kg, at t = ln 2 minutes, to 3 decimal places.`,
  answer: [t.l1, t.l2, x1],
  hints: ['Nutrient leaves a tank at (flow out) × (nutrient ÷ volume), and the flow out of a tank is its pump flow plus its drain. Clean water brings no nutrient in. Build x₁′ and x₂′ this way.', 'Write x₁(t) = pe^(λ₁t) + qe^(λ₂t). Then p + q = x₁(0) and λ₁p + λ₂q = x₁′(0). At t = ln 2, e^(λt) = 2^λ.'],
  solution: `Tank 1 loses ${n(t.u)} + ${n(t.d1)} = ${n(t.u + t.d1)} L/min and gains ${n(t.w)} L/min from tank 2, so x₁′ = −(${n(t.u + t.d1)} ÷ ${n(t.V1)})x₁ + (${n(t.w)} ÷ ${n(t.V2)})x₂ = −${n(t.al)}x₁ + ${cf(t.be, 'x₂')}. Tank 2 loses ${n(t.w)} + ${n(t.d2)} = ${n(t.w + t.d2)} L/min and gains ${n(t.u)} L/min, so x₂′ = ${cf(t.de, 'x₁')} − ${n(t.ga)}x₂. The matrix has trace −${n(t.tr)} and determinant ${n(t.dt)}, so λ² + ${n(t.tr)}λ + ${n(t.dt)} = 0, with roots ${n(t.l1)} and ${n(t.l2)}. At t = 0, x₁′ = −${n(t.al)} × ${n(s1)} + ${n(t.be)} × ${n(s2)} = ${n(t.d0)}. With x₁(t) = p${ex(t.l1)} + q${ex(t.l2)}: p + q = ${n(s1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.d0)}, so p = ${n(t.p)} and q = ${n(t.q)}. At t = ln 2, x₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)} ≈ ${n(x1)} kg.`,
  guidance: [
   { prompt: `The matrix has trace −${n(t.tr)} and determinant ${n(t.dt)}. What is the smaller eigenvalue?`, answer: [t.l1], explanation: `λ² + ${n(t.tr)}λ + ${n(t.dt)} = ${fac(t.l1)}${fac(t.l2)}, so the smaller root is ${n(t.l1)}.` },
   { prompt: `What is the larger eigenvalue?`, answer: [t.l2], explanation: `The other root is ${n(t.l2)}.` },
   { prompt: `At the start x₁′ = −${n(t.al)} × ${n(s1)} + ${n(t.be)} × ${n(s2)} = ${n(t.d0)} kg/min. With x₁(t) = p${ex(t.l1)} + q${ex(t.l2)}, p + q = ${n(s1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.d0)}. Solve for p and q, then enter x₁ at t = ln 2 in kg, to 3 decimal places.`, answer: [x1], explanation: `Subtracting ${n(t.l2)} times the first equation from the second gives (${n(t.l1)} − ${par(t.l2)})p = ${n(t.d0)} − ${par(t.l2)} × ${n(s1)}, so p = ${n(t.p)} and q = ${n(t.q)}. Then x₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)} ≈ ${n(x1)} kg.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q08', title: 'Brine into the linked tanks',
 brief: 'Brine is now being fed into the first of two linked tanks, and the crew needs the amount the tanks head for and the salt in tank 1 a little later.',
 labels: ['long-run salt in tank 1 (kg)', 'smaller eigenvalue', 'larger eigenvalue', 'salt in tank 1 (kg)'], tolerance: 0.0005,
 gl: [['long-run salt in tank 1 (kg)'], ['smaller eigenvalue'], ['larger eigenvalue'], ['p'], ['salt in tank 1 (kg)']]
}, {
 /* A set of TANKS29 fed with brine of concentration k (0.5, 1, 1.5 or 2 kg per litre) instead of fresh water. Both tanks head for
    concentration k, so the long-run salt is k·V; y = x − (long-run amounts) obeys y′ = Ay. p at most three decimals, answer not near a tie. */
 canonical: { i: 5, s1: 3, s2: 4, k: 1 },
 draw: R => tryDraw(() => ({ i: R.int(0, TANKS29.length - 1), s1: R.int(2, 20), s2: R.int(0, 20), k: R.pick([0.5, 1, 1.5, 2]) }),
  p => { const t = tank29d(p); return exact3(t.p) && !edge(t.x1, 3); }, { i: 5, s1: 3, s2: 4, k: 1 }),
 build: ({ i, s1, s2, k }) => { const t = tank29d({ i, s1, s2, k }), x1 = r3(t.x1), e1 = Math.pow(2, t.l1), e2 = Math.pow(2, t.l2); return {
  prompt: `Brine of concentration ${n(k)} kg per litre is now fed into a pair of linked tanks in the Control Room, and both tanks are well stirred. Tank 1 holds ${n(t.V1)} litres and tank 2 holds ${n(t.V2)} litres. The brine flows into tank 1 at ${n(t.f)} L/min; ${n(t.f + t.g)} L/min flows from tank 1 into tank 2; ${n(t.g)} L/min flows back from tank 2 into tank 1, and tank 2 drains ${n(t.f)} L/min, so both volumes stay fixed. At t = 0 tank 1 holds ${n(s1)} kg of salt and tank 2 holds ${n(s2)} kg. Let x₁ and x₂ be the salt in the tanks, and let L₁ and L₂ be their long-run amounts, where nothing changes. Then y = x − (L₁, L₂) obeys y′ = Ay with the same matrix A as for fresh water, because the brine inflow is exactly what keeps the long-run amounts steady. Enter L₁ in kg, then the two eigenvalues of A in increasing order, then the salt in tank 1, in kg, at t = ln 2 minutes, to 3 decimal places.`,
  answer: [t.eq1, t.l1, t.l2, x1],
  hints: ['In the long run nothing changes, and the only salt entering is in the brine, so each tank ends at the concentration of the brine: its amount is that concentration × its volume.', 'For fresh water x₁′ = −(flow out of tank 1 ÷ V₁)x₁ + (flow back ÷ V₂)x₂, and x₂′ is built the same way; that is the matrix A. For y₁(t) = pe^(λ₁t) + qe^(λ₂t), p + q = y₁(0) and λ₁p + λ₂q = y₁′(0); then x₁ = L₁ + y₁.'],
  solution: `In the long run each tank is at concentration ${n(k)} kg per litre, so L₁ = ${n(k)} × ${n(t.V1)} = ${n(t.eq1)} kg and L₂ = ${n(k)} × ${n(t.V2)} = ${n(t.eq2)} kg. The matrix is x₁′ = −${n(t.a)}x₁ + ${cf(t.b, 'x₂')} and x₂′ = ${n(t.a)}x₁ − ${n(t.c)}x₂, with trace −${n(t.tr)} and determinant ${n(t.dt)}, so λ² + ${n(t.tr)}λ + ${n(t.dt)} = 0, with roots ${n(t.l1)} and ${n(t.l2)}. At the start y₁ = ${n(s1)} − ${par(t.eq1)} = ${n(t.Y1)} and y₂ = ${n(s2)} − ${par(t.eq2)} = ${n(t.Y2)}, so y₁′ = −${n(t.a)} × ${par(t.Y1)} + ${n(t.b)} × ${par(t.Y2)} = ${n(t.D)}. With y₁(t) = p${ex(t.l1)} + q${ex(t.l2)}: p + q = ${n(t.Y1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.D)}, so p = ${n(t.p)} and q = ${n(t.q)}. At t = ln 2, y₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)}, so x₁ = ${n(t.eq1)} + y₁ ≈ ${n(x1)} kg.`,
  guidance: [
   { prompt: `In the long run each tank is at the concentration of the brine coming in, ${n(k)} kg per litre. How many kilograms of salt is that in tank 1?`, answer: [t.eq1], explanation: `${n(k)} × ${n(t.V1)} = ${n(t.eq1)} kg.` },
   { prompt: `The matrix A has trace −${n(t.tr)} and determinant ${n(t.dt)}. What is the smaller eigenvalue?`, answer: [t.l1], explanation: `λ² + ${n(t.tr)}λ + ${n(t.dt)} = ${fac(t.l1)}${fac(t.l2)}, so the smaller root is ${n(t.l1)}.` },
   { prompt: `What is the larger eigenvalue?`, answer: [t.l2], explanation: `The other root is ${n(t.l2)}.` },
   { prompt: `At the start y₁ = ${n(t.Y1)} and y₂ = ${n(t.Y2)}, so y₁′ = −${n(t.a)} × ${par(t.Y1)} + ${n(t.b)} × ${par(t.Y2)} = ${n(t.D)}. With y₁(t) = p${ex(t.l1)} + q${ex(t.l2)}, p + q = ${n(t.Y1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.D)}. What is p?`, answer: [t.p], explanation: `Subtracting ${n(t.l2)} times the first equation from the second gives (${n(t.l1)} − ${par(t.l2)})p = ${n(t.D)} − ${par(t.l2)} × ${par(t.Y1)}, so p = ${n(t.p)} and q = ${n(t.q)}.` },
   { prompt: `What is x₁ = ${n(t.eq1)} + y₁ at t = ln 2, in kg to 3 decimal places?`, answer: [x1], explanation: `y₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)}, so x₁ = ${n(t.eq1)} + y₁ ≈ ${n(x1)} kg.` }
  ] }; }
});

/* ---- q30 The Laplace transform [6.1] ---- */

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Two pulses and a ramp',
 brief: 'A charging coil in the signal shop is driven by two exponential pulses and a rising ramp, and the crew wants its signal in the new language.',
 labels: ['s must exceed', 'ℒ{f} at the given s'], tolerance: 0.0005,
 gl: [['s must exceed'], ['first exponential piece'], ['second exponential piece'], ['power piece'], ['ℒ{f} at the given s']]
}, {
 /* f(t) = α·e^(a₁t) + β·e^(a₂t) + γ·tᵏ with different non-zero a₁, a₂ (−3 to 3), k from 1 to 3 and s above max(a₁, a₂, 0) by 1 to 4;
    every piece and the total have at most three decimals. Never the worked example (f(t) = 5 + e^(2t), s = 3). */
 canonical: { al: 3, a1: -1, be: -2, a2: 2, ga: 4, k: 2, s: 4 },
 draw: R => tryDraw(() => { const a1 = R.nz(-3, 3), a2 = R.nz(-3, 3), th = Math.max(a1, a2, 0); return { al: R.nz(-4, 4), a1, be: R.nz(-4, 4), a2, ga: R.nz(-4, 4), k: R.int(1, 3), s: th + R.int(1, 4) }; },
  p => { if (p.a1 === p.a2) return false; const X = p.al / (p.s - p.a1), Y = p.be / (p.s - p.a2), Z = p.ga * fact(p.k) / Math.pow(p.s, p.k + 1);
   return [X, Y, Z].every(exact3) && Math.abs(X + Y + Z) > 1e-9; }, { al: 3, a1: -1, be: -2, a2: 2, ga: 4, k: 2, s: 4 }),
 build: ({ al, a1, be, a2, ga, k, s }) => { const X = tidy(al / (s - a1)), Y = tidy(be / (s - a2)), Z = tidy(ga * fact(k) / Math.pow(s, k + 1)), F = tidy(X + Y + Z), th = Math.max(a1, a2, 0),
  f = `${cf(al, ex(a1))} ${sgn(be)} ${cf(Math.abs(be), ex(a2))} ${sgn(ga)} ${cf(Math.abs(ga), SUPK[k])}`; return {
  prompt: `The charging coil in the Signal Shop is driven by the signal f(t) = ${f} volts, where t is in seconds. For which s does the Laplace transform ℒ{f}(s) exist? Enter the number that s must be greater than, then the value of ℒ{f}(s) at s = ${n(s)}.`,
  answer: [th, F],
  hints: ['ℒ{tⁿ} = n! ÷ sⁿ⁺¹ for s > 0, and ℒ{e^(at)} = 1 ÷ (s − a) for s > a.', 'The transform is linear: transform each piece, multiply by its coefficient and add. The whole transform exists where every piece does, so s must beat the largest of the limits.'],
  solution: `The power needs s > 0, ${ex(a1)} needs s > ${n(a1)} and ${ex(a2)} needs s > ${n(a2)}, so all three integrals converge when s > ${n(th)}. At s = ${n(s)}: ℒ{${cf(al, ex(a1))}} = ${n(al)} ÷ (${n(s)} − ${par(a1)}) = ${n(X)}; ℒ{${cf(be, ex(a2))}} = ${n(be)} ÷ (${n(s)} − ${par(a2)}) = ${n(Y)}; ℒ{${cf(ga, SUPK[k])}} = ${n(ga)} × ${n(fact(k))} ÷ ${n(s)}^${n(k + 1)} = ${n(Z)}. Adding, ℒ{f}(${n(s)}) = ${n(X)} + ${par(Y)} + ${par(Z)} = ${n(F)}.`,
  guidance: [
   { prompt: `The power needs s > 0 and an exponential e^(at) needs s > a. Which number must s exceed?`, answer: [th], explanation: `The largest of 0, ${n(a1)} and ${n(a2)} is ${n(th)}, so the transform exists for s > ${n(th)}.` },
   { prompt: `What is ℒ{${cf(al, ex(a1))}} at s = ${n(s)}?`, answer: [X], explanation: `${n(al)} ÷ (${n(s)} − ${par(a1)}) = ${n(al)} ÷ ${n(s - a1)} = ${n(X)}.` },
   { prompt: `What is ℒ{${cf(be, ex(a2))}} at s = ${n(s)}?`, answer: [Y], explanation: `${n(be)} ÷ (${n(s)} − ${par(a2)}) = ${n(be)} ÷ ${n(s - a2)} = ${n(Y)}.` },
   { prompt: `What is ℒ{${cf(ga, SUPK[k])}} at s = ${n(s)}?`, answer: [Z], explanation: `${n(ga)} × ${n(k)}! ÷ ${n(s)}^${n(k + 1)} = ${n(ga * fact(k))} ÷ ${n(Math.pow(s, k + 1))} = ${n(Z)}.` },
   { prompt: `What is ℒ{f}(${n(s)}), the sum of the three pieces?`, answer: [F], explanation: `${n(X)} + ${par(Y)} + ${par(Z)} = ${n(F)}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Mixing two relays',
 brief: 'Two relays feed a mixer in the signal shop, and the crew wants the transform of the mixed signal without ever writing the mixed signal out.',
 labels: ['s must exceed', 'ℒ{h} at the given s'], tolerance: 0.0005,
 gl: [['ℒ{f} at the given s'], ['ℒ{g} at the given s'], ['ℒ{h} at the given s']]
}, {
 /* f = α·t + γ·trig(bt), g = g₀ + δ·e^(at), h = m·f − g, s above max(a, 0) by 1 to 4. Every piece and the total have at most three decimals and
    the total is not 0. */
 canonical: { al: 3, ga: 2, trig: 'sin', b: 2, g0: 6, de: -3, a: -2, m: 2, s: 2 },
 draw: R => tryDraw(() => { const a = R.nz(-3, 3); return { al: R.nz(-4, 4), ga: R.nz(-4, 4), trig: R.pick(['sin', 'cos']), b: R.int(1, 4), g0: R.nz(-6, 6), de: R.nz(-4, 4), a, m: R.int(2, 4), s: Math.max(a, 0) + R.int(1, 4) }; },
  p => { const P = p.al / (p.s * p.s), Q = lapTrig(p.trig, p.ga, p.b, p.s), U = p.g0 / p.s, W = p.de / (p.s - p.a);
   return [P, Q, U, W].every(exact3) && Math.abs(p.m * (P + Q) - (U + W)) > 1e-9; }, { al: 3, ga: 2, trig: 'sin', b: 2, g0: 6, de: -3, a: -2, m: 2, s: 2 }),
 build: ({ al, ga, trig, b, g0, de, a, m, s }) => { const P = tidy(al / (s * s)), Q = tidy(lapTrig(trig, ga, b, s)), U = tidy(g0 / s), W = tidy(de / (s - a)), F = tidy(P + Q), Gs = tidy(U + W), H = tidy(m * F - Gs), th = Math.max(a, 0),
  tg = `${trig}(${bt(b)})`, f = `${cf(al, 't')} ${sgn(ga)} ${cf(Math.abs(ga), tg)}`, g = `${n(g0)} ${sgn(de)} ${cf(Math.abs(de), ex(a))}`,
  qt = trig === 'sin' ? `${n(b)} ÷ (${n(s)}² + ${n(b)}²)` : `${n(s)} ÷ (${n(s)}² + ${n(b)}²)`; return {
  prompt: `Two relays feed a mixer in the Signal Shop. Relay A sends f(t) = ${f} volts and relay B sends g(t) = ${g} volts, with t in seconds. The mixer outputs h(t) = ${n(m)}f(t) − g(t). Enter the number that s must be greater than for ℒ{h}(s) to exist, then the value of ℒ{h}(s) at s = ${n(s)}.`,
  answer: [th, H],
  hints: ['A constant c is c × t⁰, so ℒ{c} = c ÷ s for s > 0. Also ℒ{t} = 1 ÷ s², ℒ{sin(bt)} = b ÷ (s² + b²), ℒ{cos(bt)} = s ÷ (s² + b²) for s > 0, and ℒ{e^(at)} = 1 ÷ (s − a) for s > a.', 'The transform is linear, so ℒ{h} = (the multiplier) × ℒ{f} − ℒ{g}. Find ℒ{f} and ℒ{g} separately at the given s, then combine them. The transform of h exists where every piece does.'],
  solution: `Every piece needs s > 0 except ${ex(a)}, which needs s > ${n(a)}, so ℒ{h}(s) exists for s > ${n(th)}. At s = ${n(s)}: ℒ{f} = ${n(al)} ÷ ${n(s)}² ${sgn(ga)} ${n(Math.abs(ga))} × ${qt} = ${n(P)} + ${par(Q)} = ${n(F)}. ℒ{g} = ${n(g0)} ÷ ${n(s)} ${sgn(de)} ${n(Math.abs(de))} ÷ (${n(s)} − ${par(a)}) = ${n(U)} + ${par(W)} = ${n(Gs)}. By linearity ℒ{h}(${n(s)}) = ${n(m)} × ${par(F)} − ${par(Gs)} = ${n(H)}.`,
  guidance: [
   { prompt: `What is ℒ{f} at s = ${n(s)}, where f(t) = ${f}?`, answer: [F], explanation: `${n(al)} ÷ ${n(s)}² ${sgn(ga)} ${n(Math.abs(ga))} × ${qt} = ${n(P)} + ${par(Q)} = ${n(F)}.` },
   { prompt: `What is ℒ{g} at s = ${n(s)}, where g(t) = ${g}? The constant ${n(g0)} transforms to ${n(g0)} ÷ s.`, answer: [Gs], explanation: `${n(g0)} ÷ ${n(s)} ${sgn(de)} ${n(Math.abs(de))} ÷ (${n(s)} − ${par(a)}) = ${n(U)} + ${par(W)} = ${n(Gs)}.` },
   { prompt: `Since h = ${n(m)}f − g, ℒ{h} = ${n(m)} × ℒ{f} − ℒ{g}. What is ℒ{h} at s = ${n(s)}?`, answer: [H], explanation: `${n(m)} × ${par(F)} − ${par(Gs)} = ${n(H)}.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', title: 'The four-part test signal',
 brief: 'The signal shop’s long test signal has four parts, including a high power of t, and the crew needs its transform at one value of s.',
 labels: ['s must exceed', 'ℒ{f} at the given s'], tolerance: 0.0005,
 gl: [['s must exceed'], ['power piece'], ['exponential piece'], ['sine piece'], ['cosine piece'], ['ℒ{f} at the given s']]
}, {
 /* f(t) = α·tᵏ + β·e^(at) + γ·sin(b₁t) + δ·cos(b₂t) with k from 2 to 4, a non-zero from −3 to 3, b₁ ≠ b₂ from 1 to 4 and s above
    max(a, 0) by 1 to 6. The answer is rounded to 3 places and is not near a rounding tie; the pieces are rounded to 3 places in their steps. */
 canonical: { al: 5, k: 3, be: -4, a: 2, ga: 3, b1: 2, de: -2, b2: 3, s: 3 },
 draw: R => tryDraw(() => { const a = R.nz(-3, 3), b1 = R.int(1, 4); return { al: R.nz(-6, 6), k: R.int(2, 4), be: R.nz(-6, 6), a, ga: R.nz(-6, 6), b1, de: R.nz(-6, 6), b2: R.except(1, 4, [b1]), s: Math.max(a, 0) + R.int(1, 6) }; },
  p => { const L = d30(p); return !edge(L.F, 3) && Math.abs(L.F) > 0.01 && [L.P, L.X, L.Q, L.C].every(v => !edge(v, 3)); }, { al: 5, k: 3, be: -4, a: 2, ga: 3, b1: 2, de: -2, b2: 3, s: 3 }),
 build: ({ al, k, be, a, ga, b1, de, b2, s }) => { const L = d30({ al, k, be, a, ga, b1, de, b2, s }), th = Math.max(a, 0), F = r3(L.F),
  f = `${cf(al, SUPK[k])} ${sgn(be)} ${cf(Math.abs(be), ex(a))} ${sgn(ga)} ${cf(Math.abs(ga), `sin(${bt(b1)})`)} ${sgn(de)} ${cf(Math.abs(de), `cos(${bt(b2)})`)}`; return {
  prompt: `The Signal Shop’s long test signal is f(t) = ${f} volts, where t is in seconds. Enter the number that s must be greater than for ℒ{f}(s) to exist, then the value of ℒ{f}(s) at s = ${n(s)}, to 3 decimal places. Keep full precision until the last step.`,
  answer: [th, F],
  hints: ['ℒ{tⁿ} = n! ÷ sⁿ⁺¹ and ℒ{sin(bt)} = b ÷ (s² + b²), ℒ{cos(bt)} = s ÷ (s² + b²), all for s > 0; ℒ{e^(at)} = 1 ÷ (s − a) for s > a.', 'The transform is linear: transform each piece, multiply by its coefficient and add. Round only the final sum.'],
  solution: `The power, the sine and the cosine need s > 0 and ${ex(a)} needs s > ${n(a)}, so all four integrals converge when s > ${n(th)}. At s = ${n(s)}: ℒ{${cf(al, SUPK[k])}} = ${n(al)} × ${n(fact(k))} ÷ ${n(s)}^${n(k + 1)} ≈ ${n(r3(L.P))}; ℒ{${cf(be, ex(a))}} = ${n(be)} ÷ (${n(s)} − ${par(a)}) ≈ ${n(r3(L.X))}; ℒ{${cf(ga, `sin(${bt(b1)})`)}} = ${n(ga)} × ${n(b1)} ÷ (${n(s)}² + ${n(b1)}²) ≈ ${n(r3(L.Q))}; ℒ{${cf(de, `cos(${bt(b2)})`)}} = ${n(de)} × ${n(s)} ÷ (${n(s)}² + ${n(b2)}²) ≈ ${n(r3(L.C))}. Adding the unrounded pieces, ℒ{f}(${n(s)}) ≈ ${n(F)}.`,
  guidance: [
   { prompt: `The power, sine and cosine need s > 0, and e^(at) needs s > a. Which number must s exceed?`, answer: [th], explanation: `The largest of 0 and ${n(a)} is ${n(th)}, so the transform exists for s > ${n(th)}.` },
   { prompt: `What is ℒ{${cf(al, SUPK[k])}} at s = ${n(s)}, to 3 decimal places?`, answer: [r3(L.P)], explanation: `${n(al)} × ${n(k)}! ÷ ${n(s)}^${n(k + 1)} = ${n(al * fact(k))} ÷ ${n(Math.pow(s, k + 1))} ≈ ${n(r3(L.P))}.` },
   { prompt: `What is ℒ{${cf(be, ex(a))}} at s = ${n(s)}, to 3 decimal places?`, answer: [r3(L.X)], explanation: `${n(be)} ÷ (${n(s)} − ${par(a)}) = ${n(be)} ÷ ${n(s - a)} ≈ ${n(r3(L.X))}.` },
   { prompt: `What is ℒ{${cf(ga, `sin(${bt(b1)})`)}} at s = ${n(s)}, to 3 decimal places?`, answer: [r3(L.Q)], explanation: `${n(ga)} × ${n(b1)} ÷ (${n(s)}² + ${n(b1)}²) = ${n(ga * b1)} ÷ ${n(s * s + b1 * b1)} ≈ ${n(r3(L.Q))}.` },
   { prompt: `What is ℒ{${cf(de, `cos(${bt(b2)})`)}} at s = ${n(s)}, to 3 decimal places?`, answer: [r3(L.C)], explanation: `${n(de)} × ${n(s)} ÷ (${n(s)}² + ${n(b2)}²) = ${n(de * s)} ÷ ${n(s * s + b2 * b2)} ≈ ${n(r3(L.C))}.` },
   { prompt: `What is ℒ{f}(${n(s)}), the sum of the four pieces, to 3 decimal places?`, answer: [F], explanation: `Adding the unrounded pieces gives ${n(F)}.` }
  ] }; }
});

})();
