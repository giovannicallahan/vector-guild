/* Calculus 2: accumulation practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/calc2/oracle-p3.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };

/* Builds the authored mission from build(canonical), so the authored text and the generator cannot drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/* Fractions as text in lowest terms ("17/3", or "6" when whole). */
const fr = (p, q) => { const g = gcd(p, q), s = q < 0 ? -1 : 1, a = s * p / g, b = s * q / g; return b === 1 ? n(a) : `${n(a)}/${n(b)}`; };
/* A fraction times π, bracketed so it cannot be misread: (27/2)π, 6π. */
const pi = t => t.includes('/') ? `(${t})π` : `${t}π`;
const rd = (x, k) => Math.round(x * Math.pow(10, k)) / Math.pow(10, k);
const fx = (x, k) => rd(x, k).toFixed(k);
/* True when x sits so close to a rounding boundary at k places that a player's rounding could differ. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
/* A coefficient in front of a letter term, never a written-out 1. */
const co = (k, x) => k === 1 ? x : `${n(k)}${x}`;

/* ---- q11 Chapter review: areas and solids mixed [2.1, 2.2] ---- */

/* Roof panel: region between y = a·x² and y = a·s² from x = 0 to s. Area 2a·s³/3, washers about the x-axis 4a²s⁵/5 π. */
mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The dome roof panel',
 brief: 'The pressure dome needs one curved roof panel cut and a bell housing turned from the same outline, and Mira wants both measured first.',
 labels: ['area (m²)', 'k'], tolerance: 0.00005,
 gl: [['meeting x (m)'], ['area (m²)'], ['k']]
}, {
 canonical: { s: 3, a: 1 },
 draw: R => ({ s: R.int(2, 5), a: R.int(1, 5) }),
 build: ({ s, a }) => { const K = a * s * s, s3 = s * s * s, s5 = s3 * s * s, A6 = 2 * a * s3, V5 = 4 * a * a * s5; return {
  prompt: `A roof panel for the pressure dome is cut from the region below the flat line y = ${n(K)} and above the parabola y = ${co(a, 'x²')}, with the y-axis as its left edge. All lengths are in metres. The panel ends on the right where the line meets the parabola. Enter the area of the panel in m². The same outline is then spun about the x-axis to turn a bell housing of volume kπ m³: enter k. Type each answer as an exact fraction, such as 7/3, or as a decimal rounded to 4 places, without commas.`,
  answer: [A6 / 3, V5 / 5],
  hints: [`The line meets the parabola where ${co(a, 'x²')} = ${n(K)}; take the positive root. The panel runs from x = 0 to that x-value, with the line above the parabola all the way.`, 'Spun about the x-axis, each slice is a washer: its outer radius is the height of the line and its inner radius is the height of the parabola. The volume is π times the integral of (outer radius)² − (inner radius)².'],
  solution: `${co(a, 'x²')} = ${n(K)} gives x = ${n(s)}, so the panel runs from 0 to ${n(s)}. The line is on top, so the area is ∫ from 0 to ${n(s)} of (${n(K)} − ${co(a, 'x²')}) dx = ${n(K)} × ${n(s)} − ${n(a * s3)} ÷ 3 = ${n(a * s3)} − ${n(a * s3)} ÷ 3 = ${fr(A6, 3)} m². For the housing the washer at x has outer radius ${n(K)} and inner radius ${co(a, 'x²')}, so V = π ∫ from 0 to ${n(s)} of (${n(K * K)} − ${co(a * a, 'x⁴')}) dx = π(${n(K * K)} × ${n(s)} − ${n(a * a * s5)} ÷ 5) = π(${n(a * a * s5)} − ${n(a * a * s5)} ÷ 5) = ${pi(fr(V5, 5))}. So k = ${fr(V5, 5)}.`,
  guidance: [
   { prompt: `Where does the parabola y = ${co(a, 'x²')} meet the line y = ${n(K)}, for positive x?`, answer: [s], explanation: `${co(a, 'x²')} = ${n(K)} gives x² = ${n(s * s)}, so x = ${n(s)} (the positive root). The panel runs from x = 0 to x = ${n(s)}.` },
   { prompt: `The line is on top, so the height of the panel at x is ${n(K)} − ${co(a, 'x²')}. What is the area, ∫ from 0 to ${n(s)} of (${n(K)} − ${co(a, 'x²')}) dx? Type it as a fraction or a decimal.`, answer: [A6 / 3], explanation: `An antiderivative of ${n(K)} − ${co(a, 'x²')} is ${n(K)}x − ${co(a, 'x³')} ÷ 3, so the area is ${n(K * s)} − ${n(a * s3)} ÷ 3 = ${fr(A6, 3)} m².` },
   { prompt: `The washers have outer radius ${n(K)} and inner radius ${co(a, 'x²')}. What is k, where the volume is kπ? Type it as a fraction or a decimal.`, answer: [V5 / 5], explanation: `V = π ∫ from 0 to ${n(s)} of (${n(K * K)} − ${co(a * a, 'x⁴')}) dx = π(${n(K * K * s)} − ${n(a * a * s5)} ÷ 5) = ${pi(fr(V5, 5))}.` }
  ] }; }
});

/* Bracket: arch y = (c+w)x − x² above the line y = cx, meeting again at x = w. Area w³/6; washers about the x-axis k = c·w⁴/6 + w⁵/30. */
mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The arch bracket',
 brief: 'A support bracket for the dome is to be cut between an arch and a straight brace, and a roller turned from the same outline.',
 labels: ['meeting x (m)', 'area (m²)', 'k'], tolerance: 0.00005,
 gl: [['meeting x (m)'], ['area (m²)'], ['k']]
}, {
 canonical: { c: 2, w: 3 },
 draw: R => ({ c: R.int(1, 4), w: R.int(2, 6) }),
 build: ({ c, w }) => { const b = c + w, w3 = w * w * w, w4 = w3 * w, w5 = w4 * w, b2 = b * b, c2 = c * c, kk = (5 * c * w4 + w5) / 30; return {
  prompt: `A support bracket for the pressure dome is cut from the region between the arch y = ${n(b)}x − x² and the straight brace y = ${co(c, 'x')}, with lengths in metres. The arch starts at the origin above the brace, and the two meet again further along. Enter the x-value where they meet again, then the area of the bracket in m². A roller is then turned by spinning the bracket about the x-axis, and its volume is kπ m³: enter k. Type areas and k as exact fractions, such as 7/3, or as decimals rounded to 4 places, without commas.`,
  answer: [w, w3 / 6, kk],
  hints: [`The curves meet where ${n(b)}x − x² = ${co(c, 'x')}. Move everything to one side and take out the factor x.`, 'Between the meeting points the arch is the top curve. For the roller, each slice is a washer: the arch is the outer radius and the brace is the inner radius.'],
  solution: `${n(b)}x − x² = ${co(c, 'x')} gives ${n(w)}x − x² = 0, so x = 0 or x = ${n(w)}. The arch is on top, so the area is ∫ from 0 to ${n(w)} of (${n(w)}x − x²) dx = ${n(w3)} ÷ 2 − ${n(w3)} ÷ 3 = ${fr(w3, 6)} m². The washers have outer radius ${n(b)}x − x² and inner radius ${co(c, 'x')}, so V = π ∫ from 0 to ${n(w)} of (${n(b2 - c2)}x² − ${n(2 * b)}x³ + x⁴) dx = π(${n((b2 - c2) * w3)} ÷ 3 − ${n(2 * b * w4)} ÷ 4 + ${n(w5)} ÷ 5) = ${pi(fr(5 * c * w4 + w5, 30))}. So k = ${fr(5 * c * w4 + w5, 30)}.`,
  guidance: [
   { prompt: `Where do y = ${n(b)}x − x² and y = ${co(c, 'x')} meet, apart from x = 0?`, answer: [w], explanation: `${n(b)}x − x² = ${co(c, 'x')} gives ${n(w)}x − x² = 0, which is x(${n(w)} − x) = 0, so x = 0 or x = ${n(w)}.` },
   { prompt: `The arch is on top, so the height of the bracket at x is (${n(b)}x − x²) − ${co(c, 'x')} = ${n(w)}x − x². What is its area from 0 to ${n(w)}? Type it as a fraction or a decimal.`, answer: [w3 / 6], explanation: `An antiderivative of ${n(w)}x − x² is ${n(w)}x² ÷ 2 − x³ ÷ 3, so the area is ${n(w3)} ÷ 2 − ${n(w3)} ÷ 3 = ${fr(w3, 6)} m².` },
   { prompt: `The roller's washers have outer radius ${n(b)}x − x² and inner radius ${co(c, 'x')}. What is k, where the volume is kπ? Type it as a fraction or a decimal.`, answer: [kk], explanation: `(${n(b)}x − x²)² − (${co(c, 'x')})² = ${n(b2 - c2)}x² − ${n(2 * b)}x³ + x⁴. Integrating from 0 to ${n(w)} gives ${n((b2 - c2) * w3)} ÷ 3 − ${n(2 * b * w4)} ÷ 4 + ${n(w5)} ÷ 5 = ${fr(5 * c * w4 + w5, 30)}, so k = ${fr(5 * c * w4 + w5, 30)}.` }
  ] }; }
});

