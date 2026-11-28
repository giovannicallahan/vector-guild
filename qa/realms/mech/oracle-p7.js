/* Independent oracles for Mechanics: motion and force practice missions, file 7 of 8: q31b–q35d (game/realms/mech/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const g = 9.8;
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + 1e-9 * Math.sign(x)) / f; };
const sq = Math.sqrt;
Object.assign(window.ORACLE, {
  /* q31b: all printed (m kg, k N/m, x m, d m, mu). Energy ledger: spring energy minus friction work = KE at ramp foot.
     v from KE = ½mv²; h from KE = mgh (unrounded KE). */
  q31b: p => {
    const ke = 0.5 * p.k * p.x * p.x - p.mu * p.m * g * p.d;
    return [rd(sq(2 * ke / p.m), 2), rd(ke / (p.m * g), 2)];
  },
  /* q31c: speed at the bottom from v0 and the drop h (frictionless); slides until KE is gone: v²/(2 mu g); heat = KE at the bottom. */
  q31c: p => {
    const v2 = p.v0 * p.v0 + 2 * g * p.h;
    return [rd(sq(v2), 2), rd(v2 / (2 * p.mu * g), 2), rd(0.5 * p.m * v2, 2)];
  },
  /* q31d: energy at the foot of the ramp E0 = ½mv0² + mgh; strip costs mu m g d; the spring takes the rest,
     ½kx² = E0 − friction; on the way back it loses the strip again, then climbs: mgH = ½kx² − friction. */
  q31d: p => {
    const fr = p.mu * p.m * g * p.d;
    const E0 = 0.5 * p.m * p.v0 * p.v0 + p.m * g * p.h;
    const Es = E0 - fr;
    return [rd(sq(2 * Es / p.k), 2), rd((Es - fr) / (p.m * g), 2)];
  },
  /* q32b: v1, v2 are printed speeds (down before, up after); upward positive. */
  q32b: p => {
    const J = p.m * (p.v2 - (-p.v1));
    return [p.m * p.v2, J, J / p.dt];
  },
  /* q32c: towards the buffer positive: after = −v2. Impulse size m(v1+v2); time = J/F. */
  q32c: p => {
    const J = p.m * (p.v1 + p.v2);
    return [J, rd(J / p.F, 2)];
  },
  /* q32d: speeds from energy; up positive: J = m(v_up − (−v_down)). */
  q32d: p => {
    const vd = sq(2 * g * p.h1), vu = sq(2 * g * p.h2), J = p.m * (vu + vd);
    return [rd(vd, 2), rd(J, 2), rd(J / p.dt, 2)];
  },
  /* q33b: perfectly inelastic, signed velocities. */
  q33b: p => {
    const M = p.m1 + p.m2, v = (p.m1 * p.v1 + p.m2 * p.v2) / M;
    const ke0 = 0.5 * p.m1 * p.v1 ** 2 + 0.5 * p.m2 * p.v2 ** 2;
    return [rd(v, 2), rd(p.m2 * (v - p.v2), 2), rd(ke0 - 0.5 * M * v * v, 2)];
  },
  /* q33c: B at rest; pair decelerates at mu g. */
  q33c: p => {
    const M = p.m1 + p.m2, v = p.m1 * p.v1 / M;
    return [rd(v, 2), rd(0.5 * p.m1 * p.v1 ** 2 - 0.5 * M * v * v, 2), rd(v * v / (2 * p.mu * g), 2)];
  },
  /* q33d: elastic: separation speed rule plus momentum, solved as a 2x2 linear system (Cramer's rule).
     m1 a + m2 b = P ;  −a + b = s  with s = v1 − v2. */
  q33d: p => {
    const P = p.m1 * p.v1 + p.m2 * p.v2, s = p.v1 - p.v2;
    const det = p.m1 * 1 + p.m2 * 1;           /* | m1 m2 ; −1 1 | */
    const a = (P * 1 - p.m2 * s) / det;
    const b = (p.m1 * s + P) / det;
    return [rd(a, 2), rd(b, 2), rd(p.m2 * (b - p.v2), 2)];
  },
  /* q34b: four point masses; weighted mean of the printed positions. */
  q34b: p => {
    const M = p.m1 + p.m2 + p.m3 + p.m4;
    return [rd((p.m1 * p.x1 + p.m2 * p.x2 + p.m3 * p.x3 + p.m4 * p.x4) / M, 2),
            rd((p.m1 * p.y1 + p.m2 * p.y2 + p.m3 * p.y3 + p.m4 * p.y4) / M, 2)];
  },
  /* q34c: target (tx, ty) is the centre of mass of all four: solve for D. */
  q34c: p => {
    const M = p.m1 + p.m2 + p.m3 + p.m4;
    return [rd((p.tx * M - (p.m1 * p.x1 + p.m2 * p.x2 + p.m3 * p.x3)) / p.m4, 2),
            rd((p.ty * M - (p.m1 * p.y1 + p.m2 * p.y2 + p.m3 * p.y3)) / p.m4, 2)];
  },
  /* q34d: signed positions and velocities; t seconds later. */
  q34d: p => {
    const M = p.m1 + p.m2, X = (p.m1 * p.x1 + p.m2 * p.x2) / M, V = (p.m1 * p.v1 + p.m2 * p.v2) / M;
    return [rd(X, 2), rd(V, 2), rd(X + V * p.t, 2)];
  },
  /* q35b: N rpm, wheel radius r, time t. */
  q35b: p => {
    const w = p.N * 2 * Math.PI / 60;
    return [rd(w, 2), rd(w * p.r, 2), rd(w * p.r * p.t, 2)];
  },
  /* q35c: v = ω r at the limit; rpm = ω×60/2π; one turn takes 2π/ω. */
  q35c: p => {
    const w = p.vmax / p.r;
    return [rd(w, 2), rd(w * 60 / (2 * Math.PI), 2), rd(2 * Math.PI / w, 2)];
  },
  /* q35d: a = v²/r = ω² r, so ω = √(a/r); v = ω r. */
  q35d: p => {
    const w = sq(p.a / p.r);
    return [rd(w, 2), rd(w * p.r, 2), rd(w * 60 / (2 * Math.PI), 2)];
  },
});
})();
