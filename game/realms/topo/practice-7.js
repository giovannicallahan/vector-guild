/* Topology: shape without size practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p7.js. */
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
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* An angle of (num ÷ den)π radians, reduced: 'π ÷ 2', '5π ÷ 12', 'π', '2π ÷ 3'. */
const piFrac = (num, den) => { const d = gcd(num, den), a = num / d, b = den / d, top = a === 1 ? 'π' : `${a}π`; return b === 1 ? top : `${top} ÷ ${b}`; };
const r2 = x => Math.round(x * 100 + 1e-9) / 100;
/* A value whose third decimal sits near a rounding tie (x.xx5). */
const nearTie = x => { const f = Math.abs(x * 100) % 1; return Math.abs(f - 0.5) < 0.05; };
const times = c => c === 1 ? 'once' : c === 2 ? 'twice' : `${c} times`;
const often = c => c === 0 ? '0 times' : times(c);
const sub = d => String(d).replace(/\d/g, c => '₀₁₂₃₄₅₆₇₈₉'[c]);
/* Bounded retry: up to 1000 tries of make(), else the fallback (canonical) parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const shuffle = (R, list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* A spherical triangle with angles a, b, c (in twelfths of π) exists when the angle sum beats π and no angle is too big. */
const sphTri = (a, b, c) => a >= 1 && b >= 1 && c >= 1 && a <= 11 && b <= 11 && c <= 11 && a + b + c > 12 && a + b - c < 12 && a + c - b < 12 && b + c - a < 12;
/* Surfaces: o = 1 orientable of genus h, o = 0 non-orientable with h cross-caps. */
const surfName = (o, h) => o ? (h === 0 ? 'a sphere (orientable, genus 0)' : h === 1 ? 'a torus (orientable, genus 1)' : `an orientable surface of genus ${n(h)}`)
 : (h === 1 ? 'a projective plane (1 cross-cap)' : h === 2 ? 'a Klein bottle (2 cross-caps)' : `a non-orientable surface with ${n(h)} cross-caps`);
const chiOf = (o, h) => o ? 2 - 2 * h : 2 - h;
const chiRule = (o, h) => o ? `χ = 2 − 2 × ${n(h)} = ${n(2 - 2 * h)}` : `χ = 2 − ${n(h)} = ${n(2 - h)}`;
const sgnOf = x => x > 0 ? 1 : x < 0 ? -1 : 0;
const geomWord = s => s > 0 ? 'elliptic' : s < 0 ? 'hyperbolic' : 'flat';
/* k = −1 ÷ m written out. */
const kTxt = m => m === 1 ? '−1' : `−1 ÷ ${n(m)}`;
const kDec = m => n(-1 / m);

/* ---- q31 Triangles on curved surfaces [H 7.2, 7.4] ---- */

/* b: a calibration balloon (a sphere of radius s). Two corners and the area are known: the angle excess is A ÷ s² and the third angle follows. */
mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'The calibration balloon',
 brief: 'The Observatory has marked a triangular patch on its calibration balloon, and the crew has lost one corner angle from the log.',
 labels: ['angle excess (rad)', 'third angle (rad)'], tolerance: 0.005,
 gl: [['angle excess (rad)'], ['third angle (rad)']]
}, {
 canonical: { s: 8, a: 3, b: 5, A: 60 },
 draw: R => tries(() => { const s = R.int(3, 12); return { s, a: R.int(2, 9), b: R.int(2, 9), A: R.int(Math.ceil(0.15 * s * s), Math.floor(2.2 * s * s)) }; },
  p => { const ex = p.A / (p.s * p.s), al = p.a * Math.PI / 12, be = p.b * Math.PI / 12, ga = Math.PI + ex - al - be;
   return p.s !== 5 && p.A % (p.s * p.s) !== 0 && ga > 0.25 && ga < Math.PI - 0.25 && ex < 2 * Math.min(al, be, ga) && ![ex, ga].some(nearTie); },
  { s: 8, a: 3, b: 5, A: 60 }),
 build: ({ s, a, b, A }) => { const s2 = s * s, ex = A / s2, al = a * Math.PI / 12, be = b * Math.PI / 12, ga = Math.PI + ex - al - be; return {
  prompt: `The Observatory has inflated a spherical calibration balloon of radius ${n(s)} metres, so its skin has curvature k = 1 ÷ ${n(s)}² = 1 ÷ ${n(s2)}. A triangular patch is marked on it with sides along great circles, the straightest paths on a sphere. The patch has an area of ${n(A)} square metres. Two of its corner angles are ${piFrac(a, 12)} and ${piFrac(b, 12)} radians. Enter the patch’s angle excess in radians, then its third corner angle in radians. Give both to 2 decimal places, rounding only at the end.`,
  answer: [r2(ex), r2(ga)],
  hints: ['On a surface of curvature k, a triangle of area A has angle excess kA, where the angle excess is the angle sum minus π.', 'Turn the rule round: the three angles add up to π + kA. The third angle is that sum minus the two angles you already know.'],
  solution: `With k = 1 ÷ ${n(s2)}, the angle excess is kA = ${n(A)} ÷ ${n(s2)} ≈ ${n(r2(ex))} radians. The three angles add up to π + kA, so the third angle is γ = π + ${n(A)} ÷ ${n(s2)} − ${piFrac(a, 12)} − ${piFrac(b, 12)} ≈ ${n(r2(ga))} radians.`,
  guidance: [
   { prompt: `The angle excess is kA, with k = 1 ÷ ${n(s2)} and A = ${n(A)}. What is it, to 2 decimal places?`, answer: [r2(ex)], explanation: `kA = ${n(A)} ÷ ${n(s2)} ≈ ${n(r2(ex))} radians.` },
   { prompt: `The three angles add up to π plus the angle excess. Take away ${piFrac(a, 12)} and ${piFrac(b, 12)}: what is the third angle, to 2 decimal places? Use the exact excess, not the rounded one.`, answer: [r2(ga)], explanation: `γ = π + ${n(A)} ÷ ${n(s2)} − ${piFrac(a, 12)} − ${piFrac(b, 12)} ≈ ${n(r2(ga))} radians.` }
  ] }; }
});

