/* Independent oracles for Data and inference practice missions, file 2 of 8: q06b–q10d (game/realms/stats/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Rounding half away from zero to d places (the tiny nudge keeps 0.125 style ties from slipping below). */
const rnd = (v, d) => { const f = Math.pow(10, d), a = Math.abs(v) * f; return Math.sign(v) * Math.round(a + 1e-7) / f; };
const sum = a => a.reduce((s, v) => s + v, 0);
const asc = a => a.slice().sort((u, v) => u - v);
/* Median of a list by taking it from the sorted order: the middle one, or halfway between the middle two. */
const med = a => { const s = asc(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
/* Quartiles by median of halves: with an odd count the middle reading belongs to neither half. */
const quart = a => { const s = asc(a), n = s.length, h = Math.floor(n / 2); return { q1: med(s.slice(0, h)), q3: med(s.slice(n - h)) }; };
/* Outliers by the 1.5 × IQR fences: the fences and the readings outside them. */
const fences = a => { const { q1, q3 } = quart(a), iqr = q3 - q1; return { iqr, lo: q1 - 1.5 * iqr, hi: q3 + 1.5 * iqr }; };
const outside = (a, f) => a.filter(v => v < f.lo || v > f.hi);
/* Sample standard deviation, by summing the squared gaps from the mean. */
const ssq = a => { const m = sum(a) / a.length; return sum(a.map(v => (v - m) * (v - m))); };
const sd = a => Math.sqrt(ssq(a) / (a.length - 1));
/* The reading farthest from the mean, and the extreme (smallest or largest) that is nearer to it. */
const farthest = a => { const m = sum(a) / a.length; return a.reduce((b, v) => Math.abs(v - m) > Math.abs(b - m) ? v : b, a[0]); };
const nearerEnd = a => { const m = sum(a) / a.length, lo = Math.min(...a), hi = Math.max(...a); return Math.abs(lo - m) < Math.abs(hi - m) ? lo : hi; };
/* Deviation sets for q10d's pilot readings (data only, indexed by the draw's d). */
const DEV5 = [[-7, -3, 1, 4, 5], [-7, -1, 0, 1, 7], [-6, -2, 2, 2, 4], [-5, -5, 0, 5, 5], [-5, -4, -1, 3, 7], [-5, -3, 1, 2, 5], [-5, -2, -1, 3, 5], [-4, -4, 0, 4, 4], [-4, -2, -2, 2, 6], [-4, -1, -1, 3, 3], [-3, -3, 1, 1, 4]];
const DEV6 = [[-7, -2, 0, 3, 3, 3], [-7, -2, 1, 1, 3, 4], [-7, -1, -1, 2, 3, 4], [-6, -4, 1, 3, 3, 3], [-6, -3, -1, 3, 3, 4], [-6, -2, 0, 0, 2, 6], [-5, -5, 1, 2, 3, 4], [-5, -3, -2, 1, 4, 5], [-4, -4, -2, 2, 2, 6], [-4, -3, -2, -1, 5, 5], [-4, -2, -2, -2, 4, 6]];
Object.assign(window.ORACLE, {
  /* q06b: x is the sorted list. IQR, lower fence, count of readings outside either fence. */
  q06b: p => { const f = fences(p.x); return [f.iqr, f.lo, outside(p.x, f).length]; },
  /* q06c: x sorted readings, c = minutes per flagged point. Count, bill, mean of the readings kept. */
  q06c: p => {
    const f = fences(p.x), bad = outside(p.x, f), keep = p.x.filter(v => v >= f.lo && v <= f.hi);
    return [bad.length, bad.length * p.c, sum(keep) / keep.length];
  },
  /* q06d: x in arrival order. IQR, outlier count, median of all, median of the readings kept. */
  q06d: p => {
    const f = fences(p.x), keep = p.x.filter(v => v >= f.lo && v <= f.hi);
    return [f.iqr, p.x.length - keep.length, med(p.x), med(keep)];
  },
  /* q07b: sum of squared deviations, then s² and s to 2 places. */
  q07b: p => { const ss = ssq(p.x), v = ss / (p.x.length - 1); return [rnd(ss, 6), rnd(v, 2), rnd(Math.sqrt(v), 2)]; },
  /* q07c: sample standard deviation of each probe; 1 if A has the smaller one, else 2. */
  q07c: p => { const a = sd(p.a), b = sd(p.b); return [rnd(a, 2), rnd(b, 2), a < b ? 1 : 2]; },
  /* q07d: x is the full log and m is only the position of the smudged reading in it (the other readings are printed
     in order). The stated mean x̄ is the mean of x, so the missing reading is n × x̄ minus the readable sum. */
  q07d: p => {
    const n = p.x.length, mean = sum(p.x) / n, readable = p.x.filter((v, i) => i !== p.m), miss = n * mean - sum(readable);
    const all = readable.concat([miss]), v = ssq(all) / (n - 1);
    return [rnd(miss, 6), rnd(v, 2), rnd(Math.sqrt(v), 2)];
  },
  /* q08b: mean, median, then z of the odd one out (the reading farthest from the mean), using s rounded to 2 places
     as the prompt states. */
  q08b: p => {
    const m = sum(p.x) / p.x.length, s = rnd(sd(p.x), 2);
    return [m, med(p.x), rnd((farthest(p.x) - m) / s, 2)];
  },
  /* q08c: x ridge times, mB and sB the river record, tB the river trip. The ridge trip is the odd one out (the reading
     farthest from the mean). Stranger = larger |z|. */
  q08c: p => {
    const m = sum(p.x) / p.x.length, s = rnd(sd(p.x), 2), t = farthest(p.x);
    const zr = (t - m) / s, zv = (p.tB - p.mB) / p.sB;
    return [m, rnd(zr, 2), rnd(zv, 2), Math.abs(zr) > Math.abs(zv) ? 1 : 2];
  },
  /* q08d: x the leg times; k is the z-score asked for in the last part (a number, not an index). The leg named is the
     one farthest from the mean. */
  q08d: p => {
    const m = sum(p.x) / p.x.length, s = rnd(sd(p.x), 2), t = farthest(p.x);
    return [m - med(p.x), rnd((t - m) / s, 2), rnd(m + p.k * s, 2)];
  },
  /* q09b: three stores of a·f crates each, sample size Σa, so the interval is f; s is the first crate (from 1 to f). */
  q09b: p => {
    const sizes = p.a.map(v => v * p.f), N = sum(sizes), n = N / p.f;
    const strat = sizes.map(z => { for (let k = 0; ; k++) if (k * N >= z * n) return k; });
    let crate = p.s; const list = []; for (; list.length < n; crate += N / n) list.push(crate);
    return [...strat, list[3]];
  },
  /* q09c: blocks of a·f crew, a sample of 100 ÷ f per cent (one in f); x is which block is asked (0 = A, 1 = B, 2 = C);
     s is the first person chosen (from 1 to f). */
  q09c: p => {
    const sizes = p.a.map(v => v * p.f), N = sum(sizes);
    let n = 0; for (let i = 0; i < N; i++) if (i % p.f === 0) n++;
    let k = 0; while (k * N < sizes[p.x] * n) k++;
    const list = []; for (let c = p.s; c <= N; c += p.f) list.push(c);
    return [n, k, list[list.length - 1]];
  },
  /* q09d: four teams of a·f crew, sample Σa; x is which team is asked (0 = team 1); s is the first person (from 1 to f). */
  q09d: p => {
    const sizes = p.a.map(v => v * p.f), N = sum(sizes), n = sum(p.a);
    let k = 0; while (k * N < sizes[p.x] * n) k++;
    const list = []; for (let c = p.s; c <= N; c += p.f) list.push(c);
    return [N, sizes[p.x] / N, k, list[2]];
  },
  /* q10b: g is σ in tenths of a watt (σ = g ÷ 10) and r is the square root of n. */
  q10b: p => { const sigma = p.g / 10, n = p.r * p.r; return [rnd(sigma / Math.sqrt(n), 2), 9 * n]; },
  /* q10c: t is the target standard error, the readings vary by σ = k × t, r0 is the square root of the current n. */
  q10c: p => {
    const sigma = p.k * p.t, n0 = p.r0 * p.r0; let n = 1; while (sigma / Math.sqrt(n) > p.t + 1e-9) n++;
    return [rnd(sigma / Math.sqrt(n0), 2), n, n - n0];
  },
  /* q10d: d indexes a list of ready-made deviation sets (copied below as plain data), flip mirrors the set, m is the
     mean, order says where each deviation sits in the printed list and k = s ÷ target. Everything asked is then worked
     from the printed readings: s by summing squared gaps, the standard error s ÷ r0, and the smallest n by search. */
  q10d: p => {
    const dev = (p.N === 5 ? DEV5 : DEV6)[p.d].map(v => p.flip ? -v : v), x = p.order.map(i => p.m + dev[i]);
    const s = sd(x), target = s / p.k; let n = 1; while (s / Math.sqrt(n) > target + 1e-9) n++;
    return [rnd(s, 6), rnd(s / p.r0, 2), n];
  },
});
})();
