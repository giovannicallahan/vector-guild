/* Independent oracles for Logic and proof practice missions, file 7 of 8: q31b–q35d (game/realms/logic/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Primes by a sieve of Eratosthenes up to a fixed limit (every search below stays well inside it). */
const LIM = 20000, SIEVE = new Uint8Array(LIM + 1).fill(1); SIEVE[0] = SIEVE[1] = 0;
for (let i = 2; i * i <= LIM; i++) if (SIEVE[i]) for (let j = i * i; j <= LIM; j += i) SIEVE[j] = 0;
const isPrime = x => x >= 2 && SIEVE[x] === 1;
const leastFactor = x => { for (let d = 2; d <= x; d++) if (x % d === 0) return d; return x; };
const bit = b => (b ? 1 : 0);
/* A claim that holds "from some n on": scan a long range, take the last failing n, and the answer is the next one. */
const firstFrom = test => { let last = 0; for (let n = 1; n <= 80; n++) if (!test(BigInt(n))) last = n; return last + 1; };

/* q31d: the negated promise, as the value of the expression at n. */
const V31D = { nm1: (n, c) => n * n - n + c, n3: (n, c) => n * n + 3 * n + c, n5: (n, c) => n * n + 5 * n + c, nm3: (n, c) => n * n - 3 * n + c, two: (n, c) => 2 * n * n + c };

/* q33: the two sides L and R of each if-and-only-if claim, as truth values for n. */
const SIDES = {
  plus: (n, a) => [(n + a) % 2 === 1, n % 2 === 0],   /* n + a is odd  iff  n is even */
  sum2: (n, a) => [(n + a) % 2 === 0, n % 2 === 0],   /* n + a is even iff  n is even */
  lin2: (n, a) => [(a * n) % 2 === 1, n % 2 === 1],   /* a n is odd    iff  n is odd  */
  cube: (n) => [(n * n * n) % 2 === 0, n % 2 === 0],  /* n³ is even    iff  n is even */
  mult: (n, a) => [(a * n) % 2 === 0, n % 2 === 0],   /* a n is even   iff  n is even */
  sqodd: (n) => [(n * n) % 2 === 1, n % 2 === 1]      /* n² is odd     iff  n is odd  */
};
/* The argument proves "if L then R" when fwd is 1 and "if R then L" when fwd is 0; swap lists the converse first. */
const direction = p => (p.fwd ? (p.swap ? 2 : 1) : (p.swap ? 1 : 2));
const table33 = p => { const t = []; for (let n = 1; n <= p.N; n++) { const [L, R] = SIDES[p.f](n, p.a); t.push({ L: bit(L), R: bit(R) }); } return t; };

/* q34: each flawed proof written as a list of step roles; the first step whose role is not "ok" is the wrong one. */
const PROOF = {
  cancel: v => ['ok', ...(v >= 1 ? ['ok'] : []), ...(v >= 2 ? ['ok'] : []), 'div0', 'ok', 'ok'],
  conv2: v => ['ok', ...(v >= 1 ? ['ok'] : []), ...(v >= 2 ? ['ok'] : []), 'ok', 'converse', 'ok'],
  ex3: v => [...Array(2 + v).fill('ok'), 'examples'],
  sq2: v => ['ok', ...(v >= 1 ? ['ok'] : []), ...(v >= 2 ? ['ok'] : []), 'converse', 'ok']
};
const KIND = { div0: 1, converse: 2, examples: 3 };
/* K only picks which proof text is shown and v how many extra sound steps it has before the flaw (layout, not logic),
   so the step roles above follow the prompt as written. What the oracle can check from the numbers it does check:
   that the flagged step really fails and the claim really is false; otherwise it returns NaN. */
const genuine = (K, v, p) => {
  if (K === 'cancel') { const x = p.t - p.s; return x !== p.r && (p.r - p.r) * (p.r + p.s) === p.t * (p.r - p.r); }  /* x = r is a second solution, and x − r is 0 there */
  if (K === 'conv2') return p.a % 2 === 0 && 2 % p.a !== 0;                    /* multiples of a are even, but 2 is not a multiple of a */
  if (K === 'ex3') { for (let i = 1; i <= 2 + v; i++) if (!isPrime(i * i - i + p.c)) return false; return !isPrime(p.c * p.c); }  /* examples prime, n = c fails */
  if (K === 'sq2') return (-p.k) * (-p.k) === p.k * p.k && -p.k !== p.k;      /* −k has the same square */
  return false;
};
const flaw = (K, v, p) => { const s = PROOF[K](v), i = s.findIndex(r => r !== 'ok'); return genuine(K, v, p) ? { steps: s.length, wrong: i + 1, kind: KIND[s[i]] } : { steps: NaN, wrong: NaN, kind: NaN }; };

