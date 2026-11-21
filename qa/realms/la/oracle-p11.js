/* Independent oracles for linear algebra practice missions, file 11 of 14: q51–q55 (game/realms/la/practice-11.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a general solver, a search, a definition applied
   directly). qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';

const EPS = 1e-9;
/* Rank of a list of rows by Gaussian elimination with partial pivoting (the dimension of the span of the rows). */
const rank = rows => {
  const m = rows.map(r => r.slice());
  let r = 0;
  for (let c = 0; c < (m[0] || []).length && r < m.length; c++) {
    let piv = r;
    for (let i = r + 1; i < m.length; i++) if (Math.abs(m[i][c]) > Math.abs(m[piv][c])) piv = i;
    if (Math.abs(m[piv][c]) < EPS) continue;
    [m[r], m[piv]] = [m[piv], m[r]];
    for (let i = r + 1; i < m.length; i++) { const f = m[i][c] / m[r][c]; for (let j = c; j < m[i].length; j++) m[i][j] -= f * m[r][j]; }
    r++;
  }
  return r;
};
/* Cramer's rule for [[a, b], [c, d]] (x, y) = (e, f); NaN when there is no single solution. */
const cramer = (a, b, c, d, e, f) => { const D = a * d - b * c; return D === 0 ? [NaN, NaN] : [(e * d - b * f) / D, (a * f - e * c) / D]; };
/* Whole-number search: the single n in lo..hi passing the test; NaN when none or more than one. */
const only = (lo, hi, test) => { let hit = NaN, count = 0; for (let n = lo; n <= hi; n++) if (test(n)) { hit = n; count++; } return count === 1 ? hit : NaN; };
const tidy = x => Math.round(x * 1e9) / 1e9 + 0;
/* Net inflow at each node from a list of flows [from, to, amount]: every flow leaves one node and enters another. */
const netInflow = (nodes, flows) => {
  const net = {}; nodes.forEach(n => { net[n] = 0; });
  for (const [from, to, amount] of flows) { net[from] -= amount; net[to] += amount; }
  return net;
};
/* Unnormalized DFT straight from the definition X_k = sum of x_n e^(−2πi kn/N); sign +1 gives the unscaled inverse sum. */
const dft = (re, im, sign) => {
  const N = re.length, out = [];
  for (let k = 0; k < N; k++) {
    let a = 0, b = 0;
    for (let n = 0; n < N; n++) {
      const th = sign * 2 * Math.PI * k * n / N, c = Math.cos(th), s = Math.sin(th);
      a += re[n] * c - im[n] * s; b += re[n] * s + im[n] * c;
    }
    out.push([tidy(a), tidy(b)]);
  }
  return out;
};
/* The one-sided inverse of a single row or column g: the vector (a, b) with g·(a, b) = 1 that has no part at right
   angles to g, found by solving those two conditions together (not from the formula g / (g·g)). */
const oneSided = g => cramer(g[0], g[1], -g[1], g[0], 1, 0);
/* A line of solutions of two-unknown equations rows [cx, cy, rhs] with y = t: x at t = 0 and the change per unit t,
   read from the first equation and checked in every other; NaN if any equation disagrees. */
const lineX = (eqs, t) => {
  const x = (eqs[0][2] - eqs[0][1] * t) / eqs[0][0];
  return eqs.every(e => Math.abs(e[0] * x + e[1] * t - e[2]) < EPS) ? x : NaN;
};

