/* Topology: shape without size practice missions, file 8 of 8: concepts q36–q40, three practice missions each
   (q36b q36c q36d q37b q37c q37d q38b q38c q38d q39b q39c q39d q40b q40c q40d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p8.js. */
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
/* Bounded retry: up to 1000 tries of make(), else the fallback (canonical) parameters. */
const tries = (make, ok, fallback) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return fallback; };
const r2 = x => Math.round(x * 100 + 1e-9) / 100, r3 = x => Math.round(x * 1000 + 1e-9) / 1000;
/* True when x sits within 0.1 of a rounding tie at k decimal places. */
const nearTie = (x, k) => { const f = Math.abs(x) * Math.pow(10, k) % 1; return Math.abs(f - 0.5) < 0.1; };
const nearInt = x => Math.abs(x - Math.round(x)) < 0.02;
/* Root of g between a and b by halving; g(a) and g(b) have opposite signs. */
const halve = (g, a, b) => { const pos = g(a) > 0; for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if ((g(m) > 0) === pos) a = m; else b = m; } return (a + b) / 2; };
/* "once", "twice", "3 times"; laps(1) is "1 lap"; and-lists: andList(['A', 'B', 'C']) is "A, B and C". */
const tm = k => k === 1 ? 'once' : k === 2 ? 'twice' : `${n(k)} times`;
const laps = k => k === 1 ? '1 lap' : `${n(k)} laps`;
const turnsDir = w => `${tm(Math.abs(w))} ${w > 0 ? 'anticlockwise' : 'clockwise'}`;
const andList = a => a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
/* A sum written as terms: sumText([3, −2, 4]) is "3 + (−2) + 4". */
const sumText = list => list.map((t, i) => i ? par(t) : n(t)).join(' + ');
/* The map θ ↦ aθ. */
const mapText = a => `θ ↦ ${a === 1 ? '' : a === -1 ? '−' : n(a)}θ`;
const pickNz = (R, list) => R.pick(list);

/* ---- q36 Joining loops: winding numbers add [W The fundamental group] ---- */

/* Sectors round a point, numbered anticlockwise from NE; ray j is the border between sector j and sector j + 1, crossed
   anticlockwise by a move from j to j + 1. */
const SEC = ['NE', 'NW', 'SW', 'SE'];
const RAYS = [{ dir: 'due north', a: 'NE', b: 'NW' }, { dir: 'due west', a: 'NW', b: 'SW' }, { dir: 'due south', a: 'SW', b: 'SE' }, { dir: 'due east', a: 'SE', b: 'NE' }];
/* A closed log of sector numbers, starting and ending in NE, with net winding number w and wig step-and-back wiggles. */
const loopLog = (R, w, wig) => {
 const units = [];
 for (let i = 0; i < 4 * Math.abs(w); i++) units.push([w > 0 ? 1 : -1]);
 for (let i = 0; i < wig; i++) { const e = R.bool() ? 1 : -1; units.push([e, -e]); }
 for (let i = units.length - 1; i > 0; i--) { const j = R.int(0, i); [units[i], units[j]] = [units[j], units[i]]; }
 const seq = [0]; for (const u of units) for (const s of u) seq.push((seq[seq.length - 1] + s + 4) % 4);
 return seq;
};
/* [anticlockwise, clockwise] crossings of ray j in a log. */
const crossCount = (seq, j) => { let up = 0, down = 0; for (let i = 0; i + 1 < seq.length; i++) { if (seq[i] === j && seq[i + 1] === (j + 1) % 4) up++; else if (seq[i] === (j + 1) % 4 && seq[i + 1] === j) down++; } return [up, down]; };
const logText = seq => seq.map(s => SEC[s]).join(', ');

mk({
 id: 'q36b', parent: 'q36', kind: 'setting', title: 'The water tank patrol',
 brief: 'Two rover patrols circle the water tank, and the logbook needs one winding number for each patrol and for the combined round.',
 labels: ['winding of p', 'winding of q', 'p, q backwards, p'], tolerance: 0.01,
 gl: [['winding of p'], ['winding of q'], ['p, q backwards, p']]
}, {
 /* Each loop is given by its crossing counts of a marker line (no log to read). The windings of p and q differ, so
    “p, then q backwards, then p” (2 × wp − wq) never equals either of them. Not the q36 worked example (windings 2 and −1). */
 canonical: { u1: 4, d1: 1, u2: 1, d2: 3 },
 draw: R => tries(() => ({ u1: R.int(0, 4), d1: R.int(0, 4), u2: R.int(0, 4), d2: R.int(0, 4) }),
  p => { const wp = p.u1 - p.d1, wq = p.u2 - p.d2; return wp !== wq && !(wp === 2 && wq === -1); }, { u1: 4, d1: 1, u2: 1, d2: 3 }),
 build: ({ u1, d1, u2, d2 }) => { const wp = u1 - d1, wq = u2 - d2, w3 = 2 * wp - wq; return {
  prompt: `A rover patrols round the water tank T. Two patrol loops p and q both start and end at the gate and never pass over T. Counted against a marker line that runs straight out from T, loop p crosses the line ${tm(u1)} going anticlockwise round T and ${tm(d1)} going clockwise; loop q crosses it ${tm(u2)} going anticlockwise and ${tm(d2)} going clockwise. Enter the winding number round T of p, then of q, then of the loop “p, then q backwards, then p”.`,
  answer: [wp, wq, w3],
  hints: ['The winding number of a loop is its anticlockwise crossings of the line minus its clockwise crossings.', 'Joining loops adds their winding numbers, and running a loop backwards changes the sign of its winding number. The loop “p, then q backwards, then p” contains p twice.'],
  solution: `Loop p has winding number ${n(u1)} − ${n(d1)} = ${n(wp)} and loop q has ${n(u2)} − ${n(d2)} = ${n(wq)}. Run backwards, q has winding number ${n(-wq)}. Joining adds, so “p, then q backwards, then p” has ${sumText([wp, -wq, wp])} = ${n(w3)}.`,
  guidance: [
   { prompt: `Loop p crosses the line ${tm(u1)} anticlockwise and ${tm(d1)} clockwise. What is its winding number?`, answer: [wp], explanation: `Anticlockwise minus clockwise: ${n(u1)} − ${n(d1)} = ${n(wp)}.` },
   { prompt: `Loop q crosses the line ${tm(u2)} anticlockwise and ${tm(d2)} clockwise. What is its winding number?`, answer: [wq], explanation: `Anticlockwise minus clockwise: ${n(u2)} − ${n(d2)} = ${n(wq)}.` },
   { prompt: 'Joining adds and running backwards changes the sign. What is the winding number of “p, then q backwards, then p”?', answer: [w3], explanation: `${sumText([wp, -wq, wp])} = ${n(w3)}.` }
  ] }; }
});

