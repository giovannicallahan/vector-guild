/* Independent oracles for Probability practice missions, file 8 of 8: q36b–q40d (game/realms/prob/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100 + (x < 0 ? -1e-7 : 1e-7)) / 100;
const r4 = x => Math.round(x * 10000 + (x < 0 ? -1e-6 : 1e-6)) / 10000;
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Standard normal area to the left of z, by Simpson's rule on the bell curve (no erf), then read to 4 places like the table. */
const area0 = z => { const n = 400, h = z / n, f = t => Math.exp(-t * t / 2) / Math.sqrt(2 * Math.PI);
  let s = f(0) + f(z); for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
const cache = {};
const left = z => { const k = Math.round(z * 100); return k in cache ? cache[k] : (cache[k] = r4(0.5 + area0(k / 100))); };
const right = z => r4(1 - left(z));
/* Smallest whole n whose standard error sigma / sqrt(n) is at most `limit`. */
const smallestN = (sigma, limit) => { let n = 1; while (sigma / Math.sqrt(n) > limit + 1e-9) n++; return n; };
/* The count of trials n and the chance p are the parameters nn and pr, as the prompts print them. */
Object.assign(window.ORACLE, {
  /* q36b: c independent valves each with variance v: add the variances, root the total. */
  q36b: p => { let tot = 0; for (let i = 0; i < p.c; i++) tot += p.v; return [tot, r2(Math.sqrt(tot))]; },
  /* q36c: c pods with standard deviation s (variance s²) plus one radio with standard deviation r. */
  q36c: p => { let tot = 0; for (let i = 0; i < p.c; i++) tot += p.s * p.s; tot += p.r * p.r; return [r6(tot), r2(Math.sqrt(tot))]; },
  /* q36d: a pods and b cells: means add, variances add. */
  q36d: p => { let mean = 0, v = 0;
    for (let i = 0; i < p.a; i++) { mean += p.m1; v += p.s1 * p.s1; }
    for (let i = 0; i < p.b; i++) { mean += p.m2; v += p.s2 * p.s2; }
    return [r6(mean), r6(v), r2(Math.sqrt(v))]; },
  /* q37b: standard error s / sqrt(c); then the n whose standard error equals s ÷ m (the prompt's target), found by search. */
  q37b: p => { let n = 1; while (p.s / Math.sqrt(n) > p.s / p.m + 1e-9) n++;
    return [r2(p.s / Math.sqrt(p.c)), n]; },
  /* q37c: sd of the total, standard error of the mean, then the smallest n whose standard error is a third of that. */
  q37c: p => [r2(Math.sqrt(p.c * p.s * p.s)), r2(p.s / Math.sqrt(p.c)), smallestN(p.s, p.s / Math.sqrt(p.c) / 3)],
  /* q37d: sigma² = v; the target standard error is k ÷ 100 hPa. */
  q37d: p => { const sg = Math.sqrt(p.v); return [r2(Math.sqrt(p.v / p.c)), smallestN(sg, p.k / 100)]; },
  /* q38b: n = r² days, threshold mu - e/10. */
  q38b: p => { const n = p.r * p.r, se = p.s / Math.sqrt(n), x = p.mu - p.e / 10, z = r2((x - p.mu) / se);
    return [r6(se), z, left(z)]; },
  /* q38c: n = r² days, limits mu - ea/10 and mu + eb/10. */
  q38c: p => { const n = p.r * p.r, se = p.s / Math.sqrt(n);
    const za = r2((p.mu - p.ea / 10 - p.mu) / se), zb = r2((p.mu + p.eb / 10 - p.mu) / se);
    return [za, zb, r4(left(zb) - left(za))]; },
  /* q38d: scan the table rows (steps of 0.01) for the area closest to k ÷ 100, then c = mu + z · se. */
  q38d: p => { const se = p.s / p.r, target = p.k / 100; let best = -4, gap = 9;
    for (let z = -400; z <= 400; z++) { const g = Math.abs(left(z / 100) - target); if (g < gap - 1e-12) { gap = g; best = z / 100; } }
    return [best, r2(p.mu + best * se)]; },
  /* q39b: P(X <= k) with the cut-off k + 0.5. */
  q39b: p => { const n = p.nn, pr = p.pr, mu = n * pr, sd = Math.sqrt(n * pr * (1 - pr)), z = r2((p.k + 0.5 - mu) / sd);
    return [r6(mu), z, left(z)]; },
  /* q39c: P(a <= X <= b) with cut-offs a - 0.5 and b + 0.5. */
  q39c: p => { const n = p.nn, pr = p.pr, mu = n * pr, sd = Math.sqrt(n * pr * (1 - pr));
    const za = r2((p.a - 0.5 - mu) / sd), zb = r2((p.b + 0.5 - mu) / sd);
    return [za, zb, r4(left(zb) - left(za))]; },
  /* q39d: P(X > k) = P(X >= k + 1), cut-off k + 0.5, upper tail. */
  q39d: p => { const n = p.nn, pr = p.pr, mu = n * pr, sd = Math.sqrt(n * pr * (1 - pr)), z = r2((p.k + 0.5 - mu) / sd);
    return [z, right(z)]; },
  /* q40b: standard error with the claimed p; z of k ÷ n; tail on the side the sample lies. */
  q40b: p => { const n = p.nn, pr = p.pr, se = Math.sqrt(pr * (1 - pr) / n), z = r2((p.k / n - pr) / se);
    return [r6(se), z, z < 0 ? left(z) : right(z)]; },
  /* q40c: n = r² readings, sample mean mu + e/10; the tail is on the side of the sample mean. */
  q40c: p => { const n = p.r * p.r, se = p.s / Math.sqrt(n), z = r2((p.e / 10) / se), t = z < 0 ? left(z) : right(z);
    return [z, t, t < 0.05 ? 1 : 0]; },
  /* q40d: way one on the proportion, way two on the count with the continuity correction P(X >= k). */
  q40d: p => { const n = p.nn, pr = p.pr, q = 1 - pr, hat = p.k / n;
    const z1 = r2((hat - pr) / Math.sqrt(pr * q / n)), t1 = z1 < 0 ? left(z1) : right(z1);
    const z2 = r2((p.k - 0.5 - n * pr) / Math.sqrt(n * pr * q)), t2 = right(z2);
    return [z1, t1, z2, t2]; },
});
})();
