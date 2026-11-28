/* Probability concept-bench experiments, file d: q31–q40. Model shape: docs/PACK-FORMAT.md §4.
   t is an integer slider value in [-10, 10]; values[0] is the target. The drill statements in variants-d.js describe the same numbers. */
(function(){
'use strict';
const n = x => window.Gen.n(x), par = x => window.Gen.par(x);
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
const E = (prompt, formula, values) => ({ prompt, formula, values, target: values[0][1] });
/* Shared with variants-d.js through the formulas below: keep the two files in step. */
/* The normal table, as in gen-d.js: h is z in hundredths, A(h) the area to the left in ten-thousandths. */
const memo = {};
const A = h => { if (memo[h] === undefined) { const z = h / 100; let term = z, sum = z;
 for (let k = 1; k < 400 && term !== 0; k++) { term *= -z * z / (2 * k); sum += term / (2 * k + 1); if (Math.abs(term) < 1e-18) break; }
 memo[h] = Math.round((0.5 + sum / Math.sqrt(2 * Math.PI)) * 1e4); } return memo[h]; };
const zt = h => (h < 0 ? '−' : '') + (Math.abs(h) / 100).toFixed(2), ar = v => (v / 1e4).toFixed(4);
const rows = hs => 'Normal table rows (z → area to the left): ' + hs.map(h => `${zt(h)} → ${ar(A(h))}`).join(', ') + '.';
/* q34: the row whose area is nearest k%; the list keeps only k with one clear nearest row. */
const nearestRow = k => { let best = 0, gap = Infinity, second = Infinity; for (let h = -349; h <= 349; h++) { const g = Math.abs(A(h) - 100 * k); if (g < gap) { second = gap; gap = g; best = h; } else if (g < second) second = g; } return { h: best, clear: second - gap >= 2 }; };
const PCT = [10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90].filter(k => nearestRow(k).clear);
/* Slider t to the numbers of each model; variants-d.js and experiments-d.js share these. */
const P31 = t => ({ x: 80 + 0.5 * t, z: t / 5 });
const P32 = t => ({ h: 12 * t, x: 120 + 0.96 * t });
const P33 = t => ({ hb: 10 * (t + 11), b: 50 + 0.2 * (t + 11) });
const P34 = t => { const k = PCT[(t + 10) % PCT.length], h = nearestRow(k).h; return { k, h, x: Math.round((64 + 4 * h / 100) * 10) / 10 }; };
const P38 = t => ({ h: 20 * t, c: 18 + 0.1 * t });
const P39 = t => { const k = 51 + (t + 10) % 13; return { k, h: Math.round((k - 50.5) * 20) }; };
const P40 = t => ({ h: 20 * t, x: 1012 + 0.2 * t });
/* A rounded target gets its own tolerance; a whole-number target keeps the engine’s exact whole-number rule. */
const W = (m, tolerance) => Number.isInteger(m.target) ? m : { ...m, tolerance };
window.EXPERIMENTS = window.EXPERIMENTS || {};
Object.assign(window.EXPERIMENTS, {
 /* Bolts with mean 80 mm and σ = 2.5 mm; a bolt of 80 + 0.5t mm has z = 0.2t. */
 q31: t => { t = T(t); const { x, z } = P31(t);
  return E('Predict the bolt’s z-score.', `x − μ = ${n(x)} − 80 = ${n(x - 80)} mm, and z = ${n(x - 80)} ÷ 2.5 = ${n(z)}.`, [['z-score', z], ['x − μ (mm)', x - 80]]); },
 /* Bolt masses with mean 120 g and σ = 8 g; x = 120 + 0.96t has z = 0.12t. */
 q32: t => { t = T(t); const { h, x } = P32(t), P = A(h);
  return W(E('Predict P(X < x) to 4 decimal places.', `z = (${n(x)} − 120) ÷ 8 = ${zt(h)}, and the table row for ${zt(h)} gives ${ar(P)}.`, [['P(X < x)', P / 1e4], ['z-score', h / 100]]), 0.00005); },
 /* Bolt lengths with mean 50 mm and σ = 2 mm, between 48 mm (z = −1.00) and b. */
 q33: t => { t = T(t); const { hb, b } = P33(t), P = A(hb) - A(-100);
  return W(E('Predict P(48 < X < b) to 4 decimal places.', `z for 48 is −1.00 and z for ${n(b)} is ${zt(hb)}. ${ar(A(hb))} − ${ar(A(-100))} = ${ar(P)}.`, [['P(48 < X < b)', P / 1e4], ['z of b', hb / 100]]), 0.00005); },
 /* Bolt lengths with mean 64 mm and σ = 4 mm; the kth percentile from the nearest row. */
 q34: t => { t = T(t); const { k, h, x } = P34(t);
  return E('Predict the length at this percentile, in mm to 1 decimal place.', `The area nearest ${(k / 100).toFixed(2)} is ${ar(A(h))}, at z = ${zt(h)}. x = 64 + ${par(h / 100)} × 4 = ${n(64 + 4 * h / 100)}, which is ${x.toFixed(1)} mm to 1 decimal place.`, [['Length (mm)', x], ['z', h / 100]]); },
 /* c pods of mean 150 g and a radio of mean 400 g. */
 q35: t => { t = T(t); const c = t + 12;
  return E('Predict the expected mass of the whole payload, in grams.', `Means add: ${n(c)} × 150 = ${n(150 * c)} g for the pods, and ${n(150 * c)} + 400 = ${n(150 * c + 400)} g with the radio.`, [['Expected payload (g)', 150 * c + 400], ['Expected pods (g)', 150 * c]]); },
 /* c independent pods with σ = 4 g: variance 16c, standard deviation 4√c. */
 q36: t => { t = T(t); const c = t + 11, sd = Math.round(400 * Math.sqrt(c)) / 100;
  return W(E('Predict the standard deviation of the pods’ total mass, in grams to 2 decimal places.', `Variances add: ${n(c)} × 16 = ${n(16 * c)} g², and √${n(16 * c)} = ${n(sd)} g.`, [['Standard deviation of the total (g)', sd], ['Variance of the total (g²)', 16 * c]]), 0.005); },
 /* Wind readings with σ = 6 km/h averaged over n = t + 14. */
 q37: t => { t = T(t); const c = t + 14, se = Math.round(600 / Math.sqrt(c)) / 100;
  return W(E('Predict the standard error of the sample mean, in km/h to 2 decimal places.', `σ ÷ √n = 6 ÷ √${n(c)} = ${n(se)} km/h. Four times as many readings, ${n(4 * c)}, would halve it.`, [['Standard error (km/h)', se], ['Readings to halve it', 4 * c]]), 0.005); },
 /* Daily highs with mean 18 °C and σ = 4 °C, averaged over 64 days: standard error 0.5 °C. */
 q38: t => { t = T(t); const { h, c } = P38(t), P = 1e4 - A(h);
  return W(E('Predict P(X̄ > c) to 4 decimal places.', `Standard error 4 ÷ 8 = 0.5 °C, so z = (${n(c)} − 18) ÷ 0.5 = ${zt(h)}. 1 − ${ar(A(h))} = ${ar(P)}.`, [['P(X̄ > c)', P / 1e4], ['z-score', h / 100]]), 0.00005); },
 /* 100 balloons with p = 0.5: mean 50, standard deviation 5; P(X ≥ k) with the cut-off k − 0.5. */
 q39: t => { t = T(t); const { k, h } = P39(t), P = 1e4 - A(h);
  return W(E('Predict the approximate P(X ≥ k) to 4 decimal places.', `np = 50 and √(npq) = 5. The cut-off is ${n(k)} − 0.5 = ${n(k - 0.5)}, so z = (${n(k - 0.5)} − 50) ÷ 5 = ${zt(h)}, and 1 − ${ar(A(h))} = ${ar(P)}.`, [['P(X ≥ k)', P / 1e4], ['z-score', h / 100]]), 0.00005); },
 /* Pressure with mean 1012 hPa and σ = 6 hPa over 36 days: standard error 1 hPa. */
 q40: t => { t = T(t); const { h, x } = P40(t), L = A(h), P = h < 0 ? L : 1e4 - L;
  return W(E('Predict the tail probability beyond the sample mean, to 4 decimal places.', `Standard error 6 ÷ 6 = 1 hPa, so z = (${n(x)} − 1012) ÷ 1 = ${zt(h)}. ${h < 0 ? `The tail is to the left: ${ar(P)}.` : `The tail is to the right: 1 − ${ar(L)} = ${ar(P)}.`}`, [['Tail probability', P / 1e4], ['z-score', h / 100]]), 0.00005); },
});
})();
