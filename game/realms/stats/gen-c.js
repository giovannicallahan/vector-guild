/* Data and inference mission generators, file c: q21–q30. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-c.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* ---------- shared helpers ---------- */
/* Round half away from zero to k places; tie(x, k) is true when x sits on (or within float noise of) a rounding tie. */
const rd = (x, k) => { const f = Math.pow(10, k); return Math.sign(x) * Math.round(Math.abs(x) * f) / f; };
const tie = (x, k) => { const v = Math.abs(x) * Math.pow(10, k), fr = v - Math.floor(v); return Math.abs(fr - 0.5) < 1e-6; };
const same = (a, b) => Math.abs(a - b) < 1e-9;
/* The normal table: area under the standard normal curve to the left of z, to 4 decimal places (Simpson's rule on
   the bell curve, accurate far beyond 4 places). z is a table row, a multiple of 0.01. ±0.74 lie on a rounding tie
   and are never drawn. */
const phi4 = z => { const m = Math.abs(z), N = 2000, h = m / N, f = x => Math.exp(-x * x / 2); let s = f(0) + f(m);
 for (let i = 1; i < N; i++) s += f(i * h) * (i % 2 ? 4 : 2);
 const half = s * h / 3 / Math.sqrt(2 * Math.PI); return rd(z < 0 ? 0.5 - half : 0.5 + half, 4); };
const f4 = x => x.toFixed(4), z2 = x => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);
/* Three consecutive table rows with the row of z in place off (0 first, 1 middle, 2 last), so that the table does not point
   at z when the player must compute it (q22, q23). |z| >= 1 there, so no printed row is the tie ±0.74. */
const rows = (z, off = 1) => [0, 1, 2].map(k => { const r = rd(z + (k - off) / 100, 2); return `${z2(r)} → ${f4(phi4(r))}`; }).join(', ');
const OP = { 1: '<', 2: '>', 3: '≠' }, TAIL = { 1: 'left-tailed', 2: 'right-tailed', 3: 'two-tailed' };
/* The p-value of a z test from the table row of z (z already rounded to 2 places). */
const pval = (tail, z) => { const a = phi4(z); return rd(tail === 1 ? a : tail === 2 ? 1 - a : 2 * (z < 0 ? a : 1 - a), 4); };
const ptext = (tail, z, p) => { const a = phi4(z), r = rd(1 - a, 4), row = `the row ${z2(z)} → ${f4(a)}`;
 if (tail === 1) return `Hₐ uses <, so the test is left-tailed and the p-value is the area to the left of z: ${row} gives p-value = ${n(p)}.`;
 if (tail === 2) return `Hₐ uses >, so the test is right-tailed and the p-value is the area to the right of z: ${row} gives 1 − ${f4(a)} = ${n(p)}.`;
 return z < 0 ? `Hₐ uses ≠, so the test is two-tailed and the p-value counts both tails: ${row} gives the left tail ${f4(a)}, and doubling it gives 2 × ${f4(a)} = ${n(p)}.`
  : `Hₐ uses ≠, so the test is two-tailed and the p-value counts both tails: ${row} gives the right tail 1 − ${f4(a)} = ${n(r)}, and doubling it gives 2 × ${n(r)} = ${n(p)}.`; };
