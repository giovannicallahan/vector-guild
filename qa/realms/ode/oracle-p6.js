/* Independent oracles for Differential equations practice missions, file 6 of 8: q26b–q30d (game/realms/ode/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round half away from zero; the small nudge keeps an exact tie such as 2.0625 from being lost to floating-point noise. */
const r3 = x => Math.sign(x) * Math.round(Math.abs(x) * 1e3 + 1e-7) / 1e3, r6 = x => Math.round(x * 1e6) / 1e6;
/* Eigenvalues of a 2×2 matrix [[a,b],[c,d]] from its characteristic equation λ² − (trace)λ + (determinant) = 0. */
const eig = A => {
  const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[1][0], disc = tr * tr - 4 * det;
  return disc >= 0 ? { tr, det, disc, real: true, l: [(tr - Math.sqrt(disc)) / 2, (tr + Math.sqrt(disc)) / 2] }
                   : { tr, det, disc, real: false, re: tr / 2, im: Math.sqrt(-disc) / 2 };
};
/* Matrix A = P M P⁻¹ with P = [[1,1],[m,m+1]] (determinant 1), so A has integer entries when M does. */
const conj = (M, m) => {
  const P = [[1, 1], [m, m + 1]], Pi = [[m + 1, -1], [-m, 1]];
  const mul = (X, Y) => [[X[0][0] * Y[0][0] + X[0][1] * Y[1][0], X[0][0] * Y[0][1] + X[0][1] * Y[1][1]],
                         [X[1][0] * Y[0][0] + X[1][1] * Y[1][0], X[1][0] * Y[0][1] + X[1][1] * Y[1][1]]];
  return mul(mul(P, M), Pi);
};
/* Integrate x′ = Ax + f from x0 over [0, T] with classical Runge–Kutta (n steps). */
const rk4 = (A, f, x0, T, n) => {
  const F = x => [A[0][0] * x[0] + A[0][1] * x[1] + f[0], A[1][0] * x[0] + A[1][1] * x[1] + f[1]];
  const h = T / n; let x = x0.slice();
  for (let i = 0; i < n; i++) {
    const k1 = F(x), k2 = F([x[0] + h / 2 * k1[0], x[1] + h / 2 * k1[1]]), k3 = F([x[0] + h / 2 * k2[0], x[1] + h / 2 * k2[1]]), k4 = F([x[0] + h * k3[0], x[1] + h * k3[1]]);
    x = [x[0] + h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), x[1] + h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
  }
  return x;
};
/* Phase-portrait code (1 node, 2 saddle, 3 spiral, 4 centre) and stability (centre counts as stable). */
const portrait = A => {
  const e = eig(A);
  if (e.det === 0) throw Error('zero determinant: no isolated critical point');
  const kind = e.disc > 0 ? (e.det > 0 ? 1 : 2) : e.disc < 0 ? (e.tr === 0 ? 4 : 3) : (e.det > 0 ? 1 : 2);
  const stable = kind === 4 ? 1 : kind === 2 ? 0 : (e.tr < 0 ? 1 : 0);
  return { e, kind, stable };
};
/* Laplace transform by numerical integration of f(t)e^(−st) over [0, 80] (Simpson), plus the abscissa: the least
   number s must exceed. A term is { c, kind: 'pow'|'exp'|'sin'|'cos', w } with c the coefficient and w the
   power, exponent or frequency; a term with c = 0 is dropped. */
const laplace = (terms, s) => {
  const ts = terms.filter(t => t.c !== 0);
  const growth = ts.map(t => t.kind === 'exp' ? t.w : 0), abscissa = Math.max(...growth);
  if (s <= abscissa) throw Error('s is not above the abscissa');
  const f = t => ts.reduce((sum, u) => sum + u.c * (u.kind === 'pow' ? Math.pow(t, u.w) : u.kind === 'exp' ? Math.exp(u.w * t)
    : u.kind === 'sin' ? Math.sin(u.w * t) : Math.cos(u.w * t)), 0) * Math.exp(-s * t);
  const T = 80, n = 40000, h = T / n; let sum = f(0) + f(T);
  for (let i = 1; i < n; i++) sum += f(i * h) * (i % 2 ? 4 : 2);
  return { abscissa, value: sum * h / 3 };
};
/* Two tanks of volumes V1, V2 with pumps p12 (1→2), p21 (2→1), drains d1, d2 and inflow salt/nutrient rates e1, e2
   (kg/min): x1′ = e1 − ((p12 + d1)/V1) x1 + (p21/V2) x2,  x2′ = e2 + (p12/V1) x1 − ((p21 + d2)/V2) x2. */
