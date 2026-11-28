/* Probability mission generators, file d: q31–q40. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-d.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* The stored normal table. z is held in hundredths (h = 130 is z = 1.30); A(h) is the area to the left of z, to
   4 decimal places, as a whole number of ten-thousandths (A(130) = 9032). The game is offline, so every mission
   prints the rows it needs, and every draw keeps z inside the table (|z| <= 3.49). */
const memo = {};
const A = h => { if (memo[h] === undefined) { const z = h / 100; let term = z, sum = z;
 for (let k = 1; k < 400 && term !== 0; k++) { term *= -z * z / (2 * k); sum += term / (2 * k + 1); if (Math.abs(term) < 1e-18) break; }
 memo[h] = Math.round((0.5 + sum / Math.sqrt(2 * Math.PI)) * 1e4); } return memo[h]; };
const zt = h => (h < 0 ? '−' : '') + (Math.abs(h) / 100).toFixed(2);          // z as the table prints it: 1.30, −0.45
const ar = v => (v / 1e4).toFixed(4);                                          // an area as the table prints it: 0.9032
const rowList = hs => hs.slice().sort((a, b) => a - b).map(h => `${zt(h)} → ${ar(A(h))}`).join(', ');
const tri = (h, o) => [h - o, h - o + 1, h - o + 2];                           // three neighbouring rows, the right one at place o
const TABLE = 'Rows from the normal table (z → area to the left of z)';
/* Rounding z to 2 places: h is the nearest row; a draw whose z sits within 0.0002 of a halfway point is rejected. */
const near = x => Math.round(x * 100);
/* A value to 4 decimal places as written: exact if it has at most 4, otherwise cut (not rounded) with “…” after it. */
const dig4 = x => { if (Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6) return n(x); const t = Math.trunc(x * 1e4 + Math.sign(x) * 1e-7) / 1e4; return (t < 0 ? '−' : '') + Math.abs(t).toFixed(4) + '…'; };
const tie = x => Math.abs(Math.abs(x * 100) % 1 - 0.5) < 0.02;
const exact2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
const zText = (x, h) => exact2(x) ? zt(h) : `${dig4(x)}, which rounds to ${zt(h)}`;
/* q34: the row whose area is nearest k%; only k with a single nearest row is drawn. */
const nearestRow = k => { let best = 0, gap = Infinity, second = Infinity; for (let h = -349; h <= 349; h++) { const g = Math.abs(A(h) - 100 * k); if (g < gap) { second = gap; gap = g; best = h; } else if (g < second) second = g; } return { h: best, clear: second - gap >= 2 }; };
const PCT = [10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 75, 80, 85, 90].filter(k => nearestRow(k).clear);
/* q39: (n, p, √(npq)) with a whole or half standard deviation; 4 and 8 are left out because (k − 0.5 − np) ÷ 4 always
   lands halfway between two rows. np and nq are both at least 5. */
const BIN = [[36, 0.5, 3], [100, 0.5, 5], [100, 0.9, 3], [100, 0.1, 3], [144, 0.5, 6], [225, 0.2, 6], [400, 0.1, 6], [48, 0.25, 3], [192, 0.25, 6], [300, 0.25, 7.5], [400, 0.5, 10]];
/* q40: (n, p, √(pq ÷ n)) for a sample proportion. n is 100 or 400 and pq a square (0.25, 0.16, 0.09), so p̂ = k ÷ n has at most
   4 decimals and √(pq ÷ n) = √(pq) ÷ √n is worked in short steps. */
const PROP = [[100, 0.5, 0.05], [100, 0.2, 0.04], [100, 0.1, 0.03], [100, 0.9, 0.03], [400, 0.2, 0.02], [400, 0.5, 0.025], [100, 0.8, 0.04], [400, 0.1, 0.015]];
/* The parameters carry n and p themselves (not a place in these lists), so an oracle needs no copy of the lists;
   the stored spread is looked up from them. */
