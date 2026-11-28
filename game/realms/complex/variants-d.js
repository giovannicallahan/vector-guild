/* Complex analysis: the plane of numbers review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `A power series Σ aₙzⁿ, summed over n = 1, 2, 3, …, has coefficients aₙ = n² ÷ ${2 + (t + 10) % 8}ⁿ.`,
 q32: t => `g(z) = 1 ÷ (1 + 2z) is written as its Taylor series about z = 0. Look at the coefficient of z to the power ${1 + (t + 10) % 8}.`,
 q33: t => `g(z) = ${3 * (t + 11)} ÷ (z(z − 3)) on the annulus 0 < |z| < 3.`,
 q34: t => `s(z) = sin z ÷ z to the power ${2 + (t + 10) % 6} has a pole at z = 0.`,
 q35: t => `f(z) = ${2 * (t + 11)}z ÷ (z² − 1) has a simple pole at z = 1.`,
 q36: t => `h(z) = (z³ + ${t + 12}z²) ÷ (z − 1)³ has a pole of order 3 at z = 1.`,
 q37: t => `f(z) = 3 ÷ (z − 2) + 5 ÷ (z − 4) + 7 ÷ (z − 6) is integrated once anticlockwise round the circle |z| = ${1 + 2 * ((t + 10) % 4)}.`,
 q38: t => { const a = 1 + (t + 10) % 6; return `I = ∫ 60 dx ÷ (x² + ${a * a}), along the whole real line from −∞ to ∞.`; },
 q39: t => `I = ∫ from 0 to 2π of ${2 * (t + 11)} dθ ÷ (5 + 3 cos θ), with θ in radians.`,
 q40: t => { const m = 1 + (t + 10) % 8; return `f(z) = ${m === 1 ? 'z' : `z to the power ${m}`} ÷ (z − 1)², while z goes once anticlockwise round |z| = 3.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
