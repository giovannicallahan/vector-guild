/* Topology: shape without size mission generators, file a: q01–q10. Shape and helpers: docs/PACK-FORMAT.md §3 and game/gen-core.js.
   build(canonical) must reproduce the authored text in missions-a.js exactly. */
(function(){
'use strict';
const G = window.Gen, { n, plus, par } = G;
/* Bounded retry: try draw() up to 1000 times until ok(p); otherwise fall back to the canonical parameters. */
const tryDraw = (make, ok, canonical) => { for (let i = 0; i < 1000; i++) { const p = make(); if (ok(p)) return p; } return JSON.parse(JSON.stringify(canonical)); };
const r2 = x => Math.round(x * 100) / 100;
const plural = (k, one, many) => `${n(k)} ${k === 1 ? one : many}`;
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = k => String(k).split('').map(c => SUP[c]).join('');
/* Finite sets of nodes 1..N are bit masks: node i is bit i − 1. */
const members = m => { const out = []; for (let i = 0; i < 6; i++) if (m & (1 << i)) out.push(i + 1); return out; };
const size = m => members(m).length;
const fmt = m => m ? `{${members(m).join(', ')}}` : '∅';
const order = list => list.slice().sort((x, y) => size(x) - size(y) || x - y);
const fmtList = list => order(list).map(fmt).join(', ');
const joinAnd = items => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
/* Close a family of masks under unions and intersections and add ∅ and X: always a topology on X. */
const closeUp = (seed, full) => { const s = new Set([0, full, ...seed]); let grew = true;
 while (grew) { grew = false; const a = [...s]; for (const x of a) for (const y of a) for (const z of [x | y, x & y]) if (!s.has(z)) { s.add(z); grew = true; } }
 return order([...s]); };
/* The first way a list fails to be a topology on X, or null if it is one (pairs suffice for a finite list). */
const failure = (list, full) => { const s = new Set(list);
 if (!s.has(0)) return { kind: 'empty' };
 if (!s.has(full)) return { kind: 'whole' };
 const a = order(list);
 for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) {
  if (!s.has(a[i] | a[j])) return { kind: 'union', A: a[i], B: a[j], C: a[i] | a[j] };
  if (!s.has(a[i] & a[j])) return { kind: 'meet', A: a[i], B: a[j], C: a[i] & a[j] }; }
 return null; };
/* A random topology on N points with at most `most` open sets, built from 1 to 3 random proper subsets. */
const randomTopology = (R, N, most) => { const full = (1 << N) - 1;
 for (let i = 0; i < 1000; i++) { const k = R.int(1, 3), seed = []; for (let j = 0; j < k; j++) seed.push(R.int(1, full - 1));
  const t = closeUp(seed, full); if (t.length <= most) return t; }
 return [0, 1, full]; };
const sameList = (a, b) => a.length === b.length && order(a).every((x, i) => x === order(b)[i]);

/* q05: the set [a, b⟩ ∪ ⟨c, d] ∪ {e}; ca … cd are 1 for a closed end; e = 0 means no single point. */
const q05set = ({ a, b, c, d, ca, cb, cc, cd, e }) => {
 const inS = x => (x > a || (x === a && ca)) && (x < b || (x === b && cb)) || (x > c || (x === c && cc)) && (x < d || (x === d && cd)) || (e > 0 && x === e);
 const text = `${ca ? '[' : '('}${n(a)}, ${n(b)}${cb ? ']' : ')'} ∪ ${cc ? '[' : '('}${n(c)}, ${n(d)}${cd ? ']' : ')'}${e > 0 ? ` ∪ {${n(e)}}` : ''}`;
 const cand = [...new Set([a, b, c, d, ...(e > 0 ? [e] : [])])].sort((x, y) => x - y);
 const info = cand.map(p => { const at = inS(p), l = inS(p - 0.5), r = inS(p + 0.5); return { p, at, interior: at && l && r, boundary: !(at && l && r) && (at || l || r) }; });
 const bd = info.filter(i => i.boundary), notInt = info.find(i => i.at && !i.interior), missing = bd.find(i => !i.at);
 return { text, cand, info, k: bd.length, open: notInt ? 0 : 1, closed: missing ? 0 : 1, notInt, missing };
};
/* q06: the family whose union or intersection is tested for being open. fam is an index into these five kinds. */
const q06fam = (fam, m, K) => [
 { text: `the set of points that lie in every one of the intervals (−1 ÷ k, ${n(m)} + 1 ÷ k) for k = 1, 2, 3 and so on for ever`, open: 0,
   why: `A point x lies in every one of those intervals exactly when −1 ÷ k < x < ${n(m)} + 1 ÷ k for every k. As k grows, −1 ÷ k climbs towards 0 and ${n(m)} + 1 ÷ k falls towards ${n(m)}, so the points that survive are those with 0 ≤ x ≤ ${n(m)}: the set is [0, ${n(m)}]. Every ball round 0 contains negative numbers, which are not in the set, so it is not open.` },
 { text: `the union of all the closed intervals [1 ÷ k, ${n(m)} − 1 ÷ k] for k = 2, 3, 4 and so on for ever`, open: 1,
   why: `Any x with 0 < x < ${n(m)} lies in one of those closed intervals once k is large enough, while 0, ${n(m)} and points beyond them lie in none. So the union is the open interval (0, ${n(m)}), which is open, even though each piece is closed.` },
 { text: `the set of points that lie in every one of the intervals (−1 ÷ k, ${n(m)} + 1 ÷ k) for k = 1 to ${n(K)}`, open: 1,
   why: `These intervals shrink as k grows, so the one for k = ${n(K)} lies inside all the others and the intersection is (−1 ÷ ${n(K)}, ${n(m)} + 1 ÷ ${n(K)}). That is an open interval: finitely many open sets always meet in an open set.` },
 { text: `the union of all the open intervals (1 ÷ k, ${n(m)}) for k = 1, 2, 3 and so on for ever`, open: 1,
   why: `Any x with 0 < x < ${n(m)} lies in one of those intervals once 1 ÷ k is below x, so the union is (0, ${n(m)}). Any union of open sets is open, and indeed (0, ${n(m)}) is open.` },
 { text: `the set of points that lie in every one of the intervals (−1 ÷ k, ${n(m)}) for k = 1, 2, 3 and so on for ever`, open: 0,
   why: `A point x lies in every one of those intervals exactly when −1 ÷ k < x < ${n(m)} for every k. As k grows, −1 ÷ k climbs towards 0, so the set is [0, ${n(m)}): it contains 0 but not ${n(m)}. Every ball round 0 contains negative numbers, which are not in the set, so it is not open.` }
][fam];
/* q09: all unions of basis sets (∅ is the union of none). */
const unions = basis => { const s = new Set(); for (let c = 0; c < 1 << basis.length; c++) { let u = 0; basis.forEach((b, i) => { if (c & (1 << i)) u |= b; }); s.add(u); } return order([...s]); };
const isBasis = (basis, full) => { if (basis.reduce((u, b) => u | b, 0) !== full) return false;
 for (const A of basis) for (const B of basis) { const I = A & B; if (!I) continue;
  for (const x of members(I)) if (!basis.some(C => (C & ~I) === 0 && (C & (1 << (x - 1))))) return false; }
 return true; };
/* q10: points of Y are written a, b, c; a map is a list of image indices. */
const Y = ['a', 'b', 'c'];
const fmtY = m => { const out = []; for (let i = 0; i < 3; i++) if (m & (1 << i)) out.push(Y[i]); return out.length ? `{${out.join(', ')}}` : '∅'; };
const pre = (f, V) => f.reduce((m, y, i) => (V & (1 << y)) ? m | (1 << i) : m, 0);
const contin = (f, TX, TY) => TY.every(V => TX.includes(pre(f, V)));
const allMaps = (NX, NY) => { const out = []; for (let c = 0; c < Math.pow(NY, NX); c++) { const f = []; let r = c; for (let i = 0; i < NX; i++) { f.push(r % NY); r = Math.floor(r / NY); } out.push(f); } return out; };
const fmtMap = f => f.map((y, i) => `f(${i + 1}) = ${Y[y]}`).join(', ');

window.MISSION_GEN = window.MISSION_GEN || {};
Object.assign(window.MISSION_GEN, {
 /* Two grid points; gaps of 1 to 8 across and up, both non-zero, the larger at least 2. The sum of squares is never a
    perfect square, and the Euclidean distance is kept off rounding ties and off values whose 4-place form is short.
    Never the worked example's gaps, 3 and 4. */
 q01: {
  canonical: { x1: 2, y1: -1, x2: 7, y2: 3 },
  draw: R => tryDraw(() => { const x1 = R.int(-4, 6), y1 = R.int(-4, 6); return { x1, y1, x2: x1 + R.nz(-8, 8), y2: y1 + R.nz(-8, 8) }; }, ({ x1, y1, x2, y2 }) => {
   const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1), s = dx * dx + dy * dy, e = Math.sqrt(s), f = e * 100 - Math.floor(e * 100);
   return Math.max(dx, dy) >= 2 && Math.round(e) * Math.round(e) !== s && Math.abs(f - 0.5) > 0.01 && /\.\d{3}/.test(n(e)) && !(dx * dy === 12 && dx + dy === 7); }, { x1: 2, y1: -1, x2: 7, y2: 3 }),
  build: ({ x1, y1, x2, y2 }) => { const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1), s = dx * dx + dy * dy, e = Math.sqrt(s), eu = r2(e), tx = dx + dy, mx = Math.max(dx, dy);
   const ex = `${n(e)}`; return {
   prompt: `Two survey rovers stand on the Survey Grid at P = (${n(x1)}, ${n(y1)}) and Q = (${n(x2)}, ${n(y2)}), with coordinates in kilometres. Enter the Euclidean distance from P to Q to 2 decimal places, then the taxicab distance, then the maximum distance, all in kilometres.`,
   answer: [eu, tx, mx],
   hints: ['Find the gap across, the difference of the x coordinates without its sign, and the gap up, the same for the y coordinates. All three metrics are built from those two gaps.', 'Euclidean: the square root of the sum of the two squared gaps. Taxicab: the sum of the two gaps. Maximum: the larger of the two gaps.'],
   solution: `The gap across is |${n(x2)} − ${par(x1)}| = ${n(dx)} and the gap up is |${n(y2)} − ${par(y1)}| = ${n(dy)}. Euclidean: √(${n(dx)}² + ${n(dy)}²) = √${n(s)} ≈ ${ex}, which is ${eu.toFixed(2)} km to 2 decimal places. Taxicab: ${n(dx)} + ${n(dy)} = ${n(tx)} km. Maximum: the larger of ${n(dx)} and ${n(dy)}, which is ${n(mx)} km.`,
   guidance: [
    { prompt: `What are the gap across, |${n(x2)} − ${par(x1)}|, and the gap up, |${n(y2)} − ${par(y1)}|?`, answer: [dx, dy], explanation: `|${n(x2)} − ${par(x1)}| = |${n(x2 - x1)}| = ${n(dx)} and |${n(y2)} − ${par(y1)}| = |${n(y2 - y1)}| = ${n(dy)}. A distance never has a sign, so the gaps are taken without theirs.` },
    { prompt: `Square the two gaps, add them and take the square root. What is the Euclidean distance, to 2 decimal places?`, answer: [eu], explanation: `${n(dx)}² + ${n(dy)}² = ${n(dx * dx)} + ${n(dy * dy)} = ${n(s)}, and √${n(s)} ≈ ${ex}, which is ${eu.toFixed(2)} to 2 decimal places. This is the straight-line distance a beam of light would cover.` },
    { prompt: `What are the taxicab distance (the sum of the gaps) and the maximum distance (the larger gap)?`, answer: [tx, mx], explanation: `Taxicab: ${n(dx)} + ${n(dy)} = ${n(tx)}, the distance driven along the grid lines. Maximum: the larger of ${n(dx)} and ${n(dy)} is ${n(mx)}.` }
   ] }; }
 },
 /* Taxicab radius r from 3 to 10 and maximum radius s from 3 to 9 (the worked example uses 2 for both); the beacon's
    coordinates only change the story. */
 q02: {
  canonical: { cx: 4, cy: 2, r: 3, s: 4 },
  draw: R => ({ cx: R.int(0, 9), cy: R.int(0, 9), r: R.int(3, 10), s: R.int(3, 9) }),
  build: ({ cx, cy, r, s }) => { const tri = r * (r + 1) / 2, tc = 1 + 4 * tri, side = 2 * s + 1, mc = side * side;
   const run = r === 3 ? '1 + 2 + 3' : `1 + 2 + … + ${n(r)}`; return {
   prompt: `A beacon stands at the grid point (${n(cx)}, ${n(cy)}) of the Survey Grid, and rovers stop only at grid points: points whose two coordinates are whole numbers. A wheeled rover drives along the grid lines, so its distance is the taxicab metric. A drone runs its east–west and north–south motors at the same time, so its distance is the maximum metric. Count the beacon itself in both answers. Enter how many grid points are at taxicab distance at most ${n(r)} from the beacon, then how many are at maximum distance at most ${n(s)}.`,
   answer: [tc, mc],
   hints: ['In the taxicab metric the grid points at distance exactly k, for k at least 1, form a diamond of 4k points round the beacon. Add these diamonds up and add 1 for the beacon.', 'In the maximum metric each coordinate may differ from the beacon’s by at most the radius, so the points fill a square: count the whole numbers each coordinate may take, then multiply.'],
   solution: `Taxicab: the beacon, then diamonds of 4 × 1, 4 × 2, …, 4 × ${n(r)} points at distances 1 to ${n(r)}. That is 1 + 4 × (${run}) = 1 + 4 × ${n(tri)} = ${n(tc)} grid points, which is 2r² + 2r + 1 with r = ${n(r)}. Maximum: each coordinate may differ from the beacon’s by at most ${n(s)}, so each has 2 × ${n(s)} + 1 = ${n(side)} possible values, and ${n(side)} × ${n(side)} = ${n(mc)} grid points.`,
   guidance: [
    { prompt: `How many grid points are at taxicab distance exactly ${n(r)} from the beacon?`, answer: [4 * r], explanation: `They form a diamond whose corners are ${n(r)} steps from the beacon along each axis. Each of its four edges holds ${n(r)} points when only one corner is counted per edge, so there are 4 × ${n(r)} = ${n(4 * r)}.` },
    { prompt: `Add the beacon and the diamonds for distances 1 to ${n(r)}. How many grid points are at taxicab distance at most ${n(r)}?`, answer: [tc], explanation: `1 + 4 × (${run}) = 1 + 4 × ${n(tri)} = ${n(tc)}.` },
    { prompt: `In the maximum metric, how many whole numbers are within ${n(s)} of the beacon’s x coordinate ${n(cx)}, and how many grid points are at maximum distance at most ${n(s)}?`, answer: [side, mc], explanation: `From ${n(cx - s)} to ${n(cx + s)} there are 2 × ${n(s)} + 1 = ${n(side)} whole numbers, and the y coordinate has as many choices, so ${n(side)} × ${n(side)} = ${n(mc)} grid points.` }
   ] }; }
 },
 /* d(x, y) = a and d(y, z) = b with a ≠ b; the courier's log is 6 to 8 stops from A–E with at least one repeated stop and
    at least two changes. Never the worked example's distances 5 and 2. */
 q03: {
  canonical: { a: 7, b: 3, route: ['A', 'C', 'C', 'B', 'A', 'E', 'D'] },
  draw: R => tryDraw(() => { const len = R.int(6, 8), route = []; for (let i = 0; i < len; i++) route.push(R.pick(['A', 'B', 'C', 'D', 'E'])); return { a: R.int(2, 15), b: R.int(1, 14), route }; },
   ({ a, b, route }) => { const ch = route.slice(1).filter((x, i) => x !== route[i]).length; return a !== b && !(a === 5 && b === 2) && ch >= 2 && ch < route.length - 1; }, { a: 7, b: 3, route: ['A', 'C', 'C', 'B', 'A', 'E', 'D'] }),
  build: ({ a, b, route }) => { const big = a + b, small = Math.abs(a - b), steps = route.slice(1).map((x, i) => x === route[i] ? 0 : 1), ch = steps.reduce((s, x) => s + x, 0);
   const low = a > b ? `d(x, y) ≤ d(x, z) + d(z, y) gives ${n(a)} ≤ d(x, z) + ${n(b)}, so d(x, z) ≥ ${n(a)} − ${n(b)} = ${n(small)}, reached when z lies on the straight segment from x to y`
    : `d(y, z) ≤ d(y, x) + d(x, z) gives ${n(b)} ≤ ${n(a)} + d(x, z), so d(x, z) ≥ ${n(b)} − ${n(a)} = ${n(small)}, reached when x lies on the straight segment from y to z`; return {
   prompt: `Three relay masts x, y and z stand on a flat plain, and d is the usual straight-line (Euclidean) distance in kilometres. Mast y is ${n(a)} km from x and ${n(b)} km from z, so d(x, y) = ${n(a)} and d(y, z) = ${n(b)}; the masts may stand anywhere that fits these two distances. Enter the smallest possible value of d(x, z), then the largest possible value. Then a courier’s log uses the discrete metric on the stations: two different stations are at distance 1, and a station is at distance 0 from itself. The courier’s stops, in order, were ${route.join(', ')}. Enter the total discrete distance travelled: the sum of the distances between consecutive stops.`,
   answer: [small, big, ch],
   hints: ['The triangle inequality, d(x, z) ≤ d(x, y) + d(y, z), gives the largest value straight away.', 'For the smallest value, use the triangle inequality with the longer of the two given distances on the left. In the courier’s log, a stop that repeats the one before adds 0.'],
   solution: `The triangle inequality gives d(x, z) ≤ ${n(a)} + ${n(b)} = ${n(big)}, reached when y lies on the straight segment from x to z. For the smallest value, the triangle inequality ${low}. So d(x, z) can be anything from ${n(small)} to ${n(big)} km. In the courier’s log the distances between consecutive stops are ${steps.join(', ')}: ${plural(ch, 'step changes', 'steps change')} station and the others repeat one, so the total discrete distance is ${n(ch)}.`,
   guidance: [
    { prompt: `By the triangle inequality, what is the largest d(x, z) can be?`, answer: [big], explanation: `d(x, z) ≤ d(x, y) + d(y, z) = ${n(a)} + ${n(b)} = ${n(big)}. It equals ${n(big)} when the masts stand in a line with y in the middle.` },
    { prompt: `Use the triangle inequality with the longer given distance on the left. What is the smallest d(x, z) can be?`, answer: [small], explanation: `The triangle inequality ${low}.` },
    { prompt: `Write 1 for each step of the log that changes station and 0 for each that stays. What is the total?`, answer: [ch], explanation: `From ${route.join(', ')} the steps give ${steps.join(', ')}, which add up to ${n(ch)}.` }
   ] }; }
 },
 /* An interval (a, b) with a point x on the half-grid strictly inside, and a pad 0 < x < w, 0 < y < h with a lamp at a
    whole-number point strictly inside. */
 q04: {
  canonical: { a: 2, b: 9, x: 6.5, w: 10, h: 6, px: 3, py: 4 },
  draw: R => { const a = R.int(0, 6), b = a + R.int(4, 14), x = a + R.int(1, 2 * (b - a) - 1) / 2, w = R.int(4, 12), h = R.int(4, 12); return { a, b, x, w, h, px: R.int(1, w - 1), py: R.int(1, h - 1) }; },
  build: ({ a, b, x, w, h, px, py }) => { const L = x - a, Rt = b - x, r1 = Math.min(L, Rt), gaps = [px, w - px, py, h - py], r2v = Math.min(...gaps); return {
   prompt: `A survey cable runs along the open interval (${n(a)}, ${n(b)}) of the x-axis, measured in metres with the usual distance, and a sensor sits at x = ${n(x)}. Enter the largest radius r for which the ball B(${n(x)}, r) lies inside (${n(a)}, ${n(b)}). Then a landing pad is the open rectangle of points (x, y) with 0 < x < ${n(w)} and 0 < y < ${n(h)}, with the Euclidean metric, and a lamp stands at (${n(px)}, ${n(py)}). Enter the largest radius of a ball round the lamp that lies inside the pad.`,
   answer: [r1, r2v],
   hints: ['On a line, B(x, r) is the open interval from x − r to x + r. It stays inside (a, b) as long as neither of its ends passes a or b.', 'A round ball stays inside an open rectangle as long as its radius is no more than the distance from its centre to each of the four sides.'],
   solution: `The sensor is ${n(x)} − ${n(a)} = ${n(L)} from the left end and ${n(b)} − ${n(x)} = ${n(Rt)} from the right end. B(${n(x)}, r) = (${n(x)} − r, ${n(x)} + r) stays inside while r is at most both, so the largest radius is ${n(r1)}. The lamp is ${n(px)} from the side x = 0, ${n(w - px)} from the side x = ${n(w)}, ${n(py)} from the side y = 0 and ${n(h - py)} from the side y = ${n(h)}. The ball can grow until it touches the nearest side, so the largest radius is ${n(r2v)}. Every point of the cable and of the pad has some room like this, which is why both sets are open.`,
   guidance: [
    { prompt: `How far is the sensor from each end of the interval: from ${n(a)}, then from ${n(b)}?`, answer: [L, Rt], explanation: `${n(x)} − ${n(a)} = ${n(L)} and ${n(b)} − ${n(x)} = ${n(Rt)}.` },
    { prompt: `What is the largest radius of a ball round the sensor inside the interval?`, answer: [r1], explanation: `The ball (${n(x)} − r, ${n(x)} + r) must not pass either end, so r can be at most the smaller distance, ${n(r1)}.` },
    { prompt: `How far is the lamp from the nearest side of the pad? That is the largest radius of a ball round it inside the pad.`, answer: [r2v], explanation: `The distances to the four sides are ${joinAnd(gaps.map(n))}. The smallest is ${n(r2v)}, so a ball of radius ${n(r2v)} just fits.` }
   ] }; }
 },
 /* Two intervals with whole-number ends, touching (b = c) or apart, with random brackets and sometimes a lone point e
    (e = 0 means none). A fifth of draws are all open with no point, a fifth all closed with no point, so the 1 or 0
    answers vary. The worked example has one interval, so no draw repeats it. */
 q05: {
  canonical: { a: 1, b: 4, c: 4, d: 7, ca: 1, cb: 0, cc: 0, cd: 1, e: 9 },
  draw: R => { const a = R.int(1, 4), b = a + R.int(1, 4), touch = R.next() < 0.35, c = touch ? b : b + R.int(2, 4), d = c + R.int(1, 4), mode = R.next();
   let ca = R.int(0, 1), cb = R.int(0, 1), cc = R.int(0, 1), cd = R.int(0, 1), e = 0;
   if (mode < 0.2) { ca = cb = cc = cd = 0; } else if (mode < 0.4) { ca = cb = cc = cd = 1; }
   else if (R.bool()) e = (c - b >= 2 && R.bool()) ? R.int(b + 1, c - 1) : d + R.int(2, 4);
   return { a, b, c, d, ca, cb, cc, cd, e }; },
  build: p => { const S = q05set(p), bdList = S.info.filter(i => i.boundary).map(i => n(i.p));
   const say = i => i.boundary ? (i.at ? `${n(i.p)} is in S, but every ball round it also holds points outside S, so it is a boundary point.` : `${n(i.p)} is not in S, but every ball round it meets S, so it is a boundary point.`) : `${n(i.p)} is in S and a small ball round it stays in S, so it is an interior point, not a boundary point.`;
   const openWhy = S.open ? 'Every point of S is an interior point, so S is open.' : `${n(S.notInt.p)} is in S but is not an interior point, so S is not open.`;
   const closedWhy = S.closed ? 'Every boundary point is in S, so S is closed.' : `The boundary point ${n(S.missing.p)} is not in S, so S is not closed.`;
   const cands = joinAnd(S.cand.map(n)); return {
   prompt: `A survey team marks the stretch S = ${S.text} on the x-axis, in kilometres from the grid beacon, with the usual distance. Enter the number of boundary points of S. Then enter 1 if S is open and 0 if it is not, then 1 if S is closed and 0 if it is not.`,
   answer: [S.k, S.open, S.closed],
   hints: ['Only the end points of the pieces, and a lone point, can be boundary points. For each one, ask: does every ball round it contain points of S and points outside S?', 'S is open when every point of S is an interior point. S is closed when it contains every one of its boundary points.'],
   solution: `Away from ${cands} every point is either well inside S or well outside it, so only these can be boundary points. ${S.info.map(say).join(' ')} So S has ${plural(S.k, 'boundary point', 'boundary points')}: ${joinAnd(bdList)}. ${openWhy} ${closedWhy}`,
   guidance: [
    { prompt: `Check the candidates ${cands} one at a time. How many of them are boundary points of S?`, answer: [S.k], explanation: `${S.info.map(say).join(' ')}` },
    { prompt: `Is every point of S an interior point? Enter 1 for yes, 0 for no.`, answer: [S.open], explanation: openWhy },
    { prompt: `Does S contain every one of its boundary points? Enter 1 for yes, 0 for no.`, answer: [S.closed], explanation: closedWhy }
   ] }; }
 },
 /* Three open intervals with a non-empty intersection; fam picks one of five families (two not open, three open), m is
    its whole-number end and K the last k of the finite family. */
 q06: {
  canonical: { a1: -2, b1: 6, a2: 1, b2: 9, a3: 0, b3: 5, fam: 0, m: 4, K: 5 },
  draw: R => tryDraw(() => { const iv = () => { const a = R.int(-6, 4); return [a, a + R.int(3, 12)]; }, [a1, b1] = iv(), [a2, b2] = iv(), [a3, b3] = iv();
   return { a1, b1, a2, b2, a3, b3, fam: R.int(0, 4), m: R.int(2, 9), K: R.int(3, 9) }; },
   p => Math.max(p.a1, p.a2, p.a3) < Math.min(p.b1, p.b2, p.b3) && !(p.a1 === -1 && p.b1 === 3 && p.a2 === 0 && p.b2 === 4), { a1: -2, b1: 6, a2: 1, b2: 9, a3: 0, b3: 5, fam: 0, m: 4, K: 5 }),
  build: ({ a1, b1, a2, b2, a3, b3, fam, m, K }) => { const L = Math.max(a1, a2, a3), Rt = Math.min(b1, b2, b3), F = q06fam(fam, m, K); return {
   prompt: `Three survey drones each cover an open stretch of the x-axis: (${n(a1)}, ${n(b1)}), (${n(a2)}, ${n(b2)}) and (${n(a3)}, ${n(b3)}). The points all three cover form their intersection, an open interval (p, q). Enter p, then q. Then the team looks at ${F.text}. Enter 1 if this set is open and 0 if it is not.`,
   answer: [L, Rt, F.open],
   hints: ['A point is in the intersection when it is in all three intervals, so it must be to the right of every left end and to the left of every right end.', 'Finitely many open sets always meet in an open set, and any union of open sets is open. An intersection of infinitely many open sets can fail to be open, so work out exactly which points the set holds.'],
   solution: `The intersection starts at the largest left end: the largest of ${n(a1)}, ${n(a2)} and ${n(a3)} is ${n(L)}. It stops at the smallest right end: the smallest of ${n(b1)}, ${n(b2)} and ${n(b3)} is ${n(Rt)}. So all three drones cover (${n(L)}, ${n(Rt)}), an open interval, as an intersection of finitely many open sets must be. Now the second set. ${F.why} So the last answer is ${F.open}.`,
   guidance: [
    { prompt: `What is the largest of the three left ends?`, answer: [L], explanation: `A point of the intersection must be to the right of ${n(a1)}, ${n(a2)} and ${n(a3)}, so of ${n(L)}, the largest of them.` },
    { prompt: `What is the smallest of the three right ends?`, answer: [Rt], explanation: `It must also be to the left of ${n(b1)}, ${n(b2)} and ${n(b3)}, so of ${n(Rt)}, the smallest of them.` },
    { prompt: `Now look at ${F.text}. Work out which points it holds. Is it open? Enter 1 for yes, 0 for no.`, answer: [F.open], explanation: F.why }
   ] }; }
 },
 /* A topology on 3 or 4 nodes (from closeUp) that is half the time broken by removing ∅, X, or a union or an
    intersection of two listed sets; m from 4 to 9 for the discrete topology (the worked example uses 3). */
 q07: {
  canonical: { N: 3, sets: [0, 1, 2, 7], m: 5 },
  draw: R => tryDraw(() => { const N = R.int(3, 4), full = (1 << N) - 1, t = randomTopology(R, N, 7);
   let sets = t.slice(); const u = R.next();
   if (u < 0.12) sets = sets.filter(x => x !== 0); else if (u < 0.24) sets = sets.filter(x => x !== full);
   else if (u < 0.55) { const inner = sets.filter(x => x !== 0 && x !== full && sets.some(A => sets.some(B => A !== x && B !== x && ((A | B) === x || (A & B) === x)))); if (inner.length) { const drop = R.pick(inner); sets = sets.filter(x => x !== drop); } }
   return { N, sets, m: R.int(4, 9) }; }, p => p.sets.length >= 3 && !(p.N === 3 && sameList(p.sets, [0, 2, 6, 7])), { N: 3, sets: [0, 1, 2, 7], m: 5 }),
  build: ({ N, sets, m }) => { const full = (1 << N) - 1, F = failure(sets, full), ok = F ? 0 : 1, both = sets.includes(0) && sets.includes(full) ? 1 : 0, FP = failure([...new Set([0, full, ...sets])], full), pairs = FP ? 0 : 1, dm = Math.pow(2, m);
   const proper = order(sets).filter(x => x !== 0 && x !== full);
   const eg = proper.length >= 2 ? `${fmt(proper[0])} ∪ ${fmt(proper[1])} = ${fmt(proper[0] | proper[1])} and ${fmt(proper[0])} ∩ ${fmt(proper[1])} = ${fmt(proper[0] & proper[1])}` : `${fmt(proper[0])} ∪ X = X and ${fmt(proper[0])} ∩ X = ${fmt(proper[0])}`;
   const why = !F ? `∅ and X are both listed, and every union and every intersection of two listed sets is listed again (for example ${eg}), so the list is a topology.`
    : F.kind === 'empty' ? 'The empty set ∅ is not in the list, so the list is not a topology.'
    : F.kind === 'whole' ? `The whole set X = ${fmt(full)} is not in the list, so the list is not a topology.`
    : F.kind === 'union' ? `${fmt(F.A)} ∪ ${fmt(F.B)} = ${fmt(F.C)} is not in the list, so the list is not a topology.`
    : `${fmt(F.A)} ∩ ${fmt(F.B)} = ${fmt(F.C)} is not in the list, so the list is not a topology.`;
   const pairWhy = pairs ? `Every union and every intersection of two listed sets is in the list${both ? '' : ' (putting in the missing ∅ or X changes nothing here)'}.` : `${FP.kind === 'union' ? `${fmt(FP.A)} ∪ ${fmt(FP.B)}` : `${fmt(FP.A)} ∩ ${fmt(FP.B)}`} = ${fmt(FP.C)} is not in the list.`; return {
   prompt: `The relay network has nodes 1 to ${n(N)}, so X = ${fmt(full)}. A technician proposes these subsets as the open sets: ${fmtList(sets)}. Enter 1 if this list is a topology on X and 0 if it is not. Then a larger network has ${n(m)} nodes and uses the discrete topology, in which every subset is open. Enter how many open sets it has, counting ∅ and the whole network.`,
   answer: [ok, dm],
   hints: ['Check three things: ∅ and X are in the list; the union of any two listed sets is listed; the intersection of any two listed sets is listed. For a finite list, checking pairs is enough.', 'A subset is fixed by deciding, for each node in turn, whether it is in or out.'],
   solution: `${why} So the first answer is ${ok}. In the discrete topology every subset is open. Each of the ${n(m)} nodes is either in a subset or out of it, so there are 2${sup(m)} = ${n(dm)} subsets, ∅ and the whole network included.`,
   guidance: [
    { prompt: `Are ∅ and X both in the list? Enter 1 for yes, 0 for no.`, answer: [both], explanation: both ? `Both ∅ and ${fmt(full)} are listed.` : (sets.includes(0) ? `${fmt(full)} is missing.` : '∅ is missing.') },
    { prompt: `Is the union and the intersection of every pair of listed sets also in the list? Enter 1 for yes, 0 for no.`, answer: [pairs], explanation: pairWhy },
    { prompt: `How many subsets does a set of ${n(m)} nodes have?`, answer: [dm], explanation: `Two choices, in or out, for each of ${n(m)} nodes: 2${sup(m)} = ${n(dm)}.` }
   ] }; }
 },
 /* A topology on 3 to 5 nodes with at most 8 open sets, and a node p. Never the worked example (X = {1, 2, 3} with
    ∅, {1}, {1, 2}, X). */
 q08: {
  canonical: { N: 4, sets: [0, 1, 3, 12, 13, 15], p: 1 },
  draw: R => tryDraw(() => { const N = R.int(3, 5), full = (1 << N) - 1; let sets = randomTopology(R, N, 8);
   if (R.next() < 0.4) { const A = R.int(1, full - 1), B = R.int(1, full - 1); sets = closeUp([A, full & ~A, B], full); }
   return { N, sets, p: R.int(1, N) }; }, p => p.sets.length <= 8 && p.sets.length >= 4 && !(p.N === 3 && sameList(p.sets, [0, 1, 3, 7])), { N: 4, sets: [0, 1, 3, 12, 13, 15], p: 1 }),
  build: ({ N, sets, p }) => { const full = (1 << N) - 1, bit = 1 << (p - 1), closed = order(sets.map(U => full & ~U)), both = order(sets.filter(U => sets.includes(full & ~U)));
   const withP = closed.filter(C => C & bit), cl = withP.reduce((m, C) => m & C, full), k = size(cl), only = withP.length === 1; return {
   prompt: `A relay network on the nodes X = ${fmt(full)} has these open sets: ${fmtList(sets)}. A closed set is the complement of an open set: the nodes of X that are not in it. Enter how many sets are both open and closed. Then enter how many nodes are in the closure of {${n(p)}}, the smallest closed set that contains node ${n(p)}.`,
   answer: [both.length, k],
   hints: ['Write down the complement of each open set: those are the closed sets. Count the sets that appear in both lists.', 'The closure of {p} is the intersection of all the closed sets that contain p.'],
   solution: `The closed sets, the complements of the open sets, are ${fmtList(closed)}. The sets in both lists are ${joinAnd(both.map(fmt))}, so ${n(both.length)} sets are both open and closed. ${only ? `The only closed set that contains node ${n(p)} is X itself` : `The closed sets that contain node ${n(p)} are ${joinAnd(withP.map(fmt))}. Their intersection is ${fmt(cl)}`}, so the closure of {${n(p)}} has ${plural(k, 'node', 'nodes')}.`,
   guidance: [
    { prompt: `Take the complement of each open set. How many of these complements are themselves open?`, answer: [both.length], explanation: `The complements are ${fmtList(closed)}. Of these, ${joinAnd(both.map(fmt))} are also open: ${n(both.length)} sets.` },
    { prompt: `Which closed sets contain node ${n(p)}? How many nodes are in their intersection?`, answer: [k], explanation: only ? `Only X = ${fmt(full)} contains ${n(p)}, so the closure is all ${plural(k, 'node', 'nodes')}.` : `The closed sets containing ${n(p)} are ${joinAnd(withP.map(fmt))}, and they have ${fmt(cl)} in common: ${plural(k, 'node', 'nodes')}.` }
   ] }; }
 },
 /* A basis of 3 or 4 sets on 4 or 5 nodes (it covers X and passes the intersection rule), and a test set S that is
    half the time a union of basis sets. */
 q09: {
  canonical: { N: 4, basis: [1, 4, 3, 12], S: 6 },
  draw: R => tryDraw(() => { const N = R.int(4, 5), full = (1 << N) - 1, k = R.int(3, 4), basis = []; for (let i = 0; i < k; i++) basis.push(R.int(1, full));
   let S; if (R.bool()) { S = 0; basis.forEach(b => { if (R.bool()) S |= b; }); } else S = R.int(1, full);
   return { N, basis, S }; }, ({ N, basis, S }) => { const full = (1 << N) - 1; return new Set(basis).size === basis.length && !basis.includes(full) && isBasis(basis, full) && S > 0 && S !== full && !basis.includes(S); }, { N: 4, basis: [1, 4, 3, 12], S: 6 }),
  build: ({ N, basis, S }) => { const full = (1 << N) - 1, U = unions(basis), inside = basis.filter(b => (b & ~S) === 0), u = inside.reduce((m, b) => m | b, 0), open = u === S ? 1 : 0;
   const miss = members(S & ~u);
   const insideText = inside.length > 1 ? `The basis sets inside ${fmt(S)} are ${joinAnd(inside.map(fmt))}, and their union is ${fmt(u)}` : inside.length ? `The only basis set inside ${fmt(S)} is ${fmt(u)}, so the union of those inside is ${fmt(u)}` : `No basis set fits inside ${fmt(S)}, so the union of those that do is ∅`;
   const verdict = open ? `That is all of ${fmt(S)}, so ${fmt(S)} is open.` : `That misses node${miss.length > 1 ? 's' : ''} ${joinAnd(miss.map(String))}, so ${fmt(S)} is not open.`; return {
   prompt: `The relay engineers describe the open sets on X = ${fmt(full)} by a basis: ${basis.map(fmt).join(', ')}. The open sets are all the unions of basis sets, with ∅ counted as the union of none. Enter how many open sets this gives. Then enter 1 if ${fmt(S)} is open and 0 if it is not.`,
   answer: [U.length, open],
   hints: ['List the basis sets, then their unions two at a time, three at a time and so on, crossing out repeats. Do not forget ∅.', 'A set is open exactly when the basis sets that fit inside it have the whole set as their union.'],
   solution: `The unions of basis sets are ${fmtList(U)}: ${n(U.length)} open sets, ∅ included. ${insideText}. ${verdict}`,
   guidance: [
    { prompt: `Form every union of basis sets and cross out repeats. How many different sets are there, counting ∅?`, answer: [U.length], explanation: `They are ${fmtList(U)}: ${n(U.length)} sets.` },
    { prompt: `How many nodes are in the union of the basis sets that fit inside ${fmt(S)}?`, answer: [size(u)], explanation: `${insideText}, with ${plural(size(u), 'node', 'nodes')}.` },
    { prompt: `Is that union all of ${fmt(S)}? Enter 1 for yes, 0 for no.`, answer: [open], explanation: verdict }
   ] }; }
 },
 /* Spaces X on 2 or 3 nodes and Y on 2 or 3 dishes (not both 3, so at most 9 maps to check), random topologies, and a
    map f given by its list of images (0 = a, 1 = b, 2 = c). */
 q10: {
  canonical: { NX: 3, TX: [0, 1, 3, 7], NY: 2, TY: [0, 1, 3], f: [0, 1, 1] },
  draw: R => tryDraw(() => { const NX = R.int(2, 3), NY = NX === 3 ? 2 : R.int(2, 3), f = []; for (let i = 0; i < NX; i++) f.push(R.int(0, NY - 1));
   return { NX, TX: randomTopology(R, NX, 6), NY, TY: randomTopology(R, NY, 6), f }; },
   p => { const c = allMaps(p.NX, p.NY).filter(g => contin(g, p.TX, p.TY)).length; return c < Math.pow(p.NY, p.NX) && !(p.NX === 2 && p.NY === 2 && sameList(p.TX, [0, 1, 3]) && sameList(p.TY, [0, 1, 2, 3])); }, { NX: 3, TX: [0, 1, 3, 7], NY: 2, TY: [0, 1, 3], f: [0, 1, 1] }),
  build: ({ NX, TX, NY, TY, f }) => { const fullX = (1 << NX) - 1, fullY = (1 << NY) - 1, Ys = fmtY(fullY), ok = contin(f, TX, TY) ? 1 : 0, maps = allMaps(NX, NY), good = maps.filter(g => contin(g, TX, TY)).sort((g, h) => g.join('') < h.join('') ? -1 : 1), tot = maps.length;
   const proper = order(TY).filter(V => V !== 0 && V !== fullY), checks = proper.map(V => `f⁻¹(${fmtY(V)}) = ${fmt(pre(f, V))}, which is ${TX.includes(pre(f, V)) ? 'open' : 'not open'}`);
   const bad = proper.find(V => !TX.includes(pre(f, V)));
   const fWhy = `f⁻¹(∅) = ∅ and f⁻¹(Y) = X are always open. ${checks.length ? checks.join('; ') + '.' : ''} ${ok ? 'Every open set of Y pulls back to an open set of X, so f is continuous.' : `Because f⁻¹(${fmtY(bad)}) is not open, f is not continuous.`}`;
   const tuple = g => `(${g.map(y => Y[y]).join(', ')})`; return {
   prompt: `A relay map sends the nodes of X = ${fmt(fullX)} to the dishes of Y = ${Ys}. The open sets of X are ${fmtList(TX)}, and the open sets of Y are ${order(TY).map(fmtY).join(', ')}. The map is ${fmtMap(f)}. Enter 1 if f is continuous and 0 if it is not. Then enter how many of all the ${n(tot)} maps from X to Y are continuous.`,
   answer: [ok, good.length],
   hints: ['f is continuous when the preimage f⁻¹(V), the set of nodes that f sends into V, is open in X for every open set V of Y.', 'To count, list every map by its images of the nodes in order and run the same preimage test on each. A constant map, which sends every node to one dish, always passes.'],
   solution: `${fWhy} Listing each map as (${Array.from({ length: NX }, (_, i) => `f(${i + 1})`).join(', ')}) and running the same test on all ${n(tot)}, the continuous ones are ${joinAnd(good.map(tuple))}: ${n(good.length)} maps.`,
   guidance: [
    { prompt: `Find the preimage under f of each open set of Y. Are they all open in X? Enter 1 for yes, 0 for no.`, answer: [ok], explanation: fWhy },
    { prompt: `Run the same test on every one of the ${n(tot)} maps from X to Y. How many pass?`, answer: [good.length], explanation: `The maps that pass are ${joinAnd(good.map(tuple))}: ${n(good.length)} of the ${n(tot)}.` }
   ] }; }
 }
});
})();