/* Tail fin: line y = a·c²x above y = a·x³ from 0 to c. Area a·c⁴/4, average gap a·c³/4, washers about the x-axis 4a²c⁷/21 π. */
mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q03', title: 'The tail fin',
 brief: 'A tail fin for the dome’s service drone is cut between a line and a cubic, and the foundry wants its area, its average depth and the solid it would turn into.',
 labels: ['area (m²)', 'average gap (m)', 'k'], tolerance: 0.00005,
 gl: [['meeting x (m)'], ['area (m²)', 'average gap (m)'], ['k']]
}, {
 canonical: { c: 3, a: 1 },
 /* a = c = 1 would write the line as y = 1x. */
 draw: R => { let p; do { p = { c: R.int(1, 4), a: R.int(1, 5) }; } while (p.a === 1 && p.c === 1); return p; },
 build: ({ c, a }) => { const c2 = c * c, c3 = c2 * c, c4 = c2 * c2, c7 = c4 * c3, ac2 = a * c2; return {
  prompt: `A tail fin for a service drone is cut from the region between the curve y = ${co(a, 'x³')} and the line y = ${n(ac2)}x, from x = 0 to where the line and the curve meet again, with lengths in metres. At each x the fin has a vertical gap between the line and the curve. Enter the area of the fin in m², then the average value of that gap over the fin’s width in metres. Then the fin is spun about the x-axis to make a solid of volume kπ m³: enter k. Type each answer as an exact fraction, such as 7/3, or as a decimal rounded to 4 places, without commas.`,
  answer: [a * c4 / 4, a * c3 / 4, 4 * a * a * c7 / 21],
  hints: [`The line and the curve meet where ${co(a, 'x³')} = ${n(ac2)}x. Divide by x, then take the positive root. The line is above the curve between 0 and that x-value.`, 'The average value of the gap is the area of the fin divided by its width. For the solid, each slice is a washer with the line as its outer radius and the curve as its inner radius, so the integrand is the line squared minus the curve squared.'],
  solution: `${co(a, 'x³')} = ${n(ac2)}x gives x² = ${n(c2)}, so the curves meet at x = ${n(c)}. The line is on top, so the gap is ${n(ac2)}x − ${co(a, 'x³')} and the area is ∫ from 0 to ${n(c)} of (${n(ac2)}x − ${co(a, 'x³')}) dx = ${n(a * c4)} ÷ 2 − ${n(a * c4)} ÷ 4 = ${fr(a * c4, 4)} m². The average gap is the area divided by the width: ${fr(a * c4, 4)} ÷ ${n(c)} = ${fr(a * c3, 4)} m. For the solid, V = π ∫ from 0 to ${n(c)} of (${n(a * a * c4)}x² − ${co(a * a, 'x⁶')}) dx = π(${n(a * a * c7)} ÷ 3 − ${n(a * a * c7)} ÷ 7) = ${pi(fr(4 * a * a * c7, 21))}. So k = ${fr(4 * a * a * c7, 21)}.`,
  guidance: [
   { prompt: `Where do y = ${co(a, 'x³')} and y = ${n(ac2)}x meet, for positive x?`, answer: [c], explanation: `${co(a, 'x³')} = ${n(ac2)}x gives x² = ${n(c2)}, so x = ${n(c)}. The fin is the region from x = 0 to x = ${n(c)}.` },
   { prompt: `The gap is ${n(ac2)}x − ${co(a, 'x³')}. What is the area of the fin from 0 to ${n(c)}, and its average gap (the area divided by the width ${n(c)})? Type fractions or decimals.`, answer: [a * c4 / 4, a * c3 / 4], explanation: `The area is ${n(a * c4)} ÷ 2 − ${n(a * c4)} ÷ 4 = ${fr(a * c4, 4)} m². Divided by the width ${n(c)}, the average gap is ${fr(a * c3, 4)} m.` },
   { prompt: `The washers have outer radius ${n(ac2)}x and inner radius ${co(a, 'x³')}. What is k, where the volume is kπ? Type it as a fraction or a decimal.`, answer: [4 * a * a * c7 / 21], explanation: `V = π ∫ from 0 to ${n(c)} of (${n(a * a * c4)}x² − ${co(a * a, 'x⁶')}) dx = π(${n(a * a * c7)} ÷ 3 − ${n(a * a * c7)} ÷ 7) = ${pi(fr(4 * a * a * c7, 21))}.` }
  ] }; }
});

/* ---- q12 Cylindrical shells [2.3] ---- */

