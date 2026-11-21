/* Independent oracles for Foundations practice missions, file 6 of 8: q26b–q30d (game/realms/found/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counting, digit reading, search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Each oracle first rebuilds only the numbers the prompt shows (totals, grids, exponents), then answers from those
   alone: a search over whole numbers, a general elimination solver, or counting. */

/* General solver: Gauss-Jordan elimination with exact fractions on the rows [coefficients..., right side]. */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
const fr = (num, den = 1) => { if (den < 0) { num = -num; den = -den; } const g = gcd(num, den); return [num / g, den / g]; };
const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
const solve = rows => {
  const m = rows.map(r => r.map(v => fr(v)));
  const size = m.length;
  for (let col = 0; col < size; col++) {
    let piv = col; while (piv < size && m[piv][col][0] === 0) piv++;
    if (piv === size) throw new Error('oracle-p6: no unique solution');
    const t = m[col]; m[col] = m[piv]; m[piv] = t;
    const lead = m[col][col];
    m[col] = m[col].map(v => fdiv(v, lead));
    for (let r = 0; r < size; r++) {
      if (r === col || m[r][col][0] === 0) continue;
      const f = m[r][col];
      m[r] = m[r].map((v, j) => fsub(v, fmul(f, m[col][j])));
    }
  }
  return m.map(r => r[size][0] / r[size][1]);
};
/* Search: the only pair of whole numbers 0..limit that passes the test (throws if none or more than one). */
const onlyPair = (limit, test) => {
  let found = null;
  for (let x = 0; x <= limit; x++) for (let y = 0; y <= limit; y++) if (test(x, y)) {
    if (found) throw new Error('oracle-p6: more than one whole-number solution');
    found = [x, y];
  }
  if (!found) throw new Error('oracle-p6: no whole-number solution');
  return found;
};
/* A power of 2 by doubling, and the exponent of a power of 2 by halving. */
const pow2 = e => { let v = 1; for (let i = 0; i < e; i++) v += v; return v; };
const log2 = v => { let e = 0; while (v > 1) { v /= 2; e++; } return e; };
/* Add up a list one entry at a time. */
const total = list => { let s = 0; for (const v of list) s += v; return s; };

