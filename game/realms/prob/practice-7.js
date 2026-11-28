/* Probability practice missions, file 7 of 8: concepts q31–q35, three practice missions each
   (q31b q31c q31d q32b q32c q32d q33b q33c q33d q34b q34c q34d q35b q35c q35d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p7.js. */
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
/* The stored normal table, as in gen-d.js. z is held in hundredths (h = 130 is z = 1.30); A(h) is the area to the left
   of z as a whole number of ten-thousandths. Every draw keeps z inside the table (|z| <= 3.49). */
const memo = {};
const A = h => { if (memo[h] === undefined) { const z = h / 100; let term = z, sum = z;
 for (let k = 1; k < 400 && term !== 0; k++) { term *= -z * z / (2 * k); sum += term / (2 * k + 1); if (Math.abs(term) < 1e-18) break; }
 memo[h] = Math.round((0.5 + sum / Math.sqrt(2 * Math.PI)) * 1e4); } return memo[h]; };
const zt = h => (h < 0 ? '−' : '') + (Math.abs(h) / 100).toFixed(2);
const ar = v => (v / 1e4).toFixed(4);
const rowList = hs => hs.slice().sort((a, b) => a - b).map(h => `${zt(h)} → ${ar(A(h))}`).join(', ');
const tri = (h, o) => [h - o, h - o + 1, h - o + 2];
const TABLE = 'Rows from the normal table (z → area to the left of z)';
const r6 = v => Math.round(v * 1e6) / 1e6;
const near = x => Math.round(x * 100);
/* A value to 4 decimal places as written: exact if it has at most 4, otherwise cut (not rounded) with “…” after it. */
const dig4 = x => { if (Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6) return n(x); const t = Math.trunc(x * 1e4 + Math.sign(x) * 1e-7) / 1e4; return (t < 0 ? '−' : '') + Math.abs(t).toFixed(4) + '…'; };
const tie = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 0.02;
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const zText = (x, h) => exact2(x) ? zt(h) : `${dig4(x)}, which rounds to ${zt(h)}`;
/* The row whose area is nearest k%; only k with a single nearest row is drawn. */
const nearestRow = k => { let best = 0, gap = Infinity, second = Infinity; for (let h = -349; h <= 349; h++) { const g = Math.abs(A(h) - 100 * k); if (g < gap) { second = gap; gap = g; best = h; } else if (g < second) second = g; } return { h: best, clear: second - gap >= 2 }; };
const PCT = [10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90].filter(k => nearestRow(k).clear);
const TAILS = [10, 15, 20, 25, 30, 35, 40, 45].filter(t => PCT.includes(t) && PCT.includes(100 - t));
/* A length in hundredths of a unit, rounded to 1 decimal place; a draw whose length ends in exactly 5 hundredths is rejected. */
const half = xh => Math.abs(xh) % 10 === 5;
const round1 = xh => Math.round(xh / 10) / 10;

/* ---- q31 z-scores [IS 6.1] ---- */

/* Two panel widths, one above and one below the mean: a z-score for each (cm). */
mk({
 id: 'q31b', parent: 'q31', kind: 'setting', title: 'Panel widths on the line',
 brief: 'The panel line in the Quality Lab turns out wall plates, and Mira wants to know how far from the mean two of them sit.',
 labels: ['z-score of the wide plate', 'z-score of the narrow plate'], tolerance: 0.005,
 gl: [['wide plate minus mean (cm)'], ['z-score of the wide plate'], ['z-score of the narrow plate']]
}, {
 canonical: { mu: 120, sh: 60, d1: 105, d2: 40 },
 draw: R => { let p; do { const sh = R.pick([20, 30, 40, 60, 80, 120, 150]), lo = Math.ceil(0.3 * sh), hi = Math.floor(2.6 * sh);
   p = { mu: R.int(30, 200), sh, d1: R.int(lo, hi), d2: R.int(lo, hi) }; } while (tie(p.d1 / p.sh) || tie(p.d2 / p.sh)); return p; },
 build: ({ mu, sh, d1, d2 }) => { const s = sh / 100, x1 = r6(mu + d1 / 100), x2 = r6(mu - d2 / 100), e1 = d1 / 100, e2 = -d2 / 100, h1 = near(d1 / sh), h2 = -near(d2 / sh), z1 = h1 / 100, z2 = h2 / 100; return {
  prompt: `Wall plates on the Quality Lab’s panel line have widths that follow a normal distribution with mean μ = ${n(mu)} cm and standard deviation σ = ${n(s)} cm. One plate measures ${n(x1)} cm and another measures ${n(x2)} cm. Enter the z-score of the ${n(x1)} cm plate, then the z-score of the ${n(x2)} cm plate, each rounded to 2 decimal places.`,
  answer: [z1, z2],
  hints: ['The z-score is (x − μ) ÷ σ. Do the subtraction first, and keep the sign: a plate narrower than the mean gives a negative z-score.', 'Each plate gets its own z-score, from its own distance to the mean. Divide each distance by the same σ and round to 2 decimal places.'],
  solution: `The wider plate is ${n(x1)} − ${n(mu)} = ${n(e1)} cm from the mean, so z = ${n(e1)} ÷ ${n(s)} = ${zText(d1 / sh, h1)}. The narrower plate is ${n(x2)} − ${n(mu)} = ${n(e2)} cm from the mean, so z = ${n(e2)} ÷ ${n(s)} = ${zText(-d2 / sh, h2)}. The wide plate sits ${n(Math.abs(z1))} standard deviation${Math.abs(z1) === 1 ? '' : 's'} above the mean and the narrow one ${n(Math.abs(z2))} below it.`,
  guidance: [
   { prompt: `How far is the ${n(x1)} cm plate from the mean of ${n(mu)} cm? Enter x − μ.`, answer: [e1], explanation: `${n(x1)} − ${n(mu)} = ${n(e1)} cm.` },
   { prompt: `Divide that distance by σ = ${n(s)} cm and round to 2 decimal places. What is the z-score of the ${n(x1)} cm plate?`, answer: [z1], explanation: `${n(e1)} ÷ ${n(s)} = ${zText(d1 / sh, h1)}.` },
   { prompt: `Do the same for the ${n(x2)} cm plate: subtract the mean, divide by σ = ${n(s)} cm and round to 2 decimal places. What is its z-score?`, answer: [z2], explanation: `(${n(x2)} − ${n(mu)}) ÷ ${n(s)} = ${n(e2)} ÷ ${n(s)} = ${zText(-d2 / sh, h2)}. It is negative because the plate is narrower than the mean.` }
  ] }; }
});

