/* Independent oracles for Discrete mathematics practice missions, file 5 of 8: q21b–q25d (game/realms/disc/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Functions from N items to k targets, tallied by how many distinct targets are hit (a row-by-row table, no inclusion-exclusion).
   Returns { all, onto, oneOut }: no condition, every target hit, and the plans that avoid one named target. */
const funcTable = (N, k) => {
  let row = new Array(k + 1).fill(0); row[0] = 1;
  for (let i = 0; i < N; i++) {
    const next = new Array(k + 1).fill(0);
    for (let j = 0; j <= k; j++) {
      if (!row[j]) continue;
      if (j > 0) next[j] += row[j] * j;          /* the item joins a target already used */
      if (j < k) next[j + 1] += row[j] * (k - j); /* the item opens a new target */
    }
    row = next;
  }
  let all = 0; for (let j = 0; j <= k; j++) all += row[j];
  let oneOut = 1; for (let i = 0; i < N; i++) oneOut *= (k - 1);
  return { all, onto: row[k], oneOut };
};
/* Permutations of n labelled things, tallied by number of fixed points (bitmask table). Returns counts[f]. */
const fixedTable = n => {
  let cur = new Map([[0, new Array(n + 1).fill(0)]]); cur.get(0)[0] = 1;
  for (let i = 0; i < n; i++) {
    const next = new Map();
    for (const [mask, cnt] of cur) {
      for (let v = 0; v < n; v++) {
        if (mask & (1 << v)) continue;
        const m2 = mask | (1 << v), hit = v === i ? 1 : 0;
        if (!next.has(m2)) next.set(m2, new Array(n + 1).fill(0));
        const tgt = next.get(m2);
        for (let f = 0; f + hit <= n; f++) tgt[f + hit] += cnt[f];
      }
    }
    cur = next;
  }
  return cur.get((1 << n) - 1) || new Array(n + 1).fill(0);
};
const derange = n => n === 0 ? 1 : fixedTable(n)[0];
const choose = (n, r) => { if (r < 0 || r > n) return 0; let row = [1]; for (let i = 1; i <= n; i++) { const nx = [1]; for (let j = 1; j <= i; j++) nx.push((row[j - 1] || 0) + (row[j] || 0)); row = nx; } return row[r]; };
/* Ways to split n identical items among k boxes where box i takes between lo[i] and hi[i] (counted by trying each amount). */
const splitCount = (n, lo, hi) => {
  const rec = (i, left) => {
    if (i === lo.length) return left === 0 ? 1 : 0;
    let s = 0;
    for (let v = lo[i]; v <= Math.min(hi[i], left); v++) s += rec(i + 1, left - v);
    return s;
  };
  return rec(0, n);
};
const BIG = 1e6;
const fill = (k, v) => new Array(k).fill(v);
/* First m boxes forced to hold at least `min`, the rest free. */
const withMin = (n, k, m, min) => splitCount(n, fill(k, 0).map((x, i) => i < m ? min : 0), fill(k, BIG));
/* Recursion a_n = c a_(n-1) + d run step by step from the first term at index `from` up to index `to`. */
const runRec = (first, c, d, from, to) => { let a = first; for (let i = from; i < to; i++) a = c * a + d; return a; };
/* Arithmetic run listed term by term. */
const listAP = (a, d, n) => { const out = []; for (let i = 0; i < n; i++) out.push(a + i * d); return out; };
const sum = xs => xs.reduce((s, x) => s + x, 0);
Object.assign(window.ORACLE, {
  /* q21b: table of functions by number of targets used. */
  q21b: p => { const t = funcTable(p.N, p.k); return [t.all, t.oneOut, t.all - t.onto, t.onto]; },
  /* q21c: onto hand-outs, then a lead crew from any of the k. */
  q21c: p => { const t = funcTable(p.N, p.k); return [t.onto, t.onto * p.k]; },
  /* q21d: two named docks unused, some dock unused, onto. */
  q21d: p => {
    const t = funcTable(p.N, p.k); let two = 1; for (let i = 0; i < p.N; i++) two *= (p.k - 2);
    return [two, t.all - t.onto, t.onto];
  },
  /* q22b: permutations by fixed points. */
  q22b: p => { const f = fixedTable(p.N); let all = 0; for (const x of f) all += x; return [all - f[0], f[0]]; },
  /* q22c: derangements of each bay, multiplied. */
  q22c: p => { const x = derange(p.a), y = derange(p.b); return [x, y, x * y]; },
  /* q22d: choose which 2 are home (the prompt fixes exactly two; p.w is only a wording choice), derange the rest. */
  q22d: p => { const c = choose(p.N, 2), d = derange(p.N - 2); return [c, d, c * d]; },
  /* q23b: at most L each among k rovers; "one named over" by trying each amount for that rover. */
  q23b: p => {
    const within = splitCount(p.N, fill(p.k, 0), fill(p.k, p.L)), total = withMin(p.N, p.k, 0, 0);
    return [withMin(p.N, p.k, 1, p.L + 1), total - within, within];
  },
  /* q23c: every dome has 1 first; spare crates shared; a dome is over when it holds more than L in all. */
  q23c: p => {
    const spare = p.N - p.k, within = splitCount(p.N, fill(p.k, 1), fill(p.k, p.L)), total = withMin(spare, p.k, 0, 0);
    return [spare, total - within, within];
  },
  /* q23d: sum over the pairs of the ways that two named domes are both over (the prompt's own pair level). */
  q23d: p => {
    let pairs = 0;
    for (let i = 0; i < p.k; i++) for (let j = i + 1; j < p.k; j++) pairs += withMin(p.N, p.k, 2, p.L + 1);
    const within = splitCount(p.N, fill(p.k, 0), fill(p.k, p.L)), total = withMin(p.N, p.k, 0, 0);
    return [pairs, total - within, within];
  },
  /* q24b: a0 = s, a_n = c a_(n-1) + d; b_n = p 2^n + q. */
  q24b: p => { let pw = 1; for (let i = 0; i < 6; i++) pw *= 2; return [runRec(p.s, p.c, p.d, 0, 4), p.p * pw + p.q]; },
  /* q24c: a_1 = s; b_n = p n² + r; week N. */
  q24c: p => { const a = runRec(p.s, p.c, p.d, 1, p.N), b = p.p * p.N * p.N + p.r; return [a, b, a - b]; },
  /* q24d: a_1 = s, term 7; b_n = p n³ + q n at n = 12. */
  q24d: p => [runRec(p.s, p.c, p.d, 1, 7), p.p * 12 * 12 * 12 + p.q * 12],
  /* q25b: list the N daily amounts and add them. */
  q25b: p => { const l = listAP(p.a, -p.d, p.N); return [l[l.length - 1], sum(l)]; },
  /* q25c: step on from week 1 until the delivery reaches the threshold a + (n-1)d, adding as we go. */
  q25c: p => {
    const target = p.a + (p.n - 1) * p.d; let week = 1, v = p.a, total = p.a;
    while (v < target) { v += p.d; week++; total += v; }
    return [week, total];
  },
  /* q25d: list weeks 1..N, add weeks P..N. */
  q25d: p => { const l = listAP(p.a, p.d, p.N); return [l[p.P - 1], l[p.N - 1], sum(l.slice(p.P - 1))]; },
});
})();