mk({
 id: 'q36c', parent: 'q36', kind: 'applied', title: 'The mast tether plan',
 brief: 'The tether rover has three standard loops round the mast, and the crew must plan a run and know how much more winding it needs.',
 labels: ['winding of the run', 'winding of the run backwards', 'extra laps'], tolerance: 0.01,
 gl: [['winding of the run'], ['winding backwards'], ['extra laps']]
}, {
 /* The run is “a, then b backwards, then a, then c”: 2a − b + c. It never winds 0, so running it backwards (−N) differs from N.
    The target T is always above N, so the extra laps are a positive count. Not the q36 worked example (a = 2, b = −1). */
 canonical: { wa: 3, wb: 2, wc: -1, T: 7 },
 draw: R => tries(() => { const p = { wa: R.nz(-4, 4), wb: R.nz(-4, 4), wc: R.nz(-4, 4) }; p.T = 2 * p.wa - p.wb + p.wc + R.int(1, 6); return p; },
  p => 2 * p.wa - p.wb + p.wc !== 0 && !(p.wa === 2 && p.wb === -1), { wa: 3, wb: 2, wc: -1, T: 7 }),
 build: ({ wa, wb, wc, T }) => { const N = 2 * wa - wb + wc, e = T - N; return {
  prompt: `A tether rover flies standard loops from the depot round the mast M, never passing over M. Loop a goes ${turnsDir(wa)} round M (winding number ${n(wa)}), loop b goes ${turnsDir(wb)} (winding number ${n(wb)}) and loop c goes ${turnsDir(wc)} (winding number ${n(wc)}). The planned run is “a, then b backwards, then a, then c”. Flying a whole run backwards means flying its loops in the opposite order, each one the other way round. Enter the winding number of the planned run, then the winding number of the planned run flown backwards, then how many extra single anticlockwise laps of M (each of winding number 1) must be joined on to the planned run to make its winding number exactly ${n(T)}.`,
  answer: [N, -N, e],
  hints: ['Joining loops adds their winding numbers and running a loop backwards changes its sign. Write the planned run as a sum of winding numbers, counting a twice.', 'Flying a whole run backwards turns every loop round, so its winding number changes sign. Each extra anticlockwise lap adds 1 to the winding number.'],
  solution: `The planned run has winding number ${sumText([wa, -wb, wa, wc])} = ${n(N)}. Flown backwards every loop is reversed, so its winding number is ${n(-N)}. Each extra lap adds 1, so ${n(T)} − ${par(N)} = ${n(e)}: ${laps(e)} are needed.`,
  guidance: [
   { prompt: 'What is the winding number of “a, then b backwards, then a, then c”?', answer: [N], explanation: `${sumText([wa, -wb, wa, wc])} = ${n(N)}.` },
   { prompt: `The planned run has winding number ${n(N)}. What is the winding number of the planned run flown backwards?`, answer: [-N], explanation: `Running backwards changes the sign: ${n(-N)}.` },
   { prompt: `Each extra anticlockwise lap adds 1 to the winding number of ${n(N)}. How many extra laps make it ${n(T)}?`, answer: [e], explanation: `${n(T)} − ${par(N)} = ${n(e)}.` }
  ] }; }
});

mk({
 id: 'q36d', parent: 'q36', kind: 'challenge', uses: 'q35', title: 'The mast crawler logs',
 brief: 'Two crawlers have logged long loops round the signal mast, and the logs wander back and forth before the route is joined up.',
 labels: ['winding of a', 'winding of b', 'a twice, then b backwards'], tolerance: 0.01,
 gl: [['winding of a'], ['winding of b'], ['a twice, then b backwards']]
}, {
 /* A log is built from whole turns and 1 or 2 step-and-back wiggles, so it crosses the ray more often than it winds. j is the
    ray (an index into the four borders). The windings differ (so 2wa − wb is neither of them) and are not 2 and −1 (the q36
    worked example). The canonical logs are written out. */
 canonical: { j: 0, a: [0, 3, 2, 3, 2, 1, 0, 3, 2, 1, 0], b: [0, 1, 2, 1, 2, 3, 0, 3, 0] },
 draw: R => tries(() => { const wa = R.int(-3, 3), wb = R.int(-3, 3); return { j: R.int(0, 3), a: loopLog(R, wa, R.int(1, 2)), b: loopLog(R, wb, R.int(1, 2)), wa, wb }; },
  p => p.wa !== p.wb && !(p.wa === 2 && p.wb === -1), { j: 0, a: [0, 3, 2, 3, 2, 1, 0, 3, 2, 1, 0], b: [0, 1, 2, 1, 2, 3, 0, 3, 0] }),
 build: ({ j, a, b }) => { const ray = RAYS[j], [ua, da] = crossCount(a, j), [ub, db] = crossCount(b, j), wa = ua - da, wb = ub - db, w3 = 2 * wa - wb; return {
  prompt: `Round the signal mast M, the lines due north and due east through M split the ground into four sectors, NE, NW, SW and SE, which follow each other anticlockwise. Two crawler loops a and b start and end in NE, never pass over M, and each move goes into a neighbouring sector. Loop a logs ${logText(a)}. Loop b logs ${logText(b)}. Use the ray ${ray.dir} from M, the border between ${ray.a} and ${ray.b}, for both loops. Enter the winding number round M of loop a, then of loop b, then of the route “a flown twice, then b flown backwards”.`,
  answer: [wa, wb, w3],
  hints: [`Read each log in pairs of neighbouring entries. A move from ${ray.a} straight to ${ray.b} crosses the ray anticlockwise and a move from ${ray.b} straight to ${ray.a} crosses it clockwise; every other move stays clear of it.`, 'A loop’s winding number is its anticlockwise crossings minus its clockwise crossings. Joining adds winding numbers and flying a loop backwards changes the sign, so the route has twice the winding number of a, minus that of b.'],
  solution: `Loop a goes straight from ${ray.a} to ${ray.b} ${tm(ua)} (anticlockwise) and from ${ray.b} to ${ray.a} ${tm(da)} (clockwise), so its winding number is ${n(ua)} − ${n(da)} = ${n(wa)}. Loop b goes ${ray.a} to ${ray.b} ${tm(ub)} and ${ray.b} to ${ray.a} ${tm(db)}, so its winding number is ${n(ub)} − ${n(db)} = ${n(wb)}. The route has winding number 2 × ${par(wa)} − ${par(wb)} = ${n(w3)}.`,
  guidance: [
   { prompt: `Count the moves of loop a from ${ray.a} straight to ${ray.b} and subtract the moves from ${ray.b} straight to ${ray.a}. What is the winding number of a?`, answer: [wa], explanation: `Anticlockwise crossings minus clockwise ones: ${n(ua)} − ${n(da)} = ${n(wa)}.` },
   { prompt: `Do the same for loop b. What is the winding number of b?`, answer: [wb], explanation: `Anticlockwise crossings minus clockwise ones: ${n(ub)} − ${n(db)} = ${n(wb)}.` },
   { prompt: 'What is the winding number of “a flown twice, then b flown backwards”?', answer: [w3], explanation: `2 × ${par(wa)} − ${par(wb)} = ${n(w3)}.` }
  ] }; }
});

/* ---- q37 Wrapping maps of the circle [W The fundamental group] ---- */

const dirText = s => s > 0 ? 'in the same direction' : 'in the opposite direction';

mk({
 id: 'q37b', parent: 'q37', kind: 'setting', title: 'The valve gear train',
 brief: 'A coolant valve is turned by three gear stages in a row, and the maintenance sheet needs the combined drive described.',
 labels: ['degree', 'points sent to angle 0', 'winding of the test loop'], tolerance: 0.01,
 gl: [['degree'], ['points sent to angle 0'], ['winding of the test loop']]
}, {
 /* Three stages θ ↦ aθ, bθ, cθ, each factor from ±1 to ±4, with the combined degree at least 2 in size, so the points count is
    never 1. The test loop's winding number k is not 0; the image winding number M = n × k is printed. The signs vary, so the
    degree and the points count differ in about half the draws. Not the q37 worked example (two stages 3 and −2). */
 canonical: { a: 2, b: -3, c: 2, k: -2 },
 draw: R => tries(() => ({ a: R.pick([-4, -3, -2, -1, 1, 2, 3, 4]), b: R.pick([-4, -3, -2, -1, 1, 2, 3, 4]), c: R.pick([-4, -3, -2, -1, 1, 2, 3, 4]), k: R.nz(-4, 4) }),
  p => Math.abs(p.a * p.b * p.c) >= 2, { a: 2, b: -3, c: 2, k: -2 }),
 build: ({ a, b, c, k }) => { const d = a * b * c, M = d * k; return {
  prompt: `A coolant valve on the Orbit Ring is turned through three gear stages in a row, and its handle moves round a circular dial at angle θ. The first stage is the map f: ${mapText(a)}, the second is g: ${mapText(b)} and the third is h: ${mapText(c)}, each applied to the angle the stage before it gives (a negative factor means that stage turns the other way). The combined map takes θ to h(g(f(θ))). Enter the degree of the combined map, then how many points of the dial it sends to the single point at angle 0. A test loop goes round the dial a whole number of times, and its image under the combined map has winding number ${n(M)}. Enter the winding number of the test loop.`,
  answer: [d, Math.abs(d), k],
  hints: ['A map θ ↦ nθ has degree n. Doing one map after another multiplies the degrees, so multiply the three factors.', 'A map of degree n (not 0) sends exactly |n| points to each point. A loop with winding number k goes to a loop with winding number n × k, so to undo it divide the image winding number by the degree.'],
  solution: `The combined map is θ ↦ ${par(a)} × ${par(b)} × ${par(c)} × θ = ${n(d)}θ, so its degree is ${n(d)}. It sends |${n(d)}| = ${n(Math.abs(d))} points to each point, so ${n(Math.abs(d))} points go to angle 0. A test loop with winding number k goes to one with winding number ${n(d)} × k = ${n(M)}, so k = ${n(M)} ÷ ${par(d)} = ${n(k)}.`,
  guidance: [
   { prompt: `What is the degree of the combined map: the product of the factors ${par(a)}, ${par(b)} and ${par(c)}?`, answer: [d], explanation: `Degrees multiply: ${par(a)} × ${par(b)} × ${par(c)} = ${n(d)}.` },
   { prompt: `A map of degree ${n(d)} sends how many points of the dial to angle 0?`, answer: [Math.abs(d)], explanation: `|${n(d)}| = ${n(Math.abs(d))}.` },
   { prompt: `The image of the test loop has winding number ${n(M)}, and a loop with winding number k goes to ${n(d)} × k. What is k?`, answer: [k], explanation: `${n(M)} ÷ ${par(d)} = ${n(k)}.` }
  ] }; }
});

