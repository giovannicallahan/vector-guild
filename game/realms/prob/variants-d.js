/* Probability review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
/* The normal table, as in gen-d.js and experiments-d.js: h is z in hundredths, A(h) the area to the left in ten-thousandths. */
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
const n = x => window.Gen.n(x);
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `Bolt lengths are normal with mean 80 mm and standard deviation 2.5 mm. A bolt measures ${n(P31(t).x)} mm.`,
 q32: t => { const { h, x } = P32(t); return `Bolt masses are normal with mean 120 g and standard deviation 8 g. Find P(X < ${n(x)}). ${rows([h - 1, h, h + 1])}`; },
 q33: t => { const { hb, b } = P33(t); return `Bolt lengths are normal with mean 50 mm and standard deviation 2 mm. Find P(48 < X < ${n(b)}). ${rows([-100, hb - 1, hb, hb + 1])}`; },
 q34: t => { const { k, h } = P34(t); return `Bolt lengths are normal with mean 64 mm and standard deviation 4 mm. Find the ${k}th percentile, using the row whose area is closest to ${(k / 100).toFixed(2)}. ${rows([h - 1, h, h + 1])}`; },
 q35: t => `A balloon carries ${n(t + 12)} sensor pods, each with mean mass 150 g, and a radio with mean mass 400 g.`,
 q36: t => `A balloon carries ${n(t + 11)} sensor pods with independent masses, each with standard deviation 4 g.`,
 q37: t => `Single wind readings have standard deviation 6 km/h. Mira averages n = ${n(t + 14)} independent readings.`,
 q38: t => { const { h, c } = P38(t); return `Daily highs have mean 18 °C and standard deviation 4 °C. X̄ is the mean of 64 days; take c = ${n(c)} °C. ${rows([h - 1, h, h + 1])}`; },
 q39: t => { const { k, h } = P39(t); return `100 balloons go up, each reaching the upper air with chance 0.5, independently. Use the normal approximation with the continuity correction for P(X ≥ ${k}). ${rows([h - 1, h, h + 1])}`; },
 q40: t => { const { h, x } = P40(t); return `Pressure has mean 1012 hPa and standard deviation 6 hPa. The mean of 36 daily readings is ${n(x)} hPa. Find the probability of a sample mean at least this far out on the same side. ${rows([h - 1, h, h + 1])}`; },
});
Object.assign(window.VARIANT_POOL, {
 q40: [-8, -6, -4, -2, 2, 4, 6, 8],
});
})();
