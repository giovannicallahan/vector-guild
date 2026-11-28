/* Complex analysis: the plane of numbers practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p4.js. */
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
/* Terms of a polynomial in x and y: T([[3, 'x²'], [-1, 'xy'], [5, '']]) is '3x² − xy + 5'. A coefficient 1 is not written out and a
   zero term is left out. A variable text such as 'kx²' is written after its coefficient. */
const T = list => { let out = '';
 list.forEach(([c, v]) => { if (!c) return; const a = Math.abs(c), body = v === '' ? n(a) : (a === 1 ? '' : n(a)) + v;
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* Sign and size for a sum written out: sg(−6) is '− 6', sg(4) is '+ 4'. */
const sg = x => (x < 0 ? '− ' : '+ ') + n(Math.abs(x));
const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(ch => SUPS[ch]).join('');
/* Complex numbers as [re, im] pairs. */
const cz = (a, b) => { if (!b) return n(a); const im = Math.abs(b) === 1 ? 'i' : n(Math.abs(b)) + 'i';
 if (!a) return (b < 0 ? '−' : '') + im; return n(a) + (b < 0 ? ' − ' : ' + ') + im; };
const C = x => cz(x[0], x[1]);
const cm = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
const ca = (x, y) => [x[0] + y[0], x[1] + y[1]], cs = (x, y) => [x[0] - y[0], x[1] - y[1]], cj = x => [x[0], -x[1]];
const cp = (x, k) => { let r = [1, 0]; for (let i = 0; i < k; i++) r = cm(r, x); return r; };
const cq = x => x[0] * x[0] + x[1] * x[1];
/* Bounded retry: at most 1000 tries of f(), then the canonical parameters. */
const tries = (f, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = f(); if (ok(p)) return p; } return canon; };

/* ---- q16 Harmonic functions [6.2] ---- */

mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The cooling plate',
 brief: 'A cooling plate in the tank wall settles to a steady temperature, and the crew must check which of two models can describe it.',
 labels: ['m', 'Laplacian of S'], tolerance: 0.01, gl: [['∂²T/∂x²'], ['m'], ['Laplacian of S']]
}, {
 /* T = px² + bxy + my² + dx (so m = −p) and S = sx³ + tx²y + wy³ at (x0, y0). The Laplacian of S at the point is never 0. */
 canonical: { p: 4, b: -2, d: 5, s: 2, t: -3, w: 1, x0: -2, y0: 3 },
 draw: R => tries(() => ({ p: R.nz(-5, 5), b: R.nz(-5, 5), d: R.nz(-5, 5), s: R.nz(-3, 3), t: R.nz(-4, 4), w: R.nz(-3, 3), x0: R.int(-3, 3), y0: R.nz(-3, 3) }),
  q => 6 * q.s * q.x0 + 2 * q.t * q.y0 + 6 * q.w * q.y0 !== 0, { p: 4, b: -2, d: 5, s: 2, t: -3, w: 1, x0: -2, y0: 3 }),
 build: ({ p, b, d, s, t, w, x0, y0 }) => { const m = -p, A = 6 * s * x0 + 2 * t * y0, B = 6 * w * y0, L = A + B, pt = `(${n(x0)}, ${n(y0)})`; return {
  prompt: `A cooling plate in the tank wall holds a steady temperature, so its temperature model must be harmonic. Model 1 is T(x, y) = ${T([[p, 'x²'], [b, 'xy'], [1, 'my²'], [d, 'x']])}, where m is a constant. Model 2 is S(x, y) = ${T([[s, 'x³'], [t, 'x²y'], [w, 'y³']])}. Enter the value of m that makes T harmonic, then the Laplacian ∂²S/∂x² + ∂²S/∂y² of S at the point ${pt}.`,
  answer: [m, L],
  hints: ['A function is harmonic when its Laplacian ∂²T/∂x² + ∂²T/∂y² is 0 at every point. Differentiate each term twice in x, then twice in y, holding the other variable fixed: a term in xy or in x alone gives 0 both times.',
   'For the value at a point, first write the Laplacian as a formula in x and y, then put the point in. For a term like x²y, the second x-derivative is 2y and the second y-derivative is 0.'],
  solution: `For T: ∂²T/∂x² = ${n(2 * p)} and ∂²T/∂y² = 2m; the xy and x terms give 0. Laplace’s equation ${n(2 * p)} + 2m = 0 gives m = ${n(m)}. For S: ∂²S/∂x² = ${T([[6 * s, 'x'], [2 * t, 'y']])} and ∂²S/∂y² = ${T([[6 * w, 'y']])}. At ${pt} these are ${n(A)} and ${n(B)}, so the Laplacian is ${n(A)} ${B < 0 ? '−' : '+'} ${n(Math.abs(B))} = ${n(L)}. It is not 0 at this point, so S is not harmonic.`,
  guidance: [
   { prompt: `Differentiate T twice with respect to x, holding y fixed. What is ∂²T/∂x²?`, answer: [2 * p], explanation: `Only the x² term survives two differentiations in x: ${T([[p, 'x²']])} gives ${T([[2 * p, 'x']])} and then ${n(2 * p)}.` },
   { prompt: `∂²T/∂y² = 2m. What value of m makes the Laplacian of T equal to 0?`, answer: [m], explanation: `${n(2 * p)} + 2m = 0 gives m = ${n(m)}, at every point at once.` },
   { prompt: `∂²S/∂x² = ${T([[6 * s, 'x'], [2 * t, 'y']])} and ∂²S/∂y² = ${T([[6 * w, 'y']])}. Put in the point ${pt} and add: what is the Laplacian of S there?`, answer: [L], explanation: `∂²S/∂x² = ${n(A)} and ∂²S/∂y² = ${n(B)}, and their sum is ${n(L)}.` }
  ] }; }
});

mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Retuning the pressure plate',
 brief: 'A pressure plate reads a Laplacian that is not zero, so the crew must retune it and then size a matching second plate.',
 labels: ['a', 'new y² number c′', 'Laplacian of W'], tolerance: 0.01, gl: [['a'], ['c′'], ['Laplacian of W']]
}, {
 /* P = ax² + bxy + cy² + ey with a gauge reading L = 2a + 2c; harmonic needs c′ = −a. W = ax³ + tx²y + c′y³. a ≠ 0, a ≠ −c, and the answer is not 0. */
 canonical: { a: 3, b: 4, c: 1, e: -2, t: 2, x0: 2, y0: -1 },
 draw: R => tries(() => ({ a: R.nz(-4, 4), b: R.nz(-5, 5), c: R.nz(-4, 4), e: R.nz(-4, 4), t: R.nz(-4, 4), x0: R.int(-3, 3), y0: R.nz(-3, 3) }),
  q => q.a + q.c !== 0 && 6 * q.a * q.x0 + 2 * q.t * q.y0 - 6 * q.a * q.y0 !== 0, { a: 3, b: 4, c: 1, e: -2, t: 2, x0: 2, y0: -1 }),
 build: ({ a, b, c, e, t, x0, y0 }) => { const L = 2 * a + 2 * c, cn = -a, R2 = 6 * a * x0 + 2 * t * y0 + 6 * cn * y0, pt = `(${n(x0)}, ${n(y0)})`; return {
  prompt: `A pressure plate in the flow tank has the model P(x, y) = ${T([[1, 'ax²'], [b, 'xy'], [c, 'y²'], [e, 'y']])}, where a is a constant. A gauge shows that the Laplacian of P is ${n(L)} at every point. The crew then change only the number in front of y² to a new value c′, keeping the same a, so that P becomes harmonic. A second plate has the model W(x, y) = ${T([[1, 'ax³'], [t, 'x²y'], [1, 'c′y³']])}, using that same a and that same c′. Enter a, then c′, then the Laplacian of W at the point ${pt}.`,
  answer: [a, cn, R2],
  hints: ['The Laplacian of P is ∂²P/∂x² + ∂²P/∂y². A term in xy or in y alone gives 0 both times, so only the x² and y² terms count. Compare the sum with the gauge reading to find a.',
   'P is harmonic when its Laplacian is 0 at every point: put the new number c′ in place of the old one and solve. For W, write the Laplacian as a formula in x and y first, then put the point in.'],
  solution: `For P: ∂²P/∂x² = 2a and ∂²P/∂y² = ${n(2 * c)}; the xy and y terms give 0. The gauge reads ${n(L)}, so 2a ${sg(2 * c)} = ${n(L)} and a = ${n(a)}. With c′ in place of ${n(c)}, harmonic means 2a + 2c′ = 0, so c′ = ${n(cn)}. For W with a = ${n(a)} and c′ = ${n(cn)}: ∂²W/∂x² = ${T([[6 * a, 'x'], [2 * t, 'y']])} and ∂²W/∂y² = ${T([[6 * cn, 'y']])}. At ${pt} the Laplacian is ${n(6 * a * x0 + 2 * t * y0)} ${6 * cn * y0 < 0 ? '−' : '+'} ${n(Math.abs(6 * cn * y0))} = ${n(R2)}.`,
  guidance: [
   { prompt: `∂²P/∂x² = 2a and ∂²P/∂y² = ${n(2 * c)}. The gauge reads ${n(L)}. What is a?`, answer: [a], explanation: `2a ${sg(2 * c)} = ${n(L)}, so 2a = ${n(2 * a)} and a = ${n(a)}.` },
   { prompt: `With a = ${n(a)}, the new Laplacian of P is 2a + 2c′. What c′ makes it 0?`, answer: [cn], explanation: `${n(2 * a)} + 2c′ = 0 gives c′ = ${n(cn)}.` },
   { prompt: `For W, ∂²W/∂x² = ${T([[1, '6ax'], [2 * t, 'y']])} and ∂²W/∂y² = 6c′y. Put in a, c′ and the point ${pt}: what is the Laplacian of W?`, answer: [R2], explanation: `∂²W/∂x² = ${n(6 * a * x0 + 2 * t * y0)} and ∂²W/∂y² = ${n(6 * cn * y0)}, which add to ${n(R2)}.` }
  ] }; }
});

mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q13', title: 'A cubic pressure wall',
 brief: 'The tank wall is modelled by a cubic with two unknown numbers, and the crew needs them and the flow derivative at one sensor.',
 labels: ['r', 'q', 'Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.01, gl: [['r'], ['q'], ['Re f′(z₀)'], ['Im f′(z₀)']]
}, {
 /* u = Px³ + qx²y + rxy² + Sy³: harmonic needs r = −3P and q = −3S. Then Re f′ = ∂u/∂x and Im f′ = ∂v/∂x = −∂u/∂y. */
 canonical: { P: 2, S: -1, x0: 1, y0: 2 },
 draw: R => tries(() => ({ P: R.nz(-3, 3), S: R.nz(-3, 3), x0: R.int(-3, 3), y0: R.int(-3, 3) }), q => q.x0 !== 0 || q.y0 !== 0, { P: 2, S: -1, x0: 1, y0: 2 }),
 build: ({ P, S, x0, y0 }) => { const r = -3 * P, q = -3 * S, ux = 3 * P * x0 * x0 + 2 * q * x0 * y0 + r * y0 * y0, uy = q * x0 * x0 + 2 * r * x0 * y0 + 3 * S * y0 * y0, z0 = C([x0, y0]); return {
  prompt: `The tank wall’s pressure model is the cubic u(x, y) = ${T([[P, 'x³'], [1, 'qx²y'], [1, 'rxy²'], [S, 'y³']])}, where q and r are constants, and u must be harmonic. Suppose u is also the real part of an analytic function f = u + iv. For such an f, f′ = ∂u/∂x + i ∂v/∂x, and the second Cauchy–Riemann equation says ∂v/∂x = −∂u/∂y. Enter r, then q, then the real part and the imaginary part of f′(z₀) at z₀ = ${z0}.`,
  answer: [r, q, ux, -uy],
  hints: ['The Laplacian of this cubic has the form (something)x + (something)y. It must be 0 at every point, so each of the two “somethings” must be 0 on its own: that gives one equation for r and one for q.',
   'With q and r found, differentiate u once in x and once in y as formulas, put in x and y from z₀ = x + iy, and use ∂v/∂x = −∂u/∂y for the imaginary part.'],
  solution: `∂²u/∂x² = ${T([[6 * P, 'x'], [2, 'qy']])} and ∂²u/∂y² = ${T([[2, 'rx'], [6 * S, 'y']])}. The Laplacian is (${n(6 * P)} + 2r)x + (2q ${sg(6 * S)})y. Both brackets must be 0: r = ${n(r)} and q = ${n(q)}. Then ∂u/∂x = ${T([[3 * P, 'x²'], [2 * q, 'xy'], [r, 'y²']])} and ∂u/∂y = ${T([[q, 'x²'], [2 * r, 'xy'], [3 * S, 'y²']])}. At x = ${n(x0)}, y = ${n(y0)}: ∂u/∂x = ${n(ux)} and ∂u/∂y = ${n(uy)}, so Re f′(z₀) = ${n(ux)} and Im f′(z₀) = −∂u/∂y = ${n(-uy)}.`,
  guidance: [
   { prompt: `The x terms of the Laplacian are (${n(6 * P)} + 2r)x. What r makes them vanish?`, answer: [r], explanation: `${n(6 * P)} + 2r = 0 gives r = ${n(r)}.` },
   { prompt: `The y terms of the Laplacian are (2q ${sg(6 * S)})y. What q makes them vanish?`, answer: [q], explanation: `2q ${sg(6 * S)} = 0 gives q = ${n(q)}.` },
   { prompt: `With q = ${n(q)} and r = ${n(r)}, ∂u/∂x = ${T([[3 * P, 'x²'], [2 * q, 'xy'], [r, 'y²']])}. What is it at x = ${n(x0)}, y = ${n(y0)}? That is Re f′(z₀).`, answer: [ux], explanation: `Putting the point in gives ${n(ux)}.` },
   { prompt: `∂u/∂y = ${T([[q, 'x²'], [2 * r, 'xy'], [3 * S, 'y²']])}, and Im f′(z₀) = ∂v/∂x = −∂u/∂y. What is Im f′(z₀) at the same point?`, answer: [-uy], explanation: `∂u/∂y = ${n(uy)} at the point, so Im f′(z₀) = ${n(-uy)}.` }
  ] }; }
});

