/* Topology: shape without size mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* An angle of (num ÷ den)π radians, reduced: 'π ÷ 2', '5π ÷ 12', 'π', '2π ÷ 3'. */
const piFrac = (num, den) => { const d = gcd(num, den), a = num / d, b = den / d, top = a === 1 ? 'π' : `${a}π`; return b === 1 ? top : `${top} ÷ ${b}`; };
/* Round to 2 decimal places; nearTie flags a value whose third decimal sits on a rounding tie (x.xx5 within 0.0005). */
const r2 = x => Math.round(x * 100 + 1e-9) / 100;
/* q31: (num ÷ 12)π in brackets when it is a quotient, for a product. */
const pf = num => { const t = piFrac(num, 12); return t.includes('÷') ? `(${t})` : t; };
const nearTie = x => { const f = Math.abs(x * 100) % 1; return Math.abs(f - 0.5) < 0.05; };
const times = c => c === 1 ? 'once' : c === 2 ? 'twice' : `${c} times`;
const often = c => c === 0 ? 'never' : times(c);
const sub = d => String(d).replace(/\d/g, c => '₀₁₂₃₄₅₆₇₈₉'[c]);
/* Bounded retry: up to 1000 tries of make(), else the fallback (canonical) parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };

/* q35, q36: a closed path round beacon B logged as the sectors it passes through. Sector codes 0 NE, 1 NW, 2 SW, 3 SE
   (anticlockwise order); each move goes to a neighbouring sector. The ray due east from B is the border SE | NE. */
const SECT = ['NE', 'NW', 'SW', 'SE'];
const logText = seq => seq.map(i => SECT[i]).join(', ');
const crossings = seq => { let up = 0, down = 0; for (let i = 1; i < seq.length; i++) { if (seq[i - 1] === 3 && seq[i] === 0) up++; if (seq[i - 1] === 0 && seq[i] === 3) down++; } return { up, down, w: up - down }; };
/* A random closed walk from NE back to NE with len moves, leaning anticlockwise (bias > 0.5) or clockwise. */
const walk = (R, len, bias) => { const s = [0]; let at = 0; for (let i = 0; i < len; i++) { at = (at + (R.next() < bias ? 1 : 3)) % 4; s.push(at); } return s; };
const sameSeq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/* q33: a closed surface, orientable of genus h (o = 1) or non-orientable with h cross-caps (o = 0). */
const surfName = (o, h) => o ? (h === 0 ? 'a sphere (orientable, genus 0)' : h === 1 ? 'a torus (orientable, genus 1)' : `an orientable surface of genus ${n(h)}`)
 : (h === 1 ? 'a projective plane (1 cross-cap)' : h === 2 ? 'a Klein bottle (2 cross-caps)' : `a non-orientable surface with ${n(h)} cross-caps`);
const chiOf = (o, h) => o ? 2 - 2 * h : 2 - h;
const sgnOf = x => x > 0 ? 1 : x < 0 ? -1 : 0;
const geomWord = s => s > 0 ? 'elliptic' : s < 0 ? 'hyperbolic' : 'flat';
const chiRule = (o, h) => o ? `χ = 2 − 2 × ${n(h)} = ${n(2 - 2 * h)}` : `χ = 2 − ${n(h)} = ${n(2 - h)}`;
const drawSurf = R => R.bool() ? { o: 1, h: R.int(0, 8) } : { o: 0, h: R.int(1, 12) };

/* q37 */
const mapText = a => `θ ↦ ${a === -1 ? '−' : n(a)}θ`;

/* q38: a cable graph. kind 0: a grid x cells wide and y cells tall; kind 1: a wheel with x spokes; kind 2: x posts, every pair joined. */
const graphVE = ({ kind, x, y }) => kind === 0 ? { V: (x + 1) * (y + 1), E: x * (y + 1) + y * (x + 1) } : kind === 1 ? { V: x + 1, E: 2 * x } : { V: x, E: x * (x - 1) / 2 };
const graphText = ({ kind, x, y }) => kind === 0
 ? `a rectangular grid of cable ${n(x)} ${x === 1 ? 'cell' : 'cells'} wide and ${n(y)} ${y === 1 ? 'cell' : 'cells'} tall: every cell is a square edged by cable, and there is a junction at every corner of every cell`
 : kind === 1 ? `a wheel: a central hub joined by ${n(x)} straight spokes to ${n(x)} junctions on a rim, with each rim junction joined by a rim cable to the next one round the rim`
 : `a set of ${n(x)} relay posts with one cable joining every pair of posts, and no other junctions`;
