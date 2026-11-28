/* Independent oracles for Abstract algebra: patterns of moves practice missions, file 7 of 8: q31b–q35d (game/realms/abstract/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Every permutation of 0..n-1 as an array (n! of them), by recursive insertion. */
const allPerms = n => {
  let out = [[]];
  for (let i = 0; i < n; i++) {
    const next = [];
    for (const q of out) for (let pos = 0; pos <= q.length; pos++) next.push([...q.slice(0, pos), i, ...q.slice(pos)]);
    out = next;
  }
  return out;
};
/* Sorted cycle lengths of a permutation array (fixed points count as length 1). */
const cycleType = perm => {
  const seen = perm.map(() => false), lens = [];
  for (let s = 0; s < perm.length; s++) {
    if (seen[s]) continue;
    let len = 0, x = s;
    while (!seen[x]) { seen[x] = true; x = perm[x]; len++; }
    lens.push(len);
  }
  return lens.sort((a, b) => b - a);
};
/* Repeat the permutation until every position is back where it began: the number of repeats. */
const repeatsToBack = perm => {
  let cur = perm.map((_, i) => i), n = 0;
  do { cur = cur.map(i => perm[i]); n++; } while (cur.some((v, i) => v !== i));
  return n;
};
const gcd = (a, b) => b ? gcd(b, a % b) : a;
/* Number of ways to write n as a sum of positive whole numbers, order ignored (counted by listing them). */
const partitions = (n, max = n) => {
  if (n === 0) return 1;
  let c = 0;
  for (let first = Math.min(n, max); first >= 1; first--) c += partitions(n - first, first);
  return c;
};
const factorise = n => { const f = []; for (let q = 2; n > 1; q++) { let e = 0; while (n % q === 0) { n /= q; e++; } if (e) f.push([q, e]); } return f; };
/* Rotations of 0..n-1 of a cycle of n places, and cyclic colourings listed digit by digit. */
const colourings = (m, k) => {
  const out = [], c = new Array(m).fill(0);
  for (;;) {
    out.push(c.slice());
    let i = m - 1; while (i >= 0 && c[i] === k - 1) { c[i] = 0; i--; }
    if (i < 0) break;
    c[i]++;
  }
  return out;
};
const rotated = (c, r) => c.map((_, i) => c[(i + r) % c.length]);
const same = (a, b) => a.every((v, i) => v === b[i]);
/* For a ring of m places and k colours: fixed[r] = colourings left alone by a turn of r steps; designs = turn-classes
   (a colouring is counted as the representative of its class when no turn gives a lexicographically smaller one). */
const ringTable = (m, k) => {
  const fixed = new Array(m).fill(0);
  let designs = 0, total = 0;
  for (const c of colourings(m, k)) {
    total++;
    let minimal = true;
    for (let r = 0; r < m; r++) {
      const t = rotated(c, r);
      if (same(t, c)) fixed[r]++;
      for (let i = 0; i < m; i++) { if (t[i] < c[i]) { minimal = false; break; } if (t[i] > c[i]) break; }
    }
    if (minimal) designs++;
  }
  return { fixed, designs, total };
};
/* The rotation group of a solid, found as every signed permutation matrix of 3 axes with determinant +1 that carries
   the solid's corner set onto itself; the marked feature is a point (corner, edge midpoint or face centre). */
const solid = {
  cube: { corners: [[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]] },
  oct: { corners: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]] },
  tet: { corners: [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]] }
};
const rotationsOf = corners => {
  const key = v => v.join(','), set = new Set(corners.map(key)), out = [];
  for (const perm of allPerms(3)) for (let s = 0; s < 8; s++) {
    const sg = [s & 1 ? -1 : 1, s & 2 ? -1 : 1, s & 4 ? -1 : 1];
    const M = [0, 1, 2].map(i => { const row = [0, 0, 0]; row[perm[i]] = sg[i]; return row; });
    const det = M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1]) - M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0]) + M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);
    if (det !== 1) continue;
    const apply = v => M.map(row => row[0]*v[0] + row[1]*v[1] + row[2]*v[2]);
    if (corners.every(v => set.has(key(apply(v))))) out.push(apply);
  }
  return out;
};
/* Feature points of each solid: corners as given; edges as midpoints of the shortest segments; faces as centres of the
   corner sets that lie on a common plane facing outward (found by the face normals of the solid). */
