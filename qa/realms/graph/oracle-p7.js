/* Independent oracles for Graph theory: networks practice missions, file 7 of 8: q31b–q35d (game/realms/graph/practice-7.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* ---- matching (q31): lists[i] = jobs/bays person i fits (numbers from 1); S = indices of the people in the set ---- */
const unionSize = (lists, S) => { const seen = new Set(); for (const i of S) for (const x of lists[i]) seen.add(x); return seen.size; };
/* Count the complete assignments by trying every person in turn (depth-first), each job used at most once. */
const countMatchings = lists => {
  const n = lists.length, used = new Set(); let count = 0;
  const go = i => { if (i === n) { count++; return; } for (const x of lists[i]) if (!used.has(x)) { used.add(x); go(i + 1); used.delete(x); } };
  go(0); return count;
};
/* ---- directed paths (q32): count simple paths by walking every route out of the start ---- */
const countPaths = (arcs, from, to) => {
  let count = 0;
  const walk = (v, seen) => { if (v === to) { count++; return; } for (const [a, b] of arcs) if (a === v && !seen.has(b)) { seen.add(b); walk(b, seen); seen.delete(b); } };
  walk(from, new Set([from])); return count;
};
/* ---- flows (q33, q34) ---- */
/* Cut capacity: sum of capacities of arcs that start in the source side and end outside it. */
const cutCap = (arcs, caps, side) => { let t = 0; arcs.forEach(([a, b], i) => { if (side.has(a) && !side.has(b)) t += caps[i]; }); return t; };
/* Maximum flow by repeatedly pushing along a route with room until none is left (a breadth-first search for each route). */
const maxFlow = (arcs, caps, s, t) => {
  const room = arcs.map((_, i) => caps[i]), back = arcs.map(() => 0); let total = 0;
  for (;;) {
    const prev = new Map([[s, null]]), queue = [s];
    for (let q = 0; q < queue.length && !prev.has(t); q++) {
      const v = queue[q];
      arcs.forEach(([a, b], i) => {
        if (a === v && room[i] > 0 && !prev.has(b)) { prev.set(b, [i, 1]); queue.push(b); }
        if (b === v && back[i] > 0 && !prev.has(a)) { prev.set(a, [i, -1]); queue.push(a); }
      });
    }
    if (!prev.has(t)) return total;
    let amount = Infinity, v = t;
    while (v !== s) { const [i, dir] = prev.get(v); amount = Math.min(amount, dir === 1 ? room[i] : back[i]); v = dir === 1 ? arcs[i][0] : arcs[i][1]; }
    v = t;
    while (v !== s) { const [i, dir] = prev.get(v); if (dir === 1) { room[i] -= amount; back[i] += amount; } else { room[i] += amount; back[i] -= amount; } v = dir === 1 ? arcs[i][0] : arcs[i][1]; }
    total += amount;
  }
};
/* Smallest cut over every way of putting each middle point on the source or sink side; also how many cuts tie for it. */
const cutsTable = (arcs, caps, n) => {
  const mid = n - 2, table = [];
  for (let m = 0; m < (1 << mid); m++) {
    const side = new Set([1]); for (let k = 0; k < mid; k++) if (m & (1 << k)) side.add(k + 2);
    table.push(cutCap(arcs, caps, side));
  }
  return table;
};
/* The flow of q33 is a sum of flows along routes; amt[k] is the amount on the k-th route listed (a parameter only indexing the routes). */
/* A line is never printed with capacity 0 ("0 of 0"): an idle line with no spare room is shown as 0 of 1. */
const flowFromRoutes = (routes, amt, arcs) => arcs.map(([a, b]) => { let f = 0; routes.forEach((r, k) => { for (let j = 0; j + 1 < r.length; j++) if (r[j] === a && r[j + 1] === b) f += amt[k]; }); return f; });
const A6 = [[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,6],[5,6]];
const R6 = [[1,2,4,6],[1,3,4,6],[1,3,5,6],[1,2,3,5,6]];
const A5 = [[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,5]];
const R5 = [[1,2,4,5],[1,3,5],[1,2,3,5],[1,3,4,5]];
const A5b = [[1,2],[1,3],[1,4],[2,3],[2,5],[3,4],[3,5],[4,5]];
const A5c = [[1,2],[1,3],[2,3],[2,4],[3,4],[3,5],[4,5]];
const A6d = [[1,2],[1,3],[2,3],[2,4],[2,5],[3,4],[3,5],[4,6],[5,6]];
/* ---- trees (q35): Prüfer sequences, one for each labelled tree, are the n^(n-2) strings of length n-2 over n labels ---- */
const treesCount = n => { let t = 1; for (let k = 0; k < n - 2; k++) t *= n; return t; };

