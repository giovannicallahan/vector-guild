/* Probability practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p4.js. */
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
/* Rounding to d places; "x is within a hair of a rounding boundary at d places" (such draws are skipped); "x has at most d decimals". */
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const edge = (x, d) => { const s = x * Math.pow(10, d), f = s - Math.floor(s); return Math.abs(f - 0.5) < 1e-6; };
const exact = (x, d) => { const s = x * Math.pow(10, d); return Math.abs(s - Math.round(s)) < 1e-9; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const red = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
const fx = (x, d) => x.toFixed(d);
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const pw = (base, e) => e === 1 ? base : base + String(e).split('').map(d => SUP[d]).join('');
const row = m => { let r = [1]; for (let i = 0; i < m; i++) { const nx = [1]; for (let j = 1; j < r.length; j++) nx.push(r[j - 1] + r[j]); nx.push(1); r = nx; } return r; };
const orders = (m, j) => row(m)[j];
const cr = x => Math.abs(x) === 1 ? 'credit' : 'credits';
const s = (k, one, many) => k === 1 ? one : many;
/* A value to 4 decimal places as written: exact if it has at most 4, otherwise cut (not rounded) with “…” after it. */
const dig4 = x => { if (Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6) return n(x); const t = Math.trunc(x * 1e4 + Math.sign(x) * 1e-7) / 1e4; return (t < 0 ? '−' : '') + Math.abs(t).toFixed(4) + '…'; };
/* "the first 2 seeds sprout", but "the next seed fails" for one seed. */
const stretch = (where, k, verb) => k === 1 ? `the ${where} seed ${verb}s` : `the ${where} ${n(k)} seeds ${verb}`;
/* count whole hundredths, each between lo and hi, that add up to 100 (a probability table). */
const table = (R, count, lo, hi) => { for (;;) { const p = []; let left = 100; for (let i = 0; i < count - 1; i++) { const v = R.int(lo, hi); p.push(v); left -= v; } if (left >= lo && left <= hi) { p.push(left); return p; } } };
const P = v => n(v / 100);
/* "S, S, F" from "SSF". */
const spell = seq => seq.split('').join(', ');
const cnt = (seq, c) => seq.split(c).length - 1;
const pat = (seq, p, q) => seq.split('').map(c => c === 'S' ? n(p) : n(q)).join(' × ');

/* ---- q16 Variance and standard deviation of a random variable [IS 4.2] ---- */

/* b: X = beds taken, 0 to 3, hundredths 5 to 60; whole mean 1 or 2, so every (x − μ)² is whole and σ² has at most 2 decimals. */
mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'Beds taken overnight',
 brief: 'The medic wants one number for how much the overnight bed count swings, so she knows whether to keep a spare bed made up.',
 labels: ['σ²', 'σ'], tolerance: 0.005,
 gl: [['μ'], ['σ²'], ['σ']]
}, {
 canonical: { p: [15, 35, 35, 15] },
 draw: R => { for (;;) { const p = table(R, 4, 5, 60), m = p.reduce((a, v, x) => a + x * v, 0); if (m % 100) continue; const mu = m / 100, v = p.reduce((a, w, x) => a + (x - mu) * (x - mu) * w, 0) / 100;
  if (mu < 1 || mu > 2 || exact(Math.sqrt(v), 4) || edge(Math.sqrt(v), 2) || p.join() === '25,50,25,0') continue; return { p }; } },
 build: ({ p }) => { const mu = p.reduce((a, v, x) => a + x * v, 0) / 100, sq = p.map((_, x) => (x - mu) * (x - mu)), terms = p.map((v, x) => sq[x] * v / 100), v = terms.reduce((a, t) => a + t, 0), sd = Math.sqrt(v), sdr = rd(sd, 2);
  const list = p.map((w, x) => `P(X = ${x}) = ${P(w)}`).join(', '); return {
  prompt: `X is the number of beds taken in the recovery ward overnight: ${list}. Enter the variance σ² of X, then its standard deviation σ to 2 decimal places.`,
  answer: [v, sdr],
  hints: ['Start with the mean μ: multiply each value of X by its probability and add. Each bed count is then a known distance from it.', 'Square each distance (x − μ), multiply the square by that value’s probability and add them all: that sum is σ². The standard deviation σ is its square root.'],
  solution: `μ = 1 × ${P(p[1])} + 2 × ${P(p[2])} + 3 × ${P(p[3])} = ${n(mu)}. The squared distances (x − μ)² for x = 0, 1, 2, 3 are ${sq.map(n).join(', ')}. So σ² = ${sq.map((q, x) => `${n(q)} × ${P(p[x])}`).join(' + ')} = ${terms.map(n).join(' + ')} = ${n(v)}. Then σ = √${n(v)} = ${dig4(sd)}, which is ${fx(sdr, 2)} to 2 decimal places.`,
  guidance: [
   { prompt: 'What is the mean μ of X?', answer: [mu], explanation: `1 × ${P(p[1])} + 2 × ${P(p[2])} + 3 × ${P(p[3])} = ${n(mu)}.` },
   { prompt: `Square the distance of each value from ${n(mu)}, multiply by its probability and add. What is σ²?`, answer: [v], explanation: `The squared distances are ${sq.map(n).join(', ')}, so σ² = ${terms.map(n).join(' + ')} = ${n(v)}.` },
   { prompt: `What is σ = √${n(v)}, to 2 decimal places?`, answer: [sdr], explanation: `√${n(v)} = ${dig4(sd)}, which rounds to ${n(sdr)}.` }
  ] }; }
});

