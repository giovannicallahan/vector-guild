/* Independent oracles for Complex analysis: the plane of numbers learn missions, file b: q11–q20 (game/realms/complex/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Small complex-number toolkit: a number is [re, im]. */
const C = {
  add: (u, v) => [u[0] + v[0], u[1] + v[1]],
  sub: (u, v) => [u[0] - v[0], u[1] - v[1]],
  mul: (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]],
  div: (u, v) => { const d = v[0] * v[0] + v[1] * v[1]; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; },
  sc: (s, u) => [s * u[0], s * u[1]],
  conj: u => [u[0], -u[1]],
  pow: (u, n) => { let r = [1, 0]; for (let i = 0; i < Math.abs(n); i++) r = C.mul(r, u); return n < 0 ? C.div([1, 0], r) : r; },
  exp: u => { const e = Math.exp(u[0]); return [e * Math.cos(u[1]), e * Math.sin(u[1])]; },
  abs: u => Math.hypot(u[0], u[1]),
};
/* Complex derivative as a five-point difference along the real direction (exact for polynomials up to degree 4). */
const deriv = (f, z, h = 1e-3) => {
  const at = k => f(C.add(z, [k * h, 0]));
  let s = C.sc(-1, at(2)); s = C.add(s, C.sc(8, at(1))); s = C.sub(s, C.sc(8, at(-1))); s = C.add(s, at(-2));
  return C.sc(1 / (12 * h), s);
};
/* Partial derivatives of a real function of (x, y) by the same five-point rule. */
const dx = (f, x, y, h = 0.25) => (-f(x + 2 * h, y) + 8 * f(x + h, y) - 8 * f(x - h, y) + f(x - 2 * h, y)) / (12 * h);
const dy = (f, x, y, h = 0.25) => (-f(x, y + 2 * h) + 8 * f(x, y + h) - 8 * f(x, y - h) + f(x, y - 2 * h)) / (12 * h);
/* Composite Simpson rule for a complex-valued function of a real parameter. */
const simpson = (g, t0, t1, n = 2000) => {
  const h = (t1 - t0) / n; let s = C.add(g(t0), g(t1));
  for (let i = 1; i < n; i++) s = C.add(s, C.sc(i % 2 ? 4 : 2, g(t0 + i * h)));
  return C.sc(h / 3, s);
};
/* ∫ f(z) dz along the straight segment a → b. */
const seg = (f, a, b) => { const d = C.sub(b, a); return simpson(t => C.mul(f(C.add(a, C.sc(t, d))), d), 0, 1); };
const r2 = x => Math.round(x * 100) / 100;
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Complex sine from its power series, and cosine likewise. */
const series = (z, odd) => {
  let term = odd ? z : [1, 0], sum = term;
  for (let n = 1; n < 40; n++) {
    const k = odd ? 2 * n * (2 * n + 1) : (2 * n - 1) * (2 * n);
    term = C.sc(-1 / k, C.mul(term, C.mul(z, z)));
    sum = C.add(sum, term);
  }
  return sum;
};

