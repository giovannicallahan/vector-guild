/* Independent oracles for Real analysis practice missions, file 7 of 8: q31b–q35d (game/realms/real/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Exact fractions on BigInt, so searches and 3-decimal roundings never depend on floating point. */
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const add = (x, y) => Q(x.n * y.d + y.n * x.d, x.d * y.d);
const sub = (x, y) => Q(x.n * y.d - y.n * x.d, x.d * y.d);
const mul = (x, y) => Q(x.n * y.n, x.d * y.d);
const div = (x, y) => Q(x.n * y.d, x.d * y.n);
const num = x => Number(x.n) / Number(x.d);
const lt = (x, y) => x.n * y.d < y.n * x.d;
/* round half up to 3 decimal places */
const r3 = x => { const t = x.n * 1000n * 2n + x.d; return Number(t / (2n * x.d)) / 1000; };
/* decimal text such as "0.75" or "1.5" as an exact fraction */
const dec = s => { const [i, f = ''] = String(s).split('.'); return Q(BigInt(i + f), 10n ** BigInt(f.length)); };
/* smallest whole n >= start with test(n) true, by counting up */
const firstN = (start, test) => { for (let n = start; ; n++) if (test(n)) return n; };
/* the parameter lists the generators index into (read off the printed prompts: wi -> tolerance, xi -> load) */
const TOL = ['0.1', '0.05', '0.02', '0.01', '0.001'];
const LOAD = ['0.5', '0.25', '0.75', '0.6', '0.8', '0.2', '0.7', '0.3'];
const LOADQ = ['0.5', '1', '1.5', '2', '2.5', '3'];
const BIG = ['1.2', '1.5', '2', '3', '4'];
/* A monotone f on [lo, hi] cut at the points xs: lower and upper sums, from the values at the ends of each piece. */
const sums = (f, xs, up) => { let L = 0, U = 0; for (let i = 0; i + 1 < xs.length; i++) { const u = f(xs[i]), v = f(xs[i + 1]), w = xs[i + 1] - xs[i]; L += Math.min(u, v) * w; U += Math.max(u, v) * w; } return [L, U]; };
Object.assign(window.ORACLE, {
  /* q31b: f is a straight line on [a, a + len]. Its slope is m (up: f = k + m x; down: f = (k + m(a + len)) - m x, so f ends at k).
     U - L for n pieces is (f(b) - f(a)) in size times len / n; the tolerance is e hundredths. */
  q31b: p => {
    const b = p.a + p.len, c0 = p.up ? p.k : p.k + p.m * b, s = p.up ? p.m : -p.m;
    const f = x => c0 + s * x, jump = Math.abs(f(b) - f(p.a)) * p.len;           // (end difference) x len
    const gap = n => Q(Math.round(jump), n);
    const eps = Q(p.e, 100);
    return [num(gap(p.n0)), firstN(1, n => lt(gap(n), eps))];
  },
  /* q31c: two readings d apart over [a, a + len]; U - L = d x len / n; tolerance e hundredths; points = n + 1. */
  q31c: p => {
    const gap = n => Q(p.d * p.len, n), eps = Q(p.e, 100);
    const n = firstN(1, k => lt(gap(k), eps));
    return [p.d * p.len, n, n + 1];
  },
  /* q31d: kind 0 is x^2, 1 is x^3 (both increasing), 2 is 100 - x^2 (decreasing). The cut points are a, then w1, w2, w3 added on.
     q is the denominator of the fraction ("a half" = 2, "a quarter" = 4, "a fifth" = 5, "a tenth" = 10). */
  q31d: p => {
    const f = [x => x * x, x => x * x * x, x => 100 - x * x][p.kind];
    const xs = [p.a, p.a + p.w1, p.a + p.w1 + p.w2, p.a + p.w1 + p.w2 + p.w3];
    const [L, U] = sums(f, xs), gapP = U - L;
    const len = xs[3] - xs[0], jump = Math.abs(f(xs[3]) - f(xs[0]));
    // U - L for n equal pieces is jump x len / n; need it < gapP / q
    const n = firstN(1, k => BigInt(jump * len) * BigInt(p.q) < BigInt(gapP) * BigInt(k));
    return [L, U, n];
  },
  /* q32b: f(t) = k - (t - h)^2 (same as -t^2 + 2h t + k - h^2); the stretch is [b, c]. Integral by the exact antiderivative,
     bounds from the end values and the peak at t = h when it lies inside. */
  q32b: p => {
    const F = t => -t * t * t / 3 + p.h * t * t + (p.k - p.h * p.h) * t, f = t => p.k - (t - p.h) * (t - p.h);
    const pts = [p.b, p.c]; if (p.h > p.b && p.h < p.c) pts.push(p.h);
    const w = p.c - p.b;
    return [Math.round((F(p.c) - F(p.b)) * 1e6) / 1e6, Math.min(...pts.map(f)) * w, Math.max(...pts.map(f)) * w];
  },
  /* q32c: the meter gives the whole integral, the first piece P1 (0 to s) and the last piece P3. The middle piece has width len and
     the log's whole integral is P1 + middle + P3 where the middle piece averages avg0 (the whole shift's total is stated in the prompt). */
  q32c: p => {
    const total = p.P1 + p.P3 + p.avg0 * p.len;
    const mid = total - p.P1 - p.P3, avg = mid / p.len;
    return [mid, avg, avg >= p.m && avg <= p.M ? 1 : 0];
  },
  /* q32d: f(t) = t^3 - 6t^2 + 9t + k on [s, e]; turning points at t = 1 and t = 3 (roots of 3t^2 - 12t + 9). */
  q32d: p => {
    const F = t => t * t * t * t / 4 - 2 * t * t * t + 4.5 * t * t + p.k * t, f = t => t * t * t - 6 * t * t + 9 * t + p.k;
    const pts = [p.s, p.e]; for (const t of [1, 3]) if (t > p.s && t < p.e) pts.push(t);
    const w = p.e - p.s;
    return [F(p.e) - F(p.s), Math.min(...pts.map(f)) * w, Math.max(...pts.map(f)) * w];
  },
  /* q33b: f = p on [a, s), q after s (the stray value r at s changes no area). F(x) is the area from a. Differentiable at s iff the two sides agree. */
  q33b: p => {
    const F = x => p.p * (Math.min(x, p.s) - p.a) + p.q * Math.max(0, x - p.s);
    return [F(p.x0), F(p.x1), p.p === p.q ? 1 : 0];
  },
  /* q33c: rates p, q, w on [0, s1), (s1, s2), (s2, end]; F is asked at s2 and at x1. Count the switches where the two sides agree. */
  q33c: p => {
    const F = x => p.p * Math.min(x, p.s1) + p.q * Math.max(0, Math.min(x, p.s2) - p.s1) + p.w * Math.max(0, x - p.s2);
    return [F(p.s2), F(p.x1), (p.p === p.q ? 1 : 0) + (p.q === p.w ? 1 : 0)];
  },
  /* q33d: f = a t up to s (a triangle: a x^2 / 2), then the flat q. F(s) and F(x1); differentiable at s iff a s = q (sides agree). */
  q33d: p => {
    const F = x => x <= p.s ? p.a * x * x / 2 : p.a * p.s * p.s / 2 + p.q * (x - p.s);
    return [F(p.s), F(p.x1), p.a * p.s === p.q ? 1 : 0];
  },
  /* q34b: tail from n = N + 1 of c / n^p lies between integral_{N+1}^inf and that integral plus the first tail term. */
  q34b: p => {
    const K = BigInt(p.N + 1), pw = BigInt(p.p);
    const integral = Q(BigInt(p.c), (pw - 1n) * K ** (pw - 1n)), term = Q(BigInt(p.c), K ** pw);
    return [r3(integral), r3(add(integral, term))];
  },
  /* q34c: gap between the bounds is the term c / (N + 1)^p; the tolerance is e thousandths (strict). Smallest N by counting up. */
  q34c: p => {
    const pw = BigInt(p.p);
    const N = firstN(1, n => lt(Q(BigInt(p.c), BigInt(n + 1) ** pw), Q(p.e, 1000)));
    let sum = Q(0n);
    for (let n = 1; n <= N; n++) sum = add(sum, Q(BigInt(p.c), BigInt(n) ** pw));
    const K = BigInt(N + 1), integral = Q(BigInt(p.c), (pw - 1n) * K ** (pw - 1n)), term = Q(BigInt(p.c), K ** pw);
    const lower = add(sum, integral);
    return [N, r3(lower), r3(add(lower, term))];
  },
  /* q34d: first N terms of c / (n^p + 1) exactly; ceiling = c / (N+1)^p + integral_{N+1}^inf c / x^p; upper bound = their sum. */
  q34d: p => {
    const pw = BigInt(p.p);
    let sum = Q(0n);
    for (let n = 1; n <= p.N; n++) sum = add(sum, Q(BigInt(p.c), BigInt(n) ** pw + 1n));
    const K = BigInt(p.N + 1);
    const ceiling = add(Q(BigInt(p.c), K ** pw), Q(BigInt(p.c), (pw - 1n) * K ** (pw - 1n)));
    return [r3(sum), r3(ceiling), r3(add(sum, ceiling))];
  },
  /* q35b: f_n(x) = A + B x^n; limit at the load is A (x < 1) and A + B at 1. Gap |B| x^n < tolerance, smallest N by exact counting
     (xi, wi are indexes into the printed load and tolerance lists; the gap shrinks with n so "every n >= N" is the first n that works). */
  q35b: p => {
    const x = dec(LOAD[p.xi]), tol = dec(TOL[p.wi]), B = Q(Math.abs(p.B));
    let g = B; // |B| x^n
    let n = 0; for (;;) { n++; g = mul(g, x); if (lt(g, tol)) break; }
    return [p.A, p.A + p.B, n];
  },
  /* q35c: f_n(x) = x^2 + k x / n; limit x^2; the gap k x / n < tolerance, smallest N by counting up. Loads from the printed list (i, then j). */
  q35c: p => {
    const x1 = dec(LOADQ[p.i]), x2 = dec(LOADQ[p.j]), tol = dec(TOL[p.wi]);
    const first = x => firstN(1, n => lt(div(mul(Q(p.k), x), Q(n)), tol));
    return [num(mul(x1, x1)), first(x1), first(x2)];
  },
  /* q35d: f_n(x) = A x^n / (1 + x^n); at 1 it is A/2, above 1 it tends to A. The gap at a load xa < 1 is f_n(xa) itself, which
     shrinks with n; smallest N with A xa^n / (1 + xa^n) < tolerance, by exact counting. (xai, xbi, wi index the printed lists.) */
  q35d: p => {
    const xa = dec(LOAD[p.xai]), xb = dec(BIG[p.xbi]), tol = dec(TOL[p.wi]);
    let pw = Q(1), n = 0;
    for (;;) { n++; pw = mul(pw, xa); if (lt(div(mul(Q(p.A), pw), add(Q(1), pw)), tol)) break; }
    return [p.A / 2, p.A, n];
  },
});
})();
