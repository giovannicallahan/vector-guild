/* Independent oracles for Complex analysis: the plane of numbers learn missions, file d: q31–q40 (game/realms/complex/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  /* Small complex-number kit: numbers are [re, im]. */
  const C = {
    add: (u, v) => [u[0] + v[0], u[1] + v[1]],
    sub: (u, v) => [u[0] - v[0], u[1] - v[1]],
    mul: (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]],
    div: (u, v) => { const d = v[0] * v[0] + v[1] * v[1]; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; },
    pow: (u, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = C.mul(r, u); return r; },
    exp: u => [Math.exp(u[0]) * Math.cos(u[1]), Math.exp(u[0]) * Math.sin(u[1])],
    abs: u => Math.hypot(u[0], u[1]),
    cis: t => [Math.cos(t), Math.sin(t)]
  };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const r6 = x => Math.round(x * 1e6) / 1e6;
  /* Coefficient of z^n of a function that is analytic on the ring |z| = rho (n may be negative): the discrete
     Fourier transform of its values on that circle, c_n = mean of f(z) z^(−n). Aliasing is negligible for these N. */
  const ringCoeff = (f, n, rho, N) => {
    let s = [0, 0];
    for (let k = 0; k < N; k++) {
      const z = [rho * Math.cos(2 * Math.PI * k / N), rho * Math.sin(2 * Math.PI * k / N)];
      s = C.add(s, C.mul(f(z), C.pow(n >= 0 ? C.div([1, 0], z) : z, Math.abs(n))));
    }
    return [s[0] / N, s[1] / N];
  };
  /* Turn a real number known to be a fraction with a small denominator into [numerator, denominator], lowest terms. */
  const asFraction = v => {
    for (let d = 1; d <= 100000; d++) {
      const n = Math.round(v * d);
      if (Math.abs(v * d - n) < 1e-6) { const g = gcd(n, d) || 1; return [n / g, d / g]; }
    }
    return [NaN, NaN];
  };
  const poleOrder = (f, c) => {          /* |f(c + e)| ~ e^(−order): read the order off the slope of log|f| against log e */
    const e1 = 1e-3, e2 = 1e-4;
    return Math.round(-(Math.log(Math.abs(f(c + e2))) - Math.log(Math.abs(f(c + e1)))) / (Math.log(e2) - Math.log(e1)));
  };
  /* The (a, b) pairs of q39's table, indexed by p.t (a text index only: each pair is a Pythagorean-style pair with
     a whole √(a² − b²), read off the prompts). */
  const Q39 = [[5, 3], [5, 4], [10, 6], [10, 8], [13, 5], [13, 12], [17, 8], [17, 15], [25, 7], [25, 24], [15, 9], [15, 12], [20, 12], [20, 16]];

