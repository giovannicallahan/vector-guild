/* Independent oracles for Discrete mathematics practice missions, file 7 of 8: q31b–q35d (game/realms/disc/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Subsets of {0..n-1} with exactly k members, as arrays (brute force). */
const subsets = (n, k) => { const out = []; for (let mask = 0; mask < (1 << n); mask++) { const s = []; for (let i = 0; i < n; i++) if (mask >> i & 1) s.push(i); if (s.length === k) out.push(s); } return out; };
/* Run a second-order recurrence a(n) = s a(n-1) - t a(n-2) forward from a0, a1 (s, t from the roots). */
const run = (sum, prod, a0, a1, upto) => { const a = [a0, a1]; for (let n = 2; n <= upto; n++) a.push(sum * a[n - 1] - prod * a[n - 2]); return a; };
/* Every way to cover a strip of length n with 1-tiles and 2-tiles, as arrays of tile lengths. */
const tilings = n => { if (n === 0) return [[]]; let out = []; for (const t of [1, 2]) if (t <= n) for (const rest of tilings(n - t)) out.push([t, ...rest]); return out; };
/* Number of ways to pay k credits from groups [{value, count}] of alike tokens (count of each value used 0..count). */
const pay = (groups, k) => { let ways = 0; const go = (i, left) => { if (i === groups.length) { if (left === 0) ways++; return; } for (let u = 0; u <= groups[i].count; u++) if (u * groups[i].value <= left) go(i + 1, left - u * groups[i].value); }; go(0, k); return ways; };
Object.assign(window.ORACLE, {
  /* q31b: roots p (larger) and q; a0 = A + B, a1 = A p + B q; the recurrence has sum p + q and product p q; run it to a7. */
  q31b: p => {
    const r = Math.max(p.p, p.q), s = Math.min(p.p, p.q), A = p.p >= p.q ? p.A : p.B, B = p.p >= p.q ? p.B : p.A;
    const a = run(r + s, r * s, A + B, A * r + B * s, 7);
    return [r, s, A, a[7]];
  },
  /* q31c: A, B are the weights on the roots p, q; run the recurrence forward to a6. */
  q31c: p => {
    const a = run(p.p + p.q, p.p * p.q, p.A + p.B, p.A * p.p + p.B * p.q, 6);
    return [p.A, p.B, a[6]];
  },
  /* q31d: roots p (larger), q; run the recurrence and add the first six terms. */
  q31d: p => {
    const r = Math.max(p.p, p.q), s = Math.min(p.p, p.q), A = p.p >= p.q ? p.A : p.B, B = p.p >= p.q ? p.B : p.A;
    const a = run(r + s, r * s, A + B, A * r + B * s, 5);
    return [r, s, a.slice(0, 6).reduce((x, y) => x + y, 0)];
  },
  /* q32b: climbs of len steps with strides 1 or m (counted by listing every stride sequence); lamp rows of m by checking every on/off pattern. */
  q32b: p => {
    const climbs = n => { if (n === 0) return 1; let c = 0; for (const t of [1, p.k]) if (t <= n) c += climbs(n - t); return c; };
    let rows = 0; for (let mask = 0; mask < (1 << p.m); mask++) if ((mask & (mask >> 1)) === 0) rows++;
    return [climbs(p.len), rows];
  },
  /* q32c: list every tiling of each part; the whole strip is a free choice on each side of the plate. */
  q32c: p => { const x = tilings(p.a).length, y = tilings(p.b).length; return [x, y, x * y]; },
  /* q32d: list every tiling of the strip; keep those with exactly j 2-tiles. */
  q32d: p => {
    const all = tilings(p.len), keep = all.filter(t => t.filter(x => x === 2).length === p.j);
    return [keep.length ? keep[0].length : p.len - p.j, keep.length, all.length];
  },
  /* q33b: a ones, b washers of value v, c washers of value w; product at x = 1 counts every choice; coefficient of x^k by search. */
  q33b: p => [(p.a + 1) * (p.b + 1) * (p.c + 1), pay([{ value: 1, count: p.a }, { value: p.v, count: p.b }, { value: p.w, count: p.c }], p.k)],
  /* q33c: a one-credit, b two-credit and c three-credit tokens; search both targets. */
  q33c: p => {
    const g = [{ value: 1, count: p.a }, { value: 2, count: p.b }, { value: 3, count: p.c }], x = pay(g, p.k1), y = pay(g, p.k2);
    return [x, y, x + y];
  },
  /* q33d: m different tags (choose subsets) and 0..c alike two-credit tokens; count the handfuls worth k, and all handfuls. */
  q33d: p => {
    let ways = 0, all = 0;
    for (let mask = 0; mask < (1 << p.m); mask++) { let tags = 0; for (let i = 0; i < p.m; i++) if (mask >> i & 1) tags++; for (let t = 0; t <= p.c; t++) { all++; if (tags + 2 * t === p.k) ways++; } }
    return [ways, all];
  },
  /* q34b: list every k-subset of n lamps and test whether lamp 0 (the master) is in it. */
  q34b: p => { const all = subsets(p.n, p.k); return [all.filter(s => s.includes(0)).length, all.filter(s => !s.includes(0)).length, all.length]; },
  /* q34c: list every k-crew of n tilers; tilers 0 and 1 are the two named; sort by how many are in. */
  q34c: p => {
    const all = subsets(p.n, p.k), by = [0, 0, 0];
    for (const s of all) by[(s.includes(0) ? 1 : 0) + (s.includes(1) ? 1 : 0)]++;
    return [by[2], by[1], by[0], all.length];
  },
  /* q34d: list the crews; C(n, k); crews of k-1 from the n-1 others; pairs by listing each crew with each member as lead. */
  q34d: p => {
    const crews = subsets(p.n, p.k).length, rest = subsets(p.n - 1, p.k - 1).length;
    let pairs = 0; for (const s of subsets(p.n, p.k)) for (const lead of s) pairs++;
    return [crews, rest, pairs];
  },
  /* q35b: a day d is 9-cycle number c and position r in 0..b-1 with d = b c + r: search c upward or downward. */
  q35b: p => {
    const split = d => { let c = 0; while (p.b * c > d) c--; while (p.b * (c + 1) <= d) c++; return [c, d - p.b * c]; };
    return [...split(p.a1), ...split(p.a2)];
  },
  /* q35c: pack packets one at a time into boxes of b. */
  q35c: p => {
    let full = 0, inBox = 0;
    for (let i = 0; i < p.N; i++) { inBox++; if (inBox === p.b) { full++; inBox = 0; } }
    return [full, inBox, full + (inBox ? 1 : 0)];
  },
  /* q35d: floor quotients by stepping, and the posts counted one position at a time from L to H. */
  q35d: p => {
    const q = x => { let c = 0; while (p.m * c > x) c--; while (p.m * (c + 1) <= x) c++; return c; };
    let posts = 0; for (let x = p.L; x <= p.H; x++) if (x % p.m === 0) posts++;
    return [q(p.H), q(p.L - 1), posts];
  },
});
})();
