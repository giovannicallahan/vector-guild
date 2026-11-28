/* Independent oracles for Logic and proof learn missions, file d: q31–q40 (game/realms/logic/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Smallest divisor above 1 by trial division; the number itself when it is prime. */
const lpf = v => { for (let d = 2; d * d <= v; d++) if (v % d === 0) return d; return v; };
const isPrime = v => v > 1 && lpf(v) === v;
/* Closed forms are avoided: these tabulate the sums term by term. */
const termOf = { nat: i => i, odd: i => 2 * i - 1, even: i => 2 * i, three: i => 3 * i - 2, pow: i => 2 ** (i - 1), sq: i => i * i, cube: i => i * i * i };
const sumTo = (f, n) => { let s = 0; for (let i = 1; i <= n; i++) s += termOf[f](i); return s; };

Object.assign(window.ORACLE, {
  /* Claim: the expression is prime for every n from 1 up. Walk n = 1, 2, 3 … until the value is composite. */
  q31: p => {
    const val = n => p.f === 'pow' ? 2 ** n + p.c : p.f === 'quad' ? n * n + n + p.c : p.a * n + p.b;
    for (let n = 1; n < 10000; n++) if (!isPrime(val(n))) return [n, val(n), lpf(val(n))];
    return [NaN, NaN, NaN];
  },
  /* Search upward from c + 1 for the first number that passes the stated test. */
  q32: p => {
    for (let m = p.c + 1; m < 1e6; m++) {
      let ok;
      if (p.f === 'twin') ok = isPrime(m) && isPrime(m + p.d);
      else if (p.f === 'mult') ok = m % p.a === 0 && m % p.b === 0;
      else { const r = Math.round(Math.sqrt(m)); ok = r * r === m && m % p.a === 0; }
      if (ok) return [m];
    }
    return [NaN];
  },
  /* P is the left side of the claim, Q the right. The argument supposes not-Q and reaches not-P (fwd = 1, the
     contrapositive of P → Q) or supposes not-P and reaches not-Q (fwd = 0, the contrapositive of Q → P). The
     directions are listed P → Q first, unless swap = 1. Then both sides are counted over 1…N. */
  q33: p => {
    const P = n => p.f === 'lin' ? (p.a * n + p.b) % 2 === 0 : p.f === 'div' ? n % p.a === 0 : (n * n) % 2 === 0;
    const Q = n => p.f === 'lin' ? n % 2 === 1 : p.f === 'div' ? (n + p.a * p.b) % p.a === 0 : n % 2 === 0;
    const order = p.swap ? ['QP', 'PQ'] : ['PQ', 'QP'];
    const proved = order.indexOf(p.fwd ? 'PQ' : 'QP') + 1;
    let cp = 0, cq = 0;
    for (let n = 1; n <= p.N; n++) { if (P(n)) cp++; if (Q(n)) cq++; }
    return [proved, cp, cq];
  },
  /* Count the steps of each proof as written and find the one that fails. */
  q34: p => {
    /* variant flag v = 1 means the proof is written with one extra step before the flaw. */
    const stepOf = (kind, v) => {
      const lines = {
        zero: v ? ['let', 'multiply', 'subtract', 'factor', 'DIVIDE', 'numbers'] : ['let', 'multiply', 'subtract and factor', 'DIVIDE', 'numbers'],
        root: v ? ['equal squares', 'equal numbers have equal squares', 'SQUARES EQUAL SO NUMBERS EQUAL', 'add'] : ['equal squares', 'SQUARES EQUAL SO NUMBERS EQUAL', 'add'],
        conv: v ? ['let', 'note', 'every multiple of big is multiple of small', 'SO N IS A MULTIPLE OF BIG', 'therefore'] : ['let', 'every multiple of big is multiple of small', 'SO N IS A MULTIPLE OF BIG', 'therefore'],
        ex: v ? ['n=1', 'n=2', 'n=3', 'GENERAL FROM EXAMPLES'] : ['n=1', 'n=2', 'GENERAL FROM EXAMPLES'],
        divx: v ? ['start', 'products', 'DIVIDE BY X', 'only solution'] : ['start', 'DIVIDE BY X', 'only solution'],
      }[kind];
      return lines.findIndex(s => s === s.toUpperCase() && /[A-Z]/.test(s)) + 1;
    };
    /* A, B and va, vb only choose the proof texts and whether each has one extra sound step (layout, not logic), so the
       step lists above follow the prompt as written. The oracle checks from the numbers that each flaw is genuine: the
       divisor really is 0, the converse really fails, the examples are prime but a later n is not, a number and its
       negative really share a square, x = 0 really is a second solution. Otherwise NaN. */
    const genuine = (kind, v) => ({
      zero: p.k - p.k === 0 && 2 * p.k !== p.k,
      conv: (p.p * p.q) % p.p === 0 && p.p % (p.p * p.q) !== 0,
      ex: [...Array(2 + v)].every((_, i) => isPrime((i + 1) * (i + 1) + (i + 1) + p.c)) && !isPrime((p.c - 1) * (p.c - 1) + (p.c - 1) + p.c),
      root: (-p.k) * (-p.k) === p.k * p.k && -p.k !== p.k,
      divx: 0 * 0 === p.r * 0 && p.r !== 0,
    })[kind];
    const at = (kind, v) => genuine(kind, v) ? stepOf(kind, v) : NaN;
    return [at(p.A, p.va), at(p.B, p.vb)];
  },
  /* Walk n = 1, 2, 3 … comparing c^n with an + b; the base case is the first n from which the claim stays true
     (checked a long way on). */
  q35: p => {
    const holds = n => BigInt(p.c) ** BigInt(n) > BigInt(p.a * n + p.b);
    let first = null;
    for (let n = 1; n < 60 && first === null; n++) { let all = true; for (let m = n; m < n + 30; m++) if (!holds(m)) { all = false; break; } if (all) first = n; }
    return [p.c ** 1, p.a * 1 + p.b, first];
  },
  /* Sum the terms one by one up to k, then the next term, then add. */
  q36: p => {
    const s = sumTo(p.f, p.k), add = termOf[p.f](p.k + 1);
    return [s, add, s + add];
  },
  /* Tabulate the terms 1…n and add them up, then the (n + 1)th term. */
  q37: p => [sumTo(p.f, p.n), termOf[p.f](p.n + 1)],
  /* Test n = 1, 2, 3 … with exact integers; N is the start of the final unbroken run of true cases. */
  q38: p => {
    const A = BigInt(p.a), holds = n => A ** BigInt(n) > BigInt(p.c) * BigInt(n) ** BigInt(p.b);
    let N = 301;
    for (let n = 300; n >= 1 && holds(n); n--) N = n;
    return [N, Number(A ** BigInt(N)), p.c * N ** p.b];
  },
  /* Mark which amounts 0…400 can be paid with the two stamps (dynamic programme). The largest unpayable amount is
     the answer. Strong induction steps back by the smaller stamp, so it needs that many consecutive base cases. */
  q39: p => {
    const M = 400, can = new Array(M + 1).fill(false); can[0] = true;
    for (let v = 1; v <= M; v++) can[v] = (v >= p.a && can[v - p.a]) || (v >= p.b && can[v - p.b]);
    let last = -1; for (let v = 0; v <= M; v++) if (!can[v]) last = v;
    return [last, Math.min(p.a, p.b)];
  },
  /* ε = e ÷ 1000. Step N upward until 1 ÷ N is below ε (compared as 1000 < e × N, whole numbers), then add the
     terms of the sum up to N. */
  q40: p => {
    let N = 1; while (!(1000 < p.e * N)) N++;
    return [N, sumTo(p.f, N)];
  },
});
})();
