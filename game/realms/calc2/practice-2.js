/* Calculus 2: accumulation practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p2.js. */
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
const SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵' };
/* A polynomial from its coefficients, highest power first: poly([3, 0, −2], 'x') is '3x² − 2'. A coefficient 1 is not
   written out and a zero term is left out. */
const poly = (cs, v) => { const deg = cs.length - 1; let out = '';
 cs.forEach((c, i) => { const q = deg - i; if (c === 0) return; const a = Math.abs(c), body = q === 0 ? n(a) : (a === 1 ? '' : n(a)) + v + (q > 1 ? SUP[q] : '');
  out += out ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; });
 return out || '0'; };
/* A factor (v − r), and the factored quadratic a(v − r)(v − s) with a bare v first. */
const fac = (r, v) => r === 0 ? v : r < 0 ? `(${v} + ${n(-r)})` : `(${v} − ${n(r)})`;
const facs = (a, r, s, v) => { const f = [fac(r, v), fac(s, v)].sort((p, q) => (q === v) - (p === v)).join(''); return (a === 1 ? '' : n(a)) + f; };
const r3 = x => Math.round(x * 1000) / 1000, f3 = x => x.toFixed(3).replace('-', '−');
const rd = x => Math.round(x * 1e6) / 1e6;
const gcd = (p, q) => q ? gcd(q, p % q) : Math.abs(p);
/* A fraction p/q in lowest terms, as text: frac(64, 15) is '64/15', frac(8, 2) is '4'. */
const frac = (p, q) => { const g = gcd(p, q), a = p / g, b = q / g; return b === 1 ? n(a) : `${n(a)}/${n(b)}`; };
const kpi = ks => ks.includes('/') ? `(${ks})π` : `${ks}π`;
const pf = t => t.startsWith('−') ? `(${t})` : t;
const cub = x => x * x * x;

/* ---- q06 Integrals that give arctan and arcsin [1.7] ---- */

/* ∫ from 0 to L of 1 ÷ (c² + x²) dx = (1 ÷ c) arctan(L ÷ c), with L ÷ c = rho; m times ∫ from 0 to b of 1 ÷ √(s² − x²) dx = m arcsin(b ÷ s).
   Not the worked example (c = 3 with limit 3; s = 2 with limit 1). */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'The gantry heat sensor',
 brief: 'A heat sensor on the reservoir dam reads a signal that fades along the spillway, and the gain control needs the total it picks up.',
 labels: ['total signal', 'gain value'], tolerance: 0.0005,
 gl: [['upper limit in u'], ['total signal'], ['gain value']]
}, {
 canonical: { c: 2, rho: 2.5, m: 3, s: 5, b: 4 },
 draw: R => { let p; do { p = { c: R.pick([2, 4, 5, 6]), rho: R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), m: R.int(2, 6), s: R.pick([2, 4, 5, 8, 10]) }; p.b = R.int(1, p.s - 1); }
  while (p.c * p.rho !== Math.round(p.c * p.rho) || p.c * p.rho < 2 || (p.s === 2 && p.b === 1)); return p; },
 build: ({ c, rho, m, s, b }) => { const L = c * rho, A = r3(Math.atan(rho) / c), B = r3(m * Math.asin(b / s)), q = b / s; return {
  prompt: `A heat sensor on the reservoir dam reads a signal of 1 ÷ (${n(c * c)} + x²) units per metre at x metres down the spillway, measured from its top edge. Enter the total signal over the first ${n(L)} metres, ∫ from 0 to ${n(L)} of 1 ÷ (${n(c * c)} + x²) dx, to 3 decimal places. The gain control also needs ${n(m)} times ∫ from 0 to ${n(b)} of 1 ÷ √(${n(s * s)} − x²) dx: enter that value next, to 3 decimal places.`,
  answer: [A, B],
  hints: [`Write ${n(c * c)} + x² as ${n(c * c)}(1 + (x ÷ ${n(c)})²) and substitute u = x ÷ ${n(c)}. Then dx = ${n(c)} du, so a factor 1 ÷ ${n(c)} ends up in front of the arctan.`, `An antiderivative of 1 ÷ √(${n(s * s)} − x²) is arcsin(x ÷ ${n(s)}). Keep the factor ${n(m)} in front. Set your calculator to radians.`],
  solution: `With u = x ÷ ${n(c)}, dx = ${n(c)} du and 1 ÷ (${n(c * c)} + x²) dx = (1 ÷ ${n(c)}) du ÷ (1 + u²). The limits become u = 0 and u = ${n(L)} ÷ ${n(c)} = ${n(rho)}, so the total signal is (1 ÷ ${n(c)}) arctan ${n(rho)} ≈ ${f3(A)}. For the gain value, an antiderivative of ${n(m)} ÷ √(${n(s * s)} − x²) is ${n(m)} arcsin(x ÷ ${n(s)}), so it is ${n(m)} arcsin(${n(b)} ÷ ${n(s)}) − ${n(m)} arcsin 0 = ${n(m)} arcsin ${n(q)} ≈ ${f3(B)}.`,
  guidance: [
   { prompt: `Substitute u = x ÷ ${n(c)}. What is the new upper limit of the integral in u?`, answer: [rho], explanation: `At x = ${n(L)}, u = ${n(L)} ÷ ${n(c)} = ${n(rho)}. The integral becomes (1 ÷ ${n(c)}) ∫ from 0 to ${n(rho)} of 1 ÷ (1 + u²) du.` },
   { prompt: `The integral is (1 ÷ ${n(c)}) × (arctan ${n(rho)} − arctan 0). What is that to 3 decimal places?`, answer: [A], explanation: `arctan 0 = 0, so the total signal is arctan ${n(rho)} ÷ ${n(c)} ≈ ${f3(A)}.` },
   { prompt: `What is ${n(m)} × (arcsin(${n(b)} ÷ ${n(s)}) − arcsin 0), to 3 decimal places?`, answer: [B], explanation: `${n(b)} ÷ ${n(s)} = ${n(q)} and arcsin 0 = 0, so the value is ${n(m)} arcsin ${n(q)} ≈ ${f3(B)}.` }
  ] }; }
});

