/* Number theory: the hidden life of whole numbers practice missions, file 2 of 8: concepts q06–q10, three practice missions each
   (q06b q06c q06d q07b q07c q07d q08b q08c q08d q09b q09c q09d q10b q10c q10d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/number/oracle-p2.js. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* An ordinal for a whole number: ord(1) is '1st', ord(12) is '12th', ord(23) is '23rd'. */
const ord = v => `${n(v)}${v % 100 >= 11 && v % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][v % 10] || 'th')}`;
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

/* ---- helpers ---- */
/* A retry loop that can never run away: at most 1000 tries, then the canonical parameters. */
const tries = (gen, ok, canon) => { for (let i = 0; i < 1000; i++) { const p = gen(); if (ok(p)) { delete p.ok; return p; } } return canon; };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* Euclid's algorithm: every division a = q × b + r down to the one with remainder 0. */
const euclid = (a, b) => { const rows = []; while (b) { const q = Math.floor(a / b), r = a % b; rows.push({ a, b, q, r }); [a, b] = [b, r]; } return { g: a, rows }; };
const eLines = rows => rows.map(r => `${n(r.a)} = ${n(r.q)} × ${n(r.b)} + ${n(r.r)}`).join('; ');
/* Extended Euclid: [g, x, y] with ax + by = g. */
const ext = (a, b) => { if (b === 0) return [a, 1, 0]; const [g, x, y] = ext(b, a % b); return [g, y, x - Math.floor(a / b) * y]; };
/* The solution of ax + by = c (c a multiple of g = gcd(a, b)) with the smallest positive x; k = −y. */
const bez = (a, b, c) => { const [g, x0, y0] = ext(a, b), sb = b / g, sa = a / g, m = c / g, X0 = m * x0, Y0 = m * y0;
 let x = ((X0 % sb) + sb) % sb; if (x === 0) x = sb; const t = (x - X0) / sb, y = Y0 - sa * t; return { g, sa, sb, m, x0, y0, X0, Y0, x, y, t, k: -y }; };
const times = k => k === 0 ? 'no times' : k === 1 ? 'once' : `${n(k)} times`;
const shift = (t, sb, sa) => t === 0 ? 'This x is already the smallest positive choice.' : `Adding ${n(sb)} to x and taking ${n(sa)} from y keeps the total the same; doing that ${t > 0 ? times(t) : times(-t) + ' in reverse'} gives the smallest positive x.`;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = e => String(e).split('').map(d => SUP[d]).join('');
const POW = (p, e) => Math.pow(p, e);
/* "2⁴ × 3² × 5": the primes with a non-zero exponent, an exponent 1 left unwritten. */
const fact = pairs => pairs.filter(([, e]) => e > 0).map(([p, e]) => e === 1 ? n(p) : n(p) + sup(e)).join(' × ');
const sigmaPP = (p, e) => (POW(p, e + 1) - 1) / (p - 1);
const powSum = (p, e) => Array.from({ length: e + 1 }, (_, i) => n(POW(p, i))).join(' + ');
const list2 = ps => { const t = ps.map(([u, v]) => `(${n(u)}, ${n(v)})`); return t.length < 2 ? t.join('') : t.slice(0, -1).join(', ') + ' and ' + t[t.length - 1]; };
/* The positive whole-number solutions (x, y) of ax + by = c, smallest x first. */
const pairsOf = (a, b, c) => { const out = []; for (let x = 1; a * x < c; x++) if ((c - a * x) % b === 0) out.push([x, (c - a * x) / b]); return out; };

/* ---- q06 Euclid's algorithm [R1.6] ---- */

/* Not the q06 example (4389, 1683) or its worked example (84, 30). Four to seven divisions. */
mk({
 id: 'q06b', parent: 'q06', kind: 'setting', title: 'Cutting the cable reels',
 brief: 'Two reels of cable in the store must be cut into pieces of one length, with nothing left on either reel.',
 labels: ['longest piece (m)', 'total pieces'], tolerance: 0.01,
 gl: [['first quotient', 'first remainder'], ['longest piece (m)'], ['total pieces']]
}, {
 canonical: { a: 2431, b: 1088 },
 draw: R => tries(() => { const g = R.int(2, 40), b1 = R.int(5, 200), a1 = R.int(b1 + 1, 400); return { a: g * a1, b: g * b1, ok: gcd(a1, b1) === 1 }; },
  p => { if (!p.ok || p.a > 5000 || p.b < 100 || (p.a === 4389 && p.b === 1683)) return false; const k = euclid(p.a, p.b).rows.length; return k >= 4 && k <= 7; }, { a: 2431, b: 1088 }),
 build: ({ a, b }) => { const { g, rows } = euclid(a, b), r1 = rows[0], pa = a / g, pb = b / g, tot = pa + pb, lines = eLines(rows); return {
  prompt: `Two reels of cable in the cable store hold ${n(a)} m and ${n(b)} m. Mira cuts both reels completely into pieces that are all the same length, with no cable left over from either reel, and she wants the longest piece length that allows it. Use Euclid’s algorithm: divide ${n(a)} by ${n(b)}, then divide each divisor by the remainder it left, until a remainder is 0. Enter the longest piece length in metres, then the total number of pieces from the two reels together.`,
  answer: [g, tot],
  hints: ['A piece length works for both reels when it divides both lengths exactly, so the longest one is the gcd. Each new division divides the previous divisor by the previous remainder, and the last remainder that is not 0 is the gcd.', 'The number of pieces from one reel is its length divided by the piece length. Add the pieces from the two reels.'],
  solution: `${lines}. The last remainder that is not 0 is ${n(g)}, so the longest piece is ${n(g)} m. The reels give ${n(a)} ÷ ${n(g)} = ${n(pa)} pieces and ${n(b)} ÷ ${n(g)} = ${n(pb)} pieces, ${n(tot)} pieces in all.`,
  guidance: [
   { prompt: `First division: ${n(a)} = q × ${n(b)} + r. What are q and r?`, answer: [r1.q, r1.r], explanation: `${n(r1.q)} × ${n(b)} = ${n(r1.q * b)}, and ${n(a)} − ${n(r1.q * b)} = ${n(r1.r)}, so ${n(a)} = ${n(r1.q)} × ${n(b)} + ${n(r1.r)}.` },
   { prompt: 'Keep dividing each divisor by the remainder it left until a remainder is 0. What is the longest piece length, the gcd?', answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `Each reel is cut into pieces of ${n(g)} m. How many pieces is that from both reels together?`, answer: [tot], explanation: `${n(a)} ÷ ${n(g)} = ${n(pa)} and ${n(b)} ÷ ${n(g)} = ${n(pb)}, and ${n(pa)} + ${n(pb)} = ${n(tot)}.` }
  ] }; }
});

