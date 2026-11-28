/* Differential equations mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Signed terms: trm(−1, 'y′') is '− y′', trm(3, 'y') is '+ 3y'; cf(−1, 'e^t') is '−e^t', cf(2, 'e^t') is '2e^t'. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const cf = (v, x) => `${v === 1 ? '' : v === -1 ? '−' : n(v)}${x}`;
/* e^(rt) as text: e^t, e^(−t), e^(3t). */
const ex = (r, v = 't') => r === 1 ? `e^${v}` : r === -1 ? `e^(−${v})` : `e^(${n(r)}${v})`;
/* A 2 × 2 matrix in words: rows (a, b) and (c, d). */
const rows = M => `rows ${G.vec(M[0])} and ${G.vec(M[1])}`;
/* (λ − r) as text, and the quadratic λ² − (trace)λ + det = 0 without a 0λ term. */
const fac = r => `(λ ${sgn(-r)} ${n(Math.abs(r))})`;
const quad = (tr, dt) => `λ²${tr === 0 ? '' : ' ' + trm(-tr, 'λ')} ${sgn(dt)} ${n(Math.abs(dt))} = 0`;
/* a sum c₁e^(λ₁t) ± c₂e^(λ₂t) */
const pair = (c1, l1, c2, l2) => `${cf(c1, ex(l1))} ${sgn(c2)} ${cf(Math.abs(c2), ex(l2))}`;
const bt = b => b === 1 ? 't' : `${n(b)}t`;
/* c × 2^λ as text: '2.5 ÷ 64' for λ = −6, '3 × 4' for λ = 2, so no long decimal is printed. */
const by2 = (c, l) => l < 0 ? `${par(c)} ÷ ${n(Math.pow(2, -l))}` : `${par(c)} × ${n(Math.pow(2, l))}`;
const r3 = x => Math.round(x * 1000) / 1000;
const exact3 = x => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7;
/* Bounded retry: at most 1000 tries, then the canonical parameters (docs/plans/AUTHOR-BRIEF.md, wave 2). */
const tryDraw = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const det2 = M => M[0][0] * M[1][1] - M[0][1] * M[1][0];
const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
/* q21 and its bench: (p, j) with p² + j² a perfect square h². With m = 1, c = 2j and k = p² + 2j², the practical
   resonance frequency is p and √((k − ω²)² + (cω)²) at ω = p is 2jh, both whole numbers. */
const PAIRS21 = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [12, 5, 13]];
/* q22: the three functions and their 3 × 3 matrix at t = 0. */
const wr22 = ({ r, dep, al, be }) => { const col = x => [1, x, x * x], c1 = col(r[0]), c2 = col(r[1]),
 c3 = dep ? [0, 1, 2].map(i => al * c1[i] + be * c2[i]) : col(r[2]);
 const M = [0, 1, 2].map(i => [c1[i], c2[i], c3[i]]); return { M, W: det3(M), c3 }; };
/* q26 and q28: A = P D P⁻¹ with P = (1, 1; m, m + 1), det P = 1, eigenvectors (1, m) for l1 and (1, m + 1) for l2. */
const fromReal = (l1, l2, m) => [[l1 * (m + 1) - l2 * m, l2 - l1], [m * (m + 1) * (l1 - l2), (m + 1) * l2 - m * l1]];
/* q27 and q28: a matrix with eigenvalues a ± bi, from (a, −b; b, a) by a shear with m; flip uses the other shear. */
const fromComplex = (a, b, m, flip) => flip ? [[a - m * b, -b * (1 + m * m)], [b, a + m * b]] : [[a + m * b, -b], [b * (1 + m * m), a - m * b]];
const big = M => M.some(r => r.some(v => Math.abs(v) > 12));
/* q29: tank sets (V1, V2 litres, f fresh-water flow, g return flow, L/min) whose matrix has distinct whole-number
   eigenvalues; found by a search over V in {10, 20, 25, 40, 50, 100} and f, g up to 40. */
const TANKS29 = [[10, 10, 15, 5], [10, 10, 16, 9], [10, 10, 24, 1], [10, 10, 30, 10], [10, 10, 40, 5], [10, 20, 25, 15], [10, 25, 30, 20], [20, 10, 25, 15], [20, 20, 30, 10], [20, 20, 32, 18], [25, 10, 30, 20]];
const tank29 = ({ i, s1, s2 }) => { const [V1, V2, f, g] = TANKS29[i], a = (f + g) / V1, b = g / V2, c = (f + g) / V2,
 tr = a + c, dt = a * (c - b), root = Math.sqrt(tr * tr - 4 * dt), l1 = Math.round((-tr - root) / 2), l2 = Math.round((-tr + root) / 2),
 d0 = G.tidy(-a * s1 + b * s2), p = G.tidy((d0 - l2 * s1) / (l1 - l2)), q = G.tidy(s1 - p), x1 = p * Math.pow(2, l1) + q * Math.pow(2, l2);
 return { V1, V2, f, g, a, b, c, tr, dt, l1, l2, d0, p, q, x1 }; };