Object.assign(window.ORACLE, {
  /* z = a + bi. Modulus from z·z̄; the principal argument is the angle θ in (−π, π] found by scanning for the
     closest unit direction (then refined); Re Log(z²) is ln of the modulus of the product z·z. */
  q11: p => {
    const z = [p.a, p.b], m = Math.sqrt(C.mul(z, C.conj(z))[0]);
    let best = 0, bd = Infinity;
    for (let k = -31415; k <= 31416; k++) {
      const th = k / 10000, d = Math.hypot(m * Math.cos(th) - z[0], m * Math.sin(th) - z[1]);
      if (d < bd) { bd = d; best = th; }
    }
    return [r6(m), r2(best), r2(Math.log(C.abs(C.mul(z, z))))];
  },
  /* f(z) = z³ + a z² + b z + c at z₀ = p + qi: complex difference quotient along the real direction. */
  q12: p => {
    const f = z => C.add(C.add(C.add(C.pow(z, 3), C.sc(p.a, C.pow(z, 2))), C.sc(p.b, z)), [p.c, 0]);
    const d = deriv(f, [p.p, p.q]); return [r6(d[0]), r6(d[1])];
  },
  /* Model A: u = a x³ − k x y² + c x, v = 3a x² y − a y³ + c y. k is found by solving the Cauchy–Riemann residual
     (linear in k) at several points. Model B: U = s x² − s y² + t y, V = 2s xy + r x; analytic when both Cauchy–
     Riemann equations hold at every sampled point. */
  q13: p => {
    const u = k => (x, y) => p.a * x ** 3 - k * x * y * y + p.c * x;
    const v = (x, y) => 3 * p.a * x * x * y - p.a * y ** 3 + p.c * y;
    const res = k => dx(u(k), 1.3, 0.7) - dy(v, 1.3, 0.7);
    const k = -res(0) / (res(1) - res(0));
    const U = (x, y) => p.s * x * x - p.s * y * y + p.t * y, V = (x, y) => 2 * p.s * x * y + p.r * x;
    let ok = 1;
    for (const [x, y] of [[0, 0], [1, 2], [-2, 1.5], [3, -1]]) {
      if (Math.abs(dx(U, x, y) - dy(V, x, y)) > 1e-6 || Math.abs(dy(U, x, y) + dx(V, x, y)) > 1e-6) ok = 0;
    }
    return [r6(k), ok];
  },
  /* f(z) = (z² + a)(z + b) when kind = 0, (z + a) ÷ (z + b) when kind = 1, (z² + a)³ when kind = 2 (b unused); derivative at p + qi. */
  q14: p => {
    const f = p.kind === 0
      ? z => C.mul(C.add(C.pow(z, 2), [p.a, 0]), C.add(z, [p.b, 0]))
      : p.kind === 1 ? z => C.div(C.add(z, [p.a, 0]), C.add(z, [p.b, 0]))
      : z => C.pow(C.add(C.pow(z, 2), [p.a, 0]), 3);
    const d = deriv(f, [p.p, p.q]); return [r6(d[0]), r6(d[1])];
  },
  /* xi is only an index into the list of angles π÷6, π÷4, π÷3, π÷2, 2π÷3, 3π÷4, 5π÷6. cos(iy) and sin(x + iy) from
     their power series; the modulus of the sine is then read off. */
  q15: p => {
    const x = [Math.PI / 6, Math.PI / 4, Math.PI / 3, Math.PI / 2, 2 * Math.PI / 3, 3 * Math.PI / 4, 5 * Math.PI / 6][p.xi];
    return [r2(series([0, p.y], false)[0]), r2(C.abs(series([x, p.y], true)))];
  },
  /* u = a x² + b xy + c y² + d x: the Laplacian 2a + 2c is checked by second differences, a found by search.
     w = p x³ + q x y² + r y²: Laplacian by second differences (exact for cubics) at (x0, y0). */
  q16: p => {
    const lap = (f, x, y, h = 0.5) => (f(x + h, y) - 2 * f(x, y) + f(x - h, y) + f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
    let a = NaN;
    for (let t = -60; t <= 60; t++) {
      const u = (x, y) => t * x * x + p.b * x * y + p.c * y * y + p.d * x;
      if (Math.abs(lap(u, 0.3, 0.9)) < 1e-9 && Math.abs(lap(u, -1.1, 2)) < 1e-9) { a = t; break; }
    }
    const w = (x, y) => p.p * x ** 3 + p.q * x * y * y + p.r * y * y;
    return [a, r6(lap(w, p.x0, p.y0))];
  },
  /* u = a x³ + k x y² + c y, v = m x² y − a y³ − c x. k: search integers for a harmonic u; m: search integers
     for which ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x at sample points. f′ = ∂u/∂x + i ∂v/∂x at (x0, y0). */
  q17: p => {
    const u = k => (x, y) => p.a * x ** 3 + k * x * y * y + p.c * y;
    const v = m => (x, y) => m * x * x * y - p.a * y ** 3 - p.c * x;
    const lap = (f, x, y, h = 0.5) => (f(x + h, y) - 2 * f(x, y) + f(x - h, y) + f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
    let k = NaN, m = NaN;
    for (let t = -80; t <= 80 && isNaN(k); t++) if ([[1, 1], [2, -3], [-1.5, 0.5]].every(([x, y]) => Math.abs(lap(u(t), x, y)) < 1e-9)) k = t;
    for (let t = -80; t <= 80 && isNaN(m); t++) {
      if ([[1, 1], [2, -3], [-1.5, 0.5]].every(([x, y]) =>
        Math.abs(dx(u(k), x, y) - dy(v(t), x, y)) < 1e-7 && Math.abs(dy(u(k), x, y) + dx(v(t), x, y)) < 1e-7)) m = t;
    }
    return [k, m, r6(dx(u(k), p.x0, p.y0)), r6(dx(v(m), p.x0, p.y0))];
  },
  /* ∫_γ z dz (kind 0) or ∫_γ z̄ dz (kind 1) along γ(t) = A + t(B − A), integrated numerically with Simpson's rule. */
  q18: p => {
    const f = p.kind === 0 ? z => z : C.conj;
    const I = seg(f, [p.ar, p.ai], [p.br, p.bi]); return [r6(I[0]), r6(I[1])];
  },
  /* ∫ z^k dz from a to b. The route is taken as an L-shape (across, then up) and integrated numerically: for an
     analytic integrand the route does not matter. */
  q19: p => {
    const f = z => C.pow(z, p.k), a = [p.ar, p.ai], b = [p.br, p.bi], corner = [p.br, p.ai];
    const I = C.add(seg(f, a, corner), seg(f, corner, b)); return [r6(I[0]), r6(I[1])];
  },
  /* ∮ (z − c)^n dz = k₁πi and ∮ (A ÷ (z − c) + B (z − c)^m) dz = k₂πi over the circle |z − c| = r, once anticlockwise.
     Trapezoid rule on the circle (very accurate for periodic integrands); k = Im(integral) ÷ π. */
  q20: p => {
    const N = 4000, c = [p.cr, p.ci];
    const circ = g => {
      let s = [0, 0];
      for (let j = 0; j < N; j++) {
        const th = 2 * Math.PI * j / N, e = [Math.cos(th), Math.sin(th)];
        const w = C.sc(p.r, e), z = C.add(c, w), dz = C.sc(2 * Math.PI / N, C.mul([0, p.r], e));
        s = C.add(s, C.mul(g(w, z), dz));
      }
      return s;
    };
    const I1 = circ(w => C.pow(w, p.n));
    const I2 = circ(w => C.add(C.sc(p.A, C.pow(w, -1)), C.sc(p.B, C.pow(w, p.m))));
    return [r6(I1[1] / Math.PI), r6(I2[1] / Math.PI)];
  },
});
})();
