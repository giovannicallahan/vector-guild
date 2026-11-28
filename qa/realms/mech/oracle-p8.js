/* Independent oracles for Mechanics: motion and force practice missions, file 8 of 8: q36b–q40d (game/realms/mech/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + 1e-9 * Math.sign(x)) / f; };
const G = 6.67e-11, g = 9.8, TAU = 2 * Math.PI;
/* Moment of inertia of point masses: sum of m r^2, from a list of [m, r] pairs. */
const inertia = pts => pts.reduce((s, [m, r]) => s + m * r * r, 0);
/* Perfectly inelastic collision of A (moving east at v1) and B (moving north at v2): velocity components by momentum sums. */
const couple = (m1, v1, m2, v2) => ({ vx: m1 * v1 / (m1 + m2), vy: m2 * v2 / (m1 + m2) });
Object.assign(window.ORACLE, {
  /* q36b: N is the printed speed in rpm. I from the four printed pots;
     omega = rpm turns × 2π rad ÷ 60 s; K = I omega² / 2. */
  q36b: p => {
    const I = inertia([[p.m1, p.r1], [p.m2, p.r2], [p.m3, p.r3], [p.m4, p.r4]]);
    const w = p.N * TAU / 60;
    return [rd(I, 2), rd(I * w * w / 2, 2)];
  },
  /* q36c: two drums, start omega w0, work E added. K0 = I w0²/2; K1 = K0 + E; w1 = sqrt(2 K1 / I). */
  q36c: p => {
    const I = inertia([[p.m1, p.r1], [p.m2, p.r2]]);
    const K1 = I * p.w0 * p.w0 / 2 + p.E;
    return [rd(I, 2), rd(Math.sqrt(2 * K1 / I), 2)];
  },
  /* q36d: N is the printed speed in rpm. Outer weight is the largest r. */
  q36d: p => {
    const I = inertia([[p.m1, p.r1], [p.m2, p.r2], [p.m3, p.r3]]);
    const w = p.N * TAU / 60;
    return [rd(I, 2), rd(I * w * w / 2, 2), rd(w * Math.max(p.r1, p.r2, p.r3), 2)];
  },
  /* q37b: angle is a·π/b rad (printed, e.g. π/3). tau = r F sin(angle); alpha = tau / I. */
  q37b: p => {
    const tau = p.r * p.F * Math.sin(p.a * Math.PI / p.b);
    return [rd(tau, 2), rd(tau / p.I, 2)];
  },
  /* q37c: pull at right angles to the radius, so the torque is F r; minus friction torque; omega = alpha t from rest. */
  q37c: p => {
    const net = p.F * p.r - p.f;
    return [rd(net, 2), rd(net / p.I * p.t, 2)];
  },
  /* q37d: angle is a·π/b rad (printed, e.g. 2π/3); wt is the printed target speed in rad/s; time = wt / alpha. */
  q37d: p => {
    const I = inertia([[p.m1, p.r1], [p.m2, p.r2], [p.m3, p.r3]]);
    const alpha = p.rp * p.F * Math.sin(p.a * Math.PI / p.b) / I;
    return [rd(I, 2), rd(alpha, 2), rd(p.wt / alpha, 2)];
  },
  /* q38b: L = I1 w1 conserved; w2 = L / I2; energy gained = I2 w2²/2 − I1 w1²/2. */
  q38b: p => {
    const L = p.I1 * p.w1, w2 = L / p.I2;
    return [L, rd(w2, 2), rd(p.I2 * w2 * w2 / 2 - p.I1 * p.w1 * p.w1 / 2, 2)];
  },
  /* q38c: same direction; common w = (IA wA + IB wB)/(IA + IB); energy lost = before − after. */
  q38c: p => {
    const w = (p.IA * p.wA + p.IB * p.wB) / (p.IA + p.IB);
    const before = p.IA * p.wA * p.wA / 2 + p.IB * p.wB * p.wB / 2, after = (p.IA + p.IB) * w * w / 2;
    return [rd(w, 2), rd(before - after, 2)];
  },
  /* q38d: B turns the opposite way, so wB enters as −wB (the parameter is its printed size). Brake time = |L| / T. */
  q38d: p => {
    const L = p.IA * p.wA - p.IB * p.wB, w = L / (p.IA + p.IB);
    return [L, rd(w, 2), rd(Math.abs(L) / p.T, 2)];
  },
  /* q39b: moon mass = mant × 10^ex kg; orbit radius r is printed in km. F = G M m / r²; v = sqrt(G M / r). */
  q39b: p => {
    const M = p.mant * Math.pow(10, p.ex), r = p.r * 1000;
    return [rd(G * M * p.m / (r * r), 2), Math.round(Math.sqrt(G * M / r))];
  },
  /* q39c: mant × 10^24 kg; R and h printed in km; orbit radius R + h. Period = 2π r / v (unrounded v) in minutes; full orbits = floor(1440 / period). */
  q39c: p => {
    const M = p.mant * 1e24, r = (p.R + p.h) * 1000;
    const v = Math.sqrt(G * M / r), T = TAU * r / v / 60;
    return [Math.round(v), rd(T, 2), Math.floor(1440 / T)];
  },
  /* q39d: gs printed in m/s², R and h in km. GM = gs R²; r = R + h. */
  q39d: p => {
    const GM = p.gs * Math.pow(p.R * 1000, 2), r = (p.R + p.h) * 1000;
    const v = Math.sqrt(GM / r), T = TAU * r / v / 60;
    return [Math.round(v), rd(T, 2), rd(p.m * GM / (r * r), 2)];
  },
  /* q40b: P slides west (velocity −v1, 0), Q north (0, v2). Momentum sums; then v²/2 = g h. */
  q40b: p => {
    const M = p.m1 + p.m2, vx = -p.m1 * p.v1 / M, vy = p.m2 * p.v2 / M, sp = Math.hypot(vx, vy);
    return [rd(vx, 2), rd(sp, 2), rd(sp * sp / (2 * g), 2)];
  },
  /* q40c: A east, B north. Work-energy: mu M g d = M v²/2, so d = v² / (2 mu g). */
  q40c: p => {
    const c = couple(p.m1, p.v1, p.m2, p.v2), sp = Math.hypot(c.vx, c.vy);
    return [rd(sp, 2), rd(sp * sp / (2 * p.mu * g), 2)];
  },
  /* q40d: A east, B north. Force on A = m1 |v_final − v_A,start| / t, with A starting at (v1, 0). */
  q40d: p => {
    const c = couple(p.m1, p.v1, p.m2, p.v2), sp = Math.hypot(c.vx, c.vy);
    const dv = Math.hypot(c.vx - p.v1, c.vy - 0);
    return [rd(sp, 2), rd(sp * sp / (2 * g), 2), rd(p.m1 * dv / p.t, 2)];
  },
});
})();