/* Reel flange: region under y = a·x² from 0 to b. About the y-axis a·b⁴/2 π, about x = b a·b⁴/6 π. */
mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The reel flange',
 brief: 'A reel flange for the crane is to be turned from one curved outline, once about its left edge and once about its right edge.',
 labels: ['k₁', 'k₂'], tolerance: 0.00005,
 gl: [['shell height (m)', 'shell radius (m)'], ['k₁'], ['k₂']]
}, {
 canonical: { a: 1, b: 2 },
 draw: R => ({ a: R.int(1, 5), b: R.int(2, 5) }),
 build: ({ a, b }) => { const b4 = b * b * b * b; return {
  prompt: `A reel flange for the cargo crane is turned from the region under the curve y = ${co(a, 'x²')}, between x = 0 and x = ${n(b)}, with lengths in metres. Use cylindrical shells. Spun about the y-axis, the region sweeps out a solid of volume k₁π m³. Spun instead about the vertical line x = ${n(b)}, which is the region’s right-hand edge, it sweeps out a solid of volume k₂π m³. Enter k₁, then k₂, each as an exact fraction such as 7/3 or as a decimal rounded to 4 places, without commas.`,
  answer: [a * b4 / 2, a * b4 / 6],
  hints: ['Cut the region into thin upright strips. The strip at x has the height of the curve, and spun about a vertical line it sweeps out a cylindrical shell of volume about 2π × radius × height × dx.', `Only the radius depends on the axis. About the y-axis it is the distance from x to the y-axis. About the line x = ${n(b)} it is the distance from x to that line, which is ${n(b)} − x.`],
  solution: `About the y-axis the shell through x has radius x and height ${co(a, 'x²')}, so V = 2π ∫ from 0 to ${n(b)} of ${co(a, 'x³')} dx = 2π × ${n(a * b4)} ÷ 4 = ${pi(fr(a * b4, 2))}, and k₁ = ${fr(a * b4, 2)}. About x = ${n(b)} the radius is ${n(b)} − x, so V = 2π ∫ from 0 to ${n(b)} of (${n(b)} − x) × ${co(a, 'x²')} dx = 2π ∫ (${n(a * b)}x² − ${co(a, 'x³')}) dx = 2π(${n(a * b4)} ÷ 3 − ${n(a * b4)} ÷ 4) = 2π × ${fr(a * b4, 12)} = ${pi(fr(a * b4, 6))}, so k₂ = ${fr(a * b4, 6)}.`,
  guidance: [
   { prompt: `Look at the shell through x = 1. What is its height, and what is its radius when the axis is the line x = ${n(b)}?`, answer: [a, b - 1], explanation: `The height is ${n(a)} × 1² = ${n(a)} m. The axis is at x = ${n(b)}, so the radius is ${n(b)} − 1 = ${n(b - 1)} m.` },
   { prompt: `About the y-axis, V = 2π ∫ from 0 to ${n(b)} of x × ${co(a, 'x²')} dx. What is k₁, where V = k₁π?`, answer: [a * b4 / 2], explanation: `2π × ${n(a * b4)} ÷ 4 = ${pi(fr(a * b4, 2))}.` },
   { prompt: `About x = ${n(b)}, the radius is ${n(b)} − x. What is k₂?`, answer: [a * b4 / 6], explanation: `2π(${n(a * b4)} ÷ 3 − ${n(a * b4)} ÷ 4) = 2π × ${fr(a * b4, 12)} = ${pi(fr(a * b4, 6))}, so k₂ = ${fr(a * b4, 6)}.` }
  ] }; }
});

/* Winch spool: region between y = s²x and y = x³ (0 to s). About the y-axis 4s⁵/15 π, about x = −e that plus e·s⁴/2. */
mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'The winch spool',
 brief: 'A spool for the crane winch is to be turned between a straight edge and a curve, first about the centre line and then about an offset one.',
 labels: ['meeting x (m)', 'k₁', 'k₂'], tolerance: 0.00005,
 gl: [['meeting x (m)'], ['k₁'], ['k₂']]
}, {
 canonical: { s: 2, e: 3 },
 draw: R => ({ s: R.int(2, 5), e: R.int(1, 6) }),
 build: ({ s, e }) => { const s2 = s * s, s4 = s2 * s2, s5 = s4 * s, K1 = 4 * s5 / 15, K2 = K1 + e * s4 / 2; return {
  prompt: `A spool for the crane winch is turned from the region to the right of the y-axis between the line y = ${n(s2)}x and the curve y = x³, with lengths in metres. Use cylindrical shells. Enter the x-value where the line and the curve meet. Spun about the y-axis, the region makes a spool of volume k₁π m³; spun about the vertical line x = ${n(-e)}, which is ${n(e)} m to the left of the y-axis, it makes a wider spool of volume k₂π m³. Enter the meeting x, then k₁, then k₂. Type k₁ and k₂ as exact fractions, such as 7/3, or as decimals rounded to 4 places, without commas.`,
  answer: [s, K1, K2],
  hints: ['The line and the curve meet where the two heights are equal. Divide by x, then take the positive root. Between x = 0 and there, the line is the top curve.', 'Each shell has height (line − curve) at its x. Its radius is x about the y-axis, and x plus the distance to the y-axis when the axis is further left.'],
  solution: `${n(s2)}x = x³ gives x² = ${n(s2)}, so x = ${n(s)} (positive root). The line is on top, so the shell at x has height ${n(s2)}x − x³. About the y-axis its radius is x: V = 2π ∫ from 0 to ${n(s)} of (${n(s2)}x² − x⁴) dx = 2π(${n(s5)} ÷ 3 − ${n(s5)} ÷ 5) = 2π × ${fr(2 * s5, 15)} = ${pi(fr(4 * s5, 15))}, so k₁ = ${fr(4 * s5, 15)}. About x = ${n(-e)} the radius is x + ${n(e)}, which adds 2π × ${n(e)} × ∫ from 0 to ${n(s)} of (${n(s2)}x − x³) dx = 2π × ${n(e)} × ${fr(s4, 4)} = ${pi(fr(e * s4, 2))}. So k₂ = ${fr(4 * s5, 15)} + ${fr(e * s4, 2)} = ${fr(8 * s5 + 15 * e * s4, 30)}.`,
  guidance: [
   { prompt: `Where do y = ${n(s2)}x and y = x³ meet, for positive x?`, answer: [s], explanation: `${n(s2)}x = x³ gives x² = ${n(s2)}, so x = ${n(s)}. The line is higher between 0 and ${n(s)}.` },
   { prompt: `About the y-axis, V = 2π ∫ from 0 to ${n(s)} of x(${n(s2)}x − x³) dx. What is k₁, where V = k₁π?`, answer: [K1], explanation: `x(${n(s2)}x − x³) = ${n(s2)}x² − x⁴, so V = 2π(${n(s5)} ÷ 3 − ${n(s5)} ÷ 5) = ${pi(fr(4 * s5, 15))}.` },
   { prompt: `About x = ${n(-e)}, the radius is x + ${n(e)}. What is k₂?`, answer: [K2], explanation: `The extra radius ${n(e)} adds 2π × ${n(e)} × ∫ (${n(s2)}x − x³) dx = 2π × ${n(e)} × ${fr(s4, 4)} = ${pi(fr(e * s4, 2))}, so k₂ = ${fr(4 * s5, 15)} + ${fr(e * s4, 2)} = ${fr(8 * s5 + 15 * e * s4, 30)}.` }
  ] }; }
});

