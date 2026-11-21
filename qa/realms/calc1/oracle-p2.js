/* Independent oracles for Calculus 1 practice missions, file 2 of 8: q06b–q10d (game/realms/calc1/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a numerical limit, a search, a general solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Round away floating-point noise (to 7 decimal places) so a numerically found value compares cleanly. */
const tidy = v => Math.round(v * 1e7) / 1e7;
/* One-sided numerical limit of f at c: sample at distances h and 2h, then cancel the first-order error. */
const limitAt = (f, c, side, h = 1e-4) => 2 * f(c + side * h) - f(c + side * 2 * h);
/* Limit as t grows without bound, by sampling very far out and cancelling the 1/t error term. */
const limitInf = (f, T = 1e7) => 2 * f(2 * T) - f(T);
/* Bisection for a root of g on [lo, hi] where g changes sign. */
const bisect = (g, lo, hi) => {
  const sLo = Math.sign(g(lo));
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (Math.sign(g(mid)) === sLo) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
};
/* Repeated halving: keep the half whose ends give f opposite signs, n times; returns [left, right]. */
const halve = (f, a, b, n) => {
  for (let i = 0; i < n; i++) { const m = (a + b) / 2; if (f(a) * f(m) < 0) b = m; else a = m; }
  return [a, b];
};
/* Pole of f found by scanning just left of each whole number for a huge reading. */
const poleOf = f => { for (let g = 1; g <= 60; g++) if (Math.abs(f(g - 1e-7)) > 1e5) return g; return NaN; };
Object.assign(window.ORACLE, {
  /* One-sided limits by sampling close to t = c on each side; the jump is their difference. */
  q06b: p => {
    const left = limitAt(t => p.m * t + p.k, p.c, -1);
    const right = limitAt(t => (t * t + (p.e - p.c) * t - p.c * p.e) / (t - p.c), p.c, +1);
    return [tidy(left), tidy(right), tidy(right - left)];
  },
  /* Sample the first formula just below the swap, the second just above, then bisect for the drain-back time. */
  q06c: p => {
    const left = limitAt(t => p.p - p.q * t, p.a, -1), right = limitAt(t => p.r - p.q * t, p.a, +1);
    const back = bisect(t => p.r - p.q * t - left, p.a, 10000);
    return [tidy(left), tidy(right - left), tidy(back)];
  },
  /* Sample each piece on its own side of x = c, with the pieces written out as full quotients. */
  q06d: p => {
    const l = limitAt(x => (x * x + (p.e1 - p.c) * x - p.c * p.e1) / (x - p.c), p.c, -1);
    const r = limitAt(x => (2 * x * x + 2 * (p.e2 - p.c) * x - 2 * p.c * p.e2) / (x - p.c), p.c, +1);
    return [tidy(l), tidy(r), tidy(r - l)];
  },
  /* The left limit is the value both rules must share, taken from the second rule at x = c (kc - b); k is the setting. */
  q07b: p => [p.k * p.c - p.b, p.k],
  /* Evaluate the ramp just left of the switch, find k by matching the second rule at t = c, then bisect for the zero. */
  q07c: p => {
    const flow = limitAt(t => p.a * t + p.b, p.c, -1);
    const k = Math.round(flow + p.c * p.c);
    const stop = bisect(t => k - t * t, p.c, 10000);
    return [tidy(flow), k, tidy(stop)];
  },
  /* Sample the quotient just left of c; k then comes from matching 3x + k (here m x + k) at x = c. */
  q07d: p => {
    const L = limitAt(x => (x * x + (p.e - p.c) * x - p.c * p.e) / (x - p.c), p.c, -1);
    return [tidy(L), tidy(L - p.m * p.c)];
  },
  /* T(0) by direct evaluation; the long-run level by sampling at enormous t. */
  q08b: p => {
    const T = t => (p.p * t + p.b) / (p.q * t + p.d);
    const t0 = T(0), inf = limitInf(T);
    return [tidy(t0), tidy(inf), tidy(t0 - inf)];
  },
  /* Long-run level by sampling at enormous t; the time by bisecting c(t) - V (c is monotone between its ends). */
  q08c: p => {
    const c = t => (p.p * t + p.b) / (p.q * t + p.d);
    return [tidy(limitInf(c)), tidy(bisect(t => c(t) - p.V, 0, 1e7))];
  },
  /* The long-run reading is linear in k: sample it at k = 0 and k = 1, solve for the k giving L, then evaluate at t = 2. */
  q08d: p => {
    const c = (k, t) => (k * t * t + p.b * t + p.e) / (p.q * t * t + p.d * t + p.f);
    const l0 = limitInf(t => c(0, t)), l1 = limitInf(t => c(1, t));
    const k = Math.round(((p.L - l0) / (l1 - l0)) * 1e6) / 1e6;
    return [k, tidy(c(k, 2))];
  },
  /* Find the pole by scanning for a huge reading, then read the two values 0.01 either side of it. */
  q09b: p => {
    const Q = x => (p.a * x + p.b) / (p.d - x);
    const g = poleOf(Q);
    return [g, tidy(Q(g - 0.01)), tidy(Q(g + 0.01))];
  },
  /* Find the pole by scanning, then bisect for the largest x below it whose pressure is still within M. */
  q09c: p => {
    const P = x => p.N / (p.c - x);
    const g = poleOf(P);
    return [g, tidy(bisect(x => (P(x) <= p.M ? -1 : 1), 0, g - 1e-9))];
  },
  /* Search whole numbers for zeros of the bottom; a zero where the top is also 0 is the hole, the other the pole.
     The hole's height is sampled either side and averaged; then R is read at the pole + 0.01. */
  q09d: p => {
    const top = x => x * x + (p.e - p.r) * x - p.r * p.e, bot = x => x * x - (p.r + p.s) * x + p.r * p.s;
    const R = x => top(x) / bot(x);
    let hole = NaN, pole = NaN;
    for (let x = -60; x <= 60; x++) if (bot(x) === 0) { if (top(x) === 0) hole = x; else pole = x; }
    const height = (R(hole + 1e-5) + R(hole - 1e-5)) / 2;
    return [pole, tidy(height), tidy(R(pole + 0.01))];
  },
  /* Bisect three times on f = d - x^3 - c x^2, starting from [k, k + 1]. */
  q10b: p => halve(x => p.d - x * x * x - p.c * x * x, p.k, p.k + 1, 3),
  /* Bisect twice on P(t) - d starting from [k, k + 1]; the estimate is the midpoint of what is left. */
  q10c: p => {
    const [a, b] = halve(t => t * t * t + p.c * t * t - p.d, p.k, p.k + 1, 2);
    return [a, b, (a + b) / 2];
  },
  /* Bisect three times on f = x^3 + c x + d starting from [-(k+1), -k]; then count halvings of a length-1 interval
     (1, 1/2, 1/4, ...) until it is shorter than w. */
  q10d: p => {
    const [a, b] = halve(x => x * x * x + p.c * x + p.d, -(p.k + 1), -p.k, 3);
    let len = 1, n = 0;
    while (!(len < p.w)) { len /= 2; n++; }
    return [a, b, n];
  },
});
})();
