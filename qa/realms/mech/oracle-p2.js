/* Independent oracles for Mechanics: practice missions, file 2 of 8: q06b–q10d (game/realms/mech/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from the prompt text by a different method from build() (a table of positions, a numerical search, a stepped sum).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const G = 9.8;
/* Position-time functions are tabulated and differenced numerically (central difference on a polynomial is exact for
   degree ≤ 2; for cubics a tiny step plus Richardson extrapolation keeps the error far below any tolerance). */
const slope = (f, t, h = 1e-3) => {
  const d = k => (f(t + k) - f(t - k)) / (2 * k);
  return (4 * d(h / 2) - d(h)) / 3;
};
/* Smallest positive time at which f falls to zero, found by stepping and then bisecting. */
const firstZero = (f, step = 1e-3) => {
  let t = 0; while (f(t + step) > 0) t += step;
  let lo = t, hi = t + step; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
Object.assign(window.ORACLE, {
  /* q06b: heights tabulated along the two legs; displacement by end points, distance by summing leg lengths. */
  q06b: p => {
    const legs = [p.x1 - p.x0, p.x2 - p.x1];
    const dist = legs.reduce((s, l) => s + Math.abs(l), 0), disp = legs[0] + legs[1];
    return [disp, dist, disp / p.T];
  },
  /* q06c: average velocity v over T gives the displacement; stop = start + displacement; legs out and back. */
  q06c: p => {
    const disp = p.v * p.T, stop = p.x0 + disp;
    return [disp, stop, Math.abs(p.x1 - p.x0) + Math.abs(stop - p.x1)];
  },
  /* q06d: east and north parts separately, then the size of the average velocity. */
  q06d: p => {
    const e = p.x1 - p.x0, n = p.y1 - p.y0;
    return [e, n, Math.hypot(e / p.T, n / p.T)];
  },
  /* q07b: x(t) = d + b t² − a t³ (a, b, d from the prompt); velocity by numerical slope; speed is its size. */
  q07b: p => {
    const x = t => p.d + p.b * t * t - p.a * t * t * t;
    const v1 = slope(x, p.t1), v2 = slope(x, p.t2);
    return [v1, v2, Math.abs(v2)];
  },
  /* q07c: x(t) = d + 2 b ts t − b t² (the prompt prints the expanded form: linear coefficient is 2 b ts). Rest time is the
     first zero of the slope; position then; slope at T. */
  q07c: p => {
    const x = t => p.d + 2 * p.b * p.ts * t - p.b * t * t;
    const v = t => slope(x, t);
    const t0 = firstZero(v);
    return [t0, x(t0), v(p.T)];
  },
  /* q07d: x(t) = d + c t + b t²; average slope between t1 and t2; the time where the slope equals it, by bisection
     (the slope is monotone for b ≠ 0). */
  q07d: p => {
    const x = t => p.d + p.c * t + p.b * t * t;
    const avg = (x(p.t2) - x(p.t1)) / (p.t2 - p.t1);
    let lo = p.t1, hi = p.t2; const inc = slope(x, hi) > slope(x, lo);
    for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((slope(x, m) < avg) === inc) lo = m; else hi = m; }
    return [avg, slope(x, p.t2), (lo + hi) / 2];
  },
  /* q08b: v(t) = c + b t − a t³; average acceleration from the two velocities; instantaneous by numerical slope. */
  q08b: p => {
    const v = t => p.c + p.b * t - p.a * t * t * t;
    return [(v(p.t2) - v(p.t1)) / (p.t2 - p.t1), slope(v, p.t1), slope(v, p.t2)];
  },
  /* q08c: v(t) = r + 2 b ts t − b t² (linear coefficient is 2 b ts); acceleration zero where the slope vanishes. */
  q08c: p => {
    const v = t => p.r + 2 * p.b * p.ts * t - p.b * t * t;
    const t0 = firstZero(t => slope(v, t));
    return [(v(p.T) - v(0)) / p.T, t0, v(t0)];
  },
  /* q08d: x(t) = d + c t + b t² + a t³; velocity = slope of x; acceleration = slope of velocity. */
  q08d: p => {
    const x = t => p.d + p.c * t + p.b * t * t + p.a * t * t * t;
    const vn = t => slope(x, t, 1e-2);
    const acc = t => slope(vn, t, 1e-2);
    return [vn(p.t1), (vn(p.t2) - vn(p.t1)) / (p.t2 - p.t1), acc(p.t2)];
  },
  /* q09b: from rest, distance L at exit speed v: average speed v/2 gives the time; acceleration is v ÷ time. */
  q09b: p => {
    const t = p.L / (p.v / 2);
    return [p.v / t, t];
  },
  /* q09c: reaction at constant speed; braking simulated in small time steps until the speed reaches zero. */
  q09c: p => {
    const react = p.v0 * p.tr;
    const dt = 1e-3; let v = p.v0, s = 0;
    while (v > 0) { const h = Math.min(dt, v / p.a); s += v * h - 0.5 * p.a * h * h; v -= p.a * h; }
    return [react, s, react + s];
  },
  /* q09d: deceleration from the two post speeds and the gap; then the stretch to a stop; average velocity over the
     whole slide is total displacement over total time. */
  q09d: p => {
    const a = (p.v0 * p.v0 - p.v1 * p.v1) / (2 * p.d);
    const tTot = p.v0 / a, rest = p.v1 * (p.v1 / a) - 0.5 * a * (p.v1 / a) * (p.v1 / a);
    return [a, rest, (p.d + rest) / tTot];
  },
  /* q10b: height after t seconds falling from h with downward start speed u: h − u t − 4.9 t²; first time it reaches 0. */
  q10b: p => {
    const t = firstZero(s => p.h - p.u * s - 0.5 * G * s * s, 1e-4);
    return [t, p.u + G * t];
  },
  /* q10c: fall from rest for T seconds; depth ½ g T²; speed g T; last tau seconds = depth − depth at T − tau. */
  q10c: p => {
    const fall = s => 0.5 * G * s * s;
    return [fall(p.T), G * p.T, fall(p.T) - fall(p.T - p.tau)];
  },
  /* q10d: y(t) = h + v0 t − 4.9 t²; time to reach y = 0; velocity there from the slope; average = displacement ÷ time. */
  q10d: p => {
    const y = t => p.h + p.v0 * t - 0.5 * G * t * t;
    const t = firstZero(y, 1e-4);
    return [t, slope(y, t), (y(t) - y(0)) / t];
  }
});
})();
