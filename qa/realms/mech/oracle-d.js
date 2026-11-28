/* Independent oracles for Mechanics: learn missions, file d: q31–q40 (game/realms/mech/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from the mission text by a
   different method from build() (docs/PACK-FORMAT.md §6): bisection on energy, time stepping, Taylor series, Kepler's law.
   Do not import game files. */
(function(){ 'use strict';
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const clean = x => Math.round(x * 1e9) / 1e9;
const bisect = (g, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };
/* sine by Taylor series after reducing into [−π, π]. */
const sinT = a => { const TP = 2 * Math.PI; a = a - TP * Math.round(a / TP); let s = 0, t = a; for (let k = 0; k < 40; k++) { s += t; t *= -a * a / ((2 * k + 2) * (2 * k + 3)); } return s; };
const g = 9.8;
Object.assign(window.ORACLE, {
  /* m, h, d, mu, k (mu is the printed coefficient, d the strip length). Speed at the bottom from the energy balance
     found by bisection on v (½mv² = mgh); then the spring: bisection on x for ½kx² = energy left after the strip. */
  q31: p => {
    const v = bisect(s => 0.5 * p.m * s * s - p.m * g * p.h, 0, 100);
    const left = 0.5 * p.m * v * v - p.mu * p.m * g * p.d;
    const x = bisect(c => 0.5 * p.k * c * c - left, 0, 100);
    return [rd(v, 2), rd(x, 2)];
  },
  /* Mass m, speed in v1, bounce speed back v2 (printed as −v2), contact time dt. */
  q32: p => {
    const pb = p.m * p.v1, pa = p.m * (-p.v2);
    const J = pa - pb;
    return [clean(pb), clean(J), clean(J / p.dt)];
  },
  /* Momentum totals, then energy before and after by summing the two bodies. */
  q33: p => {
    const P = p.m1 * p.v1 + p.m2 * p.v2, M = p.m1 + p.m2, v = P / M;
    const Kb = [[p.m1, p.v1], [p.m2, p.v2]].reduce((s, [m, u]) => s + m * u * u / 2, 0);
    return [clean(v), clean(Kb - M * v * v / 2)];
  },
  /* Weighted average of positions (printed as three masses at three points). */
  q34: p => {
    const pts = [[p.m1, p.x1, p.y1], [p.m2, p.x2, p.y2], [p.m3, p.x3, p.y3]];
    let M = 0, sx = 0, sy = 0; for (const [m, x, y] of pts) { M += m; sx += m * x; sy += m * y; }
    return [rd(sx / M, 2), rd(sy / M, 2)];
  },
  /* N rpm: each minute is N laps of 2π. Rim speed ωr. Turns: step through the t seconds one second at a time. */
  q35: p => {
    const w = p.N * 2 * Math.PI / 60;
    let turns = 0; for (let s = 0; s < p.t; s++) turns += w / (2 * Math.PI);
    return [rd(w, 2), rd(w * p.r, 2), rd(turns, 6)];
  },
  /* Three point weights; w is the spin rate in rad/s. */
  q36: p => {
    const I = [[p.m1, p.r1], [p.m2, p.r2], [p.m3, p.r3]].reduce((s, [m, r]) => s + m * r * r, 0);
    return [rd(I, 2), rd(0.5 * I * p.w * p.w, 2)];
  },
  /* Angle is a·π/b radians (a and b are the printed numerator and denominator). Torque r F sin θ; α = τ ÷ I. */
  q37: p => {
    const tau = p.r * p.F * sinT(p.a * Math.PI / p.b);
    return [rd(tau, 2), rd(tau / p.I, 2)];
  },
  /* Angular momentum kept; energy lost found as KE before − KE after, with the energy after written as L²/(2I). */
  q38: p => {
    const L = p.IA * p.w1, I = p.IA + p.IB, w = L / I;
    return [clean(L), rd(w, 2), rd(0.5 * p.IA * p.w1 * p.w1 - L * L / (2 * I), 2)];
  },
  /* mant × 10^ex kg planet, R km radius, h km altitude. Speed from GM/r; the period from Kepler's third law
     T² = 4π²r³/GM (not 2πr/v). The unrounded speed is what the prompt says to use, and the two routes agree. */
  q39: p => {
    const GM = p.mant * Math.pow(10, p.ex) * 6.67e-11, r = (p.R + p.h) * 1000;
    const v = Math.sqrt(GM / r);
    const T = Math.sqrt(4 * Math.PI * Math.PI * r * r * r / GM);
    return [Math.round(v), rd(T / 60, 2)];
  },
  /* A (m1) east at v1, B (m2) north at v2. Component momenta, then speed; the climb by stepping up the ramp until
     the potential energy gained equals the kinetic energy. */
  q40: p => {
    const M = p.m1 + p.m2, vx = p.m1 * p.v1 / M, vy = p.m2 * p.v2 / M;
    const v = Math.hypot(vx, vy);
    const K = 0.5 * M * v * v;
    const h = bisect(y => M * g * y - K, 0, 1000);
    return [rd(v, 2), rd(h, 2)];
  },
});
})();
