/* Independent oracles for Calculus 1 practice missions, file 7 of 8: q31b–q35d (game/realms/calc1/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a numerical limit, a search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = v => Math.round(v * 1e6) / 1e6;
const rd = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
/* Symmetric-difference derivative and second derivative of a function of one variable. */
const D1 = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const D2 = (f, x, h = 1e-4) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
/* Scan a grid of x values (i * step) and return the x with the largest (sign = 1) or smallest (sign = -1) value of f. */
const scan = (f, lo, hi, step, sign) => {
  let bx = null, bv = -Infinity;
  for (let i = Math.round(lo / step); i <= Math.round(hi / step); i++) { const x = i * step, v = sign * f(x); if (v > bv) { bv = v; bx = x; } }
  return bx;
};
/* Bisection for the point of [lo, hi] where the rising function g crosses `target`. */
const bisect = (g, target, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
/* Limit at 0 by evaluating close to 0 and removing the linear and quadratic error terms (Richardson, two steps). */
const lim0 = f => { const h = 1e-3, R = k => 2 * f(k / 2) - f(k); return (4 * R(h / 2) - R(h)) / 3; };
/* Simpson integral of f from 0 to t with many strips. */
const integ = (f, t) => { const n = 2000, h = t / n; let s = f(0) + f(t); for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/* Solve the 3 x 3 linear system rows·[u,v,w] = rhs by Cramer's rule. */
const solve3 = (M, y) => {
  const det = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const d = det(M);
  return [0, 1, 2].map(c => det(M.map((row, i) => row.map((v, j) => (j === c ? y[i] : v)))) / d);
};
/* Newton step with a numerical derivative. */
const newton = (f, x) => x - f(x) / D1(f, x, 1e-6);
Object.assign(window.ORACLE, {
  /* Scan the depth x for the largest area x * y, with the long side y taken from the fencing: 3 fences of x plus 2 long sides. */
  q31b: p => {
    const y = x => (p.L - 3 * x) / 2, A = x => x * y(x);
    const x = scan(A, 0, p.L / 3, 0.01, 1);
    return [r6(x), r6(y(x)), r6(A(x))];
  },
  /* Scan the depth x for the least edging; the area is m squared times 2 (the prompt's area), the wall side is area / x. */
  q31c: p => {
    const area = 2 * p.m * p.m, E = x => 2 * x + area / x;
    const x = scan(E, 0.001, 4 * p.m, 0.001, -1);
    return [r6(x), r6(E(x)), r6(E(x) * p.P)];
  },
  /* Scan the cut x for the largest volume x (s - 2x)^2; V'' from a second difference of the volume. */
  q31d: p => {
    const V = x => x * (p.s - 2 * x) ** 2;
    const x = scan(V, 0, p.s / 2, 0.001, 1);
    return [r6(x), r6(V(x)), r6(D2(V, x, 0.01))];
  },
  /* Average rate from the two heights, then bisect on the instantaneous rate (symmetric difference) to find c. */
  q32b: p => {
    const h = t => p.b * t - p.a * t * t, avg = (h(p.t2) - h(p.t1)) / (p.t2 - p.t1);
    const c = bisect(t => -D1(h, t, 1e-4), -avg, p.t1, p.t2);
    return [r6(avg), r6(c)];
  },
  /* Average speed, the excess over the cap, and a search in tenths of a second for the first time at which the cap speed covers the distance. */
  q32c: p => {
    const avg = p.D / p.T;
    let k = 1;
    while (p.D * 10 > p.v * k) k++;
    return [r6(avg), r6(avg - p.v), k / 10];
  },
  /* Average speed from the distances, then bisect the instantaneous speed (symmetric difference) for c, rounded to 2 places. */
  q32d: p => {
    const d = t => p.a * t ** 3 + p.b * t, avg = (d(p.t2) - d(p.t1)) / (p.t2 - p.t1);
    const c = bisect(t => D1(d, t, 1e-4), avg, p.t1, p.t2);
    return [r6(avg), rd(c, 2)];
  },
  /* Numerical derivatives of top and bottom at 0, and the ratio evaluated close to 0 with the error term removed. */
  q33b: p => {
    const top = x => Math.sin(p.a * x), bot = x => Math.log1p(p.b * x);
    return [r6(D1(top, 0)), r6(D1(bot, 0)), r6(lim0(x => top(x) / bot(x)))];
  },
  /* The fraction's limit numerically, then the torque and the margin from it. */
  q33c: p => {
    const L = lim0(x => Math.sin(p.a * x) / Math.expm1(p.b * x));
    return [r6(L), r6(p.M * L), r6(p.F - p.M * L)];
  },
  /* Second differences of top and bottom at 0, and the ratio evaluated close to 0 (error term in x squared removed). */
  q33d: p => {
    const top = x => 2 * Math.sin(p.a * x / 2) ** 2, bot = x => p.b * x * x;
    const f = x => top(x) / bot(x), h = 1e-3;
    return [rd(D2(top, 0), 4), rd(D2(bot, 0), 4), rd((4 * f(h / 2) - f(h)) / 3, 4)];
  },
  /* Two Newton steps with a numerical derivative. */
  q34b: p => {
    const f = x => x ** 3 - p.N, x1 = newton(f, p.x0), x2 = newton(f, x1);
    return [r6(x1), rd(x2, 3)];
  },
  q34c: p => {
    const f = x => x * x * (x + 1) - p.V, x1 = newton(f, p.x0), x2 = newton(f, x1);
    return [r6(x1), rd(x2, 2)];
  },
  q34d: p => {
    const f = x => x - p.a * Math.cos(x), x1 = newton(f, p.x0), x2 = newton(f, x1);
    return [rd(x1, 3), rd(x2, 3)];
  },
  /* Integrate s numerically from 0 to t and fit M(t) = p t^4 + q t^3 + k t at t = 1, 2, 3. */
  q35b: p => {
    const s = t => 4 * p.a * t ** 3 + 3 * p.b * t * t + p.c;
    const M = t => integ(s, t);
    return solve3([1, 2, 3].map(t => [t ** 4, t ** 3, t]), [1, 2, 3].map(M)).map(r6);
  },
  /* Integrate the runoff numerically over the first T minutes; the room left is the cap minus that. */
  q35c: p => {
    const r = t => 3 * p.a * t * t + 2 * p.b * t + p.c, inflow = integ(r, p.T);
    return [r6(inflow), r6(p.cap - inflow)];
  },
  /* Integrate numerically and fit V(t) - V(0) = p (cos t - 1) + q t^3 + k t at t = 1, 2, 3. */
  q35d: p => {
    const r = t => p.A * Math.sin(t) + 3 * p.q * t * t + p.s;
    const V = t => integ(r, t);
    return solve3([1, 2, 3].map(t => [Math.cos(t) - 1, t ** 3, t]), [1, 2, 3].map(V)).map(r6);
  },
});
})();
