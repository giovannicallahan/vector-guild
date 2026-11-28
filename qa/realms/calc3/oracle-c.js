/* Independent oracles for Calculus 3: many variables learn missions, file c: q21–q30 (game/realms/calc3/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r = (x, n) => { const f = Math.pow(10, n); return Math.round(x * f) / f; };
/* Composite Simpson rule for a one-variable function on [a, b]. */
const simpson = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/* Gradient and second differences of a two-variable function by central differences (exact for a quadratic). */
const grad = (f, x, y) => { const h = 1e-3; return [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)]; };
const hess = (f, x, y) => { const h = 1; return [
  (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h),
  (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h),
  (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h)]; };
/* The critical point of a quadratic field: one Newton step from the origin, using numerical derivatives. */
const critical = f => { const g = grad(f, 0, 0), [a, c, b] = hess(f, 0, 0), det = a * c - b * b;
  return [(-g[0] * c + g[1] * b) / det, (-g[1] * a + g[0] * b) / det]; };
/* Returns 1 for a local maximum, 2 for a local minimum, 3 for a saddle point, from the sign of f − f(point) on 360
   points of a small circle round the point. */
const kindOf = (f, x, y) => { const f0 = f(x, y); let up = 0, down = 0;
  for (let i = 0; i < 360; i++) { const t = Math.PI * i / 180, d = f(x + 0.01 * Math.cos(t), y + 0.01 * Math.sin(t)) - f0; if (d > 1e-9) up++; else if (d < -1e-9) down++; }
  return down === 0 ? 2 : up === 0 ? 1 : 3; };
