/* Independent oracles for Logic and proof practice missions, file 5 of 8: q21b–q25d (game/realms/logic/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a solver, a numerical method).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Quantifier checks on a 0/1 chart read with plain loops: grid[row][col]. */
const rowHas = (g, i) => { for (let c = 0; c < g[i].length; c++) if (g[i][c] === 1) return true; return false; };
const colHas = (g, c) => { for (let r = 0; r < g.length; r++) if (g[r][c] === 1) return true; return false; };
const rowFull = (g, i) => { for (let c = 0; c < g[i].length; c++) if (g[i][c] !== 1) return false; return true; };
const colFull = (g, c) => { for (let r = 0; r < g.length; r++) if (g[r][c] !== 1) return false; return true; };
/* Knights and knaves by backtracking from the last person to the first (true = knight). A statement is a function of
   the whole assignment; a knight's statement must be true and a knave's false. Returns every consistent assignment. */
const solveKK = st => {
  const n = st.length, found = [], cur = new Array(n);
  const truth = (s, a, me) => {
    switch (s.k) {
      case 'K': return a[s.x];
      case 'N': return !a[s.x];
      case 'DIFF': return a[s.x] !== a[me];
      case 'SAME': return a[s.x] === a[me];
      case 'EITHER': return a[s.x] || a[s.y];
      case 'ONEKNAVE': return !a[s.x] || !a[s.y];
      case 'BOTH': return a[s.x] && a[s.y];
      case 'EXACT': { let c = 0; for (let i = 0; i < n; i++) if (a[i]) c++; return c === s.c; }
    }
    throw new Error('unknown statement kind ' + s.k);
  };
  const go = i => {
    if (i < 0) {
      for (let j = 0; j < n; j++) if (truth(st[j], cur, j) !== cur[j]) return;
      found.push(cur.slice()); return;
    }
    cur[i] = true; go(i - 1); cur[i] = false; go(i - 1);
  };
  go(n - 1);
  if (found.length !== 1) throw new Error('knights and knaves: ' + found.length + ' solutions');
  return found[0];
};
/* Argument validity from a truth table over the atoms p, q, r: valid when no row makes every premise true and the
   conclusion false. The form names are only the generator's labels for the five argument shapes shown in the prompt. */
