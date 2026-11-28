/* Independent oracles for Logic and proof practice missions, file 6 of 8: q26b–q30d (game/realms/logic/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Smallest prime factor by trial division, and a product-plus-one helper (Euclid's N). */
const spf = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
const euclidN = list => list.reduce((acc, x) => acc * x, 1) + 1;
/* Counting helpers: how many of 1..N satisfy a test. */
const countIf = (N, test) => { let c = 0; for (let n = 1; n <= N; n++) if (test(n)) c++; return c; };
/* Multiple-choice position. The prompt lists the methods in a shuffled order; order[i] says which base method
   (0 / 1 / 2 = direct / contrapositive / cases, read off the printed prompts) sits in slot i. Which method suits a
   claim is a judgement, not a computation, so CLAIM below writes it out per claim. */
const slotOf = (order, base) => order.indexOf(base) + 1;
const DIRECT = 0, CONTRA = 1, CASES = 2;
/* q27b and q27d list four conditionals built from the rule "if p, then q", by base index: ¬q → ¬p, q → p, ¬p → ¬q and
   p → ¬q ([[atom, negated], [atom, negated]] below). The statement a proof by contrapositive proves is the one a truth
   table shows equivalent to p → q; the answer is its slot. */
const BASES = [[['q', true], ['p', true]], [['q', false], ['p', false]], [['p', true], ['q', true]], [['p', false], ['q', true]]];
const lit = ([atom, neg], row) => (atom === 'p' ? row.p : row.q) !== neg;
const equivToRule = ([h, c]) => { for (const p of [true, false]) for (const q of [true, false]) { const row = { p, q }; if ((!lit(h, row) || lit(c, row)) !== (!p || q)) return false; } return true; };
const equivSlot = order => { const hits = order.map((b, i) => equivToRule(BASES[b]) ? i + 1 : 0).filter(Boolean); if (hits.length !== 1) throw new Error('equivalent statements: ' + hits.length); return hits[0]; };
/* The twelve claims of q29b/q29c/q29d, numbered as the prompts show them: id -> best method, and the number the
   proof hands over for the two numbers x, y. Ids 0,1,6,7 direct; 2,3,8,9 contrapositive; 4,5,10,11 cases. */