/* A bolt above the flag line z = c: its z-score, the longest unflagged length, and the excess. */
mk({
 id: 'q31c', parent: 'q31', kind: 'applied', title: 'The flagged bolt',
 brief: 'The lathe has started to drift, and Mira flags any bolt that is too far above the mean to trust.',
 labels: ['z-score of the bolt', 'longest unflagged length (mm)', 'excess over the limit (mm)'], tolerance: 0.005,
 gl: [['z-score of the bolt'], ['longest unflagged length (mm)'], ['excess over the limit (mm)']]
}, {
 canonical: { mu: 75, sh: 40, ch: 20, e: 18 },
 draw: R => { let p; do { const sh = R.pick([20, 40, 60, 80, 120, 160, 200]), ch = R.pick([15, 20, 25]);
   p = { mu: R.int(30, 120), sh, ch, e: R.int(10, sh) }; } while (tie((p.ch * p.sh / 10 + p.e) / p.sh)); return p; },
 build: ({ mu, sh, ch, e }) => { const s = sh / 100, c = ch / 10, dh = ch * sh / 10 + e, x = r6(mu + dh / 100), dev = dh / 100, h = near(dh / sh), z = h / 100, lim = r6(mu + c * s), off = r6(c * s), ex = e / 100; return {
  prompt: `A lathe in the Quality Lab turns bolts whose lengths follow a normal distribution with mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm. Mira flags every bolt whose z-score is above ${n(c)}. One bolt measures ${n(x)} mm. Enter its z-score rounded to 2 decimal places, then the longest length in mm that would not be flagged, then by how many mm the bolt is over that limit.`,
  answer: [z, lim, ex],
  hints: ['The z-score of the bolt is (x − μ) ÷ σ. A bolt is flagged when that comes out above the flag line.', 'The longest unflagged length has a z-score exactly equal to the flag line. Turn the rule round: x = μ + z × σ. The excess is the bolt’s length minus that limit.'],
  solution: `The bolt is ${n(x)} − ${n(mu)} = ${n(dev)} mm above the mean, so z = ${n(dev)} ÷ ${n(s)} = ${zText(dh / sh, h)}. That is above ${n(c)}, so the bolt is flagged. The longest length that is not flagged has z = ${n(c)}: x = μ + z × σ = ${n(mu)} + ${n(c)} × ${n(s)} = ${n(mu)} + ${n(off)} = ${n(lim)} mm. The bolt is ${n(x)} − ${n(lim)} = ${n(ex)} mm over that limit.`,
  guidance: [
   { prompt: `How far above the mean of ${n(mu)} mm is the ${n(x)} mm bolt? Divide that by σ = ${n(s)} mm and round to 2 decimal places. What is its z-score?`, answer: [z], explanation: `(${n(x)} − ${n(mu)}) ÷ ${n(s)} = ${n(dev)} ÷ ${n(s)} = ${zText(dh / sh, h)}.` },
   { prompt: `A bolt on the flag line has z = ${n(c)}. What length is that? Work out μ + z × σ.`, answer: [lim], explanation: `${n(mu)} + ${n(c)} × ${n(s)} = ${n(mu)} + ${n(off)} = ${n(lim)} mm.` },
   { prompt: `The bolt measures ${n(x)} mm and the limit is ${n(lim)} mm. By how many mm is it over?`, answer: [ex], explanation: `${n(x)} − ${n(lim)} = ${n(ex)} mm.` }
  ] }; }
});

/* z-score of a bolt exactly k standard deviations out, then its tail share by the empirical rule. Uses q30. */
mk({
 id: 'q31d', parent: 'q31', kind: 'challenge', uses: 'q30', title: 'Far out on the curve',
 brief: 'One bolt sits a long way from the mean, and Mira wants to say how rare a bolt that far out is.',
 labels: ['z-score of the bolt', 'percentage of bolts beyond it'], tolerance: 0.005,
 gl: [['x − μ (mm)'], ['z-score of the bolt'], ['percentage of bolts beyond it']]
}, {
 canonical: { mu: 90, sh: 35, k: 2, sg: -1 },
 draw: R => ({ mu: R.int(30, 150), sh: R.pick([15, 35, 45, 60, 75, 120, 180, 240]), k: R.pick([1, 2, 3]), sg: R.bool() ? 1 : -1 }),
 build: ({ mu, sh, k, sg }) => { const s = sh / 100, x = r6(mu + sg * k * s), dev = r6(sg * k * s), z = sg * k, pct = { 1: 16, 2: 2.5, 3: 0.15 }[k], inside = { 1: 68, 2: 95, 3: 99.7 }[k], word = sg > 0 ? 'longer' : 'shorter'; return {
  prompt: `The Quality Lab’s bolts have lengths that follow a normal distribution with mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm. One bolt measures ${n(x)} mm. Enter its z-score, which comes out as a whole number. Then use the empirical rule to find the percentage of bolts that are ${word} than this bolt.`,
  answer: [z, pct],
  hints: ['The z-score is (x − μ) ÷ σ. Because the bolt is a whole number of standard deviations from the mean, it comes out exactly, with its sign.', 'The empirical rule gives the share within 1, 2 and 3 standard deviations of the mean. What is left over is split evenly between the two tails, and the curve is symmetric, so one tail has half of it.'],
  solution: `The bolt is ${n(x)} − ${n(mu)} = ${n(dev)} mm from the mean, so z = ${n(dev)} ÷ ${n(s)} = ${n(z)}. By the empirical rule ${n(inside)}% of bolts lie within ${n(k)} standard deviation${k > 1 ? 's' : ''} of the mean, so ${n(r6(100 - inside))}% lie outside, split evenly between the two tails. The ${word} tail holds half of that: ${n(r6(100 - inside))} ÷ 2 = ${n(pct)}%.`,
  guidance: [
   { prompt: `How far is the ${n(x)} mm bolt from the mean of ${n(mu)} mm? Enter x − μ, negative if the bolt is shorter than the mean.`, answer: [dev], explanation: `${n(x)} − ${n(mu)} = ${n(dev)} mm.` },
   { prompt: `Divide by σ = ${n(s)} mm. What is the z-score?`, answer: [z], explanation: `${n(dev)} ÷ ${n(s)} = ${n(z)}: the bolt is ${n(k)} standard deviation${k > 1 ? 's' : ''} ${sg > 0 ? 'above' : 'below'} the mean.` },
   { prompt: `The empirical rule puts ${n(inside)}% of bolts within ${n(k)} standard deviation${k > 1 ? 's' : ''} of the mean. What percentage are ${word} than this bolt? That is half of what lies outside.`, answer: [pct], explanation: `${n(r6(100 - inside))}% lie outside, and half of it is in the ${word} tail: ${n(pct)}%.` }
  ] }; }
});

