/* Data and inference review-drill statements, file c: q21–q30. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-c.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q21: t => { const z = (100 + 10 * (Math.max(-10, Math.min(10, t)) + 10)) / 100, m = z, N = 2000, h = m / N, f = x => Math.exp(-x * x / 2); let s = f(0) + f(m);
  for (let i = 1; i < N; i++) s += f(i * h) * (i % 2 ? 4 : 2);
  const a = Math.round((0.5 + s * h / 3 / Math.sqrt(2 * Math.PI)) * 1e4) / 1e4;
  return `A two-tailed z test (Hₐ: μ ≠ μ₀) gave z = ${z.toFixed(2)}. The normal table row reads ${z.toFixed(2)} → ${a.toFixed(4)}.`; },
 q22: t => `A supplier claims that 50% of its packets sprout, so H₀: p = 0.5. In a random sample of 100 packets, ${50 + t} sprouted.`,
 q23: t => `A supplier claims a mean of μ₀ = 50 hours. σ = 5 hours from long records, and a random sample of 25 cells has mean x̄ = ${window.Gen.n(Math.round((50 + 0.3 * t) * 10) / 10)} hours.`,
 q24: t => `New seed on 25 plots: mean ${40 + t} kg, s₁ = 8 kg. Old seed on 25 other plots: mean 40 kg, s₂ = 6 kg. Test H₀: μ₁ = μ₂.`,
 q25: t => `${60 + t} of 100 new seeds and 50 of 100 old seeds sprouted. H₀: p₁ = p₂.`,
 q26: t => `Five plots, each with the old seed one season and the new seed the next, have differences (new minus old) of ${[-2, 0, 2, -1, 1].map(v => window.Gen.n(v + t)).join(', ')} kg. Test H₀: μd = 0.`,
 q27: t => `A sack claims 40% large, 40% medium and 20% small seeds. A random sample of 100 holds ${40 + t} large, ${40 - t} medium and 20 small.`,
 q28: t => `100 plots are graded poor, fair or good: ${40 + t} plots grew the new seed and the rest the old, and 50 of all the plots had a good harvest.`,
 q29: t => `A 2 × 2 table of 100 plots, new or old seed against healthy or blighted: every row and column totals 50, and the cells hold ${25 + t}, ${25 - t}, ${25 - t} and ${25 + t}.`,
 q30: t => { const x = [1, 2, 3, 4, 5], y = x.map((v, i) => 60 + t * v + [3, 5, 4, 7, 6][i]); return `Five days of hours x and output y: ${x.map((v, i) => `(${v}, ${y[i]})`).join(', ')}.`; },
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
