/* Independent oracles for the ODE learn missions, file a: q01–q10 (game/realms/ode/missions-a.js).
   Each one works from what the prompt states, by a different method from build(): a search, a numerical
   integrator (classical RK4 with a small step), Simpson's rule or a bisection. No game files are imported. */
(function(){ 'use strict';
/* One RK4 integration of y' = f(t, y) from t0 to t1 in n steps. */
const rk4 = (f, t0, y0, t1, n) => {
  const h = (t1 - t0) / n; let t = t0, y = y0;
  for (let i = 0; i < n; i++) {
    const a = f(t, y), b = f(t + h / 2, y + h * a / 2), c = f(t + h / 2, y + h * b / 2), d = f(t + h, y + h * c);
    y += h * (a + 2 * b + 2 * c + d) / 6; t += h;
  }
  return y;
};
const r3 = v => Math.round(v * 1e3) / 1e3;
Object.assign(window.ORACLE, {
  /* a y' + b y = 0 with b = −a k (the prompt prints "a y′ ± |b| y = 0"). Try y = e^(kt): the left side at t = 0 must be 0,
     so search for the k on a quarter grid with a·k + b = 0. Then y'(0) = k C is the stated start rate, so C = rate ÷ k. */
  q01: p => {
    const b = -p.a * p.k, rate = p.k * p.C;
    let k = NaN;
    for (let x = -80; x <= 80; x += 0.25) if (Math.abs(p.a * x + b) < 1e-9) { k = x; break; }
    return [k, rate / k];
  },
  /* Equation with highest-derivative term of kind `top` and order `o`, plus two lower terms of kinds l1, l2 (a parameter
     that indexes a bank of terms; read off from printed prompts):
       top 0: c·y^(o)   top 1: t²·y^(o)   (linear)       top 2: (y^(o))²   top 3: y·y^(o)   (nonlinear)
       lower kind 0: c·y′  1: c·y  2: t·y  3: (sin t)·y  4: t³·y′   (linear, orders 1,0,0,0,1)
       lower kind 5: y²  6: y·y′  7: sin y  8: (y′)²  9: e^y         (nonlinear, orders 0,1,0,1,0)
     The right-hand side (0, t², 4t, sin t, e^(2t)) is a function of t only, so it never changes linearity. */
  q02: p => {
    const lowerLinear = [true, true, true, true, true, false, false, false, false, false];
    const lowerOrder  = [1, 0, 0, 0, 1, 0, 1, 0, 1, 0];
    let order = p.o;
    for (const l of [p.l1, p.l2]) order = Math.max(order, lowerOrder[l]);
    const linear = (p.top === 0 || p.top === 1) && lowerLinear[p.l1] && lowerLinear[p.l2];
    return [order, linear ? 1 : 0];
  },
  /* y' = a x² + b x + c, y(x0) = y0. y(x1) = y0 + ∫ from x0 to x1 of y' dx, by Simpson's rule with 2000 panels. */
  q03: p => {
    const f = x => p.a * x * x + p.b * x + p.c;
    const n = 2000, h = (p.x1 - p.x0) / n; let s = f(p.x0) + f(p.x1);
    for (let i = 1; i < n; i++) s += f(p.x0 + i * h) * (i % 2 ? 4 : 2);
    return [p.y0 + s * h / 3];
  },
  /* y' = (x + c)(a y − a m). Slope: put the point in. Equilibrium: the constant y that makes y' = 0 at every x in −9..9
     (search a grid of 0.5 steps). */
  q04: p => {
    const g = (x, y) => (x + p.c) * (p.a * y - p.a * p.m);
    let eq = NaN;
    for (let y = -60; y <= 60; y += 0.5) {
      let all = true;
      for (let x = -9; x <= 9; x++) if (Math.abs(g(x, y)) > 1e-9) { all = false; break; }
      if (all) { eq = y; break; }
    }
    return [g(p.x1, p.y1), eq];
  },
  /* y' = p x + q y, y(0) = y0, Euler: N steps of size h, each y += h·(slope at the current point). To 3 decimal places. */
  q05: p => {
    let x = 0, y = p.y0;
    for (let i = 0; i < p.N; i++) { y += p.h * (p.p * x + p.q * y); x += p.h; }
    return [r3(y)];
  },
  /* form 0: y' = k y; form 1: y' = k t y; form 2: y' = k t ÷ y. Integrated numerically with RK4, 20000 steps from t = 0. */
  q06: p => {
    const f = p.form === 0 ? (t, y) => p.k * y : p.form === 1 ? (t, y) => p.k * t * y : (t, y) => p.k * t / y;
    return [r3(rk4(f, 0, p.y0, p.T, 20000))];
  },
  /* a y' + a·p y = a·B·e^(s t), where kind 0 has s = 0 (a constant forcing B) and kind 1 has e^(st). So y' + p y = B e^(st):
     the integrating factor is e^(pt), r = p. Solution by RK4 from t = 0 to T. */
  q07: p => {
    const s = p.kind === 0 ? 0 : p.s;
    return [p.p, r3(rk4((t, y) => p.B * Math.exp(s * t) - p.p * y, 0, p.y0, p.T, 20000))];
  },
  /* Salt x (kg): in at r·c kg/min, out at (r ÷ V)·x kg/min (volume constant). RK4 over T minutes; the long-run amount is
     where in = out, i.e. concentration c in the full volume V. */
  q08: p => [
    r3(rk4((t, x) => p.r * p.c - p.r / p.V * x, 0, p.x0, p.T, 20000)),
    p.c * p.V,
  ],
  /* y' = k ∏(y − r_i) (shown in some factors as (c − y), which flips that factor's sign; only a positive root can be
     shown flipped, bit i of `flips` for the i-th smallest root, and `perm` only orders the factors). Equilibria are the
     roots. The displayed coefficient is k, so the true coefficient is k·(−1)^(number of flipped factors). An equilibrium is
     stable when y' is positive just below it and negative just above it. j indexes the root (0 smallest). */
  q09: p => {
    const roots = [...p.r].sort((a, b) => a - b);
    let n = 0;
    roots.forEach((x, i) => { if ((p.flips >> i & 1) && x > 0) n++; });
    const kk = p.k * (n % 2 ? -1 : 1);
    const f = y => kk * roots.reduce((s, x) => s * (y - x), 1);
    const x = roots[p.j], below = f(x - 1e-3), above = f(x + 1e-3);
    return [...roots, below > 0 && above < 0 ? 1 : 0];
  },
  /* P' = a P − (a ÷ K) P², P(0) = K ÷ (A + 1), target level f·K. Carrying capacity: the P > 0 where P' = 0. Time: RK4 in
     steps of 1e-4 day until P passes the target, then a linear interpolation inside the last step. To 2 decimal places. */
  q10: p => {
    const b = p.a / p.K, F = P => p.a * P - b * P * P;
    const cap = p.a / b, target = p.f * p.K, h = 1e-4;
    let t = 0, P = p.K / (p.A + 1);
    while (P < target && t < 500) {
      const k1 = F(P), k2 = F(P + h * k1 / 2), k3 = F(P + h * k2 / 2), k4 = F(P + h * k3);
      const Pn = P + h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      if (Pn >= target) { t += h * (target - P) / (Pn - P); P = target; break; }
      P = Pn; t += h;
    }
    return [cap, Math.round(t * 100) / 100];
  },
});
})();
