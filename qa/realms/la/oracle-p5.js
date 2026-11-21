/* Independent oracles for linear algebra practice missions, file 5 of 14: q21–q25 (game/realms/la/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

const near = (x, y) => Math.abs(x - y) < 1e-7;
const tidy = x => Math.round(x * 1e8) / 1e8 + 0;
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);

/* Least-squares line through the points (ts[i], ys[i]), not from the normal equations: the slope is the average of
   the slopes between every pair of points, each pair weighted by the square of its gap in t; the line then passes
   through the mean point. Checked by the defining property: the residuals add to 0 and are at right angles to t.
   Returns [a, b, sum of squared residuals]. */
const fitLine = (ts, ys) => {
  let top = 0, bottom = 0;
  for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
    const gap = ts[j] - ts[i], weight = gap * gap;
    top += weight * (ys[j] - ys[i]) / gap; bottom += weight;
  }
  const b = top / bottom;
  const mean = list => list.reduce((s, x) => s + x, 0) / list.length;
  const a = mean(ys) - b * mean(ts);
  const res = ys.map((y, i) => y - (a + b * ts[i]));
  if (!near(res.reduce((s, r) => s + r, 0), 0) || !near(dot(res, ts), 0)) return [NaN, NaN, NaN];
  /* And no nearby line does better. */
  const sse = (A, B) => ys.reduce((s, y, i) => s + (y - A - B * ts[i]) ** 2, 0);
  const best = sse(a, b);
  for (const [da, db] of [[0.01, 0], [-0.01, 0], [0, 0.01], [0, -0.01], [0.01, -0.01], [0.01, 0.01]]) if (sse(a + da, b + db) < best) return [NaN, NaN, NaN];
  return [tidy(a), tidy(b), tidy(best)];
};

/* The triangle R of A = QR for the two columns a1, a2, without Gram–Schmidt: r11 is the length of a1, r12 is how far
   a2 reaches along a1, and r22 is the height of the parallelogram on a1 and a2 (its area, the length of the cross
   product, divided by its base). Checked: RᵀR must equal AᵀA. */
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const triangle = (a1, a2) => {
  const r11 = Math.hypot(...a1), r12 = dot(a1, a2) / r11, r22 = Math.hypot(...cross(a1, a2)) / r11;
  const ok = near(r11 * r11, dot(a1, a1)) && near(r11 * r12, dot(a1, a2)) && near(r12 * r12 + r22 * r22, dot(a2, a2)) && r11 > 0 && r22 > 0;
  return ok ? [tidy(r11), tidy(r12), tidy(r22)] : [NaN, NaN, NaN];
};