/* c: a triangular zone on a small moon; area, and how many copies tile the whole moon. e = angle sum − π in twelfths of π, a divisor of 48. */
mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'Zoning the survey moon',
 brief: 'The crew wants to split a small survey moon into identical triangular zones and needs the size of one zone and how many there are.',
 labels: ['angle excess (rad)', 'zone area (km²)', 'zones in the moon'], tolerance: 0.005,
 gl: [['angle excess (rad)'], ['zone area (km²)'], ['zones in the moon']]
}, {
 canonical: { s: 7, a: 7, b: 4, c: 4 },
 draw: R => tries(() => { const e = R.pick([1, 2, 3, 4, 6, 8, 12]), a = R.int(1, 11), b = R.int(1, 11); return { s: R.int(3, 12), a, b, c: 12 + e - a - b }; },
  p => { const e = p.a + p.b + p.c - 12, ex = e * Math.PI / 12; return sphTri(p.a, p.b, p.c) && p.s !== 5 && ![ex, ex * p.s * p.s].some(nearTie); },
  { s: 7, a: 7, b: 4, c: 4 }),
 build: ({ s, a, b, c }) => { const s2 = s * s, e = a + b + c - 12, ex = e * Math.PI / 12, area = ex * s2, whole = 4 * s2, copies = 48 / e,
  ang = `${piFrac(a, 12)}, ${piFrac(b, 12)} and ${piFrac(c, 12)}`; return {
  prompt: `A survey moon is a sphere of radius ${n(s)} kilometres, so its surface has curvature k = 1 ÷ ${n(s)}² = 1 ÷ ${n(s2)}. One triangular zone is pegged out with sides along great circles, and its corner angles are ${ang} radians. Enter the zone’s angle excess in radians, then its area in square kilometres. The whole moon has surface area 4π × ${n(s)}² square kilometres. Suppose identical copies of this zone cover the whole moon exactly, with no gaps and no overlaps: enter how many copies there are. Give the first two answers to 2 decimal places, rounding only at the end.`,
  answer: [r2(ex), r2(area), copies],
  hints: ['The angle excess is the angle sum minus π. On a surface of curvature k, a triangle satisfies kA = α + β + γ − π, so on a sphere of radius s the area is the angle excess times s².', 'The number of copies is the whole surface area divided by the area of one zone. Keep the π in both and it cancels.'],
  solution: `The angles add up to ${piFrac(a + b + c, 12)}, so the angle excess is ${piFrac(a + b + c, 12)} − π = ${piFrac(e, 12)} ≈ ${n(r2(ex))} radians. By kA = α + β + γ − π, the area is A = (${piFrac(e, 12)}) × ${n(s2)} ≈ ${n(r2(area))} square kilometres. The whole moon has area 4π × ${n(s2)} = ${n(whole)}π, so the number of copies is ${n(whole)}π ÷ ((${piFrac(e, 12)}) × ${n(s2)}) = 4π ÷ (${piFrac(e, 12)}) = ${n(copies)}.`,
  guidance: [
   { prompt: `Add the angles ${ang} and take away π. What is the angle excess, to 2 decimal places?`, answer: [r2(ex)], explanation: `${piFrac(a, 12)} + ${piFrac(b, 12)} + ${piFrac(c, 12)} = ${piFrac(a + b + c, 12)}, and ${piFrac(a + b + c, 12)} − π = ${piFrac(e, 12)} ≈ ${n(r2(ex))} radians.` },
   { prompt: `With k = 1 ÷ ${n(s2)}, the area is the angle excess times ${n(s2)}. What is the zone’s area in square kilometres, to 2 decimal places?`, answer: [r2(area)], explanation: `A = (${piFrac(e, 12)}) × ${n(s2)} ≈ ${n(r2(area))} square kilometres. Use the exact excess, not the rounded one.` },
   { prompt: `The whole moon is 4π × ${n(s2)} = ${n(whole)}π square kilometres and one zone is (${piFrac(e, 12)}) × ${n(s2)}. How many zones fit exactly?`, answer: [copies], explanation: `${n(whole)}π ÷ ((${piFrac(e, 12)}) × ${n(s2)}) = 4π ÷ (${piFrac(e, 12)}) = ${n(copies)}. The radius cancels, so the count depends only on the angle excess.` }
  ] }; }
});

/* d: uses q30. Angles and an area of mπ square metres give the curvature, so N = s² and the radius s. m = e·s² ÷ 12. */
mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q30', title: 'The dome of unknown radius',
 brief: 'A triangle was surveyed on a dome whose radius was never recorded, and the crew must recover the radius from the triangle alone.',
 labels: ['angle excess (rad)', 'N in k = 1 ÷ N', 'radius (m)'], tolerance: 0.005,
 gl: [['angle excess (rad)'], ['N in k = 1 ÷ N'], ['radius (m)']]
}, {
 canonical: { s: 6, a: 5, b: 5, c: 4 },
 draw: R => tries(() => { const e = R.int(1, 8), a = R.int(1, 11), b = R.int(1, 11), s = R.int(4, 15); return { s, a, b, c: 12 + e - a - b }; },
  p => { const e = p.a + p.b + p.c - 12; return sphTri(p.a, p.b, p.c) && p.s !== 5 && (e * p.s * p.s) % 12 === 0 && e * p.s * p.s / 12 >= 2 && !nearTie(e * Math.PI / 12); },
  { s: 6, a: 5, b: 5, c: 4 }),
 build: ({ s, a, b, c }) => { const s2 = s * s, e = a + b + c - 12, m = e * s2 / 12, ex = e * Math.PI / 12, mp = m === 1 ? 'π' : `${n(m)}π`,
  ang = `${piFrac(a, 12)}, ${piFrac(b, 12)} and ${piFrac(c, 12)}`; return {
  prompt: `A triangle pegged out on a spherical dome, with sides along great circles, has corner angles ${ang} radians and an area of ${mp} square metres. The dome’s radius was never written down. Enter the triangle’s angle excess in radians, to 2 decimal places. Then the dome’s curvature is k = 1 ÷ N for a whole number N: enter N. Then enter the dome’s radius in metres, using k = 1 ÷ s² for a sphere of radius s.`,
  answer: [r2(ex), s2, s],
  hints: ['The angle excess is the angle sum minus π. On a surface of curvature k, a triangle satisfies kA = α + β + γ − π, so k = (angle excess) ÷ A.', 'Both the area and the angle excess contain π, and it cancels. Then k = 1 ÷ N gives N, and k = 1 ÷ s² means s is the square root of N.'],
  solution: `The angles add up to ${piFrac(a + b + c, 12)}, so the angle excess is ${piFrac(e, 12)} ≈ ${n(r2(ex))} radians. Then k = (angle excess) ÷ A = (${piFrac(e, 12)}) ÷ ${mp} = ${n(e)} ÷ ${n(12 * m)} = 1 ÷ ${n(s2)}, so N = ${n(s2)}. For a sphere k = 1 ÷ s², so s² = ${n(s2)} and the radius is ${n(s)} metres.`,
  guidance: [
   { prompt: `Add the angles ${ang} and take away π. What is the angle excess, to 2 decimal places?`, answer: [r2(ex)], explanation: `${piFrac(a + b + c, 12)} − π = ${piFrac(e, 12)} ≈ ${n(r2(ex))} radians.` },
   { prompt: `Turn kA = (angle excess) round: k = (angle excess) ÷ A. The π cancels, so what is N in k = 1 ÷ N?`, answer: [s2], explanation: `k = (${piFrac(e, 12)}) ÷ ${mp} = ${n(e)} ÷ ${n(12 * m)} = 1 ÷ ${n(s2)}, so N = ${n(s2)}.` },
   { prompt: `For a sphere of radius s the curvature is 1 ÷ s². With k = 1 ÷ ${n(s2)}, what is the radius in metres?`, answer: [s], explanation: `s² = ${n(s2)}, so s = ${n(s)} metres.` }
  ] }; }
});

/* ---- q32 Gauss–Bonnet [H 7.6] ---- */

