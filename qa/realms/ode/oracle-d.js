/* Independent oracles for Differential equations learn missions, file d: q31–q40 (game/realms/ode/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  const rnd = (x, dp) => { const f = Math.pow(10, dp); const r = Math.round(x * f) / f; return r === 0 ? 0 : r; };

  /* Classical fourth-order Runge–Kutta for a vector system u' = F(t, u) from t0 to t1 in n steps. */
  function rk4(F, t0, u0, t1, n) {
    const h = (t1 - t0) / n; let u = u0.slice(), t = t0;
    const add = (a, b, s) => a.map((x, i) => x + s * b[i]);
    for (let i = 0; i < n; i++) {
      const k1 = F(t, u), k2 = F(t + h / 2, add(u, k1, h / 2)), k3 = F(t + h / 2, add(u, k2, h / 2)), k4 = F(t + h, add(u, k3, h));
      u = u.map((x, j) => x + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); t += h;
    }
    return u;
  }
  /* Central-difference Jacobian of a map (x, y) -> [f, g]. */
  function jac(fn, x, y) {
    const h = 1e-4, fx = fn(x + h, y), bx = fn(x - h, y), fy = fn(x, y + h), by = fn(x, y - h);
    return [[(fx[0] - bx[0]) / (2 * h), (fy[0] - by[0]) / (2 * h)], [(fx[1] - bx[1]) / (2 * h), (fy[1] - by[1]) / (2 * h)]];
  }
  /* y(L) for y'' + lam y = 0, y(0) = 0, y'(0) = 1, by RK4. Zero exactly when lam is an allowed value. */
  const shoot = (lam, L) => rk4((t, u) => [u[1], -lam * u[0]], 0, [0, 1], L, 2000)[0];
  /* k-th smallest lam > 0 with shoot(lam, L) = 0: scan for sign changes, then bisect. Step 1/L² is far below the gap
     between neighbouring allowed values for the lengths used. */
  function kthEigen(L, k) {
    const step = 0.5 / (L * L); let found = 0, a = step, fa = shoot(a, L);
    for (let i = 1; i < 100000; i++) {
      const b = a + step, fb = shoot(b, L);
      if (fa * fb < 0) {
        let lo = a, hi = b, flo = fa;
        for (let it = 0; it < 70; it++) { const mid = (lo + hi) / 2, fm = shoot(mid, L); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } }
        if (++found === k) return (lo + hi) / 2;
      }
      a = b; fa = fb;
    }
    return NaN;
  }
  /* Coexistence point of x' = a x − b x y, y' = −c y + d x y: Newton from a grid of starts, keep a root with both > 0. */
  function coexist(a, b, c, d) {
    const fn = (x, y) => [a * x - b * x * y, -c * y + d * x * y];
    for (let sx = 1; sx <= 40; sx += 3) for (let sy = 1; sy <= 40; sy += 3) {
      let x = sx, y = sy;
      for (let it = 0; it < 80; it++) {
        const F = fn(x, y), J = jac(fn, x, y), det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
        if (!isFinite(det) || Math.abs(det) < 1e-14) break;
        x -= (J[1][1] * F[0] - J[0][1] * F[1]) / det; y -= (-J[1][0] * F[0] + J[0][0] * F[1]) / det;
      }
      const F = fn(x, y);
      if (Math.abs(F[0]) < 1e-9 && Math.abs(F[1]) < 1e-9 && x > 1e-6 && y > 1e-6) return [x, y];
    }
    return null;
  }