/* ---- q32 Area to the left from a normal table [IS 6.1, 6.2] ---- */

/* P(X < x) for a cable strand's breaking load (kN); z = h/100 exactly. */
mk({
 id: 'q32b', parent: 'q32', kind: 'setting', title: 'Cable strands under load',
 brief: 'The lab pulls cable strands until they snap, and Mira wants the share that give way below a safe load.',
 labels: ['z-score', 'P(X < x)'], tolerance: 0.00005,
 gl: [['x − μ (kN)'], ['z-score'], ['P(X < x)']]
}, {
 canonical: { mu: 250, s: 12, h: -150, o: 1 },
 draw: R => ({ mu: R.int(100, 400), s: R.pick([5, 8, 10, 12, 15, 20, 25]), h: (R.bool() ? 1 : -1) * R.int(10, 250), o: R.int(0, 2) }),
 build: ({ mu, s, h, o }) => { const x = r6(mu + h * s / 100), dx = r6(h * s / 100), z = h / 100, P = A(h); return {
  prompt: `The breaking load of the Quality Lab’s cable strands follows a normal distribution with mean ${n(mu)} kN and standard deviation ${n(s)} kN (kN, kilonewtons, is a unit of force). A strand is rated safe at ${n(x)} kN. What is the probability that a strand snaps at a load below ${n(x)} kN? Enter the z-score of ${n(x)} kN, then P(X < ${n(x)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [z, P / 1e4],
  hints: ['Turn the load into a z-score with z = (x − μ) ÷ σ. It comes out to exactly 2 decimal places, negative when the load is below the mean.', 'Find the row of the table with your z. The number beside it is the area to the left of z, which is the probability of a load below x.'],
  solution: `z = (${n(x)} − ${n(mu)}) ÷ ${n(s)} = ${n(dx)} ÷ ${n(s)} = ${zt(h)}. The probability of a load below ${n(x)} kN is the area to the left of z = ${zt(h)}, and the table row for ${zt(h)} gives ${ar(P)}. So P(X < ${n(x)}) = ${ar(P)}.`,
  guidance: [
   { prompt: `How far is ${n(x)} kN from the mean of ${n(mu)} kN? Enter x − μ.`, answer: [dx], explanation: `${n(x)} − ${n(mu)} = ${n(dx)} kN.` },
   { prompt: `Divide by σ = ${n(s)} kN. What is the z-score?`, answer: [z], explanation: `${n(dx)} ÷ ${n(s)} = ${zt(h)}.` },
   { prompt: `Read the table row for z = ${zt(h)}. What is P(X < ${n(x)})?`, answer: [P / 1e4], explanation: `The row ${zt(h)} → ${ar(P)} is the area to the left of z, so P(X < ${n(x)}) = ${ar(P)}.` }
  ] }; }
});

/* Hardness test of a batch: z, P(fail), expected failures out of N. */
mk({
 id: 'q32c', parent: 'q32', kind: 'applied', title: 'Soft bolts in the batch',
 brief: 'A batch of bolts has been hardness-tested, and Mira needs to know how many she should expect to fail.',
 labels: ['z-score', 'P(fail)', 'expected bolts that fail'], tolerance: 0.00005,
 gl: [['z-score'], ['P(fail)'], ['expected bolts that fail']]
}, {
 canonical: { mu: 480, s: 25, h: -120, o: 0, N: 2000 },
 draw: R => ({ mu: R.int(200, 600), s: R.pick([10, 15, 20, 25, 30]), h: (R.bool() ? 1 : -1) * R.int(40, 250), o: R.int(0, 2), N: R.pick([500, 800, 1000, 2000, 2500, 4000]) }),
 build: ({ mu, s, h, o, N }) => { const x = r6(mu + h * s / 100), dx = r6(h * s / 100), z = h / 100, P = A(h), cnt = r6(N * P / 1e4); return {
  prompt: `Bolts in the Quality Lab’s hardness test score a number that follows a normal distribution with mean ${n(mu)} and standard deviation ${n(s)}. A bolt fails if it scores below ${n(x)}. A batch holds ${n(N)} bolts. Enter the z-score of ${n(x)}, then the probability that one bolt fails, to 4 decimal places, then the number of bolts in the batch you expect to fail (type it without commas). ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [z, P / 1e4, cnt],
  hints: ['Start with the z-score, z = (x − μ) ÷ σ, then read the area to the left of it from the table. That area is the chance that one bolt scores below the pass mark.', 'The expected number of bolts that fail is the number of bolts times the chance that one fails.'],
  solution: `z = (${n(x)} − ${n(mu)}) ÷ ${n(s)} = ${n(dx)} ÷ ${n(s)} = ${zt(h)}. The table row for ${zt(h)} gives the area to the left: P(fail) = P(X < ${n(x)}) = ${ar(P)}. Out of ${n(N)} bolts you expect ${n(N)} × ${ar(P)} = ${n(cnt)} to fail. The real count will land a little either side.`,
  guidance: [
   { prompt: `What is the z-score of ${n(x)}? Work out (x − μ) ÷ σ = (${n(x)} − ${n(mu)}) ÷ ${n(s)}.`, answer: [z], explanation: `${n(dx)} ÷ ${n(s)} = ${zt(h)}.` },
   { prompt: `Read the row for z = ${zt(h)}. What is the probability that one bolt fails, P(X < ${n(x)})?`, answer: [P / 1e4], explanation: `The row ${zt(h)} → ${ar(P)} gives the area to the left, so P(fail) = ${ar(P)}.` },
   { prompt: `How many of the ${n(N)} bolts do you expect to fail? Work out ${n(N)} × ${ar(P)}.`, answer: [cnt], explanation: `${n(N)} × ${ar(P)} = ${n(cnt)}. It is an expected count, not a promise.` }
  ] }; }
});

