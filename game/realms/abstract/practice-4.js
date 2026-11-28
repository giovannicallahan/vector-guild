/* Abstract algebra: patterns of moves practice missions, file 4 of 8: concepts q16–q20, three practice missions each
   (q16b q16c q16d q17b q17c q17d q18b q18c q18d q19b q19c q19d q20b q20c q20d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/abstract/oracle-p4.js. */
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

/* Small helpers. Every draw loop is bounded (1000 tries, then the canonical parameters). */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mod = (a, m) => ((a % m) + m) % m;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = k => String(k).split('').map(d => SUB[+d]).join('');
const Z = m => 'Z' + sub(m);
const pl = (k, one, many) => `${n(k)} ${k === 1 ? one : (many || one + 's')}`;
const and = list => list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
const bounded = (R, canonical, make, ok) => { for (let i = 0; i < 1000; i++) { const p = make(R); if (ok(p)) return p; } return canonical; };
const divisors = m => { const out = []; for (let d = 1; d <= m; d++) if (m % d === 0) out.push(d); return out; };
const phi = m => { let c = 0; for (let j = 1; j <= m; j++) if (gcd(j, m) === 1) c++; return c; };
/* {0, d, 2d, …, m − d} written out in full when short. */
const multiples = (d, m) => { const k = m / d; if (k <= 5) return '{' + Array.from({ length: k }, (_, i) => n(i * d)).join(', ') + '}'; return `{0, ${n(d)}, ${n(2 * d)}, …, ${n(m - d)}}`; };
/* "a + r = s" with the remainder shown when s reaches m. */
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = k => String(k).split('').map(d => SUP[Number(d)]).join('');
const addMod = (a, r, m) => { const s = a + r; return s < m ? `${n(a)} + ${n(r)} = ${n(s)}` : s === m ? `${n(a)} + ${n(r)} = ${n(s)}, exactly one full turn` : `${n(a)} + ${n(r)} = ${n(s)} = ${n(m)} + ${n(s - m)}`; };
/* Turn and flip moves on marks 0 … m − 1: a turn by r sends p to p + r, the flip sends p to −p (mod m).
   A routine is a list of moves: ['F'] or ['T', r]. */
const run = (moves, m, v) => { const path = [v]; let x = v; for (const mv of moves) { x = mv[0] === 'F' ? mod(-x, m) : mod(x + mv[1], m); path.push(x); } return path; };
const stepText = r => `turn by ${pl(r, 'step')}`;
const wordsOf = moves => moves.map(mv => mv[0] === 'F' ? 'flip' : stepText(mv[1]));
const flipsOf = moves => moves.filter(mv => mv[0] === 'F').length;
const detText = moves => moves.map(mv => mv[0] === 'F' ? '(−1)' : '1').join(' × ');
const ROUTES = {
 FTF: (r, s) => [['F'], ['T', r], ['F']],
 FTFT: (r, s) => [['F'], ['T', r], ['F'], ['T', s]],
 TFT: (r, s) => [['T', r], ['F'], ['T', s]],
 FT: (r, s) => [['F'], ['T', r]],
 TF: (r, s) => [['T', r], ['F']]
};

/* ---- q16 Dihedral groups: turning and flipping a polygon [5.2] ---- */

mk({
 id: 'q16b', parent: 'q16', kind: 'setting', title: 'The service panel bolts',
 brief: 'A polygon service panel can be refitted in several ways, and the crew must know how many ways and where each bolt ends up.',
 labels: ['symmetries in the group', 'final mark'], tolerance: 0.01,
 gl: [['symmetries'], ['mark after the flip'], ['final mark']]
}, {
 /* |Dₘ| = 2m and the mark after the flip first, then a turn by r steps: (−v + r) mod m. The bolt never ends on its own mark
    (that would hide a skipped step). Not the worked example (m = 5, v = 1, r = 2) nor q16's numbers. */
 canonical: { m: 9, v: 2, r: 4 },
 draw: R => bounded(R, { m: 9, v: 2, r: 4 }, R => { const m = R.int(5, 12); return { m, v: R.int(1, m - 1), r: R.int(1, m - 1) }; },
  p => mod(p.r - p.v, p.m) !== p.v && !(p.m === 5 && p.v === 1 && p.r === 2) && !(p.m === 6 && p.v === 4 && p.r === 3)),
 build: ({ m, v, r }) => { const f = m - v, e = mod(f + r, m); return {
  prompt: `A service panel is a regular polygon with ${n(m)} bolts. Marks 0 to ${n(m - 1)} are engraved on the housing at the bolt positions, going anticlockwise, and they never move. A turn by r steps moves every bolt r marks anticlockwise, so the bolt at mark p goes to mark (p + r) mod ${n(m)}. The flip turns the panel over across the line through the centre and mark 0, so the bolt at mark p goes to mark (−p) mod ${n(m)}, which is ${n(m)} − p, while mark 0 stays put. Enter the number of ways the panel can be refitted onto its housing (all the turns, the turn by 0 included, and all the flips), then the mark where the bolt that starts at mark ${n(v)} ends up after the flip first and then a turn by ${pl(r, 'step')}.`,
  answer: [2 * m, e],
  hints: ['A regular polygon with n corners has n turns, counting the turn by 0, and n flips.', 'The order of the moves matters. Here the flip comes first: replace the mark p by n − p, then add r and take the remainder mod n.'],
  solution: `The panel has ${n(m)} turns and ${n(m)} flips, so it can be refitted in 2 × ${n(m)} = ${n(2 * m)} ways. The flip takes mark ${n(v)} to ${n(m)} − ${n(v)} = ${n(f)}. The turn then takes mark ${n(f)} to (${n(f)} + ${n(r)}) mod ${n(m)}: ${addMod(f, r, m)}, so the bolt ends at mark ${n(e)}.`,
  guidance: [
   { prompt: `How many symmetries does D${sub(m)} have, turns and flips together?`, answer: [2 * m], explanation: `${n(m)} turns (by 0, 1, …, ${n(m - 1)} steps) and ${n(m)} flips make ${n(2 * m)} symmetries.` },
   { prompt: `The flip comes first. Where does it send the bolt that starts at mark ${n(v)}?`, answer: [f], explanation: `The flip sends mark ${n(v)} to ${n(m)} − ${n(v)} = ${n(f)}.` },
   { prompt: `Now the turn by ${pl(r, 'step')}. At which mark does the bolt at mark ${n(f)} end up?`, answer: [e], explanation: `${addMod(f, r, m)}, so the bolt ends at mark ${n(e)}.` }
  ] }; }
});