/* Counterweight dome: region under y = a/(x²+1), 0 to b, about the y-axis. V = a·π·ln(1+b²), so k = a·ln(1+b²). */
mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q05', title: 'The counterweight dome',
 brief: 'The crane’s counterweight is a domed shape whose volume needs a shell integral that ends in a logarithm.',
 labels: ['upper limit in u', 'k'], tolerance: 0.005,
 gl: [['lower limit in u', 'upper limit in u'], ['integral of 1/u'], ['k']]
}, {
 canonical: { a: 3, b: 2 },
 draw: R => { let p; do { p = { a: R.int(2, 9), b: R.int(2, 5) }; } while (edge(p.a * Math.log(1 + p.b * p.b), 2)); return p; },
 build: ({ a, b }) => { const U = 1 + b * b, lnU = Math.log(U), k = a * lnU; return {
  prompt: `The counterweight for the crane is a dome turned from the region under the curve y = ${n(a)}/(x² + 1), from x = 0 to x = ${n(b)}, with lengths in metres. Spin the region about the y-axis, use cylindrical shells, and put u = 1 + x² to do the integral. The volume is kπ m³. Enter the upper limit of the integral in u, then k to 2 decimal places.`,
  answer: [U, rd(k, 2)],
  hints: [`The shell at x has radius x and height ${n(a)}/(x² + 1), so V = 2π ∫ x × ${n(a)}/(x² + 1) dx. With u = 1 + x², du = 2x dx, so x dx = du ÷ 2.`, 'The integral of 1/u is ln u. Change the limits of x to limits of u before you evaluate it, and use a calculator for the logarithm at the end.'],
  solution: `V = 2π ∫ from 0 to ${n(b)} of ${n(a)}x/(x² + 1) dx. Put u = 1 + x², so x dx = du ÷ 2; x = 0 gives u = 1 and x = ${n(b)} gives u = ${n(U)}. Then V = 2π × ${n(a)} × (1/2) ∫ from 1 to ${n(U)} of du/u = ${n(a)}π ln ${n(U)}. Since ln ${n(U)} is about ${fx(lnU, 4)}, k = ${n(a)} × ln ${n(U)}, which is about ${fx(k, 2)}.`,
  guidance: [
   { prompt: `With u = 1 + x², what do the limits x = 0 and x = ${n(b)} become?`, answer: [1, U], explanation: `x = 0 gives u = 1 + 0 = 1, and x = ${n(b)} gives u = 1 + ${n(b * b)} = ${n(U)}.` },
   { prompt: `After the substitution, V = ${n(a)}π ∫ from 1 to ${n(U)} of du/u. What is that integral, ln ${n(U)} − ln 1, to 2 decimal places?`, answer: [rd(lnU, 2)], explanation: `The integral of 1/u is ln u, and ln 1 = 0, so it is ln ${n(U)}, which is about ${fx(lnU, 2)}.` },
   { prompt: `k is ${n(a)} times ln ${n(U)}. What is k, to 2 decimal places?`, answer: [rd(k, 2)], explanation: `${n(a)} × ln ${n(U)} is about ${fx(k, 2)}.` }
  ] }; }
});

/* ---- q13 Arc length of a curve [2.4] ---- */

/* y = (2t/3)x^(3/2) from x = p to b: (dy/dx)² = t²x, u = 1 + t²x, L = 2(U2^(3/2) − U1^(3/2)) ÷ (3t²). */
mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The guide wire',
 brief: 'A guide wire runs along a curve that does not start at the origin, and the crew needs its exact length before cutting it.',
 labels: ['lower limit in u', 'upper limit in u', 'length (m)'], tolerance: 0.005,
 gl: [['(dy/dx)²'], ['lower limit in u', 'upper limit in u'], ['length (m)']]
}, {
 canonical: { t: 2, p: 1, b: 3 },
 draw: R => { let q; do { const t = R.int(1, 2), p = R.int(1, 4); q = { t, p, b: p + R.int(1, 5) }; } while (edge(2 * (Math.pow(1 + q.t * q.t * q.b, 1.5) - Math.pow(1 + q.t * q.t * q.p, 1.5)) / (3 * q.t * q.t), 2)); return q; },
 build: ({ t, p, b }) => { const t2 = t * t, U1 = 1 + t2 * p, U2 = 1 + t2 * b, a1 = Math.pow(U1, 1.5), a2 = Math.pow(U2, 1.5), L = 2 * (a2 - a1) / (3 * t2), m = t === 1 ? '(2/3)' : '(4/3)'; return {
  prompt: `A guide wire for the cargo crane runs along the curve y = ${m}x^(3/2) between x = ${n(p)} and x = ${n(b)}, in metres. To cut the wire, the crew needs the arc length of that piece of curve. Change the variable with u = 1 + (dy/dx)²; the curve does not start at x = 0, so the lower limit in u is not 1. Enter the value of u at x = ${n(p)}, the value of u at x = ${n(b)}, and then the length of the wire in metres to 2 decimal places.`,
  answer: [U1, U2, rd(L, 2)],
  hints: [`Use the power rule: the derivative of ${m}x^(3/2) is ${co(t, '√x')}. Square dy/dx before you add 1.`, `The arc length is ∫ from ${n(p)} to ${n(b)} of √(1 + (dy/dx)²) dx. When you change to u, put each x-limit into 1 + (dy/dx)² to get the new limits.`],
  solution: `dy/dx = ${co(t, '√x')}, so (dy/dx)² = ${co(t2, 'x')} and u = 1 + ${co(t2, 'x')}, with du = ${n(t2)} dx. At x = ${n(p)}, u = ${n(U1)}; at x = ${n(b)}, u = ${n(U2)}. Then L = (1 ÷ ${n(t2)}) ∫ from ${n(U1)} to ${n(U2)} of √u du = (1 ÷ ${n(t2)}) × (2/3)(${n(U2)}^(3/2) − ${n(U1)}^(3/2)) = (2 ÷ ${n(3 * t2)}) × (${n(a2)} − ${n(a1)}), which is about ${fx(L, 2)}. The wire is ${fx(L, 2)} m long.`,
  guidance: [
   { prompt: `What is (dy/dx)² at x = 4?`, answer: [4 * t2], explanation: `dy/dx = ${co(t, '√x')}, so (dy/dx)² = ${co(t2, 'x')}, which is ${n(4 * t2)} when x = 4.` },
   { prompt: `With u = 1 + ${co(t2, 'x')}, what do the limits x = ${n(p)} and x = ${n(b)} become?`, answer: [U1, U2], explanation: `x = ${n(p)} gives u = 1 + ${n(t2 * p)} = ${n(U1)}, and x = ${n(b)} gives u = 1 + ${n(t2 * b)} = ${n(U2)}.` },
   { prompt: `L = (2 ÷ ${n(3 * t2)}) × (${n(U2)}^(3/2) − ${n(U1)}^(3/2)). What is the length, to 2 decimal places?`, answer: [rd(L, 2)], explanation: `${n(U2)}^(3/2) is about ${n(a2)} and ${n(U1)}^(3/2) is about ${n(a1)}. Then (2 ÷ ${n(3 * t2)}) × ${n(a2 - a1)} is about ${fx(L, 2)} m.` }
  ] }; }
});

