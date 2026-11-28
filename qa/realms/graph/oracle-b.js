/* Independent oracles for Graph theory: networks learn missions, file b: q11–q20 (game/realms/graph/missions-b.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';

/* Small helpers shared by the oracles below. */
const find = (par, x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
/* All permutations of a list (as arrays). */
const perms = list => {
  if (list.length <= 1) return [list.slice()];
  const out = [];
  list.forEach((x, i) => perms(list.slice(0, i).concat(list.slice(i + 1))).forEach(r => out.push([x].concat(r))));
  return out;
};
/* Edge subsets of size V-1 that join all of 1..V (spanning trees), by trying every subset. */
const spanningTrees = (V, edges) => {
  const out = [];
  const pick = (from, chosen) => {
    if (chosen.length === V - 1) {
      const par = []; for (let v = 0; v <= V; v++) par[v] = v;
      for (const i of chosen) { const a = find(par, edges[i][0]), b = find(par, edges[i][1]); if (a === b) return; par[a] = b; }
      out.push(chosen.slice()); return;
    }
    if (edges.length - from < V - 1 - chosen.length) return;
    for (let i = from; i < edges.length; i++) { chosen.push(i); pick(i + 1, chosen); chosen.pop(); }
  };
  pick(0, []);
  return out;
};
/* Number of spanning trees by Kirchhoff's rule: delete one row and column of the Laplacian, take the determinant. */
const kirchhoff = (V, edges) => {
  const L = Array.from({ length: V }, () => new Array(V).fill(0));
  for (const [a, b] of edges) { L[a - 1][a - 1]++; L[b - 1][b - 1]++; L[a - 1][b - 1]--; L[b - 1][a - 1]--; }
  const M = L.slice(1).map(r => r.slice(1)), n = V - 1;
  let det = 1;
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (Math.abs(M[piv][c]) < 1e-12) return 0;
    if (piv !== c) { [M[piv], M[c]] = [M[c], M[piv]]; det = -det; }
    det *= M[c][c];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k < n; k++) M[r][k] -= f * M[c][k]; }
  }
  return Math.round(det);
};
/* Two hubs 1 and 2 joined by routes; route i has lens[i] cables. Domes are numbered as in the prompts (hubs 1, 2,
   then the route domes in order). Returns the edges as [u, v, weight-or-0]. */
const routes = (lens, weights) => {
  const edges = []; let next = 3;
  lens.forEach((n, i) => {
    let prev = 1;
    for (let j = 0; j < n; j++) { const to = j === n - 1 ? 2 : next++; edges.push([prev, to, weights ? weights[i][j] : 0]); prev = to; }
  });
  return { V: next - 1, edges };
};

