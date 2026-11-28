/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 7 of 8: q31b–q35d (game/realms/complex/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Complex numbers as [re, im]. */
const cx = {
  add: (u, v) => [u[0] + v[0], u[1] + v[1]],
  sub: (u, v) => [u[0] - v[0], u[1] - v[1]],
  mul: (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]],
  div: (u, v) => { const d = v[0] * v[0] + v[1] * v[1]; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; },
  exp: u => { const e = Math.exp(u[0]); return [e * Math.cos(u[1]), e * Math.sin(u[1])]; },
  sin: u => [Math.sin(u[0]) * Math.cosh(u[1]), Math.cos(u[0]) * Math.sinh(u[1])],
  pow: (u, n) => { let r = [1, 0]; for (let i = 0; i < Math.abs(n); i++) r = cx.mul(r, u); return n < 0 ? cx.div([1, 0], r) : r; },
  re: r => [r, 0]
};
const N = 512;
/* Coefficient of z^n of f on the circle |z| = rho, from (1/2πi)∮ f(z) z^(-n-1) dz (equal-step sum round the circle). */
const coef = (f, n, rho) => {
  let sum = 0;
  for (let j = 0; j < N; j++) {
    const th = 2 * Math.PI * j / N, z = [rho * Math.cos(th), rho * Math.sin(th)];
    const v = cx.mul(f(z), [Math.cos(n * th), -Math.sin(n * th)]);
    sum += v[0];
  }
  return sum / N / Math.pow(rho, n);
};
/* Residue of f at pole c: (1/2πi)∮ f(z) dz over a small circle about c. */
const residue = (f, c, rho) => {
  let sum = 0;
  for (let j = 0; j < N; j++) {
    const th = 2 * Math.PI * j / N, w = [rho * Math.cos(th), rho * Math.sin(th)];
    sum += cx.mul(f([c + w[0], w[1]]), w)[0];
  }
  return sum / N;
};
/* A decimal that is a fraction to lowest terms: smallest denominator that matches, sign on the numerator. */
const frac = x => {
  if (Math.abs(x) < 1e-9) return [0, 1];
  for (let d = 1; d <= 200000; d++) {
    const n = Math.round(x * d);
    if (Math.abs(x - n / d) < 1e-9 * Math.max(1, Math.abs(x))) return [n, d];
  }
  return [NaN, NaN];
};
/* Order of the pole of f at a (0 when there is no pole), from how fast |f| grows as the real offset shrinks. */
const order = (f, a) => {
  const e1 = 1e-3, e2 = 1e-4;
  const m1 = Math.log(cx.mul(f([a + e1, 0]), [1, 0]).reduce((s, t) => s + t * t, 0)) / 2;
  const m2 = Math.log(f([a + e2, 0]).reduce((s, t) => s + t * t, 0)) / 2;
  const k = -(m2 - m1) / (Math.log(e2) - Math.log(e1));
  return Math.max(0, Math.round(k));
};
/* Ratio test at a very large n: |a_n| / |a_(n+1)| for a_n = n^k (s/b)^n style terms, passed as ratio function. */
const BIG = 1e10;
const rt = ratioOfTerms => 1 / ratioOfTerms(BIG); /* radius = 1 / limit of |a(n+1)/a(n)| */
const lin = (c, a) => z => cx.sub(z, [a, 0]); /* z − a */
Object.assign(window.ORACLE, {
  /* a_n = (n+1)^k ÷ b^n: ratio |a(n+1)/a(n)| = ((n+2)/(n+1))^k ÷ b at huge n; z1 = x is real, z2 = yi is imaginary. */
  q31b: p => {
    const R = rt(n => Math.exp(p.k * Math.log1p(1 / (n + 1))) / p.b);
    return [Math.round(R * 1e6) / 1e6, Math.abs(p.x) < R ? 1 : 0, Math.abs(p.y) < R ? 1 : 0];
  },
  /* a_n = n^k s^n ÷ b^n: ratio at huge n is (1 + 1/n)^k × s/b. z0 = x + yi. */
  q31c: p => {
    const R = rt(n => Math.exp(p.k * Math.log1p(1 / n)) * p.s / p.b);
    const m = Math.hypot(p.x, p.y);
    return [R, m, Math.abs(R - m)];
  },
  /* Terms t_n = n^k z^(2n) ÷ (r²)^n (the 25 in the prompt is r²). Ratio of terms at huge n is (1 + 1/n)^k |z|² ÷ r². */
  q31d: p => {
    const m = Math.hypot(p.x, p.y), B = p.r * p.r;
    const lim = z => Math.exp(p.k * Math.log1p(1 / BIG)) * z * z / B;
    const R = Math.sqrt(B / Math.exp(p.k * Math.log1p(1 / BIG)));
    return [R, m, lim(m) < 1 ? 1 : 0];
  },
  /* f = e^(a z): coefficient of z^k from the circle sum. h = 1 ÷ (1 + b z): coefficient of z^m, radius 1/(2|b|). */
  q32b: p => {
    const c = coef(z => cx.exp([p.a * z[0], p.a * z[1]]), p.k, 1);
    const f = frac(c);
    const h = coef(z => cx.div([1, 0], [1 + p.b * z[0], p.b * z[1]]), p.m, 0.5 / Math.abs(p.b));
    return [f[0], f[1], Math.round(h)];
  },
  /* f + g with f = e^(a z), g = 1 ÷ (1 − b z) (the prompt prints 1 + 4z for b = −4). Coefficient of z^k of the sum. */
  q32c: p => {
    const rho = 0.5 / Math.abs(p.b);
    const s = coef(z => cx.add(cx.exp([p.a * z[0], p.a * z[1]]), cx.div([1, 0], [1 - p.b * z[0], -p.b * z[1]])), p.k, rho);
    return frac(s);
  },
  /* f = e^(p z) e^(q z) multiplied pointwise; g = 1 ÷ (1 − b z). R of g from the ratio of its own coefficients far out. */
  q32d: p => {
    const rho = 0.5 / Math.abs(p.b);
    const f = frac(coef(z => cx.mul(cx.exp([p.p * z[0], p.p * z[1]]), cx.exp([p.q * z[0], p.q * z[1]])), p.k, 1));
    const g = (n) => coef(z => cx.div([1, 0], [1 - p.b * z[0], -p.b * z[1]]), n, rho);
    const gm = Math.round(g(p.m));
    const R = Math.abs(g(15) / g(16));
    return [f[0], f[1], gm, Math.round(R * 1e6) / 1e6];
  },
  /* h = z^m e^(a/z) on the punctured plane (circle radius 1); g = j c² ÷ (z(z + c)) on 0 < |z| < |c| (circle radius |c|/2). */
  q33b: p => {
    const h = frac(coef(z => cx.mul(cx.pow(z, p.m), cx.exp(cx.div([p.a, 0], z))), -1, 1));
    const g = z => cx.div([p.j * p.c * p.c, 0], cx.mul(z, [z[0] + p.c, z[1]]));
    const rho = Math.abs(p.c) / 2;
    return [h[0], h[1], Math.round(coef(g, -1, rho)), Math.round(coef(g, 0, rho))];
  },
  /* s = K z^m e^(a/z) + j c² ÷ (z(z − c)) (prompt prints z + 4 for c = −4), K = t (m + 1)! read off the printed numbers. */
  q33c: p => {
    let fact = 1; for (let i = 2; i <= p.m + 1; i++) fact *= i;
    const K = p.t * fact;
    const s = z => cx.add(cx.mul([K, 0], cx.mul(cx.pow(z, p.m), cx.exp(cx.div([p.a, 0], z)))),
      cx.div([p.j * p.c * p.c, 0], cx.mul(z, [z[0] - p.c, z[1]])));
    const rho = Math.abs(p.c) / 2;
    return [Math.round(coef(s, -1, rho)), Math.round(coef(s, 0, rho))];
  },
  /* f = e^(a z) ÷ z^k on the punctured plane; g = 1 ÷ (z^m (1 − b z)) on 0 < |z| < 1/|b| (prompt prints 1 + 2z for b = −2). */
  q33d: p => {
    const f = frac(coef(z => cx.div(cx.exp([p.a * z[0], p.a * z[1]]), cx.pow(z, p.k)), -1, 1));
    const g = z => cx.div([1, 0], cx.mul(cx.pow(z, p.m), [1 - p.b * z[0], -p.b * z[1]]));
    return [f[0], f[1], Math.round(coef(g, -1, 0.5 / Math.abs(p.b)))];
  },
  /* f = (z − c)^r ÷ ((z − a)^m (z − c)^s); t(z) = z sin z ÷ z^p. Orders from how fast |f| grows near each point. */
  q34b: p => {
    const f = z => cx.div(cx.pow(cx.sub(z, [p.c, 0]), p.r), cx.mul(cx.pow(cx.sub(z, [p.a, 0]), p.m), cx.pow(cx.sub(z, [p.c, 0]), p.s)));
    const t = z => cx.div(cx.mul(z, cx.sin(z)), cx.pow(z, p.p));
    return [order(f, p.a), order(f, p.c), order(t, 0)];
  },
  /* f = (z − b) ÷ ((z − a)^m (z − c)), g = (z − a)^r ÷ (z − e); orders at a of f, of 1/g's growth (zero of g), and of f g. */
  q34c: p => {
    const f = z => cx.div(cx.sub(z, [p.b, 0]), cx.mul(cx.pow(cx.sub(z, [p.a, 0]), p.m), cx.sub(z, [p.c, 0])));
    const g = z => cx.div(cx.pow(cx.sub(z, [p.a, 0]), p.r), cx.sub(z, [p.e, 0]));
    const ginv = z => cx.div([1, 0], g(z)); /* grows like the zero of g is deep */
    const fg = z => cx.mul(f(z), g(z));
    return [order(f, p.a), order(ginv, p.a), order(fg, p.a)];
  },
  /* f = (z − c)^r ÷ ((z − a)^m (z − c)^s (z − e)^t); points in prompt order a, c, e. */
  q34d: p => {
    const f = z => cx.div(cx.pow(cx.sub(z, [p.c, 0]), p.r),
      cx.mul(cx.mul(cx.pow(cx.sub(z, [p.a, 0]), p.m), cx.pow(cx.sub(z, [p.c, 0]), p.s)), cx.pow(cx.sub(z, [p.e, 0]), p.t)));
    return [order(f, p.a), order(f, p.c), order(f, p.e)];
  },
  /* f = (A (z + d) + B (z − d)) ÷ (z² − d²); residue by the small-circle integral at d then −d. */
  q35b: p => {
    const f = z => cx.div(cx.add(cx.mul([p.A, 0], [z[0] + p.d, z[1]]), cx.mul([p.B, 0], [z[0] - p.d, z[1]])), cx.sub(cx.mul(z, z), [p.d * p.d, 0]));
    return [residue(f, p.d, 0.3), residue(f, -p.d, 0.3)].map(v => Math.round(v * 1e6) / 1e6);
  },
  /* f = (A (z − s) + B (z − r)) ÷ ((z − r)(z − s)); answers: larger pole, residue there, residue at the smaller. */
  q35c: p => {
    const f = z => cx.div(cx.add(cx.mul([p.A, 0], [z[0] - p.s, z[1]]), cx.mul([p.B, 0], [z[0] - p.r, z[1]])),
      cx.mul([z[0] - p.r, z[1]], [z[0] - p.s, z[1]]));
    const hi = Math.max(p.r, p.s), lo = Math.min(p.r, p.s);
    return [hi, residue(f, hi, 0.3), residue(f, lo, 0.3)].map(v => Math.round(v * 1e6) / 1e6);
  },
  /* f = (A0 (z² − d²) + A1 z (z + d) + A2 z (z − d)) ÷ (z (z − d)(z + d)); residues at 0, d, −d. */
  q35d: p => {
    const f = z => {
      const zz = cx.mul(z, z);
      const top = cx.add(cx.add(cx.mul([p.A0, 0], cx.sub(zz, [p.d * p.d, 0])), cx.mul([p.A1, 0], cx.mul(z, [z[0] + p.d, z[1]]))),
        cx.mul([p.A2, 0], cx.mul(z, [z[0] - p.d, z[1]])));
      return cx.div(top, cx.mul(z, cx.sub(zz, [p.d * p.d, 0])));
    };
    return [residue(f, 0, 0.3), residue(f, p.d, 0.3), residue(f, -p.d, 0.3)].map(v => Math.round(v * 1e6) / 1e6);
  }
});
})();