mk({
 id: 'q37c', parent: 'q37', kind: 'applied', title: 'The dish mast drive',
 brief: 'The dish mast turns on a bearing through two gear stages, and two survey runs need the drive’s effect on loops worked out.',
 labels: ['degree', 'winding of the mast’s path', 'winding of the input path'], tolerance: 0.01,
 gl: [['degree'], ['winding of the mast’s path'], ['winding of the input path']]
}, {
 /* Stage factors p and q are 2 to 4 and each stage keeps (s = 1) or reverses (s = −1) the direction; the drive has degree
    s1 × p × s2 × q. The first run's input winding k1 and the second run's input winding k2 are not 0 and differ; the second
    run's output winding T = degree × k2 is printed. The two stages are not 3 (same direction) and 2 (opposite): that is the
    q37 worked example. */
 canonical: { p: 4, s1: 1, q: 2, s2: -1, k1: 3, T: 16 },
 draw: R => tries(() => { const p = { p: R.int(2, 4), s1: R.pick([1, -1]), q: R.int(2, 4), s2: R.pick([1, -1]), k1: R.nz(-4, 4) }; const k2 = R.nz(-4, 4); p.T = p.s1 * p.p * p.s2 * p.q * k2; p.k2 = k2; return p; },
  p => p.k2 !== p.k1 && !(p.p === 3 && p.s1 === 1 && p.q === 2 && p.s2 === -1), { p: 4, s1: 1, q: 2, s2: -1, k1: 3, T: 16 }),
 build: ({ p, s1, q, s2, k1, T }) => { const f1 = s1 * p, f2 = s2 * q, d = f1 * f2, out1 = d * k1, k2 = T / d; return {
  prompt: `The dish mast on the Orbit Ring turns on a circular bearing, and a two-stage drive sets its pointing angle from the angle θ of the input dial. Stage one turns its output ${n(p)} times as far as the angle it is given, ${dirText(s1)}; stage two turns its output ${n(q)} times as far as the angle it is given, ${dirText(s2)}. Taking “the opposite direction” as a negative factor, the whole drive is a map θ ↦ dθ of the circle. On the first run the input dial goes round ${turnsDir(k1)}. On a second run the mast must make exactly ${n(Math.abs(T))} full turns ${T > 0 ? 'anticlockwise' : 'clockwise'} round its bearing. Enter the degree d of the whole drive, then the winding number of the mast’s path on the first run (anticlockwise counts as positive), then the winding number of the input dial’s path on the second run.`,
  answer: [d, out1, k2],
  hints: ['A stage that turns its output a number of times as far has degree equal to that number, negative if it reverses the direction. Stages one after another multiply their degrees.', 'A loop with winding number k goes to a loop with winding number d × k. To find the loop that gives a known image, divide the image’s winding number by d. Anticlockwise turns count as positive and clockwise turns as negative.'],
  solution: `Stage one has factor ${n(f1)} and stage two has factor ${n(f2)}, so the drive is θ ↦ ${n(d)}θ with degree ${n(f1)} × ${par(f2)} = ${n(d)}. The first run’s input has winding number ${n(k1)}, so the mast’s path has ${n(d)} × ${par(k1)} = ${n(out1)}. The second run’s mast path has winding number ${n(T)}, so the input has ${n(T)} ÷ ${par(d)} = ${n(k2)}.`,
  guidance: [
   { prompt: `Stage one has factor ${n(f1)} and stage two has factor ${n(f2)}. What is the degree of the whole drive?`, answer: [d], explanation: `Degrees multiply: ${n(f1)} × ${par(f2)} = ${n(d)}.` },
   { prompt: `The drive has degree ${n(d)} and the input dial goes round ${turnsDir(k1)}, a winding number of ${n(k1)}. What is the winding number of the mast’s path?`, answer: [out1], explanation: `${n(d)} × ${par(k1)} = ${n(out1)}.` },
   { prompt: `The mast’s path must have winding number ${n(T)}. What winding number must the input dial’s path have?`, answer: [k2], explanation: `${n(T)} ÷ ${par(d)} = ${n(k2)}.` }
  ] }; }
});

mk({
 id: 'q37d', parent: 'q37', kind: 'challenge', uses: 'q36', title: 'The two-gear survey route',
 brief: 'A survey route made of two loops is fed through a pair of gears, and the log needs the route’s winding number before and after.',
 labels: ['winding of the route', 'degree', 'winding of the image'], tolerance: 0.01,
 gl: [['winding of the route'], ['degree'], ['winding of the image']]
}, {
 /* The route is a flown x times in a row, then b flown backwards y times in a row (x and y from 2 to 4): winding number
    x × wa − y × wb, never 0. The two gears have factors from ±2 to ±5; a pair (3, −2) is the q37 worked example. */
 canonical: { wa: 3, wb: -2, x: 2, y: 3, a: 5, b: -3 },
 draw: R => tries(() => ({ wa: R.nz(-4, 4), wb: R.nz(-4, 4), x: R.int(2, 4), y: R.int(2, 4), a: R.pick([-5, -4, -3, -2, 2, 3, 4, 5]), b: R.pick([-5, -4, -3, -2, 2, 3, 4, 5]) }),
  p => p.x * p.wa - p.y * p.wb !== 0 && !(p.a === 3 && p.b === -2), { wa: 3, wb: -2, x: 2, y: 3, a: 5, b: -3 }),
 build: ({ wa, wb, x, y, a, b }) => { const W = x * wa - y * wb, d = a * b, img = d * W; return {
  prompt: `Two survey loops a and b start at the same mark on the circular track of the docking drive. Loop a has winding number ${n(wa)} and loop b has winding number ${n(wb)}. The route is “a flown ${tm(x)} in a row, then b flown backwards ${tm(y)} in a row”. The drive applies f: ${mapText(a)} and then g: ${mapText(b)}, so the combined map takes θ to g(f(θ)). Enter the winding number of the route, then the degree of the combined map, then the winding number of the route’s image under the combined map.`,
  answer: [W, d, img],
  hints: ['Joining loops adds their winding numbers and flying a loop backwards changes the sign of its winding number. Add one winding number for each time a loop is flown.', 'The degrees of maps one after another multiply. A loop with winding number k goes to a loop with winding number d × k, where d is the degree.'],
  solution: `The route has winding number ${n(x)} × ${par(wa)} + ${n(y)} × ${par(-wb)} = ${n(W)}, because b backwards has winding number ${n(-wb)}. The combined map is θ ↦ ${par(b)} × ${par(a)}θ = ${n(d)}θ, so its degree is ${n(d)}. The image of the route has winding number ${n(d)} × ${par(W)} = ${n(img)}.`,
  guidance: [
   { prompt: `Loop a has winding number ${n(wa)} and is flown ${tm(x)}; loop b backwards has winding number ${n(-wb)} and is flown ${tm(y)}. What is the winding number of the route?`, answer: [W], explanation: `${n(x)} × ${par(wa)} + ${n(y)} × ${par(-wb)} = ${n(W)}.` },
   { prompt: `What is the degree of the combined map g(f(θ)), where f has factor ${n(a)} and g has factor ${n(b)}?`, answer: [d], explanation: `Degrees multiply: ${n(a)} × ${par(b)} = ${n(d)}.` },
   { prompt: `The route has winding number ${n(W)} and the combined map has degree ${n(d)}. What is the winding number of the image of the route?`, answer: [img], explanation: `${n(d)} × ${par(W)} = ${n(img)}.` }
  ] }; }
});