/* c: X = medics on call, 1 to 5, hundredths 5 to 40; whole mean 2 to 4. Answers σ and μ + σ (μ is whole, so μ + σ rounds with σ). */
mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Medics on call',
 brief: 'The rota office staffs a shift for a busy day, and Mira wants to know how many medics a day one standard deviation above the mean needs.',
 labels: ['σ', 'μ + σ'], tolerance: 0.005,
 gl: [['μ'], ['σ²'], ['σ', 'μ + σ']]
}, {
 canonical: { p: [10, 25, 30, 25, 10] },
 draw: R => { for (;;) { const p = table(R, 5, 5, 40), m = p.reduce((a, v, x) => a + (x + 1) * v, 0); if (m % 100) continue; const mu = m / 100, v = p.reduce((a, w, x) => a + (x + 1 - mu) * (x + 1 - mu) * w, 0) / 100;
  if (mu < 2 || mu > 4 || exact(Math.sqrt(v), 4) || edge(Math.sqrt(v), 2) || p.join() === '10,30,20,30,10' || p.join() === '25,50,25,0,0') continue; return { p }; } },
 build: ({ p }) => { const mu = p.reduce((a, v, x) => a + (x + 1) * v, 0) / 100, sq = p.map((_, x) => (x + 1 - mu) * (x + 1 - mu)), terms = p.map((v, x) => sq[x] * v / 100), v = terms.reduce((a, t) => a + t, 0), sd = Math.sqrt(v), sdr = rd(sd, 2), hi = rd(mu + sd, 2);
  const list = p.map((w, x) => `P(X = ${x + 1}) = ${P(w)}`).join(', '); return {
  prompt: `The rota office counts the medics called in on a shift. X is the number of medics, from 1 to 5: ${list}. The rota is built for a busy shift, one standard deviation above the mean. Enter the standard deviation σ of X to 2 decimal places, then the busy-shift figure μ + σ, also to 2 decimal places.`,
  answer: [sdr, hi],
  hints: ['Find the mean μ first, then the variance σ²: the sum of each squared distance from μ times its probability.', 'The standard deviation σ is the square root of the variance. The busy-shift figure is the mean plus one σ.'],
  solution: `μ = 1 × ${P(p[0])} + 2 × ${P(p[1])} + 3 × ${P(p[2])} + 4 × ${P(p[3])} + 5 × ${P(p[4])} = ${n(mu)}. The squared distances (x − μ)² for x = 1 to 5 are ${sq.map(n).join(', ')}, so σ² = ${sq.map((q, x) => `${n(q)} × ${P(p[x])}`).join(' + ')} = ${terms.map(n).join(' + ')} = ${n(v)}. Then σ = √${n(v)} = ${dig4(sd)}, which is ${fx(sdr, 2)} to 2 decimal places, and μ + σ = ${n(mu)} + ${dig4(sd)} = ${fx(hi, 2)}, to 2 decimal places.`,
  guidance: [
   { prompt: 'What is the mean μ of X?', answer: [mu], explanation: `1 × ${P(p[0])} + 2 × ${P(p[1])} + 3 × ${P(p[2])} + 4 × ${P(p[3])} + 5 × ${P(p[4])} = ${n(mu)}.` },
   { prompt: `Square the distance of each value from ${n(mu)}, multiply by its probability and add. What is σ²?`, answer: [v], explanation: `The squared distances for x = 1 to 5 are ${sq.map(n).join(', ')}, so σ² = ${terms.map(n).join(' + ')} = ${n(v)}.` },
   { prompt: `Take the square root of ${n(v)} to get σ, then add it to μ = ${n(mu)}. What are σ and μ + σ, to 2 decimal places?`, answer: [sdr, hi], explanation: `σ = √${n(v)} = ${dig4(sd)}, which rounds to ${n(sdr)}. Then μ + σ = ${n(mu)} + ${dig4(sd)} = ${n(hi)} to 2 decimal places.` }
  ] }; }
});

/* d: X = cylinders on a trip, 0, 2, 4 or 6, hundredths 5 to 55; the mean has at most 1 decimal, so σ² has at most 4 decimals. */
mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', title: 'Cylinders per trip',
 brief: 'Oxygen cylinders go out to the bay in twos, and the stores clerk wants the mean and the spread of a trip before she sizes the cart.',
 labels: ['μ', 'σ²', 'σ'], tolerance: 0.005,
 gl: [['μ'], ['σ²'], ['σ']]
}, {
 canonical: { p: [10, 40, 35, 15] },
 draw: R => { for (;;) { const p = table(R, 4, 5, 55), S = p.reduce((a, v, j) => a + j * v, 0); if (S % 5) continue; const mu = 2 * S / 100, v = p.reduce((a, w, j) => a + (2 * j - mu) * (2 * j - mu) * w, 0) / 100;
  if (exact(mu, 0) || exact(Math.sqrt(v), 4) || edge(Math.sqrt(v), 2) || !exact(v, 4)) continue; return { p }; } },
 build: ({ p }) => { const xs = [0, 2, 4, 6], mu = p.reduce((a, v, j) => a + xs[j] * v, 0) / 100, sq = xs.map(x => (x - mu) * (x - mu)), terms = p.map((v, j) => sq[j] * v / 100), v = terms.reduce((a, t) => a + t, 0), sd = Math.sqrt(v), sdr = rd(sd, 2);
  const list = p.map((w, j) => `P(X = ${xs[j]}) = ${P(w)}`).join(', '); return {
  prompt: `Oxygen cylinders reach the medical bay in pairs, so X, the number of cylinders on one supply trip, can only be 0, 2, 4 or 6: ${list}. Enter the mean μ, then the variance σ², then the standard deviation σ to 2 decimal places.`,
  answer: [mu, v, sdr],
  hints: ['The values of X are 0, 2, 4 and 6, not 0, 1, 2 and 3: multiply each value itself by its probability to find μ.', 'The mean is not a whole number this time, so the distances x − μ are not whole either. Square each one, weight it by its probability and add to get σ².'],
  solution: `μ = 2 × ${P(p[1])} + 4 × ${P(p[2])} + 6 × ${P(p[3])} = ${n(mu)}. The squared distances (x − μ)² for x = 0, 2, 4, 6 are ${sq.map(n).join(', ')}. So σ² = ${sq.map((q, j) => `${n(q)} × ${P(p[j])}`).join(' + ')} = ${terms.map(n).join(' + ')} = ${n(v)}. Then σ = √${n(v)} = ${dig4(sd)}, which is ${fx(sdr, 2)} to 2 decimal places.`,
  guidance: [
   { prompt: 'What is the mean μ of X? Multiply each value of X, not its position in the list, by its probability.', answer: [mu], explanation: `2 × ${P(p[1])} + 4 × ${P(p[2])} + 6 × ${P(p[3])} = ${n(mu)}.` },
   { prompt: `Square the distance of each value from ${n(mu)}, multiply by its probability and add. What is σ²?`, answer: [v], explanation: `The squared distances for x = 0, 2, 4, 6 are ${sq.map(n).join(', ')}, so σ² = ${terms.map(n).join(' + ')} = ${n(v)}.` },
   { prompt: `What is σ = √${n(v)}, to 2 decimal places?`, answer: [sdr], explanation: `√${n(v)} = ${dig4(sd)}, which rounds to ${n(sdr)}.` }
  ] }; }
});

/* ---- q17 Chapter review: is the game worth playing? [CM 7.11, IS 4.2] ---- */

