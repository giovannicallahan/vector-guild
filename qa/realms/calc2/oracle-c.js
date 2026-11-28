/* Independent oracles for Calculus 2: accumulation learn missions, file c: q21–q30 (game/realms/calc2/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  const r3 = x => Math.round(x * 1e3) / 1e3;
  /* Composite Simpson's rule with n (even) strips: the numerical stand-in for an exact integral. */
  const simpson = (f, a, b, n = 20000) => {
    const h = (b - a) / n; let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  };
  /* The three or four terms the prompt prints for a geometric series with ratio p/q: the first is j·q²·(q − p). */
  const geoTerms = (p, q, j, count) => {
    const t = [j * q * q * (q - p)];
    for (let i = 1; i < count; i++) t.push(t[i - 1] * p / q);
    return t;
  };
  const sumTerms = (p, q, j) => geoTerms(p, q, j, 3000).reduce((s, x) => s + x, 0);

Object.assign(window.ORACLE, {
  /* Numerator N(x) = (A + B)x + (Ab + Ba) over (x + a)(x + b). Cover-up: A = N(−a) ÷ (b − a), B = N(−b) ÷ (a − b).
     The integral is found by Simpson's rule on the whole fraction, not by logarithms. */
  q21: p => {
    const N = x => (p.A + p.B) * x + p.A * p.b + p.B * p.a;
    const f = x => N(x) / ((x + p.a) * (x + p.b));
    return [N(-p.a) / (p.b - p.a), N(-p.b) / (p.a - p.b), r3(simpson(f, p.L, p.U))];
  },
  /* Readings y0..yn every h minutes. Trapezoid: each strip is a trapezoid. Simpson: each pair of strips is the area
     under the parabola through three readings. */
  q22: p => {
    const y = p.y, h = p.h;
    let trap = 0;
    for (let i = 0; i + 1 < y.length; i++) trap += h * (y[i] + y[i + 1]) / 2;
    let simp = 0;
    for (let i = 0; i + 2 < y.length; i += 2) simp += h / 3 * (y[i] + 4 * y[i + 1] + y[i + 2]);
    return [r3(trap), r3(simp)];
  },
  /* fam 1: 2kx ÷ (x² + m) on [0, c]; fam 2: kx·eˣ on [0, c]; fam 3: d(b − a) ÷ ((x + a)(x + b)) on [L, U] (the prompt prints the numerator d(b − a));
     fam 4: (x² + k) ÷ x on [1, c]. The technique number is the family; the integral is by Simpson's rule. */
  q23: p => {
    let f, lo, hi;
    if (p.fam === 1) { f = x => 2 * p.k * x / (x * x + p.m); lo = 0; hi = p.c; }
    else if (p.fam === 2) { f = x => p.k * x * Math.exp(x); lo = 0; hi = p.c; }
    else if (p.fam === 3) { f = x => p.d * (p.b - p.a) / ((x + p.a) * (x + p.b)); lo = p.L; hi = p.U; }
    else { f = x => (x * x + p.k) / x; lo = 1; hi = p.c; }
    return [p.fam, r3(simpson(f, lo, hi))];
  },
  /* fam e: C·e^(−kt) from 0; fam p: C ÷ t^p from 1. Finite part by Simpson's rule to t = 10. The infinite part is the
     integral to a huge T: it settles (converges) for e^(−kt) and for p > 1, and grows without limit for p ≤ 1. */
  q24: p => {
    if (p.fam === 'e') {
      const f = t => p.C * Math.exp(-p.k * t);
      return [r3(simpson(f, 0, 10)), 1, Math.round(simpson(f, 0, 60 / p.k, 200000) * 1e6) / 1e6];
    }
    const f = t => p.C * Math.pow(t, -p.p);
    const big = p.C * (1 - Math.pow(1e9, 1 - p.p)) / (p.p - 1);
    const conv = p.p > 1;
    return [r3(simpson(f, 1, 10)), conv ? 1 : 0, conv ? Math.round(big * 1e6) / 1e6 : 0];
  },
  /* P(t) = C ÷ (t − a)^p on a < t ≤ a + L. Put u = t − a and then u = e^s, so the integrand C·e^((1 − p)s) is smooth
     and Simpson's rule works from u = 0.01 up to u = L. The improper integral converges only for p < 1, to
     the limit of that integral as the lower end shrinks to 0: C·L^(1 − p) ÷ (1 − p). */
  q25: p => {
    const g = s => p.C * Math.exp((1 - p.p) * s);
    const part = r3(simpson(g, Math.log(0.01), Math.log(p.L)));
    const conv = p.p < 1;
    const lim = conv ? simpson(g, Math.log(1e-30), Math.log(p.L), 200000) : 0;
    return [part, conv ? 1 : 0, conv ? Math.round(lim * 1e6) / 1e6 : 0];
  },
  /* Half-life T days: find k by bisection so that e^(−kT) = 1/2; then bisect on t until y0·e^(−kt) = y1. */
  q26: p => {
    const bis = (fn, lo, hi) => { for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (fn(m) > 0) lo = m; else hi = m; } return (lo + hi) / 2; };
    const k = bis(k2 => Math.exp(-k2 * p.T) - 0.5, 0, 10);
    const t = bis(t2 => p.y0 * Math.exp(-k * t2) - p.y1, 0, 1e5);
    return [Math.round(k * 1e4) / 1e4, Math.round(t * 1e2) / 1e2];
  },
  /* a_n = (p·g(n) + q) ÷ (r·g(n) + s) with g(n) = n or 2ⁿ. The term is evaluated at n = m; the limit by evaluating
     at a gigantic n (or 2ⁿ with n = 400). */
  q27: p => {
    const a = (g) => (p.p * g + p.q) / (p.r * g + p.s);
    const gm = p.g === 'n' ? p.m : Math.pow(2, p.m);
    const gBig = p.g === 'n' ? 1e12 : Math.pow(2, 400);
    return [r3(a(gm)), Math.round(a(gBig) * 1e6) / 1e6];
  },
  /* Echoes with ratio p/q: terms j·q²(q − p), then each times p/q. The ratio is read off the first two terms and the
     sum is the total of a few thousand terms added one by one. */
  q28: p => {
    const t = geoTerms(p.p, p.q, p.j, 3000);
    return [t[1] / t[0], sumTerms(p.p, p.q, p.j)];
  },
  /* Tone: C·e^(−kt) from 0 (fam e) or C ÷ t^pw from 1 (fam t), as the integral up to a huge T. Pulses: the series with
     ratio p/q whose first term is j·q²(q − p), summed term by term. */
  q29: p => {
    let tone;
    if (p.fam === 'e') tone = p.C * (1 - Math.exp(-p.k * 5000)) / p.k;
    else tone = p.C * (1 - Math.pow(1e12, 1 - p.pw)) / (p.pw - 1);
    return [Math.round(tone * 1e6) / 1e6, sumTerms(p.p, p.q, p.j)];
  },
  /* a_n = d + c ÷ (n(n + k)). S10 by adding ten terms. With d ≠ 0 the terms do not shrink to 0 so the series
     diverges (answer 0). With d = 0, 1 ÷ (n(n + k)) = (1/k)(1/n − 1/(n + k)); the sum telescopes
     to (c/k)(1 + 1/2 + … + 1/k). */
  q30: p => {
    let s = 0;
    for (let n = 1; n <= 10; n++) s += p.d + p.c / (n * (n + p.k));
    let total = 0;
    if (p.d === 0) { for (let i = 1; i <= p.k; i++) total += 1 / i; total *= p.c / p.k; }
    return [r3(s), total];
  },
});
})();