const features = (shape, what) => {
  const C = solid[shape].corners, d2 = (a, b) => a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0);
  if (what === 'C') return C;
  let minD = Infinity;
  for (const a of C) for (const b of C) if (a !== b) minD = Math.min(minD, d2(a, b));
  const pts = [];
  if (what === 'E') {
    for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) if (d2(C[i], C[j]) === minD) pts.push(C[i].map((v, t) => (v + C[j][t]) / 2));
    return pts;
  }
  /* faces: every set of corners that are mutually at the shortest distance (triangles) or form a square with the
     shortest distance (cube); the centre is the average. */
  const n = C.length, seen = new Set();
  const tryFace = idx => {
    const key = idx.slice().sort().join();
    if (seen.has(key)) return; seen.add(key);
    pts.push([0, 1, 2].map(t => idx.reduce((s, i) => s + C[i][t], 0) / idx.length));
  };
  if (shape === 'cube') {
    for (let a = 0; a < 3; a++) for (const s of [1, -1]) tryFace(C.map((v, i) => v[a] === s ? i : -1).filter(i => i >= 0));
  } else {
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let l = j + 1; l < n; l++)
      if (d2(C[i], C[j]) === minD && d2(C[j], C[l]) === minD && d2(C[i], C[l]) === minD) tryFace([i, j, l]);
  }
  return pts;
};
const pointKey = v => v.map(x => Math.round(x * 1000) / 1000 + 0).join(',');
Object.assign(window.ORACLE, {
  /* q31b: m labelled slots, every reordering listed; j and k are the item numbers, w only picks the wording (bolts/lamps). Count the
     reorderings fixing j, then those fixing both j and k. */
  q31b: p => {
    const perms = allPerms(p.m), j = p.j - 1, k = p.k - 1;
    let stab = 0, both = 0;
    for (const q of perms) { if (q[j] === j) { stab++; if (q[k] === k) both++; } }
    return [stab, both];
  },
  /* q31c: kind is a solid letter group + C/E/F (corners, edges, faces): list the 24 (or 12) turns, send the marked
     feature through all of them, then count the turns that land it in the first k places of its orbit. */
  q31c: p => {
    const shape = { cube: 'cube', oct: 'oct', tet: 'tet' }[p.kind.slice(0, -1) || ''] || p.kind.slice(0, -1);
    const what = p.kind.slice(-1), rots = rotationsOf(solid[shape].corners), pts = features(shape, what), marked = pts[0];
    const places = [], counts = {};
    for (const rot of rots) { const key = pointKey(rot(marked)); if (!(key in counts)) { counts[key] = 0; places.push(key); } counts[key]++; }
    const accepted = places.slice(0, p.k);
    const fit = rots.filter(rot => accepted.includes(pointKey(rot(marked)))).length;
    return [places.length, rots.filter(rot => pointKey(rot(marked)) === pointKey(marked)).length, fit];
  },
  /* q31d: orbit size = number of cosets, found by dividing the group size by each stabiliser (counted by repeated subtraction). */
  q31d: p => {
    const orbit = s => { let left = p.g, n = 0; while (left >= s) { left -= s; n++; } return n; };
    const a = orbit(p.sa), b = orbit(p.sb);
    return [a, b, a + b];
  },
  /* q32b: list all permutations of m, keep those with the same sorted cycle lengths; order by repeating until home. */
  q32b: p => {
    const mine = new Array(p.m).fill(0).map((_, i) => i);
    for (const c of p.cycles) for (let i = 0; i < c.length; i++) mine[c[i] - 1] = c[(i + 1) % c.length] - 1;
    const want = cycleType(mine).join();
    return [allPerms(p.m).filter(q => cycleType(q).join() === want).length, repeatsToBack(mine)];
  },
  /* q32c: type lists the cycles of length 2 or more (w only picks the wording); the rest of the m tiles stay put.
     Test every permutation with that cycle shape, repeating each until the tiles are back in order. */
  q32c: p => {
    const want = [...p.type, ...new Array(p.m - p.type.reduce((s, v) => s + v, 0)).fill(1)].sort((a, b) => b - a).join();
    let tested = 0, total = 0, one = 0;
    for (const q of allPerms(p.m)) if (cycleType(q).join() === want) { tested++; one = repeatsToBack(q); total += one; }
    return [tested, one, total];
  },
  /* q32d: same cycle shape listing over all permutations of m; w is an index into a list of floor names. */
  q32d: p => {
    const want = [...p.type, ...new Array(p.m - p.type.reduce((s, v) => s + v, 0)).fill(1)].sort((a, b) => b - a).join();
    let inClass = 0, all = 0, ord = 0;
    for (const q of allPerms(p.m)) { all++; if (cycleType(q).join() === want) { inClass++; ord = repeatsToBack(q); } }
    return [inClass, ord, all - inClass];
  },
  /* q33b: list every colouring of the m-lamp wheel; count those a turn of r steps leaves alone, and the turn-classes. */
  q33b: p => { const t = ringTable(p.m, p.k); return [t.fixed[p.r % p.m], t.designs]; },
  /* q33c: w is an index into a list of place names. Total of fixed colourings over all m turns, designs, colourings minus designs. */
  q33c: p => { const t = ringTable(p.m, p.k); return [t.fixed.reduce((s, v) => s + v, 0), t.designs, t.total - t.designs]; },
  /* q33d: the prompt asks how many turns leave exactly k colourings unchanged (k = the number of colours: the turns
     whose steps share no factor with m, i.e. turns that join all the places in one loop); w is an index into a list of places. */
  q33d: p => { const t = ringTable(p.m, p.k); return [t.fixed.filter(v => v === p.k).length, t.designs]; },
  /* q34b: the prompt names the prime whose largest power divides N: the prime with the biggest exponent (smallest prime on a tie).
     Abelian groups of order p^e are counted by listing the partitions of e; the total is the product over the primes. */
  q34b: p => {
    const f = factorise(p.N);
    let best = f[0]; for (const x of f) if (x[1] > best[1]) best = x;
    return [partitions(best[1]), f.reduce((s, x) => s * partitions(x[1]), 1)];
  },
  /* q34c: product of the partition counts of the exponents, for each of the two orders, then their sum. */
  q34c: p => {
    const count = n => factorise(n).reduce((s, x) => s * partitions(x[1]), 1);
    const a = count(p.N1), b = count(p.N2);
    return [a, b, a + b];
  },
  /* q34d: f lists [prime, exponent]. A group is a choice of one partition of each exponent; the part for a prime is cyclic
     only for the one-block partition, so "not cyclic for every prime" leaves partitions(e) - 1 choices per prime. */
  q34d: p => [p.f.reduce((s, x) => s * partitions(x[1]), 1), p.f.reduce((s, x) => s * (partitions(x[1]) - 1), 1)],
  /* q35b: test every setting by multiplying it with all the others mod N. */
  q35b: p => {
    let units = 0, zd = 0, b = 0;
    for (let x = 1; x < p.N; x++) {
      let isUnit = false, isZd = false;
      for (let y = 0; y < p.N; y++) { const pr = (x * y) % p.N; if (pr === 1) isUnit = true; if (y > 0 && pr === 0) isZd = true; }
      if (isUnit) units++; else if (isZd) zd++;
    }
    for (let y = 1; y < p.N; y++) if ((p.a * y) % p.N === 0) { b = y; break; }
    return [units, zd, b];
  },
  /* q35c: accept = settings with some partner giving 1; refuse the rest (all of 1..N-1 are one or the other); then
     count the codes b from 1 to N-1 with a*b = 0. */
  q35c: p => {
    let acc = 0, ref = 0, wiped = 0;
    for (let x = 1; x < p.N; x++) { let u = false; for (let y = 1; y < p.N; y++) if ((x * y) % p.N === 1) { u = true; break; } if (u) acc++; else ref++; }
    for (let b = 1; b < p.N; b++) if ((p.a * b) % p.N === 0) wiped++;
    return [acc, ref, wiped];
  },
  /* q35d: zero divisors = non-zero numbers sharing a factor with N (tested by gcd); inverse by search; smallest b by search. */
  q35d: p => {
    let zd = 0, inv = 0, b = 0;
    for (let x = 1; x < p.N; x++) if (gcd(x, p.N) > 1) zd++;
    for (let c = 1; c < p.N; c++) if ((p.u * c) % p.N === 1) { inv = c; break; }
    for (let y = 1; y < p.N; y++) if ((p.a * y) % p.N === 0) { b = y; break; }
    return [zd, inv, b];
  }
});
})();