/* b: a barrel of N envelopes at c credits, a envelopes pay A and b pay B. The expected prize has at most 3 decimals and is below the price. */
mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The lucky-dip barrel',
 brief: 'The bay is filling a barrel of sealed envelopes for the crew to dip into, and Mira needs to know whether a dip is fair.',
 labels: ['expected net gain (credits)', 'fair price (credits)'], tolerance: 0.0005,
 gl: [['P(top prize)', 'P(second prize)'], ['expected prize (credits)'], ['expected net gain (credits)']]
}, {
 canonical: { N: 200, c: 2, a: 2, A: 60, b: 10, B: 5 },
 draw: R => { for (;;) { const N = R.pick([100, 200, 250, 500]), c = R.pick([1, 1.5, 2, 2.5, 3]), a = R.int(1, 4), A = R.int(20, 90), b = R.pick([5, 10, 20, 25]), B = R.int(3, 12), ev = (a * A + b * B) / N;
  if (!exact(ev, 2) || ev > c - 0.1 || ev < 0.3 || (N === 200 && a === 2 && A === 60)) continue; return { N, c, a, A, b, B }; } },
 build: ({ N, c, a, A, b, B }) => { const q1 = a / N, q2 = b / N, e1 = a * A / N, e2 = b * B / N, ev = e1 + e2, net = ev - c; return {
  prompt: `For the crew’s celebration, the bay fills a barrel with ${n(N)} sealed envelopes, to be sold at ${n(c)} ${cr(c)} a dip. ${n(a)} ${s(a, 'envelope holds', 'envelopes hold')} ${n(A)} ${cr(A)}${s(a, '', ' each')}, ${n(b)} hold ${n(B)} ${cr(B)} each, and the rest are empty. For one dip, enter the expected net gain in credits (negative for a loss). Then enter the price per dip that would make the game fair.`,
  answer: [net, ev],
  hints: ['Each prize has a probability: the number of envelopes that hold it out of all the envelopes. Multiply each prize by its probability and add.', 'Every dip pays the price whatever it finds, so the expected net gain is the expected prize minus the price. The fair price makes that 0.'],
  solution: `The probabilities are ${n(a)} ÷ ${n(N)} = ${n(q1)} and ${n(b)} ÷ ${n(N)} = ${n(q2)}. The expected prize is ${n(A)} × ${n(q1)} + ${n(B)} × ${n(q2)} = ${n(e1)} + ${n(e2)} = ${n(ev)} ${cr(ev)}. A dip costs ${n(c)} ${cr(c)}, so the expected net gain is ${n(ev)} − ${n(c)} = ${n(net)} ${cr(net)}. A price of ${n(ev)} ${cr(ev)}, the expected prize, would make the game fair.`,
  guidance: [
   { prompt: `What is the probability that a dip finds ${n(A)} ${cr(A)}, and the probability that it finds ${n(B)} ${cr(B)}?`, answer: [q1, q2], explanation: `${n(a)} ÷ ${n(N)} = ${n(q1)} and ${n(b)} ÷ ${n(N)} = ${n(q2)}.` },
   { prompt: 'Multiply each prize by its probability and add. What is the expected prize?', answer: [ev], explanation: `${n(A)} × ${n(q1)} + ${n(B)} × ${n(q2)} = ${n(e1)} + ${n(e2)} = ${n(ev)} ${cr(ev)}.` },
   { prompt: 'Take away the price. What is the expected net gain?', answer: [net], explanation: `${n(ev)} − ${n(c)} = ${n(net)} ${cr(net)}. The price is above the expected prize, so a dip loses on average and the game is not fair.` }
  ] }; }
});

/* c: M tickets sold over the season at c credits; one top prize per draw of N tickets is not needed: prize chance a/N for A and b/N for B. */
mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'What the season draw raises',
 brief: 'The bay runs a draw all season to pay for a new bed, and the treasurer needs to know how many credits it will really keep.',
 labels: ['expected prize per ticket (credits)', 'credits the bay expects to keep'], tolerance: 0.0005,
 gl: [['P(top prize)', 'P(second prize)'], ['expected prize per ticket (credits)'], ['credits the bay expects to keep']]
}, {
 canonical: { N: 500, c: 2.5, a: 1, A: 300, b: 20, B: 8, M: 3000 },
 draw: R => { for (;;) { const N = R.pick([200, 250, 500, 1000]), c = R.pick([1, 1.5, 2, 2.5, 3, 4]), a = R.int(1, 3), A = 10 * R.int(10, 50), b = R.pick([10, 20, 25, 50]), B = R.int(2, 15), M = R.pick([2000, 3000, 4000, 5000]), ev = (a * A + b * B) / N;
  if (!exact(ev, 2) || ev > c - 0.15 || ev < 0.4 || (N === 500 && a === 1 && A === 300)) continue; return { N, c, a, A, b, B, M }; } },
 build: ({ N, c, a, A, b, B, M }) => { const q1 = a / N, q2 = b / N, ev = (a * A + b * B) / N, keep = c - ev, tot = M * keep; return {
  prompt: `All season the bay sells draw tickets at ${n(c)} ${cr(c)} each, in lots of ${n(N)}. In every lot of ${n(N)} tickets, ${n(a)} ${s(a, 'ticket wins', 'tickets win')} ${n(A)} ${cr(A)}${s(a, '', ' each')} and ${n(b)} win ${n(B)} ${cr(B)} each; the rest win nothing. The bay pays every prize out of its own pocket and expects to sell ${n(M)} tickets over the season. Enter the expected prize per ticket in credits, then the number of credits the bay expects to keep over the season, after paying the prizes (type it without commas).`,
  answer: [ev, tot],
  hints: ['A ticket’s expected prize is each prize times its probability, added up. The probability of a prize is the tickets that win it out of the lot.', 'The bay receives the price of every ticket and pays out the expected prize on average, so it keeps price minus expected prize on each ticket. Multiply by the number of tickets.'],
  solution: `The probabilities are ${n(a)} ÷ ${n(N)} = ${n(q1)} and ${n(b)} ÷ ${n(N)} = ${n(q2)}. The expected prize is ${n(A)} × ${n(q1)} + ${n(B)} × ${n(q2)} = ${n(a * A / N)} + ${n(b * B / N)} = ${n(ev)} ${cr(ev)} a ticket. The bay takes in ${n(c)} ${cr(c)} and expects to pay ${n(ev)}, so it keeps ${n(c)} − ${n(ev)} = ${n(keep)} ${cr(keep)} a ticket. Over ${n(M)} tickets it expects to keep ${n(M)} × ${n(keep)} = ${n(tot)} ${cr(tot)}.`,
  guidance: [
   { prompt: `What is the probability that a ticket wins ${n(A)} ${cr(A)}, and the probability that it wins ${n(B)} ${cr(B)}?`, answer: [q1, q2], explanation: `${n(a)} ÷ ${n(N)} = ${n(q1)} and ${n(b)} ÷ ${n(N)} = ${n(q2)}.` },
   { prompt: 'Multiply each prize by its probability and add. What is the expected prize per ticket?', answer: [ev], explanation: `${n(A)} × ${n(q1)} + ${n(B)} × ${n(q2)} = ${n(a * A / N)} + ${n(b * B / N)} = ${n(ev)} ${cr(ev)}.` },
   { prompt: `The bay keeps the price minus the expected prize on each ticket, ${n(c)} − ${n(ev)}. How many credits is that over ${n(M)} tickets?`, answer: [tot], explanation: `${n(c)} − ${n(ev)} = ${n(keep)} ${cr(keep)} a ticket, and ${n(M)} × ${n(keep)} = ${n(tot)} ${cr(tot)}.` }
  ] }; }
});

