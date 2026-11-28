/* Calculus 3: many variables practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc3/oracle-p6.js. */
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
/* A sum of letter terms, skipping zeros and never writing a coefficient 1: poly([[2, 'x'], [−1, 'y']]) is '2x − y'. */
const poly = terms => { let s = ''; for (const [c, x] of terms) { if (!c) continue; const m = Math.abs(c), body = m === 1 && x ? x : n(m) + x; s = s ? s + (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body; } return s || '0'; };
/* Prints a number cleaned of float noise. */
const N = x => n(Math.round(x * 1e6) / 1e6);
const r9 = x => Math.round(x * 1e9) / 1e9;
const isInt = x => Math.abs(x - Math.round(x)) < 1e-9;
const isThird = x => Math.abs(3 * x - Math.round(3 * x)) < 1e-9;
/* Has at most k decimals. */
const dec = (x, k) => Math.abs(x * Math.pow(10, k) - Math.round(x * Math.pow(10, k))) < 1e-9;
/* A multiple of 1/3 as text: 21 or 19/3. */
const third = x => isInt(x) ? N(x) : `${n(Math.round(3 * x))}/3`;
/* k·π as text: 21π, (52/3)π, or 6.5π. */
const kpi = x => isInt(x) ? `${N(x)}π` : isThird(x) ? `(${third(x)})π` : `${N(x)}π`;
/* Angle ranges for q26: an index into this list (t1 to t2); w is the width in units of π. */
const ANG = [{ t1: '0', t2: 'π/2', w: 0.5, wt: 'π/2' }, { t1: '0', t2: 'π', w: 1, wt: 'π' }, { t1: 'π/2', t2: 'π', w: 0.5, wt: 'π/2' }, { t1: '0', t2: '2π', w: 2, wt: '2π' },
 { t1: 'π/4', t2: '3π/4', w: 0.5, wt: 'π/2' }, { t1: 'π', t2: '2π', w: 1, wt: 'π' }, { t1: '0', t2: '3π/2', w: 1.5, wt: '3π/2' }];
/* '0 m' becomes 'within 3 m of the centre', otherwise 'between 1 m and 3 m from the centre'. */
const zone = (r1, r2, what) => r1 === 0 ? `within ${n(r2)} m of ${what}` : `between ${n(r1)} m and ${n(r2)} m from ${what}`;
/* A quantity with its unit, 1 taking the singular: '1 kilogram', '0.25 square metres'. */
const un = (x, one, many) => `${N(x)} ${x === 1 ? one : many}`;
/* A coefficient written in front of a product: '' for 1, otherwise '4 × '. */
const cm = k => k === 1 ? '' : `${N(k)} × `;
const FR = 'a fraction such as 38/3 is fine, or a decimal to 4 places';

/* ---- q26 Double integrals in polar coordinates [5.3] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'The sweeper’s wedge',
 brief: 'A dust-sweeping robot is assigned one wedge of the round landing pad, and the maintenance crew wants the mass of dust it will lift.',
 labels: ['inner integral', 'angle width (×π)', 'k'], tolerance: 0.005,
 gl: [['inner integral'], ['angle width (×π)'], ['k']]
}, {
 /* Wedge of a disc (r from 0 to rad; never the whole disc, so 'one wedge' stays true), dust f = c(x² + y²) g/m². Inner integral c·rad⁴ ÷ 4 and k have at most 2 decimals.
    Not the worked example of q26 (a quarter disc of radius 2 with f = 1), nor the learn mission's mat (a ring, f = x² + y²). */
 canonical: { rad: 2, c: 3, ang: 1 },
 draw: R => { let p, I, k; do { p = { rad: R.int(1, 4), c: R.int(1, 4), ang: R.int(0, ANG.length - 1) }; I = p.c * Math.pow(p.rad, 4) / 4; k = I * ANG[p.ang].w; } while (ANG[p.ang].w === 2 || !dec(I, 2) || !dec(k, 2)); return p; },
 build: ({ rad, c, ang }) => { const A = ANG[ang], I = c * Math.pow(rad, 4) / 4, k = I * A.w, f = c === 1 ? 'x² + y²' : `${n(c)}(x² + y²)`, fr = c === 1 ? 'r³' : `${n(c)}r³`,
  inner = `f = ${c === 1 ? '' : n(c)}r², so the inner integral is the integral of ${fr} from 0 to ${n(rad)}, which is ${c === 1 ? '' : n(c) + ' × '}${n(Math.pow(rad, 4))} ÷ 4 = ${N(I)}`; return {
  prompt: `A dust-sweeper robot cleans one wedge of the round landing pad: the points within ${n(rad)} m of the pad’s centre whose polar angle θ runs from ${A.t1} to ${A.t2}. The dust that settles there weighs f(x, y) = ${f} grams per square metre, with x and y in metres from the centre, so it is heavier towards the rim. Enter the inner integral of f r with respect to r, from r = 0 to r = ${n(rad)}. Then enter the width of the angle range as a number times π. Then write the total mass of dust, the double integral of f over the wedge, as k·π grams and enter k (it may be a decimal, such as 2.25).`,
  answer: [r9(I), A.w, r9(k)],
  hints: ['In polar coordinates x = r cos θ and y = r sin θ, so x² + y² = r². The area piece dA is r dr dθ: do not forget that extra r.', 'The inner integral over r is a plain number, so the θ-integral just multiplies it by the width of the angle range.'],
  solution: `In polar coordinates dA = r dr dθ. ${inner}. The angle runs from ${A.t1} to ${A.t2}, a width of ${A.wt}${A.w === 1 ? ', so the number in front of π is 1' : `, which is ${N(A.w)} times π`}. The total is ${N(I)} × ${A.wt} = ${N(k)}π grams, so k = ${N(k)}.`,
  guidance: [
   { prompt: `Write f in polar coordinates and multiply by the extra factor r. What is its integral with respect to r from r = 0 to r = ${n(rad)}?`, answer: [r9(I)], explanation: `Here ${inner}.` },
   { prompt: `The angle runs from θ = ${A.t1} to θ = ${A.t2}. How wide is that range, as a number times π?`, answer: [A.w], explanation: `${A.t2} − ${A.t1} = ${A.wt}${A.w === 1 ? ', so the number in front of π is 1' : `, which is ${N(A.w)} times π`}.` },
   { prompt: 'Multiply the inner integral by the width of the angle range. What is k in k·π?', answer: [r9(k)], explanation: `${N(I)} × ${A.wt} = ${N(k)}π, so k = ${N(k)}.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Layers on the launch pad',
 brief: 'The launch pad is being resurfaced in two materials, and the freight office needs the weight of each before the lander arrives.',
 labels: ['tile k', 'gravel k', 'total k'], tolerance: 0.005,
 gl: [['tile k'], ['gravel k'], ['total k']]
}, {
 /* Disc of radius a with constant c kg/m², then the ring a to b with f = x² + y² kg/m²; both a full turn. Tile k = c a², gravel k = (b⁴ − a⁴) ÷ 2. */
 canonical: { a: 2, b: 3, c: 4 },
 draw: R => { const a = R.int(1, 3); return { a, b: a + R.int(1, 2), c: R.int(2, 9) }; },
 build: ({ a, b, c }) => { const k1 = c * a * a, k2 = (Math.pow(b, 4) - Math.pow(a, 4)) / 2, k = k1 + k2; return {
  prompt: `The launch pad at Dome Works is a full circle. Its inner disc, out to ${n(a)} m from the centre, is laid with ceramic tile weighing ${n(c)} kilograms per square metre. The ring beyond it, from ${n(a)} m out to ${n(b)} m from the centre, is laid with gravel that gets heavier towards the rim: it weighs f(x, y) = x² + y² kilograms per square metre, with x and y in metres from the centre. Both layers go all the way round, θ from 0 to 2π. Enter the mass of the tile as k·π kilograms (enter k), then the mass of the gravel as k·π kilograms (enter k), then the total mass as k·π kilograms (enter k; each k may be a decimal, such as 2.25).`,
  answer: [k1, r9(k2), r9(k)],
  hints: ['Do the disc and the ring one at a time, each in polar coordinates with dA = r dr dθ. A full turn means θ runs from 0 to 2π.', 'On the disc the weight per square metre is a constant, so its r-integral is that constant times the integral of r. On the ring x² + y² = r², so multiply by the extra r before integrating.'],
  solution: `Tile: the integral of ${n(c)} × r from 0 to ${n(a)} is ${n(c)} × ${n(a * a)} ÷ 2 = ${N(c * a * a / 2)}, and the angle gives 2π, so the tile weighs ${N(c * a * a / 2)} × 2π = ${n(k1)}π kilograms. Gravel: f = x² + y² = r², so the radial integral is the integral of r² × r = r³ from ${n(a)} to ${n(b)}, which is (${n(Math.pow(b, 4))} − ${n(Math.pow(a, 4))}) ÷ 4 = ${N((Math.pow(b, 4) - Math.pow(a, 4)) / 4)}. Times 2π, the gravel weighs ${N(k2)}π kilograms. In all the pad carries ${n(k1)}π + ${N(k2)}π = ${N(k)}π kilograms, so k = ${N(k)}.`,
  guidance: [
   { prompt: `For the tile, the weight per square metre is the constant ${n(c)}. Multiply it by the extra factor r, integrate with respect to r from 0 to ${n(a)}, then multiply by the 2π from θ. What is k for the tile?`, answer: [k1], explanation: `The integral of ${n(c)}r from 0 to ${n(a)} is ${n(c)} × ${n(a * a)} ÷ 2 = ${N(c * a * a / 2)}, and ${N(c * a * a / 2)} × 2π = ${n(k1)}π, so k = ${n(k1)}.` },
   { prompt: `For the gravel, write f in polar coordinates, multiply by r, integrate with respect to r from ${n(a)} to ${n(b)}, then multiply by 2π. What is k for the gravel?`, answer: [r9(k2)], explanation: `f = r², so the integral of r³ from ${n(a)} to ${n(b)} is (${n(Math.pow(b, 4))} − ${n(Math.pow(a, 4))}) ÷ 4 = ${N((Math.pow(b, 4) - Math.pow(a, 4)) / 4)}, and times 2π that is ${N(k2)}π.` },
   { prompt: 'Add the tile and the gravel. What is k for the total mass?', answer: [r9(k)], explanation: `${n(k1)} + ${N(k2)} = ${N(k)}, so the pad carries ${N(k)}π kilograms.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', title: 'Frost on the vane patch',
 brief: 'Frost builds up fastest far from the weather mast, and the crew want the area of the patch and the weight of ice it holds.',
 labels: ['area k', 'inner integral', 'k'], tolerance: 0.005,
 gl: [['area k'], ['inner integral'], ['k']]
}, {
 /* Patch r1 ≤ r ≤ r2, frost c(x² + y²)² g/m². Area k = (r2² − r1²) w ÷ 2; inner integral c(r2⁶ − r1⁶) ÷ 6; k = inner × w.
    All three have at most 2 decimals and stay under 1000. */
 canonical: { r1: 1, r2: 2, c: 2, ang: 6 },
 draw: R => { let p, A, I, k; do { p = { r1: R.int(0, 3), c: R.int(1, 4), ang: R.int(0, ANG.length - 1) }; p.r2 = p.r1 + R.int(1, 3);
   A = (p.r2 * p.r2 - p.r1 * p.r1) * ANG[p.ang].w / 2; I = p.c * (Math.pow(p.r2, 6) - Math.pow(p.r1, 6)) / 6; k = I * ANG[p.ang].w; }
  while (p.r2 > 4 || !dec(A, 2) || !dec(I, 2) || !dec(k, 2) || k >= 1000 || I >= 1000); return p; },
 build: ({ r1, r2, c, ang }) => { const A = ANG[ang], area = (r2 * r2 - r1 * r1) * A.w / 2, I = c * (Math.pow(r2, 6) - Math.pow(r1, 6)) / 6, k = I * A.w, f = c === 1 ? '(x² + y²)²' : `${n(c)}(x² + y²)²`,
  where = zone(r1, r2, 'the mast');
  const inner = `f = ${c === 1 ? '' : n(c)}r⁴, so the inner integral is the integral of ${c === 1 ? '' : n(c)}r⁵ from ${n(r1)} to ${n(r2)}, which is ${c === 1 ? '' : n(c) + ' × '}(${n(Math.pow(r2, 6))} − ${n(Math.pow(r1, 6))}) ÷ 6 = ${N(I)}`; return {
  prompt: `Frost forms on a curved patch of ground beside the weather mast: the points ${where}, with polar angle θ from ${A.t1} to ${A.t2}. The frost on it weighs f(x, y) = ${f} grams per square metre, with x and y in metres from the mast, so it is much heavier towards the outside. Enter the area of the patch as k·π square metres (enter k). Then enter the inner integral of f r with respect to r, from r = ${n(r1)} to r = ${n(r2)}. Then write the total weight of frost, the double integral of f over the patch, as k·π grams and enter k (it may be a decimal, such as 2.25).`,
  answer: [r9(area), r9(I), r9(k)],
  hints: ['In polar coordinates x² + y² = r², so (x² + y²)² = r⁴, and the area piece dA is r dr dθ. Multiply by that extra r before you integrate.', 'The area is the double integral of 1. Both integrals have constant limits, so each is the r-integral times the width of the angle range.'],
  solution: `Area: the integral of 1 × r from ${n(r1)} to ${n(r2)} is (${n(r2 * r2)} − ${n(r1 * r1)}) ÷ 2 = ${N((r2 * r2 - r1 * r1) / 2)}. The angle runs from ${A.t1} to ${A.t2}, a width of ${A.wt}, so the area is ${N((r2 * r2 - r1 * r1) / 2)} × ${A.wt} = ${N(area)}π square metres. Frost: dA = r dr dθ. ${inner}. Times the width ${A.wt}, the total is ${N(I)} × ${A.wt} = ${N(k)}π grams, so k = ${N(k)}.`,
  guidance: [
   { prompt: `For the area, integrate 1 × r with respect to r from ${n(r1)} to ${n(r2)}, then multiply by the width of the angle range, ${A.wt}. What is k in k·π?`, answer: [r9(area)], explanation: `The integral of r is (${n(r2 * r2)} − ${n(r1 * r1)}) ÷ 2 = ${N((r2 * r2 - r1 * r1) / 2)}, and ${N((r2 * r2 - r1 * r1) / 2)} × ${A.wt} = ${N(area)}π.` },
   { prompt: `Write f in polar coordinates and multiply by the extra factor r. What is its integral with respect to r from r = ${n(r1)} to r = ${n(r2)}?`, answer: [r9(I)], explanation: `Here ${inner}.` },
   { prompt: `Multiply that inner integral by the width of the angle range, ${A.wt}. What is k in k·π?`, answer: [r9(k)], explanation: `${N(I)} × ${A.wt} = ${N(k)}π, so k = ${N(k)}.` }
  ] }; }
});

/* ---- q27 Triple integrals [5.4, 5.6] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'The ice wedge',
 brief: 'The cold store keeps a wedge of ice against its back wall, and the loading crew need its volume and weight before they cut it.',
 labels: ['volume (m³)', 'mass (t)'], tolerance: 0.005,
 gl: [['number times y'], ['volume (m³)'], ['number times y'], ['mass (t)']]
}, {
 /* Wedge 0 ≤ x ≤ a, 0 ≤ y ≤ b, 0 ≤ z ≤ sy (at most 6 m tall), density c + x t/m³. V = s a b² ÷ 2, M = (c a + a² ÷ 2) s b² ÷ 2.
    Not the worked example of q27 (a box with density 1 + z), nor the learn mission's ramp (top z = sx, density c + y). */
 canonical: { a: 3, b: 2, s: 2, c: 1 },
 draw: R => { let p; do { p = { a: R.int(2, 6), b: R.int(1, 4), s: R.int(1, 3), c: R.int(1, 3) }; } while (p.s * p.b > 6 || !dec(p.s * p.a * p.b * p.b / 2, 2) || !dec((p.c * p.a + p.a * p.a / 2) * p.s * p.b * p.b / 2, 2)); return p; },
 build: ({ a, b, s, c }) => { const top = poly([[s, 'y']]), V = s * a * b * b / 2, Kx = c * a + a * a / 2, M = Kx * s * b * b / 2; return {
  prompt: `The cold store at Dome Works holds a wedge of packed ice built up against the back wall. It fills the solid where x runs from 0 to ${n(a)}, y from 0 to ${n(b)}, and z from 0 up to the sloping top z = ${top}, all in metres. The ice is denser towards the far end: its density is δ(x, y, z) = ${n(c)} + x tonnes per cubic metre. Enter the volume of the wedge in cubic metres, then its mass in tonnes (decimals are fine).`,
  answer: [V, M],
  hints: ['The volume is the triple integral of 1 over the solid. Integrate z first: it runs from 0 to the sloping top, so the innermost integral is the height of the wedge at (x, y). Then integrate x, then y.', 'The mass is the triple integral of the density. The density does not depend on z, so the innermost integral is the density times the height. The height depends on y, so keep the y-integral outermost.'],
  solution: `Volume: the integral of 1 with respect to z from 0 to ${top} is ${top}. Integrating that with respect to x from 0 to ${n(a)} gives ${poly([[s * a, 'y']])}, and integrating with respect to y from 0 to ${n(b)} gives ${n(s * a)} × ${n(b * b)} ÷ 2 = ${N(V)} cubic metres. Mass: the integral of ${n(c)} + x with respect to z from 0 to ${top} is (${n(c)} + x) × ${top}. Integrating with respect to x from 0 to ${n(a)} gives (${n(c)} × ${n(a)} + ${n(a * a)} ÷ 2) × ${top} = ${poly([[Kx * s, 'y']])}, and integrating with respect to y from 0 to ${n(b)} gives ${N(Kx * s)} × ${n(b * b)} ÷ 2 = ${N(M)} tonnes.`,
  guidance: [
   { prompt: `Integrate 1 with respect to z (from 0 to ${top}), then with respect to x (from 0 to ${n(a)}). The result is a number times y: enter the number.`, answer: [s * a], explanation: `The z-integral is the height ${top}; the x-integral multiplies it by ${n(a)}, giving ${poly([[s * a, 'y']])}.` },
   { prompt: `Integrate that with respect to y from 0 to ${n(b)}. What is the volume?`, answer: [V], explanation: `${n(s * a)} × ${n(b * b)} ÷ 2 = ${N(V)} cubic metres.` },
   { prompt: `Now the density: the z-integral of ${n(c)} + x is (${n(c)} + x) × ${top}. Integrate that with respect to x from 0 to ${n(a)}. The result is a number times y: enter the number.`, answer: [r9(Kx * s)], explanation: `The integral of ${n(c)} + x from 0 to ${n(a)} is ${n(c)} × ${n(a)} + ${n(a * a)} ÷ 2 = ${N(Kx)}, and ${N(Kx)} × ${top} = ${poly([[Kx * s, 'y']])}.` },
   { prompt: `Integrate that with respect to y from 0 to ${n(b)}. What is the mass?`, answer: [r9(M)], explanation: `${N(Kx * s)} × ${n(b * b)} ÷ 2 = ${N(M)} tonnes.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'The ore bin',
 brief: 'The refinery wants to know how much ore its new bin holds, and whether the ore packs tightly enough to change the freight bill.',
 labels: ['volume (m³)', 'mass (t)', 'average density (t/m³)'], tolerance: 0.005,
 gl: [['volume (m³)'], ['mass (t)'], ['average density (t/m³)']]
}, {
 /* Box 0 ≤ x ≤ a, 0 ≤ y ≤ b, depth 0 ≤ z ≤ h, density c + dz. V = abh, M = ab(ch + dh² ÷ 2), average = M ÷ V = c + dh ÷ 2.
    Not the worked example of q27 (2 × 3 × 1 with 1 + z). */
 canonical: { a: 4, b: 3, h: 2, c: 2, d: 1 },
 draw: R => { let p; do { p = { a: R.int(2, 5), b: R.int(2, 4), h: R.int(1, 4), c: R.int(1, 3), d: R.int(1, 3) }; }
  while ((p.a === 2 && p.b === 3 && p.h === 1 && p.c === 1 && p.d === 1) || !dec(p.a * p.b * (p.c * p.h + p.d * p.h * p.h / 2), 2)); return p; },
 build: ({ a, b, h, c, d }) => { const V = a * b * h, Kz = c * h + d * h * h / 2, M = a * b * Kz, avg = M / V, dz = d === 1 ? 'z' : `${n(d)}z`; return {
  prompt: `The refinery’s ore bin at Dome Works is a box: x runs from 0 to ${n(a)}, y from 0 to ${n(b)}, and z from 0 to ${n(h)}, all in metres, where z is the depth below the surface of the ore. Ore packs under its own weight, so the density is δ = ${n(c)} + ${dz} tonnes per cubic metre. Enter the volume of ore in cubic metres, then its total mass in tonnes (decimals are fine), then the average density of the ore in the bin, which is the mass divided by the volume (in tonnes per cubic metre).`,
  answer: [V, r9(M), r9(avg)],
  hints: ['The volume of a box is the triple integral of 1, which is length times width times depth. The mass is the triple integral of the density.', 'The density depends only on z, so the z-integral comes first and the x- and y-integrals just multiply it by the lengths of their ranges. The average density is the mass divided by the volume.'],
  solution: `Volume: ${n(a)} × ${n(b)} × ${n(h)} = ${n(V)} cubic metres. Mass: the integral of ${n(c)} + ${dz} with respect to z from 0 to ${n(h)} is ${n(c)} × ${n(h)} + ${d === 1 ? '' : n(d) + ' × '}${n(h * h)} ÷ 2 = ${N(Kz)}. Nothing else depends on x or y, so the integrals over x and y multiply by ${n(a)} and ${n(b)}: ${N(Kz)} × ${n(a)} × ${n(b)} = ${N(M)} tonnes. Average density: ${N(M)} ÷ ${n(V)} = ${N(avg)} tonnes per cubic metre.`,
  guidance: [
   { prompt: `The volume is the triple integral of 1 over the box. What is it?`, answer: [V], explanation: `${n(a)} × ${n(b)} × ${n(h)} = ${n(V)} cubic metres.` },
   { prompt: `Integrate the density ${n(c)} + ${dz} with respect to z from 0 to ${n(h)}, then multiply by ${n(a)} and ${n(b)} for the x- and y-integrals. What is the mass?`, answer: [r9(M)], explanation: `The z-integral is ${n(c)} × ${n(h)} + ${d === 1 ? '' : n(d) + ' × '}${n(h * h)} ÷ 2 = ${N(Kz)}, and ${N(Kz)} × ${n(a)} × ${n(b)} = ${N(M)} tonnes.` },
   { prompt: 'Divide the mass by the volume. What is the average density?', answer: [r9(avg)], explanation: `${N(M)} ÷ ${n(V)} = ${N(avg)} tonnes per cubic metre.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q25', title: 'The triangular airlock slab',
 brief: 'A concrete slab with a three-cornered floor is going in beside the airlock, and the crane crew need its volume and its weight.',
 labels: ['volume (m³)', 'mass (t)'], tolerance: 0.005,
 gl: [['volume (m³)'], ['coefficient of x', 'coefficient of x²'], ['mass (t)']]
}, {
 /* Floor triangle 0 ≤ y ≤ x ≤ a, height h, density c + y. V = h a² ÷ 2; M = h (c a² ÷ 2 + a³ ÷ 6). */
 canonical: { a: 3, h: 2, c: 1 },
 draw: R => { let p; do { p = { a: R.int(2, 6), h: R.int(2, 5), c: R.int(1, 4) }; } while (!dec(p.h * (p.c * p.a * p.a / 2 + Math.pow(p.a, 3) / 6), 2)); return p; },
 build: ({ a, h, c }) => { const V = h * a * a / 2, K1 = h * c, K2 = h / 2, M = K1 * a * a / 2 + K2 * Math.pow(a, 3) / 3; return {
  prompt: `A concrete slab for the new airlock floor has a triangular footprint. Seen from above it is the triangle with corners (0, 0), (${n(a)}, 0) and (${n(a)}, ${n(a)}): for each x from 0 to ${n(a)}, y runs from 0 up to y = x. The slab rises from z = 0 to z = ${n(h)}, all in metres, and its density is δ = ${n(c)} + y tonnes per cubic metre, because the mix is richer towards the edge. Enter the volume of the slab in cubic metres, then its mass in tonnes (decimals are fine).`,
  answer: [V, r9(M)],
  hints: ['The volume is the triple integral of 1. The footprint is a triangle, so for each x the y-integral runs from 0 to x, and the z-integral gives the constant height.', 'For the mass, integrate the density with respect to z first, then with respect to y from 0 to x (the limit y = x makes the result depend on x), then with respect to x.'],
  solution: `Volume: the z-integral of 1 is ${n(h)}. The y-integral from 0 to x gives ${n(h)}x, and the x-integral from 0 to ${n(a)} gives ${n(h)} × ${n(a * a)} ÷ 2 = ${N(V)} cubic metres. Mass: the z-integral of ${n(c)} + y from 0 to ${n(h)} is (${n(c)} + y) × ${n(h)}. The y-integral from 0 to x gives ${n(h)}(${c === 1 ? '' : n(c)}x + x² ÷ 2) = ${poly([[K1, 'x'], [K2, 'x²']])}. The x-integral from 0 to ${n(a)} gives ${cm(K1)}${n(a * a)} ÷ 2 + ${cm(K2)}${n(a * a * a)} ÷ 3 = ${N(M)} tonnes.`,
  guidance: [
   { prompt: `Integrate 1 with respect to z (from 0 to ${n(h)}), then with respect to y from 0 to x, then with respect to x from 0 to ${n(a)}. What is the volume?`, answer: [V], explanation: `The z-integral is ${n(h)}, the y-integral gives ${n(h)}x, and the x-integral gives ${n(h)} × ${n(a * a)} ÷ 2 = ${N(V)} cubic metres.` },
   { prompt: `Now the density: the z-integral of ${n(c)} + y is (${n(c)} + y) × ${n(h)}. Integrate that with respect to y from 0 to x. The result has the form (number)x + (number)x²: enter the number in front of x, then the number in front of x².`, answer: [K1, K2], explanation: `The y-integral of ${n(c)} + y from 0 to x is ${c === 1 ? '' : n(c)}x + x² ÷ 2, and times ${n(h)} that is ${poly([[K1, 'x'], [K2, 'x²']])}.` },
   { prompt: `Integrate that with respect to x from 0 to ${n(a)}. What is the mass?`, answer: [r9(M)], explanation: `${cm(K1)}${n(a * a)} ÷ 2 + ${cm(K2)}${n(a * a * a)} ÷ 3 = ${N(M)} tonnes.` }
  ] }; }
});

/* ---- q28 Cylindrical and spherical coordinates [5.5] ---- */

/* φ upper limits for q28b: [text, the integral of sin φ from 0 to the limit, how it is worked]. */
const PHI = [['π/3', 0.5, '1 − cos(π/3) = 1 − 1/2 = 1/2'], ['π/2', 1, '1 − cos(π/2) = 1 − 0 = 1'], ['π', 2, '1 − cos π = 1 − (−1) = 2']];
mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'The radar bowl',
 brief: 'The radar dish needs a ceramic bowl cast as a piece of a ball, and the foundry wants its volume as a clean multiple of π.',
 labels: ['radial integral', 'sine integral', 'k'], tolerance: 0.00005,
 gl: [['radial integral'], ['sine integral'], ['k']]
}, {
 /* A piece of a ball or shell, φ from 0 to a (an index into PHI), radii r1 < r2. k = 2 × radial × the sine integral, a multiple of 1/3.
    Not the worked example of q28 (a ball of radius 3, φ to π). */
 canonical: { r1: 0, r2: 4, phi: 0 },
 draw: R => { let p; do { const r1 = R.int(0, 3); p = { r1, r2: r1 + R.int(1, 3), phi: R.int(0, PHI.length - 1) }; } while (p.r1 === 0 && p.r2 === 3 && p.phi === 2); return p; },
 build: ({ r1, r2, phi }) => { const [pt, mid, how] = PHI[phi], rad = (Math.pow(r2, 3) - Math.pow(r1, 3)) / 3, k = 2 * rad * mid, midT = mid === 0.5 ? '1/2' : n(mid); return {
  prompt: `Dome Works is casting a radar bowl, a ceramic part in the shape of a piece of a ball. In spherical coordinates it is the solid made of the points ${zone(r1, r2, 'the origin')}, with φ running from 0 to ${pt} and θ running all the way round. Find its volume. Enter the radial integral (the integral of ρ² with respect to ρ), then the integral of sin φ over the φ range, then k, where the volume is k·π cubic metres (${FR}).`,
  answer: [r9(rad), mid, r9(k)],
  hints: ['In spherical coordinates dV = ρ² sin φ dρ dφ dθ, where φ is the angle down from the positive z-axis, so φ = 0 is straight up. The extra factor in front is the part people forget.', 'All the limits are constants, so the triple integral is the product of three single integrals: one in ρ, one in φ, and one in θ, which runs from 0 to 2π.'],
  solution: `The radial integral is the integral of ρ² from ${n(r1)} to ${n(r2)}: (${n(Math.pow(r2, 3))} − ${n(Math.pow(r1, 3))}) ÷ 3 = ${third(rad)}. The integral of sin φ from 0 to ${pt} is ${how}. The angle θ runs all the way round, from 0 to 2π. The volume is ${third(rad)} × ${midT} × 2π = ${kpi(k)} cubic metres, so k = ${third(k)}.`,
  guidance: [
   { prompt: `Set up the volume in spherical coordinates. What is the integral of ρ² with respect to ρ from ${n(r1)} to ${n(r2)}?`, answer: [r9(rad)], explanation: `(${n(Math.pow(r2, 3))} − ${n(Math.pow(r1, 3))}) ÷ 3 = ${third(rad)}.` },
   { prompt: `What is the integral of sin φ with respect to φ, from 0 to ${pt}?`, answer: [mid], explanation: `The integral of sin φ is −cos φ, so from 0 to ${pt} it is ${how}.` },
   { prompt: 'Multiply the radial integral, the sine integral and the 2π from θ. What is k in k·π?', answer: [r9(k)], explanation: `${third(rad)} × ${midT} × 2 = ${third(k)}, so the volume is ${kpi(k)} cubic metres.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'The grain silo',
 brief: 'The outpost’s grain silo is a tall drum with a rounded roof, and the farm crew need to know how much it holds before the first harvest.',
 labels: ['cylinder k', 'dome k', 'total k'], tolerance: 0.00005,
 gl: [['cylinder k'], ['dome k'], ['total k']]
}, {
 /* Cylinder of radius rad, height h, with a half ball of radius rad on top. Cylinder k = rad² h, dome k = 2 rad³ ÷ 3. */
 canonical: { rad: 2, h: 5 },
 draw: R => ({ rad: R.int(2, 6), h: R.int(2, 8) }),
 build: ({ rad, h }) => { const k1 = rad * rad * h, k2 = 2 * Math.pow(rad, 3) / 3, k = k1 + k2; return {
  prompt: `A grain silo at the outpost is an upright cylinder of radius ${n(rad)} m and height ${n(h)} m, standing on the floor z = 0 with its axis along the z-axis. It is topped by a dome: the half of a ball of radius ${n(rad)} m that lies above the cylinder’s flat top, with the ball’s centre in the middle of that top, at height z = ${n(h)}. Find the volume of the whole silo in two pieces. Enter the volume of the cylinder as k·π cubic metres (enter k), then the volume of the dome as k·π (enter k; ${FR}), then the total volume as k·π (enter k).`,
  answer: [k1, r9(k2), r9(k)],
  hints: ['The cylinder suits cylindrical coordinates, with dV = r dz dr dθ. The half ball suits spherical coordinates centred on the middle of the flat top, with dV = ρ² sin φ dρ dφ dθ and φ from 0 (straight up) to π/2.', 'Each piece has constant limits, so each volume is a product of three single integrals, and θ runs from 0 to 2π.'],
  solution: `Cylinder: the integral of r from 0 to ${n(rad)} is ${n(rad * rad)} ÷ 2 = ${N(rad * rad / 2)}; the integral of 1 with respect to z from 0 to ${n(h)} is ${n(h)}; θ gives 2π. The volume is ${N(rad * rad / 2)} × ${n(h)} × 2π = ${n(k1)}π cubic metres. Dome: the integral of ρ² from 0 to ${n(rad)} is ${n(Math.pow(rad, 3))} ÷ 3 = ${third(Math.pow(rad, 3) / 3)}; the integral of sin φ from 0 to π/2 is 1; θ gives 2π. The volume is ${third(Math.pow(rad, 3) / 3)} × 1 × 2π = ${kpi(k2)} cubic metres. Together the silo holds ${n(k1)}π + ${kpi(k2)} = ${kpi(k)} cubic metres, so k = ${third(k)}.`,
  guidance: [
   { prompt: `For the cylinder, multiply the integral of r from 0 to ${n(rad)}, the integral of 1 with respect to z over the height, and the 2π from θ. What is k for the cylinder?`, answer: [k1], explanation: `${N(rad * rad / 2)} × ${n(h)} × 2 = ${n(k1)}, so the cylinder is ${n(k1)}π cubic metres.` },
   { prompt: `For the dome, multiply the integral of ρ² from 0 to ${n(rad)}, the integral of sin φ from 0 to π/2, and the 2π from θ. What is k for the dome?`, answer: [r9(k2)], explanation: `${third(Math.pow(rad, 3) / 3)} × 1 × 2 = ${third(k2)}, so the dome is ${kpi(k2)} cubic metres.` },
   { prompt: 'Add the two pieces. What is k for the whole silo?', answer: [r9(k)], explanation: `${n(k1)} + ${third(k2)} = ${third(k)}, so the silo holds ${kpi(k)} cubic metres.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q26', title: 'The flywheel drum',
 brief: 'The foundry is casting a thick-walled flywheel drum that is heaviest at the rim, and it must know the mass of metal to order.',
 labels: ['radial integral', 'k'], tolerance: 0.005,
 gl: [['radial integral'], ['height integral'], ['k']]
}, {
 /* Drum between radii r1 < r2, from z = 0 to h, density c(x² + y²) = c r². Radial integral c(r2⁴ − r1⁴) ÷ 4; k = radial × h × 2. */
 canonical: { r1: 1, r2: 3, h: 4, c: 2 },
 draw: R => { let p; do { const r1 = R.int(0, 3); p = { r1, r2: r1 + R.int(1, 3), h: R.int(2, 6), c: R.int(1, 3) }; } while (p.r2 > 4 || !dec(p.c * (Math.pow(p.r2, 4) - Math.pow(p.r1, 4)) / 4 * p.h * 2, 2) || p.c * (Math.pow(p.r2, 4) - Math.pow(p.r1, 4)) / 4 * p.h * 2 >= 1000); return p; },
 build: ({ r1, r2, h, c }) => { const Ir = c * (Math.pow(r2, 4) - Math.pow(r1, 4)) / 4, k = Ir * h * 2, f = c === 1 ? 'x² + y²' : `${n(c)}(x² + y²)`, rr = c === 1 ? 'r³' : `${n(c)}r³`; return {
  prompt: `A flywheel casting at Dome Works is a thick-walled drum: the solid ${r1 === 0 ? `inside an upright cylinder of radius ${n(r2)} m round the z-axis` : `between two upright cylinders round the z-axis, of radius ${n(r1)} m and ${n(r2)} m`}, from z = 0 up to z = ${n(h)}. The metal is denser towards the rim: its density is δ = ${f} tonnes per cubic metre, with x and y in metres from the axis. Use cylindrical coordinates, where x² + y² = r². Enter the radial integral (the integral of δ r with respect to r, from r = ${n(r1)} to r = ${n(r2)}). Then write the mass of the drum as k·π tonnes and enter k.`,
  answer: [r9(Ir), r9(k)],
  hints: ['In cylindrical coordinates dV = r dz dr dθ, and x² + y² = r². Write the density in r, then multiply by the extra factor r before you integrate with respect to r.', 'All the limits are constants, so the mass is the product of three single integrals: the radial one, the integral of 1 with respect to z over the height, and 2π from θ.'],
  solution: `In cylindrical coordinates the density is δ = ${c === 1 ? '' : n(c)}r², and dV = r dz dr dθ, so the radial integrand is ${rr}. Its integral from ${n(r1)} to ${n(r2)} is ${c === 1 ? '' : n(c) + ' × '}(${n(Math.pow(r2, 4))} − ${n(Math.pow(r1, 4))}) ÷ 4 = ${N(Ir)}. The integral of 1 with respect to z from 0 to ${n(h)} is ${n(h)}, and θ gives 2π. The mass is ${N(Ir)} × ${n(h)} × 2π = ${N(k)}π tonnes, so k = ${N(k)}.`,
  guidance: [
   { prompt: `Write the density in terms of r, multiply by the extra factor r, and integrate with respect to r from ${n(r1)} to ${n(r2)}. What is the radial integral?`, answer: [r9(Ir)], explanation: `δ = ${c === 1 ? '' : n(c)}r², so the integrand is ${rr}, and its integral is ${c === 1 ? '' : n(c) + ' × '}(${n(Math.pow(r2, 4))} − ${n(Math.pow(r1, 4))}) ÷ 4 = ${N(Ir)}.` },
   { prompt: `What is the integral of 1 with respect to z from 0 to ${n(h)}?`, answer: [h], explanation: `The integral of 1 over a height of ${n(h)} metres is ${n(h)}.` },
   { prompt: 'Multiply the radial integral, the height integral and the 2π from θ. What is k in k·π?', answer: [r9(k)], explanation: `${N(Ir)} × ${n(h)} × 2 = ${N(k)}, so the mass is ${N(k)}π tonnes.` }
  ] }; }
});

/* ---- q29 Chapter review: the mass of a dome [5.1, 5.5, 5.6] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'The observatory ice cap',
 brief: 'The crater observatory sits under a thick cap of ice, and the engineers want to know how much room it takes and how much weight the roof beams carry.',
 labels: ['volume k', 'mass k'], tolerance: 0.00005,
 gl: [['radial integral'], ['volume k'], ['radial integral'], ['mass k']]
}, {
 /* Half shell above the floor, radii a < b = a + 1 or a + 2, density ρ ÷ c t/m³. Volume k = 2(b³ − a³) ÷ 3, mass k = (b⁴ − a⁴) ÷ (2c), at most 2 decimals.
    Not the worked example of q29 (a half shell between radii 1 and 2 with density 3 ÷ ρ). */
 canonical: { a: 3, b: 4, c: 5 },
 draw: R => { let p; do { const a = R.int(1, 6); p = { a, b: a + R.int(1, 2), c: R.int(2, 9) }; } while (!dec((Math.pow(p.b, 4) - Math.pow(p.a, 4)) / (4 * p.c), 2)); return p; },
 build: ({ a, b, c }) => { const rv = (Math.pow(b, 3) - Math.pow(a, 3)) / 3, kv = 2 * rv, rm = (Math.pow(b, 4) - Math.pow(a, 4)) / (4 * c), km = 2 * rm; return {
  prompt: `The crater observatory sits under a thick shell of ice: the part above the floor of the space between two spheres centred at the middle of the floor, of inner radius ${n(a)} m and outer radius ${n(b)} m. Slow freezing has packed it harder towards the outside: the density is δ = ρ ÷ ${n(c)} tonnes per cubic metre, where ρ is the distance from the centre. Enter the volume of the shell as k·π cubic metres (enter k: ${FR}), then the mass of the shell as k·π tonnes (enter that k).`,
  answer: [r9(kv), r9(km)],
  hints: ['Use spherical coordinates: ρ from the inner radius to the outer, φ from 0 (straight up) to π/2 (the floor), and θ from 0 to 2π, with dV = ρ² sin φ dρ dφ dθ.', 'All the limits are constants, so each triple integral is a product of three single integrals. For the mass, multiply the density by ρ² before you integrate over ρ.'],
  solution: `Volume: the integral of ρ² from ${n(a)} to ${n(b)} is (${n(Math.pow(b, 3))} − ${n(Math.pow(a, 3))}) ÷ 3 = ${third(rv)}; the integral of sin φ from 0 to π/2 is 1; the integral of 1 from 0 to 2π is 2π. The volume is ${third(rv)} × 1 × 2π = ${kpi(kv)} cubic metres. Mass: the density times ρ² is ρ ÷ ${n(c)} × ρ² = ρ³ ÷ ${n(c)}, and its integral from ${n(a)} to ${n(b)} is (${n(Math.pow(b, 4))} − ${n(Math.pow(a, 4))}) ÷ (4 × ${n(c)}) = ${N(rm)}. The mass is ${N(rm)} × 1 × 2π = ${N(km)}π tonnes.`,
  guidance: [
   { prompt: `For the volume, what is the integral of ρ² with respect to ρ from ${n(a)} to ${n(b)}?`, answer: [r9(rv)], explanation: `(${n(Math.pow(b, 3))} − ${n(Math.pow(a, 3))}) ÷ 3 = ${third(rv)}.` },
   { prompt: 'Multiply by the integral of sin φ from 0 to π/2, which is 1, and by 2π from θ. What is k for the volume?', answer: [r9(kv)], explanation: `${third(rv)} × 1 × 2 = ${third(kv)}, so the volume is ${kpi(kv)} cubic metres.` },
   { prompt: `For the mass, the density times ρ² is ρ³ ÷ ${n(c)}. What is its integral with respect to ρ from ${n(a)} to ${n(b)}?`, answer: [r9(rm)], explanation: `(${n(Math.pow(b, 4))} − ${n(Math.pow(a, 4))}) ÷ (4 × ${n(c)}) = ${N(rm)}.` },
   { prompt: 'Multiply by 1 and by 2π as before. What is k for the mass?', answer: [r9(km)], explanation: `${N(rm)} × 1 × 2 = ${N(km)}, so the mass is ${N(km)}π tonnes.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'The two-layer wall',
 brief: 'The dome wall is poured in two layers of different material, and the lift crew must plan the weight of each layer separately.',
 labels: ['inner k', 'outer k', 'total k'], tolerance: 0.00005,
 gl: [['inner k'], ['outer k'], ['total k']]
}, {
 /* Half shells a < b < d above the floor with constant densities c1 (inner) and c2 (outer). Mass k = 2c(b³ − a³) ÷ 3 for each layer. */
 canonical: { a: 4, b: 5, d: 7, c1: 5, c2: 2 },
 draw: R => { let p; do { const a = R.int(3, 5), b = a + 1; p = { a, b, d: b + R.int(1, 2), c1: R.int(3, 6), c2: R.int(1, 3) }; } while (2 * (p.c1 * (Math.pow(p.b, 3) - Math.pow(p.a, 3)) + p.c2 * (Math.pow(p.d, 3) - Math.pow(p.b, 3))) / 3 >= 1000); return p; },
 build: ({ a, b, d, c1, c2 }) => { const v1 = 2 * (Math.pow(b, 3) - Math.pow(a, 3)) / 3, v2 = 2 * (Math.pow(d, 3) - Math.pow(b, 3)) / 3, k1 = c1 * v1, k2 = c2 * v2, k = k1 + k2; return {
  prompt: `The wall of a new habitat dome is poured in two layers. Both layers are the part above the floor of the space between spheres centred at the middle of the floor. The inner layer runs from radius ${n(a)} m to ${n(b)} m and is dense regolith concrete, ${n(c1)} tonnes per cubic metre throughout. The outer layer runs from ${n(b)} m to ${n(d)} m and is a lighter shield, ${n(c2)} tonnes per cubic metre throughout. Enter the mass of the inner layer as k·π tonnes (enter k: ${FR}), then the mass of the outer layer the same way, then the total mass of the wall the same way.`,
  answer: [r9(k1), r9(k2), r9(k)],
  hints: ['A layer of constant density has mass equal to its density times its volume, and its volume is the triple integral of 1 in spherical coordinates, with dV = ρ² sin φ dρ dφ dθ.', 'For each layer, ρ runs between its two radii, φ from 0 to π/2 (above the floor) and θ from 0 to 2π. The layers share the radius where they meet.'],
  solution: `Inner layer: the integral of ρ² from ${n(a)} to ${n(b)} is (${n(Math.pow(b, 3))} − ${n(Math.pow(a, 3))}) ÷ 3 = ${third((Math.pow(b, 3) - Math.pow(a, 3)) / 3)}, so with 1 from φ and 2π from θ the volume is ${kpi(v1)} cubic metres, and the mass is ${n(c1)} × ${third(v1)} = ${third(k1)}, that is ${kpi(k1)} tonnes. Outer layer: the integral of ρ² from ${n(b)} to ${n(d)} is (${n(Math.pow(d, 3))} − ${n(Math.pow(b, 3))}) ÷ 3 = ${third((Math.pow(d, 3) - Math.pow(b, 3)) / 3)}, so the volume is ${kpi(v2)} cubic metres and the mass is ${n(c2)} × ${third(v2)} = ${third(k2)}, that is ${kpi(k2)} tonnes. The wall weighs ${kpi(k1)} + ${kpi(k2)} = ${kpi(k)} tonnes, so k = ${third(k)}.`,
  guidance: [
   { prompt: `Find the volume of the inner layer (ρ from ${n(a)} to ${n(b)}) as k·π, then multiply by its density, ${n(c1)}. What is k for the inner layer’s mass?`, answer: [r9(k1)], explanation: `The volume is ${third((Math.pow(b, 3) - Math.pow(a, 3)) / 3)} × 1 × 2π = ${kpi(v1)}, and ${n(c1)} × ${third(v1)} = ${third(k1)}.` },
   { prompt: `Do the same for the outer layer (ρ from ${n(b)} to ${n(d)}), with density ${n(c2)}. What is k for the outer layer’s mass?`, answer: [r9(k2)], explanation: `The volume is ${third((Math.pow(d, 3) - Math.pow(b, 3)) / 3)} × 1 × 2π = ${kpi(v2)}, and ${n(c2)} × ${third(v2)} = ${third(k2)}.` },
   { prompt: 'Add the two masses. What is k for the whole wall?', answer: [r9(k)], explanation: `${third(k1)} + ${third(k2)} = ${third(k)}, so the wall weighs ${kpi(k)} tonnes.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q27', title: 'The dome buttress',
 brief: 'A buttress cut from the dome’s shell must carry more weight near the top, and the structural team want its volume and its mass.',
 labels: ['volume k', 'radial integral', 'mass k'], tolerance: 0.00005,
 gl: [['volume k'], ['radial integral'], ['mass k']]
}, {
 /* Half of a half shell (y ≥ 0, θ from 0 to π) between a < b, density c z = c ρ cos φ. Volume k = (b³ − a³) ÷ 3; radial c(b⁴ − a⁴) ÷ 4; mass k = radial ÷ 2. */
 canonical: { a: 2, b: 3, c: 2 },
 draw: R => { let p; do { const a = R.int(1, 6); p = { a, b: a + R.int(1, 2), c: R.int(1, 6) }; } while (!dec(p.c * (Math.pow(p.b, 4) - Math.pow(p.a, 4)) / 8, 2) || p.c * (Math.pow(p.b, 4) - Math.pow(p.a, 4)) / 4 >= 1000); return p; },
 build: ({ a, b, c }) => { const kv = (Math.pow(b, 3) - Math.pow(a, 3)) / 3, Ir = c * (Math.pow(b, 4) - Math.pow(a, 4)) / 4, km = Ir / 2, cr = c === 1 ? 'ρ³' : `${n(c)}ρ³`, cz = c === 1 ? 'z' : `${n(c)}z`; return {
  prompt: `A buttress for the habitat dome is cut from a thick shell: the part above the floor, with y ≥ 0 so that θ runs only from 0 to π, of the space between two spheres centred at the middle of the floor, of inner radius ${n(a)} m and outer radius ${n(b)} m. It is denser higher up: the density is δ = ${cz} tonnes per cubic metre, where z is the height above the floor in metres, and z = ρ cos φ in spherical coordinates. Multiplied by ρ² sin φ, the mass integrand is ${cr} sin φ cos φ. You may use that the integral of sin φ cos φ with respect to φ from 0 to π/2 is 1/2. Enter the volume of the buttress as k·π cubic metres (enter k: ${FR}). Then enter the integral of ${cr} with respect to ρ from ρ = ${n(a)} to ρ = ${n(b)}. Then write the mass as k·π tonnes and enter k.`,
  answer: [r9(kv), r9(Ir), r9(km)],
  hints: ['Use spherical coordinates with ρ between the two radii, φ from 0 to π/2 and θ from 0 to π, so the turn is only half as wide as for the whole shell. The volume integrand is ρ² sin φ.', 'All the limits are constants, so each triple integral is a product of three single integrals. For the mass, the three factors are the ρ-integral, the φ-integral you are given, and the width of the θ range.'],
  solution: `Volume: the integral of ρ² from ${n(a)} to ${n(b)} is (${n(Math.pow(b, 3))} − ${n(Math.pow(a, 3))}) ÷ 3 = ${third(kv)}; the integral of sin φ from 0 to π/2 is 1; θ runs from 0 to π, a width of π. The volume is ${third(kv)} × 1 × π = ${kpi(kv)} cubic metres. Mass: the integral of ${cr} from ${n(a)} to ${n(b)} is ${c === 1 ? '' : n(c) + ' × '}(${n(Math.pow(b, 4))} − ${n(Math.pow(a, 4))}) ÷ 4 = ${N(Ir)}. The mass is ${N(Ir)} × 1/2 × π = ${N(km)}π tonnes, so k = ${N(km)}.`,
  guidance: [
   { prompt: `For the volume, multiply the integral of ρ² from ${n(a)} to ${n(b)}, the integral of sin φ from 0 to π/2 (which is 1) and the width π of the θ range. What is k?`, answer: [r9(kv)], explanation: `(${n(Math.pow(b, 3))} − ${n(Math.pow(a, 3))}) ÷ 3 = ${third(kv)}, and ${third(kv)} × 1 × π = ${kpi(kv)}, so k = ${third(kv)}.` },
   { prompt: `For the mass, what is the integral of ${cr} with respect to ρ from ${n(a)} to ${n(b)}?`, answer: [r9(Ir)], explanation: `${c === 1 ? '' : n(c) + ' × '}(${n(Math.pow(b, 4))} − ${n(Math.pow(a, 4))}) ÷ 4 = ${N(Ir)}.` },
   { prompt: 'Multiply by the given φ-integral, 1/2, and by the width π of the θ range. What is k for the mass?', answer: [r9(km)], explanation: `${N(Ir)} × 1/2 × π = ${N(km)}π, so k = ${N(km)}.` }
  ] }; }
});

/* ---- q30 Change of variables and the Jacobian [5.7] ---- */

/* Draws u = ax + by, v = cx + dy with the determinant ad − bc of size in 'dets'. */
const lin = (R, dets) => { let p; do { p = { a: R.int(1, 3), b: R.nz(-3, 3), c: R.nz(-3, 3), d: R.nz(-3, 3) }; } while (!dets.includes(Math.abs(p.a * p.d - p.b * p.c))); return p; };

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'The solar plot',
 brief: 'A slanted plot beside the cable yard is going to carry solar panels, and the planners need its area and the power it will collect.',
 labels: ['J', 'area (m²)', 'total power (W)'], tolerance: 0.0005,
 gl: [['J'], ['area (m²)'], ['integral of v'], ['total power (W)']]
}, {
 /* u = ax + by, v = cx + dy, det of size 1, 2, 4 or 5; plot u1 ≤ u ≤ u2, 0 ≤ v1 ≤ v ≤ v2; power f = v. Area (u2 − u1)(v2 − v1) ÷ |det|; power (u2 − u1)(v2² − v1²) ÷ (2|det|).
    Not the worked example of q30 (u = 2x + y, v = x + y). */
 canonical: { a: 1, b: 1, c: 2, d: 1, u1: 0, u2: 2, v1: 1, v2: 3 },
 draw: R => { let p, det, A, T; do { p = { ...lin(R, [1, 2, 4, 5]), u1: R.int(-2, 2), v1: R.int(0, 3) }; p.u2 = p.u1 + R.int(1, 4); p.v2 = p.v1 + R.int(1, 3); det = Math.abs(p.a * p.d - p.b * p.c);
   A = (p.u2 - p.u1) * (p.v2 - p.v1) / det; T = (p.u2 - p.u1) * (p.v2 * p.v2 - p.v1 * p.v1) / (2 * det); } while (!dec(A, 2) || !dec(T, 2) || (p.a === 2 && p.b === 1 && p.c === 1 && p.d === 1)); return p; },
 build: ({ a, b, c, d, u1, u2, v1, v2 }) => { const U = poly([[a, 'x'], [b, 'y']]), V = poly([[c, 'x'], [d, 'y']]), det = a * d - b * c, J = 1 / det, A = (u2 - u1) * (v2 - v1) / Math.abs(det), IV = (u2 - u1) * (v2 * v2 - v1 * v1) / 2, T = IV / Math.abs(det); return {
  prompt: `A solar plot beside the Cable Yard is a slanted piece of ground between the lines ${U} = ${n(u1)} and ${U} = ${n(u2)}, and between the lines ${V} = ${n(v1)} and ${V} = ${n(v2)}, with x and y in metres. The panels collect power at f(x, y) = ${V} watts per square metre. Change variables to u = ${U} and v = ${V}. Enter the Jacobian J = ∂(x, y)/∂(u, v) (a decimal), then the area of the plot in square metres, then the total power collected, the double integral of f, in watts.`,
  answer: [r9(J), r9(A), r9(T)],
  hints: ['First find ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x. The Jacobian J = ∂(x, y)/∂(u, v) of the way back is 1 divided by it. Keep its sign when you report J, but use its size, |J|, in any integral.', 'In u and v the plot is a rectangle. The area is the integral of 1 × |J| over it, and the power is the integral of f × |J|, where f written in u and v is simply v.'],
  solution: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)} and v_y = ${n(d)}, so ∂(u, v)/∂(x, y) = ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}. The Jacobian of the way back is J = 1 ÷ ${par(det)} = ${N(J)}, and |J| = ${N(Math.abs(J))}. In u and v the plot is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}. Its area is ${n(u2 - u1)} × ${n(v2 - v1)} × ${N(Math.abs(J))} = ${un(A, 'square metre', 'square metres')}. The power is f = v, whose integral from ${n(v1)} to ${n(v2)} is (${n(v2 * v2)} − ${n(v1 * v1)}) ÷ 2 = ${N((v2 * v2 - v1 * v1) / 2)}; the u-integral adds a factor ${n(u2 - u1)}, giving ${N(IV)}. The total power is ${N(IV)} × ${N(Math.abs(J))} = ${un(T, 'watt', 'watts')}.`,
  guidance: [
   { prompt: `Take the partial derivatives of u = ${U} and v = ${V}, work out ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x, and take 1 divided by it. What is the Jacobian J = ∂(x, y)/∂(u, v)?`, answer: [r9(J)], explanation: `∂(u, v)/∂(x, y) = ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}, so J = 1 ÷ ${par(det)} = ${N(J)}. Each small rectangle du dv in the new variables stands for an area |J| du dv on the plot.` },
   { prompt: `In u and v the plot is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}. Integrate 1 over it and multiply by |J|. What is the area?`, answer: [r9(A)], explanation: `${n(u2 - u1)} × ${n(v2 - v1)} × ${N(Math.abs(J))} = ${un(A, 'square metre', 'square metres')}.` },
   { prompt: `Now the power. In u and v, f = v. What is the integral of v over the rectangle, before the factor |J|?`, answer: [r9(IV)], explanation: `The integral of v from ${n(v1)} to ${n(v2)} is (${n(v2 * v2)} − ${n(v1 * v1)}) ÷ 2 = ${N((v2 * v2 - v1 * v1) / 2)}, and the u-integral multiplies it by ${n(u2 - u1)}: ${N(IV)}.` },
   { prompt: 'Multiply by |J|. What is the total power?', answer: [r9(T)], explanation: `${N(IV)} × ${N(Math.abs(J))} = ${un(T, 'watt', 'watts')}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Sealing the anchor plate',
 brief: 'An anchor plate in the cable yard must be sprayed with sealant, and the stores clerk needs to know how many kilograms to bring.',
 labels: ['∂(u, v)/∂(x, y)', 'area (m²)', 'sealant (kg)'], tolerance: 0.0005,
 gl: [['∂(u, v)/∂(x, y)'], ['area (m²)'], ['sealant (kg)']]
}, {
 /* Plate u1 ≤ u ≤ u2, v1 ≤ v ≤ v2, det of size 1, 2, 4 or 5; area (u2 − u1)(v2 − v1) ÷ |det|; sealant c kg per m². */
 canonical: { a: 2, b: 1, c: 1, d: -2, u1: 1, u2: 4, v1: 0, v2: 3, k: 6 },
 draw: R => { let p, det; do { p = { ...lin(R, [1, 2, 4, 5]), u1: R.int(-2, 3), v1: R.int(-3, 2), k: R.int(2, 9) }; p.u2 = p.u1 + R.int(1, 5); p.v2 = p.v1 + R.int(1, 4); det = Math.abs(p.a * p.d - p.b * p.c); }
  while (!dec((p.u2 - p.u1) * (p.v2 - p.v1) / det, 2)); return p; },
 build: ({ a, b, c, d, u1, u2, v1, v2, k }) => { const U = poly([[a, 'x'], [b, 'y']]), V = poly([[c, 'x'], [d, 'y']]), det = a * d - b * c, RA = (u2 - u1) * (v2 - v1), A = RA / Math.abs(det), S = k * A; return {
  prompt: `A slanted anchor plate in the Cable Yard lies between the lines ${U} = ${n(u1)} and ${U} = ${n(u2)}, and between the lines ${V} = ${n(v1)} and ${V} = ${n(v2)}, with x and y in metres. Its whole top face is sprayed with sealant at ${n(k)} kilograms per square metre. Change variables to u = ${U} and v = ${V}. Enter ∂(u, v)/∂(x, y), then the area of the plate in square metres, then the mass of sealant needed in kilograms (decimals are fine).`,
  answer: [det, r9(A), r9(S)],
  hints: ['∂(u, v)/∂(x, y) is the 2 × 2 determinant u_x v_y − u_y v_x. The area factor for du dv is the size of its reciprocal, |J| = 1 ÷ |∂(u, v)/∂(x, y)|.', 'The area is the double integral of 1 over the plate, which is |J| times the area of the rectangle in u and v. The sealant mass is the rate per square metre times the area.'],
  solution: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)} and v_y = ${n(d)}, so ∂(u, v)/∂(x, y) = ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}, and |J| = 1 ÷ ${n(Math.abs(det))} = ${N(1 / Math.abs(det))}. In u and v the plate is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}, with area ${n(u2 - u1)} × ${n(v2 - v1)} = ${n(RA)}. The plate’s area is ${n(RA)} × ${N(1 / Math.abs(det))} = ${un(A, 'square metre', 'square metres')}. The sealant needed is ${n(k)} × ${N(A)} = ${un(S, 'kilogram', 'kilograms')}.`,
  guidance: [
   { prompt: `Take the partial derivatives of u = ${U} and v = ${V}. What is ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x?`, answer: [det], explanation: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)}, v_y = ${n(d)}: ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}.` },
   { prompt: `In u and v the plate is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}. Multiply that rectangle’s area by |J|, the reciprocal of the size of your first answer. What is the area of the plate?`, answer: [r9(A)], explanation: `The rectangle’s area is ${n(u2 - u1)} × ${n(v2 - v1)} = ${n(RA)}, and ${n(RA)} × ${N(1 / Math.abs(det))} = ${un(A, 'square metre', 'square metres')}.` },
   { prompt: `The sealant goes on at ${n(k)} kilograms per square metre. How many kilograms are needed?`, answer: [r9(S)], explanation: `${n(k)} × ${N(A)} = ${un(S, 'kilogram', 'kilograms')}.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q24', title: 'The tension plate',
 brief: 'A slanted tension plate takes more load the further out it goes in both directions, and the riggers need the total.',
 labels: ['∂(u, v)/∂(x, y)', 'integral of u v', 'total load (N)'], tolerance: 0.0005,
 gl: [['∂(u, v)/∂(x, y)'], ['integral of u v'], ['total load (N)']]
}, {
 /* u = ax + by, v = cx + dy, determinant of size 1 to 6; plate 0 ≤ u1 ≤ u ≤ u2, 0 ≤ v1 ≤ v ≤ v2; load f = u v.
    The rectangle integral (u2² − u1²)(v2² − v1²) ÷ 4 and the total ÷ |det| have at most 2 decimals. Not the worked example of q30. */
 canonical: { a: 1, b: 2, c: 2, d: -1, u1: 0, u2: 2, v1: 1, v2: 3 },
 draw: R => { let p, det, Q, T; do { p = { ...lin(R, [1, 2, 3, 4, 5, 6]), u1: R.int(0, 2), v1: R.int(0, 2) }; p.u2 = p.u1 + R.int(1, 3); p.v2 = p.v1 + R.int(1, 3); det = Math.abs(p.a * p.d - p.b * p.c);
   Q = (p.u2 * p.u2 - p.u1 * p.u1) * (p.v2 * p.v2 - p.v1 * p.v1) / 4; T = Q / det; } while (!dec(Q, 2) || !dec(T, 2) || Q >= 1000); return p; },
 build: ({ a, b, c, d, u1, u2, v1, v2 }) => { const U = poly([[a, 'x'], [b, 'y']]), V = poly([[c, 'x'], [d, 'y']]), det = a * d - b * c, Q = (u2 * u2 - u1 * u1) * (v2 * v2 - v1 * v1) / 4, T = Q / Math.abs(det); return {
  prompt: `A tension plate in the Cable Yard lies between the lines ${U} = ${n(u1)} and ${U} = ${n(u2)}, and between the lines ${V} = ${n(v1)} and ${V} = ${n(v2)}, with x and y in metres. Change variables to u = ${U} and v = ${V}. The cables load it more the further out it goes in both directions: f = u v newtons per square metre, which in x and y is f(x, y) = (${U})(${V}). Enter ∂(u, v)/∂(x, y), then the double integral of u v over the rectangle in the (u, v) plane, before the factor |J|, then the total load on the plate in newtons (decimals are fine).`,
  answer: [det, r9(Q), r9(T)],
  hints: ['∂(u, v)/∂(x, y) = u_x v_y − u_y v_x. The area factor is |J| = 1 ÷ |∂(u, v)/∂(x, y)|, the size of the reciprocal.', 'Over a rectangle with constant limits, the integral of u v is the integral of u times the integral of v. The total load is that product times |J|.'],
  solution: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)} and v_y = ${n(d)}, so ∂(u, v)/∂(x, y) = ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}, and |J| = 1 ÷ ${n(Math.abs(det))}. In u and v the plate is the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}. The integral of u from ${n(u1)} to ${n(u2)} is (${n(u2 * u2)} − ${n(u1 * u1)}) ÷ 2 = ${N((u2 * u2 - u1 * u1) / 2)}, and the integral of v from ${n(v1)} to ${n(v2)} is (${n(v2 * v2)} − ${n(v1 * v1)}) ÷ 2 = ${N((v2 * v2 - v1 * v1) / 2)}. Their product is ${N(Q)}. The total load is ${N(Q)} ÷ ${n(Math.abs(det))} = ${un(T, 'newton', 'newtons')}.`,
  guidance: [
   { prompt: `Take the partial derivatives of u = ${U} and v = ${V}. What is ∂(u, v)/∂(x, y) = u_x v_y − u_y v_x?`, answer: [det], explanation: `u_x = ${n(a)}, u_y = ${n(b)}, v_x = ${n(c)}, v_y = ${n(d)}: ${n(a)} × ${par(d)} − ${par(b)} × ${par(c)} = ${n(det)}.` },
   { prompt: `Over the rectangle ${n(u1)} ≤ u ≤ ${n(u2)}, ${n(v1)} ≤ v ≤ ${n(v2)}, what is the double integral of u v? Multiply the integral of u by the integral of v.`, answer: [r9(Q)], explanation: `The integral of u is (${n(u2 * u2)} − ${n(u1 * u1)}) ÷ 2 = ${N((u2 * u2 - u1 * u1) / 2)} and the integral of v is (${n(v2 * v2)} − ${n(v1 * v1)}) ÷ 2 = ${N((v2 * v2 - v1 * v1) / 2)}, so the product is ${N(Q)}.` },
   { prompt: 'Multiply by |J|, the reciprocal of the size of your first answer. What is the total load?', answer: [r9(T)], explanation: `${N(Q)} ÷ ${n(Math.abs(det))} = ${un(T, 'newton', 'newtons')}.` }
  ] }; }
});

/* Tidies generated text where a drawn number comes out as 1: '1 joules' → '1 joule', '1π' → 'π'. Wraps every build of this file. */
const ONE = s => s.replace(/(^|[^\d.,])(−?1) (joule|newton|tonne|cubic metre|square metre|metre|kilogram|litre|gram|second|watt)s\b/g, '$1$2 $3').replace(/(^|[^\d.,])1π/g, '$1π');
for (const id of 'q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d'.split(' ')) {
 const g = window.MISSION_GEN[id], b = g.build;
 g.build = p => { const o = b(p); return { ...o, prompt: ONE(o.prompt), hints: o.hints.map(ONE), solution: ONE(o.solution), guidance: o.guidance.map(x => ({ ...x, prompt: ONE(x.prompt), explanation: ONE(x.explanation) })) }; };
}
})();
