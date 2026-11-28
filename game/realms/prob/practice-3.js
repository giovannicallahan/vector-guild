/* Probability practice missions, file 3 of 8: concepts q11–q15, three practice missions each
   (q11b q11c q11d q12b q12c q12d q13b q13c q13d q14b q14c q14d q15b q15c q15d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/prob/oracle-p3.js. */
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
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const edge = (x, d) => { const s = x * Math.pow(10, d), f = s - Math.floor(s); return Math.abs(f - 0.5) < 1e-6; };
const exact = (x, d) => { const s = x * Math.pow(10, d); return Math.abs(s - Math.round(s)) < 1e-9; };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fx = (x, d) => x.toFixed(d);
const sum = list => list.reduce((s, v) => s + v, 0);
const s = (k, one, many) => k === 1 ? one : many;
/* A value to 4 decimal places as written: exact if it has at most 4, otherwise cut (not rounded) with “…” after it. */
const dig4 = x => { if (Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6) return n(x); const t = Math.trunc(x * 1e4 + Math.sign(x) * 1e-7) / 1e4; return (t < 0 ? '−' : '') + Math.abs(t).toFixed(4) + '…'; };
/* A table of `count` probabilities in hundredths, each between lo and hi, adding up to 100. */
const table = (R, count, lo, hi) => { for (;;) { const p = []; let left = 100; for (let i = 0; i < count - 1; i++) { const v = R.int(lo, hi); p.push(v); left -= v; } if (left >= lo && left <= hi) { p.push(left); return p; } } };
const P = v => n(rd(v / 100, 4));

/* ---- q11 Chapter review: tables, trees and rules mixed [IS 3.3, 3.4] ---- */

mk({
 id: 'q11b', parent: 'q11', kind: 'setting', title: 'The spare power cells',
 brief: 'The shed keeps spare power cells in two bins, and the stores clerk wants two chances worked out before she empties one.',
 labels: ['P(Bin 2 | flat)', 'P(Bin 1 or charged)'], tolerance: 0.0005,
 gl: [['flat cells in all', 'flat cells in Bin 2'], ['P(Bin 2 | flat)'], ['cells in Bin 1 or charged', 'P(Bin 1 or charged)']]
}, {
 canonical: { T: 250, a: 118, b: 34, c: 62, d: 36 },
 draw: R => { for (;;) { const T = R.pick([200, 250, 500]), b = R.int(10, Math.floor(T * 0.15)), d = R.int(10, Math.floor(T * 0.15)),
   a = R.int(Math.floor(T * 0.25), Math.floor(T * 0.6)), c = T - a - b - d, x = d / (b + d);
   if (c < 10 || exact(x, 4) || edge(x, 3)) continue; return { T, a, b, c, d }; } },
 build: ({ T, a, b, c, d }) => { const f = b + d, x = d / f, cond = rd(x, 3), or = a + b + c, por = or / T; return {
  prompt: `The sorting shed counted ${n(T)} spare power cells by bin and charge. Bin 1: ${n(a)} charged, ${n(b)} flat. Bin 2: ${n(c)} charged, ${n(d)} flat. One cell is picked at random. Enter P(Bin 2 | flat), the probability that it came from Bin 2 given that it is flat, to 3 decimal places. Then enter P(Bin 1 or charged) as a decimal.`,
  answer: [cond, por],
  hints: ['Given flat, only the flat cells count: divide the flat cells that are in Bin 2 by all the flat cells.', 'For “or”, add the cells in Bin 1 and the charged cells, take away the cells counted twice (in Bin 1 and charged), and divide by the total.'],
  solution: `The flat cells are ${n(b)} + ${n(d)} = ${n(f)} in all, and ${n(d)} of them are in Bin 2, so P(Bin 2 | flat) = ${n(d)} ÷ ${n(f)} = ${dig4(x)}, which is ${fx(cond, 3)} to 3 decimal places. Bin 1 holds ${n(a + b)} cells and ${n(a + c)} cells are charged, and ${n(a)} cells are both. By the addition rule, P(Bin 1 or charged) = (${n(a + b)} + ${n(a + c)} − ${n(a)}) ÷ ${n(T)} = ${n(or)} ÷ ${n(T)} = ${n(por)}.`,
  guidance: [
   { prompt: 'How many cells are flat in all, and how many of those flat cells are in Bin 2?', answer: [f, d], explanation: `${n(b)} flat in Bin 1 and ${n(d)} flat in Bin 2 make ${n(f)} flat cells. Given flat, only these ${n(f)} count, and ${n(d)} of them are in Bin 2.` },
   { prompt: `What is ${n(d)} ÷ ${n(f)}, to 3 decimal places?`, answer: [cond], explanation: `${n(d)} ÷ ${n(f)} = ${dig4(x)}, which rounds to ${n(cond)}. That is P(Bin 2 | flat).` },
   { prompt: `Bin 1 holds ${n(a + b)} cells, ${n(a + c)} cells are charged, and ${n(a)} are in Bin 1 and charged. How many cells are in Bin 1 or charged, and what is that divided by ${n(T)}?`, answer: [or, por], explanation: `The ${n(a)} charged cells in Bin 1 sit in both groups, so they are taken away once: ${n(a + b)} + ${n(a + c)} − ${n(a)} = ${n(or)}, and ${n(or)} ÷ ${n(T)} = ${n(por)}.` }
  ] }; }
});