Object.assign(window.ORACLE, {
  /* q31b: union of the fit lists of S, then a search for a complete assignment. */
  q31b: p => [unionSize(p.lists, p.S), countMatchings(p.lists) > 0 ? 1 : 0],
  /* q31c: union now; add job j to the list of person x (x is a 0-based index into the list of people); union again; search. */
  q31c: p => {
    const after = p.lists.map(l => l.slice()); if (!after[p.x].includes(p.j)) after[p.x].push(p.j);
    return [unionSize(p.lists, p.S), unionSize(after, p.S), countMatchings(after) > 0 ? 1 : 0];
  },
  /* q31d: union of the fit lists of S, then the number of complete assignments by exhaustive search. */
  q31d: p => [unionSize(p.lists, p.S), countMatchings(p.lists)],
  /* q32b: paths from 1 to v and from 1 to N (the last filter), by walking every route. */
  q32b: p => [countPaths(p.arcs, 1, p.v), countPaths(p.arcs, 1, p.N)],
  /* q32c: paths from 1 to N, then again with the arc a→b removed (a, b are junction numbers). */
  q32c: p => {
    const all = countPaths(p.arcs, 1, p.N), kept = countPaths(p.arcs.filter(([x, y]) => !(x === p.a && y === p.b)), 1, p.N);
    return [all, kept, all - kept];
  },
  /* q32d: paths from 1 to v, w and N. */
  q32d: p => [countPaths(p.arcs, 1, p.v), countPaths(p.arcs, 1, p.w), countPaths(p.arcs, 1, p.N)],
  /* q33b: flow from route amounts (amt indexes the routes); capacity = flow + slack; value is what leaves point 1; cut capacity of the set L. */
  q33b: p => {
    const f = flowFromRoutes(R6, p.amt, A6), caps = f.map((x, i) => Math.max(1, x + p.slack[i]));
    let value = 0; A6.forEach(([a], i) => { if (a === 1) value += f[i]; });
    return [value, cutCap(A6, caps, new Set(p.L))];
  },
  /* q33c: same on the five-junction branch; third entry is cut capacity minus flow value. */
  q33c: p => {
    const f = flowFromRoutes(R5, p.amt, A5), caps = f.map((x, i) => Math.max(1, x + p.slack[i]));
    let value = 0; A5.forEach(([a], i) => { if (a === 1) value += f[i]; });
    const cut = cutCap(A5, caps, new Set(p.L));
    return [value, cut, cut - value];
  },
  /* q33d: h is a 0-based index into the arc list (the line whose gauge failed); its flow comes from conservation along the routes. */
  q33d: p => {
    const f = flowFromRoutes(R6, p.amt, A6), caps = f.map((x, i) => Math.max(1, x + p.slack[i]));
    let value = 0; A6.forEach(([a], i) => { if (a === 1) value += f[i]; });
    return [f[p.h], value, cutCap(A6, caps, new Set(p.L))];
  },
  /* q34b: cut with only 5 on the sink side; max flow by augmenting routes; number of the eight cuts equal to it. */
  q34b: p => {
    const table = cutsTable(A5b, p.c, 5), mf = maxFlow(A5b, p.c, 1, 5);
    return [cutCap(A5b, p.c, new Set([1, 2, 3, 4])), mf, table.filter(x => x === mf).length];
  },
  /* q34c: max flow now; widen the pipe at 0-based index e by w; max flow again; the gain. */
  q34c: p => {
    const before = maxFlow(A5c, p.c, 1, 5), c2 = p.c.slice(); c2[p.e] += p.w;
    const after = maxFlow(A5c, c2, 1, 5);
    return [before, after, after - before];
  },
  /* q34d: cut with only 1 on the source side; cut with only 6 on the sink side; max flow. */
  q34d: p => [cutCap(A6d, p.c, new Set([1])), cutCap(A6d, p.c, new Set([1, 2, 3, 4, 5])), maxFlow(A6d, p.c, 1, 6)],
  /* q35b: cables in a tree = n-1; trees = n^(n-2) (checked by listing Prüfer strings); plans left. */
  q35b: p => [p.n - 1, treesCount(p.n), treesCount(p.n) - p.t],
  /* q35c: trees, full drawers of d, leftover copies. */
  q35c: p => { const T = treesCount(p.n); let full = 0, left = T; while (left >= p.d) { left -= p.d; full++; } return [T, full, left]; },
  /* q35d: cables left out = all pairs - (n-1); plans = n^(n-2); stars: one per centre dome, n of them. */
  q35d: p => {
    const pairs = p.n * (p.n - 1) / 2, T = treesCount(p.n), nonStar = T - p.n;
    return [pairs - (p.n - 1), T, nonStar, nonStar - p.s];
  },
});
})();
