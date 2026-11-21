/* Independent oracles for linear algebra practice missions, file 7 of 14: q31–q35 (game/realms/la/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Symmetric 2×2 table from its three numbers. */
const sym2 = (a, b, d) => [[a, b], [b, d]];
/* xᵀMy from the definition: every entry of M times its row partner in x and column partner in y. `pick` chooses
   which entries count (all of them by default). */
const form = (x, M, y, pick) => {
  let s = 0;
  for (let i = 0; i < M.length; i++) for (let j = 0; j < M[i].length; j++) if (!pick || pick(i, j)) s += x[i] * M[i][j] * y[j];
  return s;
};
/* Determinant of a 2×2 table as the signed area of the parallelogram on its columns (shoelace form). */
const det2 = M => { const [u, v] = [[M[0][0], M[1][0]], [M[0][1], M[1][1]]]; return u[0] * v[1] - v[0] * u[1]; };
/* Positive definite, tested without the determinant: the smaller eigenvalue of the symmetric table is above zero. */
const smallestEigen = M => { const mid = (M[0][0] + M[1][1]) / 2, half = (M[0][0] - M[1][1]) / 2; return mid - Math.sqrt(half * half + M[0][1] * M[1][0]); };
const isPD = M => smallestEigen(M) > 1e-9 ? 1 : 0;
/* Cholesky factor by search: the whole lower triangular L with positive diagonal whose L·Lᵀ rebuilds the table. */
const choleskySearch = M => {
  for (let l11 = 1; l11 <= 12; l11++) for (let l21 = -12; l21 <= 12; l21++) for (let l22 = 1; l22 <= 12; l22++)
    if (l11 * l11 === M[0][0] && l11 * l21 === M[0][1] && l11 * l21 === M[1][0] && l21 * l21 + l22 * l22 === M[1][1]) return [l11, l21, l22];
  return [NaN, NaN, NaN];
};
/* Complex numbers as [real, imaginary]. */
const cadd = (x, y) => [x[0] + y[0], x[1] + y[1]];
const cmul = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]];
const conj = x => [x[0], -x[1]];
const csub = (x, y) => [x[0] - y[0], x[1] - y[1]];
/* Complex inner product u* v: conjugate each entry of u, multiply by the partner in v, add. */
const inner = (u, v) => u.reduce((s, x, i) => cadd(s, cmul(conj(x), v[i])), [0, 0]);
/* Whole eigenvalues of a 2×2 complex table by search: every whole λ that makes det(H − λI) vanish, ascending. */
const wholeEigen = H => {
  const out = [];
  for (let lam = -60; lam <= 60; lam++) {
    const det = csub(cmul(csub(H[0][0], [lam, 0]), csub(H[1][1], [lam, 0])), cmul(H[0][1], H[1][0]));
    if (det[0] === 0 && det[1] === 0) out.push(lam);
  }
  return out.length === 2 ? out : [NaN, NaN];
};
/* Whole square root by search; NaN when there is none. */
const wholeRoot = q => { for (let L = 0; L * L <= q; L++) if (L * L === q) return L; return NaN; };

