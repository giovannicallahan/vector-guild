/* Independent oracles for Topology: shape without size practice missions, file 1 of 8: q01b–q05d (game/realms/topo/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const TAXI = (dx, dy) => Math.abs(dx) + Math.abs(dy), MAXD = (dx, dy) => Math.max(Math.abs(dx), Math.abs(dy));
/* Grid points (whole-number coordinates) found by scanning a window round the centre, never by a formula. */
const countGrid = (metric, R, test) => {
  let n = 0;
  for (let x = -R - 1; x <= R + 1; x++) for (let y = -R - 1; y <= R + 1; y++) if (test(metric(x, y))) n++;
  return n;
};
/* Line sets: pieces are [a, b, closedLeft, closedRight] intervals, pts are isolated points. A point is tested with a ball
   of radius 1e-6 (every gap in these draws is at least 0.5): boundary = the ball holds points in S and points outside S;
   interior = the ball holds only points of S. */
const inS = (p, x) => {
  for (const [a, b, lo, hi] of p.pieces) if ((x > a && x < b) || (x === a && lo) || (x === b && hi)) return true;
  return (p.pts || []).includes(x);
};
const E = 1e-6;
const cands = p => [...new Set([].concat(...p.pieces.map(q => [q[0], q[1]])).concat(p.pts || []))].sort((u, v) => u - v);
const status = (p, c) => {
  const s = [inS(p, c - E), inS(p, c), inS(p, c + E)];
  return { inside: s[1], boundary: s.some(v => v) && s.some(v => !v), interior: s.every(v => v) };
};
const boundaryOf = p => cands(p).filter(c => status(p, c).boundary);
/* Reachable set of d(x, w) along a chain: after adding a link of length c to a set [lo, hi] of possible distances, the
   new distances run from (0 if c lies in [lo, hi], else the gap to the nearer end) up to hi + c. */
