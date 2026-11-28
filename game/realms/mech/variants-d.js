/* Mechanics: motion and force review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => { const k = 1 + (t + 10) % 5; return `A sled starts from rest at the top of a frictionless ramp ${window.Gen.n(0.4 * k * k)} m high. Take g = 9.8 m/s².`; },
 q32: t => `A 200 kg module moving at ${1 + (t + 10) % 6} m/s towards a buffer is brought to rest in 0.5 s. Take its direction of motion as positive.`,
 q33: t => `A 200 kg module moving at ${1 + (t + 10) % 8} m/s latches onto a 200 kg module at rest, and no outside force acts.`,
 q34: t => `A 100 kg module sits at x = 0 m and a ${[25, 100, 150, 300, 400, 900][(t + 10) % 6]} kg module at x = 10 m.`,
 q35: t => `A flywheel spins at a steady ${60 * (1 + (t + 10) % 10)} rpm.`,
 q36: t => `Two 5 kg weights are fixed ${window.Gen.n(0.2 * (1 + (t + 10) % 5))} m from the axle of a light frame. Treat them as points.`,
 q37: t => `A pull of ${8 * (1 + (t + 10) % 10)} N at right angles to a spanner, 0.5 m from the axle, turns a flywheel with moment of inertia 4 kg·m². No other torque acts.`,
 q38: t => `A flywheel with moment of inertia 6 kg·m² spins at 12 rad/s. A resting wheel with moment of inertia ${[2, 3, 6, 12, 18, 30][(t + 10) % 6]} kg·m² locks onto the same axle, and no outside torque acts.`,
 q39: t => `A satellite circles a planet with GM = 4 × 10¹⁴ m³/s² at ${[25000, 16000, 6250, 4000][(t + 10) % 4]} km from the planet’s centre.`,
 q40: t => { const k = 1 + (t + 10) % 10; return `A latched pair of modules moving at ${window.Gen.n(1.4 * k)} m/s coasts up a frictionless ramp until it stops. Take g = 9.8 m/s².`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
