/* Independent oracles for Number theory: the hidden life of whole numbers learn missions, file c: q21–q30 (game/realms/number/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Helpers: all by brute force, no formulas from the lessons. */
const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
/* Count 1..n coprime to n by testing each. */
const phiCount = n => { let c = 0; for (let i = 1; i <= n; i++) if (gcd(i, n) === 1) c++; return c; };
/* a^e mod m by repeated multiplication (exponents here are at most a few thousand). */
const powMod = (a, e, m) => { let r = 1 % m; for (let i = 0; i < e; i++) r = (r * a) % m; return r; };
const distinctPrimes = n => { const ps = []; for (let d = 2; n > 1; d++) { if (n % d === 0) { let sq = false; let c = 0; while (n % d === 0) { n /= d; c++; } ps.push([d, c]); } } return ps; };
/* Möbius by definition: 0 if some prime repeats, else (−1)^(number of primes). */
const mobius = n => { const f = distinctPrimes(n); for (const [, c] of f) if (c > 1) return 0; return f.length % 2 ? -1 : 1; };
const sigma = n => { let s = 0; for (let i = 1; i <= n; i++) if (n % i === 0) s += i; return s; };
/* Order of a mod n: first k ≥ 1 with a^k ≡ 1. */
const orderOf = (a, n) => { let x = a % n, k = 1; while (x !== 1 % n) { x = (x * a) % n; k++; } return k; };
Object.assign(window.ORACLE, {
  /* N = the top code. Count the clean codes directly by testing every code against N. */
  q21: p => { const c = phiCount(p.N); return [c, p.N - c]; },
  /* a = base, k = exponent. r = remainder of k on division by φ(100) (φ(100) counted directly); the check code is
     found by multiplying a out k times mod 100 (no Euler shortcut). */
  q22: p => {
    const code = powMod(p.a, p.k, 100);
    return [p.k % phiCount(100), code, Math.floor(code / 10)];
  },
  /* m1 r1 m2 r2 = the two congruences, k = exponent. Search x upward from 1 for both remainders. */
  q23: p => {
    let x = 1;
    while (x % p.m1 !== p.r1 || x % p.m2 !== p.r2) x++;
    return [x, p.k % 40, powMod(x, p.k, 100)];
  },
  /* p, q = primes. Factorials built up and reduced mod the prime at each step. */
  q24: p => {
    const fm = (n, m) => { let r = 1; for (let i = 2; i <= n; i++) r = (r * i) % m; return r; };
    return [fm(p.p - 1, p.p), fm(p.p - 2, p.p), fm(p.q - 3, p.q)];
  },
  /* N = the cycle length. μ by definition, then over all divisors found by trial. */
  q25: p => {
    let nz = 0, sum = 0;
    for (let d = 1; d <= p.N; d++) if (p.N % d === 0) { const m = mobius(d); if (m !== 0) nz++; sum += m; }
    return [mobius(p.N), nz, sum];
  },
  /* N = number tested, p = exponent index of the Mersenne prime (2^p − 1 is prime for every p the generator draws). */
  q26: p => {
    const s = sigma(p.N);
    const M = Math.pow(2, p.p) - 1;
    return [s, s - 2 * p.N, M, Math.pow(2, p.p - 1) * M];
  },
  /* N = positions, a = step. φ by counting coprime positions; order by walking the pointer. */
  q27: p => [phiCount(p.N), orderOf(p.a, p.N)],
  /* p = prime, g = number tested. Power by repeated multiplication; primitive root if its order is p − 1;
     count primitive roots by finding the order of every number 1 to p − 1. */
  q28: p => {
    const half = powMod(p.g, (p.p - 1) / 2, p.p);
    let cnt = 0;
    for (let x = 1; x < p.p; x++) if (orderOf(x, p.p) === p.p - 1) cnt++;
    return [half, orderOf(p.g, p.p) === p.p - 1 ? 1 : 0, cnt];
  },
  /* p prime, g primitive root, b the position. Index = first k from 1 with g^k ≡ b; order of b by walking. */
  q29: p => {
    let k = 1, x = p.g % p.p;
    while (x !== p.b % p.p) { x = (x * p.g) % p.p; k++; }
    return [k, orderOf(p.b, p.p)];
  },
  /* p = odd prime, a = target stake. Square every x from 1 to p − 1 and look. */
  q30: p => {
    const xs = [];
    const seen = new Set();
    for (let x = 1; x < p.p; x++) { const s = (x * x) % p.p; seen.add(s); if (s === p.a % p.p) xs.push(x); }
    return [xs.length, xs.length ? xs[0] : 0, seen.size];
  },
});
})();
