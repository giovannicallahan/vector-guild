/* Independent oracles for Data and inference learn missions, file b: q11–q20 (game/realms/stats/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Shared helpers, local to this file. */
const rd = (x, k) => Number((x + (x >= 0 ? 1 : -1) * 1e-12).toFixed(k));
const Z = { 90: 1.645, 95: 1.96, 99: 2.576 };                     /* z* values stated in the prompts */
const TCOL = { 90: 0, 95: 1, 99: 2 };
const T = { /* Student's t table, df -> [90%, 95%, 99%]; the prompts print the rows they use */
  5: [2.015, 2.571, 4.032], 6: [1.943, 2.447, 3.707], 7: [1.895, 2.365, 3.499], 8: [1.860, 2.306, 3.355],
  9: [1.833, 2.262, 3.250], 10: [1.812, 2.228, 3.169], 11: [1.796, 2.201, 3.106], 12: [1.782, 2.179, 3.055],
  13: [1.771, 2.160, 3.012], 14: [1.761, 2.145, 2.977], 15: [1.753, 2.131, 2.947], 16: [1.746, 2.120, 2.921],
  17: [1.740, 2.110, 2.898], 18: [1.734, 2.101, 2.878], 19: [1.729, 2.093, 2.861], 20: [1.725, 2.086, 2.845]
};
const tcrit = (df, L) => T[df][TCOL[L]];
/* Tail of the test for each wording, in the order of the generator's list of texts (c is only an index into it):
   0 "holds a mean of v ... suspect less" -> left; 1 "sprout in a mean of v ... take longer" -> right;
   2 "mean length v ... different" -> two; 3 "at least v ... shorter" -> left; 4 "at most v ... longer" -> right;
   5 "mean breaking strength v ... changed in either direction" -> two. */
const TAIL = [1, 2, 3, 1, 2, 3];
Object.assign(window.ORACLE, {
  /* Sample of readings d. Mean from a running total; s from the sum of squares about the mean (n − 1 divisor),
     found with the shortcut Σd² − (Σd)²/n; standard error s/√n. */
  q11: p => {
    let n = 0, sum = 0, sq = 0;
    for (const v of p.d) { n++; sum += v; sq += v * v; }
    const s = Math.sqrt((sq - sum * sum / n) / (n - 1));
    return [sum / n, rd(s, 2), rd(s / Math.sqrt(n), 2)];
  },
  /* n = r² lumps (r is the root of the sample size), sigma known; L is the confidence level in per cent. */
  q12: p => {
    const n = p.r * p.r, se = p.sig / Math.sqrt(n);
    return [rd(se, 2), rd(Z[p.L] * se, 2)];
  },
  /* Interval, then the smallest n for which z*σ/√n ≤ E (E = e10 ÷ 10), found by counting up from 1. */
  q13: p => {
    const n = p.r * p.r, z = Z[p.L], me = z * p.sig / Math.sqrt(n), E = p.e10 / 10;
    let m = 1;
    while (z * p.sig / Math.sqrt(m) > E + 1e-12) m++;
    return [rd(p.xb - me, 2), rd(p.xb + me, 2), m];
  },
  /* N lumps; look the row df = N − 1 up in the table. */
  q14: p => [p.N - 1, tcrit(p.N - 1, p.L)],
  /* s = s10 ÷ 10; t* from the table row df = N − 1. */
  q15: p => {
    const s = p.s10 / 10, me = tcrit(p.N - 1, p.L) * s / Math.sqrt(p.N);
    return [rd(me, 2), rd(p.xb - me, 2), rd(p.xb + me, 2)];
  },
  /* Proportion x of N; the normal curve with z*. */
  q16: p => {
    const ph = p.x / p.N, me = Z[p.L] * Math.sqrt(ph * (1 - ph) / p.N);
    return [rd(ph, 3), rd(me, 3), rd(ph - me, 3), rd(ph + me, 3)];
  },
  /* k is the scenario number and also the right interval: 1 z interval (sample size r², sigma sig), 2 t interval
     (Nt lumps, s = s10 ÷ 10), 3 proportion (x of Np). */
  q17: p => {
    if (p.k === 1) {
      const me = Z[p.L] * p.sig / p.r;
      return [1, rd(p.xb - me, 2), rd(p.xb + me, 2)];
    }
    if (p.k === 2) {
      const me = tcrit(p.Nt - 1, p.L) * (p.s10 / 10) / Math.sqrt(p.Nt);
      return [2, rd(p.xb - me, 2), rd(p.xb + me, 2)];
    }
    const ph = p.x / p.Np, me = Z[p.L] * Math.sqrt(ph * (1 - ph) / p.Np);
    return [3, rd(ph - me, 3), rd(ph + me, 3)];
  },
  /* c is only an index into the generator's list of five wordings (see TAIL); v is the claimed value in H₀. */
  q18: p => [p.v, TAIL[p.c]],
  /* A is α in per cent, B is β in per cent; N tests of true nulls. Count the false alarms as α-fractions of N. */
  q19: p => [rd(1 - p.B / 100, 2), rd(p.N * p.A / 100, 4)],
  /* r is the root of the sample size; d10 is x̄ − μ₀ in tenths of a gram (may be negative). */
  q20: p => {
    const se = p.sig / p.r, diff = p.d10 / 10;
    return [rd(se, 2), rd(diff / se, 2)];
  }
});
})();
