/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 3 of 8: q11b–q15d (game/realms/number/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Helpers. Each works from the definition, not from a formula in the pack. */
const gcdOf = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
/* Smallest positive number that both a and b divide, found by searching the multiples of a. */
const lcmOf = (a, b) => { for (let m = a; ; m += a) if (m % b === 0) return m; };
/* Number of divisors d of n with 1 <= d <= n, found by trial. */
const divisors = n => { let c = 0; for (let d = 1; d <= n; d++) if (n % d === 0) c++; return c; };
/* Solutions of a x + b y = c with x, y >= 1, found by trying every x. */
const mixes = (a, b, c) => { const out = []; for (let x = 1; a * x < c; x++) { const rest = c - a * x; if (rest % b === 0 && rest / b >= 1) out.push([x, rest / b]); } return out; };
/* Least residue of any whole number v mod n, by adding or taking away n until it lies from 0 to n - 1. */
const res = (v, n) => { while (v < 0) v += n; while (v >= n) v -= n; return v; };
/* Remainder of a decimal numeral (a string) on division by n, one digit at a time (long division). */
const remStr = (str, n) => { let r = 0; for (const ch of str) r = (r * 10 + Number(ch)) % n; return r; };
/* Modular inverse of a mod n: the k from 1 to n - 1 with a k leaving remainder 1, found by trying each k. */
const invMod = (a, n) => { for (let k = 1; k < n; k++) if (res(a * k, n) === 1) return k; return NaN; };
Object.assign(window.ORACLE, {
  /* q11b: gcd by Euclid, mixes by trying x, divisor count by trial. */
  q11b: p => [gcdOf(p.a, p.b), mixes(p.a, p.b, p.c).length, divisors(p.c)],
  /* q11c: all loads, then the least x + y among them. */
  q11c: p => { const L = mixes(p.a, p.b, p.c); return [L.length, Math.min(...L.map(l => l[0] + l[1]))]; },
  /* q11d: lcm by searching multiples, ways by trying x, divisors of the lcm by trial. */
  q11d: p => [lcmOf(p.a, p.b), mixes(p.a, p.b, p.c).length, divisors(lcmOf(p.a, p.b))],
  /* q12b: n lamps. A forward, B backward (a count of -B), C and D the logbook counts. */
  q12b: p => [res(p.A, p.n), res(-p.B, p.n), res(p.C - p.D, p.n) === 0 ? 1 : 0],
  /* q12c: m doors, start door s, forward A, back B, then forward C. */
  q12c: p => { const first = res(p.s + p.A - p.B, p.m); return [first, res(first + p.C, p.m)]; },
  /* q12d: base b with digits w, x, y, z read left to right (value built place by place); m positions. */
  q12d: p => { let v = 0; for (const d of [p.w, p.x, p.y, p.z]) v = v * p.b + d; return [v, res(v, p.m), res(-v, p.m)]; },
  /* q13b: modulus m; sum then product of A, B, C, reduced step by step. */
  q13b: p => { const r = [p.A, p.B, p.C].map(v => res(v, p.m)); let prod = 1; for (const x of r) prod = res(prod * x, p.m); return [res(r[0] + r[1] + r[2], p.m), prod]; },
  /* q13c: A boxes of B tickets, plus C loose, mod m. Counted by repeated addition of the box size mod m. */
  q13c: p => { let boxes = 0; const per = res(p.B, p.m); for (let i = 0; i < res(p.A, p.m); i++) boxes = res(boxes + per, p.m); return [boxes, res(boxes + p.C, p.m)]; },
  /* q13d: A*B + C*D and A cubed, mod m (A, B, C, D are the four batch sizes). */
  q13d: p => { const [a, b, c, d] = [p.A, p.B, p.C, p.D].map(v => res(v, p.m)); return [res(res(a * b, p.m) + res(c * d, p.m), p.m), res(res(a * a, p.m) * a, p.m)]; },
  /* q14b: digit rules read from the numeral itself: N as a string, remainders by long division. */
  q14b: p => { const t = String(p.N); return [remStr(t, 9), remStr(t, 11), remStr(t, 3) === 0 ? 1 : 0]; },
  /* q14c: try each check digit 0 to 8 appended to K; the remainder of the finished number on 11. */
  q14c: p => { for (let d = 0; d <= 8; d++) { const t = String(p.K) + d; if (remStr(t, 9) === 0) return [d, remStr(t, 11)]; } return [NaN, NaN]; },
  /* q14d: remainders of X and Y by long division, then combine (X + Y mod 9, X * Y mod 11). */
  q14d: p => { const X = String(p.X), Y = String(p.Y); return [res(remStr(X, 9) + remStr(Y, 9), 9), res(remStr(X, 11) * remStr(Y, 11), 11)]; },
  /* q15b: m teeth, pushes a and b: search for the number of pushes that lands on tooth 1. */
  q15b: p => [invMod(p.a, p.m), invMod(p.b, p.m)],
  /* q15c: push size a, target bay p (p is the bay, not a prime): inverse by search, then search k from 0 to m - 1 that lands on bay p. */
  q15c: p => { let k = 0; while (k < p.m && res(p.a * k, p.m) !== p.p) k++; return [invMod(p.a, p.m), k]; },
  /* q15d: key = A * B mod m from reduced residues, then its inverse by search. */
  q15d: p => { const key = res(res(p.A, p.m) * res(p.B, p.m), p.m); return [key, invMod(key, p.m)]; },
});
})();
