/* Independent oracles for Mechanics: learn missions, file b: q11–q20 (game/realms/mech/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from the mission text by a
   different method from build() (docs/PACK-FORMAT.md §6): numerical integration, root finding, search, simulation.
   Do not import game files. */
(function(){ 'use strict';
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const clean = x => Math.round(x * 1e9) / 1e9;
const G = 9.8;
/* Bisection for a sign change of g on [lo, hi]. */
const bisect = (g, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };
/* Composite Simpson integral of f on [a, b] (exact for cubics). */
const simpson = (f, a, b, n) => { n = n || 2000; const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/* Flight on level ground: height y(t) = s t − ½ g t² with s = v sin θ. Time of flight by bisection for y = 0 after the
   top; top found by ternary search. Range = sideways speed × flight time. */
const flight = (v, th) => {
  const s = v * Math.sin(th), y = t => s * t - 0.5 * G * t * t;
  let lo = 0, hi = 2 * s / G + 1;
  for (let i = 0; i < 300; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (y(m1) < y(m2)) lo = m1; else hi = m2; }
  const top = (lo + hi) / 2, tf = bisect(y, top, 4 * top + 1);
  return { tf, range: v * Math.cos(th) * tf, height: y(top) };
};
Object.assign(window.ORACLE, {
  /* a(t) = b + c t, v(0) = v0, x(0) = x0, at t = T. Integrate numerically: v(t) = v0 + ∫a, x(T) = x0 + ∫v. */
  q11: p => {
    const a = t => p.b + p.c * t, v = t => p.v0 + simpson(a, 0, t, 200);
    return [rd(v(p.T), 6), rd(p.x0 + simpson(v, 0, p.T, 200), 6)];
  },
  /* Fall h from rest vertically: find t with 4.9 t² = h by bisection; distance = u × unrounded t. */
  q12: p => {
    const t = bisect(x => 4.9 * x * x - p.h, 0, 100);
    return [rd(t, 2), rd(p.u * t, 2)];
  },
  /* Launch speed v at angle th (radians) on level ground: range and top height. */
  q13: p => { const f = flight(p.v, p.th); return [rd(f.range, 2), rd(f.height, 2)]; },
  /* Radius r, period T. Speed = distance round one turn ÷ T; centripetal acceleration from the unrounded speed,
     found as the change of direction rate: ω² r with ω = 2π ÷ T. */
  q14: p => {
    const circ = 2 * Math.PI * p.r, v = circ / p.T, w = 2 * Math.PI / p.T;
    return [rd(v, 2), rd(w * w * p.r, 2)];
  },
  /* Centripetal v²/r and tangential at are at right angles: size of the sum by iterating Newton's square-root step. */
  q15: p => {
    const c = p.v * p.v / p.r, s = c * c + p.at * p.at;
    let x = Math.max(c, p.at); for (let i = 0; i < 60; i++) x = (x + s / x) / 2;
    return [rd(c, 2), rd(x, 2)];
  },
  /* Wind relative to ground = wind relative to rover + rover velocity (components). */
  q16: p => {
    const x = p.sx + p.rx, y = p.sy + p.ry;
    let s = x * x + y * y, r = Math.max(1, s); for (let i = 0; i < 80; i++) r = (r + s / r) / 2;
    return [x, y, rd(r, 2)];
  },
  /* Total acceleration before release (centripetal v²/r with tangential at), then projectile launched at speed v. */
  q17: p => {
    const c = p.v * p.v / p.r, tot = Math.hypot(c, p.at), f = flight(p.v, p.th);
    return [rd(tot, 2), rd(f.tf, 2), rd(f.range, 2)];
  },
  /* Net force = vector sum of the two ropes; acceleration size from simulating a single second of F = m a by searching
     for the acceleration a with m a = |F| (bisection). */
  q18: p => {
    const fx = p.f1x + p.f2x, fy = p.f1y + p.f2y, mag = Math.hypot(fx, fy);
    const a = bisect(x => p.m * x - mag, 0, mag + 1);
    return [fx, fy, clean(a)];
  },
  /* A = size of acceleration, k = which of four lift situations (an index into a list of texts):
     0 rising and speeding up, 1 rising and slowing down, 2 descending and speeding up, 3 descending and slowing down.
     Acceleration points up in cases 0 and 3, down in 1 and 2. Normal force: solve F_N − m g = m a by bisection. */
  q19: p => {
    const a = (p.k === 0 || p.k === 3) ? p.A : -p.A, w = p.m * G;
    const fn = bisect(f => f - w - p.m * a, 0, 10 * w + 100);
    return [clean(w), clean(fn)];
  },
  /* Cable pulls F up on the top crate (m1); the lower crate (m2) hangs on a cable. Unknown a: the lower cable tension
     is T = m2 (g + a); the top crate needs F − m1 g − T = m1 a. Solve for a by bisection. */
  q20: p => {
    const a = bisect(x => p.F - p.m1 * G - p.m2 * (G + x) - p.m1 * x, -100, 1000);
    return [rd(a, 2), rd(p.m2 * (G + a), 2)];
  },
});
})();