const chain = (start, links) => {
  let lo = start, hi = start;
  for (const c of links) { const nlo = (lo <= c && c <= hi) ? 0 : Math.min(Math.abs(lo - c), Math.abs(hi - c)); lo = nlo; hi = hi + c; }
  return [lo, hi];
};
Object.assign(window.ORACLE, {
  /* P = (x1, y1), Q = (x2, y2): the two gaps, then the three metrics. */
  q01b: p => {
    const dx = p.x2 - p.x1, dy = p.y2 - p.y1;
    return [MAXD(dx, dy), TAXI(dx, dy), rd(Math.hypot(dx, dy), 2)];
  },
  /* B, P, Q: rover = taxicab(B,P) + taxicab(P,Q); drone = maximum(B,Q); difference. */
  q01c: p => {
    const rover = TAXI(p.px - p.bx, p.py - p.by) + TAXI(p.qx - p.px, p.qy - p.py), drone = MAXD(p.qx - p.bx, p.qy - p.by);
    return [rover, drone, rover - drone];
  },
  /* Rover (rx, ry), beacons bx[i], by[i]: nearest beacon index (1 to 3) in each metric, by comparing real distances. */
  q01d: p => {
    const pick = f => { let best = 0, bd = Infinity; for (let i = 0; i < 3; i++) { const d = f(p.bx[i] - p.rx, p.by[i] - p.ry); if (d < bd) { bd = d; best = i; } } return best + 1; };
    return [pick((dx, dy) => Math.hypot(dx, dy)), pick(TAXI), pick(MAXD)];
  },
  /* Mast (cx, cy): count the grid points at distance exactly k (taxicab) and exactly s (maximum) by scanning. */
  q02b: p => [
    countGrid(TAXI, p.k + 1, d => d === p.k),
    countGrid(MAXD, p.s + 1, d => d === p.s)
  ],
  /* Beacon (cx, cy): points of the max-metric field of radius s with no marker (taxicab > r); each new marker weighs w kg. */
  q02c: p => {
    let n = 0;
    for (let x = -p.s - 1; x <= p.s + 1; x++) for (let y = -p.s - 1; y <= p.s + 1; y++) if (MAXD(x, y) <= p.s && TAXI(x, y) > p.r) n++;
    return [n, n * p.w];
  },
  /* T = grid points within taxicab r, M = grid points within max distance s: find r and s by growing the radius until the
     scanned count matches (T and M are the printed counts). */
  q02d: p => {
    let r = 0; while (r < 300 && countGrid(TAXI, r, d => d <= r) < p.T) r++;
    let s = 0; while (s < 300 && countGrid(MAXD, s, d => d <= s) < p.M) s++;
    return [r, s];
  },
  /* a = d(X,Y), b = d(Y,Z), c = four reports of d(X,Z): scan every whole-number value t from 0 and keep those where the three
     lengths a, b, t can close a triangle; a report is possible when it is one of them. */
  q03b: p => {
    const ok = t => t <= p.a + p.b && p.a <= t + p.b && p.b <= t + p.a;
    let lo = null, hi = null;
    for (let t = 0; t <= p.a + p.b + 5; t++) if (ok(t)) { if (lo === null) lo = t; hi = t; }
    return [lo, hi, p.c.filter(ok).length];
  },
  /* a = d(X,Y), b = d(Y,Z), f litres per km: shortest direct from the triangle inequality scan; via Y is a + b. */
  q03c: p => {
    const ok = t => t <= p.a + p.b && p.a <= t + p.b && p.b <= t + p.a;
    let lo = null; for (let t = 0; t <= p.a + p.b + 5 && lo === null; t++) if (ok(t)) lo = t;
    const extra = p.a + p.b - lo;
    return [lo, extra, extra * p.f];
  },
  /* Chain of three links a, b, c: the range of d(x, w) built link by link. */
  q03d: p => chain(p.a, [p.b, p.c]),
  /* Rectangle x1 < x < x2, y1 < y < y2 with a point (px, py): the nearest side gives the radius. Interval (a, b) with t. */
  q04b: p => [Math.min(p.px - p.x1, p.x2 - p.px, p.py - p.y1, p.y2 - p.py), Math.min(p.t - p.a, p.b - p.t)],
  /* Pad 0 < x < w, 0 < y < h; zone radius z; bays (bx[i], by[i]). A ball of radius z fits when no point within z of the bay
     is on or beyond a side, which is when z is at most the distance to each side. */
  q04c: p => {
    const room = i => Math.min(p.bx[i], p.w - p.bx[i], p.by[i], p.h - p.by[i]);
    let n = 0, best = -Infinity;
    for (let i = 0; i < 3; i++) { if (room(i) >= p.z) n++; if (room(i) > best) best = room(i); }
    return [n, best];
  },
  /* Floor 0 < x < w, 0 < y < h, post (px, py): radius r = the nearest side; then count grid points at distance strictly less than r. */
  q04d: p => {
    const r = Math.min(p.px, p.w - p.px, p.py, p.h - p.py);
    return [r, countGrid(MAXD, r, d => d < r), countGrid(TAXI, r, d => d < r)];
  },
  /* pieces = the intervals as [a, b, closedLeft, closedRight]; no isolated points are drawn but any are included. */
  q05b: p => {
    const bd = boundaryOf(p);
    const open = cands(p).every(c => !status(p, c).inside || status(p, c).interior);
    return [bd.length, bd.filter(c => !status(p, c).inside).length, open ? 1 : 0];
  },
  /* pf = cost of a flag (per boundary point), pb = cost of a beacon (per interior whole-number mark). */
  q05c: p => {
    const cs = cands(p), flags = boundaryOf(p).length;
    let beacons = 0;
    for (let k = cs[0] - 2; k <= cs[cs.length - 1] + 2; k++) if (status(p, k).interior) beacons++;
    return [flags, beacons, flags * p.pf + beacons * p.pb];
  },
  /* t is a point of S: widen r in steps of 0.01 and test every sample on a 0.005 grid inside the ball (t - r, t + r); stop at the first one outside S. */
  q05d: p => {
    const bd = boundaryOf(p), at = j => Math.round((p.t + j / 200) * 1000) / 1000;
    let r = 0;
    for (let k = 1; k <= 5000; k++) {
      let all = true;
      for (let j = -(2 * k - 1); j <= 2 * k - 1; j++) if (!inS(p, at(j))) { all = false; break; }
      if (!all) break;
      r = k / 100;
    }
    return [bd.length, rd(r, 2), bd.every(c => status(p, c).inside) ? 1 : 0];
  }
});
})();
