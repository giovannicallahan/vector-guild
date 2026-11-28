/* Independent oracles for Differential equations practice missions, file 7 of 8: q31b–q35d (game/realms/ode/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r3 = x => Math.round(x * 1000 + (x < 0 ? -1e-9 : 1e-9)) / 1000;
const r9 = x => Math.round(x * 1e9) / 1e9;
/* Classical Runge-Kutta 4 for a vector state: f(t, y) -> dy/dt, from t0 to t1 in n steps. */
const rk4 = (f, y, t0, t1, n) => {
  n = n || 4000; const h = (t1 - t0) / n; y = y.slice();
  const add = (u, v, c) => u.map((x, i) => x + c * v[i]);
  for (let i = 0; i < n; i++) {
    const t = t0 + i * h, k1 = f(t, y), k2 = f(t + h / 2, add(y, k1, h / 2)), k3 = f(t + h / 2, add(y, k2, h / 2)), k4 = f(t + h, add(y, k3, h));
    y = y.map((x, j) => x + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return y;
};
/* Solve y' = -k y + F(t) where F is a sum of switch-ons c u(t - at): march through the switch times, forcing constant between them. */
const switched = (k, steps, tEnd) => {
  const times = [0].concat(steps.map(s => s.at).sort((a, b) => a - b)); let y = [0];
  for (let i = 0; i < times.length; i++) {
    const t0 = times[i], t1 = i + 1 < times.length ? times[i + 1] : tEnd;
    let F = 0; for (const s of steps) if (s.at <= t0 + 1e-12) F += s.c;
    if (t1 > t0) y = rk4((t, v) => [-k * v[0] + F], y, t0, t1, 2000);
  }
  return y[0];
};
/* Partial fractions of (n1 s + n0) ÷ ((s - ra)(s - rb)): residue at ra = N(ra) ÷ D'(ra), with D the expanded bottom. */
const resid = (n1, n0, ra, rb) => (n1 * ra + n0) / (2 * ra - (ra + rb));
/* Power series: find a_(n+2) by making the coefficient of x^n vanish in y'' + b x y' + c y, using coefficient arrays. */
const series = (b, c, a0, a1, upto) => {
  const a = [a0, a1];
  for (let n = 0; n + 2 <= upto; n++) {
    const known = b * n * a[n] + c * a[n];          /* coefficient of x^n in b x y' + c y */
    a[n + 2] = -known / ((n + 2) * (n + 1));          /* (n+2)(n+1) a_(n+2) + known = 0 */
  }
  return a;
};
Object.assign(window.ORACLE, {
  /* q31b: roots a > b (the parameters), F = A/(s-a) + B/(s-b) added over a common bottom, then read back by residues. */
  q31b: p => {
    const n1 = p.A + p.B, n0 = -(p.A * p.b + p.B * p.a);
    return [p.a, r9(resid(n1, n0, p.a, p.b)), r9(resid(n1, n0, p.b, p.a))];
  },
  /* q31c: same split with roots a, b; f(T) = A e^(aT) + B e^(bT). */
  q31c: p => {
    const n1 = p.A + p.B, n0 = -(p.A * p.b + p.B * p.a);
    const A = resid(n1, n0, p.a, p.b), B = resid(n1, n0, p.b, p.a);
    return [r9(A), r9(B), r3(A * Math.exp(p.a * p.T) + B * Math.exp(p.b * p.T))];
  },
  /* q31d: the fraction part as in q31c, plus the ramp m t (the transform m/s² belongs to m t). */
  q31d: p => {
    const n1 = p.A + p.B, n0 = -(p.A * p.b + p.B * p.a);
    const A = resid(n1, n0, p.a, p.b), B = resid(n1, n0, p.b, p.a);
    return [r9(A), r9(B), r3(A * Math.exp(p.a * p.T) + B * Math.exp(p.b * p.T) + p.m * p.T)];
  },
  /* q32b: y'' - (r1+r2) y' + r1 r2 y = 0, y(0) = 0, y'(0) = A (r1 - r2) (as the prompt's numbers show); integrate numerically. */
  q32b: p => {
    const s = p.r1 + p.r2, q = p.r1 * p.r2;
    const y = rk4((t, v) => [v[1], s * v[1] - q * v[0]], [0, p.A * (p.r1 - p.r2)], 0, p.T, 20000);
    return [p.A, r3(y[0])];
  },
  /* q32c: y(0) = A + B, y'(0) = A r1 + B r2; integrate, ask for the velocity. */
  q32c: p => {
    const s = p.r1 + p.r2, q = p.r1 * p.r2;
    const y = rk4((t, v) => [v[1], s * v[1] - q * v[0]], [p.A + p.B, p.A * p.r1 + p.B * p.r2], 0, p.T, 20000);
    return [p.A, p.B, r3(y[1])];
  },
  /* q32d: m y'' - m(r1+r2) y' + m r1 r2 y = 0 (m only scales the equation); initial data from A, B as in q32c. */
  q32d: p => {
    const s = p.r1 + p.r2, q = p.r1 * p.r2;
    const y = rk4((t, v) => [v[1], s * v[1] - q * v[0]], [p.A + p.B, p.A * p.r1 + p.B * p.r2], 0, p.T, 20000);
    return [p.A, p.B, r3(y[0])];
  },
  /* q33b: w' = k m u(t - a) - k w, w(0) = 0: settled value from a long run, then w(a + d). */
  q33b: p => {
    const st = [{ at: p.a, c: p.k * p.m }];
    return [r9(switched(p.k, st, p.a + 80 / p.k)), r3(switched(p.k, st, p.a + p.d))];
  },
  /* q33c: as q33b; ready when v(a + d) >= 0.9 of the settled voltage, judged unrounded. */
  q33c: p => {
    const st = [{ at: p.a, c: p.k * p.m }];
    const L = switched(p.k, st, p.a + 80 / p.k), v = switched(p.k, st, p.a + p.d);
    return [r9(L), r3(v), v >= 0.9 * L ? 1 : 0];
  },
  /* q33d: v' + k v = k m1 u(t - a) + k m2 u(t - a - g); asked at a + g and a + g + d. */
  q33d: p => {
    const st = [{ at: p.a, c: p.k * p.m1 }, { at: p.a + p.g, c: p.k * p.m2 }];
    return [r9(switched(p.k, st, p.a + p.g + 80 / p.k)), r3(switched(p.k, st, p.a + p.g)), r3(switched(p.k, st, p.a + p.g + p.d))];
  },
  /* q34b: convolution of f = p with g = q t at T by the midpoint rule; kick of size c at a with y' = -k y: jump to c, then decay for d. */
  q34b: p => {
    const n = 20000; let sum = 0;
    for (let i = 0; i < n; i++) { const tau = (i + 0.5) * p.T / n; sum += p.p * (p.q * (p.T - tau)); }
    const conv = sum * p.T / n;
    const y = rk4((t, v) => [-p.k * v[0]], [p.c], p.a, p.a + p.d, 2000);
    return [r9(conv), r3(y[0])];
  },
  /* q34c: kicks c1 at a1 and c2 at a1 + g: jump, decay, jump, decay. */
  q34c: p => {
    const decay = (y0, t0, t1) => rk4((t, v) => [-p.k * v[0]], [y0], t0, t1, 2000)[0];
    const before = decay(p.c1, p.a1, p.a1 + p.g), after = before + p.c2;
    return [r3(before), r3(after), r3(decay(after, p.a1 + p.g, p.a1 + p.g + p.d))];
  },
  /* q34d: h(t) = e^(-k t); y(T) = integral of c tau h(T - tau) d tau by the midpoint rule. */
  q34d: p => {
    const n = 40000; let sum = 0;
    for (let i = 0; i < n; i++) { const tau = (i + 0.5) * p.T / n; sum += p.c * tau * Math.exp(-p.k * (p.T - tau)); }
    return [r3(Math.exp(-p.k * p.T)), r3(sum * p.T / n)];
  },
  /* q35b: y'' = P x y' + Q y, i.e. y'' - P x y' - Q y = 0 (series with b = -P, c = -Q). */
  q35b: p => { const a = series(-p.P, -p.Q, p.a0, p.a1, 4); return [r9(a[2]), r9(a[3]), r9(a[4])]; },
  /* q35c: y'' + b x y' + c y = 0; first four terms at x. */
  q35c: p => {
    const a = series(p.b, p.c, p.a0, p.a1, 3);
    return [r9(a[2]), r9(a[3]), r3(a[0] + a[1] * p.x + a[2] * p.x ** 2 + a[3] * p.x ** 3)];
  },
  /* q35d: y'' + b x y' + c y = 0; coefficients a4, a5, a6. */
  q35d: p => { const a = series(p.b, p.c, p.a0, p.a1, 6); return [r9(a[4]), r9(a[5]), r9(a[6])]; },
});
})();
