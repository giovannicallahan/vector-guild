/* Waves: sound and light review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A test drone flies level over the Rover Track at ${800 + 40 * t} m/s; sound travels at 343 m/s.`,
 q22: t => `Two speakers play the same 686 Hz tone in phase, and sound travels at 343 m/s. A marshal is ${window.Gen.n(3 + 0.25 * (t + 11))} m from one speaker and 3 m from the other.`,
 q23: t => `A listener at rest by the track hears a rover’s siren at ${500 + 5 * t} Hz as it approaches and 440 Hz as it leaves. Sound travels at 343 m/s.`,
 q24: t => `Light of vacuum wavelength ${500 + 10 * t} nm enters crown glass, whose index of refraction is 1.52.`,
 q25: t => `A ray of light in air (n = 1.00) meets fresh water (n = 1.333) at ${window.Gen.n(Math.round((0.55 + 0.04 * t) * 100) / 100)} radians from the normal.`,
 q26: t => `A ray inside a material of index of refraction ${window.Gen.n(Math.round((1.3 + 0.05 * (t + 10)) * 100) / 100)} meets a flat face with air (n = 1.00).`,
 q27: t => `Unpolarised light of 200 W/m² passes through two polarising filters whose axes are ${window.Gen.n(Math.round((0.15 + 0.05 * (t + 10)) * 100) / 100)} rad apart.`,
 q28: t => `A lamp stands ${25 + t} cm in front of a converging lens with focal length 10 cm.`,
 q29: t => `A target 2 cm tall stands ${31 + 2 * t} cm in front of a converging lens with focal length 20 cm.`,
 q30: t => `Light of wavelength ${600 + 10 * t} nm falls on two narrow slits 5 μm apart.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
