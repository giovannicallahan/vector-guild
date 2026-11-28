/* Independent oracles for Calculus 2: accumulation learn missions, file a: q01–q10 (game/realms/calc2/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. Most oracles integrate numerically with Simpson's rule on a fine step. */
(function(){ 'use strict';
/* Simpson's rule with n (even) strips. */
const simpson = (f, lo, hi, n = 4000) => {
  const h = (hi - lo) / n; let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
const r6 = x => Math.round(x * 1e6) / 1e6;
const r3 = x => Math.round(x * 1e3) / 1e3;
const r2 = x => Math.round(x * 1e2) / 1e2;
Object.assign(window.ORACLE, {
  /* r(t) = p t² + q t from t1 to t2: integrate the rate; the end amount is the start amount plus the change. */
  q01: p => {
    const net = simpson(t => p.p * t * t + p.q * t, p.t1, p.t2);
    return [r6(net), r6(p.S + net)];
  },
  /* f(t) = 3t² + 2c t + d; F(x) = integral from a to x. F(b) by Simpson, F′(b) as the rate of the running total over
     a tiny step either side of b (a symmetric difference of two integrals). */
  q02: p => {
    const f = t => 3 * t * t + 2 * p.c * t + p.d;
    const F = x => simpson(f, p.a, x, 2000);
    const h = 1e-3;
    return [r6(F(p.b)), r6((F(p.b + h) - F(p.b - h)) / (2 * h))];
  },
  /* r(t) = k t² + d on [a, b]: mean = area ÷ width. Then search the interval by bisection for the time r(c) = mean. */
  q03: p => {
    const r = t => p.k * t * t + p.d;
    const avg = simpson(r, p.a, p.b) / (p.b - p.a);
    let lo = p.a, hi = p.b;
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (r(mid) < avg) lo = mid; else hi = mid; }
    return [r2(avg), r2((lo + hi) / 2)];
  },
  /* r(t) = 2(m+1) t (t² + c)^m (the coefficient the prompt prints). The new limits are u = t² + c at each end; the
     litres are integrated straight in t with a fine step. */
  q04: p => {
    const r = t => 2 * (p.m + 1) * t * Math.pow(t * t + p.c, p.m);
    return [p.a * p.a + p.c, p.b * p.b + p.c, r6(simpson(r, p.a, p.b))];
  },
  /* Line A k ÷ (t + c) and line B m e^(−t) from 0 to T, each by Simpson, rounded to 3 places. */
  q05: p => [
    r3(simpson(t => p.k / (t + p.c), 0, p.T)),
    r3(simpson(t => p.m * Math.exp(-t), 0, p.T))
  ],
  /* Camera a metres away, float at 1 m/s: the turn rate is a ÷ (a² + t²) from 0 to rho·a (the prompt's end time).
     Calibration: ∫ 0..b of 1 ÷ √(s² − x²), integrand finite on [0, b] as b < s. */
  q06: p => [
    r3(simpson(t => p.a / (p.a * p.a + t * t), 0, p.rho * p.a, 20000)),
    r3(simpson(x => 1 / Math.sqrt(p.s * p.s - x * x), 0, p.b, 20000))
  ],
  /* Curve y = a x² + b x + c meets a line at x = r and x = s. The line is the curve minus a(x−r)(x−s), so its slope
     and intercept follow; the crossings are then found again by a sign-change search on (line − curve), and the area
     is Simpson on |line − curve| between them. */
  q07: p => {
    const curve = x => p.a * x * x + p.b * x + p.c;
    const m = p.b + p.a * (p.r + p.s), k = p.c - p.a * p.r * p.s;
    const line = x => m * x + k;
    const g = x => line(x) - curve(x);
    const roots = [];
    const lo = Math.min(p.r, p.s) - 5, hi = Math.max(p.r, p.s) + 5;
    for (let x = lo; x < hi; x += 0.5) {
      let a = x, b = x + 0.5;
      if (g(a) === 0) { roots.push(a); continue; }
      if (g(a) * g(b) < 0) {
        for (let i = 0; i < 80; i++) { const mid = (a + b) / 2; if (g(a) * g(mid) <= 0) b = mid; else a = mid; }
        roots.push((a + b) / 2);
      }
    }
    const rs = roots.map(x => Math.round(x * 1e6) / 1e6).sort((u, v) => u - v);
    return [rs[0], rs[rs.length - 1], r6(Math.abs(simpson(g, rs[0], rs[rs.length - 1])))];
  },
  /* Curve x = a y², edge x = a(r+s) y − a r s (the straight edge through the crossings y = r and y = s). Strips along
     y: width = |edge − curve|, summed by Simpson between the crossings. */
  q08: p => {
    const curve = y => p.a * y * y, edge = y => p.a * (p.r + p.s) * y - p.a * p.r * p.s;
    const lo = Math.min(p.r, p.s), hi = Math.max(p.r, p.s);
    return [r6(simpson(y => Math.abs(edge(y) - curve(y)), lo, hi))];
  },
  /* Base y = k√x on 0..L. Cross-section area from the base width w = k√x: square w², triangle ½ w · w. The volume is
     the slice area summed along x (Simpson on a smooth polynomial in x). */
  q09: p => {
    const A = x => { const w = p.k * Math.sqrt(x); return p.shape === 'square' ? w * w : w * w / 2; };
    if (p.shape !== 'square' && p.shape !== 'triangle') throw new Error('unknown shape ' + p.shape);
    return [r6(A(p.L)), r6(simpson(A, 0, p.L))];
  },
  /* Line y = m x, curve y = a x². About the x-axis: meet at x = m/a (checked where m x = a x²), washers
     π(m²x² − a²x⁴). About the y-axis: meet at y = m·(m/a); at height y the curve sits at x = √(y/a) and the line at
     x = y/m, so washers π(y/a − y²/m²) from 0 up to the meeting height. Return the value of V/π. */
  q10: p => {
    const x0 = p.m / p.a;
    if (Math.abs(p.m * x0 - p.a * x0 * x0) > 1e-9) throw new Error('no crossing');
    if (p.axis === 'x') return [x0, simpson(x => p.m * p.m * x * x - p.a * p.a * Math.pow(x, 4), 0, x0)];
    const Y = p.m * x0;
    return [Y, simpson(y => y / p.a - y * y / (p.m * p.m), 0, Y)];
  }
});
})();