/* P(X > x) = 1 − P(X < x) for washers thicker than x. Uses q03. */
mk({
 id: 'q32d', parent: 'q32', kind: 'challenge', uses: 'q03', title: 'The washers that are too thick',
 brief: 'Washers that are too thick will not seat, and Mira wants the share of them that the table says to scrap.',
 labels: ['z-score', 'P(X < x)', 'P(X > x)'], tolerance: 0.00005,
 gl: [['z-score'], ['P(X < x)'], ['P(X > x)']]
}, {
 canonical: { mu: 3.2, s: 0.15, h: 175, o: 2 },
 draw: R => { const s = R.pick([0.04, 0.05, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25]); return { mu: R.pick([2.4, 2.8, 3.2, 3.6, 4, 4.5, 5, 6]), s, h: (R.bool() ? 1 : -1) * R.int(20, 250), o: R.int(0, 2) }; },
 build: ({ mu, s, h, o }) => { const x = r6(mu + h * s / 100), dx = r6(h * s / 100), z = h / 100, P = A(h), Q = 1e4 - P; return {
  prompt: `The thickness of washers from the Quality Lab’s press follows a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. Mira scraps every washer thicker than ${n(x)} mm. Enter the z-score of ${n(x)} mm, then P(X < ${n(x)}), then the probability that a washer is scrapped, P(X > ${n(x)}), each to 4 decimal places except the z-score. ${TABLE}: ${rowList(tri(h, o))}.`,
  answer: [z, P / 1e4, Q / 1e4],
  hints: ['The table only gives areas to the left of z. Find z = (x − μ) ÷ σ first, and read the area to its left.', 'A washer is either thicker than x or not, and the two chances add to 1. Take the area to the left away from 1.'],
  solution: `z = (${n(x)} − ${n(mu)}) ÷ ${n(s)} = ${n(dx)} ÷ ${n(s)} = ${zt(h)}. The table row for ${zt(h)} gives the area to the left: P(X < ${n(x)}) = ${ar(P)}. A washer thicker than ${n(x)} mm is the opposite event, so P(X > ${n(x)}) = 1 − ${ar(P)} = ${ar(Q)}.`,
  guidance: [
   { prompt: `What is the z-score of ${n(x)} mm? Work out (${n(x)} − ${n(mu)}) ÷ ${n(s)}.`, answer: [z], explanation: `${n(dx)} ÷ ${n(s)} = ${zt(h)}.` },
   { prompt: `Read the row for z = ${zt(h)}. What is the area to the left, P(X < ${n(x)})?`, answer: [P / 1e4], explanation: `The row ${zt(h)} → ${ar(P)}.` },
   { prompt: `The washers that are not thicker than ${n(x)} mm are the ones in the area to the left. What is P(X > ${n(x)}) = 1 − ${ar(P)}?`, answer: [Q / 1e4], explanation: `1 − ${ar(P)} = ${ar(Q)}: the share of washers scrapped.` }
  ] }; }
});

/* ---- q33 Probability between two values [IS 6.2] ---- */

/* Both ends of the band on the same side of the mean. */
mk({
 id: 'q33b', parent: 'q33', kind: 'setting', title: 'Washers on the narrow band',
 brief: 'The washer press is set slightly off centre, and Mira wants the share of washers that still land in the accepted band.',
 labels: ['z-score of the lower thickness', 'z-score of the upper thickness', 'P(a < X < b)'], tolerance: 0.00005,
 gl: [['z of the lower thickness', 'z of the upper thickness'], ['area left of the lower z', 'area left of the upper z'], ['P(a < X < b)']]
}, {
 canonical: { mu: 6, s: 0.4, hl: 40, hu: 165, ol: 0, ou: 2, sg: 1 },
 draw: R => { const sg = R.bool() ? 1 : -1, a = R.int(15, 200), b = R.int(a + 40, Math.min(300, a + 150));
  return { mu: R.pick([4, 5, 6, 8, 10, 12]), s: R.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.8]), hl: sg > 0 ? a : -b, hu: sg > 0 ? b : -a, ol: R.int(0, 2), ou: R.int(0, 2), sg }; },
 build: ({ mu, s, hl, hu, ol, ou }) => { const a = r6(mu + hl * s / 100), b = r6(mu + hu * s / 100), La = A(hl), Lb = A(hu), P = Lb - La; return {
  prompt: `The Quality Lab accepts a washer if its thickness is between ${n(a)} mm and ${n(b)} mm. The press is set off centre, and thicknesses follow a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. Enter the z-score of ${n(a)} mm, then the z-score of ${n(b)} mm, then P(${n(a)} < X < ${n(b)}), the probability that a washer is accepted, to 4 decimal places, worked out from the table rows given here. ${TABLE}: ${rowList([...tri(hl, ol), ...tri(hu, ou)])}.`,
  answer: [hl / 100, hu / 100, P / 1e4],
  hints: ['Both ends are on the same side of the mean here. Turn each into a z-score with z = (x − μ) ÷ σ, keeping the sign.', 'The table gives areas to the left. The area between two values is the area to the left of the larger one minus the area to the left of the smaller one, even when both are on the same side.'],
  solution: `For ${n(a)} mm, z = (${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hl)}; for ${n(b)} mm, z = (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hu)}. The table gives ${ar(Lb)} to the left of ${zt(hu)} and ${ar(La)} to the left of ${zt(hl)}. The area between them is the difference: P(${n(a)} < X < ${n(b)}) = ${ar(Lb)} − ${ar(La)} = ${ar(P)}.`,
  guidance: [
   { prompt: `What are the z-scores of ${n(a)} mm and of ${n(b)} mm?`, answer: [hl / 100, hu / 100], explanation: `(${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hl)} and (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hu)}.` },
   { prompt: `Read the two table rows. What is the area to the left of z = ${zt(hl)}, and to the left of z = ${zt(hu)}?`, answer: [La / 1e4, Lb / 1e4], explanation: `The rows give ${ar(La)} for ${zt(hl)} and ${ar(Lb)} for ${zt(hu)}.` },
   { prompt: `Take the smaller area from the larger one. What is ${ar(Lb)} − ${ar(La)}?`, answer: [P / 1e4], explanation: `${ar(Lb)} − ${ar(La)} = ${ar(P)}: the share of washers accepted.` }
  ] }; }
});

