/* Independent oracles for Discrete mathematics learn missions, file b: q11–q20 (game/realms/disc/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Count the k-element selections from n items by walking every bit pattern of n places and keeping those with k ones. */
const popcount = x => { let c = 0; for (; x; x >>= 1) c += x & 1; return c; };
const subsetsOfSize = (n, k) => { let c = 0; for (let m = 0; m < (1 << n); m++) if (popcount(m) === k) c++; return c; };
/* Count the ordered fillings of k distinct jobs from n people, nobody twice, by a depth-first walk. */
const orderedPicks = (n, k) => { const used = new Array(n).fill(false);
  const go = d => { if (d === k) return 1; let c = 0;
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; c += go(d + 1); used[i] = false; } return c; };
  return go(0); };
Object.assign(window.ORACLE, {
  /* Every code (letter, first digit 1..a, second digit 0..b) is listed; f is the digit sum; the range is the set of sums seen. */
  q11: p => {
    let codes = 0; const seen = new Set();
    for (let l = 0; l < p.L; l++) for (let d1 = 1; d1 <= p.a; d1++) for (let d2 = 0; d2 <= p.b; d2++) { codes++; seen.add(d1 + d2); }
    return [codes, seen.size];
  },
  /* All orders of k different items in k spaces, listed one by one (a depth-first walk over unused items). */
  q12: p => [orderedPicks(p.k, p.k)],
  /* Ordered fillings of k jobs from N crew with nobody used twice, counted by a depth-first walk. */
  q13: p => [orderedPicks(p.N, p.k)],
  /* Teams of k from N: every bit pattern of N places is checked for exactly k ones. */
  q14: p => [subsetsOfSize(p.N, p.k)],
  /* Walk every N-bit string; count those with k ones and count all strings (each is one subset of the N crew). */
  q15: p => { let ones = 0; const total = 1 << p.N;
    for (let s = 0; s < total; s++) if (popcount(s) === p.k) ones++;
    return [ones, total]; },
  /* Multiply (a x + b y)^N out as an array of coefficients of x^i y^(N-i), one bracket at a time. */
  q16: p => {
    let poly = [1];
    for (let step = 0; step < p.N; step++) {
      const next = new Array(poly.length + 1).fill(0);
      poly.forEach((c, i) => { next[i + 1] += c * p.a; next[i] += c * p.b; });
      poly = next;
    }
    return [poly[p.k]];
  },
  /* kind 1 = order matters: count ordered fillings; kind 2 = order does not: count bit patterns with k ones. */
  q17: p => [p.kind, p.kind === 1 ? orderedPicks(p.N, p.k) : subsetsOfSize(p.N, p.k)],
  /* People 0..e-1 are engineers, the rest packers. Every crew of k (bit pattern) is tested for an engineer. */
  q18: p => {
    const n = p.e + p.m; let all = 0, none = 0, some = 0;
    for (let mask = 0; mask < (1 << n); mask++) {
      if (popcount(mask) !== p.k) continue;
      all++;
      if (mask & ((1 << p.e) - 1)) some++; else none++;
    }
    return [all, none, some];
  },
  /* Walk every way to hand out the N crates to k domes, counting all of them and those where nobody is left with 0. */
  q19: p => {
    let any = 0, atLeastOne = 0;
    const go = (dome, left, minOk) => {
      if (dome === p.k - 1) { any++; if (minOk && left >= 1) atLeastOne++; return; }
      for (let g = 0; g <= left; g++) go(dome + 1, left - g, minOk && g >= 1);
    };
    go(0, p.N, true);
    return [any, atLeastOne];
  },
  /* Check each code 1..N against the three numbers of triple number t (read from the prompts). */
  q20: p => {
    const triples = [[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 4, 5], [3, 4, 7], [3, 5, 7], [2, 5, 9], [3, 5, 8], [4, 5, 7], [2, 7, 9]];
    const d = triples[p.t]; let some = 0;
    for (let c = 1; c <= p.N; c++) if (d.some(x => c % x === 0)) some++;
    return [some, p.N - some];
  },
});
})();
