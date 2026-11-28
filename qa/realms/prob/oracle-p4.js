/* Independent oracles for Probability practice missions, file 4 of 8: q16b–q20d (game/realms/prob/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rnd = (x, d) => { const m = Math.pow(10, d); return Math.round(x * m + 1e-9 * Math.sign(x)) / m; };
/* Mean and variance of a table of (value, probability) rows, the variance by the definition: sum of P x (x - mean)^2. */
const tableStats = (xs, ps) => {
  let mean = 0; for (let i = 0; i < xs.length; i++) mean += xs[i] * ps[i];
  let v = 0; for (let i = 0; i < xs.length; i++) v += ps[i] * (xs[i] - mean) * (xs[i] - mean);
  return { mean, v, sd: Math.sqrt(v) };
};
const pct = list => list.map(x => x / 100);
/* Probability of one exact S/F pattern, one trial at a time: S costs q, F costs 1 - q. */
const patternProb = (pat, qs) => { let t = 1; for (let i = 0; i < pat.length; i++) t *= pat[i] === 'S' ? qs[i] : 1 - qs[i]; return t; };
/* Count the arrangements of k Cs among n places by running through every bit pattern, optionally with the first and last places fixed. */
const countOrders = (n, k, first, last) => {
  let c = 0;
  for (let m = 0; m < (1 << n); m++) {
    let ones = 0; for (let i = 0; i < n; i++) if (m & (1 << i)) ones++;
    if (ones !== k) continue;
    if (first !== undefined && !!(m & 1) !== first) continue;
    if (last !== undefined && !!(m & (1 << (n - 1))) !== last) continue;
    c++;
  }
  return c;
};
/* P(X = k) for n independent trials: add the probability of every pattern with exactly k successes. */
const binomByPatterns = (n, k, p) => {
  let total = 0;
  for (let m = 0; m < (1 << n); m++) {
    let ones = 0, pr = 1;
    for (let i = 0; i < n; i++) { if (m & (1 << i)) { ones++; pr *= p; } else pr *= 1 - p; }
    if (ones === k) total += pr;
  }
  return total;
};
const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
Object.assign(window.ORACLE, {
  /* q16b: beds 0..3 with the given percentages. */
  q16b: p => { const s = tableStats([0, 1, 2, 3], pct(p.p)); return [rnd(s.v, 6), rnd(s.sd, 2)]; },
  /* q16c: medics 1..5; sigma and mean + sigma. */
  q16c: p => { const s = tableStats([1, 2, 3, 4, 5], pct(p.p)); return [rnd(s.sd, 2), rnd(s.mean + s.sd, 2)]; },
  /* q16d: cylinders 0, 2, 4, 6. */
  q16d: p => { const s = tableStats([0, 2, 4, 6], pct(p.p)); return [rnd(s.mean, 6), rnd(s.v, 2), rnd(s.sd, 2)]; },
  /* q17b: N envelopes at price c; a hold A and b hold B. */
  q17b: p => {
    const barrel = []; for (let i = 0; i < p.N; i++) barrel.push(i < p.a ? p.A : i < p.a + p.b ? p.B : 0);
    let sum = 0; for (const v of barrel) sum += v;
    const prize = sum / p.N;
    return [rnd(prize - p.c, 6), rnd(prize, 6)];
  },
  /* q17c: a lot of N tickets, price c, M tickets sold over the season. */
  q17c: p => {
    const lot = []; for (let i = 0; i < p.N; i++) lot.push(i < p.a ? p.A : i < p.a + p.b ? p.B : 0);
    let paid = 0; for (const v of lot) paid += v;
    const perTicket = paid / p.N;
    return [rnd(perTicket, 6), rnd(p.M * p.c - p.M * perTicket, 6)];
  },
  /* q17d: probabilities as percentages pa, pb, pc of prizes A, B, C; the rest is nothing. */
  q17d: p => {
    const nothing = (100 - p.pa - p.pb - p.pc) / 100;
    const prize = (p.A * p.pa + p.B * p.pb + p.C * p.pc) / 100;
    return [rnd(nothing, 6), rnd(prize - p.c, 6), rnd(prize, 6)];
  },
  /* q18b: one pattern of independent sensors, each S with probability p. */
  q18b: p => [rnd(patternProb(p.seq, p.seq.split('').map(() => p.p)), 4)],
  /* q18c: first stretch with p1, second stretch with p2. */
  q18c: p => {
    const pat = p.s1 + p.s2, qs = pat.split('').map((_, i) => i < p.s1.length ? p.p1 : p.p2);
    return [rnd(patternProb(pat, qs), 4)];
  },
  /* q18d: a sprouts, b fail, c sprout; the other ways add to the rest of the whole. */
  q18d: p => {
    const pat = 'S'.repeat(p.a) + 'F'.repeat(p.b) + 'S'.repeat(p.c);
    const one = patternProb(pat, pat.split('').map(() => p.p));
    return [rnd(one, 4), rnd(1 - one, 4)];
  },
  /* q19b: n pots, k cracked; first cracked, first good, all. */
  q19b: p => [countOrders(p.n, p.k, true), countOrders(p.n, p.k, false), countOrders(p.n, p.k)],
  /* q19c: all, first sprouts, first sprouts and last fails. */
  q19c: p => [countOrders(p.n, p.k), countOrders(p.n, p.k, true), countOrders(p.n, p.k, true, false)],
  /* q19d: orders with k sprouts, all patterns (every bit pattern), then the fraction in lowest terms. */
  q19d: p => {
    const some = countOrders(p.n, p.k); let all = 0; for (let m = 0; m < (1 << p.n); m++) all++;
    const g = gcd(some, all);
    return [some, all, some / g, all / g];
  },
  /* q20b: sum over every pattern with exactly k successes. */
  q20b: p => [rnd(binomByPatterns(p.n, p.k, p.p), 4)],
  /* q20c: one tray, then T trays times that chance, to 1 decimal place. */
  q20c: p => { const P = binomByPatterns(p.n, p.k, p.p); return [rnd(P, 4), rnd(p.T * P, 1)]; },
  /* q20d: chance of exactly k, then the chance of every other count, found by adding the other counts one at a time. */
  q20d: p => {
    let other = 0; for (let j = 0; j <= p.n; j++) if (j !== p.k) other += binomByPatterns(p.n, j, p.p);
    return [rnd(binomByPatterns(p.n, p.k, p.p), 4), rnd(other, 4)];
  }
});
})();
