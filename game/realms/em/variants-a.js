/* Electricity and magnetism: fields review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `A dust grain carries a charge of −${window.Gen.n((t + 12) * 1.6)} × 10⁻¹⁸ C. The elementary charge is e = 1.60 × 10⁻¹⁹ C.`,
 q02: t => `Two spheres with charges ${1 + (t + 10) % 9} μC and −4 μC sit 0.3 m apart. Use k = 8.99 × 10⁹ N·m²/C².`,
 q03: t => `On an x-axis in metres, a 1 μC charge sits at x = 0, a 2 μC charge at x = −0.1 m and a ${window.Gen.n(t)} μC charge at x = 0.2 m. Use k = 8.99 × 10⁹ N·m²/C².`,
 q04: t => `A ${window.Gen.n(t)} nC charge sits at the origin, and P is the point x = 0.2 m. Use k = 8.99 × 10⁹ N·m²/C².`,
 q05: t => `A rod along the x-axis from x = 0.1 m to x = 0.5 m carries λ = ${5 * (t + 11)} nC/m. Use k = 8.99 × 10⁹ N·m²/C².`,
 q06: t => `A dipole has charges of ±${t + 11} nC, 0.02 m apart, in a uniform 50 kN/C field, at θ = π/2 radians between p and the field.`,
 q07: t => `A flat 2 m² panel sits in a uniform field of ${100 * (t + 11)} N/C, at π/3 radians to the panel’s normal.`,
 q08: t => `A closed surface encloses a net charge of ${window.Gen.n(t)} nC. Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²).`,
 q09: t => `Two thin concentric shells: radius 1 m with 10 nC, and radius 3 m with ${window.Gen.n(5 * t)} nC, each spread evenly. Use k = 8.99 × 10⁹ N·m²/C².`,
 q10: t => `A large flat sheet carries σ = ${20 * (t + 11)} nC/m² spread evenly. Use ε₀ = 8.85 × 10⁻¹² C²/(N·m²).`,
});
Object.assign(window.VARIANT_POOL, {
 q09: [-6, -5, -4, -3, -1, 1, 2, 3, 4, 5, 6],   // t = −2 would leave no charge enclosed
});
})();
