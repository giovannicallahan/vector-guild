/* Topology: shape without size practice missions, file 1 of 8: concepts q01–q05, three practice missions each
   (q01b q01c q01d q02b q02c q02d q03b q03c q03d q04b q04c q04d q05b q05c q05d).
   Format and rules: docs/PACK-FORMAT.md, "Practice missions" (§10).
     b  kind 'setting'    the same skill in a new real-world setting
     c  kind 'applied'    a word problem with two or three steps (two or three guided steps)
     d  kind 'challenge'  harder numbers, or the skill combined with one earlier concept (optional `uses: 'qNN'`)
   A practice mission supplies only: id, parent, kind, title, brief, prompt, answer, labels, tolerance, hints,
   solution, guidance (and `uses` for a challenge). Everything else comes from its parent, the learn mission:
   topic, tier, xp, sector, lesson, teaching, sources, the concept bench and the review drill. Do not write those.
   Each mission is registered together with its generator by add(mission, generator); build(canonical) must
   reproduce the authored prompt, hints, solution and guidance exactly. Oracles: qa/realms/topo/oracle-p1.js. */
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
  guidance: b.guidance.map((g, i) => ({ prompt: g.prompt, answer: g.answer, labels: [].concat(gl[i]), explanation: g.explanation })) }, gen);
};
/* Bounded retry: try make() up to 1000 times until ok(p); otherwise fall back to the canonical parameters. */
const tryDraw = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return JSON.parse(JSON.stringify(canonical)); };
const f2 = x => x.toFixed(2).replace('-', '−');
/* True when x sits within 0.05 of a step of a rounding tie at k places. */
const edge = (x, k) => { const s = Math.abs(x) * Math.pow(10, k), f = s - Math.floor(s); return Math.abs(f - 0.5) < 0.05; };
const plural = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
const joinAnd = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
/* The gap |u − v| as written in a solution: |7 − 2| or |3 − (−1)|. */
const gap = (u, v) => `|${n(u)} − ${par(v)}|`;
const pt = (x, y) => `(${n(x)}, ${n(y)})`;
/* Whole-number counts of grid points: taxicab at most k, maximum at most k. */
const taxiCount = k => 2 * k * k + 2 * k + 1;
const maxCount = k => (2 * k + 1) * (2 * k + 1);
/* The running sum as written in a solution: 1, 1 + 2, 1 + 2 + 3, 1 + 2 + … + 5. */
const run = k => k === 1 ? '1' : k === 2 ? '1 + 2' : k === 3 ? '1 + 2 + 3' : `1 + 2 + … + ${n(k)}`;

/* Stretches of a line, for q05: pieces [a, b, ca, cb] (ca, cb are 1 for a closed end) and lone points. All ends are whole
   numbers, so a point 0.25 either side of an end lies in the same open stretch as the points just beside it. */
const setText = ({ pieces, pts }) => [...pieces.map(([a, b, ca, cb]) => `${ca ? '[' : '('}${n(a)}, ${n(b)}${cb ? ']' : ')'}`), ...pts.map(e => `{${n(e)}}`)].join(' ∪ ');
const analyse = ({ pieces, pts }) => {
 const inS = x => pts.includes(x) || pieces.some(([a, b, ca, cb]) => (x > a && x < b) || (x === a && ca) || (x === b && cb));
 const cand = [...new Set([...pieces.flatMap(([a, b]) => [a, b]), ...pts])].sort((u, v) => u - v);
 const info = cand.map(p => { const at = inS(p), left = inS(p - 0.25), right = inS(p + 0.25);
  return { p, at, left, right, interior: at && left && right, boundary: !(at && left && right) && (at || left || right) }; });
 const bd = info.filter(i => i.boundary), notIn = info.find(i => i.at && !i.interior), missing = bd.find(i => !i.at);
 return { inS, cand, info, bd, k: bd.length, out: bd.filter(i => !i.at).length, open: notIn ? 0 : 1, closed: missing ? 0 : 1, notIn, missing };
};
const sayPoint = i => i.boundary ? (i.at ? `${n(i.p)} is in S, but every ball round it also holds points outside S, so it is a boundary point.` : `${n(i.p)} is not in S, but every ball round it meets S, so it is a boundary point.`)
 : `${n(i.p)} is in S and a small ball round it stays in S, so it is an interior point, not a boundary point.`;
const openWhy = S => S.open ? 'Every point of S is an interior point, so S is open.' : `${n(S.notIn.p)} is in S but is not an interior point, so S is not open.`;
const closedWhy = S => S.closed ? 'Every boundary point is in S, so S is closed.' : `The boundary point ${n(S.missing.p)} is not in S, so S is not closed.`;
/* Random brackets: mode picks all open, all closed or mixed. Where two stretches share an end it is never closed in both. */
const brackets = (R, m, mode) => { const ends = []; for (let i = 0; i < m * 2; i++) ends.push(mode === 0 ? 0 : mode === 1 ? 1 : R.int(0, 1)); return ends; };
const makePieces = (R, m, start, touchChance, mode) => { const br = brackets(R, m, mode), pieces = []; let at = start;
 for (let i = 0; i < m; i++) { const a = at, b = a + R.int(1, 4); pieces.push([a, b, br[2 * i], br[2 * i + 1]]);
  const touch = mode !== 1 && R.next() < touchChance; at = touch ? b : b + R.int(1, 3); }
 for (let i = 1; i < m; i++) if (pieces[i][0] === pieces[i - 1][1] && pieces[i][2] && pieces[i - 1][3]) pieces[i][2] = 0;
 return pieces; };

/* ---- q01 Three ways to measure distance [L 8.1] ---- */

mk({
 id: 'q01b', parent: 'q01', kind: 'setting', title: 'The greenhouse tray run',
 brief: 'A seed-tray robot must reach another bay of the greenhouse floor, and the planners cost the trip three ways.',
 labels: ['maximum distance (m)', 'taxicab distance (m)', 'Euclidean distance (m)'], tolerance: 0.005,
 gl: [['gap across (m)', 'gap up (m)', 'maximum distance (m)', 'taxicab distance (m)', 'Euclidean distance (m)']][0]
}, {
 /* Gaps differ, are not 3 and 4 (the q01 worked example), and the Euclidean distance is not near a rounding tie. */
 canonical: { x1: 2, y1: 7, x2: 7, y2: 4 },
 draw: R => tryDraw(() => ({ x1: R.int(-5, 8), y1: R.int(-5, 8), x2: R.int(-5, 8), y2: R.int(-5, 8) }),
  p => { const g = Math.abs(p.x2 - p.x1), h = Math.abs(p.y2 - p.y1), s = Math.sqrt(g * g + h * h);
   return g >= 1 && h >= 1 && g !== h && !(g === 3 && h === 4) && !(g === 4 && h === 3) && !edge(s, 2); }, { x1: 2, y1: 7, x2: 7, y2: 4 }),
 build: ({ x1, y1, x2, y2 }) => { const g = Math.abs(x2 - x1), h = Math.abs(y2 - y1), mx = Math.max(g, h), tx = g + h, sq = g * g + h * h, s = Math.sqrt(sq), e2 = Math.round(s * 100) / 100; return {
  prompt: `A seed-tray robot stands at bay P = ${pt(x1, y1)} of the greenhouse floor and has to reach bay Q = ${pt(x2, y2)}, with coordinates in metres. A gantry whose two motors run together at the same speed is timed by the maximum distance. A rail cart that must keep to the floor rails covers the taxicab distance. A cable pulled tight in a straight line covers the Euclidean distance. Enter the maximum distance, then the taxicab distance, then the Euclidean distance to 2 decimal places, all in metres.`,
  answer: [mx, tx, e2],
  hints: ['Find the gap across, the difference of the x coordinates without its sign, and the gap up, the same for the y coordinates. All three distances are built from those two gaps.', 'Maximum: the larger of the two gaps. Taxicab: the sum of the two gaps. Euclidean: the square root of the sum of the squared gaps, rounded only at the end.'],
  solution: `The gap across is ${gap(x2, x1)} = ${n(g)} and the gap up is ${gap(y2, y1)} = ${n(h)}. Maximum: the larger of ${n(g)} and ${n(h)}, which is ${n(mx)} m. Taxicab: ${n(g)} + ${n(h)} = ${n(tx)} m. Euclidean: √(${n(g)}² + ${n(h)}²) = √${n(sq)} ≈ ${n(Math.round(s * 10000) / 10000)}, which is ${f2(s)} m to 2 decimal places.`,
  guidance: [
   { prompt: `What is the gap across, ${gap(x2, x1)}?`, answer: [g], explanation: `${gap(x2, x1)} = ${n(g)}. A distance never has a sign, so the gap is taken without one.` },
   { prompt: `What is the gap up, ${gap(y2, y1)}?`, answer: [h], explanation: `${gap(y2, y1)} = ${n(h)}.` },
   { prompt: `What is the maximum distance, the larger of the two gaps?`, answer: [mx], explanation: `The larger of ${n(g)} and ${n(h)} is ${n(mx)}.` },
   { prompt: `What is the taxicab distance, the sum of the two gaps?`, answer: [tx], explanation: `${n(g)} + ${n(h)} = ${n(tx)}.` },
   { prompt: `Square the two gaps, add them and take the square root. What is the Euclidean distance, to 2 decimal places?`, answer: [e2], explanation: `${n(g)}² + ${n(h)}² = ${n(g * g)} + ${n(h * h)} = ${n(sq)}, and √${n(sq)} ≈ ${n(Math.round(s * 10000) / 10000)}, which is ${f2(s)} to 2 decimal places.` }
  ] }; }
});