mk({
 id: 'q16c', parent: 'q16', kind: 'applied', title: 'Inspecting every hatch position',
 brief: 'Before a hatch is signed off, the crew inspects it in every position it can be fitted in, then runs its closing routine.',
 labels: ['total minutes', 'final mark'], tolerance: 0.01,
 gl: [['total minutes'], ['mark after the turn and the flip'], ['final mark']]
}, {
 /* Total minutes = 2m × t. Routine: turn by r, flip, turn by s, so the mark is (−(v + r) + s) mod m. Never ends on its own mark. */
 canonical: { m: 8, v: 3, r: 6, s: 5, t: 4 },
 draw: R => bounded(R, { m: 8, v: 3, r: 6, s: 5, t: 4 }, R => { const m = R.int(6, 14); return { m, v: R.int(1, m - 1), r: R.int(1, m - 1), s: R.int(1, m - 1), t: R.int(2, 9) }; },
  p => mod(-(p.v + p.r) + p.s, p.m) !== p.v),
 build: ({ m, v, r, s, t }) => { const a = mod(v + r, m), b = mod(-a, m), e = mod(b + s, m), mins = 2 * m * t; return {
  prompt: `A hatch is a regular polygon with ${n(m)} corners, and marks 0 to ${n(m - 1)} are painted anticlockwise on the frame at the corner positions. A turn by r steps sends the corner at mark p to mark (p + r) mod ${n(m)}; the flip across the line through the centre and mark 0 sends it to mark (−p) mod ${n(m)}. For sign-off the crew inspects the hatch once in every position it can be fitted in (every turn, the turn by 0 included, and every flip), ${pl(t, 'minute')} for each position. Then the hatch runs its closing routine: a turn by ${pl(r, 'step')}, then the flip, then a turn by ${pl(s, 'step')}. Enter the total inspection time in minutes, then the mark where the corner that starts at mark ${n(v)} ends up after the closing routine.`,
  answer: [mins, e],
  hints: ['The positions of a regular polygon with n corners are the n turns (the turn by 0 included) and the n flips, so the group Dₙ has 2n elements. Multiply by the minutes for each position.', 'Follow the one corner through the moves in the order they are done: add r for a turn, replace p by n − p for the flip, and take the remainder mod n each time.'],
  solution: `The hatch has ${n(m)} turns and ${n(m)} flips, so ${n(2 * m)} positions, at ${n(t)} minutes each: ${n(2 * m)} × ${n(t)} = ${n(mins)} minutes. The corner then goes ${n(v)} → ${n(a)} (turn by ${n(r)}) → ${n(b)} (flip) → ${n(e)} (turn by ${n(s)}), so it ends at mark ${n(e)}.`,
  guidance: [
   { prompt: `The hatch has ${n(m)} turns and ${n(m)} flips, which is ${n(2 * m)} positions. At ${pl(t, 'minute')} each, how many minutes does the whole inspection take?`, answer: [mins], explanation: `${n(2 * m)} × ${n(t)} = ${n(mins)} minutes.` },
   { prompt: `Now the routine. After the turn by ${pl(r, 'step')} and then the flip, at which mark is the corner that started at mark ${n(v)}?`, answer: [b], explanation: `The turn takes mark ${n(v)} to ${n(a)}${v + r >= m ? ` (${addMod(v, r, m)})` : ''}, and the flip takes ${n(a)} to ${a === 0 ? '0' : `${n(m)} − ${n(a)} = ${n(b)}`}.` },
   { prompt: `Last, the turn by ${pl(s, 'step')}. At which mark does the corner at mark ${n(b)} end up?`, answer: [e], explanation: `${addMod(b, s, m)}, so the corner ends at mark ${n(e)}.` }
  ] }; }
});

mk({
 id: 'q16d', parent: 'q16', kind: 'challenge', uses: 'q07', title: 'The long turn-and-flip routine',
 brief: 'A big hatch runs a routine of two turns and two flips, and the crew needs how long a turn takes to come round as well as where a corner lands.',
 labels: ['symmetries in the group', 'final mark', 'order of the turn'], tolerance: 0.01,
 gl: [['symmetries'], ['mark after the first turn and flip'], ['final mark'], ['order of the turn']]
}, {
 /* |Dₘ| = 2m; the routine turn r, flip, turn s, flip sends p to p + r − s (mod m), and the order of the turn by r is m ÷ gcd(r, m)
    (q07). r ≠ s so the corner moves, gcd(r, m) > 1 so the order is not just m. */
 canonical: { m: 24, v: 7, r: 9, s: 20 },
 draw: R => bounded(R, { m: 24, v: 7, r: 9, s: 20 }, R => { const m = R.int(12, 30); return { m, v: R.int(1, m - 1), r: R.int(2, m - 1), s: R.int(1, m - 1) }; },
  p => p.r !== p.s && gcd(p.r, p.m) > 1),
 build: ({ m, v, r, s }) => { const path = run([['T', r], ['F'], ['T', s], ['F']], m, v), g = gcd(r, m), ord = m / g, e = path[4]; return {
  prompt: `A large hatch is a regular polygon with ${n(m)} corners, and marks 0 to ${n(m - 1)} are painted anticlockwise on the frame at the corner positions. A turn by r steps sends the corner at mark p to mark (p + r) mod ${n(m)}; the flip across the line through the centre and mark 0 sends it to mark (−p) mod ${n(m)}. A turn by r steps works like adding r in ${Z(m)}, so its order is the order of r in ${Z(m)}, which is ${n(m)} ÷ gcd(r, ${n(m)}), gcd being the greatest common divisor. The hatch runs this routine: turn by ${pl(r, 'step')}, flip, turn by ${pl(s, 'step')}, flip. Enter the number of symmetries in the dihedral group D${sub(m)}, then the mark where the corner that starts at mark ${n(v)} ends up after the routine, then the order of the turn by ${pl(r, 'step')}: the smallest number of times it must be repeated to bring every corner back to its own mark.`,
  answer: [2 * m, e, ord],
  hints: ['A regular polygon with n corners has n turns, the turn by 0 included, and n flips.', 'Follow the one corner through the four moves in order, taking the remainder mod n after each. The turn by r behaves like the element r of Zₙ, so its order is n ÷ gcd(r, n).'],
  solution: `D${sub(m)} has ${n(m)} turns and ${n(m)} flips, so ${n(2 * m)} symmetries. The corner goes ${path.map(n).join(' → ')}, so it ends at mark ${n(e)}. The turn by ${n(r)} steps is adding ${n(r)} in ${Z(m)}, so its order is ${n(m)} ÷ gcd(${n(r)}, ${n(m)}) = ${n(m)} ÷ ${n(g)} = ${n(ord)}.`,
  guidance: [
   { prompt: `How many symmetries does D${sub(m)} have, turns and flips together?`, answer: [2 * m], explanation: `${n(m)} turns and ${n(m)} flips make ${n(2 * m)} symmetries.` },
   { prompt: `After the turn by ${pl(r, 'step')} and the first flip, at which mark is the corner that started at mark ${n(v)}?`, answer: [path[2]], explanation: `The turn takes ${n(v)} to ${n(path[1])}, and the flip takes ${n(path[1])} to ${path[1] === 0 ? '0' : `${n(m)} − ${n(path[1])} = ${n(path[2])}`}.` },
   { prompt: `Now the turn by ${pl(s, 'step')} and the second flip. At which mark does the corner end up?`, answer: [e], explanation: `The turn takes ${n(path[2])} to ${n(path[3])}, and the flip takes ${n(path[3])} to ${path[3] === 0 ? '0' : `${n(m)} − ${n(path[3])} = ${n(e)}`}.` },
   { prompt: `The turn by ${pl(r, 'step')} is the element ${n(r)} of ${Z(m)}. What is its order, ${n(m)} ÷ gcd(${n(r)}, ${n(m)})?`, answer: [ord], explanation: `gcd(${n(r)}, ${n(m)}) = ${n(g)}, so the order is ${n(m)} ÷ ${n(g)} = ${n(ord)}.` }
  ] }; }
});

/* ---- q17 Chapter review: symmetry moves mixed [5.2, 5.1] ---- */

