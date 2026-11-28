/* Independent oracles for Abstract algebra: patterns of moves practice missions, file 2 of 8: q06b–q10d (game/realms/abstract/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Euclid's gcd, by repeated remainder. */
const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
/* Keys 1..m-1 that can be undone: the numbers with gcd 1 with m (listed one at a time). */
const units = m => { const u = []; for (let x = 1; x < m; x++) if (gcd(x, m) === 1) u.push(x); return u; };
/* Inverse of a mod m by trying every key in turn. */
const inverse = (a, m) => { for (let b = 1; b < m; b++) if ((a * b) % m === 1) return b; return NaN; };
/* Walk the dial from 0, jumping a notches a beat: the list of positions at beats 1, 2, ... until back at 0 (a full cycle). */
const walk = (a, m) => { const pos = []; let x = 0; do { x = (x + a) % m; pos.push(x); } while (x !== 0); return pos; };
/* Order of a in Z_m (jumps) = length of that walk. */
const orderZ = (a, m) => walk(a, m).length;
/* The power table a^1, a^2, ... mod m, built by repeated multiplication, up to and including the first 1. */
const powTable = (a, m) => { const t = []; let x = 1; do { x = (x * a) % m; t.push(x); } while (x !== 1); return t; };
/* Beats k, one at a time: the position after k jumps of a on a ring of m (k up to a few thousand). */
const stepZ = (a, m, k) => { let x = 0; for (let i = 0; i < k; i++) x = (x + a) % m; return x; };
/* a^k mod m by plain repeated multiplication. */
const powStep = (a, m, k, start) => { let x = start === undefined ? 1 : start; for (let i = 0; i < k; i++) x = (x * a) % m; return x; };
/* Set of notches reached by key a in Z_m (a = 0 reaches only notch 0). */
const reach = (a, m) => { const s = new Set([0]); let x = 0; for (let i = 0; i < m; i++) { x = (x + a) % m; s.add(x); } return s; };
/* Number of generators of Z_m: keys whose reach is every notch. */
const genCount = m => { let n = 0; for (let g = 0; g < m; g++) if (reach(g, m).size === m) n++; return n; };
Object.assign(window.ORACLE, {
  /* q06b: p.m modulus, p.a key. Search for the inverse, count the coprime keys. */
  q06b: p => [inverse(p.a, p.m), units(p.m).length],
  /* q06c: p.m modulus, p.a multiplier, p.s scrambled code. Count units, inverse, then search x in 0..m-1 with a x = s. */
  q06c: p => {
    let x = -1; for (let t = 0; t < p.m; t++) if ((p.a * t) % p.m === p.s) { x = t; break; }
    return [units(p.m).length, inverse(p.a, p.m), x];
  },
  /* q06d: p.m modulus, p.a and p.b the two dial multipliers. Combined multiplier by two passes through a worked-out table, then inverse. */
  q06d: p => {
    const c = (p.a * p.b) % p.m;
    return [units(p.m).length, c, inverse(c, p.m)];
  },
  /* q07b: p.m notches, p.a turn per cycle. Walk until back at 0, then laps = notches turned / m. */
  q07b: p => { const k = orderZ(p.a, p.m); return [k, (k * p.a) / p.m]; },
  /* q07c: p.m lamps, p.a jump, p.T beats. Simulate every beat, count the returns to lamp 0. */
  q07c: p => {
    let x = 0, home = 0; for (let b = 1; b <= p.T; b++) { x = (x + p.a) % p.m; if (x === 0) home++; }
    return [orderZ(p.a, p.m), home, x];
  },
  /* q07d: p.m lamps, p.a jump, p.T beats (gcd by Euclid, order by walking, final lamp by stepping). */
  q07d: p => [gcd(p.a, p.m), orderZ(p.a, p.m), stepZ(p.a, p.m, p.T)],
  /* q08b: p.m modulus, p.a multiplier. Build the power table; entries are a^1.. so index 1 is a^2. */
  q08b: p => { const t = powTable(p.a, p.m); return [t[1], t.length, t[t.length - 2]]; },
  /* q08c: p.m modulus, p.a multiplier, p.B beats for the second answer. p.j is only an index: the target code in the
     prompt is the code after j beats (a^j mod m); the answer is the first beat of the table that shows it. */
  q08c: p => {
    const t = powTable(p.a, p.m), target = t[p.j - 1];
    return [t.length, t[p.B - 1 < t.length ? p.B - 1 : (p.B - 1) % t.length], t.indexOf(target) + 1];
  },
  /* q08d: p.m modulus, p.a multiplier. */
  q08d: p => [units(p.m).length, powTable(p.a, p.m).length, inverse(p.a, p.m)],
  /* q09b: p.m dial size, p.a key. Generators counted by building every key's reach. */
  q09b: p => [genCount(p.m), reach(p.a, p.m).size],
  /* q09c: p.m ring size, p.js the four spare jumps. */
  q09c: p => {
    const sizes = p.js.map(j => reach(j, p.m).size);
    return [genCount(p.m), sizes.filter(s => s === p.m).length, Math.min.apply(null, sizes)];
  },
  /* q09d: p.m ring size, p.g main jump (a unit), p.h spare jump. */
  q09d: p => [genCount(p.m), inverse(p.g, p.m), reach(p.h, p.m).size],
  /* q10b: p.m modulus, p.a multiplier, p.c start code, p.k trips (multiplied out one at a time, no shortcut). */
  q10b: p => {
    const ord = powTable(p.a, p.m).length;
    return [ord, p.k % ord, powStep(p.a, p.m, p.k, p.c % p.m)];
  },
  /* q10c: p.m modulus, p.a multiplier, p.k beats. Next beat after k with code 1, found by stepping on from beat k. */
  q10c: p => {
    const ord = powTable(p.a, p.m).length, code = powStep(p.a, p.m, p.k);
    let x = code, t = 0; do { x = (x * p.a) % p.m; t++; } while (x !== 1);
    return [ord, code, t];
  },
  /* q10d: p.m modulus, p.a multiplier, p.k beats (multiplied out one beat at a time). */
  q10d: p => {
    const f = powStep(p.a, p.m, p.k);
    return [powTable(p.a, p.m).length, f, inverse(f, p.m)];
  },
});
})();