mk({
 id: 'q11c', parent: 'q11', kind: 'applied', title: 'The return pile',
 brief: 'The shed will send back a pile of crates, and the quartermaster wants to know how big it is and how bad.',
 labels: ['crates sent back', 'P(sent back)', 'P(cracked | sent back)'], tolerance: 0.0005,
 gl: [['Ridgeline crates', 'cracked crates'], ['crates sent back', 'P(sent back)'], ['P(cracked | sent back)']]
}, {
 canonical: { T: 250, a: 96, b: 24, c: 88, d: 42 },
 draw: R => { for (;;) { const T = R.pick([200, 250, 500]), b = R.int(10, Math.floor(T * 0.15)), d = R.int(10, Math.floor(T * 0.2)),
   c = R.int(Math.floor(T * 0.25), Math.floor(T * 0.45)), a = T - b - c - d, x = (b + d) / (c + d + b);
   if (a < 10 || exact(x, 4) || edge(x, 3)) continue; return { T, a, b, c, d }; } },
 build: ({ T, a, b, c, d }) => { const r = c + d, k = b + d, back = r + k - d, pb = back / T, x = k / back, ans = rd(x, 3); return {
  prompt: `The shed sends back every crate that is from Ridgeline or is cracked, and keeps the rest. Its log of ${n(T)} crates reads: Northway ${n(a)} sound, ${n(b)} cracked; Ridgeline ${n(c)} sound, ${n(d)} cracked. Enter the number of crates sent back, then P(a crate picked at random is sent back) as a decimal. Then one crate is picked from the pile that was sent back: enter the probability that it is cracked, to 3 decimal places.`,
  answer: [back, pb, ans],
  hints: ['Count the Ridgeline crates and the cracked crates, then take away the crates that are in both so that nothing is counted twice.', 'The pile sent back is now the whole group you are choosing from. Divide the cracked crates in it by the size of the pile.'],
  solution: `Ridgeline sent ${n(c)} + ${n(d)} = ${n(r)} crates, and ${n(b)} + ${n(d)} = ${n(k)} crates are cracked. The ${n(d)} cracked Ridgeline crates are in both groups, so the pile has ${n(r)} + ${n(k)} − ${n(d)} = ${n(back)} crates, and P(sent back) = ${n(back)} ÷ ${n(T)} = ${n(pb)}. Given that a crate is in the pile, only the ${n(back)} crates count, and ${n(k)} of them are cracked: ${n(k)} ÷ ${n(back)} = ${dig4(x)}, which is ${fx(ans, 3)} to 3 decimal places.`,
  guidance: [
   { prompt: 'How many crates came from Ridgeline, and how many crates are cracked in all, from both suppliers?', answer: [r, k], explanation: `Ridgeline: ${n(c)} + ${n(d)} = ${n(r)}. Cracked: ${n(b)} + ${n(d)} = ${n(k)}.` },
   { prompt: `Add those two counts and take away the ${n(d)} cracked Ridgeline crates counted twice. How many crates are sent back, and what is that divided by ${n(T)}?`, answer: [back, pb], explanation: `${n(r)} + ${n(k)} − ${n(d)} = ${n(back)}, and ${n(back)} ÷ ${n(T)} = ${n(pb)}.` },
   { prompt: `Of the ${n(back)} crates in the pile, ${n(k)} are cracked. What is ${n(k)} ÷ ${n(back)}, to 3 decimal places?`, answer: [ans], explanation: `Every cracked crate is in the pile, so the cracked crates in it are all ${n(k)}. ${n(k)} ÷ ${n(back)} = ${dig4(x)}, about ${n(ans)}.` }
  ] }; }
});

mk({
 id: 'q11d', parent: 'q11', kind: 'challenge', uses: 'q09', title: 'Do leaks follow the dock?',
 brief: 'The shed suspects one dock handles its canisters badly, and wants the table to show whether the dock and the leaks are linked.',
 labels: ['P(leaking | Dock West)', 'P(Dock West or leaking)', 'independent (1 yes, 0 no)'], tolerance: 0.0005,
 gl: [['Dock West canisters', 'leaking canisters'], ['P(leaking | Dock West)'], ['P(Dock West or leaking)'], ['independent (1 yes, 0 no)']]
}, {
 canonical: { r: 80, k: 60, d: 30 },
 /* 200 canisters; Dock West r, leaking k, both d. Half the draws are exactly independent (d = r × k ÷ 200), the rest are off by 3 to 6. */
 draw: R => { for (;;) { const r = 10 * R.int(4, 16), k = 10 * R.int(3, 10), d0 = r * k / 200; if (!Number.isInteger(d0) || d0 < 9) continue;
   const ind = R.int(0, 1) === 1, d = ind ? d0 : d0 + R.pick([-1, 1]) * R.int(3, 6), a = 200 - r - k + d;
   if (a < 10 || r - d < 6 || k - d < 6 || d < 6 || (!ind && (exact(d / r, 4) || edge(d / r, 3)))) continue; return { r, k, d }; } },
 build: ({ r, k, d }) => { const T = 200, a = T - r - k + d, b = k - d, c = r - d, x = d / r, or = r + k - d, por = or / T, pr = r / T, pk = k / T, prod = rd(pr * pk, 6), both = d / T, ind = d * T === r * k ? 1 : 0;
  return {
  prompt: `The shed logged ${n(T)} coolant canisters by dock and seal. Dock East: ${n(a)} sealed, ${n(b)} leaking. Dock West: ${n(c)} sealed, ${n(d)} leaking. One canister is picked at random. Enter P(leaking | Dock West) to 3 decimal places, then P(Dock West or leaking) as a decimal. Last, check whether the dock and the leaking are independent: events are independent when P(Dock West and leaking) = P(Dock West) × P(leaking). Enter 1 if they are independent here, 0 if not.`,
  answer: [rd(x, 3), por, ind],
  hints: ['Given Dock West, only its canisters count: divide its leaking canisters by all of its canisters. For “or”, add the groups and take away the canisters in both.', 'Work out P(Dock West and leaking) from the table, then P(Dock West) × P(leaking) from the row total and the leaking total. Independent means the two are equal.'],
  solution: `Dock West has ${n(c)} + ${n(d)} = ${n(r)} canisters, ${n(d)} of them leaking, so P(leaking | Dock West) = ${n(d)} ÷ ${n(r)} = ${exact(x, 3) ? n(x) : `${dig4(x)}, which is ${fx(rd(x, 3), 3)} to 3 decimal places`}. ${n(b)} + ${n(d)} = ${n(k)} canisters leak in all, so P(Dock West or leaking) = (${n(r)} + ${n(k)} − ${n(d)}) ÷ ${n(T)} = ${n(or)} ÷ ${n(T)} = ${n(por)}. For independence: P(Dock West and leaking) = ${n(d)} ÷ ${n(T)} = ${n(rd(both, 6))}, and P(Dock West) × P(leaking) = ${n(pr)} × ${n(pk)} = ${n(prod)}. ${ind ? 'They are equal, so the events are independent: enter 1.' : 'They are not equal, so the events are not independent: enter 0.'}`,
  guidance: [
   { prompt: 'How many canisters are from Dock West, and how many canisters leak in all, from both docks?', answer: [r, k], explanation: `Dock West: ${n(c)} + ${n(d)} = ${n(r)}. Leaking: ${n(b)} + ${n(d)} = ${n(k)}.` },
   { prompt: `Given Dock West, ${n(d)} of its ${n(r)} canisters leak. What is P(leaking | Dock West), to 3 decimal places?`, answer: [rd(x, 3)], explanation: `${n(d)} ÷ ${n(r)} = ${exact(x, 3) ? n(x) : `${dig4(x)}, which rounds to ${n(rd(x, 3))}`}.` },
   { prompt: `Add the Dock West canisters and the leaking canisters, take away the ${n(d)} counted twice, and divide by ${n(T)}. What is P(Dock West or leaking)?`, answer: [por], explanation: `${n(r)} + ${n(k)} − ${n(d)} = ${n(or)}, and ${n(or)} ÷ ${n(T)} = ${n(por)}.` },
   { prompt: `Compare P(Dock West and leaking) = ${n(d)} ÷ ${n(T)} with P(Dock West) × P(leaking) = ${n(r)}/${n(T)} × ${n(k)}/${n(T)}. Enter 1 if they are equal, 0 if not.`, answer: [ind], explanation: `${n(rd(both, 6))} and ${n(prod)} ${ind ? 'are equal, so the events are independent.' : 'are different, so the events are not independent.'}` }
  ] }; }
});

