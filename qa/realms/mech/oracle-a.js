/* Independent oracles for Mechanics: learn missions, file a: q01–q10 (game/realms/mech/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from the mission text by a
   different method from build() (docs/PACK-FORMAT.md §6): digit shifting, simulation, search, numerical derivatives.
   Do not import game files. */
(function(){ 'use strict';
/* Round to d places; the tiny nudge keeps exact binary-fraction halves from rounding the wrong way. */
const rd = (x, d) => { const f = Math.pow(10, d); return Math.round(x * f * (1 + 1e-12) + (x >= 0 ? 1e-9 : -1e-9)) / f; };
const clean = x => Math.round(x * 1e9) / 1e9;
/* Bisection for a sign change of g on [lo, hi]. */
const bisect = (g, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };
Object.assign(window.ORACLE, {
  /* V km/h for M minutes. Convert by counting: V thousand metres per 3600 s; then distance = sum of one-second steps. */
  q01: p => {
    const v = p.V * 1000 / 3600, t = p.M * 60;
    let d = 0; for (let s = 0; s < t; s++) d += v;
    return [clean(v), t, clean(d)];
  },
  /* Reading i is (a_i ÷ 10) × 10^e_i in SI units. a1 and a2 are given in tenths (a1 = 25 prints 2.5), the exponent is
     the printed one. Shift the decimal point: μs = ×10^6, mm = ×10^3, MJ = ×10^-6, by building the number from text. */
  q02: p => {
    const conv = (a, e, shift) => Number((a / 10).toString() + 'e' + (e + shift));
    return [clean(conv(p.a1, p.e1, 6)), clean(conv(p.a2, p.e2, 3)), clean(conv(p.a3, p.e3, -6))];
  },
  /* M metres at th10 ÷ 10 radians (th10 is the angle in tenths of a radian, printed as a decimal). Components by the
     Taylor series of cos and sin (no Math.cos), reduced into [−π, π] first. */
  q03: p => {
    let th = p.th10 / 10; const TP = 2 * Math.PI;
    th = th - TP * Math.round(th / TP);
    let c = 0, s = 0, tc = 1, ts = th;
    for (let k = 0; k < 40; k++) {
      c += tc; s += ts;
      tc *= -th * th / ((2 * k + 1) * (2 * k + 2));
      ts *= -th * th / ((2 * k + 2) * (2 * k + 3));
    }
    return [rd(p.M * c, 2), rd(p.M * s, 2)];
  },
  /* R = A + B. Magnitude √(Rx² + Ry²). Angle by bisection on tan(θ) = Ry ÷ Rx over (0, π/2) (both components positive). */
  q04: p => {
    const rx = p.ax + p.bx, ry = p.ay + p.by;
    const mag = Math.sqrt(rx * rx + ry * ry);
    const ang = bisect(th => Math.sin(th) * rx - Math.cos(th) * ry, 0, Math.PI / 2);
    return [rx, ry, rd(mag, 2), rd(ang, 2)];
  },
  /* Dot product by components. Angle: the sight lines' directions are measured from east on their own; the angle
     between is the difference of the two bearings, folded into [0, π]. */
  q05: p => {
    const dot = p.ax * p.bx + p.ay * p.by;
    let d = Math.abs(Math.atan2(p.ay, p.ax) - Math.atan2(p.by, p.bx));
    if (d > Math.PI) d = 2 * Math.PI - d;
    return [dot, rd(d, 3)];
  },
  /* Positions x0, x1 (turn at t1), x2 (stop at t2). Displacement end − start; distance by walking the two straight
     legs in 0.01 m steps; average velocity = displacement ÷ total time. */
  q06: p => {
    const disp = p.x2 - p.x0;
    const leg = (a, b) => { const n = Math.round(Math.abs(b - a) * 100); return n / 100; };
    return [disp, leg(p.x0, p.x1) + leg(p.x1, p.x2), clean(disp / p.t2)];
  },
  /* x(t) = d + c t + b t² − a t³. Velocity is the slope of x over a tiny step either side of t (a symmetric
     difference). Speed = |velocity|. */
  q07: p => {
    const x = t => p.d + p.c * t + p.b * t * t - p.a * t * t * t, h = 1e-4;
    const v = t => (x(t + h) - x(t - h)) / (2 * h);
    return [rd(v(p.t1), 6), rd(v(p.t2), 6), Math.abs(rd(v(p.t2), 6))];
  },
  /* v(t) = p t² + q t + r. Average acceleration = change in v ÷ time taken; instantaneous = slope of v over a tiny step. */
  q08: p => {
    const v = t => p.p * t * t + p.q * t + p.r, h = 1e-4;
    return [rd((v(p.t2) - v(p.t1)) / (p.t2 - p.t1), 6), rd((v(p.t2 + h) - v(p.t2 - h)) / (2 * h), 6)];
  },
  /* q09: printed start speed v0 and deceleration a. Stopping time v0 ÷ a; distance = average of start and end speed
     (end = 0) × time. */
  q09: p => {
    const t = p.v0 / p.a;
    return [clean(t), clean((p.v0 + 0) / 2 * t)];
  },
  /* x(t) = h + v0 t − 4.9 t². Highest point by ternary search on x; landing time by bisection for x(t) = 0 after the top. */
  q10: p => {
    const x = t => p.h + p.v0 * t - 4.9 * t * t;
    let lo = 0, hi = 2 * p.v0 / 9.8 + 1;
    for (let i = 0; i < 300; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (x(m1) < x(m2)) lo = m1; else hi = m2; }
    const top = (lo + hi) / 2;
    let end = top + 1; while (x(end) > 0) end *= 2;
    const land = bisect(x, top, end);
    return [rd(top, 2), rd(x(top), 2), rd(land, 2)];
  },
});
})();
