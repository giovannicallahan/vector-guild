/* Independent oracles for Differential equations learn missions, file b: q11–q20 (game/realms/ode/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Shared numerical tools: a fourth-order Runge–Kutta step for a system s' = F(t, s), and rounding. */
const rk4 = (F, t0, s0, t1, n) => {
  let s = s0.slice(), t = t0; const h = (t1 - t0) / n;
  for (let i = 0; i < n; i++) {
    const a = F(t, s), b = F(t + h / 2, s.map((v, j) => v + h / 2 * a[j]));
    const c = F(t + h / 2, s.map((v, j) => v + h / 2 * b[j])), d = F(t + h, s.map((v, j) => v + h * c[j]));
    s = s.map((v, j) => v + h / 6 * (a[j] + 2 * b[j] + 2 * c[j] + d[j])); t += h;
  }
  return s;
};
const r3 = x => Math.round(x * 1000) / 1000;
/* y'' + p y' + q y = f(t), start (y0, v0): y at time t by stepping the ODE itself. */
const solve2 = (p, q, f, y0, v0, t) => rk4((u, s) => [s[1], f(u) - p * s[1] - q * s[0]], 0, [y0, v0], t, Math.max(2000, Math.ceil(t * 4000)))[0];
const clean = x => Math.round(x * 1e9) / 1e9;
/* Find where g changes sign, scanning from lo upward in steps, then bisecting. */
const rootAfter = (g, lo, hi, step) => {
  for (let x = lo; x < hi; x += step) {
    if (g(x) > 0 && g(x + step) <= 0) {
      let a = x, b = x + step;
      for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (g(m) > 0) a = m; else b = m; }
      return (a + b) / 2;
    }
  }
  return NaN;
};

