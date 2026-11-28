/* Real analysis review-drill statements, file a: q01–q10. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-a.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q01: t => `A rod's readings form the set S = {${t + 12} − 6/n : n ∈ ℕ}, one reading for each n = 1, 2, 3, ….`,
 q02: t => `A gauge's readings form the set S = {${window.Gen.n(t + 11)} − 4/n : n ∈ ℕ}, one reading for each n = 1, 2, 3, ….`,
 q03: t => `A step of 1/n millimetres is negligible when it is below the tolerance ε = ${window.Gen.n((2 + (t + 10) % 19) / 100)}.`,
 q04: t => `Two errors satisfy |e₁| ≤ 3 mm and |e₂| ≤ ${t + 12} mm, and each may be positive or negative.`,
 q05: t => `f(x) = (x − 2)² + 1 on the open interval (0, ${3 + (t + 10) % 8}), the x with 0 < x < ${3 + (t + 10) % 8}.`,
 q06: t => `ℕ × ℕ is listed along diagonals by the sum of the entries, each diagonal in order of its first entry: (1, 1), (1, 2), (2, 1), (1, 3), (2, 2), (3, 1), …, starting at position 1. Take the pair (2, ${1 + (t + 10) % 9}).`,
 q07: t => `xₙ = (3n + ${t + 17}) ÷ (n + 2), which tends to 3, and the tolerance is ε = 0.1.`,
 q08: t => `x₁ = 0 and xₙ₊₁ = (xₙ + ${3 * (t + 12)}) ÷ 4.`,
 q09: t => `xₙ = 2 + ${t + 12} sin(n) ÷ n, with n read in radians, and the tolerance is ε = 0.1.`,
 q10: t => `xₙ = ${t + 12}(−1)ⁿ + 6 ÷ n.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