/* b: the area is given, the curvature is not. A = Pπ with P = (4g − 4)m; k = 2χ ÷ P = −1 ÷ m (m is 1, 2, 4 or 5 so k is a short decimal). */
mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'Sizing the cryostat shell',
 brief: 'The Observatory’s new cryostat shell has a known area but nobody wrote down the curvature it was built to, and a twin shell is planned.',
 labels: ['χ', 'curvature k', 'twin shell area ÷ π'], tolerance: 0.005,
 gl: [['χ'], ['curvature k'], ['twin shell area ÷ π']]
}, {
 canonical: { g1: 4, m: 2, g2: 6 },
 draw: R => tries(() => ({ g1: R.int(2, 9), m: R.pick([1, 2, 4, 5]), g2: R.int(2, 9) }), p => p.g1 !== p.g2 && !(p.g1 === 2 && p.m === 1), { g1: 4, m: 2, g2: 6 }),
 build: ({ g1, m, g2 }) => { const chi1 = 2 - 2 * g1, P = -2 * chi1 * m, k = -1 / m, chi2 = 2 - 2 * g2, A2 = -2 * chi2 * m; return {
  prompt: `The Observatory’s cryostat shell is a closed surface of genus ${n(g1)} with the same curvature k at every point, and its area is ${n(P)}π square metres. Enter its Euler characteristic χ, then its curvature k as a decimal. A twin shell of genus ${n(g2)} is built with the same curvature k: enter the twin’s area divided by π.`,
  answer: [chi1, k, A2],
  hints: ['An orientable surface of genus g has Euler characteristic χ = 2 − 2g. Gauss–Bonnet says kA = 2πχ.', 'Turn Gauss–Bonnet round to find the curvature: k = 2πχ ÷ A. The π in the area cancels. Then use A = 2πχ ÷ k for the twin.'],
  solution: `Genus ${n(g1)} gives χ = 2 − 2 × ${n(g1)} = ${n(chi1)}. By Gauss–Bonnet, k = 2πχ ÷ A = 2π × ${par(chi1)} ÷ (${n(P)}π) = ${n(2 * chi1)} ÷ ${n(P)} = ${n(k)}. The twin has χ = 2 − 2 × ${n(g2)} = ${n(chi2)}, so A = 2πχ ÷ k = 2π × ${par(chi2)} ÷ ${par(k)} = ${n(A2)}π, and the answer is ${n(A2)}.`,
  guidance: [
   { prompt: `What is the Euler characteristic χ = 2 − 2g of a surface of genus ${n(g1)}?`, answer: [chi1], explanation: `χ = 2 − 2 × ${n(g1)} = ${n(chi1)}.` },
   { prompt: `Gauss–Bonnet says kA = 2πχ, so k = 2πχ ÷ A. With χ = ${n(chi1)} and A = ${n(P)}π, what is k as a decimal?`, answer: [k], explanation: `k = 2π × ${par(chi1)} ÷ (${n(P)}π) = ${n(2 * chi1)} ÷ ${n(P)} = ${n(k)}. The π cancels.` },
   { prompt: `The twin has χ = ${n(chi2)} and the same k = ${n(k)}. What is its area divided by π, from A = 2πχ ÷ k?`, answer: [A2], explanation: `A = 2π × ${par(chi2)} ÷ ${par(k)} = ${n(A2)}π.` }
  ] }; }
});

/* c: coating a shell. Genus g at k = −1 ÷ m; area (4g − 4)mπ square metres; r litres per square metre. */
mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Coating the mirror shell',
 brief: 'A closed mirror shell for the Observatory needs a reflective coat, and the crew must order the right amount.',
 labels: ['χ', 'shell area (m²)', 'coating (litres)'], tolerance: 0.005,
 gl: [['χ'], ['shell area (m²)'], ['coating (litres)']]
}, {
 canonical: { g: 3, m: 3, r: 2.5 },
 draw: R => tries(() => ({ g: R.int(2, 8), m: R.int(1, 6), r: R.pick([0.5, 1.5, 2, 2.5, 3, 4]) }),
  p => { const A = (4 * p.g - 4) * p.m * Math.PI; return !(p.g === 2 && p.m === 1) && ![A, A * p.r].some(nearTie); }, { g: 3, m: 3, r: 2.5 }),
 build: ({ g, m, r }) => { const chi = 2 - 2 * g, Pm = (4 * g - 4) * m, A = Pm * Math.PI, L = A * r; return {
  prompt: `A closed mirror shell for the Observatory has genus ${n(g)} and the same curvature k = ${kTxt(m)} at every point. Its whole surface takes a reflective coat, and every square metre needs ${n(r)} litres of coating. Enter the shell’s Euler characteristic χ, then its area in square metres, then the litres of coating needed. Give the area and the litres to 2 decimal places, working the litres from the exact area, and type answers of 1000 or more without commas.`,
  answer: [chi, r2(A), r2(L)],
  hints: ['An orientable surface of genus g has Euler characteristic χ = 2 − 2g. Gauss–Bonnet says kA = 2πχ for a closed surface of constant curvature k.', 'The area is A = 2πχ ÷ k, and dividing by a fraction such as −1 ÷ 3 is multiplying by −3. The coating is the area times the litres for each square metre.'],
  solution: `Genus ${n(g)} gives χ = 2 − 2 × ${n(g)} = ${n(chi)}. By Gauss–Bonnet, A = 2πχ ÷ k = 2π × ${par(chi)} ÷ (${kTxt(m)}) = ${n(Pm)}π ≈ ${n(r2(A))} square metres. The coating is ${n(r)} litres for each square metre, so ${n(r)} × ${n(Pm)}π ≈ ${n(r2(L))} litres.`,
  guidance: [
   { prompt: `What is the Euler characteristic χ = 2 − 2g of a surface of genus ${n(g)}?`, answer: [chi], explanation: `χ = 2 − 2 × ${n(g)} = ${n(chi)}.` },
   { prompt: `With k = ${kTxt(m)} and χ = ${n(chi)}, Gauss–Bonnet gives A = 2πχ ÷ k. What is the area in square metres, to 2 decimal places?`, answer: [r2(A)], explanation: `A = 2π × ${par(chi)} ÷ (${kTxt(m)}) = ${n(Pm)}π ≈ ${n(r2(A))} square metres.` },
   { prompt: `Each square metre takes ${n(r)} litres. How many litres does the whole shell take, to 2 decimal places? Use the exact area ${n(Pm)}π, not the rounded one.`, answer: [r2(L)], explanation: `${n(r)} × ${n(Pm)}π ≈ ${n(r2(L))} litres.` }
  ] }; }
});