mk({
 id: 'q01c', parent: 'q01', kind: 'applied', title: 'Rover leg against drone hop',
 brief: 'The depot supply run goes by rover through the pump station, and mission control wants it set against a direct drone hop.',
 labels: ['rover total (km)', 'drone distance (km)', 'extra rover distance (km)'], tolerance: 0.01,
 gl: [['taxicab distance, base to pump (km)', 'taxicab distance, pump to mast (km)', 'maximum distance, base to mast (km)']][0]
}, {
 /* The rover legs and the drone hop use coordinates of both signs; the rover always drives at least 2 km more than the drone count. */
 canonical: { bx: 1, by: 2, px: 6, py: 3, qx: 4, qy: 8 },
 draw: R => tryDraw(() => ({ bx: R.int(-4, 5), by: R.int(-4, 5), px: R.int(-4, 9), py: R.int(-4, 9), qx: R.int(-4, 9), qy: R.int(-4, 9) }),
  p => { const l1 = Math.abs(p.px - p.bx) + Math.abs(p.py - p.by), l2 = Math.abs(p.qx - p.px) + Math.abs(p.qy - p.py), m = Math.max(Math.abs(p.qx - p.bx), Math.abs(p.qy - p.by));
   return l1 >= 1 && l2 >= 1 && m >= 1 && l1 + l2 - m >= 2; }, { bx: 1, by: 2, px: 6, py: 3, qx: 4, qy: 8 }),
 build: ({ bx, by, px, py, qx, qy }) => { const l1 = Math.abs(px - bx) + Math.abs(py - by), l2 = Math.abs(qx - px) + Math.abs(qy - py), tot = l1 + l2, m = Math.max(Math.abs(qx - bx), Math.abs(qy - by)); return {
  prompt: `The base of the Survey Grid stands at B = ${pt(bx, by)}, the pump station at P = ${pt(px, py)} and the mast at Q = ${pt(qx, qy)}, with coordinates in kilometres. A supply rover drives from B to P and then from P to Q, keeping to the grid tracks, so each of its two legs is a taxicab distance. A drone flies from B straight to Q with its two motors at the same speed, so its trip is measured by the maximum distance. Enter the total distance the rover drives, then the drone's distance, then how many kilometres more the rover's total is than the drone's distance.`,
  answer: [tot, m, tot - m],
  hints: ['Treat the two rover legs separately: for each, find the gap across and the gap up without their signs, and add them. Then add the two legs.', 'The drone has only one hop, from B to Q, and its distance is the larger of the two gaps. The last answer is a subtraction of the two distances you already have.'],
  solution: `Rover, first leg B to P: ${gap(px, bx)} + ${gap(py, by)} = ${n(Math.abs(px - bx))} + ${n(Math.abs(py - by))} = ${n(l1)} km. Second leg P to Q: ${gap(qx, px)} + ${gap(qy, py)} = ${n(Math.abs(qx - px))} + ${n(Math.abs(qy - py))} = ${n(l2)} km. Total ${n(l1)} + ${n(l2)} = ${n(tot)} km. Drone, B to Q: the gaps are ${gap(qx, bx)} = ${n(Math.abs(qx - bx))} and ${gap(qy, by)} = ${n(Math.abs(qy - by))}, and the larger is ${n(m)} km. The rover drives ${n(tot)} − ${n(m)} = ${n(tot - m)} km more.`,
  guidance: [
   { prompt: `What is the taxicab distance from the base ${pt(bx, by)} to the pump station ${pt(px, py)}?`, answer: [l1], explanation: `${gap(px, bx)} + ${gap(py, by)} = ${n(Math.abs(px - bx))} + ${n(Math.abs(py - by))} = ${n(l1)}.` },
   { prompt: `What is the taxicab distance from the pump station ${pt(px, py)} to the mast ${pt(qx, qy)}?`, answer: [l2], explanation: `${gap(qx, px)} + ${gap(qy, py)} = ${n(Math.abs(qx - px))} + ${n(Math.abs(qy - py))} = ${n(l2)}.` },
   { prompt: `What is the maximum distance from the base ${pt(bx, by)} to the mast ${pt(qx, qy)}?`, answer: [m], explanation: `The gaps are ${n(Math.abs(qx - bx))} across and ${n(Math.abs(qy - by))} up, and the larger of them is ${n(m)}.` }
  ] }; }
});

