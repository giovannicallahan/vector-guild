/* Independent oracles for Electricity and magnetism: fields learn missions, file a: q01–q10 (game/realms/em/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const K = 8.99e9, EPS0 = 8.85e-12;
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const clean = x => Math.round(x * 1e9) / 1e9;
/* Composite Simpson's rule for the integral of f over [a, b]. */
const simpson = (f, a, b, n = 4000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
Object.assign(window.ORACLE, {
  /* N is the number of extra electrons the grain has (the printed charge is N × 1.60 × 10⁻¹⁹ C); m electrons are removed.
     Count in whole electrons, then new charge in units of 10⁻¹⁷ C = −(N − m) × 1.60 × 10⁻¹⁹ ÷ 10⁻¹⁷ = −(N − m) × 16 ÷ 1000. */
  q01: p => {
    let electrons = p.N, protonsMinusElectrons = 0;
    for (let i = 0; i < p.m; i++) electrons--;
    protonsMinusElectrons = -electrons;
    return [p.N, clean(protonsMinusElectrons * 16 / 1000)];
  },
  /* a and b are the charges in μC; d is the separation in tenths of a metre (d = 7 prints 0.7 m). Magnitude by Coulomb's law;
     repel (1) when the product of the charges is positive, attract (−1) when negative. */
  q02: p => {
    const r = p.d / 10, F = K * Math.abs(p.a * p.b) * 1e-12 / (r * r);
    return [rd(F, 2), p.a * p.b > 0 ? 1 : -1];
  },
  /* Test charge q μC at x = 0; q1 μC at x = −d1/10 m (left); q2 μC at x = +d2/10 m (right). Signed force on q along x from a source at
     position s: the push is along the line from the source to q (away if the charges are alike, towards if unlike), so the
     x component is k q Q_s / r² times the sign of (0 − s). */
  q03: p => {
    const src = [[p.q1, -p.d1 / 10], [p.q2, p.d2 / 10]];
    let net = 0;
    for (const [Q, s] of src) { const r = Math.abs(s); net += K * (p.q * 1e-6) * (Q * 1e-6) / (r * r) * Math.sign(0 - s); }
    return [rd(net, 2)];
  },
  /* q nC at the origin; P at x = d/10 m; test charge Q μC. E_x = k q / r² (sign of q, P on the +x side); F_x = Q E_x with the
     unrounded E, in μN (μC × N/C = μN). */
  q04: p => {
    const r = p.d / 10, E = K * p.q * 1e-9 / (r * r);
    return [rd(E, 2), rd(p.Q * E, 2)];
  },
  /* lam nC/m on the rod from a cm to b cm. Total charge = lam × length (cm → m). Field at the origin: add up the charge in thin slices,
     each acting as a point charge at its own distance (Simpson's rule on k lam dx / x²), result in kN/C. */
  q05: p => {
    const a = p.a / 100, b = p.b / 100, lam = p.lam * 1e-9;
    const Q = lam * (b - a) * 1e9;
    const E = simpson(x => K * lam / (x * x), a, b) / 1000;
    return [clean(rd(Q, 6)), rd(E, 2)];
  },
  /* q nC at each end, rod d cm long, E kN/C, θ = kπ/6. p = q × d. Torque = p E sin θ, converted: nC·m × kN/C = 10⁻⁹ × 10³ N·m
     = 10⁻⁶ N·m = 1 μN·m, so the numbers multiply directly. */
  q06: p => {
    const dip = p.q * p.d / 100, th = p.k * Math.PI / 6;
    return [rd(dip, 6), rd(dip * 1e-9 * p.E * 1e3 * Math.sin(th) * 1e6, 2)];
  },
  /* First panel: flux = E A cos θ with θ = num π / den. Second panel: field c x along the normal over a w × h panel; sum the flux
     through thin vertical strips of width dx and height h (midpoint rule), x from 0 to w. */
  q07: p => {
    const first = p.E * p.A * Math.cos(p.num * Math.PI / p.den);
    const n = 100000, dx = p.w / n; let second = 0;
    for (let i = 0; i < n; i++) second += p.c * ((i + 0.5) * dx) * p.h * dx;
    return [rd(first, 2), rd(second, 2)];
  },
  /* Gauss's law: only the charges inside count (q1, q2 nC). Second surface: m is the flux in units of 200 N·m²/C (m = 5 prints 1000);
     enclosed charge = flux × ε₀, shown in nC. */
  q08: p => {
    const flux = (p.q1 + p.q2) * 1e-9 / EPS0, flux2 = p.m * 200;
    return [Math.round(flux), rd(flux2 * EPS0 * 1e9, 2)];
  },
  /* Shells (R1, Q1 nC) and (R2, Q2 nC); field at radius r is k Q_enclosed / r², where the enclosed charge is the sum of shells with
     radius below r (spherical symmetry). */
  q09: p => {
    const shells = [[p.R1, p.Q1], [p.R2, p.Q2]];
    const field = r => { let enc = 0; for (const [R, Q] of shells) if (R < r) enc += Q; return K * enc * 1e-9 / (r * r); };
    return [rd(field(p.ra), 2), rd(field(p.rb), 2)];
  },
  /* Line charge lam nC/m at d cm: E = lam ÷ (2π ε₀ r). Sheet sigma nC/m²: E = sigma ÷ (2 ε₀). Both in kN/C. */
  q10: p => {
    const cable = p.lam * 1e-9 / (2 * Math.PI * EPS0 * (p.d / 100)) / 1000;
    const sheet = p.sig * 1e-9 / (2 * EPS0) / 1000;
    return [rd(cable, 2), rd(sheet, 2)];
  },
});
})();
