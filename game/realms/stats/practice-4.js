/* Data and inference practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/stats/oracle-p4.js. */
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
/* Fixed decimals with a typographic minus: fx(3.1, 2) is '3.10'. Rounds half away from zero (draws never land on a tie). */
const fx = (x, d) => { const k = Math.pow(10, d), v = Math.round(Math.abs(x) * k + 1e-9) / k; return (x < 0 && v > 0 ? '−' : '') + v.toFixed(d); };
const rd = (x, d) => Number(fx(x, d).replace('−', '-'));
/* True when x sits on (or within float noise of) a rounding tie at d decimals: such draws are rejected. */
const tie = (x, d) => { const v = Math.abs(x) * Math.pow(10, d); return Math.abs(v - Math.floor(v) - 0.5) < 1e-6; };
/* '= 5.88' when x has at most d decimals, '≈ 5.88' when it was rounded. */
const eq = (x, d) => { const v = x * Math.pow(10, d); return Math.abs(v - Math.round(v)) < 1e-7 ? '= ' + n(x) : '≈ ' + fx(x, d); };
/* Critical values (same as the learn missions): z* for the three levels, and rows of Student's t table, df → 90%, 95%, 99%. */
const ZS = { 90: '1.645', 95: '1.96', 99: '2.576' };
const ZLINE = 'Critical values: 90% confidence, z* = 1.645; 95%, z* = 1.96; 99%, z* = 2.576.';
const TT = { 8: ['1.860', '2.306', '3.355'], 9: ['1.833', '2.262', '3.250'], 10: ['1.812', '2.228', '3.169'], 11: ['1.796', '2.201', '3.106'] };
const COL = { 90: 0, 95: 1, 99: 2 };
const TLINE = 't table rows, columns 90%, 95%, 99%: df 8: 1.860, 2.306, 3.355; df 9: 1.833, 2.262, 3.250; df 10: 1.812, 2.228, 3.169; df 11: 1.796, 2.201, 3.106.';
/* σ ÷ √n has at most 2 decimals: σ × 100 is a multiple of √n. */
const tidySE = (sig, r) => (sig * 100) % r === 0;
const ROOTS = [4, 5, 6, 8, 10];

/* ---- q16 The confidence interval for a proportion [8.3] ---- */

/* Proportion interval pieces: p̂ is exact to 3 decimals (x × 1000 is a multiple of N). */
const pint = (x, N, L) => { const ph = x / N, qh = (N - x) / N, se = Math.sqrt(ph * qh / N), z = ZS[L], m = Number(z) * se; return { ph, qh, se, z, m, m3: rd(m, 3), lo: rd(ph - m, 3), hi: rd(ph + m, 3) }; };
/* A draw whose margin and bounds are not rounding ties, whether or not the standard error is rounded to 3 decimals first. */
const pokay = (x, N, L) => { if ((x * 1000) % N !== 0 || x <= 5 || N - x <= 5) return false; const c = pint(x, N, L);
 return !(tie(c.se, 3) || tie(c.m, 3) || rd(Number(c.z) * rd(c.se, 3), 3) !== c.m3 || c.lo <= 0 || c.hi >= 1); };
const NS16 = [40, 50, 80, 100, 125, 200, 250, 400, 500];

/* q16b: well-water vials. Not the worked example (45 of 100 at 90%). */
mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'Iron in the well water',
 brief: 'The outpost well feeds the whole camp, and the council wants to know what share of its water is above the safe iron limit.',
 labels: ['p̂', 'standard error', 'lower bound', 'upper bound'], tolerance: 0.0005,
 gl: [['p̂'], ['standard error'], ['lower bound', 'upper bound']]
}, {
 canonical: { L: 99, x: 34, N: 200 },
 draw: R => { for (;;) { const N = R.pick(NS16), p = { L: R.pick([90, 95, 99]), x: R.int(Math.ceil(0.08 * N), Math.floor(0.92 * N)), N };
  if (pokay(p.x, p.N, p.L) && !(p.x === 45 && p.N === 100 && p.L === 90)) return p; } },
 build: ({ L, x, N }) => { const { ph, qh, se, z, m, m3, lo, hi } = pint(x, N, L); return {
  prompt: `The assay lab tested ${n(N)} vials of water from the outpost well, and ${n(x)} of them held iron above the safe limit. Both ${n(x)} and ${n(N - x)} are more than 5, so the normal curve can be used. ${ZLINE} Enter the sample proportion p̂, then the standard error √(p̂(1 − p̂) ÷ n), then the lower and the upper bound of the ${L}% confidence interval for the share of vials above the limit, all to 3 decimal places.`,
  answer: [ph, rd(se, 3), lo, hi],
  hints: ['p̂ is the number of vials above the limit divided by the number of vials tested.', 'The standard error is the square root of p̂ times (1 − p̂), divided by n. The margin of error is z* times the standard error, and the bounds are p̂ minus and plus the margin.'],
  solution: `p̂ = ${n(x)} ÷ ${n(N)} = ${n(ph)}, so 1 − p̂ = ${n(qh)}. The standard error is √(${n(ph)} × ${n(qh)} ÷ ${n(N)}) ${eq(se, 4)}${eq(se, 3)[0] === '=' ? '' : `, which is ${fx(se, 3)} to 3 decimal places`}. At ${L}% confidence z* = ${z}, so the margin of error is ${z} × ${fx(se, 4)} ${eq(m, 3)}. The interval runs from ${n(ph)} − ${fx(m3, 3)} = ${fx(lo, 3)} to ${n(ph)} + ${fx(m3, 3)} = ${fx(hi, 3)}: between ${fx(100 * lo, 1)}% and ${fx(100 * hi, 1)}% of the well’s water is above the limit, with ${L}% confidence.`,
  guidance: [
   { prompt: `What is the sample proportion p̂ = ${n(x)} ÷ ${n(N)}?`, answer: [ph], explanation: `${n(x)} ÷ ${n(N)} = ${n(ph)}.` },
   { prompt: 'What is the standard error √(p̂(1 − p̂) ÷ n), to 3 decimal places?', answer: [rd(se, 3)], explanation: `${n(ph)} × ${n(qh)} = ${n(ph * qh)}; divided by ${n(N)} and square-rooted it is ${eq(se, 4).slice(2)}${eq(se, 3)[0] === '=' ? '' : `, which is ${fx(se, 3)} to 3 decimal places`}.` },
   { prompt: `Multiply the standard error by z* = ${z} to get the margin of error. Then subtract the margin from p̂ = ${n(ph)} and add it. What are the two bounds, to 3 decimal places?`, answer: [lo, hi], explanation: `The margin is ${z} × ${fx(se, 4)} ${eq(m, 3)}. ${n(ph)} − ${fx(m3, 3)} = ${fx(lo, 3)} and ${n(ph)} + ${fx(m3, 3)} = ${fx(hi, 3)}.` }
  ] }; }
});

