/* Real analysis review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `A fuel line delivers f(x) = x² litres per hour from x = 1 to x = 3, split into n equal pieces. The tolerance is ε = ${window.Gen.n((t + 11) / 100)}.`,
 q32: t => `A pump draws f(t) = t² − 8t + 18 litres per hour. Take the piece [3, ${3 + 1 + (t + 10) % 6}].`,
 q33: t => `A valve’s rate is 4 litres per hour for 0 ≤ t < 3 and 7 for t > 3. F(x) is the integral of the rate from 0 to x; take x = ${(t + 10) % 9}.`,
 q34: t => `Bound the sum of 1 ÷ n³ for n = 1, 2, 3, … using the first ${2 + (t + 10) % 7} terms and the integral of the tail.`,
 q35: t => `fₙ(x) = (2 + 8nx) ÷ (1 + nx) for x ≥ 0, at the load x = ${window.Gen.n((1 + (t + 10) % 10) / 2)}, with ε = 0.1.`,
 q36: t => `fₙ(x) = 3x ÷ (1 + nx²) for x ≥ 0 converges uniformly to 0. The tolerance is ε = ${window.Gen.n((15 + t) / 100)}.`,
 q37: t => { const m = 2 + (t + 10) % 11; return `g(x) = 4 + the sum for k ≥ 1 of ${m} cos(2πkx) ÷ 2ᵏ.`; },
 q38: t => { const b = [3, 4, 5, 6, 7, 8, 12][(t + 10) % 7]; return `The power series adds up 6xᵏ ÷ ${b}ᵏ for k = 0, 1, 2, … .`; },
 q39: t => `P = (2, −1) and Q = (${window.Gen.n(t)}, 3), measured with the taxicab metric.`,
 q40: t => `The series adds up 5(−1)ᵏxᵏ ÷ 6ᵏ for k = 0, 1, 2, …, on the interval [−${1 + (t + 10) % 5}, ${1 + (t + 10) % 5}].`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
