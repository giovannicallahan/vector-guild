/* Data and inference mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Fixed decimals with a typographic minus: fx(3.1, 2) is '3.10'. Rounds half away from zero (draws never land on a tie). */
const fx = (x, d) => { const k = Math.pow(10, d), v = Math.round(Math.abs(x) * k + 1e-9) / k; return (x < 0 && v > 0 ? '−' : '') + v.toFixed(d); };
const rd = (x, d) => Number(fx(x, d).replace('−', '-'));
/* True when x sits on (or within float noise of) a rounding tie at d decimals: such draws are rejected. */
const tie = (x, d) => { const v = Math.abs(x) * Math.pow(10, d); return Math.abs(v - Math.floor(v) - 0.5) < 1e-6; };
/* '= 5.88' when x has at most d decimals, '≈ 5.88' when it was rounded. */
const eq = (x, d) => { const v = x * Math.pow(10, d); return Math.abs(v - Math.round(v)) < 1e-7 ? '= ' + n(x) : '≈ ' + fx(x, d); };
const list = xs => xs.slice(0, -1).map(n).join(', ') + ' and ' + n(xs[xs.length - 1]);
/* Critical values. z* for the three confidence levels (thousandths for exact sums), and rows of Student's t table:
   df → [90%, 95%, 99%], two-sided, as printed to 3 decimals (scipy t.ppf(0.95 / 0.975 / 0.995, df)). */
const ZS = { 90: '1.645', 95: '1.96', 99: '2.576' }, ZT = { 90: 1645, 95: 1960, 99: 2576 };
const ZLINE = 'Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576.';
const TT = {
 3: ['2.353', '3.182', '5.841'], 4: ['2.132', '2.776', '4.604'], 5: ['2.015', '2.571', '4.032'], 6: ['1.943', '2.447', '3.707'],
 7: ['1.895', '2.365', '3.499'], 8: ['1.860', '2.306', '3.355'], 9: ['1.833', '2.262', '3.250'], 10: ['1.812', '2.228', '3.169'],
 11: ['1.796', '2.201', '3.106'], 12: ['1.782', '2.179', '3.055'], 13: ['1.771', '2.160', '3.012'], 14: ['1.761', '2.145', '2.977'],
 15: ['1.753', '2.131', '2.947'], 16: ['1.746', '2.120', '2.921'], 17: ['1.740', '2.110', '2.898'], 18: ['1.734', '2.101', '2.878'],
 19: ['1.729', '2.093', '2.861'], 20: ['1.725', '2.086', '2.845'], 21: ['1.721', '2.080', '2.831']
};
const COL = { 90: 0, 95: 1, 99: 2 };
const trow = df => `df ${df}: 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}`;
const tstar = (df, L) => TT[df][COL[L]];
/* σ ÷ √n has at most 2 decimals: σ × 100 is a multiple of √n. */
const tidySE = (sig, r) => (sig * 100) % r === 0;
const ROOTS = [4, 5, 6, 8, 10];

/* q18 claims: [text with the value, tail code 1 left / 2 right / 3 two-tailed, value range [lo, hi, step]]. c is only an
   index into this list. H₀ takes ≥ when Hₐ is <, ≤ when Hₐ is >, = when Hₐ is ≠ (OpenStax 9.1, Table 9.1). */
const CLAIMS = [
 [v => `The oxygen supplier claims that its canisters hold a mean of ${v} litres. The inspectors suspect that the canisters hold less than that on average.`, 1, [30, 60, 1]],
 [v => `A seed supplier claims that its beans sprout in a mean of ${v} days. The farm crew suspects that they take longer than that on average.`, 2, [6, 15, 1]],
 [v => `The bolt maker claims that its bolts have a mean length of ${v} mm. The inspectors want to know whether the mean length is different from ${v} mm, either too long or too short.`, 3, [60, 120, 1]],
 [v => `The filter supplier claims that its air filters last at least ${v} hours on average. The inspectors suspect that the mean life is shorter.`, 1, [200, 500, 10]],
 [v => `The battery supplier claims that its packs take at most ${v} minutes on average to charge. The crew suspects that the mean charging time is longer.`, 2, [40, 120, 1]],
 [v => `The cable maker states that its cable has a mean breaking strength of ${v} kilonewtons. A new batch arrives, and the inspectors check whether the mean strength has changed in either direction.`, 3, [150, 300, 1]]
];
const TAIL = { 1: ['≥', '<', 'left-tailed'], 2: ['≤', '>', 'right-tailed'], 3: ['=', '≠', 'two-tailed'] };

