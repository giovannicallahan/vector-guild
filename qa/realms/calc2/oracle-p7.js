/* Independent oracles for Calculus 2: accumulation practice missions, file 7 of 8: q31b–q35d (game/realms/calc2/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* A p-value given as 3, 0.5 or the text '3/2'. */
const num = v => { if (typeof v === 'string' && v.includes('/')) { const [a, b] = v.split('/'); return Number(a) / Number(b); } return Number(v); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* The fraction of smallest denominator within 1e-6 of x: [numerator, denominator]. */
const asFraction = x => { for (let d = 1; d <= 5000; d++) { const n = Math.round(x * d); if (Math.abs(n / d - x) < 1e-6) return [n / gcd(n, d), d / gcd(n, d)]; } throw Error('no fraction for ' + x); };
/* Integral test, numerically: does the integral of the function from 1 to X settle between X = 10^6 and X = 10^12? */
const settles = f => { const area = X => { let s = 0, lo = 1; while (lo < X) { const hi = lo * 1.001, mid = (lo + hi) / 2; s += (hi - lo) * (f(lo) + 4 * f(mid) + f(hi)) / 6; lo = hi; } return s; };
  const a = area(1e6), b = area(1e12); return b - a < 1 ? 1 : 0; };
/* Area under f from N out to far away, in geometrically growing slices (Simpson on each). */
const tail = (f, N) => { let s = 0, lo = N; while (lo < N * 1e12) { const hi = lo * 1.001, mid = (lo + hi) / 2; s += (hi - lo) * (f(lo) + 4 * f(mid) + f(hi)) / 6; lo = hi; } return s; };
/* Smallest N (counting up from 1) for which err(N) is below eps. */
const firstBelow = (err, eps) => { let N = 1; while (!(err(N) < eps * (1 - 1e-9))) N++; return N; };
Object.assign(window.ORACLE, {
  /* q31b: p-series. Log A takes the large exponent pc when swap is true, else the small one pd. */
  q31b: p => {
    const a = p.swap ? num(p.pc) : num(p.pd), b = p.swap ? num(p.pd) : num(p.pc);
    const ca = settles(x => Math.pow(x, -a)), cb = settles(x => Math.pow(x, -b));
    const q = ca ? a : b;
    /* The tail integral in closed form: N^(1-q) ÷ (q-1). */
    return [ca, cb, Math.pow(p.N, 1 - q) / (q - 1)];
  },
  /* q31c: terms k ÷ n²: the bound after N0 pings is the integral of k ÷ x² from N0 to ∞, which is k ÷ N0. */
  q31c: p => {
    const bound = N => p.k / N;
    let N = 1; while (bound(N) > p.eps + 1e-12) N++;
    return [bound(p.N0), N];
  },
  /* q31d: terms (a n + b)^(-power): converge when the power is above 1; tail integral by u = a x + b. */
  q31d: p => {
    const A = p.swap ? num(p.pc) : num(p.pd), B = p.swap ? num(p.pd) : num(p.pc);
    const ca = A > 1 ? 1 : 0, cb = B > 1 ? 1 : 0, q = ca ? A : B;
    const u0 = p.a * p.N + p.b;
    return [ca, cb, Math.pow(u0, 1 - q) / (p.a * (q - 1))];
  },
  /* q32b: a_n = (A n^j + B) ÷ (C n^(j+d) − D) against b_n = 1 ÷ n^d, the ratio read far out; the p-series b_n converges for d > 1. */
  q32b: p => {
    const n = 1e9, a = (p.A * Math.pow(n, p.j) + p.B) / (p.C * Math.pow(n, p.j + p.d) - p.D);
    return [a * Math.pow(n, p.d), p.d > 1 ? 1 : 0];
  },
  /* q32c: steps 12-style numerator r·j over r^n + n; the series r j ÷ rⁿ is added term by term. */
  q32c: p => {
    const K = p.r * p.j; let sum = 0;
    for (let n = 1; n <= 400; n++) sum += K / Math.pow(p.r, n);
    return [K / p.r, sum];
  },
  /* q32d: a_n = (A n^j + B n + E) ÷ (C n^(j+d) + D n² + F). The exponent p is read from how fast a_n falls when n doubles. */
  q32d: p => {
    const a = n => (p.A * Math.pow(n, p.j) + p.B * n + p.E) / (p.C * Math.pow(n, p.j + p.d) + p.D * n * n + p.F);
    const pw = Math.round(-Math.log(a(2e6) / a(1e6)) / Math.log(2) * 1000) / 1000;
    const n = 1e9;
    return [pw, a(n) * Math.pow(n, pw), pw > 1 ? 1 : 0];
  },
  /* q33b: terms c ÷ n^p. The error after k terms is under the next term c ÷ (k+1)^p; search N. */
  q33b: p => {
    const next = k => p.c / Math.pow(k + 1, p.p);
    return [next(p.k), firstBelow(next, p.eps)];
  },
  /* q33c: terms 1 ÷ n^p, tau seconds each. */
  q33c: p => {
    const N = firstBelow(k => 1 / Math.pow(k + 1, p.p), p.eps);
    return [N, N * p.tau];
  },
  /* q33d: terms 1 ÷ n^key. The sizes alone are a p-series; the error after k terms is under 1 ÷ (k+1)^key; allowed error is 1 ÷ M. */
  q33d: p => {
    const e = num(p.key), next = k => Math.pow(k + 1, -e);
    return [e > 1 ? 1 : 0, next(p.k), firstBelow(next, 1 / p.M)];
  },
  /* q34b: 'tri' = (3n)! ÷ ((n!)³ bⁿ), ratio test; 'rootk' = (a n ÷ (b n + 1))ⁿ, root test. Limits read far out. */
  q34b: p => {
    let L;
    if (p.fam === 'tri') { const n = 1e8; L = (3 * n + 3) * (3 * n + 2) * (3 * n + 1) / (Math.pow(n + 1, 3) * p.b); }
    else if (p.fam === 'rootk') { const n = 1e8; L = p.a * n / (p.b * n + 1); }
    else throw Error('unknown family ' + p.fam);
    const [top, bottom] = asFraction(L);
    return [top, bottom, L < 1 ? 1 : 0];
  },
  /* q34c: n^k g^n ÷ b^n: the n^k factors cancel in the limit, so L = g ÷ b; converges for L < 1, i.e. gain up to b − 1. */
  q34c: p => {
    const n = 1e8, L = Math.pow((n + 1) / n, p.k) * p.g / p.b;
    const [top, bottom] = asFraction(L);
    let g = 0; while ((g + 1) / p.b < 1) g++;
    return [top, bottom, g];
  },
  /* q34d: 'inv' = (n!)² bⁿ ÷ (2n)!; 'inv3' = (n!)³ bⁿ ÷ (3n)!. Ratio read far out. */
  q34d: p => {
    const n = 1e8; let L;
    if (p.fam === 'inv') L = Math.pow(n + 1, 2) * p.b / ((2 * n + 2) * (2 * n + 1));
    else if (p.fam === 'inv3') L = Math.pow(n + 1, 3) * p.b / ((3 * n + 3) * (3 * n + 2) * (3 * n + 1));
    else throw Error('unknown family ' + p.fam);
    const [top, bottom] = asFraction(L);
    return [top, bottom, L < 1 ? 1 : 0];
  },
  /* q35b: Σ (−1)ⁿ n^j (x − c)ⁿ ÷ kⁿ. Radius = |a_n ÷ a_(n+1)| far out; the terms do not shrink at the ends, so both ends are open. */
  q35b: p => {
    const n = 1e9, R = p.k * Math.pow(n / (n + 1), p.j);
    const r = Math.round(R * 1e4) / 1e4;
    return [r, p.c, p.c - r, p.c + r];
  },
  /* q35c: Σ (x − c)ⁿ ÷ (n² kⁿ) at x = c + s. Ratio test: |x − c| ÷ k < 1. */
  q35c: p => {
    const n = 1e9, R = p.k, dist = Math.abs(p.s);
    return [R, dist, dist / R < 1 ? 1 : 0];
  },
  /* q35d: 'geo' = kⁿ (x − c)ⁿ ÷ n; 'binom' = C(2n, n) kⁿ (x − c)ⁿ. Radius = 1 ÷ (limit of a_(n+1) ÷ a_n), far out. */
  q35d: p => {
    const n = 1e9; let L;
    if (p.fam === 'geo') L = p.k * n / (n + 1);
    else if (p.fam === 'binom') L = p.k * (2 * n + 2) * (2 * n + 1) / Math.pow(n + 1, 2);
    else throw Error('unknown family ' + p.fam);
    const R = Math.round(1e5 / L) / 1e5;
    return [p.c, R, p.c - R, p.c + R];
  },
});
})();
