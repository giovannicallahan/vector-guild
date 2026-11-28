/* Independent oracles for Electromagnetism: practice missions, file 3 of 8: q11b–q15d (game/realms/em/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, in SI units, by a different route from build() (quantities converted to coulombs,
   metres, joules and then back). qa/generators.js loads this file after the whole pack and fails a mission with no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const E0 = 8.85e-12, K = 8.99e9, QE = 1.60e-19, M_E = 9.11e-31, M_P = 1.67e-27;
/* Charge (nC) inside a sphere of radius rad (m) about the centre, given [charge nC, radius m] parts. */
const inside = (parts, rad) => parts.reduce((s, [q, a]) => s + (a < rad ? q : 0), 0);
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
/* Index into the printed list of release distances (m): p.i = 0, 1, 2, 3 prints 0.1, 0.2, 0.25, 0.5 m. */
const GAP = [0.1, 0.2, 0.25, 0.5];
Object.assign(window.ORACLE, {
  /* Radii are R and r tenths of a metre. Gauss: Q_enc = E 4π ε0 r² (probe outside the wall); wall = Q_enc − bead. */
  q11b: p => {
    const qin = p.E * 4 * Math.PI * E0 * Math.pow(p.r / 10, 2) * 1e9;
    return [r2(qin), r2(qin - p.q1)];
  },
  /* Wire and sleeve both inside; E = λ ÷ (2π ε0 r); F = q E (nC × N/C = nN), radii in tenths of a metre. */
  q11c: p => {
    const lam = (p.l1 + p.l2) * 1e-9, E = lam / (2 * Math.PI * E0 * (p.r / 10));
    return [r2(lam * 1e9), r2(E), r2(p.qg * 1e-9 * E * 1e9)];
  },
  /* Bead at the centre plus shells of radius a, b (tenths of a metre). Field at r1 from what lies inside r1;
     flux through r2 = Q_enc ÷ ε0; field outside = flux ÷ (4π r2²). */
  q11d: p => {
    const parts = [[p.q1, 0], [p.q2, p.a / 10], [p.q3, p.b / 10]];
    const rr1 = p.r1 / 10, rr2 = p.r2 / 10;
    const e1 = inside(parts, rr1) * 1e-9 / (4 * Math.PI * E0 * rr1 * rr1);
    const flux = inside(parts, rr2) * 1e-9 / E0;
    return [r2(e1), r2(flux), r2(flux / (4 * Math.PI * rr2 * rr2))];
  },
  /* U = k q1 q2 ÷ r with r in cm, U in mJ, q1 in μC → q2; work to pull apart to U = 0 is 0 − U. */
  q12b: p => {
    const q2 = (p.U * 1e-3) * (p.r * 1e-2) / (K * p.q1 * 1e-6);
    return [r2(q2 * 1e6), r2(-p.U)];
  },
  /* i indexes the printed distance list GAP. U = k q1 q2 ÷ d; all of it becomes ½ m v² far away (m in mg). */
  q12c: p => {
    const U = K * p.q1 * 1e-6 * p.q2 * 1e-6 / GAP[p.i];
    return [r2(U * 1e3), r2(Math.sqrt(2 * U / (p.m * 1e-6)))];
  },
  /* Beads at 0, a cm, b cm. Sum over pairs; removing bead 3 costs minus its interaction with the other two. */
  q12d: p => {
    const a = p.a / 100, b = p.b / 100, c = 1e-6;
    const U = K * c * c * (p.q1 * p.q2 / a + p.q1 * p.q3 / b + p.q2 * p.q3 / (b - a));
    const U3 = K * c * c * p.q3 * (p.q1 / b + p.q2 / (b - a));
    return [r2(U * 1e3), r2(-U3 * 1e3)];
  },
  /* v in km/s; KE = ½ m v² (shown in units of 1e-17 J); V = KE ÷ e. */
  q13b: p => {
    const ke = 0.5 * M_E * Math.pow(p.v * 1e3, 2);
    return [r2(ke / 1e-17), r2(ke / QE)];
  },
  /* Charge z e (z = 1 is the proton, 1.67e-27 kg; z = 2 the helium nucleus, 6.64e-27 kg). Gains z e V1, loses z e V2; in eV that is z V1 and z (V1 − V2); speed from KE in joules, in km/s. */
  q13c: p => {
    const e1 = p.z * p.V1, e2 = p.z * (p.V1 - p.V2);
    return [r2(e1), r2(e2), r2(Math.sqrt(2 * e2 * QE / (p.z === 1 ? M_P : 6.64e-27)) / 1e3)];
  },
  /* vh is twice the voltage in MV (vh = 5 prints 2.5 MV). KE = e V; closest approach d = k Z e² ÷ KE, in fm. */
  q13d: p => {
    const ke = QE * (p.vh / 2) * 1e6;
    return [r2(ke / 1e-13), r2(K * p.Z * QE * QE / ke * 1e15)];
  },
  /* s scales the rectangle: AB = 0.3 s, BC = 0.4 s; A at origin, B along x, C up, D above A. Centre is half a diagonal from each. */
  q14b: p => {
    const ab = 0.3 * p.s, bc = 0.4 * p.s, c = 1e-6;
    const vD = K * c * (p.q1 / dist(0, bc, 0, 0) + p.q2 / dist(0, bc, ab, 0) + p.q3 / dist(0, bc, ab, bc));
    const vC = K * c * (p.q1 + p.q2 + p.q3) / dist(ab / 2, bc / 2, 0, 0);
    return [r2(vD / 1e3), r2(vC / 1e3)];
  },
  /* Posts at 0 and D cm; start xa cm, end xb cm; grain qt μC, m mg. ½ m v² = qt (V_start − V_end). */
  q14c: p => {
    const V = x => K * 1e-6 * (p.qa / (x / 100) + p.qb / ((p.D - x) / 100));
    const v1 = V(p.xa), v2 = V(p.xb);
    return [r2(v1 / 1e3), r2(v2 / 1e3), r2(Math.sqrt(2 * p.qt * 1e-6 * (v1 - v2) / (p.m * 1e-6)))];
  },
  /* Posts at 0 and d = dt/10 m. Midpoint V = k (qa + qb) ÷ (d/2). Zero where qa/x + qb/|d − x| = 0:
     between: x = qa d ÷ (qa − qb); outside: x = qa d ÷ (qa + qb). */
  q14d: p => {
    const d = p.dt / 10;
    return [r2(K * 1e-6 * (p.qa + p.qb) / (d / 2) / 1e3), r2(p.qa * d / (p.qa - p.qb)), r2(p.qa * d / (p.qa + p.qb))];
  },
  /* V = a (x − h)² + c; E_x = −dV/dx = −2a (x − h); zero field at the vertex x = h. */
  q15b: p => [r2(-2 * p.a * (p.x0 - p.h)), r2(p.h)],
  /* V = a x³ + b x² + c x; dV/dx = 3a x² + 2b x + c; E = −dV/dx; force = q E (μC × V/m = μN). */
  q15c: p => {
    const d = 3 * p.a * p.x0 * p.x0 + 2 * p.b * p.x0 + p.c;
    return [r2(d), r2(-d), r2(-d * p.q)];
  },
  /* V = a x³ + b x + c; E = −(3a x² + b); energy gained e (V1 − V2) = ½ m v². */
  q15d: p => {
    const V = x => p.a * x * x * x + p.b * x + p.c;
    const E = -(3 * p.a * p.x1 * p.x1 + p.b);
    return [r2(E), r2(Math.sqrt(2 * QE * (V(p.x1) - V(p.x2)) / M_P) / 1e3)];
  }
});
})();
