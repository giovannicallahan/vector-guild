/* Independent oracles for Graph theory: networks practice missions, file 2 of 8: q06b–q10d (game/realms/graph/practice-2.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
  /* shared helpers (inside the closure, no game files used) */
  const G = {
    adj(p) { const n = p.V, A = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
      for (const [a, b] of p.E) if (a !== b) { A[a][b] = 1; A[b][a] = 1; } return A; },
    deg(p) { const A = G.adj(p); return Array.from({ length: p.V }, (_, i) => A[i + 1].reduce((s, x) => s + x, 0)); },
    edges(p) { const A = G.adj(p); let c = 0; for (let i = 1; i <= p.V; i++) for (let j = i + 1; j <= p.V; j++) c += A[i][j]; return c; },
    dist(p) { const n = p.V, A = G.adj(p), D = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => i === j ? 0 : A[i][j] ? 1 : Infinity));
      for (let k = 1; k <= n; k++) for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) if (D[i][k] + D[k][j] < D[i][j]) D[i][j] = D[i][k] + D[k][j];
      return D; },
    comps(p) { const par = Array.from({ length: p.V + 1 }, (_, i) => i), f = x => par[x] === x ? x : (par[x] = f(par[x]));
      for (const [a, b] of p.E) par[f(a)] = f(b);
      const size = {}; for (let i = 1; i <= p.V; i++) { const r = f(i); size[r] = (size[r] || 0) + 1; }
      return Object.values(size); },
    sq(p) { const n = p.V, A = G.adj(p), M = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) for (let k = 1; k <= n; k++) M[i][j] += A[i][k] * A[k][j];
      return M; },
    /* ordered triples a,w,b with a-w and w-b tunnels and a,w,b all different */
    triples(p, filter) { const A = G.adj(p); let c = 0;
      for (let a = 1; a <= p.V; a++) for (let w = 1; w <= p.V; w++) for (let b = 1; b <= p.V; b++)
        if (A[a][w] && A[w][b] && a !== w && w !== b && a !== b && filter(a, b)) c++;
      return c; }
  };
  const circuitOK = p => { const d = G.deg(p); return d.every(x => x % 2 === 0); };
  const oddCount = p => G.deg(p).filter(x => x % 2).length;
  const pairsLen2 = (p, u, v) => G.sq(p)[u][v];

  Object.assign(window.ORACLE, {
    /* u, v are junction numbers */
    q06b: p => [pairsLen2(p, p.u, p.v), G.triples(p, (a, b) => b === p.v)],
    /* m = parcels one route carries per shift; s = number of shifts the order takes (the order is routes x m x s parcels) */
    q06c: p => { const r = pairsLen2(p, p.u, p.v); return [r, p.s]; },
    q06d: p => { const M = G.sq(p); let tot = 0; for (let j = 1; j <= p.V; j++) tot += M[p.u][j];
      return [M[p.u][p.v], tot, G.triples(p, a => a === p.u)]; },
    q07b: p => { const D = G.dist(p)[p.u]; let c = 0; for (let j = 1; j <= p.V; j++) if (D[j] === 2) c++; return [D[p.v], c]; },
    /* f = litres per road, x = litres left over */
    q07c: p => { const d = G.dist(p)[p.u][p.v]; return [d, 2 * d * p.f, p.x]; },
    q07d: p => { const D = G.dist(p)[p.u]; const far = Math.max(...D.slice(1)); return [D[p.v], far, D.slice(1).filter(x => x === far).length]; },
    q08b: p => { const c = G.comps(p); return [c.length, Math.max(...c)]; },
    /* m = tonnes of gravel per new road */
    q08c: p => { const c = G.comps(p).length; return [c, (c - 1) * p.m]; },
    q08d: p => { const c = G.comps(p).length; return [G.deg(p).filter(x => x === 0).length, c, c - 1]; },
    q09b: p => { const d = G.deg(p); return [Math.max(...d), oddCount(p), circuitOK(p) ? 1 : 0]; },
    /* m = km per road */
    q09c: p => [G.edges(p), oddCount(p), circuitOK(p) ? G.edges(p) * p.m : 0],
    q09d: p => { const A = G.adj(p), d = G.deg(p); const par = Array.from({ length: p.V + 1 }, (_, i) => i), f = x => par[x] === x ? x : (par[x] = f(par[x]));
      for (const [a, b] of p.E) par[f(a)] = f(b);
      const roots = new Set(); for (let i = 1; i <= p.V; i++) roots.add(f(i));
      let ok = 0; for (const r of roots) { let all = true; for (let i = 1; i <= p.V; i++) if (f(i) === r && d[i - 1] % 2) all = false; if (all) ok++; }
      return [roots.size, ok, d.filter(x => x % 2).length]; },
    q10b: p => { const o = oddCount(p); const odd = []; G.deg(p).forEach((x, i) => { if (x % 2) odd.push(i + 1); });
      return [o, o === 2 ? 1 : 0, o === 2 ? Math.max(...odd) : 0]; },
    /* f = litres per road, x = litres left at the end (the tank is roads x f + x) */
    q10c: p => { const o = oddCount(p); return [o, o === 2 ? 1 : 0, o === 2 ? p.x : 0]; },
    q10d: p => { const o = oddCount(p), A = G.adj(p), d = G.deg(p); let can = 0;
      for (let a = 1; a <= p.V; a++) for (let b = a + 1; b <= p.V; b++) if (!A[a][b]) {
        const e = d.slice(); e[a - 1]++; e[b - 1]++; if (e.every(x => x % 2 === 0)) can = 1; }
      return [o, o === 2 ? 1 : 0, can]; }
  });

})();