/* A feed of k ÷ (a² + t²) litres per minute, k = a·m: the net change is m·arctan(T ÷ a) with T ÷ a = rho. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'The slow valve',
 brief: 'A feed valve opens slowly, and the log needs the water it lets through and the level in the tank when the run ends.',
 labels: ['net change (L)', 'amount at the end (L)'], tolerance: 0.0005,
 gl: [['upper limit in u'], ['net change (L)'], ['amount at the end (L)']]
}, {
 canonical: { a: 5, m: 12, rho: 2, S: 120 },
 draw: R => { let p; do { p = { a: R.pick([2, 4, 5, 10]), m: R.int(2, 15), rho: R.pick([0.5, 1, 1.5, 2, 3]), S: 10 * R.int(5, 40) }; } while (p.a * p.rho !== Math.round(p.a * p.rho)); return p; },
 build: ({ a, m, rho, S }) => { const k = a * m, T = a * rho, N = r3(m * Math.atan(rho)), F = r3(S + m * Math.atan(rho)); return {
  prompt: `A feed valve on the settling tank opens slowly, so the flow it delivers is ${n(k)} ÷ (${n(a * a)} + t²) litres per minute, t minutes after it opened. The tank held ${n(S)} litres when the valve opened. Enter the net change in the amount of water from t = 0 to t = ${n(T)}, then the amount in the tank at t = ${n(T)}, both in litres to 3 decimal places.`,
  answer: [N, F],
  hints: [`The net change is the integral of the rate. Write ${n(a * a)} + t² as ${n(a * a)}(1 + (t ÷ ${n(a)})²) and substitute u = t ÷ ${n(a)}, so dt = ${n(a)} du.`, 'The amount at the end is the amount at the start plus the net change. Set your calculator to radians and round only at the end.'],
  solution: `With u = t ÷ ${n(a)}, dt = ${n(a)} du and ${n(k)} ÷ (${n(a * a)} + t²) dt = ${n(m)} du ÷ (1 + u²). The limits become u = 0 and u = ${n(T)} ÷ ${n(a)} = ${n(rho)}, so the net change is ${n(m)} arctan ${n(rho)} ≈ ${f3(N)} litres. By the Net Change Theorem the tank then holds ${n(S)} + ${f3(N)} = ${f3(F)} litres.`,
  guidance: [
   { prompt: `Substitute u = t ÷ ${n(a)}. What is the new upper limit of the integral in u?`, answer: [rho], explanation: `At t = ${n(T)}, u = ${n(T)} ÷ ${n(a)} = ${n(rho)}. The lower limit stays 0.` },
   { prompt: `The integral becomes ${n(m)} ∫ from 0 to ${n(rho)} of 1 ÷ (1 + u²) du = ${n(m)} arctan ${n(rho)}. What is the net change in litres, to 3 decimal places?`, answer: [N], explanation: `${n(m)} arctan ${n(rho)} ≈ ${f3(N)} litres.` },
   { prompt: `The tank held ${n(S)} litres at the start. How many litres does it hold at t = ${n(T)}, to 3 decimal places?`, answer: [F], explanation: `${n(S)} + ${f3(N)} = ${f3(F)} litres.` }
  ] }; }
});

/* ∫ from 0 to L of x ÷ (a² + x⁴) dx with u = x²: (1 ÷ 2) ∫ from 0 to L² of du ÷ (a² + u²) = (1 ÷ 2a) arctan(L² ÷ a). */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q04', title: 'The roof turret',
 brief: 'A camera turret on the reservoir wall turns faster the further it travels along its rail, and its controller needs the total angle.',
 labels: ['upper limit in u', 'angle turned (rad)'], tolerance: 0.0005,
 gl: [['upper limit in u'], ['upper limit in v'], ['angle turned (rad)']]
}, {
 canonical: { a: 4, L: 3 },
 draw: R => ({ a: R.pick([2, 4, 5, 8, 10]), L: R.int(2, 6) }),
 build: ({ a, L }) => { const L2 = L * L, w = rd(L2 / a), V = r3(Math.atan(w) / (2 * a)); return {
  prompt: `A camera turret on the reservoir wall turns at x ÷ (${n(a * a)} + x⁴) radians per metre when it is x metres along its rail. Enter the angle it turns through from x = 0 to x = ${n(L)}, which is ∫ from 0 to ${n(L)} of x ÷ (${n(a * a)} + x⁴) dx. Use the substitution u = x²: enter the new upper limit in u first, then the angle in radians to 3 decimal places.`,
  answer: [L2, V],
  hints: [`With u = x², du = 2x dx, so x dx = du ÷ 2, and x⁴ = u². The limits change too: they are the values of u = x² at x = 0 and x = ${n(L)}.`, `The new integral is half of ∫ du ÷ (${n(a * a)} + u²). Take ${n(a * a)} out and use v = u ÷ ${n(a)}, or use the arctan rule directly: the factor in front is 1 ÷ ${n(a)}.`],
  solution: `With u = x², du = 2x dx, so x dx = du ÷ 2 and x⁴ = u². The limits become u = 0 and u = ${n(L)}² = ${n(L2)}. The angle is (1 ÷ 2) ∫ from 0 to ${n(L2)} of du ÷ (${n(a * a)} + u²). With v = u ÷ ${n(a)} this is (1 ÷ 2)(1 ÷ ${n(a)}) arctan(${n(L2)} ÷ ${n(a)}) = arctan ${n(w)} ÷ ${n(2 * a)} ≈ ${f3(V)} radians.`,
  guidance: [
   { prompt: `With u = x², what is the new upper limit when x = ${n(L)}?`, answer: [L2], explanation: `u = ${n(L)}² = ${n(L2)}. The integral becomes (1 ÷ 2) ∫ from 0 to ${n(L2)} of du ÷ (${n(a * a)} + u²).` },
   { prompt: `Now put v = u ÷ ${n(a)} into (1 ÷ 2) ∫ from 0 to ${n(L2)} of du ÷ (${n(a * a)} + u²). What is the new upper limit in v?`, answer: [w], explanation: `v = ${n(L2)} ÷ ${n(a)} = ${n(w)}. The integral becomes (1 ÷ ${n(2 * a)}) ∫ from 0 to ${n(w)} of dv ÷ (1 + v²).` },
   { prompt: `What is (1 ÷ ${n(2 * a)}) × arctan ${n(w)}, in radians to 3 decimal places?`, answer: [V], explanation: `arctan ${n(w)} ÷ ${n(2 * a)} ≈ ${f3(V)} radians.` }
  ] }; }
});

/* ---- q07 Area between two curves [2.1] ---- */

