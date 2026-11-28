/* Independent oracles for Mechanics: practice missions, file 1 of 8: q01b–q05d (game/realms/mech/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states, by a different method from build() (here: unit-conversion chains and plain trigonometry).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + 1e-9 * Math.sign(x)) / f; };
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Convert a value from one unit to another through the plain unit: value × (old factor) ÷ (new factor). */
const conv = (v, oldF, newF) => r6(v * oldF / newF);
Object.assign(window.ORACLE, {
  /* q01b: V m/min (printed), L km (printed). m/s = V/60; km/h = V×60/1000; minutes = L×1000/V. */
  q01b: p => [r6(p.V / 60), r6(p.V * 60 / 1000), r6(p.L * 1000 / p.V)],
  /* q01c: V1, V2 km/h and M1, M2 minutes (printed); D m to the pylon (printed).
     Distance driven = speed × 1000/60 m per minute × minutes; the answer is D minus that. */
  q01c: p => [r6(p.D - (p.V1 * 1000 / 60 * p.M1 + p.V2 * 1000 / 60 * p.M2))],
  /* q01d: V m/s, H hours and M minutes (printed). Time = 3600 H + 60 M s. */
  q01d: p => {
    const t = 3600 * p.H + 60 * p.M;
    return [r6(p.V * 3600 / 1000), t, r6(p.V * t / 1000)];
  },
  /* q02b: a1, a2, a3 are the printed coefficients ×10 (58 means 5.8); e1, e2, e3 the printed powers of ten. */
  q02b: p => [
    conv(p.a1 / 10 * Math.pow(10, p.e1), 1, 1e-6),      /* m -> μm */
    conv(p.a2 / 10 * Math.pow(10, p.e2), 1, 1e3),       /* m -> km */
    conv(p.a3 / 10 * Math.pow(10, p.e3), 1, 1e3)],      /* J -> kJ */
  /* q02c: L mm wide (printed), a × 10⁻³ s (printed a). μs = a×10⁻³ ÷ 10⁻⁶; speed = (L/1000 m) ÷ (a×10⁻³ s). */
  q02c: p => [r6(p.a * 1e-3 / 1e-6), r6((p.L / 1000) / (p.a * 1e-3))],
  /* q02d: a1..a3 are printed coefficients ×10; e1..e3 the printed powers. Old units μs, km, MJ. */
  q02d: p => [
    conv(p.a1 / 10 * Math.pow(10, p.e1), 1e-6, 1e-3),   /* μs -> ms */
    conv(p.a2 / 10 * Math.pow(10, p.e2), 1e3, 1),       /* km -> m */
    conv(p.a3 / 10 * Math.pow(10, p.e3), 1e6, 1e3)],    /* MJ -> kJ */
  /* q03b: th10 is the printed angle ×10 (22 means 2.2 rad); S the printed speed. */
  q03b: p => { const t = p.th10 / 10; return [rd(p.S * Math.cos(t), 2), rd(p.S * Math.sin(t), 2)]; },
  /* q03c: track length L, angle th10/10 rad, shelf height H (all printed). */
  q03c: p => {
    const t = p.th10 / 10, x = p.L * Math.cos(t), y = p.L * Math.sin(t);
    return [rd(x, 2), rd(y, 2), rd(y - p.H, 2)];
  },
  /* q03d: range a/10 × 10^e m (printed), angle th10/10 rad; components in km to 3 places. */
  q03d: p => {
    const t = p.th10 / 10, R = p.a / 10 * Math.pow(10, p.e) / 1000;
    return [rd(R * Math.cos(t), 3), rd(R * Math.sin(t), 3)];
  },
  /* q04b: first move (a east, b north), second (c east, d north), all printed signed. */
  q04b: p => {
    const X = p.a + p.c, Y = p.b + p.d;
    return [X, Y, rd(Math.sqrt(X * X + Y * Y), 2), rd(Math.atan2(Y, X), 2)];
  },
  /* q04c: three legs A, B, C; the return flight has the length of the total move. */
  q04c: p => {
    const X = p.ax + p.bx + p.cx, Y = p.ay + p.by + p.cy;
    return [X, Y, rd(Math.sqrt(X * X + Y * Y), 2)];
  },
  /* q04d: A has length M at th10/10 rad; B = (bx, by); R = A + B. */
  q04d: p => {
    const t = p.th10 / 10, X = p.M * Math.cos(t) + p.bx, Y = p.M * Math.sin(t) + p.by;
    return [rd(X, 2), rd(Y, 2), rd(Math.sqrt(X * X + Y * Y), 2)];
  },
  /* q05b: dot product and the angle between A and B. */
  q05b: p => {
    const d = p.ax * p.bx + p.ay * p.by, m = Math.hypot(p.ax, p.ay) * Math.hypot(p.bx, p.by);
    return [d, rd(Math.acos(d / m), 3)];
  },
  /* q05c: N·S, |N||S| to 3 places, and 100 cos φ to 1 place. */
  q05c: p => {
    const d = p.nx * p.sx + p.ny * p.sy, m = Math.hypot(p.nx, p.ny) * Math.hypot(p.sx, p.sy);
    return [d, rd(m, 3), rd(100 * d / m, 1)];
  },
  /* q05d: R = A + B; R·C and the angle between R and C. */
  q05d: p => {
    const X = p.ax + p.bx, Y = p.ay + p.by, d = X * p.cx + Y * p.cy;
    return [d, rd(Math.acos(d / (Math.hypot(X, Y) * Math.hypot(p.cx, p.cy))), 3)];
  },
});
})();