/* Plates stamped in a shift: P(pass), then the expected number rejected. */
mk({
 id: 'q33c', parent: 'q33', kind: 'applied', title: 'Plates rejected in a shift',
 brief: 'The stamping shift is about to end, and Mira wants to know how many plates she should expect to turn away.',
 labels: ['P(a plate passes)', 'expected plates rejected'], tolerance: 0.00005,
 gl: [['z of the lower width', 'z of the upper width'], ['P(a plate passes)'], ['expected plates rejected']]
}, {
 canonical: { mu: 24, s: 0.6, ha: -110, hb: 85, oa: 1, ob: 2, N: 800 },
 draw: R => ({ mu: R.int(10, 60), s: R.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8]), ha: R.int(-250, -30), hb: R.int(30, 250), oa: R.int(0, 2), ob: R.int(0, 2), N: R.pick([200, 400, 500, 800, 1000, 2000]) }),
 build: ({ mu, s, ha, hb, oa, ob, N }) => { const a = r6(mu + ha * s / 100), b = r6(mu + hb * s / 100), La = A(ha), Lb = A(hb), P = Lb - La, rej = r6(N * (1e4 - P) / 1e4); return {
  prompt: `A stamping press in the Quality Lab makes plates whose widths follow a normal distribution with mean ${n(mu)} cm and standard deviation ${n(s)} cm. A plate passes if its width is between ${n(a)} cm and ${n(b)} cm. This shift the press stamps ${n(N)} plates. Enter the probability that one plate passes, to 4 decimal places, then the number of the ${n(N)} plates you expect to be rejected (type it without commas). Work the probability out from the table rows given here. ${TABLE}: ${rowList([...tri(ha, oa), ...tri(hb, ob)])}.`,
  answer: [P / 1e4, rej],
  hints: ['Find the z-score of each end of the band, read the two areas to the left from the table, and subtract the smaller from the larger to get the probability of passing.', 'A plate that does not pass is rejected, so the chance of rejection is 1 minus the chance of passing. Multiply it by the number of plates.'],
  solution: `The ends of the band have z = (${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(ha)} and z = (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hb)}. The table gives ${ar(Lb)} and ${ar(La)} to their left, so P(pass) = ${ar(Lb)} − ${ar(La)} = ${ar(P)}. The chance of rejection is 1 − ${ar(P)} = ${ar(1e4 - P)}, so out of ${n(N)} plates you expect ${n(N)} × ${ar(1e4 - P)} = ${n(rej)} to be rejected.`,
  guidance: [
   { prompt: `What are the z-scores of ${n(a)} cm and of ${n(b)} cm?`, answer: [ha / 100, hb / 100], explanation: `(${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(ha)} and (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hb)}.` },
   { prompt: `Read the rows: ${ar(La)} is to the left of ${zt(ha)} and ${ar(Lb)} is to the left of ${zt(hb)}. What is the probability that a plate passes?`, answer: [P / 1e4], explanation: `${ar(Lb)} − ${ar(La)} = ${ar(P)}.` },
   { prompt: `The rest of the plates are rejected, a share of 1 − ${ar(P)}. How many of the ${n(N)} plates do you expect to be rejected?`, answer: [rej], explanation: `1 − ${ar(P)} = ${ar(1e4 - P)}, and ${n(N)} × ${ar(1e4 - P)} = ${n(rej)}.` }
  ] }; }
});

/* P(between) and P(outside) for a sensor housing. Uses q03. */
mk({
 id: 'q33d', parent: 'q33', kind: 'challenge', uses: 'q03', title: 'Outside the tolerance',
 brief: 'Sensor housings are scrapped when they fall outside the tolerance, and Mira wants the scrap rate as well as the pass rate.',
 labels: ['z-score of the lower length', 'z-score of the upper length', 'P(inside the band)', 'P(outside the band)'], tolerance: 0.00005,
 gl: [['z of the lower length', 'z of the upper length'], ['P(inside the band)'], ['P(outside the band)']]
}, {
 canonical: { mu: 72, s: 1.5, ha: -60, hb: 130, oa: 0, ob: 1 },
 draw: R => { const a = R.int(-250, 200); return { mu: R.int(40, 120), s: R.pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5]), ha: a, hb: R.int(a + 60, Math.min(300, a + 200)), oa: R.int(0, 2), ob: R.int(0, 2) }; },
 build: ({ mu, s, ha, hb, oa, ob }) => { const a = r6(mu + ha * s / 100), b = r6(mu + hb * s / 100), La = A(ha), Lb = A(hb), P = Lb - La, Q = 1e4 - P; return {
  prompt: `Sensor housings from the Quality Lab have lengths that follow a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. A housing is within tolerance if its length is between ${n(a)} mm and ${n(b)} mm, and it is scrapped if it falls outside. Enter the z-score of ${n(a)} mm, then the z-score of ${n(b)} mm, then the probability that a housing is inside the band, then the probability that it is scrapped, each probability to 4 decimal places, worked out from the table rows given here. ${TABLE}: ${rowList([...tri(ha, oa), ...tri(hb, ob)])}.`,
  answer: [ha / 100, hb / 100, P / 1e4, Q / 1e4],
  hints: ['Turn both lengths into z-scores. The probability of being inside the band is the larger area to the left minus the smaller one.', 'A housing is either inside the band or outside it, and the two chances add to 1. Take the probability of being inside away from 1.'],
  solution: `The z-scores are (${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(ha)} and (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hb)}. The table gives ${ar(Lb)} and ${ar(La)} to their left, so P(${n(a)} < X < ${n(b)}) = ${ar(Lb)} − ${ar(La)} = ${ar(P)}. Being outside the band is the opposite event: 1 − ${ar(P)} = ${ar(Q)}.`,
  guidance: [
   { prompt: `What are the z-scores of ${n(a)} mm and of ${n(b)} mm?`, answer: [ha / 100, hb / 100], explanation: `(${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(ha)} and (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hb)}.` },
   { prompt: `The table gives ${ar(La)} to the left of ${zt(ha)} and ${ar(Lb)} to the left of ${zt(hb)}. What is the probability of being inside the band?`, answer: [P / 1e4], explanation: `${ar(Lb)} − ${ar(La)} = ${ar(P)}.` },
   { prompt: `What is the probability that a housing falls outside the band, 1 − ${ar(P)}?`, answer: [Q / 1e4], explanation: `1 − ${ar(P)} = ${ar(Q)}: the scrap rate.` }
  ] }; }
});

/* ---- q34 Percentiles: from an area back to a value [IS 6.2] ---- */