/* ---- q38 Independent loops in a graph [H 7.5] ---- */

/* Four frames. kind 0: a prism, two rings of x junctions joined by x cables; kind 1: a ladder, two rails of x junctions with x rungs;
   kind 2: a strip of x square cells in a row, each with one diagonal cable; kind 3: a ring of x junctions with two hubs, each joined
   to every junction on the ring. Returns the counts and the text. */
const frameVE = ({ kind, x }) => kind === 0 ? { V: 2 * x, E: 3 * x } : kind === 1 ? { V: 2 * x, E: 3 * x - 2 } : kind === 2 ? { V: 2 * x + 2, E: 4 * x + 1 } : { V: x + 2, E: 3 * x };
const frameText = ({ kind, x }) => kind === 0
 ? `a prism: two rings of ${n(x)} junctions each, every ring closed by ${n(x)} cables joining neighbouring junctions round it, and ${n(x)} straight cables each joining a junction of one ring to the matching junction of the other`
 : kind === 1 ? `a ladder: two rails of ${n(x)} junctions each, with a cable between each pair of neighbouring junctions along a rail (so no cable closes a rail into a ring), and ${n(x)} rungs, each a cable joining the matching junctions of the two rails`
 : kind === 2 ? `a strip of ${n(x)} square cells in a row, each cell edged by cable, with a junction at every corner of every cell and one extra cable across each cell from one corner to the opposite corner`
 : `a ring of ${n(x)} junctions, with a rim cable joining each neighbouring pair round the ring, and two hubs, each joined by a cable to every junction on the ring (the two hubs are not joined to each other)`;
const frameCount = ({ kind, x }) => { const { V, E } = frameVE({ kind, x }); return kind === 0
 ? [`The two rings have ${n(x)} junctions each, so V = 2 × ${n(x)} = ${n(V)}.`, `Each ring has ${n(x)} rim cables and ${n(x)} cables join the rings, so E = 2 × ${n(x)} + ${n(x)} = ${n(E)}.`]
 : kind === 1 ? [`Each rail has ${n(x)} junctions, so V = 2 × ${n(x)} = ${n(V)}.`, `Each rail has ${n(x - 1)} cables between neighbours and there are ${n(x)} rungs, so E = 2 × ${n(x - 1)} + ${n(x)} = ${n(E)}.`]
 : kind === 2 ? [`The cells share their corners in 2 rows of ${n(x + 1)}, so V = 2 × ${n(x + 1)} = ${n(V)}.`, `There are 2 × ${n(x)} cables along the top and bottom, ${n(x + 1)} vertical cables and ${n(x)} diagonals, so E = 2 × ${n(x)} + ${n(x + 1)} + ${n(x)} = ${n(E)}.`]
 : [`The ring has ${n(x)} junctions and there are 2 hubs, so V = ${n(x)} + 2 = ${n(V)}.`, `The ring has ${n(x)} rim cables and each hub has ${n(x)} cables to the ring, so E = ${n(x)} + 2 × ${n(x)} = ${n(E)}.`]; };
const FRAME_NAMES = ['cable frame', 'cable truss', 'cable net'];

mk({
 id: 'q38b', parent: 'q38', kind: 'setting', title: 'The hull truss count',
 brief: 'A hull truss is a frame of cables and junctions, and the inspector wants to know how many separate loops it can close.',
 labels: ['V', 'E', 'independent loops'], tolerance: 0.01,
 gl: [['V'], ['E'], ['independent loops']]
}, {
 /* nm is only an index into the three frame names. The sizes: a prism or a ladder 3 to 12, a strip of 2 to 9 cells, a ring with
    two hubs 3 to 10. The worked example of q38 is a wheel and the learn mission itself is a 3 by 2 grid; neither is drawn. */
 canonical: { nm: 0, kind: 3, x: 5 },
 draw: R => { const kind = R.int(0, 3); return { nm: R.int(0, 2), kind, x: kind === 0 || kind === 1 ? R.int(3, 12) : kind === 2 ? R.int(2, 9) : R.int(3, 10) }; },
 build: ({ nm, kind, x }) => { const { V, E } = frameVE({ kind, x }), L = E - V + 1, [cv, ce] = frameCount({ kind, x }); return {
  prompt: `A ${FRAME_NAMES[nm]} in the hull of the Orbit Ring is ${frameText({ kind, x })}. Treat it as a graph: junctions are vertices and the cables between them are edges. Enter the number of vertices V, then the number of edges E, then the number of independent loops.`,
  answer: [V, E, L],
  hints: ['Count the junctions part by part, then count each kind of cable once.', 'A spanning tree of a connected graph uses V − 1 edges and has no loop. Each further edge closes one new independent loop, so there are E − V + 1 of them.'],
  solution: `${cv} ${ce} The number of independent loops is E − V + 1 = ${n(E)} − ${n(V)} + 1 = ${n(L)}.`,
  guidance: [
   { prompt: 'How many vertices (junctions) does the frame have?', answer: [V], explanation: cv },
   { prompt: 'How many edges (cables between junctions) does it have?', answer: [E], explanation: ce },
   { prompt: `The frame is connected, with V = ${n(V)} and E = ${n(E)}. How many independent loops does it have?`, answer: [L], explanation: `E − V + 1 = ${n(E)} − ${n(V)} + 1 = ${n(L)}.` }
  ] }; }
});

mk({
 id: 'q38c', parent: 'q38', kind: 'applied', title: 'The pipe network upgrade',
 brief: 'The Fabric Bay pipe network is about to grow, and the crew needs its loops and pipes counted before and after.',
 labels: ['loops now', 'pipes after', 'loops after'], tolerance: 0.01,
 gl: [['loops now'], ['pipes after'], ['loops after']]
}, {
 /* A network of V junctions in one piece with V − 1 + L pipes (L from 2 to 7). The upgrade adds one
    junction on a single pipe and m extra pipes (2 to 5) between old junctions. V and E are printed, so E is a parameter. */
 canonical: { V: 10, E: 14, m: 3 },
 draw: R => { const V = R.int(6, 24), L = R.int(2, 7); return { V, E: V - 1 + L, m: R.int(2, 5) }; },
 build: ({ V, E, m }) => { const L = E - V + 1, E2 = E + 1 + m, V2 = V + 1, L2 = E2 - V2 + 1; return {
  prompt: `The pipe network of the Fabric Bay has ${n(V)} junctions, joined in one piece by ${n(E)} pipes. Enter the number of independent loops in the network. Then the crew adds one new junction, joined to an old junction by a single pipe, and ${n(m)} extra pipes, each joining two junctions that were already there; the network stays in one piece. Enter the total number of pipes after the work, then the number of independent loops after it.`,
  answer: [L, E2, L2],
  hints: ['For a graph in one piece, the number of independent loops is E − V + 1, where V is the number of junctions and E the number of pipes.', 'After the upgrade count every junction and every pipe again, then use the same rule. A new junction on a single pipe closes no loop.'],
  solution: `The network has ${n(E)} − ${n(V)} + 1 = ${n(L)} independent loops. The upgrade adds 1 junction and ${n(m)} + 1 pipes, so there are ${n(E)} + 1 + ${n(m)} = ${n(E2)} pipes and ${n(V)} + 1 = ${n(V2)} junctions. The loops are now ${n(E2)} − ${n(V2)} + 1 = ${n(L2)}.`,
  guidance: [
   { prompt: `The network has V = ${n(V)} junctions and E = ${n(E)} pipes. How many independent loops does it have?`, answer: [L], explanation: `E − V + 1 = ${n(E)} − ${n(V)} + 1 = ${n(L)}.` },
   { prompt: `The upgrade adds one pipe to the new junction and ${n(m)} extra pipes. How many pipes are there after it?`, answer: [E2], explanation: `${n(E)} + 1 + ${n(m)} = ${n(E2)}.` },
   { prompt: `After the upgrade there are ${n(V2)} junctions and ${n(E2)} pipes, still in one piece. How many independent loops are there?`, answer: [L2], explanation: `${n(E2)} − ${n(V2)} + 1 = ${n(L2)}.` }
  ] }; }
});

