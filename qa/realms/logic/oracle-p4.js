/* Independent oracles for Logic and proof practice missions, file 4 of 8: q16b–q20d (game/realms/logic/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here.
   q18b and q18d print their arguments in symbols, so their oracles read the premises and conclusion from the prompt.
   Where a parameter is only an index into a fixed list of arguments printed in English (q18c, q20b, q20d), the form is
   written out below from the prompt wording it produces; validity is then decided by a truth table, not by a rule. */
(function(){ 'use strict';
/* Trial division: no divisor from 2 up to n - 1. */
const isPrime = n => { if (n < 2) return false; for (let d = 2; d < n; d++) if (n % d === 0) return false; return true; };
const imp = (a, b) => (!a || b);
/* Every assignment of true/false to `vars` variables, as arrays, in counting order. */
const rowsOf = vars => { const out = []; for (let i = 0; i < (1 << vars); i++) { const r = []; for (let v = vars - 1; v >= 0; v--) r.push(!!((i >> v) & 1)); out.push(r); } return out; };
/* Truth table of an argument: [rows with every premise true, of those the rows with a false conclusion, valid 1/0]. */
const table = (vars, premises, concl) => {
  let all = 0, bad = 0;
  for (const r of rowsOf(vars)) if (premises.every(f => f(...r))) { all++; if (!concl(...r)) bad++; }
  return [all, bad, bad === 0 ? 1 : 0];
};
/* Printed statements read back from the prompt itself: (p ∨ q) → ¬r becomes a truth function of a row {p, q, r, s}.
   Every compound part inside a larger statement is printed in brackets, so one level holds at most one connective. */
const CONN = { '∧': (a, b) => a && b, '∨': (a, b) => a || b, '→': (a, b) => !a || b, '↔': (a, b) => a === b };
const parse = text => {
  const tk = text.replace(/\s+/g, '').split(''); let i = 0;
  const unary = () => { const c = tk[i++];
    if (c === '¬') { const a = unary(); return r => !a(r); }
    if (c === '(') { const e = expr(); if (tk[i++] !== ')') throw new Error('unclosed bracket in ' + text); return e; }
    if (/^[pqrs]$/.test(c)) return r => r[c];
    throw new Error('cannot read ' + text); };
  const expr = () => { const a = unary(), op = tk[i]; if (!CONN[op]) return a; i++; const b = unary();
    if (CONN[tk[i]]) throw new Error('unbracketed connectives in ' + text); const f = CONN[op]; return r => f(a(r), b(r)); };
  const e = expr(); if (i !== tk.length) throw new Error('cannot read ' + text); return e; };
/* Rows over the given letters in the standard order, as objects: row 1 has every letter true. */
const rowObjs = letters => { const k = letters.length, out = [];
  for (let m = 0; m < (1 << k); m++) { const r = {}; letters.forEach((c, j) => { r[c] = ((m >> (k - 1 - j)) & 1) === 0; }); out.push(r); }
  return out; };
/* The prompt the player sees for parameters p, and a regular-expression match in it that must succeed. */
const promptOf = (id, p) => window.MISSION_GEN[id].build(p).prompt;
const grab = (text, re) => { const m = text.match(re); if (!m) throw new Error('prompt not understood: ' + text.slice(0, 80)); return m; };
/* Table of a printed argument over the given letters: [rows with every premise true, of those false conclusion, valid]. */
const printedTable = (prem, conc, letters) => { let all = 0, bad = 0;
  for (const r of rowObjs(letters)) if (prem.every(f => f(r))) { all++; if (!conc(r)) bad++; }
  return [all, bad, bad === 0 ? 1 : 0]; };
Object.assign(window.ORACLE, {
  /* q16b: test n = 1..N in order; a counterexample is an n whose n² + n + k is not prime. */
  q16b: p => {
    const bad = [];
    for (let n = 1; n <= p.N; n++) if (!isPrime(n * n + n + p.k)) bad.push(n);
    return [bad.length ? bad[0] : 0, bad.length];
  },
  /* q16c: gauges over the limit L, in order; second claim true when some reading is above M. */
  q16c: p => {
    const over = [];
    p.r.forEach((x, i) => { if (x > p.L) over.push(i + 1); });
    return [over.length ? over[0] : 0, over.length, p.r.some(x => x > p.M) ? 1 : 0];
  },
  /* q16d: the rule fails for n exactly when n is a multiple of a and of b (De Morgan on "not a or not b"). */
  q16d: p => {
    const bad = [];
    for (let n = 1; n <= p.N; n++) if (n % p.a === 0 && n % p.b === 0) bad.push(n);
    return [bad.length ? bad[0] : 0, bad.length];
  },
  /* q17b: a station breaks "(hatch open or suit unsealed) -> alarm on" when the if-part holds and the alarm is off
     (rows are [hatch open, suit unsealed, alarm on]); second claim n³ <= a n² + b fails at the first n where it is false. */
  q17b: p => {
    let broke = 0;
    for (const [h, u, al] of p.rows) if ((h === 1 || u === 1) && al === 0) broke++;
    let first = 0;
    for (let n = 1; n <= 12 && !first; n++) if (n * n * n > p.a * n * n + p.b) first = n;
    return [broke, first];
  },
  /* q17c: build the crates one by one: X heavy-but-not-fragile crates, then the heavy-and-fragile ones (H - X of them),
     S of those strapped; the crew straps k more of the unstrapped heavy-and-fragile ones. */
  q17c: p => {
    const crates = [];
    for (let i = 0; i < p.X; i++) crates.push({ heavy: 1, fragile: 0, strapped: 0 });
    for (let i = 0; i < p.H - p.X; i++) crates.push({ heavy: 1, fragile: 1, strapped: i < p.S ? 1 : 0 });
    const both = crates.filter(c => c.heavy && c.fragile);
    const breakers = () => both.filter(c => !c.strapped);
    const before = breakers().length;
    for (let i = 0; i < p.k && breakers().length; i++) breakers()[0].strapped = 1;
    return [both.length, before, breakers().length === 0 ? 1 : 0];
  },
  /* q17d: n breaks "(a | n and n > t) -> b | n" when the if-part is true and the then-part false. */
  q17d: p => {
    const bad = [];
    for (let n = 1; n <= p.N; n++) if ((n % p.a === 0 && n > p.t) && !(n % p.b === 0)) bad.push(n);
    return bad.length ? [bad.length, bad[0], bad[bad.length - 1]] : [0, 0, 0];
  },
  /* q18b: read the two premises and the conclusion from the prompt; full 8-row truth table over p, q, r. */
  q18b: p => {
    const m = grab(promptOf('q18b', p), /Premise 1: (.+?)\. Premise 2: (.+?)\. Conclusion: (.+?)\. Build/);
    return printedTable([parse(m[1]), parse(m[2])], parse(m[3]), ['p', 'q', 'r']);
  },
  /* q18c: seven spoken arguments over p, q, r, read from the prompt wording; full truth table. */
  q18c: p => {
    const F = [
      [[(a, b) => a || b, (a, b, c) => imp(a, c), (a, b, c) => !c], (a, b) => b],
      [[(a, b) => imp(a, b), (a, b, c) => imp(b, c), (a, b, c) => c], a => a],
      [[(a, b) => imp(a, b), (a, b, c) => imp(b, c), a => !a], (a, b, c) => !c],
      [[a => a, (a, b) => imp(a, b), (a, b, c) => imp(b, c)], (a, b, c) => c],
      [[(a, b) => imp(a, b), (a, b, c) => imp(c, b), (a, b) => b], a => a],
      [[(a, b) => imp(a, b), (a, b, c) => imp(a, c), (a, b) => !b], (a, b, c) => !c],
      [[(a, b) => a || b, (a, b, c) => imp(a, c), (a, b, c) => imp(b, c)], (a, b, c) => c],
    ][p.f];
    return table(3, F[0], F[1]);
  },
  /* q18d: read the three premises and the conclusion from the prompt; full 16-row truth table over p, q, r, s. */
  q18d: p => {
    const t = promptOf('q18d', p), prem = [...t.matchAll(/premise \d+, ([^;]+);/g)].map(m => parse(m[1]));
    if (prem.length !== 3) throw new Error('q18d: expected three premises');
    return printedTable(prem, parse(grab(t, /conclusion: (.+?)\. Four letters/)[1]), ['p', 'q', 'r', 's']);
  },
  /* q19b: for each entry, c = [rule-if sentence, its not-flag, then sentence, its not-flag, 1 if the log denies the then-part].
     Solve by trying every true/false value for the two sentences and keeping those the rule and the log allow. */
  q19b: p => {
    const out = [];
    for (const [a, sa, b, sb, denied] of p.c) {
      const lit = (v, neg) => neg ? !v : v;
      const alive = [];
      for (const A of [false, true]) for (const B of [false, true]) {
        if (!imp(lit(A, sa), lit(B, sb))) continue;
        if (denied ? lit(B, sb) : !lit(A, sa)) continue;
        alive.push([A, B]);
      }
      const ask = denied ? 0 : 1;
      out.push(alive.every(r => r[ask] === alive[0][ask]) ? (alive[0][ask] ? 1 : 0) : 2, denied ? 2 : 1);
    }
    return out;
  },
  /* q19c: two chained rules X -> Y, Y -> Z (sx, sy, sz say which sentences are worded with "not"); the log gives the first
     part true (mp = 1) or denies the last part (mp = 0). Solve over all eight assignments. */
  q19c: p => {
    const lit = (v, neg) => neg ? !v : v;
    const alive = [];
    for (const [X, Y, Z] of rowsOf(3)) {
      if (!imp(lit(X, p.sx), lit(Y, p.sy)) || !imp(lit(Y, p.sy), lit(Z, p.sz))) continue;
      if (p.mp ? !lit(X, p.sx) : lit(Z, p.sz)) continue;
      alive.push([X, Y, Z]);
    }
    const forced = i => alive.every(r => r[i] === alive[0][i]) ? (alive[0][i] ? 1 : 0) : 2;
    return [forced(1), forced(p.mp ? 2 : 0), p.mp ? 1 : 2];
  },
  /* q19d: rule P and Q -> R; the case type says what the log shows and which sentence is asked about:
     0 P, Q true, ask R; 1 P true and R false, ask Q; 2 Q true and R false, ask P; 3 P, R true, ask Q; 4 P false, ask R. */
  q19d: p => p.ty.map(t => {
    const log = [r => r[0] && r[1], r => r[0] && !r[2], r => r[1] && !r[2], r => r[0] && r[2], r => !r[0]][t];
    const ask = [2, 1, 0, 1, 2][t];
    const alive = rowsOf(3).filter(r => imp(r[0] && r[1], r[2]) && log(r));
    return alive.every(r => r[ask] === alive[0][ask]) ? (alive[0][ask] ? 1 : 0) : 2;
  }),
  /* q20b: six argument forms over a, b, c, read from the prompt wording; valid when no row has true premises and a false conclusion. */
  q20b: p => {
    const F = [
      [[(a, b) => imp(a, b), a => a], (a, b) => b],
      [[(a, b) => imp(a, b), (a, b) => !b], a => !a],
      [[(a, b) => imp(a, b), (a, b, c) => imp(b, c)], (a, b, c) => imp(a, c)],
      [[(a, b) => imp(a, b), (a, b) => b], a => a],
      [[(a, b) => imp(a, b), a => !a], (a, b) => !b],
      [[(a, b) => imp(a, b), (a, b, c) => imp(b, c)], (a, b, c) => imp(c, a)],
    ];
    return p.fs.map(f => table(3, F[f][0], F[f][1])[2]);
  },
  /* q20c: a chain S0 -> S1 -> ... -> S(L). The log fixes sentence k (true if mp, false if not). Try every assignment of the
     L + 1 sentences, keep those that obey every rule and the log, and see which sentences never change. The clerk's rule
     S(s) -> S(e) follows when it holds in every surviving assignment of the rules alone. */
  q20c: p => {
    const n = p.L + 1, alive = [], rules = [];
    for (let m = 0; m < (1 << n); m++) {
      const v = []; for (let i = 0; i < n; i++) v.push(!!((m >> i) & 1));
      let ok = true; for (let i = 0; i < p.L; i++) if (v[i] && !v[i + 1]) ok = false;
      if (!ok) continue;
      rules.push(v);
      if (v[p.k] === !!p.mp) alive.push(v);
    }
    let fixed = 0;
    for (let i = 0; i < n; i++) if (i !== p.k && alive.every(v => v[i] === alive[0][i])) fixed++;
    return [fixed, alive[0][p.j] ? 1 : 0, rules.every(v => imp(v[p.s], v[p.e])) ? 1 : 0];
  },
  /* q20d: eight argument forms over three letters, read from the prompt wording (rules written with "not" are kept as stated);
     count the valid ones among the six and find the first fallacy. */
  q20d: p => {
    const F = [
      [[(h, s) => imp(h, s), (h, s, d) => imp(!d, !s)], (h, s, d) => imp(h, d)],
      [[(w, h) => imp(w, h), (w, h, t) => imp(t, !h)], (w, h, t) => imp(t, !w)],
      [[(e, g) => imp(!e, g), (e, g) => !g], e => e],
      [[(b, s) => imp(b, !s), (b, s) => s], b => !b],
      [[(f, w) => imp(f, w), (f, w, e) => imp(!e, !w)], (f, w, e) => imp(e, f)],
      [[(a, s) => imp(!a, s), (a, s) => s], a => !a],
      [[(a, w) => imp(a, !w), (a, w) => !w], a => a],
      [[(b, r) => imp(b, !r), (b, r, d) => imp(d, r)], (b, r, d) => imp(b, d)],
    ];
    const ok = p.fs.map(f => table(3, F[f][0], F[f][1])[2]);
    const firstBad = ok.indexOf(0);
    return [ok.filter(x => x === 1).length, firstBad < 0 ? 0 : firstBad + 1];
  },
});
})();
