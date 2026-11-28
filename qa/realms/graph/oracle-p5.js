/* Independent oracles for Graph theory: networks practice missions, file 5 of 8: q21b–q25d (game/realms/graph/practice-5.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Weight lists are in the order the prompt prints the pairs: (1,2),(1,3),…,(1,n),(2,3),… for a complete graph. */
const completeTable = (n, w) => {
  const t = []; for (let i = 0; i <= n; i++) t.push(new Array(n + 1).fill(0));
  let k = 0; for (let a = 1; a <= n; a++) for (let b = a + 1; b <= n; b++) { t[a][b] = t[b][a] = w[k++]; }
  return t;
};
/* Nearest neighbour by repeated scanning of the unvisited stations (ties to the lower number; draws have none). */
const nnRound = (n, w, s) => {
  const t = completeTable(n, w), seen = new Set([s]), order = [s]; let len = 0, at = s;
  while (seen.size < n) {
    let best = 0, bd = Infinity;
    for (let v = 1; v <= n; v++) if (!seen.has(v) && t[at][v] < bd) { bd = t[at][v]; best = v; }
    len += bd; seen.add(best); order.push(best); at = best;
  }
  len += t[at][s];
  return { len, last: order[order.length - 1] };
};
/* All tours from a fixed start with a tour and its reverse counted once, by listing every ordering. */
const countTours = k => {
  let count = 0;
  const rest = []; for (let v = 2; v <= k; v++) rest.push(v);
  const go = (arr, left) => {
    if (!left.length) { if (arr[0] < arr[arr.length - 1]) count++; return; }
    left.forEach((v, i) => go(arr.concat(v), left.slice(0, i).concat(left.slice(i + 1))));
  };
  if (k === 3) return 1;
  go([], rest);
  return count;
};
/* Shortest distance by relaxing every road repeatedly until nothing improves. */
const shortest = (n, edges, from) => {
  const d = new Array(n + 1).fill(Infinity); d[from] = 0;
  for (let changed = true; changed;) {
    changed = false;
    edges.forEach(([a, b, x]) => {
      if (d[a] + x < d[b]) { d[b] = d[a] + x; changed = true; }
      if (d[b] + x < d[a]) { d[a] = d[b] + x; changed = true; }
    });
  }
  return d;
};
const pairs = (n, w) => { const e = []; let k = 0; for (let a = 1; a <= n; a++) for (let b = a + 1; b <= n; b++) e.push([a, b, w[k++]]); return e; };
/* Shortest closed round through every valve by trying every ordering. */
const bestRound = (n, w) => {
  const t = completeTable(n, w); let best = Infinity;
  const go = (at, left, len) => {
    if (!left.length) { best = Math.min(best, len + t[at][1]); return; }
    left.forEach((v, i) => go(v, left.slice(0, i).concat(left.slice(i + 1)), len + t[at][v]));
  };
  const rest = []; for (let v = 2; v <= n; v++) rest.push(v);
  go(1, rest, 0);
  return best;
};
/* Dirac: every degree at least half the stations, i.e. 2 × degree ≥ n (n ≥ 3). */
const diracNeed = n => { let m = 0; while (2 * m < n) m++; return m; };
const diracOk = (n, degs) => (n >= 3 && degs.every(d => 2 * d >= n)) ? 1 : 0;
const triFreeMax = V => 2 * V - 4, anyMax = V => 3 * V - 6;
const maxPlanar = (V, tf) => tf ? triFreeMax(V) : anyMax(V);
Object.assign(window.ORACLE, {
  /* q21b: p.s = start tank, p.w = the ten track lengths for 1–2, 1–3, …, 4–5 in that order. */
  q21b: p => { const r = nnRound(5, p.w, p.s); return [r.len, r.last]; },
  /* q21c: nearest-neighbour round, fuel = km × r, left = tank − fuel. */
  q21c: p => { const r = nnRound(5, p.w, p.s); return [r.len, r.len * p.r, p.tank - r.len * p.r]; },
  /* q21d: k stations, p.w = k(k−1)/2 road lengths in pair order; tours counted by listing them. */
  q21d: p => [nnRound(p.k, p.w, p.s).len, countTours(p.k)],
  /* q22b: p.n pads, p.edges = the corridors; degrees counted from the list. */
  q22b: p => {
    const deg = new Array(p.n + 1).fill(0); p.edges.forEach(([a, b]) => { deg[a]++; deg[b]++; });
    const ds = deg.slice(1);
    return [Math.min(...ds), diracNeed(p.n), diracOk(p.n, ds)];
  },
  /* q22c: p.deg = degree of each station in order; each link is counted at both ends. */
  q22c: p => {
    let ends = 0; p.deg.forEach(d => { ends += d; });
    return [ends / 2, Math.min(...p.deg), diracOk(p.n, p.deg)];
  },
  /* q22d: p.cuts = the cut links; start from every pair linked, delete the cut ones, count degrees. */
  q22d: p => {
    const cut = new Set(p.cuts.map(([a, b]) => a + '-' + b)), deg = new Array(p.n + 1).fill(0); let links = 0;
    for (let a = 1; a <= p.n; a++) for (let b = a + 1; b <= p.n; b++) if (!cut.has(a + '-' + b)) { links++; deg[a]++; deg[b]++; }
    const ds = deg.slice(1);
    return [links, Math.min(...ds), diracOk(p.n, ds)];
  },
  /* q23b: p.w = eight pipes in printed order 1–2, 1–3, 2–4, 3–4, 3–5, 4–5, 4–6, 5–6; p.t = six valve distances 1–2, 1–3, 1–4, 2–3, 2–4, 3–4. */
  q23b: p => {
    const pipes = [[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],[4,6],[5,6]].map(([a, b], i) => [a, b, p.w[i]]);
    return [shortest(6, pipes, 1)[6], bestRound(4, p.t)];
  },
  /* q23c: p.w = nine roads in printed order 1–2, 1–3, 1–6, 2–3, 2–4, 3–5, 4–5, 4–6, 5–6; p.r = litres per km. */
  q23c: p => {
    const roads = [[1,2],[1,3],[1,6],[2,3],[2,4],[3,5],[4,5],[4,6],[5,6]].map(([a, b], i) => [a, b, p.w[i]]);
    const d = shortest(6, roads, 1)[6], direct = p.w[2];
    return [d, direct - d, (direct - d) * p.r];
  },
  /* q23d: p.w = ten roads in printed order 1–2, 1–3, 2–3, 2–4, 3–5, 4–5, 4–6, 5–6, 5–7, 6–7; p.m = depot station. */
  q23d: p => {
    const roads = [[1,2],[1,3],[2,3],[2,4],[3,5],[4,5],[4,6],[5,6],[5,7],[6,7]].map(([a, b], i) => [a, b, p.w[i]]);
    const best = shortest(7, roads, 1)[7], via = shortest(7, roads, 1)[p.m] + shortest(7, roads, p.m)[7];
    return [best, via, via - best];
  },
  /* q24b: E bars and W windows in all give V by Euler (V − E + W = 2); here W is rebuilt as E − V + 2 from p.V. */
  q24b: p => {
    const windows = p.E - p.V + 2;
    let cells = 0; while (cells - p.E + windows !== 2) cells++;
    return [cells, windows - 1];
  },
  /* q24c: a rows of b pads; count the wires one by one, faces by Euler, and the unit squares by corners. */
  q24c: p => {
    let wires = 0;
    for (let r = 0; r < p.a; r++) for (let c = 0; c < p.b; c++) { if (c + 1 < p.b) wires++; if (r + 1 < p.a) wires++; }
    let squares = 0;
    for (let r = 0; r + 1 < p.a; r++) for (let c = 0; c + 1 < p.b; c++) squares++;
    return [wires, wires - p.a * p.b + 2, squares];
  },
  /* q24d: a spanning tree has V − 1 wires; each wire taken from a loop merges two faces. */
  q24d: p => {
    let faces = 2; for (let k = 0; k < p.E - p.V; k++) faces++;
    let after = faces; for (let k = 0; k < p.m; k++) after--;
    return [faces, p.E - (p.V - 1), after];
  },
  /* q25b: p.tf = 1 when the prompt says there are no triangles; limit 2V − 4 then, else 3V − 6. */
  q25b: p => { const lim = maxPlanar(p.V, p.tf); return [lim, p.E > lim ? p.E - lim : 0]; },
  /* q25c: p.c = credits per wire. */
  q25c: p => { const lim = maxPlanar(p.V, p.tf); return [lim, lim - p.E, (lim - p.E) * p.c]; },
  /* q25d: V − E + F = 2 gives E = V + F − 2. */
  q25d: p => { const e = p.V + p.F - 2, lim = maxPlanar(p.V, p.tf); return [e, lim, e <= lim ? 1 : 0]; },
});
})();
