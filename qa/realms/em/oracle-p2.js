/* Independent oracles for Electromagnetism: practice missions, file 2 of 8: q06b–q10d (game/realms/em/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, in SI units (nC, cm, kN/C and μN·m converted to C, m, N/C and N·m, then back).
   Index parameters: `a` in q06b/q06c/q06d is the angle in sixths of π (θ = a π/6, as the prompts print it); `num`, `den` in q07b–q07d
   give θ = num π/den; in q08b and q08c the printed net flux is 200 m N·m²/C (m is the hidden multiplier of the printed flux).
   qa/generators.js loads this file after the whole pack and fails a mission with no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100 + 0;
const r0 = x => Math.round(x) + 0;
const K = 8.99e9, E0 = 8.85e-12, PI = Math.PI;
/* Field (N/C) of the charges (in nC) enclosed by a sphere of radius r: only shells with radius below r count. */
const radial = (r, charges) => K * charges.reduce((s, c) => s + (c.R < r ? c.Q : 0), 0) * 1e-9 / (r * r);
Object.assign(window.ORACLE, {
  /* p = q d in C·m; torque pE sin θ in N·m, shown in μN·m; largest at sin θ = 1. */
  q06b: p => {
    const pm = p.q * 1e-9 * p.d * 1e-2, E = p.E * 1e3;
    return [r2(pm * E * 1e6), r2(pm * E * Math.sin(p.a * PI / 6) * 1e6)];
  },
  /* p = q d; E = τ ÷ (p sin θ); force on one charge q E. */
  q06c: p => {
    const pm = p.q * 1e-9 * p.d * 1e-2, E = p.tau * 1e-6 / (pm * Math.sin(p.a * PI / 6));
    return [r2(pm * 1e9), r2(E / 1e3), r2(p.q * 1e-9 * E * 1e6)];
  },
  /* Post field k Q ÷ r²; torque p E sin θ with the unrounded field. */
  q06d: p => {
    const pm = p.q * 1e-9 * p.d * 1e-2, E = K * p.Q * 1e-6 / (p.r * p.r);
    return [r2(pm * 1e9), r2(E / 1e3), r2(pm * E * Math.sin(p.a * PI / 6) * 1e6)];
  },
  /* Hatch: E w h cos θ. Window: height × integral of (a + b x) dx from 0 to w2 = h2 (a w2 + b w2² ÷ 2). */
  q07b: p => [r2(p.E * p.w * p.h * Math.cos(p.num * PI / p.den)), r2(p.h2 * (p.a * p.w2 + p.b * p.w2 * p.w2 / 2))],
  /* Two panels, each E A cos θ; net is the sum of the unrounded fluxes. */
  q07c: p => {
    const f1 = p.E * p.A1 * Math.cos(p.n1 * PI / p.d1), f2 = p.E * p.A2 * Math.cos(p.n2 * PI / p.d2);
    return [r2(f1), r2(f2), r2(f1 + f2)];
  },
  /* Field k Q ÷ r² (kN/C); flux = field × area × cos θ, in kN·m²/C. */
  q07d: p => {
    const E = K * p.Q * 1e-6 / (p.r * p.r) / 1e3;
    return [r2(E), r2(E * p.w * p.h * Math.cos(p.num * PI / p.den))];
  },
  /* Gauss: Q_enc = ε0 Φ. First: unknown = ε0 · 200 m − q1; second: only the three inside charges count. */
  q08b: p => [r2((E0 * 200 * p.m * 1e9) - p.q1), r0((p.i1 + p.i2 + p.i3) * 1e-9 / E0)],
  /* Before = ε0 Φ; moving charge cm out (into = 0) subtracts it, in (into = 1) adds it; flux after = Q ÷ ε0. */
  q08c: p => {
    const before = E0 * 200 * p.m * 1e9, after = before + (p.into ? p.cm : -p.cm);
    return [r2(before), r2(after), r0(after * 1e-9 / E0)];
  },
  /* Flux out = A E2 − A E1 (entry face counts negative); Q = ε0 Φ. */
  q08d: p => {
    const f = p.A * p.E2 - p.A * p.E1;
    return [r0(f), r2(E0 * f * 1e9)];
  },
  /* Gauss for a shell and a core: inside the shell only the core counts; outside both. */
  q09b: p => [r2(radial(p.r1, [{ R: 0, Q: p.Qc }, { R: p.Rs, Q: p.Qs }])), r2(radial(p.rr, [{ R: 0, Q: p.Qc }, { R: p.Rs, Q: p.Qs }]))],
  /* The probe at r1 is outside the shell, so E1 = k Q ÷ r1² gives Q (whole nC); then k Q ÷ rr² and k (Q + qa) ÷ rr². */
  q09c: p => {
    const Q = Math.round(p.E1 * p.r1 * p.r1 / K * 1e9);
    return [Q, r2(K * Q * 1e-9 / (p.rr * p.rr)), r2(K * (Q + p.qa) * 1e-9 / (p.rr * p.rr))];
  },
  /* Three nested shells: enclosed charge at each distance; force = q E in nN (nC × N/C). */
  q09d: p => {
    const sh = [{ R: p.R1, Q: p.Q1 }, { R: p.R2, Q: p.Q2 }, { R: p.R3, Q: p.Q3 }];
    const Ea = radial(p.ra, sh), Eb = radial(p.rb, sh);
    return [r2(Ea), r2(Eb), r2(p.qt * Eb)];
  },
  /* Wire λ ÷ (2π ε0 d); sheet σ = 2 ε0 E. */
  q10b: p => [r2(p.lam * 1e-9 / (2 * PI * E0 * p.d * 1e-2) / 1e3), r2(2 * E0 * p.Es * 1e3 * 1e9)],
  /* Wall (at x = 0, P at x > 0): σ ÷ (2 ε0) along the sign of σ. Cable at x = D: P at D − r (far = 0) is on its −x side, at D + r (far = 1) on its +x side. */
  q10c: p => {
    const w = p.sig * 1e-9 / (2 * E0) / 1e3, side = p.far ? 1 : -1;
    const c = side * p.lam * 1e-9 / (2 * PI * E0 * p.r) / 1e3;
    return [r2(w), r2(c), r2(w + c)];
  },
  /* Equal fields: λ ÷ (2π ε0 d) = σ ÷ (2 ε0) gives d = λ ÷ (π σ); both point to +x so the net field is σ ÷ ε0; force q E. */
  q10d: p => {
    const E = p.sig * 1e-9 / E0 / 1e3;
    return [r2(p.lam / (PI * p.sig)), r2(E), r2(p.qg * E)];
  }
});
})();