Object.assign(window.ORACLE, {
  /* f = a x² + b x y + c y² + d x + e y with its critical point at (p, q): the linear coefficients are the ones that make
     both slopes 0 there (d = −(2a p + b q), e = −(b p + 2c q)). The point is found by a Newton step on numerical
     derivatives, D from second differences, and the type from the values of f on a small circle round the point. */
  q21: p => {
    const d = -(2 * p.a * p.p + p.b * p.q), e = -(p.b * p.p + 2 * p.c * p.q);
    const f = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y + d * x + e * y;
    const [x, y] = critical(f), [fxx, fyy, fxy] = hess(f, x, y);
    return [r(x, 6), r(y, 6), r(fxx * fyy - fxy * fxy, 6), kindOf(f, x, y)];
  },
  /* Rail x² + y² = r², f = A x + B y. Search 360000 angles round the rail for the largest f; λ comes from the
     Lagrange condition ∇f = λ∇g, i.e. A = λ · 2x at that point (g = x² + y²). */
  q22: p => {
    const N = 360000; let best = -Infinity, bx = 0, by = 0;
    for (let i = 0; i < N; i++) { const t = 2 * Math.PI * i / N, x = p.r * Math.cos(t), y = p.r * Math.sin(t), v = p.A * x + p.B * y; if (v > best) { best = v; bx = x; by = y; } }
    /* refine the best angle by ternary search on its two neighbouring grid steps */
    let lo = Math.atan2(by, bx) - 2 * Math.PI / N, hi = lo + 4 * Math.PI / N; const F = t => p.A * p.r * Math.cos(t) + p.B * p.r * Math.sin(t);
    for (let i = 0; i < 100; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (F(m1) < F(m2)) lo = m1; else hi = m2; }
    const t = (lo + hi) / 2;
    return [r(F(t), 6), r(p.A / (2 * p.r * Math.cos(t)), 6)];
  },
  /* f = a x² + b x y + c y² + d x + e y + k with its one critical point at (p, q) (d, e as in q21); the balloon P is
     (p + u, q + v), u and v being offsets from the critical point. Slope size from numerical partial derivatives at P. */
  q23: p => {
    const d = -(2 * p.a * p.p + p.b * p.q), e = -(p.b * p.p + 2 * p.c * p.q);
    const f = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y + d * x + e * y + p.k;
    const g = grad(f, p.p + p.u, p.q + p.v), [x, y] = critical(f);
    return [r(Math.hypot(g[0], g[1]), 6), kindOf(f, x, y), r(f(x, y), 6)];
  },
  /* Roof h = d + c x y over x in [x1, x2], y in [y1, y2]. Midpoint rule on a 400 × 400 grid (exact for this shape);
     the average is the volume over the floor area. */
  q24: p => {
    const n = 400, hx = (p.x2 - p.x1) / n, hy = (p.y2 - p.y1) / n; let v = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) v += (p.d + p.c * (p.x1 + (i + 0.5) * hx) * (p.y1 + (j + 0.5) * hy)) * hx * hy;
    return [r(v, 6), r(v / ((p.x2 - p.x1) * (p.y2 - p.y1)), 6)];
  },
  /* Panel: 0 ≤ x ≤ a, 0 ≤ y ≤ c x², thickness k x mm (1 mm over 1 m² is 1 litre). The parameter s is the x-value the
     last question is built round: it asks about the height y = c s². Litres by Simpson over x of thickness × height;
     top limit is the curve's height at x = a; the inner start x solves c x² = y by bisection. */
  q25: p => {
    const litres = simpson(x => p.k * x * (p.c * x * x), 0, p.a);
    const Y = p.c * p.s * p.s; let lo = 0, hi = p.a;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (p.c * m * m < Y) lo = m; else hi = m; }
    return [r(litres, 6), r(p.c * p.a * p.a, 6), r((lo + hi) / 2, 6)];
  },
  /* Mat between radii r1 and r2 and angle range ang (an index into a list of angle pairs: 0: 0 to π/2, 1: 0 to π,
     2: π/2 to π, 3: 0 to 2π, 4: π/4 to 3π/4, 5: π to 2π, 6: 0 to 3π/2). Kind 0: f = c; kind 1: f = x² + y². The inner
     integral is Simpson on f r along the ray θ = 0; the total is a grid over r and θ using f in x and y, divided by π. */
  q26: p => {
    const P = Math.PI, A = [[0, P / 2], [0, P], [P / 2, P], [0, 2 * P], [P / 4, 3 * P / 4], [P, 2 * P], [0, 3 * P / 2]][p.ang];
    const f = (x, y) => p.kind === 0 ? p.c : x * x + y * y;
    const inner = simpson(t => f(t, 0) * t, p.r1, p.r2);
    const total = simpson(th => simpson(t => f(t * Math.cos(th), t * Math.sin(th)) * t, p.r1, p.r2, 200), A[0], A[1], 200);
    return [r(inner, 6), r(total / P, 6)];
  },
  /* Ramp 0 ≤ x ≤ a, 0 ≤ y ≤ b, 0 ≤ z ≤ s x, density c + y. Midpoint grid in x and y, with Simpson up each z column. */
  q27: p => {
    const n = 100; let vol = 0, mass = 0; const hx = p.a / n, hy = p.b / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = (i + 0.5) * hx, y = (j + 0.5) * hy, top = p.s * x;
      vol += simpson(() => 1, 0, top, 2) * hx * hy;
      mass += simpson(() => p.c + y, 0, top, 2) * hx * hy;
    }
    return [r(vol, 6), r(mass, 6)];
  },
  /* Kind 0: cylinder shell between radii r1 and r2, height h (radial integral of r). Kind 1: part of a ball of radius
     r2 inside the cone φ = π/3 (radial integral of ρ²). Kind 2: upper half of the shell between r1 and r2. The volume
     is the solid's known geometric volume: π (r2² − r1²) h; (2π/3) R³ (1 − cos φ); (2π/3)(r2³ − r1³). */
  q28: p => {
    const rad = p.kind === 0 ? simpson(t => t, p.r1, p.r2) : simpson(t => t * t, p.r1, p.r2);
    const V = p.kind === 0 ? Math.PI * (p.r2 * p.r2 - p.r1 * p.r1) * p.h
      : p.kind === 1 ? 2 * Math.PI / 3 * Math.pow(p.r2, 3) * (1 - Math.cos(Math.PI / 3))
      : 2 * Math.PI / 3 * (Math.pow(p.r2, 3) - Math.pow(p.r1, 3));
    return [r(rad, 6), r(V / Math.PI, 6)];
  },
  /* Upper half shell between radii a and b, density c ÷ ρ. Volume from the half-sphere formula; mass by adding up
     thin half-spherical skins: surface area 2π ρ² times density c ÷ ρ times thickness dρ (Simpson). */
  q29: p => {
    const vol = 2 * Math.PI / 3 * (Math.pow(p.b, 3) - Math.pow(p.a, 3));
    const mass = simpson(t => p.c / t * 2 * Math.PI * t * t, p.a, p.b);
    return [r(vol / Math.PI, 6), r(mass / Math.PI, 6)];
  },
  /* u = a x + b y, v = c x + d y; the plate is u1 ≤ u ≤ u2, v1 ≤ v ≤ v2 and f = u. The determinant comes from
     differences of u and v. The plate's four corners come from solving the pairs of line equations, and the load is the
     sum over two triangles of area × f at the centroid (exact for a linear f). J is 1 ÷ the determinant. */
  q30: p => {
    const u = (x, y) => p.a * x + p.b * y, v = (x, y) => p.c * x + p.d * y;
    const det = (u(1, 0) - u(0, 0)) * (v(0, 1) - v(0, 0)) - (u(0, 1) - u(0, 0)) * (v(1, 0) - v(0, 0));
    const pt = (U, V) => [(U * p.d - p.b * V) / det, (p.a * V - p.c * U) / det];
    const C = [pt(p.u1, p.v1), pt(p.u2, p.v1), pt(p.u2, p.v2), pt(p.u1, p.v2)];
    const tri = (A, B, D) => Math.abs((B[0] - A[0]) * (D[1] - A[1]) - (D[0] - A[0]) * (B[1] - A[1])) / 2 * u((A[0] + B[0] + D[0]) / 3, (A[1] + B[1] + D[1]) / 3);
    return [r(det, 6), r(1 / det, 6), r(tri(C[0], C[1], C[2]) + tri(C[0], C[2], C[3]), 6)];
  },
});
})();
