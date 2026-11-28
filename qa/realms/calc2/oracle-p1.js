/* Independent oracles for Calculus 2: accumulation practice missions, file 1 of 8: q01b–q05d (game/realms/calc2/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const r3 = x => Math.round(x * 1e3) / 1e3;
const r2 = x => Math.round(x * 1e2) / 1e2;
/* Definite integral of f from a to b by composite Simpson's rule (no antiderivative used). */
const area = (f, a, b) => {
  const n = 4000, h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
Object.assign(window.ORACLE, {
  /* q01b: the tank loses d(t) = a t² + b t, so the amount falls by the area under d; end = start + net change. */
  q01b: p => {
    const net = -area(t => p.a * t * t + p.b * t, p.t1, p.t2);
    return [r6(net), r6(p.S + net)];
  },
  /* q01c: net rate = inflow p t² + q t minus the steady outflow k. */
  q01c: p => {
    const net = area(t => p.p * t * t + p.q * t - p.k, p.t1, p.t2);
    return [r6(net), r6(p.S + net)];
  },
  /* q01d: r(t) = 4a t³ + 3b t² + 2c t + d (the prompt prints 4a, 3b, 2c, d as the coefficients). */
  q01d: p => {
    const net = area(t => 4 * p.a * t ** 3 + 3 * p.b * t * t + 2 * p.c * t + p.d, p.t1, p.t2);
    return [r6(net), r6(p.S + net)];
  },
  /* q02b: F(b) as the area under f(t) = p t² + q from a to b; F′(b) is the height f(b), read as a slope of F. */
  q02b: p => {
    const f = t => p.p * t * t + p.q, F = x => area(f, p.a, x);
    return [r6(F(p.b)), r6((F(p.b + 1e-3) - F(p.b - 1e-3)) / 2e-3)];
  },
  /* q02c: f(t) = p t² + q; the growth rate is the value of f at the hour x0; find the hour by scanning in steps of 0.01. */
  q02c: p => {
    const f = t => p.p * t * t + p.q, rate = f(p.x0);
    let x = 0; while (f(x) < rate - 1e-9) x = Math.round((x + 0.01) * 100) / 100;
    return [r6(x), r6(area(f, p.a, x))];
  },
  /* q02d: f(t) = 4A t³ + 3B t² + 2C t + D; F(hi) by area, F′(hi) as the slope of F, amount = start + F(hi). */
  q02d: p => {
    const f = t => 4 * p.A * t ** 3 + 3 * p.B * t * t + 2 * p.C * t + p.D, F = x => area(f, p.lo, x);
    const Fh = F(p.hi);
    return [r6(Fh), r6((F(p.hi + 1e-3) - F(p.hi - 1e-3)) / 2e-3), r6(p.S + Fh)];
  },
  /* q03b: h(x) = 4m x³ + d; average = area ÷ width; find c by bisection where h(c) = average, rounded to 2 places. */
  q03b: p => {
    const h = x => 4 * p.m * x ** 3 + p.d, avg = area(h, p.a, p.b) / (p.b - p.a);
    let lo = p.a, hi = p.b; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (h(mid) < avg) lo = mid; else hi = mid; }
    return [r6(avg), r2((lo + hi) / 2)];
  },
  /* q03c: r(t) = k t² + q t from a to b; steady rate = total ÷ time; then rate × T. */
  q03c: p => {
    const tot = area(t => p.k * t * t + p.q * t, p.a, p.b), rate = tot / (p.b - p.a);
    return [r6(tot), r6(rate), r6(rate * p.T)];
  },
  /* q03d: f(t) = 3p t² + 2q t + d from a to a + len; F at the end, the average over the spell, f at the end. */
  q03d: p => {
    const f = t => 3 * p.p * t * t + 2 * p.q * t + p.d, end = p.a + p.len, tot = area(f, p.a, end);
    return [r6(tot), r6(tot / p.len), r6(f(end))];
  },
  /* q04b: r(t) = 3s(m + 1) t² (t³ + c)^m (so 9s t² when m = 2); the u limits come from u = t³ + c, the amount from the area in t. */
  q04b: p => {
    const u = t => t ** 3 + p.c;
    return [r6(u(p.a)), r6(u(p.b)), r6(area(t => 3 * p.s * (p.m + 1) * t * t * u(t) ** p.m, p.a, p.b))];
  },
  /* q04c: r(t) = s(m + 1) w (w t + c)^m with u = w t + c (all the draws have w = 2, as the prompts show). */
  q04c: p => {
    const u = t => p.w * t + p.c, added = area(t => p.s * (p.m + 1) * p.w * u(t) ** p.m, p.t1, p.t2);
    return [r6(u(p.t1)), r6(u(p.t2)), r6(added), r6(p.S + added)];
  },
  /* q04d: r(t) = 2s(m + 1) t (t² + c)^m from a to a + len; average = total ÷ length. */
  q04d: p => {
    const u = t => t * t + p.c, end = p.a + p.len, tot = area(t => 2 * p.s * (p.m + 1) * t * u(t) ** p.m, p.a, end);
    return [r6(u(p.a)), r6(u(end)), r6(tot), r6(tot / p.len)];
  },
  /* q05b: area under k ÷ x from p to q, and under m eˣ from 0 to T. */
  q05b: p => [r3(area(x => p.k / x, p.p, p.q)), r3(area(x => p.m * Math.exp(x), 0, p.T))],
  /* q05c: pumped = area of k ÷ (t + c), drained = area of m e^(−t), both from 0 to T. */
  q05c: p => {
    const inn = area(t => p.k / (t + p.c), 0, p.T), out = area(t => p.m * Math.exp(-t), 0, p.T);
    return [r3(inn), r3(out), r3(p.S + inn - out)];
  },
  /* q05d: valve A passes 2w t ÷ (t² + c) from a to b (u = t² + c); valve B passes 2w t e^(−t²) from 0 to T. */
  q05d: p => [p.a * p.a + p.c, p.b * p.b + p.c,
    r3(area(t => 2 * p.w * t / (t * t + p.c), p.a, p.b)), r3(area(t => 2 * p.w * t * Math.exp(-t * t), 0, p.T))],
});
})();
