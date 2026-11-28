/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 3 of 8: q11b–q15d (game/realms/complex/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r2 = x => { const v = Math.round(x * 100) / 100; return v === 0 ? 0 : v; };
const r6 = x => { const v = Math.round(x * 1e6) / 1e6; return v === 0 ? 0 : v; };
/* Complex numbers as [re, im]. */
const cadd = (u, v) => [u[0] + v[0], u[1] + v[1]];
const csub = (u, v) => [u[0] - v[0], u[1] - v[1]];
const cmul = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]];
const cdiv = (u, v) => { const d = v[0] * v[0] + v[1] * v[1]; return [(u[0] * v[0] + u[1] * v[1]) / d, (u[1] * v[0] - u[0] * v[1]) / d]; };
const cscale = (u, s) => [u[0] * s, u[1] * s];
const cpow = (u, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cmul(r, u); return r; };
/* Derivative of an analytic f at z0 by a fourth-order symmetric difference along the real direction. */
const deriv = (f, z0) => {
  const h = 1e-3, at = s => f(cadd(z0, [s * h, 0]));
  const A = at(2), B = at(1), C = at(-1), D = at(-2);
  return [0, 1].map(k => r6((-A[k] + 8 * B[k] - 8 * C[k] + D[k]) / (12 * h)));
};
/* Same difference for a real function of one real variable. */
const d1 = (g, t) => { const h = 1e-3; return (-g(t + 2 * h) + 8 * g(t + h) - 8 * g(t - h) + g(t - 2 * h)) / (12 * h); };
/* Principal argument, in (−π, π], from the cosine of the angle with the positive real axis. */
const arg = (a, b) => { const m = Math.hypot(a, b), t = Math.acos(a / m); return b < 0 ? -t : t; };
const sinh = y => (Math.exp(y) - Math.exp(-y)) / 2, cosh = y => (Math.exp(y) + Math.exp(-y)) / 2;
/* parameter xi is only an index into this list of angles (multiples of π): π/6, π/4, π/3, π/2, 2π/3, 3π/4, 5π/6. */
const ANG = [1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 5 / 6].map(f => f * Math.PI);
/* Cauchy–Riemann check for real functions u, v at several points. */
const isCR = (u, v) => [[0.7, -1.3], [2.1, 1.1], [-1.5, 0.4], [1.2, 2.2]].every(([x, y]) => {
  const ux = d1(t => u(t, y), x), uy = d1(t => u(x, t), y), vx = d1(t => v(t, y), x), vy = d1(t => v(x, t), y);
  return Math.abs(ux - vy) < 1e-4 && Math.abs(uy + vx) < 1e-4;
});
Object.assign(window.ORACLE, {
  /* q11b: modulus of z^k by repeated multiplication, then Log = ln of modulus plus i times the angle. */
  q11b: p => {
    const z = [p.a, p.b], zk = cpow(z, p.k);
    return [r2(Math.log(Math.hypot(z[0], z[1]))), r2(arg(p.a, p.b)), r2(Math.log(Math.hypot(zk[0], zk[1])))];
  },
  /* q11c: |z|, Re Log(z^k), then walk the ticks multiplying by z until Re Log(z^t) is above L. */
  q11c: p => {
    const z = [p.a, p.b], zk = cpow(z, p.k);
    let w = [1, 0], t = 0;
    do { w = cmul(w, z); t++; } while (!(Math.log(Math.hypot(w[0], w[1])) > p.L) && t < 100000);
    return [r6(Math.hypot(p.a, p.b)), r2(Math.log(Math.hypot(zk[0], zk[1]))), t];
  },
  /* q11d: w = |z|^p e^(i p Arg z); read Re w, and Re Log w as ln of the modulus of the computed w. */
  q11d: p => {
    const th = arg(p.a, p.b), m = Math.pow(Math.hypot(p.a, p.b), p.p), w = [m * Math.cos(p.p * th), m * Math.sin(p.p * th)];
    return [r2(th), r2(w[0]), r2(Math.log(Math.hypot(w[0], w[1])))];
  },
  /* q12b: f = a z³ + b z² + c z at z0 = p + qi, by a numerical derivative. */
  q12b: p => deriv(z => cadd(cadd(cscale(cpow(z, 3), p.a), cscale(cpow(z, 2), p.b)), cscale(z, p.c)), [p.p, p.q]),
  /* q12c: f = a z³ + b z, z0 = p + qi, h = (r + s i) ÷ 10; estimated change = f′(z0) × h. */
  q12c: p => {
    const d = deriv(z => cadd(cscale(cpow(z, 3), p.a), cscale(z, p.b)), [p.p, p.q]), c = cmul(d, [p.r / 10, p.s / 10]);
    return [r6(c[0]), r6(c[1])];
  },
  /* q12d: f = z⁴ + a z³ + b z + c at z0 = p + qi: numerical f′, then f(z0) directly. */
  q12d: p => {
    const f = z => cadd(cadd(cadd(cpow(z, 4), cscale(cpow(z, 3), p.a)), cscale(z, p.b)), [p.c, 0]), z0 = [p.p, p.q], d = deriv(f, z0);
    return [d[0], d[1], r6(f(z0)[0])];
  },
  /* q13b: u = a x² + k y² + c x, v = m x y + c y: search whole-number m and k for the Cauchy–Riemann equations. */
  q13b: p => {
    for (let m = -40; m <= 40; m++) for (let k = -40; k <= 40; k++)
      if (isCR((x, y) => p.a * x * x + k * y * y + p.c * x, (x, y) => m * x * y + p.c * y)) return [m, k];
    return [NaN, NaN];
  },
  /* q13c: u = a x³ − 3a x y² + b x, v = k x² y − a y³ + b y: search k, then f′ = u_x + i v_x at (x0, y0). */
  q13c: p => {
    const u = (x, y) => p.a * x * x * x - 3 * p.a * x * y * y + p.b * x;
    for (let k = -60; k <= 60; k++) {
      const v = (x, y) => k * x * x * y - p.a * y * y * y + p.b * y;
      if (isCR(u, v)) return [k, r6(d1(t => u(t, p.y0), p.x0)), r6(d1(t => v(t, p.y0), p.x0))];
    }
    return [NaN, NaN, NaN];
  },
  /* q13d: u = a x³ + k x y² + c x, v = 3a x² y + n y³ + c y: search k and n, then f′ at z0 = p + qi. */
  q13d: p => {
    for (let k = -40; k <= 40; k++) for (let n = -40; n <= 40; n++) {
      const u = (x, y) => p.a * x * x * x + k * x * y * y + p.c * x, v = (x, y) => 3 * p.a * x * x * y + n * y * y * y + p.c * y;
      if (isCR(u, v)) return [k, n, r6(d1(t => u(t, p.q), p.p)), r6(d1(t => v(t, p.q), p.p))];
    }
    return [NaN, NaN, NaN, NaN];
  },
  /* q14b: f = (a z + b)^m at z0 = p + qi, by a numerical derivative of the power computed by multiplication. */
  q14b: p => deriv(z => cpow(cadd(cscale(z, p.a), [p.b, 0]), p.m), [p.p, p.q]),
  /* q14c: f = (z² + a z) ÷ (z + b). Parameter w only indexes the offset of z0 from the zero of the bottom, z0 = −b + dx + i dy. */
  q14c: p => {
    const OFF = [[1, 1], [1, -1], [0, 1], [0, -1], [0, 2], [0, -2], [2, 1], [1, 2]], o = OFF[p.w];
    return deriv(z => cdiv(cadd(cpow(z, 2), cscale(z, p.a)), cadd(z, [p.b, 0])), [-p.b + o[0], o[1]]);
  },
  /* q14d: f = (z + a)(z² + b)² at z0 = p + qi. */
  q14d: p => deriv(z => cmul(cadd(z, [p.a, 0]), cpow(cadd(cpow(z, 2), [p.b, 0]), 2)), [p.p, p.q]),
  /* q15b: sin(x + iy) from the printed formula; x = ANG[xi]. */
  q15b: p => { const x = ANG[p.xi]; return [r2(Math.sin(x) * cosh(p.y)), r2(Math.cos(x) * sinh(p.y))]; },
  /* q15c: amplitudes at two depths and their unrounded ratio; x = ANG[xi]. */
  q15c: p => {
    const x = ANG[p.xi], A = y => Math.sqrt(Math.sin(x) ** 2 + sinh(y) ** 2), a1 = A(p.y1), a2 = A(p.y2);
    return [r2(a1), r2(a2), r2(a2 / a1)];
  },
  /* q15d: |e^(iz)| = e^(−y); |cos z| from cos²x + sinh²y; Re cos z = cos x cosh y; x = ANG[xi]. */
  q15d: p => {
    const x = ANG[p.xi];
    return [r2(Math.exp(-p.y)), r2(Math.sqrt(Math.cos(x) ** 2 + sinh(p.y) ** 2)), r2(Math.cos(x) * cosh(p.y))];
  },
});
})();
