/* Independent oracles for Electromagnetism: practice missions, file 6 of 8: q26b–q30d (game/realms/em/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, in SI units. Circuits are solved from Kirchhoff's rules by elimination (loop equations
   with the junction rule put in, solved by Cramer's rule or Gaussian elimination), not by a node-voltage shortcut.
   Magnetic forces come from F = q v × B with the right-hand rule on unit vectors. qa/generators.js loads this file after
   the whole pack and fails a mission with no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const par = (...r) => 1 / r.reduce((s, x) => s + 1 / x, 0);
const QE = 1.60e-19;
/* Two batteries (emf e1, e3, positive terminal towards A, signed) with series resistance r1, r3 and a middle resistance rm
   between A and B. I1, I3 = currents up the outer branches, I2 = I1 + I3 down the middle.
   Left loop: e1 = r1 I1 + rm (I1 + I3); right loop: e3 = r3 I3 + rm (I1 + I3). */
function twoLoop(e1, r1, e3, r3, rm) {
  const a = r1 + rm, d = r3 + rm, det = a * d - rm * rm;
  const I1 = (e1 * d - rm * e3) / det, I3 = (a * e3 - rm * e1) / det;
  return { I1, I3, I2: I1 + I3 };
}
/* Gaussian elimination with partial pivoting for a small square system. */
function gauss(A, b) {
  const n = b.length, M = A.map((row, i) => row.concat(b[i]));
  for (let c = 0; c < n; c++) {
    let p = c; for (let i = c + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[p][c])) p = i;
    [M[c], M[p]] = [M[p], M[c]];
    for (let i = c + 1; i < n; i++) { const f = M[i][c] / M[c][c]; for (let j = c; j <= n; j++) M[i][j] -= f * M[c][j]; }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
Object.assign(window.ORACLE, {
  /* (Ra + Rb) in parallel with Rc; I = E / R. */
  q26b: p => { const R = par(p.Ra + p.Rb, p.Rc); return [r2(R), r2(p.E / R)]; },
  /* Feed cable in series with N equal heaters in parallel (Rh / N); heaters share I × Rh/N. */
  q26c: p => { const row = p.Rh / p.N, I = p.E / (p.R1 + row); return [r2(I), r2(I * row)]; },
  /* Three heaters in parallel in series with the feed cable; all the current goes through the cable: P = I² R1. */
  q26d: p => { const R = p.R1 + par(p.Ra, p.Rb, p.Rc), I = p.E / R; return [r2(R), r2(I * I * p.R1)]; },
  /* s2 = +1: spare battery's positive terminal towards A; otherwise towards B (emf counts negative going up). */
  q27b: p => {
    const e3 = (p.s2 > 0 ? 1 : -1) * p.E2, s = twoLoop(p.E1, p.R1, e3, p.R3, p.R2);
    return [r2(s.I1), r2(s.I3), r2(s.I2 * p.R2)];
  },
  /* No current in the right branch: lamp carries the whole left current; the spare emf equals the lamp voltage. */
  q27c: p => { const I = p.E1 / (p.R1 + p.R2); return [r2(I), r2(I * p.R2)]; },
  /* Unknowns I1, I2, I3 (all up): junction A gives I1 + I2 + I3 = 0; loops 1–2 and 2–3 through B. */
  q27d: p => {
    const x = gauss([[1, 1, 1], [p.R1, -p.R2, 0], [0, p.R2, -p.R3]], [0, p.E1 - p.E2, p.E2 - p.E3]);
    return x.map(r2);
  },
  /* tau = R C (MΩ × μF = s); t is m time constants; I = (E/R) e^(−m), in μA with R in MΩ. */
  q28b: p => { const tau = p.R * p.C, t = p.m * tau; return [r2(tau), r2(p.E / p.R * Math.exp(-t / tau))]; },
  /* t = tau ln(E / (E − V)), tau = R C (kΩ × μF = ms); energy ½ C V² at that moment. */
  q28c: p => {
    const tau = p.R * 1e3 * p.C * 1e-6, t = tau * Math.log(p.E / (p.E - p.Vt));
    return [r2(t), r2(0.5 * p.C * 1e-6 * p.Vt * p.Vt * 1e3)];
  },
  /* w is an index into the wording: 0 = side by side (parallel, C1 + C2), 1 = one after the other (series, C1C2/(C1+C2)); tau = R C; V = E (1 − e^(−t/tau)) with t = m tau. */
  q28d: p => {
    const C = p.w ? par(p.C1, p.C2) : p.C1 + p.C2, tau = p.R * 1e3 * C * 1e-6, t = p.m * tau;
    return [r2(C), r2(tau), r2(p.E * (1 - Math.exp(-t / tau)))];
  },
  /* Left branch resistance = R1 + Ra‖Rb; coil current = (voltage across the pair) ÷ Ra, pair voltage = I1 × (Ra‖Rb). */
  q29b: p => {
    const rp = par(p.Ra, p.Rb), s = twoLoop(p.E1, p.R1 + rp, p.E2, p.R3, p.R2);
    return [r2(s.I2), r2(s.I1 * rp / p.Ra)];
  },
  /* Middle branch before: Ra‖Rb; after: Ra alone (the prompt keeps the first-listed heater Ra). P = V²/Ra, V = I2 × middle R. */
  q29c: p => {
    const vb = twoLoop(p.E1, p.R1, p.E2, p.R3, par(p.Ra, p.Rb)).I2 * par(p.Ra, p.Rb);
    const va = twoLoop(p.E1, p.R1, p.E2, p.R3, p.Ra).I2 * p.Ra;
    return [r2(vb * vb / p.Ra), r2(va * va / p.Ra)];
  },
  /* P2 = ε2 × I3 (current up out of its positive terminal); heat = Σ I² R over the four resistors. */
  q29d: p => {
    const rp = par(p.Ra, p.Rb), s = twoLoop(p.E1, p.R1, p.E2, p.R3, rp), v = s.I2 * rp;
    return [r2(p.E2 * s.I3), r2(s.I1 * s.I1 * p.R1 + s.I3 * s.I3 * p.R3 + v * v / p.Ra + v * v / p.Rb)];
  },
  /* v = +x, B = b (cos θ, ±sin θ, 0): v × B = v b (±sin θ) ẑ. F = q v × B; units 1e-15 N; z = charge in units of e (sign). */
  q30b: p => {
    const bz = p.V * 1e3 * (p.b * 1e-3) * (p.up ? 1 : -1) * Math.sin(p.th);
    const F = p.z * QE * bz;
    return [r2(Math.abs(F) / 1e-15), F > 0 ? 1 : -1];
  },
  /* B = F ÷ (|q| v sin θ) in mT; a = F ÷ m in units of 1e11 m/s². Ft and m are in units of 1e-15 N and 1e-26 kg. */
  q30c: p => {
    const q = Math.abs(p.z) * QE, F = p.Ft * 1e-15;
    return [r2(F / (q * p.V * 1e3 * Math.sin(p.th)) * 1e3), r2(F / (p.m * 1e-26) / 1e11)];
  },
  /* |q| E = |q| v B sin θ gives v = E ÷ (B sin θ); each force = |q| E. */
  q30d: p => {
    const E = p.E * 1e3, B = p.b * 1e-3, q = Math.abs(p.z) * QE;
    return [r2(E / (B * Math.sin(p.th)) / 1e3), r2(q * E / 1e-15)];
  }
});
})();