/* y = (2/3)(x − 1)^(3/2) from x = 1 to b: 1 + (dy/dx)² = x, L = (2/3)(b^(3/2) − 1); cable sold in lengths of s. */
mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The power cable run',
 brief: 'A power cable has to follow a curved gantry arm, and the stores need to know how many whole drums to send.',
 labels: ['length (m)', 'drums needed'], tolerance: 0.005,
 gl: [['1 + (dy/dx)²'], ['length (m)'], ['drums needed']]
}, {
 canonical: { b: 9, s: 5 },
 draw: R => { let q; do { q = { b: R.int(3, 10), s: R.int(3, 7) }; const L = 2 * (Math.pow(q.b, 1.5) - 1) / 3, f = L / q.s - Math.floor(L / q.s);
   if (edge(L, 2) || f < 0.04 || f > 0.96) q = null; } while (!q); return q; },
 build: ({ b, s }) => { const b15 = Math.pow(b, 1.5), L = 2 * (b15 - 1) / 3, L2 = rd(L, 2), drums = Math.ceil(L / s); return {
  prompt: `A power cable for the crane runs along the curve y = (2/3)(x − 1)^(3/2) from x = 1 to x = ${n(b)}, with lengths in metres. The cable comes on drums of ${n(s)} m each, and a drum cannot be shared with another job. Enter the length of cable the run needs, in metres to 2 decimal places, then the number of drums to send so that the run is covered.`,
  answer: [L2, drums],
  hints: ['Use the power rule and the chain rule: the derivative of (x − 1)^(3/2) is (3/2)(x − 1)^(1/2). Square dy/dx and add 1; the result is simple, and so is the integral of its square root.', `The length is ∫ from 1 to ${n(b)} of √(1 + (dy/dx)²) dx. Divide the length by the drum length and round up to the next whole number, because a part-used drum still has to be sent.`],
  solution: `dy/dx = (x − 1)^(1/2), so 1 + (dy/dx)² = 1 + (x − 1) = x. The length is L = ∫ from 1 to ${n(b)} of √x dx = (2/3)(${n(b)}^(3/2) − 1) = (2/3)(${n(b15)} − 1), which is about ${fx(L, 2)} m. Each drum holds ${n(s)} m, and ${fx(L, 2)} ÷ ${n(s)} is about ${fx(L / s, 2)}, so ${n(drums)} drums are needed.`,
  guidance: [
   { prompt: `Here dy/dx = √(x − 1). What is 1 + (dy/dx)² when x = 5?`, answer: [5], explanation: `(dy/dx)² = x − 1, so 1 + (dy/dx)² = x. At x = 5 it is 5, so the length is the integral of √x.` },
   { prompt: `Since 1 + (dy/dx)² = x, the length is ∫ from 1 to ${n(b)} of √x dx. What is it, to 2 decimal places?`, answer: [L2], explanation: `An antiderivative of √x is (2/3)x^(3/2), so L = (2/3)(${n(b15)} − 1), which is about ${fx(L, 2)} m.` },
   { prompt: `The run needs ${fx(L, 2)} m and each drum holds ${n(s)} m. How many drums must be sent?`, answer: [drums], explanation: `${fx(L, 2)} ÷ ${n(s)} is about ${fx(L / s, 2)}. Round up to the next whole drum: ${n(drums)}.` }
  ] }; }
});

/* y = x³/(6t) + t/(2x), p to b: √(1 + y′²) = x²/(2t) + t/(2x²), L = F(b) − F(p) with F = x³/(6t) − t/(2x); average = L ÷ (b − p). */
const CURVE = {
 1: { y: 'x³/6 + 1/(2x)', dy: 'x²/2 − 1/(2x²)', A: 'x²/2', B: '1/(2x²)', F: 'x³/6 − 1/(2x)' },
 2: { y: 'x³/12 + 1/x', dy: 'x²/4 − 1/x²', A: 'x²/4', B: '1/x²', F: 'x³/12 − 1/x' },
 3: { y: 'x³/18 + 3/(2x)', dy: 'x²/6 − 3/(2x²)', A: 'x²/6', B: '3/(2x²)', F: 'x³/18 − 3/(2x)' },
 4: { y: 'x³/24 + 2/x', dy: 'x²/8 − 2/x²', A: 'x²/8', B: '2/x²', F: 'x³/24 − 2/x' }
};
mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q03', title: 'The tension cable',
 brief: 'A tension cable on the gantry follows a curve whose length integral hides a perfect square, and the crew also wants its average stretch.',
 labels: ['length (m)', 'average stretch factor'], tolerance: 0.005,
 gl: [['length (m)'], ['average stretch factor']]
}, {
 canonical: { t: 1, p: 2, b: 5 },
 draw: R => { let q; do { const t = R.int(1, 4), p = R.int(1, 3); q = { t, p, b: p + R.int(1, 3) };
   const F = x => x * x * x / (6 * t) - t / (2 * x), L = F(q.b) - F(p); if (edge(L, 2) || edge(L / (q.b - p), 2) || rd(rd(L, 2) / (q.b - p), 2) !== rd(L / (q.b - p), 2)) q = null; } while (!q); return q; },
 build: ({ t, p, b }) => { const c = CURVE[t], F = x => x * x * x / (6 * t) - t / (2 * x), sf = x => x * x / (2 * t) + t / (2 * x * x), Fp = F(p), Fb = F(b), L = Fb - Fp, avg = L / (b - p); return {
  prompt: `A tension cable on the crane gantry follows the curve y = ${c.y} from x = ${n(p)} to x = ${n(b)}, in metres. The stretch factor of the curve at x is √(1 + (dy/dx)²), and the length of the cable is the integral of the stretch factor over the run. Enter the length of the cable in metres, then the average value of the stretch factor over the run, each to 2 decimal places.`,
  answer: [rd(L, 2), rd(avg, 2)],
  hints: [`Work out dy/dx, then square it and add 1. The result is a perfect square, (${c.A} + ${c.B})², so the square root has no root sign left.`, 'Integrate the stretch factor term by term with the power rule and put in the limits. The average value is the length divided by the width of the run.'],
  solution: `dy/dx = ${c.dy}. Squaring gives (${c.A})² − 1/2 + (${c.B})², because the middle term is 2 × (${c.A}) × (${c.B}) = 1/2. Adding 1 turns the −1/2 into +1/2, so 1 + (dy/dx)² = (${c.A})² + 1/2 + (${c.B})² = (${c.A} + ${c.B})², and the stretch factor is ${c.A} + ${c.B}. The length is L = ∫ from ${n(p)} to ${n(b)} of (${c.A} + ${c.B}) dx = [${c.F}] from ${n(p)} to ${n(b)} = ${n(Fb)} − ${par(Fp)}, which is about ${fx(L, 2)} m. The average stretch factor is ${fx(L, 2)} ÷ ${n(b - p)}, which is about ${fx(avg, 2)}.`,
  guidance: [
   { prompt: `An antiderivative of ${c.A} + ${c.B} is ${c.F}. Put in the limits ${n(p)} and ${n(b)}: what is the length, to 2 decimal places?`, answer: [rd(L, 2)], explanation: `At x = ${n(b)} it is ${n(Fb)} and at x = ${n(p)} it is ${n(Fp)}, so L = ${n(Fb)} − ${par(Fp)}, which is about ${fx(L, 2)} m.` },
   { prompt: `The average value is the length divided by the width of the run, ${n(b - p)} m. What is the average stretch factor, to 2 decimal places?`, answer: [rd(avg, 2)], explanation: `${fx(L, 2)} ÷ ${n(b - p)} is about ${fx(avg, 2)}.` }
  ] }; }
});

/* ---- q14 Work done by a varying force; springs [2.5] ---- */

