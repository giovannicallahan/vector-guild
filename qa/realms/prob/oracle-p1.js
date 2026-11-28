/* Independent oracles for Probability practice missions, file 1 of 8: q01b–q05d (game/realms/prob/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Lowest terms by trying every divisor downwards from the smaller number (no gcd formula). */
const lowest = (n, d) => { for (let k = Math.min(n, d); k >= 1; k--) if (n % k === 0 && d % k === 0) return [n / k, d / k]; return [n, d]; };
/* Count whole-number items 1..n for which test(i) holds, one at a time. */
const countWhere = (n, test) => { let c = 0; for (let i = 1; i <= n; i++) if (test(i)) c++; return c; };
Object.assign(window.ORACLE, {
  /* q01b: tray of a quartz, b amber, c smoky, d clear; list every crystal as an outcome, then P(smoky). */
  q01b: p => {
    const tray = [];
    [['q', p.a], ['a', p.b], ['s', p.c], ['c', p.d]].forEach(([k, n]) => { for (let i = 0; i < n; i++) tray.push(k); });
    return [tray.length, ...lowest(tray.filter(x => x === 's').length, tray.length)];
  },
  /* q01c: crate of m mast, g greenhouse, d depot; one mast parcel leaves; P(greenhouse) among those left. */
  q01c: p => {
    const crate = [];
    [['m', p.m], ['g', p.g], ['d', p.d]].forEach(([k, n]) => { for (let i = 0; i < n; i++) crate.push(k); });
    crate.splice(crate.indexOf('m'), 1);
    return [crate.length, ...lowest(crate.filter(x => x === 'g').length, crate.length)];
  },
  /* q01d: t tags, a quarter red, a third green, y yellow, rest blue: count tag by tag. */
  q01d: p => {
    let blue = 0;
    for (let i = 0; i < p.t; i++) {
      if (i < p.t / 4) continue;
      if (i < p.t / 4 + p.t / 3) continue;
      if (i < p.t / 4 + p.t / 3 + p.y) continue;
      blue++;
    }
    return [blue, ...lowest(blue, p.t)];
  },
  /* q02b: L tested, k lit; N = m × L is the number of the next flares; expected failures from the failure frequency. */
  q02b: p => {
    const freq = r6(p.k / p.L), fail = (p.L - p.k) / p.L;
    return [freq, r6(p.m * p.L * fail)];
  },
  /* q02c: pool both logs; the next batch is m times the combined log length. */
  q02c: p => {
    const runs = p.L1 + p.L2, ok = p.k1 + p.k2, f = ok / runs;
    return [r6(f), r6(p.m * runs * f)];
  },
  /* q02d: frequency is k / L and late runs are L - k; search for the log length n whose late share is the stated one. */
  q02d: p => {
    const late = p.L - p.k, freq = p.k / p.L;
    let n = late;
    while (Math.abs((n - late) / n - freq) > 1e-9 && n < 1e6) n++;
    return [n, r6(p.N * freq)];
  },
  /* q03b: busy chance 100 k / T per cent (k is the busy count); free is the rest. */
  q03b: p => {
    let busy = 0; for (let s = 0; s < p.T; s++) if (s < p.k) busy++;
    const busyPct = r6(busy * 100 / p.T);
    return [r6(100 - busyPct), p.T - busy];
  },
  /* q03c: complement, expected late runs, penalty. */
  q03c: p => {
    const late = r6(1 - p.p), n = r6(p.T * late);
    return [late, n, r6(n * p.f)];
  },
  /* q03d: shares: 1 for canyon and r for not canyon; the deck splits in those proportions. */
  q03d: p => {
    const shares = 1 + p.r;
    return [r6(1 / shares), r6(p.T * p.r / shares)];
  },
  /* q04b: list every (first, second) pair, multiply, count those equal to s. */
  q04b: p => {
    let cells = 0, hit = 0;
    for (let x = 1; x <= p.a; x++) for (let y = 1; y <= p.b; y++) { cells++; if (x * y === p.s) hit++; }
    return [cells, ...lowest(hit, cells)];
  },
  /* q04c: walk the grid and keep the cells not in row 1 and not in column 1. */
  q04c: p => {
    let cells = 0, open = 0;
    for (let r = 1; r <= p.a; r++) for (let c = 1; c <= p.b; c++) { cells++; if (r !== 1 && c !== 1) open++; }
    return [open, ...lowest(open, cells)];
  },
  /* q04d: walk the grid and count cells whose sum reaches s. */
  q04d: p => {
    let cells = 0, hit = 0;
    for (let x = 1; x <= p.a; x++) for (let y = 1; y <= p.b; y++) { cells++; if (x + y >= p.s) hit++; }
    return [cells, ...lowest(hit, cells)];
  },
  /* q05b: M and S counts include the overlap o; z relays are in neither circle. Build the regions by label. */
  q05b: p => {
    const mOnly = p.m - p.o, sOnly = p.s - p.o;
    return [mOnly + p.o + sOnly, p.z];
  },
  /* q05c: K = k0 + o and D = d0 + o as stated; the crates in neither is z, the delivery is every crate.
     Find the overlap by trying sizes until the regions fill exactly the crates not in neither. */
  q05c: p => {
    const K = p.k0 + p.o, D = p.d0 + p.o, total = p.k0 + p.o + p.d0 + p.z, inside = total - p.z;
    let both = 0; while (K + D - both !== inside) both++;
    return [both, D - both];
  },
  /* q05d: the three regions inside the circles, and the rest of the N crates is outside. */
  q05d: p => {
    const inside = p.f0 + p.o + p.c0, outside = p.N - inside;
    return [inside, ...lowest(outside, p.N)];
  },
});
})();
