/* Calculus 3: many variables mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* A coefficient written in front of a product, left out when it is 1: times1(3) → '3 × ', times1(1) → ''. */
const times1 = c => c === 1 ? '' : `${n(c)} × `;
/* A sum of terms written the usual way: poly([[2, 'x'], [−1, 'y'], [3, '']]) is '2x − y + 3'. Zero terms are dropped,
   a coefficient 1 is not written, and an empty sum is '0'. */
const poly = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, m], i) => { const a = Math.abs(c), body = m ? (a === 1 ? m : n(a) + m) : n(a); return i === 0 ? (c < 0 ? '−' + body : body) : (c < 0 ? ' − ' : ' + ') + body; }).join(''); };
/* ⟨2, −1, 3⟩ */
const ang = list => '⟨' + list.map(n).join(', ') + '⟩';
const pt = list => '(' + list.map(n).join(', ') + ')';
/* A third written as a fraction: 2/3, −1/3. */
const third = v => (v < 0 ? '−' : '') + Math.abs(v) + '/3';
/* q31: cable directions with a whole length. */
const DIRS = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, 3, 6], [3, 2, 6], [6, 2, 3], [4, 4, 7], [1, 4, 8], [4, 1, 8], [8, 4, 1]];
/* q36: the angle the duct panel turns through, in quarter turns. */
const TURN = { 1: ['π/2', 'a quarter of the way'], 2: ['π', 'half way'], 3: ['3π/2', 'three quarters of the way'], 4: ['2π', 'all the way'] };
/* q40: unit directions with thirds for components (each listed vector has length 3). */
const UNITS = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, -1, 2], [-1, 2, 2], [2, 2, -1]];
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* F = ⟨ay, x + bz, cxy⟩ at the cable's lower end; a straight cable P → P + d with a whole length; density m + kz,
    with k × (rise) even so the mass is whole. The worked example (field ⟨z, 2x, y⟩, cable (0,0,0) to (2,1,2)) has another form. */
 q31: {
  canonical: { a: 2, b: 3, c: 1, x0: 3, y0: 1, z0: 2, d: 3, m: 2, k: 1 },
  draw: R => { let p; do { p = { a: R.int(2, 5), b: R.int(2, 5), c: R.int(1, 3), x0: R.int(1, 4), y0: R.int(1, 4), z0: R.int(0, 3), d: R.int(0, DIRS.length - 1), m: R.int(1, 5), k: R.int(1, 3) }; } while ((p.k * DIRS[p.d][2]) % 2 !== 0); return p; },
  build: ({ a, b, c, x0, y0, z0, d, m, k }) => { const v = DIRS[d], S = v[0] * v[0] + v[1] * v[1] + v[2] * v[2], L = Math.round(Math.sqrt(S)),
   end = [x0 + v[0], y0 + v[1], z0 + v[2]], F = [a * y0, x0 + b * z0, c * x0 * y0], A = m + k * z0, B = k * v[2], mid = A + B / 2, mass = L * mid,
   Ft = `⟨${poly([[a, 'y']])}, ${poly([[1, 'x'], [b, 'z']])}, ${poly([[c, 'xy']])}⟩`, rho = poly([[m, ''], [k, 'z']]),
   rt = `⟨${poly([[x0, ''], [v[0], 't']])}, ${poly([[y0, ''], [v[1], 't']])}, ${poly([[z0, ''], [v[2], 't']])}⟩`, zt = poly([[z0, ''], [v[2], 't']]), rhot = poly([[A, ''], [B, 't']]); return {
   prompt: `Near the field coil in the cable yard, the pull on a steel part is the vector field F(x, y, z) = ${Ft} newtons, with x, y and z in metres. A straight cable runs from the point ${pt([x0, y0, z0])} up to ${pt(end)}. Its density is ρ = ${rho} kilograms per metre, where z is the height, so the cable is heavier higher up. Enter the three components of F at the cable’s lower end ${pt([x0, y0, z0])}, then the mass of the cable in kilograms.`,
   answer: [F[0], F[1], F[2], mass],
   hints: ['To find F at a point, put that point’s x, y and z into each of the three components.', 'Write the cable as r(t) = start + t × (end − start) for t from 0 to 1. Then ds = ‖r′(t)‖ dt, and the mass is the line integral of ρ: the integral of ρ(r(t)) × ‖r′(t)‖ from t = 0 to t = 1.'],
   solution: `F${pt([x0, y0, z0])} = ⟨${times1(a)}${n(y0)}, ${n(x0)} + ${times1(b)}${n(z0)}, ${times1(c)}${n(x0)} × ${n(y0)}⟩ = ${ang(F)}. The cable is r(t) = ${rt} for t from 0 to 1, so r′(t) = ${ang(v)} and ‖r′(t)‖ = √(${n(v[0] * v[0])} + ${n(v[1] * v[1])} + ${n(v[2] * v[2])}) = √${n(S)} = ${n(L)}. Along the cable z = ${zt}, so ρ(r(t)) = ${rhot}. The mass is the integral from t = 0 to t = 1 of (${rhot}) × ${n(L)}, which is ${n(L)} × (${n(A)} + ${n(B)} ÷ 2) = ${n(L)} × ${n(mid)} = ${n(mass)} kilograms.`,
   guidance: [
    { prompt: `Put x = ${n(x0)}, y = ${n(y0)} and z = ${n(z0)} into F(x, y, z) = ${Ft}. What are its three components?`, answer: F, explanation: `${times1(a)}${n(y0)} = ${n(F[0])}, ${n(x0)} + ${times1(b)}${n(z0)} = ${n(F[1])} and ${times1(c)}${n(x0)} × ${n(y0)} = ${n(F[2])}.` },
    { prompt: `The cable is r(t) = ${rt} for t from 0 to 1. What is its speed ‖r′(t)‖, the length of r′(t) = ${ang(v)}?`, answer: [L], explanation: `‖r′(t)‖ = √(${n(v[0] * v[0])} + ${n(v[1] * v[1])} + ${n(v[2] * v[2])}) = √${n(S)} = ${n(L)}. It is the same for every t, and it is also the cable’s length, because t runs over an interval of length 1.` },
    { prompt: `Along the cable z = ${zt}. Write the density there as ρ(r(t)) = A + Bt. What are A and B?`, answer: [A, B], explanation: `ρ = ${rho} with z = ${zt} gives ${rhot}, so A = ${n(A)} and B = ${n(B)}.` },
    { prompt: `The mass is ${n(L)} × (the integral of ${rhot} from t = 0 to t = 1). What is it, in kilograms?`, answer: [mass], explanation: `The integral of A + Bt from 0 to 1 is A + B ÷ 2 = ${n(A)} + ${n(B / 2)} = ${n(mid)}. Times ${n(L)}, the mass is ${n(mass)} kilograms.` }
   ] }; }
 },
 /* F = ⟨py + s, qx⟩ along r(t) = ⟨t, ct²⟩ (curved) or ⟨t, ct⟩ (straight) for t from 0 to T, T = 2 or 3. F(r(t)) · r′(t) is
    s + Bt² or s + Bt; draws keep the work whole. The worked example (⟨y, 2x⟩ along ⟨t, 2t⟩) has s = 0, which no draw has. */
 q32: {
  canonical: { p: 2, q: 3, s: 4, c: 1, T: 3, curved: true },
  draw: R => { let p; do { p = { p: R.int(1, 4), q: R.int(1, 4), s: R.int(1, 6), c: R.int(1, 3), T: R.int(2, 3), curved: R.bool() }; if (p.curved) p.c = Math.min(p.c, 2); }
   while (p.curved ? (p.T === 2 && ((p.p + 2 * p.q) * p.c) % 3 !== 0) : (p.T === 3 && ((p.p + p.q) * p.c) % 2 !== 0)); return p; },
  build: ({ p, q, s, c, T, curved }) => { const B = curved ? (p + 2 * q) * c : (p + q) * c, pw = curved ? 't²' : 't',
   W = curved ? s * T + B * T * T * T / 3 : s * T + B * T * T / 2, yEnd = curved ? c * T * T : c * T, Fend = [p * yEnd + s, q * T],
   Ft = `⟨${poly([[p, 'y'], [s, '']])}, ${poly([[q, 'x']])}⟩`, rt = `⟨t, ${poly([[c, pw]])}⟩`, Fx = poly([[p * c, pw], [s, '']]), Fy = poly([[q, 't']]),
   dy = curved ? poly([[2 * c, 't']]) : n(c), dot = poly([[s, ''], [B, pw]]),
   integ = curved ? `${n(s)} × ${n(T)} + ${n(B)} × ${n(T)}³ ÷ 3 = ${n(s * T)} + ${n(B * T * T * T / 3)}` : `${n(s)} × ${n(T)} + ${n(B)} × ${n(T)}² ÷ 2 = ${n(s * T)} + ${n(B * T * T / 2)}`; return {
   prompt: `A winch drags a cart across the cable yard. The force on the cart is the force field F(x, y) = ${Ft} newtons, with x and y in metres, and the cart follows the ${curved ? 'curved' : 'straight'} track r(t) = ${rt} from t = 0 to t = ${n(T)}. Enter the work the force does on the cart over the whole track, in joules.`,
   answer: [W],
   hints: ['Work along a path is the line integral of F(r(t)) · r′(t) dt: put the path into the force, then take the dot product with the velocity r′(t).', 'The dot product comes out as a polynomial in t. Integrate it term by term from t = 0 to the end time.'],
   solution: `On the track x = t and y = ${poly([[c, pw]])}, so F(r(t)) = ⟨${Fx}, ${Fy}⟩ and r′(t) = ⟨1, ${dy}⟩. Their dot product is (${Fx}) × 1 + ${Fy} × ${curved ? dy : n(c)} = ${dot}. The work is the integral of ${dot} from t = 0 to t = ${n(T)}: ${integ} = ${n(W)} joules.`,
   guidance: [
    { prompt: `The track ends at r(${n(T)}) = ${pt([T, yEnd])}. What are the two components of the force F there?`, answer: Fend, explanation: `F${pt([T, yEnd])} = ⟨${n(p)} × ${n(yEnd)} + ${n(s)}, ${n(q)} × ${n(T)}⟩ = ${ang(Fend)}. The force changes along the track, which is why the work needs an integral.` },
    { prompt: `Put the track into F and take the dot product with r′(t) = ⟨1, ${dy}⟩. Written as A + B${pw}, what are A and B?`, answer: [s, B], explanation: `F(r(t)) = ⟨${Fx}, ${Fy}⟩, and the dot product is (${Fx}) × 1 + ${Fy} × ${curved ? dy : n(c)} = ${dot}, so A = ${n(s)} and B = ${n(B)}.` },
    { prompt: `Integrate ${dot} from t = 0 to t = ${n(T)}. What is the work, in joules?`, answer: [W], explanation: `${integ} = ${n(W)} joules.` }
   ] }; }
 },
 /* Two fields: ⟨2ax + by, bx + 2cy⟩ = ∇(ax² + bxy + cy²) is conservative; ⟨2fx + gy, dx + 2hy⟩ with d ≠ g is not.
    `consFirst` says which of F and G is the conservative one. The worked example (⟨2x + y, x⟩) is not of either form. */
 q33: {
  canonical: { consFirst: false, a: 1, b: 3, c: 2, f: 2, g: 1, d: 3, h: 1, x1: 1, y1: 0, x2: 2, y2: 3 },
  draw: R => { let p, phi; do { p = { consFirst: R.bool(), a: R.int(1, 3), b: R.int(1, 4), c: R.int(1, 3), f: R.int(1, 3), g: R.int(1, 4), d: R.int(1, 5), h: R.int(1, 3), x1: R.int(-2, 2), y1: R.int(-2, 2), x2: R.int(-2, 3), y2: R.int(-2, 3) };
   phi = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y; } while (p.d === p.g || (p.x1 === p.x2 && p.y1 === p.y2) || phi(p.x2, p.y2) === phi(p.x1, p.y1)); return p; },
  build: ({ consFirst, a, b, c, f, g, d, h, x1, y1, x2, y2 }) => { const cons = `⟨${poly([[2 * a, 'x'], [b, 'y']])}, ${poly([[b, 'x'], [2 * c, 'y']])}⟩`, other = `⟨${poly([[2 * f, 'x'], [g, 'y']])}, ${poly([[d, 'x'], [2 * h, 'y']])}⟩`,
   F = consFirst ? cons : other, Gf = consFirst ? other : cons, codes = consFirst ? [1, 0] : [0, 1], cn = consFirst ? 'F' : 'G', on = consFirst ? 'G' : 'F',
   pF = consFirst ? [b, b] : [g, d], pG = consFirst ? [g, d] : [b, b], phiT = poly([[a, 'x²'], [b, 'xy'], [c, 'y²']]),
   phi = (x, y) => a * x * x + b * x * y + c * y * y, e = phi(x2, y2), s = phi(x1, y1), W = e - s; return {
   prompt: `Two winches in the cable yard pull with the force fields F(x, y) = ${F} and G(x, y) = ${Gf} newtons, with x and y in metres. Exactly one of them is conservative. Enter 1 if F is conservative and 0 if it is not, then the same for G. Then the conservative one hauls a cart along a winding track from ${pt([x1, y1])} to ${pt([x2, y2])}: enter the work it does, in joules.`,
   answer: [codes[0], codes[1], W],
   hints: ['A field ⟨P, Q⟩ in the plane is conservative when ∂P/∂y = ∂Q/∂x everywhere. Compare the two for each field.', 'For the conservative field find a potential function φ with ∂φ/∂x = P and ∂φ/∂y = Q. The work from one point to another along any path is φ at the end minus φ at the start.'],
   solution: `For F, ∂P/∂y = ${n(pF[0])} and ∂Q/∂x = ${n(pF[1])}; for G, ∂P/∂y = ${n(pG[0])} and ∂Q/∂x = ${n(pG[1])}. So ${cn} is conservative and ${on} is not. A potential function for ${cn} is φ(x, y) = ${phiT}: its partial derivatives are ${poly([[2 * a, 'x'], [b, 'y']])} and ${poly([[b, 'x'], [2 * c, 'y']])}. Then φ${pt([x2, y2])} = ${n(e)} and φ${pt([x1, y1])} = ${n(s)}, so the work is ${n(e)} − ${par(s)} = ${n(W)} joules, whatever shape the track has.`,
   guidance: [
    { prompt: `For F(x, y) = ${F}, what are ∂P/∂y (the y-rate of the first component) and ∂Q/∂x (the x-rate of the second)?`, answer: pF, explanation: `∂P/∂y = ${n(pF[0])} and ∂Q/∂x = ${n(pF[1])}. ${pF[0] === pF[1] ? 'They are equal, so F is conservative.' : 'They differ, so F is not conservative.'}` },
    { prompt: `Now for G(x, y) = ${Gf}: what are ∂P/∂y and ∂Q/∂x?`, answer: pG, explanation: `∂P/∂y = ${n(pG[0])} and ∂Q/∂x = ${n(pG[1])}. ${pG[0] === pG[1] ? 'They are equal, so G is conservative.' : 'They differ, so G is not conservative.'}` },
    { prompt: `${cn} has a potential function of the form φ(x, y) = αx² + βxy + γy². What are α, β and γ?`, answer: [a, b, c], explanation: `∂φ/∂x = 2αx + βy must be ${poly([[2 * a, 'x'], [b, 'y']])} and ∂φ/∂y = βx + 2γy must be ${poly([[b, 'x'], [2 * c, 'y']])}, so α = ${n(a)}, β = ${n(b)} and γ = ${n(c)}.` },
    { prompt: `With φ(x, y) = ${phiT}, what is the work φ${pt([x2, y2])} − φ${pt([x1, y1])}, in joules?`, answer: [W], explanation: `φ${pt([x2, y2])} = ${n(e)} and φ${pt([x1, y1])} = ${n(s)}, so the work is ${n(e)} − ${par(s)} = ${n(W)} joules.` }
   ] }; }
 },
 /* F = ⟨pxy − ay, rx² + cx⟩ round the rectangle [x0, x1] × [y0, y1], anticlockwise: ∂Q/∂x − ∂P/∂y = mx + k with m = 2r − p ≠ 0,
    k = a + c. The worked example (⟨−y, x⟩ round a 2 by 3 rectangle) has another form. */
 q34: {
  canonical: { p: 2, a: 3, r: 2, c: 1, x0: 1, x1: 3, y0: 0, y1: 2 },
  draw: R => { let p; do { p = { p: R.int(1, 3), a: R.int(1, 4), r: R.int(1, 3), c: R.int(1, 4), x0: R.int(0, 2), y0: R.int(0, 2) }; p.x1 = p.x0 + R.int(1, 3); p.y1 = p.y0 + R.int(1, 3); }
   while (2 * p.r === p.p || ((2 * p.r - p.p) * (p.y1 - p.y0) * (p.x1 * p.x1 - p.x0 * p.x0)) % 2 !== 0); return p; },
  build: ({ p, a, r, c, x0, x1, y0, y1 }) => { const m = 2 * r - p, k = a + c, W = x1 - x0, H = y1 - y0, area = W * H, K = k * area, M = m * H * (x1 * x1 - x0 * x0) / 2, circ = K + M,
   P = poly([[p, 'xy'], [-a, 'y']]), Q = poly([[r, 'x²'], [c, 'x']]), curl = poly([[m, 'x'], [k, '']]); return {
   prompt: `A cable cart runs once round the rectangular yard with corners ${pt([x0, y0])}, ${pt([x1, y0])}, ${pt([x1, y1])} and ${pt([x0, y1])}, in that order, which is anticlockwise. The force on it is F(x, y) = ⟨${P}, ${Q}⟩ newtons, with x and y in metres. Use Green’s theorem to find the circulation of F round the yard: the work F does on the cart over one full lap. Enter it in joules.`,
   answer: [circ],
   hints: ['Green’s theorem: for F = ⟨P, Q⟩ round a closed curve travelled anticlockwise, the circulation equals the double integral of ∂Q/∂x − ∂P/∂y over the region inside.', 'Work out ∂Q/∂x − ∂P/∂y first. Integrate it over the rectangle with x and y running between the corners’ values.'],
   solution: `Here P = ${P} and Q = ${Q}. ∂Q/∂x = ${poly([[2 * r, 'x'], [c, '']])} and ∂P/∂y = ${poly([[p, 'x'], [-a, '']])}, so ∂Q/∂x − ∂P/∂y = ${curl}. Green’s theorem turns the lap into the double integral of ${curl} over the yard, which is ${n(W)} m by ${n(H)} m with area ${n(area)}. The constant ${n(k)} gives ${n(k)} × ${n(area)} = ${n(K)}. The term ${poly([[m, 'x']])} gives ${par(m)} × ${n(H)} × (${n(x1)}² − ${n(x0)}²) ÷ 2 = ${n(M)}. The circulation is ${n(K)} + ${par(M)} = ${n(circ)} joules.`,
   guidance: [
    { prompt: `Work out ∂Q/∂x for Q = ${Q} and ∂P/∂y for P = ${P}. Their difference ∂Q/∂x − ∂P/∂y has the form mx + k: what are m and k?`, answer: [m, k], explanation: `∂Q/∂x = ${poly([[2 * r, 'x'], [c, '']])} and ∂P/∂y = ${poly([[p, 'x'], [-a, '']])}. Subtracting gives ${curl}, so m = ${n(m)} and k = ${n(k)}.` },
    { prompt: `The yard runs from x = ${n(x0)} to ${n(x1)} and from y = ${n(y0)} to ${n(y1)}. What is the integral of the constant ${n(k)} over it, and the integral of ${poly([[m, 'x']])} over it?`, answer: [K, M], explanation: `The area is ${n(W)} × ${n(H)} = ${n(area)}, so the constant gives ${n(K)}. For ${poly([[m, 'x']])}, integrate in y first (a factor ${n(H)}), then in x: ${par(m)} × ${n(H)} × (${n(x1 * x1)} − ${n(x0 * x0)}) ÷ 2 = ${n(M)}.` },
    { prompt: `Add the two parts. What is the circulation round the yard, in joules?`, answer: [circ], explanation: `${n(K)} + ${par(M)} = ${n(circ)} joules: the work done by F over one anticlockwise lap.` }
   ] }; }
 },
 /* F = ⟨axy + bz, cy² + dxz, exz + fy⟩ at (x0, y0, z0): div = ay + 2cy + ex, curl = ⟨f − dx, b − ez, dz − ax⟩. */
 q35: {
  canonical: { a: 2, b: 3, c: 1, d: 2, e: 1, f: 4, x0: 1, y0: 2, z0: -1 },
  draw: R => { let p; do { p = { a: R.int(1, 4), b: R.int(1, 4), c: R.int(1, 3), d: R.int(1, 4), e: R.int(1, 3), f: R.int(1, 4), x0: R.nz(-2, 3), y0: R.nz(-2, 3), z0: R.nz(-2, 3) }; }
   while ((p.a + 2 * p.c) * p.y0 + p.e * p.x0 === 0); return p; },
  build: ({ a, b, c, d, e, f, x0, y0, z0 }) => { const Px = a * y0, Qy = 2 * c * y0, Rz = e * x0, div = Px + Qy + Rz, Ry = f, Qz = d * x0, Pz = b, Rx = e * z0, Qx = d * z0, Py = a * x0,
   curl = [Ry - Qz, Pz - Rx, Qx - Py], P = poly([[a, 'xy'], [b, 'z']]), Q = poly([[c, 'y²'], [d, 'xz']]), Rr = poly([[e, 'xz'], [f, 'y']]), at = pt([x0, y0, z0]); return {
   prompt: `The atmosphere plant blows air through a mixing chamber with velocity field F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second, with x, y and z in metres. Enter div F at the point ${at}, then the three components of curl F there.`,
   answer: [div, ...curl],
   hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. For ∂P/∂x, differentiate P with x as the variable and treat y and z as fixed numbers.', 'curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. Work out each partial derivative as a formula first, then put in the point.'],
   solution: `∂P/∂x = ${poly([[a, 'y']])}, ∂Q/∂y = ${poly([[2 * c, 'y']])} and ∂R/∂z = ${poly([[e, 'x']])}, so at ${at} the divergence is ${n(Px)} + ${par(Qy)} + ${par(Rz)} = ${n(div)}. For the curl: ∂R/∂y = ${n(f)}, ∂Q/∂z = ${poly([[d, 'x']])}, ∂P/∂z = ${n(b)}, ∂R/∂x = ${poly([[e, 'z']])}, ∂Q/∂x = ${poly([[d, 'z']])} and ∂P/∂y = ${poly([[a, 'x']])}. At the point, curl F = ⟨${n(Ry)} − ${par(Qz)}, ${n(Pz)} − ${par(Rx)}, ${n(Qx)} − ${par(Py)}⟩ = ${ang(curl)}.`,
   guidance: [
    { prompt: `At ${at}, what are ∂P/∂x, ∂Q/∂y and ∂R/∂z?`, answer: [Px, Qy, Rz], explanation: `∂P/∂x = ${poly([[a, 'y']])} = ${n(Px)}, ∂Q/∂y = ${poly([[2 * c, 'y']])} = ${n(Qy)} and ∂R/∂z = ${poly([[e, 'x']])} = ${n(Rz)}.` },
    { prompt: `Add them. What is div F at ${at}?`, answer: [div], explanation: `${n(Px)} + ${par(Qy)} + ${par(Rz)} = ${n(div)}. ${div > 0 ? 'It is positive, so air spreads out from this point.' : 'It is negative, so air crowds in towards this point.'}` },
    { prompt: `For the first component of the curl you need ∂R/∂y and ∂Q/∂z. What are they at ${at}?`, answer: [Ry, Qz], explanation: `∂R/∂y = ${n(f)} (only the ${poly([[f, 'y']])} term has a y) and ∂Q/∂z = ${poly([[d, 'x']])} = ${n(Qz)}.` },
    { prompt: `What are the three components of curl F at ${at}?`, answer: curl, explanation: `⟨${n(Ry)} − ${par(Qz)}, ${n(Pz)} − ${par(Rx)}, ${n(Qx)} − ${par(Py)}⟩ = ${ang(curl)}.` }
   ] }; }
 },
 /* The piece of the cylinder of radius R with 0 ≤ θ ≤ jπ/2 and 0 ≤ z ≤ H: ‖r_θ × r_z‖ = R, area = RHj/2 · π.
    Never the worked example (R = 2, a full turn, height 5). */
 q36: {
  canonical: { R: 3, j: 2, H: 4 },
  draw: R => { let p; do { p = { R: R.int(2, 6), j: R.int(1, 4), H: R.int(2, 8) }; } while ((p.R * p.H * p.j) % 2 !== 0 || (p.R === 2 && p.j === 4 && p.H === 5)); return p; },
  build: ({ R, j, H }) => { const k = R * H * j / 2, [th, way] = TURN[j]; return {
   prompt: `A curved wall panel for an air duct is the piece of the cylinder of radius ${n(R)} m given by the parametrised surface r(θ, z) = ⟨${n(R)} cos θ, ${n(R)} sin θ, z⟩ for θ from 0 to ${th} and z from 0 to ${n(H)}. It goes ${way} round the duct and is ${n(H)} m tall. Enter the length of r_θ × r_z, then the panel’s surface area as k in k·π square metres: enter k.`,
   answer: [R, k],
   hints: ['r_θ is the derivative of r in θ with z held fixed, and r_z the derivative in z with θ held fixed. Take their cross product and its length, using cos²θ + sin²θ = 1.', 'The surface area is the double integral of ‖r_θ × r_z‖ over the rectangle of parameter values: θ across its range and z across its range.'],
   solution: `r_θ = ⟨−${n(R)} sin θ, ${n(R)} cos θ, 0⟩ and r_z = ⟨0, 0, 1⟩. Their cross product is ⟨${n(R)} cos θ × 1 − 0 × 0, 0 × 0 − (−${n(R)} sin θ) × 1, 0⟩ = ⟨${n(R)} cos θ, ${n(R)} sin θ, 0⟩, and its length is √(${n(R * R)} cos²θ + ${n(R * R)} sin²θ) = √${n(R * R)} = ${n(R)}. The area is the integral of ${n(R)} over θ from 0 to ${th} and z from 0 to ${n(H)}: ${n(R)} × ${th} × ${n(H)} = ${n(k)}π square metres, so k = ${n(k)}.`,
   guidance: [
    { prompt: `At θ = 0, r_θ = ⟨0, ${n(R)}, 0⟩ and r_z = ⟨0, 0, 1⟩. What are the three components of r_θ × r_z there?`, answer: [R, 0, 0], explanation: `⟨${n(R)} × 1 − 0 × 0, 0 × 0 − 0 × 1, 0 × 0 − ${n(R)} × 0⟩ = ⟨${n(R)}, 0, 0⟩. It points straight out of the wall, as a normal vector should.` },
    { prompt: `For any θ, r_θ × r_z = ⟨${n(R)} cos θ, ${n(R)} sin θ, 0⟩. What is its length?`, answer: [R], explanation: `√(${n(R * R)} cos²θ + ${n(R * R)} sin²θ) = √${n(R * R)} = ${n(R)}, because cos²θ + sin²θ = 1. Each small patch of parameters is stretched by the same factor ${n(R)}.` },
    { prompt: `Integrate ${n(R)} over θ from 0 to ${th} and z from 0 to ${n(H)}. Writing the area as kπ, what is k?`, answer: [k], explanation: `${n(R)} × ${th} × ${n(H)} = ${n(k)}π, so k = ${n(k)}.` }
   ] }; }
 },
 /* The surface z = px + qy + h over [0, A] × [0, B], field ⟨a, b, cz⟩, oriented up (r_x × r_y) or down (r_y × r_x).
    Draws keep every part of the flux whole and the flux non-zero. The worked example (a flat panel z = 2) has p = q = 0. */
 q37: {
  canonical: { p: 1, q: 2, h: 3, a: 2, b: -1, c: 1, A: 2, B: 1, up: true },
  draw: R => { let p, ok; do { p = { p: R.int(-2, 2), q: R.int(-2, 2), h: R.int(1, 5), a: R.int(-3, 3), b: R.int(-3, 3), c: R.int(1, 3), A: R.int(1, 4), B: R.int(1, 4), up: R.bool() };
   const K = p.c * p.h - p.a * p.p - p.b * p.q, X = p.c * p.p * p.A * p.A * p.B / 2, Y = p.c * p.q * p.A * p.B * p.B / 2;
   ok = (p.p !== 0 || p.q !== 0) && Number.isInteger(X) && Number.isInteger(Y) && K * p.A * p.B + X + Y !== 0; } while (!ok); return p; },
  build: ({ p, q, h, a, b, c, A, B, up }) => { const s = up ? 1 : -1, N = [-p * s, -q * s, s], K = s * (c * h - a * p - b * q), L = s * c * p, M = s * c * q,
   KA = K * A * B, X = L * A * A * B / 2, Y = M * A * B * B / 2, flux = KA + X + Y, g = poly([[p, 'x'], [q, 'y'], [h, '']]), cz = c === 1 ? `(${g})` : `${n(c)}(${g})`,
   Ft = `⟨${n(a)}, ${n(b)}, ${poly([[c, 'z']])}⟩`, dotT = poly([[K, ''], [L, 'x'], [M, 'y']]); return {
   prompt: `A sloping air filter in the plant is the surface z = ${g} over the rectangle 0 ≤ x ≤ ${n(A)}, 0 ≤ y ≤ ${n(B)}, in metres. Air moves through it with velocity F(x, y, z) = ${Ft} metres per second. Parametrise the filter as r(x, y) = ⟨x, y, ${g}⟩ and give it the ${up ? 'upward orientation, N = r_x × r_y' : 'downward orientation, N = r_y × r_x'}. Enter the three components of N, then the flux of F through the filter in that direction, in cubic metres per second.`,
   answer: [...N, flux],
   hints: ['For r(x, y) = ⟨x, y, g(x, y)⟩, r_x = ⟨1, 0, ∂g/∂x⟩ and r_y = ⟨0, 1, ∂g/∂y⟩, so r_x × r_y = ⟨−∂g/∂x, −∂g/∂y, 1⟩, which points upward. Swapping the order flips every sign and points it downward.', 'The flux is the double integral of F(r(x, y)) · N over the rectangle. Replace z by its formula on the surface before you take the dot product.'],
   solution: `r_x = ⟨1, 0, ${n(p)}⟩ and r_y = ⟨0, 1, ${n(q)}⟩, so r_x × r_y = ${ang([-p, -q, 1])}, which points upward. ${up ? 'That is the orientation asked for, so N = ' + ang(N) : 'The downward normal is the opposite, N = r_y × r_x = ' + ang(N)}. On the filter z = ${g}, so F = ⟨${n(a)}, ${n(b)}, ${cz}⟩ and F · N = ${dotT}. Over the rectangle the constant gives ${par(K)} × ${n(A * B)} = ${n(KA)}, the x term gives ${par(L)} × ${n(B)} × ${n(A)}² ÷ 2 = ${n(X)} and the y term gives ${par(M)} × ${n(A)} × ${n(B)}² ÷ 2 = ${n(Y)}. The flux is ${n(KA)} + ${par(X)} + ${par(Y)} = ${n(flux)} cubic metres per second.`,
   guidance: [
    { prompt: `r_x = ⟨1, 0, ${n(p)}⟩ and r_y = ⟨0, 1, ${n(q)}⟩. What are the three components of N = ${up ? 'r_x × r_y' : 'r_y × r_x'}?`, answer: N, explanation: `r_x × r_y = ${ang([-p, -q, 1])}${up ? ', with a positive z-component, so it points upward.' : '. Swapping the order flips every sign: N = ' + ang(N) + ', with a negative z-component, so it points downward.'}` },
    { prompt: `On the filter z = ${g}. Write F(r(x, y)) · N as K + Lx + My: what are K, L and M?`, answer: [K, L, M], explanation: `F · N = ${n(a)} × ${par(N[0])} + ${par(b)} × ${par(N[1])} + ${cz} × ${par(N[2])} = ${dotT}, so K = ${n(K)}, L = ${n(L)} and M = ${n(M)}.` },
    { prompt: `Integrate ${dotT} over 0 ≤ x ≤ ${n(A)}, 0 ≤ y ≤ ${n(B)}. What is the flux, in cubic metres per second?`, answer: [flux], explanation: `${n(KA)} + ${par(X)} + ${par(Y)} = ${n(flux)}.${flux < 0 ? ' A negative flux means the air crosses the filter against the chosen normal.' : ''}` }
   ] }; }
 },
 /* F = ⟨−ay + bz, cx + dz², exy⟩ round the rim of a half-ball dome of radius R; z-part of curl F is a + c. Through the flat
    floor disc the circulation is ±(a + c)R²π. The worked example (⟨−y, x, z⟩, radius 2) has another form. */
 q38: {
  canonical: { a: 2, b: 3, c: 1, d: 1, e: 2, R: 3, anti: true },
  draw: R => ({ a: R.int(1, 4), b: R.int(1, 3), c: R.int(1, 4), d: R.int(1, 3), e: R.int(1, 3), R: R.int(2, 6), anti: R.bool() }),
  build: ({ a, b, c, d, e, R, anti }) => { const s = anti ? 1 : -1, cz = a + c, k = s * cz * R * R, P = poly([[-a, 'y'], [b, 'z']]), Q = poly([[c, 'x'], [d, 'z²']]), Rr = poly([[e, 'xy']]),
   cx = poly([[e, 'x'], [-2 * d, 'z']]), cy = poly([[b, ''], [-e, 'y']]); return {
   prompt: `The dome over the air exchanger is a half-ball shell of radius ${n(R)} m standing on the floor z = 0, so its rim is the circle x² + y² = ${n(R * R)} on the floor. Air circulates with velocity F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second. Enter the z-component of curl F, then the circulation of F once round the rim, travelled ${anti ? 'anticlockwise' : 'clockwise'} as seen from above, as k in k·π square metres per second: enter k.`,
   answer: [cz, k],
   hints: ['curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. A flat floor disc has normal ⟨0, 0, 1⟩ or ⟨0, 0, −1⟩, so only the z-component of the curl matters on it.', 'Stokes’ theorem: the circulation round the rim equals the flux of curl F through any surface with that rim, such as the floor disc, when the surface’s normal matches the direction of travel. The right-hand rule gives that normal: curl the fingers of your right hand the way you travel round the rim, and your thumb points along it.'],
   solution: `∂Q/∂x = ${n(c)} and ∂P/∂y = −${n(a)}, so the z-component of curl F is ${n(c)} − (−${n(a)}) = ${n(cz)}. (The other components, ${cx} and ${cy}, do not matter on the floor.) By Stokes’ theorem the circulation round the rim equals the flux of curl F through any surface with that rim whose normal matches the direction of travel, so use the flat floor disc instead of the shell. Travelling ${anti ? 'anticlockwise' : 'clockwise'} goes with the ${anti ? 'upward' : 'downward'} normal ⟨0, 0, ${anti ? '1' : '−1'}⟩, so curl F · N = ${n(s * cz)} everywhere on the disc. The disc’s area is ${n(R * R)}π, so the circulation is ${n(s * cz)} × ${n(R * R)}π = ${n(k)}π and k = ${n(k)}.`,
   guidance: [
    { prompt: `For P = ${P} and Q = ${Q}, what are ∂Q/∂x and ∂P/∂y?`, answer: [c, -a], explanation: `∂Q/∂x = ${n(c)}, since z² does not change with x, and ∂P/∂y = −${n(a)}.` },
    { prompt: `What is the z-component of curl F, ∂Q/∂x − ∂P/∂y?`, answer: [cz], explanation: `${n(c)} − (−${n(a)}) = ${n(cz)}. It is the same at every point.` },
    { prompt: `The rim is travelled ${anti ? 'anticlockwise' : 'clockwise'} seen from above. Enter the z-component of the floor disc’s normal that goes with it: 1 for upward, −1 for downward.`, answer: [s], explanation: `${anti ? 'Anticlockwise seen from above goes with the upward normal, by the right-hand rule: curl the fingers of your right hand along the rim and your thumb points up.' : 'Clockwise seen from above goes with the downward normal, by the right-hand rule: curl the fingers of your right hand along the rim and your thumb points down.'}` },
    { prompt: `The floor disc has area ${n(R * R)}π. Writing the circulation as kπ, what is k?`, answer: [k], explanation: `curl F · N = ${n(s * cz)} on the whole disc, so the flux of the curl is ${n(s * cz)} × ${n(R * R)}π = ${n(k)}π, and so is the circulation.` }
   ] }; }
 },
 /* F = ⟨ax + y², by + xz, cz²⟩ out of the box [0, L] × [0, W] × [0, H]: div = a + b + 2cz, flux = (a + b)LWH + cLWH².
    The worked example (⟨x, y, z⟩ out of a cube of side 2) has another form. */
 q39: {
  canonical: { a: 2, b: 1, c: 1, L: 3, W: 2, H: 2 },
  draw: R => ({ a: R.int(1, 4), b: R.int(1, 4), c: R.int(1, 3), L: R.int(1, 3), W: R.int(1, 3), H: R.int(1, 3) }),
  build: ({ a, b, c, L, W, H }) => { const top = 2 * c * H, cd = a + b + top, V = L * W * H, X = (a + b) * V, Y = c * L * W * H * H, flux = X + Y,
   P = poly([[a, 'x'], [1, 'y²']]), Q = poly([[b, 'y'], [1, 'xz']]), Rr = poly([[c, 'z²']]), corner = pt([L, W, H]); return {
   prompt: `An air exchanger chamber is the box 0 ≤ x ≤ ${n(L)}, 0 ≤ y ≤ ${n(W)}, 0 ≤ z ≤ ${n(H)}, in metres. Air moves with velocity F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second. Enter div F at the top corner ${corner}, then the total flux of F out through the six walls of the box, in cubic metres per second.`,
   answer: [cd, flux],
   hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. Here it depends only on the height z.', 'The divergence theorem: the flux out through the closed surface of the box equals the triple integral of div F over the inside. Integrate in z, then multiply by the area of the floor.'],
   solution: `∂P/∂x = ${n(a)}, ∂Q/∂y = ${n(b)} and ∂R/∂z = ${poly([[2 * c, 'z']])}, so div F = ${poly([[a + b, ''], [2 * c, 'z']])}; at the top corner, where z = ${n(H)}, it is ${n(a + b)} + ${n(top)} = ${n(cd)}. By the divergence theorem the flux out through the six walls is the triple integral of div F over the box. The box has volume ${n(L)} × ${n(W)} × ${n(H)} = ${n(V)}, so the constant ${n(a + b)} gives ${n(X)}. The ${poly([[2 * c, 'z']])} part gives ${n(L)} × ${n(W)} × ${n(c)} × ${n(H)}² = ${n(Y)}, since the integral of ${poly([[2 * c, 'z']])} from 0 to ${n(H)} is ${n(c)} × ${n(H)}². The flux out is ${n(X)} + ${n(Y)} = ${n(flux)} cubic metres per second.`,
   guidance: [
    { prompt: `What are ∂P/∂x and ∂Q/∂y, and ∂R/∂z at the top corner, where z = ${n(H)}?`, answer: [a, b, top], explanation: `∂P/∂x = ${n(a)} (y² does not change with x), ∂Q/∂y = ${n(b)} (xz does not change with y) and ∂R/∂z = ${poly([[2 * c, 'z']])} = ${n(top)} at z = ${n(H)}.` },
    { prompt: `What is div F at the top corner ${corner}?`, answer: [cd], explanation: `${n(a)} + ${n(b)} + ${n(top)} = ${n(cd)}.` },
    { prompt: `div F = ${poly([[a + b, ''], [2 * c, 'z']])}. What is the box’s volume, and the triple integral of the constant ${n(a + b)} over it?`, answer: [V, X], explanation: `The volume is ${n(L)} × ${n(W)} × ${n(H)} = ${n(V)}, so the constant gives ${n(a + b)} × ${n(V)} = ${n(X)}.` },
    { prompt: `Add the ${poly([[2 * c, 'z']])} part. What is the total flux out of the box?`, answer: [flux], explanation: `The ${poly([[2 * c, 'z']])} part is ${n(L)} × ${n(W)} × ${n(c)} × ${n(H)}² = ${n(Y)}, so the flux out is ${n(X)} + ${n(Y)} = ${n(flux)} cubic metres per second.` }
   ] }; }
 },
 /* T = px² + qy + sz at (x0, y0, z0) inside the half-ball dome of radius R (3 or 6), along u = UNITS[u] ÷ 3 (whole rate);
    F = ⟨ax − ey, ex + by, cz⟩: curl F = ⟨0, 0, 2e⟩, div F = a + b + c, no flow through the floor (cz = 0 there). */
 q40: {
  canonical: { p: 1, q: 3, s: 2, x0: 2, y0: 1, z0: 1, u: 1, a: 2, b: 1, c: 3, e: 1, R: 3 },
  draw: R => { let p, g; do { p = { p: R.int(1, 3), q: R.nz(-3, 3), s: R.nz(-3, 3), x0: R.int(-2, 2), y0: R.int(-2, 2), z0: R.int(1, 2), u: R.int(0, UNITS.length - 1), a: R.int(1, 3), b: R.int(1, 3), c: R.int(1, 3), e: R.int(1, 3), R: R.pick([3, 3, 6]) };
   g = [2 * p.p * p.x0, p.q, p.s]; } while (p.x0 * p.x0 + p.y0 * p.y0 + p.z0 * p.z0 >= p.R * p.R || (g[0] * UNITS[p.u][0] + g[1] * UNITS[p.u][1] + g[2] * UNITS[p.u][2]) % 3 !== 0 || g[0] * UNITS[p.u][0] + g[1] * UNITS[p.u][1] + g[2] * UNITS[p.u][2] === 0); return p; },
  build: ({ p, q, s, x0, y0, z0, u, a, b, c, e, R }) => { const v = UNITS[u], g = [2 * p * x0, q, s], dot = g[0] * v[0] + g[1] * v[1] + g[2] * v[2], rate = dot / 3,
   cz = 2 * e, k1 = cz * R * R, dv = a + b + c, vol = 2 * R * R * R / 3, k2 = dv * vol, T = poly([[p, 'x²'], [q, 'y'], [s, 'z']]), at = pt([x0, y0, z0]),
   ut = '⟨' + v.map(third).join(', ') + '⟩', Ft = `⟨${poly([[a, 'x'], [-e, 'y']])}, ${poly([[e, 'x'], [b, 'y']])}, ${poly([[c, 'z']])}⟩`; return {
   prompt: `A last check of the atmosphere plant. The dome is a half-ball shell of radius ${n(R)} m standing on the floor z = 0. First, the temperature inside is T(x, y, z) = ${T} degrees Celsius, with x, y and z in metres; the gradient is ∇T = ⟨∂T/∂x, ∂T/∂y, ∂T/∂z⟩, and the rate of change of T in the direction of a unit vector u is ∇T · u. A sensor drone at ${at} sets off in the direction u = ${ut}: enter the rate at which the temperature changes, in °C per metre. Second, the air moves with velocity F(x, y, z) = ${Ft} metres per second. Enter the flux of curl F up and out through the dome’s shell, as k in k·π. Third, enter the rate at which air leaves the dome through its shell, in cubic metres per second, as k in k·π (type k without commas).`,
   answer: [rate, k1, k2],
   hints: ['Work out the three partial derivatives of T, put in the drone’s position to get ∇T, and take the dot product with u.', 'Stokes’ theorem lets you swap the shell for the flat floor disc with the same rim, keeping the normal pointing up. The divergence theorem turns the air leaving the closed dome into the triple integral of div F; a half-ball of radius R has volume 2πR³ ÷ 3. Check whether any air crosses the floor.'],
   solution: `∇T = ⟨${poly([[2 * p, 'x']])}, ${n(q)}, ${n(s)}⟩, which at ${at} is ${ang(g)}. The rate is ∇T · u = (${n(g[0])} × ${par(v[0])} + ${par(g[1])} × ${par(v[1])} + ${par(g[2])} × ${par(v[2])}) ÷ 3 = ${n(dot)} ÷ 3 = ${n(rate)} °C per metre. For the air, curl F = ⟨0, 0, ${n(e)} − (−${n(e)})⟩ = ⟨0, 0, ${n(cz)}⟩. By Stokes’ theorem its flux up through the shell equals its flux up through the floor disc with the same rim: ${n(cz)} × ${n(R * R)}π = ${n(k1)}π, so k = ${n(k1)}. Next, div F = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)}. On the floor z = 0, so the upward part ${poly([[c, 'z']])} is 0 and no air crosses it: everything that leaves the closed dome leaves through the shell. By the divergence theorem that is ${n(dv)} × (2π × ${n(R)}³ ÷ 3) = ${n(dv)} × ${n(vol)}π = ${n(k2)}π cubic metres per second, so k = ${n(k2)}.`,
   guidance: [
    { prompt: `What are the three components of ∇T at ${at}?`, answer: g, explanation: `∂T/∂x = ${poly([[2 * p, 'x']])} = ${n(g[0])}, ∂T/∂y = ${n(q)} and ∂T/∂z = ${n(s)}.` },
    { prompt: `What is ∇T · u, the rate in °C per metre?`, answer: [rate], explanation: `(${n(g[0])} × ${par(v[0])} + ${par(g[1])} × ${par(v[1])} + ${par(g[2])} × ${par(v[2])}) ÷ 3 = ${n(dot)} ÷ 3 = ${n(rate)}.` },
    { prompt: `curl F has only a z-component, ∂Q/∂x − ∂P/∂y. What is it?`, answer: [cz], explanation: `∂Q/∂x = ${n(e)} and ∂P/∂y = −${n(e)}, so it is ${n(e)} − (−${n(e)}) = ${n(cz)}. The other two components are 0.` },
    { prompt: `Through the floor disc of area ${n(R * R)}π, the upward flux of curl F is kπ. What is k?`, answer: [k1], explanation: `${n(cz)} × ${n(R * R)} = ${n(k1)}. By Stokes’ theorem the shell, which has the same rim, has the same flux of curl F.` },
    { prompt: `What is div F?`, answer: [dv], explanation: `∂P/∂x + ∂Q/∂y + ∂R/∂z = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)}, the same everywhere.` },
    { prompt: `No air crosses the floor. Writing the air leaving through the shell as kπ, what is k?`, answer: [k2], explanation: `The dome holds 2π × ${n(R)}³ ÷ 3 = ${n(vol)}π cubic metres, so the divergence theorem gives ${n(dv)} × ${n(vol)}π = ${n(k2)}π.` }
   ] }; }
 }
});
/* Tidies generated text where a drawn number comes out as 1: '1 joules' → '1 joule', '1π' → 'π'. Wraps every build of this file. */
const ONE = s => s.replace(/(^|[^\d.,])(−?1) (joule|newton|tonne|cubic metre|square metre|metre|kilogram|litre|gram|second|watt)s\b/g, '$1$2 $3').replace(/(^|[^\d.,])1π/g, '$1π');
for (const id of 'q31 q32 q33 q34 q35 q36 q37 q38 q39 q40'.split(' ')) {
 const g = window.MISSION_GEN[id], b = g.build;
 g.build = p => { const o = b(p); return { ...o, prompt: ONE(o.prompt), hints: o.hints.map(ONE), solution: ONE(o.solution), guidance: o.guidance.map(x => ({ ...x, prompt: ONE(x.prompt), explanation: ONE(x.explanation) })) }; };
}
})();
