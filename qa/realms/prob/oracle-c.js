/* Independent oracles for Probability learn missions, file c: q21–q30 (game/realms/prob/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r4 = x => Math.round(x * 1e4) / 1e4;
/* Reference value e^(−t) as the prompt prints it: a series sum, rounded to 4 decimal places. */
const expNeg = t => { let term = 1, sum = 1; for (let i = 1; i < 80; i++) { term *= -t / i; sum += term; } return r4(sum); };
Object.assign(window.ORACLE, {
  /* X ~ Bin(n, p). Build the whole distribution by Pascal's triangle, then take the mean and variance straight from
     the probabilities; P(at least one) is the sum of every outcome except zero sprouts. */
  q21: p => {
    const q = 1 - p.p;
    let row = [1];
    for (let i = 0; i < p.n; i++) { const nx = [1]; for (let j = 1; j < row.length; j++) nx.push(row[j - 1] + row[j]); nx.push(1); row = nx; }
    const pk = row.map((c, k) => c * Math.pow(p.p, k) * Math.pow(q, p.n - k));
    const mean = pk.reduce((s, x, k) => s + k * x, 0);
    const vr = pk.reduce((s, x, k) => s + (k - mean) * (k - mean) * x, 0);
    const atLeast = pk.slice(1).reduce((s, x) => s + x, 0);
    return [Math.round(mean * 1e6) / 1e6, Math.round(Math.sqrt(vr) * 100) / 100, r4(atLeast)];
  },
  /* First success on trial k: sum the chance over all sequences with that shape (only one). The mean is the sum
     of k × P(first success on k) over a very long run of trials. */
  q22: p => {
    let fail = 1, mean = 0, atK = 0;
    for (let t = 1; t <= 4000; t++) { const pt = fail * p.p; if (t === p.k) atK = pt; mean += t * pt; fail *= 1 - p.p; }
    return [r4(atK), Math.round(mean * 1e6) / 1e6];
  },
  /* kind 1: n fixed trials, exactly k successes; the number of orders comes from Pascal's triangle.
     kind 2: first success on trial k (the draw stores k as the seed number). */
  q23: p => {
    const q = 1 - p.p;
    if (p.kind === 2) return [2, r4(Math.pow(q, p.k - 1) * p.p)];
    let row = [1];
    for (let i = 0; i < p.n; i++) { const nx = [1]; for (let j = 1; j < row.length; j++) nx.push(row[j - 1] + row[j]); nx.push(1); row = nx; }
    return [1, r4(row[p.k] * Math.pow(p.p, p.k) * Math.pow(q, p.n - p.k))];
  },
  /* Poisson: k! by a loop, e^(−λ) as printed in the prompt (4 decimal places), then λ^k e^(−λ) ÷ k!. */
  q24: p => {
    let f = 1; for (let i = 2; i <= p.k; i++) f *= i;
    let pw = 1; for (let i = 0; i < p.k; i++) pw *= p.lam;
    return [f, r4(pw * expNeg(p.lam) / f)];
  },
  /* Uniform on [a, b]: the density is the height that gives area 1; the probability is the strip's area. */
  q25: p => [1 / (p.b - p.a), (p.d - p.c) / (p.b - p.a)],
  /* Uniform on [a, b]. Mean: halfway. Percentile: a fraction k/100 of the way along. Conditional: once X is known to
     be above d the remaining range is [d, b], and the part above c is a share of it. */
  q26: p => [(p.a + p.b) / 2, p.a + (p.k / 100) * (p.b - p.a), (p.b - p.c) / (p.b - p.d)],
  /* Exponential: P(fail within x) = 1 − e^(−mx) with e^(−mx) as printed; mean lifetime is 1 ÷ m. */
  q27: p => [r4(1 - expNeg(p.m * p.x)), Math.round(1e6 / p.m) / 1e6],
  /* Memoryless exponential, using the three reference values the prompt prints: e^(−m(a+b)) for the first answer,
     and the ratio e^(−m(a+b)) ÷ e^(−ma) for the second. */
  q28: p => [expNeg(p.m * (p.a + p.b)), r4(expNeg(p.m * (p.a + p.b)) / expNeg(p.m * p.a))],
  /* The model number comes from the draw's kind. 1: Poisson λ^k e^(−λ) ÷ k! (e^(−λ) as printed).
     2: uniform on [a, b], chance of the strip c..d. 3: exponential, P(fail within x) = 1 − e^(−mx). */
  q29: p => {
    if (p.kind === 1) {
      let f = 1; for (let i = 2; i <= p.k; i++) f *= i;
      return [1, r4(Math.pow(p.lam, p.k) * expNeg(p.lam) / f)];
    }
    if (p.kind === 2) return [2, r4((p.d - p.c) / (p.b - p.a))];
    return [3, r4(1 - expNeg(p.m * p.x))];
  },
  /* Empirical rule: walk the bands between the two lengths. Each one-sigma band has its stated share:
     0–1σ 34%, 1–2σ 13.5%, 2–3σ 2.35% (both sides alike). */
  q30: p => {
    const lo = Math.round((p.i * p.s) / p.s), hi = Math.round((p.j * p.s) / p.s);
    const share = [34, 13.5, 2.35];
    let total = 0;
    for (let k = lo; k < hi; k++) total += share[(k >= 0 ? k : -k - 1)];
    return [lo, hi, Math.round(total * 100) / 100];
  },
});
})();
