/* Independent oracles for Abstract algebra practice missions, file 1 of 8: q01b–q05d (game/realms/abstract/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (walking a dial one notch at a time, a built table,
   a search for the identity and the inverses).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Turn a dial of m positions from `start` by `steps` single notches (forward if steps > 0, back if steps < 0). */
const turn = (start, steps, m) => { let x = start; const dir = steps >= 0 ? 1 : m - 1; for (let i = Math.abs(steps); i > 0; i--) x = (x + dir) % m; return x; };
/* Print the full table of a rule on 0..m-1: T[x][y] = rule(x, y). */
const table = (m, rule) => { const T = []; for (let x = 0; x < m; x++) { T.push([]); for (let y = 0; y < m; y++) T[x].push(rule(x, y)); } return T; };
/* The identity of a table: the digit e whose row and column both read 0..m-1 in order. */
const identityOf = T => { for (let e = 0; e < T.length; e++) { let ok = true; for (let x = 0; x < T.length; x++) if (T[e][x] !== x || T[x][e] !== x) ok = false; if (ok) return e; } return -1; };
/* Inverse of a in table T with identity e: the column where row a shows e. */
const inverseIn = (T, a, e) => T[a].indexOf(e);
/* Group test for a table on the elements `els`: closed, has an identity, every element has an inverse (associativity is given). */
const isGroup = (els, mul) => {
  const closed = els.every(x => els.every(y => els.includes(mul(x, y))));
  if (!closed) return { closed: 0, inv: 0, group: 0 };
  const e = els.find(c => els.every(x => mul(c, x) === x && mul(x, c) === x));
  if (e === undefined) return { closed: 1, inv: 0, group: 0 };
  const inv = els.every(x => els.some(y => mul(x, y) === e && mul(y, x) === e));
  return { closed: 1, inv: inv ? 1 : 0, group: inv ? 1 : 0 };
};
Object.assign(window.ORACLE, {
  /* q01b: m slots, a forward then b back (return); a forward then b forward (supply). Turned one slot at a time. */
  q01b: p => [turn(turn(0, p.a, p.m), -p.b, p.m), turn(turn(0, p.a, p.m), p.b, p.m)],
  /* q01c: m positions, s start, a forward, b back, c forward; then steps forward to reach 0. */
  q01c: p => {
    let x = turn(turn(turn(p.s, p.a, p.m), -p.b, p.m), p.c, p.m);
    const end = x; let n = 0; while (x !== 0) { x = (x + 1) % p.m; n++; }
    return [end, n];
  },
  /* q01d: m teeth, logs a, b, c: all forward; then a forward, b back, c back. */
  q01d: p => [turn(turn(turn(0, p.a, p.m), p.b, p.m), p.c, p.m), turn(turn(turn(0, p.a, p.m), -p.b, p.m), -p.c, p.m)],
  /* q02b: m slots, s slots a pass (and the number of passes in the second question too), p passes in the first question. */
  q02b: p => [turn(0, p.s * p.p, p.m), turn(0, p.s * p.s, p.m)],
  /* q02c: m positions, a steps an hour, h hours a shift, d shifts in the second question. */
  q02c: p => [turn(0, p.a * p.h, p.m), turn(0, p.a * p.h * p.d, p.m)],
  /* q02d: m positions, a steps of fault; x -> x² mod m twice. Squares built by repeated addition. */
  q02d: p => {
    const sq = x => { let t = 0; for (let i = 0; i < x; i++) t = turn(t, x, p.m); return t; };
    const x0 = turn(0, p.a, p.m), x1 = sq(x0);
    return [x1, sq(x1)];
  },
  /* q03b: m digits 0..m-1, k the added constant; row x1 column y1; diagonal entry at d. */
  q03b: p => { const T = table(p.m, (x, y) => (x + y + p.k) % p.m); return [T[p.x1][p.y1], T[p.d][p.d]]; },
  /* q03c: m dial, k constant; entry at row r column c; column where value v sits in row r (r is the row, c a column). */
  q03c: p => { const T = table(p.m, (x, y) => (x + y + p.k) % p.m); return [T[p.r][p.c], T[p.r].indexOf(p.v)]; },
  /* q03d: m dial, k added after multiplying; entry (x, y) and entry (z, z). */
  q03d: p => { const T = table(p.m, (x, y) => (x * y + p.k) % p.m); return [T[p.x][p.y], T[p.z][p.z]]; },
  /* q04b: m digits, k constant; identity, inverse of a1, inverse of a2 (a1, a2 are the digits asked about). */
  q04b: p => { const T = table(p.m, (x, y) => (x + y + p.k) % p.m); const e = identityOf(T); return [e, inverseIn(T, p.a1, e), inverseIn(T, p.a2, e)]; },
  /* q04c: m settings, k constant; s1 then s2 gives t; then the undo setting u. */
  q04c: p => { const T = table(p.m, (x, y) => (x + y + p.k) % p.m); const t = T[p.s1][p.s2], e = identityOf(T); return [t, inverseIn(T, t, e)]; },
  /* q04d: m settings, s taken away (the rule is x + y − s, negative results brought up by m); inverses of a and b. */
  q04d: p => {
    const T = table(p.m, (x, y) => { let v = x + y - p.s; while (v < 0) v += p.m; while (v >= p.m) v -= p.m; return v; });
    const e = identityOf(T); return [e, inverseIn(T, p.a, e), inverseIn(T, p.b, e)];
  },
  /* q05b: digits 1..m-1 under multiplication mod m; scramble of a and b; closed?; all inverses?; group? */
  q05b: p => {
    const els = []; for (let i = 1; i < p.m; i++) els.push(i);
    const g = isGroup(els, (x, y) => (x * y) % p.m);
    return [(p.a * p.b) % p.m, g.closed, g.inv, g.group];
  },
  /* q05c: plan A add mod m on 0..m-1, inverse of a; number of self-inverse settings; plan B 1..m-1 multiplying a group? */
  q05c: p => {
    const T = table(p.m, (x, y) => (x + y) % p.m);
    let self = 0; for (let x = 0; x < p.m; x++) if (T[x][x] === 0) self++;
    const els = []; for (let i = 1; i < p.m; i++) els.push(i);
    return [inverseIn(T, p.a, 0), self, isGroup(els, (x, y) => (x * y) % p.m).group];
  },
  /* q05d: dial P: x ∗ y = (x + y + k) mod m on 0..m-1, identity and inverse of a; dial Q: 1..m-1 multiplying a group? */
  q05d: p => {
    const T = table(p.m, (x, y) => (x + y + p.k) % p.m); const e = identityOf(T);
    const els = []; for (let i = 1; i < p.m; i++) els.push(i);
    return [e, inverseIn(T, p.a, e), isGroup(els, (x, y) => (x * y) % p.m).group];
  }
});
})();
