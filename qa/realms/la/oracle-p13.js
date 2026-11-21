/* Independent oracles for linear algebra practice missions, file 13 of 14: q61–q65 (game/realms/la/practice-13.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

/* Tidy away floating-point dust (answers have at most two decimals). */
const tidy = x => Math.round(x * 1e9) / 1e9;
/* Determinant by cofactor expansion along the first row (any size). */
const det = M => M.length === 1 ? M[0][0]
  : M[0].reduce((s, x, j) => s + (j % 2 ? -1 : 1) * x * det(M.slice(1).map(row => row.filter((_, c) => c !== j))), 0);
/* Solve M·u = rhs by Cramer's rule: swap the right side into each column in turn. NaN when there is no single solution. */
const cramer = (M, rhs) => {
  const D = det(M);
  return M.map((_, j) => D === 0 ? NaN : det(M.map((row, i) => row.map((x, c) => c === j ? rhs[i] : x))) / D);
};
/* Does u really solve M·u = rhs? (substitution check) */
const solves = (M, u, rhs) => M.every((row, i) => Math.abs(row.reduce((s, x, j) => s + x * u[j], 0) - rhs[i]) < 1e-7);
const times = (M, v) => M.map(row => row.reduce((s, x, j) => s + x * v[j], 0));
const transpose = M => M[0].map((_, j) => M.map(row => row[j]));
const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const guard = (ok, list) => ok ? list.map(tidy) : list.map(() => NaN);

/* Ridge for a diagonal 2×2 recorder: build AᵀA + λI and Aᵀb as full matrices and solve by Cramer. */
const ridge2 = (a, b, lam) => {
  const A = [[a[0], 0], [0, a[1]]], At = transpose(A);
  const N = At.map((row, i) => row.map((_, j) => dot(row, A.map(r => r[j])) + (i === j ? lam : 0)));
  const rhs = times(At, b), x = cramer(N, rhs);
  return { N, x, ok: solves(N, x, rhs) };
};
/* Forward differences of a log, each divided by its own spacing. */
const slopes = (pos, f) => f.slice(1).map((y, i) => (y - f[i]) / (pos[i + 1] - pos[i]));
const cumulative = (start, steps) => steps.reduce((list, d) => list.concat(list[list.length - 1] + d), [start]);

