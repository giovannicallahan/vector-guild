/* Independent oracles for Complex analysis: the plane of numbers learn missions, file c: q21–q30 (game/realms/complex/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  /* Numerical contour integral of fn(re, im) -> [re, im] round the circle centre (cx, cy), radius r, driven `turns`
     times (negative = clockwise), trapezoid rule with many points. Returns the integral divided by πi, i.e. the k in
     "= kπi" (the real part of the integral is ~0 for every loop used here). */
  function kOfLoop(fn, cx, cy, r, turns) {
    const N = 20000 * Math.max(1, Math.abs(turns)), sgn = turns < 0 ? -1 : 1, T = 2 * Math.PI * Math.abs(turns);
    let sr = 0, si = 0;
    for (let j = 0; j < N; j++) {
      const t = T * j / N, th = sgn * t;
      const zr = cx + r * Math.cos(th), zi = cy + r * Math.sin(th);
      const dzr = -sgn * r * Math.sin(th) * (T / N), dzi = sgn * r * Math.cos(th) * (T / N);
      const [fr, fi] = fn(zr, zi);
      sr += fr * dzr - fi * dzi; si += fr * dzi + fi * dzr;
    }
    return Math.round(si / Math.PI * 1e6) / 1e6 + 0;
  }
  const div = (nr, ni, dr, di) => { const d = dr * dr + di * di; return [(nr * dr + ni * di) / d, (ni * dr - nr * di) / d]; };
  const mul = (ar, ai, br, bi) => [ar * br - ai * bi, ar * bi + ai * br];
  const powc = (zr, zi, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = mul(r[0], r[1], zr, zi); return r; };
  const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
  const round6 = x => Math.round(x * 1e6) / 1e6 + 0;

  Object.assign(window.ORACLE, {
    /* Both k values by integrating numerically once round |z| = R: C ÷ (z − (p + qi)) and z² ÷ (z − b). */
    q21: p => [
      kOfLoop((x, y) => div(p.C, 0, x - p.p, y - p.q), 0, 0, p.R, 1),
      kOfLoop((x, y) => { const s = mul(x, y, x, y); return div(s[0], s[1], x - p.b, y); }, 0, 0, p.R, 1),
    ],
    /* The cart's winding number by adding up the turning of the arrow from a to the cart (unwrapped angle) over the
       whole drive; k by integrating c ÷ (z − (p + qi)) numerically along the m-fold path. m is signed: negative = clockwise. */
    q22: p => {
      const N = 40000 * Math.abs(p.m), sgn = p.m < 0 ? -1 : 1, T = 2 * Math.PI * Math.abs(p.m);
      let prev = null, total = 0;
      for (let j = 0; j <= N; j++) {
        const th = sgn * T * j / N;
        const ang = Math.atan2(p.R * Math.sin(th) - p.q, p.R * Math.cos(th) - p.p);
        if (prev !== null) { let d = ang - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; total += d; }
        prev = ang;
      }
      const w = Math.round(total / (2 * Math.PI));
      const k = kOfLoop((x, y) => div(p.c, 0, x - p.p, y - p.q), 0, 0, p.R, p.m);
      return [w, k];
    },
    /* Both loops by numerical integration. Big loop: A ÷ (z − a) + B ÷ (z − b). Small loop about c:
       D ÷ (z − c)² + E ÷ (z − c) + F(z − c). */
    q23: p => [
      kOfLoop((x, y) => { const u = div(p.A, 0, x - p.a, y), v = div(p.B, 0, x - p.b, y); return [u[0] + v[0], u[1] + v[1]]; }, 0, 0, p.R, 1),
      kOfLoop((x, y) => {
        const w = [x - p.c, y], s = mul(w[0], w[1], w[0], w[1]);
        const u = div(p.D, 0, s[0], s[1]), v = div(p.E, 0, w[0], w[1]);
        return [u[0] + v[0] + p.F * w[0], u[1] + v[1] + p.F * w[1]];
      }, p.c, 0, p.r, 1),
    ],
    /* f(a) from the quadratic; k by integrating f(z) ÷ (z − a) numerically round |z − c| = r. */
    q24: p => {
      const f = (x, y) => { const s = mul(x, y, x, y); return [p.al * s[0] + p.be * x + p.ga, p.al * s[1] + p.be * y]; };
      return [p.al * p.a * p.a + p.be * p.a + p.ga, kOfLoop((x, y) => { const v = f(x, y); return div(v[0], v[1], x - p.a, y); }, p.c ? p.c : 0, 0, p.r, 1)];
    },
    /* n: the denominator is (z − a)^(n + 1), so n is one less than its power (n is read straight from the prompt).
       The derivative by differentiating the coefficient list n times; k by numerical integration round |z| = R. */
    q25: p => {
      let co = [p.c0, p.c1, p.c2, p.c3];
      for (let i = 0; i < p.n; i++) co = co.slice(1).map((c, j) => c * (j + 1));
      let d = 0; for (let j = co.length - 1; j >= 0; j--) d = d * p.a + co[j];
      const k = kOfLoop((x, y) => {
        const num = [p.c3 * powc(x, y, 3)[0] + p.c2 * powc(x, y, 2)[0] + p.c1 * x + p.c0,
                     p.c3 * powc(x, y, 3)[1] + p.c2 * powc(x, y, 2)[1] + p.c1 * y];
        const den = powc(x - p.a, y, p.n + 1);
        return div(num[0], num[1], den[0], den[1]);
      }, 0, 0, p.R, 1);
      return [p.n, d, k];
    },
    /* Bound = n! M ÷ R^n (Cauchy's inequality, worked from the factorial and powers). s only indexes the list of five
       claims (0 bounded ⇒ constant, 1 z² + 1, 2 f′ = 0, 3 polynomial, 4 f(5) = f(0)); by Liouville a bounded entire
       function is constant, so the claims about constants are true and the two about unbounded polynomials are false. */
    q26: p => [round6(fact(p.n) * p.M / Math.pow(p.R, p.n)), [1, 0, 1, 0, 1][p.s]],
    /* u = A(x² − y²) + Bxy + Cx + Dy + E. The value at (p + r, q); the ring average by sampling the ring at many points. */
    q27: p => {
      const u = (x, y) => p.A * x * x - p.A * y * y + p.B * x * y + p.C * x + p.D * y + p.E;
      const N = 3600; let s = 0;
      for (let j = 0; j < N; j++) { const th = 2 * Math.PI * j / N; s += u(p.p + p.r * Math.cos(th), p.q + p.r * Math.sin(th)); }
      return [u(p.p + p.r, p.q), round6(s / N)];
    },
    /* |z^n + c| sampled over the whole disc on a polar grid (radius steps of R/40, 10080 angles on the edge, a multiple
       of 2n so that z^n = ±R^n is hit exactly); the max and the edge minimum are read off the samples. */
    q28: p => {
      const val = (r, th) => { const zn = [Math.pow(r, p.n) * Math.cos(p.n * th), Math.pow(r, p.n) * Math.sin(p.n * th)]; return Math.hypot(zn[0] + p.c, zn[1]); };
      let best = 0, low = Infinity;
      for (let i = 0; i <= 40; i++) {
        const r = p.R * i / 40, M = i === 40 ? 10080 : 720;
        for (let j = 0; j < M; j++) {
          const v = val(r, 2 * Math.PI * j / M);
          if (v > best) best = v;
          if (i === 40 && v < low) low = v;
        }
      }
      return [round6(best), round6(low)];
    },
    /* First two by numerical integration round |z| = R of f(z) ÷ (z − a) and f(z) ÷ (z − a)²; the bound is
       m! M ÷ ρ^m (m is the order of the derivative asked for, read from the prompt). */
    q29: p => {
      const f = (x, y) => { const s = mul(x, y, x, y); return [p.al * s[0] + p.be * x + p.ga, p.al * s[1] + p.be * y]; };
      const k1 = kOfLoop((x, y) => { const v = f(x, y); return div(v[0], v[1], x - p.a, y); }, 0, 0, p.R, 1);
      const k2 = kOfLoop((x, y) => { const v = f(x, y), d = mul(x - p.a, y, x - p.a, y); return div(v[0], v[1], d[0], d[1]); }, 0, 0, p.R, 1);
      return [k1, k2, round6(fact(p.m) * p.M / Math.pow(p.rho, p.m))];
    },
    /* z = (a + bi) ÷ d. Add up 1 + z + z² + … term by term until the terms vanish. */
    q30: p => {
      const zr = p.a / p.d, zi = p.b / p.d;
      let tr = 1, ti = 0, sr = 0, si = 0;
      for (let i = 0; i < 2000000 && Math.hypot(tr, ti) > 1e-15; i++) {
        sr += tr; si += ti; [tr, ti] = mul(tr, ti, zr, zi);
      }
      return [Math.round(sr * 1e9) / 1e9 + 0, Math.round(si * 1e9) / 1e9 + 0];
    },
  });
})();
