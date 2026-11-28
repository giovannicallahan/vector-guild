/* Independent oracles for Waves: sound and light practice missions, file 3 of 8: q11b–q15d (game/realms/waves/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const TAU = 2 * Math.PI, G = 9.8;
const vSound = Tc => 331 * Math.sqrt(1 + Tc / 273);   /* v = 331 sqrt(1 + T_C / 273), stated in q14c */
Object.assign(window.ORACLE, {
  /* W kg hangs on the line (tension W g), line of mass m and length L; the pulse runs the whole length L. */
  q11b: p => {
    const T = p.W * G, mu = p.m / p.L, v = Math.sqrt(T / mu);
    return [rd(T, 6), rd(mu, 6), rd(v, 6), rd(p.L / v, 3)];
  },
  /* t is the echo time (up and back): length = v t / 2; mass = mu x length. */
  q11c: p => {
    const v = Math.sqrt(p.F / p.mu), len = v * p.t / 2;
    return [rd(v, 6), rd(len, 6), rd(p.mu * len, 6)];
  },
  /* M kg over L m; A in cm; P = 1/2 mu A^2 w^2 v. */
  q11d: p => {
    const mu = p.M / p.L, v = Math.sqrt(p.F / mu), w = TAU * p.f, A = p.A / 100;
    return [rd(v, 6), rd(v / p.f, 2), rd(0.5 * mu * A * A * w * w * v, 2)];
  },
  /* Add the two waves point by point at theta = th, and find the amplitude as the largest sum over a full turn of theta. */
  q12b: p => {
    let best = 0;
    for (let i = 0; i < 20000; i++) { const t = TAU * i / 20000; best = Math.max(best, Math.abs(p.A * Math.sin(t) + p.A * Math.sin(t + p.phi))); }
    return [rd(best, 2), rd(p.A * Math.sin(p.th) + p.A * Math.sin(p.th + p.phi), 2)];
  },
  /* f hertz at 343 m/s; extra path d gives phi = 2 pi d / lambda; amplitude 2 p |cos(phi/2)|. */
  q12c: p => {
    const lam = 343 / p.f, phi = TAU * p.d / lam;
    return [rd(lam, 3), rd(phi, 3), rd(2 * p.p * Math.abs(Math.cos(phi / 2)), 2)];
  },
  /* phi = k dl; displacement = sum of the two waves at (x, t) computed directly; amplitude by scanning one cycle. */
  q12d: p => {
    const k = TAU / p.lam, w = TAU * p.f, phi = k * p.dl;
    let best = 0;
    for (let i = 0; i < 20000; i++) { const t = TAU * i / 20000; best = Math.max(best, Math.abs(p.A * Math.sin(t) + p.A * Math.sin(t + phi))); }
    const y = p.A * Math.sin(k * p.x - w * p.t) + p.A * Math.sin(k * (p.x + p.dl) - w * p.t);
    return [rd(phi, 3), rd(best, 2), rd(y, 2)];
  },
  /* lambda = v / f; harmonic n = 2L / lambda (loops); nodes = loops + 1. */
  q13b: p => {
    /* the printed shaking frequency is not a parameter; it is the harmonic's own, f = n v / 2L (n is the only way to recover it) */
    const f = p.n * p.v / (2 * p.L), lam = p.v / f, n = 2 * p.L / lam;
    return [rd(lam, 6), Math.round(n), Math.round(n) + 1];
  },
  /* Fundamental f1 = v / 2L so v = 2 L f1; F = mu v^2; node spacing = lambda / 2 = L / h. */
  q13c: p => {
    const v = 2 * p.L * p.f1;
    return [rd(v, 6), rd(p.mu * v * v, 6), rd(p.L / p.h, 6)];
  },
  /* Printed notes are h f1 and (h+1) f1: spacing between them is f1, the lower harmonic number is lower / spacing. */
  q13d: p => {
    const lo = p.h * p.f1, hi = (p.h + 1) * p.f1, d = hi - lo, n = lo / d;
    const v = 2 * p.L * d, mu = p.M / p.L;
    return [rd(n, 6), rd(v, 6), rd(mu * v * v, 6)];
  },
  /* Round trip is 2d at speed v. */
  q14b: p => { const v = vSound(p.Tc); return [rd(v, 2), rd(2 * p.d / v, 3)]; },
  /* v = f lambda; invert v = 331 sqrt(1 + T/273) by T = 273 ((v/331)^2 - 1). */
  q14c: p => { const v = p.f * p.lam; return [rd(v, 2), rd(273 * ((v / 331) * (v / 331) - 1), 1)]; },
  /* Harmonic h of a fixed-fixed cable has h half-wavelengths in L: lambda = 2L / h, f = vs / lambda. */
  q14d: p => {
    const f = p.vs / (2 * p.L / p.h), v = vSound(p.Tc);
    return [rd(f, 6), rd(v, 2), rd(v / f, 3)];
  },
  /* Intensity a x 10^e; N identical sources add intensities; beta = 10 log10(I / I0). */
  q15b: p => {
    const I = p.a * Math.pow(10, p.e), I0 = 1e-12;
    const b1 = 10 * Math.log10(I / I0), bk = 10 * Math.log10(p.k * I / I0);
    return [rd(b1, 1), rd(bk, 1), rd(bk - b1, 1)];
  },
  /* r2 = m r1; I1 = I0 10^(b/10) in W/m2, shown in uW/m2; inverse square. */
  q15c: p => {
    const I1 = 1e-12 * Math.pow(10, p.b1 / 10), r2 = p.m * p.r1, I2 = I1 * (p.r1 / r2) * (p.r1 / r2);
    return [rd(I1 * 1e6, 6), rd(I2 * 1e6, 6), rd(10 * Math.log10(I2 / 1e-12), 1)];
  },
  /* I = P / (4 pi r^2) at each hut, then level; the difference is quieter-by. */
  q15d: p => {
    const lv = r => 10 * Math.log10(p.P / (4 * Math.PI * r * r) / 1e-12);
    return [rd(lv(p.r1), 1), rd(lv(p.r2), 1), rd(lv(p.r1) - lv(p.r2), 1)];
  }
});
})();