/* d: uses q25. The Euler characteristic is given (−c); the genus comes from χ = 2 − 2g. A = 2cmπ at k = −1 ÷ m, and c·m ÷ 2 = s² so a sphere of radius s has the same area. */
mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q25', title: 'The sphere with the same skin',
 brief: 'The crew knows only the Euler characteristic of a hull and its curvature, and wants to compare its area with a plain sphere.',
 labels: ['genus g', 'hull area ÷ π', 'matching sphere radius (m)'], tolerance: 0.005,
 gl: [['genus g'], ['hull area ÷ π'], ['matching sphere radius (m)']]
}, {
 canonical: { c: 14, m: 3 },
 draw: R => tries(() => ({ c: 2 * R.int(1, 15), m: R.int(1, 6) }), p => !(p.c === 2 && p.m === 1) && !nearTie(Math.sqrt(p.c * p.m / 2)), { c: 14, m: 3 }),
 build: ({ c, m }) => { const g = (c + 2) / 2, A = 2 * c * m, s = Math.sqrt(A / 4), eq = Number.isInteger(s) ? '=' : '≈'; return {
  prompt: `A closed orientable hull has Euler characteristic χ = ${n(-c)} and constant curvature k = ${kTxt(m)}. Enter its genus, then its area divided by π. A sphere of radius s has area 4πs²: enter the radius in metres of the sphere that has exactly the same area as the hull, to 2 decimal places.`,
  answer: [g, A, r2(s)],
  hints: ['An orientable surface of genus g has χ = 2 − 2g, so the genus comes from χ. Gauss–Bonnet says kA = 2πχ.', 'The area is A = 2πχ ÷ k. To match a sphere, set that equal to 4πs² and divide by 4π: the radius is the square root of what is left.'],
  solution: `From χ = 2 − 2g we get ${n(-c)} = 2 − 2g, so 2g = ${n(c + 2)} and g = ${n(g)}. By Gauss–Bonnet, A = 2πχ ÷ k = 2π × ${par(-c)} ÷ (${kTxt(m)}) = ${n(A)}π, so the area divided by π is ${n(A)}. A sphere of radius s has area 4πs², so 4πs² = ${n(A)}π gives s² = ${n(A / 4)} and s ${eq} ${n(r2(s))} metres.`,
  guidance: [
   { prompt: `Use χ = 2 − 2g with χ = ${n(-c)}. What is the genus g?`, answer: [g], explanation: `${n(-c)} = 2 − 2g gives 2g = ${n(c + 2)}, so g = ${n(g)}.` },
   { prompt: `Gauss–Bonnet gives A = 2πχ ÷ k. With χ = ${n(-c)} and k = ${kTxt(m)}, what is A ÷ π?`, answer: [A], explanation: `A = 2π × ${par(-c)} ÷ (${kTxt(m)}) = ${n(A)}π.` },
   { prompt: `A sphere of radius s has area 4πs². Set 4πs² = ${n(A)}π. What is s in metres, to 2 decimal places?`, answer: [r2(s)], explanation: `s² = ${n(A)} ÷ 4 = ${n(A / 4)}, so s ${eq} ${n(r2(s))}.` }
  ] }; }
});

/* ---- q33 Which geometry a surface allows [H 7.4, 7.6] ---- */

/* b: five surfaces; count the elliptic (χ > 0), flat (χ = 0) and hyperbolic (χ < 0) ones. items = list of [o, h]. */
const ELL = [[1, 0], [0, 1]], FLAT = [[1, 1], [0, 2]];
const HYP = []; for (let h = 2; h <= 7; h++) HYP.push([1, h]); for (let h = 3; h <= 9; h++) HYP.push([0, h]);
const letters = ['A', 'B', 'C', 'D', 'E'];
mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'Sorting the hull catalogue',
 brief: 'The Hull Gallery has a catalogue of five closed hull shapes, and the Observatory must sort them by the geometry each can carry.',
 labels: ['elliptic designs', 'flat designs', 'hyperbolic designs'], tolerance: 0.01,
 gl: [['elliptic designs'], ['flat designs'], ['hyperbolic designs']]
}, {
 canonical: { items: [[0, 4], [1, 1], [0, 1], [1, 5], [0, 2]] },
 draw: R => tries(() => { const ne = R.int(0, 2), nf = R.int(0, 2), nh = 5 - ne - nf; if (ne + nf === 0) return null;
   return { items: shuffle(R, [...shuffle(R, ELL).slice(0, ne), ...shuffle(R, FLAT).slice(0, nf), ...shuffle(R, HYP).slice(0, nh)]) }; },
  p => p && !(p.items.length === 5 && p.items.every(([o, h]) => o === 1 && h === 2)), { items: [[0, 4], [1, 1], [0, 1], [1, 5], [0, 2]] }),
 build: ({ items }) => { const chis = items.map(([o, h]) => chiOf(o, h)), ne = chis.filter(x => x > 0).length, nf = chis.filter(x => x === 0).length, nh = chis.filter(x => x < 0).length,
  list = items.map(([o, h], i) => `${letters[i]} is ${surfName(o, h)}`).join('; '), chiList = chis.map((x, i) => `${letters[i]}: ${n(x)}`).join(', '); return {
  prompt: `The Hull Gallery’s catalogue lists five closed hull shapes. ${list}. Each can be given one constant curvature k all over, and Gauss–Bonnet fixes whether k is positive, zero or negative. Enter how many of the five have an elliptic geometry (k > 0), then how many have a flat one (k = 0), then how many have a hyperbolic one (k < 0).`,
  answer: [ne, nf, nh],
  hints: ['Find χ for each: χ = 2 − 2g for an orientable surface of genus g, and χ = 2 − c for a non-orientable one with c cross-caps.', 'In kA = 2πχ the area A is positive, so k has the same sign as χ: positive χ is elliptic, zero is flat, negative is hyperbolic.'],
  solution: `The Euler characteristics are ${chiList}. The positive ones are elliptic, the zeros flat and the negative ones hyperbolic, so there are ${n(ne)} elliptic, ${n(nf)} flat and ${n(nh)} hyperbolic designs.`,
  guidance: [
   { prompt: 'Work out χ for each design. How many have χ > 0, so that k > 0 and the geometry is elliptic?', answer: [ne], explanation: `The values are ${chiList}. ${n(ne)} of them ${ne === 1 ? 'is' : 'are'} positive.` },
   { prompt: 'How many designs have χ = 0, so that k = 0 and the geometry is flat?', answer: [nf], explanation: `${n(nf)} of the values ${chiList} ${nf === 1 ? 'is' : 'are'} zero.` },
   { prompt: 'How many designs have χ < 0, so that k < 0 and the geometry is hyperbolic?', answer: [nh], explanation: `${n(nh)} of the values ${chiList} ${nh === 1 ? 'is' : 'are'} negative.` }
  ] }; }
});

