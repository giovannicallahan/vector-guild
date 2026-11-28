/* Independent oracles for Electricity and magnetism: fields learn missions, file c: q21–q30 (game/realms/em/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const clean = x => Math.round(x * 1e9) / 1e9;
/* Solve A x = b by Gaussian elimination with partial pivoting. */
const solve = (A, b) => {
  const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
};
/* Two-branch-to-three loop solver: unknowns I1 (up left), Im (down middle), I3 (up right).
   KCL at A: I1 + I3 = Im. Loops: E1 = I1 R1 + Im Rm, E2 = I3 R3 + Im Rm. */
const threeBranch = (E1, E2, R1, Rm, R3) => solve(
  [[1, -1, 1], [R1, Rm, 0], [0, Rm, R3]], [0, E1, E2]);
Object.assign(window.ORACLE, {
  /* C0 in μF, V0 in volts, k = κ; kept = 1: supply stays connected (V fixed), kept = 0: charge Q fixed.
     Energy tracked in μJ then converted to mJ. */
  q21: p => {
    const C = p.k * p.C0;
    let Uuj;
    if (p.kept === 1) Uuj = 0.5 * C * p.V0 * p.V0;
    else { const Q = p.C0 * p.V0; Uuj = Q * Q / (2 * C); }
    return [clean(C), clean(Uuj / 1000)];
  },
  /* I = a + b t, charge by summing thin slices of width 1e-4 s (midpoint rule, exact for a line);
     electron count in units of 1e18 = Q / (1.60e-19) / 1e18. */
  q22: p => {
    const n = 100000, dt = p.T / n; let Q = 0;
    for (let i = 0; i < n; i++) Q += (p.a + p.b * (i + 0.5) * dt) * dt;
    return [clean(Q), clean(Q / 1.6e-19 / 1e18)];
  },
  /* C1 = A, C2 = B, C3 = C (the filled one, C = κ C3). lay 0: (B ∥ C) in series with A; lay 1: (B series C) ∥ A.
     Solved by charge conservation / voltage division on the unit-voltage network: total charge from V. */
  q23: p => {
    const A = p.C1, B = p.C2, C = p.k * p.C3, V = p.V;
    let Q;
    if (p.lay === 0) {
      /* charge Q on A equals the charge on the parallel pair; V = Q/A + Q/(B + C) */
      Q = V / (1 / A + 1 / (B + C));
    } else {
      /* A holds A V; the series arm holds Q2 with V = Q2/B + Q2/C */
      Q = A * V + V / (1 / B + 1 / C);
    }
    return [clean(Q), clean(0.5 * Q * V / 1000)];
  },
  /* r is ρ in units of 1e-8 Ω·m, L in metres, d diameter in mm. Work in metres. */
  q24: p => {
    const dm = p.d / 1000, Am2 = Math.PI * dm * dm / 4;
    const R = p.r * 1e-8 * p.L / Am2;
    return [rd(Am2 * 1e6, 2), rd(R, 2)];
  },
  /* The prompt prints R and the supply voltage V = I R (I a parameter). Current by Ohm's law, power by V × I. */
  q25: p => {
    const V = p.V, I = V / p.R;
    return [clean(I), clean(V * I)];
  },
  /* R1 feed in series with R2 ∥ R3. Parallel resistance found by the product-over-sum rule; current by Ohm. */
  q26: p => {
    const Req = p.R1 + (p.R2 * p.R3) / (p.R2 + p.R3);
    return [clean(Req), clean(p.E / Req)];
  },
  /* Linear system for the three currents. */
  q27: p => threeBranch(p.E1, p.E2, p.R1, p.R2, p.R3).map(clean),
  /* R in kΩ, C in μF: τ = R C / 1000 s. The prompt's time is m × τ (m a multiplier, printed as the seconds).
     Voltage by stepping the charging equation dV = (E − V) dt / τ in tiny steps. */
  q28: p => {
    const tau = p.R * p.C / 1000, t = p.t, n = 2000000, dt = t / n;
    let V = 0; for (let i = 0; i < n; i++) V += (p.E - V) * dt / tau;
    return [clean(tau), rd(V, 2)];
  },
  /* Middle branch is Ra ∥ Rb with a heater picked by w (0 = Ra, 1 = Rb). Solve the three-branch system with the
     middle resistance as the parallel pair; middle current = Im; heater power = Vab² / R heater, Vab = Im Rpar. */
  q29: p => {
    const Rp = 1 / (1 / p.Ra + 1 / p.Rb);
    const [, Im] = threeBranch(p.E1, p.E2, p.R1, Rp, p.R3);
    const Vab = Im * Rp, Rh = p.w === 0 ? p.Ra : p.Rb;
    return [rd(Im, 2), rd(Vab * Vab / Rh, 2)];
  },
  /* z = signed charge in units of e (±1, ±2), V km/s along +x, b mT, th rad from +x towards +y. F = q v × B,
     taking the cross product by components: v = (v,0,0), B = b (cos th, sin th, 0) so (v × B)_z = v B_y. */
  q30: p => {
    const q = p.z * 1.6e-19, v = p.V * 1e3, B = p.b * 1e-3;
    const Bx = B * Math.cos(p.th), By = B * Math.sin(p.th);
    const Fz = q * (v * By - 0 * Bx);
    return [rd(Math.abs(Fz) / 1e-15, 2), Fz > 0 ? 1 : -1];
  },
});
})();