/* ---- q17 Chapter review: the flow tank [2.6, 6.2] ---- */

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The cooling channel',
 brief: 'Heat moves through a cooling channel as a flow with two unknown constants, and the crew needs them fixed and the flow rate read at one point.',
 labels: ['k', 'm', 'Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.01, gl: [['k'], ['m'], ['Re f′(z₀)'], ['Im f′(z₀)']]
}, {
 /* u = kx² + cy² + ex, v = mxy + ey: harmonic gives k = −c; CR gives m = 2k (and the second equation then agrees). */
 canonical: { c: 3, e: 4, x0: 2, y0: -1 },
 draw: R => tries(() => ({ c: R.nz(-4, 4), e: R.nz(-5, 5), x0: R.int(-3, 3), y0: R.int(-3, 3) }), q => q.x0 !== 0 || q.y0 !== 0, { c: 3, e: 4, x0: 2, y0: -1 }),
 build: ({ c, e, x0, y0 }) => { const k = -c, m = 2 * k, re = 2 * k * x0 + e, im = m * y0, z0 = C([x0, y0]); return {
  prompt: `Heat in the cooling channel is modelled by f = u + iv with u(x, y) = ${T([[1, 'kx²'], [c, 'y²'], [e, 'x']])} and v(x, y) = ${T([[1, 'mxy'], [e, 'y']])}, where k and m are constants. Enter the k that makes u harmonic, then the m that makes u and v satisfy the Cauchy–Riemann equations, then the real part and the imaginary part of f′(z₀) at z₀ = ${z0}.`,
  answer: [k, m, re, im],
  hints: ['u is harmonic when ∂²u/∂x² + ∂²u/∂y² = 0 at every point. u and v satisfy the Cauchy–Riemann equations when ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x at every point.',
   'Fix k first, because ∂u/∂x depends on it. When f = u + iv is analytic, f′ = ∂u/∂x + i ∂v/∂x: write both as formulas, then put in the x and y of z₀.'],
  solution: `∂²u/∂x² = 2k and ∂²u/∂y² = ${n(2 * c)}, so u is harmonic when 2k ${sg(2 * c)} = 0: k = ${n(k)}. Then ∂u/∂x = ${T([[2 * k, 'x'], [e, '']])} and ∂v/∂y = ${T([[1, 'mx'], [e, '']])}, so m = ${n(m)}; the second equation, ∂u/∂y = ${T([[2 * c, 'y']])} and −∂v/∂x = ${T([[-m, 'y']])}, agrees. At z₀ = ${z0}, x = ${n(x0)} and y = ${n(y0)}: ∂u/∂x = ${n(2 * k)} × ${par(x0)} ${sg(e)} = ${n(re)} and ∂v/∂x = ${n(m)} × ${par(y0)} = ${n(im)}. So f′(z₀) = ${C([re, im])}.`,
  guidance: [
   { prompt: `∂²u/∂x² = 2k and ∂²u/∂y² = ${n(2 * c)}. What k makes u harmonic?`, answer: [k], explanation: `2k ${sg(2 * c)} = 0 gives k = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, ∂u/∂x = ${T([[2 * k, 'x'], [e, '']])} and ∂v/∂y = ${T([[1, 'mx'], [e, '']])}. What m makes them equal?`, answer: [m], explanation: `Matching the x terms gives m = ${n(m)}. Then ∂u/∂y = ${T([[2 * c, 'y']])} and −∂v/∂x = ${T([[-m, 'y']])} agree as well.` },
   { prompt: `f′ = ∂u/∂x + i ∂v/∂x. What is ∂u/∂x at x = ${n(x0)}, y = ${n(y0)}?`, answer: [re], explanation: `${n(2 * k)} × ${par(x0)} ${sg(e)} = ${n(re)}. That is the real part of f′(z₀).` },
   { prompt: `∂v/∂x = ${T([[m, 'y']])}. What is it at that point?`, answer: [im], explanation: `${n(m)} × ${par(y0)} = ${n(im)}. That is the imaginary part of f′(z₀).` }
  ] }; }
});


mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'Dye test at the fin',
 brief: 'A dye test follows the flow past a fin, and the crew needs the flow speed at the sensor once the model’s two constants are fixed.',
 labels: ['k', 'm', '|f′(z₀)|²'], tolerance: 0.01, gl: [['k'], ['m'], ['|f′(z₀)|²']]
}, {
 /* u = px³ + kxy² + ey, v = mx²y − py³ − ex: k = −3p, m = 3p. f′ = (3px² + ky²) + i(2mxy − e). Never the p = 2, e = 3 of the lesson's mission. */
 canonical: { p: 3, e: -4, x0: 1, y0: 2 },
 draw: R => tries(() => ({ p: R.nz(-3, 3), e: R.nz(-5, 5), x0: R.int(-2, 2), y0: R.int(-2, 2) }), q => (q.x0 !== 0 || q.y0 !== 0) && !(q.p === 2 && q.e === 3), { p: 3, e: -4, x0: 1, y0: 2 }),
 build: ({ p, e, x0, y0 }) => { const k = -3 * p, m = 3 * p, re = 3 * p * x0 * x0 + k * y0 * y0, im = 2 * m * x0 * y0 - e, sp = re * re + im * im, z0 = C([x0, y0]); return {
  prompt: `A dye test in the flow tank follows the flow f = u + iv past a fin, with u(x, y) = ${T([[p, 'x³'], [1, 'kxy²'], [e, 'y']])} and v(x, y) = ${T([[1, 'mx²y'], [-p, 'y³'], [-e, 'x']])}, where k and m are constants. Enter the k that makes u harmonic, then the m that makes u and v satisfy the Cauchy–Riemann equations. The flow speed is |f′(z₀)|, where f′ = ∂u/∂x + i ∂v/∂x. Then enter the speed squared |f′(z₀)|² at the sensor z₀ = ${z0}: the real part of f′(z₀) squared plus the imaginary part of f′(z₀) squared (type it without commas).`,
  answer: [k, m, sp],
  hints: ['u is harmonic when ∂²u/∂x² + ∂²u/∂y² = 0 at every point. u and v satisfy the Cauchy–Riemann equations when ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x at every point.',
   'Fix k first, then m. Write ∂u/∂x and ∂v/∂x as formulas, put in the x and y of z₀ to get the two parts of f′(z₀), and only then square and add.'],
  solution: `∂²u/∂x² = ${n(6 * p)}x and ∂²u/∂y² = 2kx, so the Laplacian is (${n(6 * p)} + 2k)x, which is 0 at every point when k = ${n(k)}. Then ∂u/∂x = ${T([[3 * p, 'x²'], [k, 'y²']])} and ∂v/∂y = ${T([[1, 'mx²'], [-3 * p, 'y²']])}, so m = ${n(m)}. At z₀ = ${z0}, x = ${n(x0)} and y = ${n(y0)}: Re f′(z₀) = ∂u/∂x = ${n(re)} and Im f′(z₀) = ∂v/∂x = 2mxy ${sg(-e)} = ${n(im)}. The speed squared is ${par(re)}² + ${par(im)}² = ${n(re * re)} + ${n(im * im)} = ${n(sp)}.`,
  guidance: [
   { prompt: `∂²u/∂x² = ${n(6 * p)}x and ∂²u/∂y² = 2kx. What k makes the Laplacian of u zero at every point?`, answer: [k], explanation: `The sum is (${n(6 * p)} + 2k)x, which is 0 at every point only if k = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, ∂u/∂x = ${T([[3 * p, 'x²'], [k, 'y²']])} and ∂v/∂y = ${T([[1, 'mx²'], [-3 * p, 'y²']])}. What m makes them equal?`, answer: [m], explanation: `Matching the x² terms gives m = ${n(m)}. The y² terms already agree, and the second equation agrees too.` },
   { prompt: `Now ∂u/∂x = ${T([[3 * p, 'x²'], [k, 'y²']])} and ∂v/∂x = ${T([[2 * m, 'xy'], [-e, '']])}. At x = ${n(x0)}, y = ${n(y0)} these are the real and imaginary parts of f′(z₀). What is the speed squared?`, answer: [sp], explanation: `∂u/∂x = ${n(re)} and ∂v/∂x = ${n(im)}, so the speed squared is ${n(re * re)} + ${n(im * im)} = ${n(sp)}.` }
  ] }; }
});

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q14', title: 'A fin with a control surface',
 brief: 'A control surface multiplies the fin’s flow by a simple factor, and the crew needs the derivative of the product at one sensor.',
 labels: ['k', 'm', 'Re h′(z₀)', 'Im h′(z₀)'], tolerance: 0.01, gl: [['k'], ['m'], ['Re h′(z₀)'], ['Im h′(z₀)']]
}, {
 /* f = pz³ + gz²: u = px³ + kxy² + gx² − gy², v = mx²y − py³ + 2gxy, with k = −3p, m = 3p. h = f·(z − c0), so h′ = f′·(z₀ − c0) + f. */
 canonical: { p: 2, g: 3, c0: -1, x0: 1, y0: -1 },
 draw: R => tries(() => ({ p: R.nz(-3, 3), g: R.nz(-4, 4), c0: R.nz(-3, 3), x0: R.int(-2, 2), y0: R.int(-2, 2) }), q => q.x0 !== 0 || q.y0 !== 0, { p: 2, g: 3, c0: -1, x0: 1, y0: -1 }),
 build: ({ p, g, c0, x0, y0 }) => { const k = -3 * p, m = 3 * p, z = [x0, y0], z0 = C(z),
  fp = [3 * p * x0 * x0 + k * y0 * y0 + 2 * g * x0, 2 * m * x0 * y0 + 2 * g * y0],
  f = [p * x0 * x0 * x0 + k * x0 * y0 * y0 + g * x0 * x0 - g * y0 * y0, m * x0 * x0 * y0 - p * y0 * y0 * y0 + 2 * g * x0 * y0],
  w = [x0 - c0, y0], prod = cm(fp, w), h = ca(prod, f), fac = `(z ${c0 < 0 ? '+' : '−'} ${n(Math.abs(c0))})`; return {
  prompt: `The flow round a fin is f = u + iv with u(x, y) = ${T([[p, 'x³'], [1, 'kxy²'], [g, 'x²'], [-g, 'y²']])} and v(x, y) = ${T([[1, 'mx²y'], [-p, 'y³'], [2 * g, 'xy']])}, where k and m are constants that make u harmonic and make u and v satisfy the Cauchy–Riemann equations. A control surface multiplies the flow by a factor: h(z) = f(z)${fac}. Enter k, then m, then the real part and the imaginary part of h′(z₀) at z₀ = ${z0}. Use f′ = ∂u/∂x + i ∂v/∂x and the product rule.`,
  answer: [k, m, h[0], h[1]],
  hints: ['u is harmonic when ∂²u/∂x² + ∂²u/∂y² = 0 at every point; fix k with that. Then u and v satisfy the Cauchy–Riemann equations when ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x at every point; fix m with the first of them.',
   'The product rule (fg)′ = f′g + fg′ works for complex functions. Here g(z) = z minus a constant, so g′ = 1 and h′(z₀) = f′(z₀) × g(z₀) + f(z₀). Find f(z₀) = u + iv and f′(z₀) = ∂u/∂x + i ∂v/∂x at the point, and multiply the complex numbers with i² = −1.'],
  solution: `∂²u/∂x² = ${T([[6 * p, 'x'], [2 * g, '']])} and ∂²u/∂y² = ${T([[2, 'kx'], [-2 * g, '']])}, so the Laplacian is (${n(6 * p)} + 2k)x and k = ${n(k)}. Then ∂u/∂x = ${T([[3 * p, 'x²'], [k, 'y²'], [2 * g, 'x']])} and ∂v/∂y = ${T([[1, 'mx²'], [-3 * p, 'y²'], [2 * g, 'x']])}, so m = ${n(m)}. At z₀ = ${z0} (x = ${n(x0)}, y = ${n(y0)}): f′(z₀) = ∂u/∂x + i ∂v/∂x = ${C(fp)} and f(z₀) = u + iv = ${C(f)}. The factor is z₀ ${c0 < 0 ? '+' : '−'} ${n(Math.abs(c0))} = ${C(w)}. Then h′(z₀) = f′(z₀) × (${C(w)}) + f(z₀) = (${C(fp)}) × (${C(w)}) + (${C(f)}) = ${C(prod)} + (${C(f)}) = ${C(h)}.`,
  guidance: [
   { prompt: `∂²u/∂x² = ${T([[6 * p, 'x'], [2 * g, '']])} and ∂²u/∂y² = ${T([[2, 'kx'], [-2 * g, '']])}. What k makes u harmonic?`, answer: [k], explanation: `The sum is (${n(6 * p)} + 2k)x, which is 0 at every point only if k = ${n(k)}.` },
   { prompt: `With k = ${n(k)}, ∂u/∂x = ${T([[3 * p, 'x²'], [k, 'y²'], [2 * g, 'x']])} and ∂v/∂y = ${T([[1, 'mx²'], [-3 * p, 'y²'], [2 * g, 'x']])}. What m makes them equal?`, answer: [m], explanation: `Matching the x² terms gives m = ${n(m)}. The other terms already agree.` },
   { prompt: `At z₀ = ${z0}: f′(z₀) = ${C(fp)}, f(z₀) = ${C(f)} and z₀ ${c0 < 0 ? '+' : '−'} ${n(Math.abs(c0))} = ${C(w)}. By the product rule h′(z₀) = f′(z₀)(z₀ ${c0 < 0 ? '+' : '−'} ${n(Math.abs(c0))}) + f(z₀). What is its real part?`, answer: [h[0]], explanation: `(${C(fp)}) × (${C(w)}) = ${C(prod)}. Adding f(z₀) = ${C(f)} gives ${C(h)}, so the real part is ${n(h[0])}.` },
   { prompt: `What is the imaginary part of h′(z₀)?`, answer: [h[1]], explanation: `h′(z₀) = ${C(h)}, so its imaginary part is ${n(h[1])}.` }
  ] }; }
});

