/* Independent oracles for Discrete Mathematics practice missions, file 1 of 8: q01b-q05d (game/realms/disc/practice-1.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build(): real sets of numbers or labelled items are built
   and the questions are answered by testing each element, never by a counting formula.
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Every multiple of k between lo and hi (inclusive when inc is true), found by testing each integer. */
const multiples = (k, lo, hi, inc) => { const out = []; for (let n = lo; n <= hi; n++) { if (n % k !== 0) continue; if (!inc && (n <= lo || n >= hi)) continue; out.push(n); } return out; };
const uniq = list => { const s = []; for (const x of list) if (s.indexOf(x) < 0) s.push(x); return s; };
const has = (set, x) => set.indexOf(x) >= 0;
const subset = (a, b) => a.every(x => has(b, x));
const inter = (a, b) => uniq(a).filter(x => has(b, x));
const union = (a, b) => uniq(a.concat(b));
/* A universe of n numbered items; the first aN are in set A and the b items that end at index aN - ab + b are in B. */
const venn = (U, A, B, AB) => {
  const items = []; for (let i = 0; i < U; i++) items.push(i);
  const inA = items.filter(i => i < A), inB = items.filter(i => i >= A - AB && i < A - AB + B);
  return { items, inA, inB };
};
/* Build a crowd from region counts: each person is the list of sets they belong to. */
const crowd = regions => { const people = []; for (const [sets, n] of regions) for (let i = 0; i < n; i++) people.push(sets); return people; };
Object.assign(window.ORACLE, {
  /* q01b: S = multiples of k in [a, b], D = the log with repeats removed. */
  q01b: p => [multiples(p.k, p.a, p.b, true).length, uniq(p.list).length],
  /* q01c: shelves are the multiples of k in [a, b]; each holds s crates. */
  q01c: p => { const L = multiples(p.k, p.a, p.b, true); let crates = 0; for (let i = 0; i < L.length; i++) crates += p.s; return [L.length, crates]; },
  /* q01d: P = multiples of k strictly between k*s and k*(s + c + 1); M = list without repeats. */
  q01d: p => [multiples(p.k, p.k * p.s, p.k * (p.s + p.c + 1), false).length, uniq(p.list).length],
  /* q02b: is every part of R in D, and how many parts of R are missing from D. */
  q02b: p => [subset(p.R, p.D) ? 1 : 0, p.R.filter(x => !has(p.D, x)).length],
  /* q02c: the shelf releases A only when A is inside S; otherwise the shelf is untouched. */
  q02c: p => {
    const ok = subset(p.A, p.S), left = ok ? p.S.filter(x => !has(p.A, x)) : p.S.slice();
    let mass = 0; for (let i = 0; i < left.length; i++) mass += p.w;
    return [ok ? 1 : 0, left.length, mass];
  },
  /* q02d: B = multiples of k in [a, b]; A with repeats removed; rack crates not on the list. */
  q02d: p => { const B = multiples(p.k, p.a, p.b, true), A = uniq(p.A); return [subset(A, B) ? 1 : 0, B.filter(x => !has(A, x)).length]; },
  /* q03b: s shared items, then a only in A, then b only in B, taken from the pick list. */
  q03b: p => {
    const A = p.pick.slice(0, p.s + p.a), B = p.pick.slice(0, p.s).concat(p.pick.slice(p.s + p.a, p.s + p.a + p.b));
    return [inter(A, B).length, union(A, B).length];
  },
  /* q03c: each bay inspected at all earns p credits, a bay inspected twice earns q more. */
  q03c: p => {
    const both = inter(p.A, p.B), any = union(p.A, p.B); let credits = 0;
    for (const x of any) credits += p.p + (has(both, x) ? p.q : 0);
    return [both.length, any.length, credits];
  },
  /* q03d: P = multiples of k in [a, b]; Q = the log with repeats removed. */
  q03d: p => { const P = multiples(p.k, p.a, p.b, true), Q = uniq(p.Q); return [inter(P, Q).length, union(P, Q).length]; },
  /* q04b: with U crates, A with a seal, B with a barcode and AB with both: barcode without seal, and neither. */
  q04b: p => { const v = venn(p.U, p.A, p.B, p.AB); return [v.inB.filter(i => !has(v.inA, i)).length, v.items.filter(i => !has(v.inA, i) && !has(v.inB, i)).length]; },
  /* q04c: crates dented or wet go to inspection at w minutes each. */
  q04c: p => {
    const v = venn(p.U, p.A, p.B, p.AB), seen = v.items.filter(i => has(v.inA, i) || has(v.inB, i));
    let mins = 0; for (let i = 0; i < seen.length; i++) mins += p.w;
    return [seen.length, v.items.length - seen.length, mins];
  },
  /* q04d: the prompt prints |U| = A + B - AB + N, |A|, |B| and the untagged N, and hides the overlap. Using only those
     four printed numbers, try every possible overlap x, build the store rooms crate by crate (red only, blue only,
     both, none) and keep the one arrangement whose crate count matches |U|; then count both tags and blue but no red. */
  q04d: p => {
    const U = p.A + p.B - p.AB + p.N, fits = [];
    for (let x = 0; x <= Math.min(p.A, p.B); x++) {
      const c = crowd([[['A'], p.A - x], [['B'], p.B - x], [['A', 'B'], x], [[], p.N]]);
      if (c.length === U) fits.push(c);
    }
    if (fits.length !== 1) throw new Error('q04d: ' + fits.length + ' arrangements fit');
    const c = fits[0];
    return [c.filter(s => has(s, 'A') && has(s, 'B')).length, c.filter(s => has(s, 'B') && !has(s, 'A')).length];
  },
  /* q05b: build the crew person by person, then count the people by how many skills each has. */
  q05b: p => {
    const c = crowd([[['D'], p.oF], [['L'], p.oC], [['K'], p.oH], [['D', 'L'], p.FC], [['D', 'K'], p.FH], [['L', 'K'], p.CH], [['D', 'L', 'K'], p.FCH], [[], p.none]]);
    return [c.filter(s => s.length === 2).length, c.filter(s => s.length === 0).length];
  },
  /* q05c: build the manifest crate by crate; exactly one bay, none, and two or more. */
  q05c: p => {
    const c = crowd([[['F'], p.oF], [['C'], p.oC], [['H'], p.oH], [['F', 'C'], p.FC], [['F', 'H'], p.FH], [['C', 'H'], p.CH], [['F', 'C', 'H'], p.FCH], [[], p.none]]);
    return [c.filter(s => s.length === 1).length, c.filter(s => s.length === 0).length, c.filter(s => s.length >= 2).length];
  },
  /* q05d: build the tally crate by crate; exactly one set, none, and fragile but not heavy. */
  q05d: p => {
    const c = crowd([[['F'], p.oF], [['C'], p.oC], [['H'], p.oH], [['F', 'C'], p.FC], [['F', 'H'], p.FH], [['C', 'H'], p.CH], [['F', 'C', 'H'], p.FCH], [[], p.none]]);
    return [c.filter(s => s.length === 1).length, c.filter(s => s.length === 0).length, c.filter(s => has(s, 'F') && !has(s, 'H')).length];
  },
});
})();
