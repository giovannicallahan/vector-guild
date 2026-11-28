/* Independent oracles for Differential equations practice missions, file 5 of 8: q21b–q25d (game/realms/ode/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r3 = x => Math.round(x * 1000) / 1000;
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Steady-state amplitude of m x'' + c x' + k x = F cos(wt): F ÷ √((k − m w²)² + (c w)²). */
const ampl = (m, c, k, F, w) => F / Math.hypot(k - m * w * w, c * w);
/* Pump speed that maximises the amplitude, found by ternary search on the amplitude itself (it rises then falls for w > 0). */
const peakW = (m, c, k, F) => {
  let lo = 0, hi = 4 * Math.sqrt(k / m) + 1;
  for (let i = 0; i < 300; i++) {
    const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3;
    if (ampl(m, c, k, F, a) < ampl(m, c, k, F, b)) lo = a; else hi = b;
  }
  return (lo + hi) / 2;
};
/* Determinant of a 3 × 3 table by expanding along the first row. */
const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
/* Gaussian elimination with partial pivoting for A z = b. */
const solve = (A, b) => {
  const n = b.length, M = A.map((row, i) => row.concat([b[i]]));
  for (let i = 0; i < n; i++) {
    let piv = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[piv][i])) piv = r;
    [M[i], M[piv]] = [M[piv], M[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const f = M[r][i] / M[i][i]; for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c]; }
  }
  return M.map((row, i) => row[n] / row[i]);
};
/* Columns of the Wronskian table at t = 0: value, first and second derivative of e^(rt), of t e^(rt), and combinations. */
const expCol = r => [1, r, r * r];
const texpCol = r => [0, 1, 2 * r];
const comb = (a, u, b, v) => u.map((x, i) => a * x + b * v[i]);
const fromCols = cols => [0, 1, 2].map(row => cols.map(c => c[row]));
/* Forced swing x = A cos(wt) + B sin(wt) of m x'' + c x' + k x = F cos(wt): put x in the equation and match the cos and sin terms. */
const swing = (m, c, k, F, w) => solve([[k - m * w * w, c * w], [-c * w, k - m * w * w]], [F, 0]);
/* Tables for q23: |k − m w²| = s·a and c w = s·b for the pair (a, b) of row i; the printed push is F = j s h² ÷ 10 (h² = a² + b²).
   The index i only picks the row. neg says whether k − m w² is negative. */
