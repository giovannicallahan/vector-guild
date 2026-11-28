/* Differential equations practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/ode/oracle-p8.js. */
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
/* Signed terms: tail([[3, 'x'], [−1, 'y'], [4, '']]) is ' + 3x − y + 4' (zero terms dropped, coefficient 1 not written);
   expr(...) is the same without a leading '+' ('3x − y + 4', '−x + 2'). */
const sgn = v => v < 0 ? '−' : '+';
const one = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}`;
const tail = terms => terms.filter(([v]) => v !== 0).map(([v, x]) => ' ' + one(v, x)).join('');
const expr = terms => { const t = tail(terms).trim(); return t.startsWith('+ ') ? t.slice(2) : t.startsWith('− ') ? '−' + t.slice(2) : t; };
/* One signed term on its own: tm(−3, 'x') is '−3x'. A coefficient written before a letter: cy(1, 'y') is 'y', cy(0.5, 'y') is '0.5y'. */
const tm = (v, x) => one(v, x).replace('− ', '−').replace('+ ', '');
const cy = (v, x) => v === 1 ? x : `${n(v)}${x}`;
/* (x − 3), (x + 2). */
const fac = (r, v = 'x') => r > 0 ? `(${v} − ${n(r)})` : `(${v} + ${n(-r)})`;
const fx = (x, d) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d);
const r2 = x => Math.round(x * 100) / 100;
/* True when x sits close to a rounding tie at d decimals (so the last digit would hang on float noise). */
const nearTie = (x, d) => { const f = (Math.abs(x) * Math.pow(10, d)) % 1; return Math.abs(f - 0.5) < 0.02; };
const hasDec = (x, d) => Math.abs(Math.round(x * Math.pow(10, d)) - x * Math.pow(10, d)) < 1e-7;
/* At most 1000 tries, then the canonical parameters. make may return null. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (p && ok(p)) return p; } return Object.assign({}, fallback); };
const ord = k => { const m = k % 100; return k + (m >= 11 && m <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][k % 10] || 'th'); };
const piSq = m => m === 1 ? 'π²' : `${n(m)}π²`;
const isInt = v => Math.abs(v - Math.round(v)) < 1e-9;
const L6 = ['x', 'y', 'J11', 'J12', 'J21', 'J22'];

/* ---- q36 Critical points and linearisation of nonlinear systems [8.1] ---- */

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'Balancing the water recycler',
 brief: 'The dome’s water recycler has a pressure and a flow that push each other around, and the crew wants its smaller resting point and how it responds to a nudge.',
 labels: L6, tolerance: 0.01,
 gl: [['x'], ['y'], ['∂f/∂x'], ['∂g/∂x']]
}, {
 /* x′ = y − s·x², y′ = y − m·x − d with m = s(r1 + r2) and d = −s·r1·r2: y = s·x² and s·x² − m·x − d = 0 give critical points at x = r1 and x = r2.
    The smaller x is r1 (not 0; m and r2 are not 0). There the Jacobian is [[−2s·r1, 1], [−m, 1]]. Not the q36 worked example. */
 canonical: { s: 1, r1: -2, r2: 3 },
 draw: R => retry(() => { const r1 = R.nz(-4, 2); return { s: R.int(1, 3), r1, r2: R.int(r1 + 1, 4) }; }, p => p.r1 + p.r2 !== 0 && p.r2 !== 0, { s: 1, r1: -2, r2: 3 }),
 build: ({ s, r1, r2 }) => { const m = s * (r1 + r2), d = -s * r1 * r2, xs = r1, ys = s * r1 * r1, sx = s === 1 ? '' : n(s), g = expr([[1, 'y'], [-m, 'x'], [-d, '']]),
  quad = expr([[s, 'x²'], [-m, 'x'], [-d, '']]), j11 = -2 * s * xs; return {
  prompt: `In the dome’s water recycler, the pressure x and the flow y obey x′ = y − ${sx}x² and y′ = ${g}. Find the critical point with the smaller x, and the Jacobian matrix of the system there. Enter x, then y, then the four entries of the Jacobian matrix row by row.`,
  answer: [xs, ys, j11, 1, -m, 1],
  hints: ['At a critical point both right-hand sides are 0. The first equation gives y in terms of x: put that into the second to get a quadratic in x, and take the root asked for.',
   'The Jacobian matrix has rows (∂f/∂x, ∂f/∂y) and (∂g/∂x, ∂g/∂y), where f and g are the two right-hand sides. For a partial derivative, treat the other letter as a fixed number; the derivative of x² in x is 2x.'],
  solution: `x′ = 0 gives y = ${sx}x². Putting this into y′ = 0 gives ${quad} = 0, which factors as ${s === 1 ? '' : n(s)}${fac(r1)}${fac(r2)} = 0, so x = ${n(r1)} or x = ${n(r2)}. The smaller is x = ${n(xs)}, with y = ${s === 1 ? '' : n(s) + ' × '}${par(xs)}² = ${n(ys)}. For f = y − ${sx}x²: ∂f/∂x = −${s === 1 ? '2' : n(2 * s)}x, which is ${n(j11)} there, and ∂f/∂y = 1. For g = ${g}: ∂g/∂x = ${n(-m)} and ∂g/∂y = 1. At (${n(xs)}, ${n(ys)}) the Jacobian matrix is [[${n(j11)}, 1], [${n(-m)}, 1]].`,
  guidance: [
   { prompt: `x′ = 0 gives y = ${sx}x². Put it into y′ = 0 to get ${quad} = 0. What is its smaller root?`, answer: [xs], explanation: `${quad} = ${s === 1 ? '' : n(s)}${fac(r1)}${fac(r2)}, so the roots are ${n(r1)} and ${n(r2)}; the smaller is ${n(xs)}.` },
   { prompt: `What is y at that critical point?`, answer: [ys], explanation: `y = ${sx}x² = ${s === 1 ? '' : n(s) + ' × '}${par(xs)}² = ${n(ys)}.` },
   { prompt: `For f = y − ${sx}x², treat y as a fixed number and differentiate in x. What is ∂f/∂x at the critical point?`, answer: [j11], explanation: `∂f/∂x = −${s === 1 ? '2' : n(2 * s)}x = −${n(2 * s)} × ${par(xs)} = ${n(j11)}.` },
   { prompt: `For g = ${g}, what is ∂g/∂x?`, answer: [-m], explanation: `Only the term ${tm(-m, 'x')} depends on x, so ∂g/∂x = ${n(-m)}; and ∂g/∂y = 1, from the term y.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'A nudge at the vent',
 brief: 'A sensor in the air vent has been knocked off its resting reading, and the crew wants a quick estimate of how fast it starts to drift.',
 labels: ['x', 'y', 'estimated u′', 'estimated v′'], tolerance: 0.01,
 gl: [['y'], ['estimated u′'], ['estimated v′']]
}, {
 /* x′ = xy − c·y0², y′ = x − c·y: y′ = 0 gives x = c y, and then c y² = c y0², so y = ±y0. The critical point with positive x is (c·y0, y0) (y0 > 0).
    There ∂f/∂x = y0, ∂f/∂y = c·y0, ∂g/∂x = 1, ∂g/∂y = −c. The sensor is displaced by (u, v) = (nu, nv), and u′ = y0·nu + c·y0·nv, v′ = nu − c·nv. */
 canonical: { c: 2, y0: 3, nu: 1, nv: -2 },
 draw: R => ({ c: R.int(1, 4), y0: R.int(1, 5), nu: R.nz(-3, 3), nv: R.nz(-3, 3) }),
 build: ({ c, y0, nu, nv }) => { const P = c * y0 * y0, xs = c * y0, ys = y0, up = ys * nu + xs * nv, vp = nu - c * nv, f = `xy${tail([[-P, '']])}`, g = expr([[1, 'x'], [-c, 'y']]); return {
  prompt: `Two readings from the dome’s air vent, x and y, obey x′ = ${f} and y′ = ${g}. First find the critical point with positive x. Then a sensor is displaced from that point by u = ${n(nu)} in x and v = ${n(nv)} in y. The linearised system estimates how fast the displacement changes: u′ ≈ (∂f/∂x)u + (∂f/∂y)v and v′ ≈ (∂g/∂x)u + (∂g/∂y)v, with the partial derivatives worked out at the critical point, where f and g are the two right-hand sides. These are estimates, not the exact rates, because the linearisation leaves out a small product term in u and v. Enter x, then y, then the estimated rates u′ and v′ for this displacement.`,
  answer: [xs, ys, up, vp],
  hints: ['At a critical point both right-hand sides are 0. The second equation gives x in terms of y; put it into the first and solve for y, keeping the root that makes x positive.',
   'The partial derivative of xy in x is y, and in y it is x. Put the critical point into each of the four partial derivatives, then multiply out the two estimated rates with the displacement.'],
  solution: `y′ = 0 gives x = ${cy(c, 'y')}. Putting this into ${f} = 0 gives ${c === 1 ? `y² = ${n(P)}` : `${n(c)}y² = ${n(P)}, so y² = ${n(y0 * y0)}`}, and y = ±${n(y0)}. Positive x needs positive y, so the critical point is (${n(xs)}, ${n(ys)}). For f = ${f}: ∂f/∂x = y = ${n(ys)} and ∂f/∂y = x = ${n(xs)}. For g = ${g}: ∂g/∂x = 1 and ∂g/∂y = ${n(-c)}. So the linearised system estimates u′ ≈ ${n(ys)} × ${par(nu)} + ${n(xs)} × ${par(nv)} = ${n(up)} and v′ ≈ 1 × ${par(nu)} + ${par(-c)} × ${par(nv)} = ${n(vp)}.`,
  guidance: [
   { prompt: `y′ = 0 gives x = ${cy(c, 'y')}. Put it into ${f} = 0 to get ${c === 1 ? '' : n(c)}y² = ${n(P)}. What is y at the critical point with positive x?`, answer: [ys], explanation: `y² = ${n(y0 * y0)}, so y = ±${n(y0)}. Since x = ${cy(c, 'y')}, positive x needs positive y: y = ${n(ys)}, and then x = ${n(xs)}.` },
   { prompt: `At the critical point (${n(xs)}, ${n(ys)}), ∂f/∂x = y and ∂f/∂y = x. What is the linearised estimate u′ ≈ (∂f/∂x)u + (∂f/∂y)v for u = ${n(nu)} and v = ${n(nv)}?`, answer: [up], explanation: `u′ ≈ ${n(ys)} × ${par(nu)} + ${n(xs)} × ${par(nv)} = ${n(up)}.` },
   { prompt: `For g = ${g}, ∂g/∂x = 1 and ∂g/∂y = ${n(-c)}. What is the linearised estimate v′ ≈ (∂g/∂x)u + (∂g/∂y)v for the same u and v?`, answer: [vp], explanation: `v′ ≈ 1 × ${par(nu)} + ${par(-c)} × ${par(nv)} = ${n(vp)}.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', title: 'Crossing curves in the filter bed',
 brief: 'Two readings from the filter bed settle where a hyperbola meets a circle, and the crew wants the outermost resting point and its Jacobian matrix.',
 labels: L6, tolerance: 0.01,
 gl: [['x + y'], ['x − y'], ['∂g/∂y']]
}, {
 /* x′ = xy − x0·y0, y′ = x² + y² − (x0² + y0²), with x0 > y0 ≥ 1. (x + y)² = R + 2P and (x − y)² = R − 2P give x + y = ±(x0 + y0) and x − y = ±(x0 − y0).
    The critical points are (x0, y0), (y0, x0) and their negatives. pt = 1 asks for the largest x, (x0, y0), where J = [[y0, x0], [2·x0, 2·y0]];
    pt = 0 asks for the smallest x, (−x0, −y0), where J = [[−y0, −x0], [−2·x0, −2·y0]]. */
 canonical: { x0: 4, y0: 1, pt: 1 },
 draw: R => { const x0 = R.int(2, 7); return { x0, y0: R.int(1, x0 - 1), pt: R.int(0, 1) }; },
 build: ({ x0, y0, pt }) => { const P = x0 * y0, Rr = x0 * x0 + y0 * y0, f = `xy${tail([[-P, '']])}`, g = `x² + y²${tail([[-Rr, '']])}`, sg = pt ? 1 : -1,
  xs = sg * x0, ys = sg * y0, which = pt ? 'largest' : 'smallest', sq1 = (x0 + y0) * (x0 + y0), sq2 = (x0 - y0) * (x0 - y0); return {
  prompt: `Two readings from the dome’s filter bed, x and y, obey x′ = ${f} and y′ = ${g}. This system has four critical points. Find the one with the ${which} x, and the Jacobian matrix of the system there. Enter x, then y, then the four entries of the Jacobian matrix row by row.`,
  answer: [xs, ys, ys, xs, 2 * xs, 2 * ys],
  hints: ['At a critical point xy = P and x² + y² = R for the two numbers in the equations. Since (x + y)² = x² + y² + 2xy and (x − y)² = x² + y² − 2xy, you can find x + y and x − y first (each with a plus or minus sign), then x and y.',
   'The Jacobian matrix has rows (∂f/∂x, ∂f/∂y) and (∂g/∂x, ∂g/∂y). The partial derivative of xy in x is y and in y is x; of x² in x is 2x; of y² in y is 2y. Put the critical point into each.'],
  solution: `At a critical point xy = ${n(P)} and x² + y² = ${n(Rr)}. Then (x + y)² = ${n(Rr)} + 2 × ${n(P)} = ${n(sq1)} and (x − y)² = ${n(Rr)} − 2 × ${n(P)} = ${n(sq2)}, so x + y = ±${n(x0 + y0)} and x − y = ±${n(x0 - y0)}. Since xy is positive, x and y have the same sign, and the four critical points are (${n(x0)}, ${n(y0)}), (${n(y0)}, ${n(x0)}), (${n(-y0)}, ${n(-x0)}) and (${n(-x0)}, ${n(-y0)}). The ${which} x is ${n(xs)}, with y = ${n(ys)}. For f = ${f}: ∂f/∂x = y and ∂f/∂y = x. For g = ${g}: ∂g/∂x = 2x and ∂g/∂y = 2y. At (${n(xs)}, ${n(ys)}) the Jacobian matrix is [[${n(ys)}, ${n(xs)}], [${n(2 * xs)}, ${n(2 * ys)}]].`,
  guidance: [
   { prompt: `(x + y)² = x² + y² + 2xy. With xy = ${n(P)} and x² + y² = ${n(Rr)}, what is x + y for the critical point with the ${which} x (x and y are both ${pt ? 'positive' : 'negative'} there)?`, answer: [sg * (x0 + y0)], explanation: `(x + y)² = ${n(Rr)} + 2 × ${n(P)} = ${n(sq1)}, so x + y = ±${n(x0 + y0)}; here both are ${pt ? 'positive' : 'negative'}, so x + y = ${n(sg * (x0 + y0))}.` },
   { prompt: `(x − y)² = x² + y² − 2xy. What is x − y at the critical point with the ${which} x (there x is ${pt ? 'bigger' : 'smaller'} than y)?`, answer: [sg * (x0 - y0)], explanation: `(x − y)² = ${n(Rr)} − 2 × ${n(P)} = ${n(sq2)}, so x − y = ${n(sg * (x0 - y0))}. With x + y = ${n(sg * (x0 + y0))}, adding gives 2x = ${n(2 * xs)}, so x = ${n(xs)} and y = ${n(ys)}.` },
   { prompt: `For g = ${g}, treat x as a fixed number and differentiate in y. What is ∂g/∂y at the critical point?`, answer: [2 * ys], explanation: `∂g/∂y = 2y = 2 × ${par(ys)} = ${n(2 * ys)}; and ∂g/∂x = 2x = ${n(2 * xs)}.` }
  ] }; }
});

/* ---- q37 Stability and classification of critical points [8.2] ---- */

/* The eigenvalues of [[a, b], [c, d]] when they are whole numbers or a ± bi with whole a and b, else null. Returns [larger real part, smaller real part, imaginary part]. */
const eigs = (a, b, c, d) => { const T = a + d, D = a * d - b * c, disc = T * T - 4 * D;
 if (disc >= 0) { const s = Math.sqrt(disc); if (!isInt(s) || !isInt((T + s) / 2)) return null; return [(T + s) / 2, (T - s) / 2, 0]; }
 const im = Math.sqrt(-disc) / 2; if (!isInt(T / 2) || !isInt(im)) return null; return [T / 2, T / 2, im]; };
const NAMES = { 1: 'a node', 2: 'a saddle', 3: 'a spiral', 4: 'a centre' };

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Two valves on the vapour line',
 brief: 'Two valves on the dome’s vapour line push each other, and the crew wants to know whether the closed-down state is one the line settles into.',
 labels: ['larger real part', 'smaller real part', 'imaginary part', 'code (1–3)'], tolerance: 0.01,
 gl: [['∂f/∂x'], ['determinant'], ['real part']]
}, {
 /* x′ = a x + b y + m x², y′ = c x + d y + q x y. (0, 0) is a critical point, and the squared terms have partial derivatives 0 there, so the
    Jacobian is [[a, b], [c, d]]. Draws are built so the eigenvalues are whole numbers or a ± bi with whole a, b: kind 0 node (distinct, same sign),
    1 saddle, 2 spiral (a ≠ 0). No centres, and no repeated roots. The kind only chooses the numbers; the answer comes from the matrix. */
 canonical: { a: 1, b: 2, c: 2, d: -2, m: 1, q: -1 },
 draw: R => retry(() => { const kind = R.int(0, 2); let T, D;
   if (kind === 2) { const al = R.nz(-3, 3), be = R.int(1, 3); T = 2 * al; D = al * al + be * be; }
   else { const l1 = R.nz(-4, 4), l2 = kind === 0 ? (l1 > 0 ? R.int(1, 4) : R.int(-4, -1)) : (l1 > 0 ? R.int(-4, -1) : R.int(1, 4)); T = l1 + l2; D = l1 * l2; }
   const a = R.int(-4, 4), d = T - a, bc = a * d - D, b = R.nz(-4, 4); if (bc === 0 || bc % b !== 0) return null;
   return { a, b, c: bc / b, d, m: R.nz(-3, 3), q: R.nz(-3, 3) }; },
  p => Math.abs(p.c) <= 9 && Math.abs(p.d) <= 9 && !!eigs(p.a, p.b, p.c, p.d) && (eigs(p.a, p.b, p.c, p.d)[2] > 0 ? eigs(p.a, p.b, p.c, p.d)[0] !== 0 : eigs(p.a, p.b, p.c, p.d)[0] !== eigs(p.a, p.b, p.c, p.d)[1]),
  { a: 1, b: 2, c: 2, d: -2, m: 1, q: -1 }),
 build: ({ a, b, c, d, m, q }) => { const T = a + d, D = a * d - b * c, [e1, e2, im] = eigs(a, b, c, d), code = im > 0 ? 3 : (e1 * e2 < 0 ? 2 : 1),
  f = expr([[a, 'x'], [b, 'y'], [m, 'x²']]), g = expr([[c, 'x'], [d, 'y'], [q, 'xy']]), charEq = `λ²${tail([[-T, 'λ'], [D, '']])} = 0`,
  eigText = im > 0 ? `λ = ${n(e1)} ± ${im === 1 ? '' : n(im)}i` : `λ = ${n(e1)} and λ = ${n(e2)}`,
  why = code === 2 ? 'real with opposite signs' : code === 1 ? 'real with the same sign' : 'complex with a non-zero real part'; return {
  prompt: `Two valves on the dome’s vapour line have openings x and y, measured from their closed-down settings, that obey x′ = ${f} and y′ = ${g}. The point (0, 0) is a critical point. Classify it from the Jacobian matrix there. Enter the real parts of the two eigenvalues, larger first (the same number twice for a complex pair), then the size of their imaginary part (0 if they are real), then the code: 1 node, 2 saddle, 3 spiral (no centre occurs in this system).`,
  answer: [e1, e2, im, code],
  hints: ['The Jacobian matrix has rows (∂f/∂x, ∂f/∂y) and (∂g/∂x, ∂g/∂y). A term such as x² or xy has partial derivatives that are 0 at the point (0, 0), so only the terms in x and y alone are left.',
   'The eigenvalues solve λ² − (trace)λ + (determinant) = 0. Real with opposite signs is a saddle, real with the same sign a node, complex with a non-zero real part a spiral.'],
  solution: `At (0, 0) the partial derivatives of the x² and xy terms are 0, so ∂f/∂x = ${n(a)}, ∂f/∂y = ${n(b)}, ∂g/∂x = ${n(c)} and ∂g/∂y = ${n(d)}. The Jacobian matrix is [[${n(a)}, ${n(b)}], [${n(c)}, ${n(d)}]], with trace ${n(T)} and determinant ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(D)}. The eigenvalues solve ${charEq}, so ${eigText}. They are ${why}, so the point is ${NAMES[code]}: code ${code}.`,
  guidance: [
   { prompt: `f = ${f}. What is ∂f/∂x at (0, 0)?`, answer: [a], explanation: `The term ${tm(m, 'x²')} has partial derivative ${n(2 * m)}x in x, which is 0 at x = 0, so only the term in x alone is left: ∂f/∂x = ${n(a)}.` },
   { prompt: `The Jacobian matrix at (0, 0) is [[${n(a)}, ${n(b)}], [${n(c)}, ${n(d)}]]. What is its determinant?`, answer: [D], explanation: `${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(D)}. The trace is ${n(T)}, so the eigenvalues solve ${charEq}.` },
   { prompt: `Solve ${charEq}. What is the real part of the larger eigenvalue (or of either one, for a complex pair)?`, answer: [e1], explanation: `${eigText}. They are ${why}, so the point is ${NAMES[code]}.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Moss and lichen on the roof panel',
 brief: 'Moss and lichen compete for light on the roof panel, and the crew wants to know whether the two can live side by side.',
 labels: ['x', 'y', 'determinant', 'code (1 or 2)'], tolerance: 0.01,
 gl: [['x'], ['determinant'], ['code (1 or 2)']]
}, {
 /* x′ = x(a − x − p y), y′ = y(b − q x − y) with a = xs + p·ys and b = q·xs + ys, so the coexistence point is (xs, ys). There the Jacobian is
    [[−xs, −p·xs], [−q·ys, −ys]], with determinant xs·ys(1 − p·q) and trace −(xs + ys); disc = (xs − ys)² + 4pq·xs·ys > 0, so the eigenvalues are real.
    p·q < 1: node (code 1); p·q > 1: saddle (code 2). p·q ≠ 1, and p·ys and q·xs are whole numbers. */
 canonical: { xs: 3, ys: 4, p: 0.5, q: 1 },
 draw: R => retry(() => ({ xs: R.int(1, 6), ys: R.int(1, 6), p: R.pick([0.5, 1, 2, 3]), q: R.pick([0.5, 1, 2, 3]) }),
  p => p.p * p.q !== 1 && isInt(p.p * p.ys) && isInt(p.q * p.xs), { xs: 3, ys: 4, p: 0.5, q: 1 }),
 build: ({ xs, ys, p, q }) => { const a = xs + p * ys, b = q * xs + ys, det = xs * ys * (1 - p * q), code = p * q > 1 ? 2 : 1; return {
  prompt: `Moss x and lichen y (both in hundreds of patches) compete for light on a roof panel of the dome, and follow x′ = x(${n(a)} − x − ${cy(p, 'y')}) and y′ = y(${n(b)} − ${cy(q, 'x')} − y). There is one coexistence point with x and y both positive, and the eigenvalues of the Jacobian matrix there are real (take this as given). Enter x, then y at that point, then the determinant of the Jacobian matrix there, then the code: 1 node, 2 saddle.`,
  answer: [xs, ys, det, code],
  hints: ['At a coexistence point both brackets are 0, which gives two straight-line equations in x and y: solve them together.',
   'Where a bracket is 0, the product rule leaves only the outside letter times the derivative of the bracket, so ∂f/∂x = −x and ∂f/∂y = −p x there (and the same pattern for g). For real eigenvalues, a negative determinant means opposite signs (a saddle) and a positive one means the same sign (a node).'],
  solution: `Both brackets are 0: x + ${cy(p, 'y')} = ${n(a)} and ${cy(q, 'x')} + y = ${n(b)}. Solving them together gives x = ${n(xs)} and y = ${n(ys)}. Since each bracket is 0 there, ∂f/∂x = −x = ${n(-xs)}, ∂f/∂y = ${tm(-p, 'x')} = ${n(-p * xs)}, ∂g/∂x = ${tm(-q, 'y')} = ${n(-q * ys)} and ∂g/∂y = −y = ${n(-ys)}. The Jacobian matrix is [[${n(-xs)}, ${n(-p * xs)}], [${n(-q * ys)}, ${n(-ys)}]], with determinant ${n(xs * ys)} − ${n(p * q * xs * ys)} = ${n(det)}. The eigenvalues are real and ${det < 0 ? 'the determinant is negative, so they have opposite signs: a saddle, code 2' : 'the determinant is positive, so they have the same sign: a node, code 1'}.`,
  guidance: [
   { prompt: `Both brackets are 0: x + ${cy(p, 'y')} = ${n(a)} and ${cy(q, 'x')} + y = ${n(b)}. Solving the pair together, what is x?`, answer: [xs], explanation: `Solving gives x = ${n(xs)} and y = ${n(ys)}: check ${n(xs)} + ${n(p)} × ${n(ys)} = ${n(a)} and ${n(q)} × ${n(xs)} + ${n(ys)} = ${n(b)}.` },
   { prompt: `At (${n(xs)}, ${n(ys)}) the Jacobian matrix is [[${n(-xs)}, ${n(-p * xs)}], [${n(-q * ys)}, ${n(-ys)}]]. What is its determinant?`, answer: [det], explanation: `${par(-xs)} × ${par(-ys)} − ${par(-p * xs)} × ${par(-q * ys)} = ${n(xs * ys)} − ${n(p * q * xs * ys)} = ${n(det)}.` },
   { prompt: `The eigenvalues are real. Is the determinant ${n(det)} negative or positive? Enter 2 for a saddle (opposite signs) or 1 for a node (same sign).`, answer: [code], explanation: det < 0 ? `A negative determinant means the eigenvalues have opposite signs: a saddle, code 2.` : `A positive determinant means the eigenvalues have the same sign: a node, code 1.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'Which pollen-filter reading is steady',
 brief: 'Two readings from the dome’s pollen filters have two resting points, and the crew wants the one asked for and how it behaves.',
 labels: ['x', 'y', 'trace', 'determinant', 'code (1–3)'], tolerance: 0.01,
 gl: [['x'], ['y'], ['determinant']]
}, {
 /* x′ = xy − P, y′ = y − c x − d with P = −c·r1·r2 and d = −c(r1 + r2): critical points (r1, −c·r2) and (r2, −c·r1). The Jacobian is [[y, x], [−c, 1]]
    there: trace y + 1, determinant y + c·x. det < 0: saddle (2); det > 0 with trace² > 4 det: node (1); trace² < 4 det: spiral (3). No centre (trace 0) and no repeated root. */
 canonical: { c: 1, r1: -3, r2: 2, pt: 1 },
 draw: R => retry(() => { const r1 = R.nz(-4, 3); return { c: R.int(1, 3), r1, r2: R.nz(r1 + 1 > 4 ? 4 : r1 + 1, 4), pt: R.int(0, 1) }; },
  p => { if (p.r2 <= p.r1) return false; const x = p.pt ? p.r2 : p.r1, y = -p.c * (p.pt ? p.r1 : p.r2), T = y + 1, D = y + p.c * x;
   return T !== 0 && D !== 0 && T * T !== 4 * D && !(p.c === 2 && p.r1 === -1 && p.r2 === 3) && !(p.c === 1 && p.r1 === -1 && p.r2 === 2); },
  { c: 1, r1: -3, r2: 2, pt: 1 }),
 build: ({ c, r1, r2, pt }) => { const P = -c * r1 * r2, d = -c * (r1 + r2), xs = pt ? r2 : r1, ys = -c * (pt ? r1 : r2), T = ys + 1, D = ys + c * xs,
  code = D < 0 ? 2 : (T * T > 4 * D ? 1 : 3), which = pt ? 'larger' : 'smaller', f = `xy${tail([[-P, '']])}`, g = `y${tail([[-c, 'x'], [-d, '']])}`, line = expr([[c, 'x'], [d, '']]),
  quad = expr([[c, 'x²'], [d, 'x'], [-P, '']]), why = code === 2 ? 'The determinant is negative, so the eigenvalues have opposite signs: a saddle.' : code === 1 ? `The determinant is positive and trace² = ${n(T * T)} is more than 4 × determinant = ${n(4 * D)}, so the eigenvalues are real with the same sign: a node.` : `The determinant is positive and trace² = ${n(T * T)} is less than 4 × determinant = ${n(4 * D)}, so the eigenvalues are complex with a non-zero real part: a spiral.`; return {
  prompt: `Two readings from the dome’s pollen filters, x and y, obey x′ = ${f} and y′ = ${g}. Find the critical point with the ${which} x, and classify it using the Jacobian matrix there. Enter x, then y, then the trace and the determinant of the Jacobian matrix, then the code: 1 node, 2 saddle, 3 spiral (no centre or repeated eigenvalue occurs here).`,
  answer: [xs, ys, T, D, code],
  hints: ['At a critical point both right-hand sides are 0. Solve the simpler equation for y, put it into the other one, and take the root asked for. The Jacobian matrix has rows (∂f/∂x, ∂f/∂y) and (∂g/∂x, ∂g/∂y).',
   'The trace is the sum of the diagonal entries. The eigenvalues solve λ² − (trace)λ + (determinant) = 0: a negative determinant means opposite signs (saddle). With a positive determinant, trace² larger than 4 × determinant means two real eigenvalues of the same sign (node), and smaller means a complex pair with a non-zero real part (spiral).'],
  solution: `y′ = 0 gives y = ${line}. Putting this into ${f} = 0 gives ${quad} = 0, whose roots are x = ${n(r1)} and x = ${n(r2)}. The ${which} is x = ${n(xs)}, with y = ${n(ys)}. For f = ${f}: ∂f/∂x = y and ∂f/∂y = x; for g = ${g}: ∂g/∂x = ${n(-c)} and ∂g/∂y = 1. The Jacobian matrix at (${n(xs)}, ${n(ys)}) is [[${n(ys)}, ${n(xs)}], [${n(-c)}, 1]], with trace ${n(ys)} + 1 = ${n(T)} and determinant ${par(ys)} × 1 − ${par(xs)} × ${par(-c)} = ${n(D)}. ${why} Code ${code}.`,
  guidance: [
   { prompt: `y′ = 0 gives y = ${line}. Put it into ${f} = 0 to get ${quad} = 0. What is its ${which} root?`, answer: [xs], explanation: `${quad} = ${c === 1 ? '' : n(c)}${fac(r1)}${fac(r2)}, so the roots are ${n(r1)} and ${n(r2)}; the ${which} is ${n(xs)}.` },
   { prompt: `What is y at that critical point?`, answer: [ys], explanation: `y = ${line} at x = ${n(xs)} is ${n(c)} × ${par(xs)}${tail([[d, '']])} = ${n(ys)}.` },
   { prompt: `The Jacobian matrix at the critical point is [[${n(ys)}, ${n(xs)}], [${n(-c)}, 1]]. What is its determinant?`, answer: [D], explanation: `${par(ys)} × 1 − ${par(xs)} × ${par(-c)} = ${n(D)}. The trace is ${n(ys)} + 1 = ${n(T)}.` }
  ] }; }
});

/* ---- q38 Predator and prey [8.3] ---- */

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'Larvae and minnows in the pond zone',
 brief: 'The dome’s pond zone holds mosquito larvae and the minnows that eat them, and the crew wants the steady levels and how long each swing takes.',
 labels: ['y (tens)', 'x (hundreds)', 'period (days)'], tolerance: 0.005,
 gl: [['y (tens)'], ['x (hundreds)'], ['ω²'], ['period (days)']]
}, {
 /* x′ = ax − bxy (larvae, hundreds), y′ = dxy − cy (minnows, tens), time in days, with b = a ÷ ys and d = c ÷ xs printed with at most 4 decimals.
    Small swings have period 2π ÷ √(ac). The answers are asked y first, then x. Not the q38 worked example or the q38 learn draw. */
 canonical: { a: 0.6, ys: 3, c: 0.8, xs: 10 },
 draw: R => retry(() => ({ a: R.pick([0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5]), ys: R.pick([2, 3, 4, 5, 6, 8, 10]), c: R.pick([0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5]), xs: R.pick([4, 5, 8, 10, 12, 15, 20]) }),
  p => hasDec(p.a / p.ys, 4) && hasDec(p.c / p.xs, 4) && p.a !== p.ys && p.c !== p.xs && !nearTie(2 * Math.PI / Math.sqrt(p.a * p.c), 2) && !(p.a === 1 && p.ys === 5 && p.c === 0.5 && p.xs === 10) && !(p.a === 0.6 && p.ys === 6 && p.c === 0.4 && p.xs === 5), { a: 0.6, ys: 3, c: 0.8, xs: 10 }),
 build: ({ a, ys, c, xs }) => { const b = a / ys, d = c / xs, ac = Math.round(a * c * 1e4) / 1e4, w = Math.sqrt(a * c), T = 2 * Math.PI / w; return {
  prompt: `The dome’s pond zone holds mosquito larvae x (in hundreds) and the minnows that eat them y (in tens). With time in days, they follow x′ = ${cy(a, 'x')} − ${n(b)}xy and y′ = ${n(d)}xy − ${cy(c, 'y')}. Enter the coexistence point, y first and then x, where both populations stay constant, then the period in days of small swings around it, to 2 decimal places.`,
  answer: [ys, xs, r2(T)],
  hints: ['Factor each right-hand side: x(a − by) and y(−c + dx). The coexistence point has x and y both non-zero, so each bracket is 0.',
   'At the coexistence point the Jacobian matrix has zeros on its diagonal, so its eigenvalues are ±iω with ω² equal to its determinant. Small swings then repeat every 2π ÷ ω.'],
  solution: `x′ = x(${n(a)} − ${n(b)}y) is 0 for y = ${n(a)} ÷ ${n(b)} = ${n(ys)}, and y′ = y(−${n(c)} + ${n(d)}x) is 0 for x = ${n(c)} ÷ ${n(d)} = ${n(xs)}. So the coexistence point is x = ${n(xs)}, y = ${n(ys)}. There the Jacobian matrix is [[0, −${n(b * xs)}], [${n(d * ys)}, 0]], with determinant ${n(b * xs)} × ${n(d * ys)} = ${n(ac)}. The eigenvalues are ±i√${n(ac)}, so ω = √${n(ac)} ≈ ${fx(w, 4)} per day, and the period is 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} days to 2 decimal places.`,
  guidance: [
   { prompt: `x′ = x(${n(a)} − ${n(b)}y) is 0 with x non-zero when the bracket is 0. What is y at the coexistence point?`, answer: [ys], explanation: `${n(b)}y = ${n(a)}, so y = ${n(a)} ÷ ${n(b)} = ${n(ys)}.` },
   { prompt: `y′ = y(−${n(c)} + ${n(d)}x) is 0 with y non-zero when the bracket is 0. What is x there?`, answer: [xs], explanation: `${n(d)}x = ${n(c)}, so x = ${n(c)} ÷ ${n(d)} = ${n(xs)}.` },
   { prompt: `At (${n(xs)}, ${n(ys)}) the Jacobian matrix is [[0, −${n(b * xs)}], [${n(d * ys)}, 0]]. What is its determinant, ω²?`, answer: [ac], explanation: `0 × 0 − (−${n(b * xs)}) × ${n(d * ys)} = ${n(ac)}, which is a × c. The eigenvalues are ±i√${n(ac)}.` },
   { prompt: `ω = √${n(ac)}. What is the period 2π ÷ ω, in days to 2 decimal places?`, answer: [r2(T)], explanation: `ω ≈ ${fx(w, 4)}, and 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} to 2 decimal places.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'How many swings fit in the sealed log',
 brief: 'The sealed log of the dome will run for months, and Mira needs the bird count it settles round and how many full swings the log will see.',
 labels: ['birds', 'period (months)', 'complete swings'], tolerance: 0.005,
 gl: [['y (tens)'], ['period (months)'], ['complete swings']]
}, {
 /* x′ = ax − bxy, y′ = −cy + dxy with b = a ÷ ys and d = c ÷ xs printed with at most 4 decimals; time in months. Birds = 10·ys. Period 2π ÷ √(ac).
    The log lasts span months: complete swings = floor(span ÷ T), the same with the exact and the rounded period, and span ÷ T is not near a whole number. */
 canonical: { a: 1.2, ys: 6, c: 0.8, xs: 8, span: 60 },
 draw: R => retry(() => ({ a: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), ys: R.pick([2, 3, 4, 5, 6, 8, 10]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), xs: R.pick([4, 5, 8, 10, 12, 15, 20]), span: R.pick([24, 36, 48, 60, 72, 84, 96, 120]) }),
  p => { const T = 2 * Math.PI / Math.sqrt(p.a * p.c), q = p.span / T, fr = q - Math.floor(q); return hasDec(p.a / p.ys, 4) && hasDec(p.c / p.xs, 4) && p.a !== p.ys && p.c !== p.xs && !nearTie(T, 2) && q >= 1 && fr > 0.1 && fr < 0.9 && Math.floor(p.span / r2(T)) === Math.floor(q) && !(p.a === 1 && p.ys === 5 && p.c === 0.5 && p.xs === 10); },
  { a: 1.2, ys: 6, c: 0.8, xs: 8, span: 60 }),
 build: ({ a, ys, c, xs, span }) => { const b = a / ys, d = c / xs, ac = Math.round(a * c * 1e4) / 1e4, w = Math.sqrt(a * c), T = 2 * Math.PI / w, sw = Math.floor(span / T); return {
  prompt: `The dome’s sealed log will run for ${n(span)} months. Insects x (in hundreds) and the birds that eat them y (in tens) follow x′ = ${cy(a, 'x')} − ${n(b)}xy and y′ = −${cy(c, 'y')} + ${n(d)}xy, with time in months. Enter the number of birds at the coexistence point (a count, not tens), then the period in months of small swings around that point, to 2 decimal places, then the number of complete swings that fit into the ${n(span)} months of the log (a whole number, found from the period before it is rounded).`,
  answer: [ys * 10, r2(T), sw],
  hints: ['Factor x′ = x(a − by). The coexistence point has x non-zero, so the bracket is 0, and that gives the bird level in tens. The birds are counted in tens, so multiply by 10 for the number of birds.',
   'Near the coexistence point the swings have ω² = a × c and repeat every 2π ÷ ω. The number of complete swings is the whole number of periods that fit into the time: divide the time by the period and drop the fraction.'],
  solution: `x′ = x(${n(a)} − ${n(b)}y) is 0 with x non-zero for y = ${n(a)} ÷ ${n(b)} = ${n(ys)} tens, which is ${n(ys * 10)} birds. Near the coexistence point ω² = a × c = ${n(a)} × ${n(c)} = ${n(ac)}, so ω ≈ ${fx(w, 4)} per month and the period is 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} months to 2 decimal places. In ${n(span)} months there are ${n(span)} ÷ ${fx(T, 4)} ≈ ${fx(span / T, 2)} periods, so ${n(sw)} complete swings fit.`,
  guidance: [
   { prompt: `x′ = x(${n(a)} − ${n(b)}y) is 0 with x non-zero when the bracket is 0. What is y at the coexistence point, in tens?`, answer: [ys], explanation: `${n(b)}y = ${n(a)}, so y = ${n(a)} ÷ ${n(b)} = ${n(ys)} tens, which is ${n(ys * 10)} birds.` },
   { prompt: `The swings have ω² = a × c = ${n(ac)}. What is the period 2π ÷ ω, in months to 2 decimal places?`, answer: [r2(T)], explanation: `ω ≈ ${fx(w, 4)}, and 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} to 2 decimal places.` },
   { prompt: `The log lasts ${n(span)} months and one swing takes ${fx(T, 4)} months (unrounded). How many complete swings fit?`, answer: [sw], explanation: `${n(span)} ÷ ${fx(T, 4)} ≈ ${fx(span / T, 2)}, and only the whole periods count: ${n(sw)}.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', title: 'Netting insects for compost',
 brief: 'A crew nets insects from the pond zone each month for compost, and Mira wants the new steady levels and swing period.',
 labels: ['x (hundreds)', 'y (tens)', 'period (months)'], tolerance: 0.005,
 gl: [['A'], ['y (tens)'], ['x (hundreds)'], ['period (months)']]
}, {
 /* x′ = a x − b x y − h x, y′ = −c y + d x y with a = A + h, b = A ÷ ys and d = c ÷ xs (at most 4 decimals). Collecting the x terms gives x′ = x(A − b y),
    so the coexistence point is (c ÷ d, A ÷ b) = (xs, ys) and small swings have period 2π ÷ √(A·c). Time in months. */
 canonical: { A: 0.8, h: 0.2, c: 0.5, ys: 5, xs: 10 },
 draw: R => retry(() => ({ A: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2]), h: R.pick([0.1, 0.2, 0.3, 0.4]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2]), ys: R.pick([2, 3, 4, 5, 6, 8, 10]), xs: R.pick([4, 5, 8, 10, 12, 15, 20]) }),
  p => hasDec(p.A / p.ys, 4) && hasDec(p.c / p.xs, 4) && p.A !== p.ys && p.c !== p.xs && !nearTie(2 * Math.PI / Math.sqrt(p.A * p.c), 2), { A: 0.8, h: 0.2, c: 0.5, ys: 5, xs: 10 }),
 build: ({ A, h, c, ys, xs }) => { const a = Math.round((A + h) * 1e4) / 1e4, b = A / ys, d = c / xs, Ac = Math.round(A * c * 1e4) / 1e4, w = Math.sqrt(A * c), T = 2 * Math.PI / w; return {
  prompt: `A crew nets insects from the dome’s pond zone for compost, taking a share of the insects every month. The insects x (in hundreds) and the birds that eat them y (in tens) then follow x′ = ${cy(a, 'x')} − ${n(b)}xy − ${cy(h, 'x')} and y′ = −${cy(c, 'y')} + ${n(d)}xy, with time in months; the last term of the first equation is the netting. Enter the coexistence point, x then y, then the period in months of small swings around it, to 2 decimal places.`,
  answer: [xs, ys, r2(T)],
  hints: ['Collect the two terms in x only: x′ = x(A − by), where A is the growth rate minus the netting rate. Then each bracket is 0 at the coexistence point, as before.',
   'At the coexistence point the Jacobian matrix has zeros on its diagonal, and ω² is the product of the prey’s collected rate A and the predators’ death rate c. The period is 2π ÷ ω.'],
  solution: `Collecting the insect terms, x′ = x(${n(a)} − ${n(h)} − ${n(b)}y) = x(${n(A)} − ${n(b)}y), which is 0 with x non-zero for y = ${n(A)} ÷ ${n(b)} = ${n(ys)}. And y′ = y(−${n(c)} + ${n(d)}x) is 0 for x = ${n(c)} ÷ ${n(d)} = ${n(xs)}. So the coexistence point is (${n(xs)}, ${n(ys)}). The Jacobian matrix there has zeros on its diagonal and determinant ${n(A)} × ${n(c)} = ${n(Ac)}, so ω = √${n(Ac)} ≈ ${fx(w, 4)} per month and the period is 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} months to 2 decimal places.`,
  guidance: [
   { prompt: `Collect the insect terms: ${cy(a, 'x')} − ${cy(h, 'x')} − ${n(b)}xy = x(A − ${n(b)}y). What is A?`, answer: [A], explanation: `${n(a)} − ${n(h)} = ${n(A)}, so x′ = x(${n(A)} − ${n(b)}y).` },
   { prompt: `x′ = x(${n(A)} − ${n(b)}y) is 0 with x non-zero when the bracket is 0. What is y at the coexistence point?`, answer: [ys], explanation: `${n(b)}y = ${n(A)}, so y = ${n(A)} ÷ ${n(b)} = ${n(ys)}.` },
   { prompt: `y′ = y(−${n(c)} + ${n(d)}x) is 0 with y non-zero when the bracket is 0. What is x there?`, answer: [xs], explanation: `${n(d)}x = ${n(c)}, so x = ${n(c)} ÷ ${n(d)} = ${n(xs)}.` },
   { prompt: `Here ω² = A × c = ${n(Ac)}. What is the period 2π ÷ ω, in months to 2 decimal places?`, answer: [r2(T)], explanation: `ω ≈ ${fx(w, 4)}, and 2π ÷ ω ≈ ${fx(T, 4)}, which is ${fx(r2(T), 2)} to 2 decimal places.` }
  ] }; }
});

/* ---- q39 Boundary value problems and eigenvalue problems [4.1] ---- */

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'Modes of the trellis wire',
 brief: 'A trellis wire along the dome wall is pinned at both ends, and the crew wants one of its allowed settings and how many fall below a limit.',
 labels: ['λ ÷ π²', 'number of allowed λ'], tolerance: 0.005,
 gl: [['√λ ÷ π'], ['λ ÷ π²'], ['number of allowed λ']]
}, {
 /* Allowed λ = (jπ ÷ L)², j = 1, 2, 3, …. The kth is (k ÷ L)² in units of π²; those below N π² have j < L√N, so there are floor(L√N) of them,
    with L√N never within 0.08 of a whole number. L has 1 ÷ L² with at most 4 decimals. Not the q39 worked example or its learn draw (L = 2, k = 3 asked alone). */
 canonical: { L: 2.5, k: 3, N: 12 },
 draw: R => retry(() => ({ L: R.pick([0.5, 2, 2.5, 5]), k: R.int(2, 6), N: R.int(2, 60) }),
  p => { const v = p.L * Math.sqrt(p.N); return Math.abs(v - Math.round(v)) > 0.08 && Math.floor(v) >= 3 && Math.floor(v) <= 12 && !(p.L === 2 && p.k === 3); }, { L: 2.5, k: 3, N: 12 }),
 build: ({ L, k, N }) => { const lk = k * k / (L * L), cnt = Math.floor(L * Math.sqrt(N)); return {
  prompt: `A trellis wire along the dome’s south wall is pinned at both ends, x = 0 and x = ${n(L)} metres. Its shape y obeys y″ + λy = 0 with y(0) = 0 and y(${n(L)}) = 0. Enter the ${ord(k)} smallest positive λ that allows a solution other than y = 0, as a multiple of π² (for 5π² enter 5). Then enter how many different positive values of λ below ${n(N)}π² allow a solution other than y = 0.`,
  answer: [lk, cnt],
  hints: ['For λ > 0 the solutions are y = A cos(√λ x) + C sin(√λ x). The condition at 0 removes the cosine, and the other end needs sin(√λ L) = 0, so √λ L = jπ for a whole number j = 1, 2, 3, …, and λ = j²π² ÷ L².',
   'λ is below Nπ² when j² ÷ L² is below N, that is when j is below L√N. Count the whole numbers j = 1, 2, 3, … that satisfy this.'],
  solution: `y(0) = 0 leaves y = C sin(√λ x), and a solution other than 0 needs sin(√λ × ${n(L)}) = 0, so √λ × ${n(L)} = jπ and λ = (jπ ÷ ${n(L)})² = j² ÷ ${n(L * L)} × π². The ${ord(k)} is j = ${n(k)}: λ = ${n(k * k)} ÷ ${n(L * L)} × π² = ${piSq(lk)}, so enter ${n(lk)}. For the count, j² ÷ ${n(L * L)} < ${n(N)} means j < ${n(L)} × √${n(N)} ≈ ${fx(L * Math.sqrt(N), 2)}, so j = 1 up to ${n(cnt)}: ${n(cnt)} values.`,
  guidance: [
   { prompt: `The allowed values have √λ × ${n(L)} = jπ. For j = ${n(k)}, what is √λ ÷ π?`, answer: [k / L], explanation: `√λ = ${n(k)}π ÷ ${n(L)}, so √λ ÷ π = ${n(k / L)}.` },
   { prompt: `Square it: what is λ ÷ π² for the ${ord(k)} allowed value?`, answer: [lk], explanation: `${n(k / L)}² = ${n(lk)}, so λ = ${piSq(lk)}.` },
   { prompt: `λ = j²π² ÷ ${n(L * L)} is below ${n(N)}π² when j < ${n(L)} × √${n(N)} ≈ ${fx(L * Math.sqrt(N), 2)}. How many whole numbers j = 1, 2, 3, … are below that?`, answer: [cnt], explanation: `j can be 1 up to ${n(cnt)}, so ${n(cnt)} allowed values lie below ${n(N)}π².` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'Measuring the bracing cable from its notes',
 brief: 'A bracing cable has been fitted but its length was never logged, and the crew only knows one of the settings at which it can bow.',
 labels: ['L (metres)', 'λ ÷ π²'], tolerance: 0.005,
 gl: [['√λ ÷ π'], ['L (metres)'], ['λ ÷ π²']]
}, {
 /* Allowed λ = (jπ ÷ L)². The kth is M π² with M = (k ÷ L)², given; so L = k ÷ √M and the smallest allowed is (1 ÷ L)² π².
    L is from a list whose 1 ÷ L² has at most 4 decimals, so M and the answers print exactly. Not the q39 worked example (L = 2, k = 3). */
 canonical: { L: 1.25, k: 3 },
 draw: R => retry(() => ({ L: R.pick([0.5, 1, 1.25, 2, 2.5, 5]), k: R.int(2, 9) }), p => hasDec((p.k / p.L) * (p.k / p.L), 4) && !(p.L === 2 && p.k === 3), { L: 1.25, k: 3 }),
 build: ({ L, k }) => { const r = k / L, M = r * r, l1 = 1 / (L * L); return {
  prompt: `A bracing cable in the dome is pinned at x = 0 and at x = L metres, where L was never measured. Its shape y obeys y″ + λy = 0 with y(0) = 0 and y(L) = 0. The ${ord(k)} smallest positive λ that allows a solution other than y = 0 is ${piSq(M)}. Enter L in metres, then the smallest positive λ that allows such a solution, as a multiple of π² (for 5π² enter 5).`,
  answer: [L, l1],
  hints: ['The allowed values satisfy √λ L = jπ for j = 1, 2, 3, …, so √λ = jπ ÷ L. Use the one you are given to find L.',
   'The smallest allowed value is j = 1: λ = π² ÷ L², which is 1 ÷ L² as a multiple of π².'],
  solution: `The allowed values are λ = (jπ ÷ L)². For j = ${n(k)}, λ = ${piSq(M)}, so √λ = √${n(M)} × π = ${n(r)}π and ${n(k)}π ÷ L = ${n(r)}π. So L = ${n(k)} ÷ ${n(r)} = ${n(L)} ${L === 1 ? 'metre' : 'metres'}. The smallest allowed value is j = 1: λ = (π ÷ ${n(L)})² = ${piSq(l1)}, so enter ${n(l1)}.`,
  guidance: [
   { prompt: `λ = ${piSq(M)} means √λ = √${n(M)} × π. What is √λ ÷ π?`, answer: [r], explanation: `√${n(M)} = ${n(r)}, so √λ ÷ π = ${n(r)}.` },
   { prompt: `For the ${ord(k)} allowed value, √λ L = ${n(k)}π, so ${n(k)} ÷ L is the number you just found. What is L in metres?`, answer: [L], explanation: `L = ${n(k)} ÷ ${n(r)} = ${n(L)} ${L === 1 ? 'metre' : 'metres'}.` },
   { prompt: `The smallest allowed value has √λ = π ÷ ${n(L)}. What is λ ÷ π² for it?`, answer: [l1], explanation: `(1 ÷ ${n(L)})² = ${n(l1)}, so λ = ${piSq(l1)}.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', title: 'A cable pinned along the middle of the wall',
 brief: 'A seed cable is pinned at two posts that are not at the origin, and the crew wants one allowed setting and whether an end-value problem can be solved.',
 labels: ['λ ÷ π²', 'one solution (1/0)'], tolerance: 0.005,
 gl: [['√λ ÷ π'], ['λ ÷ π²'], ['one solution (1/0)']]
}, {
 /* Pins at x = a0 and x = a0 + L: y(a0) = 0 leaves y = C sin(√λ (x − a0)), and y(a0 + L) = 0 needs √λ L = jπ, so the kth λ is (k ÷ L)² π².
    Second part: λ = μπ² with y(a0 + L) = B: μ = m² ÷ L² (an allowed value: none, code 0) or μ = m ÷ L² with m not a square (one solution, code 1). L has 1 ÷ L² with at most 4 decimals. */
 canonical: { a0: 2, L: 2.5, k: 4, B: 5, eig: 1, m: 3 },
 draw: R => { const eig = R.int(0, 1); return { a0: R.int(1, 4), L: R.pick([0.5, 2, 2.5, 5]), k: R.int(2, 6), B: R.int(2, 9), eig, m: eig ? R.int(1, 6) : R.pick([2, 3, 5, 6, 7, 8]) }; },
 build: ({ a0, L, k, B, eig, m }) => { const b0 = a0 + L, lk = k * k / (L * L), mu = eig ? m * m / (L * L) : m / (L * L), code = eig ? 0 : 1, rootMu = eig ? m : Math.sqrt(m); return {
  prompt: `A seed cable in the dome is pinned at two posts, x = ${n(a0)} and x = ${n(b0)} metres. Its shape y obeys y″ + λy = 0 with y(${n(a0)}) = 0 and y(${n(b0)}) = 0, an eigenvalue problem. Enter the ${ord(k)} smallest positive λ that allows a solution other than y = 0, as a multiple of π² (for 5π² enter 5). Then take the boundary value problem y″ + ${piSq(mu)}y = 0 with y(${n(a0)}) = 0 and y(${n(b0)}) = ${n(B)}: enter 1 if it has exactly one solution, 0 if it has none or many.`,
  answer: [lk, code],
  hints: ['For λ > 0 the solutions are y = A cos(√λ x) + C sin(√λ x). A solution that is 0 at the first post is C sin(√λ (x − first post)), so the condition at the other post needs sin(√λ × distance between the posts) = 0, which means √λ times that distance is a whole multiple of π.',
   'If √λ times the distance between the posts is a whole multiple of π, the sine is 0 at the far post and cannot reach a non-zero end value. Otherwise C is fixed by the end value, so there is exactly one solution.'],
  solution: `y(${n(a0)}) = 0 leaves y = C sin(√λ (x − ${n(a0)})). The distance between the posts is ${n(b0)} − ${n(a0)} = ${n(L)}, and a solution other than 0 needs sin(√λ × ${n(L)}) = 0, so √λ × ${n(L)} = jπ and λ = (jπ ÷ ${n(L)})². The ${ord(k)} is j = ${n(k)}: λ = ${n(k * k)} ÷ ${n(L * L)} × π² = ${piSq(lk)}, so enter ${n(lk)}. For λ = ${piSq(mu)}, √λ × ${n(L)} = ${eig ? `${rootMu === 1 ? '' : n(rootMu)}π, a whole multiple of π, so sin(√λ × ${n(L)}) = 0 and C sin(√λ (x − ${n(a0)})) is 0 at x = ${n(b0)} whatever C is: it cannot reach ${n(B)}, so there is no solution. Code 0.` : `√${n(m)} × π, not a whole multiple of π, so sin(√λ × ${n(L)}) is not 0 and C = ${n(B)} ÷ sin(√λ × ${n(L)}) is the only choice: exactly one solution. Code 1.`}`,
  guidance: [
   { prompt: `The posts are ${n(L)} metres apart, and the allowed values have √λ × ${n(L)} = jπ. For j = ${n(k)}, what is √λ ÷ π?`, answer: [k / L], explanation: `√λ = ${n(k)}π ÷ ${n(L)}, so √λ ÷ π = ${n(k / L)}.` },
   { prompt: `Square it: what is λ ÷ π² for the ${ord(k)} allowed value?`, answer: [lk], explanation: `${n(k / L)}² = ${n(lk)}, so λ = ${piSq(lk)}.` },
   { prompt: `For λ = ${piSq(mu)}, is √λ × ${n(L)} a whole multiple of π? Enter 1 if the problem with y(${n(b0)}) = ${n(B)} has exactly one solution, 0 if not.`, answer: [code], explanation: eig ? `√λ × ${n(L)} = ${rootMu === 1 ? '' : n(rootMu)}π, a whole multiple, so the sine vanishes at the far post and no solution reaches ${n(B)}: 0.` : `√λ × ${n(L)} = √${n(m)} × π, not a whole multiple, so exactly one C works: 1.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Waves [4.1, 8.3] ---- */

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The signal wire and the moth colony',
 brief: 'The observation deck has a signal wire that hums at certain notes, and the dome has moths and bats whose steady level the crew wants.',
 labels: ['ω (rad/s)', 'x (hundreds)'], tolerance: 0.005,
 gl: [['√λ ÷ π'], ['ω (rad/s)'], ['x (hundreds)']]
}, {
 /* String: allowed λ = (jπ ÷ L)², so the kth shape swings at ω = w·kπ ÷ L (the rule ω = w√λ is given). Dome: x′ = ax − bxy, y′ = −cy + dxy with b = a ÷ ys and
    d = c ÷ xs; the insect level is x = c ÷ d. k is 2 to 4 (the learn mission asks the lowest). */
 canonical: { L: 2, w: 60, k: 3, a: 1.2, ys: 6, c: 0.5, xs: 10 },
 draw: R => retry(() => ({ L: R.pick([0.5, 0.8, 1.25, 2, 2.5]), w: R.pick([40, 60, 75, 90, 120, 150]), k: R.int(2, 4), a: R.pick([0.5, 0.6, 0.8, 1.2, 1.5]), ys: R.pick([3, 4, 5, 6, 8, 10, 12]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1.2]), xs: R.pick([4, 5, 8, 10, 12, 16, 20]) }),
  p => hasDec(p.a / p.ys, 4) && hasDec(p.c / p.xs, 4) && p.a !== p.ys && p.c !== p.xs && !nearTie(p.w * p.k * Math.PI / p.L, 2), { L: 2, w: 60, k: 3, a: 1.2, ys: 6, c: 0.5, xs: 10 }),
 build: ({ L, w, k, a, ys, c, xs }) => { const r = k / L, om = w * r * Math.PI, b = a / ys, d = c / xs; return {
  prompt: `Two readings from the observation deck and the dome. A signal wire is ${n(L)} metres long and fixed at both ends; its shape X obeys X″ + λX = 0 with X(0) = 0 and X(${n(L)}) = 0. Such a wire swings with angular frequency ω = ${n(w)}√λ rad/s, where ${n(w)} m/s is its wave speed (a rule from the physics of waves, not derived here; take it as given). Enter the angular frequency of its ${ord(k)} lowest allowed shape, in rad/s to 2 decimal places (type a number of 1000 or more without commas). Then the dome’s moths x (hundreds) and the bats that eat them y (tens) follow x′ = ${cy(a, 'x')} − ${n(b)}xy and y′ = −${cy(c, 'y')} + ${n(d)}xy: enter x, in hundreds, at the coexistence point.`,
  answer: [r2(om), xs],
  hints: ['The allowed λ of the wire are (jπ ÷ L)² for j = 1, 2, 3, …; take the j that matches the shape asked for, and multiply √λ by the wave speed.',
   'At the coexistence point both populations are non-zero, so the bracket of y′ = y(−c + dx) must be 0.'],
  solution: `The allowed λ are (jπ ÷ ${n(L)})², and the ${ord(k)} lowest has j = ${n(k)}, so √λ = ${n(k)}π ÷ ${n(L)} = ${n(r)}π and ω = ${n(w)} × ${n(r)}π = ${n(w * r)}π ≈ ${fx(om, 4)}, which is ${fx(r2(om), 2)} rad/s to 2 decimal places. In the dome, y′ = y(−${n(c)} + ${n(d)}x) is 0 with y non-zero when x = ${n(c)} ÷ ${n(d)} = ${n(xs)}; the bats sit at y = ${n(a)} ÷ ${n(b)} = ${n(ys)}.`,
  guidance: [
   { prompt: `The ${ord(k)} lowest allowed λ is (${n(k)}π ÷ ${n(L)})². What is √λ ÷ π?`, answer: [r], explanation: `√λ = ${n(k)}π ÷ ${n(L)} = ${n(r)}π.` },
   { prompt: `ω = ${n(w)}√λ = ${n(w)} × ${n(r)}π. What is ω in rad/s, to 2 decimal places?`, answer: [r2(om)], explanation: `${n(w * r)}π ≈ ${fx(om, 4)}, which is ${fx(r2(om), 2)} to 2 decimal places.` },
   { prompt: `y′ = y(−${n(c)} + ${n(d)}x). With y non-zero, what x makes it 0?`, answer: [xs], explanation: `${n(d)}x = ${n(c)}, so x = ${n(xs)}.` }
  ] }; }
});

/* q40c parameters plus the numbers the prompt prints for the oracle: the target multiple T of π and the coefficient d of xy in y′. */
const shown40 = p => ({ ...p, T: Math.round(p.w / p.L), d: p.c / p.xs });
mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Cutting the new harp string',
 brief: 'The wind-harp needs a new string cut to sing one exact note, and the dome log needs the insect count at the steady level.',
 labels: ['L (metres)', 'insects'], tolerance: 0.005,
 gl: [['√λ ÷ π'], ['L (metres)'], ['insects']]
}, {
 /* String: fundamental ω = w·π ÷ L = m·π, so m = w ÷ L is a whole number (given) and L = w ÷ m; √λ ÷ π = m ÷ w = 1 ÷ L. Dome: x′ = ax − bxy, y′ = −cy + dxy with
    b = a ÷ ys and d = c ÷ xs; the insects at the balance are 100·xs. Not the q40 worked example. */
 canonical: shown40({ L: 2.5, w: 100, a: 1.2, ys: 6, c: 0.6, xs: 5 }),
 draw: R => shown40(retry(() => ({ L: R.pick([0.5, 0.8, 1.25, 2, 2.5, 4, 5]), w: R.pick([40, 50, 60, 80, 100, 120, 150]), a: R.pick([0.5, 0.6, 0.8, 1, 1.2, 1.5]), ys: R.pick([3, 4, 5, 6, 8, 10, 12]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1.2]), xs: R.pick([4, 5, 8, 10, 12, 16, 20]) }),
  p => isInt(p.w / p.L) && p.w / p.L <= 400 && hasDec(p.a / p.ys, 4) && hasDec(p.c / p.xs, 4) && p.a !== p.ys && p.c !== p.xs && !(p.L === 1.25 && p.w === 90), { L: 2.5, w: 100, a: 1.2, ys: 6, c: 0.6, xs: 5 })),
 build: ({ L, w, a, ys, c, xs }) => { const m = Math.round(w / L), inv = 1 / L, b = a / ys, d = c / xs; return {
  prompt: `The dome’s wind-harp needs a new string, fixed at both ends, whose length L has to be chosen. Its shape X obeys X″ + λX = 0 with X(0) = 0 and X(L) = 0, and it swings with angular frequency ω = ${n(w)}√λ rad/s, where ${n(w)} m/s is its wave speed (a rule from the physics of waves, not derived here; take it as given). The string must have a fundamental frequency, its lowest allowed angular frequency, of exactly ${n(m)}π rad/s. Enter the length L in metres. Then the dome’s insects x (hundreds) and birds y (tens) follow x′ = ${cy(a, 'x')} − ${n(b)}xy and y′ = −${cy(c, 'y')} + ${n(d)}xy: enter the number of insects at the coexistence point (a count, not hundreds; type a number of 1000 or more without commas).`,
  answer: [L, xs * 100],
  hints: ['The lowest allowed λ is (π ÷ L)², so √λ = π ÷ L and the fundamental is ω = (wave speed) × π ÷ L. Set that equal to the target and solve for L.',
   'At the coexistence point both populations are non-zero, so the bracket of y′ = y(−c + dx) must be 0. The answer there is in hundreds: multiply by 100 for the count.'],
  solution: `The lowest allowed λ is (π ÷ L)², so ω = ${n(w)} × π ÷ L. Setting ${n(w)}π ÷ L = ${n(m)}π gives L = ${n(w)} ÷ ${n(m)} = ${n(L)} metres. In the dome, y′ = y(−${n(c)} + ${n(d)}x) is 0 with y non-zero when x = ${n(c)} ÷ ${n(d)} = ${n(xs)} hundreds, which is ${n(xs * 100)} insects.`,
  guidance: [
   { prompt: `ω = ${n(w)}√λ = ${n(m)}π, so √λ = ${n(m)}π ÷ ${n(w)}. What is √λ ÷ π?`, answer: [inv], explanation: `√λ ÷ π = ${n(m)} ÷ ${n(w)} = ${n(inv)}.` },
   { prompt: `The lowest allowed λ has √λ = π ÷ L. If √λ ÷ π = ${n(inv)}, what is L in metres?`, answer: [L], explanation: `1 ÷ L = ${n(inv)}, so L = 1 ÷ ${n(inv)} = ${n(L)} metres.` },
   { prompt: `y′ = y(−${n(c)} + ${n(d)}x). With y non-zero, what x makes it 0? Then multiply by 100 for the number of insects.`, answer: [xs * 100], explanation: `${n(d)}x = ${n(c)}, so x = ${n(xs)} hundreds, which is ${n(xs * 100)} insects.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q38', title: 'Notes on the string and netting in the dome',
 brief: 'The harp string has a limit on the notes it may sing, and the dome’s crew nets insects, so Mira wants the string’s notes and the bird level.',
 labels: ['ω (rad/s)', 'allowed ω below the limit', 'y (tens)'], tolerance: 0.005,
 gl: [['ω (rad/s)'], ['allowed ω below the limit'], ['y (tens)']]
}, {
 /* String: ω_j = j·ω1 with ω1 = w·π ÷ L; the count of j with j·ω1 < Om is floor(Om ÷ ω1), never within 0.1 of a whole number. Dome with netting:
    x′ = a x − b x y − h x, y′ = −c y + d x y with a = A + h, b = A ÷ ys, d = c ÷ xs, so the bird level is y = (a − h) ÷ b = ys. */
 canonical: { L: 2.5, w: 100, Om: 1400, A: 0.8, h: 0.2, c: 0.5, ys: 5, xs: 10 },
 draw: R => retry(() => ({ L: R.pick([0.5, 0.8, 1.25, 2, 2.5]), w: R.pick([40, 60, 75, 90, 100, 120, 150]), Om: R.pick([300, 500, 800, 1000, 1400, 2000]), A: R.pick([0.4, 0.5, 0.6, 0.8, 1, 1.2]), h: R.pick([0.1, 0.2, 0.3, 0.4]), c: R.pick([0.4, 0.5, 0.6, 0.8, 1.2]), ys: R.pick([3, 4, 5, 6, 8, 10]), xs: R.pick([4, 5, 8, 10, 12, 16, 20]) }),
  p => { const o1 = p.w * Math.PI / p.L, q = p.Om / o1, fr = q - Math.floor(q); return hasDec(p.A / p.ys, 4) && hasDec(p.c / p.xs, 4) && p.A !== p.ys && p.c !== p.xs && !nearTie(o1, 2) && q >= 2 && q <= 14 && fr > 0.1 && fr < 0.9; },
  { L: 2.5, w: 100, Om: 1400, A: 0.8, h: 0.2, c: 0.5, ys: 5, xs: 10 }),
 build: ({ L, w, Om, A, h, c, ys, xs }) => { const o1 = w * Math.PI / L, cnt = Math.floor(Om / o1), a = Math.round((A + h) * 1e4) / 1e4, b = A / ys, d = c / xs; return {
  prompt: `A wind-harp string in the dome is ${n(L)} metres long and fixed at both ends; its shape X obeys X″ + λX = 0 with X(0) = 0 and X(${n(L)}) = 0, and it swings with angular frequency ω = ${n(w)}√λ rad/s, where ${n(w)} m/s is its wave speed (a rule from the physics of waves, not derived here; take it as given). Enter its fundamental frequency, the lowest allowed angular frequency, in rad/s to 2 decimal places (type a number of 1000 or more without commas), then how many of its allowed angular frequencies are below ${n(Om)} rad/s. Then, in the dome, a crew nets insects every month, and the insects x (hundreds) and birds y (tens) follow x′ = ${cy(a, 'x')} − ${n(b)}xy − ${cy(h, 'x')} and y′ = −${cy(c, 'y')} + ${n(d)}xy, where the last term of the first equation is the netting: enter y at the coexistence point.`,
  answer: [r2(o1), cnt, ys],
  hints: ['The allowed λ are (jπ ÷ L)² for j = 1, 2, 3, …, so the allowed ω are j times the fundamental. Count the whole numbers j for which j × (fundamental) is below the limit.',
   'Collect the two terms in x only in the first equation: x′ = x(A − by), where A is the growth rate minus the netting rate. With x non-zero, the bracket is 0 at the coexistence point.'],
  solution: `The lowest allowed λ is (π ÷ ${n(L)})², so ω = ${n(w)} × π ÷ ${n(L)} ≈ ${fx(o1, 4)}, which is ${fx(r2(o1), 2)} rad/s to 2 decimal places. The allowed values are j × ${fx(o1, 4)}, and ${n(Om)} ÷ ${fx(o1, 4)} ≈ ${fx(Om / o1, 2)}, so j = 1 up to ${n(cnt)}: ${n(cnt)} allowed values are below ${n(Om)} rad/s. In the dome, collecting the insect terms gives x′ = x(${n(a)} − ${n(h)} − ${n(b)}y) = x(${n(A)} − ${n(b)}y), which is 0 with x non-zero for y = ${n(A)} ÷ ${n(b)} = ${n(ys)}.`,
  guidance: [
   { prompt: `The lowest allowed λ is (π ÷ ${n(L)})², so ω = ${n(w)} × π ÷ ${n(L)}. What is ω in rad/s, to 2 decimal places?`, answer: [r2(o1)], explanation: `${n(w)} × π ÷ ${n(L)} ≈ ${fx(o1, 4)}, which is ${fx(r2(o1), 2)} to 2 decimal places.` },
   { prompt: `The allowed values are j × ${fx(o1, 4)} rad/s for j = 1, 2, 3, …. How many are below ${n(Om)} rad/s?`, answer: [cnt], explanation: `${n(Om)} ÷ ${fx(o1, 4)} ≈ ${fx(Om / o1, 2)}, so j = 1 up to ${n(cnt)}: ${n(cnt)} values.` },
   { prompt: `Collect the insect terms: x′ = x(${n(A)} − ${n(b)}y). With x non-zero, what y makes the bracket 0?`, answer: [ys], explanation: `${n(a)} − ${n(h)} = ${n(A)}, and ${n(b)}y = ${n(A)} gives y = ${n(A)} ÷ ${n(b)} = ${n(ys)}.` }
  ] }; }
});

})();
