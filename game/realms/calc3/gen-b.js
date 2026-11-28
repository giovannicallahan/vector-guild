/* Calculus 3: many variables mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A rounded value written with all its decimal places: dpl(0.8, 2) → '0.80'. */
const dpl = (x, k) => x.toFixed(k).replace('-', '−');
/* A sum of terms written the usual way: ex([[3, 'x²'], [−1, 'y'], [4, '']]) is "3x² − y + 4". Zero terms are left out,
   a coefficient 1 is not written before a letter, and the first term carries only a minus sign. */
const ex = terms => { const out = []; for (const [c, m] of terms) { if (!c) continue; const a = Math.abs(c), body = (a === 1 && m) ? m : n(a) + m;
 out.push(out.length ? `${c < 0 ? '−' : '+'} ${body}` : `${c < 0 ? '−' : ''}${body}`); } return out.length ? out.join(' ') : '0'; };
/* A sum of numbers as worked out: sm([24, −8, 4]) is "24 − 8 + 4". */
const sm = list => list.map((v, i) => i ? `${v < 0 ? '−' : '+'} ${n(Math.abs(v))}` : n(v)).join(' ');
/* The coefficient in front of a letter: '' for 1, else the number. */
const co = c => c === 1 ? '' : n(c);
/* "y = 2x", "y = x", "y = −x" */
const mx = m => m === 1 ? 'x' : m === -1 ? '−x' : `${n(m)}x`;
const line = m => `y = ${mx(m)}`;
/* "(x − 3)" or "(x + 2)" */
const shift = (v, x) => v < 0 ? `(${x} + ${n(-v)})` : `(${x} − ${n(v)})`;
const pt = (a, b) => `(${n(a)}, ${n(b)})`;
const isSq = v => v > 0 && Number.isInteger(Math.sqrt(v));
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => a / gcd(a, b) * b;