mk({
 id: 'q01d', parent: 'q01', kind: 'challenge', title: 'Which beacon is nearest',
 brief: 'A rover has lost its map, and the three beacons it can hear are nearest in a different order for each way of measuring.',
 labels: ['nearest beacon, Euclidean (1, 2 or 3)', 'nearest beacon, taxicab (1, 2 or 3)', 'nearest beacon, maximum (1, 2 or 3)'], tolerance: 0.01,
 gl: [['smallest squared Euclidean distance', 'smallest taxicab distance (km)', 'smallest maximum distance (km)']][0]
}, {
 /* Each metric has one clearly nearest beacon (no ties), and the three answers are not all the same beacon. */
 canonical: { rx: 0, ry: 0, bx: [-4, 1, -3], by: [4, 5, 5] },
 draw: R => tryDraw(() => ({ rx: R.int(-3, 3), ry: R.int(-3, 3), bx: [R.int(-9, 9), R.int(-9, 9), R.int(-9, 9)], by: [R.int(-9, 9), R.int(-9, 9), R.int(-9, 9)] }),
  p => { const d = [0, 1, 2].map(i => dist3(p, i)), ans = [0, 1, 2].map(k => nearest(d.map(x => x[k])));
   const seen = new Set(); for (let i = 0; i < 3; i++) { const key = p.bx[i] + ',' + p.by[i]; if (seen.has(key) || (p.bx[i] === p.rx && p.by[i] === p.ry)) return false; seen.add(key); }
   return ans.every(v => v) && new Set(ans).size >= 2; }, { rx: 0, ry: 0, bx: [-4, 1, -3], by: [4, 5, 5] }),
 build: p => { const d = [0, 1, 2].map(i => dist3(p, i)), ans = [0, 1, 2].map(k => nearest(d.map(x => x[k]))), names = ['A', 'B', 'C'];
  const col = k => d.map(x => x[k]), mins = [0, 1, 2].map(k => Math.min(...col(k))), at = i => pt(p.bx[i], p.by[i]); return {
  prompt: `A rover at R = ${pt(p.rx, p.ry)} on the Survey Grid hears three beacons: A at ${at(0)}, B at ${at(1)} and C at ${at(2)}, with coordinates in kilometres. For each of the three metrics, one beacon is strictly nearest to the rover. Enter the nearest beacon for the Euclidean distance, then for the taxicab distance, then for the maximum distance, writing 1 for A, 2 for B and 3 for C.`,
  answer: ans,
  hints: ['For each beacon find the gap across and the gap up between it and the rover, without signs. Then work out all three distances for each beacon.', 'To compare Euclidean distances you do not need the square roots: the beacon with the smallest sum of squared gaps is the nearest. For the other two metrics compare the sums of the gaps and the larger gaps.'],
  solution: `Gaps across and up from the rover: A ${n(Math.abs(p.bx[0] - p.rx))} and ${n(Math.abs(p.by[0] - p.ry))}, B ${n(Math.abs(p.bx[1] - p.rx))} and ${n(Math.abs(p.by[1] - p.ry))}, C ${n(Math.abs(p.bx[2] - p.rx))} and ${n(Math.abs(p.by[2] - p.ry))}. Sums of squared gaps are ${n(d[0][0])}, ${n(d[1][0])} and ${n(d[2][0])}, and the smallest belongs to ${names[ans[0] - 1]}, so beacon ${n(ans[0])} is nearest in the Euclidean metric. Taxicab distances are ${n(d[0][1])}, ${n(d[1][1])} and ${n(d[2][1])} km, so beacon ${n(ans[1])} is nearest. Maximum distances are ${n(d[0][2])}, ${n(d[1][2])} and ${n(d[2][2])} km, so beacon ${n(ans[2])} is nearest.`,
  guidance: [
   { prompt: `For each beacon add the squared gap across and the squared gap up. What is the smallest of the three sums?`, answer: [mins[0]], explanation: `The sums are ${n(d[0][0])}, ${n(d[1][0])} and ${n(d[2][0])}. The smallest is ${n(mins[0])}, which belongs to ${names[ans[0] - 1]}. The nearest beacon in the Euclidean metric has the smallest sum, because a smaller sum has a smaller square root.` },
   { prompt: `For each beacon add the gap across and the gap up. What is the smallest taxicab distance?`, answer: [mins[1]], explanation: `The taxicab distances are ${n(d[0][1])}, ${n(d[1][1])} and ${n(d[2][1])} km. The smallest is ${n(mins[1])}, which belongs to ${names[ans[1] - 1]}.` },
   { prompt: `For each beacon take the larger of its two gaps. What is the smallest maximum distance?`, answer: [mins[2]], explanation: `The maximum distances are ${n(d[0][2])}, ${n(d[1][2])} and ${n(d[2][2])} km. The smallest is ${n(mins[2])}, which belongs to ${names[ans[2] - 1]}.` }
  ] }; }
});

/* For q01d: [squared Euclidean, taxicab, maximum] from the rover to beacon i; the index (1 to 3) of the one strictly smallest value, or 0 for a tie. */
function dist3(p, i) { const g = Math.abs(p.bx[i] - p.rx), h = Math.abs(p.by[i] - p.ry); return [g * g + h * h, g + h, Math.max(g, h)]; }
function nearest(v) { const m = Math.min(...v); return v.filter(x => x === m).length === 1 ? v.indexOf(m) + 1 : 0; }

/* ---- q02 Balls in different metrics [L 8.1, 8.2] ---- */

mk({
 id: 'q02b', parent: 'q02', kind: 'setting', title: 'Rings of marker posts',
 brief: 'Marker posts are to go in two rings round the weather mast, and the stores need to know how many posts each ring takes.',
 labels: ['posts in the diamond ring', 'posts in the square ring'], tolerance: 0.01,
 gl: [['grid points, taxicab, ring distance or less', 'grid points, taxicab, one step less', 'grid points, maximum, ring distance or less', 'grid points, maximum, one step less']][0]
}, {
 /* Never both distances 2 (the q02 worked example uses radius 2 in both metrics). */
 canonical: { cx: 3, cy: 5, k: 5, s: 3 },
 draw: R => tryDraw(() => ({ cx: R.int(0, 9), cy: R.int(0, 9), k: R.int(2, 12), s: R.int(2, 10) }), p => !(p.k === 2 && p.s === 2), { cx: 3, cy: 5, k: 5, s: 3 }),
 build: ({ cx, cy, k, s }) => { const t1 = taxiCount(k), t0 = taxiCount(k - 1), m1 = maxCount(s), m0 = maxCount(s - 1); return {
  prompt: `A weather mast stands at the grid point ${pt(cx, cy)} of the Survey Grid, and marker posts can only go on grid points: points whose two coordinates are whole numbers. One ring of posts goes on every grid point at taxicab distance exactly ${n(k)} from the mast, and a second ring goes on every grid point at maximum distance exactly ${n(s)} from the mast. The mast’s own point gets no post. Enter the number of posts in the first ring, then the number in the second ring.`,
  answer: [4 * k, 8 * s],
  hints: ['A ring at distance exactly k is what is left when you take the grid points at distance at most k and remove those at distance at most one less.', 'Count the grid points at distance at most k and at distance at most k − 1 for each metric, using the diamond and square counts, and subtract.'],
  solution: `Taxicab: the grid points at distance at most ${n(k)} number 2 × ${n(k)}² + 2 × ${n(k)} + 1 = ${n(t1)}, and at most ${n(k - 1)} number ${n(t0)}, so the ring holds ${n(t1)} − ${n(t0)} = ${n(4 * k)} posts. Maximum: at most ${n(s)} gives (2 × ${n(s)} + 1)² = ${n(m1)} and at most ${n(s - 1)} gives (2 × ${n(s - 1)} + 1)² = ${n(m0)}, so the ring holds ${n(m1)} − ${n(m0)} = ${n(8 * s)} posts.`,
  guidance: [
   { prompt: `How many grid points are at taxicab distance at most ${n(k)} from the mast?`, answer: [t1], explanation: `1 + 4 × (${run(k)}) = 2 × ${n(k)}² + 2 × ${n(k)} + 1 = ${n(t1)}.` },
   { prompt: `How many grid points are at taxicab distance at most ${n(k - 1)}?`, answer: [t0], explanation: `2 × ${n(k - 1)}² + 2 × ${n(k - 1)} + 1 = ${n(t0)}. The difference ${n(t1)} − ${n(t0)} = ${n(4 * k)} is the number of posts in the diamond ring.` },
   { prompt: `How many grid points are at maximum distance at most ${n(s)} from the mast?`, answer: [m1], explanation: `Each coordinate has 2 × ${n(s)} + 1 = ${n(2 * s + 1)} possible values, so ${n(2 * s + 1)} × ${n(2 * s + 1)} = ${n(m1)}.` },
   { prompt: `How many grid points are at maximum distance at most ${n(s - 1)}?`, answer: [m0], explanation: `Each coordinate has 2 × ${n(s - 1)} + 1 = ${n(2 * s - 1)} possible values, so ${n(2 * s - 1)} × ${n(2 * s - 1)} = ${n(m0)}. The difference ${n(m1)} − ${n(m0)} = ${n(8 * s)} is the number of posts in the square ring.` }
  ] }; }
});