mk({
 id: 'q17b', parent: 'q17', kind: 'setting', title: 'The airlock panel cycle',
 brief: 'An airlock door of hinged panels runs a fixed cycle of turns and flips, and the crew must know where a panel lands and how often to repeat the cycle.',
 labels: ['final mark', 'determinant', 'order'], tolerance: 0.01,
 gl: [['final mark'], ['determinant'], ['order']]
}, {
 /* Same skill as q17 on another routine shape: a turn, a flip and a turn (determinant −1, order 2 in the canonical draw).
    Any of the four routine shapes can be drawn. A turn routine must move the marks (shift ≠ 0) and the corner must move.
    Not the worked example (m = 6, FTF, r = 2, v = 1). */
 canonical: { m: 9, type: 'TFT', r: 2, s: 7, v: 4 },
 draw: R => bounded(R, { m: 9, type: 'TFT', r: 2, s: 7, v: 4 }, R => { const m = R.int(5, 12), type = R.pick(['FTF', 'FTFT', 'TFT', 'FT', 'TFT']), r = R.int(1, m - 1);
  return { m, type, r, s: type === 'FTFT' || type === 'TFT' ? R.except(1, m - 1, [r]) : 0, v: R.int(1, m - 1) }; },
  p => { const mv = ROUTES[p.type](p.r, p.s), path = run(mv, p.m, p.v), d = flipsOf(mv) % 2 ? -1 : 1;
   return !(p.m === 6 && p.type === 'FTF' && p.r === 2 && p.v === 1) && path[path.length - 1] !== p.v && (d === -1 || run(mv, p.m, 0)[mv.length] !== 0); }),
 build: ({ m, type, r, s, v }) => { const mv = ROUTES[type](r, s), path = run(mv, m, v), e = path[path.length - 1], det = flipsOf(mv) % 2 ? -1 : 1,
  t = run(mv, m, 0)[mv.length], ord = det === -1 ? 2 : m / gcd(t, m); return {
  prompt: `An airlock door has ${n(m)} hinged panels around a regular ring, and marks 0 to ${n(m - 1)} are engraved anticlockwise on the housing at the panel positions. A turn by r steps sends the panel at mark p to mark (p + r) mod ${n(m)}; the flip across the line through the centre and mark 0 sends it to mark (−p) mod ${n(m)}. The door cycle does these moves in order: ${wordsOf(mv).join(', then ')}. Enter the mark where the panel that starts at mark ${n(v)} ends up, then the determinant of the 2 × 2 matrix of the whole cycle (1 or −1), then the order of the cycle: the smallest number of times it must be repeated to bring every panel back to its own mark.`,
  answer: [e, det, ord],
  hints: ['Follow the one panel through the moves in order, taking the remainder mod n after each one.', 'A turn’s matrix has determinant 1 and a flip’s has −1, and determinants multiply. A cycle with determinant −1 is a flip, of order 2; one with determinant 1 is a turn by some number of steps t, of order n ÷ gcd(t, n).'],
  solution: `The panel goes ${path.map(n).join(' → ')}, so it ends at mark ${n(e)}. The determinant is ${detText(mv)} = ${n(det)}. ${det === -1 ? 'So the cycle is a flip: doing it twice puts every panel back, and doing it once does not, so its order is 2.' : `So the cycle is a turn. It sends mark 0 to mark ${n(t)}, so it is a turn by ${pl(t, 'step')}, and its order is ${n(m)} ÷ gcd(${n(t)}, ${n(m)}) = ${n(m)} ÷ ${n(gcd(t, m))} = ${n(ord)}.`}`,
  guidance: [
   { prompt: `Follow the panel that starts at mark ${n(v)} through the moves. At which mark does it end?`, answer: [e], explanation: `Move by move: ${path.map(n).join(' → ')}.` },
   { prompt: `The cycle has ${pl(flipsOf(mv), 'flip')}. Each flip has determinant −1, each turn 1, and determinants multiply. What is the determinant of the cycle?`, answer: [det], explanation: `${detText(mv)} = ${n(det)}.` },
   det === -1
    ? { prompt: 'A cycle with determinant −1 is a flip. What is its order?', answer: [2], explanation: 'A flip done twice puts every panel back on its own mark, and done once it does not, so its order is 2.' }
    : { prompt: `A cycle with determinant 1 is a turn; this one is a turn by ${pl(t, 'step')}. What is its order, ${n(m)} ÷ gcd(${n(t)}, ${n(m)})?`, answer: [ord], explanation: `gcd(${n(t)}, ${n(m)}) = ${n(gcd(t, m))}, so the order is ${n(m)} ÷ ${n(gcd(t, m))} = ${n(ord)}.` }
  ] }; }
});

mk({
 id: 'q17c', parent: 'q17', kind: 'applied', title: 'Shift after shift on the lift hatch',
 brief: 'The lift hatch runs one turn-and-flip routine at the start of every shift, and the crew wants to know how it sits after several shifts.',
 labels: ['determinant after the shifts', 'final mark'], tolerance: 0.01,
 gl: [['determinant'], ['mark after one run'], ['final mark']]
}, {
 /* One run is a turn and a flip (either order), so it is a flip (determinant −1, order 2). After k runs the determinant is (−1)^k and the
    corner is back at v when k is even and at the one-run mark when k is odd. The corner is moved by one run. */
 canonical: { m: 11, type: 'TF', r: 4, v: 3, k: 5 },
 draw: R => bounded(R, { m: 11, type: 'TF', r: 4, v: 3, k: 5 }, R => { const m = R.int(6, 14); return { m, type: R.pick(['TF', 'FT']), r: R.int(1, m - 1), v: R.int(1, m - 1), k: R.int(3, 9) }; },
  p => run(ROUTES[p.type](p.r, 0), p.m, p.v)[2] !== p.v),
 build: ({ m, type, r, v, k }) => { const mv = ROUTES[type](r, 0), one = run(mv, m, v)[2], det = k % 2 ? -1 : 1, e = k % 2 ? one : v, rt = wordsOf(mv).join(', then '); return {
  prompt: `The lift hatch is a regular polygon with ${n(m)} corners, and marks 0 to ${n(m - 1)} are painted anticlockwise on the frame at the corner positions. A turn by r steps sends the corner at mark p to mark (p + r) mod ${n(m)}; the flip across the line through the centre and mark 0 sends it to mark (−p) mod ${n(m)}. At the start of every shift the crew runs the same routine, once: ${rt}. After ${n(k)} shifts the routine has been run ${n(k)} times in a row. Enter the determinant of the 2 × 2 matrix of all ${n(k)} runs together (1 or −1), then the mark where the corner that began at mark ${n(v)} is after the ${n(k)} runs.`,
  answer: [det, e],
  hints: ['Each run has one flip, so its matrix has determinant −1, and determinants multiply: the determinant of several runs is the product of the determinants of the runs.', 'A routine with determinant −1 is a flip, and a flip done twice puts every corner back on its own mark. So find where one run sends the corner, and decide from the number of runs which of the two marks the corner is at.'],
  solution: `One run has one flip, so its determinant is −1, and ${n(k)} runs have determinant (−1)${sup(k)} = ${n(det)}. One run takes the corner ${run(mv, m, v).map(n).join(' → ')}, so it moves from mark ${n(v)} to mark ${n(one)}. A run is a flip, so two runs bring every corner back. ${n(k)} runs is ${k % 2 ? `${n((k - 1) / 2)} pairs of runs and one run over, so the corner is at mark ${n(one)}` : `${n(k / 2)} pairs of runs, so the corner is back at mark ${n(v)}`}.`,
  guidance: [
   { prompt: `One run has one flip, determinant −1, and determinants multiply. What is the determinant of all ${n(k)} runs together?`, answer: [det], explanation: `(−1)${sup(k)} = ${n(det)}: ${k % 2 ? 'an odd number of' : 'an even number of'} factors of −1.` },
   { prompt: `Where does one run of the routine send the corner that starts at mark ${n(v)}?`, answer: [one], explanation: `Move by move: ${run(mv, m, v).map(n).join(' → ')}.` },
   { prompt: `Two runs of this routine put every corner back on its own mark. Where is the corner after ${n(k)} runs?`, answer: [e], explanation: k % 2 ? `${n(k)} runs is ${n((k - 1) / 2)} pairs, which change nothing, plus one run, so the corner is at mark ${n(one)}.` : `${n(k)} runs is ${n(k / 2)} pairs, which change nothing, so the corner is back at mark ${n(v)}.` }
  ] }; }
});

