/* Independent answer oracles for missions q18–q28, q31, q44, q45, q48, q51–q53.
   Each oracle works from the meaning of the prompt with general numerical methods
   (least squares through the normal equations and Gaussian elimination, Gram–Schmidt run on
   the given columns, characteristic polynomials, null spaces by row reduction, repeated
   multiplication), not from the closed forms used in game/gen-b.js. */
(function(){ 'use strict';
const EPS = 1e-9;
const snap = x => { const r = Math.round(x * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; };
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = a => Math.sqrt(dot(a, a));
const scale = (a, k) => a.map(x => x * k);
const sub = (a, b) => a.map((x, i) => x - b[i]);
const transpose = M => M[0].map((_, j) => M.map(r => r[j]));
const matvec = (M, v) => M.map(r => dot(r, v));
const matmul = (A, B) => { const Bt = transpose(B); return A.map(r => Bt.map(c => dot(r, c))); };
const rows2 = m => [[m[0], m[1]], [m[2], m[3]]];
const must = (ok, msg) => { if (!ok) throw Error(msg); };

/* Reduced row echelon form with partial pivoting; returns {R, rank, pivots}. */
function rref(M) {
  const R = M.map(r => r.slice()), rows = R.length, cols = R[0].length, pivots = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let best = r;
    for (let i = r + 1; i < rows; i++) if (Math.abs(R[i][c]) > Math.abs(R[best][c])) best = i;
    if (Math.abs(R[best][c]) < EPS) continue;
    [R[r], R[best]] = [R[best], R[r]];
    const pv = R[r][c];
    for (let j = 0; j < cols; j++) R[r][j] /= pv;
    for (let i = 0; i < rows; i++) if (i !== r) { const f = R[i][c]; if (f !== 0) for (let j = 0; j < cols; j++) R[i][j] -= f * R[r][j]; }
    pivots.push(c); r++;
  }
  return { R, rank: r, pivots };
}
/* Unique solution of the square system Mx=b by Gauss–Jordan elimination. */
function solve(M, b) {
  const { R, rank } = rref(M.map((r, i) => [...r, b[i]]));
  must(rank === M.length && Math.abs(R[rank - 1][M.length]) >= 0 && R.every((r, i) => Math.abs(r[i] - 1) < 1e-9), 'singular system');
  return R.map(r => r[M.length]);
}
/* Least squares: solve the normal equations AᵀA x = Aᵀb. */
function lstsq(A, b) { const At = transpose(A); return solve(matmul(At, A), matvec(At, b)); }
/* One basis vector of the null space of a 2×2 matrix of rank one. */
function null2(M) {
  const { R, rank, pivots } = rref(M);
  must(rank === 1, 'null space is not a line');
  return pivots[0] === 0 ? [-R[0][1], 1] : [1, 0];
}
/* Real roots of λ² − tr·λ + det = 0 for a 2×2 matrix, ascending. */
function eig2(M) {
  const tr = M[0][0] + M[1][1], det = M[0][0] * M[1][1] - M[0][1] * M[1][0], disc = tr * tr - 4 * det;
  must(disc > -1e-9, 'complex eigenvalues');
  const s = Math.sqrt(Math.max(0, disc));
  return [(tr - s) / 2, (tr + s) / 2];
}
/* Classical Gram–Schmidt on a list of column vectors: q's and R with rᵢⱼ=qᵢ·aⱼ. */
function gramSchmidt(cols) {
  const Q = [], R = cols.map(() => cols.map(() => 0));
  cols.forEach((a, j) => {
    let v = a.slice();
    Q.forEach((q, i) => { R[i][j] = dot(q, a); v = sub(v, scale(q, R[i][j])); });
    R[j][j] = norm(v);
    must(R[j][j] > EPS, 'dependent columns');
    Q.push(scale(v, 1 / R[j][j]));
  });
  return { Q, R };
}

Object.assign(window.ORACLE, {
  /* Closest point to v on the line {αu}: least squares with the single column u. */
  q18: p => { const A = p.u.map(x => [x]), [alpha] = lstsq(A, p.v); return scale(p.u, alpha).map(snap); },
  /* q₂ from Gram–Schmidt on a₁,a₂ (residual normalised, no sign change). */
  q19: p => gramSchmidt([p.a1, p.a2]).Q[1].map(snap),
  /* Constant fit: design column of ones; then the sum of squared residuals. */
  q20: p => { const [c] = lstsq(p.ys.map(() => [1]), p.ys); return [snap(c), snap(p.ys.reduce((s, y) => s + (y - c) * (y - c), 0))]; },
  /* Line fit at t=0,1,2: design rows (1,t). */
  q21: p => lstsq(p.ys.map((_, t) => [1, t]), p.ys).map(snap),
  /* Thin QR with positive diagonal: Gram–Schmidt gives positive r₁₁,r₂₂ by construction. */
  q22: p => { const cols = [p.a1, p.a2], { Q, R } = gramSchmidt(cols);
    const back = cols.map((a, j) => a.map((_, k) => Q.reduce((s, q, i) => s + q[k] * R[i][j], 0)));
    must(back.every((a, j) => a.every((x, k) => Math.abs(x - cols[j][k]) < 1e-9)) && R[0][0] > 0 && R[1][1] > 0, 'QR check');
    return [R[0][0], R[0][1], R[1][1]].map(snap); },
  q23: p => eig2(rows2(p.m)).map(snap),
  /* Solve (A−λI)v=0, then scale so that y=1. */
  q24: p => { const M = rows2(p.m); M[0][0] -= p.lam; M[1][1] -= p.lam; const v = null2(M);
    must(Math.abs(v[1]) > EPS, 'no eigenvector with y=1'); return [snap(v[0] / v[1]), 1]; },
  q25: p => { let x = p.x0.slice(); const A = rows2(p.m); for (let i = 0; i < 3; i++) x = matvec(A, x); return x.map(snap); },
  /* Eigenvalues from the characteristic polynomial; q's eigenvalue is its Rayleigh quotient. */
  q26: p => { const A = rows2(p.m), q = scale(p.u, 1 / norm(p.u)), Aq = matvec(A, q), lam = dot(q, Aq);
    must(norm(sub(Aq, scale(q, lam))) < 1e-9, 'q is not an eigenvector');
    const roots = eig2(A), k = Math.abs(roots[0] - lam) < Math.abs(roots[1] - lam) ? 0 : 1;
    must(Math.abs(roots[k] - lam) < 1e-9, 'eigenvalue not a root');
    return [snap(roots[k]), snap(roots[1 - k])]; },
  /* Square roots of the eigenvalues of AᵀA, descending. */
  q27: p => { const G = matmul(transpose(p.A), p.A), e = eig2(G); return [Math.sqrt(e[1]), Math.sqrt(Math.max(0, e[0]))].map(snap); },
  /* PCA: eigen-decomposition of the covariance; unit leading eigenvector with its nonzero coordinate positive. */
  q28: p => { const C = [[p.sx, 0], [0, p.sy]], e = eig2(C), top = e[1];
    must(top - e[0] > EPS, 'leading direction not unique');
    let v = null2([[C[0][0] - top, C[0][1]], [C[1][0], C[1][1] - top]]); v = scale(v, 1 / norm(v));
    const lead = Math.abs(v[0]) > EPS ? v[0] : v[1]; if (lead < 0) v = scale(v, -1);
    return [snap(top / (C[0][0] + C[1][1])), snap(v[0]), snap(v[1])]; },
  /* xᵀKx as the double sum Σᵢ Σⱼ xᵢ Kᵢⱼ xⱼ; energy is half of it. */
  q31: p => { const K = rows2(p.K); let s = 0; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) s += p.x[i] * K[i][j] * p.x[j]; return [snap(s), snap(s / 2)]; },
  q44: p => { const { R, rank } = rref(p.A.map((r, i) => [...r, p.b[i]])); must(rank === 3 && R.every((r, i) => Math.abs(r[i] - 1) < 1e-9), 'no unique solution'); return R.map(r => snap(r[3])); },
  /* Swap the rows, then eliminate below the pivot; L holds the multiplier (unit diagonal). */
  q45: p => { const PA = [[p.m[2], p.m[3]], [p.m[0], p.m[1]]]; must(Math.abs(PA[0][0]) > EPS, 'zero pivot after swap');
    const l = PA[1][0] / PA[0][0], U = [PA[0].slice(), [PA[1][0] - l * PA[0][0], PA[1][1] - l * PA[0][1]]];
    must(Math.abs(U[1][0]) < 1e-9, 'not upper triangular');
    const LU = matmul([[1, 0], [l, 1]], U); must(LU.every((r, i) => r.every((x, j) => Math.abs(x - PA[i][j]) < 1e-9)), 'LU≠PA');
    return [l, U[0][0], U[0][1], U[1][1]].map(snap); },
  /* Rotation by 90° counterclockwise then translation, as translation·rotation in homogeneous form. */
  q48: p => { const th = Math.PI / 2, c = Math.cos(th), s = Math.sin(th);
    const Rm = [[c, -s, 0], [s, c, 0], [0, 0, 1]], T = [[1, 0, p.t[0]], [0, 1, p.t[1]], [0, 0, 1]];
    return matvec(matmul(T, Rm), [p.p[0], p.p[1], 1]).map(snap); },
  /* Solve [u v](a,b)ᵀ=w; dimension of the span is the rank of the matrix with columns u,v,w. */
  q51: p => { const ab = solve(transpose([p.u, p.v]), p.w); return [snap(ab[0]), snap(ab[1]), rref(transpose([p.u, p.v, p.w])).rank]; },
  /* Row-reduce the augmented system; x is the pivot variable, y=t is free. */
  q52: p => { const aug = [[p.p, p.q, p.r], [p.m * p.p, p.m * p.q, p.m * p.r]], { R, rank, pivots } = rref(aug);
    must(rank === 1 && pivots[0] === 0, 'expected one pivot in x');
    return [snap(R[0][2]), snap(-R[0][1]), 2 - rank]; },
  /* Left inverse (AᵀA)⁻¹Aᵀ of the 2×1 matrix A=(p,q)ᵀ. */
  q53: p => { const A = [[p.p], [p.q]], At = transpose(A), G = matmul(At, A), inv = solve(G, [1]);
    const L = At[0].map(x => inv[0] * x); must(Math.abs(dot(L, [p.p, p.q]) - 1) < 1e-9, 'LA≠1'); return L.map(snap); },
});
})();
