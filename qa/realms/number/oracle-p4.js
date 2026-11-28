/* Independent oracles for Number theory: the hidden life of whole numbers practice missions, file 4 of 8: q16b–q20d (game/realms/number/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Every x from 0 to n - 1 with a x ≡ b (mod n), found by trying them all. */
const solveAll = (a, b, n) => { const out = []; for (let x = 0; x < n; x++) if ((a * x) % n === ((b % n) + n) % n) out.push(x); return out; };
/* Big-number power mod n by plain repeated multiplication of BigInt (the exponent is walked bit by bit from the top). */
const powMod = (a, e, n) => {
  const N = BigInt(n), E = BigInt(e); let r = 1n % N; const bits = E.toString(2);
  for (const bit of bits) { r = (r * r) % N; if (bit === '1') r = (r * BigInt(a)) % N; }
  return Number(r);
};
/* Tick the calendar day by day (weekday and rest-cycle) is too long for big N, so reduce with the Chinese-free rule: n days = full cycles + leftover. */
const wrap = (start, days, len) => { let d = start % len; const rest = Number(BigInt(days) % BigInt(len)); for (let i = 0; i < rest; i++) d = (d + 1) % len; return d; };
/* First x from lo up with x ≡ r1 (mod m1) and x ≡ r2 (mod m2) ... listed by search up to a limit. */
const crtList = (mods, rems, lo, hi) => { const out = []; for (let x = lo; x <= hi; x++) if (mods.every((m, i) => x % m === rems[i] % m)) out.push(x); return out; };
Object.assign(window.ORACLE, {
  /* Try every press count 0..n-1; count the ones that land on b and report the last. */
  q16b: p => { const s = solveAll(p.a, p.b, p.n); return [s.length, s[s.length - 1]]; },
  /* Drive the shuttle trip by trip from dock s; b is the shift needed (the loader's dock is s + b mod n, not b itself). */
  q16c: p => {
    const hits = []; let dock = p.s % p.n;
    for (let x = 0; x < p.n; x++) { if (dock === (p.s + p.b) % p.n) hits.push(x); dock = (dock + p.a) % p.n; }
    return [hits[0], hits.length];
  },
  /* Pulse the mount one at a time; record every count that lands on b. */
  q16d: p => {
    const hits = []; let pos = 0;
    for (let x = 0; x < p.n; x++) { if (pos === p.b % p.n) hits.push(x); pos = (pos + p.a) % p.n; }
    return [hits.length, hits[0], hits[hits.length - 1]];
  },
  /* Walk the week forward N days (N reduced to leftover steps of the 7-cycle); then visit by visit from today. */
  q17b: p => {
    let day = p.s; for (let i = 0; i < p.N % 7; i++) day = (day + 6) % 7; /* N days ago: step back one weekday at a time */
    const target = (p.s + 6) % 7; let d = p.s, x = 0;
    for (let i = 1; i <= 7; i++) { d = (d + p.k) % 7; if (d === target) { x = i; break; } }
    return [day, x];
  },
  /* Total days = k × m; the weekday is found by stepping the week forward that many days (leftover steps only). */
  q17c: p => { const total = p.k * p.m; return [total, wrap(p.s, total, 7)]; },
  /* Weekday and rest-cycle day after N days; drone visits tried one by one until the rest-cycle day is c + 1. */
  q17d: p => {
    const wd = wrap(p.s, p.N, 7), rd = wrap(p.c, p.N, p.m);
    const target = (p.c + 1) % p.m; let d = p.c, x = 0;
    for (let i = 1; i <= p.m; i++) { d = (d + p.k) % p.m; if (d === target) { x = i; break; } }
    return [wd, rd, x];
  },
  /* Smallest x ≥ 1 matching both leftovers, found by search; the next fit is the next hit. */
  q18b: p => { const l = crtList([p.m1, p.m2], [p.r1, p.r2], 1, 2 * p.m1 * p.m2 + 5); return [l[0], l[1]]; },
  /* The only count in (L, L + m1 m2] with both leftovers (the window is one product long). */
  q18c: p => { const l = crtList([p.m1, p.m2], [p.r1, p.r2], p.L + 1, p.L + p.m1 * p.m2); return [p.m1 * p.m2, l[0]]; },
  /* Search lengths x ≥ 1: a x ≡ b (mod m1), x ≡ r2 (mod m2), x ≡ r3 (mod m3); report the leftover of the first hit mod m1. */
  q18d: p => {
    for (let x = 1; x <= p.m1 * p.m2 * p.m3; x++) {
      if ((p.a * x) % p.m1 === p.b % p.m1 && x % p.m2 === p.r2 % p.m2 && x % p.m3 === p.r3 % p.m3) return [x % p.m1, x];
    }
    return [null, null];
  },
  /* Number of 1-bits in k (entries multiplied) and a^k mod n by walking the bits of k. */
  q19b: p => [p.k.toString(2).split('').filter(b => b === '1').length, powMod(p.a, p.k, p.n)],
  /* Each relay by bit-walking; then add and reduce. */
  q19c: p => { const A = powMod(p.a, p.k, p.n), B = powMod(p.b, p.k, p.n); return [A, (A + B) % p.n]; },
  /* Squarings = largest j with 2^j ≤ k; key by bit-walking; stamp = key × serial mod n. */
  q19d: p => { let j = 0; while (Math.pow(2, j + 1) <= p.k) j++; const key = powMod(p.a, p.k, p.n); return [j, key, (key * p.s) % p.n]; },
  /* k mod (p − 1) by long division of the digits; the code is a^k mod p from the full exponent. */
  q20b: p => { let r = 0; for (const ch of String(p.k)) r = (r * 10 + Number(ch)) % (p.p - 1); return [r, powMod(p.a, p.k, p.p)]; },
  /* Rotor A from the full exponent; the product of the two outputs mod p. */
  q20c: p => { const A = powMod(p.a, p.k, p.p), B = powMod(p.b, p.m, p.p); return [A, (A * B) % p.p]; },
  /* The whole exponent b^c as a big number: its remainder mod p − 1, and a to that full power mod p. */
  q20d: p => { const e = BigInt(p.b) ** BigInt(p.c); return [Number(e % BigInt(p.p - 1)), powMod(p.a, e, p.p)]; },
});
})();
