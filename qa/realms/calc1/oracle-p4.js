/* Independent oracles for Calculus 1 practice missions, file 4 of 8: q16b-q20d (game/realms/calc1/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build(): numerical derivatives (Richardson-extrapolated
   symmetric differences, rounded because every answer here is tidy), scans for a maximum or a sign change, bisection,
   and second differences. qa/generators.js loads this file after the whole pack and fails a practice mission with no oracle. */
(function(){ 'use strict';
const clean = x => Math.round(x * 1e7) / 1e7;
/* Symmetric difference with one Richardson step: exact for polynomials up to degree 4, error ~h^4 otherwise. */
const slopeAt = (f, x, h = 1e-3) => {
  const d = k => (f(x + k) - f(x - k)) / (2 * k);
  return clean((4 * d(h / 2) - d(h)) / 3);
};
/* Second difference with step 1 (exact for cubics) or a small step for other functions. */
const bendAt = (f, x, h = 1) => clean((f(x + h) - 2 * f(x) + f(x - h)) / (h * h));
/* The x in [lo, hi] (grid of 1/1000) where f is largest. */
const peakOn = (f, lo, hi) => {
  let bestK = 0, best = -Infinity;
  for (let k = lo * 1000; k <= hi * 1000; k++) { const v = f(k / 1000); if (v > best + 1e-9) { best = v; bestK = k; } }
  return bestK / 1000;
};
/* Bisection for a root of f in [lo, hi] where f changes sign. */
const bisect = (f, lo, hi) => {
  let flo = f(lo);
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, fm = f(mid); if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid; }
  return clean((lo + hi) / 2);
};
Object.assign(window.ORACLE, {
  /* s(t) = p t^3 - b t^2 + c t. Velocity by symmetric difference, acceleration by second difference, speeding up if they agree in sign. */
  q16b: p => {
    const s = t => p.p * t ** 3 - p.b * t ** 2 + p.c * t;
    const v = slopeAt(s, p.t0), a = bendAt(s, p.t0);
    return [v, a, v * a > 0 ? 1 : 0];
  },
  /* s(t) = 2kT t - k t^2; the barrier is gap metres beyond the stopping point. Scan for the moment of greatest position. */
  q16c: p => {
    const s = t => 2 * p.k * p.T * t - p.k * t * t;
    const tStop = peakOn(s, 0, 2 * p.T + 5), dist = s(tStop), barrier = p.k * p.T * p.T + p.gap;
    return [tStop, clean(dist), clean(barrier - dist)];
  },
  /* s(t) = p t^3 - (3p(r1+r2)/2) t^2 + 3p r1 r2 t. Scan the numerical velocity for its two sign changes, bisect, average velocity from positions. */
  q16d: p => {
    const s = t => p.p * t ** 3 - 1.5 * p.p * (p.r1 + p.r2) * t * t + 3 * p.p * p.r1 * p.r2 * t;
    const v = t => (s(t + 1e-4) - s(t - 1e-4)) / 2e-4;
    const roots = [];
    for (let k = 0; k < 2000; k++) { const a = k / 100, b = (k + 1) / 100; if ((v(a) > 0) !== (v(b) > 0)) roots.push(bisect(v, a, b)); }
    const [t1, t2] = roots;
    return [t1, t2, clean((s(t2) - s(t1)) / (t2 - t1))];
  },
  /* T(t) = p t^3 + q t^2 + r t + d; tangent forecast one minute on is T(t0) + T'(t0). */
  q17b: p => {
    const T = t => p.p * t ** 3 + p.q * t ** 2 + p.r * t + p.d;
    const rate = slopeAt(T, p.t0);
    return [rate, bendAt(T, p.t0), clean(T(p.t0) + rate)];
  },
  /* s(t) = p t^3 + q t^2 + r t + d; the marker is where the tangent line at t0 stands h seconds later; solve the line for that height. */
  q17c: p => {
    const s = t => p.p * t ** 3 + p.q * t ** 2 + p.r * t + p.d;
    const pos = s(p.t0), rate = slopeAt(s, p.t0);
    const line = t => pos + rate * (t - p.t0);
    const marker = line(p.t0 + p.h);
    const tReach = bisect(t => line(t) - marker, p.t0, p.t0 + 4 * p.h + 10);
    return [pos, rate, tReach];
  },
  /* s(t) = p t^3 + q t^2 + r t + d; forecast h seconds after t0 along the tangent, compare with the true position. */
  q17d: p => {
    const s = t => p.p * t ** 3 + p.q * t ** 2 + p.r * t + p.d;
    const rate = slopeAt(s, p.t0), forecast = s(p.t0) + rate * p.h;
    return [rate, bendAt(s, p.t0), clean(s(p.t0 + p.h) - forecast)];
  },
  /* P(t) = (A - B t)(c t^2 + d): value, then the rate by numerical differentiation. */
  q18b: p => {
    const P = t => (p.A - p.B * t) * (p.c * t * t + p.d);
    return [clean(P(p.t0)), slopeAt(P, p.t0)];
  },
  /* Plate: length 30 + 3t style (a*m + a t), width W0 - b t with W0 = b m + 2 b T. Area rate by numerical differentiation; scan for the largest area. */
  q18c: p => {
    const L = t => p.a * p.m + p.a * t, W0 = p.b * p.m + 2 * p.b * p.T, W = t => W0 - p.b * t;
    const A = t => L(t) * W(t);
    return [slopeAt(A, p.t0), peakOn(A, 0, W0 / p.b)];
  },
  /* y = (x^2 + q)(r x + s): point, slope by numerical differentiation, then intercept from the point-slope line. */
  q18d: p => {
    const y = x => (x * x + p.q) * (p.r * x + p.s);
    const m = slopeAt(y, p.x0);
    return [clean(y(p.x0)), m, clean(y(p.x0) - m * p.x0)];
  },
  /* M(x) = (a x + b) / x, evaluated and differentiated numerically. */
  q19b: p => {
    const M = x => (p.a * x + p.b) / x;
    return [clean(M(p.x0)), slopeAt(M, p.x0, 1e-3)];
  },
  /* c(t) = m t / (V0 + r t). The limit is the printed one-decimal value of c(t0) + h c'(t0); minutes = gap / rate. */
  q19c: p => {
    const c = t => p.m * t / (p.V0 + p.r * t);
    const c0 = c(p.t0), rate = slopeAt(c, p.t0, 1e-3);
    const limit = Math.round((c0 + p.h * rate) * 10) / 10;
    return [clean(c0), rate, (limit - c0) / rate];
  },
  /* R(x) = (a x + b)(x + d) / (x + c), evaluated and differentiated numerically as one function. */
  q19d: p => {
    const R = x => (p.a * x + p.b) * (x + p.d) / (x + p.c);
    return [clean(R(p.x0)), slopeAt(R, p.x0, 1e-3)];
  },
  /* Side s(t) = b - a t, volume s^3, differentiated numerically. */
  q20b: p => {
    const side = t => p.b - p.a * t, V = t => side(t) ** 3;
    return [side(p.t0), slopeAt(V, p.t0)];
  },
  /* P(t) = c (a t + b)^2. The trip rate is the printed P'(T); bisect P'(t) = that rate. */
  q20c: p => {
    const P = t => p.c * (p.a * t + p.b) ** 2, dP = t => slopeAt(P, t);
    const trip = dP(p.T);
    return [dP(p.t0), bisect(t => dP(t) - trip, 0, 200)];
  },
  /* H(x) = (x + p)(a x + b)^2, evaluated and differentiated numerically as one function. */
  q20d: p => {
    const H = x => (x + p.p) * (p.a * x + p.b) ** 2;
    return [clean(H(p.x0)), slopeAt(H, p.x0)];
  },
});
})();
