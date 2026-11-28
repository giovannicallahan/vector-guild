/* Differential equations review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
const n = x => window.Gen.n(x);
const one = (v, x) => `${v < 0 ? '−' : '+'} ${Math.abs(v) === 1 && x ? '' : n(Math.abs(v))}${x}`;
const expr = terms => { const t = terms.filter(([v]) => v !== 0).map(([v, x]) => one(v, x)).join(' '); return t.startsWith('+ ') ? t.slice(2) : t.startsWith('− ') ? '−' + t.slice(2) : t; };
Object.assign(window.VARIANT_SETUP, {
 q31: t => { const A = 1 + (t + 10) % 6, top = expr([[A + 2, 's'], [A - 4, '']]); return `A relay signal has transform F(s) = (${top}) ÷ ((s − 2)(s + 1)), and its inverse transform is f(t) = A e^(2t) + B e^(−t).`; },
 q32: t => `A needle obeys y″ + 3y′ + 2y = 0 with y(0) = ${1 + (t + 10) % 7} and y′(0) = 0. Solved with the Laplace transform, y(t) = A e^(−t) + B e^(−2t).`,
 q33: t => { const m = 1 + (t + 10) % 9; return `A line obeys v′ + 2v = ${2 * m}u(t − 3) with v(0) = 0: its supply is switched on at t = 3.`; },
 q34: t => `A filter convolves f(t) = t with g(t) = 2. Take the time t = ${1 + (t + 10) % 8}.`,
 q35: t => `y″ + xy′ + 4y = 0 with y(0) = ${t + 11} and y′(0) = 1, solved as a power series y = a₀ + a₁x + a₂x² + ….`,
 q36: t => { const k = 1 + (t + 10) % 5; return `A system obeys x′ = xy − ${k} and y′ = ${expr([[1, 'y'], [-1, 'x'], [k - 1, '']])}.`; },
 q37: t => { const D = 1 + (t + 10) % 8; return `A sorter obeys x′ = y and y′ = ${expr([[-1, 'x²'], [D, 'x'], [-2, 'y']])}. Take the critical point (${D}, 0).`; },
 q38: t => { const k = 1 + (t + 10) % 10, c = window.Gen.n(k / 10); return `Insects x (hundreds) and birds y (tens) obey x′ = x − 0.2xy and y′ = −${k === 10 ? '' : c}y + 0.1xy.`; },
 q39: t => { const k = 1 + (t + 10) % 6; return `A cable obeys y″ + λy = 0 with y(0) = 0 and y(2) = 0. Take the allowed value with k = ${k}, the ${k === 1 ? '1st' : k === 2 ? '2nd' : k === 3 ? '3rd' : k + 'th'} smallest positive λ.`; },
 q40: t => `A string 2 metres long is fixed at both ends, with wave speed ${20 + 10 * ((t + 10) % 10)} m/s, so ω = (wave speed) × √λ for its allowed λ.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
