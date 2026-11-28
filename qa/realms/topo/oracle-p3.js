/* Independent oracles for Topology: shape without size practice missions, file 3 of 8: q11b–q15d (game/realms/topo/practice-3.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const pc = n => { let c = 0; for (; n; n >>= 1) c += n & 1; return c; };

/* ---- finite topologies on N points: sets are bitmasks (bit i = the i-th letter of the board). ---- */
/* Every open set: close the list of unions starting from the empty set. */
const openFamily = basis => {
  const seen = new Set([0]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const s of Array.from(seen)) for (const b of basis) if (!seen.has(s | b)) { seen.add(s | b); grew = true; }
  }
  return seen;
};
/* Closure of a set = the intersection of every closed set (complement of an open set) that contains it. */
const closureOf = (open, full, set) => {
  let c = full;
  for (const o of open) { const cl = full & ~o; if ((cl & set) === set) c &= cl; }
  return c;
};
/* A map to a Sierpinski-type chain is continuous when every preimage of an open target set is open;
   the preimage of the empty target is empty and of the whole target is the whole board. */
const continuous = (open, full, pre) => [0, full, ...pre].every(m => open.has(m));

/* ---- finite unions of intervals with whole-number end points, as cells on a grid ----
   cell 2x = the point x, cell 2x+1 = the open stretch (x, x+1). A piece [a,b,leftClosed,rightClosed]. */
const cellsOf = pieces => {
  const on = new Set();
  for (const [a, b, lc, rc] of pieces) {
    if (a === b) { on.add(2 * a); continue; }
    for (let c = 2 * a + 1; c <= 2 * b - 1; c++) on.add(c);
    if (lc) on.add(2 * a);
    if (rc) on.add(2 * b);
  }
  return on;
};
const runs = (on, lo, hi) => { let n = 0, prev = false; for (let c = lo; c <= hi; c++) { const q = on.has(c); if (q && !prev) n++; prev = q; } return n; };
const span = pieces => [Math.min(...pieces.map(x => x[0])) * 2 - 4, Math.max(...pieces.map(x => x[1])) * 2 + 4];
const interiorCells = (on, lo, hi) => {
  const r = new Set();
  for (let c = lo; c <= hi; c++) if (on.has(c) && (c % 2 !== 0 || (on.has(c - 1) && on.has(c + 1)))) r.add(c);
  return r;
};
const closureCells = (on, lo, hi) => {
  const r = new Set();
  for (let c = lo; c <= hi; c++) if (on.has(c) || (c % 2 === 0 && (on.has(c - 1) || on.has(c + 1)))) r.add(c);
  return r;
};

/* ---- pipe runs as graphs (strokes = edges). Cutting out a point = deleting a vertex (a point in the middle of a
   pipe is made a vertex by splitting its pipe in two). Pieces = components of what is left, where an edge both of
   whose ends were cut is a piece of its own. ---- */
const piecesAfter = (edges, cut) => {
  const parent = {};
  const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  edges.forEach(([a, b]) => { parent[a] = a; parent[b] = b; });
  let free = 0;
  for (const [a, b] of edges) {
    const ca = cut.includes(a), cb = cut.includes(b);
    if (ca && cb) free++;
    else if (!ca && !cb) parent[find(a)] = find(b);
  }
  const roots = new Set();
  edges.forEach(([a, b]) => { if (!cut.includes(a)) roots.add(find(a)); if (!cut.includes(b)) roots.add(find(b)); });
  /* a surviving vertex with all its edges free-ended still counts once, via its own root */
  return roots.size + free;
};
const endsOf = edges => {
  const deg = {};
  edges.forEach(([a, b]) => { deg[a] = (deg[a] || 0) + 1; deg[b] = (deg[b] || 0) + 1; });
  return Object.keys(deg).filter(v => deg[v] === 1).length;
};
const junction = (k, r) => {   /* hub J, k pipes; the first r end in a ring that touches the pipe at one point */
  const E = [];
  for (let i = 0; i < k; i++) {
    if (i < r) { E.push(['J', 'm' + i]); E.push(['m' + i, 'm' + i]); }   /* second edge is the ring (a loop at m_i) */
    else E.push(['J', 'e' + i]);
  }
  return E;
};

/* ---- the stencil font, written from the shape of each letter as the missions describe it:
   [end points, branch points listed by the number of strokes meeting there, holes]. ---- */