/* The two counting sentences, [vertices, edges]. */
const graphCount = ({ kind, x, y }) => graphVEText({ kind, x, y }).split(/(?<=\.) (?=[A-Z])/);
const graphVEText = ({ kind, x, y }) => { const { V, E } = graphVE({ kind, x, y }); return kind === 0
 ? `The junctions form ${n(y + 1)} rows of ${n(x + 1)}, so V = ${n(y + 1)} × ${n(x + 1)} = ${n(V)}. Each of the ${n(y + 1)} rows has ${x === 1 ? 'one horizontal cable' : `${n(x)} horizontal cables`} and each of the ${n(x + 1)} columns has ${y === 1 ? 'one vertical cable' : `${n(y)} vertical ones`}, so E = ${n(y + 1)} × ${n(x)} + ${n(x + 1)} × ${n(y)} = ${n(E)}.`
 : kind === 1 ? `The hub and the ${n(x)} rim junctions give V = ${n(x)} + 1 = ${n(V)}. There are ${n(x)} spokes and ${n(x)} rim cables, so E = 2 × ${n(x)} = ${n(E)}.`
 : `The posts are the only junctions, so V = ${n(x)}. Each of the ${n(x)} posts has ${n(x - 1)} cables and each cable has two ends, so E = ${n(x)} × ${n(x - 1)} ÷ 2 = ${n(E)}.`; };

/* q39: f(x) = (x² + P) ÷ 10 when s = 1, f(x) = (P − x²) ÷ 10 when s = −1, on [0, 5]. g(x) = f(x) − x. */
const q39f = (s, P) => x => (s > 0 ? x * x + P : P - x * x) / 10;
const q39fix = (s, P) => s > 0 ? 5 - Math.sqrt(25 - P) : Math.sqrt(25 + P) - 5;
const q39text = (s, P) => s > 0 ? `(x² + ${n(P)}) ÷ 10` : `(${n(P)} − x²) ÷ 10`;
const isSquare = v => Number.isInteger(Math.sqrt(v));

/* q40: three points A, B, C in a row; each circuit is a circle round a run of neighbouring points, flown t times
   (t > 0 anticlockwise, t < 0 clockwise). */