mk({
 id: 'q02c', parent: 'q02', kind: 'applied', title: 'Topping up the marker field',
 brief: 'The drone range has grown, and the crew must plan how many extra markers and how much freight the new field needs.',
 labels: ['new markers', 'mass of new markers (kg)'], tolerance: 0.01,
 gl: [['grid points in the finished field', 'grid points already marked', 'new markers']][0]
}, {
 canonical: { cx: 6, cy: 2, r: 4, s: 7, w: 3 },
 draw: R => { const r = R.int(2, 8); return { cx: R.int(0, 9), cy: R.int(0, 9), r, s: R.int(r, 10), w: R.int(2, 6) }; },
 build: ({ cx, cy, r, s, w }) => { const big = maxCount(s), old = taxiCount(r), add = big - old; return {
  prompt: `A beacon stands at the grid point ${pt(cx, cy)} of the Survey Grid, and markers can only stand on grid points: points whose two coordinates are whole numbers. A marker already stands on every grid point at taxicab distance at most ${n(r)} from the beacon, the beacon’s own point included. The drone range has grown, so the crew now wants a marker on every grid point at maximum distance at most ${n(s)} from the beacon, keeping the markers already there. Each new marker weighs ${n(w)} kg. Enter how many new markers are needed, then their total mass in kilograms (type any number without commas).`,
  answer: [add, add * w],
  hints: ['Count the grid points the finished field must cover, count the markers already standing, and subtract. The old field lies inside the new one, because a point at taxicab distance at most r is at maximum distance at most r, and r is at most the new distance.', 'The mass is the number of new markers times the mass of one.'],
  solution: `The finished field holds the grid points at maximum distance at most ${n(s)}: (2 × ${n(s)} + 1)² = ${n(2 * s + 1)}² = ${n(big)}. The markers already standing are the grid points at taxicab distance at most ${n(r)}: 2 × ${n(r)}² + 2 × ${n(r)} + 1 = ${n(old)}. The old markers lie inside the new field, so ${n(big)} − ${n(old)} = ${n(add)} new markers are needed. At ${n(w)} kg each they weigh ${n(add)} × ${n(w)} = ${n(add * w)} kg.`,
  guidance: [
   { prompt: `How many grid points are at maximum distance at most ${n(s)} from the beacon?`, answer: [big], explanation: `Each coordinate has 2 × ${n(s)} + 1 = ${n(2 * s + 1)} possible values, so ${n(2 * s + 1)} × ${n(2 * s + 1)} = ${n(big)}.` },
   { prompt: `How many grid points are at taxicab distance at most ${n(r)} from the beacon? These already have markers.`, answer: [old], explanation: `1 + 4 × (${run(r)}) = 2 × ${n(r)}² + 2 × ${n(r)} + 1 = ${n(old)}.` },
   { prompt: `How many grid points of the finished field have no marker yet?`, answer: [add], explanation: `${n(big)} − ${n(old)} = ${n(add)}, because every old marker lies inside the finished field.` }
  ] }; }
});

mk({
 id: 'q02d', parent: 'q02', kind: 'challenge', title: 'Radius from the count',
 brief: 'A lost rover’s log gives only how many grid points its reach covered, and mission control must recover the radius of each reach.',
 labels: ['taxicab radius r', 'maximum radius s'], tolerance: 0.01,
 gl: [['(grid points − 1) ÷ 4', 'taxicab radius r', 'whole numbers per coordinate', 'maximum radius s']][0]
}, {
 /* Printed numbers T and M are the parameters; the radii are found from them. Radii start at 4, so the q02 canonical (3 and 4) and example (2) are never used. */
 canonical: { T: 85, M: 225 },
 draw: R => ({ T: taxiCount(R.int(4, 12)), M: maxCount(R.int(4, 15)) }),
 build: ({ T, M }) => { let r = 0; while (taxiCount(r) < T && r < 1000) r++; const q = (T - 1) / 4, side = Math.round(Math.sqrt(M)), s = (side - 1) / 2; return {
  prompt: `A lost rover’s log was found on the Survey Grid with two lines. Line 1: the grid points at taxicab distance at most r from the rover’s start, the start itself included, numbered ${n(T)}. Line 2: the grid points at maximum distance at most s from the drone base, the base itself included, numbered ${n(M)}. Here r and s are whole numbers, and grid points are points whose two coordinates are whole numbers. Enter r, then s.`,
  answer: [r, s],
  hints: ['Take away the centre point: what is left is the diamonds at taxicab distances 1, 2, 3 and so on, with 4, 8, 12 and so on points. Add diamonds until the total matches the log.', 'The count for the maximum metric is a square: the number of whole numbers each coordinate may take, multiplied by itself. Work back from the count to that number, then to s.'],
  solution: `Taxicab: take away the centre, leaving ${n(T)} − 1 = ${n(T - 1)} points, which are the diamonds of 4 × 1, 4 × 2, …, so 1 + 2 + … + r = ${n(T - 1)} ÷ 4 = ${n(q)}. The running totals 1, 3, 6, … reach ${n(q)} after ${n(r)} terms, so r = ${n(r)}. Maximum: ${n(M)} = ${n(side)} × ${n(side)}, so each coordinate has ${n(side)} possible values, which is 2s + 1, so s = (${n(side)} − 1) ÷ 2 = ${n(s)}.`,
  guidance: [
   { prompt: `Take away the centre point and share the rest among the four sides of the diamonds. What is (${n(T)} − 1) ÷ 4?`, answer: [q], explanation: `${n(T - 1)} ÷ 4 = ${n(q)}, and this is 1 + 2 + … + r.` },
   { prompt: `Add 1, 2, 3, … until the total reaches that number. How many terms does it take, which is r?`, answer: [r], explanation: `The totals 1, 3, 6, … first reach ${n(q)} after ${n(r)} terms, so r = ${n(r)}.` },
   { prompt: `The count for the maximum metric is a square. What number multiplied by itself makes ${n(M)}?`, answer: [side], explanation: `${n(side)} × ${n(side)} = ${n(M)}, so each coordinate has ${n(side)} possible values.` },
   { prompt: `Each coordinate has 2s + 1 possible values. What is s?`, answer: [s], explanation: `2s + 1 = ${n(side)} gives 2s = ${n(side - 1)}, so s = ${n(s)}.` }
  ] }; }
});

/* ---- q03 The metric rules [L 8.1] ---- */

mk({
 id: 'q03b', parent: 'q03', kind: 'setting', title: 'Survey reports that cannot all be true',
 brief: 'Four survey crews each filed a different distance between two depots, and not all of them can be right.',
 labels: ['smallest possible d(X, Z) (km)', 'largest possible d(X, Z) (km)', 'reports that could be true'], tolerance: 0.01,
 gl: [['smallest possible d(X, Z) (km)', 'largest possible d(X, Z) (km)', 'reports inside that range']][0]
}, {
 /* Reports are distinct whole numbers and never equal to either end of the range, so none sits on a boundary case. The q03 example is d = 5 and 2. */
 canonical: { a: 9, b: 4, c: [3, 7, 12, 14] },
 draw: R => tryDraw(() => { const a = R.int(2, 14), b = R.int(2, 14), c = []; for (let i = 0; i < 4; i++) c.push(R.int(1, a + b + 4)); return { a, b, c }; },
  p => { const lo = Math.abs(p.a - p.b), hi = p.a + p.b; return p.a !== p.b && !(p.a === 5 && p.b === 2) && !(p.a === 2 && p.b === 5) && new Set(p.c).size === 4 && p.c.every(v => v !== lo && v !== hi); },
  { a: 9, b: 4, c: [3, 7, 12, 14] }),
 build: ({ a, b, c }) => { const lo = Math.abs(a - b), hi = a + b, ok = c.filter(v => v > lo && v < hi), cnt = ok.length, list = joinAnd(c.map(n)), good = ok.length ? joinAnd(ok.map(n)) : 'none of them'; return {
  prompt: `Three supply depots X, Y and Z stand on a flat plain, and d is the usual straight-line distance in kilometres. Depot Y is ${n(a)} km from X and ${n(b)} km from Z. The distance from X to Z was never measured, but four survey crews each reported one: ${list} km. Enter the smallest possible value of d(X, Z), then the largest possible value, then how many of the four reports could be true. In the plane, every value from the smallest to the largest really can happen, and a report could be true when the depots can be placed to give exactly that distance.`,
  answer: [lo, hi, cnt],
  hints: ['The triangle inequality, d(X, Z) ≤ d(X, Y) + d(Y, Z), gives the largest value. Put the longer of the two known distances on the left of the same rule to get the smallest.', 'A report could be true when it lies from the smallest value to the largest. Compare each of the four reports with that range.'],
  solution: `The triangle inequality gives d(X, Z) ≤ ${n(a)} + ${n(b)} = ${n(hi)}. Putting the longer known distance on the left gives ${n(Math.max(a, b))} ≤ d(X, Z) + ${n(Math.min(a, b))}, so d(X, Z) ≥ ${n(Math.max(a, b))} − ${n(Math.min(a, b))} = ${n(lo)}. So d(X, Z) can be anything from ${n(lo)} to ${n(hi)} km. Of the reports ${list}, the ones in that range are ${good}, so ${plural(cnt, 'report', 'reports')} could be true.`,
  guidance: [
   { prompt: `By the triangle inequality, what is the largest d(X, Z) can be?`, answer: [hi], explanation: `d(X, Z) ≤ ${n(a)} + ${n(b)} = ${n(hi)}.` },
   { prompt: `Use the triangle inequality with the longer known distance on the left. What is the smallest d(X, Z) can be?`, answer: [lo], explanation: `${n(Math.max(a, b))} ≤ d(X, Z) + ${n(Math.min(a, b))} gives d(X, Z) ≥ ${n(Math.max(a, b))} − ${n(Math.min(a, b))} = ${n(lo)}.` },
   { prompt: `How many of the reports ${list} lie between ${n(lo)} and ${n(hi)}?`, answer: [cnt], explanation: `The reports in the range from ${n(lo)} to ${n(hi)} are ${good}, so ${plural(cnt, 'report', 'reports')} could be true.` }
  ] }; }
});

