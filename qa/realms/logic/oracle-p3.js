/* Independent oracles for Logic and proof practice missions, file 3 of 8: q11b–q15d (game/realms/logic/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* ---- shared helpers: plain counting and search; statements are read from the printed prompt ---- */
const upto = N => Array.from({ length: N }, (_, i) => i + 1);
const tally = (xs, f) => xs.filter(f).length;
const imp = (a, b) => !a || b;
/* All arrangements of a string's characters in dictionary order. */
const arrangements = s => s.length <= 1 ? [s] : [...s].flatMap((c, i) => arrangements(s.slice(0, i) + s.slice(i + 1)).map(r => c + r));
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
/* The two final columns of the two statements a prompt prints, as 0/1 lists over the standard-order rows. */
const columns = (id, p, re, letters) => { const m = grab(promptOf(id, p), re), rs = rowObjs(letters);
  return [rs.map(r => parse(m[1])(r) ? 1 : 0), rs.map(r => parse(m[2])(r) ? 1 : 0)]; };
const firstDiff = (A, B) => { for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) return i + 1; return 0; };
const total = xs => xs.reduce((s, x) => s + x, 0);
/* Numeric conditions as the prompts print them. */
const test = (o, x) => {
  switch (o.k) {
    case 'low': return x < o.c;
    case 'high': return x > o.c;
    case 'lt': return x < o.c;
    case 'gt': return x > o.c;
    case 'mult': return x % o.c === 0;
    case 'odd': return x % 2 === 1;
    case 'even': return x % 2 === 0;
  }
  throw new Error('unknown kind ' + o.k);
};
/* Place (1-based) of the correct option when three options are shown in the arrangement numbered `ord`
   (arrangements of 0,1,2 in dictionary order; the correct option is option 0 of the author's list). ord is only an
   index into the printed order of the option texts, so the oracle follows the same numbering. */
const placeOfCorrect = ord => arrangements('012')[ord].indexOf('0') + 1;
Object.assign(window.ORACLE, {
  /* q11b: two 8-row columns, then the first row where they differ. */
  q11b: p => { const [A, B] = columns('q11b', p, /Controller A opens the vent when (.+?) is true; controller B opens it when (.+?) is true\./, ['p', 'q', 'r']); return [total(A), total(B), firstDiff(A, B)]; },
  /* q11c: rows where the columns differ, times the minutes per check. */
  q11c: p => { const [A, B] = columns('q11c', p, /Design A lights the lamp when (.+?) is true; design B lights it when (.+?) is true\./, ['p', 'q', 'r']); const d = tally(A, (x, i) => x !== B[i]); return [total(A), d, d * p.w]; },
  /* q11d: two 16-row columns. */
  q11d: p => { const [A, B] = columns('q11d', p, /Rule A opens it when (.+?) is true; rule B opens it when (.+?) is true\./, ['p', 'q', 'r', 's']); return [total(A), total(B), tally(A, (x, i) => x !== B[i])]; },
  /* q12b: the right rewrite is "opposite of each part, with and/or swapped"; trays cleared counted directly. */
  q12b: p => {
    const cleared = tally(upto(p.N), n => !(p.form === 'and' ? test(p.p, n) && test(p.q, n) : test(p.p, n) || test(p.q, n)));
    return [placeOfCorrect(p.ord), cleared];
  },
  /* q12c: walk the dock numbers once, noting multiples up to a and which containers pass both checks. */
  q12c: p => {
    const mults = tally(upto(p.a), n => n % p.k === 0), cleared = tally(upto(p.N), n => n <= p.a && n % p.k !== 0);
    return [mults, cleared, cleared * p.t];
  },
  /* q12d: count slots making the bracket true, free = all the others. */
  q12d: p => {
    const inner = tally(upto(p.N), n => p.form === 'and' ? n % p.a === 0 && n % p.b === 0 : n % p.a === 0 || n % p.b === 0);
    return [placeOfCorrect(p.ord), inner, p.N - inner];
  },
  /* q13b: decide each of the four statements by searching for a breaking number (large range stands for "every number"). */
  q13b: p => {
    const P = n => p.fam === 'mult' ? n % p.a === 0 : p.fam === 'low' ? n < p.a : n <= p.a;
    const Q = n => p.fam === 'mult' ? n % p.b === 0 : p.fam === 'low' ? n < p.b : n <= p.b;
    const holds = f => upto(5000).every(f) ? 1 : 0;
    return [holds(n => imp(P(n), Q(n))), holds(n => imp(Q(n), P(n))), holds(n => imp(!P(n), !Q(n))), holds(n => imp(!Q(n), !P(n)))];
  },
  /* q13c: the rule is "multiple of b*m implies multiple of b". Converse and inverse broken by the same crates. */
  q13c: p => {
    const a = p.b * p.m, ns = upto(p.N);
    const converse = ns.filter(n => n % p.b === 0 && !(n % a === 0));
    const inverse = ns.filter(n => !(n % a === 0) && n % p.b === 0);
    return [converse[0], converse.length, inverse.length];
  },
  /* q13d: the contrapositive is "not-then implies not-if"; count numbers making the if true and the then false. */
  q13d: p => {
    const bad = tally(upto(60), n => n > p.a && n % p.k === 0 && !(n > p.b));
    return [placeOfCorrect(p.ord), bad, bad === 0 ? 1 : 0];
  },
  /* q14b: read the log day by day. */
  q14b: p => {
    const high = tally(p.log, e => e[0] > p.a), broke = tally(p.log, e => e[0] > p.a && e[1] === 0);
    return [high, broke, p.log.length - broke];
  },
  /* q14c: late returns, dark ones among them, fine per rule-breaker. */
  q14c: p => {
    const late = tally(p.log, e => e[0] > p.h), dark = tally(p.log, e => e[0] > p.h && e[1] === 0);
    return [late, dark, dark * p.f];
  },
  /* q14d: sample by sample, mark which statements it breaks; count the ones that break neither. */
  q14d: p => {
    let rule = 0, conv = 0, neither = 0;
    for (const [deg, intact] of p.log) {
      const r = deg < p.a && !intact, c = intact && !(deg < p.a);
      if (r) rule++; if (c) conv++; if (!r && !c) neither++;
    }
    return [rule, conv, neither];
  },
  /* q15b: ∀ claim true only when no size fails it; ∃ claim true when some size makes it true. */
  q15b: p => {
    const fails = tally(p.dom, x => !test(p.A, x)), wit = tally(p.dom, x => test(p.Bc, x));
    return [fails === 0 ? 1 : 0, fails, wit > 0 ? 1 : 0, wit];
  },
  /* q15c: pallets at or over the limit fail; the claim holds when none does. */
  q15c: p => { const fails = tally(p.dom, x => !(x < p.L)); return [fails, fails === 0 ? 1 : 0, fails * p.f]; },
  /* q15d: ∀ over "or" parts, ∃ over "and" parts. */
  q15d: p => {
    const fails = tally(p.dom, x => !(test(p.A1, x) || test(p.A2, x))), wit = tally(p.dom, x => test(p.B1, x) && test(p.B2, x));
    return [fails === 0 ? 1 : 0, fails, wit > 0 ? 1 : 0, wit];
  }
});
})();
