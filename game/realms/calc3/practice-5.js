/* Calculus 3: many variables practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p5.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A coefficient written in front of a product, left out when it is 1: times1(3) → '3 × ', times1(1) → ''. */
const times1 = c => c === 1 ? '' : `${n(c)} × `;
/* A multiple of λ: lam(3) → '3λ', lam(1) → 'λ'. */
const lam = c => c === 1 ? 'λ' : `${n(c)}λ`;
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
/* A sum of terms written the usual way: poly([[2, 'x'], [−1, 'y'], [3, '']]) is '2x − y + 3'. Zero terms are dropped,
   a coefficient 1 is not written before a letter, and an empty sum is '0'. */
const poly = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, m], i) => { const a = Math.abs(c), body = m ? (a === 1 ? m : n(a) + m) : n(a); return i === 0 ? (c < 0 ? '−' + body : body) : (c < 0 ? ' − ' : ' + ') + body; }).join(''); };
const pt = (a, b) => `(${n(a)}, ${n(b)})`;
const ang = list => '⟨' + list.map(n).join(', ') + '⟩';
const isSq = v => v > 0 && Number.isInteger(Math.sqrt(v));
/* Has at most k decimals. */
const dec = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-9;
/* The second derivative test: code 1 maximum, 2 minimum, 3 saddle point, from D and the sign of f_xx. */
const codeOf = (D, fxx) => D < 0 ? 3 : fxx > 0 ? 2 : 1;
const verdict = (D, fxx) => D < 0 ? 'D is negative, so the point is a saddle point: code 3' : fxx > 0 ? 'D is positive and f_xx is positive, so the point is a local minimum: code 2' : 'D is positive and f_xx is negative, so the point is a local maximum: code 1';
/* f = ax² + bxy + cy² + dx + ey + k with its only critical point at (p, q): d and e are chosen so that f_x and f_y vanish there. */
const quad = ({ a, b, c, p, q, k = 0 }) => {
 const d = -(2 * a * p + b * q), e = -(b * p + 2 * c * q), D = 4 * a * c - b * b;
 return { d, e, D, code: codeOf(D, a), verdict: verdict(D, a), f: poly([[a, 'x²'], [b, 'xy'], [c, 'y²'], [d, 'x'], [e, 'y'], [k, '']]),
  fx: poly([[2 * a, 'x'], [b, 'y'], [d, '']]), fy: poly([[b, 'x'], [2 * c, 'y'], [e, '']]), value: (x, y) => a * x * x + b * x * y + c * y * y + d * x + e * y + k };
};
const cr = x => x === 1 ? '1 credit' : `${n(x)} credits`;

/* ---- q21 Critical points and the second derivative test [4.7] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The crater floor flat spot',
 brief: 'A rover will park for the night on a crater floor, and the survey wants to know what kind of place its one level spot is and how high it lies.',
 labels: ['x (km)', 'y (km)', 'code', 'height (m)'], tolerance: 0.01,
 gl: [['x (km)', 'y (km)'], ['D', 'code'], ['height (m)']]
}, {
 /* f = ax² + bxy + cy² + dx + ey + k with its only critical point at (p, q), never the origin; D ≠ 0; the kind of point is drawn first so each code is a third of the draws.
    Not the q21 worked example (x² + xy + y² − 3y) and not q21 itself. */
 canonical: { a: 3, b: -2, c: 2, p: -2, q: 3, k: 15 },
 draw: R => { const want = R.int(1, 3); let p, D; do { p = { a: R.nz(-4, 4), b: R.nz(-4, 4), c: R.nz(-4, 4), p: R.int(-3, 3), q: R.int(-3, 3), k: R.int(5, 40) }; D = 4 * p.a * p.c - p.b * p.b; }
  while ((p.p === 0 && p.q === 0) || D === 0 || codeOf(D, p.a) !== want || Math.abs(quad(p).value(p.p, p.q)) === 1 || (p.a === 2 && p.b === 2 && p.c === -1 && p.p === 1 && p.q === 2) || (p.a === 1 && p.b === 1 && p.c === 1 && p.p === -1 && p.q === 2)); return p; },
 build: ({ a, b, c, p, q, k }) => { const Q = quad({ a, b, c, p, q, k }), fc = Q.value(p, q); return {
  prompt: `A survey rover maps the floor of a crater. Its ground height is f(x, y) = ${Q.f} metres, where x and y are kilometres east and north of the landing pad. The floor has exactly one critical point. Enter its x-coordinate and its y-coordinate, then a code for what kind of point it is (1 for a local maximum, 2 for a local minimum, 3 for a saddle point), then the ground height there in metres.`,
  answer: [p, q, Q.code, fc],
  hints: ['A critical point is where f_x and f_y are both 0. Write both partial derivatives, set each one equal to 0 and solve the two equations together.', 'Work out D = f_xx f_yy − (f_xy)² for the point. If D is negative it is a saddle point. If D is positive it is a minimum when f_xx is positive and a maximum when f_xx is negative. Then put the point into f for the height.'],
  solution: `f_x = ${Q.fx} and f_y = ${Q.fy}. Setting both equal to 0 and solving the two equations together gives x = ${n(p)} and y = ${n(q)}. The second partial derivatives are f_xx = ${n(2 * a)}, f_yy = ${n(2 * c)} and f_xy = ${n(b)}, so D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}. Putting x = ${n(p)} and y = ${n(q)} into f gives a height of ${n(fc)} metres.`,
  guidance: [
   { prompt: `Write f_x and f_y for f(x, y) = ${Q.f}, set both equal to 0 and solve. Where is the critical point?`, answer: [p, q], explanation: `f_x = ${Q.fx} and f_y = ${Q.fy}. Both are 0 at x = ${n(p)}, y = ${n(q)}, and nowhere else.` },
   { prompt: `The second partial derivatives are f_xx = ${n(2 * a)}, f_yy = ${n(2 * c)} and f_xy = ${n(b)}. Work out the discriminant D = f_xx f_yy − (f_xy)², then the code: 1 for a local maximum, 2 for a local minimum, 3 for a saddle point.`, answer: [Q.D, Q.code], explanation: `D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}.` },
   { prompt: `Put x = ${n(p)} and y = ${n(q)} into f. What is the ground height there, in metres?`, answer: [fc], explanation: `f(${n(p)}, ${n(q)}) = ${n(fc)} metres.` }
  ] }; }
});

mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'The cheapest dial settings',
 brief: 'The greenhouse heating loop has two dials, and the plant manager wants the pair of settings that makes it cheapest to run.',
 labels: ['pump setting x', 'valve setting y', 'D', 'lowest cost (thousand credits)'], tolerance: 0.01,
 gl: [['pump setting x', 'valve setting y'], ['D'], ['lowest cost (thousand credits)']]
}, {
 /* A positive-definite quadratic cost (a, c > 0, D > 0, so the one critical point is a minimum) with the lowest cost m at (p, q), both positive.
    The constant term is k = m + ap² + bpq + cq², so the cost at the point is m. Not any q21 draw: no worked example has this form. */
 canonical: { a: 2, b: -1, c: 3, p: 3, q: 2, m: 12 },
 draw: R => { let p; do { p = { a: R.int(1, 3), b: R.nz(-3, 3), c: R.int(1, 3), p: R.int(1, 5), q: R.int(1, 5), m: R.int(4, 30) }; } while (4 * p.a * p.c - p.b * p.b <= 0); return p; },
 build: ({ a, b, c, p, q, m }) => { const k = m + a * p * p + b * p * q + c * q * q, Q = quad({ a, b, c, p, q, k }), cost = Q.value(p, q); return {
  prompt: `The heating loop of the Dome Works greenhouse has a yearly running cost of C(x, y) = ${Q.f} thousand credits, where x is the setting of the pump dial and y is the setting of the valve dial. The cost levels off at exactly one pair of settings, and the second derivative test shows it is the cheapest pair. Enter the pump setting x and the valve setting y there, then the discriminant D, then the lowest running cost in thousand credits.`,
  answer: [p, q, Q.D, cost],
  hints: ['Write the two partial derivatives C_x and C_y, set each one equal to 0 and solve the two equations together. That gives the settings.', 'The discriminant is D = C_xx C_yy − (C_xy)², with the three second partial derivatives. The lowest cost is C at the settings you found.'],
  solution: `C_x = ${Q.fx} and C_y = ${Q.fy}. Setting both equal to 0 and solving the two equations together gives x = ${n(p)} and y = ${n(q)}. The second partial derivatives are C_xx = ${n(2 * a)}, C_yy = ${n(2 * c)} and C_xy = ${n(b)}, so D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. D is positive and C_xx is positive, so this is a local minimum, the cheapest pair of settings. The lowest cost is C(${n(p)}, ${n(q)}) = ${n(cost)} thousand credits.`,
  guidance: [
   { prompt: `Write C_x and C_y for C(x, y) = ${Q.f}, set both equal to 0 and solve. What are the two settings?`, answer: [p, q], explanation: `C_x = ${Q.fx} and C_y = ${Q.fy}. Both are 0 at x = ${n(p)}, y = ${n(q)}, and nowhere else.` },
   { prompt: `The second partial derivatives are C_xx = ${n(2 * a)}, C_yy = ${n(2 * c)} and C_xy = ${n(b)}. What is the discriminant D = C_xx C_yy − (C_xy)²?`, answer: [Q.D], explanation: `D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. It is positive and C_xx is positive, so the point is a minimum.` },
   { prompt: `Put x = ${n(p)} and y = ${n(q)} into C. What is the lowest running cost, in thousand credits?`, answer: [cost], explanation: `C(${n(p)}, ${n(q)}) = ${n(cost)} thousand credits.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', title: 'The ridge field with two flat spots',
 brief: 'The ridge field north of the camp is flat in more than one place, and the surveyors need each flat spot sorted into hilltop, hollow or pass.',
 labels: ['x (km)', 'y (km)', 'D', 'code', 'code at the other point'], tolerance: 0.01,
 gl: [['x (km)', 'y (km)'], ['f_xx', 'f_yy', 'f_xy'], ['D', 'code', 'code at the other point']]
}, {
 /* f = t(x³ − 3s²x) + c(y² − 2qy): f_x = 3t(x² − s²), so x = ±s, and f_y = 2c(y − q), so y = q. f_xx = 6tx, f_yy = 2c, f_xy = 0, D = 12tcx: the
    point with x = s has code 2 when c > 0 and 3 when c < 0; the point with x = −s has code 3 when c > 0 and 1 when c < 0. A cubic has two critical points,
    which no q21 draw has. */
 canonical: { t: 1, s: 2, q: 3, c: 2 },
 draw: R => ({ t: R.int(1, 2), s: R.int(1, 4), q: R.int(-3, 3), c: R.nz(-3, 3) }),
 build: ({ t, s, q, c }) => { const f = poly([[t, 'x³'], [-3 * t * s * s, 'x'], [c, 'y²'], [-2 * c * q, 'y']]), fxx = 6 * t * s, D1 = 12 * t * c * s, code1 = codeOf(D1, fxx), code2 = codeOf(-D1, -fxx); return {
  prompt: `The ground height over the ridge field north of the camp is f(x, y) = ${f} metres, where x and y are kilometres east and north of the camp. This field has exactly two critical points. Enter the x-coordinate of the one with the larger x, then its y-coordinate, then the discriminant D there and its code (1 for a local maximum, 2 for a local minimum, 3 for a saddle point). Then enter the code of the other critical point.`,
  answer: [s, q, D1, code1, code2],
  hints: ['Set f_x and f_y equal to zero. The f_x equation has a squared x in it, and an equation (x squared) = (a number) has two solutions, one positive and one negative. Each one gives a critical point.', 'The second partial derivatives come from the rule that the derivative of x³ is 3x² and the derivative of 3x² is 6x. Work out D = f_xx f_yy − (f_xy)² at each point separately: f_xx changes with x.'],
  solution: `f_x = ${poly([[3 * t, 'x²'], [-3 * t * s * s, '']])} and f_y = ${poly([[2 * c, 'y'], [-2 * c * q, '']])}. The equation f_x = 0 gives x² = ${n(s * s)}, so x = ${n(s)} or x = −${n(s)}, and f_y = 0 gives y = ${n(q)}. The critical points are (${n(s)}, ${n(q)}) and (−${n(s)}, ${n(q)}). The second partial derivatives are f_xx = ${poly([[6 * t, 'x']])}, f_yy = ${n(2 * c)} and f_xy = 0. At (${n(s)}, ${n(q)}): f_xx = ${n(fxx)}, so D = ${n(fxx)} × ${par(2 * c)} − 0² = ${n(D1)}. ${verdict(D1, fxx)}. At (−${n(s)}, ${n(q)}): f_xx = ${n(-fxx)}, so D = ${n(-fxx)} × ${par(2 * c)} − 0² = ${n(-D1)}. ${verdict(-D1, -fxx)}.`,
  guidance: [
   { prompt: `Set f_x = 0 and f_y = 0. The f_x equation gives two values of x. What are the x-coordinate of the right-hand critical point (the larger x) and the y-coordinate, which both points share?`, answer: [s, q], explanation: `f_x = ${poly([[3 * t, 'x²'], [-3 * t * s * s, '']])} is 0 when x² = ${n(s * s)}, so x = ${n(s)} or x = −${n(s)}. f_y = ${poly([[2 * c, 'y'], [-2 * c * q, '']])} is 0 when y = ${n(q)}.` },
   { prompt: `Differentiate again. At the right-hand point (${n(s)}, ${n(q)}), what are f_xx, f_yy and f_xy?`, answer: [fxx, 2 * c, 0], explanation: `f_xx = ${poly([[6 * t, 'x']])} = ${n(6 * t)} × ${n(s)} = ${n(fxx)} there. f_yy = ${n(2 * c)}. f_xy = 0, because f_x has no y in it.` },
   { prompt: `Work out D = f_xx f_yy − (f_xy)² at the right-hand point and its code. Then give the code of the left-hand point (−${n(s)}, ${n(q)}), where f_xx = ${n(-fxx)}.`, answer: [D1, code1, code2], explanation: `Right-hand point: D = ${n(fxx)} × ${par(2 * c)} − 0² = ${n(D1)}. ${verdict(D1, fxx)}. Left-hand point: D = ${n(-D1)}. ${verdict(-D1, -fxx)}.` }
  ] }; }
});

/* ---- q22 Lagrange multipliers [4.8] ---- */

/* A signed Pythagorean pair, with a radius r so that the point (rA ÷ L, rB ÷ L) of the circle has whole coordinates, λ = L ÷ (2r) has at most
   3 decimals and r × L stays below 1000. */
const rail = R => { let p, L; do { const [u, v] = R.pick([[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6]]); p = { A: R.bool() ? u : -u, B: R.bool() ? v : -v, r: R.int(2, 26) }; L = Math.hypot(p.A, p.B); }
 while (!Number.isInteger(p.r * p.A / L) || !Number.isInteger(p.r * p.B / L) || !dec(L / (2 * p.r), 3) || p.r * L >= 1000 || (p.A === 3 && p.B === 4 && p.r === 10)); return p; };

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'The coolant gauge on the ring',
 brief: 'A coolant gauge rides a ring round the ventilation stack, and the plant crew want the coldest reading it can take.',
 labels: ['lowest value (°C)', 'λ'], tolerance: 0.0005,
 gl: [['λ'], ['x', 'y'], ['lowest value (°C)']]
}, {
 /* f = Ax + By on x² + y² = r², asking for the LOWEST value: it is at the point (−rA ÷ L, −rB ÷ L), where f = −rL and λ = −L ÷ (2r). Draws as the q22 rail,
    never the q22 numbers (3, 4, 10). */
 canonical: { A: -5, B: 12, r: 13 },
 draw: rail,
 build: ({ A, B, r }) => { const L = Math.hypot(A, B), R2 = r * r, X = r * A / L, Y = r * B / L, top = r * L, lam = L / (2 * r); return {
  prompt: `A coolant gauge rides a circular rail round the dome’s ventilation stack: its position (x, y), in metres from the stack, always satisfies x² + y² = ${n(R2)}. The temperature change it reads there, in degrees Celsius, is f(x, y) = ${poly([[A, 'x'], [B, 'y']])}. Use a Lagrange multiplier with g(x, y) = x² + y², in the form ∇f = λ∇g (this fixes the sign of λ): enter the lowest value of f on the rail, then the value of λ at the point where it happens (a decimal is fine, and λ may be negative).`,
  answer: [-top, -lam],
  hints: ['The method says ∇f = λ∇g, with ∇g = ⟨2x, 2y⟩. Match the two components, write x and y in terms of λ, and put them into the constraint to solve for λ.', 'The two signs of λ give two points on the rail. Work out f at both, and keep the smaller value together with the λ that belongs to it.'],
  solution: `∇f = ⟨${n(A)}, ${n(B)}⟩ and ∇g = ⟨2x, 2y⟩, so ${n(A)} = 2λx and ${n(B)} = 2λy, which give x = ${n(A)} ÷ (2λ) and y = ${n(B)} ÷ (2λ). Putting these into x² + y² = ${n(R2)} gives (${n(A * A)} + ${n(B * B)}) ÷ (4λ²) = ${n(R2)}, so λ² = ${n(L * L)} ÷ ${n(4 * R2)} and λ = ${n(lam)} or λ = −${n(lam)}. With λ = ${n(lam)} the point is (${n(X)}, ${n(Y)}) and f = ${n(top)}; with λ = −${n(lam)} the point is (${n(-X)}, ${n(-Y)}) and f = ${n(A)} × ${par(-X)} + ${par(B)} × ${par(-Y)} = −${n(top)}. The lowest value is −${n(top)} degrees, where λ = −${n(lam)}.`,
  guidance: [
   { prompt: `From ∇f = λ∇g: ${n(A)} = 2λx and ${n(B)} = 2λy. Put x = ${n(A)} ÷ (2λ) and y = ${n(B)} ÷ (2λ) into x² + y² = ${n(R2)}. What is the positive value of λ?`, answer: [lam], explanation: `(${n(A * A)} + ${n(B * B)}) ÷ (4λ²) = ${n(R2)}, so λ² = ${n(L * L)} ÷ ${n(4 * R2)}. The positive square root is λ = ${n(lam)}, and the other solution is λ = −${n(lam)}.` },
   { prompt: `The lowest point comes from the other value, λ = −${n(lam)}. With it, where is the gauge? Enter x, then y.`, answer: [-X, -Y], explanation: `x = ${n(A)} ÷ (2 × ${par(-lam)}) = ${n(-X)} and y = ${n(B)} ÷ (2 × ${par(-lam)}) = ${n(-Y)}. Check: ${par(-X)}² + ${par(-Y)}² = ${n(R2)}.` },
   { prompt: `What does the gauge read at (${n(-X)}, ${n(-Y)})?`, answer: [-top], explanation: `f = ${n(A)} × ${par(-X)} + ${par(B)} × ${par(-Y)} = −${n(top)}. The other point, (${n(X)}, ${n(Y)}), gives ${n(top)}, so −${n(top)} is the lowest value on the rail.` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'The algae tank budget',
 brief: 'The algae tank has a fixed budget for its feed lines, and the crew want the shape of floor that grows the most.',
 labels: ['λ', 'x (m)', 'y (m)', 'largest area (m²)'], tolerance: 0.0005,
 gl: [['λ'], ['x (m)', 'y (m)'], ['largest area (m²)']]
}, {
 /* f = xy on ax + by = k = 2abm: ∇f = ⟨y, x⟩ = λ⟨a, b⟩ gives y = aλ, x = bλ, and k = 2abλ, so λ = m, x = bm, y = am, area abm². Draws a, b in 1..5. */
 canonical: { a: 3, b: 2, m: 4 },
 draw: R => ({ a: R.int(1, 5), b: R.int(1, 5), m: R.int(2, 6) }),
 build: ({ a, b, m }) => { const k = 2 * a * b * m, x0 = b * m, y0 = a * m, area = x0 * y0, con = poly([[a, 'x'], [b, 'y']]); return {
  prompt: `A rectangular algae tank at Dome Works is x metres long and y metres wide. The feed line along its length costs ${cr(a)} per metre and the feed line along its width costs ${cr(b)} per metre, and the whole budget of ${n(k)} credits is spent, so ${con} = ${n(k)}, with x and y positive. Use a Lagrange multiplier with f(x, y) = xy, the floor area, and g(x, y) = ${con}. Enter λ, then x, then y, then the largest floor area in square metres.`,
  answer: [m, x0, y0, area],
  hints: ['Work out ∇f = ⟨y, x⟩ and ∇g from the constraint function. Setting ∇f = λ∇g gives y and x in terms of λ.', 'Put those into the constraint to solve for λ, then find x and y. The area is x times y. For positive x and y the constraint has one candidate point, and it gives the largest area.'],
  solution: `∇f = ⟨y, x⟩ and ∇g = ⟨${n(a)}, ${n(b)}⟩, so y = ${lam(a)} and x = ${lam(b)}. Putting these into ${con} = ${n(k)} gives ${n(a)} × ${lam(b)} + ${n(b)} × ${lam(a)} = ${n(k)}, so ${n(2 * a * b)}λ = ${n(k)} and λ = ${n(m)}. Then x = ${n(b)} × ${n(m)} = ${n(x0)} and y = ${n(a)} × ${n(m)} = ${n(y0)}, and the largest area is ${n(x0)} × ${n(y0)} = ${n(area)} square metres.`,
  guidance: [
   { prompt: `From ∇f = λ∇g: y = ${lam(a)} and x = ${lam(b)}. Put them into ${con} = ${n(k)}. What is λ?`, answer: [m], explanation: `${n(a)} × ${lam(b)} + ${n(b)} × ${lam(a)} = ${n(2 * a * b)}λ = ${n(k)}, so λ = ${n(m)}.` },
   { prompt: `With λ = ${n(m)}, what are x and y?`, answer: [x0, y0], explanation: `x = ${n(b)} × ${n(m)} = ${n(x0)} and y = ${n(a)} × ${n(m)} = ${n(y0)}. Check: ${n(a)} × ${n(x0)} + ${n(b)} × ${n(y0)} = ${n(k)}.` },
   { prompt: `What is the floor area xy at (${n(x0)}, ${n(y0)}), in square metres?`, answer: [area], explanation: `${n(x0)} × ${n(y0)} = ${n(area)} square metres.` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', title: 'The oval walkway heater',
 brief: 'A heater trolley runs along an oval walkway round the garden dome, and the crew want its hottest spot and the multiplier that finds it.',
 labels: ['largest value (°C)', 'λ'], tolerance: 0.0005,
 gl: [['λ'], ['x', 'y'], ['largest value (°C)']]
}, {
 /* f = Ax + By on the oval x² + 4y² = K, g = x² + 4y², ∇g = ⟨2x, 8y⟩. The top point (x0, y0) has λ ∈ {1/4, 1/2, 1}: A = 2λx0, B = 8λy0, K = x0² + 4y0², the largest value is 2λK.
    For λ = 1/4 the x0 is even so A is whole. A circle is the q22 shape; this oval is not. */
 canonical: { x0: 3, y0: 1, li: 1 },
 draw: R => { const li = R.int(0, 2), xs = li === 0 ? [2, 4, 6] : [1, 2, 3, 4, 5, 6]; return { x0: R.pick(xs) * (R.bool() ? 1 : -1), y0: R.int(1, 4) * (R.bool() ? 1 : -1), li }; },
 build: ({ x0, y0, li }) => { const lam = [0.25, 0.5, 1][li], A = 2 * lam * x0, B = 8 * lam * y0, K = x0 * x0 + 4 * y0 * y0, top = 2 * lam * K, L2 = 4 * A * A + B * B; return {
  prompt: `A heater trolley runs along an oval walkway round the garden dome: its position (x, y), in metres from the dome’s centre, always satisfies x² + 4y² = ${n(K)}. The temperature it reads there, in degrees Celsius above the garden’s own, is f(x, y) = ${poly([[A, 'x'], [B, 'y']])}. Use a Lagrange multiplier with g(x, y) = x² + 4y², in the form ∇f = λ∇g (this fixes the sign of λ): enter the largest value of f on the walkway, then the value of λ at the point where it happens (a decimal is fine).`,
  answer: [top, lam],
  hints: ['Work out ∇g for g(x, y) = x² + 4y²: it is ⟨2x, 8y⟩. Then ∇f = λ∇g gives one equation for each component, so x and y can be written in terms of λ.', 'Put x and y into the constraint x² + 4y² = (the number) and solve for λ. The two signs of λ give two points: work out f at both and keep the larger.'],
  solution: `∇f = ⟨${n(A)}, ${n(B)}⟩ and ∇g = ⟨2x, 8y⟩, so ${n(A)} = 2λx and ${n(B)} = 8λy, which give x = ${n(A)} ÷ (2λ) and y = ${n(B)} ÷ (8λ). Putting these into x² + 4y² = ${n(K)} gives ${n(A * A)} ÷ (4λ²) + ${n(B * B)} ÷ (16λ²) = ${n(K)}, so λ² = (${n(4 * A * A)} + ${n(B * B)}) ÷ (16 × ${n(K)}) = ${n(L2)} ÷ ${n(16 * K)} and λ = ${n(lam)} or λ = −${n(lam)}. With λ = ${n(lam)} the point is (${n(x0)}, ${n(y0)}) and f = ${n(A)} × ${par(x0)} + ${par(B)} × ${par(y0)} = ${n(top)}; with λ = −${n(lam)} the point is (${n(-x0)}, ${n(-y0)}) and f = −${n(top)}. The largest value is ${n(top)} degrees, where λ = ${n(lam)}.`,
  guidance: [
   { prompt: `From ∇f = λ∇g: ${n(A)} = 2λx and ${n(B)} = 8λy. Put x = ${n(A)} ÷ (2λ) and y = ${n(B)} ÷ (8λ) into x² + 4y² = ${n(K)}. What is the positive value of λ?`, answer: [lam], explanation: `${n(A * A)} ÷ (4λ²) + 4 × ${n(B * B)} ÷ (64λ²) = ${n(K)}, which is ${n(L2)} ÷ (16λ²) = ${n(K)}, so λ² = ${n(L2)} ÷ ${n(16 * K)}. The positive square root is λ = ${n(lam)}.` },
   { prompt: `With λ = ${n(lam)}, where is the trolley? Enter x, then y.`, answer: [x0, y0], explanation: `x = ${n(A)} ÷ (2 × ${n(lam)}) = ${n(x0)} and y = ${n(B)} ÷ (8 × ${n(lam)}) = ${n(y0)}. Check: ${par(x0)}² + 4 × ${par(y0)}² = ${n(K)}.` },
   { prompt: `What does the trolley read at (${n(x0)}, ${n(y0)})?`, answer: [top], explanation: `f = ${n(A)} × ${par(x0)} + ${par(B)} × ${par(y0)} = ${n(top)}. The other point, (${n(-x0)}, ${n(-y0)}), gives −${n(top)}, so ${n(top)} is the largest value on the walkway.` }
  ] }; }
});

/* Drift directions of length 5. */
const DRIFT = [[3, 4], [4, 3], [-3, 4], [3, -4], [-4, 3], [4, -3], [-3, -4], [-4, -3]];

/* ---- q23 Chapter review: best values on the plain [4.6, 4.7] ---- */

/* A quadratic field with its one critical point at (p, q) and a point P = (p + u, q + v) where both gradient components are non-zero and the gradient has a whole
   length of at most 40. The gradient at P is the Hessian times (u, v). `want` is the code of the critical point, or 0 for any; the q23 numbers are never drawn. */
const plain = (R, want) => { let p; do { p = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), p: R.int(-3, 3), q: R.int(-3, 3), k: R.int(5, 25), u: R.int(-3, 3), v: R.int(-3, 3) }; }
 while ((p.p === 0 && p.q === 0) || (p.u === 0 && p.v === 0) || 4 * p.a * p.c === p.b * p.b || 2 * p.a * p.u + p.b * p.v === 0 || p.b * p.u + 2 * p.c * p.v === 0
  || !isSq((2 * p.a * p.u + p.b * p.v) ** 2 + (p.b * p.u + 2 * p.c * p.v) ** 2) || Math.hypot(2 * p.a * p.u + p.b * p.v, p.b * p.u + 2 * p.c * p.v) > 40
  || (want && codeOf(4 * p.a * p.c - p.b * p.b, p.a) !== want) || [plainNums(p).fc, plainNums(p).fP, plainNums(p).fc - plainNums(p).fP].some(x => Math.abs(x) === 1) || (p.a === -3 && p.b === -3 && p.c === -1 && p.p === 1 && p.q === 2)); return p; };
/* The numbers every q23 practice build needs. */
const plainNums = ({ a, b, c, p, q, k, u, v }) => { const Q = quad({ a, b, c, p, q, k }), Px = p + u, Py = q + v, gx = 2 * a * Px + b * Py + Q.d, gy = b * Px + 2 * c * Py + Q.e;
 return { Q, Px, Py, gx, gy, rate: Math.hypot(gx, gy), fc: Q.value(p, q), fP: Q.value(Px, Py) }; };

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'The rover on the plain',
 brief: 'A rover is parked on the plain, and the crew want its steepest climb, and the kind of place the plain’s one flat spot is.',
 labels: ['code', 'height (m)', 'steepest slope (m/km)'], tolerance: 0.01,
 gl: [['x (km)', 'y (km)'], ['D', 'code'], ['height (m)'], ['f_x at P', 'f_y at P', 'steepest slope (m/km)']]
}, {
 /* As the q23 field, in a new setting, asking the code and the height first and the steepest slope last; the kind of point is drawn first so each code
    is a third of the draws. Not the q23 numbers. */
 canonical: { a: 1, b: -3, c: 3, p: 1, q: 0, k: 18, u: -1, v: 2 },
 draw: R => plain(R, R.int(1, 3)),
 build: P => { const { Q, Px, Py, gx, gy, rate, fc } = plainNums(P), { a, b, c, p, q } = P; return {
  prompt: `A rover is parked at the point P(${n(Px)}, ${n(Py)}) on a plain whose ground height is f(x, y) = ${Q.f} metres, with x and y in kilometres east and north of the base. The plain has exactly one critical point. Enter its code (1 for a local maximum, 2 for a local minimum, 3 for a saddle point), then the ground height there in metres. Then enter the steepest slope the rover could climb from P, in metres per kilometre.`,
  answer: [Q.code, fc, rate],
  hints: ['For the critical point, set f_x = 0 and f_y = 0 and solve. Classify it with D = f_xx f_yy − (f_xy)² and the sign of f_xx, then put its coordinates into f for the height.', 'The steepest slope at P is the length of the gradient there: √(f_x² + f_y²), with both partial derivatives worked out at P, not at the critical point.'],
  solution: `f_x = ${Q.fx} and f_y = ${Q.fy}. Both are 0 at (${n(p)}, ${n(q)}), the critical point. There f_xx = ${n(2 * a)}, f_yy = ${n(2 * c)} and f_xy = ${n(b)}, so D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}. The height there is f(${n(p)}, ${n(q)}) = ${n(fc)} metres. At P, f_x = ${n(gx)} and f_y = ${n(gy)}, so ∇f = ⟨${n(gx)}, ${n(gy)}⟩ and the steepest slope is its length, √(${n(gx * gx)} + ${n(gy * gy)}) = ${n(rate)} metres per kilometre.`,
  guidance: [
   { prompt: `Set f_x = 0 and f_y = 0 for f(x, y) = ${Q.f} and solve. Where is the critical point?`, answer: [p, q], explanation: `f_x = ${Q.fx} and f_y = ${Q.fy}. Both equations hold at x = ${n(p)}, y = ${n(q)}.` },
   { prompt: 'What are the discriminant D = f_xx f_yy − (f_xy)² and the code (1 maximum, 2 minimum, 3 saddle point)?', answer: [Q.D, Q.code], explanation: `D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}.` },
   { prompt: `What is the ground height f(${n(p)}, ${n(q)}) at the critical point?`, answer: [fc], explanation: `Putting x = ${n(p)} and y = ${n(q)} into f gives ${n(fc)} metres.` },
   { prompt: `What are f_x and f_y at P(${n(Px)}, ${n(Py)}), and how long is the gradient ⟨f_x, f_y⟩ there? That length is the steepest slope.`, answer: [gx, gy, rate], explanation: `Putting x = ${n(Px)} and y = ${n(Py)} gives f_x = ${n(gx)} and f_y = ${n(gy)}. The length is √(${n(gx * gx)} + ${n(gy * gy)}) = √${n(rate * rate)} = ${n(rate)} metres per kilometre.` }
  ] }; }
});

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'The climb to the hilltop',
 brief: 'A rover camp sits on the slope of a hill, and the crew want the steepest ground at camp and the height they must climb to reach the top.',
 labels: ['steepest slope (m/km)', 'x (km)', 'y (km)', 'climb (m)'], tolerance: 0.01,
 gl: [['f_x at P', 'f_y at P', 'steepest slope (m/km)'], ['x (km)', 'y (km)'], ['climb (m)']]
}, {
 /* The plain is a hill: a < 0 and D > 0, so the one critical point is a local maximum and the climb f(top) − f(P) is positive. Not the q23 numbers. */
 canonical: { a: -3, b: -2, c: -2, p: -2, q: -2, k: 25, u: -2, v: 3 },
 draw: R => plain(R, 1),
 build: P => { const { Q, Px, Py, gx, gy, rate, fc, fP } = plainNums(P), { a, b, c, p, q } = P, climb = fc - fP; return {
  prompt: `A rover camp sits at the point P(${n(Px)}, ${n(Py)}) on the slope of a hill whose ground height is h(x, y) = ${Q.f} metres, with x and y in kilometres east and north of the base. The hill has exactly one critical point, its top. Enter the steepest slope at the camp, the greatest rate of increase of h at P, in metres per kilometre. Then enter the x-coordinate and the y-coordinate of the top, and the height the crew must climb to get from the camp to the top, in metres.`,
  answer: [rate, p, q, climb],
  hints: ['The steepest slope at P is the length of the gradient there: √(h_x² + h_y²), with both partial derivatives worked out at P.', 'The top is where h_x = 0 and h_y = 0, so solve those two equations together. The climb is the height at the top minus the height at P.'],
  solution: `h_x = ${Q.fx} and h_y = ${Q.fy}. At P they are ${n(gx)} and ${n(gy)}, so ∇h = ⟨${n(gx)}, ${n(gy)}⟩ and the steepest slope is √(${n(gx * gx)} + ${n(gy * gy)}) = ${n(rate)} metres per kilometre. Both partial derivatives are 0 at (${n(p)}, ${n(q)}), the top. The height there is h(${n(p)}, ${n(q)}) = ${n(fc)} metres and the height at the camp is h(${n(Px)}, ${n(Py)}) = ${n(fP)} metres, so the crew must climb ${n(fc)} − ${par(fP)} = ${n(climb)} metres.`,
  guidance: [
   { prompt: `What are h_x and h_y at P(${n(Px)}, ${n(Py)}), and how long is the gradient ⟨h_x, h_y⟩ there?`, answer: [gx, gy, rate], explanation: `h_x = ${Q.fx} and h_y = ${Q.fy}. Putting in x = ${n(Px)} and y = ${n(Py)} gives ${n(gx)} and ${n(gy)}. The length is √(${n(gx * gx)} + ${n(gy * gy)}) = ${n(rate)} metres per kilometre.` },
   { prompt: 'Set h_x = 0 and h_y = 0 and solve. Where is the top of the hill?', answer: [p, q], explanation: `Both equations hold at x = ${n(p)}, y = ${n(q)}.` },
   { prompt: `Work out the heights at the top and at the camp, h(${n(p)}, ${n(q)}) and h(${n(Px)}, ${n(Py)}). How many metres is the climb between them?`, answer: [climb], explanation: `h(${n(p)}, ${n(q)}) = ${n(fc)} and h(${n(Px)}, ${n(Py)}) = ${n(fP)}, so the climb is ${n(fc)} − ${par(fP)} = ${n(climb)} metres.` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q19', title: 'The drifting survey balloon',
 brief: 'A survey balloon is about to drift across the plain, and the crew want its best rate of warming, its rate along its drift, and the plain’s flat spot.',
 labels: ['greatest rate (°C/km)', 'rate along the drift (°C/km)', 'code', 'temperature (°C)'], tolerance: 0.01,
 gl: [['f_x at P', 'f_y at P'], ['greatest rate (°C/km)', 'rate along the drift (°C/km)'], ['x (km)', 'y (km)'], ['D', 'code', 'temperature (°C)']]
}, {
 /* As the q23 field, with the q19 directional derivative: the drift direction ⟨3, 4⟩ or ⟨4, 3⟩ in any signs has length 5, so the rate along it is
    (u1 f_x + u2 f_y) ÷ 5, a multiple of 0.1, and it is never 0. Not the q23 numbers. */
 canonical: { a: -3, b: -2, c: -2, p: -2, q: -2, k: 25, u: -2, v: 3, dir: 0 },
 draw: R => { let p; do { p = { ...plain(R, 0), dir: R.int(0, 7) }; const D = DRIFT[p.dir], g = plainNums(p); if ((D[0] * g.gx + D[1] * g.gy) !== 0) break; } while (true); return p; },
 build: P => { const { Q, Px, Py, gx, gy, rate, fc } = plainNums(P), { a, b, c, p, q } = P, [d1, d2] = DRIFT[P.dir], dd = (d1 * gx + d2 * gy) / 5; return {
  prompt: `A survey balloon hangs over the point P(${n(Px)}, ${n(Py)}) of a plain whose air temperature is f(x, y) = ${Q.f} degrees Celsius, with x and y in kilometres east and north of the mast. Enter the greatest rate of increase of the temperature at P, in degrees per kilometre. The balloon then drifts in the direction ${ang([d1, d2])}: enter the rate of change of the temperature at P along that direction, in degrees per kilometre (a decimal is fine). The field has exactly one critical point: enter its code (1 for a local maximum, 2 for a local minimum, 3 for a saddle point), then the temperature there.`,
  answer: [rate, dd, Q.code, fc],
  hints: ['The greatest rate of increase at P is the length of the gradient there, √(f_x² + f_y²). The rate along a direction is the dot product of ∇f with the unit vector of that direction, which is the direction divided by its own length.', 'For the critical point, set f_x = 0 and f_y = 0 and solve. Classify it with D = f_xx f_yy − (f_xy)² and the sign of f_xx, then put its coordinates into f.'],
  solution: `f_x = ${Q.fx} and f_y = ${Q.fy}. At P they are ${n(gx)} and ${n(gy)}, so ∇f = ⟨${n(gx)}, ${n(gy)}⟩ and its length is √(${n(gx * gx)} + ${n(gy * gy)}) = ${n(rate)} degrees per kilometre. The direction ${ang([d1, d2])} has length 5, so its unit vector is ⟨${n(d1 / 5)}, ${n(d2 / 5)}⟩ and the rate along it is ${n(gx)} × ${par(d1 / 5)} + ${par(gy)} × ${par(d2 / 5)} = ${n(dd)} degrees per kilometre. Both partial derivatives are 0 at (${n(p)}, ${n(q)}), the critical point. There f_xx = ${n(2 * a)}, f_yy = ${n(2 * c)} and f_xy = ${n(b)}, so D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}. The temperature there is f(${n(p)}, ${n(q)}) = ${n(fc)} °C.`,
  guidance: [
   { prompt: `What are f_x and f_y at P(${n(Px)}, ${n(Py)})?`, answer: [gx, gy], explanation: `f_x = ${Q.fx} and f_y = ${Q.fy}. Putting in x = ${n(Px)} and y = ${n(Py)} gives ${n(gx)} and ${n(gy)}.` },
   { prompt: `How long is the gradient ⟨${n(gx)}, ${n(gy)}⟩? Then take its dot product with the unit vector of the drift, ⟨${n(d1 / 5)}, ${n(d2 / 5)}⟩ (the direction divided by its length 5).`, answer: [rate, dd], explanation: `The length is √(${n(gx * gx)} + ${n(gy * gy)}) = ${n(rate)} degrees per kilometre. The dot product is ${n(gx)} × ${par(d1 / 5)} + ${par(gy)} × ${par(d2 / 5)} = ${n(dd)} degrees per kilometre.` },
   { prompt: 'Set f_x = 0 and f_y = 0 and solve. Where is the critical point?', answer: [p, q], explanation: `Both equations hold at x = ${n(p)}, y = ${n(q)}.` },
   { prompt: 'What are the discriminant D = f_xx f_yy − (f_xy)², the code (1 maximum, 2 minimum, 3 saddle point), and the temperature at the critical point?', answer: [Q.D, Q.code, fc], explanation: `D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}. Putting x = ${n(p)} and y = ${n(q)} into f gives ${n(fc)} °C.` }
  ] }; }
});

/* ---- q24 Double integrals over rectangles [5.1] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'Sealant on the hull plate',
 brief: 'A hull plate is about to get a coat of sealant that thickens towards one corner, and the stores need the mass of sealant to issue.',
 labels: ['mass (kg)', 'average density (kg/m²)'], tolerance: 0.01,
 gl: [['A', 'B'], ['mass (kg)'], ['plate area (m²)', 'average density (kg/m²)']]
}, {
 /* σ = k + ax + by over [x1, x2] × [y1, y2] with each side even, so the averages of x and y are whole and the average density is whole. Not q24's form (d + cxy). */
 canonical: { k: 3, a: 2, b: 1, x1: 1, x2: 5, y1: 0, y2: 4 },
 draw: R => { const p = { k: R.int(1, 6), a: R.int(1, 4), b: R.int(1, 4), x1: R.int(0, 3), y1: R.int(0, 3) }; p.x2 = p.x1 + 2 * R.int(1, 3); p.y2 = p.y1 + 2 * R.int(1, 2); return p; },
 build: ({ k, a, b, x1, x2, y1, y2 }) => { const dx = x2 - x1, dy = y2 - y1, Sx = (x2 * x2 - x1 * x1) / 2, Sy = (y2 * y2 - y1 * y1) / 2, A = k * dx + a * Sx, B = b * dx, V = A * dy + B * Sy, area = dx * dy, avg = V / area,
  s = poly([[k, ''], [a, 'x'], [b, 'y']]), inn = poly([[A, ''], [B, 'y']]); return {
  prompt: `A rectangular hull plate at Dome Works gets a coat of sealant that is thicker towards its far corner. Across the plate x runs from ${n(x1)} to ${n(x2)} metres and y from ${n(y1)} to ${n(y2)} metres, and the coat has density σ(x, y) = ${s} kilograms per square metre at the point (x, y). Enter the mass of sealant on the plate, the double integral of σ over the plate, in kilograms (type it without commas), then the average density in kilograms per square metre.`,
  answer: [V, avg],
  hints: ['Work from the inside out. Integrate σ with respect to x across the plate, holding y fixed as if it were a number. Then integrate the result with respect to y.', 'The average density is the mass divided by the area of the plate.'],
  solution: `Inside: the integral of ${s} with respect to x from ${n(x1)} to ${n(x2)} is ${times1(k)}${n(dx)} + ${times1(a)}${n(Sx)} + ${times1(b)}${n(dx)} × y = ${inn}, because the integral of x from ${n(x1)} to ${n(x2)} is (${n(x2 * x2)} − ${n(x1 * x1)}) ÷ 2 = ${n(Sx)}. Outside: the integral of ${inn} with respect to y from ${n(y1)} to ${n(y2)} is ${n(A)} × ${n(dy)} + ${n(B)} × ${n(Sy)} = ${n(V)} kilograms. The plate area is ${n(dx)} × ${n(dy)} = ${n(area)} square metres, so the average density is ${n(V)} ÷ ${n(area)} = ${n(avg)} kilograms per square metre.`,
  guidance: [
   { prompt: `Integrate σ with respect to x from x = ${n(x1)} to x = ${n(x2)}, holding y fixed. The result has the form A + By: enter A, then B.`, answer: [A, B], explanation: `The ${n(k)} gives ${n(k)} × ${n(dx)} = ${n(k * dx)}, the ${poly([[a, 'x']])} gives ${n(a)} × (${n(x2 * x2)} − ${n(x1 * x1)}) ÷ 2 = ${n(a * Sx)}, so A = ${n(A)}. The ${poly([[b, 'y']])} is a constant while x varies, so it gives ${n(b)} × ${n(dx)} × y and B = ${n(B)}.` },
   { prompt: `Now integrate ${inn} with respect to y from y = ${n(y1)} to y = ${n(y2)}. What is the mass, in kilograms?`, answer: [V], explanation: `${n(A)} × ${n(dy)} + ${n(B)} × (${n(y2 * y2)} − ${n(y1 * y1)}) ÷ 2 = ${n(A * dy)} + ${n(B * Sy)} = ${n(V)} kilograms.` },
   { prompt: 'What is the plate area, and the average density?', answer: [area, avg], explanation: `The plate is ${n(dx)} by ${n(dy)} metres, an area of ${n(area)} square metres, and ${n(V)} ÷ ${n(area)} = ${n(avg)} kilograms per square metre.` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Dust on the landing pad',
 brief: 'A dust storm has laid a layer over the landing pad, and the cleaning crew need to know how much there is and what clearing it will cost.',
 labels: ['dust (L)', 'cost (credits)'], tolerance: 0.01,
 gl: [['A', 'B'], ['dust (L)'], ['cost (credits)']]
}, {
 /* Thickness t = e + ax² + by millimetres over [x1, x1 + 3] × [y1, y1 + dy], dy even: the integral of x² over a width-3 range is whole, and so is the integral of y.
    1 mm over 1 m² is 1 litre. Not q24's form (d + cxy). */
 canonical: { e: 4, a: 1, b: 2, x1: 1, y1: 0, dy: 4, w: 3 },
 draw: R => ({ e: R.int(2, 8), a: R.int(1, 2), b: R.int(1, 3), x1: R.int(0, 3), y1: R.int(0, 3), dy: 2 * R.int(1, 3), w: R.int(2, 5) }),
 build: ({ e, a, b, x1, y1, dy, w }) => { const dx = 3, x2 = x1 + dx, y2 = y1 + dy, S3 = (x2 ** 3 - x1 ** 3) / 3, Sy = (y2 * y2 - y1 * y1) / 2, A = e * dx + a * S3, B = b * dx, V = A * dy + B * Sy, cost = w * V,
  t = poly([[e, ''], [a, 'x²'], [b, 'y']]), inn = poly([[A, ''], [B, 'y']]); return {
  prompt: `A dust storm has laid a layer of regolith over a rectangular landing pad at Dome Works. Across the pad x runs from ${n(x1)} to ${n(x2)} metres and y from ${n(y1)} to ${n(y2)} metres, and the layer is t(x, y) = ${t} millimetres thick at the point (x, y). One square metre of dust 1 millimetre thick is 1 litre. The crew clear it at ${cr(w)} per litre. Enter the volume of dust on the pad in litres, then the cost of clearing it in credits (type both without commas).`,
  answer: [V, cost],
  hints: ['Work from the inside out. Integrate the thickness with respect to x across the pad, holding y fixed as if it were a number; the integral of x² is x³ ÷ 3. Then integrate the result with respect to y.', 'The cost is the price per litre times the number of litres.'],
  solution: `Inside: the integral of ${t} with respect to x from ${n(x1)} to ${n(x2)} is ${times1(e)}${n(dx)} + ${times1(a)}(${n(x2 ** 3)} − ${n(x1 ** 3)}) ÷ 3 + ${times1(b)}${n(dx)} × y = ${inn}. Outside: the integral of ${inn} with respect to y from ${n(y1)} to ${n(y2)} is ${n(A)} × ${n(dy)} + ${n(B)} × (${n(y2 * y2)} − ${n(y1 * y1)}) ÷ 2 = ${n(A * dy)} + ${n(B * Sy)} = ${n(V)} litres. The cost is ${n(w)} × ${n(V)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Integrate the thickness with respect to x from x = ${n(x1)} to x = ${n(x2)}, holding y fixed. The result has the form A + By: enter A, then B.`, answer: [A, B], explanation: `The ${n(e)} gives ${n(e)} × ${n(dx)} = ${n(e * dx)} and the ${poly([[a, 'x²']])} gives ${n(a)} × (${n(x2 ** 3)} − ${n(x1 ** 3)}) ÷ 3 = ${n(a * S3)}, so A = ${n(A)}. The ${poly([[b, 'y']])} gives ${n(b)} × ${n(dx)} × y, so B = ${n(B)}.` },
   { prompt: `Now integrate ${inn} with respect to y from y = ${n(y1)} to y = ${n(y2)}. How many litres of dust is that?`, answer: [V], explanation: `${n(A)} × ${n(dy)} + ${n(B)} × (${n(y2 * y2)} − ${n(y1 * y1)}) ÷ 2 = ${n(A * dy)} + ${n(B * Sy)} = ${n(V)} litres.` },
   { prompt: `Clearing costs ${cr(w)} per litre. What is the cost of clearing ${n(V)} litres, in credits?`, answer: [cost], explanation: `${n(w)} × ${n(V)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', title: 'The foundry heater plate',
 brief: 'The foundry has a rectangular heater plate whose output swells with distance, and the power room wants its total and its average output.',
 labels: ['total power (W)', 'average power (W/m²)'], tolerance: 0.01,
 gl: [['P', 'Q'], ['total power (W)'], ['plate area (m²)', 'average power (W/m²)']]
}, {
 /* p = cx²y + ey + d over [x1, x1 + dx] × [y1, y1 + dy], dx 3 or 6 (so the integral of x² is whole) and dy even; the average has at most 2 decimals and the total stays below 10000.
    The integrand has an x² in it, which q24's xy does not. */
 canonical: { c: 2, e: 1, d: 3, x1: 1, dx: 3, y1: 0, dy: 2 },
 draw: R => { let p, V, avg; do { p = { c: R.int(1, 3), e: R.int(1, 3), d: R.int(1, 6), x1: R.int(0, 2), dx: R.pick([3, 6]), y1: R.int(0, 2), dy: R.pick([2, 4]) };
  const x2 = p.x1 + p.dx, y2 = p.y1 + p.dy, S3 = (x2 ** 3 - p.x1 ** 3) / 3, Sy = (y2 * y2 - p.y1 * p.y1) / 2; V = p.c * S3 * Sy + p.e * p.dx * Sy + p.d * p.dx * p.dy; avg = V / (p.dx * p.dy); } while (!dec(avg, 2) || V >= 10000); return p; },
 build: ({ c, e, d, x1, dx, y1, dy }) => { const x2 = x1 + dx, y2 = y1 + dy, S3 = (x2 ** 3 - x1 ** 3) / 3, Sy = (y2 * y2 - y1 * y1) / 2, P = c * S3 + e * dx, Q = d * dx, V = P * Sy + Q * dy, area = dx * dy, avg = V / area,
  h = poly([[c, 'x²y'], [e, 'y'], [d, '']]), inn = poly([[P, 'y'], [Q, '']]); return {
  prompt: `A heater plate in the Dome Works foundry is a rectangle. Across the plate x runs from ${n(x1)} to ${n(x2)} metres and y from ${n(y1)} to ${n(y2)} metres, and at the point (x, y) it gives out power at p(x, y) = ${h} watts per square metre. Enter the total power of the plate, the double integral of p over the plate, in watts (type it without commas), then the average power per square metre (a decimal is fine).`,
  answer: [V, avg],
  hints: ['Work from the inside out. Integrate p with respect to x, holding y fixed: the integral of x² is x³ ÷ 3, and any factor of y stays in front. Then integrate the result with respect to y.', 'The average is the total divided by the area of the plate.'],
  solution: `Inside: the integral of ${h} with respect to x from ${n(x1)} to ${n(x2)} is ${times1(c)}(${n(x2 ** 3)} − ${n(x1 ** 3)}) ÷ 3 × y + ${times1(e)}${n(dx)} × y + ${times1(d)}${n(dx)} = ${inn}. Outside: the integral of ${inn} with respect to y from ${n(y1)} to ${n(y2)} is ${n(P)} × (${n(y2 * y2)} − ${n(y1 * y1)}) ÷ 2 + ${n(Q)} × ${n(dy)} = ${n(P * Sy)} + ${n(Q * dy)} = ${n(V)} watts. The plate area is ${n(dx)} × ${n(dy)} = ${n(area)} square metres, so the average is ${n(V)} ÷ ${n(area)} = ${n(avg)} watts per square metre.`,
  guidance: [
   { prompt: `Integrate p with respect to x from x = ${n(x1)} to x = ${n(x2)}, holding y fixed. The result has the form Py + Q: enter P, then Q.`, answer: [P, Q], explanation: `The ${poly([[c, 'x²y']])} gives ${n(c)} × (${n(x2 ** 3)} − ${n(x1 ** 3)}) ÷ 3 × y = ${n(c * S3)}y and the ${poly([[e, 'y']])} gives ${n(e)} × ${n(dx)} × y = ${n(e * dx)}y, so P = ${n(P)}. The ${n(d)} gives ${n(d)} × ${n(dx)}, so Q = ${n(Q)}.` },
   { prompt: `Now integrate ${inn} with respect to y from y = ${n(y1)} to y = ${n(y2)}. What is the total power, in watts?`, answer: [V], explanation: `${n(P)} × (${n(y2 * y2)} − ${n(y1 * y1)}) ÷ 2 + ${n(Q)} × ${n(dy)} = ${n(P * Sy)} + ${n(Q * dy)} = ${n(V)} watts.` },
   { prompt: 'What is the plate area, and the average power per square metre?', answer: [area, avg], explanation: `The plate is ${n(dx)} by ${n(dy)} metres, an area of ${n(area)} square metres, and ${n(V)} ÷ ${n(area)} = ${n(avg)} watts per square metre.` }
  ] }; }
});

/* ---- q25 Double integrals over general regions; switching the order [5.2] ---- */

mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'The regolith bowl bed',
 brief: 'A bowl-shaped bed of regolith is going in at the garden dome, and the stores want the litres while the drafting robot wants the limits the other way round.',
 labels: ['material (L)', 'top limit of x (m)', 'y where it starts (m)'], tolerance: 0.01,
 gl: [['top limit of x (m)'], ['material (L)'], ['y where it starts (m)']]
}, {
 /* The region x ≥ 0, cx² ≤ y ≤ H with H = cs². Thickness kx. Sideways (y outside, x from 0 to √(y ÷ c)): the inner integral is ky ÷ (2c), the litres are kH² ÷ (4c) = kcs⁴ ÷ 4 (kept whole).
    Switched: x from 0 to s, and y from cx² to H. The asked starting height is c × x1². Not q25's region (x-axis, a line and y = cx²). */
 canonical: { c: 2, s: 3, k: 2, x1: 2 },
 draw: R => { let p; do { p = { c: R.int(1, 4), s: R.int(2, 3), k: R.int(2, 6) }; p.x1 = R.int(1, p.s - 1); } while ((p.k * p.c * Math.pow(p.s, 4)) % 4 !== 0); return p; },
 build: ({ c, s, k, x1 }) => { const H = c * s * s, V = k * c * Math.pow(s, 4) / 4, y1 = c * x1 * x1, curve = poly([[c, 'x²']]), th = poly([[k, 'x']]), root = c === 1 ? '√y' : `√(y ÷ ${n(c)})`; return {
  prompt: `A bowl-shaped bed of regolith is laid out flat at the garden dome. It is the region to the right of the y-axis (where x is at least 0), above the curve y = ${curve} and below the line y = ${n(H)}, measured in metres. The regolith is spread ${th} millimetres thick at the point (x, y), and 1 millimetre thick over 1 square metre is 1 litre. Enter the litres of regolith needed, the double integral of the thickness over the bed (type it without commas). Then switch the order so that y is integrated first: enter the top limit of x, then the value of y where the inner integral starts at x = ${n(x1)}.`,
  answer: [V, s, y1],
  hints: ['Read the region sideways: y runs from 0 to the top line, and for each y, x runs from the y-axis to the curve. Solve the curve’s equation for x to get that limit, and integrate the thickness with respect to x first.', 'To switch, the top limit of x is where the curve meets the top line. For each x, y runs from the curve up to the top line, so the inner integral starts on the curve.'],
  solution: `Sideways: for each y from 0 to ${n(H)}, x runs from 0 to the curve, x = ${root}. Inside: the integral of ${th} with respect to x from 0 to ${root} is ${n(k)} × ${c === 1 ? 'y' : `(y ÷ ${n(c)})`} ÷ 2 = ${n(k)}y ÷ ${n(2 * c)}. Outside: the integral of ${n(k)}y ÷ ${n(2 * c)} from 0 to ${n(H)} is ${n(k)} × ${n(H * H)} ÷ ${n(4 * c)} = ${n(V)} litres. Switched: the curve meets the line y = ${n(H)} where ${curve} = ${n(H)}, so x = ${n(s)}, and x runs from 0 to ${n(s)}. For each x, y runs from the curve up to ${n(H)}, so at x = ${n(x1)} the inner integral starts at y = ${c === 1 ? '' : n(c) + ' × '}${n(x1)}² = ${n(y1)}.`,
  guidance: [
   { prompt: `The curve y = ${curve} meets the top line y = ${n(H)}. What is x there? That is the top limit of x.`, answer: [s], explanation: `${curve} = ${n(H)} gives x² = ${n(s * s)}, so x = ${n(s)}.` },
   { prompt: `Read the region sideways: for each y from 0 to ${n(H)}, x runs from 0 to ${root}. Integrate the thickness with respect to x, then with respect to y. How many litres is that?`, answer: [V], explanation: `The inner integral is ${n(k)}y ÷ ${n(2 * c)}. The integral of y from 0 to ${n(H)} is ${n(H * H)} ÷ 2, so ${n(k)} × ${n(H * H)} ÷ ${n(4 * c)} = ${n(V)} litres.` },
   { prompt: `With y inside, at x = ${n(x1)} the inner integral starts on the curve. What is y there?`, answer: [y1], explanation: `y = ${curve.replace('x²', n(x1) + '²')} = ${n(y1)}, and it runs up to ${n(H)}.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'The heat-shield triangle',
 brief: 'A triangular heat-shield panel gets a coating that thickens away from its tall edge, and the stores need the mass of coating.',
 labels: ['tall edge height (m)', 'mass (kg)'], tolerance: 0.01,
 gl: [['tall edge (m)', 'strip at x1 (m)'], ['A', 'B'], ['mass (kg)']]
}, {
 /* The triangle with corners (0, 0), (a, 0) and (0, ma): the slanting edge is y = ma − mx. Density kx, so the inner integral is kx(ma − mx) = kma x − km x², and the mass is kma³ ÷ 6, kept whole.
    The x1 in the first step is between 1 and a − 1. Not q25's region. */
 canonical: { a: 4, m: 2, k: 3, x1: 1 },
 draw: R => { let p; do { p = { a: R.int(3, 7), m: R.int(1, 4), k: R.int(1, 5) }; p.x1 = R.int(1, p.a - 1); } while ((p.k * p.m * Math.pow(p.a, 3)) % 6 !== 0); return p; },
 build: ({ a, m, k, x1 }) => { const H = m * a, mass = k * m * Math.pow(a, 3) / 6, strip = m * (a - x1), edge = poly([[H, ''], [-m, 'x']]), A = k * m * a, B = k * m, th = poly([[k, 'x']]), inn = poly([[A, 'x'], [-B, 'x²']]); return {
  prompt: `A triangular heat-shield panel at Dome Works is laid flat. It is the region between the x-axis, the y-axis and the slanting line y = ${edge}, measured in metres. The coating has density ${th} kilograms per square metre at the point (x, y), so it is heavier away from the y-axis. Enter the height of the panel’s tall edge along the y-axis, in metres, then the mass of the coating in kilograms (type it without commas).`,
  answer: [H, mass],
  hints: ['The panel is a type I region: x runs from 0 to where the slanting line meets the x-axis, and for each x, y runs from 0 up to the line. The tall edge is where the line is highest.', 'Integrate the density with respect to y first, from 0 to the line, holding x fixed. Then integrate the result with respect to x between the two number limits.'],
  solution: `The line meets the x-axis where ${edge} = 0, at x = ${n(a)}, so x runs from 0 to ${n(a)}. At x = 0 it is at y = ${n(H)}, the height of the tall edge. For each x, y runs from 0 to ${edge}. Inside: the integral of ${th} with respect to y from 0 to ${edge} is ${th} × (${edge}) = ${inn}. Outside: the integral of ${inn} from 0 to ${n(a)} is ${n(A)} × ${n(a * a)} ÷ 2 − ${n(B)} × ${n(Math.pow(a, 3))} ÷ 3 = ${n(A * a * a / 2)} − ${n(B * Math.pow(a, 3) / 3)} = ${n(mass)} kilograms.`,
  guidance: [
   { prompt: `The slanting line is y = ${edge}. How high is it at x = 0, the tall edge, and at x = ${n(x1)}, the top of the strip there?`, answer: [H, strip], explanation: `At x = 0 the line is at ${n(H)}. At x = ${n(x1)} it is at ${n(H)} − ${n(m)} × ${n(x1)} = ${n(strip)}.` },
   { prompt: `For a fixed x, integrate the density ${th} with respect to y from 0 to ${edge}. The result has the form Ax − Bx²: enter A, then B.`, answer: [A, B], explanation: `The density does not change with y, so the inner integral is ${th} × (${edge}) = ${inn}, so A = ${n(A)} and B = ${n(B)}.` },
   { prompt: `Integrate ${inn} from x = 0 to x = ${n(a)}. What is the mass, in kilograms?`, answer: [mass], explanation: `The integral of x is x² ÷ 2 and of x² is x³ ÷ 3, so ${n(A)} × ${n(a * a)} ÷ 2 − ${n(B)} × ${n(Math.pow(a, 3))} ÷ 3 = ${n(A * a * a / 2)} − ${n(B * Math.pow(a, 3) / 3)} = ${n(mass)} kilograms.` }
  ] }; }
});

/* Lens shapes (c, s): the parabola y = x² and the line y = cx, with s² ÷ c whole and s < c, so the strip at the height y = s² runs from x = s² ÷ c to x = s. */
const LENS = [[4, 2], [8, 4], [9, 3], [9, 6], [12, 6], [16, 4], [16, 8], [18, 6], [18, 12]];

mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', title: 'The curved shield plate',
 brief: 'A shield plate is cut between a curve and a straight edge, and the stores want its mass while the drafting robot wants the strip limits the other way round.',
 labels: ['mass (kg)', 'x where it starts (m)', 'x where it ends (m)'], tolerance: 0.01,
 gl: [['A', 'B'], ['mass (kg)'], ['x where it starts (m)', 'x where it ends (m)']]
}, {
 /* The region between y = x² and y = cx, uniform density k: the mass is kc³ ÷ 6, kept whole. At the height y = s² the strip runs from the line, x = s² ÷ c, to the
    parabola, x = s. Two curved edges instead of one; not q25's region. */
 canonical: { lens: 0, k: 3 },
 draw: R => { let p; do { p = { lens: R.int(0, LENS.length - 1), k: R.int(2, 9) }; } while ((p.k * Math.pow(LENS[p.lens][0], 3)) % 6 !== 0); return p; },
 build: ({ lens, k }) => { const [c, s] = LENS[lens], ys = s * s, low = ys / c, mass = k * Math.pow(c, 3) / 6, kc = k * c, line = poly([[c, 'x']]); return {
  prompt: `A shield plate at Dome Works is laid flat. It is the region enclosed between the parabola y = x² and the straight line y = ${line}, measured in metres. The plate has the same density everywhere, ${n(k)} kilograms per square metre. Enter the mass of the plate, the double integral of the density over it (type it without commas). Then switch the order so that y is outside and x inside: at the height y = ${n(ys)}, enter the value of x where the inner integral starts, then the value of x where it ends.`,
  answer: [mass, low, s],
  hints: ['The two curves meet where x² = the line’s height, at x = 0 and one other value. Between them the line is above the parabola, so for each x, y runs from the parabola up to the line. Integrate with respect to y first.', 'To switch, fix a height y and solve each curve for x: the parabola gives x = √y and the line gives x = y ÷ (its slope). The strip runs from the smaller of the two to the larger.'],
  solution: `The curves meet where x² = ${line}, at x = 0 and x = ${n(c)}. Between them the line is above the parabola, so for each x, y runs from x² up to ${line}. Inside: the integral of ${n(k)} with respect to y from x² to ${line} is ${n(k)} × (${line} − x²) = ${poly([[kc, 'x'], [-k, 'x²']])}. Outside: the integral of ${poly([[kc, 'x'], [-k, 'x²']])} from 0 to ${n(c)} is ${n(kc)} × ${n(c * c)} ÷ 2 − ${n(k)} × ${n(Math.pow(c, 3))} ÷ 3 = ${n(kc * c * c / 2)} − ${n(k * Math.pow(c, 3) / 3)} = ${n(mass)} kilograms. Switched: at the height y = ${n(ys)} the line gives x = ${n(ys)} ÷ ${n(c)} = ${n(low)} and the parabola gives x = √${n(ys)} = ${n(s)}, so x runs from ${n(low)} to ${n(s)}.`,
  guidance: [
   { prompt: `The curves meet at x = 0 and x = ${n(c)}, with the line above. For a fixed x, integrate the density with respect to y from x² to ${line}. The result has the form Ax − Bx²: enter A, then B.`, answer: [kc, k], explanation: `The density does not change with y, so the inner integral is ${n(k)} × (${line} − x²) = ${poly([[kc, 'x'], [-k, 'x²']])}, so A = ${n(kc)} and B = ${n(k)}.` },
   { prompt: `Integrate ${poly([[kc, 'x'], [-k, 'x²']])} from x = 0 to x = ${n(c)}. What is the mass, in kilograms?`, answer: [mass], explanation: `${n(kc)} × ${n(c * c)} ÷ 2 − ${n(k)} × ${n(Math.pow(c, 3))} ÷ 3 = ${n(kc * c * c / 2)} − ${n(k * Math.pow(c, 3) / 3)} = ${n(mass)} kilograms.` },
   { prompt: `Read the region sideways. At the height y = ${n(ys)}, where does the strip start (on the line) and where does it end (on the parabola)?`, answer: [low, s], explanation: `Solving y = ${line} for x gives x = y ÷ ${n(c)} = ${n(low)}. Solving y = x² gives x = √y = ${n(s)}.` }
  ] }; }
});

})();
