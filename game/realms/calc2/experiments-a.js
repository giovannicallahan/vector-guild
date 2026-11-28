/* Calculus 2: accumulation concept-bench experiments, file a: q01–q10. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-a.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-a.js through the formulas below: keep the two files in step. */
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* r(t) = 3t² + 4t from t = 0 to an end time e from 2 to 6, starting at 150 litres: F(t) = t³ + 2t². */
 q01: t => { t = T(t); const e = 2 + (t + 10) % 5, net = e * e * e + 2 * e * e, fin = 150 + net;
  return E('Predict the amount of water in the tank at that moment, in litres.', `F(t) = t³ + 2t² is an antiderivative of the rate, so the net change from t = 0 to t = ${n(e)} is F(${n(e)}) − F(0) = ${n(e * e * e)} + ${n(2 * e * e)} = ${n(net)} litres. The tank holds 150 + ${n(net)} = ${n(fin)} litres.`, [['Amount at the end (L)', fin], ['Net change (L)', net]]); },
 /* F(x) = ∫ from 1 to x of (3t² − 4t + 5) dt for x from 2 to 7; F′(x) = f(x). */
 q02: t => { t = T(t); const x = 2 + (t + 10) % 6, f = 3 * x * x - 4 * x + 5, F = x * x * x - 2 * x * x + 5 * x - 4;
  return E('Predict F′(x), the rate at which the running total grows at that x, in kilolitres per hour.', `F′(x) is the integrand at x: f(${n(x)}) = ${n(3 * x * x)} − ${n(4 * x)} + 5 = ${n(f)}. The total itself is F(${n(x)}) = G(${n(x)}) − G(1) = ${n(F + 4)} − 4 = ${n(F)} for G(t) = t³ − 2t² + 5t.`, [['F′(x) (kL/h)', f], ['F(x) (kL)', F]]); },
 /* r(t) = 3t² + 2 from t = 0 to b, b from 1 to 8: the integral is b³ + 2b and the average b² + 2. */
 q03: t => { t = T(t); const b = 1 + (t + 10) % 8, I = b * b * b + 2 * b, avg = b * b + 2;
  return E('Predict the average value of r(t) over the interval, in litres per second.', `∫ from 0 to ${n(b)} of (3t² + 2) dt = ${n(b * b * b)} + ${n(2 * b)} = ${n(I)}. Dividing by the length ${n(b)} gives ${n(I)} ÷ ${n(b)} = ${n(avg)} litres per second.`, [['Average value (L/s)', avg], ['Integral (L)', I]]); },
 /* ∫ from 0 to b of 6t(t² + 1)² dt with u = t² + 1, b from 1 to 3: (b² + 1)³ − 1. */
 q04: t => { t = T(t); const b = 1 + (t + 10) % 3, U = b * b + 1, v = U * U * U - 1;
  return E('Predict the value of the integral, in litres.', `With u = t² + 1, du = 2t dt and 6t dt = 3 du; u runs from 1 to ${n(U)}. The integral is ∫ from 1 to ${n(U)} of 3u² du = ${n(U)}³ − 1 = ${n(v)}.`, [['Integral (L)', v], ['Upper limit in u', U]]); },
 /* ∫ from 0 to T of 6 ÷ (t + 2) dt = 6 ln((T + 2) ÷ 2), T from 1 to 8, to 3 decimal places. */
 q05: t => { t = T(t); const e = 1 + (t + 10) % 8, v = Math.round(6000 * Math.log((e + 2) / 2)) / 1000;
  return { ...E('Predict the litres delivered, to 3 decimal places.', `An antiderivative of 6 ÷ (t + 2) is 6 ln|t + 2|, so the litres delivered are 6 ln ${n(e + 2)} − 6 ln 2 = 6 ln(${n(e + 2)} ÷ 2) ≈ ${v.toFixed(3)}.`, [['Litres delivered', v], ['Top end of the interval', e]]), tolerance: 0.0005 }; },
 /* ∫ from 0 to T of 2 ÷ (4 + t²) dt = arctan(T ÷ 2), T from 1 to 8, in radians to 3 decimal places. */
 q06: t => { t = T(t); const e = 1 + (t + 10) % 8, v = Math.round(1000 * Math.atan(e / 2)) / 1000;
  return { ...E('Predict the angle turned, in radians to 3 decimal places.', `With u = t ÷ 2, 2 ÷ (4 + t²) dt = du ÷ (1 + u²), and u runs from 0 to ${n(e / 2)}. The angle is arctan ${n(e / 2)} − arctan 0 ≈ ${v.toFixed(3)} radians.`, [['Angle turned (rad)', v], ['Upper limit in u', e / 2]]), tolerance: 0.0005 }; },
 /* Between y = 6wx and y = 6x², which meet at 0 and w (w from 1 to 5): the area is w³. */
 q07: t => { t = T(t); const w = 1 + (t + 10) % 5, edge = `${n(6 * w)}x`;
  return E('Predict the area between the line and the curve, in square metres.', `${edge} = 6x² at x = 0 and x = ${n(w)}. Line minus curve is ${edge} − 6x², with antiderivative ${n(3 * w)}x² − 2x³, so the area is ${n(3 * w * w * w)} − ${n(2 * w * w * w)} = ${n(w * w * w)}.`, [['Area (m²)', w * w * w], ['Right crossing x', w]]); },
 /* Between x = 3y² and the edge x = 3h², which meet at y = ±h (h from 1 to 5): strips of length 3h² − 3y², area 4h³. */
 q08: t => { t = T(t); const h = 1 + (t + 10) % 5, X = 3 * h * h, A = 4 * h * h * h;
  return E('Predict the area of the region, in square metres.', `3y² = ${n(X)} at y = −${n(h)} and y = ${n(h)}. Each horizontal strip has length ${n(X)} − 3y², with antiderivative ${n(X)}y − y³, so the area is (${n(X * h)} − ${n(h * h * h)}) − (−${n(X * h)} + ${n(h * h * h)}) = ${n(A)}.`, [['Area (m²)', A], ['Upper height y', h]]); },
 /* Base under y = 2√x from 0 to L (L from 1 to 8), square slices of area 4x: volume 2L². */
 q09: t => { t = T(t); const L = 1 + (t + 10) % 8;
  return E('Predict the volume of the solid, in cubic metres.', `The slice at x is a square of side 2√x, area 4x. The volume is ∫ from 0 to ${n(L)} of 4x dx = 2 × ${n(L * L)} = ${n(2 * L * L)}.`, [['Volume (m³)', 2 * L * L], ['End slice area (m²)', 4 * L]]); },
 /* The region under y = √x from 0 to L (L from 1 to 8) spun about the x-axis: discs of area πx, volume (L² ÷ 2)π. */
 q10: t => { t = T(t); const L = 1 + (t + 10) % 8;
  return E('Predict k, where the volume is k·π cubic metres.', `Each slice is a disc of radius √x and area πx. The volume is π ∫ from 0 to ${n(L)} of x dx = π × ${n(L * L)} ÷ 2, so k = ${n(L * L / 2)}.`, [['k', L * L / 2], ['Disc area at the end ÷ π', L]]); },
});
})();
