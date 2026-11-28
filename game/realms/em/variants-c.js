/* Electricity and magnetism: fields review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A 10 μF capacitor is charged to 20 V and then disconnected from its supply. A slab with dielectric constant κ = ${[2, 4, 5, 8, 10][(t + 10) % 5]} is slid in to fill the gap.`,
 q22: t => `The current in a charging cable is I(t) = 2 + 4t amperes, t seconds after switch-on. Take the first ${1 + (t + 10) % 8} s.`,
 q23: t => `Capacitor A (6 μF) is in series with a parallel pair: B (4 μF) and C (2 μF when empty, filled with a slab of κ = 4). The bank is across ${3 * (1 + (t + 10) % 10)} V.`,
 q24: t => `A copper cable (ρ = 1.68 × 10⁻⁸ Ω·m) of cross-sectional area 2 mm² is ${100 * (1 + (t + 10) % 10)} m long.`,
 q25: t => `A heater of 6 Ω is connected across ${window.Gen.n(3 * (1 + (t + 10) % 10))} V.`,
 q26: t => `An ideal supply of emf ${4 * (1 + (t + 10) % 12)} V feeds a 4 Ω cable followed by heaters of 6 Ω and 12 Ω in parallel.`,
 q27: t => `Junctions A (top) and B (bottom) are joined by a left branch with a 12 V battery (+ towards A) and 2 Ω, a middle branch of 4 Ω, and a right branch with a ${[2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22][(t + 10) % 20]} V battery (+ towards A) and 2 Ω. I₁ and I₃ flow up the side branches towards A, I₂ down the middle.`,
 q28: t => `An empty 200 μF capacitor is charged through ${10 * (1 + (t + 10) % 10)} kΩ from an ideal 12 V supply.`,
 q29: t => `Junctions A and B are joined by a left branch with a ${3 + 6 * ((t + 10) % 10)} V battery (+ towards A) and 3 Ω, a middle branch of heaters of 3 Ω and 6 Ω in parallel, and a right branch with a 9 V battery (+ towards A) and 6 Ω.`,
 q30: t => `An ion of charge +2e (e = 1.60 × 10⁻¹⁹ C) moves at ${100 * (1 + (t + 10) % 10)} km/s at right angles to a 50 mT magnetic field.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
