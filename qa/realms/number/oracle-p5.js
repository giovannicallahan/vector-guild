/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 5 of 8: q21b–q25d (game/realms/number/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* gcd by Euclid's algorithm. */
const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };
/* φ(n) by counting the k from 1 to n that are coprime to n. */
const phi = n => { let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return c; };
/* a^k mod n by k plain multiplications, reducing after each one. */
const powSlow = (a, k, n) => { let r = 1 % n; for (let i = 0; i < k; i++) r = (r * a) % n; return r; };
/* (m)! mod p by plain multiplication. */
const factMod = (m, p) => { let r = 1 % p; for (let i = 2; i <= m; i++) r = (r * i) % p; return r; };
/* Smallest positive x with x ≡ r_i (mod m_i) for each pair, found by trying x = 1, 2, 3, ... */
const crtSearch = pairs => { for (let x = 1; ; x++) if (pairs.every(([r, m]) => x % m === r % m)) return x; };
/* μ(d) from the definition: 0 when a prime square divides d, otherwise −1 to the number of prime factors. */
const mu = d => { let cnt = 0, m = d; for (let q = 2; q * q <= m; q++) { if (m % q === 0) { m /= q; if (m % q === 0) return 0; cnt++; } } if (m > 1) cnt++; return cnt % 2 ? -1 : 1; };
const divisors = n => { const o = []; for (let d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; };
/* Square-free: no square of a number above 1 divides d. */
const sqFree = d => { for (let q = 2; q * q <= d; q++) if (d % (q * q) === 0) return false; return true; };

Object.assign(window.ORACLE, {
  q21b: p => { const f = phi(p.N); return [f, p.N - f]; },
  q21c: p => { const n = p.M * p.K, f = phi(n); return [phi(p.M), phi(p.K), f, n - f]; },
  /* a, b, c, d are the exponents of 2, 3, 5, 7 in the number. */
  q21d: p => { const n = 2 ** p.a * 3 ** p.b * 5 ** p.c * 7 ** p.d, f = phi(n); return [f, n - f]; },
  q22b: p => { const f = phi(p.M); return [f, p.K % f, powSlow(p.a, p.K, p.M)]; },
  /* the counter really ticks K times: reading × A each tick, mod 100 */
  q22c: p => { let v = p.S; for (let i = 0; i < p.K; i++) v = (v * p.A) % 100; return [p.K % 40, powSlow(p.A, p.K % 40, 100), v]; },
  q22d: p => { const s = powSlow(p.A, p.K, 1000); return [phi(1000), p.K % phi(1000), s, Math.floor(s / 100)]; },
  q23b: p => { const x = crtSearch([[p.r1, p.m1], [p.r2, p.m2]]), f = phi(p.M); return [x, p.K % f, powSlow(x, p.K, p.M)]; },
  q23c: p => { const y = crtSearch([[p.r1, p.m1], [p.r2, p.m2]]), x = crtSearch([[p.r1, p.m1], [p.r2, p.m2], [p.r3, p.m3]]); return [y, x, p.K % 40, powSlow(x, p.K, 100)]; },
  q23d: p => { const x = crtSearch([[p.r1, p.m1], [p.r2, p.m2]]), f = phi(1000); return [x, f, p.K % f, powSlow(x, p.K, 1000)]; },
  q24b: p => [factMod(p.p - 3, p.p), factMod(p.p - 1, p.p), factMod(p.p - 2, p.p)],
  q24c: p => { const A = factMod(p.p - 1, p.p), B = (2 * factMod(p.p - 3, p.p)) % p.p; return [A, B, (A + B) % p.p]; },
  q24d: p => [factMod(p.p - 3, p.p), factMod(p.p - 4, p.p), factMod(p.p - 5, p.p)],
  q25b: p => { const ds = divisors(p.N); return [mu(p.N), ds.filter(d => mu(d) === 1).length, ds.filter(d => mu(d) === -1).length]; },
  q25c: p => { let pos = 0, neg = 0; for (const d of divisors(p.N)) { const e = mu(d) * (p.N / d); if (e > 0) pos += e; else neg -= e; } return [pos, neg, pos - neg]; },
  q25d: p => { const ds = divisors(p.N); return [mu(p.N), ds.filter(sqFree).length, ds.filter(d => mu(d) === -1).length]; },
});
})();
