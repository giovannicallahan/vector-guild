/* Independent oracles for Differential equations practice missions, file 3 of 8: q11b–q15d (game/realms/ode/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
/* Fourth-order Runge-Kutta for a first-order equation u' = f(u), from u0 over time T. */
const rk1 = (f, u0, T) => {
  const n = 20000, h = T / n; let u = u0;
  for (let i = 0; i < n; i++) {
    const k1 = f(u), k2 = f(u + h * k1 / 2), k3 = f(u + h * k2 / 2), k4 = f(u + h * k3);
    u += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
  }
  return u;
};
/* Second-order equation y'' + P y' + Q y = 0 as a system, stepped by Runge-Kutta; returns [y, y'] at time T. */
const rk2 = (P, Q, y0, v0, T, n) => {
  n = n || 20000; const h = T / n; let y = y0, v = v0;
  const f = (a, b) => [b, -P * b - Q * a];
  for (let i = 0; i < n; i++) {
    const k1 = f(y, v), k2 = f(y + h * k1[0] / 2, v + h * k1[1] / 2), k3 = f(y + h * k2[0] / 2, v + h * k2[1] / 2), k4 = f(y + h * k3[0], v + h * k3[1]);
    y += h * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6; v += h * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
  }
  return [y, v];
};
/* The value of the solution at time T. */
const yAt = (P, Q, y0, v0, T) => rk2(P, Q, y0, v0, T)[0];
/* The two real roots of r² + P r + Q = 0 found by scanning whole numbers; smaller first. */
const intRoots = (P, Q) => { const out = []; for (let r = -200; r <= 200; r++) if (r * r + P * r + Q === 0) out.push(r); return out; };
/* First time after t = 0 at which the solution crosses zero: scan in small steps, then bisect. */
const firstZero = (P, Q, y0, v0, tMax) => {
  const g = t => yAt(P, Q, y0, v0, t), dt = 0.01; let a = dt, ga = g(a);
  for (; a < tMax; a += dt) { const b = a + dt, gb = g(b); if (ga * gb <= 0) { let lo = a, hi = b; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; } ga = gb; }
  return NaN;
};
/* Brine tank x' = r c − (r/V) x: equilibrium by bisection on the sign of the right-hand side. */
const tankEq = p => { let lo = 0, hi = 1e6; const f = x => p.r * p.c - (p.r / p.V) * x; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; } return (lo + hi) / 2; };
Object.assign(window.ORACLE, {
  /* q11b: fam is only an index into two stories. "warm": T' = k(Tg − T), T(0) = T0. "duck": A' = r A (1 − A/K), A(0) = P0.
     The equilibrium is found by bisection on the sign of the right-hand side (warm) or is the carrying capacity K (duck, the nonzero root). */
  q11b: p => {
    if (p.fam === 'warm') {
      const f = T => p.k * (p.Tg - T); let lo = -1e3, hi = 1e3;
      for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
      return [rd(rk1(f, p.T0, p.t), 3), rd((lo + hi) / 2, 6)];
    }
    const f = A => p.r * A * (1 - A / p.K); let lo = p.K / 2, hi = 10 * p.K;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
    return [rd(rk1(f, p.P0, p.t), 3), rd((lo + hi) / 2, 6)];
  },
  /* q11c: x' = r c − (r/V) x, x(0) = x0; answers: kg entering per minute, equilibrium, x(t). */
  q11c: p => {
    const f = x => p.r * p.c - (p.r / p.V) * x;
    return [rd(p.r * p.c, 6), rd(tankEq(p), 6), rd(rk1(f, p.x0, p.t), 3)];
  },
  /* q11d: x' = r c − (r/V) x. G is the starting gap below the equilibrium (x(0) = equilibrium − G) and den sets the valve level
     (valve = equilibrium − G ÷ den); both are read off the printed numbers in the prompt. Time found by scan and bisection. */
  q11d: p => {
    const eq = tankEq(p), x0 = eq - p.G, valve = eq - p.G / p.den, k = p.r / p.V;
    const f = x => p.r * p.c - k * x;
    let lo = 0, hi = 1; while (rk1(f, x0, hi) < valve) hi *= 2;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (rk1(f, x0, m) < valve) lo = m; else hi = m; }
    return [rd(eq, 6), rd((lo + hi) / 2, 2)];
  },
  /* q12b: fam "exp": y'' − (a+b) y' + ab y = 0 with y = C1 e^(at) + C2 e^(bt); fam "trig": y'' + w² y = 0, y = C1 cos wt + C2 sin wt.
     Starting values worked out from the solution, then the 2×2 system solved back by Cramer's rule. */
  q12b: p => {
    let y0, v0, m11, m12, m21, m22;
    if (p.fam === 'exp') { y0 = p.C1 + p.C2; v0 = p.a * p.C1 + p.b * p.C2; m11 = 1; m12 = 1; m21 = p.a; m22 = p.b; }
    else { y0 = p.C1; v0 = p.w * p.C2; m11 = 1; m12 = 0; m21 = 0; m22 = p.w; }
    const d = m11 * m22 - m12 * m21;
    return [rd((y0 * m22 - m12 * v0) / d, 6), rd((m11 * v0 - m21 * y0) / d, 6)];
  },
  /* q12c: y'' + w² y = 0; the tip starts at C1 cm and moves at w·C2 cm/s (negative = left). Answers: y'(0), C2, y(t).
     y'(0) by a small symmetric difference of C1 cos wt + C2 sin wt, then C2 by solving y'(0) = w C2 by search over tenths. */
  q12c: p => {
    const y = t => p.C1 * Math.cos(p.w * t) + p.C2 * Math.sin(p.w * t), h = 1e-6;
    const v0 = rd((y(h) - y(-h)) / (2 * h), 4);
    let c2 = -100; while (Math.abs(p.w * c2 - v0) > 1e-3 && c2 < 100) c2 += 0.01;
    return [v0, rd(c2, 2), rd(yAt(0, p.w * p.w, p.C1, v0, p.t), 3)];
  },
  /* q12d: y'' − (a+b) y' + ab y = 0, y(0) = C1 + C2, y'(0) = a C1 + b C2; answers C1, C2, y(t) (the ODE stepped numerically). */
  q12d: p => {
    const y0 = p.C1 + p.C2, v0 = p.a * p.C1 + p.b * p.C2;
    let found = null;
    for (let c1 = -60; c1 <= 60 && !found; c1++) for (let c2 = -60; c2 <= 60; c2++) if (c1 + c2 === y0 && p.a * c1 + p.b * c2 === v0) { found = [c1, c2]; break; }
    return [found[0], found[1], rd(yAt(-(p.a + p.b), p.a * p.b, y0, v0, p.t), 3)];
  },
  /* q13b: roots r1 < r2 of the characteristic equation; y(0) = C1 + C2, y'(0) = r1 C1 + r2 C2. The roots are found as the whole
     numbers that satisfy r² + P r + Q = 0 for the equation y'' + P y' + Q y = 0 printed in the prompt. */
  q13b: p => {
    const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, rs = intRoots(P, Q);
    return [rs[0], rs[1], rd(yAt(P, Q, p.C1 + p.C2, p.r1 * p.C1 + p.r2 * p.C2, p.t), 3)];
  },
  /* q13c: released from rest: y'(0) = 0 and y(0) = j (r2 − r1), read off the prompt's printed starting angle (j is only a
     scale that makes the constants whole numbers). */
  q13c: p => {
    const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, rs = intRoots(P, Q);
    return [rs[0], rs[1], rd(yAt(P, Q, p.j * (p.r2 - p.r1), 0, p.t), 3)];
  },
  /* q13d: y = C1 e^(r1 t) + C2 e^(r2 t); the first time after 0 at which the numerical solution crosses zero. */
  q13d: p => {
    const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, rs = intRoots(P, Q);
    return [rs[0], rs[1], rd(firstZero(P, Q, p.C1 + p.C2, p.r1 * p.C1 + p.r2 * p.C2, 10), 3)];
  },
  /* q14b: repeated root r: y'' − 2r y' + r² y = 0, y(0) = y0, y'(0) = v0. C2 is read from the numerical solution as
     y(1) e^(−r) − y0 (because y = (C1 + C2 t) e^(rt) with C1 = y0). */
  q14b: p => {
    const P = -2 * p.r, Q = p.r * p.r, rs = intRoots(P, Q);
    const c2 = yAt(P, Q, p.y0, p.v0, 1) * Math.exp(-rs[0]) - p.y0;
    return [rs[0], rd(c2, 6), rd(yAt(P, Q, p.y0, p.v0, p.t), 3)];
  },
  /* q14c: y'' + c y' + s² y = 0 with c² = 4 s² and c > 0 (c found by search); repeated root from r² + c r + s² = 0 by search;
     y(0) = y0, y'(0) = v0. */
  q14c: p => {
    const k = p.s * p.s; let c = 0; while (c * c < 4 * k) c++;
    const rs = intRoots(c, k);
    return [c, rs[0], rd(yAt(c, k, p.y0, p.v0, p.t), 3)];
  },
  /* q14d: y = (C1 + C2 t) e^(rt) with the bracket zero at t0 (so y(0) = C1 = −C2 t0 and y'(0) = r C1 + C2).
     The crossing is found by scanning the numerical solution for the sign change. */
  q14d: p => {
    const P = -2 * p.r, Q = p.r * p.r, y0 = -p.C2 * p.t0, v0 = p.r * y0 + p.C2;
    const c2 = yAt(P, Q, y0, v0, 1) * Math.exp(-p.r) - y0;
    return [p.r, rd(c2, 6), rd(firstZero(P, Q, y0, v0, 20), 1)];
  },
  /* q15b: roots a ± bi of r² + P r + Q = 0 with P = −2a, Q = a² + b²; recovered from P and Q by scanning for the
     vertex (a) and the imaginary part (b); y(0) = C1, y'(0) = a C1 + b C2. */
  q15b: p => {
    const P = -2 * p.a, Q = p.a * p.a + p.b * p.b;
    let a = -50; while (Math.abs(2 * a + P) > 1e-9) a += 0.5;
    let b = 0; while (Math.abs(b * b - (Q - a * a)) > 1e-9 && b < 100) b += 0.5;
    return [a, b, rd(yAt(P, Q, p.C1, a * p.C1 + b * p.C2, p.t), 3)];
  },
  /* q15c: m y'' + c y' + k y = 0 with c = −2 a m and k = m (a² + b²); a, b from the quadratic formula; y(0) = C1, y'(0) = a C1 + b C2. */
  q15c: p => {
    const c = -2 * p.a * p.m, k = p.m * (p.a * p.a + p.b * p.b), disc = c * c - 4 * p.m * k;
    const a = -c / (2 * p.m), b = Math.sqrt(-disc) / (2 * p.m);
    return [a, b, rd(yAt(c / p.m, k / p.m, p.C1, a * p.C1 + b * p.C2, p.t), 3)];
  },
  /* q15d: y'' − 2a y' + (a² + b²) y = 0, y(0) = 0, y'(0) = b C2; y evaluated at t = π/(2b) from the numerical solution. */
  q15d: p => {
    const P = -2 * p.a, Q = p.a * p.a + p.b * p.b;
    return [p.a, p.b, rd(yAt(P, Q, 0, p.b * p.C2, Math.PI / (2 * p.b)), 3)];
  },
});
})();
