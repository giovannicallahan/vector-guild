/* Complex analysis: the plane of numbers mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Complex numbers are pairs [re, im]. */
const add = (z, w) => [z[0] + w[0], z[1] + w[1]];
const sub = (z, w) => [z[0] - w[0], z[1] - w[1]];
const mul = (z, w) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
const scl = (k, z) => [k * z[0], k * z[1]];
const cnj = z => [z[0], -z[1]];
const pw = (z, k) => { let r = [1, 0]; for (let i = 0; i < k; i++) r = mul(r, z); return r; };
const m2 = z => z[0] * z[0] + z[1] * z[1];
const div = (z, w) => scl(1 / m2(w), mul(z, cnj(w)));
/* Text of a + bi: "3 − 4i", "−i", "2i", "5"; no written coefficient 1 on i. pz puts a two-part or negative number in brackets. */
const cz = z => { const [a, b] = z.map(G.tidy); if (b === 0) return n(a); const ip = Math.abs(b) === 1 ? 'i' : n(Math.abs(b)) + 'i';
 if (a === 0) return (b < 0 ? '−' : '') + ip; return `${n(a)} ${b < 0 ? '−' : '+'} ${ip}`; };
const pz = z => { const t = cz(z); return /\s/.test(t) || t.startsWith('−') ? `(${t})` : t; };
/* Signed terms: trm(−1, 'x') '− x', trm(3, 'x') '+ 3x'; lead(−1, 'x³') '−x³'; cst(−4) '− 4'. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const lead = (v, x) => (v === 1 ? '' : v === -1 ? '−' : n(v)) + x;
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
/* "z − 1 − 2i" for z − c; "z + 3" when c = −3. */
const zm = c => { const parts = []; if (c[0]) parts.push(`${sgn(-c[0])} ${n(Math.abs(c[0]))}`); if (c[1]) parts.push(`${sgn(-c[1])} ${Math.abs(c[1]) === 1 ? '' : n(Math.abs(c[1]))}i`); return 'z ' + parts.join(' '); };
const SUP = { '-3': '⁻³', '-2': '⁻²', '-1': '⁻¹', 1: '', 2: '²', 3: '³', 4: '⁴' };
/* Rounding to 2 decimal places, and a guard against values within 0.0002 of a rounding tie. */
const r2 = x => G.tidy(Math.round(x * 100) / 100);
const r4 = x => Math.round(x * 1e4) / 1e4;
const safe = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) > 0.02;
/* "≈ 2.2143, which is 2.21 to 2 decimal places", or "= 2.5" when the 4-place value already is the 2-place one. */
const f2 = x => r2(x).toFixed(2).replace('-', '−');
const to2 = x => n(r4(x)) === n(r2(x)) ? `= ${f2(x)}` : `≈ ${n(r4(x))}, which is ${f2(x)} to 2 decimal places`;
const isTidy = z => z.every(v => Math.abs(v * 100 - Math.round(v * 100)) < 1e-9);
const bounded = (R, make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return fallback; };
const quad = (a, b) => a > 0 ? (b > 0 ? 'the first quadrant (both parts positive)' : 'the fourth quadrant (real part positive, imaginary part negative)') : (b > 0 ? 'the second quadrant (real part negative, imaginary part positive)' : 'the third quadrant (both parts negative)');
/* q11 */
const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8], [7, 24], [24, 7], [9, 12], [12, 9]];
const q11arg = (a, b) => { const phi = Math.atan(Math.abs(b) / Math.abs(a)), P = 3.1416, f4 = r4(phi);
 const val = a > 0 ? (b > 0 ? phi : -phi) : (b > 0 ? Math.PI - phi : phi - Math.PI);
 const shown = a > 0 ? (b > 0 ? f4 : -f4) : (b > 0 ? P - f4 : f4 - P);
 const how = a > 0 ? (b > 0 ? `Arg z = ${n(f4)}` : `Arg z = −${n(f4)}`) : (b > 0 ? `Arg z = π − ${n(f4)} ≈ 3.1416 − ${n(f4)} = ${n(r4(shown))}` : `Arg z = −(π − ${n(f4)}) ≈ −(3.1416 − ${n(f4)}) = ${n(r4(shown))}`);
 return { phi, f4, val, shown, how }; };
/* q14 */
const q14calc = ({ kind, a, b, p, q }) => { const z = [p, q], s = mul(z, z);
 if (kind === 0) { const g = add(s, [a, 0]), w = add(z, [b, 0]), P = scl(2, mul(z, w)); return { s, g, w, P, F: add(P, g) }; }
 if (kind === 1) { const w = add(z, [b, 0]), P = mul(w, w), N = scl(b - a, cnj(P)); return { s, w, P, N, F: div([b - a, 0], P) }; }
 const g = add(s, [a, 0]), P = mul(g, g); return { s, g, P, F: scl(6, mul(z, P)) }; };
/* q15: x = kπ ÷ d */
const X15 = [[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6]];
const xText = i => { const [k, d] = X15[i]; return `${k === 1 ? '' : k}π ÷ ${d}`; };
const sinText = i => ({ 6: '1 ÷ 2', 4: '√2 ÷ 2', 3: '√3 ÷ 2', 2: '1' })[X15[i][1]];
const q15calc = ({ xi, y }) => { const [k, d] = X15[xi], sx = Math.sin(k * Math.PI / d), sx2 = r4(sx * sx), ch = Math.cosh(y), sh = Math.sinh(y), ab = Math.sqrt(sx * sx + sh * sh);
 return { sx2, ch, sh, sh2: sh * sh, ab }; };
