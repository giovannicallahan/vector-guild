/* Independent oracles for Real analysis learn missions, file b: q11–q20 (game/realms/real/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Shared helpers. Inequalities with decimal tolerances are compared in integers to avoid float ties. */
const sumTo = (f, a, b) => { let s = 0; for (let n = a; n <= b; n++) s += f(n); return s; };
const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
/* 1 when the sizes' sum settles (a long sum barely moves when ten times as many terms are added), else 0. */
const sizesConverge = f => (Math.abs(sumTo(f, 1, 1e5) - sumTo(f, 1, 1e4)) < 0.01 * f(1) ? 1 : 0);
/* Largest d with |h(x) − L| < eps for every x with 0 < |x − c| < d. h is sampled across both sides of c and the
   largest d (the open interval's edge may sit exactly on eps) is found by bisection. */
const largestDelta = (h, c, L, eps) => {
  const ok = d => {
    for (let i = 1; i <= 200; i++) for (const s of [-1, 1]) if (Math.abs(h(c + s * d * i / 200) - L) > eps + 1e-9) return false;
    return true;
  };
  let lo = 0, hi = 50;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (ok(mid)) lo = mid; else hi = mid; }
  return lo;
};
Object.assign(window.ORACLE, {
  /* A: xₙ = (a n + b) ÷ (n + d), tolerance e. B: zₙ = c + r(−1)ⁿ + s ÷ n. L is read off a very late term; N is the
     last n whose distance from L is not below e, plus one (integer test: |top − L(n + d)| × 1000 < E(n + d)).
     limsup is the larger of the late even-term and late odd-term values. */
  q11: p => {
    const L = Math.round(((p.a * 1e12 + p.b) / (1e12 + p.d)) * 1e6) / 1e6;
    const E = Math.round(p.e * 1000);
    let last = 0;
    for (let n = 1; n <= 200000; n++) if (!(Math.abs((p.a * n + p.b) - L * (n + p.d)) * 1000 < E * (n + p.d))) last = n;
    const z = n => p.c + p.r * (n % 2 ? -1 : 1) + p.s / n;
    const ls = Math.round(Math.max(z(1e8), z(1e8 + 1)) * 1e6) / 1e6;
    return [L, last + 1, ls];
  },
  /* xₙ = c + k ÷ n. Gap taken from the two readings. A tail from N on has gaps |k/m − k/n| that creep up towards
     k ÷ N (take m = N and n huge) without reaching it, so N works exactly when k ÷ N ≤ e. */
  q12: p => {
    const x = n => p.c + p.k / n;
    const E = Math.round(p.e * 10000);
    let N = 1;
    while (!(p.k * 10000 <= E * N)) N++;
    return [Math.abs(x(p.u) - x(p.v)), N];
  },
  /* Sum of the corrections by adding terms. tel: n-th term K ÷ (n(n + 1)) with K = m(N + 1); geo: first term
     m(q − 1)q^(N−1), each term the previous divided by q. (m is a multiplier the prompt's numbers come from; both
     formulas were checked against the printed prompts.) Sums run far out, with a half-step tail estimate for tel. */
  q13: p => {
    let term, tailExtra = 0, M;
    if (p.kind === 'tel') {
      const K = p.m * (p.N + 1);
      term = n => K / (n * (n + 1)); M = 2e4; tailExtra = K / (M + 0.5);
    } else {
      const a = p.m * (p.q - 1) * Math.pow(p.q, p.N - 1);
      term = n => a / Math.pow(p.q, n - 1); M = 400;
    }
    return [sumTo(term, 1, p.N), sumTo(term, p.N + 1, M) + tailExtra];
  },
  /* aₙ = (−1)ⁿ⁺¹ c ÷ nᵖ. Absolute convergence by watching whether the sum of sizes keeps growing; s_N added directly. */
  q14: p => {
    const a = n => (n % 2 ? 1 : -1) * p.c / Math.pow(n, p.p);
    return [sizesConverge(n => Math.abs(a(n))), sumTo(a, 1, p.N)];
  },
  /* geo: aₙ = k ÷ (qⁿ + c), bₙ = k ÷ qⁿ. tel: aₙ = k ÷ (n² + cn), bₙ = k ÷ (n² + n). Sum of b by adding terms (with a
     half-step tail estimate for tel); sharper bound = exact a₁ + (sum of b − b₁). */
  q15: p => {
    let a1, b, tail = 0, M;
    if (p.kind === 'geo') { a1 = p.k / (p.q + p.c); b = n => p.k / Math.pow(p.q, n); M = 300; }
    else { a1 = p.k / (1 + p.c); b = n => p.k / (n * n + n); M = 2e4; tail = p.k / (M + 0.5); }
    const total = sumTo(b, 1, M) + tail;
    return [total, a1 + (total - b(1))];
  },
  /* aₙ = n^k pⁿ ÷ qⁿ. Ratio |aₙ₊₁ ÷ aₙ| evaluated at a huge n, then written as the fraction with the smallest
     denominator that matches; below 1 means the ratio test shows convergence. Series B: smallest N with
     c ÷ (N + 1) < e, tested in integers. */
  q16: p => {
    const n = 1e9;
    const r = Math.pow((n + 1) / n, p.k) * p.p / p.q;
    let num = 0, den = 0;
    for (let d = 1; d <= 200 && !den; d++) if (Math.abs(r * d - Math.round(r * d)) < 1e-5) { num = Math.round(r * d); den = d; }
    const g = gcd(num, den);
    const E = Math.round(p.e * 10000);
    let N = 1;
    while (!(p.c * 10000 < E * (N + 1))) N++;
    return [num / g, den / g, r < 1 ? 1 : 0, N];
  },
  /* cₙ = (−1)ⁿ⁺¹ k ÷ (n + d)ᵖ. Absolute convergence from the sum of sizes. The prompt's term count is N = M − d − 1
     (M is the generator's cut-off; it matches every printed prompt), and the alternating-series bound is the size of
     the next term, the (N + 1)th. */
  q17: p => {
    const size = n => p.k / Math.pow(n + p.d, p.p);
    const N = p.M - p.d - 1;
    return [sizesConverge(size), size(N + 1)];
  },
  /* f(x) = mx + b near c, tolerance e; g(x) = x² near c2 with tolerance eps = (c2 + dl)² − c2² (matches every printed
     prompt; dl is the generator's nominal step, the answer is found by bisection, not read from dl). */
  q18: p => {
    const f = x => p.m * x + p.b, g = x => x * x;
    const eps = Math.pow(p.c2 + p.dl, 2) - p.c2 * p.c2;
    return [largestDelta(f, p.c, f(p.c), p.e), largestDelta(g, p.c2, g(p.c2), eps)];
  },
  /* f(x) = mx + b, test at c, xₙ = c + (−1)ⁿ k ÷ n (j is the index asked for). delta by bisection; the smallest n
     is one past the last n whose output differs from f(c) by e or more (integer test, e in thousandths). */
  q19: p => {
    const f = x => p.m * x + p.b;
    const x = n => p.c + (n % 2 ? -1 : 1) * p.k / n;
    const E = Math.round(p.e * 1000);
    let last = 0;
    for (let n = 1; n <= 20000; n++) if (!(Math.abs(p.m) * p.k * 1000 < E * n)) last = n;
    return [f(x(p.j)), largestDelta(f, p.c, f(p.c), p.e), last + 1];
  },
  /* Left law a x + b, right law x² + q, value v at c. Limits are read just either side of c. Equal limits that also
     equal v: continuous (0); equal limits but v different: removable (1); unequal limits: jump (2).
     (kind is only the generator's label for which case it drew.) */
  q20: p => {
    const left = Math.round((p.a * (p.c - 1e-9) + p.b) * 1e6) / 1e6;
    const right = Math.round(((p.c + 1e-9) * (p.c + 1e-9) + p.q) * 1e6) / 1e6;
    const code = left !== right ? 2 : (left === p.v ? 0 : 1);
    return [left, right, code];
  },
});
})();