/* Parabola y = −a x² + Bx + C above the line y = m x + k, meeting at x = r and x = s: parabola − line = −a(x − r)(x − s).
   a = 6, or a = 3 with s − r even, keeps the antiderivative's coefficients whole; area a(s − r)³ ÷ 6. */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The heat-shield panel',
 brief: 'A heat-shield panel is bounded by an arched top edge and a straight bottom edge, and the foundry needs its area before it orders the ceramic.',
 labels: ['left meeting x', 'right meeting x', 'area (m²)'], tolerance: 0.01,
 gl: [['left meeting x', 'right meeting x'], ['P at the left end', 'P at the right end'], ['area (m²)']]
}, {
 canonical: { a: 6, r: -2, s: 2, m: 3, k: -5 },
 draw: R => { const a = R.pick([3, 6]), r = R.int(-4, 1); return { a, r, s: r + (a === 3 ? R.pick([2, 4]) : R.int(2, 4)), m: R.pick([-3, -2, -1, 1, 2, 3, 4]), k: R.int(-6, 8) }; },
 build: ({ a, r, s, m, k }) => { const B = m + a * (r + s), C = k - a * r * s, P = x => -(a / 3) * cub(x) + (a * (r + s) / 2) * x * x - a * r * s * x, Pr = P(r), Ps = P(s), area = Ps - Pr,
  top = poly([-a, B, C], 'x'), line = poly([m, k], 'x'), eq = poly([a, -a * (r + s), a * r * s], 'x'), D = poly([-a, a * (r + s), -a * r * s], 'x'), Pt = poly([-a / 3, a * (r + s) / 2, -a * r * s, 0], 'x'); return {
  prompt: `The foundry cuts a heat-shield panel between the arched top edge y = ${top} and the straight bottom edge y = ${line}, with x and y in metres. Enter the two x-values where the two edges meet, smaller first, then the area of the panel in square metres.`,
  answer: [r, s, area],
  hints: ['Set the two formulas equal and move every term to one side. The quadratic you get factorises.', 'Between the meeting points the arch is above the straight edge. The area is the integral of (top − bottom), the arch minus the straight edge, from the smaller meeting point to the larger.'],
  solution: `Setting ${top} = ${line} and moving every term to one side gives ${eq} = 0, which is ${facs(a, r, s, 'x')} = 0, so the edges meet at x = ${n(r)} and x = ${n(s)}. Between them the arch is on top, and arch minus straight edge is ${D}. An antiderivative is P(x) = ${Pt}. P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.`,
  guidance: [
   { prompt: `Solve ${top} = ${line}. At which two x-values do the edges meet? Smaller first.`, answer: [r, s], explanation: `Moving every term to one side gives ${eq} = 0, which factorises as ${facs(a, r, s, 'x')} = 0: x = ${n(r)} or x = ${n(s)}.` },
   { prompt: `Arch minus straight edge is ${D}, and an antiderivative is P(x) = ${Pt}. What are P(${n(r)}) and P(${n(s)})?`, answer: [Pr, Ps], explanation: `Putting the two meeting points into P(x) gives P(${n(r)}) = ${n(Pr)} and P(${n(s)}) = ${n(Ps)}.` },
   { prompt: `What is the area of the panel, P(${n(s)}) − P(${n(r)}), in square metres?`, answer: [area], explanation: `${n(Ps)} − ${par(Pr)} = ${n(area)} square metres. It is positive because the arch stays above the straight edge between the meeting points.` }
  ] }; }
});

/* y = a x² below and y = 2a r² − a x² above, meeting at x = ±r: area 8 a r³ ÷ 3, then mass at q kg per square metre. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'The lens reflector',
 brief: 'A lens-shaped reflector plate is cut between two arcs, and the foundry must know how much steel the order needs.',
 labels: ['meeting x (m)', 'area (m²)', 'steel (kg)'], tolerance: 0.01,
 gl: [['meeting x (m)'], ['area (m²)'], ['steel (kg)']]
}, {
 canonical: { a: 3, r: 2, q: 12 },
 draw: R => ({ a: R.pick([3, 6]), r: R.int(1, 4), q: R.pick([5, 8, 12, 15, 20]) }),
 build: ({ a, r, q }) => { const H = 2 * a * r * r, Pr = 4 * a * r * r * r / 3, area = 2 * Pr, mass = area * q, Pt = poly([-2 * a / 3, 0, H, 0], 'x'), D = `${n(H)} − ${poly([2 * a, 0, 0], 'x')}`; return {
  prompt: `A lens-shaped reflector plate is cut between two parabolic arcs, the lower one y = ${n(a)}x² and the upper one y = ${n(H)} − ${n(a)}x², with x and y in metres. The arcs meet at two points, one on each side of the y-axis. Enter the positive x-value where they meet, then the area of the plate in square metres, then the steel the foundry needs in kilograms at ${n(q)} kg for every square metre (type it without commas).`,
  answer: [r, area, mass],
  hints: ['Set the two formulas equal. The x² terms collect on one side and you are left with x² equal to a number.', 'Top minus bottom is the same either side of the y-axis, so integrate it from the negative meeting point to the positive one. The steel is the area times the kilograms per square metre.'],
  solution: `Setting ${n(a)}x² = ${n(H)} − ${n(a)}x² gives ${n(2 * a)}x² = ${n(H)}, so x² = ${n(r * r)} and the arcs meet at x = −${n(r)} and x = ${n(r)}. Top minus bottom is ${D}, with antiderivative P(x) = ${Pt}. P(${n(r)}) = ${n(Pr)} and P(−${n(r)}) = −${n(Pr)}, so the area is ${n(Pr)} + ${n(Pr)} = ${n(area)} square metres. The steel is ${n(area)} × ${n(q)} = ${n(mass)} kilograms.`,
  guidance: [
   { prompt: `Solve ${n(a)}x² = ${n(H)} − ${n(a)}x². What is the positive x-value?`, answer: [r], explanation: `${n(2 * a)}x² = ${n(H)} gives x² = ${n(r * r)}, so x = ${n(r)} (and −${n(r)} on the other side).` },
   { prompt: `Top minus bottom is ${D}, with antiderivative P(x) = ${Pt}. The area is P(${n(r)}) − P(−${n(r)}), which is twice P(${n(r)}). What is the area in square metres?`, answer: [area], explanation: `P(${n(r)}) = ${n(Pr)}, so the area is 2 × ${n(Pr)} = ${n(area)} square metres.` },
   { prompt: `The plate needs ${n(q)} kg of steel for every square metre. How many kilograms is that for ${n(area)} square metres?`, answer: [mass], explanation: `${n(area)} × ${n(q)} = ${n(mass)} kilograms.` }
  ] }; }
});

/* Lower arc y = α x² + b1 x + c1, upper arc = lower + d(−(x − r)(x − s)). Area d(s − r)³ ÷ 6, average gap d(s − r)² ÷ 6.
   d = 6, or d = 3 with s − r even, keeps the antiderivative whole. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q03', title: 'The baffle and its gap',
 brief: 'A cargo-bay baffle is cut between two arcs that open and close along its length, and the fitters want its area and its typical gap.',
 labels: ['area (m²)', 'average gap (m)'], tolerance: 0.01,
 gl: [['left meeting x', 'right meeting x'], ['area (m²)'], ['average gap (m)']]
}, {
 canonical: { al: 1, d: 3, r: -3, s: 1, b1: 2, c1: -1 },
 draw: R => { const d = R.pick([3, 6]), r = R.int(-4, 1); return { al: R.pick([1, 2]), d, r, s: r + (d === 3 ? R.pick([2, 4]) : R.int(2, 5)), b1: R.int(-4, 4), c1: R.int(-4, 5) }; },
 build: ({ al, d, r, s, b1, c1 }) => { const S = r + s, w = s - r, P = x => -(d / 3) * cub(x) + (d * S / 2) * x * x - d * r * s * x, Pr = P(r), Ps = P(s), area = Ps - Pr, avg = area / w,
  low = poly([al, b1, c1], 'x'), up = poly([al - d, b1 + d * S, c1 - d * r * s], 'x'), eq = poly([d, -d * S, d * r * s], 'x'), D = poly([-d, d * S, -d * r * s], 'x'), Pt = poly([-d / 3, d * S / 2, -d * r * s, 0], 'x'); return {
  prompt: `A cargo-bay baffle is cut between a lower arc y = ${low} and an upper arc y = ${up}, with x and y in metres. The arcs meet at two points, and between them the vertical gap between the arcs keeps changing. Enter the area of the baffle in square metres, then the average vertical gap between the arcs over that stretch, in metres.`,
  answer: [area, avg],
  hints: ['Set the two formulas equal and move every term to one side: the quadratic factorises. The upper arc minus the lower arc is the gap, and its integral between the meeting points is the area.', 'The average value of a function over an interval is its integral over the interval divided by the length of the interval. Here the function is the gap.'],
  solution: `Setting ${low} = ${up} and moving every term to one side gives ${eq} = 0, which is ${facs(d, r, s, 'x')} = 0, so the arcs meet at x = ${n(r)} and x = ${n(s)}. Between them the gap is upper minus lower, ${D}. An antiderivative is P(x) = ${Pt}. P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres. The average gap is the area divided by the length ${n(s)} − ${par(r)} = ${n(w)} of the stretch: ${n(area)} ÷ ${n(w)} = ${n(avg)} metres.`,
  guidance: [
   { prompt: `Solve ${low} = ${up}. At which two x-values do the arcs meet? Smaller first.`, answer: [r, s], explanation: `Moving every term to one side gives ${eq} = 0, which factorises as ${facs(d, r, s, 'x')} = 0: x = ${n(r)} or x = ${n(s)}.` },
   { prompt: `The gap is ${D}, with antiderivative P(x) = ${Pt}. What is the area, P(${n(s)}) − P(${n(r)}), in square metres?`, answer: [area], explanation: `P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.` },
   { prompt: `The stretch runs from x = ${n(r)} to x = ${n(s)}, so it is ${n(w)} metres long. What is the average gap, the area divided by that length?`, answer: [avg], explanation: `${n(area)} ÷ ${n(w)} = ${n(avg)} metres.` }
  ] }; }
});

/* ---- q08 Curves that swap places; slicing along y [2.1] ---- */

