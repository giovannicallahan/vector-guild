/* Independent oracles for Number theory: the hidden life of whole numbers learn missions, file d: q31–q40 (game/realms/number/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Helpers: brute force, no formulas from the lessons. */
const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
/* a^e mod m by repeated multiplication. */
const powMod = (a, e, m) => { let r = 1 % m; for (let i = 0; i < e; i++) r = (r * a) % m; return r; };
/* Legendre symbol by definition: 0 if p | a, 1 if some x has x² ≡ a (mod p), else −1. */
const legendre = (a, p) => { a = ((a % p) + p) % p; if (a === 0) return 0; for (let x = 1; x < p; x++) if ((x * x) % p === a) return 1; return -1; };
/* Continued fraction [a0; a1, ...] folded from the right into an exact fraction [num, den]. */
const cfValue = list => { let n = list[list.length - 1], d = 1; for (let i = list.length - 2; i >= 0; i--) { const nn = list[i] * n + d; d = n; n = nn; } const g = gcd(n, d); return [n / g, d / g]; };
/* Continued fraction of n/d by the division algorithm. */
const cfOf = (n, d) => { const out = []; while (d) { out.push(Math.floor(n / d)); const r = n % d; n = d; d = r; } return out; };
Object.assign(window.ORACLE, {
  /* p = prime, a = residue tested. Euler power by repeated multiplication; symbol by looking for a square root. */
  q31: p => [powMod(p.a, (p.p - 1) / 2, p.p), legendre(p.a, p.p)],
  /* p, q = odd primes. Symbols decided by listing squares mod the prime underneath. */
  q32: p => [p.q % p.p, legendre(p.q, p.p), legendre(p.p, p.q)],
  /* x = block area. Try every a with a² ≤ x − a² and test whether the rest is a perfect square. */
  q33: p => {
    let ways = 0;
    for (let a = 0; 2 * a * a <= p.x; a++) { const r = p.x - a * a; let b = 0; while (b * b < r) b++; if (b * b === r) ways++; }
    return [ways > 0 ? 1 : 0, ways];
  },
  /* x = the odd number n tested. */
  q34: p => { const r = powMod(2, p.x - 1, p.x); return [r, r === 1 ? 1 : 0]; },
  /* a0..a3 = the partial quotients; the prompt shows only the fraction, so rebuild it and expand it again. */
  q35: p => cfOf(...cfValue([p.a0, p.a1, p.a2, p.a3])),
  /* a0..a3 = the key's partial quotients; C2 is the fraction of the first three, folded from the right. */
  q36: p => cfValue([p.a0, p.a1, p.a2]),
  /* a1, a2, a3 = partial quotients of the true value [0; a1, a2, a3] (a1..a3 only index the hidden fraction). The prompt
     gives only the six-place rounding m: search every denominator under 100 for a reduced fraction that rounds to m. */
  q37: p => {
    const [tn, td] = cfValue([0, p.a1, p.a2, p.a3]);
    const m = Math.round(tn * 1e6 / td);
    const hits = [];
    for (let d = 1; d < 100; d++) for (let n = 0; n <= d; n++) if (gcd(n, d) === 1 && Math.round(n * 1e6 / d) === m) hits.push([n, d]);
    return hits.length === 1 ? hits[0] : [-1, -1];
  },
  /* p, q = secret primes, e = exponent, m = message. */
  q38: p => { const n = p.p * p.q; return [n, powMod(p.m, p.e, n)]; },
  /* p, q = secret primes, e = exponent, m = the hidden message (the ciphertext in the prompt is m^e mod n).
     φ by counting coprime numbers, d by searching, m recovered by decrypting. */
  q39: p => {
    const n = p.p * p.q;
    let phi = 0; for (let i = 1; i <= n; i++) if (gcd(i, n) === 1) phi++;
    let d = 1; while ((p.e * d) % phi !== 1) d++;
    const c = powMod(p.m, p.e, n);
    return [phi, d, powMod(c, d, n)];
  },
  /* N = top code, x, y = the pair. Count links a < b ≤ N with a | b; gcd by testing every number downwards. */
  q40: p => {
    let links = 0;
    for (let b = 1; b <= p.N; b++) for (let a = 1; a < b; a++) if (b % a === 0) links++;
    let g = Math.min(p.x, p.y); while (p.x % g || p.y % g) g--;
    return [links, g];
  },
});
})();
