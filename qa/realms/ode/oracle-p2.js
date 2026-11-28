/* Independent oracles for Differential equations practice missions, file 2 of 8: q06b–q10d (game/realms/ode/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const r3 = x => Math.round(x * 1e3) / 1e3;
const r2 = x => Math.round(x * 1e2) / 1e2;
/* Fourth-order Runge-Kutta for y' = f(t, y) from (0, y0): value at time T (no closed form used). */
const rk4 = (f, y0, T, h = 1e-3) => {
  const n = Math.max(1, Math.round(T / h)), d = T / n; let t = 0, y = y0;
  for (let i = 0; i < n; i++) {
    const a = f(t, y), b = f(t + d / 2, y + d * a / 2), c = f(t + d / 2, y + d * b / 2), e = f(t + d, y + d * c);
    y += d * (a + 2 * b + 2 * c + e) / 6; t += d;
  }
  return y;
};
/* First time the solution of y' = f(t, y), y(0) = y0 reaches the level (either direction), by stepping and interpolating. */
const hit = (f, y0, level, h = 1e-3, tmax = 5000) => {
  const up = level > y0; let t = 0, y = y0;
  while (t < tmax) {
    const a = f(t, y), b = f(t + h / 2, y + h * a / 2), c = f(t + h / 2, y + h * b / 2), e = f(t + h, y + h * c);
    const yn = y + h * (a + 2 * b + 2 * c + e) / 6;
    if (up ? yn >= level : yn <= level) return t + h * (level - y) / (yn - y);
    y = yn; t += h;
  }
  return NaN;
};
/* Root list and sign rule of the printed factored right-hand sides (q09b, q09d): each factor is (y - r), or (r - y) when its
   flips bit is set and r is positive (negative and zero roots are never printed flipped); half-integer roots print as (2y - 2r),
   which only changes the size, not the sign. The sign of f at a point is the sign of k times the signs of the factors. */
