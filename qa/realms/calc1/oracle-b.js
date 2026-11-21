/* Independent oracles for Calculus 1 learn missions, file b: q11–q20 (game/realms/calc1/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build(): a table of values, a numerical limit or difference quotient with a small
   step, a numerical integral, a search or a general solver. Do not import game files. */
(function(){ 'use strict';
  /* Helpers: evaluate the function stated in the prompt, then take numbers from it by small steps. */
  const tidy = x => Math.round(x * 1e6) / 1e6;
  // five-point symmetric derivative
  const d1 = (f, x, h = 1e-3) => (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);
  // symmetric second difference
  const d2 = (f, x, h = 1e-2) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);

Object.assign(window.ORACLE, {
  /* Left piece (x²−k²)/(x−k): evaluate just below k at ever closer points and take the last value.
     Right piece j x² − c: continuity means j k² − c equals that limit, so c is found by solving for it. */
  q11: p => {
    const left = x => (x * x - p.k * p.k) / (x - p.k);
    let lim = 0;
    for (let e = 1e-2; e >= 1e-5; e /= 10) lim = left(p.k - e);
    lim = Math.round(lim * 1e3) / 1e3;
    // search c so that right(k) = lim
    const right = (c, x) => p.j * x * x - c; // falls as c grows
    let lo = -1e6, hi = 1e6;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (right(mid, p.k) > lim) lo = mid; else hi = mid;
    }
    return [lim, Math.round((lo + hi) / 2 * 1e3) / 1e3];
  },

  /* s(t) = a t² + b t. Difference quotient at h = 0.1 read straight off the table; the derivative from
     symmetric differences with a tiny step, rounded (the answer is a whole number). */
  q12: p => {
    const s = t => p.a * t * t + p.b * t;
    const dq = (s(p.t0 + 0.1) - s(p.t0)) / 0.1;
    return [tidy(dq), Math.round(d1(s, p.t0) * 1e4) / 1e4];
  },

  /* y = p x² + q x + r. Slope by symmetric differences at x = a; the tangent passes through (a, f(a)),
     so the intercept is f(a) minus slope times a. */
  q13: p => {
    const f = x => p.p * x * x + p.q * x + p.r;
    const m = Math.round(d1(f, p.a) * 1e4) / 1e4;
    return [m, tidy(f(p.a) - m * p.a)];
  },

  /* d(t) = t^k. d'(1) is the coefficient; d'(2)/d'(1) = 2^(power) so the power is its base-2 log. */
  q14: p => {
    const d = t => Math.pow(t, p.k);
    const dd = t => d1(d, t, 1e-3);
    const coef = Math.round(dd(1) * 1e4) / 1e4;
    const power = Math.round(Math.log2(dd(2) / dd(1)));
    return [coef, power, Math.round(dd(p.a) * 1e3) / 1e3];
  },

  /* T(t) = a t³ + b t² + c t + d. T′ is quadratic, so three numerical slopes at t = 0, 1, −1 pin down
     C, A and B; then T′(t0) is read numerically as well. */
  q15: p => {
    const T = t => p.a * t * t * t + p.b * t * t + p.c * t + p.d;
    const g = t => d1(T, t);
    const C = g(0), plus = g(1), minus = g(-1);
    const A = (plus + minus) / 2 - C, B = (plus - minus) / 2;
    return [A, B, C, g(p.t0)].map(x => Math.round(x * 1e3) / 1e3);
  },

  /* s(t) = p t³ − 3pm t² + c t. Velocity by a symmetric difference, acceleration by a second difference,
     and the zero of acceleration by bisection on the sign of the second difference. */
  q16: p => {
    const s = t => p.p * t * t * t - 3 * p.p * p.m * t * t + p.c * t;
    const a = t => d2(s, t);
    let lo = -1000, hi = 1000; // acceleration rises with t, so it is negative at lo and positive at hi
    for (let i = 0; i < 100; i++) {
      const mid = (lo + hi) / 2;
      if (a(mid) < 0) lo = mid; else hi = mid;
    }
    return [Math.round(d1(s, p.t0) * 1e3) / 1e3, Math.round(a(p.t0) * 1e3) / 1e3, Math.round((lo + hi) / 2 * 1e3) / 1e3];
  },

  /* s(t) = p t³ + q t² + r t + d. Rate and second derivative by differences; the tangent line at t0 passes
     through (t0, s(t0)) with slope s′(t0), so k = s(t0) − s′(t0) t0. */
  q17: p => {
    const s = t => p.p * t * t * t + p.q * t * t + p.r * t + p.d;
    const m = Math.round(d1(s, p.t0) * 1e4) / 1e4;
    return [m, Math.round(d2(s, p.t0) * 1e3) / 1e3, tidy(s(p.t0) - m * p.t0)];
  },

  /* P(x) = (a x + b)(c x² + d). Value by substitution; derivative by symmetric differences of the product. */
  q18: p => {
    const P = x => (p.a * x + p.b) * (p.c * x * x + p.d);
    return [P(p.x0), Math.round(d1(P, p.x0) * 1e4) / 1e4];
  },

  /* E(x) = (a x + b) ÷ (x + c): value by division, slope by differences. */
  q19: p => {
    const E = x => (p.a * x + p.b) / (x + p.c);
    return [tidy(E(p.x0)), tidy(d1(E, p.x0, 1e-3))];
  },

  /* F(x) = (a x + b)^k. Inside value by substitution; F′ by symmetric differences of F itself. */
  q20: p => {
    const F = x => Math.pow(p.a * x + p.b, p.k);
    return [p.a * p.x0 + p.b, Math.round(d1(F, p.x0, 1e-3) * 1e3) / 1e3];
  },
});
})();