mk({
 id: 'q17d', parent: 'q17', kind: 'challenge', uses: 'q14', title: 'The routine as a rearrangement',
 brief: 'The crew wants to record a hatch routine as a rearrangement of its marks and count the swaps it is worth, so the controller can log it.',
 labels: ['order', 'transpositions needed', 'sign'], tolerance: 0.01,
 gl: [['turn in steps'], ['order'], ['transpositions needed'], ['sign']]
}, {
 /* The routine (flip, turn, flip or flip, turn, flip, turn) is a turn by t steps, t ≠ 0. As a permutation of the m marks it has
    g = gcd(t, m) cycles of length m ÷ g: order m ÷ g, m − g transpositions, sign (−1)^(m − g). Not the numbers of q17. */
 canonical: { m: 12, type: 'FTFT', r: 5, s: 8 },
 draw: R => bounded(R, { m: 12, type: 'FTFT', r: 5, s: 8 }, R => { const m = R.int(8, 18), type = R.pick(['FTF', 'FTFT']), r = R.int(1, m - 1);
  return { m, type, r, s: type === 'FTFT' ? R.except(1, m - 1, [r]) : 0 }; },
  p => { const t = run(ROUTES[p.type](p.r, p.s), p.m, 0)[ROUTES[p.type](p.r, p.s).length]; return t !== 0 && !(p.m === 10 && p.type === 'FTF' && p.r === 4); }),
 build: ({ m, type, r, s }) => { const mv = ROUTES[type](r, s), t = run(mv, m, 0)[mv.length], g = gcd(t, m), ord = m / g, tr = m - g, sg = tr % 2 ? -1 : 1; return {
  prompt: `A hatch is a regular polygon with ${n(m)} corners, and marks 0 to ${n(m - 1)} are painted anticlockwise on the frame at the corner positions. A turn by r steps sends the corner at mark p to mark (p + r) mod ${n(m)}; the flip across the line through the centre and mark 0 sends it to mark (−p) mod ${n(m)}. A locking routine does these moves in order: ${wordsOf(mv).join(', then ')}. Its determinant is 1, so the routine is itself a turn by some number of steps t. Write the routine as a permutation of the ${n(m)} marks, where each mark goes to the mark the routine sends it to. A turn by t steps splits the marks into gcd(t, ${n(m)}) cycles, all of the same length. Enter the order of the routine, then the fewest transpositions that build this permutation (the number of marks minus the number of cycles), then its sign as a permutation: 1 if it is even, −1 if it is odd. (The sign of a permutation is not the same thing as the determinant of the matrix.)`,
  answer: [ord, tr, sg],
  hints: ['Find the turn first: follow mark 0 through the moves, and the mark where it ends is the number of steps t of the whole routine.', 'The number of cycles is gcd(t, n) and each cycle has n ÷ gcd(t, n) marks, which is the order of the routine. The transpositions needed are n minus the number of cycles, and the sign is 1 when that number is even and −1 when it is odd.'],
  solution: `Following mark 0: ${run(mv, m, 0).map(n).join(' → ')}, so the routine is a turn by ${pl(t, 'step')}. The permutation has gcd(${n(t)}, ${n(m)}) = ${n(g)} ${g === 1 ? 'cycle' : 'cycles'}, each with ${n(m)} ÷ ${n(g)} = ${n(ord)} marks, so its order is ${n(ord)}. It needs ${n(m)} − ${n(g)} = ${n(tr)} transpositions. That number is ${tr % 2 ? 'odd' : 'even'}, so the sign is ${n(sg)}.`,
  guidance: [
   { prompt: `Follow mark 0 through the moves of the routine. At which mark does it end? (That is the number of steps t of the whole turn.)`, answer: [t], explanation: `Move by move: ${run(mv, m, 0).map(n).join(' → ')}, so the routine is a turn by ${pl(t, 'step')}.` },
   { prompt: `The turn by ${pl(t, 'step')} splits the marks into gcd(${n(t)}, ${n(m)}) cycles of the same length. What is the order of the routine, which is the length of one cycle, ${n(m)} ÷ gcd(${n(t)}, ${n(m)})?`, answer: [ord], explanation: `gcd(${n(t)}, ${n(m)}) = ${n(g)}, so there are ${n(g)} ${g === 1 ? 'cycle' : 'cycles'} of ${n(ord)} marks, and the order is ${n(ord)}.` },
   { prompt: `How many transpositions are needed: the number of marks, ${n(m)}, minus the number of cycles?`, answer: [tr], explanation: `${n(m)} − ${n(g)} = ${n(tr)}.` },
   { prompt: `A permutation built from ${n(tr)} transpositions is even if that number is even and odd if it is odd. What is its sign, 1 or −1?`, answer: [sg], explanation: `${n(tr)} is ${tr % 2 ? 'odd' : 'even'}, so the permutation is ${tr % 2 ? 'odd' : 'even'} and its sign is ${n(sg)}.` }
  ] }; }
});

/* ---- q18 Subgroups of a cyclic group [3.3, 4.1] ---- */