/* d: a prize wheel. P(nothing) is the missing probability of the table (q14); prizes whole credits, probabilities whole hundredths, so ev has at most 2 decimals. */
mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q14', title: 'The prize wheel',
 brief: 'A prize wheel at the bay fair lists its prizes but not the chance of a blank, and Mira wants to know whether a spin is worth the price.',
 labels: ['P(nothing)', 'expected net gain (credits)', 'fair price (credits)'], tolerance: 0.0005,
 gl: [['P(nothing)'], ['expected prize (credits)'], ['expected net gain (credits)', 'fair price (credits)']]
}, {
 canonical: { c: 2, pa: 5, A: 20, pb: 15, B: 5, pc: 25, C: 2 },
 draw: R => { for (;;) { const c = R.pick([1, 1.5, 2, 2.5, 3, 4]), pa = R.int(2, 10), pb = R.int(8, 25), pc = R.int(15, 35), A = R.int(15, 60), B = R.int(4, 12), C = R.int(1, 3), ev = (pa * A + pb * B + pc * C) / 100;
  if (ev > c - 0.1 || ev < 0.4 || (pa === 5 && A === 20 && pb === 15)) continue; return { c, pa, A, pb, B, pc, C }; } },
 build: ({ c, pa, A, pb, B, pc, C }) => { const pn = 100 - pa - pb - pc, ea = pa * A / 100, eb = pb * B / 100, ec = pc * C / 100, ev = ea + eb + ec, net = ev - c; return {
  prompt: `A spin of the prize wheel at the bay fair costs ${n(c)} ${cr(c)}. The wheel pays ${n(A)} ${cr(A)} with probability ${P(pa)}, ${n(B)} ${cr(B)} with probability ${P(pb)} and ${n(C)} ${s(C, 'credit', 'credits')} with probability ${P(pc)}. Otherwise it pays nothing. Enter P(nothing), then the expected net gain of one spin in credits (negative for a loss), then the price per spin that would make the expected net gain 0.`,
  answer: [pn / 100, net, ev],
  hints: ['The probabilities of every way the wheel can stop add up to 1, so P(nothing) is 1 minus the three given probabilities.', 'The expected prize is each prize times its probability, added; a nothing adds 0. Take the price from it for the net gain. The fair price is the expected prize itself.'],
  solution: `P(nothing) = 1 − ${P(pa)} − ${P(pb)} − ${P(pc)} = ${P(pn)}. The expected prize is ${n(A)} × ${P(pa)} + ${n(B)} × ${P(pb)} + ${n(C)} × ${P(pc)} = ${n(ea)} + ${n(eb)} + ${n(ec)} = ${n(ev)} ${cr(ev)}, and “nothing” adds 0. A spin costs ${n(c)} ${cr(c)}, so the expected net gain is ${n(ev)} − ${n(c)} = ${n(net)} ${cr(net)}. The fair price is the expected prize, ${n(ev)} ${cr(ev)}.`,
  guidance: [
   { prompt: `The four ways the wheel can stop have probabilities that add to 1. What is P(nothing), given ${P(pa)}, ${P(pb)} and ${P(pc)} for the three prizes?`, answer: [pn / 100], explanation: `1 − ${P(pa)} − ${P(pb)} − ${P(pc)} = ${P(pn)}.` },
   { prompt: 'Multiply each prize by its probability and add. What is the expected prize?', answer: [ev], explanation: `${n(A)} × ${P(pa)} + ${n(B)} × ${P(pb)} + ${n(C)} × ${P(pc)} = ${n(ea)} + ${n(eb)} + ${n(ec)} = ${n(ev)} ${cr(ev)}.` },
   { prompt: `Take away the price of ${n(c)} ${cr(c)} to get the expected net gain, and say which price would make it 0.`, answer: [net, ev], explanation: `${n(ev)} − ${n(c)} = ${n(net)} ${cr(net)}. The price that makes the expected net gain 0 is the expected prize, ${n(ev)} ${cr(ev)}.` }
  ] }; }
});

/* ---- q18 Repeated independent trials: one particular sequence [IS 4.3] ---- */

/* b: a row of 4 to 8 sensors, pattern of S and F; the answer is at least 0.001 and not on a rounding boundary. */
mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'A row of soil sensors',
 brief: 'Mira is checking the soil sensors along a bench, and she wants the chance of one exact pattern of working and silent ones.',
 labels: ['P(pattern)'], tolerance: 0.00005,
 gl: [['successes', 'failures'], ['q'], ['P(pattern)']]
}, {
 canonical: { p: 0.9, seq: 'SFSSSF' },
 draw: R => { for (;;) { const p = R.pick([0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95]), len = R.int(4, 8); let seq = ''; for (let i = 0; i < len; i++) seq += R.bool() ? 'S' : 'F';
  const k = cnt(seq, 'S'), x = Math.pow(p, k) * Math.pow(1 - p, len - k); if (k < 1 || k === len || x < 0.001 || edge(x, 4) || (p === 0.8 && seq === 'SSFSSF')) continue; return { p, seq }; } },
 build: ({ p, seq }) => { const len = seq.length, k = cnt(seq, 'S'), f = len - k, q = rd(1 - p, 2), x = Math.pow(p, k) * Math.pow(q, f), ans = rd(x, 4); return {
  prompt: `Each soil sensor on a greenhouse bench reports its reading with probability ${n(p)}, whatever the other sensors do. Mira checks a row of ${n(len)} sensors and wants this exact pattern, sensor by sensor: ${spell(seq)} (S for a sensor that reports, F for one that stays silent). Enter the probability of that pattern, to 4 decimal places.`,
  answer: [ans],
  hints: [`Each sensor is a trial. A success has probability p = ${n(p)}, and a failure has probability q = 1 − p.`, 'The sensors are independent, so multiply one factor for each sensor in the pattern: p for each S and q for each F.'],
  solution: `q = 1 − ${n(p)} = ${n(q)}. The pattern has ${n(k)} ${s(k, 'success', 'successes')} and ${n(f)} ${s(f, 'failure', 'failures')}. The sensors are independent, so its probability is ${pat(seq, p, q)} = ${pw(n(p), k)} × ${pw(n(q), f)}, which is ${fx(ans, 4)} to 4 decimal places.`,
  guidance: [
   { prompt: 'How many successes (S) and how many failures (F) are in the pattern?', answer: [k, f], explanation: `Counting the letters of ${spell(seq)}: ${n(k)} S and ${n(f)} F, ${n(len)} sensors in all.` },
   { prompt: 'What is q, the probability that one sensor stays silent?', answer: [q], explanation: `A sensor either reports or stays silent, so q = 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Multiply ${pw(n(p), k)} × ${pw(n(q), f)}. What is it, to 4 decimal places?`, answer: [ans], explanation: `Multiply the powers out, and round only at the end: ${pw(n(p), k)} × ${pw(n(q), f)} is ${fx(ans, 4)} to 4 decimal places.` }
  ] }; }
});