const signAt = (p, y) => {
  let s = Math.sign(p.k);
  p.r.forEach((r, i) => {
    const flipped = r > 0 && ((p.flips >> i) & 1);
    s *= Math.sign(y - r) * (flipped ? -1 : 1);
  });
  return s;
};
Object.assign(window.ORACLE, {
  /* q06b: y' = k t y; separate: ln(y/y0) = k T²/2. */
  q06b: p => [r3(p.y0 * Math.exp(p.k * p.T * p.T / 2))],
  /* q06c: y' = k y, y(0) = y0; cells after T, and time to multiply by m is ln(m)/k. */
  q06c: p => [r2(p.y0 * Math.exp(p.k * p.T)), r2(Math.log(p.m) / p.k)],
  /* q06d: y' = (a + b t) y; ln(y/y0) = aT + bT²/2. */
  q06d: p => { const e = p.a * p.T + p.b * p.T * p.T / 2; return [r6(e), r3(p.y0 * Math.exp(e))]; },
  /* q07b: y' = k(S - y), i.e. y' + k y = kS, so r = k; solved by stepping the equation. */
  q07b: p => [r6(p.k), r3(rk4((t, y) => p.k * (p.S - y), p.y0, p.T))],
  /* q07c: heating = p K per minute (the prompt prints p K), loss p y; settles where heating = loss; y(T) and the time to reach L by stepping. */
  q07c: p => {
    const f = (t, y) => p.p * p.K - p.p * y;
    return [r2(p.p * p.K / p.p), r2(rk4(f, p.y0, p.T)), r2(hit(f, p.y0, p.L))];
  },
  /* q07d: y' + p y = B + C t; a line y = m t + c needs p m = C, so m = C / p; y(T) by stepping. */
  q07d: p => [r6(p.C / p.p), r3(rk4((t, y) => p.B + p.C * t - p.p * y, p.y0, p.T))],
  /* q08b: salt (glycol) in = r c, out = (r / V) x, x(0) = s0 V; long run is c V. */
  q08b: p => [r3(rk4((t, x) => p.r * p.c - p.r * x / p.V, p.s0 * p.V, p.T)), r6(p.c * p.V)],
  /* q08c: same tank; mass at T and the first time it falls to X. */
  q08c: p => {
    const f = (t, x) => p.r * p.c - p.r * x / p.V, x0 = p.s0 * p.V;
    return [r2(rk4(f, x0, p.T)), r2(hit(f, x0, p.X))];
  },
  /* q08d: two stages; stage two starts from the unrounded stage-one amount. c1, c2 are the strengths of the two feeds. */
  q08d: p => {
    const x1 = rk4((t, x) => p.r * p.c1 - p.r * x / p.V, p.x0, p.T1);
    const x2 = rk4((t, x) => p.r * p.c2 - p.r * x / p.V, x1, p.T2);
    return [r3(x1), r3(x2)];
  },
  /* q09b: roots in increasing order; stability of the asked one (j = 0 smaller, 1 larger; swap only reorders the printed factors)
     by the sign of f just below and just above the root: stable when f > 0 below and f < 0 above. */
  q09b: p => {
    const r = p.r.slice().sort((a, b) => a - b), x = r[p.j], e = 1e-3;
    const stable = signAt(p, x - e) > 0 && signAt(p, x + e) < 0;
    return [r[0], r[1], stable ? 1 : 0];
  },
  /* q09c: y' = a y - b y² - H with a = b (r1 + r2) and H = b r1 r2 (the printed 2.6, 0.2, 7.2 in draw 1); equilibria where
     b y² - a y + H = 0 by the quadratic formula; start S; stock cannot go below 0. */
  q09c: p => {
    const a = p.b * (p.r1 + p.r2), H = p.b * p.r1 * p.r2, disc = Math.sqrt(a * a - 4 * p.b * H);
    const lo = (a - disc) / (2 * p.b), hi = (a + disc) / (2 * p.b);
    const f = y => a * y - p.b * y * y - H;
    let end;
    if (Math.abs(p.S - lo) < 1e-9) end = lo; else if (Math.abs(p.S - hi) < 1e-9) end = hi;
    else if (f(p.S) > 0) end = hi; else if (p.S > hi) end = hi; else end = 0; /* below lo the stock falls: f < 0 there */
    return [r6(lo), r6(hi), r6(end)];
  },
  /* q09d: four roots in order; p.i is only an index: the start is 0.5 above root i (the prompt prints it), so it lies between
     root i and root i + 1, and y runs to the end of that gap towards which f points. */
  q09d: p => {
    const r = p.r.slice().sort((a, b) => a - b), s = r[p.i] + 0.5;
    return [...r, signAt(p, s) > 0 ? r[p.i + 1] : r[p.i]];
  },
  /* q10b: logistic stepped numerically; level = f K (the prompt prints it, e.g. 0.8 × 250 = 200). */
  q10b: p => {
    const g = (t, P) => p.k * P * (1 - P / p.K);
    return [r2(rk4(g, p.P0, p.T)), r2(hit(g, p.P0, p.f * p.K))];
  },
  /* q10c: P' = a P - b P², b = a / K (printed 0.002 for a = 0.4, K = 200); K = a / b; the peak of P' is at P = K/2. */
  q10c: p => {
    const b = p.a / p.K, g = (t, P) => p.a * P - b * P * P, half = p.a / b / 2;
    return [r6(p.a / b), r2(hit(g, p.P0, half)), r6(g(0, half))];
  },
  /* q10d: P(0) = g K (printed above K); A = (K - P0) / P0; level = K + f (P0 - K) (f is a fraction of the excess, as printed). */
  q10d: p => {
    const P0 = p.g * p.K, level = p.K + p.f * (P0 - p.K), h = (t, P) => p.k * P * (1 - P / p.K);
    return [r6((p.K - P0) / P0), r2(hit(h, P0, level)), r2(rk4(h, P0, p.T))];
  },
});
})();
