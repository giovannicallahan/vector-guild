/* Independent oracles for Electricity and magnetism: potential and capacitance learn missions, file b: q11–q20 (game/realms/em/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const K = 8.99e9, E0 = 8.85e-12, E = 1.60e-19;
const r2 = x => Math.round(x * 100 + 1e-9 * Math.sign(x)) / 100;
/* Charge enclosed by a Gaussian surface of radius r: the inner charge always, the shell/tube charge only when r exceeds R. */
const enclosed = (p, r) => r > p.R ? p.q1 + p.q2 : p.q1;
/* Sum of q/|x - probe| over point charges (positions in metres). */
const potential = (qs, xs, x0) => { let s = 0; for (let i = 0; i < qs.length; i++) s += K * qs[i] * 1e-6 / Math.abs(xs[i] - x0); return s; };
/* Series and parallel capacitance by their charge/voltage definitions: parallel adds, series adds reciprocals. */
const par = (a, b) => a + b, ser = (a, b) => 1 / (1 / a + 1 / b);
Object.assign(window.ORACLE, {
  /* shape 0 = sphere (Q enclosed, 4πε₀r²), shape 1 = cylinder (λ enclosed, 2πε₀r). R, r1, r2 are tenths of a metre;
     charges in nC (per metre for the cylinder). */
  q11: p => [p.r1, p.r2].map(t => {
    const r = t / 10, q = enclosed(p, t) * 1e-9;
    return r2(p.shape === 0 ? q / (4 * Math.PI * E0 * r * r) : q / (2 * Math.PI * E0 * r));
  }),
  /* i and j are indices into the list of distances 0.1, 0.2, 0.25, 0.5 m (initial and final separation).
     U = k q1 q2 / r in J, shown in mJ; the work by the outside force is the change in U. */
  q12: p => {
    const U = r => K * p.q1 * 1e-6 * p.q2 * 1e-6 / r * 1e3;
    return [U(p.a), U(p.b) - U(p.a)];
  },
  /* z is the charge in units of e: z = 1 proton (1.67e-27 kg), z = 2 helium nucleus (6.64e-27 kg). */
  q13: p => {
    const m = p.z === 1 ? 1.67e-27 : 6.64e-27;
    const eV = p.z * p.V, J = eV * E;
    return [eV, J / 1e-17, r2(Math.sqrt(2 * J / m) / 1e3)];
  },
  /* p is the probe position in cm; each d is that trap's offset from the probe in cm. q in μC; qt is the test charge in μC. */
  q14: p => {
    const x0 = p.p / 100, xs = p.d.map(d => (p.p + d) / 100);
    const V = potential(p.q, xs, x0);
    return [V / 1e3, p.qt * 1e-6 * V * 1e3];
  },
  /* V(x) = a x³ + b x² + c; E_x = −dV/dx by a five-point central difference (exact for a cubic). */
  q15: p => {
    const V = x => p.a * x * x * x + p.b * x * x + p.c, h = 0.01;
    const d = (-V(p.x0 + 2 * h) + 8 * V(p.x0 + h) - 8 * V(p.x0 - h) + V(p.x0 - 2 * h)) / (12 * h);
    return [V(p.x0), Math.round(-d * 1e6) / 1e6];
  },
  /* V in volts, d in mm, s in mm: the field is uniform so the potential falls linearly from V at the positive plate to 0. */
  q16: p => {
    const f = s => p.V * (1 - s / p.d);   /* potential at distance s from the positive plate */
    return [p.V / p.d, p.V - f(p.s), f(p.s)];
  },
  /* Speed is 40 k km/s (k a multiplier); Vp volts across a gap g mm. Energy balance: the proton stops after losing
     its KE (in eV) against a field E, so distance = KE(eV) ÷ E(V/m). */
  q17: p => {
    const v = p.v * 1e3, KE = 0.5 * 1.67e-27 * v * v / E;
    const field = p.Vp / (p.g * 1e-3);
    return [field / 1e3, KE, r2(KE / field * 1e3)];
  },
  /* A in cm², d in mm, V in volts. */
  q18: p => {
    const A = p.A * 1e-4, C = E0 * A / (p.d * 1e-3);
    return [A, r2(C * 1e12), r2(C * p.V * 1e9)];
  },
  /* lay 0: C2 and C3 in parallel, that pair in series with C1. lay 1: C1 and C2 in series, that pair in parallel with C3. */
  q19: p => {
    const C = p.lay === 0 ? ser(p.c1, par(p.c2, p.c3)) : par(ser(p.c1, p.c2), p.c3);
    return [C, C * p.V];
  },
  /* c1, c2 in μF in parallel, V volts, t in ms. */
  q20: p => {
    const C = (p.c1 + p.c2) * 1e-6, Q = C * p.V, U = 0.5 * C * p.V * p.V;
    return [Q * 1e3, U * 1e3, U / (p.t * 1e-3)];
  }
});
})();