const CIRC = ['A', 'B', 'C', 'AB', 'BC', 'ABC'];
const circText = (set, t) => `${times(Math.abs(t))} ${t > 0 ? 'anticlockwise' : 'clockwise'} round a circle enclosing ${set.length === 1 ? set + ' only' : set.length === 2 ? set[0] + ' and ' + set[1] : 'all three points'}`;

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Angles aπ/12, bπ/12, cπ/12 with a + b + c from 13 to 20 (angle excess π/12 to 8π/12); a second triangle of whole-number
    area A2. No answer or guided-step value lands near a rounding tie. Not the worked example (radius 5, three right angles). */
 q31: {
  canonical: { s: 10, a: 6, b: 4, c: 5, A2: 120 },
  draw: R => tries(() => { const s = R.int(4, 12), a = R.int(2, 10), b = R.int(2, 10), c = R.int(2, 10); return { s, a, b, c, A2: R.int(5, Math.floor(1.5 * s * s)) }; },
   p => { const S = p.a + p.b + p.c, ex = (S - 12) * Math.PI / 12; return S >= 13 && S <= 20 && p.s !== 5 && ![S * Math.PI / 12, ex, ex * p.s * p.s, Math.PI + p.A2 / (p.s * p.s)].some(nearTie); },
   { s: 10, a: 6, b: 4, c: 5, A2: 120 }),
  build: ({ s, a, b, c, A2 }) => { const S = a + b + c, sumV = S * Math.PI / 12, ex = (S - 12) * Math.PI / 12, s2 = s * s, area = ex * s2, sum2 = Math.PI + A2 / s2,
   ang = `${piFrac(a, 12)}, ${piFrac(b, 12)} and ${piFrac(c, 12)}`; return {
   prompt: `The Observatory’s star dome is part of a sphere of radius ${n(s)} metres, so its surface has curvature k = 1 ÷ ${n(s)}² = 1 ÷ ${n(s2)}. A survey crew pegs out a triangle on the dome whose sides are arcs of great circles, the straightest paths on a sphere. Its angles are ${ang} radians. Enter its angle excess in radians, then its area in square metres. A second triangle on the dome has an area of ${n(A2)} square metres: enter the sum of its angles in radians. Give all three to 2 decimal places, rounding only at the end.`,
   answer: [r2(ex), r2(area), r2(sum2)],
   hints: ['The angle excess is the angle sum minus π. On a surface of curvature k, a triangle satisfies kA = α + β + γ − π.', 'With k = 1 ÷ s², the area is the angle excess times s². For the second triangle, turn the formula round: α + β + γ = π + kA.'],
   solution: `The angles add up to ${piFrac(S, 12)} ≈ ${n(r2(sumV))} radians, so the angle excess is ${piFrac(S, 12)} − π = ${piFrac(S - 12, 12)} ≈ ${n(r2(ex))} radians. By kA = α + β + γ − π with k = 1 ÷ ${n(s2)}, the area is A = ${pf(S - 12)} × ${n(s2)} ≈ ${n(r2(area))} square metres. For the second triangle, α + β + γ = π + kA = π + ${n(A2)} ÷ ${n(s2)} ≈ ${n(r2(sum2))} radians, more than π as it must be on a sphere.`,
   guidance: [
    { prompt: `Add the three angles ${ang}. What is their sum in radians, to 2 decimal places?`, answer: [r2(sumV)], explanation: `${piFrac(a, 12)} + ${piFrac(b, 12)} + ${piFrac(c, 12)} = ${piFrac(S, 12)}, which is about ${n(r2(sumV))} radians.` },
    { prompt: `The angle excess is the angle sum minus π. What is it, to 2 decimal places?`, answer: [r2(ex)], explanation: `${piFrac(S, 12)} − π = ${piFrac(S - 12, 12)}, about ${n(r2(ex))} radians. A flat triangle would have excess 0.` },
    { prompt: `The curvature is k = 1 ÷ ${n(s2)}, so the area A = (α + β + γ − π) ÷ k is the excess times ${n(s2)}. What is the area, to 2 decimal places?`, answer: [r2(area)], explanation: `A = ${pf(S - 12)} × ${n(s2)} ≈ ${n(r2(area))} square metres. Use the exact excess, not the rounded one.` },
    { prompt: `A second triangle has area ${n(A2)} square metres. What is its angle sum π + kA, to 2 decimal places?`, answer: [r2(sum2)], explanation: `π + ${n(A2)} ÷ ${n(s2)} ≈ ${n(r2(sum2))} radians.` }
   ] }; }
 },
 /* Genus g from 2 to 12 at curvature −1 ÷ m (m 1 to 6), and a sphere of radius s from 2 to 10.
    Not the worked example (genus 2 at k = −1). */
 q32: {
  canonical: { g: 3, m: 2, s: 5 },
  draw: R => tries(() => ({ g: R.int(2, 12), m: R.int(1, 6), s: R.int(2, 10) }), p => !(p.g === 2 && p.m === 1), { g: 3, m: 2, s: 5 }),
  build: ({ g, m, s }) => { const chi = 2 - 2 * g, A = -2 * m * chi, kTxt = m === 1 ? '−1' : `−1 ÷ ${n(m)}`, S = 4 * s * s; return {
   prompt: `The Hull Gallery has sent a closed hull surface of genus ${n(g)} to the Observatory, which can give it constant curvature k = ${kTxt}. Enter its Euler characteristic χ, then its area divided by π. Then a dome closed into a full sphere of radius ${n(s)} metres has curvature k = 1 ÷ ${n(s * s)}: enter its area in square metres divided by π.`,
   answer: [chi, A, S],
   hints: ['An orientable surface of genus g has Euler characteristic χ = 2 − 2g, and a sphere has χ = 2.', 'Gauss–Bonnet: a closed surface of constant curvature k has kA = 2πχ, so A = 2πχ ÷ k. Divide by π at the end.'],
   solution: `Genus ${n(g)} gives χ = 2 − 2 × ${n(g)} = ${n(chi)}. By Gauss–Bonnet, A = 2πχ ÷ k = 2π × ${par(chi)} ÷ (${kTxt}) = 2π × ${par(chi)} × ${par(-m)} = ${n(A)}π, so the area divided by π is ${n(A)}. The sphere has χ = 2, so A = 2π × 2 ÷ (1 ÷ ${n(s * s)}) = 4π × ${n(s * s)} = ${n(S)}π, the familiar 4πs², so the answer is ${n(S)}.`,
   guidance: [
    { prompt: `What is the Euler characteristic χ = 2 − 2g of a surface of genus ${n(g)}?`, answer: [chi], explanation: `χ = 2 − 2 × ${n(g)} = ${n(chi)}. It is negative, which matches the negative curvature.` },
    { prompt: `Gauss–Bonnet says kA = 2πχ. With k = ${kTxt} and χ = ${n(chi)}, what is A ÷ π?`, answer: [A], explanation: `A = 2πχ ÷ k: dividing by ${kTxt} is multiplying by ${n(-m)}, so A = 2 × ${par(chi)} × ${par(-m)} × π = ${n(A)}π.` },
    { prompt: `A sphere has χ = 2 and here k = 1 ÷ ${n(s * s)}. What is its area divided by π?`, answer: [S], explanation: `A = 2π × 2 × ${n(s * s)} = ${n(S)}π, the same as 4πs² for s = ${n(s)}.` }
   ] }; }
 },
 /* Two surfaces whose curvature signs differ, and a third surface that is hyperbolic (χ < 0), for its area at k = −1.
    Not the worked example (a torus and a genus-2 surface). */
 q33: {
  canonical: { o1: 0, h1: 2, o2: 1, h2: 4, o3: 0, h3: 5 },
  draw: R => tries(() => { const a = drawSurf(R), b = drawSurf(R), c = drawSurf(R); return { o1: a.o, h1: a.h, o2: b.o, h2: b.h, o3: c.o, h3: c.h }; },
   p => sgnOf(chiOf(p.o1, p.h1)) !== sgnOf(chiOf(p.o2, p.h2)) && chiOf(p.o3, p.h3) < 0 && !(p.o1 === 1 && p.h1 === 1 && p.o2 === 1 && p.h2 === 2), { o1: 0, h1: 2, o2: 1, h2: 4, o3: 0, h3: 5 }),
  build: ({ o1, h1, o2, h2, o3, h3 }) => { const c1 = chiOf(o1, h1), c2 = chiOf(o2, h2), c3 = chiOf(o3, h3), s1 = sgnOf(c1), s2 = sgnOf(c2), A = -2 * c3; return {
   prompt: `Three hull designs reach the Observatory: ${surfName(o1, h1)}, ${surfName(o2, h2)}, and ${surfName(o3, h3)}. Each can be given one constant curvature k all over, and Gauss–Bonnet fixes the sign of k. Enter the sign of k for the first design, then for the second (1 for positive, 0 for zero, −1 for negative). Then give the third design curvature k = −1 and enter its area divided by π.`,
   answer: [s1, s2, A],
   hints: ['χ = 2 − 2g for an orientable surface of genus g, and χ = 2 − c for a non-orientable one with c cross-caps.', 'In kA = 2πχ the area A is positive, so k has the same sign as χ. With k = −1 the area is A = −2πχ.'],
   solution: `The first design has ${chiRule(o1, h1)}, so k has sign ${n(s1)} and its geometry is ${geomWord(s1)}. The second has ${chiRule(o2, h2)}, so k has sign ${n(s2)}: ${geomWord(s2)}. The third has ${chiRule(o3, h3)}. With k = −1, Gauss–Bonnet gives −A = 2π × ${par(c3)}, so A = ${n(A)}π and the answer is ${n(A)}.`,
   guidance: [
    { prompt: `What is the Euler characteristic of the first design, ${surfName(o1, h1)}?`, answer: [c1], explanation: `${chiRule(o1, h1)}.` },
    { prompt: `k has the same sign as χ. What is the sign of k for the first design (1, 0 or −1)?`, answer: [s1], explanation: `χ = ${n(c1)}, so the sign is ${n(s1)}: ${geomWord(s1)} geometry.` },
    { prompt: `What is the Euler characteristic of the second design, ${surfName(o2, h2)}?`, answer: [c2], explanation: `${chiRule(o2, h2)}, so the sign of k is ${n(s2)}.` },
    { prompt: `The third design has ${chiRule(o3, h3)}. With k = −1, what is its area divided by π?`, answer: [A], explanation: `kA = 2πχ gives −A = 2π × ${par(c3)}, so A = ${n(A)}π.` }
   ] }; }
 },
 /* Genus g from 2 to 8 and curvature −1 ÷ m, m from 1 to 6. Not the worked example (genus 2, k = −1). */
 q34: {
  canonical: { g: 3, m: 2 },
  draw: R => tries(() => ({ g: R.int(2, 8), m: R.int(1, 6) }), p => !(p.g === 2 && p.m === 1), { g: 3, m: 2 }),
  build: ({ g, m }) => { const sides = 4 * g, N = 2 * g, flat = 4 * g - 2, A = (4 * g - 4) * m, kTxt = m === 1 ? '−1' : `−1 ÷ ${n(m)}`; return {
   prompt: `The Observatory models the hull surface of genus ${n(g)} as one regular polygon glued by the word a₁b₁a₁⁻¹b₁⁻¹ … a${sub(g)}b${sub(g)}a${sub(g)}⁻¹b${sub(g)}⁻¹, which has 4 letters for each unit of genus. The gluing sends all the corners to one point, and the polygon is drawn with constant curvature k = ${kTxt}. Each corner angle is π ÷ N: enter N. Copies of this fundamental domain tile the curved plane: enter how many copies meet at each corner point. Then enter the polygon’s area divided by π.`,
   answer: [N, sides, A],
   hints: ['All the corners meet at one point, so their angles must add up to one full turn, 2π. A regular polygon has equal angles.', 'Cut a polygon with n sides into n − 2 triangles. On curvature k its area satisfies kA = (angle sum) − (n − 2)π.'],
   solution: `The word has 4 × ${n(g)} = ${n(sides)} letters, so the polygon has ${n(sides)} sides and ${n(sides)} corners. They all glue to one point, so the ${n(sides)} equal angles add up to 2π and each is 2π ÷ ${n(sides)} = π ÷ ${n(N)}. Around a corner point of the tiling, one corner of each copy fills the full turn, so ${n(sides)} copies meet there. A flat ${n(sides)}-gon would have angle sum (${n(sides)} − 2)π = ${n(flat)}π, far more than 2π, which is why the polygon must be hyperbolic. With k = ${kTxt}, kA = 2π − ${n(flat)}π = ${n(2 - flat)}π, so A = ${n(A)}π and the answer is ${n(A)}.`,
   guidance: [
    { prompt: `How many sides does the polygon have? It has one side for each letter of the word.`, answer: [sides], explanation: `4 letters for each unit of genus: 4 × ${n(g)} = ${n(sides)} sides.` },
    { prompt: `The ${n(sides)} equal corner angles add up to 2π. Each angle is π ÷ N: what is N?`, answer: [N], explanation: `2π ÷ ${n(sides)} = π ÷ ${n(N)}, so N = ${n(N)}.` },
    { prompt: `With k = ${kTxt} and angle sum 2π, kA = 2π − (${n(sides)} − 2)π. What is the area divided by π?`, answer: [A], explanation: `kA = 2π − ${n(flat)}π = ${n(2 - flat)}π. Dividing by k = ${kTxt} gives A = ${n(A)}π.` }
   ] }; }
 },
 /* A closed walk of 8 to 16 moves from NE back to NE, leaning one way so the winding number varies in sign.
    Not the worked example (NE, NW, SW, SE, NE). */
 q35: {
  canonical: { seq: [0, 1, 2, 3, 0, 3, 0, 1, 2, 3, 0] },
  draw: R => tries(() => ({ seq: walk(R, R.int(8, 16), R.pick([0.25, 0.4, 0.6, 0.75])) }),
   p => p.seq[p.seq.length - 1] === 0 && crossings(p.seq).up + crossings(p.seq).down >= 2 && !sameSeq(p.seq, [0, 1, 2, 3, 0]),
   { seq: [0, 1, 2, 3, 0, 3, 0, 1, 2, 3, 0] }),
  build: ({ seq }) => { const { up, down, w } = crossings(seq), L = seq.length; return {
   prompt: `A survey drone flies a closed loop round beacon B on the Orbit Ring. Lines due north and due east through B split the ground into four sectors, NE, NW, SW and SE, which follow each other anticlockwise. The drone never passes over B, and each move takes it into a neighbouring sector. Its log has ${n(L)} entries, starting and ending in NE: ${logText(seq)}. Use the ray due east from B, the border between SE and NE. Enter the number of anticlockwise crossings of the ray (SE to NE), then the clockwise crossings (NE to SE), then the winding number of the loop round B.`,
   answer: [up, down, w],
   hints: ['Read the log in pairs of neighbouring entries. Only the pairs SE, NE and NE, SE cross the ray due east.', 'The winding number is the anticlockwise crossings minus the clockwise crossings.'],
   solution: `Reading the log in pairs, SE followed by NE happens ${often(up)}, and NE followed by SE happens ${often(down)}. Every other move stays clear of the ray. The winding number is ${n(up)} − ${n(down)} = ${n(w)}, so the loop goes round B ${w === 0 ? 'no net times' : `${times(Math.abs(w))} ${w > 0 ? 'anticlockwise' : 'clockwise'}`}.`,
   guidance: [
    { prompt: 'How many times does the log go from SE straight to NE?', answer: [up], explanation: up === 0 ? 'The log never goes from SE straight to NE, so there are no anticlockwise crossings.' : `SE, NE appears ${times(up)}: each time is one anticlockwise crossing of the ray.` },
    { prompt: 'How many times does the log go from NE straight to SE?', answer: [down], explanation: down === 0 ? 'The log never goes from NE straight to SE, so there are no clockwise crossings.' : `NE, SE appears ${times(down)}: each time is one clockwise crossing of the ray.` },
    { prompt: 'What is the winding number: anticlockwise crossings minus clockwise crossings?', answer: [w], explanation: `${n(up)} − ${n(down)} = ${n(w)}.` }
   ] }; }
 },
 /* Two short closed walks a and b from NE (4 to 10 moves), each with winding number −2 to 2. Not the worked example. */
 q36: {
  canonical: { a: [0, 1, 2, 3, 0, 1, 2, 3, 0], b: [0, 3, 2, 1, 0] },
  draw: R => tries(() => ({ a: walk(R, 2 * R.int(2, 5), R.pick([0.2, 0.5, 0.8])), b: walk(R, 2 * R.int(2, 5), R.pick([0.2, 0.5, 0.8])) }),
   p => { const wa = crossings(p.a).w, wb = crossings(p.b).w; return p.a[p.a.length - 1] === 0 && p.b[p.b.length - 1] === 0 && wa !== 0 && wb !== 0 && wa + wb !== -wa && 2 * wb - wa !== wa + wb; },
   { a: [0, 1, 2, 3, 0, 1, 2, 3, 0], b: [0, 3, 2, 1, 0] }),
  build: ({ a, b }) => { const p = crossings(a).w, q = crossings(b).w, j = p + q, back = -p, mix = 2 * q - p; return {
   prompt: `Round beacon B the sectors NE, NW, SW and SE follow each other anticlockwise, and the ray due east from B is the border between SE and NE. Two drone loops start and end in NE. Loop a logs ${logText(a)}. Loop b logs ${logText(b)}. Enter the winding number round B of the loop “a, then b”, then of a run backwards, then of the loop “b, then a backwards, then b again”.`,
   answer: [j, back, mix],
   hints: ['Find the winding number of each loop first: anticlockwise crossings of the ray minus clockwise ones.', 'Joining loops adds their winding numbers, and running a loop backwards changes the sign of its winding number.'],
   solution: `Loop a crosses the ray with winding number ${n(p)} and loop b with winding number ${n(q)}. Joining adds: “a, then b” has ${n(p)} + ${par(q)} = ${n(j)}. Backwards, every crossing changes direction, so a backwards has ${n(back)}. “b, then a backwards, then b” has ${n(q)} + ${par(back)} + ${par(q)} = ${n(mix)}.`,
   guidance: [
    { prompt: 'What is the winding number of loop a on its own?', answer: [p], explanation: `Count SE, NE pairs minus NE, SE pairs in loop a’s log: ${n(p)}.` },
    { prompt: 'What is the winding number of loop b on its own?', answer: [q], explanation: `The same count for loop b gives ${n(q)}.` },
    { prompt: 'Joining adds and running backwards changes the sign. What is the winding number of “b, then a backwards, then b”?', answer: [mix], explanation: `${n(q)} + ${par(back)} + ${par(q)} = ${n(mix)}.` }
   ] }; }
 },
 /* Two circle maps θ ↦ aθ and θ ↦ bθ (|a| from 2 to 4, |b| 2 or 3) and a loop going k times round (k ±1 to ±3). The
    combined degree is negative in 4 draws out of 7, so the degree and the count |ab| differ in most draws.
    Not the worked example (θ ↦ 2θ alone). */
 q37: {
  canonical: { a: 3, b: -2, k: 2 },
  draw: R => { const [sa, sb] = R.pick([[1, -1], [-1, 1], [1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1]]); return { a: sa * R.pick([2, 3, 4]), b: sb * R.pick([2, 3]), k: R.pick([-3, -2, -1, 1, 2, 3]) }; },
  build: ({ a, b, k }) => { const d = a * b, cnt = Math.abs(d), w = d * k; return {
   prompt: `The Orbit Ring’s drive moves each point of a circular track: the point at angle θ goes to angle ${n(a)}θ, written f: ${mapText(a)}. A second gear then applies g: ${mapText(b)}. The combined map takes θ to g(f(θ)). Enter the degree of the combined map, then how many points of the track it sends to the single point at angle 0, then the winding number of the image of a loop that goes round the track ${k > 0 ? `${times(k)} anticlockwise` : `${times(-k)} clockwise`} (winding number ${n(k)}).`,
   answer: [d, cnt, w],
   hints: ['θ ↦ nθ has degree n: as θ goes once round, nθ goes n times round. Doing one map after another multiplies the degrees.', 'A map of degree n (not 0) sends exactly |n| points to each point. A loop with winding number k goes to a loop with winding number n × k.'],
   solution: `f(θ) = ${n(a)}θ, so g(f(θ)) = ${n(b)} × ${n(a)}θ = ${n(d)}θ: the combined map has degree ${n(d)}. Angle ${n(d)}θ is a whole number of turns at exactly ${n(cnt)} angles θ round the circle (θ = 2πj ÷ ${n(cnt)} for j = 0 to ${n(cnt - 1)}), so ${n(cnt)} points land on angle 0. The loop with winding number ${n(k)} goes to a loop with winding number ${n(d)} × ${par(k)} = ${n(w)}.`,
   guidance: [
    { prompt: `What is the degree of g(f(θ)) = ${n(b)} × ${n(a)}θ?`, answer: [d], explanation: `Degrees multiply: ${n(b)} × ${par(a)} = ${n(d)}.` },
    { prompt: `A map of degree ${n(d)} sends how many points to angle 0?`, answer: [cnt], explanation: `|${n(d)}| = ${n(cnt)}: one for each whole number of turns the angle ${n(d)}θ passes as θ goes once round.` },
    { prompt: `What is the winding number of the image of a loop with winding number ${n(k)}?`, answer: [w], explanation: `${n(d)} × ${par(k)} = ${n(w)}.` }
   ] }; }
 },
 /* A grid (1–6 by 1–6, not 1 by 1), a wheel (3–12 spokes) or every pair of 3–8 posts joined. Not the worked example (a wheel with 4 spokes). */
 q38: {
  canonical: { kind: 0, x: 3, y: 2 },
  draw: R => tries(() => { const kind = R.int(0, 2); return kind === 0 ? { kind, x: R.int(1, 6), y: R.int(1, 6) } : kind === 1 ? { kind, x: R.int(3, 12), y: 0 } : { kind, x: R.int(3, 8), y: 0 }; },
   p => !(p.kind === 0 && p.x * p.y < 2) && !(p.kind === 1 && p.x === 4), { kind: 0, x: 3, y: 2 }),
  build: ({ kind, x, y }) => { const { V, E } = graphVE({ kind, x, y }), chi = V - E, L = E - V + 1; return {
   prompt: `A cable loom on the Orbit Ring is ${graphText({ kind, x, y })}. Treat it as a graph: junctions are vertices and the cables between them are edges. Enter the number of vertices V, then the number of edges E, then the number of independent loops.`,
   answer: [V, E, L],
   hints: ['Count vertices and edges row by row or part by part, so you count each once.', 'A spanning tree of a connected graph uses V − 1 edges and has no loop. Each further edge closes one new independent loop, so there are E − V + 1 = 1 − χ of them.'],
   solution: `${graphVEText({ kind, x, y })} The Euler characteristic of the graph is χ = V − E = ${n(V)} − ${n(E)} = ${n(chi)}, and the number of independent loops is E − V + 1 = 1 − χ = ${n(L)}.`,
   guidance: [
    { prompt: 'How many vertices (junctions) does the loom have?', answer: [V], explanation: graphCount({ kind, x, y })[0] },
    { prompt: 'How many edges (cables between junctions) does it have?', answer: [E], explanation: graphCount({ kind, x, y })[1] },
    { prompt: 'What is χ = V − E for this graph?', answer: [chi], explanation: `${n(V)} − ${n(E)} = ${n(chi)}, so there are 1 − χ = ${n(L)} independent loops.` }
   ] }; }
 },
 /* f(x) = (x² + P) ÷ 10 with P from 1 to 24 or (P − x²) ÷ 10 with P from 26 to 49, on [0, 5]. The fixed point is irrational
    (no perfect square under the root) and never near a rounding tie. Not the worked example (f(x) = (x + 4) ÷ 3 on [0, 4]). */
 q39: {
  canonical: { s: 1, P: 11 },
  draw: R => tries(() => R.bool() ? { s: 1, P: R.int(1, 24) } : { s: -1, P: R.int(26, 49) },
   p => !isSquare(p.s > 0 ? 25 - p.P : 25 + p.P) && !nearTie(q39fix(p.s, p.P)), { s: 1, P: 11 }),
  build: ({ s, P }) => { const f = q39f(s, P), x = q39fix(s, P), g0 = f(0), g5 = f(5) - 5, m = Math.floor(x), gm = f(m) - m, gm1 = f(m + 1) - (m + 1), ft = q39text(s, P); return {
   prompt: `A thermostat on the Orbit Ring resets its set point x (between 0 and 5) to f(x) = ${ft} after each cycle. This f is continuous and takes [0, 5] into itself. A fixed point is an x with f(x) = x. Let g(x) = f(x) − x. Enter g(0), then g(5), then the fixed point of f in [0, 5] to 2 decimal places, found by halving the interval where g changes sign (or by solving f(x) = x exactly).`,
   answer: [Math.round(g0 * 10) / 10, Math.round(g5 * 10) / 10, r2(x)],
   hints: ['g(0) = f(0) − 0 is at least 0 and g(5) = f(5) − 5 is at most 0, because f stays in [0, 5]. By the intermediate value theorem g is 0 somewhere between.', 'Halve the interval and keep the half whose ends give g opposite signs, until both ends round to the same 2 decimal places. Or solve f(x) = x as a quadratic and keep the root in [0, 5].'],
   solution: `g(0) = f(0) = ${n(g0)} is positive and g(5) = f(5) − 5 = ${n(g5)} is negative, so g has a zero in between: a fixed point of f. Checking whole numbers, g(${n(m)}) = ${n(gm)} and g(${n(m + 1)}) = ${n(gm1)}, so it lies between ${n(m)} and ${n(m + 1)}. Halving that interval again and again, or solving ${s > 0 ? `x² − 10x + ${n(P)} = 0 to get x = 5 − √${n(25 - P)}` : `x² + 10x − ${n(P)} = 0 to get x = √${n(25 + P)} − 5`}, gives x ≈ ${n(r2(x))}.`,
   guidance: [
    { prompt: 'What is g(0) = f(0) − 0?', answer: [Math.round(g0 * 10) / 10], explanation: `f(0) = ${n(g0)}, so g(0) = ${n(g0)}, which is positive.` },
    { prompt: 'What is g(5) = f(5) − 5?', answer: [Math.round(g5 * 10) / 10], explanation: `f(5) = ${n(f(5))}, so g(5) = ${n(g5)}, which is negative.` },
    { prompt: 'g changes sign between two whole numbers m and m + 1. What is m?', answer: [m], explanation: `g(${n(m)}) = ${n(gm)} and g(${n(m + 1)}) = ${n(gm1)} have opposite signs, so m = ${n(m)}.` },
    { prompt: `Keep halving from [${n(m)}, ${n(m + 1)}]. What is the fixed point to 2 decimal places?`, answer: [r2(x)], explanation: `The halvings close in on x ≈ ${n(x)}, which rounds to ${n(r2(x))}. Check: f(${n(r2(x))}) is very close to ${n(r2(x))}.` }
   ] }; }
 },
 /* Three circuits, each a circle round a run of neighbouring points (A, B, C, AB, BC or ABC) flown ±1 to ±3 times.
    The three winding numbers are not all equal, and the circuits are not all the same set. Not the worked example. */
 q40: {
  canonical: { c1: 'AB', t1: 2, c2: 'B', t2: -3, c3: 'BC', t3: 1 },
  draw: R => tries(() => ({ c1: R.pick(CIRC), t1: R.pick([-3, -2, -1, 1, 2, 3]), c2: R.pick(CIRC), t2: R.pick([-3, -2, -1, 1, 2, 3]), c3: R.pick(CIRC), t3: R.pick([-3, -2, -1, 1, 2, 3]) }),
   p => { const w = ['A', 'B', 'C'].map(pt => [[p.c1, p.t1], [p.c2, p.t2], [p.c3, p.t3]].reduce((s, [c, t]) => s + (c.includes(pt) ? t : 0), 0)); return new Set([p.c1, p.c2, p.c3]).size >= 2 && new Set(w).size >= 2; },
   { c1: 'AB', t1: 2, c2: 'B', t2: -3, c3: 'BC', t3: 1 }),
  build: ({ c1, t1, c2, t2, c3, t3 }) => { const cs = [[c1, t1], [c2, t2], [c3, t3]], w = ['A', 'B', 'C'].map(pt => cs.reduce((s, [c, t]) => s + (c.includes(pt) ? t : 0), 0)), tot = w[0] + w[1] + w[2],
   part = pt => { const terms = cs.filter(([c]) => c.includes(pt)).map(([, t]) => t); return terms.length ? terms.map((t, i) => i ? par(t) : n(t)).join(' + ') + (terms.length > 1 ? ` = ${n(w['ABC'.indexOf(pt)])}` : '') : '0'; }; return {
   prompt: `Three sensors A, B and C stand in a row, in that order, near the Orbit Ring. One survey loop is made by joining three circuits, all starting and ending at the same point: first ${circText(c1, t1)}, then ${circText(c2, t2)}, then ${circText(c3, t3)}. Each circle encloses exactly the sensors named. Enter the winding number of the whole loop round A, then round B, then round C, then the total of the three.`,
   answer: [w[0], w[1], w[2], tot],
   hints: ['A circle flown once anticlockwise has winding number 1 round each point inside it and 0 round each point outside. Clockwise gives −1.', 'The loop is the three circuits joined, so for each sensor add the winding numbers of the circuits that enclose it.'],
   solution: `Round A: ${part('A')}. Round B: ${part('B')}. Round C: ${part('C')}. The total is ${n(w[0])} + ${par(w[1])} + ${par(w[2])} = ${n(tot)}. In complex analysis each of these winding numbers becomes an integral round the loop.`,
   guidance: [
    { prompt: 'Add the winding numbers of the circuits that enclose A. What is the winding number of the loop round A?', answer: [w[0]], explanation: `Round A: ${part('A')}.` },
    { prompt: 'What is the winding number round B?', answer: [w[1]], explanation: `Round B: ${part('B')}.` },
    { prompt: 'What is the winding number round C?', answer: [w[2]], explanation: `Round C: ${part('C')}.` }
   ] }; }
 }
});
})();