mk({
 id: 'q03c', parent: 'q03', kind: 'applied', title: 'The cost of the stopover',
 brief: 'A fuel rover may call at a refuelling post on the way to the far depot, and the crew need the most the stop could cost them.',
 labels: ['shortest direct distance (km)', 'largest extra distance (km)', 'fuel wasted at most (litres)'], tolerance: 0.01,
 gl: [['shortest possible d(X, Z) (km)', 'distance driven via Y (km)', 'largest extra distance (km)']][0]
}, {
 /* a ≠ b so the depots X and Z cannot coincide; never the q03 numbers 7 and 3 or its example 5 and 2. */
 canonical: { a: 8, b: 5, f: 3 },
 draw: R => tryDraw(() => ({ a: R.int(2, 15), b: R.int(2, 15), f: R.int(2, 6) }), p => p.a !== p.b && ![[7, 3], [3, 7], [5, 2], [2, 5]].some(([u, v]) => u === p.a && v === p.b), { a: 8, b: 5, f: 3 }),
 build: ({ a, b, f }) => { const lo = Math.abs(a - b), via = a + b, extra = via - lo, fuel = extra * f; return {
  prompt: `A fuel rover must get from depot X to depot Z on a flat plain, where d is the usual straight-line distance in kilometres. It may drive straight from X to Z, or call at the refuelling post Y on the way, driving straight from X to Y and then straight from Y to Z. The survey recorded that Y is ${n(a)} km from X and ${n(b)} km from Z, but the straight distance from X to Z was lost. The rover burns ${n(f)} litres of fuel for every kilometre. Enter the shortest possible direct distance from X to Z, then the largest possible extra distance that calling at Y could add (the distance driven via Y minus the direct distance), then the most fuel in litres that extra distance could waste.`,
  answer: [lo, extra, fuel],
  hints: ['The direct distance is trapped between the difference and the sum of the two known distances. The distance driven via Y is fixed, so the extra distance is largest when the direct distance is smallest.', 'The fuel is the largest extra distance times the litres burned per kilometre.'],
  solution: `The triangle inequality, with the longer known distance on the left, gives ${n(Math.max(a, b))} ≤ d(X, Z) + ${n(Math.min(a, b))}, so the direct distance is at least ${n(Math.max(a, b))} − ${n(Math.min(a, b))} = ${n(lo)} km. Via Y the rover drives ${n(a)} + ${n(b)} = ${n(via)} km whatever the layout. The extra distance is largest when the direct distance is smallest: ${n(via)} − ${n(lo)} = ${n(extra)} km. At ${n(f)} litres per kilometre that wastes at most ${n(extra)} × ${n(f)} = ${n(fuel)} litres.`,
  guidance: [
   { prompt: `Use the triangle inequality with the longer known distance on the left. What is the shortest the direct distance from X to Z can be?`, answer: [lo], explanation: `${n(Math.max(a, b))} ≤ d(X, Z) + ${n(Math.min(a, b))} gives d(X, Z) ≥ ${n(Math.max(a, b))} − ${n(Math.min(a, b))} = ${n(lo)}.` },
   { prompt: `How far does the rover drive when it goes from X to Y and then from Y to Z?`, answer: [via], explanation: `${n(a)} + ${n(b)} = ${n(via)} km, whatever the layout of the depots.` },
   { prompt: `What is the largest extra distance, the distance via Y minus the shortest direct distance?`, answer: [extra], explanation: `${n(via)} − ${n(lo)} = ${n(extra)} km, which is also 2 × ${n(Math.min(a, b))}, twice the shorter leg.` }
  ] }; }
});

mk({
 id: 'q03d', parent: 'q03', kind: 'challenge', title: 'A chain of four masts',
 brief: 'Four relay masts stand in a chain with only the links measured, and mission control wants the possible gap from the first mast to the last.',
 labels: ['smallest possible d(x, w) (km)', 'largest possible d(x, w) (km)'], tolerance: 0.01,
 gl: [['largest possible d(x, w) (km)', 'longest link bigger than the other two together (1 or 0)', 'smallest possible d(x, w) (km)']][0]
}, {
 /* Three link lengths; about a third of draws have no link longer than the other two together, so the smallest value is 0. */
 canonical: { a: 12, b: 3, c: 5 },
 draw: R => tryDraw(() => ({ a: R.int(1, 20), b: R.int(1, 20), c: R.int(1, 20) }), p => { const m = Math.max(p.a, p.b, p.c), rest = p.a + p.b + p.c - m, big = m > rest; return !(p.a === 5 && p.b === 2) && (big || R.next() < 0.4); }, { a: 12, b: 3, c: 5 }),
 build: ({ a, b, c }) => { const hi = a + b + c, m = Math.max(a, b, c), rest = hi - m, big = m > rest ? 1 : 0, lo = big ? m - rest : 0; return {
  prompt: `Four relay masts x, y, z and w stand on a flat plain in a chain, and d is the usual straight-line distance in kilometres. The links were measured: d(x, y) = ${n(a)}, d(y, z) = ${n(b)} and d(z, w) = ${n(c)}. Nothing else was measured, and the masts may stand anywhere that fits these three distances, even at the same spot as one another. Enter the smallest possible value of d(x, w), then the largest possible value.`,
  answer: [lo, hi],
  hints: ['Use the triangle inequality twice: d(x, w) is at most d(x, y) + d(y, w), and d(y, w) is at most d(y, z) + d(z, w). That gives the largest value.', 'For the smallest value, put the longest link on the left of the rule and the other two on the right. If the longest link is longer than the other two put together, the gap cannot close; if it is not, the four masts can be placed so that w sits back on x.'],
  solution: `Largest: d(x, w) ≤ d(x, y) + d(y, z) + d(z, w) = ${n(a)} + ${n(b)} + ${n(c)} = ${n(hi)}, reached when the masts stand in a line one after another. Smallest: the longest link is ${n(m)} km and the other two together are ${n(rest)} km. ${big ? `${n(m)} is longer than ${n(rest)}, so the other two links can never close the gap: d(x, w) ≥ ${n(m)} − ${n(rest)} = ${n(lo)}, reached when all four masts stand in a line.` : `${n(m)} is not longer than ${n(rest)}, so the links can be laid out as the sides of a triangle (or a straight line folded back) and w can sit exactly on x: the smallest value is 0.`}`,
  guidance: [
   { prompt: `By the triangle inequality, what is the largest d(x, w) can be?`, answer: [hi], explanation: `d(x, w) ≤ d(x, y) + d(y, z) + d(z, w) = ${n(a)} + ${n(b)} + ${n(c)} = ${n(hi)}.` },
   { prompt: `Is the longest link longer than the other two put together? Enter 1 for yes, 0 for no.`, answer: [big], explanation: `The longest link is ${n(m)} km and the other two together are ${n(rest)} km, so the answer is ${big ? 'yes' : 'no'}.` },
   { prompt: `What is the smallest d(x, w) can be?`, answer: [lo], explanation: big ? `The other two links can cancel at most ${n(rest)} km of the longest one, so d(x, w) ≥ ${n(m)} − ${n(rest)} = ${n(lo)}.` : `The links can be laid out so that w comes back to x, so the smallest value is 0.` }
  ] }; }
});

