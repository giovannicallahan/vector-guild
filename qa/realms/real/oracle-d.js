/* Independent oracles for Real analysis learn missions, file d: q31–q40 (game/realms/real/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
Object.assign(window.ORACLE, {
  /* f = x² (kind 0), x³ (kind 1) or 20 − x² (kind 2) on [a, b]; kind is only an index into those three texts, and the
     tolerance printed is m ÷ 100. U − L is built by sampling every piece on a fine grid for its true min and max
     (no monotone shortcut); the smallest n is found by binary search on that U − L (strict, with a tiny margin so a
     tie does not count). */
  q31: p => {
    const f = [x => x * x, x => x * x * x, x => 20 - x * x][p.kind];
    const gap = n => {
      let s = 0;
      const w = (p.b - p.a) / n;
      for (let i = 0; i < n; i++) {
        let lo = Infinity, hi = -Infinity;
        for (let j = 0; j <= 8; j++) { const v = f(p.a + (i + j / 8) * w); if (v < lo) lo = v; if (v > hi) hi = v; }
        s += (hi - lo) * w;
      }
      return s;
    };
    const tol = p.m / 100;
    let lo = 1, hi = 200000;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (gap(mid) < tol - 1e-9) hi = mid; else lo = mid + 1; }
    return [gap(p.n0), lo];
  },
  /* f(t) = (t − h)² + k on [b, c]. The certified totals are the integrals from 0, so the middle piece is the
     difference of two cumulative areas (area up to x = x³/3 − h x² + (h² + k) x); m and M are found by scanning the
     interval in steps of 0.001. */
  q32: p => {
    const area = x => x * x * x / 3 - p.h * x * x + (p.h * p.h + p.k) * x;
    const piece = area(p.c) - area(p.b);
    let m = Infinity, M = -Infinity;
    const steps = Math.round((p.c - p.b) * 1000);
    for (let i = 0; i <= steps; i++) {
      const t = p.b + i / 1000, v = (t - p.h) * (t - p.h) + p.k;
      if (v < m) m = v; if (v > M) M = v;
    }
    return [Math.round(piece), Math.round(m * (p.c - p.b)), Math.round(M * (p.c - p.b))];
  },
  /* Rate p before s, q after s, one stray reading r at s (r does not enter any integral). F is a midpoint sum with
     step 0.001; differentiability is tested by comparing the one-sided difference quotients of F at s. */
  q33: p => {
    const rate = t => (t < p.s ? p.p : t > p.s ? p.q : p.r);
    const F = x => { let s = 0; const n = Math.round(x * 1000); for (let i = 0; i < n; i++) s += rate((i + 0.5) / 1000) / 1000; return s; };
    const h = 0.001, left = (F(p.s) - F(p.s - h)) / h, right = (F(p.s + h) - F(p.s)) / h;
    return [Math.round(F(p.s)), Math.round(F(p.x1)), Math.abs(left - right) < 1e-6 ? 1 : 0];
  },
  /* Sum of c ÷ nᵖ. After N terms the tail (n > N) lies between the integral of c ÷ xᵖ from N+1 and that integral plus
     the first omitted term. The integral is done by the substitution u = 1 ÷ x, which turns it into the integral of
     c uᵖ⁻² from 0 to 1 ÷ (N+1), evaluated with Simpson's rule (exact up to cubes). */
  q34: p => {
    let head = 0;
    for (let n = 1; n <= p.N; n++) head += p.c / Math.pow(n, p.p);
    const top = 1 / (p.N + 1), g = u => p.c * Math.pow(u, p.p - 2);
    const integral = top / 6 * (g(0) + 4 * g(top / 2) + g(top));
    const R = x => Math.round(x * 1000) / 1000;
    return [R(head + integral), R(head + integral + p.c / Math.pow(p.N + 1, p.p))];
  },
  /* fₙ(x) = (B + K n x) ÷ (1 + n x). xi and wi are only indexes into the printed lists of x and tolerance values:
     x ∈ [0.5, 0.25, 0.2, 0.1, 2, 3, 1.5], tolerance ∈ [0.5, 0.2, 0.1, 0.05, 0.02, 0.01]. The limit at x is read from
     fₙ at a huge n; N is one more than the last n (scanned up to 50000) whose error reaches the tolerance. */
  q35: p => {
    const x = [0.5, 0.25, 0.2, 0.1, 2, 3, 1.5][p.xi], eps = [0.5, 0.2, 0.1, 0.05, 0.02, 0.01][p.wi];
    const fn = (n, t) => (p.B + p.K * n * t) / (1 + n * t);
    const lim = r6(fn(1e12, x));
    let last = 0;
    for (let n = 1; n <= 50000; n++) if (Math.abs(fn(n, x) - lim) >= eps - 1e-12) last = n;
    return [fn(5, 0), r6(lim), last + 1];
  },
  /* fₙ(x) = A x ÷ (1 + n x²), limit 0. The sup norm is the highest value of fₙ, found by ternary search (fₙ rises
     then falls, so it has one peak); the smallest N comes from binary search because the norm shrinks as n grows.
     e is only an index into the printed tolerance: tolerance = e ÷ 100. */
  q36: p => {
    const norm = n => {
      const f = x => p.A * x / (1 + n * x * x);
      let a = 0, b = 50;
      for (let i = 0; i < 300; i++) { const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3; if (f(m1) < f(m2)) a = m1; else b = m2; }
      return f((a + b) / 2);
    };
    const tol = p.e / 100;
    let lo = 1, hi = 2000000;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (norm(mid) < tol - 1e-10) hi = mid; else lo = mid + 1; }
    return [norm(p.n0), lo];
  },
  /* g(x) = A + Σ c cos(2πkx) ÷ bᵏ with c = m(b − 1) (the printed numerator; m is the M-test total, read off the
     printed texts). Mₖ = c ÷ bᵏ summed term by term; the tail beyond N terms likewise; the integral of g over [0, L]
     with L = L2 ÷ 2 is A L plus each term's sin(2πkL) ÷ (2πk) times its weight. */
  q37: p => {
    const c = p.m * (p.b - 1), L = p.L2 / 2;
    let total = 0, tail = 0, integ = p.A * L;
    for (let k = 1; k <= 80; k++) {
      const M = c / Math.pow(p.b, k);
      total += M; if (k > p.N) tail += M;
      integ += M * Math.sin(2 * Math.PI * k * L) / (2 * Math.PI * k);
    }
    return [r6(total), r6(tail), r6(integ)];
  },
  /* Σ c (x − x0)ᵏ ÷ bᵏ. Radius from the ratio of neighbouring coefficients at k = 40; on [x0 − r, x0 + r] the term is
     at most c (r ÷ b)ᵏ, summed over 600 terms. */
  q38: p => {
    const a = k => p.c / Math.pow(p.b, k);
    let s = 0;
    for (let k = 0; k < 600; k++) s += p.c * Math.pow(p.r / p.b, k);
    return [r6(a(40) / a(41)), r6(s)];
  },
  /* kind is an index: 0 euclidean, 1 taxicab, 2 maximum, 3 discrete. Q = P + (dx, dy); the ball test is d < rho. */
  q39: p => {
    const ax = Math.abs(p.dx), ay = Math.abs(p.dy);
    let d;
    if (p.kind === 0) d = Math.sqrt(ax * ax + ay * ay);
    else if (p.kind === 1) d = ax + ay;
    else if (p.kind === 2) d = Math.max(ax, ay);
    else d = (ax === 0 && ay === 0) ? 0 : 1;
    return [r6(d), d < p.rho - 1e-9 ? 1 : 0];
  },
  /* Σ c (−1)ᵏ xᵏ ÷ bᵏ: radius by the ratio of coefficient sizes; on [−r, r] each term is at most c (r ÷ b)ᵏ.
     ti is an index into the printed legs: (3,4), (4,3), (6,8), (8,6), (5,12), (12,5); su and sv are only signs. */
  q40: p => {
    const a = k => p.c / Math.pow(p.b, k);
    let s = 0;
    for (let k = 0; k < 600; k++) s += p.c * Math.pow(p.r / p.b, k);
    const legs = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]][p.ti];
    return [r6(a(40) / a(41)), r6(s), r6(Math.sqrt(legs[0] * legs[0] + legs[1] * legs[1]))];
  },
});
})();
