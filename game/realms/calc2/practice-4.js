/* Calculus 2: accumulation practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p4.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Helpers. practice(meta, stepLabels, generator) registers a mission through add(): its prompt, answers, hints,
   solution and guided steps are build(canonical) itself (cleaned as the engine cleans them), so the authored text
   and the generator cannot drift apart. `meta` holds id, parent, kind, title, brief, labels, tolerance (and uses);
   `stepLabels` holds the answer labels of each guided step, in order. To read a mission as the player sees it:
   node qa/show-mission.js <id> --realm calc2
   Rounded answers: edge(x, k) is true when x sits so near a rounding tie at k places that a slightly different
   calculator path could round the other way; draws skip those. ok(x, k) is true when x has at most k decimals. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (p, q) => { const g = gcd(p, q), s = q < 0 ? -1 : 1; return [s * p / g, s * q / g]; };
const fr = (p, q) => { const [a, b] = red(p, q); return b === 1 ? n(a) : `${n(a)}/${n(b)}`; };
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => rd(x, k).toFixed(k);
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const ok = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-7;
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(d => SUP[d]).join('');
const co = (k, x) => k === 1 ? x : `${n(k)}${x}`;
const ep = b => b === 1 ? 'e' : 'e' + sup(b);
const BIN = { 1: [1, -1], 2: [1, -2, 1], 3: [1, -3, 3, -1] };
/* ∫ from u1 to 1 of uᵖ(1 − u²)ᵏ du term by term: each term c·u^j has value c(1 − u1^(j+1)) ÷ (j + 1). */
const powTerms = (p, k, u1) => BIN[k].map((c, i) => { const j = p + 2 * i, top = 1 - Math.pow(u1, j + 1); return { c, j, num: c * top, den: j + 1 }; });
const sumFr = terms => terms.reduce(([a, b], t) => red(a * t.den + t.num * b, b * t.den), [0, 1]);
const polyText = terms => terms.map((t, i) => `${i === 0 ? '' : t.c < 0 ? ' − ' : ' + '}${Math.abs(t.c) === 1 ? '' : n(Math.abs(t.c))}${t.j === 0 ? (Math.abs(t.c) === 1 ? '1' : '') : t.j === 1 ? 'u' : 'u' + sup(t.j)}`).join('');
const valsText = terms => terms.map((t, i) => `${i === 0 ? '' : t.num < 0 ? ' − ' : ' + '}${fr(Math.abs(t.num), t.den)}`).join('');
const upow = p => p === 0 ? '' : p === 1 ? 'u' : `u${sup(p)}`;
const pw = (fn, e) => e === 0 ? '' : e === 1 ? `${fn} x` : `${fn}${sup(e)}x`;
const practice = (meta, stepLabels, generator) => {
 const b = generator.build(generator.canonical), c = G.clean, t = G.tidy, { id, parent, kind, title, brief, labels, tolerance, uses } = meta;
 add({ id, parent, kind, title, brief, prompt: c(b.prompt), answer: b.answer.map(t), labels, tolerance,
  hints: b.hints.map(c), solution: c(b.solution),
  guidance: b.guidance.map((s, i) => ({ prompt: c(s.prompt), answer: s.answer.map(t), labels: stepLabels[i], explanation: c(s.explanation) })),
  ...(uses ? { uses } : {}) }, generator);
};

/* ---- q16 Mass, moments and centre of mass [2.6] ---- */

/* q16b: a rail whose density is a + bx² kg/m over L m. m = aL + bL³/3, M = aL²/2 + bL⁴/4. Every value has at most
   3 decimals (b L³ is a multiple of 3 for the mass, and M is a multiple of 0.25). The parent's density is linear. */
const v16b = ({ a, b, L }) => { const L2 = L * L, L3 = L2 * L, L4 = L3 * L, m = a * L + b * L3 / 3, M = a * L2 / 2 + b * L4 / 4; return { L2, L3, L4, m, M, xb: M / m }; };
practice({ id: 'q16b', parent: 'q16', kind: 'setting', title: 'The tapering cargo rail',
 brief: 'A new rail on the loading deck gets thicker towards one end, and the riggers must know where it balances before they hang it.',
 labels: ['mass (kg)', 'x̄ (m)'], tolerance: 0.0005 },
 [['mass (kg)'], ['moment (kg·m)'], ['x̄ (m)']], {
 canonical: { a: 2, b: 6, L: 3 },
 draw: R => { let p, v; do { p = { a: R.int(1, 9), b: R.int(1, 9), L: R.int(2, 6) }; v = v16b(p); } while (!(ok(v.m, 3) && ok(v.M, 3) && ok(v.xb, 3))); return p; },
 build: p => { const { a, b, L } = p, { L2, L3, L4, m, M, xb } = v16b(p); return {
  prompt: `A cargo rail on the loading deck is a rod ${n(L)} m long that gets thicker towards its far end. Its density, its mass per metre of length, is ρ(x) = ${n(a)} + ${co(b, 'x²')} kg/m at x metres from the pivot end. Enter the mass of the rail in kilograms, then the distance x̄ of its centre of mass from the pivot end in metres.`,
  answer: [m, xb],
  hints: ['The mass is the integral of the density along the rail, from the pivot end to the far end. The antiderivative of x² is x³ ÷ 3.', 'The moment about the pivot end is the integral of x × ρ(x), which now has an x term and an x³ term. The centre of mass is the moment divided by the mass.'],
  solution: `m = ∫ from 0 to ${n(L)} of (${n(a)} + ${co(b, 'x²')}) dx = ${n(a)} × ${n(L)} + ${n(b)} × ${n(L3)} ÷ 3 = ${n(m)} kg. The moment about the pivot end is M = ∫ from 0 to ${n(L)} of (${co(a, 'x')} + ${co(b, 'x³')}) dx = ${n(a)} × ${n(L2)} ÷ 2 + ${n(b)} × ${n(L4)} ÷ 4 = ${n(M)} kg·m. So x̄ = M ÷ m = ${n(M)} ÷ ${n(m)} = ${n(xb)} m from the pivot end.`,
  guidance: [
   { prompt: `What is the mass of the rail, ∫ from 0 to ${n(L)} of (${n(a)} + ${co(b, 'x²')}) dx?`, answer: [m], explanation: `An antiderivative is ${co(a, 'x')} + ${co(b, 'x³')} ÷ 3, so m = ${n(a * L)} + ${n(b * L3 / 3)} = ${n(m)} kg.` },
   { prompt: `What is the moment about the pivot end, ∫ from 0 to ${n(L)} of x(${n(a)} + ${co(b, 'x²')}) dx?`, answer: [M], explanation: `x(${n(a)} + ${co(b, 'x²')}) = ${co(a, 'x')} + ${co(b, 'x³')}, so M = ${n(a)} × ${n(L2)} ÷ 2 + ${n(b)} × ${n(L4)} ÷ 4 = ${n(M)} kg·m.` },
   { prompt: `Divide the moment by the mass. How far from the pivot end is the centre of mass?`, answer: [xb], explanation: `x̄ = ${n(M)} ÷ ${n(m)} = ${n(xb)} m. The middle of the rail is at ${n(L / 2)} m, and the centre of mass is beyond it because the far end is heavier.` }
  ] }; }
});

