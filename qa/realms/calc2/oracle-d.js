/* Independent oracles for Calculus 2: accumulation learn missions, file d: q31–q40 (game/realms/calc2/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const r4 = x => Math.round(x * 1e4 + 1e-9 * Math.sign(x)) / 1e4;
/* Composite Simpson rule on [lo, hi] with n (even) strips. */
const simpson = (f, lo, hi, n) => {
  const h = (hi - lo) / n; let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
  return s * h / 3;
};
/* Smallest denominator q (up to 400) with L within 1e-4 of p/q: the fraction in lowest terms. */
const toFraction = L => {
  for (let q = 1; q <= 400; q++) { const n = Math.round(L * q); if (Math.abs(L - n / q) < 1e-4) return [n, q]; }
  throw new Error('no fraction for ' + L);
};
Object.assign(window.ORACLE, {
  /* Two p-series, one with exponent pd ≤ 1 (diverges) and one with pc > 1. swap puts the convergent one in echo A.
     A series 1 ÷ nᵖ is judged by the integral of x⁻ᵖ from 1 to b: if pushing b from 10⁶ to 10¹² barely changes it,
     it converges. The tail is the integral from N to ∞, found by Simpson on the substitution x = N ÷ t. */
  q31: p => {
    const grows = e => { const I = b => b === 1e6 || b === 1e12 ? (e === 1 ? Math.log(b) : (Math.pow(b, 1 - e) - 1) / (1 - e)) : 0; return I(1e12) - I(1e6) > 0.5; };
    const conv = e => grows(e) ? 0 : 1;
    const tail = simpson(t => t === 0 ? (p.pc === 2 ? 1 : 0) * Math.pow(p.N, 1 - p.pc) : Math.pow(p.N, 1 - p.pc) * Math.pow(t, p.pc - 2), 0, 1, 2000);
    const cA = p.swap ? conv(p.pc) : conv(p.pd), cB = p.swap ? conv(p.pd) : conv(p.pc);
    return [cA, cB, tail];
  },
  /* aₙ = (A n^j + B) ÷ (C n^(j+d) + D), compared with 1 ÷ nᵈ. The ratio is evaluated at n = 10⁷; the p-series with
     exponent d converges exactly when d > 1. */
  q32: p => {
    const n = 1e7;
    const a = (p.A * Math.pow(n, p.j) + p.B) / (p.C * Math.pow(n, p.j + p.d) + p.D);
    const L = Math.round(a * Math.pow(n, p.d) * 1e4) / 1e4;
    return [L, p.d > 1 ? 1 : 0];
  },
  /* (−1)ᵐ⁺¹ ÷ mᵖ: the error after k terms is below the first term left out, 1 ÷ (k+1)ᵖ. Walk N upwards until
     that term is under 1 ÷ M, comparing whole numbers (N+1)ᵖ and M to avoid rounding. */
  q33: p => {
    const bound = Math.pow(p.k + 1, -p.p);
    let N = 1; while (Math.pow(N + 1, p.p) <= p.M) N++;
    return [bound, N];
  },
  /* Ratio test (pow, fact) or root test (root), the limit found numerically at a large n and turned into a
     fraction in lowest terms. The verdict is whether that limit is below 1. */
  q34: p => {
    let L;
    if (p.fam === 'pow') {
      const n = 1e7; L = Math.pow((n + 1) / n, p.k) * p.a / p.b;
    } else if (p.fam === 'root') {
      const n = 1e8; L = (p.a * n + 1) / (p.b * n + 2);
    } else if (p.fam === 'fact') {
      const n = 20000, lf = m => { let s = 0; for (let i = 2; i <= m; i++) s += Math.log(i); return s; };
      const la = m => lf(2 * m) - 2 * lf(m) - m * Math.log(p.b);
      L = Math.exp(la(n + 1) - la(n));
    } else throw new Error('unknown family ' + p.fam);
    const [num, den] = toFraction(L);
    return [num, den, num / den < 1 ? 1 : 0];
  },
  /* Σ (x − c)ⁿ ÷ (n kⁿ): the radius is 1 ÷ lim |aₙ₊₁ ÷ aₙ| with aₙ = 1 ÷ (n kⁿ), taken at n = 10⁷ and rounded; the ends
     of the interval are one radius either side of the centre. */
  q35: p => {
    const n = 1e7, la = m => -Math.log(m) - m * Math.log(p.k);
    const R = Math.round(1 / Math.exp(la(n + 1) - la(n)));
    return [p.c, R, p.c - R, p.c + R];
  },
  /* Taylor polynomial of degree deg about a. Coefficients come from the known series of the function in
     u = x − a: √x = √a (1 + u/a)^½ (binomial series), 1/x = Σ (−1)ᵏ uᵏ ÷ aᵏ⁺¹, ln x = ln a + Σ (−1)ᵏ⁺¹ uᵏ ÷ (k aᵏ).
     The prompt rounds the polynomial's value at a + h to 4 places. */
  q36: p => {
    const coef = [];
    for (let k = 0; k <= p.deg; k++) {
      if (p.f === 'sqrt') { let b = 1; for (let i = 0; i < k; i++) b *= (0.5 - i) / (i + 1); coef.push(b * Math.sqrt(p.a) / Math.pow(p.a, k)); }
      else if (p.f === 'inv') coef.push(Math.pow(-1, k) / Math.pow(p.a, k + 1));
      else if (p.f === 'ln') coef.push(k === 0 ? Math.log(p.a) : Math.pow(-1, k + 1) / (k * Math.pow(p.a, k)));
      else throw new Error('unknown function ' + p.f);
    }
    const val = coef.reduce((s, c, k) => s + c * Math.pow(p.h, k), 0);
    return [coef[p.deg], r4(val)];
  },
  /* Coefficient of xᵐ in f(kx) as an exact fraction (BigInt). Base series coefficients are built term by term:
     eᵘ: 1 ÷ m!; sin u: ±1 ÷ m! on odd m; cos u: ±1 ÷ m! on even m; 1 ÷ (1 − u): 1. Then multiplied by kᵐ.
     "geo" is 1 ÷ (1 − kx), shown in the prompt as 1 ÷ (1 + 2x) for k = −2. */
  q37: p => {
    let num = 1n, den = 1n;
    for (let i = 2n; i <= BigInt(p.m); i++) den *= i;
    const m = p.m;
    if (p.f === 'geo') den = 1n;
    else if (p.f === 'cos') { if (m % 2) num = 0n; else if ((m / 2) % 2) num = -1n; }
    else if (p.f === 'sin') { if (!(m % 2)) num = 0n; else if (((m - 1) / 2) % 2) num = -1n; }
    else if (p.f !== 'exp') throw new Error('unknown function ' + p.f);
    num *= BigInt(p.k) ** BigInt(m);
    if (num === 0n) return [0, 1];
    const g = (a, b) => { a = a < 0n ? -a : a; while (b) [a, b] = [b, a % b]; return a; };
    const d = g(num, den);
    return [Number(num / d), Number(den / d)];
  },
  /* Taylor's error bound M xⁿ⁺¹ ÷ (n+1)! with M = 3 for eˣ and 1 for sin and cos: try n = 0, 1, 2, … until the bound
     falls below eps, building the factorial as a running product. */
  q38: p => {
    const M = p.f === 'exp' ? 3 : 1;
    let fact = 1, pw = Math.abs(p.x0);
    for (let n = 0; n < 60; n++) {
      fact *= n + 1;
      if (M * pw / fact < p.eps) return [n];
      pw *= Math.abs(p.x0);
    }
    throw new Error('no degree found');
  },
  /* The first k terms of the series of the integrand are integrated over [0, b] by Simpson's rule (exact for these
     low-degree polynomials), rather than term by term with the power rule. */
  q39: p => {
    const term = (j, x) => p.f === 'sinc' ? Math.pow(-1, j) * Math.pow(x, 2 * j) / fact(2 * j + 1)
      : Math.pow(-1, j) * Math.pow(x, 2 * j) / fact(j);
    if (p.f !== 'sinc' && p.f !== 'gauss') throw new Error('unknown function ' + p.f);
    const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
    const g = x => { let s = 0; for (let j = 0; j < p.k; j++) s += term(j, x); return s; };
    return [r4(simpson(g, 0, p.b, 2000))];
  },
  /* x = 3c t² + p, y = c(t³ − 3t) + q. Slope dy/dx = (dy/dt) ÷ (dx/dt) with five-point difference quotients, which are
     exact for these cubics; length = Simpson integral of √(x′² + y′²) from t1 to t2. */
  q40: p => {
    const x = t => 3 * p.c * t * t + p.p, y = t => p.c * (t * t * t - 3 * t) + p.q;
    const d = (f, t) => { const h = 1e-2; return (-f(t + 2 * h) + 8 * f(t + h) - 8 * f(t - h) + f(t - 2 * h)) / (12 * h); };
    const slope = Math.round(d(y, p.t0) / d(x, p.t0) * 1e8) / 1e8;
    const len = simpson(t => Math.hypot(d(x, t), d(y, t)), p.t1, p.t2, 2000);
    return [slope, Math.round(len * 1e8) / 1e8];
  },
});
})();
