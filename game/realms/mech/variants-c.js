/* Mechanics: motion and force review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A sled of mass 60 kg rests on a ramp that rises at ${n((1 + (t + 10) % 8) / 10)} radians. Take g = 9.8 m/s².`,
 q22: t => `A crate of mass 40 kg is set down at rest on a ramp that rises at ${n((2 + (t + 10)) / 20)} radians, with μs = 0.5 and μk = 0.3. Take g = 9.8 m/s².`,
 q23: t => `A 30 kg crate slides up a ramp at 0.3 radians with μk = 0.2, pulled by a cable over a frictionless pulley to a hanging counterweight of ${20 + 2 * (t + 10)} kg. Take g = 9.8 m/s².`,
 q24: t => `A rover drives round a flat circular track of radius ${20 + 10 * (t + 10)} m, held on only by static friction with μs = 0.5. Take g = 9.8 m/s².`,
 q25: t => `A pod of mass 80 kg falls through air with drag D = bv², where b = ${n((5 + (t + 10)) / 100)} kg/m. Take g = 9.8 m/s².`,
 q26: t => `A ram pushes along a track with force F(x) = 6x² + 4x newtons, from x = 0 to x = ${1 + (t + 10) % 8} m.`,
 q27: t => `A sled of mass 40 kg moves at 5 m/s, and then the net work done on it is ${n(40 * t)} J.`,
 q28: t => `A crane lifts a 50 kg crate straight up through 12 m at a steady speed in ${15 + t} s. Take g = 9.8 m/s².`,
 q29: t => `A winch pulls a 50 kg sled from rest for 10 m across a level floor with a horizontal pull of ${150 + 10 * (t + 10)} N; μk = 0.2 and g = 9.8 m/s².`,
 q30: t => `A spring buffer with spring constant 800 N/m is squeezed ${n((1 + (t + 10) % 10) / 20)} m shorter than its natural length.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
