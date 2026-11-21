/* Independent answer oracles for q49 q50 q55-q68. Each oracle derives the answer from the meaning
   of the prompt with general numerical methods; nothing here is taken from the generators' build(). */
(function(){ 'use strict';
const T = A => A[0].map((_, j) => A.map(r => r[j]));
const mm = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mv = (A, x) => A.map(r => r.reduce((s, v, k) => s + v * x[k], 0));
const diag = d => d.map((v, i) => d.map((_, j) => i === j ? v : 0));
const eye = n => diag(Array(n).fill(1));
const add = (A, B, s = 1) => A.map((r, i) => r.map((v, j) => v + s * B[i][j]));
const scale = (A, s) => A.map(r => r.map(v => v * s));
/* Gaussian elimination with partial pivoting; NaN if singular. */
function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return Array(n).fill(NaN);
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let k = i + 1; k < n; k++) s -= M[i][k] * x[k]; x[i] = s / M[i][i]; }
  return x;
}
/* Real eigenvalues of a 2x2 matrix from its characteristic polynomial, ascending. */
function eig2(A) {
  const tr = A[0][0] + A[1][1], det = A[0][0] * A[1][1] - A[0][1] * A[1][0], disc = tr * tr - 4 * det;
  if (disc < -1e-12) return [NaN, NaN];
  const s = Math.sqrt(Math.max(0, disc));
  return [(tr - s) / 2, (tr + s) / 2];
}
/* Symmetric eigen-decomposition by cyclic Jacobi rotations: {values, vectors (columns)}. */
function symEig(S) {
  const n = S.length; let A = S.map(r => [...r]), V = eye(n);
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-22) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = 0.5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]), c = Math.cos(th), s = Math.sin(th);
      const R = eye(n); R[p][p] = c; R[q][q] = c; R[p][q] = s; R[q][p] = -s;
      A = mm(mm(T(R), A), R); V = mm(V, R);
    }
  }
  return { values: A.map((r, i) => r[i]), vectors: V };
}
const maxSingular = E => Math.sqrt(Math.max(...symEig(mm(T(E), E)).values));

