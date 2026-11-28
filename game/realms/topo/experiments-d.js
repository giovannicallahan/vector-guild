/* Topology: shape without size concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
/* Shared helpers for this file. */
const cnt = c => c === 1 ? 'once' : c === 2 ? 'twice' : `${n(c)} times`;
const q33name = u => u <= 9 ? (u === 0 ? 'a sphere' : u === 1 ? 'a torus' : `an orientable surface of genus ${u}`) : (u === 10 ? 'a projective plane' : u === 11 ? 'a Klein bottle' : `a surface with ${u - 9} cross-caps`);
const q33chi = u => u <= 9 ? 2 - 2 * u : 2 - (u - 9);
const q39P = t => [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 22, 23, 24][t + 10];
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* A sphere of radius 6 (k = 1 ÷ 36) and a triangle with angles π ÷ 2, π ÷ 2 and cπ ÷ 12, c from 1 to 11: area 3cπ. */
 q31: t => { t = T(t); const c = 1 + (t + 10) % 11, ex = c * Math.PI / 12, A = Math.round(ex * 3600) / 100;
  return Object.assign(E('Predict the area of the triangle in square metres, to 2 decimal places.', `The angle sum is π + ${n(c)}π ÷ 12, so the angle excess is ${n(c)}π ÷ 12 ≈ ${n(Math.round(ex * 100) / 100)}. With k = 1 ÷ 36, A = excess × 36 = ${n(3 * c)}π ≈ ${n(A)} square metres.`, [['Area (m²)', A], ['Angle excess (rad)', Math.round(ex * 100) / 100]]), { tolerance: 0.005 }); },
 /* Genus g from 2 to 10 at k = −1: area 4(g − 1)π. */
 q32: t => { t = T(t); const g = 2 + (t + 10) % 9, chi = 2 - 2 * g;
  return E('Predict the area of the surface divided by π.', `χ = 2 − 2 × ${n(g)} = ${n(chi)}. Gauss–Bonnet: A = 2πχ ÷ k = 2π × ${par(chi)} ÷ (−1) = ${n(-2 * chi)}π.`, [['Area ÷ π', -2 * chi], ['χ', chi]]); },
 /* Surface u = t + 10: orientable of genus u for u ≤ 9, otherwise u − 9 cross-caps. */
 q33: t => { t = T(t); const u = t + 10, chi = q33chi(u), s = chi > 0 ? 1 : chi < 0 ? -1 : 0;
  return E('Predict the sign of the curvature k: 1, 0 or −1.', `${q33name(u)} has χ = ${n(chi)}. In kA = 2πχ the area is positive, so k has the sign of χ: ${n(s)}, ${s > 0 ? 'elliptic' : s < 0 ? 'hyperbolic' : 'flat'} geometry.`, [['Sign of k', s], ['χ', chi]]); },
 /* Genus g from 2 to 8, k = −1: the regular 4g-gon has corner angles π ÷ 2g and area (4g − 4)π. */
 q34: t => { t = T(t); const g = 2 + (t + 10) % 7;
  return E('Predict the area of the polygon divided by π.', `The polygon has ${n(4 * g)} sides with angles adding up to 2π, so kA = 2π − ${n(4 * g - 2)}π = ${n(4 - 4 * g)}π. With k = −1, A = ${n(4 * g - 4)}π.`, [['Area ÷ π', 4 * g - 4], ['N (angle π ÷ N)', 2 * g], ['Sides', 4 * g]]); },
 /* u anticlockwise and v clockwise crossings of the ray. */
 q35: t => { t = T(t); const u = 1 + (t + 10) % 5, v = (t + 10) % 3;
  return E('Predict the winding number of the loop round the beacon.', `${n(u)} anticlockwise crossings and ${n(v)} clockwise ones: ${n(u)} − ${n(v)} = ${n(u - v)}.`, [['Winding number', u - v], ['Anticlockwise crossings', u], ['Clockwise crossings', v]]); },
 /* Loop a with winding number t, loop b with winding number 3: “a, then a, then b backwards” has 2t − 3. */
 q36: t => { t = T(t);
  return E('Predict the winding number of the loop “a, then a again, then b backwards”.', `Joining adds and running backwards changes the sign: ${n(t)} + ${par(t)} + (−3) = ${n(2 * t - 3)}.`, [['Winding number', 2 * t - 3], ['a backwards', -t]]); },
 /* The map θ ↦ nθ with n = t (5 when t = 0), and a loop with winding number 3. */
 q37: t => { t = T(t); const d = t === 0 ? 5 : t;
  return E('Predict the winding number of the image of the loop.', `θ ↦ ${n(d)}θ has degree ${n(d)}, so the loop with winding number 3 goes to one with winding number ${n(d)} × 3 = ${n(3 * d)}. It sends ${n(Math.abs(d))} points to each point.`, [['Image winding number', 3 * d], ['Degree', d], ['Points sent to one point', Math.abs(d)]]); },
 /* A wheel with s spokes, s from 3 to 12: V = s + 1, E = 2s, s independent loops. */
 q38: t => { t = T(t); const s = 3 + (t + 10) % 10;
  return E('Predict the number of independent loops.', `V = ${n(s)} + 1 = ${n(s + 1)} and E = 2 × ${n(s)} = ${n(2 * s)}, so E − V + 1 = ${n(2 * s)} − ${n(s + 1)} + 1 = ${n(s)}.`, [['Independent loops', s], ['V', s + 1], ['E', 2 * s]]); },
 /* f(x) = (x² + P) ÷ 10 on [0, 5], P from a list without 9, 16 and 21 (where 25 − P is a square): the fixed point is 5 − √(25 − P). */
 q39: t => { t = T(t); const P = q39P(t), x = 5 - Math.sqrt(25 - P), x2 = Math.round(x * 100) / 100;
  return Object.assign(E('Predict the fixed point of f in [0, 5], to 2 decimal places.', `g(x) = f(x) − x has g(0) = ${n(P / 10)} > 0 and g(5) = ${n((P - 25) / 10)} < 0. Solving x² − 10x + ${n(P)} = 0 gives x = 5 − √${n(25 - P)} ≈ ${n(x2)}.`, [['Fixed point', x2], ['g(0)', P / 10]]), { tolerance: 0.005 }); },
 /* Circuits: twice anticlockwise round A and B, t times round B only, once anticlockwise round B and C. */
 q40: t => { t = T(t); const wB = 2 + t + 1;
  return E('Predict the winding number of the whole loop round B.', `Every circuit encloses B: 2 + ${par(t)} + 1 = ${n(wB)}. Round A it is 2 and round C it is 1.`, [['Winding round B', wB], ['Winding round A', 2], ['Winding round C', 1]]); },
});
})();
