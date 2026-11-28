/* Real analysis practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/real/oracle-p1.js. */
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
/* Retry a draw at most 1000 times, then fall back to the canonical parameters. */
const retry = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return { ...fallback }; };
/* A number with "…" when its decimals go on past the four that n() shows. */
const dots = (top, bottom) => n(top / bottom) + ((top * 10000) % bottom === 0 ? '' : '…');
/* "(x − 3)²", "(x + 2)²" or "x²". */
const sq = h => h === 0 ? 'x²' : `(x ${h > 0 ? '−' : '+'} ${n(Math.abs(h))})²`;
/* A decimal answer without floating-point dust. */
const rd = x => Math.round(x * 1e4) / 1e4;
/* "1, 2, 3" or "1, 2, …, m": the whole numbers up to m. */
const upTo = m => m <= 4 ? Array.from({ length: m }, (_, i) => i + 1).join(', ') : `1, 2, …, ${m}`;
/* "|x − 3|", "|x + 2|" or "|x|". */
const ab = v => v === 0 ? '|x|' : `|x ${v > 0 ? '−' : '+'} ${n(Math.abs(v))}|`;

/* ---- q01 Upper bounds and the supremum [1.2] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The pressure switch window',
 brief: 'A fuel-line pressure switch only works inside a window of dial settings, and the bench needs the top of that window certified.',
 labels: ['sup S', 'maximum (1 or 0)'], tolerance: 0.005,
 gl: [['sup S'], ['maximum (1 or 0)']]
}, {
 /* form 0: a < x < b, form 1: a < x ≤ b, form 2: a ≤ x ≤ b, form 3: a ≤ x < b. sup b; a maximum exactly when the top sign is ≤. */
 canonical: { form: 0, a: 2, b: 9 },
 draw: R => { const a = R.int(-6, 8); return { form: R.int(0, 3), a, b: a + R.int(2, 9) }; },
 build: ({ form, a, b }) => { const lo = form < 2 ? '<' : '≤', hi = form === 0 || form === 3 ? '<' : '≤', top = hi === '≤'; return {
  prompt: `A fuel-line pressure switch accepts every dial setting x with ${n(a)} ${lo} x ${hi} ${n(b)}, where x may be any real number in that range, and it rejects every other setting. The accepted settings form the set S. Enter the supremum sup S, then 1 if S has a maximum (sup S is itself an accepted setting) or 0 if it does not.`,
  answer: [b, top ? 1 : 0],
  hints: ['An upper bound sits at or above every accepted setting, and the supremum is the smallest number that does. Look at the right-hand end of the range.', 'The sign < leaves the end value out and the sign ≤ keeps it in. Ask whether the end value you found is itself an accepted setting.'],
  solution: top
   ? `Every accepted setting is at most ${n(b)}, so ${n(b)} is an upper bound. No smaller number is one, because ${n(b)} itself is accepted and lies above it. So sup S = ${n(b)}. The sign ≤ at the top keeps x = ${n(b)} in S, so S has a maximum: enter 1.`
   : `Every accepted setting is below ${n(b)}, so ${n(b)} is an upper bound. No smaller number u is one: the accepted settings just below ${n(b)} lie above u. So sup S = ${n(b)}. The sign < leaves x = ${n(b)} out, so no setting equals sup S and S has no maximum: enter 0.`,
  guidance: [
   { prompt: `What is the smallest number at or above every accepted setting?`, answer: [b], explanation: top
    ? `Nothing above ${n(b)} is accepted and ${n(b)} is accepted, so ${n(b)} is an upper bound and no smaller number is: sup S = ${n(b)}.`
    : `Every accepted setting is below ${n(b)}, and settings just below ${n(b)} are accepted, so ${n(b)} is the smallest upper bound: sup S = ${n(b)}.` },
   { prompt: `Is sup S itself an accepted setting? Enter 1 for yes, 0 for no.`, answer: [top ? 1 : 0], explanation: top
    ? `The sign ≤ accepts x = ${n(b)}, so S has a maximum: 1.`
    : `The sign < rejects x = ${n(b)}, so S has no maximum: 0.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Headroom on the relay limiter',
 brief: 'A relay repeater is climbing towards a steady signal strength, and the station must know how much room its limiter leaves and when the signal is close enough.',
 labels: ['sup S (dB)', 'spare room (dB)', 'smallest n'], tolerance: 0.005,
 gl: [['sup S (dB)'], ['spare room (dB)'], ['smallest n']]
}, {
 /* Readings a − b/n rise to a. Limiter at C = a + room. Close means above a − D/10, i.e. n > 10b/D; D never divides 10b, so the next whole number is exact.
    Never the worked example {5 − 2/n}. */
 canonical: { a: 9, b: 4, room: 3, D: 12 },
 draw: R => retry(() => ({ a: R.int(3, 12), b: R.int(2, 9), room: R.int(1, 6), D: R.pick([2, 3, 4, 6, 7, 8, 12, 15, 16, 20, 25]) }),
  p => (10 * p.b) % p.D !== 0 && !(p.a === 5 && p.b === 2), { a: 9, b: 4, room: 3, D: 12 }),
 build: ({ a, b, room, D }) => { const C = a + room, d = D / 10, n1 = Math.floor(10 * b / D) + 1; return {
  prompt: `Relay repeater R-7 sends a test pulse for each n = 1, 2, 3, …, and the strength it receives on test n is ${n(a)} − ${n(b)}/n decibels (dB). These readings form the set S. A limiter on the housing cuts in at ${n(C)} dB. Enter sup S in dB, then the spare room between sup S and the limiter's level, in dB. A test counts as close when its reading is above sup S − ${n(d)} dB; the readings only rise, so every test after a close one is close too. Enter the smallest n whose test is close.`,
  answer: [a, room, n1],
  hints: ['The readings rise as n grows. Ask what number they get close to but never pass. The spare room is the limiter level minus that number.', 'A reading above sup S − d, where d is the distance in the problem, means the shrinking part (the number divided by n) is smaller than d. So n must be above that number divided by d. Take the next whole number above it; if the division comes out whole, that whole number is not enough.'],
  solution: `The readings ${n(a)} − ${n(b)}/n rise as n grows, because ${n(b)}/n shrinks, and they stay below ${n(a)}, since ${n(b)}/n is positive. So ${n(a)} is an upper bound. No smaller number u is one: ${n(b)}/n becomes smaller than the gap ${n(a)} − u once n is large enough, and then that reading lies above u. So sup S = ${n(a)} dB. The spare room is ${n(C)} − ${n(a)} = ${n(room)} dB. A test is close when ${n(a)} − ${n(b)}/n > ${n(a)} − ${n(d)}, which means ${n(b)}/n < ${n(d)}, so n > ${n(b)} ÷ ${n(d)} = ${dots(10 * b, D)}. The smallest whole number above that is ${n(n1)}.`,
  guidance: [
   { prompt: `What is the smallest number at or above every reading, sup S, in dB?`, answer: [a], explanation: `The readings rise towards ${n(a)} and get as close to it as you like, but never pass it. So ${n(a)} is an upper bound and nothing smaller is: sup S = ${n(a)}.` },
   { prompt: `The limiter cuts in at ${n(C)} dB. How much room is there between sup S and that level, in dB?`, answer: [room], explanation: `${n(C)} − ${n(a)} = ${n(room)} dB.` },
   { prompt: `A test is close when ${n(b)}/n < ${n(d)}, that is when n > ${n(b)} ÷ ${n(d)}. What is the smallest whole n that works?`, answer: [n1], explanation: `${n(b)} ÷ ${n(d)} = ${dots(10 * b, D)}, and the smallest whole number above it is ${n(n1)}.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'A rising rod and a stray reading',
 brief: 'The rod has been creeping up all week, but one stray calibration reading was logged separately, and the certificate must cover both.',
 labels: ['sup of the rising readings', 'sup S', 'maximum (1 or 0)'], tolerance: 0.005,
 gl: [['sup of the rising readings'], ['sup S'], ['maximum (1 or 0)']]
}, {
 /* S = {a − b/(n + k)} ∪ {c}. The rising part has sup a and no maximum. If c > a, sup S = c (a maximum); if c = a, sup S = a and it is attained by the stray reading;
    if c < a, sup S = a and it is not attained. */
 canonical: { a: 8, b: 6, k: 2, c: 5 },
 draw: R => { const a = R.int(3, 12); return { a, b: R.int(2, 9), k: R.int(1, 4), c: a + R.int(-3, 3) }; },
 build: ({ a, b, k, c }) => { const big = Math.max(a, c), mx = c >= a ? 1 : 0, e = `${n(a)} − ${n(b)}/(n + ${n(k)})`; return {
  prompt: `A calibration rod gives the reading ${e} on test n = 1, 2, 3, …, and one extra reading, ${n(c)}, was logged separately. Let S be the set of all of these readings (the extra reading is a member of S). Enter the supremum of the rising readings ${e} on their own, then sup S, then 1 if S has a maximum (sup S is itself a member of S) or 0 if it does not.`,
  answer: [a, big, mx],
  hints: ['First ignore the extra reading. The rising readings stay below a number they get close to but never reach. That number is the supremum of that part.', 'The supremum of the whole set is the larger of the two suprema. Then ask whether some single member of S equals it: the rising readings never do, so look at the extra reading.'],
  solution: `The readings ${e} rise as n grows, because ${n(b)}/(n + ${n(k)}) shrinks, and stay below ${n(a)}. No smaller number is an upper bound, so their supremum is ${n(a)}, and no rising reading equals it. Adding the extra reading ${n(c)} gives sup S = larger of ${n(a)} and ${n(c)} = ${n(big)}. ${c > a ? `The extra reading ${n(c)} is above every rising reading and is a member, so it is the maximum: enter 1.` : c === a ? `The extra reading ${n(c)} equals sup S and is a member, so S has a maximum: enter 1.` : `The extra reading ${n(c)} is below ${n(a)}, so sup S is still ${n(a)}, which no member equals: S has no maximum, enter 0.`}`,
  guidance: [
   { prompt: `What is the supremum of the rising readings ${e} alone?`, answer: [a], explanation: `They rise towards ${n(a)}, get as close as you like, and never pass it: ${n(a)}.` },
   { prompt: `What is sup S for the whole set, extra reading included?`, answer: [big], explanation: `The larger of ${n(a)} and ${n(c)}: sup S = ${n(big)}.` },
   { prompt: `Is sup S one of the members of S? Enter 1 for yes, 0 for no.`, answer: [mx], explanation: c >= a ? `${n(c)} is the extra reading and equals sup S, so S has a maximum: 1.` : `No rising reading reaches ${n(a)} and the extra reading is smaller, so S has no maximum: 0.` }
  ] }; }
});

/* ---- q02 Infimum, and whether it is attained [1.2] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Flow meter checks',
 brief: 'A coolant flow meter is checked many times, and the bench needs the lowest flow it can ever be certified to deliver.',
 labels: ['inf S', 'attained (1 or 0)'], tolerance: 0.005,
 gl: [['inf S'], ['attained (1 or 0)']]
}, {
 /* form 0: readings m·n ÷ (n + k) with m = t(k + 1): they rise from t at n = 1, so inf t is attained.
    form 1: readings a + c ÷ (n + k): they fall towards a, inf a not attained. */
 canonical: { form: 0, t: 4, k: 2, a: 0, c: 0 },
 draw: R => R.bool() ? { form: 0, t: R.int(2, 9), k: R.int(1, 4), a: 0, c: 0 } : { form: 1, t: 0, k: R.int(1, 4), a: R.int(-3, 9), c: R.int(3, 12) },
 build: ({ form, t, k, a, c }) => { const m = t * (k + 1), e = form === 0 ? `${n(m)} × n ÷ (n + ${n(k)})` : (a === 0 ? '' : `${n(a)} + `) + `${n(c)} ÷ (n + ${n(k)})`, inf = form === 0 ? t : a, att = form === 0 ? 1 : 0; return {
  prompt: `A coolant flow meter is checked once for each n = 1, 2, 3, …, and check n shows ${e} litres per minute, so its readings form the set S. Enter the infimum inf S, then 1 if the infimum is attained (it is itself one of the readings, so S has a minimum) or 0 if it is not.`,
  answer: [inf, att],
  hints: ['Write out the readings for n = 1, 2, 3 and 10 and see which way they move as n grows. A lower bound sits at or below every reading, and the infimum is the largest number that does.', 'If the readings rise, the first one is the smallest. If they fall, look for the number they get close to but never reach. Then ask whether a single reading equals the infimum.'],
  solution: form === 0
   ? `The reading ${e} equals ${n(m)} − ${n(m * k)} ÷ (n + ${n(k)}), and the subtracted part shrinks as n grows, so the readings rise. The smallest is the first one, at n = 1: ${n(m)} ÷ ${n(k + 1)} = ${n(t)}. It is a lower bound, and no larger number is one, because that number would sit above this reading. So inf S = ${n(t)}, and it is attained at n = 1: enter 1.`
   : `Every reading is above ${n(a)}, since ${n(c)} ÷ (n + ${n(k)}) is positive, and the readings fall as n grows, so ${n(a)} is a lower bound. No larger number v is one: once n is large enough, ${n(c)} ÷ (n + ${n(k)}) is smaller than the gap v − ${par(a)}, and that reading lies below v. So inf S = ${n(a)}. No reading equals ${n(a)}, because that would need ${n(c)} ÷ (n + ${n(k)}) = 0, so the infimum is not attained: enter 0.`,
  guidance: [
   { prompt: `Every reading is at least some number, and no larger number has that property. What is that number, inf S?`, answer: [inf], explanation: form === 0 ? `The readings rise from the first one, ${n(t)}, which is the smallest: inf S = ${n(t)}.` : `The readings fall towards ${n(a)} and never reach it, and every reading is above it: inf S = ${n(a)}.` },
   { prompt: `Is inf S itself one of the readings? Enter 1 for yes, 0 for no.`, answer: [att], explanation: att ? `The first reading equals ${n(t)}, so the infimum is attained and S has a minimum: 1.` : `No reading equals ${n(a)}, so the infimum is not attained: 0.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Tests above the alarm line',
 brief: 'A pressure line settles from above, and the station needs its certified floor, the moment it crosses the alarm level, and how many tests set off the alarm.',
 labels: ['inf S (kPa)', 'n at the alarm level', 'tests above the alarm'], tolerance: 0.005,
 gl: [['inf S (kPa)'], ['n at the alarm level'], ['tests above the alarm']]
}, {
 /* Readings a + b/n with b = g·t + g/2 (g even), alarm level a + g. The reading equals the alarm level at n = b/g = t + 0.5, and it is above the alarm exactly for n = 1, …, t.
    Never the worked example {3 + 4/n} (b = 4 never occurs). */
 canonical: { a: 6, g: 4, t: 5 },
 draw: R => ({ a: R.int(1, 9), g: R.pick([2, 4, 6]), t: R.int(3, 12) }),
 build: ({ a, g, t }) => { const b = g * t + g / 2, p = a + g, at = t + 0.5; return {
  prompt: `A pressure line is tested once for each n = 1, 2, 3, …, and test n reads ${n(a)} + ${n(b)}/n kilopascals (kPa). The readings fall as n grows and form the set S. An alarm sounds for any reading above ${n(p)} kPa. Enter inf S in kPa. Then enter the value of n, not necessarily a whole number, at which the reading would equal exactly ${n(p)} kPa. Then enter how many of the tests n = 1, 2, 3, … read above the alarm level.`,
  answer: [a, rd(at), t],
  hints: ['Every reading is above a certain number and they fall towards it. The largest number below every reading is the infimum.', 'Set the reading equal to the alarm level and solve for n. Because the readings fall as n grows, the tests above the alarm are exactly the whole numbers n smaller than that value.'],
  solution: `Every reading is above ${n(a)}, since ${n(b)}/n is positive, and the readings fall towards it. No larger number v is a lower bound: once n is large enough, ${n(b)}/n is smaller than the gap v − ${par(a)}. So inf S = ${n(a)} kPa. The reading equals the alarm level when ${n(a)} + ${n(b)}/n = ${n(p)}, so ${n(b)}/n = ${n(g)} and n = ${n(b)} ÷ ${n(g)} = ${n(at)}. The readings fall as n grows, so the reading is above the alarm exactly when n is smaller than ${n(at)}: n = ${upTo(t)}. That is ${n(t)} tests.`,
  guidance: [
   { prompt: `What is the largest number that is at or below every reading, inf S, in kPa?`, answer: [a], explanation: `The readings fall towards ${n(a)} and never reach it: inf S = ${n(a)}.` },
   { prompt: `Solve ${n(a)} + ${n(b)}/n = ${n(p)} for n. What is n?`, answer: [at], explanation: `${n(b)}/n = ${n(g)}, so n = ${n(b)} ÷ ${n(g)} = ${n(at)}.` },
   { prompt: `The readings fall as n grows. How many whole numbers n = 1, 2, 3, … are smaller than ${n(at)}?`, answer: [t], explanation: `The whole numbers smaller than ${n(at)} are ${upTo(t)}, so ${n(t)} tests read above the alarm.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', uses: 'q01', title: 'A swinging gauge, floor and ceiling',
 brief: 'A gauge swings above and below its mean setting, and the certificate needs both the floor and the ceiling of the swing, and whether the swing ever touches them.',
 labels: ['inf S', 'sup S', 'attained (0, 1 or 2)'], tolerance: 0.005,
 gl: [['inf S'], ['sup S'], ['attained (0, 1 or 2)']]
}, {
 /* form 0: a + (−1)ⁿ b/n with b even: odd n gives a − b/n (smallest a − b at n = 1), even n gives a + b/n (largest a + b/2 at n = 2): both attained.
    form 1: a + (−1)ⁿ b n/(n + 1): odd n falls towards a − b, even n rises towards a + b, neither reached. */
 canonical: { form: 0, a: 3, b: 4 },
 draw: R => { const form = R.int(0, 1); return { form, a: R.int(-5, 8), b: form === 0 ? 2 * R.int(1, 4) : R.int(2, 8) }; },
 build: ({ form, a, b }) => { const lead = a === 0 ? '' : `${n(a)} + `, e = form === 0 ? `${lead}(−1)ⁿ × ${n(b)}/n` : `${lead}(−1)ⁿ × ${n(b)} × n ÷ (n + 1)`, inf = a - b, sup = form === 0 ? a + b / 2 : a + b, att = form === 0 ? 2 : 0; return {
  prompt: `A swinging gauge gives the reading ${e} on test n = 1, 2, 3, …, where (−1)ⁿ is −1 when n is odd and +1 when n is even. The readings form the set S. Enter inf S, then sup S, then how many of these two numbers are themselves readings in S (0, 1 or 2).`,
  answer: [inf, sup, att],
  hints: ['Split the readings into two lists, one for odd n and one for even n. In each list work out which way the readings move as n grows.', 'The floor comes from one list and the ceiling from the other. In each, ask whether the extreme is a reading (the first one of the list) or only a number the list gets close to.'],
  solution: form === 0
   ? `For odd n the reading is ${n(a)} − ${n(b)}/n, which rises as n grows, so its smallest value is at n = 1: ${n(a - b)}. For even n the reading is ${n(a)} + ${n(b)}/n, which falls as n grows, so its largest value is at n = 2: ${n(a + b / 2)}. Every reading lies between these two, so inf S = ${n(inf)} and sup S = ${n(sup)}, and both are readings (n = 1 and n = 2): enter 2.`
   : `For odd n the reading is ${n(a)} − ${n(b)} × n ÷ (n + 1), which falls as n grows towards ${n(a - b)} but stays above it, because n ÷ (n + 1) is always below 1. For even n the reading is ${n(a)} + ${n(b)} × n ÷ (n + 1), which rises towards ${n(a + b)} but stays below it. So inf S = ${n(inf)} and sup S = ${n(sup)}, and no reading equals either: enter 0.`,
  guidance: [
   { prompt: `What is inf S, the largest number at or below every reading?`, answer: [inf], explanation: form === 0 ? `The lowest reading is the first, at n = 1: ${n(a)} − ${n(b)} = ${n(inf)}.` : `The odd-numbered readings fall towards ${n(inf)} and never reach it: inf S = ${n(inf)}.` },
   { prompt: `What is sup S, the smallest number at or above every reading?`, answer: [sup], explanation: form === 0 ? `The highest reading is at n = 2: ${n(a)} + ${n(b)}/2 = ${n(sup)}.` : `The even-numbered readings rise towards ${n(sup)} and never reach it: sup S = ${n(sup)}.` },
   { prompt: `How many of the two numbers inf S and sup S are themselves readings in S? Enter 0, 1 or 2.`, answer: [att], explanation: att === 2 ? `Both are readings: inf S at n = 1 and sup S at n = 2. So 2.` : `Neither is reached by any reading. So 0.` }
  ] }; }
});

/* ---- q03 The Archimedean property [1.2] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Averages and the cable winch',
 brief: 'An averaging unit and a cable winch both need a whole number of repeats before a promise is met, and the bench must name the smallest one.',
 labels: ['smallest n for the error', 'smallest number of turns'], tolerance: 0.01,
 gl: [['whole-number part of c ÷ ε'], ['smallest n for the error'], ['whole-number part of the turns'], ['smallest number of turns']]
}, {
 /* Error c/n < ε = k/1000, so n > 1000c ÷ k; winch of X/100 metres per turn over Y metres, n > 100Y ÷ X. Both answers are the next whole number above the quotient: when it is whole, it fails.
    Never the pair (ε = 0.04, 0.25 m over 6 m) of the q03 worked example. */
 canonical: { c: 4, k: 30, X: 45, Y: 7 },
 draw: R => retry(() => ({ c: R.int(2, 9), k: R.pick([2, 3, 4, 5, 6, 8, 12, 15, 16, 20, 24, 25, 30, 40, 50, 60, 75, 80]), X: R.int(12, 95), Y: R.int(2, 20) }),
  p => !(p.k === 40 && p.X === 25 && p.Y === 6), { c: 4, k: 30, X: 45, Y: 7 }),
 build: ({ c, k, X, Y }) => { const eps = k / 1000, x = X / 100, w1 = Math.floor(1000 * c / k), n1 = w1 + 1, w2 = Math.floor(100 * Y / X), n2 = w2 + 1, tie1 = (1000 * c) % k === 0, tie2 = (100 * Y) % X === 0;
  const s1 = tie1 ? `${n(c)} ÷ ${n(eps)} = ${n(w1)} exactly, and n = ${n(w1)} fails, because ${n(c)}/${n(w1)} equals ε instead of being smaller. So the smallest n is ${n(n1)}.` : `${n(c)} ÷ ${n(eps)} = ${dots(1000 * c, k)}, and the smallest whole number above it is ${n(n1)}.`;
  const s2 = tie2 ? `${n(Y)} ÷ ${n(x)} = ${n(w2)} exactly, and ${n(w2)} turns only reach ${n(Y)} metres without passing it. So the smallest number of turns is ${n(n2)}.` : `${n(Y)} ÷ ${n(x)} = ${dots(100 * Y, X)}, and the smallest whole number above it is ${n(n2)}.`; return {
  prompt: `A signal-averaging unit repeats a reading n times, and the error left in the average is ${n(c)}/n millimetres. Mira will certify the unit when that error is smaller than the tolerance ε = ${n(eps)} mm: enter the smallest n ∈ ℕ with ${n(c)}/n < ${n(eps)}. Second, a cable winch reels in ${n(x)} metres of cable per turn, and the cable must be pulled in by more than ${n(Y)} metres: enter the smallest number of whole turns n with n × ${n(x)} > ${n(Y)}. Type each answer without commas.`,
  answer: [n1, n2],
  hints: ['A fraction (a number ÷ n) is smaller than ε exactly when n is larger than that number ÷ ε, because everything is positive. Work out the division and take the next whole number above it.', 'For the winch, n × x > y is the same as n > y ÷ x. If y ÷ x is a whole number, that many turns only just reach y and do not pass it, so go one higher.'],
  solution: `${n(c)}/n < ${n(eps)} means n > ${n(c)} ÷ ${n(eps)}. ${s1} For the winch, n × ${n(x)} > ${n(Y)} means n > ${n(Y)} ÷ ${n(x)}. ${s2}`,
  guidance: [
   { prompt: `What is the whole-number part of ${n(c)} ÷ ${n(eps)}? (Drop any decimals.)`, answer: [w1], explanation: `${n(c)} ÷ ${n(eps)} = ${dots(1000 * c, k)}, whose whole-number part is ${n(w1)}.` },
   { prompt: `What is the smallest n ∈ ℕ with n > ${n(c)} ÷ ${n(eps)}, so that ${n(c)}/n < ${n(eps)}?`, answer: [n1], explanation: s1 },
   { prompt: `What is the whole-number part of ${n(Y)} ÷ ${n(x)}?`, answer: [w2], explanation: `${n(Y)} ÷ ${n(x)} = ${dots(100 * Y, X)}, whose whole-number part is ${n(w2)}.` },
   { prompt: `What is the smallest number of turns n with n × ${n(x)} > ${n(Y)}?`, answer: [n2], explanation: s2 }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'Strokes to trip the tank alarm',
 brief: 'A hand pump tops up a reserve tank in small strokes, and the crew must know how many strokes it takes to trip the high-level alarm and by how much it overshoots.',
 labels: ['litres to add', 'smallest number of strokes', 'overshoot (litres)'], tolerance: 0.005,
 gl: [['litres to add'], ['smallest number of strokes'], ['overshoot (litres)']]
}, {
 /* need = N/10 litres (alarm level minus current level); stroke X/100 litres; smallest n with n·x > need is floor(10N ÷ X) + 1; overshoot = n·x − need = (nX − 10N)/100. */
 canonical: { N: 134, h: 25, X: 35 },
 draw: R => ({ N: R.int(60, 300), h: R.int(10, 60), X: R.int(15, 95) }),
 build: ({ N, h, X }) => { const need = N / 10, T = need + h, x = X / 100, w = Math.floor(10 * N / X), ns = w + 1, over = (ns * X - 10 * N) / 100, tie = (10 * N) % X === 0; return {
  prompt: `A reserve tank holds ${n(h)} litres and a high-level alarm trips as soon as it holds more than ${n(T)} litres. A hand pump adds ${n(x)} litres per stroke. Enter the number of litres that must be added for the tank to pass the alarm level, then the smallest whole number of strokes that does it (strictly more than the alarm level is needed), then by how many litres the tank is above the alarm level after that many strokes.`,
  answer: [rd(need), ns, rd(over)],
  hints: ['The litres to add are the alarm level minus what the tank holds now. The strokes must add more than that.', 'n strokes add n × x litres, and n × x > y is the same as n > y ÷ x. Take the next whole number above y ÷ x; if the division comes out whole, that many strokes only just reach the level.'],
  solution: `The tank must gain ${n(T)} − ${n(h)} = ${n(need)} litres. n strokes add n × ${n(x)} litres, so we need n × ${n(x)} > ${n(need)}, that is n > ${n(need)} ÷ ${n(x)}. ${tie ? `${n(need)} ÷ ${n(x)} = ${n(w)} exactly, and ${n(w)} strokes only reach the alarm level without passing it, so the smallest number is ${n(ns)}.` : `${n(need)} ÷ ${n(x)} = ${dots(10 * N, X)}, and the smallest whole number above it is ${n(ns)}.`} After ${n(ns)} strokes the tank has gained ${n(ns)} × ${n(x)} = ${n(ns * x)} litres, which is ${n(ns * x)} − ${n(need)} = ${n(over)} litres over.`,
  guidance: [
   { prompt: `The alarm trips above ${n(T)} litres and the tank holds ${n(h)} litres. How many litres must be added to reach the alarm level?`, answer: [need], explanation: `${n(T)} − ${n(h)} = ${n(need)} litres.` },
   { prompt: `What is the smallest whole number of strokes n with n × ${n(x)} > ${n(need)}?`, answer: [ns], explanation: tie ? `${n(need)} ÷ ${n(x)} = ${n(w)} exactly, so ${n(w)} strokes only just reach the level. The smallest number that passes it is ${n(ns)}.` : `n > ${n(need)} ÷ ${n(x)} = ${dots(10 * N, X)}, and the smallest whole number above it is ${n(ns)}.` },
   { prompt: `After ${n(ns)} strokes the tank has gained ${n(ns)} × ${n(x)} litres. By how many litres is that above ${n(need)}?`, answer: [over], explanation: `${n(ns)} × ${n(x)} = ${n(ns * x)}, and ${n(ns * x)} − ${n(need)} = ${n(over)} litres.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q01', title: 'How long until the rod is within tolerance',
 brief: 'The rising rod readings must come within a tolerance of their ceiling, and the lab wants to know how many tests it takes for two different tolerances.',
 labels: ['sup S', 'smallest n for the first tolerance', 'smallest n for the second tolerance'], tolerance: 0.01,
 gl: [['sup S'], ['smallest n for the first tolerance'], ['smallest n for the second tolerance']]
}, {
 /* Readings a − b/n, sup a. Within ε = k/1000 of the supremum means a − b/n > a − ε, so n > 1000b ÷ k, and the answer is the next whole number above the quotient (a whole quotient fails). */
 canonical: { a: 6, b: 5, k1: 40, k2: 3 },
 draw: R => ({ a: R.int(2, 12), b: R.int(2, 9), k1: R.pick([20, 25, 30, 40, 50, 60, 80]), k2: R.pick([1, 2, 3, 4, 5, 6, 8]) }),
 build: ({ a, b, k1, k2 }) => { const e1 = k1 / 1000, e2 = k2 / 1000, w1 = Math.floor(1000 * b / k1), w2 = Math.floor(1000 * b / k2), m1 = w1 + 1, m2 = w2 + 1, t1 = (1000 * b) % k1 === 0, t2 = (1000 * b) % k2 === 0;
  const s = (e, k, w, m, t) => t ? `${n(b)} ÷ ${n(e)} = ${n(w)} exactly, and n = ${n(w)} gives a reading only equal to sup S − ${n(e)}, not above it. So the smallest n is ${n(m)}.` : `${n(b)} ÷ ${n(e)} = ${dots(1000 * b, k)}, and the smallest whole number above it is ${n(m)}.`; return {
  prompt: `Mira's rod gives the reading ${n(a)} − ${n(b)}/n on test n = 1, 2, 3, …, and the readings form the set S. Enter sup S. A reading is within ε of the supremum when it is above sup S − ε; the readings only rise, so once a test is within ε every later test is too. Enter the smallest n that is within ε = ${n(e1)} of the supremum, then the smallest n that is within ε = ${n(e2)}. Type each answer without commas.`,
  answer: [a, m1, m2],
  hints: ['The readings rise towards a number they never pass; that number is the supremum.', 'A reading above sup S − ε means the shrinking part (the number divided by n) is smaller than ε, so n is above that number divided by ε. Take the next whole number above it; if the division comes out whole, that whole number is not enough.'],
  solution: `The readings ${n(a)} − ${n(b)}/n rise as n grows and stay below ${n(a)}, and no smaller number is an upper bound, so sup S = ${n(a)}. A reading is within ε when ${n(a)} − ${n(b)}/n > ${n(a)} − ε, that is ${n(b)}/n < ε, so n > ${n(b)} ÷ ε. For ε = ${n(e1)}: ${s(e1, k1, w1, m1, t1)} For ε = ${n(e2)}: ${s(e2, k2, w2, m2, t2)}`,
  guidance: [
   { prompt: `What is sup S, the smallest number at or above every reading?`, answer: [a], explanation: `The readings rise towards ${n(a)} and never pass it: sup S = ${n(a)}.` },
   { prompt: `What is the smallest n with ${n(b)}/n < ${n(e1)}, so that the reading is within ε = ${n(e1)} of the supremum?`, answer: [m1], explanation: s(e1, k1, w1, m1, t1) },
   { prompt: `What is the smallest n with ${n(b)}/n < ${n(e2)}?`, answer: [m2], explanation: s(e2, k2, w2, m2, t2) }
  ] }; }
});

/* ---- q04 Absolute value and the triangle inequality [1.3] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'A stack of three shims',
 brief: 'A calibration stack of three shims adds up their errors, and the certificate must state the worst total and the range of lengths it accepts.',
 labels: ['largest total error (mm)', 'left end', 'right end'], tolerance: 0.005,
 gl: [['largest total error (mm)'], ['left end'], ['right end']]
}, {
 /* Three bounds A, B, C (tenths of a millimetre): the largest |e₁ + e₂ + e₃| is (A + B + C)/10. Closed range |x − c| ≤ r/10 gives c − r/10 ≤ x ≤ c + r/10. */
 canonical: { A: 2, B: 4, C: 1, c: 120, r: 6 },
 draw: R => ({ A: R.int(1, 9), B: R.int(1, 9), C: R.int(1, 9), c: R.int(100, 500), r: R.int(1, 9) }),
 build: ({ A, B, C, c, r }) => { const a = A / 10, b = B / 10, e = C / 10, s = (A + B + C) / 10, d = r / 10, lo = (10 * c - r) / 10, hi = (10 * c + r) / 10; return {
  prompt: `A calibration stack is built from three shims, and each shim adds an error to the stack's height: |e₁| ≤ ${n(a)} mm, |e₂| ≤ ${n(b)} mm and |e₃| ≤ ${n(e)} mm, each error positive or negative. Enter the largest value the total error |e₁ + e₂ + e₃| can take, in millimetres. Then the certificate accepts every height x with |x − ${n(c)}| ≤ ${n(d)} mm, end points included: enter the left end, then the right end, of the range of accepted heights.`,
  answer: [rd(s), rd(lo), rd(hi)],
  hints: ['Apply the triangle inequality twice: split off one error at a time, |e₁ + e₂ + e₃| ≤ |e₁ + e₂| + |e₃| and then again on |e₁ + e₂|. Then ask whether all three errors can be at their limits with the same sign.', '|x − c| is the distance from x to c on the number line, so |x − c| ≤ r says x is at most r away from c, on either side. The sign ≤ keeps the end points.'],
  solution: `By the triangle inequality, |e₁ + e₂ + e₃| ≤ |e₁ + e₂| + |e₃| ≤ |e₁| + |e₂| + |e₃| ≤ ${n(a)} + ${n(b)} + ${n(e)} = ${n(s)}. The bound is reached when all three errors sit at their limits with the same sign, so the largest total error is ${n(s)} mm. Next, |x − ${n(c)}| ≤ ${n(d)} says x is at most ${n(d)} away from ${n(c)}, so ${n(c)} − ${n(d)} ≤ x ≤ ${n(c)} + ${n(d)}. Its left end is ${n(lo)} and its right end ${n(hi)}, and both ends are accepted.`,
  guidance: [
   { prompt: `What is the largest possible value of |e₁ + e₂ + e₃| when |e₁| ≤ ${n(a)}, |e₂| ≤ ${n(b)} and |e₃| ≤ ${n(e)}?`, answer: [s], explanation: `The triangle inequality caps it at ${n(a)} + ${n(b)} + ${n(e)} = ${n(s)}, and all three errors at their limits with the same sign reach the cap.` },
   { prompt: `|x − ${n(c)}| ≤ ${n(d)} puts x at most ${n(d)} from ${n(c)}. What is the left end of the range?`, answer: [lo], explanation: `${n(c)} − ${n(d)} = ${n(lo)}.` },
   { prompt: `What is the right end of the range?`, answer: [hi], explanation: `${n(c)} + ${n(d)} = ${n(hi)}. So the accepted heights run from ${n(lo)} to ${n(hi)}, ends included.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Will the cable run fit the duct',
 brief: 'A cable run made of two measured sections must fit a duct bay, and the crew needs to know whether it is certain to.',
 labels: ['largest total error (cm)', 'longest true length (cm)', 'certain to fit (1 or 0)'], tolerance: 0.005,
 gl: [['largest total error (cm)'], ['longest true length (cm)'], ['certain to fit (1 or 0)']]
}, {
 /* Sections measured a and b with errors of at most EA/10 and EB/10 cm: the true total is within E = (EA + EB)/10 of a + b, so the longest it can be is a + b + E. Fits when that is at most M. */
 canonical: { a: 46, b: 38, EA: 3, EB: 5, M: 85 },
 draw: R => retry(() => { const p = { a: R.int(20, 90), b: R.int(20, 90), EA: R.int(1, 9), EB: R.int(1, 9) }; p.M = Math.round(p.a + p.b + (p.EA + p.EB) / 10) + R.int(-2, 2); return p; },
  p => p.M !== p.a + p.b + (p.EA + p.EB) / 10, { a: 46, b: 38, EA: 3, EB: 5, M: 85 }),
 build: ({ a, b, EA, EB, M }) => { const ea = EA / 10, eb = EB / 10, E = (EA + EB) / 10, long = a + b + E, fit = long <= M ? 1 : 0; return {
  prompt: `A cable run is made of two sections. The first section was measured at ${n(a)} cm and the second at ${n(b)} cm. The first measurement is off by at most ${n(ea)} cm and the second by at most ${n(eb)} cm, in either direction, so each true length may be a little more or a little less than its reading. The run must fit a duct bay of ${n(M)} cm. Enter the largest the total error in the combined length can be, in cm. Then enter the longest the true combined length could be, in cm. Then enter 1 if the run is certain to fit (its longest possible length is at most ${n(M)} cm) or 0 if it might not.`,
  answer: [rd(E), rd(long), fit],
  hints: ['The combined error is the sum of the two section errors, and the triangle inequality caps its size by the sum of the two limits. Both errors can sit at their limits with the same sign.', 'The true combined length is the measured total plus or minus the total error. Compare its longest possible value with the duct length: it fits for certain only if even the longest value is at most the duct length.'],
  solution: `The measured total is ${n(a)} + ${n(b)} = ${n(a + b)} cm. By the triangle inequality the total error is at most ${n(ea)} + ${n(eb)} = ${n(E)} cm, and it reaches that when both errors have their limit size and the same sign. So the true combined length is at most ${n(a + b)} + ${n(E)} = ${n(long)} cm. The duct is ${n(M)} cm, and ${n(long)} is ${fit ? 'at most' : 'more than'} ${n(M)}, so the run ${fit ? 'is certain to fit: enter 1' : 'might not fit: enter 0'}.`,
  guidance: [
   { prompt: `What is the largest possible total error, from both measurements, in cm?`, answer: [E], explanation: `${n(ea)} + ${n(eb)} = ${n(E)} cm, reached when both errors are at their limits with the same sign.` },
   { prompt: `The measured total is ${n(a + b)} cm. What is the longest the true combined length could be, in cm?`, answer: [long], explanation: `${n(a + b)} + ${n(E)} = ${n(long)} cm.` },
   { prompt: `The duct bay is ${n(M)} cm. Is the longest possible length ${n(long)} cm at most that? Enter 1 for yes, 0 for no.`, answer: [fit], explanation: fit ? `${n(long)} is at most ${n(M)}, so the run is certain to fit: 1.` : `${n(long)} is more than ${n(M)}, so the run might not fit: 0.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', title: 'How far apart can two rods be',
 brief: 'Two rods are each known only to within a tolerance, and the certificate must give the largest and smallest gap that could separate them.',
 labels: ['largest distance (mm)', 'smallest distance (mm)'], tolerance: 0.005,
 gl: [['largest distance (mm)'], ['smallest distance (mm)']]
}, {
 /* |x − c| ≤ r and |y − d| ≤ s with d = c + g and g > r + s: the largest |y − x| is g + r + s and the smallest is g − r − s. */
 canonical: { c: 24, g: 7, R: 4, S: 6 },
 draw: R => ({ c: R.int(10, 60), g: R.int(2, 12), R: R.int(1, 9), S: R.int(1, 9) }),
 build: ({ c, g, R, S }) => { const d = c + g, r = R / 10, s = S / 10, big = rd(g + r + s), small = rd(g - r - s); return {
  prompt: `Two rods lie along one track, and positions are measured in millimetres from the same zero. Sensor A guarantees that the first rod's position x satisfies |x − ${n(c)}| ≤ ${n(r)} mm, and sensor B guarantees that the second rod's position y satisfies |y − ${n(d)}| ≤ ${n(s)} mm. The two guaranteed ranges do not overlap, and the second rod's is further along the track. Enter the largest possible distance |y − x| between the rods, then the smallest possible distance.`,
  answer: [rd(big), rd(small)],
  hints: ['Write the distance by going from x to c, then c to d, then d to y: |y − x| ≤ |y − d| + |d − c| + |c − x|. That gives the largest. Ask whether both rods can sit at the far ends of their ranges at once.', 'For the smallest, picture the number line: the first rod can be at most as far along as the right end of its range and the second at least as far back as the left end of its range. The gap between those two ends is the smallest distance.'],
  solution: `The first rod lies in the range from ${n(c - r)} to ${n(c + r)}, and the second in the range from ${n(d - s)} to ${n(d + s)}. The distance |d − c| is ${n(g)}. By the triangle inequality |y − x| ≤ |y − d| + |d − c| + |c − x| ≤ ${n(s)} + ${n(g)} + ${n(r)} = ${n(big)}, and the rods reach it with x = ${n(c - r)} and y = ${n(d + s)}. The smallest distance comes from x = ${n(c + r)} and y = ${n(d - s)}, which are ${n(d - s)} − ${n(c + r)} = ${n(small)} apart.`,
  guidance: [
   { prompt: `What is the largest possible distance |y − x|, from the far end of the first range to the far end of the second?`, answer: [big], explanation: `The far ends are ${n(c - r)} and ${n(d + s)}, and ${n(d + s)} − ${n(c - r)} = ${n(big)}.` },
   { prompt: `What is the smallest possible distance, from the near end of the first range to the near end of the second?`, answer: [small], explanation: `The near ends are ${n(c + r)} and ${n(d - s)}, and ${n(d - s)} − ${n(c + r)} = ${n(small)}.` }
  ] }; }
});

/* ---- q05 Bounded functions: sup and inf over a set [1.3] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'A lagging thermostat sensor',
 brief: 'A thermostat sensor responds more weakly as the dial turns up, and the hall needs the certified top and bottom of its response on an open range.',
 labels: ['sup f', 'inf f'], tolerance: 0.005,
 gl: [['f near the left end'], ['f near the right end'], ['sup f'], ['inf f']]
}, {
 /* form 0: f(x) = C ÷ (x + k), falling: sup f(p), inf f(q). form 1: f(x) = A − C ÷ (x + k), rising: sup f(q), inf f(p). u = p + k and v = q + k divide C, and x + k > 0 on the interval. */
 canonical: { form: 0, C: 60, k: 1, u: 2, v: 5, A: 0 },
 draw: R => { const C = R.pick([12, 24, 36, 60]), ds = [1, 2, 3, 4, 6, 12].filter(d => C % d === 0), i = R.int(0, ds.length - 2), j = R.int(i + 1, ds.length - 1); return { form: R.int(0, 1), C, k: R.int(0, 3), u: ds[i], v: ds[j], A: R.int(-3, 9) }; },
 build: ({ form, C, k, u, v, A }) => { const p = u - k, q = v - k, den = k === 0 ? 'x' : `(x + ${n(k)})`, F = form === 0 ? `${n(C)} ÷ ${den}` : A === 0 ? `−${n(C)} ÷ ${den}` : `${n(A)} − ${n(C)} ÷ ${den}`, f = x => form === 0 ? C / (x + k) : A - C / (x + k), fp = f(p), fq = f(q), sup = Math.max(fp, fq), inf = Math.min(fp, fq); return {
  prompt: `A thermostat sensor's response at dial setting x is f(x) = ${F}. It is certified only on the open range of settings with ${n(p)} < x < ${n(q)}; the end points are not included, and ${k === 0 ? 'x' : `x + ${n(k)}`} stays positive on the whole range. Enter sup f and then inf f over this range: the supremum and the infimum of the set of values f takes there.`,
  answer: [sup, inf],
  hints: ['Work out which way f moves as x grows: a positive number divided by something that grows gets smaller, and subtracting that number from a fixed value makes f larger. So the extremes sit at the two ends.', 'The ends are not in the range, so the extreme values are approached, never reached. Work out f at each end point and decide which is the larger.'],
  solution: `On the range the denominator ${k === 0 ? 'x' : `x + ${n(k)}`} is positive and grows with x, so ${form === 0 ? `${n(C)} ÷ ${den} falls as x grows: f is largest near the left end and smallest near the right end` : `${n(C)} ÷ ${den} falls as x grows, so f rises: f is smallest near the left end and largest near the right end`}. At the end points f would be f(${n(p)}) = ${n(fp)} and f(${n(q)}) = ${n(fq)}; these values are approached as x moves towards the ends, but the ends themselves are not in the range. So sup f = ${n(sup)} and inf f = ${n(inf)}.`,
  guidance: [
   { prompt: `What value does f approach as x moves towards the left end, x = ${n(p)}?`, answer: [fp], explanation: `f(${n(p)}) = ${n(fp)}. The setting ${n(p)} is not in the range, but values of f come as close to ${n(fp)} as you like.` },
   { prompt: `What value does f approach as x moves towards the right end, x = ${n(q)}?`, answer: [fq], explanation: `f(${n(q)}) = ${n(fq)}.` },
   { prompt: `What is sup f over the range?`, answer: [sup], explanation: `f is ${form === 0 ? 'falling' : 'rising'} on the range, so the larger of the two end values is the supremum: ${n(sup)}.` },
   { prompt: `What is inf f over the range?`, answer: [inf], explanation: `The smaller of the two end values is the infimum: ${n(inf)}.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'The drift spread of a gauge',
 brief: 'A drift gauge is certified over a closed range of temperature settings, and the workshop needs its highest and lowest drift and the width between them.',
 labels: ['sup E (mV)', 'inf E (mV)', 'spread (mV)'], tolerance: 0.005,
 gl: [['E at the left end (mV)'], ['E at the right end (mV)'], ['spread (mV)']]
}, {
 /* E(x) = s(x − h)² + k on the closed range p ≤ x ≤ q with p < h < q. The vertex value k is attained inside: it is the infimum when s = 1 and the supremum when s = −1; the other extreme is the larger (s = 1) or smaller (s = −1) end value, attained. */
 canonical: { s: 1, h: 3, k: 2, p: 0, q: 7 },
 draw: R => { const p = R.int(-4, 2), q = p + R.int(4, 8); return { s: R.pick([1, -1]), h: R.int(p + 1, q - 1), k: R.nz(-6, 9), p, q }; },
 build: ({ s, h, k, p, q }) => { const E = x => s * (x - h) * (x - h) + k, fp = E(p), fq = E(q), sup = s === 1 ? Math.max(fp, fq) : k, inf = s === 1 ? k : Math.min(fp, fq), spread = sup - inf,
  F = s === 1 ? `${sq(h)} ${k < 0 ? '−' : '+'} ${n(Math.abs(k))}` : `${n(k)} − ${sq(h)}`; return {
  prompt: `A drift gauge's error at temperature setting x is E(x) = ${F} millivolts (mV). It is certified on the closed range ${n(p)} ≤ x ≤ ${n(q)}, where both end points are included, so every value E takes at an end point really occurs. Enter sup E and then inf E over this range, then the spread, which is sup E − inf E.`,
  answer: [sup, inf, spread],
  hints: ['A square is never negative, so (x − h)² is 0 at x = h and grows as x moves away from h. Decide whether that point lies inside the range, and what it makes E there.', 'On a closed range the end values are attained. Work out E at both end points and compare them with the value at x = h.'],
  solution: `The square ${sq(h)} is never negative and is 0 only at x = ${n(h)}, so E is ${s === 1 ? 'smallest' : 'largest'} at x = ${n(h)}, which lies inside the range, and E(${n(h)}) = ${n(k)}. At the end points E(${n(p)}) = ${n(fp)} and E(${n(q)}) = ${n(fq)}, and both ends are in the range. So sup E = ${n(sup)} and inf E = ${n(inf)}, and the spread is ${n(sup)} − ${par(inf)} = ${n(spread)} mV.`,
  guidance: [
   { prompt: `What is E at the left end, x = ${n(p)}?`, answer: [fp], explanation: `E(${n(p)}) = ${n(fp)}, and this value occurs because the end point is included.` },
   { prompt: `What is E at the right end, x = ${n(q)}?`, answer: [fq], explanation: `E(${n(q)}) = ${n(fq)}.` },
   { prompt: `The vertex value is E(${n(h)}) = ${n(k)}. What is the spread sup E − inf E?`, answer: [spread], explanation: `${s === 1 ? 'E is smallest at the vertex' : 'E is largest at the vertex'}, and the other extreme is the ${s === 1 ? 'larger' : 'smaller'} end value, so sup E = ${n(sup)} and inf E = ${n(inf)}. The spread is ${n(sup)} − ${par(inf)} = ${n(spread)}.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'The probe between two beacons',
 brief: 'A probe totals its distance to two beacons while it moves along a track, and the audit needs the least and greatest total, and whether the greatest is reached.',
 labels: ['sup f (km)', 'inf f (km)', 'sup attained (1 or 0)'], tolerance: 0.005,
 gl: [['f at the left end (km)'], ['f at the right end (km)'], ['sup f (km)'], ['inf f (km)']]
}, {
 /* f(x) = |x − a| + |x − b| with a < b and p < a, b < q. Between the beacons f = b − a (the infimum, attained); outside it rises by 2 per unit.
    The ends give f(p) = a + b − 2p and f(q) = 2q − a − b. form 0: open range, the supremum is not attained; form 1: closed range, it is attained. */
 canonical: { form: 0, a: 1, b: 3, p: -2, q: 7 },
 draw: R => { const a = R.int(-3, 3), b = a + R.int(1, 4); return { form: R.int(0, 1), a, b, p: a - R.int(1, 4), q: b + R.int(1, 4) }; },
 build: ({ form, a, b, p, q }) => { const fp = a + b - 2 * p, fq = 2 * q - a - b, sup = Math.max(fp, fq), inf = b - a, sign = form === 0 ? '<' : '≤', att = form; return {
  prompt: `Two beacons stand on a straight track at positions ${n(a)} and ${n(b)} (in km). A probe at position x is told f(x) = ${ab(a)} + ${ab(b)}, the sum of its distances to the two beacons, in km. The probe may be at any real position x with ${n(p)} ${sign} x ${sign} ${n(q)}. Enter sup f, then inf f over these positions, then 1 if sup f is a value f actually takes (it is attained) or 0 if it is not.`,
  answer: [sup, inf, att],
  hints: ['|x − a| is the distance from x to a. Between the two beacons the two distances add up to the gap between the beacons, whatever x is. Outside, moving one step further out adds a step to each distance.', 'Look at whether the end points of the range are positions the probe can take: a value found at an end point is reached only if they are. Compare the two end values.'],
  solution: `Between the beacons, for ${n(a)} ≤ x ≤ ${n(b)}, the distances ${ab(a)} and ${ab(b)} add to the gap ${n(b)} − ${par(a)} = ${n(inf)}, and anywhere else f is larger, so inf f = ${n(inf)}, attained at every such x. Moving outside the beacons raises f by 2 for each unit, so f is largest at an end of the range: f(${n(p)}) = ${n(fp)} and f(${n(q)}) = ${n(fq)}. So sup f = ${n(sup)}. ${form === 0 ? 'The ends are not in the range, so sup f is approached but not reached: enter 0.' : 'The ends are in the range, so sup f is reached: enter 1.'}`,
  guidance: [
   { prompt: `What is f at the left end, x = ${n(p)}?`, answer: [fp], explanation: `${ab(a)} + ${ab(b)} at x = ${n(p)} is ${n(a - p)} + ${n(b - p)} = ${n(fp)}.` },
   { prompt: `What is f at the right end, x = ${n(q)}?`, answer: [fq], explanation: `${ab(a)} + ${ab(b)} at x = ${n(q)} is ${n(q - a)} + ${n(q - b)} = ${n(fq)}.` },
   { prompt: `What is sup f over the range?`, answer: [sup], explanation: `f rises as x moves away from the beacons, so the larger of the two end values is the supremum: ${n(sup)}.` },
   { prompt: `What is inf f? It is the sum of the distances for a position between the beacons.`, answer: [inf], explanation: `For ${n(a)} ≤ x ≤ ${n(b)} the distances add to the gap ${n(inf)}, and that is the smallest value: inf f = ${n(inf)}.` }
  ] }; }
});

})();
