/* Probability practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p1.js. */
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
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const red = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
const fr = (a, b) => `${n(a)}/${n(b)}`;
/* Cells (x, y) of an a-by-b grid whose numbers satisfy test(x, y), in row order. */
const cells = (a, b, test) => { const out = []; for (let x = 1; x <= a; x++) for (let y = 1; y <= b; y++) if (test(x, y)) out.push([x, y]); return out; };
const pairs = list => list.map(([x, y]) => `(${n(x)}, ${n(y)})`).join(', ');

/* ---- q01 Outcomes, sample space and equally likely probability [CM 7.5, IS 3.1] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The spare crystal tray',
 brief: 'A relay has gone quiet, and the dispatch office needs to know how likely it is that a blind grab from the spare crystal tray gives the right one.',
 labels: ['outcomes in the sample space', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['outcomes'], ['numerator', 'denominator'], ['numerator', 'denominator']]
}, {
 canonical: { a: 6, b: 5, c: 3, d: 4 },
 draw: R => ({ a: R.int(2, 8), b: R.int(2, 8), c: R.int(2, 8), d: R.int(2, 8) }),
 build: ({ a, b, c, d }) => { const t = a + b + c + d, [p, q] = red(c, t); return {
  prompt: `A tray in the dispatch office holds spare radio crystals: ${n(a)} quartz, ${n(b)} amber, ${n(c)} smoky and ${n(d)} clear. One crystal is grabbed without looking, and every crystal is equally likely to be grabbed. Enter the number of outcomes in the sample space, then P(smoky) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [t, p, q],
  hints: ['Each crystal is one outcome. Add up all four kinds to count the outcomes in the sample space.', 'P(smoky) is the number of smoky outcomes over the number of outcomes in all. Then divide the top and the bottom by the biggest whole number that goes into both.'],
  solution: `The sample space has ${n(a)} + ${n(b)} + ${n(c)} + ${n(d)} = ${n(t)} equally likely outcomes, one for each crystal. The event “smoky” is made of ${n(c)} of them, so P(smoky) = ${fr(c, t)}. ${gcd(c, t) > 1 ? `Both ${n(c)} and ${n(t)} divide by ${n(gcd(c, t))}, so in lowest terms P(smoky) = ${fr(p, q)}.` : `${n(c)} and ${n(t)} have no common factor, so ${fr(c, t)} is already in lowest terms.`}`,
  guidance: [
   { prompt: 'How many crystals are in the tray altogether? That is the number of outcomes in the sample space.', answer: [t], explanation: `${n(a)} + ${n(b)} + ${n(c)} + ${n(d)} = ${n(t)}. Each crystal is one equally likely outcome.` },
   { prompt: 'Write P(smoky) as the number of smoky outcomes over the number of all outcomes, before simplifying.', answer: [c, t], explanation: `${n(c)} of the ${n(t)} outcomes are smoky, so P(smoky) = ${fr(c, t)}.` },
   { prompt: `Write ${fr(c, t)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(c, t) > 1 ? `${n(c)} and ${n(t)} both divide by ${n(gcd(c, t))}: ${n(c)} ÷ ${n(gcd(c, t))} = ${n(p)} and ${n(t)} ÷ ${n(gcd(c, t))} = ${n(q)}, so ${fr(c, t)} = ${fr(p, q)}.` : `${n(c)} and ${n(t)} have no common factor above 1, so ${fr(c, t)} stays as it is.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'One parcel already gone',
 brief: 'A crate is being unloaded parcel by parcel, and Mira wants the chance that the next parcel she picks blind is for the greenhouse.',
 labels: ['outcomes now in the sample space', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['parcels left'], ['numerator', 'denominator'], ['numerator', 'denominator']]
}, {
 canonical: { m: 7, g: 5, d: 6 },
 draw: R => ({ m: R.int(3, 9), g: R.int(3, 9), d: R.int(3, 9) }),
 build: ({ m, g, d }) => { const t = m + g + d - 1, [p, q] = red(g, t); return {
  prompt: `A dispatch crate holds parcels for three places: ${n(m)} for the mast, ${n(g)} for the greenhouse and ${n(d)} for the depot. One mast parcel is taken out and delivered first. Then one of the parcels still in the crate is picked without looking, every parcel equally likely. Enter the number of outcomes now in the sample space, then P(greenhouse) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [t, p, q],
  hints: ['The parcel that was delivered is no longer in the crate, so it is no longer an outcome. Count only what is still inside.', 'P(greenhouse) is the number of greenhouse parcels over the number of parcels left. Then reduce the fraction.'],
  solution: `Before anything is taken out the crate holds ${n(m)} + ${n(g)} + ${n(d)} = ${n(m + g + d)} parcels. After one mast parcel leaves, ${n(t)} remain, so the sample space has ${n(t)} equally likely outcomes. The event “greenhouse” is made of ${n(g)} of them, so P(greenhouse) = ${fr(g, t)}. ${gcd(g, t) > 1 ? `Both divide by ${n(gcd(g, t))}, so in lowest terms P(greenhouse) = ${fr(p, q)}.` : `${n(g)} and ${n(t)} have no common factor, so this is already in lowest terms.`}`,
  guidance: [
   { prompt: `The crate started with ${n(m + g + d)} parcels and one has been delivered. How many parcels are left to pick from?`, answer: [t], explanation: `${n(m + g + d)} − 1 = ${n(t)}. The delivered parcel is out of the sample space.` },
   { prompt: 'Write P(greenhouse) as the number of greenhouse parcels over the number of parcels left, before simplifying.', answer: [g, t], explanation: `The delivery took a mast parcel, so all ${n(g)} greenhouse parcels are still there: P(greenhouse) = ${fr(g, t)}.` },
   { prompt: `Write ${fr(g, t)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(g, t) > 1 ? `Dividing top and bottom by ${n(gcd(g, t))} gives ${fr(p, q)}.` : `${n(g)} and ${n(t)} have no common factor above 1, so ${fr(g, t)} stays as it is.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'Tags by the fraction',
 brief: 'The tag locker is labelled by shares instead of counts, and Mira still needs the chance of drawing a blue tag.',
 labels: ['blue tags', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['red and green tags'], ['blue tags'], ['numerator', 'denominator']]
}, {
 canonical: { t: 72, y: 9 },
 draw: R => { const t = R.pick([48, 60, 72, 84, 96]); return { t, y: R.int(4, 5 * t / 12 - 4) }; },
 build: ({ t, y }) => { const r = t / 4, g = t / 3, b = t - r - g - y, [p, q] = red(b, t); return {
  prompt: `A locker holds ${n(t)} docking tags. One quarter of the tags are red and one third are green. Another ${n(y)} tags are yellow, and all the rest are blue. One tag is drawn without looking, every tag equally likely. Enter the number of blue tags, then P(blue) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [b, p, q],
  hints: ['Find how many tags are red and how many are green by taking a quarter and a third of the whole locker.', 'Take the red, green and yellow tags away from the whole locker to leave the blue ones. Then P(blue) is the blue tags over all the tags, reduced.'],
  solution: `A quarter of ${n(t)} is ${n(r)} red tags and a third of ${n(t)} is ${n(g)} green tags. With ${n(y)} yellow, that is ${n(r)} + ${n(g)} + ${n(y)} = ${n(r + g + y)} tags that are not blue, so ${n(t)} − ${n(r + g + y)} = ${n(b)} are blue. P(blue) = ${fr(b, t)}${gcd(b, t) > 1 ? `, which is ${fr(p, q)} in lowest terms` : ', already in lowest terms'}.`,
  guidance: [
   { prompt: `How many tags are red or green together? Work out a quarter of ${n(t)} plus a third of ${n(t)}.`, answer: [r + g], explanation: `${n(t)} ÷ 4 = ${n(r)} red and ${n(t)} ÷ 3 = ${n(g)} green, so ${n(r + g)} tags in all.` },
   { prompt: `Out of ${n(t)} tags, ${n(r + g)} are red or green and ${n(y)} are yellow. How many are blue?`, answer: [b], explanation: `${n(t)} − ${n(r + g)} − ${n(y)} = ${n(b)} blue tags.` },
   { prompt: `Write P(blue) as blue tags over all ${n(t)} tags, in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(b, t) > 1 ? `P(blue) = ${fr(b, t)}. Both divide by ${n(gcd(b, t))}, giving ${fr(p, q)}.` : `P(blue) = ${fr(b, t)}, which has no common factor above 1.` }
  ] }; }
});

/* ---- q02 Probability as long-run relative frequency [IS 3.1] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The flare test',
 brief: 'The dispatch office tested its signal flares, and Mira wants to know how many of the next batch will let her down.',
 labels: ['relative frequency', 'expected flares that fail'], tolerance: 0.0005,
 gl: [['relative frequency'], ['probability of failing'], ['expected flares that fail']]
}, {
 canonical: { L: 50, k: 43, m: 4 },
 draw: R => { let p; do { const L = R.pick([20, 25, 40, 50]); p = { L, k: R.int(Math.ceil(L * 0.5), L - 3), m: R.int(2, 5) }; } while (p.L === 25 && p.k === 21); return p; },  // not the worked example (21 of 25)
 build: ({ L, k, m }) => { const f = k / L, bad = (L - k) / L, N = L * m, e = m * (L - k); return {
  prompt: `The dispatch office tested ${n(L)} signal flares, and ${n(k)} of them lit at the first strike. Enter the relative frequency of flares that lit first time, as a decimal, then the number of the next ${n(N)} flares you would expect to fail to light first time if the pattern holds.`,
  answer: [f, e],
  hints: ['The relative frequency is the number that lit first time divided by the number tested.', `The flares that did not light first time are the rest of the ${n(L)} tested. Their share of the ${n(L)} is the chance of failing to light. Multiply that by the number of flares to come.`],
  solution: `The relative frequency of lighting first time is ${n(k)} ÷ ${n(L)} = ${n(f)}. The other ${n(L)} − ${n(k)} = ${n(L - k)} flares failed, so taken as a probability the chance of failing to light is ${n(L - k)} ÷ ${n(L)} = ${n(bad)}. Out of the next ${n(N)} flares you expect ${n(N)} × ${n(bad)} = ${n(e)} to fail first time. The real count will land a little either side.`,
  guidance: [
   { prompt: `Divide the flares that lit first time by the flares tested. What is ${n(k)} ÷ ${n(L)}?`, answer: [f], explanation: `${n(k)} ÷ ${n(L)} = ${n(f)}.` },
   { prompt: `How many of the ${n(L)} flares did not light first time? Divide that by ${n(L)}: what is the probability of failing to light first time?`, answer: [bad], explanation: `${n(L)} − ${n(k)} = ${n(L - k)} flares failed, and ${n(L - k)} ÷ ${n(L)} = ${n(bad)}. It is also 1 − ${n(f)}: the chance of lighting and the chance of failing add to 1.` },
   { prompt: `How many of the next ${n(N)} flares do you expect to fail? Work out ${n(N)} × ${n(bad)}.`, answer: [e], explanation: `${n(N)} × ${n(bad)} = ${n(e)}. That is the expected count, not a promise.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Two seasons in one log',
 brief: 'The dry-season and dusty-season logs are kept apart, and Mira wants a single forecast from both.',
 labels: ['relative frequency over both seasons', 'expected on-time runs'], tolerance: 0.0005,
 gl: [['on-time runs in both seasons', 'runs in both seasons'], ['relative frequency'], ['expected on-time runs']]
}, {
 canonical: { L1: 30, k1: 27, L2: 20, k2: 14, m: 3 },
 draw: R => { const T = R.pick([40, 50, 100, 200]), L1 = 10 * R.int(Math.ceil(T * 0.25 / 10), Math.floor(T * 0.75 / 10)), L2 = T - L1;
  return { L1, k1: R.int(Math.ceil(L1 * 0.5), L1 - 2), L2, k2: R.int(Math.ceil(L2 * 0.5), L2 - 2), m: R.int(2, 4) }; },
 build: ({ L1, k1, L2, k2, m }) => { const L = L1 + L2, k = k1 + k2, f = k / L, N = L * m; return {
  prompt: `In the dry season the dispatch log shows ${n(L1)} runs, ${n(k1)} of them on time. In the dusty season it shows ${n(L2)} runs, ${n(k2)} of them on time. Treat the two seasons as one long log. Enter the relative frequency of on-time runs over both seasons together, as a decimal, then the number of the next ${n(N)} runs you would expect to arrive on time.`,
  answer: [f, k * m],
  hints: ['Do not average the two seasons’ decimals. Add the on-time runs together and add the runs together, then divide.', 'Use the combined relative frequency as the probability of an on-time run and multiply it by the number of runs to come.'],
  solution: `Over both seasons there are ${n(k1)} + ${n(k2)} = ${n(k)} on-time runs out of ${n(L1)} + ${n(L2)} = ${n(L)} runs, so the relative frequency is ${n(k)} ÷ ${n(L)} = ${n(f)}. Taken as the probability, it predicts ${n(N)} × ${n(f)} = ${n(k * m)} on-time runs out of the next ${n(N)}.`,
  guidance: [
   { prompt: 'Treat both seasons as one log. How many runs were on time in all, and how many runs were there in all?', answer: [k, L], explanation: `${n(k1)} + ${n(k2)} = ${n(k)} on time, and ${n(L1)} + ${n(L2)} = ${n(L)} runs.` },
   { prompt: `Divide the on-time runs by the runs in the combined log. What is ${n(k)} ÷ ${n(L)}?`, answer: [f], explanation: `${n(k)} ÷ ${n(L)} = ${n(f)}.` },
   { prompt: `How many of the next ${n(N)} runs do you expect on time? Work out ${n(N)} × ${n(f)}.`, answer: [k * m], explanation: `${n(N)} × ${n(f)} = ${n(k * m)}.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The log with the missing cover',
 brief: 'The front page of an old dispatch log is torn off, and Mira has to rebuild its size from the share and the late runs.',
 labels: ['runs in the log', 'expected on-time runs'], tolerance: 0.0005,
 gl: [['share of late runs'], ['runs in the log'], ['expected on-time runs']]
}, {
 canonical: { L: 125, k: 105, N: 1000 },
 draw: R => { const L = R.pick([25, 50, 100, 125, 200]); return { L, k: R.int(Math.ceil(L * 0.6), L - Math.max(2, Math.ceil(L / 25))), N: R.pick([1000, 2000]) }; },
 build: ({ L, k, N }) => { const f = k / L, late = L - k, sl = late / L; return {
  prompt: `An old dispatch log has lost its cover page, so nobody knows how many runs it covers. Its relative frequency of on-time runs is ${n(f)}, and ${n(late)} runs in it were late. Enter the number of runs the log covers, then the number of the next ${n(N)} runs you would expect to arrive on time (type it without commas).`,
  answer: [L, N * f],
  hints: ['Every run was either on time or late, so the share of late runs is 1 minus the relative frequency of on-time runs.', 'The late runs are that share of the whole log, so the whole log is the late runs divided by the share. Then multiply the on-time relative frequency by the runs to come.'],
  solution: `The share of late runs is 1 − ${n(f)} = ${n(sl)}. The ${n(late)} late runs make up ${n(sl)} of the log, so the log covers ${n(late)} ÷ ${n(sl)} = ${n(L)} runs. Taking ${n(f)} as the probability of an on-time run, you expect ${n(N)} × ${n(f)} = ${n(N * f)} on-time runs out of the next ${n(N)}.`,
  guidance: [
   { prompt: `The relative frequency of on-time runs is ${n(f)}. What share of the runs in the log were late?`, answer: [sl], explanation: `On time and late make up the whole log, so the late share is 1 − ${n(f)} = ${n(sl)}.` },
   { prompt: `${n(late)} runs are ${n(sl)} of the log. How many runs does the log cover? Work out ${n(late)} ÷ ${n(sl)}.`, answer: [L], explanation: `${n(late)} ÷ ${n(sl)} = ${n(L)} runs. Check: ${n(sl)} of ${n(L)} is ${n(late)}.` },
   { prompt: `How many of the next ${n(N)} runs do you expect on time? Work out ${n(N)} × ${n(f)}.`, answer: [N * f], explanation: `${n(N)} × ${n(f)} = ${n(N * f)}.` }
  ] }; }
});

/* ---- q03 The complement rule [CM 7.5] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'The relay timetable',
 brief: 'The relay has a timetable of half-hour slots, and Mira needs the chance that a slot picked blind is free.',
 labels: ['P(free) as a percentage', 'free slots'], tolerance: 0.005,
 gl: [['P(free) as a percentage'], ['free slots']]
}, {
 canonical: { T: 80, k: 22 },
 draw: R => { const T = R.pick([40, 50, 80, 200]); return { T, k: R.int(Math.ceil(T * 0.15), Math.floor(T * 0.85)) }; },
 build: ({ T, k }) => { const p = 100 * k / T, free = 100 - p; return {
  prompt: `The relay timetable has ${n(T)} half-hour slots, and one slot is picked at random, every slot equally likely. The chance that the slot picked is already busy is ${n(p)}%. Enter the chance that it is free, as a percentage, then the number of free slots in the timetable.`,
  answer: [free, T - k],
  hints: ['A slot is either busy or free and never both, so the two chances add to 100%.', 'A percentage is a share of 100. Turn the free percentage into a share of all the slots to count the free ones.'],
  solution: `P(free) is the complement of P(busy), so it is 100% − ${n(p)}% = ${n(free)}%. The slots are equally likely, so ${n(free)}% of the ${n(T)} slots are free: ${n(T)} × ${n(free)} ÷ 100 = ${n(T - k)} slots. Check: ${n(k)} busy slots and ${n(T - k)} free slots make ${n(T)}.`,
  guidance: [
   { prompt: `Busy and free share the whole timetable, which is 100%. What is 100 − ${n(p)}?`, answer: [free], explanation: `100 − ${n(p)} = ${n(free)}, so P(free) = ${n(free)}%.` },
   { prompt: `${n(free)}% of the ${n(T)} equally likely slots are free. How many slots is that? Work out ${n(T)} × ${n(free)} ÷ 100.`, answer: [T - k], explanation: `${n(T)} × ${n(free)} ÷ 100 = ${n(T - k)} free slots.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The late-run penalty',
 brief: 'Late shuttles cost the dispatch office credits, and Mira wants a month’s penalty bill worked out before it arrives.',
 labels: ['P(not on time)', 'expected late runs', 'penalty in credits'], tolerance: 0.0005,
 gl: [['P(not on time)'], ['expected late runs'], ['penalty in credits']]
}, {
 canonical: { p: 0.75, T: 80, f: 15 },
 /* At least 2 late runs are expected (p = 0.95 with 20 runs would give 1). */
 draw: R => { let p; do { p = { p: R.int(11, 19) * 5 / 100, T: 20 * R.int(1, 5), f: R.pick([5, 8, 12, 15, 20]) }; } while (Math.round(p.T * (100 - Math.round(p.p * 100))) < 200); return p; },
 build: ({ p, T, f }) => { const q = 1 - p, late = T * q; return {
  prompt: `Dispatch expects each of the month’s ${n(T)} supply runs to be on time with probability ${n(p)}. Every run that is not on time costs the office ${n(f)} credits in penalties. Enter the probability that a run is not on time, then the number of the ${n(T)} runs you expect to be not on time, then the total penalty in credits for those runs.`,
  answer: [q, late, late * f],
  hints: ['A run is either on time or not on time, so the two probabilities add to 1.', 'Multiply the probability of being late by the number of runs to get the expected number of late runs. Each late run costs the same, so multiply that count by the penalty.'],
  solution: `P(not on time) = 1 − ${n(p)} = ${n(q)}. Out of ${n(T)} runs you expect ${n(T)} × ${n(q)} = ${n(late)} to be late. At ${n(f)} credits each the penalty is ${n(late)} × ${n(f)} = ${n(late * f)} credits.`,
  guidance: [
   { prompt: `Not on time is the complement of on time. What is 1 − ${n(p)}?`, answer: [q], explanation: `1 − ${n(p)} = ${n(q)}, so P(not on time) = ${n(q)}.` },
   { prompt: `How many of the ${n(T)} runs do you expect to be late? Work out ${n(T)} × ${n(q)}.`, answer: [late], explanation: `${n(T)} × ${n(q)} = ${n(late)} late ${n(late) === '1' ? 'run' : 'runs'} expected.` },
   { prompt: `Each late run costs ${n(f)} credits. What is the penalty for ${n(late)} late runs?`, answer: [late * f], explanation: `${n(late)} × ${n(f)} = ${n(late * f)} credits.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', title: 'Four times as likely',
 brief: 'Nobody wrote down the chance of drawing a canyon card, only how much likelier any other card is.',
 labels: ['P(canyon card)', 'cards that are not canyon cards'], tolerance: 0.0005,
 gl: [['equal shares'], ['P(canyon card)'], ['cards that are not canyon cards']]
}, {
 canonical: { r: 4, T: 35 },
 draw: R => { const r = R.pick([3, 4, 7, 9, 19, 24]); return { r, T: (r + 1) * R.int(2, 9) }; },
 build: ({ r, T }) => { const s = r + 1, pa = 1 / s, no = T * r / s; return {
  prompt: `Dispatch draws one card from a deck of ${n(T)} route cards, all equally likely, and some of them are canyon cards. Drawing a card that is not a canyon card is ${n(r)} times as likely as drawing a canyon card. Enter P(canyon card) as a decimal, then the number of cards in the deck that are not canyon cards.`,
  answer: [pa, no],
  hints: ['Think of the whole probability, 1, as cut into equal shares: some shares for “canyon” and some for “not canyon”. The ratio tells you how many of each.', 'One share is the probability of drawing a canyon card. The cards are equally likely, so the number of cards is the deck size times the probability.'],
  solution: `“Not canyon” has ${n(r)} shares for every 1 share of “canyon”, so the whole probability 1 is cut into ${n(r)} + 1 = ${n(s)} equal shares. P(canyon card) = 1 ÷ ${n(s)} = ${n(pa)}, and P(not canyon) = 1 − ${n(pa)} = ${n(1 - pa)}. Out of ${n(T)} cards that is ${n(T)} × ${n(1 - pa)} = ${n(no)} cards that are not canyon cards.`,
  guidance: [
   { prompt: `“Not canyon” gets ${n(r)} shares for each 1 share of “canyon”. How many equal shares make up the whole probability, 1?`, answer: [s], explanation: `${n(r)} + 1 = ${n(s)} equal shares, and one of them belongs to “canyon”.` },
   { prompt: `One share out of ${n(s)} is “canyon”. What is P(canyon card) as a decimal?`, answer: [pa], explanation: `1 ÷ ${n(s)} = ${n(pa)}.` },
   { prompt: `P(not canyon) is 1 − ${n(pa)} = ${n(1 - pa)}. How many of the ${n(T)} cards is that? Work out ${n(T)} × ${n(1 - pa)}.`, answer: [no], explanation: `${n(T)} × ${n(1 - pa)} = ${n(no)} cards. Check: ${n(T)} × ${n(pa)} = ${n(T * pa)} canyon cards, and ${n(T * pa)} + ${n(no)} = ${n(T)}.` }
  ] }; }
});

/* ---- q04 Two-stage outcomes in a grid or tree [CM 7.4] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The airlock keypad',
 brief: 'The airlock opens on a code made by two spinning wheels, and Mira wants to know how often a given code comes up.',
 labels: ['cells in the grid', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['cells'], ['cells with the product'], ['numerator', 'denominator']]
}, {
 canonical: { a: 5, b: 6, s: 12 },
 draw: R => { let p; do { const a = R.int(3, 7), b = R.int(5, 9); p = { a, b, s: R.int(1, a) * R.int(1, b) }; const c = cells(p.a, p.b, (x, y) => x * y === p.s).length; if (c < 2 || c > 8) p = null; } while (!p); return p; },
 build: ({ a, b, s }) => { const hit = cells(a, b, (x, y) => x * y === s), t = a * b, [p, q] = red(hit.length, t); return {
  prompt: `The airlock keypad has two number wheels. The first wheel shows the numbers 1 to ${n(a)} and the second shows 1 to ${n(b)}, and every number on a wheel is equally likely when spun, and one wheel does not affect the other. The keypad multiplies the two numbers to make the code. Enter the number of cells in the grid of all outcomes (first wheel down the side, second along the top), then P(code = ${n(s)}) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [t, p, q],
  hints: ['The grid has one row for each number on the first wheel and one column for each number on the second, so the number of cells is rows × columns.', 'Go down the rows: in each row, ask which number on the second wheel multiplies with the row’s number to make the code. Count the rows where that number is really on the second wheel.'],
  solution: `The grid has ${n(a)} rows and ${n(b)} columns, so ${n(a)} × ${n(b)} = ${n(t)} equally likely cells. The cells whose numbers multiply to ${n(s)} are ${pairs(hit)}: ${n(hit.length)} of them. So P(code = ${n(s)}) = ${fr(hit.length, t)}${gcd(hit.length, t) > 1 ? `, which is ${fr(p, q)} in lowest terms` : ', already in lowest terms'}.`,
  guidance: [
   { prompt: `The grid has a row for each of the ${n(a)} numbers on the first wheel and a column for each of the ${n(b)} on the second. How many cells does it have?`, answer: [t], explanation: `${n(a)} × ${n(b)} = ${n(t)} cells, one for each pair (first, second), and every cell is equally likely.` },
   { prompt: `List the pairs (first, second) whose numbers multiply to ${n(s)}. How many are there?`, answer: [hit.length], explanation: `They are ${pairs(hit)}: ${n(hit.length)} ${hit.length === 1 ? 'cell' : 'cells'}.` },
   { prompt: `Write ${fr(hit.length, t)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(hit.length, t) > 1 ? `${n(hit.length)} and ${n(t)} both divide by ${n(gcd(hit.length, t))}, so ${fr(hit.length, t)} = ${fr(p, q)}.` : `${n(hit.length)} and ${n(t)} have no common factor above 1, so the fraction stays as it is.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Closed routes and pads',
 brief: 'Repairs have shut part of the landing grid, and Mira needs the chance that a random route and pad pairing is still open.',
 labels: ['open pairings', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['closed cells'], ['open cells'], ['numerator', 'denominator']]
}, {
 canonical: { a: 5, b: 6 },
 draw: R => ({ a: R.int(3, 9), b: R.int(4, 10) }),
 build: ({ a, b }) => { const t = a * b, closed = a + b - 1, open = t - closed, [p, q] = red(open, t); return {
  prompt: `A dispatch planner pairs one of ${n(a)} landing routes with one of ${n(b)} landing pads, and every pairing is equally likely, so the grid of outcomes has the routes down the side and the pads along the top. Every pairing that uses route 1 is closed for repairs, and so is every pairing that uses pad 1. Enter the number of open pairings, then P(a random pairing is open) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [open, p, q],
  hints: ['Mark the closed cells: all of row 1 and all of column 1. One cell sits in both, so be careful not to count it twice.', 'The open cells are all the cells except the closed ones. P(open) is the open cells over all the cells, reduced.'],
  solution: `The grid has ${n(a)} × ${n(b)} = ${n(t)} cells. Row 1 has ${n(b)} closed cells and column 1 has ${n(a)}, but the cell (route 1, pad 1) is in both, so ${n(b)} + ${n(a)} − 1 = ${n(closed)} cells are closed. That leaves ${n(t)} − ${n(closed)} = ${n(open)} open cells. P(open) = ${fr(open, t)}${gcd(open, t) > 1 ? `, which is ${fr(p, q)} in lowest terms` : ', already in lowest terms'}.`,
  guidance: [
   { prompt: `Row 1 has ${n(b)} cells and column 1 has ${n(a)} cells, and they share one cell. How many cells are closed altogether?`, answer: [closed], explanation: `${n(b)} + ${n(a)} − 1 = ${n(closed)}: the shared cell is counted only once.` },
   { prompt: `The grid has ${n(a)} × ${n(b)} = ${n(t)} cells. How many of them are open?`, answer: [open], explanation: `${n(t)} − ${n(closed)} = ${n(open)} open cells. (This is also ${n(a - 1)} × ${n(b - 1)}, the rows and columns left over.)` },
   { prompt: `Write P(open) = ${fr(open, t)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(open, t) > 1 ? `${n(open)} and ${n(t)} both divide by ${n(gcd(open, t))}, so ${fr(open, t)} = ${fr(p, q)}.` : `${n(open)} and ${n(t)} have no common factor above 1, so the fraction stays as it is.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', title: 'At least a small sum', uses: 'q03',
 brief: 'Almost every spin of the two wheels is good enough for the signal test, and Mira wants the exact chance without listing the whole grid.',
 labels: ['cells in the grid', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['cells'], ['cells with a smaller sum'], ['numerator', 'denominator']]
}, {
 canonical: { a: 6, b: 8, s: 4 },
 draw: R => ({ a: R.int(5, 9), b: R.int(7, 12), s: R.int(3, 5) }),
 build: ({ a, b, s }) => { const t = a * b, small = cells(a, b, (x, y) => x + y < s).length, hit = t - small, [p, q] = red(hit, t); return {
  prompt: `Two fair spinners are used for the signal test. The first has ${n(a)} equal sections numbered 1 to ${n(a)}, and the second has ${n(b)} equal sections numbered 1 to ${n(b)}. Both are spun once, and one spin does not affect the other. The two numbers are added. Enter the number of cells in the grid of all outcomes, then P(sum is at least ${n(s)}) as a fraction in lowest terms: numerator, then denominator.`,
  answer: [t, p, q],
  hints: ['Almost every cell has a sum of at least the target. It is quicker to count the cells that do not, the complement, and take them away from the whole grid.', 'The cells that miss the event are the ones whose sum is smaller than the target. List them, count them, and subtract from the total number of cells before reducing.'],
  solution: `The grid has ${n(a)} × ${n(b)} = ${n(t)} equally likely cells. The event “sum at least ${n(s)}” is the complement of “sum less than ${n(s)}”, and the cells with a sum less than ${n(s)} are ${pairs(cells(a, b, (x, y) => x + y < s))}: ${n(small)} of them. So ${n(t)} − ${n(small)} = ${n(hit)} cells have a sum of at least ${n(s)}, and P = ${fr(hit, t)}${gcd(hit, t) > 1 ? `, which is ${fr(p, q)} in lowest terms` : ', already in lowest terms'}.`,
  guidance: [
   { prompt: `How many cells does the grid have, ${n(a)} rows by ${n(b)} columns?`, answer: [t], explanation: `${n(a)} × ${n(b)} = ${n(t)} cells.` },
   { prompt: `Count the cells whose sum is less than ${n(s)}, the complement of the event. How many are there?`, answer: [small], explanation: `They are ${pairs(cells(a, b, (x, y) => x + y < s))}: ${n(small)} ${small === 1 ? 'cell' : 'cells'}.` },
   { prompt: `The other ${n(t)} − ${n(small)} = ${n(hit)} cells have a sum of at least ${n(s)}. Write ${fr(hit, t)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(hit, t) > 1 ? `${n(hit)} and ${n(t)} both divide by ${n(gcd(hit, t))}, so ${fr(hit, t)} = ${fr(p, q)}.` : `${n(hit)} and ${n(t)} have no common factor above 1, so the fraction stays as it is.` }
  ] }; }
});

/* ---- q05 Events: "and", "or", Venn diagrams, mutually exclusive [IS 3.2, 3.5] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Faulty microphones and speakers',
 brief: 'Mira’s team has checked a rack of relays, and the repair bench needs the count of relays that have any fault at all.',
 labels: ['relays in M or S', 'relays in neither circle'], tolerance: 0.01,
 gl: [['relays in M or S'], ['relays in neither circle']]
}, {
 canonical: { m: 12, s: 9, o: 4, z: 13 },
 draw: R => { const o = R.int(2, 4); return { m: R.int(o + 3, 12), s: R.int(o + 2, 10), o, z: R.int(4, 14) }; },
 build: ({ m, s, o, z }) => { const u = m + s - o, N = u + z; return {
  prompt: `Mira’s team checks ${n(N)} relays. On a Venn diagram, circle M holds the relays with a faulty microphone and circle S holds those with a faulty speaker. Counting the overlap, M holds ${n(m)} relays and S holds ${n(s)}, and ${n(o)} relays are in both circles. Enter the number of relays in the event “M or S”, then the number in neither circle.`,
  answer: [u, z],
  hints: ['Adding the relays in M to the relays in S counts the overlap twice. Take it off once.', 'Every relay is either inside at least one circle or outside both. Take the relays in “M or S” away from all the relays checked.'],
  solution: `The totals ${n(m)} and ${n(s)} both include the ${n(o)} relays in the overlap, so “M or S” has ${n(m)} + ${n(s)} − ${n(o)} = ${n(u)} relays. The other ${n(N)} − ${n(u)} = ${n(z)} relays are outside both circles.`,
  guidance: [
   { prompt: `Adding ${n(m)} and ${n(s)} counts the overlap twice. How many relays are in “M or S”? Work out ${n(m)} + ${n(s)} − ${n(o)}.`, answer: [u], explanation: `${n(m)} + ${n(s)} − ${n(o)} = ${n(u)} relays have at least one fault.` },
   { prompt: `Of the ${n(N)} relays checked, ${n(u)} are in “M or S”. How many are in neither circle?`, answer: [z], explanation: `${n(N)} − ${n(u)} = ${n(z)} relays have no fault of either kind.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'The delivery with no marks',
 brief: 'A delivery’s paperwork is missing its middle, and Mira has to rebuild how many crates were both cracked and damp.',
 labels: ['crates in K and D', 'damp crates that are not cracked'], tolerance: 0.01,
 gl: [['crates in K or D'], ['crates in K and D'], ['damp crates that are not cracked']]
}, {
 canonical: { k0: 11, o: 3, d0: 8, z: 18 },
 draw: R => ({ k0: R.int(4, 12), o: R.int(2, 5), d0: R.int(3, 10), z: R.int(5, 15) }),
 build: ({ k0, o, d0, z }) => { const K = k0 + o, D = d0 + o, u = k0 + o + d0, N = u + z; return {
  prompt: `A delivery has ${n(N)} crates. On a Venn diagram, circle K holds the cracked crates and circle D holds the damp ones. Counting the overlap, K holds ${n(K)} crates and D holds ${n(D)}. Mira finds ${n(z)} crates that are neither cracked nor damp. Enter the number of crates in the event “K and D”, then the number of crates that are damp but not cracked.`,
  answer: [o, d0],
  hints: ['The crates inside the circles are all the crates except the ones in neither. That gives the size of “K or D”.', 'K plus D counts the overlap twice, so K + D minus the size of “K or D” is the overlap. The damp crates that are not cracked are D with the overlap taken out.'],
  solution: `The crates in “K or D” are all those not in neither: ${n(N)} − ${n(z)} = ${n(u)}. Adding K and D counts the overlap twice, so the overlap is ${n(K)} + ${n(D)} − ${n(u)} = ${n(o)} crates in “K and D”. The damp crates that are not cracked are D without the overlap: ${n(D)} − ${n(o)} = ${n(d0)}.`,
  guidance: [
   { prompt: `${n(z)} of the ${n(N)} crates are in neither circle. How many crates are in “K or D”?`, answer: [u], explanation: `${n(N)} − ${n(z)} = ${n(u)} crates are in at least one circle.` },
   { prompt: `K plus D counts the overlap twice: ${n(K)} + ${n(D)} is more than ${n(u)}. How many crates are in both circles?`, answer: [o], explanation: `${n(K)} + ${n(D)} − ${n(u)} = ${n(o)} crates in “K and D”.` },
   { prompt: `Circle D holds ${n(D)} crates and ${n(o)} of them are also cracked. How many damp crates are not cracked?`, answer: [d0], explanation: `${n(D)} − ${n(o)} = ${n(d0)} crates are in D only.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', title: 'Neither fragile nor cold', uses: 'q03',
 brief: 'Mira wants the chance that a crate picked off the weekly pile needs no special handling at all.',
 labels: ['crates in F or C', 'numerator', 'denominator'], tolerance: 0.01,
 gl: [['crates in F or C'], ['crates in neither circle'], ['numerator', 'denominator']]
}, {
 canonical: { f0: 12, o: 5, c0: 9, N: 60 },
 draw: R => { let p; do { p = { f0: R.int(6, 15), o: R.int(3, 8), c0: R.int(5, 14), N: R.pick([40, 50, 60, 80, 100]) }; } while (p.N - (p.f0 + p.o + p.c0) < 6); return p; },
 build: ({ f0, o, c0, N }) => { const u = f0 + o + c0, z = N - u, [p, q] = red(z, N); return {
  prompt: `Of the ${n(N)} crates unloaded this week, Mira’s Venn diagram puts ${n(f0)} in circle F only (fragile, not cold), ${n(o)} in the overlap (fragile and cold) and ${n(c0)} in circle C only (cold, not fragile). Every other crate is outside both circles. Enter the number of crates in the event “F or C”, then the probability that a crate picked at random is in neither circle, as a fraction in lowest terms: numerator, then denominator.`,
  answer: [u, p, q],
  hints: ['“F or C” is everything inside the circles: the F-only region, the overlap and the C-only region, each counted once.', '“Neither” is the complement of “F or C”: every crate that is not in “F or C”. Count its crates by taking the “F or C” crates away from the whole pile, then reduce the fraction.'],
  solution: `“F or C” is everything inside the circles: ${n(f0)} + ${n(o)} + ${n(c0)} = ${n(u)} crates. “Neither circle” is the complement of “F or C”, so it has ${n(N)} − ${n(u)} = ${n(z)} crates. P(neither) = ${fr(z, N)}${gcd(z, N) > 1 ? `, which is ${fr(p, q)} in lowest terms` : ', already in lowest terms'}.`,
  guidance: [
   { prompt: `Add the three regions inside the circles: F only, the overlap and C only. How many crates are in “F or C”?`, answer: [u], explanation: `${n(f0)} + ${n(o)} + ${n(c0)} = ${n(u)} crates, each counted once.` },
   { prompt: `Neither circle is the complement of “F or C”. How many of the ${n(N)} crates are in neither?`, answer: [z], explanation: `${n(N)} − ${n(u)} = ${n(z)} crates.` },
   { prompt: `Write P(neither) = ${fr(z, N)} in lowest terms. If it cannot be reduced, enter it as it is.`, answer: [p, q], explanation: gcd(z, N) > 1 ? `${n(z)} and ${n(N)} both divide by ${n(gcd(z, N))}, so ${fr(z, N)} = ${fr(p, q)}.` : `${n(z)} and ${n(N)} have no common factor above 1, so the fraction stays as it is.` }
  ] }; }
});

})();
