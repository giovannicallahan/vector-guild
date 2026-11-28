/* Independent oracles for Real analysis learn missions, file a: q01–q10 (game/realms/real/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
  /* `form` only picks the text: 0 = reading a − b/n, 1 = reading a + b/n. Tabulate the first 2000 readings; the
     supremum is the largest tabulated reading when the readings fall or are flat, else the limit a (never reached). */
  q01: p => {
    const r = [];
    for (let n = 1; n <= 2000; n++) r.push(p.form === 0 ? p.a - p.b / n : p.a + p.b / n);
    const top = Math.max(...r);
    const rising = r[1999] > r[0];                  // readings climb towards a limit they never reach
    return rising ? [p.a, 0] : [top, 1];
  },
  /* `form` only picks the text: 0 = a + b/n, 1 = a − b/n, 2 = interval [a, b), 3 = interval (a, b]. For the
     sequences, tabulate 2000 readings; for an interval, the infimum is the left end and it is attained only when the
     left end is closed. */
  q02: p => {
    if (p.form === 2) return [p.a, 1];
    if (p.form === 3) return [p.a, 0];
    const r = [];
    for (let n = 1; n <= 2000; n++) r.push(p.form === 0 ? p.a + p.b / n : p.a - p.b / n);
    const falling = r[1999] < r[0];                 // readings sink towards a limit they never reach
    return falling ? [p.a, 0] : [Math.min(...r), 1];
  },
  /* ε = k/1000; rods are X/100 metres, track Y metres. Count up n until the inequality holds, in whole numbers. */
  q03: p => {
    let n1 = 1; while (!(n1 * p.k > 1000)) n1++;
    let n2 = 1; while (!(n2 * p.X > 100 * p.Y)) n2++;
    return [n1, n2];
  },
  /* Bounds are A/10 and B/10 mm, tolerance r/10 mm. Try the four sign extremes for the total error; the accepted
     lengths are those x with |x − c| < r/10. Work in tenths of a millimetre, then divide. */
  q04: p => {
    let worst = 0;
    for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) worst = Math.max(worst, Math.abs(s1 * p.A + s2 * p.B));
    return [worst / 10, (10 * p.c - p.r) / 10, (10 * p.c + p.r) / 10];
  },
  /* f(x) = s(x − h)² + k on the open interval (p, q), s = ±1. Sample a fine grid including the two ends (their
     values are the limits that sup/inf reach but never attain) and the vertex x = h. */
  q05: p => {
    const f = x => p.s * (x - p.h) * (x - p.h) + p.k;
    const N = 27720;
    let hi = -Infinity, lo = Infinity;
    const take = x => { const v = f(x); if (v > hi) hi = v; if (v < lo) lo = v; };
    for (let i = 0; i <= N; i++) take(p.p + (p.q - p.p) * i / N);
    if (p.h > p.p && p.h < p.q) take(p.h);
    return [hi, lo].map(v => Math.round(v * 1e9) / 1e9);
  },
  /* Diagonals of sum 2, 3, 4, …, first entry rising inside each. Build the list one pair at a time. */
  q06: p => {
    let pos = 0, found = 0, pa = 0, pb = 0;
    for (let s = 2; found < 2 && s < 400; s++) {
      for (let a = 1; a < s; a++) {
        pos++;
        if (a === p.a && s - a === p.b) { found++; pa = pos; }
        if (pos === p.P) { found++; pb = [a, s - a]; }
      }
    }
    return [pa, pb[0], pb[1]];
  },
  /* x_n = (a n + b) ÷ (c n + d), ε = e/1000. Limit is a/c. Scan n = 1…200000 in exact cross-multiplied integers and
     take one more than the last n that fails |x_n − L| < ε. */
  q07: p => {
    // |x_n − a/c| < ε  <=>  |(b c − a d)| * 1000 < e * c * (c n + d)
    const num = Math.abs(p.b * p.c - p.a * p.d) * 1000;
    let lastBad = 0;
    for (let n = 1; n <= 200000; n++) if (!(num < p.e * p.c * (p.c * n + p.d))) lastBad = n;
    return [p.a / p.c, lastBad + 1];
  },
  /* x_1 = a, x_{n+1} = (x_n + m(d − 1)) ÷ d (the constant is m(d − 1); d is the divisor). Iterate; the limit is
     the value the iteration settles at after 300 steps. */
  q08: p => {
    const c = p.m * (p.d - 1);
    let x = p.a; const xs = [x];
    for (let i = 0; i < 300; i++) { x = (x + c) / p.d; xs.push(x); }
    return [xs[2], xs[300]];
  },
  /* x_n = L + k sin(n) ÷ n^(form+1), ε = e/1000. The squeeze bound k ÷ n^(form+1) < ε is tested in integers
     (1000 k < e n^(form+1)), counting n up from 1. */
  q09: p => {
    const pw = p.form + 1;
    let N = 1; while (!(1000 * p.k < p.e * Math.pow(N, pw))) N++;
    return [p.L, N];
  },
  /* form 0: x_n = a + b(−1)ⁿ + c/n. form 1: x_n = r_(n mod 3) + c/n (r0 for multiples of 3, r1 for 1 more, r2 for 2
     more). Tabulate samples: sup over the first 6000; limsup/liminf from the samples around n = 6·10⁹. */
  q10: p => {
    const x = n => p.form === 0
      ? p.a + p.b * (n % 2 === 0 ? 1 : -1) + p.c / n
      : [p.r0, p.r1, p.r2][n % 3] + p.c / n;
    let sup = -Infinity;
    for (let n = 1; n <= 6000; n++) sup = Math.max(sup, x(n));
    let hi = -Infinity, lo = Infinity;
    for (let n = 6e9; n < 6e9 + 6; n++) { hi = Math.max(hi, x(n)); lo = Math.min(lo, x(n)); }
    return [sup, Math.round(hi * 1e6) / 1e6, Math.round(lo * 1e6) / 1e6];
  },
});
})();