const dtext = (p, a) => p < a ? `${n(p)} is less than α = ${n(a)}, so we reject H₀.` : `${n(p)} is not less than α = ${n(a)}, so we do not reject H₀.`;
/* Proportion tests: [p₀, n] pairs whose standard error √(p₀(1 − p₀) ÷ n) is a short decimal and whose p̂ = x ÷ n has at most 4 places. */
const PROP = [[0.5, 100], [0.2, 100], [0.1, 100], [0.8, 100], [0.9, 100], [0.2, 400], [0.1, 400], [0.5, 400], [0.8, 400], [0.9, 400], [0.5, 625]];
const seOf = (p0, N) => rd(Math.sqrt(p0 * (1 - p0) / N), 4);
/* Two-sample summaries: (s, n) with s² ÷ n at most 3 decimal places. */
const SN = []; for (const N of [10, 16, 20, 25]) for (const s of [2, 3, 4, 5, 6, 8]) { const v = s * s / N; if (same(rd(v, 3), v)) SN.push([s, N]); }
/* t critical values (OpenStax t table): T05[df] has area 0.05 to its right, T025[df] area 0.025. */
const T05 = [0, 6.314, 2.920, 2.353, 2.132, 2.015, 1.943, 1.895, 1.860, 1.833, 1.812, 1.796, 1.782, 1.771, 1.761, 1.753, 1.746, 1.740, 1.734, 1.729, 1.725, 1.721, 1.717, 1.714, 1.711, 1.708, 1.706, 1.703, 1.701, 1.699, 1.697];
const T025 = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
const t3 = x => x.toFixed(3);
const welch = (v1, n1, v2, n2) => Math.floor((v1 + v2) * (v1 + v2) / (v1 * v1 / (n1 - 1) + v2 * v2 / (n2 - 1)));
/* Goodness-of-fit shares (per cent) for three categories. */
const SHARES = [[50, 30, 20], [40, 40, 20], [60, 25, 15], [25, 50, 25], [45, 35, 20], [70, 20, 10], [30, 45, 25]];
const LETTERS = 'ABCDEFGH';
/* Sum of (O − E)² ÷ E. */
const chi = (O, E) => O.reduce((s, o, i) => s + (o - E[i]) * (o - E[i]) / E[i], 0);

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* q21: the p-value of a z test from three printed table rows, and the decision against α. The sign of z agrees with
    the tail (a left-tailed test with z > 0 is not drawn), |z| runs from 1.10 to 2.90, and a p-value equal to α is
    never drawn. Not the worked example's z, 2.12. */
 q21: {
  canonical: { tail: 1, z: -1.87, a: 0.05 },
  draw: R => { let p; do { const tail = R.int(1, 3), m = R.except(110, 290, [212]) / 100, s = tail === 1 ? -1 : tail === 2 ? 1 : (R.bool() ? 1 : -1);
   p = { tail, z: s * m, a: R.pick([0.01, 0.05, 0.1]) }; } while (same(pval(p.tail, p.z), p.a)); return p; },
  build: ({ tail, z, a }) => { const area = phi4(z), p = pval(tail, z), d = p < a ? 1 : 0; return {
   prompt: `A supplier claims that its cable spools hold a mean length of 500 m. The inspectors tested H₀: μ = 500 against Hₐ: μ ${OP[tail]} 500, and their sample gave the test statistic z = ${z2(z)}. Rows of the normal table (z → area under the standard normal curve to the left of z): ${rows(z)}. At significance level α = ${n(a)}, enter the p-value to 4 decimal places, then 1 to reject H₀ or 0 not to reject it.`,
   answer: [p, d],
   hints: ['The p-value is the area beyond z in the direction Hₐ points: to the left for <, to the right for >, and in both tails for ≠.', 'The area to the right of z is 1 minus the area to the left. For a two-tailed test, double the smaller tail. Reject H₀ when the p-value is less than α.'],
   solution: `${ptext(tail, z, p)} ${dtext(p, a)} ${d ? `A sample this far from 500 would be rare if the claim were true.` : `A sample like this is not rare enough, if the claim were true, to doubt it.`} Enter ${n(p)} and ${d}.`,
   guidance: [
    { prompt: `Find the row for z = ${z2(z)} in the table. What is the area to the left of z?`, answer: [area], explanation: `The row ${z2(z)} → ${f4(area)} says that ${f4(area)} of the area under the standard normal curve lies to the left of ${z2(z)}.` },
    { prompt: `Hₐ: μ ${OP[tail]} 500 makes this a ${TAIL[tail]} test. What is the p-value?`, answer: [p], explanation: ptext(tail, z, p) },
    { prompt: `Compare the p-value ${n(p)} with α = ${n(a)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${dtext(p, a)} The rule: reject H₀ only when the p-value is less than α.` }
   ] }; }
 },
 /* q22: a one-proportion z test. [p₀, n] from PROP; the count x gives 1 <= |z| <= 3 with the sign of the tail
    (x is always whole: it is counted from n·p₀ rounded, so 313 for 0.5 × 625, as in practice-5.js);
    z on a rounding tie, and a p-value equal to α, are never drawn. Not the worked example (p₀ = 0.5, n = 100, 61). */
 q22: {
  canonical: { c: 8, tail: 1, x: 306, a: 0.05, off: 1 },
  draw: R => { let p; for (;;) { const c = R.int(0, PROP.length - 1), [p0, N] = PROP[c], sd = N * seOf(p0, N), tail = R.int(1, 3);
   const k = R.int(Math.ceil(sd), Math.floor(3 * sd)), s = tail === 1 ? -1 : tail === 2 ? 1 : (R.bool() ? 1 : -1), x = Math.round(N * p0) + s * k, z = (x - N * p0) / sd;
   p = { c, tail, x, a: R.pick([0.01, 0.05, 0.1]), off: R.int(0, 2) };
   if (x < 0 || x > N || tie(z, 2) || Math.abs(rd(z, 2)) === 0.74 || same(pval(tail, rd(z, 2)), p.a) || (c === 0 && x === 61)) continue; return p; } },
  build: ({ c, tail, x, a, off }) => { const [p0, N] = PROP[c], se = seOf(p0, N), ph = rd(x / N, 4), z = (ph - p0) / se, zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0; return {
   prompt: `A seed supplier claims that ${n(100 * p0)}% of its packets sprout. Write p for the share of all its packets that sprout. The inspectors test H₀: p = ${n(p0)} against Hₐ: p ${OP[tail]} ${n(p0)} at significance level α = ${n(a)}. In a random sample of ${N} packets, ${x} sprouted; assume the packets sprout independently. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
   answer: [zr, d],
   hints: ['If H₀ is true, the sample proportion p̂ has mean p₀ and standard error √(p₀(1 − p₀) ÷ n). Use the claimed p₀ here, not p̂.', 'z = (p̂ − p₀) ÷ standard error. Then find the p-value from the table as for a mean, in the direction Hₐ points, and reject H₀ when it is less than α.'],
   solution: `p̂ = ${x} ÷ ${N} = ${n(ph)}. If H₀ is true, the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}. So z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${same(z, zr) ? ` = ${z2(zr)}` : `, which is ${z2(zr)} to 2 decimal places`}. ${ptext(tail, zr, p)} ${dtext(p, a)} Enter ${z2(zr)} and ${d}.`,
   guidance: [
    { prompt: `What is the sample proportion p̂ = ${x} ÷ ${N}?`, answer: [ph], explanation: `${x} of ${N} packets sprouted, so p̂ = ${x} ÷ ${N} = ${n(ph)}.` },
    { prompt: `If H₀ is true, what is the standard error √(p₀(1 − p₀) ÷ n) with p₀ = ${n(p0)} and n = ${N}?`, answer: [se], explanation: `${n(p0)} × ${n(1 - p0)} = ${n(p0 * (1 - p0))}, so the standard error is √${n(p0 * (1 - p0))} ÷ √${N} = ${n(Math.sqrt(p0 * (1 - p0)))} ÷ ${n(Math.sqrt(N))} = ${n(se)}.` },
    { prompt: `What is z = (p̂ − p₀) ÷ standard error, to 2 decimal places?`, answer: [zr], explanation: `(${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${same(z, zr) ? ` = ${z2(zr)}` : `, which rounds to ${z2(zr)}`}.` },
    { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` }
   ] }; }
 },
 /* q23: a full z test of a supplier's claim, for a mean with σ known (k 0) or a proportion (k 1). The words of the
    claim fix the tail. For a mean, σ ÷ √n is a short decimal; for a proportion, [p₀, n] is in PROP (a small share
    that fail for a right-tailed claim, a large share that pass otherwise). 1 <= |z| <= 3, never on a rounding tie,
    and a p-value equal to α is never drawn. */
 q23: {
  canonical: { k: 0, tail: 1, a: 0.05, m0: 50, N: 25, sg: 5, xb: 48.3, c: 0, x: 0, off: 1 },
  draw: R => { for (;;) { const tail = R.int(1, 3), a = R.pick([0.01, 0.05, 0.1]), s = tail === 1 ? -1 : tail === 2 ? 1 : (R.bool() ? 1 : -1); let p;
   if (R.bool()) { const [N, sg] = R.pick([[16, 2], [16, 4], [16, 6], [25, 2], [25, 3], [25, 4], [25, 5], [36, 3], [36, 6], [64, 4], [64, 8], [100, 5], [100, 10]]), se = sg / Math.sqrt(N), m0 = R.pick([40, 45, 50, 60]);
    const k10 = R.int(Math.ceil(10 * se), Math.floor(30 * se)); p = { k: 0, tail, a, m0, N, sg, xb: rd(m0 + s * k10 / 10, 1), c: 0, x: 0 }; }
   else { const list = PROP.map((v, i) => i).filter(i => tail === 2 ? PROP[i][0] <= 0.2 : PROP[i][0] >= 0.5), c = R.pick(list), [p0, N] = PROP[c], sd = N * seOf(p0, N);
    const k = R.int(Math.ceil(sd), Math.floor(3 * sd)); p = { k: 1, tail, a, m0: 0, N: 0, sg: 0, xb: 0, c, x: Math.round(N * p0) + s * k }; if (p.x < 0 || p.x > N) continue; }
   const z = zOf23(p); if (tie(z, 2) || Math.abs(rd(z, 2)) === 0.74 || same(pval(tail, rd(z, 2)), a)) continue; return { ...p, off: R.int(0, 2) }; } },
  build: P => { const { k, tail, a, m0, N, sg, xb, c, x, off } = P, z = zOf23(P), zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0;
   let story, data, h, se, est, val, work;
   if (k === 0) { se = rd(sg / Math.sqrt(N), 4); est = xb; val = m0; h = `H₀: μ = ${m0} and Hₐ: μ ${OP[tail]} ${m0}`;
    story = [, `A supplier claims that its power cells run for ${m0} hours on average, or longer. The inspectors suspect that the true mean running time μ is lower.`,
     `A supplier says that its power cells run for ${m0} hours on average, and the outpost pays a bonus only if a test shows that the true mean running time μ is higher than ${m0} hours.`,
     `A supplier claims that its power cells run for exactly ${m0} hours on average. The inspectors want to know whether the true mean running time μ is different from ${m0} hours, in either direction: higher or lower.`][tail];
    data = `From long records the running times have standard deviation σ = ${sg} hours. A random sample of ${N} cells ran for a mean of x̄ = ${n(xb)} hours.`;
    work = `The standard error is σ ÷ √n = ${sg} ÷ √${N} = ${sg} ÷ ${n(Math.sqrt(N))} = ${n(se)}, so z = (x̄ − μ₀) ÷ (σ ÷ √n) = (${n(xb)} − ${m0}) ÷ ${n(se)} = ${n(xb - m0)} ÷ ${n(se)}`; }
   else { const [p0, NN] = PROP[c], ph = rd(x / NN, 4); se = seOf(p0, NN); est = ph; val = p0; h = `H₀: p = ${n(p0)} and Hₐ: p ${OP[tail]} ${n(p0)}`;
    const pct = n(100 * p0); story = [, `A supplier claims that ${pct}% of its valves pass the pressure test. The inspectors suspect that the true share p that pass is lower.`,
     `A supplier claims that only ${pct}% of its valves fail the pressure test. The inspectors suspect that the true share p that fail is higher.`,
     `A supplier claims that ${pct}% of its valves pass the pressure test. The inspectors want to know whether the true share p that pass is different from ${pct}%, in either direction: higher or lower.`][tail];
    data = `In a random sample of ${NN} valves, tested independently, ${x} ${tail === 2 ? 'fail' : 'pass'}.`;
    work = `p̂ = ${x} ÷ ${NN} = ${n(ph)}. If H₀ is true the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${NN}) = ${n(se)}, so z = (p̂ − p₀) ÷ ${n(se)} = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}`; }
   const zt = same(z, zr) ? ` = ${z2(zr)}` : `, which is ${z2(zr)} to 2 decimal places`;
   const cue = { 1: 'the suspicion is “lower”, so Hₐ uses < and the test is left-tailed (1)', 2: 'the question is whether it is “higher”, so Hₐ uses > and the test is right-tailed (2)', 3: '“different, in either direction” means Hₐ uses ≠ and the test is two-tailed (3)' }[tail];
   const err = d ? 'If the claim is in fact true, this rejection is a Type I error, a risk of α.' : 'If the claim is in fact false, not rejecting is a Type II error.';
   return {
   prompt: `${story} ${data} Test the claim at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the tail of the test (1 left-tailed, 2 right-tailed, 3 two-tailed), then the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
   answer: [tail, zr, d],
   hints: ['Read which direction the story asks about, whether it is what the inspectors suspect or what a test must show: “lower” makes Hₐ use <, “higher” makes it use >, and “different, in either direction” makes it use ≠. H₀ always takes the claimed value.', 'For a mean with σ known the standard error is σ ÷ √n; for a proportion it is √(p₀(1 − p₀) ÷ n). z = (estimate − claimed value) ÷ standard error, and H₀ is rejected when the p-value is less than α.'],
   solution: `The hypotheses are ${h}: ${cue}. ${work}${zt}. ${ptext(tail, zr, p)} ${dtext(p, a)} ${err} Enter ${tail}, ${z2(zr)} and ${d}.`,
   guidance: [
    { prompt: `H₀ takes the claimed value. Which way does Hₐ point? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.`, answer: [tail], explanation: `${h}: ${cue}.` },
    { prompt: `What is the standard error of the ${k === 0 ? 'sample mean' : 'sample proportion'} if H₀ is true?`, answer: [se], explanation: k === 0 ? `σ ÷ √n = ${sg} ÷ ${n(Math.sqrt(N))} = ${n(se)}.` : `√(p₀(1 − p₀) ÷ n) = √(${n(val)} × ${n(1 - val)} ÷ ${PROP[c][1]}) = ${n(se)}.` },
    { prompt: `What is z = (estimate − claimed value) ÷ standard error, to 2 decimal places?`, answer: [zr], explanation: `(${n(est)} − ${n(val)}) ÷ ${n(se)} = ${n(est - val)} ÷ ${n(se)}${same(z, zr) ? ` = ${z2(zr)}` : `, which rounds to ${z2(zr)}`}.` },
    { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` }
   ] }; }
 },
 /* q24: the two-sample t statistic (Welch: variances not pooled). (s, n) pairs from SN; df from the formula, rounded
    down, at most 30 so the printed table row exists. Right-tailed (new beats old) or two-tailed. Draws where t or the
    standard error sit on a rounding tie, where rounding the standard error to 3 places changes t, or where t lies
    within 0.05 of t*, are not drawn. Not the worked example (15 and 15 plots, 52.0 and 48.0). */
 q24: {
  canonical: { tail: 2, i: 3, j: 7, x1: 44.6, x2: 41.2 },
  draw: R => { for (;;) { const tail = R.pick([2, 3]), i = R.int(0, SN.length - 1), j = R.int(0, SN.length - 1), x2 = R.int(300, 500) / 10, dd = R.int(5, 60) / 10 * (tail === 3 && R.bool() ? -1 : 1);
   const p = { tail, i, j, x1: rd(x2 + dd, 1), x2 }, q = parts24(p); if (q.df > 30 || q.df < 4) continue;
   if (tie(q.se, 3) || tie(q.t, 2) || !same(rd(q.t, 2), rd((p.x1 - p.x2) / rd(q.se, 3), 2)) || Math.abs(Math.abs(q.t) - q.ts) < 0.05 || Math.abs(q.t) > 6) continue; return p; } },
  build: P => { const q = parts24(P), { tail } = P, { s1, n1, s2, n2, x1, x2, v1, v2, se, t, df, ts } = q, tr = rd(t, 2), d = (tail === 2 ? t > ts : Math.abs(t) > ts) ? 1 : 0;
   const crit = tail === 2 ? `with an area of 0.05 to its right` : `with an area of 0.025 beyond it in each tail`;
   const rule = tail === 2 ? `Hₐ: μ₁ > μ₂ is right-tailed, so H₀ is rejected when t is greater than t* = ${t3(ts)}.` : `Hₐ: μ₁ ≠ μ₂ is two-tailed, so H₀ is rejected when t is beyond −${t3(ts)} or ${t3(ts)}.`;
   const verdict = d ? `${z2(tr)} is ${tail === 2 ? 'greater than' : 'beyond'} ${tail === 2 ? '' : '±'}${t3(ts)}, so we reject H₀: the p-value is below 0.05.` : `${z2(tr)} is not ${tail === 2 ? 'greater than' : 'beyond'} ${tail === 2 ? '' : '±'}${t3(ts)}, so we do not reject H₀: the p-value is not below 0.05.`;
   return {
   prompt: `The Trial Fields grew the new seed on ${n1} plots and the old seed on ${n2} other plots, chosen at random. New seed: mean yield x̄₁ = ${n(x1)} kg, standard deviation s₁ = ${s1} kg. Old seed: x̄₂ = ${n(x2)} kg, s₂ = ${s2} kg. The council tests H₀: μ₁ = μ₂ against Hₐ: μ₁ ${OP[tail]} μ₂ at α = 0.05. The degrees-of-freedom formula gives df = ${df} (rounded down), and the t table gives the critical value t* = ${t3(ts)} for df = ${df}, ${crit}. Enter the two-sample t statistic to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (compare the unrounded t with t*).`,
   answer: [tr, d],
   hints: ['Each sample adds s² ÷ n to the square of the standard error: SE = √(s₁² ÷ n₁ + s₂² ÷ n₂). The two variances are not pooled.', 'If H₀ is true μ₁ − μ₂ = 0, so t = (x̄₁ − x̄₂) ÷ SE. Compare t with the critical value t* in the direction Hₐ points.'],
   solution: `s₁² ÷ n₁ = ${s1 * s1} ÷ ${n1} = ${n(v1)} and s₂² ÷ n₂ = ${s2 * s2} ÷ ${n2} = ${n(v2)}. SE = √(${n(v1)} + ${n(v2)}) = √${n(v1 + v2)} = ${f4(se)} (to 4 decimal places). t = (${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${same(t, tr) ? ` = ${z2(tr)}` : `, which is ${z2(tr)} to 2 decimal places`}. ${rule} ${verdict} Enter ${z2(tr)} and ${d}.`,
   guidance: [
    { prompt: `What are s₁² ÷ n₁ and s₂² ÷ n₂?`, answer: [v1, v2], explanation: `${s1}² = ${s1 * s1} and ${s1 * s1} ÷ ${n1} = ${n(v1)}; ${s2}² = ${s2 * s2} and ${s2 * s2} ÷ ${n2} = ${n(v2)}.` },
    { prompt: `What is the standard error SE = √(${n(v1)} + ${n(v2)}), to 3 decimal places?`, answer: [rd(se, 3)], explanation: `${n(v1)} + ${n(v2)} = ${n(v1 + v2)}, and √${n(v1 + v2)} = ${f4(se)}, which is ${(rd(se, 3)).toFixed(3).replace('-', '−')} to 3 decimal places. Keep the longer value for the next step.` },
    { prompt: `What is t = (x̄₁ − x̄₂) ÷ SE, to 2 decimal places?`, answer: [tr], explanation: `(${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${same(t, tr) ? ` = ${z2(tr)}` : `, which rounds to ${z2(tr)}`}.` },
    { prompt: `Compare the unrounded t with the critical value t* = ${t3(ts)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${rule} ${verdict}` }
   ] }; }
 },
 /* q25: the pooled proportion and the two-proportion z statistic (new minus old). Sizes from 50, 100, 125, 200, 250
    so each p̂ has at most 3 places; sprouting shares from 0.2 to 0.95; 0.8 <= |z| <= 3.2. Draws where p_c or z sit on
    a rounding tie, or where using p_c rounded to 3 places changes z, are not drawn. Not the worked example (62 and
    50 of 100 each). */
 q25: {
  canonical: { n1: 200, x1: 150, n2: 250, x2: 160 },
  draw: R => { for (;;) { const S = [50, 100, 125, 200, 250], n1 = R.pick(S), n2 = R.pick(S), x1 = R.int(Math.ceil(0.2 * n1), Math.floor(0.95 * n1)), x2 = R.int(Math.ceil(0.2 * n2), Math.floor(0.95 * n2)), p = { n1, x1, n2, x2 };
   if (n1 === 100 && n2 === 100 && x1 === 62 && x2 === 50) continue;
   const q = parts25(p); if (Math.abs(q.z) < 0.8 || Math.abs(q.z) > 3.2 || tie(q.pc, 3) || tie(q.z, 2) || !same(rd(q.z, 2), rd(q.zWith(rd(q.pc, 3)), 2))) continue; return p; } },
  build: P => { const { n1, x1, n2, x2 } = P, q = parts25(P), { p1, p2, pc, se, z } = q, pr = rd(pc, 3), zr = rd(z, 2); return {
   prompt: `The Trial Fields sowed ${n1} seeds of the new variety and ${n2} of the old, in random positions, and assume each seed sprouts independently. ${x1} of the new seeds and ${x2} of the old seeds sprouted. To test H₀: p₁ = p₂, the same sprouting share for both, enter the pooled proportion to 3 decimal places, then the z statistic for new minus old to 2 decimal places.`,
   answer: [pr, zr],
   hints: ['If H₀ is true both groups share one proportion, so pool them: p_c = (all the seeds that sprouted) ÷ (all the seeds sown).', 'z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)). Keep p_c unrounded inside the square root.'],
   solution: `p̂₁ = ${x1} ÷ ${n1} = ${n(p1)} and p̂₂ = ${x2} ÷ ${n2} = ${n(p2)}. Pooled: p_c = (${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which is ${(pr).toFixed(3).replace('-', '−')} to 3 decimal places`}. The standard error is √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})) = ${f4(se)} (to 4 decimal places), so z = (${n(p1)} − ${n(p2)}) ÷ ${f4(se)} = ${n(p1 - p2)} ÷ ${f4(se)}${same(z, zr) ? ` = ${z2(zr)}` : `, which is ${z2(zr)} to 2 decimal places`}. Enter ${n(pr)} and ${z2(zr)}.`,
   guidance: [
    { prompt: `What are the two sample proportions, p̂₁ for the new seed and p̂₂ for the old?`, answer: [p1, p2], explanation: `p̂₁ = ${x1} ÷ ${n1} = ${n(p1)} and p̂₂ = ${x2} ÷ ${n2} = ${n(p2)}.` },
    { prompt: `What is the pooled proportion p_c = (x₁ + x₂) ÷ (n₁ + n₂), to 3 decimal places?`, answer: [pr], explanation: `(${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which rounds to ${n(pr)}`}.` },
    { prompt: `What is z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})), to 2 decimal places?`, answer: [zr], explanation: `1 ÷ ${n1} + 1 ÷ ${n2} = ${n(1 / n1 + 1 / n2)}, so the standard error is ${f4(se)} to 4 decimal places, and (${n(p1)} − ${n(p2)}) ÷ ${f4(se)}${same(z, zr) ? ` = ${z2(zr)}` : ` rounds to ${z2(zr)}`}.` }
   ] }; }
 },
 /* q26: matched pairs. 5 to 8 plots; old yields 20 to 40 kg; differences (new − old) from −3 to 9 with a whole-number
    mean of 1 to 6 and not all equal. Draws where t sits on a rounding tie, or where using s_d rounded to 2 places
    changes t, are not drawn. Not the worked example (differences 2, 4, 0, 3, 6). */
 q26: {
  canonical: { old: [31, 26, 35, 29, 38, 24, 33], dif: [4, 1, 6, 3, 5, 0, 2] },
  draw: R => { for (;;) { const N = R.int(5, 8), old = [], dif = []; for (let i = 0; i < N; i++) { old.push(R.int(20, 40)); dif.push(R.int(-3, 9)); }
   const q = parts26({ old, dif }); if (q.sum % N !== 0 || q.m < 1 || q.m > 6 || q.ss === 0 || tie(q.t, 2) || tie(q.sd, 2) || !same(rd(q.t, 2), rd(q.m / (rd(q.sd, 2) / Math.sqrt(N)), 2))) continue;
   if (N === 5 && dif.join() === '2,4,0,3,6') continue; return { old, dif }; } },
  build: P => { const { old, dif } = P, q = parts26(P), { N, sum, m, ss, sd, t } = q, tr = rd(t, 2), neu = old.map((o, i) => o + dif[i]);
   const list = old.map((o, i) => `${LETTERS[i]} ${o} and ${neu[i]}`).join('; '), dl = dif.map(n).join(', '), dev = dif.map(x => n((x - m) * (x - m))).join(' + ');
   return {
   prompt: `The Trial Fields planted ${N} plots with the old seed one season and the new seed the next, so each plot gives a matched pair. Yields in kg, old then new: ${list}. Take each difference as new minus old. Enter the mean difference x̄d in kg, then the t statistic for testing H₀: μd = 0, to 2 decimal places.`,
   answer: [m, tr],
   hints: ['Work only with the differences, one per plot: new yield minus old yield. They are the data now.', 'Find the mean x̄d and the sample standard deviation s_d of the differences (divide by n − 1), then t = x̄d ÷ (s_d ÷ √n), with n the number of pairs.'],
   solution: `The differences are ${dl}. Their sum is ${n(sum)}, so x̄d = ${n(sum)} ÷ ${N} = ${n(m)} kg. The squared distances from the mean add to ${dev} = ${n(ss)}, so s_d = √(${n(ss)} ÷ ${N - 1}) = ${f4(sd)} (to 4 decimal places). t = ${n(m)} ÷ (${f4(sd)} ÷ √${N}) = ${n(m)} ÷ ${f4(sd / Math.sqrt(N))}${same(t, tr) ? ` = ${z2(tr)}` : `, which is ${z2(tr)} to 2 decimal places`}, with df = ${N - 1}. Enter ${n(m)} and ${z2(tr)}.`,
   guidance: [
    { prompt: `Work out the ${N} differences, new minus old. What is their sum, and what is their mean x̄d?`, answer: [sum, m], explanation: `The differences are ${dl}. They add to ${n(sum)}, and ${n(sum)} ÷ ${N} = ${n(m)}.` },
    { prompt: `Subtract the mean ${n(m)} from each difference and square. What do the squares add to?`, answer: [ss], explanation: `${dev} = ${n(ss)}.` },
    { prompt: `What is the standard deviation of the differences, s_d = √(${n(ss)} ÷ ${N - 1}), to 2 decimal places?`, answer: [rd(sd, 2)], explanation: `${n(ss)} ÷ ${N - 1} = ${n(rd(ss / (N - 1), 4))}${same(ss / (N - 1), rd(ss / (N - 1), 4)) ? '' : ' (to 4 decimal places)'}, and its square root is ${f4(sd)}, which is ${(rd(sd, 2)).toFixed(2).replace('-', '−')} to 2 decimal places. Keep the longer value for the next step.` },
    { prompt: `What is t = x̄d ÷ (s_d ÷ √${N}), to 2 decimal places?`, answer: [tr], explanation: `s_d ÷ √${N} = ${f4(sd)} ÷ ${f4(Math.sqrt(N))} = ${f4(sd / Math.sqrt(N))}, and ${n(m)} ÷ ${f4(sd / Math.sqrt(N))}${same(t, tr) ? ` = ${z2(tr)}` : ` rounds to ${z2(tr)}`}.` }
   ] }; }
 },
 /* q27: chi-square goodness of fit, three categories. Claimed shares from SHARES and a sample size that makes every
    expected count a whole number of at least 5; observed counts differ from them by −12 to 12 (not all 0); χ² never
    on a rounding tie. Not the worked example (shares 60, 30, 10 of 100). */
 q27: {
  canonical: { s: 0, N: 120, d1: -8, d2: 5 },
  draw: R => { for (;;) { const s = R.int(0, SHARES.length - 1), N = R.pick([80, 100, 120, 160, 200]), d1 = R.int(-12, 12), d2 = R.int(-12, 12), E = SHARES[s].map(v => v * N / 100);
   if (E.some(e => !Number.isInteger(e) || e < 5) || (d1 === 0 && d2 === 0)) continue; const O = [E[0] + d1, E[1] + d2, E[2] - d1 - d2];
   if (O.some(o => o < 0) || tie(chi(O, E), 2)) continue; return { s, N, d1, d2 }; } },
  build: ({ s, N, d1, d2 }) => { const sh = SHARES[s], E = sh.map(v => v * N / 100), O = [E[0] + d1, E[1] + d2, E[2] - d1 - d2], x = chi(O, E), xr = rd(x, 2), sq = O.map((o, i) => (o - E[i]) * (o - E[i]));
   const terms = O.map((o, i) => `${sq[i]} ÷ ${E[i]}`).join(' + '); return {
   prompt: `A seed supplier claims that its mixed sacks hold ${sh[0]}% large, ${sh[1]}% medium and ${sh[2]}% small seeds. The Trial Fields sorted a random sample of ${N} seeds from one sack: ${O[0]} large, ${O[1]} medium and ${O[2]} small. Enter the expected counts of large, medium and small seeds if the claim is true, then the chi-square statistic χ² to 2 decimal places.`,
   answer: [E[0], E[1], E[2], xr],
   hints: ['An expected count is the claimed share times the sample size: what the claim says we should see.', 'For each category work out (O − E)² ÷ E, with O the observed count and E the expected count, and add the three results.'],
   solution: `Expected counts: ${sh[0]}% of ${N} is ${E[0]}, ${sh[1]}% is ${E[1]} and ${sh[2]}% is ${E[2]}. The differences O − E are ${O.map((o, i) => n(o - E[i])).join(', ')}, with squares ${sq.join(', ')}. χ² = ${terms}${same(x, xr) ? ` = ${n(xr)}` : `, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${E.join(', ')} and ${n(xr)}.`,
   guidance: [
    { prompt: `If the claim is true, how many large, medium and small seeds should a sample of ${N} hold?`, answer: E.slice(), explanation: `${sh[0]}% of ${N} = ${E[0]}, ${sh[1]}% of ${N} = ${E[1]} and ${sh[2]}% of ${N} = ${E[2]}. They add to ${N}, as they must.` },
    { prompt: `For each category, what is (O − E)²?`, answer: sq.slice(), explanation: `${O.map((o, i) => `(${o} − ${E[i]})² = ${sq[i]}`).join(', ')}.` },
    { prompt: `What is χ² = ${terms}, to 2 decimal places?`, answer: [xr], explanation: `${O.map((o, i) => `${sq[i]} ÷ ${E[i]} = ${n(rd(sq[i] / E[i], 4))}`).join(', ')}. Their sum${same(x, xr) ? ` is ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
   ] }; }
 },
 /* q28: chi-square test of independence on a 2 × 3 table (rows new and old seed, columns poor, fair, good). Row
    shares and column shares are tenths and N is 100 or 200, so every expected count is a whole number of at least 6;
    two free changes d1, d2 keep every row and column total. One cell (r, c) is asked for. χ² is never on a rounding
    tie. Not the worked example's table. */
 q28: {
  canonical: { N: 200, a: 5, b: [3, 3, 4], d1: -8, d2: 3, r: 0, c: 2 },
  draw: R => { for (;;) { const N = R.pick([100, 200]), a = R.int(3, 7), b1 = R.int(2, 5), b2 = R.int(2, 6), b = [b1, b2, 10 - b1 - b2];
   if (b[2] < 2) continue; const p = { N, a, b, d1: R.int(-9, 9), d2: R.int(-9, 9), r: R.int(0, 1), c: R.int(0, 2) }, q = parts28(p);
   if ((p.d1 === 0 && p.d2 === 0) || q.E.flat().some(e => e < 6) || q.O.flat().some(o => o < 1) || tie(q.x, 2)) continue; return p; } },
  build: P => { const q = parts28(P), { E, O, Rt, Ct, x } = q, { N, r, c } = P, xr = rd(x, 2), SEED = ['new', 'old'], GR = ['poor', 'fair', 'good'];
   const all = E.map((row, i) => `${SEED[i]} ${row.join(', ')}`).join('; '); return {
   prompt: `The Trial Fields graded the harvest of ${N} plots. New seed: ${O[0][0]} poor, ${O[0][1]} fair, ${O[0][2]} good. Old seed: ${O[1][0]} poor, ${O[1][1]} fair, ${O[1][2]} good. To test H₀: the grade is independent of the seed, enter the expected count for ${SEED[r]} seed with a ${GR[c]} harvest, then the degrees of freedom, then χ² to 2 decimal places.`,
   answer: [E[r][c], 2, xr],
   hints: ['If H₀ is true, the expected count of a cell is (row total × column total) ÷ grand total.', 'df = (number of rows − 1) × (number of columns − 1). χ² adds (O − E)² ÷ E over all six cells.'],
   solution: `The row totals are ${Rt.join(' and ')}, the column totals ${Ct.join(', ')}, and the grand total ${N}. The ${SEED[r]}-seed, ${GR[c]} cell expects ${Rt[r]} × ${Ct[c]} ÷ ${N} = ${E[r][c]}. The table has 2 rows and 3 columns, so df = (2 − 1) × (3 − 1) = 2. The six expected counts are ${all}, and adding (O − E)² ÷ E over the six cells gives χ² = ${same(x, xr) ? n(xr) : `${n(rd(x, 4))}, which is ${(xr).toFixed(2).replace('-', '−')} to 2 decimal places`}. Enter ${E[r][c]}, 2 and ${n(xr)}.`,
   guidance: [
    { prompt: `For the ${SEED[r]}-seed, ${GR[c]} cell: what is its row total, its column total, and the grand total?`, answer: [Rt[r], Ct[c], N], explanation: `The ${SEED[r]}-seed row adds to ${Rt[r]}, the ${GR[c]} column adds to ${Ct[c]}, and all the plots add to ${N}.` },
    { prompt: `What is that cell's expected count, row total × column total ÷ grand total?`, answer: [E[r][c]], explanation: `${Rt[r]} × ${Ct[c]} ÷ ${N} = ${Rt[r] * Ct[c]} ÷ ${N} = ${E[r][c]}.` },
    { prompt: `The table has 2 rows and 3 columns. What is df?`, answer: [2], explanation: `df = (2 − 1) × (3 − 1) = 1 × 2 = 2.` },
    { prompt: `The six expected counts are ${all}. What is χ², the sum of (O − E)² ÷ E over the six cells, to 2 decimal places?`, answer: [xr], explanation: `${O.flatMap((row, i) => row.map((o, j) => `(${o} − ${E[i][j]})² ÷ ${E[i][j]}`)).join(' + ')}${same(x, xr) ? ` = ${n(xr)}` : ` rounds to ${xr.toFixed(2)}`}.` }
   ] }; }
 },
 /* q29: choose the test (1 two-sample t, 2 matched-pairs t, 3 goodness of fit, 4 independence), then its statistic.
    k picks the story. Each statistic is never on a rounding tie. Not the worked example (a 2 × 2 table of 100 plots). */
 q29: {
  canonical: { k: 2, A: 16, B: 1.8, C: 3.2, D: 0, E: 0, F: 0 },
  draw: R => { for (;;) { const k = R.int(1, 4); let p;
   if (k === 1) { const [s1, n1] = R.pick(SN), [s2, n2] = R.pick(SN), x2 = R.int(300, 500) / 10, dd = R.int(5, 50) / 10 * (R.bool() ? 1 : -1); p = { k, A: SN.findIndex(v => v[0] === s1 && v[1] === n1), B: SN.findIndex(v => v[0] === s2 && v[1] === n2), C: rd(x2 + dd, 1), D: x2, E: 0, F: 0 }; }
   else if (k === 2) { p = { k, A: R.pick([9, 16, 25, 36]), B: R.int(5, 40) / 10, C: R.pick([1.2, 1.5, 1.8, 2.4, 3, 3.6, 4.2, 4.8, 6]), D: 0, E: 0, F: 0 }; }
   else if (k === 3) { const s = R.int(0, SHARES.length - 1), N = R.pick([80, 100, 120, 200]), d1 = R.int(-12, 12), d2 = R.int(-12, 12), Ex = SHARES[s].map(v => v * N / 100);
    if (Ex.some(e => !Number.isInteger(e) || e < 5) || (d1 === 0 && d2 === 0) || Ex[2] - d1 - d2 < 0 || Ex[0] + d1 < 0 || Ex[1] + d2 < 0) continue; p = { k, A: s, B: N, C: d1, D: d2, E: 0, F: 0 }; }
   else { const N = R.pick([100, 200]), a = R.int(3, 7), b = R.int(3, 7), d = R.nz(-9, 9); p = { k, A: N, B: a, C: b, D: d, E: 0, F: 0 }; if (parts29(p).E4.flat().some(e => e < 6) || parts29(p).O4.flat().some(o => o < 0)) continue; }
   const s = parts29(p).stat; if (tie(s, 2) || Math.abs(s) < 0.3 || Math.abs(s) > 9) continue; if (k === 2 && p.A === 16 && p.B === 1.8 && p.C === 3.2) continue; if (k === 4 && p.A === 100 && p.B === 4 && p.C === 6 && p.D === 6) continue; return p; } },
  build: P => { const q = parts29(P), { k } = P, sr = rd(q.stat, 2), sn = k <= 2 ? 't' : 'χ²', name = ['', 'two-sample t test', 'matched-pairs t test', 'chi-square goodness-of-fit test', 'chi-square test of independence'][k];
   const why = ['', 'two different groups of plots give two separate sets of measurements, so the two means are independent', 'the same plots are measured twice, so each plot gives one difference and the differences are the data', 'counts in categories are checked against claimed shares', 'counts are sorted two ways at once in a two-way table'][k];
   return {
   prompt: `${q.story} Which test fits? 1 two-sample t test (two independent means), 2 matched-pairs t test, 3 chi-square goodness-of-fit test, 4 chi-square test of independence. Enter the number of the test, then its statistic (${k <= 2 ? 't' : 'χ²'}) to 2 decimal places.`,
   answer: [k, sr],
   hints: ['First ask: are the data measurements (kilograms) or counts in categories? Measurements of two groups call for a t test; counts call for chi-square.', 'Measurements: the same plots twice means matched pairs, different plots means two independent samples. Counts: claimed shares mean goodness of fit, a two-way table means independence.'],
   solution: `This is test ${k}, the ${name}: ${why}. ${q.work}${same(q.stat, sr) ? ` = ${z2(sr)}` : `, which is ${z2(sr)} to 2 decimal places`}. Enter ${k} and ${z2(sr)}.`,
   guidance: [
    { prompt: `Measurements or counts, and how are the groups formed? Enter the number of the test that fits.`, answer: [k], explanation: `Test ${k}, the ${name}: ${why}.` },
    { prompt: `Work out the statistic ${sn} for this test, to 2 decimal places.`, answer: [sr], explanation: `${q.work}${same(q.stat, sr) ? ` = ${z2(sr)}` : `, which rounds to ${z2(sr)}`}.` }
   ] }; }
 },
 /* q30: the correlation coefficient r of five points. k 0: hours of sunlight x and power output y (rising); k 1: hours
    of dust haze and output (falling). x distinct whole numbers from 1 to 12; 0.5 <= |r| <= 0.97; r never on a
    rounding tie. The worked example has four points, so no draw repeats it. */
 q30: {
  canonical: { k: 0, x: [4, 6, 7, 9, 10], y: [8, 12, 10, 15, 14] },
  draw: R => { for (;;) { const k = R.int(0, 1), xs = new Set(); while (xs.size < 5) xs.add(R.int(1, 12)); const x = [...xs].sort((u, v) => u - v), b = R.pick([1, 2]), c = R.int(2, 8);
   const y = x.map(v => k === 0 ? c + b * v + R.int(-3, 3) : 30 - b * v + R.int(-3, 3)); if (y.some(v => v < 2)) continue;
   const q = parts30({ k, x, y }); if (q.A === 0 || q.B === 0) continue; const r = q.top / Math.sqrt(q.A * q.B); if (Math.abs(r) < 0.5 || Math.abs(r) > 0.97 || tie(r, 2)) continue;
   return { k, x, y }; } },
  build: P => { const { k, x, y } = P, q = parts30(P), { Sx, Sy, Sxx, Syy, Sxy, top, A, B } = q, r = top / Math.sqrt(A * B), rr = rd(r, 2);
   const pts = x.map((v, i) => `(${v}, ${y[i]})`).join(', '), what = k === 0 ? 'hours of sunlight x' : 'hours of dust haze x'; return {
   prompt: `The Solar Farm logged five days, each with its ${what} and its power output y in MWh: ${pts}. Enter the correlation coefficient r to 2 decimal places.`,
   answer: [rr],
   hints: ['Tabulate the five sums first: Σx, Σy, Σx², Σy² and Σxy, where Σxy adds x × y for each point.', 'r = (nΣxy − ΣxΣy) ÷ √((nΣx² − (Σx)²)(nΣy² − (Σy)²)), with n = 5. Its sign shows the direction of the pattern.'],
   solution: `Σx = ${Sx}, Σy = ${Sy}, Σx² = ${Sxx}, Σy² = ${Syy} and Σxy = ${Sxy}. The top is 5 × ${Sxy} − ${Sx} × ${Sy} = ${n(top)}. The bottom is √((5 × ${Sxx} − ${Sx}²)(5 × ${Syy} − ${Sy}²)) = √(${A} × ${B}) = ${n(rd(Math.sqrt(A * B), 4))}. So r = ${n(top)} ÷ ${n(rd(Math.sqrt(A * B), 4))}, which is ${(rr).toFixed(2).replace('-', '−')} to 2 decimal places: ${r > 0 ? 'more' : 'less'} output goes with more hours of ${k === 0 ? 'sunlight' : 'haze'}, ${Math.abs(r) >= 0.8 ? 'a strong' : 'a moderate'} ${r > 0 ? 'positive' : 'negative'} linear relationship. Enter ${n(rr)}.`,
   guidance: [
    { prompt: `What are Σx and Σy, the sums of the x values and of the y values?`, answer: [Sx, Sy], explanation: `${x.join(' + ')} = ${Sx} and ${y.join(' + ')} = ${Sy}.` },
    { prompt: `What are Σx², Σy² and Σxy? Type each number in full, without commas inside it.`, answer: [Sxx, Syy, Sxy], explanation: `Σx² = ${x.map(v => `${v}²`).join(' + ')} = ${Sxx}; Σy² = ${y.map(v => `${v}²`).join(' + ')} = ${Syy}; Σxy = ${x.map((v, i) => `${v} × ${y[i]}`).join(' + ')} = ${Sxy}.` },
    { prompt: `What is the top of the formula, nΣxy − ΣxΣy, with n = 5?`, answer: [top], explanation: `5 × ${Sxy} − ${Sx} × ${Sy} = ${5 * Sxy} − ${Sx * Sy} = ${n(top)}.` },
    { prompt: `What are nΣx² − (Σx)² and nΣy² − (Σy)²? Type each number in full, without commas inside it.`, answer: [A, B], explanation: `5 × ${Sxx} − ${Sx}² = ${5 * Sxx} − ${Sx * Sx} = ${A}, and 5 × ${Syy} − ${Sy}² = ${5 * Syy} − ${Sy * Sy} = ${B}.` },
    { prompt: `What is r = ${n(top)} ÷ √(${A} × ${B}), to 2 decimal places?`, answer: [rr], explanation: `${A} × ${B} = ${A * B}, whose square root is ${n(rd(Math.sqrt(A * B), 4))}, and ${n(top)} ÷ ${n(rd(Math.sqrt(A * B), 4))} rounds to ${n(rr)}.` }
   ] }; }
 }
});
/* ---------- the working behind q23, q24, q25, q26, q28, q29, q30 ---------- */
function zOf23({ k, xb, m0, sg, N, c, x }) { if (k === 0) return (xb - m0) / (sg / Math.sqrt(N)); const [p0, NN] = PROP[c]; return (rd(x / NN, 4) - p0) / seOf(p0, NN); }
function parts24({ tail, i, j, x1, x2 }) { const [s1, n1] = SN[i], [s2, n2] = SN[j], v1 = rd(s1 * s1 / n1, 3), v2 = rd(s2 * s2 / n2, 3), se = Math.sqrt(v1 + v2), df = welch(v1, n1, v2, n2);
 return { s1, n1, s2, n2, x1, x2, v1, v2, se, t: (x1 - x2) / se, df, ts: (tail === 2 ? T05 : T025)[Math.min(df, 30)] || 0 }; }