/* Door closer in centimetres: k = 20j N/m, F = k·s/100 at s cm, work from natural length to d cm = k(d/100)² ÷ 2. */
mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The airlock door closer',
 brief: 'The airlock door closer is a spring measured in centimetres, and the maintenance sheet wants its stiffness and the work to open the door.',
 labels: ['k (N/m)', 'work (J)'], tolerance: 0.005,
 gl: [['stretch (m)'], ['k (N/m)'], ['work (J)']]
}, {
 canonical: { j: 16, s: 25, d: 20 },
 draw: R => { let q; do { q = { j: R.int(5, 30), s: R.pick([5, 10, 20, 25]), d: R.pick([10, 20, 30, 40]) }; } while (q.j * 20 * q.s / 100 === 20 && q.s === 10); return q; },
 build: ({ j, s, d }) => { const k = 20 * j, F = k * s / 100, sm = s / 100, dm = d / 100, sq = rd(dm * dm, 4), W = rd(k * dm * dm / 2, 4); return {
  prompt: `The closer on an airlock door has a spring that needs a force of ${n(F)} N to hold it ${n(s)} cm beyond its natural length. By Hooke’s law, the force at a stretch of x metres is F(x) = kx newtons, so lengths must be in metres. Enter the spring constant k in newtons per metre, then the work in joules needed to stretch the spring from its natural length to ${n(d)} cm.`,
  answer: [k, W],
  hints: ['Change the centimetres to metres first, by dividing by 100. Then Hooke’s law at the reading gives k as the force divided by the stretch.', 'The force grows as the spring stretches, so the work is the integral of kx from the natural length (x = 0) to the final stretch in metres.'],
  solution: `${n(s)} cm is ${n(sm)} m, so k = ${n(F)} ÷ ${n(sm)} = ${n(k)} N/m. The final stretch is ${n(d)} cm = ${n(dm)} m. The work is W = ∫ from 0 to ${n(dm)} of ${n(k)}x dx = ${n(k)} × ${n(dm)}² ÷ 2 = ${n(k / 2)} × ${n(sq)} = ${n(W)} J.`,
  guidance: [
   { prompt: `What is the stretch of ${n(s)} cm in metres?`, answer: [sm], explanation: `${n(s)} ÷ 100 = ${n(sm)} m.` },
   { prompt: `${n(F)} N holds the spring ${n(sm)} m out. What is k, the force for each metre of stretch?`, answer: [k], explanation: `k = ${n(F)} ÷ ${n(sm)} = ${n(k)} newtons per metre.` },
   { prompt: `The final stretch is ${n(dm)} m. What is the work, ∫ from 0 to ${n(dm)} of ${n(k)}x dx, in joules?`, answer: [W], explanation: `An antiderivative of ${n(k)}x is ${n(k / 2)}x², so W = ${n(k / 2)} × ${n(sq)} = ${n(W)} J.` }
  ] }; }
});

/* A mass of m kg hangs on the spring and stretches it s m (s = s10/10); k = 9.8m ÷ s; work from s to s + e (e = e10/10). */
mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'The hanging basket',
 brief: 'A load cell hangs a basket from a spring, and the crew needs the spring’s stiffness and the work to stretch it further.',
 labels: ['weight (N)', 'k (N/m)', 'work (J)'], tolerance: 0.005,
 gl: [['weight (N)'], ['k (N/m)'], ['work (J)']]
}, {
 canonical: { m: 10, s10: 2, e10: 3 },
 draw: R => { let q; do { q = { m: R.pick([5, 10, 15, 20, 25]), s10: R.pick([1, 2, 4, 5]), e10: R.int(1, 3) };
   const s = q.s10 / 10, e = q.e10 / 10; if (edge(9.8 * q.m / s * e * (2 * s + e) / 2, 2)) q = null; } while (!q); return q; },
 build: ({ m, s10, e10 }) => { const s = s10 / 10, e = e10 / 10, x2 = rd((s + e) * (s + e), 4), x1 = rd(s * s, 4), F = rd(9.8 * m, 4), k = rd(F / s, 4), W = k * (x2 - x1) / 2; return {
  prompt: `A load cell on the crane hangs a basket of mass ${n(m)} kg from a spring, and the basket hangs at rest with the spring stretched ${n(s)} m beyond its natural length. Take g = 9.8 m/s²; the spring’s force at the resting stretch equals the basket’s weight (mass × 9.8). By Hooke’s law the force at a stretch of x metres is F(x) = kx newtons. Enter the weight of the basket in newtons, the spring constant k in newtons per metre, and the work in joules done against the spring’s own force (the basket’s weight left out) to stretch the spring a further ${n(e)} m beyond its resting stretch, to 2 decimal places. Type the answers without commas.`,
  answer: [F, k, rd(W, 2)],
  hints: ['At rest, the spring’s force equals the weight. Use that force and the resting stretch in Hooke’s law to find k.', 'The extra work runs from the resting stretch to the resting stretch plus the extra, with F(x) = kx: integrate between those two stretches.'],
  solution: `The weight is ${n(m)} × 9.8 = ${n(F)} N. At the resting stretch, ${n(F)} = k × ${n(s)}, so k = ${n(F)} ÷ ${n(s)} = ${n(k)} N/m. Only the spring’s own force counts here. The spring goes from ${n(s)} m to ${n(rd(s + e, 4))} m, so W = ∫ from ${n(s)} to ${n(rd(s + e, 4))} of ${n(k)}x dx = ${n(k / 2)} × (${n(x2)} − ${n(x1)}) = ${fx(W, 2)} J.`,
  guidance: [
   { prompt: `What does a basket of mass ${n(m)} kg weigh, with g = 9.8 m/s²?`, answer: [F], explanation: `${n(m)} × 9.8 = ${n(F)} N.` },
   { prompt: `${n(F)} N holds the spring ${n(s)} m out. What is k?`, answer: [k], explanation: `k = ${n(F)} ÷ ${n(s)} = ${n(k)} newtons per metre.` },
   { prompt: `What is the work, ∫ from ${n(s)} to ${n(rd(s + e, 4))} of ${n(k)}x dx, in joules, to 2 decimal places?`, answer: [rd(W, 2)], explanation: `An antiderivative of ${n(k)}x is ${n(k / 2)}x², so W = ${n(k / 2)} × (${n(x2)} − ${n(x1)}) = ${fx(W, 2)} J.` }
  ] }; }
});

/* Work known, k unknown: k = 2W1 ÷ x1², then work from x1 to x2. k = 50m. */
mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', title: 'The brake spring',
 brief: 'The cargo lift’s brake spring has no label, only a record of the work it took to stretch it, and the crew must work out how stiff it is.',
 labels: ['k (N/m)', 'work (J)'], tolerance: 0.005,
 gl: [['k (N/m)'], ['force (N)'], ['work (J)']]
}, {
 canonical: { m: 8, x10: 2, d10: 3 },
 draw: R => ({ m: R.int(2, 12), x10: R.int(1, 4), d10: R.int(1, 3) }),
 build: ({ m, x10, d10 }) => { const k = 50 * m, x1 = x10 / 10, x2 = rd((x10 + d10) / 10, 4), W1 = rd(k * x1 * x1 / 2, 4), q1 = rd(x1 * x1, 4), q2 = rd(x2 * x2, 4), F2 = rd(k * x2, 4), W2 = rd(k * (q2 - q1) / 2, 4); return {
  prompt: `The brake spring of a cargo lift has lost its label. A record shows that stretching it from its natural length to ${n(x1)} m took ${n(W1)} J of work. By Hooke’s law the force at a stretch of x metres is F(x) = kx newtons. Work out k from that record, then the work in joules needed to stretch the spring further, from ${n(x1)} m to ${n(x2)} m. Enter k in newtons per metre, then that work.`,
  answer: [k, W2],
  hints: ['The work from the natural length to a stretch X is the integral of kx from 0 to X, which is k × X² ÷ 2. Set that equal to the work in the record and solve for k.', 'Once you know k, integrate kx between the two stretches in the question, not from zero.'],
  solution: `From the record, ${n(W1)} = ∫ from 0 to ${n(x1)} of kx dx = k × ${n(q1)} ÷ 2, so k = 2 × ${n(W1)} ÷ ${n(q1)} = ${n(k)} N/m. The further work is ∫ from ${n(x1)} to ${n(x2)} of ${n(k)}x dx = ${n(k / 2)} × (${n(q2)} − ${n(q1)}) = ${n(W2)} J.`,
  guidance: [
   { prompt: `Set ${n(W1)} = k × ${n(x1)}² ÷ 2 and solve it. What is k?`, answer: [k], explanation: `${n(x1)}² = ${n(q1)}, so ${n(W1)} = k × ${n(q1 / 2)}, and k = ${n(W1)} ÷ ${n(q1 / 2)} = ${n(k)} N/m.` },
   { prompt: `With k = ${n(k)}, what force holds the spring at x = ${n(x2)}, the end of the stretch?`, answer: [F2], explanation: `F(${n(x2)}) = ${n(k)} × ${n(x2)} = ${n(F2)} N.` },
   { prompt: `What is the work, ∫ from ${n(x1)} to ${n(x2)} of ${n(k)}x dx, in joules?`, answer: [W2], explanation: `An antiderivative of ${n(k)}x is ${n(k / 2)}x², so W = ${n(k / 2)} × (${n(q2)} − ${n(q1)}) = ${n(W2)} J.` }
  ] }; }
});

