/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 1 of 8: q01b–q05d (game/realms/complex/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* A complex number a + bi is held as the 2x2 matrix [[a,-b],[b,a]]; multiplying numbers multiplies matrices. */
const M = (a, b) => [[a, -b], [b, a]];
const mul = (X, Y) => [[X[0][0]*Y[0][0] + X[0][1]*Y[1][0], X[0][0]*Y[0][1] + X[0][1]*Y[1][1]],
                       [X[1][0]*Y[0][0] + X[1][1]*Y[1][0], X[1][0]*Y[0][1] + X[1][1]*Y[1][1]]];
const re = X => X[0][0], im = X => X[1][0];
const mpow = (X, n) => { let R = M(1, 0); for (let k = 0; k < n; k++) R = mul(R, X); return R; };
const r2 = x => { const v = Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100; return v === 0 ? 0 : v; };
const r6 = x => { const v = Math.round(x * 1e6) / 1e6; return v === 0 ? 0 : v; };
/* Solve w x = z for x = (u, v) as a 2x2 linear system by Cramer's rule (w acts as the matrix M(c,d)). */
const solveDiv = (z, w) => {
  const det = w[0]*w[0] + w[1]*w[1];
  return [(z[0]*w[0] + z[1]*w[1]) / det, (z[1]*w[0] - z[0]*w[1]) / det];
};
/* Angle of (x, y) in (-pi, pi]: scan one-thousandth-of-a-radian steps for the direction whose unit vector is closest, then refine. */
const argOf = (x, y) => {
  const len = Math.sqrt(x*x + y*y);
  let best = 0, bd = 1e9;
  for (let k = -3142; k <= 3142; k++) { const t = k / 1000, d = (Math.cos(t) - x/len) ** 2 + (Math.sin(t) - y/len) ** 2; if (d < bd) { bd = d; best = t; } }
  let lo = best - 0.001, hi = best + 0.001;
  for (let it = 0; it < 60; it++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    const d1 = (Math.cos(m1) - x/len) ** 2 + (Math.sin(m1) - y/len) ** 2, d2 = (Math.cos(m2) - x/len) ** 2 + (Math.sin(m2) - y/len) ** 2;
    if (d1 < d2) hi = m2; else lo = m1;
  }
  return (lo + hi) / 2;
};
Object.assign(window.ORACLE, {
  /* q01b: z = a + bi, w = c + di. Subtract part by part, then multiply as matrices. */
  q01b: p => {
    const P = mul(M(p.a, p.b), M(p.c, p.d));
    return [p.a - p.c, p.b - p.d, re(P), im(P)];
  },
  /* q01c: z = a + bi, w = c + di; the final signal is z w w. */
  q01c: p => { const w = M(p.c, p.d), F = mul(mul(M(p.a, p.b), w), w); return [re(F), im(F)]; },
  /* q01d: z = a + bi, u = c + di, v = e + fi; z u v. */
  q01d: p => { const F = mul(M(p.a, p.b), mul(M(p.c, p.d), M(p.e, p.f))); return [re(F), im(F)]; },
  /* q02b: w = c + di, z = a + bi: w times its conjugate, then z / w by solving w x = z. */
  q02b: p => { const x = solveDiv([p.a, p.b], [p.c, p.d]); return [p.c*p.c + p.d*p.d, r2(x[0]), r2(x[1])]; },
  /* q02c: z = a + bi; s = p + qi; the whole line is w = c + di, so t = w - s (only s and t are printed). */
  q02c: p => {
    const s = [p.p, p.q], t = [p.c - p.p, p.d - p.q], w = [s[0] + t[0], s[1] + t[1]];
    const x = solveDiv([p.a, p.b], w); return [r2(x[0]), r2(x[1])];
  },
  /* q02d: z = a + bi, booster p = e + fi, cable w = c + di: (z p) / w. */
  q02d: p => {
    const zp = mul(M(p.a, p.b), M(p.e, p.f)), x = solveDiv([re(zp), im(zp)], [p.c, p.d]);
    return [r2(x[0]), r2(x[1])];
  },
  /* q03b: z = a + bi; distance by search for the integer-free root, angle by scan. */
  q03b: p => [r6(Math.sqrt(p.a*p.a + p.b*p.b)), r2(argOf(p.a, p.b))],
  /* q03c: z1 = x1 + y1 i; z2 = z1 + (dx + dy i); the move is (dx, dy). */
  q03c: p => {
    const z2 = [p.x1 + p.dx, p.y1 + p.dy], mv = [z2[0] - p.x1, z2[1] - p.y1];
    return [r6(Math.sqrt(mv[0]*mv[0] + mv[1]*mv[1])), r2(argOf(mv[0], mv[1]))];
  },
  /* q03d: the true signal is x + yi; the printed z is (x + yi)(c + di) and the divisor is w = c + di; divide z by w again. */
  q03d: p => {
    const z = mul(M(p.x, p.y), M(p.c, p.d)), t = solveDiv([re(z), im(z)], [p.c, p.d]);
    return [r6(Math.sqrt(t[0]*t[0] + t[1]*t[1])), r2(argOf(t[0], t[1]))];
  },
  /* q04b: boom length r, angle k pi / q; read the tip off the unit circle. */
  q04b: p => { const t = p.k * Math.PI / p.q; return [r2(p.r * Math.cos(t)), r2(p.r * Math.sin(t))]; },
  /* q04c: hub a + bi, arm r, angle k pi / q. */
  q04c: p => { const t = p.k * Math.PI / p.q; return [r2(p.a + p.r * Math.cos(t)), r2(p.b + p.r * Math.sin(t))]; },
  /* q04d: length r, angle (kb + 2 q t) pi / q (kb is the base numerator, t whole extra turns, q the denominator). */
  q04d: p => {
    const num = p.kb + 2 * p.q * p.t, t = num * Math.PI / p.q;
    let a = t; while (a > Math.PI + 1e-12) a -= 2 * Math.PI; while (a <= -Math.PI + 1e-12) a += 2 * Math.PI;
    return [r2(a), r2(p.r * Math.cos(t)), r2(p.r * Math.sin(t))];
  },
  /* q05b: z = c (a + bi), raised to the power p by repeated multiplication. */
  q05b: p => { const Z = mpow(M(p.c * p.a, p.c * p.b), p.p); return [re(Z), im(Z)]; },
  /* q05c: s = c + di, z = a + bi, n = p stages: s z^n. */
  q05c: p => { const F = mul(M(p.c, p.d), mpow(M(p.a, p.b), p.p)); return [re(F), im(F)]; },
  /* q05d: z = sqrt2 e^(i m pi/4) = 1 + i rotated; the matrix of sqrt2 (cos t, sin t), power p, rounded to whole numbers. */
  q05d: p => {
    const t = p.m * Math.PI / 4, Z = M(Math.SQRT2 * Math.cos(t), Math.SQRT2 * Math.sin(t)), R = mpow(Z, p.p);
    return [Math.round(re(R)) + 0, Math.round(im(R)) + 0];
  },
});
})();
