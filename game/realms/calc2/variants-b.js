/* Calculus 2: accumulation review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => { const c = 1 + (t + 10) % 6; return `A hull plate lies between the parabola y = 3x² and the line y = ${3 * c}x, from x = 0 to where they cross.`; },
 q12: t => `The region under y = 3x − x², from x = 0 to x = 3, is spun about the line x = ${window.Gen.n(-(1 + (t + 10) % 8))} to make a drum. Use cylindrical shells.`,
 q13: t => `A guide rail follows the curve y = 2x^(3/2) from x = 0 to x = ${1 + (t + 10) % 6}.`,
 q14: t => `A force of 30 N holds a spring 0.2 m beyond its natural length. It is stretched from its natural length to ${window.Gen.n((1 + (t + 10) % 6) / 10)} m beyond it.`,
 q15: t => `A box tank 3 m long, 2 m wide and ${1 + (t + 10) % 5} m tall is full of water, which is pumped out through an outlet 1 m above its top (density 1000 kg/m³, g = 9.8 m/s²).`,
 q16: t => `A rod ${1 + (t + 10) % 8} m long has density ρ(x) = 3 + 2x kg/m at x metres from one end.`,
 q17: t => `A cable ${5 * (1 + (t + 10) % 8)} m long, with a mass of 2 kg per metre, hangs from a drum and is wound up (g = 9.8 m/s²).`,
 q18: t => `Use integration by parts on ∫ from 1 to ${2 + (t + 10) % 8} of ln x dx.`,
 q19: t => { const m = 1 + (t + 10) % 8, top = m % 2 ? `${m === 1 ? '' : m}π/2` : `${m === 2 ? '' : m / 2}π`; return `Use a power-reducing identity on ∫ from 0 to ${top} of sin²x dx (x in radians).`; },
 q20: t => { const r = 1 + (t + 10) % 10; return `A circular plate of radius ${r} has its top half under y = √(${r * r} − x²). Take the piece from x = 0 to x = ${window.Gen.n(r / 2)}, using x = ${r} sin θ.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
