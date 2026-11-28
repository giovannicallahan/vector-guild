/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 1 of 8: q01b–q05d (game/realms/number/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Division with remainder by search: the largest q with q*b <= n, so 0 <= r < b (works for negative n). */
const divmod = (n, b) => {
  let q = 0;
  if (n >= 0) { while ((q + 1) * b <= n) q++; } else { while (q * b > n) q--; }
  return [q, n - q * b];
};
/* Digits of n in base b, most significant first, by repeated division. */
const toDigits = (n, b) => { const d = []; while (n > 0) { const [q, r] = divmod(n, b); d.unshift(r); n = q; } return d; };
/* Value of a digit list in base b by listing place values (no Horner). */
const fromDigits = (ds, b) => { let total = 0; ds.forEach((d, i) => { let place = 1; for (let k = 0; k < ds.length - 1 - i; k++) place *= b; total += d * place; }); return total; };
/* Smallest divisor above 1, by trial; the number itself when prime. */
const smallestDivisor = n => { for (let d = 2; d <= n; d++) if (n % d === 0) return d; return n; };
/* Primes up to N by a sieve. */
const primesUpTo = N => { const s = new Array(N + 1).fill(true), out = []; for (let i = 2; i <= N; i++) if (s[i]) { out.push(i); for (let j = i * i; j <= N; j += i) s[j] = false; } return out; };
/* Prime factorisation by trial division: list of [prime, exponent]. */
const factorise = n => { const f = []; for (let d = 2; n > 1; d++) { let e = 0; while (n % d === 0) { n /= d; e++; } if (e) f.push([d, e]); } return f; };
const expOf = (f, pr) => { const hit = f.find(x => x[0] === pr); return hit ? hit[1] : 0; };
const pw = (b, e) => { let r = 1; for (let i = 0; i < e; i++) r *= b; return r; };
const build4 = (a, b, c, d) => pw(2, a) * pw(3, b) * pw(5, c) * pw(7, d);
/* gcd and lcm by search over the numbers themselves. */
const gcdSearch = (x, y) => { for (let g = Math.min(x, y); g >= 1; g--) if (x % g === 0 && y % g === 0) return g; return 1; };
const lcmSearch = (x, y) => { for (let m = Math.max(x, y); ; m += Math.max(x, y)) if (m % x === 0 && m % y === 0) return m; };
Object.assign(window.ORACLE, {
  /* a = b q + r for the load, then -m = b q + r for the shortage, both by searching for the largest q with b q at or below the number. */
  q01b: p => [...divmod(p.a, p.b), ...divmod(-p.m, p.b)],
  /* Bolts into crates of b (quotient crates, remainder loose), crates into trolleys of c. */
  q01c: p => { const [crates, loose] = divmod(p.a, p.b), [trolleys, waiting] = divmod(crates, p.c); return [loose, trolleys, waiting]; },
  /* Balance a - m (negative), then the opening stock a, each divided by b with a non-negative remainder. */
  q01d: p => [...divmod(p.a - p.m, p.b), ...divmod(p.a, p.b)],
  /* Digits w x y z in base b (place values listed out); then 81-style number k written in base b, three digits. */
  q02b: p => [fromDigits([p.w, p.x, p.y, p.z], p.b), ...toDigits(p.k, p.b)],
  /* Add the two pallets as base-ten values, then write the total in base b. */
  q02c: p => { const t = fromDigits([p.u2, p.u1, p.u0], p.b) + fromDigits([p.v2, p.v1, p.v0], p.b); return [t, ...toDigits(t, p.b)]; },
  /* Five base-b digits to base ten, then divide by the box size c. */
  q02d: p => { const n = fromDigits([p.e4, p.e3, p.e2, p.e1, p.e0], p.b); return [n, ...divmod(n, p.c)]; },
  /* Sieve of 2..N counts primes; smallest row is the first divisor above 1 of k. Answer order: prime count, row length. */
  q03b: p => [primesUpTo(p.N).length, smallestDivisor(p.k)],
  /* Racks 2..N split into prime and composite; bolts = t per crate rack. */
  q03c: p => { const f = primesUpTo(p.N).length, c = p.N - 1 - f; return [f, c, c * p.t]; },
  /* Smallest row length of k, and how many primes up to N leave remainder r on division by m. */
  q03d: p => [smallestDivisor(p.k), primesUpTo(p.N).filter(q => divmod(q, p.m)[1] === p.r).length],
  /* Parameters a b c d are the exponents of 2, 3, 5, 7 in the number; rebuild it, factorise it by trial division, read off the exponents and the count. */
  q04b: p => { const f = factorise(build4(p.a, p.b, p.c, p.d)); return [expOf(f, 2), expOf(f, 3), expOf(f, 5), expOf(f, 7), f.reduce((s, x) => s + x[1], 0)]; },
  /* n = 2^a 3^b 5^c 7^d; find the smallest m >= 1 making n m a perfect square by trying m = 1, 2, 3, ...; then the side. */
  q04c: p => {
    const n = build4(p.a, p.b, p.c, p.d);
    for (let m = 1; ; m++) { const t = n * m; let s = 0; while (s * s < t) s++; if (s * s === t) return [m, s]; }
  },
  /* n = 2^a 3^b 5^c 7^d q (q is the one larger prime); factorise and read the exponents and the prime above 7. */
  q04d: p => { const f = factorise(build4(p.a, p.b, p.c, p.d) * p.q); return [expOf(f, 2), expOf(f, 3), expOf(f, 5), expOf(f, 7), f.filter(x => x[0] > 7)[0][0]]; },
  /* Reels of A and B metres: longest common piece and first common flash time by search; a2..a7 and b2..b7 are exponents of 2, 3, 5, 7 of A and B. */
  q05b: p => { const A = build4(p.a2, p.a3, p.a5, p.a7), B = build4(p.b2, p.b3, p.b5, p.b7); return [gcdSearch(A, B), lcmSearch(A, B)]; },
  /* Identical kits: as many as possible is the highest common factor of the counts; each kit holds count / kits. */
  q05c: p => { const A = build4(p.a2, p.a3, p.a5, p.a7), B = build4(p.b2, p.b3, p.b5, p.b7), g = gcdSearch(A, B); return [g, A / g, B / g]; },
  /* Walk second by second to T, noting each time both lamps flash together after second 0. */
  q05d: p => {
    const A = build4(p.a2, p.a3, p.a5, p.a7), B = build4(p.b2, p.b3, p.b5, p.b7);
    let first = 0, count = 0, last = 0;
    for (let s = 1; s <= p.T; s++) if (s % A === 0 && s % B === 0) { if (!first) first = s; count++; last = s; }
    return [first || lcmSearch(A, B), count, p.T - last];
  },
});
})();