mk({
 id: 'q18b', parent: 'q18', kind: 'setting', title: 'The carousel arm',
 brief: 'A carousel store has a loading arm that steps round a ring of bays, and the crew wants to know how many bay sets are possible and how many one arm reaches.',
 labels: ['number of subgroups', 'bays visited'], tolerance: 0.01,
 gl: [['divisors'], ['gcd'], ['bays visited']]
}, {
 /* Number of subgroups of Zₘ (the divisors of m) and |⟨a⟩| = m ÷ gcd(a, m). m has at least 4 divisors and gcd(a, m) > 1.
    Not the worked example (m = 20, a = 8) nor q18's numbers (36, 15). */
 canonical: { m: 30, a: 12 },
 draw: R => bounded(R, { m: 30, a: 12 }, R => { const m = R.int(12, 60); return { m, a: R.int(2, m - 1) }; },
  p => divisors(p.m).length >= 4 && gcd(p.a, p.m) > 1 && !(p.m === 20 && p.a === 8) && !(p.m === 36 && p.a === 15)),
 build: ({ m, a }) => { const ds = divisors(m), g = gcd(a, m), size = m / g; return {
  prompt: `A carousel store has ${n(m)} bays in a ring, numbered 0 to ${n(m - 1)}. A loading arm starts at bay 0, and one press of its button moves it on by a fixed number of bays, wrapping round past bay ${n(m - 1)} back to 0, so moving on by k bays is adding k mod ${n(m)} and the moves form the group ${Z(m)}. A subgroup is a set of these moves that is a group by itself under the same addition. Enter the number of subgroups of ${Z(m)}, then the number of different bays the arm visits if each press moves it on by ${n(a)} bays and it presses again and again (bay 0 included).`,
  answer: [ds.length, size],
  hints: ['Zₙ has exactly one subgroup for each divisor d of n, the one with d elements, so count the divisors of n, 1 and n included.', 'Pressing again and again lands on the multiples of gcd(a, n), so the arm visits n ÷ gcd(a, n) bays.'],
  solution: `The divisors of ${n(m)} are ${and(ds.map(n))}, so ${Z(m)} has ${n(ds.length)} subgroups, one of each of those sizes. The arm visits the bays of ⟨${n(a)}⟩. gcd(${n(a)}, ${n(m)}) = ${n(g)}, so it lands on ${multiples(g, m)}, which is ${n(m)} ÷ ${n(g)} = ${n(size)} bays.`,
  guidance: [
   { prompt: `List the divisors of ${n(m)}, 1 and ${n(m)} included. How many are there?`, answer: [ds.length], explanation: `${and(ds.map(n))}: ${n(ds.length)} divisors, so ${n(ds.length)} subgroups.` },
   { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${n(g)} is the largest number that divides both ${n(a)} and ${n(m)}.` },
   { prompt: `How many bays does the arm visit, ${n(m)} ÷ gcd(${n(a)}, ${n(m)})?`, answer: [size], explanation: `${n(m)} ÷ ${n(g)} = ${n(size)} bays: ${multiples(g, m)}.` }
  ] }; }
});

mk({
 id: 'q18c', parent: 'q18', kind: 'applied', title: 'Two arms, one rail',
 brief: 'Two loading arms step round the same rail of bays, and Mira wants to know how many bays each can reach and whether they serve the same bays.',
 labels: ['bays reached by arm A', 'bays reached by arm B', 'same set (1 or 0)'], tolerance: 0.01,
 gl: [['bays reached by arm A'], ['bays reached by arm B'], ['same set (1 or 0)']]
}, {
 /* |⟨a⟩| = m ÷ gcd(a, m) and |⟨b⟩|. Zₘ has exactly one subgroup of each size, so ⟨a⟩ = ⟨b⟩ exactly when the sizes agree. The two
    are the same set in about half the draws; a ≠ b and neither is 0. */
 canonical: { m: 42, a: 9, b: 15 },
 draw: R => bounded(R, { m: 42, a: 9, b: 15 }, R => { const m = R.pick([24, 30, 36, 40, 42, 45, 48, 54, 56, 60]), a = R.int(2, m - 1); let b;
  if (R.bool()) { const g = gcd(a, m), opts = []; for (let k = 1; k < m; k++) if (k !== a && gcd(k, m) === g) opts.push(k); b = opts.length ? R.pick(opts) : R.int(2, m - 1); } else b = R.int(2, m - 1);
  return { m, a, b }; }, p => p.a !== p.b && gcd(p.a, p.m) > 1 && gcd(p.b, p.m) > 1),
 build: ({ m, a, b }) => { const ga = gcd(a, m), gb = gcd(b, m), sa = m / ga, sb = m / gb, same = sa === sb ? 1 : 0; return {
  prompt: `A rail has ${n(m)} bays numbered 0 to ${n(m - 1)}, wrapping round so that moving on by k bays is adding k mod ${n(m)}. Arm A starts at bay 0 and each press moves it on by ${n(a)} bays. Arm B also starts at bay 0, and each press moves it on by ${n(b)} bays. Each arm presses again and again, and the bays it lands on (bay 0 included) form a subgroup of ${Z(m)}. Enter the number of different bays arm A reaches, then the number arm B reaches, then 1 if the two arms reach exactly the same set of bays, or 0 if they do not.`,
  answer: [sa, sb, same],
  hints: ['An arm that moves on by k bays reaches the multiples of gcd(k, n) and so n ÷ gcd(k, n) bays.', 'Zₙ has exactly one subgroup of each size. So two arms reach exactly the same bays when they reach the same number of bays, and different bays when the numbers differ.'],
  solution: `For arm A, gcd(${n(a)}, ${n(m)}) = ${n(ga)}, so it reaches ${n(m)} ÷ ${n(ga)} = ${n(sa)} bays. For arm B, gcd(${n(b)}, ${n(m)}) = ${n(gb)}, so it reaches ${n(m)} ÷ ${n(gb)} = ${n(sb)} bays. ${Z(m)} has exactly one subgroup of each size, so ${same ? `both sets are the one subgroup of size ${n(sa)}: the arms reach the same bays, ${multiples(ga, m)}.` : `a set of ${n(sa)} bays and a set of ${n(sb)} bays cannot be the same: the arms reach different bays.`}`,
  guidance: [
   { prompt: `How many bays does arm A reach, ${n(m)} ÷ gcd(${n(a)}, ${n(m)})?`, answer: [sa], explanation: `gcd(${n(a)}, ${n(m)}) = ${n(ga)}, so ${n(m)} ÷ ${n(ga)} = ${n(sa)} bays.` },
   { prompt: `How many bays does arm B reach, ${n(m)} ÷ gcd(${n(b)}, ${n(m)})?`, answer: [sb], explanation: `gcd(${n(b)}, ${n(m)}) = ${n(gb)}, so ${n(m)} ÷ ${n(gb)} = ${n(sb)} bays.` },
   { prompt: `${Z(m)} has only one subgroup of each size. Enter 1 if the arms reach the same set of bays, or 0 if not.`, answer: [same], explanation: same ? `Both reach ${n(sa)} bays, and there is only one subgroup of that size, so the sets are the same: 1.` : `${n(sa)} and ${n(sb)} are different sizes, so the sets differ: 0.` }
  ] }; }
});

mk({
 id: 'q18d', parent: 'q18', kind: 'challenge', uses: 'q06', title: 'Which settings reach the same bays',
 brief: 'The crew may fit any press setting on a big carousel, and wants to know how many settings reach exactly the bays that one chosen setting reaches.',
 labels: ['bays reached', 'number of subgroups', 'settings reaching the same bays'], tolerance: 0.01,
 gl: [['gcd'], ['bays reached'], ['number of subgroups'], ['settings reaching the same bays']]
}, {
 /* s = m ÷ gcd(a, m) ≥ 3, the number of divisors of m, and the number of presses k in 1 … m − 1 with gcd(k, m) = gcd(a, m): they are
    k = g·j with j in 1 … s − 1 sharing no factor with s, so there are |U(s)| of them (q06). Not the numbers of q18 or its example. */
 canonical: { m: 48, a: 18 },
 draw: R => bounded(R, { m: 48, a: 18 }, R => { const m = R.pick([24, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60]); return { m, a: R.int(2, m - 1) }; },
  p => { const g = gcd(p.a, p.m), s = p.m / g; return g > 1 && s >= 3 && !(p.m === 36 && p.a === 15) && !(p.m === 20 && p.a === 8); }),
 build: ({ m, a }) => { const ds = divisors(m), g = gcd(a, m), s = m / g, c = phi(s), js = []; for (let j = 1; j < s; j++) if (gcd(j, s) === 1) js.push(j); return {
  prompt: `A large carousel has ${n(m)} bays numbered 0 to ${n(m - 1)}, wrapping round, so moving on by k bays is adding k mod ${n(m)} and the moves form the group ${Z(m)}. The loading arm starts at bay 0 and each press moves it on by a fixed number of bays. The arm that moves on by ${n(a)} bays reaches a set of bays, the subgroup ⟨${n(a)}⟩. The crew may fit it with any press setting k from 1 to ${n(m - 1)}. Enter the number of bays ⟨${n(a)}⟩ contains, then the number of subgroups of ${Z(m)}, then how many of the settings k from 1 to ${n(m - 1)} reach exactly the same bays as the setting ${n(a)} (the setting ${n(a)} itself included).`,
  answer: [s, ds.length, c],
  hints: ['⟨a⟩ has n ÷ gcd(a, n) elements, and Zₙ has exactly one subgroup for each divisor of n.', 'A setting k reaches the same bays as a exactly when gcd(k, n) = gcd(a, n) = g. Such a k is g × j, where j runs over the numbers from 1 up to s − 1 that share no factor with s except 1, and s = n ÷ g. How many such j are there? That is the number of units of Zₛ, the |U(s)| of the units mission.'],
  solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)}, so ⟨${n(a)}⟩ has ${n(m)} ÷ ${n(g)} = ${n(s)} elements. The divisors of ${n(m)} are ${and(ds.map(n))}, so ${Z(m)} has ${n(ds.length)} subgroups. A setting k reaches the same bays exactly when gcd(k, ${n(m)}) = ${n(g)}, that is k = ${n(g)} × j with j from 1 to ${n(s - 1)} sharing no factor with ${n(s)} except 1. Those j are ${and(js.map(n))}: ${n(c)} of them, so ${n(c)} settings reach the same bays.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${n(g)} is the largest number that divides both ${n(a)} and ${n(m)}.` },
   { prompt: `How many bays does ⟨${n(a)}⟩ contain, ${n(m)} ÷ gcd(${n(a)}, ${n(m)})?`, answer: [s], explanation: `${n(m)} ÷ ${n(g)} = ${n(s)}.` },
   { prompt: `How many subgroups does ${Z(m)} have (how many divisors does ${n(m)} have, 1 and ${n(m)} included)?`, answer: [ds.length], explanation: `${and(ds.map(n))}: ${n(ds.length)} divisors, so ${n(ds.length)} subgroups.` },
   { prompt: `Settings that reach the same bays are k = ${n(g)} × j. How many numbers j from 1 to ${n(s - 1)} share no factor with ${n(s)} except 1?`, answer: [c], explanation: `They are ${and(js.map(n))}: ${n(c)} numbers, so ${n(c)} settings.` }
  ] }; }
});

