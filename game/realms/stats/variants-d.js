/* Data and inference review-drill statements, file d: q31–q40. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-d.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q31: t => `Five days at the solar farm. Hours of sunlight: 5, 6, 7, 8, 9. Output in kWh: ${20 - t}, 22, 27, 28, ${33 + t}.`,
 q32: t => `The line ŷ = 4.5 + 2.8x predicts a day’s output in kWh from x hours of sunlight; it was fitted to days with 3 to 10 hours. Take a day with ${2 + (t + 10) % 13} hours.`,
 q33: t => `A best-fit line through a scatter plot has correlation coefficient r = ${window.Gen.n((52 + 2 * t) / 100)}.`,
 q34: t => `Ten residuals from a fitted line, in kWh: 1.2, −0.8, 0.5, −1.6, 4.6, −1.1, 0.3, −2, −0.4, −0.7. Suppose their standard deviation about the line were s = ${window.Gen.n((85 + 10 * (t + 10)) / 100)} kWh.`,
 q35: t => `Three seed varieties, 4 plots each, yields in kg: A ${[12, 14, 15, 11].map(v => v - t).join(', ')}; B ${[17, 15, 19, 17].map(v => v + t).join(', ')}; C 10, 13, 11, 14.`,
 q36: t => `An ANOVA of 3 groups with 15 readings in all has a sum of squares between groups of ${96 + 6 * t} and within groups of 132.`,
 q37: t => `A sample of 15 cable lengths, from a normal population, has s = ${window.Gen.n((32 + t) / 10)} mm; the supplier claims σ = 2.5 mm.`,
 q38: t => `A 95% confidence interval for a mean runs from 46.25 to 50.95 (x̄ = 48.6, margin of error 2.35). A two-tailed test at α = 0.05 checks the claim μ₀ = ${window.Gen.n(Math.round((48.6 + 0.4 * t) * 10) / 10)}.`,
 q39: t => `A χ² test of independence on a table with ${2 + (t + 10) % 3} rows and ${2 + Math.floor((t + 10) / 3) % 4} columns.`,
 q40: t => `A claim says μ₀ = 120 hours, with σ = 10 hours known. A random sample of 25 has x̄ = ${window.Gen.n((1200 + t - 37) / 10)} hours.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