/* ---- q18 Contour integrals by parametrisation [4.2] ---- */

/* ∫ z dz and ∫ z̄ dz along the segment P to Q, from γ(t) = P + tD: PD + D²/2 and P̄D + |D|²/2. */
const cf = (p, t) => (p < 0 ? '− ' : '+ ') + (Math.abs(p) === 1 ? t : n(Math.abs(p)) + t);
/* A coefficient in front of a product: tm(1) is '', tm(−1) is '−', tm(5) is '5 × '. cb is the same for a coefficient written straight against a bracket. */
const tm = c => c === 1 ? '' : c === -1 ? '−' : n(c) + ' × ';
const cb = c => c === 1 ? '' : c === -1 ? '−' : n(c);
const intZ = (P, Q) => { const D = cs(Q, P), v = ca(cm(P, D), cm(D, D).map(x => x / 2)); return { D, v }; };
const intZbar = (P, Q) => { const D = cs(Q, P), v = ca(cm(cj(P), D), [cq(D) / 2, 0]); return { D, v }; };

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The feeder cable',
 brief: 'A feeder cable runs straight between two posts, and the power log needs the field added up along it as one complex number.',
 labels: ['real part', 'imaginary part'], tolerance: 0.01, gl: [['Re D'], ['Im D'], ['real part'], ['imaginary part']]
}, {
 /* ∫ z dz along A to B. Never the segment 0 to 2i of the lesson's example. A ≠ B. Answers can end in .5. */
 canonical: { ar: -1, ai: 3, br: 2, bi: 1 },
 draw: R => tries(() => ({ ar: R.int(-5, 5), ai: R.int(-5, 5), br: R.int(-5, 5), bi: R.int(-5, 5) }),
  q => (q.ar !== q.br || q.ai !== q.bi) && !(q.ar === 0 && q.ai === 0 && q.br === 0 && q.bi === 2), { ar: -1, ai: 3, br: 2, bi: 1 }),
 build: ({ ar, ai, br, bi }) => { const A = [ar, ai], B = [br, bi], { D, v } = intZ(A, B), AD = cm(A, D), DD = cm(D, D); return {
  prompt: `A feeder cable runs straight from the post at A = ${C(A)} to the post at B = ${C(B)}. Parametrise it as γ(t) = A + t(B − A) for t from 0 to 1. The field along it is z, so the power log adds up the contour integral ∫_γ z dz. Enter its real part, then its imaginary part. If a part ends in a half, type it as a decimal such as 2.5.`,
  answer: [v[0], v[1]],
  hints: ['On the segment, γ(t) = A + tD with D = B − A, so γ′(t) = D and ∫_γ f(z) dz = ∫ from 0 to 1 of f(γ(t)) × D dt.',
   'Here f(z) = z, so the integrand is (A + tD) × D = AD + t × D². A constant integrates to itself from 0 to 1, and t integrates to 1 ÷ 2. Multiply the complex numbers with i² = −1.'],
  solution: `D = B − A = ${C(D)}. Then z γ′(t) = (A + tD)D = AD + tD². AD = (${C(A)}) × (${C(D)}) = ${C(AD)} and D² = (${C(D)})² = ${C(DD)}. Integrating from 0 to 1 gives AD + D² ÷ 2 = (${C(AD)}) + (${C([DD[0] / 2, DD[1] / 2])}) = ${C(v)}.`,
  guidance: [
   { prompt: `What is the real part of D = B − A?`, answer: [D[0]], explanation: `${n(br)} − ${par(ar)} = ${n(D[0])}.` },
   { prompt: `What is the imaginary part of D?`, answer: [D[1]], explanation: `${n(bi)} − ${par(ai)} = ${n(D[1])}, so D = ${C(D)} and dz = D dt.` },
   { prompt: `What is the real part of ∫_γ z dz?`, answer: [v[0]], explanation: `AD = ${C(AD)} and D² ÷ 2 = ${C([DD[0] / 2, DD[1] / 2])}, so the integral is ${C(v)}.` },
   { prompt: `What is the imaginary part of ∫_γ z dz?`, answer: [v[1]], explanation: `The integral is ${C(v)}, so its imaginary part is ${n(v[1])}.` }
  ] }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'The crawler’s two legs',
 brief: 'An inspection crawler drives two straight legs of the ring road, and its meter keeps a running total of the field it meets.',
 labels: ['real part of the total', 'imaginary part of the total'], tolerance: 0.01, gl: [['real part of leg 1'], ['real part of the total'], ['imaginary part of the total']]
}, {
 /* A = x1 + y1 i, B = A + dx, C = B + dy·i, with dx and dy even so that the halves cancel: ∫ z̄ dz over each leg is P̄D + |D|²/2. */
 canonical: { x1: -2, y1: 3, dx: 4, dy: -2 },
 draw: R => ({ x1: R.int(-4, 4), y1: R.int(-4, 4), dx: R.pick([-4, -2, 2, 4]), dy: R.pick([-4, -2, 2, 4]) }),
 build: ({ x1, y1, dx, dy }) => { const A = [x1, y1], B = [x1 + dx, y1], Cc = [x1 + dx, y1 + dy], l1 = intZbar(A, B), l2 = intZbar(B, Cc), tot = ca(l1.v, l2.v); return {
  prompt: `An inspection crawler drives along the ring road straight from A = ${C(A)} to B = ${C(B)}, and then straight from B to C = ${C(Cc)}. The field it meets is z̄, and its meter adds up the contour integral ∫ z̄ dz along each leg and keeps the total of the two. For each leg, parametrise it as γ(t) = P + t(Q − P) for t from 0 to 1, where P is the start and Q the end of the leg. Enter the real part, then the imaginary part, of the meter’s total.`,
  answer: [tot[0], tot[1]],
  hints: ['A contour integral along a route made of two legs is the integral along the first leg plus the integral along the second. On each leg, γ(t) = P + tD with D = Q − P, so γ′(t) = D.',
   'The conjugate of γ(t) is P̄ + tD̄, so the integrand is P̄D + t × D̄D, and D̄D = |D|². A constant integrates to itself from 0 to 1, and t integrates to 1 ÷ 2. So each leg gives P̄D + |D|² ÷ 2.'],
  solution: `Leg 1: D = B − A = ${C(l1.D)}, Ā = ${C(cj(A))}, so P̄D = ${C(cm(cj(A), l1.D))} and |D|² = ${n(cq(l1.D))}; the leg gives ${C(cm(cj(A), l1.D))} + ${n(cq(l1.D) / 2)} = ${C(l1.v)}. Leg 2: D = C − B = ${C(l2.D)}, B̄ = ${C(cj(B))}, so P̄D = ${C(cm(cj(B), l2.D))} and |D|² = ${n(cq(l2.D))}; the leg gives ${C(cm(cj(B), l2.D))} + ${n(cq(l2.D) / 2)} = ${C(l2.v)}. The total is (${C(l1.v)}) + (${C(l2.v)}) = ${C(tot)}.`,
  guidance: [
   { prompt: `Leg 1 runs from A to B, so D = B − A = ${C(l1.D)} and its integral is ĀD + |D|² ÷ 2. What is the real part of the leg 1 integral?`, answer: [l1.v[0]], explanation: `ĀD = ${C(cm(cj(A), l1.D))} and |D|² ÷ 2 = ${n(cq(l1.D) / 2)}, so leg 1 gives ${C(l1.v)}.` },
   { prompt: `Leg 2 runs from B to C with D = ${C(l2.D)}, and its integral is ${C(l2.v)}. Adding the two legs, what is the real part of the total?`, answer: [tot[0]], explanation: `${n(l1.v[0])} ${sg(l2.v[0])} = ${n(tot[0])}.` },
   { prompt: `What is the imaginary part of the total?`, answer: [tot[1]], explanation: `The imaginary parts are ${n(l1.v[1])} for leg 1 and ${n(l2.v[1])} for leg 2, so the total is ${C(tot)} and its imaginary part is ${n(tot[1])}.` }
  ] }; }
});

mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q02', title: 'A mixed signal on the straight',
 brief: 'A control line carries a field made of z and z̄ together, and the survey team needs its total along one straight stretch.',
 labels: ['real part', 'imaginary part'], tolerance: 0.01, gl: [['real part of ∫ z dz'], ['real part of ∫ z̄ dz'], ['real part of the total'], ['imaginary part of the total']]
}, {
 /* f(z) = z + p z̄, so the integral is (AD + D²/2) + p(ĀD + |D|²/2). Answers can end in .5. */
 canonical: { ar: -3, ai: 1, br: 1, bi: 4, p: 2 },
 draw: R => tries(() => ({ ar: R.int(-4, 4), ai: R.int(-4, 4), br: R.int(-4, 4), bi: R.int(-4, 4), p: R.pick([-3, -2, 2, 3]) }), q => q.ar !== q.br || q.ai !== q.bi, { ar: -3, ai: 1, br: 1, bi: 4, p: 2 }),
 build: ({ ar, ai, br, bi, p }) => { const A = [ar, ai], B = [br, bi], z1 = intZ(A, B), z2 = intZbar(A, B), tot = [z1.v[0] + p * z2.v[0], z1.v[1] + p * z2.v[1]], pz = p < 0 ? `z − ${n(-p)}z̄` : `z + ${n(p)}z̄`; return {
  prompt: `A control line along a straight stretch of the ring road carries a mixed field f(z) = ${pz}, where z̄ is the conjugate of z. The stretch runs from A = ${C(A)} to B = ${C(B)}. Parametrise it as γ(t) = A + t(B − A) for t from 0 to 1. Enter the real part, then the imaginary part, of ∫_γ f(z) dz. If a part ends in a half, type it as a decimal such as 2.5.`,
  answer: [tot[0], tot[1]],
  hints: ['An integral of a sum is the sum of the integrals, and a constant factor comes outside: ∫_γ (z + p z̄) dz = ∫_γ z dz + p ∫_γ z̄ dz. On the segment, γ(t) = A + tD with D = B − A and γ′(t) = D.',
   'For z, the integrand is (A + tD)D = AD + tD², so the integral is AD + D² ÷ 2. For z̄ it is (Ā + tD̄)D = ĀD + t|D|², so the integral is ĀD + |D|² ÷ 2. Work the complex products with i² = −1.'],
  solution: `D = B − A = ${C(z1.D)}. For z: AD = ${C(cm(A, z1.D))} and D² = ${C(cm(z1.D, z1.D))}, so ∫_γ z dz = AD + D² ÷ 2 = ${C(z1.v)}. For z̄: ĀD = ${C(cm(cj(A), z2.D))} and |D|² = ${n(cq(z2.D))}, so ∫_γ z̄ dz = ĀD + |D|² ÷ 2 = ${C(z2.v)}. The total is (${C(z1.v)}) + ${par(p)} × (${C(z2.v)}) = ${C(tot)}.`,
  guidance: [
   { prompt: `With D = B − A = ${C(z1.D)}, ∫_γ z dz = AD + D² ÷ 2. What is its real part?`, answer: [z1.v[0]], explanation: `AD = ${C(cm(A, z1.D))} and D² ÷ 2 = ${C([cm(z1.D, z1.D)[0] / 2, cm(z1.D, z1.D)[1] / 2])}, so ∫_γ z dz = ${C(z1.v)}.` },
   { prompt: `∫_γ z̄ dz = ĀD + |D|² ÷ 2. What is its real part?`, answer: [z2.v[0]], explanation: `ĀD = ${C(cm(cj(A), z2.D))} and |D|² ÷ 2 = ${n(cq(z2.D) / 2)}, so ∫_γ z̄ dz = ${C(z2.v)}.` },
   { prompt: `The total is ∫_γ z dz + ${par(p)} × ∫_γ z̄ dz. What is its real part?`, answer: [tot[0]], explanation: `${n(z1.v[0])} + ${par(p)} × ${par(z2.v[0])} = ${n(tot[0])}.` },
   { prompt: `What is the imaginary part of the total?`, answer: [tot[1]], explanation: `${n(z1.v[1])} + ${par(p)} × ${par(z2.v[1])} = ${n(tot[1])}.` }
  ] }; }
});