/* q11: velocities ⟨a, b, 2T⟩ with a whole speed; built once. */
const Q11 = [];
for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let T = 1; T <= 6; T++) if (isSq(a * a + b * b + 4 * T * T)) Q11.push([a, b, T]);
/* q13: lines y = m1x and y = m2x that give whole, different values of Axy ÷ (x² + By²). */
const Q13 = [];
for (let B = 1; B <= 3; B++) for (const m1 of [1, 2, 3, -1, -2, -3]) for (const m2 of [1, 2, 3, -1, -2, -3]) {
 if (m1 === m2) continue; const L = lcm(1 + B * m1 * m1, 1 + B * m2 * m2);
 for (let A = L; A <= 60; A += L) { if (A * m1 / (1 + B * m1 * m1) !== A * m2 / (1 + B * m2 * m2)) Q13.push([A, B, m1, m2]); }
}
/* q18: dT/dt for the parameters. */
const rate18 = ({ a, b, c, p, q, r, s }) => { const X = p + q * s, Y = r * s * s; return (2 * a * X + b * Y) * q + (b * X + 2 * c * Y) * 2 * r * s; };
const Q19DIR = [[3, 4], [4, 3], [3, -4], [-3, 4], [4, -3], [-4, 3], [-3, -4], [-4, -3]];

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* r(t) = ⟨at, bt, t²⟩ meets the plane px + qy + z = d at t = T, where d = T² + (pa + qb)T; the speed there,
    √(a² + b² + 4T²), is whole. Not the worked example (⟨t, 2t, t²⟩ and x + y + z = 4). */
 q11: {
  canonical: { a: 2, b: 3, T: 3, p: 1, q: 2 },
  draw: R => { let p; do { const [a, b, T] = R.pick(Q11); p = { a, b, T, p: R.int(1, 3), q: R.int(1, 3) }; }
   while ((p.a === 1 && p.b === 2 && p.T === 1 && p.p === 1 && p.q === 1) || p.T * p.T + (p.p * p.a + p.q * p.b) * p.T > 200); return p; },
  build: ({ a, b, T, p, q }) => { const K = p * a + q * b, d = T * T + K * T, vz = 2 * T, S = Math.sqrt(a * a + b * b + vz * vz); return {
   prompt: `A supply shuttle coasts in towards the Docking Ring. Its position t seconds after its last burn is r(t) = ⟨${co(a)}t, ${co(b)}t, t²⟩, in metres, and the ring’s flat docking face lies in the plane ${co(p)}x + ${co(q)}y + z = ${n(d)}. The shuttle passes through the face at the moment its three coordinates satisfy the plane’s equation. Enter that time t, which is positive, in seconds, then the shuttle’s speed at that moment in metres per second.`,
   answer: [T, S],
   hints: ['Put the three components of r(t) in place of x, y and z in the plane’s equation. That leaves one quadratic equation in t: move everything to one side, solve it, and keep the positive root.', 'The velocity is r′(t), differentiated one component at a time. The speed is the magnitude of the velocity: the square root of the sum of the squares of its components.'],
   solution: `Substituting x = ${co(a)}t, y = ${co(b)}t and z = t² gives ${ex([[p * a, 't'], [q * b, 't']])} + t² = ${n(d)}, so t² + ${n(K)}t − ${n(d)} = 0. This factors as (t − ${n(T)})(t + ${n(K + T)}) = 0, and the positive root is t = ${n(T)}. The velocity is r′(t) = ⟨${n(a)}, ${n(b)}, 2t⟩, which at t = ${n(T)} is ⟨${n(a)}, ${n(b)}, ${n(vz)}⟩. The speed is √(${n(a)}² + ${n(b)}² + ${n(vz)}²) = √${n(S * S)} = ${n(S)} metres per second.`,
   guidance: [
    { prompt: `Substitute r(t) into ${co(p)}x + ${co(q)}y + z = ${n(d)}. The equation becomes t² + Kt − ${n(d)} = 0. What is K, the number in front of t?`, answer: [K], explanation: `x = ${co(a)}t and y = ${co(b)}t, so ${co(p)}x + ${co(q)}y = ${ex([[p * a, 't'], [q * b, 't']])} = ${n(K)}t. With z = t² the equation is t² + ${n(K)}t − ${n(d)} = 0.` },
    { prompt: `Solve t² + ${n(K)}t − ${n(d)} = 0. What is its positive root?`, answer: [T], explanation: `t² + ${n(K)}t − ${n(d)} = (t − ${n(T)})(t + ${n(K + T)}), so the roots are ${n(T)} and −${n(K + T)}. Time after the burn is positive, so t = ${n(T)}.` },
    { prompt: `The velocity is r′(t) = ⟨${n(a)}, ${n(b)}, 2t⟩. What is its third component at t = ${n(T)}?`, answer: [vz], explanation: `The derivative of t² is 2t, and 2 × ${n(T)} = ${n(vz)}. The other two components stay ${n(a)} and ${n(b)}: the derivative of ${co(a)}t is ${n(a)}, and of ${co(b)}t is ${n(b)}.` },
    { prompt: `What is the speed, the magnitude of ⟨${n(a)}, ${n(b)}, ${n(vz)}⟩?`, answer: [S], explanation: `${n(a * a)} + ${n(b * b)} + ${n(vz * vz)} = ${n(S * S)}, and √${n(S * S)} = ${n(S)} metres per second.` }
   ] }; }
 },
 /* h(x, y) = k − px² − qy². The contour through (a, b) has level c = k − pa² − qb² and crosses the positive x-axis
    at s, with ps² = pa² + qb², s whole. Not the worked example (40 − x² − y² at (3, 4)). */
 q12: {
  canonical: { k: 50, p: 1, q: 2, a: 1, b: 2 },
  draw: R => { let o; do { o = { k: R.int(40, 120), p: R.int(1, 3), q: R.int(1, 4), a: R.int(1, 6), b: R.int(1, 6) }; }
   while (!isSq((o.p * o.a * o.a + o.q * o.b * o.b) / o.p) || o.k - o.p * o.a * o.a - o.q * o.b * o.b < 5 || (o.p === 1 && o.q === 1 && o.a === 3 && o.b === 4)); return o; },
  build: ({ k, p, q, a, b }) => { const c = k - p * a * a - q * b * b, s2 = (k - c) / p, s = Math.sqrt(s2), f = `${n(k)} − ${co(p)}x² − ${co(q)}y²`;
   const pa = p === 1 ? n(a * a) : `${n(p)} × ${n(a * a)}`, qb = q === 1 ? n(b * b) : `${n(q)} × ${n(b * b)}`;
   const onAxis = p === 1 ? `x² = ${n(k - c)}` : `${n(p)}x² = ${n(k - c)}, so x² = ${n(s2)}`; return {
   prompt: `The Terrain Lab models a hill on the crater floor as h(x, y) = ${f} metres, where (x, y) is a point on the map, in metres from the hill’s centre. A survey beacon stands at ${pt(a, b)}. Enter the height of the ground at the beacon, which is the level c of the contour line through it. Then enter the positive x where that same contour line crosses the x-axis, where y = 0.`,
   answer: [c, s],
   hints: ['Put the beacon’s x and y into h(x, y). The height you get is the level c of the beacon’s contour line, the level curve h(x, y) = c.', 'Every point on the x-axis has y = 0. Solve h(x, 0) = c for the positive x.'],
   solution: `h${pt(a, b)} = ${n(k)} − ${pa} − ${qb} = ${n(c)}, so the beacon lies on the level curve h(x, y) = ${n(c)}. On the x-axis y = 0, so the curve meets it where ${n(k)} − ${co(p)}x² = ${n(c)}. Then ${onAxis} and x = ${n(s)}. The contour line through the beacon crosses the x-axis at (${n(s)}, 0).`,
   guidance: [
    { prompt: `What is h${pt(a, b)}, the height at the beacon?`, answer: [c], explanation: `h${pt(a, b)} = ${n(k)} − ${pa} − ${qb} = ${n(c)} metres. The beacon’s contour line is the level curve h(x, y) = ${n(c)}.` },
    { prompt: `On the x-axis y = 0, so the contour line meets it where ${n(k)} − ${co(p)}x² = ${n(c)}. What is x² there?`, answer: [s2], explanation: `${p === 1 ? `x² = ${n(k)} − ${n(c)}` : `${n(p)}x² = ${n(k)} − ${n(c)} = ${n(k - c)}, so x²`} = ${n(s2)}.` },
    { prompt: `x² = ${n(s2)}. What is the positive x?`, answer: [s], explanation: `√${n(s2)} = ${n(s)}, so the contour line crosses the x-axis at (${n(s)}, 0). Check: h(${n(s)}, 0) = ${n(k)} − ${p === 1 ? '' : n(p) + ' × '}${n(s2)} = ${n(c)}, the same level as the beacon.` }
   ] }; }
 },
 /* kind 0: Axy ÷ (x² + By²), which is the constant Am ÷ (1 + Bm²) on the line y = mx: two different values, no limit.
    kind 1: (x² − A²y²) ÷ (x − Ay), which is x + Ay wherever it has a value: limit 0 along every line, and the limit exists.
    For kind 1, B is unused. Not the worked example (6xy ÷ (x² + 2y²) on y = x and y = −x). */
 q13: {
  canonical: { kind: 0, A: 10, B: 1, m1: 1, m2: 2 },
  draw: R => { if (R.int(1, 3) === 1) { const m = R.pick([[1, 2], [1, -1], [2, -1], [1, 3], [-2, 1], [3, -1], [2, 3]]); return { kind: 1, A: R.int(2, 5), B: 0, m1: m[0], m2: m[1] }; }
   let o; do { const [A, B, m1, m2] = R.pick(Q13); o = { kind: 0, A, B, m1, m2 }; } while (o.A === 6 && o.B === 2); return o; },
  build: ({ kind, A, B, m1, m2 }) => {
   const f = kind ? `(x² − ${n(A * A)}y²) ÷ (x − ${co(A)}y)` : `${co(A)}xy ÷ (x² + ${co(B)}y²)`;
   const val = m => kind ? 0 : A * m / (1 + B * m * m), v1 = val(m1), v2 = val(m2), code = kind ? 1 : 0;
   const along = m => kind
    ? `Along ${line(m)}, f = (x² − ${n(A * A)}(${mx(m)})²) ÷ (x − ${co(A)}(${mx(m)})) = ${n(1 - A * A * m * m)}x² ÷ (${mx(1 - A * m)}) = ${mx(1 + A * m)}, which approaches 0 as x approaches 0.`
    : `Along ${line(m)}, f = ${co(A)}x(${mx(m)}) ÷ (x² + ${co(B)}(${mx(m)})²) = ${n(A * m)}x² ÷ (${n(1 + B * m * m)}x²) = ${n(val(m))} for every x other than 0, so the limit along that line is ${n(val(m))}.`;
   const verdict = kind
    ? `Both lines give 0, but that alone proves nothing. What settles it: x² − ${n(A * A)}y² = (x − ${co(A)}y)(x + ${co(A)}y), so wherever f has a value it equals x + ${co(A)}y, a formula with no division. Direct substitution gives 0 + ${n(A)} × 0 = 0 however (x, y) approaches (0, 0), so the limit exists and is 0: enter 1.`
    : `The two lines give different limits, ${n(v1)} and ${n(v2)}, so f has no single limit at (0, 0): enter 0.`;
   return {
   prompt: `A tilt meter on the crater floor sits at the origin (0, 0). At nearby points (x, y) it reports f(x, y) = ${f}, and it reports nothing where the formula divides by 0, as at the origin itself. Find the limit of f as (x, y) approaches (0, 0) along the line ${line(m1)}, then along the line ${line(m2)}. Enter those two limits, then 1 if the limit of f as (x, y) approaches (0, 0) exists, or 0 if it does not.`,
   answer: [v1, v2, code],
   hints: ['On the line y = mx, replace every y by mx and simplify. Either the x’s cancel and leave a fixed number, or a factor x is left over, which approaches 0.', 'Two paths with different limits prove there is no limit. Equal limits along two lines prove nothing on their own: the limit exists when f simplifies to a formula you can put (0, 0) into.'],
   solution: `${along(m1)} ${along(m2)} ${verdict}`,
   guidance: [
    { prompt: `Put y = ${mx(m1)} into f(x, y) = ${f}. What is the limit along the line ${line(m1)}?`, answer: [v1], explanation: along(m1) },
    { prompt: `Now put y = ${mx(m2)} into f. What is the limit along the line ${line(m2)}?`, answer: [v2], explanation: along(m2) },
    { prompt: `Along the two lines the limits are ${n(v1)} and ${n(v2)}. Enter 1 if the limit of f at (0, 0) exists, 0 if not.`, answer: [code], explanation: verdict }
   ] }; }
 },
 /* h = ax²y + bxy² + ce^(x − y) at a point (p, p), where e^(x − y) = 1: h_x = (2a + b)p² + c, h_y = (a + 2b)p² − c.
    Not the worked example (x²y + 2e^(x − y) at (1, 1)). */
 q14: {
  canonical: { a: 3, b: -2, c: 4, p: 2 },
  draw: R => { let o; do { o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-5, 5), p: R.pick([-2, -1, 1, 2, 3]) }; } while (o.a === 1 && o.c === 2 && o.p === 1); return o; },
  build: ({ a, b, c, p }) => { const E = 'e^(x − y)', p2 = p * p, hx = (2 * a + b) * p2 + c, hy = (a + 2 * b) * p2 - c;
   const f = ex([[a, 'x²y'], [b, 'xy²'], [c, E]]), fx = ex([[2 * a, 'xy'], [b, 'y²'], [c, E]]), fy = ex([[a, 'x²'], [2 * b, 'xy'], [-c, E]]), P = pt(p, p); return {
   prompt: `The Terrain Lab’s model of a ridge gives the ground height as h(x, y) = ${f} metres, where x is metres east and y is metres north. Enter the slope going east, the partial derivative ∂h/∂x, at the point ${P}. Then enter the slope going north, ∂h/∂y, at the same point.`,
   answer: [hx, hy],
   hints: ['For ∂h/∂x, treat y as a fixed number and differentiate with respect to x as in Calculus 1. For ∂h/∂y, hold x fixed instead.', 'By the chain rule, e^(x − y) differentiates to e^(x − y) with respect to x, and to −e^(x − y) with respect to y. Where x and y are equal, e^(x − y) = e⁰ = 1.'],
   solution: `Holding y fixed, ∂h/∂x = ${fx}. At ${P}, where e^(x − y) = 1, this is ${sm([2 * a * p2, b * p2, c])} = ${n(hx)}. Holding x fixed, ∂h/∂y = ${fy}. At ${P} this is ${sm([a * p2, 2 * b * p2, -c])} = ${n(hy)}.`,
   guidance: [
    { prompt: `What is e^(x − y) at the point ${P}?`, answer: [1], explanation: `There x − y = ${n(p)} − ${par(p)} = 0, and e⁰ = 1.` },
    { prompt: `Hold y fixed and differentiate with respect to x. What is ∂h/∂x at ${P}?`, answer: [hx], explanation: `∂h/∂x = ${fx}. At ${P}: ${sm([2 * a * p2, b * p2, c])} = ${n(hx)}.` },
    { prompt: `Hold x fixed and differentiate with respect to y. What is ∂h/∂y at ${P}?`, answer: [hy], explanation: `∂h/∂y = ${fy}: the y in the exponent brings a factor −1. At ${P}: ${sm([a * p2, 2 * b * p2, -c])} = ${n(hy)}.` }
   ] }; }
 },
 /* h = ax³ + bx²y + cxy² + dy³: h_xx = 6ax + 2by, h_yy = 2cx + 6dy, h_xy = 2bx + 2cy. Not the worked example (x³y + y² at (2, 1)). */
 q15: {
  canonical: { a: 2, b: -3, c: 1, d: 1, x: 2, y: 1 },
  draw: R => ({ a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), d: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3) }),
  build: ({ a, b, c, d, x, y }) => { const xx = 6 * a * x + 2 * b * y, yy = 2 * c * x + 6 * d * y, xy = 2 * b * x + 2 * c * y, P = pt(x, y);
   const f = ex([[a, 'x³'], [b, 'x²y'], [c, 'xy²'], [d, 'y³']]), hx = ex([[3 * a, 'x²'], [2 * b, 'xy'], [c, 'y²']]), hy = ex([[b, 'x²'], [2 * c, 'xy'], [3 * d, 'y²']]);
   const Fxx = ex([[6 * a, 'x'], [2 * b, 'y']]), Fyy = ex([[2 * c, 'x'], [6 * d, 'y']]), Fxy = ex([[2 * b, 'x'], [2 * c, 'y']]); return {
   prompt: `A terrain model gives the height of a crater wall as h(x, y) = ${f} metres. How the slopes themselves change tells the rover team how sharply the ground curves. Enter the second partial derivatives h_xx and h_yy at the point ${P}, then the mixed partial derivative h_xy there.`,
   answer: [xx, yy, xy],
   hints: ['Find the first partial derivatives h_x and h_y first. Then differentiate h_x with respect to x to get h_xx, and h_y with respect to y to get h_yy.', 'For the mixed partial h_xy, differentiate h_x with respect to y. Differentiating h_y with respect to x gives the same result.'],
   solution: `The first partial derivatives are h_x = ${hx} and h_y = ${hy}. Then h_xx = ${Fxx}, which at ${P} is ${sm([6 * a * x, 2 * b * y])} = ${n(xx)}; h_yy = ${Fyy}, which is ${sm([2 * c * x, 6 * d * y])} = ${n(yy)}; and h_xy = ${Fxy}, which is ${sm([2 * b * x, 2 * c * y])} = ${n(xy)}. Differentiating h_y with respect to x gives the same ${Fxy}, as Clairaut’s theorem says it must.`,
   guidance: [
    { prompt: `h_x = ${hx}. Differentiate it with respect to x. What is h_xx at ${P}?`, answer: [xx], explanation: `h_xx = ${Fxx}. At ${P}: ${sm([6 * a * x, 2 * b * y])} = ${n(xx)}.` },
    { prompt: `h_y = ${hy}. Differentiate it with respect to y. What is h_yy at ${P}?`, answer: [yy], explanation: `h_yy = ${Fyy}. At ${P}: ${sm([2 * c * x, 6 * d * y])} = ${n(yy)}.` },
    { prompt: `Differentiate h_x = ${hx} with respect to y. What is h_xy at ${P}?`, answer: [xy], explanation: `h_xy = ${Fxy}. At ${P}: ${sm([2 * b * x, 2 * c * y])} = ${n(xy)}. Starting from h_y and differentiating with respect to x gives the same.` }
   ] }; }
 },
 /* h = k + ax² + bxy + cy² at (x, y), stepping by tenths (dx, dy given in tenths): the estimate has one decimal.
    Both slopes are non-zero. Not the worked example (50 − x² − y² at (1, 2)). */
 q16: {
  canonical: { k: 80, a: -2, b: 1, c: -1, x: 3, y: 2, dx: 1, dy: -2 },
  draw: R => { let o; do { o = { k: R.int(90, 150), a: R.int(-3, -1), b: R.nz(-3, 3), c: R.int(-3, -1), x: R.nz(-3, 3), y: R.nz(-3, 3), dx: R.pick([-2, -1, 1, 2]), dy: R.pick([-2, -1, 1, 2]) }; }
   while (2 * o.a * o.x + o.b * o.y === 0 || o.b * o.x + 2 * o.c * o.y === 0); return o; },
  build: ({ k, a, b, c, x, y, dx, dy }) => { const H = k + a * x * x + b * x * y + c * y * y, fx = 2 * a * x + b * y, fy = b * x + 2 * c * y;
   const Dx = dx / 10, Dy = dy / 10, est = Math.round(10 * H + fx * dx + fy * dy) / 10, P = pt(x, y), Q = pt(x + Dx, y + Dy);
   const f = ex([[k, ''], [a, 'x²'], [b, 'xy'], [c, 'y²']]), Fx = ex([[2 * a, 'x'], [b, 'y']]), Fy = ex([[b, 'x'], [2 * c, 'y']]);
   const plane = `z = ${ex([[H, ''], [fx, shift(x, 'x')], [fy, shift(y, 'y')]])}`, Lsum = `${n(H)} + ${par(fx)} × ${par(Dx)} + ${par(fy)} × ${par(Dy)} = ${sm([H, fx * Dx, fy * Dy])} = ${n(est)}`; return {
   prompt: `A survey crew stands on the crater rim above the map point ${P}. The ground height is h(x, y) = ${f} metres. The tangent plane there has slope h_x${P} in the x-direction and slope h_y${P} in the y-direction. Enter both slopes, then use the linear approximation to estimate the height at the nearby point ${Q}, in metres.`,
   answer: [fx, fy, est],
   hints: ['Find h_x and h_y by holding the other variable fixed, then put in the point.', 'The linear approximation is L = h(a, b) + h_x(a, b) × Δx + h_y(a, b) × Δy, where Δx and Δy are the steps from (a, b) to the nearby point.'],
   solution: `h${P} = ${sm([k, a * x * x, b * x * y, c * y * y])} = ${n(H)}. h_x = ${Fx}, so h_x${P} = ${sm([2 * a * x, b * y])} = ${n(fx)}; h_y = ${Fy}, so h_y${P} = ${sm([b * x, 2 * c * y])} = ${n(fy)}. The tangent plane is ${plane}. The steps are Δx = ${n(Dx)} and Δy = ${n(Dy)}, so L = ${Lsum} metres.`,
   guidance: [
    { prompt: `What is the height h${P}?`, answer: [H], explanation: `h${P} = ${sm([k, a * x * x, b * x * y, c * y * y])} = ${n(H)} metres.` },
    { prompt: `h_x = ${Fx} and h_y = ${Fy}. What are h_x${P} and h_y${P}?`, answer: [fx, fy], explanation: `h_x${P} = ${sm([2 * a * x, b * y])} = ${n(fx)} and h_y${P} = ${sm([b * x, 2 * c * y])} = ${n(fy)}. These are the two slopes of the tangent plane.` },
    { prompt: `From ${P} to ${Q} the steps are Δx = ${n(Dx)} and Δy = ${n(Dy)}. What is the estimate L = h + h_x × Δx + h_y × Δy?`, answer: [est], explanation: `L = ${Lsum} metres.` }
   ] }; }
 },
 /* h = k + ax²y + by³ + cx: h_x = 2axy + c, h_y = ax² + 3by². Steps in tenths. Not the worked example (20 + xy² at (1, 2)). */
 q17: {
  canonical: { k: 40, a: 1, b: -1, c: 3, x: 2, y: 3, dx: 2, dy: -1 },
  draw: R => { let o; do { o = { k: R.int(40, 90), a: R.pick([-2, -1, 1, 2]), b: R.pick([-2, -1, 1]), c: R.nz(-4, 4), x: R.int(1, 3), y: R.int(1, 3), dx: R.pick([-2, -1, 1, 2]), dy: R.pick([-2, -1, 1, 2]) }; }
   while (2 * o.a * o.x * o.y + o.c === 0 || o.a * o.x * o.x + 3 * o.b * o.y * o.y === 0 || o.k + o.a * o.x * o.x * o.y + o.b * o.y ** 3 + o.c * o.x < 5); return o; },
  build: ({ k, a, b, c, x, y, dx, dy }) => { const H = k + a * x * x * y + b * y ** 3 + c * x, fx = 2 * a * x * y + c, fy = a * x * x + 3 * b * y * y;
   const Dx = dx / 10, Dy = dy / 10, est = Math.round(10 * H + fx * dx + fy * dy) / 10, P = pt(x, y), Q = pt(x + Dx, y + Dy);
   const f = ex([[k, ''], [a, 'x²y'], [b, 'y³'], [c, 'x']]), Fx = ex([[2 * a, 'xy'], [c, '']]), Fy = ex([[a, 'x²'], [3 * b, 'y²']]);
   const Lsum = `${n(H)} + ${par(fx)} × ${par(Dx)} + ${par(fy)} × ${par(Dy)} = ${sm([H, fx * Dx, fy * Dy])} = ${n(est)}`; return {
   prompt: `The contour map of a crater slope comes from h(x, y) = ${f} metres, with x in metres east and y in metres north. A rover is parked at ${P}. Enter the level of the contour line it is parked on, which is the height there. Then enter the slope of the ground going north, h_y${P}, and the linear estimate of the height at ${Q}.`,
   answer: [H, fy, est],
   hints: ['The rover’s contour line is the level curve h(x, y) = c through its point, so c is the height at that point.', 'The estimate needs both slopes: L = h + h_x × Δx + h_y × Δy, with the steps Δx and Δy from the rover to the new point.'],
   solution: `h${P} = ${sm([k, a * x * x * y, b * y ** 3, c * x])} = ${n(H)}, so the rover is on the ${n(H)} m contour line. h_x = ${Fx}, which at ${P} is ${n(fx)}, and h_y = ${Fy}, which is ${sm([a * x * x, 3 * b * y * y])} = ${n(fy)}. With Δx = ${n(Dx)} and Δy = ${n(Dy)}, L = ${Lsum} metres.`,
   guidance: [
    { prompt: `What is h${P}, the level of the rover’s contour line?`, answer: [H], explanation: `h${P} = ${sm([k, a * x * x * y, b * y ** 3, c * x])} = ${n(H)} metres.` },
    { prompt: `h_x = ${Fx} and h_y = ${Fy}. What are h_x${P} and h_y${P}?`, answer: [fx, fy], explanation: `h_x${P} = ${sm([2 * a * x * y, c])} = ${n(fx)} and h_y${P} = ${sm([a * x * x, 3 * b * y * y])} = ${n(fy)}.` },
    { prompt: `The steps to ${Q} are Δx = ${n(Dx)} and Δy = ${n(Dy)}. What is the estimate L?`, answer: [est], explanation: `L = ${Lsum} metres.` }
   ] }; }
 },
 /* T = ax² + bxy + cy² along x = p + qt, y = rt², at t = s. Not the worked example (T = xy, x = t², y = 3t). */
 q18: {
  canonical: { a: 3, b: -2, c: 1, p: 1, q: 2, r: 1, s: 1 },
  /* The rate stays below 1000, so there are no thousands to type. */
  draw: R => { let o; do { o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), p: R.int(1, 4), q: R.int(1, 3), r: R.int(1, 2), s: R.int(1, 3) }; }
   while (Math.abs(rate18(o)) >= 1000); return o; },
  build: ({ a, b, c, p, q, r, s }) => { const X = p + q * s, Y = r * s * s, Tx = 2 * a * X + b * Y, Ty = b * X + 2 * c * Y, vy = 2 * r * s, rate = Tx * q + Ty * vy;
   const T = ex([[a, 'x²'], [b, 'xy'], [c, 'y²']]), Fx = ex([[2 * a, 'x'], [b, 'y']]), Fy = ex([[b, 'x'], [2 * c, 'y']]), xt = ex([[p, ''], [q, 't']]), yt = ex([[r, 't²']]), dy = ex([[2 * r, 't']]); return {
   prompt: `A weather balloon drifts over the plain. The temperature at the point (x, y) is T(x, y) = ${T} degrees Celsius, with x and y in kilometres, and t hours after release the balloon is at x(t) = ${xt}, y(t) = ${yt}. At t = ${n(s)}, enter ∂T/∂x and ∂T/∂y at the balloon’s position, in degrees per kilometre. Then enter dT/dt, the rate at which the balloon’s temperature is changing, in degrees per hour.`,
   answer: [Tx, Ty, rate],
   hints: ['First find where the balloon is at that time, and put that point into ∂T/∂x and ∂T/∂y.', 'The multivariable chain rule: dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt.'],
   solution: `At t = ${n(s)} the balloon is at x = ${n(X)}, y = ${n(Y)}. There ∂T/∂x = ${Fx} = ${sm([2 * a * X, b * Y])} = ${n(Tx)} and ∂T/∂y = ${Fy} = ${sm([b * X, 2 * c * Y])} = ${n(Ty)}. Also dx/dt = ${n(q)} and dy/dt = ${dy} = ${n(vy)}. By the multivariable chain rule, dT/dt = ${par(Tx)} × ${n(q)} + ${par(Ty)} × ${n(vy)} = ${sm([Tx * q, Ty * vy])} = ${n(rate)} °C per hour.`,
   guidance: [
    { prompt: `Where is the balloon at t = ${n(s)}? Enter x(${n(s)}) and y(${n(s)}).`, answer: [X, Y], explanation: `x(${n(s)}) = ${sm([p, q * s])} = ${n(X)} and y(${n(s)}) = ${r === 1 ? '' : n(r) + ' × '}${n(s)}² = ${n(Y)}.` },
    { prompt: `∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are they at ${pt(X, Y)}?`, answer: [Tx, Ty], explanation: `∂T/∂x = ${sm([2 * a * X, b * Y])} = ${n(Tx)} and ∂T/∂y = ${sm([b * X, 2 * c * Y])} = ${n(Ty)}.` },
    { prompt: `What are dx/dt and dy/dt at t = ${n(s)}?`, answer: [q, vy], explanation: `dx/dt = ${n(q)} for every t, and dy/dt = ${dy}, which is ${n(vy)} at t = ${n(s)}.` },
    { prompt: `Put them together: what is dT/dt = ∂T/∂x × dx/dt + ∂T/∂y × dy/dt?`, answer: [rate], explanation: `dT/dt = ${par(Tx)} × ${n(q)} + ${par(Ty)} × ${n(vy)} = ${sm([Tx * q, Ty * vy])} = ${n(rate)} °C per hour.` }
   ] }; }
 },
 /* T = ax² + bxy + cy² at (x, y) in the direction ⟨u, v⟩ of length 5: the rate (fx u + fy v) ÷ 5 has at most one decimal.
    Not the worked example (x² + y² at (1, 2), direction ⟨4, −3⟩). */
 q19: {
  canonical: { a: 1, b: 3, c: -2, x: 2, y: 1, u: 3, v: 4 },
  draw: R => { let o; do { const [u, v] = R.pick(Q19DIR); o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3), u, v }; }
   while (2 * o.a * o.x + o.b * o.y === 0 || o.b * o.x + 2 * o.c * o.y === 0); return o; },
  build: ({ a, b, c, x, y, u, v }) => { const fx = 2 * a * x + b * y, fy = b * x + 2 * c * y, ux = u / 5, uy = v / 5, rate = Math.round(2 * (fx * u + fy * v)) / 10, P = pt(x, y);
   const T = ex([[a, 'x²'], [b, 'xy'], [c, 'y²']]), Fx = ex([[2 * a, 'x'], [b, 'y']]), Fy = ex([[b, 'x'], [2 * c, 'y']]), D = `⟨${n(u)}, ${n(v)}⟩`;
   const dot = `${par(fx)} × ${par(ux)} + ${par(fy)} × ${par(uy)} = ${sm([fx * ux, fy * uy])} = ${n(rate)}`; return {
   prompt: `The weather mast maps the air temperature near the ground as T(x, y) = ${T} degrees Celsius, with x and y in kilometres. At the point ${P} the wind blows in the direction of the vector ${D}. Enter the two components of the gradient ∇T at ${P}. Then enter the directional derivative of T in the wind’s direction: the rate, in degrees per kilometre, at which the temperature changes as you move with the wind.`,
   answer: [fx, fy, rate],
   hints: ['The gradient is ∇T = ⟨∂T/∂x, ∂T/∂y⟩, worked out at the point.', 'Divide the direction vector by its length to get a unit vector u. The directional derivative is the dot product ∇T · u.'],
   solution: `∂T/∂x = ${Fx} = ${sm([2 * a * x, b * y])} = ${n(fx)} and ∂T/∂y = ${Fy} = ${sm([b * x, 2 * c * y])} = ${n(fy)}, so ∇T${P} = ⟨${n(fx)}, ${n(fy)}⟩. The vector ${D} has length √(${n(u * u)} + ${n(v * v)}) = 5, so the unit vector is u = ⟨${n(u)}/5, ${n(v)}/5⟩ = ⟨${n(ux)}, ${n(uy)}⟩. The directional derivative is ∇T · u = ${dot} °C per kilometre.`,
   guidance: [
    { prompt: `∂T/∂x = ${Fx} and ∂T/∂y = ${Fy}. What are the components of ∇T at ${P}?`, answer: [fx, fy], explanation: `∂T/∂x = ${sm([2 * a * x, b * y])} = ${n(fx)} and ∂T/∂y = ${sm([b * x, 2 * c * y])} = ${n(fy)}, so ∇T${P} = ⟨${n(fx)}, ${n(fy)}⟩.` },
    { prompt: `The vector ${D} has length 5. What are the components of the unit vector u in its direction, as decimals?`, answer: [ux, uy], explanation: `Divide each component by 5: u = ⟨${n(u)}/5, ${n(v)}/5⟩ = ⟨${n(ux)}, ${n(uy)}⟩.` },
    { prompt: `What is the directional derivative ∇T · u?`, answer: [rate], explanation: `∇T · u = ${dot} °C per kilometre.` }
   ] }; }
 },
 /* P = ax² + bxy + cy² at (x, y) with a gradient of whole length L; the angle with ⟨1, 0⟩ is arccos(fx ÷ L), rounded to
    3 decimals, never near a rounding tie. Not the worked example (x² + y² at (3, 4)). */
 q20: {
  canonical: { a: 1, b: 3, c: -1, x: 3, y: 2 },
  draw: R => { let o, fx, fy, L, th; do { o = { a: R.nz(-3, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), x: R.nz(-3, 3), y: R.nz(-3, 3) };
   fx = 2 * o.a * o.x + o.b * o.y; fy = o.b * o.x + 2 * o.c * o.y; L = Math.hypot(fx, fy); th = Math.acos(fx / L) * 1000; }
   while (!fx || !fy || !Number.isInteger(L) || Math.abs(th - Math.floor(th) - 0.5) < 0.02); return o; },
  build: ({ a, b, c, x, y }) => { const fx = 2 * a * x + b * y, fy = b * x + 2 * c * y, L = Math.round(Math.hypot(fx, fy)), th = Math.round(1000 * Math.acos(fx / L)) / 1000, P = pt(x, y);
   const F = ex([[a, 'x²'], [b, 'xy'], [c, 'y²']]), Fx = ex([[2 * a, 'x'], [b, 'y']]), Fy = ex([[b, 'x'], [2 * c, 'y']]); return {
   prompt: `Above the plain, the air pressure differs from its base level by P(x, y) = ${F} pascals, with x and y in kilometres (x points east). A drone at ${P} must climb the pressure as fast as it can. Enter the greatest rate of increase of P at ${P}, in pascals per kilometre. Then enter the angle between the direction of steepest ascent and due east, the direction of ⟨1, 0⟩, in radians to 3 decimal places.`,
   answer: [L, th],
   hints: ['The greatest rate of increase is the length of the gradient: ‖∇P‖ = √((∂P/∂x)² + (∂P/∂y)²).', 'The steepest way up is the direction of ∇P. The angle θ between ∇P and ⟨1, 0⟩ comes from the dot product: cos θ = (∇P · ⟨1, 0⟩) ÷ ‖∇P‖, with θ between 0 and π.'],
   solution: `∂P/∂x = ${Fx} = ${sm([2 * a * x, b * y])} = ${n(fx)} and ∂P/∂y = ${Fy} = ${sm([b * x, 2 * c * y])} = ${n(fy)}, so ∇P${P} = ⟨${n(fx)}, ${n(fy)}⟩. The greatest rate of increase is ‖∇P‖ = √(${n(fx * fx)} + ${n(fy * fy)}) = √${n(L * L)} = ${n(L)} pascals per kilometre, in the direction of ∇P. For the angle with ⟨1, 0⟩, ∇P · ⟨1, 0⟩ = ${n(fx)}, so cos θ = ${n(fx)} ÷ ${n(L)} and θ = arccos(${n(fx)} ÷ ${n(L)}), which is ${dpl(th, 3)} radians to 3 decimal places.`,
   guidance: [
    { prompt: `∂P/∂x = ${Fx} and ∂P/∂y = ${Fy}. What are the components of ∇P at ${P}?`, answer: [fx, fy], explanation: `∂P/∂x = ${sm([2 * a * x, b * y])} = ${n(fx)} and ∂P/∂y = ${sm([b * x, 2 * c * y])} = ${n(fy)}.` },
    { prompt: `What is the length ‖∇P‖ of ⟨${n(fx)}, ${n(fy)}⟩?`, answer: [L], explanation: `${n(fx * fx)} + ${n(fy * fy)} = ${n(L * L)}, and √${n(L * L)} = ${n(L)}. That is the greatest rate of increase, in pascals per kilometre.` },
    { prompt: `cos θ = ${n(fx)} ÷ ${n(L)}. What is θ in radians, to 3 decimal places?`, answer: [th], explanation: `θ = arccos(${n(fx)} ÷ ${n(L)}), which is ${dpl(th, 3)} radians to 3 decimal places${fx < 0 ? ': more than π/2, because ∇P points partly west' : ''}.` }
   ] }; }
 }
});
})();