Object.assign(window.ORACLE, {
  /* Best rank-1 approximation by SVD (via eigen-decomposition of AᵀA), then both error norms from the residual. */
  q49: p => {
    const A = diag(p.d), e = symEig(mm(T(A), A));
    let k = 0; e.values.forEach((v, i) => { if (v > e.values[k]) k = i; });
    const sigma = Math.sqrt(e.values[k]), v = e.vectors.map(r => r[k]), u = mv(A, v).map(t => t / sigma);
    const A1 = u.map(ui => v.map(vj => sigma * ui * vj)), E = add(A, A1, -1);
    const frob2 = E.flat().reduce((s, t) => s + t * t, 0);
    return [A1[0][0], A1[1][1], A1[2][2], frob2, maxSingular(E)];
  },
  /* Least squares for a constant, minimum-norm allocation, stationary vector, second eigenvalue, PCA fraction. */
  q50: p => {
    const ones = p.r.map(() => [1]);
    const load = solve(mm(T(ones), ones), mv(T(ones), p.r))[0];
    const C = [[1, 1]], w = solve(mm(C, T(C)), [load]), u = mv(T(C), w);
    const q = p.q / 100, P = [[1 - q, q], [q, 1 - q]];
    /* stationary row vector: pi(P - I) = 0 with pi1 + pi2 = 1 */
    const pi = solve([[P[0][0] - 1, P[1][0]], [1, 1]], [0, 1]);
    const ev = eig2(P), other = Math.abs(ev[0] - 1) > Math.abs(ev[1] - 1) ? ev[0] : ev[1];
    const cov = diag(p.cov), ce = eig2(cov);
    return [load, u[0], u[1], pi[0], other, ce[1] / (ce[0] + ce[1])];
  },
  /* Four-point DFT of (a, b, c, b) by summing complex exponentials; NaN if an imaginary part survives. */
  q55: p => {
    const x = [p.a, p.b, p.c, p.b], N = 4;
    return [0, 1, 2, 3].map(k => {
      let re = 0, im = 0;
      x.forEach((v, n) => { const t = -2 * Math.PI * k * n / N; re += v * Math.cos(t); im += v * Math.sin(t); });
      return Math.abs(im) > 1e-9 ? NaN : re;
    });
  },
  /* One Jacobi sweep from zero: x_new = D^-1 (rhs - (A - D) x_old). */
  q56: p => {
    const A = [[p.a, p.b], [p.c, p.d]], rhs = [p.e, p.f], old = [0, 0];
    return A.map((r, i) => (rhs[i] - r.reduce((s, v, j) => s + (j === i ? 0 : v * old[j]), 0)) / r[i]);
  },
  /* x(t) = exp(tA) x(0) for A = diag(0, -k), t = ln(m): exponentiate each diagonal entry. */
  q57: p => { const t = Math.log(p.m); return [Math.exp(0 * t) * p.u, Math.exp(-p.k * t) * p.v]; },
  /* Derivative of c0 + c1 t + c2 t^2 by a central difference (exact for quadratics), read off in basis (1, t). */
  q58: p => {
    const f = t => p.c[0] + p.c[1] * t + p.c[2] * t * t, d = t => (f(t + 0.5) - f(t - 0.5));
    return [d(0), d(1) - d(0)];
  },
  /* Row vector of the functional times the basis matrix. */
  q59: p => { const B = T([p.b1, p.b2]); return mm([p.l], B)[0]; },
  /* Kv = lambda Mv: eigenvalues of M^-1 K, ascending. */
  q60: p => {
    const K = diag(p.lam.map((l, i) => l * p.m[i])), M = diag(p.m);
    const MinvK = T(T(K).map(col => solve(M, col)));
    return eig2(MinvK);
  },
  /* Schur complement of a, then the full system by Gaussian elimination. */
  q61: p => {
    const f = p.a * p.x + p.b * p.y, g = p.c * p.x + p.d * p.y;
    const sol = solve([[p.a, p.b], [p.c, p.d]], [f, g]);
    return [p.d - p.c * (1 / p.a) * p.b, sol[1], sol[0]];
  },
  /* Permutation matrix swapping coordinates 1 and j+1. */
  q62: p => {
    const P = eye(3); P[0][0] = 0; P[p.j][p.j] = 0; P[0][p.j] = 1; P[p.j][0] = 1;
    const y = mv(P, p.x);
    return [...y, y.reduce((s, v) => s + v * v, 0)];
  },
  /* Tridiagonal (-1, 2, -1) matrix times x, and a count of stored nonzeros. */
  q63: p => {
    const A = [0, 1, 2, 3].map(i => [0, 1, 2, 3].map(j => i === j ? 2 : Math.abs(i - j) === 1 ? -1 : 0));
    return [...mv(A, p.x), A.flat().filter(v => v !== 0).length];
  },
  /* Ridge: (AᵀA + lambda I) x = Aᵀb. */
  q64: p => { const A = diag(p.a); return solve(add(mm(T(A), A), eye(2), p.lam), mv(T(A), p.b)); },
  /* Forward differences on the grid x0, x0 + h/100, x0 + 2h/100. */
  q65: p => {
    const pos = [0, 1, 2].map(i => p.x0 + i * p.h / 100);
    return [0, 1].map(i => (p.f[i + 1] - p.f[i]) / (pos[i + 1] - pos[i]));
  },
  /* LP: intersect every pair of constraint lines, keep feasible vertices, take the best. NaN on a tie. */
  q66: p => {
    const cons = [[1, 1, p.S], [1, 0, p.U], [-1, 0, 0], [0, -1, 0]]; /* a x + b y <= c */
    const pts = [];
    for (let i = 0; i < cons.length; i++) for (let j = i + 1; j < cons.length; j++) {
      const v = solve([[cons[i][0], cons[i][1]], [cons[j][0], cons[j][1]]], [cons[i][2], cons[j][2]]);
      if (v.every(Number.isFinite) && cons.every(c => c[0] * v[0] + c[1] * v[1] <= c[2] + 1e-9)) pts.push(v);
    }
    const val = v => p.c1 * v[0] + p.c2 * v[1];
    pts.sort((u, v) => val(v) - val(u));
    const best = pts[0], tie = pts.some(v => Math.abs(val(v) - val(best)) < 1e-9 && (Math.abs(v[0] - best[0]) + Math.abs(v[1] - best[1])) > 1e-9);
    return tie ? [NaN, NaN, val(best)] : [best[0], best[1], val(best)];
  },
  /* Full convolution by the double sum. */
  q67: p => {
    const y = Array(p.x.length + p.h.length - 1).fill(0);
    p.x.forEach((xv, i) => p.h.forEach((hv, j) => { y[i + j] += xv * hv; }));
    return y;
  },
  /* One gradient step from zero for f = ½xᵀHx − bᵀx, and the largest eigenvalue of I − alpha H. */
  q68: p => {
    const H = diag(p.h), al = p.al / 1000, x0 = [0, 0], grad = mv(H, x0).map((v, i) => v - p.b[i]);
    const x1 = x0.map((v, i) => v - al * grad[i]);
    return [x1[0], x1[1], eig2(add(eye(2), H, -al))[1]];
  },
});
})();
