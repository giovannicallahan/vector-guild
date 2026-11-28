/* Independent oracles for Waves: sound and light practice missions, file 1 of 8: q01b–q05d (game/realms/waves/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (counts over a stated time, energy conservation, SI units).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const s = Math.pow(10, d); return Math.round(x * s + (x >= 0 ? 1e-9 : -1e-9)) / s; };
const TAU = 2 * Math.PI, G = 9.8;
Object.assign(window.ORACLE, {
  /* f hertz, t seconds: period = 1/f; whole vibrations = f t. */
  q01b: p => [rd(1 / p.f, 6), rd(p.f * p.t, 6)],
  /* Arm A: N swings take N x TA seconds (TA is the period of arm A as printed through N and the time); B has period TB.
     Counts in W seconds are W / T for each arm; answer is the larger minus the smaller. */
  q01c: p => {
    const fa = p.N / (p.N * p.TA), fb = 1 / p.TB;
    return [rd(fa, 6), rd(fb, 6), rd(Math.abs(p.W / p.TB - p.W / p.TA), 6)];
  },
  /* rpm turns per 60 s; period in ms = 60000 / rpm; turns in m minutes = rpm m. */
  q01d: p => [rd(p.rpm / 60, 6), rd(60000 / p.rpm, 6), p.rpm * p.m],
  /* omega = 2 pi / T; k = m omega^2 with unrounded omega. */
  q02b: p => { const w = TAU / p.T; return [rd(w, 2), rd(p.m * w * w, 2)]; },
  /* Before: omega = sqrt(k/m1). After: mass m1 + dm, period = 2 pi sqrt(M/k); difference of unrounded periods. */
  q02c: p => {
    const T0 = TAU * Math.sqrt(p.m1 / p.k), T1 = TAU * Math.sqrt((p.m1 + p.dm) / p.k);
    return [rd(Math.sqrt(p.k / p.m1), 2), rd(T1, 2), rd(T1 - T0, 2)];
  },
  /* N bobs take N T seconds; f = N / (N T); omega = 2 pi f; m = k / omega^2 (unrounded omega). */
  q02d: p => { const f = p.N / (p.N * p.T), w = TAU * f; return [rd(f, 2), rd(w, 2), rd(p.k / (w * w), 2)]; },
  /* x = A cos(2 pi f t + ph); greatest speed = A omega. */
  q03b: p => { const w = TAU * p.f; return [rd(w, 3), rd(p.A * Math.cos(w * p.t + p.ph), 3), rd(p.A * w, 3)]; },
  /* A is in cm. a_max = A omega^2; limit al gives A_max = al / omega^2 metres, shown in cm. */
  q03c: p => {
    const w = TAU / p.T;
    return [rd(w, 2), rd(p.A / 100 * w * w, 2), rd(100 * p.al / (w * w), 2)];
  },
  /* k = m w^2 (w is the number multiplying t), omega = sqrt(k/m); v = -A omega sin(omega t + ph). */
  q03d: p => {
    const k = p.m * p.w * p.w, w = Math.sqrt(k / p.m);
    return [rd(w, 3), rd(p.A * Math.cos(w * p.t + p.ph), 3), rd(-p.A * w * Math.sin(w * p.t + p.ph), 3)];
  },
  /* E = 1/2 k A^2 (A = sqrt(2E/k)); at the centre all of E is kinetic: v = sqrt(2E/m). */
  q04b: p => {
    const E = 0.5 * p.k * p.A * p.A;
    return [rd(Math.sqrt(2 * E / p.k), 6), rd(Math.sqrt(2 * E / p.m), 2)];
  },
  /* E = 1/2 k A^2; vmax = sqrt(2E/m); at speed vt, 1/2 k x^2 = E - 1/2 m vt^2. */
  q04c: p => {
    const E = 0.5 * p.k * p.A * p.A;
    return [rd(E, 6), rd(Math.sqrt(2 * E / p.m), 2), rd(Math.sqrt(2 * (E - 0.5 * p.m * p.vt * p.vt) / p.k), 3)];
  },
  /* k = m w^2; E = 1/2 k A^2; KE = 1/2 m v^2 with v = -A w sin(w t + ph). */
  q04d: p => {
    const k = p.m * p.w * p.w, v = -p.A * p.w * Math.sin(p.w * p.t + p.ph);
    return [rd(k, 3), rd(0.5 * k * p.A * p.A, 3), rd(0.5 * p.m * v * v, 3)];
  },
  /* g = 4 pi^2 L / T^2; period at 9.8 = 2 pi sqrt(L / 9.8). */
  q05b: p => [rd(4 * Math.PI * Math.PI * p.L / (p.T * p.T), 2), rd(TAU * Math.sqrt(p.L / G), 2)],
  /* L1 and Tt are the present length (m) and wanted period (s). L_want = g Tt^2 / (4 pi^2); cut in cm. */
  q05c: p => {
    const Lw = G * p.Tt * p.Tt / (4 * Math.PI * Math.PI);
    return [rd(TAU * Math.sqrt(p.L1 / G), 2), rd(Lw, 3), rd(100 * (p.L1 - Lw), 1)];
  },
  /* omega = sqrt(g/L); theta = th0 cos(omega t); greatest angular speed th0 omega. */
  q05d: p => { const w = Math.sqrt(G / p.L); return [rd(w, 3), rd(p.th0 * Math.cos(w * p.t), 3), rd(p.th0 * w, 3)]; }
});
})();
