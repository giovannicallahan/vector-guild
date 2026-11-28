/* Independent oracles for Real analysis practice missions, file 4 of 8: q16b–q20d (game/realms/real/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const SC = 1e6;
/* Strict test num/den < e, in integers scaled by 1e6 (no float ties). */
const below = (num, den, e) => Math.round(num * SC) < Math.round(e * SC) * den;
/* Smallest N >= 0 by counting up: first N for which the bound num/den(N) is below e. */
const firstN = (num, denOf, e) => { let N = 0; while (!below(num, denOf(N), e)) N++; return N; };
/* Lowest terms by trying every common factor. */
const lowest = (a, b) => { for (let f = Math.min(a, b); f > 1; f--) if (a % f === 0 && b % f === 0) { a /= f; b /= f; } return [a, b]; };
/* Largest delta so that |f(x) - L| < E on 0 < |x - pt| < delta: bisect on the biggest value |f - L| reaches on the
   interval (checked at both ends and at the listed turning points inside it). */
const largestDelta = (f, pt, L, E, turns) => {
  const sup = d => { const xs = [pt - d, pt + d]; for (const t of turns || []) if (t > pt - d && t < pt + d) xs.push(t);
    return Math.max(...xs.map(x => Math.abs(f(x) - L))); };
  let lo = 0, hi = 100; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (sup(mid) < E) lo = mid; else hi = mid; }
  return r6(lo);
};
Object.assign(window.ORACLE, {
  /* q16b: root test L = p/q (lowest terms, 1 if below 1); series B bound c ÷ (N + 1 + d) < e, found by counting N up. */
  q16b: p => {
    const [n, d] = lowest(p.p, p.q);
    return [n, d, n < d ? 1 : 0, firstN(p.c, N => N + 1 + p.d, p.e)];
  },
  /* q16c: c ÷ (N + 1)² < e by counting N up, then t minutes each. (K is only an index.) */
  q16c: p => { const N = firstN(p.c, N => (N + 1) * (N + 1), p.e); return [N, N * p.t]; },
  /* q16d: ratio test L = p/q (the (n + a) factor tends to 1); series B bound c ÷ ((N + 1)(N + 2)) < e. (K is only an index.) */
  q16d: p => {
    const [n, d] = lowest(p.p, p.q);
    return [n, d, n < d ? 1 : 0, firstN(p.c, N => (N + 1) * (N + 2), p.e)];
  },
  /* q17b: sizes k ÷ (m n + d) (kind 0, harmonic-like, diverges) or k ÷ (n² + d) (kind 1, converges); error bound is the next size. */
  q17b: p => {
    const size = n => p.kind === 0 ? p.k / (p.m * n + p.d) : p.k / (n * n + p.d);
    return [p.kind === 0 ? 0 : 1, r6(size(p.N + 1))];
  },
  /* q17c: sizes k ÷ (n + d)^p: p = 2 converges absolutely, p = 1 only conditionally; then count N up; minutes = t N. (K is only an index.) */
  q17c: p => {
    const N = firstN(p.k, N => Math.pow(N + 1 + p.d, p.p), p.e);
    return [p.p >= 2 ? 1 : 0, N, N * p.t];
  },
  /* q17d: sizes k ÷ (q^n + c) ≤ b_n = k ÷ q^n; sum b_n added term by term, the sharper bound swaps b_1 for |c_1|. */
  q17d: p => {
    let whole = 0, term = p.k / p.q; for (let i = 0; i < 400; i++) { whole += term; term /= p.q; }
    const c1 = p.k / (p.q + p.c);
    return [r6(whole), r6(c1 + whole - p.k / p.q), r6(p.k / (Math.pow(p.q, p.N + 1) + p.c))];
  },
  /* q18b: r(x) = x ÷ s + b near c, tolerance e; h(x) = x² near -c2 (limit c2²), tolerance E = dl (dl + 2 c2) as the prompt's number. */
  q18b: p => {
    const r = x => x / p.s + p.b, L1 = r(p.c);
    const E2 = r6(p.dl * (p.dl + 2 * p.c2));
    return [largestDelta(r, p.c, L1, p.e), largestDelta(x => x * x, -p.c2, p.c2 * p.c2, E2, [0])];
  },
  /* q18c: v = a x + b, w = k v + e0, limit w(c); first tolerance is |k a| d1 (the prompt's number); second answer is the
     biggest |w - w(c)| over |x - c| < d0. */
  q18c: p => {
    const w = x => p.k * (p.a * x + p.b) + p.e0, L = w(p.c);
    const E = r6(Math.abs(p.k * p.a) * p.d1);
    const eps = Math.max(Math.abs(w(p.c - p.d0) - L), Math.abs(w(p.c + p.d0) - L));
    return [largestDelta(w, p.c, L, E), r6(eps)];
  },
  /* q18d: f(x) = (p x + b) ÷ q near c with tolerance e; g = x² near c with tolerance dl (dl + 2 c); n found by counting up. */
  q18d: p => {
    const f = x => (p.p * x + p.b) / p.q, d1 = largestDelta(f, p.c, f(p.c), p.e);
    const d2 = largestDelta(x => x * x, p.c, p.c * p.c, r6(p.dl * (p.dl + 2 * p.c)), [0]);
    const m = Math.min(d1, d2); let n = 1; while (!(1 / n < m - 1e-12)) n++;
    return [d1, d2, n];
  },
  /* q19b: f = m x + b, x_n = c - k ÷ n²; tolerance E = |m| k ÷ K² (K only fixes the printed tolerance). */
  q19b: p => {
    const f = x => p.m * x + p.b, xn = n => p.c - p.k / (n * n), E = r6(Math.abs(p.m) * p.k / (p.K * p.K));
    let n = 1; while (!(Math.abs(f(xn(n)) - f(p.c)) < E - 1e-12)) n++;
    return [r6(f(xn(p.j))), largestDelta(f, p.c, f(p.c), E), n];
  },
  /* q19c: left piece m x + b; right piece m2 x + b2 with b2 chosen so its value at c is f(c) + J (J is the jump). */
  q19c: p => {
    const left = x => p.m * x + p.b, b2 = left(p.c) + p.J - p.m2 * p.c, right = x => p.m2 * x + b2;
    const f = x => x <= p.c ? left(x) : right(x), y = n => p.c + p.k / n;
    const lim = r6(f(p.c + p.k / 1e9));
    return [r6(f(y(p.j))), lim, Math.abs(lim - f(p.c)) < 1e-6 ? 1 : 0];
  },
  /* q19d: f = a x² + b, x_n = c + k ÷ n, tolerance a dl (dl + 2 c) (the prompt's number), c > 0. */
  q19d: p => {
    const f = x => p.a * x * x + p.b, E = r6(p.a * p.dl * (p.dl + 2 * p.c));
    let n = 1; while (!(Math.abs(f(p.c + p.k / n) - f(p.c)) < E - 1e-12)) n++;
    return [r6(f(p.c + p.k / p.j)), largestDelta(f, p.c, f(p.c), E, [0]), n];
  },
  /* q20b: left piece c-point value c² + q; right piece m p + b2 where b2 makes its value at c equal left + J; g(c) = v. */
  q20b: p => {
    const left = x => x * x + p.q, b2 = left(p.c) + p.J - p.m * p.c, right = x => p.m * x + b2;
    const L = r6(left(p.c - 1e-9)), R = r6(right(p.c + 1e-9));
    return [L, R, L !== R ? 2 : (r6(p.v) !== L ? 1 : 0)];
  },
  /* q20c: kind 1: left kx + b, right x² + q; kind 0: left a x + b, right x² + k. Match the two limits at c. */
  q20c: p => {
    if (p.kind === 1) {
      const known = p.c * p.c + p.q; let k = null; for (let t = -200; t <= 200; t += 1) if (t * p.c + p.b === known) k = t;
      return [known, k, k * (p.c - p.wd) + p.b];
    }
    const known = p.a * p.c + p.b; let k = null; for (let t = -400; t <= 400; t++) if (p.c * p.c + t === known) k = t;
    return [known, k, (p.c + p.wd) * (p.c + p.wd) + k];
  },
  /* q20d: (x² - c²) ÷ (x - c) = x + c, and |x - c| ÷ (x - c) = ∓1 on the two sides, so f = x + c ± t. f(c) = v. */
  q20d: p => {
    const f = x => (x + p.c) + p.t * (x < p.c ? -1 : 1);
    const L = r6(f(p.c - 1e-9)), R = r6(f(p.c + 1e-9));
    return [L, R, L !== R ? 2 : (r6(p.v) !== L ? 1 : 0)];
  },
});
})();
