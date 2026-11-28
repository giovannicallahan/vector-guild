/* Calculus 3: many variables mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A coefficient written in front of a product, left out when it is 1: times1(3) → '3 × ', times1(1) → ''. */
const times1 = c => c === 1 ? '' : `${n(c)} × `;
/* A sum of letter terms, skipping zeros and never writing a coefficient 1: poly([[2, 'x²'], [−1, 'xy'], [5, '']]) is '2x² − xy + 5'. */
const poly = terms => { let s = ''; for (const [c, x] of terms) { if (!c) continue; const m = Math.abs(c), body = m === 1 && x ? x : n(m) + x; s = s ? s + (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; } return s || '0'; };
/* A multiple of 1/3 as text: 21 or 19/3. */
const third = x => Number.isInteger(Math.round(x * 1e9) / 1e9) ? n(x) : `${n(Math.round(3 * x))}/3`;
/* k·π as text: 21π, or (52/3)π for a fraction. */
const kpi = x => Number.isInteger(Math.round(x * 1e9) / 1e9) ? `${n(x)}π` : `(${third(x)})π`;
/* Has at most k decimals. */
const dec = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-9;
const isSq = v => v > 0 && Number.isInteger(Math.sqrt(v));
/* q21, q23: f = ax² + bxy + cy² + dx + ey (+ k) with its only critical point at (p, q). */
const quad = ({ a, b, c, p, q, k = 0 }) => {
 const d = -(2 * a * p + b * q), e = -(b * p + 2 * c * q), D = 4 * a * c - b * b, code = D < 0 ? 3 : a > 0 ? 2 : 1;
 const verdict = D < 0 ? 'D is negative, so the point is a saddle point: code 3' : a > 0 ? 'D is positive and f_xx is positive, so the point is a local minimum: code 2' : 'D is positive and f_xx is negative, so the point is a local maximum: code 1';
 return { d, e, D, code, verdict, f: poly([[a, 'x²'], [b, 'xy'], [c, 'y²'], [d, 'x'], [e, 'y'], [k, '']]), fx: poly([[2 * a, 'x'], [b, 'y'], [d, '']]), fy: poly([[b, 'x'], [2 * c, 'y'], [e, '']]),
  value: (x, y) => a * x * x + b * x * y + c * y * y + d * x + e * y + k };
};
/* q26: angle ranges, an index into this list; w is the width in units of π. */
const ANG = [{ t1: '0', t2: 'π/2', w: 0.5, wt: 'π/2' }, { t1: '0', t2: 'π', w: 1, wt: 'π' }, { t1: 'π/2', t2: 'π', w: 0.5, wt: 'π/2' }, { t1: '0', t2: '2π', w: 2, wt: '2π' },
 { t1: 'π/4', t2: '3π/4', w: 0.5, wt: 'π/2' }, { t1: 'π', t2: '2π', w: 1, wt: 'π' }, { t1: '0', t2: '3π/2', w: 1.5, wt: '3π/2' }];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Critical point (p, q), never the origin; b ≠ 0 and D ≠ 0; the kind of point (code 1, 2 or 3) is drawn first, so each is a third of the draws. Not the worked example (x² + xy + y² − 3y, point (−1, 2)). */
 q21: {
  canonical: { a: 2, b: 2, c: -1, p: 1, q: 2 },
  draw: R => { const want = R.int(1, 3); let p, D; do { p = { a: R.nz(-4, 4), b: R.nz(-4, 4), c: R.nz(-4, 4), p: R.int(-3, 3), q: R.int(-3, 3) }; D = 4 * p.a * p.c - p.b * p.b; }
   while ((p.p === 0 && p.q === 0) || D === 0 || (D < 0 ? 3 : p.a > 0 ? 2 : 1) !== want || (p.a === 1 && p.b === 1 && p.c === 1)); return p; },
  build: ({ a, b, c, p, q }) => { const Q = quad({ a, b, c, p, q }); return {
   prompt: `The weather mast models the air temperature across the plain as f(x, y) = ${Q.f} degrees Celsius, where x and y are kilometres east and north of the mast. This field has exactly one critical point. Enter its x-coordinate, then its y-coordinate, then the discriminant D, then a code for what the point is: 1 for a local maximum, 2 for a local minimum, 3 for a saddle point.`,
   answer: [p, q, Q.D, Q.code],
   hints: ['A critical point is where f_x and f_y are both 0. Write the two partial derivatives, set each one equal to 0, and solve the two equations together.', 'D = f_xx f_yy − (f_xy)². If D is negative the point is a saddle point. If D is positive it is a minimum when f_xx is positive and a maximum when f_xx is negative.'],
   solution: `f_x = ${Q.fx} and f_y = ${Q.fy}. Setting both equal to 0 and solving the two equations together gives x = ${n(p)} and y = ${n(q)} (check: ${par(2 * a)} × ${par(p)} + ${par(b)} × ${par(q)} + ${par(Q.d)} = 0 and ${par(b)} × ${par(p)} + ${par(2 * c)} × ${par(q)} + ${par(Q.e)} = 0). The second partial derivatives are f_xx = ${n(2 * a)}, f_yy = ${n(2 * c)} and f_xy = ${n(b)}, so D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}.`,
   guidance: [
    { prompt: `Write f_x and f_y for f(x, y) = ${Q.f}, set both equal to 0 and solve. Where is the critical point?`, answer: [p, q], explanation: `f_x = ${Q.fx} and f_y = ${Q.fy}. Both are 0 at x = ${n(p)}, y = ${n(q)}, and nowhere else.` },
    { prompt: 'Differentiate again. What are the second partial derivatives f_xx, f_yy and f_xy?', answer: [2 * a, 2 * c, b], explanation: `f_xx is the x-derivative of f_x, which is ${n(2 * a)}; f_yy is the y-derivative of f_y, which is ${n(2 * c)}; f_xy is the y-derivative of f_x, which is ${n(b)}.` },
    { prompt: 'Work out the discriminant D = f_xx f_yy − (f_xy)², then the code: 1 for a local maximum, 2 for a local minimum, 3 for a saddle point.', answer: [Q.D, Q.code], explanation: `D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}.` }
   ] }; }
 },
 /* f = Ax + By on the circle x² + y² = r². (A, B) is a signed Pythagorean pair, the top point (rA ÷ L, rB ÷ L) has whole
    coordinates, λ = L ÷ (2r) has at most 3 decimals and the largest value rL stays below 1000. Not the worked example (x + y on x² + y² = 8). */
 q22: {
  canonical: { A: 3, B: 4, r: 10 },
  draw: R => { let p, L; do { const [u, v] = R.pick([[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6]]); p = { A: R.bool() ? u : -u, B: R.bool() ? v : -v, r: R.int(2, 26) }; L = Math.hypot(p.A, p.B); }
   while (!Number.isInteger(p.r * p.A / L) || !Number.isInteger(p.r * p.B / L) || !dec(L / (2 * p.r), 3) || p.r * L >= 1000 || (p.A === 3 && p.B === 4 && p.r === 10)); return p; },
  build: ({ A, B, r }) => { const L = Math.hypot(A, B), R2 = r * r, X = r * A / L, Y = r * B / L, top = r * L, lam = L / (2 * r); return {
   prompt: `A pressure sensor rides on a circular rail round the weather mast: its position (x, y), in metres from the mast, always satisfies x² + y² = ${n(R2)}. The pressure it reads there, in pascals above the mast’s own reading, is f(x, y) = ${poly([[A, 'x'], [B, 'y']])}. Use a Lagrange multiplier: enter the largest value of f on the rail, then the value of λ at the point where it happens (a decimal is fine).`,
   answer: [top, lam],
   hints: ['Take the constraint function g(x, y) = x² + y², so ∇g = ⟨2x, 2y⟩. The method says ∇f = λ∇g: each component of ∇f equals λ times the matching component of ∇g.', 'Write x and y in terms of λ, put them into the constraint and solve for λ. The two signs of λ give two points: work out f at both and keep the larger.'],
   solution: `∇f = ⟨${n(A)}, ${n(B)}⟩ and ∇g = ⟨2x, 2y⟩, so ${n(A)} = 2λx and ${n(B)} = 2λy, which give x = ${n(A)} ÷ (2λ) and y = ${n(B)} ÷ (2λ). Putting these into x² + y² = ${n(R2)} gives (${n(A * A)} + ${n(B * B)}) ÷ (4λ²) = ${n(R2)}, so λ² = ${n(L * L)} ÷ ${n(4 * R2)} and λ = ${n(lam)} or λ = −${n(lam)}. With λ = ${n(lam)} the point is (${n(X)}, ${n(Y)}) and f = ${n(A)} × ${par(X)} + ${par(B)} × ${par(Y)} = ${n(top)}; with λ = −${n(lam)} the point is (${n(-X)}, ${n(-Y)}) and f = −${n(top)}. The largest value is ${n(top)} pascals, where λ = ${n(lam)}.`,
   guidance: [
    { prompt: `From ∇f = λ∇g: ${n(A)} = 2λx and ${n(B)} = 2λy. Put x = ${n(A)} ÷ (2λ) and y = ${n(B)} ÷ (2λ) into x² + y² = ${n(R2)}. What is the positive value of λ?`, answer: [lam], explanation: `(${n(A * A)} + ${n(B * B)}) ÷ (4λ²) = ${n(R2)}, so 4λ² × ${n(R2)} = ${n(L * L)} and λ² = ${n(L * L)} ÷ ${n(4 * R2)}. The positive square root is λ = ${n(lam)}.` },
    { prompt: `With λ = ${n(lam)}, where is the sensor? Enter x, then y.`, answer: [X, Y], explanation: `x = ${n(A)} ÷ (2 × ${n(lam)}) = ${n(X)} and y = ${n(B)} ÷ (2 × ${n(lam)}) = ${n(Y)}. Check: ${par(X)}² + ${par(Y)}² = ${n(R2)}.` },
    { prompt: `What does the sensor read at (${n(X)}, ${n(Y)})?`, answer: [top], explanation: `f = ${n(A)} × ${par(X)} + ${par(B)} × ${par(Y)} = ${n(top)}. The other point, (${n(-X)}, ${n(-Y)}), gives −${n(top)}, so ${n(top)} is the largest value on the rail.` }
   ] }; }
 },
 /* Critical point (p, q) of a quadratic temperature field with constant term k, and a point P = (p + u, q + v) where
    both gradient components are non-zero and the gradient has a whole length (searched; about 1 draw in 20 passes). */
 q23: {
  canonical: { a: -3, b: -3, c: -1, p: 1, q: 2, k: 20, u: -2, v: -1 },
  draw: R => { let p; do { p = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), p: R.int(-3, 3), q: R.int(-3, 3), k: R.int(5, 25), u: R.int(-3, 3), v: R.int(-3, 3) }; }
   while ((p.p === 0 && p.q === 0) || (p.u === 0 && p.v === 0) || 4 * p.a * p.c === p.b * p.b || 2 * p.a * p.u + p.b * p.v === 0 || p.b * p.u + 2 * p.c * p.v === 0 || !isSq((2 * p.a * p.u + p.b * p.v) ** 2 + (p.b * p.u + 2 * p.c * p.v) ** 2) || Math.hypot(2 * p.a * p.u + p.b * p.v, p.b * p.u + 2 * p.c * p.v) > 40); return p; },
  build: ({ a, b, c, p, q, k, u, v }) => { const Q = quad({ a, b, c, p, q, k }), Px = p + u, Py = q + v, gx = 2 * a * Px + b * Py + Q.d, gy = b * Px + 2 * c * Py + Q.e, rate = Math.hypot(gx, gy), fc = Q.value(p, q); return {
   prompt: `Mira charts the temperature over the plain as f(x, y) = ${Q.f} degrees Celsius, with x and y in kilometres east and north of the mast. A weather balloon hovers over the point P(${n(Px)}, ${n(Py)}). Enter the greatest rate of increase of the temperature at P, in degrees per kilometre. The field has exactly one critical point: enter its code (1 for a local maximum, 2 for a local minimum, 3 for a saddle point), then the temperature there.`,
   answer: [rate, Q.code, fc],
   hints: ['The greatest rate of increase at a point is the length of the gradient there: √(f_x² + f_y²), with both partial derivatives worked out at that point.', 'For the critical point, set f_x = 0 and f_y = 0 and solve. Classify it with D = f_xx f_yy − (f_xy)², then put its coordinates into f.'],
   solution: `f_x = ${Q.fx} and f_y = ${Q.fy}. At P they are ${n(gx)} and ${n(gy)}, so ∇f = ⟨${n(gx)}, ${n(gy)}⟩ there and its length is √(${n(gx * gx)} + ${n(gy * gy)}) = ${n(rate)} degrees per kilometre. Both partial derivatives are 0 at (${n(p)}, ${n(q)}), the critical point. There f_xx = ${n(2 * a)}, f_yy = ${n(2 * c)} and f_xy = ${n(b)}, so D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}. The temperature there is f(${n(p)}, ${n(q)}) = ${n(fc)} °C.`,
   guidance: [
    { prompt: `What are f_x and f_y at P(${n(Px)}, ${n(Py)})?`, answer: [gx, gy], explanation: `f_x = ${Q.fx} and f_y = ${Q.fy}. Putting in x = ${n(Px)} and y = ${n(Py)} gives ${n(gx)} and ${n(gy)}.` },
    { prompt: `How long is the gradient ⟨${n(gx)}, ${n(gy)}⟩? That is the greatest rate of increase at P.`, answer: [rate], explanation: `√(${n(gx * gx)} + ${n(gy * gy)}) = √${n(rate * rate)} = ${n(rate)} degrees per kilometre, in the direction of the gradient.` },
    { prompt: 'Set f_x = 0 and f_y = 0 and solve. Where is the critical point?', answer: [p, q], explanation: `Both equations hold at x = ${n(p)}, y = ${n(q)}.` },
    { prompt: 'What are the discriminant D = f_xx f_yy − (f_xy)² and the code (1 maximum, 2 minimum, 3 saddle point)?', answer: [Q.D, Q.code], explanation: `D = ${n(2 * a)} × ${par(2 * c)} − ${par(b)}² = ${n(Q.D)}. ${Q.verdict}.` },
    { prompt: `What is the temperature f(${n(p)}, ${n(q)}) at the critical point?`, answer: [fc], explanation: `Putting x = ${n(p)} and y = ${n(q)} into f gives ${n(fc)} °C.` }
   ] }; }
 },
 /* h = d + cxy over [x1, x2] × [y1, y2], each side of even length so the averages of x and y are whole; roof at most 40 m.
    Not the worked example (2 + xy over 0 ≤ x ≤ 2, 0 ≤ y ≤ 2). */
 q24: {
  canonical: { c: 1, d: 4, x1: 0, x2: 4, y1: 1, y2: 3 },
  draw: R => { let p; do { p = { c: R.int(1, 2), d: R.int(2, 6), x1: R.int(0, 3), y1: R.int(0, 3) }; p.x2 = p.x1 + 2 * R.int(1, 3); p.y2 = p.y1 + 2 * R.int(1, 2); }
   while (p.d + p.c * p.x2 * p.y2 > 40 || (p.d === 2 && p.c === 1 && p.x1 === 0 && p.x2 === 2 && p.y1 === 0 && p.y2 === 2)); return p; },
  build: ({ c, d, x1, x2, y1, y2 }) => { const dx = x2 - x1, dy = y2 - y1, Sx = (x2 * x2 - x1 * x1) / 2, Sy = (y2 * y2 - y1 * y1) / 2, A0 = d * dx, B0 = c * Sx, V = A0 * dy + B0 * Sy, area = dx * dy, avg = V / area, h = poly([[d, ''], [c, 'xy']]); return {
   prompt: `The roof of a new storage hall at Dome Works rises over a rectangular floor. Across the floor x runs from ${n(x1)} to ${n(x2)} metres and y from ${n(y1)} to ${n(y2)} metres, and the roof height is h(x, y) = ${h} metres. Enter the volume of air in the hall, the double integral of h over the floor, in cubic metres (type it without commas), then the average roof height in metres.`,
   answer: [V, avg],
   hints: ['Work from the inside out. Integrate h with respect to x from one side of the floor to the other, holding y fixed as if it were a number, the way a partial derivative holds it fixed. Then integrate the result with respect to y.', 'The average height is the volume divided by the floor area.'],
   solution: `Inside: the integral of ${h} with respect to x from ${n(x1)} to ${n(x2)} is ${times1(d)}${n(dx)} + ${times1(c)}${n(Sx)} × y = ${poly([[A0, ''], [B0, 'y']])}, because the integral of x from ${n(x1)} to ${n(x2)} is (${n(x2 * x2)} − ${n(x1 * x1)}) ÷ 2 = ${n(Sx)}. Outside: the integral of ${poly([[A0, ''], [B0, 'y']])} with respect to y from ${n(y1)} to ${n(y2)} is ${n(A0)} × ${n(dy)} + ${n(B0)} × ${n(Sy)} = ${n(V)} cubic metres. The floor area is ${n(dx)} × ${n(dy)} = ${n(area)} square metres, so the average height is ${n(V)} ÷ ${n(area)} = ${n(avg)} metres.`,
   guidance: [
    { prompt: `Integrate h with respect to x from x = ${n(x1)} to x = ${n(x2)}, holding y fixed. The result has the form A + By: enter A, then B.`, answer: [A0, B0], explanation: `The ${n(d)} gives ${n(d)} × ${n(dx)} = ${n(A0)}, and the ${c === 1 ? 'xy' : n(c) + 'xy'} gives ${n(c)} × (${n(x2 * x2)} − ${n(x1 * x1)}) ÷ 2 × y = ${n(B0)}y.` },
    { prompt: `Now integrate ${poly([[A0, ''], [B0, 'y']])} with respect to y from y = ${n(y1)} to y = ${n(y2)}. What is the volume?`, answer: [V], explanation: `${n(A0)} × ${n(dy)} + ${n(B0)} × (${n(y2 * y2)} − ${n(y1 * y1)}) ÷ 2 = ${n(A0 * dy)} + ${n(B0 * Sy)} = ${n(V)} cubic metres.` },
    { prompt: 'What is the floor area, and the average roof height?', answer: [area, avg], explanation: `The floor is ${n(dx)} by ${n(dy)} metres, an area of ${n(area)} square metres, and ${n(V)} ÷ ${n(area)} = ${n(avg)} metres.` }
   ] }; }
 },
 /* Paint kx mm thick on 0 ≤ x ≤ a, 0 ≤ y ≤ cx²: kca⁴ ÷ 4 litres (whole). Switched: y from 0 to ca², x from √(y ÷ c) to a.
    The asked height is cs², where x starts at s. Not the worked example (a line, y = 2x). */
 q25: {
  canonical: { a: 2, c: 3, k: 2, s: 1 },
  draw: R => { let p; do { p = { a: R.int(2, 4), c: R.int(1, 4), k: R.int(1, 5) }; p.s = R.int(1, p.a - 1); } while ((p.k * p.c * Math.pow(p.a, 4)) % 4 !== 0); return p; },
  build: ({ a, c, k, s }) => { const curve = poly([[c, 'x²']]), th = poly([[k, 'x']]), kc = k * c, P = kc * Math.pow(a, 4) / 4, Y = c * a * a, ys = c * s * s, root = c === 1 ? '√y' : `√(y ÷ ${n(c)})`, rootAt = c === 1 ? `√${n(ys)}` : `√(${n(ys)} ÷ ${n(c)})`; return {
   prompt: `A curved wall panel at Dome Works is laid flat for painting. It is the region between the x-axis, the line x = ${n(a)} and the curve y = ${curve}, measured in metres. The paint goes on ${th} millimetres thick at the point (x, y), and paint 1 millimetre thick over 1 square metre is 1 litre. Enter the litres of paint needed, the double integral of the thickness over the panel (type it without commas). Then switch the order so that x is integrated first: enter the top limit of y, then the value of x where the inner integral starts at the height y = ${n(ys)}.`,
   answer: [P, Y, s],
   hints: ['As a type I region, x runs from 0 to the right edge and, for each x, y runs from 0 up to the curve. Integrate the thickness with respect to y first.', 'To switch, read the region sideways: y runs from 0 to the highest point of the curve, and for each y, x runs from the curve (solve its equation for x) to the right edge.'],
   solution: `Type I: for each x from 0 to ${n(a)}, y runs from 0 to ${curve}. Inside: the integral of ${th} with respect to y from 0 to ${curve} is ${th} × ${curve} = ${poly([[kc, 'x³']])}. Outside: the integral of ${poly([[kc, 'x³']])} from 0 to ${n(a)} is ${n(kc)} × ${n(Math.pow(a, 4))} ÷ 4 = ${n(P)} litres. Switched: the curve is highest at x = ${n(a)}, where y = ${n(Y)}, so y runs from 0 to ${n(Y)}. For each y, x runs from the curve, x = ${root}, to ${n(a)}. At y = ${n(ys)} the inner integral starts at x = ${rootAt} = ${n(s)}.`,
   guidance: [
    { prompt: `For a fixed x, integrate the thickness with respect to y from 0 to ${curve}. The result is a number times x³: enter the number.`, answer: [kc], explanation: `The thickness does not change with y, so the inner integral is ${th} × ${curve} = ${poly([[kc, 'x³']])}.` },
    { prompt: `Integrate that from x = 0 to x = ${n(a)}. How many litres of paint is that?`, answer: [P], explanation: `The integral of x³ is x⁴ ÷ 4, so ${n(kc)} × ${n(Math.pow(a, 4))} ÷ 4 = ${n(P)} litres.` },
    { prompt: `Read the region sideways. What is the top limit of y, and where does x start at the height y = ${n(ys)}?`, answer: [Y, s], explanation: `The highest point is y = ${curve} at x = ${n(a)}, which is ${n(Y)}. Solving y = ${curve} for x gives x = ${root}, so at y = ${n(ys)} the inner integral starts at x = ${n(s)} and runs to ${n(a)}.` }
   ] }; }
 },
 /* kind is an index: 0 heat output c W/m² (constant), 1 heat output x² + y² W/m². ang is an index into ANG. The inner
    integral and k have at most 2 decimals, and k is never 1. Not the worked example (a quarter disc of radius 2, f = 1). */
 q26: {
  canonical: { kind: 1, c: 0, r1: 1, r2: 3, ang: 0 },
  draw: R => { let p, I, k; do { p = { kind: R.int(0, 1), r1: R.int(0, 3), ang: R.int(0, ANG.length - 1) }; p.c = p.kind ? 0 : R.int(2, 9); p.r2 = p.r1 + R.int(1, p.kind ? 2 : 4);
   I = p.kind ? (Math.pow(p.r2, 4) - Math.pow(p.r1, 4)) / 4 : p.c * (p.r2 * p.r2 - p.r1 * p.r1) / 2; k = I * ANG[p.ang].w; } while (!dec(I, 2) || !dec(k, 2) || k === 1 || k >= 1000); return p; },
  build: ({ kind, c, r1, r2, ang }) => { const A = ANG[ang], f = kind ? 'x² + y²' : n(c), I = kind ? (Math.pow(r2, 4) - Math.pow(r1, 4)) / 4 : c * (r2 * r2 - r1 * r1) / 2, k = I * A.w,
   where = r1 === 0 ? `within ${n(r2)} m of the centre` : `between ${n(r1)} m and ${n(r2)} m from the centre`,
   inner = kind ? `f = x² + y² = r², so the inner integral is the integral of r² × r = r³ from ${n(r1)} to ${n(r2)}, which is (${n(Math.pow(r2, 4))} − ${n(Math.pow(r1, 4))}) ÷ 4 = ${n(I)}` : `f = ${n(c)} everywhere, so the inner integral is the integral of ${n(c)}r from ${n(r1)} to ${n(r2)}, which is ${n(c)} × (${n(r2 * r2)} − ${n(r1 * r1)}) ÷ 2 = ${n(I)}`; return {
   prompt: `A heating mat on a round dome floor covers the points ${where} with polar angle θ from ${A.t1} to ${A.t2}. Its heat output is f(x, y) = ${f} watts per square metre, with x and y in metres from the centre. Enter the inner integral of f r with respect to r, from r = ${n(r1)} to r = ${n(r2)}. Then write the total heat output, the double integral of f over the mat, as k·π watts and enter k (it may be a decimal, such as 2.25).`,
   answer: [I, k],
   hints: ['In polar coordinates x = r cos θ and y = r sin θ, so x² + y² = r², and the area piece dA becomes r dr dθ. Do not forget the extra factor r.', 'The inner integral over r is a plain number. Integrating a number over θ multiplies it by the width of the angle range.'],
   solution: `In polar coordinates dA = r dr dθ. ${inner}. The angle runs from ${A.t1} to ${A.t2}, a width of ${A.wt}, so the total is ${n(I)} × ${A.wt} = ${n(k)}π watts, and k = ${n(k)}.`,
   guidance: [
    { prompt: `Write f in polar coordinates and multiply by the extra factor r. What is its integral with respect to r from r = ${n(r1)} to r = ${n(r2)}?`, answer: [I], explanation: `Here ${inner}.` },
    { prompt: `The angle runs from θ = ${A.t1} to θ = ${A.t2}. How wide is that range, as a number times π?`, answer: [A.w], explanation: `${A.t2} − ${A.t1} = ${A.wt}${A.w === 1 ? ', so the number in front of π is 1' : `, which is ${n(A.w)} times π`}.` },
    { prompt: 'Multiply the inner integral by the width of the angle range. What is k in k·π?', answer: [k], explanation: `${n(I)} × ${A.wt} = ${n(k)}π, so k = ${n(k)}.` }
   ] }; }
 },
 /* Ramp 0 ≤ x ≤ a, 0 ≤ y ≤ b, 0 ≤ z ≤ sx (at most 6 m tall), density c + y t/m³. V = sa²b ÷ 2, M = (cb + b² ÷ 2) × sa² ÷ 2.
    Not the worked example (a box with density 1 + z). */
 q27: {
  canonical: { a: 4, b: 2, s: 1, c: 1 },
  draw: R => { let p; do { p = { a: R.int(2, 6), b: R.int(1, 3), s: R.int(1, 3), c: R.int(1, 2) }; } while (p.s * p.a > 6 || !dec((p.c * p.b + p.b * p.b / 2) * p.s * p.a * p.a / 2, 2)); return p; },
  build: ({ a, b, s, c }) => { const top = poly([[s, 'x']]), V = s * a * a * b / 2, Ky = c * b + b * b / 2, M = Ky * s * a * a / 2; return {
   prompt: `Dome Works pours a ramp of packed regolith up to an airlock. It fills the solid where x runs from 0 to ${n(a)}, y from 0 to ${n(b)}, and z from 0 up to the sloping top z = ${top}, all in metres. The packing is denser towards the back wall: the density is δ(x, y, z) = ${n(c)} + y tonnes per cubic metre. Enter the volume of the ramp in cubic metres, then its mass in tonnes (decimals are fine).`,
   answer: [V, M],
   hints: ['The volume is the triple integral of 1 over the solid. Integrate z first: it runs from 0 to the sloping top, so the innermost integral is the height of the ramp at (x, y). Then integrate y, then x.', 'The mass is the triple integral of the density. The density does not depend on z, so the innermost integral is the density times the height. Then integrate y, then x, as before.'],
   solution: `Volume: the integral of 1 with respect to z from 0 to ${top} is ${top}. Integrating that with respect to y from 0 to ${n(b)} gives ${poly([[s * b, 'x']])}, and integrating with respect to x from 0 to ${n(a)} gives ${n(s * b)} × ${n(a * a)} ÷ 2 = ${n(V)} cubic metres. Mass: the integral of ${n(c)} + y with respect to z from 0 to ${top} is (${n(c)} + y) × ${top}. Integrating with respect to y from 0 to ${n(b)} gives (${n(c)} × ${n(b)} + ${n(b * b)} ÷ 2) × ${top} = ${poly([[Ky * s, 'x']])}, and integrating with respect to x from 0 to ${n(a)} gives ${n(Ky * s)} × ${n(a * a)} ÷ 2 = ${n(M)} tonnes.`,
   guidance: [
    { prompt: `Integrate 1 with respect to z (from 0 to ${top}), then with respect to y (from 0 to ${n(b)}). The result is a number times x: enter the number.`, answer: [s * b], explanation: `The z-integral is the height ${top}; the y-integral multiplies it by ${n(b)}, giving ${poly([[s * b, 'x']])}.` },
    { prompt: `Integrate that with respect to x from 0 to ${n(a)}. What is the volume?`, answer: [V], explanation: `${n(s * b)} × ${n(a * a)} ÷ 2 = ${n(V)} cubic metres.` },
    { prompt: `Now the density: the z-integral of ${n(c)} + y is (${n(c)} + y) × ${top}. Integrate that with respect to y from 0 to ${n(b)}. The result is a number times x: enter the number.`, answer: [Ky * s], explanation: `The integral of ${n(c)} + y from 0 to ${n(b)} is ${n(c)} × ${n(b)} + ${n(b * b)} ÷ 2 = ${n(Ky)}, and ${n(Ky)} × ${top} = ${poly([[Ky * s, 'x']])}.` },
    { prompt: `Integrate that with respect to x from 0 to ${n(a)}. What is the mass?`, answer: [M], explanation: `${n(Ky * s)} × ${n(a * a)} ÷ 2 = ${n(M)} tonnes.` }
   ] }; }
 },
 /* kind is an index: 0 a pipe wall (cylindrical, radii r1 < r2, height h), 1 the cap of a ball of radius r2 inside the
    cone φ = π/3, 2 a half shell between radii r1 and r2 above the floor. k is a multiple of 1/3. Not the worked example (a ball of radius 3). */
 q28: {
  canonical: { kind: 2, r1: 1, r2: 3, h: 0 },
  draw: R => { const kind = R.int(0, 2);
   if (kind === 0) { const r1 = R.int(1, 4); return { kind, r1, r2: r1 + R.int(1, 3), h: R.int(2, 6) }; }
   if (kind === 1) return { kind, r1: 0, r2: R.int(2, 6), h: 0 };
   const r1 = R.int(1, 5); return { kind, r1, r2: r1 + R.int(1, 2), h: 0 }; },
  build: ({ kind, r1, r2, h }) => {
   const rad = kind === 0 ? (r2 * r2 - r1 * r1) / 2 : (Math.pow(r2, 3) - Math.pow(r1, 3)) / 3, mid = kind === 0 ? h : kind === 1 ? 0.5 : 1, k = rad * mid * 2;
   const shape = kind === 0 ? `an air shaft lining: the solid between two upright cylinders round the z-axis, of radius ${n(r1)} m and ${n(r2)} m, from the floor z = 0 up to z = ${n(h)}`
    : kind === 1 ? `a beacon lens: the part of the ball of radius ${n(r2)} m round the origin that lies inside the cone φ = π/3`
    : `a dome shell: the part above the floor of the space between two spheres round the origin, of radius ${n(r1)} m and ${n(r2)} m`;
   const use = kind === 0 ? 'cylindrical coordinates: the radial integral is the integral of r with respect to r' : 'spherical coordinates: the radial integral is the integral of ρ² with respect to ρ';
   const radText = kind === 0 ? `The radial integral is the integral of r from ${n(r1)} to ${n(r2)}: (${n(r2 * r2)} − ${n(r1 * r1)}) ÷ 2 = ${n(rad)}` : `The radial integral is the integral of ρ² from ${n(r1)} to ${n(r2)}: (${n(Math.pow(r2, 3))} − ${n(Math.pow(r1, 3))}) ÷ 3 = ${third(rad)}`, radT = kind === 0 ? n(rad) : third(rad);
   const midText = kind === 0 ? `The integral of 1 with respect to z from 0 to ${n(h)} is ${n(h)}` : kind === 1 ? 'The integral of sin φ from 0 to π/3 is 1 − cos(π/3) = 1 − 1/2 = 1/2' : 'The integral of sin φ from 0 to π/2 (straight up to the floor) is 1 − cos(π/2) = 1 − 0 = 1';
   return {
   prompt: `Dome Works is casting ${shape}. Find its volume in ${use}. Enter that radial integral, then k, where the volume is k·π cubic metres (a fraction such as 38/3 is fine, or a decimal to 4 places).`,
   answer: [rad, k],
   hints: ['In cylindrical coordinates dV = r dz dr dθ. In spherical coordinates dV = ρ² sin φ dρ dφ dθ, where φ is the angle down from the positive z-axis. The extra factor in front is the part people forget.', 'All the limits here are constants, so the triple integral is a product of three single integrals: one for the distance from the axis or the origin, one for the height or for φ, and one for θ, which runs from 0 to 2π.'],
   solution: `${radText}. ${midText}. The angle θ runs all the way round, from 0 to 2π. The volume is ${radT} × ${mid === 0.5 ? '1/2' : n(mid)} × 2π = ${kpi(k)} cubic metres, so k = ${third(k)}.`,
   guidance: [
    { prompt: `Set up the volume in ${kind === 0 ? 'cylindrical' : 'spherical'} coordinates. What is the radial integral?`, answer: [rad], explanation: `${radText}.` },
    { prompt: kind === 0 ? 'What is the integral of 1 with respect to z over the height of the lining?' : `What is the integral of sin φ with respect to φ, from 0 to ${kind === 1 ? 'π/3' : 'π/2'}?`, answer: [mid], explanation: `${midText}.` },
    { prompt: 'Multiply the radial integral, that integral and the 2π from θ. What is k in k·π?', answer: [k], explanation: `${radT} × ${mid === 0.5 ? '1/2' : n(mid)} × 2 = ${third(k)}, so the volume is ${kpi(k)} cubic metres.` }
   ] }; }
 },
 /* A half shell above the floor between radii a and b = a + 1 or a + 2, density c ÷ ρ t/m³ (0.3 to 3).
    Volume 2(b³ − a³) ÷ 3 times π, mass c(b² − a²) times π. Not the bench's shells (b = a + 1 with c = 6). */
 q29: {
  canonical: { a: 6, b: 7, c: 6 },
  draw: R => { let p; do { p = { a: R.int(4, 10), c: R.int(4, 12) }; p.b = p.a + R.int(1, 2); } while (p.c / p.b < 0.3 || p.c / p.a > 3); return p; },
  build: ({ a, b, c }) => { const rv = (b * b * b - a * a * a) / 3, kv = 2 * rv, rm = c * (b * b - a * a) / 2, km = 2 * rm; return {
   prompt: `The main habitat dome is a thick shell: the part above the floor of the space between two spheres centred at the middle of the floor, of inner radius ${n(a)} m and outer radius ${n(b)} m. Its shielding is packed denser towards the inside: the density is δ = ${n(c)} ÷ ρ tonnes per cubic metre, where ρ is the distance from the centre. Enter the volume of the shell as k·π cubic metres (enter k: a fraction such as 98/3 is fine, or a decimal to 4 places), then the mass of the shell as k·π tonnes (enter that k).`,
   answer: [kv, km],
   hints: ['Use spherical coordinates: ρ from the inner radius to the outer, φ from 0 (straight up) to π/2 (the floor), and θ from 0 to 2π, with dV = ρ² sin φ dρ dφ dθ.', 'All the limits are constants, so each triple integral is a product of three single integrals. For the mass, multiply the density by ρ² before you integrate over ρ.'],
   solution: `Volume: the integral of ρ² from ${n(a)} to ${n(b)} is (${n(b * b * b)} − ${n(a * a * a)}) ÷ 3 = ${third(rv)}; the integral of sin φ from 0 to π/2 is 1; the integral of 1 from 0 to 2π is 2π. The volume is ${third(rv)} × 1 × 2π = ${kpi(kv)} cubic metres. Mass: the density times ρ² is ${n(c)} ÷ ρ × ρ² = ${n(c)}ρ, and its integral from ${n(a)} to ${n(b)} is ${n(c)} × (${n(b * b)} − ${n(a * a)}) ÷ 2 = ${n(rm)}. The mass is ${n(rm)} × 1 × 2π = ${n(km)}π tonnes.`,
   guidance: [
    { prompt: `For the volume, what is the integral of ρ² with respect to ρ from ${n(a)} to ${n(b)}?`, answer: [rv], explanation: `(${n(b * b * b)} − ${n(a * a * a)}) ÷ 3 = ${third(rv)}.` },
    { prompt: 'Multiply by the integral of sin φ from 0 to π/2, which is 1, and by 2π from θ. What is k for the volume?', answer: [kv], explanation: `${third(rv)} × 1 × 2 = ${third(kv)}, so the volume is ${kpi(kv)} cubic metres.` },
    { prompt: `For the mass, the density times ρ² is ${n(c)}ρ. What is its integral with respect to ρ from ${n(a)} to ${n(b)}?`, answer: [rm], explanation: `${n(c)} × (${n(b * b)} − ${n(a * a)}) ÷ 2 = ${n(rm)}.` },
    { prompt: 'Multiply by 1 and by 2π as before. What is k for the mass?', answer: [km], explanation: `${n(rm)} × 1 × 2 = ${n(km)}, so the mass is ${n(km)}π tonnes.` }
   ] }; }
 },
 /* u = ax + by, v = cx + dy with ad − bc in ±1, ±2, ±4, ±5, so J = 1 ÷ (ad − bc) is a short decimal; load f = u ≥ 0 on
    u1 ≤ u ≤ u2, v1 ≤ v ≤ v2. Not the worked example (u = 2x + y, v = x + y). */
 q30: {
  canonical: { a: 1, b: 1, c: 1, d: -1, u1: 1, u2: 3, v1: 0, v2: 2 },
  draw: R => { let p, det; do { p = { a: R.int(1, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), d: R.nz(-3, 3), u1: R.int(0, 3), v1: R.int(-2, 2) }; p.u2 = p.u1 + R.int(1, 4); p.v2 = p.v1 + R.int(1, 3); det = p.a * p.d - p.b * p.c; }
   while (![1, 2, 4, 5].includes(Math.abs(det)) || (p.a === 2 && p.b === 1 && p.c === 1 && p.d === 1)); return p; },
  build: ({ a, b, c, d, u1, u2, v1, v2 }) => { const U = poly([[a, 'x'], [b, 'y']]), V = poly([[c, 'x'], [d, 'y']]), det = a * d - b * c, J = 1 / det, UV = (u2 * u2 - u1 * u1) / 2 * (v2 - v1), I = UV / Math.abs(det); return {
   prompt: `In the Cable Yard a steel plate lies between the lines ${U} = ${n(u1)} and ${U} = ${n(u2)}, and between the lines ${V} = ${n(v1)} and ${V} = ${n(v2)}, with x and y in metres. The cables load it with f(x, y) = ${U} newtons per square metre. Change variables to u = ${U} and v = ${V}. Enter ∂(u, v)/∂(x, y), then the Jacobian J = ∂(x, y)/∂(u, v) (a decimal), then the total load on the plate, the double integral of f, in newtons.`,
   answer: [det, J, I],
   hints: ['∂(u, v)/∂(x, y) is the 2 × 2 determinant u_x v_y − u_y v_x of the partial derivatives. The Jacobian J = ∂(x, y)/∂(u, v) of the way back is 1 divided by it.', 'In u and v the plate is a rectangle, so the double integral of f becomes the integral of u × |J| with constant limits. Use the size of J, without its sign.'],
   solution: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)} and v_y = ${n(d)}, so ∂(u, v)/∂(x, y) = ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}. The Jacobian of the way back is J = 1 ÷ ${par(det)} = ${n(J)}, and |J| = ${n(Math.abs(J))}. In u and v the plate is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}, and f = u. The integral of u from ${n(u1)} to ${n(u2)} is (${n(u2 * u2)} − ${n(u1 * u1)}) ÷ 2 = ${n((u2 * u2 - u1 * u1) / 2)}, and v adds a factor ${n(v2 - v1)}, giving ${n(UV)}. The total load is ${n(UV)} × ${n(Math.abs(J))} = ${n(I)} newtons.`,
   guidance: [
    { prompt: `Take the partial derivatives of u = ${U} and v = ${V}. What is ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x?`, answer: [det], explanation: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)}, v_y = ${n(d)}: ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}.` },
    { prompt: 'What is the Jacobian J = ∂(x, y)/∂(u, v) of the way back?', answer: [J], explanation: `J = 1 ÷ ${par(det)} = ${n(J)}. Each small rectangle du dv in the new variables stands for an area |J| du dv on the plate.` },
    { prompt: `In u and v the plate is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}. What is the integral of u over it, before the factor |J|?`, answer: [UV], explanation: `The integral of u from ${n(u1)} to ${n(u2)} is (${n(u2 * u2)} − ${n(u1 * u1)}) ÷ 2 = ${n((u2 * u2 - u1 * u1) / 2)}, and the v-integral multiplies it by ${n(v2 - v1)}: ${n(UV)}.` },
    { prompt: 'Multiply by |J|. What is the total load on the plate?', answer: [I], explanation: `${n(UV)} × ${n(Math.abs(J))} = ${n(I)} newtons.` }
   ] }; }
 }
});
/* Tidies generated text where a drawn number comes out as 1: '1 joules' → '1 joule', '1π' → 'π'. Wraps every build of this file. */
const ONE = s => s.replace(/(^|[^\d.,])(−?1) (joule|newton|tonne|cubic metre|square metre|metre|kilogram|litre|gram|second|watt)s\b/g, '$1$2 $3').replace(/(^|[^\d.,])1π/g, '$1π');
for (const id of 'q21 q22 q23 q24 q25 q26 q27 q28 q29 q30'.split(' ')) {
 const g = window.MISSION_GEN[id], b = g.build;
 g.build = p => { const o = b(p); return { ...o, prompt: ONE(o.prompt), hints: o.hints.map(ONE), solution: ONE(o.solution), guidance: o.guidance.map(x => ({ ...x, prompt: ONE(x.prompt), explanation: ONE(x.explanation) })) }; };
}
})();
