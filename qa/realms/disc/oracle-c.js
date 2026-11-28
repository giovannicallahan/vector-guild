/* Independent oracles for Discrete mathematics learn missions, file c: q21–q30 (game/realms/disc/missions-c.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
Object.assign(window.ORACLE, {
  /* N jobs, k crews. Enumerate every assignment (a base-k number with N digits) and count how many leave some crew
     with no job; the rest are onto. */
  q21: p => {
    const total = Math.pow(p.k, p.N);
    let bad = 0;
    for (let code = 0; code < total; code++) {
      const seen = new Array(p.k).fill(false);
      let c = code;
      for (let j = 0; j < p.N; j++) { seen[c % p.k] = true; c = Math.floor(c / p.k); }
      if (seen.some(s => !s)) bad++;
    }
    return [total, bad, total - bad];
  },
  /* N items back into N bins one each. Enumerate every ordering by recursion and count those with no fixed point. */
  q22: p => {
    let all = 0, none = 0;
    const used = new Array(p.N).fill(false);
    const go = (pos, home) => {
      if (pos === p.N) { all++; if (!home) none++; return; }
      for (let c = 0; c < p.N; c++) if (!used[c]) { used[c] = true; go(pos + 1, home || c === pos); used[c] = false; }
    };
    go(0, false);
    return [all, none];
  },
  /* N identical crates among k domes, each dome 0..L. Count by listing every share dome by dome (recursion); the
     "over" count is all shares minus the shares within the limit. */
  q23: p => {
    let all = 0, within = 0;
    const go = (dome, left, ok) => {
      if (dome === p.k - 1) { all++; if (ok && left <= p.L) within++; return; }
      for (let x = 0; x <= left; x++) go(dome + 1, left - x, ok && x <= p.L);
    };
    go(0, p.N, true);
    return [all, all - within, within];
  },
  /* a₁ = s, aₙ = c·aₙ₋₁ + d; bₙ = p n² + q n. Run the recurrence forward; evaluate b directly. */
  q24: p => {
    let a = p.s;
    for (let n = 2; n <= 5; n++) a = p.c * a + p.d;
    return [a, p.p * 100 + p.q * 10];
  },
  /* First delivery a, each week d more, N weeks. Build the list of deliveries and add them up. */
  q25: p => {
    const list = [];
    for (let w = 0, v = p.a; w < p.N; w++, v += p.d) list.push(v);
    return [list[list.length - 1], list.reduce((s, x) => s + x, 0)];
  },
  /* First order a, each week r times the last, N weeks. Build the list week by week and add. */
  q26: p => {
    const list = [];
    for (let w = 0, v = p.a; w < p.N; w++, v *= p.r) list.push(v);
    return [list[list.length - 1], list.reduce((s, x) => s + x, 0)];
  },
  /* Counts for weeks 1..6 from c3 n³ + c2 n² + c1 n + c0. Take difference rows until a row is constant (degree =
     the number of rows taken); extend the constant row and add back up to get week 7. */
  q27: p => {
    const f = n => p.c3 * n * n * n + p.c2 * n * n + p.c1 * n + p.c0;
    const rows = [[1, 2, 3, 4, 5, 6].map(f)];
    while (!rows[rows.length - 1].every(x => x === rows[rows.length - 1][0])) {
      const r = rows[rows.length - 1];
      rows.push(r.slice(1).map((x, i) => x - r[i]));
    }
    const degree = rows.length - 1;
    let next = rows[rows.length - 1][0];
    for (let i = rows.length - 2; i >= 0; i--) next += rows[i][rows[i].length - 1];
    return [degree, next];
  },
  /* aₙ = c·aₙ₋₁ + d·aₙ₋₂ from a₀, a₁: fill a table of values up to week 8 and read off weeks 4 and 8. */
  q28: p => {
    const t = [p.a0, p.a1];
    while (t.length < 9) t.push(p.c * t[t.length - 1] + p.d * t[t.length - 2]);
    return [t[4], t[8]];
  },
  /* A: a, a+d, ... (week 10); B: g, gr, ... (add 6 weeks); C: c2 n² + c1 n + c0 from n = 1 (week 6). Tables. */
  q29: p => {
    let A = [], v = p.a;
    for (let w = 0; w < 10; w++, v += p.d) A.push(v);
    let B = 0; v = p.g;
    for (let w = 0; w < 6; w++, v *= p.r) B += v;
    const C = [];
    for (let n = 1; n <= 6; n++) C.push(p.c2 * n * n + p.c1 * n + p.c0);
    return [A[9], B, C[5]];
  },
  /* aₙ = aₙ₋₁ + p n + q, a₀ given. Walk the weeks one at a time, adding each week's gain. */
  q30: p => {
    let a = p.a0, a3 = null;
    for (let n = 1; n <= p.N; n++) { a += p.p * n + p.q; if (n === 3) a3 = a; }
    return [a3, a];
  },
});
})();
