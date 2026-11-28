/* Independent oracles for Topology: shape without size practice missions, file 2 of 8: q06b–q10d (game/realms/topo/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const pc = n => { let c = 0; for (; n; n >>= 1) c += n & 1; return c; };
/* Bitmask sets: bit (i − 1) is node i (stations, buoys, clusters are numbered from 1; dishes a, b, c are 0, 1, 2),
   so mask 0 is ∅ and (1 << N) − 1 is the whole space X. */
const full = N => (1 << N) - 1;
const uniq = a => Array.from(new Set(a));
/* Every union of some of the sets in fam (the empty union is ∅). */
const unionsOf = fam => { const s = new Set(); for (let m = 0; m < (1 << fam.length); m++) { let u = 0; for (let i = 0; i < fam.length; i++) if (m >> i & 1) u |= fam[i]; s.add(u); } return s; };
/* The smallest topology holding the seeds: all finite intersections form a basis, then all unions of that basis. */
const generated = (N, seeds) => {
  const sub = uniq(seeds.concat([0, full(N)])), inter = new Set([full(N)]);
  for (let m = 1; m < (1 << sub.length); m++) { let x = full(N); for (let i = 0; i < sub.length; i++) if (m >> i & 1) x &= sub[i]; inter.add(x); }
  return unionsOf(Array.from(inter));
};
/* Closed supersets of a mask, from a list of open sets; the closure is the closed superset with fewest nodes. */
const closureOf = (N, opens, A) => {
  const cl = opens.map(o => full(N) & ~o).filter(c => (c & A) === A);
  return cl.reduce((b, c) => pc(c) < pc(b) ? c : b, full(N));
};
const interiorOf = (opens, A) => opens.filter(o => (o & A) === o).reduce((u, o) => u | o, 0);
const preimage = (f, Y, NX) => { let m = 0; for (let i = 0; i < NX; i++) if (Y >> f[i] & 1) m |= 1 << i; return m; };
const continuous = (f, NX, TX, TY) => TY.every(y => TX.includes(preimage(f, y, NX)));
Object.assign(window.ORACLE, {
  /* f is only an index into six family texts: 0 intersection of (A - 1/k, B + 1/k), k = 1, 2, ...; 1 union of [A + 1/k, B - 1/k],
     k = 2, 3, ...; 2 intersection of the same bands for k = 1 to K; 3 union of (A, B - 1/k), k = 1, 2, ...; 4 intersection of
     (A, B + 1/k); 5 intersection of (A - 1/k, B). Decided numerically: run k far (5000), test points round each end, and call the
     set open when every member test point still has members a tiny step to each side. */
  q06b: p => {
    const A = p.A, B = p.B, KMAX = 5000, KK = p.K, e = 1e-3;
    const inFam = (x, k) => {
      switch (p.f) {
        case 0: case 2: return A - 1 / k < x && x < B + 1 / k;
        case 1: return A + 1 / k <= x && x <= B - 1 / k;
        case 3: return A < x && x < B - 1 / k;
        case 4: return A < x && x < B + 1 / k;
        default: return A - 1 / k < x && x < B;
      }
    };
    const member = x => {
      if (p.f === 1 || p.f === 3) { for (let k = (p.f === 1 ? 2 : 1); k <= KMAX; k++) if (inFam(x, k)) return true; return false; }
      if (p.f === 2) { for (let k = 1; k <= KK; k++) if (!inFam(x, k)) return false; return true; }
      for (let k = 1; k <= KMAX; k++) if (!inFam(x, k)) return false;
      return true;
    };
    const pts = [A, B, A - 1 / (KK || 1), B + 1 / (KK || 1)];
    for (const c of [A, B]) for (const d of [-0.5, -2e-3, 2e-3, 0.5]) pts.push(c + d);
    pts.push((A + B) / 2);
    let open = 1;
    for (const x of pts) if (member(x) && !(member(x - e) && member(x + e))) open = 0;
    const lo = Math.max(p.a1, p.a2, p.a3), hi = Math.min(p.b1, p.b2, p.b3);
    return [lo, hi, open];
  },
  /* Four open intervals. p = largest left end, q = smallest right end; r by scanning radii in steps of 0.01. */
  q06c: p => {
    const lo = [p.a1, p.a2, p.a3, p.a4], hi = [p.b1, p.b2, p.b3, p.b4];
    let L = -Infinity, R = Infinity;
    for (let i = 0; i < 4; i++) { if (lo[i] > L) L = lo[i]; if (hi[i] < R) R = hi[i]; }
    let best = 0;
    for (let k = 0; k <= 10000; k++) { const r = k / 100; if (p.x - r >= L && p.x + r <= R) best = r; }
    return [L, R, best];
  },
  /* iv = [a, b, left included, right included]. Test a number against all four stretches; the common stretch starts at the
     printed number with members just to its right and none just to its left, and stops at the one with the reverse. An end point
     counts when it passes all four tests. Open = neither end in; closed = both in. */
  q06d: p => {
    const inAll = x => p.iv.every(([a, b, ci, cj]) => (x > a || (ci && x === a)) && (x < b || (cj && x === b)));
    const nums = uniq(p.iv.map(v => v[0]).concat(p.iv.map(v => v[1]))), e = 1e-6;
    let pe = null, qe = null;
    for (const a of nums) { if (!inAll(a - e) && inAll(a + e)) pe = a; if (inAll(a - e) && !inAll(a + e)) qe = a; }
    const lm = inAll(pe), rm = inAll(qe);
    return [pe, qe, (!lm && !rm) ? 1 : 0, (lm && rm) ? 1 : 0];
  },
  /* sets lists the open sets. A topology holds ∅ and X and every union and intersection of any of its sets: test every
     sub-list. Subsets of X not in the list = 2^N minus the list length. */
  q07b: p => {
    const L = uniq(p.sets), S = new Set(L); let ok = S.has(0) && S.has(full(p.N));
    for (let m = 1; ok && m < (1 << L.length); m++) {
      let u = 0, x = full(p.N);
      for (let i = 0; i < L.length; i++) if (m >> i & 1) { u |= L[i]; x &= L[i]; }
      if (!S.has(u) || !S.has(x)) ok = false;
    }
    return [ok ? 1 : 0, (1 << p.N) - L.length];
  },
  /* seeds + ∅ + X. Round one: every pair of different sets in that list; new sets are collected once. The finished list is
     the generated topology (all finite intersections, then all unions), which is also what rounds converge to. */
  q07c: p => {
    const X = full(p.N), list = uniq(p.seeds.concat([0, X])), S = new Set(list), add = new Set();
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const u = list[i] | list[j], x = list[i] & list[j];
      if (!S.has(u)) add.add(u);
      if (!S.has(x)) add.add(x);
    }
    const total = generated(p.N, p.seeds).size;
    return [add.size, total, total === (1 << p.N) ? 1 : 0];
  },
  /* A pair is faulty when its union or intersection is missing. Fewest sets to add = the generated topology minus the list. */
  q07d: p => {
    const L = uniq(p.sets), S = new Set(L); let bad = 0;
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) if (!S.has(L[i] | L[j]) || !S.has(L[i] & L[j])) bad++;
    const g = generated(p.N, L);
    return [bad, g.size - L.filter(s => g.has(s)).length];
  },
  /* Closed sets are the complements. p, q are the station numbers (from 1); the closure of {p, q} is the closed set
     holding both with fewest stations. */
  q08b: p => {
    const X = full(p.N), cl = p.sets.map(o => X & ~o);
    const both = (1 << (p.p - 1)) | (1 << (p.q - 1));
    return [cl.filter(c => c >> (p.p - 1) & 1).length, pc(closureOf(p.N, p.sets, both))];
  },
  /* Closed groups holding node p; closure of {p}; reset time = m minutes per node in the closure. */
  q08c: p => {
    const X = full(p.N), cl = p.sets.map(o => X & ~o), A = 1 << (p.p - 1);
    const n = pc(closureOf(p.N, p.sets, A));
    return [cl.filter(c => (c & A) === A).length, n, n * p.m];
  },
  /* A is a mask. Closure = closed superset with fewest nodes; interior = union of open sets inside A; boundary =
     closure nodes not in the interior. */
  q08d: p => {
    const c = closureOf(p.N, p.sets, p.A), i = interiorOf(p.sets, p.A);
    return [pc(c), pc(i), pc(c & ~i)];
  },
  /* Open sets = every union of basis sets (∅ the empty union); x is the node number (from 1). */
  q09b: p => {
    const u = Array.from(unionsOf(p.basis));
    return [u.length, u.filter(s => s >> (p.x - 1) & 1).length];
  },
  /* Unions before, and after adding the mask T to the basis. */
  q09c: p => [unionsOf(p.basis).size, unionsOf(p.basis.concat([p.T])).size],
  /* covers: union is X. Overlap rule: for every two sets and every node of their overlap, some set of the family holds the
     node and lies inside the overlap. Then count the distinct unions. */
  q09d: p => {
    const F = p.fam, X = full(p.N);
    const covers = F.reduce((u, s) => u | s, 0) === X;
    let rule = true;
    for (const a of F) for (const b of F) { const o = a & b; for (let n = 0; n < p.N; n++) if ((o >> n & 1) && !F.some(c => (c >> n & 1) && (c & o) === c)) rule = false; }
    return [covers ? 1 : 0, rule ? 1 : 0, unionsOf(F).size];
  },
  /* f[i] is the dish (a = 0, b = 1, c = 2) that sensor i + 1 goes to. Continuous when the preimage of every open set of Y
     is open in X. Count the open sets of Y whose preimage is open. */
  q10b: p => [continuous(p.f, p.NX, p.TX, p.TY) ? 1 : 0, p.TY.filter(y => p.TX.includes(preimage(p.f, y, p.NX))).length],
  /* Count open sets of Y with a non-open preimage. Then try every single change (each sensor to each other dish). */
  q10c: p => {
    const fail = p.TY.filter(y => !p.TX.includes(preimage(p.f, y, p.NX))).length;
    let fix = 0;
    for (let i = 0; i < p.NX; i++) for (let d = 0; d < p.NY; d++) {
      if (d === p.f[i]) continue;
      const g = p.f.slice(); g[i] = d;
      if (continuous(g, p.NX, p.TX, p.TY)) fix++;
    }
    return [fail, fix];
  },
  /* Closed sets are complements; count those whose preimage is closed in X. Then run through all NY^NX maps. */
  q10d: p => {
    const X = full(p.NX), Y = full(p.NY);
    const closedX = new Set(p.TX.map(o => X & ~o)), closedY = p.TY.map(o => Y & ~o);
    const nGood = closedY.filter(c => closedX.has(preimage(p.f, c, p.NX))).length;
    let all = 0;
    const g = new Array(p.NX).fill(0);
    for (let code = 0; code < Math.pow(p.NY, p.NX); code++) {
      let c = code; for (let i = 0; i < p.NX; i++) { g[i] = c % p.NY; c = Math.floor(c / p.NY); }
      if (continuous(g, p.NX, p.TX, p.TY)) all++;
    }
    return [nGood, nGood === closedY.length ? 1 : 0, all];
  }
});
})();
