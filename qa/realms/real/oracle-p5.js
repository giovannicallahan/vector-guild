/* Independent oracles for Real analysis practice missions, file 5 of 8: q21b–q25d (game/realms/real/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const gcd = (x, y) => y ? gcd(y, x % y) : x, lcm = (x, y) => x / gcd(x, y) * y;
const r6 = x => Math.round(x * 1e6) / 1e6;
const r4 = x => Math.round(x * 1e4) / 1e4;
/* Whole halvings k with length L ÷ 2^k strictly below e, by integer comparison in millionths (no float ties). */
const halvingsFor = (L, e) => { let k = 0; const Lm = Math.round(L * 1e6), em = Math.round(e * 1e6); while (Lm >= em * Math.pow(2, k)) k++; return k; };
/* Bisection on [lo, hi] of f (f(lo) and f(hi) of opposite signs) for `steps` halvings; NaN if a midpoint is an exact zero. */
const bisect = (f, lo, hi, steps) => {
  for (let i = 0; i < steps; i++) {
    const mid = (lo + hi) / 2, fm = f(mid), fl = f(lo);
    if (Math.abs(fm) < 1e-12) return [NaN, NaN];
    if ((fl < 0) !== (fm < 0)) hi = mid; else lo = mid;
  }
  return [r6(lo), r6(hi)];
};
/* Smallest K with |f(x)-f(y)| <= K|x-y|: the largest secant slope over a grid of points, with tiny-gap secants at each grid point. */
const lip = (f, a, b) => {
  let K = 0; const N = 800, g = 1e-6;
  for (let i = 0; i <= N; i++) {
    const x = a + (b - a) * i / N, y = i === N ? x - g : x + g;
    K = Math.max(K, Math.abs((f(y) - f(x)) / (y - x)));
  }
  return r4(K);
};
/* Interior roots (strictly inside (a, b)) of g, by grid scan for sign changes then bisection. */
const interiorRoots = (g, a, b) => {
  const N = 20000, roots = []; let pv = g(a + (b - a) / N);
  if (Math.abs(pv) < 1e-9) roots.push(a + (b - a) / N);
  for (let i = 2; i < N; i++) {
    const px = a + (b - a) * (i - 1) / N, x = a + (b - a) * i / N, v = g(x);
    if (Math.abs(v) < 1e-9) roots.push(x);
    else if (Math.abs(pv) >= 1e-9 && pv * v < 0) {
      let lo = px, hi = x;
      for (let j = 0; j < 80; j++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; }
      roots.push((lo + hi) / 2);
    }
    pv = v;
  }
  return roots;
};
/* One-sided difference quotients at c with a tiny h, snapped to 4 decimals. */
const quot = (f, c, h) => r4((f(c + h) - f(c)) / h);

