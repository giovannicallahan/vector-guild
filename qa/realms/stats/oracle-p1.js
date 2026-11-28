/* Independent oracles for Data and inference practice missions, file 1 of 8: q01b–q05d (game/realms/stats/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Write a frequency table out as a long list, one entry per observation (values v[i] repeated f[i] times). */
const expand = (v, f) => { const out = []; v.forEach((val, i) => { for (let n = 0; n < f[i]; n++) out.push(val); }); return out; };
const sum = a => a.reduce((s, x) => s + x, 0);
const sorted = a => a.slice().sort((a, b) => a - b);
/* Median of any list by position: sort, then take the middle one or the two middle ones. */
const median = a => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
/* Mode: the value with the most copies, found by counting each distinct value (the prompts are built to have one). */
const mode = a => { let best = null, top = 0; for (const x of new Set(a)) { const c = a.filter(y => y === x).length; if (c > top) { top = c; best = x; } } return best; };
/* Median-of-halves quartiles: with an odd count the median goes in neither half. */
const quartiles = a => {
  const s = sorted(a), n = s.length, h = Math.floor(n / 2);
  return { q1: median(s.slice(0, h)), q3: median(s.slice(n - h)) };
};
Object.assign(window.ORACLE, {
  /* q01b: classes 0..5 with frequencies p.c. p.k and p.j are classes (values) of the table. */
  q01b: p => {
    const all = expand([0, 1, 2, 3, 4, 5], p.c), N = all.length;
    return [N, all.filter(x => x === p.k).length / N, all.filter(x => x <= p.j).length / N];
  },
  /* q01c: classes 0..4; busy = value p.k or more; then scale the share to the next 200 days. */
  q01c: p => {
    const all = expand([0, 1, 2, 3, 4], p.c), share = all.filter(x => x >= p.k).length / all.length;
    return [share, share * 200];
  },
  /* q01d: classes 0..5; p.N is the stated total; p.m is the value of the smudged class (its entry in p.c is the true
     frequency, never read: it is found from the total); p.j is the value the cumulative count runs up to. */
  q01d: p => {
    let others = 0; p.c.forEach((x, i) => { if (i !== p.m) others += x; });
    const missing = p.N - others, f = p.c.map((x, i) => (i === p.m ? missing : x));
    return [missing, missing / p.N, sum(f.filter((x, i) => i <= p.j)) / p.N];
  },
  /* q02b: total and mean of the listed cycle lengths. */
  q02b: p => [sum(p.x), sum(p.x) / p.x.length],
  /* q02c: sample mean, then scale to all p.M plots. */
  q02c: p => { const m = sum(p.x) / p.x.length; return [m, m * p.M]; },
  /* q02d: p.x holds the 8 known readings, so the 9 readings of the prompt are those plus the lost one (count = length + 1). */
  q02d: p => { const n = p.x.length + 1, total = p.m * n; return [total, total - sum(p.x)]; },
  /* q03b: mode and median of the waits. */
  q03b: p => [mode(p.x), median(p.x)],
  /* q03c: median, mean, and the gap between them. */
  q03c: p => { const m = sum(p.x) / p.x.length, md = median(p.x); return [md, m, m - md]; },
  /* q03d: p.v holds the lifetimes in tenths of an hour (44 means 4.4 h); work in tenths, convert at the end. */
  q03d: p => [median(p.v) / 10, mode(p.v) / 10, sum(p.v) / p.v.length / 10],
  /* q04b: p.s is the first number of containers and the table runs s, s+1, ... with frequencies p.f. */
  q04b: p => {
    const trips = expand(p.f.map((_, i) => p.s + i), p.f);
    return [trips.length, sum(trips), sum(trips) / trips.length];
  },
  /* q04c: p.s is the first number of beds in use, then consecutive; the clinic has 8 beds. */
  q04c: p => {
    const checks = expand(p.f.map((_, i) => p.s + i), p.f), m = sum(checks) / checks.length;
    return [m, 8 - m];
  },
  /* q04d: waits p.v with patient counts p.f; list every patient, then mean and median of that list. */
  q04d: p => { const all = expand(p.v, p.f); return [sum(all) / all.length, median(all)]; },
  /* q05b: median and quartiles of the turnaround times. */
  q05b: p => { const q = quartiles(p.x); return [median(p.x), q.q1, q.q3]; },
  /* q05c: quartiles, then count the days strictly outside them. */
  q05c: p => {
    const q = quartiles(p.x);
    return [q.q1, q.q3, p.x.filter(x => x < q.q1).length, p.x.filter(x => x > q.q3).length];
  },
  /* q05d: p.v holds the readings in tenths of a kPa (27 means 2.7); quartiles and mean in tenths, converted at the end. */
  q05d: p => { const q = quartiles(p.v); return [q.q1 / 10, q.q3 / 10, sum(p.v) / p.v.length / 10]; },
});
})();