Object.assign(window.ORACLE, {
  /* Savings: the whole double sum, then only the two off-diagonal terms of the same sum. */
  q31b: p => { const C = sym2(p.a, p.b, p.d); return [form(p.w, C, p.w), form(p.w, C, p.w, (i, j) => i !== j)]; },
  /* Tethers: half the double sum for each pull, then larger minus smaller. */
  q31c: p => {
    const K = sym2(p.a, p.b, p.d), eA = form(p.p, K, p.p) / 2, eB = form(p.q, K, p.q) / 2;
    return [eA, eB, Math.max(eA, eB) - Math.min(eA, eB)];
  },
  /* Satellite: the nine-term double sum over the inertia table as given, and half of it. */
  q31d: p => { const s = form(p.w, p.J, p.w); return [s, s / 2]; },
  /* Dip: split the xy number in two, area determinant, bowl test by the smaller eigenvalue. The split table is
     checked to rebuild the height formula at a few points. */
  q32b: p => {
    const A = sym2(p.a, p.c / 2, p.d);
    const ok = [[1, 1], [2, -1], [-3, 2]].every(([x, y]) => form([x, y], A, [x, y]) === p.a * x * x + p.c * x * y + p.d * y * y);
    return ok ? [A[0][1], det2(A), isPD(A)] : [NaN, NaN, NaN];
  },
  /* Generators: determinant and eigenvalue test for the trial link, then try every whole link strength from 1 up
     and keep the largest one that leaves the grid stable. */
  q32c: p => {
    const S = c => sym2(p.a, c, p.d);
    let best = NaN;
    for (let c = 1; c <= 100; c++) if (isPD(S(c))) best = c;
    return [det2(S(p.c)), isPD(S(p.c)), best];
  },
  /* Camera mount: area determinant, double sum for the nudge, eigenvalue test. */
  q32d: p => { const K = sym2(p.a, p.b, p.d); return [det2(K), form(p.x, K, p.x), isPD(K)]; },
  /* Rover: search for the whole factor that rebuilds P. */
  q33b: p => choleskySearch(sym2(p.a, p.b, p.d)),
  /* Flight simulator: factor by search, then g = Lz row by row. */
  q33c: p => {
    const [l11, l21, l22] = choleskySearch(sym2(p.a, p.b, p.d)), L = [[l11, 0], [l21, l22]];
    return [l11, l21, l22, ...L.map(row => row[0] * p.z[0] + row[1] * p.z[1])];
  },
  /* Steel frame: solve Ax = f directly by Cramer's rule, then y = Lᵀx; checked by substitution into Ly = f. */
  q33d: p => {
    const A = sym2(p.a, p.b, p.d), D = det2(A);
    const x = [det2([[p.f[0], A[0][1]], [p.f[1], A[1][1]]]) / D, det2([[A[0][0], p.f[0]], [A[1][0], p.f[1]]]) / D];
    const [l11, l21, l22] = choleskySearch(A);
    const y = [l11 * x[0] + l21 * x[1], l22 * x[1]];
    const ok = Math.abs(l11 * y[0] - p.f[0]) < 1e-9 && Math.abs(l21 * y[0] + l22 * y[1] - p.f[1]) < 1e-9;
    return ok ? [y[0], y[1], x[0], x[1]] : [NaN, NaN, NaN, NaN];
  },
  /* Router: each power is the reading times its own conjugate; the total is the inner product of z with itself. */
  q34b: p => {
    const z = [[p.a, p.b], [p.c, p.d]];
    return [cmul(conj(z[0]), z[0])[0], cmul(conj(z[1]), z[1])[0], inner(z, z)[0]];
  },
  /* Sonar: complex inner product by complex arithmetic. */
  q34c: p => inner(p.u, p.v),
  /* Generator: inner product of z with itself (its imaginary part must vanish), then the whole root by search. */
  q34d: p => { const s = inner(p.z, p.z); return s[1] === 0 ? [s[0], wholeRoot(s[0])] : [NaN, NaN]; },
  /* Coupler: multiply the two off-diagonal entries as complex numbers; eigenvalues by whole-number search. */
  q35b: p => {
    const H = [[[p.a, 0], [0, p.b]], [[0, -p.b], [p.a, 0]]], prod = cmul(H[0][1], H[1][0]);
    return prod[1] === 0 ? [prod[0], ...wholeEigen(H)] : [NaN, NaN, NaN];
  },
  /* Damaged log: the missing entry mirrors the top-right one with its imaginary part flipped; eigenvalues by search. */
  q35c: p => {
    const low = conj([p.p, p.q]), H = [[[p.a, 0], [p.p, p.q]], [low, [p.d, 0]]];
    return [low[0], low[1], ...wholeEigen(H)];
  },
  /* Lasers: multiply H into v with complex arithmetic; the eigenvalue is the stretch (Hv)₁ ÷ v₁, checked on the
     second entry; the other eigenvalue is the remaining whole root of det(H − λI) = 0. */
  q35d: p => {
    const H = [[[p.a, 0], [0, p.c]], [[0, -p.c], [p.a, 0]]], v = [[1, 0], [0, p.s]];
    const Hv = H.map(row => cadd(cmul(row[0], v[0]), cmul(row[1], v[1])));
    const lam = Hv[0][0];
    const ok = Hv[0][1] === 0 && Hv[1][0] === 0 && Hv[1][1] === lam * p.s;
    const other = wholeEigen(H).filter(x => x !== lam);
    return ok && other.length === 1 ? [Hv[0][0], Hv[1][1], lam, other[0]] : [NaN, NaN, NaN, NaN];
  },
});
})();