/* c: two batches of 3 seeds with different sprout chances (one decimal), each batch a pattern of S and F. Batch factors are exact to 3 decimals (so no 0.95, whose 0.05 × 0.95 × 0.95 = 0.045125 has 6). */
mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Old stock, new stock',
 brief: 'Half a seed row is old stock and half is new, and Mira wants the chance of one exact pattern across the whole row.',
 labels: ['P(whole pattern)'], tolerance: 0.00005,
 gl: [['P(old-stock pattern)'], ['P(new-stock pattern)'], ['P(whole pattern)']]
}, {
 canonical: { p1: 0.6, s1: 'SSF', p2: 0.9, s2: 'FSS' },
 draw: R => { for (;;) { const p1 = R.pick([0.5, 0.6, 0.7, 0.8]), p2 = R.pick([0.8, 0.9].filter(v => v !== p1)), g = () => { let t = ''; for (let i = 0; i < 3; i++) t += R.bool() ? 'S' : 'F'; return t; }, s1 = g(), s2 = g();
  const a = Math.pow(p1, cnt(s1, 'S')) * Math.pow(1 - p1, cnt(s1, 'F')), b = Math.pow(p2, cnt(s2, 'S')) * Math.pow(1 - p2, cnt(s2, 'F')), x = a * b;
  if (cnt(s1, 'S') + cnt(s2, 'S') === 0 || cnt(s1, 'F') + cnt(s2, 'F') === 0 || x < 0.001 || edge(x, 4) || (p1 === 0.6 && p2 === 0.9 && s1 === 'SSF' && s2 === 'FSS')) continue; return { p1, s1, p2, s2 }; } },
 build: ({ p1, s1, p2, s2 }) => { const q1 = rd(1 - p1, 2), q2 = rd(1 - p2, 2), a = rd(Math.pow(p1, cnt(s1, 'S')) * Math.pow(q1, cnt(s1, 'F')), 4), b = rd(Math.pow(p2, cnt(s2, 'S')) * Math.pow(q2, cnt(s2, 'F')), 4), x = Math.pow(p1, cnt(s1, 'S')) * Math.pow(q1, cnt(s1, 'F')) * Math.pow(p2, cnt(s2, 'S')) * Math.pow(q2, cnt(s2, 'F')), ans = rd(x, 4); return {
  prompt: `Mira plants a row of 6 seeds. The first 3 are old stock, and each sprouts with probability ${n(p1)}. The last 3 are new stock, and each sprouts with probability ${n(p2)}. Every seed acts independently. She wants this exact pattern, seed by seed: ${spell(s1 + s2)} (S for a seed that sprouts, F for one that fails). Enter the probability of the whole pattern, to 4 decimal places.`,
  answer: [ans],
  hints: ['The old-stock seeds use p = ' + n(p1) + ' for every S and q = 1 − p for every F, and the new-stock seeds do the same with their own p. Find the probability of each half of the pattern.', 'The two halves are independent, so multiply their two probabilities together.'],
  solution: `Old stock: q = 1 − ${n(p1)} = ${n(q1)}, and the pattern ${spell(s1)} has probability ${pat(s1, p1, q1)} = ${n(a)}. New stock: q = 1 − ${n(p2)} = ${n(q2)}, and the pattern ${spell(s2)} has probability ${pat(s2, p2, q2)} = ${n(b)}. The seeds are independent, so the whole pattern has probability ${n(a)} × ${n(b)}, which is ${fx(ans, 4)} to 4 decimal places.`,
  guidance: [
   { prompt: `Multiply one factor for each old-stock seed in ${spell(s1)}: p = ${n(p1)} for an S and q = ${n(q1)} for an F. What is the probability of this half of the pattern?`, answer: [a], explanation: `${pat(s1, p1, q1)} = ${n(a)}.` },
   { prompt: `Do the same for the new-stock seeds in ${spell(s2)}, with p = ${n(p2)} and q = ${n(q2)}. What is the probability of this half?`, answer: [b], explanation: `${pat(s2, p2, q2)} = ${n(b)}.` },
   { prompt: `The two halves are independent. Multiply ${n(a)} × ${n(b)}. What is the probability of the whole pattern, to 4 decimal places?`, answer: [ans], explanation: `Multiply, and round only at the end: ${n(a)} × ${n(b)} is ${fx(ans, 4)} to 4 decimal places.` }
  ] }; }
});

/* d: the pattern is given in words: the first a sprout, the next b fail, the last c sprout (a + b + c at most 8); p to 2 decimals. The answer and its complement are not on a rounding boundary. */
mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q03', title: 'Anything but that row',
 brief: 'The bench is described in words rather than letters, and Mira wants both the chance of the exact row and the chance of any other row.',
 labels: ['P(exact row)', 'P(any other row)'], tolerance: 0.00005,
 gl: [['successes', 'failures'], ['P(exact row)'], ['P(any other row)']]
}, {
 canonical: { p: 0.65, a: 3, b: 2, c: 2 },
 draw: R => { for (;;) { const p = R.pick([0.35, 0.45, 0.55, 0.65, 0.85, 0.95]), a = R.int(1, 4), b = R.int(1, 3), c = R.int(1, 3), len = a + b + c; if (len < 5 || len > 8) continue; const x = Math.pow(p, a + c) * Math.pow(1 - p, b);
  if (x < 0.001 || edge(x, 4) || (p === 0.65 && a === 3 && b === 2)) continue; return { p, a, b, c }; } },
 build: ({ p, a, b, c }) => { const len = a + b + c, k = a + c, q = rd(1 - p, 2), x = Math.pow(p, k) * Math.pow(q, b), ans = rd(x, 4), other = rd(1 - x, 4); return {
  prompt: `Each seed in a tray sprouts with probability ${n(p)}, independently of the others. Mira plants a row of ${n(len)} seeds. She hopes that ${stretch('first', a, 'sprout')}, ${stretch('next', b, 'fail')} and ${stretch('last', c, 'sprout')}. Enter the probability of exactly that row, to 4 decimal places. Then enter the probability that the row comes out in any other way, also to 4 decimal places.`,
  answer: [ans, other],
  hints: [`Write the row as letters first: ${n(a)} ${s(a, 'S', 'S’s')}, then ${n(b)} ${s(b, 'F', 'F’s')}, then ${n(c)} ${s(c, 'S', 'S’s')}. Count the successes and the failures, and use p for each success and q for each failure.`, 'The row either comes out exactly that way or it does not, so the chance of any other row is the complement: 1 minus the probability of the exact row.'],
  solution: `The row is ${spell('S'.repeat(a) + 'F'.repeat(b) + 'S'.repeat(c))}: ${n(k)} successes and ${n(b)} ${s(b, 'failure', 'failures')}. q = 1 − ${n(p)} = ${n(q)}. By independence the probability of that exact row is ${pw(n(p), k)} × ${pw(n(q), b)}, which is ${fx(ans, 4)} to 4 decimal places. The chance of any other row is the complement, 1 − ${dig4(x)} = ${fx(other, 4)} to 4 decimal places.`,
  guidance: [
   { prompt: `Write the row as letters: ${n(a)} S, then ${n(b)} F, then ${n(c)} S. How many successes and how many failures does it contain?`, answer: [k, b], explanation: `${n(a)} + ${n(c)} = ${n(k)} successes and ${n(b)} ${s(b, 'failure', 'failures')}, ${n(len)} seeds in all.` },
   { prompt: `With q = ${n(q)}, multiply ${pw(n(p), k)} × ${pw(n(q), b)}. What is the probability of exactly that row, to 4 decimal places?`, answer: [ans], explanation: `${pw(n(p), k)} × ${pw(n(q), b)} is ${fx(ans, 4)} to 4 decimal places.` },
   { prompt: 'Any other row is the complement of the exact row. What is 1 minus the probability of the exact row, to 4 decimal places? Use the unrounded product if you can.', answer: [other], explanation: `1 − ${dig4(x)} = ${fx(other, 4)} to 4 decimal places.` }
  ] }; }
});

