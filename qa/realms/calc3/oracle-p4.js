/* Independent oracles for Calculus 3: many variables practice missions, file 4 of 8: q16b–q20d (game/realms/calc3/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const r3 = x => Math.round(x * 1000) / 1000;
/* Central difference with one Richardson step: exact for polynomials up to degree 4, so no error to round away. */
const cd = (f, t, e) => (f(t + e) - f(t - e)) / (2 * e);
const deriv = (f, t) => (4 * cd(f, t, 0.005) - cd(f, t, 0.01)) / 3;
/* Partial derivatives of f(x, y) by differencing one letter at a time (also usable on a derivative function). */
const dX = f => (x, y) => deriv(s => f(s, y), x);
const dY = f => (x, y) => deriv(s => f(x, s), y);
/* Length and angle of a pair, and the angle between two pairs by atan2 of the cross and dot products. */
const len = (u, v) => Math.sqrt(u * u + v * v);
const angle = (u1, v1, u2, v2) => Math.atan2(Math.abs(u1 * v2 - v1 * u2), u1 * u2 + v1 * v2);
/* Total rate of f along the path (X(t), Y(t)) at time t, by differencing the composite function directly. */
const along = (f, X, Y, t) => deriv(s => f(X(s), Y(s)), t);
Object.assign(window.ORACLE, {
  /* q16b: g = k + c x² + a x y + b y³ (a is the xy coefficient); the nearby point is the map point moved by dx/10, dy/10. */
  q16b: p => {
    const g = (x, y) => p.k + p.c * x * x + p.a * x * y + p.b * y * y * y;
    const gx = dX(g)(p.x, p.y), gy = dY(g)(p.x, p.y);
    const nx = p.x + p.dx / 10, ny = p.y + p.dy / 10;
    return [r6(gx), r6(gy), r6(g(p.x, p.y) + gx * (nx - p.x) + gy * (ny - p.y))];
  },
  /* q16c: D = k + a x² + b x y + c y²; the drive ends at (x + dx/10, y + dy/10). Estimate, then exact minus estimate. */
  q16c: p => {
    const D = (x, y) => p.k + p.a * x * x + p.b * x * y + p.c * y * y;
    const Dx = dX(D)(p.x, p.y), Dy = dY(D)(p.x, p.y);
    const nx = p.x + p.dx / 10, ny = p.y + p.dy / 10;
    const change = Dx * (nx - p.x) + Dy * (ny - p.y);
    const est = D(p.x, p.y) + change;
    return [r6(change), r6(est), r6(D(nx, ny) - est)];
  },
  /* q16d: h = k + a x² y + b x y². Plane h_x x + h_y y - z = d through (x, y, h(x, y)). */
  q16d: p => {
    const h = (x, y) => p.k + p.a * x * x * y + p.b * x * y * y;
    const hx = dX(h)(p.x, p.y), hy = dY(h)(p.x, p.y), z = h(p.x, p.y);
    return [r6(hx), r6(hy), r6(hx * p.x + hy * p.y - z)];
  },
  /* q17b: T = k + a x³ + b x y² + c y; next stop is (x + dx/10, y + dy/10). */
  q17b: p => {
    const T = (x, y) => p.k + p.a * x * x * x + p.b * x * y * y + p.c * y;
    const Tx = dX(T)(p.x, p.y), Ty = dY(T)(p.x, p.y);
    return [r6(T(p.x, p.y)), r6(Tx), r6(T(p.x, p.y) + Tx * p.dx / 10 + Ty * p.dy / 10)];
  },
  /* q17c: h = k + a x² y + b x y + c y². mm is only a count of half-units: the ledge is (h_x + h_y) × mm/2 metres higher (as the
     prompt states it). The rover moves d east and d north; d found by searching in steps of 0.5 m for the first one whose
     tangent-plane rise h_x d + h_y d reaches that height. */
  q17c: p => {
    const h = (x, y) => p.k + p.a * x * x * y + p.b * x * y + p.c * y * y;
    const hx = dX(h)(p.x, p.y), hy = dY(h)(p.x, p.y);
    const gain = Math.round((hx + hy) * p.mm / 2 * 10) / 10;
    let d = 0; while (hx * d + hy * d < gain - 1e-9) d += 0.5;
    return [r6(h(p.x, p.y)), r6(hx), r6(hy), r6(d)];
  },
  /* q17d: h = k + a x² y + b x y³. Slope north h_y, then h_xy and h_yy (the derivatives of h_y), then the linear estimate of h_y
     at (x + dx/10, y + dy/10). */
  q17d: p => {
    const h = (x, y) => p.k + p.a * x * x * y + p.b * x * y * y * y;
    const hy = dY(h);
    const hyx = dX(hy)(p.x, p.y), hyy = dY(hy)(p.x, p.y);
    return [r6(hy(p.x, p.y)), r6(hyx), r6(hyy), r6(hy(p.x, p.y) + hyx * p.dx / 10 + hyy * p.dy / 10)];
  },
  /* q18b: P = a x² y + b y²; x(t) = p + q t, y(t) = r t; s is the time of the reading. */
  q18b: p => {
    const P = (x, y) => p.a * x * x * y + p.b * y * y;
    const X = t => p.p + p.q * t, Y = t => p.r * t;
    return [r6(deriv(X, p.s)), r6(deriv(Y, p.s)), r6(along(P, X, Y, p.s))];
  },
  /* q18c: T = a x y + b y² + c x; x(t) = p + q t², y(t) = r + u t; s is the time, h is tenths of an hour to go on. */
  q18c: p => {
    const T = (x, y) => p.a * x * y + p.b * y * y + p.c * x;
    const X = t => p.p + p.q * t * t, Y = t => p.r + p.u * t;
    const rate = along(T, X, Y, p.s);
    return [r6(rate), r6(T(X(p.s), Y(p.s)) + rate * p.h / 10)];
  },
  /* q18d: T = a x² y + b y³; x(t) = p + q t², y(t) = r + u t; s is the time. Level c is the temperature at the balloon. */
  q18d: p => {
    const T = (x, y) => p.a * x * x * y + p.b * y * y * y;
    const X = t => p.p + p.q * t * t, Y = t => p.r + p.u * t;
    return [r6(T(X(p.s), Y(p.s))), r6(along(T, X, Y, p.s))];
  },
  /* q19b: w = a x² y + b y²; the second vane is at (x + u, y + v), so the course is along (u, v). */
  q19b: p => {
    const w = (x, y) => p.a * x * x * y + p.b * y * y;
    const gx = dX(w)(p.x, p.y), gy = dY(w)(p.x, p.y);
    const sx = p.x + p.u, sy = p.y + p.v;   // second vane
    const L = len(sx - p.x, sy - p.y);
    return [r6(gx), r6(gy), r6((gx * (sx - p.x) + gy * (sy - p.y)) / L)];
  },
  /* q19c: T = k + a x² + b x y + c y²; heading (u, v); h is tenths of a kilometre drifted. */
  q19c: p => {
    const T = (x, y) => p.k + p.a * x * x + p.b * x * y + p.c * y * y;
    const gx = dX(T)(p.x, p.y), gy = dY(T)(p.x, p.y);
    const rate = (gx * p.u + gy * p.v) / len(p.u, p.v);
    return [r6(rate), r6(T(p.x, p.y) + rate * p.h / 10)];
  },
  /* q19d: T = a x² + b x y + c y² + e x; the balloon's velocity is (u, v) km per hour. */
  q19d: p => {
    const T = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y + p.e * x;
    const gx = dX(T)(p.x, p.y), gy = dY(T)(p.x, p.y);
    return [r6(gx), r6(gy), r6(along(T, t => p.x + p.u * t, t => p.y + p.v * t, 0)),
      r6((gx * p.u + gy * p.v) / len(p.u, p.v))];
  },
  /* q20b: T = a x² + b x y + c y² + d x + e y. Greatest rate is the gradient's length; angle from north (0, 1). */
  q20b: p => {
    const T = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y + p.d * x + p.e * y;
    const gx = dX(T)(p.x, p.y), gy = dY(T)(p.x, p.y);
    return [r6(len(gx, gy)), r3(angle(gx, gy, 0, 1))];
  },
  /* q20c: P = a x² + b x y + c y² + d x + e y; speed V. mm counts half-hours of flight, so the gain asked about is the
     hourly rise times mm/2, and the time for it is found by stepping in minutes at the hourly rise. */
  q20c: p => {
    const P = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y + p.d * x + p.e * y;
    const gx = dX(P)(p.x, p.y), gy = dY(P)(p.x, p.y);
    const best = len(gx, gy), perHour = best * p.V;
    const gain = perHour * p.mm / 2;
    let minutes = 0; while (perHour * minutes / 60 < gain - 1e-9) minutes++;
    /* End point: fly straight at the heading angle of the gradient, V km per hour for that time. */
    const ang = Math.atan2(gy, gx), dist = p.V * minutes / 60;
    return [r6(best), r6(perHour), r6(minutes / 60), r6(p.x + dist * Math.cos(ang)), r6(p.y + dist * Math.sin(ang))];
  },
  /* q20d: D = a x² + b x y + c y² + d x + e y; heading (u, v). Greatest rate, rate along the heading, angle between them. */
  q20d: p => {
    const D = (x, y) => p.a * x * x + p.b * x * y + p.c * y * y + p.d * x + p.e * y;
    const gx = dX(D)(p.x, p.y), gy = dY(D)(p.x, p.y);
    return [r6(len(gx, gy)), r6((gx * p.u + gy * p.v) / len(p.u, p.v)), r3(angle(p.u, p.v, gx, gy))];
  },
});
})();