/* Right edge x = e − a y² (opens left), left edge x = m y + k, meeting at y = r and y = s: right − left = −a(y − r)(y − s),
   m = −a(r + s), e = k − a r s. Same whole-number rule as q07. */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'The vent baffle',
 brief: 'A vent baffle lies on its side between a slanted edge and a curved one, and the foundry needs its area for the steel order.',
 labels: ['lower meeting y', 'upper meeting y', 'area (m²)'], tolerance: 0.01,
 gl: [['lower meeting y', 'upper meeting y'], ['P at the lower end', 'P at the upper end'], ['area (m²)']]
}, {
 canonical: { a: 3, r: -3, s: 1, k: 2 },
 draw: R => { const a = R.pick([3, 6]), r = R.int(-4, 1); return { a, r, s: r + (a === 3 ? R.pick([2, 4]) : R.int(2, 4)), k: R.int(-5, 5) }; },
 build: ({ a, r, s, k }) => { const m = -a * (r + s), e = k - a * r * s, P = y => -(a / 3) * cub(y) + (a * (r + s) / 2) * y * y - a * r * s * y, Pr = P(r), Ps = P(s), area = Ps - Pr,
  left = poly([m, k], 'y'), right = poly([-a, 0, e], 'y'), eq = poly([a, -a * (r + s), a * r * s], 'y'), D = poly([-a, a * (r + s), -a * r * s], 'y'), Pt = poly([-a / 3, a * (r + s) / 2, -a * r * s, 0], 'y'); return {
  prompt: `A vent baffle is cut from the flat region between the straight edge x = ${left} on the left and the curved edge x = ${right} on the right, in metres. Slice it along y into horizontal strips. Enter the two y-values where the edges meet, lower first, then the area of the baffle in square metres.`,
  answer: [r, s, area],
  hints: ['Each horizontal strip runs from the straight edge on the left to the curved edge on the right, so its length is (right − left), written in y.', 'Set the two formulas equal to find the y-values where the strips start and stop, then integrate the strip length between them with respect to y.'],
  solution: `Setting ${left} = ${right} and moving every term to one side gives ${eq} = 0, which is ${facs(a, r, s, 'y')} = 0, so the edges meet at y = ${n(r)} and y = ${n(s)}. Each horizontal strip between them runs from x = ${left} on the left to x = ${right} on the right, so its length is ${D}. An antiderivative is P(y) = ${Pt}. P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.`,
  guidance: [
   { prompt: `Solve ${left} = ${right}. At which two y-values do the edges meet? Lower first.`, answer: [r, s], explanation: `Moving every term to one side gives ${eq} = 0, which factorises as ${facs(a, r, s, 'y')} = 0, so y = ${n(r)} or y = ${n(s)}.` },
   { prompt: `A strip at height y runs from x = ${left} to x = ${right}, so its length is ${D}, with antiderivative P(y) = ${Pt}. What are P(${n(r)}) and P(${n(s)})?`, answer: [Pr, Ps], explanation: `Putting the two heights into P(y) gives P(${n(r)}) = ${n(Pr)} and P(${n(s)}) = ${n(Ps)}.` },
   { prompt: `What is the area of the baffle, P(${n(s)}) − P(${n(r)}), in square metres?`, answer: [area], explanation: `${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.` }
  ] }; }
});

