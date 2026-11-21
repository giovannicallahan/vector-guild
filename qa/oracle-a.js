/* Independent answer oracles for missions q01–q11, q43, q12–q17.
   Each oracle works from the meaning of the prompt with general numerical methods
   (elimination with pivoting, row reduction, Gauss–Jordan, dot products and norms),
   not from the closed forms used in game/gen-a.js. */
(function(){ 'use strict';
const EPS = 1e-9;
const snap = x => { const r = Math.round(x * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; };
const add = (a, b) => a.map((x, i) => x + b[i]);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = a => Math.sqrt(dot(a, a));
const transpose = M => M[0].map((_, j) => M.map(r => r[j]));
const matvec = (M, v) => M.map(r => dot(r, v));
const matmul = (A, B) => A.map(r => transpose(B).map(c => dot(r, c)));
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
const rank = M => rref(M).rank;
/* Determinant by elimination with partial pivoting. */
function det(M) {
  const A = M.map(r => r.slice()), nn = A.length; let d = 1;
  for (let c = 0; c < nn; c++) {
    let best = c;
    for (let i = c + 1; i < nn; i++) if (Math.abs(A[i][c]) > Math.abs(A[best][c])) best = i;
    if (Math.abs(A[best][c]) < EPS) return 0;
    if (best !== c) { [A[c], A[best]] = [A[best], A[c]]; d = -d; }
    d *= A[c][c];
    for (let i = c + 1; i < nn; i++) { const f = A[i][c] / A[c][c]; for (let j = c; j < nn; j++) A[i][j] -= f * A[c][j]; }
  }
  return d;
}
/* Unique solution of the square system A x = b; throws when singular. */
function solve(A, b) {
  const nn = A.length, { R, rank: rk, pivots } = rref(A.map((r, i) => [...r, b[i]]));
  if (rk !== nn || pivots.some((p, i) => p !== i)) throw Error('singular system');
  return R.map(r => snap(r[nn]));
}
/* Inverse by Gauss–Jordan on [A | I]. */
function inverse(A) {
  const nn = A.length, { R, rank: rk, pivots } = rref(A.map((r, i) => [...r, ...r.map((_, j) => i === j ? 1 : 0)]));
  if (rk !== nn || pivots.some((p, i) => p !== i)) throw Error('singular matrix');
  return R.map(r => r.slice(nn).map(snap));
}
/* Cross product from the permutation (Levi-Civita) definition. */
function cross(a, b) {
  const out = [0, 0, 0];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
    const e = (i - j) * (j - k) * (k - i) / 2;
    out[i] += e * a[j] * b[k];
  }
  return out.map(snap);
}
const surd = ([c, r]) => c * Math.sqrt(r);

Object.assign(window.ORACLE, {
  /* resultant of two impulses */
  q01: p => add(p.a, p.b),
  /* length, then x and y of the unit direction */
  q02: p => { const L = norm(p.v); return [snap(L), snap(p.v[0] / L), snap(p.v[1] / L)]; },
  /* work = F·d */
  q03: p => [dot(p.F, p.d)],
  /* torque = r × F */
  q04: p => cross(p.r, p.F),
  /* cos θ and θ in degrees from dot product and norms; components are coefficient·√radicand */
  q05: p => { const u = p.u.map(surd), v = p.v.map(surd), c = dot(u, v) / (norm(u) * norm(v));
    return [snap(c), snap(Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI)]; },
  /* Ax */
  q06: p => matvec(p.A, p.x),
  /* rotate counterclockwise by 90° with the rotation matrix */
  q07: p => { const t = Math.PI / 2, Rm = [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]]; return matvec(Rm, p.v).map(snap); },
  /* "first B, then A" is the product AB, row-major */
  q08: p => matmul(p.A, p.B).flat(),
  /* determinant and absolute area scale */
  q09: p => { const d = snap(det(p.A)); return [d, Math.abs(d)]; },
  /* inverse, row-major */
  q10: p => inverse(p.A).flat(),
  /* a x + b y = r1, c x − b y = r2: rebuild the right-hand sides the prompt prints, then solve */
  q11: p => { const M = [[p.a, p.b], [p.c, -p.b]]; return solve(M, matvec(M, [p.x, p.y])); },
  /* (kA+B)ᵀ, row-major */
  q43: p => transpose(p.A.map((r, i) => r.map((x, j) => p.k * x + p.B[i][j]))).flat(),
  /* triangular system printed in the prompt, solved as a general 3×3 system */
  q12: p => { const M = [p.a, [0, p.b[0], p.b[1]], [0, 0, p.c]]; return solve(M, matvec(M, p.s)); },
  /* rank by row reduction; nullity = columns − rank */
  q13: p => { const M = [p.r1, p.r1.map(x => p.k * x), p.r3], rk = rank(M); return [rk, 3 - rk]; },
  /* null vector with prescribed third component: A v = 0 together with v_z = z */
  q14: p => solve([p.A[0], p.A[1], [0, 0, 1]], [0, 0, p.z]),
  /* coordinates in the basis: [b1 b2] c = t */
  q15: p => solve(transpose([p.b1, p.b2]), p.t),
  /* a·v = 0, x − y = 0, z fixed; dimension of the intersection = 3 − rank of the two constraints */
  q16: p => { const C = [p.a, [1, -1, 0]]; return [...solve([...C, [0, 0, 1]], [0, 0, p.z]), 3 - rank(C)]; },
  /* T is the matrix whose columns are T(e1), T(e2) */
  q17: p => matvec(transpose([p.e1, p.e2]), p.v),
});
})();
