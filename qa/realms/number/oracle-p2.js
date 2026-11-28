/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 2 of 8: q06b–q10d (game/realms/number/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Greatest common divisor by search: the largest g that divides both numbers. */
const gcdSearch = (a, b) => { for (let g = Math.min(a, b); g >= 1; g--) if (a % g === 0 && b % g === 0) return g; return 1; };
/* Least common multiple by search: walk the multiples of a until one is a multiple of b. */
const lcmSearch = (a, b) => { for (let m = a; ; m += a) if (m % b === 0) return m; };
/* All divisors by trial division up to the square root. */
const divisorsOf = n => { const out = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { out.push(d); if (d * d !== n) out.push(n / d); } return out; };
/* All divisors of a product of prime powers, listed by choosing an exponent for every prime (no big trial division). */
const divisorsOfPowers = pairs => { let list = [1]; for (const [pr, e] of pairs) { const next = []; for (const d of list) { let f = 1; for (let i = 0; i <= e; i++) { next.push(d * f); f *= pr; } } list = next; } return list; };
const sum = xs => xs.reduce((s, x) => s + x, 0);
const PR = [2, 3, 5, 7, 11, 13];
Object.assign(window.ORACLE, {
  /* q06b: longest equal piece = largest common divisor of the two lengths (search); pieces = each length ÷ piece. */
  q06b: p => { const g = gcdSearch(p.a, p.b); return [g, p.a / g + p.b / g]; },
  /* q06c: largest square tile side = largest common divisor of the two lengths; tiles = rows × columns. */
  q06c: p => { const g = gcdSearch(p.a, p.b); return [g, (p.a / g) * (p.b / g)]; },
  /* q06d: gcd by search, lcm by walking the multiples of a. */
  q06d: p => [gcdSearch(p.a, p.b), lcmSearch(p.a, p.b)],
  /* q07b: smallest positive x with 94x − 42k = gcd for a whole k (search over x); a, b are the two weights. */
  q07b: p => { const g = gcdSearch(p.a, p.b); for (let x = 1; ; x++) { const r = p.a * x - g; if (r % p.b === 0) return [g, x, r / p.b]; } },
  /* q07c: smallest x with a x − b k = gcd and k at least 1 (a real B departure); minute = a × x. */
  q07c: p => { const g = gcdSearch(p.a, p.b); for (let x = 1; ; x++) { const r = p.a * x - g; if (r > 0 && r % p.b === 0) return [g, x, p.a * x]; } },
  /* q07d: smallest positive x with a x − b k = c and k at least 1 (c is the distance to move); the gcd is searched too. */
  q07d: p => { const g = gcdSearch(p.a, p.b); for (let x = 1; ; x++) { const r = p.a * x - p.c; if (r > 0 && r % p.b === 0) return [g, x, r / p.b]; } },
  /* q08b: a x + b y = c with x, y at least 1: list every pair; count and the largest x. */
  q08b: p => { const xs = []; for (let x = 1; p.a * x < p.c; x++) { const r = p.c - p.a * x; if (r % p.b === 0) xs.push(x); } return [xs.length, Math.max(...xs)]; },
  /* q08c: a x + b y = c with x, y at least 1: count the pairs and find the least x + y. */
  q08c: p => { let ways = 0, best = Infinity; for (let x = 1; p.a * x < p.c; x++) { const r = p.c - p.a * x; if (r % p.b === 0) { ways++; best = Math.min(best, x + r / p.b); } } return [ways, best]; },
  /* q08d: a x + b y = c with x, y at least 1: count the pairs, then the first pair (smallest x). */
  q08d: p => { let ways = 0, first = null; for (let x = 1; p.a * x < p.c; x++) { const r = p.c - p.a * x; if (r % p.b === 0) { ways++; if (!first) first = [x, r / p.b]; } } return [ways, first[0], first[1]]; },
  /* q09b: tray 2^a 3^b 5^c 7^d (a..d are exponents of 2, 3, 5, 7): count its divisors by trial division;
     then list every divisor of r^u s^v t^w by choosing exponents (r, s, t are primes, u, v, w their exponents). */
  q09b: p => {
    const n = Math.pow(2, p.a) * Math.pow(3, p.b) * Math.pow(5, p.c) * Math.pow(7, p.d);
    return [divisorsOf(n).length, divisorsOfPowers([[p.r, p.u], [p.s, p.v], [p.t, p.w]]).length];
  },
  /* q09c: N = 2^a 3^b 5^c 7^d (a..d are exponents of 2, 3, 5, 7): divisors by trial division, then the odd ones. */
  q09c: p => {
    const n = Math.pow(2, p.a) * Math.pow(3, p.b) * Math.pow(5, p.c) * Math.pow(7, p.d), ds = divisorsOf(n);
    return [ds.length, ds.filter(d => d % 2 === 1).length];
  },
  /* q09d: N = product of PR[i]^exponent for a..f (exponents of 2, 3, 5, 7, 11, 13): divisors by trial division, then those divisible by m. */
  q09d: p => {
    const es = [p.a, p.b, p.c, p.d, p.e, p.f]; let n = 1; es.forEach((e, i) => { n *= Math.pow(PR[i], e); });
    const ds = divisorsOf(n);
    return [ds.length, ds.filter(d => d % p.m === 0).length];
  },
  /* q10b: σ(p^a q^b) by listing the divisors and adding them; then σ(r^u s^v t^w) the same way (the prompt's σ(63)σ(8) route gives the same). */
  q10b: p => [sum(divisorsOfPowers([[p.p, p.a], [p.q, p.b]])), sum(divisorsOfPowers([[p.r, p.u], [p.s, p.v], [p.t, p.w]]))],
  /* q10c: divisors of p^a q^b r^c: their sum (cans) and their count (racks). */
  q10c: p => { const ds = divisorsOfPowers([[p.p, p.a], [p.q, p.b], [p.r, p.c]]); return [sum(ds), ds.length]; },
  /* q10d: N = 2^a 3^b 5^c 7^d 11^e (exponents of 2, 3, 5, 7, 11): sum of all divisors, then of the odd divisors, by trial division. */
  q10d: p => {
    const es = [p.a, p.b, p.c, p.d, p.e]; let n = 1; es.forEach((e, i) => { n *= Math.pow(PR[i], e); });
    const ds = divisorsOf(n);
    return [sum(ds), sum(ds.filter(d => d % 2 === 1))];
  },
});
})();