/* q16c: arm of density a + bx over L m, pivot at x = 0, counterweight W kg at distance d on the other side: W d = M. */
const v16c = ({ a, b, L, W }) => { const L2 = L * L, L3 = L2 * L, m = a * L + b * L2 / 2, M = a * L2 / 2 + b * L3 / 3; return { L2, L3, m, M, d: M / W }; };
practice({ id: 'q16c', parent: 'q16', kind: 'applied', title: 'Levelling the crane arm',
 brief: 'The arm on the new crane must sit level on its pivot, and the crew needs to know how far out the counterweight has to hang.',
 labels: ['mass of the arm (kg)', 'counterweight distance d (m)'], tolerance: 0.0005 },
 [['mass (kg)'], ['moment (kg·m)'], ['d (m)']], {
 canonical: { a: 2, b: 3, L: 4, W: 40 },
 draw: R => { let p, v; do { p = { a: R.int(1, 5), b: R.int(1, 5), L: R.int(2, 6), W: R.pick([20, 25, 32, 40, 50, 60, 80]) }; v = v16c(p); } while (!(ok(v.m, 3) && ok(v.M, 3) && ok(v.d, 3) && v.d >= 0.5 && v.d <= 8)); return p; },
 build: p => { const { a, b, L, W } = p, { L2, L3, m, M, d } = v16c(p); return {
  prompt: `A crane arm is a rod ${n(L)} m long, pivoted at one end and thicker towards its far end. Its density is ρ(x) = ${n(a)} + ${co(b, 'x')} kg/m at x metres from the pivot. A counterweight of ${n(W)} kg hangs from a boom on the other side of the pivot, d metres from it. The arm sits level when the counterweight’s moment, its mass times d, equals the arm’s own moment about the pivot. Enter the mass of the arm in kilograms, then the distance d in metres at which the counterweight must hang.`,
  answer: [m, d],
  hints: ['The mass of the arm is the integral of ρ(x) along its length. Its moment about the pivot is the integral of x × ρ(x) over the same length.', 'For the arm to be level, the counterweight’s mass times d must equal the arm’s moment. Solve that for d.'],
  solution: `m = ∫ from 0 to ${n(L)} of (${n(a)} + ${co(b, 'x')}) dx = ${n(a)} × ${n(L)} + ${n(b)} × ${n(L2)} ÷ 2 = ${n(m)} kg. The arm’s moment about the pivot is M = ∫ from 0 to ${n(L)} of (${co(a, 'x')} + ${co(b, 'x²')}) dx = ${n(a)} × ${n(L2)} ÷ 2 + ${n(b)} × ${n(L3)} ÷ 3 = ${n(M)} kg·m. Level means ${n(W)} × d = ${n(M)}, so d = ${n(M)} ÷ ${n(W)} = ${n(d)} m.`,
  guidance: [
   { prompt: `What is the mass of the arm, ∫ from 0 to ${n(L)} of (${n(a)} + ${co(b, 'x')}) dx?`, answer: [m], explanation: `An antiderivative is ${co(a, 'x')} + ${co(b / 2, 'x²')}, so m = ${n(a * L)} + ${n(b * L2 / 2)} = ${n(m)} kg.` },
   { prompt: `What is the arm’s moment about the pivot, ∫ from 0 to ${n(L)} of x(${n(a)} + ${co(b, 'x')}) dx?`, answer: [M], explanation: `x(${n(a)} + ${co(b, 'x')}) = ${co(a, 'x')} + ${co(b, 'x²')}, so M = ${n(a)} × ${n(L2)} ÷ 2 + ${n(b)} × ${n(L3)} ÷ 3 = ${n(M)} kg·m.` },
   { prompt: `The counterweight’s moment is ${n(W)} × d, and it must equal ${n(M)}. What is d?`, answer: [d], explanation: `d = ${n(M)} ÷ ${n(W)} = ${n(d)} m on the other side of the pivot.` }
  ] }; }
});

/* q16d: a plate of even thickness, σ = 3k kg/m², between y = x² and y = r² for x from 0 to r. A strip at x has mass
   σ(r² − x²) dx, so m = 2σr³/3 = 2k r³ and M = σr⁴/4, x̄ = 3r/8. All three have at most 3 decimals. */
const v16d = ({ r, k }) => { const s = 3 * k, r2 = r * r, r3 = r2 * r, r4 = r3 * r, m = 2 * s * r3 / 3, M = s * r4 / 4; return { s, r2, r3, r4, m, M, xb: M / m }; };
practice({ id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q07', title: 'The hatch cover balance',
 brief: 'A flat hatch cover is cut between a parabola and a straight edge, and the crew needs its mass and balance point before it is fitted.',
 labels: ['mass (kg)', 'x̄ (m)'], tolerance: 0.0005 },
 [['mass (kg)'], ['moment (kg·m)'], ['x̄ (m)']], {
 canonical: { r: 3, k: 2 },
 draw: R => ({ r: R.int(2, 7), k: R.int(1, 5) }),
 build: p => { const { r, k } = p, { s, r2, r3, r4, m, M, xb } = v16d(p); return {
  prompt: `A hatch cover is a thin plate of even thickness, with a mass of ${n(s)} kg for every m² of its face. Its face is the region between the parabola y = x² and the line y = ${n(r2)}, for x from 0 to ${n(r)}, with lengths in metres. A thin vertical strip at x has height ${n(r2)} − x² and width dx, so its mass is ${n(s)}(${n(r2)} − x²) dx. That strip mass plays the part of ρ(x) dx for a rod. Enter the mass of the plate in kilograms (type it without commas), then the distance x̄ of its centre of mass from the y-axis in metres.`,
  answer: [m, xb],
  hints: ['Treat the strip mass as the density of a rod along the x-axis: the mass is the integral of the strip mass from x = 0 to the far edge.', 'The moment about the y-axis is the integral of x times the strip mass. The centre of mass is the moment divided by the mass.'],
  solution: `m = ∫ from 0 to ${n(r)} of ${n(s)}(${n(r2)} − x²) dx = ${n(s)} × (${n(r2)} × ${n(r)} − ${n(r3)} ÷ 3) = ${n(s)} × ${n(2 * r3)} ÷ 3 = ${n(m)} kg. The moment about the y-axis is M = ∫ from 0 to ${n(r)} of ${n(s)}x(${n(r2)} − x²) dx = ${n(s)} × (${n(r4)} ÷ 2 − ${n(r4)} ÷ 4) = ${n(s)} × ${n(r4)} ÷ 4 = ${n(M)} kg·m. So x̄ = ${n(M)} ÷ ${n(m)} = ${n(xb)} m.`,
  guidance: [
   { prompt: `What is the mass of the plate, ∫ from 0 to ${n(r)} of ${n(s)}(${n(r2)} − x²) dx?`, answer: [m], explanation: `An antiderivative of ${n(r2)} − x² is ${n(r2)}x − x³ ÷ 3, which is ${n(r2 * r)} − ${n(r3)} ÷ 3 = ${n(2 * r3)} ÷ 3 at x = ${n(r)}. Times ${n(s)} that is ${n(m)} kg.` },
   { prompt: `What is the moment about the y-axis, ∫ from 0 to ${n(r)} of ${n(s)}x(${n(r2)} − x²) dx?`, answer: [M], explanation: `x(${n(r2)} − x²) = ${n(r2)}x − x³, with antiderivative ${n(r2)}x² ÷ 2 − x⁴ ÷ 4, which is ${n(r4)} ÷ 4 at x = ${n(r)}. Times ${n(s)} that is ${n(M)} kg·m.` },
   { prompt: `Divide the moment by the mass. How far from the y-axis is the centre of mass?`, answer: [xb], explanation: `x̄ = ${n(M)} ÷ ${n(m)} = ${n(xb)} m. It is left of the middle, ${n(r / 2)} m, because the plate is widest near the y-axis.` }
  ] }; }
});

/* ---- q17 Chapter review: shells, work and balance [2.3, 2.5] ---- */

/* q17b: the region under y = cx for x from 0 to a, about the y-axis: k = 2ca³/3. A buffer spring holds F0 = ks × x0 N at
   x0 m: the work from s1 to s2 is ks(s2² − s1²) ÷ 2. Lengths in tenths of a metre are kept as whole numbers. */