/* Curve x = a y² and the vertical edge x = a r² meet at y = ±r: strip length a r² − a y², area 4 a r³ ÷ 3, then sealant at q litres per square metre. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The window frame',
 brief: 'A bulkhead window frame is cut from a sheet, and the sealing crew needs to know how much sealant to bring.',
 labels: ['meeting y (m)', 'area (m²)', 'sealant (L)'], tolerance: 0.01,
 gl: [['meeting y (m)'], ['area (m²)'], ['sealant (L)']]
}, {
 canonical: { a: 3, r: 2, q: 4 },
 draw: R => ({ a: R.pick([3, 6, 9]), r: R.int(1, 4), q: R.int(2, 5) }),
 build: ({ a, r, q }) => { const H = a * r * r, Pr = 2 * a * r * r * r / 3, area = 2 * Pr, litres = area * q, Pt = poly([-a / 3, 0, H, 0], 'y'), D = `${n(H)} − ${poly([a, 0, 0], 'y')}`; return {
  prompt: `A bulkhead window frame is cut from the flat region between the curve x = ${n(a)}y² and the straight vertical edge x = ${n(H)}, in metres. Slice it along y into horizontal strips. Enter the positive y-value where the curve meets the edge, then the area of the frame in square metres, then the litres of sealant needed at ${n(q)} litres for every square metre (type it without commas).`,
  answer: [r, area, litres],
  hints: ['Where the curve meets the vertical edge, the two values of x are equal: write that as an equation in y. There is one positive and one negative solution.', 'Each strip runs from the curve on the left to the edge on the right, so its length is the edge minus the curve. Integrate it from the negative y to the positive y. The sealant is the area times the litres per square metre.'],
  solution: `Setting ${n(a)}y² = ${n(H)} gives y² = ${n(r * r)}, so the curve meets the edge at y = −${n(r)} and y = ${n(r)}. Each strip between them runs from x = ${n(a)}y² to x = ${n(H)}, so its length is ${D}. An antiderivative is P(y) = ${Pt}. P(${n(r)}) = ${n(Pr)} and P(−${n(r)}) = −${n(Pr)}, so the area is ${n(Pr)} + ${n(Pr)} = ${n(area)} square metres. The sealant is ${n(area)} × ${n(q)} = ${n(litres)} litres.`,
  guidance: [
   { prompt: `Solve ${n(a)}y² = ${n(H)}. What is the positive y-value?`, answer: [r], explanation: `y² = ${n(r * r)}, so y = ${n(r)} (and −${n(r)} below the middle).` },
   { prompt: `The strip length is ${D}, with antiderivative P(y) = ${Pt}. The area is P(${n(r)}) − P(−${n(r)}), which is twice P(${n(r)}). What is the area in square metres?`, answer: [area], explanation: `P(${n(r)}) = ${n(Pr)}, so the area is 2 × ${n(Pr)} = ${n(area)} square metres.` },
   { prompt: `The frame needs ${n(q)} litres of sealant for every square metre. How many litres is that for ${n(area)} square metres?`, answer: [litres], explanation: `${n(area)} × ${n(q)} = ${n(litres)} litres.` }
  ] }; }
});

/* Left edge x = α y² + b1 y + c1, right edge = left + d(−(y − r)(y − s)): area d(s − r)³ ÷ 6; the strips are longest halfway,
   at y = (r + s) ÷ 2, where the length is d((s − r) ÷ 2)². */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', title: 'The widest strip',
 brief: 'A curved fin lies between two sideways arcs, and the fitters want its area and the length of its longest strip.',
 labels: ['area (m²)', 'longest strip (m)'], tolerance: 0.01,
 gl: [['lower meeting y', 'upper meeting y'], ['area (m²)'], ['y of the longest strip', 'longest strip (m)']]
}, {
 canonical: { al: 2, d: 3, r: -2, s: 2, b1: 1, c1: -3 },
 draw: R => { const d = R.pick([3, 6]), r = R.int(-4, 1); return { al: R.pick([1, 2]), d, r, s: r + (d === 3 ? R.pick([2, 4]) : R.int(2, 5)), b1: R.int(-4, 4), c1: R.int(-5, 5) }; },
 build: ({ al, d, r, s, b1, c1 }) => { const S = r + s, w = s - r, P = y => -(d / 3) * cub(y) + (d * S / 2) * y * y - d * r * s * y, Pr = P(r), Ps = P(s), area = Ps - Pr, ym = S / 2, longest = d * (w / 2) * (w / 2),
  left = poly([al, b1, c1], 'y'), right = poly([al - d, b1 + d * S, c1 - d * r * s], 'y'), eq = poly([d, -d * S, d * r * s], 'y'), D = poly([-d, d * S, -d * r * s], 'y'), Pt = poly([-d / 3, d * S / 2, -d * r * s, 0], 'y'); return {
  prompt: `A curved fin is cut from the flat region between the left edge x = ${left} and the right edge x = ${right}, in metres. Slice it along y into horizontal strips. Enter the area of the fin in square metres, then the length in metres of the longest strip.`,
  answer: [area, longest],
  hints: ['Set the two formulas equal and move every term to one side: the quadratic factorises and gives the y-values where the strips start and stop. A strip is as long as right minus left.', 'The strip length is a quadratic in y that opens downwards, so it is longest where its derivative is zero, which is halfway between the two meeting heights.'],
  solution: `Setting ${left} = ${right} and moving every term to one side gives ${eq} = 0, which is ${facs(d, r, s, 'y')} = 0, so the edges meet at y = ${n(r)} and y = ${n(s)}. A strip between them has length right minus left, ${D}. An antiderivative is P(y) = ${Pt}. P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres. The strip length has derivative ${poly([-2 * d, d * S], 'y')}, which is zero at y = ${n(ym)}, halfway between ${n(r)} and ${n(s)}. There the length is ${n(longest)} metres.`,
  guidance: [
   { prompt: `Solve ${left} = ${right}. At which two y-values do the edges meet? Lower first.`, answer: [r, s], explanation: `Moving every term to one side gives ${eq} = 0, which factorises as ${facs(d, r, s, 'y')} = 0, so y = ${n(r)} or y = ${n(s)}.` },
   { prompt: `A strip at height y has length ${D}, with antiderivative P(y) = ${Pt}. What is the area, P(${n(s)}) − P(${n(r)}), in square metres?`, answer: [area], explanation: `P(${n(s)}) = ${n(Ps)} and P(${n(r)}) = ${n(Pr)}, so the area is ${n(Ps)} − ${par(Pr)} = ${n(area)} square metres.` },
   { prompt: `The strip length ${D} is largest where its derivative ${poly([-2 * d, d * S], 'y')} is zero. At what y is that, and how long is the strip there?`, answer: [ym, longest], explanation: `${poly([-2 * d, d * S], 'y')} = 0 gives y = ${n(ym)}, halfway between ${n(r)} and ${n(s)}. Putting that into the strip length gives ${n(longest)} metres.` }
  ] }; }
});

/* ---- q09 Volume by slicing with known cross-sections [2.2] ---- */