/* q19 */
const q19calc = ({ k, ar, ai, br, bi }) => { const A = [ar, ai], B = [br, bi], Bp = pw(B, k + 1), Ap = pw(A, k + 1), D = sub(Bp, Ap); return { A, B, Bp, Ap, D, I: scl(1 / (k + 1), D) }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* z = a + bi with a Pythagorean modulus. Not the worked example 5 + 12i. Arg and ln |z|² are kept clear of rounding ties. */
 q11: {
  canonical: { a: -3, b: 4 },
  draw: R => bounded(R, R => { const [x, y] = R.pick(TRIPLES); return { a: R.bool() ? x : -x, b: R.bool() ? y : -y }; },
   p => !(p.a === 5 && p.b === 12) && safe(q11arg(p.a, p.b).val), { a: -3, b: 4 }),
  build: ({ a, b }) => { const mod = Math.round(Math.sqrt(a * a + b * b)), A = q11arg(a, b), L = Math.log(mod * mod), z = [a, b]; return {
   prompt: `The rotor log records the rotor’s position as the complex number z = ${cz(z)}. Angles are in radians. Enter the modulus |z|, then the principal argument Arg z to 2 decimal places, then the real part of Log(z²) to 2 decimal places.`,
   answer: [mod, r2(A.val), r2(L)],
   hints: ['The modulus of a + bi is √(a² + b²). For Arg z, first decide which quadrant z is in: Arg z lies in (−π, π], and arctan on its own only gives angles between −π ÷ 2 and π ÷ 2.', 'By de Moivre’s formula, squaring a complex number squares its modulus. The real part of Log w is ln |w|.'],
   solution: `|z| = √(${n(a * a)} + ${n(b * b)}) = √${n(mod * mod)} = ${n(mod)}. z lies in ${quad(a, b)}. arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(A.f4)}, so ${A.how}, which is ${f2(A.val)} to 2 decimal places. Squaring z squares its modulus: |z²| = ${n(mod)}² = ${n(mod * mod)}. So Re Log(z²) = ln ${n(mod * mod)} ${to2(L)}.`,
   guidance: [
    { prompt: `What is the modulus of z = ${cz(z)}?`, answer: [mod], explanation: `|z| = √(${par(a)}² + ${par(b)}²) = √${n(mod * mod)} = ${n(mod)}.` },
    { prompt: `z lies in ${quad(a, b)}, and arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(A.f4)}. What is Arg z, to 2 decimal places?`, answer: [r2(A.val)], explanation: `${A.how}, which is ${f2(A.val)} to 2 decimal places. It lies in (−π, π], as a principal argument must.` },
    { prompt: `|z²| = |z|² = ${n(mod * mod)}. What is Re Log(z²) = ln |z²|, to 2 decimal places?`, answer: [r2(L)], explanation: `ln ${n(mod * mod)} ${to2(L)}.` }
   ] }; }
 },
 /* f(z) = z³ + az² + bz + c at z₀ = p + qi (q ≠ 0, so z₀ is never real). The worked example is z² + 3z at 2 − i, a different shape. */
 q12: {
  canonical: { a: 2, b: -5, c: 4, p: 1, q: 2 },
  draw: R => ({ a: R.nz(-4, 4), b: R.nz(-6, 6), c: R.nz(-9, 9), p: R.int(-3, 3), q: R.nz(-3, 3) }),
  build: ({ a, b, c, p, q }) => { const z = [p, q], s = mul(z, z), t3 = scl(3, s), t2 = scl(2 * a, z), F = add(add(t3, t2), [b, 0]); return {
   prompt: `In the flow tank the flow past the hull is modelled by f(z) = z³ ${trm(a, 'z²')} ${trm(b, 'z')} ${cst(c)}. Find the complex derivative f′(z₀) at z₀ = ${cz(z)}. Enter its real part, then its imaginary part.`,
   answer: [F[0], F[1]],
   hints: ['For a polynomial in z, the complex derivative follows the same power rule as for real x: zⁿ has derivative nzⁿ⁻¹, and a constant has derivative 0.', 'Square z₀ first, using i² = −1. Then put z₀ and z₀² into f′(z) and collect the real parts and the imaginary parts.'],
   solution: `By the power rule, f′(z) = 3z² ${trm(2 * a, 'z')} ${cst(b)}. z₀² = (${cz(z)})² = ${par(p)}² − ${par(q)}² + (2 × ${par(p)} × ${par(q)})i = ${cz(s)}. So 3z₀² = ${cz(t3)} and ${n(2 * a)}z₀ = ${cz(t2)}, and f′(z₀) = ${pz(t3)} + ${pz(t2)} + ${par(b)} = ${cz(F)}.`,
   guidance: [
    { prompt: `z₀ = ${cz(z)}. What is the real part of z₀²?`, answer: [s[0]], explanation: `(a + bi)² = a² − b² + 2abi, so the real part is ${par(p)}² − ${par(q)}² = ${n(s[0])}.` },
    { prompt: 'What is the imaginary part of z₀²?', answer: [s[1]], explanation: `It is 2ab = 2 × ${par(p)} × ${par(q)} = ${n(s[1])}, so z₀² = ${cz(s)}.` },
    { prompt: `f′(z) = 3z² ${trm(2 * a, 'z')} ${cst(b)}. What is the real part of f′(z₀)?`, answer: [F[0]], explanation: `3z₀² = ${cz(t3)} and ${n(2 * a)}z₀ = ${cz(t2)}. The real parts add up: ${n(t3[0])} + ${par(t2[0])} + ${par(b)} = ${n(F[0])}.` },
    { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `The imaginary parts: ${n(t3[1])} + ${par(t2[1])} = ${n(F[1])}. The constant ${n(b)} is real and adds nothing here.` }
   ] }; }
 },
 /* Model A is f = az³ + cz written out, with the xy² coefficient hidden as −k: k = 3a. Model B is sz² − itz split
    into parts when r = −t (analytic, 1); r = t breaks the second Cauchy–Riemann equation (0). The worked example is u = x² − ky². */
 q13: {
  canonical: { a: 2, c: -5, s: 3, t: 4, r: -4 },
  draw: R => { const t = R.nz(-6, 6); return { a: R.nz(-3, 3), c: R.nz(-6, 6), s: R.int(1, 4), t, r: R.bool() ? -t : t }; },
  build: ({ a, c, s, t, r }) => { const k = 3 * a, yes = r === -t ? 1 : 0; return {
   prompt: `Two flow models for the tank are written as pairs of real functions of x and y. Model A: u(x, y) = ${lead(a, 'x³')} − kxy² ${trm(c, 'x')} and v(x, y) = ${lead(3 * a, 'x²y')} ${trm(-a, 'y³')} ${trm(c, 'y')}, where k is a constant. Model B: U(x, y) = ${lead(s, 'x²')} ${trm(-s, 'y²')} ${trm(t, 'y')} and V(x, y) = ${lead(2 * s, 'xy')} ${trm(r, 'x')}. Enter the value of k that makes u + iv analytic, then 1 if U + iV is analytic or 0 if it is not.`,
   answer: [k, yes],
   hints: ['A partial derivative ∂u/∂x treats y as a fixed number and differentiates in x; ∂u/∂y treats x as fixed and differentiates in y.', 'u + iv is analytic exactly when the Cauchy–Riemann equations ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x hold at every point (these partial derivatives are continuous here). Match the coefficient of each term.'],
   solution: `Model A: ∂u/∂x = ${lead(3 * a, 'x²')} − ky² ${cst(c)} and ∂v/∂y = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} ${cst(c)}. They agree everywhere only if k = ${n(k)}. Then ∂u/∂y = −2kxy = ${lead(-2 * k, 'xy')} and −∂v/∂x = ${lead(-6 * a, 'xy')}, which agree too, so k = ${n(k)}. Model B: ∂U/∂x = ${lead(2 * s, 'x')} = ∂V/∂y, but ∂U/∂y = ${lead(-2 * s, 'y')} ${cst(t)} and −∂V/∂x = ${lead(-2 * s, 'y')} ${cst(-r)}. ${yes ? 'These agree at every point, so U + iV is analytic: 1.' : `These always differ by ${n(t + r)}, so the second equation fails everywhere and U + iV is not analytic: 0.`}`,
   guidance: [
    { prompt: 'Differentiate v with respect to y, holding x fixed. What is the coefficient of y² in ∂v/∂y?', answer: [-3 * a], explanation: `∂v/∂y = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} ${cst(c)}, so the y² term has coefficient ${n(-3 * a)}.` },
    { prompt: `∂u/∂x = ${lead(3 * a, 'x²')} − ky² ${cst(c)}. The first Cauchy–Riemann equation needs ∂u/∂x = ∂v/∂y at every point. What must k be?`, answer: [k], explanation: `Matching the y² terms gives −k = ${n(-3 * a)}, so k = ${n(k)}. The second equation, ∂u/∂y = −∂v/∂x, gives −2kxy = ${lead(-6 * a, 'xy')}: the same k.` },
    { prompt: `For model B, ∂U/∂y = ${lead(-2 * s, 'y')} ${cst(t)} and −∂V/∂x = ${lead(-2 * s, 'y')} ${cst(-r)}. What is ∂U/∂y − (−∂V/∂x)? It must be 0 at every point for U + iV to be analytic.`, answer: [t + r], explanation: `The y terms cancel and leave ${n(t)} − ${par(-r)} = ${n(t + r)}.` },
    { prompt: `The first equation holds for model B: ∂U/∂x = ${lead(2 * s, 'x')} = ∂V/∂y. Is U + iV analytic? Enter 1 for yes, 0 for no.`, answer: [yes], explanation: yes ? 'Both Cauchy–Riemann equations hold at every point and the partial derivatives are continuous, so U + iV is analytic: 1.' : `∂U/∂y and −∂V/∂x differ by ${n(t + r)} at every point, so the second Cauchy–Riemann equation fails and U + iV is not analytic: 0.` }
   ] }; }
 },
 /* kind (an index into three shapes of formula): 0 product (z² + a)(z + b), 1 quotient (z + a) ÷ (z + b), 2 composition (z² + a)³.
    Quotient draws pick z₀ + b from a short list so f′(z₀) has at most 2 decimals; compositions stay below 1000. */
 q14: {
  canonical: { kind: 0, a: 3, b: -2, p: 2, q: 1 },
  draw: R => bounded(R, R => { const kind = R.int(0, 2);
    if (kind === 0) return { kind, a: R.nz(-5, 5), b: R.nz(-5, 5), p: R.int(-3, 3), q: R.nz(-3, 3) };
    if (kind === 1) { const b = R.nz(-4, 4), w = R.pick([[1, 1], [1, -1], [0, 1], [0, -1], [0, 2], [0, -2], [2, 1], [1, 2]]); return { kind, a: b - R.nz(-6, 6), b, p: w[0] - b, q: w[1] }; }
    return { kind, a: R.nz(-3, 3), b: 0, p: R.int(-2, 2), q: R.nz(-2, 2) }; },
   p => { if (p.kind === 1 && p.a === 0) return false; const F = q14calc(p).F; return isTidy(F) && Math.abs(F[0]) < 1000 && Math.abs(F[1]) < 1000 && !(p.kind === 1 && p.a === 1 && p.b === -1 && p.p === 0 && p.q === 1); },
   { kind: 0, a: 3, b: -2, p: 2, q: 1 }),
  build: P => { const { kind, a, b, p, q } = P, z = [p, q], C = q14calc(P), F = C.F;
   const ftext = [`(z² ${cst(a)})(z ${cst(b)})`, `(z ${cst(a)}) ÷ (z ${cst(b)})`, `(z² ${cst(a)})³`][kind];
   const rule = [`By the product rule, f′(z) = 2z(z ${cst(b)}) + (z² ${cst(a)}).`, `By the quotient rule, f′(z) = ((z ${cst(b)}) − (z ${cst(a)})) ÷ (z ${cst(b)})² = ${n(b - a)} ÷ (z ${cst(b)})².`, `By the chain rule, f′(z) = 3(z² ${cst(a)})² × 2z = 6z(z² ${cst(a)})².`][kind];
   const piece = [`2z₀(z₀ ${cst(b)})`, `(z₀ ${cst(b)})²`, `(z₀² ${cst(a)})²`][kind];
   const work = [
    () => `z₀² = ${cz(C.s)}, so z₀² ${cst(a)} = ${cz(C.g)}. z₀ ${cst(b)} = ${cz(C.w)}, so 2z₀(z₀ ${cst(b)}) = 2 × ${pz(z)} × ${pz(C.w)} = ${cz(C.P)}. So f′(z₀) = ${pz(C.P)} + ${pz(C.g)} = ${cz(F)}.`,
    () => `z₀ ${cst(b)} = ${cz(C.w)}, and (${cz(C.w)})² = ${cz(C.P)}. So f′(z₀) = ${n(b - a)} ÷ ${pz(C.P)}${C.P[1] ? `. Multiply the top and the bottom by the conjugate ${cz(cnj(C.P))}: the top is ${cz(C.N)} and the bottom is ${n(m2(C.P))}, so f′(z₀) = ${cz(F)}.` : ` = ${cz(F)}.`}`,
    () => `z₀² = ${cz(C.s)}, so z₀² ${cst(a)} = ${cz(C.g)}, and its square is ${cz(C.P)}. So f′(z₀) = 6 × ${pz(z)} × ${pz(C.P)} = ${cz(F)}.`][kind]();
   const last = [() => `f′(z₀) = ${pz(C.P)} + (z₀² ${cst(a)}), and z₀² ${cst(a)} = ${cz(C.g)}.`, () => C.P[1] ? `f′(z₀) = ${n(b - a)} ÷ ${pz(C.P)}. Multiply the top and the bottom by ${cz(cnj(C.P))} and divide by ${n(m2(C.P))}.` : `f′(z₀) = ${n(b - a)} ÷ ${pz(C.P)}, a division by a real number.`, () => `f′(z₀) = 6 × ${pz(z)} × ${pz(C.P)}.`][kind]();
   return {
   prompt: `A flow probe in the tank reads f(z) = ${ftext}. Find f′(z₀) at z₀ = ${cz(z)}. Enter its real part, then its imaginary part.`,
   answer: [F[0], F[1]],
   hints: ['The product rule (gh)′ = g′h + gh′, the quotient rule (g ÷ h)′ = (g′h − gh′) ÷ h² and the chain rule (g(h(z)))′ = g′(h(z)) h′(z) work for complex functions exactly as for real ones.', 'Simplify f′(z) as a formula first, then put in z₀ and use i² = −1. To divide by a complex number, multiply the top and the bottom by its conjugate.'],
   solution: `${rule} ${work}`,
   guidance: [
    { prompt: `${rule} What is the real part of ${piece}?`, answer: [C.P[0]], explanation: `${piece} = ${cz(C.P)}.` },
    { prompt: `What is the imaginary part of ${piece}?`, answer: [C.P[1]], explanation: `${piece} = ${cz(C.P)}, so its imaginary part is ${n(C.P[1])}.` },
    { prompt: 'What is the real part of f′(z₀)?', answer: [F[0]], explanation: `${last} That gives f′(z₀) = ${cz(F)}.` },
    { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `f′(z₀) = ${cz(F)}, so its imaginary part is ${n(F[1])}.` }
   ] }; }
 },
 /* x = kπ ÷ d from X15 (xi is an index into that list), y from 0.5 to 2.5. Not the worked example (y = 3). Rounded answers are kept clear of ties. */
 q15: {
  canonical: { xi: 1, y: 1 },
  draw: R => bounded(R, R => ({ xi: R.int(0, 6), y: R.pick([0.5, 1, 1.5, 2, 2.5]) }), p => { const C = q15calc(p); return safe(C.ch) && safe(C.sh2) && safe(C.ab); }, { xi: 1, y: 1 }),
  build: ({ xi, y }) => { const C = q15calc({ xi, y }), xt = xText(xi), e = Math.exp(y), ei = Math.exp(-y); return {
   prompt: `A wave in the flow tank is modelled with the complex sine and cosine. Angles are in radians. Enter cos(iy) for y = ${n(y)}, then |sin(x + iy)| for x = ${xt} and y = ${n(y)}, both to 2 decimal places.`,
   answer: [r2(C.ch), r2(C.ab)],
   hints: ['Put z = iy into cos z = (e^(iz) + e^(−iz)) ÷ 2. Since i × i = −1, both exponents become real, and the result is cosh y = (e^y + e^(−y)) ÷ 2.', 'sin(x + iy) = sin x cosh y + i cos x sinh y. Its modulus squared is sin²x cosh²y + cos²x sinh²y, which simplifies to sin²x + sinh²y because cosh²y − sinh²y = 1.'],
   solution: `cos(iy) = (e^(−y) + e^y) ÷ 2 = cosh y. With y = ${n(y)}: e^${n(y)} ≈ ${n(r4(e))} and e^(−${n(y)}) ≈ ${n(r4(ei))}, so cosh ${n(y)} ${to2(C.ch)}. Next, sinh ${n(y)} = (e^${n(y)} − e^(−${n(y)})) ÷ 2 ≈ ${n(r4(C.sh))}, and sin(${xt}) = ${sinText(xi)}, so sin²(${xt}) = ${n(C.sx2)}. Then |sin(x + iy)| = √(sin²x + sinh²y) ≈ √(${n(C.sx2)} + ${n(r4(C.sh2))}) ${to2(C.ab)}.`,
   guidance: [
    { prompt: `cos(iy) = cosh y = (e^y + e^(−y)) ÷ 2. What is cosh ${n(y)}, to 2 decimal places?`, answer: [r2(C.ch)], explanation: `(${n(r4(e))} + ${n(r4(ei))}) ÷ 2 ${to2(C.ch)}.` },
    { prompt: `What is sin²(${xt})?`, answer: [C.sx2], explanation: `sin(${xt}) = ${sinText(xi)}, and its square is ${n(C.sx2)}.` },
    { prompt: `sinh y = (e^y − e^(−y)) ÷ 2. What is sinh²(${n(y)}), to 2 decimal places?`, answer: [r2(C.sh2)], explanation: `sinh ${n(y)} ≈ ${n(r4(C.sh))}, and its square ${to2(C.sh2)}.` },
    { prompt: '|sin(x + iy)| = √(sin²x + sinh²y). What is it, to 2 decimal places?', answer: [r2(C.ab)], explanation: `√(${n(C.sx2)} + ${n(r4(C.sh2))}) ${to2(C.ab)}.` }
   ] }; }
 },
 /* u = ax² + bxy + cy² + dx is harmonic when a = −c. w = px³ + qxy² + ry² has Laplacian (6p + 2q)x + 2r, kept non-zero at the point.
    The worked example is u = ax² + 5y² and w = x³ + y². */
 q16: {
  canonical: { b: 4, c: 3, d: -2, p: 1, q: 2, r: -1, x0: 2, y0: -1 },
  draw: R => bounded(R, R => ({ b: R.nz(-5, 5), c: R.nz(-5, 5), d: R.nz(-6, 6), p: R.nz(-2, 2), q: R.nz(-4, 4), r: R.nz(-3, 3), x0: R.nz(-3, 3), y0: R.nz(-3, 3) }),
   p => 6 * p.p + 2 * p.q !== 0 && (6 * p.p + 2 * p.q) * p.x0 + 2 * p.r !== 0, { b: 4, c: 3, d: -2, p: 1, q: 2, r: -1, x0: 2, y0: -1 }),
  build: ({ b, c, d, p, q, r, x0, y0 }) => { const A = 6 * p * x0, B = 2 * q * x0 + 2 * r, L = A + B; return {
   prompt: `The flow tank’s pressure models must be harmonic. Model 1 is u(x, y) = ax² ${trm(b, 'xy')} ${trm(c, 'y²')} ${trm(d, 'x')}, where a is a constant. Model 2 is w(x, y) = ${lead(p, 'x³')} ${trm(q, 'xy²')} ${trm(r, 'y²')}. Enter the value of a that makes u harmonic, then the Laplacian ∂²w/∂x² + ∂²w/∂y² of w at the point (${n(x0)}, ${n(y0)}).`,
   answer: [-c, L],
   hints: ['A function is harmonic when its Laplacian ∂²u/∂x² + ∂²u/∂y² is 0 at every point: that is Laplace’s equation. A term in xy or in x alone has second derivative 0 in both directions.', 'For a second partial derivative, differentiate twice in the same variable, treating the other variable as a fixed number each time.'],
   solution: `For u: ∂²u/∂x² = 2a and ∂²u/∂y² = ${n(2 * c)}; the xy and x terms give 0. Laplace’s equation 2a + ${par(2 * c)} = 0 gives a = ${n(-c)}. For w: ∂²w/∂x² = ${lead(6 * p, 'x')} and ∂²w/∂y² = ${lead(2 * q, 'x')} ${cst(2 * r)}. At (${n(x0)}, ${n(y0)}) these are ${n(A)} and ${n(B)}, so the Laplacian is ${n(A)} + ${par(B)} = ${n(L)}. It is not 0, so w is not harmonic.`,
   guidance: [
    { prompt: 'Differentiate u twice with respect to y, holding x fixed. What is ∂²u/∂y²?', answer: [2 * c], explanation: `Only the y² term survives two differentiations in y: ${lead(c, 'y²')} gives ${lead(2 * c, 'y')} and then ${n(2 * c)}.` },
    { prompt: '∂²u/∂x² = 2a. What value of a makes the Laplacian of u equal to 0?', answer: [-c], explanation: `2a + ${par(2 * c)} = 0 gives a = ${n(-c)}, at every point at once.` },
    { prompt: `What is ∂²w/∂x² at the point (${n(x0)}, ${n(y0)})?`, answer: [A], explanation: `Only the x³ term survives: ∂²w/∂x² = ${lead(6 * p, 'x')}, which is ${n(A)} at x = ${n(x0)}.` },
    { prompt: 'What is ∂²w/∂y² at that point?', answer: [B], explanation: `∂²w/∂y² = ${lead(2 * q, 'x')} ${cst(2 * r)}, which is ${n(B)} at x = ${n(x0)}. The Laplacian is the sum of the two.` }
   ] }; }
 },
 /* f = az³ − icz written as u + iv with the coefficients hidden: k = −3a makes u harmonic, m = 3a gives Cauchy–Riemann,
    and f′(z₀) = ∂u/∂x + i ∂v/∂x. The worked example is u = x³ + kxy² at z₀ = 1. */
 q17: {
  canonical: { a: 2, c: 3, x0: 2, y0: 1 },
  draw: R => ({ a: R.nz(-3, 3), c: R.nz(-5, 5), x0: R.int(-2, 2), y0: R.nz(-2, 2) }),
  build: ({ a, c, x0, y0 }) => { const k = -3 * a, m = 3 * a, re = 3 * a * (x0 * x0 - y0 * y0), im = 6 * a * x0 * y0 - c; return {
   prompt: `The flow round the hull is f = u + iv with u(x, y) = ${lead(a, 'x³')} + kxy² ${trm(c, 'y')} and v(x, y) = mx²y ${trm(-a, 'y³')} ${trm(-c, 'x')}, where k and m are constants. Enter the k that makes u harmonic, then the m that makes u and v satisfy the Cauchy–Riemann equations, then the real part and the imaginary part of f′(z₀) at z₀ = ${cz([x0, y0])}.`,
   answer: [k, m, re, im],
   hints: ['u is harmonic when ∂²u/∂x² + ∂²u/∂y² = 0 at every point. u and v satisfy the Cauchy–Riemann equations when ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x at every point.', 'When f = u + iv is analytic, f′ = ∂u/∂x + i ∂v/∂x: differentiate u and v in x, then put in the point (x, y) that matches z₀ = x + iy.'],
   solution: `∂²u/∂x² = ${lead(6 * a, 'x')} and ∂²u/∂y² = 2kx, so u is harmonic when ${n(6 * a)} + 2k = 0: k = ${n(k)}. Then ∂u/∂x = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} and ∂v/∂y = mx² ${trm(-3 * a, 'y²')}, so m = ${n(m)}; the second equation, ${lead(2 * k, 'xy')} ${cst(c)} = −(2mxy ${cst(-c)}), agrees. At z₀ = ${cz([x0, y0])}, x = ${n(x0)} and y = ${n(y0)}: ∂u/∂x = ${n(3 * a)} × ${par(x0 * x0)} ${cst(-3 * a)} × ${par(y0 * y0)} = ${n(re)} and ∂v/∂x = 2 × ${par(m)} × ${par(x0)} × ${par(y0)} ${cst(-c)} = ${n(im)}. So f′(z₀) = ${cz([re, im])}.`,
   guidance: [
    { prompt: `∂²u/∂x² = ${lead(6 * a, 'x')} and ∂²u/∂y² = 2kx. What k makes u harmonic?`, answer: [k], explanation: `The sum is (${n(6 * a)} + 2k)x, which is 0 at every point only if k = ${n(k)}.` },
    { prompt: `With k = ${n(k)}, ∂u/∂x = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} and ∂v/∂y = mx² ${trm(-3 * a, 'y²')}. What m makes them equal?`, answer: [m], explanation: `Matching the x² terms gives m = ${n(m)}. Then ∂u/∂y = ${lead(2 * k, 'xy')} ${cst(c)} and −∂v/∂x = ${lead(-2 * m, 'xy')} ${cst(c)} agree as well.` },
    { prompt: `f′ = ∂u/∂x + i ∂v/∂x. What is ∂u/∂x at x = ${n(x0)}, y = ${n(y0)}?`, answer: [re], explanation: `${n(3 * a)} × ${par(x0 * x0)} ${cst(-3 * a)} × ${par(y0 * y0)} = ${n(re)}. That is the real part of f′(z₀).` },
    { prompt: `∂v/∂x = 2mxy ${cst(-c)}. What is it at that point?`, answer: [im], explanation: `2 × ${par(m)} × ${par(x0)} × ${par(y0)} ${cst(-c)} = ${n(im)}. That is the imaginary part of f′(z₀).` }
   ] }; }
 },
 /* kind (an index): 0 integrates z, 1 integrates z̄, along the segment from A = ar + ai i to B = br + bi i (B ≠ A). The worked example is ∫ z dz from 0 to 2i. */
 q18: {
  canonical: { kind: 1, ar: 1, ai: 1, br: 3, bi: 2 },
  draw: R => bounded(R, R => ({ kind: R.int(0, 1), ar: R.int(-3, 3), ai: R.int(-3, 3), br: R.int(-3, 3), bi: R.int(-3, 3) }),
   p => (p.ar !== p.br || p.ai !== p.bi) && !(p.kind === 0 && p.ar === 0 && p.ai === 0 && p.br === 0 && p.bi === 2), { kind: 1, ar: 1, ai: 1, br: 3, bi: 2 }),
  build: ({ kind, ar, ai, br, bi }) => { const A = [ar, ai], B = [br, bi], D = sub(B, A);
   const C = kind ? mul(cnj(A), D) : mul(A, D), H = kind ? [m2(D) / 2, 0] : scl(0.5, mul(D, D)), I = add(C, H), f = kind ? 'z̄' : 'z'; return {
   prompt: `A straight stretch of the ring road runs from A = ${cz(A)} to B = ${cz(B)}. Parametrise it as γ(t) = A + t(B − A) for t from 0 to 1. Enter the real part, then the imaginary part, of the contour integral ∫_γ ${f} dz.`,
   answer: [I[0], I[1]],
   hints: ['On the segment, γ(t) = A + tD with D = B − A, so γ′(t) = D and ∫_γ f(z) dz = ∫ from 0 to 1 of f(γ(t)) × D dt.', kind ? 'The conjugate of γ(t) is Ā + tD̄, so the integrand is ĀD + t × D̄D, and D̄D = |D|². A constant integrates to itself from 0 to 1, and t integrates to 1 ÷ 2.' : 'The integrand is (A + tD) × D = AD + tD². A constant integrates to itself from 0 to 1, and t integrates to 1 ÷ 2.'],
   solution: kind
    ? `D = B − A = ${cz(D)}. The conjugate of γ(t) is Ā + tD̄ with Ā = ${cz(cnj(A))}, so z̄ γ′(t) = ĀD + t|D|². ĀD = ${pz(cnj(A))} × ${pz(D)} = ${cz(C)} and |D|² = ${n(m2(D))}. Integrating from 0 to 1 gives ĀD + |D|² ÷ 2 = ${pz(C)} + ${n(H[0])} = ${cz(I)}.`
    : `D = B − A = ${cz(D)}, so z γ′(t) = (A + tD)D = AD + tD². AD = ${pz(A)} × ${pz(D)} = ${cz(C)} and D² = ${cz(mul(D, D))}. Integrating from 0 to 1 gives AD + D² ÷ 2 = ${pz(C)} + ${pz(H)} = ${cz(I)}.`,
   guidance: [
    { prompt: 'What is the real part of D = B − A?', answer: [D[0]], explanation: `${n(br)} − ${par(ar)} = ${n(D[0])}.` },
    { prompt: 'What is the imaginary part of D?', answer: [D[1]], explanation: `${n(bi)} − ${par(ai)} = ${n(D[1])}, so D = ${cz(D)} and dz = D dt.` },
    { prompt: `What is the real part of ∫_γ ${f} dz?`, answer: [I[0]], explanation: kind ? `ĀD = ${cz(C)} and |D|² ÷ 2 = ${n(H[0])}, so the integral is ${cz(I)}.` : `AD = ${cz(C)} and D² ÷ 2 = ${cz(H)}, so the integral is ${cz(I)}.` },
    { prompt: `What is the imaginary part of ∫_γ ${f} dz?`, answer: [I[1]], explanation: `The integral is ${cz(I)}, so its imaginary part is ${n(I[1])}.` }
   ] }; }
 },
 /* ∫ zᵏ dz from a to b for k = 1, 2, 3, with end points whose parts are −2 to 2. Draws keep the answer to at most 2 decimals
    (no thirds). The worked example is ∫ z dz from 0 to 1 + i. */
 q19: {
  canonical: { k: 2, ar: -1, ai: 2, br: 2, bi: 2 },
  draw: R => bounded(R, R => ({ k: R.int(1, 3), ar: R.int(-2, 2), ai: R.int(-2, 2), br: R.int(-2, 2), bi: R.int(-2, 2) }),
   p => (p.ar !== p.br || p.ai !== p.bi) && isTidy(q19calc(p).I) && q19calc(p).I.some(v => v !== 0) && !(p.k === 1 && !p.ar && !p.ai && p.br === 1 && p.bi === 1), { k: 2, ar: -1, ai: 2, br: 2, bi: 2 }),
  build: P => { const { k } = P, C = q19calc(P), e = SUP[k + 1], zk = 'z' + SUP[k]; return {
   prompt: `A cable on the ring road runs along a winding route from a = ${cz(C.A)} to b = ${cz(C.B)}. Enter the real part, then the imaginary part, of ∫ ${zk} dz along the route.`,
   answer: [C.I[0], C.I[1]],
   hints: ['zⁿ has the antiderivative zⁿ⁺¹ ÷ (n + 1), because the derivative of that is zⁿ. With an antiderivative F, the integral is F(end) − F(start), whatever route joins them.', 'Work out the powers of the two end points one multiplication at a time, using i² = −1.'],
   solution: `An antiderivative of ${zk} is F(z) = z${e} ÷ ${n(k + 1)}, so the route does not matter: the integral is F(b) − F(a) = (b${e} − a${e}) ÷ ${n(k + 1)}. b${e} = ${cz(C.Bp)} and a${e} = ${cz(C.Ap)}, so b${e} − a${e} = ${cz(C.D)}. Dividing by ${n(k + 1)} gives ${cz(C.I)}.`,
   guidance: [
    { prompt: `b${e} = ${cz(C.Bp)} and a${e} = ${cz(C.Ap)}. What is the real part of b${e} − a${e}?`, answer: [C.D[0]], explanation: `${n(C.Bp[0])} − ${par(C.Ap[0])} = ${n(C.D[0])}.` },
    { prompt: `What is the imaginary part of b${e} − a${e}?`, answer: [C.D[1]], explanation: `${n(C.Bp[1])} − ${par(C.Ap[1])} = ${n(C.D[1])}.` },
    { prompt: `The integral is (b${e} − a${e}) ÷ ${n(k + 1)}. What is its real part?`, answer: [C.I[0]], explanation: `${n(C.D[0])} ÷ ${n(k + 1)} = ${n(C.I[0])}.` },
    { prompt: 'What is its imaginary part?', answer: [C.I[1]], explanation: `${n(C.D[1])} ÷ ${n(k + 1)} = ${n(C.I[1])}. So the integral is ${cz(C.I)} along any route from a to b.` }
   ] }; }
 },
 /* One power (z − c)ⁿ with n ≠ 0, and a mix A ÷ (z − c) + B(z − c)ᵐ with m ≠ −1, round the circle |z − c| = r.
    k₁ is 2 only for n = −1; k₂ = 2A. c ≠ 0. The worked example is ∮ dz ÷ z round the unit circle. */
 q20: {
  canonical: { n: -2, cr: 2, ci: -1, r: 3, A: 3, B: -2, m: 2 },
  draw: R => bounded(R, R => ({ n: R.pick([-3, -2, -1, -1, 1, 2]), cr: R.int(-3, 3), ci: R.int(-3, 3), r: R.int(2, 5), A: R.nz(-5, 5), B: R.nz(-4, 4), m: R.pick([-3, -2, 2, 3]) }),
   p => p.cr !== 0 || p.ci !== 0, { n: -2, cr: 2, ci: -1, r: 3, A: 3, B: -2, m: 2 }),
  build: ({ n: e, cr, ci, r, A, B, m }) => { const c = [cr, ci], w = `(${zm(c)})`, k1 = e === -1 ? 2 : 0, k2 = 2 * A;
   const bt = `${sgn(B)} ${Math.abs(B) === 1 ? '' : n(Math.abs(B))}${w}${SUP[m]}`;
   const one = e === -1 ? `The power is −1, so put z = c + ${n(r)}(cos t + i sin t): then dz ÷ (z − c) = i dt, and t runs from 0 to 2π, so the integral is 2πi and k₁ = 2.` : `${w}${SUP[e]} has the antiderivative ${w}${SUP[e + 1]} ÷ ${par(e + 1)}, which takes the same value at the start and the end of a closed curve, so the integral is 0 and k₁ = 0.`; return {
   prompt: `The ring road is the circle of radius ${n(r)} centred at c = ${cz(c)}, driven once anticlockwise; ∮ means a contour integral once round it. ∮ ${w}${SUP[e]} dz = k₁πi and ∮ (${n(A)} ÷ ${w} ${bt}) dz = k₂πi. Enter k₁, then k₂.`,
   answer: [k1, k2],
   hints: ['For a power other than −1, (z − c)ⁿ has the antiderivative (z − c)ⁿ⁺¹ ÷ (n + 1). Round a closed curve the start and the end are the same point, so the integral is 0.', 'For the power −1, parametrise z = c + r(cos t + i sin t) for t from 0 to 2π. Then dz ÷ (z − c) = i dt, which adds up to 2πi whatever the centre and the radius.'],
   solution: `${one} In the second integral, ${n(A)} ÷ ${w} gives ${n(A)} × 2πi = ${n(k2)}πi, and ${lead(B, w + SUP[m])} gives 0 because its power is not −1. So k₂ = ${n(k2)}.`,
   guidance: [
    { prompt: `What is k₁ in ∮ ${w}${SUP[e]} dz = k₁πi?`, answer: [k1], explanation: one },
    { prompt: `What is k in ∮ ${n(A)} ÷ ${w} dz = kπi?`, answer: [k2], explanation: `∮ dz ÷ ${w} = 2πi, so ${n(A)} times it is ${n(k2)}πi.` },
    { prompt: `What is k in ∮ ${lead(B, w + SUP[m])} dz = kπi?`, answer: [0], explanation: `The power ${n(m)} is not −1, so ${w}${SUP[m]} has an antiderivative on the circle and the integral round the closed curve is 0. Adding the pieces, k₂ = ${n(k2)} + 0.` }
   ] }; }
 },
});
})();