/* ---- q12 Bayes' rule: reversing a condition [PDS 3.4] ---- */

/* Alerts counted out of 10000: carriers b % (hit h %), others (false alarm f %). Not the worked example (1 %, 80 %, 10 %)
   nor the learn mission (2 %, 90 %, 5 %). The answer is not near 0, 1 or one half, and never on a rounding boundary. */
const bayesOk = x => !(exact(x, 4) || x < 0.03 || x > 0.95 || Math.abs(x - 0.5) < 0.02 || edge(x, 3));

mk({
 id: 'q12b', parent: 'q12', kind: 'setting', title: 'The water sensor alarm',
 brief: 'The water sensor in the bay has just gone off for one tank, and Mira needs to know how much to trust it.',
 labels: ['tanks that raise an alert', 'P(carrying | alert)'], tolerance: 0.0005,
 gl: [['tanks carrying it', 'carriers that alert'], ['other tanks', 'false alerts'], ['tanks that alert', 'P(carrying | alert)']]
}, {
 canonical: { b: 3, h: 95, f: 4 },
 draw: R => { for (;;) { const b = R.int(2, 9), h = R.int(80, 99), f = R.int(2, 12), x = b * h / (b * h + (100 - b) * f);
   if ((b === 2 && h === 90 && f === 5) || !bayesOk(x)) continue; return { b, h, f }; } },
 build: ({ b, h, f }) => { const car = 100 * b, oth = 10000 - car, tp = b * h, fp = (100 - b) * f, pos = tp + fp, x = tp / pos, ans = rd(x, 3); return {
  prompt: `The medical bay’s water sensor checks storage tanks for a bacterium. ${n(b)}% of tanks carry it. The sensor raises an alert for ${n(h)}% of tanks that carry the bacterium, and it raises a false alert for ${n(f)}% of tanks that do not. Picture 10000 tanks checked. Enter how many of them raise an alert (type it without commas). Then enter P(carrying | alert), the probability that a tank that raised an alert really carries the bacterium, to 3 decimal places.`,
  answer: [pos, ans],
  hints: ['Split the 10000 tanks first: how many carry the bacterium and how many do not? Then find how many of each group raise an alert.', 'The alerts are the carriers’ alerts plus the false alerts. P(carrying | alert) is the carriers’ alerts out of all the alerts.'],
  solution: `Out of 10000 tanks, ${n(b)}% is ${n(car)} carriers and ${n(oth)} tanks that do not carry it. Of the carriers, ${n(h)}% raise an alert: ${n(tp)}. Of the others, ${n(f)}% raise a false alert: ${n(fp)}. So ${n(tp)} + ${n(fp)} = ${n(pos)} tanks raise an alert, and P(carrying | alert) = ${n(tp)} ÷ ${n(pos)} = ${dig4(x)}, which is ${fx(ans, 3)} to 3 decimal places. Most alerts are ${x < 0.5 ? 'false alarms' : 'real'}.`,
  guidance: [
   { prompt: 'How many of the 10000 tanks carry the bacterium, and how many of those raise an alert?', answer: [car, tp], explanation: `${n(b)}% of 10000 is ${n(car)}, and ${n(h)}% of ${n(car)} is ${n(tp)}.` },
   { prompt: 'How many of the 10000 tanks do not carry it, and how many of those raise a false alert?', answer: [oth, fp], explanation: `10000 − ${n(car)} = ${n(oth)}, and ${n(f)}% of ${n(oth)} is ${n(fp)}.` },
   { prompt: 'How many tanks raise an alert in all, and what share of them carry the bacterium, to 3 decimal places?', answer: [pos, ans], explanation: `${n(tp)} + ${n(fp)} = ${n(pos)} alerts, of which ${n(tp)} are real: ${n(tp)} ÷ ${n(pos)} = ${dig4(x)}, about ${n(ans)}.` }
  ] }; }
});