const tanks = (V1, V2, p12, p21, d1, d2) => [[-(p12 + d1) / V1, p21 / V2], [p12 / V1, -(p21 + d2) / V2]];
Object.assign(window.ORACLE, {
  /* q26b: P = [[1,1],[m,m+1]] holds the eigenvectors (1, m) for l1 and (1, m+1) for l2; x(0) = c1 (1, m) + c2 (1, m+1).
     The answer is found by stepping x′ = Ax with Runge–Kutta from t = 0 to t = ln 2. */
  q26b: p => {
    const A = conj([[p.l1, 0], [0, p.l2]], p.m), e = eig(A);
    const x0 = [p.c1 + p.c2, p.c1 * p.m + p.c2 * (p.m + 1)];
    return [r6(e.l[0]), r6(e.l[1]), r6(rk4(A, [0, 0], x0, Math.log(2), 4000)[1])];
  },
  /* q26c: same layout as q26b. The long-run ratio comes from stepping x′ = Ax for 40 minutes, rescaling each step so
     the larger term can be seen to take over; the start must include the larger-eigenvalue term. */
  q26c: p => {
    const A = conj([[p.l1, 0], [0, p.l2]], p.m), e = eig(A);
    const x0 = [p.c1 + p.c2, p.c1 * p.m + p.c2 * (p.m + 1)];
    if (p.c2 === 0) throw Error('start has none of the larger-eigenvalue term');
    let x = x0.slice();
    for (let i = 0; i < 4000; i++) { x = rk4(A, [0, 0], x, 0.01, 1); const n = Math.hypot(x[0], x[1]); x = [x[0] / n, x[1] / n]; }
    return [r6(e.l[0]), r6(e.l[1]), r6(x[1] / x[0])];
  },
  /* q26d: y″ − (l1 + l2) y′ + l1 l2 y = 0, so x₁ = y, x₂ = y′ has A = [[0,1],[−l1 l2, l1 + l2]]; y = c1 e^(l1 t) + c2 e^(l2 t),
     so y(0) = c1 + c2 and y′(0) = c1 l1 + c2 l2. The sway at t = ln 2 is found by stepping the system. */
  q26d: p => {
    const A = [[0, 1], [-p.l1 * p.l2, p.l1 + p.l2]], e = eig(A);
    const x0 = [p.c1 + p.c2, p.c1 * p.l1 + p.c2 * p.l2];
    return [r6(e.l[0]), r6(e.l[1]), r6(rk4(A, [0, 0], x0, Math.log(2), 4000)[0])];
  },
  /* q27b: the matrix has eigenvalues a ± bi, as the real matrix [[a, −b], [b, a]] has; m and flip only change how the
     matrix is laid out in the text. The eigenvalues come from the characteristic equation. */
  q27b: p => {
    const e = eig(conj([[p.a, -p.b], [p.b, p.a]], p.m));
    if (e.real) throw Error('eigenvalues are real');
    return [r6(e.re), r6(e.im), r3(e.im / (2 * Math.PI))];
  },
  /* q27c: m y″ + c y′ + k y = 0 with c = −2 a m and k = m (a² + b²), so A has rows (0, 1) and (−k/m, −c/m). */
  q27c: p => {
    const k = p.m * (p.a * p.a + p.b * p.b), c = -2 * p.a * p.m;
    const e = eig([[0, 1], [-k / p.m, -c / p.m]]);
    if (e.real) throw Error('eigenvalues are real');
    return [r6(e.re), r6(e.im), r3(Math.exp(e.re * 2 * Math.PI / e.im))];
  },
  /* q27d: the matrix is printed in the prompt; its eigenvalues are a ± bi, and one turn takes 2π ÷ b (from the exact b). */
  q27d: p => {
    const e = eig([[p.a11, p.a12], [p.a21, p.a22]]);
    if (e.real) throw Error('eigenvalues are real');
    return [r6(e.re), r3(e.im), r3(2 * Math.PI / e.im)];
  },
  /* q28b: `kind` only picks the family: 1 and 2 have real eigenvalues a and b (a node, a saddle), 3 and 4 have complex
     eigenvalues a ± bi (a spiral, a centre). The matrix is built from them and classified from its trace and determinant. */
  q28b: p => {
    const M = p.kind <= 2 ? [[p.a, 0], [0, p.b]] : [[p.a, -p.b], [p.b, p.a]];
    const r = portrait(conj(M, p.m));
    return [r.e.disc, r.kind, r.stable];
  },
  /* q28c: x₁′ = s1 x₁ − q x₂ ("pulled down by heater 2"), x₂′ = r x₁ + s2 x₂. */
  q28c: p => {
    const r = portrait([[p.s1, -p.q], [p.r, p.s2]]);
    return [r.e.det, r.kind, r.stable];
  },
  /* q28d: y″ + P y′ + Q y = 0, with x₁ = y and x₂ = y′, so A has rows (0, 1) and (−Q, −P). `kind` is not used. */
  q28d: p => {
    const r = portrait([[0, 1], [-p.Q, -p.P]]);
    return [r.e.tr, r.e.det, r.kind, r.stable];
  },
  /* q29b: p.i is only an index into the printed layouts [V1, V2, clean inflow to trough 2, pump 2→1, pump 1→2, drain of
     trough 1]; s1 and s2 are the starting kilograms. */
  q29b: p => {
    const L = [[10, 10, 15, 20, 5, 15], [10, 10, 16, 25, 9, 16], [10, 10, 24, 25, 1, 24], [10, 10, 30, 40, 10, 30],
      [10, 10, 40, 45, 5, 40], [20, 10, 25, 40, 15, 25], [25, 10, 30, 50, 20, 30], [10, 20, 25, 40, 15, 25],
      [20, 20, 30, 40, 10, 30], [20, 20, 32, 50, 18, 32], [10, 25, 30, 50, 20, 30]][p.i];
    const [V1, V2, , p21, p12, d1] = L, A = tanks(V1, V2, p12, p21, d1, 0), e = eig(A);
    return [r6(e.l[0]), r6(e.l[1]), r3(rk4(A, [0, 0], [p.s1, p.s2], Math.log(2), 4000)[0])];
  },
  /* q29c: p.i is only an index into the printed layouts [V1, V2, inflow to tank 1, inflow to tank 2, pump 1→2, pump 2→1,
     drain of tank 1, drain of tank 2]; the inflows are clean water. s1 and s2 are the starting kilograms. */
  q29c: p => {
    const L = [[10, 20, 10, 20, 2, 19, 27, 3], [10, 25, 8, 26, 4, 10, 14, 20], [10, 25, 10, 25, 5, 18, 23, 12],
      [10, 40, 10, 40, 4, 19, 25, 25], [20, 25, 16, 26, 4, 20, 32, 10], [20, 10, 3, 27, 2, 19, 20, 10],
      [25, 10, 12, 23, 5, 18, 25, 10], [25, 20, 10, 32, 4, 20, 26, 16], [25, 25, 10, 40, 5, 20, 25, 25],
      [40, 20, 21, 39, 14, 33, 40, 20], [20, 25, 13, 28, 12, 35, 36, 5], [25, 20, 5, 36, 12, 35, 28, 13],
      [10, 10, 3, 24, 4, 9, 8, 19], [20, 10, 8, 31, 7, 16, 17, 22], [40, 25, 28, 37, 8, 20, 40, 25]][p.i];
    const [V1, V2, , , p12, p21, d1, d2] = L, A = tanks(V1, V2, p12, p21, d1, d2), e = eig(A);
    return [r6(e.l[0]), r6(e.l[1]), r3(rk4(A, [0, 0], [p.s1, p.s2], Math.log(2), 4000)[0])];
  },
  /* q29d: p.i is only an index into the printed layouts [V1, V2, brine inflow to tank 1, pump 1→2, pump 2→1, drain of
     tank 2]; the brine has k kg per litre. The long-run amounts solve A L = −(inflow), found by Cramer's rule; the salt
     is stepped directly from the starting amounts s1, s2 (not through y). */
  q29d: p => {
    const L = [[10, 10, 15, 20, 5, 15], [10, 10, 16, 25, 9, 16], [10, 10, 24, 25, 1, 24], [10, 10, 30, 40, 10, 30],
      [10, 10, 40, 45, 5, 40], [10, 20, 25, 40, 15, 25], [10, 25, 30, 50, 20, 30], [20, 10, 25, 40, 15, 25],
      [20, 20, 30, 40, 10, 30], [20, 20, 32, 50, 18, 32], [25, 10, 30, 50, 20, 30]][p.i];
    const [V1, V2, in1, p12, p21, d2] = L, A = tanks(V1, V2, p12, p21, 0, d2), e = eig(A), f = [p.k * in1, 0];
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    const L1 = (-f[0] * A[1][1] + A[0][1] * f[1]) / det;
    return [r6(L1), r6(e.l[0]), r6(e.l[1]), r3(rk4(A, f, [p.s1, p.s2], Math.log(2), 4000)[0])];
  },
  /* q30b: f = al e^(a1 t) + be e^(a2 t) + ga t^k (al, be, ga are the coefficients). */
  q30b: p => {
    const r = laplace([{ c: p.al, kind: 'exp', w: p.a1 }, { c: p.be, kind: 'exp', w: p.a2 }, { c: p.ga, kind: 'pow', w: p.k }], p.s);
    return [r.abscissa, r6(r.value)];
  },
  /* q30c: f = al t + ga sin(b t) (or cos), g = g0 + de e^(a t), h = m f − g. */
  q30c: p => {
    const r = laplace([{ c: p.m * p.al, kind: 'pow', w: 1 }, { c: p.m * p.ga, kind: p.trig, w: p.b }, { c: -p.g0, kind: 'pow', w: 0 },
      { c: -p.de, kind: 'exp', w: p.a }], p.s);
    return [r.abscissa, r6(r.value)];
  },
  /* q30d: f = al t^k + be e^(a t) + ga sin(b1 t) + de cos(b2 t). */
  q30d: p => {
    const r = laplace([{ c: p.al, kind: 'pow', w: p.k }, { c: p.be, kind: 'exp', w: p.a }, { c: p.ga, kind: 'sin', w: p.b1 },
      { c: p.de, kind: 'cos', w: p.b2 }], p.s);
    return [r.abscissa, r3(r.value)];
  }
});
})();
