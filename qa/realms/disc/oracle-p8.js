/* Independent oracles for Discrete mathematics practice missions, file 8 of 8: q36b–q40d (game/realms/disc/practice-8.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
const sum = a => a.reduce((x, y) => x + y, 0);
/* A clock that wraps at m: step one unit at a time from `start`; returns the final reading and the number of wraps. */
const tick = (start, steps, m) => { let r = start, wraps = 0; for (let i = 0; i < steps; i++) { r++; if (r === m) { r = 0; wraps++; } } return [r, wraps]; };
/* Step back one unit at a time on a clock that wraps at m. */
const tickBack = (start, steps, m) => { let r = start; for (let i = 0; i < steps; i++) { r--; if (r < 0) r = m - 1; } return r; };
/* The remainder from 0 to m-1 by search: the r in that range such that (n - r) is a multiple of m. */
const rem = (n, m) => { for (let r = 0; r < m; r++) if (Number.isInteger((n - r) / m)) return r; return NaN; };
/* Number of edges: count the end-plugs one at a time, then pair them off. */
const edgesOf = degs => { let plugs = 0; for (const d of degs) for (let i = 0; i < d; i++) plugs++; return plugs / 2; };
const oddCount = degs => degs.filter(d => d % 2 === 1).length;
/* Euler code for a connected network: 2 circuit, 1 path only, 0 neither. */
const eulerCode = degs => { const o = oddCount(degs); return o === 0 ? 2 : o === 2 ? 1 : 0; };
Object.assign(window.ORACLE, {
  /* Lamps on at h for N hours: tick the clock hour by hour, counting each wrap past 23 to 0 as a midnight. */
  q36b: p => tick(p.h, p.N, 24),
  /* Pallet total, its tag by search; convoy day found by stepping the weekday clock one convoy interval at a time. */
  q36c: p => {
    let total = p.c; for (let i = 0; i < p.a; i++) total += p.b;
    const tag = rem(total, p.m);
    const day = tick(p.s, p.k * p.d, 7)[0];
    return [total, tag, day];
  },
  /* Balance a×b − c, remainder from 0 to m−1 by search; weekday found by stepping back N days on a 7-day clock. */
  q36d: p => {
    const bal = p.a * p.b - p.c;
    return [rem(bal, p.m), tickBack(p.s, p.N, 7)];
  },
  /* Ridge cables from the plugs; second site: v2 posts each with k2 plugs. */
  q37b: p => {
    const second = []; for (let i = 0; i < p.v2; i++) second.push(p.k2);
    return [edgesOf(p.d1), edgesOf(second)];
  },
  /* Total plugs = 2 × roads, so the last degree is what is missing; cost by repeated addition. */
  q37c: p => {
    let last = 0; while (sum(p.known) + last < 2 * p.e) last++;
    let cost = 0; for (let i = 0; i < p.e; i++) cost += p.c;
    return [last, cost];
  },
  /* North works: roads from the plugs by group. South works: roads follow from the draw (4x + y + 3t plugs); search for
     the number of degree-3 junctions that makes the plugs equal twice those roads. */
  q37d: p => {
    const north = edgesOf([].concat(Array(p.a).fill(4), Array(p.b).fill(3), Array(p.c).fill(2)));
    const roads = (4 * p.x + p.y + 3 * p.t) / 2;
    let n3 = 0; while (4 * p.x + p.y + 3 * n3 < 2 * roads) n3++;
    return [north, n3];
  },
  /* A tree on v labs has v − 1 cables: search for the tree size matching E cables; extra cables on V labs come out. */
  q38b: p => {
    let v = 1; while (v - 1 < p.E) v++;
    let out = p.F; for (let kept = 0; kept < p.V - 1; kept++) out--;
    return [v, out];
  },
  /* Roads kept = V − 1 (count them); the rest close. Salvage and maintenance by repeated addition. */
  q38c: p => {
    let kept = 0; for (let i = 1; i < p.V; i++) kept++;
    const close = p.E - kept;
    let salvage = 0; for (let i = 0; i < close; i++) salvage += p.s;
    let upkeep = 0; for (let i = 0; i < kept; i++) upkeep += p.u;
    return [close, salvage, upkeep];
  },
  /* Search for the number of leaves L so that the degree total equals twice the roads of a tree (junctions − 1). */
  q38d: p => {
    for (let L = 0; L < 1000; L++) {
      const junctions = p.a + p.b + L, roads = junctions - 1;
      if (4 * p.a + 3 * p.b + L === 2 * roads) return [L, roads];
    }
    return [NaN, NaN];
  },
  /* Degrees from the edge list; connected as the prompt says. */
  q39b: p => {
    const top = Math.max(...p.edges.flat()), deg = Array(top + 1).fill(0);
    for (const [u, v] of p.edges) { deg[u]++; deg[v]++; }
    return [oddCount(deg), eulerCode(deg)];
  },
  /* Roads from the plugs; odd junctions; each new road fixes two odd junctions (connected, parallel roads allowed), so
     pair the odd junctions off one road at a time. */
  q39c: p => {
    let odd = oddCount(p.deg), pending = odd, built = 0;
    while (pending > 0) { pending -= 2; built++; }
    return [edgesOf(p.deg), odd, built];
  },
  /* Tree: search for leaves L with plugs 3t + 2s + L = 2 × (t + s + L − 1). Odd junctions are the degree 3 ones and the leaves. */
  q39d: p => {
    for (let L = 0; L < 1000; L++) {
      const junctions = p.t + p.s + L, roads = junctions - 1;
      if (3 * p.t + 2 * p.s + L === 2 * roads) {
        let odd = p.t + L, pending = odd, built = 0;
        while (pending > 0) { pending -= 2; built++; }
        return [roads, odd, built];
      }
    }
    return [NaN, NaN, NaN];
  },
  /* One corridor a day from today: the last check is on day number roads − 1; step the weekday clock that many days. */
  q40b: p => {
    const roads = edgesOf(p.deg);
    return [roads, eulerCode(p.deg), tick(p.s, roads - 1, 7)[0]];
  },
  /* Roads from the plugs; tree keeps junctions − 1; posts shared by repeated removal of whole rounds. */
  q40c: p => {
    const roads = edgesOf(p.deg), kept = p.deg.length - 1, close = roads - kept;
    let left = p.N; while (left >= kept) left -= kept;
    return [roads, close, left];
  },
  /* Missing degree by search; Euler code from all the degrees; roads to close beyond the tree's junctions − 1. */
  q40d: p => {
    let h = 0; while (sum(p.known) + h < 2 * p.E) h++;
    const all = p.known.concat([h]);
    return [h, eulerCode(all), p.E - (all.length - 1)];
  },
});
})();