/* q30: ℒ of each piece at s. */
const fact = k => k === 1 ? 1 : k === 2 ? 2 : 6;
const lap30 = ({ al, k, be, a, ga, trig, b, s }) => ({ P: al * fact(k) / Math.pow(s, k + 1), X: be / (s - a), Q: ga * (trig === 'sin' ? b : s) / (s * s + b * b) });
const pw = k => k === 1 ? 't' : k === 2 ? 't²' : 't³';
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* m x″ + c x′ + k x = F₀ cos(ωt) with m from 1 to 4, (c, k) = m × (2j, p² + 2j²) from PAIRS21 and F₀ chosen so the
    largest amplitude is 0.1 to 0.5 m. Never the worked example (m = 1, c = 2, k = 6). */
 q21: {
  canonical: { m: 2, i: 1, A: 0.2 },
  draw: R => ({ m: R.int(1, 4), i: R.int(0, PAIRS21.length - 1), A: R.pick([0.1, 0.2, 0.3, 0.4, 0.5]) }),
  build: ({ m, i, A }) => { const [p, j, h] = PAIRS21[i], c = 2 * j * m, k = (p * p + 2 * j * j) * m, w2 = p * p, D = 2 * j * h * m, F = G.tidy(D * A),
   km = k / m, cc = c * c / (2 * m * m), u = k - m * w2, cw = c * p; return {
   prompt: `An engine mount obeys ${m === 1 ? '' : n(m)}x″ + ${n(c)}x′ + ${n(k)}x = ${n(F)} cos(ωt): mass ${n(m)} kg, damping ${n(c)} N·s/m, stiffness ${n(k)} N/m, and a push of size ${n(F)} N whose angular frequency ω (in rad/s) the engine can choose. The steady swing has amplitude C(ω) = ${n(F)} ÷ √((${n(k)} − ${m === 1 ? '' : n(m)}ω²)² + (${n(c)}ω)²) metres. Enter the practical resonance frequency, the ω that makes the amplitude largest, then that largest amplitude in metres.`,
   answer: [p, A],
   hints: ['The amplitude is largest where the quantity under the square root is smallest. Write u = ω² and find where (k − mu)² + c²u has slope zero.', 'Setting that slope to zero gives ω² = k/m − c²/(2m²). This is positive only when c² < 2mk; then put that ω back into C(ω).'],
   solution: `Under the root is (k − mu)² + c²u with u = ω². Its derivative in u is −2m(k − mu) + c², which is zero at u = k/m − c²/(2m²) = ${n(km)} − ${n(cc)} = ${n(w2)}. So the practical resonance frequency is ω = √${n(w2)} = ${n(p)} rad/s. There k − mω² = ${n(k)} − ${n(m * w2)} = ${n(u)} and cω = ${n(c)} × ${n(p)} = ${n(cw)}, so the root is √(${n(u * u)} + ${n(cw * cw)}) = √${n(D * D)} = ${n(D)}. The largest amplitude is ${n(F)} ÷ ${n(D)} = ${n(A)} m.`,
   guidance: [
    { prompt: `The best ω satisfies ω² = k/m − c²/(2m²). What is ω² for this mount?`, answer: [w2], explanation: `k/m = ${n(k)} ÷ ${n(m)} = ${n(km)} and c²/(2m²) = ${n(c * c)} ÷ ${n(2 * m * m)} = ${n(cc)}, so ω² = ${n(km)} − ${n(cc)} = ${n(w2)}.` },
    { prompt: `ω² = ${n(w2)}. What is the practical resonance frequency ω in rad/s?`, answer: [p], explanation: `ω = √${n(w2)} = ${n(p)} rad/s, the positive root.` },
    { prompt: `At ω = ${n(p)}, what is √((k − mω²)² + (cω)²)?`, answer: [D], explanation: `k − mω² = ${n(k)} − ${n(m * w2)} = ${n(u)} and cω = ${n(cw)}. Then ${n(u * u)} + ${n(cw * cw)} = ${n(D * D)}, whose square root is ${n(D)}.` },
    { prompt: `What is the largest amplitude, ${n(F)} ÷ ${n(D)}, in metres?`, answer: [A], explanation: `${n(F)} ÷ ${n(D)} = ${n(A)} m. Any other forcing frequency gives a larger root and a smaller swing.` }
   ] }; }
 },
 /* Three distinct non-zero roots from −3 to 3 whose sums give non-zero coefficients; half the draws replace the third
    function by a combination of the first two (then W = 0). Never the roots of the worked example (1, −1, 2). */
 q22: {
  canonical: { r: [1, -2, 3], dep: false, al: 0, be: 0 },
  draw: R => tryDraw(() => { const r = []; while (r.length < 3) { const v = R.nz(-3, 3); if (!r.includes(v)) r.push(v); }
   const dep = R.bool(); return { r, dep, al: dep ? R.nz(-3, 3) : 0, be: dep ? R.nz(-3, 3) : 0 }; },
   ({ r }) => { const s1 = r[0] + r[1] + r[2], s2 = r[0] * r[1] + r[0] * r[2] + r[1] * r[2], key = [...r].sort().join();
    return s1 !== 0 && s2 !== 0 && key !== [-1, 1, 2].sort().join(); }, { r: [1, -2, 3], dep: false, al: 0, be: 0 }),
  build: ({ r, dep, al, be }) => { const s1 = r[0] + r[1] + r[2], s2 = r[0] * r[1] + r[0] * r[2] + r[1] * r[2], s3 = r[0] * r[1] * r[2],
   { M, W, c3 } = wr22({ r, dep, al, be }), code = W !== 0 ? 1 : 0,
   y3 = dep ? `${cf(al, ex(r[0]))} ${sgn(be)} ${cf(Math.abs(be), ex(r[1]))}` : ex(r[2]),
   eq = `y‴ ${trm(-s1, 'y″')} ${trm(s2, 'y′')} ${trm(-s3, 'y')} = 0`, mat = `rows ${G.vec(M[0])}, ${G.vec(M[1])} and ${G.vec(M[2])}`,
   d3 = dep ? `y₃ = ${y3} has value ${n(c3[0])}, first derivative ${n(c3[1])} and second derivative ${n(c3[2])}` : `y₃ = ${y3} has value 1, first derivative ${n(r[2])} and second derivative ${n(c3[2])}`; return {
   prompt: `A gear train in the Engine Room obeys the third-order equation ${eq}, where y is a shaft angle and t is time in seconds. The crew has three solutions: y₁ = ${ex(r[0])}, y₂ = ${ex(r[1])} and y₃ = ${y3}. Enter their Wronskian W at t = 0, then 1 if the three solutions are linearly independent, 0 if not.`,
   answer: [W, code],
   hints: ['At t = 0 each e^(rt) has value 1, first derivative r and second derivative r². Put the values in the first row of a 3 × 3 matrix, the first derivatives in the second row and the second derivatives in the third, one column per function.', 'The Wronskian is the determinant of that matrix. For solutions of one linear equation it is zero at every t or at no t, so a non-zero value means independent and zero means one solution is a combination of the others.'],
   solution: `At t = 0, ${d3}. The matrix has ${mat}, and its determinant is W(0) = ${n(W)}. ${code ? 'The Wronskian is not zero, so the three solutions are linearly independent and y = C₁y₁ + C₂y₂ + C₃y₃ is the general solution.' : `The Wronskian is zero, so the solutions are linearly dependent: y₃ = ${cf(al, 'y₁')} ${sgn(be)} ${cf(Math.abs(be), 'y₂')} adds nothing new.`}`,
   guidance: [
    { prompt: `What is the second derivative of y₃ = ${y3} at t = 0?`, answer: [c3[2]], explanation: dep ? `Each e^(rt) has second derivative r²e^(rt), which is r² at t = 0: ${n(al)} × ${n(r[0] * r[0])} ${sgn(be)} ${n(Math.abs(be))} × ${n(r[1] * r[1])} = ${n(c3[2])}.` : `The second derivative of e^(rt) is r²e^(rt), which is r² = ${n(c3[2])} at t = 0.` },
    { prompt: `The matrix at t = 0 has ${mat}. What is its determinant, W(0)?`, answer: [W], explanation: `Expanding along the first row gives W(0) = ${n(W)}.` },
    { prompt: `W(0) = ${n(W)}. Enter 1 if the three solutions are linearly independent, 0 if not.`, answer: [code], explanation: code ? 'A non-zero Wronskian means no solution is a combination of the others: they are independent.' : 'A zero Wronskian for solutions of one linear equation means they are dependent: one is a combination of the others.' }
   ] }; }
 },
 /* m x″ + c x′ + k x = F₀ cos(ωt) built so that k − mω² = a·s and cω = b·s for a (±a, b, h) triple: then
    √((k − mω²)² + (cω)²) = h·s, the amplitude is a half-whole number and A, B have at most two decimals. */
 q23: {
  canonical: { m: 1, w: 2, i: 0, neg: false, s: 2, C: 1.5 },
  draw: R => tryDraw(() => ({ m: R.int(1, 3), w: R.int(1, 4), i: R.int(0, 3), neg: R.bool(), s: R.int(1, 3), C: R.pick([0.5, 1, 1.5, 2, 2.5, 3]) }),
   p => { const [a, b, h] = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]][p.i], aa = p.neg ? -a : a, c = b * p.s / p.w, k = aa * p.s + p.m * p.w * p.w;
    return Number.isInteger(c) && c >= 2 && k > 0 && Number.isInteger(h * p.s * p.C); }, { m: 1, w: 2, i: 0, neg: false, s: 2, C: 1.5 }),
  build: ({ m, w, i, neg, s, C }) => { const [a0, b, h] = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10]][i], a = neg ? -a0 : a0,
   c = b * s / w, k = a * s + m * w * w, u = a * s, cw = b * s, D = h * s, F = G.tidy(D * C), D2 = D * D,
   A = G.tidy(F * u / D2), B = G.tidy(F * cw / D2), mm = m === 1 ? '' : n(m); return {
   prompt: `An engine mount obeys ${mm}x″ + ${n(c)}x′ ${trm(k, 'x')} = ${n(F)} cos(${bt(w)}), with x in metres and t in seconds. Its steady swing has the form x = A cos(${bt(w)}) + B sin(${bt(w)}). Enter the Wronskian of cos(${bt(w)}) and sin(${bt(w)}) at t = 0 (it shows the two guesses are independent), then A, then B, then the amplitude √(A² + B²) in metres.`,
   answer: [w, A, B, C],
   hints: ['For two functions the Wronskian is the determinant of the 2 × 2 matrix with the values in the first row and the first derivatives in the second.', 'Put x = A cos(ωt) + B sin(ωt) into the equation and match the cos and the sin terms: (k − mω²)A + cωB = F₀ and −cωA + (k − mω²)B = 0. Solve the pair for A and B.'],
   solution: `At t = 0, cos(${bt(w)}) has value 1 and derivative 0, and sin(${bt(w)}) has value 0 and derivative ${n(w)}, so the Wronskian is 1 × ${n(w)} − 0 × 0 = ${n(w)}, not zero. Here k − mω² = ${n(k)} − ${n(m * w * w)} = ${n(u)} and cω = ${n(c)} × ${n(w)} = ${n(cw)}. Matching terms gives ${n(u)}A + ${n(cw)}B = ${n(F)} and −${n(cw)}A ${trm(u, 'B')} = 0. Solving, A = ${n(F)} × ${par(u)} ÷ (${n(u * u)} + ${n(cw * cw)}) = ${n(A)} and B = ${n(F)} × ${n(cw)} ÷ ${n(D2)} = ${n(B)}. The amplitude is √(${n(A * A)} + ${n(B * B)}) = ${n(C)} m, which is also ${n(F)} ÷ √${n(D2)}.`,
   guidance: [
    { prompt: `At t = 0, cos(${bt(w)}) has value 1 and derivative 0, and sin(${bt(w)}) has value 0 and derivative ${n(w)}. What is their Wronskian there?`, answer: [w], explanation: `The determinant of the matrix with rows (1, 0) and (0, ${n(w)}) is ${n(w)}. It is not zero, so cos and sin are independent and both are needed.` },
    { prompt: `With k − mω² = ${n(u)} and cω = ${n(cw)}, what is (k − mω²)² + (cω)²?`, answer: [D2], explanation: `${n(u * u)} + ${n(cw * cw)} = ${n(D2)}.` },
    { prompt: `A = F₀(k − mω²) ÷ ((k − mω²)² + (cω)²). What is A?`, answer: [A], explanation: `${n(F)} × ${par(u)} ÷ ${n(D2)} = ${n(A)}.` },
    { prompt: `B = F₀cω ÷ ((k − mω²)² + (cω)²). What is B?`, answer: [B], explanation: `${n(F)} × ${n(cw)} ÷ ${n(D2)} = ${n(B)}.` },
    { prompt: `What is the amplitude √(A² + B²) in metres?`, answer: [C], explanation: `√(${n(A * A)} + ${n(B * B)}) = √${n(G.tidy(C * C))} = ${n(C)} m.` }
   ] }; }
 },
 /* m x″ + c x′ + k x = 0 with k/m from 2 to 12 and c/m from 1 to 6 (whole entries), m in {1, 2, 4, 5}, one Euler
    step of h in {0.05, 0.1, 0.2}. Never the worked example (x″ + 2x′ + 5x = 0, h = 0.5). */
 q24: {
  canonical: { m: 2, al: 5, be: 3, x0: 2, v0: -1, h: 0.1 },
  draw: R => ({ m: R.pick([1, 2, 4, 5]), al: R.int(2, 12), be: R.int(1, 6), x0: R.nz(-3, 3), v0: R.int(-3, 3), h: R.pick([0.05, 0.1, 0.2]) }),
  build: ({ m, al, be, x0, v0, h }) => { const c = m * be, k = m * al, x1 = G.tidy(x0 + h * v0), acc = -al * x0 - be * v0, x2 = G.tidy(v0 + h * acc),
   eq = `${m === 1 ? '' : n(m)}x″ ${trm(c, 'x′')} ${trm(k, 'x')} = 0`; return {
   prompt: `A gimbal arm in the Control Room obeys ${eq}, where x is its angle in radians and t is time in seconds. Write it as a first-order system with x₁ = x and x₂ = x′, so that (x₁, x₂)′ = A(x₁, x₂). Enter the four entries of A row by row, then take one Euler step of size h = ${n(h)} from x(0) = ${n(x0)}, x′(0) = ${n(v0)}, and enter the estimates of x₁ and x₂ at t = ${n(h)}.`,
   answer: [0, 1, -al, -be, x1, x2],
   hints: ['x₁′ = x₂ is the first equation. For the second, solve the given equation for x″ and write it with x₁ and x₂ in place of x and x′.', 'Euler’s method moves each unknown forward by h times its rate: new value = old value + h × (its derivative worked out at the old values).'],
   solution: `Since x₁ = x, x₁′ = x′ = x₂, so the top row of A is (0, 1). Dividing the equation by ${n(m)} gives x″ = ${n(-al)}x ${trm(-be, 'x′')}, so x₂′ = ${n(-al)}x₁ ${trm(-be, 'x₂')} and the bottom row is (${n(-al)}, ${n(-be)}). At t = 0 the rates are x₁′ = ${n(v0)} and x₂′ = ${n(-al)} × ${par(x0)} ${sgn(-be)} ${n(be)} × ${par(v0)} = ${n(acc)}. One step gives x₁ ≈ ${n(x0)} + ${n(h)} × ${par(v0)} = ${n(x1)} and x₂ ≈ ${n(v0)} + ${n(h)} × ${par(acc)} = ${n(x2)}.`,
   guidance: [
    { prompt: `Solve the equation for x″. What number multiplies x (that is, x₁) in x₂′ = x″?`, answer: [-al], explanation: `x″ = −(${n(k)} ÷ ${n(m)})x − (${n(c)} ÷ ${n(m)})x′, so x multiplies ${n(-al)}. That is the bottom-left entry of A.` },
    { prompt: `What number multiplies x′ (that is, x₂) in x₂′?`, answer: [-be], explanation: `−(${n(c)} ÷ ${n(m)}) = ${n(-be)}, the bottom-right entry of A.` },
    { prompt: `x₁′ = x₂ = ${n(v0)} at t = 0. What is the Euler estimate x₁ ≈ ${n(x0)} + ${n(h)} × ${par(v0)}?`, answer: [x1], explanation: `${n(x0)} + ${par(G.tidy(h * v0))} = ${n(x1)}.` },
    { prompt: `x₂′ = ${n(-al)}x₁ ${trm(-be, 'x₂')} is ${n(acc)} at t = 0. What is the Euler estimate of x₂?`, answer: [x2], explanation: `${n(v0)} + ${n(h)} × ${par(acc)} = ${n(x2)}.` }
   ] }; }
 },
 /* A = (λ − qb, q; b(λ − s), s) has eigenvector (1, b) for λ. The candidate e^(μt)(1, b) uses μ = λ (a solution) or
    μ = λ ± 1 (not one), half the time each. */
 q25: {
  canonical: { l: -2, b: 2, q: 1, s: 1, ok: true, d: 1, p1: 1, p2: 3 },
  draw: R => tryDraw(() => ({ l: R.nz(-3, 3), b: R.nz(-2, 2), q: R.int(-2, 2), s: R.int(-3, 3), ok: R.bool(), d: R.pick([-1, 1]), p1: R.nz(-3, 3), p2: R.nz(-3, 3) }),
   p => { const mu = p.ok ? p.l : p.l + p.d, A = [[p.l - p.q * p.b, p.q], [p.b * (p.l - p.s), p.s]]; return mu !== 0 && !big(A) && A.every(r => r.every(v => v !== 0)) && !(A[0][0] === 1 && A[0][1] === 2 && A[1][0] === 2 && A[1][1] === 1); },
   { l: -2, b: 2, q: 1, s: 1, ok: true, d: 1, p1: 1, p2: 3 }),
  build: ({ l, b, q, s, ok, d, p1, p2 }) => { const A = [[l - q * b, q], [b * (l - s), s]], mu = ok ? l : l + d,
   y1 = A[0][0] * p1 + A[0][1] * p2, y2 = A[1][0] * p1 + A[1][1] * p2, Av2 = A[1][0] + A[1][1] * b, code = ok ? 1 : 0,
   cand = `(${ex(mu)}, ${cf(b, ex(mu))})`; return {
   prompt: `Two linked valves in the Control Room obey x′ = Ax, where x = (x₁, x₂) holds their openings and A is the matrix with ${rows(A)}. Enter x₁′ and x₂′ when the valves are at x = ${G.vec([p1, p2])}. Then enter 1 if x(t) = ${cand} is a solution of the system, 0 if not.`,
   answer: [y1, y2, code],
   hints: ['x′ = Ax means x₁′ = (first row of A) · x and x₂′ = (second row of A) · x: multiply each row by the point and add.', 'For x(t) = e^(μt)v, the left side is x′ = μe^(μt)v and the right side is Ax = e^(μt)Av. It is a solution exactly when Av = μv for both components.'],
   solution: `x₁′ = ${n(A[0][0])} × ${par(p1)} + ${par(A[0][1])} × ${par(p2)} = ${n(y1)} and x₂′ = ${n(A[1][0])} × ${par(p1)} + ${par(A[1][1])} × ${par(p2)} = ${n(y2)}. For the candidate, v = ${G.vec([1, b])} and μ = ${n(mu)}. Av = ${G.vec([A[0][0] + A[0][1] * b, Av2])} and μv = ${G.vec([mu, mu * b])}. ${ok ? 'They agree, so x′ = Ax holds at every t: it is a solution, and the answer is 1.' : 'They differ, so x′ and Ax are different functions: it is not a solution, and the answer is 0.'}`,
   guidance: [
    { prompt: `What is x₁′ = ${cf(A[0][0], 'x₁')} ${trm(A[0][1], 'x₂')} at x = ${G.vec([p1, p2])}?`, answer: [y1], explanation: `${n(A[0][0])} × ${par(p1)} + ${par(A[0][1])} × ${par(p2)} = ${n(y1)}.` },
    { prompt: `What is x₂′ = ${cf(A[1][0], 'x₁')} ${trm(A[1][1], 'x₂')} at the same point?`, answer: [y2], explanation: `${n(A[1][0])} × ${par(p1)} + ${par(A[1][1])} × ${par(p2)} = ${n(y2)}.` },
    { prompt: `The candidate is ${ex(mu)} times v = ${G.vec([1, b])}. What is the second component of Av?`, answer: [Av2], explanation: `${n(A[1][0])} × 1 + ${par(A[1][1])} × ${par(b)} = ${n(Av2)}. The second component of μv is ${n(mu)} × ${par(b)} = ${n(mu * b)}.` },
    { prompt: `Enter 1 if Av = μv (so the candidate is a solution), 0 if not.`, answer: [code], explanation: ok ? 'Both components agree, so x′ = Ax for every t.' : 'The components differ, so x′ ≠ Ax and the candidate is not a solution.' }
   ] }; }
 },
 /* A = P D P⁻¹ with eigenvalues l1 < l2 (non-zero, −3 to 3), eigenvectors (1, m) and (1, m + 1); x(0) = c1(1, m) +
    c2(1, m + 1). At t = ln 2, e^(λt) = 2^λ, so x₁ is exact. Never the worked example (A with rows (1, 2), (2, 1)). */
 q26: {
  canonical: { l1: -2, l2: 1, m: 1, c1: 2, c2: -1 },
  draw: R => tryDraw(() => { const a = R.nz(-3, 3), b = R.nz(-3, 3); return { l1: Math.min(a, b), l2: Math.max(a, b), m: R.pick([-3, -2, 1, 2]), c1: R.nz(-3, 3), c2: R.nz(-3, 3) }; },
   p => p.l1 !== p.l2 && !big(fromReal(p.l1, p.l2, p.m)), { l1: -2, l2: 1, m: 1, c1: 2, c2: -1 }),
  build: ({ l1, l2, m, c1, c2 }) => { const A = fromReal(l1, l2, m), x0 = [c1 + c2, c1 * m + c2 * (m + 1)], e1 = Math.pow(2, l1), e2 = Math.pow(2, l2),
   x1 = G.tidy(c1 * e1 + c2 * e2), tr = A[0][0] + A[1][1], dt = det2(A); return {
   prompt: `Two coupled heaters in the Control Room obey x′ = Ax, where A has ${rows(A)} and t is in minutes. They start at x(0) = ${G.vec(x0)}. Enter the eigenvalues of A in increasing order, then x₁ at t = ln 2 (about 0.693 minutes). At that time e^(λt) = 2^λ, so x₁ comes out as an exact short decimal.`,
   answer: [l1, l2, x1],
   hints: ['The eigenvalues are the roots of λ² − (trace)λ + (determinant) = 0, where the trace is the sum of the diagonal entries of A.', 'With eigenvectors v₁ and v₂, x(t) = c₁e^(λ₁t)v₁ + c₂e^(λ₂t)v₂. Choose c₁ and c₂ so that x(0) = c₁v₁ + c₂v₂, then put in t = ln 2.'],
   solution: `The trace is ${n(tr)} and the determinant is ${n(dt)}, so ${quad(tr, dt)}, with roots ${n(l1)} and ${n(l2)}. Solving (A − λI)v = 0 gives v₁ = ${G.vec([1, m])} for ${n(l1)} and v₂ = ${G.vec([1, m + 1])} for ${n(l2)}. From ${G.vec(x0)} = c₁${G.vec([1, m])} + c₂${G.vec([1, m + 1])}, c₁ = ${n(c1)} and c₂ = ${n(c2)}. So x₁(t) = ${pair(c1, l1, c2, l2)}, and at t = ln 2 it is ${n(c1)} × ${n(e1)} ${sgn(c2)} ${n(Math.abs(c2))} × ${n(e2)} = ${n(x1)}.`,
   guidance: [
    { prompt: `The trace of A is ${n(tr)} and its determinant is ${n(dt)}. What is the smaller eigenvalue?`, answer: [l1], explanation: `${quad(tr, dt).replace(' = 0', '')} = ${fac(l1)}${fac(l2)}, so the roots are ${n(l1)} and ${n(l2)}.` },
    { prompt: `What is the larger eigenvalue?`, answer: [l2], explanation: `The other root of the same equation is ${n(l2)}.` },
    { prompt: `An eigenvector for ${n(l1)} has first component 1. What is its second component?`, answer: [m], explanation: `The first row of (A − λI)v = 0 is ${n(A[0][0] - l1)} × 1 ${trm(A[0][1], 'v₂')} = 0, so v₂ = ${n(m)}.` },
    { prompt: `An eigenvector for ${n(l2)} has first component 1. What is its second component?`, answer: [m + 1], explanation: `The first row of (A − λI)v = 0 is ${n(A[0][0] - l2)} × 1 ${trm(A[0][1], 'v₂')} = 0, so v₂ = ${n(m + 1)}.` },
    { prompt: `Write x(0) = ${G.vec(x0)} as c₁${G.vec([1, m])} + c₂${G.vec([1, m + 1])}. What is c₁?`, answer: [c1], explanation: `The first components give c₁ + c₂ = ${n(x0[0])} and the second give ${cf(m, 'c₁')} ${trm(m + 1, 'c₂')} = ${n(x0[1])}. Subtracting ${n(m)} times the first from the second leaves c₂ = ${n(c2)}, so c₁ = ${n(c1)}.` },
    { prompt: `x₁(t) = ${pair(c1, l1, c2, l2)}. What is x₁ at t = ln 2?`, answer: [x1], explanation: `e^(λ ln 2) = 2^λ, so x₁ = ${n(c1)} × ${n(e1)} ${sgn(c2)} ${n(Math.abs(c2))} × ${n(e2)} = ${n(x1)}.` }
   ] }; }
 },
 /* A with eigenvalues a ± bi (a from −3 to 3, b from 1 to 4), sheared by m from −2 to 2, either way. Never the
    worked example (rows (0, −1) and (1, 0)). */
 q27: {
  canonical: { a: -1, b: 2, m: 1, flip: false },
  draw: R => tryDraw(() => ({ a: R.int(-3, 3), b: R.int(1, 4), m: R.int(-2, 2), flip: R.bool() }),
   p => !big(fromComplex(p.a, p.b, p.m, p.flip)) && !(p.a === 0 && p.b === 1 && p.m === 0), { a: -1, b: 2, m: 1, flip: false }),
  build: ({ a, b, m, flip }) => { const A = fromComplex(a, b, m, flip), tr = 2 * a, dt = a * a + b * b, T = r3(2 * Math.PI / b), disc = tr * tr - 4 * dt; return {
   prompt: `A rotating sensor mount in the Control Room obeys x′ = Ax, where A has ${rows(A)} and t is in seconds. Its eigenvalues are complex, a ± bi with b > 0. Enter the growth rate a, then the angular frequency b in rad/s, then the time for one full turn, 2π ÷ b, in seconds to 3 decimal places.`,
   answer: [a, b, T],
   hints: ['The eigenvalues solve λ² − (trace)λ + (determinant) = 0. When (trace)² − 4 × (determinant) is negative, the quadratic formula gives a ± bi.', 'a is half the trace, and b is half of √(4 × determinant − trace²). By Euler’s formula the solutions are e^(at) times cos(bt) and sin(bt) mixtures.'],
   solution: `The trace is ${n(tr)} and the determinant is ${n(dt)}, so ${quad(tr, dt)}. Then (trace)² − 4 × (determinant) = ${n(disc)}, which is negative, and λ = ${n(tr)} ÷ 2 ± i√${n(-disc)} ÷ 2 = ${n(a)} ± ${b === 1 ? '' : n(b)}i. So a = ${n(a)}, b = ${n(b)} rad/s, and one full turn takes 2π ÷ ${n(b)} ≈ ${n(T)} seconds. By Euler’s formula the solutions are mixtures of ${a === 0 ? `cos(${bt(b)}) and sin(${bt(b)})` : `${ex(a)}cos(${bt(b)}) and ${ex(a)}sin(${bt(b)})`}.`,
   guidance: [
    { prompt: `What is the trace of A, the sum of its diagonal entries?`, answer: [tr], explanation: `${n(A[0][0])} + ${par(A[1][1])} = ${n(tr)}.` },
    { prompt: `What is the determinant of A?`, answer: [dt], explanation: `${n(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${n(dt)}.` },
    { prompt: `What is the growth rate a, the real part of the eigenvalues?`, answer: [a], explanation: `a = trace ÷ 2 = ${n(tr)} ÷ 2 = ${n(a)}.` },
    { prompt: `What is b, the imaginary part with b > 0?`, answer: [b], explanation: `4 × ${n(dt)} − ${n(tr * tr)} = ${n(-disc)}, and b = √${n(-disc)} ÷ 2 = ${n(b)}.` },
    { prompt: `What is 2π ÷ ${n(b)}, to 3 decimal places?`, answer: [T], explanation: `2π ÷ ${n(b)} = ${n(T)} seconds to 3 decimal places.` }
   ] }; }
 },
 /* One of the four kinds, chosen first: node (real, same sign), saddle (real, opposite signs), spiral (a ± bi, a ≠ 0),
    centre (±bi). Never a zero or repeated eigenvalue. Never the worked example (rows (−3, 0), (0, −1)). */
 q28: {
  canonical: { kind: 3, a: 1, b: 2, m: 1, flip: false },
  draw: R => tryDraw(() => { const kind = R.int(1, 4), m = R.int(-2, 2), flip = R.bool();
   if (kind <= 2) { const x = R.int(1, 4), y = R.int(1, 4), sg = R.pick([-1, 1]); return { kind, a: sg * x, b: kind === 1 ? sg * y : -sg * y, m, flip }; }
   return { kind, a: kind === 4 ? 0 : R.nz(-3, 3), b: R.int(1, 3), m, flip }; },
   p => { if (p.kind <= 2 && p.a === p.b) return false; const A = p.kind <= 2 ? fromReal(Math.min(p.a, p.b), Math.max(p.a, p.b), p.m === 0 ? 1 : p.m) : fromComplex(p.a, p.b, p.m, p.flip);
    return !big(A) && !(A[0][0] === -3 && A[0][1] === 0 && A[1][0] === 0 && A[1][1] === -1); }, { kind: 3, a: 1, b: 2, m: 1, flip: false }),
  build: ({ kind, a, b, m, flip }) => { const A = kind <= 2 ? fromReal(Math.min(a, b), Math.max(a, b), m === 0 ? 1 : m) : fromComplex(a, b, m, flip),
   tr = A[0][0] + A[1][1], dt = det2(A), disc = tr * tr - 4 * dt, st = kind === 2 ? 0 : kind === 4 ? 1 : tr < 0 ? 1 : 0,
   name = ['', 'node', 'saddle', 'spiral', 'centre'][kind],
   why = kind === 2 ? 'The determinant is negative, so the eigenvalues are real with opposite signs: a saddle.' : kind === 1 ? 'The determinant is positive and the discriminant is positive, so the eigenvalues are real with the same sign: a node.' : kind === 3 ? 'The discriminant is negative and the trace is not zero, so the eigenvalues are complex with real part trace ÷ 2: a spiral.' : 'The discriminant is negative and the trace is zero, so the eigenvalues are ±bi: a centre.',
   stab = kind === 2 ? 'A saddle is unstable: most trajectories leave along the eigenvector of the positive eigenvalue.' : kind === 4 ? 'A centre is stable in the sense used here: trajectories circle the origin and stay near it.' : tr < 0 ? 'The trace is negative, so the real parts are negative and trajectories close in on the origin: stable.' : 'The trace is positive, so the real parts are positive and trajectories run away from the origin: unstable.'; return {
   prompt: `A two-loop thermostat in the Control Room obeys x′ = Ax, where A has ${rows(A)}. Enter the trace of A, then its determinant, then the kind of phase portrait at the origin as a code (1 node, 2 saddle, 3 spiral, 4 centre), then 1 if the origin is stable, 0 if not. Here stable means every trajectory that starts near the origin stays near it for all later time, so a centre counts as stable.`,
   answer: [tr, dt, kind, st],
   hints: ['The eigenvalues solve λ² − (trace)λ + (determinant) = 0. A negative determinant means real eigenvalues of opposite signs; otherwise look at the discriminant (trace)² − 4 × (determinant).', 'Real eigenvalues of one sign give a node; complex ones give a spiral, or a centre when the trace is zero. Negative real parts pull trajectories in (stable), positive ones push them out, and a saddle is always unstable.'],
   solution: `The trace is ${n(A[0][0])} + ${par(A[1][1])} = ${n(tr)} and the determinant is ${n(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${n(dt)}. The discriminant is ${n(tr * tr)} − 4 × ${par(dt)} = ${n(disc)}. ${why} ${stab} The codes are ${n(kind)} (${name}) and ${n(st)}.`,
   guidance: [
    { prompt: `What is the trace of A?`, answer: [tr], explanation: `${n(A[0][0])} + ${par(A[1][1])} = ${n(tr)}.` },
    { prompt: `What is the determinant of A?`, answer: [dt], explanation: `${n(A[0][0])} × ${par(A[1][1])} − ${par(A[0][1])} × ${par(A[1][0])} = ${n(dt)}.` },
    { prompt: `What is the discriminant, (trace)² − 4 × (determinant)?`, answer: [disc], explanation: `${n(tr * tr)} − 4 × ${par(dt)} = ${n(disc)}.` },
    { prompt: `Which kind of phase portrait is it? Enter 1 node, 2 saddle, 3 spiral, 4 centre.`, answer: [kind], explanation: why },
    { prompt: `Enter 1 if the origin is stable, 0 if not.`, answer: [st], explanation: stab }
   ] }; }
 },
 /* Two tanks from TANKS29 with whole-kilogram starting salt; x₁ = p·2^λ₁ + q·2^λ₂ at t = ln 2. p must have at most
    three decimals, and the answer must not sit on a rounding tie. */
 q29: {
  canonical: { i: 8, s1: 5, s2: 3 },
  draw: R => tryDraw(() => ({ i: R.int(0, TANKS29.length - 1), s1: R.int(2, 20), s2: R.int(0, 20) }),
   p => { const t = tank29(p), f = Math.abs(t.x1 * 1000 - Math.floor(t.x1 * 1000) - 0.5); return exact3(t.p) && f > 0.01; }, { i: 8, s1: 5, s2: 3 }),
  build: ({ i, s1, s2 }) => { const t = tank29({ i, s1, s2 }), x1 = r3(t.x1), e1 = Math.pow(2, t.l1), e2 = Math.pow(2, t.l2); return {
   prompt: `Two brine tanks in the Control Room are linked. Tank 1 holds ${n(t.V1)} litres and tank 2 holds ${n(t.V2)} litres, both well stirred. Fresh water flows into tank 1 at ${n(t.f)} L/min; ${n(t.f + t.g)} L/min flows from tank 1 into tank 2; ${n(t.g)} L/min flows back from tank 2 into tank 1, and tank 2 drains ${n(t.f)} L/min, so both volumes stay fixed. At t = 0 tank 1 holds ${n(s1)} kg of salt and tank 2 holds ${n(s2)} kg. Enter the two eigenvalues of the system’s matrix in increasing order, then the phase portrait code (1 node, 2 saddle, 3 spiral, 4 centre), then the salt in tank 1 in kg at t = ln 2 minutes, to 3 decimal places.`,
   answer: [t.l1, t.l2, 1, x1],
   hints: ['Salt leaves a tank at (outflow rate) × (salt ÷ volume). So x₁′ = −(flow out of tank 1 ÷ V₁)x₁ + (flow back ÷ V₂)x₂, and x₂′ is built the same way.', 'Write x₁(t) = pe^(λ₁t) + qe^(λ₂t). Then p + q = x₁(0) and λ₁p + λ₂q = x₁′(0), which the first equation gives at t = 0. At t = ln 2, e^(λt) = 2^λ.'],
   solution: `x₁′ = −(${n(t.f + t.g)} ÷ ${n(t.V1)})x₁ + (${n(t.g)} ÷ ${n(t.V2)})x₂ = −${n(t.a)}x₁ + ${cf(t.b, 'x₂')} and x₂′ = ${n(t.a)}x₁ − ${n(t.c)}x₂. The matrix has trace −${n(t.tr)} and determinant ${n(t.dt)}, so λ² + ${n(t.tr)}λ + ${n(t.dt)} = 0, with roots ${n(t.l1)} and ${n(t.l2)}: real, both negative, so the portrait is a stable node (code 1). At t = 0, x₁′ = −${n(t.a)} × ${n(s1)} + ${n(t.b)} × ${n(s2)} = ${n(t.d0)}. With x₁(t) = p${ex(t.l1)} + q${ex(t.l2)}: p + q = ${n(s1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.d0)}, so p = ${n(t.p)} and q = ${n(t.q)}. At t = ln 2, x₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)} ≈ ${n(x1)} kg.`,
   guidance: [
    { prompt: `The matrix has trace −${n(t.tr)} and determinant ${n(t.dt)}. What is the smaller eigenvalue?`, answer: [t.l1], explanation: `λ² + ${n(t.tr)}λ + ${n(t.dt)} = ${fac(t.l1)}${fac(t.l2)}, so the smaller root is ${n(t.l1)}.` },
    { prompt: `What is the larger eigenvalue?`, answer: [t.l2], explanation: `The other root is ${n(t.l2)}.` },
    { prompt: `Both eigenvalues are real and negative. Enter the code of the phase portrait.`, answer: [1], explanation: 'Real eigenvalues of the same sign give a node; both negative, so every trajectory closes in on the origin: all the salt is flushed out.' },
    { prompt: `What is x₁′(0) = −${n(t.a)}x₁ + ${cf(t.b, 'x₂')} at the start?`, answer: [t.d0], explanation: `−${n(t.a)} × ${n(s1)} + ${n(t.b)} × ${n(s2)} = ${n(t.d0)} kg/min.` },
    { prompt: `With x₁(t) = p${ex(t.l1)} + q${ex(t.l2)}, p + q = ${n(s1)} and ${n(t.l1)}p ${trm(t.l2, 'q')} = ${n(t.d0)}. What is p?`, answer: [t.p], explanation: `Subtracting ${n(t.l2)} times the first equation from the second gives (${n(t.l1)} − ${par(t.l2)})p = ${n(t.d0)} − ${par(t.l2)} × ${n(s1)}, so p = ${n(t.p)} and q = ${n(t.q)}.` },
    { prompt: `What is x₁ at t = ln 2, in kg to 3 decimal places?`, answer: [x1], explanation: `x₁ = ${by2(t.p, t.l1)} + ${by2(t.q, t.l2)} ≈ ${n(x1)} kg.` }
   ] }; }
 },
 /* f(t) = α tᵏ + β e^(at) + γ sin or cos(bt) at a whole s above max(a, 0); every piece and the total have at most
    three decimals. Never the worked example (f(t) = 5 + e^(2t), s = 3). */
 q30: {
  canonical: { al: 4, k: 2, be: 3, a: -1, ga: 2, trig: 'sin', b: 4, s: 2 },
  draw: R => tryDraw(() => { const a = R.nz(-3, 3), th = Math.max(a, 0); return { al: R.nz(-4, 4), k: R.int(1, 3), be: R.nz(-4, 4), a, ga: R.nz(-4, 4), trig: R.pick(['sin', 'cos']), b: R.int(1, 4), s: th + R.int(1, 4) }; },
   p => { const L = lap30(p); return [L.P, L.X, L.Q].every(exact3) && Math.abs(L.P + L.X + L.Q) > 1e-9; }, { al: 4, k: 2, be: 3, a: -1, ga: 2, trig: 'sin', b: 4, s: 2 }),
  build: ({ al, k, be, a, ga, trig, b, s }) => { const L = lap30({ al, k, be, a, ga, trig, b, s }), F = G.tidy(L.P + L.X + L.Q), th = Math.max(a, 0),
   tg = `${trig}(${bt(b)})`, f = `${cf(al, pw(k))} ${sgn(be)} ${cf(Math.abs(be), ex(a))} ${sgn(ga)} ${cf(Math.abs(ga), tg)}`,
   qt = trig === 'sin' ? `${n(b)} ÷ (${n(s)}² + ${n(b)}²)` : `${n(s)} ÷ (${n(s)}² + ${n(b)}²)`; return {
   prompt: `A relay in the Signal Shop sends the signal f(t) = ${f}, with t in seconds. Enter the number that s must be greater than for the Laplace transform ℒ{f}(s) to exist, then the value of ℒ{f}(s) at s = ${n(s)}.`,
   answer: [th, F],
   hints: ['ℒ{tⁿ} = n! ÷ sⁿ⁺¹ and ℒ{sin(bt)} = b ÷ (s² + b²), ℒ{cos(bt)} = s ÷ (s² + b²), all for s > 0; ℒ{e^(at)} = 1 ÷ (s − a) for s > a.', 'The transform is linear: transform each piece, multiply by its coefficient and add. The whole transform exists where every piece does.'],
   solution: `The power and the ${trig} need s > 0 and ${ex(a)} needs s > ${n(a)}, so all three integrals converge when s > ${n(th)}. At s = ${n(s)}: ℒ{${cf(al, pw(k))}} = ${n(al)} × ${n(fact(k))} ÷ ${n(s)}^${n(k + 1)} = ${n(L.P)}; ℒ{${cf(be, ex(a))}} = ${n(be)} ÷ (${n(s)} − ${par(a)}) = ${n(L.X)}; ℒ{${cf(ga, tg)}} = ${n(ga)} × ${qt} = ${n(L.Q)}. Adding, ℒ{f}(${n(s)}) = ${n(L.P)} + ${par(L.X)} + ${par(L.Q)} = ${n(F)}.`,
   guidance: [
    { prompt: `Each piece needs s > 0, except e^(at), which needs s > a. Which number must s exceed?`, answer: [th], explanation: `The largest of 0 and ${n(a)} is ${n(th)}, so the transform exists for s > ${n(th)}.` },
    { prompt: `What is ℒ{${cf(al, pw(k))}} at s = ${n(s)}?`, answer: [L.P], explanation: `${n(al)} × ${n(k)}! ÷ ${n(s)}^${n(k + 1)} = ${n(al * fact(k))} ÷ ${n(Math.pow(s, k + 1))} = ${n(L.P)}.` },
    { prompt: `What is ℒ{${cf(be, ex(a))}} at s = ${n(s)}?`, answer: [L.X], explanation: `${n(be)} ÷ (${n(s)} − ${par(a)}) = ${n(be)} ÷ ${n(s - a)} = ${n(L.X)}.` },
    { prompt: `What is ℒ{${cf(ga, tg)}} at s = ${n(s)}?`, answer: [L.Q], explanation: `${n(ga)} × ${qt} = ${n(L.Q)}.` },
    { prompt: `What is ℒ{f}(${n(s)}), the sum of the three pieces?`, answer: [F], explanation: `${n(L.P)} + ${par(L.X)} + ${par(L.Q)} = ${n(F)}.` }
   ] }; }
 }
});
})();
