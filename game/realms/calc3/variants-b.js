/* Calculus 3: many variables review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const m = 1 + (t + 10) % 6; return `A shuttle moves along r(t) = ⟨2t, 3t, t²⟩ metres, t seconds after its burn. The docking face lies in the plane x + y + z = ${m * m + 5 * m}.`; },
 q12: t => `A hill’s height is h(x, y) = 50 − x² − 2y² metres. A survey beacon stands at (${1 + (t + 10) % 6}, 2).`,
 q13: t => { const m = 1 + (t + 10) % 3; return `f(x, y) = 10xy ÷ (x² + y²) has no value at (0, 0). Approach the origin along the line y = ${m === 1 ? '' : m}x.`; },
 q14: t => { const p = 1 + (t + 10) % 4; return `A ridge’s height is h(x, y) = 3x²y − 2xy² + 4e^(x − y) metres. Look at the point (${p}, ${p}).`; },
 q15: t => `A crater wall’s height is h(x, y) = 2x³ − 3x²y + xy² + y³ metres. Look at the point (2, ${window.Gen.n(-3 + (t + 10) % 7)}).`,
 q16: t => `The ground height is h(x, y) = 80 − 2x² + xy − y² metres. Estimate it at (3.1, ${window.Gen.n(2 + (-3 + (t + 10) % 7) / 10)}) from the point (3, 2), using the tangent plane there.`,
 q17: t => `A crater slope has height h(x, y) = 40 + x²y − y³ + 3x metres, with y measured north. A rover is parked at (2, ${1 + (t + 10) % 4}).`,
 q18: t => `The temperature is T(x, y) = 3x² − 2xy + y² degrees Celsius, and a balloon is at x(t) = 1 + 2t, y(t) = t² kilometres, t hours after release. Look at the moment t = ${1 + (t + 10) % 4}.`,
 q19: t => { const D = [[3, 4], [4, 3], [3, -4], [-3, 4], [4, -3], [-4, 3], [-3, -4], [-4, -3]][(t + 10) % 8]; return `The temperature is T(x, y) = x² + 3xy − 2y² degrees Celsius. At (2, 1) the wind blows in the direction of ⟨${window.Gen.n(D[0])}, ${window.Gen.n(D[1])}⟩.`; },
 q20: t => { const k = 1 + (t + 10) % 5; return `The pressure above its base level is P(x, y) = 2x² + 2y² pascals. A drone is at (${3 * k}, ${4 * k}).`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
