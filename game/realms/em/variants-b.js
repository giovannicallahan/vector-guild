/* Electricity and magnetism: fields review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const r = [0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9][(t + 10) % 8], b = 3 + (t + 10) % 4; return `A bead carrying ${b} nC sits at the centre of a thin spherical shell of radius 0.5 m carrying −7 nC. A Gaussian sphere of radius ${window.Gen.n(r)} m is drawn around the bead.`; },
 q12: t => `A 3 μC charge and a ${window.Gen.n(t)} μC charge are 0.5 m apart. Use k = 8.99 × 10⁹ N·m²/C².`,
 q13: t => `A helium nucleus (charge 2e) is accelerated from rest through ${100 * (t + 11)} V. Use e = 1.60 × 10⁻¹⁹ C.`,
 q14: t => `A +4 μC charge is 0.2 m from a point and a ${window.Gen.n(t)} μC charge is 0.5 m from it. Use k = 8.99 × 10⁹ N·m²/C².`,
 q15: t => `The potential along a pipe is V(x) = 2x³ − 9x² + 40 volts, with x in metres. Look at x = ${window.Gen.n(t)} m.`,
 q16: t => `Two large parallel plates are 5 mm apart with ${50 * (t + 11)} V between them.`,
 q17: t => `A proton (mass 1.67 × 10⁻²⁷ kg) moves at ${40 * (1 + (t + 10) % 10)} km/s. Use e = 1.60 × 10⁻¹⁹ C.`,
 q18: t => `Two flat plates, each ${100 * (t + 11)} cm², are 2 mm apart in air. Use ε₀ = 8.85 × 10⁻¹² F/m.`,
 q19: t => `A 6 μF and a 3 μF capacitor are joined in series, and that pair is connected in parallel with a ${t + 11} μF capacitor.`,
 q20: t => `A 200 μF capacitor is charged to ${10 * (t + 11)} V.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
 q15: [-3, -2, -1, 1, 2, 4, 5, 6],
});
})();
