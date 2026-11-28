/* Differential equations review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `Mira tries y = Ce^(kt) in the differential equation 2y′ = ${t === 1 ? '' : t === -1 ? '−' : window.Gen.n(t)}y.`,
 q02: t => { const o = 1 + (t + 10) % 3, d = ['y', 'y′', 'y″', 'y‴'][o]; return `The equation ${(t + 10) % 2 === 1 ? `(${d})²` : d} + 3y = sin t, where y is a function of t.`; },
 q03: t => `y′ = 6x² − 2x + 4 with y(1) = 20. Find y at x = ${2 + (t + 10) % 5}.`,
 q04: t => `The slope field of y′ = (x + 1)(2y − 8), at the point (2, ${window.Gen.n(t)}).`,
 q05: t => `y′ = x + 2y with y(0) = ${window.Gen.n(t)}, step size h = 0.1, two steps of Euler's method.`,
 q06: t => `y′ = ${window.Gen.n(t / 10)}y with y(0) = 5, solved by separating the variables.`,
 q07: t => `A coolant line obeys 2y′ + 6y = 30 with y(0) = ${window.Gen.n(t)}.`,
 q08: t => `A 200 litre tank starts with ${2 * (t + 10)} kg of salt. Brine with 0.25 kg per litre flows in at 4 litres per minute and the mixture flows out at the same rate.`,
 q09: t => `y′ = (y − 1)(${window.Gen.n(t)} − y). Of its equilibria, one is stable and one unstable.`,
 q10: t => `A colony grows by P′ = 0.4P − 0.0005P² from P(0) = 100. Find when it first reaches ${100 + 30 * (t + 10)}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
 q01: [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6],
 q06: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
 q09: [-5, -4, -3, -2, -1, 0, 2, 3, 4, 5, 6],
 q10: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
});
})();