/* ---- q15 Pumping water out of a tank [2.5] ---- */

/* Box tank, brine of density ρ: W = ρ·9.8·l·w·∫₀^D (H + h − y) dy. */
mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The coolant tank',
 brief: 'A box-shaped coolant tank has to be emptied for servicing, and the crew needs the work the pump will do on the brine.',
 labels: ['mass of a 1 m slice (kg)', 'work (kJ)'], tolerance: 0.05,
 gl: [['cross-section (m²)', 'mass of a 1 m slice (kg)'], ['integral of the lift (m²)'], ['work (kJ)']]
}, {
 canonical: { l: 4, w: 3, H: 3, D: 2, h: 2, rho: 1200 },
 draw: R => { let q; do { const H = R.int(2, 5); q = { l: R.int(2, 5), w: R.int(2, 4), H, D: R.int(Math.max(2, H - 2), H), h: R.int(1, 3), rho: R.pick([800, 900, 1100, 1200, 1300]) };
   if (edge(9.8 * q.rho / 1000 * q.l * q.w * (q.D * (q.H + q.h) - q.D * q.D / 2), 1)) q = null; } while (!q); return q; },
 build: ({ l, w, H, D, h, rho }) => { const A = l * w, top = H + h, I = D * top - D * D / 2, wt = rd(9.8 * rho * A, 4), WJ = wt * I, Wk = rd(WJ / 1000, 1); return {
  prompt: `A coolant tank at the foot of the crane is a box ${n(l)} m long, ${n(w)} m wide and ${n(H)} m tall, holding brine to a depth of ${n(D)} m. The brine has density ${n(rho)} kg/m³, and g = 9.8 m/s². A pump lifts all of the brine out through a pipe whose outlet is ${n(h)} m above the top of the tank. Measure y in metres up from the bottom of the tank. Enter the mass in kilograms of a slice of brine 1 m thick, then the work needed to pump the tank empty in kilojoules to 1 decimal place. Type both without commas.`,
  answer: [rho * A, Wk],
  hints: ['A slice of brine 1 m thick has the tank’s cross-section as its area, so its volume is that area times 1. Its mass is the density times that volume. Its weight is 9.8 times the mass, and a slice of thickness dy weighs the 1 m weight times dy.', 'Each slice rises from its own height y to the outlet: the tank height plus the outlet height, minus y. Integrate the weight of a slice times that distance from y = 0 to the depth of the brine.'],
  solution: `The cross-section is ${n(l)} × ${n(w)} = ${n(A)} m², so a slice 1 m thick has volume ${n(A)} m³, mass ${n(rho)} × ${n(A)} = ${n(rho * A)} kg and weight ${n(rho * A)} × 9.8 = ${n(wt)} N. The outlet is ${n(H)} + ${n(h)} = ${n(top)} m above the bottom, so a slice at height y rises ${n(top)} − y metres. The work is W = ${n(wt)} ∫ from 0 to ${n(D)} of (${n(top)} − y) dy = ${n(wt)} × (${n(D * top)} − ${n(D * D / 2)}) = ${n(wt)} × ${n(I)}, which is about ${n(Math.round(WJ))} J, or ${fx(WJ / 1000, 1)} kJ.`,
  guidance: [
   { prompt: `What is the area of the tank’s cross-section, and what is the mass of a slice of brine 1 m thick (density ${n(rho)} kg/m³)?`, answer: [A, rho * A], explanation: `The area is ${n(l)} × ${n(w)} = ${n(A)} m². The slice has volume ${n(A)} m³, so its mass is ${n(rho)} × ${n(A)} = ${n(rho * A)} kg.` },
   { prompt: `A slice at height y is lifted ${n(top)} − y metres. Work out ∫ from 0 to ${n(D)} of (${n(top)} − y) dy.`, answer: [I], explanation: `An antiderivative is ${n(top)}y − y² ÷ 2, so the integral is ${n(D * top)} − ${n(D * D / 2)} = ${n(I)}.` },
   { prompt: `A slice 1 m thick has mass ${n(rho * A)} kg, so it weighs ${n(rho * A)} × 9.8 = ${n(wt)} newtons for each metre of thickness. What is the work in kilojoules, to 1 decimal place?`, answer: [Wk], explanation: `${n(wt)} × ${n(I)} is about ${n(Math.round(WJ))} J. Dividing by 1000 gives ${fx(WJ / 1000, 1)} kJ.` }
  ] }; }
});

