/* Waves: sound and light review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `A guy cable 50 m long with a mass of 4 kg is pulled to a tension of ${window.Gen.n(0.08 * Math.pow(40 + 2 * (t + 10), 2))} N.`,
 q12: t => `Two waves of amplitude 5 cm travel together on one rope, the second ahead by a phase difference of ${window.Gen.n(0.2 + 0.1 * (t + 10))} rad.`,
 q13: t => { const h = 1 + (t + 10) % 6; return `A cable 1.2 m long, fixed at both ends, carries waves at 180 m/s and vibrates in its ${h === 1 ? '1st' : h === 2 ? '2nd' : h === 3 ? '3rd' : h + 'th'} harmonic.`; },
 q14: t => `The air in the hall is at ${window.Gen.n(-20 + 3 * (t + 10))} °C.`,
 q15: t => `A speaker gives a sound intensity of ${t + 11} × 10⁻⁶ W/m² at a seat; I₀ = 10⁻¹² W/m².`,
 q16: t => `An organ pipe ${window.Gen.n(0.4 + 0.05 * (t + 10))} m long is closed at one end and open at the other; sound travels at 343 m/s.`,
 q17: t => { const h = 1 + (t + 10) % 4; return `A string 0.8 m long, fixed at both ends, carries waves at 200 m/s and plays its ${['1st', '2nd', '3rd', '4th'][h - 1]} harmonic. An organ pipe open at both ends must sound the same note as its fundamental; sound travels at 343 m/s.`; },
 q18: t => `A reference fork of 440 Hz and an organ pipe of ${window.Gen.n(440 + 0.5 * t)} Hz sound together.`,
 q19: t => `A rover drives towards Mira at ${10 + 2 * (t + 10)} m/s with its siren sounding at 600 Hz; Mira stands still and sound travels at 343 m/s.`,
 q20: t => `A rover with a 750 Hz siren drives at 20 m/s and Mira rides towards it at ${15 + t} m/s, the two moving towards each other; sound travels at 343 m/s.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
 /* Slider values whose rounded target sits on a rounding tie are left out of the drills. */
 q14: [-6, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
 q15: [-6, -5, -3, -2, -1, 1, 2, 3, 4, 5, 6],
 q19: [-6, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6],
});
})();
