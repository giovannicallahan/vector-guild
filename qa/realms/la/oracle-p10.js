/* Independent oracles for linear algebra practice missions, file 10 of 14: q46–q50 (game/realms/la/practice-10.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

const tidy = x => { const r = Math.round(x * 1e9) / 1e9; return r === 0 ? 0 : r; };
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const col = (M, j) => M.map(row => row[j]);
const apply = (M, v) => M.map(row => dot(row, v));
const times = (A, B) => A.map(row => B[0].map((_, j) => dot(row, col(B, j))));
const transpose = M => M[0].map((_, j) => col(M, j));
/* Solve the 2×2 system M z = r by Cramer's rule (no inverse matrix is ever formed). */
const cramer2 = (M, r) => {
  const D = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  return [tidy((r[0] * M[1][1] - M[0][1] * r[1]) / D), tidy((M[0][0] * r[1] - r[0] * M[1][0]) / D)];
};
/* Whole-number solution of M z = r by plain search; NaN when there is none in range. */
const search2 = (M, r, lim) => {
  for (let z1 = -lim; z1 <= lim; z1++) for (let z2 = -lim; z2 <= lim; z2++)
    if (M[0][0] * z1 + M[0][1] * z2 === r[0] && M[1][0] * z1 + M[1][1] * z2 === r[1]) return [z1, z2];
  return [NaN, NaN];
};
/* Rank by row reduction with pivoting. */
const rank = M0 => {
  const M = M0.map(row => row.slice()); let r = 0;
  for (let c = 0; c < M[0].length && r < M.length; c++) {
    let best = r;
    for (let i = r + 1; i < M.length; i++) if (Math.abs(M[i][c]) > Math.abs(M[best][c])) best = i;
    if (Math.abs(M[best][c]) < 1e-9) continue;
    [M[r], M[best]] = [M[best], M[r]];
    for (let i = r + 1; i < M.length; i++) { const f = M[i][c] / M[r][c]; for (let j = c; j < M[0].length; j++) M[i][j] -= f * M[r][j]; }
    r++;
  }
  return r;
};
/* 3×3 determinant by cofactors along the first row, and the inverse as adjugate / determinant. */
const minor = (M, i, j) => { const m = M.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j)); return m[0][0] * m[1][1] - m[0][1] * m[1][0]; };
const det3 = M => M[0].reduce((s, x, j) => s + (j % 2 ? -1 : 1) * x * minor(M, 0, j), 0);
const inverse3 = M => { const D = det3(M); return M.map((_, i) => M.map((__, j) => tidy(((i + j) % 2 ? -1 : 1) * minor(M, j, i) / D))); };
const ROT = [[[0, -1], [1, 0]], [[0, 1], [-1, 0]], [[-1, 0], [0, -1]]];
const homog = (L, t) => [[L[0][0], L[0][1], t[0]], [L[1][0], L[1][1], t[1]], [0, 0, 1]];
const sq = x => x * x;
/* Minimum-norm command by search: three commands u with g·u = load and the smallest u·u. u1 and u2 run over a
   half-step grid, u3 is whatever the constraint leaves. No "u is a multiple of g" rule is assumed. NaN when the
   smallest norm is reached by more than one grid point. */
const minNorm = (g, load) => {
  const span = 2 * Math.ceil(Math.abs(load)); let best = null, ties = 0;
  for (let i = -span; i <= span; i++) for (let j = -span; j <= span; j++) {
    const u1 = i / 2, u2 = j / 2, u3 = (load - g[0] * u1 - g[1] * u2) / g[2], size = u1 * u1 + u2 * u2 + u3 * u3;
    if (!best || size < best.size - 1e-9) { best = { size, u: [u1, u2, u3] }; ties = 1; }
    else if (Math.abs(size - best.size) <= 1e-9) ties++;
  }
  return ties === 1 ? best.u.map(tidy) : [NaN, NaN, NaN];
};