/* ---- q19 Cosets [6.1] ---- */

mk({
 id: 'q19b', parent: 'q19', kind: 'setting', title: 'The tool wall lockers',
 brief: 'A tool wall has numbered lockers, and the crew groups them into matching sets so each set can share one key.',
 labels: ['number of cosets', 'largest locker in the coset'], tolerance: 0.01,
 gl: [['size of H'], ['number of cosets'], ['largest locker']]
}, {
 /* d cosets of ⟨d⟩ in Zₘ and the largest label of a + H, which is (a mod d) + m − d. a > d and a mod d ≠ 0. Not the worked example
    (m = 12, d = 4, a = 9) nor q19's (24, 6, 17). */
 canonical: { m: 30, d: 5, a: 23 },
 draw: R => bounded(R, { m: 30, d: 5, a: 23 }, R => { const m = R.pick([12, 15, 16, 18, 20, 21, 24, 27, 28, 30, 32, 35, 36, 40, 42, 45, 48, 50, 54, 56, 60]), ds = divisors(m).filter(x => x > 1 && x < m);
  return { m, d: R.pick(ds), a: R.int(1, m - 1) }; },
  p => p.a > p.d && p.a % p.d !== 0 && !(p.m === 12 && p.d === 4 && p.a === 9) && !(p.m === 24 && p.d === 6 && p.a === 17)),
 build: ({ m, d, a }) => { const k = m / d, r = a % d, q = Math.floor(a / d), big = r + m - d; return {
  prompt: `A tool wall has ${n(m)} lockers numbered 0 to ${n(m - 1)}, and sliding the numbering on by a lockers is adding a mod ${n(m)}, so the numbers form the group ${Z(m)}. The lockers that share one key are the set H = ⟨${n(d)}⟩ = ${multiples(d, m)}. For a number a, the coset a + H is the set made by adding a to every element of H, mod ${n(m)}; it is the set of lockers that share one key with locker a. Enter the number of different cosets of H in ${Z(m)}, then the largest locker number in the coset ${n(a)} + H.`,
  answer: [d, big],
  hints: ['Two cosets are either the same set or share nothing, and each has as many elements as H. So the number of cosets is the size of the whole group divided by the size of H.', 'The coset a + H holds the lockers below n that leave the same remainder as a on division by d: the smallest is that remainder, and the rest come d apart, up to the largest below n.'],
  solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(k)} elements. The cosets do not overlap and each has ${n(k)} elements, so there are ${n(m)} ÷ ${n(k)} = ${n(d)} of them. ${n(a)} = ${n(q)} × ${n(d)} + ${n(r)}, so ${n(a)} + H is every locker below ${n(m)} that leaves remainder ${n(r)} on division by ${n(d)}: ${n(r)}, ${n(r + d)}, …, and the largest is ${n(r)} + ${n(m)} − ${n(d)} = ${n(big)}.`,
  guidance: [
   { prompt: `How many elements does H = ⟨${n(d)}⟩ have?`, answer: [k], explanation: `The multiples of ${n(d)} below ${n(m)}: ${n(m)} ÷ ${n(d)} = ${n(k)} of them.` },
   { prompt: `The cosets split ${Z(m)} into sets of ${n(k)} lockers each, with no overlap. How many cosets are there?`, answer: [d], explanation: `${n(m)} lockers in sets of ${n(k)}: ${n(m)} ÷ ${n(k)} = ${n(d)} cosets.` },
   { prompt: `The smallest locker in ${n(a)} + H is the remainder of ${n(a)} ÷ ${n(d)}, and the lockers in the coset are ${n(d)} apart. What is the largest locker number below ${n(m)} in the coset?`, answer: [big], explanation: `${n(a)} = ${n(q)} × ${n(d)} + ${n(r)}, so the smallest is ${n(r)}. Adding ${n(d)} again and again stays below ${n(m)} until ${n(r)} + ${n(m)} − ${n(d)} = ${n(big)}.` }
  ] }; }
});

mk({
 id: 'q19c', parent: 'q19', kind: 'applied', title: 'Do these two parts share a rack',
 brief: 'Parts are racked by matching label, and the clerk must find how the racks are laid out and whether two particular parts sit together.',
 labels: ['number of racks', 'labels on each rack', 'same rack (1 or 0)'], tolerance: 0.01,
 gl: [['labels on each rack'], ['number of racks'], ['remainder of a − b ÷ d']]
}, {
 /* |H| = m ÷ d labels per rack, d racks. a + H = b + H exactly when a − b lies in H, here when a − b (0 < a − b < m) is a multiple of d.
    About half the draws put the two parts on the same rack. */
 canonical: { m: 36, d: 6, a: 25, b: 13 },
 draw: R => bounded(R, { m: 36, d: 6, a: 25, b: 13 }, R => { const m = R.pick([20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60]), ds = divisors(m).filter(x => x > 1 && x < m), d = R.pick(ds), a = R.int(d + 1, m - 1);
  let b; if (R.bool()) b = a - d * R.int(1, Math.floor((a - 1) / d)); else b = R.int(1, a - 1);
  return { m, d, a, b }; },
  p => p.a > p.b && p.b >= 1 && p.a - p.b < p.m && !(p.m === 24 && p.d === 6 && p.a === 17)),
 build: ({ m, d, a, b }) => { const k = m / d, diff = a - b, rem = diff % d, same = rem === 0 ? 1 : 0; return {
  prompt: `The depot labels its spare parts 0 to ${n(m - 1)} and adds labels mod ${n(m)}, so the labels form the group ${Z(m)}. The subgroup H = ⟨${n(d)}⟩ = ${multiples(d, m)} sets the racking: for a label a, all the parts whose labels are in the coset a + H (the set made by adding a to every element of H, mod ${n(m)}) go on one rack. Two cosets are always either the same set or share no label, so each label goes on exactly one rack. Enter the number of racks the depot needs, then the number of labels on each rack, then 1 if the parts labelled ${n(a)} and ${n(b)} go on the same rack, or 0 if they go on different racks.`,
  answer: [d, k, same],
  hints: ['Each rack is one coset, and every coset has as many labels as H. So the number of racks is the size of the group divided by the size of H.', 'The cosets a + H and b + H are the same set exactly when a − b is in H. For two labels with a larger than b, a − b is in H when it is a multiple of d.'],
  solution: `H = ⟨${n(d)}⟩ has ${n(m)} ÷ ${n(d)} = ${n(k)} elements, so each rack holds ${n(k)} labels. The ${n(m)} labels fill ${n(m)} ÷ ${n(k)} = ${n(d)} racks. Next, ${n(a)} − ${n(b)} = ${n(diff)}, and ${n(diff)} = ${n(Math.floor(diff / d))} × ${n(d)} + ${n(rem)}. ${same ? `${n(diff)} is a multiple of ${n(d)}, so it is in H and ${n(a)} + H = ${n(b)} + H: the parts share a rack.` : `${n(diff)} is not a multiple of ${n(d)}, so it is not in H, so the cosets differ: the parts go on different racks.`}`,
  guidance: [
   { prompt: `How many labels go on each rack? That is the number of elements of H = ⟨${n(d)}⟩.`, answer: [k], explanation: `The multiples of ${n(d)} below ${n(m)}: ${n(m)} ÷ ${n(d)} = ${n(k)} labels.` },
   { prompt: `The racks hold ${n(k)} labels each and share none. How many racks do the ${n(m)} labels fill?`, answer: [d], explanation: `${n(m)} ÷ ${n(k)} = ${n(d)} racks.` },
   { prompt: `The parts share a rack exactly when ${n(a)} − ${n(b)} = ${n(diff)} is a multiple of ${n(d)}. What is the remainder of ${n(diff)} ÷ ${n(d)}?`, answer: [rem], explanation: `${n(diff)} = ${n(Math.floor(diff / d))} × ${n(d)} + ${n(rem)}, so the remainder is ${n(rem)}${rem === 0 ? ', and 0 means the same rack' : ', which is not 0, so the racks differ'}.` }
  ] }; }
});

mk({
 id: 'q19d', parent: 'q19', kind: 'challenge', uses: 'q18', title: 'Racks from a stepping arm',
 brief: 'The racking subgroup is set by an arm that steps a fixed number of labels, not by a divisor, so the crew must find the true rack size first.',
 labels: ['size of H', 'number of cosets', 'smallest label in the coset'], tolerance: 0.01,
 gl: [['gcd'], ['size of H'], ['number of cosets'], ['smallest label']]
}, {
 /* H = ⟨h⟩ = ⟨g⟩ with g = gcd(h, m) (q18). |H| = m ÷ g, g cosets, and the smallest element of a + H is a mod g. h is not itself a divisor of m
    (h ≠ g), 1 < g < m, a > g and a mod g ≠ 0. Not the numbers of q19 or its example. */
 canonical: { m: 48, h: 18, a: 29 },
 draw: R => bounded(R, { m: 48, h: 18, a: 29 }, R => { const m = R.pick([24, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60]); return { m, h: R.int(2, m - 1), a: R.int(1, m - 1) }; },
  p => { const g = gcd(p.h, p.m); return g > 1 && g < p.m && p.h !== g && p.a > g && p.a % g !== 0; }),
 build: ({ m, h, a }) => { const g = gcd(h, m), size = m / g, r = a % g, q = Math.floor(a / g); return {
  prompt: `The depot labels its parts 0 to ${n(m - 1)} and adds labels mod ${n(m)}, so the labels form the group ${Z(m)}. A stepping arm starts at label 0 and moves on by ${n(h)} labels on every press, wrapping round, and the set of labels it lands on is the subgroup H = ⟨${n(h)}⟩. For a label a, the coset a + H is the set made by adding a to every element of H, mod ${n(m)}, and each coset fills one rack. Enter the number of labels in H, then the number of different cosets of H in ${Z(m)}, then the smallest label in the coset ${n(a)} + H.`,
  answer: [size, g, r],
  hints: ['⟨h⟩ is the same subgroup as ⟨g⟩ for g = gcd(h, n), and it has n ÷ g elements.', 'The cosets split the group into equal pieces of |H| elements, so there are n ÷ |H| of them. The smallest element of a + ⟨g⟩ is the remainder of a ÷ g.'],
  solution: `gcd(${n(h)}, ${n(m)}) = ${n(g)}, so H = ⟨${n(h)}⟩ = ⟨${n(g)}⟩ = ${multiples(g, m)}, which has ${n(m)} ÷ ${n(g)} = ${n(size)} elements. The cosets do not overlap and each has ${n(size)} elements, so there are ${n(m)} ÷ ${n(size)} = ${n(g)} of them. ${n(a)} = ${n(q)} × ${n(g)} + ${n(r)}, so the smallest label in ${n(a)} + H is ${n(r)}.`,
  guidance: [
   { prompt: `What is gcd(${n(h)}, ${n(m)})? The subgroup ⟨${n(h)}⟩ is the same as the subgroup made by that number.`, answer: [g], explanation: `${n(g)} is the largest number that divides both ${n(h)} and ${n(m)}, so ⟨${n(h)}⟩ = ⟨${n(g)}⟩.` },
   { prompt: `How many elements does H = ⟨${n(g)}⟩ have?`, answer: [size], explanation: `${n(m)} ÷ ${n(g)} = ${n(size)} elements.` },
   { prompt: `The cosets split ${Z(m)} into racks of ${n(size)} labels each, with no overlap. How many cosets are there?`, answer: [g], explanation: `${n(m)} ÷ ${n(size)} = ${n(g)} cosets.` },
   { prompt: `Take ${n(g)} away from ${n(a)} as often as you can without going below 0. What is the smallest label in ${n(a)} + H?`, answer: [r], explanation: `${n(a)} = ${n(q)} × ${n(g)} + ${n(r)}, so the smallest label in ${n(a)} + H is ${n(r)}.` }
  ] }; }
});

/* ---- q20 Lagrange's theorem [6.2] ---- */

mk({
 id: 'q20b', parent: 'q20', kind: 'setting', title: 'Settings of the cipher dial',
 brief: 'A cipher dial has a fixed number of settings, and the crew wants to know how its settings split and which smaller dials could fit inside it.',
 labels: ['index', 'sizes allowed'], tolerance: 0.01,
 gl: [['index'], ['divisors'], ['sizes allowed']]
}, {
 /* Index N ÷ M and the number of subgroup sizes strictly between 1 and N that Lagrange allows (the divisors of N other than 1 and N).
    M is a proper divisor above 1. Not the worked example (24, 6) nor q20's (60, 12). */
 canonical: { N: 40, M: 8 },
 draw: R => bounded(R, { N: 40, M: 8 }, R => { const N = R.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 72, 80, 84, 90, 96]), ds = divisors(N).filter(x => x > 1 && x < N);
  return { N, M: R.pick(ds) }; },
  p => !(p.N === 24 && p.M === 6) && !(p.N === 60 && p.M === 12)),
 build: ({ N, M }) => { const idx = N / M, ds = divisors(N).filter(x => x > 1 && x < N); return {
  prompt: `The settings of a cipher dial for the vault door form a group G with ${n(N)} settings. The settings that leave the inner wheel where it is form a subgroup H with ${n(M)} settings. Enter the index [G : H], the number of cosets of H in G. Then enter how many different sizes between 2 and ${n(N - 1)} (neither 1 nor ${n(N)} counted) a subgroup of G is allowed to have by Lagrange’s theorem: the theorem allows a size when it divides ${n(N)}, though it does not promise that a subgroup of that size exists.`,
  answer: [idx, ds.length],
  hints: ['The cosets of H split G into equal batches of |H| settings, so the index [G : H] is |G| ÷ |H|.', 'Lagrange’s theorem allows exactly the sizes that divide |G|. List the divisors of |G| and leave out 1 and |G| itself.'],
  solution: `The cosets of H split the ${n(N)} settings into batches of ${n(M)}, so [G : H] = ${n(N)} ÷ ${n(M)} = ${n(idx)}. The divisors of ${n(N)} are ${and(divisors(N).map(n))}. Leaving out 1 and ${n(N)} gives ${and(ds.map(n))}: ${n(ds.length)} sizes.`,
  guidance: [
   { prompt: `What is the index [G : H] = |G| ÷ |H|?`, answer: [idx], explanation: `${n(N)} ÷ ${n(M)} = ${n(idx)}: G splits into ${n(idx)} cosets of H.` },
   { prompt: `How many divisors does ${n(N)} have, 1 and ${n(N)} included?`, answer: [ds.length + 2], explanation: `${and(divisors(N).map(n))}: ${n(ds.length + 2)} divisors.` },
   { prompt: `Leave out the sizes 1 and ${n(N)}. How many sizes does Lagrange’s theorem allow between them?`, answer: [ds.length], explanation: `${n(ds.length + 2)} − 2 = ${n(ds.length)} sizes: ${and(ds.map(n))}.` }
  ] }; }
});

mk({
 id: 'q20c', parent: 'q20', kind: 'applied', title: 'Four claims about the loader group',
 brief: 'Four crew members each claim the cargo loader has a subgroup of a different size, and Mira wants them checked against Lagrange’s theorem.',
 labels: ['sizes allowed', 'index of the largest allowed size'], tolerance: 0.01,
 gl: [['sizes allowed'], ['largest allowed size'], ['index']]
}, {
 /* N moves and four proposed sizes between 2 and N − 1: the count that divide N (1 to 3 of them) and the index N ÷ (largest dividing size). */
 canonical: { N: 72, ks: [16, 9, 36, 10] },
 draw: R => bounded(R, { N: 72, ks: [16, 9, 36, 10] }, R => { const N = R.pick([48, 54, 60, 64, 72, 80, 84, 90, 96]), ks = []; let g = 0;
  while (ks.length < 4 && g++ < 200) { const k = R.int(3, N - 2); if (!ks.includes(k)) ks.push(k); } return { N, ks }; },
  p => { const c = p.ks.filter(k => p.N % k === 0).length; return p.ks.length === 4 && c >= 1 && c <= 3 && !(p.N === 60 && p.ks.includes(8)); }),
 build: ({ N, ks }) => { const ok = ks.filter(k => N % k === 0), big = Math.max(...ok), idx = N / big, bad = ks.filter(k => N % k !== 0); return {
  prompt: `The moves of the cargo loader form a group G with ${n(N)} moves. Four crew members each claim that G has a subgroup, with ${and(ks.map(n))} moves respectively. Mira checks them with Lagrange’s theorem: it allows a size only if the size divides ${n(N)} (and even an allowed size is not a promise that a subgroup of that size exists). Enter how many of the four sizes the theorem allows, then the index [G : K] of a subgroup K that has the largest of the allowed sizes (the index is |G| ÷ |K|).`,
  answer: [ok.length, idx],
  hints: ['Divide |G| by each claimed size. The theorem rules out every size that leaves a remainder, and allows every size that divides |G| exactly.', 'The index of a subgroup K is |G| ÷ |K|. Use the largest size that is allowed, not the largest size claimed.'],
  solution: `Check each size against ${n(N)}: ${ks.map(k => N % k === 0 ? `${n(k)} divides ${n(N)} (${n(N)} = ${n(N / k)} × ${n(k)})` : `${n(k)} does not (${n(N)} = ${n(Math.floor(N / k))} × ${n(k)} + ${n(N % k)})`).join('; ')}. So the theorem allows ${n(ok.length)} of the four sizes: ${and(ok.map(n))}. The largest allowed size is ${n(big)}, so the index is ${n(N)} ÷ ${n(big)} = ${n(idx)}.`,
  guidance: [
   { prompt: `Divide ${n(N)} by each claimed size: ${and(ks.map(n))}. How many of them divide ${n(N)} exactly?`, answer: [ok.length], explanation: `${ks.map(k => N % k === 0 ? `${n(k)} divides ${n(N)}` : `${n(k)} leaves remainder ${n(N % k)}`).join('; ')}. So ${n(ok.length)} sizes are allowed.` },
   { prompt: `Which is the largest of the allowed sizes, the sizes that divide ${n(N)}?`, answer: [big], explanation: `The allowed sizes are ${and(ok.map(n))}, and the largest is ${n(big)}.` },
   { prompt: `What is the index of a subgroup with ${n(big)} moves, ${n(N)} ÷ ${n(big)}?`, answer: [idx], explanation: `${n(N)} ÷ ${n(big)} = ${n(idx)}.` }
  ] }; }
});

mk({
 id: 'q20d', parent: 'q20', kind: 'challenge', uses: 'q18', title: 'Lagrange on a cyclic dial',
 brief: 'The rotary dial of the vault door is cyclic, so the crew can say for certain which batch sizes exist, not just which are allowed.',
 labels: ['size of ⟨a⟩', 'index', 'subgroup exists (1 or 0)'], tolerance: 0.01,
 gl: [['gcd'], ['size of ⟨a⟩'], ['index'], ['remainder']]
}, {
 /* In Zₘ, ⟨a⟩ has m ÷ g elements and index g (g = gcd(a, m)); and Zₘ has a subgroup of k elements exactly when k divides m (one for every
    divisor, q18), so here "allowed" and "exists" agree. g > 1 and ⟨a⟩ is not everything. k divides m in about half the draws. */
 canonical: { m: 60, a: 14, k: 12 },
 draw: R => bounded(R, { m: 60, a: 14, k: 12 }, R => { const m = R.pick([24, 30, 36, 40, 42, 45, 48, 54, 56, 60, 72, 80, 84, 90]), ds = divisors(m).filter(x => x > 1 && x < m); return { m, a: R.int(2, m - 1), k: R.bool() ? R.pick(ds) : R.int(3, m - 2) }; },
  p => gcd(p.a, p.m) > 1 && p.k > 1 && !(p.m === 36 && p.a === 15)),
 build: ({ m, a, k }) => { const g = gcd(a, m), s = m / g, ok = m % k === 0 ? 1 : 0; return {
  prompt: `The rotary dial of the vault door has ${n(m)} positions numbered 0 to ${n(m - 1)}, and turning it on by j positions is adding j mod ${n(m)}, so its moves form the cyclic group ${Z(m)}. Turning by ${n(a)} positions again and again makes the subgroup ⟨${n(a)}⟩. Enter the number of elements of ⟨${n(a)}⟩, then its index in ${Z(m)} (the number of cosets), then 1 if ${Z(m)} has a subgroup with exactly ${n(k)} elements, or 0 if it does not. (For a cyclic group like ${Z(m)} the answer is not just “allowed”: it has a subgroup of every size that divides ${n(m)}, and of no other size.)`,
  answer: [s, g, ok],
  hints: ['⟨a⟩ has n ÷ gcd(a, n) elements, and the index of a subgroup is |G| ÷ |H|.', 'A subgroup with k elements is ruled out when k does not divide n, by Lagrange’s theorem. In Zₙ every divisor of n is the size of a subgroup, so the answer is 1 exactly when k divides n.'],
  solution: `gcd(${n(a)}, ${n(m)}) = ${n(g)}, so ⟨${n(a)}⟩ has ${n(m)} ÷ ${n(g)} = ${n(s)} elements. Its index is ${n(m)} ÷ ${n(s)} = ${n(g)}. For the last answer, ${ok ? `${n(m)} = ${n(m / k)} × ${n(k)}, so ${n(k)} divides ${n(m)}, and ${Z(m)} has a subgroup of exactly ${n(k)} elements: 1.` : `${n(m)} = ${n(Math.floor(m / k))} × ${n(k)} + ${n(m % k)}, so ${n(k)} does not divide ${n(m)}, and Lagrange’s theorem rules out a subgroup of ${n(k)} elements: 0.`}`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(m)})?`, answer: [g], explanation: `${n(g)} is the largest number that divides both ${n(a)} and ${n(m)}.` },
   { prompt: `How many elements does ⟨${n(a)}⟩ have, ${n(m)} ÷ gcd(${n(a)}, ${n(m)})?`, answer: [s], explanation: `${n(m)} ÷ ${n(g)} = ${n(s)}.` },
   { prompt: `What is the index of ⟨${n(a)}⟩ in ${Z(m)}, ${n(m)} ÷ ${n(s)}?`, answer: [g], explanation: `${n(m)} ÷ ${n(s)} = ${n(g)} cosets.` },
   { prompt: `What is the remainder when ${n(m)} is divided by ${n(k)}? (If it is 0, ${Z(m)} has a subgroup with ${n(k)} elements; otherwise it does not.)`, answer: [m % k], explanation: ok ? `${n(m)} = ${n(m / k)} × ${n(k)}, so the remainder is 0 and the subgroup exists: 1.` : `${n(m)} = ${n(Math.floor(m / k))} × ${n(k)} + ${n(m % k)}, so the remainder is ${n(m % k)}, the size is ruled out: 0.` }
  ] }; }
});

})();