const CLAIM = [
  { m: DIRECT, v: (x, y) => (x + y - 1) / 2 },      /* 0: m odd, n even, m + n = 2k + 1 */
  { m: DIRECT, v: (x, y) => (x - y) / 4 },          /* 1: 4 | a, 4 | b, a - b = 4m */
  { m: CONTRA, v: x => (5 * x + 1) / 2 },           /* 2: 5n + 1 = 2k */
  { m: CONTRA, v: x => (x * x - 2) / 2 },           /* 3: n^2 - 2 = 2k */
  { m: CASES,  v: x => (x + 1) * (x + 4) / 2 },     /* 4: (n+1)(n+4) / 2 */
  { m: CASES,  v: x => x * (3 * x + 1) / 2 },       /* 5: n(3n+1) / 2 */
  { m: DIRECT, v: (x, y) => (x * y - 1) / 2 },      /* 6: m, n odd, m x n = 2k + 1 */
  { m: DIRECT, v: (x, y) => (x - y) / 7 },          /* 7: 7 | a, 7 | b, a - b = 7m */
  { m: CONTRA, v: x => (3 * x + 1 - 1) / 2 },       /* 8: 3n + 1 = 2k + 1 */
  { m: CONTRA, v: x => (x * x + 4) / 2 },           /* 9: n^2 + 4 = 2k */
  { m: CASES,  v: x => (x + 3) * (x + 6) / 2 },     /* 10: (n+3)(n+6) / 2 */
  { m: CASES,  v: x => (x - 1) * (x + 4) / 2 }      /* 11: (n-1)(n+4) / 2 */
];
Object.assign(window.ORACLE, {
  /* q26b: boxes counted by repeated subtraction of d; then the difference measured in boxes. */
  q26b: p => {
    const a = p.d * p.s, b = p.d * p.t;
    let boxesA = 0, left = a; while (left > 0) { left -= p.d; boxesA++; }
    let boxesB = 0; left = b; while (left > 0) { left -= p.d; boxesB++; }
    let m = 0; left = a - b; while (left > 0) { left -= p.d; m++; }
    return [boxesA, boxesB, m];
  },
  /* q26c: the three run lengths in metres, total length, then sections by dividing the whole length. */
  q26c: p => {
    const total = [p.s, p.t, p.u].reduce((acc, k) => acc + p.d * k, 0);
    return [total / p.d, (total / p.d) * p.c];
  },
  /* q26d: beam lengths, then s and t by division, m from the total, j by halving. */
  q26d: p => {
    const a = p.d * p.s, b = p.d * p.t, total = a + b;
    return [a / p.d, b / p.d, total / p.d, total / 2];
  },
  /* q27b: the proof shows "if not-conclusion then not-hypothesis": the slot of the statement equivalent to the rule. The tray value is
     read off the rule (f picks 5n+2, 3n, 7n-4, n^2+1) and k is the value halved, rounded down. */
  q27b: p => {
    const v = [5 * p.x + 2, 3 * p.x, 7 * p.x - 4, p.x * p.x + 1][p.f];
    return [equivSlot(p.order), v, Math.floor(v / 2)];
  },
  /* q27c: count the crates where the conclusion is false (f 0,1,3: n even; f 2: n odd), then evaluate. */
  q27c: p => {
    const falseConclusion = n => (p.f === 2 ? n % 2 === 1 : n % 2 === 0);
    const v = [3 * p.x + 4, 5 * p.x, p.x * p.x - 3, 9 * p.x + 1][p.f];
    return [countIf(p.N, falseConclusion), v, Math.floor(v / 2)];
  },
  /* q27d: the slot of the statement equivalent to the rule (its contrapositive); search upward for the first odd multiple of m (a multiple of m, not of m*k). */
  q27d: p => {
    let n = p.T + 1; while (!(n % p.m === 0 && n % (p.m * p.k) !== 0)) n++;
    return [equivSlot(p.order), n, p.x % p.m];
  },
  /* q28b: two cases (even, odd); pairs counted by halving the seedling total. */
  q28b: p => {
    const seeds = n => n * (p.a * n + p.b);
    return [2, seeds(p.e) / 2, seeds(p.o) / 2];
  },
  /* q28c: handshakes by counting pairs one at a time; the cross-crew handshakes are all pairs less the inside pairs. */
  q28c: p => {
    const pairs = n => { let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) c++; return c; };
    return [pairs(p.e), pairs(p.o), pairs(p.e + p.o) - pairs(p.e) - pairs(p.o)];
  },
  /* q28d: three cases; n = 3j, 3j+1, 3j+2 as the prompt's n = 27, 13, 17 pattern. */
  q28d: p => {
    const f = n => n * (n + 1) * (n + 2) / 3;
    return [3, f(3 * p.j0), f(3 * p.j1 + 1), f(3 * p.j2 + 2)];
  },
  /* q29b: best method of the claim, then its number. */
  q29b: p => [slotOf(p.order, CLAIM[p.w].m), CLAIM[p.w].v(p.x, p.y)],
  /* q29c: claims a (X) and b (Y); the first number comes from X with (xa, ya), the second from Y with (xb, yb). */
  q29c: p => [slotOf(p.order, CLAIM[p.a].m), slotOf(p.order, CLAIM[p.b].m), CLAIM[p.a].v(p.xa, p.ya) + CLAIM[p.b].v(p.xb, p.yb)],
  /* q29d: three claims c[0..2] with their number pairs pr[0..2]. */
  q29d: p => [0, 1, 2].map(i => slotOf(p.order, CLAIM[p.c[i]].m)).concat([[0, 1, 2].reduce((s, i) => s + CLAIM[p.c[i]].v(p.pr[i][0], p.pr[i][1]), 0)]),
  /* q30b: Euclid's N, its smallest prime factor, and whether N is prime (N equals its own smallest factor). */
  q30b: p => { const N = euclidN(p.ps), f = spf(N); return [N, f, f === N ? 1 : 0]; },
  /* q30c: run the argument twice, the list growing by the first smallest prime factor. */
  q30c: p => {
    const N1 = euclidN(p.ps), f1 = spf(N1), N2 = euclidN(p.ps.concat([f1]));
    return [N1, f1, N2, spf(N2)];
  },
  /* q30d: N odd because 2 is on the list, k = (N - 1) / 2, smallest prime factor and cofactor. */
  q30d: p => { const N = euclidN(p.ps), f = spf(N); return [N, (N - 1) / 2, f, N / f]; }
});
})();
