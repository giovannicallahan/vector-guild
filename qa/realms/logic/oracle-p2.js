/* Independent oracles for Logic and proof practice missions, file 2 of 8: q06b–q10d (game/realms/logic/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Truth tables are built here by table lookup, not by JavaScript operators: each connective is a 2x2 table of 1/0. */
const T2 = {
  and: [[0, 0], [0, 1]],   /* T2[op][a][b] */
  or:  [[0, 1], [1, 1]],
  imp: [[1, 1], [0, 1]],
  iff: [[1, 0], [0, 1]],
  xor: [[0, 1], [1, 0]],
};
const NOT = [1, 0];
const LETTERS = ['p', 'q', 'r', 's', 't', 'u', 'v'];
/* Truth value (1/0) of formula f (a letter, ['not', f] or [op, f, g]) under env, an object letter -> 1/0. */
const val = (f, env) => {
  if (typeof f === 'string') return env[f];
  if (f[0] === 'not') return NOT[val(f[1], env)];
  if (!T2[f[0]]) throw new Error('unknown connective ' + f[0]);
  return T2[f[0]][val(f[1], env)][val(f[2], env)];
};
/* The standard table for k letters, built by splitting: first letter true over the top block, false over the bottom,
   each block being the standard table of the remaining letters. Each row is an array of 1/0, row 0 at the top. */
const table = k => {
  if (k === 0) return [[]];
  const rest = table(k - 1);
  return rest.map(r => [1].concat(r)).concat(rest.map(r => [0].concat(r)));
};
/* Evaluate a formula down the whole table over the first k letters: a column of 1/0. */
const column = (f, k) => table(k).map(row => {
  const env = {}; row.forEach((v, i) => { env[LETTERS[i]] = v; });
  return val(f, env);
});
const sum = a => a.reduce((s, x) => s + x, 0);
const countOf = (a, v) => a.filter(x => x === v).length;
/* The truth value of f on the case given as a T/F string in letter order. */
const caseVal = (f, s) => { const env = {}; s.split('').forEach((c, i) => { env[LETTERS[i]] = c === 'T' ? 1 : 0; }); return val(f, env); };
/* 1/0 for a comparison, kept as a number. */
const gt = (a, b) => (a > b ? 1 : 0);
const lt = (a, b) => (a < b ? 1 : 0);

Object.assign(window.ORACLE, {
  /* Read each (p, q) pair: tally the four kinds of pair, then match = both 1 + both 0. */
  q06b: p => {
    const tally = { '11': 0, '10': 0, '01': 0, '00': 0 };
    p.log.forEach(pr => { tally[String(pr[0]) + String(pr[1])]++; });
    return [tally['11'] + tally['00'], tally['10']];
  },
  /* Turn each reading into p, q with comparisons, then ↔ through its table and → through its table. */
  q06c: p => {
    let iffTrue = 0, impTrue = 0;
    p.rd.forEach(([x, y]) => {
      const a = gt(x, p.A), b = gt(y, p.B);
      iffTrue += T2.iff[a][b]; impTrue += T2.imp[a][b];
    });
    return [iffTrue, impTrue];
  },
  /* Walk n = 1..N testing p, q, r in turn; n = x is the first answer. */
  q06d: p => {
    const rule = n => {
      const a = gt(n, p.a), b = lt(n, p.b), r = (n % p.m === 0 ? 1 : 0);
      return T2.iff[T2.and[a][b]][r];
    };
    let count = 0;
    for (let n = 1; n <= p.N; n++) count += rule(n);
    return [rule(p.x), count];
  },
  /* Build the table of k letters by splitting, then read rows 0-based: row 11 is index 10. */
  q07b: p => {
    const t = table(p.k), row = t[p.row - 1];
    return [t.length, row[0], row[p.k - 1]];
  },
  /* Double the row count once per switch, then price the rows. */
  q07c: p => {
    let before = 1; for (let i = 0; i < p.a; i++) before *= 2;
    let after = before; for (let i = 0; i < p.b; i++) after *= 2;
    let minutes = 0; for (let i = 0; i < after; i++) minutes += p.t;
    return [before, after, minutes];
  },
  /* Search the standard table for the row equal to the case. */
  q07d: p => {
    const t = table(p.k);
    let found = -1;
    t.forEach((row, i) => { if (row.every((v, j) => v === p.c[j]) && found < 0) found = i + 1; });
    return [t.length, found, t.length - found];
  },
  /* Two inputs: evaluate the bracketed (compound) operand and the whole statement down the table. */
  q08b: p => {
    /* The bracketed part is the operand that is a statement in its own right: not a letter and not a negated letter. */
    const plain = x => typeof x === 'string' || (x[0] === 'not' && typeof x[1] === 'string');
    const inner = plain(p.f[1]) ? p.f[2] : p.f[1];
    return [sum(column(inner, 2)), sum(column(p.f, 2))];
  },
  /* Check each logged case against the formula, then the 8 rows of the full table. */
  q08c: p => {
    let broken = 0;
    p.log.forEach(s => { if (caseVal(p.f, s) === 0) broken++; });
    return [broken, sum(column(p.f, 3))];
  },
  /* Four inputs: columns for the two sides and for the whole. */
  q08d: p => [sum(column(p.f[1], 4)), sum(column(p.f[2], 4)), sum(column(p.f, 4))],
  /* Two inputs: count false rows; classify by what the column holds. */
  q09b: p => {
    const col = column(p.f, 2), falses = countOf(col, 0);
    const kind = falses === 0 ? 1 : (falses === col.length ? 2 : 3);
    return [falses, kind];
  },
  /* The statement, its opposite (negation of the whole), and their join by p.op. */
  q09c: p => {
    const neg = ['not', p.f], joined = [p.op, p.f, neg];
    return [sum(column(p.f, 2)), sum(column(neg, 2)), sum(column(joined, 2))];
  },
  /* Three inputs whether or not r appears: count trues, find the first false row, test for a tautology. */
  q09d: p => {
    const col = column(p.f, 3);
    const first = col.indexOf(0);
    return [sum(col), first < 0 ? 0 : first + 1, first < 0 ? 1 : 0];
  },
  /* Two columns side by side: rows where the values differ, and the first such row. */
  q10b: p => {
    const a = column(p.f, 2), b = column(p.g, 2);
    const diff = a.map((x, i) => (x !== b[i] ? i + 1 : 0)).filter(x => x > 0);
    return [diff.length, diff.length ? diff[0] : 0];
  },
  /* A rewrite is equivalent when the join (rewrite ↔ regulation) is true on every row. */
  q10c: p => p.rw.map(g => (sum(column(['iff', g, p.f], 2)) === 4 ? 1 : 0)),
  /* Three inputs: rows where the two differ, rows where f ↔ g is true, and whether that is all 8. */
  q10d: p => {
    const a = column(p.f, 3), b = column(p.g, 3);
    const diff = a.filter((x, i) => x !== b[i]).length;
    const joined = sum(column(['iff', p.f, p.g], 3));
    return [diff, joined, joined === 8 ? 1 : 0];
  },
});
})();
