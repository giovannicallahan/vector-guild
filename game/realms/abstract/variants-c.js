/* Abstract algebra: patterns of moves review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
const SUB = '₀₁₂₃₄₅₆₇₈₉', Z = m => 'Z' + String(m).split('').map(d => SUB[d]).join('');
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => `A lock is set to 3 to the power ${1010 + t}, mod 7. 3 and 7 are coprime, and 7 is prime.`,
 q22: t => { const s = 1 + (t + 10) % 4, j = 1 + (t + 10) % 5, tau = [1, 2, 3, 4, 5].map(x => `${x} → ${(x - 1 + s) % 5 + 1}`).join(', ');
  return `On five slots, σ: 1 → 2, 2 → 4, 3 → 1, 4 → 5, 5 → 3 and τ: ${tau}. Moves are combined right to left. Find (τ ∘ σ ∘ τ⁻¹)(${j}).`; },
 q23: t => `In Z₃₆, the subgroup ⟨${t + 12}⟩ is everything reached by adding ${t + 12} again and again.`,
 q24: t => `A relay sends Z₁₂ to Z₁₈ by φ(x) = 3x mod 18. Take the reading x = ${1 + (t + 10) % 11}.`,
 q25: t => `A relay maps Z₃₆ to itself by φ(x) = ${2 + (t + 10) % 20}x mod 36.`,
 q26: t => { const b = 3 + (t + 10) % 10; return `Two dials Z₄ and ${Z(b)} are coupled into the direct product Z₄ × ${Z(b)}.`; },
 q27: t => { const u = t + 10, x = (2 * u + 1) % 5, y = (3 * u + 2) % 7; return `Z₅ × Z₇ ≅ Z₃₅, with the reading w matched to (w mod 5, w mod 7). Find the w from 0 to 34 matched to the pair (${x}, ${y}).`; },
 q28: t => `In Z₂₄, H = ⟨12⟩ = {0, 12}. Take the coset ${1 + (t + 10) % 11} + H in the quotient group Z₂₄/H.`,
 q29: t => `A relay sends Z₂₄ to Z₁₂ by φ(x) = ${1 + (t + 10) % 11 === 1 ? '' : 1 + (t + 10) % 11}x mod 12, a homomorphism.`,
 q30: t => { const p = [2, 3, 4, 6, 12][(t + 10) % 5]; return `A ring of 12 tile slots reads, clockwise from slot 1, ${('R' + ' B'.repeat(p - 1) + ' ').repeat(12 / p).trim()}. The 12 turns of the ring act on its colourings.`; },
});
Object.assign(window.VARIANT_POOL, {
});
})();
