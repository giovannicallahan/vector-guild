/* Independent oracles for Calculus 2: accumulation learn missions, file b: q11–q20 (game/realms/calc2/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. Everything is integrated numerically with Simpson's rule on a fine step. */
(function(){ 'use strict';
/* Simpson's rule with n (even) strips. */
const simpson = (f, lo, hi, n = 4000) => {
  if (hi === lo) return 0;
  const h = (hi - lo) / n; let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
const r6 = x => Math.round(x * 1e6) / 1e6;
const r3 = x => Math.round(x * 1e3) / 1e3;
const r2 = x => Math.round(x * 1e2) / 1e2;
const r1 = x => Math.round(x * 1e1) / 1e1;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
Object.assign(window.ORACLE, {
  /* Plate between y = x² and y = c x on [0, d]; they cross at x = c, so the gap |c x − x²| is integrated in two
     pieces. Nozzle: washers (c x)² − (x²)² from 0 to c, volume ÷ π. */
  q11: p => {
    const gap = x => Math.abs(p.c * x - x * x);
    const area = simpson(gap, 0, p.c) + simpson(gap, p.c, p.d);
    const k = simpson(x => Math.pow(p.c * x, 2) - Math.pow(x * x, 2), 0, p.c);
    return [r6(area), r6(k)];
  },
  /* Arch y = b x − x² on [0, b]. A shell at x about the axis x = −s has radius x + s (s = 0 for the y-axis), height
     y, thickness dx: volume ÷ π = ∫ 2 (x + s) y dx. */
  q12: p => {
    const y = x => p.b * x - x * x;
    const k = s => simpson(x => 2 * (x + s) * y(x), 0, p.b);
    return [r6(k(0)), r6(k(p.c))];
  },
  /* y = a x^(3/2): y′ = 1.5 a √x, so u = 1 + 2.25 a² x runs from 1 to its value at x = b. The length is the integral
     of √(1 + y′²) straight in x. */
  q13: p => {
    const dy = x => 1.5 * p.a * Math.sqrt(x);
    return [r6(1 + dy(p.b) * dy(p.b)), r2(simpson(x => Math.sqrt(1 + dy(x) * dy(x)), 0, p.b))];
  },
  /* Hooke: k = F ÷ stretch (the prompt's stretch is s10 tenths of a metre). Work = integral of k x from D1 tenths
     to D2 tenths of a metre. */
  q14: p => {
    const k = p.F / (p.s10 / 10);
    return [r6(k), r6(simpson(x => k * x, p.D1 / 10, p.D2 / 10))];
  },
  /* Tank filled to depth D (cyl = 1: circle of radius r, else a box l by w). A slice at height y has area A and
     mass 1000 A dy and travels to the outlet at H + h. Work in kJ. */
  q15: p => {
    const A = p.cyl ? Math.PI * p.r * p.r : p.l * p.w;
    const top = p.H + p.h;
    const work = simpson(y => 1000 * A * 9.8 * (top - y), 0, p.D);
    return [top, r1(work / 1000)];
  },
  /* Rod on [0, L], density a + b x: mass = integral of ρ; x̄ = integral of x ρ divided by the mass. */
  q16: p => {
    const rho = x => p.a + p.b * x;
    const m = simpson(rho, 0, p.L);
    return [r6(m), r6(simpson(x => x * rho(x), 0, p.L) / m)];
  },
  /* Drum: shells about the y-axis of height c² − x² on [0, c], volume ÷ π. Cable: a slice of length dy at depth y
     below the drum has mass lam dy and is lifted y metres, so work = g lam ∫ y dy over the length. */
  q17: p => {
    const k = simpson(x => 2 * x * (p.c * p.c - x * x), 0, p.c);
    return [r6(k), r6(simpson(y => 9.8 * p.lam * y, 0, p.Lc))];
  },
  /* ∫ from 0 to b of c x f(x) with f = e^x on [0, b]; cos on [0, π/2]; sin on [0, π]; and c ln x on [1, b].
     Boundary term = u v at the top minus at the bottom, with v the antiderivative of dv (e^x, sin x, −cos x, x). */
  q18: p => {
    let lo = 0, hi = p.b, f, uv;
    if (p.fam === 'exp') { f = x => p.c * x * Math.exp(x); uv = x => p.c * x * Math.exp(x); }
    else if (p.fam === 'cos') { hi = Math.PI / 2; f = x => p.c * x * Math.cos(x); uv = x => p.c * x * Math.sin(x); }
    else if (p.fam === 'sin') { hi = Math.PI; f = x => p.c * x * Math.sin(x); uv = x => -p.c * x * Math.cos(x); }
    else { lo = 1; f = x => p.c * Math.log(x); uv = x => p.c * Math.log(x) * x; }
    return [r3(uv(hi) - uv(lo)), r3(simpson(f, lo, hi))];
  },
  /* ∫ from 0 to L·π/2 of sin^q x cos^p x dx by Simpson, then the fraction found by searching for the smallest
     denominator that reproduces the value, reduced to lowest terms. */
  q19: p => {
    const v = simpson(x => Math.pow(Math.sin(x), p.q) * Math.pow(Math.cos(x), p.p), 0, p.L * Math.PI / 2, 4000);
    for (let d = 1; d <= 5000; d++) {
      const n = Math.round(v * d);
      if (Math.abs(v - n / d) < 1e-9) { const g = gcd(n, d) || 1; return [n / g, d / g]; }
    }
    return [NaN, NaN];
  },
  /* Circle radius r: x = r sin θ puts θ = asin(a ÷ r) at x = a. Area = integral of √(r² − x²) from 0 to a. */
  /* The prompt asks θ to 4 decimal places and the area to 2. */
  q20: p => [Math.round(Math.asin(p.a / p.r) * 1e4) / 1e4, Math.round(simpson(x => Math.sqrt(p.r * p.r - x * x), 0, p.a, 20000) * 100) / 100]
});
})();
