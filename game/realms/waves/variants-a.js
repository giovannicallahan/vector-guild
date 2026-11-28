/* Waves: sound and light review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
const T = t => Math.max(-10, Math.min(10, Math.round(Number(t) || 0)));
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `The seismometer arm makes ${14 + T(t)} full swings in 20 seconds.`,
 q02: t => `A mass of ${0.5 * (1 + (T(t) + 10) % 8)} kg hangs on a spring with k = 200 N/m and oscillates.`,
 q03: t => `A mass moves as x(t) = 0.2 cos(${2 + (T(t) + 10) % 9}t + 0.5) metres, with t in seconds.`,
 q04: t => `A 1 kg mass on a spring with k = 100 N/m swings with amplitude 0.3 m, with no friction. Look at the moment it passes x = ${Math.round(3 * ((T(t) + 10) % 10)) / 100} m.`,
 q05: t => `A simple pendulum ${0.25 * (1 + (T(t) + 10) % 12)} m long swings through a small angle, with g = 9.8 m/s².`,
 q06: t => `A 2 kg mass with damping constant 0.4 kg/s starts 10 cm from equilibrium; its amplitude is A₀e^(−bt/2m). Look at it after ${11 + T(t)} s.`,
 q07: t => `A cable is shaken at 5 Hz and the crests of the wave are ${0.5 * (1 + (T(t) + 10) % 10)} m apart.`,
 q08: t => `A sine wave y = A sin(kx − ωt) on a cable has wavelength ${0.5 * (1 + (T(t) + 10) % 10)} m.`,
 q09: t => `A cable with linear mass density 0.02 kg/m is pulled with a tension of ${20 * (1 + (T(t) + 10) % 10)} N.`,
 q10: t => `A horn sends sound out evenly in all directions; its intensity is 1 W/m² at 2 m. Look at a point ${3 + (T(t) + 10) % 10} m from it.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
