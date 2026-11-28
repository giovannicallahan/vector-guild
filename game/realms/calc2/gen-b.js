/* Calculus 2: accumulation mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Fractions as text in lowest terms ("17/3", or "6" when whole); sixths and the like stay exact this way. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (p, q) => { const g = gcd(p, q), s = q < 0 ? -1 : 1; return [s * p / g, s * q / g]; };
const fr = (p, q) => { const [a, b] = red(p, q); return b === 1 ? n(a) : `${n(a)}/${n(b)}`; };
/* A fraction times π, bracketed so it cannot be misread: (27/2)π, 6π. */
const pi = t => t.includes('/') ? `(${t})π` : `${t}π`;
/* Rounding to a stated number of places, and the same value as text with its trailing zeros ("10.90"). */
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => rd(x, k).toFixed(k);
/* True when x sits so close to a rounding boundary at k places that a player's rounding could differ. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(d => SUP[d]).join('');
/* A coefficient in front of a letter term, never a written-out 1: co(1, 'x²') is 'x²', co(4, 'x') is '4x'. */
const co = (k, x) => k === 1 ? x : `${n(k)}${x}`;
/* e to a whole power as text: e, e², e³. */
const ep = b => b === 1 ? 'e' : 'e' + sup(b);
/* q19: ∫ from u1 to 1 of uᵖ(1 − u²)ᵏ du as an exact fraction, term by term. */
const BIN = { 1: [1, -1], 2: [1, -2, 1], 3: [1, -3, 3, -1] };
const powTerms = (p, k, u1) => BIN[k].map((c, i) => { const j = p + 2 * i, top = 1 - Math.pow(u1, j + 1); return { c, j, num: c * top, den: j + 1 }; });
const sumFr = terms => terms.reduce(([a, b], t) => red(a * t.den + t.num * b, b * t.den), [0, 1]);
/* q18: uv at the limits (B), ∫ v du (R) and the value B − R. */
const parts18 = ({ fam, c, b }) => { const P = Math.PI;
   if (fam === 'exp') { const e = Math.exp(b); return { B: c * b * e, R: c * (e - 1), V: c * ((b - 1) * e + 1) }; }
   if (fam === 'ln') return { B: c * b * Math.log(b), R: c * (b - 1), V: c * (b * Math.log(b) - b + 1) };
   if (fam === 'sin') return { B: c * P, R: 0, V: c * P };
   return { B: c * P / 2, R: c, V: c * (P / 2 - 1) }; };
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Plate between y = x² and y = cx from 0 to d > c; the curves swap at x = c. Areas in sixths, the nozzle (the part from
    0 to c spun about the x-axis) is 2c⁵/15 π. c >= 2 keeps clear of the worked example (y = x, 0 to 2). */
 q11: {
  canonical: { c: 2, d: 3 },
  draw: R => { const c = R.int(2, 5); return { c, d: R.int(c + 1, c + 6) }; },
  build: ({ c, d }) => { const c2 = c * c, c3 = c2 * c, c5 = c3 * c2, d2 = d * d, d3 = d2 * d,
   L6 = c3, R6 = 2 * (d3 - c3) - 3 * c * (d2 - c2), T6 = L6 + R6, k = 2 * c5 / 15; return {
   prompt: `A hull plate is cut from the region between the parabola y = x² and the line y = ${n(c)}x, from x = 0 to x = ${n(d)}, with lengths in metres. The two curves cross inside that stretch, so they swap places. Enter the total area of the plate in m². Then the part of the plate between x = 0 and the crossing point is spun about the x-axis to make a nozzle of volume kπ m³: enter k. Type each answer as an exact fraction, such as 7/3, or as a decimal rounded to 4 places.`,
   answer: [T6 / 6, k],
   hints: ['Set x² equal to the line to find where the curves cross. On each side of the crossing, subtract the lower curve from the upper one before you integrate, and add the two areas.', 'Spun about the x-axis, each slice of the nozzle is a washer: its outer radius is the line and its inner radius is the parabola, so the volume is π times the integral of (outer radius)² − (inner radius)².'],
   solution: `x² = ${n(c)}x gives x = 0 and x = ${n(c)}. From 0 to ${n(c)} the line is on top: ∫ (${n(c)}x − x²) dx = ${n(c3)} ÷ 2 − ${n(c3)} ÷ 3 = ${fr(L6, 6)}. From ${n(c)} to ${n(d)} the parabola is on top: ∫ (x² − ${n(c)}x) dx = (${n(d3)} − ${n(c3)}) ÷ 3 − ${n(c)} × (${n(d2)} − ${n(c2)}) ÷ 2 = ${fr(R6, 6)}. The total area is ${fr(L6, 6)} + ${fr(R6, 6)} = ${fr(T6, 6)} m². For the nozzle, the washer at x has outer radius ${n(c)}x and inner radius x², so V = π ∫ from 0 to ${n(c)} of (${n(c2)}x² − x⁴) dx = π(${n(c5)} ÷ 3 − ${n(c5)} ÷ 5) = ${pi(fr(2 * c5, 15))}. So k = ${fr(2 * c5, 15)}.`,
   guidance: [
    { prompt: `Where do y = x² and y = ${n(c)}x cross, apart from x = 0?`, answer: [c], explanation: `x² = ${n(c)}x means x(x − ${n(c)}) = 0, so x = 0 or x = ${n(c)}. Between 0 and ${n(c)} the line is higher; beyond ${n(c)} the parabola is.` },
    { prompt: `What is the area from 0 to ${n(c)}, where the line is on top, and the area from ${n(c)} to ${n(d)}, where the parabola is on top? Type them as fractions.`, answer: [L6 / 6, R6 / 6], explanation: `On the left, ${n(c3)} ÷ 2 − ${n(c3)} ÷ 3 = ${fr(L6, 6)}. On the right, (${n(d3)} − ${n(c3)}) ÷ 3 − ${n(c)} × (${n(d2)} − ${n(c2)}) ÷ 2 = ${fr(R6, 6)}. Together they make ${fr(T6, 6)} m².` },
    { prompt: `The nozzle is the left part spun about the x-axis. Its washers have outer radius ${n(c)}x and inner radius x². What is k, where the volume is kπ?`, answer: [k], explanation: `V = π ∫ from 0 to ${n(c)} of ((${n(c)}x)² − (x²)²) dx = π(${n(c5)} ÷ 3 − ${n(c5)} ÷ 5) = ${pi(fr(2 * c5, 15))}.` }
   ] }; }
 },
 /* The region under y = bx − x² (0 to b) spun about the y-axis, k₁ = b⁴/6, and about x = −c, k₂ = b⁴/6 + cb³/3.
    b >= 3 keeps clear of the worked example (2x − x²). */
 q12: {
  canonical: { b: 3, c: 2 },
  draw: R => ({ b: R.int(3, 8), c: R.int(1, 5) }),
  build: ({ b, c }) => { const b3 = b * b * b, b4 = b3 * b, K1 = b4, K2 = b4 + 2 * c * b3; return {
   prompt: `A cable drum for the cargo crane is turned from the region under the arch y = ${n(b)}x − x², between x = 0 and x = ${n(b)}, with lengths in metres. Spun about the y-axis, the region would sweep out a solid of volume k₁π m³. The drum is instead spun about the line x = ${n(-c)}, which is ${n(c)} m to the left of the y-axis, and its volume is k₂π m³. Use cylindrical shells. Enter k₁, then k₂, each as an exact fraction such as 27/2 or as a decimal rounded to 4 places (type it without commas).`,
   answer: [K1 / 6, K2 / 6],
   hints: ['Cut the region into thin upright strips. Spun about a vertical line, the strip at x sweeps out a cylindrical shell of volume about 2π × radius × height × dx.', `The height of every shell is ${n(b)}x − x². Only the radius depends on the axis: the distance from x to the y-axis is x, and the distance from x to the line x = ${n(-c)} is x + ${n(c)}.`],
   solution: `The arch meets the x-axis at x = 0 and x = ${n(b)}. About the y-axis, the shell through x has radius x and height ${n(b)}x − x², so V = 2π ∫ from 0 to ${n(b)} of (${n(b)}x² − x³) dx = 2π(${n(b4)} ÷ 3 − ${n(b4)} ÷ 4) = 2π × ${fr(b4, 12)} = ${pi(fr(K1, 6))}, and k₁ = ${fr(K1, 6)}. About x = ${n(-c)}, the radius is x + ${n(c)}, so V = 2π ∫ from 0 to ${n(b)} of (x + ${n(c)})(${n(b)}x − x²) dx. Its extra part is 2π × ${n(c)} × ∫ (${n(b)}x − x²) dx = 2π × ${n(c)} × ${fr(b3, 6)} = ${pi(fr(c * b3, 3))}, so k₂ = ${fr(K1, 6)} + ${fr(c * b3, 3)} = ${fr(K2, 6)}.`,
   guidance: [
    { prompt: `Look at the shell through x = 1. What is its height, and what is its radius when the axis is the line x = ${n(-c)}?`, answer: [b - 1, 1 + c], explanation: `The height is ${n(b)} × 1 − 1² = ${n(b - 1)} m. The axis is ${n(c)} m left of the y-axis, so the radius is 1 + ${n(c)} = ${n(1 + c)} m.` },
    { prompt: `About the y-axis, V = 2π ∫ from 0 to ${n(b)} of x(${n(b)}x − x²) dx. What is k₁, where V = k₁π?`, answer: [K1 / 6], explanation: `2π(${n(b4)} ÷ 3 − ${n(b4)} ÷ 4) = 2π × ${fr(b4, 12)} = ${pi(fr(K1, 6))}.` },
    { prompt: `About x = ${n(-c)}, the radius is x + ${n(c)}. What is k₂?`, answer: [K2 / 6], explanation: `The extra radius ${n(c)} adds 2π × ${n(c)} × ∫ (${n(b)}x − x²) dx = 2π × ${n(c)} × ${fr(b3, 6)} = ${pi(fr(c * b3, 3))}, so k₂ = ${fr(K1, 6)} + ${fr(c * b3, 3)} = ${fr(K2, 6)}.` }
   ] }; }
 },
 /* y = a·x^(3/2) from 0 to b: (dy/dx)² = qx with q = 9a²/4, u = 1 + qx runs from 1 to U = 1 + qb (a whole number),
    L = 2(U^(3/2) − 1) ÷ (3q), to 2 decimal places. Not the worked example (2/3 x^(3/2), 0 to 3). */
 q13: {
  canonical: { a: 2, b: 3 },
  draw: R => { let p; do { p = R.pick([{ a: 1, b: R.pick([4, 8, 12, 16, 20, 24]) }, { a: 2, b: R.int(1, 8) }, { a: 3, b: R.pick([4, 8]) }, { a: 4, b: R.int(1, 4) }]); } while (edge(2 * (Math.pow(1 + 2.25 * p.a * p.a * p.b, 1.5) - 1) / (6.75 * p.a * p.a), 2)); return p; },
  build: ({ a, b }) => { const q = 2.25 * a * a, U = 1 + q * b, U15 = Math.pow(U, 1.5), L = 2 * (U15 - 1) / (3 * q), L2 = rd(L, 2); return {
   prompt: `A crane’s guide rail follows the curve y = ${co(a, 'x^(3/2)')} from x = 0 to x = ${n(b)}, in metres. To order the rail, the crew needs the arc length of that piece of curve. Change the variable with u = 1 + (dy/dx)². Enter the upper limit in u, then the length of the rail in metres to 2 decimal places.`,
   answer: [U, L2],
   hints: ['By the power rule the derivative of x^(3/2) is (3/2)x^(1/2), which is 1.5√x. Square dy/dx before you add 1.', `The arc length is ∫ from 0 to ${n(b)} of √(1 + (dy/dx)²) dx. When you change to u, change the limits too: x = 0 gives u = 1.`],
   solution: `dy/dx = ${n(1.5 * a)}√x, so (dy/dx)² = ${n(q)}x and the length is L = ∫ from 0 to ${n(b)} of √(1 + ${n(q)}x) dx. Put u = 1 + ${n(q)}x, so du = ${n(q)} dx; x = 0 gives u = 1 and x = ${n(b)} gives u = ${n(U)}. Then L = (1 ÷ ${n(q)}) ∫ from 1 to ${n(U)} of √u du = (1 ÷ ${n(q)}) × (2/3)(${n(U)}^(3/2) − 1) = (2 ÷ ${n(3 * q)}) × (${n(U15)} − 1), which is about ${fx(L, 2)}. The rail is ${fx(L, 2)} m long.`,
   guidance: [
    { prompt: `What is the slope dy/dx of the rail at x = 1?`, answer: [1.5 * a], explanation: `dy/dx = ${a === 1 ? '' : n(a) + ' × '}(3/2)√x = ${n(1.5 * a)}√x, and √1 = 1, so the slope at x = 1 is ${n(1.5 * a)}.` },
    { prompt: `With u = 1 + ${n(q)}x, what do the limits x = 0 and x = ${n(b)} become?`, answer: [1, U], explanation: `x = 0 gives u = 1 + 0 = 1, and x = ${n(b)} gives u = 1 + ${n(q)} × ${n(b)} = ${n(U)}.` },
    { prompt: `L = (2 ÷ ${n(3 * q)}) × (${n(U)}^(3/2) − 1). What is the length, to 2 decimal places?`, answer: [L2], explanation: `${n(U)}^(3/2) = ${n(U)} × √${n(U)}, about ${n(U15)}. Then (2 ÷ ${n(3 * q)}) × ${n(U15 - 1)} is about ${fx(L, 2)} m.` }
   ] }; }
 },
 /* Hooke's law: F N holds the spring s m out, k = F ÷ s (a multiple of 10, so F is whole); stretches in tenths of a metre
    (D1, D2 tenths), W = k(D2² − D1²) ÷ 200 has at most 2 decimals. Not the worked example (20 N at 0.1 m, 0 to 0.3). */
 q14: {
  canonical: { F: 36, s10: 2, D1: 1, D2: 4 },
  draw: R => { let p; do { const s10 = R.pick([1, 2, 5]), k = 10 * R.int(6, 40), D1 = R.int(0, 3); p = { F: k * s10 / 10, s10, D1, D2: D1 + R.int(2, 4) }; } while (p.F === 20 && p.s10 === 1); return p; },
  build: ({ F, s10, D1, D2 }) => { const s = s10 / 10, k = F * 10 / s10, d1 = D1 / 10, d2 = D2 / 10, sq1 = D1 * D1 / 100, sq2 = D2 * D2 / 100,
   W = k * (D2 * D2 - D1 * D1) / 200, Fe = k * D2 / 10; return {
   prompt: `A crane’s shock spring needs a force of ${n(F)} N to hold it ${n(s)} m beyond its natural length. By Hooke’s law, the force that holds it x metres beyond its natural length is F(x) = kx newtons. Enter the spring constant k in newtons per metre, then the work in joules needed to stretch the spring from x = ${n(d1)} to x = ${n(d2)}.`,
   answer: [k, W],
   hints: [`Hooke’s law at the reading says ${n(F)} = k × ${n(s)}; divide to find k.`, 'The force grows as the spring stretches, so the work is the integral of F(x) = kx between the two stretches, not one force times the distance.'],
   solution: `From ${n(F)} = k × ${n(s)}, k = ${n(F)} ÷ ${n(s)} = ${n(k)} N/m. The work is W = ∫ from ${n(d1)} to ${n(d2)} of ${n(k)}x dx = ${n(k)} × (${n(d2)}² − ${n(d1)}²) ÷ 2 = ${n(k / 2)} × (${n(sq2)} − ${n(sq1)}) = ${n(W)} J.`,
   guidance: [
    { prompt: `${n(F)} N holds the spring ${n(s)} m out. What is k, the force for each metre of stretch?`, answer: [k], explanation: `k = ${n(F)} ÷ ${n(s)} = ${n(k)} newtons per metre.` },
    { prompt: `What force holds the spring at x = ${n(d2)}, the end of the stretch?`, answer: [Fe], explanation: `F(${n(d2)}) = ${n(k)} × ${n(d2)} = ${n(Fe)} N. The force at the start is smaller, which is why one force times the distance would be wrong.` },
    { prompt: `What is the work, ∫ from ${n(d1)} to ${n(d2)} of ${n(k)}x dx, in joules?`, answer: [W], explanation: `An antiderivative of ${n(k)}x is ${n(k / 2)}x², so W = ${n(k / 2)} × (${n(sq2)} − ${n(sq1)}) = ${n(W)} J.` }
   ] }; }
 },
 /* Pump a tank empty through an outlet h m above its top. Cross-section A (box L × w, or cylinder πr²), height H, water depth D.
    Slice at height y rises H + h − y; W = 9800 A ∫ from 0 to D (H + h − y) dy, in kJ to 1 decimal place. */
 q15: {
  canonical: { cyl: 1, r: 2, l: 0, w: 0, H: 3, D: 3, h: 1 },
  draw: R => { let p; do { const cyl = R.bool() ? 1 : 0, H = R.int(2, 5);
    p = { cyl, r: cyl ? R.int(1, 3) : 0, l: cyl ? 0 : R.int(2, 5), w: cyl ? 0 : R.int(2, 4), H, D: R.int(Math.max(2, H - 2), H), h: R.int(1, 3) };
   } while (edge(9.8 * (p.cyl ? Math.PI * p.r * p.r : p.l * p.w) * (p.D * (p.H + p.h) - p.D * p.D / 2), 1)); return p; },
  build: ({ cyl, r, l, w, H, D, h }) => { const A = cyl ? Math.PI * r * r : l * w, top = H + h, I = D * top - D * D / 2, WJ = 9800 * A * I, Wk = rd(WJ / 1000, 1),
   per = cyl ? `${n(9800 * r * r)}π` : n(9800 * l * w);
   const tank = cyl ? `an upright cylinder of radius ${n(r)} m and height ${n(H)} m` : `a box ${n(l)} m long, ${n(w)} m wide and ${n(H)} m tall`;
   const area = cyl ? `a circle of area π × ${n(r)}² = ${n(r * r)}π m²` : `a rectangle of area ${n(l)} × ${n(w)} = ${n(l * w)} m²`;
   const weigh = cyl ? `1000 × 9.8 × ${n(r * r)}π dy` : `1000 × 9.8 × ${n(l * w)} dy`; return {
   prompt: `A water tank at the foot of the crane is ${tank}, filled with water to a depth of ${n(D)} m. A pump lifts all of the water out through a pipe whose outlet is ${n(h)} m above the top of the tank. Water has density 1000 kg/m³, and g = 9.8 m/s². Measure y in metres up from the bottom of the tank. Enter how far a thin slice of water at the bottom, y = 0, must be lifted in metres, then the work needed to pump the tank empty in kilojoules to 1 decimal place (type it without commas).`,
   answer: [top, Wk],
   hints: ['A thin slice of water at height y has volume (area of the cross-section) × dy. Its mass is the density times that volume, and its weight is 9.8 times the mass.', 'Each slice rises from its own height to the outlet: the tank height plus the outlet height, minus y. Integrate the weight of a slice times that distance from y = 0 to the depth of the water.'],
   solution: `The cross-section is ${area}, so a slice of thickness dy weighs ${weigh} = ${per} dy newtons. The outlet is ${n(H)} + ${n(h)} = ${n(top)} m above the bottom, so a slice at height y rises ${n(top)} − y metres. The work is W = ${per} ∫ from 0 to ${n(D)} of (${n(top)} − y) dy = ${per} × (${n(D * top)} − ${n(D * D / 2)}) = ${per} × ${n(I)}, which is about ${n(Math.round(WJ))} J, or ${fx(WJ / 1000, 1)} kJ.`,
   guidance: [
    { prompt: `How far must a slice at the very bottom, y = 0, be lifted to reach the outlet? And a slice at the surface of the water, y = ${n(D)}?`, answer: [top, top - D], explanation: `The outlet is ${n(H)} + ${n(h)} = ${n(top)} m above the bottom. A slice at y = 0 rises ${n(top)} m; a slice at y = ${n(D)} rises ${n(top)} − ${n(D)} = ${n(top - D)} m.` },
    { prompt: `Work out ∫ from 0 to ${n(D)} of (${n(top)} − y) dy.`, answer: [I], explanation: `An antiderivative is ${n(top)}y − y² ÷ 2, so the integral is ${n(D * top)} − ${n(D * D / 2)} = ${n(I)}.` },
    { prompt: `A slice weighs ${per} newtons for each metre of thickness. What is the work in kilojoules, to 1 decimal place?`, answer: [Wk], explanation: `${per} × ${n(I)} is about ${n(Math.round(WJ))} J. Dividing by 1000 gives ${fx(WJ / 1000, 1)} kJ.` }
   ] }; }
 },
 /* A rod of length L with density a + bx kg/m: m = aL + bL²/2, M = aL²/2 + bL³/3, x̄ = M ÷ m. Draws keep M and x̄ to
    at most 3 decimals. Not the worked example (6 m, 2x). */
 q16: {
  canonical: { a: 2, b: 4, L: 3 },
  draw: R => { const ok = x => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7; let p;
   do { p = { a: R.int(1, 9), b: R.int(1, 6), L: R.int(2, 6) }; } while (!ok(p.a * p.L * p.L / 2 + p.b * p.L * p.L * p.L / 3) || !ok((p.a * p.L * p.L / 2 + p.b * p.L * p.L * p.L / 3) / (p.a * p.L + p.b * p.L * p.L / 2))); return p; },
  build: ({ a, b, L }) => { const L2 = L * L, L3 = L2 * L, m = a * L + b * L2 / 2, M = a * L2 / 2 + b * L3 / 3, xb = M / m; return {
   prompt: `A crane’s steel arm is a rod ${n(L)} m long, thicker towards its far end. Its density, its mass per metre of length, is ρ(x) = ${n(a)} + ${co(b, 'x')} kg/m at x metres from the pivot. Enter the mass of the arm in kilograms, then the distance x̄ of its centre of mass from the pivot in metres.`,
   answer: [m, xb],
   hints: ['The mass is the integral of the density along the rod, from the pivot to the far end.', 'The moment about the pivot is the integral of x × ρ(x). The centre of mass is the moment divided by the mass.'],
   solution: `m = ∫ from 0 to ${n(L)} of (${n(a)} + ${co(b, 'x')}) dx = ${n(a)} × ${n(L)} + ${n(b)} × ${n(L2)} ÷ 2 = ${n(m)} kg. The moment about the pivot is M = ∫ from 0 to ${n(L)} of (${co(a, 'x')} + ${co(b, 'x²')}) dx = ${n(a)} × ${n(L2)} ÷ 2 + ${n(b)} × ${n(L3)} ÷ 3 = ${n(M)} kg·m. So x̄ = M ÷ m = ${n(M)} ÷ ${n(m)} = ${n(xb)} m from the pivot.`,
   guidance: [
    { prompt: `What is the mass of the arm, ∫ from 0 to ${n(L)} of (${n(a)} + ${co(b, 'x')}) dx?`, answer: [m], explanation: `An antiderivative is ${co(a, 'x')} + ${co(b / 2, 'x²')}, so m = ${n(a * L)} + ${n(b * L2 / 2)} = ${n(m)} kg.` },
    { prompt: `What is the moment about the pivot, ∫ from 0 to ${n(L)} of x(${n(a)} + ${co(b, 'x')}) dx?`, answer: [M], explanation: `x(${n(a)} + ${co(b, 'x')}) = ${co(a, 'x')} + ${co(b, 'x²')}, so M = ${n(a)} × ${n(L2)} ÷ 2 + ${n(b)} × ${n(L3)} ÷ 3 = ${n(M)} kg·m.` },
    { prompt: `Divide the moment by the mass. How far from the pivot is the centre of mass?`, answer: [xb], explanation: `x̄ = ${n(M)} ÷ ${n(m)} = ${n(xb)} m. It lies beyond the middle of the rod, at ${n(L / 2)} m, because the far end is heavier.` }
   ] }; }
 },
 /* Drum: the region between y = x² and y = c² for 0 <= x <= c, about the y-axis, k = c⁴/2 (shells). Cable: Lc m of
    lam kg/m wound up, W = 9.8 lam Lc²/2 J (at most 1 decimal, Lc a multiple of 5). Not the worked example (10 m, 2 kg/m). */
 q17: {
  canonical: { c: 3, lam: 4, Lc: 20 },
  draw: R => ({ c: R.int(2, 4), lam: R.int(3, 6), Lc: R.pick([15, 20, 25, 30, 35, 40]) }),
  build: ({ c, lam, Lc }) => { const c2 = c * c, c4 = c2 * c2, k = c4 / 2, wpm = rd(9.8 * lam, 1), W = rd(4.9 * lam * Lc * Lc, 1); return {
   prompt: `The gantry crane’s cable drum is the solid made by spinning the region between the parabola y = x² and the line y = ${n(c2)}, for x from 0 to ${n(c)}, about the y-axis, with lengths in decimetres; its volume is kπ dm³. A steel cable ${n(Lc)} m long, with a mass of ${n(lam)} kg per metre, hangs straight down from the drum. Enter k, then the work in joules needed to wind the whole cable up onto the drum (g = 9.8 m/s²; type it without commas).`,
   answer: [k, W],
   hints: ['Use cylindrical shells about the y-axis: the shell through x has radius x, and its height is the line minus the parabola.', 'Cut the cable into short pieces. A piece y metres below the drum weighs 9.8 × (mass per metre) × dy newtons and must be lifted y metres.'],
   solution: `The shell through x has radius x and height ${n(c2)} − x², so V = 2π ∫ from 0 to ${n(c)} of (${n(c2)}x − x³) dx = 2π(${n(c4)} ÷ 2 − ${n(c4)} ÷ 4) = ${n(k)}π, and k = ${n(k)}. Each metre of cable weighs 9.8 × ${n(lam)} = ${n(wpm)} N, and the piece y metres down rises y metres, so W = ∫ from 0 to ${n(Lc)} of ${n(wpm)}y dy = ${n(wpm)} × ${n(Lc * Lc)} ÷ 2 = ${n(W)} J.`,
   guidance: [
    { prompt: `What is the height of the shell through x = 1, in decimetres?`, answer: [c2 - 1], explanation: `The line is at ${n(c2)} and the parabola at 1² = 1, so the height is ${n(c2)} − 1 = ${n(c2 - 1)} dm.` },
    { prompt: `V = 2π ∫ from 0 to ${n(c)} of x(${n(c2)} − x²) dx. What is k, where V = kπ?`, answer: [k], explanation: `2π(${n(c4)} ÷ 2 − ${n(c4)} ÷ 4) = 2π × ${n(c4 / 4)} = ${n(k)}π.` },
    { prompt: `What does one metre of cable weigh, in newtons, and what is the work to wind it all up, in joules?`, answer: [wpm, W], explanation: `9.8 × ${n(lam)} = ${n(wpm)} N per metre. The work is ∫ from 0 to ${n(Lc)} of ${n(wpm)}y dy = ${n(wpm)} × ${n(Lc * Lc)} ÷ 2 = ${n(W)} J.` }
   ] }; }
 },
 /* Integration by parts, four families: c x eˣ on [0, b]; c ln x on [1, b]; c x sin x on [0, π]; c x cos x on [0, π/2].
    Answers: the boundary term [uv] and the value, both to 3 decimal places. Not the worked example (x eˣ on [0, 1]). */
 q18: {
  canonical: { fam: 'exp', c: 3, b: 2 },
  draw: R => { let p, v; do { const fam = R.pick(['exp', 'ln', 'sin', 'cos']); p = { fam, c: R.int(2, 5), b: fam === 'exp' ? R.int(1, 3) : fam === 'ln' ? R.int(2, 6) : 0 }; v = parts18(p); } while (edge(v.B, 3) || edge(v.R, 3) || edge(v.V, 3)); return p; },
  build: p => { const { fam, c, b } = p, { B, R, V } = parts18(p), B3 = fx(B, 3), R3 = Number.isInteger(R) ? n(R) : fx(R, 3), V3 = fx(V, 3), half = c % 2 ? `${n(c)}π/2` : c === 2 ? 'π' : `${n(c / 2)}π`;
   const F = {
    exp: { lim: `0 to ${n(b)}`, f: `${n(c)}x eˣ`, u: `${n(c)}x`, dv: 'eˣ dx', du: `${n(c)} dx`, v: 'eˣ',
     sol: `The boundary term is [${n(c)}x eˣ] from 0 to ${n(b)}, which is ${n(c)} × ${n(b)} × ${ep(b)} − 0, about ${B3}. The remaining integral is ∫ from 0 to ${n(b)} of ${n(c)}eˣ dx = ${n(c)}(${ep(b)} − 1), about ${R3}.` },
    ln: { lim: `1 to ${n(b)}`, f: `${n(c)} ln x`, u: `${n(c)} ln x`, dv: 'dx', du: `(${n(c)} ÷ x) dx`, v: 'x',
     sol: `The boundary term is [${n(c)}x ln x] from 1 to ${n(b)}, which is ${n(c)} × ${n(b)} × ln ${n(b)} − ${n(c)} × 1 × ln 1, about ${B3}, because ln 1 = 0. The remaining integral is ∫ from 1 to ${n(b)} of x × (${n(c)} ÷ x) dx = ∫ from 1 to ${n(b)} of ${n(c)} dx = ${n(c)} × ${n(b - 1)} = ${R3}.` },
    sin: { lim: '0 to π', f: `${n(c)}x sin x`, u: `${n(c)}x`, dv: 'sin x dx', du: `${n(c)} dx`, v: '−cos x',
     sol: `The boundary term is [−${n(c)}x cos x] from 0 to π, which is −${n(c)}π cos π − 0 = ${n(c)}π, about ${B3}, because cos π = −1. The remaining integral is ∫ from 0 to π of −${n(c)} cos x dx = −${n(c)}(sin π − sin 0) = 0.` },
    cos: { lim: '0 to π/2', f: `${n(c)}x cos x`, u: `${n(c)}x`, dv: 'cos x dx', du: `${n(c)} dx`, v: 'sin x',
     sol: `The boundary term is [${n(c)}x sin x] from 0 to π/2, which is ${n(c)} × (π/2) × sin(π/2) − 0 = ${half}, about ${B3}. The remaining integral is ∫ from 0 to π/2 of ${n(c)} sin x dx = ${n(c)}(−cos(π/2) + cos 0) = ${n(c)}.` }
   }[fam]; return {
   prompt: `The computing core’s cooling model gives the heat carried off by one coolant loop as ∫ from ${F.lim} of ${F.f} dx kilojoules${fam === 'sin' || fam === 'cos' ? ', with x in radians' : ''}. Use integration by parts with u = ${F.u} and dv = ${F.dv}. Enter the boundary term [uv] over the interval, then the value of the integral, both to 3 decimal places.`,
   answer: [rd(B, 3), rd(V, 3)],
   hints: ['Integration by parts says ∫ u dv = [uv] − ∫ v du. Differentiate u to get du, and integrate dv to get v.', `Here du = ${F.du} and v = ${F.v}. Work out uv at the top limit minus uv at the bottom limit, then the new integral ∫ v du over the same interval.`],
   solution: `With u = ${F.u}, du = ${F.du}; with dv = ${F.dv}, v = ${F.v}. ${F.sol} So the integral is ${B3} − ${R3}, which is ${V3} to 3 decimal places.`,
   guidance: [
    { prompt: `With u = ${F.u} and v = ${F.v}, what is the boundary term [uv] from ${F.lim}, to 3 decimal places?`, answer: [rd(B, 3)], explanation: F.sol.split('. The remaining')[0] + '.' },
    { prompt: `What is ∫ v du over the same interval, where du = ${F.du}?`, answer: [rd(R, 3)], explanation: `The remaining${F.sol.split('. The remaining')[1]}` },
    { prompt: `Subtract: what is ∫ from ${F.lim} of ${F.f} dx, to 3 decimal places?`, answer: [rd(V, 3)], explanation: `[uv] − ∫ v du = ${B3} − ${R3}, which is ${V3}. Round only at the end.` }
   ] }; }
 },
 /* ∫ from 0 to L of sinᵠx cosᵖx dx with q odd (3 or 5), L = π/2 or π (π only for even p, else the answer would be 0).
    u = cos x turns it into ∫ from u(L) to 1 of uᵖ(1 − u²)ᵏ du, an exact fraction. Not the worked example (sin³x, 0 to π). */
 q19: {
  canonical: { q: 3, p: 2, L: 1 },
  draw: R => { let p; do { const P = R.int(0, 4); p = { q: R.pick([3, 5, 7]), p: P, L: P % 2 ? 1 : R.pick([1, 2]) }; } while (p.q === 3 && p.p === 0 && p.L === 2); return p; },
  build: ({ q, p, L }) => { const k = (q - 1) / 2, u1 = L === 1 ? 0 : -1, terms = powTerms(p, k, u1), [A, B] = sumFr(terms), top = L === 1 ? 'π/2' : 'π';
   const f = `sin${sup(q)}x${p === 0 ? '' : p === 1 ? ' cos x' : ` cos${sup(p)}x`}`;
   const cp = p === 0 ? '' : p === 1 ? 'u' : `u${sup(p)}`;
   const split = k === 1 ? '(1 − cos²x)' : `(1 − cos²x)${sup(k)}`;
   const poly = terms.map((t, i) => `${i === 0 ? '' : t.c < 0 ? ' − ' : ' + '}${Math.abs(t.c) === 1 ? '' : n(Math.abs(t.c))}${t.j === 0 ? (Math.abs(t.c) === 1 ? '1' : '') : t.j === 1 ? 'u' : 'u' + sup(t.j)}`).join('');
   const vals = terms.map((t, i) => `${i === 0 ? '' : t.num < 0 ? ' − ' : ' + '}${fr(Math.abs(t.num), t.den)}`).join('');
   const lim = n(u1); return {
   prompt: `A cooling fan in the computing core is tuned with the integral ∫ from 0 to ${top} of ${f} dx, with x in radians. Its value is an exact fraction. Use the substitution u = cos x. Enter the value as a fraction in lowest terms: the numerator, then the denominator (type them without commas).`,
   answer: [A, B],
   hints: [`The power of sine is odd, so split off one sin x and write the rest with sin²x = 1 − cos²x: sin${sup(q)}x = ${split} sin x.`, `With u = cos x, du = −sin x dx. x = 0 gives u = 1 and x = ${top} gives u = ${lim}; the minus sign in du lets you swap the limits so the integral runs from ${lim} to 1.`],
   solution: `sin${sup(q)}x = ${split} sin x. Put u = cos x, so du = −sin x dx; x = 0 gives u = 1 and x = ${top} gives u = ${lim}. The minus sign swaps the limits, so the integral is ∫ from ${lim} to 1 of ${cp ? cp + ' × ' : ''}(1 − u²)${k === 1 ? '' : sup(k)} du = ∫ from ${lim} to 1 of (${poly}) du = ${vals} = ${fr(A, B)}.`,
   guidance: [
    { prompt: `With u = cos x, what are u at x = 0 and u at x = ${top}?`, answer: [1, u1], explanation: `cos 0 = 1 and cos(${top}) = ${lim}.` },
    { prompt: `After the substitution the integrand is ${cp ? cp + ' × ' : ''}(1 − u²)${k === 1 ? '' : sup(k)}. Multiplied out, what is the highest power of u?`, answer: [p + q - 1], explanation: `Multiplied out it is ${poly}, so the highest power is ${n(p + q - 1)}.` },
    { prompt: `Integrate term by term from ${lim} to 1. What is the value, as a fraction in lowest terms?`, answer: [A, B], explanation: `∫ from ${lim} to 1 of (${poly}) du = ${vals} = ${fr(A, B)}.` }
   ] }; }
 },
 /* Area under the semicircle y = √(r² − x²) from 0 to a, by x = r sin θ: θ = arcsin(a ÷ r), area = (r²/2)(θ + sin θ cos θ).
    θ and cos θ to 4 decimal places, the area to 2. A draw is kept only when the area worked from θ and cos θ rounded to
    4 places rounds to the same 2 places, and no shown value sits on a rounding edge. Not the worked example (r = 3, a = 3). */
 q20: {
  canonical: { r: 4, a: 2 },
  draw: R => { let p; do { const r = R.int(3, 12); p = { r, a: R.int(1, r - 1) }; } while ((() => { const t = Math.asin(p.a / p.r), c = Math.sqrt(1 - (p.a / p.r) ** 2), A = p.r * p.r / 2 * (t + p.a / p.r * c);
    return edge(t, 4) || edge(c, 4) || edge(A, 2) || rd(p.r * p.r / 2 * (rd(t, 4) + p.a / p.r * rd(c, 4)), 2) !== rd(A, 2); })()); return p; },
  build: ({ r, a }) => { const r2 = r * r, t = Math.asin(a / r), cs = Math.sqrt(1 - (a / r) * (a / r)), A = r2 / 2 * (t + a / r * cs); return {
   prompt: `A circular hatch plate of radius ${n(r)} dm is centred on the origin. The piece needed is the part of its top half between x = 0 and x = ${n(a)}: the region under y = √(${n(r2)} − x²). Use the substitution x = ${n(r)} sin θ, with θ in radians between −π/2 and π/2, where cos θ is never negative. Enter the angle θ that goes with x = ${n(a)}, to 4 decimal places, then the area of the piece in dm², to 2 decimal places.`,
   answer: [rd(t, 4), rd(A, 2)],
   hints: [`With x = ${n(r)} sin θ, the root √(${n(r2)} − x²) becomes ${n(r)} cos θ, because 1 − sin²θ = cos²θ, and dx becomes ${n(r)} cos θ dθ.`, 'The integral of cos²θ needs the power-reducing identity cos²θ = (1 + cos 2θ) ÷ 2. Change the limits from x to θ before you put numbers in.'],
   solution: `Put x = ${n(r)} sin θ, so dx = ${n(r)} cos θ dθ and √(${n(r2)} − x²) = ${n(r)} cos θ. x = 0 gives θ = 0, and x = ${n(a)} gives sin θ = ${n(a)} ÷ ${n(r)}, so θ = arcsin(${n(a)} ÷ ${n(r)}), about ${fx(t, 4)}. The area is ∫ from 0 to θ of ${n(r2)} cos²θ dθ = ${n(r2 / 2)} ∫ (1 + cos 2θ) dθ = ${n(r2 / 2)}(θ + sin θ cos θ), using sin 2θ = 2 sin θ cos θ. At the upper limit sin θ = ${n(a)} ÷ ${n(r)} and cos θ = √(${n(r2)} − ${n(a * a)}) ÷ ${n(r)}, about ${fx(cs, 4)}, so the area is about ${n(r2 / 2)} × (${fx(t, 4)} + ${n(a / r)} × ${fx(cs, 4)}), which is ${fx(A, 2)} dm² to 2 decimal places.`,
   guidance: [
    { prompt: `x = ${n(r)} sin θ. Which θ, in radians, gives x = ${n(a)}? Give it to 4 decimal places.`, answer: [rd(t, 4)], explanation: `sin θ = ${n(a)} ÷ ${n(r)}, so θ = arcsin(${n(a)} ÷ ${n(r)}), about ${fx(t, 4)} radians.` },
    { prompt: `At that θ, what is cos θ = √(${n(r2)} − ${n(a * a)}) ÷ ${n(r)}, to 4 decimal places?`, answer: [rd(cs, 4)], explanation: `√${n(r2 - a * a)} ÷ ${n(r)} is about ${fx(cs, 4)}. It is the height of the plate at x = ${n(a)}, divided by the radius.` },
    { prompt: `The area is ${n(r2 / 2)}(θ + sin θ cos θ) at that θ. What is it, to 2 decimal places?`, answer: [rd(A, 2)], explanation: `${n(r2 / 2)} × (${fx(t, 4)} + ${n(a / r)} × ${fx(cs, 4)}) is about ${fx(A, 2)} dm². At θ = 0 the bracket is 0, so nothing is subtracted.` }
   ] }; }
 },
});
})();