Object.assign(window.ORACLE, {
  /* q31b: search n = 1, 2, 3 … for the first that both a and b divide but a × b does not. */
  q31b: p => { for (let n = 1; n < 100000; n++) if (n % p.a === 0 && n % p.b === 0 && n % (p.a * p.b) !== 0) return [n, n / p.a, n / p.b]; return []; },
  /* q31c: issue the codes a n + b in order; stop at the first that is not prime; add up the ones before it. */
  q31c: p => { const codes = []; for (let n = 1; n < 500; n++) { const c = p.a * n + p.b; if (!isPrime(c)) return [n, c, codes.reduce((s, x) => s + x, 0)]; codes.push(c); } return []; },
  /* q31d: first n at which the expression is not prime, its value, and its least factor above 1. */
  q31d: p => { for (let n = 1; n < 500; n++) { const v = V31D[p.f](n, p.c); if (!isPrime(v)) return [n, v, leastFactor(v)]; } return []; },
  /* q32b: first n above c with a dividing n × (n + 1); then the quotient. */
  q32b: p => { for (let n = p.c + 1; n < 100000; n++) if ((n * (n + 1)) % p.a === 0) return [n, n * (n + 1) / p.a]; return []; },
  /* q32c: walk the multiples of a above c until one leaves remainder 1 on division by b. */
  q32c: p => { for (let k = Math.floor(p.c / p.a) + 1; k < 100000; k++) { const m = k * p.a; if (m > p.c && m % p.b === 1) return [m, k, (m - 1) / p.b]; } return []; },
  /* q32d: walk the primes above c until p + d1 and p + d2 are prime as well. */
  q32d: p => { for (let q = p.c + 1; q < LIM - 20; q++) if (isPrime(q) && isPrime(q + p.d1) && isPrime(q + p.d2)) return [q, q + p.d1, q + p.d2]; return []; },
  /* q33b: the direction proved, how many rows have L true, how many have L and R both true. */
  q33b: p => { const t = table33(p); return [direction(p), t.filter(r => r.L).length, t.filter(r => r.L && r.R).length]; },
  /* q33c: the direction proved, how many rows have L true, how many rows have L and R equal. */
  q33c: p => { const t = table33(p); return [direction(p), t.filter(r => r.L).length, t.filter(r => r.L === r.R).length]; },
  /* q33d: the direction proved, how many rows have L true, how many have R false. */
  q33d: p => { const t = table33(p); return [direction(p), t.filter(r => r.L).length, t.filter(r => !r.R).length]; },
  /* q34b: the first wrong step and the kind of mistake. */
  q34b: p => { const f = flaw(p.K, p.v, p); return [f.wrong, f.kind]; },
  /* q34c: first wrong step, the steps before it, the steps from it to the end. */
  q34c: p => { const f = flaw(p.K, p.v, p); return [f.wrong, f.wrong - 1, f.steps - f.wrong + 1]; },
  /* q34d: the first wrong step of each of the three proofs. */
  q34d: p => p.K.map((K, i) => flaw(K, p.v[i], p).wrong),
  /* q35b: n² > a n + b, true from some n on; at that n, both sides (exact integers). */
  q35b: p => { const n = firstFrom(x => x * x > BigInt(p.a) * x + BigInt(p.b)); return [n, n * n, p.a * n + p.b]; },
  /* q35c: c^n > a n + b; count true and false over 1..M. */
  q35c: p => { let t = 0, f = 0; for (let n = 1; n <= p.M; n++) { if (BigInt(p.c) ** BigInt(n) > BigInt(p.a * n + p.b)) t++; else f++; } return [firstFrom(x => BigInt(p.c) ** x > BigInt(p.a) * x + BigInt(p.b)), f, t]; },
  /* q35d: c^n > a n + b; the gap there and at the next n. */
  q35d: p => { const gap = x => BigInt(p.c) ** x - (BigInt(p.a) * x + BigInt(p.b)); const n = firstFrom(x => gap(x) > 0n); return [n, Number(gap(BigInt(n))), Number(gap(BigInt(n + 1)))]; }
});
})();