/* ---- q04 Open sets: room round every point [L 8.2] ---- */

mk({
 id: 'q04b', parent: 'q04', kind: 'setting', title: 'Sprinkler head and valve',
 brief: 'A sprinkler head and a valve both need a clear zone that never leaves the site, and the planners want its largest size.',
 labels: ['largest radius in the bed (m)', 'largest radius on the pipe (m)'], tolerance: 0.01,
 gl: [['nearer of the left and right sides (m)', 'nearer of the bottom and top sides (m)', 'largest radius in the bed (m)', 'largest radius on the pipe (m)']][0]
}, {
 /* The bed does not start at the origin, and corners may be negative. The sprinkler is a whole-number point strictly inside, the valve a half-whole-number strictly inside the pipe. */
 canonical: { x1: -2, x2: 7, y1: 1, y2: 6, px: 1, py: 4, a: 4, b: 15, t: 7.5 },
 draw: R => { const x1 = R.int(-4, 3), x2 = x1 + R.int(4, 11), y1 = R.int(-3, 3), y2 = y1 + R.int(4, 11), a = R.int(0, 6), b = a + R.int(4, 14); return { x1, x2, y1, y2, px: R.int(x1 + 1, x2 - 1), py: R.int(y1 + 1, y2 - 1), a, b, t: a + R.int(1, 2 * (b - a) - 1) / 2 }; },
 build: ({ x1, x2, y1, y2, px, py, a, b, t }) => { const dl = px - x1, dr = x2 - px, db = py - y1, dt = y2 - py, hx = Math.min(dl, dr), hy = Math.min(db, dt), r1 = Math.min(hx, hy), L = t - a, Rt = b - t, r2 = Math.min(L, Rt); return {
  prompt: `A planting bed is the open rectangle of points (x, y) with ${n(x1)} < x < ${n(x2)} and ${n(y1)} < y < ${n(y2)}, in metres from the greenhouse door, with the Euclidean metric, and a sprinkler head stands at ${pt(px, py)}. Enter the largest radius of a ball round the sprinkler head that lies inside the bed. Then a water pipe runs along the open interval (${n(a)}, ${n(b)}) of the x-axis, measured in metres with the usual distance, and a valve sits at x = ${n(t)}. Enter the largest radius r for which the ball B(${n(t)}, r) lies inside (${n(a)}, ${n(b)}).`,
  answer: [r1, r2],
  hints: ['A ball round a point stays inside an open rectangle as long as its radius is no more than the distance from the point to each of the four sides. Find those four distances.', 'On a line, B(x, r) is the open interval from x − r to x + r, so the valve’s ball stays inside as long as neither of its ends passes an end of the pipe.'],
  solution: `The sprinkler is ${n(px)} − ${par(x1)} = ${n(dl)} from the side x = ${n(x1)}, ${n(x2)} − ${par(px)} = ${n(dr)} from the side x = ${n(x2)}, ${n(py)} − ${par(y1)} = ${n(db)} from the side y = ${n(y1)} and ${n(y2)} − ${par(py)} = ${n(dt)} from the side y = ${n(y2)}. The ball can grow until it touches the nearest side, so the largest radius is ${n(r1)} m. The valve is ${n(t)} − ${n(a)} = ${n(L)} from the left end and ${n(b)} − ${n(t)} = ${n(Rt)} from the right end. B(${n(t)}, r) = (${n(t)} − r, ${n(t)} + r) stays inside while r is at most both, so the largest radius is ${n(r2)} m.`,
  guidance: [
   { prompt: `How far is the sprinkler head from the nearer of the two sides x = ${n(x1)} and x = ${n(x2)}?`, answer: [hx], explanation: `The distances are ${n(dl)} and ${n(dr)}, and the nearer is ${n(hx)}.` },
   { prompt: `How far is the sprinkler head from the nearer of the two sides y = ${n(y1)} and y = ${n(y2)}?`, answer: [hy], explanation: `The distances are ${n(db)} and ${n(dt)}, and the nearer is ${n(hy)}.` },
   { prompt: `What is the largest radius of a ball round the sprinkler head inside the bed?`, answer: [r1], explanation: `The ball must not pass any of the four sides, so the radius can be at most the smallest of ${n(dl)}, ${n(dr)}, ${n(db)} and ${n(dt)}, which is ${n(r1)}.` },
   { prompt: `What is the largest radius of a ball round the valve inside the pipe’s interval?`, answer: [r2], explanation: `The valve is ${n(L)} from one end and ${n(Rt)} from the other, and the nearer end decides: ${n(r2)}.` }
  ] }; }
});

mk({
 id: 'q04c', parent: 'q04', kind: 'applied', title: 'Where the drilling rig may stand',
 brief: 'The drilling rig throws a safety zone round itself, and the crew must pick a bay where the zone stays inside the pad.',
 labels: ['bays that fit', 'largest radius at the best bay (m)'], tolerance: 0.01,
 gl: [['largest radius at the first bay (m)', 'largest radius at the second bay (m)', 'largest radius at the third bay (m)']][0]
}, {
 /* The zone radius is a half-whole number and every bay radius a whole number, so a zone never exactly equals a bay's room. */
 canonical: { w: 12, h: 9, z: 3.5, bx: [2, 6, 10], by: [4, 5, 2] },
 draw: R => { const w = R.int(8, 16), h = R.int(8, 14), bx = [], by = []; for (let i = 0; i < 3; i++) { bx.push(R.int(1, w - 1)); by.push(R.int(1, h - 1)); } return { w, h, z: R.int(1, 2) + 0.5, bx, by }; },
 build: ({ w, h, z, bx, by }) => { const room = i => Math.min(bx[i], w - bx[i], by[i], h - by[i]), rs = [0, 1, 2].map(room), cnt = rs.filter(r => r >= z).length, best = Math.max(...rs), names = ['first', 'second', 'third']; return {
  prompt: `A drilling rig throws a safety zone round itself: the ball of radius ${n(z)} m centred on the rig, using the Euclidean metric. The zone must lie inside the landing pad, the open rectangle of points (x, y) with 0 < x < ${n(w)} and 0 < y < ${n(h)}, in metres. An open ball may reach exactly up to an edge of the pad but not across it. The rig can be set up at one of three bays: ${pt(bx[0], by[0])}, ${pt(bx[1], by[1])} or ${pt(bx[2], by[2])}. Enter how many of the three bays can hold the rig with its zone inside the pad. Then enter the largest radius a safety zone could have at the best of the three bays.`,
  answer: [cnt, best],
  hints: ['At each bay the largest ball that fits has a radius equal to the distance from the bay to the nearest of the four sides of the pad.', 'A bay holds the rig when its largest radius is at least the radius of the safety zone. The second answer is the biggest of the three largest radii.'],
  solution: [0, 1, 2].map(i => `Bay ${pt(bx[i], by[i])} is ${n(bx[i])} from x = 0, ${n(w - bx[i])} from x = ${n(w)}, ${n(by[i])} from y = 0 and ${n(h - by[i])} from y = ${n(h)}, so its largest radius is ${n(rs[i])}.`).join(' ')
   + ` A zone of radius ${n(z)} fits at the bays whose largest radius is at least ${n(z)}: that is ${plural(cnt, 'bay', 'bays')}. The best bay allows a radius of ${n(best)} m.`,
  guidance: [0, 1, 2].map(i => ({ prompt: `What is the largest radius of a ball round the ${names[i]} bay ${pt(bx[i], by[i])} that lies inside the pad?`, answer: [rs[i]],
   explanation: `The distances to the four sides are ${n(bx[i])}, ${n(w - bx[i])}, ${n(by[i])} and ${n(h - by[i])}. The smallest is ${n(rs[i])}, and ${rs[i] >= z ? `that is at least ${n(z)}, so the safety zone fits` : `that is less than ${n(z)}, so the safety zone does not fit`}.` }))
  }; }
});

