/* Probability mission generators, file b: q11–q20. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-b.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Rounding to d places, and "is x within a hair of a rounding boundary at d places" (such draws are skipped, so the
   rounded answer never depends on float noise). */
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const edge = (x, d) => { const s = x * Math.pow(10, d), f = s - Math.floor(s); return Math.abs(f - 0.5) < 1e-6; };
const exact = (x, d) => { const s = x * Math.pow(10, d); return Math.abs(s - Math.round(s)) < 1e-9; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* A rounded answer written with all its places (0.0250, 1.10), for the sentence that says how it was rounded. */
const fx = (x, d) => x.toFixed(d);
/* Superscript exponents: pw('0.8', 4) is '0.8⁴'; a power 1 is the base alone. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const pw = (base, e) => e === 1 ? base : base + String(e).split('').map(d => SUP[d]).join('');
/* Rows of the triangle of orders: row(m)[j] is the number of orders of j successes among m trials. */
const row = m => { let r = [1]; for (let i = 0; i < m; i++) { const next = [1]; for (let j = 1; j < r.length; j++) next.push(r[j - 1] + r[j]); next.push(1); r = next; } return r; };
const orders = (m, j) => row(m)[j];
const s = (k, one, many) => k === 1 ? one : many;
/* A value to 4 decimal places as written: exact if it has at most 4, otherwise cut (not rounded) with “…” after it. */
const dig4 = x => { if (Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6) return n(x); const t = Math.trunc(x * 1e4 + Math.sign(x) * 1e-7) / 1e4; return (t < 0 ? '−' : '') + Math.abs(t).toFixed(4) + '…'; };
/* Five whole hundredths, each at least lo, that add up to 100 (a probability table for X = 0 … count − 1). */
const table = (R, count, lo, hi) => { for (;;) { const p = []; let left = 100; for (let i = 0; i < count - 1; i++) { const v = R.int(lo, hi); p.push(v); left -= v; } if (left >= lo && left <= hi) { p.push(left); return p; } } };
const P = v => n(v / 100);
window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* 200 crates: Northway a sound, b cracked; Ridgeline c sound, d cracked. P(cracked | Ridgeline) = d ÷ (c + d) is
    a real rounding to 3 places (not a short exact decimal, not on a boundary); P(Ridgeline or cracked) = (c + d + b) ÷ 200
    is exact. Not the worked example's table. */
 q11: {
  canonical: { a: 98, b: 14, c: 70, d: 18 },
  draw: R => { for (;;) { const r = R.int(60, 140), d = R.int(6, 30), b = R.int(6, 30), x = d / r;
   if (exact(x, 4) || edge(x, 3)) continue; return { a: 200 - r - b, b, c: r - d, d }; } },
  build: ({ a, b, c, d }) => { const r = c + d, cr = b + d, x = d / r, cond = rd(x, 3), or = r + b, por = or / 200; return {
   prompt: `The sorting shed logged 200 crates by supplier and condition. Northway: ${n(a)} sound, ${n(b)} cracked. Ridgeline: ${n(c)} sound, ${n(d)} cracked. One of the 200 crates is picked at random. Enter P(cracked | Ridgeline), the probability that it is cracked given that it came from Ridgeline, to 3 decimal places. Then enter P(Ridgeline or cracked) as a decimal.`,
   answer: [cond, por],
   hints: ['Given Ridgeline, only the Ridgeline row counts: divide its cracked crates by all of its crates.', 'For “or”, add the Ridgeline crates and the cracked crates, take away the crates counted twice (from Ridgeline and cracked), and divide by 200.'],
   solution: `Ridgeline sent ${n(c)} + ${n(d)} = ${n(r)} crates, and ${n(d)} of them are cracked, so P(cracked | Ridgeline) = ${n(d)} ÷ ${n(r)} = ${dig4(x)}, which is ${fx(cond, 3)} to 3 decimal places. There are ${n(b)} + ${n(d)} = ${n(cr)} cracked crates in all. By the addition rule, P(Ridgeline or cracked) = (${n(r)} + ${n(cr)} − ${n(d)}) ÷ 200 = ${n(or)} ÷ 200 = ${n(por)}.`,
   guidance: [
    { prompt: 'How many crates came from Ridgeline, and how many of those are cracked?', answer: [r, d], explanation: `Ridgeline sent ${n(c)} sound and ${n(d)} cracked crates, ${n(r)} in all. Given Ridgeline, these ${n(r)} crates are the only ones that count.` },
    { prompt: `What is ${n(d)} ÷ ${n(r)}, to 3 decimal places?`, answer: [cond], explanation: `${n(d)} ÷ ${n(r)} = ${dig4(x)}, which rounds to ${n(cond)}. That is P(cracked | Ridgeline).` },
    { prompt: 'How many crates are cracked in all, from both suppliers?', answer: [cr], explanation: `${n(b)} from Northway and ${n(d)} from Ridgeline: ${n(b)} + ${n(d)} = ${n(cr)}.` },
    { prompt: `Count the crates that are from Ridgeline or cracked or both: ${n(r)} + ${n(cr)} − ${n(d)}. What is that count, and what is it divided by 200?`, answer: [or, por], explanation: `The ${n(d)} cracked Ridgeline crates sit in both groups, so they are taken away once: ${n(r)} + ${n(cr)} − ${n(d)} = ${n(or)}, and ${n(or)} ÷ 200 = ${n(por)}.` }
   ] }; }
 },
 /* A screen with base rate b %, hit rate h % and false-alarm rate f %, pictured on 10000 crew: carriers who test
    positive b × h, others who test positive (100 − b) × f. The answer is not near 0, 1 or one half, and never on a
    rounding boundary. Not the worked example (1 %, 80 %, 10 %). */
 q12: {
  canonical: { b: 2, h: 90, f: 5 },
  draw: R => { for (;;) { const b = R.int(1, 10), h = R.int(80, 99), f = R.int(2, 15), x = b * h / (b * h + (100 - b) * f);
   if (b === 1 && h === 80 && f === 10) continue; if (exact(x, 4) || x < 0.03 || x > 0.95 || Math.abs(x - 0.5) < 0.02 || edge(x, 3)) continue; return { b, h, f }; } },
  build: ({ b, h, f }) => { const ill = 100 * b, well = 10000 - ill, tp = b * h, fp = (100 - b) * f, pos = tp + fp, x = tp / pos, ans = rd(x, 3); return {
   prompt: `The medical bay screens every crew member for a fever virus. ${n(b)}% of the crew carry it. The screen is positive for ${n(h)}% of carriers, and it gives a false alarm, a positive result, for ${n(f)}% of crew who do not carry it. A crew member tests positive. Enter P(carrier | positive), the probability that they really carry the virus, to 3 decimal places.`,
   answer: [ans],
   hints: ['Picture 10000 crew screened. Work out how many carriers test positive, and how many crew who are not carriers test positive.', 'Only the positive results count now: divide the carriers who test positive by everyone who tests positive.'],
   solution: `Out of 10000 crew screened, ${n(b)}% means ${n(ill)} carriers and ${n(well)} who are not. Of the carriers, ${n(h)}% test positive: ${n(tp)}. Of the others, ${n(f)}% get a false alarm: ${n(fp)}. So ${n(tp)} + ${n(fp)} = ${n(pos)} test positive, and P(carrier | positive) = ${n(tp)} ÷ ${n(pos)} = ${dig4(x)}, which is ${fx(ans, 3)} to 3 decimal places. By Bayes’ rule it is P(positive | carrier) × P(carrier) ÷ P(positive) = ${n(h / 100)} × ${n(b / 100)} ÷ ${n(pos / 10000)}, the same number. Even after a positive screen, carrying the virus is ${x < 0.5 ? 'less' : 'more'} likely than not.`,
   guidance: [
    { prompt: 'Picture 10000 crew screened. How many are carriers, and how many of them test positive?', answer: [ill, tp], explanation: `${n(b)}% of 10000 is ${n(ill)} carriers, and ${n(h)}% of ${n(ill)} is ${n(tp)}.` },
    { prompt: `How many of the 10000 are not carriers, and how many of them get a false alarm?`, answer: [well, fp], explanation: `10000 − ${n(ill)} = ${n(well)} are not carriers, and ${n(f)}% of ${n(well)} is ${n(fp)}.` },
    { prompt: `How many crew test positive in all, and what share of them are carriers, to 3 decimal places?`, answer: [pos, ans], explanation: `${n(tp)} + ${n(fp)} = ${n(pos)} positive results, of which ${n(tp)} are carriers: ${n(tp)} ÷ ${n(pos)} = ${dig4(x)}, about ${n(ans)}.` }
   ] }; }
 },
 /* P(cold) = x ÷ 100 gives odds against (100 − x) : x, reduced. Odds in favour a : b with a + b dividing 1000, so the
    probability a ÷ (a + b) is an exact decimal. Not the worked example (0.2, then 2 : 3). */
 q13: {
  canonical: { x: 35, a: 3, b: 5 },
  draw: R => { const pairs = []; for (let a = 1; a <= 15; a++) for (let b = 1; b <= 24; b++) if (a !== b && gcd(a, b) === 1 && [4, 5, 8, 10, 20, 25].includes(a + b) && !(a === 2 && b === 3)) pairs.push([a, b]);
   const [a, b] = R.pick(pairs); return { x: R.except(5, 95, [20, 50]), a, b }; },
  build: ({ x, a, b }) => { const p = x / 100, q = 1 - p, g = gcd(100 - x, x), A = (100 - x) / g, B = x / g, t = a + b, pr = a / t; return {
   prompt: `The medic puts the probability that a crew member catches the station cold this month at ${n(p)}. Enter the odds against catching it as two whole numbers in lowest terms, the first and then the second of the pair. Then: the odds in favour of the new air filter clearing the cold spores are ${n(a)} : ${n(b)}. Enter the probability that the filter clears them, as a decimal.`,
   answer: [A, B, pr],
   hints: [`Odds against compare the chance it does not happen with the chance it does: ${n(q)} : ${n(p)}. Multiply both by 100, then divide both by the largest whole number that goes into both.`, `Odds of ${n(a)} : ${n(b)} in favour mean ${n(a)} ${s(a, 'part', 'parts')} for it and ${n(b)} ${s(b, 'part', 'parts')} against it. A probability is the parts for it out of all the parts.`],
   solution: `The probability of not catching the cold is 1 − ${n(p)} = ${n(q)}. The odds against are ${n(q)} : ${n(p)} = ${n(100 - x)} : ${n(x)}${g > 1 ? `, and dividing both by ${n(g)} gives ${n(A)} : ${n(B)}` : `, which is already in lowest terms`}. Odds of ${n(a)} : ${n(b)} in favour mean ${n(a)} ${s(a, 'part', 'parts')} for and ${n(b)} against, ${n(t)} parts in all, so the probability is ${n(a)} ÷ ${n(t)} = ${n(pr)}.`,
   guidance: [
    { prompt: 'What is the probability of not catching the cold?', answer: [q], explanation: `By the complement rule it is 1 − ${n(p)} = ${n(q)}.` },
    { prompt: `Write ${n(q)} : ${n(p)} as two whole numbers in lowest terms. What are they?`, answer: [A, B], explanation: `Times 100 the pair is ${n(100 - x)} : ${n(x)}${g > 1 ? `; both divide by ${n(g)}, giving ${n(A)} : ${n(B)}` : `, and no whole number above 1 goes into both`}.` },
    { prompt: `For odds of ${n(a)} : ${n(b)} in favour, how many parts are there in all, and what is ${n(a)} divided by that number?`, answer: [t, pr], explanation: `${n(a)} + ${n(b)} = ${n(t)} parts, so the probability is ${n(a)} ÷ ${n(t)} = ${n(pr)}.` }
   ] }; }
 },
 /* X = crew visiting the bay in a day, 0 to 4, probabilities in hundredths (each 0.04 to 0.45). Entry m is hidden;
    the second answer is P(X ≥ k). Not the worked example's table. */
 q14: {
  canonical: { p: [12, 30, 32, 18, 8], m: 2, k: 2 },
  draw: R => ({ p: table(R, 5, 4, 45), m: R.int(0, 4), k: R.int(1, 3) }),
  build: ({ p, m, k }) => { const known = p.filter((_, i) => i !== m), sumKnown = known.reduce((s, v) => s + v, 0), miss = p[m] / 100,
   tail = p.slice(k), atLeast = tail.reduce((s, v) => s + v, 0) / 100;
   const list = p.map((v, i) => `P(X = ${i}) = ${i === m ? '?' : P(v)}`).join(', ');
   const tailText = tail.map((_, j) => `P(X = ${k + j})`).join(' + '), tailNums = tail.map(v => P(v)).join(' + ');
   const crew = k === 1 ? 'at least 1 crew member visits' : `at least ${k} crew members visit`; return {
   prompt: `Mira tracks X, the number of crew who visit the medical bay in a day. Its probability distribution is ${list}, and X is never more than 4. Enter the missing probability P(X = ${m}), then P(X ≥ ${k}), the probability that ${crew}.`,
   answer: [miss, atLeast],
   hints: ['The probabilities of a distribution cover every value X can take, so they add up to 1. Take the four you know away from 1.', `X ≥ ${k} means X is ${tail.map((_, j) => k + j).join(', ').replace(/, (\d+)$/, ' or $1')}. Two of these cannot happen on the same day, so add their probabilities.`],
   solution: `The four known probabilities add up to ${known.map(P).join(' + ')} = ${P(sumKnown)}, so P(X = ${m}) = 1 − ${P(sumKnown)} = ${n(miss)}. Then P(X ≥ ${k}) = ${tailText} = ${tailNums} = ${n(atLeast)}.`,
   guidance: [
    { prompt: 'Add up the four probabilities you are given. What do they come to?', answer: [sumKnown / 100], explanation: `${known.map(P).join(' + ')} = ${P(sumKnown)}.` },
    { prompt: `All five probabilities add up to 1. What is P(X = ${m})?`, answer: [miss], explanation: `1 − ${P(sumKnown)} = ${n(miss)}.` },
    { prompt: `Now add ${tailText}. What is P(X ≥ ${k})?`, answer: [atLeast], explanation: `${tailNums} = ${n(atLeast)}.` }
   ] }; }
 },
 /* X = scanner repairs a day, 0 to 3, probabilities in hundredths (0.05 to 0.6); E(X) has at most 2 decimals and
    the total over D days at most 1. Not the worked example's table. */
 q15: {
  canonical: { p: [25, 40, 20, 15], D: 20 },
  draw: R => { for (;;) { const p = table(R, 4, 5, 60); if (p.join() === '30,40,20,10') continue; return { p, D: R.pick([10, 20, 30, 40, 50]) }; } },
  build: ({ p, D }) => { const terms = p.map((v, x) => x * v / 100), mu = p.reduce((s, v, x) => s + x * v, 0) / 100, tot = mu * D;
   const list = p.map((v, x) => `P(X = ${x}) = ${P(v)}`).join(', '); return {
   prompt: `X is the number of scanner repairs the medical bay needs in a day: ${list}. Enter the expected value E(X), the mean number of repairs a day. Then enter the number of repairs to expect over the next ${n(D)} days.`,
   answer: [mu, tot],
   hints: ['Multiply each value of X by its probability. The value 0 adds nothing.', 'E(X) is the sum of those products. Over many days the repairs average E(X) a day, so multiply it by the number of days.'],
   solution: `E(X) = 0 × ${P(p[0])} + 1 × ${P(p[1])} + 2 × ${P(p[2])} + 3 × ${P(p[3])} = 0 + ${n(terms[1])} + ${n(terms[2])} + ${n(terms[3])} = ${n(mu)} ${s(mu, 'repair', 'repairs')} a day. So μ = ${n(mu)}. Over ${n(D)} days expect ${n(D)} × ${n(mu)} = ${n(tot)} repairs.`,
   guidance: [
    { prompt: 'Multiply each of the values 1, 2 and 3 by its probability. What are the three products?', answer: [terms[1], terms[2], terms[3]], explanation: `1 × ${P(p[1])} = ${n(terms[1])}, 2 × ${P(p[2])} = ${n(terms[2])} and 3 × ${P(p[3])} = ${n(terms[3])}. The value 0 gives 0 × ${P(p[0])} = 0.` },
    { prompt: 'Add the products. What is E(X)?', answer: [mu], explanation: `${n(terms[1])} + ${n(terms[2])} + ${n(terms[3])} = ${n(mu)}, so the mean is μ = ${n(mu)} ${s(mu, 'repair', 'repairs')} a day.` },
    { prompt: `How many repairs should the bay expect over ${n(D)} days?`, answer: [tot], explanation: `${n(D)} × ${n(mu)} = ${n(tot)}.` }
   ] }; }
 },
 /* X = patients on the bench, 0 to 4, probabilities in hundredths (0.05 to 0.4) with a whole-number mean μ from 1 to 3,
    so every (x − μ)² is whole and σ² has at most 2 decimals. σ is rounded to 2 places away from a boundary. */
 q16: {
  canonical: { p: [10, 30, 20, 30, 10] },
  draw: R => { for (;;) { const p = table(R, 5, 5, 40), m = p.reduce((s, v, x) => s + x * v, 0); if (m % 100) continue;
   const mu = m / 100, v = p.reduce((s, w, x) => s + (x - mu) * (x - mu) * w, 0) / 100; if (mu < 1 || mu > 3 || exact(Math.sqrt(v), 4) || edge(Math.sqrt(v), 2) || p.join() === '25,50,25,0,0') continue; return { p }; } },
  build: ({ p }) => { const mu = p.reduce((s, v, x) => s + x * v, 0) / 100, sq = p.map((_, x) => (x - mu) * (x - mu)), terms = p.map((v, x) => sq[x] * v / 100),
   v = terms.reduce((s, t) => s + t, 0), sd = Math.sqrt(v), sdr = rd(sd, 2);
   const list = p.map((w, x) => `P(X = ${x}) = ${P(w)}`).join(', '); return {
   prompt: `X is the number of patients on the medical bay’s waiting bench at noon: ${list}. Enter the variance σ² of X, then its standard deviation σ to 2 decimal places.`,
   answer: [v, sdr],
   hints: ['Find the mean μ first: multiply each value of X by its probability and add.', `For each value x, square its distance from the mean, (x − μ)², and multiply by its probability. The variance σ² is the sum, and σ is its square root.`],
   solution: `μ = 1 × ${P(p[1])} + 2 × ${P(p[2])} + 3 × ${P(p[3])} + 4 × ${P(p[4])} = ${n(mu)}. The squared distances (x − μ)² for x = 0, 1, 2, 3, 4 are ${sq.map(n).join(', ')}. So σ² = ${sq.map((q, x) => `${n(q)} × ${P(p[x])}`).join(' + ')} = ${terms.map(n).join(' + ')} = ${n(v)}. Then σ = √${n(v)} = ${dig4(sd)}, which is ${fx(sdr, 2)} to 2 decimal places.`,
   guidance: [
    { prompt: 'What is the mean μ of X?', answer: [mu], explanation: `1 × ${P(p[1])} + 2 × ${P(p[2])} + 3 × ${P(p[3])} + 4 × ${P(p[4])} = ${n(mu)}.` },
    { prompt: `Square the distance of each value from ${n(mu)}. What is (x − ${n(mu)})² for x = 0, 1, 2, 3 and 4?`, answer: sq, explanation: `The distances are ${p.map((_, x) => n(x - mu)).join(', ')}, and their squares are ${sq.map(n).join(', ')}.` },
    { prompt: 'Multiply each squared distance by its probability and add. What is σ²?', answer: [v], explanation: `${terms.map(n).join(' + ')} = ${n(v)}.` },
    { prompt: `What is σ = √${n(v)}, to 2 decimal places?`, answer: [sdr], explanation: `√${n(v)} = ${dig4(sd)}, which rounds to ${n(sdr)}.` }
   ] }; }
 },
 /* 1000 raffle tickets at c credits: 1 wins A, m2 win B, m3 win C. The expected prize (A + m2 B + m3 C) ÷ 1000 has at
    most 2 decimals and is below the price, so the raffle raises money. Not the worked example. */
 q17: {
  canonical: { c: 2, A: 800, m2: 10, B: 40, m3: 50, C: 6 },
  draw: R => { for (;;) { const A = 10 * R.int(20, 150), m2 = R.pick([5, 10, 20]), B = R.int(11, 80), m3 = R.pick([20, 40, 50, 100]), C = R.int(2, 10), c = R.pick([1.5, 2, 2.5, 3, 4, 5]);
   const tot = A + m2 * B + m3 * C; if (tot % 10 || tot / 1000 > c - 0.1 || tot / 1000 < 0.3) continue; return { c, A, m2, B, m3, C }; } },
  build: ({ c, A, m2, B, m3, C }) => { const q1 = 1 / 1000, q2 = m2 / 1000, q3 = m3 / 1000, e1 = A / 1000, e2 = m2 * B / 1000, e3 = m3 * C / 1000, ev = (A + m2 * B + m3 * C) / 1000, net = ev - c; return {
   prompt: `To raise credits for a new scanner, the medical bay sells 1000 raffle tickets at ${n(c)} credits each. One ticket wins ${n(A)} credits, ${n(m2)} tickets win ${n(B)} credits each and ${n(m3)} tickets win ${n(C)} credits each; the rest win nothing. For one ticket, enter the expected net gain in credits (negative for a loss). Then enter the ticket price that would make the expected net gain 0.`,
   answer: [net, ev],
   hints: ['Find the expected prize first: each prize times its probability, where the probability is the number of tickets that win it out of 1000.', 'The net gain is the prize minus the price, and every ticket pays the price, so the expected net gain is the expected prize minus the price.'],
   solution: `The probabilities are 1 ÷ 1000 = 0.001, ${n(m2)} ÷ 1000 = ${n(q2)} and ${n(m3)} ÷ 1000 = ${n(q3)}. The expected prize is ${n(A)} × 0.001 + ${n(B)} × ${n(q2)} + ${n(C)} × ${n(q3)} = ${n(e1)} + ${n(e2)} + ${n(e3)} = ${n(ev)} credits. Every ticket costs ${n(c)} credits whatever it wins, so the expected net gain is ${n(ev)} − ${n(c)} = ${n(net)} ${s(-net, 'credit', 'credits')}: on average a ticket loses ${n(-net)} ${s(-net, 'credit', 'credits')}, and that is what the bay raises. A price of ${n(ev)} credits would make the expected net gain 0, a fair game.`,
   guidance: [
    { prompt: `What is the probability that a ticket wins ${n(A)} credits, ${n(B)} credits and ${n(C)} credits?`, answer: [q1, q2, q3], explanation: `1 ÷ 1000 = 0.001, ${n(m2)} ÷ 1000 = ${n(q2)} and ${n(m3)} ÷ 1000 = ${n(q3)}.` },
    { prompt: 'Multiply each prize by its probability and add. What is the expected prize?', answer: [ev], explanation: `${n(e1)} + ${n(e2)} + ${n(e3)} = ${n(ev)} credits.` },
    { prompt: `Take away the price. What is the expected net gain?`, answer: [net], explanation: `${n(ev)} − ${n(c)} = ${n(net)} credits. It is negative, so buying a ticket loses on average.` }
   ] }; }
 },
 /* A pattern of n = 4 to 8 seeds with k successes (1 ≤ k ≤ n − 1), sprout chance p. The answer is at least 0.001 and
    not on a rounding boundary. Not the worked example (p = 0.9, S, F, S). */
 q18: {
  canonical: { p: 0.8, seq: 'SSFSSF' },
  draw: R => { for (;;) { const p = R.pick([0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9]), len = R.int(4, 8); let seq = ''; for (let i = 0; i < len; i++) seq += R.bool() ? 'S' : 'F';
   const k = seq.split('S').length - 1, x = Math.pow(p, k) * Math.pow(1 - p, len - k); if (k < 1 || k === len || x < 0.001 || edge(x, 4)) continue; return { p, seq }; } },
  build: ({ p, seq }) => { const len = seq.length, k = seq.split('S').length - 1, f = len - k, q = rd(1 - p, 2), x = Math.pow(p, k) * Math.pow(q, f), ans = rd(x, 4), pat = seq.split('').join(', '); return {
   prompt: `In the greenhouse each seed sprouts with probability ${n(p)}, whatever the other seeds do. Mira plants a row of ${n(len)} seeds and wants this exact pattern, seed by seed: ${pat} (S for a seed that sprouts, F for one that fails). Enter the probability of that pattern, to 4 decimal places.`,
   answer: [ans],
   hints: [`Each seed is a trial. A success has probability p = ${n(p)}, and a failure has probability q = 1 − p.`, 'The seeds are independent, so multiply one factor for each seed in the pattern: p for each S and q for each F.'],
   solution: `q = 1 − ${n(p)} = ${n(q)}. The pattern has ${n(k)} ${s(k, 'success', 'successes')} and ${n(f)} ${s(f, 'failure', 'failures')}. The seeds are independent, so its probability is ${seq.split('').map(c => c === 'S' ? n(p) : n(q)).join(' × ')} = ${pw(n(p), k)} × ${pw(n(q), f)}, which is ${fx(ans, 4)} to 4 decimal places.`,
   guidance: [
    { prompt: 'How many successes (S) and how many failures (F) are in the pattern?', answer: [k, f], explanation: `Counting the letters of ${pat}: ${n(k)} S and ${n(f)} F, ${n(len)} seeds in all.` },
    { prompt: 'What is q, the probability that one seed fails?', answer: [q], explanation: `A seed either sprouts or fails, so q = 1 − ${n(p)} = ${n(q)}.` },
    { prompt: `Multiply ${pw(n(p), k)} × ${pw(n(q), f)}. What is it, to 4 decimal places?`, answer: [ans], explanation: `Multiply the powers out, and round only at the end: ${pw(n(p), k)} × ${pw(n(q), f)} is ${fx(ans, 4)} to 4 decimal places.` }
   ] }; }
 },
 /* k sprouts among n seeds, 5 ≤ n ≤ 8, 2 ≤ k ≤ n − 2: orders ending in a sprout (row n − 1, entry k − 1), ending in a
    failure (row n − 1, entry k), and all of them (row n, entry k). Not the worked example (4 seeds, 2 sprouts). */
 q19: {
  canonical: { n: 6, k: 2 },
  draw: R => { let p; do { const N = R.int(4, 8); p = { n: N, k: R.int(2, N - 1) }; } while (p.n === 4 && p.k === 2); return p; },  // not the worked example (2 of 4)
  build: ({ n: N, k }) => { const a = orders(N - 1, k - 1), b = orders(N - 1, k), t = a + b;
   const rows = []; for (let m = 1; m <= N; m++) rows.push(`row ${m}: ${row(m).join(' ')}`);
   const ex1 = 'S, '.repeat(k).concat('F, '.repeat(N - k)).slice(0, -2), ex2 = 'F, '.repeat(N - k).concat('S, '.repeat(k)).slice(0, -2); return {
   prompt: `Mira plants a row of ${n(N)} seeds, and exactly ${n(k)} of them sprout. The pattern could be ${ex1}, or ${ex2}, or many others. Enter the number of orders in which the last seed sprouts, then the number in which the last seed fails, then the total number of orders of ${n(k)} sprouts among ${n(N)} seeds.`,
   answer: [a, b, t],
   hints: [`If the last seed sprouts, the other ${n(k - 1)} ${s(k - 1, 'sprout', 'sprouts')} must fall among the first ${n(N - 1)} seeds. If the last seed fails, all ${n(k)} sprouts fall among those ${n(N - 1)} seeds.`, `Build the triangle of orders down to row ${n(N)}: each row starts and ends with 1, and every other entry is the sum of the two entries above it. Count entries from 0 at the left.`],
   solution: `The triangle of orders: ${rows.join('; ')}. Entry ${n(k - 1)} of row ${n(N - 1)} is ${n(a)}: that many ways to place the other ${n(k - 1)} ${s(k - 1, 'sprout', 'sprouts')} among the first ${n(N - 1)} seeds when the last one sprouts. Entry ${n(k)} of row ${n(N - 1)} is ${n(b)}: the ways to place all ${n(k)} sprouts among the first ${n(N - 1)} seeds when the last one fails. Every order ends one way or the other, so there are ${n(a)} + ${n(b)} = ${n(t)} orders in all, which is entry ${n(k)} of row ${n(N)}.`,
   guidance: [
    { prompt: `Write out the triangle of orders down to row ${n(N - 1)}. What are entry ${n(k - 1)} and entry ${n(k)} of row ${n(N - 1)}?`, answer: [a, b], explanation: `Row ${n(N - 1)} is ${row(N - 1).join(' ')}. Counting from 0, entry ${n(k - 1)} is ${n(a)} (the last seed sprouts) and entry ${n(k)} is ${n(b)} (the last seed fails).` },
    { prompt: 'Every order ends in a sprout or in a failure, never both. How many orders are there in all?', answer: [t], explanation: `${n(a)} + ${n(b)} = ${n(t)}, which is entry ${n(k)} of row ${n(N)}: ${row(N).join(' ')}.` }
   ] }; }
 },
 /* Binomial P(X = k) for 4 ≤ n ≤ 8 seeds, sprout chance p, 1 ≤ k ≤ n − 1. The answer is at least 0.005 and not on a
    rounding boundary. Not the worked example (n = 4, k = 2, p = 0.5). */
 q20: {
  canonical: { n: 5, k: 3, p: 0.7 },
  draw: R => { for (;;) { const N = R.int(4, 8), k = R.int(1, N - 1), p = R.pick([0.2, 0.25, 0.3, 0.4, 0.6, 0.7, 0.75, 0.8, 0.9]);
   const x = orders(N, k) * Math.pow(p, k) * Math.pow(1 - p, N - k); if (x < 0.005 || edge(x, 4)) continue; return { n: N, k, p }; } },
  build: ({ n: N, k, p }) => { const q = rd(1 - p, 2), c = orders(N, k), x = c * Math.pow(p, k) * Math.pow(q, N - k), ans = rd(x, 4); return {
   prompt: `Each seed in a tray sprouts with probability ${n(p)}, independently of the others. Mira plants ${n(N)} seeds, and X is the number that sprout, so X has a binomial distribution. Enter P(X = ${n(k)}), the probability that exactly ${n(k)} of the ${n(N)} seeds ${s(k, 'sprouts', 'sprout')}, to 4 decimal places. Round only at the end, not the powers on the way.`,
   answer: [ans],
   hints: [`Find the number of orders of ${n(k)} ${s(k, 'sprout', 'sprouts')} among ${n(N)} seeds from row ${n(N)} of the triangle of orders.`, `Every one of those orders has the same probability, ${pw('p', k)} × ${pw('q', N - k)}, so multiply that by the number of orders.`],
   solution: `q = 1 − ${n(p)} = ${n(q)}. Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}, and entry ${n(k)} is ${n(c)}, so there are ${n(c)} orders. Each order has probability ${pw(n(p), k)} × ${pw(n(q), N - k)}. So P(X = ${n(k)}) = ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}, which is ${fx(ans, 4)} to 4 decimal places.`,
   guidance: [
    { prompt: `How many orders of ${n(k)} ${s(k, 'sprout', 'sprouts')} among ${n(N)} seeds are there?`, answer: [c], explanation: `Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}; counting from 0, entry ${n(k)} is ${n(c)}.` },
    { prompt: 'What is q, the probability that one seed fails?', answer: [q], explanation: `q = 1 − ${n(p)} = ${n(q)}.` },
    { prompt: `Multiply ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}. What is P(X = ${n(k)}), to 4 decimal places?`, answer: [ans], explanation: `Multiply everything out, and round only at the end: ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)} is ${fx(ans, 4)} to 4 decimal places.` }
   ] }; }
 }
});
})();