Object.assign(window.ORACLE, {
  /* Grid of (m + 1) × (k + 1) corners, west–east roads of length a, south–north roads of length b. Find the odd
     corners, the cheapest way to pair them by paths of roads (Floyd–Warshall, every road costing a big unit plus its
     length so the fewest roads wins first and the length second), and the best pairing by a search over subsets. */
  q11: p => {
    const W = p.m + 1, H = p.k + 1, N = W * H, id = (x, y) => y * W + x, BIG = 1e6, INF = 1e18;
    const d = Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => i === j ? 0 : INF));
    const deg = new Array(N).fill(0);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (x + 1 < W) { d[id(x, y)][id(x + 1, y)] = d[id(x + 1, y)][id(x, y)] = BIG + p.a; deg[id(x, y)]++; deg[id(x + 1, y)]++; }
      if (y + 1 < H) { d[id(x, y)][id(x, y + 1)] = d[id(x, y + 1)][id(x, y)] = BIG + p.b; deg[id(x, y)]++; deg[id(x, y + 1)]++; }
    }
    for (let k = 0; k < N; k++) for (let i = 0; i < N; i++) for (let j = 0; j < N; j++)
      if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
    const odd = []; for (let i = 0; i < N; i++) if (deg[i] % 2) odd.push(i);
    const memo = new Map();
    const best = mask => {
      if (mask === 0) return 0;
      if (memo.has(mask)) return memo.get(mask);
      let lo = 0; while (!((mask >> lo) & 1)) lo++;
      let res = INF;
      for (let j = lo + 1; j < odd.length; j++) if ((mask >> j) & 1) {
        const v = d[odd[lo]][odd[j]] + best(mask & ~(1 << lo) & ~(1 << j));
        if (v < res) res = v;
      }
      memo.set(mask, res); return res;
    };
    const total = best((1 << odd.length) - 1);
    const roads = Math.floor(total / BIG);
    return [roads, total - roads * BIG];
  },
  /* A tree on v domes: build the simplest one (a chain 1–2–…–v) and count its cables. For the second plan, grow a
     chain until it has e cables and count the domes it links. */
  q12: p => {
    const chainEdges = n => { const out = []; for (let i = 1; i < n; i++) out.push([i, i + 1]); return out; };
    const cables = chainEdges(p.v).length;
    let n = 1; while (chainEdges(n).length < p.e) n++;
    return [cables, n];
  },
  /* Forest: c trees on v domes in all. Build c chains (sizes as equal as possible) and count their cables. New tree:
     search for the number of leaves L for which the degrees add up to twice the cables of a tree with all those
     domes (handshake rule). */
  q13: p => {
    let cables = 0;
    for (let t = 0; t < p.c; t++) { const size = Math.floor(p.v / p.c) + (t < p.v % p.c ? 1 : 0); cables += size - 1; }
    let leaves = null;
    for (let L = 0; L <= 200 && leaves === null; L++) {
      const n = L + p.d2 + p.d3 + p.d4, degSum = L + 2 * p.d2 + 3 * p.d3 + 4 * p.d4;
      if (degSum === 2 * (n - 1)) leaves = L;
    }
    return [cables, leaves];
  },
  /* Tunnels as listed: grow a spanning tree by searching from dome 1 and counting the tunnels that reach a new
     dome; the rest are left out. */
  q14: p => {
    const seen = new Set([1]); let used = 0, grew = true;
    while (grew) {
      grew = false;
      for (const [a, b] of p.edges) {
        if (seen.has(a) !== seen.has(b)) { seen.add(a); seen.add(b); used++; grew = true; }
      }
    }
    return [used, p.edges.length - used];
  },
  /* Matrix-tree count (Kirchhoff) of two networks written out dome by dome: the ring of r domes, and two hubs joined
     by three routes of a, b and c cables (a route of n cables has n − 1 small domes). */
  q15: p => {
    const ring = []; for (let i = 1; i <= p.r; i++) ring.push([i, i % p.r + 1]);
    const t = routes([p.a, p.b, p.c]);
    return [kirchhoff(p.r, ring), kirchhoff(t.V, t.edges)];
  },
  /* Try every set of V − 1 tunnels; keep those that join all domes without a circuit, and take the cheapest total
     length. Kruskal's last cable is the longest cable of the (unique) minimum tree; with distinct lengths the
     minimum tree is unique, so the longest cable of the cheapest tree is the one asked for. */
  q16: p => {
    const trees = spanningTrees(p.V, p.edges);
    let bestSum = Infinity, bestMax = null;
    for (const t of trees) {
      const lens = t.map(i => p.edges[i][2]), sum = lens.reduce((s, x) => s + x, 0);
      if (sum < bestSum) { bestSum = sum; bestMax = Math.max(...lens); }
    }
    return [bestSum, bestMax];
  },
  /* w[i] lists the cable lengths of route i, in order from hub 1 to hub 2. Every spanning tree is found by trying all
     subsets of V − 1 cables: counted, and the cheapest total taken. */
  q17: p => {
    const net = routes(p.w.map(r => r.length), p.w);
    const trees = spanningTrees(net.V, net.edges);
    let best = Infinity;
    for (const t of trees) best = Math.min(best, t.reduce((s, i) => s + net.edges[i][2], 0));
    return [net.V - 1, trees.length, best];
  },
  /* x is the second station asked about (an index into the stations, not a quantity). Bellman–Ford from station 1,
     relaxing every road both ways until nothing improves; the far station is the last one, V. */
  q18: p => {
    const dist = new Array(p.V + 1).fill(Infinity); dist[1] = 0;
    for (let round = 0; round < p.V; round++) for (const [a, b, w] of p.edges) {
      if (dist[a] + w < dist[b]) dist[b] = dist[a] + w;
      if (dist[b] + w < dist[a]) dist[a] = dist[b] + w;
    }
    return [dist[p.V], dist[p.x]];
  },
  /* Rover: list every ordering of the other p − 1 stations after the depot. Drone: list every ordering of the other
     q − 1 stations and keep one from each reverse pair (the one whose first station is smaller than its last). */
  q19: p => {
    const rover = perms(Array.from({ length: p.p - 1 }, (_, i) => i + 1)).length;
    const drone = perms(Array.from({ length: p.q - 1 }, (_, i) => i + 1)).filter(o => o.length < 2 || o[0] < o[o.length - 1]).length;
    return [rover, drone];
  },
  /* Stations 1..k (k counts the base); base is 1. Try every order of the other k − 1 stations, keep one of each reverse pair, and total
     the flight times round the loop. */
  q20: p => {
    const t = {}; for (const [a, b, w] of p.edges) { t[a + '-' + b] = w; t[b + '-' + a] = w; }
    const others = Array.from({ length: p.k - 1 }, (_, i) => i + 2);
    let count = 0, best = Infinity;
    for (const o of perms(others)) {
      if (o.length > 1 && o[0] > o[o.length - 1]) continue;
      count++;
      const loop = [1].concat(o, [1]); let sum = 0;
      for (let i = 0; i + 1 < loop.length; i++) sum += t[loop[i] + '-' + loop[i + 1]];
      if (sum < best) best = sum;
    }
    return [count, best];
  }
});
})();
