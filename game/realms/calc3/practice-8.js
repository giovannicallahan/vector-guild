/* Calculus 3: many variables practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p8.js. */
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
/* A sum of terms [[coefficient, symbol]]; symbol '' is a constant. '2x − y + 3'. */
const lin = terms => { const t = terms.filter(([c]) => c !== 0); if (!t.length) return '0';
 return t.map(([c, s], i) => { const m = Math.abs(c) === 1 && s ? '' : n(Math.abs(c)); return i ? ` ${c < 0 ? '−' : '+'} ${m}${s}` : `${c < 0 ? '−' : ''}${m}${s}`; }).join(''); };
const ang = list => '⟨' + list.map(n).join(', ') + '⟩';
const pt = list => '(' + list.map(n).join(', ') + ')';
const third = v => (v < 0 ? '−' : '') + Math.abs(v) + '/3';
const UNITS = [[1, 2, 2], [2, 1, 2], [2, 2, 1], [2, -1, 2], [-1, 2, 2], [2, 2, -1]];
const sgn = R => R.pick([1, -1]);

/* ---- q36 Parametrised surfaces and surface area [6.6] ---- */

/* Plane piece r(u, v) = ⟨u, v, au + bv + c⟩: r_u × r_v = ⟨−a, −b, 1⟩, length √(a² + b² + 1) (whole for the triples below),
   area = length × L × W. PL index is only a choice of the triple (a, b, length): (2, 2, 3), (4, 8, 9), (8, 4, 9). */
const PL = [[2, 2, 3], [4, 8, 9], [8, 4, 9]];
mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The slanted baffle',
 brief: 'A flat baffle is to be fitted at a slant across the intake duct, and the workshop needs its area before cutting the sheet.',
 labels: ['‖r_u × r_v‖ (m)', 'area (m²)'], tolerance: 0.01,
 gl: [['x-component', 'y-component', 'z-component'], ['‖r_u × r_v‖ (m)'], ['area (m²)']]
}, {
 canonical: { i: 1, sa: 1, sb: 1, c0: 2, L: 4, W: 3 },
 draw: R => ({ i: R.int(0, 2), sa: sgn(R), sb: sgn(R), c0: R.int(0, 5), L: R.int(1, 5), W: R.int(1, 5) }),
 build: ({ i, sa, sb, c0, L, W }) => { const a = sa * PL[i][0], b = sb * PL[i][1], len = PL[i][2], area = len * L * W; return {
  prompt: `A slanted baffle in the intake duct is the piece of a flat plane given by the parametrised surface r(u, v) = ⟨u, v, ${lin([[a, 'u'], [b, 'v'], [c0, '']])}⟩ for u from 0 to ${n(L)} and v from 0 to ${n(W)}, all in metres. Enter the length of r_u × r_v, then the baffle’s surface area in square metres.`,
  answer: [len, area],
  hints: ['Differentiate r in u with v held fixed, then in v with u held fixed, and take the cross product of the two. Its length is the stretch factor: for a flat plane it is the same at every point.', 'The area is the double integral of ‖r_u × r_v‖ over the rectangle of parameter values. A constant integrates to the constant times the area of that rectangle.'],
  solution: `r_u = ⟨1, 0, ${n(a)}⟩ and r_v = ⟨0, 1, ${n(b)}⟩, so r_u × r_v = ${ang([-a, -b, 1])}. Its length is √(${par(a)}² + ${par(b)}² + 1²) = √${n(a * a + b * b + 1)} = ${n(len)}. The length does not depend on u or v, so the area is ${n(len)} × (${n(L)} × ${n(W)}) = ${n(area)} square metres.`,
  guidance: [
   { prompt: `r_u = ⟨1, 0, ${n(a)}⟩ and r_v = ⟨0, 1, ${n(b)}⟩. What are the three components of r_u × r_v?`, answer: [-a, -b, 1], explanation: `r_u × r_v = ${ang([-a, -b, 1])}. It is the same at every point of a flat plane.` },
   { prompt: `What is the length of ${ang([-a, -b, 1])}?`, answer: [len], explanation: `√(${par(a)}² + ${par(b)}² + 1²) = √${n(a * a + b * b + 1)} = ${n(len)}.` },
   { prompt: `The length ${n(len)} is the same everywhere. Integrate it over u from 0 to ${n(L)} and v from 0 to ${n(W)}. What is the area in square metres?`, answer: [area], explanation: `${n(len)} × ${n(L)} × ${n(W)} = ${n(area)}.` }
  ] }; }
});

/* Cylinder wall r(θ, z) = ⟨R cos θ, R sin θ, z⟩, θ from 0 to tπ, z from 0 to H: length R, area R·H·t·π, cost price × area. */
const TT = [['π/2', 0.5], ['π', 1], ['3π/2', 1.5], ['2π', 2]];
mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'Coating the tank wall',
 brief: 'The tank wall in the water store needs a protective coating, and the stores clerk wants the cost before ordering it.',
 labels: ['‖r_θ × r_z‖ (m)', 'k in k·π (m²)', 'K in K·π (credits)'], tolerance: 0.01,
 gl: [['‖r_θ × r_z‖ (m)'], ['k in k·π (m²)'], ['K in K·π (credits)']]
}, {
 canonical: { R: 4, H: 3, ti: 2, price: 5 },
 draw: R => { let p; do { p = { R: R.int(2, 5), H: R.int(1, 4), ti: R.int(0, 3), price: R.int(2, 6) }; } while ((p.R * p.H * TT[p.ti][1]) % 1 !== 0); return p; },
 build: ({ R, H, ti, price }) => { const T = TT[ti][0], k = R * H * TT[ti][1], K = price * k; return {
  prompt: `A curved tank wall that has to be coated is the surface r(θ, z) = ⟨${n(R)} cos θ, ${n(R)} sin θ, z⟩ for θ from 0 to ${T} and z from 0 to ${n(H)}, in metres (θ in radians). The coating costs ${n(price)} credits per square metre. Enter the length of r_θ × r_z, then the area of the wall as k in k·π square metres, then the cost of the coating as K in K·π credits.`,
  answer: [R, k, K],
  hints: ['r_θ is the derivative of r in θ with z held fixed, and r_z the derivative in z. Take their cross product and its length, using cos²θ + sin²θ = 1.', 'The area is the double integral of ‖r_θ × r_z‖ over the rectangle of parameter values. The cost is the price per square metre times the area.'],
  solution: `r_θ = ⟨−${n(R)} sin θ, ${n(R)} cos θ, 0⟩ and r_z = ⟨0, 0, 1⟩, so r_θ × r_z = ⟨${n(R)} cos θ, ${n(R)} sin θ, 0⟩, whose length is √(${n(R * R)} cos²θ + ${n(R * R)} sin²θ) = ${n(R)}. The area is the integral of ${n(R)} over θ from 0 to ${T} and z from 0 to ${n(H)}: ${n(R)} × ${T} × ${n(H)} = ${n(k)}π square metres, so k = ${n(k)}. At ${n(price)} credits per square metre the cost is ${n(price)} × ${n(k)}π = ${n(K)}π credits, so K = ${n(K)}.`,
  guidance: [
   { prompt: `At θ = 0, r_θ = ⟨0, ${n(R)}, 0⟩ and r_z = ⟨0, 0, 1⟩. What is the length of r_θ × r_z?`, answer: [R], explanation: `r_θ × r_z = ⟨${n(R)}, 0, 0⟩, of length ${n(R)}. The same length comes out at every θ, because cos²θ + sin²θ = 1.` },
   { prompt: `The length ${n(R)} is the same everywhere. Integrate it over θ from 0 to ${T} and z from 0 to ${n(H)}. Writing the area as kπ, what is k?`, answer: [k], explanation: `${n(R)} × ${T} × ${n(H)} = ${n(k)}π, so k = ${n(k)}.` },
   { prompt: `The area is ${n(k)}π square metres and the coating costs ${n(price)} credits per square metre. Writing the cost as Kπ, what is K?`, answer: [K], explanation: `${n(price)} × ${n(k)} = ${n(K)}, so the cost is ${n(K)}π credits.` }
  ] }; }
});

/* Cone r(u, θ) = ⟨pu cos θ, pu sin θ, qu⟩ with (p, q) = (3, 4) or (4, 3): r_u × r_θ = ⟨−pqu cos θ, −pqu sin θ, p²u⟩, length 5pu.
   Area = 5p × L²/2 × tπ (θ to π or 2π). */
mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q24', title: 'The funnel baffle',
 brief: 'The plant needs a funnel-shaped baffle in the exhaust, and its sheet-metal area changes with how far from the tip you go.',
 labels: ['‖r_u × r_θ‖ at u = 2 (m)', 'k in k·π (m²)'], tolerance: 0.01,
 gl: [['x-component', 'y-component', 'z-component'], ['‖r_u × r_θ‖ (m)'], ['k in k·π (m²)']]
}, {
 canonical: { p: 3, L: 3, t: 2 },
 draw: R => { let x; do { x = { p: R.pick([3, 4]), L: R.int(2, 4), t: R.int(1, 2) }; } while ((5 * x.p * x.L * x.L * x.t) % 2 !== 0); return x; },
 build: ({ p, L, t }) => { const q = 7 - p, s = 5 * p, T = t === 2 ? '2π' : 'π', len2 = 2 * s, k = s * L * L * t / 2; return {
  prompt: `A funnel-shaped baffle is the cone r(u, θ) = ⟨${n(p)}u cos θ, ${n(p)}u sin θ, ${n(q)}u⟩ for u from 0 to ${n(L)} and θ from 0 to ${T}, in metres (θ in radians). Take the cross product in the order r_u × r_θ. Its length changes with u, so it has to be integrated over u as well as over θ. Enter the length of r_u × r_θ at u = 2, then the baffle’s surface area as k in k·π square metres.`,
  answer: [len2, k],
  hints: ['r_u is the derivative of r in u with θ held fixed, and r_θ the derivative in θ with u held fixed. Take their cross product and its length, using cos²θ + sin²θ = 1.', 'The area is the double integral of ‖r_u × r_θ‖ over the rectangle of parameter values. The length is a multiple of u, so integrate it in u (a multiple of u² ÷ 2) and then in θ.'],
  solution: `r_u = ⟨${n(p)} cos θ, ${n(p)} sin θ, ${n(q)}⟩ and r_θ = ⟨−${n(p)}u sin θ, ${n(p)}u cos θ, 0⟩, so r_u × r_θ = ⟨−${n(p * q)}u cos θ, −${n(p * q)}u sin θ, ${n(p * p)}u⟩. Its length is u × √(${n(p * p * q * q)} + ${n(p * p * p * p)}) = ${n(s)}u, using cos²θ + sin²θ = 1. At u = 2 that is ${n(len2)}. The area is the integral of ${n(s)}u over u from 0 to ${n(L)} and θ from 0 to ${T}: ${n(s)} × (${n(L)}² ÷ 2) × ${T} = ${n(k)}π square metres, so k = ${n(k)}.`,
  guidance: [
   { prompt: `At θ = 0 and u = 2, r_u = ⟨${n(p)}, 0, ${n(q)}⟩ and r_θ = ⟨0, ${n(2 * p)}, 0⟩. What are the three components of r_u × r_θ?`, answer: [-2 * p * q, 0, 2 * p * p], explanation: `r_u × r_θ = ⟨0 × 0 − ${n(q)} × ${n(2 * p)}, ${n(q)} × 0 − ${n(p)} × 0, ${n(p)} × ${n(2 * p)} − 0 × 0⟩ = ${ang([-2 * p * q, 0, 2 * p * p])}.` },
   { prompt: `What is the length of ${ang([-2 * p * q, 0, 2 * p * p])}?`, answer: [len2], explanation: `√(${n(4 * p * p * q * q)} + ${n(4 * p * p * p * p)}) = ${n(len2)}. The same working at any θ and u gives ${n(s)}u.` },
   { prompt: `The length at any point is ${n(s)}u. Integrate it over u from 0 to ${n(L)} and θ from 0 to ${T}. Writing the area as kπ, what is k?`, answer: [k], explanation: `The integral of ${n(s)}u over u is ${n(s)} × ${n(L)}² ÷ 2 = ${n(s * L * L / 2)}, and θ ranges over ${T}, so the area is ${n(k)}π and k = ${n(k)}.` }
  ] }; }
});

/* ---- q37 Flux through a surface [6.6] ---- */

/* Vent z = px + qy + r over [0, A] × [0, B], F = ⟨a, b, −ez⟩, downward N = r_y × r_x = ⟨p, q, −1⟩:
   F · N = (ap + bq + er) + epx + eqy, flux = K·AB + L·BA²/2 + M·AB²/2 with K = ap + bq + er, L = ep, M = eq. */
mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'Air drawn through the skylight vent',
 brief: 'A sloping vent in the plant roof draws stale air down and out, and the crew need its flow rate.',
 labels: ['N, x-component', 'N, y-component', 'N, z-component', 'flux (m³/s)'], tolerance: 0.01,
 gl: [['N, x-component', 'N, y-component', 'N, z-component'], ['K', 'L', 'M'], ['flux (m³/s)']]
}, {
 canonical: { p: 1, q: 2, r: 2, a: 3, b: -1, e: 2, A: 2, B: 3 },
 draw: R => { let x; do { x = { p: R.nz(-3, 3), q: R.nz(-3, 3), r: R.int(1, 4), a: R.int(-2, 3), b: R.int(-2, 3), e: R.int(1, 3), A: R.int(1, 3), B: R.int(1, 3) };
  } while ((x.a * x.p + x.b * x.q + x.e * x.r) * x.A * x.B + x.e * x.p * x.B * x.A * x.A / 2 + x.e * x.q * x.A * x.B * x.B / 2 <= 0); return x; },
 build: ({ p, q, r, a, b, e, A, B }) => { const g = lin([[p, 'x'], [q, 'y'], [r, '']]), K = a * p + b * q + e * r, L = e * p, M = e * q, KA = K * A * B, X = L * B * A * A / 2, Y = M * A * B * B / 2, flux = KA + X + Y, dotT = lin([[K, ''], [L, 'x'], [M, 'y']]); return {
  prompt: `A sloping skylight vent in the plant roof is the surface z = ${g} over the rectangle 0 ≤ x ≤ ${n(A)}, 0 ≤ y ≤ ${n(B)}, in metres. Air is drawn through it with velocity F(x, y, z) = ⟨${n(a)}, ${n(b)}, ${lin([[-e, 'z']])}⟩ metres per second. Parametrise the vent as r(x, y) = ⟨x, y, ${g}⟩ and give it the downward orientation, N = r_y × r_x. Enter the three components of N, then the flux of F through the vent in that direction, in cubic metres per second (it may be a decimal such as 4.5: enter it exactly).`,
  answer: [p, q, -1, flux],
  hints: ['For r(x, y) = ⟨x, y, g(x, y)⟩, r_x × r_y = ⟨−∂g/∂x, −∂g/∂y, 1⟩ points upward. The order r_y × r_x flips every sign, so it points downward.', 'The flux is the double integral of F(r(x, y)) · N over the rectangle. Replace z by its formula on the vent before you take the dot product.'],
  solution: `r_x = ⟨1, 0, ${n(p)}⟩ and r_y = ⟨0, 1, ${n(q)}⟩, so r_y × r_x = ${ang([p, q, -1])}, which points downward as asked. On the vent z = ${g}, so F = ⟨${n(a)}, ${n(b)}, −${e === 1 ? '' : n(e)}(${g})⟩ and F · N = ${n(a)} × ${par(p)} + ${par(b)} × ${par(q)} + ${e === 1 ? '' : n(e) + ' × '}(${g}) = ${dotT}. Over the rectangle the constant gives ${par(K)} × ${n(A * B)} = ${n(KA)}, the x term gives ${par(L)} × ${n(B)} × ${n(A)}² ÷ 2 = ${n(X)} and the y term gives ${par(M)} × ${n(A)} × ${n(B)}² ÷ 2 = ${n(Y)}. The flux is ${n(KA)} + ${par(X)} + ${par(Y)} = ${n(flux)} cubic metres per second.`,
  guidance: [
   { prompt: `r_x = ⟨1, 0, ${n(p)}⟩ and r_y = ⟨0, 1, ${n(q)}⟩. What are the three components of N = r_y × r_x?`, answer: [p, q, -1], explanation: `r_x × r_y = ${ang([-p, -q, 1])}, and swapping the order flips every sign: N = ${ang([p, q, -1])}, with a negative z-component, so it points downward.` },
   { prompt: `On the vent z = ${g}. Write F(r(x, y)) · N as K + Lx + My: what are K, L and M?`, answer: [K, L, M], explanation: `F · N = ${n(a)} × ${par(p)} + ${par(b)} × ${par(q)} + (${lin([[-e, 'z']])}) × (−1) = ${lin([[a * p + b * q, ''], [e, 'z']])}, and z = ${g} gives ${dotT}. So K = ${n(K)}, L = ${n(L)} and M = ${n(M)}.` },
   { prompt: `Integrate ${dotT} over 0 ≤ x ≤ ${n(A)}, 0 ≤ y ≤ ${n(B)}. What is the flux, in cubic metres per second?`, answer: [flux], explanation: `${n(KA)} + ${par(X)} + ${par(Y)} = ${n(flux)}.` }
  ] }; }
});

/* Duct panel x = py + qz + r over [0, A] × [0, B] in (y, z), F = ⟨ex, b, c⟩, N = r_y × r_z = ⟨1, −p, −q⟩ (points along +x):
   F · N = e(py + qz + r) − bp − cq = K + Ly + Mz, kept positive at all four corners (so everywhere: all the air crosses one way), flux = K·AB + L·BA²/2 + M·AB²/2; one minute = 60 s. */
mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'Air through the slanted duct panel',
 brief: 'A slanted panel stands across the main air duct, and the crew want to know how much air passes it in a minute.',
 labels: ['N, x-component', 'N, y-component', 'N, z-component', 'flux (m³/s)', 'air in one minute (m³)'], tolerance: 0.01,
 gl: [['N, x-component', 'N, y-component', 'N, z-component'], ['K', 'L', 'M'], ['flux (m³/s)', 'air in one minute (m³)']]
}, {
 canonical: { p: 1, q: 2, r: 3, e: 2, b: 1, c: -1, A: 3, B: 2 },
 draw: R => { let x; do { x = { p: R.nz(-2, 2), q: R.nz(-2, 2), r: R.int(1, 4), e: R.int(1, 3), b: R.int(-2, 3), c: R.int(-2, 3), A: R.int(1, 3), B: R.int(1, 3) };
  } while ([[0, 0], [x.A, 0], [0, x.B], [x.A, x.B]].some(([y, z]) => x.e * (x.p * y + x.q * z + x.r) - x.b * x.p - x.c * x.q <= 0)); return x; },
 build: ({ p, q, r, e, b, c, A, B }) => { const g = lin([[p, 'y'], [q, 'z'], [r, '']]), K = e * r - b * p - c * q, L = e * p, M = e * q, KA = K * A * B, X = L * B * A * A / 2, Y = M * A * B * B / 2, flux = KA + X + Y, vol = 60 * flux, dotT = lin([[K, ''], [L, 'y'], [M, 'z']]); return {
  prompt: `A slanted panel across the plant’s main duct is the surface x = ${g} over the rectangle 0 ≤ y ≤ ${n(A)}, 0 ≤ z ≤ ${n(B)}, in metres. Air flows along the duct with velocity F(x, y, z) = ⟨${lin([[e, 'x']])}, ${n(b)}, ${n(c)}⟩ metres per second. Parametrise the panel as r(y, z) = ⟨${g}, y, z⟩ and take N = r_y × r_z, which points the way the air is going along the duct. Enter the three components of N, then the flux of F through the panel in cubic metres per second (it may be a decimal such as 4.5: enter it exactly), then the volume of air that passes the panel in one minute (60 seconds), in cubic metres (type it without commas).`,
  answer: [1, -p, -q, flux, vol],
  hints: ['For r(y, z) = ⟨g(y, z), y, z⟩, r_y = ⟨∂g/∂y, 1, 0⟩ and r_z = ⟨∂g/∂z, 0, 1⟩. Take their cross product in that order.', 'The flux is the double integral of F(r(y, z)) · N over the rectangle of y and z. Replace x by its formula on the panel before you take the dot product. The flux is a volume per second, so a minute lets through 60 times as much.'],
  solution: `r_y = ⟨${n(p)}, 1, 0⟩ and r_z = ⟨${n(q)}, 0, 1⟩, so r_y × r_z = ⟨1 × 1 − 0 × 0, 0 × ${par(q)} − ${par(p)} × 1, ${par(p)} × 0 − 1 × ${par(q)}⟩ = ${ang([1, -p, -q])}, which has a positive x-component, the way the air goes. On the panel x = ${g}, so F = ⟨${e === 1 ? '' : n(e)}(${g}), ${n(b)}, ${n(c)}⟩ and F · N = ${e === 1 ? '' : n(e)}(${g}) + ${par(b)} × ${par(-p)} + ${par(c)} × ${par(-q)} = ${dotT}. Over the rectangle the constant gives ${par(K)} × ${n(A * B)} = ${n(KA)}, the y term gives ${par(L)} × ${n(B)} × ${n(A)}² ÷ 2 = ${n(X)} and the z term gives ${par(M)} × ${n(A)} × ${n(B)}² ÷ 2 = ${n(Y)}. The flux is ${n(KA)} + ${par(X)} + ${par(Y)} = ${n(flux)} cubic metres per second, so in 60 seconds ${n(flux)} × 60 = ${n(vol)} cubic metres pass the panel.`,
  guidance: [
   { prompt: `r_y = ⟨${n(p)}, 1, 0⟩ and r_z = ⟨${n(q)}, 0, 1⟩. What are the three components of N = r_y × r_z?`, answer: [1, -p, -q], explanation: `r_y × r_z = ${ang([1, -p, -q])}, with a positive x-component, so it points the way the air goes.` },
   { prompt: `On the panel x = ${g}. Write F(r(y, z)) · N as K + Ly + Mz: what are K, L and M?`, answer: [K, L, M], explanation: `F · N = ${e === 1 ? '' : n(e) + ' × '}(${g}) × 1 + ${par(b)} × ${par(-p)} + ${par(c)} × ${par(-q)} = ${dotT}, so K = ${n(K)}, L = ${n(L)} and M = ${n(M)}.` },
   { prompt: `Integrate ${dotT} over 0 ≤ y ≤ ${n(A)}, 0 ≤ z ≤ ${n(B)}. What is the flux in cubic metres per second, and how many cubic metres pass in one minute?`, answer: [flux, vol], explanation: `${n(KA)} + ${par(X)} + ${par(Y)} = ${n(flux)} cubic metres per second. In 60 seconds that is ${n(flux)} × 60 = ${n(vol)} cubic metres.` }
  ] }; }
});

/* Stack wall r(θ, z) = ⟨R cos θ, R sin θ, z⟩, N = r_θ × r_z = ⟨R cos θ, R sin θ, 0⟩ (outward), F = ⟨ax, by, c⟩:
   F · N = R²(a cos²θ + b sin²θ); at θ = 0 it is aR², at π/2 it is bR²; flux = R²·H·π(a + b). */
mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'Air out of the exhaust stack',
 brief: 'Air is pushed out sideways through the round wall of the exhaust stack, and the crew want the total leaving it.',
 labels: ['F · N at θ = 0', 'F · N at θ = π/2', 'k in k·π (m³/s)'], tolerance: 0.01,
 gl: [['F · N at θ = 0', 'F · N at θ = π/2'], ['k in k·π (m³/s)']]
}, {
 canonical: { R: 3, H: 2, a: 2, b: 3, c: 1 },
 draw: R => ({ R: R.int(2, 4), H: R.int(1, 4), a: R.int(1, 4), b: R.int(1, 4), c: R.int(1, 3) }),
 build: ({ R, H, a, b, c }) => { const A0 = a * R * R, B0 = b * R * R, k = R * R * H * (a + b); return {
  prompt: `A round exhaust stack has a side wall r(θ, z) = ⟨${n(R)} cos θ, ${n(R)} sin θ, z⟩ for θ from 0 to 2π and z from 0 to ${n(H)}, in metres. Air moves with velocity F(x, y, z) = ⟨${lin([[a, 'x']])}, ${lin([[b, 'y']])}, ${n(c)}⟩ metres per second. Take N = r_θ × r_z, which points outward. Enter F · N at θ = 0, then F · N at θ = π/2, then the outward flux of F through the wall as k in k·π cubic metres per second. (Over one whole turn the integrals of cos²θ and sin²θ are each π.)`,
  answer: [A0, B0, k],
  hints: ['Find N = r_θ × r_z first, then put x = R cos θ and y = R sin θ into F and take the dot product. The third component of N is 0, so the third component of F never matters on the wall.', 'The flux is the double integral of F · N over θ from 0 to 2π and z from 0 to the height. F · N is a mix of cos²θ and sin²θ: integrate each over the whole turn with the two facts given, then multiply by the height.'],
  solution: `r_θ = ⟨−${n(R)} sin θ, ${n(R)} cos θ, 0⟩ and r_z = ⟨0, 0, 1⟩, so N = r_θ × r_z = ⟨${n(R)} cos θ, ${n(R)} sin θ, 0⟩. On the wall x = ${n(R)} cos θ and y = ${n(R)} sin θ, so F · N = ${lin([[a, '']])} × ${n(R)} cos θ × ${n(R)} cos θ + ${par(b)} × ${n(R)} sin θ × ${n(R)} sin θ = ${n(a * R * R)} cos²θ + ${n(b * R * R)} sin²θ. At θ = 0 that is ${n(A0)} and at θ = π/2 it is ${n(B0)}. The integral over θ from 0 to 2π is ${n(a * R * R)}π + ${n(b * R * R)}π = ${n(R * R * (a + b))}π, and z runs over ${n(H)}, so the flux is ${n(R * R * (a + b))} × ${n(H)}π = ${n(k)}π and k = ${n(k)}.`,
  guidance: [
   { prompt: `At θ = 0 the point is (${n(R)}, 0, z) and N = ⟨${n(R)}, 0, 0⟩. What is F · N there? Then at θ = π/2, where the point is (0, ${n(R)}, z) and N = ⟨0, ${n(R)}, 0⟩, what is F · N?`, answer: [A0, B0], explanation: `At θ = 0, F = ⟨${n(a * R)}, 0, ${n(c)}⟩, so F · N = ${n(a * R)} × ${n(R)} = ${n(A0)}. At θ = π/2, F = ⟨0, ${n(b * R)}, ${n(c)}⟩, so F · N = ${n(b * R)} × ${n(R)} = ${n(B0)}.` },
   { prompt: `In general F · N = ${n(a * R * R)} cos²θ + ${n(b * R * R)} sin²θ. Integrate it over θ from 0 to 2π and multiply by the height ${n(H)}. Writing the flux as kπ, what is k?`, answer: [k], explanation: `The θ integral is ${n(a * R * R)}π + ${n(b * R * R)}π = ${n(R * R * (a + b))}π. Times the height ${n(H)}: ${n(k)}π, so k = ${n(k)}.` }
  ] }; }
});

