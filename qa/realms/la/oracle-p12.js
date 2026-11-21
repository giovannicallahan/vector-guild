/* Independent oracles for linear algebra practice missions, file 12 of 14: q56–q60 (game/realms/la/practice-12.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Round away float dust in the 9th decimal place. */
const snap = x => { const t = Math.round(x * 1e9) / 1e9; return t === 0 ? 0 : t; };

/* Exact solution of A x = r by Gauss–Jordan elimination with partial pivoting (any size). */
const solve = (A, r) => {
  const n = A.length, M = A.map((row, i) => row.concat([r[i]]));
  for (let c = 0; c < n; c++) {
    let best = c;
    for (let i = c + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[best][c])) best = i;
    if (Math.abs(M[best][c]) < 1e-12) return A.map(() => NaN);
    [M[c], M[best]] = [M[best], M[c]];
    for (let i = 0; i < n; i++) if (i !== c) { const f = M[i][c] / M[c][c]; for (let j = c; j <= n; j++) M[i][j] -= f * M[c][j]; }
  }
  return M.map((row, i) => row[n] / row[i]);
};
/* One Jacobi step, reached through the exact solution x* and never through the taught update. The error of the
   new point is what the off-diagonal entries make of the old error: new_i − x*_i = −(1/A_ii)·Σ_{j≠i} A_ij·(old_j − x*_j).
   The result is then tested against the meaning of a Jacobi step: row i must hold exactly when unknown i takes its
   new value and every other unknown keeps its old one. NaN if that test fails. */
const jacobi = (A, r, s) => {
  const exact = solve(A, r), err = s.map((old, j) => old - exact[j]);
  const next = exact.map((x, i) => x - A[i].reduce((sum, a, j) => (j === i ? sum : sum + a * err[j]), 0) / A[i][i]).map(snap);
  const holds = next.every((x, i) => Math.abs(A[i].reduce((sum, a, j) => sum + a * (j === i ? x : s[j]), 0) - r[i]) < 1e-6);
  return holds ? next : s.map(() => NaN);
};

/* exp(M) for a small square matrix: Taylor series on M / 2^10, then squared ten times. No eigenvectors used. */
const matMul = (X, Y) => X.map(row => Y[0].map((_, j) => row.reduce((sum, x, k) => sum + x * Y[k][j], 0)));
const matExp = M => {
  const S = M.map(row => row.map(x => x / 1024));
  let E = M.map((row, i) => row.map((_, j) => (i === j ? 1 : 0))), term = E;
  for (let k = 1; k <= 24; k++) { term = matMul(term, S).map(row => row.map(x => x / k)); E = E.map((row, i) => row.map((x, j) => x + term[i][j])); }
  for (let i = 0; i < 10; i++) E = matMul(E, E);
  return E;
};
const apply = (M, v) => M.map(row => row.reduce((sum, x, j) => sum + x * v[j], 0));
/* Snap a float that sits on a whole number (the series leaves dust in the 12th place). */
const tidy = x => (Math.abs(x - Math.round(x)) < 1e-7 ? Math.round(x) : x);

/* A polynomial as a function, and its slope by a symmetric difference (exact for degree 2 or less). */
const poly = c => t => c.reduce((sum, ci, i) => sum + ci * Math.pow(t, i), 0);
const slope = f => t => (f(t + 1) - f(t - 1)) / 2;

/* Dot product by repeated addition. */
const lots = (n, x) => { let s = 0; for (let i = 0; i < Math.abs(n); i++) s += n < 0 ? -x : x; return s; };
const dot = (u, v) => u.reduce((s, x, i) => s + lots(x, v[i]), 0);

/* Coefficients (v1, v2) of the functional l in the basis (b1, b2), without ever evaluating l on b1 or b2 alone.
   Two mixed orders, 2 of the first with 3 of the second and 1 of the first less 1 of the second, are turned into
   plain coordinates and priced there by l. The two prices give two equations v·c = l(x), solved by Cramer's rule. */
const coefficients = (l, b1, b2) => {
  const orders = [[2, 3], [1, -1]];
  const price = orders.map(c => dot(l, [lots(c[0], b1[0]) + lots(c[1], b2[0]), lots(c[0], b1[1]) + lots(c[1], b2[1])]));
  const det = orders[0][0] * orders[1][1] - orders[0][1] * orders[1][0];
  return [(price[0] * orders[1][1] - orders[0][1] * price[1]) / det, (orders[0][0] * price[1] - price[0] * orders[1][0]) / det].map(tidy);
};

/* Roots of A2·λ² + A1·λ + A0 = 0, ascending. */
const quadRoots = (A2, A1, A0) => {
  const disc = A1 * A1 - 4 * A2 * A0;
  if (disc < 0) return [NaN, NaN];
  const s = Math.sqrt(disc);
  return [(-A1 - s) / (2 * A2), (-A1 + s) / (2 * A2)].sort((x, y) => x - y).map(tidy);
};
/* Generalized eigenvalues of a 2×2 pair (K, M diagonal): det(K − λM) written out as a quadratic in λ. */
const genEig = (K, m) => quadRoots(m[0] * m[1], -(K[0][0] * m[1] + K[1][1] * m[0]), K[0][0] * K[1][1] - K[0][1] * K[1][0]);

