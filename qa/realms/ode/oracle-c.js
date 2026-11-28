/* Independent oracles for Differential equations learn missions, file c: q21–q30 (game/realms/ode/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r9 = x => Math.round(x * 1e9) / 1e9;
const r3 = x => Math.round(x * 1000) / 1000;
/* e^(At) x0 for a 2×2 matrix A = [[a, b], [c, d]] by summing the Taylor series term by term. */
const expmApply = (A, t, x0) => {
  let term = x0.slice(), sum = x0.slice();
  for (let n = 1; n < 120; n++) {
    term = [(A[0][0] * term[0] + A[0][1] * term[1]) * t / n, (A[1][0] * term[0] + A[1][1] * term[1]) * t / n];
    sum = [sum[0] + term[0], sum[1] + term[1]];
  }
  return sum;
};
/* Eigenvalues of a real 2×2 matrix from its characteristic polynomial λ² − tr·λ + det. */
const eigs = A => {
  const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[1][0], disc = tr * tr - 4 * det;
  return { tr, det, disc, re: disc >= 0 ? [(tr - Math.sqrt(disc)) / 2, (tr + Math.sqrt(disc)) / 2] : null };
};
const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
  + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
Object.assign(window.ORACLE, {
  /* m x″ + c x′ + k x = F cos(ωt). `i` only picks a row of a table of (ω*, c/m, k/m): i0 (3, 8, 41), i1 (4, 6, 34),
     i2 (6, 16, 164), i3 (8, 12, 136), i4 (12, 10, 194). The peak is found by scanning the amplitude over ω, then
     refining. The push F is the whole number that makes A the amplitude at the peak (A is the prompt's answer). */
  q21: p => {
    const T = [[3, 8, 41], [4, 6, 34], [6, 16, 164], [8, 12, 136], [12, 10, 194]][p.i];
    const c = p.m * T[1], k = p.m * T[2];
    const root = w => Math.sqrt((k - p.m * w * w) ** 2 + (c * w) ** 2);
    let best = 0, bv = Infinity;
    for (let w = 0; w <= 60; w += 0.001) { const v = root(w); if (v < bv) { bv = v; best = w; } }
    let lo = best - 0.001, hi = best + 0.001;
    for (let n = 0; n < 100; n++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (root(a) < root(b)) hi = b; else lo = a; }
    const w = (lo + hi) / 2, R = root(w), F = Math.round(p.A * R);
    if (Math.abs(F - p.A * R) > 1e-6) throw new Error('push is not a whole number: ' + p.A * R);
    return [r9(w), r9(F / R)];
  },
  /* Third-order equation with roots r; y1 = e^(r1 t), y2 = e^(r2 t), y3 either e^(r3 t) or al·y1 + be·y2 when dep.
     Build the table of y, y′, y″ at t = 0 for each solution and take the 3×3 determinant. */
  q22: p => {
    const fns = [p.r[0], p.r[1]].map(r => [1, r, r * r]);
    const third = p.dep ? [0, 1, 2].map(j => p.al * fns[0][j] + p.be * fns[1][j]) : [1, p.r[2], p.r[2] * p.r[2]];
    const W = det3([fns[0], fns[1], third]);
    return [W, W !== 0 ? 1 : 0];
  },
  /* m x″ + c x′ + k x = F cos(ωt). Prompt gives m and ω (w); `i` indexes the table of (p, q) = (k − mω², cω) shapes
     i0 (3,4)×1, i1 (4,3)×1, i2 (3,4)×2, i3 (4,3)×2, multiplied by s; neg flips the sign of p. F makes the amplitude C.
     Putting x = A cos + B sin in the equation gives two linear equations, solved by elimination. */
  q23: p => {
    const [u, v, mult] = [[3, 4, 1], [4, 3, 1], [3, 4, 2], [4, 3, 2]][p.i];
    const P = (p.neg ? -1 : 1) * u * mult * p.s, Q = v * mult * p.s;
    const c = Q / p.w, k = P + p.m * p.w * p.w, F = p.C * Math.hypot(P, Q);
    // (k − mω²) A + cω B = F and −cω A + (k − mω²) B = 0, solved by elimination
    const m11 = k - p.m * p.w * p.w, m12 = c * p.w, m21 = -c * p.w, m22 = k - p.m * p.w * p.w;
    const f = m21 / m11, B = (0 - f * F) / (m22 - f * m12), A = (F - m12 * B) / m11;
    const W = Math.cos(0) * (p.w * Math.cos(0)) - Math.sin(0) * (-p.w * Math.sin(0));   // |cos sin; (cos)′ (sin)′| at t = 0
    return [r9(W), r9(A), r9(B), r9(Math.hypot(A, B))];
  },
  /* m x″ + m·be x′ + m·al x = 0 (the prompt's coefficients). Solve for x″, then one Euler step on (x, x′). */
  q24: p => {
    const c = p.m * p.be, k = p.m * p.al, acc = (x, v) => -(c * v + k * x) / p.m;
    return [0, 1, -p.al, -p.be, r9(p.x0 + p.h * p.v0), r9(p.v0 + p.h * acc(p.x0, p.v0))];
  },
  /* A = [[l − q b, q], [b (l − s), s]] (its row-1 vector (1, b) has eigenvalue l). The trial is e^(λt)(1, b) with
     λ = l when ok, l + d when not. A solution needs λ(1, b) = A(1, b). */
  q25: p => {
    const A = [[p.l - p.q * p.b, p.q], [p.b * (p.l - p.s), p.s]];
    const lam = p.ok ? p.l : p.l + p.d, v = [1, p.b];
    const Av = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
    const sol = Math.abs(Av[0] - lam * v[0]) < 1e-9 && Math.abs(Av[1] - lam * v[1]) < 1e-9 ? 1 : 0;
    return [A[0][0] * p.p1 + A[0][1] * p.p2, A[1][0] * p.p1 + A[1][1] * p.p2, sol];
  },
  /* A = P diag(l1, l2) P⁻¹ with P = [[1, 1], [m, m + 1]]; x(0) = c1 (1, m) + c2 (1, m + 1). The eigenvalues come
     from the characteristic polynomial of A and x₁(ln 2) from the Taylor series of e^(At). */
  q26: p => {
    const m = p.m, A = [[p.l1 * (m + 1) - p.l2 * m, p.l2 - p.l1], [m * (m + 1) * (p.l1 - p.l2), -m * p.l1 + (m + 1) * p.l2]];
    const x0 = [p.c1 + p.c2, p.c1 * m + p.c2 * (m + 1)];
    const e = eigs(A).re;
    return [r9(e[0]), r9(e[1]), r9(expmApply(A, Math.LN2, x0)[0])];
  },
  /* A = a I + [[x, y], [z, −x]] with x = m b, y = −b, z = b(1 + m²); flip gives [[a − x, −z], [−y, a + x]].
     The eigenvalues come from the characteristic polynomial: a ± bi, so the growth rate is tr ÷ 2 and the angular
     frequency √(det − (tr ÷ 2)²). */
  q27: p => {
    const x = p.m * p.b, y = -p.b, z = p.b * (1 + p.m * p.m);
    const A = p.flip ? [[p.a - x, -z], [-y, p.a + x]] : [[p.a + x, y], [z, p.a - x]];
    const e = eigs(A), a = e.tr / 2, b = Math.sqrt(e.det - a * a);
    return [r9(a), r9(b), r3(2 * Math.PI / b)];
  },
  /* `kind` picks the eigenvalues: 1 node and 2 saddle have real eigenvalues a, b; 3 spiral has a ± bi; 4 centre has
     ±bi. Trace is their sum and determinant their product; the portrait and stability are read from the
     characteristic polynomial (det < 0 saddle; tr² ≥ 4 det node; else spiral, or centre when tr = 0). */
  q28: p => {
    const tr = p.kind <= 2 ? p.a + p.b : p.kind === 3 ? 2 * p.a : 0;
    const det = p.kind <= 2 ? p.a * p.b : p.kind === 3 ? p.a * p.a + p.b * p.b : p.b * p.b;
    const disc = tr * tr - 4 * det;
    const code = det < 0 ? 2 : disc >= 0 ? 1 : tr === 0 ? 4 : 3;
    const stable = code === 2 ? 0 : (tr < 0 || (code === 4)) ? 1 : 0;
    return [tr, det, code, stable];
  },
  /* `i` indexes the table (V1, V2, in, 1→2, 2→1, out) of litres and L/min: 0 (10,10,15,20,5,15), 1 (10,10,16,25,9,16),
     2 (10,10,24,25,1,24), 3 (10,10,30,40,10,30), 4 (10,10,40,45,5,40), 5 (10,20,25,40,15,25), 6 (10,25,30,50,20,30),
     7 (20,10,25,40,15,25), 8 (20,20,30,40,10,30), 9 (20,20,32,50,18,32), 10 (25,10,30,50,20,30). Fresh water carries no
     salt, so x₁′ = (−r12 x₁ ÷ V1) + r21 x₂ ÷ V2 and x₂′ = r12 x₁ ÷ V1 − (r21 + out) x₂ ÷ V2. Eigenvalues from the
     characteristic polynomial; x₁(ln 2) from the Taylor series of e^(At), rounded to 3 decimals. */
  q29: p => {
    const [V1, V2, , r12, r21, out] = [[10, 10, 15, 20, 5, 15], [10, 10, 16, 25, 9, 16], [10, 10, 24, 25, 1, 24],
      [10, 10, 30, 40, 10, 30], [10, 10, 40, 45, 5, 40], [10, 20, 25, 40, 15, 25], [10, 25, 30, 50, 20, 30],
      [20, 10, 25, 40, 15, 25], [20, 20, 30, 40, 10, 30], [20, 20, 32, 50, 18, 32], [25, 10, 30, 50, 20, 30]][p.i];
    const A = [[-r12 / V1, r21 / V2], [r12 / V1, -(r21 + out) / V2]];
    const e = eigs(A);
    return [r9(e.re[0]), r9(e.re[1]), r3(expmApply(A, Math.LN2, [p.s1, p.s2])[0])];
  },
  /* f(t) = al t^k + be e^(a t) + ga trig(b t). Transform: integrate e^(−st) f(t) from 0 to a large T by Simpson's
     rule. The largest growth rate is max(0, a) (the powers and trig terms grow no faster than 0, e^(at) like a),
     so s must be greater than that. */
  q30: p => {
    const f = t => p.al * Math.pow(t, p.k) + p.be * Math.exp(p.a * t) + p.ga * (p.trig === 'sin' ? Math.sin(p.b * t) : Math.cos(p.b * t));
    const g = t => Math.exp(-p.s * t) * f(t), T = 80, N = 160000, h = T / N;
    let sum = g(0) + g(T);
    for (let n = 1; n < N; n++) sum += g(n * h) * (n % 2 ? 4 : 2);
    return [Math.max(0, p.a), r9(sum * h / 3)];
  },
});
})();
