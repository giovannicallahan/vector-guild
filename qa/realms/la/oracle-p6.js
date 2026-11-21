/* Independent oracles for linear algebra practice missions, file 6 of 14: q26–q30 (game/realms/la/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here.
   Written from the mission specification alone, before reading the generators. */
(function(){ 'use strict';

const near = (a, b) => Math.abs(a - b) < 1e-9;
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
/* Matrix times vector, row by row. */
const apply = (M, v) => M.map(row => dot(row, v));
const column = (A, j) => A.map(row => row[j]);
/* Stretch factor of M along v from the quotient (v·Mv)/(v·v), accepted only if Mv really is that multiple of v. */
const stretchAlong = (M, v) => {
  const Mv = apply(M, v), L = dot(v, Mv) / dot(v, v);
  return Mv.every((x, i) => near(x, L * v[i])) ? L : NaN;
};
/* Both roots of t² − (trace)t + det = 0 for a symmetric 2×2 table [[p, q], [q, r]], larger first. */
const symRoots = (p, q, r) => {
  const mid = (p + r) / 2, half = Math.sqrt(Math.max(0, (p - r) * (p - r) / 4 + q * q));
  return [mid + half, mid - half];
};
/* Gram table AᵀA of a two-column matrix, as [g11, g12, g22]. */
const gram = A => { const c0 = column(A, 0), c1 = column(A, 1); return [dot(c0, c0), dot(c0, c1), dot(c1, c1)]; };
/* Singular values of a two-column matrix: square roots of the roots of its Gram table, larger first. */
const singular = A => { const g = gram(A); return symRoots(g[0], g[1], g[2]).map(t => Math.sqrt(Math.max(0, t))); };
/* Search a grid of halves (or a finer step) for the value that makes test(value) true; NaN when none or several. */
const searchGrid = (lo, hi, step, test) => {
  let found = NaN, count = 0;
  for (let i = 0; lo + i * step <= hi + 1e-9; i++) { const v = lo + i * step; if (test(v)) { found = v; count++; } }
  return count === 1 ? found : NaN;
};

Object.assign(window.ORACLE, {
  /* Strain gauge: stress along u from the quotient; the other direction (1, y) found by search for a right angle;
     its stress by applying M to it and reading the multiple. */
  q26b: p => {
    const L = stretchAlong(p.M, p.u);
    const y = searchGrid(-6, 6, 0.5, t => near(p.u[0] + p.u[1] * t, 0));
    const other = stretchAlong(p.M, [1, y]);
    return [L, y, other];
  },
  /* Squash-and-stretch: both factors from the quotient; the corner is built from u and w and pushed through A directly. */
  q26c: p => {
    const corner = [0, 1].map(i => p.c[0] * p.u[i] + p.c[1] * p.w[i]);
    const moved = apply(p.M, corner);
    return [stretchAlong(p.M, p.u), stretchAlong(p.M, p.w), moved[0], moved[1]];
  },
  /* Amplifiers: the second entry of w by search for a right angle with u (and w must really be a mode of A);
     three passes done one after another on the starting levels. */
  q26d: p => {
    const y = searchGrid(-6, 6, 0.5, t => near(p.u[0] * p.wx + p.u[1] * t, 0));
    if (!Number.isFinite(stretchAlong(p.M, p.u)) || !Number.isFinite(stretchAlong(p.M, [p.wx, y]))) return [NaN, NaN, NaN];
    let s = p.s.slice();
    for (let pass = 0; pass < 3; pass++) s = apply(p.M, s);
    return [y, s[0], s[1]];
  },
  /* Robot arm: singular values from the roots of the Gram table; the joint is the column whose own length matches the largest. */
  q27b: p => {
    const sv = singular(p.A), len0 = Math.hypot(...column(p.A, 0)), len1 = Math.hypot(...column(p.A, 1));
    const joint = near(len0, sv[0]) && !near(len1, sv[0]) ? 1 : near(len1, sv[0]) && !near(len0, sv[0]) ? 2 : NaN;
    return [sv[0], sv[1], joint];
  },
  /* Lens: square roots of the roots of the Gram table. */
  q27c: p => singular(p.A),
  /* Sensor log: search whole numbers and halves for the entry that makes the columns perpendicular, then the Gram roots. */
  q27d: p => {
    const fill = k => p.A.map(row => row.map(x => (x === null || x === undefined ? k : x)));
    const k = searchGrid(-20, 20, 0.5, t => { const A = fill(t); return near(dot(column(A, 0), column(A, 1)), 0); });
    const sv = singular(fill(k));
    return [k, sv[0], sv[1]];
  },
  /* Sprint, jump, throw: sort the variances and add them up from the largest. */
  q28b: p => {
    const sorted = p.v.slice().sort((a, b) => b - a);
    let total = 0; for (const x of p.v) total += x;
    return [sorted[0] / total, (total - sorted[2]) / total];
  },
  /* Café: the whole 2×2 covariance table from the data (averages of products), then its largest root over its trace. */
  q28c: p => {
    const mean = list => list.reduce((s, x) => s + x, 0) / list.length;
    const avgProduct = (a, b) => mean(a.map((x, i) => (x - mean(a)) * (b[i] - mean(b))));
    const vx = avgProduct(p.x, p.x), vy = avgProduct(p.y, p.y), cxy = avgProduct(p.x, p.y);
    return [vx, vy, symRoots(vx, cxy, vy)[0] / (vx + vy)];
  },
  /* GPS: roots of the covariance table; the direction is whichever of (1, 1) and (1, −1) is stretched by the larger root. */
  q28d: p => {
    const C = [[p.a, p.b], [p.b, p.a]], top = symRoots(p.a, p.b, p.a)[0];
    const y = searchGrid(-1, 1, 2, t => near(stretchAlong(C, [1, t]), top));
    return [top, top / (p.a + p.a), y];
  },
  /* Heaters: the suggested plan by squaring; the best plan by searching every split in steps of a quarter kW. */
  q29b: p => {
    const sq = list => list.reduce((s, x) => s + x * x, 0);
    let best = Infinity, plan = null;
    for (let i = 0; i * 0.25 <= p.T; i++) for (let j = 0; (i + j) * 0.25 <= p.T; j++) {
      const cand = [i * 0.25, j * 0.25, p.T - (i + j) * 0.25], cost = sq(cand);
      if (cost < best - 1e-9) { best = cost; plan = cand; }
    }
    return [sq(p.plan), near(plan[0], plan[1]) && near(plan[1], plan[2]) ? plan[0] : NaN, best];
  },
  /* Cables: total by adding; the coolest split by search in quarter-amp steps; saving against one cable carrying it all. */
  q29c: p => {
    let T = 0; for (const x of p.m) T += x;
    let best = Infinity, share = NaN;
    for (let i = 0; i * 0.25 <= T; i++) { const x = i * 0.25, heat = x * x + (T - x) * (T - x); if (heat < best - 1e-9) { best = heat; share = x; } }
    return [T, near(share, T - share) ? share : NaN, T * T - best];
  },
  /* Thrusters: walk along the line a0·x1 + a1·x2 = T in steps of an eighth and keep the point nearest the origin;
     accepted only if that point is at right angles to the line's own direction (−a1, a0). */
  q29d: p => {
    let best = Infinity, at = [NaN, NaN];
    for (let i = -320; i <= 320; i++) {
      const x1 = i / 8, x2 = (p.T - p.a[0] * x1) / p.a[1], d = x1 * x1 + x2 * x2;
      if (d < best - 1e-9) { best = d; at = [x1, x2]; }
    }
    return near(-p.a[1] * at[0] + p.a[0] * at[1], 0) ? at : [NaN, NaN];
  },
  /* Hiking map: condition number from the singular values; each error by solving A·(real error) = slip and measuring it. */
  q30b: p => {
    const sv = singular([[p.a, 0], [0, p.c]]);
    const undo = slip => Math.hypot(slip[0] / p.a, slip[1] / p.c);
    return [sv[0] / sv[1], undo([p.s, 0]), undo([0, p.s])];
  },
  /* Camera rigs: singular values of each diagonal table from its Gram roots; the better rig has the smaller ratio. */
  q30c: p => {
    const kappa = d => { const sv = singular([[d[0], 0], [0, d[1]]]); return sv[0] / sv[1]; };
    const k1 = kappa(p.P), k2 = kappa(p.Q);
    return [k1, k2, k1 < k2 ? 1 : k2 < k1 ? 2 : NaN];
  },
  /* Star tracker: singular values from the Gram roots; the change by solving the normal equations AᵀA·x = Aᵀ·(reading change),
     with the reading change put in the one row the weak column uses, and reading off the weak column's unknown. */
  q30d: p => {
    const sv = singular(p.A), g = gram(p.A);
    const weak = g[0] < g[2] ? 0 : 1;
    const rows = p.A.map((row, i) => (row[weak] !== 0 ? i : -1)).filter(i => i >= 0);
    if (rows.length !== 1) return [NaN, NaN, NaN, NaN];
    const db = p.A.map((row, i) => (i === rows[0] ? p.d : 0));
    const rhs = [dot(column(p.A, 0), db), dot(column(p.A, 1), db)];
    const det = g[0] * g[2] - g[1] * g[1];
    const x = [(g[2] * rhs[0] - g[1] * rhs[1]) / det, (g[0] * rhs[1] - g[1] * rhs[0]) / det];
    return [sv[0], sv[1], sv[0] / sv[1], x[weak]];
  },
});
})();