/* A floor a cm by b cm tiled with whole square tiles of side gcd(a, b): (a ÷ g) × (b ÷ g) tiles. Three to seven divisions. */
mk({
 id: 'q06c', parent: 'q06', kind: 'applied', title: 'Tiling the storeroom',
 brief: 'A storeroom floor is to be tiled with whole square tiles and no cutting, and the order must name the tile size and the count.',
 labels: ['tile side (cm)', 'tiles'], tolerance: 0.01,
 gl: [['tile side (cm)'], ['tiles along the length', 'tiles along the width'], ['tiles']]
}, {
 canonical: { a: 948, b: 552 },
 draw: R => tries(() => { const g = R.int(4, 50), b1 = R.int(4, 60), a1 = R.int(b1 + 1, 100); return { a: g * a1, b: g * b1, ok: gcd(a1, b1) === 1 }; },
  p => { if (!p.ok || p.a > 5000 || p.b < 100 || (p.a === 948 && p.b === 552)) return false; const k = euclid(p.a, p.b).rows.length; return k >= 3 && k <= 7; }, { a: 948, b: 552 }),
 build: ({ a, b }) => { const { g, rows } = euclid(a, b), pa = a / g, pb = b / g, tiles = pa * pb, lines = eLines(rows); return {
  prompt: `The floor of a storeroom measures ${n(a)} cm by ${n(b)} cm. Mira covers it with whole square tiles that are all the same size, none cut and none overlapping, and she wants the biggest tile size that fits exactly along both lengths, so the floor needs the fewest tiles. Use Euclid’s algorithm to find the side of that tile. Enter the side in centimetres, then the number of tiles needed to cover the whole floor. Type both without commas.`,
  answer: [g, tiles],
  hints: ['A square tile fits exactly along a length when its side divides that length. The biggest side that divides both lengths is their gcd, which Euclid’s algorithm finds without factorising.', 'Count the tiles along each side of the floor, then multiply the two counts: the tiles form a grid of rows and columns.'],
  solution: `${lines}. The last remainder that is not 0 is ${n(g)}, so the largest tile has side ${n(g)} cm. Along the ${n(a)} cm length there are ${n(a)} ÷ ${n(g)} = ${n(pa)} tiles, and along the ${n(b)} cm width ${n(b)} ÷ ${n(g)} = ${n(pb)} tiles, so ${n(pa)} × ${n(pb)} = ${n(tiles)} tiles cover the floor.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(a)} and ${n(b)}. What is the side of the largest tile, the gcd?`, answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `Tiles of side ${n(g)} cm go along the floor. How many fit along the ${n(a)} cm length, and how many along the ${n(b)} cm width?`, answer: [pa, pb], explanation: `${n(a)} ÷ ${n(g)} = ${n(pa)} and ${n(b)} ÷ ${n(g)} = ${n(pb)}.` },
   { prompt: `The tiles form ${n(pa)} columns and ${n(pb)} rows. How many tiles is that in all?`, answer: [tiles], explanation: `${n(pa)} × ${n(pb)} = ${n(tiles)} tiles.` }
  ] }; }
});

/* gcd by Euclid (six to nine divisions), then lcm = a ÷ gcd × b. */
mk({
 id: 'q06d', parent: 'q06', kind: 'challenge', uses: 'q05', title: 'The ridge beacons',
 brief: 'Two beacons on the ridge flash on different rhythms, and the watch officer needs the rhythm they share and the moment they next flash together.',
 labels: ['gcd', 'lcm'], tolerance: 0.01,
 gl: [['first quotient', 'first remainder'], ['gcd'], ['lcm']]
}, {
 canonical: { a: 327, b: 120 },
 draw: R => tries(() => { const g = R.int(2, 12), b1 = R.int(20, 100), a1 = R.int(b1 + 1, 160); return { a: g * a1, b: g * b1, ok: gcd(a1, b1) === 1 }; },
  p => { if (!p.ok || p.a > 5000 || (p.a * p.b) / gcd(p.a, p.b) > 99999 || (p.a === 327 && p.b === 120)) return false; const k = euclid(p.a, p.b).rows.length; return k >= 6 && k <= 9; }, { a: 327, b: 120 }),
 build: ({ a, b }) => { const { g, rows } = euclid(a, b), r1 = rows[0], L = (a / g) * b, lines = eLines(rows); return {
  prompt: `Two beacons on the ridge both flash at second 0. After that, one flashes every ${n(a)} seconds and the other every ${n(b)} seconds, and each keeps its rhythm exactly. Rather than factorising, find gcd(${n(a)}, ${n(b)}) with Euclid’s algorithm, and then use the fact that gcd × lcm = ${n(a)} × ${n(b)}. Enter gcd(${n(a)}, ${n(b)}), then lcm(${n(a)}, ${n(b)}), which is the number of seconds until the two next flash together. Type both without commas.`,
  answer: [g, L],
  hints: ['Divide the larger number by the smaller, then each divisor by the remainder it left, until a remainder is 0. The last remainder that is not 0 is the gcd.', 'For two whole numbers, gcd × lcm equals the product of the numbers. So the lcm is the product divided by the gcd; dividing one number by the gcd first keeps the figures smaller.'],
  solution: `${lines}. The last remainder that is not 0 is ${n(g)}, so gcd(${n(a)}, ${n(b)}) = ${n(g)}. Then lcm = ${n(a)} × ${n(b)} ÷ ${n(g)} = (${n(a)} ÷ ${n(g)}) × ${n(b)} = ${n(a / g)} × ${n(b)} = ${n(L)}.`,
  guidance: [
   { prompt: `First division: ${n(a)} = q × ${n(b)} + r. What are q and r?`, answer: [r1.q, r1.r], explanation: `${n(r1.q)} × ${n(b)} = ${n(r1.q * b)}, and ${n(a)} − ${n(r1.q * b)} = ${n(r1.r)}, so ${n(a)} = ${n(r1.q)} × ${n(b)} + ${n(r1.r)}.` },
   { prompt: 'Keep dividing each divisor by the remainder it left until a remainder is 0. What is the gcd?', answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `The gcd is ${n(g)}. Use gcd × lcm = ${n(a)} × ${n(b)}. What is the lcm?`, answer: [L], explanation: `lcm = ${n(a)} × ${n(b)} ÷ ${n(g)} = ${n(a / g)} × ${n(b)} = ${n(L)}.` }
  ] }; }
});

/* ---- q07 Bézout coefficients [R1.6] ---- */