/* Base under y = k x² from 0 to L; rectangles with one side across the base and the other c tall: A(x) = c k x², V = c k L³ ÷ 3. k = 3 or 6. */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'The support strut',
 brief: 'A support strut is cast with a flat rectangular cross-section that grows along its length, and the foundry wants its volume.',
 labels: ['end slice area (m²)', 'volume (m³)'], tolerance: 0.005,
 gl: [['c'], ['end slice area (m²)'], ['volume (m³)']]
}, {
 canonical: { k: 3, L: 4, c: 2 },
 draw: R => ({ k: R.pick([3, 6]), L: R.int(2, 5), c: R.int(2, 5) }),
 build: ({ k, L, c }) => { const C = c * k, AL = C * L * L, V = C * L * L * L / 3, Ax = poly([C, 0, 0], 'x'), w = poly([k, 0, 0], 'x'); return {
  prompt: `A support strut is cast on the floor region bounded by the x-axis, the line x = ${n(L)} and the curve y = ${w}, in metres. Every cross-section perpendicular to the x-axis is a rectangle standing on the floor, with one side running across the base and the other side ${n(c)} metres tall. Enter the area of the cross-section at x = ${n(L)} in square metres, then the volume of the strut in cubic metres (type it without commas).`,
  answer: [AL, V],
  hints: ['At position x, the side across the base runs from the x-axis up to the curve, so its length is the height of the curve there. The other side is the fixed height.', 'The rectangle\'s area A(x) is one side times the other. The volume is the integral of A(x) from 0 to the end of the base.'],
  solution: `At position x the side across the base is ${w} metres and the other side is ${n(c)} metres, so the cross-section has area A(x) = ${n(c)} × ${w} = ${Ax} square metres. At x = ${n(L)} that is ${n(C)} × ${n(L * L)} = ${n(AL)} square metres. The volume is ∫ from 0 to ${n(L)} of ${Ax} dx = ${n(C / 3)} × ${n(L)}³ − 0 = ${n(C / 3)} × ${n(L * L * L)} = ${n(V)} cubic metres.`,
  guidance: [
   { prompt: `The cross-section at position x has area A(x) = cx². What is c?`, answer: [C], explanation: `The side across the base is ${w} and the other side is ${n(c)}, so A(x) = ${Ax}: c = ${n(C)}.` },
   { prompt: `What is the area of the cross-section at x = ${n(L)}?`, answer: [AL], explanation: `A(${n(L)}) = ${n(C)} × ${n(L)}² = ${n(AL)} square metres.` },
   { prompt: `The volume is ∫ from 0 to ${n(L)} of ${Ax} dx. What is it, in cubic metres?`, answer: [V], explanation: `An antiderivative of ${Ax} is ${poly([C / 3, 0, 0, 0], 'x')}, so the volume is ${n(C / 3)} × ${n(L * L * L)} = ${n(V)} cubic metres.` }
  ] }; }
});

/* Base between y = m x and y = x² (from x = 0 to x = m); squares with side m x − x²: A(1) = (m − 1)², V = m⁵ ÷ 30, mass q·V. m = 3 or 6. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'The cast bracket',
 brief: 'A heavy bracket is cast over a curved base, and the crane crew needs its weight before they lift it.',
 labels: ['slice area at x = 1 (m²)', 'volume (m³)', 'mass (tonnes)'], tolerance: 0.005,
 gl: [['side at x = 1 (m)'], ['volume (m³)'], ['mass (tonnes)']]
}, {
 canonical: { m: 3, q: 2 },
 /* m a multiple of 3 keeps m⁵ ÷ 30 a short decimal; a density in halves keeps the mass to 2 places. */
 draw: R => ({ m: R.pick([3, 6, 9]), q: R.pick([2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9]) }),
 build: ({ m, q }) => { const m5 = Math.pow(m, 5), V = rd(m5 / 30), mass = rd(V * q), A1 = (m - 1) * (m - 1), side = poly([1, 0, 0], 'x'); return {
  prompt: `A bracket is cast on the floor region between the line y = ${n(m)}x and the curve y = x², in metres. Every cross-section perpendicular to the x-axis is a square standing on the floor, with one side running across the base from the curve up to the line. Enter the area of the cross-section at x = 1 in square metres, then the volume of the bracket in cubic metres, then its mass in tonnes if the cast metal has a mass of ${n(q)} tonnes per cubic metre (type it without commas).`,
  answer: [A1, V, mass],
  hints: ['The side of the square at position x runs from the curve up to the line, so it is the line minus the curve. The line and the curve meet where their formulas are equal: that gives the two ends of the base.', 'The area A(x) is the side squared. Expand it, then integrate from the left end of the base to the right end. The mass is the volume times the tonnes per cubic metre.'],
  solution: `At position x the side is ${n(m)}x − x², so A(x) = (${n(m)}x − x²)² = ${poly([1, -2 * m, m * m, 0, 0], 'x')}. At x = 1 that is (${n(m)} − 1)² = ${n(A1)} square metres. The line and the curve meet where ${n(m)}x = x², at x = 0 and x = ${n(m)}. The volume is the integral from 0 to ${n(m)}, with antiderivative ${n(m * m)}x³ ÷ 3 − ${n(m)}x⁴ ÷ 2 + x⁵ ÷ 5. At x = ${n(m)} that is ${n(rd(m5 / 3))} − ${n(rd(m5 / 2))} + ${n(rd(m5 / 5))} = ${n(V)} cubic metres. The mass is ${n(V)} × ${n(q)} = ${n(mass)} tonnes.`,
  guidance: [
   { prompt: `The side of the square at position x is ${n(m)}x − x². What is its length at x = 1?`, answer: [m - 1], explanation: `${n(m)} × 1 − 1² = ${n(m - 1)} metres, so the square at x = 1 has area ${n(A1)} square metres.` },
   { prompt: `The area is A(x) = ${poly([1, -2 * m, m * m, 0, 0], 'x')} and the base runs from x = 0 to x = ${n(m)}. What is the volume in cubic metres?`, answer: [V], explanation: `An antiderivative is ${n(m * m)}x³ ÷ 3 − ${n(m)}x⁴ ÷ 2 + x⁵ ÷ 5, which at x = ${n(m)} is ${n(rd(m5 / 3))} − ${n(rd(m5 / 2))} + ${n(rd(m5 / 5))} = ${n(V)}.` },
   { prompt: `The metal has a mass of ${n(q)} tonnes per cubic metre. What is the mass of ${n(V)} cubic metres, in tonnes?`, answer: [mass], explanation: `${n(V)} × ${n(q)} = ${n(mass)} tonnes.` }
  ] }; }
});