const v17b = ({ c, a, ks, u, i, j }) => { const x0 = u / 10, s1 = i / 10, s2 = j / 10, F0 = ks * u / 10, k = 2 * c * a * a * a / 3, W = ks * (j * j - i * i) / 200; return { x0, s1, s2, F0, k, W }; };
practice({ id: 'q17b', parent: 'q17', kind: 'setting', title: 'Funnel mould and buffer spring',
 brief: 'The dock needs a mould for a loading funnel and the stretch work of a buffer spring, and each has to be worked out before the order goes in.',
 labels: ['k', 'work (J)'], tolerance: 0.0005 },
 [['k'], ['spring constant (N/m)'], ['work (J)']], {
 canonical: { c: 4, a: 3, ks: 60, u: 5, i: 2, j: 6 },
 draw: R => { let p, v; do { const i = R.int(1, 3); p = { c: R.int(2, 6), a: R.int(2, 5), ks: R.pick([40, 50, 60, 80, 100]), u: R.pick([1, 2, 4, 5]), i, j: i + R.int(2, 4) }; v = v17b(p); } while (!(ok(v.k, 3) && ok(v.W, 3) && ok(v.F0, 3))); return p; },
 build: p => { const { c, a, ks, u, i, j } = p, { x0, s1, s2, F0, k, W } = v17b(p), a3 = a * a * a; return {
  prompt: `A mould for the loading funnel is the solid made by spinning the region under the line y = ${co(c, 'x')}, for x from 0 to ${n(a)}, about the y-axis, with lengths in decimetres; its volume is kπ dm³. A dock buffer spring needs a force of ${n(F0)} N to hold it ${n(x0)} m beyond its natural length. Enter k, then the work in joules needed to stretch the spring from ${n(s1)} m to ${n(s2)} m beyond its natural length.`,
  answer: [k, W],
  hints: ['Use cylindrical shells about the y-axis: the shell through x has radius x and its height is the height of the line at x.', 'Hooke’s law says the force is F(x) = ks × x, so the spring constant ks is the force divided by the stretch. The work is the integral of the force over the stretch.'],
  solution: `The shell through x has radius x and height ${co(c, 'x')}, so V = 2π ∫ from 0 to ${n(a)} of ${co(c, 'x²')} dx = 2π × ${n(c)} × ${n(a3)} ÷ 3, and k = ${n(k)}. The spring constant is ks = ${n(F0)} ÷ ${n(x0)} = ${n(ks)} N/m. The work is W = ∫ from ${n(s1)} to ${n(s2)} of ${n(ks)}x dx = ${n(ks)} × (${n(rd(s2 * s2, 4))} − ${n(rd(s1 * s1, 4))}) ÷ 2 = ${n(W)} J.`,
  guidance: [
   { prompt: `V = 2π ∫ from 0 to ${n(a)} of x × ${co(c, 'x')} dx. What is k, where V = kπ?`, answer: [k], explanation: `x × ${co(c, 'x')} = ${co(c, 'x²')}, so V = 2π × ${n(c)} × ${n(a3)} ÷ 3 = ${n(k)}π.` },
   { prompt: `The spring needs ${n(F0)} N at ${n(x0)} m beyond its natural length. What is the spring constant ks, in newtons per metre?`, answer: [ks], explanation: `ks = ${n(F0)} ÷ ${n(x0)} = ${n(ks)} N/m.` },
   { prompt: `The force is ${n(ks)}x newtons. What is the work to stretch the spring from ${n(s1)} m to ${n(s2)} m, in joules?`, answer: [W], explanation: `W = ∫ from ${n(s1)} to ${n(s2)} of ${n(ks)}x dx = ${n(ks)} × (${n(rd(s2 * s2, 4))} − ${n(rd(s1 * s1, 4))}) ÷ 2 = ${n(W)} J.` }
  ] }; }
});

/* q17c: a rectangular tank l × w × h, water to depth f, outlet o above the rim. The lift of a layer at y is H − y,
   H = h + o. A layer 1 m deep weighs 9.8·l·w kN; W = 9.8·l·w·(Hf − f²/2) kJ (one decimal, exactly). */
const v17c = ({ l, w, h, f, o }) => { const A = l * w, H = h + o, wl = rd(9.8 * A, 1), W = rd(9.8 * A * (H * f - f * f / 2), 1); return { A, H, wl, W }; };
practice({ id: 'q17c', parent: 'q17', kind: 'applied', title: 'The deck holding tank',
 brief: 'A box-shaped holding tank on the deck has to be emptied by pump, and the crew wants the work budgeted before the pump is chosen.',
 labels: ['weight of a 1 m layer (kN)', 'work (kJ)'], tolerance: 0.01 },
 [['lift distance (m)'], ['weight of a layer (kN)'], ['work (kJ)']], {
 canonical: { l: 4, w: 3, h: 5, f: 4, o: 2 },
 draw: R => { const h = R.int(3, 6); return { l: R.int(2, 6), w: R.int(2, 5), h, f: R.int(2, h - 1), o: R.int(1, 3) }; },
 build: p => { const { l, w, h, f, o } = p, { A, H, wl, W } = v17c(p), X = H * f - f * f / 2; return {
  prompt: `A rectangular holding tank on the deck is ${n(l)} m long, ${n(w)} m wide and ${n(h)} m high, and it is filled with water to a depth of ${n(f)} m. A pump lifts all of the water out through a spout whose outlet is ${n(o)} m above the top of the tank. Water has density 1000 kg/m³, and g = 9.8 m/s². Measure y in metres up from the bottom of the tank. Enter the weight of a layer of water 1 m deep, in kilonewtons, then the work needed to pump the tank empty in kilojoules (type it without commas).`,
  answer: [wl, W],
  hints: ['A thin layer of water at height y has the same size at every height, because the tank has straight sides. Its weight is 9.8 × its mass in kg, and the mass is 1000 times its volume in m³.', 'The layer at height y must be lifted from y up to the outlet. Add up weight × lift distance from y = 0 up to the surface of the water.'],
  solution: `The outlet is ${n(h)} + ${n(o)} = ${n(H)} m above the bottom, so a layer at height y is lifted ${n(H)} − y metres. A layer 1 m deep has a volume of ${n(l)} × ${n(w)} × 1 = ${n(A)} m³, a mass of ${n(1000 * A)} kg and a weight of 9.8 × ${n(A)} = ${n(wl)} kN. So W = ∫ from 0 to ${n(f)} of ${n(wl)}(${n(H)} − y) dy = ${n(wl)} × (${n(H)} × ${n(f)} − ${n(f * f)} ÷ 2) = ${n(wl)} × ${n(X)} = ${n(W)} kJ.`,
  guidance: [
   { prompt: `The outlet is ${n(o)} m above the top of the tank, which is ${n(h)} m high. How far must a layer of water at the bottom, y = 0, be lifted, in metres?`, answer: [H], explanation: `${n(h)} + ${n(o)} = ${n(H)} m. A layer at height y is lifted ${n(H)} − y metres.` },
   { prompt: `A layer 1 m deep has a volume of ${n(l)} × ${n(w)} × 1 = ${n(A)} m³. What does it weigh, in kilonewtons?`, answer: [wl], explanation: `The mass is 1000 × ${n(A)} = ${n(1000 * A)} kg, so the weight is 9.8 × ${n(1000 * A)} = ${n(rd(9800 * A, 1))} N, which is ${n(wl)} kN.` },
   { prompt: `What is the work, ∫ from 0 to ${n(f)} of ${n(wl)}(${n(H)} − y) dy, in kilojoules?`, answer: [W], explanation: `${n(wl)} × (${n(H)} × ${n(f)} − ${n(f * f)} ÷ 2) = ${n(wl)} × ${n(X)} = ${n(W)} kJ.` }
  ] }; }
});

/* q17d: the plate between y = x² and y = cx (crossing at x = c), c from 3 to 6. Spun about the line x = −d: shells of
   radius x + d and height cx − x², k = c⁴/6 + dc³/3. Centre of mass of the plate: x̄ = c/2. k to 3 decimals. */
