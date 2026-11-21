/* Independent oracles for Calculus 1 practice missions, file 5 of 8: q21b–q25d (game/realms/calc1/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a numerical limit, a search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here.
   Method: every derivative is a five-point symmetric difference of the function the prompt states (no rule is applied);
   implicit curves are solved for y first and then differenced; the bisection and the geometry follow the prompt's wording. */
(function(){ 'use strict';
/* Five-point symmetric difference quotient of f at x. */
const D = (f, x) => { const h = 1e-3; return (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h); };
/* Tidy the numerical noise away (answers here are exact or rounded to 2 decimals). */
const tidy = v => Math.round(v * 1e8) / 1e8 || 0;
/* Round half up to 2 decimal places. */
const r2 = v => (Math.floor(v * 100 + 0.5 + 1e-9) / 100) || 0;
/* Tangent line y = y0 + m (x - x0) cut at x = 0. */
const yInt = (x0, y0, m) => y0 + m * (0 - x0);
/* Root of b y^2 + c1 y + c0 = 0 closest to y0 (the branch through the given point). */
const nearRoot = (b, c1, c0, y0) => {
  const disc = Math.sqrt(c1 * c1 - 4 * b * c0), r1 = (-c1 + disc) / (2 * b), r2_ = (-c1 - disc) / (2 * b);
  return Math.abs(r1 - y0) < Math.abs(r2_ - y0) ? r1 : r2_;
};
Object.assign(window.ORACLE, {
  /* x(t) = a cos t - b sin t: difference the position at t = pi and pi/3. */
  q21b: p => {
    const x = t => p.a * Math.cos(t) - p.b * Math.sin(t);
    return [tidy(D(x, Math.PI)), r2(D(x, Math.PI / 3))];
  },
  /* x(t) = a cos t + b sin t: velocity at pi/3 by differences, then the room left under the speed limit L. */
  q21c: p => {
    const x = t => p.a * Math.cos(t) + p.b * Math.sin(t);
    const v = D(x, Math.PI / 3);
    return [r2(v), r2(p.L - Math.abs(v))];
  },
  /* f(t) = a sin(kt) + b cos(mt): difference at 0 and pi/6. */
  q21d: p => {
    const f = t => p.a * Math.sin(p.k * t) + p.b * Math.cos(p.m * t);
    return [tidy(D(f, 0)), r2(D(f, Math.PI / 6))];
  },
  /* T(t) = a e^(-kt) at t = 0 and S(t) = b ln t at t = d, both by differences. */
  q22b: p => {
    const T = t => p.a * Math.exp(-p.k * t), S = t => p.b * Math.log(t);
    return [tidy(D(T, 0)), tidy(D(S, p.d))];
  },
  /* W(t) = b ln t: wear rate at t = d by differences, then bisect for the time at which the rate has fallen to r. */
  q22c: p => {
    const W = t => p.b * Math.log(t), rate = t => D(W, t);
    let lo = 1.5, hi = 1e5;
    for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (rate(mid) > p.r) lo = mid; else hi = mid; }
    return [tidy(rate(p.d)), Math.round((lo + hi) / 2 * 1e6) / 1e6];
  },
  /* T(t) = (a t + b) e^(-k t): rate at t = 0 and t = d by differences, second rounded to 2 decimals. */
  q22d: p => {
    const T = t => (p.a * t + p.b) * Math.exp(-p.k * t);
    return [tidy(D(T, 0)), r2(D(T, p.d))];
  },
  /* u = (x + p)(x^2 + s), v = x^2 / (x + q), w = (x^2 + h)^3 at x = c, by differences. */
  q23b: p => {
    const u = x => (x + p.p) * (x * x + p.s), v = x => x * x / (x + p.q), w = x => Math.pow(x * x + p.h, 3);
    return [tidy(D(u, p.c)), tidy(D(v, p.c)), tidy(D(w, p.c))];
  },
  /* A(t) = a t / (t + q), B(t) = (k t + s)^2 at t = c; then the gap between the two rates. */
  q23c: p => {
    const A = t => p.a * t / (t + p.q), B = t => Math.pow(p.k * t + p.s, 2);
    const ra = D(A, p.c), rb = D(B, p.c);
    return [tidy(ra), tidy(rb), tidy(Math.abs(rb - ra))];
  },
  /* f(x) = x (m x + s)^3 and g(x) = (a x + b)^2 / (x + q) at x = c, by differences. */
  q23d: p => {
    const f = x => x * Math.pow(p.m * x + p.s, 3), g = x => Math.pow(p.a * x + p.b, 2) / (x + p.q);
    return [tidy(D(f, p.c)), tidy(D(g, p.c))];
  },
  /* Curve a x^2 - b y^2 = C through (x0, y0): solve for y on the branch through the point, difference y(x), then
     cut the tangent line at x = 0. */
  q24b: p => {
    const C = p.a * p.x0 * p.x0 - p.b * p.y0 * p.y0;
    const y = x => nearRoot(p.b, 0, C - p.a * x * x, p.y0) * 1;
    const m = D(y, p.x0);
    return [tidy(m), tidy(yInt(p.x0, p.y0, m))];
  },
  /* Oval a x^2 + b y^2 = C: slope by differences on the upper branch; walk the tangent down to y = 0 and take the
     straight-line length of the strut from the point of contact to the ground. */
  q24c: p => {
    const C = p.a * p.x0 * p.x0 + p.b * p.y0 * p.y0;
    const y = x => nearRoot(p.b, 0, p.a * x * x - C, p.y0);
    const m = D(y, p.x0);
    const xg = p.x0 + (0 - p.y0) / m;
    return [tidy(m), tidy(xg), r2(Math.hypot(xg - p.x0, p.y0))];
  },
  /* Tilted oval a x^2 + x y + b y^2 = C through (x0, y0): b y^2 + x y + (a x^2 - C) = 0 is a quadratic in y; take
     the root through the point, difference it, then cut the tangent at x = 0. */
  q24d: p => {
    const C = p.a * p.x0 * p.x0 + p.x0 * p.y0 + p.b * p.y0 * p.y0;
    const y = x => nearRoot(p.b, x, p.a * x * x - C, p.y0);
    const m = D(y, p.x0);
    return [tidy(m), tidy(yInt(p.x0, p.y0, m))];
  },
  /* Right triangle: ground distance g, height h(t) = h + v t. Distance D(t) by Pythagoras, rate by differences. */
  q25b: p => {
    const dist = t => Math.hypot(p.g, p.h + p.v * t);
    return [tidy(dist(0)), tidy(D(dist, 0))];
  },
  /* Crawlers at (x + u t, 0) and (0, y + w t): gap s(t) and its rate by differences. */
  q25c: p => {
    const gap = t => Math.hypot(p.x + p.u * t, p.y + p.w * t);
    return [tidy(gap(0)), tidy(D(gap, 0))];
  },
  /* Oval a x^2 + b y^2 = C through (x0, y0): upper branch y(x), slope by differences, then dy/dt = slope x dx/dt.
     Also checked by moving x along the rail for a tiny time and watching y. */
  q25d: p => {
    const C = p.a * p.x0 * p.x0 + p.b * p.y0 * p.y0;
    const y = x => nearRoot(p.b, 0, p.a * x * x - C, p.y0);
    const traj = t => y(p.x0 + p.u * t);
    return [tidy(D(y, p.x0)), tidy(D(traj, 0))];
  },
});
})();