mk({
 id: 'q38d', parent: 'q38', kind: 'challenge', uses: 'q21', title: 'The two looms joined',
 brief: 'A wheel loom and a grid loom are being joined into one network, and the Euler characteristic and loop count of the whole must be logged.',
 labels: ['V', 'E', 'χ', 'independent loops'], tolerance: 0.01,
 gl: [['V'], ['E'], ['χ'], ['independent loops']]
}, {
 /* A wheel with s spokes (3 to 9) and a grid w cells wide and h tall (2 to 5 each), joined by j extra cables (1 to 3) that each
    join a wheel junction to a grid junction. The worked example of q38 (a wheel with 4 spokes alone) is not drawn. */
 canonical: { s: 6, w: 4, h: 3, j: 2 },
 draw: R => ({ s: R.int(3, 9), w: R.int(2, 5), h: R.int(2, 5), j: R.int(1, 3) }),
 build: ({ s, w, h, j }) => { const V1 = s + 1, E1 = 2 * s, V2 = (w + 1) * (h + 1), E2 = w * (h + 1) + h * (w + 1), V = V1 + V2, E = E1 + E2 + j, chi = V - E, L = E - V + 1; return {
  prompt: `Two looms on the Orbit Ring are joined into one network. The first is a wheel: a central hub joined by ${n(s)} straight spokes to ${n(s)} junctions on a rim, with each rim junction joined by a rim cable to the next one round the rim. The second is a rectangular grid of cable ${n(w)} cells wide and ${n(h)} cells tall, with a junction at every corner of every cell. Then ${n(j)} ${j === 1 ? 'connecting cable joins' : 'connecting cables each join'} a junction of the wheel to a junction of the grid, and there are no other junctions. Treat the network as a graph. Enter the number of vertices V, the number of edges E, the Euler characteristic χ = V − E of the graph, then the number of independent loops.`,
  answer: [V, E, chi, L],
  hints: ['Count the junctions and the cables of the wheel and of the grid separately, then add the connecting cables. A cable between the two looms is not counted twice.', 'The Euler characteristic of a graph is V − E. A connected graph has E − V + 1 = 1 − χ independent loops.'],
  solution: `The wheel has ${n(s)} + 1 = ${n(V1)} junctions and 2 × ${n(s)} = ${n(E1)} cables. The grid has ${n(h + 1)} rows of ${n(w + 1)} junctions, so ${n(V2)} junctions, and ${n(h + 1)} × ${n(w)} + ${n(w + 1)} × ${n(h)} = ${n(E2)} cables. So V = ${n(V1)} + ${n(V2)} = ${n(V)} and E = ${n(E1)} + ${n(E2)} + ${n(j)} = ${n(E)}. Then χ = V − E = ${n(chi)}, and the network is in one piece, so it has 1 − χ = ${n(L)} independent loops.`,
  guidance: [
   { prompt: `The wheel has ${n(s)} spokes and the grid is ${n(w)} cells wide and ${n(h)} tall. How many junctions does the whole network have?`, answer: [V], explanation: `The wheel has ${n(V1)} and the grid has ${n(h + 1)} × ${n(w + 1)} = ${n(V2)}, so V = ${n(V)}.` },
   { prompt: 'How many cables does the whole network have, counting the connecting cables?', answer: [E], explanation: `The wheel has ${n(E1)}, the grid has ${n(E2)} and the connecting cables add ${n(j)}, so E = ${n(E)}.` },
   { prompt: `What is χ = V − E for V = ${n(V)} and E = ${n(E)}?`, answer: [chi], explanation: `${n(V)} − ${n(E)} = ${n(chi)}.` },
   { prompt: `The network is in one piece and has χ = ${n(chi)}. How many independent loops does it have?`, answer: [L], explanation: `1 − χ = 1 − ${par(chi)} = ${n(L)}.` }
  ] }; }
});

/* ---- q39 Fixed points [L 8.5] ---- */

/* q39b: f(x) = (x³ + k) ÷ d on [0, L], with k from 1 up while g(L) stays negative (so g(0) > 0 > g(L) and, g being convex,
   there is exactly one fixed point). The fixed point is not within 0.1 of a hundredth tie and not within 0.02 of a whole number, and
   its rounded value differs from g(0), so the first and third answers are never alike. */
const Q39B = []; for (const [L, d] of [[1, 10], [2, 10], [2, 20], [3, 10], [3, 20], [3, 25], [4, 20], [4, 25], [5, 50], [6, 50]]) for (let k = 1; k < d * L - L * L * L && k <= 60; k++) {
 const x = halve(t => (t * t * t + k) / d - t, 0, L); if (!nearTie(x, 2) && !nearInt(x) && Math.abs(r2(x) - k / d) >= 0.01) Q39B.push({ L, d, k }); }
const q39bRoot = ({ L, d, k }) => halve(t => (t * t * t + k) / d - t, 0, L);
/* q39c: f(x) = (P − x³) ÷ d on [0, L] with d = 5 or 10, for L = 1, 2 or 3 and P from L³ to d × L, so f(0) ≤ L and f(L) ≥ 0. The start x0 is a
   whole number from 0 to L. Then x1 has at most one decimal and x2 at most four. The fixed point and x2 are kept off a hundredth tie,
   and the rounded x2 is at least 0.05 from x1 and from the fixed point, so the three answers are never alike. */
const Q39C = []; for (const d of [5, 10]) for (let L = 1; L <= 3; L++) for (let P = L * L * L; P <= d * L; P++) for (let x0 = 0; x0 <= L; x0++) {
 const x = halve(t => (P - t * t * t) / d - t, 0, L), x1 = (P - x0 * x0 * x0) / d, x2 = (P - x1 * x1 * x1) / d;
 if (!nearTie(x, 2) && !nearInt(x) && !nearTie(x2, 2) && Math.abs(r2(x2) - r2(x)) >= 0.05 && Math.abs(r2(x2) - x1) >= 0.05) Q39C.push({ L, P, x0, d }); }
/* q39d: f(x) = (x² + P) ÷ d on [lo, hi], d one of 8, 10, 20, 25 (so every value has at most 3 decimals), f(lo) > lo and f(hi) < hi,
   the fixed point irrational and off a thousandth tie. The function f(x) = (x² + 11) ÷ 10 is the q39 worked-example family and is left out. */
const Q39D = {}; for (const d of [8, 10, 20, 25]) { Q39D[d] = [];
 for (let lo = 1; lo <= 6; lo++) for (let hi = lo + 2; hi <= lo + 6; hi++) for (let P = 0; P <= d * hi; P++) {
  if (!(P > d * lo - lo * lo && P < d * hi - hi * hi)) continue;
  const disc = d * d - 4 * P; if (disc <= 0 || Number.isInteger(Math.sqrt(disc)) || (d === 10 && P === 11)) continue;
  const x = (d - Math.sqrt(disc)) / 2; if (x > lo && x < hi && !nearTie(x, 3)) Q39D[d].push({ lo, hi, P, d }); } }