mk({
 id: 'q34b', parent: 'q34', kind: 'setting', title: 'The cable cut-off',
 brief: 'The cable store wants a single tension mark, chosen so that a stated share of strands falls below it.',
 labels: ['z', 'tension at the percentile (kN)'], tolerance: 0.005,
 gl: [['z'], ['z × σ (kN)'], ['tension at the percentile (kN)']]
}, {
 canonical: { mu: 180, s: 7, k: 35 },
 draw: R => { let p; do { p = { mu: R.int(100, 400), s: R.int(2, 15), k: R.pick(PCT) }; } while (half(100 * p.mu + nearestRow(p.k).h * p.s)); return p; },
 build: ({ mu, s, k }) => { const h = nearestRow(k).h, z = h / 100, zs = r6(h * s / 100), xh = 100 * mu + h * s, x = xh / 100, xr = round1(xh), same = xh % 10 === 0, k2 = (k / 100).toFixed(2); return {
  prompt: `The breaking tension of the cable store’s strands follows a normal distribution with mean ${n(mu)} kN and standard deviation ${n(s)} kN (kN, kilonewtons, is a unit of force). Mira marks the ${n(k)}th percentile: the tension that ${n(k)}% of the strands snap below. Use the table row whose area is closest to ${k2}. Enter that row’s z, then the tension at the ${n(k)}th percentile in kN, rounded to 1 decimal place. ${TABLE}: ${rowList(tri(h, 1))}.`,
  answer: [z, xr],
  hints: [`The ${n(k)}th percentile has ${k2} of the area to its left. Look down the areas, not the z values, for the one nearest ${k2}.`, 'Then go back from z to a tension with x = μ + z × σ.'],
  solution: `The ${n(k)}th percentile has ${n(k)}% of the area, ${k2}, to its left. The closest area in the table is ${ar(A(h))}, in the row z = ${zt(h)}. The tension is x = μ + z × σ = ${n(mu)} + ${par(z)} × ${n(s)} = ${n(mu)} ${zs < 0 ? '−' : '+'} ${n(Math.abs(zs))} = ${n(x)}${same ? ' kN' : `, which is ${xr.toFixed(1)} kN to 1 decimal place`}.`,
  guidance: [
   { prompt: `Which z in the table has the area closest to ${k2}?`, answer: [z], explanation: `The area ${ar(A(h))} is the closest to ${k2}, and it sits in the row z = ${zt(h)}.` },
   { prompt: `How far from the mean is that, in kN? What is z × σ = ${zt(h)} × ${n(s)}?`, answer: [zs], explanation: `${zt(h)} × ${n(s)} = ${n(zs)} kN.` },
   { prompt: `Add that to the mean of ${n(mu)} kN and round to 1 decimal place. What is the tension at the ${n(k)}th percentile?`, answer: [xr], explanation: `${n(mu)} ${zs < 0 ? '−' : '+'} ${n(Math.abs(zs))} = ${n(x)}${same ? '' : `, which rounds to ${xr.toFixed(1)}`} kN.` }
  ] }; }
});

/* The longest t% go to recycling: z, cut-off length, expected number recycled. */
mk({
 id: 'q34c', parent: 'q34', kind: 'applied', title: 'The recycling gate',
 brief: 'The longest bolts of each batch go back to the furnace, and Mira has to set the gate at the right length.',
 labels: ['z', 'gate length (mm)', 'expected bolts recycled'], tolerance: 0.005,
 gl: [['z'], ['gate length (mm)'], ['expected bolts recycled']]
}, {
 canonical: { mu: 55, s: 4, t: 20, N: 500 },
 draw: R => { let p; do { p = { mu: R.int(30, 150), s: R.int(2, 9), t: R.pick(TAILS), N: R.pick([200, 400, 500, 800, 1000, 2000]) }; } while (half(100 * p.mu + nearestRow(100 - p.t).h * p.s)); return p; },
 build: ({ mu, s, t, N }) => { const k = 100 - t, h = nearestRow(k).h, z = h / 100, zs = r6(h * s / 100), xh = 100 * mu + h * s, x = xh / 100, xr = round1(xh), same = xh % 10 === 0, k2 = (k / 100).toFixed(2), cnt = N * t / 100; return {
  prompt: `Bolt lengths from the Quality Lab follow a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. The longest ${n(t)}% of every batch go back to the furnace, so the gate is set at the ${n(k)}th percentile. Use the table row whose area is closest to ${k2}. Enter that row’s z, then the gate length in mm, rounded to 1 decimal place, then the number of bolts you expect to be recycled from a batch of ${n(N)}. ${TABLE}: ${rowList(tri(h, 1))}.`,
  answer: [z, xr, cnt],
  hints: [`If the longest ${n(t)}% are cut off, then ${n(k)}% of the bolts are shorter than the gate. That is the ${n(k)}th percentile, so look down the areas for the one nearest ${k2}.`, 'Turn the z back into a length with x = μ + z × σ. The recycled bolts are the share cut off, taken from the batch.'],
  solution: `The longest ${n(t)}% are cut off, so ${n(k)}% of bolts are shorter than the gate: it is the ${n(k)}th percentile, with area ${k2} to its left. The closest area in the table is ${ar(A(h))}, in the row z = ${zt(h)}. The gate is x = μ + z × σ = ${n(mu)} + ${par(z)} × ${n(s)} = ${n(mu)} + ${n(zs)} = ${n(x)}${same ? ' mm' : `, which is ${xr.toFixed(1)} mm to 1 decimal place`}. Out of ${n(N)} bolts you expect ${n(t)}% to be recycled: ${n(N)} × ${n(t / 100)} = ${n(cnt)}.`,
  guidance: [
   { prompt: `The gate must have ${n(k)}% of the bolts shorter than it. Which z in the table has the area closest to ${k2}?`, answer: [z], explanation: `The area ${ar(A(h))} is the closest to ${k2}, and it sits in the row z = ${zt(h)}.` },
   { prompt: `What length is that? Work out μ + z × σ = ${n(mu)} + ${zt(h)} × ${n(s)} and round to 1 decimal place.`, answer: [xr], explanation: `${zt(h)} × ${n(s)} = ${n(zs)}, and ${n(mu)} + ${n(zs)} = ${n(x)}${same ? '' : `, which rounds to ${xr.toFixed(1)}`} mm.` },
   { prompt: `The longest ${n(t)}% of the bolts are recycled. How many of ${n(N)} bolts is that?`, answer: [cnt], explanation: `${n(N)} × ${n(t / 100)} = ${n(cnt)} bolts.` }
  ] }; }
});

