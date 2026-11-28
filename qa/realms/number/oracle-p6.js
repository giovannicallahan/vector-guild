/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 6 of 8: q26b–q30d (game/realms/number/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* ---- helpers (all by brute force, from the definitions) ---- */
const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
const divisorsOf = n => { const d = []; for (let x = 1; x <= n; x++) if (n % x === 0) d.push(x); return d; };
const sumArr = a => a.reduce((s, x) => s + x, 0);
/* Step a lamp from 1 by "times a, keep the remainder mod n" until it is back at 1: the fewest steps, at least one. */
const orderBySteps = (a, n) => { let x = 1 % n, k = 0; do { x = (x * a) % n; k++; } while (x !== 1 % n && k <= n + 1); return k; };
/* Position after k steps, stepping one night at a time. */
const stepsTo = (a, n, k) => { let x = 1 % n; for (let i = 0; i < k; i++) x = (x * a) % n; return x; };
/* Smallest k >= 1 at which the lamp shows b, or 0 if it never does within a full cycle's worth of steps. */
const firstHit = (a, n, b) => { let x = 1 % n; for (let k = 1; k <= n; k++) { x = (x * a) % n; if (x === b % n) return k; } return 0; };
const primesDividing = n => { const ps = []; for (let q = 2; q <= n; q++) { if (n % q) continue; let isP = true; for (let r = 2; r * r <= q; r++) if (q % r === 0) isP = false; if (isP) ps.push(q); } return ps; };
/* Primitive roots mod prime p: the steps whose lamp visits all p - 1 positions before repeating. */
const isPrimRoot = (g, p) => { const seen = new Set(); let x = 1; for (let i = 0; i < p - 1; i++) { x = (x * g) % p; seen.add(x); } return seen.size === p - 1; };
const countPrimRoots = p => { let c = 0; for (let g = 1; g < p; g++) if (isPrimRoot(g, p)) c++; return c; };
const phiCount = n => { let c = 0; for (let x = 1; x <= n; x++) if (gcd(x, n) === 1) c++; return c; };
const squaresHit = (x2target, m) => { const xs = []; for (let x = 0; x < m; x++) if ((x * x) % m === x2target % m) xs.push(x); return xs; };

Object.assign(window.ORACLE, {
  /* N and p are the numbers shown: the proper divisors are added one by one; the perfect number is 2^(p-1) x (2^p - 1) built by doubling. */
  q26b: p => {
    const s = sumArr(divisorsOf(p.N).filter(d => d !== p.N));
    let pow = 1; for (let i = 0; i < p.p - 1; i++) pow *= 2;
    return [s, s === p.N ? 1 : 0, pow * (pow * 2 - 1)];
  },
  /* The display length is built by doubling; the stock is k whole displays plus r spare lamps (k and r are how the stock was set up, not shown in the prompt).
     Whole displays and leftover then come from taking one display away at a time. */
  q26c: p => {
    let pow = 1; for (let i = 0; i < p.p - 1; i++) pow *= 2;
    const L = pow * (pow * 2 - 1);
    let stock = p.k * L + p.r, shows = 0;
    while (stock >= L) { stock -= L; shows++; }
    return [L, shows, stock];
  },
  /* Count divisors by listing them; sum them; compare with twice N. */
  q26d: p => { const d = divisorsOf(p.N); return [d.length, sumArr(d), sumArr(d) - 2 * p.N]; },
  /* phi(N) by counting numbers coprime to N; the slot after two nights and the return night by stepping. */
  q27b: p => [phiCount(p.N), orderBySteps(p.a, p.N)],
  /* Each lamp's return night by stepping; both return together at the first night that is a return night for each (checked night by night). */
  q27c: p => {
    const A = orderBySteps(p.a, p.N), B = orderBySteps(p.b, p.N);
    let both = 0; for (let k = 1; k <= A * B; k++) if (k % A === 0 && k % B === 0) { both = k; break; }
    return [A, B, both];
  },
  /* Return by stepping; position after K pulses by stepping one pulse at a time. */
  q27d: p => [orderBySteps(p.a, p.p), stepsTo(p.a, p.p, p.K)],
  /* Largest prime q dividing p - 1; g^((p-1)/q) mod p by stepping; the root test is "visits all p - 1 positions"; the count is every step g in 1..p-1 tested that way. */
  q28b: p => {
    const q = Math.max(...primesDividing(p.p - 1));
    return [stepsTo(p.g, p.p, (p.p - 1) / q), isPrimRoot(p.g, p.p) ? 1 : 0, countPrimRoots(p.p)];
  },
  /* The lamp's distinct positions are collected as it steps; a step counts as good when it visits all p - 1 positions. */
  q28c: p => {
    const seen = new Set(); let x = 1; seen.add(1);
    for (let i = 0; i < p.p; i++) { x = (x * p.g) % p.p; seen.add(x); }
    return [isPrimRoot(p.g, p.p) ? 1 : 0, seen.size, countPrimRoots(p.p)];
  },
  /* Distinct primes dividing p - 1, then the same root tests as q28b. */
  q28d: p => [primesDividing(p.p - 1).length, isPrimRoot(p.g, p.p) ? 1 : 0, countPrimRoots(p.p)],
  /* Index = the hour k in 1..p-1 at which the beacon is lit. */
  q29b: p => [firstHit(p.g, p.p, p.b), firstHit(p.g, p.p, p.c)],
  /* Day numbers k in 1..p-1 for each position; the wait is counted day by day from today's position until the later one shows (a full lap if it is the same). */
  q29c: p => {
    const k1 = firstHit(p.g, p.p, p.b), k2 = firstHit(p.g, p.p, p.c);
    let x = p.b % p.p, wait = 0;
    do { x = (x * p.g) % p.p; wait++; } while (x !== p.c % p.p && wait < 10 * p.p);
    return [k1, k2, wait];
  },
  /* Indices base g by stepping; the second lamp stepped from 1 until it shows c (0 if it never does in a full lap of p - 1 nights). */
  q29d: p => {
    let x = 1, j = 0, found = 0;
    for (let n = 1; n <= p.p - 1; n++) { x = (x * p.b) % p.p; if (x === p.c % p.p) { found = n; break; } }
    return [firstHit(p.g, p.p, p.b), firstHit(p.g, p.p, p.c), found];
  },
  /* Settings x in 1..p-1 are squared one by one and compared with a. */
  q30b: p => {
    const xs = []; for (let x = 1; x < p.p; x++) if ((x * x) % p.p === p.a % p.p) xs.push(x);
    return [xs.length, xs.length ? xs[0] : 0, xs.length ? xs[xs.length - 1] : 0];
  },
  /* The three logbook numbers are r + m x p (r and m are how the draw was set up; the prompt prints the sums). Real stake = remainder; reachable = some x in 1..p-1 squares to it. */
  q30c: p => {
    const logs = [p.r1 + p.m1 * p.p, p.r2 + p.m2 * p.p, p.r3 + p.m3 * p.p];
    const real = logs.map(n => n % p.p);
    const reach = s => { for (let x = 1; x < p.p; x++) if ((x * x) % p.p === s) return x; return 0; };
    return [real[0], real.filter(s => reach(s) > 0).length, reach(real[0])];
  },
  /* Solutions counted by trying every x in each range. */
  q30d: p => [squaresHit(p.a, p.p).length, squaresHit(p.a, p.q).length, squaresHit(p.a, p.p * p.q).length],
});
})();