/* ---- q19 Antiderivatives and path independence [4.3] ---- */

mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The looping tether',
 brief: 'A tether is strung between two masts on a looping route, and the crew wants the force field added up along it.',
 labels: ['real part', 'imaginary part'], tolerance: 0.005, gl: [['real part of the difference'], ['real part'], ['imaginary part']]
}, {
 /* ∫ zⁿ dz = (b^(n+1) − a^(n+1)) ÷ (n + 1), n 3 or 4; the end points have parts from −2 to 2 so the answers stay under 1000. The parent has n = 2. */
 canonical: { n: 3, ar: 1, ai: -2, br: -1, bi: 1 },
 draw: R => tries(() => ({ n: R.pick([3, 4]), ar: R.int(-2, 2), ai: R.int(-2, 2), br: R.int(-2, 2), bi: R.int(-2, 2) }), q => q.ar !== q.br || q.ai !== q.bi, { n: 3, ar: 1, ai: -2, br: -1, bi: 1 }),
 build: ({ n: k, ar, ai, br, bi }) => { const a = [ar, ai], b = [br, bi], pa = cp(a, k + 1), pb = cp(b, k + 1), df = cs(pb, pa), v = [df[0] / (k + 1), df[1] / (k + 1)]; return {
  prompt: `A tether between two masts runs from a = ${C(a)} to b = ${C(b)} along a looping route. The force field along it is z${sup(k)}, so the crew needs the contour integral ∫ z${sup(k)} dz along the route. Enter its real part, then its imaginary part. The answers are exact decimals with at most two places.`,
  answer: [v[0], v[1]],
  hints: ['zⁿ has the antiderivative zⁿ⁺¹ ÷ (n + 1), because the derivative of that is zⁿ. With an antiderivative F, the integral is F(end) − F(start), whatever route joins them.',
   'Work out the powers of the two end points one multiplication at a time, using i² = −1, then subtract (end minus start) and divide by the new power.'],
  solution: `An antiderivative of z${sup(k)} is F(z) = z${sup(k + 1)} ÷ ${k + 1}, so the route does not matter: the integral is F(b) − F(a) = (b${sup(k + 1)} − a${sup(k + 1)}) ÷ ${k + 1}. b${sup(k + 1)} = ${C(pb)} and a${sup(k + 1)} = ${C(pa)}, so b${sup(k + 1)} − a${sup(k + 1)} = ${C(df)}. Dividing by ${k + 1} gives ${C(v)}.`,
  guidance: [
   { prompt: `b${sup(k + 1)} = ${C(pb)} and a${sup(k + 1)} = ${C(pa)}. What is the real part of b${sup(k + 1)} − a${sup(k + 1)}?`, answer: [df[0]], explanation: `${n(pb[0])} − ${par(pa[0])} = ${n(df[0])}.` },
   { prompt: `The integral is (b${sup(k + 1)} − a${sup(k + 1)}) ÷ ${k + 1}, and the difference is ${C(df)}. What is the real part of the integral?`, answer: [v[0]], explanation: `${n(df[0])} ÷ ${k + 1} = ${n(v[0])}.` },
   { prompt: `What is the imaginary part of the integral?`, answer: [v[1]], explanation: `${n(df[1])} ÷ ${k + 1} = ${n(v[1])}. So the integral is ${C(v)} along any route from a to b.` }
  ] }; }
});

mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'The bent antenna feed',
 brief: 'A feed cable bends round the antenna mast, and the log needs the total field it picks up between its two ends.',
 labels: ['real part', 'imaginary part'], tolerance: 0.01, gl: [['real part of b³ − a³'], ['real part'], ['imaginary part']]
}, {
 /* f(z) = 3z² + p has the antiderivative z³ + pz, so the integral is (b³ − a³) + p(b − a). */
 canonical: { ar: 1, ai: -2, br: 2, bi: 1, p: 3 },
 draw: R => tries(() => ({ ar: R.int(-3, 3), ai: R.int(-3, 3), br: R.int(-3, 3), bi: R.int(-3, 3), p: R.nz(-5, 5) }), q => q.ar !== q.br || q.ai !== q.bi, { ar: 1, ai: -2, br: 2, bi: 1, p: 3 }),
 build: ({ ar, ai, br, bi, p }) => { const a = [ar, ai], b = [br, bi], pa = cp(a, 3), pb = cp(b, 3), df = cs(pb, pa), lin = cs(b, a), v = [df[0] + p * lin[0], df[1] + p * lin[1]]; return {
  prompt: `A feed cable bends round the antenna mast on its way from a = ${C(a)} to b = ${C(b)}. The field strength along it is 3z² ${sg(p)}. The log needs the contour integral ∫ (3z² ${sg(p)}) dz along the cable. Enter its real part, then its imaginary part.`,
  answer: [v[0], v[1]],
  hints: ['An antiderivative of a sum is the sum of the antiderivatives: zⁿ has zⁿ⁺¹ ÷ (n + 1), and a constant c has cz. With an antiderivative F, the integral is F(end) − F(start), whatever route joins the end points.',
   'Work out the cubes of the two end points one multiplication at a time, using i² = −1. Then subtract (end minus start) for the cube part and for the constant part separately, and add.'],
  solution: `An antiderivative of 3z² ${sg(p)} is F(z) = z³ ${cf(p, 'z')}, so the route does not matter: the integral is F(b) − F(a) = (b³ − a³) ${cf(p, '(b − a)')}. b³ = ${C(pb)} and a³ = ${C(pa)}, so b³ − a³ = ${C(df)}. Also b − a = ${C(lin)}, so the constant’s part is ${C([p * lin[0], p * lin[1]])}. The integral is (${C(df)}) + (${C([p * lin[0], p * lin[1]])}) = ${C(v)}.`,
  guidance: [
   { prompt: `b³ = ${C(pb)} and a³ = ${C(pa)}. What is the real part of b³ − a³?`, answer: [df[0]], explanation: `${n(pb[0])} − ${par(pa[0])} = ${n(df[0])}.` },
   { prompt: `The integral is (b³ − a³) ${cf(p, '(b − a)')}, where b − a = ${C(lin)}. What is its real part?`, answer: [v[0]], explanation: `${n(df[0])} ${sg(p * lin[0])} = ${n(v[0])}, where the second number is the real part of the constant’s part.` },
   { prompt: `What is its imaginary part?`, answer: [v[1]], explanation: `${n(df[1])} ${sg(p * lin[1])} = ${n(v[1])}. So the integral is ${C(v)} along any route from a to b.` }
  ] }; }
});

mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'One route, two kinds of field',
 brief: 'The same straight cable meets one field that ignores the route and one that does not, and the log needs both added up.',
 labels: ['real part', 'imaginary part'], tolerance: 0.01, gl: [['real part of ∫ 4z³ dz'], ['imaginary part of ∫ 4z³ dz'], ['real part of the total'], ['imaginary part of the total']]
}, {
 /* f(z) = 4z³ + p z̄ along the straight segment a to b: 4z³ has the antiderivative z⁴, and ∫ z̄ dz = āD + |D|²/2 (p even keeps whole numbers). */
 canonical: { ar: 1, ai: -1, br: -1, bi: 2, p: 2 },
 draw: R => tries(() => ({ ar: R.int(-2, 2), ai: R.int(-2, 2), br: R.int(-2, 2), bi: R.int(-2, 2), p: R.pick([-4, -2, 2, 4]) }), q => q.ar !== q.br || q.ai !== q.bi, { ar: 1, ai: -1, br: -1, bi: 2, p: 2 }),
 build: ({ ar, ai, br, bi, p }) => { const a = [ar, ai], b = [br, bi], pa = cp(a, 4), pb = cp(b, 4), df = cs(pb, pa), zb = intZbar(a, b), tot = [df[0] + p * zb.v[0], df[1] + p * zb.v[1]], pz = p < 0 ? `4z³ − ${n(-p)}z̄` : `4z³ + ${n(p)}z̄`; return {
  prompt: `A cable runs along the straight segment from a = ${C(a)} to b = ${C(b)}, parametrised as γ(t) = a + t(b − a) for t from 0 to 1. The field along it is f(z) = ${pz}, where z̄ is the conjugate of z. Enter the real part, then the imaginary part, of ∫_γ f(z) dz.`,
  answer: [tot[0], tot[1]],
  hints: ['Split the integral: ∫_γ (4z³ + p z̄) dz = ∫_γ 4z³ dz + p ∫_γ z̄ dz. The first part has an antiderivative, so only the end points matter. The second has none, so it needs the parametrisation γ(t) = a + tD with D = b − a and γ′(t) = D.',
   'Use ∫_γ 4z³ dz = b⁴ − a⁴. For z̄, the integrand is (ā + tD̄)D = āD + t|D|², so ∫_γ z̄ dz = āD + |D|² ÷ 2. Work the powers and products with i² = −1.'],
  solution: `The field 4z³ has the antiderivative z⁴, so ∫_γ 4z³ dz = b⁴ − a⁴ = (${C(pb)}) − (${C(pa)}) = ${C(df)}. For z̄: D = b − a = ${C(zb.D)}, ā = ${C(cj(a))}, so āD = ${C(cm(cj(a), zb.D))} and |D|² = ${n(cq(zb.D))}; ∫_γ z̄ dz = āD + |D|² ÷ 2 = ${C(zb.v)}. The total is (${C(df)}) + ${par(p)} × (${C(zb.v)}) = ${C(tot)}.`,
  guidance: [
   { prompt: `b⁴ = ${C(pb)} and a⁴ = ${C(pa)}. What is the real part of ∫_γ 4z³ dz = b⁴ − a⁴?`, answer: [df[0]], explanation: `${n(pb[0])} − ${par(pa[0])} = ${n(df[0])}.` },
   { prompt: `What is the imaginary part of ∫_γ 4z³ dz?`, answer: [df[1]], explanation: `${n(pb[1])} − ${par(pa[1])} = ${n(df[1])}, so ∫_γ 4z³ dz = ${C(df)}.` },
   { prompt: `For z̄ along this segment, D = b − a = ${C(zb.D)} and ∫_γ z̄ dz = āD + |D|² ÷ 2. The total is ∫_γ 4z³ dz + ${par(p)} × ∫_γ z̄ dz. What is its real part?`, answer: [tot[0]], explanation: `āD = ${C(cm(cj(a), zb.D))} and |D|² ÷ 2 = ${n(cq(zb.D) / 2)}, so ∫_γ z̄ dz = ${C(zb.v)}. The real part of the total is ${n(df[0])} + ${par(p)} × ${par(zb.v[0])} = ${n(tot[0])}.` },
   { prompt: `What is the imaginary part of the total?`, answer: [tot[1]], explanation: `${n(df[1])} + ${par(p)} × ${par(zb.v[1])} = ${n(tot[1])}.` }
  ] }; }
});

/* ---- q20 Powers round a circle [4.5] ---- */

/* The circle's centre c as text in "z − c": zc(2, −1) is 'z − 2 + i'. */
const zc = (cr, ci) => 'z' + (cr ? (cr > 0 ? ' − ' : ' + ') + n(Math.abs(cr)) : '') + (ci ? (ci > 0 ? ' − ' : ' + ') + (Math.abs(ci) === 1 ? 'i' : n(Math.abs(ci)) + 'i') : '');
/* One term coef × (z − c)^m, with a positive or negative coefficient as given: −1 is written as a division, 0 as a plain number. */
const pterm = (coef, m, base) => {
 if (m === 0) return n(coef);
 if (m === -1) return `${n(coef)} ÷ ${base}`;
 const body = m === 1 ? base : base + sup(m);
 return coef === 1 ? body : coef === -1 ? '−' + body : n(coef) + body; };
/* A sum of terms [coef, m]. */
const pexpr = (list, base) => list.map(([c, m], i) => i === 0 ? pterm(c, m, base) : (c < 0 ? ' − ' : ' + ') + pterm(Math.abs(c), m, base)).join('');

mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'The patrol drone’s circuit',
 brief: 'A patrol drone flies once round a circular track with two meters on board, and the log needs what each meter adds up.',
 labels: ['k₁', 'k₂'], tolerance: 0.01, gl: [['k₁'], ['k for the 1 ÷ (z − c) term'], ['k₂']]
}, {
 /* ∮ B(z − c)^m1 dz = 2B·πi when m1 = −1, else 0. The second integrand is A ÷ (z − c) + C(z − c)^m2 + D, so k₂ = 2A. The centre is never 0. */
 canonical: { cr: 1, ci: 2, r: 2, m1: -3, B: 4, A: -5, Cc: 2, m2: 3, D: 7 },
 draw: R => tries(() => ({ cr: R.int(-4, 4), ci: R.int(-4, 4), r: R.int(1, 6), m1: R.pick([-4, -3, -2, -1, 1, 2, 3, 4]), B: R.nz(-5, 5), A: R.nz(-5, 5), Cc: R.nz(-4, 4), m2: R.pick([-3, -2, 2, 3, 4]), D: R.nz(-6, 6) }),
  q => q.cr !== 0 || q.ci !== 0, { cr: 1, ci: 2, r: 2, m1: -3, B: 4, A: -5, Cc: 2, m2: 3, D: 7 }),
 build: ({ cr, ci, r, m1, B, A, Cc, m2, D }) => { const base = `(${zc(cr, ci)})`, k1 = m1 === -1 ? 2 * B : 0, k2 = 2 * A, c = C([cr, ci]), e1 = pexpr([[B, m1]], base), e2 = pexpr([[A, -1], [Cc, m2], [D, 0]], base); return {
  prompt: `A patrol drone flies once anticlockwise round a circular track of radius ${n(r)} centred at c = ${c}; ∮ means a contour integral once round it. Its first meter adds up ∮ ${e1} dz = k₁πi and its second meter adds up ∮ (${e2}) dz = k₂πi. Enter k₁, then k₂.`,
  answer: [k1, k2],
  hints: ['For a power other than −1, (z − c)ⁿ has the antiderivative (z − c)ⁿ⁺¹ ÷ (n + 1), and a plain constant has an antiderivative too. Round a closed curve the start and the end are the same point, so each such integral is 0.',
   'For the power −1, parametrise z = c + r(cos t + i sin t) for t from 0 to 2π. Then dz ÷ (z − c) = i dt, which adds up to 2πi whatever the centre and the radius. A coefficient in front of 1 ÷ (z − c) multiplies the 2πi.'],
  solution: (m1 === -1 ? `In the first integral the power is −1, so ∮ dz ÷ (${zc(cr, ci)}) = 2πi and the coefficient ${n(B)} gives ${n(2 * B)}πi: k₁ = ${n(k1)}.` : `${e1} has the antiderivative ${cb(B)}${base}${sup(m1 + 1)} ÷ ${par(m1 + 1)}, which takes the same value at the start and the end of a closed curve, so the integral is 0 and k₁ = 0.`) + ` In the second integral, ${pterm(A, -1, base)} gives ${tm(A)}2πi = ${n(2 * A)}πi, while ${pterm(Cc, m2, base)} and the constant ${n(D)} give 0 because their powers (${n(m2)} and 0) are not −1. So k₂ = ${n(k2)}.`,
  guidance: [
   { prompt: `What is k₁ in ∮ ${e1} dz = k₁πi?`, answer: [k1], explanation: m1 === -1 ? `The power is −1, so the integral is ${tm(B)}2πi and k₁ = ${n(k1)}.` : `The power ${n(m1)} is not −1, so the integral round the closed curve is 0 and k₁ = 0.` },
   { prompt: `What is k in ∮ ${pterm(A, -1, base)} dz = kπi?`, answer: [k2], explanation: `∮ dz ÷ ${base} = 2πi, so the coefficient ${n(A)} gives ${n(2 * A)}πi.` },
   { prompt: `The other two terms, ${pterm(Cc, m2, base)} and the constant ${n(D)}, have powers that are not −1. What is k₂ for the whole second integrand?`, answer: [k2], explanation: `The other two terms give 0, so k₂ = ${n(k2)} + 0 + 0 = ${n(k2)}.` }
  ] }; }
});

mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Laps round the beacon',
 brief: 'A survey drone flies several laps round two circles about the beacon, and the log needs everything its meter adds up.',
 labels: ['k'], tolerance: 0.01, gl: [['k for one lap'], ['number of laps'], ['k']]
}, {
 /* F = A ÷ (z − c) + B(z − c)^m + D ÷ (z − c)^q: one lap on any circle about c gives 2A·πi, so k = 2A(L1 + L2). */
 canonical: { cr: -2, ci: 1, r1: 2, r2: 5, L1: 2, L2: 3, A: 3, B: -4, m: 2, D: 5, q: 2 },
 draw: R => tries(() => { const r1 = R.int(1, 3); return { cr: R.int(-4, 4), ci: R.int(-4, 4), r1, r2: r1 + R.int(1, 4), L1: R.int(1, 3), L2: R.int(1, 3), A: R.nz(-4, 4), B: R.nz(-5, 5), m: R.pick([1, 2, 3]), D: R.nz(-6, 6), q: R.pick([2, 3, 4]) }; },
  q => q.cr !== 0 || q.ci !== 0, { cr: -2, ci: 1, r1: 2, r2: 5, L1: 2, L2: 3, A: 3, B: -4, m: 2, D: 5, q: 2 }),
 build: ({ cr, ci, r1, r2, L1, L2, A, B, m, D, q }) => { const base = `(${zc(cr, ci)})`, c = C([cr, ci]), F = pexpr([[A, -1], [B, m], [D, -q]], base), perLap = 2 * A, laps = L1 + L2, K = perLap * laps; return {
  prompt: `A survey drone flies anticlockwise round a circular track of radius ${n(r1)} centred at c = ${c}, ${L1} ${L1 === 1 ? 'lap' : 'laps'} in a row, and then round a larger circle of radius ${n(r2)} with the same centre, ${L2} ${L2 === 1 ? 'lap' : 'laps'} in a row. Its meter adds up ∮ F(z) dz round every lap, where F(z) = ${F}, and keeps the grand total. Each lap round the same circle adds the same amount again, and the laps on the two circles add up too. The grand total is kπi. Enter k.`,
  answer: [K],
  hints: ['Split F into its terms. For a power other than −1, (z − c)ⁿ has an antiderivative round the circle, so its integral round a closed curve is 0, whatever the radius. Only the power −1 survives, and it gives 2πi times its coefficient.',
   'Find k for one lap first (the radius does not change it), then count the laps on both circles together and multiply.'],
  solution: `In F, the terms ${pterm(B, m, base)} and ${pterm(D, -q, base)} have powers ${n(m)} and ${n(-q)}, which are not −1, so each gives 0 round a circle centred at c. The term ${pterm(A, -1, base)} gives ${tm(A)}2πi = ${n(2 * A)}πi on a lap of either circle, whatever its radius. The drone makes ${L1} + ${L2} = ${laps} laps, so the grand total is ${laps} × (${n(2 * A)}πi) = ${n(K)}πi and k = ${n(K)}.`,
  guidance: [
   { prompt: `What is k for one lap round either circle, ∮ F(z) dz = kπi? Only the term ${pterm(A, -1, base)} counts.`, answer: [perLap], explanation: `∮ dz ÷ ${base} = 2πi, so the coefficient ${n(A)} gives ${n(perLap)}πi. The other two terms give 0.` },
   { prompt: `The drone flies ${L1} ${L1 === 1 ? 'lap' : 'laps'} on the first circle and ${L2} on the second. How many laps is that in all?`, answer: [laps], explanation: `${L1} + ${L2} = ${laps} laps.` },
   { prompt: `Each lap adds ${n(perLap)}πi. What is k for the grand total?`, answer: [K], explanation: `${laps} × ${par(perLap)} = ${n(K)}, so the grand total is ${n(K)}πi.` }
  ] }; }
});

mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q19', title: 'The full circle and the half circle',
 brief: 'One drone flies the whole circle and another only half of it, and the log needs what each adds up.',
 labels: ['k', 'half-circle integral'], tolerance: 0.01, gl: [['k'], ['F at the end'], ['half-circle integral']]
}, {
 /* G = A ÷ (z − c) + B(z − c)^n with B = (n + 1)b, n 2 or 4: k = 2A, and the half circle from c + r to c − r gives b((−r)^(n+1) − r^(n+1)). */
 canonical: { cr: 1, ci: -2, r: 2, A: 3, n: 2, b: -2 },
 draw: R => tries(() => ({ cr: R.int(-4, 4), ci: R.int(-4, 4), r: R.int(1, 3), A: R.nz(-5, 5), n: R.pick([2, 4]), b: R.nz(-2, 2) }), q => q.cr !== 0 || q.ci !== 0, { cr: 1, ci: -2, r: 2, A: 3, n: 2, b: -2 }),
 build: ({ cr, ci, r, A, n: k, b }) => { const base = `(${zc(cr, ci)})`, c = C([cr, ci]), B = (k + 1) * b, P = Math.pow(r, k + 1), Fend = b * -P, half = Fend - b * P; return {
  prompt: `The ring road is the circle of radius ${n(r)} centred at c = ${c}, driven once anticlockwise. A drone’s field is G(z) = ${pexpr([[A, -1], [B, k]], base)}. Enter k in ∮ G(z) dz = kπi once round the circle. A second drone flies only the half of the circle from the point c + ${n(r)} to the point c − ${n(r)}, passing through the upper side, and meets only the field ${pterm(B, k, base)}. Its integral along the half circle is a real number: enter it.`,
  answer: [2 * A, half],
  hints: ['Round the whole circle, the power −1 gives 2πi times its coefficient and any other power gives 0, because it has an antiderivative on a closed curve.',
   'The half circle is not closed, so use an antiderivative instead: B(z − c)ⁿ has the antiderivative B(z − c)ⁿ⁺¹ ÷ (n + 1), and the integral is its value at the end point minus its value at the start point, whatever the route. At the two end points, z − c is r and −r.'],
  solution: `Round the whole circle, ${pterm(A, -1, base)} gives ${tm(A)}2πi = ${n(2 * A)}πi and ${pterm(B, k, base)} gives 0 because ${k} is not −1: k = ${n(2 * A)}. The half circle is not closed, so use the antiderivative F(z) = ${cb(B)}${base}${sup(k + 1)} ÷ ${k + 1} = ${cb(b)}${base}${sup(k + 1)}. At the end point z − c = ${n(-r)}, so F = ${tm(b)}${par(-r)}${sup(k + 1)} = ${n(Fend)}. At the start point z − c = ${n(r)}, so F = ${tm(b)}${n(r)}${sup(k + 1)} = ${n(b * P)}. The integral is F(end) − F(start) = ${n(Fend)} − ${par(b * P)} = ${n(half)}.`,
  guidance: [
   { prompt: `What is k in ∮ G(z) dz = kπi once round the whole circle?`, answer: [2 * A], explanation: `Only the power −1 survives: ${tm(A)}2πi = ${n(2 * A)}πi, so k = ${n(2 * A)}.` },
   { prompt: `For the half circle, F(z) = ${cb(b)}${base}${sup(k + 1)} is an antiderivative of ${pterm(B, k, base)}. What is F at the end point, where z − c = ${n(-r)}?`, answer: [Fend], explanation: `${tm(b)}${par(-r)}${sup(k + 1)} = ${n(Fend)}.` },
   { prompt: `At the start point z − c = ${n(r)}, so F = ${n(b * P)}. What is the integral along the half circle, F(end) − F(start)?`, answer: [half], explanation: `${n(Fend)} − ${par(b * P)} = ${n(half)}.` }
  ] }; }
});

})();