/* ax − bk = gcd with x the smallest positive. Not the q07 example (84, 33) or its worked example (17, 5). */
mk({
 id: 'q07b', parent: 'q07', kind: 'setting', title: 'The calibration bench',
 brief: 'A calibration bench has two kinds of brass weight, and the smallest exact difference between its two pans needs a recipe.',
 labels: ['gcd', 'x', 'k'], tolerance: 0.01,
 gl: [['gcd'], ['step for x', 'step for k'], ['x', 'k']]
}, {
 canonical: { a: 94, b: 42 },
 draw: R => tries(() => { const g = R.pick([1, 1, 2, 3, 4, 5, 6, 7]), b1 = R.int(3, 30), a1 = R.int(b1 + 1, 60); return { a: g * a1, b: g * b1, ok: gcd(a1, b1) === 1 }; },
  p => p.ok && p.a <= 200 && p.b >= 10 && !(p.a === 84 && p.b === 33) && !(p.a === 17 && p.b === 5), { a: 94, b: 42 }),
 build: ({ a, b }) => { const r = bez(a, b, gcd(a, b)), { g, sa, sb, x0, y0, x, k, t } = r, lines = eLines(euclid(a, b).rows), mv = shift(t, sb, sa); return {
  prompt: `A calibration bench has two kinds of brass weight, of ${n(a)} g and ${n(b)} g, and plenty of each. Mira puts x of the ${n(a)} g weights on the left pan and k of the ${n(b)} g weights on the right pan, so the left pan is heavier by ${n(a)}x − ${n(b)}k grams. The smallest positive difference she can make this way is gcd(${n(a)}, ${n(b)}) grams. Find whole numbers x and k with ${n(a)}x − ${n(b)}k = gcd(${n(a)}, ${n(b)}), taking x as the smallest positive choice. Enter the gcd, then x, then k.`,
  answer: [g, x, k],
  hints: ['Run Euclid’s algorithm, then work back up from the last line: write the gcd using the last two remainders, and replace each remainder by the division that made it. That gives numbers x and y with ax + by = gcd; since the right pan takes the b weights, k is the opposite of y.', 'From one solution you get another by adding b ÷ gcd to x and taking a ÷ gcd from y. Use this to bring x to the smallest positive value.'],
  solution: `Euclid’s algorithm: ${lines}, so the gcd is ${n(g)}. Working back up the lines gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. ${mv} So x = ${n(x)} and y = ${n(-k)}, which means k = ${n(k)}: ${n(k)} ${k === 1 ? 'weight' : 'weights'} on the right pan. Check: ${n(a)} × ${n(x)} − ${n(b)} × ${n(k)} = ${n(a * x)} − ${n(b * k)} = ${n(g)}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `If ${n(a)}x − ${n(b)}k = ${n(g)}, by how much can x go up, and k go up with it, so that the difference stays ${n(g)}? Use the smallest whole steps.`, answer: [sb, sa], explanation: `${n(a)} × ${n(sb)} = ${n(b)} × ${n(sa)} = ${n(a * sb)}, so adding ${n(sb)} to x and ${n(sa)} to k leaves the difference unchanged. These are ${n(b)} ÷ ${n(g)} and ${n(a)} ÷ ${n(g)}.` },
   { prompt: 'Work back up Euclid’s lines to get one solution, then shift it. What are the smallest positive x and its k?', answer: [x, k], explanation: `Working back gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. ${mv} So x = ${n(x)}, and k is the opposite of y: k = ${n(k)}.` }
  ] }; }
});

/* Shuttle A leaves at minutes a, 2a, 3a, …; B at b, 2b, 3b, …; the first A departure that is exactly gcd minutes after a B departure. */
mk({
 id: 'q07c', parent: 'q07', kind: 'applied', title: 'Two shuttle timetables',
 brief: 'Two shuttles run loops of different lengths, and the timetable clerk wants the first moment they come closest together.',
 labels: ['gcd', 'x', 'minute'], tolerance: 0.01,
 gl: [['gcd'], ['x', 'k'], ['minute']]
}, {
 canonical: { a: 75, b: 28 },
 draw: R => tries(() => { const g = R.pick([1, 1, 2, 3, 4, 5]), b1 = R.int(3, 30), a1 = R.int(b1 + 1, 50); return { a: g * a1, b: g * b1, ok: gcd(a1, b1) === 1 }; },
  p => p.ok && p.a <= 150 && p.b >= 8 && !(p.a === 75 && p.b === 28), { a: 75, b: 28 }),
 build: ({ a, b }) => { const r = bez(a, b, gcd(a, b)), { g, sa, sb, x0, y0, x, k, t } = r, lines = eLines(euclid(a, b).rows), mv = shift(t, sb, sa), minute = a * x; return {
  prompt: `Two shuttles leave the depot gate on separate loops. Shuttle A leaves at minutes ${n(a)}, ${n(2 * a)}, ${n(3 * a)} and so on, every ${n(a)} minutes, and shuttle B leaves at minutes ${n(b)}, ${n(2 * b)}, ${n(3 * b)} and so on, every ${n(b)} minutes. Differences between an A departure and a B departure are multiples of gcd(${n(a)}, ${n(b)}) minutes, and the smallest positive one is that gcd. Mira wants the first A departure that leaves exactly gcd(${n(a)}, ${n(b)}) minutes after a B departure. If it is the xth A departure and the kth B departure, then ${n(a)}x − ${n(b)}k = gcd(${n(a)}, ${n(b)}), with x as small as possible. Enter the gcd, then x, then the minute at which that A departure leaves. Type the minute without commas.`,
  answer: [g, x, minute],
  hints: ['Run Euclid’s algorithm, then work back up from the last line to write the gcd as a combination of the two numbers. The k you want is the opposite of the coefficient of the second number.', 'The xth A departure leaves at minute a × x. To bring x to the smallest positive value, add b ÷ gcd to x (and a ÷ gcd to k) as often as needed, or take them away.'],
  solution: `Euclid’s algorithm: ${lines}, so the gcd is ${n(g)}. Working back up the lines gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. ${mv} So x = ${n(x)} and k = ${n(k)}. Check: ${n(a)} × ${n(x)} − ${n(b)} × ${n(k)} = ${n(a * x)} − ${n(b * k)} = ${n(g)}. The ${ord(x)} A departure leaves at minute ${n(a)} × ${n(x)} = ${n(minute)}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `Work back up Euclid’s lines and shift to the smallest positive x. What are x and k in ${n(a)}x − ${n(b)}k = ${n(g)}?`, answer: [x, k], explanation: `Working back gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. ${mv} So x = ${n(x)} and k = ${n(k)}.` },
   { prompt: `Shuttle A leaves every ${n(a)} minutes and this is its ${ord(x)} departure. At what minute does it leave?`, answer: [minute], explanation: `${n(a)} × ${n(x)} = ${n(minute)}. The ${ord(k)} B departure left at ${n(b)} × ${n(k)} = ${n(b * k)}, exactly ${n(g)} ${g === 1 ? 'minute' : 'minutes'} earlier.` }
  ] }; }
});

