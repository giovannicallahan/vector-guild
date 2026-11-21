/* Independent oracles for linear algebra practice missions, file 14 of 14: q66–q68 (game/realms/la/practice-14.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

const EPS = 1e-9;
const NO = n => new Array(n).fill(NaN);

/* General two-variable linear program by corner enumeration: maximize c·v subject to rows[i]·v ≤ rhs[i] (the sign
   limits x ≥ 0, y ≥ 0 are added here as −x ≤ 0, −y ≤ 0). Every pair of limit lines is intersected by Cramer's rule,
   infeasible crossings are dropped, and the best feasible corner is kept. Returns {x, y, value, unique}. */
const lp2 = (c, rows, rhs) => {
  const R = rows.concat([[-1, 0], [0, -1]]), b = rhs.concat([0, 0]);
  const corners = [];
  for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
    const det = R[i][0] * R[j][1] - R[i][1] * R[j][0];
    if (Math.abs(det) < EPS) continue;
    const x = (b[i] * R[j][1] - R[i][1] * b[j]) / det, y = (R[i][0] * b[j] - b[i] * R[j][0]) / det;
    if (R.every((row, k) => row[0] * x + row[1] * y <= b[k] + EPS)) corners.push([x, y]);
  }
  let best = null;
  for (const v of corners) { const value = c[0] * v[0] + c[1] * v[1]; if (!best || value > best.value + EPS) best = { x: v[0], y: v[1], value }; }
  if (!best) return { x: NaN, y: NaN, value: NaN, unique: false };
  best.unique = corners.every(v => Math.abs(c[0] * v[0] + c[1] * v[1] - best.value) > EPS || (Math.abs(v[0] - best.x) < EPS && Math.abs(v[1] - best.y) < EPS));
  return best;
};

/* Convolution by superposition: every input sample launches its own scaled copy of the filter, starting at its own
   time slot, and the copies are added up (the "scatter" picture; the taught route slides the flipped filter instead). */
const scatter = (x, h) => {
  const y = new Array(x.length + h.length - 1).fill(0);
  x.forEach((sample, start) => h.forEach((strength, delay) => { y[start + delay] += sample * strength; }));
  return y;
};

/* Quadratic cost f = ½ xᵀHx − bᵀx for a 2×2 H, and its gradient measured from f itself by a symmetric difference
   with step 1 (exact for a quadratic), not from the formula Hx − b. */
const cost = (H, b) => v => 0.5 * (H[0][0] * v[0] * v[0] + (H[0][1] + H[1][0]) * v[0] * v[1] + H[1][1] * v[1] * v[1]) - b[0] * v[0] - b[1] * v[1];
const slope = (f, v) => [(f([v[0] + 1, v[1]]) - f([v[0] - 1, v[1]])) / 2, (f([v[0], v[1] + 1]) - f([v[0], v[1] - 1])) / 2];
const descend = (f, v, alpha) => { const g = slope(f, v); return [v[0] - alpha * g[0], v[1] - alpha * g[1]]; };
const tidy = t => Math.round(t * 1e9) / 1e9;