Object.assign(window.ORACLE, {
  /* A is fixed by what it does to the guides: A b1 = d1 b1 and A b2 = d2 b2. Search each row of A for whole numbers
     meeting both conditions; P⁻¹ is never formed. */
  q46b: p => {
    const Pt = transpose(p.P), out = [];
    for (let i = 0; i < 2; i++) out.push(...search2(Pt, [p.d[0] * p.P[i][0], p.d[1] * p.P[i][1]], 80));
    return out;
  },
  /* Coordinates by search (P c = x). Each B entry is the stretch factor of A on a basis vector, checked to be a pure
     stretch. Next coordinates by search again: P n = A x. */
  q46c: p => {
    const c = search2(p.P, p.x, 30);
    const factor = j => {
      const b = col(p.P, j), Ab = apply(p.A, b);
      for (let k = -60; k <= 60; k++) if (Ab[0] === k * b[0] && Ab[1] === k * b[1]) return k;
      return NaN;
    };
    const next = search2(p.P, apply(p.A, p.x), 200);
    return [c[0], c[1], factor(0), factor(1), next[0], next[1]];
  },
  /* Column j of B holds the joint-frame coordinates of A b_j: solve P z = A b_j by Cramer's rule. The product P B is
     checked against A P. The determinant is taken from B itself. */
  q46d: p => {
    const z1 = cramer2(p.P, apply(p.A, col(p.P, 0))), z2 = cramer2(p.P, apply(p.A, col(p.P, 1)));
    const B = [[z1[0], z2[0]], [z1[1], z2[1]]];
    const L = times(p.P, B), R = times(p.A, p.P);
    if (L.some((row, i) => row.some((x, j) => Math.abs(x - R[i][j]) > 1e-9))) return [NaN];
    return [B[0][0], B[0][1], B[1][0], B[1][1], tidy(B[0][0] * B[1][1] - B[0][1] * B[1][0])];
  },
  /* Build the table, row-reduce it and its transpose for the ranks, and test y against every column, not just the first. */
  q47b: p => {
    const A = p.u.map(x => [x].concat(p.k.map(m => m * x)));
    const r = rank(A), rt = rank(transpose(A));
    const inLeftNull = transpose(A).every(c => dot(c, p.y) === 0);
    return [r, rt, A[0].length - r, A.length - rt, dot(p.y, col(A, 0)), inLeftNull ? 1 : 0];
  },
  /* Build the 4×3 matrix from its stated rows, row-reduce for the rank, and search for the silent input (x1, x2, 1)
     that zeroes all four meters. */
  q47c: p => {
    const A = [[1, 0, p.a], [0, 1, p.b], [1, 1, p.a + p.b], [p.c, p.d, p.c * p.a + p.d * p.b]];
    const r = rank(A); let found = [NaN, NaN];
    for (let x1 = -20; x1 <= 20; x1++) for (let x2 = -20; x2 <= 20; x2++) if (A.every(row => dot(row, [x1, x2, 1]) === 0)) found = [x1, x2];
    return [r, 3 - r, 4 - r, found[0], found[1]];
  },
  /* Search for the multiple of a whose remainder is at right angles to a; no projection formula is used. */
  q47d: p => {
    for (let k = -60; k <= 60; k++) {
      const row = [k * p.a[0], k * p.a[1]], rest = [p.x[0] - row[0], p.x[1] - row[1]];
      if (dot(rest, p.a) === 0) return [2 - rank([p.a]), row[0], row[1], rest[0], rest[1]];
    }
    return [NaN];
  },
  /* Build the 3×3 homogeneous matrix and multiply it by the full 3-entry point and direction. */
  q48b: p => {
    const M = homog([[p.s[0], 0], [0, p.s[1]]], p.t);
    const corner = apply(M, [p.pt[0], p.pt[1], 1]), edge = apply(M, [p.v[0], p.v[1], 0]);
    return [corner[0], corner[1], edge[0], edge[1]];
  },
  /* Build R and T as 3×3 matrices, multiply them in the order M = R T, then read the last column and apply M. */
  q48c: p => {
    const M = times(homog(ROT[p.rot], [0, 0]), homog([[1, 0], [0, 1]], p.t));
    const out = apply(M, [p.pt[0], p.pt[1], 1]);
    return [M[0][2], M[1][2], out[0], out[1]].map(tidy);
  },
  /* Invert the full 3×3 matrix by cofactors, then apply the inverse to the chart point; checked by sending the
     answer forward through M again. */
  q48d: p => {
    const M = homog(ROT[0], p.t), inv = inverse3(M);
    const radar = apply(inv, [p.q[0], p.q[1], 1]).map(tidy), back = apply(M, radar);
    if (back[0] !== p.q[0] || back[1] !== p.q[1] || back[2] !== 1) return [NaN];
    return [radar[0], radar[1], inv[0][2], inv[1][2]];
  },
  /* Try every pair of patterns to drop and keep the choice with the least squared error; no sorting of the list. */
  q49b: p => {
    let best = null;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const err = sq(p.s[i]) + sq(p.s[j]);
      if (!best || err < best.err) best = { err, drop: [i, j] };
    }
    const kept = p.s.filter((_, i) => !best.drop.includes(i));
    return [Math.max(...kept), Math.min(...kept), best.err, Math.max(p.s[best.drop[0]], p.s[best.drop[1]])];
  },
  /* Step the rank up from 1, adding up the squares of the dropped values each time, until the error fits the limit. */
  q49c: p => {
    for (let k = 1; k <= 4; k++) {
      const dropped = p.s.filter(x => p.s.filter(y => y > x).length >= k);
      const err = dropped.reduce((s, x) => s + x * x, 0);
      if (err <= p.E) return [k, err, dropped.length ? Math.max(...dropped) : 0];
    }
    return [NaN];
  },
  /* Eigenvalues from the trace and determinant (quadratic formula); the unit eigenvector from (A − λ₂I); A₁ built
     entry by entry; the Frobenius error summed over the four entries of A − A₁. */
  q49d: p => {
    const A = [[p.a, p.b], [p.b, p.a]], tr = 2 * p.a, dt = p.a * p.a - p.b * p.b;
    const root = Math.sqrt(tr * tr - 4 * dt), big = tidy((tr + root) / 2), small = tidy((tr - root) / 2);
    const v = [A[0][0] - small, A[1][0]], len = Math.hypot(v[0], v[1]), q = [v[0] / len, v[1] / len];
    const A1 = [[big * q[0] * q[0], big * q[0] * q[1]], [big * q[1] * q[0], big * q[1] * q[1]]];
    let err = 0;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) err += sq(A[i][j] - A1[i][j]);
    return [big, small, tidy(A1[0][0]), tidy(A1[0][1]), tidy(err), small];
  },
  /* Demand: the value where the slope of the sum of squared misses is zero, found by bisection. Pumps: a search
     over all splits with that total for the one of smallest norm; the three pumps must then come out equal.
     Eigenvalue: what P does to (1, −1). Variance lost: the weaker axis over the total. */
  q50b: p => {
    let lo = Math.min(...p.r), hi = Math.max(...p.r);
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (p.r.reduce((s, x) => s + (mid - x), 0) < 0) lo = mid; else hi = mid; }
    const demand = tidy((lo + hi) / 2), pumps = minNorm([1, 1, 1], demand);
    if (pumps[0] !== pumps[1] || pumps[1] !== pumps[2]) return [NaN, NaN, NaN, NaN];
    const e = p.q / 100, image = apply([[1 - e, e], [e, 1 - e]], [1, -1]);
    const strong = Math.max(p.cov[0], p.cov[1]), total = p.cov[0] + p.cov[1];
    return [demand, pumps[0], tidy(image[0]), tidy((total - strong) / total)];
  },
  /* Fleet: the mean. Long run: move the bikes day after day with P until nothing changes. Eigenvalue: what P does
     to a vector whose entries sum to zero. */
  q50c: p => {
    const N = p.counts.reduce((s, x) => s + x, 0) / p.counts.length;
    const P = [[1 - p.a / 10, p.b / 10], [p.a / 10, 1 - p.b / 10]];
    let at = [N, 0];
    for (let day = 0; day < 3000; day++) at = apply(P, at);
    return [tidy(N), tidy(at[0]), tidy(at[1]), tidy(apply(P, [1, -1])[0])];
  },
  /* Fused load: bisection on the slope of the weighted sum of squared misses. Thrusters: a search over all commands
     with g·u = load for the one of smallest norm. Retained: add the two largest variances directly. */
  q50d: p => {
    let lo = Math.min(...p.y), hi = Math.max(...p.y);
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (p.w[0] * (mid - p.y[0]) + p.w[1] * (mid - p.y[1]) < 0) lo = mid; else hi = mid; }
    const load = tidy((lo + hi) / 2), u = minNorm(p.g, load);
    const ranked = p.cov.slice().sort((x, y) => y - x);
    return [load, u[0], u[1], u[2], tidy((ranked[0] + ranked[1]) / (ranked[0] + ranked[1] + ranked[2]))];
  }
});
})();
