/* Graph theory: networks concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* s technicians (2 to 5) all certified for exactly the same j jobs (1 to 6): at most min(s, j) of them get different jobs. */
 q31: t => { t = T(t); const s = 2 + (t + 10) % 4, j = 1 + Math.floor((t + 10) / 4), most = Math.min(s, j);
  return E('Predict the largest number of these technicians who can be given different jobs.', `The ${n(s)} technicians share the same ${n(j)} ${j === 1 ? 'job' : 'jobs'}, so the whole group has ${n(j)} ${j === 1 ? 'neighbour' : 'neighbours'}. ${j >= s ? 'That is at least as many as its members, so Hall’s condition holds and all of them can be placed' : `That is fewer than its ${n(s)} members, so Hall’s condition fails and only ${n(j)} can be placed`}: ${n(most)}.`, [['Technicians placed', most], ['Jobs the group can do', j], ['Technicians in the group', s]]); },
 /* Source → k junctions → m junctions → sink, every arc between neighbouring layers present: k × m directed paths. */
 q32: t => { t = T(t); const k = 2 + (t + 10) % 5, m = 2 + Math.floor((t + 10) / 5);
  return E('Predict the number of directed paths from the source to the sink.', `Each of the ${n(k)} first junctions gets 1 directed path. Each of the ${n(m)} second junctions gets 1 from each first junction: ${n(k)}. The sink gets ${n(k)} from each of the ${n(m)} second junctions: ${n(k)} × ${n(m)} = ${n(k * m)}.`, [['Directed paths', k * m], ['Paths to one second junction', k]]); },
 /* Source 1, sink 4: 1→2 (5), 1→3 (6), 2→3 (2), 2→4 (c), 3→4 (7). The cut {1, 2} crosses 1→3, 2→3 and 2→4. */
 q33: t => { t = T(t); const c = 1 + (t + 10) % 12, cap = 6 + 2 + c;
  return E('Predict the capacity of the cut with junctions 1 and 2 on the source side.', `The arcs from {1, 2} to {3, 4} are 1→3 (6), 2→3 (2) and 2→4 (${n(c)}): 6 + 2 + ${n(c)} = ${n(cap)}. 1→2 stays inside the source side and is not counted.`, [['Cut capacity', cap], ['Arcs crossing forwards', 3]]); },
 /* Two separate routes from 1 to 4: 1→2 (a), 2→4 (5) and 1→3 (6), 3→4 (b). Each route carries its narrower pipe. */
 q34: t => { t = T(t); const a = 1 + (t + 10) % 9, b = 2 + (t + 10) % 7, top = Math.min(a, 5), low = Math.min(6, b);
  return E('Predict the maximum flow from 1 to 4.', `The route through 2 is limited by its narrower pipe, ${n(top)}, and the route through 3 by ${n(low)}. The cut through those narrow pipes has capacity ${n(top)} + ${n(low)} = ${n(top + low)}, and that much can be sent, so the maximum flow is ${n(top + low)}.`, [['Maximum flow', top + low], ['Route through 2', top], ['Route through 3', low]]); },
 /* Cayley’s formula for n from 3 to 7. */
 q35: t => { t = T(t); const k = 3 + (t + 10) % 5, total = Math.pow(k, k - 2);
  return E('Predict the number of labelled trees on these vertices.', `Cayley’s formula: ${n(k)} to the power ${n(k)} − 2 = ${n(k - 2)} is ${Array(k - 2).fill(n(k)).join(' × ')} = ${n(total)}.`, [['Labelled trees', total], ['Edges in each tree', k - 1]]); },
 /* The code of length 6 (8 vertices) with k ones (1 to 5) followed by twos: vertex 1 has degree k + 1. */
 q36: t => { t = T(t); const k = 1 + (t + 10) % 5;
  return E('Predict the degree of vertex 1.', `Vertex 1 appears ${n(k)} ${k === 1 ? 'time' : 'times'} in the code, and each vertex appears one time fewer than its degree, so its degree is ${n(k)} + 1 = ${n(k + 1)}.`, [['Degree of vertex 1', k + 1], ['Times it appears', k], ['Vertices', 8]]); },
 /* The ring C_n with n from 4 to 15: α = n ÷ 2 rounded down. */
 q37: t => { t = T(t); const N = 4 + (t + 10) % 12, al = Math.floor(N / 2);
  return E('Predict the independence number α of the ring.', `Taking every second vertex of the ${n(N)} gives ${n(al)} with no edge between them, and any ${n(al + 1)} include two neighbours, so α = ${n(al)}.`, [['Independence number α', al], ['Clique number ω', 2], ['Vertices', N]]); },
 /* The triangles of K_n for n from 4 to 15. */
 q38: t => { t = T(t); const N = 4 + (t + 10) % 12, tri = N * (N - 1) * (N - 2) / 6;
  return E('Predict the number of triangles in the complete graph.', `Every 3 of the ${n(N)} vertices form a triangle: C(${n(N)}, 3) = (${n(N)} × ${n(N - 1)} × ${n(N - 2)}) ÷ 6 = ${n(tri)}.`, [['Triangles', tri], ['Edges', N * (N - 1) / 2]]); },
 /* A two-colour K_n for n from 3 to 22: one colour has at least (n − 1) ÷ 2, rounded up, edges at each vertex. */
 q39: t => { t = T(t); const N = 3 + (t + 10), d = N - 1, big = Math.ceil(d / 2);
  return E('Predict how many edges of one colour are guaranteed to meet at a vertex.', `A vertex has ${n(d)} edges. Split as evenly as possible they make ${n(big)} and ${n(d - big)}, so one colour always has at least ${n(big)}.`, [['Edges of one colour', big], ['Edges at the vertex', d]]); },
 /* A grid on a torus with m circles round the tube (3 to 10) and 5 round the ring. */
 q40: t => { t = T(t); const m = 3 + (t + 10) % 8, V = 5 * m;
  return E('Predict the number of edges E of the grid.', `V = ${n(m)} × 5 = ${n(V)}. Four edges meet at each crossing and each edge has two ends, so E = 4 × ${n(V)} ÷ 2 = ${n(2 * V)}. F = ${n(V)}, and V − E + F = 0.`, [['Edges E', 2 * V], ['Vertices V', V], ['Faces F', V]]); },
});
})();