mk({
 id: 'q39b', parent: 'q39', kind: 'setting', title: 'The coolant mixer ratio',
 brief: 'The coolant mixer resets its ratio after every batch, and the engineers want the one ratio it hands back unchanged.',
 labels: ['g(0)', 'g at the right end', 'fixed point'], tolerance: 0.005,
 gl: [['g(0)'], ['g at the right end'], ['whole number below'], ['fixed point']]
}, {
 canonical: { L: 2, d: 10, k: 5 },
 draw: R => R.pick(Q39B),
 build: ({ L, d, k }) => { const f = t => (t * t * t + k) / d, x = q39bRoot({ L, d, k }), g0 = Math.round(f(0) * 1000) / 1000, gL = Math.round((f(L) - L) * 1000) / 1000, m = Math.floor(x),
  gm = Math.round((f(m) - m) * 1000) / 1000, gm1 = Math.round((f(m + 1) - (m + 1)) * 1000) / 1000; return {
  prompt: `A coolant mixer on the Orbit Ring resets its mix ratio x (between 0 and ${n(L)}) to f(x) = (x³ + ${n(k)}) ÷ ${n(d)} after each batch. This f is continuous, takes [0, ${n(L)}] into itself and has exactly one fixed point there. A fixed point is an x with f(x) = x. Let g(x) = f(x) − x. Enter g(0), then g(${n(L)}), then the fixed point of f in [0, ${n(L)}] to 2 decimal places, found by halving the interval where g changes sign.`,
  answer: [g0, gL, r2(x)],
  hints: ['At the left end g = f(0) − 0 is at least 0, and at the right end g = f(right end) − right end is at most 0, because f stays inside the interval. By the intermediate value theorem g is 0 somewhere between.', 'Check whole numbers to find the unit interval where g changes sign, then halve it, keeping the half whose ends give g opposite signs, until both ends round to the same 2 decimal places.'],
  solution: `g(0) = f(0) = ${n(g0)} is positive and g(${n(L)}) = f(${n(L)}) − ${n(L)} = ${n(gL)} is negative, so g has a zero in between: a fixed point of f. Checking whole numbers, g(${n(m)}) = ${n(gm)} and g(${n(m + 1)}) = ${n(gm1)}, so it lies between ${n(m)} and ${n(m + 1)}. Halving that interval again and again gives x ≈ ${n(x)}, which rounds to ${n(r2(x))}.`,
  guidance: [
   { prompt: 'What is g(0) = f(0) − 0?', answer: [g0], explanation: `f(0) = ${n(g0)}, so g(0) = ${n(g0)}, which is positive.` },
   { prompt: `What is g(${n(L)}) = f(${n(L)}) − ${n(L)}?`, answer: [gL], explanation: `f(${n(L)}) = ${n(f(L))}, so g(${n(L)}) = ${n(gL)}, which is negative.` },
   { prompt: 'g changes sign between two whole numbers m and m + 1. What is m?', answer: [m], explanation: `g(${n(m)}) = ${n(gm)} and g(${n(m + 1)}) = ${n(gm1)} have opposite signs, so m = ${n(m)}.` },
   { prompt: `Keep halving from [${n(m)}, ${n(m + 1)}]. What is the fixed point to 2 decimal places?`, answer: [r2(x)], explanation: `The halvings close in on x ≈ ${n(x)}, which rounds to ${n(r2(x))}.` }
  ] }; }
});

mk({
 id: 'q39c', parent: 'q39', kind: 'applied', title: 'The regulator reset cycles',
 brief: 'A regulator on the ring resets its ratio every cycle, and the crew wants its first two settings and the ratio it would never leave.',
 labels: ['x1', 'x2', 'fixed point'], tolerance: 0.005,
 gl: [['x1'], ['x2'], ['fixed point']]
}, {
 /* x0 is the starting ratio, a whole number from 0 to L; nm is only an index into the three device names. */
 canonical: { L: 2, P: 13, x0: 0, d: 10, nm: 0 },
 draw: R => ({ ...R.pick(Q39C), nm: R.int(0, 2) }),
 build: ({ L, P, x0, d, nm }) => { const f = t => (P - t * t * t) / d, x1 = f(x0), x2 = f(x1), x = halve(t => f(t) - t, 0, L), g0 = Math.round(f(0) * 1000) / 1000, gL = Math.round((f(L) - L) * 1000) / 1000; return {
  prompt: `A ${['pressure regulator', 'flow governor', 'tension controller'][nm]} on the Orbit Ring resets its ratio x (between 0 and ${n(L)}) to f(x) = (${n(P)} − x³) ÷ ${n(d)} after each cycle. This f is continuous, takes [0, ${n(L)}] into itself and has exactly one fixed point, an x with f(x) = x, where the ratio would stay put. The ${['regulator', 'governor', 'controller'][nm]} is switched on with x = ${n(x0)}. After the first cycle its ratio is x1 = f(${n(x0)}), and after the second it is x2 = f(x1). Enter x1, then x2 to 2 decimal places, then the fixed point of f in [0, ${n(L)}] to 2 decimal places.`,
  answer: [x1, r2(x2), r2(x)],
  hints: ['To find x1, put the starting ratio into f: cube it, take the cube from the top number and divide by the number under the line. To find x2, put x1 into f in the same way, without rounding x1 first.', 'Let g(x) = f(x) − x. At the left end g is at least 0 and at the right end at most 0, because f stays inside the interval, so g changes sign. Check whole numbers, then halve the interval where g changes sign until both ends round to the same 2 decimal places.'],
  solution: `x1 = f(${n(x0)}) = (${n(P)} − ${n(x0 * x0 * x0)}) ÷ ${n(d)} = ${n(x1)}. Then x2 = f(${n(x1)}) = (${n(P)} − ${n(x1 * x1 * x1)}) ÷ ${n(d)} = ${n(x2)}, which rounds to ${n(r2(x2))}. For the fixed point, g(0) = ${n(g0)} is positive and g(${n(L)}) = ${n(gL)} is negative, so g changes sign in between. Halving the interval again and again gives x ≈ ${n(x)}, which rounds to ${n(r2(x))}.`,
  guidance: [
   { prompt: `What is x1 = f(${n(x0)}) = (${n(P)} − ${n(x0)}³) ÷ ${n(d)}?`, answer: [x1], explanation: `${n(x0)}³ = ${n(x0 * x0 * x0)}, so x1 = (${n(P)} − ${n(x0 * x0 * x0)}) ÷ ${n(d)} = ${n(x1)}.` },
   { prompt: `What is x2 = f(${n(x1)}) = (${n(P)} − ${n(x1)}³) ÷ ${n(d)}, to 2 decimal places?`, answer: [r2(x2)], explanation: `${n(x1)}³ = ${n(x1 * x1 * x1)}, so x2 = ${n(x2)}, which rounds to ${n(r2(x2))}.` },
   { prompt: `g(x) = f(x) − x is ${n(g0)} at 0 and ${n(gL)} at ${n(L)}, so it changes sign. Halving the interval, what is the fixed point to 2 decimal places?`, answer: [r2(x)], explanation: `The halvings close in on x ≈ ${n(x)}, which rounds to ${n(r2(x))}.` }
  ] }; }
});

