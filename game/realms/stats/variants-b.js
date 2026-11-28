/* Data and inference review-drill statements, file b: q11–q20. Shape: docs/PACK-FORMAT.md §5.
   Each statement uses the same numbers as the matching model in experiments-b.js. Loaded before game/variants.js, which merges these tables. */
(function(){
'use strict';
window.VARIANT_SETUP = window.VARIANT_SETUP || {};
window.VARIANT_POOL = window.VARIANT_POOL || {};
Object.assign(window.VARIANT_SETUP, {
 q11: t => `Six frozen-ground depths, in centimetres: ${[-2, 2, -5, 4, 0, 1].map(v => 30 + t + v).join(', ')}.`,
 q12: t => { const i = t + 10, L = [90, 95, 99][i % 3], se = 1 + Math.floor(i / 3); return `The lab’s standard error σ ÷ √n is ${se} g/kg, and the council wants ${L}% confidence. Critical values: 90%, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576.`; },
 q13: t => `A sample of lumps has x̄ = 50 g/kg with standard error σ ÷ √n = ${1 + (t + 10) % 8} g/kg. Build the 95% confidence interval, with z* = 1.96.`,
 q14: t => { const N = 6 + (t + 10) % 16, df = N - 1, T95 = { 4: '2.776', 5: '2.571', 6: '2.447', 7: '2.365', 8: '2.306', 9: '2.262', 10: '2.228', 11: '2.201', 12: '2.179', 13: '2.160', 14: '2.145', 15: '2.131', 16: '2.120', 17: '2.110', 18: '2.101', 19: '2.093', 20: '2.086', 21: '2.080' };
  return `A sample of ${N} lumps, σ unknown. The 95% column of the t table: df ${df - 1}: ${T95[df - 1]}; df ${df}: ${T95[df]}; df ${df + 1}: ${T95[df + 1]}.`; },
 q15: t => `A sample of 16 lumps has s = ${4 * (1 + (t + 10) % 7)} g/kg, σ unknown, 95% confidence. The t table row df 15 reads 90% 1.753, 95% 2.131, 99% 2.947.`,
 q16: t => `${50 + 2 * t} of 100 rock cores show a nickel vein. The council wants 95% confidence, with z* = 1.96.`,
 q17: t => { const k = 1 + (t + 10) % 3; return k === 1 ? 'The lab’s records give σ = 12 g/kg, and 36 lumps are measured for their mean iron content.' : k === 2 ? 'A new seam has no records of σ; 10 lumps give a mean and a sample standard deviation s.' : '200 rock cores are split, and the lab counts how many show a nickel vein.'; },
 q18: t => [
  'The oxygen supplier claims a mean of 40 litres per canister; the inspectors suspect less.',
  'A seed supplier claims its beans sprout in a mean of 9 days; the crew suspects longer.',
  'The bolt maker claims a mean length of 85 mm; the inspectors check for a difference either way.',
  'The filter supplier claims a mean life of at least 350 hours; the inspectors suspect shorter.',
  'The battery supplier claims a mean charging time of at most 75 minutes; the crew suspects longer.',
  'The cable maker states a mean strength of 220 kilonewtons; the inspectors check for a change either way.'][(t + 10) % 6],
 q19: t => `A test misses a real shortfall with probability β = ${window.Gen.n((20 + t) / 100)}.`,
 q20: t => `H₀: μ = 500 g, σ = 12 g, and 36 packs are weighed. Their mean is x̄ = ${window.Gen.n(Math.round(5000 + 6 * (t + 10) - 40) / 10)} g.`,
});
Object.assign(window.VARIANT_POOL, {
 // qNN: [1, 2, 3, 4, 5],   // optional; default −6..6 without 0
});
})();
