/* Graph theory: networks concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A hub dome and a row of k = 3–10 domes: each row dome is linked to the next one along and to the hub. */
 q01: t => { t = T(t); const k = 3 + (t + 10) % 8, e = 2 * k - 1;
  return E('Predict the number of edges in this graph.', `The row has ${n(k - 1)} tunnels between neighbouring domes, and each of the ${n(k)} row domes has one tunnel to the hub. That is ${n(k - 1)} + ${n(k)} = ${n(e)} edges, and the hub has ${n(k)} neighbours.`, [['Edges', e], ['Neighbours of the hub', k], ['Domes', k + 1]]); },
 /* k = 2–11 domes of degree 4 and 6 domes of degree 3: the degrees add up to 4k + 18. */
 q02: t => { t = T(t); const k = 2 + (t + 10) % 10, S = 4 * k + 18;
  return E('Predict the number of edges, using the handshake rule.', `The degrees add up to ${n(k)} × 4 + 6 × 3 = ${n(4 * k)} + 18 = ${n(S)}. Every edge is counted twice in that sum, so there are ${n(S)} ÷ 2 = ${n(S / 2)} edges.`, [['Edges', S / 2], ['Sum of degrees', S]]); },
 /* The complete graph on k = 5–25 vertices. */
 q03: t => { t = T(t); const k = t + 15, e = k * (k - 1) / 2;
  return E('Predict the number of edges of the complete graph.', `Each of the ${n(k)} domes is joined to the other ${n(k - 1)}. The degrees add up to ${n(k)} × ${n(k - 1)} = ${n(k * (k - 1))}, which counts every edge twice, so there are ${n(e)} edges. A ring of ${n(k)} domes would need only ${n(k)}.`, [['Edges of the complete graph', e], ['Degree of each dome', k - 1], ['Edges of the ring', k]]); },
 /* k = 6–10 domes and k + 2 tunnels; dome 1 has 3 tunnels. */
 q04: t => { t = T(t); const k = 6 + (t + 10) % 5, m = k + 2, K = k * (k - 1) / 2;
  return E('Predict the number of edges in the complement.', `The complete graph on ${n(k)} domes has ${n(k)} × ${n(k - 1)} ÷ 2 = ${n(K)} edges, and ${n(m)} of them are tunnels already, so the complement has ${n(K)} − ${n(m)} = ${n(K - m)}. Dome 1 has degree ${n(k - 1)} − 3 = ${n(k - 4)} there.`, [['Edges in the complement', K - m], ['Degree of dome 1 in the complement', k - 4], ['Edges of the complete graph', K]]); },
 /* A row of k = 4–13 domes, each joined to the next: any network of the same shape shares its invariants. */
 q05: t => { t = T(t); const k = 4 + (t + 10) % 10;
  return E('Predict how many domes of degree 2 a network must have to be isomorphic to this row.', `In the row the two end domes have degree 1 and the other ${n(k)} − 2 = ${n(k - 2)} have degree 2, and there are ${n(k - 1)} edges. The degree sequence is an invariant, so a network of the same shape also has ${n(k - 2)} domes of degree 2.`, [['Domes of degree 2', k - 2], ['Edges', k - 1], ['Domes of degree 1', 2]]); },
 /* Domes A and B are each joined to all k = 2–11 middle domes, and each middle dome to one outer dome of its own. */
 q06: t => { t = T(t); const k = 2 + (t + 10) % 10;
  return E('Predict the number of paths of length 2 that start at dome A.', `Dome A has ${n(k)} neighbours, the middle domes. Each middle dome has 2 neighbours other than A: dome B and its own outer dome. So there are ${n(k)} × 2 = ${n(2 * k)} paths, and ${n(k)} walks of length 2 from A to B, one through each middle dome.`, [['Paths of length 2 from A', 2 * k], ['Walks of length 2 from A to B', k]]); },
 /* k = 6–15 depots in a circle, each joined to the next and the last to the first; the depot opposite depot 1. */
 q07: t => { t = T(t); const k = 6 + (t + 10) % 10, j = Math.floor(k / 2) + 1, d = Math.floor(k / 2);
  return E(`Predict the distance from depot 1 to depot ${n(j)}.`, `Going one way round the circle takes ${n(j - 1)} roads, and the other way takes ${n(k - j + 1)}. The shorter way uses ${n(d)} roads, so the distance is ${n(d)}.`, [['Distance', d], ['Roads the other way', k - j + 1]]); },
 /* p = 2–6 separate pairs of linked depots and s = 1–3 depots with no roads. */
 q08: t => { t = T(t); const p = 2 + (t + 10) % 5, s = 1 + (t + 10) % 3, c = p + s;
  return E('Predict the number of components.', `Each linked pair is one component, and each depot with no road is a component of its own: ${n(p)} + ${n(s)} = ${n(c)}. Joining them takes ${n(c)} − 1 = ${n(c - 1)} new roads.`, [['Components', c], ['Fewest new roads', c - 1]]); },
 /* A hub depot joined to all k = 3–12 depots of a circle, which are also joined each to the next round the circle. */
 q09: t => { t = T(t); const k = 3 + (t + 10) % 10, odd = k + (k % 2);
  return E('Predict the number of depots of odd degree.', `Each depot on the circle has 2 circle roads and 1 road to the hub, so degree 3, which is odd: that is ${n(k)} depots. The hub has degree ${n(k)}, which is ${k % 2 ? 'odd too' : 'even'}. So ${n(odd)} depots are odd, and there is no Euler circuit.`, [['Depots of odd degree', odd], ['Degree of the hub', k]]); },
 /* Eight depots in a circle, each joined to the next and depot 8 to depot 1, plus one road from depot a to depot a + d. */
 q10: t => { t = T(t); const a = 1 + (t + 10) % 4, b = a + 2 + (t + 10) % 3;
  return E('Predict the smaller label of a depot where an Euler trail can start.', `On the circle every depot has degree 2. The extra road raises depots ${n(a)} and ${n(b)} to degree 3, so they are the only odd depots. The Euler trail runs between them, and the smaller label is ${n(a)}.`, [['Smaller start depot', a], ['Other end', b]]); },
});
})();
