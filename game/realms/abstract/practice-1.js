/* Abstract algebra: patterns of moves practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p1.js. */
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
/* Remainder from 0 to m − 1, also for negative x. */
const md = (x, m) => ((x % m) + m) % m;
const isPrime = m => { if (m < 2) return false; for (let d = 2; d * d <= m; d++) if (m % d === 0) return false; return true; };
const steps = k => k === 1 ? '1 step' : `${n(k)} steps`;
const slots = k => k === 1 ? '1 slot' : `${n(k)} slots`;
const hours = k => k === 1 ? '1 hour' : `${n(k)} hours`;
/* "64 = 3 × 17 + 13", or "13 already lies from 0 to 16" when no division is needed. */
const divText = (x, m) => x < m ? `${n(x)} already lies from 0 to ${n(m - 1)}` : `${n(x)} = ${n(Math.floor(x / m))} × ${n(m)} + ${n(x % m)}`;
const upText = (x, m) => { const k = Math.ceil(-x / m); return k === 1 ? `${n(x)} + ${n(m)} = ${n(x + m)}` : `${n(x)} + ${n(k)} × ${n(m)} = ${n(x)} + ${n(k * m)} = ${n(x + k * m)}`; };
/* The remainder of any whole number x, worked in words. */
const modText = (x, m) => x < 0 ? `add ${n(m)} until the result lies from 0 to ${n(m - 1)}: ${upText(x, m)}` : divText(x, m);
/* Reminder for answers typed as whole numbers of 1000 or more. */
const nc = x => Math.abs(x) >= 1000 ? ' (type it without commas)' : '';
const PRIMES = [5, 7, 11, 13, 17, 19];
const COMPOSITES = [4, 8, 9, 10, 12, 14, 15, 16, 18, 20];
const BIGPRIMES = [13, 17, 19, 23, 29, 31, 37];
const BIGCOMP = [14, 15, 21, 22, 25, 26, 27, 28, 33, 34, 35, 36, 38, 39];
/* Smallest factor of m above 1. */
const small = m => { let d = 2; while (m % d) d++; return d; };

