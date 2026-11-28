/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 7 of 8: q31b–q35d (game/realms/number/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
  /* helpers local to this file */
  /* Naive power mod m by repeated multiplication (no squaring). */
  const pw = (b, e, m) => { let r = 1 % m; for (let i = 0; i < e; i++) r = (r * b) % m; return r; };
  /* Legendre symbol from the list of squares: 1 if some x has x*x = a (mod p), else -1 (0 if p divides a). */
  const leg = (a, p) => { a = ((a % p) + p) % p; if (a === 0) return 0; for (let x = 1; x < p; x++) if ((x * x) % p === a) return 1; return -1; };
  /* Ways to write n as a*a + b*b with 0 <= a <= b. */
  const pairs = n => { const out = []; for (let a = 0; a * a <= n; a++) for (let b = a; a * a + b * b <= n; b++) if (a * a + b * b === n) out.push([a, b]); return out; };
  const fermat = n => pw(2, n - 1, n);
  const smallestFactor = n => { for (let d = 2; d <= n; d++) if (n % d === 0) return d; return n; };
  /* Fraction n/d (not reduced) -> [gcd, partial quotients] by Euclid. */
  const euclid = (n, d) => { const q = []; while (d) { q.push(Math.floor(n / d)); const r = n % d; n = d; d = r; } return [n, q]; };
  /* Value n/d of the continued fraction [c0; c1, ...], built from the tail. */
  const cfValue = c => { let n = c[c.length - 1], d = 1; for (let i = c.length - 2; i >= 0; i--) { const t = n; n = c[i] * n + d; d = t; } return [n, d]; };

Object.assign(window.ORACLE, {

  /* q31 */
  q31b: p => { const a = p.a % p.p; const e = (p.p - 1) / 2; const r = pw(a, e, p.p); return [e, r, r === 1 ? 1 : -1]; },
  q31c: p => { const sa = leg(p.a, p.p), sb = leg(p.b, p.p); return [sa, sb, (sa === 1 ? 4 : 7) + (sb === 1 ? 4 : 7)]; },
  q31d: p => { const e = (p.p - 1) / 2; const r = pw(p.a % p.p, e, p.p); const s = leg(p.a, p.p); let x = 0; if (s === 1) for (let k = 1; k <= e; k++) if ((k * k) % p.p === p.a % p.p) { x = k; break; } return [r, s, x]; },
  /* q32: p, q are the two odd primes (p is the top symbol (p/q)); p1, p2 are the two markers against the ring prime q */
  q32b: p => { const top = leg(p.p, p.q), flip = leg(p.q, p.p); return [p.q % p.p, top * flip, top]; },
  q32c: p => { const s1 = leg(p.p1, p.q), s2 = leg(p.p2, p.q); return [s1, s2, (s1 === 1 ? 1 : 0) + (s2 === 1 ? 1 : 0)]; },
  q32d: p => { const r = p.q % p.p; return [r, pw(r, (p.p - 1) / 2, p.p), leg(p.q, p.p), leg(p.p, p.q)]; },
  /* q33: x is the area */
  q33b: p => { const L = pairs(p.x); return [L.length ? 1 : 0, L.length]; },
  q33c: p => { const L = pairs(p.x).filter(t => t[0] >= 1); if (!L.length) return [0, 0, 0, 0]; const t = L[L.length - 1]; return [L.length, t[0], t[1], 4 * (t[0] + t[1])]; },
  q33d: p => { const L = pairs(p.x); return [L.length ? 1 : 0, L.length]; },
  /* q34: x (and y) is the serial n */
  q34b: p => { const r = fermat(p.x); return [r, r === 1 ? 0 : 1]; },
  q34c: p => { const r1 = fermat(p.x), r2 = fermat(p.y); return [r1, r2, (r1 !== 1 ? 1 : 0) + (r2 !== 1 ? 1 : 0)]; },
  q34d: p => { const r = fermat(p.x); return [r, r === 1 ? 1 : 0, smallestFactor(p.x)]; },
  /* q35: a0..a3 are the partial quotients; g is the scale factor of the lengths */
  q35b: p => { const f = cfValue([p.a0, p.a1, p.a2, p.a3]); return euclid(f[0], f[1])[1]; },
  q35c: p => { const f = cfValue([p.a0, p.a1, p.a2, p.a3]); let L = p.g * f[0], W = p.g * f[1], count = 0, side = 0; while (L > 0 && W > 0) { if (L < W) { const t = L; L = W; W = t; } side = W; while (L >= W) { L -= W; count++; } } return [count, side]; },
  q35d: p => { const f = cfValue([p.a0, p.a1, p.a2, p.a3]); const r = euclid(p.g * f[0], p.g * f[1]); return [r[0], ...r[1]]; },
});
})();