/* ax − bk = c with c a multiple of gcd(a, b) and c < a, x the smallest positive; bigger numbers. */
mk({
 id: 'q07d', parent: 'q07', kind: 'challenge', uses: 'q06', title: 'Winches on the relay mast',
 brief: 'Two winches on the relay mast pay out and take in cable in fixed lengths, and the antenna must move by an exact amount.',
 labels: ['gcd', 'x', 'k'], tolerance: 0.01,
 gl: [['gcd'], ['multiple'], ['x', 'k']]
}, {
 canonical: { a: 164, b: 60, c: 12 },
 draw: R => tries(() => { const g = R.pick([1, 1, 2, 3, 4, 5]), b1 = R.int(5, 60), a1 = R.int(b1 + 1, 120); return { a: g * a1, b: g * b1, c: g * R.int(2, 6), ok: gcd(a1, b1) === 1 }; },
  p => p.ok && p.a <= 400 && p.b >= 20 && p.c < p.a && !(p.a === 164 && p.b === 60 && p.c === 12), { a: 164, b: 60, c: 12 }),
 build: ({ a, b, c }) => { const r = bez(a, b, c), { g, sa, sb, m, x0, y0, X0, Y0, x, k, t } = r, lines = eLines(euclid(a, b).rows), mv = shift(t, sb, sa); return {
  prompt: `A relay mast has two winches. One turn of winch A pays out ${n(a)} cm of cable and one turn of winch B takes in ${n(b)} cm, so after x turns of A and k turns of B the antenna has moved ${n(a)}x − ${n(b)}k centimetres along the cable. The antenna must move exactly ${n(c)} cm, which is a multiple of gcd(${n(a)}, ${n(b)}), with x and k whole numbers and k at least 1. Find the gcd with Euclid’s algorithm, work back up its lines to write the gcd as a combination of ${n(a)} and ${n(b)}, and scale that up to ${n(c)}. Enter the gcd, then the smallest positive x that works, then the k that goes with it.`,
  answer: [g, x, k],
  hints: ['Run Euclid’s algorithm, then work back up its lines to write the gcd as ax + by. To reach a larger target that is a multiple of the gcd, multiply both x and y by the number of times the gcd fits into the target.', 'The scaled pair is one solution. Other solutions come from adding b ÷ gcd to x and taking a ÷ gcd from y; use this to bring x to the smallest positive value. Then k is the opposite of y.'],
  solution: `Euclid’s algorithm: ${lines}, so the gcd is ${n(g)}. Working back up the lines gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. Since ${n(c)} = ${n(m)} × ${n(g)}, multiplying by ${n(m)} gives ${n(c)} = ${n(a)} × ${par(X0)} + ${n(b)} × ${par(Y0)}. ${mv} So x = ${n(x)} and y = ${n(-k)}, which makes k = ${n(k)}. Check: ${n(a)} × ${n(x)} − ${n(b)} × ${n(k)} = ${n(a * x)} − ${n(b * k)} = ${n(c)}.`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}.` },
   { prompt: `How many times does the gcd go into the target ${n(c)}? Working back up Euclid’s lines gives a pair for the gcd itself, and you will multiply that pair by this number.`, answer: [m], explanation: `${n(c)} ÷ ${n(g)} = ${n(m)}, so ${n(c)} = ${n(m)} × ${n(g)}. The pair ${n(x0)}, ${n(y0)} for ${n(g)} becomes ${n(X0)}, ${n(Y0)} for ${n(c)}.` },
   { prompt: `Shift the scaled pair so that x is the smallest positive value. What are x and k in ${n(a)}x − ${n(b)}k = ${n(c)}?`, answer: [x, k], explanation: `${n(c)} = ${n(a)} × ${par(X0)} + ${n(b)} × ${par(Y0)}. ${mv} So x = ${n(x)} and k = ${n(k)}.` }
  ] }; }
});

/* ---- q08 Linear Diophantine equations [R2.5] ---- */

/* ax + by = c, two to six positive solutions, asked: the count and the largest x. Not the q08 example (7, 11, 200) or its worked example (3, 5, 31). */
mk({
 id: 'q08b', parent: 'q08', kind: 'setting', title: 'Packing the cargo hold',
 brief: 'A cargo hold has an exact number of slots, and pods of two sizes must fill every one of them.',
 labels: ['pairs', 'largest x'], tolerance: 0.01,
 gl: [['gcd'], ['smallest x', 'y'], ['pairs', 'largest x']]
}, {
 canonical: { a: 9, b: 13, c: 250 },
 draw: R => tries(() => ({ a: R.int(3, 14), b: R.int(4, 19), c: R.int(30, 250) }),
  p => { const g = gcd(p.a, p.b); if (p.c % g !== 0 || p.a === p.b || p.b / g < 2 || p.a / g < 2) return false; const k = pairsOf(p.a, p.b, p.c).length;
   return k >= 2 && k <= 6 && !(p.a === 7 && p.b === 11 && p.c === 200) && !(p.a === 3 && p.b === 5 && p.c === 31); }, { a: 9, b: 13, c: 250 }),
 build: ({ a, b, c }) => { const g = gcd(a, b), sb = b / g, sa = a / g, pairs = pairsOf(a, b, c), [x, y] = pairs[0], k = pairs.length, xl = pairs[k - 1][0]; return {
  prompt: `A hold in the fuel depot has exactly ${n(c)} slots, and cargo pods come in two sizes: a small pod fills ${n(a)} slots and a large pod fills ${n(b)} slots. Mira fills every slot with x small pods and y large pods, using at least one of each, so ${n(a)}x + ${n(b)}y = ${n(c)} with x and y positive whole numbers. Enter how many different pairs (x, y) there are, then the largest x among them.`,
  answer: [k, xl],
  hints: ['There are whole-number solutions only when gcd(a, b) divides c. Once you have one solution, every other one comes from adding b ÷ gcd to x and taking a ÷ gcd from y.', 'Start from the smallest positive x that works, then keep shifting until y would drop below one. Count the pairs on the way, and read off the last x.'],
  solution: `gcd(${n(a)}, ${n(b)}) = ${n(g)}, which divides ${n(c)}, so there are solutions. The smallest positive x that leaves a multiple of ${n(b)} is x = ${n(x)}: ${n(c)} − ${n(a)} × ${n(x)} = ${n(c - a * x)} = ${n(b)} × ${n(y)}, so y = ${n(y)}. Every solution is x = ${n(x)} + ${n(sb)}t, y = ${n(y)} − ${n(sa)}t for a whole number t. y stays positive for t = 0 to ${n(k - 1)}, which gives the pairs ${list2(pairs)}: ${n(k)} pairs, and the largest x is ${n(xl)}.`,
  guidance: [
   { prompt: `What is gcd(${n(a)}, ${n(b)})? It must divide ${n(c)} for any solution to exist.`, answer: [g], explanation: g === 1 ? `gcd(${n(a)}, ${n(b)}) = 1, and 1 divides every whole number, so solutions exist.` : `gcd(${n(a)}, ${n(b)}) = ${n(g)}, and ${n(c)} = ${n(g)} × ${n(c / g)}, so solutions exist.` },
   { prompt: `What is the smallest positive x for which ${n(c)} − ${n(a)}x is a positive multiple of ${n(b)}, and what is y then?`, answer: [x, y], explanation: `${n(c)} − ${n(a)} × ${n(x)} = ${n(c - a * x)} = ${n(b)} × ${n(y)}, and no smaller positive x leaves a multiple of ${n(b)}.` },
   { prompt: `Each further solution adds ${n(sb)} to x and takes ${n(sa)} from y. How many pairs keep y at least 1, counting the first, and what is the largest x?`, answer: [k, xl], explanation: `The pairs are ${list2(pairs)}. One more shift would make y ${n(pairs[k - 1][1] - sa)}, which is not positive, so there are ${n(k)} pairs and the largest x is ${n(xl)}.` }
  ] }; }
});

/* Standard box a < bulk box b; the fewest boxes over all the pairs. */
mk({
 id: 'q08c', parent: 'q08', kind: 'applied', title: 'The pellet dispatch order',
 brief: 'A dispatch order for fuel pellets must be filled from full boxes of two sizes, and the loading team wants the lightest load of boxes.',
 labels: ['ways', 'fewest boxes'], tolerance: 0.01,
 gl: [['smallest x', 'y'], ['ways'], ['fewest boxes']]
}, {
 canonical: { a: 5, b: 8, c: 100 },
 draw: R => tries(() => { const a = R.int(3, 12); return { a, b: R.int(a + 1, 22), c: R.int(40, 260) }; },
  p => { const g = gcd(p.a, p.b); if (p.c % g !== 0 || p.b / g < 2 || p.a / g < 2) return false; const k = pairsOf(p.a, p.b, p.c).length;
   return k >= 2 && k <= 6 && !(p.a === 5 && p.b === 8 && p.c === 100); }, { a: 5, b: 8, c: 100 }),
 build: ({ a, b, c }) => { const g = gcd(a, b), sb = b / g, sa = a / g, pairs = pairsOf(a, b, c), [x, y] = pairs[0], k = pairs.length, tot = pairs.map(([u, v]) => u + v), best = Math.min(...tot); return {
  prompt: `A dispatch order is for exactly ${n(c)} fuel pellets, to be sent in full boxes of two kinds: a standard box holds ${n(a)} pellets and a bulk box holds ${n(b)} pellets. The order uses at least one box of each kind, so ${n(a)}x + ${n(b)}y = ${n(c)} with x standard boxes and y bulk boxes, both positive whole numbers. Mira wants to know how many different ways there are to fill the order, and the fewest boxes in all, x + y, that any of those ways uses. Enter the number of ways, then the fewest boxes.`,
  answer: [k, best],
  hints: ['Find the smallest positive x that leaves a multiple of the bulk box size, then list the other solutions by adding b ÷ gcd to x and taking a ÷ gcd from y, while y stays at least 1.', 'Work out x + y for each pair. The bulk box holds more than the standard box, so trading standard boxes for bulk boxes lowers the total number of boxes.'],
  solution: `gcd(${n(a)}, ${n(b)}) = ${n(g)}, which divides ${n(c)}. The smallest positive x that leaves a multiple of ${n(b)} is x = ${n(x)}: ${n(c)} − ${n(a)} × ${n(x)} = ${n(c - a * x)} = ${n(b)} × ${n(y)}. Each shift adds ${n(sb)} to x and takes ${n(sa)} from y, and y stays positive for ${n(k)} pairs: ${list2(pairs)}. Their totals x + y are ${tot.map(n).join(', ')}, so the fewest boxes is ${n(best)}.`,
  guidance: [
   { prompt: `What is the smallest positive x for which ${n(c)} − ${n(a)}x is a positive multiple of ${n(b)}, and what is y then?`, answer: [x, y], explanation: `${n(c)} − ${n(a)} × ${n(x)} = ${n(c - a * x)} = ${n(b)} × ${n(y)}, and no smaller positive x leaves a multiple of ${n(b)}.` },
   { prompt: `Each further solution adds ${n(sb)} to x and takes ${n(sa)} from y. How many pairs keep y at least 1, counting the first?`, answer: [k], explanation: `The pairs are ${list2(pairs)}. One more shift would make y ${n(pairs[k - 1][1] - sa)}, which is not positive, so there are ${n(k)} ways.` },
   { prompt: 'Add x and y for each pair. What is the smallest total number of boxes?', answer: [best], explanation: `The totals are ${tot.map(n).join(', ')}, and the smallest is ${n(best)}.` }
  ] }; }
});

/* Bigger numbers (c up to 3000), three to twelve positive solutions, gcd may be above 1; one solution from Bézout. */
mk({
 id: 'q08d', parent: 'q08', kind: 'challenge', uses: 'q07', title: 'The long cable run',
 brief: 'A long cable run must be laid from sections of two lengths, and the numbers are too big to try one pair at a time.',
 labels: ['pairs', 'smallest x', 'y'], tolerance: 0.01,
 gl: [['gcd'], ['smallest x', 'y'], ['pairs']]
}, {
 canonical: { a: 29, b: 22, c: 2950 },
 draw: R => tries(() => { const b = R.int(21, 60); return { a: R.int(b + 1, 70), b, c: R.int(800, 3000) }; },
  p => { const g = gcd(p.a, p.b); if (p.a === p.b || p.c % g !== 0 || p.a / g < 2 || p.b / g < 2) return false; const k = pairsOf(p.a, p.b, p.c).length;
   return k >= 3 && k <= 12 && !(p.a === 29 && p.b === 22 && p.c === 2950); }, { a: 29, b: 22, c: 2950 }),
 build: ({ a, b, c }) => { const r = bez(a, b, c), { g, sa, sb, m, x0, y0, X0, Y0, t } = r, pairs = pairsOf(a, b, c), [x, y] = pairs[0], k = pairs.length, lines = eLines(euclid(a, b).rows); return {
  prompt: `A relay cable run is exactly ${n(c)} m long and is laid from two kinds of cable section, one ${n(a)} m long and the other ${n(b)} m long, using at least one of each kind. With x sections of ${n(a)} m and y sections of ${n(b)} m, ${n(a)}x + ${n(b)}y = ${n(c)} with x and y positive whole numbers. The numbers are too big to try one pair at a time, so find one solution by working back up Euclid’s algorithm and scaling it, then shift it. Enter how many pairs (x, y) there are, then the smallest x, then the y that goes with it.`,
  answer: [k, x, y],
  hints: ['Run Euclid’s algorithm on the two section lengths and work back up its lines to write the gcd as a combination. Multiply that combination by the number of times the gcd goes into the run length to get a solution of the whole equation.', 'All solutions are that pair shifted by adding b ÷ gcd to x and taking a ÷ gcd from y. Bring x to its smallest positive value, then shift step by step and count the pairs for which y is still at least 1.'],
  solution: `Euclid’s algorithm: ${lines}, so the gcd is ${n(g)}, which divides ${n(c)}${g === 1 ? '' : ` (${n(c)} = ${n(m)} × ${n(g)})`}. Working back up the lines gives ${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}, so ${n(c)} = ${n(a)} × ${par(X0)} + ${n(b)} × ${par(Y0)}. Moving x by multiples of ${n(sb)} and y the other way by multiples of ${n(sa)} keeps the total, so bring x into the range 1 to ${n(sb)}: the smallest positive x is ${n(x)}, with y = (${n(c)} − ${n(a)} × ${n(x)}) ÷ ${n(b)} = ${n(y)}. Each further solution adds ${n(sb)} to x and takes ${n(sa)} from y, and y stays at least 1 for ${n(k)} pairs in all, the last being (${n(pairs[k - 1][0])}, ${n(pairs[k - 1][1])}).`,
  guidance: [
   { prompt: `Run Euclid’s algorithm on ${n(a)} and ${n(b)}. What is their gcd?`, answer: [g], explanation: `${lines}. The last remainder that is not 0 is ${n(g)}, ${g === 1 ? 'and 1 divides every whole number' : `and ${n(c)} = ${n(g)} × ${n(m)}`}, so solutions exist.` },
   { prompt: `Find one solution of ${n(a)}x + ${n(b)}y = ${n(c)} by working back and scaling, then shift it to the smallest positive x. What are x and y?`, answer: [x, y], explanation: `${n(g)} = ${n(a)} × ${par(x0)} + ${n(b)} × ${par(y0)}. Multiplying by ${n(m)} gives ${n(c)} = ${n(a)} × ${par(X0)} + ${n(b)} × ${par(Y0)}. Moving x by multiples of ${n(sb)} (and y the other way by multiples of ${n(sa)}) keeps the total, so the smallest positive x is ${n(X0)} brought into the range 1 to ${n(sb)} by multiples of ${n(sb)}, which is ${n(x)}. Then y = (${n(c)} − ${n(a)} × ${n(x)}) ÷ ${n(b)} = ${n(y)}.` },
   { prompt: `Each further solution adds ${n(sb)} to x and takes ${n(sa)} from y. How many pairs keep y at least 1, counting the first?`, answer: [k], explanation: `Starting from y = ${n(y)} and taking ${n(sa)} each time, y stays at least 1 for ${n(k)} pairs; one more shift would make it ${n(pairs[k - 1][1] - sa)}.` }
  ] }; }
});

/* ---- q09 Counting divisors τ(n) [R4.2] ---- */

const P4 = [2, 3, 5, 7];
const tau4 = es => es.reduce((t, e) => t * (e + 1), 1);
const num4 = es => es.reduce((v, e, i) => v * POW(P4[i], e), 1);
const pairs4 = es => P4.map((p, i) => [p, es[i]]);
const exps4 = es => `${es.map(e => n(e)).join(', ')}`;

/* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ from 60 to 10000 with two primes or more, and a factorised M = r^u × s^v × t^w. Not the q09 example (720; 11³ × 13) or its worked example (12). */
mk({
 id: 'q09b', parent: 'q09', kind: 'setting', title: 'Rows for the seed trays',
 brief: 'Seed trays are laid out in equal rows, and the greenhouse planner wants to know how many row lengths would work.',
 labels: ['row lengths', 'row lengths (second tray)'], tolerance: 0.01,
 gl: [['a', 'b', 'c', 'd'], ['row lengths'], ['row lengths (second tray)']]
}, {
 canonical: { a: 3, b: 1, c: 2, d: 1, r: 11, u: 2, s: 17, v: 1, t: 23, w: 1 },
 draw: R => tries(() => ({ a: R.int(0, 5), b: R.int(0, 3), c: R.int(0, 2), d: R.int(0, 2), r: R.pick([11, 13]), u: R.int(1, 3), s: R.pick([17, 19]), v: R.int(1, 3), t: R.pick([23, 29]), w: R.int(1, 2) }),
  p => { const e = [p.a, p.b, p.c, p.d], k = num4(e); return k >= 60 && k <= 10000 && e.filter(x => x > 0).length >= 2 && k !== 720 && k !== 12 && !(p.a === 3 && p.b === 1 && p.c === 2 && p.d === 1 && p.r === 11 && p.u === 2 && p.s === 17 && p.v === 1 && p.t === 23 && p.w === 1); },
  { a: 3, b: 1, c: 2, d: 1, r: 11, u: 2, s: 17, v: 1, t: 23, w: 1 }),
 build: ({ a, b, c, d, r, u, s, v, t, w }) => { const es = [a, b, c, d], k = num4(es), E = pairs4(es).filter(([, e]) => e > 0), tau = tau4(es), M = fact([[r, u], [s, v], [t, w]]), tm = (u + 1) * (v + 1) * (w + 1);
  const work = `${E.map(([, e]) => `(${n(e)} + 1)`).join(' × ')} = ${E.map(([, e]) => n(e + 1)).join(' × ')} = ${n(tau)}`; return {
  prompt: `The seed vault lays out a tray of ${n(k)} seedlings in equal rows: every row holds the same number of seedlings, and every seedling is used. Any row length that divides ${n(k)} works, from rows of 1 up to a single row of all ${n(k)}. Enter τ(${n(k)}), the number of row lengths that work. A second tray holds ${M} seedlings, written as its prime factorisation: enter its number of possible row lengths too.`,
  answer: [tau, tm],
  hints: ['A row length is a divisor, and a divisor picks an exponent for each prime, anywhere from zero up to that prime’s exponent in the number. So a prime with exponent e gives one more than e choices.', 'Multiply the numbers of choices for all the primes together. The second tray is already factorised, so read its exponents directly.'],
  solution: `${n(k)} = ${fact(E)}, so τ(${n(k)}) = ${work}. For ${M}, the number of row lengths is (${n(u)} + 1) × (${n(v)} + 1) × (${n(w)} + 1) = ${n(u + 1)} × ${n(v + 1)} × ${n(w + 1)} = ${n(tm)}.`,
  guidance: [
   { prompt: `Write ${n(k)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are a, b, c and d?`, answer: es, explanation: `${n(k)} = ${fact(E)}, so the exponents are ${exps4(es)}.` },
   { prompt: `Add 1 to each exponent that is not 0 and multiply. What is τ(${n(k)})?`, answer: [tau], explanation: `τ(${n(k)}) = ${work}. Each divisor is one way of choosing the exponents.` },
   { prompt: `Do the same for ${M}. How many row lengths does the second tray allow?`, answer: [tm], explanation: `The exponents are ${n(u)}, ${n(v)} and ${n(w)}, so there are ${n(u + 1)} × ${n(v + 1)} × ${n(w + 1)} = ${n(tm)} row lengths.` }
  ] }; }
});

/* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ with a ≥ 1 and an odd prime, up to 10000: all crate sizes, and the odd ones. */
mk({
 id: 'q09c', parent: 'q09', kind: 'applied', title: 'Odd crate sizes only',
 brief: 'A delivery of tins must be crated in equal crates, but the store has labels for odd crate sizes only.',
 labels: ['crate sizes', 'odd crate sizes'], tolerance: 0.01,
 gl: [['a', 'b', 'c', 'd'], ['crate sizes'], ['odd crate sizes']]
}, {
 canonical: { a: 3, b: 2, c: 1, d: 1 },
 draw: R => tries(() => ({ a: R.int(1, 5), b: R.int(0, 3), c: R.int(0, 2), d: R.int(0, 2) }),
  p => { const e = [p.a, p.b, p.c, p.d], k = num4(e); return k >= 60 && k <= 10000 && e.slice(1).some(x => x > 0) && k !== 720 && k !== 12 && !(p.a === 3 && p.b === 2 && p.c === 1 && p.d === 1); }, { a: 3, b: 2, c: 1, d: 1 }),
 build: ({ a, b, c, d }) => { const es = [a, b, c, d], k = num4(es), E = pairs4(es).filter(([, e]) => e > 0), tau = tau4(es), od = (b + 1) * (c + 1) * (d + 1), O = E.filter(([p]) => p > 2);
  const work = `${E.map(([, e]) => `(${n(e)} + 1)`).join(' × ')} = ${E.map(([, e]) => n(e + 1)).join(' × ')} = ${n(tau)}`, workO = `${O.map(([, e]) => `(${n(e)} + 1)`).join(' × ')} = ${O.map(([, e]) => n(e + 1)).join(' × ')} = ${n(od)}`; return {
  prompt: `A delivery of ${n(k)} tins is to be crated so that every crate holds the same number of tins and no tins are left over. A crate size is any whole number of tins that divides ${n(k)}. The store has labels only for odd crate sizes, so Mira can use only crate sizes that are odd numbers. Enter τ(${n(k)}), the number of crate sizes of any kind, then how many of those crate sizes are odd.`,
  answer: [tau, od],
  hints: ['Write the number as a product of prime powers. A crate size picks an exponent for each prime, from zero up to that prime’s exponent, so the number of crate sizes is the product of (exponent + 1) over the primes.', 'A crate size is odd exactly when it has no factor 2, so the exponent of 2 must be 0: for that prime there is only one choice. Multiply the choices for the other primes only.'],
  solution: `${n(k)} = ${fact(E)}, so τ(${n(k)}) = ${work}. An odd crate size has no factor 2, so the prime 2 has just one choice, exponent 0, and the other primes are as before: ${workO} odd crate sizes.`,
  guidance: [
   { prompt: `Write ${n(k)} = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ. What are a, b, c and d?`, answer: es, explanation: `${n(k)} = ${fact(E)}, so the exponents are ${exps4(es)}.` },
   { prompt: `Add 1 to each exponent that is not 0 and multiply. What is τ(${n(k)}), the number of crate sizes of any kind?`, answer: [tau], explanation: `τ(${n(k)}) = ${work}.` },
   { prompt: `Now an odd crate size must use exponent 0 for the prime 2. Multiply the choices for the other primes only. How many crate sizes are odd?`, answer: [od], explanation: `${workO}. The factor ${n(a + 1)} for the prime 2 is left out, because only exponent 0 is allowed.` }
  ] }; }
});

/* n with primes up to 13 (at least three, one of 11 or 13), 2000 to 99999, given as a plain number; m a small divisor of n with n ÷ m ≥ 3. */
const P6 = [2, 3, 5, 7, 11, 13], M9 = [6, 10, 12, 14, 15, 18, 20, 21, 22, 26, 30, 33, 35, 39, 42, 44, 45, 52, 55, 65, 66, 77, 78];
const num6 = es => es.reduce((v, e, i) => v * POW(P6[i], e), 1);
const tau6 = es => es.reduce((t, e) => t * (e + 1), 1);
mk({
 id: 'q09d', parent: 'q09', kind: 'challenge', uses: 'q04', title: 'The big bolt consignment',
 brief: 'A large consignment of bolts must be sorted into crates of one size, and the store wants to know how many of those sizes are multiples of a given size.',
 labels: ['crate sizes', 'crate sizes that are multiples'], tolerance: 0.01,
 gl: [['crate sizes'], ['the quotient'], ['crate sizes that are multiples']]
}, {
 canonical: { a: 3, b: 2, c: 1, d: 0, e: 1, f: 1, m: 12 },
 draw: R => tries(() => { const es = [R.int(0, 5), R.int(0, 3), R.int(0, 2), R.int(0, 1), R.int(0, 2), R.int(0, 1)], k = num6(es), ms = M9.filter(x => k % x === 0 && k / x >= 3);
   return { a: es[0], b: es[1], c: es[2], d: es[3], e: es[4], f: es[5], m: ms.length ? R.pick(ms) : 0 }; },
  p => { const es = [p.a, p.b, p.c, p.d, p.e, p.f], k = num6(es); return p.m > 0 && k >= 2000 && k <= 99999 && es.filter(x => x > 0).length >= 3 && p.e + p.f >= 1 && !(k === 51480 && p.m === 12); },
  { a: 3, b: 2, c: 1, d: 0, e: 1, f: 1, m: 12 }),
 build: ({ a, b, c, d, e, f, m }) => { const es = [a, b, c, d, e, f], k = num6(es), q = k / m, tq = tau6(es), tm = (() => { let r = q, t = 1; P6.forEach(p => { let x = 0; while (r % p === 0) { r /= p; x++; } t *= x + 1; }); return t; })(), E = P6.map((p, i) => [p, es[i]]).filter(([, x]) => x > 0);
  const work = `${E.map(([, x]) => `(${n(x)} + 1)`).join(' × ')} = ${E.map(([, x]) => n(x + 1)).join(' × ')} = ${n(tq)}`; return {
  prompt: `A big consignment has ${n(k)} bolts. The bolt store sorts them into crates that all hold the same number of bolts, with none left over, so a crate size is any whole number that divides ${n(k)}, from 1 up to ${n(k)}. Factorise ${n(k)} first. Enter τ(${n(k)}), the number of crate sizes, then how many of those crate sizes are multiples of ${n(m)}.`,
  answer: [tq, tm],
  hints: ['Factorise the number into primes by trial division, then multiply (exponent + 1) over all its primes to count the crate sizes.', 'A crate size that is a multiple of m can be written as m × d, where d divides n ÷ m, and different d give different sizes. So count the divisors of n ÷ m.'],
  solution: `${n(k)} = ${fact(E)}, so τ(${n(k)}) = ${work}. A crate size that is a multiple of ${n(m)} is ${n(m)} × d with d a divisor of ${n(k)} ÷ ${n(m)} = ${n(q)}, and each d gives a different size. ${n(q)} = ${fact(P6.map(p => { let r = q, x = 0; while (r % p === 0) { r /= p; x++; } return [p, x]; }))}, so it has ${tm} divisors, and ${n(tm)} crate sizes are multiples of ${n(m)}.`,
  guidance: [
   { prompt: `Factorise ${n(k)} into primes and add 1 to each exponent. What is τ(${n(k)})?`, answer: [tq], explanation: `${n(k)} = ${fact(E)}, so τ(${n(k)}) = ${work}.` },
   { prompt: `A crate size that is a multiple of ${n(m)} is ${n(m)} × d, where d divides ${n(k)} ÷ ${n(m)}. What is ${n(k)} ÷ ${n(m)}?`, answer: [q], explanation: `${n(k)} ÷ ${n(m)} = ${n(q)}.` },
   { prompt: `How many divisors does ${n(q)} have? That is the number of crate sizes that are multiples of ${n(m)}.`, answer: [tm], explanation: `${n(q)} = ${fact(P6.map(p => { let r = q, x = 0; while (r % p === 0) { r /= p; x++; } return [p, x]; }))}, so it has ${n(tm)} divisors.` }
  ] }; }
});

/* ---- q10 Adding divisors σ(n); multiplicative functions [R4.1, R4.2] ---- */

/* n = p^a × q^b (p < q from 2, 3, 5, 7); m = r^u × s^v and j = t^w with no prime in common, σ(m) given. Not the q10 example (72; 8 and 25) or its worked example (12; 4 and 9). */
mk({
 id: 'q10b', parent: 'q10', kind: 'setting', title: 'The ration shelf',
 brief: 'The ration shelf keeps one tray for every size that divides a number, and the stock clerk wants the total it holds.',
 labels: ['litres on the shelf', 'σ of the product'], tolerance: 0.01,
 gl: [['σ of the first prime power'], ['σ of the second prime power'], ['litres on the shelf']]
}, {
 canonical: { p: 2, a: 4, q: 5, b: 1, r: 3, u: 2, s: 7, v: 1, t: 2, w: 3 },
 draw: R => tries(() => { const pq = R.pick([[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [5, 7]]), tt = R.pick([2, 3, 5, 7, 11, 13]), rest = [2, 3, 5, 7, 11, 13].filter(x => x !== tt), r = R.pick(rest), s = R.pick(rest.filter(x => x !== r));
   return { p: pq[0], a: R.int(1, 4), q: pq[1], b: R.int(1, 2), r, u: R.int(1, 2), s, v: R.int(1, 2), t: tt, w: R.int(1, 3) }; },
  p => { const k = POW(p.p, p.a) * POW(p.q, p.b), m = POW(p.r, p.u) * POW(p.s, p.v), j = POW(p.t, p.w); return k <= 2000 && k !== 72 && k !== 12 && m <= 400 && j <= 400 && m * j <= 5000 && p.r < p.s && !(p.p === 2 && p.a === 4 && p.q === 5 && p.b === 1 && p.r === 3 && p.u === 2 && p.s === 7 && p.v === 1 && p.t === 2 && p.w === 3); },
  { p: 2, a: 4, q: 5, b: 1, r: 3, u: 2, s: 7, v: 1, t: 2, w: 3 }),
 build: ({ p, a, q, b, r, u, s, v, t, w }) => { const k = POW(p, a) * POW(q, b), s1 = sigmaPP(p, a), s2 = sigmaPP(q, b), S = s1 * s2, m = POW(r, u) * POW(s, v), j = POW(t, w), sm = sigmaPP(r, u) * sigmaPP(s, v), sj = sigmaPP(t, w), T = sm * sj; return {
  prompt: `The ration shelf in the fuel depot keeps one tray for every whole number of litres that divides ${n(k)}: one tray of each such size, up to a single tray of ${n(k)} litres. Enter σ(${n(k)}), the litres that all the trays hold together. Then the stock log gives σ(${n(m)}) = ${n(sm)} and σ(${n(j)}) = ${n(sj)}, and ${n(m)} and ${n(j)} have no prime factor in common. Enter σ(${n(m * j)}). Type both without commas.`,
  answer: [S, T],
  hints: ['For a prime power, σ is the sum of all the powers of the prime from the zeroth up to that one.', 'σ is multiplicative: when two numbers share no prime factor, σ of their product is the product of their σ values.'],
  solution: `${n(k)} = ${fact([[p, a], [q, b]])}. σ(${fact([[p, a]])}) = ${powSum(p, a)} = ${n(s1)} and σ(${fact([[q, b]])}) = ${powSum(q, b)} = ${n(s2)}. The two prime powers share no prime factor, so σ(${n(k)}) = ${n(s1)} × ${n(s2)} = ${n(S)}. ${n(m)} and ${n(j)} share no prime factor either, so σ(${n(m * j)}) = σ(${n(m)}) × σ(${n(j)}) = ${n(sm)} × ${n(sj)} = ${n(T)}.`,
  guidance: [
   { prompt: `What is σ(${fact([[p, a]])}), the sum ${powSum(p, a)}?`, answer: [s1], explanation: `The divisors of ${fact([[p, a]])} are its powers ${powSum(p, a).split(' + ').join(', ')}, which add up to ${n(s1)}.` },
   { prompt: `What is σ(${fact([[q, b]])})?`, answer: [s2], explanation: `${powSum(q, b)} = ${n(s2)}.` },
   { prompt: `${n(k)} = ${fact([[p, a]])} × ${fact([[q, b]])}, and the two share no prime factor. What is σ(${n(k)}), the litres on the shelf?`, answer: [S], explanation: `Each divisor of ${n(k)} is a divisor of ${fact([[p, a]])} times a divisor of ${fact([[q, b]])}, so the sum of them all is ${n(s1)} × ${n(s2)} = ${n(S)}.` }
  ] }; }
});

/* N = p^a × q^b × r^c, three primes from 2 … 13, up to 6000; asked σ(N) and τ(N). */
const P10 = [2, 3, 5, 7, 11, 13];
mk({
 id: 'q10c', parent: 'q10', kind: 'applied', title: 'The rack room',
 brief: 'The rack room has one rack for every size that divides the stock number, and the clerk needs the cans on all racks and the number of racks.',
 labels: ['cans in all', 'racks'], tolerance: 0.01,
 gl: [['σ of the first prime power', 'σ of the second prime power', 'σ of the third prime power'], ['cans in all'], ['racks']]
}, {
 canonical: { p: 2, a: 2, q: 5, b: 2, r: 7, c: 1 },
 draw: R => tries(() => { const ps = R.pick([[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7], [2, 3, 11], [2, 5, 11], [2, 3, 13], [2, 7, 11], [3, 5, 11], [2, 5, 13]]);
   return { p: ps[0], a: R.int(1, 4), q: ps[1], b: R.int(1, 3), r: ps[2], c: R.int(1, 2) }; },
  p => { const k = POW(p.p, p.a) * POW(p.q, p.b) * POW(p.r, p.c); return k <= 6000 && k >= 100 && !(p.p === 2 && p.a === 2 && p.q === 5 && p.b === 2 && p.r === 7 && p.c === 1); },
  { p: 2, a: 2, q: 5, b: 2, r: 7, c: 1 }),
 build: ({ p, a, q, b, r, c }) => { const k = POW(p, a) * POW(q, b) * POW(r, c), s1 = sigmaPP(p, a), s2 = sigmaPP(q, b), s3 = sigmaPP(r, c), S = s1 * s2 * s3, T = (a + 1) * (b + 1) * (c + 1); return {
  prompt: `The rack room of the fuel depot has one rack for every whole number that divides the stock number ${fact([[p, a], [q, b], [r, c]])}, and each rack holds as many cans as its number. Enter σ(${fact([[p, a], [q, b], [r, c]])}), the number of cans on all the racks together, then the number of racks. The three prime powers share no prime factor. Type both without commas.`,
  answer: [S, T],
  hints: ['σ is multiplicative: when numbers share no prime factor, σ of their product is the product of their σ values. Apply it to each prime power, and for a prime power add the powers of the prime from the zeroth up to that one.', 'The number of racks is the number of divisors: multiply (exponent + 1) over the primes.'],
  solution: `The number is ${fact([[p, a], [q, b], [r, c]])}. σ(${fact([[p, a]])}) = ${powSum(p, a)} = ${n(s1)}, σ(${fact([[q, b]])}) = ${powSum(q, b)} = ${n(s2)} and σ(${fact([[r, c]])}) = ${powSum(r, c)} = ${n(s3)}. The three share no prime factor, so the cans in all are ${n(s1)} × ${n(s2)} × ${n(s3)} = ${n(S)}. The number of racks is (${n(a)} + 1) × (${n(b)} + 1) × (${n(c)} + 1) = ${n(a + 1)} × ${n(b + 1)} × ${n(c + 1)} = ${n(T)}.`,
  guidance: [
   { prompt: `What are σ(${fact([[p, a]])}), σ(${fact([[q, b]])}) and σ(${fact([[r, c]])}), the sums of the powers of each prime from the zeroth up to its exponent?`, answer: [s1, s2, s3], explanation: `${powSum(p, a)} = ${n(s1)}, ${powSum(q, b)} = ${n(s2)} and ${powSum(r, c)} = ${n(s3)}.` },
   { prompt: `The three prime powers share no prime factor. Multiply their σ values: how many cans are on all the racks?`, answer: [S], explanation: `${n(s1)} × ${n(s2)} × ${n(s3)} = ${n(S)}. Multiplicativity applies twice: first to two of the prime powers, then to that product and the third.` },
   { prompt: 'Each rack is one divisor. Add 1 to each exponent and multiply. How many racks are there?', answer: [T], explanation: `(${n(a)} + 1) × (${n(b)} + 1) × (${n(c)} + 1) = ${n(a + 1)} × ${n(b + 1)} × ${n(c + 1)} = ${n(T)} racks.` }
  ] }; }
});

/* n = 2ᵃ × 3ᵇ × 5ᶜ × 7ᵈ × 11ᵉ, given as a plain number from 1000 to 30000 with a ≥ 1 and two odd primes: σ(n) and the sum of the odd divisors. */
const P5 = [2, 3, 5, 7, 11];
const num5 = es => es.reduce((v, e, i) => v * POW(P5[i], e), 1);
mk({
 id: 'q10d', parent: 'q10', kind: 'challenge', uses: 'q04', title: 'Cans of odd litres',
 brief: 'The depot keeps one can of every size that divides a large stock number, and the store wants the total in the cans of odd sizes alone.',
 labels: ['litres in all', 'litres in odd-sized cans'], tolerance: 0.01,
 gl: [['exponent of 2', 'odd part'], ['litres in all'], ['litres in odd-sized cans']]
}, {
 canonical: { a: 3, b: 2, c: 1, d: 1, e: 0 },
 draw: R => tries(() => ({ a: R.int(1, 5), b: R.int(0, 3), c: R.int(0, 2), d: R.int(0, 2), e: R.int(0, 1) }),
  p => { const es = [p.a, p.b, p.c, p.d, p.e], k = num5(es); return k >= 1000 && k <= 30000 && P5.reduce((t, pr, i) => t * sigmaPP(pr, es[i]), 1) <= 99999 && es.slice(1).filter(x => x > 0).length >= 2 && !(p.a === 3 && p.b === 2 && p.c === 1 && p.d === 1 && p.e === 0); },
  { a: 3, b: 2, c: 1, d: 1, e: 0 }),
 build: ({ a, b, c, d, e }) => { const es = [a, b, c, d, e], k = num5(es), E = P5.map((p, i) => [p, es[i]]).filter(([, x]) => x > 0), O = E.filter(([p]) => p > 2), odd = k / POW(2, a),
  sg = E.map(([p, x]) => sigmaPP(p, x)), S = sg.reduce((u, v) => u * v, 1), so = O.map(([p, x]) => sigmaPP(p, x)).reduce((u, v) => u * v, 1);
  const parts = E.map(([p, x]) => `σ(${fact([[p, x]])}) = ${n(sigmaPP(p, x))}`).join(', '), prod = sg.map(n).join(' × '), prodO = O.map(([p, x]) => n(sigmaPP(p, x))).join(' × '); return {
  prompt: `The fuel depot keeps one can of every size, in litres, that divides ${n(k)}: one can for each divisor, up to a single can of ${n(k)} litres. Factorise ${n(k)} first. Enter σ(${n(k)}), the litres that all the cans hold together, then the litres held by only the cans whose size is an odd number of litres. Type both without commas.`,
  answer: [S, so],
  hints: ['Factorise by trial division. Then σ of a product of prime powers with no prime in common is the product of the σ values, and σ of a prime power is the sum of the powers of the prime from the zeroth up to that one.', 'A divisor is odd exactly when it has no factor 2, so the odd divisors of the number are the divisors of its odd part: the number with every factor 2 taken out.'],
  solution: `${n(k)} = ${fact(E)}. ${parts}. The prime powers share no prime factor, so σ(${n(k)}) = ${prod} = ${n(S)}. The odd-sized cans are the divisors of the odd part ${n(odd)} = ${fact(O)}, so they hold ${prodO} = ${n(so)} litres.`,
  guidance: [
   { prompt: `Factorise ${n(k)}. What is the exponent of 2, and what is the odd part, the number left when every factor 2 is taken out?`, answer: [a, odd], explanation: `${n(k)} = ${fact(E)}, so the exponent of 2 is ${n(a)}, and with the ${n(POW(2, a))} taken out the odd part is ${n(odd)}.` },
   { prompt: `Use σ of each prime power and multiply. What is σ(${n(k)})?`, answer: [S], explanation: `${parts}. The prime powers share no prime factor, so σ(${n(k)}) = ${prod} = ${n(S)}.` },
   { prompt: `The odd-sized cans are the divisors of ${n(odd)}. What is σ(${n(odd)})?`, answer: [so], explanation: `${n(odd)} = ${fact(O)}, so σ(${n(odd)}) = ${prodO} = ${n(so)}.` }
  ] }; }
});

})();
