/* Independent oracles for Logic and proof learn missions, file a: q01–q10 (game/realms/logic/missions-a.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
  /* Does the whole number n meet the condition c ({t:'gt'|'lt'|'mul', v})? */
  const holds = (c, n) => c.t === 'gt' ? n > c.v : c.t === 'lt' ? n < c.v : n % c.v === 0;
  /* Evaluate a statement tree under an assignment {letter: bool}. */
  const ev = (f, a) => {
    if (typeof f === 'string') return a[f];
    const [op, x, y] = f, X = ev(x, a), Y = y === undefined ? null : ev(y, a);
    switch (op) {
      case 'not': return !X;
      case 'and': return X && Y;
      case 'or': return X || Y;
      case 'imp': return !X || Y;
      case 'iff': return X === Y;
      case 'xor': return X !== Y;
      case 'nand': return !(X && Y);
      case 'nor': return !(X || Y);
      default: throw new Error('unknown operator ' + op);
    }
  };
  const letters = (f, s = new Set()) => { if (typeof f === 'string') s.add(f); else f.slice(1).forEach(g => letters(g, s)); return s; };
  /* Every row of a truth table over the given letters, standard order (first letter true on the top half). */
  const rows = ls => {
    const out = [];
    for (let r = 0; r < (1 << ls.length); r++) {
      const a = {};
      ls.forEach((l, i) => { a[l] = ((r >> (ls.length - 1 - i)) & 1) === 0; });
      out.push(a);
    }
    return out;
  };
  const sorted = (...fs) => { const s = new Set(); fs.forEach(f => letters(f, s)); return [...s].sort(); };
  const count = (pred, N) => { let k = 0; for (let n = 1; n <= N; n++) if (pred(n)) k++; return k; };
Object.assign(window.ORACLE, {
  /* "a is greater than b × c", "d + e equals f", "g is less than h − i": work each one out and compare. */
  q01: p => [p.b * p.c, p.a > p.b * p.c ? 1 : 0, p.d + p.e === p.f ? 1 : 0, p.g < p.h - p.i ? 1 : 0],
  /* p is "reading more/less than k"; ¬p is its opposite. Test every reading in the log. */
  q02: p => {
    const pTrue = x => p.kind === 'more' ? x > p.k : x < p.k;
    const notP = p.log.filter(x => !pTrue(x));
    const pick = p.kind === 'more' ? Math.max(...notP) : Math.min(...notP);
    return [pTrue(p.log[0]) ? 0 : 1, pick];
  },
  /* p ∧ q at the code x, then count over 1..N. */
  q03: p => [holds(p.p, p.x) && holds(p.q, p.x) ? 1 : 0, count(n => holds(p.p, n) && holds(p.q, n), p.N)],
  /* p ∨ q counted over 1..N, by testing each number. */
  q04: p => [count(n => holds(p.p, n) || holds(p.q, n), p.N)],
  /* Log entries are [pressure, door] with door 1 = locked, 0 = open. Rule: pressure below k → locked. */
  q05: p => {
    const ok = ([pr, locked]) => !(pr < p.k) || locked === 1;
    return [ok(p.log[0]) ? 1 : 0, p.log.filter(e => !ok(e)).length];
  },
  /* p ↔ q is true when both agree. */
  q06: p => {
    const same = n => holds(p.p, n) === holds(p.q, n);
    return [...p.xs.map(x => same(x) ? 1 : 0), count(same, p.N)];
  },
  /* 2^n rows; walk the rows in standard order until the row matches the wanted case (row 1 is all true). */
  q07: p => {
    const ls = p.c.map((_, i) => 'L' + i), all = rows(ls);
    let at = -1;
    all.forEach((a, i) => { if (at < 0 && ls.every((l, j) => a[l] === (p.c[j] === 1))) at = i + 1; });
    return [all.length, at];
  },
  /* Number of rows making the whole statement true. */
  q08: p => [rows(sorted(p.f)).filter(a => ev(p.f, a)).length],
  /* Rows true, and 1 when every row is true. */
  q09: p => {
    const r = rows(sorted(p.f)), t = r.filter(a => ev(p.f, a)).length;
    return [t, t === r.length ? 1 : 0];
  },
  /* One table over the letters of both statements: rows where f is true, and rows where f and g differ. */
  q10: p => {
    const r = rows(sorted(p.f, p.g));
    return [r.filter(a => ev(p.f, a)).length, r.filter(a => ev(p.f, a) !== ev(p.g, a)).length];
  },
});
})();