const T23bc = [[3, 4], [4, 3], [6, 8], [8, 6]];
const T23d = [[5, 12], [12, 5], [8, 15], [15, 8]];
const build23 = (tab, p) => {
  const [a, b] = tab[p.i], D = (p.neg ? -1 : 1) * p.s * a, cw = p.s * b;
  return { m: p.m, w: p.w, c: cw / p.w, k: p.m * p.w * p.w + D, F: p.j * p.s * (a * a + b * b) / 10 };
};
/* Euler's method for x′ = A x: new x = x + h (A x), with A written out as a matrix. */
const euler = (A, x, h, steps) => { for (let s = 0; s < steps; s++) x = x.map((xi, i) => xi + h * A[i].reduce((t, a, j) => t + a * x[j], 0)); return x; };
Object.assign(window.ORACLE, {
  /* q21b: the printed mass m, damping c, stiffness k and push F; a search for the pump speed with the largest amplitude.
     (A and i are the generator's own choices and are not used.) */
  q21b: p => { const w = peakW(p.m, p.c, p.k, p.F); return [r6(w), r6(ampl(p.m, p.c, p.k, p.F, w))]; },
  /* q21c: as q21b, then 1 if that largest amplitude is at most the printed limit L. (A, i and ok are not used.) */
  q21c: p => {
    const w = peakW(p.m, p.c, p.k, p.F), top = ampl(p.m, p.c, p.k, p.F, w);
    return [r6(w), r6(top), top <= p.L + 1e-9 ? 1 : 0];
  },
  /* q21d: as q21b, then the amplitude at the running speed wr to 3 decimal places. (A and i are not used.) */
  q21d: p => { const w = peakW(p.m, p.c, p.k, p.F); return [r6(w), r6(ampl(p.m, p.c, p.k, p.F, w)), r3(ampl(p.m, p.c, p.k, p.F, p.wr))]; },
  /* q22b: y3 is al y1 + be y2 when dep, else e^(r[2] t); Wronskian table at t = 0, determinant; independent when it is not zero. */
  q22b: p => {
    const c1 = expCol(p.r[0]), c2 = expCol(p.r[1]), c3 = p.dep ? comb(p.al, c1, p.be, c2) : expCol(p.r[2]);
    const W = det3(fromCols([c1, c2, c3]));
    return [r6(W), Math.abs(W) > 1e-9 ? 1 : 0];
  },
  /* q22c: W of e^(r1 t), e^(r2 t), e^(r3 t) at 0, then C1 from solving M C = (y(0), y′(0), y″(0)) with the start values built from C. */
  q22c: p => {
    const M = fromCols(p.r.map(expCol)), W = det3(M);
    const y0 = [0, 1, 2].map(n => p.C.reduce((t, c, i) => t + c * Math.pow(p.r[i], n), 0));
    return [r6(W), r6(solve(M, y0)[0])];
  },
  /* q22d: repeated root r (y1 = e^(rt), y2 = t e^(rt)) and root s; y3 is al y1 + be y2 when dep, else e^(st). */
  q22d: p => {
    const c1 = expCol(p.r), c2 = texpCol(p.r), c3 = p.dep ? comb(p.al, c1, p.be, c2) : expCol(p.s);
    const W = det3(fromCols([c1, c2, c3]));
    return [r6(W), Math.abs(W) > 1e-9 ? 1 : 0];
  },
  /* q23b: spring and push rebuilt from the table; A, B from the matching equations, then the amplitude. */
  q23b: p => { const s = build23(T23bc, p), [A, B] = swing(s.m, s.c, s.k, s.F, s.w); return [r6(A), r6(B), r6(Math.hypot(A, B))]; },
  /* q23c: the printed mass m, damping c, stiffness k, push F at frequency w; A, B from the matching equations, then 1 if
     the amplitude is at most the printed limit L. (i, neg, s, j and ok are the generator's own choices and are not used.) */
  q23c: p => {
    const [A, B] = swing(p.m, p.c, p.k, p.F, p.w), top = Math.hypot(A, B);
    return [r6(A), r6(B), top <= p.L + 1e-9 ? 1 : 0];
  },
  /* q23d: A, B at the running speed, then the practical resonance frequency by searching for the largest amplitude, to 3 places. */
  q23d: p => { const s = build23(T23d, p), [A, B] = swing(s.m, s.c, s.k, s.F, s.w); return [r6(A), r6(B), r3(peakW(s.m, s.c, s.k, s.F))]; },
  /* q24b: k x + c x′ + m x″ = 0 with k = m al, c = m be. Bottom row of A, then one Euler step. */
  q24b: p => {
    const k = p.m * p.al, c = p.m * p.be, A = [[0, 1], [-k / p.m, -c / p.m]];
    return [r6(A[1][0]), r6(A[1][1])].concat(euler(A, [p.x0, p.v0], p.h, 1).map(r6));
  },
  /* q24c: m x″ + (m be) x′ + (m al) x = 0, two Euler steps. */
  q24c: p => {
    const k = p.m * p.al, c = p.m * p.be, A = [[0, 1], [-k / p.m, -c / p.m]];
    return euler(A, [p.x0, p.v0], p.h, 2).map(r6);
  },
  /* q24d: m x‴ + m a x″ + m b x′ + m c x = 0; bottom row of A, then one Euler step. */
  q24d: p => {
    const A = [[0, 1, 0], [0, 0, 1], [-p.m * p.c / p.m, -p.m * p.b / p.m, -p.m * p.a / p.m]];
    return A[2].map(r6).concat(euler(A, [p.p0, p.p1, p.p2], p.h, 1).map(r6));
  },
  /* q25b: A has the eigenvector (1, b) for l: A = [[l − b q, q], [b (l − s), s]]. The claim is x = e^(l t)(1, slope), slope b when ok and b + d when not. */
  q25b: p => {
    const A = [[p.l - p.b * p.q, p.q], [p.b * (p.l - p.s), p.s]], slope = p.ok ? p.b : p.b + p.d;
    const Av = [A[0][0] + A[0][1] * slope, A[1][0] + A[1][1] * slope];
    return [A[0][0] * p.p1 + A[0][1] * p.p2, A[1][0] * p.p1 + A[1][1] * p.p2, Math.abs(Av[0] - p.l) < 1e-9 && Math.abs(Av[1] - p.l * slope) < 1e-9 ? 1 : 0];
  },
  /* q25c: u = e^(l1 t)(1, m) and w = e^(l2 t)(1, m + 1); A = P diag(l1, l2) P⁻¹. Start x(0) = al u(0) + be w(0), then x′(0) = A x(0). */
  q25c: p => {
    const P = [[1, 1], [p.m, p.m + 1]], Pinv = [[p.m + 1, -1], [-p.m, 1]];
    const PD = [[P[0][0] * p.l1, P[0][1] * p.l2], [P[1][0] * p.l1, P[1][1] * p.l2]];
    const A = [0, 1].map(i => [0, 1].map(j => PD[i][0] * Pinv[0][j] + PD[i][1] * Pinv[1][j]));
    const x0 = [p.al + p.be, p.al * p.m + p.be * (p.m + 1)];
    return x0.concat([A[0][0] * x0[0] + A[0][1] * x0[1], A[1][0] * x0[0] + A[1][1] * x0[1]]);
  },
  /* q25d: m x″ − m (r1 + r2) x′ + m r1 r2 x = 0 as a system; the claim x = e^(mu t)(1, mu) holds when mu is a root. */
  q25d: p => {
    const c = -p.m * (p.r1 + p.r2), k = p.m * p.r1 * p.r2, A = [[0, 1], [-k / p.m, -c / p.m]];
    const Av = [A[0][1] * p.mu, A[1][0] + A[1][1] * p.mu];
    return [A[0][1] * p.p2, A[1][0] * p.p1 + A[1][1] * p.p2, Math.abs(Av[0] - p.mu) < 1e-9 && Math.abs(Av[1] - p.mu * p.mu) < 1e-9 ? 1 : 0];
  },
});
})();
