/* Independent oracles for Electromagnetism: practice missions, file 5 of 8: q21b–q25d (game/realms/em/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, by a different route from build() (charge and energy tracked step by step, areas and
   lengths converted to metres, integrals done by antiderivative). qa/generators.js loads this file after the whole pack. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const r6 = x => Math.round(x * 1e6) / 1e6;   /* "exact decimal" answers: strip float noise only */
const PI = Math.PI;
const series = (...c) => 1 / c.reduce((s, x) => s + 1 / x, 0);
/* Energy ½ Q²/C in μJ for Q in μC, C in μF. */
const uJ = (Q, C) => 0.5 * Q * Q / C;
/* Resistance in ohms of a bar: ρ in 1e-8 Ω·m, length m, area mm². */
const res = (r, L, Amm2) => r * 1e-8 * L / (Amm2 * 1e-6);
/* Area of a round wire of diameter d mm, in mm². */
const disc = d => PI * d * d / 4;
Object.assign(window.ORACLE, {
  /* kept = 1: supply holds V, C becomes κC0. kept = 0: charge Q = C0 V0 stays, C becomes κC0, V = Q ÷ (κC0). */
  q21b: p => {
    const Q0 = p.C0 * p.V0, before = uJ(Q0, p.C0);
    if (p.kept) return [r6(p.V0), r6((0.5 * p.k * p.C0 * p.V0 * p.V0 - before) / 1000)];
    return [r6(Q0 / (p.k * p.C0)), r6((uJ(Q0, p.k * p.C0) - before) / 1000)];
  },
  /* Slab in at fixed V0: Q = κ C0 V0. Charger off, slab out: same Q on C0, so V = Q ÷ C0, U = ½ Q²/C0. */
  q21c: p => {
    const Q = p.k * p.C0 * p.V0;
    return [r6(Q / p.C0), r6(uJ(Q, p.C0) / 1000)];
  },
  /* B becomes κ C2; series with A across V: Q = Ceq V, V_B = Q ÷ C_B. */
  q21d: p => {
    const cb = p.k * p.C2, Q = series(p.C1, cb) * p.V;
    return [r6(Q), r6(Q / cb)];
  },
  /* I = a + b t: Q = a Δt + b (t2² − t1²) / 2; average = Q ÷ Δt. */
  q22b: p => {
    const Q = p.a * (p.t2 - p.t1) + p.b * (p.t2 * p.t2 - p.t1 * p.t1) / 2;
    return [r6(Q), r6(Q / (p.t2 - p.t1))];
  },
  /* Ramp for T1 (area a T1 + b T1²/2), then constant at a + b T1 for T2. */
  q22c: p => {
    const Q = p.a * p.T1 + p.b * p.T1 * p.T1 / 2 + (p.a + p.b * p.T1) * p.T2;
    return [r6(Q), r6(Q / (p.T1 + p.T2))];
  },
  /* I = c t² + b t + a (the prompt prints 9t² + 4t + 8 for c = 9, b = 4, a = 8). N = Q ÷ 1.60e-19, in units of 1e18. */
  q22d: p => {
    const F = t => p.c * t * t * t / 3 + p.b * t * t / 2 + p.a * t;
    const Q = F(p.t2) - F(p.t1);
    return [r6(Q), r6(Q / 1.6e-19 / 1e18)];
  },
  /* s = which capacitor holds the slab (0 = A, 1 = B, 2 = C; the prompt names it). lay 0: (B ∥ C) in series with A.
     lay 1: (B in series with C) ∥ A. Energy ½ C V² with μF·V² = μJ. */
  q23b: p => {
    const c = { A: p.A, B: p.B, C: p.C };
    c['ABC'[p.s]] *= p.k;
    const Ceq = p.lay === 0 ? series(c.B + c.C, c.A) : series(c.B, c.C) + c.A;
    return [r6(Ceq), r6(0.5 * Ceq * p.V * p.V / 1000)];
  },
  /* Branch 1: A in series with κB. Branch 2: C in series with D. Parallel. Power = mJ ÷ ms. */
  q23c: p => {
    const Ceq = series(p.Ca, p.k * p.Cb) + series(p.Cc, p.Cd);
    const U = 0.5 * Ceq * p.V * p.V / 1000;
    return [r6(U), r6(U / p.t)];
  },
  /* Slab on C. Q = ∫(a + b t) dt over 0..T in μC; V = Q ÷ Ceq; U = ½ Q V. lay as in q23b. */
  q23d: p => {
    const c = p.k * p.C;
    const Ceq = p.lay === 0 ? series(p.B + c, p.A) : series(p.B, c) + p.A;
    const Q = p.a * p.T + p.b * p.T * p.T / 2;
    const V = Q / Ceq;
    return [r6(V), r6(0.5 * Q * V / 1000)];
  },
  /* Bar L m, w × h mm; R = ρ L ÷ A, shown in mΩ. */
  q24b: p => {
    const A = p.w * p.h;
    return [r6(A), r2(res(p.r, p.L, A) * 1000)];
  },
  /* Round wires (d mm across): R1, then R1 + R2 from unrounded values. */
  q24c: p => {
    const R1 = res(p.r1, p.L1, disc(p.d1)), R2 = res(p.r2, p.L2, disc(p.d2));
    return [r2(R1), r2(R1 + R2)];
  },
  /* A = ρ L ÷ R (m², shown in mm²); diameter from A = π d² ÷ 4. */
  q24d: p => {
    const A = p.r * 1e-8 * p.L / p.R * 1e6;
    return [r6(A), r2(Math.sqrt(4 * A / PI))];
  },
  /* P = V I gives I; R = V ÷ I. */
  q25b: p => { const I = p.P / p.V; return [r6(I), r6(p.V / I)]; },
  /* One current through both; heater and cable powers. */
  q25c: p => {
    const I = p.V / (p.Rh + p.Rc);
    return [r6(I * I * p.Rh), r6(I * I * p.Rc)];
  },
  /* R from the round wire; P = I² R from unrounded R, nearest whole watt. */
  q25d: p => {
    const R = res(p.r, p.L, disc(p.d));
    return [r2(R), Math.round(p.I * p.I * R)];
  }
});
})();
