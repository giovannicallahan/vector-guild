/* Independent oracles for Abstract algebra: patterns of moves practice missions, file 3 of 8: q11b–q15d (game/realms/abstract/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Press a key (multiply by a mod m) from 1 until 1 shows again: the list of codes after 1, 2, ... presses. */
const codes = (a, m) => { const l = []; let x = 1; do { x = (x * a) % m; l.push(x); } while (x !== 1 && l.length < 10000); return l; };
/* Undoing number: try every number 1..m-1 until a * b leaves remainder 1. */
const undo = (a, m) => { for (let b = 1; b < m; b++) if ((a * b) % m === 1) return b; return NaN; };
/* Counter adding s mod M from 0: beats until it first shows 0 again, by walking. */
const addWalk = (s, M) => { let x = 0, n = 0; do { x = (x + s) % M; n++; } while (x !== 0 && n < 10000); return n; };
/* Follow a permutation (list of images of 1..n, 0-based list) k times from start x (a number 1..n). */
const follow = (p, x, k) => { for (let i = 0; i < k; i++) x = p[x - 1]; return x; };
/* Cycles of a permutation given as the list of images of 1..n: lengths found by walking from each unvisited point. */
const cycleLens = p => {
  const seen = new Array(p.length + 1).fill(false), out = [];
  for (let s = 1; s <= p.length; s++) {
    if (seen[s]) continue;
    let x = s, len = 0;
    while (!seen[x]) { seen[x] = true; x = p[x - 1]; len++; }
    out.push(len);
  }
  return out;
};
const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
Object.assign(window.ORACLE, {
  /* q11b: p.m modulus, p.a key. */
  q11b: p => { const c = codes(p.a, p.m); return [c.length, undo(p.a, p.m)]; },
  /* q11c: p.m modulus, p.a multiplier, p.t beats; the dial is simply run on for t beats without reset. */
  q11c: p => {
    const c = codes(p.a, p.m); let x = 1;
    for (let i = 0; i < p.t; i++) x = (x * p.a) % p.m;
    return [c.length, undo(p.a, p.m), x];
  },
  /* q11d: p.M counter size, p.s counter step, p.n keypad modulus, p.a keypad multiplier. */
  q11d: p => [addWalk(p.s, p.M), codes(p.a, p.n).length, undo(p.a, p.n)],
  /* q12b: p.s and p.t images of 1..n; p.i the start channel. */
  q12b: p => [follow(p.s, follow(p.t, p.i, 1), 1), follow(p.t, follow(p.s, p.i, 1), 1)],
  /* q12c: p.a, p.b, p.c gates 1, 2, 3 (images of 1..n); p.i and p.j the two starting slots. */
  q12c: p => [p.i, p.j].map(x => follow(p.c, follow(p.b, follow(p.a, x, 1), 1), 1)),
  /* q12d: p.s, p.t images of 1..n; p.i, p.j the two input sockets. tau inverse found by searching for the socket sent to x. */
  q12d: p => {
    const tinv = x => p.t.indexOf(x) + 1;
    return [p.s[tinv(p.i) - 1], tinv(p.s[p.j - 1])];
  },
  /* q13b: p.p images of 1..n. Shifts until home = lcm of cycle lengths. */
  q13b: p => { const l = cycleLens(p.p); return [l.length, l.reduce(lcm, 1)]; },
  /* q13c: p.p images, p.i the shelf asked about (cycle through i, and where it sits after p.t nights, run night by night). */
  q13c: p => {
    let len = 0, x = p.i; do { x = p.p[x - 1]; len++; } while (x !== p.i);
    return [len, cycleLens(p.p).reduce(lcm, 1), follow(p.p, p.i, p.t)];
  },
  /* q13d: rings of ma and mb sockets, steps sa and sb. Cycle through 0 found by walking. */
  q13d: p => {
    const walk = (s, m) => { let x = s % m, n = 1; while (x !== 0) { x = (x + s) % m; n++; } return n; };
    const la = walk(p.sa, p.ma), lb = walk(p.sb, p.mb);
    return [la, lb, p.ma / la + p.mb / lb, lcm(la, lb)];
  },
  /* q14b: p.p images of 1..n. Swaps = sum (L-1); sign by parity of swaps. */
  q14b: p => { const sw = cycleLens(p.p).reduce((a, L) => a + L - 1, 0); return [sw, sw % 2 === 0 ? 1 : -1]; },
  /* q14c: p.p images, p.w minutes per swap. */
  q14c: p => { const l = cycleLens(p.p), sw = l.reduce((a, L) => a + L - 1, 0); return [l.length, sw, sw * p.w]; },
  /* q14d: sigma after tau, built socket by socket: x -> s[t[x]]. */
  q14d: p => {
    const c = p.t.map(y => p.s[y - 1]);
    const sw = cycleLens(c).reduce((a, L) => a + L - 1, 0);
    return [sw, sw % 2 === 0 ? 1 : -1];
  },
  /* q15b: p.N positions, p.w clamped tubes: n = N - w free. Odd = half of n! for n >= 2 (none for n = 1). */
  q15b: p => { const n = p.N - p.w, f = fact(n); return [f, n >= 2 ? f / 2 : 0, n * (n - 1) / 2]; },
  /* q15c: p.k trays, p.w minutes per test. Even = half of k! (k >= 2). */
  q15c: p => { const f = fact(p.k), ev = p.k >= 2 ? f / 2 : f; return [f, ev, ev * p.w]; },
  /* q15d: p.N sockets, p.w locked: n = N - w free. Even = n!/2; odd non-swaps = n!/2 - C(n,2). */
  q15d: p => { const n = p.N - p.w, h = fact(n) / 2; return [h, h - n * (n - 1) / 2]; },
});
})();