/* Keep the middle of the batch: the cut-off z, then the lower and upper lengths. Uses q33. */
mk({
 id: 'q34d', parent: 'q34', kind: 'challenge', uses: 'q33', title: 'The middle of the batch',
 brief: 'Mira wants to keep only the middle of each batch and send both extremes away, so the gate needs two marks.',
 labels: ['z of the upper cut-off', 'lower cut-off (mm)', 'upper cut-off (mm)'], tolerance: 0.005,
 gl: [['z of the upper cut-off', 'z of the lower cut-off'], ['lower cut-off (mm)'], ['upper cut-off (mm)']]
}, {
 canonical: { mu: 110, s: 6, t: 25 },
 draw: R => { let p; do { p = { mu: R.int(30, 150), s: R.int(2, 9), t: R.pick(TAILS) }; } while (half(100 * p.mu + nearestRow(100 - p.t).h * p.s) || half(100 * p.mu + nearestRow(p.t).h * p.s)); return p; },
 build: ({ mu, s, t }) => { const k = 100 - t, hu = nearestRow(k).h, hl = nearestRow(t).h, mid = 100 - 2 * t, xlh = 100 * mu + hl * s, xuh = 100 * mu + hu * s, xl = xlh / 100, xu = xuh / 100, xlr = round1(xlh), xur = round1(xuh), ku = (k / 100).toFixed(2), kl = (t / 100).toFixed(2); return {
  prompt: `Bolt lengths from the Quality Lab follow a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. Mira keeps the middle ${n(mid)}% of every batch and sends away the shortest ${n(t)}% and the longest ${n(t)}%. The upper cut-off is the ${n(k)}th percentile and the lower cut-off is the ${n(t)}th percentile. Use the table row whose area is closest to ${ku} for the upper one and the row closest to ${kl} for the lower one. Enter the z of the upper cut-off, then the lower cut-off length, then the upper cut-off length, both in mm and rounded to 1 decimal place. ${TABLE}: ${rowList([...tri(hl, 1), ...tri(hu, 1)])}.`,
  answer: [hu / 100, xlr, xur],
  hints: [`For each cut-off, look down the areas, not the z values: the upper one has ${ku} to its left and the lower one has ${kl}. The lower z is below the mean, so it is negative.`, 'Turn each z back into a length with x = μ + z × σ, and round each length to 1 decimal place.'],
  solution: `The upper cut-off is the ${n(k)}th percentile: the closest area to ${ku} is ${ar(A(hu))}, in the row z = ${zt(hu)}. The lower cut-off is the ${n(t)}th percentile: the closest area to ${kl} is ${ar(A(hl))}, in the row z = ${zt(hl)}. Then x = μ + z × σ gives ${n(mu)} + ${par(hl / 100)} × ${n(s)} = ${n(xl)}${xlh % 10 === 0 ? '' : `, which is ${xlr.toFixed(1)}`} mm for the lower cut-off, and ${n(mu)} + ${par(hu / 100)} × ${n(s)} = ${n(xu)}${xuh % 10 === 0 ? '' : `, which is ${xur.toFixed(1)}`} mm for the upper one. The bolts between ${xlr.toFixed(1)} mm and ${xur.toFixed(1)} mm are the middle ${n(mid)}%.`,
  guidance: [
   { prompt: `Find the z with the area closest to ${ku} (upper cut-off) and the z with the area closest to ${kl} (lower cut-off).`, answer: [hu / 100, hl / 100], explanation: `${ar(A(hu))} is the closest area to ${ku}, in the row ${zt(hu)}; ${ar(A(hl))} is the closest to ${kl}, in the row ${zt(hl)}.` },
   { prompt: `What is the lower cut-off length? Work out μ + z × σ = ${n(mu)} + ${par(hl / 100)} × ${n(s)} and round to 1 decimal place.`, answer: [xlr], explanation: `${zt(hl)} × ${n(s)} = ${n(r6(hl * s / 100))}, and ${n(mu)} + ${par(r6(hl * s / 100))} = ${n(xl)}${xlh % 10 === 0 ? '' : `, which rounds to ${xlr.toFixed(1)}`} mm.` },
   { prompt: `What is the upper cut-off length? Work out μ + z × σ = ${n(mu)} + ${zt(hu)} × ${n(s)} and round to 1 decimal place.`, answer: [xur], explanation: `${zt(hu)} × ${n(s)} = ${n(r6(hu * s / 100))}, and ${n(mu)} + ${n(r6(hu * s / 100))} = ${n(xu)}${xuh % 10 === 0 ? '' : `, which rounds to ${xur.toFixed(1)}`} mm.` }
  ] }; }
});

/* ---- q35 Sums of random variables: means add [IS 7.2] ---- */

mk({
 id: 'q35b', parent: 'q35', kind: 'setting', title: 'Power for the mast',
 brief: 'The weather mast runs two kinds of instrument off one battery, and Mira wants the expected total draw before she sizes it.',
 labels: ['expected draw of the anemometers (W)', 'expected draw of everything (W)'], tolerance: 0.01,
 gl: [['anemometers (W)'], ['rain gauges (W)'], ['everything (W)']]
}, {
 canonical: { a: 5, m1: 18, b: 4, m2: 7 },
 draw: R => { let p; do { p = { a: R.int(3, 12), m1: R.int(5, 60), b: R.int(2, 10), m2: R.int(2, 40) }; } while (p.a === p.b || p.m1 === p.m2); return p; },
 build: ({ a, m1, b, m2 }) => { const t1 = a * m1, t2 = b * m2, tot = t1 + t2; return {
  prompt: `The Weather Station’s mast carries ${n(a)} anemometers and ${n(b)} rain gauges, all on one battery. The power each anemometer draws is a random variable with mean ${n(m1)} W, and each rain gauge’s draw is a random variable with mean ${n(m2)} W. Enter the expected total draw of the ${n(a)} anemometers, then the expected total draw of all the instruments together. Both are in watts.`,
  answer: [t1, tot],
  hints: ['The mean of a sum is the sum of the means: E(X + Y) = E(X) + E(Y). It holds for any number of random variables, and it does not matter whether they are the same kind.', 'Each anemometer adds one copy of its mean. Find the total for each kind of instrument, then add the two totals.'],
  solution: `The anemometers’ total draw is a sum of ${n(a)} random variables, each with mean ${n(m1)} W. Means add, so its expected value is ${n(a)} × ${n(m1)} = ${n(t1)} W. The rain gauges add ${n(b)} × ${n(m2)} = ${n(t2)} W. Means add across the two kinds too, so the expected total draw is ${n(t1)} + ${n(t2)} = ${n(tot)} W.`,
  guidance: [
   { prompt: `What is the expected total draw of the ${n(a)} anemometers? Work out ${n(a)} × ${n(m1)}.`, answer: [t1], explanation: `${n(a)} copies of ${n(m1)} W: ${n(a)} × ${n(m1)} = ${n(t1)} W.` },
   { prompt: `What is the expected total draw of the ${n(b)} rain gauges? Work out ${n(b)} × ${n(m2)}.`, answer: [t2], explanation: `${n(b)} × ${n(m2)} = ${n(t2)} W.` },
   { prompt: `Add the two totals. What is the expected draw of all the instruments together?`, answer: [tot], explanation: `${n(t1)} + ${n(t2)} = ${n(tot)} W.` }
  ] }; }
});

