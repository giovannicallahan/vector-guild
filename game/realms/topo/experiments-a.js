/* Topology: shape without size concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* P = (0, 0) and Q = (t, 4): taxicab |t| + 4, maximum the larger of |t| and 4. */
 q01: t => { t = T(t); const a = Math.abs(t), tx = a + 4, mx = Math.max(a, 4);
  return E('Predict the taxicab distance from P to Q, in kilometres.', `The gap across is |${n(t)} − 0| = ${n(a)} and the gap up is 4. Taxicab: ${n(a)} + 4 = ${n(tx)}. Maximum: the larger gap, ${n(mx)}.`, [['Taxicab distance (km)', tx], ['Maximum distance (km)', mx], ['Gap across (km)', a]]); },
 /* Taxicab radius r from 1 to 10: 1 + 4(1 + 2 + … + r) = 2r² + 2r + 1 grid points. */
 q02: t => { t = T(t); const r = 1 + (t + 10) % 10, c = 2 * r * r + 2 * r + 1;
  return E('Predict how many grid points, the beacon included, are at taxicab distance at most this radius.', `The beacon, then diamonds of 4, 8, …, ${n(4 * r)} points at distances 1 to ${n(r)}: 1 + 4 × ${n(r * (r + 1) / 2)} = ${n(c)}.`, [['Grid points', c], ['Points at the largest distance', 4 * r]]); },
 /* d(x, y) = 10 and d(y, z) = b from 1 to 9: d(x, z) lies between 10 − b and 10 + b. */
 q03: t => { t = T(t); const b = 1 + (t + 10) % 9;
  return E('Predict the smallest possible value of d(x, z).', `The triangle inequality gives 10 ≤ d(x, z) + ${n(b)}, so d(x, z) ≥ ${n(10 - b)}, reached when z lies on the segment from x to y. The largest value is 10 + ${n(b)} = ${n(10 + b)}.`, [['Smallest d(x, z)', 10 - b], ['Largest d(x, z)', 10 + b]]); },
 /* The interval (0, 22) and a point x = t + 11 from 1 to 21: the largest ball has radius min(x, 22 − x). */
 q04: t => { t = T(t); const x = t + 11, r = Math.min(x, 22 - x);
  return E('Predict the largest radius r for which B(x, r) lies inside the interval.', `The point is ${n(x)} from 0 and ${n(22 - x)} from 22. The ball (${n(x)} − r, ${n(x)} + r) must pass neither end, so r is at most ${n(r)}.`, [['Largest radius', r], ['Distance to 0', x], ['Distance to 22', 22 - x]]); },
 /* k from 2 to 7 separate closed intervals [0, 1], [2, 3], …: every end is a boundary point, 2k in all. */
 q05: t => { t = T(t); const k = 2 + (t + 10) % 6;
  return E('Predict the number of boundary points of S.', `Each of the ${n(k)} pieces has two ends, and every ball round an end holds points of S and points outside it. No other point is a boundary point, so there are 2 × ${n(k)} = ${n(2 * k)}.`, [['Boundary points', 2 * k], ['Pieces', k]]); },
 /* (−5, 5), (0, 9) and (c, c + 10) with c from −4 to 4: the intersection is (max(0, c), 5). */
 q06: t => { t = T(t); const c = -4 + (t + 10) % 9, L = Math.max(0, c);
  return E('Predict the length of the interval that all three cover.', `The largest left end is the largest of −5, 0 and ${n(c)}, which is ${n(L)}. The smallest right end is the smallest of 5, 9 and ${n(c + 10)}, which is 5. The length is 5 − ${par(L)} = ${n(5 - L)}.`, [['Length', 5 - L], ['Left end', L], ['Right end', 5]]); },
 /* The discrete topology on m points, m from 2 to 11: 2^m open sets. */
 q07: t => { t = T(t); const m = 2 + (t + 10) % 10, c = Math.pow(2, m);
  return E('Predict the number of open sets, ∅ and the whole set included.', `Every subset is open, and each of the ${n(m)} points is in or out of a subset: 2 multiplied by itself ${n(m)} times is ${n(c)}.`, [['Open sets', c], ['Points', m]]); },
 /* The nested topology ∅, {1}, {1, 2}, …, X on m points, m from 2 to 9: the closure of {2} is {2, …, m}. */
 q08: t => { t = T(t); const m = 4 + (t + 10) % 8;
  return E('Predict how many points are in the closure of {2}.', `The closed sets are the complements of the open sets: X, {2, …, ${n(m)}}, {3, …, ${n(m)}} and so on, down to {${n(m)}} and ∅. The smallest one containing 2 is {2, …, ${n(m)}}, which has ${n(m - 1)} points.`, [['Points in the closure', m - 1], ['Closed sets', m + 1]]); },
 /* The nested basis {1}, {1, 2}, …, X on m points, m from 2 to 10: the unions are the basis sets and ∅. */
 q09: t => { t = T(t); const m = 2 + (t + 10) % 9;
  return E('Predict how many open sets the basis gives, ∅ included.', `The basis sets are nested, so the union of any of them is the largest one taken. The open sets are ∅ and the ${n(m)} basis sets: ${n(m + 1)} in all.`, [['Open sets', m + 1], ['Basis sets', m]]); },
 /* X = {1, …, m} with the nested open sets, Y = {a, b} with open sets ∅, {a}, Y: f is continuous exactly when f⁻¹({a}) is one of the m + 1 open sets. */
 q10: t => { t = T(t); const m = 2 + (t + 10) % 8;
  return E('Predict how many maps from X to Y are continuous.', `A map is continuous exactly when f⁻¹({a}), the nodes sent to a, is open in X: ∅, {1}, {1, 2}, …, or all ${n(m)} nodes. Each choice gives one map, so ${n(m + 1)} maps are continuous.`, [['Continuous maps', m + 1], ['All maps', Math.pow(2, m)]]); },
});
})();
