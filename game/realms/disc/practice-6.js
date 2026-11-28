/* Discrete mathematics practice missions, file 6 of 8: concepts q26–q30, three practice missions each
   (q26b q26c q26d q27b q27c q27d q28b q28c q28d q29b q29c q29d q30b q30c q30d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/disc/oracle-p6.js. */
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
const sub = k => String(k).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
const sup = k => String(k).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
const list = a => a.map(x => n(x)).join(', ');
const pv = (co, k) => co.reduce((s, x, i) => s + x * Math.pow(k, i), 0);
const seqOf = (co, len) => Array.from({ length: len }, (_, i) => pv(co, i + 1));
const ordn = ['First', 'Second', 'Third'];
const rowsOf = (seq, levels) => { const out = []; let cur = seq; for (let i = 0; i < levels; i++) { const p = cur; cur = p.slice(1).map((v, j) => v - p[j]); out.push(cur); } return out; };
const rowsText = rows => rows.map((r, i) => `${ordn[i]} differences: ${list(r)}.`).join(' ');
/* Extends the difference rows by one entry, from the constant row up. */
const extend = (seq, rows) => {
 const L = rows.length, steps = []; let below = rows[L - 1][0];
 steps.push(`the next ${ordn[L - 1].toLowerCase()} difference is the constant ${n(below)}`);
 for (let i = L - 2; i >= 0; i--) { const last = rows[i][rows[i].length - 1], v = last + below; steps.push(`the next ${ordn[i].toLowerCase()} difference is ${n(last)} + ${n(below)} = ${n(v)}`); below = v; }
 const lastT = seq[seq.length - 1];
 return { text: steps.join(', '), top: below, next: lastT + below };
};
const geoT = (a, r, m) => a * Math.pow(r, m - 1);
const geoS = (a, r, m) => a * (Math.pow(r, m) - 1) / (r - 1);
const arS = (m, f, d) => m * (2 * f + (m - 1) * d) / 2;
const cf = (c, x) => c === 1 ? n(x) : `${n(c)} × ${n(x)}`;
const cr = c => c === 1 ? '' : n(c);
const rec = (c, d, a0, a1, len) => { const s = [a0, a1]; while (s.length < len) { const i = s.length; s.push(c * s[i - 1] + d * s[i - 2]); } return s; };
const recStep = (c, d, s, i) => `a${sub(i)} = ${cf(c, s[i - 1])} + ${cf(d, s[i - 2])} = ${n(s[i])}`;
const ruleTxt = (c, d) => `aₙ = ${cr(c)}aₙ₋₁ + ${cr(d)}aₙ₋₂`;
const amt = (p, q) => `${p === 1 ? '' : n(p)}n + ${n(q)}`;

/* ---- q26 Geometric sequences and their sums [Levin 2.2] ---- */

mk({
 id: 'q26b', parent: 'q26', kind: 'setting', title: 'Calls down the comms mast',
 brief: 'The comms mast relays more calls every hour than the hour before, and the dome wants the busiest hour and the day’s total.',
 labels: ['calls in the last hour', 'total calls'], tolerance: 0.01,
 gl: [['power of the ratio', 'calls in the last hour'], ['rⁿ − 1'], ['total calls']]
}, {
 canonical: { a: 5, r: 3, m: 6 },
 draw: R => { const r = R.pick([2, 3, 4]); return { a: R.int(2, 6), r, m: R.int(5, r === 4 ? 6 : 7) }; },
 build: ({ a, r, m }) => { const pw = Math.pow(r, m - 1), t = a * pw, rm = Math.pow(r, m), s = geoS(a, r, m); return {
  prompt: `The comms mast logs ${n(a)} relayed calls in its first hour, and each hour after that it relays ${n(r)} times as many calls as the hour before. Enter the number of calls in hour ${n(m)}, then the total number of calls relayed over the first ${n(m)} hours. Type each count without commas.`,
  answer: [t, s],
  hints: [`The first hour has had no multiplying yet, so hour ${n(m)} has had ${n(m - 1)} multiplications by ${n(r)}.`, `For the total use a₁ × (rⁿ − 1) ÷ (r − 1), where n is the number of hours added up.`],
  solution: `The calls form a geometric sequence with a₁ = ${n(a)} and common ratio ${n(r)}, so a${sub(m)} = ${n(a)} × ${n(r)}${sup(m - 1)} = ${n(a)} × ${n(pw)} = ${n(t)} calls. The sum of the first ${n(m)} terms is ${n(a)} × (${n(r)}${sup(m)} − 1) ÷ (${n(r)} − 1) = ${n(a)} × ${n(rm - 1)} ÷ ${n(r - 1)} = ${n(s)} calls.`,
  guidance: [
   { prompt: `What is ${n(r)}${sup(m - 1)}, and how many calls come in hour ${n(m)}?`, answer: [pw, t], explanation: `${n(r)}${sup(m - 1)} = ${n(pw)}, so hour ${n(m)} has ${n(a)} × ${n(pw)} = ${n(t)} calls.` },
   { prompt: `What is ${n(r)}${sup(m)} − 1?`, answer: [rm - 1], explanation: `${n(r)}${sup(m)} = ${n(rm)}, and one less is ${n(rm - 1)}.` },
   { prompt: `What is the total, ${n(a)} × ${n(rm - 1)} ÷ (${n(r)} − 1)?`, answer: [s], explanation: `${n(a)} × ${n(rm - 1)} = ${n(a * (rm - 1))}, divided by ${n(r - 1)} is ${n(s)} calls.` }
  ] }; }
});

