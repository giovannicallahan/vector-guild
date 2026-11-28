/* Independent oracles for Data and inference practice missions, file 3 of 8: q11b–q15d (game/realms/stats/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round((x + 1e-9) * 100) / 100;
const r3 = x => Math.round((x + 1e-9) * 1000) / 1000;
const ZSTAR = { 90: 1.645, 95: 1.96, 99: 2.576 };   /* the list printed in every prompt */
/* Standard two-sided t table (df -> [90%, 95%, 99%]); the prompts print the rows they need. */
const TTAB = { 1: [6.314, 12.706, 63.657], 2: [2.920, 4.303, 9.925], 3: [2.353, 3.182, 5.841], 4: [2.132, 2.776, 4.604],
  5: [2.015, 2.571, 4.032], 6: [1.943, 2.447, 3.707], 7: [1.895, 2.365, 3.499], 8: [1.860, 2.306, 3.355],
  9: [1.833, 2.262, 3.250], 10: [1.812, 2.228, 3.169], 11: [1.796, 2.201, 3.106], 12: [1.782, 2.179, 3.055],
  13: [1.771, 2.160, 3.012], 14: [1.761, 2.145, 2.977], 15: [1.753, 2.131, 2.947], 16: [1.746, 2.120, 2.921],
  17: [1.740, 2.110, 2.898], 18: [1.734, 2.101, 2.878], 19: [1.729, 2.093, 2.861], 20: [1.725, 2.086, 2.845],
  21: [1.721, 2.080, 2.831], 22: [1.717, 2.074, 2.819], 23: [1.714, 2.069, 2.807], 24: [1.711, 2.064, 2.797],
  25: [1.708, 2.060, 2.787], 26: [1.706, 2.056, 2.779], 27: [1.703, 2.052, 2.771], 28: [1.701, 2.048, 2.763],
  29: [1.699, 2.045, 2.756], 30: [1.697, 2.042, 2.750] };
const tOf = (df, level) => TTAB[df][level === 90 ? 0 : level === 95 ? 1 : 2];
/* Sample mean and sample standard deviation straight from the readings (divide by n - 1). */
const stats = d => {
  let sum = 0; for (const v of d) sum += v;
  const mean = sum / d.length; let ss = 0; for (const v of d) ss += (v - mean) * (v - mean);
  return { mean, ss, s: Math.sqrt(ss / (d.length - 1)) };
};
/* Smallest whole n whose margin z* sigma / sqrt(n) is at most e (found by counting up). */
const smallestN = (z, sigma, e) => { let n = 1; while (z * sigma / Math.sqrt(n) > e + 1e-12) n++; return n; };
/* Smallest n for which the standard error / margin has dropped to half of its value at n0 (counting up). */
const halfAt = n0 => { let n = 1; while (1 / Math.sqrt(n) > 0.5 / Math.sqrt(n0) + 1e-12) n++; return n; };
Object.assign(window.ORACLE, {
  /* q11b: readings in p.d. */
  q11b: p => { const t = stats(p.d); return [r2(t.mean), r2(t.s), r2(t.s / Math.sqrt(p.d.length))]; },
  /* q11c: k samples, total k*m mm (m is the mean), ss = sum of squared distances. */
  q11c: p => { const s = Math.sqrt(p.ss / (p.k - 1)); return [p.m, r2(s), r2(s / Math.sqrt(p.k))]; },
  /* q11d: k cores; mt is the mean in tenths of a cm and dv the distances from it in tenths: reading = (mt + dv) / 10. */
  q11d: p => {
    const d = p.dv.map(v => (p.mt + v) / 10), t = stats(d);
    return [r2(t.mean), r2(t.s), r2(t.s / Math.sqrt(p.k)), halfAt(p.k)];
  },
  /* q12b: n = r², sigma = sig, level L (percent). */
  q12b: p => { const n = p.r * p.r, se = p.sig / Math.sqrt(n); return [r2(se), r2(ZSTAR[p.L] * se)]; },
  /* q12c: n = r²; lv is an index into the pair of levels the prompt names (lv 0: 90 and 95, lv 1: 95 and 99, lv 2: 90 and 99). */
  q12c: p => {
    const pair = [[90, 95], [95, 99], [90, 99]][p.lv], lo = pair[0], hi = pair[1], se = p.sig / Math.sqrt(p.r * p.r);
    const a = r2(ZSTAR[lo] * se), b = r2(ZSTAR[hi] * se);
    return [a, b, r2(b - a)];
  },
  /* q12d: sigma = s10 / 10, n = N, level L. New margin = half of the quoted (2 dp) margin. */
  q12d: p => {
    const sigma = p.s10 / 10, m = ZSTAR[p.L] * sigma / Math.sqrt(p.N), n2 = halfAt(p.N);
    return [r2(m), n2, r2(ZSTAR[p.L] * sigma / Math.sqrt(n2))];
  },
  /* q13b: n = r², e10 is the wanted margin in tenths. */
  q13b: p => {
    const z = ZSTAR[p.L], m = z * p.sig / p.r;
    return [r2(p.xb - m), r2(p.xb + m), smallestN(z, p.sig, p.e10 / 10)];
  },
  /* q13c: n = r², e10 wanted margin in tenths, c credits per lump. */
  q13c: p => {
    const z = ZSTAR[p.L], n = smallestN(z, p.sig, p.e10 / 10);
    return [r2(p.xb - z * p.sig / p.r), n, (n - p.r * p.r) * p.c];
  },
  /* q13d: readings d, sigma = sig, e10 wanted margin in tenths. (r only fixes how many readings the draw has.) */
  q13d: p => {
    const z = ZSTAR[p.L], t = stats(p.d), m = z * p.sig / Math.sqrt(p.d.length);
    return [r2(t.mean), r2(t.mean - m), r2(t.mean + m), smallestN(z, p.sig, p.e10 / 10)];
  },
  /* q14b: df = N - 1, read from the table printed. */
  q14b: p => [p.N - 1, tOf(p.N - 1, p.L)],
  /* q14c: df N - 1 now, N + x - 1 after. */
  q14c: p => { const a = tOf(p.N - 1, p.L), b = tOf(p.N + p.x - 1, p.L); return [a, b, r3(a - b)]; },
  /* q14d: pooled sample of a + b lumps. */
  q14d: p => { const df = p.a + p.b - 1, t = tOf(df, p.L); return [df, t, r3(t - ZSTAR[p.L])]; },
  /* q15b: s = s10 / 10, n = N, df = N - 1. */
  q15b: p => {
    const m = tOf(p.N - 1, p.L) * (p.s10 / 10) / Math.sqrt(p.N);
    return [r2(m), r2(p.xb - m), r2(p.xb + m)];
  },
  /* q15c: s = s10 / 10, n = N. k is only an index: the crew's minimum is k whole units below the whole-number part of the
     rounded lower bound (the prompt prints the minimum; the parameters do not carry it). */
  q15c: p => {
    const m = tOf(p.N - 1, p.L) * (p.s10 / 10) / Math.sqrt(p.N), lo = p.xb - m;
    const min = Math.floor(r2(lo)) - p.k;
    return [r2(m), r2(lo), r2(r2(lo) - min)];
  },
  /* q15d: readings are m + dv; n = N. */
  q15d: p => {
    const d = p.dv.map(v => p.m + v), t = stats(d), m = tOf(p.N - 1, p.L) * t.s / Math.sqrt(d.length);
    return [r2(t.s), r2(m), r2(t.mean - m), r2(t.mean + m)];
  },
});
})();