mk({
 id: 'q39d', parent: 'q39', kind: 'challenge', uses: 'q16', title: 'The thermal buffer range',
 brief: 'A thermal buffer keeps its level inside a band, and the engineers need the range its resets can reach and the level that never moves.',
 labels: ['smallest value', 'largest value', 'fixed point'], tolerance: 0.0005,
 gl: [['smallest value'], ['largest value'], ['whole number below'], ['fixed point']]
}, {
 /* The level stays in [lo, hi] with lo from 1 to 6 and hi 2 to 6 above it. d is a divisor, one of 8, 10, 20 and 25. */
 canonical: { lo: 2, hi: 5, P: 18, d: 10 },
 draw: R => R.pick(Q39D[R.pick([8, 10, 20, 25])]),
 build: ({ lo, hi, P, d }) => { const f = t => (t * t + P) / d, disc = d * d - 4 * P, x = (d - Math.sqrt(disc)) / 2, m = Math.floor(x), fmin = Math.round(f(lo) * 1000) / 1000, fmax = Math.round(f(hi) * 1000) / 1000,
  gm = Math.round((f(m) - m) * 1000) / 1000, gm1 = Math.round((f(m + 1) - (m + 1)) * 1000) / 1000; return {
  prompt: `A thermal buffer on the Orbit Ring keeps its level x between ${n(lo)} and ${n(hi)}, and resets it to f(x) = (x² + ${n(P)}) ÷ ${n(d)} after each cycle. For positive x, f gets bigger as x gets bigger. This f is continuous, takes [${n(lo)}, ${n(hi)}] into itself and has exactly one fixed point there, an x with f(x) = x. Enter the smallest value f takes on [${n(lo)}, ${n(hi)}], then the largest value, then the fixed point of f in [${n(lo)}, ${n(hi)}] to 3 decimal places.`,
  answer: [fmin, fmax, r3(x)],
  hints: ['A continuous function on a closed interval reaches a smallest and a largest value. Here f is increasing, so the smallest value is at the left end of the interval and the largest at the right end.', 'For the fixed point let g(x) = f(x) − x, which is positive at the left end and negative at the right end. Check whole numbers to find the unit interval where g changes sign, then halve it until both ends round to the same 3 decimal places, or solve f(x) = x as a quadratic and keep the root in the interval.'],
  solution: `f is increasing on the interval, so the smallest value is f(${n(lo)}) = (${n(lo * lo)} + ${n(P)}) ÷ ${n(d)} = ${n(fmin)} and the largest is f(${n(hi)}) = (${n(hi * hi)} + ${n(P)}) ÷ ${n(d)} = ${n(fmax)}. For g(x) = f(x) − x, g(${n(m)}) = ${n(gm)} and g(${n(m + 1)}) = ${n(gm1)} have opposite signs, so the fixed point lies between ${n(m)} and ${n(m + 1)}. Halving that interval again and again, or solving x² − ${n(d)}x + ${n(P)} = 0 to get x = (${n(d)} − √${n(disc)}) ÷ 2, gives x ≈ ${n(x)}, which rounds to ${n(r3(x))}.`,
  guidance: [
   { prompt: `f is increasing, so its smallest value on the interval is at the left end. What is f(${n(lo)})?`, answer: [fmin], explanation: `(${n(lo * lo)} + ${n(P)}) ÷ ${n(d)} = ${n(fmin)}.` },
   { prompt: `What is f(${n(hi)}), the largest value?`, answer: [fmax], explanation: `(${n(hi * hi)} + ${n(P)}) ÷ ${n(d)} = ${n(fmax)}.` },
   { prompt: 'g(x) = f(x) − x changes sign between two whole numbers m and m + 1. What is m?', answer: [m], explanation: `g(${n(m)}) = ${n(gm)} and g(${n(m + 1)}) = ${n(gm1)} have opposite signs, so m = ${n(m)}.` },
   { prompt: `Keep halving from [${n(m)}, ${n(m + 1)}]. What is the fixed point to 3 decimal places?`, answer: [r3(x)], explanation: `The halvings close in on x ≈ ${n(x)}, which rounds to ${n(r3(x))}.` }
  ] }; }
});

/* ---- q40 Realm review and bridge to Complex analysis [W The fundamental group, H 7.5] ---- */

const ALL_WORDS = { 3: 'all three', 4: 'all four', 5: 'all five' };
/* The sensors from index i to index j (inclusive) as text: "B only", "B and C", "B, C and D", "all four". */
const encText = (names, i, j) => { const run = names.slice(i, j + 1); return run.length === 1 ? `${run[0]} only` : run.length === names.length ? ALL_WORDS[names.length] : andList(run); };
/* "twice anticlockwise round a circle enclosing B and C" */
const circuitText = (names, i, j, t) => `${tm(Math.abs(t))} ${t > 0 ? 'anticlockwise' : 'clockwise'} round a circle enclosing ${encText(names, i, j)}`;
/* Winding number of the joined circuits round sensor p: the circuits [i, j, t] that enclose it, added. */
const windAt = (cs, p) => cs.reduce((s, [i, j, t]) => s + (p >= i && p <= j ? t : 0), 0);
/* The working for one sensor, as in "2 + (−3) + 1 = 0". */
const partText = (cs, p) => { const terms = cs.filter(([i, j]) => p >= i && p <= j).map(c => c[2]); return terms.length ? sumText(terms) + (terms.length > 1 ? ` = ${n(windAt(cs, p))}` : '') : '0'; };

mk({
 id: 'q40b', parent: 'q40', kind: 'setting', title: 'The four mooring posts',
 brief: 'A tug is routed round four mooring posts on the ring, and the harbour log needs the winding number round each post.',
 labels: ['winding round W', 'winding round X', 'winding round Y', 'winding round Z'], tolerance: 0.01,
 gl: [['winding round W'], ['winding round X'], ['winding round Y'], ['winding round Z']]
}, {
 /* Four posts W, X, Y, Z in a row. Each circuit encloses a run of neighbouring posts, i to j counting W as 0, flown 1 to 3 times either way
    round. The circuits do not all enclose the same posts and the four winding numbers have at least three different values. */
 canonical: { i1: 0, j1: 1, t1: 3, i2: 1, j2: 3, t2: -2, i3: 2, j3: 2, t3: 1 },
 draw: R => tries(() => { const p = {}; for (const k of [1, 2, 3]) { const i = R.int(0, 3); p['i' + k] = i; p['j' + k] = R.int(i, 3); p['t' + k] = R.pick([-3, -2, -1, 1, 2, 3]); } return p; },
  p => { const cs = [[p.i1, p.j1, p.t1], [p.i2, p.j2, p.t2], [p.i3, p.j3, p.t3]]; return new Set([0, 1, 2, 3].map(q => windAt(cs, q))).size >= 3 && new Set(cs.map(c => c[0] + ',' + c[1])).size >= 2; },
  { i1: 0, j1: 1, t1: 3, i2: 1, j2: 3, t2: -2, i3: 2, j3: 2, t3: 1 }),
 build: ({ i1, j1, t1, i2, j2, t2, i3, j3, t3 }) => { const names = ['W', 'X', 'Y', 'Z'], cs = [[i1, j1, t1], [i2, j2, t2], [i3, j3, t3]], w = [0, 1, 2, 3].map(q => windAt(cs, q)); return {
  prompt: `Four mooring posts W, X, Y and Z stand in a row, in that order, along the Orbit Ring’s tow path. A tug’s route is one loop made by joining three circuits, all starting and ending at the same dock: first ${circuitText(names, i1, j1, t1)}, then ${circuitText(names, i2, j2, t2)}, then ${circuitText(names, i3, j3, t3)}. Each circle encloses exactly the posts named. Enter the winding number of the whole route round W, then round X, then round Y, then round Z.`,
  answer: w,
  hints: ['A circle flown once anticlockwise has winding number 1 round each point inside it and 0 round each point outside. Clockwise gives −1, and flying it several times multiplies by that number.', 'The route is the three circuits joined, so for each post add the winding numbers of the circuits that enclose it.'],
  solution: names.map((nm, q) => `Round ${nm}: ${partText(cs, q)}.`).join(' ') + ' In complex analysis each of these winding numbers becomes an integral round the loop.',
  guidance: names.map((nm, q) => ({ prompt: `Add the winding numbers of the circuits that enclose ${nm}. What is the winding number of the route round ${nm}?`, answer: [w[q]], explanation: `Round ${nm}: ${partText(cs, q)}.` }))
  }; }
});