Object.assign(window.ORACLE, {
  /* Café delivery: solve the two equations by Cramer; the Schur coefficient is the determinant over the pivot,
     and the reduced right side is what S·y must equal, read from the swapped determinant. */
  q61b: p => {
    const f = p.a * p.x + p.b * p.y, g = p.c * p.x + p.d * p.y;
    const M = [[p.a, p.b], [p.c, p.d]], u = cramer(M, [f, g]);
    return guard(solves(M, u, [f, g]), [det(M) / p.a, det([[p.a, f], [p.c, g]]) / p.a, u[1], u[0]]);
  },
  /* Heating: the full 3×3 system by Cramer; S = det of the whole matrix ÷ the two room pivots. */
  q61c: p => {
    const b = p.a.map((a, i) => a * p.k[i]);
    const fr = p.a.map((a, i) => a * p.x[i] + b[i] * p.y), g = p.c[0] * p.x[0] + p.c[1] * p.x[1] + p.d * p.y;
    const M = [[p.a[0], 0, b[0]], [0, p.a[1], b[1]], [p.c[0], p.c[1], p.d]], rhs = [fr[0], fr[1], g];
    const u = cramer(M, rhs);
    return guard(solves(M, u, rhs), [det(M) / (p.a[0] * p.a[1]), u[2], u[0], u[1]]);
  },
  /* Circuit loops: determinant by cofactors, S = determinant ÷ pivot, currents by Cramer. */
  q61d: p => {
    const f = p.a * p.x - p.r * p.y, g = p.d * p.y - p.r * p.x;
    const M = [[p.a, -p.r], [-p.r, p.d]], u = cramer(M, [f, g]);
    return guard(solves(M, u, [f, g]), [det(M) / p.a, det(M), u[1], u[0]]);
  },
  /* Pixel: the full matrix product with P written out; the squared norm is taken from the product itself. */
  q62b: p => {
    const P = p.k === 1 ? [[0, 0, 1], [1, 0, 0], [0, 1, 0]] : [[0, 1, 0], [0, 0, 1], [1, 0, 0]];
    const out = times(P, p.v);
    return [...out, dot(out, out)];
  },
  /* Rover: build P from the named stored order, undo both stored moves with P-transpose, then dot the originals. */
  q62c: p => {
    const axes = ['east', 'north', 'up'], stored = p.k === 1 ? ['up', 'east', 'north'] : ['north', 'up', 'east'];
    const P = stored.map(name => axes.map(axis => axis === name ? 1 : 0)), Pt = transpose(P);
    const move = times(Pt, p.y), other = times(Pt, p.w);
    return [...move, dot(move, other)];
  },
  /* Sprite: multiply by Q entry by entry; norm from the new corner; determinant by cofactors. */
  q62d: p => {
    const M = p.refl ? [[p.c, p.s], [p.s, -p.c]] : [[p.c, -p.s], [p.s, p.c]];
    const Q = M.map(row => row.map(x => x / 5)), corner = times(Q, [5 * p.p, 5 * p.q]);
    return [...corner, dot(corner, corner), det(Q)].map(tidy);
  },
  /* Playlist: rebuild the full 4×4 table from the triples, multiply it out and count the zero cells. */
  q63b: p => {
    const A = [0, 1, 2, 3].map(() => [0, 0, 0, 0]);
    for (const [row, col, plays] of p.e) A[row - 1][col - 1] += plays;
    return [...times(A, p.x), A.flat().filter(x => x === 0).length];
  },
  /* Probes: build the full N×N table, count by looking, and multiply row k with junk in every far probe. */
  q63c: p => {
    const A = Array.from({ length: p.N }, (_, i) => Array.from({ length: p.N }, (_, j) => i === j ? 2 : Math.abs(i - j) === 1 ? -1 : 0));
    const x = Array.from({ length: p.N }, (_, i) => 1000 + 37 * i);
    p.t.forEach((reading, n) => { x[p.k - 2 + n] = reading; });
    return [A.flat().filter(v => v !== 0).length, A.flat().length, times(A, x)[p.k - 1]];
  },
  /* Towns: assemble L road by road (each road adds +1 on its two diagonal cells and −1 on its two off-diagonal cells). */
  q63d: p => {
    const L = [0, 1, 2, 3, 4].map(() => [0, 0, 0, 0, 0]);
    for (const [i, j] of [[0, 1], [1, 2], [2, 3], [3, 4], ...p.extra]) { L[i][i]++; L[j][j]++; L[i][j]--; L[j][i]--; }
    return [...times(L, p.x), L.flat().filter(v => v !== 0).length];
  },
  /* Recorder: exact answer by Cramer on A itself; ridge by Cramer on the full normal equations. */
  q64b: p => {
    const b = p.a.map((a, i) => a * p.t[i]), A = [[p.a[0], 0], [0, p.a[1]]];
    const exact = cramer(A, b), r = ridge2(p.a, b, p.lam);
    return guard(solves(A, exact, b) && r.ok, [...exact, ...r.x]);
  },
  /* Taxi: ridge as ordinary least squares on the rides plus one extra made-up ride (√λ km, 0 dollars). */
  q64c: p => {
    const a2 = p.a.concat(Math.sqrt(p.lam)), b2 = p.b.concat(0);
    return [dot(p.a, p.a), dot(p.a, p.b), dot(a2, b2) / dot(a2, a2)].map(tidy);
  },
  /* Condition numbers read off the full matrices (largest ÷ smallest diagonal entry); ridge by Cramer. */
  q64d: p => {
    const plain = ridge2(p.a, p.b, 0).N, r = ridge2(p.a, p.b, p.lam);
    const cond = N => Math.max(N[0][0], N[1][1]) / Math.min(N[0][0], N[1][1]);
    return guard(r.ok && plain[0][1] === 0 && plain[1][0] === 0, [cond(plain), cond(r.N), ...r.x]);
  },
  /* Cyclist: rebuild the printed log, then divide each gap by the spacing in hours. */
  q65b: p => {
    const s = cumulative(p.s0, p.v.map(v => v * p.h / 100)), t = [0, 1, 2, 3].map(i => i * p.h / 100);
    return slopes(t, s).map(tidy);
  },
  /* Drone: rebuild the three heights, difference them, then difference the two speeds with the same spacing. */
  q65c: p => {
    const z = cumulative(p.z0, p.v.map(v => v * p.h / 100)), t = [0, 1, 2].map(i => i * p.h / 100);
    const speed = slopes(t, z);
    return [...speed, ...slopes(t, speed)].map(tidy);
  },
  /* Road: rebuild marker positions and heights from the spacings, each slope with its own spacing. */
  q65d: p => {
    const pos = cumulative(p.x0, p.d.map(d => d / 100)), f = cumulative(p.f0, p.m.map((m, i) => m * p.d[i] / 100));
    return slopes(pos, f).map(tidy);
  },
});
})();
