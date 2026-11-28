/* Calculus 3: many variables review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `A cable runs straight from (0, 0, 0) to (2, 1, 2), in metres. Its density is ρ = ${t + 11} + 2z kilograms per metre.`,
 q32: t => `A force F(x, y) = ⟨y, ${t + 12}x⟩ newtons pushes a cart along the straight track r(t) = ⟨t, 2t⟩ from t = 0 to t = 3, in metres.`,
 q33: t => `A winch pulls with the force field F(x, y) = ⟨2x + ${t + 12}y, ${t + 12}x⟩ newtons, with x and y in metres, and hauls a cart along a winding track.`,
 q34: t => `A cart runs once anticlockwise round the rectangle 0 ≤ x ≤ 2, 0 ≤ y ≤ 3, in metres, pushed by the force F(x, y) = ⟨−${t + 12}y, x⟩ newtons.`,
 q35: t => `Air in a chamber moves with velocity F(x, y, z) = ⟨${t + 12}xy, y², xz⟩ metres per second.`,
 q36: t => `A duct wall panel is the half of a cylinder of radius ${1 + (t + 10) % 6} m with θ from 0 to π and height 4 m, parametrised by r(θ, z) = ⟨R cos θ, R sin θ, z⟩ with R the radius.`,
 q37: t => `A flat filter panel lies at height z = ${t + 11} m over the rectangle 0 ≤ x ≤ 2, 0 ≤ y ≤ 3, oriented upward. Air moves with velocity F(x, y, z) = ⟨1, 2, z⟩ metres per second.`,
 q38: t => `A dome of radius 2 m stands on the floor z = 0. Air circulates with velocity F(x, y, z) = ⟨−${t + 12}y, x, z⟩, and the rim is travelled anticlockwise seen from above.`,
 q39: t => `A box 2 m by 2 m by 3 m holds air moving with velocity F(x, y, z) = ⟨${t + 12}x, y, z⟩ metres per second.`,
 q40: t => `A half-ball dome of radius 3 m stands on the floor z = 0. Air moves with velocity F(x, y, z) = ⟨${t + 12}x, y, z⟩ metres per second.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
