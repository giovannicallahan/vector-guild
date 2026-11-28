/* Independent oracles for Complex analysis: the plane of numbers practice missions, file 5 of 8: q21b–q25d (game/realms/complex/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6 + 0;
/* Complex numbers as [re, im]. */
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = a => { const n = a[0] * a[0] + a[1] * a[1]; return [a[0] / n, -a[1] / n]; };
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cpow = (a, n) => { let r = [1, 0]; const b = n < 0 ? cinv(a) : a; for (let i = 0; i < Math.abs(n); i++) r = cmul(r, b); return r; };
/* c / (z - a)^n and a polynomial (coefficients lowest power first) as functions of z. */
const term = (C, a, n) => z => { const w = cpow(csub(z, a), -n); return [C * w[0], C * w[1]]; };
const poly = cs => z => { let r = [0, 0]; for (let i = cs.length - 1; i >= 0; i--) { r = cmul(r, z); r[0] += cs[i]; } return r; };
const sum = (...fs) => z => fs.reduce((s, f) => { const v = f(z); return [s[0] + v[0], s[1] + v[1]]; }, [0, 0]);
/* ∮ F(z) dz once anticlockwise round the circle centre c, radius r, by the trapezoid rule on 6000 points; returns k with the integral = kπi. */
const loopK = (F, c, r) => {
  const N = 6000; let re = 0, im = 0;
  for (let j = 0; j < N; j++) {
    const th = 2 * Math.PI * j / N, e = [Math.cos(th), Math.sin(th)];
    const v = F([c + r * e[0], r * e[1]]), dz = [-r * e[1] * 2 * Math.PI / N, r * e[0] * 2 * Math.PI / N];
    const t = cmul(v, dz); re += t[0]; im += t[1];
  }
  return r6(im / Math.PI);
};
/* Turns of the circle (centre c, radius r) round the point a: ∮ dz/(z − a) = 2πi × turns. */
const turns = (a, c, r) => Math.round(loopK(term(1, a, 1), c, r) / 2);
/* Taylor shift: coefficients of f in powers of (z − a) by repeated synthetic division; the n-th derivative is n! × coefficient n. */
const deriv = (cs, a, n) => {
  let q = cs.slice(), out = [];
  while (q.length) { let carry = 0; const nq = []; for (let i = q.length - 1; i >= 0; i--) { carry = carry * a + q[i]; nq[i] = carry; } out.push(nq[0]); q = nq.slice(1); }
  let fact = 1; for (let i = 2; i <= n; i++) fact *= i;
  return (out[n] || 0) * fact;
};
const fval = (cs, x) => { let v = 0; for (let i = cs.length - 1; i >= 0; i--) v = v * x + cs[i]; return v; };
Object.assign(window.ORACLE, {
  /* q21b: p, q = the real and imaginary parts of pump A; s = the imaginary part of pump B (at s·i). Integrate round the cable. */
  q21b: p => [loopK(term(1, [p.p, p.q], 1), 0, p.R), loopK(term(1, [0, p.s], 1), 0, p.R)],
  /* q21c: feeds at a1, a2 (real) and p + qi; the count is the sum of the single-feed integrals ÷ 2. */
  q21c: p => {
    const fs = [term(1, [p.a1, 0], 1), term(1, [p.a2, 0], 1), term(1, [p.p, p.q], 1)];
    const inside = fs.reduce((n, f) => n + loopK(f, 0, p.R) / 2, 0);
    return [r6(inside), loopK(sum(...fs), 0, p.R)];
  },
  /* q21d: loop centre c (real), radius r; beacon p + qi; relay 1 ÷ (z − c)^m (m is the power of the relay). */
  q21d: p => {
    const beacon = term(1, [p.p, p.q], 1);
    return [loopK(beacon, p.c, p.r), loopK(sum(beacon, term(1, [p.c, 0], p.m)), p.c, p.r)];
  },
  /* q22b: m laps (negative = clockwise) of |z| = R; post at the real point s; signal C ÷ (z − s). */
  q22b: p => [p.m * turns([p.s, 0], 0, p.R), p.m * loopK(term(p.C, [p.s, 0], 1), 0, p.R)],
  /* q22c: m1 anticlockwise laps and m2 clockwise laps; relay A at p + qi with CA, relay B at the real point b with CB. */
  q22c: p => {
    const net = p.m1 - p.m2, F = sum(term(p.CA, [p.p, p.q], 1), term(p.CB, [p.b, 0], 1));
    return [net * turns([0, 0], 0, p.R), net * loopK(F, 0, p.R)];
  },
  /* q22d: m laps (negative = clockwise); beacon C ÷ (z − (p + qi)) plus D z² + E. */
  q22d: p => {
    const a = [p.p, p.q], F = sum(term(p.C, a, 1), poly([p.E, 0, p.D]));
    return [p.m * turns(a, 0, p.R), p.m * loopK(F, 0, p.R)];
  },
  /* q23b: yard loop |z| = R with poles a, b, d (numbers A, B, C); second loop centre c radius r with D/(z−c)³ + E/(z−c) + F(z−c)². */
  q23b: p => {
    const first = sum(term(p.A, [p.a, 0], 1), term(p.B, [p.b, 0], 1), term(p.C, [p.d, 0], 1));
    const second = sum(term(p.D, [p.c, 0], 3), term(p.E, [p.c, 0], 1), z => { const w = csub(z, [p.c, 0]); const s = cmul(w, w); return [p.F * s[0], p.F * s[1]]; });
    return [loopK(first, 0, p.R), loopK(second, p.c, p.r)];
  },
  /* q23c: sensor A/(z−c) + B/(z−c)² at the centre; stray C/(z−a). */
  q23c: p => {
    const sensor = sum(term(p.A, [p.c, 0], 1), term(p.B, [p.c, 0], 2));
    return [loopK(sensor, p.c, p.r), loopK(sum(sensor, term(p.C, [p.a, 0], 1)), p.c, p.r)];
  },
  /* q23d: terms A/(z−a), B/(z−(p+qi)), D/(z−e)²; count the terms whose own integral is not 0. */
  q23d: p => {
    const ts = [term(p.A, [p.a, 0], 1), term(p.B, [p.p, p.q], 1), term(p.D, [p.e, 0], 2)];
    return [ts.filter(f => Math.abs(loopK(f, p.c, p.r)) > 0.5).length, loopK(sum(...ts), p.c, p.r)];
  },
  /* q24b: f = al z³ + be z + ga over (z − a). */
  q24b: p => {
    const cs = [p.ga, p.be, 0, p.al];
    return [fval(cs, p.a), loopK(z => cmul(poly(cs)(z), cinv(csub(z, [p.a, 0]))), p.c, p.r)];
  },
  /* q24c: integrate numerically to get the meter reading; f(a) = reading ÷ 2; then solve a² + s a + ga = f(a) for s. */
  q24c: p => {
    const f = poly([p.ga, p.s, 1]);
    const k = loopK(z => cmul(f(z), cinv(csub(z, [p.a, 0]))), p.c, p.r), fa = k / 2;
    return [r6(fa), r6((fa - p.a * p.a - p.ga) / p.a)];
  },
  /* q24d: f = al z³ + be z² + ga z + de over (z − a); m laps (negative = clockwise). */
  q24d: p => {
    const cs = [p.de, p.ga, p.be, p.al], a = [p.a, 0];
    return [fval(cs, p.a), p.m * turns(a, p.c, p.r), p.m * loopK(z => cmul(poly(cs)(z), cinv(csub(z, a))), p.c, p.r)];
  },
  /* q25b: f = c3 z³ + c1 z + c0 over (z − a)^(n+1) (n is the derivative order, one less than the power on the bottom). */
  q25b: p => {
    const cs = [p.c0, p.c1, 0, p.c3];
    return [p.n, deriv(cs, p.a, p.n), loopK(z => cmul(poly(cs)(z), cpow(csub(z, [p.a, 0]), -(p.n + 1))), p.c, p.r)];
  },
  /* q25c: f over (z − a)² plus f over (z − a)³ round |z| = R. */
  q25c: p => {
    const cs = [p.c0, p.c1, p.c2, p.c3], a = [p.a, 0];
    const F = z => { const f = poly(cs)(z), w = csub(z, a), i2 = cpow(w, -2), i3 = cpow(w, -3), x = cmul(f, i2), y = cmul(f, i3); return [x[0] + y[0], x[1] + y[1]]; };
    return [deriv(cs, p.a, 1), deriv(cs, p.a, 2), loopK(F, 0, p.R)];
  },
  /* q25d: quartic f over (z − a)^(n+1) (n is the derivative order, one less than the power on the bottom). */
  q25d: p => {
    const cs = [p.c0, p.c1, p.c2, p.c3, p.c4];
    return [p.n, deriv(cs, p.a, p.n), loopK(z => cmul(poly(cs)(z), cpow(csub(z, [p.a, 0]), -(p.n + 1))), p.c, p.r)];
  },
});
})();
