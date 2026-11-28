/* Independent oracles for Calculus 3: many variables learn missions, file b: q11–q20 (game/realms/calc3/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r = (x, n) => { const f = Math.pow(10, n); return Math.round(x * f) / f; };
/* Five-point numerical derivative of a one-variable function at x. */
const D = (f, x) => { const h = 1e-3; return (-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) / (12 * h); };
/* Partial derivatives of a two-variable function by the same stencil. */
const Dx = (f, x, y) => D(s => f(s, y), x);
const Dy = (f, x, y) => D(s => f(x, s), y);
/* Smallest t >= 0 where g changes sign from negative to positive, by bisection on [0, 1000]. */
const root = g => { let lo = 0, hi = 1000; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; };
Object.assign(window.ORACLE, {
  /* r(t) = ⟨a t, b t, t²⟩ and the plane is p x + q y + z = K. K is not stored: the draw is built so that the
     crossing time is T, so K is the plane's left side evaluated on r(T). Then bisect for the positive t where the
     plane's left side on r(t) equals K, and take the speed from a numerical derivative of each component. */
  q11: p => {
    const side = t => p.p * p.a * t + p.q * p.b * t + t * t;
    const K = side(p.T);
    const t = r(root(s => side(s) - K), 6);
    const v = [s => p.a * s, s => p.b * s, s => s * s].map(f => D(f, t));
    return [t, r(Math.sqrt(v.reduce((s, x) => s + x * x, 0)), 6)];
  },
  /* h = k − p x² − q y² (p and q are the coefficients, a and b are the beacon's x and y). Level c = h at the beacon.
     The contour crosses y = 0 where k − p x² = c: search x upward in steps of 1/1000, then refine by bisection. */
  q12: p => {
    const h = (x, y) => p.k - p.p * x * x - p.q * y * y;
    const c = h(p.a, p.b);
    const x = root(s => -(h(s, 0) - c));
    return [r(c, 6), r(x, 6)];
  },
  /* Line y = m x. Kind 0: f = A x y ÷ (x² + B y²). Kind 1: f = (x² − A² y²) ÷ (x − A y). Each line's limit is read off
     by evaluating f at a point very near the origin on that line. Existence: sample 720 directions through the origin
     (the vertical one included) at two small radii; the limit exists when every direction gives the same value. */
  q13: p => {
    const f = (x, y) => p.kind === 0 ? p.A * x * y / (x * x + p.B * y * y) : (x * x - p.A * p.A * y * y) / (x - p.A * y);
    const along = m => f(1e-9, m * 1e-9);
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < 720; i++) {
      const th = Math.PI * (i + 0.5) / 720;
      for (const rad of [1e-5, 1e-7]) { const v = f(rad * Math.cos(th), rad * Math.sin(th)); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    }
    return [r(along(p.m1), 5), r(along(p.m2), 5), hi - lo < 1e-3 ? 1 : 0];
  },
  /* h = a x² y + b x y² + c e^(x − y), at the point (p, p). Slopes by numerical derivative. */
  q14: p => {
    const h = (x, y) => p.a * x * x * y + p.b * x * y * y + p.c * Math.exp(x - y);
    return [r(Dx(h, p.p, p.p), 5), r(Dy(h, p.p, p.p), 5)];
  },
  /* h = a x³ + b x² y + c x y² + d y³. Second differences with step 1/2 are exact for a cubic. */
  q15: p => {
    const h = (x, y) => p.a * x ** 3 + p.b * x * x * y + p.c * x * y * y + p.d * y ** 3;
    const s = 0.5;
    const hxx = (h(p.x + s, p.y) - 2 * h(p.x, p.y) + h(p.x - s, p.y)) / (s * s);
    const hyy = (h(p.x, p.y + s) - 2 * h(p.x, p.y) + h(p.x, p.y - s)) / (s * s);
    const hxy = (h(p.x + s, p.y + s) - h(p.x + s, p.y - s) - h(p.x - s, p.y + s) + h(p.x - s, p.y - s)) / (4 * s * s);
    return [r(hxx, 6), r(hyy, 6), r(hxy, 6)];
  },
  /* h = k + a x² + b x y + c y² at (x, y). The nearby point is (x + dx/10, y + dy/10): dx and dy are tenths of a metre. */
  q16: p => {
    const h = (x, y) => p.k + p.a * x * x + p.b * x * y + p.c * y * y;
    const hx = Dx(h, p.x, p.y), hy = Dy(h, p.x, p.y);
    return [r(hx, 5), r(hy, 5), r(h(p.x, p.y) + hx * p.dx / 10 + hy * p.dy / 10, 5)];
  },
  /* h = k + a x² y + b y³ + c x at (x, y); the nearby point is (x + dx/10, y + dy/10) (dx, dy in tenths of a metre). */
  q17: p => {
    const h = (x, y) => p.k + p.a * x * x * y + p.b * y ** 3 + p.c * x;
    const hx = Dx(h, p.x, p.y), hy = Dy(h, p.x, p.y);
    return [r(h(p.x, p.y), 6), r(hy, 5), r(h(p.x, p.y) + hx * p.dx / 10 + hy * p.dy / 10, 5)];
  },
  /* T = a x² + b x y + c y²; x(t) = p + q t, y(t) = r t²; the time is p.s (s is the time in hours, not an exponent).
     dT/dt is a numerical derivative of T along the path itself, not the chain-rule sum. */
  q18: p => {
    const T = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y;
    const X = t => p.p + p.q * t, Y = t => p.r * t * t;
    return [r(Dx(T, X(p.s), Y(p.s)), 5), r(Dy(T, X(p.s), Y(p.s)), 5), r(D(t => T(X(t), Y(t)), p.s), 5)];
  },
  /* T = a x² + b x y + c y² at (x, y), wind ⟨u, v⟩. Directional derivative: slide along the unit wind direction by a
     distance s and differentiate T numerically in s. */
  q19: p => {
    const T = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y;
    const n = Math.hypot(p.u, p.v);
    const dd = D(s => T(p.x + s * p.u / n, p.y + s * p.v / n), 0);
    return [r(Dx(T, p.x, p.y), 5), r(Dy(T, p.x, p.y), 5), r(dd, 5)];
  },
  /* P = a x² + b x y + c y² at (x, y). Greatest rate: maximise the directional derivative over the compass angle θ by
     a coarse scan then a golden-section search. The angle from due east (⟨1, 0⟩) is that best θ, taken in [0, π]. */
  q20: p => {
    const P = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y;
    const rate = th => D(s => P(p.x + s * Math.cos(th), p.y + s * Math.sin(th)), 0);
    let best = 0, bv = -Infinity;
    for (let i = 0; i < 3600; i++) { const th = -Math.PI + 2 * Math.PI * i / 3600; const v = rate(th); if (v > bv) { bv = v; best = th; } }
    let lo = best - 2 * Math.PI / 3600, hi = best + 2 * Math.PI / 3600;
    const g = (Math.sqrt(5) - 1) / 2;
    for (let i = 0; i < 100; i++) {
      const m1 = hi - g * (hi - lo), m2 = lo + g * (hi - lo);
      if (rate(m1) > rate(m2)) hi = m2; else lo = m1;
    }
    const th = (lo + hi) / 2;
    return [r(rate(th), 5), r(Math.abs(th), 3)];
  },
});
})();
