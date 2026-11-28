/* Independent oracles for Calculus 2: accumulation practice missions, file 3 of 8: q11b–q15d (game/realms/calc2/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
const r6 = x => Math.round(x * 1e6) / 1e6;
const G = 9.8;
/* Composite Simpson's rule on [a, b] with n (even) strips: the numerical stand-in for every definite integral. */
const simpson = (f, a, b, n = 4000) => {
  const h = (b - a) / n; let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Length of a curve y = f(x) on [a, b]: add up 200000 straight chords between points on it (no derivative used). */
const polyline = (f, a, b, n = 200000) => {
  let len = 0, px = a, py = f(a);
  for (let i = 1; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x); len += Math.hypot(x - px, y - py); px = x; py = y; }
  return len;
};
/* Central-difference slope, for reading u = 1 + (dy/dx)² at a point. */
const slope = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
/* Work to empty a tank: add up thin slices, each lifted from height y to the outlet at height lift, by midpoint sum.
   area(y) is the slice's horizontal area, so a slice of thickness dy weighs rho × area × dy × g. */
const pumpWork = (area, depth, lift, rho, n = 100000) => {
  let w = 0; const dy = depth / n;
  for (let i = 0; i < n; i++) { const y = (i + 0.5) * dy; w += rho * area(y) * dy * G * (lift - y); }
  return w;
};
Object.assign(window.ORACLE, {
  /* q11b: line y = a s², parabola y = a x²; they meet at x = s. Area by Simpson; washers (line² − parabola²) for k. */
  q11b: p => {
    const top = p.a * p.s * p.s, par = x => p.a * x * x;
    return [simpson(x => top - par(x), 0, p.s), simpson(x => top * top - par(x) * par(x), 0, p.s)];
  },
  /* q11c: arch (c + w)x − x², brace c x. Bisect for the second meeting point, then Simpson for area and washers. */
  q11c: p => {
    const top = p.c + p.w, arch = x => top * x - x * x, brace = x => p.c * x;
    let lo = 1e-9, hi = top; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (arch(mid) > brace(mid)) lo = mid; else hi = mid; }
    const m = (lo + hi) / 2;
    return [m, simpson(x => arch(x) - brace(x), 0, m), simpson(x => arch(x) ** 2 - brace(x) ** 2, 0, m)];
  },
  /* q11d: curve y = a x³, line y = a c² x (they meet again at x = c). Area, mean gap = area ÷ width, washers. */
  q11d: p => {
    const cur = x => p.a * x ** 3, line = x => p.a * p.c * p.c * x;
    const area = simpson(x => line(x) - cur(x), 0, p.c);
    return [area, area / p.c, simpson(x => line(x) ** 2 - cur(x) ** 2, 0, p.c)];
  },
  /* q12b: shells of height a x², radius x (about the y-axis) and b − x (about x = b); π taken out. */
  q12b: p => [
    simpson(x => 2 * x * p.a * x * x, 0, p.b),
    simpson(x => 2 * (p.b - x) * p.a * x * x, 0, p.b)
  ],
  /* q12c: line y = s² x, curve x³, meeting at x = s; shells of height s² x − x³, radius x and x + e; π taken out. */
  q12c: p => {
    const h = x => p.s * p.s * x - x ** 3;
    return [p.s, simpson(x => 2 * x * h(x), 0, p.s), simpson(x => 2 * (x + p.e) * h(x), 0, p.s)];
  },
  /* q12d: shells of height a ÷ (x² + 1), radius x; u = 1 + x² gives the upper limit 1 + b². Rounded to 2 places. */
  q12d: p => [1 + p.b * p.b, r2(simpson(x => 2 * x * p.a / (x * x + 1), 0, p.b))],
  /* q13b: y = (2t/3) x^(3/2) from x = p to b. u is read from the slope at each end; the length from chords. */
  q13b: p => {
    const f = x => (2 * p.t / 3) * Math.pow(x, 1.5), u = x => r6(1 + slope(f, x) ** 2);
    return [Math.round(u(p.p)), Math.round(u(p.b)), r2(polyline(f, p.p, p.b))];
  },
  /* q13c: y = (2/3)(x − 1)^(3/2) from 1 to b. Length from chords; drums = whole drums of s metres that cover it. */
  q13c: p => {
    const len = polyline(x => (2 / 3) * Math.pow(Math.max(x - 1, 0), 1.5), 1, p.b);
    return [r2(len), Math.ceil(len / p.s - 1e-9)];
  },
  /* q13d: y = x³ ÷ (6t) + t ÷ (2x) from x = p to b. Length from chords; stretch factor average = length ÷ run. */
  q13d: p => {
    const len = polyline(x => x ** 3 / (6 * p.t) + p.t / (2 * x), p.p, p.b);
    return [r2(len), r2(len / (p.b - p.p))];
  },
  /* q14b: force j·s/5 N at s cm gives k = force ÷ (s ÷ 100); work = integral of k x from 0 to d cm. */
  q14b: p => {
    const k = (p.j * p.s / 5) / (p.s / 100);
    return [k, simpson(x => k * x, 0, p.d / 100)];
  },
  /* q14c: weight = m × 9.8, k = weight ÷ resting stretch; work from the resting stretch to a further e10 ÷ 10 m. */
  q14c: p => {
    const w = p.m * G, rest = p.s10 / 10, k = w / rest;
    return [r2(w), r2(k), r2(simpson(x => k * x, rest, rest + p.e10 / 10))];
  },
  /* q14d: the record states the work 25 m x² J (m × 25 is half the stiffness 50 m) over 0 → x = x10/10 m; the integral
     of k x from 0 to x is k x² ÷ 2, so k = work ÷ that. Then the work from x to x + d10/10. */
  q14d: p => {
    const x = p.x10 / 10, rec = Math.round(25 * p.m * x * x * 1e4) / 1e4, k = rec / simpson(t => t, 0, x);
    return [k, simpson(t => k * t, x, x + p.d10 / 10)];
  },
  /* q15b: slice mass = rho × l × w × 1; work: sum of slices up to depth D, each lifted to H + h. In kJ, 1 place. */
  q15b: p => [
    p.rho * p.l * p.w,
    Math.round(pumpWork(() => p.l * p.w, p.D, p.H + p.h, p.rho) / 100) / 10
  ],
  /* q15c: slice area π r²; lifted to H + h. Time = work ÷ (power in watts), in minutes (from the unrounded work). */
  q15c: p => {
    const W = pumpWork(() => Math.PI * p.r * p.r, p.D, p.H + p.h, 1000);
    return [Math.round(W / 100) / 10, Math.round(W / (p.P * 1000) / 6) / 10];
  },
  /* q15d: slice area L × (s y) (width s y at height y); surface width s D; lifted to H + h. */
  q15d: p => [
    p.s * p.D,
    Math.round(pumpWork(y => p.L * p.s * y, p.D, p.H + p.h, 1000) / 100) / 10
  ],
});
})();