Object.assign(window.ORACLE, {
  /* f(x) = x² - c on [a, a+L]. a = left end, L = length, c = constant, e = tolerance. */
  q21b: p => {
    const f = x => x * x - p.c, k = halvingsFor(p.L, p.e), [lo, hi] = bisect(f, p.a, p.a + p.L, 2);
    return [k, lo, hi];
  },
  /* f(x) = x³ + x - c on [a, a+L]; two end readings plus one per halving; m minutes per reading. */
  q21c: p => {
    const k = halvingsFor(p.L, p.e), readings = 2 + k;
    return [k, readings, readings * p.m];
  },
  /* f(x) = x^p - c on [a, a+L]; three halvings. */
  q21d: p => {
    const f = x => Math.pow(x, p.p) - p.c, k = halvingsFor(p.L, p.e), [lo, hi] = bisect(f, p.a, p.a + p.L, 3);
    return [k, lo, hi];
  },
  /* f(x) = x² + p x on [a, b]. d is the delta the prompt's epsilon was built from: epsilon = K × d. */
  q22b: p => {
    const f = x => x * x + p.p * x, K = lip(f, p.a, p.b), eps = r6(K * p.d);
    return [K, r6(eps / K)];
  },
  /* f(x) = x² + p x on [a, b]; delta = d3 ÷ 1000 (epsilon = K × delta); count equal steps by search. */
  q22c: p => {
    const f = x => x * x + p.p * x, K = lip(f, p.a, p.b), delta = p.d3 / 1000, eps = r6(K * delta);
    let n = 1; while ((p.b - p.a) * 1000 >= p.d3 * n) n++;
    return [K, r6(eps / K), n];
  },
  /* f(x) = A x² + p x on [lo, hi]; epsilon = K × d; the bound is K × d2. */
  q22d: p => {
    const f = x => p.A * x * x + p.p * x, K = lip(f, p.lo, p.hi), eps = r6(K * p.d);
    return [K, r6(eps / K), r6(K * p.d2)];
  },
  /* T(x) = m x + k with epsilon = |m| × dd/1000 (dd is only an index for the printed epsilon); g has left piece x² + u,
     value val at c, and right piece s x + t whose limit is the left limit plus gap when kind = 2 (else equal); h = x² + p x on [a, b]. */
  q23b: p => {
    const eps = r6(Math.abs(p.m) * p.dd / 1000), delta = r6(eps / Math.abs(p.m));
    const L = p.c * p.c + p.u, R = L + (p.kind === 2 ? p.gap : 0), t = R - p.s * p.c;
    const right = p.s * p.c + t, gc = p.kind === 0 ? L : p.val;
    const code = Math.abs(L - right) > 1e-9 ? 2 : (Math.abs(gc - L) > 1e-9 ? 1 : 0);
    return [delta, code, lip(x => x * x + p.p * x, p.a, p.b)];
  },
  /* T(x) = m x + k; epsilon = lcm(|m|, K) × d0 (read off the printed epsilons: it makes both deltas short decimals); h = x² + p x on [a, b]; common = smaller of eps/|m| and eps/K. */
  q23c: p => {
    const K = lip(x => x * x + p.p * x, p.a, p.b), eps = r6(lcm(Math.abs(p.m), Math.round(K)) * p.d0), sensor = r6(eps / Math.abs(p.m));
    return [sensor, K, r6(Math.min(sensor, eps / K))];
  },
  /* T(x) = m x + k, epsilon = |m| × dd/1000; g left piece x² + v x + u, value val at c, right piece s x + t whose limit is
     the left limit plus gap when kind = 2; h = x² + p x on [a, b]. */
  q23d: p => {
    const eps = r6(Math.abs(p.m) * p.dd / 1000), delta = r6(eps / Math.abs(p.m));
    const L = p.c * p.c + p.v * p.c + p.u, R = L + (p.kind === 2 ? p.gap : 0), t = R - p.s * p.c;
    const right = p.s * p.c + t, gc = p.kind === 0 ? L : p.val;
    const code = Math.abs(L - right) > 1e-9 ? 2 : (Math.abs(gc - L) > 1e-9 ? 1 : 0);
    return [delta, code, r6(Math.abs(right - L)), lip(x => x * x + p.p * x, p.a, p.b)];
  },
  /* Left piece s x + t (continuous at c), right piece x² + p x + r. t is fixed by continuity. */
  q24b: p => {
    const right = x => x * x + p.p * x + p.r, t = right(p.c) - p.s * p.c;
    const f = x => x < p.c ? p.s * x + t : right(x);
    const h = 1e-7, left = quot(f, p.c, -h), rt = quot(f, p.c, h);
    return [left, rt, Math.abs(left - rt) < 1e-3 ? 1 : 0];
  },
  /* f(t) = a|t - c| + k t + r. */
  q24c: p => {
    const f = t => p.a * Math.abs(t - p.c) + p.k * t + p.r, h = 1e-6;
    const l = quot(f, p.c, -h), r = quot(f, p.c, h);
    return [l, r, r4(Math.abs(r - l))];
  },
  /* Left piece x³ + p x, right piece s x + t (continuous at c). */
  q24d: p => {
    const left = x => x * x * x + p.p * x, fc = left(p.c), t = fc - p.s * p.c;
    const f = x => x < p.c ? left(x) : p.s * x + t, h = 1e-7;
    const l = quot(f, p.c, -h), r = quot(f, p.c, h);
    return [fc, l, r, Math.abs(l - r) < 1e-3 ? 1 : 0];
  },
  /* f = x³ + p x² + q x + z on [a, b] with f(a) = f(b): q is forced by that equality. Then f'(c) = 0 by scan. */
  q25b: p => {
    let q = 0; for (let tries = 0; tries < 1; tries++) q = -((p.a * p.a + p.a * p.b + p.b * p.b) + p.p * (p.a + p.b));
    const f = x => x * x * x + p.p * x * x + q * x + p.z, fp = x => 3 * x * x + 2 * p.p * x + q;
    const roots = interiorRoots(fp, p.a, p.b);
    return [r6(f(p.a)), roots.length === 1 ? r6(roots[0]) : NaN];
  },
  /* f = x³ + p x² + q x on [a, b]; slope by secant, c by scan of f'(x) - slope inside (a, b). */
  q25c: p => {
    const f = x => x * x * x + p.p * x * x + p.q * x, fp = x => 3 * x * x + 2 * p.p * x + p.q;
    const slope = (f(p.b) - f(p.a)) / (p.b - p.a), roots = interiorRoots(x => fp(x) - slope, p.a, p.b);
    return [r6(slope), roots.length === 1 ? r6(roots[0]) : NaN, roots.length === 1 ? r6(f(roots[0])) : NaN];
  },
  /* f = A x³ + p x² + q x + z on [a, b]. */
  q25d: p => {
    const f = x => p.A * x * x * x + p.p * x * x + p.q * x + p.z, fp = x => 3 * p.A * x * x + 2 * p.p * x + p.q;
    const slope = (f(p.b) - f(p.a)) / (p.b - p.a), roots = interiorRoots(x => fp(x) - slope, p.a, p.b);
    return [r6(slope), roots.length === 1 ? r6(roots[0]) : NaN, r6(fp(p.b))];
  },
});
})();