/* c: a non-orientable hull with c cross-caps at k = −1, covered exactly by identical triangles with angles π/p, π/q, π/r (area π(1 − 1/p − 1/q − 1/r) = π/D). */
const TILES = [[2, 3, 7], [2, 3, 8], [2, 3, 9], [2, 4, 5], [2, 4, 6], [3, 3, 4], [2, 5, 5], [2, 4, 8], [3, 3, 6], [2, 6, 6], [3, 4, 4], [4, 4, 4]];
const tileD = ([p, q, r]) => p * q * r / (p * q * r - q * r - p * r - p * q);
mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Triangular hull plates',
 brief: 'A non-orientable hull is to be covered with identical triangular plates, and the crew must know how many plates to cut.',
 labels: ['χ', 'hull area ÷ π', 'plates'], tolerance: 0.01,
 gl: [['χ'], ['hull area ÷ π'], ['plates']]
}, {
 canonical: { c: 6, t: 3 },
 draw: R => ({ c: R.int(3, 10), t: R.int(0, TILES.length - 1) }),
 build: ({ c, t }) => { const [p, q, r] = TILES[t], D = tileD(TILES[t]), chi = 2 - c, P = -2 * chi, plates = P * D,
  ang = `π ÷ ${n(p)}, π ÷ ${n(q)} and π ÷ ${n(r)}`; return {
  prompt: `A closed non-orientable hull with ${n(c)} cross-caps is given the constant curvature k = −1. It is to be covered exactly by identical triangular plates, with no gaps and no overlaps, each with corner angles ${ang} radians. Enter the hull’s Euler characteristic χ, then its area divided by π, then the number of plates. For a triangle on a surface of curvature k, kA = α + β + γ − π.`,
  answer: [chi, P, plates],
  hints: ['A non-orientable surface with c cross-caps has χ = 2 − c. With k = −1, Gauss–Bonnet kA = 2πχ gives A = −2πχ.', 'For one plate, kA = α + β + γ − π with k = −1 gives A = π − (α + β + γ). The number of plates is the hull’s area divided by one plate’s area, and the π cancels.'],
  solution: `${chiRule(0, c)}. With k = −1, A = −2πχ = ${n(P)}π, so the area divided by π is ${n(P)}. One plate has angle sum π ÷ ${n(p)} + π ÷ ${n(q)} + π ÷ ${n(r)}, so its area is π − (that sum) = π ÷ ${n(D)}. The number of plates is ${n(P)}π ÷ (π ÷ ${n(D)}) = ${n(plates)}.`,
  guidance: [
   { prompt: `What is the Euler characteristic χ = 2 − c of a surface with ${n(c)} cross-caps?`, answer: [chi], explanation: `χ = 2 − ${n(c)} = ${n(chi)}.` },
   { prompt: `With k = −1, Gauss–Bonnet kA = 2πχ gives A = −2πχ. What is the hull’s area divided by π?`, answer: [P], explanation: `A = −2π × ${par(chi)} = ${n(P)}π.` },
   { prompt: `One plate has area π − (π ÷ ${n(p)} + π ÷ ${n(q)} + π ÷ ${n(r)}) = π ÷ ${n(D)}. How many plates cover the hull of area ${n(P)}π?`, answer: [plates], explanation: `${n(P)}π ÷ (π ÷ ${n(D)}) = ${n(P)} × ${n(D)} = ${n(plates)}.` }
  ] }; }
});

/* d: uses q24. Three sections joined by connected sums; χ(X # Y) = χ(X) + χ(Y) − 2. */
const SECTS = []; for (let h = 0; h <= 4; h++) SECTS.push([1, h]); for (let h = 1; h <= 6; h++) SECTS.push([0, h]);
mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q24', title: 'Joining three hull sections',
 brief: 'Three hull sections are to be sewn into one closed hull, and the Observatory must know what geometry and area the finished hull can have.',
 labels: ['χ of A # B', 'sign of k for A # B', 'χ of A # B # C', 'area ÷ π of A # B # C'], tolerance: 0.01,
 gl: [['χ of A # B'], ['sign of k for A # B'], ['χ of A # B # C'], ['area ÷ π of A # B # C']]
}, {
 canonical: { o1: 0, h1: 1, o2: 1, h2: 0, o3: 0, h3: 5 },
 draw: R => tries(() => { const want = R.pick([1, 0, -1, -1]), a = R.pick(SECTS), b = R.pick(SECTS), c = R.pick(SECTS);
   return { want, o1: a[0], h1: a[1], o2: b[0], h2: b[1], o3: c[0], h3: c[1] }; },
  p => { const ab = chiOf(p.o1, p.h1) + chiOf(p.o2, p.h2) - 2; return sgnOf(ab) === p.want && ab + chiOf(p.o3, p.h3) - 2 < 0; },
  { o1: 0, h1: 1, o2: 1, h2: 0, o3: 0, h3: 5 }),
 build: ({ o1, h1, o2, h2, o3, h3 }) => { const c1 = chiOf(o1, h1), c2 = chiOf(o2, h2), c3 = chiOf(o3, h3), ab = c1 + c2 - 2, sg = sgnOf(ab), tot = ab + c3 - 2, A = -2 * tot; return {
  prompt: `Three hull sections are sewn into one closed hull by connected sums. Section A is ${surfName(o1, h1)}, section B is ${surfName(o2, h2)} and section C is ${surfName(o3, h3)}. First A and B are joined to make A # B, and then C is joined to that to make A # B # C. Each join follows χ(X # Y) = χ(X) + χ(Y) − 2. Enter χ of A # B, then the sign of the constant curvature k that A # B can carry (1 for positive, 0 for zero, −1 for negative). Then enter χ of A # B # C, and its area divided by π when it is given k = −1.`,
  answer: [ab, sg, tot, A],
  hints: ['Find χ of each section first: χ = 2 − 2g for an orientable surface of genus g, and χ = 2 − c for a non-orientable one with c cross-caps. Then apply the join rule twice, once for each join.', 'k has the same sign as χ, because kA = 2πχ and the area A is positive. With k = −1, the area is A = −2πχ.'],
  solution: `${chiRule(o1, h1)} for A, ${chiRule(o2, h2)} for B. Joining them gives χ(A # B) = ${n(c1)} + ${par(c2)} − 2 = ${n(ab)}, so k has sign ${n(sg)} (${geomWord(sg)}). For C, ${chiRule(o3, h3)}, so χ(A # B # C) = ${par(ab)} + ${par(c3)} − 2 = ${n(tot)}. With k = −1, Gauss–Bonnet gives −A = 2π × ${par(tot)}, so A = ${n(A)}π and the answer is ${n(A)}.`,
  guidance: [
   { prompt: `Section A is ${surfName(o1, h1)} and section B is ${surfName(o2, h2)}. Find χ for each, then use χ(A # B) = χ(A) + χ(B) − 2. What is χ(A # B)?`, answer: [ab], explanation: `${chiRule(o1, h1)} and ${chiRule(o2, h2)}, so χ(A # B) = ${n(c1)} + ${par(c2)} − 2 = ${n(ab)}.` },
   { prompt: 'k has the same sign as χ. What sign of k can A # B carry (1, 0 or −1)?', answer: [sg], explanation: `χ(A # B) = ${n(ab)}, so the sign is ${n(sg)}: ${geomWord(sg)} geometry.` },
   { prompt: `Section C is ${surfName(o3, h3)}. Join it to A # B with the same rule. What is χ(A # B # C)?`, answer: [tot], explanation: `${chiRule(o3, h3)}, so χ(A # B # C) = ${par(ab)} + ${par(c3)} − 2 = ${n(tot)}.` },
   { prompt: `With k = −1, Gauss–Bonnet gives A = −2πχ. What is the area of A # B # C divided by π?`, answer: [A], explanation: `A = −2π × ${par(tot)} = ${n(A)}π.` }
  ] }; }
});

/* ---- q34 Fundamental domains [H 7.7] ---- */

