/* Electricity and magnetism: fields review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `A proton (mass 1.67 × 10⁻²⁷ kg, charge 1.60 × 10⁻¹⁹ C) moves at ${2 * (t + 11)} × 10⁵ m/s at right angles to a uniform magnetic field of 0.25 T.`,
 q32: t => `A straight bar 2 m long carries ${t + 11} A in a uniform 0.5 T magnetic field, at an angle of π/6 radians between the current and the field.`,
 q33: t => `A long straight wire carries ${5 * (t + 11)} A. Take μ₀ = 4π × 10⁻⁷ T·m/A and look at a point 4 cm from the wire.`,
 q34: t => `A long solenoid has 1000 turns per metre and carries ${t + 11} A. Take μ₀ = 4π × 10⁻⁷ T·m/A.`,
 q35: t => `A flat coil of ${10 * (t + 11)} turns, each enclosing 0.05 m², has a field at right angles to it that rises steadily by 40 mT in 0.5 s.`,
 q36: t => `A generator coil of 100 turns, each of area 0.05 m², spins at ${10 * (t + 11)} rad/s in a uniform 0.2 T field.`,
 q37: t => `A coil of inductance 200 mH and resistance 4 Ω is switched onto a steady ${2 * (t + 11)} V supply.`,
 q38: t => `An inductor of ${10 * (t + 11)} mH is connected alone across a 50 Hz alternating supply.`,
 q39: t => `A series RLC circuit has resistance ${3 * (t + 11)} Ω, and on its supply X_L − X_C = ${4 * (t + 11)} Ω.`,
 q40: t => `A radio wave has frequency ${15 * (t + 11)} MHz. Take c = 3.00 × 10⁸ m/s.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