Object.assign(window.ORACLE, {
  /* Baker: solve the linear program by checking every corner of the allowed region. */
  q66b: p => {
    const s = lp2([p.c1, p.c2], [[1, 1], [0, 1]], [p.S, p.U]);
    return s.unique ? [s.x, s.y, s.value].map(tidy) : NO(3);
  },
  /* Farmer: corner search for the plan; each price is found by really adding one hectare of that limit and
     solving the whole program again. */
  q66c: p => {
    const solve = (S, U) => lp2([p.c1, p.c2], [[1, 1], [1, 0]], [S, U]);
    const base = solve(p.S, p.U);
    if (!base.unique) return NO(5);
    const land = solve(p.S + 1, p.U).value - base.value, water = solve(p.S, p.U + 1).value - base.value;
    /* the prompt's two statements about fair prices must hold */
    if (Math.abs(land - p.c2) > 1e-6 || Math.abs(land + water - p.c1) > 1e-6) return NO(5);
    return [base.x, base.y, base.value, land, water].map(tidy);
  },
  /* Workshop: the plan comes from the corner search on the inequalities (not from solving the two equations); it
     must use up both resources, the prices must be fair (they pay for each product exactly), and then the bound
     is prices × resources. */
  q66d: p => {
    const s = lp2(p.c, p.A, p.r);
    if (!s.unique) return NO(4);
    const usesAll = p.A.every((row, i) => Math.abs(row[0] * s.x + row[1] * s.y - p.r[i]) < 1e-6);
    const fair = [0, 1].every(j => p.price[0] * p.A[0][j] + p.price[1] * p.A[1][j] === p.c[j]) && p.price.every(q => q >= 0);
    if (!usesAll || !fair) return NO(4);
    return [s.x, s.y, s.value, p.price[0] * p.r[0] + p.price[1] * p.r[1]].map(tidy);
  },
  /* Drum hit: add up one scaled copy of the hall's answer per sample. */
  q67b: p => scatter(p.x, p.h),
  /* Museum: each day's groups book their own guide hours on that day and the next; add the bookings, then the total. */
  q67c: p => { const y = scatter(p.x, p.h); return y.concat([y.reduce((s, t) => s + t, 0)]); },
  /* Phone line: peel the signal from the far end (the last received sample holds only the last sent one), the
     opposite direction from the taught one, then check the answer by sending it through the line again. */
  q67d: p => {
    const [h0, h1] = p.h, y = p.y;
    const x2 = y[3] / h1, x1 = (y[2] - h0 * x2) / h1, x0 = (y[1] - h0 * x1) / h1;
    const back = scatter([x0, x1, x2], p.h);
    return back.every((t, i) => Math.abs(t - y[i]) < 1e-6) ? [x0, x1, x2].map(tidy) : NO(3);
  },
  /* Sound engineer: slopes measured from the hiss function itself, then one step downhill. */
  q68b: p => {
    const f = cost([[p.h[0], 0], [0, p.h[1]]], p.b), g = slope(f, p.x0), next = descend(f, p.x0, 1 / p.m);
    return g.concat(next).map(tidy);
  },
  /* Greenhouse: two real steps from (0,0), the slope measured afresh from the cost each time. */
  q68c: p => {
    const f = cost([[p.h[0], 0], [0, p.h[1]]], p.b);
    return descend(f, descend(f, [0, 0], 1 / p.m), 1 / p.m).map(tidy);
  },
  /* Drone: the step from measured slopes; the largest eigenvalue from the characteristic equation
     λ² − (trace)λ + det = 0 (checked against the two modes); "safe" decided by actually running many steps from
     three starts that excite every mode, and from the player's own trims, and watching whether the slope dies away;
     all four runs must agree with each other and with the limit. */
  q68d: p => {
    const H = [[p.a, p.c], [p.c, p.a]], f = cost(H, p.b), alpha = 1 / p.m;
    const next = descend(f, p.x0, alpha);
    const tr = H[0][0] + H[1][1], det = H[0][0] * H[1][1] - H[0][1] * H[1][0];
    const top = (tr + Math.sqrt(tr * tr - 4 * det)) / 2, low = tr - top;
    const applied = [[1, 1], [1, -1]].map(v => [H[0][0] * v[0] + H[0][1] * v[1], H[1][0] * v[0] + H[1][1] * v[1]]);
    const read = [applied[0][0], applied[1][0]];              /* H(1,1) = λ(1,1), H(1,−1) = λ(1,−1) */
    const modesOk = applied[0][0] === applied[0][1] && applied[1][0] === -applied[1][1] &&
      Math.abs(Math.max(read[0], read[1]) - top) < 1e-9 && Math.abs(Math.min(read[0], read[1]) - low) < 1e-9;
    if (!modesOk) return NO(5);
    const limit = 2 / top;
    const run = start => {
      let v = start; const size = w => Math.hypot.apply(null, slope(f, w)), first = size(v);
      if (first === 0) return true;
      /* stop as soon as the slope has clearly blown up: far out the measured slope loses its digits */
      for (let k = 0; k < 400; k++) { v = descend(f, v, alpha); if (size(v) > 1e3 * first) return false; }
      return size(v) < 1e-3 * first;
    };
    const settles = [[0, 0], [1, 0], [0, 1]].every(run);
    /* The verdict must also hold from the trims the player is given: the text says what happens from there. */
    if (run(p.x0) !== settles) return NO(5);
    if (settles !== (alpha < limit)) return NO(5);
    return [tidy(next[0]), tidy(next[1]), tidy(top), limit, settles ? 1 : 0];
  },
});
})();