/* q16c: does a survey sheet's share fit the interval? cs is the sheet's share in whole percent, at least 0.005 from both bounds. */
mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Does the survey sheet hold up',
 brief: 'An old survey sheet puts a number on how common copper streaks are in the new seam, and the lab has to say whether a fresh sample agrees.',
 labels: ['margin of error', 'lower bound', 'upper bound', 'inside (1 yes, 0 no)'], tolerance: 0.0005,
 gl: [['p̂', 'margin of error'], ['lower bound', 'upper bound'], ['inside (1 yes, 0 no)']]
}, {
 canonical: { L: 95, x: 90, N: 250, cs: 33 },
 draw: R => { for (;;) { const N = R.pick(NS16), x = R.int(Math.ceil(0.1 * N), Math.floor(0.9 * N)), L = R.pick([90, 95, 99]);
  if (!pokay(x, N, L)) continue; const c = pint(x, N, L), cs = R.int(Math.round(100 * (c.ph - 0.2)), Math.round(100 * (c.ph + 0.2)));
  if (cs < 5 || cs > 95 || Math.abs(cs / 100 - (c.ph - c.m)) < 0.005 || Math.abs(cs / 100 - (c.ph + c.m)) < 0.005) continue; return { L, x, N, cs }; } },
 build: ({ L, x, N, cs }) => { const { ph, qh, se, z, m, m3, lo, hi } = pint(x, N, L), sh = cs / 100, inside = sh > ph - m && sh < ph + m ? 1 : 0; return {
  prompt: `An old survey sheet says that ${n(cs)}% of the cores in the new seam show a copper streak, a proportion of ${n(sh)}. To check the sheet, the assay lab splits ${n(N)} rock cores and finds a streak in ${n(x)} of them. Both ${n(x)} and ${n(N - x)} are more than 5, so the normal curve can be used. ${ZLINE} Enter the margin of error z* × √(p̂(1 − p̂) ÷ n) for ${L}% confidence, then the lower and the upper bound of the confidence interval, all to 3 decimal places. Then enter 1 if the sheet’s proportion ${n(sh)} lies between the two bounds, or 0 if it lies outside them.`,
  answer: [m3, lo, hi, inside],
  hints: ['Find p̂ first: the cores with a streak divided by the cores split. Then the standard error is the square root of p̂ times (1 − p̂), divided by n, and the margin of error is z* times it.', 'The bounds are p̂ minus and plus the margin of error. A value lies inside the interval when it is bigger than the lower bound and smaller than the upper bound.'],
  solution: `p̂ = ${n(x)} ÷ ${n(N)} = ${n(ph)}, so 1 − p̂ = ${n(qh)}. The standard error is √(${n(ph)} × ${n(qh)} ÷ ${n(N)}) ${eq(se, 4)}, so at ${L}% confidence the margin of error is ${z} × ${fx(se, 4)} ${eq(m, 3)}. The interval runs from ${n(ph)} − ${fx(m3, 3)} = ${fx(lo, 3)} to ${n(ph)} + ${fx(m3, 3)} = ${fx(hi, 3)}. The sheet’s ${n(sh)} is ${inside ? 'between' : 'not between'} ${fx(lo, 3)} and ${fx(hi, 3)}, so the answer is ${inside}: the sample ${inside ? 'is consistent with the sheet' : 'does not support the sheet'}.`,
  guidance: [
   { prompt: `What is p̂ = ${n(x)} ÷ ${n(N)}, and then the margin of error z* × √(p̂(1 − p̂) ÷ n) with z* = ${z}, to 3 decimal places?`, answer: [ph, m3], explanation: `p̂ = ${n(x)} ÷ ${n(N)} = ${n(ph)}. The standard error is √(${n(ph)} × ${n(qh)} ÷ ${n(N)}) ${eq(se, 4)}, and ${z} × ${fx(se, 4)} ${eq(m, 3)}.` },
   { prompt: `Subtract the margin from p̂ = ${n(ph)}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${n(ph)} − ${fx(m3, 3)} = ${fx(lo, 3)} and ${n(ph)} + ${fx(m3, 3)} = ${fx(hi, 3)}.` },
   { prompt: `The interval runs from ${fx(lo, 3)} to ${fx(hi, 3)}. Does the sheet’s ${n(sh)} lie between them? Enter 1 for yes, 0 for no.`, answer: [inside], explanation: `${n(sh)} is ${inside ? 'between' : 'outside'} ${fx(lo, 3)} and ${fx(hi, 3)}, so the answer is ${inside}.` }
  ] }; }
});

/* q16d: the same count at two confidence levels (uses q12: a higher level gives a wider interval), then the sample size that
   would cut the higher level's margin to E, with p̂ as the planning guess: z*² p̂(1 − p̂) ÷ E² rounded up. E is below that
   margin, and draws where z*² p̂(1 − p̂) ÷ E² lies within 0.02 of a whole number are redrawn. pr is only an index into LP. */
const ES16 = [0.02, 0.025, 0.03, 0.04, 0.05];
const need16 = (x, N, L, E) => { const ph = x / N, z = Number(ZS[L]), q = z * z * ph * (1 - ph) / (E * E); return { q, need: Math.ceil(q - 1e-9) }; };
const LP = [[90, 95], [90, 99], [95, 99]];
mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q12', title: 'Quick look and careful look',
 brief: 'Mira wants a quick interval and a careful one from the same sample of cores, so the council can see what extra certainty costs.',
 labels: ['lower bound, lower level', 'upper bound, lower level', 'lower bound, higher level', 'upper bound, higher level', 'sample size needed'], tolerance: 0.0005,
 gl: [['standard error'], ['margin at lower level', 'margin at higher level'], ['lower bound, lower level', 'upper bound, lower level', 'lower bound, higher level', 'upper bound, higher level'], ['z*² × p̂(1 − p̂) ÷ E²', 'sample size needed']]
}, {
 canonical: { pr: 1, x: 56, N: 250, E: 0.05 },
 draw: R => { for (;;) { const N = R.pick(NS16), p = { pr: R.int(0, 2), x: R.int(Math.ceil(0.08 * N), Math.floor(0.92 * N)), N, E: R.pick(ES16) };
  if (!LP[p.pr].every(L => pokay(p.x, p.N, L)) || (p.x === 45 && p.N === 100)) continue;
  const L2 = LP[p.pr][1], { q } = need16(p.x, p.N, L2, p.E), f = q - Math.floor(q);
  if (p.E >= pint(p.x, p.N, L2).m || f < 0.02 || f > 0.98 || tie(q, 2)) continue; return p; } },
 build: ({ pr, x, N, E }) => { const [L1, L2] = LP[pr], a = pint(x, N, L1), b = pint(x, N, L2), { ph, qh, se } = a, { q, need } = need16(x, N, L2, E); return {
  prompt: `The assay lab splits ${n(N)} rock cores from the old seam, and ${n(x)} of them show a copper streak. Both ${n(x)} and ${n(N - x)} are more than 5, so the normal curve can be used. Mira wants a quick interval at ${L1}% confidence and a careful one at ${L2}%, both for the proportion of cores with a streak. ${ZLINE} Enter the lower and the upper bound at ${L1}% confidence, then the lower and the upper bound at ${L2}%, all to 3 decimal places. Then Mira asks how many cores a new sample would need for a margin of error of at most ${n(E)} at ${L2}% confidence. Taking this p̂ as the planning guess, enter that smallest whole number of cores, without commas.`,
  answer: [a.lo, a.hi, b.lo, b.hi, need],
  hints: ['Both intervals use the same p̂ and the same standard error √(p̂(1 − p̂) ÷ n). Only the critical value z* changes with the confidence level.', 'For each level the margin of error is its z* times the standard error, and the bounds are p̂ minus and plus that margin. The higher level has the larger z*, so its interval is the wider one.', 'For the sample size, solve margin = z* × √(p̂(1 − p̂) ÷ n) for n: n = z*² × p̂(1 − p̂) ÷ E², where E is the margin wanted. Round up to the next whole number, even when the decimal part is small.'],
  solution: `p̂ = ${n(x)} ÷ ${n(N)} = ${n(ph)}, so 1 − p̂ = ${n(qh)}. The standard error is √(${n(ph)} × ${n(qh)} ÷ ${n(N)}) ${eq(se, 4)}, the same for both levels. At ${L1}%, z* = ${a.z} and the margin is ${a.z} × ${fx(se, 4)} ${eq(a.m, 3)}, so the interval runs from ${fx(a.lo, 3)} to ${fx(a.hi, 3)}. At ${L2}%, z* = ${b.z} and the margin is ${b.z} × ${fx(se, 4)} ${eq(b.m, 3)}, so it runs from ${fx(b.lo, 3)} to ${fx(b.hi, 3)}. The careful interval is wider, as it must be: more certainty costs a wider range. For a margin of at most ${n(E)} at ${L2}%, n = ${b.z}² × ${n(ph)} × ${n(qh)} ÷ ${n(E)}² ≈ ${fx(q, 2)}, so ${n(need)} cores are needed (rounded up).`,
  guidance: [
   { prompt: `What is the standard error √(p̂(1 − p̂) ÷ n), with p̂ = ${n(x)} ÷ ${n(N)} = ${n(ph)}, to 3 decimal places?`, answer: [rd(se, 3)], explanation: `${n(ph)} × ${n(qh)} = ${n(ph * qh)}; divided by ${n(N)} and square-rooted it is ${eq(se, 4).slice(2)}${eq(se, 3)[0] === '=' ? '' : `, which is ${fx(se, 3)} to 3 decimal places`}.` },
   { prompt: `Multiply the standard error by z* = ${a.z} for ${L1}% and by z* = ${b.z} for ${L2}%. What are the two margins of error, to 3 decimal places?`, answer: [a.m3, b.m3], explanation: `${a.z} × ${fx(se, 4)} ${eq(a.m, 3)} and ${b.z} × ${fx(se, 4)} ${eq(b.m, 3)}.` },
   { prompt: `Subtract each margin from p̂ = ${n(ph)} and add it. What are the ${L1}% bounds and then the ${L2}% bounds?`, answer: [a.lo, a.hi, b.lo, b.hi], explanation: `${L1}%: ${n(ph)} − ${fx(a.m3, 3)} = ${fx(a.lo, 3)} and ${n(ph)} + ${fx(a.m3, 3)} = ${fx(a.hi, 3)}. ${L2}%: ${n(ph)} − ${fx(b.m3, 3)} = ${fx(b.lo, 3)} and ${n(ph)} + ${fx(b.m3, 3)} = ${fx(b.hi, 3)}.` },
   { prompt: `For a margin of at most E = ${n(E)} at ${L2}% confidence, with p̂ = ${n(ph)} as the guess, what is z*² × p̂(1 − p̂) ÷ E² to 2 decimal places, and the smallest whole number of cores?`, answer: [rd(q, 2), need], explanation: `${b.z}² × ${n(ph)} × ${n(qh)} ÷ ${n(E)}² ≈ ${fx(q, 2)}. Rounding up, not to the nearest, gives ${n(need)} cores: any fewer and the margin would be just above ${n(E)}.` }
  ] }; }
});