mk({
 id: 'q26c', parent: 'q26', kind: 'applied', title: 'Ration packs for the dome',
 brief: 'Ration packs are packed in growing batches each week, and the stores clerk needs the final batch, the total and the bill.',
 labels: ['packs in the last week', 'total packs', 'total cost'], tolerance: 0.01,
 gl: [['packs in the last week'], ['total packs'], ['total cost']]
}, {
 canonical: { a: 4, r: 3, m: 6, k: 7 },
 draw: R => ({ a: R.int(2, 5), r: R.pick([2, 3]), m: R.int(5, 7), k: R.int(2, 9) }),
 build: ({ a, r, m, k }) => { const t = geoT(a, r, m), s = geoS(a, r, m), cost = s * k; return {
  prompt: `The ration store packs ${n(a)} packs in week 1, and every later week it packs ${n(r)} times as many as the week before. Each pack costs ${n(k)} credits. Enter the number of packs made in week ${n(m)}, then the total number of packs made over the first ${n(m)} weeks, then the total cost of all those packs in credits. Type each number without commas.`,
  answer: [t, s, cost],
  hints: ['The packs per week form a geometric sequence. Find a₁ and the common ratio, then use aₙ = a₁ × rⁿ⁻¹ for the last week.', 'Use the sum formula for the total number of packs. The cost is the total packs times the cost of one pack.'],
  solution: `The weekly packs are a geometric sequence with a₁ = ${n(a)} and ratio ${n(r)}. Week ${n(m)}: ${n(a)} × ${n(r)}${sup(m - 1)} = ${n(a)} × ${n(Math.pow(r, m - 1))} = ${n(t)} packs. Total: ${n(a)} × (${n(r)}${sup(m)} − 1) ÷ (${n(r)} − 1) = ${n(a)} × ${n(Math.pow(r, m) - 1)} ÷ ${n(r - 1)} = ${n(s)} packs. Cost: ${n(s)} × ${n(k)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Find the packs made in week ${n(m)}: a₁ × rⁿ⁻¹ with a₁ = ${n(a)}, r = ${n(r)} and n = ${n(m)}.`, answer: [t], explanation: `${n(r)}${sup(m - 1)} = ${n(Math.pow(r, m - 1))}, so ${n(a)} × ${n(Math.pow(r, m - 1))} = ${n(t)} packs.` },
   { prompt: `Find the total packs over the first ${n(m)} weeks with a₁ × (rⁿ − 1) ÷ (r − 1).`, answer: [s], explanation: `${n(r)}${sup(m)} − 1 = ${n(Math.pow(r, m) - 1)}, and ${n(a)} × ${n(Math.pow(r, m) - 1)} ÷ ${n(r - 1)} = ${n(s)} packs.` },
   { prompt: `Each pack costs ${n(k)} credits. What is the total cost of ${n(s)} packs?`, answer: [cost], explanation: `${n(s)} × ${n(k)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q26d', parent: 'q26', kind: 'challenge', uses: 'q25', title: 'Multiplying against steady',
 brief: 'Two supply lines feed the yard, one that multiplies and one that adds the same amount, and Mira wants to know which wins by the end.',
 labels: ['geometric line total', 'steady line total', 'geometric lead'], tolerance: 0.01,
 gl: [['steady line last week'], ['geometric line total', 'steady line total'], ['geometric lead']]
}, {
 canonical: { a: 3, r: 3, m: 7, f: 14, d: 9 },
 draw: R => { let p; do { p = { a: R.int(2, 6), r: R.pick([2, 3]), m: R.int(6, 8), f: R.int(10, 30), d: R.int(4, 15) }; } while (geoS(p.a, p.r, p.m) <= arS(p.m, p.f, p.d)); return p; },
 build: ({ a, r, m, f, d }) => { const g = geoS(a, r, m), last = f + (m - 1) * d, s = arS(m, f, d), diff = g - s; return {
  prompt: `Two supply lines run for ${n(m)} weeks. The growing line delivers ${n(a)} crates in week 1, and each week after that ${n(r)} times as many as the week before. The steady line delivers ${n(f)} crates in week 1, and each week after that ${n(d)} more than the week before. Enter the total crates the growing line delivers over the ${n(m)} weeks, then the total the steady line delivers, then how many more crates the growing line delivers than the steady line. Type each number without commas.`,
  answer: [g, s, diff],
  hints: ['One line is geometric and one is arithmetic. For the geometric total use a₁ × (rⁿ − 1) ÷ (r − 1).', 'For the arithmetic total find the last term, a₁ + (n − 1)d, then use the number of terms × (first + last) ÷ 2.'],
  solution: `The growing line is geometric: ${n(a)} × (${n(r)}${sup(m)} − 1) ÷ (${n(r)} − 1) = ${n(a)} × ${n(Math.pow(r, m) - 1)} ÷ ${n(r - 1)} = ${n(g)} crates. The steady line is arithmetic: its last term is ${n(f)} + ${n(m - 1)} × ${n(d)} = ${n(last)}, so its total is ${n(m)} × (${n(f)} + ${n(last)}) ÷ 2 = ${n(s)} crates. The difference is ${n(g)} − ${n(s)} = ${n(diff)} crates.`,
  guidance: [
   { prompt: `What does the steady line deliver in week ${n(m)}? Start from ${n(f)} and add ${n(d)} each week.`, answer: [last], explanation: `Week ${n(m)} is ${n(m - 1)} steps after week 1: ${n(f)} + ${n(m - 1)} × ${n(d)} = ${n(last)} crates.` },
   { prompt: `What are the two totals: the growing line (geometric sum) and the steady line (arithmetic sum)?`, answer: [g, s], explanation: `Growing: ${n(a)} × ${n(Math.pow(r, m) - 1)} ÷ ${n(r - 1)} = ${n(g)}. Steady: ${n(m)} × (${n(f)} + ${n(last)}) ÷ 2 = ${n(s)}.` },
   { prompt: 'How many more crates does the growing line deliver?', answer: [diff], explanation: `${n(g)} − ${n(s)} = ${n(diff)} crates.` }
  ] }; }
});

/* ---- q27 Finite differences and polynomial fitting [Levin 2.3] ---- */

mk({
 id: 'q27b', parent: 'q27', kind: 'setting', title: 'Glasshouse panel readings',
 brief: 'A heat panel on the glasshouse roof is read once a day, and the gardeners want tomorrow’s reading from the pattern.',
 labels: ['degree', 'constant difference', 'next reading'], tolerance: 0.01,
 gl: [['first difference 1', 'first difference 2'], ['degree', 'constant difference'], ['next reading']]
}, {
 canonical: { g: 3, a: 1, b: 2, c: 4, e: 1 },
 draw: R => { const g = R.pick([2, 3]); return { g, a: R.int(1, 4), b: R.int(0, 6), c: R.int(0, 9), e: g === 3 ? R.int(1, 2) : 0 }; },
 build: ({ g, a, b, c, e }) => { const co = [c, b, a, e], seq = seqOf(co, 6), rows = rowsOf(seq, g), k = rows[g - 1][0], x = extend(seq, rows), nm = ordn[g - 1].toLowerCase(); return {
  prompt: `A heat panel on the glasshouse roof is read once a day. Over six days the readings were ${list(seq)}. Assume they follow the simplest polynomial in the day number that fits them: the one of lowest degree, so that once a row of differences is constant, it stays constant. Use finite differences: enter the degree, then the constant difference at that level, then the reading to expect on day 7.`,
  answer: [g, k, x.next],
  hints: ['Subtract each reading from the next to get the first differences, then do the same to those, and keep going until a row is constant.', 'Add one more copy of the constant at the bottom row, then work back up: each row’s new entry is its last entry plus the new entry of the row below.'],
  solution: `${rowsText(rows)} The ${nm} differences are constant at ${n(k)}, so the readings come from a polynomial of degree ${n(g)}. Extending the rows: ${x.text}. So day 7 reads ${n(seq[5])} + ${n(x.top)} = ${n(x.next)}.`,
  guidance: [
   { prompt: `What are the first two first differences, ${n(seq[1])} − ${n(seq[0])} and ${n(seq[2])} − ${n(seq[1])}?`, answer: [rows[0][0], rows[0][1]], explanation: `${n(seq[1])} − ${n(seq[0])} = ${n(rows[0][0])} and ${n(seq[2])} − ${n(seq[1])} = ${n(rows[0][1])}.` },
   { prompt: 'Keep taking differences of differences. At which level do they become constant, and what is the constant?', answer: [g, k], explanation: `${rowsText(rows)} The row at level ${n(g)} is constant, at ${n(k)}, so the degree is ${n(g)}.` },
   { prompt: 'Extend every row by one entry, from the constant row up. What is the reading on day 7?', answer: [x.next], explanation: `Extending the rows: ${x.text}. So day 7 reads ${n(seq[5])} + ${n(x.top)} = ${n(x.next)}.` }
  ] }; }
});

mk({
 id: 'q27c', parent: 'q27', kind: 'applied', title: 'Booking the truck',
 brief: 'A truck has to be booked for the crate line’s next two weeks together, and the booking needs both counts and their total.',
 labels: ['week 6 count', 'week 7 count', 'weeks 6 and 7 together'], tolerance: 0.01,
 gl: [['degree', 'constant difference'], ['week 6 count'], ['week 7 count', 'weeks 6 and 7 together']]
}, {
 canonical: { a: 2, b: 1, c: 5 },
 draw: R => ({ a: R.int(1, 5), b: R.int(0, 8), c: R.int(1, 9) }),
 build: ({ a, b, c }) => { const co = [c, b, a], seq = seqOf(co, 5), rows = rowsOf(seq, 2), s = rows[1][0], d4 = rows[0][3], f1 = d4 + s, w6 = seq[4] + f1, f2 = f1 + s, w7 = w6 + f2; return {
  prompt: `A crate line shipped ${list(seq)} crates in weeks 1 to 5. Mira assumes the counts follow the simplest polynomial in the week number that fits them, so that once a row of differences is constant, it stays constant. The truck booking covers weeks 6 and 7 together. Use finite differences to enter the count for week 6, the count for week 7, and the total for the two weeks.`,
  answer: [w6, w7, w6 + w7],
  hints: ['Take first differences, then second differences. When the second differences are all equal, that row is constant.', 'Extend the first differences by the constant, one entry per new week, and add each new first difference to the count before it.'],
  solution: `${rowsText(rows)} The second differences are constant at ${n(s)}, so the counts come from a polynomial of degree 2. The next first difference is ${n(d4)} + ${n(s)} = ${n(f1)}, so week 6 has ${n(seq[4])} + ${n(f1)} = ${n(w6)}. The one after is ${n(f1)} + ${n(s)} = ${n(f2)}, so week 7 has ${n(w6)} + ${n(f2)} = ${n(w7)}. Together: ${n(w6)} + ${n(w7)} = ${n(w6 + w7)}.`,
  guidance: [
   { prompt: `Take differences twice. At which level are they constant, and what is the constant? (First differences: ${list(rows[0])}.)`, answer: [2, s], explanation: `Second differences: ${list(rows[1])}. The row at level 2 is constant, at ${n(s)}, so the degree is 2.` },
   { prompt: `Extend the rows once. What is the count for week 6?`, answer: [w6], explanation: `The next first difference is ${n(d4)} + ${n(s)} = ${n(f1)}, so week 6 has ${n(seq[4])} + ${n(f1)} = ${n(w6)}.` },
   { prompt: 'Extend once more. What is the count for week 7, and the total for weeks 6 and 7?', answer: [w7, w6 + w7], explanation: `The next first difference is ${n(f1)} + ${n(s)} = ${n(f2)}, so week 7 has ${n(w6)} + ${n(f2)} = ${n(w7)}. Together: ${n(w6)} + ${n(w7)} = ${n(w6 + w7)}.` }
  ] }; }
});

mk({
 id: 'q27d', parent: 'q27', kind: 'challenge', uses: 'q25', title: 'Twenty weeks out',
 brief: 'The yard wants the crate count for week 20 without writing out twenty rows of differences.',
 labels: ['constant second difference', 'week 19 to 20 gain', 'week 20 count'], tolerance: 0.01,
 gl: [['constant second difference', 'first first difference'], ['week 19 to 20 gain'], ['sum of the 19 gains', 'week 20 count']]
}, {
 canonical: { a: 3, b: 2, c: 4 },
 draw: R => ({ a: R.int(2, 6), b: R.int(0, 9), c: R.int(1, 9) }),
 build: ({ a, b, c }) => { const co = [c, b, a], seq = seqOf(co, 5), rows = rowsOf(seq, 2), s = rows[1][0], d1 = rows[0][0], d19 = d1 + 18 * s, sum = arS(19, d1, s), t20 = seq[0] + sum; return {
  prompt: `A crate line shipped ${list(seq)} crates in weeks 1 to 5, and the counts follow a polynomial of degree 2 in the week number. Writing out rows of differences all the way to week 20 would take too long. The first differences themselves form an arithmetic sequence, so use that. Enter the constant second difference, then the gain from week 19 to week 20, then the count for week 20. Type each number without commas.`,
  answer: [s, d19, t20],
  hints: ['The second differences are all equal, and that equal number is the common difference of the first differences.', 'The count for week 20 is the week 1 count plus the 19 gains from week to week. Those 19 gains are an arithmetic sequence: add them with number of terms × (first + last) ÷ 2.'],
  solution: `${rowsText(rows)} The second differences are constant at ${n(s)}, so the first differences are an arithmetic sequence starting at ${n(d1)} with common difference ${n(s)}. The gain from week 19 to week 20 is the 19th first difference: ${n(d1)} + 18 × ${n(s)} = ${n(d19)}. The 19 gains add up to 19 × (${n(d1)} + ${n(d19)}) ÷ 2 = ${n(sum)}, so week 20 has ${n(seq[0])} + ${n(sum)} = ${n(t20)}.`,
  guidance: [
   { prompt: `Take first and second differences of ${list(seq)}. What is the constant second difference, and what is the first of the first differences?`, answer: [s, d1], explanation: `${rowsText(rows)} The constant is ${n(s)} and the first first difference is ${n(d1)}.` },
   { prompt: `The first differences start at ${n(d1)} and go up by ${n(s)} each time. What is the 19th one, the gain from week 19 to week 20?`, answer: [d19], explanation: `The 19th term is 18 steps after the first: ${n(d1)} + 18 × ${n(s)} = ${n(d19)}.` },
   { prompt: 'Add the 19 gains with number of terms × (first + last) ÷ 2. What is their sum, and what is the count for week 20?', answer: [sum, t20], explanation: `19 × (${n(d1)} + ${n(d19)}) ÷ 2 = ${n(sum)}, and ${n(seq[0])} + ${n(sum)} = ${n(t20)}.` }
  ] }; }
});

/* ---- q28 Recurrence relations and the Fibonacci numbers [Levin 2.1, 2.4] ---- */

mk({
 id: 'q28b', parent: 'q28', kind: 'setting', title: 'Seed packets by the week',
 brief: 'The seed bank’s packet count each week depends on the two weeks before it, and the greenhouse wants the count for weeks 5 and 7.',
 labels: ['a₅', 'a₇'], tolerance: 0.01,
 gl: [['a₂', 'a₃'], ['a₄', 'a₅'], ['a₆', 'a₇']]
}, {
 canonical: { c: 2, d: 1, a0: 1, a1: 4 },
 draw: R => { let p; do { p = { c: R.int(1, 3), d: R.int(1, 2), a0: R.int(1, 6), a1: R.int(1, 6) }; } while (rec(p.c, p.d, p.a0, p.a1, 8)[7] > 90000); return p; },
 build: ({ c, d, a0, a1 }) => { const s = rec(c, d, a0, a1, 8); return {
  prompt: `The seed bank’s count of packets follows the recurrence relation ${ruleTxt(c, d)} for n ≥ 2, with initial conditions a₀ = ${n(a0)} and a₁ = ${n(a1)}, where aₙ is the number of packets n weeks from now. Enter a₅, then a₇ (type each without commas).`,
  answer: [s[5], s[7]],
  hints: [`Each new term needs the two terms just before it. The first one you can build is a₂, from a₁ and a₀.`, 'Write the terms in a row from a₀ and keep going one term at a time, up to a₇.'],
  solution: `${[2, 3, 4, 5, 6].map(i => recStep(c, d, s, i)).join(', ')} and ${recStep(c, d, s, 7)}.`,
  guidance: [
   { prompt: `Use the rule with a₀ = ${n(a0)} and a₁ = ${n(a1)}. What are a₂ and a₃?`, answer: [s[2], s[3]], explanation: `${recStep(c, d, s, 2)} and ${recStep(c, d, s, 3)}.` },
   { prompt: 'Keep going. What are a₄ and a₅?', answer: [s[4], s[5]], explanation: `${recStep(c, d, s, 4)} and ${recStep(c, d, s, 5)}.` },
   { prompt: 'What are a₆ and a₇?', answer: [s[6], s[7]], explanation: `${recStep(c, d, s, 6)} and ${recStep(c, d, s, 7)}.` }
  ] }; }
});

mk({
 id: 'q28c', parent: 'q28', kind: 'applied', title: 'Seedling trays, week by week',
 brief: 'Each week’s seedling trays are set from the two weeks before, and the nursery needs the last count, the running total and the bill.',
 labels: ['a₆', 'total trays', 'total cost'], tolerance: 0.01,
 gl: [['a₂', 'a₃', 'a₄'], ['a₅', 'a₆'], ['total trays', 'total cost']]
}, {
 canonical: { c: 1, d: 1, a0: 2, a1: 3, k: 4 },
 draw: R => ({ c: R.int(1, 2), d: R.int(1, 2), a0: R.int(1, 5), a1: R.int(1, 5), k: R.int(2, 9) }),
 build: ({ c, d, a0, a1, k }) => { const s = rec(c, d, a0, a1, 7), tot = s.reduce((x, y) => x + y, 0), cost = tot * k; return {
  prompt: `The nursery sets out seedling trays by the rule ${ruleTxt(c, d)} for n ≥ 2, where aₙ is the number of trays set out in week n. It set out ${n(a0)} trays in week 0 and ${n(a1)} in week 1. Each tray costs ${n(k)} credits. Enter a₆, then the total number of trays set out over weeks 0 to 6, then the total cost of all those trays in credits. Type each number without commas.`,
  answer: [s[6], tot, cost],
  hints: ['Build the terms one at a time from the two starting counts: a₂ comes from a₁ and a₀.', 'The total is every term from a₀ to a₆ added together, which is seven terms. The cost is that total times the cost of one tray.'],
  solution: `${[2, 3, 4, 5, 6].map(i => recStep(c, d, s, i)).join(', ')}. The seven counts ${list(s)} add up to ${n(tot)} trays, which cost ${n(tot)} × ${n(k)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Use the rule with a₀ = ${n(a0)} and a₁ = ${n(a1)}. What are a₂, a₃ and a₄?`, answer: [s[2], s[3], s[4]], explanation: `${recStep(c, d, s, 2)}, ${recStep(c, d, s, 3)} and ${recStep(c, d, s, 4)}.` },
   { prompt: 'What are a₅ and a₆?', answer: [s[5], s[6]], explanation: `${recStep(c, d, s, 5)} and ${recStep(c, d, s, 6)}.` },
   { prompt: `Add all seven counts, a₀ to a₆, for the total trays. What does that cost at ${n(k)} credits a tray?`, answer: [tot, cost], explanation: `${list(s)} add up to ${n(tot)}, and ${n(tot)} × ${n(k)} = ${n(cost)} credits.` }
  ] }; }
});

mk({
 id: 'q28d', parent: 'q28', kind: 'challenge', uses: 'q24', title: 'Stock against demand',
 brief: 'The valve stock grows by a two-term rule while demand grows by a formula, and the yard wants to know if week 6 leaves any spare.',
 labels: ['a₆', 'b₆', 'spare valves'], tolerance: 0.01,
 gl: [['a₂', 'a₃'], ['a₄', 'a₅', 'a₆'], ['b₆', 'spare valves']]
}, {
 canonical: { c: 2, d: 3, a0: 4, a1: 5, m: 11, k: 30 },
 draw: R => { let p, s; do { p = { c: R.int(1, 3), d: R.int(1, 3), a0: R.int(1, 9), a1: R.int(1, 9), m: R.int(5, 40), k: R.int(10, 99) }; s = rec(p.c, p.d, p.a0, p.a1, 7); } while (s[6] <= 6 * p.m + p.k || s[6] > 90000); return p; },
 build: ({ c, d, a0, a1, m, k }) => { const s = rec(c, d, a0, a1, 7), b6 = 6 * m + k, sp = s[6] - b6; return {
  prompt: `The yard’s stock of valves follows the recurrence relation ${ruleTxt(c, d)} for n ≥ 2, with a₀ = ${n(a0)} and a₁ = ${n(a1)}, where aₙ is the stock in week n. The demand for valves has the closed formula bₙ = ${n(m)}n + ${n(k)}. Enter the stock a₆, then the demand b₆, then how many valves are spare in week 6 (stock minus demand). Type each number without commas.`,
  answer: [s[6], b6, sp],
  hints: ['Build the stock one term at a time, a₂ first. The demand needs no building: put n = 6 straight into its formula.', 'Spare valves are the stock in week 6 minus the demand in week 6.'],
  solution: `${[2, 3, 4, 5, 6].map(i => recStep(c, d, s, i)).join(', ')}. The demand is b₆ = ${n(m)} × 6 + ${n(k)} = ${n(b6)}. The spare valves are ${n(s[6])} − ${n(b6)} = ${n(sp)}.`,
  guidance: [
   { prompt: `Use the rule with a₀ = ${n(a0)} and a₁ = ${n(a1)}. What are a₂ and a₃?`, answer: [s[2], s[3]], explanation: `${recStep(c, d, s, 2)} and ${recStep(c, d, s, 3)}.` },
   { prompt: 'Keep going. What are a₄, a₅ and a₆?', answer: [s[4], s[5], s[6]], explanation: `${recStep(c, d, s, 4)}, ${recStep(c, d, s, 5)} and ${recStep(c, d, s, 6)}.` },
   { prompt: `Put n = 6 into bₙ = ${n(m)}n + ${n(k)}. What is the demand, and how many valves are spare?`, answer: [b6, sp], explanation: `b₆ = ${n(m)} × 6 + ${n(k)} = ${n(b6)}, and ${n(s[6])} − ${n(b6)} = ${n(sp)} valves are spare.` }
  ] }; }
});

/* ---- q29 Chapter review: forecasting stock [Levin 2.1–2.3] ---- */

mk({
 id: 'q29b', parent: 'q29', kind: 'setting', title: 'Three power lines',
 brief: 'Three power cell lines in the outpost charge by three different rules, and the grid desk needs one figure from each.',
 labels: ['line P total', 'line Q week count', 'line R week 6'], tolerance: 0.01,
 gl: [['common difference', 'line P total'], ['common ratio', 'line Q week count'], ['next first difference', 'line R week 6']]
}, {
 canonical: { f: 12, d: 5, n1: 9, a: 4, r: 3, n2: 6, A: 3, B: 0, C: 2 },
 draw: R => ({ f: R.int(5, 25), d: R.int(3, 9), n1: R.int(8, 12), a: R.int(2, 5), r: R.pick([2, 3]), n2: R.int(5, 7), A: R.int(1, 4), B: R.int(0, 5), C: R.int(1, 9) }),
 build: ({ f, d, n1, a, r, n2, A, B, C }) => { const P = [0, 1, 2, 3].map(i => f + i * d), Q = [0, 1, 2, 3].map(i => a * Math.pow(r, i)), seq = seqOf([C, B, A], 5), rows = rowsOf(seq, 2), s = rows[1][0], nf = rows[0][3] + s, w6 = seq[4] + nf, lastP = f + (n1 - 1) * d, sumP = arS(n1, f, d), qn = geoT(a, r, n2); return {
  prompt: `The grid desk watches three power cell lines. Line P: ${list(P)}, … (the same amount is added each week). Line Q: ${list(Q)}, … (each week is the same multiple of the week before). Line R: ${list(seq)}, … (assume the simplest polynomial in the week number that fits: once a row of differences is constant, it stays constant). Enter line P’s total over its first ${n(n1)} weeks, then line Q’s count in week ${n(n2)}, then line R’s count in week 6. Type each number without commas.`,
  answer: [sumP, qn, w6],
  hints: ['Line P is an arithmetic sequence and line Q a geometric one: find the common difference and the common ratio first.', 'For line R take differences until a row is constant, then extend every row by one entry.'],
  solution: `Line P has common difference ${n(d)}, so its week ${n(n1)} term is ${n(f)} + ${n(n1 - 1)} × ${n(d)} = ${n(lastP)} and the total is ${n(n1)} × (${n(f)} + ${n(lastP)}) ÷ 2 = ${n(sumP)}. Line Q has common ratio ${n(r)}, so week ${n(n2)} has ${n(a)} × ${n(r)}${sup(n2 - 1)} = ${n(qn)}. Line R has first differences ${list(rows[0])} and second differences ${list(rows[1])}, so the next first difference is ${n(rows[0][3])} + ${n(s)} = ${n(nf)} and week 6 has ${n(seq[4])} + ${n(nf)} = ${n(w6)}.`,
  guidance: [
   { prompt: `What is line P’s common difference, and what is its total over the first ${n(n1)} weeks?`, answer: [d, sumP], explanation: `Each week adds ${n(P[1])} − ${n(P[0])} = ${n(d)}. The last term is ${n(f)} + ${n(n1 - 1)} × ${n(d)} = ${n(lastP)}, so the total is ${n(n1)} × (${n(f)} + ${n(lastP)}) ÷ 2 = ${n(sumP)}.` },
   { prompt: `What is line Q’s common ratio, and what is its count in week ${n(n2)}?`, answer: [r, qn], explanation: `Each week is ${n(r)} times the one before. Week ${n(n2)} is ${n(n2 - 1)} multiplications after week 1: ${n(a)} × ${n(r)}${sup(n2 - 1)} = ${n(qn)}.` },
   { prompt: 'What is line R’s next first difference, and its count in week 6?', answer: [nf, w6], explanation: `The first differences ${list(rows[0])} grow by ${n(s)} each time, so the next is ${n(nf)}, and week 6 has ${n(seq[4])} + ${n(nf)} = ${n(w6)}.` }
  ] }; }
});

mk({
 id: 'q29c', parent: 'q29', kind: 'applied', title: 'One hold, three cargoes',
 brief: 'Three cargo lines share one freight hold in week 6, and the loadmaster needs each line’s count and the hold’s total.',
 labels: ['line A week 6', 'line B week 6', 'line C week 6', 'hold total'], tolerance: 0.01,
 gl: [['line A week 6', 'line B week 6'], ['line C week 6'], ['hold total']]
}, {
 canonical: { f: 9, d: 4, a: 5, r: 2, A: 4, B: 1, C: 3 },
 draw: R => ({ f: R.int(5, 25), d: R.int(3, 9), a: R.int(2, 6), r: R.pick([2, 3]), A: R.int(1, 5), B: R.int(0, 6), C: R.int(1, 9) }),
 build: ({ f, d, a, r, A, B, C }) => { const La = [0, 1, 2, 3].map(i => f + i * d), Lb = [0, 1, 2, 3].map(i => a * Math.pow(r, i)), seq = seqOf([C, B, A], 5), rows = rowsOf(seq, 2), s = rows[1][0], nf = rows[0][3] + s, c6 = seq[4] + nf, a6 = f + 5 * d, b6 = a * Math.pow(r, 5), tot = a6 + b6 + c6; return {
  prompt: `Three cargo lines ship to one freight hold. Line A: ${list(La)}, … (the same amount is added each week). Line B: ${list(Lb)}, … (each week is the same multiple of the week before). Line C: ${list(seq)}, … (assume the simplest polynomial in the week number that fits: once a row of differences is constant, it stays constant). Enter each line’s count in week 6 (A, then B, then C), then the total number of crates all three lines send to the hold in week 6. Type each number without commas.`,
  answer: [a6, b6, c6, tot],
  hints: ['Test each list: equal differences mean arithmetic, equal quotients mean geometric, and neither means taking differences of differences.', 'Find the three week 6 counts one at a time. The hold total is those three counts added together.'],
  solution: `Line A adds ${n(d)} each week, so week 6 is ${n(f)} + 5 × ${n(d)} = ${n(a6)}. Line B multiplies by ${n(r)} each week, so week 6 is ${n(a)} × ${n(r)}⁵ = ${n(b6)}. Line C has first differences ${list(rows[0])} and second differences ${list(rows[1])}, so the next first difference is ${n(rows[0][3])} + ${n(s)} = ${n(nf)} and week 6 is ${n(seq[4])} + ${n(nf)} = ${n(c6)}. The hold total is ${n(a6)} + ${n(b6)} + ${n(c6)} = ${n(tot)}.`,
  guidance: [
   { prompt: 'What are line A’s count and line B’s count in week 6? Line A is arithmetic and line B is geometric.', answer: [a6, b6], explanation: `A: ${n(f)} + 5 × ${n(d)} = ${n(a6)}. B: ${n(a)} × ${n(r)}⁵ = ${n(b6)}.` },
   { prompt: 'What is line C’s count in week 6? Take differences until a row is constant, then extend the rows.', answer: [c6], explanation: `First differences ${list(rows[0])}, second differences ${list(rows[1])}. The next first difference is ${n(rows[0][3])} + ${n(s)} = ${n(nf)}, so week 6 is ${n(seq[4])} + ${n(nf)} = ${n(c6)}.` },
   { prompt: 'What is the total sent to the hold in week 6 by the three lines?', answer: [tot], explanation: `${n(a6)} + ${n(b6)} + ${n(c6)} = ${n(tot)}.` }
  ] }; }
});

mk({
 id: 'q29d', parent: 'q29', kind: 'challenge', uses: 'q25', title: 'The long forecast',
 brief: 'The year-end forecast needs big totals from three lines, one of which grows by a cubic rule.',
 labels: ['line X total', 'line Y total', 'line Z week 7'], tolerance: 0.01,
 gl: [['line X last week', 'line X total'], ['common ratio', 'line Y total'], ['third difference', 'line Z week 7']]
}, {
 canonical: { f: 20, d: 7, n1: 18, a: 3, r: 4, n2: 6, D: 1, A: 2, B: 3, C: 4 },
 draw: R => { const r = R.pick([2, 3, 4]); return { f: R.int(10, 30), d: R.int(3, 12), n1: R.int(15, 25), a: R.int(2, 4), r, n2: R.int(5, r === 4 ? 7 : 8), D: R.int(1, 2), A: R.int(0, 3), B: R.int(0, 5), C: R.int(1, 9) }; },
 build: ({ f, d, n1, a, r, n2, D, A, B, C }) => { const X = [0, 1, 2, 3].map(i => f + i * d), Y = [0, 1, 2, 3].map(i => a * Math.pow(r, i)), seq = seqOf([C, B, A, D], 6), rows = rowsOf(seq, 3), t3 = rows[2][0], x = extend(seq, rows), lastX = f + (n1 - 1) * d, sumX = arS(n1, f, d), sumY = geoS(a, r, n2); return {
  prompt: `The year-end forecast covers three lines. Line X: ${list(X)}, … (the same amount is added each week). Line Y: ${list(Y)}, … (each week is the same multiple of the week before). Line Z: ${list(seq)}, … (assume the simplest polynomial in the week number that fits: once a row of differences is constant, it stays constant). Enter line X’s total over its first ${n(n1)} weeks, then line Y’s total over its first ${n(n2)} weeks, then line Z’s count in week 7. Type each number without commas.`,
  answer: [sumX, sumY, x.next],
  hints: ['Line X is arithmetic: find its last term, then use number of terms × (first + last) ÷ 2. Line Y is geometric: use a₁ × (rⁿ − 1) ÷ (r − 1).', 'Line Z grows faster than the second differences can explain: keep taking differences until a row is constant, then extend every row from the bottom up.'],
  solution: `Line X has common difference ${n(d)}, so its week ${n(n1)} term is ${n(f)} + ${n(n1 - 1)} × ${n(d)} = ${n(lastX)} and its total is ${n(n1)} × (${n(f)} + ${n(lastX)}) ÷ 2 = ${n(sumX)}. Line Y has common ratio ${n(r)}, so its total is ${n(a)} × (${n(r)}${sup(n2)} − 1) ÷ (${n(r)} − 1) = ${n(a)} × ${n(Math.pow(r, n2) - 1)} ÷ ${n(r - 1)} = ${n(sumY)}. Line Z: ${rowsText(rows)} The third differences are constant at ${n(t3)}, so ${x.text}, and week 7 has ${n(seq[5])} + ${n(x.top)} = ${n(x.next)}.`,
  guidance: [
   { prompt: `What is line X’s count in week ${n(n1)}, and what is its total over the first ${n(n1)} weeks?`, answer: [lastX, sumX], explanation: `Each week adds ${n(d)}, so week ${n(n1)} is ${n(f)} + ${n(n1 - 1)} × ${n(d)} = ${n(lastX)}. The total is ${n(n1)} × (${n(f)} + ${n(lastX)}) ÷ 2 = ${n(sumX)}.` },
   { prompt: `What is line Y’s common ratio, and what is its total over the first ${n(n2)} weeks?`, answer: [r, sumY], explanation: `Each week is ${n(r)} times the one before. The total is ${n(a)} × (${n(r)}${sup(n2)} − 1) ÷ (${n(r)} − 1) = ${n(a)} × ${n(Math.pow(r, n2) - 1)} ÷ ${n(r - 1)} = ${n(sumY)}.` },
   { prompt: 'Take differences of line Z three times. What is the constant third difference, and what is the count in week 7?', answer: [t3, x.next], explanation: `${rowsText(rows)} The third differences are constant at ${n(t3)}. Extending the rows: ${x.text}, so week 7 has ${n(seq[5])} + ${n(x.top)} = ${n(x.next)}.` }
  ] }; }
});

/* ---- q30 Solving a recurrence by iteration [Levin 2.4] ---- */

const itSum = (p, q, N, lo) => { let s = 0; for (let k = lo; k <= N; k++) s += p * k + q; return s; };
const itStep = (p, q, s, i) => `a${sub(i)} = ${n(s[i - 1])} + ${n(p * i + q)} = ${n(s[i])}`;
const itSeq = (p, q, a0, len) => { const s = [a0]; for (let i = 1; i < len; i++) s.push(s[i - 1] + p * i + q); return s; };

mk({
 id: 'q30b', parent: 'q30', kind: 'setting', title: 'Filling the water bins',
 brief: 'The water bins take on a few more litres each day than the day before, and the reclaimer wants the level a long way out.',
 labels: ['a₄', 'far term'], tolerance: 0.01,
 gl: [['a₁', 'a₂'], ['a₃', 'a₄'], ['first amount', 'last amount'], ['sum of amounts', 'far term']]
}, {
 canonical: { p: 4, q: 1, a0: 7, N: 25 },
 draw: R => ({ p: R.int(2, 5), q: R.int(1, 9), a0: R.int(2, 20), N: R.int(24, 40) }),
 build: ({ p, q, a0, N }) => { const s = itSeq(p, q, a0, 5), first = p + q, last = p * N + q, sum = N * (first + last) / 2, far = a0 + sum; return {
  prompt: `The reclaimer’s water bins follow the recurrence relation aₙ = aₙ₋₁ + ${amt(p, q)} for n ≥ 1, with a₀ = ${n(a0)}: on day n the bins gain ${amt(p, q)} litres. Enter a₄, then a${sub(N)} (type it without commas).`,
  answer: [s[4], far],
  hints: ['Iterate: a₁ = a₀ plus the day 1 gain, a₂ = a₁ plus the day 2 gain, and so on, putting n into the gain each time.', `Unrolled all the way down, a${sub(N)} is a₀ plus the ${n(N)} gains from day 1 to day ${n(N)}. Those gains form an arithmetic sequence, so add them as the number of terms × (first + last) ÷ 2.`],
  solution: `${[1, 2, 3, 4].map(i => itStep(p, q, s, i)).join(', ')}. By iteration, a${sub(N)} = a₀ + (${n(first)} + ${n(p + first)} + … + ${n(last)}). The ${n(N)} gains form an arithmetic sequence from ${n(first)} to ${n(last)}, with sum ${n(N)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}. So a${sub(N)} = ${n(a0)} + ${n(sum)} = ${n(far)}.`,
  guidance: [
   { prompt: `Apply the rule from a₀ = ${n(a0)}. What are a₁ and a₂?`, answer: [s[1], s[2]], explanation: `${itStep(p, q, s, 1)} and ${itStep(p, q, s, 2)}.` },
   { prompt: 'What are a₃ and a₄?', answer: [s[3], s[4]], explanation: `${itStep(p, q, s, 3)} and ${itStep(p, q, s, 4)}.` },
   { prompt: `What are the gains on day 1 and on day ${n(N)}?`, answer: [first, last], explanation: `Put n = 1 and n = ${n(N)} into ${amt(p, q)}: ${n(first)} and ${n(last)}.` },
   { prompt: `What is the sum of the ${n(N)} gains, and what is a${sub(N)}?`, answer: [sum, far], explanation: `${n(N)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}, and a${sub(N)} = ${n(a0)} + ${n(sum)} = ${n(far)}.` }
  ] }; }
});

mk({
 id: 'q30c', parent: 'q30', kind: 'applied', title: 'Racks over capacity',
 brief: 'The tile racks fill faster every week, and the store needs to know how many tiles must go to another store.',
 labels: ['total gained', 'tiles in the racks', 'tiles to move'], tolerance: 0.01,
 gl: [['first gain', 'last gain'], ['total gained'], ['tiles in the racks', 'tiles to move']]
}, {
 canonical: { p: 3, q: 4, a0: 12, N: 22, cap: 220 },
 draw: R => ({ p: R.int(2, 5), q: R.int(1, 9), a0: R.int(5, 20), N: R.int(18, 30), cap: R.int(150, 300) }),
 build: ({ p, q, a0, N, cap }) => { const first = p + q, last = p * N + q, sum = N * (first + last) / 2, tot = a0 + sum, mv = tot - cap; return {
  prompt: `The tile racks hold ${n(a0)} tiles in week 0, and the count follows the recurrence relation aₙ = aₙ₋₁ + ${amt(p, q)} for n ≥ 1: in week n the racks gain ${amt(p, q)} tiles. The racks can hold ${n(cap)} tiles at most. Enter the total number of tiles gained over weeks 1 to ${n(N)}, then the number of tiles in the racks at week ${n(N)} if nothing is moved, then how many tiles must be moved to another store to bring the racks back to ${n(cap)}. Type each number without commas.`,
  answer: [sum, tot, mv],
  hints: [`Unroll the rule: the count at week ${n(N)} is the starting ${n(a0)} plus every gain from week 1 to week ${n(N)}.`, 'The gains go up by the same step each week, so they are an arithmetic sequence: number of terms × (first + last) ÷ 2.'],
  solution: `The gains run from ${n(first)} in week 1 to ${n(last)} in week ${n(N)}, an arithmetic sequence of ${n(N)} terms. Their sum is ${n(N)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}. The racks then hold ${n(a0)} + ${n(sum)} = ${n(tot)} tiles. Moving out the excess over ${n(cap)} means moving ${n(tot)} − ${n(cap)} = ${n(mv)} tiles.`,
  guidance: [
   { prompt: `What do the racks gain in week 1 and in week ${n(N)}? Put n = 1 and n = ${n(N)} into ${amt(p, q)}.`, answer: [first, last], explanation: `Week 1: ${n(p)} × 1 + ${n(q)} = ${n(first)}. Week ${n(N)}: ${n(p)} × ${n(N)} + ${n(q)} = ${n(last)}.` },
   { prompt: `What is the sum of the ${n(N)} weekly gains?`, answer: [sum], explanation: `${n(N)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)} tiles.` },
   { prompt: `How many tiles are in the racks at week ${n(N)}, and how many must be moved to leave ${n(cap)}?`, answer: [tot, mv], explanation: `${n(a0)} + ${n(sum)} = ${n(tot)} tiles, and ${n(tot)} − ${n(cap)} = ${n(mv)} must go.` }
  ] }; }
});

mk({
 id: 'q30d', parent: 'q30', kind: 'challenge', uses: 'q25', title: 'Counting from week five',
 brief: 'The spares store was counted at the end of week 5, and Mira wants the count many weeks later from that one figure.',
 labels: ['a₇', 'far term'], tolerance: 0.01,
 gl: [['a₆', 'a₇'], ['first gain', 'last gain'], ['sum of gains', 'far term']]
}, {
 canonical: { p: 5, q: 8, a5: 160, N: 60 },
 draw: R => ({ p: R.int(3, 9), q: R.int(1, 20), a5: R.int(100, 400), N: R.int(50, 90) }),
 build: ({ p, q, a5, N }) => { const a6 = a5 + 6 * p + q, a7 = a6 + 7 * p + q, first = 6 * p + q, last = p * N + q, cnt = N - 5, sum = cnt * (first + last) / 2, far = a5 + sum; return {
  prompt: `The spares store follows the recurrence relation aₙ = aₙ₋₁ + ${amt(p, q)} for every week from week 6 on, where aₙ is the count at the end of week n. The count at the end of week 5 was a₅ = ${n(a5)}. Enter a₇, then a${sub(N)} (type it without commas).`,
  answer: [a7, far],
  hints: [`Start from a₅ and apply the rule for n = 6, then n = 7. For a${sub(N)}, unroll the rule down to a₅, not to a₀.`, `The gains from week 6 to week ${n(N)} are an arithmetic sequence. Count them carefully: they run from week 6 up to week ${n(N)}.`],
  solution: `a₆ = ${n(a5)} + ${n(first)} = ${n(a6)} and a₇ = ${n(a6)} + ${n(7 * p + q)} = ${n(a7)}. Unrolled down to a₅, a${sub(N)} = a₅ plus the gains of weeks 6 to ${n(N)}. That is ${n(N)} − 5 = ${n(cnt)} gains, an arithmetic sequence from ${n(first)} to ${n(last)}, with sum ${n(cnt)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}. So a${sub(N)} = ${n(a5)} + ${n(sum)} = ${n(far)}.`,
  guidance: [
   { prompt: `Apply the rule from a₅ = ${n(a5)}. What are a₆ and a₇?`, answer: [a6, a7], explanation: `a₆ = ${n(a5)} + ${n(first)} = ${n(a6)} and a₇ = ${n(a6)} + ${n(7 * p + q)} = ${n(a7)}.` },
   { prompt: `What does the store gain in week 6 and in week ${n(N)}? There are ${n(cnt)} gains in all.`, answer: [first, last], explanation: `Put n = 6 and n = ${n(N)} into ${amt(p, q)}: ${n(first)} and ${n(last)}. The weeks run from 6 to ${n(N)}, which is ${n(cnt)} weeks.` },
   { prompt: `What is the sum of the ${n(cnt)} gains, and what is a${sub(N)}?`, answer: [sum, far], explanation: `${n(cnt)} × (${n(first)} + ${n(last)}) ÷ 2 = ${n(sum)}, and a${sub(N)} = ${n(a5)} + ${n(sum)} = ${n(far)}.` }
  ] }; }
});

})();
