/* Independent oracles for Discrete mathematics practice missions, file 2 of 8: q06b–q10d (game/realms/disc/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Every ordered pair of two lists, as an explicit array. */
const pairs = (A, B) => { const out = []; for (const a of A) for (const b of B) out.push([a, b]); return out; };
const uniq = L => L.filter((x, i) => L.indexOf(x) === i);
/* Enumerate every sequence of `len` different keys out of 1..keys and keep those passing the test. */
const seqs = (keys, len, ok) => {
  let n = 0;
  const go = (seq) => { if (seq.length === len) { if (ok(seq)) n++; return; } for (let k = 1; k <= keys; k++) if (!seq.includes(k)) go(seq.concat(k)); };
  go([]); return n;
};
Object.assign(window.ORACLE, {
  /* Build the full grid of pairs and count it; filter the grid for b = a + D. */
  q06b: p => { const g = pairs(p.A, p.B); return [g.length, g.filter(x => x[1] === x[0] + p.D).length]; },
  /* Grid of kits: count all, those with sum <= T, those with sum > T. */
  q06c: p => { const g = pairs(p.A, p.B); return [g.length, g.filter(x => x[0] + x[1] <= p.T).length, g.filter(x => x[0] + x[1] > p.T).length]; },
  /* Sets first (drop repeats), then grid; count pairs with a = b. */
  q06d: p => { const g = pairs(uniq(p.LA), uniq(p.LB)); return [g.length, g.filter(x => x[0] !== x[1]).length]; },
  /* f given as a list: f(a) is entry a; the range is the set of entries; unfed pumps are pumps 1..k not in it. */
  q07b: p => {
    const r = uniq(p.f); let unfed = 0;
    for (let pump = 1; pump <= p.k; pump++) if (!p.f.includes(pump)) unfed++;
    return [p.f[p.a - 1], r.length, unfed];
  },
  /* Charge for each load x = 1..m, capped at C. */
  q07c: p => {
    const f = x => Math.min(p.p * x + p.q, p.C), outs = [];
    for (let x = 1; x <= p.m; x++) outs.push(f(x));
    return [f(p.a), uniq(outs).length];
  },
  /* Totals for every pair; tally each total. */
  q07d: p => {
    const tally = {}; for (const [a, b] of pairs(p.A, p.B)) tally[a + b] = (tally[a + b] || 0) + 1;
    const counts = Object.values(tally);
    return [pairs(p.A, p.B).length, counts.length, Math.max(...counts)];
  },
  /* Bunks 1..k: onto if every bunk appears; one-to-one if no bunk appears twice; count the bunks never given. */
  q08b: p => {
    let missing = 0, twice = false;
    for (let b = 1; b <= p.k; b++) { const c = p.f.filter(x => x === b).length; if (c === 0) missing++; if (c > 1) twice = true; }
    return [missing === 0 ? 1 : 0, twice ? 0 : 1, missing];
  },
  /* Tally per chute: zeros are empty chutes; a crate shares if it is not the first in its chute. */
  q08c: p => {
    let empty = 0, shared = 0;
    for (const c of p.cnt) { if (c === 0) empty++; else shared += c - 1; }
    return [empty, empty === 0 ? 1 : 0, shared];
  },
  /* x runs from -p to q; f(x) = x*x; slots 0..(largest square). */
  q08d: p => {
    const outs = []; for (let x = -p.p; x <= p.q; x++) outs.push(x * x);
    const top = Math.max(p.p * p.p, p.q * p.q), r = uniq(outs).length;
    return [r === outs.length ? 1 : 0, r, top + 1 - r];
  },
  /* Sum rule on the racks; inclusion-exclusion for the catalogue, checked by building the three groups. */
  q09b: p => {
    const onlyM = p.p - p.r, onlyI = p.q - p.r, either = onlyM + onlyI + p.r;
    return [p.a + p.b + p.c + p.d, either, p.N - either];
  },
  /* Crew in the three groups only-cook, only-clean, both. */
  q09c: p => { const oc = p.c - p.b, ol = p.l - p.b; return [oc + ol, oc + ol + p.b, oc + ol + p.b + p.z]; },
  /* Rated in each store (cold or heat); disjoint stores add; the rest of the catalogue is unrated. */
  q09d: p => {
    const sa = (p.c1 - p.b1) + (p.h1 - p.b1) + p.b1, sb = (p.c2 - p.b2) + (p.h2 - p.b2) + p.b2;
    return [sa + sb, p.N - sa - sb];
  },
  /* Enumerate the tags: letters 1..L twice, digits 0..9, with the rule as a test on the digit. */
  q10b: p => {
    const rules = [d => d % 2 === 0, d => d % 2 === 1, d => d !== 0, d => d > 6, d => d <= 3], ok = rules[p.rule];
    let free = 0, res = 0;
    for (let a = 1; a <= p.L; a++) for (let b = 1; b <= p.L; b++) for (let d = 0; d <= 9; d++) { free++; if (a !== b && ok(d)) res++; }
    return [free, res];
  },
  /* Enumerate both kinds of code. */
  q10c: p => {
    let x = 0, y = 0;
    for (let l = 1; l <= p.L; l++) for (let d1 = 0; d1 <= 9; d1++) for (let d2 = 0; d2 <= 9; d2++) if (d1 !== d2) x++;
    for (let l1 = 1; l1 <= p.L; l1++) for (let l2 = 1; l2 <= p.L; l2++) for (let d = 0; d <= 9; d++) if (l1 !== l2) y++;
    return [x, y, x + y];
  },
  /* Enumerate every code of L different keys and test the first and last. */
  q10d: p => [
    seqs(p.D, p.L, s => s[0] === p.s),
    seqs(p.D, p.L, s => s[0] === p.s && s[p.L - 1] === p.e),
    seqs(p.D, p.L, s => s[0] === p.s || s[p.L - 1] === p.e)
  ]
});
})();