/* ---- q17 Chapter review: which interval? [8.1, 8.2, 8.3] ---- */

/* The three stories' numbers. k is the right interval: 1 z (σ known), 2 t (s from a sample of 9 to 12), 3 proportion. */
const q17calc = p => {
 if (p.k === 1) { const N = p.r * p.r, se = p.sig / p.r, z = ZS[p.L], m = Number(z) * se; return { N, se, crit: z, m, d: 2, est: p.xb }; }
 if (p.k === 2) { const s = p.s10 / 10, N = p.Nt, se = s / Math.sqrt(N), t = TT[N - 1][COL[p.L]], m = Number(t) * se; return { N, s, se, crit: t, m, d: 2, est: p.xb }; }
 const ph = p.x / p.Np, se = Math.sqrt(ph * (1 - ph) / p.Np), z = ZS[p.L], m = Number(z) * se; return { N: p.Np, ph, se, crit: z, m, d: 3, est: ph };
};
/* Story sets: u the unit, z / t / pr the three stories, cnt what the proportion counts. */
const Q17 = {
 b: { u: 'mg/L', cnt: 'cloudy bottles and clear ones',
  z: (p, c) => `Long records give σ = ${n(p.sig)} mg/L for the salt in the outpost well water. A sample of ${n(c.N)} bottles of it has a mean of ${n(p.xb)} mg/L. The council wants a ${p.L}% confidence interval for the mean salt content of the well water.`,
  t: (p, c) => `A new well has no records of σ. A sample of ${n(c.N)} bottles of its water has a mean of ${n(p.xb)} mg/L and sample standard deviation s = ${n(c.s)} mg/L. The council wants a ${p.L}% confidence interval for the mean salt content of the new well’s water.`,
  pr: (p, c) => `${n(p.x)} of ${n(c.N)} bottles of well water came out cloudy; both counts, cloudy and clear, are more than 5. The council wants a ${p.L}% confidence interval for the proportion of bottles that come out cloudy.` },
 c: { u: 'g', cnt: 'pellets that crumbled and pellets that held',
  z: (p, c) => `The assay furnace’s long records give σ = ${n(p.sig)} g for the mass of its pellets. A sample of ${n(c.N)} pellets has a mean mass of ${n(p.xb)} g. The council wants a ${p.L}% confidence interval for the mean pellet mass.`,
  t: (p, c) => `A new furnace mix has no records of σ. A sample of ${n(c.N)} of its pellets has a mean mass of ${n(p.xb)} g and sample standard deviation s = ${n(c.s)} g. The council wants a ${p.L}% confidence interval for the mean pellet mass.`,
  pr: (p, c) => `${n(p.x)} of ${n(c.N)} pellets crumbled in the furnace; both counts, crumbled and held, are more than 5. The council wants a ${p.L}% confidence interval for the proportion of pellets that crumble.` },
 d: { u: 'tonnes', cnt: 'trucks above the target and trucks not above it',
  z: (p, c) => `The depot’s long records give σ = ${n(p.sig)} tonnes for the load of its trucks. A sample of ${n(c.N)} trucks has a mean load of ${n(p.xb)} tonnes and sample standard deviation s = ${n(p.s10 / 10)} tonnes. The council wants a ${p.L}% confidence interval for the mean load.`,
  t: (p, c) => `A new type of truck has no records of σ. A sample of ${n(c.N)} of them has a mean load of ${n(p.xb)} tonnes and sample standard deviation s = ${n(c.s)} tonnes. The council wants a ${p.L}% confidence interval for the mean load of this type.`,
  pr: (p, c) => `${n(p.x)} of ${n(c.N)} trucks arrived with a load above the target; both counts, above and not above, are more than 5. Their mean load was ${n(p.xb)} tonnes. The council wants a ${p.L}% confidence interval for the proportion of trucks that arrive above the target.` }
};
/* Draws as the learn mission does: tidy standard errors, exact p̂ to 3 decimals, margins that are never rounding ties. mode c also draws the limit T. */
const q17draw = mode => R => { for (;;) { const p = { k: R.int(1, 3), L: R.pick([90, 95, 99]), xb: R.int(200, 800) / 10, sig: R.int(4, 30), r: R.pick(ROOTS), Nt: R.int(9, 12), s10: R.int(20, 80) };
 p.Np = R.pick([100, 200, 250, 400, 500]); p.x = R.int(Math.ceil(0.1 * p.Np), Math.floor(0.9 * p.Np));
 if (!tidySE(p.sig, p.r) || (p.x * 1000) % p.Np !== 0 || (p.k === 1 && p.sig === 8 && p.r === 8 && p.L === 95 && p.xb === 30)) continue;
 const c = q17calc(p); if (tie(c.m, c.d)) continue;
 if (mode === 'c') { p.T = rd(c.m * R.pick([0.6, 0.75, 1.3, 1.6]), c.d); if (p.T <= 0 || Math.abs(p.T - c.m) < 0.15 * c.m) continue; }
 return p; } };
