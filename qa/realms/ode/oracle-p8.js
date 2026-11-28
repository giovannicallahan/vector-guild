/* Independent oracles for Differential equations practice missions, file 8 of 8: q36b–q40d (game/realms/ode/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100 + (x < 0 ? -1e-9 : 1e-9)) / 100;
const r9 = x => Math.round(x * 1e9) / 1e9;
/* Newton's method for a critical point of a planar system f, g from a start; Jacobian by central differences. */
const newton = (F, x, y) => {
  for (let i = 0; i < 100; i++) {
    const h = 1e-6, f = F(x, y), J = jac(F, x, y), det = J[0] * J[3] - J[1] * J[2];
    const dx = (f[0] * J[3] - J[1] * f[1]) / det, dy = (J[0] * f[1] - J[2] * f[0]) / det;
    x -= dx; y -= dy; if (Math.abs(dx) + Math.abs(dy) < 1e-13) break;
  }
  return [x, y];
};
/* Jacobian entries row by row, by central differences (exact for these polynomial systems up to rounding). */
const jac = (F, x, y) => {
  const h = 1e-5, fx = F(x + h, y), bx = F(x - h, y), fy = F(x, y + h), by = F(x, y - h);
  return [(fx[0] - bx[0]) / (2 * h), (fy[0] - by[0]) / (2 * h), (fx[1] - bx[1]) / (2 * h), (fy[1] - by[1]) / (2 * h)];
};
const clean = v => v.map(z => { const k = Math.round(z); return Math.abs(z - k) < 1e-6 ? k : r9(z); });
/* Eigenvalues of [[a,b],[c,d]]: real parts (larger first), size of imaginary part, code 1 node, 2 saddle, 3 spiral. */
const classify = (a, b, c, d) => {
  const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
  if (det < 0) { const s = Math.sqrt(disc); return [(tr + s) / 2, (tr - s) / 2, 0, 2]; }
  if (disc >= 0) { const s = Math.sqrt(disc); return [(tr + s) / 2, (tr - s) / 2, 0, 1]; }
  return [tr / 2, tr / 2, Math.sqrt(-disc) / 2, 3];
};
/* Period of small swings of a predator-prey system around its coexistence point: eigenvalues ±i sqrt(net prey rate × predator death rate). */
const period = (net, death) => 2 * Math.PI / Math.sqrt(net * death);
Object.assign(window.ORACLE, {
  /* q36b: x' = y - s x², y' = y - s(r1+r2) x + s r1 r2 (read off the prompt). y = s x² gives s(x-r1)(x-r2) = 0; smaller root. */
  q36b: p => {
    const S = p.r1 + p.r2, P = p.r1 * p.r2, x = (S - Math.sqrt(S * S - 4 * P)) / 2, y = p.s * x * x;
    const F = (u, v) => [v - p.s * u * u, v - p.s * S * u + p.s * P];
    return clean([x, y].concat(jac(F, x, y)));
  },
  /* q36c: x' = xy - k, y' = x - c y with k = c y0² (the constants printed). Positive-x critical point by Newton; then J (u, v). */
  q36c: p => {
    const k = p.c * p.y0 * p.y0, F = (x, y) => [x * y - k, x - p.c * y];
    const pt = newton(F, 5 * p.c * p.y0, 5 * p.y0), J = jac(F, pt[0], pt[1]);
    return clean([pt[0], pt[1], J[0] * p.nu + J[1] * p.nv, J[2] * p.nu + J[3] * p.nv]);
  },
  /* q36d: x' = xy - x0 y0, y' = x² + y² - (x0² + y0²). x+y = ±sqrt(R+2K), x-y = ±sqrt(R-2K); take the four points, pt 1 the largest x, pt 0 the smallest x. */
  q36d: p => {
    const K = p.x0 * p.y0, R = p.x0 * p.x0 + p.y0 * p.y0, sp = Math.sqrt(R + 2 * K), sm = Math.sqrt(R - 2 * K), pts = [];
    for (const a of [sp, -sp]) for (const b of [sm, -sm]) pts.push([(a + b) / 2, (a - b) / 2]);
    pts.sort((u, v) => v[0] - u[0]);
    const [x, y] = p.pt ? pts[0] : pts[3], F = (u, v) => [u * v - K, u * u + v * v - R];
    return clean([x, y].concat(jac(F, x, y)));
  },
  /* q37b: Jacobian at (0,0) is [[a,b],[c,d]]; the quadratic terms drop out. */
  q37b: p => clean(classify(p.a, p.b, p.c, p.d)),
  /* q37c: x' = x(A - x - p y), y' = y(B - q x - y) with A = xs + p ys, B = q xs + ys (so (xs, ys) is the coexistence point). */
  q37c: p => {
    const A = p.xs + p.p * p.ys, B = p.q * p.xs + p.ys, F = (x, y) => [x * (A - x - p.p * y), y * (B - p.q * x - y)];
    const dd = 1 - p.p * p.q, pt = [(A - p.p * B) / dd, (B - p.q * A) / dd], J = jac(F, pt[0], pt[1]), det = J[0] * J[3] - J[1] * J[2];
    return clean([pt[0], pt[1], det, det < 0 ? 2 : 1]);
  },
  /* q37d: x' = xy + c r1 r2, y' = y - c x + c(r1+r2); pt 0 smaller x, 1 larger x. Critical points by Newton from both sides. */
  q37d: p => {
    const S = p.r1 + p.r2, F = (x, y) => [x * y + p.c * p.r1 * p.r2, y - p.c * x + p.c * S];
    const lo = Math.min(p.r1, p.r2), hi = Math.max(p.r1, p.r2), x0 = p.pt ? hi : lo;
    const pt = newton(F, x0 + 0.1, p.c * (x0 - S) + 0.1), J = jac(F, pt[0], pt[1]);
    const tr = J[0] + J[3], det = J[0] * J[3] - J[1] * J[2], code = det < 0 ? 2 : (tr * tr - 4 * det > 0 ? 1 : 3);
    return clean([pt[0], pt[1], tr, det, code]);
  },
  /* q38b: x' = a x - (a/ys) x y, y' = (c/xs) x y - c y. Coexistence (ys, xs); period 2π/√(a c). Answer order y, x, period. */
  q38b: p => [p.ys, p.xs, r2(period(p.a, p.c))],
  /* q38c: birds = 10 ys; period 2π/√(a c); whole swings = floor(span / unrounded period). */
  q38c: p => [10 * p.ys, r2(period(p.a, p.c)), Math.floor(p.span / period(p.a, p.c) + 1e-12)],
  /* q38d: the prompt prints x' = (A+h)x - b x y - h x, so the net prey rate is A (parameter A is the net rate); y' = -c y + (c/xs) x y. */
  q38d: p => [p.xs, p.ys, r2(period(p.A, p.c))],
  /* q39b: λ_n = (nπ/L)², as a multiple of π²: n²/L². Count n ≥ 1 with n²/L² < N (strictly below). */
  q39b: p => {
    const v = p.k * p.k / (p.L * p.L); let n = 0; while ((n + 1) * (n + 1) / (p.L * p.L) < p.N - 1e-9) n++;
    return [r2(v), n];
  },
  /* q39c: the k-th value is printed as V π² with V = (k/L)²; L = k/√V, and the first value is 1/L². */
  q39c: p => {
    const V = Math.round((p.k / p.L) ** 2 * 1e6) / 1e6, L = p.k / Math.sqrt(V);
    return [r9(L), r2(1 / (L * L))];
  },
  /* q39d: the gap between the posts is L (the posts are at a0 and a0 + L); k-th value k²/L². The second problem has λ = μ π² with μ L² = m (eig 0) or m² (eig 1: m is the index j; this is the number in the prompt's μ·L²): a unique solution exactly when sin(π √m) ≠ 0, i.e. m is not a perfect square. */
  q39d: p => {
    const mu = Math.round((p.eig ? p.m * p.m : p.m) / (p.L * p.L) * 1e6) / 1e6, m = mu * p.L * p.L, s = Math.sqrt(m);
    return [r2(p.k * p.k / (p.L * p.L)), Math.abs(Math.sin(Math.PI * s)) > 1e-6 ? 1 : 0];
  },
  /* q40b: ω_k = w √λ_k = w k π / L; coexistence x = c ÷ (the xy coefficient of y') = xs. */
  q40b: p => [r2(p.w * p.k * Math.PI / p.L), p.xs],
  /* q40c: fundamental w π / L = 96π style: L is what makes that true (the prompt's target is w π / L); insects = 100 xs. */
  q40c: p => [p.L, 100 * p.xs],
  /* q40d: fundamental w π/L; count k with k w π/L < Om; y at the coexistence point = net prey rate ÷ b = ys (net rate A, b = A/ys). */
  q40d: p => {
    const w1 = p.w * Math.PI / p.L; let n = 0; while ((n + 1) * w1 < p.Om) n++;
    return [r2(w1), n, p.ys];
  },
});
})();
