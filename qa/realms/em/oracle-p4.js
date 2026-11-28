/* Independent oracles for Electromagnetism: practice missions, file 4 of 8: q16b–q20d (game/realms/em/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, in SI units, by a different route from build() (quantities converted to metres, farads,
   joules and then back). qa/generators.js loads this file after the whole pack and fails a mission with no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const E0 = 8.85e-12, M_P = 1.67e-27, QE = 1.60e-19;
/* Series combination of capacitances (any unit). */
const series = (...c) => 1 / c.reduce((s, x) => s + 1 / x, 0);
/* Kinetic energy in eV of a proton at v m/s (SI joules, then divide by the charge e). */
const keEV = v => 0.5 * M_P * v * v / QE;
Object.assign(window.ORACLE, {
  /* Uniform field E kV/m across d mm: V = E d in SI; point s mm in. */
  q16b: p => [r2(p.E * 1e3 * p.d * 1e-3), r2(p.E * 1e3 * p.s * 1e-3)],
  /* Field = V ÷ d in kV/m; largest V = limit L kV/m × d; spare = largest − supply. */
  q16c: p => [r2(p.V / (p.d * 1e-3) / 1e3), r2(p.L * 1e3 * p.d * 1e-3), r2(p.L * 1e3 * p.d * 1e-3 - p.V)],
  /* Two gaps in a row: potentials add; average field = last potential ÷ total distance (kV/m). */
  q16d: p => {
    const v1 = p.E1 * 1e3 * p.d1 * 1e-3, v2 = v1 + p.E2 * 1e3 * p.d2 * 1e-3;
    return [r2(v1), r2(v2), r2(v2 / ((p.d1 + p.d2) * 1e-3) / 1e3)];
  },
  /* Speed is 40 k km/s (the prompt prints 120 km/s for k = 3, 240 for k = 6, 280 for k = 7); stops after KE/(e E) metres. */
  q17b: p => {
    const ke = keEV(40 * p.k * 1e3);
    return [r2(p.E * 1e3 * p.g * 1e-3), r2(ke), r2(ke * QE / (QE * p.E * 1e3) * 1e3)];
  },
  /* Booster gains e E1 s1; brake force e E2 stops it after that energy ÷ force. */
  q17c: p => {
    const gain = QE * p.E1 * 1e3 * p.s1 * 1e-3, back = gain / (QE * p.E2 * 1e3) * 1e3;
    return [r2(gain / QE), r2(back), r2(p.s1 + back)];
  },
  /* Speed is 40 k km/s (360 for k = 9, 400 for k = 10, 320 for k = 8). KE at plate = KE − e E g; half-KE at KE/2 ÷ (e E). */
  q17d: p => {
    const ke = keEV(40 * p.k * 1e3);
    return [r2(ke), r2(ke - p.E * 1e3 * p.g * 1e-3), r2(ke / 2 / (p.E * 1e3) * 1e3)];
  },
  /* Plates L × W cm; C = ε0 A ÷ d; Q = C V. */
  q18b: p => {
    const A = p.L * 1e-2 * p.W * 1e-2, C = E0 * A / (p.d * 1e-3);
    return [r2(A), r2(C * 1e12), r2(C * p.V * 1e9)];
  },
  /* d = ε0 A ÷ C0; Q = C0 V. */
  q18c: p => {
    const A = p.L * 1e-2 * p.W * 1e-2, d = E0 * A / (p.C0 * 1e-12);
    return [r2(A), r2(d * 1e3), r2(p.C0 * 1e-12 * p.V * 1e9)];
  },
  /* A in cm²; C = ε0 A ÷ d; Q = C V; E = V ÷ d in kV/m; doubled gap, battery connected: V stays, C halves, Q halves. */
  q18d: p => {
    const C = E0 * (p.A * 1e-4) / (p.d * 1e-3), C2 = E0 * (p.A * 1e-4) / (2 * p.d * 1e-3);
    return [r2(C * 1e12), r2(C * p.V * 1e9), r2(p.V / (p.d * 1e-3) / 1e3), r2(C2 * p.V * 1e9)];
  },
  /* Series chain: Ceq; Q = Ceq V; same Q on C1, so V1 = Q ÷ C1. */
  q19b: p => {
    const C = series(p.c1, p.c2, p.c3), Q = C * p.V;
    return [r2(C), r2(Q), r2(Q / p.c1)];
  },
  /* Series pair in parallel with the extra one: extra = Ct − pair; Q = Ct V. */
  q19c: p => {
    const pair = series(p.c1, p.c2);
    return [r2(pair), r2(p.Ct - pair), r2(p.Ct * p.V)];
  },
  /* Two series branches in parallel; branch B charge = C_B V. */
  q19d: p => {
    const a = series(p.c1, p.c2), b = series(p.c3, p.c4);
    return [r2(a), r2(b), r2(a + b), r2(b * p.V)];
  },
  /* Series pair, U = ½ C V² in joules (μF → F), power = U ÷ t with t in seconds. */
  q20b: p => {
    const C = series(p.c1, p.c2) * 1e-6, U = 0.5 * C * p.V * p.V;
    return [r2(C * 1e6), r2(U * 1e3), r2(U / (p.t * 1e-3))];
  },
  /* C = 2U ÷ V²; Q = C V; t = U ÷ P. */
  q20c: p => {
    const U = p.U * 1e-3, C = 2 * U / (p.V * p.V);
    return [r2(C * 1e6), r2(C * p.V * 1e3), r2(U / p.P * 1e3)];
  },
  /* Series pair plus C3 in parallel; energy ½ C V²; extra = ½ C (V2² − V1²). */
  q20d: p => {
    const C = (series(p.c1, p.c2) + p.c3) * 1e-6;
    return [r2(C * 1e6), r2(0.5 * C * p.V1 * p.V1 * 1e3), r2(0.5 * C * (p.V2 * p.V2 - p.V1 * p.V1) * 1e3)];
  }
});
})();