const q17build = mode => p => { const S = Q17[mode], { k, L, xb } = p, c = q17calc(p), d = c.d, lo = rd(c.est - c.m, d), hi = rd(c.est + c.m, d), md = rd(c.m, d), u = S.u, dp = d === 3 ? '3 decimal places, as proportions' : '2 decimal places';
 const story = (k === 1 ? S.z : k === 2 ? S.t : S.pr)(p, c);
 const work = k === 1 ? `σ is known from the records, so this is the z interval, number 1. The standard error is ${n(p.sig)} ÷ √${n(c.N)} = ${n(c.se)}, and the margin is ${c.crit} × ${n(c.se)} ${eq(c.m, 2)} ${u}.`
  : k === 2 ? `Only s from this sample is known, so this is the t interval, number 2, with df = ${n(c.N)} − 1 = ${n(c.N - 1)} and t* = ${c.crit}. The standard error is ${n(c.s)} ÷ √${n(c.N)} ${eq(c.se, 4)}, and the margin is ${c.crit} × ${fx(c.se, 4)} ${eq(c.m, 2)} ${u}.`
  : `The reading is a count of ${S.cnt}, so this is the interval for a proportion, number 3. p̂ = ${n(p.x)} ÷ ${n(c.N)} = ${n(c.ph)}, the standard error is √(${n(c.ph)} × ${n(1 - c.ph)} ÷ ${n(c.N)}) ${eq(c.se, 4)}, and the margin is ${c.crit} × ${fx(c.se, 4)} ${eq(c.m, 3)}.`;
 const unit = k === 3 ? '' : ' ' + u, est = k === 3 ? n(c.ph) : n(xb);
 const kind = { prompt: 'Is σ known from records (1), is only s from the sample known (2), or is the reading a count of yes-or-no results (3)? Enter the number of the interval.', answer: [k],
  explanation: k === 1 ? 'The records give σ, so the z interval fits: number 1.' : k === 2 ? 'There are no records of σ, only s from this sample, so the t interval fits: number 2.' : 'The data are a count of items with or without something, so the interval for a proportion fits: number 3.' };
 const base = `${story} The intervals: 1, the z interval for a mean (σ known); 2, the t interval for a mean (σ unknown, s from the sample); 3, the interval for a proportion. ${ZLINE} ${TLINE}`;
 const pick = 'σ known from long records points to z; only s from this sample points to t, with df = n − 1; a count of items with or without something points to a proportion.';
 if (mode === 'b') return {
  prompt: `${base} Enter the number of the right interval, then its lower and its upper bound, to ${dp}.`,
  answer: [k, lo, hi],
  hints: [pick, 'Whichever interval it is, the margin of error is the critical value times the standard error, and the bounds are the estimate minus and plus the margin.'],
  solution: `${work} The interval runs from ${est} − ${fx(md, d)} = ${fx(lo, d)} to ${est} + ${fx(md, d)} = ${fx(hi, d)}.`,
  guidance: [kind,
   { prompt: `What is the margin of error, to ${d} decimal places?`, answer: [md], explanation: work },
   { prompt: `Subtract the margin from the estimate ${est}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${est} − ${fx(md, d)} = ${fx(lo, d)} and ${est} + ${fx(md, d)} = ${fx(hi, d)}.` }] };
 if (mode === 'c') { const ok = c.m <= p.T ? 1 : 0; return {
  prompt: `${base} The council can only use the result if the margin of error is at most ${n(p.T)}${unit}. Enter the number of the right interval, then its margin of error to ${d} decimal places, then 1 if the margin of error is at most ${n(p.T)}${unit}, or 0 if it is larger (compare the unrounded margin with the limit).`,
  answer: [k, md, ok],
  hints: [pick, 'The margin of error is the critical value times the standard error. It is within the limit when it is smaller than or equal to the limit.'],
  solution: `${work} The margin of error is ${fx(md, d)}${unit}, which is ${ok ? 'within' : 'larger than'} the limit of ${n(p.T)}${unit}, so the answer is ${ok}.`,
  guidance: [kind,
   { prompt: `What is the margin of error, to ${d} decimal places?`, answer: [md], explanation: work },
   { prompt: `The council’s limit is ${n(p.T)}${unit}. Is the margin of error ${fx(md, d)} at most that? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: `${fx(md, d)} is ${ok ? 'no more than' : 'more than'} ${n(p.T)}, so the answer is ${ok}.` }] }; }
 return {
  prompt: `${base} Some numbers in the story may not be needed. Enter the number of the right interval, then the critical value it uses (z* or t*), then its lower and its upper bound, with the bounds to ${dp}.`,
  answer: [k, Number(c.crit), lo, hi],
  hints: ['Ask what the question is about and which spread is the right one: σ known from long records points to z, only s from this sample to t, a count to a proportion. Numbers that do not belong to that interval are not used.', 'A z interval and an interval for a proportion use z* from the critical values line; a t interval uses t* from the row df = n − 1. Then the margin is the critical value times the standard error, and the bounds are the estimate minus and plus the margin.'],
  solution: `${work} The critical value is ${c.crit}. The interval runs from ${est} − ${fx(md, d)} = ${fx(lo, d)} to ${est} + ${fx(md, d)} = ${fx(hi, d)}.`,
  guidance: [kind,
   { prompt: k === 2 ? 'Which critical value does this interval use? Read it from the t table row for df = n − 1, at the stated confidence level.' : 'Which critical value does this interval use? Read it from the critical values line, at the stated confidence level.', answer: [Number(c.crit)], explanation: k === 2 ? `df = ${n(c.N)} − 1 = ${n(c.N - 1)}, and the ${L}% column of that row gives t* = ${c.crit}.` : `At ${L}% confidence z* = ${c.crit}.` },
   { prompt: `What is the margin of error, to ${d} decimal places?`, answer: [md], explanation: work },
   { prompt: `Subtract the margin from the estimate ${est}, then add it. What are the two bounds?`, answer: [lo, hi], explanation: `${est} − ${fx(md, d)} = ${fx(lo, d)} and ${est} + ${fx(md, d)} = ${fx(hi, d)}.` }] };
};

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'Two wells, two questions',
 brief: 'The outpost well and a newly drilled one are both sending bottles to the lab, and each question needs its own kind of interval.',
 labels: ['interval number', 'lower bound', 'upper bound'], tolerance: 0.0005,
 gl: [['interval number'], ['margin of error'], ['lower bound', 'upper bound']]
}, { canonical: { k: 3, L: 90, xb: 38.4, sig: 12, r: 6, Nt: 10, s10: 35, x: 80, Np: 200 }, draw: q17draw('b'), build: q17build('b') });

mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'Precise enough for the council',
 brief: 'The council will only act on a furnace result if its margin of error is small enough, so the lab has to pick the right interval and check the margin.',
 labels: ['interval number', 'margin of error', 'within the limit (1 yes, 0 no)'], tolerance: 0.0005,
 gl: [['interval number'], ['margin of error'], ['within the limit (1 yes, 0 no)']]
}, { canonical: { k: 1, L: 99, xb: 52.7, sig: 15, r: 5, Nt: 10, s10: 35, x: 60, Np: 250, T: 4.5 }, draw: q17draw('c'), build: q17build('c') });

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q14', title: 'Sorting out the depot figures',
 brief: 'The depot has handed over its figures with extra numbers mixed in, and the lab must pick out the ones the right interval needs.',
 labels: ['interval number', 'critical value', 'lower bound', 'upper bound'], tolerance: 0.0005,
 gl: [['interval number'], ['critical value'], ['margin of error'], ['lower bound', 'upper bound']]
}, { canonical: { k: 2, L: 99, xb: 31.6, sig: 12, r: 6, Nt: 11, s10: 42, x: 60, Np: 250 }, draw: q17draw('d'), build: q17build('d') });

/* ---- q18 Null and alternative hypotheses [9.1] ---- */

/* H₀ takes ≥ when Hₐ is <, ≤ when Hₐ is >, = when Hₐ is ≠ (OpenStax 9.1, Table 9.1). Tail code 1 left, 2 right, 3 two-tailed. */
const TAIL = { 1: ['≥', '<', 'left-tailed'], 2: ['≤', '>', 'right-tailed'], 3: ['=', '≠', 'two-tailed'] };
const SUSP = ' In the test, μ stands for the true mean of everything the supplier sends.';
/* Claims for q18b: [text with the value, tail code, value range [lo, hi, step]]. c is only an index into this list. */
const CB = [
 [v => `The pump maker claims that its water pumps deliver at least ${v} litres a minute on average. The crew suspects that they deliver less.`, 1, [20, 80, 1]],
 [v => `The paint maker claims that its paint dries in a mean of ${v} minutes. The crew suspects that it takes longer to dry.`, 2, [30, 90, 1]],
 [v => `The tile maker claims that its tiles have a mean thickness of ${v} mm. The inspectors want to know whether the mean thickness is different from that, in either direction.`, 3, [8, 20, 1]],
 [v => `The glove maker claims that its gloves last at least ${v} days on average. The inspectors suspect that they wear out sooner.`, 1, [20, 60, 1]],
 [v => `The ration packer claims that its tins hold at most ${v} grams of salt on average. The crew suspects that they hold more.`, 2, [350, 500, 5]],
 [v => `The thread supplier claims that its thread has a mean diameter of ${v} micrometres. The inspectors check whether the mean diameter has changed, in either direction.`, 3, [40, 90, 1]]
];
mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The pump maker’s promise',
 brief: 'Six suppliers have sent promises to the Inspection Hall, and each promise has to be written as H₀ before anyone tests it.',
 labels: ['value in H₀', 'tail code'], tolerance: 0.01,
 gl: [['value in H₀'], ['tail code']]
}, {
 canonical: { c: 0, v: 45 },
 draw: R => { const c = R.int(0, 5), [lo, hi, step] = CB[c][2]; return { c, v: step * R.int(lo / step, hi / step) }; },
 build: ({ c, v }) => { const [text, code] = CB[c], [s0, sA, name] = TAIL[code]; return {
  prompt: `${text(n(v))}${SUSP} Enter the number that the null hypothesis H₀ contains, then the tail code of the test: 1 if it is left-tailed, 2 if right-tailed, 3 if two-tailed.`,
  answer: [v, code],
  hints: ['H₀ is the supplier’s claim written with an equals sign in it (=, ≥ or ≤). The number in it is the claimed mean.', 'Hₐ is the suspicion. A suspicion of less points to <, which is left-tailed. A suspicion of more points to >, which is right-tailed. A suspicion of different points to ≠, which is two-tailed.'],
  solution: `H₀: μ ${s0} ${n(v)} and Hₐ: μ ${sA} ${n(v)}. The number in H₀ is ${n(v)}. Hₐ uses ${sA}, so the test is ${name}: code ${code}.`,
  guidance: [
   { prompt: 'Which number does the claim give for the mean μ?', answer: [v], explanation: `The claim is about the value ${n(v)}, so H₀ is μ ${s0} ${n(v)}.` },
   { prompt: `The suspicion goes into Hₐ. Enter 1 if Hₐ reads μ < ${n(v)}, 2 if it reads μ > ${n(v)}, 3 if it reads μ ≠ ${n(v)}.`, answer: [code], explanation: `Hₐ: μ ${sA} ${n(v)}, so the test is ${name}.` }
  ] }; }
});

/* Claims for q18c and q20d: [text with the value, tail code, unit, value range [lo, hi, step]]. */
const CC = [
 [v => `The tank maker claims that its water tanks hold at least ${v} litres on average. The crew suspects that they hold less.`, 1, 'litres', [200, 800, 10]],
 [v => `The lamp maker claims that its lamps warm up in a mean of ${v} seconds. The crew suspects that they take longer.`, 2, 'seconds', [20, 60, 1]],
 [v => `The peg maker claims that its tent pegs have a mean length of ${v} cm. The inspectors want to know whether the mean length is different from that, in either direction.`, 3, 'cm', [20, 45, 1]],
 [v => `The cell maker claims that its power cells last at least ${v} hours on average. The inspectors suspect that they fail sooner.`, 1, 'hours', [40, 120, 1]],
 [v => `The mill claims that its sacks of flour hold at most ${v} kg on average. The crew suspects that they hold more.`, 2, 'kg', [20, 50, 1]],
 [v => `The lens maker claims that its lenses have a mean width of ${v} mm. The inspectors check whether the mean width has changed, in either direction.`, 3, 'mm', [30, 80, 1]]
];
/* q18c: d is the sample mean minus the claimed value, never 0. */
mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Which side can count',
 brief: 'A sample has come back from a supplier, and the inspectors must set up the test and ask whether the sample could even point against the claim.',
 labels: ['value in H₀', 'tail code', 'could count (1 yes, 0 no)'], tolerance: 0.01,
 gl: [['value in H₀'], ['tail code'], ['could count (1 yes, 0 no)']]
}, {
 canonical: { c: 3, v: 80, N: 40, d: 6 },
 draw: R => { const c = R.int(0, 5), [lo, hi, step] = CC[c][3]; return { c, v: step * R.int(lo / step, hi / step), N: R.pick([25, 30, 36, 40, 50, 64]), d: R.nz(-9, 9) }; },
 build: ({ c, v, N, d }) => { const [text, code, unit] = CC[c], [s0, sA, name] = TAIL[code], xb = v + d, side = code === 3 || (code === 1 && d < 0) || (code === 2 && d > 0) ? 1 : 0; return {
  prompt: `${text(n(v))}${SUSP} The inspectors take a sample of ${n(N)} items and find a mean of ${n(xb)} ${unit}. Evidence against H₀ can only come from a sample mean on the side that Hₐ points to: below the claimed value for <, above it for >, and either side for ≠. Enter the number in H₀, then the tail code (1 for left-tailed, 2 for right-tailed, 3 for two-tailed), then 1 if this sample mean lies on a side that could count as evidence against H₀, or 0 if it does not.`,
  answer: [v, code, side],
  hints: ['H₀ is the claim, written with an equals sign in it. Hₐ is the suspicion: less points to <, more to >, different to ≠. The sign in Hₐ gives the tail.', 'Compare the sample mean with the claimed value. Is it on the side that Hₐ points to?'],
  solution: `H₀: μ ${s0} ${n(v)} and Hₐ: μ ${sA} ${n(v)}, so the number in H₀ is ${n(v)} and the test is ${name}: code ${code}. The sample mean ${n(xb)} is ${d < 0 ? 'below' : 'above'} ${n(v)}. ${code === 3 ? 'A two-tailed test counts either side' : `Hₐ points to ${code === 1 ? 'below' : 'above'}`}, so the answer is ${side}.`,
  guidance: [
   { prompt: 'Which number does the claim give for the mean μ?', answer: [v], explanation: `The claim is about the value ${n(v)}, so H₀ is μ ${s0} ${n(v)}.` },
   { prompt: `The suspicion goes into Hₐ. Enter 1 if Hₐ reads μ < ${n(v)}, 2 if it reads μ > ${n(v)}, 3 if it reads μ ≠ ${n(v)}.`, answer: [code], explanation: `Hₐ: μ ${sA} ${n(v)}, so the test is ${name}.` },
   { prompt: `Hₐ reads μ ${sA} ${n(v)}, and the sample mean is ${n(xb)}. Does the sample mean lie on a side that could count as evidence against H₀? Enter 1 for yes, 0 for no.`, answer: [side], explanation: `${n(xb)} is ${d < 0 ? 'below' : 'above'} ${n(v)}, and ${code === 3 ? 'a two-tailed test counts either side' : `Hₐ points to ${code === 1 ? 'below' : 'above'}`}: the answer is ${side}.` }
  ] }; }
});

/* Claims for q18d, in blunter or less usual words: [text with the value, tail code, value range [lo, hi, step]]. */
const CD = [
 [v => `A cable maker promises a mean breaking load of no less than ${v} kN. The crew fears that it is lower.`, 1, [40, 120, 1]],
 [v => `A fuel merchant says that a canister burns for no more than ${v} hours on average. The crew thinks that it burns longer.`, 2, [10, 40, 1]],
 [v => `A glass maker says that its panes have kept a mean thickness of ${v} mm. The inspectors want to find out whether that has changed.`, 3, [4, 12, 1]],
 [v => `A paint maker guarantees a mean coverage of not under ${v} square metres a tin. The inspectors suspect that it is under.`, 1, [8, 30, 1]],
 [v => `A seed supplier states that its seeds need at most ${v} days to sprout on average. The crew suspects that they need longer.`, 2, [5, 14, 1]],
 [v => `A rope maker says that its rope has a mean diameter of ${v} mm. The inspectors will flag it if the mean is off in either direction.`, 3, [8, 30, 1]],
 [v => `A battery supplier states that its packs charge in not more than ${v} minutes on average. The crew believes that they take more.`, 2, [30, 90, 1]],
 [v => `A belt maker states that its belts last at least ${v} weeks on average before they wear through. The crew suspects that they wear through sooner.`, 1, [50, 150, 1]]
];
mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', title: 'Two claims, two tests',
 brief: 'Two supplier claims reached the Inspection Hall on the same day, in different words, and both must be set up as tests.',
 labels: ['value in H₀, claim A', 'tail code, claim A', 'value in H₀, claim B', 'tail code, claim B'], tolerance: 0.01,
 gl: [['value in H₀, claim A', 'tail code, claim A'], ['value in H₀, claim B', 'tail code, claim B']]
}, {
 canonical: { a: 0, va: 75, b: 4, vb: 9 },
 /* a and b are only indices into CD (two different claims); va and vb are their claimed values. */
 draw: R => { const a = R.int(0, 7), b = R.except(0, 7, [a]), pickv = i => { const [lo, hi, step] = CD[i][2]; return step * R.int(lo / step, hi / step); }; return { a, va: pickv(a), b, vb: pickv(b) }; },
 build: ({ a, va, b, vb }) => { const [ta, ca] = CD[a], [tb, cb] = CD[b], [a0, aA, an] = TAIL[ca], [b0, bA, bn] = TAIL[cb]; return {
  prompt: `Two claims reach the Inspection Hall. Claim A: ${ta(n(va))} Claim B: ${tb(n(vb))} In each test, μ stands for the true mean of everything that supplier sends. For each claim in turn, enter the number in H₀ and then its tail code (1 for left-tailed, 2 for right-tailed, 3 for two-tailed): first claim A, then claim B.`,
  answer: [va, ca, vb, cb],
  hints: ['In each claim, H₀ is what the supplier says, written with an equals sign in it. The number in it is the claimed mean.', 'Hₐ is what the crew suspects: less points to <, which is left-tailed; more points to >, right-tailed; different or changed points to ≠, two-tailed. Read the suspicion, not the supplier’s own words, to find the tail.'],
  solution: `Claim A: H₀: μ ${a0} ${n(va)} and Hₐ: μ ${aA} ${n(va)}, so the value is ${n(va)} and the test is ${an}: code ${ca}. Claim B: H₀: μ ${b0} ${n(vb)} and Hₐ: μ ${bA} ${n(vb)}, so the value is ${n(vb)} and the test is ${bn}: code ${cb}.`,
  guidance: [
   { prompt: 'Claim A. Which number is in H₀, and what is the tail code (1 for left-tailed, 2 for right-tailed, 3 for two-tailed)?', answer: [va, ca], explanation: `H₀: μ ${a0} ${n(va)} and Hₐ: μ ${aA} ${n(va)}, so the test is ${an}: code ${ca}.` },
   { prompt: 'Claim B. Which number is in H₀, and what is the tail code (1 for left-tailed, 2 for right-tailed, 3 for two-tailed)?', answer: [vb, cb], explanation: `H₀: μ ${b0} ${n(vb)} and Hₐ: μ ${bA} ${n(vb)}, so the test is ${bn}: code ${cb}.` }
  ] }; }
});

/* ---- q19 Type I and Type II errors, α, β and power [9.2] ---- */

/* q19b: α = A ÷ 100, power P ÷ 100, N detectors (a multiple of 100). Never the worked example (α = 0.01, β = 0.3, 500 tests). */
mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'Missed smoke alarms',
 brief: 'The Inspection Hall is testing batches of smoke detectors, and Mira wants to know how many faulty ones would slip through.',
 labels: ['β', 'expected misses'], tolerance: 0.005,
 gl: [['β'], ['error type (1 or 2)'], ['expected misses']]
}, {
 canonical: { A: 5, P: 90, N: 300 },
 draw: R => { for (;;) { const p = { A: R.pick([1, 5, 10]), P: R.int(55, 95), N: 100 * R.int(1, 9) }; if (p.A === 1 && p.P === 70 && p.N === 500) continue; return p; } },
 build: ({ A, P, N }) => { const a = A / 100, pw = P / 100, b = (100 - P) / 100, ms = N * (100 - P) / 100; return {
  prompt: `The Inspection Hall tests batches of smoke detectors, with H₀: the batch meets its rated sensitivity, at significance level α = ${n(a)}. When a batch really is below its rating, the test catches it with probability ${n(pw)}, which is the power of the test. Enter β, the chance that the test misses a batch that is really below its rating. Then the hall tests ${n(N)} batches, each separately, that all turn out to be below their rating: enter the expected number of them that the test misses.`,
  answer: [b, ms],
  hints: ['Catching a real fault and missing it are the only two outcomes for a batch that is below its rating, so the power and β add up to 1.', 'Missing a real fault is keeping a false H₀, and each test does it with probability β. The expected number of misses is the number of tests times β.'],
  solution: `β = 1 − power = 1 − ${n(pw)} = ${n(b)}. Every one of the ${n(N)} batches is below its rating, so H₀ is false each time, and a miss is a Type II error, with probability β = ${n(b)} in each test. The expected number of misses is ${n(N)} × ${n(b)} = ${n(ms)}.`,
  guidance: [
   { prompt: `What is β, with power ${n(pw)}?`, answer: [b], explanation: `β = 1 − ${n(pw)} = ${n(b)}: the test misses ${n(100 - P)}% of the batches that really are below their rating.` },
   { prompt: 'A batch that is really below its rating is not flagged by the test. Is that a Type I error (enter 1) or a Type II error (enter 2)?', answer: [2], explanation: 'H₀ was false and was kept: a Type II error, a miss.' },
   { prompt: `Each of the ${n(N)} tests misses with probability β = ${n(b)}. What is the expected number of misses?`, answer: [ms], explanation: `${n(N)} × ${n(b)} = ${n(ms)}.` }
  ] }; }
});

/* q19c: F tins meet their weight (a multiple of 100), S are underweight (a multiple of 10), power P ÷ 100, α = A ÷ 100. */
mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'The ration tin audit',
 brief: 'The hall will audit a mixed pile of ration tins, and the quartermaster wants to know how many honest tins will be wrongly turned away and how many short ones will be caught.',
 labels: ['tins that meet their weight', 'expected short tins caught', 'expected false alarms'], tolerance: 0.005,
 gl: [['tins that meet their weight'], ['expected short tins caught'], ['expected false alarms']]
}, {
 canonical: { A: 5, P: 85, F: 400, S: 60 },
 draw: R => ({ A: R.pick([1, 5, 10]), P: R.int(55, 95), F: 100 * R.int(1, 8), S: 10 * R.int(1, 9) }),
 build: ({ A, P, F, S }) => { const a = A / 100, pw = P / 100, T = F + S, caught = S * P / 100, fa = F * A / 100; return {
  prompt: `The Inspection Hall will test ${n(T)} tins of rations, each separately, and ${n(S)} of the tins are really underweight. In each test, H₀ says that the tin meets its weight. The test runs at significance level α = ${n(a)} and has power ${n(pw)}. A tin that meets its weight is wrongly rejected with probability α, and an underweight tin is caught with probability equal to the power. Enter the number of tins that meet their weight, then the expected number of underweight tins that the test catches, then the expected number of tins that meet their weight but are wrongly rejected.`,
  answer: [F, caught, fa],
  hints: ['The tins that meet their weight are the ones that are not underweight. For them H₀ is true, so a rejection is a Type I error, with probability α.', 'An underweight tin has H₀ false, and the test rejects it with probability equal to the power. For any group of separate tests, the expected number of rejections is the number of tests in the group times the probability.'],
  solution: `${n(T)} − ${n(S)} = ${n(F)} tins meet their weight. Of the ${n(S)} underweight tins, the test catches a share equal to the power: ${n(S)} × ${n(pw)} = ${n(caught)}. Each of the ${n(F)} honest tins is wrongly rejected with probability α = ${n(a)}, a Type I error: ${n(F)} × ${n(a)} = ${n(fa)}.`,
  guidance: [
   { prompt: `How many of the ${n(T)} tins meet their weight, when ${n(S)} are underweight?`, answer: [F], explanation: `${n(T)} − ${n(S)} = ${n(F)}.` },
   { prompt: `Each underweight tin is caught with probability ${n(pw)}. What is the expected number of the ${n(S)} underweight tins that are caught?`, answer: [caught], explanation: `${n(S)} × ${n(pw)} = ${n(caught)}.` },
   { prompt: `Each of the ${n(F)} tins that meet their weight is wrongly rejected with probability α = ${n(a)}. What is the expected number of false alarms?`, answer: [fa], explanation: `${n(F)} × ${n(a)} = ${n(fa)}.` }
  ] }; }
});

/* q19d: the claim (H₀ for a given value) is true for every batch when t = 1 and false when t = 0; c is only an index into CE. */
const CE = [
 [v => `The oxygen supplier claims that its canisters hold at least ${v} litres on average`, '≥', [30, 60, 1]],
 [v => `The bolt maker claims that its bolts weigh at most ${v} grams on average`, '≤', [40, 120, 1]],
 [v => `The cell maker claims that its power cells last at least ${v} hours on average`, '≥', [60, 140, 1]],
 [v => `The charger maker claims that its chargers take at most ${v} minutes on average to fill a pack`, '≤', [30, 90, 1]]
];
mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'Which mistake can it make',
 brief: 'The Inspection Hall knows whether a supplier’s claim is true in a whole run of batches, and Mira asks which mistake that run could produce and how often.',
 labels: ['error type (1 or 2)', 'probability of the error', 'expected number of such errors'], tolerance: 0.005,
 gl: [['error type (1 or 2)'], ['probability of the error'], ['expected number of such errors']]
}, {
 canonical: { c: 2, v: 90, A: 5, B: 20, N: 200, t: 0 },
 draw: R => { const c = R.int(0, 3), [lo, hi, step] = CE[c][2]; return { c, v: step * R.int(lo / step, hi / step), A: R.pick([1, 5, 10]), B: R.int(5, 40), N: 100 * R.int(1, 9), t: R.int(0, 1) }; },
 build: ({ c, v, A, B, N, t }) => { const [text, sign] = CE[c], a = A / 100, b = B / 100, code = t ? 1 : 2, pr = t ? a : b, ex = N * pr; return {
  prompt: `${text(n(v))}, so the hall tests H₀: μ ${sign} ${n(v)}, where μ is the true mean of everything the supplier sends. The test runs at significance level α = ${n(a)}, and when H₀ is false the test misses it with probability β = ${n(b)}. In truth, the supplier’s claim is ${t ? 'true' : 'false'} for every one of ${n(N)} batches, and the hall tests each batch separately. On such a batch the test can make only one kind of error. Enter its type (1 for Type I, 2 for Type II), then the probability that a test makes that error, then the expected number of the ${n(N)} tests that make it.`,
  answer: [code, pr, ex],
  hints: ['An error is a wrong decision. If H₀ is true, the only wrong decision is to reject it; if H₀ is false, the only wrong decision is to keep it. Decide which error each one is called.', 'The probability of a Type I error is α, and the probability of a Type II error is β. The expected number of such errors in separate tests is the number of tests times that probability.'],
  solution: `The claim is the null hypothesis, so H₀ is ${t ? 'true' : 'false'} for every batch. ${t ? 'The only wrong decision is to reject H₀, which is a Type I error, with probability α' : 'The only wrong decision is to keep H₀, which is a Type II error, with probability β'} = ${n(pr)}. The expected number of such errors in ${n(N)} tests is ${n(N)} × ${n(pr)} = ${n(ex)}.`,
  guidance: [
   { prompt: 'Is H₀ true or false for these batches, and which error can a test of such a batch make? Enter 1 for Type I, 2 for Type II.', answer: [code], explanation: t ? 'H₀ is true, so the only wrong decision is rejecting it: a Type I error.' : 'H₀ is false, so the only wrong decision is keeping it: a Type II error.' },
   { prompt: `What is the probability that one test makes this error? Use α = ${n(a)} for a Type I error and β = ${n(b)} for a Type II error.`, answer: [pr], explanation: `A Type ${t ? 'I' : 'II'} error has probability ${t ? 'α' : 'β'} = ${n(pr)}.` },
   { prompt: `Each of the ${n(N)} tests makes the error with that probability. What is the expected number of tests that make it?`, answer: [ex], explanation: `${n(N)} × ${n(pr)} = ${n(ex)}.` }
  ] }; }
});

/* ---- q20 The test statistic for a mean [9.5] ---- */

/* z = (x̄ − μ₀) ÷ (σ ÷ √n) for one sample: mu the claim, sig, r = √n, d10 the difference x̄ − μ₀ in tenths. */
const zcalc = (mu, sig, r, d10) => { const N = r * r, se = sig / r, d = d10 / 10, xb = (10 * mu + d10) / 10; return { N, se, d, xb, z: d / se }; };
const zok = (sig, r, d10, mu) => { if (!tidySE(sig, r)) return false; const z = d10 / 10 / (sig / r); return Math.abs(z) >= 0.2 && Math.abs(z) <= 3.5 && !tie(z, 2); };
const way = z => z < 0 ? 'below' : 'above';

/* q20b: bolt lengths. Not the worked example (μ₀ = 80, σ = 10, n = 25, x̄ = 83.1). */
mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Bolts off the line',
 brief: 'A bolt maker swears that its bolts come off the line at one mean length, and the inspectors have measured a sample to see how far it sits from that.',
 labels: ['standard error (mm)', 'test statistic z'], tolerance: 0.005,
 gl: [['standard error (mm)'], ['x̄ − μ₀ (mm)'], ['test statistic z']]
}, {
 canonical: { mu: 96, sig: 3, r: 5, d10: 11 },
 draw: R => { for (;;) { const p = { mu: R.int(40, 150), sig: R.int(2, 15), r: R.pick(ROOTS), d10: R.nz(-60, 60) }; if (zok(p.sig, p.r, p.d10) && !(p.mu === 80 && p.sig === 10 && p.r === 5 && p.d10 === 31)) return p; } },
 build: ({ mu, sig, r, d10 }) => { const { N, se, d, xb, z } = zcalc(mu, sig, r, d10); return {
  prompt: `A bolt maker claims that its bolts have a mean length of ${n(mu)} mm, so the inspectors test H₀: μ = ${n(mu)}. Long records give σ = ${n(sig)} mm. The inspectors measure ${n(N)} bolts and find a mean of x̄ = ${n(xb)} mm. Enter the standard error σ ÷ √n, then the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n) to 2 decimal places, where μ₀ = ${n(mu)} is the value in H₀.`,
  answer: [se, rd(z, 2)],
  hints: ['Divide σ by the square root of the number of bolts to get the standard error.', 'Subtract μ₀ from x̄ and keep the sign, then divide by the standard error. A positive z means the sample mean is above the claim, a negative z below it.'],
  solution: `√${n(N)} = ${n(r)}, so σ ÷ √n = ${n(sig)} ÷ ${n(r)} = ${n(se)} mm. x̄ − μ₀ = ${n(xb)} − ${n(mu)} = ${n(d)} mm. z = ${n(d)} ÷ ${n(se)} ${eq(z, 2)}: the sample mean lies about ${fx(Math.abs(z), 2)} standard errors ${way(z)} the claimed mean.`,
  guidance: [
   { prompt: `What is the standard error σ ÷ √n = ${n(sig)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(sig)} ÷ ${n(r)} = ${n(se)} mm.` },
   { prompt: `What is x̄ − μ₀ = ${n(xb)} − ${n(mu)}?`, answer: [d], explanation: `${n(xb)} − ${n(mu)} = ${n(d)} mm${d < 0 ? ': the sample came out short' : ': the sample came out long'}.` },
   { prompt: 'Divide by the standard error. What is z, to 2 decimal places?', answer: [rd(z, 2)], explanation: `${n(d)} ÷ ${n(se)} ${eq(z, 2)}.` }
  ] }; }
});

/* q20c: two suppliers; the samples' |z| differ by at least 0.3. */
mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Whose sample is further out',
 brief: 'Two ration suppliers have each sent a sample, and the inspectors want to know whose sample strays further from its own supplier’s claim.',
 labels: ['z for supplier A', 'z for supplier B', 'further out (1 for A, 2 for B)'], tolerance: 0.005,
 gl: [['z for supplier A'], ['z for supplier B'], ['further out (1 for A, 2 for B)']]
}, {
 canonical: { muA: 250, sigA: 8, rA: 4, dA: -21, muB: 400, sigB: 15, rB: 5, dB: 36 },
 draw: R => { for (;;) { const p = { muA: 10 * R.int(10, 60), sigA: R.int(4, 30), rA: R.pick(ROOTS), dA: R.nz(-60, 60), muB: 10 * R.int(10, 60), sigB: R.int(4, 30), rB: R.pick(ROOTS), dB: R.nz(-60, 60) };
  if (!zok(p.sigA, p.rA, p.dA) || !zok(p.sigB, p.rB, p.dB)) continue; const A = zcalc(p.muA, p.sigA, p.rA, p.dA), B = zcalc(p.muB, p.sigB, p.rB, p.dB);
  if (Math.abs(Math.abs(A.z) - Math.abs(B.z)) < 0.3 || (p.muA === 80 && p.sigA === 10 && p.rA === 5 && p.dA === 31)) continue; return p; } },
 build: p => { const A = zcalc(p.muA, p.sigA, p.rA, p.dA), B = zcalc(p.muB, p.sigB, p.rB, p.dB), zA = rd(A.z, 2), zB = rd(B.z, 2), far = Math.abs(A.z) > Math.abs(B.z) ? 1 : 2; return {
  prompt: `Two suppliers send ration tins to the Inspection Hall, and each supplier’s claim is tested with H₀: μ = its claimed mean. Supplier A claims a mean mass of ${n(p.muA)} g, and long records give σ = ${n(p.sigA)} g; ${n(A.N)} tins have a mean of x̄ = ${n(A.xb)} g. Supplier B claims ${n(p.muB)} g, and long records give σ = ${n(p.sigB)} g; ${n(B.N)} tins have a mean of x̄ = ${n(B.xb)} g. Enter the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n) for supplier A, then for supplier B, each to 2 decimal places. Then enter 1 if A’s sample mean lies further from its claim, in standard errors, or 2 if B’s does. Compare the sizes of the two z values and ignore their signs.`,
  answer: [zA, zB, far],
  hints: ['For each supplier, divide σ by the square root of its sample size, subtract the claimed mean from the sample mean, and divide the difference by the standard error.', 'How far a sample lies from its claim, in standard errors, is the size of z with the sign ignored. The bigger size is the one further out.'],
  solution: `Supplier A: σ ÷ √n = ${n(p.sigA)} ÷ ${n(p.rA)} = ${n(A.se)} g, x̄ − μ₀ = ${n(A.xb)} − ${n(p.muA)} = ${n(A.d)} g, so z = ${n(A.d)} ÷ ${n(A.se)} ${eq(A.z, 2)}. Supplier B: σ ÷ √n = ${n(p.sigB)} ÷ ${n(p.rB)} = ${n(B.se)} g, x̄ − μ₀ = ${n(B.xb)} − ${n(p.muB)} = ${n(B.d)} g, so z = ${n(B.d)} ÷ ${n(B.se)} ${eq(B.z, 2)}. The size ${fx(Math.abs(far === 1 ? A.z : B.z), 2)} is the larger, so supplier ${far === 1 ? 'A' : 'B'}’s sample is further out: the answer is ${far}.`,
  guidance: [
   { prompt: `What is z for supplier A, to 2 decimal places? The standard error is ${n(p.sigA)} ÷ √${n(A.N)}, and x̄ − μ₀ = ${n(A.xb)} − ${n(p.muA)}.`, answer: [zA], explanation: `σ ÷ √n = ${n(p.sigA)} ÷ ${n(p.rA)} = ${n(A.se)} g, x̄ − μ₀ = ${n(A.d)} g, so z = ${n(A.d)} ÷ ${n(A.se)} ${eq(A.z, 2)}.` },
   { prompt: `What is z for supplier B, to 2 decimal places? The standard error is ${n(p.sigB)} ÷ √${n(B.N)}, and x̄ − μ₀ = ${n(B.xb)} − ${n(p.muB)}.`, answer: [zB], explanation: `σ ÷ √n = ${n(p.sigB)} ÷ ${n(p.rB)} = ${n(B.se)} g, x̄ − μ₀ = ${n(B.d)} g, so z = ${n(B.d)} ÷ ${n(B.se)} ${eq(B.z, 2)}.` },
   { prompt: `The two z values are ${fx(A.z, 2)} and ${fx(B.z, 2)}. Ignoring the signs, which is larger? Enter 1 if A’s is, 2 if B’s is.`, answer: [far], explanation: `The sizes are ${fx(Math.abs(A.z), 2)} and ${fx(Math.abs(B.z), 2)}, so ${far === 1 ? 'A' : 'B'}’s is larger: the answer is ${far}.` }
  ] }; }
});

/* q20d (uses q18): read the claim, then the statistic. n is not a perfect square, and z is the same whether the standard error is kept exact or rounded to 4 decimals. */
mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q18', title: 'From the claim to the statistic',
 brief: 'A supplier’s claim has come in as plain words, and the inspectors must turn it into a test and measure how far the sample sits from it.',
 labels: ['value in H₀', 'tail code', 'test statistic z'], tolerance: 0.005,
 gl: [['value in H₀', 'tail code'], ['standard error'], ['test statistic z']]
}, {
 canonical: { c: 4, v: 31, sig: 6, N: 40, d10: 28 },
 draw: R => { for (;;) { const c = R.int(0, 5), [lo, hi, step] = CC[c][3], p = { c, v: step * R.int(lo / step, hi / step), sig: R.int(2, 20), N: R.pick([20, 30, 40, 50, 60, 80]), d10: R.nz(-60, 60) };
  if (Math.abs(p.d10) === 10) continue; /* never "1 litres" */
  const se = p.sig / Math.sqrt(p.N), z = p.d10 / 10 / se; if (Math.abs(z) < 0.2 || Math.abs(z) > 3.5 || tie(z, 2) || rd(p.d10 / 10 / rd(se, 4), 2) !== rd(z, 2)) continue; return p; } },
 build: ({ c, v, sig, N, d10 }) => { const [text, code, unit] = CC[c], [s0, sA, name] = TAIL[code], se = sig / Math.sqrt(N), d = d10 / 10, xb = (10 * v + d10) / 10, z = d / se; return {
  prompt: `${text(n(v))}${SUSP} Long records give σ = ${n(sig)} ${unit}. The inspectors measure ${n(N)} items and find a mean of x̄ = ${n(xb)} ${unit}. Enter the number in H₀ and the tail code (1 for left-tailed, 2 for right-tailed, 3 for two-tailed), then the test statistic z = (x̄ − μ₀) ÷ (σ ÷ √n) to 2 decimal places, where μ₀ is the value in H₀. Do not round the standard error before you divide.`,
  answer: [v, code, rd(z, 2)],
  hints: ['H₀ is the claim, written with an equals sign in it, and its number is μ₀. Hₐ is the suspicion: less points to <, more to >, different to ≠. The sign in Hₐ gives the tail.', 'Divide σ by the square root of n for the standard error, subtract μ₀ from x̄ keeping the sign, and divide the difference by the standard error.'],
  solution: `H₀: μ ${s0} ${n(v)} and Hₐ: μ ${sA} ${n(v)}, so μ₀ = ${n(v)} and the test is ${name}: code ${code}. The standard error is ${n(sig)} ÷ √${n(N)} ${eq(se, 4)} ${unit}. x̄ − μ₀ = ${n(xb)} − ${n(v)} = ${n(d)} ${unit}. z = ${n(d)} ÷ ${fx(se, 4)} ${eq(z, 2)}: the sample mean lies about ${fx(Math.abs(z), 2)} standard errors ${way(z)} the claim.`,
  guidance: [
   { prompt: `Read the claim: which number is in H₀, and what is the tail code (1 for left-tailed, 2 for right-tailed, 3 for two-tailed)?`, answer: [v, code], explanation: `H₀: μ ${s0} ${n(v)} and Hₐ: μ ${sA} ${n(v)}, so μ₀ = ${n(v)} and the test is ${name}: code ${code}.` },
   { prompt: `What is the standard error σ ÷ √n = ${n(sig)} ÷ √${n(N)}, to 2 decimal places? (Keep the unrounded value for the last division.)`, answer: [rd(se, 2)], explanation: `√${n(N)} ≈ ${fx(Math.sqrt(N), 4)}, and ${n(sig)} ÷ ${fx(Math.sqrt(N), 4)} ${eq(se, 4)}, which is ${fx(se, 2)} to 2 decimal places.` },
   { prompt: `Subtract μ₀ from x̄ = ${n(xb)}, then divide by the standard error. What is z, to 2 decimal places?`, answer: [rd(z, 2)], explanation: `${n(xb)} − ${n(v)} = ${n(d)}, and ${n(d)} ÷ ${fx(se, 4)} ${eq(z, 2)}.` }
  ] }; }
});

})();
