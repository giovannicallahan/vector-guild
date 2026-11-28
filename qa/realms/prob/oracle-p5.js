/* Independent oracles for Probability practice missions, file 5 of 8: q21b–q25d (game/realms/prob/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => Math.round(x * Math.pow(10, d) * (1 + 1e-12)) / Math.pow(10, d);
/* Full binomial table by dynamic programming: row[k] = P(exactly k successes in n trials). */
const binTable = (n, p) => {
  let row = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(row.length + 1).fill(0);
    row.forEach((v, k) => { next[k] += v * (1 - p); next[k + 1] += v * p; });
    row = next;
  }
  return row;
};
/* Moments straight from a table. */
const moments = row => {
  let mean = 0; row.forEach((v, k) => { mean += k * v; });
  let varr = 0; row.forEach((v, k) => { varr += (k - mean) * (k - mean) * v; });
  return { mean, sd: Math.sqrt(varr) };
};
/* Geometric: sum the chances of the first success arriving at each trial up to k, and the mean by a long sum. */
const geoAt = (p, k) => { let alive = 1; for (let i = 1; i < k; i++) alive *= 1 - p; return alive * p; };
const geoMean = p => { let m = 0, alive = 1; for (let i = 1; i < 20000; i++) { m += i * alive * p; alive *= 1 - p; } return m; };
const geoWithin = (p, k) => { let s = 0; for (let i = 1; i <= k; i++) s += geoAt(p, i); return s; };
/* Poisson term by the running ratio P(j) = P(j-1) × λ ÷ j, starting from P(0) = e^(-λ). */
const poisAt = (lam, k) => { let t = Math.exp(-lam); for (let j = 1; j <= k; j++) t = t * lam / j; return t; };
const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
/* Uniform: length of the overlap of [x1, x2] with [y1, y2]. */
const overlap = (x1, x2, y1, y2) => Math.max(0, Math.min(x2, y2) - Math.max(x1, y1));
Object.assign(window.ORACLE, {
  /* q21b: binomial table for n, p; mean and sd from the table; P(at least one) = 1 − P(0 from the table). */
  q21b: p => { const t = binTable(p.n, p.p), m = moments(t); return [rd(m.mean, 6), rd(m.sd, 2), rd(1 - t[0], 4)]; },
  /* q21c: P(all n open) is the top cell of the table; failures are successes with chance 1 − p. */
  q21c: p => {
    const t = binTable(p.n, p.p), f = moments(binTable(p.n, 1 - p.p));
    return [rd(t[p.n], 4), rd(1 - t[p.n], 4), rd(f.mean, 6)];
  },
  /* q21d: search n whose table mean equals m, then moments and P(0) from that table. */
  q21d: p => {
    let n = 1; while (Math.abs(moments(binTable(n, p.p)).mean - p.m) > 1e-9 && n < 5000) n++;
    const t = binTable(n, p.p), s = moments(t);
    return [n, rd(s.sd, 2), rd(1 - t[0], 4)];
  },
  /* q22b: geometric with chance p: the chance first success is trial k, and a long sum for the mean. */
  q22b: p => [rd(geoAt(p.p, p.k), 4), rd(geoMean(p.p), 6)],
  /* q22c: same, then mean cost is the mean seeds times the price c. */
  q22c: p => { const m = geoMean(p.p); return [rd(geoAt(p.p, p.k), 4), rd(m, 6), rd(m * p.c, 6)]; },
  /* q22d: first lit bulb is k; "within k tests" is the sum of the first k terms; mean by a long sum. */
  q22d: p => [rd(geoAt(p.p, p.k), 4), rd(geoWithin(p.p, p.k), 4), rd(geoMean(p.p), 6)],
  /* q23b: kind 1 = fixed n bulbs/cables, exactly k (table cell); kind 2 = first success is trial k. */
  q23b: p => p.kind === 1 ? [1, rd(binTable(p.n, p.p)[p.k], 4)] : [2, rd(geoAt(p.p, p.k), 4)],
  /* q23c: part A binomial cell (n, k, pa); part B geometric (pb, first success at trial m). */
  q23c: p => [rd(binTable(p.n, p.pa)[p.k], 4), rd(geoAt(p.pb, p.m), 4)],
  /* q23d: kind 1 = n cuttings, exactly k, mean from the table; kind 2 = first success at k, mean 1 ÷ p by a long sum. */
  q23d: p => p.kind === 1
    ? [1, rd(binTable(p.n, p.p)[p.k], 4), rd(moments(binTable(p.n, p.p)).mean, 6)]
    : [2, rd(geoAt(p.p, p.k), 4), rd(geoMean(p.p), 6)],
  /* q24b: k! and the Poisson term at k. */
  q24b: p => [fact(p.k), rd(poisAt(p.lam, p.k), 4)],
  /* q24c: λ is rate × watch length; then the Poisson term at k. */
  q24c: p => { let lam = 0; for (let i = 0; i < p.t; i++) lam += p.r; return [rd(lam, 6), rd(poisAt(lam, p.k), 4)]; },
  /* q24d: k!, the Poisson term at k, and 1 minus the term at 0. */
  q24d: p => [fact(p.k), rd(poisAt(p.lam, p.k), 4), rd(1 - poisAt(p.lam, 0), 4)],
  /* q25b: uniform on [a, b]: height 1 ÷ width, and the overlap of (c, d) with the range times the height. */
  q25b: p => { const h = 1 / (p.b - p.a); return [rd(h, 6), rd(overlap(p.c, p.d, p.a, p.b) * h, 6)]; },
  /* q25c: away window [c, d] inside [a, b]; at the desk is the rest; expected count out of N. */
  q25c: p => {
    const w = p.b - p.a, away = overlap(p.c, p.d, p.a, p.b) / w, desk = (w - overlap(p.c, p.d, p.a, p.b)) / w;
    return [rd(away, 6), rd(desk, 6), rd(p.N * desk, 6)];
  },
  /* q25d: windows A = [a+u0, a+u2] and B = [a+u1, a+u3]; P(A or B) by the length of the union found piece by piece. */
  q25d: p => {
    const w = p.b - p.a, A1 = p.a + p.u[0], A2 = p.a + p.u[2], B1 = p.a + p.u[1], B2 = p.a + p.u[3];
    const both = overlap(A1, A2, B1, B2);
    const union = Math.max(A2, B2) - Math.min(A1, B1) - Math.max(0, Math.max(A1, B1) - Math.min(A2, B2));
    return [rd((A2 - A1) / w, 6), rd((B2 - B1) / w, 6), rd(both / w, 6), rd(union / w, 6)];
  },
});
})();
