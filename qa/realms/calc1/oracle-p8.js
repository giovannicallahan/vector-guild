/* Independent oracles for Calculus 1 practice missions, file 8 of 8: q36b–q40d (game/realms/calc1/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (numerical integration by Simpson's rule or fine
   summation, bisection, scanning for a minimum or maximum). qa/generators.js loads this file after the whole pack and
   fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Simpson's rule with n (even) strips: integral of f from a to b by numbers, not by an antiderivative. */
const simpson = (f, a, b, n = 200) => {
  if (a === b) return 0;
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Midpoint sum with many thin strips: used where the integrand has a corner (an absolute value or a clipped part). */
const fine = (f, a, b, n = 400000) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h); return s * h; };
const tidy = (x, d = 1000) => Math.round(x * d) / d;
const r2 = x => Math.round(x * 100) / 100;
/* Riemann sums of a function sampled at the n+1 equally spaced points x0, x0+w, ...: [left, right]. */
const sums = (heights, w) => { let L = 0, R = 0; for (let i = 0; i < heights.length - 1; i++) { L += heights[i]; R += heights[i + 1]; } return [L * w, R * w]; };
Object.assign(window.ORACLE, {
 /* Distance s(T) = reading at t1 plus the area under v from t1 to T; C = s(0) = reading minus the area from 0 to t1. */
 q36b: p => { const v = t => p.k * t + p.b; return [tidy(p.P - simpson(v, 0, p.t1)), tidy(p.P + simpson(v, p.t1, p.T))]; },
 /* Volume at the close = reading at t1 plus the area under the inflow from t1 to T; room = capacity minus that. */
 q36c: p => { const r = t => p.k * t + p.b, V = p.P + simpson(r, p.t1, p.T); return [tidy(V), tidy(p.Cap - V)]; },
 /* Nested numerical integration: v(t) = C1 + area under a from 0 to t; s(t) = C2 + area under v from 0 to t. */
 q36d: p => {
  const a = t => p.A * t, vArea = t => simpson(a, 0, t, 20);
  const C1 = p.V1 - vArea(p.t1), v = t => C1 + vArea(t);
  const C2 = p.S2 - simpson(v, 0, p.t2, 20);
  return [tidy(C1), tidy(C2), tidy(C2 + simpson(v, 0, p.T, 20))];
 },
 /* Rectangles of width w from 0 to k w: sample the rate at every endpoint and add up the left and the right heights. */
 q37b: p => { const n = p.k, h = []; for (let i = 0; i <= n; i++) { const t = i * p.w; h.push(p.c - p.a * t * t); } const [L, R] = sums(h, p.w); return [p.w, L, R]; },
 /* Heights are the five readings; four rectangles of width w; the log takes the mean of the two estimates. */
 q37c: p => { const [L, R] = sums([p.h0, p.h1, p.h2, p.h3, p.h4], p.w); return [L, R, (L + R) / 2]; },
 /* Strips half an hour wide from s to s + k/2; sample at every half hour; the gap is the right sum minus the left sum. */
 q37d: p => { const w = 0.5, h = []; for (let i = 0; i <= p.k; i++) { const t = p.s + i * w; h.push(p.a * t * t + p.b * t + p.c); } const [L, R] = sums(h, w); return [w, L, R, R - L]; },
 /* Area of the part below the axis and of the part above it over [0, T], by thin strips; integral = above - below. */
 q38b: p => { const r = t => p.b * t - p.B, below = fine(t => Math.max(-r(t), 0), 0, p.T), above = fine(t => Math.max(r(t), 0), 0, p.T); return [tidy(below), tidy(above), tidy(above - below)]; },
 /* The meter counts |r|; the tank gains the signed integral. */
 q38c: p => { const r = t => p.B - p.b * t; return [tidy(fine(t => Math.abs(r(t)), 0, p.T)), tidy(fine(r, 0, p.T))]; },
 /* Crossing time by bisection, then the positive and negative parts over [p, q] by thin strips. */
 q38d: p => {
  const r = t => p.B - p.b * t; let lo = p.p, hi = p.q;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (r(m) > 0) lo = m; else hi = m; }
  const up = fine(t => Math.max(r(t), 0), p.p, p.q), down = fine(t => Math.max(-r(t), 0), p.p, p.q);
  return [tidy((lo + hi) / 2), tidy(up), tidy(down), tidy(up - down)];
 },
 /* F has no constant term, so F(x) is the area under e from 0 to x; the loss is the area from p to q. */
 q39b: p => { const e = t => p.B * t + p.c; return [tidy(simpson(e, 0, p.p)), tidy(simpson(e, 0, p.q)), tidy(simpson(e, p.p, p.q))]; },
 /* Water added = area under r from p to q; room left = room - added. */
 q39c: p => { const added = simpson(t => p.A * t * t + p.c, p.p, p.q); return [tidy(added), tidy(p.room - added)]; },
 /* Area under k/t by Simpson on a fine grid (the curve is smooth on [p, q], p >= 1); whole = constant part + log part. */
 q39d: p => { const logPart = simpson(t => p.k / t, p.p, p.q, 20000), whole = p.c * (p.q - p.p) + logPart; return [r2(logPart), r2(whole)]; },
 /* Scan the volume V(t) = V0 + area so far for its lowest point on [0, T]; net change and final volume from the area. */
 q40b: p => {
  const r = t => p.A * t * t - p.c, step = 0.001, N = Math.round(p.T / step);
  let V = p.V0, best = V, bestT = 0;
  for (let i = 1; i <= N; i++) { V += simpson(r, (i - 1) * step, i * step, 2); if (V < best - 1e-9) { best = V; bestT = i * step; } }
  const net = simpson(r, 0, p.T, 400);
  return [tidy(bestT), tidy(net), tidy(p.V0 + net)];
 },
 /* Scan the volume for its highest point (the rate is negative for good after it turns); room = spill level - peak. */
 q40c: p => {
  const r = t => p.c - p.A * t * t, step = 0.001, N = 20000;
  let V = p.V0, best = V;
  for (let i = 1; i <= N; i++) { V += simpson(r, (i - 1) * step, i * step, 2); if (V > best) best = V; }
  return [tidy(best), tidy(p.cap - best)];
 },
 /* Turn time by bisection on the sign of v; final position from the net area; total distance = area of |v| by thin strips. */
 q40d: p => {
  const v = t => p.c - p.A * t * t; let lo = 0, hi = p.T;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (v(m) > 0) lo = m; else hi = m; }
  return [tidy((lo + hi) / 2), tidy(p.s0 + simpson(v, 0, p.T, 400)), tidy(fine(t => Math.abs(v(t)), 0, p.T))];
 },
});
})();
