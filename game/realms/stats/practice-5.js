/* Data and inference practice missions, file 5 of 8: concepts q21–q25, three practice missions each
   (q21b q21c q21d q22b q22c q22d q23b q23c q23d q24b q24c q24d q25b q25c q25d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p5.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
const PRACTICE = window.PRACTICE = window.PRACTICE || [];
const GEN = window.MISSION_GEN = window.MISSION_GEN || {};
/* Registers one practice mission and its generator {canonical, draw(R), build(p)}. */
const add = (mission, generator) => { PRACTICE.push(mission); GEN[mission.id] = generator; };


/* Builds the authored mission from build(canonical), so the authored text and the generator can never drift apart.
   meta: id, parent, kind, title, brief, labels, tolerance, gl (labels of each guided step), uses (optional). */
const mk = (meta, gen) => {
 const b = gen.build(gen.canonical), { gl, ...m } = meta;
 add({ ...m, prompt: b.prompt, answer: b.answer, hints: b.hints, solution: b.solution,
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: gl[i], explanation: g.explanation })) }, gen);
};
/* Fixed decimals with a typographic minus; rd rounds half away from zero; tie: x sits on a rounding tie at d decimals (such
   draws are never made); same: equal up to float noise. */
const fx = (x, d) => { const k = Math.pow(10, d), v = Math.round(Math.abs(x) * k + 1e-9) / k; return (x < 0 && v > 0 ? '−' : '') + v.toFixed(d); };
const rd = (x, d) => Number(fx(x, d).replace('−', '-'));
const tie = (x, d) => { const v = Math.abs(x) * Math.pow(10, d); return Math.abs(v - Math.floor(v) - 0.5) < 1e-6; };
const same = (a, b) => Math.abs(a - b) < 1e-9;
const z2 = x => fx(x, 2), f4 = x => fx(x, 4);
/* ' = 2.5' when z is already a 2-place number, ', which is 2.53 to 2 decimal places' when it was rounded. */
const zt = (z, zr) => same(z, zr) ? ` = ${z2(zr)}` : `, which is ${z2(zr)} to 2 decimal places`;
const OP = { 1: '<', 2: '>', 3: '≠' }, TAIL = { 1: 'left-tailed', 2: 'right-tailed', 3: 'two-tailed' };
/* The normal table: area under the standard normal curve to the left of z (Simpson's rule), to 4 decimal places.
   rows(z, off): three consecutive rows, the row of z in place off (0 first, 1 middle, 2 last), so the table does not
   point at z when the player must compute it. rowsOK: no row from z − 0.02 to z + 0.02 sits on a rounding tie (covers every off). */
const phiRaw = z => { const m = Math.abs(z), N = 2000, h = m / N, f = x => Math.exp(-x * x / 2); let s = f(0) + f(m);
 for (let i = 1; i < N; i++) s += f(i * h) * (i % 2 ? 4 : 2);
 const half = s * h / 3 / Math.sqrt(2 * Math.PI); return z < 0 ? 0.5 - half : 0.5 + half; };
const phi4 = z => rd(phiRaw(z), 4);
const rowsOK = z => [-2, -1, 0, 1, 2].every(k => !tie(phiRaw(rd(z + k / 100, 2)), 4));
const rows = (z, off = 1) => [0, 1, 2].map(k => { const r = rd(z + (k - off) / 100, 2); return `${z2(r)} → ${f4(phi4(r))}`; }).join(', ');
/* The p-value of a z test from the table row of z (z already rounded to 2 places), and the words that work it out. */
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
/* Small claimed shares only (for "faulty" claims) and large ones only (for "pass" claims). */
const LOW = [1, 2, 5, 6], HIGH = [0, 3, 4, 7, 8, 9, 10];
/* Mean tests with σ known: [n, σ] pairs whose standard error σ ÷ √n is a short decimal. */
const MP = [[16, 2], [16, 4], [16, 6], [25, 2], [25, 3], [25, 4], [25, 5], [36, 3], [36, 6], [64, 4], [64, 8], [100, 5], [100, 10]];
/* A sample mean 1 to 3 standard errors from m0 on the side of the tail (sign s), in tenths. */
const meanX = (R, m0, N, sg, s) => { const se = sg / Math.sqrt(N); return rd(m0 + s * R.int(Math.ceil(rd(10 * se, 6)), Math.floor(rd(30 * se, 6))) / 10, 1); };
const sgn = (R, tail) => tail === 1 ? -1 : tail === 2 ? 1 : (R.bool() ? 1 : -1);
/* The z of a mean test; the standard error is exact. */
const zMean = (xb, m0, N, sg) => rd(xb - m0, 4) / rd(sg / Math.sqrt(N), 4);
const zOfProp = (c, x) => { const [p0, N] = PROP[c]; return (rd(x / N, 4) - p0) / seOf(p0, N); };
/* Draw a count for PROP[c] that lies about 1 to 3 standard errors from the claim, on the side s (a whole number: for n = 625 the claim is 312.5 and is rounded to 313). */
const propX = (R, c, s) => { const [p0, N] = PROP[c], sd = N * seOf(p0, N), k = R.int(Math.ceil(sd), Math.floor(3 * sd)); return Math.round(N * p0) + s * k; };
/* t critical values (OpenStax t table): T05[df] has area 0.05 to its right, T025[df] area 0.025. */
const T05 = [0, 6.314, 2.920, 2.353, 2.132, 2.015, 1.943, 1.895, 1.860, 1.833, 1.812, 1.796, 1.782, 1.771, 1.761, 1.753, 1.746, 1.740, 1.734, 1.729, 1.725, 1.721, 1.717, 1.714, 1.711, 1.708, 1.706, 1.703, 1.701, 1.699, 1.697];
const T025 = [0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.160, 2.145, 2.131, 2.120, 2.110, 2.101, 2.093, 2.086, 2.080, 2.074, 2.069, 2.064, 2.060, 2.056, 2.052, 2.048, 2.045, 2.042];
const t3 = x => x.toFixed(3);
/* Two-sample summaries: (s, n) with s² ÷ n at most 3 decimal places; df by the long formula, rounded down. */
const SN = []; for (const N of [10, 16, 20, 25]) for (const s of [2, 3, 4, 5, 6, 8]) { const v = s * s / N; if (same(rd(v, 3), v)) SN.push([s, N]); }
const welch = (v1, n1, v2, n2) => Math.floor((v1 + v2) * (v1 + v2) / (v1 * v1 / (n1 - 1) + v2 * v2 / (n2 - 1)));
/* Everything a two-sample t test needs: variances per sample, SE, t, df, critical value (tail 2 right-tailed, 3 two-tailed) and the decision. */
const core24 = ({ tail, i, j, x1, x2 }) => { const [s1, n1] = SN[i], [s2, n2] = SN[j], v1 = rd(s1 * s1 / n1, 3), v2 = rd(s2 * s2 / n2, 3), se = Math.sqrt(v1 + v2), df = welch(v1, n1, v2, n2),
 t = (x1 - x2) / se, ts = (tail === 2 ? T05 : T025)[Math.min(df, 30)] || 0, tr = rd(t, 2), d = (tail === 2 ? t > ts : Math.abs(t) > ts) ? 1 : 0;
 const crit = tail === 2 ? 'with an area of 0.05 to its right' : 'with an area of 0.025 beyond it in each tail';
 const rule = tail === 2 ? `Hₐ: μ₁ > μ₂ is right-tailed, so H₀ is rejected when t is greater than t* = ${t3(ts)}.` : `Hₐ: μ₁ ≠ μ₂ is two-tailed, so H₀ is rejected when t is beyond −${t3(ts)} or ${t3(ts)}.`;
 const verdict = d ? `${z2(tr)} is ${tail === 2 ? 'greater than' : 'beyond'} ${tail === 2 ? '' : '±'}${t3(ts)}, so we reject H₀: the p-value is below 0.05.` : `${z2(tr)} is not ${tail === 2 ? 'greater than' : 'beyond'} ${tail === 2 ? '' : '±'}${t3(ts)}, so we do not reject H₀: the p-value is not below 0.05.`;
 return { s1, n1, s2, n2, x1, x2, v1, v2, se, df, t, ts, tr, d, crit, rule, verdict }; };
/* The draw filter of every two-sample test: df in range, no rounding ties, t not within 0.05 of t*, and the 3-place SE gives the same t. */
const ok24 = p => { const q = core24(p); return q.df >= 4 && q.df <= 30 && !tie(q.se, 3) && !tie(q.t, 2) && same(rd(q.t, 2), rd((p.x1 - p.x2) / rd(q.se, 3), 2)) && Math.abs(Math.abs(q.t) - q.ts) >= 0.05 && Math.abs(q.t) <= 6; };
const h24 = ['Each sample adds s² ÷ n to the square of the standard error: SE = √(s₁² ÷ n₁ + s₂² ÷ n₂). The two variances are not pooled.', 'If H₀ is true μ₁ − μ₂ = 0, so t = (x̄₁ − x̄₂) ÷ SE. Compare t with the critical value t* in the direction Hₐ points.'];
/* Two proportions: p̂ values, pooled proportion, standard error, z (new minus old) and z computed from the pooled proportion rounded to 3 places. */
const core25 = ({ n1, x1, n2, x2 }) => { const p1 = x1 / n1, p2 = x2 / n2, pc = (x1 + x2) / (n1 + n2), zWith = pp => (p1 - p2) / Math.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2));
 return { p1, p2, pc, pr: rd(pc, 3), se: Math.sqrt(pc * (1 - pc) * (1 / n1 + 1 / n2)), z: zWith(pc), zWith }; };
