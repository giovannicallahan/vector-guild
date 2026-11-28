/* Data and inference mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Shared helpers. r2 rounds to 2 decimal places; exact4 says whether x needs no more than 4 decimals; ap writes x with
   "…" when n() had to cut it short; list writes numbers separated by commas. */
const r2 = x => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
const exact = (x, dp) => Math.abs(x * Math.pow(10, dp) - Math.round(x * Math.pow(10, dp))) < 1e-7;
const ap = x => exact(x, 4) ? n(x) : n(x) + '…';
/* "= 4.3636…, which is 4.36 to 2 decimal places", or "= 4.25" when x already has at most 2 decimals. */
const to2 = x => exact(x, 2) ? n(x) : `${ap(x)}, which is ${(r2(x)).toFixed(2).replace('-', '−')} to 2 decimal places`;
/* A draw whose value lies within 1e-6 of a rounding tie at 2 decimals. */
const tie2 = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 1e-6;
const list = a => a.map(n).join(', ');
const shuffle = (R, a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = R.int(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
/* 95% critical values of the sample correlation coefficient (OpenStax Introductory Statistics 2e, table in 12.6). */
const RCRIT = { 4: 0.811, 5: 0.754, 6: 0.707, 7: 0.666, 8: 0.632, 9: 0.602, 10: 0.576, 11: 0.555, 12: 0.532, 13: 0.514 };
/* 5% critical values of F (area 0.05 to the right), numerator df 2 and 3, denominator df 6–20, to 2 decimal places. */
const FCRIT = {
 2: { 6: 5.14, 7: 4.74, 8: 4.46, 9: 4.26, 10: 4.1, 11: 3.98, 12: 3.89, 13: 3.81, 14: 3.74, 15: 3.68, 16: 3.63, 17: 3.59, 18: 3.55, 19: 3.52, 20: 3.49 },
 3: { 6: 4.76, 7: 4.35, 8: 4.07, 9: 3.86, 10: 3.71, 11: 3.59, 12: 3.49, 13: 3.41, 14: 3.34, 15: 3.29, 16: 3.24, 17: 3.2, 18: 3.16, 19: 3.13, 20: 3.1 }
};
/* χ² values with 5% of the area to their left (L) and to their right (R), df 3–20. */
const CHIL = { 3: 0.352, 4: 0.711, 5: 1.145, 6: 1.635, 7: 2.167, 8: 2.733, 9: 3.325, 10: 3.94, 11: 4.575, 12: 5.226, 13: 5.892, 14: 6.571, 15: 7.261, 16: 7.962, 17: 8.672, 18: 9.39, 19: 10.117, 20: 10.851 };
const CHIR = { 3: 7.815, 4: 9.488, 5: 11.07, 6: 12.592, 7: 14.067, 8: 15.507, 9: 16.919, 10: 18.307, 11: 19.675, 12: 21.026, 13: 22.362, 14: 23.685, 15: 24.996, 16: 26.296, 17: 27.587, 18: 28.869, 19: 30.144, 20: 31.41 };
/* Area to the left of z under the standard normal curve (Taylor series of the error function), and its 4-place table value. */
const Phi = z => { let sum = z, term = z; for (let k = 1; k < 200; k++) { term *= -z * z / 2 / k; const add = term / (2 * k + 1); sum += add; if (Math.abs(add) < 1e-17) break; } return 0.5 + sum / Math.sqrt(2 * Math.PI); };
const Phi4 = z => Math.round(Phi(z) * 1e4) / 1e4;
/* q33, q34: the farm's two kinds of scatter plot, by the sign of r. */
const pair = r => r > 0 ? 'hours of sunlight in a day and that day’s power output' : 'days since the panels were last cleaned and the power output';

/* q31: the least-squares line through five days, x = c … c + 4 hours of sunlight, y the output in kWh. */
const line5 = ({ c, y }) => { const xs = [0, 1, 2, 3, 4].map(i => c + i), xb = c + 2, sy = y.reduce((s, v) => s + v, 0), yb = sy / 5,
 dx = xs.map(x => x - xb), dy = y.map(v => v - yb), pr = dx.map((d, i) => d * dy[i]), sxy = pr.reduce((s, v) => s + v, 0),
 b = Math.round(sxy / 10 * 1e6) / 1e6, a = Math.round((yb - b * xb) * 1e6) / 1e6; return { xs, xb, sy, yb, dx, dy, pr, sxy, b, a }; };
/* q34: residuals in tenths of a kWh, their standard deviation about the line to 2 decimals, and the outliers beyond 2s. */
const resid = ({ n: k, res }) => { const v = res.map(x => x / 10), sse = res.reduce((s, x) => s + x * x, 0) / 100, s = r2(Math.sqrt(sse / (k - 2))), two = r2(2 * s),
 out = v.filter(x => Math.abs(x) > two); return { v, sse, s, two, out }; };
/* q35: group means, grand mean and the two sums of squares for equal-sized groups. */
const anova = g => { const m = g[0].length, means = g.map(a => a.reduce((s, x) => s + x, 0) / m), all = g.flat(), total = all.reduce((s, x) => s + x, 0), grand = total / all.length,
 parts = means.map(x => m * (x - grand) * (x - grand)), ssb = parts.reduce((s, x) => s + x, 0), within = g.map((a, j) => a.map(x => (x - means[j]) * (x - means[j]))),
 ssw = within.flat().reduce((s, x) => s + x, 0); return { m, means, total, grand, parts, ssb, within, ssw, count: all.length }; };
/* q36: contexts. Each is [groups, units]. */
const F_CTX = [['seed varieties', 'plots'], ['fertiliser mixes', 'beds'], ['drill bit designs', 'test holes'], ['cleaning schedules', 'panels']];
/* q37: the two stories, by tail. */
const V_CTX = {
 R: { unit: 'mm', who: 'The cable supplier says the lengths of its cut cables have a standard deviation of', worry: 'The council suspects they vary more than that.', what: 'cables', word: '“Vary more” makes the test right-tailed' },
 L: { unit: 'g', who: 'The old filling machine put seed into packets with a standard deviation of', worry: 'The council wants to know whether the new machine is more consistent, with less spread.', what: 'packets from the new machine', word: '“Less spread” makes the test left-tailed' }
};
/* q38: level → α as written in the text. */
const ALPHA = { 90: '0.10', 95: '0.05', 99: '0.01' };
/* q39: the nine tests, as printed in the prompt, and each story kind's test number and df. */
const TESTS = 'Tests: 1 z test for one mean (σ known); 2 t test for one mean (σ unknown); 3 z test for one proportion; 4 two-sample t test for two independent means; 5 z test for two proportions, with the pooled proportion; 6 matched-pairs t test on the differences; 7 χ² goodness-of-fit test; 8 χ² test of independence; 9 one-way ANOVA F test. A χ² test with only two categories, or on a 2 × 2 table, gives the same verdict as the z test for one or two proportions: for such data, choose the z test. ANOVA is for three or more groups.';
const story39 = p => {
 switch (p.kind) {
  case 1: return { text: `The drill rig’s hole depths have a known population standard deviation of ${n(p.s)} cm. The council measures ${n(p.n)} new holes to test whether the mean depth is still ${n(p.mu)} cm.`, data: 1, test: 1, df: 0,
   why: `The outcome, a depth, is a measurement of one group compared with a claimed mean, and σ is known, so the test is 1, the z test for one mean. A z statistic has no degrees of freedom: enter 0.` };
  case 2: return { text: `The council measures the lifetimes of ${n(p.n)} solar cells from a new batch. Nobody knows the population standard deviation, so it must be estimated from the sample. The council tests whether the mean lifetime is still ${n(p.mu)} months.`, data: 1, test: 2, df: p.n - 1,
   why: `The outcome, a lifetime, is a measurement of one group compared with a claimed mean, and σ is unknown, so the test is 2, the t test for one mean, with df = ${n(p.n)} − 1 = ${n(p.n - 1)}.` };
  case 3: return { text: `The clinic asks ${n(p.n)} settlers whether they sleep well, and tests whether the share who say yes is still ${n(p.pc)}%.`, data: 2, test: 3, df: 0,
   why: `Each answer is a category, yes or no, counted in one group and compared with a claimed share, so the test is 3, the z test for one proportion. A z statistic has no degrees of freedom: enter 0.` };
  case 4: return { text: `The farm grows a new bean variety on ${n(p.n1)} plots and the old variety on ${n(p.n2)} other plots, weighs the yield of every plot, and tests whether the two mean yields differ. Neither population standard deviation is known, and the degrees-of-freedom formula for two independent samples gives df = ${n(p.df)}.`, data: 1, test: 4, df: p.df,
   why: `Yield is a measurement, and two independent groups of plots are compared, so the test is 4, the two-sample t test. Its df comes from the formula, which the story gives: ${n(p.df)}.` };
  case 5: return { text: `The farm plants ${n(p.n1)} seeds of the old variety and ${n(p.n2)} of the new one, counts how many of each sprout, and tests whether the two sprouting shares differ.`, data: 2, test: 5, df: 0,
   why: `Sprouting or not is a counted category, and two independent groups are compared, so the test is 5, the z test for two proportions. A z statistic has no degrees of freedom: enter 0.` };
  case 6: return { text: `The same ${n(p.n)} workers are timed on a repair task before and after a training course, and the council tests whether the mean change in their times is zero.`, data: 1, test: 6, df: p.n - 1,
   why: `The times are measurements, and each worker is measured twice, so the two sets are pairs. The test is 6, the matched-pairs t test on the ${n(p.n)} differences, with df = ${n(p.n)} − 1 = ${n(p.n - 1)}.` };
  case 7: return { text: `The canteen records which of its ${n(p.c)} meals each of ${n(p.N)} settlers chooses, and tests whether the choices follow the shares the cook planned.`, data: 2, test: 7, df: p.c - 1,
   why: `The meal chosen is a category, counted for one variable and compared with claimed shares, so the test is 7, the χ² goodness-of-fit test, with df = ${n(p.c)} − 1 = ${n(p.c - 1)}.` };
  case 8: return { text: `The council sorts ${n(p.N)} settlers by their dome (${n(p.r)} domes) and by their favourite of ${n(p.c)} sports, and tests whether the favourite sport depends on the dome.`, data: 2, test: 8, df: (p.r - 1) * (p.c - 1),
   why: `Dome and sport are two categorical variables counted in one table with ${n(p.r)} rows and ${n(p.c)} columns, so the test is 8, the χ² test of independence, with df = (${n(p.r)} − 1) × (${n(p.c)} − 1) = ${n((p.r - 1) * (p.c - 1))}.` };
  default: return { text: `The farm grows ${n(p.k)} fertiliser mixes on ${n(p.N)} plots in all and tests whether the mean yields of the mixes are all equal.`, data: 1, test: 9, df: p.k - 1,
   why: `Yield is a measurement, and ${n(p.k)} group means are compared at once, so the test is 9, the one-way ANOVA F test. Its df between groups is ${n(p.k)} − 1 = ${n(p.k - 1)}.` };
 }
};
/* q40: the stories. sigmas lists [σ, n] pairs whose standard error σ ÷ √n is 0.5, 1, 2 or 2.5. */
const Z_CTX = [
 { claim: 'The supplier of drill bits claims a mean life of', unit: 'hours', unit1: 'hours', of: 'bits', stat: 'mean life', mu: [100, 160], sig: [[10, 25], [8, 16], [12, 36], [10, 100], [4, 16], [6, 36]] },
 { claim: 'The assay lab’s standard says the ore from the east seam has a mean grade of', unit: 'g/t', unit1: 'g/t', of: 'ore samples', stat: 'mean grade', mu: [40, 70], sig: [[5, 25], [4, 16], [6, 36], [3, 36], [7, 49], [10, 25]] },
 { claim: 'The seed catalogue claims the tomatoes of its new variety weigh, on average,', unit: 'g', unit1: 'grams', of: 'tomatoes', stat: 'mean weight', mu: [120, 200], sig: [[20, 16], [15, 36], [10, 16], [20, 64], [25, 25], [16, 64]] }
];
const TAILS = { 1: ['less than', 'left-tailed'], 2: ['more than', 'right-tailed'], 3: ['different from', 'two-tailed'] };
const ztest = p => { const se = p.sigma / Math.sqrt(p.n), d = p.d10 / 10, xb = Math.round((p.mu + d) * 10) / 10, z = Math.round(d / se * 100) / 100, az = Math.abs(z), area = Phi4(az),
 tail1 = Math.round((1 - area) * 1e4) / 1e4, pv = p.tail === 3 ? Math.round(2 * tail1 * 1e4) / 1e4 : tail1, dec = pv < p.alpha ? 1 : 0; return { se, d, xb, z, az, area, tail1, pv, dec }; };

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Five days at x = c … c + 4 hours, so Σ(x − x̄)² is always 10 and b has at most one decimal. The outputs add to a
    multiple of 5, so ȳ is whole and a has at most one decimal too. Not the worked example (2 to 6 hours). */
 q31: {
  canonical: { c: 5, y: [20, 22, 27, 28, 33] },
  draw: R => { let p, L; do { const c = R.int(3, 8), b0 = R.int(2, 5), a0 = R.int(0, 10), y = [0, 1, 2, 3, 4].map(i => a0 + b0 * (c + i) + R.int(-2, 2));
   y[2] += (5 - y.reduce((s, v) => s + v, 0) % 5) % 5; p = { c, y }; L = line5(p); } while (L.b <= 0 || L.b === 1 || L.a === 0); return p; },
  build: p => { const L = line5(p); return {
   prompt: `The solar farm logged five days. Hours of sunlight x: ${list(L.xs)}. Power output y in kilowatt-hours (kWh): ${list(p.y)}. Find the least-squares line ŷ = a + bx. Enter the slope b, then the intercept a. Both come out exact, with at most one decimal place.`,
   answer: [L.b, L.a],
   hints: ['First find the mean hours x̄ and the mean output ȳ. Then list each day’s x − x̄ and y − ȳ.', 'The slope is b = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)², and the intercept is a = ȳ − b × x̄, because the line passes through the point (x̄, ȳ).'],
   solution: `x̄ = ${n(5 * L.xb)} ÷ 5 = ${n(L.xb)} and ȳ = ${n(L.sy)} ÷ 5 = ${n(L.yb)}. The deviations x − x̄ are ${list(L.dx)}, and y − ȳ are ${list(L.dy)}. Their products are ${list(L.pr)}, so Σ(x − x̄)(y − ȳ) = ${n(L.sxy)}, and Σ(x − x̄)² = 4 + 1 + 0 + 1 + 4 = 10. The slope is b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} kWh per hour of sunlight. The intercept is a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.yb)} − ${n(L.b * L.xb)} = ${n(L.a)}. The line is ŷ = ${n(L.a)} + ${n(L.b)}x.`,
   guidance: [
    { prompt: 'Add the hours and the outputs, and divide each total by 5. What are the mean hours x̄ and the mean output ȳ?', answer: [L.xb, L.yb], explanation: `x̄ = (${L.xs.map(n).join(' + ')}) ÷ 5 = ${n(5 * L.xb)} ÷ 5 = ${n(L.xb)} and ȳ = (${p.y.map(n).join(' + ')}) ÷ 5 = ${n(L.sy)} ÷ 5 = ${n(L.yb)}.` },
    { prompt: `The deviations x − x̄ are ${list(L.dx)}, and y − ȳ are ${list(L.dy)}. What are Σ(x − x̄)(y − ȳ) and Σ(x − x̄)²?`, answer: [L.sxy, 10], explanation: `Multiply the deviations day by day: ${list(L.pr)}. They add to ${n(L.sxy)}. The squares of x − x̄ are 4, 1, 0, 1, 4, which add to 10.` },
    { prompt: 'Divide to get the slope b, then use a = ȳ − b × x̄. What are b and a?', answer: [L.b, L.a], explanation: `b = ${n(L.sxy)} ÷ 10 = ${n(L.b)} and a = ${n(L.yb)} − ${n(L.b)} × ${n(L.xb)} = ${n(L.a)}, so ŷ = ${n(L.a)} + ${n(L.b)}x.` }
   ] }; }
 },
 /* ŷ = a + bx with a and b to one decimal and whole hours, so every prediction and residual has at most one decimal.
    The new day is inside or outside the fitted range half the time each, never on its edge, and at least 2 hours.
    The recorded day has a residual that is never 0. Not the worked example (ŷ = 2 + 1.5x). */
 q32: {
  canonical: { a: 4.5, b: 2.8, lo: 3, hi: 10, x1: 12, x2: 7, y2: 25 },
  draw: R => { const lo = R.int(3, 5), hi = lo + R.int(5, 8), a = R.int(5, 95) / 10, b = R.except(15, 45, [20, 30, 40]) / 10;
   const x1 = R.bool() ? R.int(lo + 1, hi - 1) : (R.bool() ? hi + R.int(1, 4) : R.int(2, lo - 1));
   let x2 = R.int(lo, hi); if (x2 === x1) x2 = x2 === hi ? lo : x2 + 1;
   const y2 = Math.round((a + b * x2 + R.nz(-30, 30) / 10) * 10) / 10; return { a, b, lo, hi, x1, x2, y2 }; },
  build: ({ a, b, lo, hi, x1, x2, y2 }) => { const f = x => Math.round((a + b * x) * 10) / 10, y1 = f(x1), yh = f(x2), res = Math.round((y2 - yh) * 10) / 10, inside = x1 >= lo && x1 <= hi ? 1 : 0; return {
   prompt: `The solar farm’s least-squares line is ŷ = ${n(a)} + ${n(b)}x, where x is the hours of sunlight in a day and ŷ is the predicted power output in kWh. It was fitted to days with ${n(lo)} to ${n(hi)} hours of sunlight. Enter the predicted output for a new day with ${n(x1)} hours of sunlight, then the residual for a recorded day that had ${n(x2)} hours of sunlight and produced ${n(y2)} kWh, then 1 if the prediction at ${n(x1)} hours is an interpolation (inside the fitted range) or 0 if it is an extrapolation (outside it).`,
   answer: [y1, res, inside],
   hints: ['To predict, put the hours into the line: ŷ = a + b × x.', 'A residual is the observed y minus the predicted ŷ for the same x. A prediction is an interpolation when its x lies between the smallest and the largest x in the data, and an extrapolation when it lies outside.'],
   solution: `ŷ = ${n(a)} + ${n(b)} × ${n(x1)} = ${n(a)} + ${n(b * x1)} = ${n(y1)} kWh. For the recorded day, ŷ = ${n(a)} + ${n(b)} × ${n(x2)} = ${n(a)} + ${n(b * x2)} = ${n(yh)} kWh, so the residual is ${n(y2)} − ${n(yh)} = ${n(res)} kWh: the day produced ${res > 0 ? 'more' : 'less'} than the line predicts. ${inside ? `${n(x1)} hours lies inside the fitted range from ${n(lo)} to ${n(hi)} hours, so the prediction is an interpolation: enter 1.` : `${n(x1)} hours lies outside the fitted range from ${n(lo)} to ${n(hi)} hours, so the prediction is an extrapolation: enter 0. Nobody has checked the line there, so trust it less.`}`,
   guidance: [
    { prompt: `Put x = ${n(x1)} into ŷ = ${n(a)} + ${n(b)}x. What output does the line predict?`, answer: [y1], explanation: `${n(b)} × ${n(x1)} = ${n(b * x1)}, and ${n(a)} + ${n(b * x1)} = ${n(y1)} kWh.` },
    { prompt: `The recorded day had x = ${n(x2)} and y = ${n(y2)}. What is the predicted ŷ for that day, and the residual y − ŷ?`, answer: [yh, res], explanation: `ŷ = ${n(a)} + ${n(b)} × ${n(x2)} = ${n(yh)}, and the residual is observed minus predicted: ${n(y2)} − ${n(yh)} = ${n(res)}.` },
    { prompt: `The line was fitted to days with ${n(lo)} to ${n(hi)} hours of sunlight. Enter 1 if ${n(x1)} hours is inside that range (interpolation), 0 if it is outside (extrapolation).`, answer: [inside], explanation: inside ? `${n(x1)} is between ${n(lo)} and ${n(hi)}, so this is an interpolation.` : `${n(x1)} is not between ${n(lo)} and ${n(hi)}, so this is an extrapolation.` }
   ] }; }
 },
 /* r = r100 ÷ 100, |r| from 0.30 to 0.98. r100 never ends in 5, so 100r² never ends in exactly 5 in its second decimal
    and rounding to 1 decimal has no tie. Not the worked example's r = 0.6. */
 q33: {
  canonical: { r100: -91 },
  draw: R => { let v; do { v = R.int(30, 98); } while (v % 10 === 5 || v === 60); return { r100: R.bool() ? v : -v }; },
  build: ({ r100 }) => { const r = r100 / 100, sq = r100 * r100 / 10000, pc = r100 * r100 / 100, p1 = Math.round(pc * 10) / 10, rest = Math.round((100 - pc) * 100) / 100, u1 = Math.round(rest * 10) / 10; return {
   prompt: `The farm made a scatter plot of the ${pair(r)} over many days, and found the correlation coefficient r = ${n(r)}. Through these points it has fitted the best-fit straight line, the one whose squared vertical gaps from the points add up to as little as possible. Enter the percentage of the variation in power output that the line explains, then the percentage it leaves unexplained, both rounded to 1 decimal place.`,
   answer: [p1, u1],
   hints: ['Square r. The square of a negative number is positive.', 'Multiply r² by 100 to turn it into a percentage. The unexplained share is 100% minus the explained share.'],
   solution: `r² = ${par(r)}² = ${n(sq)}, which is ${n(pc)}% of the variation, or ${n(p1)}% to 1 decimal place. The rest, 100 − ${n(pc)} = ${n(rest)}%, or ${n(u1)}% to 1 decimal place, is variation the line does not explain.`,
   guidance: [
    { prompt: `What is r² for r = ${n(r)}? Give it in full.`, answer: [sq], explanation: `${par(r)} × ${par(r)} = ${n(sq)}. Squaring removes the minus sign, if there is one.` },
    { prompt: 'Multiply r² by 100 and round to 1 decimal place. What percentage of the variation does the line explain?', answer: [p1], explanation: `${n(sq)} × 100 = ${n(pc)}%, which is ${n(p1)}% to 1 decimal place.` },
    { prompt: 'What percentage of the variation is left unexplained, rounded to 1 decimal place?', answer: [u1], explanation: `100 − ${n(pc)} = ${n(rest)}%, which is ${n(u1)}% to 1 decimal place.` }
   ] }; }
 },
 /* n points (7 to 14, so df 5 to 12 lie in the printed table rows 4 to 13) with residuals in tenths that add to 0,
    as least-squares residuals do. s is printed to 2 decimals and 2s is worked from that printed s; no residual lies
    within 0.15 of 2s, and |r| is never within 0.02 of the critical value, so neither answer turns on a rounding.
    Not the worked example (12 points, r = −0.81). */
 q34: {
  canonical: { n: 10, r100: 71, res: [12, -8, 5, -16, 46, -11, 3, -20, -4, -7] },
  draw: R => { let p; for (;;) { const k = R.int(7, 14), res = []; for (let i = 0; i < k - 1; i++) res.push(R.int(-22, 22));
    if (R.bool()) res[R.int(0, k - 2)] = (R.bool() ? 1 : -1) * R.int(35, 60);
    const last = -res.reduce((s, x) => s + x, 0); if (Math.abs(last) > 30) continue; res.push(last);
    let r100 = R.int(40, 95); if (R.bool()) r100 = -r100;
    p = { n: k, r100, res }; const S = resid(p);
    if (S.v.some(x => Math.abs(Math.abs(x) - S.two) < 0.15) || Math.abs(Math.abs(r100) / 100 - RCRIT[k - 2]) < 0.02) continue;
    if (k === 12 && r100 === -81) continue; return p; } },
  build: p => { const S = resid(p), r = p.r100 / 100, df = p.n - 2, crit = RCRIT[df], sig = Math.abs(r) > crit ? 1 : 0, cnt = S.out.length; return {
   prompt: `The farm fitted a least-squares line to n = ${n(p.n)} days, comparing the ${pair(r)}, and found r = ${n(r)}. The ${n(p.n)} residuals, in kWh, are ${list(S.v)}. Their standard deviation about the line is s = ${n(S.s)} kWh. Table of 95% critical values of r: ${Object.keys(RCRIT).map(k => `df ${k}, ${n(RCRIT[k])}`).join('; ')}. Enter the degrees of freedom for testing r, then 1 if r is significant at the 5% level or 0 if not, then the number of days that are outliers by the two-standard-deviation rule (a residual more than 2s from 0, above or below).`,
   answer: [df, sig, cnt],
   hints: ['For testing r, the degrees of freedom are the number of points minus 2. Read the critical value from that row of the table.', 'r is significant when it is above the critical value or below its negative. A point is an outlier when its residual is more than 2s above or below 0.'],
   solution: `df = ${n(p.n)} − 2 = ${n(df)}, and the table gives the critical value ${n(crit)} for df ${n(df)}. ${sig ? `r = ${n(r)} is ${r > 0 ? `above ${n(crit)}` : `below −${n(crit)}`}, so r is significant: enter 1. A linear relationship this strong would rarely happen by chance.` : `r = ${n(r)} lies between −${n(crit)} and ${n(crit)}, so r is not significant: enter 0. A correlation this size could easily happen by chance with ${n(p.n)} points.`} For outliers, 2s = 2 × ${n(S.s)} = ${n(S.two)} kWh. ${cnt === 0 ? `No residual is further than ${n(S.two)} from 0, so no day is an outlier: enter 0.` : cnt === 1 ? `Only the residual ${n(S.out[0])} is further than ${n(S.two)} from 0, so 1 day is an outlier.` : `The residuals ${S.out.map(n).join(' and ')} are further than ${n(S.two)} from 0, so ${n(cnt)} days are outliers.`}`,
   guidance: [
    { prompt: 'How many degrees of freedom does the test of r have, and what critical value does the table give for them?', answer: [df, crit], explanation: `df = ${n(p.n)} − 2 = ${n(df)}, and the row for df ${n(df)} reads ${n(crit)}.` },
    { prompt: `Compare r = ${n(r)} with ${n(crit)} and −${n(crit)}. Enter 1 if r is significant, 0 if not.`, answer: [sig], explanation: sig ? `r is ${r > 0 ? `above ${n(crit)}` : `below −${n(crit)}`}, so it is significant.` : `r lies between −${n(crit)} and ${n(crit)}, so it is not significant.` },
    { prompt: 'What is 2s, and how many residuals are further than 2s from 0?', answer: [S.two, cnt], explanation: `2 × ${n(S.s)} = ${n(S.two)}. ${cnt === 0 ? 'No residual is beyond it in either direction.' : `Beyond it in either direction: ${S.out.map(n).join(' and ')}.`}` }
   ] }; }
 },
 /* Three groups of m = 3 or 4 plots: whole group means around a whole grand mean (so the grand mean is whole), plus
    deviations from fixed zero-sum patterns, so both sums of squares are whole numbers. Yields from about 5 kg up,
    never the worked example's small groups. */
 q35: {
  canonical: { g: [[12, 14, 15, 11], [17, 15, 19, 17], [10, 13, 11, 14]] },
  draw: R => { const m = R.int(3, 4), pats = m === 3 ? [[-1, 0, 1], [-2, 0, 2], [-2, 1, 1], [-1, -1, 2], [-3, 1, 2], [-3, 0, 3], [-2, -1, 3]] : [[-1, -1, 1, 1], [-2, 0, 0, 2], [-3, 1, 1, 1], [-2, -1, 1, 2], [-3, -1, 1, 3], [-2, -2, 1, 3], [-1, 0, 0, 1], [-4, 1, 1, 2]];
   let d; do { d = [R.int(-5, 5), R.int(-5, 5)]; d.push(-d[0] - d[1]); } while (Math.abs(d[2]) > 6 || d.every(x => x === 0));
   const grand = R.int(12, 30); return { g: d.map(x => { const sg = R.bool() ? 1 : -1, pat = R.pick(pats).map(v => sg * v); return shuffle(R, pat).map(v => grand + x + v); }) }; },
  build: ({ g }) => { const A = anova(g), names = ['A', 'B', 'C']; return {
   prompt: `The council is choosing between three seed varieties, A, B and C. Each was grown on ${n(A.m)} plots, and the yields in kilograms were: ${g.map((a, j) => `${names[j]} ${list(a)}`).join('; ')}. Enter the sum of squares between groups, then the sum of squares within groups.`,
   answer: [A.ssb, A.ssw],
   hints: ['Find each group’s mean and the grand mean of all the readings. Between groups: for each group, square its mean minus the grand mean and multiply by the group’s size, then add.', 'Within groups: square each reading’s distance from its own group’s mean, then add them all.'],
   solution: `The group means are ${list(A.means)}, and the grand mean of all ${n(A.count)} yields is ${n(A.total)} ÷ ${n(A.count)} = ${n(A.grand)}. Between groups: ${A.means.map(x => `${n(A.m)} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}. Within groups: ${A.within.map((w, j) => `${names[j]} gives ${w.map(n).join(' + ')} = ${n(w.reduce((s, x) => s + x, 0))}`).join(', ')}, so ${n(A.ssw)} in all. Check: the total sum of squares about the grand mean is ${n(A.ssb)} + ${n(A.ssw)} = ${n(A.ssb + A.ssw)}.`,
   guidance: [
    { prompt: 'What are the means of groups A, B and C, and the grand mean of all the yields?', answer: [...A.means, A.grand], explanation: `${g.map((a, j) => `${names[j]}: ${n(a.reduce((s, x) => s + x, 0))} ÷ ${n(A.m)} = ${n(A.means[j])}`).join('; ')}. All ${n(A.count)} yields add to ${n(A.total)}, and ${n(A.total)} ÷ ${n(A.count)} = ${n(A.grand)}.` },
    { prompt: 'For each group, multiply its size by (group mean − grand mean)², and add. What is the sum of squares between groups?', answer: [A.ssb], explanation: `${A.means.map(x => `${n(A.m)} × (${n(x)} − ${n(A.grand)})²`).join(' + ')} = ${A.parts.map(n).join(' + ')} = ${n(A.ssb)}.` },
    { prompt: 'Square each yield’s distance from its own group’s mean, and add them all. What is the sum of squares within groups?', answer: [A.ssw], explanation: `${A.within.map((w, j) => `${names[j]}: ${w.map(n).join(' + ')}`).join('; ')}. Together they make ${n(A.ssw)}.` }
   ] }; }
 },
 /* k = 3 or 4 groups, df within 9 to 16, whole mean squares (so the sums of squares are multiples of their df and F
    needs one rounding only). F is never on a rounding tie and never within 0.1 of the critical value. Three table
    columns are printed, starting at df within − off. Not the worked example (4 groups, 20 readings, 60 and 80). */
 q36: {
  canonical: { ctx: 0, k: 3, n: 15, msb: 48, msw: 11, off: 1 },
  draw: R => { let p; for (;;) { const k = R.int(3, 4), dw = R.int(9, 16); p = { ctx: R.int(0, F_CTX.length - 1), k, n: dw + k, msb: 0, msw: 0, off: R.int(0, 2) }; p.msw = R.int(4, 25); p.msb = R.int(Math.max(4, p.msw), 7 * p.msw);
    const F = p.msb / p.msw; if (tie2(F) || F < 0.5 || F > 12 || Math.abs(r2(F) - FCRIT[k - 1][dw]) < 0.1) continue; return p; } },
  build: ({ ctx, k, n: N, msb, msw, off }) => { const [grp, unit] = F_CTX[ctx], db = k - 1, dw = N - k, ssb = msb * db, ssw = msw * dw, F = msb / msw, F2 = r2(F), crit = FCRIT[db][dw], dec = F2 > crit ? 1 : 0,
   cols = [0, 1, 2].map(i => dw - off + i), table = [2, 3].flatMap(a => cols.map(b => `F(${a}, ${b}) = ${n(FCRIT[a][b])}`)).join(', '); return {
   prompt: `The council compared ${n(k)} ${grp} on ${n(N)} ${unit} in all. The clerk’s ANOVA gives a sum of squares between groups of ${n(ssb)} and a sum of squares within groups of ${n(ssw)}. Critical values of F with 5% of the area to their right, written F(df between, df within): ${table}. Enter the degrees of freedom between groups, then within groups, then the F ratio to 2 decimal places, then 1 if the council should reject the claim that all the means are equal at the 5% level, or 0 if not.`,
   answer: [db, dw, F2, dec],
   hints: ['Between groups the degrees of freedom are the number of groups minus 1. Within groups they are the number of readings minus the number of groups.', 'A mean square is a sum of squares divided by its degrees of freedom, and F is the mean square between groups divided by the mean square within. Reject when F is larger than the critical value for your two df.'],
   solution: `df between = ${n(k)} − 1 = ${n(db)} and df within = ${n(N)} − ${n(k)} = ${n(dw)}. Mean square between = ${n(ssb)} ÷ ${n(db)} = ${n(msb)} and mean square within = ${n(ssw)} ÷ ${n(dw)} = ${n(msw)}, so F = ${n(msb)} ÷ ${n(msw)} = ${to2(F)}. The critical value F(${n(db)}, ${n(dw)}) is ${n(crit)}. ${dec ? `${n(F2)} is larger, so the p-value is below 0.05: reject the claim that the means are all equal, and enter 1. At least one of the ${grp} has a different mean.` : `${n(F2)} is not larger, so the p-value is above 0.05: do not reject the claim that the means are all equal, and enter 0. The differences could be chance.`}`,
   guidance: [
    { prompt: 'What are the degrees of freedom between groups and within groups?', answer: [db, dw], explanation: `Between: ${n(k)} groups − 1 = ${n(db)}. Within: ${n(N)} readings − ${n(k)} groups = ${n(dw)}.` },
    { prompt: 'Divide each sum of squares by its degrees of freedom. What are the mean square between, the mean square within, and F to 2 decimal places?', answer: [msb, msw, F2], explanation: `${n(ssb)} ÷ ${n(db)} = ${n(msb)} and ${n(ssw)} ÷ ${n(dw)} = ${n(msw)}. F = ${n(msb)} ÷ ${n(msw)} = ${to2(F)}.` },
    { prompt: `The critical value for ${n(db)} and ${n(dw)} degrees of freedom is ${n(crit)}. Enter 1 to reject the claim that all the means are equal, 0 not to.`, answer: [dec], explanation: dec ? `${n(F2)} is larger than ${n(crit)}, so reject.` : `${n(F2)} is not larger than ${n(crit)}, so do not reject.` }
   ] }; }
 },
 /* Right-tailed (more spread, cables in mm) or left-tailed (less spread, packets in g). n 8 to 19, so df 7 to 18;
    three table rows starting at df − off. χ² is never on a rounding tie and never within 0.3 of the critical value.
    s and σ have one decimal; s is 1.05 to 1.7 times σ (right tail) or 0.45 to 0.95 times σ (left tail). Not the worked example (left-tailed, n 11, s 1.4, σ 2). */
 q37: {
  canonical: { tail: 'R', n: 15, s10: 32, sig10: 25, off: 1 },
  draw: R => { let p; for (;;) { const tail = R.bool() ? 'R' : 'L', k = R.int(8, 19), sig10 = R.int(15, 60), s10 = Math.max(5, Math.round(sig10 * (tail === 'R' ? R.int(105, 170) : R.int(45, 95)) / 100)); if (s10 === sig10) continue;
    p = { tail, n: k, s10, sig10, off: R.int(0, 2) }; const x = (k - 1) * s10 * s10 / (sig10 * sig10), crit = tail === 'R' ? CHIR[k - 1] : CHIL[k - 1];
    if (tie2(x) || Math.abs(x - crit) < 0.3) continue; return p; } },
  build: ({ tail, n: N, s10, sig10, off }) => { const C = V_CTX[tail], s = s10 / 10, sg = sig10 / 10, df = N - 1, s2 = s10 * s10 / 100, g2 = sig10 * sig10 / 100, top = df * s2, x = df * s10 * s10 / (sig10 * sig10), x2 = r2(x),
   crit = tail === 'R' ? CHIR[df] : CHIL[df], dec = tail === 'R' ? (x2 > crit ? 1 : 0) : (x2 < crit ? 1 : 0), rows = [0, 1, 2].map(i => df - off + i).map(d => `df ${d}, ${n(CHIL[d])} and ${n(CHIR[d])}`).join('; '); return {
   prompt: `${C.who} σ = ${n(sg)} ${C.unit}. ${C.worry} A random sample of ${n(N)} ${C.what} has sample standard deviation s = ${n(s)} ${C.unit}; assume the population is normal. Test at the 5% level. Chi-square table, the value with 5% of the area to its left and the value with 5% to its right: ${rows}. Enter the degrees of freedom, then the test statistic χ² to 2 decimal places, then 1 to reject H₀: σ = ${n(sg)} ${C.unit}, or 0 not to.`,
   answer: [df, x2, dec],
   hints: ['The degrees of freedom are n − 1. The statistic compares the sample variance with the claimed variance: χ² = (n − 1)s² ÷ σ².', 'A test for more spread is right-tailed: reject when χ² is above the value with 5% to its right. A test for less spread is left-tailed: reject when χ² is below the value with 5% to its left.'],
   solution: `df = ${n(N)} − 1 = ${n(df)}. χ² = ${n(df)} × ${n(s)}² ÷ ${n(sg)}² = ${n(df)} × ${n(s2)} ÷ ${n(g2)} = ${n(top)} ÷ ${n(g2)} = ${to2(x)}. ${C.word}, and the table value for df ${n(df)} is ${n(crit)}. ${dec ? `${n(x2)} is ${tail === 'R' ? 'above' : 'below'} it, so reject H₀: enter 1. The spread really is ${tail === 'R' ? 'larger' : 'smaller'} than σ = ${n(sg)} ${C.unit}.` : `${n(x2)} is not ${tail === 'R' ? 'above' : 'below'} it, so do not reject H₀: enter 0. The sample’s spread is within what chance easily explains.`}`,
   guidance: [
    { prompt: 'How many degrees of freedom does the test have?', answer: [df], explanation: `df = n − 1 = ${n(N)} − 1 = ${n(df)}.` },
    { prompt: 'What is χ² = (n − 1)s² ÷ σ², to 2 decimal places?', answer: [x2], explanation: `${n(s)}² = ${n(s2)} and ${n(sg)}² = ${n(g2)}, so χ² = ${n(df)} × ${n(s2)} ÷ ${n(g2)} = ${to2(x)}.` },
    { prompt: 'Which table value fits the tail of this test? Enter that value, then 1 to reject H₀ or 0 not to.', answer: [crit, dec], explanation: `${C.word}, so the value is ${n(crit)}. ${dec ? `χ² = ${n(x2)} is beyond it: reject.` : `χ² = ${n(x2)} is not beyond it: do not reject.`}` }
   ] }; }
 },
 /* x̄ with one decimal and a margin with two, so both bounds have at most two decimals. Each of the three claims,
    with one decimal, lies inside or outside the interval at random, at least 0.1 from a bound. Not the worked
    example (90%, 12.4 and 0.8). */
 q38: {
  canonical: { lvl: 95, xb10: 486, e100: 235, m10: [450, 500, 512] },
  draw: R => { const lvl = R.pick([90, 95, 99]), xb10 = R.int(200, 900), e100 = R.int(100, 600), lo = xb10 * 10 - e100, hi = xb10 * 10 + e100, m10 = [];
   while (m10.length < 3) { let v; const r = R.int(0, 2);
    if (r === 0) v = R.int(Math.ceil((lo + 10) / 10), Math.floor((hi - 10) / 10)); else if (r === 1) v = Math.floor((lo - 10) / 10) - R.int(0, 30); else v = Math.ceil((hi + 10) / 10) + R.int(0, 30);
    if (!m10.includes(v)) m10.push(v); }
   return { lvl, xb10, e100, m10 }; },
  build: ({ lvl, xb10, e100, m10 }) => { const xb = xb10 / 10, E = e100 / 100, L = (xb10 * 10 - e100) / 100, U = (xb10 * 10 + e100) / 100, m = m10.map(v => v / 10), d = m.map(v => v < L || v > U ? 1 : 0), al = ALPHA[lvl];
   const say = (v, i) => d[i] ? `${n(v)} lies ${v < L ? `below ${n(L)}` : `above ${n(U)}`}, outside the interval: reject (1).` : `${n(v)} lies inside the interval: do not reject (0).`; return {
   prompt: `The council reviews the assay lab’s ${n(lvl)}% confidence interval for the mean gold grade of a new seam. It comes from a sample mean of x̄ = ${n(xb)} grams per tonne (g/t) and a margin of error of ${n(E)} g/t, with σ known. Three prospectors claim mean grades of ${n(m[0])}, ${n(m[1])} and ${n(m[2])} g/t. Enter the lower bound and the upper bound of the interval, then, for each claim in that order, 1 if a two-tailed test at α = ${al} rejects it or 0 if not.`,
   answer: [L, U, ...d],
   hints: ['The interval runs from x̄ minus the margin of error to x̄ plus the margin of error.', 'A two-tailed test at α = 1 − (confidence level) rejects a claimed mean exactly when the claim lies outside the interval.'],
   solution: `Lower bound ${n(xb)} − ${n(E)} = ${n(L)} and upper bound ${n(xb)} + ${n(E)} = ${n(U)}. A two-tailed test at α = ${al} matches the ${n(lvl)}% interval. ${m.map(say).join(' ')}`,
   guidance: [
    { prompt: 'What are the lower and upper bounds of the interval?', answer: [L, U], explanation: `${n(xb)} − ${n(E)} = ${n(L)} and ${n(xb)} + ${n(E)} = ${n(U)}.` },
    { prompt: `Which confidence level matches a two-tailed test at α = ${al}? Enter it as a percentage.`, answer: [lvl], explanation: `The level is 1 − α = 1 − ${al}, which is ${n(lvl)}%: exactly the interval the lab gave.` },
    { prompt: `For each claim, ${n(m[0])}, ${n(m[1])} and ${n(m[2])} in that order, enter 1 if it lies outside the interval (reject) or 0 if it lies inside.`, answer: d, explanation: m.map(say).join(' ') }
   ] }; }
 },
 /* One story of nine kinds, one per test in the list (for 4, the two-sample t test, the story prints the df from the formula).
    kind is the test number; the other parameters are the story's counts. Not the worked example (rock colours). */
 q39: {
  canonical: { kind: 6, n: 9 },
  draw: R => { const kind = R.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
   switch (kind) {
    case 4: { const n1 = R.int(8, 20), n2 = R.int(8, 20); return { kind, n1, n2, df: R.int(Math.min(n1, n2) - 1, n1 + n2 - 2) }; }
    case 1: return { kind, n: R.int(10, 40), s: R.int(3, 12), mu: R.int(40, 90) };
    case 2: return { kind, n: R.int(8, 30), mu: R.int(30, 60) };
    case 3: return { kind, n: R.int(5, 30) * 10, pc: R.int(5, 18) * 5 };
    case 5: return { kind, n1: R.int(8, 30) * 5, n2: R.int(8, 30) * 5 };
    case 6: return { kind, n: R.int(6, 16) };
    case 7: return { kind, c: R.int(3, 6), N: R.int(6, 20) * 10 };
    case 8: { const r = R.int(2, 4), c = R.int(2, 4); return { kind, r, c: r === 2 && c === 2 ? 3 : c, N: R.int(10, 30) * 10 }; }
    default: { const k = R.int(3, 5); return { kind, k, N: k * R.int(4, 8) }; }
   } },
  build: p => { const S = story39(p); return {
   prompt: `${S.text} ${TESTS} Enter the number of the right test, then its degrees of freedom. For a z test, which has none, enter 0; for the F test, enter the df between groups.`,
   answer: [S.test, S.df],
   hints: ['Ask three questions. Is the outcome a measurement or a counted category? How many groups or variables are compared? Are two sets of measurements independent, or pairs of the same subjects measured twice?', 'One group of measurements: z if σ is known, t if not (df n − 1). Two independent groups: the two-sample t test (df from its formula, given in the story). Pairs: t on the differences (df pairs − 1). Counts of one variable against claimed shares: goodness of fit (df categories − 1); two variables in a table: independence (df (rows − 1) × (columns − 1)). Three or more means: ANOVA (df between groups k − 1).'],
   solution: S.why,
   guidance: [
    { prompt: 'Is the outcome a measurement, such as a time or a weight (enter 1), or a category that is counted (enter 2)?', answer: [S.data], explanation: S.data === 1 ? 'Each subject gives a number on a scale, so the outcome is a measurement.' : 'Each subject falls into a category, and the categories are counted.' },
    { prompt: 'Which test from the list fits this design? Enter its number.', answer: [S.test], explanation: S.why },
    { prompt: 'What are the degrees of freedom of its statistic (0 for a z test)?', answer: [S.df], explanation: S.df ? S.why.slice(S.why.lastIndexOf(S.test === 9 ? 'Its df' : 'df')) : 'A z statistic is compared with the normal curve, which has no degrees of freedom: enter 0.' }
   ] }; }
 },
 /* A one-sample z test with σ known. The standard error σ ÷ √n is 0.5, 1, 2 or 2.5 and x̄ − μ₀ has one decimal, so z
    is exact to 2 decimals. |z| from 0.8 to 2.9, on the side of Hₐ for a one-tailed test. Five table rows starting at
    |z| − off × 0.01. The p-value is never within 0.002 of α. Not the worked example (a clinic, right-tailed). */
 q40: {
  canonical: { ctx: 0, tail: 1, mu: 120, sigma: 10, n: 25, d10: -37, alpha: 0.05, off: 2 },
  draw: R => { let p; for (;;) { const ctx = R.int(0, Z_CTX.length - 1), C = Z_CTX[ctx], [sigma, k] = R.pick(C.sig), se = sigma / Math.sqrt(k), tail = R.int(1, 3);
    let d10 = R.int(Math.ceil(8 * se), Math.floor(29 * se)); if (tail === 1 || (tail === 3 && R.bool())) d10 = -d10;
    p = { ctx, tail, mu: R.int(C.mu[0], C.mu[1]), sigma, n: k, d10, alpha: R.pick([0.01, 0.05, 0.1]), off: R.int(0, 4) };
    const Z = ztest(p); if (Math.abs(Z.pv - p.alpha) < 0.002 || (p.ctx === 0 && p.d10 === -37 && p.n === 25)) continue; return p; } },
  build: p => { const C = Z_CTX[p.ctx], Z = ztest(p), [word, tname] = TAILS[p.tail], root = Math.sqrt(p.n),
   rows = [0, 1, 2, 3, 4].map(i => Math.round((Z.az - (p.off - i) / 100) * 100) / 100).map(z => `z = ${n(z)}, ${n(Phi4(z))}`).join('; '),
   pwork = p.tail === 3 ? `the area beyond ${n(Z.az)} in one tail is 1 − ${n(Z.area)} = ${n(Z.tail1)}, and a two-tailed test doubles it: p-value = 2 × ${n(Z.tail1)} = ${n(Z.pv)}` : `the p-value is the area to the ${p.tail === 1 ? `left of ${n(Z.z)}, which by symmetry equals the area to the right of ${n(Z.az)}` : `right of ${n(Z.z)}`}: 1 − ${n(Z.area)} = ${n(Z.pv)}`; return {
   prompt: `${C.claim} ${n(p.mu)} ${C.unit}, and the population standard deviation is known: σ = ${n(p.sigma)} ${C.unit}. The council suspects the ${C.stat} is ${word} the claimed value. A random sample of ${n(p.n)} ${C.of} has x̄ = ${n(Z.xb)} ${C.unit}. Test at α = ${n(p.alpha)}. Normal table, the area to the left of z: ${rows}. Enter the test statistic z (it comes out exact to 2 decimal places), then the p-value to 4 decimal places, read from the table rows (for a two-tailed test, double the smaller tail area), then 1 to reject the claim or 0 not to.`,
   answer: [Z.z, Z.pv, Z.dec],
   hints: ['z = (x̄ − μ₀) ÷ (σ ÷ √n): how many standard errors the sample mean lies from the claimed mean.', 'The table gives the area to the left of a positive z. The area beyond it in one tail is 1 minus that area, and by symmetry the left tail beyond −z is the same size. A two-tailed p-value doubles the one-tail area. Reject when the p-value is below α.'],
   solution: `H₀: μ = ${n(p.mu)} and Hₐ: μ is ${word} ${n(p.mu)}, a ${tname} test. The standard error is ${n(p.sigma)} ÷ √${n(p.n)} = ${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, so z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.d)} ÷ ${n(Z.se)} = ${n(Z.z)}. The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork}. ${Z.dec ? `${n(Z.pv)} is below α = ${n(p.alpha)}, so reject the claim: enter 1. The ${C.stat} is ${word} ${n(p.mu)} ${C.unit1}.` : `${n(Z.pv)} is not below α = ${n(p.alpha)}, so do not reject the claim: enter 0. The sample does not give strong enough evidence against it.`}`,
   guidance: [
    { prompt: 'Which tail does the council’s suspicion give? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.', answer: [p.tail], explanation: `“${word[0].toUpperCase() + word.slice(1)}” the claimed mean makes the test ${tname}.` },
    { prompt: 'What is the standard error σ ÷ √n, and the test statistic z?', answer: [Z.se, Z.z], explanation: `${n(p.sigma)} ÷ ${n(root)} = ${n(Z.se)}, and z = (${n(Z.xb)} − ${n(p.mu)}) ÷ ${n(Z.se)} = ${n(Z.z)}.` },
    { prompt: 'Use the table row for the size of z, without its sign. What is the p-value?', answer: [Z.pv], explanation: `The table gives ${n(Z.area)} to the left of ${n(Z.az)}, so ${pwork}.` },
    { prompt: `Compare the p-value with α = ${n(p.alpha)}. Enter 1 to reject the claim, 0 not to.`, answer: [Z.dec], explanation: Z.dec ? `${n(Z.pv)} is below ${n(p.alpha)}: reject.` : `${n(Z.pv)} is not below ${n(p.alpha)}: do not reject.` }
   ] }; }
 }
});
})();
