/* Independent oracles for Calculus 2: accumulation practice missions, file 2 of 8: q06b–q10d (game/realms/calc2/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r3 = x => Math.round(x * 1000) / 1000;
/* Composite Simpson's rule on [a, b] with n (even) strips: the numerical stand-in for every definite integral. */
const simpson = (f, a, b, n = 4000) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Real roots of A x² + B x + C = 0, smaller first. */
const roots = (A, B, C) => {
  const D = Math.sqrt(B * B - 4 * A * C), x = (-B - D) / (2 * A), y = (-B + D) / (2 * A);
  return x < y ? [x, y] : [y, x];
};
/* Area between two quadratics (coefficient triples [x², x, 1]) over the stretch where they cross: roots of the
   difference, then Simpson on the absolute gap. Returns [left, right, area, gapAtMidpointMax]. */
const between = (lo, hi) => {
  const d = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]], [x1, x2] = roots(d[0], d[1], d[2]);
  const gap = x => Math.abs(d[0] * x * x + d[1] * x + d[2]);
  let longest = 0; for (let i = 0; i <= 2000; i++) longest = Math.max(longest, gap(x1 + (x2 - x1) * i / 2000));
  return { x1, x2, area: simpson(gap, x1, x2), longest };
};
Object.assign(window.ORACLE, {
  /* q06b: both integrals by Simpson's rule: 1 ÷ (c² + x²) from 0 to c·rho, and m × 1 ÷ √(s² − x²) from 0 to b. */
  q06b: p => [
    r3(simpson(x => 1 / (p.c * p.c + x * x), 0, p.c * p.rho)),
    r3(p.m * simpson(x => 1 / Math.sqrt(p.s * p.s - x * x), 0, p.b))
  ],
  /* q06c: flow m·a ÷ (a² + t²) from 0 to a·rho, added to the starting amount S. */
  q06c: p => {
    const net = simpson(t => p.m * p.a / (p.a * p.a + t * t), 0, p.a * p.rho);
    return [r3(net), r3(p.S + net)];
  },
  /* q06d: u = x² turns the upper limit into L²; the angle is ∫ x ÷ (a² + x⁴) from 0 to L by Simpson. */
  q06d: p => [p.L * p.L, r3(simpson(x => x / (p.a * p.a + x * x * x * x), 0, p.L))],
  /* q07b: top = bottom − a(x − r)(x − s) with bottom m x + k, expanded; meeting points from the difference. */
  q07b: p => {
    const lo = [0, p.m, p.k], hi = [-p.a, p.m + p.a * (p.r + p.s), p.k - p.a * p.r * p.s];
    const t = between(lo, hi);
    return [t.x1, t.x2, t.area];
  },
  /* q07c: lower a x², upper 2 a r² − a x²; steel at q kg per square metre. */
  q07c: p => {
    const t = between([p.a, 0, 0], [-p.a, 0, 2 * p.a * p.r * p.r]);
    return [t.x2, t.area, p.q * t.area];
  },
  /* q07d: lower al x² + b1 x + c1, upper = lower − d(x − r)(x − s); area and mean gap = area ÷ width. */
  q07d: p => {
    const lo = [p.al, p.b1, p.c1];
    const hi = [p.al - p.d, p.b1 + p.d * (p.r + p.s), p.c1 - p.d * p.r * p.s];
    const t = between(lo, hi);
    return [t.area, t.area / (t.x2 - t.x1)];
  },
  /* q08b: left edge −a(r + s) y + k, right edge −a y² + k − a r s; strips along y. */
  q08b: p => {
    const t = between([0, -p.a * (p.r + p.s), p.k], [-p.a, 0, p.k - p.a * p.r * p.s]);
    return [t.x1, t.x2, t.area];
  },
  /* q08c: curve x = a y², edge x = a r²; sealant at q litres per square metre. */
  q08c: p => {
    const t = between([p.a, 0, 0], [0, 0, p.a * p.r * p.r]);
    return [t.x2, t.area, p.q * t.area];
  },
  /* q08d: left al y² + b1 y + c1, right = left − d(y − r)(y − s); area and the longest strip by scanning. */
  q08d: p => {
    const lo = [p.al, p.b1, p.c1];
    const hi = [p.al - p.d, p.b1 + p.d * (p.r + p.s), p.c1 - p.d * p.r * p.s];
    const t = between(lo, hi);
    return [t.area, t.longest];
  },
  /* q09b: slice area (k x²)(c) at x = L; volume by adding up the slice areas from 0 to L. */
  q09b: p => [p.c * p.k * p.L * p.L, simpson(x => p.c * p.k * x * x, 0, p.L)],
  /* q09c: square side m x − x² (curve meets line at x = m); area at x = 1; volume; mass at q per cubic metre. */
  q09c: p => {
    const v = simpson(x => Math.pow(p.m * x - x * x, 2), 0, p.m);
    return [Math.pow(p.m - 1, 2), v, p.q * v];
  },
  /* q09d: side k ÷ √(a² + x²); area at L; volume by Simpson, to 3 decimal places. */
  q09d: p => [
    p.k * p.k / (p.a * p.a + p.L * p.L),
    r3(simpson(x => p.k * p.k / (p.a * p.a + x * x), 0, p.L))
  ],
  /* q10b: y = a x² meets y = a c² at x = c; washers outer a c², inner a x²; k is the integral ÷ π. */
  q10b: p => [p.c, simpson(x => Math.pow(p.a * p.c * p.c, 2) - Math.pow(p.a * x * x, 2), 0, p.c)],
  /* q10c: rim radius c; discs about the y-axis have area π y ÷ a up to height a c²; mass m = q k. */
  q10c: p => {
    const k = simpson(y => y / p.a, 0, p.a * p.c * p.c);
    return [p.c, k, p.q * k];
  },
  /* q10d: the line through the meeting points r and s is (r + s) x − r s; washers outer line, inner x²; k = integral ÷ π. */
  q10d: p => {
    const [x1, x2] = roots(1, -(p.r + p.s), p.r * p.s);
    return [x1, x2, simpson(x => Math.pow((p.r + p.s) * x - p.r * p.s, 2) - Math.pow(x, 4), x1, x2)];
  }
});
})();
