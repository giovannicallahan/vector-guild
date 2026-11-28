/* Independent oracles for Discrete mathematics learn missions, file d: q31–q40 (game/realms/disc/missions-d.js).
   ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out from what the prompt states
   by a different method from build() (docs/PACK-FORMAT.md §6): a table of values, a search, a numerical method or a
   general solver. Do not import game files. */
(function(){ 'use strict';
const oddCount = deg => deg.filter(x => x % 2 !== 0).length;
const eulerCode = (odd) => odd === 0 ? 2 : odd === 2 ? 1 : 0; /* the graphs in the prompts are stated connected */
const degreesOf = (n, edges) => { const d = new Array(n).fill(0); edges.forEach(([u, v]) => { d[u]++; d[v]++; }); return d; };
Object.assign(window.ORACLE, {
  /* a(n) = (p+q)a(n-1) - pq a(n-2) with roots p, q; a0 = A + B, a1 = Ap + Bq. Step the rule twelve times
     and read the larger and smaller root off the two numbers. */
  q31: p => {
    const s = p.p + p.q, pr = p.p * p.q;
    let x = p.A + p.B, y = p.A * p.p + p.B * p.q; /* a0, a1 */
    for (let n = 2; n <= 12; n++) { const z = s * y - pr * x; x = y; y = z; }
    return [Math.max(p.p, p.q), Math.min(p.p, p.q), y];
  },
  /* Count tilings of a strip n long with 1-tiles and k-tiles, and good bit strings of length m, by listing
     every composition / every bit string rather than a recurrence. */
  q32: p => {
    let tilings = 0;
    const walk = rem => { if (rem === 0) { tilings++; return; } if (rem >= 1) walk(rem - 1); if (rem >= p.k) walk(rem - p.k); };
    walk(p.n);
    let good = 0;
    for (let v = 0; v < (1 << p.m); v++) if ((v & (v >> 1)) === 0) good++;
    return [tilings, good];
  },
  /* Pay k with up to a ones, up to b twos and up to 2 fives: list every choice of counts. */
  q33: p => {
    let ways = 0;
    for (let o = 0; o <= p.a; o++) for (let t = 0; t <= p.b; t++) for (let f = 0; f <= 2; f++)
      if (o + 2 * t + 5 * f === p.k) ways++;
    return [ways, (p.a + 1) * (p.b + 1) * 3];
  },
  /* List every crew as a bit mask on n tilers; tiler 0 is Oskar. */
  q34: p => {
    let withO = 0, without = 0, all = 0;
    for (let m = 0; m < (1 << p.n); m++) {
      let c = 0; for (let i = 0; i < p.n; i++) c += (m >> i) & 1;
      if (c !== p.k) continue;
      all++; if (m & 1) withO++; else without++;
    }
    return [withO, without, all];
  },
  /* t = b*q + r with 0 <= r < b: search for the quotient whose remainder lands in range. */
  q35: p => {
    const qr = t => { for (let q = -1000; q <= 1000; q++) { const r = t - p.b * q; if (r >= 0 && r < p.b) return [q, r]; } return [NaN, NaN]; };
    return [...qr(p.a1), ...qr(p.a2)];
  },
  /* Check number by taking away m until under m; the day code by walking forward one day at a time round the week. */
  q36: p => {
    let v = p.a * p.b + p.c; while (v >= p.m) v -= p.m;
    let day = p.d; for (let i = 0; i < p.N; i++) day = (day + 1) % 7;
    return [v, day];
  },
  /* Handshake: the degrees add to twice the roads. The missing degree makes up the difference. */
  q37: p => {
    const sum = a => a.reduce((s, x) => s + x, 0);
    /* d2 holds the west yard's degrees with the last one unstated in the prompt, so only the others are summed. */
    return [sum(p.d1) / 2, 2 * p.e2 - sum(p.d2.slice(0, -1))];
  },
  /* Trees: roads = junctions - 1. Closing roads from a connected network down to V-1 edges. Tree with t degree-3
     junctions and L leaves: search L so the degrees add to twice the roads (t + L - 1). */
  q38: p => {
    let L = null;
    for (let l = 0; l < 1000; l++) if (3 * p.t + l === 2 * (p.t + l - 1)) { L = l; break; }
    return [p.v1 - 1, p.e2 - (p.v2 - 1), L];
  },
  /* Degrees from the edge list; Euler circuit iff none odd, path iff exactly two odd (connected as stated). */
  q39: p => {
    const odd = oddCount(degreesOf(6, p.edges));
    return [odd, eulerCode(odd)];
  },
  /* Roads from the handshake rule; posts shared out by repeatedly handing one to every road. */
  q40: p => {
    const roads = p.deg.reduce((s, x) => s + x, 0) / 2;
    let left = p.N; while (left >= roads) left -= roads;
    return [roads, eulerCode(oddCount(p.deg)), left];
  },
});
})();