const spread = (list, nn, pr) => list.find(e => e[0] === nn && e[1] === pr)[2];
const q100 = p => (100 - Math.round(p * 100)) / 100;
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* z = (x − μ) ÷ σ for a bolt x = μ + d/100 mm (σ = sh/100 mm), then x = μ + zσ for z = w/10. The second length has
    at most 2 decimals; the first z is not a halfway case. Not the worked example (40 mm, 0.5 mm). */
 q31: {
  canonical: { mu: 80, sh: 250, d: 460, w: -12 },
  draw: R => { let p; do { const sh = R.pick([40, 50, 60, 80, 120, 150, 200, 250]), sg = R.bool() ? 1 : -1;
   p = { mu: R.int(20, 120), sh, d: sg * R.int(Math.ceil(0.2 * sh), Math.floor(2.8 * sh)), w: (R.bool() ? 1 : -1) * R.int(3, 25) }; }
   while (tie(p.d / p.sh) || (p.w * p.sh) % 10 !== 0 || near(p.d / p.sh) === 10 * p.w || p.sh === 50 && p.mu === 40); return p; },
  build: ({ mu, sh, d, w }) => { const s = sh / 100, x = mu + d / 100, dev = d / 100, zx = d / sh, h = near(zx), z = h / 100, z2 = w / 10, off = w * sh / 1000, x2 = mu + off; return {
   prompt: `The Quality Lab’s bolts have lengths that follow a normal distribution with mean μ = ${n(mu)} mm and standard deviation σ = ${n(s)} mm. A bolt on the bench measures ${n(x)} mm. Enter its z-score, rounded to 2 decimal places. Then a second bolt has a z-score of ${n(z2)}: enter its length in mm.`,
   answer: [z, x2],
   hints: ['The z-score is (x − μ) ÷ σ: the distance from the mean, measured in standard deviations. It is negative for a bolt shorter than the mean.', 'To go back from a z-score to a length, turn the rule round: x = μ + z × σ.'],
   solution: `The first bolt is x − μ = ${n(x)} − ${n(mu)} = ${n(dev)} mm from the mean, so its z-score is ${n(dev)} ÷ ${n(s)} = ${zText(zx, h)}: it sits ${n(Math.abs(z))} standard deviation${Math.abs(z) === 1 ? '' : 's'} ${z > 0 ? 'above' : 'below'} the mean. For the second bolt, x = μ + z × σ = ${n(mu)} + ${par(z2)} × ${n(s)} = ${n(mu)} ${off < 0 ? '−' : '+'} ${n(Math.abs(off))} = ${n(x2)} mm.`,
   guidance: [
    { prompt: `How far is the bolt of ${n(x)} mm from the mean of ${n(mu)} mm? Enter x − μ, negative if the bolt is shorter than the mean.`, answer: [dev], explanation: `${n(x)} − ${n(mu)} = ${n(dev)} mm.` },
    { prompt: `Divide that distance by σ = ${n(s)} mm and round to 2 decimal places. What is the z-score?`, answer: [z], explanation: `${n(dev)} ÷ ${n(s)} = ${zText(zx, h)}. The bolt is ${n(Math.abs(z))} standard deviation${Math.abs(z) === 1 ? '' : 's'} ${z > 0 ? 'above' : 'below'} the mean.` },
    { prompt: `The second bolt has z = ${n(z2)}. What is z × σ, and what is its length μ + z × σ?`, answer: [off, x2], explanation: `${par(z2)} × ${n(s)} = ${n(off)} mm, and ${n(mu)} ${off < 0 ? '−' : '+'} ${n(Math.abs(off))} = ${n(x2)} mm.` }
   ] }; }
 },
 /* P(X < x) for a bolt mass x = μ + zσ with z = h/100 exactly; three table rows, the right one at place o. */
 q32: {
  canonical: { mu: 120, s: 8, h: 130, o: 1 },
  draw: R => { let p; do { p = { mu: R.int(40, 200), s: R.pick([2, 3, 4, 5, 6, 8, 10]), h: (R.bool() ? 1 : -1) * R.int(10, 250), o: R.int(0, 2) }; } while (p.mu === 60 && p.s === 5); return p; },
  build: ({ mu, s, h, o }) => { const x = mu + h * s / 100, dx = h * s / 100, z = h / 100, P = A(h); return {
   prompt: `The masses of the Quality Lab’s bolts follow a normal distribution with mean ${n(mu)} g and standard deviation ${n(s)} g. What is the probability that a bolt picked at random weighs less than ${n(x)} g? Enter the z-score of ${n(x)} g, then P(X < ${n(x)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
   answer: [z, P / 1e4],
   hints: ['Turn the mass into a z-score first with z = (x − μ) ÷ σ. Here it comes out to exactly 2 decimal places.', 'Find the table row with your z. The number beside it is the area to the left of z, which is the probability of a value below x.'],
   solution: `z = (${n(x)} − ${n(mu)}) ÷ ${n(s)} = ${n(dx)} ÷ ${n(s)} = ${zt(h)}. The area to the left of ${n(x)} g under the bolts’ curve is the area to the left of z = ${zt(h)} under the standard normal curve, and the table row for ${zt(h)} gives ${ar(P)}. So P(X < ${n(x)}) = ${ar(P)}.`,
   guidance: [
    { prompt: `How far is ${n(x)} g from the mean? What is x − μ = ${n(x)} − ${n(mu)}?`, answer: [dx], explanation: `${n(x)} − ${n(mu)} = ${n(dx)} g.` },
    { prompt: `Divide by σ = ${n(s)}. What is the z-score?`, answer: [z], explanation: `${n(dx)} ÷ ${n(s)} = ${zt(h)}.` },
    { prompt: `Read the row for z = ${zt(h)}. What is P(X < ${n(x)})?`, answer: [P / 1e4], explanation: `The row ${zt(h)} → ${ar(P)} gives the area to the left of z, so P(X < ${n(x)}) = ${ar(P)}.` }
   ] }; }
 },
 /* P(a < X < b) = A(hb) − A(ha) for a pass band a = μ + ha·σ/100 < μ < b = μ + hb·σ/100; six table rows. */
 q33: {
  canonical: { mu: 50, s: 2, ha: -125, hb: 155, oa: 2, ob: 0 },
  draw: R => { let p; do { p = { mu: R.int(30, 90), s: R.pick([2, 3, 4, 5]), ha: R.int(-250, -20), hb: R.int(20, 250), oa: R.int(0, 2), ob: R.int(0, 2) }; } while (p.mu === 30 && p.s === 4); return p; },
  build: ({ mu, s, ha, hb, oa, ob }) => { const a = mu + ha * s / 100, b = mu + hb * s / 100, La = A(ha), Lb = A(hb), P = Lb - La; return {
   prompt: `The Quality Lab passes a bolt if its length is between ${n(a)} mm and ${n(b)} mm. Bolt lengths follow a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. Enter the z-score of ${n(a)} mm, then the z-score of ${n(b)} mm, then P(${n(a)} < X < ${n(b)}), the probability that a bolt passes, to 4 decimal places, worked out from the table rows given here. ${TABLE}: ${rowList([...tri(ha, oa), ...tri(hb, ob)])}.`,
   answer: [ha / 100, hb / 100, P / 1e4],
   hints: ['Turn both lengths into z-scores with z = (x − μ) ÷ σ.', 'The table gives areas to the left. The area between two values is the area to the left of the larger one minus the area to the left of the smaller one.'],
   solution: `For ${n(a)} mm, z = (${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(ha)}; for ${n(b)} mm, z = (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hb)}. The table gives ${ar(Lb)} to the left of ${zt(hb)} and ${ar(La)} to the left of ${zt(ha)}. The area between them is the difference: P(${n(a)} < X < ${n(b)}) = ${ar(Lb)} − ${ar(La)} = ${ar(P)}.`,
   guidance: [
    { prompt: `What are the z-scores of ${n(a)} mm and of ${n(b)} mm?`, answer: [ha / 100, hb / 100], explanation: `(${n(a)} − ${n(mu)}) ÷ ${n(s)} = ${zt(ha)} and (${n(b)} − ${n(mu)}) ÷ ${n(s)} = ${zt(hb)}.` },
    { prompt: `Read the two table rows. What is the area to the left of z = ${zt(ha)}, and to the left of z = ${zt(hb)}?`, answer: [La / 1e4, Lb / 1e4], explanation: `The rows give ${ar(La)} for ${zt(ha)} and ${ar(Lb)} for ${zt(hb)}.` },
    { prompt: `The area between is the larger area minus the smaller one. What is ${ar(Lb)} − ${ar(La)}?`, answer: [P / 1e4], explanation: `${ar(Lb)} − ${ar(La)} = ${ar(P)}: the share of bolts that pass.` }
   ] }; }
 },
 /* The kth percentile: the row whose area is nearest k ÷ 100, printed between its two neighbours so the player can see
    it is the nearest; then x = μ + zσ rounded to 1 decimal place (never a halfway case). */
 q34: {
  canonical: { mu: 64, s: 3, k: 90 },
  draw: R => { let p; do { p = { mu: R.int(30, 150), s: R.int(2, 9), k: R.pick(PCT) }; } while (Math.abs(nearestRow(p.k).h * p.s) % 10 === 5 || p.k === 75 && p.mu === 50); return p; },
  build: ({ mu, s, k }) => { const h = nearestRow(k).h, z = h / 100, zs = h * s / 100, x = mu + zs, xr = Math.round(x * 10) / 10, same = Math.abs(x - xr) < 1e-9, x1 = xr.toFixed(1), k2 = (k / 100).toFixed(2); return {
   prompt: `The Quality Lab cuts bolts whose lengths follow a normal distribution with mean ${n(mu)} mm and standard deviation ${n(s)} mm. Mira wants the ${n(k)}th percentile: the length that ${n(k)}% of the bolts are shorter than. Use the table row whose area is closest to ${k2}. Enter that row’s z, then the length at the ${n(k)}th percentile in mm, rounded to 1 decimal place. ${TABLE}: ${rowList(tri(h, 1))}.`,
   answer: [z, xr],
   hints: [`The ${n(k)}th percentile has an area of ${k2} to its left. Look down the areas, not the z values, for the one nearest ${k2}.`, 'Then go back from z to a length with x = μ + z × σ, as you did for z-scores.'],
   solution: `The ${n(k)}th percentile has ${n(k)}% of the area, ${k2}, to its left. The closest area in the table is ${ar(A(h))}, in the row z = ${zt(h)}. The length is x = μ + z × σ = ${n(mu)} + ${par(z)} × ${n(s)} = ${n(mu)} ${zs < 0 ? '−' : '+'} ${n(Math.abs(zs))} = ${n(x)}${same ? ' mm' : `, which is ${x1} mm to 1 decimal place`}.`,
   guidance: [
    { prompt: `Which z in the table has the area closest to ${k2}?`, answer: [z], explanation: `The area ${ar(A(h))} is the closest to ${k2}, and it sits in the row z = ${zt(h)}.` },
    { prompt: `How far from the mean is that, in mm? What is z × σ = ${zt(h)} × ${n(s)}?`, answer: [zs], explanation: `${zt(h)} × ${n(s)} = ${n(zs)} mm.` },
    { prompt: `Add that to the mean of ${n(mu)} mm and round to 1 decimal place. What is the length at the ${n(k)}th percentile?`, answer: [xr], explanation: `${n(mu)} ${zs < 0 ? '−' : '+'} ${n(Math.abs(zs))} = ${n(x)}${same ? '' : `, which rounds to ${x1}`} mm.` }
   ] }; }
 },
 /* E(total) = c × μ for c pods, plus a radio of mean r: means add. */
 q35: {
  canonical: { c: 6, mu: 85, r: 240 },
  draw: R => { let p; do { p = { c: R.int(3, 12), mu: R.int(40, 250), r: R.int(100, 600) }; } while (p.c === 4 && p.mu === 120); return p; },
  build: ({ c, mu, r }) => { const pods = c * mu, tot = pods + r; return {
   prompt: `A weather balloon from the station carries ${n(c)} sensor pods and one radio. Each pod’s mass is a random variable with mean ${n(mu)} g, and the radio’s mass has mean ${n(r)} g. Enter the expected total mass of the ${n(c)} pods, then the expected mass of the whole payload, pods and radio together. Both are in grams; type them without commas.`,
   answer: [pods, tot],
   hints: ['The mean of a sum is the sum of the means: E(X + Y) = E(X) + E(Y). It holds for any number of random variables, independent or not.', 'Each pod adds one copy of the same mean, so the pods together add the number of pods times that mean.'],
   solution: `The total mass of the pods is a sum of ${n(c)} random variables, each with mean ${n(mu)} g. Means add, so its expected value is ${n(mu)} added ${n(c)} times: ${n(c)} × ${n(mu)} = ${n(pods)} g. The radio is one more random variable in the sum, so the whole payload has expected mass ${n(pods)} + ${n(r)} = ${n(tot)} g.`,
   guidance: [
    { prompt: `Start with two pods. What is the expected mass of the two together?`, answer: [2 * mu], explanation: `E(X + Y) = E(X) + E(Y) = ${n(mu)} + ${n(mu)} = ${n(2 * mu)} g.` },
    { prompt: `Now all ${n(c)} pods. What is their expected total mass?`, answer: [pods], explanation: `${n(c)} copies of ${n(mu)} g: ${n(c)} × ${n(mu)} = ${n(pods)} g.` },
    { prompt: `Add the radio. What is the expected mass of the whole payload?`, answer: [tot], explanation: `${n(pods)} + ${n(r)} = ${n(tot)} g.` }
   ] }; }
 },
 /* Var(total) = c σ² for c independent pods; σ(total) = √c × σ, rounded to 2 decimal places. */
 q36: {
  canonical: { c: 8, s: 3 },
  draw: R => { let p; do { p = { c: R.int(3, 30), s: R.pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9]) }; } while (tie(Math.sqrt(p.c * p.s * p.s)) || p.c === 5 && p.s === 4); return p; },
  build: ({ c, s }) => { const v1 = s * s, v = c * v1, sd = Math.sqrt(v), sr = Math.round(sd * 100) / 100, ex = exact2(sd); return {
   prompt: `The ${n(c)} sensor pods on a weather balloon have independent masses, each with standard deviation ${n(s)} g. Enter the variance of the pods’ total mass in g² (type it without commas), then the standard deviation of the total mass in grams, rounded to 2 decimal places.`,
   answer: [v, sr],
   hints: ['For independent random variables the variances add, not the standard deviations. Square σ to get one pod’s variance first.', 'The standard deviation of the total is the square root of the total’s variance.'],
   solution: `One pod has variance σ² = ${n(s)}² = ${n(v1)} g². The masses are independent, so the variances add: ${n(c)} × ${n(v1)} = ${n(v)} g². The standard deviation of the total is √${n(v)} = ${ex ? `${n(sr)} g` : `${dig4(sd)}, which is ${n(sr)} g to 2 decimal places`}. That is √${n(c)} × ${n(s)}: the spread grows like the square root of the number of pods, so it is far less than ${n(c)} × ${n(s)} = ${n(c * s)} g.`,
   guidance: [
    { prompt: `What is one pod’s variance, σ² = ${n(s)}²?`, answer: [v1], explanation: `${n(s)} × ${n(s)} = ${n(v1)} g².` },
    { prompt: `The masses are independent, so the variances add. What is the variance of the total of ${n(c)} pods?`, answer: [v], explanation: `${n(c)} × ${n(v1)} = ${n(v)} g².` },
    { prompt: `Take the square root of ${n(v)} and round to 2 decimal places. What is the standard deviation of the total?`, answer: [sr], explanation: `√${n(v)} = ${ex ? n(sr) : `${dig4(sd)}, which rounds to ${n(sr)}`} g.` }
   ] }; }
 },
 /* Standard error σ ÷ √c to 2 decimal places, and 4c readings to halve it. */
 q37: {
  canonical: { s: 7, c: 20 },
  draw: R => { let p; do { p = { s: R.int(3, 15), c: R.int(5, 60) }; } while (tie(p.s / Math.sqrt(p.c)) || p.s === 6 && p.c === 9); return p; },
  build: ({ s, c }) => { const rt = Math.sqrt(c), se = s / rt, sr = Math.round(se * 100) / 100, ex = exact2(se), m = 4 * c; return {
   prompt: `Single wind-speed readings at the weather station vary with standard deviation σ = ${n(s)} km/h. Mira averages n = ${n(c)} independent readings into one sample mean, X̄. Enter the standard error of X̄, σ ÷ √n, in km/h rounded to 2 decimal places. Then enter the number of readings that would make the standard error half as big.`,
   answer: [sr, m],
   hints: ['The sample mean is the total divided by n. The total has standard deviation √n × σ, and dividing by n leaves σ ÷ √n.', 'To make σ ÷ √n half as big, √n has to be twice as big. Think about what doubling √n does to n itself.'],
   solution: `The standard error is σ ÷ √n = ${n(s)} ÷ √${n(c)} = ${ex ? n(sr) : `${dig4(se)}, which is ${n(sr)}`} km/h${ex ? '' : ' to 2 decimal places'}. To halve it, √n must double, and doubling √n multiplies n by 2 × 2 = 4: ${n(c)} × 4 = ${n(m)} readings. This is the law of large numbers at work: the more readings go into X̄, the closer it tends to sit to the true mean, but each halving of the error costs four times as many readings.`,
   guidance: [
    { prompt: `What is σ ÷ √n = ${n(s)} ÷ √${n(c)}, rounded to 2 decimal places?`, answer: [sr], explanation: `√${n(c)} = ${n(rt)}, and ${n(s)} ÷ ${n(rt)} = ${ex ? n(sr) : `${dig4(se)}, which rounds to ${n(sr)}`} km/h.` },
    { prompt: 'To halve σ ÷ √n, how many times bigger must √n be?', answer: [2], explanation: 'Dividing σ by twice as much gives half as much, so √n must be 2 times as big.' },
    { prompt: `If √n is twice as big, n is 2 × 2 = 4 times as big. How many readings is that?`, answer: [m], explanation: `${n(c)} × 4 = ${n(m)} readings, and √${n(m)} is twice √${n(c)}.` }
   ] }; }
 },
 /* P(X̄ > c) for n = r² daily highs: standard error σ ÷ r (at most 2 decimals), z rounded to a table row. */
 q38: {
  canonical: { mu: 18, s: 4, r: 8, e: 7, o: 0 },
  draw: R => { let p; do { p = { mu: R.int(8, 30), s: R.int(2, 12), r: R.pick([6, 7, 8, 9, 10]), e: R.nz(-15, 25), o: R.int(0, 2) }; } while ((100 * p.s) % p.r !== 0 || tie(p.e * p.r / (10 * p.s)) || Math.abs(p.e * p.r / (10 * p.s)) < 0.1 || Math.abs(p.e * p.r / (10 * p.s)) > 3.2); return p; },
  build: ({ mu, s, r, e, o }) => { const N = r * r, se = s / r, c = mu + e / 10, zx = e * r / (10 * s), h = near(zx), L = A(h), P = 1e4 - L; return {
   prompt: `The weather station’s daily high temperature has mean μ = ${n(mu)} °C and standard deviation σ = ${n(s)} °C, and its spread is lopsided, not bell-shaped. Mira averages the highs of n = ${n(N)} days, and one day’s high does not affect another’s. Use the normal model of the Central Limit Theorem to estimate the probability that the sample mean X̄ is above ${n(c)} °C. Enter the z-score of ${n(c)} for X̄, rounded to 2 decimal places, then the estimate of P(X̄ > ${n(c)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
   answer: [h / 100, P / 1e4],
   hints: ['By the Central Limit Theorem, X̄ is close to normal with mean μ and standard deviation σ ÷ √n, the standard error. Work that out first, and measure z in standard errors.', 'The table gives the area to the left of z. The area to the right is 1 minus it.'],
   solution: `The days do not affect one another and n = ${n(N)} is large, so by the Central Limit Theorem X̄ is close to normal, even though single days are not. Its mean is ${n(mu)} °C and its standard error is σ ÷ √n = ${n(s)} ÷ √${n(N)} = ${n(s)} ÷ ${n(r)} = ${n(se)} °C. So z = (${n(c)} − ${n(mu)}) ÷ ${n(se)} = ${n(e / 10)} ÷ ${n(se)} = ${zText(zx, h)}. The table gives ${ar(L)} to the left of ${zt(h)}, so P(X̄ > ${n(c)}) ≈ 1 − ${ar(L)} = ${ar(P)}. That is the normal model’s estimate: how close it comes to the true chance depends on how lopsided single days are.`,
   guidance: [
    { prompt: `What is the standard error of X̄, σ ÷ √n = ${n(s)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(s)} ÷ ${n(r)} = ${n(se)} °C.` },
    { prompt: `Measure ${n(c)} in standard errors from the mean. What is z = (${n(c)} − ${n(mu)}) ÷ ${n(se)}, rounded to 2 decimal places?`, answer: [h / 100], explanation: `${n(e / 10)} ÷ ${n(se)} = ${zText(zx, h)}.` },
    { prompt: `The row for ${zt(h)} gives ${ar(L)} to the left. What is the area to the right, the estimate of P(X̄ > ${n(c)})?`, answer: [P / 1e4], explanation: `1 − ${ar(L)} = ${ar(P)}.` }
   ] }; }
 },
 /* Normal approximation to a binomial count with the continuity correction: P(X ≥ k) ≈ 1 − Φ((k − 0.5 − np) ÷ √(npq)). */
 q39: {
  canonical: { nn: 144, pr: 0.5, k: 80, o: 1 },
  draw: R => { let p, sd; do { const [nn, pr, s] = BIN[R.int(0, BIN.length - 1)]; sd = s; p = { nn, pr, k: Math.round(nn * pr) + R.int(1, Math.floor(2.8 * sd)), o: R.int(0, 2) }; } while (tie((p.k - 0.5 - p.nn * p.pr) / sd) || p.nn === 100 && p.pr === 0.5 && p.k === 58); return p; },
  build: ({ nn, pr, k, o }) => { const sd = spread(BIN, nn, pr), qr = q100(pr), np = Math.round(nn * pr * 100) / 100, npq = Math.round(nn * pr * qr * 100) / 100, cut = k - 0.5, zx = (cut - np) / sd, h = near(zx), L = A(h), P = 1e4 - L; return {
   prompt: `Each weather balloon the station launches has a chance of ${n(pr)} of reaching the upper air, independently of the others. This season ${n(nn)} balloons go up. Use the normal approximation, with the continuity correction, to find the probability that at least ${n(k)} of them reach it. Enter the z-score of the corrected cut-off, rounded to 2 decimal places, then the approximate P(X ≥ ${n(k)}) to 4 decimal places. ${TABLE}: ${rowList(tri(h, o))}.`,
   answer: [h / 100, P / 1e4],
   hints: ['The count X is binomial, with mean np and standard deviation √(npq), where q = 1 − p. Here np and nq are both at least 5, so a normal curve with that mean and standard deviation fits it well.', `“At least ${n(k)}” starts at the bar for ${n(k)}, whose left edge is at ${n(k)} − 0.5. Find the z-score of that cut-off and take the area to its right.`],
   solution: `X is binomial with n = ${n(nn)} and p = ${n(pr)}, so q = ${n(qr)}. Its mean is np = ${n(nn)} × ${n(pr)} = ${n(np)} and its standard deviation is √(npq) = √(${n(nn)} × ${n(pr)} × ${n(qr)}) = √${n(npq)} = ${n(sd)}. The bar for ${n(k)} balloons runs from ${n(k)} − 0.5 to ${n(k)} + 0.5, so with the continuity correction “at least ${n(k)}” starts at ${n(cut)}. Then z = (${n(cut)} − ${n(np)}) ÷ ${n(sd)} = ${zText(zx, h)}. The table gives ${ar(L)} to the left of ${zt(h)}, so P(X ≥ ${n(k)}) ≈ 1 − ${ar(L)} = ${ar(P)}.`,
   guidance: [
    { prompt: `What are the mean np and the standard deviation √(npq) of the count, for n = ${n(nn)} and p = ${n(pr)}?`, answer: [np, sd], explanation: `np = ${n(nn)} × ${n(pr)} = ${n(np)}, and √(npq) = √(${n(nn)} × ${n(pr)} × ${n(qr)}) = √${n(npq)} = ${n(sd)}.` },
    { prompt: `The corrected cut-off is ${n(k)} − 0.5 = ${n(cut)}. What is its z-score, rounded to 2 decimal places?`, answer: [h / 100], explanation: `(${n(cut)} − ${n(np)}) ÷ ${n(sd)} = ${zText(zx, h)}.` },
    { prompt: `The row for ${zt(h)} gives ${ar(L)} to the left. What is the area to the right?`, answer: [P / 1e4], explanation: `1 − ${ar(L)} = ${ar(P)}, so P(X ≥ ${n(k)}) is about ${ar(P)}.` }
   ] }; }
 },
 /* How surprising is a sample? kind 1: a sample mean of n = r² pressure readings; kind 2: a sample proportion of
    balloons. P is the tail beyond the observed value on its own side of the mean. */
 q40: {
  canonical: { kind: 1, mu: 1012, s: 6, r: 6, e: -17, o: 1 },
  draw: R => { let p;
   if (R.bool()) { do { p = { kind: 1, mu: R.int(995, 1025), s: R.int(3, 12), r: R.pick([6, 7, 8, 9, 10]), e: R.nz(-30, 30), o: R.int(0, 2) }; const zx = p.e * p.r / (10 * p.s); p.bad = (100 * p.s) % p.r !== 0 || tie(zx) || Math.abs(zx) < 0.3 || Math.abs(zx) > 3.2; } while (p.bad); delete p.bad; return p; }
   do { const [nn, pr, se] = PROP[R.int(0, PROP.length - 1)]; p = { kind: 2, nn, pr, k: Math.round(nn * pr) + R.nz(-Math.floor(3 * se * nn), Math.floor(3 * se * nn)), o: R.int(0, 2) }; const zx = (p.k - nn * pr) / (nn * se); p.bad = tie(zx) || Math.abs(zx) < 0.3 || Math.abs(zx) > 3.2 || nn === 100 && pr === 0.5 && p.k === 59; } while (p.bad); delete p.bad; return p; },
  build: p => { let se, zx, intro, setup, zl, hint1, first, over, name;
   if (p.kind === 1) { const { mu, s, r, e } = p, N = r * r, c = mu + e / 10; se = s / r; zx = e * r / (10 * s); over = c > mu; name = 'sample mean';
    intro = `Air pressure at the weather station has a long-run mean of μ = ${n(mu)} hPa and a standard deviation of σ = ${n(s)} hPa (hPa, hectopascals, is the unit on the barometer). The last ${n(N)} daily readings average x̄ = ${n(c)} hPa. If nothing has changed, how surprising is a sample mean at least this far ${over ? 'above' : 'below'} μ? Enter the z-score of x̄, rounded to 2 decimal places, then the probability of a sample mean at least this far out on the same side, to 4 decimal places.`;
    hint1 = 'If nothing has changed, the sample mean X̄ is close to normal with mean μ and standard error σ ÷ √n. Measure x̄ in standard errors from μ.';
    setup = `If nothing has changed, the Central Limit Theorem makes X̄ close to normal with mean ${n(mu)} hPa and standard error σ ÷ √n = ${n(s)} ÷ √${n(N)} = ${n(s)} ÷ ${n(r)} = ${n(se)} hPa. So `;
    zl = `z = (${n(c)} − ${n(mu)}) ÷ ${n(se)} = ${n(e / 10)} ÷ ${n(se)} = `;
    first = { prompt: `What is the standard error of the sample mean, σ ÷ √n = ${n(s)} ÷ √${n(N)}?`, answer: [se], explanation: `√${n(N)} = ${n(r)}, and ${n(s)} ÷ ${n(r)} = ${n(se)} hPa.` }; }
   else { const { nn, pr } = p, sr = spread(PROP, nn, pr), k = p.k, ph = k / nn, qr = q100(pr); se = sr; zx = (k - nn * pr) / (nn * sr); over = ph > pr; name = 'sample proportion';
    intro = `In the long run a share p = ${n(pr)} of the weather station’s balloons reach the upper air. This season ${n(k)} of ${n(nn)} did. If p has not changed, how surprising is a sample proportion at least this far ${over ? 'above' : 'below'} p? Enter the z-score of the sample proportion p̂ = ${n(k)} ÷ ${n(nn)}, rounded to 2 decimal places, then the probability of a sample proportion at least this far out on the same side, to 4 decimal places.`;
    hint1 = 'A sample proportion p̂ = X ÷ n has mean p and standard error √(pq ÷ n): the binomial’s np and √(npq), both divided by n. Measure p̂ in standard errors from p.';
    setup = `The sample proportion is p̂ = ${n(k)} ÷ ${n(nn)} = ${n(ph)}. If p has not changed, p̂ is close to normal with mean ${n(pr)} and standard error √(pq ÷ n) = √(${n(pr)} × ${n(qr)} ÷ ${n(nn)}) = ${n(se)}. So `;
    zl = `z = (${n(ph)} − ${n(pr)}) ÷ ${n(se)} = `;
    first = { prompt: `What is the standard error of the sample proportion, √(pq ÷ n) = √(${n(pr)} × ${n(qr)} ÷ ${n(nn)})?`, answer: [se], explanation: `${n(pr)} × ${n(qr)} = ${n(pr * qr)}, whose square root is ${n(Math.sqrt(pr * qr))}, and √${n(nn)} = ${n(Math.sqrt(nn))}, so the standard error is ${n(Math.sqrt(pr * qr))} ÷ ${n(Math.sqrt(nn))} = ${n(se)}.` }; }
   const h = near(zx), L = A(h), P = h < 0 ? L : 1e4 - L, rare = P < 500;
   const tail = h < 0 ? `The ${name} is below the mean, so the tail is the area to the left of ${zt(h)}, which the table gives directly: ${ar(P)}.` : `The ${name} is above the mean, so the tail is the area to the right of ${zt(h)}: 1 − ${ar(L)} = ${ar(P)}.`;
   const verdict = rare ? `Fewer than 5 samples in 100 would land this far out by chance, so this one is surprising: something may well have changed.` : `A sample this far out turns up by chance more than 5 times in 100, so on its own it is not surprising.`;
   return {
    prompt: `${intro} ${TABLE}: ${rowList(tri(h, p.o))}.`,
    answer: [h / 100, P / 1e4],
    hints: [hint1, 'For a value below the mean the tail is the area to the left, read straight from the table. For a value above the mean it is 1 minus the table’s area.'],
    solution: `${setup}${zl}${zText(zx, h)}. ${tail} ${verdict}`,
    guidance: [
     first,
     { prompt: `How many standard errors from the mean is the ${name}? Enter z, rounded to 2 decimal places.`, answer: [h / 100], explanation: `${zl}${zText(zx, h)}.` },
     { prompt: `The row for ${zt(h)} gives ${ar(L)} to the left. What is the probability of a ${name} at least this far out on the same side?`, answer: [P / 1e4], explanation: h < 0 ? `The tail is on the left, so it is the table’s area itself: ${ar(P)}.` : `The tail is on the right: 1 − ${ar(L)} = ${ar(P)}.` }
    ] }; }
 }
});
})();
