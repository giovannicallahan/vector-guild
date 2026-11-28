/* Independent oracles for Real analysis practice missions, file 6 of 8: q26b–q30d (game/realms/real/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const r6 = x => Math.round(x * 1e6) / 1e6;
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const fact = n => { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; };
/* The prompt's bound on the size of a derivative: 1 for sin and cos; for e^x on 0..x the prompt's stated cap
   (e < 3 for x = 1, e² < 8 for x = 2). */
const cap = (fn, x) => fn === 'exp' ? (x === 1 ? 3n : x === 2 ? 8n : (() => { throw new Error('exp cap for x=' + x); })()) : 1n;
/* Lagrange bound  K × cap × x^(n+1) ÷ (n+1)!  as an exact fraction [num, den] in lowest terms (K = 1 when absent). */
const bound = (fn, x, n, K) => {
  let num = BigInt(K || 1) * cap(fn, x) * BigInt(x) ** BigInt(n + 1), den = fact(n + 1), g = gcd(num, den);
  return [num / g, den / g];
};
/* Smallest degree n (counting up from 0) whose bound is below limNum/limDen, compared exactly by cross-multiplying. */
const smallestN = (fn, x, K, limNum, limDen) => {
  for (let n = 0; n < 200; n++) { const [a, b] = bound(fn, x, n, K); if (a * limDen < limNum * b) return n; }
  throw new Error('no degree found');
};
const dec = e => [BigInt(Math.round(e * 1e8)), 100000000n];   /* a decimal like 0.0005 as an exact fraction */
const num = b => Number(b);
/* Brute-force min and max of f on [lo, hi] over a grid of hundredths (every partition point and peak is a whole number). */
const range = (f, lo, hi) => {
  let mn = Infinity, mx = -Infinity;
  for (let i = Math.round(lo * 100); i <= Math.round(hi * 100); i++) { const v = f(i / 100); if (v < mn) mn = v; if (v > mx) mx = v; }
  return [Math.round(mn * 1e6) / 1e6, Math.round(mx * 1e6) / 1e6];
};
const sums = (f, pts) => {
  let L = 0, U = 0;
  for (let i = 0; i + 1 < pts.length; i++) { const [mn, mx] = range(f, pts[i], pts[i + 1]), w = pts[i + 1] - pts[i]; L += mn * w; U += mx * w; }
  return [r6(L), r6(U)];
};
/* The functions of q30b/q30c by kind: first letters name the shape, the last character is + (rises) or − (falls).
   s and k are the numbers printed in the formula. */
const shape = p => {
  const up = p.kind.slice(-1) === '+', base = p.kind.slice(0, -1);
  const g = { cu: x => x * x * x, sq: x => x * x, lin: x => p.s * x }[base];
  if (!g) throw new Error('kind ' + p.kind);
  /* cu and sq print x³ + k / k − x³ and x² + k / k − x², with the coefficient 1; lin prints s x + k / k − s x */
  return up ? x => g(x) + p.k : x => p.k - g(x);
};
/* Largest change allowed by |slope| <= M/10 over an interval, by climbing in steps of 0.1 hour. */
const climb = (M, steps) => { let c = 0; for (let i = 0; i < steps; i++) c += M / 100; return r6(c); };
/* Solve f(x) = y for a whole x in [lo, hi] by trying each one. */
const findX = (f, y, lo, hi) => { for (let x = lo; x <= hi; x++) if (f(x) === y) return x; throw new Error('no root'); };
/* Slope of a polynomial by a small symmetric difference, rounded to a whole number (every slope here is an integer). */
const slopeInt = (f, x) => Math.round((f(x + 1e-4) - f(x - 1e-4)) / 2e-4);