mk({
 id: 'q12c', parent: 'q12', kind: 'applied', title: 'A clear result, how clear?',
 brief: 'An allergy screen has come back negative for a crew member, and the medic wants to know how safe that result really is.',
 labels: ['allergic crew who test negative', 'crew who test negative', 'P(no allergy | negative)'], tolerance: 0.0005,
 gl: [['allergic crew', 'allergic and negative'], ['clear and negative', 'crew who test negative'], ['P(no allergy | negative)']]
}, {
 canonical: { b: 4, m: 10, f: 6 },
 draw: R => { for (;;) { const b = R.int(2, 10), m = R.int(5, 30), f = R.int(2, 12), neg = b * m + (100 - b) * (100 - f), x = (100 - b) * (100 - f) / neg;
   if (exact(x, 4) || edge(x, 3) || x > 0.9985) continue; return { b, m, f }; } },
 build: ({ b, m, f }) => { const ill = 100 * b, well = 10000 - ill, miss = b * m, ok = (100 - b) * (100 - f), neg = miss + ok, x = ok / neg, ans = rd(x, 3); return {
  prompt: `A crew member’s allergy screen comes back negative. ${n(b)}% of the crew have the allergy. The screen misses ${n(m)}% of crew who have it, giving them a negative result, and it correctly gives a negative result to ${n(100 - f)}% of crew who do not have it. Picture 10000 crew screened. Enter how many allergic crew test negative, then how many crew test negative in all (type it without commas). Then enter P(no allergy | negative), the probability that a crew member with a negative result really has no allergy, to 3 decimal places.`,
  answer: [miss, neg, ans],
  hints: ['Split the 10000 crew into those with the allergy and those without. A negative result can come from either group.', 'Count the negatives in each group and add them. Then divide the negatives who have no allergy by all the negatives.'],
  solution: `Out of 10000 crew, ${n(b)}% is ${n(ill)} with the allergy and ${n(well)} without. The screen misses ${n(m)}% of the allergic crew: ${n(miss)} test negative. It gives a correct negative to ${n(100 - f)}% of the ${n(well)}: ${n(ok)}. So ${n(miss)} + ${n(ok)} = ${n(neg)} test negative, and P(no allergy | negative) = ${n(ok)} ÷ ${n(neg)} = ${dig4(x)}, which is ${fx(ans, 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `How many of the 10000 crew have the allergy, and how many of them are missed by the screen (test negative)?`, answer: [ill, miss], explanation: `${n(b)}% of 10000 is ${n(ill)}, and ${n(m)}% of ${n(ill)} is ${n(miss)}.` },
   { prompt: `${n(well)} crew do not have the allergy. How many of them test negative, and how many crew test negative in all?`, answer: [ok, neg], explanation: `${n(100 - f)}% of ${n(well)} is ${n(ok)}. Adding the missed allergic crew: ${n(miss)} + ${n(ok)} = ${n(neg)}.` },
   { prompt: `What share of the ${n(neg)} negative results belong to crew with no allergy, to 3 decimal places?`, answer: [ans], explanation: `${n(ok)} ÷ ${n(neg)} = ${dig4(x)}, about ${n(ans)}.` }
  ] }; }
});

mk({
 id: 'q12d', parent: 'q12', kind: 'challenge', uses: 'q10', title: 'Two decks, one screen',
 brief: 'The crew live on two decks with different infection rates, and the bay needs one honest figure for a positive screen.',
 labels: ['percentage of all crew who carry it', 'P(carrier | positive)'], tolerance: 0.0005,
 gl: [['carriers on Deck A', 'carriers on Deck B'], ['percentage who carry it'], ['carriers who test positive', 'false alarms'], ['P(carrier | positive)']]
}, {
 canonical: { sA: 40, rA: 2, rB: 7, h: 90, f: 5 },
 /* Out of 10000 crew the counts of carriers, of true positives and of false alarms are whole numbers. */
 draw: R => { for (let t = 0; t < 5000; t++) { const sA = 10 * R.int(2, 8), rA = R.int(1, 10), rB = R.int(1, 10), h = R.int(70, 98), f = R.int(2, 12), C = sA * rA + (100 - sA) * rB;
   if (rA === rB || (C * h) % 100 || ((10000 - C) * f) % 100) continue; const tp = C * h / 100, fp = (10000 - C) * f / 100;
   if (!bayesOk(tp / (tp + fp)) || (sA === 40 && rA === 2 && rB === 7 && h === 90 && f === 5 && t > 0)) continue; return { sA, rA, rB, h, f }; }
  return { sA: 40, rA: 2, rB: 7, h: 90, f: 5 }; },
 build: ({ sA, rA, rB, h, f }) => { const sB = 100 - sA, cA = sA * rA, cB = sB * rB, C = cA + cB, base = C / 100, tp = C * h / 100, fp = (10000 - C) * f / 100, pos = tp + fp, x = tp / pos, ans = rd(x, 3); return {
  prompt: `The crew live on two decks. Deck A holds ${n(sA)}% of the crew, and ${n(rA)}% of them carry a virus. Deck B holds the other ${n(sB)}%, and ${n(rB)}% of them carry it. The medical bay’s screen is positive for ${n(h)}% of carriers, and it gives a false alarm for ${n(f)}% of crew who do not carry the virus. Picture 10000 crew. Enter the percentage of all the crew who carry the virus. Then a crew member tests positive: enter P(carrier | positive) to 3 decimal places.`,
  answer: [base, ans],
  hints: ['Out of 10000 crew, find the carriers on each deck separately (the deck’s share of the crew, then its carrier rate), and add them. That is the base rate to use.', 'With the carriers and the non-carriers known, find how many of each test positive. P(carrier | positive) is the carriers’ positives out of all the positives.'],
  solution: `Deck A has ${n(sA * 100)} of the 10000 crew, and ${n(rA)}% of them carry the virus: ${n(cA)}. Deck B has ${n(sB * 100)}, and ${n(rB)}% carry it: ${n(cB)}. In all ${n(cA)} + ${n(cB)} = ${n(C)} carriers out of 10000, which is ${n(base)}%. Of the carriers, ${n(h)}% test positive: ${n(tp)}. The other ${n(10000 - C)} crew get a false alarm ${n(f)}% of the time: ${n(fp)}. So ${n(tp)} + ${n(fp)} = ${n(pos)} test positive, and P(carrier | positive) = ${n(tp)} ÷ ${n(pos)} = ${dig4(x)}, which is ${fx(ans, 3)} to 3 decimal places.`,
  guidance: [
   { prompt: `Deck A has ${n(sA * 100)} of the 10000 crew and Deck B has ${n(sB * 100)}. How many carriers are on each deck?`, answer: [cA, cB], explanation: `Deck A: ${n(rA)}% of ${n(sA * 100)} is ${n(cA)}. Deck B: ${n(rB)}% of ${n(sB * 100)} is ${n(cB)}.` },
   { prompt: 'Add the carriers on the two decks. What percentage of the 10000 crew is that?', answer: [base], explanation: `${n(cA)} + ${n(cB)} = ${n(C)} carriers, and ${n(C)} out of 10000 is ${n(base)}%.` },
   { prompt: `How many carriers test positive, and how many of the ${n(10000 - C)} crew who are not carriers get a false alarm?`, answer: [tp, fp], explanation: `${n(h)}% of ${n(C)} is ${n(tp)}, and ${n(f)}% of ${n(10000 - C)} is ${n(fp)}.` },
   { prompt: `What share of the ${n(pos)} positive results are carriers, to 3 decimal places?`, answer: [ans], explanation: `${n(tp)} ÷ ${n(pos)} = ${dig4(x)}, about ${n(ans)}.` }
  ] }; }
});

/* ---- q13 Odds for and against [CM 7.7] ---- */

/* Pairs a : b in lowest terms, a > b, a + b dividing 1000, so b ÷ (a + b) is an exact decimal. */
const oddsPairs = (() => { const out = []; for (let a = 2; a <= 24; a++) for (let b = 1; b < a; b++) if (gcd(a, b) === 1 && [4, 5, 8, 10, 20, 25].includes(a + b)) out.push([a, b]); return out; })();

mk({
 id: 'q13b', parent: 'q13', kind: 'setting', title: 'Vials in transit',
 brief: 'The pharmacist quotes odds on her vials and the cold store keeps a percentage log, and the two need to be written the same way.',
 labels: ['P(vial cracks)', 'odds in favour, first number', 'odds in favour, second number'], tolerance: 0.0005,
 gl: [['parts in all', 'parts for cracking'], ['P(vial cracks)'], ['odds in favour, first number', 'odds in favour, second number']]
}, {
 canonical: { a: 7, b: 3, x: 64 },
 draw: R => { const [a, b] = R.pick(oddsPairs); return { a, b, x: R.except(5, 95, [50, 20, 80]) }; },
 build: ({ a, b, x }) => { const t = a + b, pr = b / t, g = gcd(x, 100 - x), A = x / g, B = (100 - x) / g; return {
  prompt: `The pharmacist says the odds against a vial cracking in transit are ${n(a)} : ${n(b)}. Enter the probability that a vial cracks, as a decimal. Then the cold store’s door holds through ${n(x)}% of nights. Enter the odds in favour of the door holding as two whole numbers in lowest terms, the first and then the second of the pair.`,
  answer: [pr, A, B],
  hints: [`Odds of ${n(a)} : ${n(b)} against mean ${n(a)} ${s(a, 'part', 'parts')} against cracking and ${n(b)} ${s(b, 'part', 'parts')} for it. A probability is the parts for it out of all the parts.`, `The door holds on ${n(x)} nights in every 100 and fails on the rest. Odds in favour compare the two counts, so write them as a pair and divide both by the largest whole number that goes into both.`],
  solution: `${n(a)} parts against and ${n(b)} for make ${n(t)} parts in all, so the probability that a vial cracks is ${n(b)} ÷ ${n(t)} = ${n(pr)}. The door holds on ${n(x)} nights in 100 and fails on ${n(100 - x)}, so the odds in favour are ${n(x)} : ${n(100 - x)}${g > 1 ? `. Both divide by ${n(g)}, which gives ${n(A)} : ${n(B)}` : `, which is already in lowest terms`}.`,
  guidance: [
   { prompt: `Odds of ${n(a)} : ${n(b)} against. How many parts are there in all, and how many of them are for the vial cracking?`, answer: [t, b], explanation: `${n(a)} + ${n(b)} = ${n(t)} parts. The odds are against cracking, so the ${n(b)} ${s(b, 'part is', 'parts are')} for it.` },
   { prompt: `What is ${n(b)} out of ${n(t)}, as a decimal?`, answer: [pr], explanation: `${n(b)} ÷ ${n(t)} = ${n(pr)}, the probability that a vial cracks.` },
   { prompt: `The door holds on ${n(x)} nights out of 100 and fails on ${n(100 - x)}. Write the odds ${n(x)} : ${n(100 - x)} in lowest terms: the first and then the second number.`, answer: [A, B], explanation: `${g > 1 ? `Both ${n(x)} and ${n(100 - x)} divide by ${n(g)}: ${n(x)} ÷ ${n(g)} = ${n(A)} and ${n(100 - x)} ÷ ${n(g)} = ${n(B)}, so the odds are ${n(A)} : ${n(B)}.` : `No whole number above 1 goes into both ${n(x)} and ${n(100 - x)}, so the odds stay ${n(x)} : ${n(100 - x)}.`}` }
  ] }; }
});

mk({
 id: 'q13c', parent: 'q13', kind: 'applied', title: 'Flu jabs for the winter',
 brief: 'The medic’s chart gives a probability, the stores clerk wants it as odds, and the order for flu jabs needs a head count.',
 labels: ['odds against, first number', 'odds against, second number', 'crew expected to need a jab'], tolerance: 0.0005,
 gl: [['P(no jab needed)'], ['odds against, first number', 'odds against, second number'], ['crew expected to need a jab']]
}, {
 canonical: { x: 42, N: 150 },
 draw: R => { for (;;) { const x = R.except(5, 95, [20, 50, 35]), N = R.pick([40, 50, 60, 80, 100, 120, 150, 200]); if ((x * N) % 100 === 0) return { x, N }; } },
 build: ({ x, N }) => { const p = x / 100, q = rd(1 - p, 2), g = gcd(100 - x, x), A = (100 - x) / g, B = x / g, ex = x * N / 100; return {
  prompt: `The medic’s chart says the probability that a crew member needs a flu jab this winter is ${n(p)}. Enter the odds against needing a jab as two whole numbers in lowest terms, the first and then the second of the pair. Then the outpost has ${n(N)} crew: enter how many of them are expected to need a jab.`,
  answer: [A, B, ex],
  hints: [`The chance of not needing a jab is the complement. Odds against compare that chance with ${n(p)}: multiply both by 100, then divide both by the largest whole number that goes into both.`, 'The expected number is the probability times the number of crew, just as it was for a count of runs in a long log.'],
  solution: `The probability of not needing a jab is 1 − ${n(p)} = ${n(q)}. The odds against are ${n(q)} : ${n(p)} = ${n(100 - x)} : ${n(x)}${g > 1 ? `, and dividing both by ${n(g)} gives ${n(A)} : ${n(B)}` : `, which is already in lowest terms`}. Out of ${n(N)} crew, expect ${n(N)} × ${n(p)} = ${n(ex)} to need a jab.`,
  guidance: [
   { prompt: `What is the probability that a crew member does not need a jab?`, answer: [q], explanation: `By the complement rule it is 1 − ${n(p)} = ${n(q)}.` },
   { prompt: `Write ${n(q)} : ${n(p)} as two whole numbers in lowest terms. What are they?`, answer: [A, B], explanation: `Times 100 the pair is ${n(100 - x)} : ${n(x)}${g > 1 ? `; both divide by ${n(g)}, giving ${n(A)} : ${n(B)}` : `, and no whole number above 1 goes into both`}.` },
   { prompt: `How many of the ${n(N)} crew should be expected to need a jab?`, answer: [ex], explanation: `${n(N)} × ${n(p)} = ${n(ex)}.` }
  ] }; }
});

mk({
 id: 'q13d', parent: 'q13', kind: 'challenge', uses: 'q06', title: 'Odds on a late shuttle',
 brief: 'The shuttle with the bay’s medical stock can be held up two ways, and the dispatcher wants the odds against it being late.',
 labels: ['P(relay or storm)', 'odds against, first number', 'odds against, second number'], tolerance: 0.0005,
 gl: [['P(relay or storm)'], ['P(on time)'], ['odds against, first number', 'odds against, second number']]
}, {
 canonical: { pa: 42, pb: 33, pab: 11 },
 draw: R => { for (;;) { const pa = R.int(20, 60), pb = R.int(10, 45), pab = R.int(3, Math.min(pa, pb) - 5), L = pa + pb - pab;
   if (L < 25 || L > 85 || L === 50 || L === 60 || gcd(L, 100) === 100) continue; return { pa, pb, pab }; } },
 build: ({ pa, pb, pab }) => { const L = pa + pb - pab, pl = L / 100, ot = 100 - L, g = gcd(ot, L), A = ot / g, B = L / g; return {
  prompt: `The shuttle carrying the medical bay’s stock is late if the radio relay drops out, if a dust storm blows in, or both. P(relay drops out) = ${n(pa / 100)}, P(storm) = ${n(pb / 100)}, and P(relay drops out and storm) = ${n(pab / 100)}. Enter P(relay or storm) as a decimal. Then enter the odds against the shuttle being late as two whole numbers in lowest terms, the first and then the second of the pair.`,
  answer: [pl, A, B],
  hints: ['Use the addition rule: add the two probabilities and take away the chance of both, which was counted twice.', 'Odds against compare the chance of not being late with the chance of being late. Multiply both by 100, then divide both by the largest whole number that goes into both.'],
  solution: `By the addition rule, P(relay or storm) = ${n(pa / 100)} + ${n(pb / 100)} − ${n(pab / 100)} = ${n(pl)}. The shuttle is on time with probability 1 − ${n(pl)} = ${n(ot / 100)}. The odds against being late are ${n(ot / 100)} : ${n(pl)} = ${n(ot)} : ${n(L)}${g > 1 ? `, and dividing both by ${n(g)} gives ${n(A)} : ${n(B)}` : `, which is already in lowest terms`}.`,
  guidance: [
   { prompt: `Add ${n(pa / 100)} and ${n(pb / 100)}, then take away ${n(pab / 100)}. What is P(relay or storm)?`, answer: [pl], explanation: `${n(pa / 100)} + ${n(pb / 100)} − ${n(pab / 100)} = ${n(pl)}.` },
   { prompt: 'What is the probability that the shuttle is not late?', answer: [ot / 100], explanation: `By the complement rule it is 1 − ${n(pl)} = ${n(ot / 100)}.` },
   { prompt: `Write ${n(ot / 100)} : ${n(pl)} as two whole numbers in lowest terms. What are they?`, answer: [A, B], explanation: `Times 100 the pair is ${n(ot)} : ${n(L)}${g > 1 ? `; both divide by ${n(g)}, giving ${n(A)} : ${n(B)}` : `, and no whole number above 1 goes into both`}.` }
  ] }; }
});

/* ---- q14 Random variables and probability distributions [IS 4.1] ---- */

mk({
 id: 'q14b', parent: 'q14', kind: 'setting', title: 'Doses per visit',
 brief: 'The bay’s chart of antiseptic doses per visit has a smudged entry, and the medic needs it filled before she orders stock.',
 labels: ['missing probability', 'P(X ≤ k)'], tolerance: 0.005,
 gl: [['sum of the three known'], ['missing probability'], ['P(X ≤ k)']]
}, {
 canonical: { p: [20, 35, 30, 15], m: 1, k: 1 },
 draw: R => ({ p: table(R, 4, 5, 60), m: R.int(0, 3), k: R.int(1, 2) }),
 build: ({ p, m, k }) => { const known = p.filter((_, i) => i !== m), sk = sum(known), miss = p[m] / 100, head = p.slice(0, k + 1), atMost = sum(head) / 100;
  const list = p.map((v, i) => `P(X = ${i}) = ${i === m ? '?' : P(v)}`).join(', ');
  const headText = head.map((_, j) => `P(X = ${j})`).join(' + '), headNums = head.map(v => P(v)).join(' + '), vals = head.map((_, j) => j).join(', ').replace(/, (\d+)$/, ' or $1'); return {
  prompt: `Mira logs X, the number of antiseptic doses a patient is given at one visit. The probability distribution is ${list}, and X is never more than 3. Enter the missing probability P(X = ${m}), then P(X ≤ ${k}), the probability that a patient is given ${k === 1 ? 'at most 1 dose' : `at most ${k} doses`}.`,
  answer: [miss, atMost],
  hints: ['A distribution covers every value X can take, so all its probabilities add up to 1. Take the three you know away from 1.', `X ≤ ${k} means X is ${vals}. These cannot happen at once, so add their probabilities, using the one you found if it is among them.`],
  solution: `The three known probabilities add up to ${known.map(P).join(' + ')} = ${P(sk)}, so P(X = ${m}) = 1 − ${P(sk)} = ${n(miss)}. Then P(X ≤ ${k}) = ${headText} = ${headNums} = ${n(atMost)}.`,
  guidance: [
   { prompt: 'Add up the three probabilities you are given. What do they come to?', answer: [sk / 100], explanation: `${known.map(P).join(' + ')} = ${P(sk)}.` },
   { prompt: `All four probabilities add up to 1. What is P(X = ${m})?`, answer: [miss], explanation: `1 − ${P(sk)} = ${n(miss)}.` },
   { prompt: `Now add ${headText}. What is P(X ≤ ${k})?`, answer: [atMost], explanation: `${headNums} = ${n(atMost)}.` }
  ] }; }
});

mk({
 id: 'q14c', parent: 'q14', kind: 'applied', title: 'Beds for the night shift',
 brief: 'The ward has only a few spare beds each night, and the medic wants to know how often it will overflow.',
 labels: ['missing probability', 'P(overflow)', 'overflow nights expected'], tolerance: 0.005,
 gl: [['missing probability'], ['P(overflow)'], ['overflow nights expected']]
}, {
 canonical: { p: [10, 25, 30, 20, 10, 5], m: 3, k: 3, D: 40 },
 draw: R => { for (;;) { const p = table(R, 6, 3, 35), m = R.int(0, 5), k = R.int(2, 4), D = R.pick([20, 25, 40, 50, 100]), t = sum(p.slice(k + 1));
   if ((D * t) % 100 === 0) return { p, m, k, D }; } },
 build: ({ p, m, k, D }) => { const known = p.filter((_, i) => i !== m), sk = sum(known), miss = p[m] / 100, tail = p.slice(k + 1), t = sum(tail), pt = t / 100, ex = D * t / 100;
  const list = p.map((v, i) => `P(X = ${i}) = ${i === m ? '?' : P(v)}`).join(', ');
  const vals = tail.map((_, j) => k + 1 + j).join(', ').replace(/, (\d+)$/, ' or $1'), tailText = tail.map((_, j) => `P(X = ${k + 1 + j})`).join(' + '), tailNums = tail.map(v => P(v)).join(' + '); return {
  prompt: `The ward has ${n(k)} spare beds each night. X is the number of new patients who arrive in a night, and its probability distribution is ${list}, with X never more than 5. Enter the missing probability P(X = ${m}). Then enter P(overflow), the probability that more patients arrive than there are spare beds. Last, enter how many of the next ${n(D)} nights are expected to overflow.`,
  answer: [miss, pt, ex],
  hints: ['The probabilities of a distribution add up to 1, so take the five you know away from 1.', `Overflow means X is greater than ${n(k)}, which is ${vals}. Add those probabilities. The expected number of nights is the probability of overflow times the number of nights.`],
  solution: `The five known probabilities add up to ${known.map(P).join(' + ')} = ${P(sk)}, so P(X = ${m}) = 1 − ${P(sk)} = ${n(miss)}. Overflow means X > ${n(k)}, so P(overflow) = ${tailText} = ${tailNums} = ${n(pt)}. Over ${n(D)} nights expect ${n(D)} × ${n(pt)} = ${n(ex)} ${s(ex, 'night', 'nights')} of overflow.`,
  guidance: [
   { prompt: 'Add up the five probabilities you are given and take the total away from 1. What is the missing probability?', answer: [miss], explanation: `${known.map(P).join(' + ')} = ${P(sk)}, and 1 − ${P(sk)} = ${n(miss)}.` },
   { prompt: `Overflow means X is ${vals}. Add those probabilities. What is P(overflow)?`, answer: [pt], explanation: `${tailText} = ${tailNums} = ${n(pt)}.` },
   { prompt: `How many of the next ${n(D)} nights should be expected to overflow?`, answer: [ex], explanation: `${n(D)} × ${n(pt)} = ${n(ex)}.` }
  ] }; }
});

mk({
 id: 'q14d', parent: 'q14', kind: 'challenge', uses: 'q02', title: 'A queue log with a hole',
 brief: 'Mira’s log of the morning queue at the bay has a smudged count, and the distribution must be built from the log before it can be used.',
 labels: ['missing count', 'P(X = m)', 'P(X ≥ k)'], tolerance: 0.005,
 gl: [['missing count'], ['P(X = m)'], ['P(X ≥ k)']]
}, {
 canonical: { c: [16, 50, 70, 44, 20], N: 200, m: 3, k: 2 },
 /* c is the list of counts out of N (N a multiple of 100, so every relative frequency has at most 2 decimals). */
 draw: R => { const N = R.pick([100, 200, 500]), p = table(R, 5, 4, 45); return { c: p.map(v => v * N / 100), N, m: R.int(0, 4), k: R.int(1, 3) }; },
 build: ({ c, N, m, k }) => { const known = c.filter((_, i) => i !== m), sk = sum(known), miss = c[m], pm = miss / N, tail = c.slice(k), pt = sum(tail) / N;
  const parts = c.map((v, i) => `${n(i)} crew on ${i === m ? 'a smudged number of' : n(v)} ${s(v, 'morning', 'mornings')}`);
  const items = c.map((_, i) => i === m ? 'the smudged count' : `${n(c[i])}`);
  const tailText = tail.map((_, j) => `P(X = ${k + j})`).join(' + '), tailNums = tail.map(v => n(rd(v / N, 4))).join(' + '); return {
  prompt: `Over ${n(N)} mornings Mira logged X, the number of crew waiting at the medical bay when it opens: ${parts.join('; ')}. The counts add up to ${n(N)}. Treat each relative frequency (a count ÷ ${n(N)}) as the probability of that value of X. Enter the smudged count, then P(X = ${m}) as a decimal, then P(X ≥ ${k}) as a decimal.`,
  answer: [miss, pm, pt],
  hints: [`The counts add up to ${n(N)} mornings, so take the counts you can see away from ${n(N)}.`, 'A relative frequency is the count divided by the number of mornings. For “at least”, add the probabilities of the values it covers.'],
  solution: `The visible counts add up to ${known.map(v => n(v)).join(' + ')} = ${n(sk)}, so the smudged count is ${n(N)} − ${n(sk)} = ${n(miss)}. Then P(X = ${m}) = ${n(miss)} ÷ ${n(N)} = ${n(pm)}. For P(X ≥ ${k}) add ${tailText} = ${tail.map(v => n(v)).join(' + ')} out of ${n(N)}, which is ${tailNums} = ${n(rd(pt, 4))}.`,
  guidance: [
   { prompt: `Add up the counts you can see and take the total away from ${n(N)}. What is the smudged count?`, answer: [miss], explanation: `${known.map(v => n(v)).join(' + ')} = ${n(sk)}, and ${n(N)} − ${n(sk)} = ${n(miss)}.` },
   { prompt: `Divide the smudged count by ${n(N)}. What is P(X = ${m})?`, answer: [pm], explanation: `${n(miss)} ÷ ${n(N)} = ${n(pm)}.` },
   { prompt: `Add the counts for X = ${tail.map((_, j) => k + j).join(', ')} and divide by ${n(N)}. What is P(X ≥ ${k})?`, answer: [pt], explanation: `${tail.map(v => n(v)).join(' + ')} = ${n(sum(tail))}, and ${n(sum(tail))} ÷ ${n(N)} = ${n(rd(pt, 4))}.` }
  ] }; }
});

/* ---- q15 Expected value E(X) = Σ x P(x) [IS 4.2, CM 7.11] ---- */

mk({
 id: 'q15b', parent: 'q15', kind: 'setting', title: 'Doses to stock',
 brief: 'The pharmacy shelf holds antiseptic doses, and the medic needs the average a visit uses so that the shelf does not run dry.',
 labels: ['E(X), doses a visit', 'doses over the visits'], tolerance: 0.005,
 gl: [['product for 1', 'product for 2', 'product for 3', 'product for 4'], ['E(X)'], ['doses over the visits']]
}, {
 canonical: { p: [15, 35, 30, 20], D: 20 },
 draw: R => { for (;;) { const p = table(R, 4, 5, 55); if (p.join() === '25,40,20,15') continue; return { p, D: R.pick([10, 20, 30, 40, 50]) }; } },
 build: ({ p, D }) => { const terms = p.map((v, i) => (i + 1) * v / 100), mu = sum(p.map((v, i) => (i + 1) * v)) / 100, tot = rd(mu * D, 2);
  const list = p.map((v, i) => `P(X = ${i + 1}) = ${P(v)}`).join(', '); return {
  prompt: `X is the number of antiseptic doses a patient is given at one visit to the medical bay, and a patient always gets at least one: ${list}. Enter the expected value E(X), the mean number of doses per visit. Then enter the number of doses to expect over the next ${n(D)} visits.`,
  answer: [mu, tot],
  hints: ['Multiply each value of X by its probability. This time the smallest value is 1, so no term is zero.', 'E(X) is the sum of those products. Over many visits the doses average E(X) a visit, so multiply it by the number of visits.'],
  solution: `E(X) = 1 × ${P(p[0])} + 2 × ${P(p[1])} + 3 × ${P(p[2])} + 4 × ${P(p[3])} = ${terms.map(t => n(rd(t, 4))).join(' + ')} = ${n(mu)} doses a visit. Over ${n(D)} visits expect ${n(D)} × ${n(mu)} = ${n(tot)} doses.`,
  guidance: [
   { prompt: 'Multiply each value of X by its probability. What are the four products, for 1, 2, 3 and 4?', answer: terms.map(t => rd(t, 4)), explanation: `1 × ${P(p[0])} = ${n(rd(terms[0], 4))}, 2 × ${P(p[1])} = ${n(rd(terms[1], 4))}, 3 × ${P(p[2])} = ${n(rd(terms[2], 4))} and 4 × ${P(p[3])} = ${n(rd(terms[3], 4))}.` },
   { prompt: 'Add the products. What is E(X)?', answer: [mu], explanation: `${terms.map(t => n(rd(t, 4))).join(' + ')} = ${n(mu)}, so the mean is ${n(mu)} doses a visit.` },
   { prompt: `How many doses should the bay expect over ${n(D)} visits?`, answer: [tot], explanation: `${n(D)} × ${n(mu)} = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q15c', parent: 'q15', kind: 'applied', title: 'The spares budget',
 brief: 'Every scanner repair eats into the spares fund, and the quartermaster wants the expected cost for the budget sheet.',
 labels: ['E(X), repairs a day', 'expected cost a day', 'expected cost over the days'], tolerance: 0.005,
 gl: [['E(X)'], ['expected cost a day'], ['expected cost over the days']]
}, {
 canonical: { p: [15, 30, 30, 15, 10], c: 12, D: 20 },
 draw: R => ({ p: table(R, 5, 5, 40), c: R.pick([4, 6, 8, 12, 15, 20]), D: R.pick([10, 20, 25, 30]) }),
 build: ({ p, c, D }) => { const mu = sum(p.map((v, i) => i * v)) / 100, day = rd(mu * c, 2), tot = rd(mu * c * D, 2);
  const list = p.map((v, i) => `P(X = ${i}) = ${P(v)}`).join(', '), terms = p.map((v, i) => n(rd(i * v / 100, 4))); return {
  prompt: `Each scanner repair uses spare parts worth ${n(c)} credits. X is the number of repairs the medical bay needs in a day: ${list}. Enter E(X), the mean number of repairs a day. Then enter the expected cost of spares in credits for one day, and last the expected cost over the next ${n(D)} days (type it without commas).`,
  answer: [mu, day, tot],
  hints: ['Multiply each value of X by its probability and add the products to get E(X).', 'The expected cost is the expected number of repairs times the cost of one repair. For several days, multiply the cost for one day by the number of days.'],
  solution: `E(X) = ${p.map((v, i) => `${n(i)} × ${P(v)}`).join(' + ')} = ${terms.join(' + ')} = ${n(mu)} repairs a day. Each repair costs ${n(c)} credits, so the expected cost for a day is ${n(mu)} × ${n(c)} = ${n(day)} credits. Over ${n(D)} days it is ${n(D)} × ${n(day)} = ${n(tot)} credits.`,
  guidance: [
   { prompt: 'Multiply each value of X by its probability and add the products. What is E(X)?', answer: [mu], explanation: `${terms.join(' + ')} = ${n(mu)} repairs a day.` },
   { prompt: `One repair costs ${n(c)} credits. What is the expected cost of spares for one day?`, answer: [day], explanation: `${n(mu)} × ${n(c)} = ${n(day)} credits.` },
   { prompt: `What is the expected cost of spares over ${n(D)} days?`, answer: [tot], explanation: `${n(D)} × ${n(day)} = ${n(tot)} credits.` }
  ] }; }
});

mk({
 id: 'q15d', parent: 'q15', kind: 'challenge', uses: 'q14', title: 'Oxygen cartridges by the night',
 brief: 'The bay’s oxygen log has a smudged entry, and the stores clerk needs the average use before she can plan the cartridge order.',
 labels: ['missing probability', 'E(X), cartridges a night', 'cartridges over the nights'], tolerance: 0.005,
 gl: [['missing probability'], ['E(X)'], ['cartridges over the nights']]
}, {
 canonical: { p: [8, 22, 30, 20, 12, 8], m: 2, D: 30 },
 draw: R => ({ p: table(R, 6, 3, 35), m: R.int(1, 5), D: R.pick([10, 20, 30, 40, 50]) }),
 build: ({ p, m, D }) => { const known = p.filter((_, i) => i !== m), sk = sum(known), miss = p[m] / 100, terms = p.map((v, i) => rd(i * v / 100, 4)), mu = sum(p.map((v, i) => i * v)) / 100, tot = rd(mu * D, 2);
  const list = p.map((v, i) => `P(X = ${i}) = ${i === m ? '?' : P(v)}`).join(', '); return {
  prompt: `X is the number of oxygen cartridges the medical bay uses in a night, and X is never more than 5: ${list}. The probabilities of a distribution add up to 1. Enter the missing probability P(X = ${m}). Then enter E(X), the mean number of cartridges a night, using the missing probability too. Last, enter the number of cartridges to expect over the next ${n(D)} nights.`,
  answer: [miss, mu, tot],
  hints: ['Take the five probabilities you know away from 1 to fill the gap. Then every value of X has its probability.', 'Multiply each value of X by its probability and add the products, including the filled-in entry. Over many nights the use averages E(X) a night, so multiply it by the number of nights.'],
  solution: `The five known probabilities add up to ${known.map(P).join(' + ')} = ${P(sk)}, so P(X = ${m}) = 1 − ${P(sk)} = ${n(miss)}. Then E(X) = ${p.map((v, i) => `${n(i)} × ${P(v)}`).join(' + ')} = ${terms.map(t => n(t)).join(' + ')} = ${n(mu)} cartridges a night. Over ${n(D)} nights expect ${n(D)} × ${n(mu)} = ${n(tot)} cartridges.`,
  guidance: [
   { prompt: 'Add up the five probabilities you are given and take the total away from 1. What is the missing probability?', answer: [miss], explanation: `${known.map(P).join(' + ')} = ${P(sk)}, and 1 − ${P(sk)} = ${n(miss)}.` },
   { prompt: 'Multiply each value of X by its probability and add the products. What is E(X)?', answer: [mu], explanation: `${terms.map(t => n(t)).join(' + ')} = ${n(mu)} cartridges a night.` },
   { prompt: `How many cartridges should the bay expect to use over ${n(D)} nights?`, answer: [tot], explanation: `${n(D)} × ${n(mu)} = ${n(tot)}.` }
  ] }; }
});

})();