mk({
 id: 'q04d', parent: 'q04', kind: 'challenge', title: 'Grid points under the crane',
 brief: 'The hangar crane needs a clear zone round its post, and the stores want to count the grid points of the floor that lie inside it.',
 labels: ['largest radius r (m)', 'grid points inside, maximum metric', 'grid points inside, taxicab metric'], tolerance: 0.01, uses: 'q02',
 gl: [['largest radius r (m)', 'whole numbers per coordinate inside the ball', 'grid points inside, maximum metric', 'grid points inside, taxicab metric']][0]
}, {
 /* The crane is at a whole-number point at least 2 from the nearest side, so the radius is 2 or more and the ball holds more than one socket.
    The nearest side is unique in the sense that matters: the radius is the smallest of four distances. */
 canonical: { w: 11, h: 9, px: 5, py: 4 },
 draw: R => tryDraw(() => { const w = R.int(6, 14), h = R.int(6, 14); return { w, h, px: R.int(2, w - 2), py: R.int(2, h - 2) }; },
  p => { const r = Math.min(p.px, p.w - p.px, p.py, p.h - p.py); return r >= 2 && r <= 6 && (r >= 3 || R.next() < 0.15); }, { w: 11, h: 9, px: 5, py: 4 }),
 build: ({ w, h, px, py }) => { const ds = [px, w - px, py, h - py], r = Math.min(...ds), k = r - 1, side = 2 * k + 1, mc = side * side, tc = taxiCount(k); return {
  prompt: `A hangar floor is the open rectangle of points (x, y) with 0 < x < ${n(w)} and 0 < y < ${n(h)}, in metres, and the crane’s post stands at the grid point ${pt(px, py)}, where grid points are points whose two coordinates are whole numbers. The safety zone is the largest ball round the post that lies inside the floor, and its radius is the distance from the post to the nearest side; this is true in the Euclidean, the taxicab and the maximum metrics alike. A ball B(post, r) holds the points at distance less than r, in the metric used. Enter the radius r. Then enter how many grid points lie in that ball when distance is the maximum metric, then how many when it is the taxicab metric. Count the post’s own point in both.`,
  answer: [r, mc, tc],
  hints: ['The radius is the smallest of the four distances from the post to the sides of the floor. A ball holds the points at distance less than r, and on a grid every distance is a whole number, so the grid points in it are those at distance at most r − 1.', 'Use the counts from the diamond and the square: taxicab 2k² + 2k + 1 and maximum (2k + 1)², with k = r − 1.'],
  solution: `The post is ${n(px)} from x = 0, ${n(w - px)} from x = ${n(w)}, ${n(py)} from y = 0 and ${n(h - py)} from y = ${n(h)}, so r = ${n(r)}. The ball holds the grid points at distance less than ${n(r)}, which is at most ${n(k)}. Maximum metric: each coordinate has 2 × ${n(k)} + 1 = ${n(side)} possible values, so ${n(side)} × ${n(side)} = ${n(mc)} grid points. Taxicab metric: 2 × ${n(k)}² + 2 × ${n(k)} + 1 = ${n(tc)} grid points.`,
  guidance: [
   { prompt: `What is the smallest of the post’s distances to the four sides of the floor?`, answer: [r], explanation: `The distances are ${n(ds[0])}, ${n(ds[1])}, ${n(ds[2])} and ${n(ds[3])}, so the radius is ${n(r)}.` },
   { prompt: `The ball holds the grid points at distance at most ${n(k)}. How many whole numbers may each coordinate take in the maximum metric?`, answer: [side], explanation: `Each coordinate may differ from the post’s by at most ${n(k)}, which gives 2 × ${n(k)} + 1 = ${n(side)} values.` },
   { prompt: `How many grid points lie in the ball in the maximum metric?`, answer: [mc], explanation: `${n(side)} × ${n(side)} = ${n(mc)}.` },
   { prompt: `How many grid points lie in the ball in the taxicab metric?`, answer: [tc], explanation: `1 + 4 × (${run(k)}) = 2 × ${n(k)}² + 2 × ${n(k)} + 1 = ${n(tc)}.` }
  ] }; }
});

/* ---- q05 Interior, closure and boundary [L 8.2] ---- */

mk({
 id: 'q05b', parent: 'q05', kind: 'setting', title: 'Stretches of conveyor',
 brief: 'Three stretches of the cargo conveyor are live, and the safety crew must fence every place where live track meets dead track.',
 labels: ['boundary points', 'boundary points not in S', 'open (1 or 0)'], tolerance: 0.01,
 gl: [['boundary points', 'boundary points not in S', 'open (1 or 0)']][0]
}, {
 /* Three stretches with whole-number ends, touching or apart, with no lone point. A fifth of draws are all open and a fifth all closed (never closed at a shared end). */
 canonical: { pieces: [[1, 3, 0, 0], [3, 6, 0, 1], [8, 10, 1, 0]], pts: [] },
 draw: R => { const mode = R.next(), m = mode < 0.2 ? 0 : mode < 0.4 ? 1 : 2; return { pieces: makePieces(R, 3, R.int(0, 3), 0.4, m), pts: [] }; },
 build: p => { const S = analyse(p), cands = joinAnd(S.cand.map(n)), bdList = S.bd.map(i => n(i.p)); return {
  prompt: `Three stretches of the cargo conveyor are live: S = ${setText(p)}, with positions in metres from the loading dock, and distance is the usual distance on the line. Enter the number of boundary points of S. Then enter how many of those boundary points are not in S, and then 1 if S is open and 0 if it is not.`,
  answer: [S.k, S.out, S.open],
  hints: ['Only the end points of the stretches can be boundary points. For each one, look a little to its left and a little to its right, and at the point itself: is every ball round it holding points of S and points outside S?', 'A boundary point is not in S when the bracket at that end is round and nothing of S covers it. S is open when every point of S is an interior point.'],
  solution: `Away from ${cands} every point is either well inside S or well outside it, so only these can be boundary points. ${S.info.map(sayPoint).join(' ')} So S has ${plural(S.k, 'boundary point', 'boundary points')}: ${joinAnd(bdList)}. ${S.out === 0 ? 'All of them are in S.' : `${plural(S.out, 'of them is', 'of them are')} not in S: ${joinAnd(S.bd.filter(i => !i.at).map(i => n(i.p)))}.`} ${openWhy(S)}`,
  guidance: [
   { prompt: `Check the candidates ${cands} one at a time. How many of them are boundary points of S?`, answer: [S.k], explanation: S.info.map(sayPoint).join(' ') },
   { prompt: `How many of the boundary points are not in S?`, answer: [S.out], explanation: S.out === 0 ? 'Every boundary point is in S.' : `The boundary points not in S are ${joinAnd(S.bd.filter(i => !i.at).map(i => n(i.p)))}.` },
   { prompt: `Is every point of S an interior point? Enter 1 for yes, 0 for no.`, answer: [S.open], explanation: openWhy(S) }
  ] }; }
});

