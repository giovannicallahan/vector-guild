/* Independent oracles for Logic and proof learn missions, file c: q21–q30 (game/realms/logic/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* A conditional "if h, then c" whose parts are the rule's p and q, each possibly negated: [[atom, negated], [atom, negated]].
   equivToRule checks by truth table whether it is true on exactly the rows where the rule p → q is true. */
const lit = ([atom, neg], row) => (atom === 'p' ? row.p : row.q) !== neg;
const equivToRule = ([h, c]) => { for (const p of [true, false]) for (const q of [true, false]) { const row = { p, q }; if ((!lit(h, row) || lit(c, row)) !== (!p || q)) return false; } return true; };
/* The slot (1-based) of the one listed statement equivalent to the rule; forms[base] describes base statement base. */
const equivSlot = (order, forms) => { const hits = order.map((b, i) => equivToRule(forms[b]) ? i + 1 : 0).filter(Boolean); if (hits.length !== 1) throw new Error('equivalent statements: ' + hits.length); return hits[0]; };
/* Argument validity by truth table over p, q, r: valid when no row makes every premise true and the conclusion false. */
const imp = (a, b) => !a || b;
const ARG = {
  MP: { prem: [(p, q) => imp(p, q), p => p], concl: (p, q) => q },
  MT: { prem: [(p, q) => imp(p, q), (p, q) => !q], concl: p => !p },
  AC: { prem: [(p, q) => imp(p, q), (p, q) => q], concl: p => p },
  DH: { prem: [(p, q) => imp(p, q), p => !p], concl: (p, q) => !q },
  CH: { prem: [(p, q) => imp(p, q), (p, q, r) => imp(q, r)], concl: (p, q, r) => imp(p, r) }
};
const validByTable = f => { const F = ARG[f]; if (!F) throw new Error('form ' + f);
  for (let m = 0; m < 8; m++) { const p = !!(m & 4), q = !!(m & 2), r = !!(m & 1); if (F.prem.every(g => g(p, q, r)) && !F.concl(p, q, r)) return 0; } return 1; };
