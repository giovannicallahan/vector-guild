/* Graph theory: networks concept-bench experiments, file c: q21–q30. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-c.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-c.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Four stations; road 1–2 is a (never 6, so the first step is never a tie) and the rest are fixed. Either way the
    nearest-neighbour tour is a + 16. */
 q21: t => { t = T(t); const a = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12][(t + 10) % 10], first = a < 6 ? 2 : 3, total = a + 16;
  return E('Predict the length of the nearest-neighbour tour from station 1, in km.', a < 6 ? `From 1 the nearest station is 2 (${n(a)} km), then 3 (4 km), then 4 (3 km), then back to 1 (9 km): ${n(a)} + 4 + 3 + 9 = ${n(total)} km.` : `From 1 the nearest station is 3 (6 km), then 4 (3 km), then 2 (7 km), then back to 1 (${n(a)} km): 6 + 3 + 7 + ${n(a)} = ${n(total)} km.`, [['Nearest-neighbour tour (km)', total], ['First station after 1', first]]); },
 /* n stations from 3 to 20: Dirac's theorem needs every degree to be at least n ÷ 2, so at least ⌈n ÷ 2⌉. */
 q22: t => { t = T(t); const v = 3 + (t + 10) % 18, need = Math.ceil(v / 2);
  return E('Predict the smallest degree that lets Dirac’s theorem guarantee a Hamilton cycle.', `Half of ${n(v)} is ${n(v / 2)}. A degree is a whole number, so every station needs at least ${n(need)} links.`, [['Smallest degree Dirac needs', need], ['Half the stations', v / 2]]); },
 /* Roads 1–2: 4, 2–4: w, 1–3: 7, 3–4: 5, with w from 1 to 15: the shortest distance from 1 to 4 is the smaller of 4 + w and 12. */
 q23: t => { t = T(t); const w = 1 + (t + 10) % 15, via2 = 4 + w, best = Math.min(via2, 12);
  return E('Predict the shortest distance from station 1 to station 4, in km.', `Through station 2: 4 + ${n(w)} = ${n(via2)} km. Through station 3: 7 + 5 = 12 km. The shorter is ${n(best)} km.`, [['Shortest distance (km)', best], ['Through station 2 (km)', via2], ['Through station 3 (km)', 12]]); },
 /* A connected plane drawing with 10 vertices and 9 to 24 edges: F = 2 − 10 + E. */
 q24: t => { t = T(t); const e = 9 + (t + 10) % 16, f = e - 8;
  return E('Predict the number of faces, counting the outside region.', `Euler’s formula V − E + F = 2 gives F = 2 − 10 + ${n(e)} = ${n(f)}.`, [['Faces', f], ['Edges', e]]); },
 /* V from 3 to 23: a planar network has at most 3V − 6 edges, and at most 2V − 4 with no triangles. */
 q25: t => { t = T(t); const v = 13 + t, a = 3 * v - 6, b = 2 * v - 4;
  return E('Predict the largest number of edges a planar network with this many vertices can have.', `Every face has at least 3 edges round it and each edge borders at most 2 faces, so with Euler’s formula E ≤ 3V − 6 = 3 × ${n(v)} − 6 = ${n(a)}. With no triangles the limit would be 2V − 4 = ${n(b)}.`, [['Most edges', a], ['Most edges with no triangles', b]]); },
 /* A prism whose ends have m sides, m from 3 to 20: V = 2m, F = m + 2, E = V + F − 2 = 3m. */
 q26: t => { t = T(t); const m = 3 + (t + 10) % 18;
  return E('Predict the number of edges of the prism.', `V = 2 × ${n(m)} = ${n(2 * m)} corners and F = ${n(m)} + 2 = ${n(m + 2)} faces, so Euler’s formula gives E = V + F − 2 = ${n(3 * m)}.`, [['Edges', 3 * m], ['Corners', 2 * m], ['Faces', m + 2]]); },
 /* K_{m,5} with m from 2 to 9: m × 5 edges. */
 q27: t => { t = T(t); const m = 2 + (t + 10) % 8;
  return E('Predict the number of edges of the complete bipartite graph.', `Each of the ${n(m)} vertices on one side is joined to each of the 5 on the other: ${n(m)} × 5 = ${n(5 * m)}.`, [['Edges', 5 * m], ['Vertices', m + 5]]); },
 /* A ring of s parts, s from 3 to 20: 2 colours when s is even, 3 when it is odd. */
 q28: t => { t = T(t); const s = 3 + (t + 10) % 18, k = s % 2 ? 3 : 2;
  return E('Predict the chromatic number of the ring.', s % 2 ? `Two colours must alternate round the ring, and ${n(s)} is odd, so the last part clashes with the first: a third colour is needed.` : `Two colours alternate round the ring, and ${n(s)} is even, so the ring closes without a clash.`, [['Chromatic number', k], ['Parts in the ring', s]]); },
 /* A wheel: a hub exam in conflict with a ring of s exams, s from 3 to 20. Slots: 3 for an even ring, 4 for an odd
    one. V = s + 1 and E = 2s, so F = 2 − V + E = s + 1. */
 q29: t => { t = T(t); const s = 3 + (t + 10) % 18, k = s % 2 ? 4 : 3;
  return E('Predict the fewest exam slots.', `The hub exam needs a slot of its own, and the ring of ${n(s)} needs ${s % 2 ? '3, because it is odd' : '2, because it is even'}: ${n(k)} slots. The drawing has V = ${n(s + 1)} and E = ${n(2 * s)}, so F = 2 − ${n(s + 1)} + ${n(2 * s)} = ${n(s + 1)}.`, [['Fewest slots', k], ['Faces', s + 1]]); },
 /* k crew (2 to 10) and k − 1 tasks; crew member i can do task i − 1 or task i, where it exists. All tasks can be
    filled, and there are more crew than tasks, so the largest matching is k − 1. */
 q30: t => { t = T(t); const k = 2 + (t + 10) % 9;
  return E('Predict the size of the largest matching.', `Crew 1 takes task 1, crew 2 task 2, and so on up to crew ${n(k - 1)} on task ${n(k - 1)}: ${n(k - 1)} pairs. There are only ${n(k - 1)} tasks, so no matching is larger, and 1 crew member is left over.`, [['Largest matching', k - 1], ['Crew without a task', 1]]); },
});
})();