/* 2×2 helpers; a matrix is [[a,b],[c,d]]. */
const flat = m => [[m[0], m[1]], [m[2], m[3]]];
const apply = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
const times = (A, B) => [0, 1].map(i => [0, 1].map(j => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
const power = (M, n, v) => { let x = v.slice(); for (let i = 0; i < n; i++) x = apply(M, x); return x; };
/* Eigenvalues from the characteristic equation λ² − (trace)λ + det = 0, smaller first. */
const eigen = M => {
  const tr = M[0][0] + M[1][1], det = M[0][0] * M[1][1] - M[0][1] * M[1][0], disc = tr * tr - 4 * det;
  if (disc < -1e-9) return [NaN, NaN];
  const root = Math.sqrt(Math.max(0, disc));
  return [tidy((tr - root) / 2), tidy((tr + root) / 2)];
};
/* The x that makes (x, y) an eigenvector of M for lam: searched in steps of a quarter, and it must be the only one. */
const eigenX = (M, lam, y) => {
  const hits = [];
  for (let q = -400; q <= 400; q++) {
    const x = q / 4, w = apply(M, [x, y]);
    if (near(w[0], lam * x) && near(w[1], lam * y)) hits.push(x);
  }
  return hits.length === 1 ? hits[0] : NaN;
};

Object.assign(window.ORACLE, {
  /* Swimmer: weeks 0, 1, 2, 3. */
  q21b: p => fitLine([0, 1, 2, 3], p.ys).slice(0, 2),
  /* Shop: days 0, 1 and 3 (day 2 is missing), then read the line at the forecast day. */
  q21c: p => { const [a, b] = fitLine([0, 1, 3], p.ys); return [a, b, tidy(a + b * p.day)]; },
  /* Thermometer: hours −2, −1, 1, 2; the third answer is the sum of squared residuals. */
  q21d: p => fitLine([-2, -1, 1, 2], p.ys),

  /* Sensor table: R from lengths, a dot product and an area. */
  q22b: p => triangle(p.a1, p.a2),
  /* Robot arm: multiply Q (3×2) by R (2×2) in full and read column 2; column 1 must come out as r11 × q1, and
     splitting column 2 back along q1 and q2 must return r12 and r22. */
  q22c: p => {
    const Q = [p.q1, p.q2], R = [[p.R[0], p.R[1]], [0, p.R[2]]];
    const col = j => [0, 1, 2].map(row => Q[0][row] * R[0][j] + Q[1][row] * R[1][j]);
    const c1 = col(0), c2 = col(1);
    const ok = c1.every((x, i) => near(x, p.R[0] * p.q1[i])) && near(dot(c2, p.q1), p.R[1]) && near(dot(c2, p.q2), p.R[2]);
    return ok ? c2.map(tidy) : [NaN, NaN, NaN];
  },
  /* Beacons: R as above, then the two weights by Cramer's rule on [[r11, r12],[0, r22]] x = c, checked by putting
     them back into both equations. */
  q22d: p => {
    const [r11, r12, r22] = triangle(p.a1, p.a2), det = r11 * r22;
    const x1 = (p.c[0] * r22 - r12 * p.c[1]) / det, x2 = (r11 * p.c[1]) / det;
    const ok = near(r11 * x1 + r12 * x2, p.c[0]) && near(r22 * x2, p.c[1]);
    return ok ? [r11, r12, r22, tidy(x1), tidy(x2)] : [NaN, NaN, NaN, NaN, NaN];
  },

  /* Two sites: tomorrow's A = a × A, tomorrow's B = o × A + d × B. Eigenvalues from the characteristic equation. */
  q23b: p => eigen([[p.a, 0], [p.o, p.d]]),
  /* Photo filter: Av by the matrix, λ as (v·Av)/(v·v), checked entry by entry and against the characteristic equation. */
  q23c: p => {
    const M = flat(p.m), w = apply(M, p.v), lam = dot(p.v, w) / dot(p.v, p.v);
    const ok = near(w[0], lam * p.v[0]) && near(w[1], lam * p.v[1]) && eigen(M).some(e => near(e, lam));
    return ok ? [w[0], w[1], tidy(lam)] : [NaN, NaN, NaN];
  },
  /* Gear maps: the full product AB (B acts first), then its characteristic equation. */
  q23d: p => eigen(times(p.A, p.B)),

  /* Rolling mill: search for the x that makes (x, y) an eigenvector. */
  q24b: p => [eigenX(flat(p.m), p.lam, p.y), p.y],
  /* Yeast flasks: put the whole batch in flask 1 and run the hours forward, bringing the total back to the batch size
     after every hour, until the mix stops changing. That mix must grow by exactly λ in one more hour. */
  q24c: p => {
    const M = flat(p.m);
    let v = [p.total, 0];
    for (let hour = 0; hour < 400; hour++) { const w = apply(M, v), sum = w[0] + w[1]; v = [w[0] * p.total / sum, w[1] * p.total / sum]; }
    const next = apply(M, v);
    return near(next[0], p.lam * v[0]) && near(next[1], p.lam * v[1]) ? v.map(t => tidy(Math.round(t * 1e6) / 1e6)) : [NaN, NaN];
  },
  /* Kite: eigenvector by search, then its length and the unit arrow (checked to have length 1). */
  q24d: p => {
    const x = eigenX(flat(p.m), p.lam, p.y), L = Math.sqrt(x * x + p.y * p.y), u = [x / L, p.y / L];
    return near(u[0] * u[0] + u[1] * u[1], 1) ? [x, tidy(L), tidy(u[0]), tidy(u[1])] : [NaN, NaN, NaN, NaN];
  },

  /* Animation: rebuild the matrix itself from its eigenvectors and eigenvalues (A = V D V⁻¹, kept in whole numbers
     as V D adj(V) over det V), then apply it frame by frame to the start point. */
  q25b: p => {
    const [a, c] = p.v1, [b, d] = p.v2, det = a * d - b * c;
    const N = times(times([[a, b], [c, d]], [[p.l1, 0], [0, p.l2]]), [[d, -b], [-c, a]]);
    const x0 = [p.c1 * p.v1[0] + p.c2 * p.v2[0], p.c1 * p.v1[1] + p.c2 * p.v2[1]];
    const x = power(N, p.steps, x0).map(t => t / det ** p.steps);
    return x.map(tidy);
  },
  /* Servers: apply A to the load hour by hour. */
  q25c: p => power(flat(p.m), p.steps, p.x0),
  /* Dynamics Lab: eigenvector (x, 1) by search, then apply A cycle by cycle. */
  q25d: p => { const M = flat(p.m); return [eigenX(M, p.m[3], 1), ...power(M, p.steps, p.x0)]; },
});
})();
