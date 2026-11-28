/* Independent oracles for Real analysis learn missions, file c: q21–q30 (game/realms/real/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const r9 = x => Math.round(x * 1e9) / 1e9;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* Lagrange bound M x^(n+1) / (n+1)! as an exact reduced fraction, from the prompt's constant M (1 for sin and cos,
   3 for e^x on [0, 1]) and the point x (a whole number). */
const bound = (M, x, n) => {
  let num = M * Math.pow(x, n + 1), den = 1;
  for (let k = 2; k <= n + 1; k++) den *= k;
  const g = gcd(num, den);
  return [num / g, den / g];
};
const Mof = fn => fn === 'exp' ? 3 : 1;
/* Smallest degree n whose bound is below e: test degrees 0, 1, 2, ... comparing M x^(n+1) with e (n+1)!. */
const firstDegree = (fn, x, e) => {
  for (let n = 0; n < 60; n++) {
    const [a, b] = bound(Mof(fn), x, n);
    if (a < e * b) return n;
  }
  return NaN;
};
/* Largest mean-value change: the prompt's drift limit is M tenths (a parameter that is only a count of tenths). */
const drift = p => (p.M / 10) * (p.b - p.a);

Object.assign(window.ORACLE, {
  /* f(x) = x^p − c on [a, a + L] (p, c, a, L are the power, constant, left end and length). Run real bisection:
     evaluate f at midpoints, keep the half with opposite signs, until the length is below ε; record the interval after two halvings. */
  q21: p => {
    const f = x => Math.pow(x, p.p) - p.c;
    let lo = p.a, hi = p.a + p.L, k = 0, two = null;
    while (hi - lo >= p.e && k < 100) {
      const m = (lo + hi) / 2;
      if (f(lo) * f(m) < 0) hi = m; else lo = m;
      k++;
      if (k === 2) two = [lo, hi];
    }
    return [k, two[0], two[1]];
  },
  /* f(x) = x² + p x on [a, b]. The smallest K is the supremum of the difference quotients; for a quadratic the
     quotient is x + y + p, so sample |x + y + p| over all pairs on a fine grid including both ends, take the largest,
     and round to the whole number it approaches. δ = ε ÷ K, where ε = d·K is the prompt's tolerance (d is δ). */
  q22: p => {
    const f = x => x * x + p.p * x;
    const N = 200, xs = [];
    for (let i = 0; i <= N; i++) xs.push(p.a + (p.b - p.a) * i / N);
    let K = 0;
    for (let i = 0; i <= N; i++) for (let j = i + 1; j <= N; j++) {
      const q = Math.abs((f(xs[i]) - f(xs[j])) / (xs[i] - xs[j]));
      if (q > K) K = q;
    }
    K = Math.round(K);
    const eps = p.d * K;
    return [K, eps / K];
  },
  /* T(x) = m x + t0: |T(x) − T(x₀)| = |m||x − x₀| < ε, with ε = |m| d as printed, gives δ = ε ÷ |m|.
     g(x) = x² + u (x < s), g(s) = z, right piece v x + w with w chosen so the right limit is s² + u + j. Classify
     from the one-sided limits and g(s). h(x) = x² + p x on [a, b]: largest |x + y + p| over x, y in the interval. */
  q23: p => {
    const eps = Math.abs(p.m) * p.d;
    const delta = eps / Math.abs(p.m);
    const left = p.s * p.s + p.u;
    const w = left + p.j - p.v * p.s;
    const right = p.v * p.s + w;
    let code;
    if (Math.abs(left - right) > 1e-9) code = 2;
    else code = Math.abs(p.z - left) < 1e-9 ? 0 : 1;
    let K = 0;
    for (let i = 0; i <= 400; i++) K = Math.max(K, Math.abs(2 * (p.a + (p.b - p.a) * i / 400) + p.p));
    return [delta, code, Math.round(K)];
  },
  /* kind 'pw': f = x² + p x + q for x < c, m x + k for x ≥ c, with k fixed by the pieces meeting at c.
     kind 'abs': f = a|x − c| + b x + d0. Difference quotients are linear in h here, so two small steps are extrapolated to h → 0. */
  q24: p => {
    let f;
    if (p.kind === 'abs') f = x => p.a * Math.abs(x - p.c) + p.b * x + p.d0;
    else {
      const k = (p.c * p.c + p.p * p.c + p.q) - p.m * p.c;
      f = x => x < p.c ? x * x + p.p * x + p.q : p.m * x + k;
    }
    const dq = h => (f(p.c + h) - f(p.c)) / h;
    const lim = s => r9(2 * dq(s * 1e-6 / 2) - dq(s * 1e-6));
    const L = lim(-1), R = lim(1);
    return [L, R, Math.abs(L - R) < 1e-6 ? 1 : 0];
  },
  /* f(x) = x³ + p x² + q x on [a, b]. The slope comes from the two end values; c is found by bisection on each side
     of the vertex of f′(x) − slope (f′ = 3x² + 2p x + q), keeping the root strictly inside (a, b). */
  q25: p => {
    const f = x => x * x * x + p.p * x * x + p.q * x;
    const slope = (f(p.b) - f(p.a)) / (p.b - p.a);
    const g = x => 3 * x * x + 2 * p.p * x + p.q - slope;
    const v = -p.p / 3, roots = [];
    for (const [l0, h0] of [[Math.min(p.a, v), v], [v, Math.max(p.b, v)]]) {
      let lo = l0, hi = h0;
      if (hi - lo < 1e-12 || g(lo) * g(hi) > 0) continue;
      for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; }
      const r = (lo + hi) / 2;
      if (r > p.a + 1e-7 && r < p.b - 1e-7) roots.push(r);
    }
    return [r9(slope), r9(roots[0])];
  },
  /* |f′| ≤ M/10 on [a, b]: the largest change is the limit times the length (a drift of exactly that rate reaches it). */
  q26: p => { const ch = drift(p); return [ch, p.r0 - ch, p.r0 + ch]; },
  /* Bound M x^(n0+1) ÷ (n0+1)! reduced to lowest terms, then the first degree n (0, 1, 2, ...) whose bound is below e. */
  q27: p => { const [a, b] = bound(Mof(p.fn), p.x, p.n0); return [a, b, firstDegree(p.fn, p.x, p.e)]; },
  /* f(x) = x^deg + b x + c0, reading y = f(x0). Find x₀ by searching whole numbers for f(x) = y; f′(x₀) by a
     symmetric difference; (f⁻¹)′(y) from the inverse found by bisection (f is increasing) at y ± a small step. */
  q28: p => {
    const f = x => Math.pow(x, p.deg) + p.b * x + p.c0;
    const y = f(p.x0);
    let x0 = null;
    for (let t = -50; t <= 50; t++) if (f(t) === y) { x0 = t; break; }
    const fp = Math.round((f(x0 + 1e-5) - f(x0 - 1e-5)) / 2e-5);
    const inv = yy => { let lo = -50, hi = 50; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) < yy) lo = m; else hi = m; } return (lo + hi) / 2; };
    const h = 1e-3;
    return [x0, fp, (inv(y + h) - inv(y - h)) / (2 * h)];
  },
  /* Largest change M/10 × (b − a); then the first degree n whose Lagrange bound M x^(n+1) ÷ (n+1)! is below e. */
  q29: p => [drift(p), firstDegree(p.fn, p.x, p.e)],
  /* Burn rate on [min, max] of pts. kind sq+: s x² + k; sq−: k − s x²; lin+: s x + k; lin−: k − s x. For each piece
     sample the rate on a fine grid (ends included); lower sum adds smallest × length, upper sum largest × length. */
  q30: p => {
    const f = { 'sq+': x => p.s * x * x + p.k, 'sq−': x => p.k - p.s * x * x, 'lin+': x => p.s * x + p.k, 'lin−': x => p.k - p.s * x }[p.kind];
    let L = 0, U = 0;
    for (let i = 0; i + 1 < p.pts.length; i++) {
      const a = p.pts[i], b = p.pts[i + 1];
      let mn = Infinity, mx = -Infinity;
      for (let j = 0; j <= 1000; j++) { const v = f(a + (b - a) * j / 1000); mn = Math.min(mn, v); mx = Math.max(mx, v); }
      L += mn * (b - a); U += mx * (b - a);
    }
    return [Math.round(L * 1e6) / 1e6, Math.round(U * 1e6) / 1e6];
  }
});
})();
