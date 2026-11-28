/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 4 of 8: q16b–q20d (game/realms/complex/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6 + 0;
/* Five-point finite differences: exact for polynomials up to degree 4 (first) and 5 (second). */
const H = 0.5;
const d1 = (f, v) => (f(v - 2 * H) - 8 * f(v - H) + 8 * f(v + H) - f(v + 2 * H)) / (12 * H);
const d2 = (f, v) => (-f(v - 2 * H) + 16 * f(v - H) - 30 * f(v) + 16 * f(v + H) - f(v + 2 * H)) / (12 * H * H);
const ux = (u, x, y) => d1(s => u(s, y), x), uy = (u, x, y) => d1(s => u(x, s), y);
const lap = (u, x, y) => d2(s => u(s, y), x) + d2(s => u(x, s), y);
const PTS = [[1, 0], [0, 1], [2, 3], [-1, 2]];
const harmonic = u => PTS.every(([x, y]) => Math.abs(lap(u, x, y)) < 1e-7);
const cauchyRiemann = (u, v) => PTS.every(([x, y]) =>
  Math.abs(ux(u, x, y) - uy(v, x, y)) < 1e-7 && Math.abs(uy(u, x, y) + ux(v, x, y)) < 1e-7);
/* Search whole numbers from -200 to 200 (0 first) for the one that passes a test. */
const find = test => { for (let k = 0; k <= 200; k++) { if (test(k)) return k; if (test(-k)) return -k; } return NaN; };
/* Complex numbers as [re, im]. */
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cinv = a => { const n = a[0] * a[0] + a[1] * a[1]; return [a[0] / n, -a[1] / n]; };
const cpow = (a, n) => { let r = [1, 0]; const b = n < 0 ? cinv(a) : a; for (let i = 0; i < Math.abs(n); i++) r = cmul(r, b); return r; };
const cscale = (a, s) => [a[0] * s, a[1] * s];
/* Gauss–Legendre, five points, on [0, 1]; composite over `panels` pieces of [lo, hi]. */
const GX = [0, 0.5384693101056831, -0.5384693101056831, 0.9061798459386640, -0.9061798459386640];
const GW = [0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891, 0.2369268850561891];
const integrate = (g, lo, hi, panels) => {  /* g(t) returns [re, im] */
  let s = [0, 0]; const w = (hi - lo) / panels;
  for (let k = 0; k < panels; k++) for (let i = 0; i < 5; i++) {
    const t = lo + k * w + w * (GX[i] + 1) / 2; s = cadd(s, cscale(g(t), GW[i] * w / 2));
  }
  return s;
};
/* ∫ f(z) dz along the straight segment from a to b. */
const seg = (f, a, b) => { const D = [b[0] - a[0], b[1] - a[1]];
  return integrate(t => cmul(f([a[0] + t * D[0], a[1] + t * D[1]]), D), 0, 1, 4); };
const conj = z => [z[0], -z[1]];
/* ∮ F(z) dz once anticlockwise round the circle centre c, radius r, by the trapezoid rule on 720 points; returns k with the integral = kπi. */
const loopK = (F, c, r) => {
  const N = 720; let s = [0, 0];
  for (let j = 0; j < N; j++) { const th = 2 * Math.PI * j / N, e = [Math.cos(th), Math.sin(th)];
    s = cadd(s, cmul(F([c[0] + r * e[0], c[1] + r * e[1]]), cscale(cmul([0, 1], e), r * 2 * Math.PI / N))); }
  return s[1] / Math.PI;
};
Object.assign(window.ORACLE, {
  /* q16b: T = p x² + b xy + m y² + d x (search m so the Laplacian is 0 everywhere); S = s x³ + t x²y + w y³ (Laplacian at the point). */
  q16b: p => {
    const m = find(k => harmonic((x, y) => p.p * x * x + p.b * x * y + k * y * y + p.d * x));
    const S = (x, y) => p.s * x * x * x + p.t * x * x * y + p.w * y * y * y;
    return [m, r6(lap(S, p.x0, p.y0))];
  },
  /* q16c: P = a x² + b xy + c y² + e y; the gauge reads its Laplacian; search a that gives that reading, then c′ for harmonic;
     W = a x³ + t x²y + c′ y³ (t is the number in front of x²y). */
  q16c: p => {
    const gauge = lap((x, y) => p.a * x * x + p.b * x * y + p.c * y * y + p.e * y, 0.3, 0.7);
    const a = find(k => Math.abs(lap((x, y) => k * x * x + p.b * x * y + p.c * y * y + p.e * y, 0.3, 0.7) - gauge) < 1e-7);
    const c2 = find(k => harmonic((x, y) => a * x * x + p.b * x * y + k * y * y + p.e * y));
    const W = (x, y) => a * x * x * x + p.t * x * x * y + c2 * y * y * y;
    return [a, c2, r6(lap(W, p.x0, p.y0))];
  },
  /* q16d: u = P x³ + q x²y + r x y² + S y³ (P and S are the printed x³ and y³ numbers); search r, q for harmonic;
     f′ = u_x + i v_x with v_x = −u_y. */
  q16d: p => {
    let q = NaN, r = NaN;
    for (let i = 0; i <= 200 && isNaN(q); i++) for (const qq of (i ? [i, -i] : [0])) for (let j = 0; j <= 200 && isNaN(q); j++) for (const rr of (j ? [j, -j] : [0]))
      if (harmonic((x, y) => p.P * x ** 3 + qq * x * x * y + rr * x * y * y + p.S * y ** 3)) { q = qq; r = rr; break; }
    const u = (x, y) => p.P * x ** 3 + q * x * x * y + r * x * y * y + p.S * y ** 3;
    return [r, q, r6(ux(u, p.x0, p.y0)), r6(-uy(u, p.x0, p.y0))];
  },
  /* q17b: u = k x² + c y² + e x, v = m xy + e y (c and e are the printed y² and x numbers); search k (harmonic) then m (Cauchy–Riemann). */
  q17b: p => {
    const k = find(s => harmonic((x, y) => s * x * x + p.c * y * y + p.e * x));
    const u = (x, y) => k * x * x + p.c * y * y + p.e * x;
    const m = find(s => cauchyRiemann(u, (x, y) => s * x * y + p.e * y));
    const v = (x, y) => m * x * y + p.e * y;
    return [k, m, r6(ux(u, p.x0, p.y0)), r6(ux(v, p.x0, p.y0))];
  },
  /* q17c: u = p x³ + k x y² + e y, v = m x² y − p y³ − e x (read off the printed signs); search k, then m. */
  q17c: p => {
    const k = find(s => harmonic((x, y) => p.p * x ** 3 + s * x * y * y + p.e * y));
    const u = (x, y) => p.p * x ** 3 + k * x * y * y + p.e * y;
    const m = find(s => cauchyRiemann(u, (x, y) => s * x * x * y - p.p * y ** 3 - p.e * x));
    const v = (x, y) => m * x * x * y - p.p * y ** 3 - p.e * x;
    const re = ux(u, p.x0, p.y0), im = ux(v, p.x0, p.y0);
    return [k, m, r6(re * re + im * im)];
  },
  /* q17d: u = p x³ + k x y² + g x² − g y², v = m x² y − p y³ + 2g xy; h(z) = f(z)(z − c0) (c0 is the number subtracted: the prompt prints z + 2 when c0 = −2). */
  q17d: p => {
    const k = find(s => harmonic((x, y) => p.p * x ** 3 + s * x * y * y + p.g * x * x - p.g * y * y));
    const u = (x, y) => p.p * x ** 3 + k * x * y * y + p.g * x * x - p.g * y * y;
    const m = find(s => cauchyRiemann(u, (x, y) => s * x * x * y - p.p * y ** 3 + 2 * p.g * x * y));
    const v = (x, y) => m * x * x * y - p.p * y ** 3 + 2 * p.g * x * y;
    const fp = [ux(u, p.x0, p.y0), ux(v, p.x0, p.y0)], f = [u(p.x0, p.y0), v(p.x0, p.y0)];
    const h = cadd(cmul(fp, [p.x0 - p.c0, p.y0]), f);
    return [k, m, r6(h[0]), r6(h[1])];
  },
  /* q18b: ∫ z dz along the straight segment from A to B. */
  q18b: p => { const r = seg(z => z, [p.ar, p.ai], [p.br, p.bi]); return [r6(r[0]), r6(r[1])]; },
  /* q18c: ∫ z̄ dz along A → B → C where A = x1 + y1 i, B = A + dx, C = B + dy i. */
  q18c: p => {
    const A = [p.x1, p.y1], B = [p.x1 + p.dx, p.y1], C = [B[0], B[1] + p.dy];
    const r = cadd(seg(conj, A, B), seg(conj, B, C)); return [r6(r[0]), r6(r[1])];
  },
  /* q18d: ∫ (z + p z̄) dz along the segment A → B. */
  q18d: p => { const r = seg(z => cadd(z, cscale(conj(z), p.p)), [p.ar, p.ai], [p.br, p.bi]); return [r6(r[0]), r6(r[1])]; },
  /* q19b: ∫ zⁿ dz from a to b, taken along the straight line (the route does not matter). */
  q19b: p => { const r = seg(z => cpow(z, p.n), [p.ar, p.ai], [p.br, p.bi]); return [r6(r[0]), r6(r[1])]; },
  /* q19c: ∫ (3z² + p) dz from a to b along the straight line. */
  q19c: p => { const r = seg(z => cadd(cscale(cpow(z, 2), 3), [p.p, 0]), [p.ar, p.ai], [p.br, p.bi]); return [r6(r[0]), r6(r[1])]; },
  /* q19d: ∫ (4z³ + p z̄) dz along the straight segment a → b. */
  q19d: p => { const r = seg(z => cadd(cscale(cpow(z, 3), 4), cscale(conj(z), p.p)), [p.ar, p.ai], [p.br, p.bi]); return [r6(r[0]), r6(r[1])]; },
  /* q20b: first meter B (z − c)^m1, second meter A/(z − c) + Cc (z − c)^m2 + D; each ∮ = kπi, found by summing round the circle (the radius r is only the size of the track). */
  q20b: p => {
    const c = [p.cr, p.ci], w = z => [z[0] - c[0], z[1] - c[1]];
    return [r6(loopK(z => cscale(cpow(w(z), p.m1), p.B), c, p.r)),
      r6(loopK(z => cadd(cadd(cscale(cinv(w(z)), p.A), cscale(cpow(w(z), p.m2), p.Cc)), [p.D, 0]), c, p.r))];
  },
  /* q20c: F = A/(z − c) + B (z − c)^m + D (z − c)^−q; L1 laps on radius r1 and L2 laps on radius r2. */
  q20c: p => {
    const c = [p.cr, p.ci], w = z => [z[0] - c[0], z[1] - c[1]];
    const F = z => cadd(cadd(cscale(cinv(w(z)), p.A), cscale(cpow(w(z), p.m), p.B)), cscale(cpow(w(z), -p.q), p.D));
    return [r6(p.L1 * loopK(F, c, p.r1) + p.L2 * loopK(F, c, p.r2))];
  },
  /* q20d: G = A/(z − c) + K (z − c)^n with K printed as b(n + 1); the half circle runs from c + r to c − r through the top (θ from 0 to π). */
  q20d: p => {
    const c = [p.cr, p.ci], w = z => [z[0] - c[0], z[1] - c[1]];
    const G = z => cadd(cscale(cinv(w(z)), p.A), cscale(cpow(w(z), p.n), p.b * (p.n + 1)));
    const K = r6(loopK(G, c, p.r));
    const half = integrate(th => { const e = [Math.cos(th), Math.sin(th)];
      return cmul(cscale(cpow(cscale(e, p.r), p.n), p.b * (p.n + 1)), cscale(cmul([0, 1], e), p.r)); }, 0, Math.PI, 20);
    return [K, r6(half[0])];
  },
});
})();