mk({
 id: 'q40c', parent: 'q40', kind: 'applied', title: 'The dose meter patrol',
 brief: 'A patrol loop winds round three dose meters on the ring, and the health log needs the net change it leaves in their readings.',
 labels: ['winding round B', 'total of the three', 'total change in readings'], tolerance: 0.01,
 gl: [['winding round B'], ['total of the three'], ['total change']]
}, {
 /* Three meters A, B, C in a row (0, 1, 2); circuits as in q40b. c is the change in a reading for each net anticlockwise turn, 2 to 9.
    The total winding is never 0 and differs from the winding round B, so the three answers are never alike. */
 canonical: { i1: 0, j1: 2, t1: 1, i2: 0, j2: 1, t2: -2, i3: 2, j3: 2, t3: 3, c: 5 },
 draw: R => tries(() => { const p = { c: R.int(2, 9) }; for (const k of [1, 2, 3]) { const i = R.int(0, 2); p['i' + k] = i; p['j' + k] = R.int(i, 2); p['t' + k] = R.pick([-3, -2, -1, 1, 2, 3]); } return p; },
  p => { const cs = [[p.i1, p.j1, p.t1], [p.i2, p.j2, p.t2], [p.i3, p.j3, p.t3]], S = windAt(cs, 0) + windAt(cs, 1) + windAt(cs, 2); return S !== 0 && S !== windAt(cs, 1) && new Set(cs.map(c => c[0] + ',' + c[1])).size >= 2; },
  { i1: 0, j1: 2, t1: 1, i2: 0, j2: 1, t2: -2, i3: 2, j3: 2, t3: 3, c: 5 }),
 build: ({ i1, j1, t1, i2, j2, t2, i3, j3, t3, c }) => { const names = ['A', 'B', 'C'], cs = [[i1, j1, t1], [i2, j2, t2], [i3, j3, t3]], w = [0, 1, 2].map(q => windAt(cs, q)), S = w[0] + w[1] + w[2], dose = c * S; return {
  prompt: `Three dose meters A, B and C stand in a row, in that order, near the Orbit Ring. A patrol loop is made by joining three circuits, all starting and ending at the depot: first ${circuitText(names, i1, j1, t1)}, then ${circuitText(names, i2, j2, t2)}, then ${circuitText(names, i3, j3, t3)}. Each circle encloses exactly the meters named. A meter’s reading goes up by ${n(c)} units for each net anticlockwise turn of the whole loop round it, and down by ${n(c)} units for each net clockwise turn. Enter the winding number of the loop round B, then the total of the three winding numbers, then the total change in the readings of all three meters in units (negative if the readings fall overall).`,
  answer: [w[1], S, dose],
  hints: ['A circle flown once anticlockwise has winding number 1 round each point inside it and 0 round each point outside. Clockwise gives −1, and flying it several times multiplies by that number. For each meter add the winding numbers of the circuits that enclose it.', 'A meter’s reading changes by the same number of units for each net turn, so the total change is that number of units times the total of the three winding numbers.'],
  solution: `Round A: ${partText(cs, 0)}. Round B: ${partText(cs, 1)}. Round C: ${partText(cs, 2)}. The total of the three winding numbers is ${sumText(w)} = ${n(S)}. Each net turn changes a reading by ${n(c)} units, so the readings change by ${n(c)} × ${par(S)} = ${n(dose)} units in all.`,
  guidance: [
   { prompt: 'Add the winding numbers of the circuits that enclose B. What is the winding number of the loop round B?', answer: [w[1]], explanation: `Round B: ${partText(cs, 1)}.` },
   { prompt: `The winding numbers round A, B and C are ${n(w[0])}, ${n(w[1])} and ${n(w[2])}. What is their total?`, answer: [S], explanation: `${sumText(w)} = ${n(S)}.` },
   { prompt: `The three winding numbers total ${n(S)}, and each net turn changes a reading by ${n(c)} units. What is the total change in the readings?`, answer: [dose], explanation: `${n(c)} × ${par(S)} = ${n(dose)} units.` }
  ] }; }
});

mk({
 id: 'q40d', parent: 'q40', kind: 'challenge', uses: 'q36', title: 'The five-sensor survey',
 brief: 'A survey flies one loop twice and another backwards past five sensors, and the log needs how the windings add up.',
 labels: ['winding round C', 'sensors with winding 0', 'total of the five'], tolerance: 0.01,
 gl: [['winding round C'], ['sensors with winding 0'], ['total of the five']]
}, {
 /* Five sensors A to E in a row (0 to 4). Loop u goes tu times anticlockwise round a circle enclosing sensors i1 to j1 and loop v goes tv
    times anticlockwise round a circle enclosing i2 to j2 (1 to 3 times each). The survey is “u, then v backwards, then u”, so the winding
    round a sensor is 2 × (u's) − (v's). The two circles enclose different runs. */
 canonical: { i1: 1, j1: 3, tu: 2, i2: 2, j2: 4, tv: 1 },
 draw: R => tries(() => { const i1 = R.int(0, 4), i2 = R.int(0, 4); return { i1, j1: R.int(i1, 4), tu: R.int(1, 3), i2, j2: R.int(i2, 4), tv: R.int(1, 3) }; },
  p => p.i1 !== p.i2 || p.j1 !== p.j2, { i1: 1, j1: 3, tu: 2, i2: 2, j2: 4, tv: 1 }),
 build: ({ i1, j1, tu, i2, j2, tv }) => { const names = ['A', 'B', 'C', 'D', 'E'], wu = q => q >= i1 && q <= j1 ? tu : 0, wv = q => q >= i2 && q <= j2 ? tv : 0, w = [0, 1, 2, 3, 4].map(q => 2 * wu(q) - wv(q)), zeros = w.filter(x => x === 0).length, S = w.reduce((a, b) => a + b, 0); return {
  prompt: `Five sensors A, B, C, D and E stand in a row, in that order, near the Orbit Ring. Loop u goes ${circuitText(names, i1, j1, tu)}. Loop v goes ${circuitText(names, i2, j2, tv)}. Both start and end at the depot, and each circle encloses exactly the sensors named. The survey flies “u, then v backwards, then u”. Enter the winding number of the survey loop round C, then for how many of the five sensors its winding number is 0, then the total of the five winding numbers.`,
  answer: [w[2], zeros, S],
  hints: ['A circle flown once anticlockwise has winding number 1 round each point inside it and 0 round each point outside, so loop u has the same winding number round every sensor in its circle. Joining loops adds winding numbers and flying a loop backwards changes the sign.', 'For each sensor the survey has winding number 2 × (that of u) − (that of v). Work through the five sensors in turn, then count the zeros and add.'],
  solution: names.map((nm, q) => `Round ${nm}: 2 × ${n(wu(q))} − ${n(wv(q))} = ${n(w[q])}.`).join(' ') + ` ${zeros === 0 ? 'No sensor has winding number 0' : zeros === 1 ? 'One sensor has winding number 0' : `${n(zeros)} sensors have winding number 0`}, and the total is ${sumText(w)} = ${n(S)}.`,
  guidance: [
   { prompt: `Round C, loop u has winding number ${n(wu(2))} and loop v has winding number ${n(wv(2))}. What is the winding number of “u, then v backwards, then u” round C?`, answer: [w[2]], explanation: `2 × ${n(wu(2))} − ${n(wv(2))} = ${n(w[2])}.` },
   { prompt: `The winding numbers round A, B, C, D and E are ${w.map(n).join(', ')}. How many of them are 0?`, answer: [zeros], explanation: `${zeros === 0 ? 'None of them is 0' : zeros === 1 ? 'One of them is 0' : `${n(zeros)} of them are 0`}.` },
   { prompt: `What is the total of the five winding numbers ${w.map(n).join(', ')}?`, answer: [S], explanation: `${sumText(w)} = ${n(S)}.` }
  ] }; }
});

})();
