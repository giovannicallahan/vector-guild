/* Independent oracles for Logic and proof practice missions, file 1 of 8: q01b–q05d (game/realms/logic/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Truth values as 1/0, and a row-by-row table over the whole numbers 1..N: each row holds n and the value of every
   named condition; the answer is a count of the rows a test accepts. */
const bit = b => (b ? 1 : 0);
const rows = (N, conds) => { const t = []; for (let n = 1; n <= N; n++) { const r = { n }; for (const k of Object.keys(conds)) r[k] = bit(conds[k](n)); t.push(r); } return t; };
const count = (t, test) => t.filter(test).length;
const mult = (n, a) => Math.round(n / a) * a === n;
Object.assign(window.ORACLE, {
  /* q01b: four claims, each worked out and compared; the product d × e is asked first. */
  q01b: p => {
    const v = [bit(p.a + p.b > p.c), bit(p.d * p.e === p.f), bit(p.g - p.h < p.i), bit(p.j + p.k === p.m)];
    return [p.d * p.e, v.reduce((s, x) => s + x, 0)];
  },
  /* q01c: crates times packs, less the draw, and a notice "more than T" (strict). */
  q01c: p => {
    let got = 0; for (let i = 0; i < p.a; i++) got += p.b;
    const left = got - p.c;
    return [got, left, bit(left > p.T)];
  },
  /* q01d: bracket, then product, then sum or difference, in the order the prompt gives. */
  q01d: p => {
    const first = p.b * p.c + p.a, br = (p.e + p.f) * p.g, third = p.i * p.j - p.k * p.l;
    return [first, bit(first === p.d) + bit(br < p.h) + bit(third > p.m)];
  },
  /* q02b: p is "colder than k" (colder) or "at most k" (atmost); ¬p is its opposite. Test p, then flip. */
  q02b: p => {
    const pv = t => p.kind === 'colder' ? t < p.k : t <= p.k;
    const neg = p.log.map(t => bit(!pv(t)));
    return [neg[neg.length - 1], neg.reduce((s, x) => s + x, 0)];
  },
  /* q02c: step the battery down hour by hour; p is "above k"; ¬p is its flip. */
  q02c: p => {
    let level = p.s; const at = {};
    for (let hr = 1; hr <= p.H; hr++) { level -= p.a; at[hr] = level; }
    let bad = 0; for (let hr = 1; hr <= p.H; hr++) if (!(at[hr] > p.k)) bad++;
    return [at[p.h], bit(!(at[p.h] > p.k)), bad];
  },
  /* q02d: table over panels 1..N with p = "n × m < k"; ¬p, then ¬(¬p), then the first row where ¬p holds. */
  q02d: p => {
    const t = rows(p.N, { p: n => n * p.m < p.k });
    const np = t.filter(r => 1 - r.p === 1), nnp = t.filter(r => 1 - (1 - r.p) === 1);
    return [np.length, nnp.length, np[0].n];
  },
  /* q03b: each sample is a row; p is temperature > T, q is pressure < P. */
  q03b: p => {
    const r = p.log.map(([t, pr]) => ({ p: bit(t > p.T), q: bit(pr < p.P) }));
    return [r[0].p & r[0].q, count(r, x => x.p && x.q), count(r, x => x.p && !x.q)];
  },
  /* q03c: bell on multiples of a; q is "after minute w". Counts from a table of minutes. */
  q03c: p => {
    const t = rows(p.N, { p: n => mult(n, p.a), q: n => n > p.w });
    return [count(t, r => r.p), count(t.filter(r => r.n <= p.w), r => r.p), count(t, r => r.p && r.q)];
  },
  /* q03d: p is "multiple of a", q is "less than v"; the code x is one row of the table. */
  q03d: p => {
    const t = rows(p.N, { p: n => mult(n, p.a), q: n => n < p.v });
    const row = t[p.x - 1];
    return [row.p && !row.q ? 1 : 0, count(t, r => r.p && r.q), count(t, r => r.p && !r.q)];
  },
  /* q04b: each crate is a row; p is mass > M (second number), q is label (first number) a multiple of m. */
  q04b: p => {
    const r = p.items.map(([label, mass]) => ({ p: bit(mass > p.M), q: bit(mult(label, p.m)) }));
    return [count(r, x => x.p || x.q), count(r, x => x.p && x.q)];
  },
  /* q04c: lockers 1..N; red on multiples of a, blue on multiples of b. */
  q04c: p => {
    const t = rows(p.N, { p: n => mult(n, p.a), q: n => mult(n, p.b) });
    return [count(t, r => r.p && r.q), count(t, r => r.p || r.q), count(t, r => !r.p && !r.q)];
  },
  /* q04d: p multiple of a, q greater than v, r less than w; the pass x is one row. */
  q04d: p => {
    const t = rows(p.N, { p: n => mult(n, p.a), q: n => n > p.v, r: n => n < p.w });
    const row = t[p.x - 1];
    return [(row.p || row.q) && row.r ? 1 : 0, count(t, r => r.p || r.q), count(t, r => (r.p || r.q) && r.r)];
  },
  /* q05b: "if multiple of a then less than v" is false only when the hypothesis is true and the conclusion false. */
  q05b: p => {
    const t = rows(p.N, { h: n => mult(n, p.a), c: n => n < p.v });
    const holds = r => !(r.h && !r.c);
    return [bit(holds(t[p.x - 1])), count(t, r => !r.h), count(t, r => !holds(r))];
  },
  /* q05c: hypothesis "multiple of a", conclusion "multiple of b" (the filter is changed on those cycles). */
  q05c: p => {
    const t = rows(p.N, { h: n => mult(n, p.a), c: n => mult(n, p.b) });
    return [count(t, r => r.h), count(t, r => r.h && r.c), count(t, r => r.h && !r.c)];
  },
  /* q05d: hypothesis "multiple of a or greater than v", conclusion "less than w". */
  q05d: p => {
    const t = rows(p.N, { h: n => mult(n, p.a) || n > p.v, c: n => n < p.w });
    const row = t[p.x - 1];
    return [bit(!(row.h && !row.c)), count(t, r => r.h), count(t, r => r.h && !r.c)];
  },
});
})();
