/* Independent oracles for Real analysis practice missions, file 8 of 8: q36b–q40d (game/realms/real/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Tolerance table for the parameter that is only an index into a list of printed tolerances, as [numerator, denominator]. */
const TOLS = [[1, 10], [5, 100], [1, 100], [5, 1000], [1, 1000]];
/* Smallest n (from 1) with test(n) true, where test is monotone: once true it stays true. Bounded search. */
const firstN = test => { for (let n = 1; n < 200000; n++) if (test(n)) return n; return NaN; };
/* Sum of c·ratioᵏ·w(k) for k = 0 … K (w defaults to 1), a long partial sum standing in for the infinite sum (ratio < 1). */
const series = (c, ratio, w) => { let s = 0, t = 1; for (let k = 0; k < 30000; k++) { s += c * t * (w ? w(k) : 1); t *= ratio; } return s; };
/* Distances by the three metrics. */
const dist = (kind, dx, dy) => kind === 0 ? Math.sqrt(dx * dx + dy * dy) : kind === 1 ? Math.abs(dx) + Math.abs(dy) : Math.max(Math.abs(dx), Math.abs(dy));
Object.assign(window.ORACLE, {
  /* q36b: x(L − x) on [0, L]: scan the scale finely for its largest value, divide by n; then search N from
     "10·peak < e·n" (the printed tolerance is e ÷ 10; e is the tolerance index: 1 → 0.1, 2 → 0.2, …). */
  q36b: p => {
    let peak = 0; for (let i = 0; i <= 4000; i++) { const x = p.L * i / 4000; peak = Math.max(peak, x * (p.L - x)); }
    peak = Math.round(peak * 1e6) / 1e6;
    return [r6(peak / p.n0), firstN(n => peak * 10 < p.e * n - 1e-9)];
  },
  /* q36c: sup of (x ÷ v)ⁿ over [0, u] is at x = u (increasing in x); N by exact whole-number comparison u^n·tolDen < tolNum·v^n.
     p.ei indexes the printed tolerance list 0.1, 0.05, 0.01, 0.005, 0.001. */
  q36c: p => {
    const [tn, td] = TOLS[p.ei], U = BigInt(p.u), V = BigInt(p.v);
    const N = firstN(n => U ** BigInt(n) * BigInt(td) < BigInt(tn) * V ** BigInt(n));
    return [r6(Math.pow(p.u / p.v, p.n0)), N];
  },
  /* q36d: f = q·x (the p x² ÷ n part dies); the gap p x² ÷ n is largest at the right end x = b; N from "10·p·b² < e·n"
     (printed tolerance e ÷ 10). */
  q36d: p => {
    const gap = n => p.p * p.b * p.b / n;
    return [r6(p.q * p.x0), r6(gap(p.n0)), firstN(n => p.p * p.b * p.b * 10 < p.e * n - 1e-9)];
  },
  /* q37b: |c sin(nx) ÷ n| ≤ c ÷ n; N from "10c < e·n" (tolerance e ÷ 10). The integral of a x + c sin(nx) ÷ n over [0, L]
     is a L² ÷ 2 + c (1 − cos nL) ÷ n², taken at a huge n. */
  q37b: p => [r6(p.c / p.n0), firstN(n => p.c * 10 < p.e * n),
    r6(p.a * p.L * p.L / 2 + p.c * (1 - Math.cos(1e6 * p.L)) / 1e12)],
  /* q37c: the printed terms are C·(u ÷ v)ᵏ with C = m·(v − u) (the printed coefficient). Total by a long partial sum; tail after
     N0 terms by summing the remaining terms; N by exact comparison m·v·uᴺ·tolDen < tolNum·vᴺ (tail = m·v·(u ÷ v)ᴺ).
     p.ei indexes 0.1, 0.05, 0.01, 0.005, 0.001. */
  q37c: p => {
    const [tn, td] = TOLS[p.ei], U = BigInt(p.u), V = BigInt(p.v), M = BigInt(p.m);
    let tail = 0; const C = p.m * (p.v - p.u);
    for (let k = p.N0; k < p.N0 + 30000; k++) tail += C * Math.pow(p.u / p.v, k);
    const N = firstN(n => M * V * U ** BigInt(n) * BigInt(td) < BigInt(tn) * V ** BigInt(n));
    return [r6(series(C, p.u / p.v)), r6(tail), N];
  },
  /* q37d: Mₖ = c ÷ (k(k + 1)). Total = c × (1 − 1 ÷ (K + 1)) taken at a huge K; tail after N0 terms = c ÷ (N0 + 1);
     smallest N with c ÷ (N + 1) < e ÷ 100 (printed tolerance e ÷ 100). */
  q37d: p => [r6(p.c * (1 - 1 / 1e9)), r6(p.c / (p.N0 + 1)), firstN(n => p.c * 100 < p.e * (n + 1))],
  /* q38b: the printed series is C·(q(x − x0))ᵏ with C = m·(den − num) (printed coefficient); on the interval of half-width
     (num ÷ den) ÷ q the ratio is at most num ÷ den. Radius = 1 ÷ q. Bound = sum of C·(num ÷ den)ᵏ. */
  q38b: p => [r6(1 / p.q), r6(series(p.m * (p.den - p.num), p.num / p.den))],
  /* q38c: the printed series is C·(x − x0)ᵏ ÷ bᵏ with C = m·(b − r). The interval runs r on one side of x0 and o on the other
     (o is 0, 1 or 2 and is only an index into which short side is printed), so the largest |x − x0| is r.
     Bound = sum of C·(r ÷ b)ᵏ. */
  q38c: p => {
    const lo = p.side === 0 ? p.x0 - p.r : p.x0 - p.o, hi = p.side === 0 ? p.x0 + p.o : p.x0 + p.r;
    const far = Math.max(Math.abs(lo - p.x0), Math.abs(hi - p.x0));
    return [p.b, far, r6(series(p.m * (p.b - p.r), far / p.b))];
  },
  /* q38d: terms c (k + 1) ρᵏ with ρ = |x − x0| ÷ b. Radius from the ratio test at a large k; the test point is x0 + s·d
     (s is the side); on [x0 − r, x0 + r] the M-test bound is the sum of c (k + 1)(r ÷ b)ᵏ. */
  q38d: p => {
    const K = 1e6, ratioLimit = ((K + 2) / (K + 1)) / p.b, radius = Math.round(1 / ratioLimit * 1e3) / 1e3;
    const x = p.x0 + p.s * p.d;
    return [radius, Math.abs(x - p.x0) < radius ? 1 : 0, r6(series(p.c, p.r / p.b, k => k + 1))];
  },
  /* q39b: B and C are A plus the offsets (bx, by) and (cx, cy); kind 0 euclidean, 1 taxicab, 2 maximum. */
  q39b: p => {
    const dB = dist(p.kind, p.bx, p.by), dC = dist(p.kind, p.cx, p.cy);
    return [r6(dB), r6(dC), dB < dC ? 1 : 0];
  },
  /* q39c: Q = P + (dx, dy). The printed ball radius is the straight-line distance plus off (off is a signed margin). */
  q39c: p => {
    const taxi = dist(1, p.dx, p.dy), eu = dist(0, p.dx, p.dy), R = Math.round(eu) + p.off;
    return [taxi, r6(eu), eu < R ? 1 : 0];
  },
  /* q39d: Q = P + (qx, qy) and R = Q + (rx, ry); kind 0 euclidean, 1 taxicab, 2 maximum. */
  q39d: p => {
    const pq = dist(p.kind, p.qx, p.qy), qr = dist(p.kind, p.rx, p.ry), pr = dist(p.kind, p.qx + p.rx, p.qy + p.ry);
    return [r6(pq + qr), r6(pr), r6(pq + qr - pr)];
  },
  /* q40b: the printed series is C·(x² ÷ b²)ᵏ with C = m·(b² − r²); it converges while x² < b², so the radius is b.
     On [−r, r] the largest term is C·(r² ÷ b²)ᵏ; Q = P + (dx, dy); maximum metric. */
  q40b: p => [p.b, r6(series(p.m * (p.b * p.b - p.r * p.r), p.r * p.r / (p.b * p.b))), dist(2, p.dx, p.dy)],
  /* q40c: the printed series is c(−1)ᵏ(x − x0)ᵏ ÷ Bᵏ with B = (euclidean distance to the point) + off, so the radius is B,
     and the series converges at the point when that distance is below B. */
  q40c: p => {
    const eu = dist(0, p.dx, p.dy), B = Math.round(eu) + p.off;
    return [B, r6(eu), eu < B ? 1 : 0];
  },
  /* q40d: the printed series is C·(x ÷ b)ᵏ with C = m·(b − r). On [0, r] the leftover after N terms is largest at x = r and
     equals m·b·(r ÷ b)ᴺ (sum of the later terms). N by exact comparison m·b·rᴺ·tolDen < tolNum·bᴺ.
     p.ei indexes 0.1, 0.05, 0.01, 0.005, 0.001. */
  q40d: p => {
    const [tn, td] = TOLS[p.ei], B = BigInt(p.b), R = BigInt(p.r), M = BigInt(p.m);
    let left = 0; for (let k = p.N0; k < p.N0 + 30000; k++) left += p.m * (p.b - p.r) * Math.pow(p.r / p.b, k);
    const N = firstN(n => M * B * R ** BigInt(n) * BigInt(td) < BigInt(tn) * B ** BigInt(n));
    return [p.b, r6(left), N];
  },
});
})();
