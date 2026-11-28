/* Differential equations review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `A 200 L tank is kept well stirred. Brine with ${window.Gen.n((t + 11) / 10)} kg of salt per litre flows in at 4 L/min and the mixture flows out at 4 L/min.`,
 q12: t => `y = C₁e^(t) + C₂e^(3t) solves y″ − 4y′ + 3y = 0. It starts with y(0) = 4 and y′(0) = ${window.Gen.n(4 + 2 * t)}.`,
 q13: t => { const j = 1 + (t + 10) % 6; return `A shock obeys y″ + ${2 + j}y′ + ${1 + j}y = 0.`; },
 q14: t => { const j = 1 + (t + 10) % 5; return `A spring obeys y″ + ${2 * j}y′ + ${j * j}y = 0, whose characteristic equation has the repeated root −${j}. It starts with y(0) = 2 and y′(0) = 1.`; },
 q15: t => { const b = 1 + (t + 10) % 6; return `A seat spring obeys y″ + 2y′ + ${1 + b * b}y = 0; its characteristic equation has complex roots a ± bi.`; },
 q16: t => `A corner obeys x″ + ${t + 11}x′ + 9x = 0: mass 1 kg, damping ${t + 11} N·s/m, stiffness 9 N/m.`,
 q17: t => { const w = 1 + (t + 10) % 6; return `A suspension corner has mass 2 kg and spring stiffness ${2 * w * w} N/m.`; },
 q18: t => { const j = 1 + (t + 10) % 8; return `An engine mount obeys y″ + 3y′ + 2y = ${2 * j}t + ${3 * j + 2}, with particular solution yₚ = Ct + D.`; },
 q19: t => { const j = 1 + (t + 10) % 8, g = 1 - 2 * j; return `A mount obeys y″ + y′ + 5y = ${j + 2} cos 2t ${g < 0 ? '−' : '+'} ${Math.abs(g) === 1 ? '' : Math.abs(g) + ' '}sin 2t (angles in radians).`; },
 q20: t => `A mount with m = 1 kg, c = 2 N·s/m and k = 7 N/m is pushed by ${5 * (1 + (t + 10) % 10)} cos 2t newtons.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