Object.assign(window.ORACLE, {
  /* Key chart, rows = airlocks, columns = keys. A: every row has a 1 (count the rows that do). B: some column is all 1s. */
  q21: p => {
    const g = p.grid;
    let rowsWithKey = 0;
    for (const row of g) if (row.some(v => v === 1)) rowsWithKey++;
    let fullCols = 0;
    for (let y = 0; y < g[0].length; y++) { let all = true; for (const row of g) if (row[y] !== 1) all = false; if (all) fullCols++; }
    return [rowsWithKey === g.length ? 1 : 0, fullCols > 0 ? 1 : 0, rowsWithKey];
  },
  /* Knights and knaves: try all eight assignments (1 = knight). A speaker is a knight exactly when the statement is
     true. Statement kinds: K/N (x is a knight/knave), DIFF/SAME (speaker and x differ/match), ONEKNAVE (at least one
     of x, y is a knave), BOTH (x and y are both knights), EXACT (exactly c knights among the three). */
  q22: p => {
    const truth = (s, i, a) => {
      switch (s.k) {
        case 'K': return a[s.x] === 1;
        case 'N': return a[s.x] === 0;
        case 'DIFF': return a[i] !== a[s.x];
        case 'SAME': return a[i] === a[s.x];
        case 'ONEKNAVE': return a[s.x] === 0 || a[s.y] === 0;
        case 'BOTH': return a[s.x] === 1 && a[s.y] === 1;
        case 'EXACT': return a[0] + a[1] + a[2] === s.c;
      }
      throw new Error('kind ' + s.k);
    };
    const fits = [];
    for (let m = 0; m < 8; m++) {
      const a = [m & 1, (m >> 1) & 1, (m >> 2) & 1];
      if (p.st.every((s, i) => truth(s, i, a) === (a[i] === 1))) fits.push(a);
    }
    if (fits.length !== 1) throw new Error('q22: ' + fits.length + ' solutions');
    const a = fits[0];
    return [a[0], a[1], a[2], a[0] + a[1] + a[2]];
  },
  /* Argument forms (MP, MT, AC, DH, CH name the patterns the prompt prints: p → q with p, ¬q, q or ¬p, or a chain
     p → q, q → r), each judged valid or not by its truth table. Witnesses: count the sessions whose yes votes exceed k. */
  q23: p => {
    const out = p.forms.map(validByTable);
    let w = 0;
    for (const v of p.votes) if (v > p.k) w++;
    out.push(w);
    return out;
  },
  /* Definitions: search for the k with 2k + 1 = n, and for each claim search for a whole m with a × m = b. */
  q24: p => {
    let k = 0;
    while (2 * k + 1 !== p.n && 2 * k + 1 < p.n) k++;
    const divides = (a, b) => { for (let m = 0; m <= b; m++) if (a * m === b) return 1; return 0; };
    return [k, ...p.pairs.map(([a, b]) => divides(a, b))];
  },
  /* m = 2a + 1, n = 2b + 1. Build m × n directly, then find the bracket B with m n = 2B + 1 by search. cands are only
     indices into the generator's list of step texts (0 = the true step for the gap, 1–4 = wrong steps), so the answer
     is the place of 0 in the shown list: the oracle cannot judge the texts themselves. */
  q25: p => {
    const m = 2 * p.a + 1, n = 2 * p.b + 1;
    let B = 0;
    while (2 * B + 1 < m * n) B++;
    return [B, p.cands.indexOf(0) + 1];
  },
  /* d | a and d | b with a = d s, b = d t. The proof gives s, t and then m = s + t (or s − t). Check by search for m. */
  q26: p => {
    const a = p.d * p.s, b = p.d * p.t, target = p.op === '+' ? a + b : a - b;
    let m = -50;
    while (p.d * m !== target && m < 500) m++;
    return [p.s, p.t, m];
  },
  /* Proving the contrapositive of the regulation p → q. The four listed statements are, by base index, q → p,
     ¬p → ¬q, ¬q → ¬p and ¬q → p; the one proved is the one a truth table shows equivalent to p → q, and the answer
     is its place in the shown list. Then the number is evaluated and k found by
     search: f = 0 gives n² = 2k + 1 (n assumed odd), f = 1 gives 3n + 1 = 2k + 1, f = 2 gives n² = 2k (n assumed
     even), f = 3 gives 5n + 3 = 2k + 1. */
  q27: p => {
    const n = p.x;
    const v = [n * n, 3 * n + 1, n * n, 5 * n + 3][p.f];
    const odd = p.f !== 2;
    let k = 0;
    while ((odd ? 2 * k + 1 : 2 * k) < v) k++;
    return [equivSlot(p.order, [[['q', false], ['p', false]], [['p', true], ['q', true]], [['q', true], ['p', true]], [['q', true], ['p', false]]]), v, k];
  },
  /* n² + c n = n(n + c) with c odd (or c = −1): split into even n and odd n, so 2 cases; then the quotient by 2. */
  q28: p => {
    const half = n => (n * n + p.c * n) / 2;
    return [[0, 1].length, half(p.e), half(p.o)];
  },
  /* Method pool: 0 direct, 1 contrapositive, 2 cases. Which method suits a claim is a judgement, not a computation, so
     the best method per claim family w is written out here from the claims' shapes. Claims w = 0, 1 (sum of odds; sum of multiples of 5) suit a
     direct proof; w = 2, 3 (n² even, 3n + 5 even) a contrapositive; w = 4, 5 (n² + n, n² + 5n) cases. The number is
     then found by search for the k the prompt names. */
  q29: p => {
    const best = [0, 0, 1, 1, 2, 2][p.w];
    const pos = p.order.indexOf(best) + 1;
    let target, step, base;
    switch (p.w) {
      case 0: target = p.x + p.y; step = 2; base = 0; break;
      case 1: target = p.x + p.y; step = 5; base = 0; break;
      case 2: target = p.x * p.x; step = 2; base = 1; break;
      case 3: target = 3 * p.x + 5; step = 2; base = 1; break;
      case 4: target = p.x * p.x + p.x; step = 2; base = 0; break;
      case 5: target = p.x * p.x + 5 * p.x; step = 2; base = 0; break;
    }
    let k = 0;
    while (step * k + base < target) k++;
    return [pos, k];
  },
  /* Euclid: N = product + 1. Smallest prime factor by trial division from 2 upwards; then the cofactor. */
  q30: p => {
    let N = 1;
    for (const q of p.ps) N *= q;
    N += 1;
    let f = 2;
    while (N % f !== 0) f++;
    return [N, f, N / f];
  },
});
})();
