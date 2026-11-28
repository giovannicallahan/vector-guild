/* Independent oracles for Waves: sound and light learn missions, file a: q01–q10 (game/realms/waves/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. Answers are rounded to the places each prompt states, from the
   unrounded working. */
(function(){ 'use strict';
const rnd = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-12) * f) / f; };
const TAU = 2 * Math.PI;
/* Bisection: smallest x in [lo, hi] where the rising function g(x) reaches target. */
const solveUp = (g, target, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
Object.assign(window.ORACLE, {
  /* N full swings in a total time N·T (the prompt prints N and the total time; T is the period the generator chose,
     so the printed total is N × T). Period = total ÷ N; frequency = swings counted ÷ total time. */
  q01: p => { const total = p.N * p.T; return [rnd(total / p.N, 6), rnd(p.N / total, 6)]; },
  /* ω = √(k/m) by bisection on ω² = k/m; T from the full-turn angle 2π at ω radians per second. */
  q02: p => {
    const w = solveUp(x => x * x, p.k / p.m, 0, 1e4);
    return [rnd(w, 2), rnd(TAU / w, 2)];
  },
  /* x(t) = A cos(ωt + φ). Position from the phase. Greatest speed and acceleration found by scanning a whole period
     of the exact derivatives −Aω sin and −Aω² cos for their largest size. */
  q03: p => {
    const x = p.A * Math.cos(p.w * p.t + p.ph);
    const n = 20000; let vm = 0, am = 0;
    for (let i = 0; i <= n; i++) {
      const u = TAU * i / n; /* the phase over one whole cycle */
      vm = Math.max(vm, Math.abs(p.A * p.w * Math.sin(u)));
      am = Math.max(am, Math.abs(p.A * p.w * p.w * Math.cos(u)));
    }
    return [rnd(x, 3), rnd(vm, 6), rnd(am, 6)];
  },
  /* Total energy = spring energy at the turning point (speed zero). At x the kinetic part is what is left; solve
     ½ m v² = E − ½ k x² for v by bisection on v. */
  q04: p => {
    const E = 0.5 * p.k * p.A * p.A;
    const ke = E - 0.5 * p.k * p.x * p.x;
    const v = solveUp(s => 0.5 * p.m * s * s, ke, 0, 1e3);
    return [rnd(E, 6), rnd(v, 2)];
  },
  /* T = 2π√(L/g), g = 9.8. The second length is searched for: the L whose period equals T2. */
  q05: p => {
    const g = 9.8, per = L => TAU * Math.sqrt(L / g);
    return [rnd(per(p.L), 2), rnd(solveUp(per, p.T2, 0, 1e3), 3)];
  },
  /* Amplitude decays by e^(−b t / 2m); drive for biggest swing = natural frequency √(k/m) ÷ 2π. */
  q06: p => [
    rnd(p.A0 * Math.exp(-(p.b * p.t) / (2 * p.m)), 2),
    rnd(Math.sqrt(p.k / p.m) / TAU, 2)
  ],
  /* v = f λ; the cable's speed is unchanged, so the new wavelength is v ÷ f2. */
  q07: p => { const v = p.f * p.lam; return [rnd(v, 6), rnd(v / p.f2, 2)]; },
  /* y = A sin(kx − ωt) with k = 2π/λ, ω = 2πf. Each is rounded to 3 places; y uses the unrounded k and ω. */
  q08: p => {
    const k = TAU / p.lam, w = TAU * p.f;
    return [rnd(k, 3), rnd(w, 3), rnd(p.A * Math.sin(k * p.x - w * p.t), 2)];
  },
  /* The printed mass M and length L give μ = M ÷ L. Speed v = √(F/μ); the tension for a target speed is
     searched for as the F whose speed reaches v2. */
  q09: p => {
    const mu = p.M / p.L;
    const speed = F => Math.sqrt(F / mu);
    return [rnd(mu, 6), rnd(speed(p.F), 2), rnd(solveUp(speed, p.v2, 0, 1e9), 6)];
  },
  /* P = ½ μ A² ω² v with A in metres. The horn's intensity falls as 1/r²: find its power at r1, spread it over 4πr2². */
  q10: p => {
    const A = p.A / 100, w = TAU * p.f;
    const P = 0.5 * p.mu * A * A * w * w * p.v;
    const r2 = p.r2;
    const power = p.I1 * 4 * Math.PI * p.r1 * p.r1;
    return [rnd(P, 2), rnd(power / (4 * Math.PI * r2 * r2), 3)];
  }
});
})();