Object.assign(window.ORACLE, {
  /* Coolant loops: one Jacobi step from the old reading, through the exact solution and its error. */
  q56b: p => jacobi([[p.a, p.b], [p.c, p.d]], [p.e, p.f], [p.x0, p.y0]),
  /* Substations: two such Jacobi steps from (0, 0). */
  q56c: p => { const A = [[p.a, p.b], [p.c, p.d]], r = [p.e, p.f]; return jacobi(A, r, jacobi(A, r, [0, 0])); },
  /* Battery banks: one Jacobi step on the 3×3 system. */
  q56d: p => jacobi(p.A, p.r, p.s),
  /* Algae and dye: x(t) = exp(tA)·x(0) with the matrix exponential computed as a series. */
  q57b: p => apply(matExp([[p.g * Math.log(p.m), 0], [0, -p.k * Math.log(p.m)]]), [p.u, p.v]).map(tidy),
  /* Cooling plates at the second reading: step the first reading forward once more (two equal steps of ln m). */
  q57c: p => { const E = matExp([[-p.j * Math.log(p.m), 0], [0, -p.k * Math.log(p.m)]]); return apply(E, apply(E, [p.u, p.v])).map(tidy); },
  /* Wheel motors: exp(tA)·x(0) straight from A by the series; the stated eigenpairs are only checked. */
  q57d: p => {
    const Av1 = apply(p.A, p.v1), Av2 = apply(p.A, p.v2);
    const ok = Av1.every(x => x === 0) && Av2.every((x, i) => x === -p.k * p.v2[i]);
    if (!ok) return [NaN, NaN];
    const t = Math.log(p.m);
    return apply(matExp(p.A.map(row => row.map(x => x * t))), p.x0).map(tidy);
  },
  /* Drone: h′ sampled by a symmetric difference; constant = h′(0), t coefficient = h′(1) − h′(0), rate = h′(T). */
  q58b: p => { const d = slope(poly(p.c)); return [d(0), d(1) - d(0), d(p.T)]; },
  /* Robot arm: build the blend as a function, then sample its slope. */
  q58c: p => { const P = poly(p.p), Q = poly(p.q), d = slope(t => p.a * P(t) + p.b * Q(t)); return [d(0), d(1) - d(0)]; },
  /* Tracking station: evaluate p at t = −1, 0, 1 in the station's own form and fit constant, t and t² through them. */
  q58d: p => {
    const f = t => p.a + p.b * (t - p.h) + p.c * (t - p.h) * (t - p.h);
    const lo = f(-1), mid = f(0), hi = f(1);
    return [mid, (hi - lo) / 2, (hi + lo) / 2 - mid];
  },
  /* Supply ledger: the crate prices are recovered from two mixed orders priced the long way, in kilograms. */
  q59b: p => coefficients(p.l, p.b1, p.b2),
  /* Striker: month scores recovered the same way, then the season score as ℓ of the whole season x = c1·b1 + c2·b2. */
  q59c: p => {
    const x = [lots(p.c[0], p.b1[0]) + lots(p.c[1], p.b2[0]), lots(p.c[0], p.b1[1]) + lots(p.c[1], p.b2[1])];
    return coefficients(p.w, p.b1, p.b2).concat([dot(p.w, x)]);
  },
  /* Strain sensor: Cramer's rule on the two readings, then checked by substitution. */
  q59d: p => {
    const det = p.b1[0] * p.b2[1] - p.b1[1] * p.b2[0];
    const l1 = (p.r[0] * p.b2[1] - p.b1[1] * p.r[1]) / det, l2 = (p.b1[0] * p.r[1] - p.r[0] * p.b2[0]) / det;
    const ok = Math.abs(l1 * p.b1[0] + l2 * p.b1[1] - p.r[0]) < 1e-9 && Math.abs(l1 * p.b2[0] + l2 * p.b2[1] - p.r[1]) < 1e-9;
    return ok ? [tidy(l1), tidy(l2)] : [NaN, NaN];
  },
  /* Instrument racks: eigenvalues from det(K − λM) = 0 as a quadratic, then their square roots. */
  q60b: p => genEig([[p.k[0], 0], [0, p.k[1]]], p.m).map(x => tidy(Math.sqrt(x))),
  /* Loaded rover: same quadratic with the body mass raised by dm. */
  q60c: p => genEig([[p.k[0], 0], [0, p.k[1]]], [p.m[0] + p.dm, p.m[1]]),
  /* Two pumps on a frame: the full 2×2 determinant with the off-diagonal −c. */
  q60d: p => genEig([[p.a, -p.c], [-p.c, p.a]], [p.m, p.m]),
});
})();
