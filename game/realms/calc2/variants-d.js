/* Calculus 2: accumulation review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `The series Σ 1 ÷ n² converges by the integral test. Bound its tail after the first ${[2, 4, 5, 8, 10, 20, 25, 40, 50, 100][(t + 10) % 10]} terms by an integral.`,
 q32: t => `aₙ = (${2 + (t + 10) % 10}n + 1) ÷ (2n³ + 5) is compared with the p-series bₙ = 1 ÷ n².`,
 q33: t => `The alternating series 1 − 1/4 + 1/9 − 1/16 + … is to be summed until the bound “the error is less than the first term left out” is itself below ${window.Gen.n(1 / [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000][(t + 10) % 10])}.`,
 q34: t => `The ratio test is applied to the series with terms aₙ = n × ${[2, 3, 5, 6, 7, 8, 9, 10, 11, 12][(t + 10) % 10]}ⁿ ÷ 4ⁿ.`,
 q35: t => { const c = -5 + (t + 10) % 11, R = 2 + (t + 10) % 3, xc = c === 0 ? 'x' : `(x ${c < 0 ? '+' : '−'} ${Math.abs(c)})`; return `The power series Σ ${xc}ⁿ ÷ (n × ${R}ⁿ) is summed from n = 1.`; },
 q36: t => `P(x) = (x − 1) − (x − 1)² ÷ 2 is the Taylor polynomial of degree 2 of ln x about 1. Evaluate it at x = ${window.Gen.n(1 + (1 + (t + 10) % 10) / 10)}.`,
 q37: t => { const k = 1 + (t + 10) % 10; return `Find the coefficient of x² in the Maclaurin series of ${k === 1 ? 'cos x' : `cos(${k}x)`}.`; },
 q38: t => `Taylor’s theorem bounds the error of the degree-n Maclaurin polynomial of cos x at x = ${window.Gen.n([0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 1.5, 2, 3][(t + 10) % 10])} by |x|ⁿ⁺¹ ÷ (n + 1)!, since no derivative of cos is bigger than 1. The error must be below 0.001.`,
 q39: t => `Estimate the integral of e^(−x²) from 0 to ${window.Gen.n(0.3 * (1 + (t + 10) % 4))} with the first two terms of its integrated Maclaurin series.`,
 q40: t => `A drone flies along x(t) = 3t², y(t) = t³ − 3t (metres, t in seconds). Take the path from t = 0 to t = ${1 + (t + 10) % 6}.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