/* ---- q01 Adding on a clock: Zₙ [3.1] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The tool carousel',
 brief: 'The workshop tool carousel turns round to fetch kits for two jobs, and the foreman wants to know which slot it stops at each time.',
 labels: ['return job slot', 'supply job slot'], tolerance: 0.01,
 gl: [['a + b'], ['supply job slot'], ['a − b'], ['return job slot']]
}, {
 /* Slot counts a < b, so the back move always passes below 0; a + b reaches at least m. Neither answer is 0. Not the
    worked example (m = 12, 9 + 8 and 3 − 7). */
 canonical: { m: 16, a: 25, b: 47 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { m: R.int(6, 24), a: R.int(8, 60), b: R.int(8, 60) };
   if (p.m !== 12 && p.a < p.b && p.a + p.b >= p.m && md(p.a + p.b, p.m) !== 0 && md(p.a - p.b, p.m) !== 0) return p; } return { m: 16, a: 25, b: 47 }; },
 build: ({ m, a, b }) => { const s = a + b, d = a - b, rs = md(s, m), rd = md(d, m); return {
  prompt: `The tool carousel in the Lock Workshop has ${n(m)} slots, numbered 0 to ${n(m - 1)}, and it turns like a clock: one slot on from ${n(m - 1)} is slot 0 again. It rests at slot 0. For the return job the arm turns it ${slots(a)} forward to fetch the drill kit and then ${slots(b)} back to fetch the gauge. Enter the slot where it stops, (${n(a)} − ${n(b)}) mod ${n(m)}. For the supply job it turns ${slots(a)} forward and then ${slots(b)} forward. Enter the slot where it stops, (${n(a)} + ${n(b)}) mod ${n(m)}.`,
  answer: [rd, rs],
  hints: ['A turn back counts as a negative number of slots. If the total is negative, add the number of slots, as many times as needed, until the result lies from 0 up to one less than the number of slots.', 'For two turns forward, add them, then divide by the number of slots. The slot is the remainder.'],
  solution: `Return job: ${n(a)} − ${n(b)} = ${n(d)}. It is negative, so ${modText(d, m)}. The arm stops at slot ${n(rd)}. Supply job: ${n(a)} + ${n(b)} = ${n(s)}, and ${divText(s, m)}, so the arm stops at slot ${n(rs)}.`,
  guidance: [
   { prompt: `Start with the supply job. How many slots does the carousel turn forward in all? What is ${n(a)} + ${n(b)}?`, answer: [s], explanation: `${n(a)} + ${n(b)} = ${n(s)} slots forward from slot 0.` },
   { prompt: `Every ${n(m)} slots bring the carousel back to slot 0. What is the remainder when ${n(s)} is divided by ${n(m)}?`, answer: [rs], explanation: `${divText(s, m)}, so the supply job ends at slot ${n(rs)}.` },
   { prompt: `For the return job the back turn counts as negative. What is ${n(a)} − ${n(b)}?`, answer: [d], explanation: `${n(a)} − ${n(b)} = ${n(d)}.` },
   { prompt: `What is ${n(d)} mod ${n(m)}, the slot from 0 to ${n(m - 1)} where the return job ends?`, answer: [rd], explanation: `${n(d)} is negative, so ${modText(d, m)}. The return job ends at slot ${n(rd)}.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'The locker hatch dial',
 brief: 'A locker hatch dial has been turned back and forth by three technicians in a row, and Mira needs to know where it sits and how far it is from zero.',
 labels: ['end position', 'steps to reach 0'], tolerance: 0.01,
 gl: [['total'], ['end position'], ['steps to reach 0']]
}, {
 /* Start position s, then a forward, b back, c forward: the end position is (s + a − b + c) mod m, never 0, so the
    steps still needed to reach 0 going forward are m minus the position. Not the worked example. */
 canonical: { m: 15, s: 4, a: 22, b: 37, c: 9 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(7, 24), p = { m, s: R.int(0, m - 1), a: R.int(5, 45), b: R.int(5, 45), c: R.int(5, 45) };
   if (md(p.s + p.a - p.b + p.c, m) !== 0 && !(m === 12 && p.a === 9)) return p; } return { m: 15, s: 4, a: 22, b: 37, c: 9 }; },
 build: ({ m, s, a, b, c }) => { const net = s + a - b + c, pos = md(net, m), z = m - pos; return {
  prompt: `A hatch dial in the Lock Workshop has ${n(m)} positions, numbered 0 to ${n(m - 1)}, and it counts round like a clock. It rests at position ${n(s)}. A technician turns it ${steps(a)} forward, then ${steps(b)} back, then ${steps(c)} forward. Enter the position where the dial ends. Then enter how many steps forward the dial would still need to turn, from that position, to reach position 0 for the first time.`,
  answer: [pos, z],
  hints: ['Forward steps add and back steps subtract. Start from the position where the dial rests, work out the total, then bring it into the range from 0 up to one less than the number of positions.', 'Turning forward past the last position brings the dial to 0. So from any position other than 0, the steps still needed are the number of positions minus that position.'],
  solution: `Forward steps add and back steps subtract: ${n(s)} + ${n(a)} − ${n(b)} + ${n(c)} = ${n(net)}. ${net < 0 ? `It is negative, so ${modText(net, m)}` : divText(net, m)}, so the dial ends at position ${n(pos)}. Going forward from ${n(pos)}, it reaches ${n(m)}, which is position 0 again, after ${n(m)} − ${n(pos)} = ${steps(z)}.`,
  guidance: [
   { prompt: `Count the forward steps as positive and the back steps as negative, starting from position ${n(s)}. What is ${n(s)} + ${n(a)} − ${n(b)} + ${n(c)}?`, answer: [net], explanation: `${n(s)} + ${n(a)} − ${n(b)} + ${n(c)} = ${n(net)}.` },
   { prompt: `What is ${n(net)} mod ${n(m)}, the position from 0 to ${n(m - 1)} where the dial ends?`, answer: [pos], explanation: `${net < 0 ? `${n(net)} is negative, so ${modText(net, m)}` : divText(net, m)}. The dial ends at position ${n(pos)}.` },
   { prompt: `Turning forward from position ${n(pos)}, the dial reaches position 0 when it reaches ${n(m)}. How many steps is that, ${n(m)} − ${n(pos)}?`, answer: [z], explanation: `X` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'The batch tally wheel',
 brief: 'The batch counter wheel has logged three long shifts, and the crew needs its tooth after the totals and again after a correction run.',
 labels: ['tooth after the totals', 'tooth after the correction'], tolerance: 0.01,
 gl: [['total counts'], ['tooth after the totals'], ['net counts'], ['tooth after the correction']]
}, {
 /* Harder numbers: three logs of three digits each on a wheel of 31 to 97 teeth. Neither answer is 0. */
 canonical: { m: 47, a: 612, b: 385, c: 279 },
 draw: R => { for (let i = 0; i < 1000; i++) { const p = { m: R.int(31, 97), a: R.int(100, 999), b: R.int(100, 999), c: R.int(100, 999) };
   if (md(p.a + p.b + p.c, p.m) !== 0 && md(p.a - p.b - p.c, p.m) !== 0) return p; } return { m: 47, a: 612, b: 385, c: 279 }; },
 build: ({ m, a, b, c }) => { const s = a + b + c, d = a - b - c, rs = md(s, m), rd = md(d, m); return {
  prompt: `The batch counter in the Lock Workshop is a tally wheel with ${n(m)} teeth, numbered 0 to ${n(m - 1)}, and it counts round like a clock. Three shift logs record ${n(a)}, ${n(b)} and ${n(c)} counts, and the wheel moves forward by each log in turn, starting from tooth 0. Enter the tooth it points to, (${n(a)} + ${n(b)} + ${n(c)}) mod ${n(m)}. A correction run starts again from tooth 0: it moves forward ${n(a)} counts, then back ${n(b)} counts, then back ${n(c)} counts. Enter the tooth it points to, (${n(a)} − ${n(b)} − ${n(c)}) mod ${n(m)}.`,
  answer: [rs, rd],
  hints: ['Work out the total number of counts first, forward counts as positive and back counts as negative, then take the remainder on division by the number of teeth. Do not divide each log separately.', 'A negative total is brought into range by adding the number of teeth, as many times as needed, until the result lies from 0 up to one less than the number of teeth.'],
  solution: `${n(a)} + ${n(b)} + ${n(c)} = ${n(s)}, and ${divText(s, m)}, so the wheel points to tooth ${n(rs)}. ${n(a)} − ${n(b)} − ${n(c)} = ${n(d)}${d < 0 ? `. It is negative, so ${modText(d, m)}` : `, and ${divText(d, m)}`}. So the correction run ends at tooth ${n(rd)}.`,
  guidance: [
   { prompt: `How many counts does the wheel move forward in all in the first case? What is ${n(a)} + ${n(b)} + ${n(c)}${nc(s)}?`, answer: [s], explanation: `${n(a)} + ${n(b)} + ${n(c)} = ${n(s)}.` },
   { prompt: `What is the remainder when ${n(s)} is divided by ${n(m)}?`, answer: [rs], explanation: `${divText(s, m)}, so the wheel points to tooth ${n(rs)}.` },
   { prompt: `In the correction run the two back moves count as negative. What is ${n(a)} − ${n(b)} − ${n(c)}${nc(d)}?`, answer: [d], explanation: `${n(a)} − ${n(b)} − ${n(c)} = ${n(d)}.` },
   { prompt: `What is ${n(d)} mod ${n(m)}, the tooth from 0 to ${n(m - 1)} where the correction run ends?`, answer: [rd], explanation: `${d < 0 ? `${n(d)} is negative, so ${modText(d, m)}` : divText(d, m)}. The correction run ends at tooth ${n(rd)}.` }
  ] }; }
});

/* ---- q02 Multiplying on a clock [3.1] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'The stamping drum',
 brief: 'A stamping drum turns a fixed amount on every pass of the arm, and the crew needs to know which slot is in line after a run of passes.',
 labels: ['slot after the passes', 'slot after s passes'], tolerance: 0.01,
 gl: [['s mod n'], ['p mod n'], ['(s × p) mod n'], ['s² mod n']]
}, {
 /* Shift s per pass (larger than m), p passes. Both reduce to at least 2 mod m. The second answer is s² mod m, the
    slot after s passes. Not the worked example (m = 10, 13 and 6). */
 canonical: { m: 14, s: 31, p: 9 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(5, 24), p = { m, s: R.int(m + 2, 60), p: R.int(2, 40) };
   if (p.s % m >= 2 && p.p % m >= 2 && !(m === 10 && p.s === 13)) return p; } return { m: 14, s: 31, p: 9 }; },
 build: ({ m, s, p }) => { const sr = s % m, pr = p % m, pd = sr * pr, r = pd % m, sq = sr * sr, rq = sq % m; return {
  prompt: `A stamping drum in the Lock Workshop has ${n(m)} slots, numbered 0 to ${n(m - 1)}, and it turns like a clock. Every pass of the stamping arm turns it ${slots(s)} forward. Starting from slot 0, enter the slot in line after ${n(p)} passes, (${n(s)} × ${n(p)}) mod ${n(m)}. Then enter the slot in line after ${n(s)} passes, ${n(s)}² mod ${n(m)}.`,
  answer: [r, rq],
  hints: ['Each pass turns the drum by the same number of slots, so the passes multiply. You may replace each number by its remainder first: the final slot does not change, and the numbers stay small.', 'After multiplying the remainders, divide the product by the number of slots and keep the remainder.'],
  solution: `First the remainders: ${divText(s, m)}, so ${n(s)} mod ${n(m)} = ${n(sr)}${p >= m ? `, and ${divText(p, m)}, so ${n(p)} mod ${n(m)} = ${n(pr)}` : ''}. Then ${n(sr)} × ${n(pr)} = ${n(pd)}, and ${divText(pd, m)}, so (${n(s)} × ${n(p)}) mod ${n(m)} = ${n(r)}. For ${n(s)} passes, ${n(sr)} × ${n(sr)} = ${n(sq)}, and ${divText(sq, m)}, so ${n(s)}² mod ${n(m)} = ${n(rq)}.`,
  guidance: [
   { prompt: `Full turns of ${n(m)} slots change nothing. What is ${n(s)} mod ${n(m)}?`, answer: [sr], explanation: `${divText(s, m)}, so each pass turns the drum as if it were ${slots(sr)}.` },
   { prompt: `What is ${n(p)} mod ${n(m)}?`, answer: [pr], explanation: p >= m ? `${divText(p, m)}, so ${n(p)} passes act like ${n(pr)} passes.` : `${n(p)} is already below ${n(m)}, so it stays ${n(pr)}.` },
   { prompt: `Multiply the remainders and take the remainder again. What is (${n(sr)} × ${n(pr)}) mod ${n(m)}?`, answer: [r], explanation: `${n(sr)} × ${n(pr)} = ${n(pd)}, and ${divText(pd, m)}. This is also (${n(s)} × ${n(p)}) mod ${n(m)}.` },
   { prompt: `Now ${n(s)} passes of ${n(s)} slots each. What is (${n(sr)} × ${n(sr)}) mod ${n(m)}?`, answer: [rq], explanation: `${n(sr)} × ${n(sr)} = ${n(sq)}, and ${divText(sq, m)}. So ${n(s)}² mod ${n(m)} = ${n(rq)}.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'The valve wheel shifts',
 brief: 'The pump drive turns a valve wheel the same amount every hour, and Mira needs its position after one shift and after a run of shifts.',
 labels: ['position after one shift', 'position after the run'], tolerance: 0.01,
 gl: [['a mod n'], ['position after one shift'], ['position after the run']]
}, {
 /* Hourly turn a (above m), a shift of h hours, d shifts in a row. The wheel moves the same number of positions in
    every shift, namely (a × h) mod m, so after d shifts it has moved d times that, mod m. */
 canonical: { m: 16, a: 37, h: 6, d: 5 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(7, 24), p = { m, a: R.int(m + 3, 60), h: R.int(3, 9), d: R.int(3, 9) };
   const P = ((p.a % m) * p.h) % m, Q = (P * p.d) % m;
   if (p.a % m >= 2 && P >= 2 && Q >= 1 && Q !== P) return p; } return { m: 16, a: 37, h: 6, d: 5 }; },
 build: ({ m, a, h, d }) => { const ar = a % m, pd = ar * h, P = pd % m, qd = P * d, Q = qd % m; return {
  prompt: `A valve wheel in the Lock Workshop has ${n(m)} positions, numbered 0 to ${n(m - 1)}, and it turns like a clock. The pump drive turns it ${steps(a)} forward every hour, and one shift lasts ${hours(h)}. At the start of the week the wheel is at position 0. Enter its position after the first shift, (${n(a)} × ${n(h)}) mod ${n(m)}. Then enter its position after ${n(d)} shifts in a row, with nothing else turning it.`,
  answer: [P, Q],
  hints: ['One shift turns the wheel by the same amount every time. Find that amount mod the number of positions first: you may replace the hourly turn by its remainder before multiplying by the hours.', 'Every shift moves the wheel as far as the first shift did. So the position after several shifts comes from multiplying that amount by the number of shifts, then taking the remainder.'],
  solution: `The hourly turn is ${divText(a, m)}, so it acts like ${steps(ar)}. One shift is ${n(ar)} × ${n(h)} = ${n(pd)}, and ${divText(pd, m)}, so after the first shift the wheel is at position ${n(P)}. Every shift moves it as far as that, so ${n(d)} shifts move it as far as ${n(d)} × ${n(P)} = ${n(qd)}, and ${divText(qd, m)}. After ${n(d)} shifts the wheel is at position ${n(Q)}.`,
  guidance: [
   { prompt: `Full turns of ${n(m)} steps change nothing. What is ${n(a)} mod ${n(m)}?`, answer: [ar], explanation: `${divText(a, m)}, so each hour turns the wheel as if it were ${steps(ar)}.` },
   { prompt: `What is (${n(ar)} × ${n(h)}) mod ${n(m)}, the position after the first shift?`, answer: [P], explanation: `${n(ar)} × ${n(h)} = ${n(pd)}, and ${divText(pd, m)}.` },
   { prompt: `Each shift turns the wheel as far as ${n(P)} positions do, so ${n(d)} shifts turn it as far as ${n(d)} × ${n(P)}. What is (${n(d)} × ${n(P)}) mod ${n(m)}?`, answer: [Q], explanation: `${n(d)} × ${n(P)} = ${n(qd)}, and ${divText(qd, m)}.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'The calibration squares',
 brief: 'A calibration wheel squares its own position on every cycle, and the crew needs to know where a fault leaves it after one and two cycles.',
 labels: ['position after one cycle', 'position after two cycles'], tolerance: 0.01,
 gl: [['a mod n'], ['position after one cycle'], ['position after two cycles']]
}, {
 /* Harder numbers: m from 31 to 97, a of three digits. The wheel sits at ar = a mod m; one cycle gives ar² mod m,
    the second squares that new position. None of the three positions is 0 or 1. */
 canonical: { m: 53, a: 278 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(31, 97), a = R.int(100, 999), ar = a % m, s1 = (ar * ar) % m, s2 = (s1 * s1) % m;
   if (ar >= 2 && s1 >= 2 && s2 >= 2) return { m, a }; } return { m: 53, a: 278 }; },
 build: ({ m, a }) => { const ar = a % m, q1 = ar * ar, s1 = q1 % m, q2 = s1 * s1, s2 = q2 % m; return {
  prompt: `A calibration wheel in the Lock Workshop has ${n(m)} positions, numbered 0 to ${n(m - 1)}, and it turns like a clock. A fault turns it ${steps(a)} forward from position 0. Each calibration cycle then replaces its position x by x² mod ${n(m)}: the square of the position it shows, with the full turns dropped. Enter its position after one cycle. Then enter its position after a second cycle.`,
  answer: [s1, s2],
  hints: ['The fault leaves the wheel at the remainder of its steps on division by the number of positions. Start the cycles from that position, not from the large number of steps.', 'The second cycle squares the position the first cycle left, not the original position.'],
  solution: `The fault leaves the wheel at position ${n(a)} mod ${n(m)}: ${divText(a, m)}, so position ${n(ar)}. First cycle: ${n(ar)} × ${n(ar)} = ${n(q1)}, and ${divText(q1, m)}, so the wheel is at position ${n(s1)}. Second cycle: ${n(s1)} × ${n(s1)} = ${n(q2)}, and ${divText(q2, m)}, so the wheel is at position ${n(s2)}.`,
  guidance: [
   { prompt: `Where does the fault leave the wheel? What is ${n(a)} mod ${n(m)}?`, answer: [ar], explanation: `${divText(a, m)}, so the wheel starts the cycles at position ${n(ar)}.` },
   { prompt: `First cycle: what is (${n(ar)} × ${n(ar)}) mod ${n(m)}?`, answer: [s1], explanation: `${n(ar)} × ${n(ar)} = ${n(q1)}, and ${divText(q1, m)}.` },
   { prompt: `Second cycle: square the new position. What is (${n(s1)} × ${n(s1)}) mod ${n(m)}?`, answer: [s2], explanation: `${n(s1)} × ${n(s1)} = ${n(q2)}, and ${divText(q2, m)}.` }
  ] }; }
});

/* ---- q03 Binary operations and operation tables [3.1, 3.2] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'The keypad linkage chart',
 brief: 'Two coded keypads are being joined by a new rule, and the crew wants two cells of the chart checked before it is pinned up.',
 labels: ['first entry', 'diagonal entry'], tolerance: 0.01,
 gl: [['x + y + k'], ['first entry'], ['diagonal entry']]
}, {
 /* Rule x ∗ y = (x + y + k) mod m; the first cell sums past m, the second cell has the same row and column d.
    Not the worked example (m = 5, k = 2). */
 canonical: { m: 9, k: 5, x1: 6, y1: 5, d: 4 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(6, 14), p = { m, k: R.int(1, m - 1), x1: R.int(1, m - 1), y1: R.int(1, m - 1), d: R.int(1, m - 1) };
   if (p.x1 + p.y1 + p.k >= m && p.d !== p.x1 && p.d !== p.y1 && !(m === 5 && p.k === 2)) return p; } return { m: 9, k: 5, x1: 6, y1: 5, d: 4 }; },
 build: ({ m, k, x1, y1, d }) => { const s1 = x1 + y1 + k, r1 = s1 % m, s2 = d + d + k, r2 = s2 % m; return {
  prompt: `Two keypads in the Lock Workshop show the digits 0 to ${n(m - 1)}, and a lock joins them by the rule x ∗ y = (x + y + ${n(k)}) mod ${n(m)}, where x is the digit on the first keypad and y the digit on the second. The crew's chart has one row for each digit x and one column for each digit y, and the entry in row x and column y is x ∗ y. Enter the entry in row ${n(x1)}, column ${n(y1)}. Then enter the entry where the row and the column are both ${n(d)}.`,
  answer: [r1, r2],
  hints: ['The entry in row x and column y is x ∗ y: put the row digit in for x and the column digit in for y. When the row and the column are the same digit, both x and y are that digit.', 'Add the two digits and the fixed extra amount, then take the remainder on division by the number of digits.'],
  solution: `Row ${n(x1)}, column ${n(y1)}: ${n(x1)} ∗ ${n(y1)} = (${n(x1)} + ${n(y1)} + ${n(k)}) mod ${n(m)} = ${n(s1)} mod ${n(m)}, and ${divText(s1, m)}, so the entry is ${n(r1)}. Row ${n(d)}, column ${n(d)}: ${n(d)} ∗ ${n(d)} = (${n(d)} + ${n(d)} + ${n(k)}) mod ${n(m)} = ${n(s2)} mod ${n(m)}, and ${divText(s2, m)}, so the entry is ${n(r2)}.`,
  guidance: [
   { prompt: `For row ${n(x1)}, column ${n(y1)}, add before taking the remainder. What is ${n(x1)} + ${n(y1)} + ${n(k)}?`, answer: [s1], explanation: `${n(x1)} + ${n(y1)} + ${n(k)} = ${n(s1)}.` },
   { prompt: `What is ${n(s1)} mod ${n(m)}, the entry in row ${n(x1)}, column ${n(y1)}?`, answer: [r1], explanation: `${divText(s1, m)}, so ${n(x1)} ∗ ${n(y1)} = ${n(r1)}.` },
   { prompt: `Now row ${n(d)}, column ${n(d)}. What is ${n(d)} ∗ ${n(d)} = (${n(d)} + ${n(d)} + ${n(k)}) mod ${n(m)}?`, answer: [r2], explanation: `${n(d)} + ${n(d)} + ${n(k)} = ${n(s2)}, and ${divText(s2, m)}, so the entry is ${n(r2)}.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The fault report on the chart',
 brief: 'A fault report points at one row of a linkage chart, and Mira needs one entry read off and one value traced back to its column.',
 labels: ['entry', 'column'], tolerance: 0.01,
 gl: [['r + c + k'], ['entry'], ['column']]
}, {
 /* In a row of the chart of x ∗ y = (x + y + k) mod m each value appears in exactly one column, y = (v − r − k) mod m.
    The traced column differs from the column of the first entry. */
 canonical: { m: 11, k: 4, r: 6, c: 8, v: 3 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(6, 14), p = { m, k: R.int(1, m - 1), r: R.int(1, m - 1), c: R.int(0, m - 1), v: R.int(0, m - 1) };
   if (md(p.v - p.r - p.k, m) !== p.c && !(m === 5 && p.k === 2)) return p; } return { m: 11, k: 4, r: 6, c: 8, v: 3 }; },
 build: ({ m, k, r, c, v }) => { const s = r + c + k, e = s % m, w = v - r - k, y = md(w, m), tot = r + y + k; return {
  prompt: `The Lock Workshop's linkage chart for two dials of ${n(m)} positions, numbered 0 to ${n(m - 1)}, follows the rule x ∗ y = (x + y + ${n(k)}) mod ${n(m)}: the entry in row x and column y is x ∗ y. A fault report names row ${n(r)}. Enter the entry in row ${n(r)}, column ${n(c)}. The report also says that the value ${n(v)} appears in row ${n(r)}; in a row of this chart each value appears in exactly one column. Enter the column where ${n(v)} sits.`,
  answer: [e, y],
  hints: ['The entry in row x and column y is x ∗ y: add the row, the column and the fixed extra amount, then take the remainder on division by the number of positions.', 'To find a column from a value, put the unknown column y into the rule and ask what y must be so that the remainder is the value. Subtract the row and the fixed extra amount from the value, then bring the result into the range of the dial.'],
  solution: `Row ${n(r)}, column ${n(c)}: ${n(r)} ∗ ${n(c)} = (${n(r)} + ${n(c)} + ${n(k)}) mod ${n(m)} = ${n(s)} mod ${n(m)}, and ${divText(s, m)}, so the entry is ${n(e)}. For the column: (${n(r)} + y + ${n(k)}) mod ${n(m)} must be ${n(v)}, so y = (${n(v)} − ${n(r + k)}) mod ${n(m)} = ${n(w)} mod ${n(m)} = ${n(y)}. Check: ${n(r)} ∗ ${n(y)} = (${n(r)} + ${n(y)} + ${n(k)}) mod ${n(m)} = ${n(tot)} mod ${n(m)} = ${n(v)}.`,
  guidance: [
   { prompt: `Add before taking the remainder. What is ${n(r)} + ${n(c)} + ${n(k)}?`, answer: [s], explanation: `${n(r)} + ${n(c)} + ${n(k)} = ${n(s)}.` },
   { prompt: `What is ${n(s)} mod ${n(m)}, the entry in row ${n(r)}, column ${n(c)}?`, answer: [e], explanation: `${divText(s, m)}, so ${n(r)} ∗ ${n(c)} = ${n(e)}.` },
   { prompt: `For the column, (${n(r)} + y + ${n(k)}) mod ${n(m)} must equal ${n(v)}, so y = (${n(v)} − ${n(r + k)}) mod ${n(m)}. What is y?`, answer: [y], explanation: `${n(v)} − ${n(r + k)} = ${n(w)}, and ${modText(w, m)}. Check: ${n(r)} ∗ ${n(y)} = ${n(tot)} mod ${n(m)} = ${n(v)}.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', uses: 'q02', title: 'The multiplying linkage',
 brief: 'A new linkage multiplies the two settings before adding its fixed amount, and the crew needs two cells of its larger chart.',
 labels: ['first entry', 'diagonal entry'], tolerance: 0.01,
 gl: [['x × y + k'], ['first entry'], ['z × z + k'], ['diagonal entry']]
}, {
 /* Rule x ∗ y = (x × y + k) mod m on 0 … m − 1, m from 11 to 30: the new rule multiplies first (q02). The two entries differ. */
 canonical: { m: 13, k: 5, x: 7, y: 9, z: 11 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(11, 30), p = { m, k: R.int(1, m - 1), x: R.int(3, m - 1), y: R.int(3, m - 1), z: R.int(3, m - 1) };
   if (p.z !== p.x && p.z !== p.y && (p.x * p.y + p.k) % m !== (p.z * p.z + p.k) % m) return p; } return { m: 13, k: 5, x: 7, y: 9, z: 11 }; },
 build: ({ m, k, x, y, z }) => { const s1 = x * y + k, r1 = s1 % m, s2 = z * z + k, r2 = s2 % m; return {
  prompt: `The Lock Workshop joins two dials, each with the settings 0 to ${n(m - 1)}, by a multiplying rule: x ∗ y = (x × y + ${n(k)}) mod ${n(m)}. This means multiply x by y, add ${n(k)}, then keep the remainder on division by ${n(m)}. In the crew's operation table the entry in row x and column y is x ∗ y. Enter the entry in row ${n(x)}, column ${n(y)}. Then enter the entry in row ${n(z)}, column ${n(z)}.`,
  answer: [r1, r2],
  hints: ['Put the row in for x and the column in for y. Multiply first, then add the fixed extra amount, and only then take the remainder on division by the number of settings.', 'When the row and the column are the same setting, both x and y are that setting, so the product is its square.'],
  solution: `Row ${n(x)}, column ${n(y)}: ${n(x)} ∗ ${n(y)} = (${n(x)} × ${n(y)} + ${n(k)}) mod ${n(m)} = ${n(s1)} mod ${n(m)}, and ${divText(s1, m)}, so the entry is ${n(r1)}. Row ${n(z)}, column ${n(z)}: ${n(z)} ∗ ${n(z)} = (${n(z)} × ${n(z)} + ${n(k)}) mod ${n(m)} = ${n(s2)} mod ${n(m)}, and ${divText(s2, m)}, so the entry is ${n(r2)}.`,
  guidance: [
   { prompt: `For row ${n(x)}, column ${n(y)}, multiply first and then add the fixed amount. What is ${n(x)} × ${n(y)} + ${n(k)}?`, answer: [s1], explanation: `${n(x)} × ${n(y)} = ${n(x * y)}, and ${n(x * y)} + ${n(k)} = ${n(s1)}.` },
   { prompt: `What is ${n(s1)} mod ${n(m)}, the entry in row ${n(x)}, column ${n(y)}?`, answer: [r1], explanation: `${divText(s1, m)}, so ${n(x)} ∗ ${n(y)} = ${n(r1)}.` },
   { prompt: `Now row ${n(z)}, column ${n(z)}. What is ${n(z)} × ${n(z)} + ${n(k)}?`, answer: [s2], explanation: `${n(z)} × ${n(z)} = ${n(z * z)}, and ${n(z * z)} + ${n(k)} = ${n(s2)}.` },
   { prompt: `What is ${n(s2)} mod ${n(m)}, the entry in row ${n(z)}, column ${n(z)}?`, answer: [r2], explanation: `${divText(s2, m)}, so ${n(z)} ∗ ${n(z)} = ${n(r2)}.` }
  ] }; }
});

/* ---- q04 Identity and inverses [3.2] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'The neutral keypad digit',
 brief: 'Two coded-door keypads are joined by a rule that shifts every digit, and the crew needs the digit that changes nothing and the digits that undo two others.',
 labels: ['identity e', 'first inverse', 'second inverse'], tolerance: 0.01,
 gl: [['identity e'], ['first inverse'], ['second inverse']]
}, {
 /* x ∗ y = (x + y + k) mod m: e = m − k, and the inverse of a is (e − a − k) mod m. The two digits differ and neither is e.
    Not the worked example (m = 6, k = 1). */
 canonical: { m: 11, k: 3, a1: 2, a2: 6 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(5, 15), k = R.int(1, m - 1), p = { m, k, a1: R.int(0, m - 1), a2: R.int(0, m - 1) };
   if (p.a1 !== p.a2 && p.a1 !== m - k && p.a2 !== m - k && !(m === 6 && k === 1)) return p; } return { m: 11, k: 3, a1: 2, a2: 6 }; },
 build: ({ m, k, a1, a2 }) => { const e = m - k, b1 = md(e - a1 - k, m), b2 = md(e - a2 - k, m); return {
  prompt: `Two coded-door keypads in the Lock Workshop show the digits 0 to ${n(m - 1)} and join them by the rule x ∗ y = (x + y + ${n(k)}) mod ${n(m)}. Enter the identity element e of ∗, the digit with e ∗ x = x and x ∗ e = x for every x. Then enter the inverse of ${n(a1)} and the inverse of ${n(a2)}: for each digit a, the digit b with a ∗ b = e.`,
  answer: [e, b1, b2],
  hints: ['For e ∗ x to come back to x, the amount e adds, together with the fixed extra amount, must make a whole number of full turns of the keypad.', 'For the inverse of a, the digit b must make (a + b + the extra amount) leave the remainder e. Subtract, then bring the result into the range of the keypad. Each digit has its own inverse, so work the two separately.'],
  solution: `e ∗ x = (e + x + ${n(k)}) mod ${n(m)} equals x for every x only when e + ${n(k)} is a whole number of turns of ${n(m)}. With e from 0 to ${n(m - 1)} that means e + ${n(k)} = ${n(m)}, so e = ${n(e)}. For the inverse of ${n(a1)}: (${n(a1)} + b + ${n(k)}) mod ${n(m)} must be ${n(e)}, so b = (${n(e)} − ${n(a1 + k)}) mod ${n(m)} = ${n(e - a1 - k)} mod ${n(m)} = ${n(b1)}. Check: ${n(a1)} ∗ ${n(b1)} = (${n(a1)} + ${n(b1)} + ${n(k)}) mod ${n(m)} = ${n(a1 + b1 + k)} mod ${n(m)} = ${n(e)}. For the inverse of ${n(a2)}: b = (${n(e)} − ${n(a2 + k)}) mod ${n(m)} = ${n(e - a2 - k)} mod ${n(m)} = ${n(b2)}. Check: ${n(a2)} ∗ ${n(b2)} = ${n(a2 + b2 + k)} mod ${n(m)} = ${n(e)}.`,
  guidance: [
   { prompt: `e ∗ x = x for every x means e + ${n(k)} is a whole number of turns of ${n(m)}. Which setting e from 0 to ${n(m - 1)} makes e + ${n(k)} = ${n(m)}?`, answer: [e], explanation: `e = ${n(m)} − ${n(k)} = ${n(e)}. Check: ${n(e)} ∗ 1 = ${n(e + 1 + k)} mod ${n(m)} = ${n((e + 1 + k) % m)}.` },
   { prompt: `The inverse b of ${n(a1)} needs (${n(a1)} + b + ${n(k)}) mod ${n(m)} = ${n(e)}. What is b = (${n(e)} − ${n(a1 + k)}) mod ${n(m)}?`, answer: [b1], explanation: `${n(e)} − ${n(a1 + k)} = ${n(e - a1 - k)}, and ${modText(e - a1 - k, m)}. Check: ${n(a1)} ∗ ${n(b1)} = ${n(a1 + b1 + k)} mod ${n(m)} = ${n(e)}.` },
   { prompt: `The inverse b of ${n(a2)} needs (${n(a2)} + b + ${n(k)}) mod ${n(m)} = ${n(e)}. What is b = (${n(e)} − ${n(a2 + k)}) mod ${n(m)}?`, answer: [b2], explanation: `${n(e)} − ${n(a2 + k)} = ${n(e - a2 - k)}, and ${modText(e - a2 - k, m)}. Check: ${n(a2)} ∗ ${n(b2)} = ${n(a2 + b2 + k)} mod ${n(m)} = ${n(e)}.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'The relay and its undo',
 brief: 'A relay applies two settings one after the other, and Mira needs the single setting that does the same job and the setting that undoes it.',
 labels: ['combined setting', 'undo setting'], tolerance: 0.01,
 gl: [['combined setting'], ['identity e'], ['undo setting']]
}, {
 /* t = s1 ∗ s2 with x ∗ y = (x + y + k) mod m, e = m − k, undo u = (e − t − k) mod m. t is not e. */
 canonical: { m: 13, k: 5, s1: 6, s2: 9 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(6, 16), k = R.int(1, m - 1), p = { m, k, s1: R.int(1, m - 1), s2: R.int(1, m - 1) };
   if (md(p.s1 + p.s2 + k, m) !== m - k && !(m === 6 && k === 1)) return p; } return { m: 13, k: 5, s1: 6, s2: 9 }; },
 build: ({ m, k, s1, s2 }) => { const sum = s1 + s2 + k, t = sum % m, e = m - k, raw = e - t - k, u = md(raw, m); return {
  prompt: `A relay in the Lock Workshop works on settings 0 to ${n(m - 1)} that combine by the rule x ∗ y = (x + y + ${n(k)}) mod ${n(m)}. It applies setting ${n(s1)} and then setting ${n(s2)}, which does the same job as the single setting t = ${n(s1)} ∗ ${n(s2)}. Enter t. The crew then fits an undo setting u that brings the relay back to the neutral setting: t ∗ u = e, where the identity element e is the setting with e ∗ x = x for every x. Enter u.`,
  answer: [t, u],
  hints: ['Put the two settings into the rule, in the order given, add the fixed extra amount, and take the remainder to get t.', 'The neutral setting e is the one for which e plus the fixed extra amount makes a whole number of turns. The undo setting u is the inverse of t: it must make (t + u + the extra amount) leave the remainder e.'],
  solution: `t = ${n(s1)} ∗ ${n(s2)} = (${n(s1)} + ${n(s2)} + ${n(k)}) mod ${n(m)} = ${n(sum)} mod ${n(m)}, and ${divText(sum, m)}, so t = ${n(t)}. The identity e has e + ${n(k)} = ${n(m)}, so e = ${n(e)}. For the undo setting, (${n(t)} + u + ${n(k)}) mod ${n(m)} must be ${n(e)}, so u = (${n(e)} − ${n(t + k)}) mod ${n(m)} = ${n(raw)} mod ${n(m)} = ${n(u)}. Check: ${n(t)} ∗ ${n(u)} = (${n(t)} + ${n(u)} + ${n(k)}) mod ${n(m)} = ${n(t + u + k)} mod ${n(m)} = ${n(e)}.`,
  guidance: [
   { prompt: `What is t = ${n(s1)} ∗ ${n(s2)} = (${n(s1)} + ${n(s2)} + ${n(k)}) mod ${n(m)}?`, answer: [t], explanation: `${n(s1)} + ${n(s2)} + ${n(k)} = ${n(sum)}, and ${divText(sum, m)}, so t = ${n(t)}.` },
   { prompt: `e ∗ x = x for every x means e + ${n(k)} is a whole number of turns of ${n(m)}. What is the identity element e, with e + ${n(k)} = ${n(m)}?`, answer: [e], explanation: `e = ${n(m)} − ${n(k)} = ${n(e)}.` },
   { prompt: `The undo setting u needs (${n(t)} + u + ${n(k)}) mod ${n(m)} = ${n(e)}. What is u = (${n(e)} − ${n(t + k)}) mod ${n(m)}?`, answer: [u], explanation: `${n(e)} − ${n(t + k)} = ${n(raw)}, and ${modText(raw, m)}. Check: ${n(t)} ∗ ${n(u)} = ${n(t + u + k)} mod ${n(m)} = ${n(e)}.` }
  ] }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', uses: 'q01', title: 'The offset dials',
 brief: 'A cipher dial combines settings with a rule that takes an amount away, and the crew needs its neutral setting and two undo settings.',
 labels: ['identity e', 'first inverse', 'second inverse'], tolerance: 0.01,
 gl: [['identity e'], ['first inverse'], ['second inverse']]
}, {
 /* x ∗ y = (x + y − s) mod m, m from 12 to 40: the identity is e = s, the inverse of x is (2s − x) mod m. Neither
    digit is e and they differ. Uses subtracting mod n from q01. */
 canonical: { m: 29, s: 11, a: 20, b: 3 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.int(12, 40), s = R.int(1, m - 1), p = { m, s, a: R.int(0, m - 1), b: R.int(0, m - 1) };
   if (p.a !== s && p.b !== s && p.a !== p.b) return p; } return { m: 29, s: 11, a: 20, b: 3 }; },
 build: ({ m, s, a, b }) => { const ra = 2 * s - a, rb = 2 * s - b, ia = md(ra, m), ib = md(rb, m); return {
  prompt: `A cipher dial in the Lock Workshop has the settings 0 to ${n(m - 1)} and combines two settings by the rule x ∗ y = (x + y − ${n(s)}) mod ${n(m)}: add them, take away ${n(s)}, and if the result is negative add ${n(m)} as many times as needed to bring it into the range 0 to ${n(m - 1)}. Enter the identity element e of ∗, the setting with e ∗ x = x for every x. Then enter the inverse of ${n(a)} and the inverse of ${n(b)}: for each setting x, the setting u with x ∗ u = e.`,
  answer: [s, ia, ib],
  hints: ['For e ∗ x to come back to x, the amount e adds must cancel the fixed amount the rule takes away: e minus that amount must make a whole number of full turns of the dial.', 'For the inverse of x, the setting u must make (x + u − the fixed amount) leave the remainder e. Solve for u, then bring a negative result into the range of the dial.'],
  solution: `e ∗ x = (e + x − ${n(s)}) mod ${n(m)} equals x for every x when e − ${n(s)} = 0, so e = ${n(s)}. Check: ${n(s)} ∗ 1 = (${n(s)} + 1 − ${n(s)}) mod ${n(m)} = 1. For the inverse of ${n(a)}: (${n(a)} + u − ${n(s)}) mod ${n(m)} must be ${n(s)}, so u = (${n(s)} + ${n(s)} − ${n(a)}) mod ${n(m)} = ${n(ra)} mod ${n(m)} = ${n(ia)}. Check: ${n(a)} ∗ ${n(ia)} = (${n(a)} + ${n(ia)} − ${n(s)}) mod ${n(m)} = ${n(a + ia - s)} mod ${n(m)} = ${n(s)}. For the inverse of ${n(b)}: u = (${n(s)} + ${n(s)} − ${n(b)}) mod ${n(m)} = ${n(rb)} mod ${n(m)} = ${n(ib)}. Check: ${n(b)} ∗ ${n(ib)} = ${n(b + ib - s)} mod ${n(m)} = ${n(s)}.`,
  guidance: [
   { prompt: `e ∗ x = x for every x needs e − ${n(s)} to be 0 (or a whole number of turns). Which setting e from 0 to ${n(m - 1)} does this?`, answer: [s], explanation: `e = ${n(s)}. Check: ${n(s)} ∗ 1 = 1.` },
   { prompt: `The inverse u of ${n(a)} needs (${n(a)} + u − ${n(s)}) mod ${n(m)} = ${n(s)}, so u = (${n(s)} + ${n(s)} − ${n(a)}) mod ${n(m)}. What is u?`, answer: [ia], explanation: `${n(s)} + ${n(s)} − ${n(a)} = ${n(ra)}, and ${modText(ra, m)}. Check: ${n(a)} ∗ ${n(ia)} = ${n(a + ia - s)} mod ${n(m)} = ${n(s)}.` },
   { prompt: `The inverse u of ${n(b)} needs (${n(b)} + u − ${n(s)}) mod ${n(m)} = ${n(s)}, so u = (${n(s)} + ${n(s)} − ${n(b)}) mod ${n(m)}. What is u?`, answer: [ib], explanation: `${n(s)} + ${n(s)} − ${n(b)} = ${n(rb)}, and ${modText(rb, m)}. Check: ${n(b)} ∗ ${n(ib)} = ${n(b + ib - s)} mod ${n(m)} = ${n(s)}.` }
  ] }; }
});

/* ---- q05 The group rules [3.2] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'The scrambler rule check',
 brief: 'A digit scrambler is about to be fitted to a vault keypad, and the crew wants it checked against the rules before anyone trusts it.',
 labels: ['scramble', 'closed (1 or 0)', 'inverses (1 or 0)', 'group (1 or 0)'], tolerance: 0.01,
 gl: [['scramble'], ['closed (1 or 0)'], ['inverses (1 or 0)'], ['group (1 or 0)']]
}, {
 /* Digits 1 … m − 1 under × mod m, m from 4 to 20: closed, with inverses and a group exactly when m is prime. The scramble is at
    least 2. Not the worked example (m = 6). */
 canonical: { m: 13, a: 6, b: 9 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.bool() ? R.pick(PRIMES) : R.pick(COMPOSITES), p = { m, a: R.int(2, m - 1), b: R.int(2, m - 1) };
   if (m !== 6 && p.a !== p.b && (p.a * p.b) % m >= 2) return p; } return { m: 13, a: 6, b: 9 }; },
 build: ({ m, a, b }) => { const pr = a * b, r = pr % m, prime = isPrime(m), d = small(m), q = m / d, f = prime ? 1 : 0; return {
  prompt: `A digit scrambler in the Lock Workshop uses the digits 1 to ${n(m - 1)}; the digit 0 is not used. To scramble two digits it multiplies them and keeps the remainder on division by ${n(m)}. Multiplying is associative, so take that rule as given. First enter the scramble of ${n(a)} and ${n(b)}, (${n(a)} × ${n(b)}) mod ${n(m)}. Then enter 1 if every scramble of two digits is again one of the digits, 0 if not. Then enter 1 if every digit has an inverse, 0 if not. Last enter 1 if the digits with this scrambling form a group, 0 if not.`,
  answer: [r, f, f, f],
  hints: ['A scramble of two digits can leave the digits when the product is a whole number of turns of the dial, because the remainder is then 0, which is not a digit. Look for two digits whose product is the dial size.', 'The digit 1 changes nothing, so an identity always exists here. A group needs all four rules: closed, associative, an identity and an inverse for every digit.'],
  solution: `${n(a)} × ${n(b)} = ${n(pr)}, and ${divText(pr, m)}, so the scramble is ${n(r)}. ` + (prime
   ? `${n(m)} is prime, so a product of two digits from 1 to ${n(m - 1)} is never a multiple of ${n(m)}: the remainder is never 0, and the digits are closed under scrambling (1). For any digit x, the ${n(m - 1)} products x × 1, x × 2, …, x × ${n(m - 1)} mod ${n(m)} are all different and none is 0, so one of them is 1: every digit has an inverse (1). Multiplying is associative as given, and 1 × x = x, so the digits form a group (1).`
   : `${n(m)} = ${n(d)} × ${n(q)}, and both ${n(d)} and ${n(q)} are digits, but (${n(d)} × ${n(q)}) mod ${n(m)} = 0, which is not a digit: the digits are not closed (0). Every product ${n(d)} × x is a multiple of ${n(d)}, and so is ${n(m)}, so its remainder is a multiple of ${n(d)} and never 1: ${n(d)} has no inverse (0). With a rule failing, the digits do not form a group (0).`),
  guidance: [
   { prompt: `What is (${n(a)} × ${n(b)}) mod ${n(m)}?`, answer: [r], explanation: `${n(a)} × ${n(b)} = ${n(pr)}, and ${divText(pr, m)}.` },
   { prompt: `Is every scramble of two digits again a digit? Enter 1 for yes, 0 for no.`, answer: [f], explanation: prime ? `Yes: ${n(m)} has no factors to multiply to a whole number of turns, so no scramble gives 0.` : `No: ${n(d)} × ${n(q)} = ${n(m)} is exactly one full turn, so scrambling ${n(d)} with ${n(q)} gives 0, which is not a digit.` },
   { prompt: `Does every digit have an inverse? Enter 1 for yes, 0 for no.`, answer: [f], explanation: prime ? `Yes: for each digit x, the products x × 1 to x × ${n(m - 1)} are all different and never 0, so one of them is 1.` : `No: every product ${n(d)} × x leaves a multiple of ${n(d)}, never 1, so ${n(d)} has no inverse.` },
   { prompt: `Is it a group? It must be closed, associative, have an identity and give every digit an inverse. Enter 1 for yes, 0 for no.`, answer: [f], explanation: prime ? `Yes: all four rules hold.` : `No: it fails closure and inverses.` }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Two plans for the vault dial',
 brief: 'The crew has two plans for a vault dial, one that adds and one that multiplies, and Mira wants to know which could be a group and how the adding plan undoes a setting.',
 labels: ['inverse of the setting in plan A', 'self-inverse settings in plan A', 'plan B is a group (1 or 0)'], tolerance: 0.01,
 gl: [['inverse in plan A'], ['self-inverse settings'], ['plan B is a group (1 or 0)']]
}, {
 /* Plan A: 0 … m − 1 under + mod m (identity 0, inverse of x is m − x, self-inverse settings are 0 and, when m is even,
    m ÷ 2). Plan B: 1 … m − 1 under × mod m, a group exactly when m is prime. a is not 0 and not m ÷ 2. */
 canonical: { m: 12, a: 5 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.bool() ? R.pick(PRIMES) : R.pick(COMPOSITES), p = { m, a: R.int(1, m - 1) };
   if (2 * p.a !== m && m !== 6) return p; } return { m: 12, a: 5 }; },
 build: ({ m, a }) => { const inv = m - a, self = m % 2 === 0 ? 2 : 1, prime = isPrime(m), g = prime ? 1 : 0, d = small(m), q = m / d; return {
  prompt: `The Lock Workshop has two plans for a dial with ${n(m)} positions. Plan A uses the settings 0 to ${n(m - 1)}, combined by adding and keeping the remainder on division by ${n(m)}. Plan B uses the settings 1 to ${n(m - 1)}, combined by multiplying and keeping the remainder on division by ${n(m)}. Both operations are associative, so take that as given. In plan A the identity element is 0, so the inverse of a setting x is the setting y with (x + y) mod ${n(m)} = 0. Enter the inverse of ${n(a)} in plan A. Then enter how many settings in plan A are their own inverse. Last, enter 1 if plan B is a group, 0 if not.`,
  answer: [inv, self, g],
  hints: ['Adding x and y gives a whole number of turns exactly when the two together make the dial size, or 0 for the setting 0 itself. A setting is its own inverse when adding it to itself gives a whole number of turns.', 'Plan B is a group only if it is closed, has an identity and gives every setting an inverse. Look for two settings whose product is the dial size: the remainder is then 0, which plan B does not contain.'],
  solution: `In plan A, (${n(a)} + y) mod ${n(m)} = 0 needs ${n(a)} + y = ${n(m)}, so y = ${n(m)} − ${n(a)} = ${n(inv)}. A setting x is its own inverse when (x + x) mod ${n(m)} = 0, so 2x is 0 or ${n(m)}: x = 0 always works${m % 2 === 0 ? `, and x = ${n(m / 2)} works because ${n(m / 2)} + ${n(m / 2)} = ${n(m)}, so there are 2 such settings` : `, and no other x does because ${n(m)} is odd and cannot be 2x, so there is 1 such setting`}. Plan B: ` + (prime
   ? `${n(m)} is prime, so a product of two settings from 1 to ${n(m - 1)} is never a multiple of ${n(m)}. The plan is closed, 1 is the identity, and every setting has an inverse, so plan B is a group (1).`
   : `${n(m)} = ${n(d)} × ${n(q)}, and both ${n(d)} and ${n(q)} are settings, but (${n(d)} × ${n(q)}) mod ${n(m)} = 0, which is not in plan B: it is not closed, so it is not a group (0).`),
  guidance: [
   { prompt: `In plan A the inverse y of ${n(a)} needs ${n(a)} + y to be one full turn of ${n(m)}. What is y = ${n(m)} − ${n(a)}?`, answer: [inv], explanation: `${n(m)} − ${n(a)} = ${n(inv)}, and (${n(a)} + ${n(inv)}) mod ${n(m)} = 0.` },
   { prompt: `A setting x is its own inverse when (x + x) mod ${n(m)} = 0. Setting 0 always is. Is there another setting from 1 to ${n(m - 1)} with 2x equal to ${n(m)}? Enter how many settings are their own inverse in all.`, answer: [self], explanation: m % 2 === 0 ? `Yes: x = ${n(m / 2)}, since ${n(m / 2)} + ${n(m / 2)} = ${n(m)}. That makes 2 settings.` : `No: ${n(m)} is odd, so it is not twice a whole number. Only 0 works, so there is 1 setting.` },
   { prompt: `Plan B multiplies settings 1 to ${n(m - 1)}. Enter 1 if it is a group, 0 if not.`, answer: [g], explanation: prime ? `Yes: ${n(m)} is prime, so no product of two settings is a multiple of ${n(m)}, and every setting has an inverse.` : `No: ${n(d)} × ${n(q)} = ${n(m)} leaves 0, which is not in plan B, so it is not closed.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', uses: 'q04', title: 'Dial P against dial Q',
 brief: 'Two vault dials with the same number of settings are being compared, and the crew needs to know which of them is a group and how dial P undoes a setting.',
 labels: ['identity e of dial P', 'inverse in dial P', 'dial Q is a group (1 or 0)'], tolerance: 0.01,
 gl: [['identity e'], ['inverse in dial P'], ['dial Q is a group (1 or 0)']]
}, {
 /* Dial P: 0 … m − 1 under x ∗ y = (x + y + k) mod m (a group: e = m − k, inverse (e − a − k) mod m, a is not e). Dial Q: 1 … m − 1
    under × mod m, a group exactly when m is prime. m from 13 to 39. Uses the identity and inverse of q04. */
 canonical: { m: 28, k: 9, a: 11 },
 draw: R => { for (let i = 0; i < 1000; i++) { const m = R.bool() ? R.pick(BIGPRIMES) : R.pick(BIGCOMP), k = R.int(1, m - 1), p = { m, k, a: R.int(0, m - 1) };
   if (p.a !== m - k) return p; } return { m: 28, k: 9, a: 11 }; },
 build: ({ m, k, a }) => { const e = m - k, raw = e - a - k, b = md(raw, m), prime = isPrime(m), g = prime ? 1 : 0, d = small(m), q = m / d; return {
  prompt: `The Vault Works compares two dials that both have ${n(m)} settings. Dial P has the settings 0 to ${n(m - 1)}, combined by x ∗ y = (x + y + ${n(k)}) mod ${n(m)}. Dial Q has the settings 1 to ${n(m - 1)}, combined by multiplying and keeping the remainder on division by ${n(m)}. Both operations are associative, so take that as given. Enter the identity element e of dial P, the setting with e ∗ x = x for every x. Then enter the inverse of ${n(a)} in dial P: the setting b with ${n(a)} ∗ b = e. Last, enter 1 if dial Q is a group, 0 if not.`,
  answer: [e, b, g],
  hints: ['For dial P, e ∗ x = x means e plus the fixed extra amount makes a whole number of full turns. For the inverse of a, the setting b must make (a + b + the extra amount) leave the remainder e.', 'Dial Q is a group only if it is closed, has an identity and gives every setting an inverse. Check whether two settings can multiply to the dial size: the remainder is then 0, which dial Q does not contain.'],
  solution: `Dial P: e ∗ x = (e + x + ${n(k)}) mod ${n(m)} equals x for every x only when e + ${n(k)} is a whole number of turns of ${n(m)}, so e + ${n(k)} = ${n(m)} and e = ${n(e)}. For the inverse of ${n(a)}: (${n(a)} + b + ${n(k)}) mod ${n(m)} must be ${n(e)}, so b = (${n(e)} − ${n(a + k)}) mod ${n(m)} = ${n(raw)} mod ${n(m)} = ${n(b)}. Check: ${n(a)} ∗ ${n(b)} = (${n(a)} + ${n(b)} + ${n(k)}) mod ${n(m)} = ${n(a + b + k)} mod ${n(m)} = ${n(e)}. Dial Q: ` + (prime
   ? `${n(m)} is prime, so a product of two settings from 1 to ${n(m - 1)} is never a multiple of ${n(m)}. The dial is closed, 1 is the identity, and every setting has an inverse, so dial Q is a group (1).`
   : `${n(m)} = ${n(d)} × ${n(q)}, and both ${n(d)} and ${n(q)} are settings, but (${n(d)} × ${n(q)}) mod ${n(m)} = 0, which is not a setting of dial Q: it is not closed, so it is not a group (0).`),
  guidance: [
   { prompt: `e + ${n(k)} must be one full turn of ${n(m)}. What is the identity element e of dial P?`, answer: [e], explanation: `e = ${n(m)} − ${n(k)} = ${n(e)}.` },
   { prompt: `The inverse b of ${n(a)} needs (${n(a)} + b + ${n(k)}) mod ${n(m)} = ${n(e)}. What is b = (${n(e)} − ${n(a + k)}) mod ${n(m)}?`, answer: [b], explanation: `${n(e)} − ${n(a + k)} = ${n(raw)}, and ${modText(raw, m)}. Check: ${n(a)} ∗ ${n(b)} = ${n(a + b + k)} mod ${n(m)} = ${n(e)}.` },
   { prompt: `Dial Q multiplies the settings 1 to ${n(m - 1)}. Enter 1 if it is a group, 0 if not.`, answer: [g], explanation: prime ? `Yes: ${n(m)} is prime, so no product of two settings is a multiple of ${n(m)}, and every setting has an inverse.` : `No: ${n(d)} × ${n(q)} = ${n(m)} leaves 0, which is not a setting of dial Q, so it is not closed.` }
  ] }; }
});

})();