Object.assign(window.ORACLE, {
  /* Series Σ n^k ÷ b^n zⁿ. The ratio of neighbouring terms is read from the logs of a_n at two large n and
     extrapolated (Richardson) to n → ∞; R is its reciprocal. z₀ = x + yi converges when it is inside the disc. */
  q31: p => {
    const la = n => p.k * Math.log(n) - n * Math.log(p.b);
    const ratio = n => Math.exp(la(n + 1) - la(n));
    const n0 = 100000, L = 2 * ratio(2 * n0) - ratio(n0);
    const R = r6(1 / L), mod = Math.hypot(p.x, p.y);
    return [R, r6(mod), mod < R ? 1 : 0];
  },
  /* f = e^(a z): coefficients from c_n = c_(n−1)·a ÷ n kept as exact fractions. g = 1 ÷ (1 − b z): (1 − bz)·g = 1
     gives g_0 = 1 and g_n = b·g_(n−1). p.k and p.m are the powers of z asked for. */
  q32: p => {
    let num = 1, den = 1;
    for (let n = 1; n <= p.k; n++) { num *= p.a; den *= n; const g = gcd(num, den) || 1; num /= g; den /= g; }
    let g = 1;
    for (let n = 1; n <= p.m; n++) g *= p.b;
    return [num, den, g];
  },
  /* h = z^m e^(a ÷ z): coefficient of z⁻¹ from the ring-circle Fourier sum on |z| = 1, then turned into a fraction.
     g = j c² ÷ (z (z − c)) on 0 < |z| < |c|: coefficients z⁻¹ and z⁰ from a circle of radius |c| ÷ 2. */
  q33: p => {
    const h = z => C.mul(C.pow(z, p.m), C.exp(C.div([p.a, 0], z)));
    const g = z => C.div([p.j * p.c * p.c, 0], C.mul(z, C.sub(z, [p.c, 0])));
    const [n, d] = asFraction(ringCoeff(h, -1, 1, 1024)[0]);
    return [n, d, r6(ringCoeff(g, -1, Math.abs(p.c) / 2, 256)[0]), r6(ringCoeff(g, 0, Math.abs(p.c) / 2, 256)[0])];
  },
  /* f = (z − b) ÷ ((z − a)^m (z − c)); s = sin z ÷ z^p. Pole orders from the growth of |f| near the point; the
     singularity at c is removable when |f| stays bounded as z → c. */
  q34: p => {
    const f = z => (z - p.b) / (Math.pow(z - p.a, p.m) * (z - p.c));
    const s = z => Math.sin(z) / Math.pow(z, p.p);
    const bounded = Math.abs(f(p.c + 1e-5) / f(p.c + 1e-4)) < 2;
    return [poleOrder(f, p.a), bounded ? 1 : 0, poleOrder(s, 0)];
  },
  /* f = ((A + B)z − A s − B r) ÷ ((z − r)(z − s)), the form printed in the prompt. Residue = mean of f(z)(z − c)
     on a small circle round each pole. */
  q35: p => {
    const f = z => C.div([(p.A + p.B) * z[0] - p.A * p.s - p.B * p.r, (p.A + p.B) * z[1]], C.mul(C.sub(z, [p.r, 0]), C.sub(z, [p.s, 0])));
    const rho = Math.abs(p.r - p.s) / 4, N = 64;
    const res = c => { let s = [0, 0]; for (let k = 0; k < N; k++) { const w = C.mul([rho, 0], C.cis(2 * Math.PI * k / N)); s = C.add(s, C.mul(f(C.add([c, 0], w)), w)); } return r6(s[0] / N); };
    return [res(p.r), res(p.s)];
  },
  /* g = z³ + p z² + q z + r. f = g ÷ (z − a)² and h = g ÷ (z − a)³ have one pole each; residue = mean of
     f(z)(z − a) on a circle of radius 1 ÷ 2 round it. */
  q36: p => {
    const g = z => C.add(C.add(C.pow(z, 3), C.mul([p.p, 0], C.pow(z, 2))), C.add(C.mul([p.q, 0], z), [p.r, 0]));
    const N = 64, rho = 0.5;
    const res = n => { let s = [0, 0]; for (let k = 0; k < N; k++) { const w = C.mul([rho, 0], C.cis(2 * Math.PI * k / N)); s = C.add(s, C.mul(C.div(g(C.add([p.a, 0], w)), C.pow(w, n)), w)); } return r6(s[0] / N); };
    return [res(2), res(3)];
  },
  /* f = A ÷ (z − P1) + B ÷ (z − P2) + C ÷ (z − P3)² with Pj = xj + i yj, integrated numerically once anticlockwise
     round |z| = R (trapezoid, z = R e^(iθ), dz = i z dθ). k = integral ÷ (πi). Poles inside: modulus below R. */
  q37: p => {
    const P = [[p.x1, p.y1], [p.x2, p.y2], [p.x3, p.y3]];
    const f = z => C.add(C.add(C.div([p.A, 0], C.sub(z, P[0])), C.div([p.B, 0], C.sub(z, P[1]))), C.div([p.C, 0], C.pow(C.sub(z, P[2]), 2)));
    const N = 200000; let s = [0, 0];
    for (let k = 0; k < N; k++) { const z = C.mul([p.R, 0], C.cis(2 * Math.PI * k / N)); s = C.add(s, C.mul(C.mul(f(z), C.mul([0, 1], z)), [2 * Math.PI / N, 0])); }
    const inside = P.filter(q => Math.hypot(q[0], q[1]) < p.R).length;
    return [inside, r6(C.div(s, [0, Math.PI])[0])];
  },
  /* I₁ = ∫ (j a) dx ÷ (x² + a²) and I₂ = ∫ (J p q (p + q)) dx ÷ ((x² + p²)(x² + q²)) over the real line (numerators as
     printed in the prompts: j, J are the whole-number multipliers). Integrated with x = tan t, midpoint rule; the
     answers are the integrals ÷ π. */
  q38: p => {
    const N = 400000, a = p.a, P = p.p, Q = p.q;
    const n1 = p.j * a, n2 = p.J * P * Q * (P + Q);
    let s1 = 0, s2 = 0;
    for (let k = 0; k < N; k++) {
      const t = -Math.PI / 2 + (k + 0.5) * Math.PI / N, x = Math.tan(t), w = 1 + x * x;
      s1 += n1 / (x * x + a * a) * w; s2 += n2 / ((x * x + P * P) * (x * x + Q * Q)) * w;
    }
    return [r6(s1 * Math.PI / N / Math.PI), r6(s2 * Math.PI / N / Math.PI)];
  },
  /* I = ∫0..2π N dθ ÷ (a ± b cos θ), (a, b) from the table indexed by p.t, N = k √(a² − b²) ÷ 2, sign − when p.neg.
     Periodic trapezoid sum; the answer k is I ÷ π. */
  q39: p => {
    const [a, b] = Q39[p.t], s = Math.sqrt(a * a - b * b), num = p.k * s / 2, sg = p.neg ? -1 : 1, N = 20000;
    let sum = 0;
    for (let k = 0; k < N; k++) sum += num / (a + sg * b * Math.cos(2 * Math.PI * k / N));
    return [s, r6(sum * 2 * Math.PI / N / Math.PI)];
  },
  /* f = (z − Z1)^m1 (z − Z2)^m2 ÷ ((z − W1)^n1 (z − W2)^n2). Z and P count the factors whose root has modulus below R.
     The winding number is found by walking round |z| = R in tiny steps and adding up the change of argument of f. */
  q40: p => {
    const Zs = [[p.x1, p.y1, p.m1], [p.x2, p.y2, p.m2]], Ps = [[p.u1, p.v1, p.n1], [p.u2, p.v2, p.n2]];
    const inside = L => L.filter(q => Math.hypot(q[0], q[1]) < p.R).reduce((s, q) => s + q[2], 0);
    const f = z => {
      let v = [1, 0];
      for (const q of Zs) v = C.mul(v, C.pow(C.sub(z, [q[0], q[1]]), q[2]));
      for (const q of Ps) v = C.div(v, C.pow(C.sub(z, [q[0], q[1]]), q[2]));
      return v;
    };
    const N = 20000; let total = 0, prev = f([p.R, 0]);
    for (let k = 1; k <= N; k++) {
      const cur = f(C.mul([p.R, 0], C.cis(2 * Math.PI * k / N)));
      const q = C.div(cur, prev);
      total += Math.atan2(q[1], q[0]); prev = cur;
    }
    return [inside(Zs), inside(Ps), Math.round(total / (2 * Math.PI))];
  }
});
})();
