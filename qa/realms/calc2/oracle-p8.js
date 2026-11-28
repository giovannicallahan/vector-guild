/* Independent oracles for Calculus 2: accumulation practice missions, file 8 of 8: q36b–q40d (game/realms/calc2/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r4 = x => Math.round(x * 1e4) / 1e4;
const r6 = x => Math.round(x * 1e6) / 1e6;
const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= f ? i : 1; return f; };
/* Generalised binomial coefficient C(r, k), built one factor at a time. */
const binom = (r, k) => { let c = 1; for (let i = 0; i < k; i++) c *= (r - i) / (i + 1); return c; };
/* Smallest fraction (denominator searched upward) equal to v: [numerator, denominator]. */
const frac = v => { for (let d = 1; d <= 5e6; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-12 * Math.max(1, Math.abs(v))) return [n === 0 ? 0 : n, d]; } return [NaN, NaN]; };
/* Exact rational helpers on BigInt pairs. */
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };
const rat = (n, d) => { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return [n / g, d / g]; };
const radd = (a, b) => rat(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const rout = a => [Number(a[0]), Number(a[1])];
const bfact = n => { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; };
/* nth derivative of sin, cos, exp at 0, by following the cycle of derivatives. */
const derivAt0 = (f, n) => f === 'exp' ? 1 : f === 'sin' ? [0, 1, 0, -1][n % 4] : [1, 0, -1, 0][n % 4];
/* Coefficient of x^m in f(k x), exact: k^m f^(m)(0) / m!, with k = kn / kd. */
const coefOf = (f, kn, kd, m) => f === 'geo' ? rat(BigInt(kn) ** BigInt(m), BigInt(kd) ** BigInt(m))
  : rat(BigInt(derivAt0(f, m)) * BigInt(kn) ** BigInt(m), bfact(m) * BigInt(kd) ** BigInt(m));
/* Composite Simpson rule. */
const simpson = (g, a, b, n = 2000) => { const h = (b - a) / n; let s = g(a) + g(b); for (let i = 1; i < n; i++) s += g(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/* Smallest n (from 0) with M d^(n+1) / (n+1)! below eps, building the bound by one multiplication at a time. */
const needDeg = (M, d, eps) => { let bound = M; for (let n = 0; n < 200; n++) { bound *= d / (n + 1); if (bound < eps) return n; } return NaN; };

Object.assign(window.ORACLE, {
  /* q36b: f = x^(-1/2) about a, from the binomial coefficients C(-1/2, k) a^(-1/2-k); value at a + h. */
  q36b: p => {
    const c = k => binom(-0.5, k) * Math.pow(p.a, -0.5 - k), c2 = c(2);
    const [n, d] = frac(c2);
    return [n, d, r4(c(0) + c(1) * p.h + c2 * p.h * p.h)];
  },
  /* q36c: f = x^(1/3) about a; tank volumes a + h1 and a + h2. */
  q36c: p => {
    const c = k => binom(1 / 3, k) * Math.pow(p.a, 1 / 3 - k), P = h => c(0) + c(1) * h + c(2) * h * h;
    return [r4(P(p.h1)), r4(P(p.h2))];
  },
  /* q36d: f = x^(3/2) about a, degree 3; value at a + h. */
  q36d: p => {
    const c = k => binom(1.5, k) * Math.pow(p.a, 1.5 - k), c3 = c(3), [n, d] = frac(c3);
    return [n, d, r4(c(0) + c(1) * p.h + c(2) * p.h ** 2 + c3 * p.h ** 3)];
  },
  /* q37b: coefficient of x^m in f(kn x / kd), as an exact fraction. */
  q37b: p => rout(coefOf(p.f, p.kn, p.kd, p.m)),
  /* q37c: f(k x) ± 1 ÷ (1 − j x): x^m coefficients subtracted (op = -1) or added (op = +1). */
  q37c: p => {
    const A = coefOf(p.f, p.k, 1, p.m), B = rat(BigInt(p.j) ** BigInt(p.m), 1);
    return rout(radd(A, p.op < 0 ? rat(-B[0], B[1]) : B));
  },
  /* q37d: f(k x): x^m coefficient, and the m-th derivative at 0 got by differentiating m times (k^m times the cycle value). */
  q37d: p => {
    const deriv = BigInt(derivAt0(p.f, p.m)) * BigInt(p.k) ** BigInt(p.m);
    return [...rout(rat(deriv, bfact(p.m))), Number(deriv)];
  },
  /* q38b: first degree whose error bound drops below the limit. */
  q38b: p => [needDeg(p.M, p.d, p.eps)],
  /* q38c: degrees for the near and far readings, then the larger. */
  q38c: p => { const a = needDeg(p.A, p.x1, p.eps), b = needDeg(p.A, p.x2, p.eps); return [a, b, Math.max(a, b)]; },
  /* q38d: method 1 by the bound, method 2 by counting terms until the next omitted term is small enough. */
  q38d: p => {
    const n1 = needDeg(1, p.x, p.eps);
    let terms = 1;
    for (; terms < 100; terms++) { const e = 2 * terms + 1; if (Math.pow(p.x, e) / fact(e) < p.eps) break; }
    return [n1, terms];
  },
  /* q39b: add the integrals of the first k terms of the series of sin(x²) or cos(x²), each integrated numerically. */
  q39b: p => {
    let total = 0;
    for (let j = 0; j < p.k; j++) {
      const term = p.f === 'sinsq' ? x => (j % 2 ? -1 : 1) * Math.pow(x, 4 * j + 2) / fact(2 * j + 1)
                                   : x => (j % 2 ? -1 : 1) * Math.pow(x, 4 * j) / fact(2 * j);
      total += simpson(term, 0, p.b);
    }
    return [r4(total)];
  },
  /* q39c: integral of the first k terms of e^(−x²) or sin(x)/x (4 places), then I times the sum (3 places). */
  q39c: p => {
    let total = 0;
    for (let j = 0; j < p.k; j++) {
      const term = p.f === 'gauss' ? x => (j % 2 ? -1 : 1) * Math.pow(x, 2 * j) / fact(j)
                                   : x => (j % 2 ? -1 : 1) * Math.pow(x, 2 * j) / fact(2 * j + 1);
      total += simpson(term, 0, p.b);
    }
    return [r4(total), Math.round(p.I * total * 1e3) / 1e3];
  },
  /* q39d: integral of the first k terms (4 places), then divided by the length b of [0, b] (3 places). */
  q39d: p => {
    let total = 0;
    for (let j = 0; j < p.k; j++) {
      const term = p.f === 'cossq' ? x => (j % 2 ? -1 : 1) * Math.pow(x, 4 * j) / fact(2 * j)
                 : p.f === 'gauss' ? x => (j % 2 ? -1 : 1) * Math.pow(x, 2 * j) / fact(j)
                 : p.f === 'sinsq' ? x => (j % 2 ? -1 : 1) * Math.pow(x, 4 * j + 2) / fact(2 * j + 1)
                                   : x => (j % 2 ? -1 : 1) * Math.pow(x, 2 * j) / fact(2 * j + 1);
      total += simpson(term, 0, p.b);
    }
    return [r4(total), Math.round(total / p.b * 1e3) / 1e3];
  },
  /* q40b: x = 6 m t² + p, y = m t³ − 12 m t + q. Slope as y'÷x' at t0; length by integrating the speed numerically. */
  q40b: p => {
    const dx = t => 12 * p.m * t, dy = t => 3 * p.m * t * t - 12 * p.m;
    return [r6(dy(p.t0) / dx(p.t0)), r6(simpson(t => Math.hypot(dx(t), dy(t)), p.t1, p.t2))];
  },
  /* q40c: x = 3 s m t² + p, y = m t³ − 3 m s² t + q. Speed at t0, distance by integrating the speed, average = distance ÷ time. */
  q40c: p => {
    const dx = t => 6 * p.s * p.m * t, dy = t => 3 * p.m * t * t - 3 * p.m * p.s * p.s, sp = t => Math.hypot(dx(t), dy(t));
    const dist = simpson(sp, p.t1, p.t2);
    return [r6(sp(p.t0)), r6(dist), r6(dist / (p.t2 - p.t1))];
  },
  /* q40d: x = A t² + p, y = B t³ + q, with the coefficients A and B and the end time T as the prompt states them (they are
     parameters of the draw): slope y'÷x' at t0, length by integrating the speed numerically. */
  q40d: p => {
    const { A, B, T } = p;
    const dx = t => 2 * A * t, dy = t => 3 * B * t * t;
    return [r6(dy(p.t0) / dx(p.t0)), r6(simpson(t => Math.hypot(dx(t), dy(t)), 0, T, 4000))];
  },
});
})();
