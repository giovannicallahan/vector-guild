/* Differential equations review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => { const P = [[3, 4], [4, 3], [6, 8], [8, 6], [12, 5]][(t + 10) % 5]; return `A spring with mass 1 kg, damping ${2 * P[1]} N·s/m and stiffness ${P[0] * P[0] + 2 * P[1] * P[1]} N/m is pushed by a force F₀ cos(ωt).`; },
 q22: t => { const r = [-4, -3, -2, -1, 3, 4, 5][(t + 10) % 7]; return `y₁ = e^t, y₂ = e^(2t) and y₃ = e^(${window.Gen.n(r)}t) all solve one third-order linear equation.`; },
 q23: t => `An engine mount obeys x″ + 4x′ + 10x = ${5 * (1 + (t + 10) % 10)} cos(2t), and its steady swing is A cos(2t) + B sin(2t).`,
 q24: t => `x″ + 3x′ + ${1 + (t + 10) % 9 === 1 ? '' : 1 + (t + 10) % 9}x = 0 is written as a system with x₁ = x, x₂ = x′, and stepped once by Euler’s method with h = 0.1 from x(0) = 2, x′(0) = −1.`,
 q25: t => `x′ = Ax, where A has rows (2, 1) and (1, 2), at the point x = (${window.Gen.n(t)}, 1).`,
 q26: t => { const l = [-3, -1, 1, 2, 3][(t + 10) % 5]; return `x′ = Ax, where A has eigenvalue −2 with eigenvector (1, 1) and eigenvalue ${window.Gen.n(l)} with eigenvector (1, 2), and x(0) = (1, 0).`; },
 q27: t => { const a = (t + 10) % 7 - 3, G = window.Gen; return `x′ = Ax, where A has rows (${G.n(a + 2)}, −2) and (4, ${G.n(a - 2)}).`; },
 q28: t => `x′ = Ax, where A has rows (${window.Gen.n(t)}, 1) and (−4, 0).`,
 q29: t => `Two 20-litre tanks: fresh water into tank 1 at 30 L/min, 40 L/min from tank 1 to tank 2, 10 L/min back and 30 L/min drained from tank 2. Tank 1 starts with ${2 * (1 + (t + 10) % 10)} kg of salt and tank 2 with none; the eigenvalues are −3 and −1.`,
 q30: t => { const d = [1, 2, 4, 5, 8, 10][(t + 10) % 6]; return `f(t) = 8${window.Gen.n(6 - d) === '1' ? 'e^t' : `e^(${window.Gen.n(6 - d)}t)`}.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
 q28: [-6, -5, -3, -2, -1, 0, 1, 2, 3, 5, 6],
});
})();