/* ---- q19 How many orders: where the successes can fall [IS 4.3, CM 7.10] ---- */

/* b: pots on a shelf, exactly k cracked, 5 ≤ n ≤ 8, 2 ≤ k ≤ n − 2: the first pot cracked, the first pot sound, all. */
mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'Cracked pots on the shelf',
 brief: 'A shelf of seedling pots has cracked in the cold, and Mira wants to know how many different shelves could show the same damage.',
 labels: ['orders with the first pot cracked', 'orders with the first pot sound', 'orders in all'], tolerance: 0.01,
 gl: [['orders with the first pot cracked', 'orders with the first pot sound'], ['orders in all']]
}, {
 canonical: { n: 7, k: 3 },
 draw: R => { let p; do { const N = R.int(4, 8); p = { n: N, k: R.int(2, N - 1) }; } while (p.n === 4 && p.k === 2); return p; },  // not the worked example (2 of 4)
 build: ({ n: N, k }) => { const a = orders(N - 1, k - 1), b = orders(N - 1, k), t = a + b, rows = []; for (let m = 1; m <= N; m++) rows.push(`row ${m}: ${row(m).join(' ')}`);
  const ex1 = 'C, '.repeat(k).concat('G, '.repeat(N - k)).slice(0, -2), ex2 = 'G, '.repeat(N - k).concat('C, '.repeat(k)).slice(0, -2); return {
  prompt: `A greenhouse shelf holds a row of ${n(N)} seedling pots, and exactly ${n(k)} of them have cracked in the cold. Reading along the shelf, the cracks could be ${ex1} (C for a cracked pot, G for a good one), or ${ex2}, or many others. Enter the number of orders in which the first pot is cracked, then the number in which the first pot is good, then the total number of orders of ${n(k)} cracked pots among ${n(N)}.`,
  answer: [a, b, t],
  hints: [`If the first pot is cracked, the other ${n(k - 1)} cracked ${s(k - 1, 'pot', 'pots')} must fall among the last ${n(N - 1)} pots. If the first pot is good, all ${n(k)} fall among those ${n(N - 1)}.`, `Build the triangle of orders down to row ${n(N)}: each row starts and ends with 1, and every other entry is the sum of the two entries above it. Count entries from 0 at the left.`],
  solution: `The triangle of orders: ${rows.join('; ')}. Entry ${n(k - 1)} of row ${n(N - 1)} is ${n(a)}: that many ways to place the other ${n(k - 1)} cracked ${s(k - 1, 'pot', 'pots')} among the last ${n(N - 1)} when the first pot is cracked. Entry ${n(k)} of row ${n(N - 1)} is ${n(b)}: the ways to place all ${n(k)} among the last ${n(N - 1)} when the first pot is good. Every order starts one way or the other, so there are ${n(a)} + ${n(b)} = ${n(t)} orders in all, which is entry ${n(k)} of row ${n(N)}.`,
  guidance: [
   { prompt: `Write out the triangle of orders down to row ${n(N - 1)}. What are entry ${n(k - 1)} and entry ${n(k)} of row ${n(N - 1)}?`, answer: [a, b], explanation: `Row ${n(N - 1)} is ${row(N - 1).join(' ')}. Counting from 0, entry ${n(k - 1)} is ${n(a)} (the first pot is cracked) and entry ${n(k)} is ${n(b)} (the first pot is good).` },
   { prompt: 'Every order has a cracked first pot or a good one, never both. How many orders are there in all?', answer: [t], explanation: `${n(a)} + ${n(b)} = ${n(t)}, which is entry ${n(k)} of row ${n(N)}: ${row(N).join(' ')}.` }
  ] }; }
});

/* c: n cells, exactly k sprouts; all orders, orders with the first cell sprouting, and with the first sprouting and the last failing. */
mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'Marking the seed cells',
 brief: 'Mira is marking up a tray of seed cells and wants to know how many layouts fit what she already knows about the first and last cell.',
 labels: ['orders in all', 'orders with the first cell sprouting', 'orders with the first sprouting and the last failing'], tolerance: 0.01,
 gl: [['orders in all'], ['orders with the first cell sprouting'], ['orders with the first sprouting and the last failing']]
}, {
 canonical: { n: 6, k: 3 },
 draw: R => { let p; do { const N = R.int(4, 8); p = { n: N, k: R.int(2, N - 1) }; } while (p.n === 4 && p.k === 2); return p; },  // not the worked example (2 of 4)
 build: ({ n: N, k }) => { const t = orders(N, k), a = orders(N - 1, k - 1), b = orders(N - 2, k - 1); return {
  prompt: `A seed tray has a row of ${n(N)} cells, and exactly ${n(k)} of them will sprout. Mira already knows that the first cell sprouts and that the last cell fails. Enter the number of orders of ${n(k)} sprouts among ${n(N)} cells with no other information. Then enter the number of orders in which the first cell sprouts. Then enter the number of orders in which the first cell sprouts and the last cell fails.`,
  answer: [t, a, b],
  hints: [`Build the triangle of orders down to row ${n(N)}. The number of orders of ${n(k)} among ${n(N)} is entry ${n(k)} of row ${n(N)}, counting from 0.`, `Once a cell is fixed, it is out of the count: fix the first cell as a sprout and ${k === 2 ? 'the other sprout falls' : `the other ${n(k - 1)} fall`} among the ${n(N - 1)} cells left. Fix the last cell too and ${k === 2 ? 'it falls' : 'they fall'} among the ${n(N - 2)} in the middle.`],
  solution: `Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}, so there are ${n(t)} orders of ${n(k)} sprouts among ${n(N)} cells (entry ${n(k)}). If the first cell sprouts, ${k === 2 ? 'the other sprout falls' : `the other ${n(k - 1)} sprouts fall`} among the remaining ${n(N - 1)} cells: entry ${n(k - 1)} of row ${n(N - 1)} (${row(N - 1).join(' ')}), which is ${n(a)}. If the last cell fails as well, ${k === 2 ? 'that sprout falls' : `those ${n(k - 1)} fall`} among the ${n(N - 2)} middle cells: entry ${n(k - 1)} of row ${n(N - 2)} (${row(N - 2).join(' ')}), which is ${n(b)}.`,
  guidance: [
   { prompt: `Write out the triangle of orders down to row ${n(N)}. What is entry ${n(k)} of row ${n(N)}?`, answer: [t], explanation: `Row ${n(N)} is ${row(N).join(' ')}. Counting from 0, entry ${n(k)} is ${n(t)}.` },
   { prompt: `Fix the first cell as a sprout. ${k === 2 ? 'The other sprout falls' : `The other ${n(k - 1)} sprouts fall`} among the remaining ${n(N - 1)} cells. What is entry ${n(k - 1)} of row ${n(N - 1)}?`, answer: [a], explanation: `Row ${n(N - 1)} is ${row(N - 1).join(' ')}, and entry ${n(k - 1)} is ${n(a)}.` },
   { prompt: `Fix the last cell as a failure too. ${k === 2 ? 'That sprout falls' : `The ${n(k - 1)} sprouts fall`} among the ${n(N - 2)} middle cells. What is entry ${n(k - 1)} of row ${n(N - 2)}?`, answer: [b], explanation: `Row ${n(N - 2)} is ${row(N - 2).join(' ')}, and entry ${n(k - 1)} is ${n(b)}.` }
  ] }; }
});