function parts25({ n1, x1, n2, x2 }) { const p1 = rd(x1 / n1, 3), p2 = rd(x2 / n2, 3), pc = (x1 + x2) / (n1 + n2), zWith = pp => (p1 - p2) / Math.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2));
 return { p1, p2, pc, se: Math.sqrt(pc * (1 - pc) * (1 / n1 + 1 / n2)), z: zWith(pc), zWith }; }
function parts26({ dif }) { const N = dif.length, sum = dif.reduce((s, v) => s + v, 0), m = sum / N, ss = dif.reduce((s, v) => s + (v - m) * (v - m), 0), sd = Math.sqrt(ss / (N - 1));
 return { N, sum, m, ss, sd, t: sd > 0 ? m / (sd / Math.sqrt(N)) : 0 }; }
function parts28({ N, a, b, d1, d2 }) { const Rt = [N * a / 10, N * (10 - a) / 10], Ct = b.map(v => N * v / 10), E = Rt.map(r => Ct.map(c => r * c / N));
 const D = [d1, d2, -d1 - d2], O = [E[0].map((e, j) => e + D[j]), E[1].map((e, j) => e - D[j])]; return { Rt, Ct, E, O, x: chi(O[0], E[0]) + chi(O[1], E[1]) }; }
function parts29({ k, A, B, C, D }) {
 if (k === 1) { const [s1, n1] = SN[A], [s2, n2] = SN[B], v1 = rd(s1 * s1 / n1, 3), v2 = rd(s2 * s2 / n2, 3), se = Math.sqrt(v1 + v2), x1 = C, x2 = D;
  return { stat: (x1 - x2) / se, story: `The new seed grew on ${n1} plots and the old seed on ${n2} different plots, chosen at random. New: mean yield ${n(x1)} kg, standard deviation ${s1} kg. Old: mean ${n(x2)} kg, standard deviation ${s2} kg. The council asks whether the mean yields differ; take new minus old.`,
   work: `SE = √(${s1 * s1} ÷ ${n1} + ${s2 * s2} ÷ ${n2}) = √(${n(v1)} + ${n(v2)}) = ${n(rd(se, 4))}${same(se, rd(se, 4)) ? '' : ' (to 4 decimal places)'}, and t = (${n(x1)} − ${n(x2)}) ÷ ${n(rd(se, 4))}` }; }
 if (k === 2) { const N = A, md = B, sd = C, se = sd / Math.sqrt(N);
  return { stat: md / se, story: `The same ${N} plots were sown with the old seed one season and the new seed the next. The ${N} differences in yield, new minus old, have mean ${n(md)} kg and standard deviation ${n(sd)} kg. The council asks whether the new seed raises the yield, testing H₀: μd = 0.`,
   work: `s_d ÷ √n = ${n(sd)} ÷ √${N} = ${n(sd)} ÷ ${n(Math.sqrt(N))} = ${n(rd(se, 4))}, and t = ${n(md)} ÷ ${n(rd(se, 4))}` }; }
 if (k === 3) { const sh = SHARES[A], N = B, E = sh.map(v => v * N / 100), O = [E[0] + C, E[1] + D, E[2] - C - D];
  return { stat: chi(O, E), story: `A supplier claims that its sacks hold ${sh[0]}% large, ${sh[1]}% medium and ${sh[2]}% small seeds. A random sample of ${N} seeds held ${O[0]} large, ${O[1]} medium and ${O[2]} small. The council asks whether the claim fits.`,
   work: `The expected counts are ${E.join(', ')}, so χ² = ${O.map((o, i) => `(${o} − ${E[i]})² ÷ ${E[i]}`).join(' + ')}` }; }
 const q = parts29.four(P29(A, B, C, D));
 return { stat: q.x, E4: q.E, O4: q.O, story: `The Trial Fields sowed ${A} plots, some with the new seed and some with the old, and each plot’s crop was graded healthy or blighted. New seed: ${q.O[0][0]} healthy, ${q.O[0][1]} blighted. Old seed: ${q.O[1][0]} healthy, ${q.O[1][1]} blighted. The council asks whether blight is independent of the seed.`,
  work: `Row totals ${q.Rt.join(' and ')}, column totals ${q.Ct.join(' and ')}, so the expected counts (row total × column total ÷ ${A}) are ${q.E.flat().join(', ')}, and χ² = ${q.O.flatMap((row, i) => row.map((o, j) => `(${o} − ${q.E[i][j]})² ÷ ${q.E[i][j]}`)).join(' + ')}` };
}
/* A 2 × 2 table of N plots: a tenths of them new seed, b tenths healthy, every cell moved by ±d. */
function P29(N, a, b, d) { return { N, a, b, d }; }
parts29.four = ({ N, a, b, d }) => { const Rt = [N * a / 10, N * (10 - a) / 10], Ct = [N * b / 10, N * (10 - b) / 10], E = Rt.map(r => Ct.map(c => r * c / N)), O = [[E[0][0] + d, E[0][1] - d], [E[1][0] - d, E[1][1] + d]];
 return { Rt, Ct, E, O, x: chi(O[0], E[0]) + chi(O[1], E[1]) }; };
function parts30({ x, y }) { const s = f => x.reduce((t, v, i) => t + f(v, y[i]), 0), Sx = s(v => v), Sy = s((v, w) => w), Sxx = s(v => v * v), Syy = s((v, w) => w * w), Sxy = s((v, w) => v * w);
 return { Sx, Sy, Sxx, Syy, Sxy, top: 5 * Sxy - Sx * Sy, A: 5 * Sxx - Sx * Sx, B: 5 * Syy - Sy * Sy }; }
})();
