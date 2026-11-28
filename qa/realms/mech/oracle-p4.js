/* Independent oracles for Mechanics: motion and force practice missions, file 4 of 8: q16b–q20d (game/realms/mech/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f + 1e-9 * Math.sign(x)) / f; };
const r6 = x => Math.round(x * 1e6) / 1e6;
const g = 9.8;
/* Projectile flown step by step is not needed: time of flight and horizontal travel come from y(t) = v sinθ t − ½ g t² = 0. */
const flight = (v, th) => { const T = 2 * v * Math.sin(th) / g; return v * Math.cos(th) * T; };
Object.assign(window.ORACLE, {
  /* q16b: ax, ay drone relative to air; wx, wy wind relative to ground (all printed). */
  q16b: p => { const X = p.ax + p.wx, Y = p.ay + p.wy; return [X, Y, rd(Math.sqrt(X * X + Y * Y), 2)]; },
  /* q16c: air velocity (ax, ay), wind (wx, wy), pad D m east (printed). Time = D / eastward ground speed. */
  q16c: p => { const vx = p.ax + p.wx, vy = p.ay + p.wy, t = p.D / vx; return [r6(t), r6(vy * t)]; },
  /* q16d: wind W at th rad (printed) relative to ground; (sx, sy) wind relative to rover (printed). Rover = wind_ground − wind_rover. */
  q16d: p => {
    const x = p.W * Math.cos(p.th) - p.sx, y = p.W * Math.sin(p.th) - p.sy;
    return [rd(x, 2), rd(y, 2), rd(Math.hypot(x, y), 2)];
  },
  /* q17b: radius r, period T, height h (printed). Centripetal 4π²r/T²; fall time from h = ½ g t²; carry at v = 2πr/T. */
  q17b: p => {
    const v = 2 * Math.PI * p.r / p.T, t = Math.sqrt(2 * p.h / g);
    return [rd(4 * Math.PI * Math.PI * p.r / (p.T * p.T), 2), rd(t, 2), rd(v * t, 2)];
  },
  /* q17c: r, T, th (rad), crate distance D (printed). Range from time of flight times horizontal speed. */
  q17c: p => {
    const R = flight(2 * Math.PI * p.r / p.T, p.th);
    return [rd(R, 2), rd(Math.abs(R - p.D), 2)];
  },
  /* q17d: r, tangential rate at (m/s per s), duration t, angle th rad (printed). */
  q17d: p => {
    const v = p.at * p.t;
    return [rd(v, 2), rd(Math.hypot(v * v / p.r, p.at), 2), rd(flight(v, p.th), 2)];
  },
  /* q18b: three printed forces and the mass. */
  q18b: p => {
    const X = p.f1x + p.f2x + p.f3x, Y = p.f1y + p.f2y + p.f3y;
    return [X, Y, r6(Math.hypot(X, Y) / p.m)];
  },
  /* q18c: two printed forces, mass, time; distance ½ a t². */
  q18c: p => {
    const a = Math.hypot(p.f1x + p.f2x, p.f1y + p.f2y) / p.m;
    return [r6(a), r6(0.5 * a * p.t * p.t)];
  },
  /* q18d: printed v_x = a1 t² + b1 t + c1, v_y = a2 t² + b2 t + c2; acceleration = derivative; F2 = m a − F1. */
  q18d: p => {
    const ax = 2 * p.a1 * p.t0 + p.b1, ay = 2 * p.a2 * p.t0 + p.b2;
    const x = p.m * ax - p.f1x, y = p.m * ay - p.f1y;
    return [x, y, rd(Math.hypot(x, y), 2)];
  },
  /* q19b: k is an index into the four cases: 0 rising and speeding up, 1 rising and slowing, 2 descending and speeding up,
     3 descending and slowing. The acceleration points up (+A) in cases 0 and 3, down (−A) in cases 1 and 2. */
  q19b: p => {
    const a = (p.k === 0 || p.k === 3) ? p.A : -p.A;
    return [r6(p.m * g), r6(p.m * (g + a))];
  },
  /* q19c: the printed limit Fm is the plate's maximum push on the crate of mass m; a = (Fm − m g) ÷ m. */
  q19c: p => {
    const a = (p.Fm - p.m * g) / p.m;
    return [rd(a, 2), rd(p.V / a, 2)];
  },
  /* q19d: v(t) = p t² + q t + c; a = 2 p t0 + q; N = m (g + a). */
  q19d: p => { const a = 2 * p.p * p.t0 + p.q; return [r6(a), r6(p.m * (g + a))]; },
  /* q20b: both sleds share a; the tow-bar alone accelerates the rear sled. */
  q20b: p => { const a = p.F / (p.m1 + p.m2); return [rd(a, 2), rd(p.m2 * a, 2)]; },
  /* q20c: the printed rating Tm is the lower cable's tension limit; the bottom crate alone gives a = (Tm − m2 g) ÷ m2. */
  q20c: p => {
    const a = (p.Tm - p.m2 * g) / p.m2;
    return [rd(a, 2), rd((p.m1 + p.m2) * (g + a), 2)];
  },
  /* q20d: whole stack F − M g = M a; each cable carries the weight-plus-acceleration of everything below it. */
  q20d: p => {
    const M = p.m1 + p.m2 + p.m3, a = (p.F - M * g) / M;
    return [rd(a, 2), rd((p.m2 + p.m3) * (g + a), 2), rd(p.m3 * (g + a), 2)];
  },
});
})();