/* b: the polygon's area is given, the genus is not. A = (n − 4)mπ at k = −1 ÷ m, so n = 4 + P ÷ m. */
mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The pattern with no label',
 brief: 'A paper hull pattern has lost its label, and the crew must work out which genus it was drawn for from its area.',
 labels: ['genus g', 'sides', 'N (angle π ÷ N)'], tolerance: 0.01,
 gl: [['sides'], ['genus g'], ['N (angle π ÷ N)']]
}, {
 canonical: { g: 5, m: 3 },
 draw: R => tries(() => ({ g: R.int(2, 9), m: R.int(1, 6) }), p => !(p.g === 2 && p.m === 1) && !(p.g === 5 && p.m === 3), { g: 4, m: 5 }),
 build: ({ g, m }) => { const sides = 4 * g, P = (4 * g - 4) * m, N = 2 * g; return {
  prompt: `A paper pattern for a closed orientable hull shows one regular polygon. Its gluing word has 4 letters for each unit of genus and sends all the corners to one point. The polygon is drawn with constant curvature k = ${kTxt(m)}, and its area is ${n(P)}π square metres. The genus is not written on it. Enter the genus, then the number of sides of the polygon, then N where each corner angle is π ÷ N.`,
  answer: [g, sides, N],
  hints: ['All the corners meet at one point, so the equal corner angles add up to 2π. For a polygon with n sides, kA = (angle sum) − (n − 2)π.', 'Put in angle sum 2π, the curvature and the area, and solve for n. The word has 4 letters for each unit of genus, so the sides are 4 times the genus.'],
  solution: `The corner angles add up to 2π, so for a polygon with n sides kA = 2π − (n − 2)π = (4 − n)π. With k = ${kTxt(m)} and A = ${n(P)}π, that gives kA = ${m === 1 ? `−${n(P)}π` : `−${n(P)}π ÷ ${n(m)} = ${n(-P / m)}π`} = (4 − n)π, so n = ${n(sides)} sides. There are 4 letters for each unit of genus, so g = ${n(sides)} ÷ 4 = ${n(g)}. The ${n(sides)} equal angles add up to 2π, so each is 2π ÷ ${n(sides)} = π ÷ ${n(N)}, and N = ${n(N)}.`,
  guidance: [
   { prompt: `The corners meet at one point, so kA = 2π − (n − 2)π = (4 − n)π. With k = ${kTxt(m)} and A = ${n(P)}π, how many sides n does the polygon have?`, answer: [sides], explanation: `kA = ${m === 1 ? `−${n(P)}π` : `−${n(P)}π ÷ ${n(m)} = ${n(-P / m)}π`} = (4 − n)π, so n = ${n(4 + P / m)}.` },
   { prompt: `The word has 4 letters for each unit of genus, so the polygon has 4g sides. With ${n(sides)} sides, what is g?`, answer: [g], explanation: `g = ${n(sides)} ÷ 4 = ${n(g)}.` },
   { prompt: `The ${n(sides)} equal corner angles add up to 2π. Each angle is π ÷ N: what is N?`, answer: [N], explanation: `2π ÷ ${n(sides)} = π ÷ ${n(N)}, so N = ${n(N)}.` }
  ] }; }
});

/* c: a hyperbolic display wall tiled by copies of the polygon: area of one copy, copies to cover a region of area Qπ, corner markers (one per corner per copy). */
mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'Tiling the display wall',
 brief: 'The Observatory’s display wall shows a hyperbolic floor made of copies of one hull polygon, and the crew must order the copies and their markers.',
 labels: ['one copy’s area ÷ π', 'copies', 'corner markers'], tolerance: 0.01,
 gl: [['one copy’s area ÷ π'], ['copies'], ['corner markers']]
}, {
 canonical: { g: 3, m: 2, Q: 128 },
 draw: R => tries(() => { const g = R.int(2, 7), m = R.int(1, 6), per = (4 * g - 4) * m; return { g, m, Q: per * R.int(3, 12) }; },
  p => !(p.g === 2 && p.m === 1), { g: 3, m: 2, Q: 128 }),
 build: ({ g, m, Q }) => { const sides = 4 * g, per = (4 * g - 4) * m, copies = Q / per, marks = sides * copies; return {
  prompt: `The Observatory’s display wall shows a hyperbolic floor with constant curvature k = ${kTxt(m)}, laid out in copies of one regular polygon. The polygon is the fundamental domain of the genus-${n(g)} surface: it has 4 sides for each unit of genus, and its gluing sends all its corners to one point. A region of the floor has an area of ${n(Q)}π square metres. Enter the area of one copy of the polygon divided by π. Then enter how many copies exactly cover the region. Then enter how many corner markers are needed if every corner of every copy gets its own marker.`,
  answer: [per, copies, marks],
  hints: ['The polygon has 4g sides and its equal corner angles add up to 2π. For a polygon with n sides, kA = (angle sum) − (n − 2)π.', 'Divide the area of the region by the area of one copy; the π cancels. Each copy has as many corners as sides.'],
  solution: `The polygon has 4 × ${n(g)} = ${n(sides)} sides. Its angles add up to 2π, so kA = 2π − (${n(sides)} − 2)π = ${n(4 - sides)}π. With k = ${kTxt(m)}, A = ${n(4 - sides)}π ÷ (${kTxt(m)}) = ${n(per)}π, so one copy has area ${n(per)}π. The region needs ${n(Q)}π ÷ ${n(per)}π = ${n(copies)} copies. Each copy has ${n(sides)} corners, so ${n(copies)} × ${n(sides)} = ${n(marks)} markers.`,
  guidance: [
   { prompt: `The polygon has ${n(sides)} sides and its corner angles add up to 2π, so kA = 2π − (${n(sides)} − 2)π. With k = ${kTxt(m)}, what is the area of one copy divided by π?`, answer: [per], explanation: `kA = 2π − ${n(sides - 2)}π = ${n(4 - sides)}π, so A = ${n(4 - sides)}π ÷ (${kTxt(m)}) = ${n(per)}π.` },
   { prompt: `One copy has area ${n(per)}π and the region has area ${n(Q)}π. How many copies cover the region exactly?`, answer: [copies], explanation: `${n(Q)}π ÷ ${n(per)}π = ${n(copies)}.` },
   { prompt: `Each copy has ${n(sides)} corners, and every corner of every copy gets its own marker. How many markers are needed for ${n(copies)} copies?`, answer: [marks], explanation: `${n(copies)} × ${n(sides)} = ${n(marks)}.` }
  ] }; }
});

