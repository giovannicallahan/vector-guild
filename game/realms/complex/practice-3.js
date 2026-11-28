/* Complex analysis: the plane of numbers practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/complex/oracle-p3.js. */
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
const SUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
/* Complex numbers are pairs [re, im]. */
const add2 = (z, w) => [z[0] + w[0], z[1] + w[1]];
const sub = (z, w) => [z[0] - w[0], z[1] - w[1]];
const mul = (z, w) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]];
const scl = (k, z) => [k * z[0], k * z[1]];
const cnj = z => [z[0], -z[1]];
const pw = (z, k) => { let r = [1, 0]; for (let i = 0; i < k; i++) r = mul(r, z); return r; };
const m2 = z => z[0] * z[0] + z[1] * z[1];
const div = (z, w) => scl(1 / m2(w), mul(z, cnj(w)));
/* Text of a + bi: "3 − 4i", "−i", "2i", "5". pz puts a two-part or negative number in brackets. */
const cz = z => { const [a, b] = z.map(G.tidy); if (b === 0) return n(a); const ip = Math.abs(b) === 1 ? 'i' : n(Math.abs(b)) + 'i';
 if (a === 0) return (b < 0 ? '−' : '') + ip; return `${n(a)} ${b < 0 ? '−' : '+'} ${ip}`; };
const pz = z => { const t = cz(z); return /\s/.test(t) || t.startsWith('−') ? `(${t})` : t; };
/* Signed terms: trm(−1, 'x') '− x', trm(3, 'x') '+ 3x'; lead(−1, 'x³') '−x³'; cst(−4) '− 4'. */
const sgn = v => v < 0 ? '−' : '+';
const trm = (v, x) => `${sgn(v)} ${Math.abs(v) === 1 ? '' : n(Math.abs(v))}${x}`;
const lead = (v, x) => (v === 1 ? '' : v === -1 ? '−' : n(v)) + x;
const sgnj = v => v < 0 ? '−' : '+';
const cst = v => `${sgn(v)} ${n(Math.abs(v))}`;
/* Rounding to 2 and 4 places, and guards against values near a rounding tie (m is the margin, in units of the last place). */
const r2 = x => G.tidy(Math.round(x * 100) / 100);
const r4 = x => Math.round(x * 1e4) / 1e4;
const safe = (x, m) => Math.abs(Math.abs(x * 100) % 1 - 0.5) > (m || 0.02);
const f2 = x => r2(x).toFixed(2).replace('-', '−');
/* "≈ 2.2143, which is 2.21 to 2 decimal places", or "= 2.5" when the 4-place value already is the 2-place one. */
const to2 = x => n(r4(x)) === n(r2(x)) ? `= ${f2(x)}` : `≈ ${n(r4(x))}, which is ${f2(x)} to 2 decimal places`;
const isTidy = z => z.every(v => Math.abs(v * 100 - Math.round(v * 100)) < 1e-9);
/* A bounded retry: at most 1000 tries, then the fallback. */
const bounded = (R, make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return fallback; };
const quad = (a, b) => a > 0 ? (b > 0 ? 'the first quadrant (both parts positive)' : 'the fourth quadrant (real part positive, imaginary part negative)') : (b > 0 ? 'the second quadrant (real part negative, imaginary part positive)' : 'the third quadrant (both parts negative)');

/* ---- q11 Chapter review: the rotor log [1.7, 1.11] ---- */

/* Pythagorean pairs with a whole modulus. The learn mission's z = −3 + 4i and its worked example 5 + 12i are never drawn. */
const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [15, 8], [7, 24], [24, 7], [9, 12], [12, 9], [12, 16], [16, 12], [15, 20], [20, 15], [10, 24], [24, 10], [20, 21], [21, 20]];
const isLearn11 = (a, b) => (a === -3 && b === 4) || (a === 5 && b === 12);
const modOf = (a, b) => Math.round(Math.sqrt(a * a + b * b));
/* Principal argument of a + bi from arctan and the quadrant, with the text of how it is built. */
const arg11 = (a, b) => { const phi = Math.atan(Math.abs(b) / Math.abs(a)), P = 3.1416, f4 = r4(phi);
 const val = a > 0 ? (b > 0 ? phi : -phi) : (b > 0 ? Math.PI - phi : phi - Math.PI);
 const shown = a > 0 ? (b > 0 ? f4 : -f4) : (b > 0 ? P - f4 : f4 - P);
 const how = a > 0 ? (b > 0 ? `Arg z = ${n(f4)}` : `Arg z = −${n(f4)}`) : (b > 0 ? `Arg z = π − ${n(f4)} ≈ 3.1416 − ${n(f4)} = ${n(r4(shown))}` : `Arg z = −(π − ${n(f4)}) ≈ −(3.1416 − ${n(f4)}) = ${n(r4(shown))}`);
 return { phi, f4, val, shown, how }; };
const signed11 = R => { const [x, y] = R.pick(TRIPLES); return [R.bool() ? x : -x, R.bool() ? y : -y]; };

mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The shaft marker log',
 brief: 'A marker on the gearbox shaft is logged as a complex number, and the log keeps the logarithm of its position and of a power of it.',
 labels: ['Re Log z', 'Im Log z', 'Re Log(zⁿ)'], tolerance: 0.005,
 gl: [['|z|'], ['Re Log z'], ['Im Log z'], ['Re Log(zⁿ)']]
}, {
 /* z = a + bi has a whole modulus; k is the power (3, 4 or 5). Arg z, ln |z| and k ln |z| are kept clear of rounding ties. */
 canonical: { a: 8, b: -15, k: 3 },
 draw: R => bounded(R, R => { const [a, b] = signed11(R); return { a, b, k: R.pick([3, 4, 5]) }; },
  p => !isLearn11(p.a, p.b) && safe(Math.log(modOf(p.a, p.b))) && safe(arg11(p.a, p.b).val) && safe(p.k * Math.log(modOf(p.a, p.b))), { a: 8, b: -15, k: 3 }),
 build: ({ a, b, k }) => { const m = modOf(a, b), L = Math.log(m), K = k * L, A = arg11(a, b), z = [a, b], zk = `z${SUP[k]}`; return {
  prompt: `The gearbox shaft in the Rotor Hall carries a marker, and its position is logged as the complex number z = ${cz(z)}. The log stores the principal logarithm of each position. Angles are in radians. Enter the real part of Log z, then the imaginary part of Log z, then the real part of Log(${zk}), each to 2 decimal places.`,
  answer: [r2(L), r2(A.val), r2(K)],
  hints: ['Log z = ln |z| + i Arg z, so its real part depends only on the modulus, and its imaginary part is the principal argument, which lies in (−π, π]. Decide which quadrant z is in before using arctan.', `The modulus of a power is the power of the modulus, so Re Log(${zk}) = ln(|z|${SUP[k]}) = ${n(k)} ln |z|.`],
  solution: `|z| = √(${n(a * a)} + ${n(b * b)}) = √${n(m * m)} = ${n(m)}. Log z = ln |z| + i Arg z, so Re Log z = ln ${n(m)} ${to2(L)}. z lies in ${quad(a, b)}. arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(A.f4)}, so ${A.how}, which is ${f2(A.val)} to 2 decimal places: that is Im Log z. Then |${zk}| = ${n(m)}${SUP[k]}, so Re Log(${zk}) = ${n(k)} ln ${n(m)} ${to2(K)}.`,
  guidance: [
   { prompt: `What is the modulus of z = ${cz(z)}?`, answer: [m], explanation: `|z| = √(${par(a)}² + ${par(b)}²) = √${n(m * m)} = ${n(m)}.` },
   { prompt: `Log z = ln |z| + i Arg z. What is its real part, ln |z|, to 2 decimal places?`, answer: [r2(L)], explanation: `ln ${n(m)} ${to2(L)}.` },
   { prompt: `z lies in ${quad(a, b)}, and arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(A.f4)}. What is Im Log z = Arg z, to 2 decimal places?`, answer: [r2(A.val)], explanation: `${A.how}, which is ${f2(A.val)} to 2 decimal places. It lies in (−π, π], as a principal argument must.` },
   { prompt: `|${zk}| = |z|${SUP[k]}, so Re Log(${zk}) = ln(|z|${SUP[k]}) = ${n(k)} ln |z|. What is it, to 2 decimal places?`, answer: [r2(K)], explanation: `${n(k)} ln ${n(m)} ${to2(K)}.` }
  ] }; }
});

mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The tick alarm',
 brief: 'The rotor log multiplies the position by the same marker reading every tick, and an alarm must sound once the log grows past a limit.',
 labels: ['|z|', 'Re Log(zᵏ)', 'ticks until the alarm'], tolerance: 0.005,
 gl: [['|z|'], ['Re Log(zᵏ)'], ['ticks until the alarm']]
}, {
 /* z = a + bi has a whole modulus. L ÷ ln |z| is kept between 0.15 and 0.85 above a whole number so the whole-number answer is clear-cut. */
 canonical: { a: 6, b: -8, k: 4, L: 33 },
 draw: R => bounded(R, R => { const [a, b] = signed11(R); return { a, b, k: R.int(3, 6), L: R.int(12, 70) }; },
  p => { const l = Math.log(modOf(p.a, p.b)), q = p.L / l, fr = q - Math.floor(q); return !isLearn11(p.a, p.b) && safe(p.k * l) && fr > 0.15 && fr < 0.85 && Math.floor(q) + 1 !== p.k && q > 1; },
  { a: 6, b: -8, k: 4, L: 33 }),
 build: ({ a, b, k, L }) => { const m = modOf(a, b), l = Math.log(m), K = k * l, q = L / l, t = Math.floor(q) + 1, z = [a, b]; return {
  prompt: `Every tick, the rotor log in the Rotor Hall multiplies the rotor’s position by the marker reading z = ${cz(z)}, so after t ticks the position is zᵗ. The log stores the principal logarithm of the position, and the alarm sounds at the first whole tick t at which the real part of Log(zᵗ) is above ${n(L)}. Enter the modulus |z|, then the real part of Log(z${SUP[k]}) to 2 decimal places, then the number of ticks t at which the alarm first sounds.`,
  answer: [m, r2(K), t],
  hints: ['The modulus of z is √(a² + b²), and the modulus of a power is the power of the modulus: |zᵗ| = |z|ᵗ. The real part of Log w is ln |w|.', 'Re Log(zᵗ) = t ln |z|. For the alarm, divide the limit by ln |z| and take the first whole number above the result.'],
  solution: `|z| = √(${n(a * a)} + ${n(b * b)}) = √${n(m * m)} = ${n(m)}. The modulus of z${SUP[k]} is ${n(m)}${SUP[k]}, so Re Log(z${SUP[k]}) = ${n(k)} ln ${n(m)} ${to2(K)}. After t ticks Re Log(zᵗ) = t ln ${n(m)} ≈ t × ${n(r4(l))}, and this must be above ${n(L)}. So t must be above ${n(L)} ÷ ${n(r4(l))} ≈ ${n(Math.round(q * 100) / 100)}, and the first whole number above that is ${n(t)}.`,
  guidance: [
   { prompt: `What is the modulus of z = ${cz(z)}?`, answer: [m], explanation: `|z| = √(${par(a)}² + ${par(b)}²) = √${n(m * m)} = ${n(m)}.` },
   { prompt: `|z${SUP[k]}| = |z|${SUP[k]}, so Re Log(z${SUP[k]}) = ${n(k)} ln |z|. What is it, to 2 decimal places?`, answer: [r2(K)], explanation: `${n(k)} ln ${n(m)} ${to2(K)}.` },
   { prompt: `Re Log(zᵗ) = t ln |z| must be above ${n(L)}. What is the first whole number t for which that holds?`, answer: [t], explanation: `t must be above ${n(L)} ÷ ln ${n(m)} ≈ ${n(Math.round(q * 100) / 100)}, so the first whole tick is ${n(t)}.` }
  ] }; }
});

/* The numbers behind q11d: modulus, argument, |w| = |z|^p, the angle p Arg z and its cosine, Re w and Re Log w. */
const q11d = ({ a, b, p }) => { const m = modOf(a, b), A = arg11(a, b), W = Math.pow(m, p), ang = p * A.val, cs = Math.cos(ang); return { m, A, W, ang, cs, Re: W * cs, LW: p * Math.log(m) }; };

mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q10', title: 'Powers on the rotor log',
 brief: 'The rotor controller raises each position to a fractional power and stores the result, and the log needs its angle, its real part and its logarithm.',
 labels: ['Arg z (radians)', 'Re w', 'Re Log w'], tolerance: 0.005,
 gl: [['Arg z (radians)'], ['|w|'], ['Re w'], ['Re Log w']]
}, {
 /* z = a + bi has a whole modulus; p is 0.5, 1.5 or 2.5 and |w| = |z|^p stays below 60. All rounded values keep 0.1 clear of a tie. */
 canonical: { a: -6, b: 8, p: 1.5 },
 draw: R => bounded(R, R => { const [a, b] = signed11(R); return { a, b, p: R.pick([0.5, 1.5, 2.5]) }; },
  p => { const C = q11d(p); return !isLearn11(p.a, p.b) && C.W < 60 && safe(C.A.val, 0.1) && safe(C.W, 0.1) && safe(C.Re, 0.1) && safe(C.LW, 0.1); },
  { a: -6, b: 8, p: 1.5 }),
 build: ({ a, b, p }) => { const C = q11d({ a, b, p }), { m, A, W, ang, cs, Re, LW } = C, z = [a, b]; return {
  prompt: `The Rotor Hall controller raises a rotor position z = ${cz(z)} to the real power ${n(p)} and stores the principal value w = z^${n(p)}, which is |z|^${n(p)} e^(i × ${n(p)} × Arg z). Angles are in radians. Enter Arg z, then the real part of w, then the real part of Log w, each to 2 decimal places.`,
  answer: [r2(A.val), r2(Re), r2(LW)],
  hints: ['Arg z needs the quadrant of z first: Arg z lies in (−π, π], and arctan on its own only gives angles between −π ÷ 2 and π ÷ 2.', 'The principal value w = z^p has modulus |z|^p and angle p × Arg z, so its real part is |w| cos(p Arg z). The real part of Log w is ln |w|.'],
  solution: `|z| = √(${n(a * a)} + ${n(b * b)}) = ${n(m)}. z lies in ${quad(a, b)}. arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(A.f4)}, so ${A.how}, which is ${f2(A.val)} to 2 decimal places. The modulus of w is |z|^${n(p)} = ${n(m)}^${n(p)} ≈ ${n(r4(W))}, and its angle is ${n(p)} × Arg z ≈ ${n(r4(ang))}, whose cosine is ≈ ${n(r4(cs))}. So Re w = |w| cos(${n(p)} Arg z) ${to2(Re)}. Finally Re Log w = ln |w| = ${n(p)} ln ${n(m)} ${to2(LW)}.`,
  guidance: [
   { prompt: `z = ${cz(z)} lies in ${quad(a, b)}, and arctan(${n(Math.abs(b))} ÷ ${n(Math.abs(a))}) ≈ ${n(A.f4)}. What is Arg z, to 2 decimal places?`, answer: [r2(A.val)], explanation: `${A.how}, which is ${f2(A.val)} to 2 decimal places.` },
   { prompt: `|z| = ${n(m)}. The modulus of w = z^${n(p)} is |w| = |z|^${n(p)}. What is it, to 2 decimal places?`, answer: [r2(W)], explanation: `${n(m)}^${n(p)} ${to2(W)}.` },
   { prompt: `The angle of w is ${n(p)} × Arg z ≈ ${n(r4(ang))}, and |w| ≈ ${n(r4(W))}. What is Re w = |w| cos(${n(p)} Arg z), to 2 decimal places?`, answer: [r2(Re)], explanation: `cos(${n(r4(ang))}) ≈ ${n(r4(cs))}, so Re w ${to2(Re)}.` },
   { prompt: `The real part of Log w is ln |w|, and |w| = |z|^${n(p)}. What is it, to 2 decimal places?`, answer: [r2(LW)], explanation: `ln |w| = ${n(p)} ln ${n(m)} ${to2(LW)}.` }
  ] }; }
});

/* ---- q12 Limits and the complex derivative [2.3, 2.5] ---- */