mk({
 id: 'q35c', parent: 'q35', kind: 'applied', title: 'How much lift is spare',
 brief: 'A balloon can only lift so much, and Mira wants to know how much room is left once her instruments are loaded.',
 labels: ['expected payload (g)', 'spare lift (g)'], tolerance: 0.01,
 gl: [['pods (g)', 'battery packs (g)'], ['expected payload (g)'], ['spare lift (g)']]
}, {
 canonical: { c: 7, mu: 62, d: 3, w: 140, L: 1034 },
 /* L, the most the balloon can lift, is drawn as the expected payload plus a spare of 50 to 600 g. */
 draw: R => { const p = { c: R.int(3, 12), mu: R.int(20, 150), d: R.int(2, 6), w: R.int(60, 300) }; p.L = p.c * p.mu + p.d * p.w + 10 * R.int(5, 60); return p; },
 build: ({ c, mu, d, w, L }) => { const t1 = c * mu, t2 = d * w, pay = t1 + t2, sp = L - pay; return {
  prompt: `A weather balloon can lift at most ${n(L)} g. Mira loads ${n(c)} sensor pods and ${n(d)} battery packs. Each pod’s mass is a random variable with mean ${n(mu)} g, and each pack’s mass is a random variable with mean ${n(w)} g. Enter the expected mass of the whole payload in grams, then how many grams of lift are spare if the payload has exactly its expected mass. Type the numbers without commas.`,
  answer: [pay, sp],
  hints: ['The mean of a sum is the sum of the means. Find the expected mass of all the pods together and of all the packs together, then add them.', 'The spare lift is what the balloon can lift, less the expected mass of the payload.'],
  solution: `The ${n(c)} pods have expected total mass ${n(c)} × ${n(mu)} = ${n(t1)} g, and the ${n(d)} packs have ${n(d)} × ${n(w)} = ${n(t2)} g. Means add, so the expected payload is ${n(t1)} + ${n(t2)} = ${n(pay)} g. The balloon lifts ${n(L)} g, so with a payload of exactly its expected mass the spare lift is ${n(L)} − ${n(pay)} = ${n(sp)} g.`,
  guidance: [
   { prompt: `What is the expected mass of the ${n(c)} pods together, and of the ${n(d)} packs together?`, answer: [t1, t2], explanation: `${n(c)} × ${n(mu)} = ${n(t1)} g for the pods and ${n(d)} × ${n(w)} = ${n(t2)} g for the packs.` },
   { prompt: `Add the two totals. What is the expected mass of the whole payload?`, answer: [pay], explanation: `${n(t1)} + ${n(t2)} = ${n(pay)} g.` },
   { prompt: `The balloon can lift ${n(L)} g. How many grams of lift are spare?`, answer: [sp], explanation: `${n(L)} − ${n(pay)} = ${n(sp)} g.` }
  ] }; }
});

/* Each pod's mass is given by a small table: E(X) from it, then the total. Uses q15. */
const POD_P = [[0.2, 0.5, 0.3], [0.3, 0.4, 0.3], [0.25, 0.5, 0.25], [0.1, 0.6, 0.3], [0.4, 0.4, 0.2], [0.2, 0.3, 0.5], [0.5, 0.3, 0.2], [0.15, 0.45, 0.4], [0.35, 0.45, 0.2]];
mk({
 id: 'q35d', parent: 'q35', kind: 'challenge', uses: 'q15', title: 'Pods with uncertain mass',
 brief: 'The pods come off the line in three weights, and Mira wants the expected payload before she has weighed a single one.',
 labels: ['expected mass of one pod (g)', 'expected mass of the pods (g)', 'expected payload (g)'], tolerance: 0.01,
 gl: [['expected mass of one pod (g)'], ['expected mass of the pods (g)'], ['expected payload (g)']]
}, {
 canonical: { x1: 60, x2: 90, x3: 150, pr: [0.3, 0.4, 0.3], c: 8, f: 130 },
 draw: R => { const x1 = 10 * R.int(5, 15), x2 = x1 + 10 * R.int(3, 10), x3 = x2 + 10 * R.int(3, 10); return { x1, x2, x3, pr: POD_P[R.int(0, POD_P.length - 1)].slice(), c: R.int(4, 15), f: 10 * R.int(5, 40) }; },
 build: ({ x1, x2, x3, pr, c, f }) => { const [p1, p2, p3] = pr, t1 = r6(x1 * p1), t2 = r6(x2 * p2), t3 = r6(x3 * p3), E = r6(t1 + t2 + t3), tot = r6(c * E), pay = r6(tot + f); return {
  prompt: `The pods for the Weather Station’s balloon come off the line in three masses. A pod weighs ${n(x1)} g with probability ${n(p1)}, ${n(x2)} g with probability ${n(p2)} and ${n(x3)} g with probability ${n(p3)}. Mira loads ${n(c)} pods and a fixed frame of mass ${n(f)} g. Enter the expected mass of one pod, then the expected mass of the ${n(c)} pods together, then the expected mass of the whole payload. All are in grams; type them without commas.`,
  answer: [E, tot, pay],
  hints: ['The expected value of one pod is E(X) = Σ x P(x): multiply each mass by its probability and add the three results.', 'The mean of a sum is the sum of the means. The pods add one copy of E(X) each, and the frame, which always has the same mass, adds that mass.'],
  solution: `For one pod, E(X) = ${n(x1)} × ${n(p1)} + ${n(x2)} × ${n(p2)} + ${n(x3)} × ${n(p3)} = ${n(t1)} + ${n(t2)} + ${n(t3)} = ${n(E)} g. Means add, so ${n(c)} pods have expected mass ${n(c)} × ${n(E)} = ${n(tot)} g. The frame always weighs ${n(f)} g, so the expected payload is ${n(tot)} + ${n(f)} = ${n(pay)} g.`,
  guidance: [
   { prompt: `Work out E(X) for one pod: ${n(x1)} × ${n(p1)} + ${n(x2)} × ${n(p2)} + ${n(x3)} × ${n(p3)}.`, answer: [E], explanation: `${n(t1)} + ${n(t2)} + ${n(t3)} = ${n(E)} g.` },
   { prompt: `Means add. What is the expected mass of ${n(c)} pods together?`, answer: [tot], explanation: `${n(c)} × ${n(E)} = ${n(tot)} g.` },
   { prompt: `Add the frame of ${n(f)} g. What is the expected mass of the whole payload?`, answer: [pay], explanation: `${n(tot)} + ${n(f)} = ${n(pay)} g.` }
  ] }; }
});

})();
