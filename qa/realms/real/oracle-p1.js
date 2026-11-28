/* Independent oracles for Real analysis practice missions, file 1 of 8: q01b–q05d (game/realms/real/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Smallest n = 1, 2, 3, … for which test(n) is true (bounded search). */
const firstN = test => { for (let n = 1; n <= 5e6; n++) if (test(n)) return n; return -1; };
/* Limit of g(n) as n grows: the value at a huge n, rounded. */
const far = g => r6(g(1e9));
Object.assign(window.ORACLE, {
  /* q01b: `form` only picks the bracket style of the range: 0 (a,b), 1 (a,b], 2 [a,b], 3 [a,b).
     sup S = b whatever the bracket; S has a maximum exactly when b itself is accepted. */
  q01b: p => {
    const topClosed = (p.form === 1 || p.form === 2);
    return [p.b, topClosed ? 1 : 0];
  },
  /* q01c: readings a − b/n rise to a. Spare room to the limiter at a + room. Close when b/n < D/10, found by search. */
  q01c: p => {
    const n = firstN(k => a_close(p, k));
    return [p.a, p.room, n];
  },
  /* q01d: readings a − b/(n+k) never reach a; the extra reading c is a member. sup S is the larger of a and c,
     and it is a member only when the extra reading equals it. */
  q01d: p => {
    const supRising = p.a, supS = Math.max(p.a, p.c);
    return [supRising, supS, p.c === supS ? 1 : 0];
  },
  /* q02b: `form` picks the shape. form 1: a + c/(n+k) falls towards a (t unused). form 0: m n/(n+k) with m = t(k+1),
     which rises from its first reading. Inf found numerically, attained if some reading equals it. */
  q02b: p => {
    const f = p.form === 1 ? (n => p.a + p.c / (n + p.k)) : (n => p.t * (p.k + 1) * n / (n + p.k));
    let low = Infinity; for (let n = 1; n <= 2000; n++) low = Math.min(low, f(n));
    const inf = Math.min(r6(low), far(f)); // limit and smallest seen
    let hit = 0; for (let n = 1; n <= 200000; n++) if (Math.abs(f(n) - inf) < 1e-9) { hit = 1; break; }
    return [inf, hit];
  },
  /* q02c: readings a + c/n with c = g(t + 1/2) (the numerator is not a parameter; it makes the alarm level a + g
     fall between two tests). inf S = a. Alarm level a + g. Count tests above it. */
  q02c: p => {
    const c = p.g * (p.t + 0.5), f = n => p.a + c / n;
    let count = 0; for (let n = 1; n <= 100000 && f(n) > p.a + p.g; n++) count++;
    return [r6(far(f)), r6(c / p.g), count];
  },
  /* q02d: form 0: a + (−1)ⁿ b/n; form 1: a + (−1)ⁿ b n/(n+1). Extremes by scanning, then limits of odd and even tails. */
  q02d: p => {
    const f = p.form === 0 ? (n => p.a + (n % 2 ? -1 : 1) * p.b / n) : (n => p.a + (n % 2 ? -1 : 1) * p.b * n / (n + 1));
    let lo = Infinity, hi = -Infinity;
    for (let n = 1; n <= 3000; n++) { lo = Math.min(lo, f(n)); hi = Math.max(hi, f(n)); }
    const tails = [r6(f(1e9)), r6(f(1e9 + 1))];
    const inf = Math.min(r6(lo), ...tails), sup = Math.max(r6(hi), ...tails);
    let c = 0;
    for (const v of [inf, sup]) { let hit = false; for (let n = 1; n <= 200000; n++) if (Math.abs(f(n) - v) < 1e-9) { hit = true; break; } if (hit) c++; }
    return [inf, sup, c];
  },
  /* q03b: error c/n below k/1000 mm; winch n × X/100 above Y metres. Whole-number arithmetic. */
  q03b: p => [firstN(n => p.c * 1000 < p.k * n), firstN(n => n * p.X > 100 * p.Y)],
  /* q03c: alarm at h + N/10 litres, pump X/100 litres a stroke. Work in hundredths of a litre. */
  q03c: p => {
    const needH = 10 * p.N; // hundredths of a litre to add
    const s = firstN(n => n * p.X > needH);
    return [p.N / 10, s, (s * p.X - needH) / 100];
  },
  /* q03d: readings a − b/n; within eps = k/1000 when b/n < eps. */
  q03d: p => [p.a, firstN(n => p.b * 1000 < p.k1 * n), firstN(n => p.b * 1000 < p.k2 * n)],
  /* q04b: errors bounded by A/10, B/10, C/10 mm add in the worst case; accepted heights c ± r/10. */
  q04b: p => [(p.A + p.B + p.C) / 10, (10 * p.c - p.r) / 10, (10 * p.c + p.r) / 10],
  /* q04c: total error (EA+EB)/10; longest length in tenths of a cm; fit test in tenths. */
  q04c: p => {
    const errT = p.EA + p.EB, longT = 10 * (p.a + p.b) + errT;
    return [errT / 10, longT / 10, longT <= 10 * p.M ? 1 : 0];
  },
  /* q04d: first rod in c ± R/10; second in (c+g) ± S/10 (centre read from the prompt). The ranges do not overlap,
     so every distance is between the gap of the inner ends and the span of the outer ends (tenths of a mm). */
  q04d: p => {
    const loA = 10 * p.c - p.R, hiA = 10 * p.c + p.R, loB = 10 * (p.c + p.g) - p.S, hiB = 10 * (p.c + p.g) + p.S;
    return [(hiB - loA) / 10, (loB - hiA) / 10];
  },
  /* q05b: f in terms of t = x + k, which runs over the open interval (u, v). form 0: C/t. form 1: A − C/t.
     Both monotone in t, so the extreme values are the limits at the two ends. */
  q05b: p => {
    const f = p.form === 0 ? (t => p.C / t) : (t => p.A - p.C / t), d = 1e-9;
    const e1 = f(p.u + d), e2 = f(p.v - d);
    return [r6(Math.max(e1, e2)), r6(Math.min(e1, e2))];
  },
  /* q05c: E(x) = s (x − h)² + k on [p, q]. Scan a fine grid of the closed range, ends included. */
  q05c: p => {
    let lo = Infinity, hi = -Infinity;
    const steps = 4000, xs = [p.h]; // the turning point h is tried exactly as well
    for (let i = 0; i <= steps; i++) xs.push(p.p + (p.q - p.p) * i / steps);
    for (const x of xs) {
      if (x < p.p || x > p.q) continue;
      const e = p.s * (x - p.h) * (x - p.h) + p.k;
      lo = Math.min(lo, e); hi = Math.max(hi, e);
    }
    return [r6(hi), r6(lo), r6(hi - lo)];
  },
  /* q05d: f(x) = |x − a| + |x − b| on the range p to q. `form` is an index: 1 closed range, 0 open range.
     Scan the grid including the end values (the limits when open). sup is attained only if the range is closed. */
  q05d: p => {
    let lo = Infinity, hi = -Infinity;
    const steps = 7000;
    for (let i = 0; i <= steps; i++) {
      const x = p.p + (p.q - p.p) * i / steps, e = Math.abs(x - p.a) + Math.abs(x - p.b);
      lo = Math.min(lo, e); hi = Math.max(hi, e);
    }
    return [r6(hi), r6(lo), p.form === 1 ? 1 : 0];
  },
});
/* q01c helper: the test is close when its reading a − b/n is above sup S − D/10, i.e. b/n < D/10. */
function a_close(p, n) { return 10 * p.b < p.D * n; }
})();
