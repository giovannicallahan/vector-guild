/* Independent oracles for Number theory: the hidden life of whole numbers learn missions, file b: q11–q20 (game/realms/number/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
  /* Cans of a and b litres, order c, at least one of each; drums: count divisors. Search everything by brute force. */
  q11: p => {
    let g = 1;
    for (let d = 1; d <= Math.min(p.a, p.b); d++) if (p.a % d === 0 && p.b % d === 0) g = d;
    let ways = 0;
    for (let x = 1; x * p.a < p.c; x++) for (let y = 1; x * p.a + y * p.b <= p.c; y++) if (x * p.a + y * p.b === p.c) ways++;
    let tau = 0;
    for (let d = 1; d <= p.c; d++) if (p.c % d === 0) tau++;
    return [g, ways, tau];
  },
  /* Walk the loop of n stops one stop at a time: forward A, backward B (stepping back from 0), then compare C and D by
     walking each to its stop. Parameters n, A, B, C, D are the loop size and the three counts as printed. */
  q12: p => {
    const walk = (steps) => { let s = 0; const dir = steps >= 0 ? 1 : -1; for (let i = 0; i < Math.abs(steps); i++) s = (s + dir + p.n) % p.n; return s; };
    return [walk(p.A), walk(-p.B), walk(p.C) === walk(p.D) ? 1 : 0];
  },
  /* Run A shifts then B shifts round a cycle of n; convoy: repeat the B-shift run A times (stepwise on the cycle). */
  q13: p => {
    const walk = (pos, steps) => { for (let i = 0; i < steps; i++) pos = (pos + 1) % p.n; return pos; };
    const second = walk(walk(0, p.A), p.B);
    const b = walk(0, p.B);
    let pos = 0; for (let i = 0; i < p.A; i++) pos = (pos + b) % p.n;
    return [second, pos];
  },
  /* Remainders of N by long division digit by digit (Horner on the decimal string). */
  q14: p => {
    const r = m => { let x = 0; for (const ch of String(p.N)) x = (x * 10 + Number(ch)) % m; return x; };
    return [r(3), r(9), r(11)];
  },
  /* Try every number of jumps k from 1 to n-1: the first with a*k leaving 1 over. */
  q15: p => { for (let k = 1; k < p.n; k++) if ((p.a * k) % p.n === 1) return [k]; return [NaN]; },
  /* Check every x from 0 to n-1: the tram stands at stop (a*x mod n). Count those landing on b, and the first. */
  q16: p => {
    const hits = [];
    for (let x = 0; x < p.n; x++) if ((p.a * x) % p.n === p.b % p.n) hits.push(x);
    return [hits.length, hits[0]];
  },
  /* Day numbers walked: s is today's weekday; the convoy leaves N days on (week of 7, walked day by day).
     The drone lands every k days: try x = 1..6 landings, each landing moving k days on, to stand at s+1. */
  q17: p => {
    let d = p.s; for (let i = 0; i < p.N; i++) d = (d + 1) % 7;
    let x = NaN, pos = p.s;
    for (let i = 1; i <= 6; i++) { for (let j = 0; j < p.k; j++) pos = (pos + 1) % 7; if (pos === (p.s + 1) % 7) { x = i; break; } }
    return [d, x];
  },
  /* Count up from 1: the first length leaving all three remainders. The gap is the product of the three moduli. */
  q18: p => {
    for (let x = 1; x <= p.m1 * p.m2 * p.m3 + 1; x++)
      if (x % p.m1 === p.r1 && x % p.m2 === p.r2 && x % p.m3 === p.r3) return [x, p.m1 * p.m2 * p.m3];
    return [NaN, NaN];
  },
  /* Squarings: build the list of exponents 1, 2, 4, ... while not above k, counting the steps after the first.
     The residue: multiply a into the running value k times would be too long, so cycle through the powers of a mod n,
     find where they repeat, and read the entry at k from the cycle. */
  q19: p => {
    let e = 1, sq = 0; while (e * 2 <= p.k) { e *= 2; sq++; }
    const seen = new Map(), list = []; let v = 1 % p.n, i = 0;
    while (!seen.has(v)) { seen.set(v, i); list.push(v); v = (v * p.a) % p.n; i++; }
    const start = seen.get(v), len = i - start;
    const idx = p.k < list.length ? p.k : start + ((p.k - start) % len);
    return [sq, list[idx]];
  },
  /* Reduced exponent: k mod (p-1) as stated. The power: cycle through powers of a mod p, then read the entry at k. */
  q20: p => {
    const seen = new Map(), list = []; let v = 1, i = 0;
    while (!seen.has(v)) { seen.set(v, i); list.push(v); v = (v * (p.a % p.p)) % p.p; i++; }
    const start = seen.get(v), len = i - start;
    const idx = p.k < list.length ? p.k : start + ((p.k - start) % len);
    return [p.k % (p.p - 1), list[idx]];
  },
});
})();
