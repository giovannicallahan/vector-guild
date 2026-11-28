/* Mechanics: motion and force review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `A rocket sled has acceleration a(t) = 2 + 3t m/s², with v(0) = 4 m/s and x(0) = 10 m. Look at the time t = ${2 + (t + 10) % 5} s.`,
 q12: t => { const tau = 1 + (t + 10) % 4; return `A pod is fired horizontally at ${5 + (t + 10) % 7} m/s from a platform ${window.Gen.n(4.9 * tau * tau)} m above flat ground. Ignore the air and take g = 9.8 m/s².`; },
 q13: t => `A pod is thrown at ${20 + t} m/s, 0.5 radians above the horizontal, and lands on the same flat ground. Ignore the air and take g = 9.8 m/s².`,
 q14: t => `A pod goes round a circle of radius 4 m at a steady ${2 + (t + 10) % 9} m/s.`,
 q15: t => `A pod on a circle of radius 5 m moves at ${2 + (t + 10) % 9} m/s and its speed is growing by 2 m/s every second.`,
 q16: t => `A rover drives at (${1 + (t + 10) % 7}, 2) m/s over the ground, x east and y north. Its vane measures the wind relative to the rover as (−3, 4) m/s.`,
 q17: t => `A sling of radius 3 m releases a pod at ${8 + (t + 10) % 10} m/s, aimed 0.7 radians above the horizontal, onto flat ground. Ignore the air and the release height; take g = 9.8 m/s².`,
 q18: t => `On smooth ice, a 4 kg sled is pulled east with ${40 + 2 * t} N and west with 8 N. Nothing else pushes along the ice.`,
 q19: t => `A 60 kg crate stands in a lift cage whose acceleration is ${window.Gen.n(t / 2)} m/s², with up positive. Take g = 9.8 m/s².`,
 q20: t => `A crane pulls up with ${600 + 10 * t} N on a 30 kg crate; a 20 kg crate hangs below it on a second cable. Take g = 9.8 m/s².`,
});
Object.assign(window.VARIANT_POOL, {
 /* Slider values whose rounded target sits within 0.0005 of a rounding tie are left out of the drills. */
 q13: [-6, -5, -4, -2, -1, 1, 2, 3, 4, 6],
 q15: [-6, -5, -3, -2, -1, 1, 3, 4, 6],
 q16: [-5, -4, -2, -1, 2, 3, 5, 6],
 q17: [-6, -5, -4, -2, -1, 2, 3, 4, 5, 6],
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
