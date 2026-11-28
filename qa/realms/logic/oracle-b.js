/* Independent oracles for Logic and proof learn missions, file b: q11–q20 (game/realms/logic/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
/* Shared helpers: the n-th arrangement (in dictionary order, from 0) of a list, as shown in the printed options. */
const arrange = (items, n) => {
  const pool = items.slice(), out = [];
  let f = 1; for (let i = 2; i < pool.length; i++) f *= i;
  for (let len = pool.length; len >= 1; len--) {
    const at = Math.floor(n / f); n -= at * f;
    out.push(pool.splice(at, 1)[0]);
    if (len > 1) f /= (len - 1);
  }
  return out;
};
const imp = (a, b) => !a || b;
/* All assignments of truth values to v letters, in the standard order: the first row has every letter true. */
const rowsOf = v => { const out = []; for (let r = 0; r < (1 << v); r++) { const row = []; for (let i = 0; i < v; i++) row.push(((r >> (v - 1 - i)) & 1) === 0); out.push(row); } return out; };

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

/* q20 argument forms over A, B, C: [premises, conclusion]. */
const SPEECH = {
  mp: [[(a, b) => imp(a, b), (a) => a], (a, b) => b],
  mt: [[(a, b) => imp(a, b), (a, b) => !b], (a) => !a],
  chain: [[(a, b) => imp(a, b), (a, b, c) => imp(b, c)], (a, b, c) => imp(a, c)],
  ac: [[(a, b) => imp(a, b), (a, b) => b], (a) => a],
  dh: [[(a, b) => imp(a, b), (a) => !a], (a, b) => !b],
  back: [[(a, b) => imp(a, b), (a, b, c) => imp(b, c)], (a, b, c) => imp(c, a)]
};

