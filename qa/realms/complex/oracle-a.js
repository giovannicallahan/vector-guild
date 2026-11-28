/* Independent oracles for Complex analysis: the plane of numbers learn missions, file a: q01–q10 (game/realms/complex/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Small helpers: numbers are pairs [re, im]. */
const cmul = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]];
const cexp = u => [Math.exp(u[0]) * Math.cos(u[1]), Math.exp(u[0]) * Math.sin(u[1])];
const r2 = x => { const v = Math.round(x * 100 + (x < 0 ? -1e-9 : 1e-9)) / 100; return v === 0 ? 0 : v; };
/* Argument by search: the angle t in (−π, π] whose unit direction is closest to the point (fine grid, then refined). */
const argBySearch = (a, b) => {
  const dist = t => { const r = Math.hypot(a, b); return Math.hypot(r * Math.cos(t) - a, r * Math.sin(t) - b); };
  let best = 0, bd = Infinity;
  for (let i = -3141; i <= 3141; i++) { const d = dist(i / 1000); if (d < bd) { bd = d; best = i / 1000; } }
  let lo = best - 0.001, hi = best + 0.001;
  for (let i = 0; i < 80; i++) {
    const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
    if (dist(m1) < dist(m2)) hi = m2; else lo = m1;
  }
  return (lo + hi) / 2;
};
Object.assign(window.ORACLE, {
  /* z = a + bi, w = c + di. Multiply as two brackets in x with i standing for x, then set x² = −1; sum added termwise. */
  q01: p => {
    const prod = [p.a * p.c, p.a * p.d + p.b * p.c, p.b * p.d];
    return [p.a + p.c, p.b + p.d, prod[0] - prod[2], prod[1]];
  },
  /* z z̄ = a² + b². z ÷ w = x + yi is the number with (x + yi)(c + di) = a + bi: two linear equations in x and y,
     cx − dy = a and dx + cy = b, solved by Gaussian elimination (no formula for the quotient is used). */
  q02: p => {
    const m = [[p.c, -p.d, p.a], [p.d, p.c, p.b]];
    if (m[0][0] === 0) m.reverse();
    const f = m[1][0] / m[0][0];
    for (let j = 0; j < 3; j++) m[1][j] -= f * m[0][j];
    const y = m[1][2] / m[1][1], x = (m[0][2] - m[0][1] * y) / m[0][0];
    return [p.a * p.a + p.b * p.b, x, y];
  },
  /* Modulus from the distance to the origin; argument by searching for the direction angle, both rounded to 2 places. */
  q03: p => [r2(Math.hypot(p.a, p.b)), r2(argBySearch(p.a, p.b))],
  /* z = r e^(iθ), θ = kπ ÷ q (k, q are numbers in the angle). Read the point off the unit-circle direction at θ. */
  q04: p => {
    const th = p.k * Math.PI / p.q, z = cexp([Math.log(p.r), th]);
    return [r2(z[0]), r2(z[1])];
  },
  /* Multiply z by itself p times, one pass at a time. */
  q05: p => {
    let v = [1, 0];
    for (let i = 0; i < p.p; i++) v = cmul(v, [p.a, p.b]);
    return [v[0], v[1]];
  },
  /* z^p = w with |w| = rho^p and w at angle dir × 90° (dir is a quarter-turn index: 0 positive real, 1 on i, 2 negative
     real, 3 on −i). Roots sit at angles (dir·π/2 + 2πk) ÷ p; take the smallest angle in (0, 2π] and its real part. */
  q06: p => {
    const roots = [];
    for (let k = 0; k < p.p; k++) {
      let t = (p.dir * Math.PI / 2 + 2 * Math.PI * k) / p.p;
      while (t <= 1e-9) t += 2 * Math.PI;
      while (t > 2 * Math.PI + 1e-9) t -= 2 * Math.PI;
      roots.push(t);
    }
    const t0 = Math.min(...roots);
    return [roots.length, p.rho, r2(p.rho * Math.cos(t0))];
  },
  /* f(z) = z² + c, c = p + qi. Square z = x + yi as a product, add c, read parts. */
  q07: p => {
    const f = (x, y) => { const s = cmul([x, y], [x, y]); return [s[0] + p.p, s[1] + p.q]; };
    const a = f(p.x1, p.y1), b = f(p.x2, p.y2);
    return [a[0], a[1], b[0]];
  },
  /* y = kπ ÷ 6 + 2πj (k, j index the angle). e^z = e^x (cos y + i sin y). The equivalent angle in (0, 2π] is found by
     counting in twelfths of π: n = k + 12j twelfths-of-π/… i.e. n sixths of π, wrapped into 1..12. */
  q08: p => {
    const z = cexp([p.x, p.k * Math.PI / 6 + 2 * Math.PI * p.j]);
    let n = p.k + 12 * p.j;
    while (n <= 0) n += 12;
    while (n > 12) n -= 12;
    return [r2(Math.exp(p.x)), r2(z[0]), r2(n * Math.PI / 6)];
  },
  /* z = a + bi. Log z = ln|z| + i Arg z; ln |z| by halving a bracket (bisection on exp), Arg z by search. */
  q09: p => {
    const m = Math.hypot(p.a, p.b);
    let lo = -10, hi = 10;
    for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (Math.exp(mid) < m) lo = mid; else hi = mid; }
    return [r2((lo + hi) / 2), r2(argBySearch(p.a, p.b))];
  },
  /* i^(c i) = e^(c i · Log i) with Log i = iπ/2. (s·i·dir)^(h/2) = e^((h/2)(ln s + i dir π/2)): dir is ±1, the sign of the
     imaginary number; h is twice the exponent. v = e + f i is not zero, so v^(1/m) has the values e^((Log v + 2πik)/m);
     count the distinct ones over k = 0 … 3m. */
  q10: p => {
    const first = cexp(cmul([p.c, 0], cmul([0, 1], [0, Math.PI / 2])));
    const a = p.h / 2, second = cexp([a * Math.log(p.s), a * p.dir * Math.PI / 2]);
    const logv = [Math.log(Math.hypot(p.e, p.f)), argBySearch(p.e, p.f)];
    const seen = [];
    for (let k = 0; k <= 3 * p.m; k++) {
      const w = cexp([logv[0] / p.m, (logv[1] + 2 * Math.PI * k) / p.m]);
      if (!seen.some(s => Math.hypot(s[0] - w[0], s[1] - w[1]) < 1e-6)) seen.push(w);
    }
    return [r2(first[0]), r2(second[0]), seen.length];
  },
});
})();
