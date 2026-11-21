/* Independent oracles for Calculus 1 learn missions, file c: q21–q30 (game/realms/calc1/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build(): a table of values, a numerical limit or difference quotient with a small
   step, a numerical integral, a search or a general solver. Do not import game files. */
(function(){ 'use strict';
/* Helpers: five-point symmetric difference (error ~h⁴), rounding, and sign-change root finding by bisection. */
const D = (f, x, h = 1e-3) => (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);
const rnd = (v, n = 6) => Math.round(v * 10 ** n) / 10 ** n;
const bisect = (f, lo, hi) => { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };
/* Every x in [lo, hi] where g changes sign, found by scanning a fine grid and bisecting each bracket. */
const roots = (g, lo, hi, n = 4000) => {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = lo + (hi - lo) * i / n, b = lo + (hi - lo) * (i + 1) / n;
    if (g(a) === 0) out.push(a); else if (g(a) * g(b) < 0) out.push(bisect(g, a, b));
  }
  return out;
};
Object.assign(window.ORACLE, {
  /* h(t) = a sin t + b cos t. Velocity from a symmetric difference quotient at the three times. */
  q21: p => {
    const h = t => p.a * Math.sin(t) + p.b * Math.cos(t);
    return [rnd(D(h, 0), 4), rnd(D(h, Math.PI / 2), 4), rnd(D(h, Math.PI / 6), 2)];
  },
  /* C(t) = a e^(kt) at t = 0 and W(t) = b ln t at t = d, each as a symmetric difference quotient. */
  q22: p => {
    const C = t => p.a * Math.exp(p.k * t), W = t => p.b * Math.log(t);
    return [rnd(D(C, 0), 4), rnd(D(W, p.d, 1e-2), 4)];
  },
  /* u = x²(x + p), v = (a x + b) ÷ (x + q), w = (m x + s)³, slopes at x = c by difference quotients.
     The constant b of v is not a parameter: k is the stated slope of v at c, so b follows from the quotient rule
     read as an equation; check it by also differencing v and comparing. */
  q23: p => {
    const b = p.a * p.q - p.k * (p.c + p.q) ** 2;
    const u = x => x * x * (x + p.p), v = x => (p.a * x + b) / (x + p.q), w = x => (p.m * x + p.s) ** 3;
    return [rnd(D(u, p.c), 4), rnd(D(v, p.c), 4), rnd(D(w, p.c), 4)];
  },
  /* a x² + b y² = a x0² + b y0². Treat the upper or lower branch through (x0, y0) as a function y(x), difference
     it, then the tangent's y-intercept is y0 − slope · x0. */
  q24: p => {
    const K = p.a * p.x0 * p.x0 + p.b * p.y0 * p.y0, sg = p.y0 >= 0 ? 1 : -1;
    const y = x => sg * Math.sqrt((K - p.a * x * x) / p.b);
    const m = rnd(D(y, p.x0), 6);
    return [m, rnd(p.y0 - m * p.x0, 5)];
  },
  /* Ladder L, foot x (moving out at v). Height by search over a fine grid for y with x² + y² = L²; then the top's
     height as a function of foot position is differenced and scaled by the foot's speed. */
  q25: p => {
    const y = x => Math.sqrt(p.L * p.L - x * x);
    let best = 0, e = Infinity;
    for (let t = 0; t <= 4 * p.L; t++) { const c = t / 4, d = Math.abs(p.x * p.x + c * c - p.L * p.L); if (d < e) { e = d; best = c; } }
    return [best, rnd(-D(y, p.x, 1e-3) * p.v, 5)];
  },
  /* f(x) = √x near x = s². Slope by difference, dy = slope · dx, estimate = s + dy. */
  q26: p => {
    const a = p.s * p.s, f = Math.sqrt;
    const m = rnd(D(f, a, 1e-2), 6);
    return [m, rnd(m * p.d, 6), rnd(p.s + m * p.d, 6)];
  },
  /* P(t) = t³ − (3/2)(p + q)t² + 3pq t + d: its slope is zero at p and q (expand 3(t − p)(t − q)). Find the zeros of
     the differenced slope by scanning, then evaluate P at the one where the slope goes + to −. */
  q27: p => {
    const P = t => t ** 3 - 1.5 * (p.p + p.q) * t * t + 3 * p.p * p.q * t + p.d;
    const cs = roots(t => D(P, t, 1e-3), 0, p.q + 3).map(t => Math.round(t * 1e4) / 1e4);
    const mx = cs.find(t => D(P, t - 0.01) > 0 && D(P, t + 0.01) < 0);
    return [cs[0], cs[1], rnd(P(mx), 4)];
  },
  /* h(t) = −t³ + (3/2)(p + q)t² − 3pq t + d, critical at p and q. h″ at p by second difference, the local maximum
     found by scanning the height, the inflection where h″ changes sign. */
  q28: p => {
    const h = t => -(t ** 3) + 1.5 * (p.p + p.q) * t * t - 3 * p.p * p.q * t + p.d;
    const h2 = (t, s = 1e-2) => (h(t + s) - 2 * h(t) + h(t - s)) / (s * s);
    let bestT = p.p, bestV = -Infinity;
    for (let t = p.p + 0.01; t < p.q + 1; t += 0.001) if (h(t) > bestV) { bestV = h(t); bestT = t; }
    const infl = roots(t => h2(t), 0, p.q + 2)[0];
    return [rnd(h2(p.p), 3), rnd(h(Math.round(bestT)), 4), rnd(infl, 4)];
  },
  /* f(x) = 3x⁴ − 4(a + b)x³ + 6ab x²: slope 12x(x − a)(x − b). Critical points by scanning the differenced slope;
     the local max is where the slope turns from + to −; f″ at the largest critical point by second difference. */
  q29: p => {
    const f = x => 3 * x ** 4 - 4 * (p.a + p.b) * x ** 3 + 6 * p.a * p.b * x * x;
    const cs = roots(x => D(f, x, 1e-3), -1, p.b + 2).map(x => Math.round(x * 1e4) / 1e4);
    const mx = cs.find(x => D(f, x - 0.01) > 0 && D(f, x + 0.01) < 0);
    const top = Math.max(...cs), s = 1e-3;
    return [mx, rnd(f(mx), 4), rnd((f(top + s) - 2 * f(top) + f(top - s)) / (s * s), 2)];
  },
  /* S(x) = x³ − 3k²x + c on [0, R]: brute-force every thickness in steps of 0.001 and take the extremes. */
  q30: p => {
    const S = x => x ** 3 - 3 * p.k * p.k * x + p.c;
    let hi = -Infinity, lo = Infinity;
    for (let i = 0; i <= p.R * 1000; i++) { const v = S(i / 1000); if (v > hi) hi = v; if (v < lo) lo = v; }
    return [rnd(hi, 4), rnd(lo, 4)];
  },
});
})();