const SHAPE = {
  A: [2, [3, 3], 1], B: [0, [4], 2], C: [2, [], 0], D: [0, [], 1], E: [3, [3], 0], F: [3, [3], 0],
  H: [4, [3, 3], 0], I: [2, [], 0], J: [2, [], 0], K: [4, [4], 0], L: [2, [], 0], M: [2, [], 0],
  N: [2, [], 0], O: [0, [], 1], P: [1, [3], 1], R: [2, [4], 1], S: [2, [], 0], T: [3, [3], 0],
  U: [2, [], 0], V: [2, [], 0], W: [2, [], 0], X: [4, [4], 0], Y: [3, [3], 0], Z: [2, [], 0],
};
const code = ch => { const s = SHAPE[ch]; return s[0] + '|' + s[1].slice().sort().join(',') + '|' + s[2]; };

/* ---- open covers of a closed interval by open stretches of one length (L10 is ten times the length, in tenths of a metre) ----
   n stretches of length ell cover a closed interval of length D exactly when n ell > D (they must overlap a little,
   since an open stretch leaves out its ends). Search for the least such n in whole tenths. */
const fewest = (D, L10) => { let n = 1; while (n * L10 <= 10 * D) n++; return n; };
/* ---- the sets of the compactness missions, written from the printed set. kind indexes the printed list:
   [S compact?, closure of S compact?] by the set as printed (c and d are the numbers printed in it).
   0 [c,d]; 1 (c,d); 2 (c,d]; 3 (-inf,c]; 4 |x| <= d; 5 |x| < d; 6 |x - c| >= d; 7 whole numbers c, c+1, ... for ever;
   8 whole numbers c to d; 9 {0, 1/2, 2/3, ...}; 10 that set with 1 added; 11 [c,d] u (d+1,d+2); 12 [c,d] u [d+2,inf);
   13 [c,d) u {d}; 14 0 < |x| <= d. Compact = closed and bounded. */
const SETS = [
  [1, 1], [0, 1], [0, 1], [0, 0], [1, 1], [0, 1], [0, 0], [0, 0], [1, 1], [0, 1], [1, 1], [0, 1], [0, 0], [1, 1], [0, 1],
];