Object.assign(window.ORACLE, {
  /* F(s) = (N s + M) ÷ ((s − a)(s − b)); a, b are the roots in the bottom and A, B the numbers the signal is built
     from, so the top is N = A + B, M = −(A b + B a). The coefficient of each exponential is the limit of
     (s − root)F(s) as s tends to the root, taken as the mean of values just either side of it. */
  q31: p => {
    const N = p.A + p.B, M = -(p.A * p.b + p.B * p.a);
    const F = s => (N * s + M) / ((s - p.a) * (s - p.b));
    const lim = r => { const e = 1e-6; return ((r + e - r) * F(r + e) + (r - e - r) * F(r - e)) / 2; };
    return [rnd(lim(p.a), 5), rnd(lim(p.b), 5)];
  },
  /* y″ + P y′ + Q y = 0 with P = −(r1 + r2), Q = r1 r2; y(0) = A + B, y′(0) = A r1 + B r2 (r1, r2 = roots, A, B =
     the weights the initial values are built from; T = the time asked). The roots come from the quadratic formula,
     the residues of Y(s) = (y0 s + y1 + P y0) ÷ (s² + Ps + Q) as one-sided limits, and y(T) by RK4 on the equation. */
  q32: p => {
    const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, y0 = p.A + p.B, y1 = p.A * p.r1 + p.B * p.r2;
    const sq = Math.sqrt(P * P - 4 * Q), ra = (-P + sq) / 2, rb = (-P - sq) / 2;
    const Y = s => (y0 * s + y1 + P * y0) / (s * s + P * s + Q);
    const lim = r => { const e = 1e-6; return ((e) * Y(r + e) + (-e) * Y(r - e)) / 2; };
    const yT = rk4((t, u) => [u[1], -P * u[1] - Q * u[0]], 0, [y0, y1], p.T, 4000)[0];
    return [rnd(lim(ra), 5), rnd(lim(rb), 5), rnd(yT, 3)];
  },
  /* v′ + k v = k m u(t − a), v(0) = 0 (m = the long-run voltage the line settles to, so the supply term is k m; d =
     seconds after the switch at which v is asked). Nothing happens before t = a, so integrate from a with v = 0:
     once to a + d, and once for a long time to read the settled value. */
  q33: p => {
    const F = (t, u) => [-p.k * u[0] + p.k * p.m];
    const v = rk4(F, p.a, [0], p.a + p.d, 4000)[0];
    const far = rk4(F, p.a, [0], p.a + 60 / p.k, 20000)[0];
    return [rnd(far, 3), rnd(v, 3)];
  },
  /* (f ∗ g)(T) with f = p t, g = q, as a midpoint sum of f(τ)g(T − τ); then y′ + k y = c δ(t − a), y(0) = 0: the
     impulse jumps y from 0 to c at t = a, after which y decays; read d seconds later by RK4. */
  q34: p => {
    const n = 20000, h = p.T / n; let conv = 0;
    for (let i = 0; i < n; i++) { const tau = (i + 0.5) * h; conv += (p.p * tau) * p.q * h; }
    const y = rk4((t, u) => [-p.k * u[0]], p.a, [p.c], p.a + p.d, 4000)[0];
    return [rnd(conv, 3), rnd(y, 3)];
  },
  /* y″ + b x y′ + c y = 0 with y(0) = a0, y′(0) = a1. Differentiating the equation n times and putting x = 0 gives
     y^(n+2)(0) = −(b n + c) y^(n)(0) (the product x y′ contributes n y^(n)(0)). The Taylor coefficient is
     y^(n)(0) ÷ n!. */
  q35: p => {
    const d = [p.a0, p.a1];
    for (let n = 0; n <= 2; n++) d.push(-(p.b * n + p.c) * d[n]);
    const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
    return [d[2] / fact(2), d[3] / fact(3), d[4] / fact(4)];
  },
  /* x′ = x y − K, y′ = y − c x + e with e = c (r1 + r2) and K = −c r1 r2 (the printed signs follow from these; r1, r2
     are the two x-values of the critical points). Critical points: the second equation is linear in y, so solve
     it for y at each x, then scan the first equation along that line for sign changes and bisect. Jacobian by
     central differences at the critical point with the larger x. */
  q36: p => {
    const K = -p.c * p.r1 * p.r2, e = p.c * (p.r1 + p.r2);
    const f = (x, y) => x * y - K, g = (x, y) => y - p.c * x + e;
    const yOn = x => { const g0 = g(x, 0), g1 = g(x, 1); return -g0 / (g1 - g0); };
    const h = x => f(x, yOn(x));
    const roots = []; let x0 = -60.1234, h0 = h(x0);
    for (let i = 0; i < 24000; i++) {
      const x1 = x0 + 0.005, h1 = h(x1);
      if (h0 * h1 < 0 || h1 === 0) {
        let lo = x0, hi = x1, flo = h0;
        for (let it = 0; it < 80; it++) { const mid = (lo + hi) / 2, fm = h(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } }
        roots.push((lo + hi) / 2);
      }
      x0 = x1; h0 = h1;
    }
    const x = Math.max(...roots), y = yOn(x);
    const J = jac((a, b) => [f(a, b), g(a, b)], x, y);
    return [rnd(x, 5), rnd(y, 5), rnd(J[0][0], 4), rnd(J[0][1], 4), rnd(J[1][0], 4), rnd(J[1][1], 4)];
  },
  /* x′ = y, y′ = g(x, y) = −(x − r1)(x − r1 − D) − c y (so the zeros of the x-part are r1 and r1 + D); at = 1 means
     the point is the larger zero, at = 0 the smaller. Jacobian by central differences, eigenvalues of
     [[0, 1], [g_x, g_y]] from the characteristic quadratic λ² − (trace)λ + (determinant). Code: 1 node, 2 saddle,
     3 spiral, 4 centre. */
  q37: p => {
    const r2 = p.r1 + p.D, x = p.at ? r2 : p.r1;
    const g = (a, b) => -(a - p.r1) * (a - r2) - p.c * b;
    const gx = (g(x + 1e-3, 0) - g(x - 1e-3, 0)) / 2e-3, gy = (g(x, 1e-3) - g(x, -1e-3)) / 2e-3;
    const tr = gy, det = -gx, disc = tr * tr - 4 * det;
    let re1, re2, im, code;
    if (disc > 1e-9) {
      re1 = (tr + Math.sqrt(disc)) / 2; re2 = (tr - Math.sqrt(disc)) / 2; im = 0;
      code = re1 * re2 < 0 ? 2 : 1;
    } else if (disc < -1e-9) {
      re1 = re2 = tr / 2; im = Math.sqrt(-disc) / 2; code = Math.abs(tr) < 1e-6 ? 4 : 3;
    } else { re1 = re2 = tr / 2; im = 0; code = 1; }
    return [rnd(re1, 5), rnd(re2, 5), rnd(im, 5), code];
  },
  /* x′ = a x − b x y, y′ = −c y + d x y with b = a ÷ ys and d = c ÷ xs (the printed coefficients). The coexistence
     point is found by Newton's method; the Jacobian there by central differences; its trace is 0, so the
     eigenvalues are ±iω with ω² = det (from λ² + det = 0) and the period is 2π ÷ ω. */
  q38: p => {
    const b = p.a / p.ys, d = p.c / p.xs;
    const fn = (x, y) => [p.a * x - b * x * y, -p.c * y + d * x * y];
    const pt = coexist(p.a, b, p.c, d);
    const J = jac(fn, pt[0], pt[1]), det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    return [rnd(pt[0], 5), rnd(pt[1], 5), rnd(2 * Math.PI / Math.sqrt(det), 2)];
  },
  /* Part 1: the k-th allowed λ for y″ + λy = 0 on [0, L] with y(0) = y(L) = 0, found by shooting and bisection
     (units of λ in multiples of π²). Part 2: y″ + μπ² y = 0 with y(0) = 0, y(L) = B. The solutions with y(0) = 0 are
     C·sin; if the shot y(L) for y′(0) = 1 is 0 the end value cannot be reached (none or many), otherwise exactly one.
     eig and m only choose μ (a one-line index into the two prompt shapes): eig = 1 gives μ = (m ÷ L)², eig = 0 gives
     μ = m ÷ L². */
  q39: p => {
    const mu = p.eig ? Math.pow(p.m / p.L, 2) : p.m / (p.L * p.L);
    const end = shoot(mu * Math.PI * Math.PI, p.L);
    return [rnd(kthEigen(p.L, p.k) / (Math.PI * Math.PI), 5), Math.abs(end) < 1e-6 ? 0 : 1];
  },
  /* Lowest allowed λ for X″ + λX = 0 on [0, L] with X(0) = X(L) = 0, by shooting; ω = w √λ. Then the coexistence point
     of x′ = a x − b x y, y′ = −c y + d x y with b = a ÷ ys, d = c ÷ xs (the printed coefficients), by Newton's method. */
  q40: p => {
    const lam = kthEigen(p.L, 1);
    const b = p.a / p.ys, d = p.c / p.xs;
    const pt = coexist(p.a, b, p.c, d);
    return [rnd(p.w * Math.sqrt(lam), 2), rnd(pt[1], 5)];
  },
});
})();