/* d: uses q33 (c cross-caps, χ = 2 − c). The word a1a1 a2a2 … acac has 2c letters and sends all its corners to one point; k = −1 ÷ m. */
mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q33', title: 'A tile for the cross-cap hull',
 brief: 'The Hull Gallery wants a single drawn polygon for a hull with cross-caps, and the Observatory must size its corners and area.',
 labels: ['χ', 'N (angle π ÷ N)', 'copies at a corner', 'area ÷ π'], tolerance: 0.01,
 gl: [['χ'], ['N (angle π ÷ N)'], ['copies at a corner'], ['area ÷ π']]
}, {
 canonical: { c: 5, m: 2 },
 draw: R => ({ c: R.int(3, 10), m: R.int(1, 6) }),
 build: ({ c, m }) => { const sides = 2 * c, chi = 2 - c, A = (2 * c - 4) * m, word = `a₁a₁a₂a₂ … a${sub(c)}a${sub(c)}`; return {
  prompt: `A non-orientable hull with ${n(c)} cross-caps is drawn as one regular polygon glued by the word ${word}, which has 2 letters for each cross-cap. The gluing sends all the corners to one point, and the polygon is drawn with constant curvature k = ${kTxt(m)}. Enter the hull’s Euler characteristic χ. Then each corner angle is π ÷ N: enter N. Copies of this polygon tile the curved plane: enter how many copies meet at each corner point. Then enter the polygon’s area divided by π.`,
  answer: [chi, c, sides, A],
  hints: ['A non-orientable surface with c cross-caps has χ = 2 − c. All the corners meet at one point, so the equal corner angles add up to 2π.', 'Cut a polygon with n sides into n − 2 triangles. On curvature k its area satisfies kA = (angle sum) − (n − 2)π.'],
  solution: `${chiRule(0, c)}. The word has 2 × ${n(c)} = ${n(sides)} letters, so the polygon has ${n(sides)} sides and ${n(sides)} corners. They all glue to one point, so the ${n(sides)} equal angles add up to 2π and each is 2π ÷ ${n(sides)} = π ÷ ${n(c)}, so N = ${n(c)}. One corner of each copy fills the full turn at a corner point, so ${n(sides)} copies meet there. With angle sum 2π, kA = 2π − (${n(sides)} − 2)π = ${n(4 - sides)}π. With k = ${kTxt(m)}, A = ${n(A)}π and the answer is ${n(A)}.`,
  guidance: [
   { prompt: `What is the Euler characteristic χ = 2 − c of a surface with ${n(c)} cross-caps?`, answer: [chi], explanation: `χ = 2 − ${n(c)} = ${n(chi)}.` },
   { prompt: `The word has 2 letters for each cross-cap, so the polygon has ${n(sides)} sides. The ${n(sides)} equal corner angles add up to 2π. Each angle is π ÷ N: what is N?`, answer: [c], explanation: `2π ÷ ${n(sides)} = π ÷ ${n(c)}, so N = ${n(c)}.` },
   { prompt: `One corner of each copy fills the full turn at a corner point of the tiling. How many copies meet at each corner point?`, answer: [sides], explanation: `Each copy has one corner there and the polygon has ${n(sides)} corners that all glue to one point, so ${n(sides)} copies meet.` },
   { prompt: `With k = ${kTxt(m)} and angle sum 2π, kA = 2π − (${n(sides)} − 2)π. What is the area divided by π?`, answer: [A], explanation: `kA = 2π − ${n(sides - 2)}π = ${n(4 - sides)}π. Dividing by k = ${kTxt(m)} gives A = ${n(A)}π.` }
  ] }; }
});

/* ---- q35 Loops and winding numbers [W The fundamental group] ---- */

/* Sector codes 0 NE, 1 NW, 2 SW, 3 SE (anticlockwise order). Ray r is the border between sector r and sector r + 1:
   0 due north (NE | NW), 1 due west (NW | SW), 2 due south (SW | SE), 3 due east (SE | NE). Crossing r → r + 1 is anticlockwise. */
const SECT = ['NE', 'NW', 'SW', 'SE'], RAYS = ['north', 'west', 'south', 'east'];
const logText = seq => seq.map(i => SECT[i]).join(', ');
const crossR = (seq, r) => { const nx = (r + 1) % 4; let up = 0, down = 0; for (let i = 1; i < seq.length; i++) { if (seq[i - 1] === r && seq[i] === nx) up++; if (seq[i - 1] === nx && seq[i] === r) down++; } return { up, down, w: up - down }; };
const walkFrom = (R, s0, len, bias) => { const s = [s0]; let at = s0; for (let i = 0; i < len; i++) { at = (at + (R.next() < bias ? 1 : 3)) % 4; s.push(at); } return s; };
const sameSeq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const rayText = (r, who) => `the ray due ${RAYS[r]} from ${who}, the border between ${SECT[r]} and ${SECT[(r + 1) % 4]}`;

/* b: a cable tender and the ray due west or north or south. */
mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'The cable tender’s circuit',
 brief: 'A cable tender has driven a closed circuit round a relay post, and the crew must say how many times the cable is now wound round it.',
 labels: ['anticlockwise crossings', 'clockwise crossings', 'winding number'], tolerance: 0.01,
 gl: [['anticlockwise crossings'], ['clockwise crossings'], ['winding number']]
}, {
 canonical: { r: 1, seq: [2, 3, 0, 1, 2, 3, 2, 1, 0, 1, 2] },
 draw: R => tries(() => { const r = R.int(0, 2), s0 = R.int(0, 3); return { r, seq: walkFrom(R, s0, R.int(8, 14), R.pick([0.25, 0.4, 0.6, 0.75])) }; },
  p => { const q = crossR(p.seq, p.r); return p.seq[p.seq.length - 1] === p.seq[0] && q.up + q.down >= 2 && q.up !== q.down + 1 && !sameSeq(p.seq, [2, 3, 0, 1, 2, 3, 2, 1, 0, 1, 2]); },
  { r: 1, seq: [2, 3, 0, 1, 2, 3, 2, 1, 0, 1, 2] }),
 build: ({ r, seq }) => { const { up, down, w } = crossR(seq, r), L = seq.length, from = SECT[r], to = SECT[(r + 1) % 4]; return {
  prompt: `A cable tender drives a closed circuit round relay post P on the Orbit Ring. The north–south and east–west lines through P divide the ground into four sectors, NE, NW, SW and SE, in anticlockwise order. The tender never drives over P, and each move takes it into a neighbouring sector. Its log has ${n(L)} entries and starts and ends in ${SECT[seq[0]]}: ${logText(seq)}. This time use ${rayText(r, 'P')}. Enter how many times the tender crosses that ray anticlockwise (${from} to ${to}), then how many times clockwise (${to} to ${from}), then the winding number of the circuit round P.`,
  answer: [up, down, w],
  hints: [`Read the log in pairs of neighbouring entries. Only the pairs ${from}, ${to} and ${to}, ${from} cross the ray you were told to use.`, 'The winding number is the anticlockwise crossings minus the clockwise crossings, whichever ray you use.'],
  solution: `Reading the log in pairs, ${from} followed by ${to} happens ${often(up)}, and ${to} followed by ${from} happens ${often(down)}. Every other move stays clear of the ray. The winding number is ${n(up)} − ${n(down)} = ${n(w)}${w === 0 ? ', so the circuit goes round P no net times' : `, so the circuit goes round P ${times(Math.abs(w))} ${w > 0 ? 'anticlockwise' : 'clockwise'}`}.`,
  guidance: [
   { prompt: `How many times does the log go from ${from} straight to ${to}?`, answer: [up], explanation: up === 0 ? `The log never goes from ${from} straight to ${to}, so there are no anticlockwise crossings.` : `${from}, ${to} appears ${times(up)}: each time is one anticlockwise crossing of the ray.` },
   { prompt: `How many times does the log go from ${to} straight to ${from}?`, answer: [down], explanation: down === 0 ? `The log never goes from ${to} straight to ${from}, so there are no clockwise crossings.` : `${to}, ${from} appears ${times(down)}: each time is one clockwise crossing of the ray.` },
   { prompt: 'What is the winding number: anticlockwise crossings minus clockwise crossings?', answer: [w], explanation: `${n(up)} − ${n(down)} = ${n(w)}.` }
  ] }; }
});