Object.assign(window.ORACLE, {
  /* Read both printed proposals from the prompt, fill the 8-row table row by row (row 1 all true) and compare the
     two columns row by row. */
  q11: p => {
    const m = grab(promptOf('q11', p), /Proposal A lights it when (.+?) is true; proposal B lights it when (.+?) is true\./);
    const rs = rowObjs(['p', 'q', 'r']), A = rs.map(parse(m[1])), B = rs.map(parse(m[2]));
    return [A.filter(Boolean).length, B.filter(Boolean).length, A.filter((v, i) => v !== B[i]).length];
  },
  /* The rewrite list shows [correct, first wrong, second wrong] in the arrangement numbered ord; the crates are
     tested one by one against p and q. */
  q12: p => {
    const slot = arrange([0, 1, 2], p.ord).indexOf(0) + 1;
    let allowed = 0;
    for (let n = 1; n <= p.N; n++) {
      const P = n > p.a, Q = n % p.k === 0;
      if (p.form === 'and' ? !(P && Q) : !(P || Q)) allowed++;
    }
    return [slot, allowed];
  },
  /* The rule is tested on n = 1 … 3000 (enough to reach every case). The three statements are shown as the
     arrangement numbered ord of [converse, inverse, contrapositive]. */
  q13: p => {
    const P = n => p.fam === 'gt' ? n > p.a : n % p.a === 0;
    const Q = n => p.fam === 'gt' ? n > p.b : n % p.b === 0;
    const kinds = [n => imp(Q(n), P(n)), n => imp(!P(n), !Q(n)), n => imp(!Q(n), !P(n))];
    const shown = arrange([0, 1, 2], p.ord);
    const holds = fn => { for (let n = 1; n <= 3000; n++) if (!fn(n)) return 0; return 1; };
    return [...shown.map(k => holds(kinds[k])), shown.indexOf(2) + 1];
  },
  /* Options are shown as the arrangement numbered ord of [p ∧ ¬q, ¬p → ¬q, p → ¬q, ¬p ∧ q]; the negation of the
     rule is the first. A cycle breaks the rule when the reading is below a and the door is open. */
  q14: p => {
    const slot = arrange([0, 1, 2, 3], p.ord).indexOf(0) + 1;
    let broke = 0;
    for (const [reading, locked] of p.log) if (reading < p.a && !locked) broke++;
    return [slot, broke];
  },
  /* The domain is tested element by element. Claim A: every element passes P; claim B: some element passes Q. */
  q15: p => {
    const P = x => p.pf === 'gt' ? x > p.pc : p.pf === 'lt' ? x < p.pc : 2 * x - 1 > p.pc;
    const Q = x => p.qf === 'sq' ? x * x < p.qc : p.qf === 'gt' ? x > p.qc : p.qf === 'lt' ? x < p.qc : x % p.qc === 0;
    const wit = p.dom.filter(Q).length;
    return [p.dom.every(P) ? 1 : 0, wit > 0 ? 1 : 0, wit];
  },
  /* Walk n = 1 … N and collect the n where the claim fails; sums are built up one term at a time. */
  q16: p => {
    const bad = [];
    let sum = 0;
    for (let n = 1; n <= p.N; n++) {
      sum += n;
      const ok = p.fam === 'sum' ? sum < p.c : p.fam === 'sq' ? n * n < p.k * n + p.c
        : p.fam === 'pow' ? Math.pow(2, n) < p.k * n + p.c : (n * n + p.c) % p.k !== 0;
      if (!ok) bad.push(n);
    }
    return [bad.length ? bad[0] : 0, bad.length];
  },
  /* Each crate breaks the first rule when it is over the weight, fragile, and loose. The second rule is walked as in q16. */
  q17: p => {
    let broken = 0;
    for (const [kg, fragile, strapped] of p.log) if (kg > p.w && fragile === 1 && strapped === 0) broken++;
    let sum = 0, first = 0;
    for (let n = 1; n <= p.N && !first; n++) {
      sum += n;
      const ok = p.fam === 'sum' ? sum < p.c : p.fam === 'sq' ? n * n < p.k * n + p.c
        : p.fam === 'pow' ? Math.pow(2, n) < p.k * n + p.c : (n * n + p.c) % p.k !== 0;
      if (!ok) first = n;
    }
    return [broken, first];
  },
  /* Read the premises, the conclusion and the letters from the prompt; build the table over those letters and count
     the rows where every premise is true, then those with a false conclusion. */
  q18: p => {
    const t = promptOf('q18', p), prem = [...t.matchAll(/premise \d+, ([^;]+);/g)].map(m => parse(m[1]));
    const conc = parse(grab(t, /conclusion: (.+?)\. Build/)[1]), letters = grab(t, /truth table over (.+?) \(/)[1].split(/, | and /);
    let all = 0, failing = 0;
    for (const row of rowObjs(letters)) if (prem.every(f => f(row))) { all++; if (!conc(row)) failing++; }
    return [all, failing, failing === 0 ? 1 : 0];
  },
  /* Each case: the rule is If P then Q, with P the atom S (or its negation) and Q the atom T (or its negation).
     r = 0: the log affirms P, modus ponens, so Q is true and the asked atom is T. r = 1: the log denies Q, modus
     tollens, so P is false and the asked atom is S. The rules are listed in the order [ponens, tollens] or reversed. */
  q19: p => {
    const order = p.ord === 0 ? ['mp', 'mt'] : ['mt', 'mp'];
    const one = (x, y, r) => {
      if (r === 0) { const Q = true; return [y === 1 ? (Q ? 0 : 1) : (Q ? 1 : 0), order.indexOf('mp') + 1]; }
      const P = false; return [x === 1 ? (P ? 0 : 1) : (P ? 1 : 0), order.indexOf('mt') + 1];
    };
    return [...one(p.x1, p.y1, p.r1), ...one(p.x2, p.y2, p.r2)];
  },
  /* A speech is valid when no row of its truth table has true premises and a false conclusion. p.f only names which
     pattern each speech is (the speeches are English sentences), so the patterns are written out above in SPEECH. */
  q20: p => {
    const valid = form => {
      const [premises, conclusion] = SPEECH[form];
      return rowsOf(3).every(r => !premises.every(f => f(...r)) || conclusion(...r));
    };
    return [...p.f.map(form => valid(form) ? 1 : 0), p.f.indexOf('chain') + 1];
  }
});
})();
