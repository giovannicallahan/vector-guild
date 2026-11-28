/* Topology: shape without size concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
/* Gluing words as text, read counterclockwise from corner 1: a plain letter's arrow points the way you read, ⁻¹ points back,
   "free" is an edge sewn to nothing. Edge i runs from corner i to corner i + 1. Sewing puts tails on tails and tips on tips. */
const sew = text => {
 const w = text.split(' '), N = w.length, up = []; for (let i = 0; i < N; i++) up.push(i);
 const f = x => up[x] === x ? x : (up[x] = f(up[x])), u = (a, b) => { a = f(a); b = f(b); if (a !== b) up[b] = a; };
 const seen = {}; let pairs = 0, free = 0, orient = 1;
 w.forEach((x, i) => { if (x === 'free') { free++; return; } const back = x.length > 1, t = back ? (i + 1) % N : i, h = back ? i : (i + 1) % N;
  if (seen[x[0]]) { pairs++; if (seen[x[0]].back === back) orient = 0; u(t, seen[x[0]].t); u(h, seen[x[0]].h); } else seen[x[0]] = { t, h, back }; });
 const V = new Set(w.map((_, i) => f(i))).size;
 /* boundary circles: the free edges join vertex classes; count the connected runs. */
 const up2 = {}, g = x => up2[x] === x ? x : (up2[x] = g(up2[x]));
 w.forEach((x, i) => { if (x !== 'free') return; const a = f(i), b = f((i + 1) % N); if (up2[a] === undefined) up2[a] = a; if (up2[b] === undefined) up2[b] = b; up2[g(a)] = g(b); });
 const circles = new Set(Object.keys(up2).map(k => g(Number(k)))).size;
 return { N, V, pairs, free, orient, circles, chi: V - pairs - free + 1 };
};
const WORDS22 = ['a a', 'a b a⁻¹ b⁻¹', 'a b a⁻¹ b', 'a a b b', 'a b b⁻¹ a⁻¹', 'a b c a⁻¹ b⁻¹ c⁻¹', 'a b c a b c', 'a b c c⁻¹ b a'];
const WORDS23 = ['a free a free', 'a free a⁻¹ free', 'free free free', 'a b a⁻¹ b⁻¹ free', 'a a free', 'a b a⁻¹ free b free', 'a free free a'];
const WORDS28 = ['a b a⁻¹ b⁻¹', 'a b a⁻¹ b', 'a a b b', 'a b c a⁻¹ b⁻¹ c⁻¹', 'a b c a b c', 'a b a⁻¹ b⁻¹ c d c⁻¹ d⁻¹', 'a a b b c c', 'a b b⁻¹ a⁻¹'];
const SURF = [['sphere', 2], ['torus', 0], ['projective plane', 1], ['Klein bottle', 0]];
const CURVES = [0.0004, 0.0016, 0.0025, 0.0064, 0.01, 0.04, 0.16, 0.25, 0.64, 4];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A grid of junctions in 3 rows and c = 3 … 8 columns. */
 q21: t => { t = T(t); const c = 3 + (t + 10) % 6, V = 3 * c, Ed = 3 * (c - 1) + c * 2;
  return E('Predict the Euler characteristic V − E of the loom (a graph, with no faces).', `V = 3 × ${n(c)} = ${n(V)}. E = 3 × ${n(c - 1)} along the rows + ${n(c)} × 2 down the columns = ${n(Ed)}. χ = ${n(V)} − ${n(Ed)} = ${n(V - Ed)}.`, [['χ of the loom', V - Ed], ['Edges E', Ed], ['Vertices V', V]]); },
 q22: t => { t = T(t); const word = WORDS22[(t + 10) % WORDS22.length], s = sew(word);
  return E('Predict the Euler characteristic χ = V − E + 1 of the closed surface.', `Sewing tails to tails and tips to tips leaves V = ${n(s.V)} vertex ${s.V === 1 ? 'class' : 'classes'}. There are E = ${n(s.pairs)} edges after sewing and one face, so χ = ${n(s.V)} − ${n(s.pairs)} + 1 = ${n(s.chi)}.`, [['χ', s.chi], ['Vertex classes V', s.V], ['Edges E', s.pairs]]); },
 q23: t => { t = T(t); const word = WORDS23[(t + 10) % WORDS23.length], s = sew(word), closed = s.chi + s.circles;
  return E('Predict the Euler characteristic of the closed hull made by sewing a disc onto every boundary circle.', `V = ${n(s.V)}, E = ${n(s.pairs)} + ${n(s.free)} = ${n(s.pairs + s.free)} and F = 1, so the panel has χ = ${n(s.chi)}. Its free edges form ${pl(s.circles, 'boundary circle', 'boundary circles')}, and each disc adds a face: ${n(s.chi)} + ${n(s.circles)} = ${n(closed)}.`, [['χ of the closed hull', closed], ['Boundary circles', s.circles], ['χ of the panel', s.chi]]); },
 q24: t => { t = T(t); const i = (t + 10) % 4, j = Math.floor((t + 10) / 4) % 4, [A, a] = SURF[i], [B, b] = SURF[j];
  return E(`Predict χ(${A} # ${B}).`, `χ(${A} # ${B}) = ${n(a)} + ${n(b)} − 2 = ${n(a + b - 2)}.`, [['χ of the connected sum', a + b - 2], [`χ(${A})`, a], [`χ(${B})`, b]]); },
 q25: t => { t = T(t); const g = 1 + (t + 10) % 12, x = 2 - 2 * g;
  return E('Predict the Euler characteristic of the hull.', `Each torus joined on lowers χ by 2 from the sphere’s 2: χ = 2 − 2 × ${n(g)} = ${n(x)}.`, [['χ', x], ['Genus g', g]]); },
 q26: t => { t = T(t); const k = 1 + (t + 10) % 12, x = 2 - k;
  return E('Predict the Euler characteristic of the hull.', `Each cross-cap lowers χ by 1 from the sphere’s 2: χ = 2 − ${n(k)} = ${n(x)}.`, [['χ', x], ['Cross-caps k', k]]); },
 q27: t => { t = T(t); const a = 1 + (t + 10) % 4, b = 1 + Math.floor((t + 10) / 4) % 5, x = 2 - 2 * a - b;
  return E('Predict the number of cross-caps of the standard surface the hull is.', `χ = 2 − 2 × ${n(a)} − ${n(b)} = ${n(x)}. The hull contains a projective plane, so it is not orientable, and the classification makes it the sphere with 2 − ${par(x)} = ${n(2 - x)} cross-caps.`, [['Cross-caps k', 2 - x], ['χ', x]]); },
 q28: t => { t = T(t); const word = WORDS28[(t + 10) % WORDS28.length], s = sew(word), gk = s.orient ? (2 - s.chi) / 2 : 2 - s.chi;
  return E('Predict its genus if it is orientable, or its number of cross-caps if it is not.', `${s.orient ? 'Every letter appears once plain and once with ⁻¹, so it is orientable' : 'A letter appears twice the same way round, so it is not orientable'}. V = ${n(s.V)}, E = ${n(s.pairs)}, so χ = ${n(s.chi)}, and ${s.orient ? `the genus is (2 − ${par(s.chi)}) ÷ 2 = ${n(gk)}` : `it has 2 − ${par(s.chi)} = ${pl(gk, 'cross-cap', 'cross-caps')}`}.`, [['Genus or cross-caps', gk], ['Orientable (1 or 0)', s.orient], ['χ', s.chi]]); },
 q29: t => { t = T(t); const m = 1 + (t + 10) % 8, x = 0 - 2 * m;
  return E('Predict the number of cross-caps of the finished hull.', `The panel a b a⁻¹ b sews into one vertex class, so χ = 1 − 2 + 1 = 0, and the letter b makes it non-orientable. Joining ${pl(m, 'torus', 'tori')}: χ = 0 − ${n(2 * m)} = ${n(x)}, still not orientable, so it has 2 − ${par(x)} = ${n(2 - x)} cross-caps.`, [['Cross-caps', 2 - x], ['χ', x]]); },
 q30: t => { t = T(t); const K = CURVES[(t + 10) % CURVES.length], r = window.Gen.tidy(1 / Math.sqrt(K));
  return E('Predict the radius of the tank in metres.', `s² = 1 ÷ ${n(K)} = ${n(r * r)}, so s = √${n(r * r)} = ${n(r)} metres.`, [['Radius s (m)', r], ['Curvature k (per m²)', K]]); }
});
})();
