/* Independent oracles for Abstract algebra: patterns of moves practice missions, file 6 of 8: q26b–q30d (game/realms/abstract/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Order of the reading x on a dial of n positions: press until it is home again. */
const ordIn = (x, n) => { let j = 1, v = ((x % n) + n) % n; while (v !== 0) { v = (v + x) % n; j++; } return j; };
/* Order of a tuple of readings on dials of the given sizes: press until every dial is home together. */
const ordTuple = (xs, ns) => { let j = 1; for (;;) { if (xs.every((x, i) => (x * j) % ns[i] === 0)) return j; j++; } };
/* The coset (as a sorted list of crate numbers) of x in Z_m, for the subgroup H = multiples of d. */
const subgroup = (m, d) => { const s = new Set(); for (let j = 0; j < m; j++) s.add((j * d) % m); return s; };
const cosetKey = (x, m, H) => { const c = []; H.forEach(h => c.push((x + h) % m)); return c.sort((a, b) => a - b).join(','); };
const cosets = (m, H) => { const keys = new Set(); for (let x = 0; x < m; x++) keys.add(cosetKey(x, m, H)); return keys; };
/* Order of the coset x + H: add x again and again until the total lies in H. */
const cosetOrder = (x, m, H) => { let j = 1, v = x % m; while (!H.has(v)) { v = (v + x) % m; j++; } return j; };
/* Rotations of a ring pattern (string): every turn gives a string; stabiliser = turns that give the same string. */
const rot = (s, k) => s.slice(k) + s.slice(0, k);
const orbitOf = s => { const set = new Set(); for (let k = 0; k < s.length; k++) set.add(rot(s, k)); return set; };
const stab = s => { let c = 0; for (let k = 0; k < s.length; k++) if (rot(s, k) === s) c++; return c; };
/* Homomorphism table x -> k x mod M from Z_N. */
const table = (N, M, k) => { const t = []; for (let x = 0; x < N; x++) t.push((k * x) % M); return t; };
Object.assign(window.ORACLE, {
  /* q26b: list every pair (s, c), find each pair's order by pressing until home, take the maximum. */
  q26b: p => {
    let n = 0, best = 0;
    for (let s = 0; s < p.a; s++) for (let c = 0; c < p.b; c++) { n++; best = Math.max(best, ordTuple([s, c], [p.a, p.b])); }
    return [n, best, best === n ? 1 : 0];
  },
  /* q26c: press the test button, recording the states seen, until (0, 0) returns. */
  q26c: p => {
    const seen = new Set(['0,0']); let k = 1;
    while ((k % p.a) !== 0 || (k % p.b) !== 0) { seen.add((k % p.a) + ',' + (k % p.b)); k++; }
    return [k, p.a * p.b - seen.size, seen.size === p.a * p.b ? 1 : 0];
  },
  /* q26d: list every triple (x, y, z) and find its order; x, y, z are the readings of the one named state. */
  q26d: p => {
    const ns = [p.a, p.b, p.c]; let n = 0, best = 0;
    for (let x = 0; x < p.a; x++) for (let y = 0; y < p.b; y++) for (let z = 0; z < p.c; z++) { n++; best = Math.max(best, ordTuple([x, y, z], ns)); }
    return [best, ordTuple([p.x, p.y, p.z], ns), best === n ? 1 : 0];
  },
  /* q27b: a is the ring size, b the wheel size (Z_a × Z_b), w the counter reading. */
  q27b: p => [p.w % p.a, p.w % p.b, ordTuple([p.w % p.a, p.w % p.b], [p.a, p.b])],
  /* q27c: press count k (from 1) with (k mod a, k mod b) = (x, y); service moves by adding (x, y); the second opening is one full period later (found by continuing to count). */
  q27c: p => {
    const hits = []; for (let k = 1; hits.length < 2 && k < 100000; k++) if (k % p.a === p.x % p.a && k % p.b === p.y % p.b) hits.push(k);
    return [hits[0], ordTuple([p.x, p.y], [p.a, p.b]), hits[1]];
  },
  /* q27d: a ring size, b wheel size; order of (x, y); search for w in 0..ab-1; generates when order = ab. */
  q27d: p => {
    const o = ordTuple([p.x, p.y], [p.a, p.b]); let w = -1;
    for (let v = 0; v < p.a * p.b; v++) if (v % p.a === p.x % p.a && v % p.b === p.y % p.b) { w = v; break; }
    return [o, w, o === p.a * p.b ? 1 : 0];
  },
  /* q28b: m crates, H = multiples of d, x the crate named. */
  q28b: p => {
    const H = subgroup(p.m, p.d), cs = cosets(p.m, H), key = cosetKey(p.x, p.m, H);
    return [cs.size, Number(key.split(',')[0]), cosetOrder(p.x, p.m, H)];
  },
  /* q28c: m fine positions, H = multiples of d, x the calibration step. */
  q28c: p => {
    const H = subgroup(p.m, p.d); let v = p.x % p.m, j = 1; while (!H.has(v)) { v = (v + p.x) % p.m; j++; }
    return [cosets(p.m, H).size, j, ordIn(p.x, p.m)];
  },
  /* q28d: m, H = multiples of d, x the named coset; count the cosets whose order equals the number of cosets. */
  q28d: p => {
    const H = subgroup(p.m, p.d), cs = cosets(p.m, H), seen = new Set(); let gens = 0;
    for (let x = 0; x < p.m; x++) { const key = cosetKey(x, p.m, H); if (seen.has(key)) continue; seen.add(key); if (cosetOrder(x, p.m, H) === cs.size) gens++; }
    return [cs.size, cosetOrder(p.x, p.m, H), gens];
  },
  /* q29b: N input positions, M output positions, k the multiplier, t the input reading asked about. */
  q29b: p => { const t = table(p.N, p.M, p.k); return [t.filter(v => v === 0).length, new Set(t).size, t[p.t]]; },
  /* q29c: input N, output panel M lamps, multiplier k. */
  q29c: p => { const t = table(p.N, p.M, p.k); const img = new Set(t).size; return [t.filter(v => v === 0).length, img, p.M - img]; },
  /* q29d: N, M, k as above; x is the reading named in 'x + K'; x + K has the order of the first j with j x in K. */
  q29d: p => {
    const t = table(p.N, p.M, p.k); let j = 1; while (t[(j * p.x) % p.N] !== 0) j++;
    return [t.filter(v => v === 0).length, new Set(t).size, j];
  },
  /* q30b: pat is the ring read clockwise (letters). */
  q30b: p => [orbitOf(p.pat).size, stab(p.pat)],
  /* q30c: A and B are the two designs' rings read clockwise; the prompt says no turn of one gives the other. */
  q30c: p => { const a = orbitOf(p.A).size, b = orbitOf(p.B).size; return [a, b, a + b]; },
  /* q30d: pat is the ring, st the size of the motor's turn; repeat the turn and collect the colourings. */
  q30d: p => {
    const n = p.pat.length, made = new Set(); let j = 1;
    for (let i = 0; i < n; i++) made.add(rot(p.pat, (i * p.st) % n));
    while ((j * p.st) % n !== 0) j++;
    return [orbitOf(p.pat).size, j, made.size];
  },
});
})();