Object.assign(window.ORACLE, {
  /* basis and on are bitmasks over the N sockets (bit 0 = P); x is the socket whose closure is asked. */
  q11b: p => {
    const full = (1 << p.N) - 1, open = openFamily(p.basis);
    return [open.size, pc(closureOf(open, full, 1 << p.x)), continuous(open, full, [p.on]) ? 1 : 0];
  },
  /* A station can be shut down alone when everything else is open. */
  q11c: p => {
    const full = (1 << p.N) - 1, open = openFamily(p.basis);
    let alone = 0;
    for (let i = 0; i < p.N; i++) if (open.has(full & ~(1 << i))) alone++;
    return [open.size, alone, continuous(open, full, [p.on]) ? 1 : 0];
  },
  /* Six nodes; m1 and m2 are the preimages of {low} and {low, mid} as bitmasks; x and y index the two nodes. */
  q11d: p => {
    const full = 63, open = openFamily(p.basis);
    return [open.size, pc(closureOf(open, full, (1 << p.x) | (1 << p.y))), continuous(open, full, [p.m1, p.m2]) ? 1 : 0];
  },
  /* Components of S by runs on the grid; a line with k points removed has k + 1 pieces; the plane with m disjoint
     circles removed has m + 1 regions (each inside, and the outside). */
  q12b: p => {
    const [lo, hi] = span(p.pieces);
    return [runs(cellsOf(p.pieces), lo, hi), p.k + 1, p.m + 1];
  },
  /* The second cable [0, W] with the cut points all strictly inside is cuts + 1 pieces. */
  q12c: p => {
    const [lo, hi] = span(p.pieces), first = runs(cellsOf(p.pieces), lo, hi), second = p.cuts.length + 1;
    return [first, second, first + second];
  },
  q12d: p => {
    const [lo, hi] = span(p.pieces), on = cellsOf(p.pieces);
    return [runs(on, lo, hi), runs(interiorCells(on, lo, hi), lo, hi), runs(closureCells(on, lo, hi), lo, hi)];
  },
  /* f numbers the layout and p the place of the cut, as the prompt describes them (see the one-line key per layout).
     0: k pipes at one junction, loose ends. p 0 junction, 1 middle of a pipe, 2 loose end of a pipe.
     1: a ring with k tails. p 0 where a tail joins, 1 ring point away from the joins, 2 middle of a tail, 3 loose end.
     2: two rings sharing a point. p 0 shared point, 1 another point of a ring.
     3: two rings joined by a bar. p 0 where the bar meets ring 1, 1 middle of the bar, 2 another point of ring 1.
     4: junction with k pipes, r end in rings. p 0 junction, 1 where a pipe meets its ring, 2 another point of a ring,
        3 middle of a loose pipe. */
  q13b: p => {
    let E, cut;
    if (p.f === 0) {
      E = []; for (let i = 0; i < p.k; i++) E.push(['J', 'e' + i]);
      cut = p.p === 0 ? 'J' : p.p === 1 ? 'm' : 'e0';
      if (p.p === 1) { E[0] = ['J', 'm']; E.push(['m', 'e0']); }
    } else if (p.f === 1) {
      E = [];
      for (let i = 0; i < p.k; i++) { E.push(['j' + i, 'j' + ((i + 1) % p.k)]); E.push(['j' + i, 't' + i]); }
      if (p.p === 0) cut = 'j0';
      else if (p.p === 1) { E[0] = ['j0', 'x']; E.push(['x', 'j1']); cut = 'x'; }
      else if (p.p === 2) { E[1] = ['j0', 'x']; E.push(['x', 't0']); cut = 'x'; }
      else cut = 't0';
    } else if (p.f === 2) {
      E = [['s', 's'], ['s', 's']];   /* two loops at the shared point */
      if (p.p === 0) cut = 's';
      else { E[0] = ['s', 'x']; E.push(['x', 's']); cut = 'x'; }
    } else if (p.f === 3) {
      E = [['a', 'a'], ['a', 'b'], ['b', 'b']];   /* ring 1 at a, ring 2 at b, bar a-b */
      if (p.p === 0) cut = 'a';
      else if (p.p === 1) { E[1] = ['a', 'x']; E.push(['x', 'b']); cut = 'x'; }
      else { E[0] = ['a', 'x']; E.push(['x', 'a']); cut = 'x'; }
    } else {
      E = junction(p.k, p.r);
      if (p.p === 0) cut = 'J';
      else if (p.p === 1) cut = 'm0';
      else if (p.p === 2) { const i = E.findIndex(e => e[0] === 'm0' && e[1] === 'm0'); E[i] = ['m0', 'x']; E.push(['x', 'm0']); cut = 'x'; }
      else { const i = E.findIndex(e => e[0] === 'J' && e[1] === 'e' + (p.k - 1)); E[i] = ['J', 'x']; E.push(['x', 'e' + (p.k - 1)]); cut = 'x'; }
    }
    return [piecesAfter(E, [cut]), endsOf(E)];
  },
  /* k pipes from a junction, r of them ending in a ring; first cut the junction, then the point where one ring pipe meets its ring. */
  q13c: p => {
    const E = junction(p.k, p.r);
    return [piecesAfter(E, ['J']), endsOf(E), piecesAfter(E, ['J', 'm0'])];
  },
  /* hub, k arms, each arm forks into two loose branches; j is how many forks are cut (the first j arms). */
  q13d: p => {
    const E = [], forks = [];
    for (let i = 0; i < p.k; i++) { E.push(['H', 'f' + i]); E.push(['f' + i, 'a' + i]); E.push(['f' + i, 'b' + i]); }
    for (let i = 0; i < p.j; i++) forks.push('f' + i);
    return [endsOf(E), piecesAfter(E, ['H']), piecesAfter(E, ['H', ...forks])];
  },
  /* w is the word, T the letter compared with. */
  q14b: p => {
    const cls = code(p.T), same = p.w.split('').filter(ch => code(ch) === cls).length;
    const groups = new Set(p.w.split('').map(code)).size;
    return [same, groups];
  },
  /* cr = cost of a spare-made letter, cu = cost of fresh cable. */
  q14c: p => {
    const cls = code(p.T), n = p.w.length, same = p.w.split('').filter(ch => code(ch) === cls).length;
    return [same, n - same, same * p.cr + (n - same) * p.cu];
  },
  /* e end points, br the strokes at each branch point, h holes. */
  q14d: p => {
    const want = p.e + '|' + p.br.slice().sort().join(',') + '|' + p.h, letters = p.tag.split('');
    const hit = letters.filter(ch => code(ch) === want);
    return [letters.filter(ch => SHAPE[ch][0] === p.e).length, hit.length, new Set(hit).size];
  },
  /* The strip [a, b]; stretches of L10 / 10 metres. */
  q15b: p => [fewest(p.b - p.a, p.L10), SETS[p.kind][0]],
  /* Costs p1 and p2 credits per clamp; 1 when the light way is cheaper, 2 when the heavy way is (0 for a tie, which the prompt does not allow). */
  q15c: p => {
    const D = p.b - p.a, light = fewest(D, p.L1) * p.p1, heavy = fewest(D, p.L2) * p.p2;
    return [light, heavy, light < heavy ? 1 : heavy < light ? 2 : 0];
  },
  q15d: p => [fewest(p.b - p.a, p.L10), SETS[p.kind][0], SETS[p.kind][1]],
});
})();