/* q11: one survey's summary. */
const q11sum = d => { const k = d.length, sum = d.reduce((a, b) => a + b, 0), m = sum / k, dev = d.map(x => x - m), ss = dev.reduce((a, b) => a + b * b, 0),
 s = Math.sqrt(ss / (k - 1)), se = Math.sqrt(ss / (k * (k - 1))); return { k, sum, m, dev, ss, s, se }; };
/* q17: the three stories' numbers. */
const q17calc = p => {
 if (p.k === 1) { const N = p.r * p.r, se = p.sig / p.r, z = ZS[p.L], m = Number(z) * se; return { N, se, crit: z, m, d: 2, est: p.xb }; }
 if (p.k === 2) { const s = p.s10 / 10, se = s / Math.sqrt(p.Nt), t = tstar(p.Nt - 1, p.L), m = Number(t) * se; return { N: p.Nt, s, se, crit: t, m, d: 2, est: p.xb }; }
 const ph = p.x / p.Np, se = Math.sqrt(ph * (1 - ph) / p.Np), z = ZS[p.L], m = Number(z) * se; return { N: p.Np, ph, se, crit: z, m, d: 3, est: ph };
};

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Five to seven readings with a whole-number mean. Draws where s or s ÷ √n lands on a rounding tie, or where
    dividing the rounded s by √n would change the second decimal, are redrawn. Never the worked example (8, 12, 10, 9, 11). */
 q11: {
  canonical: { d: [14, 18, 11, 20, 16, 17] },
  draw: R => { for (;;) { const k = R.int(5, 7), m = R.int(15, 60), dev = []; let tot = 0;
   for (let i = 0; i < k - 1; i++) { const v = R.int(-7, 7); dev.push(v); tot += v; }
   if (Math.abs(tot) > 7) continue; dev.push(-tot); const d = dev.map(v => m + v), c = q11sum(d);
   if (c.ss === 0 || tie(c.s, 2) || tie(c.se, 2) || rd(rd(c.s, 2) / Math.sqrt(k), 2) !== rd(c.se, 2)) continue;
   if (d.join() === '8,12,10,9,11') continue; return { d }; } },
  build: ({ d }) => { const { k, sum, m, dev, ss, s, se } = q11sum(d), ds = dev.map(v => v === 0 ? '0' : plus(v)), devText = ds.slice(0, -1).join(', ') + ' and ' + ds[ds.length - 1];
   return {
   prompt: `The survey team measured the depth of the frozen ground layer, in centimetres, at ${n(k)} sites chosen at random: ${list(d)}. Enter the sample mean x̄ in centimetres, then the sample standard deviation s to 2 decimal places, then the estimated standard error of the mean, s ÷ √n, to 2 decimal places.`,
   answer: [m, rd(s, 2), rd(se, 2)],
   hints: ['The sample mean is the sum of the readings divided by how many readings there are.', 'For s, take each reading minus x̄, square it, add the squares, divide by n − 1 and take the square root. The standard error is s divided by the square root of the number of readings.'],
   solution: `The readings add up to ${n(sum)}, so x̄ = ${n(sum)} ÷ ${n(k)} = ${n(m)} cm. The distances from the mean are ${devText}, and their squares add up to ${n(ss)}. Then s = √(${n(ss)} ÷ ${n(k - 1)}) ${eq(s, 2)} cm. With s in place of the unknown σ, the standard error is s ÷ √${n(k)} ${eq(se, 2)} cm.`,
   guidance: [
    { prompt: `Add the ${n(k)} readings. What is their sum, and what is the sample mean x̄?`, answer: [sum, m], explanation: `The sum is ${n(sum)}, and ${n(sum)} ÷ ${n(k)} = ${n(m)}, so x̄ = ${n(m)} cm.` },
    { prompt: `Subtract x̄ = ${n(m)} from each reading, square each result and add the squares. What is the total?`, answer: [ss], explanation: `The distances are ${devText}. Their squares add up to ${n(ss)}.` },
    { prompt: `Divide ${n(ss)} by n − 1 = ${n(k - 1)} and take the square root. What is s, to 2 decimal places?`, answer: [rd(s, 2)], explanation: `${n(ss)} ÷ ${n(k - 1)} ${eq(ss / (k - 1), 4)}, and its square root is s ${eq(s, 2)} cm.` },
    { prompt: `Divide s by √${n(k)}. What is the standard error, to 2 decimal places?`, answer: [rd(se, 2)], explanation: `√${n(k)} ${eq(Math.sqrt(k), 4)}, so s ÷ √${n(k)} ${eq(se, 2)} cm. A mean of ${n(k)} readings varies much less from survey to survey than a single reading does.` }
   ] }; }
 },
 /* σ ÷ √n with n a square (16, 25, 36, 64, 100) and at most 2 decimals; the margin z* × σ ÷ √n is never a rounding
    tie. Never the worked example (σ = 10, n = 25, 90%). */
 q12: {
  canonical: { L: 95, sig: 18, r: 6, xb: 47.3 },
  draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), sig: R.int(5, 40), r: R.pick(ROOTS), xb: R.int(200, 800) / 10 };
   if (!tidySE(p.sig, p.r) || tie(Number(ZS[p.L]) * p.sig / p.r, 2) || (p.sig === 10 && p.r === 5 && p.L === 90)) continue; return p; } },
  build: ({ L, sig, r, xb }) => { const N = r * r, se = sig / r, z = ZS[L], m = Number(z) * se; return {
   prompt: `The assay lab measures the iron content of ore lumps in grams per kilogram (g/kg). Years of records give a standard deviation of σ = ${n(sig)} g/kg. Today ${n(N)} lumps from a new seam were measured, and their mean, x̄ = ${n(xb)} g/kg, is the lab’s point estimate of the mean iron content of the whole seam. ${ZLINE} Enter the standard error σ ÷ √n, then the margin of error for ${L}% confidence, to 2 decimal places.`,
   answer: [se, rd(m, 2)],
   hints: ['The standard error is σ divided by the square root of the number of lumps.', 'The margin of error is the critical value z* for the chosen confidence level times the standard error.'],
   solution: `√${n(N)} = ${n(r)}, so the standard error is ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg. At ${L}% confidence z* = ${z}, so the margin of error is ${z} × ${n(se)} ${eq(m, 2)} g/kg. The lab can say, with ${L}% confidence, that the seam’s mean lies within ${fx(m, 2)} g/kg of ${n(xb)} g/kg.`,
   guidance: [
    { prompt: `What is √${n(N)}, and what is the standard error σ ÷ √n?`, answer: [r, se], explanation: `${n(r)} × ${n(r)} = ${n(N)}, so √${n(N)} = ${n(r)}, and ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg.` },
    { prompt: `Read z* for ${L}% confidence from the list. What is the margin of error z* × ${n(se)}, to 2 decimal places?`, answer: [rd(m, 2)], explanation: `z* = ${z} for ${L}%, and ${z} × ${n(se)} ${eq(m, 2)} g/kg.` }
   ] }; }
 },
 /* The interval x̄ ± z* σ ÷ √n and the smallest n with z* σ ÷ √n ≤ E. The margin is never a rounding tie; (z* σ ÷ E)² is
    never within 0.005 above a whole number (so its 2-decimal value never hides the round-up), the new n is larger than
    the sample's and below 1000. Never the worked example (x̄ = 40, σ = 5, n = 16, 90%). */
 q13: {
  canonical: { L: 95, sig: 6, r: 5, xb: 52.4, e10: 15 },
  draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), sig: R.int(4, 30), r: R.pick(ROOTS), xb: R.int(200, 800) / 10, e10: R.int(5, 30) };
   if (!tidySE(p.sig, p.r) || (p.sig === 5 && p.r === 4 && p.L === 90 && p.xb === 40)) continue; const m = Number(ZS[p.L]) * p.sig / p.r, num = Math.pow(ZT[p.L] * p.sig, 2), den = Math.pow(100 * p.e10, 2), q = num / den, need = Math.floor((num + den - 1) / den);
   if (tie(m, 2) || tie(q, 2) || (num % den !== 0 && q - Math.floor(q) < 0.005) || p.e10 / 10 >= m || need <= p.r * p.r || need >= 1000) continue; return p; } },
  build: ({ L, sig, r, xb, e10 }) => { const N = r * r, se = sig / r, z = ZS[L], m = Number(z) * se, m2 = rd(m, 2), lo = rd(xb - m, 2), hi = rd(xb + m, 2), E = e10 / 10,
   num = Math.pow(ZT[L] * sig, 2), den = Math.pow(100 * e10, 2), q = num / den, need = Math.floor((num + den - 1) / den), whole = num % den === 0; return {
   prompt: `The assay lab’s records give σ = ${n(sig)} g/kg for the iron content of ore lumps. A sample of ${n(N)} lumps from a new seam has mean x̄ = ${n(xb)} g/kg. ${ZLINE} Enter the lower and then the upper bound of the ${L}% confidence interval for the seam’s mean, each to 2 decimal places. Then the council wants a margin of error of at most ${n(E)} g/kg at the same confidence level: enter the smallest sample size that gives it.`,
   answer: [lo, hi, need],
   hints: ['The interval runs from x̄ minus the margin of error to x̄ plus it, where the margin is z* × σ ÷ √n.', 'For the sample size, solve margin = z* × σ ÷ √n for n: n = (z* × σ ÷ E)², where E is the margin wanted. Round up to the next whole number, even when the decimal part is small.'],
   solution: `The standard error is ${n(sig)} ÷ √${n(N)} = ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg, so the margin of error is ${z} × ${n(se)} ${eq(m, 2)} g/kg. The interval runs from ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} to ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)} g/kg. For a margin of at most ${n(E)} g/kg, n = (${z} × ${n(sig)} ÷ ${n(E)})² ${whole ? `= ${n(q)}, a whole number, so ${n(need)} lumps are just enough` : `${eq(q, 2)}, which rounds up to ${n(need)} lumps`}.`,
   guidance: [
    { prompt: `The standard error is ${n(sig)} ÷ ${n(r)} = ${n(se)} g/kg. What is the margin of error for ${L}% confidence, to 2 decimal places?`, answer: [m2], explanation: `z* = ${z}, and ${z} × ${n(se)} ${eq(m, 2)} g/kg.` },
    { prompt: `Subtract the margin from x̄ = ${n(xb)}, then add it. What are the lower and upper bounds?`, answer: [lo, hi], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} and ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)}. The interval is ${fx(lo, 2)} to ${fx(hi, 2)} g/kg.` },
    { prompt: `For a margin of at most ${n(E)} g/kg, what is (z* × σ ÷ E)² to 2 decimal places, and the smallest whole sample size?`, answer: [rd(q, 2), need], explanation: `${z} × ${n(sig)} ÷ ${n(E)} ${eq(Number(z) * sig / E, 4)}, and its square ${eq(q, 2)}. ${whole ? `That is a whole number, so ${n(need)} lumps give a margin of exactly ${n(E)} g/kg.` : `Fewer than ${n(q)} lumps would leave the margin above ${n(E)} g/kg, so round up to ${n(need)}.`}` }
   ] }; }
 },
 /* df = n − 1 from 5 to 20; the prompt prints the rows df − 1, df and df + 1. Never the worked example (n = 8, 90%). */
 q14: {
  canonical: { L: 95, N: 12 },
  draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), N: R.int(6, 21) }; if (p.N === 8 && p.L === 90) continue; return p; } },
  build: ({ L, N }) => { const df = N - 1, t = tstar(df, L); return {
   prompt: `The assay lab has only ${n(N)} ore lumps from a new seam and no records of σ, so it uses the sample standard deviation s, and its critical value comes from Student’s t distribution instead of the normal curve. Part of the t table, one row for each number of degrees of freedom (df), with columns for the confidence level: ${trow(df - 1)}; ${trow(df)}; ${trow(df + 1)}. Enter the degrees of freedom for this sample, then the critical value t* for ${L}% confidence.`,
   answer: [df, Number(t)],
   hints: ['For one sample of n readings, the degrees of freedom are n − 1.', 'Find the row for your degrees of freedom, then read across to the column for the confidence level.'],
   solution: `The sample has n = ${n(N)} lumps, so df = ${n(N)} − 1 = ${n(df)}. In the row df ${df}, the ${L}% column reads t* = ${t}. That is larger than the normal curve’s z* = ${ZS[L]} for the same level, because the t distribution has thicker tails: with σ unknown, the interval has to be wider.`,
   guidance: [
    { prompt: `How many degrees of freedom does a sample of ${n(N)} lumps have?`, answer: [df], explanation: `df = n − 1 = ${n(N)} − 1 = ${n(df)}.` },
    { prompt: `In the row df ${df}, what does the ${L}% column say?`, answer: [Number(t)], explanation: `The row reads 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}, so t* = ${t}.` }
   ] }; }
 },
 /* x̄ ± t* s ÷ √n. Draws where s ÷ √n or the margin lands on a rounding tie, or where t* times the rounded s ÷ √n
    would change the margin's second decimal, are redrawn. x̄ is at least 30, so never the worked example (x̄ = 20.5). */
 q15: {
  canonical: { L: 95, N: 12, xb: 38.6, s10: 43 },
  draw: R => { for (;;) { const p = { L: R.pick([90, 95, 99]), N: R.int(6, 21), xb: R.int(300, 700) / 10, s10: R.int(20, 90) };
   const se = p.s10 / 10 / Math.sqrt(p.N), t = Number(tstar(p.N - 1, p.L)), m = t * se;
   if (tie(se, 2) || tie(m, 2) || rd(t * rd(se, 2), 2) !== rd(m, 2)) continue; return p; } },
  build: ({ L, N, xb, s10 }) => { const df = N - 1, s = s10 / 10, se = s / Math.sqrt(N), t = tstar(df, L), m = Number(t) * se, m2 = rd(m, 2), lo = rd(xb - m, 2), hi = rd(xb + m, 2); return {
   prompt: `The assay lab measured ${n(N)} ore lumps from a seam with no records of σ. Their iron content has mean x̄ = ${n(xb)} g/kg and sample standard deviation s = ${n(s)} g/kg. Row of the t table for df ${df}: 90% ${TT[df][0]}, 95% ${TT[df][1]}, 99% ${TT[df][2]}. Enter the margin of error t* × s ÷ √n for ${L}% confidence, then the lower and the upper bound of the confidence interval, each to 2 decimal places.`,
   answer: [m2, lo, hi],
   hints: ['Use df = n − 1 to pick the row, and the column for the confidence level, to get t*.', 'The margin of error is t* times s ÷ √n; the bounds are x̄ minus and plus the margin.'],
   solution: `df = ${n(N)} − 1 = ${n(df)}, so for ${L}% confidence t* = ${t}. s ÷ √${n(N)} = ${n(s)} ÷ √${n(N)} ${eq(se, 4)}, so the margin of error is ${t} × ${fx(se, 4)} ${eq(m, 2)} g/kg. The interval runs from ${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} to ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)} g/kg.`,
   guidance: [
    { prompt: `How many degrees of freedom does the sample have?`, answer: [df], explanation: `df = ${n(N)} − 1 = ${n(df)}, so the row to read is df ${df}, where the ${L}% column gives t* = ${t}.` },
    { prompt: `What is s ÷ √n = ${n(s)} ÷ √${n(N)}, to 2 decimal places?`, answer: [rd(se, 2)], explanation: `√${n(N)} ${eq(Math.sqrt(N), 4)}, and ${n(s)} ÷ ${fx(Math.sqrt(N), 4)} ${eq(se, 2)} g/kg.` },
    { prompt: `Multiply by t* = ${t}. What is the margin of error, to 2 decimal places?`, answer: [m2], explanation: `${t} × ${fx(se, 4)} ${eq(m, 2)} g/kg.` },
    { prompt: `Subtract the margin from x̄ = ${n(xb)}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${n(xb)} − ${fx(m2, 2)} = ${fx(lo, 2)} and ${n(xb)} + ${fx(m2, 2)} = ${fx(hi, 2)}.` }
   ] }; }
 },
 /* p̂ = x ÷ n with at most 3 decimals, both counts above 5. Draws where the standard error or the margin lands on a
    rounding tie, or where z* times the rounded standard error would change the margin's third decimal, are redrawn.
    Never the worked example (45 of 100 at 90%). */
 q16: {
  canonical: { L: 95, x: 72, N: 200 },
  draw: R => { for (;;) { const N = R.pick([100, 125, 200, 250, 400, 500]), p = { L: R.pick([90, 95, 99]), x: R.int(Math.ceil(0.08 * N), Math.floor(0.92 * N)), N };
   if ((p.x * 1000) % N !== 0 || p.x <= 5 || N - p.x <= 5 || (p.x === 45 && N === 100 && p.L === 90)) continue;
   const ph = p.x / N, se = Math.sqrt(ph * (1 - ph) / N), z = Number(ZS[p.L]), m = z * se;
   if (tie(se, 3) || tie(m, 3) || rd(z * rd(se, 3), 3) !== rd(m, 3) || rd(ph - m, 3) <= 0) continue; return p; } },
  build: ({ L, x, N }) => { const ph = x / N, qh = (N - x) / N, se = Math.sqrt(ph * qh / N), z = ZS[L], m = Number(z) * se, m3 = rd(m, 3), lo = rd(ph - m, 3), hi = rd(ph + m, 3); return {
   prompt: `The assay lab split ${n(N)} rock cores from the new seam, and ${n(x)} of them showed a nickel vein. Both ${n(x)} and ${n(N - x)} are more than 5, so the normal curve can be used. ${ZLINE} Enter the sample proportion p̂, then the margin of error z* × √(p̂(1 − p̂) ÷ n) for ${L}% confidence, then the lower and the upper bound of the confidence interval, all to 3 decimal places.`,
   answer: [ph, m3, lo, hi],
   hints: ['p̂ is the number of cores with a vein divided by the number of cores.', 'Multiply p̂ by 1 − p̂, divide by n and take the square root to get the standard error. The margin of error is z* times that, and the bounds are p̂ minus and plus the margin.'],
   solution: `p̂ = ${n(x)} ÷ ${n(N)} = ${n(ph)}, so 1 − p̂ = ${n(qh)}. The standard error is √(${n(ph)} × ${n(qh)} ÷ ${n(N)}) ${eq(se, 4)}. At ${L}% confidence z* = ${z}, so the margin of error is ${z} × ${fx(se, 4)} ${eq(m, 3)}. The interval runs from ${n(ph)} − ${fx(m3, 3)} = ${fx(lo, 3)} to ${n(ph)} + ${fx(m3, 3)} = ${fx(hi, 3)}: between ${fx(100 * lo, 1)}% and ${fx(100 * hi, 1)}% of the seam’s cores have a vein, with ${L}% confidence.`,
   guidance: [
    { prompt: `What is the sample proportion p̂ = ${n(x)} ÷ ${n(N)}?`, answer: [ph], explanation: `${n(x)} ÷ ${n(N)} = ${n(ph)}.` },
    { prompt: `What is the standard error √(p̂(1 − p̂) ÷ n), to 3 decimal places?`, answer: [rd(se, 3)], explanation: `${n(ph)} × ${n(qh)} = ${n(ph * qh)}; divided by ${n(N)} and square-rooted it is ${eq(se, 4).slice(2)}, which is ${fx(se, 3)} to 3 decimal places.` },
    { prompt: `Multiply by z* = ${z}. What is the margin of error, to 3 decimal places?`, answer: [m3], explanation: `${z} × ${fx(se, 4)} ${eq(m, 3)}.` },
    { prompt: `Subtract the margin from p̂ = ${n(ph)}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${n(ph)} − ${fx(m3, 3)} = ${fx(lo, 3)} and ${n(ph)} + ${fx(m3, 3)} = ${fx(hi, 3)}.` }
   ] }; }
 },
 /* k is the right interval: 1 z (σ known), 2 t (s from a sample of 9 to 12), 3 proportion. The other story's fields are
    drawn too but unused (the worked example, σ = 8, n = 64, x̄ = 30 at 95%, is never drawn). Bounds are to 2 decimals for a mean, 3 for a proportion; margins are never rounding ties. */
 q17: {
  canonical: { k: 2, L: 95, xb: 45.2, sig: 12, r: 6, Nt: 10, s10: 35, x: 60, Np: 250 },
  draw: R => { for (;;) { const p = { k: R.int(1, 3), L: R.pick([90, 95, 99]), xb: R.int(200, 800) / 10, sig: R.int(4, 30), r: R.pick(ROOTS), Nt: R.int(9, 12), s10: R.int(20, 80) };
   p.Np = R.pick([100, 200, 250, 400, 500]); p.x = R.int(Math.ceil(0.1 * p.Np), Math.floor(0.9 * p.Np));
   if (!tidySE(p.sig, p.r) || (p.x * 1000) % p.Np !== 0 || (p.k === 1 && p.sig === 8 && p.r === 8 && p.L === 95 && p.xb === 30)) continue; const c = q17calc(p); if (tie(c.m, c.d)) continue; return p; } },
  build: p => { const { k, L, xb } = p, c = q17calc(p), lo = rd(c.est - c.m, c.d), hi = rd(c.est + c.m, c.d), md = rd(c.m, c.d), d = c.d;
   const story = k === 1 ? `The lab’s long records give σ = ${n(p.sig)} g/kg for the iron content of ore lumps. A sample of ${n(c.N)} lumps has mean ${n(xb)} g/kg. The council wants a ${L}% confidence interval for the mean iron content.`
    : k === 2 ? `A new seam has no records of σ. A sample of ${n(c.N)} lumps has mean ${n(xb)} g/kg and sample standard deviation s = ${n(c.s)} g/kg. The council wants a ${L}% confidence interval for the mean iron content.`
    : `${n(p.x)} of ${n(c.N)} rock cores showed a nickel vein; both counts, with and without a vein, are more than 5. The council wants a ${L}% confidence interval for the proportion of cores with a vein.`;
   const work = k === 1 ? `σ is known from the records, so this is the z interval, number 1. The standard error is ${n(p.sig)} ÷ √${n(c.N)} = ${n(c.se)}, and the margin is ${c.crit} × ${n(c.se)} ${eq(c.m, 2)} g/kg.`
    : k === 2 ? `Only s from this sample is known, so this is the t interval, number 2, with df = ${n(c.N)} − 1 = ${n(c.N - 1)} and t* = ${c.crit}. The standard error is ${n(c.s)} ÷ √${n(c.N)} ${eq(c.se, 4)}, and the margin is ${c.crit} × ${fx(c.se, 4)} ${eq(c.m, 2)} g/kg.`
    : `The reading is a count of cores with or without a vein, so this is the interval for a proportion, number 3. p̂ = ${n(p.x)} ÷ ${n(c.N)} = ${n(c.ph)}, the standard error is √(${n(c.ph)} × ${n(1 - c.ph)} ÷ ${n(c.N)}) ${eq(c.se, 4)}, and the margin is ${c.crit} × ${fx(c.se, 4)} ${eq(c.m, 3)}.`;
   const est = k === 3 ? n(c.ph) : n(xb);
   return {
   prompt: `${story} The intervals: 1, the z interval for a mean (σ known); 2, the t interval for a mean (σ unknown, s from the sample); 3, the interval for a proportion. ${ZLINE} t table rows, columns 90%, 95%, 99%: df 8: 1.860, 2.306, 3.355; df 9: 1.833, 2.262, 3.250; df 10: 1.812, 2.228, 3.169; df 11: 1.796, 2.201, 3.106. Enter the number of the right interval, then its lower and its upper bound, to ${d === 3 ? '3 decimal places, as proportions' : '2 decimal places'}.`,
   answer: [k, lo, hi],
   hints: ['σ known from long records points to z; only s from this sample points to t, with df = n − 1; a count of items with or without something points to a proportion.', 'Whichever interval it is, the margin of error is the critical value times the standard error, and the bounds are the estimate minus and plus the margin.'],
   solution: `${work} The interval runs from ${est} − ${fx(md, d)} = ${fx(lo, d)} to ${est} + ${fx(md, d)} = ${fx(hi, d)}.`,
   guidance: [
    { prompt: 'Is σ known from records (1), is only s from the sample known (2), or is the reading a count of yes-or-no results (3)? Enter the number of the interval.', answer: [k], explanation: k === 1 ? 'The records give σ, so the z interval fits: number 1.' : k === 2 ? 'There are no records of σ, only s from this sample, so the t interval fits: number 2.' : 'The data are a count of cores with a vein, so the interval for a proportion fits: number 3.' },
    { prompt: `What is the margin of error, to ${d === 3 ? '3' : '2'} decimal places?`, answer: [md], explanation: work },
    { prompt: `Subtract the margin from the estimate ${est}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${est} − ${fx(md, d)} = ${fx(lo, d)} and ${est} + ${fx(md, d)} = ${fx(hi, d)}.` }
   ] }; }
 },
 /* c is only an index into CLAIMS (the story and its tail); v is the claimed mean. */
 q18: {
  canonical: { c: 3, v: 300 },
  draw: R => { const c = R.int(0, 5), [lo, hi, step] = CLAIMS[c][2]; return { c, v: step * R.int(lo / step, hi / step) }; },
  build: ({ c, v }) => { const [text, code] = CLAIMS[c], [s0, sA, name] = TAIL[code]; return {
   prompt: `${text(n(v))} In the test, μ stands for the true mean of everything the supplier sends. Enter the number that appears in the null hypothesis H₀, then the tail of the test: 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.`,
   answer: [v, code],
   hints: ['H₀ is the supplier’s claim and always contains an equals sign (=, ≥ or ≤). The number in it is the claimed mean.', 'Hₐ is what the inspectors suspect: μ < value is left-tailed, μ > value is right-tailed, μ ≠ value is two-tailed.'],
   solution: `H₀: μ ${s0} ${n(v)} and Hₐ: μ ${sA} ${n(v)}. The number in H₀ is ${n(v)}. Hₐ uses ${sA}, so the test is ${name}: code ${code}.`,
   guidance: [
    { prompt: 'What number does the supplier’s claim give for the mean μ?', answer: [v], explanation: `The claim is about the value ${n(v)}, so H₀ is μ ${s0} ${n(v)}.` },
    { prompt: `The suspicion goes into Hₐ. Enter 1 if Hₐ reads μ < ${n(v)}, 2 if it reads μ > ${n(v)}, 3 if it reads μ ≠ ${n(v)}.`, answer: [code], explanation: `Hₐ: μ ${sA} ${n(v)}, so the test is ${name}.` }
   ] }; }
 },
 /* α = A ÷ 100, β = B ÷ 100, N batches (a multiple of 100). Never the worked example (α = 0.01, β = 0.3, 500 tests). */
 q19: {
  canonical: { A: 5, B: 18, N: 200 },
  draw: R => { for (;;) { const p = { A: R.pick([1, 5, 10]), B: R.int(5, 40), N: 100 * R.int(1, 9) }; if (p.A === 1 && p.B === 30 && p.N === 500) continue; return p; } },
  build: ({ A, B, N }) => { const a = A / 100, b = B / 100, pw = (100 - B) / 100, fa = N * A / 100; return {
   prompt: `The Inspection Hall tests each batch of rations, with H₀: the batch meets its claimed mean weight, at significance level α = ${n(a)}. When a batch really is short, the test misses it with probability β = ${n(b)}. Enter the power of the test. Then the hall tests ${n(N)} batches, each separately, that all turn out to have met their claim: enter the expected number of them for which the test wrongly rejects H₀.`,
   answer: [pw, fa],
   hints: ['β is the chance of a Type II error, missing a real shortfall. The power is the chance of catching it, so power and β add up to 1.', 'Rejecting a true H₀ is a Type I error, and each test makes one with probability α. The expected number of them is the number of tests times α.'],
   solution: `Power = 1 − β = 1 − ${n(b)} = ${n(pw)}. Every one of the ${n(N)} batches met its claim, so H₀ was true each time, and a rejection is a Type I error, with probability α = ${n(a)} in each test. The expected number of false alarms is ${n(N)} × ${n(a)} = ${n(fa)}.`,
   guidance: [
    { prompt: `What is the power 1 − β, with β = ${n(b)}?`, answer: [pw], explanation: `1 − ${n(b)} = ${n(pw)}: the test catches ${n(100 - B)}% of the batches that really are short.` },
    { prompt: 'A batch that met its claim is rejected. Is that a Type I error (enter 1) or a Type II error (enter 2)?', answer: [1], explanation: 'H₀ was true and was rejected: a Type I error, a false alarm.' },
    { prompt: `Each of the ${n(N)} tests raises a false alarm with probability α = ${n(a)}. What is the expected number of false alarms?`, answer: [fa], explanation: `${n(N)} × ${n(a)} = ${n(fa)}.` }
   ] }; }
 },
 /* z = (x̄ − μ₀) ÷ (σ ÷ √n) with σ ÷ √n of at most 2 decimals, x̄ ≠ μ₀, |z| ≤ 3.5 and never a rounding tie. */
 q20: {
  canonical: { mu: 500, sig: 12, r: 6, d10: -37 },
  draw: R => { for (;;) { const p = { mu: 10 * R.int(20, 80), sig: R.int(4, 30), r: R.pick(ROOTS), d10: R.nz(-60, 60) };
   if (!tidySE(p.sig, p.r)) continue; const z = p.d10 / 10 / (p.sig / p.r); if (Math.abs(z) > 3.5 || Math.abs(z) < 0.2 || tie(z, 2)) continue; return p; } },
  build: ({ mu, sig, r, d10 }) => { const N = r * r, se = sig / r, d = d10 / 10, xb = (10 * mu + d10) / 10, z = d / se; return {
   prompt: `A supplier claims that its ration packs have a mean mass of ${n(mu)} g, so the inspectors test H₀: μ = ${n(mu)}. Long records give σ = ${n(sig)} g. The inspectors weigh ${n(N)} packs and find a mean of x̄ = ${n(xb)} g. Enter the standard error σ ÷ √n, then the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n) to 2 decimal places, where μ₀ = ${n(mu)} is the value in H₀.`,
   answer: [se, rd(z, 2)],
   hints: ['The standard error is σ divided by the square root of the sample size.', 'The test statistic counts how many standard errors x̄ lies from the value in H₀: subtract μ₀ from x̄, then divide by the standard error. Keep the sign.'],
   solution: `√${n(N)} = ${n(r)}, so σ ÷ √n = ${n(sig)} ÷ ${n(r)} = ${n(se)} g. x̄ − μ₀ = ${n(xb)} − ${n(mu)} = ${n(d)} g. z = ${n(d)} ÷ ${n(se)} ${eq(z, 2)}: the sample mean lies about ${fx(Math.abs(z), 2)} standard errors ${z < 0 ? 'below' : 'above'} the claimed mean.`,
   guidance: [
    { prompt: `What is the standard error σ ÷ √n = ${n(sig)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(sig)} ÷ ${n(r)} = ${n(se)} g.` },
    { prompt: `What is x̄ − μ₀ = ${n(xb)} − ${n(mu)}?`, answer: [d], explanation: `${n(xb)} − ${n(mu)} = ${n(d)} g${d < 0 ? ': the sample came out light' : ': the sample came out heavy'}.` },
    { prompt: `Divide by the standard error. What is z, to 2 decimal places?`, answer: [rd(z, 2)], explanation: `${n(d)} ÷ ${n(se)} ${eq(z, 2)}.` }
   ] }; }
 }
});
})();
