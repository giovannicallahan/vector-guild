/* Independent oracles for Waves: sound and light practice missions, file 2 of 8: q06b–q10d (game/realms/waves/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const TAU = 2 * Math.PI, G = 9.8;
Object.assign(window.ORACLE, {
  /* Resonance: f0 = sqrt(k/m) / 2 pi. A = A0 exp(-b t / 2 m). */
  q06b: p => [rd(Math.sqrt(p.k / p.m) / TAU, 2), rd(p.A0 * Math.exp(-p.b * p.t / (2 * p.m)), 2)],
  /* w0 = 2 pi f; k = m w0^2 with unrounded w0; then damped amplitude. */
  q06c: p => { const w = TAU * p.f; return [rd(p.m * w * w, 1), rd(p.A0 * Math.exp(-p.b * p.t / (2 * p.m)), 2)]; },
  /* T = 1/f; L = g (T / 2 pi)^2; damped amplitude. */
  q06d: p => [rd(G * Math.pow(1 / p.f / TAU, 2), 3), rd(p.A0 * Math.exp(-p.b * p.t / (2 * p.m)), 2)],
  /* N bobs in tt seconds: f = N/tt, v = f lam; new lam = v T2. */
  q07b: p => { const v = p.N / p.tt * p.lam; return [rd(v, 2), rd(v * p.T2, 2)]; },
  /* v = L/t; lam = v/f; wavelengths on cable = L / lam. */
  q07c: p => { const v = p.L / p.t, lam = v / p.f; return [rd(lam, 2), rd(p.L / lam, 1)]; },
  /* w = sqrt(k/m); f = w/2pi; lam = v/f. */
  q07d: p => { const f = Math.sqrt(p.k / p.m) / TAU; return [rd(f, 3), rd(p.v / f, 3)]; },
  /* k = 2 pi / lam; w = 2 pi f; v = w / k. */
  q08b: p => [rd(TAU / p.k, 2), rd(p.w / TAU, 2), rd(p.w / p.k, 2)],
  /* y = A sin(kx - wt), lam in m and f in Hz as printed; x1 is gauge A, x1 + dx is gauge B. */
  q08c: p => {
    const k = TAU / p.lam, w = TAU * p.f, y = x => p.A * Math.sin(k * x - w * p.t);
    return [rd(y(p.x1), 2), rd(y(p.x1 + p.dx), 2)];
  },
  /* f = v/lam; w = 2 pi f; greatest speed A w; y = A sin(kx - wt). */
  q08d: p => {
    const f = p.v / p.lam, w = TAU * f, k = TAU / p.lam;
    return [rd(w, 3), rd(p.A * w, 2), rd(p.A * Math.sin(k * p.x - w * p.t), 2)];
  },
  /* mu = linear density (kg/m; the wire mass printed is mu L); F = H g; v = sqrt(F/mu); H = mu v2^2 / g. */
  q09b: p => [rd(Math.sqrt(p.H * G / p.mu), 2), rd(p.mu * p.v2 * p.v2 / G, 2)],
  /* Round trip 2L in t: v = 2L/t; F = mu v^2. */
  q09c: p => { const v = 2 * p.L / p.t; return [rd(v, 2), rd(p.mu * v * v, 1)]; },
  /* v = sqrt(F/mu); lam = v/f; new F = mu (lam2 f)^2. */
  q09d: p => [rd(Math.sqrt(p.F / p.mu) / p.f, 3), rd(p.mu * Math.pow(p.lam2 * p.f, 2), 2)],
  /* P = I 4 pi r1^2; inverse square for the new intensity. */
  q10b: p => [rd(p.I1 * 4 * Math.PI * p.r1 * p.r1, 1), rd(p.I1 * p.r1 * p.r1 / (p.r2 * p.r2), 3)],
  /* A in cm -> metres; P = 1/2 mu A^2 w^2 v; time = E / P. */
  q10c: p => {
    const w = TAU * p.f, A = p.A / 100, P = 0.5 * p.mu * A * A * w * w * p.v;
    return [rd(P, 2), rd(p.E / P, 2)];
  },
  /* v = sqrt(F/mu); P = 1/2 mu A^2 w^2 v (A in m); new A = A sqrt(P2/P). */
  q10d: p => {
    const v = Math.sqrt(p.F / p.mu), w = TAU * p.f, A = p.A / 100, P = 0.5 * p.mu * A * A * w * w * v;
    return [rd(P, 3), rd(p.A * Math.sqrt(p.P2 / P), 2)];
  }
});
})();