/* Base under y = k ÷ √(a² + x²) from 0 to L; square slices: A(x) = k² ÷ (a² + x²), V = (k² ÷ a) arctan(L ÷ a). (a, L) are the legs of a whole-number right triangle with L ÷ a a short decimal, and k is a multiple of √(a² + L²),
   so the end slice area is a whole number and L ÷ a is a short decimal. */
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q06', title: 'The tapering mast',
 brief: 'A signal mast is cast with a base that thins out along its length, and the foundry needs the metal for it.',
 labels: ['end slice area (m²)', 'volume (m³)'], tolerance: 0.0005,
 gl: [['end slice area (m²)'], ['upper limit in u'], ['volume (m³)']]
}, {
 canonical: { k: 10, a: 4, L: 3 },
 draw: R => { const [k, a, L] = R.pick([[5, 4, 3], [10, 4, 3], [15, 4, 3], [20, 4, 3], [25, 4, 3], [10, 8, 6], [20, 8, 6], [30, 8, 6], [15, 12, 9], [30, 12, 9], [20, 16, 12], [40, 16, 12], [13, 5, 12], [26, 5, 12], [39, 5, 12], [26, 10, 24], [17, 8, 15], [34, 8, 15], [29, 20, 21], [58, 20, 21], [41, 40, 9]]); return { k, a, L }; },
 build: ({ k, a, L }) => { const den = a * a + L * L, AL = rd(k * k / den), rho = rd(L / a), V = r3(k * k / a * Math.atan(L / a)); return {
  prompt: `A signal mast is cast on the floor region bounded by the x-axis, the line x = ${n(L)}, the y-axis and the curve y = ${n(k)} ÷ √(${n(a * a)} + x²), in metres. Every cross-section perpendicular to the x-axis is a square standing on the floor, with one side running across the base. Enter the area of the cross-section at x = ${n(L)} in square metres, then the volume of the mast in cubic metres to 3 decimal places.`,
  answer: [AL, V],
  hints: ['The side of the square at position x is the height of the curve there, so the area A(x) is that height squared. The square root disappears when you square it.', `The volume is the integral of A(x) from 0 to ${n(L)}. It has the form of an arctan integral: take ${n(a * a)} out of the bottom and substitute u = x ÷ ${n(a)}, remembering the factor 1 ÷ ${n(a)}.`],
  solution: `At position x the side is ${n(k)} ÷ √(${n(a * a)} + x²), so A(x) = ${n(k * k)} ÷ (${n(a * a)} + x²). At x = ${n(L)} that is ${n(k * k)} ÷ ${n(den)} = ${n(AL)} square metres. The volume is ∫ from 0 to ${n(L)} of ${n(k * k)} ÷ (${n(a * a)} + x²) dx. With u = x ÷ ${n(a)} the limits become 0 and ${n(L)} ÷ ${n(a)} = ${n(rho)}, and the integral is (${n(k * k)} ÷ ${n(a)}) arctan ${n(rho)} ≈ ${f3(V)} cubic metres.`,
  guidance: [
   { prompt: `The side at position x is ${n(k)} ÷ √(${n(a * a)} + x²). What is the area of the cross-section at x = ${n(L)}, in square metres?`, answer: [AL], explanation: `The area is the side squared, ${n(k * k)} ÷ (${n(a * a)} + ${n(L * L)}) = ${n(k * k)} ÷ ${n(den)} = ${n(AL)} square metres.` },
   { prompt: `The volume is ∫ from 0 to ${n(L)} of ${n(k * k)} ÷ (${n(a * a)} + x²) dx. Substitute u = x ÷ ${n(a)}. What is the new upper limit in u?`, answer: [rho], explanation: `u = ${n(L)} ÷ ${n(a)} = ${n(rho)}. The integral becomes (${n(k * k)} ÷ ${n(a)}) ∫ from 0 to ${n(rho)} of 1 ÷ (1 + u²) du.` },
   { prompt: `What is (${n(k * k)} ÷ ${n(a)}) × arctan ${n(rho)}, in cubic metres to 3 decimal places?`, answer: [V], explanation: `arctan ${n(rho)} − arctan 0 = arctan ${n(rho)}, so the volume is ${n(k * k)} ÷ ${n(a)} × arctan ${n(rho)} ≈ ${f3(V)} cubic metres.` }
  ] }; }
});

/* ---- q10 Discs and washers [2.2] ---- */

/* Region between y = a x² and y = H = a c² for x from 0 to c, about the x-axis: washers R = H, r = a x², k = 4 a² c⁵ ÷ 5. */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The mounting ring',
 brief: 'The foundry turns a flat template on a spindle to make a mounting ring, and Mira needs the volume of metal it sweeps out.',
 labels: ['meeting x', 'k'], tolerance: 0.00005,
 gl: [['meeting x'], ['integral of the inner part'], ['k']]
}, {
 canonical: { a: 2, c: 2 },
 draw: R => ({ a: R.int(1, 4), c: R.int(1, 5) }),
 build: ({ a, c }) => { const H = a * c * c, c5 = Math.pow(c, 5), I2 = a * a * c5 / 5, k = rd(4 * a * a * c5 / 5), ks = frac(4 * a * a * c5, 5), is = frac(a * a * c5, 5), par1 = poly([a, 0, 0], 'x'), par4 = poly([a * a, 0, 0, 0, 0], 'x'); return {
  prompt: `The foundry spins the flat region between the parabola y = ${par1} and the line y = ${n(H)} (in metres), for x ≥ 0, about the x-axis to make a mounting ring. Enter the x-value where the parabola meets the line, then the volume of the ring as k·π cubic metres: enter k (a fraction or a decimal is fine, without commas).`,
  answer: [c, k],
  hints: ['A slice across the x-axis is a washer: a disc of radius R with a disc of radius r cut out of its middle, so its area is π(R² − r²).', `Here the line is the outer edge, so R = ${n(H)}, and the parabola is the inner edge, so r = ${par1}. Integrate π(R² − r²) from 0 to the meeting point.`],
  solution: `${par1} = ${n(H)} at x = ${n(c)} (taking x ≥ 0). On the interval from 0 to ${n(c)} the outer radius is R = ${n(H)} and the inner radius is r = ${par1}, so each washer has area π(${n(H * H)} − ${par4}). The volume is π ∫ from 0 to ${n(c)} of (${n(H * H)} − ${par4}) dx = π(${n(H * H * c)} − ${is}) = ${kpi(ks)} cubic metres, so k = ${ks}.`,
  guidance: [
   { prompt: `Solve ${par1} = ${n(H)} for x ≥ 0. Where does the parabola meet the line?`, answer: [c], explanation: `x² = ${n(c * c)}, so x = ${n(c)}.` },
   { prompt: `The washer area is π(${n(H * H)} − ${par4}). What is ∫ from 0 to ${n(c)} of ${par4} dx? A fraction is fine.`, answer: [I2], explanation: `An antiderivative is ${poly([a * a, 0, 0, 0, 0, 0], 'x')} ÷ 5, which at x = ${n(c)} is ${is}.` },
   { prompt: `∫ from 0 to ${n(c)} of ${n(H * H)} dx = ${n(H * H * c)}. What is k, the number in front of π in the volume?`, answer: [k], explanation: `k = ${n(H * H * c)} − ${is} = ${ks}.` }
  ] }; }
});

