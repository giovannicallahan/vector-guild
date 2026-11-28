/* Independent oracles for Real analysis practice missions, file 2 of 8: q06b–q10d (game/realms/real/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
/* Walk the register one pair at a time. `secondUp` true: inside a diagonal the second entry goes up (first goes down);
   false: the first entry goes up. Returns the pair at position `pos` (when given) and the position of pair (a, b). */
const walk = (secondUp, find, pos) => {
  let n = 0, at = null, foundPos = null;
  for (let s = 2; ; s++) {
    for (let i = 1; i <= s - 1; i++) {
      const a = secondUp ? s - i : i, b = secondUp ? i : s - i;
      n++;
      if (find && a === find[0] && b === find[1]) foundPos = n;
      if (pos && n === pos) at = { a, b, s, place: i };
    }
    if ((foundPos !== null || !find) && (at !== null || !pos)) return { foundPos, at };
  }
};
/* Smallest n >= 1 for which test(n) holds (the tests below all get easier as n grows). */
const firstN = test => { let n = 1; while (!test(n)) n++; return n; };
Object.assign(window.ORACLE, {
  /* q06b: second entry goes up inside a diagonal; position of (a, b), and the pair in position P. */
  q06b: p => {
    const w = walk(true, [p.a, p.b], p.P);
    return [w.foundPos, w.at.a, w.at.b];
  },
  /* q06c: first ("batch") entry goes up; tags of (a1, b1) and (a2, b2), and the count of tags from one to the other, ends included. */
  q06c: p => {
    const t1 = walk(false, [p.a1, p.b1]).foundPos, t2 = walk(false, [p.a2, p.b2]).foundPos;
    let covered = 0; for (let t = t1; t <= t2; t++) covered++;
    return [t1, t2, covered];
  },
  /* q06d: first entry goes up; position of (a, b), the diagonal sum holding position P, pairs of that diagonal after P. */
  q06d: p => {
    const pos = walk(false, [p.a, p.b]).foundPos, at = walk(false, null, p.P).at;
    return [pos, at.s, (at.s - 1) - at.place];
  },
  /* q07b: x_n = (a n - b) / (c n + d), limit a / c, eps = e / 1000. |x_n - L| = (b c + a d) / (c (c n + d)), compared in integers. */
  q07b: p => {
    const N = firstN(n => (p.b * p.c + p.a * p.d) * 1000 < p.e * p.c * (p.c * n + p.d));
    return [r6(p.a / p.c), N];
  },
  /* q07c: x_n = L - m / n, eps = pct% of L, strictly below; minute = N * h (h is the gap between readings in minutes). */
  q07c: p => {
    const N = firstN(n => p.m * 100 < p.pct * p.L * n);
    return [r6(p.pct * p.L / 100), N, N * p.h];
  },
  /* q07d: x_n = (a n² + b) / (c n² + d), limit a / c, eps = e / 1000 and e / 10000. |x_n - L| = |b c - a d| / (c (c n² + d)). */
  q07d: p => {
    const top = Math.abs(p.b * p.c - p.a * p.d);
    const N1 = firstN(n => top * 1000 < p.e * p.c * (p.c * n * n + p.d));
    const N2 = firstN(n => top * 10000 < p.e * p.c * (p.c * n * n + p.d));
    return [r6(p.a / p.c), N1, N2];
  },
  /* q08b: loss is a percentage; x_{n+1} = (1 - loss/100) x_n + t from x_1 = a. x_3 by two steps, limit by many steps. */
  q08b: p => {
    const keep = 1 - p.loss / 100;
    let x = p.a; const seen = [x];
    for (let i = 0; i < 3000; i++) { x = keep * x + p.t; seen.push(x); }
    return [r6(seen[2]), r6(seen[3000])];
  },
  /* q08c: x_{n+1} = x_n / 2 + t, x_1 = (limit 2t) plus g if `above`, minus g if not; tol is the distance to beat (strictly). */
  q08c: p => {
    let L = 0; for (let i = 0; i < 400; i++) L = L / 2 + p.t;
    let x = p.above ? 2 * p.t + p.g : 2 * p.t - p.g, n = 1;
    const first = x;
    while (Math.abs(x - L) >= p.tol) { x = x / 2 + p.t; n++; }
    return [r6(L), r6(Math.abs(first - L)), n];
  },
  /* q08d: x_{n+1} = sqrt(x_n + k). L0 is the limit (so k = L0² - L0); j only indexes the start: x_2 = L0 + j/4, so x_1 = x_2² - k
     (checked against the printed prompts: 4/-2 gives 0.25, 5/14 gives 52.25). Sup and maximum are found by running the sequence. */
  q08d: p => {
    const k = p.L0 * p.L0 - p.L0, x2 = p.L0 + p.j / 4, x1 = x2 * x2 - k;
    let x = x1, best = x1, hitsBest = 1;
    for (let i = 0; i < 2000; i++) { x = Math.sqrt(x + k); if (x > best + 1e-12) { best = x; hitsBest = 0; } }
    const lim = x; // the iterates after 2000 steps
    const sup = Math.max(x1, lim);
    // a maximum exists only when some term equals the supremum: that is x_1 when the sequence does not rise
    const hasMax = (x1 >= lim - 1e-12) ? 1 : 0;
    return [r6(Math.sqrt(x1 + k)), r6(lim), r6(sup), hasMax];
  },
  /* q09b: x_n = (a n + b cos n) / (c n), limit a / c, bound b / (c n) < e / 1000 strictly. */
  q09b: p => [r6(p.a / p.c), firstN(n => p.b * 1000 < p.e * p.c * n)],
  /* q09c: x_n = (A + p/n) + (B + q sin(n)/n): limit A + B, eps = pct% of it, bound (p + q) / n < eps strictly. */
  q09c: p => {
    const L = p.A + p.B;
    return [L, r6(p.pct * L / 100), firstN(n => (p.p + p.q) * 100 < p.pct * L * n)];
  },
  /* q09d: lower (a n - p)/(c n), upper (a n² + q)/(c n²), both tend to a / c. L - lower = p / (c n), upper - L = q / (c n²); eps = e / 1000.
     Both gaps must be strictly below eps, so N is the later of the two first n. */
  q09d: p => {
    const n1 = firstN(n => p.p * 1000 < p.e * p.c * n), n2 = firstN(n => p.q * 1000 < p.e * p.c * n * n);
    return [r6(p.a / p.c), Math.max(n1, n2)];
  },
  /* q10b: x_n = r_((n-1) mod 4) + c / n. Supremum over the first 4000 samples (c / n only falls); limsup / liminf from the
     subsequence values far out (n about 10^9). */
  q10b: p => {
    const r = [p.r1, p.r2, p.r3, p.r4];
    let sup = -Infinity; for (let n = 1; n <= 4000; n++) sup = Math.max(sup, r[(n - 1) % 4] + p.c / n);
    const far = []; for (let i = 0; i < 4; i++) far.push(r6(r[i] + p.c / (1e9 + i + 1 - ((1e9) % 4) )));
    return [r6(sup), Math.max(...far.map(Math.round)), Math.min(...far.map(Math.round))];
  },
  /* q10c: x_n = a + b(-1)^n + c / n, eps = e / 100. limsup = a + |b|, liminf = a - |b|. High mark of the tail from N: the
     largest of x_N .. x_(N+3) (each parity class falls), found term by term; compare excess over limsup in integers. */
  q10c: p => {
    const hi = p.a + Math.abs(p.b), lo = p.a - Math.abs(p.b);
    const ok = N => {
      for (let n = N; n < N + 4; n++) {
        const ex0 = p.a + p.b * (n % 2 ? -1 : 1) - hi; // integer part of x_n - limsup
        if (!(100 * (ex0 * n + p.c) < p.e * n)) return false;
      }
      return true;
    };
    return [hi, lo, firstN(ok)];
  },
  /* q10d: x_n = a + b(-1)^n + k sin(n) / n^p, eps = e / 1000. Noise dies away, so limsup = a + |b|, liminf = a - |b|;
     bound k / n^p < eps strictly. */
  q10d: p => [p.a + Math.abs(p.b), p.a - Math.abs(p.b), firstN(n => p.k * 1000 < p.e * Math.pow(n, p.p))]
});
})();
