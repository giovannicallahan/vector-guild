/* Independent oracles for Graph theory: networks practice missions, file 4 of 8: q16b–q20d (game/realms/graph/practice-4.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Is the edge set `es` (pairs [u, v, w]) a connected graph on vertices 1..V? Flood fill from vertex 1. */
const connected = (V, es) => {
  const seen = new Set([1]); let grew = true;
  while (grew) { grew = false; for (const [u, v] of es) { if (seen.has(u) !== seen.has(v)) { seen.add(u); seen.add(v); grew = true; } } }
  return seen.size === V;
};
/* Every spanning tree of the graph: each subset of V-1 edges that is connected (V-1 edges and connected = a tree). */
const allTrees = (V, edges, must) => {
  const out = [], n = edges.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    let bits = 0; for (let i = 0; i < n; i++) if (mask >> i & 1) bits++;
    if (bits !== V - 1) continue;
    if (must !== undefined && !(mask >> must & 1)) continue;
    const es = edges.filter((e, i) => mask >> i & 1);
    if (connected(V, es)) out.push(es);
  }
  return out;
};
const total = es => es.reduce((s, e) => s + e[2], 0);
/* Cheapest spanning tree by trying every tree. */
const cheapest = (V, edges, must) => Math.min(...allTrees(V, edges, must).map(total));
/* Number of vertices in a graph given by its edge list (largest label). */
const maxLabel = edges => Math.max(...edges.map(e => Math.max(e[0], e[1])));
/* Theta network from chain lengths: hubs 1 and 2, then fresh junction labels. Returns {V, edges}. */
const theta = w => {
  const edges = []; let next = 3;
  for (const chain of w) {
    let prev = 1;
    chain.forEach((len, i) => { const to = i === chain.length - 1 ? 2 : next++; edges.push([prev, to, len]); prev = to; });
  }
  return { V: next - 1, edges };
};
/* All simple paths from s to t, as {cost, hops}, by depth-first search. */
const paths = (edges, s, t) => {
  const adj = {}; for (const [u, v, w] of edges) { (adj[u] = adj[u] || []).push([v, w]); (adj[v] = adj[v] || []).push([u, w]); }
  const out = [];
  const go = (at, seen, cost, hops) => {
    if (at === t) { out.push({ cost, hops }); return; }
    for (const [nx, w] of adj[at] || []) if (!seen.has(nx)) { seen.add(nx); go(nx, seen, cost + w, hops + 1); seen.delete(nx); }
  };
  go(s, new Set([s]), 0, 0);
  return out;
};
/* Cheapest route cost from s to t. */
const bestCost = (edges, s, t) => Math.min(...paths(edges, s, t).map(r => r.cost));
/* Every ordering of the list `a`. */
const perms = a => a.length <= 1 ? [a.slice()] : a.flatMap((x, i) => perms(a.filter((y, j) => j !== i)).map(r => [x].concat(r)));
/* Every different tour from `base` through the other labels 1..k, counting a tour and its reverse once. */
const tours = (k, base) => {
  const others = []; for (let i = 1; i <= k; i++) if (i !== base) others.push(i);
  return perms(others).filter(r => r[0] < r[r.length - 1]).map(r => [base].concat(r, [base]));
};
const legs = (tour, edges) => {
  const out = [];
  for (let i = 0; i + 1 < tour.length; i++) {
    const e = edges.find(x => (x[0] === tour[i] && x[1] === tour[i + 1]) || (x[1] === tour[i] && x[0] === tour[i + 1]));
    out.push(e[2]);
  }
  return out;
};
const sum = a => a.reduce((s, x) => s + x, 0);
const r6 = x => Math.round(x * 1e6) / 1e6;
Object.assign(window.ORACLE, {
  /* q16b: the cheapest tree by trying every tree. Kruskal takes pipes in cost order and (all costs differ) ends with the
     tree's dearest pipe, so the pipes looked at are those up to and including that one: skipped = looked at - (V-1). */
  q16b: p => {
    const best = allTrees(p.V, p.edges).sort((a, b) => total(a) - total(b))[0];
    const order = p.edges.slice().sort((a, b) => a[2] - b[2]);
    const lastAt = Math.max(...best.map(e => order.indexOf(p.edges.find(x => x === e))));
    return [total(best), lastAt + 1 - (p.V - 1)];
  },
  /* q16c: cheapest tree by trying every tree; cost = length × p per hundred metres; saving = cable on every tunnel minus it. */
  q16c: p => {
    const len = cheapest(p.V, p.edges);
    return [len, len * p.p, (total(p.edges) - len) * p.p];
  },
  /* q16d: p.f is the index in the list of the tunnel that must be laid. Tunnels left bare = tunnels - (V-1) cabled. */
  q16d: p => {
    const forced = cheapest(p.V, p.edges, p.f), free = cheapest(p.V, p.edges);
    return [p.edges.length - (p.V - 1), forced, forced - free];
  },
  /* q17b: p.w lists the pipe lengths along each pipeline. Build the network and try every subset of pipes. */
  q17b: p => {
    const g = theta(p.w), trees = allTrees(g.V, g.edges);
    return [g.V - 1, trees.length, Math.min(...trees.map(total))];
  },
  /* q17c: p.p credits per hundred metres, p.f credits per fitting (one per cable). */
  q17c: p => {
    const g = theta(p.w), len = cheapest(g.V, g.edges);
    return [g.V - 1, len, len * p.p + (g.V - 1) * p.f];
  },
  /* q17d */
  q17d: p => {
    const g = theta(p.w), trees = allTrees(g.V, g.edges);
    return [g.V - 1, trees.length, Math.min(...trees.map(total))];
  },
  /* q18b: all simple routes from p.s to p.t; the cheapest must be the only one at that cost, as the prompt says. */
  q18b: p => {
    const rs = paths(p.edges, p.s, p.t), c = Math.min(...rs.map(r => r.cost)), best = rs.filter(r => r.cost === c);
    if (best.length !== 1) throw new Error('q18b: ' + best.length + ' cheapest routes, prompt says exactly one');
    return [c, best[0].hops];
  },
  /* q18c: p.x clinic, p.y greenhouse, p.u unloading minutes at each; depot is station 1. Each trip is there, unload, back. */
  q18c: p => {
    const dx = bestCost(p.edges, 1, p.x), dy = bestCost(p.edges, 1, p.y);
    return [dx, dy, (dx + p.u + dx) + (dy + p.u + dy)];
  },
  /* q18d: from station 1 to p.t. Fewest roads, then the quickest among routes with that many roads. */
  q18d: p => {
    const rs = paths(p.edges, 1, p.t), hops = Math.min(...rs.map(r => r.hops));
    return [Math.min(...rs.map(r => r.cost)), hops, Math.min(...rs.filter(r => r.hops === hops).map(r => r.cost))];
  },
  /* q19b: p.n towers. p.c and p.ridge only index the control tower's number (wrapped into 1..n) and the ridge's name, so they are
     ignored: fix any tower as the start and list the orders of the other n-1 towers. */
  q19b: p => {
    const all = perms(Array.from({ length: p.n - 1 }, (x, i) => i + 2));
    return [all.filter(r => r[0] < r[r.length - 1]).length, all.length];
  },
  /* q19c: p.m stations, p.s seconds to price one loop. */
  q19c: p => {
    const loops = tours(p.m, 1).length;
    return [loops, r6(loops * p.s / 60)];
  },
  /* q19d: p.m depots; p.a and p.b are the depot numbers of the corridor asked about. */
  q19d: p => {
    const all = tours(p.m, 1);
    const uses = all.filter(t => t.some((x, i) => i + 1 < t.length && ((x === p.a && t[i + 1] === p.b) || (x === p.b && t[i + 1] === p.a)))).length;
    let corridors = 0; for (let i = 1; i <= p.m; i++) for (let j = i + 1; j <= p.m; j++) corridors++;
    return [corridors, all.length, uses];
  },
  /* q20b: p.k sites in all, site 1 is the base. List every round and take the fastest and slowest. */
  q20b: p => {
    const ts = tours(p.k, 1).map(t => sum(legs(t, p.edges)));
    return [Math.min(...ts), Math.max(...ts)];
  },
  /* q20c: five stations; p.s minutes at each of the 4 stops; p.L minutes of battery for flying. */
  q20c: p => {
    const fly = tours(5, 1).map(t => sum(legs(t, p.edges))), best = Math.min(...fly);
    return [best, best + 4 * p.s, fly.filter(f => f <= p.L).length];
  },
  /* q20d: cheapest tour (must be the only one); cheapest spanning tree by trying every tree; the tour minus its longest flight. */
  q20d: p => {
    const ts = tours(5, 1).map(t => { const l = legs(t, p.edges); return { sum: sum(l), longest: Math.max(...l) }; });
    const c = Math.min(...ts.map(t => t.sum)), best = ts.filter(t => t.sum === c);
    if (best.length !== 1) throw new Error('q20d: ' + best.length + ' cheapest tours, prompt says exactly one');
    return [c, cheapest(5, p.edges), c - best[0].longest];
  },
});
})();
