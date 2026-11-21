/* Independent oracles for Foundations chapters 5 "Systems and tables" and 6 "Powers and polynomials", q25–q35
   (game/realms/found/missions-c.js). Each one rebuilds the numbers the prompt states from the generator's
   parameters and answers by a different method from build(): bisection, brute-force search, a general
   Gaussian elimination, repeated doubling and dividing, interpolation through sample values, root search,
   ternary search for a minimum and long division. */
(function(){ 'use strict';
/* Bisection: the x in [lo, hi] where f changes sign (f(lo) and f(hi) of opposite signs). */
const bisect = (f, lo, hi) => { let flo = f(lo); for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, fm = f(mid); if (fm === 0) return mid; if ((fm < 0) === (flo < 0)) { lo = mid; flo = fm; } else hi = mid; } return (lo + hi) / 2; };
/* Solve the square system A·v = c by Gaussian elimination with partial pivoting. */
const solve = (A, c) => {
  const M = A.map((row, i) => row.concat([c[i]])), N = M.length;
  for (let col = 0; col < N; col++) {
    let piv = col; for (let r = col + 1; r < N; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    if (M[col][col] === 0) return A.map(() => NaN);
    for (let r = 0; r < N; r++) if (r !== col) { const f = M[r][col] / M[col][col]; for (let j = col; j <= N; j++) M[r][j] -= f * M[col][j]; }
  }
  return M.map((row, i) => row[N] / row[i]);
};
/* Whole numbers v in [lo, hi] with test(v). */
const all = (lo, hi, test) => { const out = []; for (let v = lo; v <= hi; v++) if (test(v)) out.push(v); return out; };
/* How many times d divides v exactly. */
const countFactors = (v, d) => { let k = 0; while (v % d === 0 && v > 1) { v /= d; k++; } return k; };
/* Coefficients [x², x, 1] of the quadratic through three sample values f(0), f(1), f(2). */
const fit = f => { const y0 = f(0), y1 = f(1), y2 = f(2), A = (y2 - 2 * y1 + y0) / 2; return [A, y1 - y0 - A, y0]; };
Object.assign(window.ORACLE, {
  /* Tank A starts at b1 and gains m1 an hour, tank B starts at b2 and gains m2. Bisect on the gap between them,
     then read the litres off tank B. */
  q25: p => {
    const A = t => p.b1 + p.m1 * t, B = t => p.b2 + p.m2 * t;
    const x = bisect(t => A(t) - B(t), 0, 1000);
    return [x, B(x)];
  },
  /* x grain sacks of p kg and x + d bean sacks of q kg weigh W kg. Try every count of grain sacks. */
  q26: p => {
    const W = p.p * p.x + p.q * (p.x + p.d);
    const hits = all(0, 1000, g => p.p * g + p.q * (g + p.d) === W);
    return hits.length === 1 ? [hits[0], hits[0] + p.d] : [NaN, NaN];
  },
  /* Two weighed deliveries: a1 filters and b valves weigh c1, a2 filters and b valves weigh c2.
     Solve the 2 by 2 system by general elimination. */
  q27: p => {
    const c1 = p.a1 * p.x + p.b * p.y, c2 = p.a2 * p.x + p.b * p.y;
    return solve([[p.a1, p.b], [p.a2, p.b]], [c1, c2]);
  },
  /* Three loads: (1,1,1), (p,1,1) and (1,1,r) crates weigh the stated totals. General 3 by 3 elimination. */
  q28: p => {
    const w = (u, v, s) => u * p.x + v * p.y + s * p.z;
    return solve([[1, 1, 1], [p.p, 1, 1], [1, 1, p.r]], [w(1, 1, 1), w(p.p, 1, 1), w(1, 1, p.r)]);
  },
  /* Walk every cell of the grid once, adding it to the row-2 total if its row is 2, to the column-3 total if its
     column is 3, and always to the grand total. */
  q29: p => {
    let row2 = 0, col3 = 0, total = 0;
    p.g.forEach((row, i) => row.forEach((v, j) => { if (i + 1 === 2) row2 += v; if (j + 1 === 3) col3 += v; total += v; }));
    return [row2, col3, total];
  },
  /* Halve the sheet m times and then k more times, doubling the count each cut; the exponent is how many times
     the count can be halved back to 1. The tank holds side × side × side, with side = b multiplied p times;
     count the factors of b in it. */
  q30: p => {
    let pieces = 1; for (let i = 0; i < p.m + p.k; i++) pieces *= 2;
    let side = 1; for (let i = 0; i < p.p; i++) side *= p.b;
    return [countFactors(pieces, 2), pieces, countFactors(side * side * side, p.b)];
  },
  /* The side is the whole number whose square is the stated area. For the brace, N = k²·m: find the largest
     square that divides N; its root goes outside and the rest stays inside. */
  q31: p => {
    const A = p.s * p.s, N = p.k * p.k * p.m;
    const side = all(0, 1000, v => v * v === A);
    const sq = all(1, 1000, v => v * v <= N && N % (v * v) === 0);
    const k = sq[sq.length - 1];
    return [side.length === 1 ? side[0] : NaN, k, N / (k * k)];
  },
  /* Evaluate the total area (x + a)(x + b) + p·x² + q·x + r at x = 0, 1, 2 and fit the quadratic through them. */
  q32: p => fit(x => (x + p.a) * (x + p.b) + p.p * x * x + p.q * x + p.r),
  /* The area x² + (p + q)x + pq is 0 exactly at x = −(each number); search the whole numbers for those roots. */
  q33: p => {
    const B = p.p + p.q, C = p.p * p.q;
    const roots = all(-200, 200, x => x * x + B * x + C === 0);
    if (roots.length !== 2) return [NaN, NaN];
    return roots.map(x => -x).sort((u, v) => u - v);
  },
  /* y = x² − Bx + C with the stated B and C (the trough with roots r and r + d). Search whole numbers for the
     floor crossings; find the lowest point by ternary search between them. */
  q34: p => {
    const s = p.r + p.d, B = p.r + s, C = p.r * s, y = x => x * x - B * x + C;
    const roots = all(-200, 200, x => y(x) === 0);
    if (roots.length !== 2) return [NaN, NaN, NaN, NaN];
    let lo = roots[0], hi = roots[1];
    for (let i = 0; i < 300; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (y(m1) < y(m2)) hi = m2; else lo = m1; }
    const vx = (lo + hi) / 2;
    return [roots[0], roots[1], vx, y(vx)];
  },
  /* Long division of x² + Bx + C by x + a: the quotient is x + q with remainder R. The length at x0 is the area
     at x0 divided by the width at x0; the forbidden x is where the width is 0, found by bisection. */
  q35: p => {
    const B = p.a + p.c, C = p.a * p.c;
    const q = B - p.a, R = C - q * p.a;          // x² + Bx + C = (x + a)(x + q) + R
    const len = (p.x0 * p.x0 + B * p.x0 + C) / (p.x0 + p.a);
    const bad = bisect(x => x + p.a, -1000, 1000);
    return [R === 0 ? q : NaN, len, bad];
  },
});
})();