/* Cylinder tank, water; pump delivers P kW: work in kJ and time in minutes = kJ ÷ (60P). */
mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The irrigation pump',
 brief: 'The greenhouse irrigation tank has to be emptied by a pump of known power, and the crew wants to know how long the job will take.',
 labels: ['work (kJ)', 'time (minutes)'], tolerance: 0.05,
 gl: [['lift of the surface (m)'], ['work (kJ)'], ['time (minutes)']]
}, {
 canonical: { r: 2, H: 3, D: 2, h: 1, P: 2.5 },
 draw: R => { let q; do { const H = R.int(2, 5); q = { r: R.int(1, 3), H, D: R.int(Math.max(2, H - 2), H), h: R.int(1, 3), P: R.pick([1.5, 2, 2.5, 4, 5]) };
   const WJ = 9800 * Math.PI * q.r * q.r * (q.D * (q.H + q.h) - q.D * q.D / 2);
   if (edge(WJ / 1000, 1) || edge(WJ / 1000 / (60 * q.P), 1)) q = null; } while (!q); return q; },
 build: ({ r, H, D, h, P }) => { const A = r * r, top = H + h, I = D * top - D * D / 2, WJ = 9800 * Math.PI * A * I, Wk = rd(WJ / 1000, 1), mins = rd(WJ / 1000 / (60 * P), 1), per = `${n(9800 * A)}π`; return {
  prompt: `The irrigation tank for the greenhouse is an upright cylinder of radius ${n(r)} m and height ${n(H)} m, filled with water to a depth of ${n(D)} m. A pump lifts all of the water out through a pipe whose outlet is ${n(h)} m above the top of the tank, and it delivers ${n(P)} kW of useful power (1 kW is 1000 J every second). Water has density 1000 kg/m³, and g = 9.8 m/s². Measure y in metres up from the bottom of the tank. Enter the work needed to pump the tank empty in kilojoules to 1 decimal place (type it without commas), then the time the pump takes in minutes to 1 decimal place.`,
  answer: [Wk, mins],
  hints: ['A thin slice of water at height y has volume (area of the circle) × dy. Its weight is 1000 × 9.8 times that volume, and it is lifted from y up to the outlet, a distance of the tank height plus the outlet height, minus y.', 'Power is work per second. Work in kilojoules divided by power in kilowatts gives the time in seconds; divide by 60 to turn seconds into minutes.'],
  solution: `The cross-section is a circle of area π × ${n(r)}² = ${n(A)}π m², so a slice of thickness dy weighs 1000 × 9.8 × ${n(A)}π dy = ${per} dy newtons. The outlet is ${n(H)} + ${n(h)} = ${n(top)} m above the bottom, so a slice at height y rises ${n(top)} − y metres. The work is W = ${per} ∫ from 0 to ${n(D)} of (${n(top)} − y) dy = ${per} × ${n(I)}, which is about ${n(Math.round(WJ))} J, or ${fx(WJ / 1000, 1)} kJ. At ${n(P)} kW the pump does ${n(P)} kJ every second, so it takes ${fx(WJ / 1000, 1)} ÷ ${n(P)} seconds, which is ${fx(WJ / 1000 / P, 1)} seconds. Dividing by 60 gives about ${fx(WJ / 1000 / (60 * P), 1)} minutes.`,
  guidance: [
   { prompt: `How far must a slice at the surface of the water, y = ${n(D)}, be lifted to reach the outlet?`, answer: [top - D], explanation: `The outlet is ${n(H)} + ${n(h)} = ${n(top)} m above the bottom, so a slice at y = ${n(D)} rises ${n(top)} − ${n(D)} = ${n(top - D)} m.` },
   { prompt: `A slice weighs ${per} newtons for each metre of thickness and is lifted ${n(top)} − y metres. What is the work in kilojoules, to 1 decimal place?`, answer: [Wk], explanation: `W = ${per} × (${n(D * top)} − ${n(D * D / 2)}) = ${per} × ${n(I)}, about ${n(Math.round(WJ))} J, which is ${fx(WJ / 1000, 1)} kJ.` },
   { prompt: `The pump delivers ${n(P)} kJ every second. How many minutes does it need for ${fx(WJ / 1000, 1)} kJ, to 1 decimal place?`, answer: [mins], explanation: `${fx(WJ / 1000, 1)} ÷ ${n(P)} is the time in seconds. Dividing that by 60 gives about ${fx(WJ / 1000 / (60 * P), 1)} minutes.` }
  ] }; }
});

/* V-shaped trough, length L, width s·y at height y: slice area L·s·y. W = 9800·L·s·(top·D²/2 − D³/3) J. */
mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q09', title: 'The V-shaped trough',
 brief: 'A cooling trough with a pointed bottom has to be pumped dry, and its slices get wider as the water gets higher.',
 labels: ['surface width (m)', 'work (kJ)'], tolerance: 0.05,
 gl: [['surface width (m)'], ['integral of y(lift)'], ['work (kJ)']]
}, {
 canonical: { L: 4, s: 2, H: 3, D: 3, h: 1 },
 draw: R => { let q; do { const H = R.int(2, 4); q = { L: R.int(2, 6), s: R.int(1, 3), H, D: R.int(Math.max(2, H - 1), H), h: R.int(1, 2) };
   if (edge(9.8 * q.L * q.s * ((q.H + q.h) * q.D * q.D / 2 - q.D * q.D * q.D / 3), 1)) q = null; } while (!q); return q; },
 build: ({ L, s, H, D, h }) => { const top = H + h, J = top * D * D / 2 - D * D * D / 3, Jt = fr(3 * top * D * D - 2 * D * D * D, 6), WJ = 9800 * L * s * J, Wk = rd(WJ / 1000, 1); return {
  prompt: `A cooling trough at the foot of the gantry is ${n(L)} m long. Its ends are V-shaped, with a sharp bottom edge: at a height of y metres above that edge the trough is ${co(s, 'y')} metres wide, measured across. It holds water to a depth of ${n(D)} m. A pump lifts all of the water out through a pipe whose outlet is ${n(h)} m above the top of the trough, which is ${n(H)} m above the bottom edge. Water has density 1000 kg/m³, and g = 9.8 m/s². Enter the width of the water’s surface in metres, then the work needed to pump the trough empty in kilojoules to 1 decimal place (type it without commas).`,
  answer: [s * D, Wk],
  hints: [`A slice of water at height y is a thin slab ${n(L)} m long and as wide as the trough is at that height, so its area is the length times that width, and its volume is that area times dy. Its weight is 1000 × 9.8 times the volume.`, 'Each slice rises from its own height y to the outlet: the trough height plus the outlet height, minus y. The width changes with y, so keep y inside the integral and integrate from 0 to the depth of the water.'],
  solution: `At the surface, y = ${n(D)}, the width is ${co(s, 'y')} = ${n(s * D)} m. A slice at height y has area ${n(L)} × ${co(s, 'y')} = ${co(L * s, 'y')} m², so it weighs 1000 × 9.8 × ${co(L * s, 'y')} dy = ${co(9800 * L * s, 'y')} dy newtons. The outlet is ${n(H)} + ${n(h)} = ${n(top)} m above the bottom, so the slice rises ${n(top)} − y metres. The work is W = ${n(9800 * L * s)} ∫ from 0 to ${n(D)} of y(${n(top)} − y) dy = ${n(9800 * L * s)} × (${n(top)} × ${n(D * D)} ÷ 2 − ${n(D * D * D)} ÷ 3) = ${n(9800 * L * s)} × ${Jt}, which is about ${n(Math.round(WJ))} J, or ${fx(WJ / 1000, 1)} kJ.`,
  guidance: [
   { prompt: `How wide is the trough at y = ${n(D)}, the surface of the water?`, answer: [s * D], explanation: `The width at height y is ${co(s, 'y')}, so at y = ${n(D)} it is ${n(s)} × ${n(D)} = ${n(s * D)} m.` },
   { prompt: `A slice at height y weighs ${co(9800 * L * s, 'y')} dy newtons and is lifted ${n(top)} − y metres, so the work is ${n(9800 * L * s)} ∫ from 0 to ${n(D)} of y(${n(top)} − y) dy. What is the integral ∫ from 0 to ${n(D)} of (${n(top)}y − y²) dy, to 1 decimal place?`, answer: [rd(J, 1)], explanation: `An antiderivative is ${n(top)}y² ÷ 2 − y³ ÷ 3, so the integral is ${n(top)} × ${n(D * D)} ÷ 2 − ${n(D * D * D)} ÷ 3 = ${Jt}, which is about ${fx(J, 1)}.` },
   { prompt: `The integral is exactly ${Jt}. Multiply it by ${n(9800 * L * s)}: what is the work in kilojoules, to 1 decimal place?`, answer: [Wk], explanation: `${n(9800 * L * s)} × ${Jt} is about ${n(Math.round(WJ))} J. Dividing by 1000 gives ${fx(WJ / 1000, 1)} kJ.` }
  ] }; }
});

})();
