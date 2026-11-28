/* Independent oracles for Probability learn missions, file d: q31–q40 (game/realms/prob/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  /* Helpers. Phi is the standard normal area to the left of z, found by Simpson's rule on the bell curve from
     −9 to z (no formulas for the area, no game code). rd rounds to d places; the small nudge stops a value such as
     1.005 sliding down. A "table row" is Phi(z) rounded to 4 places, which is what the prompts print. */
  const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + Math.sign(x) * 1e-9) / f; };
  const phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const Phi = z => {
    if (z < -9) return 0;
    const n = 1000, h = (z + 9) / n;
    let s = phi(-9) + phi(z);
    for (let i = 1; i < n; i++) s += phi(-9 + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  };
  const memo = {};
  const row = z => { const k = rd(z, 2); return k in memo ? memo[k] : (memo[k] = rd(Phi(k), 4)); };
  /* Tail on the same side as z: left area if z is negative, 1 − left area if positive, taken from table rows. */
  const tail = z => z < 0 ? row(z) : rd(1 - row(z), 4);
Object.assign(window.ORACLE, {
  /* σ = sh/100 mm; the bolt is d/100 mm from the mean; the second z is w/10. Rebuild both from the hundredths. */
  q31: p => {
    const sigma = p.sh / 100, dist = p.d / 100, z2 = p.w / 10;
    return [rd(dist / sigma, 2), rd(p.mu + z2 * sigma, 6)];
  },
  /* x = μ + σ·(h/100): the bolt sits h hundredths of a standard deviation from the mean. z is read back from x,
     then the table row at z is the area. */
  q32: p => {
    const x = p.mu + p.s * p.h / 100;
    const z = rd((x - p.mu) / p.s, 2);
    return [z, row(z)];
  },
  /* Both limits sit ha/100 and hb/100 standard deviations from the mean; the area between is the difference of
     two table rows. */
  q33: p => {
    const a = p.mu + p.s * p.ha / 100, b = p.mu + p.s * p.hb / 100;
    const za = rd((a - p.mu) / p.s, 2), zb = rd((b - p.mu) / p.s, 2);
    return [za, zb, rd(row(zb) - row(za), 4)];
  },
  /* Search the z grid in steps of 0.01 for the row whose area is closest to k%, then x = μ + zσ to 1 place. */
  q34: p => {
    let best = null, bd = Infinity;
    for (let c = -400; c <= 400; c++) {
      const d = Math.abs(row(c / 100) - p.k / 100);
      if (d < bd - 1e-12) { bd = d; best = c / 100; }
    }
    return [best, rd(p.mu + best * p.s, 1)];
  },
  /* Means add: add the pod mean c times, then the radio. */
  q35: p => {
    let pods = 0;
    for (let i = 0; i < p.c; i++) pods += p.mu;
    return [pods, pods + p.r];
  },
  /* Independent variances add: c copies of s², then the square root, to 2 places. */
  q36: p => {
    let v = 0;
    for (let i = 0; i < p.c; i++) v += p.s * p.s;
    return [v, rd(Math.sqrt(v), 2)];
  },
  /* Standard error s/√c. Halving it: search for the smallest n whose error is no more than half the first. */
  q37: p => {
    const se = n => p.s / Math.sqrt(n);
    let n = p.c;
    while (se(n) > se(p.c) / 2 + 1e-9) n++;
    return [rd(se(p.c), 2), n];
  },
  /* Sample mean of r² days: standard error s/r; the cut-off sits e/10 above μ. P(X̄ > c) = 1 − table row. */
  q38: p => {
    const c = p.mu + p.e / 10, n = p.r * p.r;
    const z = rd((c - p.mu) / (p.s / Math.sqrt(n)), 2);
    return [z, rd(1 - row(z), 4)];
  },
  /* Binomial mean np, sd √(npq); "at least k" starts at k − 0.5; the answer is 1 − table row. */
  q39: p => {
    const pr = p.pr, n = p.nn;
    const mean = n * pr, sd = Math.sqrt(n * pr * (1 - pr));
    const z = rd((p.k - 0.5 - mean) / sd, 2);
    return [z, rd(1 - row(z), 4)];
  },
  /* kind 1: mean of r² readings sitting e/10 from μ. kind 2: sample proportion k ÷ n against the share p. In both,
     z is rounded and the tail on the same side as z comes from the table row. */
  q40: p => {
    let z;
    if (p.kind === 2) {
      const pr = p.pr, n = p.nn;
      z = rd((p.k / n - pr) / Math.sqrt(pr * (1 - pr) / n), 2);
    } else {
      const xbar = p.mu + p.e / 10, n = p.r * p.r;
      z = rd((xbar - p.mu) / (p.s / Math.sqrt(n)), 2);
    }
    return [z, tail(z)];
  },
});
})();