/* c: a tethered drone; beeps (all crossings), the winding number and the net tether wound on (ℓ metres per net turn). */
const Q35C = [1, 2, 1, 2, 3, 2, 1, 0, 1, 2, 3, 0, 1];
mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'The tethered drone',
 brief: 'A drone tethered to a post has flown a closed circuit, and the crew must know how much tether is wound on the post.',
 labels: ['beeps', 'winding number', 'net tether (m)'], tolerance: 0.01,
 gl: [['beeps'], ['winding number'], ['net tether (m)']]
}, {
 canonical: { r: 1, len: 4, seq: [1, 2, 3, 0, 1, 2, 1, 0, 1, 2, 3, 0, 1] },
 draw: R => tries(() => { const r = R.int(0, 3), s0 = R.int(0, 3); return { r, len: R.pick([3, 4, 5, 6, 8, 10]), seq: walkFrom(R, s0, R.int(8, 16), R.pick([0.2, 0.35, 0.65, 0.8])) }; },
  p => { const q = crossR(p.seq, p.r); return p.seq[p.seq.length - 1] === p.seq[0] && q.w !== 0 && q.up + q.down >= 3 && !sameSeq(p.seq, Q35C); },
  { r: 1, len: 4, seq: [1, 2, 3, 0, 1, 2, 1, 0, 1, 2, 3, 0, 1] }),
 build: ({ r, len, seq }) => { const { up, down, w } = crossR(seq, r), L = seq.length, from = SECT[r], to = SECT[(r + 1) % 4], beeps = up + down, net = w * len; return {
  prompt: `A survey drone is tied to post T on the Orbit Ring by a tether and flies a closed loop that never passes over T. The north–south and east–west lines through T divide the ground into four sectors, NE, NW, SW and SE, in anticlockwise order, and each move takes the drone into a neighbouring sector. Its log has ${n(L)} entries and starts and ends in ${SECT[seq[0]]}: ${logText(seq)}. A ground sensor beeps each time the drone crosses ${rayText(r, 'T')}, in either direction. Each net anticlockwise turn winds ${n(len)} metres of tether onto the post, and each net clockwise turn winds ${n(len)} metres on the other way, counted as negative. Enter the number of beeps, then the winding number of the loop round T, then the net length of tether wound on in metres.`,
  answer: [beeps, w, net],
  hints: [`A beep is any crossing of the ray: a move from ${from} to ${to} or from ${to} to ${from}. Count both kinds for the beeps.`, 'The winding number is the anticlockwise crossings minus the clockwise crossings. Each net turn winds the same length of tether, so multiply the winding number by that length.'],
  solution: `Reading the log in pairs, ${from} followed by ${to} happens ${often(up)} and ${to} followed by ${from} happens ${often(down)}, so there are ${n(up)} + ${n(down)} = ${n(beeps)} beeps. The winding number is ${n(up)} − ${n(down)} = ${n(w)}. Each net turn winds ${n(len)} metres, so the net tether wound on is ${n(w)} × ${n(len)} = ${n(net)} metres.`,
  guidance: [
   { prompt: `How many times does the drone cross the ray in either direction, from ${from} to ${to} or from ${to} to ${from}?`, answer: [beeps], explanation: `${from}, ${to} appears ${often(up)} and ${to}, ${from} appears ${often(down)}: ${n(up)} + ${n(down)} = ${n(beeps)} beeps.` },
   { prompt: 'What is the winding number: anticlockwise crossings minus clockwise crossings?', answer: [w], explanation: `${n(up)} − ${n(down)} = ${n(w)}.` },
   { prompt: `Each net turn winds ${n(len)} metres of tether, anticlockwise positive. What is the net length wound on, in metres?`, answer: [net], explanation: `${n(w)} × ${n(len)} = ${n(net)} metres.` }
  ] }; }
});

/* d: a long log; the same circuit flown in reverse order has the opposite winding number. */
const Q35D = [0, 1, 2, 3, 2, 3, 0, 1, 2, 1, 0, 3, 0, 1, 2, 3, 2, 3, 0, 3, 2, 3, 0, 1, 0];
mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', title: 'A long day on the ring',
 brief: 'A long flight log has to be checked by hand, and a second drone will fly the same circuit the other way round.',
 labels: ['anticlockwise crossings', 'clockwise crossings', 'winding number', 'winding number of the reversed flight'], tolerance: 0.01,
 gl: [['anticlockwise crossings'], ['clockwise crossings'], ['winding number'], ['winding number of the reversed flight']]
}, {
 canonical: { r: 2, seq: Q35D },
 draw: R => tries(() => { const r = R.int(0, 3), s0 = R.int(0, 3); return { r, seq: walkFrom(R, s0, R.int(20, 30), R.pick([0.3, 0.4, 0.6, 0.7])) }; },
  p => { const q = crossR(p.seq, p.r); return p.seq[p.seq.length - 1] === p.seq[0] && q.w !== 0 && q.up + q.down >= 5 && !sameSeq(p.seq, Q35D); },
  { r: 2, seq: Q35D }),
 build: ({ r, seq }) => { const { up, down, w } = crossR(seq, r), L = seq.length, from = SECT[r], to = SECT[(r + 1) % 4], back = [...seq].reverse(), qb = crossR(back, r); return {
  prompt: `A long survey flight round beacon B on the Orbit Ring is logged by the sector it passes through: the north–south and east–west lines through B divide the ground into NE, NW, SW and SE, in anticlockwise order. The drone never passes over B, and each move takes it into a neighbouring sector. The log has ${n(L)} entries and starts and ends in ${SECT[seq[0]]}: ${logText(seq)}. Use ${rayText(r, 'B')}. Enter the anticlockwise crossings (${from} to ${to}), then the clockwise crossings (${to} to ${from}), then the winding number of the flight round B. A second drone flies the same circuit with the log read backwards, from its last entry to its first: enter the winding number of that second flight.`,
  answer: [up, down, w, qb.w],
  hints: [`Read the log in pairs of neighbouring entries. Only the pairs ${from}, ${to} and ${to}, ${from} cross the ray you were told to use. Tick them off as you go, because the log is long.`, 'The winding number is the anticlockwise crossings minus the clockwise crossings. Reading the log backwards turns every pair round, so ask which crossings become which.'],
  solution: `Reading the log in pairs, ${from} followed by ${to} happens ${often(up)}, and ${to} followed by ${from} happens ${often(down)}. The winding number is ${n(up)} − ${n(down)} = ${n(w)}. Read backwards, every pair is turned round: the ${n(up)} anticlockwise crossings become clockwise and the ${n(down)} clockwise ones become anticlockwise, so the winding number is ${n(down)} − ${n(up)} = ${n(qb.w)}.`,
  guidance: [
   { prompt: `How many times does the log go from ${from} straight to ${to}?`, answer: [up], explanation: `${from}, ${to} appears ${often(up)}: each time is one anticlockwise crossing of the ray.` },
   { prompt: `How many times does the log go from ${to} straight to ${from}?`, answer: [down], explanation: `${to}, ${from} appears ${often(down)}: each time is one clockwise crossing of the ray.` },
   { prompt: 'What is the winding number: anticlockwise crossings minus clockwise crossings?', answer: [w], explanation: `${n(up)} − ${n(down)} = ${n(w)}.` },
   { prompt: 'Read the log backwards. Each ordered pair turns round, so the old clockwise crossings are now anticlockwise and the other way round. What is the new winding number?', answer: [qb.w], explanation: `${n(down)} − ${n(up)} = ${n(qb.w)}, the opposite of ${n(w)}.` }
  ] }; }
});

})();