const v17d = ({ c, d }) => { const c3 = c * c * c, c4 = c3 * c, k = c4 / 6 + d * c3 / 3; return { c3, c4, k, xb: c / 2 }; };
practice({ id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q07', title: 'The heat-shield plate',
 brief: 'A heat-shield plate is cut between a parabola and a sloping edge, and it must be turned on a lathe and then hung from a gantry.',
 labels: ['k', 'x̄ (m)'], tolerance: 0.0005 },
 [['crossing point (m)'], ['k'], ['x̄ (m)']], {
 canonical: { c: 4, d: 3 },
 draw: R => { let p, v; do { p = { c: R.int(3, 6), d: R.int(1, 8) }; v = v17d(p); } while (edge(v.k, 3)); return p; },
 build: p => { const { c, d } = p, { c3, c4, k, xb } = v17d(p); return {
  prompt: `A heat-shield plate is the region between the parabola y = x² and the line y = ${co(c, 'x')}, with lengths in metres. First the plate is spun about the line x = ${n(-d)}, which lies ${n(d)} m to the left of the y-axis, to make a solid of volume kπ m³: use cylindrical shells and enter k to 3 decimal places. Then, for the flat plate of even thickness, a thin vertical strip’s mass is proportional to its height. The plate’s centre of mass is its balance point, and its distance x̄ from the y-axis is the integral of x times the strip height divided by the integral of the strip height: enter x̄ in metres.`,
  answer: [rd(k, 3), xb],
  hints: ['The curves cross where x² = ${c}x. Between the crossings the line is above the parabola, so each shell has height (line) − (parabola). The shell through x is x + ${d} from the axis.'.replace('${c}', n(c)).replace('${d}', n(d)), 'For the centre of mass, use the strip height as the density: x̄ = (the integral of x times the height) ÷ (the integral of the height), over the same stretch from one crossing to the other.'],
  solution: `x² = ${co(c, 'x')} gives x = 0 and x = ${n(c)}. The shell through x has radius x + ${n(d)} and height ${co(c, 'x')} − x², so V = 2π ∫ from 0 to ${n(c)} of (x + ${n(d)})(${co(c, 'x')} − x²) dx = 2π(${n(c4)} ÷ 12 + ${n(d)} × ${n(c3)} ÷ 6), which is ${fx(k, 3)}π, so k = ${fx(k, 3)}. For the centre of mass, the area is ∫ from 0 to ${n(c)} of (${co(c, 'x')} − x²) dx = ${n(c3)} ÷ 6 and the moment is ∫ from 0 to ${n(c)} of x(${co(c, 'x')} − x²) dx = ${n(c4)} ÷ 12, so x̄ = ${n(c4)} ÷ 12 ÷ (${n(c3)} ÷ 6) = ${n(xb)} m.`,
  guidance: [
   { prompt: `Where do y = x² and y = ${co(c, 'x')} cross, apart from x = 0?`, answer: [c], explanation: `x² = ${co(c, 'x')} means x(x − ${n(c)}) = 0, so x = 0 or x = ${n(c)}.` },
   { prompt: `V = 2π ∫ from 0 to ${n(c)} of (x + ${n(d)})(${co(c, 'x')} − x²) dx. What is k, where V = kπ, to 3 decimal places?`, answer: [rd(k, 3)], explanation: `The integral is ${n(c4)} ÷ 12 + ${n(d)} × ${n(c3)} ÷ 6, and 2 times it is ${fx(k, 3)}, so V = ${fx(k, 3)}π.` },
   { prompt: `The area is ${n(c3)} ÷ 6 and the moment is ∫ from 0 to ${n(c)} of x(${co(c, 'x')} − x²) dx = ${n(c4)} ÷ 12. What is x̄ = moment ÷ area?`, answer: [xb], explanation: `x̄ = ${n(c4)} ÷ 12 × 6 ÷ ${n(c3)} = ${n(xb)} m, exactly halfway between the two crossings.` }
  ] }; }
});

/* ---- q18 Integration by parts [3.1] ---- */