Object.assign(window.ORACLE, {
  /* Mast camera: search for the whole step counts that land on the preset; dimension by elimination. */
  q51b: p => {
    const a = only(-60, 60, n => n * p.p === p.w[0]), b = only(-60, 60, n => n * p.q === p.w[1]);
    return [a, b, rank([[p.p, 0], [0, p.q], p.w])];
  },
  /* Fertiliser: search for the whole sack counts, build the order W entry by entry, read its phosphate, then rank. */
  q51c: p => {
    let best = null, count = 0;
    for (let a = 0; a <= 40; a++) for (let b = 0; b <= 40; b++) {
      const W = p.U.map((x, i) => a * x + b * p.V[i]);
      if (W[0] === p.N && W[2] === p.K) { best = [a, b, W]; count++; }
    }
    if (count !== 1) return [NaN, NaN, NaN, NaN];
    return [best[0], best[1], best[2][1], rank([p.U, p.V, best[2]])];
  },
  /* Drawing robot: search the whole-number grid for the one pair that rebuilds w; both dimensions by elimination. */
  q51d: p => {
    let best = null, count = 0;
    for (let a = -20; a <= 20; a++) for (let b = -20; b <= 20; b++)
      if (a * p.u[0] + b * p.v[0] === p.w[0] && a * p.u[1] + b * p.v[1] === p.w[1]) { best = [a, b]; count++; }
    if (count !== 1) return [NaN, NaN, NaN, NaN];
    return [best[0], best[1], rank([p.u, p.v, p.w]), rank([p.p, p.q])];
  },
  /* Market stall: the receipts as written; x at t = 0 and the change per unit of t; free variables = unknowns − rank. */
  q52b: p => {
    const eqs = [[p.m1, p.m1 * p.b, p.m1 * p.s], [p.m2, p.m2 * p.b, p.m2 * p.s]];
    const c = lineX(eqs, 0), k = lineX(eqs, 1) - c;
    const consistent = rank(eqs) === rank(eqs.map(e => e.slice(0, 2)));
    return [c, k, consistent ? 2 - rank(eqs.map(e => e.slice(0, 2))) : NaN, lineX(eqs, p.t0)];
  },
  /* Generators: for a chosen y solve reports one and two for x and z by Cramer's rule, check report three, and read
     the constants (t = 0) and the t coefficients (t = 1 minus t = 0, confirmed at t = 2). */
  q52c: p => {
    const A = [[1, 1, 1], [1, -p.m, 0], [2, 1 - p.m, 1]], rhs = [p.T, p.d, p.T + p.d];
    const at = t => {
      const [x, z] = cramer(A[0][0], A[0][2], A[1][0], A[1][2], rhs[0] - A[0][1] * t, rhs[1] - A[1][1] * t);
      return Math.abs(A[2][0] * x + A[2][1] * t + A[2][2] * z - rhs[2]) < EPS ? [x, z] : [NaN, NaN];
    };
    const s0 = at(0), s1 = at(1), s2 = at(2);
    const kx = s1[0] - s0[0], kz = s1[1] - s0[1];
    if (Math.abs(s2[0] - s0[0] - 2 * kx) > EPS || Math.abs(s2[1] - s0[1] - 2 * kz) > EPS) return [NaN, NaN, NaN, NaN, NaN];
    const aug = A.map((r, i) => r.concat(rhs[i]));
    return [s0[0], kx, s0[1], kz, rank(aug) === rank(A) ? 3 - rank(A) : NaN];
  },
  /* Cargo scale: search for the one smudged weight that leaves the two logs consistent (same rank with and without
     the right side); the line of solutions as in q52b; then the third weighing x = r·y solved with load one by Cramer. */
  q52d: p => {
    const co = [[p.m1, p.m1 * p.b], [p.m2, p.m2 * p.b]];
    const h = only(1, 2000, n => rank([co[0].concat(p.m1 * p.s), co[1].concat(n)]) === rank(co));
    const eqs = [co[0].concat(p.m1 * p.s), co[1].concat(h)];
    const c = lineX(eqs, 0), k = lineX(eqs, 1) - c;
    const [crate, drum] = cramer(p.m1, p.m1 * p.b, 1, -p.r, p.m1 * p.s, 0);
    return [h, c, k, drum, crate];
  },
  /* Two tracks: decoder from its two defining conditions, then applied to the track values the prompt shows. */
  q53b: p => {
    const [a, b] = oneSided(p.g), tracks = [p.g[0] * p.x, p.g[1] * p.x];
    return [a, b, a * tracks[0] + b * tracks[1]];
  },
  /* Two pumps: right inverse from its two defining conditions; the settings must deliver exactly y litres a minute. */
  q53c: p => {
    const R = oneSided(p.g), set = R.map(x => x * p.y);
    return Math.abs(p.g[0] * set[0] + p.g[1] * set[1] - p.y) < 1e-6 ? [R[0], R[1], set[0], set[1]] : [NaN, NaN, NaN, NaN];
  },
  /* Wheel sensors: split y into a part along A and a part at right angles to A (Cramer on y = x·A + s·n); x is the
     estimate and x·A the clean readings. The left inverse comes from its defining conditions. */
  q53d: p => {
    const [a, b] = oneSided(p.g);
    const [x, s] = cramer(p.g[0], -p.g[1], p.g[1], p.g[0], p.y[0], p.y[1]);
    if (Math.abs(s) < EPS) return [NaN, NaN, NaN, NaN, NaN];
    return [a, b, x, p.g[0] * x, p.g[1] * x];
  },
  /* Flatmates: book every payment out of the sender and into the receiver. */
  q54b: p => {
    const net = netInflow(['Ana', 'Ben', 'Cal'], [['Ana', 'Ben', p.f[0]], ['Ben', 'Cal', p.f[1]], ['Cal', 'Ana', p.f[2]]]);
    return [net.Ana, net.Ben, net.Cal];
  },
  /* Water network: search for the unmetered flow that balances the junction, then book every flow. */
  q54c: p => {
    const book = f3 => netInflow(['R', 'J', 'F', 'T'], [['R', 'J', p.f1], ['J', 'T', p.f2], ['F', 'T', p.f4], ['J', 'F', f3]]);
    const f3 = only(-200, 200, n => book(n).J === 0), net = book(f3);
    return [f3, net.R, net.F, net.T];
  },
  /* Relays: only link 1 touches A and only link 3 touches D, so search each of those alone against the log, then
     search link 2 against B; read C from the books. */
  q54d: p => {
    const book = (f1, f2, f3) => netInflow(['A', 'B', 'C', 'D'], [['A', 'B', f1], ['C', 'B', f2], ['C', 'D', f3]]);
    const f1 = only(-60, 60, n => book(n, 0, 0).A === p.nA);
    const f3 = only(-60, 60, n => book(0, 0, n).D === p.nD);
    const f2 = only(-60, 60, n => book(f1, n, f3).B === p.nB);
    const net = book(f1, f2, f3);
    return net.A === p.nA && net.B === p.nB && net.D === p.nD ? [f1, f2, f3, net.C] : [NaN, NaN, NaN, NaN];
  },
  /* Picture row: DFT straight from the definition with complex exponentials; the imaginary parts must vanish. */
  q55b: p => {
    const X = dft([p.x0, p.s, p.x2, p.s], [0, 0, 0, 0], -1);
    if (X.some(z => z[1] !== 0)) return [NaN, NaN, NaN, NaN];
    return [X[0][0], (p.x0 + p.s + p.x2 + p.s) / 4, X[1][0], X[2][0]];
  },
  /* Quarterly sales: DFT straight from the definition, not the even/odd split. */
  q55c: p => {
    const X = dft(p.x, [0, 0, 0, 0], -1);
    return [X[0][0], X[2][0], X[1][0], X[1][1]];
  },
  /* Beacon: inverse DFT from the definition, x_n = (1/4) × sum of X_k e^(+2πi kn/4); the samples must come out real. */
  q55d: p => {
    const x = dft([p.X0, p.re1, p.X2, p.re1], [0, p.im1, 0, -p.im1], 1);
    if (x.some(z => z[1] !== 0)) return [NaN, NaN, NaN, NaN];
    return x.map(z => z[0] / 4);
  },
});
})();
