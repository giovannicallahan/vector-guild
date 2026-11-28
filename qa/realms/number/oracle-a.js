/* Independent oracles for Number theory: the hidden life of whole numbers learn missions, file a: q01–q10 (game/realms/number/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Helpers: all by brute force, no formulas from the lessons. */
const divisorsOf = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
const power = (b, e) => { let r = 1; for (let i = 0; i < e; i++) r *= b; return r; };
const countDivisors = n => { let c = 0; for (let i = 1; i * i <= n; i++) if (n % i === 0) c += (i * i === n ? 1 : 2); return c; };
const sumDivisors = n => { let s = 0; for (let i = 1; i * i <= n; i++) if (n % i === 0) s += (i * i === n ? i : i + n / i); return s; };
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
Object.assign(window.ORACLE, {
  /* a = bolts delivered, b = bolts per crate, m = bolts owed (the ledger shows −m). Walk down from the number until
     the remainder lands in 0..b−1; for the negative number that means stepping up by b until it is not below −m. */
  q01: p => {
    let q1 = 0, r1 = p.a;
    while (r1 >= p.b) { r1 -= p.b; q1++; }
    let q2 = 0, r2 = -p.m;
    while (r2 < 0) { r2 += p.b; q2--; }
    return [q1, r1, q2, r2];
  },
  /* b = the base, w x y z = the four digits of the labelled crate (left to right), k = the new count. Positional
     value by Horner steps; the digits of k by building the number up place by place with a search over each digit. */
  q02: p => {
    let v = 0;
    for (const d of [p.w, p.x, p.y, p.z]) v = v * p.b + d;
    const digits = [];
    let left = p.k;
    for (let place = 3; place >= 0; place--) {
      const w = power(p.b, place);
      let d = 0;
      while ((d + 1) * w <= left) d++;
      digits.push(d);
      left -= d * w;
    }
    return [v, ...digits];
  },
  /* k = number of washers, N = top of the shelf range. Smallest divisor above 1 by trial; shelves = primes up to N. */
  q03: p => {
    let s = 2;
    while (p.k % s !== 0) s++;
    let shelves = 0;
    for (let i = 1; i <= p.N; i++) if (isPrime(i)) shelves++;
    return [s, shelves];
  },
  /* a b c d = exponents of 2, 3, 5, 7 in the delivery size. Rebuild the number, then divide each prime out again
     and count the divisions (also confirms nothing else is left). */
  q04: p => {
    let n = power(2, p.a) * power(3, p.b) * power(5, p.c) * power(7, p.d);
    const out = [];
    for (const pr of [2, 3, 5, 7]) { let e = 0; while (n % pr === 0) { n /= pr; e++; } out.push(e); }
    return out;
  },
  /* a2 a3 a5 a7 and b2 b3 b5 b7 = exponents of 2, 3, 5, 7 in the two box sizes. gcd = the largest common divisor
     found by listing; lcm = the first number that both box sizes divide, found by counting up. */
  q05: p => {
    const A = power(2, p.a2) * power(3, p.a3) * power(5, p.a5) * power(7, p.a7);
    const B = power(2, p.b2) * power(3, p.b3) * power(5, p.b5) * power(7, p.b7);
    let g = 1;
    for (const d of divisorsOf(A)) if (B % d === 0) g = d;
    let m = Math.max(A, B);
    while (m % A !== 0 || m % B !== 0) m++;
    return [g, m];
  },
  /* a > b are the two deliveries. gcd = the largest size that divides both (search downwards); the count of divisions
     is found by running the stated procedure step by step. */
  q06: p => {
    let g = Math.min(p.a, p.b);
    while (p.a % g !== 0 || p.b % g !== 0) g--;
    let x = p.a, y = p.b, steps = 0;
    for (;;) { const r = x - Math.floor(x / y) * y; steps++; if (r === 0) break; x = y; y = r; }
    return [g, steps];
  },
  /* a, b = the two can sizes. gcd by search; x = the smallest positive x for which (g − a x) is a multiple of b,
     found by trying x = 1, 2, 3…; y then follows from the equation. */
  q07: p => {
    let g = Math.min(p.a, p.b);
    while (p.a % g !== 0 || p.b % g !== 0) g--;
    let x = 1;
    while ((g - p.a * x) % p.b !== 0) x++;
    return [g, x, (g - p.a * x) / p.b];
  },
  /* a x + b y = c with x, y ≥ 1 whole numbers. List every x and test whether the rest is a positive multiple of b. */
  q08: p => {
    const xs = [];
    for (let x = 1; p.a * x < p.c; x++) {
      const rest = p.c - p.a * x;
      if (rest % p.b === 0 && rest / p.b >= 1) xs.push(x);
    }
    return [xs.length, xs.length ? xs[0] : NaN];
  },
  /* a b c d = exponents of 2, 3, 5, 7 in the first size; r^u × s^v = the second size. Divisors counted one by one. */
  q09: p => {
    const first = power(2, p.a) * power(3, p.b) * power(5, p.c) * power(7, p.d);
    const second = power(p.r, p.u) * power(p.s, p.v);
    return [countDivisors(first), countDivisors(second)];
  },
  /* p^a × q^b = the rack size; r^u × s^v = the product whose divisor sum is wanted (the two log entries are the
     coprime factors). Both divisor sums by adding up every divisor. */
  q10: p => {
    const rack = power(p.p, p.a) * power(p.q, p.b);
    const prod = power(p.r, p.u) * power(p.s, p.v);
    return [sumDivisors(rack), sumDivisors(prod)];
  },
});
})();
