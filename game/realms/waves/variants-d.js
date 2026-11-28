/* Waves: sound and light review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const n = x => window.Gen.n(x);
const idx = (t, size) => (Math.max(-10, Math.min(10, Math.round(Number(t) || 0))) + 10) % size;
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `Light of 500 nm passes two slits 0.25 mm apart onto a screen ${n(1 + 0.5 * idx(t, 5))} m away. Use the small-angle approximation.`,
 q32: t => `Light of ${n(400 + 20 * idx(t, 11))} nm in air falls straight down on a film of index 1.25 laid on glass of index 1.52.`,
 q33: t => `A Michelson interferometer is lit with 500 nm light, and ${n(10 * (Math.max(-10, Math.min(10, Math.round(Number(t) || 0))) + 11))} fringes pass the mark as a mirror moves.`,
 q34: t => `A slit 50 μm wide is lit by 500 nm light, and the pattern falls on a screen ${n(1 + 0.5 * idx(t, 5))} m away. Use the small-angle approximation.`,
 q35: t => `A slit 10 μm wide is lit by 500 nm light, and a detector sits at θ = ${n(0.004 * (1 + idx(t, 9)))} rad from the centre.`,
 q36: t => `Two slits, each 10 μm wide, have centres ${n(10 * (2 + idx(t, 6)))} μm apart. Count the central fringe, and leave out the missing orders at the edges of the central peak.`,
 q37: t => `A grating has 500 lines per millimetre and is lit by light of ${n(400 + 25 * idx(t, 11))} nm.`,
 q38: t => `A telescope with a round opening ${n(5 * (1 + idx(t, 8)))} cm across looks at two points in 500 nm light. Use the Rayleigh criterion.`,
 q39: t => `X-rays of 0.1 nm reflect most strongly in first order at ${n(0.1 + 0.02 * idx(t, 10))} rad from the crystal planes.`,
 q40: t => `A lamp’s first-order line through a grating of 500 lines per millimetre is at ${n(0.2 + 0.01 * idx(t, 11))} rad.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
