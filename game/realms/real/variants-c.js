/* Real analysis review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A continuous f changes sign between the ends of an interval of length 1. Bisection must trap its root in an interval shorter than ε = ${window.Gen.n([0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001][(t + 10) % 7])}.`,
 q22: t => `f(x) = x² on the interval [0, ${1 + (t + 10) % 9}]. A Lipschitz constant K satisfies |f(x) − f(y)| ≤ K|x − y| for all x and y in it.`,
 q23: t => { const kind = (t + 10) % 3, s = Math.floor((t + 10) / 3), j = kind === 2 ? 1 + s : 0, v = kind === 1 ? 2 + s : 1; return `g(x) = x² for x < 1, g(1) = ${v}, and g(x) = x${j ? ' + ' + j : ''} for x > 1.`; },
 q24: t => { const G = window.Gen; return `f(x) = 2|x − 1|${t ? (t < 0 ? ' − ' : ' + ') + (Math.abs(t) === 1 ? '' : G.n(Math.abs(t))) + 'x' : ''}, and the difference quotient at x = 1 is (f(1 + h) − f(1)) ÷ h.`; },
 q25: t => `f(x) = x² + 3x on the interval [${window.Gen.n(t)}, ${window.Gen.n(t + 4)}].`,
 q26: t => `A gauge reading f(t) has |f′(t)| ≤ 0.5 per hour over an interval of ${1 + (t + 10) % 10} hours.`.replace(' 1 hours', ' 1 hour'),
 q27: t => `eˣ at x = 1 is replaced by its Taylor polynomial of degree n about 0; the remainder is at most 3 ÷ (n + 1)!. The accuracy wanted is ε = 1 ÷ ${Math.pow(10, 1 + (t + 10) % 6)}.`,
 q28: t => { const G = window.Gen; return `f(x) = x³ + x is strictly increasing. Take the reading y = ${G.n(t * t * t + t)}.`; },
 q29: t => `sin x at x = 2 is replaced by its Taylor polynomial of degree n about 0; the remainder is at most 2ⁿ⁺¹ ÷ (n + 1)!. The accuracy wanted is ε = 1 ÷ ${Math.pow(10, 1 + (t + 10) % 6)}.`,
 q30: t => { const m = 2 + (t + 10) % 6; return `f(x) = x² on [0, ${m}] with the partition P = {${Array.from({ length: m + 1 }, (_, i) => i).join(', ')}}.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
