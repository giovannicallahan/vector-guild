/* Independent oracles for Data and inference learn missions, file a: q01–q10 (game/realms/stats/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  const r2 = x => Math.round(x * 100 + 1e-9 * Math.sign(x)) / 100;
  const med = a => { const n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; };
  const quart = a => { const n = a.length, h = Math.floor(n / 2); return [med(a.slice(0, h)), med(a.slice(n - h))]; };
Object.assign(window.ORACLE, {
  /* c = frequencies of the classes 0..4 (k is the class value). Build the whole log day by day, then count. */
  q01: p => {
    const log = [];
    p.c.forEach((f, v) => { for (let i = 0; i < f; i++) log.push(v); });
    const n = log.length;
    return [log.filter(v => v === p.k).length / n, log.filter(v => v <= p.k).length / n];
  },
  /* x = the readings. Add them one at a time. */
  q02: p => {
    let t = 0, n = 0;
    for (const v of p.x) { t += v; n++; }
    return [t, t / n];
  },
  /* x = the counts in the order met. Sort, take the middle, tally for the mode. */
  q03: p => {
    const s = p.x.slice().sort((a, b) => a - b), n = s.length;
    const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    const tally = new Map();
    s.forEach(v => tally.set(v, (tally.get(v) || 0) + 1));
    let mode = null, best = 0;
    tally.forEach((c, v) => { if (c > best) { best = c; mode = v; } });
    return [med, mode];
  },
  /* s = the first crew size (sizes run s, s+1, s+2, s+3); f = runs for each size. Expand to one entry per run. */
  q04: p => {
    const runs = [];
    p.f.forEach((f, i) => { for (let j = 0; j < f; j++) runs.push(p.s + i); });
    const total = runs.reduce((a, b) => a + b, 0);
    return [runs.length, total, total / runs.length];
  },
  /* x = sorted readings. Median of halves; the median of an odd-sized list is left out of both halves. */
  q05: p => {
    const q = quart(p.x);
    return [q[0], q[1]];
  },
  /* x = sorted times. IQR, upper fence, and a count of readings outside both fences. */
  q06: p => {
    const [q1, q3] = quart(p.x), iqr = q3 - q1;
    const lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
    return [iqr, hi, p.x.filter(v => v < lo || v > hi).length];
  },
  /* x = the depths. Sum of squared gaps from the mean over n - 1, then its root, each to 2 decimal places. */
  q07: p => {
    const n = p.x.length, m = p.x.reduce((a, b) => a + b, 0) / n;
    let ss = 0;
    p.x.forEach(v => { ss += (v - m) * (v - m); });
    const v = ss / (n - 1);
    return [r2(v), r2(Math.sqrt(v))];
  },
  /* x = the walk times. The z-score is for the trip farthest from the mean (the one named in the prompt), using s
     rounded to 2 decimal places as the prompt states. */
  q08: p => {
    const n = p.x.length, m = p.x.reduce((a, b) => a + b, 0) / n;
    const s = r2(Math.sqrt(p.x.reduce((a, v) => a + (v - m) * (v - m), 0) / (n - 1)));
    const sorted = p.x.slice().sort((a, b) => a - b);
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const far = p.x.reduce((b, v) => Math.abs(v - m) > Math.abs(b - m) ? v : b, p.x[0]);
    return [m - med, r2((far - m) / s)];
  },
  /* a = the stratum shares in the sample; f = people each sampled person stands for (so a dome has a_i × f people,
     the whole crew N = f × n). s = the first person chosen; steps are f apart. List the whole crew and pick. */
  q09: p => {
    const n = p.a.reduce((x, y) => x + y, 0), N = n * p.f;
    const dome = [];
    p.a.forEach((a, i) => { for (let j = 0; j < a * p.f; j++) dome.push(i); });
    const picks = [];
    for (let id = p.s; id <= N; id += p.f) picks.push(id);
    const strat = p.a.map((a, i) => dome.filter(d => d === i).length * n / N);
    return strat.concat([picks[2]]);
  },
  /* g = σ in tenths (74 means 7.4); r = √n (so n = r²). Halving the standard error needs a sample four times as big. */
  q10: p => {
    const n = p.r * p.r;
    const se = Math.round(1000 * p.g / 10 / Math.sqrt(n)) / 1000;
    let m = n;
    while (p.g / 10 / Math.sqrt(m) > p.g / 10 / Math.sqrt(n) / 2 + 1e-12) m++;
    return [Math.round(p.g * 10 / p.r) / 100, m];
  },
});
})();
