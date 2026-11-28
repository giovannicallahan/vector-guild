/* Graph theory: networks concept-bench experiments, file b: q11–q20. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-b.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-b.js through the formulas below: keep the two files in step. */
/* Kruskal total for weighted edges [u, v, w] on vertices 1..V, and Dijkstra distances from vertex 1 (both small and exact). */
const mst = (V, edges) => { const r = Array.from({ length: V + 1 }, (_, i) => i), f = x => r[x] === x ? x : (r[x] = f(r[x])); let s = 0;
 for (const [u, v, w] of edges.slice().sort((a, b) => a[2] - b[2])) { const a = f(u), b = f(v); if (a !== b) { r[a] = b; s += w; } } return s; };
const dij = (V, edges) => { const d = Array(V + 1).fill(Infinity), done = []; d[1] = 0;
 for (let k = 0; k < V; k++) { let x = 0; for (let v = 1; v <= V; v++) if (!done[v] && (!x || d[v] < d[x])) x = v; done[x] = true;
  for (const [u, v, w] of edges) { const y = u === x ? v : v === x ? u : 0; if (y && d[x] + w < d[y]) d[y] = d[x] + w; } } return d; };
const fact = k => k <= 1 ? 1 : k * fact(k - 1);
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* An m by k grid of blocks, m and k each 3, 5 or 7: the fewest repeats are m + k − 2. */
 q11: t => { t = T(t); const m = 3 + 2 * ((t + 10) % 3), k = 3 + 2 * (Math.floor((t + 10) / 3) % 3), odd = 2 * (m - 1) + 2 * (k - 1);
  return E('Predict the fewest roads the sweeper must drive twice.', `The odd corners are the edge corners other than the four outer ones: 2 × ${n(m - 1)} + 2 × ${n(k - 1)} = ${n(odd)}. Each repeat fixes two of them, and neighbours along each side pair up, so ${n(odd)} ÷ 2 = ${n(odd / 2)} roads are driven twice.`, [['Roads driven twice', odd / 2], ['Odd corners', odd]]); },
 /* A tree of t + 15 domes (5 to 25). */
 q12: t => { t = T(t); const v = t + 15;
  return E('Predict the number of cables in the tree.', `Each dome after the first brings one cable: ${n(v)} − 1 = ${n(v - 1)}.`, [['Cables', v - 1], ['Domes', v]]); },
 /* A tree with d3 domes of degree 3 (1 to 5) and d4 of degree 4 (1 to 3), every other dome a leaf: L = 2 + d3 + 2 × d4. */
 q13: t => { t = T(t); const d3 = 1 + (t + 10) % 5, d4 = 1 + Math.floor((t + 10) / 5) % 3, L = 2 + d3 + 2 * d4;
  return E('Predict the number of leaves.', `With L leaves there are L + ${n(d3 + d4)} domes and L + ${n(d3 + d4 - 1)} cables. The degrees add up to L + ${n(3 * d3 + 4 * d4)}, which is twice the cables, 2L + ${n(2 * (d3 + d4 - 1))}. So L = ${n(L)}.`, [['Leaves', L], ['Domes', L + d3 + d4]]); },
 /* A connected network of V domes (6 to 9) and V + 2 to V + 5 tunnels: a spanning tree leaves out E − V + 1. */
 q14: t => { t = T(t); const V = 6 + (t + 10) % 4, E2 = V + 2 + Math.floor((t + 10) / 4) % 4;
  return E('Predict how many tunnels a spanning tree leaves out.', `A spanning tree keeps ${n(V)} − 1 = ${n(V - 1)} tunnels, so it leaves out ${n(E2)} − ${n(V - 1)} = ${n(E2 - V + 1)}.`, [['Tunnels left out', E2 - V + 1], ['Tunnels kept', V - 1]]); },
 /* Two hubs joined by routes of 2, 3 and c cables, c from 2 to 12: 6 + 5c spanning trees. */
 q15: t => { t = T(t); const c = 2 + (t + 10) % 11, T2 = 6 + 5 * c;
  return E('Predict the number of spanning trees.', `Leave out one cable from each of two different routes: 2 × 3 + 3 × ${n(c)} + ${n(c)} × 2 = 6 + ${n(3 * c)} + ${n(2 * c)} = ${n(T2)}.`, [['Spanning trees', T2], ['Cables left out', 2]]); },
 /* Square 1–2 (3), 2–3 (15), 3–4 (4), 4–1 (x) with diagonal 1–3 (16); x from 1 to 21: the total is 7 + the smaller of x and 15. */
 q16: t => { t = T(t); const x = t + 11, edges = [[1, 2, 3], [2, 3, 15], [3, 4, 4], [1, 4, x], [1, 3, 16]], s = mst(4, edges);
  return E('Predict the total length of the minimum spanning tree.', `Kruskal’s algorithm takes the cables lightest first and skips any that would close a circuit; with 4–1 at ${n(x)} the three cables it keeps add up to ${n(s)}.`, [['Minimum total', s], ['Length of 4–1', x]]); },
 /* Hubs 1 and 2, routes 1–3–2 (4, 9), 1–4–2 (7, 2) and 1–5–2 (x, 22), x from 1 to 21: leave out 22 and 9. */
 q17: t => { t = T(t); const x = t + 11, maxes = [9, 7, 22].sort((a, b) => b - a), all = 44 + x, s = all - maxes[0] - maxes[1];
  return E('Predict the total length of the minimum spanning tree.', `It leaves out the longest cable of two different routes. The route maximums are 9, 7 and 22, so leave out ${n(maxes[0])} and ${n(maxes[1])}: ${n(all)} − ${n(maxes[0])} − ${n(maxes[1])} = ${n(s)}.`, [['Minimum total', s], ['All cable', all]]); },
 /* Roads 1–2 (2), 1–3 (16), 2–3 (x), 2–4 (12), 3–4 (1), 3–5 (6), 4–5 (3); x from 1 to 21: station 5 at the smaller of 17 and x + 6. */
 q18: t => { t = T(t); const x = t + 11, d = dij(5, [[1, 2, 2], [1, 3, 16], [2, 3, x], [2, 4, 12], [3, 4, 1], [3, 5, 6], [4, 5, 3]]);
  return E('Predict the shortest time from station 1 to station 5.', `Dijkstra’s algorithm gives station 2 at ${n(d[2])}, station 3 at ${n(d[3])} and station 4 at ${n(d[4])}, so station 5 is ${n(d[5])} minutes away.`, [['Time to station 5 (min)', d[5]], ['Time to station 3 (min)', d[3]]]); },
 /* K_n for n from 4 to 9, reverses merged: (n − 1)! ÷ 2. */
 q19: t => { t = T(t); const k = 4 + (t + 10) % 6, A = fact(k - 1);
  return E('Predict the number of loops, counting a loop and its reverse once.', `From a fixed start there are (${n(k)} − 1)! = ${n(A)} orders, and each loop appears twice: ${n(A)} ÷ 2 = ${n(A / 2)}.`, [['Loops', A / 2], ['Counting direction', A]]); },
 /* Four stations: 1–2 (5), 1–3 (x), 1–4 (20), 2–3 (6), 2–4 (9), 3–4 (4); x from 1 to 21. */
 q20: t => { t = T(t); const x = t + 11, a = 5 + 6 + 4 + 20, b = 5 + 9 + 4 + x, c = x + 6 + 9 + 20, best = Math.min(a, b, c);
  return E('Predict the time of the cheapest tour.', `The three tours: 1–2–3–4–1 takes 5 + 6 + 4 + 20 = ${n(a)}; 1–2–4–3–1 takes 5 + 9 + 4 + ${n(x)} = ${n(b)}; 1–3–2–4–1 takes ${n(x)} + 6 + 9 + 20 = ${n(c)}. The cheapest is ${n(best)}.`, [['Cheapest tour (min)', best], ['Tours to compare', 3]]); },
});
})();
