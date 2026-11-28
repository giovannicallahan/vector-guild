/* Independent oracles for Differential equations practice missions, file 4 of 8: q16b–q20d (game/realms/ode/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r3 = x => Math.round(x * 1000) / 1000;
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Complex numbers as [re, im]. */
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const csqrt = a => { const r = Math.hypot(a[0], a[1]), re = Math.sqrt((r + a[0]) / 2), im = Math.sqrt((r - a[0]) / 2); return [re, a[1] < 0 ? -im : im]; };
/* Roots of m r² + c r + k = 0 as complex pairs. */
const roots = (m, c, k) => { const s = csqrt([c * c - 4 * m * k, 0]); return [cdiv([-c + s[0], s[1]], [2 * m, 0]), cdiv([-c - s[0], -s[1]], [2 * m, 0])]; };
/* Damping class by looking at the roots: 1 two real different, 2 repeated, 3 complex. */
const dampCode = (m, c, k) => { const [r1, r2] = roots(m, c, k); if (Math.abs(r1[1]) > 1e-9) return 3; return Math.abs(r1[0] - r2[0]) < 1e-9 ? 2 : 1; };
/* Gaussian elimination with partial pivoting for A z = b. */
const solve = (A, b) => {
  const n = b.length, M = A.map((row, i) => row.concat([b[i]]));
  for (let i = 0; i < n; i++) {
    let piv = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[piv][i])) piv = r;
    [M[i], M[piv]] = [M[piv], M[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const f = M[r][i] / M[i][i]; for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c]; }
  }
  return M.map((row, i) => row[n] / row[i]);
};
/* RK4 simulation of m x'' + c x' + k x = 0, returning x at time T. */
const simulate = (m, c, k, x0, v0, T) => {
  const steps = Math.max(1, Math.round(T / 1e-4)), h = T / steps;
  let x = x0, v = v0;
  const f = (x, v) => [v, -(c * v + k * x) / m];
  for (let i = 0; i < steps; i++) {
    const a = f(x, v), b = f(x + h / 2 * a[0], v + h / 2 * a[1]), d = f(x + h / 2 * b[0], v + h / 2 * b[1]), e = f(x + h * d[0], v + h * d[1]);
    x += h / 6 * (a[0] + 2 * b[0] + 2 * d[0] + e[0]); v += h / 6 * (a[1] + 2 * b[1] + 2 * d[1] + e[1]);
  }
  return x;
};
/* Steady-state of m x'' + c x' + k x = F cos wt by complex impedance: amplitude |F / (k - m w² + i c w)|. */
const amp = (m, c, k, F, w) => { const z = cdiv([F, 0], [k - m * w * w, c * w]); return Math.hypot(z[0], z[1]); };
/* Operator y'' + p y' + q y applied to each guess term, as rows of coefficients on the basis in the same order. */
const forcedCosSin = (p, q, w, f, g) => { /* rhs f cos wt + g sin wt: complex amplitude Y = (f - i g) / (q - w² + i p w), A = Re Y, B = -Im Y */
  const Y = cdiv([f, -g], [q - w * w, p * w]); return [Y[0], -Y[1]];
};
Object.assign(window.ORACLE, {
  /* q16b: m, w (k = m w², so ω₀ should be w), c. Roots of the characteristic equation give the damping code. */
  q16b: p => {
    const k = p.m * p.w * p.w, w0 = Math.sqrt(k / p.m);
    return [r6(w0), r3(2 * Math.PI / w0), dampCode(p.m, p.c, k)];
  },
  /* q16c: total mass M0 + p (kg); w is an index with k = m w². */
  q16c: p => {
    const m = p.M0 + p.p, k = m * p.w * p.w;
    return [r6(Math.sqrt(k / m)), dampCode(m, p.c, k)];
  },
  /* q16d: underdamped: the complex root a + bi of m r² + c r + k = 0. */
  q16d: p => {
    const r = roots(p.m, p.c, p.k)[0], b = Math.abs(r[1]);
    return [r6(r[0]), r3(b), r3(2 * Math.PI / b)];
  },
  /* q17b: w is an index with k = m w². Search for the c whose roots are repeated, then simulate. */
  q17b: p => {
    const k = p.m * p.w * p.w; let c = 0;
    while (Math.abs(c * c - 4 * p.m * k) > 1e-9 && c < 10000) c++;
    return [c, r3(simulate(p.m, c, k, p.x0, p.v0, p.t))];
  },
  /* q17c: m is the mass; w is an index with c = 2 m w and k = m w². Search for the mass that makes c² = 4 m k, then simulate. */
  q17c: p => {
    const c = 2 * p.m * p.w, k = p.m * p.w * p.w; let m = 1;
    while (c * c !== 4 * m * k && m < 10000) m++;
    return [m, r3(simulate(m, c, k, p.x0, p.v0, p.t))];
  },
  /* q17d: w is an index with k = m w²; d is the index with C₂ = -d, so x′(0) = -(d + w x0). Simulate to find the zero crossing. */
  q17d: p => {
    const k = p.m * p.w * p.w; let c = 0;
    while (Math.abs(c * c - 4 * p.m * k) > 1e-9 && c < 10000) c++;
    const v0 = -(p.d + p.w * p.x0), C2 = v0 + p.w * p.x0;
    const h = 1e-4; let x = p.x0, v = v0, t = 0;
    const f = (x, v) => [v, -(c * v + k * x) / p.m];
    for (let i = 0; i < 2e6; i++) {
      const a = f(x, v), b = f(x + h / 2 * a[0], v + h / 2 * a[1]), d = f(x + h / 2 * b[0], v + h / 2 * b[1]), e = f(x + h * d[0], v + h * d[1]);
      const xn = x + h / 6 * (a[0] + 2 * b[0] + 2 * d[0] + e[0]), vn = v + h / 6 * (a[1] + 2 * b[1] + 2 * d[1] + e[1]);
      if (xn <= 0) { t += h * x / (x - xn); break; }
      x = xn; v = vn; t += h;
    }
    return [c, C2, r3(t)];
  },
  /* q18b: fam is a text index (poly or exp); k is the exponent for exp. Match coefficients: operator on the guess terms equals the push. */
  q18b: p => {
    if (p.fam === 'exp') {
      const a = p.C * (p.k * p.k + p.p * p.k + p.q), b = p.q * p.D;
      const [C, D] = solve([[p.k * p.k + p.p * p.k + p.q, 0], [0, p.q]], [a, b]);
      return [r6(C), r6(D)];
    }
    /* y = C t + D: y'' + p y' + q y = q C t + (p C + q D) */
    const [C, D] = solve([[p.q, 0], [p.p, p.q]], [p.q * p.C, p.p * p.C + p.q * p.D]);
    return [r6(C), r6(D)];
  },
  /* q18c: as q18b, then evaluate yₚ at T. */
  q18c: p => {
    let C, D, y;
    if (p.fam === 'exp') {
      const L = p.k * p.k + p.p * p.k + p.q;
      [C, D] = solve([[L, 0], [0, p.q]], [p.C * L, p.q * p.D]);
      y = C * Math.exp(p.k * p.T) + D;
    } else {
      [C, D] = solve([[p.q, 0], [p.p, p.q]], [p.q * p.C, p.p * p.C + p.q * p.D]);
      y = C * p.T + D;
    }
    return [r6(C), r6(D), r3(y)];
  },
  /* q18d: guess C e^{kt} + D t + F; push = C(k²+pk+q) e^{kt} + qD t + (pD + qF). */
  q18d: p => {
    const L = p.k * p.k + p.p * p.k + p.q;
    const s = solve([[L, 0, 0], [0, p.q, 0], [0, p.p, p.q]], [p.C * L, p.q * p.D, p.p * p.D + p.q * p.F]);
    return s.map(r6);
  },
  /* q19b: push F cos wt: complex amplitude. */
  q19b: p => { const [A, B] = forcedCosSin(p.p, p.q, p.w, p.F, 0); return [r3(A), r3(B)]; },
  /* q19c: A, B are the intended answers; the printed push is f cos + g sin with f = (q-w²)A + p w B, g = -p w A + (q-w²)B. */
  q19c: p => {
    const f = (p.q - p.w * p.w) * p.A + p.p * p.w * p.B, g = -p.p * p.w * p.A + (p.q - p.w * p.w) * p.B;
    const [A, B] = forcedCosSin(p.p, p.q, p.w, f, g);
    return [r6(A), r6(B), r3(Math.hypot(A, B))];
  },
  /* q19d: line part q C t + (p C + q D), turning part f cos + g sin built from A, B. Unknowns C, D, A, B solved separately. */
  q19d: p => {
    const s = p.q - p.w * p.w;
    const f = s * p.A + p.p * p.w * p.B, g = -p.p * p.w * p.A + s * p.B;
    const C = (p.q * p.C) / p.q, D = ((p.p * p.C + p.q * p.D) - p.p * C) / p.q;
    const [A, B] = forcedCosSin(p.p, p.q, p.w, f, g);
    return [r6(C), r6(D), r6(A), r6(B)];
  },
  /* q20b: steady amplitude of m x'' + c x' + k x = F sin wt. */
  q20b: p => [r3(amp(p.m, p.c, p.k, p.F, p.w))],
  /* q20c: amplitude at force F, then the force that gives amplitude L (amplitude is proportional to force). */
  q20c: p => {
    const C = amp(p.m, p.c, p.k, p.F, p.w);
    return [r3(C), r3(p.F * p.L / C)];
  },
  /* q20d: w0 is the natural frequency (k = m w0²); a is the ratio of the other speed to ω₀. */
  q20d: p => {
    const k = p.m * p.w0 * p.w0;
    return [r6(Math.sqrt(k / p.m)), r3(amp(p.m, p.c, k, p.F, p.w0)), r3(amp(p.m, p.c, k, p.F, p.a * p.w0))];
  },
});
})();