Object.assign(window.ORACLE, {
  /* Shown: k, d, p, q, W. Try every whole number of adult tickets until the takings match. */
  q26b: p => {
    const W = p.p * p.x + p.q * (p.k * p.x + p.d);
    const hits = [];
    for (let x = 0; x <= 500; x++) { const y = p.k * x + p.d; if (p.p * x + p.q * y === W) hits.push([x, y]); }
    if (hits.length !== 1) throw new Error('q26b: not exactly one solution');
    return hits[0];
  },
  /* Shown: p, q, d, W. Pay the week hour by hour: try every whole number of weekend hours. */
  q26c: p => {
    const W = p.p * (p.y + p.d) + p.q * p.y;
    const hits = [];
    for (let y = 0; y <= 500; y++) {
      const x = y + p.d;
      let pay = 0; for (let h = 0; h < x; h++) pay += p.p;
      let weekend = 0; for (let h = 0; h < y; h++) weekend += p.q;
      if (pay + weekend === W) hits.push([y, x, weekend]);
    }
    if (hits.length !== 1) throw new Error('q26c: not exactly one solution');
    return hits[0];
  },
  /* Shown: p, q, N, W. Search every split of the N notes. */
  q26d: p => {
    const N = p.x + p.y, W = p.p * p.x + p.q * p.y;
    return onlyPair(N, (x, y) => x + y === N && p.p * x + p.q * y === W);
  },
  /* Shown: a, b1, b2, c1, c2. General solver on the two receipts. */
  q27b: p => {
    const c1 = p.a * p.x + p.b1 * p.y, c2 = p.a * p.x + p.b2 * p.y;
    return solve([[p.a, p.b1, c1], [p.a, p.b2, c2]]);
  },
  /* Shown: a1, a2, b, c1, c2, u, v. Search whole litres per hour, then burn run 3 hour by hour. */
  q27c: p => {
    const c1 = p.a1 * p.x + p.b * p.y, c2 = p.a2 * p.x + p.b * p.y;
    const [x, y] = onlyPair(100, (X, Y) => p.a1 * X + p.b * Y === c1 && p.a2 * X + p.b * Y === c2);
    let fuel = 0;
    for (let h = 0; h < p.u; h++) fuel += x;
    for (let h = 0; h < p.v; h++) fuel += y;
    return [x, y, fuel];
  },
  /* Shown: a1, b, a2, m*b, P1, P2. General solver on the two days as written (no multiplying first). */
  q27d: p => {
    const shakes2 = p.m * p.b;
    const P1 = p.a1 * p.x + p.b * p.y, P2 = p.a2 * p.x + shakes2 * p.y;
    return solve([[p.a1, p.b, P1], [p.a2, shakes2, P2]]);
  },
  /* Shown: a, b, c, p. General solver on the three receipts. */
  q28b: p => {
    const a = p.x + p.y + p.z, b = p.x + p.y, c = p.p * p.x + p.y;
    return solve([[1, 1, 1, a], [1, 1, 0, b], [p.p, 1, 0, c]]);
  },
  /* Shown: a, b, c, p, q, u, v, w. General solver on the three huts, then wire the new hut device by device. */
  q28c: p => {
    const a = p.x + p.y + p.z, b = p.x + p.q * p.y + p.z, c = p.p * p.x + p.y + p.z;
    const [x, y, z] = solve([[1, 1, 1, a], [1, p.q, 1, b], [p.p, 1, 1, c]]);
    let hut = 0;
    for (let i = 0; i < p.u; i++) hut += x;
    for (let i = 0; i < p.v; i++) hut += y;
    for (let i = 0; i < p.w; i++) hut += z;
    return [x, y, z, hut];
  },
  /* Shown: a, b, c, r, p, s. Search every whole-number set of points. */
  q28d: p => {
    const a = p.x + p.y + p.z, b = p.x + p.y + p.r * p.z, c = p.p * p.x + p.y + p.s * p.z;
    const hits = [];
    for (let x = 0; x <= a; x++) for (let y = 0; x + y <= a; y++) {
      const z = a - x - y;
      if (x + y + p.r * z === b && p.p * x + y + p.s * z === c) hits.push([x, y, z]);
    }
    if (hits.length !== 1) throw new Error('q28d: not exactly one solution');
    return hits[0];
  },
  /* Walk the grid cell by cell with 1-based row i and column j, as the prompt numbers them. */
  q29b: p => {
    let entry = null, rowSum = 0, colSum = 0;
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 4; j++) {
      const cell = p.g[i - 1][j - 1];
      if (i === p.e[0] && j === p.e[1]) entry = cell;
      if (i === p.r) rowSum += cell;
      if (j === p.c) colSum += cell;
    }
    return [entry, rowSum, colSum];
  },
  /* Read the asked rover's row; burn fuel day by day, hour by hour, at that day's rate. */
  q29c: p => {
    const row = p.g[p.r - 1];
    const flat = total(row.filter((_, j) => j + 1 <= 3)), ridge = total(row.filter((_, j) => j + 1 >= 4));
    let fuel = 0;
    row.forEach((hours, j) => { const rate = j + 1 <= 3 ? p.f : p.k; for (let h = 0; h < hours; h++) fuel += rate; });
    return [flat, ridge, fuel];
  },
  /* Follow the plan week by week: start at m + c, add m each week, keep a running total. */
  q29d: p => {
    let week = p.m + p.c, saved = week;
    for (let j = 2; j <= p.N; j++) { week += p.m; saved += week; }
    return [week, saved];
  },
  /* Multiply the two storage figures out, then read the exponent back by halving. Same for the bytes. */
  q30b: p => {
    const gb = pow2(p.m) * pow2(p.k);
    let bytes = 1; for (let i = 0; i < p.u; i++) bytes *= pow2(10);
    return [log2(gb), gb, log2(bytes)];
  },
  /* Count the floor tiles and the pallet tiles as plain numbers, then read the exponents by halving. */
  q30c: p => {
    const side = pow2(p.p), floor = side * side;
    const pallet = pow2(p.m) * pow2(p.k);
    return [log2(floor), log2(pallet), pallet - floor];
  },
  /* Count the cubes in a load as a plain number; find how many loads make the mast total by doubling the load. */
  q30d: p => {
    const T = 3 * p.p + p.r + p.x;
    const edge = pow2(p.p), load = edge * edge * edge * pow2(p.r);
    const mast = pow2(T);
    let have = load, doublings = 0;
    while (have < mast) { have += have; doublings++; }
    if (have !== mast) throw new Error('q30d: mast total is not a power-of-2 multiple of a load');
    return [log2(load), load, doublings];
  },
});
})();