/* Bowl: y = a x² up to the rim y = H = a c², spun about the y-axis: discs of radius √(y ÷ a), k = H² ÷ 2a = a c⁴ ÷ 2, mass q·k·π. */
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The fuel bowl',
 brief: 'A fuel bowl is turned from a flat template, and the store keeper needs to know how much fuel it holds and what that weighs.',
 labels: ['rim radius (m)', 'k (volume)', 'm (mass)'], tolerance: 0.01,
 gl: [['rim radius (m)'], ['k (volume)'], ['m (mass)']]
}, {
 canonical: { a: 2, c: 3, q: 3 },
 draw: R => ({ a: R.pick([1, 2, 3]), c: R.int(2, 5), q: R.pick([2, 3, 4, 5]) }),
 build: ({ a, c, q }) => { const H = a * c * c, k = rd(a * c * c * c * c / 2), mm = rd(q * k), curve = poly([a, 0, 0], 'x'), disc = a === 1 ? 'y' : `y ÷ ${n(a)}`; return {
  prompt: `A fuel bowl is made by spinning the flat region between the curve y = ${curve} and the line y = ${n(H)} (in metres), for x ≥ 0, about the y-axis. The line is the rim, so the bowl is filled up to it. Enter the radius of the rim, then the volume of fuel the bowl holds as k·π cubic metres (enter k), then the mass of that fuel in tonnes as m·π at ${n(q)} tonnes per cubic metre (enter m). Type each number without commas.`,
  answer: [c, k, mm],
  hints: ['The rim is where the curve reaches the line. Its radius is the x-value there. A slice across the y-axis is a disc whose radius is the distance sideways from the y-axis to the curve, so write the curve as x in terms of y.', `Each disc has area π times the radius squared, so here π(${disc}). Integrate from y = 0 up to the rim height. For the mass, multiply k by the tonnes per cubic metre.`],
  solution: `The curve meets the line where ${curve} = ${n(H)}, at x = ${n(c)}, so the rim has radius ${n(c)} metres. At height y the curve is at x = ${a === 1 ? '√y' : `√(y ÷ ${n(a)})`}, so the disc there has area π(${disc}). The volume is π ∫ from 0 to ${n(H)} of (${disc}) dy = π × ${n(H)}² ÷ ${n(2 * a)} = ${n(k)}π cubic metres, so k = ${n(k)}. At ${n(q)} tonnes per cubic metre the mass is ${n(q)} × ${n(k)}π = ${n(mm)}π tonnes, so m = ${n(mm)}.`,
  guidance: [
   { prompt: `Solve ${curve} = ${n(H)} for x ≥ 0. What is the radius of the rim?`, answer: [c], explanation: `x² = ${n(c * c)}, so x = ${n(c)} metres.` },
   { prompt: `A disc at height y has area π(${disc}). What is ∫ from 0 to ${n(H)} of (${disc}) dy, the number k in front of π?`, answer: [k], explanation: `An antiderivative is y² ÷ ${n(2 * a)}, which at y = ${n(H)} is ${n(H * H)} ÷ ${n(2 * a)} = ${n(k)}.` },
   { prompt: `The fuel has a volume of ${n(k)}π cubic metres, at ${n(q)} tonnes per cubic metre. What is m in the mass mπ?`, answer: [mm], explanation: `${n(q)} × ${n(k)} = ${n(mm)}, so the mass is ${n(mm)}π tonnes.` }
  ] }; }
});

/* Line y = (r + s)x − r s and the curve y = x², meeting at x = r and x = s, both above the x-axis between them; about the x-axis. R = line, r = x². k = N ÷ 15. */
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q07', title: 'The thrust collar',
 brief: 'A thrust collar is turned from a template that floats clear of the spindle, and Mira needs the metal it takes.',
 labels: ['left meeting x', 'right meeting x', 'k'], tolerance: 0.00005,
 gl: [['left meeting x', 'right meeting x'], ['integral of the outer part'], ['k']]
}, {
 canonical: { r: 1, s: 3 },
 draw: R => { const r = R.int(1, 5); return { r, s: r + R.int(1, 4) }; },
 build: ({ r, s }) => { const S = r + s, Pq = r * s, line = poly([S, -Pq], 'x'),
  F = x => 5 * S * S * cub(x) - 15 * S * Pq * x * x + 15 * Pq * Pq * x - 3 * Math.pow(x, 5), N = F(s) - F(r), k = N / 15,
  outer = F(s) - F(r) + 3 * (Math.pow(s, 5) - Math.pow(r, 5)), Ia = frac(outer, 15), Ib = frac(3 * (Math.pow(s, 5) - Math.pow(r, 5)), 15),
  expand = poly([-1, 0, S * S, -2 * S * Pq, Pq * Pq], 'x'), outerPoly = poly([S * S, -2 * S * Pq, Pq * Pq], 'x'), ks = frac(N, 15), Fs = frac(F(s), 15), Fr = frac(F(r), 15), Fx = `${n(S * S)}x³ ÷ 3 − ${n(S * Pq)}x² + ${n(Pq * Pq)}x − x⁵ ÷ 5`; return {
  prompt: `The foundry spins the flat region between the line y = ${line} and the curve y = x² (in metres) about the x-axis to make a thrust collar. The region does not touch the axis. Enter the two x-values where the line meets the curve, smaller first, then the volume of the collar as k·π cubic metres: enter k (a fraction such as 7/15 is fine, or a decimal to 4 places; type any whole part without commas).`,
  answer: [r, s, k],
  hints: ['Set the line equal to the curve and move every term to one side: the quadratic factorises. Between the two meeting points the line is above the curve.', 'Both edges are above the x-axis there, so a slice is a washer with outer radius R = the line and inner radius r = x². Expand the square of the line before you integrate.'],
  solution: `Setting x² = ${line} gives ${poly([1, -S, Pq], 'x')} = 0, which is ${facs(1, r, s, 'x')} = 0, so the line meets the curve at x = ${n(r)} and x = ${n(s)}. Between them the line is on top, so the outer radius is R = ${line} and the inner radius is r = x². Each washer has area π(${expand}). An antiderivative of ${expand} is ${Fx}. At x = ${n(s)} it is ${Fs} and at x = ${n(r)} it is ${Fr}, so k = ${Fs} − ${pf(Fr)} = ${ks}.`,
  guidance: [
   { prompt: `Solve x² = ${line}. At which two x-values do the line and the curve meet? Smaller first.`, answer: [r, s], explanation: `Moving every term to one side gives ${poly([1, -S, Pq], 'x')} = 0, which factorises as ${facs(1, r, s, 'x')} = 0: x = ${n(r)} or x = ${n(s)}.` },
   { prompt: `The washer area is π[(${line})² − x⁴] = π(${expand}). What is ∫ from ${n(r)} to ${n(s)} of (${outerPoly}) dx, the part from the line? A fraction is fine.`, answer: [outer / 15], explanation: `An antiderivative is ${n(S * S)}x³ ÷ 3 − ${n(S * Pq)}x² + ${n(Pq * Pq)}x. Taking it at x = ${n(s)} minus at x = ${n(r)} gives ${Ia}.` },
   { prompt: `∫ from ${n(r)} to ${n(s)} of x⁴ dx = ${Ib}. What is k, the number in front of π in the volume?`, answer: [k], explanation: `k = ${Ia} − ${Ib} = ${ks}.` }
  ] }; }
});

})();