const ok25 = (p, lo, hi) => { const q = core25(p), zr = rd(q.z, 2); return Math.abs(q.z) >= lo && Math.abs(q.z) <= hi && !tie(q.pc, 3) && !tie(q.z, 2) && same(zr, rd(q.zWith(q.pr), 2)); };

/* ---- q21 The p-value and the decision [9.4] ---- */

mk({
 id: 'q21b', parent: 'q21', kind: 'setting', title: 'The climbing rope proof test',
 brief: 'The lift cage hangs on ropes from a new maker, and the Hall must say whether the proof-test sample casts doubt on the maker’s claim.',
 labels: ['p-value (4 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['area to the left of z'], ['p-value'], ['decision (1 or 0)']]
}, {
 /* Any tail, |z| from 0.80 to 2.90, a p-value equal to α and a rounding tie in the printed rows are never drawn. Never z = ±2.12 (the q21 worked example). m is the claimed mean load in kg. */
 canonical: { tail: 3, z: -2.34, a: 0.01, m: 800 },
 draw: R => { for (;;) { const tail = R.int(1, 3), z = sgn(R, tail) * R.int(80, 290) / 100, a = R.pick([0.01, 0.05, 0.1]), m = R.pick([600, 800, 900, 1200]);
  if (Math.abs(z) === 2.12 || !rowsOK(z) || same(pval(tail, z), a)) continue; return { tail, z, a, m }; } },
 build: ({ tail, z, a, m }) => { const area = phi4(z), p = pval(tail, z), d = p < a ? 1 : 0; return {
  prompt: `A rope maker claims that its climbing ropes hold a mean load of ${n(m)} kg before they break. The inspectors proof-tested a random sample of ropes with H₀: μ = ${n(m)} against Hₐ: μ ${OP[tail]} ${n(m)}, and the test statistic came out as z = ${z2(z)}. Rows of the normal table (z → area under the standard normal curve to the left of z): ${rows(z)}. The Hall works at significance level α = ${n(a)}. Enter the p-value to 4 decimal places, read from these table rows (for a two-tailed test, double the smaller tail area), then 1 to reject H₀ or 0 not to reject it.`,
  answer: [p, d],
  hints: ['Look at which way Hₐ points. The p-value is the area beyond z on that side: to the left for <, to the right for >, and in both tails for ≠.', 'The table gives areas to the left only. The area to the right is 1 minus the area to the left, and a two-tailed p-value doubles the smaller tail. Reject H₀ when the p-value is less than α.'],
  solution: `${ptext(tail, z, p)} ${dtext(p, a)} ${d ? 'Ropes from a maker whose claim was true would rarely give a sample like this, so the claim is in doubt.' : 'A sample like this is not rare enough, if the claim were true, to doubt it.'} Enter ${n(p)} and ${d}.`,
  guidance: [
   { prompt: `Find the row for z = ${z2(z)} in the table. What is the area to the left of z?`, answer: [area], explanation: `The row ${z2(z)} → ${f4(area)} says that ${f4(area)} of the area under the standard normal curve lies to the left of ${z2(z)}.` },
   { prompt: `Hₐ: μ ${OP[tail]} ${n(m)} makes this a ${TAIL[tail]} test. What is the p-value?`, answer: [p], explanation: ptext(tail, z, p) },
   { prompt: `Compare the p-value ${n(p)} with α = ${n(a)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${dtext(p, a)} The rule: reject H₀ only when the p-value is less than α.` }
  ] }; }
});

const LV = ['0.01', '0.05', '0.10'], LN = [0.01, 0.05, 0.1];
mk({
 id: 'q21c', parent: 'q21', kind: 'applied', title: 'Three levels for the gate seals',
 brief: 'The airlock gate seals are on trial, and the Hall keeps three standard levels on file so that each inspector can read the verdict at the level they trust.',
 labels: ['p-value (4 d.p.)', 'levels that reject H₀ (0 to 3)'], tolerance: 0.00005,
 gl: [['p-value'], ['levels that reject H₀']]
}, {
 /* |z| from 1.00 to 3.20 so that the count runs from 0 to 3; a p-value equal to one of the three levels is never drawn. m is the claimed thickness in mm. */
 canonical: { tail: 2, z: 1.84, m: 12 },
 draw: R => { for (;;) { const tail = R.int(1, 3), z = sgn(R, tail) * R.int(100, 320) / 100, m = R.pick([8, 12, 15, 20, 25]);
  if (!rowsOK(z) || LN.some(a => same(pval(tail, z), a))) continue; return { tail, z, m }; } },
 build: ({ tail, z, m }) => { const p = pval(tail, z), k = LN.filter(a => p < a).length;
  const per = LN.map((a, i) => `at α = ${LV[i]} the p-value ${p < a ? 'is less than α, so H₀ is rejected' : 'is not less than α, so H₀ stands'}`).join('; ');
  return {
  prompt: `A maker of airlock gate seals claims that its seals have a mean thickness of ${n(m)} mm. The Inspection Hall tested a random sample with H₀: μ = ${n(m)} against Hₐ: μ ${OP[tail]} ${n(m)} and found the test statistic z = ${z2(z)}. Rows of the normal table (z → area to the left of z): ${rows(z)}. The Hall keeps three significance levels on file: α = 0.01, α = 0.05 and α = 0.10. Enter the p-value to 4 decimal places, then how many of the three levels (0, 1, 2 or 3) would lead to rejecting H₀ for this sample.`,
  answer: [p, k],
  hints: ['The p-value is worked out once from z and does not depend on α. Then apply the rule “reject H₀ when the p-value is less than α” to each of the three levels in turn.', 'A level rejects only when it is greater than the p-value. Count the levels that do.'],
  solution: `${ptext(tail, z, p)} Now try each level: ${per}. H₀ is rejected at ${n(k)} of the three levels. Enter ${n(p)} and ${k}.`,
  guidance: [
   { prompt: `Hₐ: μ ${OP[tail]} ${n(m)} makes this a ${TAIL[tail]} test. Use the table row for z = ${z2(z)}. What is the p-value?`, answer: [p], explanation: ptext(tail, z, p) },
   { prompt: `Compare the p-value ${n(p)} with each level 0.01, 0.05 and 0.10. At how many of them is the p-value less than α?`, answer: [k], explanation: `${per.charAt(0).toUpperCase()}${per.slice(1)}. That makes ${n(k)} of the three levels.` }
  ] }; }
});

mk({
 id: 'q21d', parent: 'q21', kind: 'challenge', uses: 'q20', title: 'The ration cans on the scale',
 brief: 'The packers swear their sealed ration cans hold the labelled mass, and the Hall has only a weighed sample to judge them by.',
 labels: ['z (2 d.p.)', 'p-value (4 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['standard error (g)'], ['z (2 d.p.)'], ['p-value'], ['decision (1 or 0)']]
}, {
 /* The q20 statistic first, then the q21 decision. [n, σ] from MP; the sample mean lies 1 to 3 standard errors from the claim on the side of the tail;
    z on a rounding tie, a rounding tie in the printed rows and a p-value equal to α are never drawn. m0 is the labelled net mass in g. */
 canonical: { tail: 1, a: 0.05, m0: 400, N: 36, sg: 6, xb: 398.4, off: 1 },
 draw: R => { for (;;) { const tail = R.int(1, 3), a = R.pick([0.01, 0.05, 0.1]), m0 = R.pick([250, 400, 500, 750]), [N, sg] = R.pick(MP), xb = meanX(R, m0, N, sg, sgn(R, tail)), z = zMean(xb, m0, N, sg);
  if (tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a)) continue; return { tail, a, m0, N, sg, xb, off: R.int(0, 2) }; } },
 build: ({ tail, a, m0, N, sg, xb, off }) => { const se = rd(sg / Math.sqrt(N), 4), z = zMean(xb, m0, N, sg), zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0; return {
  prompt: `The ration packers say that their sealed cans hold a mean net mass of ${n(m0)} g. From long records the net mass has standard deviation σ = ${n(sg)} g. The inspectors weighed a random sample of ${n(N)} cans and found a mean of x̄ = ${n(xb)} g. They test H₀: μ = ${n(m0)} against Hₐ: μ ${OP[tail]} ${n(m0)} at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the test statistic z to 2 decimal places, then the p-value to 4 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
  answer: [zr, p, d],
  hints: ['The standard error of a sample mean with σ known is σ ÷ √n, and z = (x̄ − μ₀) ÷ (σ ÷ √n).', 'Round z to 2 places, find that row, and take the area beyond z in the direction Hₐ points. Reject H₀ when the p-value is less than α.'],
  solution: `The standard error is σ ÷ √n = ${n(sg)} ÷ √${n(N)} = ${n(sg)} ÷ ${n(Math.sqrt(N))} = ${n(se)}, so z = (${n(xb)} − ${n(m0)}) ÷ ${n(se)} = ${n(rd(xb - m0, 4))} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} Enter ${z2(zr)}, ${n(p)} and ${d}.`,
  guidance: [
   { prompt: `What is the standard error of the sample mean, σ ÷ √n, with σ = ${n(sg)} and n = ${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(Math.sqrt(N))}, so σ ÷ √n = ${n(sg)} ÷ ${n(Math.sqrt(N))} = ${n(se)} g.` },
   { prompt: `What is z = (x̄ − μ₀) ÷ standard error, to 2 decimal places?`, answer: [zr], explanation: `(${n(xb)} − ${n(m0)}) ÷ ${n(se)} = ${n(rd(xb - m0, 4))} ÷ ${n(se)}${zt(z, zr)}.` },
   { prompt: `Hₐ: μ ${OP[tail]} ${n(m0)} makes this a ${TAIL[tail]} test. Use the table row for z = ${z2(zr)}. What is the p-value?`, answer: [p], explanation: ptext(tail, zr, p) },
   { prompt: `Compare the p-value ${n(p)} with α = ${n(a)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${dtext(p, a)} The rule: reject H₀ only when the p-value is less than α.` }
  ] }; }
});

/* ---- q22 Testing a proportion [9.5] ---- */

mk({
 id: 'q22b', parent: 'q22', kind: 'setting', title: 'Leak-tested filter cartridges',
 brief: 'The water plant has taken a delivery of filter cartridges, and the Hall will not fit them until a leak-test sample has been judged against the maker’s claim.',
 labels: ['z (2 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['sample proportion p̂'], ['standard error'], ['z (2 d.p.)'], ['p-value', 'decision (1 or 0)']]
}, {
 /* [p₀, n] from PROP; the count lies 1 to 3 standard errors from the claim on the side of the tail. z on a rounding tie, a tie in the printed rows
    and a p-value equal to α are never drawn. Never the q22 worked example (p₀ 0.5, n 100, 61 of them). */
 canonical: { c: 4, tail: 3, x: 85, a: 0.1, off: 1 },
 draw: R => { for (;;) { const c = R.int(0, PROP.length - 1), tail = R.int(1, 3), x = propX(R, c, sgn(R, tail)), a = R.pick([0.01, 0.05, 0.1]), z = zOfProp(c, x);
  if (x < 0 || x > PROP[c][1] || tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a) || (c === 0 && x === 61)) continue; return { c, tail, x, a, off: R.int(0, 2) }; } },
 build: ({ c, tail, x, a, off }) => { const [p0, N] = PROP[c], se = seOf(p0, N), ph = rd(x / N, 4), z = (ph - p0) / se, zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0; return {
  prompt: `A cartridge maker claims that ${n(100 * p0)}% of its water-filter cartridges pass the leak test. Write p for the share of all its cartridges that pass. The Hall tests H₀: p = ${n(p0)} against Hₐ: p ${OP[tail]} ${n(p0)} at significance level α = ${n(a)}. The inspectors leak-tested a random sample of ${N} cartridges and ${x} passed; assume the cartridges leak or hold independently of one another. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
  answer: [zr, d],
  hints: ['The claimed share p₀ is what H₀ says, so the standard error is worked out from p₀ and n, not from the sample: √(p₀(1 − p₀) ÷ n).', 'z = (p̂ − p₀) ÷ standard error. Take the p-value from the table in the direction Hₐ points, and reject H₀ when it is less than α.'],
  solution: `p̂ = ${x} ÷ ${N} = ${n(ph)}. If H₀ is true, the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}. So z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} Enter ${z2(zr)} and ${d}.`,
  guidance: [
   { prompt: `What is the sample proportion p̂ = ${x} ÷ ${N}?`, answer: [ph], explanation: `${x} of ${N} cartridges passed, so p̂ = ${x} ÷ ${N} = ${n(ph)}.` },
   { prompt: `If H₀ is true, what is the standard error √(p₀(1 − p₀) ÷ n) with p₀ = ${n(p0)} and n = ${N}?`, answer: [se], explanation: `${n(p0)} × ${n(1 - p0)} = ${n(rd(p0 * (1 - p0), 4))}, so the standard error is √${n(rd(p0 * (1 - p0), 4))} ÷ √${N} = ${n(rd(Math.sqrt(p0 * (1 - p0)), 4))} ÷ ${n(Math.sqrt(N))} = ${n(se)}.` },
   { prompt: `What is z = (p̂ − p₀) ÷ standard error, to 2 decimal places?`, answer: [zr], explanation: `(${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}.` },
   { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` }
  ] }; }
});

mk({
 id: 'q22c', parent: 'q22', kind: 'applied', title: 'Three days of valve checks',
 brief: 'The pump house tested its valves in three separate batches, and the Hall needs one verdict from the three tallies.',
 labels: ['sample proportion p̂', 'z (2 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['valves tested', 'valves faulty'], ['sample proportion p̂', 'standard error'], ['z (2 d.p.)', 'decision (1 or 0)']]
}, {
 /* Small claimed shares only ("faulty"); the three days are 20% to 40% of the sample each; the faulty counts follow the sample share within 1 per batch.
    The total count lies 1 to 3 standard errors above or below the claim; z on a rounding tie, a tie in the printed rows and a p-value equal to α are never drawn. */
 canonical: { c: 6, tail: 2, a: 0.05, b: [120, 160, 120], f: [16, 23, 15], off: 1 },
 draw: R => { for (;;) { const c = R.pick(LOW), [p0, N] = PROP[c], tail = R.int(1, 3), x = propX(R, c, sgn(R, tail)), a = R.pick([0.01, 0.05, 0.1]), u = N === 625 ? 25 : N / 10, T = N / u;
  const u1 = R.int(Math.ceil(T * 0.2), Math.floor(T * 0.4)), u2 = R.int(Math.ceil(T * 0.2), Math.floor(T * 0.4)), b = [u1 * u, u2 * u, N - (u1 + u2) * u];
  const f1 = Math.round(x * b[0] / N) + R.int(-1, 1), f2 = Math.round(x * b[1] / N) + R.int(-1, 1), f = [f1, f2, x - f1 - f2], z = zOfProp(c, x);
  if (x < 0 || f.some((v, i) => v < 0 || v > b[i]) || tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a)) continue; return { c, tail, a, b, f, off: R.int(0, 2) }; } },
 build: ({ c, tail, a, b, f, off }) => { const [p0, N] = PROP[c], x = f[0] + f[1] + f[2], se = seOf(p0, N), ph = rd(x / N, 4), z = (ph - p0) / se, zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0; return {
  prompt: `A pump maker states that ${n(100 * p0)}% of its water-pump valves are faulty. Write p for the share of all its valves that are faulty. Over three days the Hall tested valves chosen at random: day 1, ${b[0]} tested and ${f[0]} faulty; day 2, ${b[1]} tested and ${f[1]} faulty; day 3, ${b[2]} tested and ${f[2]} faulty. Treat the three days together as one random sample of independent valves. The inspectors test H₀: p = ${n(p0)} against Hₐ: p ${OP[tail]} ${n(p0)} at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the sample proportion p̂ of the whole sample as a decimal, then the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
  answer: [ph, zr, d],
  hints: ['The three days are one sample: add the valves tested and add the faulty ones before you divide.', 'The standard error is √(p₀(1 − p₀) ÷ n) with the claimed p₀ and the total n. Then z = (p̂ − p₀) ÷ standard error, and the p-value comes from the table in the direction Hₐ points.'],
  solution: `Together ${b.join(' + ')} = ${N} valves were tested and ${f.join(' + ')} = ${x} were faulty, so p̂ = ${x} ÷ ${N} = ${n(ph)}. If H₀ is true, the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}. So z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} Enter ${n(ph)}, ${z2(zr)} and ${d}.`,
  guidance: [
   { prompt: `Add the three days. How many valves were tested in all, and how many of them were faulty?`, answer: [N, x], explanation: `${b.join(' + ')} = ${N} valves tested, and ${f.join(' + ')} = ${x} faulty.` },
   { prompt: `What is p̂ = ${x} ÷ ${N}, and what is the standard error √(p₀(1 − p₀) ÷ n) with p₀ = ${n(p0)} and n = ${N}?`, answer: [ph, se], explanation: `p̂ = ${x} ÷ ${N} = ${n(ph)}. The standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}.` },
   { prompt: `What is z = (p̂ − p₀) ÷ standard error, to 2 decimal places? Then use the table row of that z: what is the decision (1 reject, 0 do not reject)?`, answer: [zr, d], explanation: `z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)}` }
  ] }; }
});

mk({
 id: 'q22d', parent: 'q22', kind: 'challenge', uses: 'q16', title: 'Rivets: the test and the interval',
 brief: 'The hull crew needs two answers about the same rivet sample: does the maker’s claim survive, and how wide is the margin around what we saw?',
 labels: ['z (2 d.p.)', 'decision (1 reject, 0 not)', 'margin of error (3 d.p.)'], tolerance: 0.00005,
 gl: [['sample proportion p̂', 'standard error under H₀'], ['z (2 d.p.)'], ['p-value', 'decision (1 or 0)'], ['margin of error (3 d.p.)']]
}, {
 /* The q22 test and the q16 margin on the same sample. At least 5 passed and 5 failed (so the normal curve fits the interval). z, the margin on a rounding tie,
    a tie in the printed rows and a p-value equal to α are never drawn. */
 canonical: { c: 7, tail: 1, x: 188, a: 0.01, off: 1 },
 draw: R => { for (;;) { const c = R.int(0, PROP.length - 1), [p0, N] = PROP[c], tail = R.int(1, 3), x = propX(R, c, sgn(R, tail)), a = R.pick([0.01, 0.05, 0.1]), z = zOfProp(c, x);
  if (x < 5 || x > N - 5 || tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a)) continue;
  const ph = x / N; if (tie(1.96 * Math.sqrt(ph * (1 - ph) / N), 3)) continue; return { c, tail, x, a, off: R.int(0, 2) }; } },
 build: ({ c, tail, x, a, off }) => { const [p0, N] = PROP[c], se = seOf(p0, N), ph = rd(x / N, 4), z = (ph - p0) / se, zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0;
  const sh = Math.sqrt(ph * (1 - ph) / N), m = 1.96 * sh, mr = rd(m, 3); return {
  prompt: `A rivet maker claims that ${n(100 * p0)}% of its rivets pass the shear test. Write p for the share of all its rivets that pass. The inspectors test H₀: p = ${n(p0)} against Hₐ: p ${OP[tail]} ${n(p0)} at significance level α = ${n(a)}. In a random sample of ${N} rivets, ${x} passed and ${N - x} failed; assume the rivets are independent. Both counts are at least 5, so the normal curve can be used. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. From the same sample they also want a 95% confidence interval for p, with z* = 1.96. Enter the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (using the table row of your rounded z), then the margin of error z* × √(p̂(1 − p̂) ÷ n) of the interval to 3 decimal places.`,
  answer: [zr, d, mr],
  hints: ['The test and the interval use the same sample but a different spread: the test uses the claimed p₀ in its standard error, the interval uses the sample proportion p̂.', 'For the test, z = (p̂ − p₀) ÷ √(p₀(1 − p₀) ÷ n), then the table and α. For the margin, multiply z* by √(p̂(1 − p̂) ÷ n).'],
  solution: `p̂ = ${x} ÷ ${N} = ${n(ph)}. If H₀ is true, the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}. So z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} For the interval the spread comes from p̂: √(${n(ph)} × ${n(rd(1 - ph, 4))} ÷ ${N}) = ${f4(sh)} (to 4 decimal places), so the margin of error is 1.96 × ${f4(sh)}, which is ${fx(mr, 3)} to 3 decimal places. Enter ${z2(zr)}, ${d} and ${fx(mr, 3)}.`,
  guidance: [
   { prompt: `What is the sample proportion p̂ = ${x} ÷ ${N}, and what is the standard error √(p₀(1 − p₀) ÷ n) if H₀ is true, with p₀ = ${n(p0)}?`, answer: [ph, se], explanation: `p̂ = ${x} ÷ ${N} = ${n(ph)}. The standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}.` },
   { prompt: `What is z = (p̂ − p₀) ÷ standard error, to 2 decimal places?`, answer: [zr], explanation: `(${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}.` },
   { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` },
   { prompt: `For the interval, use p̂ instead of p₀. What is the margin of error 1.96 × √(p̂(1 − p̂) ÷ n), to 3 decimal places?`, answer: [mr], explanation: `√(${n(ph)} × ${n(rd(1 - ph, 4))} ÷ ${N}) = ${f4(sh)} to 4 decimal places, and 1.96 × ${f4(sh)} is ${fx(mr, 3)} to 3 decimal places.` }
  ] }; }
});

/* ---- q23 Chapter review: a full test of a supplier's claim [9.4, 9.5] ---- */

/* The words of a claim fix the tail: the story for a mean (what, verb, unit) or for a share (item, check). Tail 1 lower, 2 higher, 3 different. */
const meanStory = (tail, m0, what, verb, unit) => [, `A supplier says that its ${what} ${verb} ${n(m0)} ${unit} on average, or more. The inspectors suspect that the true mean μ is lower.`,
 `A supplier says that its ${what} ${verb} ${n(m0)} ${unit} on average, and the outpost pays a bonus only if a test shows that the true mean μ is higher than ${n(m0)} ${unit}.`,
 `A supplier says that its ${what} ${verb} exactly ${n(m0)} ${unit} on average. The inspectors want to know whether the true mean μ is different from ${n(m0)} ${unit}, in either direction: higher or lower.`][tail];
const cue = tail => ({ 1: 'the suspicion is “lower”, so Hₐ uses < and the test is left-tailed (1)', 2: 'the question is whether it is “higher”, so Hₐ uses > and the test is right-tailed (2)', 3: '“different, in either direction” means Hₐ uses ≠ and the test is two-tailed (3)' }[tail]);
const errLine = d => d ? 'If the claim is in fact true, this rejection is a Type I error, a risk of α.' : 'If the claim is in fact false, not rejecting is a Type II error.';
const hTail = 'Read which direction the story asks about, whether it is what the inspectors suspect or what a test must show: “lower” makes Hₐ use <, “higher” makes it use >, and “different, in either direction” makes it use ≠. H₀ always takes the claimed value.';

mk({
 id: 'q23b', parent: 'q23', kind: 'setting', title: 'Light through the greenhouse panels',
 brief: 'The greenhouse needs panels that pass enough light, and the Hall has measured a sample of the supplier’s panels.',
 labels: ['tail (1, 2 or 3)', 'z (2 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['tail (1, 2 or 3)'], ['standard error'], ['z (2 d.p.)'], ['p-value', 'decision (1 or 0)']]
}, {
 /* A mean with σ known; [n, σ] from MP; the sample mean lies 1 to 3 standard errors from the claim on the side of the tail. z on a rounding tie, a tie in
    the printed rows and a p-value equal to α are never drawn. m0 is the claimed per cent of light let through. */
 canonical: { tail: 3, a: 0.01, m0: 80, N: 25, sg: 4, xb: 78.6, off: 1 },
 draw: R => { for (;;) { const tail = R.int(1, 3), a = R.pick([0.01, 0.05, 0.1]), m0 = R.pick([55, 60, 65, 70, 75, 80]), [N, sg] = R.pick(MP), xb = meanX(R, m0, N, sg, sgn(R, tail)), z = zMean(xb, m0, N, sg);
  if (tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a)) continue; return { tail, a, m0, N, sg, xb, off: R.int(0, 2) }; } },
 build: ({ tail, a, m0, N, sg, xb, off }) => { const se = rd(sg / Math.sqrt(N), 4), z = zMean(xb, m0, N, sg), zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0; return {
  prompt: `${meanStory(tail, m0, 'greenhouse panels', 'let through', 'per cent of the light')} From long records the light let through has standard deviation σ = ${n(sg)} per cent. A random sample of ${n(N)} panels let through a mean of x̄ = ${n(xb)} per cent. Test the claim at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the tail of the test (1 left-tailed, 2 right-tailed, 3 two-tailed), then the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
  answer: [tail, zr, d],
  hints: [hTail, 'The standard error of a sample mean with σ known is σ ÷ √n, and z = (x̄ − μ₀) ÷ (σ ÷ √n). Take the p-value from the table in the direction Hₐ points, and reject H₀ when it is less than α.'],
  solution: `The hypotheses are H₀: μ = ${n(m0)} and Hₐ: μ ${OP[tail]} ${n(m0)}: ${cue(tail)}. The standard error is σ ÷ √n = ${n(sg)} ÷ √${n(N)} = ${n(sg)} ÷ ${n(Math.sqrt(N))} = ${n(se)}, so z = (${n(xb)} − ${n(m0)}) ÷ ${n(se)} = ${n(rd(xb - m0, 4))} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} ${errLine(d)} Enter ${tail}, ${z2(zr)} and ${d}.`,
  guidance: [
   { prompt: `H₀ takes the claimed value. Which way does Hₐ point? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.`, answer: [tail], explanation: `H₀: μ = ${n(m0)} and Hₐ: μ ${OP[tail]} ${n(m0)}: ${cue(tail)}.` },
   { prompt: `What is the standard error σ ÷ √n of the sample mean if H₀ is true?`, answer: [se], explanation: `√${n(N)} = ${n(Math.sqrt(N))}, so σ ÷ √n = ${n(sg)} ÷ ${n(Math.sqrt(N))} = ${n(se)}.` },
   { prompt: `What is z = (x̄ − μ₀) ÷ standard error, to 2 decimal places?`, answer: [zr], explanation: `(${n(xb)} − ${n(m0)}) ÷ ${n(se)} = ${n(rd(xb - m0, 4))} ÷ ${n(se)}${zt(z, zr)}.` },
   { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` }
  ] }; }
});

/* The story of a claim about a share: tail 1 "pass, suspect lower", 2 "only X% fail, suspect higher", 3 "pass, want to know if different". */
const shareStory = (tail, pct, what, check) => [, `A ${what} maker claims that ${pct}% of its ${check.item} pass the ${check.test}. The inspectors suspect that the true share p that pass is lower.`,
 `A ${what} maker claims that only ${pct}% of its ${check.item} fail the ${check.test}. The inspectors suspect that the true share p that fail is higher.`,
 `A ${what} maker claims that ${pct}% of its ${check.item} pass the ${check.test}. The inspectors want to know whether the true share p that pass is different from ${pct}%, in either direction: higher or lower.`][tail];
/* Tail 2 asks about a small failing share, the others about a large passing share. */
const shareList = tail => tail === 2 ? LOW : HIGH;
const hShare = 'If H₀ is true the sample proportion p̂ varies around p₀ with standard error √(p₀(1 − p₀) ÷ n), and z = (p̂ − p₀) ÷ standard error. Use the claimed p₀, not p̂. The p-value comes from the table in the direction Hₐ points, and H₀ is rejected when it is less than α.';

mk({
 id: 'q23c', parent: 'q23', kind: 'applied', title: 'Fit-checking the breathing masks',
 brief: 'The mask locker has a delivery from a new maker, and the Hall’s fit-check report gives the sample result only as a percentage.',
 labels: ['tail (1, 2 or 3)', 'z (2 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['tail (1, 2 or 3)'], ['z (2 d.p.)'], ['p-value', 'decision (1 or 0)']]
}, {
 /* A share, with the sample result printed as a per cent (x ÷ n × 100, at most 2 decimals). A small claimed share only for the "fail" claim (tail 2), a large one otherwise.
    The count lies 1 to 3 standard errors from the claim on the side of the tail. z on a rounding tie, a tie in the printed rows and a p-value equal to α are never drawn. */
 canonical: { c: 7, tail: 1, x: 183, a: 0.05, off: 1 },
 draw: R => { for (;;) { const tail = R.int(1, 3), c = R.pick(shareList(tail)), x = propX(R, c, sgn(R, tail)), a = R.pick([0.01, 0.05, 0.1]), z = zOfProp(c, x);
  if (x < 0 || x > PROP[c][1] || tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a)) continue; return { c, tail, x, a, off: R.int(0, 2) }; } },
 build: ({ c, tail, x, a, off }) => { const [p0, N] = PROP[c], se = seOf(p0, N), ph = rd(x / N, 4), pct = n(rd(100 * x / N, 2)), z = (ph - p0) / se, zr = rd(z, 2), p = pval(tail, zr), d = p < a ? 1 : 0; return {
  prompt: `${shareStory(tail, n(100 * p0), 'breathing-mask', { item: 'masks', test: 'fit check' })} The Hall’s report says that in a random sample of ${N} masks, checked independently, ${pct}% ${tail === 2 ? 'failed' : 'passed'} the check. Test the claim at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the tail of the test (1 left-tailed, 2 right-tailed, 3 two-tailed), then the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
  answer: [tail, zr, d],
  hints: [hTail, hShare],
  solution: `The hypotheses are H₀: p = ${n(p0)} and Hₐ: p ${OP[tail]} ${n(p0)}: ${cue(tail)}. A sample result of ${pct}% means p̂ = ${pct} ÷ 100 = ${n(ph)}. If H₀ is true the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}, so z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} ${errLine(d)} Enter ${tail}, ${z2(zr)} and ${d}.`,
  guidance: [
   { prompt: `H₀ takes the claimed value. Which way does Hₐ point? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.`, answer: [tail], explanation: `H₀: p = ${n(p0)} and Hₐ: p ${OP[tail]} ${n(p0)}: ${cue(tail)}.` },
   { prompt: `Turn ${pct}% into p̂, work out the standard error √(p₀(1 − p₀) ÷ n) with p₀ = ${n(p0)} and n = ${N}, and find z = (p̂ − p₀) ÷ standard error. What is z, to 2 decimal places?`, answer: [zr], explanation: `p̂ = ${pct} ÷ 100 = ${n(ph)} and the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${N}) = ${n(se)}, so z = ${n(ph - p0)} ÷ ${n(se)}${zt(z, zr)}.` },
   { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` }
  ] }; }
});

mk({
 id: 'q23d', parent: 'q23', kind: 'challenge', uses: 'q19', title: 'One true claim, many false alarms',
 brief: 'The Hall tests every shipment at the same level, and the quartermaster wants to know how many honest suppliers that routine will wrongly accuse.',
 labels: ['tail (1, 2 or 3)', 'z (2 d.p.)', 'decision (1 reject, 0 not)', 'expected false alarms'], tolerance: 0.00005,
 gl: [['tail (1, 2 or 3)'], ['z (2 d.p.)'], ['p-value', 'decision (1 or 0)'], ['expected false alarms']]
}, {
 /* The q23 test (a mean with σ known when k = 0, a share when k = 1) followed by the q19 count of false alarms, T × α. [n, σ] from MP; shares from PROP as in q23c.
    z on a rounding tie, a tie in the printed rows and a p-value equal to α are never drawn. m0 is the claimed minutes of heat the tiles withstand. */
 canonical: { k: 0, tail: 2, a: 0.1, m0: 30, N: 36, sg: 6, xb: 31.7, c: 0, x: 0, T: 50, off: 1 },
 draw: R => { for (;;) { const k = R.int(0, 1), tail = R.int(1, 3), a = R.pick([0.01, 0.05, 0.1]), T = R.pick([20, 25, 40, 50, 60, 100]); let p;
  if (k === 0) { const m0 = R.pick([20, 30, 45, 60]), [N, sg] = R.pick(MP); p = { k, tail, a, m0, N, sg, xb: meanX(R, m0, N, sg, sgn(R, tail)), c: 0, x: 0, T }; }
  else { const c = R.pick(shareList(tail)); p = { k, tail, a, m0: 0, N: 0, sg: 0, xb: 0, c, x: propX(R, c, sgn(R, tail)), T }; if (p.x < 0 || p.x > PROP[c][1]) continue; }
  const z = k === 0 ? zMean(p.xb, p.m0, p.N, p.sg) : zOfProp(p.c, p.x); if (tie(z, 2) || !rowsOK(rd(z, 2)) || same(pval(tail, rd(z, 2)), a)) continue; return { ...p, off: R.int(0, 2) }; } },
 build: P => { const { k, tail, a, m0, N, sg, xb, c, x, T, off } = P; let story, data, h, work, zRaw, se, expl;
  if (k === 0) { se = rd(sg / Math.sqrt(N), 4); zRaw = zMean(xb, m0, N, sg); h = `H₀: μ = ${n(m0)} and Hₐ: μ ${OP[tail]} ${n(m0)}`;
   story = meanStory(tail, m0, 'heat-shield tiles', 'withstand the test flame for', 'minutes');
   data = `From long records the time has standard deviation σ = ${n(sg)} minutes. A random sample of ${n(N)} tiles lasted a mean of x̄ = ${n(xb)} minutes.`;
   work = `The standard error is σ ÷ √n = ${n(sg)} ÷ √${n(N)} = ${n(sg)} ÷ ${n(Math.sqrt(N))} = ${n(se)}, so z = (${n(xb)} − ${n(m0)}) ÷ ${n(se)} = ${n(rd(xb - m0, 4))} ÷ ${n(se)}`;
   expl = `(${n(xb)} − ${n(m0)}) ÷ ${n(se)} = ${n(rd(xb - m0, 4))} ÷ ${n(se)}`; }
  else { const [p0, NN] = PROP[c], ph = rd(x / NN, 4); se = seOf(p0, NN); zRaw = (ph - p0) / se; h = `H₀: p = ${n(p0)} and Hₐ: p ${OP[tail]} ${n(p0)}`;
   story = shareStory(tail, n(100 * p0), 'fuse', { item: 'fuses', test: 'surge test' });
   data = `In a random sample of ${NN} fuses, tested independently, ${x} ${tail === 2 ? 'fail' : 'pass'}.`;
   work = `p̂ = ${x} ÷ ${NN} = ${n(ph)}. If H₀ is true the standard error is √(${n(p0)} × ${n(1 - p0)} ÷ ${NN}) = ${n(se)}, so z = (${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}`;
   expl = `(${n(ph)} − ${n(p0)}) ÷ ${n(se)} = ${n(ph - p0)} ÷ ${n(se)}`; }
  const zr = rd(zRaw, 2), p = pval(tail, zr), d = p < a ? 1 : 0, fa = rd(T * a, 4); return {
  prompt: `${story} ${data} Test the claim at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Then suppose every claim the Hall tests this season is in fact true, and it runs this same test at this same level on ${T} other independent shipments. Take each test’s chance of a false alarm to be exactly α, the level it is run at (for a test on counts the true chance can differ a little from α). Enter the tail of the test (1 left-tailed, 2 right-tailed, 3 two-tailed), then the test statistic z to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (using the table row of your rounded z), then the expected number of false alarms, rejections of a true H₀, among those ${T} tests.`,
  answer: [tail, zr, d, fa],
  hints: [hTail, `Work the first test as usual: z = (estimate − claimed value) ÷ standard error, then the table and α. A false alarm is a Type I error, which happens with chance α in each test when the claim is true, so the expected number is the number of tests times α.`],
  solution: `The hypotheses are ${h}: ${cue(tail)}. ${work}${zt(zRaw, zr)}. ${ptext(tail, zr, p)} ${dtext(p, a)} If every claim is true, each of the ${T} tests gives a false alarm with chance α = ${n(a)}, so the expected number of false alarms is ${T} × ${n(a)} = ${n(fa)}. Enter ${tail}, ${z2(zr)}, ${d} and ${n(fa)}.`,
  guidance: [
   { prompt: `H₀ takes the claimed value. Which way does Hₐ point? Enter 1 for left-tailed, 2 for right-tailed, 3 for two-tailed.`, answer: [tail], explanation: `${h}: ${cue(tail)}.` },
   { prompt: `What is z = (estimate − claimed value) ÷ standard error, to 2 decimal places? The standard error is ${n(se)}.`, answer: [zr], explanation: `${expl}${zt(zRaw, zr)}.` },
   { prompt: `Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(tail, zr, p)} ${dtext(p, a)}` },
   { prompt: `If every claim is true, each test gives a false alarm with chance α = ${n(a)}. What is the expected number of false alarms in ${T} tests?`, answer: [fa], explanation: `${T} × ${n(a)} = ${n(fa)}. A false alarm is a Type I error, and its chance in each test is α.` }
  ] }; }
});

/* ---- q24 Two independent means: the two-sample t statistic [10.1] ---- */

mk({
 id: 'q24b', parent: 'q24', kind: 'setting', title: 'Drip lines against flooding',
 brief: 'The tomato beds at the Trial Fields can be watered by drip line or by flooding, and the council wants to know whether drip really yields more.',
 labels: ['t (2 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.0005,
 gl: [['s₁² ÷ n₁', 's₂² ÷ n₂'], ['SE (3 d.p.)'], ['t (2 d.p.)'], ['decision (1 or 0)']]
}, {
 /* (s, n) from SN; df from the long formula, 4 to 30; right-tailed (2) or two-tailed (3). The drip mean is 0.5 to 6.0 kg above (or, two-tailed, sometimes below)
    the flood mean. Draws where t or the SE sit on a rounding tie, where rounding the SE to 3 places changes t, or where t lies within 0.05 of t* are never drawn. */
 canonical: { tail: 3, i: 6, j: 2, x1: 31.4, x2: 28.1 },
 draw: R => { for (;;) { const tail = R.pick([2, 3]), i = R.int(0, SN.length - 1), j = R.int(0, SN.length - 1), x2 = R.int(200, 450) / 10, dd = R.int(5, 60) / 10 * (tail === 3 && R.bool() ? -1 : 1), p = { tail, i, j, x1: rd(x2 + dd, 1), x2 };
  if (ok24(p)) return p; } },
 build: P => { const { tail } = P, q = core24(P), { s1, n1, s2, n2, x1, x2, v1, v2, se, df, t, ts, tr, d, crit, rule, verdict } = q; return {
  prompt: `The Trial Fields watered tomato beds in two ways, chosen at random: drip lines on ${n1} beds and flooding on ${n2} other beds. Drip: mean yield x̄₁ = ${n(x1)} kg per bed, standard deviation s₁ = ${s1} kg. Flood: x̄₂ = ${n(x2)} kg per bed, s₂ = ${s2} kg. The council tests H₀: μ₁ = μ₂ against Hₐ: μ₁ ${OP[tail]} μ₂ at α = 0.05. The degrees-of-freedom formula gives df = ${df} (rounded down), and the t table gives the critical value t* = ${t3(ts)} for df = ${df}, ${crit}. Enter the two-sample t statistic to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (compare the unrounded t with t*).`,
  answer: [tr, d], hints: h24,
  solution: `s₁² ÷ n₁ = ${s1 * s1} ÷ ${n1} = ${n(v1)} and s₂² ÷ n₂ = ${s2 * s2} ÷ ${n2} = ${n(v2)}. SE = √(${n(v1)} + ${n(v2)}) = √${n(v1 + v2)} = ${f4(se)} (to 4 decimal places). t = (${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${zt(t, tr)}. ${rule} ${verdict} Enter ${z2(tr)} and ${d}.`,
  guidance: [
   { prompt: `What are s₁² ÷ n₁ and s₂² ÷ n₂?`, answer: [v1, v2], explanation: `${s1}² = ${s1 * s1} and ${s1 * s1} ÷ ${n1} = ${n(v1)}; ${s2}² = ${s2 * s2} and ${s2 * s2} ÷ ${n2} = ${n(v2)}.` },
   { prompt: `What is the standard error SE = √(${n(v1)} + ${n(v2)}), to 3 decimal places?`, answer: [rd(se, 3)], explanation: `${n(v1)} + ${n(v2)} = ${n(v1 + v2)}, and √${n(v1 + v2)} = ${f4(se)}, which is ${(rd(se, 3)).toFixed(3).replace('-', '−')} to 3 decimal places. Keep the longer value for the next step.` },
   { prompt: `What is t = (x̄₁ − x̄₂) ÷ SE, to 2 decimal places?`, answer: [tr], explanation: `(${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${same(t, tr) ? ` = ${z2(tr)}` : `, which rounds to ${z2(tr)}`}.` },
   { prompt: `Compare the unrounded t with the critical value t* = ${t3(ts)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${rule} ${verdict}` }
  ] }; }
});

mk({
 id: 'q24c', parent: 'q24', kind: 'applied', title: 'Fertiliser trial from the totals',
 brief: 'The scales log at the Trial Fields kept only the total weight of each fertiliser group, and the council still wants a verdict.',
 labels: ['t (2 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.005,
 gl: [['mean yield of the new beds (kg)', 'mean yield of the usual beds (kg)'], ['t (2 d.p.)'], ['decision (1 or 0)']]
}, {
 /* Means in tenths of a kg (k1, k2) such that each group's total weight is a whole number of kg; the new mean is above the usual one (and, two-tailed, sometimes below).
    Same filters as the other two-sample tests (no rounding ties, t not within 0.05 of t*). */
 canonical: { tail: 2, i: 4, j: 1, k1: 380, k2: 351 },
 draw: R => { for (;;) { const tail = R.pick([2, 3]), i = R.int(0, SN.length - 1), j = R.int(0, SN.length - 1), k2 = R.int(250, 450), k1 = k2 + R.int(5, 60) * (tail === 3 && R.bool() ? -1 : 1), p = { tail, i, j, k1, k2 };
  if ((SN[i][1] * k1) % 10 !== 0 || (SN[j][1] * k2) % 10 !== 0) continue; if (ok24({ tail, i, j, x1: k1 / 10, x2: k2 / 10 })) return p; } },
 build: P => { const { tail, k1, k2 } = P, q = core24({ ...P, x1: k1 / 10, x2: k2 / 10 }), { s1, n1, s2, n2, x1, x2, v1, v2, se, df, t, ts, tr, d, crit, rule, verdict } = q, T1 = n1 * k1 / 10, T2 = n2 * k2 / 10; return {
  prompt: `The Trial Fields spread a new fertiliser on ${n1} beds and the usual one on ${n2} other beds, chosen at random. The scales log kept only totals: the new beds gave ${n(T1)} kg altogether and the usual beds ${n(T2)} kg altogether. The standard deviations of the bed yields are s₁ = ${s1} kg for the new beds and s₂ = ${s2} kg for the usual beds. The council tests H₀: μ₁ = μ₂ against Hₐ: μ₁ ${OP[tail]} μ₂ at α = 0.05. The degrees-of-freedom formula gives df = ${df} (rounded down), and the t table gives the critical value t* = ${t3(ts)} for df = ${df}, ${crit}. Enter the two-sample t statistic to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (compare the unrounded t with t*).`,
  answer: [tr, d],
  hints: ['A sample mean is the total divided by the number of beds. Find both means first, then work with them as in any two-sample test.', ...h24],
  solution: `x̄₁ = ${n(T1)} ÷ ${n1} = ${n(x1)} kg and x̄₂ = ${n(T2)} ÷ ${n2} = ${n(x2)} kg. s₁² ÷ n₁ = ${s1 * s1} ÷ ${n1} = ${n(v1)} and s₂² ÷ n₂ = ${s2 * s2} ÷ ${n2} = ${n(v2)}. SE = √(${n(v1)} + ${n(v2)}) = √${n(v1 + v2)} = ${f4(se)} (to 4 decimal places). t = (${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${zt(t, tr)}. ${rule} ${verdict} Enter ${z2(tr)} and ${d}.`,
  guidance: [
   { prompt: `Divide each total by its number of beds. What are the two sample means, x̄₁ for the new beds and x̄₂ for the usual beds?`, answer: [x1, x2], explanation: `${n(T1)} ÷ ${n1} = ${n(x1)} and ${n(T2)} ÷ ${n2} = ${n(x2)}, so x̄₁ = ${n(x1)} kg and x̄₂ = ${n(x2)} kg.` },
   { prompt: `Work out SE = √(s₁² ÷ n₁ + s₂² ÷ n₂) and then t = (x̄₁ − x̄₂) ÷ SE. What is t, to 2 decimal places?`, answer: [tr], explanation: `s₁² ÷ n₁ = ${n(v1)} and s₂² ÷ n₂ = ${n(v2)}, so SE = √${n(v1 + v2)} = ${f4(se)}. Then (${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${same(t, tr) ? ` = ${z2(tr)}` : `, which rounds to ${z2(tr)}`}.` },
   { prompt: `Compare the unrounded t with the critical value t* = ${t3(ts)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${rule} ${verdict}` }
  ] }; }
});

mk({
 id: 'q24d', parent: 'q24', kind: 'challenge', uses: 'q15', title: 'A new bean strain, tested and bracketed',
 brief: 'The Trial Fields want the new bean strain judged against the old, and an interval to plan the harvest around the new one.',
 labels: ['t (2 d.p.)', 'decision (1 reject, 0 not)', 'lower bound (kg)', 'upper bound (kg)'], tolerance: 0.005,
 gl: [['t (2 d.p.)'], ['decision (1 or 0)'], ['margin of error (kg)'], ['lower bound (kg)', 'upper bound (kg)']]
}, {
 /* The q24 test and the q15 interval for the new strain alone (t* for df = n₁ − 1 from the 0.025 column; n₁ is 10, 16, 20 or 25 so the row is on the table).
    Same test filters as the other two-sample tests, plus: the margin is never on a rounding tie at 2 places. */
 canonical: { tail: 2, i: 8, j: 3, x1: 18.7, x2: 16.2 },
 draw: R => { for (;;) { const tail = R.pick([2, 3]), i = R.int(0, SN.length - 1), j = R.int(0, SN.length - 1), x2 = R.int(100, 300) / 10, dd = R.int(5, 60) / 10 * (tail === 3 && R.bool() ? -1 : 1), p = { tail, i, j, x1: rd(x2 + dd, 1), x2 };
  if (!ok24(p)) continue; const q = core24(p); if (tie(T025[q.n1 - 1] * Math.sqrt(q.v1), 2)) continue; return p; } },
 build: P => { const { tail } = P, q = core24(P), { s1, n1, s2, n2, x1, x2, v1, v2, se, df, t, ts, tr, d, crit, rule, verdict } = q, tc = T025[n1 - 1], r1 = Math.sqrt(v1), m = tc * r1, mr = rd(m, 2), lo = rd(x1 - mr, 2), hi = rd(x1 + mr, 2); return {
  prompt: `The Trial Fields grew a new bean strain on ${n1} plots and the old strain on ${n2} other plots, chosen at random. New strain: mean yield x̄₁ = ${n(x1)} kg, standard deviation s₁ = ${s1} kg. Old strain: x̄₂ = ${n(x2)} kg, s₂ = ${s2} kg. The council tests H₀: μ₁ = μ₂ against Hₐ: μ₁ ${OP[tail]} μ₂ at α = 0.05. The degrees-of-freedom formula gives df = ${df} (rounded down), and the t table gives the critical value t* = ${t3(ts)} for df = ${df}, ${crit}. The council also wants a 95% t interval for the new strain’s own mean yield, x̄₁ ± t* × s₁ ÷ √n₁, using only the new strain’s plots: its df is ${n1 - 1} and the t table gives t* = ${t3(tc)} for that df, with an area of 0.025 in each tail. Enter the two-sample t statistic to 2 decimal places, then 1 to reject H₀ or 0 not to reject it (compare the unrounded t with t*), then the lower and the upper bound of the interval, each to 2 decimal places.`,
  answer: [tr, d, lo, hi],
  hints: [...h24, 'The interval uses the new strain alone: its margin of error is t* × s₁ ÷ √n₁ with the t* given for its own df, and the bounds are x̄₁ minus and plus that margin.'],
  solution: `s₁² ÷ n₁ = ${s1 * s1} ÷ ${n1} = ${n(v1)} and s₂² ÷ n₂ = ${s2 * s2} ÷ ${n2} = ${n(v2)}. SE = √(${n(v1)} + ${n(v2)}) = √${n(v1 + v2)} = ${f4(se)} (to 4 decimal places). t = (${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${zt(t, tr)}. ${rule} ${verdict} For the interval, s₁ ÷ √n₁ = √${n(v1)} = ${f4(r1)}, so the margin of error is ${t3(tc)} × ${f4(r1)}, which is ${z2(mr)} kg to 2 decimal places. The interval runs from ${n(x1)} − ${z2(mr)} = ${z2(lo)} to ${n(x1)} + ${z2(mr)} = ${z2(hi)} kg. Enter ${z2(tr)}, ${d}, ${z2(lo)} and ${z2(hi)}.`,
  guidance: [
   { prompt: `Work out SE = √(s₁² ÷ n₁ + s₂² ÷ n₂) and then t = (x̄₁ − x̄₂) ÷ SE. What is t, to 2 decimal places?`, answer: [tr], explanation: `s₁² ÷ n₁ = ${n(v1)} and s₂² ÷ n₂ = ${n(v2)}, so SE = √${n(v1 + v2)} = ${f4(se)}. Then (${n(x1)} − ${n(x2)}) ÷ ${f4(se)} = ${n(x1 - x2)} ÷ ${f4(se)}${same(t, tr) ? ` = ${z2(tr)}` : `, which rounds to ${z2(tr)}`}.` },
   { prompt: `Compare the unrounded t with the critical value t* = ${t3(ts)}. Enter 1 to reject H₀ or 0 not to reject it.`, answer: [d], explanation: `${rule} ${verdict}` },
   { prompt: `For the interval, what is the margin of error t* × s₁ ÷ √n₁ with t* = ${t3(tc)}, to 2 decimal places?`, answer: [mr], explanation: `s₁ ÷ √n₁ = √${n(v1)} = ${f4(r1)}, and ${t3(tc)} × ${f4(r1)} is ${z2(mr)} to 2 decimal places.` },
   { prompt: `What are the lower and the upper bound, x̄₁ − margin and x̄₁ + margin, to 2 decimal places?`, answer: [lo, hi], explanation: `${n(x1)} − ${z2(mr)} = ${z2(lo)} and ${n(x1)} + ${z2(mr)} = ${z2(hi)}, so the interval runs from ${z2(lo)} to ${z2(hi)} kg.` }
  ] }; }
});

/* ---- q25 Two proportions: the pooled proportion and z [10.3] ---- */

const SZ = [50, 100, 125, 200, 250];
mk({
 id: 'q25b', parent: 'q25', kind: 'setting', title: 'Blight spray on the bean plants',
 brief: 'A new spray went on some bean plants and not on others, and the council wants to know whether the share kept free of blight really differs.',
 labels: ['pooled proportion (3 d.p.)', 'z (2 d.p.)'], tolerance: 0.0005,
 gl: [['p̂₁ (sprayed)', 'p̂₂ (unsprayed)'], ['pooled proportion (3 d.p.)'], ['z (2 d.p.)']]
}, {
 /* Sizes from 50, 100, 125, 200, 250 so each p̂ has at most 3 places; shares of 20% to 95%; 0.8 <= |z| <= 3.2. Rounding ties and draws where p_c rounded to 3 places changes z are never drawn. Never the q25 worked example (62 and 50 of 100 each). */
 canonical: { n1: 125, x1: 70, n2: 200, x2: 98 },
 draw: R => { for (;;) { const n1 = R.pick(SZ), n2 = R.pick(SZ), x1 = R.int(Math.ceil(0.2 * n1), Math.floor(0.95 * n1)), x2 = R.int(Math.ceil(0.2 * n2), Math.floor(0.95 * n2)), p = { n1, x1, n2, x2 };
  if (n1 === 100 && n2 === 100 && x1 === 62 && x2 === 50) continue; if (ok25(p, 0.8, 3.2)) return p; } },
 build: P => { const { n1, x1, n2, x2 } = P, { p1, p2, pc, pr, se, z } = core25(P), zr = rd(z, 2); return {
  prompt: `The Trial Fields sprayed ${n1} bean plants with a new anti-blight spray and left ${n2} other plants unsprayed, in random positions, and assume each plant stays healthy or gets blight independently. ${x1} of the sprayed plants and ${x2} of the unsprayed plants stayed free of blight. To test H₀: p₁ = p₂, the same share free of blight for both, enter the pooled proportion to 3 decimal places, then the z statistic for sprayed minus unsprayed to 2 decimal places.`,
  answer: [pr, zr],
  hints: ['If H₀ is true both groups share one proportion, so pool them: add the plants that stayed free of blight and divide by all the plants.', 'z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)). Keep p_c unrounded inside the square root.'],
  solution: `p̂₁ = ${x1} ÷ ${n1} = ${n(p1)} and p̂₂ = ${x2} ÷ ${n2} = ${n(p2)}. Pooled: p_c = (${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which is ${(pr).toFixed(3).replace('-', '−')} to 3 decimal places`}. The standard error is √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})) = ${f4(se)} (to 4 decimal places), so z = (${n(p1)} − ${n(p2)}) ÷ ${f4(se)} = ${n(p1 - p2)} ÷ ${f4(se)}${zt(z, zr)}. Enter ${n(pr)} and ${z2(zr)}.`,
  guidance: [
   { prompt: `What are the two sample proportions, p̂₁ for the sprayed plants and p̂₂ for the unsprayed?`, answer: [p1, p2], explanation: `p̂₁ = ${x1} ÷ ${n1} = ${n(p1)} and p̂₂ = ${x2} ÷ ${n2} = ${n(p2)}.` },
   { prompt: `What is the pooled proportion p_c = (x₁ + x₂) ÷ (n₁ + n₂), to 3 decimal places?`, answer: [pr], explanation: `(${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which rounds to ${n(pr)}`}.` },
   { prompt: `What is z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})), to 2 decimal places?`, answer: [zr], explanation: `1 ÷ ${n1} + 1 ÷ ${n2} = ${n(rd(1 / n1 + 1 / n2, 4))}, so the standard error is ${f4(se)} to 4 decimal places, and (${n(p1)} − ${n(p2)}) ÷ ${f4(se)}${same(z, zr) ? ` = ${z2(zr)}` : ` rounds to ${z2(zr)}`}.` }
  ] }; }
});

mk({
 id: 'q25c', parent: 'q25', kind: 'applied', title: 'Two tunnels, two sprays',
 brief: 'The tunnel log gives each tunnel’s result only as a percentage, and the council still needs the pooled share and the z statistic.',
 labels: ['pooled proportion (3 d.p.)', 'z (2 d.p.)'], tolerance: 0.0005,
 gl: [['tunnel A free of blight', 'tunnel B free of blight'], ['pooled proportion (3 d.p.)'], ['z (2 d.p.)']]
}, {
 /* Sizes from SZ; the log's whole per cent y gives a whole number of plants (n × y ÷ 100); 20% to 95%; 0.8 <= |z| <= 3.2. Rounding ties and draws where p_c rounded to 3 places changes z are never drawn. */
 canonical: { n1: 250, y1: 72, n2: 200, y2: 64 },
 draw: R => { for (;;) { const n1 = R.pick(SZ), n2 = R.pick(SZ), y1 = R.int(20, 95), y2 = R.int(20, 95);
  if ((n1 * y1) % 100 !== 0 || (n2 * y2) % 100 !== 0) continue; if (ok25({ n1, x1: n1 * y1 / 100, n2, x2: n2 * y2 / 100 }, 0.8, 3.2)) return { n1, y1, n2, y2 }; } },
 build: ({ n1, y1, n2, y2 }) => { const x1 = n1 * y1 / 100, x2 = n2 * y2 / 100, { p1, p2, pc, pr, se, z } = core25({ n1, x1, n2, x2 }), zr = rd(z, 2); return {
  prompt: `Tunnel A at the Trial Fields held ${n1} bean plants with the new anti-blight spray, and tunnel B held ${n2} plants with the old spray; the plants stand in random positions, and assume each plant stays healthy or gets blight independently. The log says that ${y1}% of the plants in tunnel A and ${y2}% of those in tunnel B were free of blight at the end of the season. To test H₀: p₁ = p₂, the same share free of blight for both sprays, enter the pooled proportion to 3 decimal places, then the z statistic for tunnel A minus tunnel B to 2 decimal places.`,
  answer: [pr, zr],
  hints: ['A percentage of a group gives a count: divide the percentage by 100 and multiply by the size of the group. Do this for both tunnels before pooling.', 'Pool by adding the plants free of blight and dividing by all the plants. Then z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)), with p_c unrounded.'],
  solution: `Tunnel A: ${y1}% of ${n1} is ${x1} plants, so p̂₁ = ${n(p1)}. Tunnel B: ${y2}% of ${n2} is ${x2} plants, so p̂₂ = ${n(p2)}. Pooled: p_c = (${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which is ${(pr).toFixed(3).replace('-', '−')} to 3 decimal places`}. The standard error is √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})) = ${f4(se)} (to 4 decimal places), so z = (${n(p1)} − ${n(p2)}) ÷ ${f4(se)} = ${n(p1 - p2)} ÷ ${f4(se)}${zt(z, zr)}. Enter ${n(pr)} and ${z2(zr)}.`,
  guidance: [
   { prompt: `How many plants were free of blight in tunnel A (${y1}% of ${n1}) and in tunnel B (${y2}% of ${n2})?`, answer: [x1, x2], explanation: `${y1} ÷ 100 × ${n1} = ${x1} plants in tunnel A, and ${y2} ÷ 100 × ${n2} = ${x2} plants in tunnel B.` },
   { prompt: `What is the pooled proportion p_c = (x₁ + x₂) ÷ (n₁ + n₂), to 3 decimal places?`, answer: [pr], explanation: `(${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which rounds to ${n(pr)}`}.` },
   { prompt: `What is z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})), to 2 decimal places? Here p̂₁ = ${n(p1)} and p̂₂ = ${n(p2)}.`, answer: [zr], explanation: `1 ÷ ${n1} + 1 ÷ ${n2} = ${n(rd(1 / n1 + 1 / n2, 4))}, so the standard error is ${f4(se)} to 4 decimal places, and (${n(p1)} − ${n(p2)}) ÷ ${f4(se)}${same(z, zr) ? ` = ${z2(zr)}` : ` rounds to ${z2(zr)}`}.` }
  ] }; }
});

const SZ2 = [125, 200, 250, 400, 500, 1000];
mk({
 id: 'q25d', parent: 'q25', kind: 'challenge', uses: 'q21', title: 'Coated seed against plain seed',
 brief: 'A seed coating costs extra, so the council wants the pooled share, the z statistic and a firm decision on whether the coating changes sprouting.',
 labels: ['pooled proportion (3 d.p.)', 'z (2 d.p.)', 'p-value (4 d.p.)', 'decision (1 reject, 0 not)'], tolerance: 0.00005,
 gl: [['p̂₁ (coated)', 'p̂₂ (plain)'], ['pooled proportion (3 d.p.)'], ['z (2 d.p.)'], ['p-value', 'decision (1 or 0)']]
}, {
 /* Larger groups from SZ2 (each p̂ has at most 4 places); shares of 20% to 95%; 0.8 <= |z| <= 3.4; two-tailed. Rounding ties (also in the printed rows), draws where p_c rounded to
    3 places changes z, and a p-value equal to α are never drawn. */
 canonical: { n1: 400, x1: 292, n2: 500, x2: 330, a: 0.05, off: 1 },
 draw: R => { for (;;) { const n1 = R.pick(SZ2), n2 = R.pick(SZ2), x1 = R.int(Math.ceil(0.2 * n1), Math.floor(0.95 * n1)), x2 = R.int(Math.ceil(0.2 * n2), Math.floor(0.95 * n2)), a = R.pick([0.01, 0.05, 0.1]), p = { n1, x1, n2, x2, a };
  if (!ok25(p, 0.8, 3.4)) continue; const zr = rd(core25(p).z, 2); if (!rowsOK(zr) || same(pval(3, zr), a)) continue; return { ...p, off: R.int(0, 2) }; } },
 build: P => { const { n1, x1, n2, x2, a, off } = P, { p1, p2, pc, pr, se, z } = core25(P), zr = rd(z, 2), p = pval(3, zr), d = p < a ? 1 : 0; return {
  prompt: `The Trial Fields sowed ${n1} coated seeds and ${n2} plain seeds in random positions, and assume each seed sprouts independently. ${x1} of the coated seeds and ${x2} of the plain seeds sprouted. The council tests H₀: p₁ = p₂ against Hₐ: p₁ ≠ p₂ at significance level α = ${n(a)}. Rows of the normal table (z → area to the left of z): ${rows(zr, off)}. Enter the pooled proportion to 3 decimal places, then the z statistic for coated minus plain to 2 decimal places, then the p-value to 4 decimal places, then 1 to reject H₀ or 0 not to reject it, using the table row of your rounded z.`,
  answer: [pr, zr, p, d],
  hints: ['Pool both groups: p_c = (all the seeds that sprouted) ÷ (all the seeds sown). Then z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ n₁ + 1 ÷ n₂)), with p_c unrounded.', 'Hₐ uses ≠, so the test is two-tailed: the p-value counts both tails, which is twice the smaller tail. Reject H₀ when the p-value is less than α.'],
  solution: `p̂₁ = ${x1} ÷ ${n1} = ${n(p1)} and p̂₂ = ${x2} ÷ ${n2} = ${n(p2)}. Pooled: p_c = (${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which is ${(pr).toFixed(3).replace('-', '−')} to 3 decimal places`}. The standard error is √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})) = ${f4(se)} (to 4 decimal places), so z = (${n(p1)} − ${n(p2)}) ÷ ${f4(se)} = ${n(p1 - p2)} ÷ ${f4(se)}${zt(z, zr)}. ${ptext(3, zr, p)} ${dtext(p, a)} Enter ${n(pr)}, ${z2(zr)}, ${n(p)} and ${d}.`,
  guidance: [
   { prompt: `What are the two sample proportions, p̂₁ for the coated seeds and p̂₂ for the plain seeds?`, answer: [p1, p2], explanation: `p̂₁ = ${x1} ÷ ${n1} = ${n(p1)} and p̂₂ = ${x2} ÷ ${n2} = ${n(p2)}.` },
   { prompt: `What is the pooled proportion p_c = (x₁ + x₂) ÷ (n₁ + n₂), to 3 decimal places?`, answer: [pr], explanation: `(${x1} + ${x2}) ÷ (${n1} + ${n2}) = ${x1 + x2} ÷ ${n1 + n2}${same(pc, pr) ? ` = ${n(pr)}` : `, which rounds to ${n(pr)}`}.` },
   { prompt: `What is z = (p̂₁ − p̂₂) ÷ √(p_c(1 − p_c)(1 ÷ ${n1} + 1 ÷ ${n2})), to 2 decimal places?`, answer: [zr], explanation: `1 ÷ ${n1} + 1 ÷ ${n2} = ${n(rd(1 / n1 + 1 / n2, 4))}, so the standard error is ${f4(se)} to 4 decimal places, and (${n(p1)} − ${n(p2)}) ÷ ${f4(se)}${same(z, zr) ? ` = ${z2(zr)}` : ` rounds to ${z2(zr)}`}.` },
   { prompt: `Hₐ: p₁ ≠ p₂ makes this a two-tailed test. Use the table row for z = ${z2(zr)}. What is the p-value, and what is the decision (1 reject, 0 do not reject)?`, answer: [p, d], explanation: `${ptext(3, zr, p)} ${dtext(p, a)}` }
  ] }; }
});

})();