/* d: a fair tray, every pattern of S and F equally likely: 7 ≤ n ≤ 9, 2 ≤ k ≤ n − 2. Orders, all patterns 2^n, then P(k sprouts) in lowest terms. */
mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q04', title: 'The fair tray',
 brief: 'In a test tray every seed is as likely to sprout as to fail, and Mira wants the chance of a given head-count as a plain fraction.',
 labels: ['orders of k sprouts', 'patterns in all', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['orders of k sprouts'], ['patterns in all'], ['numerator', 'denominator']]
}, {
 canonical: { n: 8, k: 3 },
 draw: R => { const N = R.int(7, 9); return { n: N, k: R.int(2, N - 2) }; },
 build: ({ n: N, k }) => { const c = orders(N, k), tot = Math.pow(2, N), [pn, pd] = red(c, tot), rows = row(N); return {
  prompt: `In a test tray every seed is exactly as likely to sprout as to fail, so every pattern of S and F down a row of ${n(N)} seeds is equally likely. Enter the number of orders in which exactly ${n(k)} seeds sprout. Then enter the number of different patterns of S and F the row can show in all: each seed adds a choice of two, as in a tree. Then enter the probability that exactly ${n(k)} seeds sprout, as a fraction in lowest terms: numerator, then denominator.`,
  answer: [c, tot, pn, pd],
  hints: [`Build the triangle of orders down to row ${n(N)}. The orders of ${n(k)} successes among ${n(N)} trials make up entry ${n(k)} of that row, counting from 0.`, 'Each seed doubles the number of patterns, as each stage of a tree multiplies the branches. With equally likely patterns, the probability is the orders over all the patterns; then divide top and bottom by their biggest common factor.'],
  solution: `Row ${n(N)} of the triangle of orders is ${rows.join(' ')}, and entry ${n(k)} is ${n(c)}, so there are ${n(c)} orders. Each of the ${n(N)} seeds has 2 outcomes, so the row can show 2 × 2 × … (${n(N)} times) = ${n(tot)} patterns. All are equally likely, so P(exactly ${n(k)} sprout) = ${n(c)}/${n(tot)}${gcd(c, tot) > 1 ? `. Both divide by ${n(gcd(c, tot))}, so in lowest terms it is ${n(pn)}/${n(pd)}` : ', which is already in lowest terms'}.`,
  guidance: [
   { prompt: `Write out the triangle of orders down to row ${n(N)}. What is entry ${n(k)} of row ${n(N)}?`, answer: [c], explanation: `Row ${n(N)} is ${rows.join(' ')}. Counting from 0, entry ${n(k)} is ${n(c)}.` },
   { prompt: `Each of the ${n(N)} seeds can sprout or fail. How many patterns of S and F are there in all?`, answer: [tot], explanation: `Each seed doubles the count: 2 multiplied by itself ${n(N)} times is ${n(tot)}.` },
   { prompt: `Write the probability ${n(c)}/${n(tot)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [pn, pd], explanation: gcd(c, tot) > 1 ? `Dividing top and bottom by ${n(gcd(c, tot))} gives ${n(pn)}/${n(pd)}.` : `${n(c)} and ${n(tot)} have no common factor above 1, so ${n(c)}/${n(tot)} stays as it is.` }
  ] }; }
});

/* ---- q20 The binomial probability P(X = k) [IS 4.3, CM 7.10] ---- */

/* b: irrigation valves, 4 ≤ n ≤ 8, 1 ≤ k ≤ n − 1; the answer is at least 0.005 and not on a rounding boundary. */
mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Valves that open',
 brief: 'The watering lines only run if enough valves open on the first signal, and Mira needs the chance of an exact count.',
 labels: ['P(X = k)'], tolerance: 0.00005,
 gl: [['number of orders'], ['q'], ['P(X = k)']]
}, {
 canonical: { n: 6, k: 4, p: 0.8 },
 draw: R => { for (;;) { const N = R.int(4, 8), k = R.int(1, N - 1), p = R.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]), x = orders(N, k) * Math.pow(p, k) * Math.pow(1 - p, N - k);
  if (x < 0.005 || edge(x, 4) || (N === 5 && k === 3 && p === 0.7)) continue; return { n: N, k, p }; } },
 build: ({ n: N, k, p }) => { const q = rd(1 - p, 2), c = orders(N, k), x = c * Math.pow(p, k) * Math.pow(q, N - k), ans = rd(x, 4); return {
  prompt: `A watering line has ${n(N)} valves in a row. Each valve opens on the first signal with probability ${n(p)}, independently of the others. X is the number of valves that open, so X has a binomial distribution. Enter P(X = ${n(k)}), the probability that exactly ${n(k)} of the ${n(N)} valves ${s(k, 'opens', 'open')}, to 4 decimal places. Round only at the end, not the powers on the way.`,
  answer: [ans],
  hints: [`Find the number of orders of ${n(k)} ${s(k, 'success', 'successes')} among ${n(N)} valves from row ${n(N)} of the triangle of orders.`, `Every one of those orders has the same probability, ${pw('p', k)} × ${pw('q', N - k)}, so multiply that by the number of orders.`],
  solution: `q = 1 − ${n(p)} = ${n(q)}. Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}, and entry ${n(k)} is ${n(c)}, so there are ${n(c)} orders. Each order has probability ${pw(n(p), k)} × ${pw(n(q), N - k)}. So P(X = ${n(k)}) = ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}, which is ${fx(ans, 4)} to 4 decimal places.`,
  guidance: [
   { prompt: `How many orders of ${n(k)} ${s(k, 'valve', 'valves')} opening among ${n(N)} valves are there?`, answer: [c], explanation: `Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}; counting from 0, entry ${n(k)} is ${n(c)}.` },
   { prompt: 'What is q, the probability that one valve stays shut?', answer: [q], explanation: `q = 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Multiply ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}. What is P(X = ${n(k)}), to 4 decimal places?`, answer: [ans], explanation: `Multiply everything out, and round only at the end: ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)} is ${fx(ans, 4)} to 4 decimal places.` }
  ] }; }
});

/* c: T trays; P(X = k) for one tray, then the expected number of trays with exactly k. The two ways of rounding the expected count agree,
   and neither sits on a halfway point at 1 decimal place (100 × 0.3125 = 31.25 would round either way). */
mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Trays that hit the target',
 brief: 'The greenhouse sows a whole season of trays, and Mira wants to know how many will give exactly the number of seedlings she asked for.',
 labels: ['P(X = k)', 'expected trays'], tolerance: 0.00005,
 gl: [['number of orders', 'q'], ['P(X = k)'], ['expected trays']]
}, {
 canonical: { n: 6, k: 4, p: 0.75, T: 100 },
 draw: R => { for (;;) { const N = R.int(4, 8), k = R.int(2, N - 1), p = R.pick([0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9]), T = R.pick([50, 100, 150, 200]), x = orders(N, k) * Math.pow(p, k) * Math.pow(1 - p, N - k);
  if (x < 0.05 || edge(x, 4) || edge(T * x, 1) || edge(T * rd(x, 4), 1) || rd(T * x, 1) !== rd(T * rd(x, 4), 1) || (N === 6 && k === 4 && p === 0.75 && T === 100)) continue; return { n: N, k, p, T }; } },
 build: ({ n: N, k, p, T }) => { const q = rd(1 - p, 2), c = orders(N, k), x = c * Math.pow(p, k) * Math.pow(q, N - k), ans = rd(x, 4), e = rd(T * x, 1); return {
  prompt: `Mira sows seed trays of ${n(N)} seeds each. Every seed sprouts with probability ${n(p)}, independently of the others, and X is the number of seeds in a tray that sprout. She needs trays with exactly ${n(k)} sprouts, and the season has ${n(T)} trays in all. Enter P(X = ${n(k)}) for one tray to 4 decimal places, then the number of the ${n(T)} trays you expect to have exactly ${n(k)} sprouts, to 1 decimal place. Round only at the end, not the powers on the way.`,
  answer: [ans, e],
  hints: [`Find P(X = ${n(k)}) for one tray first: the number of orders from row ${n(N)} of the triangle of orders, times ${pw('p', k)} × ${pw('q', N - k)}.`, 'Over many trays, the expected number with that count is the number of trays times the probability for one tray.'],
  solution: `q = 1 − ${n(p)} = ${n(q)}. Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}, and entry ${n(k)} is ${n(c)}. So P(X = ${n(k)}) = ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)} = ${fx(ans, 4)} to 4 decimal places. Out of ${n(T)} trays you expect ${n(T)} × ${n(ans)} = ${n(rd(T * ans, 4))} trays with exactly ${n(k)} sprouts${rd(T * ans, 4) === e ? '' : `, which is ${fx(e, 1)} to 1 decimal place`}.`,
  guidance: [
   { prompt: `How many orders of ${n(k)} sprouts among ${n(N)} seeds are there, and what is q, the probability that one seed fails?`, answer: [c, q], explanation: `Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}; counting from 0, entry ${n(k)} is ${n(c)}. And q = 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Multiply ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}. What is P(X = ${n(k)}), to 4 decimal places?`, answer: [ans], explanation: `Multiply everything out, and round only at the end: ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)} is ${fx(ans, 4)} to 4 decimal places.` },
   { prompt: `Multiply the number of trays by the probability for one tray. What is ${n(T)} × ${n(ans)}, to 1 decimal place?`, answer: [e], explanation: `${n(T)} × ${n(ans)} = ${n(rd(T * ans, 4))}${rd(T * ans, 4) === e ? '' : `, which is ${fx(e, 1)} to 1 decimal place`}.` }
  ] }; }
});

/* d: harder numbers (p to 2 places, n from 6 to 8), and the complement: P(X = k) and P(X is not k). Neither answer is on a rounding boundary. */
mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q03', title: 'Anything but the target',
 brief: 'A tray passes inspection only when it gives exactly the target count, and Mira wants the chance that a tray misses it either way.',
 labels: ['P(X = k)', 'P(X is not k)'], tolerance: 0.00005,
 gl: [['number of orders', 'q'], ['P(X = k)'], ['P(X is not k)']]
}, {
 canonical: { n: 8, k: 5, p: 0.65 },
 draw: R => { for (;;) { const N = R.int(6, 8), k = R.int(2, N - 2), p = R.pick([0.15, 0.35, 0.45, 0.55, 0.65, 0.85]), x = orders(N, k) * Math.pow(p, k) * Math.pow(1 - p, N - k);
  if (x < 0.01 || x > 0.4 || edge(x, 4) || (N === 5 && k === 3)) continue; return { n: N, k, p }; } },
 build: ({ n: N, k, p }) => { const q = rd(1 - p, 2), c = orders(N, k), x = c * Math.pow(p, k) * Math.pow(q, N - k), ans = rd(x, 4), other = rd(1 - x, 4); return {
  prompt: `A tray of ${n(N)} seeds passes inspection only if exactly ${n(k)} of them sprout. Each seed sprouts with probability ${n(p)}, independently of the others, and X is the number that sprout. Enter P(X = ${n(k)}), the chance the tray passes, to 4 decimal places. Then enter the chance that the tray fails inspection, which is the chance that X is any other number, also to 4 decimal places. Round only at the end, not the powers on the way.`,
  answer: [ans, other],
  hints: [`Find the orders of ${n(k)} successes among ${n(N)} seeds from row ${n(N)} of the triangle of orders. Multiply by ${pw('p', k)} × ${pw('q', N - k)}, with q = 1 − p.`, 'The tray either passes or fails, so the chance of failing is the complement: 1 minus the chance of passing.'],
  solution: `q = 1 − ${n(p)} = ${n(q)}. Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}, and entry ${n(k)} is ${n(c)}. So P(X = ${n(k)}) = ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}, which is ${fx(ans, 4)} to 4 decimal places. A tray that does not pass has X equal to any other number, so the chance is the complement, 1 − ${dig4(x)} = ${fx(other, 4)} to 4 decimal places.`,
  guidance: [
   { prompt: `How many orders of ${n(k)} sprouts among ${n(N)} seeds are there, and what is q, the probability that one seed fails?`, answer: [c, q], explanation: `Row ${n(N)} of the triangle of orders is ${row(N).join(' ')}; counting from 0, entry ${n(k)} is ${n(c)}. And q = 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Multiply ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)}. What is P(X = ${n(k)}), to 4 decimal places?`, answer: [ans], explanation: `Multiply everything out, and round only at the end: ${n(c)} × ${pw(n(p), k)} × ${pw(n(q), N - k)} is ${fx(ans, 4)} to 4 decimal places.` },
   { prompt: 'A tray either passes or fails. What is 1 minus the chance of passing, to 4 decimal places?', answer: [other], explanation: `1 − ${dig4(x)} = ${fx(other, 4)} to 4 decimal places.` }
  ] }; }
});

})();
