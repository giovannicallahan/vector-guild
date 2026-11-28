/* Independent oracles for Calculus 2: accumulation practice missions, file 4 of 8: q16b–q20d (game/realms/calc2/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => Math.round(x * 100) / 100;
/* Composite Simpson's rule for f on [lo, hi] with n (even) steps. */
const simpson = (f, lo, hi, n = 4000) => {
  if (hi === lo) return 0;
  const h = (hi - lo) / n; let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
const r6 = x => Math.round(x * 1e6) / 1e6;
const r3 = x => Math.round(x * 1e3) / 1e3;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* Fraction in lowest terms for a value: smallest denominator that reproduces it. */
const frac = v => {
  for (let d = 1; d <= 5000; d++) { const n = Math.round(v * d); if (Math.abs(v - n / d) < 1e-9) { const g = gcd(n, d) || 1; return [n / g, d / g]; } }
  return [NaN, NaN];
};
/* Area under y = √(r² − x²) from x to r by geometry: a sector of angle acos(x ÷ r) minus the triangle under the radius. */
const seg = (r, x) => r * r * Math.acos(x / r) / 2 - x * Math.sqrt(r * r - x * x) / 2;
Object.assign(window.ORACLE, {
  /* Rod ρ = a + b x² on [0, L]: mass and moment by Simpson; centre = moment ÷ mass. */
  q16b: p => {
    const m = simpson(x => p.a + p.b * x * x, 0, p.L), M = simpson(x => x * (p.a + p.b * x * x), 0, p.L);
    return [r6(m), r6(M / m)];
  },
  /* Arm ρ = a + b x on [0, L]; level when W × d = moment. */
  q16c: p => {
    const m = simpson(x => p.a + p.b * x, 0, p.L), M = simpson(x => x * (p.a + p.b * x), 0, p.L);
    return [r6(m), r6(M / p.W)];
  },
  /* Plate between y = x² and y = r² on [0, r], areal density 3k kg/m² (the prompt prints 12 for k = 4, 6 for k = 2). */
  q16d: p => {
    const s = 3 * p.k, top = p.r * p.r;
    const m = simpson(x => s * (top - x * x), 0, p.r), M = simpson(x => s * x * (top - x * x), 0, p.r);
    return [r6(m), r6(M / m)];
  },
  /* Funnel: shells of radius x, height c x on [0, a], volume ÷ π = ∫ 2 x c x dx. Spring: force ks × e, so the
     force is (ks × u ÷ 10) at u ÷ 10 metres; work = ∫ ks e de from i ÷ 10 to j ÷ 10. */
  q17b: p => [r6(simpson(x => 2 * x * p.c * x, 0, p.a)), r6(simpson(e => p.ks * e, p.i / 10, p.j / 10))],
  /* Tank l × w, water f deep, outlet o above the top of a tank h high: a layer at y is lifted h + o − y; a 1 m layer
     weighs 1000 × l × w × 9.8 N = l w 9.8 kN. */
  q17c: p => {
    const wt = p.l * p.w * 9.8;
    return [r6(wt), r6(simpson(y => wt * (p.h + p.o - y), 0, p.f))];
  },
  /* Plate between y = x² and y = c x on [0, c]. Shells about x = −d: radius x + d, height c x − x², volume ÷ π.
     Strip mass ∝ height, so centre = ∫ x height ÷ ∫ height. */
  q17d: p => {
    const h = x => p.c * x - x * x;
    const k = simpson(x => 2 * (x + p.d) * h(x), 0, p.c);
    return [r3(k), r6(simpson(x => x * h(x), 0, p.c) / simpson(h, 0, p.c))];
  },
  /* ∫ from 1 to hi of c x e^x: boundary term c x e^x at hi minus at 1, then the integral by Simpson. */
  q18b: p => {
    const uv = x => p.c * x * Math.exp(x);
    return [r3(uv(p.hi) - uv(1)), r3(simpson(uv, 1, p.hi))];
  },
  /* ∫ from 1 to b of c ln x by Simpson; average = total ÷ (b − 1). */
  q18c: p => {
    const t = simpson(x => p.c * Math.log(x), 1, p.b);
    return [r3(t), r3(t / (p.b - 1))];
  },
  /* ∫ from π/2 to π of c t sin t (or c t cos t) by Simpson; the tank then holds S0 plus that. */
  q18d: p => {
    const g = p.fam === 'sin' ? Math.sin : Math.cos;
    const net = simpson(t => p.c * t * g(t), Math.PI / 2, Math.PI);
    return [r3(net), r3(p.S0 + net)];
  },
  /* ∫ of cos^q x sin^p x over [0, π/2] (L = 1) or [−π/2, π/2] (L = 2) by Simpson, then the fraction. */
  q19b: p => {
    const lo = p.L === 2 ? -Math.PI / 2 : 0;
    return frac(simpson(x => Math.pow(Math.cos(x), p.q) * Math.pow(Math.sin(x), p.p), lo, Math.PI / 2, 4000));
  },
  /* Power c sin² t over [0, m π ÷ 2]: energy ÷ π = k by Simpson; average power = energy ÷ time. */
  q19c: p => {
    const T = p.m * Math.PI / 2, E = simpson(t => p.c * Math.pow(Math.sin(t), 2), 0, T);
    return [r6(E / Math.PI), r6(E / T)];
  },
  /* Over [0, π/2]: sin^o x cos^e x (family sin) or cos^o x sin^e x (family cos), by Simpson, then the fraction;
     the load is c times that, averaged over the length π/2. */
  q19d: p => {
    const f = p.fam === 'sin' ? x => Math.pow(Math.sin(x), p.o) * Math.pow(Math.cos(x), p.e)
                              : x => Math.pow(Math.cos(x), p.o) * Math.pow(Math.sin(x), p.e);
    const v = simpson(f, 0, Math.PI / 2);
    return [...frac(v), r3(p.c * v / (Math.PI / 2))];
  },
  /* Sliver of the circle under √(r² − x²) from a to r, by sector-minus-triangle geometry. */
  /* The prompts ask angles to 4 decimal places and areas, masses and heights to 2. */
  q20b: p => [Math.round(Math.asin(p.a / p.r) * 1e4) / 1e4, r2(seg(p.r, p.a))],
  /* Glass k √(r² − x²) on [0, a]; mass s per dm². */
  q20c: p => {
    const area = p.k * (seg(p.r, 0) - seg(p.r, p.a));
    return [r2(area), r2(p.s * area)];
  },
  /* Strip of the circle between x1 and x2; average height = area ÷ width. */
  q20d: p => {
    const area = seg(p.r, p.x1) - seg(p.r, p.x2);
    return [r2(area), r2(area / (p.x2 - p.x1))];
  }
});
})();