Object.assign(window.ORACLE, {
  /* q26b: |L′| <= M/10; interval from minute a to minute b; start level r0. */
  q26b: p => { const ch = climb(p.M, (p.b - p.a) * 10); return [ch, r6(p.r0 - ch), r6(p.r0 + ch)]; },
  /* q26c: M/10 per hour from t = a for len hours, start reading r0. T is only the number of hours the story gives the
     reading to reach the valve (valve = r0 + M/10 × T). Search for the last time at which the fastest climber has not
     passed the valve, in steps of 0.1 hour. */
  q26c: p => {
    const ch = climb(p.M, p.len * 10), valve100 = p.r0 * 100 + p.M * p.T * 10;
    let s = 0; while (p.r0 * 100 + p.M * (s + 1) <= valve100) s++;
    return [ch, r6(p.r0 + ch), r6(p.a + s / 10)];
  },
  /* q26d: the limits are M1/10 and M2/10 (the prompt prints them as decimals); the total's limit is their sum. */
  q26d: p => { const ch = climb(p.M1 + p.M2, p.len * 10); return [ch, r6(p.r0 - ch), r6(p.r0 + ch)]; },
  /* q27b: bound for degree n0 as a lowest-terms fraction, then the smallest n whose bound is below e. */
  q27b: p => { const [a, b] = bound(p.fn, p.x, p.n0), [ln, ld] = dec(p.e); return [num(a), num(b), smallestN(p.fn, p.x, 1, ln, ld)]; },
  /* q27c: the error in K times the polynomial is K times the bound: first n below e, then that bound as a fraction. */
  q27c: p => { const [ln, ld] = dec(p.e), n = smallestN(p.fn, p.x, p.K, ln, ld), [a, b] = bound(p.fn, p.x, n, p.K); return [n, num(a), num(b)]; },
  /* q27d: the limit is 1 ÷ inv. */
  q27d: p => { const [a, b] = bound(p.fn, p.x, p.n0); return [num(a), num(b), smallestN(p.fn, p.x, 1, 1n, BigInt(p.inv))]; },
  /* q28b: f = k x³ + m x + c0; the reading y is f(x0) (the prompt prints it); find the whole x with f(x) = y. */
  q28b: p => {
    const f = x => p.k * x * x * x + p.m * x + p.c0, y = f(p.x0), x0 = findX(f, y, -3, 3), d = slopeInt(f, x0);
    return [x0, d, 1 / d];
  },
  /* q28c: same f with the constant c0; shift = Δy ÷ f′(x0) (E is the printed Δy). */
  q28c: p => {
    const f = x => p.k * x * x * x + p.m * x + p.c0, y = f(p.x0), x0 = findX(f, y, -3, 3), d = slopeInt(f, x0);
    return [x0, d, r6(p.E / d)];
  },
  /* q28d: f = x³ + 3p x² + (3p² + j) x + c0, which the prompt writes with f′ = 3(x + p)² + j (p is the printed shift). */
  q28d: p => {
    const f = x => x * x * x + 3 * p.p * x * x + (3 * p.p * p.p + p.j) * x + p.c0, y = f(p.x0), x0 = findX(f, y, -4, 3), d = slopeInt(f, x0);
    return [x0, d, 1 / d];
  },
  /* q29b: highest output = r0 + (M/10) × len; then the smallest n whose bound is below e. */
  q29b: p => { const [ln, ld] = dec(p.e); return [r6(p.r0 + climb(p.M, p.len * 10)), smallestN(p.fn, p.x, 1, ln, ld)]; },
  /* q29c: drift = (M/10) × len; the prompt's total budget is drift + e, so the leftover is the total minus the drift. */
  q29c: p => {
    const drift = climb(p.M, p.len * 10), total = r6(drift + p.e), left = r6(total - drift), [ln, ld] = dec(left);
    return [drift, left, smallestN(p.fn, p.x, 1, ln, ld)];
  },
  /* q29d: |f′| <= M/100 here (the prompt prints 0.08 and 0.84); change over len hours, then n below 1 ÷ inv. */
  q29d: p => { let c = 0; for (let i = 0; i < p.len * 10; i++) c += p.M / 1000; return [r6(c), smallestN(p.fn, p.x, 1, 1n, BigInt(p.inv))]; },
  /* q30b: sums over the partition, and their difference. */
  q30b: p => { const [L, U] = sums(shape(p), p.pts); return [L, U, r6(U - L)]; },
  /* q30c: sums, then half the gap between them (the midpoint report can be off by at most half the width). */
  q30c: p => { const [L, U] = sums(shape(p), p.pts); return [L, U, r6((U - L) / 2)]; },
  /* q30d: f(x) = k − (x − h)². */
  q30d: p => sums(x => p.k - (x - p.h) * (x - p.h), p.pts),
});
})();
