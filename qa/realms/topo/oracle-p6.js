/* Independent oracles for Topology: shape without size practice missions, file 6 of 8: q26b–q30d (game/realms/topo/practice-6.js).
   One entry per practice mission: ORACLE.<id>(p) returns the answer list for the generator's parameters p, worked out
   from what the prompt states by a different method from build() (a table, a search, a numerical method, a solver).
   qa/generators.js loads this file after the whole pack and fails a practice mission that has no oracle here. */
(function(){ 'use strict';
/* Connected sum by the stated rule: χ(A # B) = χ(A) + χ(B) − 2. */
const csum = (a, b) => a + b - 2;
const TORUS = 0, PLANE = 1, SPHERE = 2;
/* χ of the sphere with n cross-caps, built one connected sum at a time. */
const crossChi = n => { let x = SPHERE; for (let i = 0; i < n; i++) x = csum(x, PLANE); return x; };
/* Smallest number of cross-caps whose χ is the target, found by joining one at a time. */
const crossFor = chi => { let n = 0, x = SPHERE; while (x > chi) { x = csum(x, PLANE); n++; } return n; };
/* Smallest genus whose χ is the target, found by joining one torus at a time. */
const genusFor = chi => { let n = 0, x = SPHERE; while (x > chi) { x = csum(x, TORUS); n++; } return n; };
/* Vertex classes of the polygon word w (items {L, e}), found by graph search: nodes are corners 0..n-1, edge i
   runs from corner i to corner i+1; a plain letter has tail at i and tip at i+1, ⁻¹ the other way. Two edges
   with one letter are sewn tail to tail and tip to tip. Count connected components by breadth-first search. */
const vertexClasses = w => {
  const n = w.length, adj = Array.from({ length: n }, () => []);
  const tail = i => w[i].e === 1 ? i : (i + 1) % n, tip = i => w[i].e === 1 ? (i + 1) % n : i;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (w[i].L === w[j].L) {
    adj[tail(i)].push(tail(j)); adj[tail(j)].push(tail(i));
    adj[tip(i)].push(tip(j)); adj[tip(j)].push(tip(i));
  }
  const seen = new Array(n).fill(false); let comps = 0;
  for (let s = 0; s < n; s++) {
    if (seen[s]) continue;
    comps++; const queue = [s]; seen[s] = true;
    while (queue.length) { const u = queue.shift(); for (const v of adj[u]) if (!seen[v]) { seen[v] = true; queue.push(v); } }
  }
  return comps;
};
/* Letter test as stated: orientable iff every letter has one plain and one ⁻¹ appearance (count the signs). */
const isOrientable = w => {
  const letters = [...new Set(w.map(x => x.L))];
  return letters.every(L => w.filter(x => x.L === L && x.e === 1).length === 1 && w.filter(x => x.L === L && x.e === -1).length === 1);
};
/* χ of the sewn panel: V − E + 1 with E the number of distinct letters. */
const panelChi = w => vertexClasses(w) - new Set(w.map(x => x.L)).size + 1;
/* Genus if orientable, cross-caps if not, found by searching on χ. */
const thirdOf = (chi, ori) => ori ? genusFor(chi) : crossFor(chi);
Object.assign(window.ORACLE, {
  /* j and k are counts: j is printed only through the label χ = 2 − j of model A (found by search); k cross-caps on B. */
  q26b: p => [crossFor(crossChi(p.j)), crossChi(p.k)],
  /* k0 is the hull's cross-caps now (printed as χ), a more are sewn in (end χ printed), r metres per cross-cap. */
  q26c: p => {
    const now = crossFor(crossChi(p.k0)), end = crossFor(crossChi(p.k0 + p.a));
    return [now, end - now, (end - now) * p.r];
  },
  /* a, b are cross-caps on A and B, c is χ of C; join A with B, then C. Result is not orientable. */
  q26d: p => {
    const ab = csum(crossChi(p.a), crossChi(p.b)), abc = csum(ab, p.c);
    return [ab, abc, crossFor(abc)];
  },
  /* h handles (tori) then c cross-caps on a sphere. */
  q27b: p => {
    let x = SPHERE;
    for (let i = 0; i < p.h; i++) x = csum(x, TORUS);
    for (let i = 0; i < p.c; i++) x = csum(x, PLANE);
    return [x, crossFor(x)];
  },
  /* t tori and p projective planes; the card prints χ of that sum (found by building it), and the number of
     planes is then recovered from the printed χ by searching, then m more planes are joined. */
  q27c: p => {
    let x = SPHERE;
    for (let i = 0; i < p.t; i++) x = csum(x, TORUS);
    for (let i = 0; i < p.p; i++) x = csum(x, PLANE);
    let q = 0, y = SPHERE; for (let i = 0; i < p.t; i++) y = csum(y, TORUS);
    while (y > x) { y = csum(y, PLANE); q++; }
    let z = x; for (let i = 0; i < p.m; i++) z = csum(z, PLANE);
    return [crossFor(x), q, z];
  },
  /* A is g tori on a sphere; B has χ = x (given); A # B not orientable. */
  q27d: p => {
    let a = SPHERE; for (let i = 0; i < p.g; i++) a = csum(a, TORUS);
    const j = csum(a, p.x);
    return [a, j, crossFor(j)];
  },
  /* Word w sewn, vertex classes found by search. */
  q28b: p => {
    const V = vertexClasses(p.w), chi = panelChi(p.w), ori = isOrientable(p.w);
    return [V, ori ? 1 : 0, thirdOf(chi, ori)];
  },
  /* r metres per ring, one ring for each handle (orientable) or cross-cap (not). */
  q28c: p => {
    const chi = panelChi(p.w), ori = isOrientable(p.w);
    return [ori ? 1 : 0, chi, thirdOf(chi, ori) * p.r];
  },
  q28d: p => {
    const V = vertexClasses(p.w), chi = panelChi(p.w), ori = isOrientable(p.w);
    return [V, ori ? 1 : 0, chi, thirdOf(chi, ori)];
  },
  /* Panel w, then t tori and q Klein bottles (both χ = 0) joined on; a Klein bottle makes the shell non-orientable. */
  q29b: p => {
    let chi = panelChi(p.w);
    for (let i = 0; i < p.t + p.q; i++) chi = csum(chi, 0);
    const ori = isOrientable(p.w) && p.q === 0;
    return [ori ? 1 : 0, chi, thirdOf(chi, ori)];
  },
  /* Two panels sewn separately, then joined; orientable only if both are. */
  q29c: p => {
    const m = panelChi(p.w1), n = panelChi(p.w2), j = csum(m, n);
    const ori = isOrientable(p.w1) && isOrientable(p.w2);
    return [m, n, thirdOf(j, ori)];
  },
  /* Panel w, then t tori (χ 0) and p projective planes (χ 1) joined on. */
  q29d: p => {
    let chi = panelChi(p.w);
    for (let i = 0; i < p.t; i++) chi = csum(chi, 0);
    for (let i = 0; i < p.p; i++) chi = csum(chi, 1);
    const ori = isOrientable(p.w) && p.p === 0;
    return [vertexClasses(p.w), chi, ori ? 1 : 0, thirdOf(chi, ori)];
  },
  /* K = 1 / r² on a sphere: radius by bisection on r² K = 1; later curvature 1 / s². */
  q30b: p => {
    let lo = 0, hi = 1e6;
    for (let i = 0; i < 300; i++) { const m = (lo + hi) / 2; if (m * m * p.K < 1) lo = m; else hi = m; }
    return [+((lo + hi) / 2).toFixed(9), +(1 / (p.s * p.s)).toFixed(9)];
  },
  /* Calibration radius by bisection; new radius f r; curvature 1 / (f r)². */
  q30c: p => {
    let lo = 0, hi = 1e6;
    for (let i = 0; i < 300; i++) { const m = (lo + hi) / 2; if (m * m * p.K < 1) lo = m; else hi = m; }
    const r = (lo + hi) / 2, R = r * p.f;
    return [+r.toFixed(9), +R.toFixed(9), +(1 / (R * R)).toFixed(9)];
  },
  /* Ball radius s cm: k = 1 / s² per cm², times 10000 per m². Tank: radius in metres by bisection, times 100. */
  q30d: p => {
    let lo = 0, hi = 1e6;
    for (let i = 0; i < 300; i++) { const m = (lo + hi) / 2; if (m * m * p.K < 1) lo = m; else hi = m; }
    const k = 1 / (p.s * p.s);
    return [+k.toFixed(9), +(k * 10000).toFixed(9), +(((lo + hi) / 2) * 100).toFixed(9)];
  }
});
})();