Object.assign(window.ORACLE, {
  /* Step the stated differential equation numerically from the starting value; the equilibrium is where the
     right-hand side stops being positive (found by scanning and bisecting). fam picks the story:
     tank x' = r c − (r/V) x, log P' = rP(1 − P/K), cool T' = −k(T − Ta). */
  q11: p => {
    let f, x0, lo, hi, step;
    if (p.fam === 'tank') { f = x => p.r * p.c - (p.r / p.V) * x; x0 = p.x0; }
    else if (p.fam === 'log') { f = x => p.r * x * (1 - x / p.K); x0 = p.P0; }
    else { f = x => -p.k * (x - p.Ta); x0 = p.T0; }
    const val = rk4((u, s) => [f(s[0])], 0, [x0], p.t, 20000)[0];
    /* Equilibrium: the point where f goes from positive to negative (stable one), non-zero for the logistic case. */
    let eq = rootAfter(f, 0.001, 20000, 0.25);
    if (!(eq > 0)) eq = NaN;
    return [r3(val), Math.round(eq * 1e6) / 1e6];
  },
  /* y'' + a... : the two basis functions are exp (e^(at), e^(bt)) or trig (cos wt, sin wt). Their values and slopes at
     0 give the starting data the prompt states; the constants are then found by searching whole-number pairs that
     reproduce both starting values. */
  q12: p => {
    const trig = p.fam === 'trig';
    const val = [1, trig ? 0 : 1];                // basis values at t = 0
    const slope = trig ? [0, p.w] : [p.a, p.b];    // basis slopes at t = 0 (cos: −w sin 0 = 0, sin: w cos 0 = w)
    const y0 = p.C1 * val[0] + p.C2 * val[1], v0 = p.C1 * slope[0] + p.C2 * slope[1];
    for (let c1 = -60; c1 <= 60; c1++) for (let c2 = -60; c2 <= 60; c2++)
      if (c1 * val[0] + c2 * val[1] === y0 && c1 * slope[0] + c2 * slope[1] === v0) return [c1, c2];
    return [NaN, NaN];
  },
  /* y'' + P y' + Q y = 0 with roots r1, r2 (P = −(r1 + r2), Q = r1 r2 as the prompt prints them). The roots are found
     by scanning integers for r² + Pr + Q = 0; y(t) is found by stepping the ODE from y(0) = C1 + C2, y'(0) = r1C1 + r2C2. */
  q13: p => {
    const P = -(p.r1 + p.r2), Q = p.r1 * p.r2, roots = [];
    for (let r = -40; r <= 40; r++) if (r * r + P * r + Q === 0) roots.push(r);
    const y = solve2(P, Q, () => 0, p.C1 + p.C2, p.r1 * p.C1 + p.r2 * p.C2, p.t);
    return [roots[0], roots[roots.length - 1], r3(y)];
  },
  /* y'' + P y' + Q y = 0 with P = −2r, Q = r² (printed e.g. y'' + 6y' + 9y = 0). The repeated root is found by scanning
     integers for r² + Pr + Q = 0; C1 = y(0), and C2 comes from the stepped value of y(1) = (C1 + C2)e^r. */
  q14: p => {
    const P = -2 * p.r, Q = p.r * p.r;
    let root = NaN;
    for (let r = -40; r <= 40; r++) if (r * r + P * r + Q === 0) root = r;
    const C1 = p.y0;
    const y1 = solve2(P, Q, () => 0, p.y0, p.v0, 1);
    const C2 = y1 * Math.exp(-root) - C1;
    return [root, C1, Math.round(C2 * 1e6) / 1e6];
  },
  /* y'' + P y' + Q y = 0 with P = −2a, Q = a² + b²: scan for the real part and for b > 0 with b² = Q − a².
     y(0) = C1, y'(0) = aC1 + bC2 as the prompt states; y(t) from stepping the ODE. */
  q15: p => {
    const P = -2 * p.a, Q = p.a * p.a + p.b * p.b;
    const a = -P / 2; let b = NaN;
    for (let k = 1; k <= 40; k++) if (k * k === Q - a * a) b = k;
    const y = solve2(P, Q, () => 0, p.C1, p.a * p.C1 + p.b * p.C2, p.t);
    return [a, b, r3(y)];
  },
  /* Mass m, spring k = m w², damper c. ω0 by searching whole numbers with m ω0² = k; period 2π/ω0; damping from the
     sign of c² − 4mk (positive: two real roots, overdamped; zero: critical; negative: underdamped). */
  q16: p => {
    const k = p.m * p.w * p.w;
    let w0 = NaN; for (let w = 1; w <= 60; w++) if (p.m * w * w === k) w0 = w;
    const disc = p.c * p.c - 4 * p.m * k;
    return [w0, r3(2 * Math.PI / w0), disc > 0 ? 1 : disc === 0 ? 2 : 3];
  },
  /* k = m w². The critical c is the whole number where c² = 4mk (found by scanning); x(t) from stepping
     m x'' + c x' + k x = 0 from x(0) = x0, x'(0) = v0. */
  q17: p => {
    const k = p.m * p.w * p.w; let c = NaN;
    for (let g = 1; g <= 400; g++) if (g * g === 4 * p.m * k) c = g;
    const x = solve2(c / p.m, k / p.m, () => 0, p.x0, p.v0, p.t);
    return [c, r3(x)];
  },
  /* Push for the exp family: (k² + pk + q)C e^(kt) + qD; for the poly family: qC t + (pC + qD). That push is what the
     prompt prints. Unknowns (C, D) are found by applying the equation's left side to the two guess terms at t = 0 and
     t = 1 and solving the 2 × 2 system for the coefficients that reproduce the push exactly. */
  q18: p => {
    const exp = p.fam === 'exp';
    const push = exp ? t => (p.k * p.k + p.p * p.k + p.q) * p.C * Math.exp(p.k * t) + p.q * p.D
                     : t => p.q * p.C * t + (p.p * p.C + p.q * p.D);
    /* L[phi] = phi'' + p phi' + q phi for each guess term, using the term's own derivatives. */
    const L1 = exp ? t => (p.k * p.k + p.p * p.k + p.q) * Math.exp(p.k * t) : t => p.q * t + p.p;
    const L2 = () => p.q;                            // second term is the constant 1 (its derivatives vanish)
    const ts = [0, 1], M = ts.map(t => [L1(t), L2(t)]), rhs = ts.map(push);
    const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    const C = (rhs[0] * M[1][1] - M[0][1] * rhs[1]) / det, D = (M[0][0] * rhs[1] - rhs[0] * M[1][0]) / det;
    return [clean(C), clean(D)];
  },
  /* Push a cos wt + b sin wt as printed: a = (q − w²)A + p w B, b = (q − w²)B − p w A. Guess A cos wt + B sin wt; the
     coefficients are found by matching the push at t = 0 and at wt = π/2, a 2 × 2 solve. */
  q19: p => {
    const g = p.q - p.w * p.w;
    const a = g * p.A + p.p * p.w * p.B, b = g * p.B - p.p * p.w * p.A;
    /* L[cos wt] = g cos wt − p w sin wt;  L[sin wt] = g sin wt + p w cos wt. At t = 0 the push is a (cos 1, sin 0);
       at wt = π/2 the push is b (cos 0, sin 1). Read the two equations off those points. */
    const eq1 = [g, p.p * p.w, a], eq2 = [-p.p * p.w, g, b];
    const det = eq1[0] * eq2[1] - eq1[1] * eq2[0];
    const A = (eq1[2] * eq2[1] - eq1[1] * eq2[2]) / det, B = (eq1[0] * eq2[2] - eq1[2] * eq2[0]) / det;
    return [clean(A), clean(B)];
  },
  /* m x'' + c x' + k x = F cos wt. Step the equation until the start-up wobble has gone (decay is at least e^(−c t/2m)),
     then fit a cos wt + b sin wt to the last two whole periods by averaging against cos and sin; C = √(a² + b²). */
  q20: p => {
    const per = 2 * Math.PI / p.w, N = 600, dt = per / N;
    const nPer = Math.ceil(160 / per) + 2;
    const F = (t, s) => [s[1], (p.F * Math.cos(p.w * t) - p.c * s[1] - p.k * s[0]) / p.m];
    let s = [0, 0], t = 0;
    const step = () => {
      const h = dt, a = F(t, s), b = F(t + h / 2, s.map((v, j) => v + h / 2 * a[j]));
      const c = F(t + h / 2, s.map((v, j) => v + h / 2 * b[j])), d = F(t + h, s.map((v, j) => v + h * c[j]));
      s = s.map((v, j) => v + h / 6 * (a[j] + 2 * b[j] + 2 * c[j] + d[j])); t += h;
    };
    for (let i = 0; i < (nPer - 2) * N; i++) step();
    let sa = 0, sb = 0; const M = 2 * N;
    for (let i = 0; i < M; i++) { sa += s[0] * Math.cos(p.w * t); sb += s[0] * Math.sin(p.w * t); step(); }
    const a = 2 * sa / M, b = 2 * sb / M;
    return [r3(Math.hypot(a, b))];
  },
});
})();