/* The learn mission's z₀ = 1 + 2i and its worked example's z₀ = 2 − i are never drawn. */
const isLearn12 = (p, q) => (p === 1 && q === 2) || (p === 2 && q === -1);

mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The stern pressure probe',
 brief: 'A probe at the stern of the hull model reads a polynomial of the position, and the crew needs how fast that reading changes at one spot.',
 labels: ['Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.01,
 gl: [['Re z₀²'], ['Im z₀²'], ['Re f′(z₀)'], ['Im f′(z₀)']]
}, {
 /* f(z) = az³ + bz² + cz, so f′(z) = 3az² + 2bz + c. z₀ = p + qi is never real. */
 canonical: { a: 2, b: -3, c: 5, p: -2, q: 1 },
 draw: R => bounded(R, R => ({ a: R.nz(-3, 3), b: R.nz(-4, 4), c: R.nz(-6, 6), p: R.int(-3, 3), q: R.nz(-3, 3) }), p => !isLearn12(p.p, p.q), { a: 2, b: -3, c: 5, p: -2, q: 1 }),
 build: ({ a, b, c, p, q }) => { const z = [p, q], s = mul(z, z), t3 = scl(3 * a, s), t2 = scl(2 * b, z), F = add2(add2(t3, t2), [c, 0]); return {
  prompt: `A pressure probe at the stern of the hull model reads f(z) = ${lead(a, 'z³')} ${trm(b, 'z²')} ${trm(c, 'z')}, where z is the position of the probe in the tank plane. Find the complex derivative f′(z₀) at the position z₀ = ${cz(z)}. Enter its real part, then its imaginary part.`,
  answer: [F[0], F[1]],
  hints: ['A term azⁿ has derivative a × n zⁿ⁻¹: the number in front stays, the power comes down and drops by one. A term cz has derivative c.', 'Square z₀ first, using i² = −1. Multiply by the numbers in f′(z), then add the real parts and the imaginary parts separately.'],
  solution: `By the power rule, f′(z) = ${lead(3 * a, 'z²')} ${trm(2 * b, 'z')} ${cst(c)}. z₀² = (${cz(z)})² = ${par(p)}² − ${par(q)}² + (2 × ${par(p)} × ${par(q)})i = ${cz(s)}. So ${n(3 * a)}z₀² = ${cz(t3)} and ${n(2 * b)}z₀ = ${cz(t2)}, and f′(z₀) = ${pz(t3)} + ${pz(t2)} + ${par(c)} = ${cz(F)}.`,
  guidance: [
   { prompt: `z₀ = ${cz(z)}. What is the real part of z₀²?`, answer: [s[0]], explanation: `(a + bi)² = a² − b² + 2abi, so the real part is ${par(p)}² − ${par(q)}² = ${n(s[0])}.` },
   { prompt: 'What is the imaginary part of z₀²?', answer: [s[1]], explanation: `It is 2ab = 2 × ${par(p)} × ${par(q)} = ${n(s[1])}, so z₀² = ${cz(s)}.` },
   { prompt: `f′(z) = ${lead(3 * a, 'z²')} ${trm(2 * b, 'z')} ${cst(c)}. What is the real part of f′(z₀)?`, answer: [F[0]], explanation: `${n(3 * a)}z₀² = ${cz(t3)} and ${n(2 * b)}z₀ = ${cz(t2)}. The real parts add up: ${n(t3[0])} + ${par(t2[0])} + ${par(c)} = ${n(F[0])}.` },
   { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `The imaginary parts: ${n(t3[1])} + ${par(t2[1])} = ${n(F[1])}. The constant ${n(c)} is real and adds nothing here.` }
  ] }; }
});

mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'The drifting buoy',
 brief: 'A buoy in the flow tank drifts a little way from its mark, and the crew wants to estimate how much its flow reading changes without recalculating it.',
 labels: ['Re of the estimated change', 'Im of the estimated change'], tolerance: 0.01,
 gl: [['Re f′(z₀)'], ['Im f′(z₀)'], ['Re of the estimated change']]
}, {
 /* f(z) = az³ + bz, so f′(z) = 3az² + b. The step h = (r + si) ÷ 10 has one decimal, so the estimate f′(z₀) × h has at most 2 decimals. */
 canonical: { a: 2, b: -3, p: -1, q: 2, r: 2, s: -1 },
 draw: R => bounded(R, R => ({ a: R.nz(-3, 3), b: R.nz(-6, 6), p: R.int(-2, 2), q: R.nz(-3, 3), r: R.nz(-4, 4), s: R.nz(-4, 4) }), p => !isLearn12(p.p, p.q), { a: 2, b: -3, p: -1, q: 2, r: 2, s: -1 }),
 build: ({ a, b, p, q, r, s }) => { const z = [p, q], z2 = mul(z, z), F = add2(scl(3 * a, z2), [b, 0]), h = [r / 10, s / 10],
  E = [G.tidy((F[0] * r - F[1] * s) / 10), G.tidy((F[0] * s + F[1] * r) / 10)]; return {
  prompt: `The flow reading at a point z of the tank plane is f(z) = ${lead(a, 'z³')} ${trm(b, 'z')}. A buoy sits at z₀ = ${cz(z)} and drifts by a small step h = ${cz(h)}. For a small step, the change f(z₀ + h) − f(z₀) is close to f′(z₀) × h, because the quotient (f(z₀ + h) − f(z₀)) ÷ h is close to f′(z₀). Use that estimate for the change in the reading. Enter the real part of the estimated change, then its imaginary part.`,
  answer: [E[0], E[1]],
  hints: ['A term azⁿ has derivative a × n zⁿ⁻¹, and a term bz has derivative b. Square z₀ using i² = −1.', 'Multiply two complex numbers as (A + Bi)(r + si) = (Ar − Bs) + (As + Br)i. The estimate is f′(z₀) times the step h.'],
  solution: `By the power rule, f′(z) = ${lead(3 * a, 'z²')} ${cst(b)}. z₀² = ${cz(z2)}, so f′(z₀) = ${n(3 * a)} × ${pz(z2)} ${cst(b)} = ${cz(F)}. The estimated change is f′(z₀) × h = ${pz(F)} × ${pz(h)}. Real part: ${n(F[0])} × ${par(h[0])} − ${par(F[1])} × ${par(h[1])} = ${n(E[0])}. Imaginary part: ${n(F[0])} × ${par(h[1])} ${sgnj(F[1])} ${n(Math.abs(F[1]))} × ${par(h[0])} = ${n(E[1])}.`,
  guidance: [
   { prompt: `z₀² = ${cz(z2)} and f′(z) = ${lead(3 * a, 'z²')} ${cst(b)}. What is the real part of f′(z₀)?`, answer: [F[0]], explanation: `${n(3 * a)} × ${par(z2[0])} ${cst(b)} = ${n(F[0])}.` },
   { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `${n(3 * a)} × ${par(z2[1])} = ${n(F[1])}, and the constant is real, so f′(z₀) = ${cz(F)}.` },
   { prompt: `f′(z₀) = ${cz(F)} and h = ${cz(h)}. What is the real part of the estimate f′(z₀) × h?`, answer: [E[0]], explanation: `(${n(F[0])} × ${par(h[0])}) − (${n(F[1])} × ${par(h[1])}) = ${n(E[0])}. The imaginary part is ${n(F[0])} × ${par(h[1])} ${sgnj(F[1])} ${n(Math.abs(F[1]))} × ${par(h[0])} = ${n(E[1])}.` }
  ] }; }
});

mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q07', title: 'The quartic hull model',
 brief: 'A sharper flow model has a fourth power in it, and the crew needs both its rate of change and its output at one point.',
 labels: ['Re f′(z₀)', 'Im f′(z₀)', 'Re f(z₀)'], tolerance: 0.01,
 gl: [['Re f′(z₀)'], ['Im f′(z₀)'], ['Re f(z₀)']]
}, {
 /* f(z) = z⁴ + az³ + bz + c, so f′(z) = 4z³ + 3az² + b. z₀ = p + qi is never real, and |p|, |q| ≤ 2 keeps every answer small. */
 canonical: { a: -2, b: 3, c: -4, p: -1, q: 2 },
 draw: R => bounded(R, R => ({ a: R.nz(-4, 4), b: R.nz(-6, 6), c: R.nz(-9, 9), p: R.int(-2, 2), q: R.nz(-2, 2) }), p => !isLearn12(p.p, p.q), { a: -2, b: 3, c: -4, p: -1, q: 2 }),
 build: ({ a, b, c, p, q }) => { const z = [p, q], s = mul(z, z), t = mul(s, z), u = mul(s, s), F = add2(add2(scl(4, t), scl(3 * a, s)), [b, 0]), Rf = u[0] + a * t[0] + b * p + c; return {
  prompt: `A sharper flow model for the hull is f(z) = z⁴ ${trm(a, 'z³')} ${trm(b, 'z')} ${cst(c)}. Its output at a position z₀ = ${cz(z)} is the complex number f(z₀), found by putting z₀ in for z. Enter the real part of the derivative f′(z₀), then its imaginary part, then the real part of the output f(z₀).`,
  answer: [F[0], F[1], Rf],
  hints: ['By the power rule, a term azⁿ has derivative a × n zⁿ⁻¹ and a term bz has derivative b. For the output, put z₀ into f itself, not into f′.', 'Work out z₀², z₀³ and z₀⁴ one step at a time, using i² = −1, then collect the real parts and the imaginary parts separately.'],
  solution: `By the power rule, f′(z) = 4z³ ${trm(3 * a, 'z²')} ${cst(b)}. z₀² = ${cz(s)}, z₀³ = ${cz(t)} and z₀⁴ = ${cz(u)}. So f′(z₀) = 4 × ${pz(t)} + ${par(3 * a)} × ${pz(s)} + ${par(b)} = ${cz(F)}. For the output, the real part of f(z₀) = z₀⁴ ${trm(a, 'z₀³')} ${trm(b, 'z₀')} ${cst(c)} is ${n(u[0])} + ${par(a)} × ${par(t[0])} + ${par(b)} × ${par(p)} + ${par(c)} = ${n(Rf)}.`,
  guidance: [
   { prompt: `z₀² = ${cz(s)} and z₀³ = ${cz(t)}. With f′(z) = 4z³ ${trm(3 * a, 'z²')} ${cst(b)}, what is the real part of f′(z₀)?`, answer: [F[0]], explanation: `4 × ${par(t[0])} + ${par(3 * a)} × ${par(s[0])} + ${par(b)} = ${n(F[0])}.` },
   { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `4 × ${par(t[1])} + ${par(3 * a)} × ${par(s[1])} = ${n(F[1])}; the constant ${n(b)} is real. So f′(z₀) = ${cz(F)}.` },
   { prompt: `z₀⁴ = ${cz(u)} and z₀³ = ${cz(t)}. What is the real part of f(z₀) = z₀⁴ ${trm(a, 'z₀³')} ${trm(b, 'z₀')} ${cst(c)}?`, answer: [Rf], explanation: `${n(u[0])} + ${par(a)} × ${par(t[0])} + ${par(b)} × ${par(p)} + ${par(c)} = ${n(Rf)}.` }
  ] }; }
});

/* ---- q13 Cauchy–Riemann equations [2.6] ---- */

mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'The wake fit',
 brief: 'The wake behind the hull model has been fitted with two real functions that contain two unknown constants, and only the right constants make the fit a true complex function.',
 labels: ['m', 'k'], tolerance: 0.01,
 gl: [['m'], ['k']]
}, {
 /* u = ax² + ky² + cx and v = mxy + cy. The first Cauchy–Riemann equation gives m = 2a; the second then gives 2k = −m, so k = −a. */
 canonical: { a: 3, c: -4 },
 draw: R => ({ a: R.nz(-4, 4), c: R.nz(-6, 6) }),
 build: ({ a, c }) => { const m = 2 * a, k = -a; return {
  prompt: `The wake behind the hull model is fitted by two real functions of x and y: u(x, y) = ${lead(a, 'x²')} + ky² ${trm(c, 'x')} and v(x, y) = mxy ${trm(c, 'y')}, where k and m are constants. The fit must come from an analytic function u + iv, so u and v must satisfy both Cauchy–Riemann equations at every point. Enter the value of m, then the value of k.`,
  answer: [m, k],
  hints: ['∂/∂x treats y as a fixed number and ∂/∂y treats x as fixed. The Cauchy–Riemann equations are ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x, and both must hold at every point, so match the coefficient of each term.', 'The first equation, with its x terms, fixes m. The second equation, with its y terms, then fixes k once m is known.'],
  solution: `∂u/∂x = ${lead(2 * a, 'x')} ${cst(c)} and ∂v/∂y = mx ${cst(c)}. The first equation holds at every point only if m = ${n(m)}. Then ∂u/∂y = 2ky and −∂v/∂x = −my = ${lead(-m, 'y')}. The second equation holds only if 2k = ${n(-m)}, so k = ${n(k)}.`,
  guidance: [
   { prompt: `∂u/∂x = ${lead(2 * a, 'x')} ${cst(c)} and ∂v/∂y = mx ${cst(c)}. The first Cauchy–Riemann equation needs them equal at every point. What must m be?`, answer: [m], explanation: `Matching the x terms gives m = ${n(m)}; the constants ${n(c)} already agree.` },
   { prompt: `With m = ${n(m)}, −∂v/∂x = ${lead(-m, 'y')}, and ∂u/∂y = 2ky. The second equation needs them equal at every point. What must k be?`, answer: [k], explanation: `2k = ${n(-m)}, so k = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'The logged derivative',
 brief: 'The crew fits a cubic flow model with one unknown constant, and once it is fixed they log the complex derivative at a test point.',
 labels: ['k', 'Re f′ at the test point', 'Im f′ at the test point'], tolerance: 0.01,
 gl: [['k'], ['Re f′ at the test point'], ['Im f′ at the test point']]
}, {
 /* u = ax³ − 3axy² + bx and v = kx²y − ay³ + by. The first equation gives k = 3a, and the second agrees (−6axy = −2kxy). f′ = ∂u/∂x + i ∂v/∂x
    = (3ax² − 3ay² + b) + i(2kxy). The test point (x₀, y₀) has both parts non-zero. */
 canonical: { a: -2, b: 3, x0: 2, y0: -1 },
 draw: R => ({ a: R.nz(-2, 2), b: R.nz(-5, 5), x0: R.nz(-3, 3), y0: R.nz(-3, 3) }),
 build: ({ a, b, x0, y0 }) => { const k = 3 * a, Re = 3 * a * (x0 * x0 - y0 * y0) + b, Im = 2 * k * x0 * y0; return {
  prompt: `The crew fits a flow model f = u + iv to the flow in the tank, with u(x, y) = ${lead(a, 'x³')} ${trm(-3 * a, 'xy²')} ${trm(b, 'x')} and v(x, y) = kx²y ${trm(-a, 'y³')} ${trm(b, 'y')}, where k is a constant. The model is only trusted if u + iv is analytic. Once k is fixed, the crew logs the complex derivative f′ = ∂u/∂x + i ∂v/∂x at the test point z₀ = ${cz([x0, y0])}, that is x = ${n(x0)} and y = ${n(y0)}. Enter k, then the real part and the imaginary part of f′ at the test point.`,
  answer: [k, Re, Im],
  hints: ['∂/∂x treats y as a fixed number and ∂/∂y treats x as fixed. The Cauchy–Riemann equations ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x must hold at every point: match the coefficient of each term to find k.', 'With k known, f′ = ∂u/∂x + i ∂v/∂x. Differentiate u and v in x, then put in x and y of the test point.'],
  solution: `∂u/∂x = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} ${cst(b)} and ∂v/∂y = kx² ${trm(-3 * a, 'y²')} ${cst(b)}. They agree at every point only if k = ${n(k)}. Then ∂u/∂y = ${lead(-6 * a, 'xy')} and −∂v/∂x = −2kxy = ${lead(-2 * k, 'xy')}, which agree too. At x = ${n(x0)}, y = ${n(y0)}: ∂u/∂x = ${n(3 * a)} × ${par(x0 * x0 - y0 * y0)} ${cst(b)} = ${n(Re)} and ∂v/∂x = 2kxy = 2 × ${par(k)} × ${par(x0)} × ${par(y0)} = ${n(Im)}. So f′ = ${cz([Re, Im])}.`,
  guidance: [
   { prompt: `∂u/∂x = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} ${cst(b)} and ∂v/∂y = kx² ${trm(-3 * a, 'y²')} ${cst(b)}. The first Cauchy–Riemann equation needs them equal at every point. What must k be?`, answer: [k], explanation: `Matching the x² terms gives k = ${n(k)}. The second equation agrees: ∂u/∂y = ${lead(-6 * a, 'xy')} and −∂v/∂x = −2kxy = ${lead(-2 * k, 'xy')}.` },
   { prompt: `The real part of f′ is ∂u/∂x = ${lead(3 * a, 'x²')} ${trm(-3 * a, 'y²')} ${cst(b)}. What is it at x = ${n(x0)}, y = ${n(y0)}?`, answer: [Re], explanation: `${n(3 * a)} × ${par(x0 * x0 - y0 * y0)} ${cst(b)} = ${n(Re)}, because x² − y² = ${n(x0 * x0 - y0 * y0)} there.` },
   { prompt: `With k = ${n(k)}, the imaginary part of f′ is ∂v/∂x = 2kxy. What is it at x = ${n(x0)}, y = ${n(y0)}?`, answer: [Im], explanation: `2 × ${par(k)} × ${par(x0)} × ${par(y0)} = ${n(Im)}.` }
  ] }; }
});

mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q12', title: 'Two hidden constants',
 brief: 'A cubic flow model has two unknown constants hidden in different places, and the crew also needs its derivative at a test point.',
 labels: ['k', 'n', 'Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.01,
 gl: [['k'], ['n'], ['Re f′(z₀)'], ['Im f′(z₀)']]
}, {
 /* u = ax³ + kxy² + cx and v = mx²y + ny³ + cy with m = 3a given as a number. The second equation gives k = −m, the y² terms of the first give k = 3n,
    so n = −a. f = az³ + cz, so f′(z₀) = 3az₀² + c. z₀ = p + qi has both parts non-zero. */
 canonical: { a: 2, c: -3, p: 2, q: -1 },
 draw: R => ({ a: R.nz(-3, 3), c: R.nz(-5, 5), p: R.nz(-3, 3), q: R.nz(-3, 3) }),
 build: ({ a, c, p, q }) => { const m = 3 * a, k = -m, nn = -a, z = [p, q], F = add2(scl(3 * a, mul(z, z)), [c, 0]); return {
  prompt: `A cubic flow model for the tank is f = u + iv, where u(x, y) = ${lead(a, 'x³')} + kxy² ${trm(c, 'x')} and v(x, y) = ${lead(m, 'x²y')} + ny³ ${trm(c, 'y')}, with k and n constants. The model must be analytic, so u and v must satisfy both Cauchy–Riemann equations at every point. Enter k, then n, then the real part and the imaginary part of the complex derivative f′(z₀) at z₀ = ${cz(z)}. (For an analytic function, f′ = ∂u/∂x + i ∂v/∂x.)`,
  answer: [k, nn, F[0], F[1]],
  hints: ['∂/∂x treats y as a fixed number and ∂/∂y treats x as fixed. Both Cauchy–Riemann equations, ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x, must hold at every point: match the coefficient of each kind of term.', 'The second equation involves only k, so solve it first. Then the y² terms of the first equation give n. For f′, differentiate u and v in x and put in x and y, or note that f is built from powers of z and use the power rule.'],
  solution: `∂u/∂y = 2kxy and −∂v/∂x = ${lead(-2 * m, 'xy')}, so the second equation gives k = ${n(k)}. ∂u/∂x = ${lead(3 * a, 'x²')} + ky² ${cst(c)} and ∂v/∂y = ${lead(m, 'x²')} + 3ny² ${cst(c)}. The x² terms already agree, and the y² terms need k = 3n, so n = ${n(k)} ÷ 3 = ${n(nn)}. With these constants, u + iv works out to be ${lead(a, 'z³')} ${trm(c, 'z')}, so by the power rule f′(z) = ${lead(3 * a, 'z²')} ${cst(c)}. At z₀ = ${cz(z)}: z₀² = ${cz(mul(z, z))}, so f′(z₀) = ${n(3 * a)} × ${pz(mul(z, z))} ${cst(c)} = ${cz(F)}.`,
  guidance: [
   { prompt: `∂u/∂y = 2kxy and −∂v/∂x = ${lead(-2 * m, 'xy')}. The second Cauchy–Riemann equation needs them equal at every point. What must k be?`, answer: [k], explanation: `2k = ${n(-2 * m)}, so k = ${n(k)}.` },
   { prompt: `∂u/∂x = ${lead(3 * a, 'x²')} + ky² ${cst(c)} and ∂v/∂y = ${lead(m, 'x²')} + 3ny² ${cst(c)}. With k = ${n(k)}, the first equation needs the y² terms to match. What must n be?`, answer: [nn], explanation: `k = 3n, so n = ${n(k)} ÷ 3 = ${n(nn)}. The x² terms match already, since ${n(m)} = 3 × ${par(a)}.` },
   { prompt: `For an analytic function f′ = ∂u/∂x + i ∂v/∂x. With k = ${n(k)}, ∂u/∂x = ${lead(3 * a, 'x²')} + ky² ${cst(c)}. What is its value at x = ${n(p)}, y = ${n(q)}? That is the real part of f′(z₀).`, answer: [F[0]], explanation: `${n(3 * a)} × ${par(p * p)} + ${par(k)} × ${par(q * q)} ${cst(c)} = ${n(F[0])}.` },
   { prompt: `The imaginary part of f′(z₀) is ∂v/∂x = ${lead(2 * m, 'xy')}. What is it at x = ${n(p)}, y = ${n(q)}?`, answer: [F[1]], explanation: `${n(2 * m)} × ${par(p)} × ${par(q)} = ${n(F[1])}. As a check, f = ${lead(a, 'z³')} ${trm(c, 'z')} gives f′(z₀) = ${cz(F)} by the power rule.` }
  ] }; }
});

/* ---- q14 Rules of differentiation [2.5] ---- */

/* z₀ + b is drawn from this list, so the bottom of a quotient has a modulus whose square is 1, 4, 16 or 25 and the answers have at most 2 decimals. */
const W14 = [[1, 1], [1, -1], [0, 1], [0, -1], [0, 2], [0, -2], [2, 1], [1, 2]];
/* The numbers behind q14b, q14c and q14d. */
const q14b = ({ a, b, m, p, q }) => { const w = [a * p + b, a * q], P = pw(w, m - 1); return { w, P, F: scl(m * a, P) }; };
const q14c = ({ a, b, w }) => { const W = W14[w], z = [W[0] - b, W[1]], h = add2(z, [b, 0]), s = mul(z, z), g = add2(s, scl(a, z)), gp = add2(scl(2, z), [a, 0]),
 N = sub(mul(gp, h), g), h2 = mul(h, h); return { z, h, s, g, gp, N, h2, F: div(N, h2).map(G.tidy) }; };
const q14d = ({ a, b, p, q }) => { const z = [p, q], s = mul(z, z), g = add2(s, [b, 0]), g2 = mul(g, g), u1 = add2(z, [a, 0]), t1 = scl(4, mul(mul(z, u1), g));
 return { s, g, g2, u1, t1, F: add2(g2, t1) }; };
/* Division by a complex bottom as worked: the conjugate step, or a plain division when the bottom is real. */
const divText = (top, bot, F) => bot[1] ? `Multiply the top and the bottom by the conjugate ${cz(cnj(bot))}: the top becomes ${cz(mul(top, cnj(bot)))} and the bottom becomes ${n(m2(bot))}, so the quotient is ${cz(F)}.` : `The bottom ${n(bot[0])} is real, so dividing gives ${cz(F)}.`;

mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'The stern valve stages',
 brief: 'The stern valve in the flow tank opens through a gain stage raised to a power, and the crew needs its rate of change at one setting.',
 labels: ['Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.01,
 gl: [['Re of the inner piece'], ['Im of the inner piece'], ['Re f′(z₀)'], ['Im f′(z₀)']]
}, {
 /* f(z) = (az + b)^m with m = 3 or 4, so f′(z) = ma(az + b)^(m−1). Both parts of f′(z₀) stay below 1000. The worked example is a quotient and the learn mission's z₀ is 2 + i. */
 canonical: { a: 2, b: -1, m: 3, p: 1, q: -1 },
 draw: R => bounded(R, R => ({ a: R.nz(-3, 3), b: R.nz(-4, 4), m: R.pick([3, 4]), p: R.int(-2, 2), q: R.nz(-2, 2) }),
  p => { const F = q14b(p).F; return Math.abs(F[0]) < 1000 && Math.abs(F[1]) < 1000 && !(p.p === 2 && p.q === 1); }, { a: 2, b: -1, m: 3, p: 1, q: -1 }),
 build: P => { const { a, b, m, p, q } = P, z = [p, q], C = q14b(P), F = C.F, inner = `${lead(a, 'z')} ${cst(b)}`; return {
  prompt: `The stern valve in the flow tank opens in stages: its flow reading is f(z) = (${inner})${SUP[m]}, where z is the valve setting. Find the complex derivative f′(z₀) at the setting z₀ = ${cz(z)}. Enter its real part, then its imaginary part.`,
  answer: [F[0], F[1]],
  hints: ['The chain rule says the derivative of g(h(z)) is g′(h(z)) × h′(z). Here the outer step is a power, whose derivative lowers the power by one and brings it down in front, and the inner derivative is the number in front of z.', 'Work out the inner piece at z₀ first, then raise it to the lower power using i² = −1, and multiply by the numbers in front.'],
  solution: `By the chain rule, f′(z) = ${n(m)} × ${par(a)} × (${inner})${SUP[m - 1]} = ${n(m * a)}(${inner})${SUP[m - 1]}. At z₀: ${lead(a, 'z₀')} ${cst(b)} = ${cz(C.w)}, and (${cz(C.w)})${SUP[m - 1]} = ${cz(C.P)}. So f′(z₀) = ${n(m * a)} × ${pz(C.P)} = ${cz(F)}.`,
  guidance: [
   { prompt: `The inner piece is ${inner}. What is the real part of ${lead(a, 'z₀')} ${cst(b)} at z₀ = ${cz(z)}?`, answer: [C.w[0]], explanation: `${n(a)} × ${par(p)} ${cst(b)} = ${n(C.w[0])}.` },
   { prompt: 'What is the imaginary part of the inner piece at z₀?', answer: [C.w[1]], explanation: `${n(a)} × ${par(q)} = ${n(C.w[1])}, so the inner piece is ${cz(C.w)}.` },
   { prompt: `By the chain rule, f′(z) = ${n(m * a)}(${inner})${SUP[m - 1]}. The inner piece at z₀ is ${cz(C.w)}. What is the real part of f′(z₀)?`, answer: [F[0]], explanation: `(${cz(C.w)})${SUP[m - 1]} = ${cz(C.P)}, so f′(z₀) = ${n(m * a)} × ${pz(C.P)} = ${cz(F)}.` },
   { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `f′(z₀) = ${cz(F)}, so its imaginary part is ${n(F[1])}.` }
  ] }; }
});

mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'The gain probe',
 brief: 'The tank’s gain probe divides the output pressure by the input flow, and the crew needs how the gain changes at one setting.',
 labels: ['Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.005,
 gl: [['Re of the top of the quotient rule'], ['Im of the top of the quotient rule'], ['Re f′(z₀)']]
}, {
 /* f(z) = (z² + az) ÷ (z + b). z₀ + b comes from W14, so the bottom (z₀ + b)² has modulus squared 1, 4, 16 or 25 and the answers have at most 2 decimals. */
 canonical: { a: 3, b: -2, w: 7 },
 draw: R => bounded(R, R => ({ a: R.nz(-5, 5), b: R.nz(-4, 4), w: R.int(0, W14.length - 1) }), p => { const F = q14c(p).F; return isTidy(F) && Math.abs(F[0]) < 100 && Math.abs(F[1]) < 100; }, { a: 3, b: -2, w: 7 }),
 build: P => { const { a, b } = P, C = q14c(P), z = C.z, F = C.F, N = C.N; return {
  prompt: `The gain probe in the flow tank divides the output pressure P(z) = z² ${trm(a, 'z')} by the input flow Q(z) = z ${cst(b)}, so its reading is f(z) = P(z) ÷ Q(z), where z is the probe setting. Find the complex derivative f′(z₀) at z₀ = ${cz(z)}. Enter its real part, then its imaginary part.`,
  answer: [F[0], F[1]],
  hints: ['The quotient rule is (g ÷ h)′ = (g′h − gh′) ÷ h². Here g = P and h = Q. P′ is 2z plus the number in front of z in P, and Q′ is the number in front of z in Q.', 'Work out the top, P′Q − PQ′, at z₀ first using i² = −1. To divide by a complex number, multiply the top and the bottom by its conjugate, so that the bottom becomes a real number.'],
  solution: `By the quotient rule, f′(z) = (P′Q − PQ′) ÷ Q² = ((2z ${cst(a)})(z ${cst(b)}) − (z² ${trm(a, 'z')})) ÷ (z ${cst(b)})². At z₀: Q(z₀) = ${cz(C.h)}, P′(z₀) = ${cz(C.gp)} and P(z₀) = ${cz(C.g)}. The top is ${pz(C.gp)} × ${pz(C.h)} − ${pz(C.g)} = ${cz(N)}. The bottom is Q(z₀)² = ${cz(C.h2)}. ${divText(N, C.h2, F)}`,
  guidance: [
   { prompt: `At z₀ = ${cz(z)}: Q(z₀) = ${cz(C.h)}, P′(z₀) = 2z₀ ${cst(a)} = ${cz(C.gp)} and P(z₀) = ${cz(C.g)}. The top of the quotient rule is P′Q − P × 1. What is its real part?`, answer: [N[0]], explanation: `${pz(C.gp)} × ${pz(C.h)} = ${cz(mul(C.gp, C.h))}, and subtracting ${pz(C.g)} leaves ${cz(N)}. The real part is ${n(N[0])}.` },
   { prompt: 'What is the imaginary part of the top?', answer: [N[1]], explanation: `The top is ${cz(N)}, so its imaginary part is ${n(N[1])}.` },
   { prompt: `The top is ${cz(N)} and the bottom is Q(z₀)² = ${cz(C.h2)}. What is the real part of the quotient, the real part of f′(z₀)?`, answer: [F[0]], explanation: `${divText(N, C.h2, F)} Its imaginary part is ${n(F[1])}.` }
  ] }; }
});

mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', title: 'Product of a power',
 brief: 'A probe formula multiplies a plain stage by a squared stage, so two rules are needed in one derivative.',
 labels: ['Re f′(z₀)', 'Im f′(z₀)'], tolerance: 0.01,
 gl: [['Re of the squared stage'], ['Im of the squared stage'], ['Re f′(z₀)'], ['Im f′(z₀)']]
}, {
 /* f(z) = (z + a)(z² + b)²: the product rule with the chain rule inside, f′(z) = (z² + b)² + 4z(z + a)(z² + b). Both parts of f′(z₀) stay below 1000. */
 canonical: { a: 1, b: -2, p: 1, q: 1 },
 draw: R => bounded(R, R => ({ a: R.nz(-4, 4), b: R.nz(-4, 4), p: R.int(-2, 2), q: R.nz(-2, 2) }), p => { const F = q14d(p).F; return Math.abs(F[0]) < 1000 && Math.abs(F[1]) < 1000 && !(p.p === 2 && p.q === 1); }, { a: 1, b: -2, p: 1, q: 1 }),
 build: P => { const { a, b, p, q } = P, z = [p, q], C = q14d(P), F = C.F; return {
  prompt: `A probe formula in the flow tank multiplies a plain stage by a squared stage: f(z) = (z ${cst(a)})(z² ${cst(b)})². Find the complex derivative f′(z₀) at the setting z₀ = ${cz(z)}. Enter its real part, then its imaginary part.`,
  answer: [F[0], F[1]],
  hints: ['Use the product rule (gh)′ = g′h + gh′ with g = z + a and h = (z² + b)². The derivative of h needs the chain rule: the outer step is a square and the inner derivative is 2z.', 'Simplify f′(z) as a formula first, then work out z₀² + b and its square at z₀ with i² = −1, and put in the other pieces.'],
  solution: `By the product rule, f′(z) = (z² ${cst(b)})² + (z ${cst(a)}) × 2(z² ${cst(b)}) × 2z = (z² ${cst(b)})² + 4z(z ${cst(a)})(z² ${cst(b)}). At z₀: z₀² ${cst(b)} = ${cz(C.g)}, and its square is ${cz(C.g2)}. Also z₀ ${cst(a)} = ${cz(C.u1)}, so 4z₀(z₀ ${cst(a)})(z₀² ${cst(b)}) = 4 × ${pz(z)} × ${pz(C.u1)} × ${pz(C.g)} = ${cz(C.t1)}. So f′(z₀) = ${pz(C.g2)} + ${pz(C.t1)} = ${cz(F)}.`,
  guidance: [
   { prompt: `By the product and chain rules, f′(z) = (z² ${cst(b)})² + 4z(z ${cst(a)})(z² ${cst(b)}). At z₀ = ${cz(z)}, what is the real part of z₀² ${cst(b)}?`, answer: [C.g[0]], explanation: `z₀² = ${cz(C.s)}, so z₀² ${cst(b)} = ${cz(C.g)}.` },
   { prompt: 'What is the imaginary part of z₀² ' + cst(b) + '?', answer: [C.g[1]], explanation: `z₀² ${cst(b)} = ${cz(C.g)}, so its imaginary part is ${n(C.g[1])}.` },
   { prompt: `z₀² ${cst(b)} = ${cz(C.g)}, so its square is ${cz(C.g2)}. Also 4z₀(z₀ ${cst(a)})(z₀² ${cst(b)}) = ${cz(C.t1)}. What is the real part of f′(z₀)?`, answer: [F[0]], explanation: `${pz(C.g2)} + ${pz(C.t1)} = ${cz(F)}, so the real part is ${n(F[0])}.` },
   { prompt: 'What is the imaginary part of f′(z₀)?', answer: [F[1]], explanation: `f′(z₀) = ${cz(F)}, so its imaginary part is ${n(F[1])}.` }
  ] }; }
});

/* ---- q15 Sine, cosine, sinh and cosh [2.8, 1.12] ---- */

/* Angles x = kπ ÷ d with exact sine and cosine. Index 3 is π ÷ 2, where cos x = 0, which the practice that needs cos x leaves out. */
const R3 = Math.sqrt(3) / 2, R2 = Math.sqrt(2) / 2;
const XS = [
 { t: 'π ÷ 6', s: 0.5, st: '1 ÷ 2', c: R3, ct: '√3 ÷ 2' }, { t: 'π ÷ 4', s: R2, st: '√2 ÷ 2', c: R2, ct: '√2 ÷ 2' },
 { t: 'π ÷ 3', s: R3, st: '√3 ÷ 2', c: 0.5, ct: '1 ÷ 2' }, { t: 'π ÷ 2', s: 1, st: '1', c: 0, ct: '0' },
 { t: '2π ÷ 3', s: R3, st: '√3 ÷ 2', c: -0.5, ct: '−1 ÷ 2' }, { t: '3π ÷ 4', s: R2, st: '√2 ÷ 2', c: -R2, ct: '−√2 ÷ 2' },
 { t: '5π ÷ 6', s: 0.5, st: '1 ÷ 2', c: -R3, ct: '−√3 ÷ 2' }];
const XNC = [0, 1, 2, 4, 5, 6];
/* The learn mission's canonical (x = π ÷ 4, y = 1) and its worked example (x = π ÷ 2, y = 3) are never drawn. */
const isLearn15 = (xi, y) => (xi === 1 && y === 1) || (xi === 3 && y === 3);
/* The numbers behind q15b, q15c and q15d. */
const q15b = ({ xi, y }) => { const X = XS[xi], ch = Math.cosh(y), sh = Math.sinh(y); return { ch, sh, Re: X.s * ch, Im: X.c * sh }; };
const q15c = ({ xi, y1, y2 }) => { const s = XS[xi].s, s1 = Math.sinh(y1), s2 = Math.sinh(y2), A1 = Math.sqrt(s * s + s1 * s1), A2 = Math.sqrt(s * s + s2 * s2); return { s1, s2, A1, A2, ratio: A2 / A1 }; };
const q15d = ({ xi, y }) => { const X = XS[xi], sh = Math.sinh(y), ch = Math.cosh(y); return { sh, ch, E: Math.exp(-y), Ab: Math.sqrt(X.c * X.c + sh * sh), Re: X.c * ch }; };
const ex = y => y < 0 ? `e^(${n(y)})` : `e^${n(y)}`;

mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'The far channel wave',
 brief: 'A surface wave in the far channel of the flow tank is modelled with a complex sine, and the crew needs the two parts of its reading at one depth.',
 labels: ['Re sin(x + iy)', 'Im sin(x + iy)'], tolerance: 0.005,
 gl: [['cosh y'], ['sinh y'], ['Re sin(x + iy)'], ['Im sin(x + iy)']]
}, {
 /* xi indexes XS (never π ÷ 2); y is ±0.5 to ±3 in halves, so sinh y has the sign of y. Every rounded value keeps 0.06 clear of a rounding tie. */
 canonical: { xi: 4, y: -1.5 },
 draw: R => bounded(R, R => ({ xi: R.pick(XNC), y: R.pick([0.5, 1, 1.5, 2, 2.5, 3]) * (R.bool() ? 1 : -1) }),
  p => { const C = q15b(p); return !isLearn15(p.xi, p.y) && safe(C.ch, 0.06) && safe(C.sh, 0.06) && safe(C.Re, 0.06) && safe(C.Im, 0.06); }, { xi: 4, y: -1.5 }),
 build: ({ xi, y }) => { const C = q15b({ xi, y }), X = XS[xi]; return {
  prompt: `A surface wave in the far channel of the flow tank is modelled with the complex sine. Angles are in radians. For z = x + iy, sin(x + iy) = sin x cosh y + i cos x sinh y. Enter the real part of sin(x + iy), then its imaginary part, for x = ${X.t} and y = ${n(y)}, both to 2 decimal places.`,
  answer: [r2(C.Re), r2(C.Im)],
  hints: ['In sin(x + iy) = sin x cosh y + i cos x sinh y, the real part is sin x cosh y and the imaginary part is cos x sinh y.', 'cosh y = (e^y + e^(−y)) ÷ 2 is never below 1, and sinh y = (e^y − e^(−y)) ÷ 2 is negative when y is negative. Use the exact values of sin x and cos x for the angle, and round only at the end.'],
  solution: `cosh(${n(y)}) = (${ex(y)} + ${ex(-y)}) ÷ 2 ≈ (${n(r4(Math.exp(y)))} + ${n(r4(Math.exp(-y)))}) ÷ 2 ${to2(C.ch)}. sinh(${n(y)}) = (${ex(y)} − ${ex(-y)}) ÷ 2 ${to2(C.sh)}. For x = ${X.t}: sin x = ${X.st} ≈ ${n(r4(X.s))} and cos x = ${X.ct} ≈ ${n(r4(X.c))}. So Re sin(x + iy) = sin x cosh y ${to2(C.Re)}, and Im sin(x + iy) = cos x sinh y ${to2(C.Im)}.`,
  guidance: [
   { prompt: `cosh y = (e^y + e^(−y)) ÷ 2. What is cosh(${n(y)}), to 2 decimal places?`, answer: [r2(C.ch)], explanation: `(${n(r4(Math.exp(y)))} + ${n(r4(Math.exp(-y)))}) ÷ 2 ${to2(C.ch)}.` },
   { prompt: `sinh y = (e^y − e^(−y)) ÷ 2. What is sinh(${n(y)}), to 2 decimal places?`, answer: [r2(C.sh)], explanation: `(${n(r4(Math.exp(y)))} − ${par(r4(Math.exp(-y)))}) ÷ 2 ${to2(C.sh)}.` },
   { prompt: `sin(${X.t}) = ${X.st} ≈ ${n(r4(X.s))}. What is the real part, sin x cosh y, to 2 decimal places?`, answer: [r2(C.Re)], explanation: `${n(r4(X.s))} × ${n(r4(C.ch))} ${to2(C.Re)}.` },
   { prompt: `cos(${X.t}) = ${X.ct} ≈ ${n(r4(X.c))}. What is the imaginary part, cos x sinh y, to 2 decimal places?`, answer: [r2(C.Im)], explanation: `${par(r4(X.c))} × ${par(r4(C.sh))} ${to2(C.Im)}.` }
  ] }; }
});

mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'Two depths of the wave',
 brief: 'The same wave is read at two depths in the flow tank, and the crew wants both amplitudes and how much larger the deeper one is.',
 labels: ['amplitude at the first depth', 'amplitude at the second depth', 'ratio'], tolerance: 0.005,
 gl: [['amplitude at the first depth'], ['amplitude at the second depth'], ['ratio']]
}, {
 /* x from all of XS, y₁ from {0.5, 1, 1.5} and y₂ from {2, 2.5, 3}, so the ratio is above 1. Amplitudes and ratio keep 0.06 clear of a rounding tie. */
 canonical: { xi: 5, y1: 0.5, y2: 2 },
 draw: R => bounded(R, R => ({ xi: R.int(0, 6), y1: R.pick([0.5, 1, 1.5]), y2: R.pick([2, 2.5, 3]) }),
  p => { const C = q15c(p); return !isLearn15(p.xi, p.y1) && !isLearn15(p.xi, p.y2) && safe(C.A1, 0.06) && safe(C.A2, 0.06) && safe(C.ratio, 0.06); }, { xi: 5, y1: 0.5, y2: 2 }),
 build: ({ xi, y1, y2 }) => { const C = q15c({ xi, y1, y2 }), X = XS[xi]; return {
  prompt: `A surface wave in the flow tank is read at two depths along the same line x = ${X.t}. Angles are in radians. At depth y the amplitude of the wave is |sin(x + iy)| = √(sin²x + sinh²y), where sinh y = (e^y − e^(−y)) ÷ 2. Enter the amplitude at depth y = ${n(y1)}, then the amplitude at depth y = ${n(y2)}, then the ratio of the second amplitude to the first, each to 2 decimal places. Work out the ratio from the unrounded amplitudes.`,
  answer: [r2(C.A1), r2(C.A2), r2(C.ratio)],
  hints: ['sin²x is the square of the exact sine of the angle, and sinh y = (e^y − e^(−y)) ÷ 2 is 0 at y = 0 and grows with y. Add sin²x and sinh²y, then take the square root.', 'The ratio is the second amplitude divided by the first. Keep several decimals in the working and round only at the end.'],
  solution: `sin(${X.t}) = ${X.st}, so sin²x = ${n(r4(X.s * X.s))}. At y = ${n(y1)}: sinh ${n(y1)} ≈ ${n(r4(C.s1))}, so the amplitude is √(${n(r4(X.s * X.s))} + ${n(r4(C.s1 * C.s1))}) ${to2(C.A1)}. At y = ${n(y2)}: sinh ${n(y2)} ≈ ${n(r4(C.s2))}, so the amplitude is √(${n(r4(X.s * X.s))} + ${n(r4(C.s2 * C.s2))}) ${to2(C.A2)}. The ratio is ${n(r4(C.A2))} ÷ ${n(r4(C.A1))} ${to2(C.ratio)}.`,
  guidance: [
   { prompt: `sin²x = ${n(r4(X.s * X.s))} for x = ${X.t}, and sinh(${n(y1)}) ≈ ${n(r4(C.s1))}. What is the amplitude √(sin²x + sinh²y) at y = ${n(y1)}, to 2 decimal places?`, answer: [r2(C.A1)], explanation: `√(${n(r4(X.s * X.s))} + ${n(r4(C.s1 * C.s1))}) ${to2(C.A1)}.` },
   { prompt: `sinh(${n(y2)}) ≈ ${n(r4(C.s2))}. What is the amplitude at y = ${n(y2)}, to 2 decimal places?`, answer: [r2(C.A2)], explanation: `√(${n(r4(X.s * X.s))} + ${n(r4(C.s2 * C.s2))}) ${to2(C.A2)}.` },
   { prompt: `The amplitudes are ${n(r4(C.A1))} and ${n(r4(C.A2))}, before rounding. What is the second divided by the first, to 2 decimal places?`, answer: [r2(C.ratio)], explanation: `${n(r4(C.A2))} ÷ ${n(r4(C.A1))} ${to2(C.ratio)}.` }
  ] }; }
});

mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q08', title: 'The wave amplifier',
 brief: 'The wave amplifier works deep in the complex plane, where the exponentials and the cosine grow quickly, and the crew needs three of its readings.',
 labels: ['|e^(iz)|', '|cos z|', 'Re cos z'], tolerance: 0.005,
 gl: [['|e^(iz)|'], ['|cos z|'], ['Re cos z']]
}, {
 /* z = x + iy with x from XS (never π ÷ 2) and y = ±1 to ±3.5. iz = −y + ix, so |e^(iz)| = e^(−y). All rounded values keep 0.1 clear of a rounding tie. */
 canonical: { xi: 2, y: -2 },
 draw: R => bounded(R, R => ({ xi: R.pick(XNC), y: R.pick([1, 1.5, 2, 2.5, 3, 3.5]) * (R.bool() ? 1 : -1) }),
  p => { const C = q15d(p); return safe(C.E, 0.1) && safe(C.Ab, 0.1) && safe(C.Re, 0.1); }, { xi: 2, y: -2 }),
 build: ({ xi, y }) => { const C = q15d({ xi, y }), X = XS[xi]; return {
  prompt: `The flow tank’s wave amplifier acts on z = x + iy with x = ${X.t} and y = ${n(y)}. Angles are in radians. Its response is cos z = cos x cosh y − i sin x sinh y, so |cos z|² = cos²x + sinh²y. Enter the modulus |e^(iz)|, then the modulus |cos z|, then the real part of cos z, each to 2 decimal places.`,
  answer: [r2(C.E), r2(C.Ab), r2(C.Re)],
  hints: ['Multiply out iz = i(x + iy) = −y + ix. The modulus of e^(a + bi) is e^a, which depends only on the real part a of the exponent.', 'For |cos z|, add cos²x and sinh²y and take the square root, where sinh y = (e^y − e^(−y)) ÷ 2. The real part of cos z is cos x cosh y, with cosh y = (e^y + e^(−y)) ÷ 2.'],
  solution: `iz = i(x + iy) = ${n(-y)} + ix, so |e^(iz)| = ${ex(-y)} ${to2(C.E)}. For x = ${X.t}: cos x = ${X.ct} ≈ ${n(r4(X.c))}, so cos²x = ${n(r4(X.c * X.c))}. sinh ${n(y)} ≈ ${n(r4(C.sh))}, so |cos z| = √(${n(r4(X.c * X.c))} + ${n(r4(C.sh * C.sh))}) ${to2(C.Ab)}. cosh ${n(y)} ≈ ${n(r4(C.ch))}, so Re cos z = cos x cosh y = ${par(r4(X.c))} × ${n(r4(C.ch))} ${to2(C.Re)}.`,
  guidance: [
   { prompt: `iz = i(x + iy) = ${n(-y)} + ix. The modulus of e^(a + bi) is e^a. What is |e^(iz)|, to 2 decimal places?`, answer: [r2(C.E)], explanation: `${ex(-y)} ${to2(C.E)}.` },
   { prompt: `cos²x = ${n(r4(X.c * X.c))} for x = ${X.t}, and sinh(${n(y)}) ≈ ${n(r4(C.sh))}. What is |cos z| = √(cos²x + sinh²y), to 2 decimal places?`, answer: [r2(C.Ab)], explanation: `√(${n(r4(X.c * X.c))} + ${n(r4(C.sh * C.sh))}) ${to2(C.Ab)}.` },
   { prompt: `cos(${X.t}) = ${X.ct} ≈ ${n(r4(X.c))} and cosh(${n(y)}) ≈ ${n(r4(C.ch))}. What is the real part of cos z, cos x cosh y, to 2 decimal places?`, answer: [r2(C.Re)], explanation: `${par(r4(X.c))} × ${n(r4(C.ch))} ${to2(C.Re)}.` }
  ] }; }
});

})();
