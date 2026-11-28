/* Data and inference review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
Object.assign(window.VARIANT_SETUP, {
 q01: t => { const c = T(t) + 15; return `A clinic log over 50 days: check-ups in a day 0, 1, 2, 3; number of days 5, 10, ${c}, ${35 - c}.`; },
 q02: t => `Five readings: 12, 15, 18, 21 and ${24 + T(t)} kilograms.`,
 q03: t => `Six readings: 8, 11, 14, 17, 20 and ${15 + T(t)}.`,
 q04: t => { const f = 1 + (T(t) + 10) % 11; return `Twenty shuttle runs: crew size 2, 3, 4, 5; frequency 3, 5, ${f}, ${12 - f}.`; },
 q05: t => `Eight readings in order: 5, 8, ${8 + (T(t) + 10) % 7}, 14, 17, 21, 24, 30.`,
 q06: t => `A data set has Q1 = 12 and Q3 = ${24 + T(t)}.`,
 q07: t => { const k = 1 + (T(t) + 10) % 8; return `A sample of five readings: ${20 - k}, 20, 20, 20, ${20 + k}.`; },
 q08: t => `A sample has mean x̄ = 50 and standard deviation s = 4. One reading is ${50 + T(t)}.`,
 q09: t => `A crew list is numbered 1 to 200. A systematic sample of 20 starts at number ${1 + (T(t) + 10) % 10}.`,
 q10: t => { const r = [2, 3, 4, 5, 6, 8, 10, 12][(T(t) + 10) % 8]; return `Single readings vary with σ = 24, and a sample of n = ${r * r} readings is averaged.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