mk({
 id: 'q05c', parent: 'q05', kind: 'applied', title: 'Flags and beacons on the survey line',
 brief: 'The crew will flag every boundary point of the surveyed stretch and set a beacon on every whole-kilometre mark inside it, and the stores need the bill.',
 labels: ['flags', 'beacons', 'total cost (credits)'], tolerance: 0.01,
 gl: [['boundary points', 'whole-number marks in S', 'of those marks, boundary points']][0]
}, {
 /* Two stretches with whole-number ends, touching or apart, and a lone point in about half the draws. At least one beacon is needed. */
 canonical: { pieces: [[2, 5, 1, 0], [5, 9, 0, 1]], pts: [11], pb: 4, pf: 7 },
 draw: R => tryDraw(() => { const m = R.next(), mode = m < 0.15 ? 0 : m < 0.3 ? 1 : 2, pieces = makePieces(R, 2, R.int(0, 3), 0.4, mode), last = pieces[1][1], pts = R.bool() ? [last + R.int(2, 4)] : [];
   return { pieces, pts, pb: R.int(2, 9), pf: R.int(3, 12) }; }, p => beacons(p) >= 1, { pieces: [[2, 5, 1, 0], [5, 9, 0, 1]], pts: [11], pb: 4, pf: 7 }),
 build: p => { const S = analyse(p), marks = wholeMarks(p), bdIn = S.bd.filter(i => i.at).length, bea = marks - bdIn, cost = bea * p.pb + S.k * p.pf, bdList = joinAnd(S.bd.map(i => n(i.p))), cands = joinAnd(S.cand.map(n)); return {
  prompt: `Along the survey line, positions are in kilometres from the grid beacon and distance is the usual distance on the line. The surveyed stretch is S = ${setText(p)}. The crew will plant a flag on every boundary point of S, and a beacon on every whole-number kilometre mark that is an interior point of S. A flag costs ${n(p.pf)} credits and a beacon costs ${n(p.pb)} credits. Enter the number of flags, then the number of beacons, then the total cost in credits.`,
  answer: [S.k, bea, cost],
  hints: ['Flags go on the boundary points: check the end points of the stretches and any lone point, one at a time. Beacons go on the whole-number marks of S that are not boundary points, because those are the interior ones.', 'Count the whole numbers that lie in S, including any that are boundary points, and take away the ones that are boundary points. The cost is the flags times their price plus the beacons times theirs.'],
  solution: `Away from ${cands} every point is either well inside S or well outside it, so only these can be boundary points. ${S.info.map(sayPoint).join(' ')} So there are ${plural(S.k, 'flag', 'flags')}, on ${bdList}. The whole-number marks in S number ${n(marks)}, and ${n(bdIn)} of them ${bdIn === 1 ? 'is a boundary point' : 'are boundary points'}, so ${n(marks)} − ${n(bdIn)} = ${n(bea)} marks are interior and get beacons. The cost is ${n(S.k)} × ${n(p.pf)} + ${n(bea)} × ${n(p.pb)} = ${n(S.k * p.pf)} + ${n(bea * p.pb)} = ${n(cost)} credits.`,
  guidance: [
   { prompt: `Check the candidates ${cands} one at a time. How many of them are boundary points of S?`, answer: [S.k], explanation: S.info.map(sayPoint).join(' ') },
   { prompt: `How many whole-number kilometre marks lie in S? Count boundary points that belong to S as well.`, answer: [marks], explanation: `The whole numbers in S are ${joinAnd(wholeList(p).map(n))}, which is ${n(marks)} of them.` },
   { prompt: `How many of those marks are boundary points of S?`, answer: [bdIn], explanation: bdIn === 0 ? 'None of the marks in S is a boundary point.' : `${bdIn === 1 ? 'The boundary point that lies in S is' : 'The boundary points that lie in S are'} ${joinAnd(S.bd.filter(i => i.at).map(i => n(i.p)))}, so ${plural(bdIn, 'mark is a boundary point', 'marks are boundary points')}. The other ${n(marks)} − ${n(bdIn)} = ${n(bea)} are interior and get beacons.` }
  ] }; }
});

mk({
 id: 'q05d', parent: 'q05', kind: 'challenge', title: 'Room round the sensor',
 brief: 'A sensor sits inside a patchwork of surveyed stretches, and the crew want the boundary of the patchwork and how much room the sensor has.',
 labels: ['boundary points', 'largest radius (km)', 'closed (1 or 0)'], tolerance: 0.01, uses: 'q04',
 gl: [['boundary points', 'distance to the nearest boundary point on its left (km)', 'distance to the nearest boundary point on its right (km)', 'closed (1 or 0)']][0]
}, {
 /* Three stretches and often a lone point; the sensor sits at a half-whole number strictly inside one stretch, so it is an interior point.
    A fifth of draws are all closed with whole-number points, so the closed answer is 1 sometimes. */
 canonical: { pieces: [[0, 3, 0, 0], [3, 7, 0, 1], [9, 12, 1, 0]], pts: [14], t: 5.5 },
 draw: R => tryDraw(() => { const m = R.next(), mode = m < 0.25 ? 1 : 2, pieces = makePieces(R, 3, R.int(0, 2), 0.4, mode), last = pieces[2][1], pts = R.bool() ? [last + R.int(2, 3)] : [], i = R.int(0, 2), [a, b] = pieces[i];
   return { pieces, pts, t: a + R.int(1, 2 * (b - a) - 1) / 2 }; }, p => p.t % 1 !== 0 || p.pieces.some(([a, b]) => p.t > a && p.t < b), { pieces: [[0, 3, 0, 0], [3, 7, 0, 1], [9, 12, 1, 0]], pts: [14], t: 5.5 }),
 build: p => { const S = analyse(p), cands = joinAnd(S.cand.map(n)), bdList = joinAnd(S.bd.map(i => n(i.p))), t = p.t,
   left = Math.max(...S.bd.filter(i => i.p < t).map(i => i.p)), right = Math.min(...S.bd.filter(i => i.p > t).map(i => i.p)), dl = t - left, dr = right - t, r = Math.min(dl, dr); return {
  prompt: `A patchwork of surveyed stretches on the line is S = ${setText(p)}, with positions in kilometres from the grid beacon and the usual distance. A sensor sits at x = ${n(t)}, which is a point of S. Enter the number of boundary points of S. Then enter the largest radius r for which the ball B(${n(t)}, r) lies inside S. Then enter 1 if S is closed and 0 if it is not.`,
  answer: [S.k, r, S.closed],
  hints: ['Only the end points of the stretches and any lone point can be boundary points; some of them may be interior points of S where two stretches meet. Check each candidate on its own.', 'A ball round the sensor stays inside S until it would reach a point outside S, and the first such points are boundary points. S is closed when it contains all of its boundary points.'],
  solution: `Away from ${cands} every point is either well inside S or well outside it, so only these can be boundary points. ${S.info.map(sayPoint).join(' ')} So S has ${plural(S.k, 'boundary point', 'boundary points')}: ${bdList}. The sensor at ${n(t)} is ${n(t)} − ${n(left)} = ${n(dl)} from the nearest boundary point on its left and ${n(right)} − ${n(t)} = ${n(dr)} from the nearest on its right, and the ball can grow until it reaches the nearer one, so the largest radius is ${n(r)} km. ${closedWhy(S)}`,
  guidance: [
   { prompt: `Check the candidates ${cands} one at a time. How many of them are boundary points of S?`, answer: [S.k], explanation: S.info.map(sayPoint).join(' ') },
   { prompt: `How far is the sensor at x = ${n(t)} from the nearest boundary point on its left?`, answer: [dl], explanation: `The nearest boundary point to the left is ${n(left)}, and ${n(t)} − ${n(left)} = ${n(dl)}.` },
   { prompt: `How far is the sensor from the nearest boundary point on its right?`, answer: [dr], explanation: `The nearest boundary point to the right is ${n(right)}, and ${n(right)} − ${n(t)} = ${n(dr)}. The smaller of the two distances, ${n(r)}, is the largest radius.` },
   { prompt: `Does S contain every one of its boundary points? Enter 1 for yes, 0 for no.`, answer: [S.closed], explanation: closedWhy(S) }
  ] }; }
});

/* For q05c: the whole numbers that lie in S, and how many of them are interior (the beacons). */
function wholeList(p) { const S = analyse(p), lo = Math.min(...S.cand), hi = Math.max(...S.cand), out = []; for (let x = lo; x <= hi; x++) if (S.inS(x)) out.push(x); return out; }
function wholeMarks(p) { return wholeList(p).length; }
function beacons(p) { const S = analyse(p); return wholeList(p).length - S.bd.filter(i => i.at).length; }

})();