/* q18b: c·x·eˣ from 1 to hi. [uv] = c(hi·e^hi − e), ∫v du = c(e^hi − e), value c(hi − 1)e^hi. The parent starts at 0. */
const v18b = ({ c, hi }) => { const E = Math.E, eh = Math.exp(hi), B = c * (hi * eh - E), R = c * (eh - E); return { eh, B, R, V: B - R }; };
const tie = (B, R, V) => Math.abs(rd(B, 3) - rd(R, 3) - rd(V, 3)) < 1e-9;
practice({ id: 'q18b', parent: 'q18', kind: 'setting', title: 'Heat in the memory bank',
 brief: 'The core’s memory bank warms as it runs, and the cooling crew needs the heat it takes in between the first hour and the end of the run.',
 labels: ['boundary term [uv]', 'value of the integral'], tolerance: 0.0005 },
 [['boundary term [uv]'], ['∫ v du'], ['value of the integral']], {
 canonical: { c: 4, hi: 3 },
 draw: R => { let p, v; do { p = { c: R.int(2, 12), hi: R.int(2, 5) }; v = v18b(p); } while (edge(v.B, 3) || edge(v.R, 3) || edge(v.V, 3) || !tie(v.B, v.R, v.V)); return p; },
 build: p => { const { c, hi } = p, { B, R, V } = v18b(p), e = ep(hi); return {
  prompt: `The computing core’s memory bank warms as it runs. The heat it takes in from hour 1 to hour ${n(hi)} of a run is ∫ from 1 to ${n(hi)} of ${co(c, 'x')} eˣ dx kilojoules. Use integration by parts with u = ${co(c, 'x')} and dv = eˣ dx. Enter the boundary term [uv] over the interval, then the value of the integral, both to 3 decimal places (type them without commas).`,
  answer: [rd(B, 3), rd(V, 3)],
  hints: ['Integration by parts says ∫ u dv = [uv] − ∫ v du. Differentiate u to get du, and integrate dv to get v.', `Here du = ${n(c)} dx and v = eˣ. The lower limit is 1 this time, not 0, so uv has a value at the bottom as well as at the top. Keep every digit on your calculator until the last step.`],
  solution: `With u = ${co(c, 'x')}, du = ${n(c)} dx; with dv = eˣ dx, v = eˣ. The boundary term is [${co(c, 'x')} eˣ] from 1 to ${n(hi)}, which is ${n(c)} × ${n(hi)} × ${e} − ${n(c)} × 1 × e, about ${fx(B, 3)}. The remaining integral is ∫ from 1 to ${n(hi)} of ${n(c)}eˣ dx = ${n(c)}(${e} − e), about ${fx(R, 3)}. So the integral is ${fx(B, 3)} − ${fx(R, 3)}, which is ${fx(V, 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `With u = ${co(c, 'x')} and v = eˣ, what is the boundary term [uv] from 1 to ${n(hi)}, to 3 decimal places?`, answer: [rd(B, 3)], explanation: `The boundary term is [${co(c, 'x')} eˣ] from 1 to ${n(hi)}, which is ${n(c)} × ${n(hi)} × ${e} − ${n(c)} × 1 × e, about ${fx(B, 3)}.` },
   { prompt: `What is ∫ v du over the same interval, where du = ${n(c)} dx?`, answer: [rd(R, 3)], explanation: `The remaining integral is ∫ from 1 to ${n(hi)} of ${n(c)}eˣ dx = ${n(c)}(${e} − e), about ${fx(R, 3)}.` },
   { prompt: `Subtract: what is ∫ from 1 to ${n(hi)} of ${co(c, 'x')} eˣ dx, to 3 decimal places?`, answer: [rd(V, 3)], explanation: `[uv] − ∫ v du = ${fx(B, 3)} − ${fx(R, 3)}, which is ${fx(V, 3)}. Round only at the end.` }
  ] }; }
});

/* q18c: c ln x on [1, b], u = c ln x, dv = dx. [uv] = c b ln b, ∫v du = c(b − 1), total = c(b ln b − b + 1), average = total ÷ (b − 1). */
const v18c = ({ c, b }) => { const B = c * b * Math.log(b), R = c * (b - 1), V = B - R; return { B, R, V, avg: V / (b - 1) }; };
practice({ id: 'q18c', parent: 'q18', kind: 'applied', title: 'The warming sensor',
 brief: 'A temperature sensor in the core warms at a rate that follows a logarithm, and the crew wants its total rise and its average rate over the run.',
 labels: ['total rise (°C)', 'average rate (°C/h)'], tolerance: 0.0005 },
 [['boundary term [uv]', '∫ v du'], ['total rise (°C)'], ['average rate (°C/h)']], {
 canonical: { c: 5, b: 5 },
 draw: R => { let p, v; do { p = { c: R.int(2, 9), b: R.int(3, 9) }; v = v18c(p); } while (edge(v.B, 3) || edge(v.V, 3) || edge(v.avg, 3) || !tie(v.B, v.R, v.V) || rd(rd(v.V, 3) / (p.b - 1), 3) !== rd(v.avg, 3)); return p; },
 build: p => { const { c, b } = p, { B, R, V, avg } = v18c(p), L = b - 1; return {
  prompt: `A temperature sensor in the computing core warms at the rate r(x) = ${n(c)} ln x °C per hour, where x is the hour of the run. Over the stretch from x = 1 to x = ${n(b)} the total rise is ∫ from 1 to ${n(b)} of ${n(c)} ln x dx. Use integration by parts with u = ${n(c)} ln x and dv = dx. Enter the total rise in °C, then the average rate of warming over the stretch in °C per hour (the total rise divided by the length of the stretch), both to 3 decimal places.`,
  answer: [rd(V, 3), rd(avg, 3)],
  hints: [`Take u = ${n(c)} ln x and dv = dx, so du = ${n(c)} ÷ x dx and v = x. The product v du is then just ${n(c)} dx.`, 'The boundary term has ln 1 = 0 at the bottom limit. Subtract ∫ v du from the boundary term, keep every digit on your calculator, and only then divide by the length of the stretch for the average.'],
  solution: `With u = ${n(c)} ln x, du = ${n(c)} ÷ x dx; with dv = dx, v = x. The boundary term is [${n(c)}x ln x] from 1 to ${n(b)}, which is ${n(c)} × ${n(b)} × ln ${n(b)} − 0, about ${fx(B, 3)}. The remaining integral is ∫ from 1 to ${n(b)} of ${n(c)} dx = ${n(c)} × ${n(L)} = ${n(R)}. So the total rise is ${fx(B, 3)} − ${n(R)} = ${fx(V, 3)} °C. The stretch lasts ${n(b)} − 1 = ${n(L)} hours, so the average rate is ${fx(V, 3)} ÷ ${n(L)}, about ${fx(avg, 3)} °C per hour.`,
  guidance: [
   { prompt: `With u = ${n(c)} ln x and v = x, what is the boundary term [uv] from 1 to ${n(b)}, and what is ∫ v du, where v du = ${n(c)} dx? Give the boundary term to 3 decimal places.`, answer: [rd(B, 3), R], explanation: `The boundary term is ${n(c)} × ${n(b)} × ln ${n(b)} − ${n(c)} × 1 × ln 1, about ${fx(B, 3)}. The remaining integral is ∫ from 1 to ${n(b)} of ${n(c)} dx = ${n(c)} × ${n(L)} = ${n(R)}.` },
   { prompt: `Subtract: what is the total rise, ∫ from 1 to ${n(b)} of ${n(c)} ln x dx, to 3 decimal places?`, answer: [rd(V, 3)], explanation: `[uv] − ∫ v du = ${fx(B, 3)} − ${n(R)}, which is ${fx(V, 3)} °C. Round only at the end.` },
   { prompt: `The stretch lasts ${n(b)} − 1 = ${n(L)} hours. What is the average rate of warming, the total rise divided by ${n(L)}, to 3 decimal places?`, answer: [rd(avg, 3)], explanation: `${fx(V, 3)} ÷ ${n(L)} is about ${fx(avg, 3)} °C per hour.` }
  ] }; }
});

/* q18d: a tank fed by r(t) = c·t·sin t, or c·t·cos t, from π/2 to π, starting at S0 litres. Net change: sine c(π − 1),
   cosine −c(π/2 + 1). The tank cannot run dry: S0 is at least 20 and the fall is at most about 13 L. */
const v18d = ({ fam, c, S0 }) => { const P = Math.PI, B = fam === 'sin' ? c * P : -c * P / 2, R = c, V = B - R; return { B, R, V, fin: S0 + V }; };
practice({ id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q01', title: 'The backup fuel tank',
 brief: 'A backup tank in the core plant is fed or drained by a pump whose rate follows a product with a sine or cosine, and the crew wants to know where the level ends up.',
 labels: ['net change (L)', 'final amount (L)'], tolerance: 0.0005 },
 [['boundary term [uv]'], ['∫ v du'], ['net change (L)', 'final amount (L)']], {
 canonical: { fam: 'cos', c: 4, S0: 35 },
 draw: R => { let p, v; do { p = { fam: R.pick(['sin', 'cos']), c: R.int(2, 6), S0: R.int(20, 60) }; v = v18d(p); } while (edge(v.B, 3) || edge(v.V, 3) || edge(v.fin, 3) || !tie(v.B, v.R, v.V)); return p; },
 build: p => { const { fam, c, S0 } = p, { B, R, V, fin } = v18d(p), cs = fam === 'cos', f = cs ? 'cos' : 'sin', vv = cs ? 'sin t' : '−cos t', uf = cs ? 'sin' : 'cos'; return {
  prompt: `A backup fuel tank in the computing core’s plant holds ${n(S0)} litres when the clock reads t = π/2. From then until t = π it is pumped at the rate r(t) = ${n(c)}t ${f} t litres per minute, with the angle t in radians; a negative rate means the pump is draining the tank. Use integration by parts with u = ${n(c)}t and dv = ${f} t dt to find ∫ from π/2 to π of r(t) dt. Enter the net change in the amount of fuel in litres, then the amount in the tank at t = π, both to 3 decimal places.`,
  answer: [rd(V, 3), rd(fin, 3)],
  hints: ['The net change is the integral of the rate over the interval, and the amount at the end is the amount at the start plus the net change. A drain is a negative net change.', `With u = ${n(c)}t, du = ${n(c)} dt. Integrate dv = ${f} t dt to get v. Work out [uv] from π/2 to π with the values ${cs ? 'sin π = 0 and sin(π/2) = 1' : 'cos π = −1 and cos(π/2) = 0'}, then ∫ v du.`],
  solution: `With u = ${n(c)}t, du = ${n(c)} dt; with dv = ${f} t dt, v = ${vv}. The boundary term is [${cs ? '' : '−'}${n(c)}t ${uf} t] from π/2 to π, which is ${cs ? `0 − ${n(c)}π/2` : `${n(c)}π − 0`}, about ${fx(B, 3)}. The remaining integral is ∫ from π/2 to π of ${cs ? `${n(c)} sin t` : `−${n(c)} cos t`} dt = ${n(R)}. So the net change is ${fx(B, 3)} − ${n(R)} = ${fx(V, 3)} litres, and the amount at t = π is ${n(S0)} ${V < 0 ? '−' : '+'} ${fx(Math.abs(V), 3)} = ${fx(fin, 3)} litres.`,
  guidance: [
   { prompt: `With u = ${n(c)}t and v = ${vv}, what is the boundary term [uv] from π/2 to π, to 3 decimal places?`, answer: [rd(B, 3)], explanation: `[${cs ? '' : '−'}${n(c)}t ${uf} t] from π/2 to π is ${cs ? `${n(c)}π × 0 − ${n(c)}(π/2) × 1 = −${n(c)}π/2` : `${n(c)}π × 1 − ${n(c)}(π/2) × 0 = ${n(c)}π`}, about ${fx(B, 3)}.` },
   { prompt: `What is ∫ v du over the same interval, where du = ${n(c)} dt?`, answer: [R], explanation: `The remaining integral is ∫ from π/2 to π of ${cs ? `${n(c)} sin t` : `−${n(c)} cos t`} dt, which is ${n(R)}.` },
   { prompt: `Subtract to get the net change in litres. Then add it to the ${n(S0)} litres at the start. Give both to 3 decimal places.`, answer: [rd(V, 3), rd(fin, 3)], explanation: `[uv] − ∫ v du = ${fx(B, 3)} − ${n(R)} = ${fx(V, 3)} litres, and ${n(S0)} + (${fx(V, 3)}) = ${fx(fin, 3)} litres.` }
  ] }; }
});

/* ---- q19 Powers of sine and cosine [3.2] ---- */

/* q19b: ∫ from lo to π/2 of cosᵠx sinᵖx dx, q odd (3, 5 or 7), u = sin x, no swap of limits. L = 1: lo = 0 (u from 0), L = 2:
   lo = −π/2 (u from −1; p even so the value is not 0). Not the parent's example (sin³x over 0 to π, 4/3). */
practice({ id: 'q19b', parent: 'q19', kind: 'setting', title: 'Damping the vibration',
 brief: 'A vibration damper in the core is tuned with a power of cosine times a power of sine, and the core wants its exact value.',
 labels: ['numerator', 'denominator'], tolerance: 0.01 },
 [['u at the lower limit', 'u at x = π/2'], ['highest power of u'], ['numerator', 'denominator']], {
 canonical: { q: 5, p: 2, L: 1 },
 draw: R => { let p; do { const P = R.int(0, 4); p = { q: R.pick([3, 5, 7]), p: P, L: P % 2 ? 1 : R.pick([1, 2]) }; } while (p.q === 3 && p.p === 0 && p.L === 2); return p; },
 build: ({ q, p, L }) => { const k = (q - 1) / 2, u1 = L === 1 ? 0 : -1, terms = powTerms(p, k, u1), [A, B] = sumFr(terms), lo = L === 1 ? '0' : '−π/2', cp = upow(p),
  f = `cos${sup(q)}x${p === 0 ? '' : p === 1 ? ' sin x' : ` sin${sup(p)}x`}`, split = k === 1 ? '(1 − sin²x)' : `(1 − sin²x)${sup(k)}`, poly = polyText(terms), vals = valsText(terms), lim = n(u1); return {
  prompt: `A vibration damper in the computing core is tuned with the integral ∫ from ${lo} to π/2 of ${f} dx, with x in radians. Its value is an exact fraction. The power of cosine is odd, so use the substitution u = sin x. Enter the value as a fraction in lowest terms: the numerator, then the denominator (type them without commas).`,
  answer: [A, B],
  hints: [`The power of cosine is odd, so split off one cos x and write the rest with cos²x = 1 − sin²x: cos${sup(q)}x = ${split} cos x.`, `With u = sin x, du = cos x dx, with no minus sign this time, so the limits keep their order. Put each limit of x into sin x to find the limits of u.`],
  solution: `cos${sup(q)}x = ${split} cos x. Put u = sin x, so du = cos x dx; x = ${lo} gives u = ${lim} and x = π/2 gives u = 1. The limits keep their order, so the integral is ∫ from ${lim} to 1 of ${cp ? cp + ' × ' : ''}(1 − u²)${k === 1 ? '' : sup(k)} du = ∫ from ${lim} to 1 of (${poly}) du = ${vals} = ${fr(A, B)}.`,
  guidance: [
   { prompt: `With u = sin x, what are u at x = ${lo} and u at x = π/2?`, answer: [u1, 1], explanation: `sin(${lo}) = ${lim} and sin(π/2) = 1.` },
   { prompt: `After the substitution the integrand is ${cp ? cp + ' × ' : ''}(1 − u²)${k === 1 ? '' : sup(k)}. Multiplied out, what is the highest power of u?`, answer: [p + q - 1], explanation: `Multiplied out it is ${poly}, so the highest power is ${n(p + q - 1)}.` },
   { prompt: `Integrate term by term from ${lim} to 1. What is the value, as a fraction in lowest terms?`, answer: [A, B], explanation: `∫ from ${lim} to 1 of (${poly}) du = ${vals} = ${fr(A, B)}.` }
  ] }; }
});

/* q19c: P(t) = c sin²t watts for t from 0 to mπ/2 seconds. Energy = c·m·π/4 J (k = cm/4); average power = c/2 W. */
const top19 = m => m % 2 === 0 ? (m === 2 ? 'π' : `${n(m / 2)}π`) : (m === 1 ? 'π/2' : `${n(m)}π/2`);
practice({ id: 'q19c', parent: 'q19', kind: 'applied', title: 'Power drawn by the sensor',
 brief: 'A sensor in the core draws power in pulses that follow sin², and the energy store has to be sized for a whole number of quarter-turns of its cycle.',
 labels: ['k', 'average power (W)'], tolerance: 0.005 },
 [['m ÷ 4'], ['k'], ['average power (W)']], {
 canonical: { c: 6, m: 3 },
 draw: R => ({ c: R.int(2, 9), m: R.int(1, 6) }),
 build: ({ c, m }) => { const t = top19(m), e0 = m / 4, k = c * m / 4, avg = c / 2; return {
  prompt: `A sensor in the computing core draws power P(t) = ${n(c)} sin²t watts, where the angle t is in radians and counts the seconds. Over t from 0 to ${t} the energy it uses is ∫ from 0 to ${t} of P(t) dt joules. Use the power-reducing identity sin²t = (1 − cos 2t) ÷ 2. Enter k, where the energy is kπ joules, then the average power over that stretch in watts (the energy divided by the time it took).`,
  answer: [k, avg],
  hints: ['Replace sin²t by (1 − cos 2t) ÷ 2 and integrate each part. The integral of cos 2t is sin 2t ÷ 2.', 'At the upper limit sin 2t is zero, so only the t part is left. The average power is the energy divided by the length of time, which is the upper limit.'],
  solution: `${n(c)} sin²t = ${n(c / 2)}(1 − cos 2t), whose antiderivative is ${n(c / 2)}(t − sin 2t ÷ 2). At t = ${t}, sin 2t = sin(${n(m)}π) = 0, and at t = 0 it is 0 too. So the energy is ${n(c / 2)} × ${t} = ${n(k)}π joules, and k = ${n(k)}. The average power is ${n(k)}π ÷ (${t}) = ${n(avg)} W.`,
  guidance: [
   { prompt: `An antiderivative of sin²t is t ÷ 2 − sin 2t ÷ 4. At t = ${t} the sine term is 0, so the integral of sin²t from 0 to ${t} is a multiple of π. What is that multiple?`, answer: [e0], explanation: `The value is ${t} ÷ 2, which is ${n(e0)}π.` },
   { prompt: `P(t) is ${n(c)} times sin²t, so the energy is ${n(c)} × ${n(e0)}π joules. What is k?`, answer: [k], explanation: `${n(c)} × ${n(e0)} = ${n(k)}, so the energy is ${n(k)}π joules.` },
   { prompt: `The energy ${n(k)}π joules was used over ${t} seconds. What is the average power, in watts?`, answer: [avg], explanation: `${n(k)}π ÷ (${t}) = ${n(avg)} W. It is half of ${n(c)}, as a sin² pulse spends half its time near zero.` }
  ] }; }
});

/* q19d: c·sinᵃx·cosᵇx on [0, π/2], with an odd power o (3 or 5) of sine (u = cos x) or of cosine (u = sin x); the other
   power e from 0 to 4. ∫ = ∫ from 0 to 1 of uᵉ(1 − u²)ᵏ du = A/B and the average is c·(2 ÷ π)·A/B, to 3 decimals. */
const v19d = ({ fam, o, e, c }) => { const k = (o - 1) / 2, terms = powTerms(e, k, 0), [A, B] = sumFr(terms); return { k, terms, A, B, avg: c * 2 * A / (Math.PI * B), a: fam === 'sin' ? o : e, b: fam === 'sin' ? e : o }; };
practice({ id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q03', title: 'The mean fan load',
 brief: 'The cooling fan’s load follows a product of powers of sine and cosine, and the core wants both the exact integral and the average load over a quarter-turn.',
 labels: ['numerator', 'denominator', 'average load (kPa)'], tolerance: 0.0005 },
 [['highest power of u'], ['numerator', 'denominator'], ['average load (kPa)']], {
 canonical: { fam: 'sin', o: 3, e: 4, c: 20 },
 draw: R => { let p, v; do { p = { fam: R.pick(['sin', 'cos']), o: R.pick([3, 5]), e: R.int(0, 4), c: R.pick([10, 12, 15, 20, 24, 30]) }; v = v19d(p); } while (edge(v.avg, 3)); return p; },
 build: p => { const { fam, o, e, c } = p, { k, terms, A, B, avg, a, b } = v19d(p), f = [pw('sin', a), pw('cos', b)].filter(Boolean).join(' '), sinOdd = fam === 'sin',
  u = sinOdd ? 'cos' : 'sin', poly = polyText(terms), vals = valsText(terms), cp = upow(e), split = k === 1 ? `(1 − ${u}²x)` : `(1 − ${u}²x)²`, odd = sinOdd ? 'sine' : 'cosine'; return {
  prompt: `The cooling fan in the computing core runs under a load of ${n(c)} ${f} kilopascals at the angle x, with x in radians. Enter the exact value of ∫ from 0 to π/2 of ${f} dx as a fraction in lowest terms: the numerator, then the denominator. Then enter the average value of the load ${n(c)} ${f} over x from 0 to π/2, to 3 decimal places.`,
  answer: [A, B, rd(avg, 3)],
  hints: [`One of the two powers is odd: the power of ${odd}. Split one factor off it, write the rest with sin²x + cos²x = 1, and substitute u = ${u} x.`, `The average value of a function over an interval is its integral divided by the length of the interval, here π ÷ 2. The constant ${n(c)} multiplies the whole average.`],
  solution: `The power of ${odd} is odd, so split off one ${sinOdd ? 'sin' : 'cos'} x and use ${sinOdd ? 'sin' : 'cos'}²x = 1 − ${u}²x. Put u = ${u} x, so du = ${sinOdd ? '−sin' : 'cos'} x dx; x = 0 gives u = ${sinOdd ? '1' : '0'} and x = π/2 gives u = ${sinOdd ? '0' : '1'}. ${sinOdd ? 'The minus sign swaps the limits, so the' : 'The limits keep their order, so the'} integral is ∫ from 0 to 1 of ${cp ? cp + ' × ' : ''}(1 − u²)${k === 2 ? '²' : ''} du = ∫ from 0 to 1 of (${poly}) du = ${vals} = ${fr(A, B)}. The average load is ${n(c)} × ${fr(A, B)} ÷ (π ÷ 2), about ${fx(avg, 3)} kPa.`,
  guidance: [
   { prompt: `After the substitution the integrand is ${cp ? cp + ' × ' : ''}(1 − u²)${k === 2 ? '²' : ''}, with u running from 0 to 1. Multiplied out, what is the highest power of u?`, answer: [o + e - 1], explanation: `Multiplied out it is ${poly}, so the highest power is ${n(o + e - 1)}.` },
   { prompt: `Integrate term by term from 0 to 1. What is the integral, as a fraction in lowest terms?`, answer: [A, B], explanation: `∫ from 0 to 1 of (${poly}) du = ${vals} = ${fr(A, B)}.` },
   { prompt: `The average load is ${n(c)} × ${fr(A, B)} ÷ (π ÷ 2). What is it, to 3 decimal places?`, answer: [rd(avg, 3)], explanation: `${n(c)} × ${fr(A, B)} × 2 ÷ π is about ${fx(avg, 3)} kPa.` }
  ] }; }
});

/* ---- q20 Trigonometric substitution [3.3] ---- */

/* The area under y = √(r² − x²) from x1 to x2 is (r²/2)[(θ2 + s2c2) − (θ1 + s1c1)], s = x ÷ r, c = √(1 − s²). */
const br = (r, x) => { const s = x / r, c = Math.sqrt(1 - s * s), t = Math.asin(s); return { s, c, t, F: t + s * c }; };

/* q20b: the part from x = a to x = r, a sliver at the right-hand edge: θ0 = arcsin(a ÷ r), area = (r²/2)(π/2 − (θ0 + s0c0)). */
const v20b = ({ r, a }) => { const lo = br(r, a), A = r * r / 2 * (Math.PI / 2 - lo.F); return { ...lo, A }; };
practice({ id: 'q20b', parent: 'q20', kind: 'setting', title: 'A sliver of the porthole cover',
 brief: 'A round porthole cover must have a sliver cut off its edge for a cable run, and the stores need the area of the piece that is cut.',
 labels: ['θ (radians)', 'area (dm²)'], tolerance: 0.00005 },
 [['θ (radians)'], ['cos θ'], ['area (dm²)']], {
 canonical: { r: 5, a: 3 },
 draw: R => { let p, v; do { const r = R.int(4, 12); p = { r, a: R.int(1, r - 1) }; v = v20b(p); } while (edge(v.t, 4) || edge(v.c, 4) || edge(v.A, 2) || rd(p.r * p.r / 2 * (Math.PI / 2 - (rd(v.t, 4) + v.s * rd(v.c, 4))), 2) !== rd(v.A, 2)); return p; },
 build: p => { const { r, a } = p, { c, t, A } = v20b(p), r2 = r * r; return {
  prompt: `A circular porthole cover of radius ${n(r)} dm is centred on the origin. A sliver is cut from its right-hand edge: the part of the top half between x = ${n(a)} and x = ${n(r)}, the region under y = √(${n(r2)} − x²). Use the substitution x = ${n(r)} sin θ, with θ in radians between −π/2 and π/2, where cos θ is never negative. Enter the angle θ that goes with x = ${n(a)}, to 4 decimal places, then the area of the sliver in dm², to 2 decimal places.`,
  answer: [rd(t, 4), rd(A, 2)],
  hints: [`With x = ${n(r)} sin θ, the root √(${n(r2)} − x²) becomes ${n(r)} cos θ and dx becomes ${n(r)} cos θ dθ. The limits change too: x = ${n(r)} is the angle whose sine is 1.`, 'The integral gives (r² ÷ 2)(θ + sin θ cos θ) with r the radius, and you subtract its value at the lower limit from its value at the upper limit. Keep every digit on your calculator until the last step.'],
  solution: `Put x = ${n(r)} sin θ, so dx = ${n(r)} cos θ dθ and √(${n(r2)} − x²) = ${n(r)} cos θ. x = ${n(a)} gives sin θ = ${n(a)} ÷ ${n(r)}, so θ = arcsin(${n(a)} ÷ ${n(r)}), about ${fx(t, 4)}. x = ${n(r)} gives sin θ = 1, so θ = π/2. The area is ${n(r2 / 2)}(θ + sin θ cos θ) from ${fx(t, 4)} to π/2. At π/2 the bracket is π/2, since cos(π/2) = 0. At the lower limit sin θ = ${n(a)} ÷ ${n(r)} and cos θ = √(${n(r2)} − ${n(a * a)}) ÷ ${n(r)}, about ${fx(c, 4)}, so the area is about ${n(r2 / 2)} × (π/2 − (${fx(t, 4)} + ${n(a / r)} × ${fx(c, 4)})), which is ${fx(A, 2)} dm² to 2 decimal places.`,
  guidance: [
   { prompt: `x = ${n(r)} sin θ. Which θ, in radians, gives x = ${n(a)}? Give it to 4 decimal places.`, answer: [rd(t, 4)], explanation: `sin θ = ${n(a)} ÷ ${n(r)}, so θ = arcsin(${n(a)} ÷ ${n(r)}), about ${fx(t, 4)} radians. The upper limit x = ${n(r)} gives θ = π/2.` },
   { prompt: `At that θ, what is cos θ = √(${n(r2)} − ${n(a * a)}) ÷ ${n(r)}, to 4 decimal places?`, answer: [rd(c, 4)], explanation: `√${n(r2 - a * a)} ÷ ${n(r)} is about ${fx(c, 4)}. It is the height of the cover at x = ${n(a)}, divided by the radius.` },
   { prompt: `The area is ${n(r2 / 2)}(θ + sin θ cos θ) from the lower θ to π/2. What is it, to 2 decimal places?`, answer: [rd(A, 2)], explanation: `${n(r2 / 2)} × (π/2 − (${fx(t, 4)} + ${n(a / r)} × ${fx(c, 4)})) is about ${fx(A, 2)} dm². At θ = π/2 the bracket is π/2.` }
  ] }; }
});

/* q20c: an elliptical viewport y = k√(r² − x²) from 0 to a, glass at s kg per dm². θ = arcsin(a ÷ r), A0 = (r²/2)(θ + sc),
   area = k·A0, mass = s·area. */
const v20c = ({ r, a, k, s }) => { const lo = br(r, a), A0 = r * r / 2 * lo.F, A = k * A0; return { ...lo, A0, A, M: s * A }; };
/* True when a player who rounds θ and cos θ to 4 places, the part under the root to 3, or the area to 2 before the mass
   would get a different area or mass to 2 places. */
const early20c = ({ r, a, k, s }, v) => { const A0 = rd(r * r / 2 * (rd(v.t, 4) + v.s * rd(v.c, 4)), 3), A = k * rd(v.A0, 3); return A0 !== rd(v.A0, 3) || rd(A, 2) !== rd(v.A, 2) || rd(s * rd(A, 2), 2) !== rd(v.M, 2) || rd(s * A, 2) !== rd(v.M, 2); };
practice({ id: 'q20c', parent: 'q20', kind: 'applied', title: 'The viewport glass',
 brief: 'An observation window in the core is cut from a sheet of glass, and the stores need its area and its mass before they cut it.',
 labels: ['area (dm²)', 'mass (kg)'], tolerance: 0.00005 },
 [['θ (radians)'], ['area under √ part (dm²)'], ['area (dm²)', 'mass (kg)']], {
 canonical: { r: 5, a: 3, k: 0.4, s: 0.5 },
 draw: R => { let p, v; do { const r = R.int(4, 9); p = { r, a: R.int(2, r - 1), k: R.pick([0.4, 0.5, 0.6, 1.5, 2, 3]), s: R.pick([0.25, 0.4, 0.5, 0.8]) }; v = v20c(p); } while (edge(v.t, 4) || edge(v.A0, 3) || edge(v.A, 2) || edge(v.M, 2) || early20c(p, v)); return p; },
 build: p => { const { r, a, k, s } = p, { t, c, A0, A, M } = v20c(p), r2 = r * r; return {
  prompt: `A viewport in the computing core is cut from a sheet of glass as the region under the curve y = ${n(k)}√(${n(r2)} − x²), for x from 0 to ${n(a)}, with lengths in decimetres. The glass has a mass of ${n(s)} kg for every dm² of its face. To integrate, use the substitution x = ${n(r)} sin θ, with θ in radians between −π/2 and π/2, where cos θ is never negative. Enter the area of the viewport in dm², then its mass in kilograms, both to 2 decimal places.`,
  answer: [rd(A, 2), rd(M, 2)],
  hints: [`The constant ${n(k)} comes out in front of the integral. For what is left, put x = ${n(r)} sin θ, so that √(${n(r2)} − x²) = ${n(r)} cos θ and dx = ${n(r)} cos θ dθ, and use cos²θ = (1 + cos 2θ) ÷ 2.`, 'The mass is the mass per dm² times the area. Keep every digit on your calculator until the last step.'],
  solution: `The area is ${n(k)} × ∫ from 0 to ${n(a)} of √(${n(r2)} − x²) dx. Put x = ${n(r)} sin θ, so dx = ${n(r)} cos θ dθ and the root is ${n(r)} cos θ. x = ${n(a)} gives θ = arcsin(${n(a)} ÷ ${n(r)}), about ${fx(t, 4)}. The integral is ${n(r2 / 2)}(θ + sin θ cos θ) from 0 to that θ, with cos θ = √(${n(r2 - a * a)}) ÷ ${n(r)}, about ${fx(c, 4)}, which is ${n(r2 / 2)} × (${fx(t, 4)} + ${n(a / r)} × ${fx(c, 4)}), about ${fx(A0, 3)}. The area is ${n(k)} × ${fx(A0, 3)} = ${fx(A, 2)} dm², and the mass is ${n(s)} × ${fx(A, 2)} = ${fx(M, 2)} kg.`,
  guidance: [
   { prompt: `x = ${n(r)} sin θ. Which θ, in radians, gives x = ${n(a)}? Give it to 4 decimal places.`, answer: [rd(t, 4)], explanation: `sin θ = ${n(a)} ÷ ${n(r)}, so θ = arcsin(${n(a)} ÷ ${n(r)}), about ${fx(t, 4)} radians.` },
   { prompt: `The area under y = √(${n(r2)} − x²) alone, from 0 to ${n(a)}, is ${n(r2 / 2)}(θ + sin θ cos θ), with sin θ = ${n(a)} ÷ ${n(r)} and cos θ = √(${n(r2 - a * a)}) ÷ ${n(r)}. What is it, to 3 decimal places?`, answer: [rd(A0, 3)], explanation: `${n(r2 / 2)} × (${fx(t, 4)} + ${n(a / r)} × ${fx(c, 4)}) is about ${fx(A0, 3)} dm².` },
   { prompt: `The viewport is ${n(k)} times that area, and its glass is ${n(s)} kg per dm². What are its area in dm² and its mass in kilograms, to 2 decimal places? Use the unrounded area for the mass.`, answer: [rd(A, 2), rd(M, 2)], explanation: `The area is ${n(k)} × ${fx(A0, 3)} = ${fx(A, 2)} dm², and the mass is ${n(s)} × ${fx(A, 2)} = ${fx(M, 2)} kg.` }
  ] }; }
});

/* q20d: the strip of the top half of a circle of radius r between x1 and x2 (both inside the circle), and its average
   height (area ÷ (x2 − x1)). The parent's lower limit is always 0. */
const v20d = ({ r, x1, x2 }) => { const p = br(r, x1), q = br(r, x2), A = r * r / 2 * (q.F - p.F); return { p, q, A, avg: A / (x2 - x1) }; };
/* True when rounding the two angles and cosines to 4 places, or the area to 2 places before dividing, changes an answer. */
const early20d = ({ r, x1, x2 }, v) => { const A = r * r / 2 * ((rd(v.q.t, 4) + v.q.s * rd(v.q.c, 4)) - (rd(v.p.t, 4) + v.p.s * rd(v.p.c, 4))); return rd(A, 2) !== rd(v.A, 2) || rd(rd(A, 2) / (x2 - x1), 2) !== rd(v.avg, 2); };
practice({ id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q03', title: 'The access port strip',
 brief: 'A strip is cut out of the middle of a round access port for a cable duct, and the stores need its area and its average height.',
 labels: ['area (dm²)', 'average height (dm)'], tolerance: 0.00005 },
 [['θ at the lower limit', 'θ at the upper limit'], ['area (dm²)'], ['average height (dm)']], {
 canonical: { r: 8, x1: 2, x2: 6 },
 draw: R => { let p, v; do { const r = R.int(6, 12), x1 = R.int(1, r - 3); p = { r, x1, x2: R.int(x1 + 2, r - 1) }; v = v20d(p); } while (edge(v.p.t, 4) || edge(v.q.t, 4) || edge(v.A, 2) || edge(v.avg, 2) || early20d(p, v)); return p; },
 build: P => { const { r, x1, x2 } = P, { p, q, A, avg } = v20d(P), r2 = r * r, w = x2 - x1; return {
  prompt: `A circular access port of radius ${n(r)} dm is centred on the origin. A strip of its top half is cut out for a cable duct: the part between x = ${n(x1)} and x = ${n(x2)}, under y = √(${n(r2)} − x²). Use the substitution x = ${n(r)} sin θ, with θ in radians between −π/2 and π/2, where cos θ is never negative. Enter the area of the strip in dm², then the average height of the strip over that stretch of x (its area divided by its width), both to 2 decimal places.`,
  answer: [rd(A, 2), rd(avg, 2)],
  hints: [`With x = ${n(r)} sin θ, the root becomes ${n(r)} cos θ and dx becomes ${n(r)} cos θ dθ. Both limits change: each x gives the angle whose sine is x ÷ ${n(r)}.`, 'The area is (r² ÷ 2)(θ + sin θ cos θ) at the upper limit minus the same at the lower limit, with r the radius. The average value of a function over an interval is its integral divided by the width of the interval. Keep every digit on your calculator until the last step.'],
  solution: `Put x = ${n(r)} sin θ, so dx = ${n(r)} cos θ dθ and √(${n(r2)} − x²) = ${n(r)} cos θ. x = ${n(x1)} gives θ = arcsin(${n(x1)} ÷ ${n(r)}), about ${fx(p.t, 4)}, and x = ${n(x2)} gives θ = arcsin(${n(x2)} ÷ ${n(r)}), about ${fx(q.t, 4)}. The area is ${n(r2 / 2)}(θ + sin θ cos θ) between them. At the upper limit sin θ = ${n(x2 / r)} and cos θ is about ${fx(q.c, 4)}; at the lower limit sin θ = ${n(x1 / r)} and cos θ is about ${fx(p.c, 4)}. So the area is about ${n(r2 / 2)} × ((${fx(q.t, 4)} + ${n(x2 / r)} × ${fx(q.c, 4)}) − (${fx(p.t, 4)} + ${n(x1 / r)} × ${fx(p.c, 4)})), which is ${fx(A, 2)} dm². The strip is ${n(x2)} − ${n(x1)} = ${n(w)} dm wide, so its average height is ${fx(A, 2)} ÷ ${n(w)}, about ${fx(avg, 2)} dm.`,
  guidance: [
   { prompt: `x = ${n(r)} sin θ. Which θ, in radians, goes with x = ${n(x1)}, and which with x = ${n(x2)}? Give both to 4 decimal places.`, answer: [rd(p.t, 4), rd(q.t, 4)], explanation: `sin θ = ${n(x1)} ÷ ${n(r)} gives θ about ${fx(p.t, 4)}, and sin θ = ${n(x2)} ÷ ${n(r)} gives θ about ${fx(q.t, 4)}.` },
   { prompt: `The area is ${n(r2 / 2)}(θ + sin θ cos θ) at the upper θ minus the same at the lower θ. What is it, to 2 decimal places?`, answer: [rd(A, 2)], explanation: `${n(r2 / 2)} × ((${fx(q.t, 4)} + ${n(x2 / r)} × ${fx(q.c, 4)}) − (${fx(p.t, 4)} + ${n(x1 / r)} × ${fx(p.c, 4)})) is about ${fx(A, 2)} dm².` },
   { prompt: `The strip is ${n(x2)} − ${n(x1)} = ${n(w)} dm wide. What is its average height, the area divided by ${n(w)}, to 2 decimal places?`, answer: [rd(avg, 2)], explanation: `${fx(A, 2)} ÷ ${n(w)} is about ${fx(avg, 2)} dm.` }
  ] }; }
});

})();