const FORMS = {
  MP: { prem: [(p, q) => !p || q, (p, q) => p], concl: (p, q) => q },
  MT: { prem: [(p, q) => !p || q, (p, q) => !q], concl: (p, q) => !p },
  AC: { prem: [(p, q) => !p || q, (p, q) => q], concl: (p, q) => p },
  DH: { prem: [(p, q) => !p || q, (p, q) => !p], concl: (p, q) => !q },
  CH: { prem: [(p, q, r) => !p || q, (p, q, r) => !q || r], concl: (p, q, r) => !p || r }
};
const valid = f => {
  const F = FORMS[f]; if (!F) throw new Error('unknown form ' + f);
  for (let m = 0; m < 8; m++) {
    const p = !!(m & 1), q = !!(m & 2), r = !!(m & 4);
    let all = true; for (const pr of F.prem) if (!pr(p, q, r)) all = false;
    if (all && !F.concl(p, q, r)) return 0;
  }
  return 1;
};
/* Does d divide x?  Search for a whole number m with x = d × m (the definition). Returns m, or -1. */
const quotient = (d, x) => { for (let m = 0; d * m <= x; m++) if (d * m === x) return m; return -1; };
/* Half of an even stamp, or the k of an odd one, by counting up. */
const halfK = x => { let k = 0; while (2 * k + 1 < x) k++; return k; };
Object.assign(window.ORACLE, {
  /* q21b: A = every column has a 1, B = some row is all ones, then the columns that have a 1. */
  q21b: p => {
    const g = p.grid; let cols = 0, rows = 0;
    for (let c = 0; c < g[0].length; c++) if (colHas(g, c)) cols++;
    for (let r = 0; r < g.length; r++) if (rowFull(g, r)) rows++;
    return [cols === g[0].length ? 1 : 0, rows > 0 ? 1 : 0, cols];
  },
  /* q21c: key j (1-based) is struck off. Rows opened by key j alone, rows that keep a key, and whether none is left without. */
  q21c: p => {
    const g = p.grid, j = p.j - 1; let only = 0, keep = 0;
    for (let r = 0; r < g.length; r++) {
      let others = 0, total = 0;
      for (let c = 0; c < g[r].length; c++) if (g[r][c] === 1) { total++; if (c !== j) others++; }
      if (total === 1 && g[r][j] === 1) only++;
      if (others > 0) keep++;
    }
    return [only, keep, keep === g.length ? 1 : 0];
  },
  /* q21d: A, B, the smallest airlock with no key (1-based, 0 if none), the airlocks with a key. */
  q21d: p => {
    const g = p.grid; let first = 0, keyed = 0, someKey = false;
    for (let r = g.length - 1; r >= 0; r--) if (!rowHas(g, r)) first = r + 1;
    for (let r = 0; r < g.length; r++) if (rowHas(g, r)) keyed++;
    for (let c = 0; c < g[0].length; c++) if (colFull(g, c)) someKey = true;
    return [first === 0 ? 1 : 0, someKey ? 1 : 0, first, keyed];
  },
  /* q22b: solve the three statements; entries are knight = 1 each, then the knaves. */
  q22b: p => { const a = solveKK(p.st); return [...a.map(v => v ? 1 : 0), a.filter(v => !v).length]; },
  /* q22c: knights, then 'pay' credits for each. */
  q22c: p => { const a = solveKK(p.st), k = a.filter(v => v).length; let total = 0; for (let i = 0; i < k; i++) total += p.pay; return [k, total]; },
  /* q22d: four people, the knight flags, then the knight count. */
  q22d: p => { const a = solveKK(p.st); return [...a.map(v => v ? 1 : 0), a.filter(v => v).length]; },
  /* q23b: validity of three arguments by truth table, then the checks below the limit L. */
  q23b: p => [...p.forms.map(valid), p.levels.filter(v => v < p.L).length],
  /* q23c: valid arguments, then sessions with more than k yes votes, and their total. */
  q23c: p => {
    let v = 0; for (const f of p.forms) v += valid(f);
    let n = 0, sum = 0; for (const y of p.votes) if (y > p.k) { n++; sum += y; }
    return [v, n, sum];
  },
  /* q23d: validity flags, then sessions with fewer than k yes votes, and the first such session (1-based). */
  q23d: p => {
    const out = p.forms.map(valid); let n = 0, first = 0;
    for (let i = p.votes.length - 1; i >= 0; i--) if (p.votes[i] < p.k) { n++; first = i + 1; }
    return [...out, n, first];
  },
  /* q24b: k for the even stamp E = 2k and the odd stamp O = 2k + 1 by search, then whether a | b. */
  q24b: p => {
    let ke = 0; while (2 * ke < p.E) ke++;
    return [ke, halfK(p.O), quotient(p.a, p.b) >= 0 ? 1 : 0];
  },
  /* q24c: shelve by whole packs of a: flags for the two deliveries and the packs in those that fit. */
  q24c: p => {
    const m1 = quotient(p.a, p.b1), m2 = quotient(p.a, p.b2);
    return [m1 >= 0 ? 1 : 0, m2 >= 0 ? 1 : 0, (m1 >= 0 ? m1 : 0) + (m2 >= 0 ? m2 : 0)];
  },
  /* q24d: how many of the list d divides, the claim C, and k of the first odd number. */
  q24d: p => {
    let n = 0, firstOdd = null;
    for (const x of p.list) { if (quotient(p.d, x) >= 0) n++; if (firstOdd === null && x % 2 === 1) firstOdd = x; }
    return [n, n === p.list.length ? 1 : 0, halfK(firstOdd)];
  },
  /* q25b: the bracket a + b + 1 for m = 2a + 1, n = 2b + 1 (taken back from m + n = 2(bracket)), then the place of the
     correct step in the choice order. cands are only indices into the generator's step texts (0 = the true step for
     the gap), so the oracle takes the place of 0: it cannot judge the texts themselves. */
  q25b: p => {
    const m = 2 * p.a + 1, n = 2 * p.b + 1, bracket = (m + n) / 2;
    return [bracket, p.cands.indexOf(0) + 1];
  },
  /* q25c: a and b from the serial numbers, then the bracket read back from m × n = 2(bracket) + 1. */
  q25c: p => {
    const m = 2 * p.a + 1, n = 2 * p.b + 1;
    return [halfK(m), halfK(n), halfK(m * n)];
  },
  /* q25d: k and K read back from the products m × n and m × n × p, then the product. */
  q25d: p => {
    const m = 2 * p.a + 1, n = 2 * p.b + 1, q = 2 * p.c + 1;
    return [halfK(m * n), halfK(m * n * q), m * n * q];
  }
});
})();