/* ---- q38 Stokes' theorem [6.7] ---- */

/* Ring x² + y² = R², z = h. F = ⟨ay + bz, −cx + dz², exy⟩: z-part of curl F is −c − a. Clockwise goes with the downward normal,
   so the circulation is (a + c)R²π. h and e only change the text. */
mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'Swirl round the ring heater',
 brief: 'A circular heater ring hangs in the plant and air turns clockwise round it, so Mira wants the swirl round the ring.',
 labels: ['z-component of curl F (1/s)', 'k in k·π (m²/s)'], tolerance: 0.01,
 gl: [['∂Q/∂x', '∂P/∂y'], ['curl z (1/s)'], ['normal z (1 or −1)'], ['k in k·π']]
}, {
 canonical: { a: 2, c: 1, b: 3, d: 1, e: 2, R: 3, h: 2 },
 draw: R => ({ a: R.int(1, 4), c: R.int(1, 4), b: R.int(1, 3), d: R.int(1, 3), e: R.int(1, 3), R: R.int(2, 5), h: R.int(1, 4) }),
 build: ({ a, c, b, d, e, R, h }) => { const s = a + c, k = s * R * R, P = lin([[a, 'y'], [b, 'z']]), Q = lin([[-c, 'x'], [d, 'z²']]), Rr = lin([[e, 'xy']]); return {
  prompt: `A circular heater ring hangs in the plant at height ${n(h)} m: it is the circle x² + y² = ${n(R * R)} at z = ${n(h)}. Air swirls round it with velocity F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second. Enter the z-component of curl F, then the circulation of F once round the ring, travelled clockwise as seen from above, as k in k·π square metres per second: enter k.`,
  answer: [-s, k],
  hints: ['curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. A flat disc across the ring has normal ⟨0, 0, 1⟩ or ⟨0, 0, −1⟩, so only the z-component of the curl matters on it.', 'Stokes’ theorem: the circulation round the ring equals the flux of curl F through any surface with that ring as its rim, such as the flat disc, when the surface’s normal matches the direction of travel. The right-hand rule gives that normal: curl the fingers of your right hand the way you travel round the ring, and your thumb points along it.'],
  solution: `∂Q/∂x = −${n(c)} and ∂P/∂y = ${n(a)}, so the z-component of curl F is −${n(c)} − ${n(a)} = −${n(s)}. (The other components do not matter on a flat disc.) By Stokes’ theorem the circulation round the ring equals the flux of curl F through the flat disc inside it. Travelling clockwise goes with the downward normal ⟨0, 0, −1⟩, so curl F · N = (−${n(s)}) × (−1) = ${n(s)} everywhere on the disc. The disc’s area is ${n(R * R)}π, so the circulation is ${n(s)} × ${n(R * R)}π = ${n(k)}π and k = ${n(k)}.`,
  guidance: [
   { prompt: `For P = ${P} and Q = ${Q}, what are ∂Q/∂x and ∂P/∂y?`, answer: [-c, a], explanation: `∂Q/∂x = −${n(c)}, since z² does not change with x, and ∂P/∂y = ${n(a)}.` },
   { prompt: `What is the z-component of curl F, ∂Q/∂x − ∂P/∂y?`, answer: [-s], explanation: `−${n(c)} − ${n(a)} = −${n(s)}. It is the same at every point.` },
   { prompt: `The ring is travelled clockwise seen from above. Enter the z-component of the flat disc’s normal that goes with it: 1 for upward, −1 for downward.`, answer: [-1], explanation: `Clockwise seen from above goes with the downward normal, by the right-hand rule: curl the fingers of your right hand along the ring and your thumb points down.` },
   { prompt: `The disc has area ${n(R * R)}π. Writing the circulation as kπ, what is k?`, answer: [k], explanation: `curl F · N = ${n(s)} on the whole disc, so the flux of the curl is ${n(s)} × ${n(R * R)}π = ${n(k)}π, and so is the circulation.` }
  ] }; }
});

/* Pad rim x² + y² = R², z = 0. F = ⟨ay + bx², cx + dyz, ez⟩: z-part of curl F is c − a (not 0). Anticlockwise when c > a, else clockwise,
   so the work in one lap is |c − a|R²π. */
mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The drone lap',
 brief: 'A maintenance drone circles the landing pad, and the crew want the energy the wind gives or takes over several laps.',
 labels: ['z-component of curl F (N/m)', 'k in k·π (J)', 'K in K·π (J)'], tolerance: 0.01,
 gl: [['curl z (N/m)'], ['k in k·π (J)'], ['K in K·π (J)']]
}, {
 canonical: { a: 1, c: 3, b: 2, d: 1, e: 2, R: 3, m: 3 },
 draw: R => { let x; do { x = { a: R.int(1, 4), c: R.int(1, 4), b: R.int(1, 3), d: R.int(1, 3), e: R.int(1, 3), R: R.int(2, 5), m: R.int(2, 5) }; } while (x.a === x.c); return x; },
 build: ({ a, c, b, d, e, R, m }) => { const w = c - a, up = w > 0, s = Math.abs(w), dir = up ? 'anticlockwise' : 'clockwise', k = s * R * R, K = m * k, P = lin([[a, 'y'], [b, 'x²']]), Q = lin([[c, 'x'], [d, 'yz']]), Rr = lin([[e, 'z']]); return {
  prompt: `A maintenance drone flies round the edge of the landing pad, the circle x² + y² = ${n(R * R)} on the floor z = 0, travelling ${dir} as seen from above. The wind pushes on it with force F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ newtons, and the work the wind does on the drone in one lap is the circulation of F round the circle. Enter the z-component of curl F, then the work in one lap as k in k·π joules, then the work over ${n(m)} laps as K in K·π joules.`,
  answer: [w, k, K],
  hints: ['curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. The flat disc inside the pad’s edge has a normal along the z-axis, so only the z-component of the curl matters on it.', 'Stokes’ theorem: the circulation round the edge equals the flux of curl F through the flat disc, with the normal given by the right-hand rule: curl the fingers of your right hand the way you travel, and your thumb points along the normal. The opposite normal flips the sign. Several laps give several times the work of one.'],
  solution: `∂Q/∂x = ${n(c)} and ∂P/∂y = ${n(a)}, so the z-component of curl F is ${n(c)} − ${n(a)} = ${n(w)}. By Stokes’ theorem the work in one lap equals the flux of curl F through the flat disc inside the pad’s edge. Travelling ${dir} goes with the ${up ? 'upward' : 'downward'} normal ⟨0, 0, ${up ? '1' : '−1'}⟩, so curl F · N = ${par(w)} × ${up ? '1' : '(−1)'} = ${n(s)} everywhere on the disc. The disc’s area is ${n(R * R)}π, so one lap gives ${n(s)} × ${n(R * R)}π = ${n(k)}π joules and k = ${n(k)}. Over ${n(m)} laps the work is ${n(m)} × ${n(k)}π = ${n(K)}π joules, so K = ${n(K)}.`,
  guidance: [
   { prompt: `For P = ${P} and Q = ${Q}, what is the z-component of curl F, ∂Q/∂x − ∂P/∂y?`, answer: [w], explanation: `∂Q/∂x = ${n(c)} and ∂P/∂y = ${n(a)}, so it is ${n(c)} − ${n(a)} = ${n(w)}. It is the same at every point.` },
   { prompt: `The drone travels ${dir}, which goes with the ${up ? 'upward' : 'downward'} normal, so the curl’s flux is the z-component of curl F ${up ? '' : 'times −1 '}times the disc’s area ${n(R * R)}π. Writing one lap’s work as kπ, what is k?`, answer: [k], explanation: `${n(w)} × ${up ? '1' : '(−1)'} × ${n(R * R)} = ${n(k)}, so one lap gives ${n(k)}π joules.` },
   { prompt: `One lap gives ${n(k)}π joules. Writing the work over ${n(m)} laps as Kπ, what is K?`, answer: [K], explanation: `${n(m)} × ${n(k)} = ${n(K)}, so ${n(K)}π joules.` }
  ] }; }
});

/* Hatch frame x² + z² = R² in the plane y = 0. F = ⟨az + by², exz, −cx + dyz⟩: y-part of curl F is ∂P/∂z − ∂R/∂x = a + c.
   Thumb along +y (s = 1) or −y (s = −1): circulation = s(a + c)R²π. */
mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q37', title: 'Swirl round the hatch frame',
 brief: 'A round hatch frame stands upright in a plant wall, and Mira wants the swirl round it from the curl alone.',
 labels: ['y-component of curl F (1/s)', 'k in k·π (m²/s)'], tolerance: 0.01,
 gl: [['∂P/∂z', '∂R/∂x'], ['curl y (1/s)'], ['normal y (1 or −1)'], ['k in k·π']]
}, {
 canonical: { a: 2, c: 1, b: 1, d: 2, e: 1, R: 3, s: 1 },
 draw: R => ({ a: R.int(1, 4), c: R.int(1, 4), b: R.int(1, 3), d: R.int(1, 3), e: R.int(1, 3), R: R.int(2, 5), s: sgn(R) }),
 build: ({ a, c, b, d, e, R, s }) => { const w = a + c, k = s * w * R * R, P = lin([[a, 'z'], [b, 'y²']]), Q = lin([[e, 'xz']]), Rr = lin([[-c, 'x'], [d, 'yz']]), side = s > 0 ? 'positive' : 'negative'; return {
  prompt: `A circular hatch frame stands upright in a wall of the plant: it is the circle x² + z² = ${n(R * R)} in the plane y = 0, in metres. Air moves with velocity F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second. The circulation is taken once round the frame in the direction given by the right-hand rule with your thumb pointing along the ${side} y-direction. Enter the y-component of curl F, then the circulation of F round the frame as k in k·π square metres per second (k is negative if the air works against the direction of travel).`,
  answer: [w, k],
  hints: ['curl F = ⟨∂R/∂y − ∂Q/∂z, ∂P/∂z − ∂R/∂x, ∂Q/∂x − ∂P/∂y⟩. The flat disc inside the frame lies in the plane y = 0, so its normal is ⟨0, 1, 0⟩ or ⟨0, −1, 0⟩ and only the y-component of the curl matters on it.', 'Stokes’ theorem: the circulation round the frame equals the flux of curl F through the flat disc inside it. The right-hand rule pairs the direction of travel with the normal along your thumb: a normal along +y keeps the curl’s y-component as it is, and a normal along −y flips its sign.'],
  solution: `∂P/∂z = ${n(a)} and ∂R/∂x = −${n(c)}, so the y-component of curl F is ${n(a)} − (−${n(c)}) = ${n(w)}. (The other components do not matter on this disc.) By Stokes’ theorem the circulation equals the flux of curl F through the flat disc inside the frame. With the thumb along the ${side} y-direction the normal is ⟨0, ${s > 0 ? '1' : '−1'}, 0⟩, so curl F · N = ${s > 0 ? n(w) : '(−1) × ' + n(w) + ' = ' + n(-w)} everywhere on the disc. The disc’s area is ${n(R * R)}π, so the circulation is ${n(s * w)} × ${n(R * R)}π = ${n(k)}π and k = ${n(k)}.`,
  guidance: [
   { prompt: `For P = ${P} and R = ${Rr}, what are ∂P/∂z and ∂R/∂x?`, answer: [a, -c], explanation: `∂P/∂z = ${n(a)}, since y² does not change with z, and ∂R/∂x = −${n(c)}, since yz does not change with x.` },
   { prompt: `What is the y-component of curl F, ∂P/∂z − ∂R/∂x?`, answer: [w], explanation: `${n(a)} − (−${n(c)}) = ${n(w)}. It is the same at every point.` },
   { prompt: `The right-hand rule has your thumb along the ${side} y-direction. Enter the y-component of the flat disc’s normal that goes with it: 1 for the positive direction, −1 for the negative.`, answer: [s], explanation: `The thumb gives the normal: ${s > 0 ? '⟨0, 1, 0⟩, so the y-component is 1' : '⟨0, −1, 0⟩, so the y-component is −1'}.` },
   { prompt: `The disc has area ${n(R * R)}π. Writing the circulation as kπ, what is k?`, answer: [k], explanation: `curl F · N = ${n(s * w)} on the whole disc, so the flux of the curl is ${n(s * w)} × ${n(R * R)}π = ${n(k)}π, and so is the circulation.` }
  ] }; }
});

/* ---- q39 The divergence theorem [6.8] ---- */

/* F = ⟨ax² + z, by + x, cz + y⟩ out of the box [0, L] × [0, W] × [0, H]: div F = 2ax + b + c, flux = aL²WH + (b + c)LWH. */
mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The dust-filter cabinet',
 brief: 'A closed filter cabinet pushes air out through all its sides, and the crew want the total leaving it.',
 labels: ['div F at the far corner (1/s)', 'flux out (m³/s)'], tolerance: 0.01,
 gl: [['∂P/∂x', '∂Q/∂y', '∂R/∂z'], ['div F (1/s)'], ['volume (m³)', 'constant part'], ['flux out (m³/s)']]
}, {
 canonical: { a: 2, b: 1, c: 3, L: 3, W: 2, H: 2 },
 draw: R => ({ a: R.int(1, 3), b: R.int(1, 3), c: R.int(1, 3), L: R.int(1, 4), W: R.int(1, 4), H: R.int(1, 4) }),
 build: ({ a, b, c, L, W, H }) => { const bc = b + c, cd = 2 * a * L + bc, V = L * W * H, X = bc * V, Y = a * L * L * W * H, flux = X + Y,
  P = lin([[a, 'x²'], [1, 'z']]), Q = lin([[b, 'y'], [1, 'x']]), Rr = lin([[c, 'z'], [1, 'y']]), corner = pt([L, W, H]), tx = lin([[2 * a, 'x']]); return {
  prompt: `A dust-filter cabinet is the closed box 0 ≤ x ≤ ${n(L)}, 0 ≤ y ≤ ${n(W)}, 0 ≤ z ≤ ${n(H)}, in metres. Air moves with velocity F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second. Enter div F at the far corner ${corner}, then the total flux of F out through the six sides of the cabinet, in cubic metres per second (type it without commas).`,
  answer: [cd, flux],
  hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. Terms that do not contain the variable you differentiate by drop out. Here the result depends only on x.', 'The divergence theorem: the flux out through the closed surface of the box equals the triple integral of div F over the inside. Integrate in x for the part that depends on x, and multiply by the area of the face for the rest.'],
  solution: `∂P/∂x = ${tx}, ∂Q/∂y = ${n(b)} and ∂R/∂z = ${n(c)}, so div F = ${lin([[2 * a, 'x'], [bc, '']])}; at the far corner, where x = ${n(L)}, it is ${n(2 * a * L)} + ${n(bc)} = ${n(cd)}. By the divergence theorem the flux out through the six sides is the triple integral of div F over the box. The box has volume ${n(L)} × ${n(W)} × ${n(H)} = ${n(V)}, so the constant ${n(bc)} gives ${n(X)}. The ${tx} part gives ${n(W)} × ${n(H)} × ${n(a)} × ${n(L)}² = ${n(Y)}, since the integral of ${tx} from 0 to ${n(L)} is ${n(a)} × ${n(L)}². The flux out is ${n(X)} + ${n(Y)} = ${n(flux)} cubic metres per second.`,
  guidance: [
   { prompt: `What are ∂P/∂x at the far corner, where x = ${n(L)}, and ∂Q/∂y and ∂R/∂z?`, answer: [2 * a * L, b, c], explanation: `∂P/∂x = ${tx} = ${n(2 * a * L)} at x = ${n(L)} (z does not change with x), ∂Q/∂y = ${n(b)} (x does not change with y) and ∂R/∂z = ${n(c)} (y does not change with z).` },
   { prompt: `What is div F at the far corner ${corner}?`, answer: [cd], explanation: `${n(2 * a * L)} + ${n(b)} + ${n(c)} = ${n(cd)}.` },
   { prompt: `div F = ${lin([[2 * a, 'x'], [bc, '']])}. What is the box’s volume, and the triple integral of the constant ${n(bc)} over it?`, answer: [V, X], explanation: `The volume is ${n(L)} × ${n(W)} × ${n(H)} = ${n(V)}, so the constant gives ${n(bc)} × ${n(V)} = ${n(X)}.` },
   { prompt: `Add the ${tx} part. What is the total flux out of the box?`, answer: [flux], explanation: `The ${tx} part is ${n(W)} × ${n(H)} × ${n(a)} × ${n(L)}² = ${n(Y)}, so the flux out is ${n(X)} + ${n(Y)} = ${n(flux)} cubic metres per second.` }
  ] }; }
});

/* F = ⟨ax + ey, by + fz, cz⟩ out of [0, L] × [0, W] × [0, H]: div F = a + b + c. The floor passes nothing, the x and y walls pass
   (a + b)V between them (the ey and fz parts cancel in pairs) and the roof passes cV, so the other five surfaces pass M = (a + b)V. */
mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'The sealed supply chamber',
 brief: 'Sensors cover every surface of a sealed supply chamber except the roof, and the crew want the roof’s share of the air leaving.',
 labels: ['div F (1/s)', 'total flux out (m³/s)', 'flux out through the roof (m³/s)'], tolerance: 0.01,
 gl: [['div F (1/s)'], ['total flux out (m³/s)'], ['roof flux (m³/s)']]
}, {
 canonical: { a: 2, b: 1, c: 3, e: 1, f: 2, L: 3, W: 2, H: 2 },
 draw: R => ({ a: R.int(1, 3), b: R.int(1, 3), c: R.int(1, 3), e: R.int(1, 3), f: R.int(1, 3), L: R.int(1, 4), W: R.int(1, 4), H: R.int(1, 4) }),
 build: ({ a, b, c, e, f, L, W, H }) => { const dv = a + b + c, V = L * W * H, total = dv * V, M = (a + b) * V, roof = total - M,
  P = lin([[a, 'x'], [e, 'y']]), Q = lin([[b, 'y'], [f, 'z']]), Rr = lin([[c, 'z']]); return {
  prompt: `A sealed supply chamber is the closed box 0 ≤ x ≤ ${n(L)}, 0 ≤ y ≤ ${n(W)}, 0 ≤ z ≤ ${n(H)}, in metres. Air moves with velocity F(x, y, z) = ⟨${P}, ${Q}, ${Rr}⟩ metres per second. Sensors on the floor and the four side walls report that, together, those five surfaces pass ${n(M)} cubic metres per second out of the chamber. Enter div F, then the total flux of F out through all six surfaces, then the flux out through the roof z = ${n(H)} alone, in cubic metres per second.`,
  answer: [dv, total, roof],
  hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. Terms that do not contain the variable you differentiate by drop out.', 'The divergence theorem gives the flux out through all six surfaces together as the triple integral of div F over the box. The six surfaces are the five that the sensors cover and the roof, so the roof’s flux is the total minus the five.'],
  solution: `∂P/∂x = ${n(a)}, ∂Q/∂y = ${n(b)} and ∂R/∂z = ${n(c)}, so div F = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)} everywhere. By the divergence theorem the flux out through all six surfaces is div F times the volume: the box has volume ${n(L)} × ${n(W)} × ${n(H)} = ${n(V)}, so the flux is ${n(dv)} × ${n(V)} = ${n(total)}. The other five surfaces pass ${n(M)} between them, so the roof passes ${n(total)} − ${n(M)} = ${n(roof)} cubic metres per second.`,
  guidance: [
   { prompt: `What is div F, found from ∂P/∂x + ∂Q/∂y + ∂R/∂z?`, answer: [dv], explanation: `∂P/∂x = ${n(a)} (y does not change with x), ∂Q/∂y = ${n(b)} (z does not change with y) and ∂R/∂z = ${n(c)}, so div F = ${n(dv)}.` },
   { prompt: `div F is the same everywhere, so the triple integral is div F times the box’s volume. What is the total flux out through all six surfaces?`, answer: [total], explanation: `The volume is ${n(L)} × ${n(W)} × ${n(H)} = ${n(V)}, so the flux is ${n(dv)} × ${n(V)} = ${n(total)} cubic metres per second.` },
   { prompt: `The floor and the four side walls pass ${n(M)} cubic metres per second between them. What does the roof pass?`, answer: [roof], explanation: `${n(total)} − ${n(M)} = ${n(roof)} cubic metres per second.` }
  ] }; }
});

/* Closed can x² + y² ≤ R², 0 ≤ z ≤ H, volume πR²H, outward normals. F = ⟨ax, by, c + ez⟩: div F = a + b + e.
   Top (normal up): (c + eH)·πR²; bottom (normal down): −c·πR²; wall = total − top − bottom = (a + b)R²H·π. */
mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q37', title: 'The closed air tank',
 brief: 'A closed cylindrical air tank has a flat top, a flat floor and a curved wall, and the crew want what leaves through each part.',
 labels: ['k for the whole tank', 'k for the top disc', 'k for the floor disc', 'k for the curved wall'], tolerance: 0.01,
 gl: [['div F (1/s)'], ['k for the whole tank'], ['k for the top disc', 'k for the floor disc'], ['k for the curved wall']]
}, {
 canonical: { R: 2, H: 3, a: 2, b: 1, c: 3, e: 2 },
 draw: R => ({ R: R.int(1, 3), H: R.int(1, 4), a: R.int(1, 3), b: R.int(1, 3), c: R.int(1, 3), e: R.int(1, 3) }),
 build: ({ R, H, a, b, c, e }) => { const dv = a + b + e, tot = dv * R * R * H, top = (c + e * H) * R * R, bot = -c * R * R, side = tot - top - bot, F3 = lin([[c, ''], [e, 'z']]); return {
  prompt: `A closed cylindrical air tank has a curved wall x² + y² = ${n(R * R)}, a flat floor at z = 0 and a flat top at z = ${n(H)}, in metres; its volume is π × ${n(R)}² × ${n(H)}. Air moves with velocity F(x, y, z) = ⟨${lin([[a, 'x']])}, ${lin([[b, 'y']])}, ${F3}⟩ metres per second. Use the outward normal on every part of the tank. Enter, each as k in k·π cubic metres per second, the flux out through the whole closed tank, then through the top disc, then through the floor disc, then through the curved wall.`,
  answer: [tot, top, bot, side],
  hints: ['The divergence theorem gives the flux out through the whole closed surface: div F times the volume when div F is the same everywhere.', 'On a flat disc the normal is ⟨0, 0, 1⟩ on the top and ⟨0, 0, −1⟩ on the floor, so only the third component of F counts there: F · N is that component, with its sign set by the normal, and the disc’s area is π × radius². The whole surface is the top, the floor and the wall, so the wall’s flux is what is left of the total.'],
  solution: `div F = ${n(a)} + ${n(b)} + ${n(e)} = ${n(dv)}, so by the divergence theorem the flux out of the whole tank is ${n(dv)} × π × ${n(R)}² × ${n(H)} = ${n(tot)}π, and k = ${n(tot)}. On the top disc z = ${n(H)} and N = ⟨0, 0, 1⟩, so F · N = ${n(c)} + ${n(e)} × ${n(H)} = ${n(c + e * H)}; times the area ${n(R * R)}π that is ${n(top)}π. On the floor disc z = 0 and N = ⟨0, 0, −1⟩, so F · N = −${n(c)}, and the flux is −${n(c)} × ${n(R * R)}π = ${n(bot)}π. The curved wall passes the rest: ${n(tot)} − ${par(top)} − ${par(bot)} = ${n(side)}, so k = ${n(side)} for the curved wall.`,
  guidance: [
   { prompt: `What is div F?`, answer: [dv], explanation: `∂P/∂x + ∂Q/∂y + ∂R/∂z = ${n(a)} + ${n(b)} + ${n(e)} = ${n(dv)}, the same everywhere.` },
   { prompt: `The volume is ${n(R * R * H)}π. Writing the flux out through the whole tank as kπ, what is k?`, answer: [tot], explanation: `${n(dv)} × ${n(R * R * H)} = ${n(tot)}, so the flux is ${n(tot)}π.` },
   { prompt: `On the top disc (z = ${n(H)}, normal pointing up) and on the floor disc (z = 0, normal pointing down), the area is ${n(R * R)}π. Writing each flux as kπ, what is k for the top, then for the floor?`, answer: [top, bot], explanation: `Top: F · N = ${n(c)} + ${n(e)} × ${n(H)} = ${n(c + e * H)}, times ${n(R * R)} gives ${n(top)}. Floor: F · N = −${n(c)}, times ${n(R * R)} gives ${n(bot)}. A negative flux means air comes in through the floor.` },
   { prompt: `The top, floor and curved wall together make the whole tank. Writing the wall’s flux as kπ, what is k?`, answer: [side], explanation: `${n(tot)} − ${par(top)} − ${par(bot)} = ${n(side)}, so the curved wall passes ${n(side)}π cubic metres per second.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Differential equations [4.6, 6.7, 6.8] ---- */

/* Dome of radius R (3 or 6) on a sealed floor. F = ⟨ax + gy, (g + w)x + by, cz⟩: curl F = ⟨0, 0, w⟩, div F = a + b + c, F_z = 0 on the floor.
   T = pxy + qz² at (x0, y0, z0), along u = UNITS[i] ÷ 3 (a whole rate). Answers: air leaving, flux of curl up through the shell, rate. */
mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'Reading the food lab dome',
 brief: 'The food lab has its own sealed dome, and Mira wants the same three readings before it is signed off.',
 labels: ['k for the air leaving (m³/s)', 'k for the flux of curl F', 'temperature rate (°C/m)'], tolerance: 0.01,
 gl: [['div F (1/s)'], ['k for the air leaving'], ['curl z (1/s)'], ['k for curl flux'], ['∂T/∂x', '∂T/∂y', '∂T/∂z'], ['rate (°C/m)']]
}, {
 canonical: { p: 2, q: 1, x0: 1, y0: 2, z0: 1, i: 0, g: 1, w: 2, a: 2, b: 1, c: 2, R: 3 },
 draw: R => { let x, gg, d; do { x = { p: R.int(1, 3), q: R.int(1, 3), x0: R.nz(-2, 2), y0: R.nz(-2, 2), z0: R.int(1, 2), i: R.int(0, UNITS.length - 1), g: R.int(1, 2), w: R.int(1, 3), a: R.int(1, 3), b: R.int(1, 3), c: R.int(1, 3), R: R.pick([3, 3, 6]) };
   gg = [x.p * x.y0, x.p * x.x0, 2 * x.q * x.z0]; d = gg[0] * UNITS[x.i][0] + gg[1] * UNITS[x.i][1] + gg[2] * UNITS[x.i][2];
  } while (x.x0 * x.x0 + x.y0 * x.y0 + x.z0 * x.z0 >= x.R * x.R || d % 3 !== 0 || d === 0); return x; },
 build: ({ p, q, x0, y0, z0, i, g, w, a, b, c, R }) => { const v = UNITS[i], gr = [p * y0, p * x0, 2 * q * z0], dot = gr[0] * v[0] + gr[1] * v[1] + gr[2] * v[2], rate = dot / 3,
  dv = a + b + c, vol = 2 * R * R * R / 3, k2 = dv * vol, k1 = w * R * R, T = lin([[p, 'xy'], [q, 'z²']]), at = pt([x0, y0, z0]),
  ut = '⟨' + v.map(third).join(', ') + '⟩', Ft = `⟨${lin([[a, 'x'], [g, 'y']])}, ${lin([[g + w, 'x'], [b, 'y']])}, ${lin([[c, 'z']])}⟩`; return {
  prompt: `The food lab sits under its own half-ball dome of radius ${n(R)} m, standing on a sealed floor z = 0. Air inside moves with velocity F(x, y, z) = ${Ft} metres per second. First, enter the rate at which air leaves the dome through its shell, in cubic metres per second, as k in k·π (type k without commas). Second, enter the flux of curl F up and out through the shell, as k in k·π. Third, a heat lamp makes the temperature T(x, y, z) = ${T} degrees Celsius, with x, y and z in metres; the gradient is ∇T = ⟨∂T/∂x, ∂T/∂y, ∂T/∂z⟩, and the rate of change of T in the direction of a unit vector u is ∇T · u. A sensor drone at ${at} sets off in the direction u = ${ut}: enter the rate at which the temperature changes, in °C per metre.`,
  answer: [k2, k1, rate],
  hints: ['The divergence theorem turns the air leaving the closed dome into the triple integral of div F; a half-ball of radius R has volume 2πR³ ÷ 3. Check whether any air crosses the floor.', 'Stokes’ theorem lets you swap the shell for the flat floor disc with the same rim, keeping the normal pointing up. For the temperature, work out the three partial derivatives of T, put in the drone’s position to get ∇T, and take the dot product with u.'],
  solution: `div F = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)}. On the floor z = 0, so the upward part ${lin([[c, 'z']])} is 0 and no air crosses it: everything that leaves the closed dome leaves through the shell. By the divergence theorem that is ${n(dv)} × (2π × ${n(R)}³ ÷ 3) = ${n(dv)} × ${n(vol)}π = ${n(k2)}π cubic metres per second, so k = ${n(k2)}. Next, curl F = ⟨0, 0, ${n(g + w)} − ${n(g)}⟩ = ⟨0, 0, ${n(w)}⟩. By Stokes’ theorem its flux up through the shell equals its flux up through the floor disc with the same rim: ${n(w)} × ${n(R * R)}π = ${n(k1)}π, so k = ${n(k1)}. Last, ∇T = ⟨${lin([[p, 'y']])}, ${lin([[p, 'x']])}, ${lin([[2 * q, 'z']])}⟩, which at ${at} is ${ang(gr)}. The rate is ∇T · u = (${n(gr[0])} × ${par(v[0])} + ${par(gr[1])} × ${par(v[1])} + ${par(gr[2])} × ${par(v[2])}) ÷ 3 = ${n(dot)} ÷ 3 = ${n(rate)} °C per metre.`,
  guidance: [
   { prompt: `What is div F?`, answer: [dv], explanation: `∂P/∂x + ∂Q/∂y + ∂R/∂z = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)}, the same everywhere.` },
   { prompt: `No air crosses the floor. Writing the air leaving through the shell as kπ, what is k?`, answer: [k2], explanation: `The dome holds 2π × ${n(R)}³ ÷ 3 = ${n(vol)}π cubic metres, so the divergence theorem gives ${n(dv)} × ${n(vol)}π = ${n(k2)}π.` },
   { prompt: `curl F has only a z-component, ∂Q/∂x − ∂P/∂y. What is it?`, answer: [w], explanation: `∂Q/∂x = ${n(g + w)} and ∂P/∂y = ${n(g)}, so it is ${n(g + w)} − ${n(g)} = ${n(w)}. The other two components are 0.` },
   { prompt: `Through the floor disc of area ${n(R * R)}π, the upward flux of curl F is kπ. What is k?`, answer: [k1], explanation: `${n(w)} × ${n(R * R)} = ${n(k1)}. By Stokes’ theorem the shell, which has the same rim, has the same flux of curl F.` },
   { prompt: `What are the three components of ∇T at ${at}?`, answer: gr, explanation: `∂T/∂x = ${lin([[p, 'y']])} = ${n(gr[0])}, ∂T/∂y = ${lin([[p, 'x']])} = ${n(gr[1])} and ∂T/∂z = ${lin([[2 * q, 'z']])} = ${n(gr[2])}.` },
   { prompt: `What is ∇T · u, the rate in °C per metre?`, answer: [rate], explanation: `(${n(gr[0])} × ${par(v[0])} + ${par(gr[1])} × ${par(v[1])} + ${par(gr[2])} × ${par(v[2])}) ÷ 3 = ${n(dot)} ÷ 3 = ${n(rate)}.` }
  ] }; }
});

/* Dome of radius R (3 or 6), floor vents push air up at g: F = ⟨ax, by, cz + g⟩, div F = a + b + c.
   Whole closed dome: div F × 2πR³/3. Floor (normal down): −g·πR². Shell = whole − floor = whole + gπR². */
mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'Fresh air up through the dome floor',
 brief: 'Vents in the dome floor push fresh air up into the dome, and the crew want to know how much of the flow leaves through the shell.',
 labels: ['div F (1/s)', 'k for the whole closed dome', 'k for the shell'], tolerance: 0.01,
 gl: [['div F (1/s)'], ['k for the whole closed dome'], ['k for the shell']]
}, {
 canonical: { a: 2, b: 1, c: 2, g: 3, R: 3 },
 draw: R => ({ a: R.int(1, 3), b: R.int(1, 3), c: R.int(1, 3), g: R.int(1, 3), R: R.pick([3, 6]) }),
 build: ({ a, b, c, g, R }) => { const dv = a + b + c, vol = 2 * R * R * R / 3, kt = dv * vol, kf = -g * R * R, ks = kt - kf; return {
  prompt: `The air-recycling dome is a half-ball of radius ${n(R)} m standing on the floor z = 0, and vents in the floor push fresh air up into it. The air moves with velocity F(x, y, z) = ⟨${lin([[a, 'x']])}, ${lin([[b, 'y']])}, ${lin([[c, 'z'], [g, '']])}⟩ metres per second, so at the floor the upward speed is ${n(g)} m/s. The shell and the floor together close the dome off. Enter div F, then the flux of F out through the whole closed dome (shell and floor), as k in k·π cubic metres per second, then the flux out through the shell alone, as k in k·π (type each k without commas).`,
  answer: [dv, kt, ks],
  hints: ['div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z. By the divergence theorem the flux out through the whole closed dome is the triple integral of div F over the inside; a half-ball of radius R has volume 2πR³ ÷ 3.', 'The whole closed dome is the shell and the floor disc. Out of the dome through the floor means downward, so the outward normal there is ⟨0, 0, −1⟩; the shell’s flux is the total minus the floor’s flux.'],
  solution: `div F = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)}. The dome holds 2π × ${n(R)}³ ÷ 3 = ${n(vol)}π cubic metres, so by the divergence theorem the flux out through the whole closed dome is ${n(dv)} × ${n(vol)}π = ${n(kt)}π, and k = ${n(kt)}. On the floor z = 0 and the outward normal is ⟨0, 0, −1⟩, so F · N = −${n(g)}, and the floor’s flux is −${n(g)} × ${n(R * R)}π = ${n(kf)}π: air comes in there. The shell passes the rest: ${n(kt)}π − (${n(kf)}π) = ${n(ks)}π, so k = ${n(ks)}.`,
  guidance: [
   { prompt: `What is div F?`, answer: [dv], explanation: `∂P/∂x + ∂Q/∂y + ∂R/∂z = ${n(a)} + ${n(b)} + ${n(c)} = ${n(dv)}, the same everywhere (the constant ${n(g)} drops out).` },
   { prompt: `The dome holds 2π × ${n(R)}³ ÷ 3 = ${n(vol)}π cubic metres. Writing the flux out through the whole closed dome as kπ, what is k?`, answer: [kt], explanation: `${n(dv)} × ${n(vol)} = ${n(kt)}, so the flux is ${n(kt)}π.` },
   { prompt: `On the floor disc (area ${n(R * R)}π) the outward normal points down and F · N = −${n(g)}. The shell passes the total minus the floor’s flux. Writing the shell’s flux as kπ, what is k?`, answer: [ks], explanation: `The floor’s flux is −${n(g)} × ${n(R * R)} = ${n(kf)}, so the shell passes ${n(kt)} − (${n(kf)}) = ${n(ks)}, and the flux is ${n(ks)}π.` }
  ] }; }
});

/* Dome of radius R (3 or 6). T = ax + by² + cz at (x0, 1, z0): ∇T = ⟨a, 2b, c⟩ with whole length (TRI = (a, 2b, c) triples).
   F = ⟨fx − ey + mz, ex + b2·y + nz², c2·z + g⟩: curl F = ⟨−2nz, m, 2e⟩, div F = f + b2 + c2, F_z = g on the floor. */
const TRI = [[1, 2, 2], [2, 6, 3], [6, 2, 3], [3, 2, 6], [4, 4, 7], [4, 8, 1], [8, 4, 1], [1, 4, 8], [6, 6, 7]];
mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q20', title: 'The dome sign-off survey',
 brief: 'For the final sign-off Mira wants the steepest heating rate in the dome, its swirl, and the air it passes through the shell.',
 labels: ['greatest rate of increase (°C/m)', 'k for the flux of curl F', 'k for the air leaving (m³/s)'], tolerance: 0.01,
 gl: [['∂T/∂x', '∂T/∂y', '∂T/∂z'], ['greatest rate (°C/m)'], ['curl z (1/s)'], ['k for curl flux'], ['div F (1/s)', 'k for the floor disc'], ['k for the air leaving']]
}, {
 canonical: { t: 0, sa: 1, sc: 1, x0: 1, z0: 1, f: 2, e: 1, m: 2, b2: 1, n2: 1, c2: 2, g: 1, R: 3 },
 draw: R => { let x; do { x = { t: R.int(0, TRI.length - 1), sa: sgn(R), sc: sgn(R), x0: R.int(-2, 2), z0: R.int(1, 2), f: R.int(1, 3), e: R.int(1, 3), m: R.int(1, 3), b2: R.int(1, 3), n2: R.int(1, 3), c2: R.int(1, 3), g: R.int(1, 3), R: R.pick([3, 6]) };
  } while (x.x0 * x.x0 + 1 + x.z0 * x.z0 >= x.R * x.R); return x; },
 build: ({ t, sa, sc, x0, z0, f, e, m, b2, n2, c2, g, R }) => { const [ta, tb, tc] = TRI[t], a = sa * ta, bb = tb / 2, c = sc * tc, gr = [a, tb, c], len = Math.sqrt(a * a + tb * tb + c * c),
  cz = 2 * e, k1 = cz * R * R, dv = f + b2 + c2, vol = 2 * R * R * R / 3, kt = dv * vol, kf = -g * R * R, k3 = kt - kf, T = lin([[a, 'x'], [bb, 'y²'], [c, 'z']]), at = pt([x0, 1, z0]),
  Ft = `⟨${lin([[f, 'x'], [-e, 'y'], [m, 'z']])}, ${lin([[e, 'x'], [b2, 'y'], [n2, 'z²']])}, ${lin([[c2, 'z'], [g, '']])}⟩`; return {
  prompt: `Final survey of the dome, a half-ball shell of radius ${n(R)} m standing on the floor z = 0. First, the temperature inside is T(x, y, z) = ${T} degrees Celsius, with x, y and z in metres. The gradient ∇T = ⟨∂T/∂x, ∂T/∂y, ∂T/∂z⟩ points the way T increases fastest, and the greatest rate of increase is its length, √((∂T/∂x)² + (∂T/∂y)² + (∂T/∂z)²). A sensor drone at ${at} can fly in any direction: enter the greatest rate at which the temperature can increase there, in °C per metre. Second, the air moves with velocity F(x, y, z) = ${Ft} metres per second, and vents in the floor push air up into the dome. Enter the flux of curl F up and out through the shell, as k in k·π. Third, enter the rate at which air leaves the dome through its shell, in cubic metres per second, as k in k·π (type k without commas).`,
  answer: [len, k1, k3],
  hints: ['The greatest rate of increase at a point is the length of ∇T there. Work out the three partial derivatives of T and put in the drone’s position.', 'Stokes’ theorem lets you swap the shell for the flat floor disc with the same rim, keeping the normal pointing up; only the z-component of curl F counts there. The divergence theorem gives the flow out through the whole closed dome, shell and floor; subtract what leaves through the floor, which is negative when air comes in.'],
  solution: `∇T = ⟨${n(a)}, ${lin([[2 * bb, 'y']])}, ${n(c)}⟩, which at ${at} is ${ang(gr)}. The greatest rate of increase is its length, √(${par(a)}² + ${par(tb)}² + ${par(c)}²) = √${n(a * a + tb * tb + c * c)} = ${n(len)} °C per metre. For the air, the z-component of curl F is ∂Q/∂x − ∂P/∂y = ${n(e)} − (−${n(e)}) = ${n(cz)}. By Stokes’ theorem the flux of curl F up through the shell equals its flux up through the floor disc with the same rim: ${n(cz)} × ${n(R * R)}π = ${n(k1)}π, so k = ${n(k1)}. Next, div F = ${n(f)} + ${n(b2)} + ${n(c2)} = ${n(dv)}, so by the divergence theorem the flux out through the whole closed dome is ${n(dv)} × (2π × ${n(R)}³ ÷ 3) = ${n(dv)} × ${n(vol)}π = ${n(kt)}π. On the floor the outward normal is ⟨0, 0, −1⟩ and F · N = −${n(g)}, so the floor passes −${n(g)} × ${n(R * R)}π = ${n(kf)}π. The shell passes the rest: ${n(kt)}π − (${n(kf)}π) = ${n(k3)}π cubic metres per second, so k = ${n(k3)}.`,
  guidance: [
   { prompt: `What are the three components of ∇T at ${at}?`, answer: gr, explanation: `∂T/∂x = ${n(a)}, ∂T/∂y = ${lin([[2 * bb, 'y']])} = ${n(tb)} at y = 1 and ∂T/∂z = ${n(c)}.` },
   { prompt: `What is the length of ∇T, the greatest rate of increase in °C per metre?`, answer: [len], explanation: `√(${par(a)}² + ${par(tb)}² + ${par(c)}²) = √${n(a * a + tb * tb + c * c)} = ${n(len)}.` },
   { prompt: `What is the z-component of curl F, ∂Q/∂x − ∂P/∂y?`, answer: [cz], explanation: `∂Q/∂x = ${n(e)} and ∂P/∂y = −${n(e)}, so it is ${n(e)} − (−${n(e)}) = ${n(cz)}. The other two components do not matter on a flat floor disc.` },
   { prompt: `Through the floor disc of area ${n(R * R)}π, the upward flux of curl F is kπ. What is k?`, answer: [k1], explanation: `${n(cz)} × ${n(R * R)} = ${n(k1)}. By Stokes’ theorem the shell, which has the same rim, has the same flux of curl F.` },
   { prompt: `What is div F, and what is the flux out through the floor disc (outward normal ⟨0, 0, −1⟩) as kπ? Enter div F, then k.`, answer: [dv, kf], explanation: `div F = ${n(f)} + ${n(b2)} + ${n(c2)} = ${n(dv)}. On the floor F · N = −${n(g)}, so the floor’s flux is −${n(g)} × ${n(R * R)}π = ${n(kf)}π: air comes in through the floor.` },
   { prompt: `The dome holds 2π × ${n(R)}³ ÷ 3 = ${n(vol)}π cubic metres, so the whole closed dome passes ${n(dv)} × ${n(vol)}π = ${n(kt)}π. Writing the air leaving through the shell as kπ, what is k?`, answer: [k3], explanation: `The shell passes the total minus the floor’s share: ${n(kt)} − (${n(kf)}) = ${n(k3)}, so the flux is ${n(k3)}π.` }
  ] }; }
});

/* Tidies generated text where a drawn number comes out as 1: '1 joules' → '1 joule', '1π' → 'π'. Wraps every build of this file. */
const ONE = s => s.replace(/(^|[^\d.,])(−?1) (joule|newton|tonne|cubic metre|square metre|metre|kilogram|litre|gram|second|watt)s\b/g, '$1$2 $3').replace(/(^|[^\d.,])1π/g, '$1π');
for (const id of 'q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d'.split(' ')) {
 const g = window.MISSION_GEN[id], b = g.build;
 g.build = p => { const o = b(p); return { ...o, prompt: ONE(o.prompt), hints: o.hints.map(ONE), solution: ONE(o.solution), guidance: o.guidance.map(x => ({ ...x, prompt: ONE(x.prompt), explanation: ONE(x.explanation) })) }; };
}
})();
